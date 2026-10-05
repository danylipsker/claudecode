/* HYPER-ESP32 · content/cloud-and-data-management.js
 *
 * The topic "Cloud and data management": the shape of an IoT system, data formats, time series, dashboards, ESP RainMaker,
 * AWS IoT and Azure, the hobby clouds, databases, store and forward, device identity, shadows, rates and cost, privacy,
 * and running with no cloud at all. Simulations: sims/cloud-and-data-management.js (ids cd-*).
 */
Hyper.add(
/* ================================================================ iot-architecture */
{
  id: 'iot-architecture',
  parent: 'cloud-and-data-management',
  title: 'The shape of an IoT system',
  level: 1,
  short: 'From the sensor to the dashboard there is a chain of links: device, network, transport, ingest, storage, processing, presentation — and a return path for commands. Knowing the chain tells you what to build, what to leave out and what will fail first.',
  keywords: ['IoT', 'architecture', 'telemetry', 'gateway', 'broker', 'cloud', 'edge', 'dashboard', 'commands', 'downlink', 'ingest', 'end to end', 'data path'],
  prereq: ['wifi-station', 'mqtt', 'tcp-ip-on-a-microcontroller'],
  related: ['data-formats', 'local-first', 'esp-now-gateway', 'store-and-forward', 'device-identity-and-provisioning', 'choosing-a-long-range-link'],
  body: `A sensor in a garden is useful only when its number reaches someone. Between the chip and the person lies a chain, and nearly every IoT system, from a plant monitor to ten thousand electricity meters, is built from the same links. Knowing the links tells you which ones you need, which you can leave out, and which will fail first.

### The chain, link by link

1. **The device** reads the sensor and decides what to send: a measurement, a time and its own identity, encoded as bytes ([[data-formats]]).
2. **The local network** carries it to something that speaks IP: Wi-Fi to a router, Ethernet, or a radio such as Bluetooth LE, [[esp-now]], LoRa or Zigbee to a gateway.
3. **The transport** is the protocol: most often [[mqtt]] over TLS, or an HTTPS request ([[rest-apis-and-json]]).
4. **The ingest point**, a broker or an API, accepts messages from many devices and checks who sent them.
5. **Storage** keeps them: a time-series database, a file, a cloud table ([[time-series-data]]).
6. **Processing** reacts: a rule that raises an alert, a job that averages, a model.
7. **Presentation** shows the result: a dashboard or a phone app ([[dashboards]]).

A second path runs the other way. **Commands, settings and updates** go from the app down to the device, which may be asleep for 99 % of the day ([[device-shadows-and-twins]], [[ota-updates]]).

### Three shapes

| Shape | Path | Suits | Weak point |
|---|---|---|---|
| Direct to a cloud | ESP → Wi-Fi → internet → cloud broker | a few Wi-Fi devices; hobby clouds | needs the internet; you depend on one company's account |
| Through a gateway | ESP → ESP-NOW, BLE or LoRa → gateway → internet | battery nodes, places without Wi-Fi, many cheap nodes | the gateway is a single point of failure |
| Local first | ESP → Wi-Fi → a server at home | privacy, no subscription, works offline | you maintain the server ([[local-first]]) |

### Four kinds of message

**Telemetry** is the stream of measurements: small, frequent, and one lost reading rarely matters. **Events** ("the door opened") happen once and must not vanish. **Commands** ask the device to act now. **Configuration** says what the device should be like, and must survive the device being offline. Each wants a different promise from the transport: fire and forget for telemetry, at-least-once for events, a kept last value for configuration ([[mqtt-topics-qos-retain]]).

### What is cheap to decide early

A name and a credential **per device** ([[device-identity-and-provisioning]]); a **UTC timestamp made at the device**, not at arrival; a **version number** in the payload; what happens **when the link is down** ([[store-and-forward]]); who may read the data ([[privacy-and-data-protection]]). Adding these to ten thousand devices already in the field is the expensive way.

> [!key] An IoT system is a chain — device, network, transport, ingest, storage, processing, presentation — with a return path for commands. Decide early about identity, time, versions and the offline case; those are the choices that cannot be patched in later.`,
  ideas: [
    'Every IoT system is a chain of device, network, transport, ingest, storage, processing and presentation, with a return path for commands.',
    'Direct to a cloud, through a gateway and local first are the three common shapes; each puts the weak point somewhere else.',
    'Telemetry, events, commands and configuration are different kinds of message and need different delivery promises.',
    'Identity per device, a UTC timestamp made at the device, a payload version and an offline plan are cheap to design in and costly to retrofit.'
  ],
  pitfalls: [
    'The cloud is where the intelligence has to be — Much of it can sit at the device or a gateway. Averaging, thresholds and filtering there save battery and bandwidth, and a device that still works offline is more useful than one that does not.',
    'A timestamp added when the message arrives is good enough — Messages are delayed by sleep, buffering and outages. Only the device knows when the measurement was taken.',
    'One topic and one shared password for every device is simplest — It is, until one device is stolen. Per-device names and credentials let you cut off one device and tell which one sent what.'
  ],
  terms: [
    { term: 'Telemetry', also: ['sensor data', 'measurements'], def: 'The stream of measurements a device sends: temperatures, voltages, counts. It is frequent and small, and losing one reading seldom matters.' },
    { term: 'Broker', also: ['MQTT broker', 'message broker'], def: 'A server that receives messages from publishers and passes them to the subscribers who asked for that topic. Devices talk to the broker, not directly to each other or to the dashboard.' },
    { term: 'Gateway', also: ['edge gateway', 'bridge'], def: 'A device that joins two kinds of network: it receives data over ESP-NOW, Bluetooth LE, LoRa or Zigbee and forwards it over Wi-Fi or Ethernet to the internet.' },
    { term: 'Edge processing', also: ['edge computing'], def: 'Doing part of the work, such as filtering, averaging, thresholds or a small model, on the device or a nearby gateway instead of sending raw data to a remote server.' },
    { term: 'Downlink', also: ['command channel', 'cloud-to-device'], def: 'The path from the cloud to the device: commands, configuration and firmware updates. A device that sleeps can be reached only when it wakes and listens.' }
  ],
  choose: {
    good: ['Direct to a cloud: a handful of Wi-Fi devices where the internet is reliable', 'A gateway: many battery nodes, or nodes where there is no Wi-Fi', 'Local first: a house, a workshop, anything that must work with the internet down'],
    avoid: ['Direct to a cloud for a safety function that must keep working offline', 'A gateway for a single device: it adds a part and a failure for nothing', 'Local first when nobody can maintain the server'],
    check: ['What still works when the internet is down', 'Who owns the account and the data', 'How every device will be updated in five years']
  },
  code: [
    {
      title: 'Publish a measurement as JSON, with identity and time',
      about: 'The smallest complete device of an IoT chain: connect, set the clock, and every 30 seconds publish one reading as JSON on a topic named after the device. The message carries the device name, a UTC Unix timestamp and the value.',
      needs: 'Any Wi-Fi ESP board, and an MQTT broker you can reach (Mosquitto on a PC, or the broker of Home Assistant).',
      libs: ['PubSubClient', 'ArduinoJson'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]
          connect to MQTT broker [broker.example.com]

        every (30) seconds
          set [temp v] to (read temperature)
          set [message v] to (JSON text: id (esp32-demo), t (current time), temp (temp))
          publish (message) to topic [sensors/esp32-demo/telemetry]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <ArduinoJson.h>

        const char *DEVICE_ID = "esp32-demo";
        const char *TOPIC = "sensors/esp32-demo/telemetry";

        NetworkClient net;
        PubSubClient mqtt(net);

        float readTemperature() {
          return 21.5;                                 // stand-in: replace with your sensor
        }

        void ensureMqtt() {
          while (!mqtt.connected()) {
            if (!mqtt.connect(DEVICE_ID)) delay(2000); // the client id is the device's own name
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");            // offsets 0: the clock keeps UTC
          while (time(nullptr) < 1700000000) delay(200); // wait until the clock is set
          mqtt.setServer("broker.example.com", 1883);
          mqtt.setBufferSize(512);
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();
          static uint32_t last = 0;
          if (millis() - last >= 30000) {
            last = millis();
            JsonDocument doc;
            doc["id"] = DEVICE_ID;
            doc["t"] = (uint32_t)time(nullptr);        // Unix time in seconds, UTC
            doc["temp"] = readTemperature();
            char payload[128];
            size_t n = serializeJson(doc, payload, sizeof(payload));
            mqtt.publish(TOPIC, (const uint8_t *)payload, n);
          }
        }
      `,
      py: String.raw`
        import network, ntptime, time, json
        from umqtt.simple import MQTTClient

        DEVICE_ID = "esp32-demo"
        TOPIC = b"sensors/esp32-demo/telemetry"
        EPOCH_OFFSET = 946684800           # MicroPython counts from 2000, Unix time from 1970

        def read_temperature():
            return 21.5                    # stand-in: replace with your sensor

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)
        ntptime.settime()                  # the clock now holds UTC

        client = MQTTClient(DEVICE_ID, "broker.example.com", keepalive=60)
        client.connect()

        last = time.ticks_ms()
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 30000:
                last = time.ticks_ms()
                doc = {"id": DEVICE_ID, "t": time.time() + EPOCH_OFFSET, "temp": read_temperature()}
                client.publish(TOPIC, json.dumps(doc))
            time.sleep_ms(100)
      `,
      output: `
        sensors/esp32-demo/telemetry  {"id":"esp32-demo","t":1791115200,"temp":21.5}
      `,
      notes: ['Port 1883 is plain MQTT: fine on a home network, not across the internet. Add TLS ([[tls-on-esp]]) before the message leaves your building.', 'This sketch reconnects to the broker; the MicroPython version does not. Wrap the loop in try/except and connect again, or use umqtt.robust.', 'The topic carries the device name and the payload repeats it. That is deliberate: a bridge that stores messages in a database no longer needs the topic.']
    }
  ],
  quiz: [
    { q: 'A battery sensor stands in a field with no Wi-Fi; a house 300 m away has it. Which shape is the most natural?', choices: ['Direct to a cloud over Wi-Fi', 'Through a gateway, using a long-range radio such as LoRa', 'Local first with a faster chip', 'A bigger dashboard'], a: 1, why: 'The sensor cannot reach the router, so it sends over a radio that covers the distance to a gateway at the house, and the gateway forwards the data over the house network. A faster chip or a dashboard does not change the range.' },
    { q: 'Which of these messages must not be lost silently?', choices: ['A temperature reading sent every second', 'A smoke-alarm event', 'A signal-strength reading', 'A heartbeat every minute'], a: 1, why: 'A reading is replaced by the next one a second later. An event happens once; if it vanishes nobody ever learns that it happened. Events deserve acknowledgement and retries.' },
    { q: 'Stamping each reading with the time it reaches the cloud is as good as stamping it at the device.', a: false, why: 'Sleep, buffering and outages delay messages, sometimes by hours. Only the device knows when the measurement was taken, so it must make the timestamp.' },
    { q: 'A sensor samples at 100 Hz but you only need the minute-by-minute mean. Where should the averaging be done?', choices: ['On the device, before sending', 'In the dashboard', 'In the cloud database only', 'It makes no difference'], a: 0, why: 'Averaging at the edge sends one number a minute instead of 6000, which saves radio time (battery), traffic and storage. Keep raw data only if you will really use it.' }
  ],
  applications: [
    'A plant monitor that sends soil moisture to Home Assistant every ten minutes.',
    'A fleet of utility sub-meters reporting to one platform, each with its own identity.',
    'A workshop with a dozen temperature loggers feeding a Grafana dashboard.',
    'A remote pump controller that reports its state and accepts commands from a phone.'
  ],
  sources: [
    'OASIS, *MQTT Version 3.1.1* (standard, 2014): the publish/subscribe model and the delivery guarantees.',
    'IETF, RFC 7228, *Terminology for Constrained-Node Networks*: why IoT devices are built the way they are.',
    'Espressif, *ESP-IDF Programming Guide*, the protocol references (ESP-MQTT, ESP HTTP Client).'
  ],
  sim: 'cd-path'
},

/* ================================================================ data-formats */
{
  id: 'data-formats',
  parent: 'cloud-and-data-management',
  title: 'Data formats: JSON, CBOR, Protobuf, binary',
  level: 2,
  short: 'The same reading can be 57 bytes of text or 9 bytes of binary. JSON is readable and bulky, CBOR and Protocol Buffers are compact, and a packed struct is the smallest and the most fragile.',
  keywords: ['JSON', 'CBOR', 'MessagePack', 'Protocol Buffers', 'protobuf', 'nanopb', 'struct', 'endianness', 'payload', 'serialisation', 'serialization', 'encoding', 'binary', 'schema'],
  prereq: ['json-on-a-microcontroller', 'bits-and-bytes', 'rest-apis-and-json'],
  related: ['mqtt', 'lora-parameters', 'batching-rates-and-cost', 'structs-and-classes', 'esp-now'],
  body: `Every message must become bytes before it leaves the chip, and the way you choose is hard to change later, because devices already in the field keep sending the old form. Take one reading — a device name, a time, a temperature, a humidity — and look at four ways to send it.

### Four ways to write the same reading

| Format | What it is | This reading | Strength | Price |
|---|---|---|---|---|
| JSON | text with names | 57 bytes | readable by people and every tool; no schema needed | bulky: names repeat, numbers are digits |
| CBOR | JSON's data model in binary (RFC 8949) | 41 bytes | the same maps, lists and strings; self-describing; numbers are binary | unreadable without a tool; fewer libraries |
| Protocol Buffers | numbered fields described by a schema file | 28 bytes | compact; the schema documents the format and the rules for changing it | a compiler and generated code; not self-describing |
| Packed binary | a C struct sent as it lies in memory | 9 bytes | the smallest, the quickest to parse | fragile, see below |

The binary frame leaves out the device name, because the topic or radio address already carries it; with the name included it would be 19 bytes. MessagePack is a close cousin of CBOR.

### Why binary is fragile

A raw struct has no names, so the receiver must know the layout exactly, and three things break it silently. **Endianness**: every ESP32 stores the low byte of a number first, while network protocols traditionally send the high byte first. **Padding**: a compiler may leave gaps to align fields unless told to pack them. **Versions**: add a field and every old receiver misreads everything after it. The defences are a version byte at the front, fixed-size integers (\`uint16_t\`, never \`int\`), fixed-point numbers instead of floats (2150 for 21.50 °C), and a CRC at the end ([[bits-and-bytes]]).

### Does the size matter?

Less than people expect on Wi-Fi. A 57-byte payload on MQTT over TLS travels inside roughly 100 bytes of headers, so the 9-byte frame cuts the traffic by about a third, not by a factor of six. It matters when the **channel is tiny** (a LoRaWAN payload may be as small as 51 bytes — [[lora-parameters]]; an ESP-NOW frame holds 250 bytes, or 1470 in the newer version), when **messages are large** (a batch repeats the same names in every entry), or when you **pay by the byte** on a cellular link. Otherwise a message a person can read in the broker's log wins every debugging session.

A sensible path: **JSON** while you build; **CBOR** when size starts to matter and you want to keep the structure; **Protocol Buffers** for a large fleet with several receivers and a long life; **packed binary** only where every byte counts, and then with a version byte.

> [!key] JSON is readable and bulky; CBOR and Protocol Buffers are compact and keep a structure; a packed struct is smallest and breaks silently when layouts, byte order or versions differ. On Wi-Fi the saving is modest — choose compact formats for tiny channels, large batches and metered links.`,
  ideas: [
    'JSON is text: readable everywhere, but names and digits make it the bulkiest of the four.',
    'CBOR keeps JSON\'s structure in binary; Protocol Buffers trade self-description for a schema and a smaller message.',
    'A packed struct is smallest but silently breaks on byte order, padding or a changed layout; give it a version byte and a CRC.',
    'Headers of MQTT, TLS and TCP/IP weigh as much as a small payload, so the format matters most on tiny channels and for large batches.'
  ],
  pitfalls: [
    'Binary is always better than JSON — It is smaller, not better. A format nobody can read slows every debugging session, and a layout change can break every receiver at once.',
    'An ESP32 and the network use the same byte order, so I can send a number as it is — The ESP32 is little-endian and network protocols conventionally big-endian. Whichever you choose, write it down and convert on purpose.',
    'sizeof() of my struct is what I will send — A compiler may add padding. Declare the struct packed, or write each field into a buffer yourself.'
  ],
  terms: [
    { term: 'JSON', also: ['JavaScript Object Notation'], def: 'A text format of objects (name and value pairs), lists, strings, numbers and true, false and null. Every language reads it and people can read it too.' },
    { term: 'CBOR', also: ['Concise Binary Object Representation', 'RFC 8949'], def: 'A binary format with JSON\'s data model. It stores the same maps and lists but writes numbers and lengths in binary, so messages are shorter and still describe themselves.' },
    { term: 'Protocol Buffers', also: ['protobuf', 'nanopb'], def: 'Google\'s schema-based binary format: a .proto file names the fields and numbers them, and generated code encodes and decodes. nanopb is a small implementation for microcontrollers.' },
    { term: 'Endianness', also: ['byte order', 'little-endian', 'big-endian'], def: 'The order in which the bytes of a multi-byte number are stored or sent. Little-endian sends the low byte first (as the ESP32 does); big-endian sends the high byte first (network order).' },
    { term: 'Packed struct', also: ['packed frame', 'binary frame'], def: 'A C structure with no padding between its fields, so its memory layout is the same on every compiler and can be sent as it is, if the receiver knows the layout.' }
  ],
  choose: {
    good: ['JSON for anything a person or a standard tool will read: dashboards, brokers, REST', 'CBOR when size matters but the receiver still wants named fields', 'Protocol Buffers for a long-lived fleet with several teams reading the data', 'A packed frame with version byte and CRC for LoRa, ESP-NOW and other tiny channels'],
    avoid: ['Packed binary with no version byte: the first layout change breaks the fleet', 'JSON with very long names in a message every second on a metered link', 'Inventing your own text format: a standard one has libraries'],
    check: ['The largest payload your channel carries', 'Who else must read the data, and with what tools', 'What happens to a receiver that sees a newer or older layout']
  },
  code: [
    {
      title: 'The same reading as JSON and as a 9-byte frame',
      about: 'Builds one reading as JSON text and as a packed binary frame, and prints the size of each, with the frame in hexadecimal. The frame holds a version, the time, the temperature in hundredths of a degree and the humidity in hundredths of a percent.',
      needs: 'Any ESP board and the serial monitor at 115200 baud. No network is needed.',
      libs: ['ArduinoJson'],
      blocks: `
        when started
          start serial at (115200) baud
          set [t v] to (1791115200)
          set [text v] to (JSON text: id (esp32-demo), t (t), temp (21.5), hum (48.2))
          print (join [JSON bytes: ] (length of (text)))
          set [frame v] to (packed bytes: version (1), t (t), temp x100 (2150), hum x100 (4820))
          print (join [frame bytes: ] (length of (frame)))
      `,
      cpp: String.raw`
        #include <ArduinoJson.h>

        struct __attribute__((packed)) Frame {
          uint8_t  version;       // layout number: raise it whenever the struct changes
          uint32_t t;             // Unix time in seconds
          int16_t  tempCentiC;    // 21.50 degrees is stored as 2150
          uint16_t humCentiPct;   // 48.20 percent is stored as 4820
        };

        void setup() {
          Serial.begin(115200);
          delay(1000);
          const uint32_t t = 1791115200;
          const float temp = 21.5, hum = 48.2;

          JsonDocument doc;
          doc["id"] = "esp32-demo";
          doc["t"] = t;
          doc["temp"] = temp;
          doc["hum"] = hum;
          String text;
          serializeJson(doc, text);
          Serial.printf("JSON  %u bytes: %s\n", (unsigned)text.length(), text.c_str());

          Frame f = { 1, t, (int16_t)lroundf(temp * 100), (uint16_t)lroundf(hum * 100) };
          Serial.printf("frame %u bytes:", (unsigned)sizeof(f));
          const uint8_t *p = (const uint8_t *)&f;
          for (size_t i = 0; i < sizeof(f); i++) Serial.printf(" %02X", p[i]);
          Serial.println();
        }

        void loop() {}
      `,
      py: String.raw`
        import json, struct

        t = 1791115200
        temp, hum = 21.5, 48.2

        text = json.dumps({"id": "esp32-demo", "t": t, "temp": temp, "hum": hum})
        print("JSON  %d bytes: %s" % (len(text), text))

        # "<" means little-endian with no padding; B = 1 byte, I = 4, h = 2 (signed), H = 2
        frame = struct.pack("<BIhH", 1, t, round(temp * 100), round(hum * 100))
        print("frame %d bytes:" % len(frame), " ".join("%02X" % b for b in frame))
      `,
      output: `
        JSON  57 bytes: {"id":"esp32-demo","t":1791115200,"temp":21.5,"hum":48.2}
        frame 9 bytes: 01 C0 3F C2 6A 66 08 D4 12
      `,
      notes: ['Read the frame: 01 is the version, C0 3F C2 6A is the time with its low byte first, 66 08 is 2150, D4 12 is 4820.', 'A receiver that sees a version it does not know should drop the frame and count it, not guess.']
    }
  ],
  examples: [
    {
      title: 'What does one message cost on the wire?',
      q: 'A device publishes the 57-byte JSON reading to the topic `sensors/esp32-demo/telemetry` (28 characters) over MQTT and TLS on IPv4. Roughly how many bytes leave the device, and how many with the 9-byte frame?',
      steps: ['MQTT adds 2 bytes of fixed header and 2 bytes for the topic length, plus the 28 topic characters: 32 bytes.', 'TCP and IP add 20 + 20 = 40 bytes, and a TLS record adds roughly 25 bytes of header and authentication tag.', 'JSON: 57 + 32 + 40 + 25 is about 155 bytes. The frame: 9 + 32 + 40 + 25 is about 105 bytes.'],
      a: 'About 155 against 105 bytes: the frame is six times smaller as a payload, but only about a third smaller on the wire. (Link-layer headers and acknowledgements add more to both.)'
    }
  ],
  quiz: [
    { q: 'A fleet of 5,000 sensors will live ten years and be read by three different teams. Which approach deserves the most thought?', choices: ['Packed binary without a version byte', 'JSON without a version field', 'A schema-based or versioned format, so layouts can change safely', 'Whatever is shortest'], a: 2, why: 'Over ten years the data model will change. Without a version or a schema, every change risks breaking a receiver. The shortest format is the one that will hurt most when it has to grow.' },
    { q: 'An ESP32 and the network use the same byte order, so a `uint32_t` can be sent as it lies in memory.', a: false, why: 'The ESP32 is little-endian; network protocols traditionally use big-endian. Either order works if both ends agree, but it must be specified and, where they differ, converted.' },
    { q: 'Switching a 57-byte JSON payload to a 9-byte frame on MQTT over TLS shrinks the traffic to about…', choices: ['a sixth', 'two thirds', 'the same', 'a tenth'], a: 1, why: 'Headers of MQTT, TCP/IP and TLS are around 100 bytes whatever the payload is, so 155 bytes become about 105. The payload shrank sixfold; the traffic by a third.' },
    { q: 'For which sender does the choice of format matter most?', choices: ['A LoRa node sending every ten minutes', 'A mains-powered display on Wi-Fi', 'A device on Ethernet', 'A PC running a script'], a: 0, why: 'A LoRa packet is tiny and airtime is both limited and regulated, so every byte costs. On Wi-Fi or Ethernet a few dozen bytes are lost in the headers.' }
  ],
  applications: [
    'LoRaWAN and ESP-NOW sensor frames, where every byte counts and a version byte protects the future.',
    'MQTT telemetry in JSON that Node-RED, Home Assistant and Grafana read without conversion.',
    'Compact CBOR in constrained-device protocols such as CoAP and LwM2M.',
    'Firmware-to-gateway frames with a version byte and a CRC over a serial link.'
  ],
  sources: [
    'IETF, RFC 8259, *The JavaScript Object Notation (JSON) Data Interchange Format*.',
    'IETF, RFC 8949, *Concise Binary Object Representation (CBOR)*.',
    'Protocol Buffers documentation, *Encoding*: the wire format of fields, varints and strings.'
  ],
  sim: 'cd-payload'
},

/* ================================================================ time-series-data */
{
  id: 'time-series-data',
  parent: 'cloud-and-data-management',
  title: 'Time series and where to keep them',
  level: 2,
  short: 'A reading means little without its moment. A time series is a growing list of (time, value) pairs; keeping one well means a right clock in UTC, a sensible resolution, and a plan to summarise old data rather than hoard it.',
  keywords: ['time series', 'InfluxDB', 'TimescaleDB', 'Prometheus', 'SQLite', 'timestamp', 'UTC', 'retention', 'downsampling', 'rollup', 'cardinality', 'tags', 'fields', 'resolution', 'sampling interval'],
  prereq: ['logging-data', 'ntp-and-time', 'iot-architecture'],
  related: ['databases-from-a-device', 'dashboards', 'esp-as-a-data-logger', 'project-data-logger', 'flash-wear'],
  body: `A reading means little without its moment. Put the readings of one sensor in order of time and you have a **time series**: a long list of pairs, a time and a value, that grows only at one end. Almost everything an ESP32 reports — temperature, power, soil moisture, battery voltage — is one, and a database built for them behaves differently from the tables of an online shop.

### How they are used

You write once, in time order, and never edit. You ask questions about **ranges** ("the last 24 hours") and **aggregates** ("the mean per hour, the maximum per day"). Nobody looks up one reading by name. Specialised stores exploit that: they compress neighbouring values, index by time, and delete old data in bulk. InfluxDB and TimescaleDB (an extension of PostgreSQL) are common ones; Prometheus collects metrics by asking the device for them; a plain CSV file or an SQLite table is a perfectly good store for one sensor.

### Anatomy of a point

InfluxDB's model names three parts: a **measurement** ("weather"), **tags** that identify the source and are indexed (site=garden, device=esp32-demo), and **fields** that carry the values (temp=21.5, hum=48.2) — plus a **timestamp**. Tags are for a few repeated values; anything that changes with every reading belongs in a field. A tag with thousands of different values makes thousands of separate series and slows the database down: the **cardinality** trap.

### Time must be right

Store **UTC** and convert to local time only when drawing. Local time has a gap in spring and an hour that happens twice in autumn, so a series kept in it has holes and duplicates. Use Unix seconds, or ISO 8601 with a Z (2026-10-04T12:00:00Z). The ESP32 has no clock battery: set it from NTP at every start ([[ntp-and-time]]) and again from time to time, because its own timer drifts. A device that has not yet set its clock must not invent a time: send nothing, or mark the reading "time unknown".

### Resolution, retention and downsampling

A reading every 10 seconds is 8,640 points a day, about 3.2 million a year; at roughly 16 bytes a point, an order of magnitude before compression, that is 50 MB a year per series. Small for one sensor, large for ten thousand. The usual answer keeps **detail for a short time and summaries for ever**: raw data for 30 days, then one mean, minimum and maximum per hour. The rule that deletes the raw data is the **retention policy**; the summarising is **downsampling**. Keep the minimum and maximum as well as the mean, or the spikes that matter vanish. The simulation lets you see it.

### Gaps are information

A missing reading is not zero. Draw a gap as a gap, and have the device number its messages so that the receiver can tell "nothing happened" from "something was lost" ([[store-and-forward]]).

> [!key] A time series is an append-only list of (time, value) pairs, stored in UTC and queried by range and aggregate. Choose the resolution deliberately, keep minimum and maximum when you summarise, and let a retention rule delete the raw detail.`,
  ideas: [
    'A time series is written in time order and read by range and aggregate, so stores built for it compress and expire data in bulk.',
    'Store UTC; convert to local time only when drawing, because local time has gaps and repeats.',
    'Tags identify a few repeated sources; values that change with every reading belong in fields, or the number of series explodes.',
    'Keep fine detail briefly and summaries (mean, minimum, maximum) for long, with a retention rule that does the deleting.'
  ],
  pitfalls: [
    'A reading that did not arrive is zero — A missing reading is unknown. Showing it as zero draws a false dip and corrupts averages. Leave a gap.',
    'The more often I sample, the better my data — Sampling faster than the thing changes only fills the disk. Match the interval to how quickly the quantity moves and to what you will ask of it.',
    'Averages are enough when I summarise — An hourly mean hides a ten-minute spike. Keep the minimum and maximum too.'
  ],
  terms: [
    { term: 'Time series', also: ['time-series data'], def: 'A sequence of values of one quantity, each with the time it was measured, in time order. A sensor\'s readings over a year are a time series.' },
    { term: 'Downsampling', also: ['rollup', 'aggregation'], def: 'Replacing many fine readings by one summary per longer interval, such as the mean, minimum and maximum per hour, to keep long histories small.' },
    { term: 'Retention policy', also: ['retention', 'data expiry'], def: 'A rule that says how long data is kept and then deletes it, often with a shorter period for raw readings than for their summaries.' },
    { term: 'Cardinality', also: ['series cardinality'], def: 'The number of distinct series a database holds. Tags with many different values multiply it and slow the database down.' },
    { term: 'Unix time', also: ['epoch time', 'POSIX time'], def: 'The number of seconds since 1 January 1970 UTC, ignoring leap seconds. It is a single number, has no time zone, and is the usual timestamp of a reading.' }
  ],
  choose: {
    good: ['A time-series database when you keep many series and ask for ranges and averages', 'A CSV file or SQLite for one logger and a spreadsheet', 'UTC Unix seconds or ISO 8601 with Z as the timestamp'],
    avoid: ['Local time as a stored timestamp', 'A tag whose value differs for every reading', 'Keeping raw one-second data for years "in case"'],
    check: ['How many series, how often, for how long: multiply them', 'Whether the device sets its clock before its first reading', 'Whether summaries keep the minimum and maximum']
  },
  code: [
    {
      title: 'Stamp every reading in UTC and number it',
      about: 'Sets the clock from NTP and prints one CSV line every 10 seconds: an ISO 8601 UTC timestamp, a sequence number and the value. Until the clock is set it prints a warning instead of inventing a time.',
      needs: 'Any Wi-Fi ESP board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]
          set [seq v] to (0)

        every (10) seconds
          if <(current time) < (1700000000)> then
            print [clock not set yet: no reading sent]
          else
            change [seq v] by (1)
            print (join (current time as ISO 8601 UTC) [,] (seq) [,] (read temperature))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>

        uint32_t seq = 0;

        float readTemperature() {
          return 21.5;                       // stand-in: replace with your sensor
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");  // offsets 0: the clock keeps UTC
        }

        void loop() {
          time_t now = time(nullptr);
          if (now < 1700000000) {            // before late 2023: the clock is not set yet
            Serial.println("clock not set yet: no reading sent");
          } else {
            struct tm t;
            gmtime_r(&now, &t);              // broken-down UTC time
            char stamp[24];
            strftime(stamp, sizeof(stamp), "%Y-%m-%dT%H:%M:%SZ", &t);
            Serial.printf("%s,%lu,%.1f\n", stamp, (unsigned long)++seq, readTemperature());
          }
          delay(10000);
        }
      `,
      py: String.raw`
        import network, ntptime, time

        seq = 0

        def read_temperature():
            return 21.5                      # stand-in: replace with your sensor

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)
        ntptime.settime()                    # the clock now holds UTC

        while True:
            y, mo, d, h, mi, s = time.gmtime()[:6]
            if y < 2024:
                print("clock not set yet: no reading sent")
            else:
                seq += 1
                print("%04d-%02d-%02dT%02d:%02d:%02dZ,%d,%.1f" % (y, mo, d, h, mi, s, seq, read_temperature()))
            time.sleep(10)
      `,
      output: `
        2026-10-04T12:00:00Z,1,21.5
        2026-10-04T12:00:10Z,2,21.5
        2026-10-04T12:00:20Z,3,21.5
      `,
      notes: ['The sequence number restarts at 1 after every reset. A drop back to 1 shows a restart; a jump of more than one shows lost readings.', 'In MicroPython the clock counts from the year 2000; gmtime() already gives the right calendar date, but time.time() is not a Unix timestamp.']
    }
  ],
  formulas: [
    {
      name: 'Storage for one series',
      expr: 'S = Y*r/(T*1000000)',
      tex: 'S = \\frac{Y\\,r}{T \\cdot 10^{6}}',
      vars: {
        S: { name: 'storage per year', unit: 'MB' },
        Y: { name: 'one year', q: 'time', unit: 's', value: 31557600, fixed: true },
        r: { name: 'bytes per point', unit: 'B', value: 16 },
        T: { name: 'sampling interval', q: 'time', unit: 's', value: 10 }
      },
      solveFor: 'S',
      note: 'Before compression, which often shrinks time-series data several times. Multiply by the number of series.',
      stories: { S: 'A sensor is sampled every {T} and each point takes {r}. How many megabytes does one year of one series take?' }
    }
  ],
  examples: [
    {
      title: 'A year of a greenhouse',
      q: 'Twenty sensors each report temperature and humidity every minute as one point of 16 bytes (two fields). How much raw data is that in a year, and how much if after 30 days only hourly mean, minimum and maximum are kept?',
      steps: ['One series gives 525,960 points a year, about 8.4 MB at 16 bytes. Twenty series: about 168 MB raw.', 'Keeping 30 days raw is 20 × 43,200 points × 16 bytes, about 14 MB.', 'Hourly summaries of three values for the other 335 days: 20 × 335 × 24 × 3 values, about 482,000 values; at 8 bytes each, about 3.9 MB.'],
      a: 'About 18 MB instead of 168 MB, a tenth, and every spike is still visible through the hourly maximum.'
    }
  ],
  quiz: [
    { q: 'A sensor is sampled every 10 seconds and each point takes about 16 bytes. How much does one year of one series take, before compression?', choices: ['About 5 MB', 'About 50 MB', 'About 500 MB', 'About 5 GB'], a: 1, why: 'A year holds 3,155,760 ten-second intervals, so 3,155,760 points. At 16 bytes each that is about 50 MB.' },
    { q: 'Why store timestamps in UTC rather than local time?', choices: ['UTC is shorter to write', 'Local time has a missing hour in spring and a repeated hour in autumn', 'The ESP32 cannot keep local time', 'Databases refuse local time'], a: 1, why: 'Where daylight saving time exists, a local clock skips an hour once a year and repeats one another time. A stored local series then has holes and ambiguous duplicates. Convert at display time.' },
    { q: 'A tag that takes a different value for every reading, such as the exact temperature, is a good use of tags.', a: false, why: 'Tags are indexed identifiers with few values. A value that changes constantly makes one series per reading (huge cardinality) and slows the database. Put it in a field.' },
    { q: 'You keep only the hourly mean of a temperature. Which event might you miss?', choices: ['A slow seasonal change', 'A ten-minute spike to 60 °C', 'The daily cycle', 'Nothing'], a: 1, why: 'A short spike barely moves an hourly mean. Keeping the hourly maximum and minimum preserves it.' }
  ],
  applications: [
    'A weather station that keeps a year of one-minute readings and a decade of daily summaries.',
    'An energy monitor whose raw 10-second power data is thinned to hourly values after a month.',
    'A greenhouse logger stored in InfluxDB and drawn by Grafana.',
    'A battery-voltage log that reveals, months later, when a cell began to fail.'
  ],
  sources: [
    'InfluxData, *InfluxDB documentation*: the line protocol, tags and fields, retention policies.',
    'ISO 8601 (date and time format) and IETF RFC 3339, *Date and Time on the Internet: Timestamps*.',
    'Espressif, *ESP-IDF Programming Guide*, "System Time" (SNTP and time zones).'
  ],
  sim: 'cd-series'
},

/* ================================================================ dashboards */
{
  id: 'dashboards',
  parent: 'cloud-and-data-management',
  title: 'Dashboards: Grafana, Node-RED, Home Assistant',
  level: 1,
  short: 'A dashboard turns a stream of numbers into a picture you can read at a glance. Good ones answer one question, show how old the data is, and tell you when something is wrong instead of waiting to be looked at.',
  keywords: ['dashboard', 'Grafana', 'Node-RED', 'Home Assistant', 'ThingsBoard', 'gauge', 'panel', 'widget', 'alert', 'MQTT discovery', 'visualisation', 'stale data', 'stat'],
  prereq: ['iot-architecture', 'mqtt', 'time-series-data'],
  related: ['home-assistant-integration', 'esphome', 'presenting-live-data', 'hmi-design-rules', 'webhooks-and-notifications', 'on-off-control-and-hysteresis'],
  body: `A dashboard turns a stream of numbers into a picture a person can read at a glance. A good one answers a single question — is the greenhouse warm enough, how much power is the house using, which sensor has gone quiet — and is calm the rest of the time. A bad one shows thirty gauges that nobody reads.

### The usual tools

| Tool | What it is | Typical fit |
|---|---|---|
| Home Assistant | a home-automation hub with history graphs, an energy view and a phone app | a house; ESP boards appear as devices through ESPHome or MQTT |
| Grafana | open-source dashboards over many data sources (InfluxDB, Prometheus, SQL) with alert rules | many series, long history, a team |
| Node-RED | visual flows that wire MQTT, HTTP and databases together, with a dashboard add-on | quick glue and small control panels |
| ThingsBoard | an open-source IoT platform: device management, rules and dashboards in one | fleets of mixed devices |
| The maker clouds | the dashboards of Arduino Cloud, Blynk, Adafruit IO, ThingSpeak | a first project, a phone widget |

They differ in where the data lives. Grafana draws only what a database holds; Home Assistant keeps its own history; the maker clouds do both inside their account ([[arduino-cloud-blynk-and-friends]]).

### What a dashboard is made of

A **stat** (the current value, with its unit and its age), a **gauge or bar** against a range, a **graph** over time, a **state** (on, off, offline), and an **alert** that reaches you instead of waiting for your eyes. Most of the skill is leaving things out: each tile should serve a decision.

### Rules that save you

- **Show the age of the data.** A large "21.5 °C" that stopped updating at midnight is a lie. Grey it out or write "3 h ago" once the data is older than a few reporting intervals.
- **Units and ranges, always.** Fix the axis when the eye must compare one day with another.
- **Colour plus words.** About one man in twelve has trouble with red and green; add the word "high" or an icon.
- **Alert on a condition, not a reading.** "Above 30 °C for ten minutes, cleared below 28" gives few false alarms; "any reading above 30" rings at every glitch ([[on-off-control-and-hysteresis]]).
- **Match the refresh to the data.** A graph that redraws every second from a sensor read once a minute is theatre.
- **Do not publish it.** A dashboard on the open internet without a login shows when you are away. Reach it over a VPN ([[local-first]]).

### Feeding Home Assistant

The easy bridge from an ESP to Home Assistant is **MQTT discovery**: the device publishes one small retained message that describes each sensor, and the entity appears with no setup on the server. The program below does exactly that. [[esphome]] goes further and writes the whole device for you.

> [!key] A dashboard shows few things that serve a decision, each with its unit and its age, and alerts on conditions rather than readings. Pick the tool by where your data lives: Grafana draws a database, Home Assistant keeps a home, Node-RED wires things, the maker clouds do it all in their account.`,
  ideas: [
    'A dashboard should serve a decision: few tiles, each with a unit, a range and an age.',
    'The data\'s age must be visible; a stale number drawn like a fresh one is a lie.',
    'Alerts should fire on a condition (above a limit for some minutes, with hysteresis), not on a single reading.',
    'MQTT discovery lets a device announce its own sensors to Home Assistant by publishing one retained message.'
  ],
  pitfalls: [
    'More tiles make a better dashboard — Each extra tile dilutes the ones that matter. Start from the question the dashboard answers and delete what does not serve it.',
    'The last value is the current value — If the device has gone quiet the last value is history. Show its age or grey it out after a few missed reports.',
    'A long secret URL makes a dashboard safe to put on the internet — URLs leak in logs, screenshots and browser histories. Use a login, or keep it behind a VPN.'
  ],
  terms: [
    { term: 'Dashboard', also: ['panel', 'widget', 'tile'], def: 'A page of tiles, each drawing one value or one series as a number, gauge, graph or state, usually updating by itself.' },
    { term: 'Data source', also: ['datasource'], def: 'The database or service a dashboard tool reads its numbers from, such as InfluxDB, Prometheus or an MQTT topic.' },
    { term: 'Alert rule', also: ['alarm', 'threshold alert'], def: 'A condition checked continuously, such as "above 30 degrees for ten minutes", that sends a message or switches something when it becomes true.' },
    { term: 'MQTT discovery', also: ['Home Assistant discovery'], def: 'A convention of Home Assistant: a device publishes a retained configuration message under a fixed topic prefix, and the hub creates the matching entity automatically.' },
    { term: 'Stale data', also: ['staleness'], def: 'A value that has not been refreshed for longer than expected, so the dashboard is showing the past as if it were the present.' }
  ],
  choose: {
    good: ['Home Assistant for a house with ESP devices, history and phone notifications', 'Grafana for many series, long history and shared dashboards', 'Node-RED for quick wiring and small panels', 'A maker cloud for the first project'],
    avoid: ['Tiles that nobody acts on', 'A public dashboard without a login', 'Alerts on single readings'],
    check: ['Where the history is kept and for how long', 'How the dashboard marks data that has stopped arriving', 'Who can see it, and from where']
  },
  code: [
    {
      title: 'Announce a sensor to Home Assistant by MQTT discovery',
      about: 'Publishes one retained message that describes a temperature sensor, then sends its readings as small JSON messages. Home Assistant (with its MQTT integration and a broker) creates the entity by itself and draws its history.',
      needs: 'An ESP board with Wi-Fi, and Home Assistant with the MQTT integration and a broker (the Mosquitto add-on, for example).',
      libs: ['PubSubClient'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [192.168.1.10]
          publish (the sensor description as JSON) to topic [homeassistant/sensor/esp32demo/temperature/config] retained

        every (30) seconds
          publish (JSON text: temp (21.5)) to topic [sensors/esp32demo/state]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const char *CONFIG_TOPIC = "homeassistant/sensor/esp32demo/temperature/config";
        const char *STATE_TOPIC = "sensors/esp32demo/state";

        const char *CONFIG = R"json({
          "name": "Temperature",
          "unique_id": "esp32demo_temperature",
          "device_class": "temperature",
          "unit_of_measurement": "°C",
          "state_topic": "sensors/esp32demo/state",
          "value_template": "{{ value_json.temp }}",
          "device": { "identifiers": ["esp32demo"], "name": "ESP32 demo", "manufacturer": "DIY", "model": "ESP32 sensor" }
        })json";

        NetworkClient net;
        PubSubClient mqtt(net);

        void ensureMqtt() {
          while (!mqtt.connected()) {
            if (mqtt.connect("esp32demo", "mqtt-user", "mqtt-password")) {
              mqtt.publish(CONFIG_TOPIC, CONFIG, true);   // retained: Home Assistant learns of it even if it starts later
            } else {
              delay(2000);
            }
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer("192.168.1.10", 1883);          // the address of your broker
          mqtt.setBufferSize(768);                       // the announcement is longer than the default 256 bytes
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();
          static uint32_t last = 0;
          if (millis() - last >= 30000) {
            last = millis();
            char payload[32];
            snprintf(payload, sizeof(payload), "{\"temp\":%.1f}", 21.5);   // stand-in reading
            mqtt.publish(STATE_TOPIC, payload);
          }
        }
      `,
      py: String.raw`
        import network, time, json
        from umqtt.simple import MQTTClient

        CONFIG_TOPIC = b"homeassistant/sensor/esp32demo/temperature/config"
        STATE_TOPIC = b"sensors/esp32demo/state"

        CONFIG = {
            "name": "Temperature",
            "unique_id": "esp32demo_temperature",
            "device_class": "temperature",
            "unit_of_measurement": "°C",
            "state_topic": "sensors/esp32demo/state",
            "value_template": "{{ value_json.temp }}",
            "device": {"identifiers": ["esp32demo"], "name": "ESP32 demo", "manufacturer": "DIY", "model": "ESP32 sensor"},
        }

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)

        client = MQTTClient("esp32demo", "192.168.1.10", user="mqtt-user", password="mqtt-password", keepalive=60)
        client.connect()
        client.publish(CONFIG_TOPIC, json.dumps(CONFIG), retain=True)   # retained: the hub learns of it even if it starts later

        while True:
            client.publish(STATE_TOPIC, json.dumps({"temp": 21.5}))      # stand-in reading
            time.sleep(30)
      `,
      output: `
        homeassistant/sensor/esp32demo/temperature/config   (retained)   {"name":"Temperature", …}
        sensors/esp32demo/state                                          {"temp":21.5}
      `,
      notes: ['The topic prefix "homeassistant" is Home Assistant\'s default; check the MQTT integration\'s settings if yours differs, and its documentation for the fields your version accepts.', 'To remove the entity again, publish an empty retained message to the same configuration topic.', 'The user name and password belong to the broker, not to Home Assistant. Do not leave them in shared code ([[credentials-handling]]).']
    }
  ],
  quiz: [
    { q: 'A dashboard shows 21.5 °C in big digits. The sensor lost power at midnight and it is now noon. What should the dashboard show?', choices: ['21.5 °C: it was the last known value', 'The value greyed out, with its age ("12 h ago")', '0 °C', 'Nothing: the tile is removed'], a: 1, why: 'The last value is true history but not the present. Showing its age (or greying it out) tells the viewer to distrust it. Zero would be a lie and removing the tile hides the fault.' },
    { q: 'Which tool draws data that it does not store itself?', choices: ['Grafana', 'Home Assistant\'s history', 'Blynk', 'ThingSpeak'], a: 0, why: 'Grafana is a viewer: it reads from data sources such as InfluxDB or Prometheus. The others keep their own history.' },
    { q: 'A dashboard on the open internet is safe as long as its address is long and secret.', a: false, why: 'Addresses appear in logs, browser histories and screenshots and can be scanned for. Protect it with a login or keep it behind a VPN.' },
    { q: 'Which alert rule gives the fewest false alarms for "too hot"?', choices: ['Any single reading above 30 °C', 'Above 30 °C for ten minutes, cleared below 28 °C', 'Every minute while above 30 °C', 'Only when the sensor is read twice'], a: 1, why: 'A delay ignores glitches and a lower clearing level (hysteresis) stops the alert from flapping on and off around the limit.' }
  ],
  applications: [
    'The energy and temperature views of a Home Assistant installation fed by ESPHome and MQTT devices.',
    'A Grafana wall of a workshop: power, temperatures and machine states from InfluxDB.',
    'A Node-RED panel with a switch and a gauge for a pump house.',
    'A ThingsBoard dashboard per customer for a fleet of remote loggers.'
  ],
  sources: [
    'Grafana Labs, *Grafana documentation*: dashboards, panels and alerting.',
    'Home Assistant documentation, the *MQTT* integration and MQTT discovery.',
    'Node-RED documentation, *Getting Started*, and the documentation of its dashboard add-on.'
  ],
  sim: 'cd-dashboard'
},

/* ================================================================ esp-rainmaker */
{
  id: 'esp-rainmaker',
  parent: 'cloud-and-data-management',
  title: 'ESP RainMaker',
  level: 2,
  short: 'Espressif\'s own IoT platform: a cloud service, phone apps and device firmware designed together, so a lamp or a switch can be provisioned, controlled, scheduled and updated with little server work of your own.',
  keywords: ['ESP RainMaker', 'RainMaker', 'Espressif cloud', 'node', 'claiming', 'provisioning', 'schedules', 'phone app', 'voice assistant', 'local control', 'parameters', 'RMaker'],
  prereq: ['iot-architecture', 'wifi-provisioning', 'mqtt'],
  related: ['device-shadows-and-twins', 'device-identity-and-provisioning', 'secure-provisioning', 'ota-updates', 'matter', 'aws-iot-and-azure'],
  body: `ESP RainMaker is Espressif's own IoT platform: a cloud service, phone apps and device firmware designed together, so that a smart lamp or switch built on an ESP32 can be provisioned, controlled from a phone, scheduled and updated over the air with little server work of your own. It is the shortest road from "it works on my desk" to "the customer can use it", if you are content to live inside its model.

### The model: nodes, devices, parameters

A **node** is one ESP chip running the RainMaker firmware. A node carries one or more **devices**, and each device has **parameters**. A lamp is a node with a lightbulb device whose parameters are power (on or off), brightness (0 to 100) and colour. A parameter has a type, a range and a flag that says who may change it. The app draws the right controls from that description, so you write no app. It is the shadow idea of [[device-shadows-and-twins]] with a ready-made front end: the app sets a parameter, the cloud keeps the wish, the node applies it and reports back.

### What you get

- **Provisioning** from the phone over Bluetooth LE or a temporary Wi-Fi access point, protected by a proof-of-possession code ([[wifi-provisioning]], [[secure-provisioning]]).
- **Claiming**: the node obtains its own certificate from the service, so every node has an identity of its own ([[device-identity-and-provisioning]]).
- **Apps and tools**: iOS and Android apps, a web interface and a command-line tool. The apps' sources are published, so a product can carry its own brand.
- **Schedules, scenes, groups, sharing with other users, local control** on the same network, time-zone handling and **over-the-air updates** ([[ota-updates]]).
- **Voice assistants**: integrations with the common assistants are offered by the service.

### Under the bonnet

The node speaks MQTT over TLS to a cloud that Espressif runs on Amazon's infrastructure; the node's own side is open source. For a product, a deployment in the company's own cloud account is offered as well, so that data and brand stay with the company (the terms are Espressif's to state). The public service has a free tier with limits, as is usual.

### Where it fits, where it does not

It fits "a few switchable things and a few readings", above all for a product with consumers. It fits poorly for fast telemetry with years of history (it is not a time-series database, see [[time-series-data]]), for data that must never leave your building ([[local-first]]), and for anything that is not an Espressif chip. In Arduino there is a RainMaker library, but the framework's home is ESP-IDF; as of October 2026 check which core release supports it, because the library was missing from the first test builds of core 4.0.

> [!key] RainMaker describes a device as a node with parameters; the service, apps, provisioning, schedules and updates come with it. It is quick and well matched for switches and lamps, and the price is living inside Espressif's model and ecosystem.`,
  ideas: [
    'A RainMaker node holds devices, and a device holds parameters; the app builds its controls from that description.',
    'Claiming gives each node its own certificate, so every node has its own identity.',
    'Provisioning, schedules, sharing, local control and over-the-air updates come with the service.',
    'It suits switches, lamps and small sensors; it is not a time-series store and it is tied to Espressif chips.'
  ],
  pitfalls: [
    'I have to write a phone app to use it — The standard apps draw the controls from the node\'s own description. You write an app only for a custom look, and the apps\' sources are available for that.',
    'It works only through the cloud — It offers local control on the same network, so a switch can still answer the phone with the internet down.',
    'It is a general data platform — It is built for controlling devices and showing their current state. Long histories and heavy analysis belong in a database ([[time-series-data]]).'
  ],
  terms: [
    { term: 'ESP RainMaker', also: ['RainMaker'], def: 'Espressif\'s IoT platform: device firmware, a cloud service and phone apps that provision, control, schedule and update ESP-based devices.' },
    { term: 'Node', also: ['RainMaker node'], def: 'One ESP chip running the RainMaker firmware. A node carries one or more devices, each with parameters.' },
    { term: 'Parameter', also: ['param'], def: 'A named value of a device with a type and limits, such as power or brightness. The app shows it as a switch or a slider and the cloud keeps its desired and reported values.' },
    { term: 'Claiming', also: ['node claiming'], def: 'The step in which a new node obtains its own certificate from the service, giving it an identity of its own before it first connects.' },
    { term: 'Proof of possession', also: ['PoP'], def: 'A short code, printed on the device or in a QR code, that the phone must enter during provisioning to show that the user is holding the device.' }
  ],
  choose: {
    good: ['A switch, lamp, plug or fan sold or given to non-technical users', 'A quick prototype that needs a phone app, schedules and updates this week', 'A product that will use Espressif chips in any case'],
    avoid: ['Fast telemetry with long history and heavy analysis', 'Data that must stay inside your own network', 'A mixed fleet that includes chips from other makers'],
    check: ['The current terms and the limits of the public service', 'Whether your Arduino core release supports it, or whether you will use ESP-IDF', 'How much of the app you need to brand']
  },
  quiz: [
    { q: 'In RainMaker\'s model, how is a lamp with an on/off switch and a brightness slider described?', choices: ['Two nodes', 'One node with a device that has two parameters', 'One parameter with two devices', 'Two certificates'], a: 1, why: 'The chip is the node; the lamp is a device of that node; power and brightness are its parameters. The app builds a switch and a slider from them.' },
    { q: 'What does claiming give a node?', choices: ['Its own certificate and identity from the service', 'A copy of the fleet\'s shared password', 'A Wi-Fi password', 'A free phone app'], a: 0, why: 'Claiming issues the node an individual certificate, so that it connects with credentials that belong to it alone and can be cut off alone.' },
    { q: 'You must write your own phone app to control a RainMaker node.', a: false, why: 'The standard apps show a node\'s controls from its description. A custom app is optional, for branding or a special interface.' },
    { q: 'Which project is a poor fit for RainMaker?', choices: ['A smart plug', 'A table lamp with a schedule', 'A logger sending 50 readings a second with years of history', 'A fan with three speeds'], a: 2, why: 'RainMaker shows and controls the current state of devices. A high-rate logger with long history needs a time-series database.' }
  ],
  applications: [
    'Consumer smart plugs, lamps and fans that ship with a provisioning QR code.',
    'A prototype of a smart switch built in a week with ready-made apps and schedules.',
    'A small product line that wants over-the-air updates without running a server.',
    'Teaching: a first cloud-connected device without writing server code.'
  ],
  sources: [
    'Espressif, *ESP RainMaker documentation*: the node, device and parameter model, claiming and provisioning.',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Provisioning" (the provisioning schemes RainMaker uses).',
    'Arduino-ESP32 documentation, *RainMaker* library page (supported cores and chips: check the current page).'
  ],
  sim: { id: 'cd-shadow', params: { flavour: 'rainmaker' } }
},

/* ================================================================ aws-iot-and-azure */
{
  id: 'aws-iot-and-azure',
  parent: 'cloud-and-data-management',
  title: 'AWS IoT and Azure IoT',
  level: 3,
  short: 'The big clouds sell IoT as managed services: a broker for millions of devices, a certificate for each, a stored state per device and rules that route messages onwards. They ask for setup and give security and scale.',
  keywords: ['AWS IoT Core', 'Azure IoT Hub', 'device shadow', 'device twin', 'X.509', 'mutual TLS', 'policy', 'rules engine', 'SAS token', 'fleet provisioning', 'DPS', 'thing', 'port 8883', 'Google IoT Core'],
  prereq: ['mqtt', 'mutual-tls', 'certificates-and-root-cas', 'iot-architecture'],
  related: ['device-identity-and-provisioning', 'device-shadows-and-twins', 'batching-rates-and-cost', 'ntp-and-time', 'efuse-keys-and-key-storage'],
  body: `AWS IoT Core and Azure IoT Hub are the public clouds' answer to "ten thousand devices, each with an identity of its own": a managed broker, an identity and permission system, a stored state per device, and rules that route messages onwards into storage and analytics. They ask for more setup than a hobby cloud and give security and scale in return. (Google's IoT Core was shut down in 2023: a vendor's service can disappear, see [[local-first]].)

### The same four steps in both

1. **Register** the device: a *thing* in AWS, a device identity in Azure.
2. **Give it a credential**: normally an X.509 certificate and private key, used for a TLS connection that both sides authenticate ([[mutual-tls]]).
3. **Say what it may do.** AWS attaches an *IoT policy* to the certificate; Azure ties the identity to one hub.
4. **Connect with MQTT** (port 8883) and publish; the service routes the messages onwards.

| | AWS IoT Core | Azure IoT Hub |
|---|---|---|
| Device protocols | MQTT 3.1.1 and 5, HTTPS, MQTT over WebSocket | MQTT 3.1.1 (partial), AMQP, HTTPS |
| Credential | X.509 certificate | X.509 certificate, symmetric key, or a signed expiring SAS token |
| Permissions | a policy per certificate naming client ids and topics | a per-device identity; access policies for back-end services |
| Device state | device shadow, classic or named | device twin: desired and reported properties, tags |
| Commands | jobs; changes to the shadow | direct methods (wait for an answer); cloud-to-device messages |
| Routing | rules engine: a SQL-like query on topics sends data to storage or functions | message routing to endpoints such as Event Hubs and storage |
| Onboarding many | fleet provisioning; just-in-time registration | Device Provisioning Service |

Azure's MQTT is a subset of a full broker: QoS 2 is not supported and retained messages are not kept for later subscribers.

### Details that bite

- **The clock.** Certificates have dates. An ESP that has not set its clock thinks it is 1970 and finds every certificate "not yet valid". Set the time by SNTP before the first TLS connection ([[ntp-and-time]]).
- **Least privilege.** A policy should let a device connect only under its own client id and publish only below its own topic; policy variables let one policy serve the whole fleet.
- **Keep the private key where it cannot be read**: encrypted flash, or behind the Digital Signature peripheral ([[efuse-keys-and-key-storage]], [[digital-signature-and-hmac]]).
- **Metering and quotas.** Both charge for messages (counted in blocks of a few kilobytes, so many tiny ones cost more than a few full ones), connection time and rule actions, and both limit rates ([[batching-rates-and-cost]]).

### When to choose them

When you already live on that cloud and need audit, scale, or the neighbouring services. For ten devices at home they are heavy: a local broker does the same job. On the device, both are a TLS MQTT client with a certificate.

> [!key] Both register a device, give it a certificate, limit what it may do and route its messages. The details that bite are the clock before TLS, least-privilege policies, protecting the private key, and the per-message metering.`,
  ideas: [
    'AWS IoT Core and Azure IoT Hub follow the same pattern: register, give a certificate, set permissions, connect with MQTT over TLS.',
    'AWS limits a device with a policy attached to its certificate; Azure ties its identity to a hub and offers SAS tokens as a lighter credential.',
    'Each keeps a state for the device (shadow, twin) and routes messages onwards with rules.',
    'The device needs the right time before TLS, its own certificate, and a private key that cannot be read.'
  ],
  pitfalls: [
    'One certificate flashed into every device is simpler — It is also a single point of failure: anyone who extracts it can impersonate the whole fleet, and revoking it cuts off every device. Give each device its own.',
    'The TLS handshake failed, so the cloud must be down — On an ESP the usual cause is the clock: with the date at 1970 the certificate is not yet valid. Synchronise the time first.',
    'A permissive policy is fine while I am developing — Policies that allow everything tend to ship. Write the narrow policy from the start; a stolen device then can reach only its own topics.'
  ],
  terms: [
    { term: 'Thing', also: ['IoT thing', 'device identity'], def: 'In AWS IoT Core, the registry entry that represents one device, to which a certificate, a policy and a shadow are attached.' },
    { term: 'IoT policy', also: ['AWS IoT policy'], def: 'A document attached to a certificate that lists what its holder may do: which client ids may connect and which topics it may publish to or subscribe to.' },
    { term: 'Rules engine', also: ['IoT rule', 'message routing'], def: 'A service feature that selects messages with a SQL-like query on their topic and content and sends them to storage, functions or other services.' },
    { term: 'SAS token', also: ['shared access signature'], def: 'A signed token with an expiry time, used by Azure IoT Hub as a password. It is derived from a key, so the key itself never travels.' },
    { term: 'Device Provisioning Service', also: ['DPS'], def: 'An Azure service that a new device contacts first; it checks the device\'s credential and tells it which hub to join, so thousands of devices can be set up automatically.' }
  ],
  choose: {
    good: ['A fleet that needs audit, scale and integration with the same cloud\'s other services', 'A product where each device must have its own revocable identity', 'A team that already runs on that cloud'],
    avoid: ['A handful of devices at home: a local broker is simpler and free to run', 'One shared certificate for the whole fleet', 'Sending tiny messages every second without checking the metering'],
    check: ['The metering block size and the free-tier limits as they stand today', 'The per-account limits on connections and message rates', 'How you will rotate certificates before they expire']
  },
  code: [
    {
      title: 'Connect to a cloud broker with a device certificate',
      about: 'Connects to an AWS IoT Core endpoint with mutual TLS (the root certificate, the device certificate and its private key) and publishes a reading every 30 seconds. The same shape works for any broker that asks for a client certificate.',
      needs: 'An ESP board with Wi-Fi, and an AWS account with a thing, a certificate and a policy that allows connecting as "esp32-demo" and publishing to "dt/esp32-demo/telemetry".',
      libs: ['PubSubClient'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]
          use root certificate, device certificate and private key :: security
          connect to MQTT broker [your-endpoint-ats.iot.eu-west-1.amazonaws.com] on port (8883)

        every (30) seconds
          publish (JSON text: temp (21.5)) to topic [dt/esp32-demo/telemetry]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <NetworkClientSecure.h>
        #include <PubSubClient.h>

        const char *ENDPOINT = "your-endpoint-ats.iot.eu-west-1.amazonaws.com";   // the account's device data endpoint
        const char *CLIENT_ID = "esp32-demo";                                    // must be allowed by the policy

        const char ROOT_CA[] = R"EOF(-----BEGIN CERTIFICATE-----
        paste the Amazon root certificate here
        -----END CERTIFICATE-----)EOF";
        const char DEVICE_CERT[] = R"EOF(-----BEGIN CERTIFICATE-----
        paste this device's certificate here
        -----END CERTIFICATE-----)EOF";
        const char DEVICE_KEY[] = R"EOF(-----BEGIN RSA PRIVATE KEY-----
        paste this device's private key here
        -----END RSA PRIVATE KEY-----)EOF";

        NetworkClientSecure tls;
        PubSubClient mqtt(tls);

        void ensureMqtt() {
          while (!mqtt.connected()) {
            if (!mqtt.connect(CLIENT_ID)) delay(5000);   // no user name: the certificate is the login
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");              // certificates have dates: the clock must be right first
          while (time(nullptr) < 1700000000) delay(200);
          tls.setCACert(ROOT_CA);
          tls.setCertificate(DEVICE_CERT);
          tls.setPrivateKey(DEVICE_KEY);
          mqtt.setServer(ENDPOINT, 8883);
          mqtt.setKeepAlive(60);
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();
          static uint32_t last = 0;
          if (millis() - last >= 30000) {
            last = millis();
            mqtt.publish("dt/esp32-demo/telemetry", "{\"temp\":21.5}");   // stand-in reading
          }
        }
      `,
      py: String.raw`
        import network, ntptime, ssl, time
        from umqtt.simple import MQTTClient

        ENDPOINT = "your-endpoint-ats.iot.eu-west-1.amazonaws.com"   # the account's device data endpoint
        CLIENT_ID = "esp32-demo"                                    # must be allowed by the policy

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)
        ntptime.settime()                          # certificates have dates: the clock must be right first

        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.verify_mode = ssl.CERT_REQUIRED
        ctx.load_verify_locations(cadata=open("/root_ca.der", "rb").read())
        ctx.load_cert_chain(open("/device_cert.der", "rb").read(), open("/device_key.der", "rb").read())

        client = MQTTClient(CLIENT_ID, ENDPOINT, port=8883, keepalive=60, ssl=ctx)   # no user name: the certificate is the login
        client.connect()

        last = time.ticks_ms()
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 30000:
                last = time.ticks_ms()
                client.publish(b"dt/esp32-demo/telemetry", b'{"temp":21.5}')   # stand-in reading
            time.sleep_ms(100)
      `,
      notes: ['Never keep a private key in code that you share or publish, and never give two devices the same one. Store it in encrypted flash or behind the Digital Signature peripheral ([[efuse-keys-and-key-storage]]).', 'The MicroPython version reads the three files as DER bytes (convert the PEM files first); the arguments of load_cert_chain differ between MicroPython versions, so check the ssl documentation of the one you run.', 'If the connection fails at once, check three things: the clock, the policy (does it allow this client id and topic?) and that the certificate is attached to the thing and activated.']
    }
  ],
  quiz: [
    { q: 'An ESP32 reaches the Wi-Fi but every TLS connection to the cloud fails with "certificate not yet valid". What is the likeliest cause?', choices: ['The cloud is down', 'The ESP\'s clock was never set and says 1970', 'Port 8883 is closed on the chip', 'MQTT does not support TLS'], a: 1, why: 'A certificate is valid between two dates. A chip that has not synchronised its clock thinks it is 1970, so the certificate\'s start date lies in the future. Set the time by SNTP first.' },
    { q: 'What is the safest way to give a fleet of 1,000 devices access to AWS IoT Core?', choices: ['One certificate flashed into all of them', 'One certificate per device, each with a narrow policy', 'No certificate, only a password in the firmware', 'The same key printed on the box'], a: 1, why: 'Per-device certificates let you revoke one device and see which sent what; a narrow policy limits what a stolen one can do. A shared credential is one theft away from a fleet-wide problem.' },
    { q: 'Azure IoT Hub supports every feature of an MQTT 3.1.1 broker.', a: false, why: 'Its MQTT support is partial: QoS 2 is not supported and retained messages are not kept for later subscribers. Use the twin for state that must persist.' },
    { q: 'A service counts messages in 5 KB blocks. Which sends fewer billed messages: 50 readings of 100 bytes in separate messages, or in one message?', choices: ['Separate messages', 'One message of 5 KB', 'They are the same', 'It depends on the topic'], a: 1, why: 'Fifty separate messages are fifty blocks; one message of 5,000 bytes is one block. Batching is the cheapest saving on a metered service.' }
  ],
  applications: [
    'A fleet of metering devices that report to AWS IoT Core and feed a data lake.',
    'An industrial gateway that joins an Azure IoT Hub and receives direct-method commands.',
    'A product line where each unit receives its own certificate at the end of production.',
    'A prototype that publishes to a cloud broker over mutual TLS before the product has its own back end.'
  ],
  sources: [
    'Amazon Web Services, *AWS IoT Core Developer Guide*: connecting devices, policies, device shadows, rules, fleet provisioning.',
    'Microsoft, *Azure IoT Hub documentation*: device identities, MQTT support, device twins, Device Provisioning Service.',
    'Espressif, *ESP-IDF Programming Guide*, "ESP-MQTT" and "ESP-TLS".'
  ]
},

/* ================================================================ arduino-cloud-blynk-and-friends */
{
  id: 'arduino-cloud-blynk-and-friends',
  parent: 'cloud-and-data-management',
  title: 'Arduino Cloud, Blynk, ThingSpeak, Adafruit IO',
  level: 1,
  short: 'Hobby clouds give the whole chain in one account: somewhere to send, somewhere to store and a dashboard you build by dragging. For a first or small project they are hard to beat; read their limits and think about lock-in.',
  keywords: ['Arduino Cloud', 'Arduino IoT Cloud', 'Blynk', 'ThingSpeak', 'Adafruit IO', 'maker cloud', 'free plan', 'rate limit', 'write API key', 'channel', 'feed', 'datastream', 'virtual pin'],
  prereq: ['iot-architecture', 'http-client', 'mqtt'],
  related: ['dashboards', 'local-first', 'batching-rates-and-cost', 'credentials-handling', 'aws-iot-and-azure', 'https-and-tls'],
  body: `A **hobby cloud** gives you, for the price of an account, the whole chain of [[iot-architecture]] in one place: a broker or an HTTP address to send to, storage, and a dashboard you build by dragging widgets. For a first project or a small one they are hard to beat; you can have a graph on a phone within an hour. Four are common.

| Service | What you create | How an ESP talks to it | Notes |
|---|---|---|---|
| Arduino Cloud | a *Thing* with *variables*, and a dashboard | a library and a generated sketch file; variables stay in step both ways | the editor writes the connection code; a device has an ID and a secret key |
| Blynk | a *template* with *datastreams* and a phone-app layout | the Blynk library with an auth token per device; values go to numbered virtual pins | strong on phone widgets, switches and sliders |
| ThingSpeak | a *channel* of up to eight *fields* | one HTTPS request with a write key, or MQTT | MathWorks' service, with built-in plotting and MATLAB analysis |
| Adafruit IO | *feeds* and dashboard blocks | MQTT or REST with a user name and a key; Adafruit's library | triggers and actions; simple and well documented |

### What they have in common

An account, a device, a key; widgets; and a **free plan with limits**: on devices, on variables, on how often you may send, and on how long history is kept, with paid plans above it. Limits and terms change, so read the current ones before you build something that depends on them.

### Weigh before you commit

- **Lock-in.** Your data and dashboards live in someone else's account. Check that you can export the history, and that the device side is a standard (HTTPS, MQTT) that you can redirect elsewhere.
- **Rate limits shape the design.** A free channel that accepts an update only every fifteen seconds or so cannot take a reading a second. Batch ([[batching-rates-and-cost]]) or sample more slowly.
- **Secrets.** A write key is a password: anyone who has it can fill your channel with rubbish. Keep it out of shared code and out of web addresses ([[credentials-handling]]).
- **Longevity.** A free service can change its terms or close. For anything that must last, keep a path to your own broker ([[local-first]]).

### Choosing

Phone first, with switches and sliders: Blynk or Arduino Cloud. Plain numbers and graphs from several places: ThingSpeak or Adafruit IO. If you outgrow them, the same data can go to your own broker and Grafana ([[dashboards]]), and the firmware changes by little: a new address and a new key.

> [!key] Hobby clouds give the whole chain in one account and are the quickest start. Their free plans limit rate, devices and history, your data lives in their account, and a write key is a password: check the terms and keep a way out.`,
  ideas: [
    'A hobby cloud supplies the broker or endpoint, the storage and the dashboard in one account.',
    'Arduino Cloud and Blynk write much of the device code; ThingSpeak and Adafruit IO are plain HTTPS or MQTT endpoints.',
    'Free plans limit devices, rate and history, and these limits shape what the firmware can do.',
    'Standard protocols and an exportable history are your way out if you outgrow the service.'
  ],
  pitfalls: [
    'A free service will always stay free and unchanged — Plans, limits and even the service itself change. Do not build something long-lived on a free tier without a way out.',
    'The write key only needs to be hidden from the dashboard — Anyone who has it can write to your channel, whoever they are. Treat it as a password and keep it out of public code.',
    'Sending every second is fine, the service just stores more — Free plans refuse updates that come too fast, and the refused readings are simply lost. Know the rate limit and stay under it.'
  ],
  terms: [
    { term: 'Rate limit', also: ['throttling', 'quota'], def: 'The most messages a service accepts in a period, such as one update per fifteen seconds. Updates that come faster are refused or dropped.' },
    { term: 'Write API key', also: ['write key', 'API key'], def: 'A secret string that lets its holder add data to a channel or feed. It works like a password for writing and should be kept out of shared code.' },
    { term: 'Channel', also: ['ThingSpeak channel'], def: 'In ThingSpeak, a store of up to eight numbered fields with timestamps, which can be public or private and has its own keys.' },
    { term: 'Datastream', also: ['virtual pin'], def: 'In Blynk, a named value of a device with a type and a unit. The firmware writes to it through a numbered virtual pin and widgets in the app read it.' },
    { term: 'Feed', also: ['Adafruit IO feed'], def: 'In Adafruit IO, one stream of values with timestamps that devices write to and dashboard blocks read, addressed by name under the user\'s account.' }
  ],
  choose: {
    good: ['A first project that needs a graph on a phone today', 'A classroom or demo where setup time matters more than longevity', 'A small logger whose data you can export and move'],
    avoid: ['A product that depends on a free plan staying free', 'High-rate telemetry: the limits will refuse it', 'Data you may not leave in a third party\'s account'],
    check: ['The current free-plan limits on devices, rate and history', 'Whether the history can be exported', 'Whether the device side is standard enough to redirect later']
  },
  code: [
    {
      title: 'Send a reading to ThingSpeak over HTTPS',
      about: 'Posts one reading a minute to a ThingSpeak channel as a small JSON document and prints the service\'s answer. The same request shape works for most REST endpoints that take a JSON body and a key.',
      needs: 'An ESP board with Wi-Fi, and a ThingSpeak channel with field 1 enabled and its Write API Key.',
      libs: ['ArduinoJson'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]

        every (60) seconds
          set [temp v] to (read temperature)
          http post (JSON text: api_key (your-write-key), field1 (temp)) to [https://api.thingspeak.com/update.json]
          print (the reply of the request)
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <NetworkClientSecure.h>
        #include <ArduinoJson.h>

        // the list of public root certificates that is built into the core
        extern const uint8_t ca_bundle_start[] asm("_binary_x509_crt_bundle_start");
        extern const uint8_t ca_bundle_end[] asm("_binary_x509_crt_bundle_end");
        const char *WRITE_KEY = "your-write-key";     // the channel's Write API Key: treat it as a password
        const char *URL = "https://api.thingspeak.com/update.json";

        float readTemperature() {
          return 21.5;                                // stand-in: replace with your sensor
        }

        bool sendReading(float tempC) {
          NetworkClientSecure client;
          client.setCACertBundle(ca_bundle_start, ca_bundle_end - ca_bundle_start);   // check the server against the built-in roots
          HTTPClient http;
          if (!http.begin(client, URL)) return false;
          http.addHeader("Content-Type", "application/json");
          JsonDocument doc;
          doc["api_key"] = WRITE_KEY;
          doc["field1"] = tempC;
          String body;
          serializeJson(doc, body);
          int code = http.POST(body);
          Serial.printf("HTTP %d, reply: %s\n", code, http.getString().c_str());
          http.end();
          return code == 200;
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");           // certificate checks need the right date
          while (time(nullptr) < 1700000000) delay(200);
        }

        void loop() {
          sendReading(readTemperature());
          delay(60000);                               // free channels accept updates only every ~15 seconds at best
        }
      `,
      py: String.raw`
        import network, time, requests

        WRITE_KEY = "your-write-key"                  # the channel's Write API Key: treat it as a password
        URL = "https://api.thingspeak.com/update.json"

        def read_temperature():
            return 21.5                               # stand-in: replace with your sensor

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)

        while True:
            r = requests.post(URL, json={"api_key": WRITE_KEY, "field1": read_temperature()})
            print("HTTP", r.status_code, r.text)
            r.close()
            time.sleep(60)                            # free channels accept updates only every ~15 seconds at best
      `,
      output: `
        HTTP 200, reply: {"channel_id":1234567,"created_at":"2026-10-04T12:00:00Z","entry_id":1,"field1":"21.5", …}
      `,
      notes: ['The two ca_bundle lines name the list of public root certificates built into the core, and setCACertBundle() tells the client to trust it; from core 3.3.12 client.useBuiltinCACertBundle() does the same in one call. To trust one root only, use setCACert() ([[certificates-and-root-cas]]).', 'MicroPython\'s requests does not check the server certificate. The write key then travels to whoever answers, which is acceptable only for a throw-away channel; use the ssl module when it matters ([[https-and-tls]]).', 'A refused update (too soon after the last one) is reported as 0 rather than an entry number: check the reply, not only the HTTP code.']
    }
  ],
  quiz: [
    { q: 'Which feature of a free plan most often shapes the firmware you write?', choices: ['The colour themes of the dashboard', 'The limit on how often you may send', 'The number of widget types', 'The name of the account'], a: 1, why: 'If the service accepts one update every fifteen seconds or so, the firmware must sample or batch accordingly; the refused readings are lost.' },
    { q: 'A channel\'s Write API Key may safely be published, like the public graph.', a: false, why: 'The write key lets anyone add data to the channel. Even if the graph is public, the key is a password.' },
    { q: 'You outgrow a hobby cloud and want your own server. What makes the move easiest?', choices: ['The device sends standard HTTPS or MQTT that you can redirect', 'A proprietary binary library linked into the firmware', 'A dashboard with many widgets', 'A paid plan'], a: 0, why: 'If the device speaks a standard protocol, moving means changing an address and a key. A vendor library that talks only to one service has to be replaced.' },
    { q: 'What does the `requests` module of MicroPython not do by default for https addresses?', choices: ['Send JSON', 'Check the server\'s certificate', 'Read the reply', 'Use POST'], a: 1, why: 'The shipped requests code accepts any certificate. The traffic is encrypted, but you cannot be sure who answered. Use the ssl module with a root certificate where that matters.' }
  ],
  applications: [
    'A classroom weather station whose temperature graph pupils open on their phones.',
    'A first smart-home project with Blynk switches and sliders.',
    'A hobbyist\'s greenhouse logger in a ThingSpeak channel with a MATLAB moving average.',
    'An Arduino Cloud dashboard for a plant-watering project on an ESP32.'
  ],
  sources: [
    'ThingSpeak documentation (MathWorks), *Write Data to a Channel* and the REST API reference.',
    'Arduino, *Arduino Cloud documentation*: Things, variables, dashboards and third-party boards.',
    'Blynk documentation and Adafruit IO documentation (feeds, MQTT and REST API).'
  ]
},

/* ================================================================ databases-from-a-device */
{
  id: 'databases-from-a-device',
  parent: 'cloud-and-data-management',
  title: 'Databases from a device',
  level: 2,
  short: 'Someone will ask for "the temperature last March". Where the device ends and the database begins decides how safe, how flexible and how fragile your system is: write directly, through a broker and a bridge, or through your own small API.',
  keywords: ['database', 'InfluxDB', 'line protocol', 'Telegraf', 'SQL', 'PostgreSQL', 'SQLite', 'Firebase', 'Supabase', 'REST', 'bridge', 'token', 'bucket', 'write', 'MQTT to database'],
  prereq: ['time-series-data', 'http-client', 'rest-apis-and-json'],
  related: ['iot-architecture', 'store-and-forward', 'dashboards', 'credentials-handling', 'logging-data', 'nvs-and-preferences'],
  body: `Sooner or later someone asks for "the temperature last March", and a dashboard that keeps nothing cannot answer. Somewhere the readings must be kept, and the first question is where the device ends and the database begins.

### Three ways to get a reading into a database

1. **The device writes directly**, through the database's own network interface (an HTTP call). Few moving parts: it suits a home server or a small project. The device needs the database's address and a credential.
2. **Through a broker and a bridge.** The device publishes MQTT; a program on the server (Telegraf, Node-RED, a short Python script, Home Assistant's recorder) subscribes and writes to the database. The device knows only the broker, the database can change without touching the firmware, and the broker buffers a little. This is the usual choice beyond a handful of devices.
3. **Through your own small API.** The device posts to a web service you control; it checks the data, adds what the device cannot know, and writes. The most work and the most control: the right choice for a product.

What you should not do is connect a microcontroller straight to a SQL server's port with a user that can do anything. That ties the firmware to one table layout and puts a powerful password on a device that can be stolen.

### Which kind of database

- A **time-series database** (InfluxDB, TimescaleDB) for readings: quick range queries and built-in downsampling ([[time-series-data]]).
- **SQL** (PostgreSQL, MySQL, SQLite) when readings must be joined with other things, such as customers, sites and devices. SQLite is a single file; a community port runs it even on an ESP32's SD card.
- **Document stores and hosted back ends** (Firebase, Supabase) when you also need user accounts, a web app and access rules. Supabase is built on PostgreSQL and controls access row by row.
- **A file.** A CSV on an SD card or on the server is a database too ([[logging-data]], [[sd-cards]]).
- **On the device itself**, NVS, LittleFS and, in MicroPython, a btree file keep settings and small tables ([[nvs-and-preferences]]).

### One point, one line

InfluxDB accepts a plain text line: measurement, tags, fields, timestamp.

~~~
weather,site=garden temp=21.5,hum=48.2 1791115200
~~~

A POST of that line to its write address stores it, and the answer "204 No Content" means success. The program below does exactly this. Give the device a **token that may only write to one bucket**: a stolen device can then add rubbish but cannot read or delete your data.

### Traps

- Plain HTTP is acceptable inside a trusted network and nowhere else; across the internet use HTTPS or a VPN ([[https-and-tls]]).
- A database that is down loses readings unless the device queues them ([[store-and-forward]]).
- Let the **device** stamp the time when it can buffer or batch; a server that stamps on arrival records the wrong moment.

> [!key] Write directly for small systems, through a broker and a bridge for many devices, through your own API for products. Never give a device a powerful database login: use a token that can only write, and let the device stamp its own readings.`,
  ideas: [
    'A device can write straight to a database, go through a broker and a bridge, or call your own API; each step adds work and control.',
    'Use the right store: time-series for readings, SQL for joined data, hosted back ends for accounts and rules, a file for one logger.',
    'Give the device a credential that can only write to one place, so a stolen device cannot read or delete anything.',
    'InfluxDB\'s line protocol is one text line of measurement, tags, fields and timestamp, sent in an HTTP POST.'
  ],
  pitfalls: [
    'The simplest thing is to connect the device to my SQL server — It ties the firmware to your table layout, puts an all-powerful password on a stealable device, and leaves nowhere to validate the data. Use a write-only token or a small API.',
    'The server can stamp the time when the data arrives — A device that buffers or batches delivers old data. Only the device knows when the measurement was made.',
    'HTTP is fine because it is only sensor data — The token travels in every request. Anyone on the path can read it and write to your database.'
  ],
  terms: [
    { term: 'Line protocol', also: ['InfluxDB line protocol'], def: 'InfluxDB\'s text format for one point: the measurement, comma-separated tags, a space, the fields, a space and an optional timestamp, all on one line.' },
    { term: 'Scoped token', also: ['write-only token', 'API token'], def: 'A credential limited to certain actions on certain data, for example writing to one bucket, so that its theft does little harm.' },
    { term: 'Bridge', also: ['MQTT bridge', 'ingest bridge'], def: 'A program that subscribes to messages on a broker and writes them elsewhere, such as into a database. Telegraf and Node-RED are common ones.' },
    { term: 'Telegraf', also: [], def: 'A collection agent by InfluxData with plug-ins for many inputs, including MQTT, and outputs such as InfluxDB. It is the usual bridge from broker to database.' }
  ],
  choose: {
    good: ['Direct writes with a scoped token for one device or a small home system', 'A broker and a bridge for many devices or mixed readers', 'Your own API for a product, where you must validate and own the data'],
    avoid: ['A SQL login with full rights on a device', 'HTTP across the internet', 'Choosing names for fields and tags casually'],
    check: ['What the token can do if the device is stolen', 'What happens to the readings while the database is down', 'Who stamps the time']
  },
  code: [
    {
      title: 'Write a point to InfluxDB with the line protocol',
      about: 'Sends one reading as a line of InfluxDB\'s text format in an HTTP POST, with a token that may only write, and checks for the answer 204.',
      needs: 'An ESP board with Wi-Fi, and an InfluxDB 2 server on your network with an organisation "home", a bucket "sensors" and a write-only token.',
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]

        every (60) seconds
          set [line v] to (join [weather,site=garden temp=] (read temperature) [ ] (current time))
          http post (line) to [http://192.168.1.20:8086/api/v2/write?org=home&bucket=sensors&precision=s]
          print (join [status: ] (status of the request))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>

        const char *URL = "http://192.168.1.20:8086/api/v2/write?org=home&bucket=sensors&precision=s";
        const char *TOKEN = "your-write-only-token";   // allowed to write to this one bucket and nothing else

        float readTemperature() {
          return 21.5;                                // stand-in: replace with your sensor
        }

        bool writePoint(float tempC) {
          char line[96];
          snprintf(line, sizeof(line), "weather,site=garden temp=%.1f %lu", tempC, (unsigned long)time(nullptr));
          NetworkClient client;
          HTTPClient http;
          http.begin(client, URL);
          http.addHeader("Authorization", String("Token ") + TOKEN);
          http.addHeader("Content-Type", "text/plain; charset=utf-8");
          int code = http.POST((uint8_t *)line, strlen(line));
          http.end();
          Serial.printf("status: %d\n", code);
          return code == 204;                         // 204 No Content: the point was stored
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");           // the point carries a UTC timestamp in seconds
          while (time(nullptr) < 1700000000) delay(200);
        }

        void loop() {
          writePoint(readTemperature());
          delay(60000);
        }
      `,
      py: String.raw`
        import network, ntptime, time, requests

        URL = "http://192.168.1.20:8086/api/v2/write?org=home&bucket=sensors&precision=s"
        HEADERS = {"Authorization": "Token your-write-only-token", "Content-Type": "text/plain; charset=utf-8"}
        EPOCH_OFFSET = 946684800                      # MicroPython counts from 2000, Unix time from 1970

        def read_temperature():
            return 21.5                               # stand-in: replace with your sensor

        def write_point(temp_c):
            line = "weather,site=garden temp=%.1f %d" % (temp_c, time.time() + EPOCH_OFFSET)
            r = requests.post(URL, data=line, headers=HEADERS)
            print("status:", r.status_code)
            ok = r.status_code == 204                 # 204 No Content: the point was stored
            r.close()
            return ok

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)
        ntptime.settime()                             # the point carries a UTC timestamp in seconds

        while True:
            write_point(read_temperature())
            time.sleep(60)
      `,
      output: `
        status: 204
      `,
      notes: ['Replace the address with your own server and keep to plain HTTP only inside a trusted network. Beyond it use HTTPS ([[https-and-tls]]).', 'A reply of 401 means the token is wrong or lacks the right to write to that bucket; 404 usually means a wrong organisation or bucket name.', 'The token is a password: keep it out of shared code ([[credentials-handling]]).']
    }
  ],
  quiz: [
    { q: 'Why give the device a token that can only write to one bucket?', choices: ['Writing is faster than reading', 'A stolen device can then add rubbish but cannot read or delete your data', 'The ESP32 cannot read from a database', 'Tokens with fewer rights are shorter'], a: 1, why: 'The credential lives on a device that someone may steal. Limiting it to the one thing the device needs bounds the damage.' },
    { q: 'Why is a broker with a bridge often better than direct writes for many devices?', choices: ['It makes TLS unnecessary', 'The firmware knows only the broker, so the database can change without touching the devices', 'Brokers store data for ever', 'It halves the battery use'], a: 1, why: 'Decoupling means a new database, a second reader or a rule can be added on the server with no firmware change, and the broker absorbs short outages.' },
    { q: 'If a device buffers readings while offline, who should stamp the time?', choices: ['The server when each batch arrives', 'The device when each reading is taken', 'The dashboard', 'Nobody: order is enough'], a: 1, why: 'A batch that arrives an hour late would carry the wrong time on every reading if the server stamped it.' },
    { q: 'Sending a database token over plain HTTP is acceptable across the internet if the token is long.', a: false, why: 'Anyone on the path can read the request and copy the token whatever its length. Use HTTPS, or a VPN.' }
  ],
  applications: [
    'A garden logger that writes straight to an InfluxDB server at home.',
    'A building with hundreds of sensors publishing MQTT, bridged by Telegraf into a time-series database.',
    'A product whose devices post to the maker\'s own API, which validates and stores the data.',
    'A hosted back end (Supabase or Firebase) holding readings and users for a small web app.'
  ],
  sources: [
    'InfluxData, *InfluxDB documentation*: the write API, line protocol and tokens.',
    'InfluxData, *Telegraf documentation*: the MQTT consumer input and the InfluxDB output.',
    'Espressif, *ESP-IDF Programming Guide*, ESP HTTP Client; Arduino-ESP32 documentation, HTTPClient library.'
  ]
},

/* ================================================================ store-and-forward */
{
  id: 'store-and-forward',
  parent: 'cloud-and-data-management',
  title: 'Store and forward: surviving an outage',
  level: 2,
  short: 'Write each reading somewhere safe first, send it when the link allows, and delete it only when the receiver has said it has it. The price is duplicates, so the receiver must tolerate repeats.',
  keywords: ['store and forward', 'buffering', 'outage', 'queue', 'backlog', 'idempotent', 'sequence number', 'acknowledgement', 'back-off', 'jitter', 'offline', 'retry', 'at least once', 'LittleFS'],
  prereq: ['logging-data', 'littlefs-and-file-systems', 'mqtt-topics-qos-retain', 'iot-architecture'],
  related: ['batching-rates-and-cost', 'flash-wear', 'wifi-events-and-reconnection', 'sd-cards', 'time-series-data', 'reliability-acks-and-retries'],
  body: `A device that sends each reading the moment it is taken, and then forgets it, has a hole in its data every time the router restarts, the broker is updated or the cloud has a bad afternoon. The cure is old and simple: **store and forward**. Write the reading somewhere safe first; send it when you can; delete it only when the receiver has said it has it.

### The three rules

1. **Store before send.** Every reading goes into a queue: RAM for short gaps, a file in flash or on an SD card for long ones ([[littlefs-and-file-systems]], [[sd-cards]]).
2. **Forward when connected, oldest first**, in batches ([[batching-rates-and-cost]]) and at a rate the receiver and the radio can take. After a long outage the backlog is large; sending it all at once chokes the link and trips the cloud's rate limits.
3. **Delete on acknowledgement.** That means an HTTP 200, or an MQTT PUBACK at QoS 1 from a client library that supports it (PubSubClient publishes at QoS 0 only). A publish call that returned true says only that bytes left the socket.

### Duplicates are the price

If the receiver stores a batch but its acknowledgement is lost, the device will send the batch again. Delivery of this kind is **at least once**, never exactly once, so the receiver must tolerate repeats: make the messages **idempotent**. The simplest way is a key the device creates, such as the device id with the reading's timestamp or a **sequence number**, and a receiver that ignores keys it already holds. A gap in the sequence numbers also tells you that something was lost for good.

### The limits of the queue

RAM is small and vanishes at a reset: a queue of 100 readings of 14 bytes is only 1.4 kB, but it lasts until the first brownout. Flash survives but wears: a sector tolerates something like 100,000 erases, so appending every second for years is too much; collect readings in RAM and write them in blocks ([[flash-wear]]). A full queue forces a decision: drop the oldest (keep the recent), drop the newest (keep the history), or thin the old data (keep every tenth). Choose deliberately, and count what you drop.

### Reconnecting politely

After an outage do not retry in a tight loop. Wait one second, then two, then four, up to a limit, and add a little random **jitter**. Otherwise a thousand devices that lost the same router reconnect in the same second and knock the server down again ([[wifi-events-and-reconnection]]). The simulation shows what is lost, what arrives late and how long the catch-up takes.

> [!key] Store first, forward when you can, delete only on acknowledgement. Expect duplicates and make messages idempotent with a key or sequence number; bound the queue, wear the flash gently, and reconnect with back-off and jitter.`,
  ideas: [
    'Store every reading in a queue before sending, and delete it only after the receiver acknowledges it.',
    'At-least-once delivery produces duplicates, so messages need a key or sequence number and the receiver must ignore repeats.',
    'A queue in RAM is lost at a reset and one in flash wears out: batch the writes and decide what to drop when it is full.',
    'After an outage, send the backlog at a controlled rate and reconnect with back-off and jitter.'
  ],
  pitfalls: [
    'publish() returned true, so the message is delivered — It says only that the bytes were handed to the network. Delete from the queue on a real acknowledgement from the receiver.',
    'Exactly-once delivery is possible if I retry carefully — Over an unreliable link you can have at-least-once or at-most-once. Exactly-once effects come from idempotent receivers, not from the sender.',
    'Flash is non-volatile, so I can append to it every second — Each write wears the sector. Buffer in RAM and write in blocks, and check the expected lifetime ([[flash-wear]]).'
  ],
  terms: [
    { term: 'Store and forward', also: ['store-and-forward', 'buffering'], def: 'Keeping data in a local queue until it can be delivered, and removing it only after the receiver confirms it, so that an outage delays data instead of losing it.' },
    { term: 'Idempotent', also: ['idempotence'], def: 'Said of an operation that has the same effect whether it is done once or several times. An idempotent receiver ignores a message whose key it already holds.' },
    { term: 'Sequence number', also: ['message counter'], def: 'A number the sender increases with each message. The receiver uses it to drop duplicates and to notice gaps where messages were lost.' },
    { term: 'Backlog', also: ['queue depth'], def: 'The readings stored on the device and not yet delivered. It grows during an outage and must drain, at a controlled rate, afterwards.' },
    { term: 'Back-off', also: ['exponential back-off', 'jitter'], def: 'Waiting longer after each failed attempt (1 s, 2 s, 4 s and so on), usually with a random addition called jitter, so that many devices do not retry in the same instant.' }
  ],
  choose: {
    good: ['A flash file queue for a battery logger that may be offline for hours or days', 'A RAM queue for gaps of a few minutes with a mains supply', 'An SD card for very long outages and large volumes'],
    avoid: ['Sending and forgetting when every reading matters', 'A queue with no size limit', 'Retrying at full speed in a loop'],
    check: ['The longest outage you must survive, times the data rate', 'What the queue drops when full, and whether you count it', 'Whether the receiver ignores duplicates']
  },
  code: [
    {
      title: 'A file queue that survives an outage',
      about: 'Every 10 seconds the program appends a timestamped reading to a file in flash. Every minute, when Wi-Fi is up, it posts the whole file to a server and deletes the file only if the server answers 200. The timestamp is the key, so a repeated batch is harmless if the server ignores keys it holds.',
      needs: 'An ESP board with Wi-Fi, and a server that accepts a POST of CSV lines at the address in the program and ignores repeated timestamps.',
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]

        every (10) seconds
          if <(current time) > (1700000000)> then
            append (join (current time) [,] (read temperature)) to file [queue.csv]
          end

        every (60) seconds
          if <Wi-Fi connected?> then
            http post (contents of file [queue.csv]) to [http://192.168.1.20:8080/ingest]
            if <(status of the request) = (200)> then
              delete file [queue.csv] :: storage
            end
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <LittleFS.h>

        const char *QUEUE = "/queue.csv";
        const char *URL = "http://192.168.1.20:8080/ingest";   // must accept repeats of the same line

        float readTemperature() {
          return 21.5;                                          // stand-in: replace with your sensor
        }

        void storeReading() {
          if (LittleFS.totalBytes() - LittleFS.usedBytes() < 20000) return;   // keep room: a gap beats a full disk
          File f = LittleFS.open(QUEUE, "a");
          f.printf("%lu,%.1f\n", (unsigned long)time(nullptr), readTemperature());
          f.close();
        }

        bool forwardQueue() {
          File f = LittleFS.open(QUEUE, "r");
          if (!f) return true;                                  // nothing queued
          String body = f.readString();                         // fine for a few hundred lines
          f.close();
          NetworkClient client;
          HTTPClient http;
          http.begin(client, URL);
          http.addHeader("Content-Type", "text/csv");
          int code = http.POST(body);
          http.end();
          if (code != 200) return false;                        // keep the file and try again later
          LittleFS.remove(QUEUE);                               // delete only after the server said yes
          return true;
        }

        void setup() {
          Serial.begin(115200);
          LittleFS.begin(true);
          WiFi.setAutoReconnect(true);
          WiFi.begin("your-ssid", "your-password");
          configTime(0, 0, "pool.ntp.org");
        }

        void loop() {
          static uint32_t lastStore = 0, lastSend = 0;
          uint32_t now = millis();
          if (now - lastStore >= 10000) {
            lastStore = now;
            if (time(nullptr) > 1700000000) storeReading();     // never store a reading with a made-up time
          }
          if (now - lastSend >= 60000) {
            lastSend = now;
            if (WiFi.status() == WL_CONNECTED) Serial.println(forwardQueue() ? "queue sent" : "send failed: kept");
          }
        }
      `,
      py: String.raw`
        import network, ntptime, os, time, requests

        QUEUE = "queue.csv"
        URL = "http://192.168.1.20:8080/ingest"        # must accept repeats of the same line
        EPOCH_OFFSET = 946684800                       # MicroPython counts from 2000, Unix time from 1970

        def read_temperature():
            return 21.5                                # stand-in: replace with your sensor

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")     # keeps retrying in the background

        def clock_set():
            return time.gmtime()[0] >= 2024            # the clock starts in 2000 until NTP sets it

        def store_reading():
            s = os.statvfs("/")
            if s[0] * s[3] < 20000:                    # keep room: a gap beats a full disk
                return
            with open(QUEUE, "a") as f:
                f.write("%d,%.1f\n" % (time.time() + EPOCH_OFFSET, read_temperature()))

        def forward_queue():
            try:
                with open(QUEUE) as f:
                    body = f.read()
            except OSError:
                return True                            # nothing queued
            r = requests.post(URL, data=body, headers={"Content-Type": "text/csv"})
            ok = r.status_code == 200
            r.close()
            if ok:
                os.remove(QUEUE)                       # delete only after the server said yes
            return ok

        last_store = last_send = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if wlan.isconnected() and not clock_set():
                try:
                    ntptime.settime()
                except OSError:
                    pass
            if time.ticks_diff(now, last_store) >= 10000:
                last_store = now
                if clock_set():                        # never store a reading with a made-up time
                    store_reading()
            if time.ticks_diff(now, last_send) >= 60000:
                last_send = now
                if wlan.isconnected():
                    try:
                        print("queue sent" if forward_queue() else "send failed: kept")
                    except OSError:
                        print("send failed: kept")
            time.sleep_ms(200)
      `,
      output: `
        send failed: kept
        send failed: kept
        queue sent
      `,
      notes: ['The file is sent whole. A long outage makes it large: send it in chunks of a few hundred lines, and delete only the lines that were acknowledged.', 'Appending to flash every 10 seconds is acceptable for a short test; for a long deployment keep readings in RAM and write a block every few minutes ([[flash-wear]]).', 'The server must treat the first field (the timestamp) as the key and ignore a line it already holds; otherwise a repeated batch makes duplicates.']
    }
  ],
  examples: [
    {
      title: 'How big must the queue be?',
      q: 'A logger writes a 14-byte line every 10 seconds and must survive a 48-hour outage. How much space does the queue need, and does it fit in a 1.5 MB file system?',
      steps: ['48 hours is 172,800 seconds, so 17,280 readings.', 'At 14 bytes each that is 17,280 × 14 = 241,920 bytes, about 240 kB.', 'The file system has 1.5 MB, so the queue uses about a sixth of it, leaving the 20 kB reserve untouched.'],
      a: 'About 240 kB, which fits easily. The same logger writing every second would need 2.4 MB in 48 hours and would not.'
    }
  ],
  quiz: [
    { q: 'A publish call returned true. What does that prove?', choices: ['The broker stored the message', 'The bytes were handed to the network stack', 'The subscriber received it', 'It will arrive exactly once'], a: 1, why: 'A QoS 0 publish only reports that the bytes left the socket. Nothing confirms that the broker, let alone a subscriber, got them. Delete from the queue on an acknowledgement.' },
    { q: 'The server stored a batch but its acknowledgement was lost, so the device sent it again. What is the best defence?', choices: ['Never retry', 'Make messages idempotent: a key per reading, and a receiver that ignores keys it holds', 'Send every message three times on purpose', 'Use a faster Wi-Fi'], a: 1, why: 'Retries are needed, so duplicates are unavoidable. A receiver that recognises a repeated key makes them harmless.' },
    { q: 'Keeping the queue only in RAM protects the readings if the device suffers a brownout.', a: false, why: 'RAM is cleared at a reset. A queue that must survive resets has to be in flash or on an SD card.' },
    { q: 'A thousand devices lose the same router, which returns after an hour. What reduces the load when they reconnect?', choices: ['Retry every second at full speed', 'Exponential back-off with random jitter', 'Reconnect only at midnight', 'Send everything twice'], a: 1, why: 'Growing, randomised waits spread the reconnections over time, so the server and the cloud are not hit by all devices in the same second.' }
  ],
  applications: [
    'A remote weather station that keeps logging through a week without mobile coverage.',
    'A factory sensor that buffers readings while the plant\'s network is being serviced.',
    'A cellular logger that sends one batch a day to save airtime.',
    'A smart meter that keeps months of readings until its collector comes back.'
  ],
  sources: [
    'OASIS, *MQTT Version 3.1.1*, the sections on quality of service and acknowledgements.',
    'Espressif, *ESP-IDF Programming Guide*, "Virtual Filesystem" and the LittleFS component documentation.',
    'AWS Architecture Blog, *Exponential Backoff and Jitter* (on spreading retries).'
  ],
  sim: 'cd-outage'
},

/* ================================================================ device-identity-and-provisioning */
{
  id: 'device-identity-and-provisioning',
  parent: 'cloud-and-data-management',
  title: 'Device identity and provisioning at scale',
  level: 3,
  short: 'Every device needs a name of its own and a credential of its own. A shared secret for the fleet is one extracted copy away from disaster; per-device keys let you revoke one device and trust the rest.',
  keywords: ['identity', 'provisioning', 'credential', 'certificate', 'X.509', 'pre-shared key', 'claim', 'fleet provisioning', 'revocation', 'MAC address', 'chip ID', 'secure element', 'onboarding', 'factory provisioning'],
  prereq: ['mutual-tls', 'nvs-and-preferences', 'iot-architecture'],
  related: ['aws-iot-and-azure', 'secure-provisioning', 'factory-programming', 'efuse-keys-and-key-storage', 'secure-elements', 'esp-rainmaker', 'credentials-handling'],
  body: `Every device in a fleet needs a name that is its own, and something to prove that it is who it says. The two are different. An **identifier** says who a device claims to be; a **credential** proves it. The chip's MAC address, printed on a sticker and broadcast in every packet, is an identifier: useful for naming, hopeless as proof, because anyone can send it. A secret is a credential.

### What can serve as a credential

| Credential | How it works | Strength | Weak point |
|---|---|---|---|
| One password or token for the fleet | the same secret in all firmware | almost none | one extracted copy compromises every device; revoking it cuts everyone off |
| A secret per device | a different key or token per unit, also known to the server | revoke one device; simple | the server must store the secrets safely; a stolen device reveals its own |
| A certificate and private key per device | the device proves it holds the key in a TLS handshake ([[mutual-tls]]); the server knows only the public certificate | the server stores no secret; revocation; standard tools | a certificate authority, expiry dates, protecting the key |
| The key in hardware | the key lives in a secure element or behind the Digital Signature peripheral: usable, not readable | defeats a copied flash image | extra parts or eFuse steps in production |

### Three things called "provisioning"

Do not mix them. **Network provisioning** tells the device the Wi-Fi name and password ([[wifi-provisioning]]). **Identity provisioning** gives it its own cloud credential. **Claiming** attaches the device to one customer's account, usually with a QR code or a proof-of-possession code ([[secure-provisioning]]).

### Where does the credential come from?

- **At the factory.** Each unit is flashed with its own key and certificate, often in a separate encrypted partition, as the last step of production ([[factory-programming]]). The most secure, but the production line must handle secrets.
- **By claim (fleet provisioning).** Every unit ships with one *claim* credential that can do a single thing, ask the cloud for a unique certificate, and then replaces itself. Cheap in production, but the claim credential is shared, so limit it by time, rate and approval.
- **By the cloud's own service**, such as AWS fleet provisioning or Azure's Device Provisioning Service: the device presents an attestation and is assigned an identity and a destination ([[aws-iot-and-azure]]).

### Lifetimes

Credentials expire, keys leak and devices are resold. Plan for **rotation** (a device fetches a new certificate before the old one expires), **revocation** (the cloud can refuse one device) and **reset** (a factory reset removes the owner's data and credentials). The name can come from the chip ([[random-numbers-and-chip-identity]]).

> [!key] An identifier names a device; a credential proves it. Give every unit its own credential, ideally a private key it never reveals, get it there by factory or claim provisioning, and plan rotation and revocation from the start.`,
  ideas: [
    'An identifier (a MAC address, a serial number) says who a device claims to be; only a secret, held by that device alone, proves it.',
    'A credential shared by the whole fleet is one extracted copy away from compromising every device, and revoking it cuts everyone off.',
    'Network provisioning, identity provisioning and claiming are three different steps.',
    'Plan rotation, revocation and reset from the start; credentials expire, leak and change hands.'
  ],
  pitfalls: [
    'The MAC address is unique, so it can serve as the password — It is printed on stickers and sent in every packet, and anyone can set it. It names a device; it does not prove anything.',
    'Hiding the shared secret in the firmware is enough — Firmware can be read from a chip unless flash encryption is on, and even then one teardown of one device yields the secret for all. Use per-device credentials.',
    'Provisioning is a one-off step done at the factory — Credentials expire and devices change owners. A fleet needs rotation, revocation and a reset path for the whole life of the product.'
  ],
  terms: [
    { term: 'Device identity', also: ['identity'], def: 'The name a device is known by and the credential that proves it, so that the cloud can tell this unit from every other and cut it off alone.' },
    { term: 'Provisioning', also: ['onboarding'], def: 'Giving a device what it needs to join a system: network settings, its own credential, or an owner. The word covers several different steps, so say which one you mean.' },
    { term: 'Pre-shared key', also: ['PSK', 'shared secret'], def: 'A secret known to both the device and the server in advance. It is simple, but the server must store it safely and a stolen device reveals it.' },
    { term: 'Fleet provisioning', also: ['claim-based provisioning'], def: 'Giving each device its own credential after production: it connects with a limited claim credential and asks the cloud to issue a unique certificate.' },
    { term: 'Revocation', also: ['revoke', 'blocklist'], def: 'Making the cloud refuse one credential, for example a stolen device\'s certificate, without disturbing the others.' }
  ],
  choose: {
    good: ['A certificate per device, key kept where it cannot be read, for a fleet or a product', 'A token per device for a small private system', 'Fleet provisioning when you cannot load secrets in the factory'],
    avoid: ['One shared password for the whole fleet', 'Using a MAC address or serial number as proof of identity', 'Credentials with no way to rotate or revoke them'],
    check: ['What an attacker gets from one device taken apart', 'How a single device is revoked, and how long that takes', 'How credentials are renewed before they expire']
  },
  code: [
    {
      title: 'Build a device id and load this unit\'s own credential',
      about: 'Makes a device name from the chip\'s unique address (an identifier, not a secret), then looks in non-volatile storage for a credential that belongs to this unit alone. With none stored, the unit reports that it is not provisioned instead of falling back to a shared secret.',
      needs: 'Any ESP board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [id v] to (join [esp-] (chip unique id))
          print (join [device id: ] (id))
          set [token v] to (load [token])
          if <(length of (token)) = (0)> then
            print [no credential stored: this unit is not provisioned]
          else
            print [credential found, ready to connect]
          end
      `,
      cpp: String.raw`
        #include <Preferences.h>

        Preferences prefs;

        String deviceId() {
          uint64_t mac = ESP.getEfuseMac();          // factory-programmed, unique per chip, NOT secret
          char id[20];
          snprintf(id, sizeof(id), "esp-%012llX", (unsigned long long)mac);   // the byte order is only a name
          return String(id);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.println("device id: " + deviceId());

          prefs.begin("cloud", false);               // the namespace that holds this unit's own credential
          String token = prefs.getString("token", "");
          prefs.end();

          if (token.length() == 0) {
            Serial.println("no credential stored: this unit is not provisioned");
            // start provisioning here, or stop. Never fall back to a secret shared by the fleet.
            return;
          }
          Serial.printf("credential found (%u characters), ready to connect\n", (unsigned)token.length());
        }

        void loop() {}
      `,
      py: String.raw`
        import binascii, machine, esp32

        def device_id():
            return "esp-" + binascii.hexlify(machine.unique_id()).decode().upper()   # unique per chip, NOT secret

        nvs = esp32.NVS("cloud")                     # the namespace that holds this unit's own credential
        buf = bytearray(64)

        def load_token():
            try:
                n = nvs.get_blob("token", buf)
            except OSError:
                return None                          # nothing stored
            return bytes(buf[:n]).decode()

        print("device id:", device_id())
        token = load_token()
        if token is None:
            print("no credential stored: this unit is not provisioned")
            # start provisioning here, or stop. Never fall back to a secret shared by the fleet.
        else:
            print("credential found (%d characters), ready to connect" % len(token))
      `,
      output: `
        device id: esp-A1B2C3D4E5F6
        no credential stored: this unit is not provisioned
      `,
      notes: ['The factory step is the other half: a production tool writes a different token (or a certificate and key) into each unit\'s storage, with prefs.putString("token", …) in Arduino or nvs.set_blob("token", …) followed by nvs.commit() in MicroPython.', 'Plain NVS is readable by anyone who can read the flash. Turn on flash and NVS encryption for credentials that matter ([[nvs-encryption]], [[flash-encryption]]).']
    }
  ],
  quiz: [
    { q: 'Is a chip\'s MAC address a good credential for a cloud service?', choices: ['Yes, it is unique to each chip', 'No: it is an identifier that anyone can read and copy', 'Yes, if it is hashed', 'Only on the ESP32-S3'], a: 1, why: 'A MAC address is printed on the board and broadcast in every packet, and it can be set to any value. It is fine for naming but proves nothing.' },
    { q: 'Which step attaches a device to a particular customer\'s account?', choices: ['Network provisioning', 'Identity provisioning', 'Claiming', 'Flashing'], a: 2, why: 'Network provisioning gives Wi-Fi settings and identity provisioning gives the cloud credential. Claiming links the unit to its owner, often by scanning a code.' },
    { q: 'With a certificate and private key per device, the server must store a secret for every device.', a: false, why: 'The server holds only the public certificate or its fingerprint. The private key never leaves the device, which is the point of the scheme.' },
    { q: '2,000 devices share one API token and one is stolen and its flash read. What is true?', choices: ['Only that device is affected', 'The thief can impersonate every device, and revoking the token cuts them all off', 'Nothing, tokens cannot be read from flash', 'The cloud detects the theft'], a: 1, why: 'One extracted copy of a shared secret works for the whole fleet, and the only remedy, revoking it, disconnects every honest device too.' }
  ],
  applications: [
    'A product line where each unit gets its own certificate at the end of production.',
    'A fleet of loggers that join the cloud by claim certificate and then swap it for a unique one.',
    'A smart plug that is claimed to the buyer\'s account by scanning a QR code.',
    'A resold device that must forget its previous owner after a factory reset.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "ESP Secure Certificate Manager" and "Flash Encryption" (check the current titles for your release).',
    'AWS, *AWS IoT Core Developer Guide*, device provisioning and fleet provisioning; Microsoft, *Device Provisioning Service* documentation.',
    'ETSI EN 303 645, *Cyber Security for Consumer Internet of Things*: no universal default passwords.'
  ],
  sim: 'cd-identity'
},

/* ================================================================ device-shadows-and-twins */
{
  id: 'device-shadows-and-twins',
  parent: 'cloud-and-data-management',
  title: 'Shadows and twins',
  level: 3,
  short: 'A device is often asleep or out of range when someone wants to change it. A shadow (AWS) or twin (Azure) keeps a document in the cloud that stands in for the device: the app writes what it wants, the device catches up and reports what it is.',
  keywords: ['device shadow', 'device twin', 'desired', 'reported', 'delta', 'state', 'eventual consistency', 'AWS IoT shadow', 'Azure device twin', 'retained message', 'version', 'idempotent', 'direct method'],
  prereq: ['mqtt-topics-qos-retain', 'aws-iot-and-azure', 'iot-architecture'],
  related: ['esp-rainmaker', 'store-and-forward', 'device-configuration', 'ota-updates', 'reliability-acks-and-retries', 'webhooks-and-notifications'],
  body: `A device is often asleep, out of range or restarting, yet the person with the phone wants the heating on now. A **device shadow** (AWS) or **device twin** (Azure) solves this by keeping, in the cloud, a document that stands in for the device. The app talks to the document; the device catches up with the document whenever it can.

### Three parts

- **Desired**: what the app wants, for example heating on, target 21.
- **Reported**: what the device last said it is, for example heating off, target 19.
- **Delta**: the difference, which is what the device still has to do.

The app writes the desired state. The cloud works out the delta. If the device is online it receives the delta at once; if not, it gets it on connecting, by asking for the document or because the broker kept the last message. The device applies the change and writes its reported state, and the delta shrinks to nothing. The app reads the **reported** side to learn what is true: that is the difference between "I asked" and "it is done".

### Why this beats a command

A command is lost if nobody is listening and says nothing about the state afterwards. A shadow is **state**: it survives the device's absence, lets many apps read the same truth, and makes retries harmless, because applying "heating on" twice is the same as once. Use the other style, a command that waits for an answer (Azure's direct methods, for example), only for things that must happen now or not at all: unlock the door and tell me.

### Details that matter

- **Versions.** Every update carries a version number. A device ignores a document older than the one it holds, and two apps that write at once do not silently overwrite each other.
- **Who wins?** If someone presses the device's own button, the device reports the new state while the desired state still says otherwise. Decide: the cloud wins (the device re-applies the desired state) or the device wins (it also updates the desired state). Neither is wrong; having no rule is.
- **Size and rate.** Documents are small, a few kilobytes at most, and updates are metered ([[batching-rates-and-cost]]). Keep large or fast data out of the shadow and in telemetry.
- **Without a service.** A retained MQTT message on a "desired" topic, and the device publishing its report as a retained message, is a poor man's shadow in a handful of lines: the program below. [[esp-rainmaker]] builds its parameters on the same idea, with an app in front.

> [!key] A shadow keeps what the app wants (desired) next to what the device says (reported), and the difference (delta) is the work to do. It survives the device being offline, makes retries harmless, and needs a version number and a rule for who wins.`,
  ideas: [
    'A shadow or twin holds the desired state written by apps and the reported state written by the device; the delta is what remains to do.',
    'The device catches up when it reconnects, so a change made while it slept is not lost.',
    'State is safer than a command: applying the same desired state twice must equal applying it once.',
    'Version numbers order updates, and a rule for who wins stops the device and the cloud from fighting.'
  ],
  pitfalls: [
    'Desired state means the device is in that state — Desired is a wish. Only the reported state tells you what the device is doing, and it may lag by hours if the device sleeps.',
    'A shadow is a good place for a stream of readings — It is for state and settings: small, changing slowly. Readings belong in telemetry and a time-series store ([[time-series-data]]).',
    'A command and a shadow update are the same — A command needs the device to be listening now and says nothing afterwards. A shadow update waits for the device and can be read back.'
  ],
  terms: [
    { term: 'Device shadow', also: ['shadow', 'AWS IoT shadow'], def: 'A JSON document kept in AWS IoT Core that holds the desired and reported state of one device, so that apps can read and change the device even when it is offline.' },
    { term: 'Device twin', also: ['twin', 'Azure device twin'], def: 'Azure IoT Hub\'s counterpart of a shadow: a document with desired properties, reported properties and tags for one device.' },
    { term: 'Desired state', also: ['desired'], def: 'The state an application asks for. It is a wish stored in the cloud; the device applies it when it next connects.' },
    { term: 'Reported state', also: ['reported'], def: 'The state the device last said it was in. It is what an application should trust about the device.' },
    { term: 'Delta', also: ['difference', 'state delta'], def: 'The part of the desired state that differs from the reported state: the changes the device still has to make.' }
  ],
  choose: {
    good: ['Settings and switches that must survive the device being offline', 'Several apps and users controlling one device', 'Devices that sleep and wake only now and then'],
    avoid: ['Streams of readings in the shadow', 'Commands that must happen now or not at all: use a direct, acknowledged command', 'Updates without a version number or a rule for conflicts'],
    check: ['What the device does when it wakes and finds a delta', 'Who wins when the device and the app disagree', 'How big the document is and how often it is written']
  },
  code: [
    {
      title: 'A shadow made of two retained MQTT topics',
      about: 'The device subscribes to a "desired" topic, applies a newer version to its LED and its heartbeat interval, and publishes what it is on a "reported" topic. Both topics are retained, so a device that connects late still receives the last wish, and an app can always read the last report.',
      needs: 'An ESP board with an LED (on GPIO2 here), an MQTT broker, and a tool that can publish, such as mosquitto_pub.',
      libs: ['PubSubClient', 'ArduinoJson'],
      blocks: `
        when started
          set pin (2) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [broker.example.com]
          subscribe to [devices/esp32-demo/desired]
          publish (the state as JSON) to topic [devices/esp32-demo/reported] retained

        when message arrives on [devices/esp32-demo/desired]
          if <(version in the message) > (version)> then
            set pin (2) to (led in the message)
            set [period v] to (period in the message)
            set [version v] to (version in the message)
            publish (the state as JSON) to topic [devices/esp32-demo/reported] retained
          end

        every (period) seconds
          publish (uptime in seconds) to topic [devices/esp32-demo/heartbeat]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <ArduinoJson.h>

        #ifndef LED_BUILTIN
        #define LED_BUILTIN 2
        #endif

        const char *DESIRED = "devices/esp32-demo/desired";
        const char *REPORTED = "devices/esp32-demo/reported";

        NetworkClient net;
        PubSubClient mqtt(net);

        bool ledOn = false;
        uint32_t periodS = 30;      // seconds between heartbeats
        uint32_t version = 0;       // version of the last desired state applied

        void report() {
          JsonDocument doc;
          doc["led"] = ledOn;
          doc["period"] = periodS;
          doc["v"] = version;
          char payload[96];
          size_t n = serializeJson(doc, payload, sizeof(payload));
          mqtt.publish(REPORTED, (const uint8_t *)payload, n, true);   // retained: the last report is always there
        }

        void onMessage(char *topic, byte *payload, unsigned int length) {
          JsonDocument doc;
          if (deserializeJson(doc, payload, length)) return;           // not valid JSON: ignore
          uint32_t v = doc["v"] | 0;
          if (v <= version) return;                                    // older or repeated: already applied
          if (doc["led"].is<bool>()) ledOn = doc["led"];
          if (doc["period"].is<int>()) periodS = doc["period"];
          digitalWrite(LED_BUILTIN, ledOn);
          version = v;
          report();
        }

        void ensureMqtt() {
          while (!mqtt.connected()) {
            if (mqtt.connect("esp32-demo")) {
              mqtt.subscribe(DESIRED);        // a retained wish arrives at once: the device catches up
              report();
            } else {
              delay(2000);
            }
          }
        }

        void setup() {
          pinMode(LED_BUILTIN, OUTPUT);
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer("broker.example.com", 1883);
          mqtt.setCallback(onMessage);
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();
          static uint32_t last = 0;
          if (millis() - last >= periodS * 1000UL) {
            last = millis();
            mqtt.publish("devices/esp32-demo/heartbeat", String(millis() / 1000).c_str());
          }
        }
      `,
      py: String.raw`
        import network, time, json
        from machine import Pin
        from umqtt.simple import MQTTClient

        LED = Pin(2, Pin.OUT)
        DESIRED = b"devices/esp32-demo/desired"
        REPORTED = b"devices/esp32-demo/reported"

        state = {"led": False, "period": 30, "v": 0}     # what this device is; v = version of the last desired state applied

        def report():
            client.publish(REPORTED, json.dumps(state), retain=True)   # retained: the last report is always there

        def on_message(topic, msg):
            try:
                doc = json.loads(msg)
            except ValueError:
                return                                   # not valid JSON: ignore
            if doc.get("v", 0) <= state["v"]:
                return                                   # older or repeated: already applied
            state["led"] = bool(doc.get("led", state["led"]))
            state["period"] = int(doc.get("period", state["period"]))
            state["v"] = doc["v"]
            LED.value(state["led"])
            report()

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)

        client = MQTTClient("esp32-demo", "broker.example.com", keepalive=60)
        client.set_callback(on_message)
        client.connect()
        client.subscribe(DESIRED)          # a retained wish arrives at once: the device catches up
        report()

        last = time.ticks_ms()
        while True:
            client.check_msg()
            if time.ticks_diff(time.ticks_ms(), last) >= state["period"] * 1000:
                last = time.ticks_ms()
                client.publish(b"devices/esp32-demo/heartbeat", str(time.ticks_ms() // 1000))
            time.sleep_ms(100)
      `,
      output: `
        you publish (retained)    devices/esp32-demo/desired    {"led":true,"period":10,"v":7}
        the device answers        devices/esp32-demo/reported   {"led":true,"period":10,"v":7}
      `,
      notes: ['The app raises "v" with every change. A message with the same or a lower version is ignored, so a repeated or reordered delivery does no harm.', 'AWS IoT Core uses the same idea with its own reserved topic names for shadows and a document with "desired" and "reported" sections; Azure IoT Hub keeps desired and reported properties in a twin. Check their documents for the exact names.', 'PubSubClient\'s callback shares a buffer with outgoing messages: finish reading the incoming payload before you publish, as the program does.']
    }
  ],
  quiz: [
    { q: 'The app sets "heating on" while the thermostat has been out of range for an hour. What does a shadow do?', choices: ['Drops the request', 'Keeps the desired state and delivers the delta when the device reconnects', 'Switches the heating on over the internet', 'Sends the request sixty times'], a: 1, why: 'The desired state waits in the cloud. When the device reconnects it learns the delta, applies it and reports; until then the app can see that reported still differs.' },
    { q: 'Which part tells you what the device is actually doing?', choices: ['Desired', 'Reported', 'Delta', 'Version'], a: 1, why: 'Desired is a wish and the delta is the gap. Reported is the device\'s own statement of its state.' },
    { q: 'Applying the same desired state twice must give the same result as applying it once.', a: true, why: 'That is idempotence. It makes retries and repeated deliveries harmless, which is exactly what an unreliable link needs.' },
    { q: 'Someone presses the device\'s button, but the desired state still says "off". What is the best design?', choices: ['Decide a rule in advance, cloud wins or device wins, and implement it', 'Ignore the button', 'Let the two fight until one gives up', 'Remove the button'], a: 0, why: 'Both outcomes can be right, but the system must pick one. Without a rule the device and the cloud may flip the state back and forth.' }
  ],
  applications: [
    'A thermostat whose target temperature is changed from a phone while the thermostat sleeps.',
    'A fleet of lamps whose brightness and schedule are set centrally and applied as each lamp connects.',
    'An irrigation controller whose watering plan is a desired document that the controller reports back on.',
    'A configuration update that every device in a fleet picks up on its own next wake-up.'
  ],
  sources: [
    'AWS, *AWS IoT Core Developer Guide*, "AWS IoT Device Shadow service".',
    'Microsoft, *Azure IoT Hub documentation*, "Understand and use device twins".',
    'OASIS, *MQTT Version 3.1.1*, the sections on retained messages.'
  ],
  sim: 'cd-shadow'
},

/* ================================================================ batching-rates-and-cost */
{
  id: 'batching-rates-and-cost',
  parent: 'cloud-and-data-management',
  title: 'Rates, batching and cost',
  level: 2,
  short: 'A message costs energy to wake the radio and a toll to the receiver, whatever its size. Sending ten readings in one message instead of ten messages is the cheapest saving in IoT, paid for with a little delay.',
  keywords: ['batching', 'message rate', 'cost', 'metering', 'free tier', 'battery', 'overhead', 'payload', 'aggregation', 'report interval', 'traffic', 'data volume', 'cellular', 'duty cycle'],
  prereq: ['data-formats', 'battery-life-budget', 'iot-architecture'],
  related: ['store-and-forward', 'aws-iot-and-azure', 'arduino-cloud-blynk-and-friends', 'fast-wifi-reconnect', 'deep-sleep', 'cellular-iot'],
  body: `Every message has two costs that have little to do with its size: the **energy** of waking the radio, and the **toll** the receiving side charges. A reading may be 12 bytes, yet getting it out can take seconds of radio at around 100 mA. Ten readings in one message cost one wake-up instead of ten. That is batching, and it is the cheapest saving in IoT.

### Where the cost of a message hides

- **Energy.** Sending is dominated by getting ready: wake, join Wi-Fi (with DHCP and DNS), open TCP, run the TLS handshake, and only then a few milliseconds of real data. With fast reconnect and a fixed address the whole thing is under a second; with DHCP and a fresh handshake it can take several ([[fast-wifi-reconnect]]). A battery device spends most of its charge here, not on the sensor ([[battery-life-budget]]).
- **Overhead.** MQTT, TCP/IP and TLS headers add roughly a hundred bytes whatever the payload ([[data-formats]]).
- **Metering.** Cloud services count messages, usually in blocks of a few kilobytes: 100 messages of 100 bytes are 100 billed units, while one message of 10 kB is two or three.
- **Rate limits.** Free tiers refuse more than so many messages a minute or a day.
- **Mobile data.** Cellular plans count bytes, headers included ([[cellular-iot]]).

### The trade: freshness against cost

Batching means the newest reading is up to one batch old when it arrives. A reading every 10 seconds in batches of 6 is one message a minute, with data at most a minute late. Choose by what the receiver can tolerate: an alarm cannot wait, a temperature trend can. Let an **event** break the rule: send at once when a threshold is crossed, and batch the ordinary readings.

### Two ways to batch

Send after a **count** (every 6 readings) or after a **time** (every minute, whatever has gathered). The time rule bounds the delay, the count caps the size, and a good device uses both: "6 readings or 60 seconds, whichever comes first". Each reading carries its own timestamp, or the batch carries a start time and an interval, so waiting loses nothing ([[time-series-data]]). Keep the unsent readings somewhere that survives a hiccup, and bound the size ([[store-and-forward]]).

### The numbers

A device that reports every 5 minutes sends 8,640 messages a month. Each carries 12 bytes of reading inside perhaps 160 bytes of everything else: about 1.5 MB a month. Batched six at a time it sends 1,440 messages and about 0.33 MB: a sixth of the wake-ups, a fifth of the traffic. The calculators below do this sum for your own figures, and [the battery calculator](#/tools/espcalc/battery) turns the wake-ups into days of battery.

> [!key] Each message costs a radio wake-up, a header and a toll, whatever its size. Batch readings by count and by time, let events go at once, and accept the delay in return for a fraction of the energy, traffic and bill.`,
  ideas: [
    'A message costs energy to wake and connect the radio, around a hundred bytes of headers and a metered toll, almost regardless of its size.',
    'Batching several readings in one message divides all three costs by the batch size, at the price of up to one batch of delay.',
    'Batch by count and by time together, and let urgent events go at once.',
    'Free tiers and mobile plans limit rates and volumes, so estimate messages and bytes a month before you build.'
  ],
  pitfalls: [
    'Smaller payloads are the way to save battery — The radio spends most of its time and charge getting ready, not sending bytes. Fewer wake-ups save far more than fewer bytes.',
    'Batching only delays data, so it is never worth it — For trends and logs a minute of delay is irrelevant. Send alarms and events at once and batch the rest.',
    'The free tier allows a million messages, so I am safe — Check the per-minute and per-day limits and the metering block size too. Several tiny messages may count as many units.'
  ],
  terms: [
    { term: 'Batching', also: ['aggregation', 'message batching'], def: 'Collecting several readings and sending them together in one message, so that the cost of connecting and of headers is shared among them.' },
    { term: 'Message metering', also: ['metering', 'billing unit'], def: 'The way a cloud service counts what you use: messages, usually rounded up to blocks of a few kilobytes, plus connection time and rule actions.' },
    { term: 'Overhead', also: ['framing overhead', 'header overhead'], def: 'The bytes a message carries besides the data: the MQTT, TCP/IP and TLS headers, which together are about a hundred bytes.' },
    { term: 'Report interval', also: ['reporting interval', 'send interval'], def: 'The time between messages from a device. It sets message counts, the age of the newest data and, for a battery device, how long the battery lasts.' }
  ],
  choose: {
    good: ['Batching trend data by count and by time, with a small delay you can accept', 'Sending alarms and threshold events at once, outside the batch', 'Estimating messages and bytes a month before choosing a plan'],
    avoid: ['One message per reading on a battery device or a metered plan', 'Batching safety alarms', 'Batches with no size limit and no timestamps'],
    check: ['The oldest data you can tolerate at the receiver', 'The service\'s metering block size and rate limits', 'What a failed batch does to the readings in it']
  },
  code: [
    {
      title: 'Batch six readings into one message',
      about: 'Takes a reading every 10 seconds, keeps them in a list, and publishes the whole list as one JSON message once six have gathered. Each reading carries its own timestamp. If the publish fails the list is kept for the next try, up to a limit.',
      needs: 'Any Wi-Fi ESP board and an MQTT broker you can reach.',
      libs: ['PubSubClient', 'ArduinoJson'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]
          connect to MQTT broker [broker.example.com]
          set [batch v] to (empty list)

        every (10) seconds
          add (JSON text: t (current time), temp (read temperature)) to [batch v]
          if <(length of (batch)) ≥ (6)> then
            publish (JSON text: id (esp32-demo), r (batch)) to topic [sensors/esp32-demo/batch]
            set [batch v] to (empty list)
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <ArduinoJson.h>

        const char *DEVICE_ID = "esp32-demo";
        const char *TOPIC = "sensors/esp32-demo/batch";
        const int BATCH = 6;                 // readings per message
        const int MAX_KEEP = 60;             // never keep more unsent readings than this
        const uint32_t SAMPLE_MS = 10000;    // one reading every 10 s: one message a minute

        NetworkClient net;
        PubSubClient mqtt(net);
        JsonDocument batch;                  // rebuilt after every send
        JsonArray readings;

        float readTemperature() {
          return 21.5;                       // stand-in: replace with your sensor
        }

        void ensureMqtt() {
          while (!mqtt.connected()) {
            if (!mqtt.connect(DEVICE_ID)) delay(2000);
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");
          while (time(nullptr) < 1700000000) delay(200);
          mqtt.setServer("broker.example.com", 1883);
          mqtt.setBufferSize(1024);          // a batch is longer than the default 256 bytes
          readings = batch["r"].to<JsonArray>();
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();
          static uint32_t last = 0;
          if (millis() - last >= SAMPLE_MS) {
            last += SAMPLE_MS;
            JsonObject r = readings.add<JsonObject>();
            r["t"] = (uint32_t)time(nullptr);          // each reading keeps its own time
            r["temp"] = readTemperature();
            if (readings.size() > MAX_KEEP) readings.remove(0);   // bounded: drop the oldest
            if (readings.size() >= BATCH) {
              batch["id"] = DEVICE_ID;
              String text;
              serializeJson(batch, text);
              if (mqtt.publish(TOPIC, text.c_str())) {         // on success start a new batch
                batch.clear();
                readings = batch["r"].to<JsonArray>();
              }
            }
          }
        }
      `,
      py: String.raw`
        import network, ntptime, time, json
        from umqtt.simple import MQTTClient

        DEVICE_ID = "esp32-demo"
        TOPIC = b"sensors/esp32-demo/batch"
        BATCH = 6                            # readings per message
        MAX_KEEP = 60                        # never keep more unsent readings than this
        SAMPLE_MS = 10000                    # one reading every 10 s: one message a minute
        EPOCH_OFFSET = 946684800             # MicroPython counts from 2000, Unix time from 1970

        def read_temperature():
            return 21.5                      # stand-in: replace with your sensor

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)
        ntptime.settime()

        client = MQTTClient(DEVICE_ID, "broker.example.com", keepalive=60)
        client.connect()

        batch = []
        last = time.ticks_ms()
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= SAMPLE_MS:
                last = time.ticks_add(last, SAMPLE_MS)
                batch.append({"t": time.time() + EPOCH_OFFSET, "temp": read_temperature()})   # each reading keeps its own time
                del batch[:-MAX_KEEP]        # bounded: drop the oldest
                if len(batch) >= BATCH:
                    try:
                        client.publish(TOPIC, json.dumps({"id": DEVICE_ID, "r": batch}))
                        batch = []           # on success start a new batch
                    except OSError:
                        client.connect()     # the link dropped: keep the batch and try again next time
            time.sleep_ms(100)
      `,
      output: `
        sensors/esp32-demo/batch  {"r":[{"t":1791115200,"temp":21.5},{"t":1791115210,"temp":21.5}, … ],"id":"esp32-demo"}
      `,
      notes: ['The six readings travel in one message of about 150 bytes plus headers, instead of six messages of 50 bytes plus headers each.', 'To send an alarm at once, publish it on its own topic outside this list: do not wait for the batch.', 'A false return of publish() only means the bytes did not leave. For a real acknowledgement see [[store-and-forward]].']
    }
  ],
  formulas: [
    {
      name: 'Messages per month',
      expr: 'N = M/(T*b)',
      tex: 'N = \\frac{M}{T\\,b}',
      vars: {
        N: { name: 'messages per month', q: 'count' },
        M: { name: 'one month (30 days)', q: 'time', unit: 's', value: 2592000, fixed: true },
        T: { name: 'time between readings', q: 'time', unit: 'min', value: 5 },
        b: { name: 'readings per message', q: 'count', value: 1, min: 1, int: true }
      },
      solveFor: 'N',
      note: 'The count of messages the service sees: this is what metering and rate limits are applied to.',
      stories: { N: 'A device takes a reading every {T} and sends {b} readings in each message. How many messages does it send in a 30-day month?' }
    },
    {
      name: 'Traffic per month',
      expr: 'D = M*(b*r + h)/(T*b*1000000)',
      tex: 'D = \\frac{M\\,(b\\,r + h)}{T\\,b \\cdot 10^{6}}',
      vars: {
        D: { name: 'traffic per month', unit: 'MB' },
        M: { name: 'one month (30 days)', q: 'time', unit: 's', value: 2592000, fixed: true },
        T: { name: 'time between readings', q: 'time', unit: 's', value: 300 },
        b: { name: 'readings per message', q: 'count', value: 1, min: 1, int: true },
        r: { name: 'bytes per reading', unit: 'B', value: 12 },
        h: { name: 'bytes of headers per message', unit: 'B', value: 160 }
      },
      solveFor: 'D',
      note: 'Bytes handed to the network, headers included, before link-layer overhead. Raise b and the header share h/(b·r) falls.',
      stories: { D: 'A device sends a reading of {r} every {T}, {b} readings per message, with {h} of headers on each message. How many megabytes of traffic does it generate in a month?' }
    }
  ],
  examples: [
    {
      title: 'Six readings at a time',
      q: 'A sensor reads every 5 minutes, 12 bytes per reading, and each message carries about 160 bytes of headers. Compare one reading per message with six per message over a 30-day month.',
      steps: ['One per message: $N = 2{,}592{,}000 / 300 = 8{,}640$ messages; traffic $8{,}640 \\times (12 + 160) = 1.49$ MB.', 'Six per message: $N = 2{,}592{,}000 / 1{,}800 = 1{,}440$ messages; each is $6 \\times 12 + 160 = 232$ bytes, so about $0.33$ MB.', 'The newest reading is now up to 25 minutes old when it arrives (five readings wait for the sixth).'],
      a: 'Messages fall to a sixth (8,640 to 1,440) and traffic to a fifth (1.49 to 0.33 MB), at the cost of up to 25 minutes of delay. The radio wakes a sixth as often, which is what saves the battery.'
    }
  ],
  quiz: [
    { q: 'A battery sensor reads every minute and sends each reading at once. What is the most effective way to extend the battery life?', choices: ['Shorten each message by 5 bytes', 'Send every ten readings in one message', 'Use a lower baud rate', 'Print less to the serial port'], a: 1, why: 'The radio\'s time and charge go on waking, joining and handshaking, not on the few bytes. One wake-up for ten readings cuts that cost to a tenth.' },
    { q: 'Which messages should NOT wait for a batch?', choices: ['Temperature readings every minute', 'A "water leak detected" event', 'Battery voltage once an hour', 'Signal-strength samples'], a: 1, why: 'A leak alarm must reach someone now. Ordinary readings can be batched; urgent events go out immediately on their own.' },
    { q: 'A cloud service meters messages in 5 KB blocks. Fifty readings of 100 bytes each, sent as fifty messages, count as…', choices: ['One block', 'Fifty blocks', 'Five blocks', 'Half a block'], a: 1, why: 'Every message is rounded up to a whole block, so fifty tiny messages are fifty billed units; together they would fit in one.' },
    { q: 'Batching reduces the headers sent per reading.', a: true, why: 'The roughly 100 to 160 bytes of MQTT, TCP/IP and TLS headers are paid once per message, so six readings in one message share one set of headers.' }
  ],
  applications: [
    'A battery weather station that sends one message every half hour carrying six readings.',
    'A cellular logger that sends a daily batch to keep its data plan small.',
    'A fleet on a metered cloud tier, tuned to stay under the free message allowance.',
    'A greenhouse controller that batches temperatures but sends a frost alarm at once.'
  ],
  sources: [
    'AWS, *AWS IoT Core pricing and quotas* and Microsoft, *Azure IoT Hub quotas and throttling*: how messages are metered and limited (read the current pages).',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver" and "Sleep Modes": the cost of a connection and of waking.',
    'OASIS, *MQTT Version 3.1.1*, the fixed header and packet formats.'
  ],
  sim: 'cd-rate'
},

/* ================================================================ privacy-and-data-protection */
{
  id: 'privacy-and-data-protection',
  parent: 'cloud-and-data-management',
  title: 'Privacy and data protection',
  level: 2,
  short: 'A chip that counts watts, movement, voices or phones is recording how people live. Collect less, keep it local, keep it for less time, say what you take, and protect it: and know that the law has something to say.',
  keywords: ['privacy', 'GDPR', 'personal data', 'data protection', 'minimisation', 'pseudonymisation', 'anonymisation', 'consent', 'retention', 'MAC address', 'smart meter', 'NILM', 'Data Act', 'right to erasure'],
  prereq: ['iot-architecture', 'time-series-data', 'device-identity-and-provisioning'],
  related: ['local-first', 'regulations-cra-and-red', 'cameras-and-the-law', 'wifi-network-security', 'tls-on-esp', 'mains-energy-monitoring'],
  body: `An ESP32 that measures the temperature of a greenhouse is harmless. The same chip counting watts, noticing movement, listening for a wake word or seeing which phones are near is collecting a record of how a person lives. **Personal data** is any information about an identified or identifiable person, and in many places the law, in Europe the GDPR, has something to say about it. (This page is orientation, not legal advice: the rules differ by country, by use and by whom you collect from.)

### What counts

The obvious: names, photos, voice recordings, locations. The less obvious: **when someone is at home** (movement, doors, energy use); **what they do** (a power trace at one-second resolution shows the kettle, the oven and the television, as the simulation shows); **who they are with** (Bluetooth and Wi-Fi presence); and identifiers tied to a person, such as MAC and IP addresses. A device in your own home for your own use generally falls outside the GDPR as a purely personal or household activity. A product you sell, a device in an office or a rented flat, or a camera that sees guests or a neighbour's garden does not.

### Principles worth designing by

- **Collect less.** Sample at the coarsest rate that does the job, summarise on the device ([[iot-architecture]]), and do not send what you will not use.
- **Keep it local** where you can ([[local-first]]).
- **Keep it for less time**: a retention rule that really deletes ([[time-series-data]]).
- **Say what you collect**, in words the owner understands, and ask before optional data such as analytics or voice recordings.
- **Protect it**: TLS in transit ([[tls-on-esp]]), access limited per device and per user, encryption of what you store.
- **Let it go**: a way to export and delete the owner's data, and a factory reset that wipes it, Wi-Fi credentials and tokens included.

### Common mistakes

- **"Anonymous" data that is only pseudonymous.** A hashed MAC address is a stable label that still follows the same person around, and the hash can be reversed by trying every possible address. Pseudonymised data is still personal data.
- **Sending more than needed** because the API accepts it: the Wi-Fi name, the owner's name, the exact position.
- **Recording by default.** Cameras and microphones record people who did not agree ([[cameras-and-the-law]]).
- **Verbose logs** with SSIDs and tokens, sent to a shared server.

### Rules from the other side

In the EU, the Data Act (applicable since September 2025) gives users rights over the data their connected products generate, and the Cyber Resilience Act and the security rules of the Radio Equipment Directive require basic protections in products sold there ([[regulations-cra-and-red]]). Other places have their own, such as California's privacy law and the UK's. Before shipping a product that touches personal data, ask someone qualified.

> [!key] Presence, energy use, voices and phone sightings are personal data. Collect less, process at the edge, keep it local and short-lived, say what you take, protect it, and let the owner export and erase it. A hashed identifier is not anonymous.`,
  ideas: [
    'Personal data is anything about an identifiable person; presence, energy use and device identifiers can all qualify.',
    'Fine-grained data reveals more than coarse data: the sampling rate itself is a privacy decision.',
    'Minimise: collect less, process at the edge, keep it local and keep it briefly.',
    'Pseudonymised data, such as a hashed MAC address, is still personal data.'
  ],
  pitfalls: [
    'Hashing the MAC address makes the data anonymous — The hash is the same every time, so it still tracks one person, and it can be reversed by trying every possible address. It is pseudonymous at best.',
    'A temperature sensor cannot reveal anything private — On its own, no. But temperature, door and power data together show when a household is away, asleep or at work.',
    'The GDPR does not apply to hobby projects, so I can ignore privacy — Purely household use is exempt, but a product for others, a device in a workplace, or a camera that sees other people is not. Good practice costs little in any case.'
  ],
  terms: [
    { term: 'Personal data', also: ['personal information'], def: 'Any information relating to an identified or identifiable person. Presence, location, energy use patterns and device identifiers can all be personal data.' },
    { term: 'Data minimisation', also: ['collect less', 'data minimization'], def: 'The principle of collecting and keeping only the data you need for a stated purpose, no more and no longer.' },
    { term: 'Pseudonymisation', also: ['pseudonymization'], def: 'Replacing an identifier by a label, such as a hash, so that data cannot be tied to a person without extra information. It is not anonymisation: the data stays personal.' },
    { term: 'GDPR', also: ['General Data Protection Regulation'], def: 'The European Union\'s data protection law. It sets principles such as minimisation and purpose limitation, and gives people rights of access and erasure.' },
    { term: 'Right to erasure', also: ['right to be forgotten'], def: 'A person\'s right under the GDPR, in many cases, to have their personal data deleted. A product should make deletion possible for the owner.' }
  ],
  choose: {
    good: ['Processing on the device and sending only summaries', 'Local storage with a retention limit', 'Clear, short wording about what is collected, and an opt-in for extras'],
    avoid: ['Raw high-rate data "in case it is useful"', 'Hashed identifiers sold as anonymous data', 'Cameras and microphones that record by default'],
    check: ['Who the data is about, and whether they know', 'How long it is kept and how it is deleted', 'What a factory reset removes']
  },
  quiz: [
    { q: 'Which is the most likely to be personal data?', choices: ['A temperature in a greenhouse', 'A one-second power trace from a person\'s home', 'The firmware version of a device', 'The chip model'], a: 1, why: 'A fine power trace shows when people are home and which appliances they use, so it relates to an identifiable person\'s life. A greenhouse temperature or a version number does not.' },
    { q: 'Hashing a MAC address before storing it makes the data anonymous.', a: false, why: 'The same address always gives the same hash, so the person can still be tracked, and the small space of addresses lets the hash be reversed. It is pseudonymised data, which remains personal.' },
    { q: 'Which design best follows data minimisation for a room-presence sensor?', choices: ['Send raw movement events every second for later study', 'Decide occupied or empty on the device and send that every five minutes', 'Record continuous audio and decide later', 'Send the data to every partner'], a: 1, why: 'The device answers the question it was built for and discards the raw detail. Less data leaves the room, so less can leak or be misused.' },
    { q: 'You keep the pictures of your own home camera at home. Is a camera product you sell treated the same way?', choices: ['Yes, exactly the same', 'No: selling it, or filming other people, brings obligations the household case does not', 'Yes, if the pictures are encrypted', 'No, because cameras are exempt'], a: 1, why: 'The household exemption covers purely personal activity. A product placed on the market, or monitoring people beyond the household, falls under data protection and product rules.' }
  ],
  applications: [
    'A smart-meter reader that reports energy at a 15-minute resolution rather than every second.',
    'A presence sensor that sends "occupied" or "empty" instead of motion events.',
    'A voice-assistant device that processes the wake word locally and sends audio only after it.',
    'A product with an "erase my data" button and a factory reset that clears credentials.'
  ],
  sources: [
    'Regulation (EU) 2016/679, the General Data Protection Regulation: Article 5 (principles) and Article 25 (data protection by design and by default).',
    'Regulation (EU) 2023/2854, the Data Act, on access to the data generated by connected products.',
    'ETSI EN 303 645, *Cyber Security for Consumer Internet of Things*: the provisions on personal data.'
  ],
  sim: 'cd-privacy'
},

/* ================================================================ local-first */
{
  id: 'local-first',
  parent: 'cloud-and-data-management',
  title: 'Local first: no cloud at all',
  level: 2,
  short: 'Keep the devices, the broker, the storage and the dashboard on your own network, so that everything works with the internet unplugged and no company\'s server decides how long your lamp lives. The cloud becomes an option, not a requirement.',
  keywords: ['local first', 'local control', 'offline', 'Home Assistant', 'Mosquitto', 'VPN', 'WireGuard', 'port forwarding', 'self-hosted', 'vendor lock-in', 'mDNS', 'no cloud', 'remote access', 'hybrid'],
  prereq: ['iot-architecture', 'mqtt', 'mdns'],
  related: ['home-assistant-integration', 'esphome', 'privacy-and-data-protection', 'wifi-network-security', 'matter', 'web-server-on-esp', 'tasmota'],
  body: `Most "smart" devices depend on a company's server: the app talks to the cloud, the cloud talks to the lamp, and when the company changes its terms, charges a fee, closes down, or simply when the internet fails, the lamp is a paperweight. **Local first** turns this round. The devices, the broker, the storage and the dashboard sit on your own network and work without the internet; the cloud is an option, not a requirement.

### What it looks like

A typical home system: ESP boards publish MQTT to a Mosquitto broker, or talk to Home Assistant directly through [[esphome]]; Home Assistant or Node-RED stores, shows and reacts; a database such as InfluxDB keeps the history; a phone on the home Wi-Fi uses it. The internet is used for the time (NTP), for updates you choose to fetch, and for notifications you choose to send out. Zigbee, Thread and [[matter]] are designed this way: local control is the default.

### Why choose it

- **It works when the internet does not.** Switching a light should not need a round trip across a continent. Latency is milliseconds, not a few hundred of them.
- **Privacy.** The data does not leave the building unless you send it ([[privacy-and-data-protection]]).
- **No subscription and no shutdown risk.** Google's IoT Core closed in 2023, and the clouds of smaller companies come and go.
- **Ownership.** Open protocols (MQTT, HTTP, mDNS) and your own data format mean you can change a part without changing the rest.

### What it costs

You run a server (a Raspberry Pi or a small PC), keep it updated and back it up. You set up remote access yourself. You give up the polished phone app of a vendor. And "local" does not mean "safe": a device on your network can still be attacked, so keep IoT devices on their own network segment and give each its own credentials ([[wifi-network-security]]).

### Remote access, done safely

You will want to see the house from outside. Avoid **port forwarding** the broker or the dashboard to the internet: scanners find open ports within hours. Use a **VPN** (WireGuard is a common choice) so that your phone joins the home network, or a relay service you trust, with a login and a second factor. Keep the broker closed to outsiders and require a user name and password on it.

### A hybrid is fine

Local control and storage, plus an optional cloud for push notifications, off-site backup or sharing. The test is simple: **unplug the internet**. Everything you rely on every day should still work. The program below shows the smallest local-first device: it answers questions itself, with no cloud in sight.

> [!key] Local first means devices, broker, storage and dashboard on your own network, working with the internet unplugged. It buys speed, privacy and independence, costs you a server to maintain, and needs a VPN, not open ports, for access from outside.`,
  ideas: [
    'In a local-first system the devices, broker, storage and dashboard are on your own network and work without the internet.',
    'It gives low latency, privacy and independence from a vendor\'s server or terms; it costs you running and securing a server.',
    'Reach it from outside through a VPN or a trusted relay, never by forwarding the broker or dashboard to the internet.',
    'A hybrid keeps local control and adds optional cloud services; the test is to unplug the internet and see that daily use still works.'
  ],
  pitfalls: [
    'On my own network the devices cannot be attacked — A compromised phone, laptop or device on the same network can reach everything on it. Separate the IoT devices, use per-device credentials and keep the software updated.',
    'Port forwarding is the easy way to reach it from outside — Open ports on the router are found and probed within hours. A VPN gives the same convenience without exposing the service.',
    'Local first means no internet at all — The internet is still useful for time, updates and notifications. The point is that nothing you depend on every day requires it.'
  ],
  terms: [
    { term: 'Local first', also: ['local control', 'self-hosted'], def: 'A design in which the devices and the services that control and store their data run on the owner\'s own network and keep working without the internet.' },
    { term: 'VPN', also: ['virtual private network', 'WireGuard'], def: 'An encrypted tunnel that lets a phone or laptop outside the house join the home network as if it were inside it, so no service has to be exposed to the internet.' },
    { term: 'Port forwarding', also: ['port mapping', 'NAT forwarding'], def: 'A router setting that sends connections arriving from the internet on a chosen port to a device inside the network. It exposes that device to everyone on the internet.' },
    { term: 'Vendor lock-in', also: ['cloud dependency', 'lock-in'], def: 'Dependence on one company\'s service, so that its price, terms or closure decides whether your devices work.' }
  ],
  choose: {
    good: ['A house, workshop or farm that must keep working with the internet down', 'Data you do not want in a third party\'s hands', 'Anyone who can maintain a small server, or has someone who can'],
    avoid: ['Opening the broker or dashboard to the internet', 'Local first with nobody to update and back up the server', 'Devices that stop working when their vendor\'s cloud does'],
    check: ['What still works with the internet unplugged', 'How you reach it from outside, and who else can', 'Where the backups are, and when you last restored one']
  },
  code: [
    {
      title: 'A device that answers by itself',
      about: 'Joins the home network, announces itself as esp32-demo.local and answers a request for /api/reading with the latest reading as JSON. There is no cloud and no broker: anything on the same network, from a script to Home Assistant, can ask.',
      needs: 'Any Wi-Fi ESP board and a computer on the same network (open http://esp32-demo.local/api/reading in a browser, or use curl).',
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          sync time from [pool.ntp.org]
          start web server on port (80)

        when request for [/api/reading] arrives
          respond with (JSON text: id (esp32-demo), t (current time), temp (read temperature))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>
        #include <ESPmDNS.h>

        WebServer server(80);

        float readTemperature() {
          return 21.5;                                  // stand-in: replace with your sensor
        }

        void sendReading() {
          char json[96];
          snprintf(json, sizeof(json), "{\"id\":\"esp32-demo\",\"t\":%lu,\"temp\":%.1f}", (unsigned long)time(nullptr), readTemperature());
          server.send(200, "application/json", json);
        }

        void setup() {
          Serial.begin(115200);
          WiFi.setHostname("esp32-demo");               // before connecting
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");
          MDNS.begin("esp32-demo");                     // reachable as esp32-demo.local
          server.on("/api/reading", sendReading);
          server.begin();
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import network, socket, time, json, ntptime

        EPOCH_OFFSET = 946684800                        # MicroPython counts from 2000, Unix time from 1970

        def read_temperature():
            return 21.5                                 # stand-in: replace with your sensor

        network.hostname("esp32-demo")                  # reachable as esp32-demo.local
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(200)
        ntptime.settime()

        server = socket.socket()
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(("0.0.0.0", 80))
        server.listen(2)

        while True:
            conn, addr = server.accept()
            conn.settimeout(2)
            try:
                conn.recv(512)                          # read and ignore the request: one answer serves every address
                body = json.dumps({"id": "esp32-demo", "t": time.time() + EPOCH_OFFSET, "temp": read_temperature()})
                conn.send("HTTP/1.0 200 OK\r\nContent-Type: application/json\r\n\r\n" + body)
            except OSError:
                pass
            conn.close()
      `,
      output: `
        $ curl http://esp32-demo.local/api/reading
        {"id":"esp32-demo","t":1791115200,"temp":21.5}
      `,
      notes: ['Anyone on the Wi-Fi can read this. A read-only temperature is fine; anything that switches or changes something needs authentication ([[web-interface-security]]).', 'The .local name needs mDNS on the computer asking (built into macOS, Windows 10 and later, and most Linux desktops); otherwise use the device\'s IP address ([[mdns]]).', 'The MicroPython version serves one client at a time and waits for it; that is enough for a polling script, and a real server uses asyncio ([[asyncio-in-micropython]]).']
    }
  ],
  quiz: [
    { q: 'What is the safest way to reach a home dashboard from outside the house?', choices: ['Forward the dashboard\'s port on the router', 'A VPN into the home network', 'Publish its address with a long random path', 'Turn off the password to make it quick'], a: 1, why: 'A VPN makes your phone part of the home network without exposing any service to the internet. Open ports and secret addresses are found by scanners.' },
    { q: 'What is the practical test of a local-first system?', choices: ['It uses the newest chips', 'With the internet unplugged, everything you rely on daily still works', 'It uses MQTT', 'It needs no Wi-Fi'], a: 1, why: 'Local first is about dependence. If daily use survives an unplugged internet connection, nothing essential depends on someone else\'s server.' },
    { q: 'Devices on your own network cannot be attacked.', a: false, why: 'Anything else on the network, a compromised laptop or another IoT device, can reach them. Segment the network, use per-device credentials and keep software current.' },
    { q: 'Which of these is a reasonable use of the cloud in a hybrid design?', choices: ['Switching the lamp in the same room', 'Push notifications and an off-site backup', 'Storing the only copy of the history', 'Running the automations'], a: 1, why: 'Notifications and backups add value without being needed for daily operation. Switching and automations must keep working locally.' }
  ],
  applications: [
    'A Home Assistant house with ESPHome devices and a Mosquitto broker that keeps working through an internet outage.',
    'A workshop whose temperature alarms and logs run on a single mini-PC.',
    'A farm on a poor mobile connection that collects sensor data on site and uploads a summary at night.',
    'A classroom network with no internet access at all.'
  ],
  sources: [
    'Home Assistant documentation: the MQTT integration, and the pages on remote access.',
    'Eclipse Mosquitto documentation: listeners, authentication and access control.',
    'WireGuard documentation, the quick-start guide to its VPN.'
  ],
  sim: { id: 'cd-path', params: { arch: 'local' } }
}
);
