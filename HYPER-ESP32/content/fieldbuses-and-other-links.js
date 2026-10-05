/* HYPER-ESP32 · content/fieldbuses-and-other-links.js
 *
 * Wired Communication → "CAN, RS-485, USB and Ethernet": CAN bus (TWAI), RS-485 and Modbus, USB on an ESP as device and
 * as host, Ethernet, I2S, SDIO and SD/MMC, DMX512 and MIDI, parallel interfaces, and long cables with isolation.
 * Simulations: sims/fieldbuses-and-other-links.js (ids start with "fb-").
 */
Hyper.add(
/* ================================================================ can-bus-twai */
{
  id: 'can-bus-twai',
  parent: 'fieldbuses-and-other-links',
  title: 'CAN bus (TWAI)',
  level: 2,
  short: 'Two wires, many nodes, no master: any node may send a short message whose identifier says what it is, and when two start at once the lower number wins without a collision. The ESP32 family calls its controller TWAI; it needs a transceiver chip and a terminated pair of wires.',
  keywords: ['CAN', 'TWAI', 'CAN bus', 'controller area network', 'transceiver', 'SN65HVD230', 'TJA1050', 'TJA1051', 'arbitration', 'identifier', 'bit stuffing', 'CRC', 'termination', '120 ohm', 'CANH', 'CANL', 'bus-off', 'ISO 11898', 'OBD-II', 'acceptance filter', 'twai_transmit', 'dominant', 'recessive'],
  prereq: ['serial-communication-basics', 'uart', 'three-volt-logic'],
  related: ['rs-485', 'modbus', 'isolation-and-long-cables', 'choosing-a-bus', 'olimex-industrial-boards', 'relay-and-industrial-boards'],
  body: `A car has dozens of small computers — engine, brakes, doors, dashboard — and they must share facts without a wire between every pair. **CAN**, the *controller area network*, was made for that in the 1980s: **two wires, any number of nodes, no master**. Every node hears every message. A message has no address, only an **identifier** that says what it *is* ("engine speed", "door open"), and each node picks the identifiers it cares about. Espressif calls its controller **TWAI**, the two-wire automotive interface; it speaks classic CAN (ISO 11898-1).

### What is on the wires
- The chip has no CAN-level pins. Its TX and RX go to a **transceiver** chip, which makes the differential pair **CANH** and **CANL**. Pick one that runs at 3.3 V (SN65HVD230) or has a 3.3 V logic input; the TJA1050 is a 5 V part whose receive output needs a divider.
- Two bus states: **dominant** (logic 0, CANH about 3.5 V and CANL about 1.5 V on a 5 V transceiver) and **recessive** (logic 1, both near 2.5 V). If one node sends dominant while another sends recessive, the bus is dominant: a wired AND.
- **120 Ω across the pair at each end of the cable**, and nowhere else. With the power off, a meter across CANH and CANL reads about 60 Ω.
- All nodes share one bit rate: 125, 250, 500 kbit/s or 1 Mbit/s. Rule of thumb: 1 Mbit/s to about 40 m, 500 kbit/s to about 100 m; slower goes farther.

### A frame
A frame is **a start bit, the identifier (11 bits, or 29 in the extended format), control bits with a length of 0 to 8, up to 8 data bytes, a 15-bit CRC, an acknowledge slot and seven closing bits**. After five equal bits the sender inserts one of the opposite level (*bit stuffing*) so receivers keep the beat; they remove it again. Every receiver that read the frame correctly pulls the acknowledge slot dominant. A frame with two data bytes takes about 65 bit times: 130 µs at 500 kbit/s.

### Arbitration and errors
When two nodes begin together, each sends its identifier and listens. A node that sends recessive but reads dominant has lost: it falls silent and retries after the winner. The **lowest identifier wins**, no frame is damaged — so urgent messages get low numbers. Each node also counts its own errors; one that fails too often becomes *error passive*, then **bus-off**, and leaves the bus until told to recover.

### On an ESP
Most chips have the controller (not the C2 or C61). The Arduino core has no wrapper: the sketch calls the ESP-IDF driver, as the example does. MicroPython has no CAN driver for the ESP32.

> [!warn] Read, do not write, on a vehicle. A car's bus carries brake, airbag and engine messages; a node that sends a wrong frame, or just floods the bus, can disable safety systems. Connect to a diagnostic port only with a listen-only node, on a car you own.

> [!key] CAN is a two-wire, master-less bus where every node hears every message and the lowest identifier always wins arbitration. It needs a transceiver, one bit rate for everybody, and 120 Ω at each end.`,
  ideas: [
    'CAN is a broadcast bus: a message has an identifier that says what it means, not an address of who should read it.',
    'The bus is a wired AND: dominant (0) beats recessive (1), and that is how two nodes starting together sort themselves out without losing a frame.',
    'An ESP needs a CAN transceiver chip, one shared bit rate, and 120 Ω terminators at the two ends of the cable.',
    'Frames hold at most 8 data bytes; CRC, acknowledgement, bit stuffing and error counters make the bus very reliable in noisy places.'
  ],
  pitfalls: [
    'CAN is just a UART with two wires — The bits are sent differentially and there is no start-bit-per-byte; frames carry identifier, length, CRC and acknowledgement, and the bus resolves who may speak by itself.',
    'A node can be tested alone on a bus — Nobody acknowledges its frames, so the controller sees an error and retries until it goes bus-off. Test with two nodes (or a no-acknowledge test mode), both terminated.',
    'Terminate every node — Only the two ends of the cable get a 120 Ω resistor. Four terminators read 30 Ω, overload the drivers and distort the signal.'
  ],
  terms: [
    { term: 'CAN bus', also: ['controller area network', 'CAN 2.0', 'ISO 11898'], def: 'A two-wire broadcast bus designed for vehicles and machines: nodes send short frames of up to 8 data bytes, and an identifier in each frame says what it contains and how urgent it is.' },
    { term: 'TWAI', also: ['two-wire automotive interface'], def: 'Espressif\'s name for the CAN controller inside its chips. It handles frames, filters, error counting and timing; a transceiver chip is still needed to reach the wires.' },
    { term: 'Transceiver', also: ['CAN transceiver', 'PHY'], def: 'The chip between the controller\'s logic pins and the bus. It turns TX into the dominant and recessive levels of CANH and CANL and turns them back into RX.' },
    { term: 'Dominant and recessive', also: ['wired AND'], def: 'The two states of a CAN bus. Dominant is logic 0 and wins over recessive, logic 1, whenever any node drives it.' },
    { term: 'Arbitration', also: ['bitwise arbitration'], def: 'How CAN settles two nodes that start together: each reads the bus while sending its identifier and the one that sends recessive but sees dominant stops. The lowest identifier wins.' },
    { term: 'Bit stuffing', def: 'After five equal bits in a row the sender inserts one bit of the opposite level, which the receiver removes. It keeps enough edges on the wire for the receivers to stay in step.' }
  ],
  choose: {
    good: ['Several nodes sharing short, prioritised messages: machines, robots, vehicles, battery systems', 'Noisy places where a differential pair with CRC and automatic retries earns its keep', 'Systems that must keep running when one node fails: there is no master to lose'],
    avoid: ['Moving much data: 8 bytes a frame and at most 1 Mbit/s are the limits', 'Star wiring and long unterminated stubs', 'Sending on a car\'s bus without knowing what every identifier does'],
    check: ['The transceiver\'s supply (3.3 V or 5 V) and the level of its RX output', 'Bit rate and termination on every node', 'Whether the nodes sit at different ground potentials and need isolation ([[isolation-and-long-cables]])']
  },
  code: [
    {
      title: 'Send a frame every second and print what arrives',
      about: 'Sends identifier 0x123 with two data bytes (0xAB and a counter) once a second at 500 kbit/s, and prints every frame heard on the bus, including its own if another node echoes it. The sketch uses the ESP-IDF driver directly: the Arduino core has no CAN class.',
      needs: 'An ESP32 DevKit, a 3.3 V CAN transceiver board (SN65HVD230 or similar), and a second CAN node with the same bit rate. Both ends of the pair get 120 Ω.',
      wiring: [['GPIO25', 'transceiver TXD (D)'], ['GPIO26', 'transceiver RXD (R)'], ['3V3', 'transceiver VCC'], ['GND', 'transceiver GND'], ['CANH, CANL', 'the bus', '120 Ω across the pair at each end']],
      blocks: `
        when started
          start serial at (115200) baud
          set [counter v] to (0)
          start CAN at (500) kbit/s on TX (25) RX (26) :: bus

        every (1) seconds
          send CAN frame ID (0x123) with bytes (0xAB) and (counter) :: bus
          change [counter v] by (1)

        when CAN frame received :: bus
          print (join [id ] (frame identifier) [ data ] (frame data))
      `,
      cpp: String.raw`
        #include "driver/twai.h"

        const gpio_num_t CAN_TX = GPIO_NUM_25;   // to the transceiver's TXD (D) pin
        const gpio_num_t CAN_RX = GPIO_NUM_26;   // from the transceiver's RXD (R) pin
        uint32_t lastSend = 0;
        uint8_t counter = 0;

        void setup() {
          Serial.begin(115200);
          twai_general_config_t g = TWAI_GENERAL_CONFIG_DEFAULT(CAN_TX, CAN_RX, TWAI_MODE_NORMAL);
          twai_timing_config_t  t = TWAI_TIMING_CONFIG_500KBITS();
          twai_filter_config_t  f = TWAI_FILTER_CONFIG_ACCEPT_ALL();
          if (twai_driver_install(&g, &t, &f) != ESP_OK || twai_start() != ESP_OK) {
            Serial.println("CAN start failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          if (millis() - lastSend >= 1000) {         // once a second
            lastSend += 1000;
            twai_message_t out = {};                 // zero it: clears the extended and remote flags
            out.identifier = 0x123;
            out.data_length_code = 2;
            out.data[0] = 0xAB;
            out.data[1] = counter++;
            twai_transmit(&out, pdMS_TO_TICKS(100));
          }
          twai_message_t in;
          while (twai_receive(&in, 0) == ESP_OK) {   // take everything that has arrived
            Serial.printf("id 0x%03X len %d  data", (unsigned)in.identifier, in.data_length_code);
            for (int i = 0; i < in.data_length_code; i++) Serial.printf(" %02X", in.data[i]);
            Serial.println();
          }
        }
      `,
      na: { py: 'MicroPython 1.29 has no CAN driver for the ESP32: its generic machine.CAN class exists only for other chip families. Use the Arduino or ESP-IDF form, or add an external SPI CAN controller such as the MCP2515 and a third-party driver.' },
      output: `
        id 0x123 len 2  data AB 00
        id 0x123 len 2  data AB 01
      `,
      notes: ['ESP-IDF 5.5 teaches a newer "node" API (esp_twai.h); the older driver used here still works, with deprecation warnings under IDF 6.', 'A node alone on the bus never gets its frame acknowledged and retries for ever. Use two nodes, or the controller\'s no-acknowledge mode for a bench test.', 'The controller of the original ESP32 reads CAN FD frames as errors: a mixed classic and FD network needs a newer chip or a different node.']
    }
  ],
  formulas: [
    {
      name: 'Time on the bus for one frame',
      expr: 't = (47 + 8*n)/f',
      tex: 't = \\frac{47 + 8n}{f}',
      vars: {
        t: { name: 'frame time without stuffing', q: 'time', unit: 'µs' },
        n: { name: 'data bytes', value: 8, min: 0, max: 8, int: true },
        f: { name: 'bit rate', q: 'datarate', unit: 'kbit/s', value: 500 }
      },
      solveFor: 't',
      note: '47 bit times of overhead (start, identifier, control, CRC, acknowledge, end and the 3-bit gap) plus 8 per data byte. Stuffing adds at most about one bit in four of the part from start to CRC, so a worst-case frame is up to roughly a quarter longer.',
      stories: { t: 'A node sends frames of {n} data bytes on a bus at {f}. How long does one occupy the bus, before stuffing?' },
      practice: { unknowns: ['t', 'f'] }
    }
  ],
  examples: [
    {
      title: 'How busy is the bus?',
      q: 'A motor controller sends one frame with 8 data bytes every 10 ms on a 500 kbit/s bus. What share of the time does it take, at best and at worst?',
      steps: ['Best case, no stuffing: $47 + 8 \\times 8 = 111$ bits, which is $111 / 500\\,000 = 222$ µs.', 'Worst case: the stuffed part is $34 + 64 = 98$ bits, so up to $\\lfloor 97 / 4 \\rfloor = 24$ extra bits: 135 bits, 270 µs.', 'In 10 ms that is between $222 / 10\\,000 = 2.2$ % and $270 / 10\\,000 = 2.7$ % of the bus.'],
      a: 'About 2.2 % to 2.7 %. Designers often keep a CAN bus below 30 to 50 % load so that urgent messages never wait long.'
    }
  ],
  quiz: [
    { q: 'Two nodes start sending at the same instant, with identifiers 0x120 and 0x0F0. What happens?', choices: ['Both frames are lost and both retry', '0x0F0 is sent unharmed and 0x120 waits and retries', '0x120 wins because it is larger', 'The ESP chooses at random'], a: 1, why: 'Bit by bit the two identifiers are the same until the first difference: 0x0F0 sends dominant (0) where 0x120 sends recessive (1). The bus is dominant, so 0x120 sees that it lost and stops. The lower number wins and nothing is damaged.' },
    { q: 'With the power off, a meter across CANH and CANL of a properly terminated bus should read about…', choices: ['0 Ω', '60 Ω', '120 Ω', 'infinity'], a: 1, why: 'There is a 120 Ω resistor at each end, and the meter sees the two in parallel: 60 Ω. About 120 Ω means one terminator is missing, about 40 Ω that a third has been added, and a few ohms or infinity means a short or a break.' },
    { q: 'An ESP32 is wired to a TJA1050 transceiver powered from 5 V. What must be checked?', choices: ['Nothing: both are CAN', 'That the transceiver\'s RXD output, at 5 V, cannot damage the ESP pin', 'That GPIO0 is high', 'That the bit rate is 125 kbit/s'], a: 1, why: 'The TJA1050 is a 5 V part. Its receive output swings to 5 V, above what an ESP32 pin tolerates, so it needs a level shifter or divider — or a transceiver made for 3.3 V logic.' },
    { q: 'A CAN frame can carry 64 data bytes.', a: false, why: 'Classic CAN frames carry at most 8 data bytes. CAN FD raises the limit to 64, but it needs controllers that support it, and the original ESP32\'s TWAI does not.' }
  ],
  applications: [
    'Reading diagnostics from a car, a boat (NMEA 2000 is built on CAN) or a tractor, with a listen-only node.',
    'Motor drives, battery packs and sensors inside a robot or a machine, where a few wires must reach many nodes.',
    'Industrial gateways: an ESP that bridges a CAN network to Wi-Fi, MQTT or a web page.',
    'Higher-level protocols that run on CAN — CANopen, J1939 for trucks, DeviceNet — each built on the same frames.'
  ],
  sources: [
    'ISO 11898-1 (data link layer and physical signalling) and ISO 11898-2 (high-speed medium access unit).',
    'Espressif, *ESP-IDF Programming Guide*: Two-Wire Automotive Interface (TWAI) API reference; the TWAI chapter of the ESP32 Technical Reference Manual.',
    'Robert Bosch GmbH, *CAN Specification, Version 2.0* (1991).'
  ],
  sim: ['fb-can-frame', 'fb-can-arbitration']
},

/* ================================================================ rs-485 */
{
  id: 'rs-485',
  parent: 'fieldbuses-and-other-links',
  title: 'RS-485',
  level: 2,
  short: 'The industrial workhorse: a differential pair that reaches 1200 m or 10 Mbit/s with dozens of nodes on one cable. The ESP\'s UART talks to it through a transceiver chip, and the program must switch that chip between talking and listening.',
  keywords: ['RS-485', 'RS485', 'TIA-485', 'differential', 'transceiver', 'MAX3485', 'SP3485', 'MAX485', 'DE', 'RE', 'direction control', 'half-duplex', 'termination', 'bias', 'fail-safe', 'twisted pair', '120 ohm', 'RS-422', 'A and B', 'multidrop'],
  prereq: ['uart', 'uart-on-the-esp', 'serial-communication-basics'],
  related: ['modbus', 'isolation-and-long-cables', 'can-bus-twai', 'dmx-and-midi', 'level-shifters', 'choosing-a-bus', 'relay-and-industrial-boards'],
  body: `A UART's TX and RX wires work across a desk but not across a factory: one wire against ground picks up every motor, and the two ends may not even share the same ground voltage. **RS-485** sends each bit as the *difference* between two wires, A and B, twisted together. Noise lands on both wires alike and cancels in the difference, so the same two wires carry data hundreds of metres, through noisy rooms, to many devices at once. RS-485 is only electrical levels: the bytes on it are ordinary UART bytes, and what they mean — usually [[modbus|Modbus]] — is a separate matter.

### Wires and levels
- A receiver reads **A − B**: more than +200 mV is one level, less than −200 mV the other. A driver delivers at least 1.5 V across a 54 Ω load. The two wires are labelled A and B, but makers disagree about which is which; if nothing is heard, swap them.
- **A bus is a line, not a star**: one cable runs from node to node, stubs kept as short as you can. Thirty-two ordinary nodes, or more with low-load transceivers, share one pair.
- **Termination**: a 120 Ω resistor across A and B at each of the two ends, matching the cable's impedance, stops reflections. Short runs at low speed often work without it; long runs and fast edges ring ([the simulation](#/c/rs-485?s=sim) shows both).
- **Bias**: when nobody drives, the lines float and noise looks like data, so idle lines fill with stray characters. One pair of resistors, at *one* place (usually the controller), holds the idle level: B pulled up, A pulled down.
- A third wire, ground or shield, keeps the nodes within the receivers' common-mode range of −7 V to +12 V; see [[isolation-and-long-cables]].

### Talking and listening
On two wires only one node may drive at a time. A transceiver has a **driver enable (DE)** and a **receiver enable (RE, active low)** pin; tie them together to one GPIO: high to transmit, low to listen. The program must raise the pin before the first start bit and drop it right after the last stop bit has left the shift register. Too early drops the end of the message; too late deafens the node to the reply. In the example, \`flush()\` waits for the UART to finish. The ESP's UART can also switch the pin by itself in an RS-485 half-duplex mode; the example shows the explicit version because it is the same in every language.

### Parts and speeds
The MAX3485 and SP3485 are 3.3 V transceivers; the cheap MAX485 module is a 5 V part whose RO output must be divided down before it meets an ESP pin. Typical figures: 10 Mbit/s at about 12 m, 1 Mbit/s at about 120 m, 100 kbit/s at 1200 m — length times speed stays roughly constant. Four-wire RS-422 uses a pair per direction and needs no direction pin.

> [!key] RS-485 sends bits as the difference between two twisted wires, so it carries UART bytes far and through noise to many nodes. Terminate both ends, bias once, and drive the direction pin around every transmission.`,
  ideas: [
    'RS-485 is a differential electrical standard: it moves ordinary UART bytes over twisted pairs, hundreds of metres, to many nodes.',
    'A receiver reads the difference A − B against a ±200 mV threshold, so noise that reaches both wires equally cancels.',
    'Two-wire RS-485 is half-duplex: a direction pin (DE and RE) must be set high just before sending and low just after the last bit.',
    'Terminate with 120 Ω at both ends of the line and bias the idle level in one place, or the bus fills with noise characters.'
  ],
  pitfalls: [
    'RS-485 is a protocol — It is only levels and wiring. The same UART bytes could be Modbus, DMX512 or a protocol of your own.',
    'Terminate every node — Only the two ends of the trunk get 120 Ω. Extra resistors load the drivers; none at all causes reflections on long or fast buses.',
    'Release the driver straight after the last write — Writing returns when the bytes are queued, not when they have gone out. Drop the direction pin early and the last byte is cut; wait for the UART to finish first.'
  ],
  terms: [
    { term: 'RS-485', also: ['TIA-485', 'EIA-485', 'RS485'], def: 'A standard for balanced differential signalling over a twisted pair, with several drivers and receivers on one line. It defines voltages and wiring, not the bytes sent.' },
    { term: 'Differential signalling', also: ['balanced line'], def: 'Sending a bit as the voltage difference between two wires instead of one wire against ground. Interference that couples equally to both wires cancels out at the receiver.' },
    { term: 'Direction control', also: ['DE', 'RE', 'driver enable'], def: 'The pins that switch an RS-485 transceiver between driving the bus and listening to it. Both must be right for the whole of every message.' },
    { term: 'Termination', also: ['terminator', '120 Ω resistor'], def: 'A resistor equal to the cable\'s characteristic impedance (120 Ω for typical twisted pair) across the line at its far ends, which absorbs the signal instead of reflecting it.' },
    { term: 'Bias', also: ['fail-safe bias', 'idle bias'], def: 'A pull-up on one wire and a pull-down on the other, in one place on the bus, so that the receivers see a defined idle level while no driver is on.' }
  ],
  choose: {
    good: ['Cable runs of tens to hundreds of metres in electrically noisy places', 'Many devices on one pair: meters, drives, sensors, lighting', 'Industrial equipment: Modbus RTU and many others use it as their wire'],
    avoid: ['A star of long spurs: use a daisy chain', 'Using a 5 V module on a 3.3 V ESP without protecting the receive pin', 'Skipping isolation between mains-powered equipment and a USB-connected computer or ESP'],
    check: ['A and B labelling of every device (swap if silent)', 'Termination at the two ends only, and bias in one place', 'The turnaround timing of the direction pin against the baud rate']
  },
  code: [
    {
      title: 'Talk and listen on an RS-485 bus',
      about: 'Sends the line "PING n" once a second, drives the direction pin around each transmission, and prints every line heard from other nodes. Start the DE pin low: listening is the safe state.',
      needs: 'An ESP32 DevKit, a 3.3 V RS-485 transceiver board (MAX3485 or SP3485), and a second node on the pair. Termination at both ends.',
      wiring: [['GPIO25', 'transceiver DI (driver input)'], ['GPIO26', 'transceiver RO (receiver output)', '3.3 V parts only; divide a 5 V RO'], ['GPIO27', 'DE and RE tied together'], ['A, B', 'the bus', '120 Ω across at each end'], ['GND', 'common ground']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [output v]
          set pin (27) to [LOW v]
          start UART (2) at (9600) baud on RX (26) TX (25) :: bus
          set [count v] to (0)

        every (1) seconds
          set pin (27) to [HIGH v]
          send (join [PING ] (count)) on UART (2) and wait until it has gone out :: bus
          set pin (27) to [LOW v]
          change [count v] by (1)

        when data received :: bus
          print (join [heard: ] (line read from UART (2)))
      `,
      cpp: String.raw`
        const int RS485_RX = 26;        // from the transceiver's RO pin
        const int RS485_TX = 25;        // to the transceiver's DI pin
        const int RS485_DE = 27;        // to DE and RE together: HIGH transmits, LOW listens
        uint32_t lastPing = 0;
        int count = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(RS485_DE, OUTPUT);
          digitalWrite(RS485_DE, LOW);                           // start by listening
          Serial2.begin(9600, SERIAL_8N1, RS485_RX, RS485_TX);   // always give the pins
          Serial2.setTimeout(50);
        }

        void sendText(const String &text) {
          digitalWrite(RS485_DE, HIGH);   // take the bus
          Serial2.print(text);
          Serial2.flush();                // wait until the last stop bit has gone out
          digitalWrite(RS485_DE, LOW);    // listen again
        }

        void loop() {
          if (millis() - lastPing >= 1000) {
            lastPing += 1000;
            sendText("PING " + String(count++) + "\n");
          }
          while (Serial2.available()) {                         // anything heard on the bus
            String line = Serial2.readStringUntil('\n');
            Serial.println("heard: " + line);
          }
        }
      `,
      py: String.raw`
        from machine import UART, Pin
        import time

        RS485_RX = 26                   # from the transceiver's RO pin
        RS485_TX = 25                   # to the transceiver's DI pin
        RS485_DE = 27                   # to DE and RE together: 1 transmits, 0 listens

        de = Pin(RS485_DE, Pin.OUT, value=0)                       # start by listening
        uart = UART(2, baudrate=9600, tx=RS485_TX, rx=RS485_RX, timeout=50)

        def send_text(text):
            de.value(1)                 # take the bus
            uart.write(text)
            uart.flush()                # wait until the last stop bit has gone out
            de.value(0)                 # listen again

        last_ping = time.ticks_ms()
        count = 0
        while True:
            if time.ticks_diff(time.ticks_ms(), last_ping) >= 1000:
                last_ping = time.ticks_add(last_ping, 1000)
                send_text("PING %d\n" % count)
                count += 1
            if uart.any():                                          # anything heard on the bus
                line = uart.readline()
                if line:
                    print("heard:", line)
      `,
      output: `
        heard: PONG 0
        heard: PONG 1
      `,
      notes: ['With RE tied to DE the receiver is off while sending, so the node does not hear its own message. Some designs keep RE low to listen to themselves and detect collisions.', 'The ESP32\'s UART can also drive DE itself in an RS-485 half-duplex mode (Arduino: the RTS pin and the UART mode setting); the explicit pin version works in every language and on every chip.', 'If only garbage arrives, check A and B first, then the baud rate and the frame format of the other device (8N1, 8E1 or 8N2).']
    }
  ],
  formulas: [
    {
      name: 'Idle voltage given by the bias resistors',
      expr: 'V = Vcc*Rt/(Rt + 2*Rb)',
      tex: 'V = V_{cc} \\, \\frac{R_t}{R_t + 2 R_b}',
      vars: {
        V: { name: 'idle voltage A − B (magnitude)', tex: 'V', q: 'voltage', unit: 'V' },
        Vcc: { name: 'supply of the bias network', tex: 'V_{cc}', q: 'voltage', unit: 'V', value: 3.3 },
        Rt: { name: 'termination seen by the line (two 120 Ω in parallel)', tex: 'R_t', q: 'resistance', unit: 'Ω', value: 60 },
        Rb: { name: 'each bias resistor', tex: 'R_b', q: 'resistance', unit: 'Ω', value: 390 }
      },
      solveFor: 'V',
      note: 'The receiver needs at least 200 mV of idle difference to be sure of its level (many fail-safe transceivers need no bias at all: read the datasheet). The same current flows all the time, Vcc / (Rt + 2 Rb), so stiffer bias costs power.',
      stories: { V: 'A 3.3 V bus is terminated at both ends (60 Ω seen) and biased through {Rb} in each leg. How large is the idle differential voltage?', Rb: 'The idle voltage must be {V} on a bus with {Rt} of termination. How large may each bias resistor be?' },
      practice: { unknowns: ['V', 'Rb'] }
    }
  ],
  examples: [
    {
      title: 'Bias for a 3.3 V bus',
      q: 'A bus is terminated with 120 Ω at both ends and biased from 3.3 V. Will 470 Ω bias resistors give the 200 mV the receivers want? What about 390 Ω? How much current do they draw?',
      steps: ['The two terminators in parallel are 60 Ω. The divider is 60 Ω between two bias resistors in series.', 'With 470 Ω: $V = 3.3 \\times 60 / (60 + 940) = 0.198$ V: just under the 200 mV.', 'With 390 Ω: $V = 3.3 \\times 60 / (60 + 780) = 0.236$ V, a small margin. The current is $3.3 / 840 = 3.9$ mA, drawn all the time from the node that holds the bias.'],
      a: '470 Ω is marginal at 0.198 V; 390 Ω gives 0.236 V at 3.9 mA. Prefer a transceiver with built-in fail-safe if the bus must not burn milliamps.'
    }
  ],
  quiz: [
    { q: 'A two-wire RS-485 node sends a message, but the last byte arrives cut short. What is the likely fault?', choices: ['Termination is missing', 'The direction pin is released before the last byte has left the UART', 'The cable is too short', 'The bias resistors are too weak'], a: 1, why: 'Writing returns once the bytes are queued, not when they have been sent. If DE is dropped immediately, the driver switches off in the middle of the last byte. Wait for the UART to finish (flush) before releasing the pin.' },
    { q: 'Where do the 120 Ω terminators of an RS-485 line belong?', choices: ['At every node', 'At the two ends of the trunk cable', 'Only at the controller', 'Between A and ground'], a: 1, why: 'The terminators absorb the signal at the far ends of the line so that it does not bounce back. Resistors at every node would load the drivers and distort the levels.' },
    { q: 'Nobody is transmitting and the receiver outputs a stream of random characters. What is missing?', choices: ['A faster baud rate', 'Bias resistors, or a fail-safe transceiver, to define the idle level', 'More terminators', 'A longer cable'], a: 1, why: 'With all drivers off, the lines float and pick up noise; a receiver sees random differences above its threshold and the UART decodes them as characters. Bias holds the idle difference above 200 mV.' },
    { q: 'RS-485 specifies what the bytes on the wire mean.', a: false, why: 'It specifies voltages, wiring and driver behaviour only. The meaning of the bytes comes from a protocol on top, such as Modbus or DMX512.' }
  ],
  applications: [
    'Modbus RTU links to energy meters, motor drives, temperature controllers and solar inverters.',
    'DMX512 stage lighting, which is RS-485 at 250 kbit/s.',
    'Building automation and fire panels, where a single pair runs through a whole building.',
    'ESP gateways such as the M5Stack Station-485 or the Waveshare and LilyGO industrial boards, which carry an RS-485 transceiver onboard.'
  ],
  sources: [
    'TIA/EIA-485-A, *Electrical Characteristics of Generators and Receivers for Use in Balanced Digital Multipoint Systems*.',
    'Texas Instruments, *The RS-485 Design Guide* (application report).',
    'Arduino core for ESP32 documentation, *Serial* (HardwareSerial) API; MicroPython documentation, class *machine.UART*.'
  ],
  sim: 'fb-rs485-bus'
},

/* ================================================================ modbus */
{
  id: 'modbus',
  parent: 'fieldbuses-and-other-links',
  title: 'Modbus',
  level: 2,
  short: 'The 1979 protocol that still runs much of industry: a client asks, one server answers, in a frame of address, function, data and CRC-16. On RS-485 it is Modbus RTU; over Ethernet, Modbus TCP. An ESP can be either end.',
  keywords: ['Modbus', 'RTU', 'TCP', 'ASCII', 'holding register', 'input register', 'coil', 'discrete input', 'function code', 'slave address', 'unit id', 'CRC-16', 'energy meter', 'inverter', 'PLC', '40001', 'exception', 'master', 'client', 'server', 'silent interval'],
  prereq: ['rs-485', 'uart', 'bits-and-bytes'],
  related: ['isolation-and-long-cables', 'ethernet', 'mains-energy-monitoring', 'four-to-twenty-milliamp', 'tcp-ip-on-a-microcontroller', 'industrial-signals'],
  body: `Modbus was published in 1979 by Modicon to talk to its controllers, and it survived because it is almost nothing: a few kinds of data, a handful of commands, no negotiation. A **client** (the older word is *master*) asks; a **server** (*slave*) — a power meter, a motor drive, a temperature controller, a solar inverter — answers. Servers never speak unasked. On a serial line each has an address from 1 to 247; the client sends to one address, all hear it, only that one replies (address 0 is a broadcast with no reply).

### The data model
Four tables, each numbered from 0 inside a frame: **coils** (single-bit outputs, read and write), **discrete inputs** (single bits, read-only), **input registers** (16-bit, read-only) and **holding registers** (16-bit, read and write). A temperature is one register or two; a 32-bit number or float takes two, and *which word comes first* differs between makers. Manuals often print old numbers like 40001 for the first holding register; the frame holds address 0 — the best-known off-by-one in industry.

### A frame, byte by byte
On RS-485 (**Modbus RTU**) a frame is **address, function, data, CRC-16** — the CRC with its *low byte first*, the opposite of every other number in the frame. To read two holding registers from server 1, starting at register 0, the client sends the eight bytes \`01 03 00 00 00 02 C4 0B\`: server 01, function 03 (read holding registers), start 0000, count 0002, then the CRC, C4 first. The answer is \`01 03 04\`, four data bytes (two registers, high byte first) and a CRC. Other functions: 01, 02, 04 read; 05 and 06 write one coil or register; 0F and 10 (hex) write many. If something is wrong the server answers with the function code plus 0x80 and an exception code: 01 unknown function, 02 bad address, 03 bad value.

Frames are separated by **silence**: 3.5 character times of idle line end a frame, and a gap of more than 1.5 inside one makes it invalid (above 19 200 baud the standard fixes them at 1.75 ms and 750 µs). Send the whole frame at once, then wait for the answer with a timeout of a few hundred milliseconds.

### Same data, other wires
**Modbus TCP** carries the same functions inside a TCP connection to port 502 with a 7-byte header and no CRC, over Wi-Fi or [[ethernet|Ethernet]]. An ESP between the two is a typical gateway. Libraries exist (ArduinoModbus, ModbusMaster, eModbus; esp-modbus in ESP-IDF); the program below builds the frame by hand, so nothing is hidden.

> [!warn] Modbus devices such as energy meters, drives and heaters sit next to mains and motor circuits. Connect only to their communication terminals, check that those are isolated from the power side, and leave wiring inside the cabinet to a qualified person.

> [!key] Modbus is a question-and-answer protocol of four tables of bits and 16-bit registers, in frames of address, function, data and CRC-16 (low byte first). Mind the register numbering, the word order of 32-bit values and the silent gap between RTU frames.`,
  ideas: [
    'A Modbus client asks and one server answers; servers never speak unasked. On a serial line the server address is 1 to 247.',
    'Data lives in four tables: coils, discrete inputs, input registers and holding registers, each addressed from 0 in the frame.',
    'An RTU frame is address, function, data and a CRC-16 sent low byte first; silence of 3.5 characters separates frames.',
    'Modbus TCP carries the same functions over a TCP connection to port 502 with no CRC.'
  ],
  pitfalls: [
    'Register 40001 is sent as 40001 — It is sent as address 0. The 4xxxx numbers are a documentation habit; subtract the table\'s base before building the frame.',
    'A 32-bit value is one register — It occupies two 16-bit registers, and some devices put the high word first and others the low word. A float read the wrong way round gives nonsense.',
    'Modbus is secure because it is old and obscure — It has no authentication or encryption at all. Never put a Modbus TCP server on an open network; keep it inside a protected one or behind a gateway.'
  ],
  terms: [
    { term: 'Modbus', also: ['Modbus RTU', 'Modbus TCP'], def: 'A question-and-answer protocol from 1979 for reading and writing bits and 16-bit registers in industrial devices. RTU is the compact binary form on serial lines; TCP carries the same functions over a network.' },
    { term: 'Holding register', also: ['input register', 'coil'], def: 'The Modbus data items: a holding register is a readable and writable 16-bit value, an input register a read-only one, a coil a writable single bit.' },
    { term: 'Function code', also: ['exception code'], def: 'The byte after the address that says what to do: 03 reads holding registers, 06 writes one, 10 hex writes many. An answer with 0x80 added to it reports an error.' },
    { term: 'CRC-16', also: ['CRC-16/MODBUS', 'cyclic redundancy check'], def: 'A two-byte check value computed over the whole frame; the receiver recomputes it to detect corruption. Modbus sends it low byte first.' },
    { term: 'Silent interval', also: ['t3.5', 'inter-frame gap'], def: 'The quiet time of at least 3.5 character times that marks the end of a Modbus RTU frame, so that receivers know where one message stops and the next begins.' }
  ],
  choose: {
    good: ['Reading meters, drives, inverters and controllers that already speak it: that is most of what exists', 'Small, well-defined sets of numbers that a client polls at a steady rate', 'Gateways between RS-485 and Ethernet, Wi-Fi or MQTT'],
    avoid: ['Events and alarms that must arrive at once: Modbus is polled, servers cannot call out', 'Open networks without a firewall or VPN: there is no security in the protocol', 'Large or structured data: registers are 16 bits and a frame holds about 125 of them'],
    check: ['The device\'s register map: addresses, data types, word order and scaling', 'Serial settings: baud rate, parity and stop bits (8E1 and 8N2 are both common)', 'Which of the two terms your device uses for A and B, and that termination and bias are right ([[rs-485]])']
  },
  code: [
    {
      title: 'Read two holding registers (Modbus RTU client)',
      about: 'Builds the request by hand, sends it through the RS-485 transceiver, waits for the answer, checks the address, function and CRC, and prints the two register values. Change SERVER, FIRST and COUNT to match your device\'s register map.',
      needs: 'An ESP32 DevKit, a 3.3 V RS-485 transceiver board, and a Modbus RTU device (a meter, a drive, or a second board answering) at 9600 baud, 8N1.',
      wiring: [['GPIO25', 'transceiver DI'], ['GPIO26', 'transceiver RO', '3.3 V parts only'], ['GPIO27', 'DE and RE tied together'], ['A, B, GND', 'the Modbus line', 'terminated at both ends']],
      blocks: `
        define crc16 (bytes)
          set [crc v] to (0xFFFF)
          for each [b v] in (bytes)
            set [crc v] to ((crc) xor (b))
            repeat (8)
              if <((crc) and (1)) = (1)> then
                set [crc v] to (((crc) shift right (1)) xor (0xA001))
              else
                set [crc v] to ((crc) shift right (1))
              end
            end
          end

        when started
          start serial at (115200) baud
          set pin (27) as [output v]
          start UART (2) at (9600) baud on RX (26) TX (25) :: bus
        forever
          set [request v] to (list (1) (3) (0) (0) (0) (2))
          add (crc16 (request)) as two bytes, low byte first, to [request v] :: my
          set pin (27) to [HIGH v]
          send (request) on UART (2) and wait until it has gone out :: bus
          set pin (27) to [LOW v]
          set [reply v] to (read (9) bytes from UART (2), waiting up to (300) ms) :: bus
          if <reply is complete, from server (1), function (3), CRC correct> then
            print (join [register 0 = ] (item (4) of [reply v]) [ ] (item (5) of [reply v]))
          else
            print [no valid answer]
          end
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int RS485_RX = 26, RS485_TX = 25, RS485_DE = 27;
        const uint8_t SERVER = 1;               // the device's Modbus address
        const uint16_t FIRST = 0, COUNT = 2;    // two holding registers from address 0

        uint16_t crc16(const uint8_t *p, size_t n) {
          uint16_t crc = 0xFFFF;
          for (size_t i = 0; i < n; i++) {
            crc ^= p[i];
            for (int b = 0; b < 8; b++) crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : crc >> 1;
          }
          return crc;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(RS485_DE, OUTPUT);
          digitalWrite(RS485_DE, LOW);
          Serial2.begin(9600, SERIAL_8N1, RS485_RX, RS485_TX);
          Serial2.setTimeout(300);
        }

        void loop() {
          uint8_t req[8] = { SERVER, 0x03, FIRST >> 8, FIRST & 0xFF, COUNT >> 8, COUNT & 0xFF };
          uint16_t c = crc16(req, 6);
          req[6] = c & 0xFF;                       // CRC: low byte first
          req[7] = c >> 8;
          while (Serial2.available()) Serial2.read();   // throw away old bytes
          digitalWrite(RS485_DE, HIGH);
          Serial2.write(req, sizeof(req));
          Serial2.flush();
          digitalWrite(RS485_DE, LOW);

          uint8_t rsp[5 + 2 * COUNT];              // address, function, byte count, data, CRC
          size_t n = Serial2.readBytes(rsp, sizeof(rsp));   // waits up to the timeout
          if (n == sizeof(rsp) && rsp[0] == SERVER && rsp[1] == 0x03 &&
              crc16(rsp, n - 2) == (uint16_t)(rsp[n - 2] | (rsp[n - 1] << 8))) {
            for (int i = 0; i < COUNT; i++) {
              Serial.printf("register %d = %u\n", FIRST + i, (rsp[3 + 2 * i] << 8) | rsp[4 + 2 * i]);
            }
          } else {
            Serial.printf("no valid answer (%u bytes)\n", (unsigned)n);
          }
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import UART, Pin
        import time

        RS485_RX, RS485_TX, RS485_DE = 26, 25, 27
        SERVER = 1                         # the device's Modbus address
        FIRST, COUNT = 0, 2                # two holding registers from address 0

        def crc16(data):
            crc = 0xFFFF
            for byte in data:
                crc ^= byte
                for _ in range(8):
                    crc = (crc >> 1) ^ 0xA001 if crc & 1 else crc >> 1
            return crc

        de = Pin(RS485_DE, Pin.OUT, value=0)
        uart = UART(2, baudrate=9600, tx=RS485_TX, rx=RS485_RX, timeout=300)

        while True:
            req = bytearray([SERVER, 0x03, FIRST >> 8, FIRST & 0xFF, COUNT >> 8, COUNT & 0xFF])
            c = crc16(req)
            req.append(c & 0xFF)               # CRC: low byte first
            req.append(c >> 8)
            while uart.any():
                uart.read()                    # throw away old bytes
            de.value(1)
            uart.write(req)
            uart.flush()
            de.value(0)

            size = 5 + 2 * COUNT               # address, function, byte count, data, CRC
            rsp = uart.read(size)              # waits up to the timeout
            if rsp and len(rsp) == size and rsp[0] == SERVER and rsp[1] == 0x03 \
                    and crc16(rsp[:-2]) == rsp[-2] | (rsp[-1] << 8):
                for i in range(COUNT):
                    print("register", FIRST + i, "=", (rsp[3 + 2 * i] << 8) | rsp[4 + 2 * i])
            else:
                print("no valid answer", 0 if rsp is None else len(rsp), "bytes")
            time.sleep(2)
      `,
      output: `
        register 0 = 2301
        register 1 = 2302
      `,
      notes: ['An exception answer is only five bytes (address, function plus 0x80, code, CRC): read it as a special case if you need to tell "illegal address" from "silence".', 'Match the frame format of the device: many Modbus devices default to 8E1 or 8N2, not 8N1. In Arduino pass SERIAL_8E1 or SERIAL_8N2; in MicroPython set parity and stop in the UART call.', 'The code polls every two seconds with delay(). A real gateway runs the poll in its own task ([[tasks]]) so Wi-Fi and the display keep working.']
    }
  ],
  formulas: [
    {
      name: 'How long a frame takes on the wire',
      expr: 't = 11*n/B',
      tex: 't = \\frac{11 \\, n}{B}',
      vars: {
        t: { name: 'time for the frame', q: 'time', unit: 'ms' },
        n: { name: 'bytes in the frame', value: 8, min: 1, max: 256, int: true },
        B: { name: 'baud rate', q: 'datarate', unit: 'baud', value: 9600 }
      },
      solveFor: 't',
      note: 'Each RTU character is 11 bits (start, 8 data, parity, stop; or two stop bits with no parity). A polling loop must wait for the request, the server\'s turnaround, the reply and the 3.5-character silence before the next request.',
      stories: { t: 'A request of {n} bytes goes out at {B}. How long is the wire busy with it?', B: 'A frame of {n} bytes must be sent in {t}. What baud rate is needed?' },
      practice: { unknowns: ['t', 'B'] }
    }
  ],
  examples: [
    {
      title: 'A poll of eight registers',
      q: 'A client reads 8 holding registers from a meter at 9600 baud. How long does one poll take on the wire, ignoring the server\'s thinking time?',
      steps: ['The request is 8 bytes: $8 \\times 11 = 88$ bits, or 9.2 ms.', 'The reply is address, function, byte count, 16 data bytes and two CRC bytes: 21 bytes, 231 bits, 24.1 ms.', 'Add the silent interval, 3.5 characters, about 4 ms, between the two frames and again before the next request: about 8 ms.'],
      a: 'About 9 + 24 + 8 = 41 ms plus the meter\'s own delay, so a few dozen polls per second at most at 9600 baud, and fewer with several meters sharing the line.'
    }
  ],
  quiz: [
    { q: 'A manual lists the first holding register as 40001. What address goes in the frame?', choices: ['40001', '1', '0', '40000'], a: 2, why: 'The 4xxxx numbers are a documentation convention: the 4 means "holding register table" and the numbering starts at 1. The frame carries the position in the table counted from 0.' },
    { q: 'A client works out the CRC-16 of a request and gets the number 0x0BC4. In what order does it send the two bytes?', choices: ['0B then C4', 'C4 then 0B', 'Either: the receiver adapts', 'It does not send the CRC'], a: 1, why: 'Modbus sends the low byte of the CRC first, unlike the 16-bit register values and addresses in the same frame, which go high byte first. The request in the page therefore ends in C4 0B.' },
    { q: 'A client reads registers from a server that does not exist at that address. What does it see?', choices: ['An exception answer from the server', 'Silence until its timeout', 'The answer of the nearest address', 'A CRC error'], a: 1, why: 'No device owns that address, so nobody answers. The client must have a timeout and treat silence as an error. An exception answer comes only from a server that exists but cannot do what was asked.' },
    { q: 'Modbus TCP frames carry a CRC-16 like RTU frames.', a: false, why: 'TCP already protects its data with its own checksum and retransmission. Modbus TCP replaces the address and CRC with a 7-byte header that holds a transaction number, a length and a unit identifier.' }
  ],
  applications: [
    'Reading a single- or three-phase energy meter from an ESP and publishing the values over MQTT.',
    'Controlling a motor drive or a pump: setting the frequency in a holding register and reading the status word.',
    'Reading solar inverters, heat pumps and battery systems, many of which expose Modbus on RS-485 or TCP.',
    'A gateway from an old PLC network to a modern dashboard, with the ESP translating registers into JSON.'
  ],
  sources: [
    'Modbus Organization, *Modbus Application Protocol Specification* (V1.1b3).',
    'Modbus Organization, *Modbus over Serial Line Specification and Implementation Guide* (V1.02).',
    'Modbus Organization, *Modbus Messaging on TCP/IP Implementation Guide* (V1.0b).'
  ],
  sim: 'fb-modbus'
}

,

/* ================================================================ usb-on-the-esp */
{
  id: 'usb-on-the-esp',
  parent: 'fieldbuses-and-other-links',
  title: 'USB on an ESP',
  level: 2,
  short: 'Three different things hide behind a USB connector: a bridge chip that turns USB into a serial port, a small fixed serial-and-debug block inside the chip, or a full USB controller that can be a keyboard, a drive or a host. Which one your chip has decides what the board can become.',
  keywords: ['USB', 'USB OTG', 'USB Serial/JTAG', 'CDC', 'TinyUSB', 'native USB', 'D+', 'D-', 'GPIO19', 'GPIO20', 'bridge chip', 'CP2102', 'CH340', 'CH9102', 'device', 'host', 'full-speed', 'high-speed', 'USB Mode', 'CDC On Boot', 'ARDUINO_USB_MODE'],
  prereq: ['usb-serial-bridges-and-auto-reset', 'peripherals-overview', 'uart-on-the-esp'],
  related: ['usb-device-hid-cdc-msc', 'usb-host', 'usb-power', 'soc-esp32-s3', 'soc-esp32-c3', 'soc-esp32-p4', 'esp32-s3-devkitc'],
  body: `Plug a development board into a computer and something appears, usually a serial port. Where it comes from is worth knowing, because three quite different things hide behind the same connector.

### Three kinds of USB
1. **A bridge chip on the board.** A CP210x, CH340, CH9102 or FTDI chip turns USB into an ordinary UART wired to the ESP's UART0 ([[usb-serial-bridges-and-auto-reset]]). The ESP itself has no USB: the original ESP32, the ESP32-C2 and the ESP8266 are like this. It is cheap, robust, and can reset the chip for uploads.
2. **USB Serial/JTAG**, a small fixed block *inside* the chip whose two data pins go straight to the connector. To the computer it is one serial port and one JTAG debugger, nothing else, so the board needs no bridge chip. The ESP32-C3, C5, C6, C61, H2 and H21 have only this. The port disappears when the chip resets hard or sleeps deeply: the computer sees an unplug and a plug.
3. **USB OTG**, a full controller. The ESP32-S2, S3 and P4 (and the new S31 and H4) can *be* any USB device — keyboard, mouse, drive, MIDI instrument, audio card — or be the **host** that such devices plug into. The S2 and S3 run at full speed, 12 Mbit/s; the P4 and S31 also at high speed, 480 Mbit/s.

| Chip | Built-in USB |
|---|---|
| ESP32, ESP32-C2, ESP8266 | none: a bridge chip on the board |
| ESP32-C3, C5, C6, C61, H2, H21 | Serial/JTAG only |
| ESP32-S2 | OTG, full speed |
| ESP32-S3 | OTG (full speed) and Serial/JTAG |
| ESP32-P4 | OTG (high and full speed) and Serial/JTAG |
| ESP32-S31, ESP32-H4 | OTG and Serial/JTAG, both new |

### The pins
D− and D+ are fixed chip pins, listed in [the pinout explorer](#/tools/pinout): GPIO19 and GPIO20 on the S2 and S3, GPIO18 and GPIO19 on the C3, GPIO12 and GPIO13 on the C6. Using one as an ordinary GPIO switches USB off, so a board that talks USB cannot also spend them. On the S3 the OTG block and the Serial/JTAG block share the same two pins, and the board menu chooses which is active.

### What the program sees
In the Arduino IDE two menu items matter: *USB Mode* (Hardware CDC and JTAG, or USB-OTG with TinyUSB) and *USB CDC On Boot*, which decides whether the word Serial means the USB port or UART0 ([[uart-on-the-esp]]). Most "nothing appears in the serial monitor" problems on C3, S3 and C6 boards are that switch. The program below asks the build which was chosen.

A USB connector is also a 5 V supply: a device may draw 100 mA until the host has configured it, then up to 500 mA ([[usb-power]]).

> [!key] A USB connector on an ESP board may lead to a bridge chip, to a fixed serial-and-debug block inside the chip, or to a full OTG controller that can be a keyboard, a drive or a host. Which one decides what the board can become.`,
  ideas: [
    'There are three kinds of USB on ESP boards: a bridge chip, the fixed Serial/JTAG block in the chip, and a full OTG controller.',
    'Only chips with OTG (S2, S3, P4 and the newest) can act as a keyboard, a drive or a host; the C-series and H-series chips offer a serial port and a debugger.',
    'D− and D+ are fixed pins; using them as GPIO turns USB off.',
    'In Arduino, USB Mode and USB CDC On Boot decide what Serial means and which USB block is active.'
  ],
  pitfalls: [
    'Every ESP32 board with a USB connector can be a keyboard — Only chips with USB OTG can. On the ESP32, C3, C6 and the like the connector leads to a bridge chip or to a fixed serial-and-debug block.',
    'The USB port of the chip is a UART — On native-USB chips the serial port is an emulated one inside the USB block; UART0 is a separate set of pins. "Serial" can mean either, depending on the menu.',
    'GPIO19 and GPIO20 are free pins on an S3 board — They are D− and D+. Driving them as GPIO switches the USB port off, and with it uploading and the serial monitor.'
  ],
  terms: [
    { term: 'USB OTG', also: ['On-The-Go', 'native USB'], def: 'A USB controller that can act as a device (keyboard, drive …) or as a host. The ESP32-S2, S3 and P4 have one.' },
    { term: 'USB Serial/JTAG', also: ['built-in USB', 'USB-JTAG'], def: 'A fixed USB function inside the chip that appears as a serial port and a JTAG debugger and as nothing else. It needs no bridge chip.' },
    { term: 'Bridge chip', also: ['USB-to-UART bridge', 'USB-serial chip', 'CP2102', 'CH340'], def: 'A separate chip on the board that turns USB into a UART connected to the ESP. The ESP itself is not a USB device.' },
    { term: 'CDC', also: ['communications device class', 'virtual COM port'], def: 'The USB class for serial ports. When an ESP shows up as a COM port or /dev/ttyACM, it is offering CDC.' },
    { term: 'TinyUSB', def: 'The open-source USB stack that ESP-IDF and the Arduino core use to give OTG chips their device classes.' }
  ],
  choose: {
    good: ['A chip with OTG when the product must act as a keyboard, drive, MIDI or audio device', 'A chip with Serial/JTAG when a serial port and a debugger over one cable are enough', 'A bridge-chip board when you want a serial port that survives resets and deep sleep'],
    avoid: ['Choosing an ESP32 or C3 for a USB keyboard: they cannot', 'Spending GPIO19 and GPIO20 on an S3 or S2 board that is meant to use USB', 'Assuming the one USB-C port of a board is the chip\'s own: many boards have a second port or a bridge'],
    check: ['Which USB block the board really uses (the board catalogue and the chip table)', 'The USB Mode and CDC On Boot settings in the board menu', 'Whether the board has one port or two, and which one is native']
  },
  code: [
    {
      title: 'Ask the build which USB it has',
      about: 'Prints which USB block the sketch was built for and what the word Serial means. The same checks the board menu changes. Run it before writing a USB device program: it saves an evening.',
      needs: 'Any ESP32-family board; for boards whose USB port is the chip\'s own, enable USB CDC On Boot so that the output reaches the serial monitor.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Board: ] (chip model))
          if <the build has a USB OTG controller in use> then
            print [USB: OTG, the ESP can be a keyboard, a drive and more]
          else
            print [USB: no OTG in use (a bridge chip, or the fixed serial and debug block)]
          end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1500);                                  // give the monitor time to open
        #ifndef ARDUINO_USB_MODE
          Serial.println("USB: none here - a bridge chip or no connector at all");
        #elif ARDUINO_USB_MODE == 1
          Serial.println("USB: hardware CDC and JTAG (the fixed serial and debug block)");
        #else
          Serial.println("USB: OTG through TinyUSB (the ESP can be a keyboard, a drive ...)");
        #endif
        #if ARDUINO_USB_CDC_ON_BOOT
          Serial.println("Serial is the USB port (CDC On Boot is enabled)");
        #else
          Serial.println("Serial is UART0 (CDC On Boot is disabled)");
        #endif
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, machine

        print("Board:", sys.implementation._machine)
        if hasattr(machine, "USBDevice"):
            print("USB: an OTG controller is built in (machine.USBDevice)")
        else:
            print("USB: no OTG controller in this build - a bridge chip, or the fixed serial and debug block")
      `,
      output: `
        USB: OTG through TinyUSB (the ESP can be a keyboard, a drive ...)
        Serial is the USB port (CDC On Boot is enabled)
      `,
      notes: ['The messages describe how the sketch was built, not what the chip could do: an ESP32-S3 built with "Hardware CDC and JTAG" reports the fixed block even though it has an OTG controller.', 'On a board with a bridge chip, "Serial is UART0" is the normal answer, whatever the chip.']
    }
  ],
  quiz: [
    { q: 'You want an ESP32-C3 to appear as a USB keyboard. What is the position?', choices: ['Select USB-OTG in the board menu', 'Impossible: the C3 has only the fixed serial and debug block', 'Possible with a bridge chip added', 'Possible, but only at 12 Mbit/s'], a: 1, why: 'The C3\'s USB block is a fixed serial port plus JTAG; it cannot be a keyboard, drive or anything else. A bridge chip would only add another serial port. Choose an S2, S3 or P4.' },
    { q: 'A board with a USB Serial/JTAG chip wakes from deep sleep and the serial monitor has lost its port. Why?', choices: ['The monitor crashed', 'The USB block is switched off in deep sleep, so the computer saw an unplug', 'The baud rate changed', 'GPIO0 was pulled low'], a: 1, why: 'The block is part of the chip, so it sleeps and resets with it. The computer sees the device disappear and come back. A board with a bridge chip keeps its port through the ESP\'s sleep.' },
    { q: 'Which of these chips has no USB at all in the chip?', choices: ['ESP32-S3', 'ESP32-C6', 'ESP32 (the original)', 'ESP32-P4'], a: 2, why: 'The original ESP32 has no USB block; boards add a bridge chip such as a CP2102 or CH340. The S3, C6 and P4 all have USB inside.' },
    { q: 'Using GPIO19 and GPIO20 as ordinary outputs on an ESP32-S3 board does not affect USB.', a: false, why: 'They are the chip\'s USB D− and D+ pins. Switching them to GPIO disconnects the USB block, and the computer loses the board.' }
  ],
  applications: [
    'The ESP32-S3-DevKitC-1 and many other S3 boards carry two USB-C ports: one to a bridge chip, one straight to the chip.',
    'Thumb-sized C3 and C6 boards with a single USB-C port and no bridge chip, using the fixed serial and debug block.',
    'Macro pads, MIDI controllers and data loggers that appear as a drive, built on S2 and S3 boards.',
    'The ESP32-P4 and the ESP32-S31, which bring high-speed USB to the family.'
  ],
  sources: [
    'USB Implementers Forum, *Universal Serial Bus Specification, Revision 2.0*.',
    'Espressif, *ESP-IDF Programming Guide*: USB Serial/JTAG controller, USB device and host stacks; the datasheet of each chip (USB pins).',
    'Arduino core for ESP32 documentation: the Tools menu (USB Mode, USB CDC On Boot) and the USB libraries, core 3.3.'
  ],
  sim: { id: 'fb-usb', params: { view: 'chips' } }
},

/* ================================================================ usb-device-hid-cdc-msc */
{
  id: 'usb-device-hid-cdc-msc',
  parent: 'fieldbuses-and-other-links',
  title: 'USB device: keyboard, serial port, drive',
  level: 3,
  short: 'An ESP with a USB OTG controller can tell the computer it is a keyboard, a mouse, a serial port, a drive or a MIDI instrument — or several at once — and the computer loads the standard driver. Each is a USB class; the program adds the classes, then starts the stack.',
  keywords: ['USB device', 'HID', 'keyboard', 'mouse', 'gamepad', 'CDC', 'MSC', 'mass storage', 'MIDI', 'descriptor', 'composite device', 'TinyUSB', 'USBHIDKeyboard', 'USB.h', 'VID', 'PID', 'endpoint', 'interface', 'macro pad', 'machine.USBDevice'],
  prereq: ['usb-on-the-esp', 'first-program-blink', 'bits-and-bytes'],
  related: ['usb-host', 'buttons-and-switches', 'rotary-encoders', 'sd-cards', 'ble-hid', 'uart-on-the-esp'],
  body: `A USB device is introduced to the computer by **descriptors**: lists the device hands over on request. They say who made it, and which **interfaces** it offers; each interface belongs to a **class**, and the class decides which driver the computer loads. For the standard classes no driver needs installing: the computer already knows how to talk to a keyboard.

### The classes an ESP can offer
- **HID**, human interface device: keyboard, mouse, gamepad, media keys. The device sends small *reports* (a keyboard's is a few bytes: which keys are down) and the host polls for them every few milliseconds. The Arduino core has classes for each, as on an Arduino Leonardo: press, release, print.
- **CDC**, communications device: a serial port. An extra one next to the console, or the console itself when *CDC On Boot* is on.
- **MSC**, mass storage: the computer sees a *drive* of numbered 512-byte sectors and puts its own file system on it. The ESP provides sectors, not files, so it must never read or write that file system behind the computer's back.
- **MIDI** and **audio**: the ESP appears to music software as an instrument or a sound card.
- **Composite**: all of the above at once. A chip has only a handful of endpoints, so there is a limit to how many classes fit.

### How the program does it
Pick *USB Mode → USB-OTG (TinyUSB)* in the board menu. In the sketch, make an object per class, call each one's \`begin()\`, **then** call \`USB.begin()\`. Strings and numbers the computer shows — product name, manufacturer, vendor and product IDs — are set before that. Computers cache descriptors: after changing the classes, unplug and replug. Espressif's vendor ID is 0x303A; a product you sell needs product and vendor IDs of its own, not a borrowed pair.

MicroPython (1.25 and later, on the S2, S3 and P4) gives low-level access with its USB device API; the standard classes are built on it in separate packages with interfaces unlike the Arduino ones.

### Two things that surprise people
**Uploading.** While the sketch runs as an OTG device, the fixed serial block is off, so the IDE cannot reset the board by itself: hold BOOT, tap RESET, or use the board's UART port ([[boot-modes-and-download-mode]]).

**A device that types by itself** is exactly what attack gadgets are, which is why hosts increasingly ask before trusting a new keyboard. Use it on your own computer, and make a macro pad do something you would be happy to see.

> [!key] A USB device is a list of descriptors: interfaces, each of a class the computer already has a driver for. The ESP adds the classes it wants, then starts the USB stack, and the computer sees a keyboard, a serial port, a drive — or all three.`,
  ideas: [
    'The computer decides what a device is from its descriptors; each interface belongs to a class with a standard driver.',
    'HID sends small reports for input devices, CDC is a serial port, MSC exposes raw sectors as a drive, and the ESP can offer several at once as a composite device.',
    'In Arduino: choose USB-OTG (TinyUSB), call begin() on each class, then USB.begin(); replug after changing classes.',
    'While the sketch uses OTG, uploading may need BOOT and RESET by hand.'
  ],
  pitfalls: [
    'The ESP can read the files of the drive it offers — The computer owns that file system. If the ESP writes to the same sectors while the computer has it mounted, the disk is corrupted. Share data by one side at a time, or use a protocol instead.',
    'Any ESP32 board can be a keyboard once the library is installed — Only chips with USB OTG can; the board must also be plugged in through the native port, with USB-OTG chosen in the menu.',
    'Changing the classes takes effect at once — The computer remembers a device\'s descriptors. Unplug it, or remove the old entry in the device manager, after changing them.'
  ],
  terms: [
    { term: 'USB descriptor', also: ['device descriptor', 'configuration descriptor'], def: 'A structured list the device gives the host on request: its vendor and product IDs, its interfaces and their classes, and the endpoints each interface uses.' },
    { term: 'HID', also: ['human interface device', 'HID report'], def: 'The USB class for keyboards, mice, gamepads and similar. The device sends short reports of its state, which the host polls for.' },
    { term: 'MSC', also: ['mass storage class', 'USB drive'], def: 'The USB class for drives. The host sees numbered blocks and puts its own file system on them.' },
    { term: 'Composite device', def: 'One USB device that offers several interfaces of different classes, such as a keyboard and a serial port at once. The host loads a driver for each.' },
    { term: 'Endpoint', also: ['EP0', 'bulk endpoint', 'interrupt endpoint'], def: 'A numbered channel of a USB device. Each interface uses one or more; a chip has only a few, which limits how many classes fit.' },
    { term: 'VID and PID', also: ['vendor ID', 'product ID'], def: 'The two 16-bit numbers that tell a computer who made a device and which product it is. A product that is sold needs its own pair.' }
  ],
  choose: {
    good: ['HID for buttons, knobs and sensors that should drive the computer directly: macro pads, controllers', 'CDC for a serial port that needs no driver and no bridge chip', 'MSC when the computer should treat a card or a RAM disk as a plain drive'],
    avoid: ['Writing to a drive the computer has mounted', 'A flood of keystrokes: hosts and users do not like a keyboard that types for ever', 'Putting many classes on one chip without checking the endpoint count'],
    check: ['That the chip has OTG and the right USB Mode is chosen', 'The descriptor strings and IDs before shipping a product', 'How the board is re-flashed once the OTG sketch runs']
  },
  code: [
    {
      title: 'A keyboard that types a line when you press BOOT',
      about: 'The ESP appears as a USB keyboard. Each press of the BOOT button types one line into whatever window has the focus. Open a text editor first.',
      needs: 'An ESP32-S3 DevKit (or S2) plugged in by its native USB port, with Tools → USB Mode → USB-OTG (TinyUSB). The BOOT button is on GPIO0.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['USB', 'the chip\'s own USB port', 'not the one marked UART']],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          start the USB keyboard :: bus
        when pin (0) goes [low v]
          type [Hello from ESP32] and press Enter on the USB keyboard :: bus
          wait (0.5) seconds
      `,
      cpp: String.raw`
        #include "USB.h"
        #include "USBHIDKeyboard.h"

        #ifndef ARDUINO_USB_MODE
        #error This chip has no USB OTG controller
        #elif ARDUINO_USB_MODE == 1
        #error Select Tools > USB Mode > USB-OTG (TinyUSB)
        #endif

        USBHIDKeyboard Keyboard;
        const int BUTTON = 0;               // the BOOT button on most S2 and S3 boards

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          Keyboard.begin();                 // add the classes first ...
          USB.begin();                      // ... then start the USB stack
        }

        void loop() {
          if (digitalRead(BUTTON) == LOW) {
            Keyboard.print("Hello from ESP32\n");
            delay(500);                     // one press, one line
          }
        }
      `,
      na: { py: 'MicroPython has a low-level USB device API (machine.USBDevice, from version 1.25, on the S2, S3 and P4) and separate packages that build the standard classes on it, but their interfaces differ from the Arduino classes, so this page shows the Arduino form only.' },
      notes: ['The same sketch can add a mouse (USBHIDMouse), a gamepad, media keys, a serial port (USBCDC), a drive (USBMSC) or a MIDI port (USBMIDI): create each object and call its begin() before USB.begin().', 'While this sketch runs, the fixed serial block is off. To upload again, hold BOOT, tap RESET and release BOOT, or use the board\'s UART connector.', 'Type slowly: a keyboard that sends keys faster than the computer can read them loses some.']
    }
  ],
  examples: [
    {
      title: 'The size of the drive the computer sees',
      q: 'A sketch gives the mass-storage class 2048 sectors of 512 bytes. What drive does the computer show, and who looks after the files?',
      steps: ['$2048 \\times 512 = 1\\,048\\,576$ bytes: a drive of 1 MiB.', 'The computer formats it with its own file system (FAT, usually) and owns the layout. The ESP only reads and writes sectors on request.', 'If the ESP wants to read a file from that drive it would have to understand FAT and wait until the computer has ejected it; sharing a live file system corrupts it.'],
      a: 'A 1 MiB drive whose file system belongs to the computer. The ESP serves sectors; sharing files needs one side at a time.'
    }
  ],
  quiz: [
    { q: 'You add a keyboard, a serial port and a drive to one ESP32-S3 sketch. What does the computer see?', choices: ['Three separate USB cables', 'One composite device with an interface, and a driver, for each class', 'Only the last class added', 'An error: only one class is allowed'], a: 1, why: 'The descriptors list all three interfaces under one configuration. The computer loads a standard driver for each: a keyboard, a COM port and a drive appear from one device.' },
    { q: 'The sketch changes from a keyboard to a mouse, but the computer still shows a keyboard. What is the most likely reason?', choices: ['The ESP is broken', 'The computer cached the old descriptors: replug the board', 'The mouse class needs a driver', 'The baud rate is wrong'], a: 1, why: 'Hosts remember a device\'s descriptors. After changing classes, unplug and replug (or remove the old entry in the device manager).' },
    { q: 'An ESP shares a mass-storage drive and its own firmware writes a log file to the same sectors while the computer has it open. What happens?', choices: ['Both see the same file system safely', 'The file system is likely corrupted: the computer does not know that someone else changed the sectors', 'The ESP gets priority automatically', 'Nothing: USB locks the sectors'], a: 1, why: 'The computer caches directories and blocks and assumes it is the only writer. Changes behind its back break the file system. Hand data over one way at a time.' },
    { q: 'An ESP32-C6 can be programmed as a USB keyboard with the same code as an S3.', a: false, why: 'The C6 has only the fixed USB Serial/JTAG block, a serial port and a debugger. A keyboard needs an OTG controller, as on the S2, S3 and P4.' }
  ],
  applications: [
    'Macro pads and control surfaces: buttons and encoders that type shortcuts or send media keys.',
    'MIDI controllers that music software recognises without a driver.',
    'Data loggers that appear as a drive when plugged in, so the data can be copied like files from a card.',
    'A second serial port for a console or a protocol, next to the debug output.'
  ],
  sources: [
    'USB Implementers Forum, *Device Class Definition for Human Interface Devices (HID)*, version 1.11.',
    'USB Implementers Forum, *Universal Serial Bus Specification, Revision 2.0*, chapter 9 (device framework).',
    'Arduino core for ESP32 documentation and the examples of the USB library (USB.h, USBHIDKeyboard.h, USBMSC.h), core 3.3.'
  ],
  sim: { id: 'fb-usb', params: { view: 'device' } }
},

/* ================================================================ usb-host */
{
  id: 'usb-host',
  parent: 'fieldbuses-and-other-links',
  title: 'USB host',
  level: 3,
  short: 'Turn the roles round and the ESP is the computer: it powers the port, notices a plug, asks the device who it is and runs a driver for it. Possible on chips with USB OTG; a keyboard, a mouse, a flash drive or a serial adapter is realistic, a printer or a webcam is not.',
  keywords: ['USB host', 'OTG', 'enumeration', 'VBUS', 'HID host', 'keyboard', 'barcode scanner', 'flash drive', 'USB-serial adapter', 'USBHostHIDKeyboard', 'USBHostMSC', 'USB-A socket', 'power switch', 'hub', 'class driver'],
  prereq: ['usb-on-the-esp', 'usb-device-hid-cdc-msc', 'usb-power'],
  related: ['ble-hid', 'rfid-and-nfc', 'sd-cards', 'esp32-s3-devkitc', 'esp32-p4-function-ev-board', 'tasks'],
  body: `A USB host is the one in charge: it supplies the 5 V, notices that something has been plugged in, resets the device, asks it for its descriptors, gives it an address and starts a driver for each interface. Behind a laptop's ports sits a lot of software; an ESP does a small, useful part of it on chips with a USB OTG controller (the ESP32-S2, S3, P4 and newer). The Serial/JTAG-only chips — the C3, C6, H2 — cannot host.

### The hardware
- **D− and D+** of the chip go to a socket (Type-A for ordinary devices, or a Type-C with the right resistors).
- **5 V on the socket (VBUS)** must come from the board's supply through a *power switch with a current limit*, never from a chip pin. A keyboard or mouse takes around 100 mA or less; a flash drive may take up to the 500 mA of USB 2.0 while writing. The supply behind it must be able to give that, which a laptop's USB port, an external 5 V rail or a good adapter can — not every thin wire.
- A host holds both data lines low with 15 kΩ resistors until a device appears. Boards made for host use have what is needed; on a plain DevKit read the schematic.

### What you can host
The Arduino core has host classes for the S3 and P4 for **HID keyboards, mice and gamepads, mass-storage drives and serial adapters**; ESP-IDF has a host stack and class drivers as separate components. Realistic uses:
- **A barcode or RFID scanner.** Most scanners pose as USB keyboards: the ESP reads the characters they "type".
- **A keyboard or mouse for a small standalone computer**, a terminal or a game.
- **A flash drive for a logger.** The host side handles the file system, the opposite of the device case ([[usb-device-hid-cdc-msc]]).
- **A serial adapter** to a printer, a GPS or a CNC controller.

A printer, a webcam or a Wi-Fi dongle needs a driver the ESP does not have. A hub extends the ports, but check that the stack version you use supports it.

### Cautions
- **Hot-plugging** must be handled: devices appear and vanish at any time.
- On the **S3 the host and the fixed serial block share one pair of pins and one PHY**: use a UART for the console while the host runs, or do not enable USB-CDC-on-boot together with OTG.
- The host stack is real software: give it its own task ([[tasks]]) and memory.

> [!key] An ESP with a USB OTG controller can be a host for keyboards, mice, drives and serial adapters — if the board supplies the 5 V through a current-limited switch and the software has a driver for the class. Chips with only the fixed serial block cannot host.`,
  ideas: [
    'A host powers the port, resets the device, reads its descriptors, gives it an address and starts one driver per interface.',
    'Only chips with a USB OTG controller can host; the C3, C6 and H2 cannot.',
    'The board must supply 5 V on the socket through a current-limited switch: up to 500 mA for a flash drive.',
    'Realistic devices are HID (keyboards, mice, scanners), mass storage and serial adapters; printers and cameras need drivers the ESP does not have.'
  ],
  pitfalls: [
    'Plug a keyboard into the USB port of any ESP32 board and it will work — Only a chip with OTG can host, the board needs a 5 V supply for the device, and the sketch needs the host class. Most DevKits supply none of that.',
    'The USB 5 V pin of the DevKit can power a flash drive — Not on all boards, and not safely without a current limit: a short or a big drive can brown out the ESP or overload the USB cable.',
    'USB serial adapters all work the same — Plain CDC adapters do; chips such as the CP210x, FTDI and CH34x each need their own driver on the host side.'
  ],
  terms: [
    { term: 'USB host', also: ['host controller'], def: 'The side of a USB link that powers the bus, detects devices, enumerates them and starts drivers. A computer is a host; an ESP with a USB OTG controller can be one.' },
    { term: 'Enumeration', also: ['device enumeration'], def: 'The sequence a host runs when a device appears: reset, read the descriptors, set the address, choose a configuration, start the class drivers.' },
    { term: 'VBUS', also: ['USB 5 V', 'bus power'], def: 'The 5 V line of a USB connector. A host supplies it, up to 500 mA for a USB 2.0 device.' },
    { term: 'Class driver', also: ['HID host', 'MSC host'], def: 'The host-side code that talks to one kind of interface: a HID driver reads keyboard reports, a mass-storage driver reads and writes sectors.' }
  ],
  choose: {
    good: ['Reading a barcode scanner, a card reader or a keyboard that sends characters', 'Logging to a flash drive with a file system a computer can read', 'A simple standalone terminal with a keyboard on the ESP32-S3 or P4'],
    avoid: ['Devices that need a vendor driver the ESP lacks: printers, webcams, Wi-Fi dongles', 'Powering the socket straight from a chip pin or a weak regulator', 'An S3 project that needs USB-host and the USB console at once without a UART console'],
    check: ['That the chip has USB OTG and the board brings out the data pins', 'The 5 V switch, its current limit, and the supply behind it', 'The class driver for each device you plan to plug in']
  },
  quiz: [
    { q: 'Which of these chips can be a USB host?', choices: ['ESP32-C3', 'ESP32-C6', 'ESP32-S3', 'The original ESP32'], a: 2, why: 'Only chips with a USB OTG controller can host. The S3 has one; the C3 and C6 have only the fixed serial and debug block, and the original ESP32 has no USB.' },
    { q: 'What must a board provide so that a flash drive can be plugged into the ESP\'s USB socket?', choices: ['A 3.3 V pull-up on D+', 'Up to 500 mA of 5 V on the socket, through a current-limited switch', 'A crystal for the drive', 'Nothing: the drive powers itself'], a: 1, why: 'A host supplies VBUS. The 5 V comes from the board\'s supply through a power switch that limits the current, so a short or a thirsty drive cannot take the ESP down.' },
    { q: 'You plug a barcode scanner into an ESP32-S3 acting as a host. How will the scanner most likely present itself?', choices: ['As a printer', 'As a keyboard, typing the code and Enter', 'As a drive', 'As a camera'], a: 1, why: 'Most USB barcode scanners are HID keyboards in their default mode, so a host keyboard driver is all the ESP needs to read them.' },
    { q: 'An ESP32-S3 can use USB host and USB CDC-on-boot with OTG at the same time without trouble.', a: false, why: 'The S3\'s two USB blocks share one PHY. Use a UART for the console while the host stack runs, or keep CDC-on-boot off.' }
  ],
  applications: [
    'A scanner station: a barcode or RFID reader on the ESP32-S3 that sends scans to a server.',
    'A stand-alone terminal or retro computer with a USB keyboard.',
    'A data logger that writes CSV files to a flash drive.',
    'A gateway that talks to equipment through a USB-serial adapter.'
  ],
  sources: [
    'USB Implementers Forum, *Universal Serial Bus Specification, Revision 2.0* (host behaviour, enumeration, power).',
    'Espressif, *ESP-IDF Programming Guide*: USB host stack and class drivers.',
    'Arduino core for ESP32 documentation: the USB host classes and examples (core 3.3).'
  ],
  sim: { id: 'fb-usb', params: { view: 'host' } }
}

,

/* ================================================================ ethernet */
{
  id: 'ethernet',
  parent: 'fieldbuses-and-other-links',
  title: 'Ethernet',
  level: 2,
  short: 'A wired network port for an ESP. The original ESP32 and the ESP32-P4 have an Ethernet controller and need only a PHY chip and a socket with magnetics; every other chip uses an SPI Ethernet chip such as the W5500. Steadier than Wi-Fi, and Power over Ethernet can feed the board through the same cable.',
  keywords: ['Ethernet', 'RJ45', 'PoE', '802.3af', 'PHY', 'MAC', 'RMII', 'LAN8720', 'IP101', 'RTL8201', 'W5500', 'SPI Ethernet', 'ETH.h', 'WT32-ETH01', 'Olimex ESP32-POE', '50 MHz clock', 'MDC', 'MDIO', 'magnetics', 'wired network'],
  prereq: ['tcp-ip-on-a-microcontroller', 'spi', 'ip-addresses-dhcp-dns'],
  related: ['ethernet-and-poe-boards', 'olimex-industrial-boards', 'modbus', 'wifi-station', 'esp-as-a-co-processor', 'usb-power', 'strapping-pins'],
  body: `Wi-Fi is convenient and Ethernet is dependable: a cable has no channel to share and no microwave oven to fight, its delay is steady, and with Power over Ethernet one cable brings data *and* power. For a fixed device — a gateway, a controller, a wall display — a socket on the board is often the better choice.

### Two ways to build one
**MAC plus PHY.** An Ethernet port is two parts: a *MAC*, which builds the frames, and a *PHY*, which turns them into the signals of the cable. Between the PHY and the twisted pairs sit *magnetics*, small transformers usually inside the RJ45 socket. The original ESP32, the ESP32-P4 and the new ESP32-S31 have the MAC inside the chip: add a PHY (the LAN8720, IP101 and RTL8201 are common) on the RMII interface. The S31's software is still in preview at the time of writing.

**SPI Ethernet.** Every other chip has no MAC, so a board adds a chip that does both jobs over SPI: the W5500 (10/100 Mbit/s) is the usual one, and the ESP-IDF driver also knows the DM9051 and the KSZ8851SNL. It costs few pins and works with any chip, but the speed is limited by the SPI link and its interrupt: expect far less than line rate.

### RMII on the classic ESP32
Six pins are fixed by the chip (TXD0 on GPIO19, TX_EN on GPIO21, TXD1 on GPIO22, RXD0 on GPIO25, RXD1 on GPIO26, CRS_DV on GPIO27), two management pins (MDC and MDIO) are your choice, and the PHY needs a **50 MHz reference clock**. Either a small oscillator on the board feeds it in on GPIO0 (the WT32-ETH01 and the Olimex boards do) or the ESP makes it and sends it out on GPIO16 or GPIO17 (the LilyGO T-Internet-POE). GPIO0 is a strapping pin, so a clock running during reset can change the boot mode ([[strapping-pins]]): that is why such boards switch the oscillator on only after reset, from a power pin, and why Olimex warns that Ethernet can hang if started too soon after reset.

### From the sketch
The Arduino \`ETH\` library starts the port with the PHY type, its bus address, the MDC, MDIO and power pins and the clock mode; after that the interface works like Wi-Fi to the network code: DHCP gives an address, and sockets, HTTP and MQTT run unchanged. A board that uses the W5500 starts with another form of the call that names the SPI pins, chip select, interrupt and reset instead.

### Power over Ethernet
IEEE 802.3af delivers up to 15.4 W from the switch, a little over 12 W at the device, at about 48 V; the board needs a PoE module that turns it into 5 V, ideally isolated (the Olimex ESP32-POE-ISO gives 3000 V isolation). A plain Ethernet device on a standards-based PoE port is safe: the switch asks first.

> [!warn] Passive PoE injectors put 12 to 48 V on the cable without asking. Plugging a board without a PoE module into one can destroy it.

> [!key] An ESP gets Ethernet from an on-chip MAC plus a PHY (ESP32, P4) or from an SPI chip like the W5500 (everything else). Mind the 50 MHz clock and the strapping pin GPIO0, and let PoE use a proper isolated module.`,
  ideas: [
    'Ethernet is steady and wired: no channel sharing, predictable delay, and Power over Ethernet can bring power along.',
    'The ESP32 and the ESP32-P4 have an Ethernet MAC and need an external PHY on RMII; every other chip uses an SPI Ethernet chip such as the W5500.',
    'The RMII PHY needs a 50 MHz clock, often on GPIO0, a strapping pin, which makes start-up timing matter.',
    'Once the link is up and DHCP has given an address, the interface behaves like Wi-Fi to the network code.'
  ],
  pitfalls: [
    'Any ESP32 board can have Ethernet by adding a socket — A bare RJ45 socket is not enough: it needs a PHY chip (or an SPI Ethernet chip), the right clock, and chips with an on-chip MAC for the RMII form.',
    'SPI Ethernet runs at 100 Mbit/s — The link between the W5500 and the ESP is an SPI bus, and the chip handles frames through interrupts: real throughput is a fraction of the line rate, plenty for sensors and web pages.',
    'Ethernet needs no setup because it is a cable — The sketch must start the port, the PHY clock must be right, and the board must be given an address by DHCP or a fixed one, as with Wi-Fi.'
  ],
  terms: [
    { term: 'MAC', also: ['Ethernet MAC', 'media access controller'], def: 'The part of an Ethernet port that builds and reads frames. The ESP32 and the P4 have one in the chip; other chips need an external chip that has one.' },
    { term: 'PHY', also: ['Ethernet PHY', 'LAN8720'], def: 'The chip that turns the MAC\'s digital signals into the analogue signals on the cable, and back. It connects to the ESP over RMII and to the cable through magnetics.' },
    { term: 'RMII', also: ['reduced media-independent interface'], def: 'The interface between an Ethernet MAC and its PHY: a handful of data pins plus a 50 MHz reference clock.' },
    { term: 'W5500', also: ['SPI Ethernet', 'DM9051'], def: 'An Ethernet controller with MAC and PHY in one chip, used over SPI. It lets a chip without an Ethernet MAC reach a wired network.' },
    { term: 'PoE', also: ['Power over Ethernet', '802.3af'], def: 'Power sent over the same cable as the data: up to 15.4 W at about 48 V under 802.3af. The board needs a PoE module to turn it into 5 V.' }
  ],
  choose: {
    good: ['Fixed devices that must be reachable and steady: gateways, controllers, wall displays', 'Places where Wi-Fi is poor or crowded', 'Installations that want one cable for data and power (PoE)'],
    avoid: ['Battery-powered nodes: the PHY and its link draw tens of milliamps all the time', 'Chasing high throughput with SPI Ethernet', 'Starting the port straight out of reset on a board that clocks the PHY from a strapping pin'],
    check: ['Whether the board uses RMII (ESP32, P4) or an SPI chip, and which PHY or chip it has', 'The clock mode, the power pin and the PHY address from the board\'s page', 'The PoE class and isolation, if PoE is used']
  },
  code: [
    {
      title: 'Bring up Ethernet and report the link',
      about: 'Starts the Ethernet port of a WT32-ETH01 (an ESP32 with a LAN8720 and a 50 MHz oscillator) and prints the state of the link every two seconds. The board takes its address from DHCP.',
      needs: 'A WT32-ETH01 or another ESP32 board with a LAN8720; a network cable to a router with DHCP. For other boards change the PHY type, address, MDC, MDIO, power pin and clock mode.',
      wiring: [['GPIO23', 'LAN8720 MDC', 'fixed on the board'], ['GPIO18', 'LAN8720 MDIO', 'fixed on the board'], ['GPIO16', 'oscillator enable', 'powers the 50 MHz clock'], ['GPIO0', '50 MHz clock input', 'from the oscillator']],
      blocks: `
        when started
          start serial at (115200) baud
          start Ethernet with a LAN8720, PHY address (1), MDC (23), MDIO (18), power pin (16), clock in on pin (0) :: net
        every (2) seconds
          if <Ethernet link up?> then
            print (join [link up, IP address ] (IP address of Ethernet))
          else
            print [waiting for a cable and an address ...]
          end
      `,
      cpp: String.raw`
        #include <ETH.h>

        #define ETH_PHY_TYPE  ETH_PHY_LAN8720
        #define ETH_PHY_ADDR  1
        #define ETH_PHY_MDC   23
        #define ETH_PHY_MDIO  18
        #define ETH_PHY_POWER 16              // switches the 50 MHz oscillator on
        #define ETH_CLK_MODE  ETH_CLOCK_GPIO0_IN

        void setup() {
          Serial.begin(115200);
          delay(500);                         // do not start the PHY straight out of reset
          ETH.begin(ETH_PHY_TYPE, ETH_PHY_ADDR, ETH_PHY_MDC, ETH_PHY_MDIO, ETH_PHY_POWER, ETH_CLK_MODE);
        }

        void loop() {
          if (ETH.linkUp()) {
            Serial.printf("link up, %d Mbit/s, %s duplex, IP %s\n", ETH.linkSpeed(),
                          ETH.fullDuplex() ? "full" : "half", ETH.localIP().toString().c_str());
          } else {
            Serial.println("waiting for a cable and an address ...");
          }
          delay(2000);
        }
      `,
      py: String.raw`
        import network
        import time
        from machine import Pin

        lan = network.LAN(mdc=Pin(23), mdio=Pin(18), power=Pin(16),
                          phy_type=network.PHY_LAN8720, phy_addr=1,
                          ref_clk=Pin(0), ref_clk_mode=Pin.IN)    # the 50 MHz clock comes in on GPIO0
        lan.active(True)

        while True:
            if lan.isconnected():
                print("link up, address", lan.ipconfig("addr4"))
            else:
                print("waiting for a cable and an address ...")
            time.sleep(2)
      `,
      output: `
        waiting for a cable and an address ...
        link up, 100 Mbit/s, full duplex, IP 192.168.1.57
      `,
      notes: ['The address shows 0.0.0.0 for a moment after the link comes up: DHCP takes a second or two.', 'WT32-ETH01 has no USB: flashing needs a 3.3 V serial adapter and GPIO0 held low, with the oscillator enabled (the board\'s page in the catalogue has the details).', 'For a W5500 board such as the Waveshare ESP32-S3-ETH the call differs: the SPI pins, chip select, interrupt and reset replace MDC and MDIO; take the numbers from the board\'s page.']
    }
  ],
  quiz: [
    { q: 'Which of these chips has an Ethernet MAC built in, needing only a PHY?', choices: ['ESP32-S3', 'ESP32-C3', 'The original ESP32', 'ESP32-C6'], a: 2, why: 'The original ESP32 (and the P4) have an Ethernet MAC. The S3, C3 and C6 need an SPI Ethernet chip such as the W5500.' },
    { q: 'A WT32-ETH01-style board sometimes fails to boot after a power glitch, and works if started a moment later. A good explanation?', choices: ['The cable is too long', 'GPIO0 is a strapping pin and the 50 MHz clock arrives on it during reset', 'DHCP is slow', 'The router blocks the board'], a: 1, why: 'A clock running on GPIO0 while the chip is leaving reset can be read as the boot-mode level. Boards switch the oscillator on from a power pin only after the chip has started, and a delay before ETH.begin() keeps that order.' },
    { q: 'A board without a PoE module is plugged into a 24 V passive PoE injector. What happens?', choices: ['Nothing: Ethernet ignores the voltage', 'It may be destroyed: the injector puts the voltage on the cable without asking', 'The link runs slower', 'The switch negotiates a lower voltage'], a: 1, why: 'Standards-based 802.3af/at PoE detects a PoE device before powering it. A passive injector does not: the voltage is on the cable all the time.' },
    { q: 'An ESP32-S3 with a W5500 reaches the 100 Mbit/s of its link.', a: false, why: 'The W5500 is on an SPI bus and the traffic goes through interrupts and an SPI driver, so the real throughput is a fraction of the line rate. It is plenty for sensors, web pages and MQTT.' }
  ],
  applications: [
    'Ethernet gateways and serial-to-Ethernet bridges, such as the WT32-ETH01 in industrial settings.',
    'Building automation boards with PoE, like the Olimex ESP32-POE family and the LilyGO T-Internet-POE.',
    'Modbus TCP gateways between an RS-485 line and a plant network ([[modbus]]).',
    'Home Assistant devices in places where Wi-Fi is poor or crowded.'
  ],
  sources: [
    'IEEE 802.3, *Ethernet* (including 802.3af Power over Ethernet).',
    'Espressif, *ESP-IDF Programming Guide*: Ethernet (MAC and PHY drivers, SPI Ethernet, RMII clocking).',
    'Arduino core for ESP32 documentation: the ETH library and its examples (core 3.3).'
  ]
},

/* ================================================================ i2s */
{
  id: 'i2s',
  parent: 'fieldbuses-and-other-links',
  title: 'I2S',
  level: 2,
  short: 'The three-wire audio bus: a bit clock, a word clock that says left or right, and one data line. It carries digital sound from the ESP to an amplifier or from a microphone to the ESP, and anything else that is a steady stream of samples.',
  keywords: ['I2S', 'BCLK', 'LRCLK', 'WS', 'word select', 'SCK', 'MCLK', 'sample rate', 'MAX98357A', 'INMP441', 'PCM5102', 'left justified', 'Philips', 'TDM', 'PDM', 'ESP_I2S', 'stereo', 'slot', 'audio', 'DAC', 'microphone'],
  prereq: ['serial-communication-basics', 'peripherals-overview', 'spi'],
  related: ['digital-audio-basics', 'i2s-microphones', 'i2s-amplifiers-and-dacs', 'audio-codecs', 'playing-audio-files', 'dac-output', 'choosing-a-bus'],
  body: `Sound in a computer is a stream of numbers, *samples*, at a steady rate: 16 000, 44 100 or 48 000 a second for each channel. **I2S** (Inter-IC Sound, from Philips, 1986) is the simple way to carry such a stream between chips: three wires and ground.

### The wires
- **BCLK**, the bit clock (also called SCK): one pulse per bit.
- **LRCLK**, the word clock (also WS, word select): low while the left channel's sample goes by, high for the right. One full period is one *frame*: a sample for each channel.
- **DATA** (SD, DIN or DOUT): the bits, **most significant first**. The sender changes the line on the falling edge of BCLK and the receiver reads it on the rising edge. In the standard (Philips) format the first bit comes **one BCLK after** the LRCLK edge; in the *left-justified* format it comes with the edge.

Some DAC and codec chips also want **MCLK**, a master clock of typically 256 times the sample rate. Microphones and simple amplifiers usually do not.

### The arithmetic
The bit clock is fixed by the stream: **BCLK = sample rate × bits per slot × channels**. Sixteen-bit stereo at 16 kHz needs 16 000 × 16 × 2 = 512 kHz. CD-style 44.1 kHz in 32-bit slots needs 44 100 × 32 × 2 = 2.8224 MHz. The master — usually the ESP — makes BCLK and LRCLK; the part at the other end follows. A 24-bit sample sits in a 32-bit slot, padded with zeros.

### Parts you will meet
The MAX98357A is an amplifier with an I2S input that drives a small speaker directly; the PCM5102 is a DAC for line-level audio; the INMP441 is a microphone with an I2S output; codec chips such as the ES8311 on many ESP32-S3 and P4 boards do both and have their own control bus. *PDM* microphones use a different two-wire format that the ESP's I2S block can also read.

### On an ESP
The pins are free to choose through the GPIO matrix. The chips have one to three I2S blocks (two on the ESP32 and S3, three on the P4, none on the C2). In Arduino 3.x the library is \`ESP_I2S\`, with your own \`I2SClass\` object; the old \`I2S.h\` of core 2 is gone. Samples are sent as 16-bit little-endian numbers, left and right alternating. The write call waits until the data is queued, so a loop that only writes runs at the speed of the audio.

> [!key] I2S carries samples on three wires: BCLK for each bit, LRCLK for left and right, and DATA with the most significant bit first. The bit clock is sample rate times bits per slot times channels.`,
  ideas: [
    'I2S is a three-wire stream of audio samples: a bit clock, a word clock that alternates left and right, and a data line.',
    'Data goes most significant bit first, one BCLK after the LRCLK edge in the standard format.',
    'BCLK = sample rate × bits per slot × channels; some codec chips also need an MCLK of 256 × the sample rate.',
    'The ESP can be the master, picks any pins, and sends 16-bit left and right samples alternately.'
  ],
  pitfalls: [
    'I2S is only for audio — It is a general synchronous stream of samples: it also carries data from some ADCs, and fast streams of sensor readings.',
    'The left channel is the one on the LRCLK high level — Left is low, right is high. A mono speaker amplifier mixes or picks one; a microphone with its L/R pin tied the wrong way answers in the other slot and seems silent.',
    'The 16-bit samples can be written as bytes of any order — They are 16-bit numbers, low byte first on the ESP, left and right alternating. A mono buffer sent as stereo plays at half speed and an octave low.'
  ],
  terms: [
    { term: 'I2S', also: ['Inter-IC Sound', 'IIS'], def: 'A synchronous serial bus for digital audio: a bit clock, a word clock and a data line. It carries samples between the ESP and an amplifier, DAC, microphone or codec.' },
    { term: 'BCLK', also: ['bit clock', 'SCK', 'SCLK'], def: 'The clock of an I2S bus: one pulse for every bit of data. Its frequency is the sample rate times the bits per slot times the number of channels.' },
    { term: 'LRCLK', also: ['word select', 'WS', 'frame sync'], def: 'The line that tells which channel the bits belong to: low for left, high for right. One period is one frame, one sample for each channel.' },
    { term: 'Sample rate', also: ['sampling frequency', 'fs'], def: 'How many samples per second each channel carries: 16 kHz for speech, 44.1 or 48 kHz for music.' },
    { term: 'MCLK', also: ['master clock'], def: 'An extra clock, typically 256 times the sample rate, that some DAC and codec chips need to run their internal filters.' },
    { term: 'PDM', also: ['pulse-density modulation', 'PDM microphone'], def: 'A two-wire audio format in which a one-bit stream encodes the sound by its density of ones. Many cheap MEMS microphones use it; the ESP\'s I2S block can read it.' }
  ],
  choose: {
    good: ['Digital microphones and amplifiers: no analogue wiring, no hum', 'Anything that needs a steady, exactly timed stream of samples', 'Sound beyond the ESP32\'s 8-bit DAC: 16-bit audio through an external DAC or codec'],
    avoid: ['Long wires: BCLK is a fast clock, keep it short and away from the antenna', 'Sharing the pins with the strapping or flash pins', 'Expecting a chip without an I2S block (ESP32-C2) to do it'],
    check: ['The sample rate and bit width the part accepts (see its datasheet)', 'Which slot the part uses (L/R pin of a microphone, mono mixing of an amplifier)', 'Whether the part needs an MCLK']
  },
  code: [
    {
      title: 'Play a 400 Hz tone through an I2S amplifier',
      about: 'Computes one cycle of a sine (40 samples at 16 kHz is exactly 400 Hz), then writes it left and right for ever through an I2S amplifier such as the MAX98357A. Keep the volume low: the amplitude is only 6000 of 32767.',
      needs: 'An ESP32 DevKit, a MAX98357A breakout and a small speaker (4 to 8 Ω) on its output. The breakout is powered from the 5 V pin or 3.3 V, with a common ground.',
      wiring: [['GPIO27', 'amplifier BCLK'], ['GPIO25', 'amplifier LRC'], ['GPIO26', 'amplifier DIN'], ['5V', 'amplifier VIN'], ['GND', 'amplifier GND']],
      blocks: `
        when started
          set [frame v] to (one cycle of a sine, 40 samples, amplitude 6000, left and right the same) :: my
          start I2S output: BCLK (27) LRC (25) data (26) at (16000) Hz, 16 bit stereo :: sound
          forever
            play (frame) on I2S, waiting until it is queued :: sound
          end
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        I2SClass i2s;                                  // the 2.x I2S.h API is gone: make your own object

        const int PIN_BCLK = 27, PIN_LRC = 25, PIN_DOUT = 26;   // amplifier BCLK, LRC and DIN
        const int RATE = 16000;
        const int N = 40;                              // 40 samples per cycle at 16 kHz: a 400 Hz tone
        int16_t frame[N * 2];                          // one cycle, left and right interleaved

        void setup() {
          Serial.begin(115200);
          for (int i = 0; i < N; i++) {
            int16_t s = (int16_t)(6000 * sin(2 * PI * i / N));   // quiet: 6000 of 32767
            frame[2 * i] = s;                          // left
            frame[2 * i + 1] = s;                      // right
          }
          i2s.setPins(PIN_BCLK, PIN_LRC, PIN_DOUT);    // before begin()
          if (!i2s.begin(I2S_MODE_STD, RATE, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO)) {
            Serial.println("I2S start failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          i2s.write((uint8_t *)frame, sizeof(frame));  // bytes; waits until queued: the loop runs at the sample rate
        }
      `,
      py: String.raw`
        from machine import I2S, Pin
        from array import array
        import math

        PIN_BCLK, PIN_LRC, PIN_DOUT = 27, 25, 26       # amplifier BCLK, LRC and DIN
        RATE = 16000
        N = 40                                         # 40 samples per cycle at 16 kHz: a 400 Hz tone

        frame = array("h", [0] * (N * 2))              # one cycle, left and right interleaved
        for i in range(N):
            s = int(6000 * math.sin(2 * math.pi * i / N))   # quiet: 6000 of 32767
            frame[2 * i] = s                           # left
            frame[2 * i + 1] = s                       # right

        audio = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_LRC), sd=Pin(PIN_DOUT),
                    mode=I2S.TX, bits=16, format=I2S.STEREO, rate=RATE, ibuf=8000)
        while True:
            audio.write(frame)                         # waits until queued
      `,
      notes: ['Start with the amplifier\'s gain at its lowest and a speaker you do not mind: a bug in the buffer can make a loud noise.', 'Change N to 20 for 800 Hz, to 80 for 200 Hz. The pitch is the sample rate divided by the samples per cycle.', 'MicroPython marks its I2S class as a technical preview in version 1.29; the call forms above are those of that version.']
    }
  ],
  formulas: [
    {
      name: 'The bit clock of an I2S stream',
      expr: 'f = fs*b*n',
      tex: 'f_{BCLK} = f_s \\, b \\, n',
      vars: {
        f: { name: 'bit clock frequency', tex: 'f_{BCLK}', q: 'frequency', unit: 'kHz' },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 16 },
        b: { name: 'bits per slot', value: 16, min: 8, max: 32, int: true },
        n: { name: 'channels', value: 2, min: 1, max: 8, int: true }
      },
      solveFor: 'f',
      note: 'The slot, not the sample, sets the clock: a 24-bit sample in a 32-bit slot costs 32 clocks. An MCLK, when needed, is a further, faster clock: usually 256 times the sample rate.',
      stories: { f: 'A stereo stream at {fs} with {b} bits per slot. What bit clock does the bus need?', fs: 'The bit clock is {f} for {n} channels of {b}-bit slots. What is the sample rate?' },
      practice: { unknowns: ['f', 'fs'] }
    }
  ],
  examples: [
    {
      title: 'Is the bus fast enough?',
      q: 'A voice recorder samples a microphone at 16 kHz, 16 bits, mono on a stereo I2S bus (the other slot is unused). What bit clock does the bus run at, and how many bytes a second does the ESP have to store?',
      steps: ['The bus is still stereo: $16\\,000 \\times 16 \\times 2 = 512$ kHz.', 'The ESP keeps only one slot of the two: $16\\,000 \\times 2 = 32\\,000$ bytes a second.', 'A minute of speech is 1.92 MB, which is why recorders store compressed audio or write to a card.'],
      a: '512 kHz on the wire and 32 kB/s of useful data: 1.9 MB a minute.'
    }
  ],
  quiz: [
    { q: 'What bit clock does a stereo I2S bus need for 48 kHz audio in 32-bit slots?', choices: ['1.536 MHz', '3.072 MHz', '48 kHz', '6.144 MHz'], a: 1, why: 'BCLK = 48 000 × 32 × 2 = 3 072 000 Hz. The bit clock counts every bit of every slot in both channels.' },
    { q: 'Which line tells an I2S receiver whether the current sample belongs to the left or the right channel?', choices: ['BCLK', 'DATA', 'LRCLK (word select)', 'MCLK'], a: 2, why: 'LRCLK (WS) is low for the left channel and high for the right. BCLK only counts bits, and MCLK is a spare high-speed clock for some chips.' },
    { q: 'A stereo buffer of 16-bit samples plays too slowly and an octave low when it is sent to a mono stream configured at the same rate. What happened?', choices: ['The volume is too low', 'Left and right samples alternate, so read as mono the data lasts twice as long', 'The bit clock is too fast', 'MCLK is missing'], a: 1, why: 'Interleaved stereo carries two numbers for every moment of sound. Played as mono at the same sample rate, each number takes a time step of its own, so the sound lasts twice as long and sits an octave lower. Match the slot mode to the buffer.' },
    { q: 'I2S can be used only for audio.', a: false, why: 'It is a general synchronous stream of samples. Audio is the common use, but some converters and sensors send other data over it.' }
  ],
  applications: [
    'Speakers and music players: a MAX98357A or a DAC board turns a stream of samples into sound.',
    'Voice recorders, intercoms and wake-word devices that read an I2S or PDM microphone.',
    'Audio codec boards such as the ES8311-based ones on the ESP32-S3 and P4 boards, with a microphone and a speaker.',
    'Test tones, beepers and signal generators made by computing samples.'
  ],
  sources: [
    'Philips Semiconductors, *I2S bus specification* (February 1986, revised June 1996).',
    'Espressif, *ESP-IDF Programming Guide*: I2S driver (standard, TDM and PDM modes).',
    'Arduino core for ESP32 documentation: the ESP_I2S library; MicroPython documentation, class *machine.I2S*.'
  ],
  sim: 'fb-i2s'
},

/* ================================================================ sdio-and-sdmmc */
{
  id: 'sdio-and-sdmmc',
  parent: 'fieldbuses-and-other-links',
  title: 'SDIO and SD/MMC',
  level: 3,
  short: 'The fast way to an SD card: a clock, a command wire and up to four data wires, against SPI\'s single data line. The same bus, in slave mode, is how one ESP gives another chip a fast link to a host. Some chips have it, on pins that can clash with the boot pins.',
  keywords: ['SD', 'SDIO', 'SDMMC', 'SD_MMC', '4-bit', '1-bit', 'microSD', 'CMD', 'CLK', 'D0', 'GPIO12', 'host', 'slave', 'ESP-Hosted', 'card detect', 'pull-ups', 'high speed', '40 MHz', 'FAT'],
  prereq: ['spi', 'strapping-pins', 'sd-cards'],
  related: ['sd-cards', 'littlefs-and-file-systems', 'esp-as-a-co-processor', 'esp-at-and-esp-hosted', 'logging-data', 'parallel-interfaces', 'esp32-p4-function-ev-board'],
  body: `An SD card speaks two languages. **SPI mode** is simple and works on any chip ([[sd-cards]]). Its native language, the **SD bus**, has a clock (**CLK**), a bidirectional command line (**CMD**) and one or four data lines (**D0** to **D3**). In 4-bit mode four bits move per clock, so at the same clock it is up to four times faster than SPI's one. ESP-IDF calls the host controller SDMMC; the Arduino library is \`SD_MMC\`.

### Who has it
From the chip catalogue: an SD/MMC **host** controller is on the ESP32, ESP32-S3, ESP32-P4 and ESP32-S31. The ESP32-S2, the C-series and the H-series have none, so they use SPI mode. The same bus also works the other way round: an **SDIO slave** is a chip that pretends to be a card to a host. The ESP32 can be one, and so can the C6, C5 and C61, which is how a P4 gets its Wi-Fi and Bluetooth from a C6 on the same board (see [[esp-at-and-esp-hosted]]).

### Pins, and the boot trap
On the original ESP32 the host's pins are fixed: CLK on GPIO14, CMD on GPIO15, D0 on GPIO2, D1 on GPIO4, D2 on GPIO12 and D3 on GPIO13. Three of them are **strapping pins** (GPIO2, GPIO12, GPIO15). A card holds its data lines high, and GPIO12 high at reset makes the chip choose 1.8 V for the flash: the board does not boot with the card inserted ([[strapping-pins]]). The cures: use **1-bit mode** (only CLK, CMD and D0 are wired; leave D1 to D3 unconnected), use SPI mode, or fix the flash voltage in an eFuse. On the S3 the pins can be chosen freely.

### Wiring and power
- **Pull-ups** of about 10 kΩ on CMD and the data lines are required; the ESP's internal ones are too weak for fast cards. Socket boards and card modules have them.
- A card runs at 3.3 V, draws tens of milliamps and more in short bursts when writing: put 10 to 100 µF across the supply at the socket ([[current-peaks-and-capacitors]]).
- Keep CLK short and away from the antenna: it runs at 20 or 40 MHz.

### Speed and files
The default clock is 20 MHz, high speed 40 MHz. At 40 MHz four bits make 160 Mbit/s (20 MB/s) on paper; real cards and the file system deliver much less, but several times what SPI manages. Format cards up to 32 GB as FAT32; larger cards come with exFAT and usually need reformatting. Never remove a card while a file is open.

> [!key] SD/MMC is the SD card's native bus: CLK, CMD and one or four data lines, faster than SPI mode but with fixed pins on the ESP32 that collide with its strapping pins. Use 1-bit mode (or SPI) there, and give the card its pull-ups and a bulk capacitor.`,
  ideas: [
    'The SD bus has a clock, a command line and one or four data lines; 4-bit mode is up to four times faster than SPI mode at the same clock.',
    'The host controller is on the ESP32, S3, P4 and S31; chips without it use SPI mode. Some chips can also act as an SDIO slave.',
    'On the original ESP32 the host pins are fixed and three are strapping pins: GPIO12 held high by a card stops the board booting.',
    'Cards need pull-ups on CMD and the data lines, a supply at 3.3 V and a capacitor close to the socket.'
  ],
  pitfalls: [
    'The ESP32 and the card talk SD bus on any pins — On the original ESP32 the pins are fixed (CLK 14, CMD 15, D0 2, D1 4, D2 12, D3 13); the S3 can use others.',
    'A card that works on the bench works in the product — A card with its data lines pulled high on GPIO12 can stop the ESP32 booting, and a card\'s write bursts can reset a weak supply. Test with the final supply and with the card inserted at power-up.',
    '4-bit is always better — It needs four data wires, with GPIO12 and GPIO2 among them on the original ESP32. 1-bit mode needs fewer pins and avoids the boot trap, at lower speed.'
  ],
  terms: [
    { term: 'SDMMC', also: ['SD/MMC host', 'SD_MMC'], def: 'The ESP\'s controller for the SD card\'s native bus: clock, command line and one or four data lines, faster than SPI mode.' },
    { term: 'SDIO', also: ['SDIO slave', 'SDIO host'], def: 'The SD bus used for things other than storage. A chip that acts as an SDIO slave looks like a card to a host controller: the ESP32 and C6 can be one.' },
    { term: '4-bit mode', also: ['1-bit mode', 'D0 to D3'], def: 'The width of the SD bus: four data lines move four bits per clock, one line moves one. 1-bit mode needs only CLK, CMD and D0.' },
    { term: 'CMD line', def: 'The bidirectional wire on which the host sends commands and the card sends its answers on an SD bus.' }
  ],
  choose: {
    good: ['Logging or playing media that needs more than SPI mode can supply', 'A P4 or S3 project with a card socket and pins to spare', 'A fast link between two chips (SDIO slave), as ESP-Hosted does'],
    avoid: ['4-bit mode on the classic ESP32 without checking GPIO12 and GPIO2', 'A chip without the host controller: use SPI mode instead', 'A weak supply or no bulk capacitor at the socket'],
    check: ['Which pins your chip fixes, and which of them are strapping pins', 'The pull-ups on the socket board', 'That the card is formatted for the file system the code expects']
  },
  code: [
    {
      title: 'Mount a card in 1-bit mode and list its files',
      about: 'Mounts an SD card on the ESP32\'s SD/MMC host in 1-bit mode, which needs only CLK, CMD and D0 and avoids the GPIO12 trap, then prints its size and the files in the top folder.',
      needs: 'An ESP32 DevKit and a microSD socket or module wired to the fixed pins, with 10 kΩ pull-ups on CMD and D0. A FAT-formatted card with a few files.',
      wiring: [['GPIO14', 'card CLK'], ['GPIO15', 'card CMD', '10 kΩ pull-up to 3.3 V'], ['GPIO2', 'card D0', '10 kΩ pull-up to 3.3 V'], ['3V3, GND', 'card supply', '10 to 100 µF at the socket']],
      blocks: `
        when started
          start serial at (115200) baud
          mount the SD card in 1-bit mode on the fixed pins (CLK 14, CMD 15, D0 2) :: storage
          print (join [Card size in MB: ] (card size in MB))
          for each [name v] in (files in folder [/])
            print (join (name) [  ] (size of file (name)) [ bytes])
          end
      `,
      cpp: String.raw`
        #include "FS.h"
        #include "SD_MMC.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!SD_MMC.begin("/sdcard", true)) {        // true: 1-bit mode, only CLK, CMD and D0 are used
            Serial.println("Card mount failed");
            return;
          }
          Serial.printf("Card: %llu MB, %llu MB used\n",
                        (unsigned long long)(SD_MMC.cardSize() / (1024 * 1024)),
                        (unsigned long long)(SD_MMC.usedBytes() / (1024 * 1024)));
          File root = SD_MMC.open("/");
          File f = root.openNextFile();
          while (f) {
            Serial.printf("%-20s %8u bytes\n", f.name(), (unsigned)f.size());
            f = root.openNextFile();
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, os, vfs

        sd = machine.SDCard(slot=1, width=1)           # 1-bit mode on the fixed pins: CLK 14, CMD 15, D0 2
        vfs.mount(sd, "/sd")
        st = os.statvfs("/sd")
        print("Card: %d MB, %d MB free" % (st[0] * st[2] // 1048576, st[0] * st[3] // 1048576))
        for name in os.listdir("/sd"):
            print("%-20s %8d bytes" % (name, os.stat("/sd/" + name)[6]))
      `,
      output: `
        Card: 7580 MB, 3 MB used
        log.csv                 18432 bytes
        notes.txt                 211 bytes
      `,
      notes: ['The sketch reports the space used, the MicroPython program the space free: both are one subtraction apart.', 'To use 4-bit mode on the original ESP32, wire D1 to D3 as well and call begin("/sdcard") without the second argument: first check that GPIO12 stays low at reset with the card inserted.', 'GPIO2 (D0) is a strapping pin: a card with a pull-up on it can stop the automatic upload from entering download mode. Take the card out, or lift the pull-up, while uploading.', 'On an ESP32-S3 or P4 the pins can be set before the mount; see the board\'s page for the numbers.']
    }
  ],
  examples: [
    {
      title: 'The clock and the data rate',
      q: 'An SD card runs at the 40 MHz high-speed clock. What is the raw data rate in 1-bit and in 4-bit mode?',
      steps: ['One bit per clock: $40 \\times 10^6 \\times 1 = 40$ Mbit/s, which is 5 MB/s.', 'Four bits per clock: $40 \\times 10^6 \\times 4 = 160$ Mbit/s, which is 20 MB/s.', 'In practice command overhead, the card\'s own speed and the file system lower both figures; SPI mode at the same clock is also one bit wide.'],
      a: '40 Mbit/s (5 MB/s) in 1-bit mode and 160 Mbit/s (20 MB/s) in 4-bit mode, as upper limits.'
    }
  ],
  quiz: [
    { q: 'An ESP32 board boots with the SD card removed but resets in a loop with the card inserted in 4-bit mode. What is the most probable cause?', choices: ['The card is too large', 'The card pulls D2 (GPIO12) high at reset, so the chip chooses 1.8 V for the flash', 'CLK is too fast', 'The file system is FAT32'], a: 1, why: 'GPIO12 is the strapping pin that selects the flash voltage and must be low at reset. The card\'s data lines are pulled high. Use 1-bit mode or SPI mode, or fix the voltage in an eFuse.' },
    { q: 'Which pins does 1-bit SD/MMC mode need?', choices: ['CLK, CMD and D0', 'CLK, CMD and D0 to D3', 'MOSI, MISO, SCK and CS', 'Only D0'], a: 0, why: 'The 1-bit SD bus uses the clock, the command line and one data line. D1 to D3 are for 4-bit mode; MOSI, MISO, SCK and CS are the SPI-mode names.' },
    { q: 'You are using an ESP32-C3 and want an SD card. Which mode?', choices: ['SD/MMC 4-bit', 'SD/MMC 1-bit', 'SPI mode', 'Impossible'], a: 2, why: 'The C3 has no SD/MMC host controller, so a card is used in SPI mode over the SPI bus.' },
    { q: 'An SDIO slave is a chip that behaves as an SD card to a host controller.', a: true, why: 'The host believes it has a card with extra functions. ESP-Hosted uses it to connect an ESP32-C6 to an ESP32-P4: the C6 acts as the SDIO slave.' }
  ],
  applications: [
    'High-rate data loggers and recorders that must keep up with a stream (audio, camera, sensors).',
    'Media players and displays on the ESP32-S3 and P4 that read pictures and sound from a card.',
    'The ESP32-P4 boards with an ESP32-C6 attached through SDIO for Wi-Fi and Bluetooth.',
    'Firmware or configuration loaded from a card in the field.'
  ],
  sources: [
    'SD Association, *SD Specifications Part 1: Physical Layer Simplified Specification*; *Part E1: SDIO Simplified Specification*.',
    'Espressif, *ESP-IDF Programming Guide*: SD/SDIO/MMC driver (host and slave).',
    'Arduino core for ESP32 documentation: the SD_MMC library; MicroPython documentation, class *machine.SDCard*.'
  ]
}

,

/* ================================================================ dmx-and-midi */
{
  id: 'dmx-and-midi',
  parent: 'fieldbuses-and-other-links',
  title: 'DMX512 and MIDI',
  level: 2,
  short: 'Two old serial standards from the entertainment world, both within reach of an ESP\'s UART: DMX512 sends up to 512 channels of lighting values over RS-485, and MIDI sends notes and controls over a 5 mA current loop at 31 250 baud — or over USB or Bluetooth LE.',
  keywords: ['DMX', 'DMX512', 'MIDI', 'RS-485', 'break', 'mark after break', 'start code', 'slot', 'channel', 'universe', 'XLR', '5-pin DIN', 'current loop', 'optocoupler', '31250', 'note on', 'velocity', 'running status', 'USB MIDI', 'BLE MIDI', 'Art-Net', 'sACN', 'stage lighting'],
  prereq: ['rs-485', 'uart', 'uart-on-the-esp'],
  related: ['wled', 'addressable-leds', 'usb-device-hid-cdc-msc', 'optocouplers', 'ble-hid', 'udp-between-boards', 'rgb-leds'],
  body: `Stage lighting and electronic music were wired up long before the ESP32 existed, and both standards are plain serial links that a UART can speak.

### DMX512
DMX512 controls dimmers, moving lights and fog machines. A controller sends a **packet** over and over, up to about 44 times a second at full size; every light looks at the **slot** (channel) it was set to and ignores the rest. The dimmers it controls switch mains, but the ESP stays on the data side.
- Electrically it is [[rs-485|RS-485]]: one pair, a 120 Ω terminator at the last device, 5-pin XLR (3-pin on cheap equipment). Data goes one way only.
- **250 kbit/s, 8 data bits, 2 stop bits**: a slot is 11 bits, 44 µs.
- A packet is a **break** (the line low for at least 92 µs), a **mark after break** (high for at least 12 µs), a **start code** (0x00 for ordinary dimmer data) and up to **512 slots** of one byte each, 0 to 255: one *universe*.
- A full packet takes about 92 + 12 + 513 × 44 µs = 22.7 ms, which is 44 per second; fewer slots make it faster.

The break is the part a UART finds hard, because it is a low longer than any character. The usual trick on an ESP is to drop the baud rate, send one zero byte (a 100 µs low), and return to 250 kbit/s; libraries do it for you. Wi-Fi sources such as Art-Net and sACN carry DMX over a network, and an ESP can turn them into RS-485 packets.

### MIDI
**MIDI** (1983) sends *messages*: a **status byte** with its top bit set (the kind of message and the channel 1 to 16) followed by **data bytes** whose top bit is clear (0 to 127). *Note on* is 0x90 plus the channel, then the note number (60 is middle C) and the velocity; velocity 0 counts as note off. Three bytes at 31 250 baud take 0.96 ms. *Running status* lets a run of messages of one kind leave out the repeated status byte.

The classic wire is a **current loop** of about 5 mA through a 5-pin DIN socket; the receiver is an **optocoupler**, so the two devices share no ground and hum loops are avoided. The resistor values depend on the supply (220 Ω for 5 V; smaller for 3.3 V, so check the current electrical specification). Today a USB connection (an ESP32-S2, S3 or P4 can be a class-compliant USB MIDI device, [[usb-device-hid-cdc-msc]]) or BLE-MIDI is often simpler.

> [!key] DMX512 is RS-485 at 250 kbit/s: a break, a start code and up to 512 one-byte channels, repeated about 44 times a second. MIDI is a 31 250 baud current loop of three-byte messages; both are ordinary UART traffic with their own wiring.`,
  ideas: [
    'DMX512 repeats a packet of up to 512 one-byte channels, each light reading its own slot; it runs over RS-485 at 250 kbit/s.',
    'A DMX packet starts with a break of at least 92 µs and a mark after break of at least 12 µs, which an ESP makes by briefly lowering the baud rate.',
    'MIDI messages are a status byte (top bit set) and one or two data bytes (0 to 127) at 31 250 baud; a note on takes 0.96 ms.',
    'MIDI\'s wire is a 5 mA current loop with an optocoupler at the receiver; USB and BLE carry the same messages too.'
  ],
  pitfalls: [
    'DMX is RS-485, so any RS-485 board will do the break — The transceiver does only levels. The break and the 2 stop bits must come from the UART and the program.',
    'MIDI is 5 V serial: connect the DIN pins to the ESP directly — The loop needs its resistors (and an optocoupler on the input side). A bare ESP pin wired to a DIN socket gives a wrong current and no isolation.',
    'A DMX packet must always be 512 slots — It may be shorter, down to about 24 slots; every light still reads its own slot. A shorter packet is simply sent more often.'
  ],
  terms: [
    { term: 'DMX512', also: ['DMX', 'ANSI E1.11', 'universe'], def: 'A one-way lighting control standard: packets of up to 512 one-byte channels (a universe) sent over RS-485 at 250 kbit/s, each device reading the channel it is set to.' },
    { term: 'Break', also: ['mark after break', 'MAB'], def: 'The start of a DMX packet: the line low for at least 92 µs, then high for at least 12 µs, which tells receivers that the next byte is slot 0.' },
    { term: 'Slot', also: ['channel', 'start code'], def: 'One byte of a DMX packet, 11 bits long with its start and stop bits. Slot 0 is the start code, slots 1 to 512 are the channel values.' },
    { term: 'MIDI', also: ['MIDI 1.0', 'note on', 'status byte'], def: 'A protocol of short messages for music: a status byte says the kind and channel, data bytes (0 to 127) carry the note and velocity. Sent at 31 250 baud.' },
    { term: 'Current loop', also: ['optocoupler input', '5 mA loop'], def: 'A link in which the signal is a current, not a voltage. MIDI\'s receiver is an optocoupler, which isolates the two devices.' }
  ],
  choose: {
    good: ['DMX512 for dimmers, LED fixtures and stage effects that already speak it', 'MIDI for connecting instruments, controllers and music software', 'An ESP as a bridge: Wi-Fi or ESP-NOW in, DMX or MIDI out'],
    avoid: ['A bare ESP pin on a DIN socket: the loop needs its resistors and an optocoupler on the input', 'DMX data on unterminated, long star-wired cables', 'Controlling mains dimmers directly: the dimmer pack does that, the ESP only sends data'],
    check: ['The break and mark-after-break timing against the fixtures\' datasheets', 'Whether the equipment wants DMX terminated at its last device', 'The 3.3 V resistor values of the MIDI loop in the current specification']
  },
  code: [
    {
      title: 'Send a MIDI note every second',
      about: 'Plays middle C for half a second, then silences it, over a MIDI OUT socket. The UART runs at 31 250 baud with no receive pin. The three bytes of a message go out together.',
      needs: 'An ESP32 DevKit and a 5-pin DIN MIDI OUT socket wired as the MIDI loop needs: TX through a resistor to pin 5, the supply through a resistor to pin 4, pin 2 to ground.',
      wiring: [['GPIO25', 'resistor → DIN pin 5', 'value per the MIDI specification for your supply'], ['3V3 or 5V', 'resistor → DIN pin 4'], ['GND', 'DIN pin 2']],
      blocks: `
        when started
          start UART (2) at (31250) baud on TX (25) :: bus
          forever
            note on (60) velocity (100) :: my
            wait (0.5) seconds
            note off (60) :: my
            wait (0.5) seconds
          end

        define note on (note) velocity (velocity)
          send bytes (0x90) (note) (velocity) on UART (2) :: bus

        define note off (note)
          send bytes (0x80) (note) (64) on UART (2) :: bus
      `,
      cpp: String.raw`
        const int MIDI_TX = 25;
        const uint8_t CHANNEL = 0;              // MIDI channel 1 is number 0 on the wire

        void noteOn(uint8_t note, uint8_t velocity) {
          Serial2.write((uint8_t)(0x90 | CHANNEL));
          Serial2.write(note);
          Serial2.write(velocity);
        }

        void noteOff(uint8_t note) {
          Serial2.write((uint8_t)(0x80 | CHANNEL));
          Serial2.write(note);
          Serial2.write((uint8_t)0x40);         // release velocity
        }

        void setup() {
          Serial2.begin(31250, SERIAL_8N1, -1, MIDI_TX);   // transmit only: no RX pin
        }

        void loop() {
          noteOn(60, 100);                      // middle C
          delay(500);
          noteOff(60);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        MIDI_TX = 25
        CHANNEL = 0                              # MIDI channel 1 is number 0 on the wire

        midi = UART(2, baudrate=31250, tx=MIDI_TX)

        def note_on(note, velocity):
            midi.write(bytes([0x90 | CHANNEL, note, velocity]))

        def note_off(note):
            midi.write(bytes([0x80 | CHANNEL, note, 0x40]))   # release velocity

        while True:
            note_on(60, 100)                     # middle C
            time.sleep_ms(500)
            note_off(60)
            time.sleep_ms(500)
      `,
      notes: ['Many synthesisers also accept a note on with velocity 0 as a note off: that lets running status skip the status byte.', 'Do not hang a 5 V device on the 3.3 V ESP\'s line without the loop resistors, and do not link the grounds of the MIDI cable: the receiving side is an optocoupler on purpose.']
    },
    {
      title: 'Send DMX512 packets with one ramping channel',
      about: 'Sends packets of 24 slots with channel 1 ramping from 0 to 255 every 2.56 seconds. The break comes from the baud-rate trick: a zero byte at 90 000 baud is a low of 100 µs, and the two stop bits are the mark after break.',
      needs: 'An ESP32 DevKit, a 3.3 V RS-485 transceiver board with its DE and RE tied together and held high, and a DMX fixture or dimmer (set to channel 1).',
      wiring: [['GPIO25', 'transceiver DI'], ['GPIO27', 'DE and RE together, held HIGH'], ['A, B', 'the DMX line', '120 Ω at the last device'], ['GND', 'common ground']],
      blocks: `
        when started
          set pin (27) as [output v]
          set pin (27) to [HIGH v]
          start UART (2) at (250000) baud, 8 data bits, 2 stop bits, on TX (25) :: bus
          set [dmx v] to (a list of 513 zeros: item 1 is the start code) :: my
          forever
            set item (2) of [dmx v] to ((milliseconds since start) / (10) mod (256))
            send a DMX packet of (24) slots :: my
            wait (0.005) seconds
          end

        define send a DMX packet of (slots) slots
          change the UART speed to (90000) baud :: bus
          send byte (0) and wait until it has gone out :: bus
          change the UART speed to (250000) baud :: bus
          send (dmx) from item 1 for (slots + 1) bytes and wait until they have gone out :: bus
      `,
      cpp: String.raw`
        const int DMX_TX = 25;
        const int DMX_DE = 27;
        uint8_t dmx[513];                        // slot 0 is the start code, slots 1 to 512 the channels

        void sendPacket(int slots) {
          Serial2.updateBaudRate(90000);         // one zero byte at 90 kbaud: about 100 us low, the break
          Serial2.write((uint8_t)0);
          Serial2.flush();
          Serial2.updateBaudRate(250000);        // back to DMX speed; the stop bits were the mark after break
          Serial2.write(dmx, slots + 1);
          Serial2.flush();
        }

        void setup() {
          pinMode(DMX_DE, OUTPUT);
          digitalWrite(DMX_DE, HIGH);            // this node only transmits
          Serial2.begin(250000, SERIAL_8N2, -1, DMX_TX);
        }

        void loop() {
          dmx[1] = (millis() / 10) % 256;        // channel 1 ramps from 0 to 255 every 2.56 s
          sendPacket(24);
          delay(5);
        }
      `,
      py: String.raw`
        from machine import UART, Pin
        import time

        DMX_TX, DMX_DE = 25, 27
        dmx = bytearray(513)                     # slot 0 is the start code, slots 1 to 512 the channels

        de = Pin(DMX_DE, Pin.OUT, value=1)       # this node only transmits
        uart = UART(2, baudrate=250000, bits=8, parity=None, stop=2, tx=DMX_TX)

        def send_packet(slots):
            uart.init(baudrate=90000, bits=8, parity=None, stop=2)    # one zero byte at 90 kbaud: the break
            uart.write(b"\x00")
            uart.flush()
            uart.init(baudrate=250000, bits=8, parity=None, stop=2)   # back to DMX speed
            uart.write(dmx[:slots + 1])
            uart.flush()

        while True:
            dmx[1] = (time.ticks_ms() // 10) % 256    # channel 1 ramps from 0 to 255 every 2.56 s
            send_packet(24)
            time.sleep_ms(5)
      `,
      notes: ['Check the break with a logic analyser or scope: at least 92 µs low, then at least 12 µs high. Some fixtures are fussy and want a longer break than the minimum.', 'Changing the baud rate between the break and the data costs a few hundred microseconds; for smooth effects at the full 44 packets a second a DMX library that makes the break in hardware is better.', 'Terminate the line at the last fixture, and keep the ESP on the data side: dimmers that switch mains are separate, certified equipment.']
    }
  ],
  formulas: [
    {
      name: 'Time of a DMX packet',
      expr: 't = b + 0.000044*(n + 1)',
      tex: 't = t_{brk} + 44\\,\\mu\\mathrm{s} \\times (n + 1)',
      vars: {
        t: { name: 'packet time', q: 'time', unit: 'ms' },
        b: { name: 'break plus mark after break', tex: 't_{brk}', q: 'time', unit: 'µs', value: 104 },
        n: { name: 'channels sent', value: 512, min: 1, max: 512, int: true }
      },
      solveFor: 't',
      note: 'Every slot, the start code included, is 11 bits of 4 µs. The refresh rate is the inverse of the packet time: 44 a second for 512 channels, over 800 for 24.',
      stories: { t: 'A controller sends {n} channels with a break of {b}. How long does one packet take?' },
      practice: { unknowns: ['t', 'n'] }
    }
  ],
  quiz: [
    { q: 'How long does a full DMX packet of 512 channels take, roughly?', choices: ['2 ms', '23 ms', '230 ms', '2 s'], a: 1, why: 'Break and mark after break are about 0.1 ms; the 513 slots (start code plus channels) are 11 bits at 4 µs each: 513 × 44 µs = 22.6 ms. That is why a full universe refreshes about 44 times a second.' },
    { q: 'Which byte of a MIDI message can have its top bit set?', choices: ['Every byte', 'Only the status byte, the first', 'Only the last byte', 'None of them'], a: 1, why: 'The status byte (kind and channel) has its top bit set; the data bytes, note number and velocity, must be 0 to 127 with the top bit clear. That is how a receiver finds the start of a message.' },
    { q: 'An ESP wants to make the DMX break with its UART. What is the usual trick?', choices: ['Pull the TX pin high for 100 µs', 'Lower the baud rate, send a zero byte (a long low), then return to 250 kbit/s', 'Send 0xFF at 250 kbit/s', 'Use the second stop bit'], a: 1, why: 'A normal byte cannot be low for 92 µs at 250 kbit/s, but a zero byte at about 90 kbaud lasts 100 µs low, and its stop bits give the mark after break.' },
    { q: 'MIDI\'s current loop connects the grounds of the two devices.', a: false, why: 'The receiving side is an optocoupler, which passes the signal as light. The two devices share no ground, which avoids hum loops between powered equipment.' }
  ],
  applications: [
    'WLED and other lighting controllers that take DMX or Art-Net and drive LED strips.',
    'Stage and architectural lighting controllers built on an ESP, like the DFRobot DMX512 controller in the board catalogue.',
    'Pedals, keyboards, drum pads and control surfaces that send MIDI to a computer or a synthesiser.',
    'Bridges from Wi-Fi or Bluetooth LE to a DMX line or a MIDI synthesiser.'
  ],
  sources: [
    'ANSI E1.11, *USITT DMX512-A: Asynchronous Serial Digital Data Transmission Standard for Controlling Lighting Equipment and Accessories*.',
    'MIDI Manufacturers Association, *MIDI 1.0 Detailed Specification* and the MIDI Association\'s electrical specification update for 3.3 V.',
    'Arduino core for ESP32 documentation, *Serial* (HardwareSerial) API; MicroPython documentation, class *machine.UART*.'
  ],
  sim: 'fb-dmx-midi'
},

/* ================================================================ parallel-interfaces */
{
  id: 'parallel-interfaces',
  parent: 'fieldbuses-and-other-links',
  title: 'Parallel interfaces',
  level: 3,
  short: 'Eight or sixteen data wires and a strobe move a whole byte or word per clock: how LCD controllers, cameras, RGB panels and some memories talk to the faster ESP chips. It costs pins, and on the original ESP32 it borrows the I2S peripheral.',
  keywords: ['parallel', '8080', 'I80', 'LCD_CAM', 'RGB panel', 'DVP', 'camera', 'WR', 'DC', 'HSYNC', 'VSYNC', 'PCLK', 'pixel clock', 'bus width', '8-bit', '16-bit', 'parallel display', 'frame rate', 'ILI9341', 'OV2640'],
  prereq: ['display-interfaces', 'spi', 'peripherals-overview'],
  related: ['frame-rate-and-bus-speed', 'colour-tft-displays', 'camera-interfaces', 'touch-display-boards', 'sdio-and-sdmmc', 'i2s', 'using-psram'],
  body: `Serial buses send one bit per clock. A **parallel bus** sends a whole byte or word per clock on 8 or 16 data wires, plus a few control lines. The price is pins; the reward is speed, and speed matters when a lot of data must move: pixels to a screen, pixels from a camera.

### The kinds an ESP meets
- **The 8080-style display bus** ("I80", "8-bit parallel"): data lines D0 to D7 (or D15), a **write strobe WR**, a **data or command** line (DC, also called RS), chip select CS, and optionally RD and reset. The display controller reads the data lines on the rising edge of WR. Many TFT controllers, such as the ILI9341, offer a parallel mode as well as SPI.
- **The RGB panel interface**: the display has no memory of its own, so the ESP streams pixels continuously on a pixel clock, with HSYNC, VSYNC and data-enable lines and 16 colour wires: about 21 pins. The ESP32-S3 can drive it from PSRAM. An 800 × 480 frame in 16-bit colour is 768 kB, so 60 frames a second means 46 MB/s read from PSRAM, always.
- **The DVP camera interface**: 8 data lines, a pixel clock, VSYNC and HREF, a clock the ESP gives the sensor, and a small I2C-like bus to configure it (OV2640, OV5640).

### Which chips
From the chip catalogue: the original ESP32 makes an I80 bus and a DVP camera interface *through its I2S peripheral*; the ESP32-S2 adds parallel RGB; the ESP32-S3 has a dedicated LCD and camera controller with I80, 16-bit RGB and a DVP camera of 8 to 16 bits; the ESP32-P4 adds MIPI-DSI and MIPI-CSI to RGB, I80 and DVP; the S31 has RGB, I80 and DVP. The C-series and H-series offer SPI only.

### The arithmetic
**Clocks per pixel = bits per pixel ÷ bus width** (rounded up); **frame time = pixels × clocks per pixel ÷ write clock**. A 320 × 240 screen in 16-bit colour on an 8-bit bus at 20 MHz takes 76 800 × 2 ÷ 20 MHz = 7.7 ms, 130 frames a second; the same on SPI at 20 MHz takes 61 ms, 16 frames a second. That is what the simulation draws.

### The costs
- **Pins**: 8 to 16 data lines and 3 to 5 controls. Avoid the strapping and flash pins ([[strapping-pins]]).
- **Signal quality**: at 20 to 40 MHz keep the wires short and the grounds close; an RGB panel's ribbon is part of the design.
- Boards with the display built in (many ESP32-S3 touch displays) have all this wired and hide it behind a library ([[display-interfaces]]).

> [!key] A parallel bus moves 8 or 16 bits per clock under a write strobe, so it fills a screen several times faster than SPI at the same clock. It needs a dozen or more pins and a chip with the right controller: the ESP32-S3 and P4 have it built in.`,
  ideas: [
    'A parallel bus carries 8 or 16 bits per clock on data lines latched by a write strobe, so it is several times faster than SPI at the same clock.',
    'ESP chips meet it as an 8080-style display bus, an RGB panel interface and a DVP camera interface.',
    'The ESP32-S3 and P4 have dedicated controllers; the original ESP32 and S2 borrow the I2S peripheral; the C- and H-series have only SPI.',
    'Frame time = pixels × clocks per pixel ÷ write clock, and clocks per pixel = bits per pixel ÷ bus width.'
  ],
  pitfalls: [
    'Any ESP32 can drive a parallel display — Only chips with an LCD or camera controller (or, on the ESP32 and S2, the I2S trick) can; the C3 and C6 cannot.',
    'A wider bus doubles the frame rate on any display — Only if the colour data fills the bus: 16-bit colour on an 8-bit bus takes two clocks and on a 16-bit bus one, but 24-bit colour on a 16-bit bus still takes two.',
    'An RGB panel works like a display with a controller — It has no memory: the ESP must send every pixel, every frame, continuously, which keeps the PSRAM busy and the pins noisy.'
  ],
  terms: [
    { term: 'Parallel bus', also: ['8-bit bus', '16-bit bus', 'bus width'], def: 'A link that carries a whole byte or word per clock on several data wires, latched by a strobe. The width and the clock set the speed.' },
    { term: 'I80', also: ['8080 bus', 'Intel 8080 interface', 'WR strobe'], def: 'A parallel display bus in the style of the Intel 8080: data lines, a write strobe, a data/command line and a chip select.' },
    { term: 'RGB panel', also: ['parallel RGB', 'pixel clock', 'HSYNC', 'VSYNC'], def: 'A display interface with no frame memory in the display: the ESP streams every pixel on a pixel clock, with sync lines, about 60 times a second.' },
    { term: 'DVP', also: ['digital video port', 'camera interface'], def: 'The parallel camera interface of small image sensors: 8 data lines, a pixel clock, vertical and horizontal sync, and a clock for the sensor.' }
  ],
  choose: {
    good: ['Displays that must redraw quickly: colour screens above about 240 × 240 pixels', 'Cameras with a DVP interface on the S3 or P4', 'Boards where the display is already wired and a driver exists'],
    avoid: ['A chip without the controller (C3, C6): use SPI', 'Long ribbon cables at tens of megahertz', 'Spending strapping or flash pins on data lines'],
    check: ['That your chip has an LCD or camera controller, or the I2S route', 'How many pins the interface needs against how many are free', 'The display controller\'s write cycle time (its datasheet) before choosing the clock']
  },
  formulas: [
    {
      name: 'Frame rate of a parallel display bus',
      expr: 'r = f*w/(b*p)',
      tex: 'r = \\frac{f \\, w}{b \\, p}',
      vars: {
        r: { name: 'frames per second', q: 'frequency', unit: 'Hz' },
        f: { name: 'write clock', q: 'frequency', unit: 'MHz', value: 20 },
        w: { name: 'bus width (bits)', value: 8, min: 1, max: 32, int: true },
        b: { name: 'bits per pixel', value: 16, min: 1, max: 32, int: true },
        p: { name: 'pixels on the screen', value: 76800, min: 1, int: true }
      },
      solveFor: 'r',
      note: 'The upper limit when the whole screen is redrawn; it assumes b is a multiple of w (otherwise round the clocks per pixel up) and no time lost between writes. The same formula with w = 1 gives SPI.',
      stories: { r: 'A {w}-bit bus at {f} drives a screen of {p} pixels at {b} bits each. How many full redraws a second?' },
      practice: { unknowns: ['r', 'f'] }
    }
  ],
  examples: [
    {
      title: 'Is the bus fast enough for video?',
      q: 'A 480 × 320 screen in 16-bit colour is driven over a 16-bit I80 bus at 20 MHz. How many frames a second at best, and what would SPI at 20 MHz give?',
      steps: ['Pixels: $480 \\times 320 = 153\\,600$. A 16-bit bus carries one pixel per clock.', 'Parallel: $20\\,000\\,000 / 153\\,600 = 130$ frames a second.', 'SPI: one bit per clock, so $20\\,000\\,000 / (153\\,600 \\times 16) = 8.1$ frames a second.'],
      a: 'About 130 frames a second in parallel against 8 on SPI: SPI is fine for a gauge and too slow for video.'
    }
  ],
  quiz: [
    { q: 'A 16-bit-colour screen on an 8-bit bus needs how many clocks per pixel?', choices: ['1', '2', '8', '16'], a: 1, why: 'Sixteen bits over 8 wires take two clocks: first the high byte, then the low byte.' },
    { q: 'Which interface has no frame memory in the display, so the ESP must keep sending the picture?', choices: ['I80 (8080-style)', 'SPI', 'RGB panel', 'DVP camera'], a: 2, why: 'An RGB panel is refreshed continuously by the ESP on a pixel clock with sync signals. I80 and SPI displays keep their own copy and need data only when the picture changes.' },
    { q: 'You want a parallel colour display on an ESP32-C3. What is the position?', choices: ['Use the LCD_CAM peripheral', 'Impossible: the C3 has no parallel LCD controller; use SPI', 'Use the I2S trick of the ESP32', 'Use the MIPI-DSI port'], a: 1, why: 'The C3 offers SPI only. The ESP32-S3 has a dedicated LCD and camera controller; the original ESP32 and S2 use their I2S peripheral for parallel displays.' },
    { q: 'Doubling the bus width from 8 to 16 bits always doubles the frame rate.', a: false, why: 'It does when the pixel fills the bus: 16-bit colour goes from two clocks to one. 24-bit colour on a 16-bit bus still takes two clocks, so nothing is gained.' }
  ],
  applications: [
    'Colour TFT modules in 8080 mode on an ESP32-S3 for smooth animation.',
    'RGB touch panels of 4.3 to 7 inches on ESP32-S3 boards, driven from PSRAM.',
    'Camera boards with OV2640 or OV5640 sensors on a DVP interface.',
    'Fast data capture by reading a parallel ADC or logic analyser through the LCD_CAM peripheral.'
  ],
  sources: [
    'Espressif, *ESP32-S3 Technical Reference Manual*: the LCD_CAM controller (I80, RGB and camera modes).',
    'Espressif, *ESP-IDF Programming Guide*: LCD (I80 and RGB panel drivers) and the camera driver.',
    'Datasheet of the display controller or the image sensor in use (write cycle time, pixel clock, formats).'
  ],
  sim: 'fb-parallel'
},

/* ================================================================ isolation-and-long-cables */
{
  id: 'isolation-and-long-cables',
  parent: 'fieldbuses-and-other-links',
  title: 'Long cables, noise and isolation',
  level: 3,
  short: 'A long cable between two boards is an antenna for noise and a path for ground currents. Differential signalling, twisted pairs and shields, isolation and surge protection are the four defences, and each answers a different problem.',
  keywords: ['isolation', 'galvanic isolation', 'ground loop', 'ground offset', 'common-mode', 'optocoupler', 'digital isolator', 'isolated transceiver', 'isolated DC-DC', 'twisted pair', 'shield', 'TVS', 'surge', 'ESD', 'cable length', 'noise', 'EMC', 'creepage', 'USB isolator'],
  prereq: ['rs-485', 'can-bus-twai', 'three-volt-logic'],
  related: ['optocouplers', 'protection-parts', 'modbus', 'ethernet', 'usb-power', 'esd-and-bench-safety', 'switching-mains-safely'],
  body: `Two boards on one bench share a ground and a table. Two boards in different rooms, on different power outlets, one of them next to a motor, do not. A long cable between them meets four problems.

### The four problems
1. **Noise picked up.** Motors, relays, switching supplies and radio put small voltages on any wire, in proportion to its length.
2. **A difference between the grounds.** The two boards' grounds can differ by volts, even tens of volts, and a ground wire in the cable then carries a current: a *ground loop*. A single-ended signal measured against a ground that has moved is misread, and a pin pushed outside its range is damaged.
3. **Reflections and loss** on the line itself: termination and length limits ([[rs-485]]).
4. **Surges and faults**: ESD, lightning on an outdoor cable, a mains wire touching the data cable.

### The defences
- **Differential signalling** (RS-485, CAN, Ethernet, USB) cancels noise that reaches both wires equally. The receiver's **common-mode range** (−7 V to +12 V for RS-485) says how much ground offset it can swallow.
- **Twisted pairs** make both wires see the same noise and keep the loop small; a **shield** around them is connected to ground at one end (or at both through a small capacitor) so that it does not carry the ground-loop current.
- **Galvanic isolation** puts a barrier in the signal path so that no direct electrical path exists: an optocoupler, a digital isolator (a capacitive or magnetic one), or an *isolated transceiver* with the barrier built in, such as isolated RS-485 and CAN chips. The power across the gap comes from an *isolated DC-DC converter*. Every barrier is rated for a working voltage and a test voltage: read the datasheet.
- **Protection at the connector**: TVS diodes, series resistors and resettable fuses, close to where the cable enters, with a short, wide path to ground.

### What to expect
| Link | Typical practical limit |
|---|---|
| I2C, SPI on loose wires | tens of centimetres to about a metre |
| 3.3 V UART | a few metres at low baud rates |
| CAN | 40 m at 1 Mbit/s, 100 m at 500 kbit/s, 500 m at 125 kbit/s |
| RS-485 | 12 m at 10 Mbit/s, 120 m at 1 Mbit/s, 1200 m at 100 kbit/s |
| Ethernet (100BASE-TX) | 100 m of cable |
| USB 2.0 | 5 m per cable |

Isolate when a mains-powered machine meets a laptop (USB isolators exist), when RS-485 or CAN runs between buildings, or when the two grounds are not one net.

> [!warn] Isolation is a safety measure only if the parts and the board are built for it: parts rated for the working voltage and the right creepage distances on the board. A cheap optocoupler breakout is not a certified barrier. Where a data cable can touch mains-powered parts, leave the design to a qualified person.

> [!key] Long cables bring noise, ground differences, reflections and surges. Differential pairs cancel noise, shields and twisting reduce it, isolation removes the ground difference, and protection parts take the surges: choose by the problem you have.`,
  ideas: [
    'A long cable suffers four problems: picked-up noise, a difference between the grounds, reflections and loss, and surges.',
    'Differential signalling cancels noise common to both wires, and its common-mode range limits the ground offset it can tolerate.',
    'Galvanic isolation (optocoupler, digital isolator, isolated transceiver plus an isolated DC-DC converter) removes the direct electrical path between the two grounds.',
    'Shields are earthed at one end, protection parts sit at the connector, and every isolation barrier has a voltage rating to respect.'
  ],
  pitfalls: [
    'A shield grounded at both ends is always better — At low frequency it forms a loop with the ground path and carries the ground-loop current. Ground it at one end, or use a capacitor at the other.',
    'An isolated transceiver isolates the whole board — It isolates the signal path only. The power across the gap needs an isolated converter, and anything else wired across (a shared USB cable, a common ground wire) defeats it.',
    'Isolation protects against lightning — A barrier has a voltage rating; a direct strike far exceeds it. Outdoor lines need surge protection at both ends as well.'
  ],
  terms: [
    { term: 'Galvanic isolation', also: ['isolation barrier', 'isolator'], def: 'A signal path with no direct electrical connection between the two sides: the signal crosses as light, a magnetic field or an electric field.' },
    { term: 'Ground loop', also: ['ground offset', 'ground potential difference'], def: 'A current that flows through the ground wire of a cable because the two ends are at different ground voltages, and the voltage it causes along the wire.' },
    { term: 'Common-mode voltage', also: ['common-mode range'], def: 'The voltage that both wires of a pair share against ground. A differential receiver works only while it stays within its common-mode range.' },
    { term: 'Digital isolator', also: ['optocoupler', 'isolated transceiver'], def: 'A chip that passes logic signals across a barrier using capacitive, magnetic or optical coupling, so the two sides share no ground.' },
    { term: 'TVS diode', also: ['surge protection', 'transient suppressor'], def: 'A diode that clamps a short high-voltage spike on a line so that it does not reach the chip. It belongs next to the connector.' }
  ],
  choose: {
    good: ['Differential pairs for anything longer than a metre or two in a noisy place', 'Isolated transceivers where the two ends sit at different ground potentials', 'TVS diodes and series resistors at every connector that leaves the enclosure'],
    avoid: ['Single-ended signals over long cables: use a differential or a current loop', 'A shared ground wire that you meant to isolate', 'Treating a hobby optocoupler board as a safety barrier on mains'],
    check: ['The working and test voltage ratings of every isolation part', 'The common-mode range of the receivers against the ground offset you expect', 'Where the shield is connected, and where the protection parts sit']
  },
  quiz: [
    { q: 'Two boards on different mains outlets are joined by a single 3.3 V signal wire and a ground wire, and the data is garbled whenever a machine starts. What is the most likely cause?', choices: ['The baud rate is wrong', 'The grounds are at different voltages and noise couples into the signal', 'The wire is too thin', 'The ESP is too fast'], a: 1, why: 'A single-ended signal is measured against the receiver\'s ground. When the ground moves or noise lands on the wire, the signal slides through the thresholds. A differential pair, or isolation, cures this.' },
    { q: 'A differential receiver has a common-mode range of −7 V to +12 V. What does that tell you?', choices: ['The most noise it can reject', 'The ground offset between the two ends it can tolerate before it stops working', 'The cable length', 'The supply voltage'], a: 1, why: 'The voltage that both wires share against the receiver\'s ground must stay inside that window. A bigger ground offset needs isolation.' },
    { q: 'Where should the shield of a shielded twisted-pair cable be connected to ground?', choices: ['At neither end', 'At one end (or at one end and, through a capacitor, at the other)', 'At every node', 'To the signal wires'], a: 1, why: 'A shield grounded at both ends makes a loop with the ground path and carries ground-loop current. At one end it reduces the noise without that.' },
    { q: 'An isolated RS-485 transceiver needs no separate power for the bus side.', a: false, why: 'The barrier blocks power too. The bus side needs an isolated supply, from an isolated DC-DC converter or from the transceiver chip if it has one built in.' }
  ],
  applications: [
    'RS-485 or CAN between buildings or machines, with isolated transceivers at each end.',
    'Connecting a laptop to mains-powered equipment through a USB isolator for debugging.',
    'Sensors in a field or on a roof, on a long differential or 4–20 mA cable with surge protection.',
    'Industrial ESP gateways, whose boards carry isolated RS-485 and CAN, such as several in the board catalogue.'
  ],
  sources: [
    'TIA/EIA-485-A (common-mode range, receiver thresholds) and ISO 11898-2 (CAN physical layer).',
    'Texas Instruments, *The RS-485 Design Guide* (application report): grounding, isolation and protection.',
    'The datasheet of the isolator or isolated transceiver in use: working voltage, test voltage and creepage.'
  ],
  sim: { id: 'fb-differential', params: { mode: 'diff' } }
}

);
