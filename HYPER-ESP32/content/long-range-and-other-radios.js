/* HYPER-ESP32 · content/long-range-and-other-radios.js
 *
 * Topic "long-range-and-other-radios" (branch wireless): LoRa and its parameters, LoRaWAN, Meshtastic, 433 and 868 MHz
 * radios (CC1101, RFM69, OOK), the nRF24L01, cellular IoT, ultra-wideband ranging, infrared links, and choosing a
 * long-range link. Simulations: sims/long-range-and-other-radios.js (ids lr-*).
 */
Hyper.add(
/* ================================================================ LoRa */
{
  id: 'lora',
  parent: 'long-range-and-other-radios',
  title: 'LoRa',
  level: 1,
  short: 'LoRa is a radio modulation that trades speed for reach: a few dozen bytes at a few hundred to a few thousand bits a second, received kilometres away, even below the noise. No ESP chip has one built in, so it arrives as a small chip on the SPI bus.',
  keywords: ['LoRa', 'long range', 'chirp spread spectrum', 'CSS', 'SX1276', 'SX1262', 'SX1278', 'RFM95', 'sub-GHz', '868 MHz', '915 MHz', '433 MHz', 'RadioLib', 'point to point', 'sync word', 'Semtech'],
  prereq: ['radio-basics', 'spi', 'link-budget'],
  related: ['lora-parameters', 'lorawan', 'meshtastic', 'lora-boards', 'sub-ghz-radios', 'transmit-power-and-regulations', 'project-lora-field-sensor'],
  body: `A LoRa radio sends a few dozen bytes at a few hundred to a few thousand bits a second, and a receiver can still decode the packet when the signal is weaker than the noise around it. That is how a small board on a battery reaches a gateway several kilometres away: it is slow on purpose.

### The modulation, and what is built on it
**LoRa** is only the way bits become radio waves, a modulation invented by Cycleo and owned by Semtech. **LoRaWAN** is a different thing, a network protocol that runs on top ([[lorawan]]), and so is [[meshtastic|Meshtastic]]. Two boards, one transmitting and one listening, form the simplest long-range link there is, and the programs on this page do exactly that. Whatever you put on the radio, the sync word must match: 0x12 is the usual private value and 0x34 marks public LoRaWAN networks.

### Chirps
A LoRa symbol is a *chirp*, a tone that sweeps through the whole channel from bottom to top. Data is carried in *where in the sweep the chirp starts*. The receiver multiplies what it hears by a mirror-image chirp, and every symbol collapses into one steady tone whose pitch says which symbol it was. Noise does not collapse; a signal spread over the whole band, but known in shape, rises out of it as a sharp peak. The simulation draws it, and [[lora-parameters]] gives the numbers.

### What an ESP needs
No chip of the family has a sub-gigahertz radio, so LoRa is an extra chip on the SPI bus plus a few interrupt pins: Semtech's SX1276 family (and the SX1278 for 433 MHz), the newer SX1262 which draws less current while listening and transmits up to +22 dBm, or the multi-band LR1121. About fifty boards in [the board catalogue](#/tools/boards) carry one, with an antenna connector and the pins already wired ([[lora-boards]]). Wi-Fi and Bluetooth stay free for set-up, a display or an uplink.

### The bands
Europe uses 863 to 870 MHz, North America 902 to 928 MHz, and 433 MHz is licence-free in some regions; other regions have their own plans. A board and its antenna are built for one band. A 2.4 GHz LoRa chip, the SX1280, also exists: faster, shorter-ranged, and sharing the band with Wi-Fi.

> [!warn] Never transmit without the antenna fitted: a radio that cannot get its power out can be damaged. Use only the band, power and duty cycle your country allows ([[transmit-power-and-regulations]]), and put the right antenna on a 433, 868 or 915 MHz board.

> [!key] LoRa is a slow, robust modulation that reaches far on little power, and it is only the radio layer: the network on top is your choice. An ESP reaches it through an SX127x or SX126x chip on SPI, on a board made for one regional band.`,
  ideas: [
    'LoRa is a modulation, the radio layer only; LoRaWAN and Meshtastic are separate protocols that can run on it.',
    'A chirp sweeps the whole channel and carries data in where it starts, which lets a receiver decode a signal below the noise floor.',
    'No ESP chip has a sub-GHz radio: LoRa is a Semtech chip on SPI, and the chip and antenna are made for one regional band.',
    'Reach is bought with air time: the same packet takes tens of milliseconds to over a second depending on settings.'
  ],
  pitfalls: [
    'LoRa and LoRaWAN are the same thing — LoRa is the modulation. LoRaWAN is a network protocol using it, with gateways, keys and rules; two boards can use LoRa with no LoRaWAN at all.',
    'More transmit power is the way to more range — Doubling the distance in free space costs 6 dB, so a hundred times the power buys only ten times the distance, and the law caps the power anyway. The sensitivity of the receiver and a good antenna matter as much.',
    'LoRa is a long-range Wi-Fi — It is at least a thousand times slower, sends tens of bytes, and the radio can only take turns: it suits a temperature reading every few minutes, not a photograph.'
  ],
  terms: [
    { term: 'LoRa modulation', also: ['LoRa', 'Long Range'], def: 'A radio modulation from Semtech that spreads each symbol as a chirp across the channel. It gives long range at low data rates and low power, in sub-GHz and 2.4 GHz bands.' },
    { term: 'Chirp', also: ['chirp spread spectrum', 'CSS'], def: 'A tone whose frequency sweeps steadily across the channel. LoRa sends data by choosing where in the sweep each chirp starts.' },
    { term: 'Sub-GHz band', also: ['sub-gigahertz', '433 MHz', '868 MHz', '915 MHz'], def: 'Any licence-free radio band below 1 GHz, such as 433, 868 and 915 MHz. Waves there travel farther and through more obstacles than 2.4 GHz ones, and need longer antennas; the exact edges, power and duty-cycle limits depend on the country.' },
    { term: 'Sync word', also: ['network ID'], def: 'A byte at the start of every LoRa packet that a receiver checks. A radio ignores packets with another sync word, which separates private links (usually 0x12) from public LoRaWAN traffic (0x34).' }
  ],
  sim: 'lr-chirp',
  choose: {
    good: ['Small readings (a few bytes to a few dozen) sent every few minutes over kilometres', 'Battery or solar nodes that sleep almost all the time', 'A private point-to-point link with no gateway, SIM card or subscription'],
    avoid: ['Streaming audio, images or firmware updates', 'Anything that needs an answer within a fraction of a second', 'Sending often on a slow setting: the duty-cycle rules stop you'],
    check: ['That the radio chip and antenna match your region\'s band', 'The legal power and duty cycle for that band', 'That both ends use the same sync word and settings']
  },
  code: [
    {
      title: 'Send a packet every ten seconds',
      about: 'A transmitter on a LilyGO LoRa32 V1.6.1 (SX1276, 868 MHz version): it sends a counter as text. The settings are frequency, bandwidth, spreading factor, coding rate, sync word and power.',
      needs: 'A LilyGO LoRa32 V1.6.1 or T-Beam v1.2 with its antenna fitted. Arduino: the RadioLib library. MicroPython: the add-on `lora` driver from micropython-lib (the packages `lora-sx127x` and `lora-sync`, installed with mip); it is not part of the firmware.',
      wiring: [['GPIO5', 'LoRa SCK', 'fixed on the board'], ['GPIO19', 'LoRa MISO', 'fixed on the board'], ['GPIO27', 'LoRa MOSI', 'fixed on the board'], ['GPIO18', 'LoRa CS (NSS)', 'fixed on the board'], ['GPIO23', 'LoRa RESET', 'fixed on the board'], ['GPIO26', 'LoRa DIO0 (interrupt)', 'fixed on the board'], ['GPIO33', 'LoRa DIO1', 'fixed on the board']],
      libs: ['RadioLib'],
      blocks: `
        when started
          start serial at (115200) baud
          start LoRa radio at (868) MHz bandwidth (125) kHz spreading factor (9) power (10) dBm :: radio
          set [count v] to (0)
        forever
          send LoRa packet (join [hello ] (count)) :: radio
          print (join [sent hello ] (count))
          change [count v] by (1)
          wait (10) seconds
        end
      `,
      cpp: String.raw`
        #include <RadioLib.h>

        // LilyGO LoRa32 V1.6.1: the radio's pins are fixed on the board
        const int PIN_SCK = 5, PIN_MISO = 19, PIN_MOSI = 27, PIN_CS = 18;
        const int PIN_RST = 23, PIN_DIO0 = 26, PIN_DIO1 = 33;

        SX1276 radio = new Module(PIN_CS, PIN_DIO0, PIN_RST, PIN_DIO1);
        int counter = 0;

        void setup() {
          Serial.begin(115200);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
          // MHz, kHz bandwidth, spreading factor, coding rate 4/5, sync word, dBm
          int state = radio.begin(868.0, 125.0, 9, 5, 0x12, 10);
          if (state != RADIOLIB_ERR_NONE) {
            Serial.printf("radio failed, code %d\n", state);
            while (true) delay(1000);
          }
        }

        void loop() {
          String msg = "hello " + String(counter++);
          int state = radio.transmit(msg);               // blocks until the packet has left
          Serial.printf("sent \"%s\": %s\n", msg.c_str(), state == RADIOLIB_ERR_NONE ? "ok" : "error");
          delay(10000);
        }
      `,
      py: String.raw`
        import time
        from machine import Pin, SPI
        from lora import SX1276                  # add-on driver: not in the firmware

        # LilyGO LoRa32 V1.6.1: the radio's pins are fixed on the board
        spi = SPI(1, baudrate=2_000_000, sck=Pin(5), mosi=Pin(27), miso=Pin(19))
        modem = SX1276(spi=spi, cs=Pin(18), dio0=Pin(26), dio1=Pin(33), reset=Pin(23),
                       lora_cfg={'freq_khz': 868000, 'sf': 9, 'bw': '125', 'coding_rate': 5,
                                 'preamble_len': 8, 'output_power': 10})
        counter = 0

        while True:
            msg = "hello %d" % counter
            counter += 1
            modem.send(msg.encode())             # blocks until the packet has left
            print('sent "%s": ok' % msg)
            time.sleep(10)
      `,
      output: `
        sent "hello 0": ok
        sent "hello 1": ok
        sent "hello 2": ok
      `,
      notes: ['Change 868.0 to 915.0 (and the antenna) for North America, or 433.0 for an SX1278 board; the board must be made for that band.', 'The sync word 0x12 keeps this link private; a LoRaWAN gateway uses 0x34 and will ignore it.', 'The MicroPython driver is a separate add-on and its option names follow micropython-lib: check them against the version you install.']
    },
    {
      title: 'Receive packets and print the signal',
      about: 'The listening board: it waits for a packet and prints the text with its signal strength (RSSI, in dBm) and signal-to-noise ratio (SNR, in dB). Settings must match the transmitter exactly.',
      needs: 'A second LilyGO LoRa32 V1.6.1 (or any board with the same radio), antenna fitted, running next to the first one.',
      libs: ['RadioLib'],
      blocks: `
        when started
          start serial at (115200) baud
          start LoRa radio at (868) MHz bandwidth (125) kHz spreading factor (9) power (10) dBm :: radio

        when LoRa packet received :: radio
          print (LoRa packet text)
          print (join [RSSI dBm: ] (LoRa RSSI))
          print (join [SNR dB: ] (LoRa SNR))
      `,
      cpp: String.raw`
        #include <RadioLib.h>

        const int PIN_SCK = 5, PIN_MISO = 19, PIN_MOSI = 27, PIN_CS = 18;
        const int PIN_RST = 23, PIN_DIO0 = 26, PIN_DIO1 = 33;

        SX1276 radio = new Module(PIN_CS, PIN_DIO0, PIN_RST, PIN_DIO1);

        void setup() {
          Serial.begin(115200);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
          int state = radio.begin(868.0, 125.0, 9, 5, 0x12, 10);   // the same settings as the sender
          if (state != RADIOLIB_ERR_NONE) {
            Serial.printf("radio failed, code %d\n", state);
            while (true) delay(1000);
          }
        }

        void loop() {
          String msg;
          int state = radio.receive(msg);                // waits for a packet or a timeout
          if (state == RADIOLIB_ERR_NONE) {
            Serial.println(msg);
            Serial.printf("RSSI dBm: %.0f\n", radio.getRSSI());
            Serial.printf("SNR dB: %.1f\n", radio.getSNR());
          } else if (state != RADIOLIB_ERR_RX_TIMEOUT) {
            Serial.printf("receive error %d\n", state);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        from lora import SX1276                  # add-on driver: not in the firmware

        spi = SPI(1, baudrate=2_000_000, sck=Pin(5), mosi=Pin(27), miso=Pin(19))
        modem = SX1276(spi=spi, cs=Pin(18), dio0=Pin(26), dio1=Pin(33), reset=Pin(23),
                       lora_cfg={'freq_khz': 868000, 'sf': 9, 'bw': '125', 'coding_rate': 5,
                                 'preamble_len': 8, 'output_power': 10})   # the same as the sender

        while True:
            rx = modem.recv(timeout_ms=10000)    # waits for a packet or the timeout
            if rx:
                print(bytes(rx).decode())
                print("RSSI dBm:", rx.rssi)
                print("SNR dB:", rx.snr)
      `,
      output: `
        hello 3
        RSSI dBm: -62
        SNR dB: 9.5
      `,
      notes: ['RSSI is the power of the packet at the antenna; SNR is how far it stands above the noise. LoRa works down to an SNR of about -7.5 dB at SF7 and -20 dB at SF12 ([[lora-parameters]]).', 'No packets? The usual causes, in order: the settings differ (frequency, spreading factor, bandwidth, sync word), no antenna, or the wrong pins for the board revision.']
    }
  ],
  quiz: [
    { q: 'A friend says "LoRa and LoRaWAN are the same thing". What is the correction?', choices: ['LoRaWAN is the radio modulation and LoRa the network', 'LoRa is the radio modulation; LoRaWAN is a network protocol built on it', 'LoRa is for 433 MHz and LoRaWAN for 868 MHz', 'They are two names for the same standard'], a: 1, why: 'LoRa describes how bits are put on the air. LoRaWAN adds gateways, addressing, keys and rules on top of it. Meshtastic and your own protocol are other things that can use the same radio.' },
    { q: 'A LoRa receiver can decode a packet whose signal is weaker than the surrounding noise.', a: true, why: 'The chirp is known in shape and spread across the whole channel, so the receiver gains from correlating with it. At SF12 the signal may be 20 dB below the noise and still decode; that is the "processing gain".' },
    { q: 'You buy an ESP32-S3 DevKit and a bare SX1262 module. Which is the best description of what you must do?', choices: ['Nothing: the S3 has a LoRa radio inside', 'Wire the module to the SPI pins, its interrupt and busy pins, add a matching antenna and a library', 'Install a LoRa firmware; no wiring is needed', 'Use the S3\'s Wi-Fi radio on 868 MHz'], a: 1, why: 'No ESP chip has a sub-GHz radio. The SX1262 talks over SPI and needs its chip-select, reset, DIO1 and BUSY lines, a supply that can deliver the transmit current, and an antenna for the right band.' },
    { q: 'Two boards use the same frequency, spreading factor and bandwidth, but one has sync word 0x12 and the other 0x34. What do you see?', choices: ['Packets arrive with a warning', 'Packets arrive but garbled', 'Nothing arrives, and no error is reported', 'The boards negotiate a common word'], a: 2, why: 'A receiver drops packets whose sync word differs, silently. It is one of the commonest reasons a LoRa link "does nothing" while every setting looks right.' }
  ],
  applications: [
    'Soil-moisture or water-level nodes in a field, reporting every few minutes to a gateway on a farm building.',
    'Asset and animal trackers, with a GNSS receiver and a coin of battery, reporting position every few minutes.',
    'A private link between a house and an outbuilding or a gate a kilometre away, with no SIM card or subscription.',
    'Off-grid text messaging between hikers or a rescue team, as in [[meshtastic|Meshtastic]].'
  ],
  sources: [
    'Semtech: LoRa Modulation Basics (application note AN1200.22) and the SX1276 and SX1262 data sheets.',
    'The RadioLib documentation: the begin() and transmit() calls and the error codes.',
    'ETSI EN 300 220 (short-range devices below 1 GHz) and your national regulator\'s rules for the band you use.'
  ]
},

/* ================================================================ LoRa parameters */
{
  id: 'lora-parameters',
  parent: 'long-range-and-other-radios',
  title: 'Spreading factor, bandwidth, air time',
  level: 2,
  short: 'Three settings decide what a LoRa link is: spreading factor, bandwidth and coding rate. They set how weak a signal survives, how long a packet is on the air, and so how often the law and the battery let you send it.',
  keywords: ['spreading factor', 'SF7', 'SF12', 'bandwidth', '125 kHz', 'coding rate', 'time on air', 'air time', 'duty cycle', 'sensitivity', 'data rate', 'low data rate optimisation', 'preamble', 'symbol time', 'ADR', 'noise floor'],
  prereq: ['lora', 'decibels-and-dbm', 'link-budget'],
  related: ['lorawan', 'meshtastic', 'transmit-power-and-regulations', 'battery-life-budget', 'choosing-a-long-range-link'],
  body: `Three settings decide what a LoRa link is: the **spreading factor** (SF, 7 to 12), the **bandwidth** (BW, usually 125, 250 or 500 kHz) and the **coding rate** (CR, 4/5 to 4/8). Together they set how long a packet is on the air, how weak a signal it survives, and therefore how often you may send.

### The cost of reach
One chirp lasts $T_{\\mathrm{sym}} = 2^{SF} / BW$ and carries SF bits. Raising the SF by one doubles the chirp time, halves the bit rate and buys about 2.5 dB of sensitivity. Doubling the bandwidth doubles the rate and costs 3 dB, because the receiver lets in twice the noise. A higher coding rate adds error-correcting bits: 4/5 is the lightest and 4/8 the sturdiest, and 4/8 cuts the rate by more than a third.

| SF | 20 bytes on air | Bit rate | Sensitivity | Packets an hour at 1 % |
|---|---|---|---|---|
| 7 | 57 ms | 5.5 kbit/s | -124.5 dBm | 636 |
| 8 | 103 ms | 3.1 kbit/s | -127 dBm | 349 |
| 9 | 185 ms | 1.8 kbit/s | -129.5 dBm | 194 |
| 10 | 371 ms | 0.98 kbit/s | -132 dBm | 97 |
| 11 | 741 ms | 0.54 kbit/s | -134.5 dBm | 48 |
| 12 | 1.32 s | 0.29 kbit/s | -137 dBm | 27 |

At 125 kHz, coding rate 4/5, an 8-symbol preamble, header and CRC on, and a receiver noise figure of 6 dB. A chirp longer than 16 ms (SF11 and SF12 at 125 kHz) switches on *low data rate optimisation*, which costs a little more air time.

### Air time is the budget
The packet time follows a formula Semtech published: the preamble, plus a header and the payload counted in symbols. Rather than memorise it, run it, as the first program does. Air time matters three ways. The **battery**: the transmitter draws tens of milliamps for the whole time. The **channel**: other nodes cannot use it. And the **law**: in the European 868 MHz band the usual limit is 1 % of the time on the air (0.1 % or 10 % in some sub-bands), so a 20-byte packet at SF12 means at least 130 s of silence afterwards.

### Choosing the settings
Use the lowest SF that reliably reaches the gateway; LoRaWAN's adaptive data rate does this for you ([[lorawan]]). Both ends must agree on frequency, SF, BW, CR, sync word and preamble length: one mismatch and nothing arrives, with no error. Prefer a narrower bandwidth for range and a wider one for speed and for tolerating cheap crystals.

> [!key] Each step of spreading factor doubles the air time for about 2.5 dB of extra sensitivity, so range is bought with time. Air time, not bit rate, is the quantity to budget: it sets the battery drain, the shared channel and the legal send interval.`,
  ideas: [
    'Each step of spreading factor doubles the air time and the symbol time, and gains about 2.5 dB of sensitivity.',
    'Doubling the bandwidth doubles the data rate and costs 3 dB of sensitivity.',
    'Air time, not bit rate, is the quantity to budget for battery, channel and law.',
    'Both ends must match in every setting: a mismatch shows as silence, not as an error.'
  ],
  pitfalls: [
    'The highest spreading factor is always the safest choice — SF12 sends about twenty times slower than SF7, so it drains the battery faster, fills the channel and exhausts the duty cycle. Use the lowest SF that reaches the gateway with a margin of several dB.',
    'The data rate on the label is what my sensor will see — The nominal rate ignores the preamble, header, CRC and error-correcting bits. A 20-byte packet at SF9 takes 185 ms, which is 860 bit/s of real payload, not 1.8 kbit/s.',
    'Wider bandwidth means more range — The reverse: each doubling of bandwidth costs 3 dB of sensitivity. It buys speed, not reach.'
  ],
  terms: [
    { term: 'Spreading factor', also: ['SF', 'SF7', 'SF12'], def: 'The number of bits carried in one LoRa chirp, from 7 to 12. A chirp has $2^{SF}$ possible starting points, lasts $2^{SF}/BW$ seconds, and a higher SF gives a longer, more robust, slower symbol.' },
    { term: 'Bandwidth', also: ['BW', 'channel bandwidth'], def: 'The width of the frequency band a LoRa chirp sweeps across: 125, 250 or 500 kHz in LoRaWAN, and from 7.8 kHz up in the chips themselves. Wider is faster and less sensitive.' },
    { term: 'Coding rate', also: ['CR', 'forward error correction'], def: 'The fraction of transmitted bits that carry data, with the rest used to correct errors: 4/5, 4/6, 4/7 or 4/8. A lower fraction survives more interference and takes longer.' },
    { term: 'Air time', also: ['time on air', 'ToA'], def: 'How long one packet occupies the channel, from the first preamble chirp to the last payload symbol. It follows from SF, BW, CR, payload length and preamble.' },
    { term: 'Low data rate optimisation', also: ['LDRO', 'DE'], def: 'A mode that is switched on when one chirp lasts longer than 16 ms. It lets the receiver tolerate the drift of cheap crystals during a long symbol, at the price of a little more air time.' },
    { term: 'Preamble', def: 'The run of identical chirps at the start of every packet, 8 symbols in LoRaWAN, which lets a receiver wake, detect and lock on before the data begins.' }
  ],
  sim: ['lr-airtime', 'lr-duty'],
  formulas: [
    {
      name: 'Bit rate from spreading factor, bandwidth and coding rate',
      expr: 'Rb = SF*(BW/2^SF)*4/(4+CR)',
      tex: 'R_b = \\mathrm{SF} \\cdot \\frac{\\mathrm{BW}}{2^{\\mathrm{SF}}} \\cdot \\frac{4}{4 + \\mathrm{CR}}',
      vars: {
        Rb: { name: 'raw bit rate', q: 'datarate', unit: 'bit/s', tex: 'R_b' },
        SF: { name: 'spreading factor', q: 'count', int: true, value: 9, min: 7, max: 12, tex: '\\mathrm{SF}' },
        BW: { name: 'bandwidth', q: 'frequency', unit: 'kHz', value: 125, min: 7.8, max: 500, tex: '\\mathrm{BW}' },
        CR: { name: 'coding rate index (1 = 4/5 … 4 = 4/8)', q: 'count', int: true, value: 1, min: 1, max: 4, tex: '\\mathrm{CR}' }
      },
      solveFor: 'Rb',
      note: 'The rate before preamble, header, CRC and gaps, so the real payload rate is lower, most of all for short packets.',
      stories: { Rb: 'A node uses spreading factor {SF} on a {BW} channel with coding rate index {CR}. What is its raw bit rate?' }
    },
    {
      name: 'Receiver sensitivity',
      expr: 'S = -174 + 10*log(BW) + NF + SNR',
      tex: 'S = -174 + 10\\log_{10}(\\mathrm{BW}) + \\mathrm{NF} + \\mathrm{SNR}',
      vars: {
        S: { name: 'sensitivity', unit: 'dBm', signed: true, tex: 'S' },
        BW: { name: 'bandwidth', q: 'frequency', unit: 'kHz', value: 125, min: 7.8, max: 500, tex: '\\mathrm{BW}' },
        NF: { name: 'receiver noise figure', q: 'gain', unit: 'dB', value: 6, min: 0, max: 15, tex: '\\mathrm{NF}' },
        SNR: { name: 'signal-to-noise ratio the demodulator needs (SF7: -7.5, SF12: -20)', q: 'gain', unit: 'dB', value: -7.5, min: -20, max: 0, signed: true, tex: '\\mathrm{SNR}' }
      },
      solveFor: 'S',
      note: 'The first term is thermal noise in 1 Hz at room temperature, in dBm. Bandwidth is entered in kHz and converted to hertz inside the sum.',
      stories: { S: 'A receiver with a noise figure of {NF} listens on {BW} and its demodulator needs an SNR of {SNR}. What is the weakest signal it can decode?' }
    },
    {
      name: 'Packets per hour allowed by a duty cycle',
      expr: 'N = 3600*d/ta',
      tex: 'N = \\frac{3600\\, d}{t_a}',
      vars: {
        N: { name: 'packets per hour', q: 'count' },
        d: { name: 'duty cycle allowed', q: 'ratio', unit: '%', value: 1, min: 0.01, max: 100 },
        ta: { name: 'air time of one packet', q: 'time', unit: 'ms', value: 185, tex: 't_a' }
      },
      solveFor: 'N',
      note: 'Take the packets down to whole numbers in practice. A device must also leave its silent period after each packet, so the first packet is free but the rest follow the limit.',
      stories: { N: 'A packet takes {ta} on the air and the band allows a duty cycle of {d}. How many packets may the node send in an hour?' }
    }
  ],
  examples: [
    {
      title: 'How often can the soil sensor report?',
      q: 'A sensor sends a 20-byte packet at SF9, 125 kHz, coding rate 4/5, in the 868 MHz band with a 1 % duty-cycle limit. What is the shortest interval between packets, and does reporting every 15 minutes respect it?',
      steps: ['The air time of 20 bytes at SF9 is 185 ms (table above).', 'At 1 % the transmitter must stay silent for 99 times the air time: $0.185 \\times 99 \\approx 18.3$ s, so one packet every 18.5 s at the fastest.', 'Every 15 minutes uses $0.185 / 900 \\approx 0.02$ % of the time, fifty times below the limit.'],
      a: 'About one packet per 18.5 s at the very most, and a 15-minute interval is comfortably legal. At SF12 the same limit would force 130 s between packets.'
    }
  ],
  choose: {
    good: ['SF7 to SF9 for nodes within a few kilometres of the gateway, in the open or a town', 'SF10 to SF12 only for the nodes that cannot get through otherwise', '125 kHz bandwidth for the best sensitivity; 250 or 500 kHz for speed on short links'],
    avoid: ['SF12 on every node "to be safe"', 'Settings copied from an example without checking the band and the sync word', 'Sending the same large packet at the slowest setting every minute'],
    check: ['The legal duty cycle or dwell time of your band', 'The signal-to-noise ratio reported on received packets: a margin of at least 5 to 10 dB', 'The air time of your real payload, with its headers']
  },
  code: [
    {
      title: 'An air-time and duty-cycle planner',
      about: 'Works out the air time of a 20-byte packet for every spreading factor with Semtech\'s formula, and how many packets an hour a 1 % duty cycle allows. No radio is needed: it runs on any ESP board and prints a table.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define air time (sf) (bw) (cr) (bytes) :: my
          set [tsym v] to (((2) ^ (sf)) / (bw))
          set [de v] to (0)
          if <(tsym) > (0.016)> then
            set [de v] to (1)
          end
          set [nsym v] to ((8) + ((round up (((8 * (bytes)) - (4 * (sf)) + (44)) / (4 * ((sf) - (2 * (de)))))) * ((cr) + (4))))
          set [ms v] to ((((8) + (4.25)) + (nsym)) * (tsym) * (1000))

        when started
          start serial at (115200) baud
          for each [sf v] in (list (7) (8) (9) (10) (11) (12))
            air time (sf) (125000) (1) (20) :: my
            print (join (join [SF ] (sf)) (join [  ms: ] (ms)))
          end
      `,
      cpp: String.raw`
        // Time on air of a LoRa packet (Semtech's formula): explicit header, CRC on
        double airtimeMs(int sf, double bwHz, int cr /* 1..4 = 4/5..4/8 */, int payloadBytes) {
          double tSym = pow(2, sf) / bwHz;                  // seconds per chirp
          int de = (tSym > 0.016) ? 1 : 0;                  // low data rate optimisation
          double nPayload = 8 + fmax(ceil((8.0 * payloadBytes - 4 * sf + 28 + 16) / (4.0 * (sf - 2 * de))) * (cr + 4), 0.0);
          return (8 + 4.25 + nPayload) * tSym * 1000;          // 8 preamble symbols
        }

        void setup() {
          Serial.begin(115200);
          Serial.println("SF  air time  packets/hour at 1 %");
          for (int sf = 7; sf <= 12; sf++) {
            double ms = airtimeMs(sf, 125000, 1, 20);
            Serial.printf("%2d  %7.1f ms  %4d\n", sf, ms, (int)(3600.0 * 0.01 / (ms / 1000)));
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import math

        # Time on air of a LoRa packet (Semtech's formula): explicit header, CRC on
        def airtime_ms(sf, bw_hz, cr, payload):    # cr 1..4 = 4/5..4/8
            t_sym = 2 ** sf / bw_hz                            # seconds per chirp
            de = 1 if t_sym > 0.016 else 0                     # low data rate optimisation
            n_payload = 8 + max(math.ceil((8 * payload - 4 * sf + 28 + 16) / (4 * (sf - 2 * de))) * (cr + 4), 0)
            return (8 + 4.25 + n_payload) * t_sym * 1000       # 8 preamble symbols

        print("SF  air time  packets/hour at 1 %")
        for sf in range(7, 13):
            ms = airtime_ms(sf, 125000, 1, 20)
            print("%2d  %7.1f ms  %4d" % (sf, ms, int(3600 * 0.01 / (ms / 1000))))
      `,
      output: `
        SF  air time  packets/hour at 1 %
         7     56.6 ms   636
         8    102.9 ms   349
         9    185.3 ms   194
        10    370.7 ms    97
        11    741.4 ms    48
        12   1318.9 ms    27
      `,
      notes: ['The formula counts the payload as the bytes the radio sends. In LoRaWAN that includes 13 bytes of headers and the message integrity code ([[lorawan]]).', 'The planner assumes the usual 8-symbol preamble; other protocols use longer ones, which adds time.']
    },
    {
      title: 'A sender that keeps to a duty cycle',
      about: 'Sends a reading, measures how long the transmission took, and then stays silent for 99 times as long, so the radio never exceeds 1 % of the time on the air.',
      needs: 'The LilyGO LoRa32 V1.6.1 of the previous page, antenna fitted. Arduino: RadioLib. MicroPython: the add-on `lora` driver.',
      libs: ['RadioLib'],
      blocks: `
        when started
          start serial at (115200) baud
          start LoRa radio at (868) MHz bandwidth (125) kHz spreading factor (9) power (10) dBm :: radio
          set [count v] to (0)
          set [next v] to (0)
        forever
          if <(milliseconds since start) ≥ (next)> then
            set [t0 v] to (milliseconds since start)
            send LoRa packet (join [reading ] (count)) :: radio
            set [onair v] to ((milliseconds since start) - (t0))
            set [next v] to ((milliseconds since start) + ((onair) * (99)))
            change [count v] by (1)
            print (join [silent for ms: ] ((onair) * (99)))
          end
        end
      `,
      cpp: String.raw`
        #include <RadioLib.h>

        SX1276 radio = new Module(18, 26, 23, 33);          // CS, DIO0, RESET, DIO1: LilyGO LoRa32 V1.6.1
        const float DUTY = 0.01;                            // 1 %: the common limit in the EU 868 MHz band
        uint32_t nextAllowed = 0;                           // the millis() value before which we stay silent
        int counter = 0;

        void setup() {
          Serial.begin(115200);
          SPI.begin(5, 19, 27, 18);                         // SCK, MISO, MOSI, CS
          radio.begin(868.0, 125.0, 9, 5, 0x12, 10);
        }

        void loop() {
          if ((int32_t)(millis() - nextAllowed) < 0) return;   // still silent (safe across the millis() wrap)
          String msg = "reading " + String(counter++);
          uint32_t t0 = millis();
          radio.transmit(msg);                              // blocks until the packet has left
          uint32_t onAir = millis() - t0;                   // measured air time, slightly generous
          uint32_t silent = (uint32_t)(onAir * (1.0 / DUTY - 1.0));
          nextAllowed = millis() + silent;
          Serial.printf("sent in %lu ms, silent for %lu ms\n", (unsigned long)onAir, (unsigned long)silent);
        }
      `,
      py: String.raw`
        import time
        from machine import Pin, SPI
        from lora import SX1276                             # add-on driver: not in the firmware

        DUTY = 0.01                                         # 1 %: the common limit in the EU 868 MHz band
        spi = SPI(1, baudrate=2_000_000, sck=Pin(5), mosi=Pin(27), miso=Pin(19))
        modem = SX1276(spi=spi, cs=Pin(18), dio0=Pin(26), dio1=Pin(33), reset=Pin(23),
                       lora_cfg={'freq_khz': 868000, 'sf': 9, 'bw': '125', 'coding_rate': 5,
                                 'preamble_len': 8, 'output_power': 10})
        next_allowed = time.ticks_ms()                      # the tick value before which we stay silent
        counter = 0

        while True:
            if time.ticks_diff(time.ticks_ms(), next_allowed) >= 0:
                t0 = time.ticks_ms()
                modem.send(b"reading %d" % counter)         # blocks until the packet has left
                on_air = time.ticks_diff(time.ticks_ms(), t0)
                silent = int(on_air * (1 / DUTY - 1))
                next_allowed = time.ticks_add(time.ticks_ms(), silent)
                print("sent in", on_air, "ms, silent for", silent, "ms")
                counter += 1
            time.sleep_ms(100)
      `,
      output: `
        sent in 188 ms, silent for 18612 ms
        sent in 187 ms, silent for 18513 ms
      `,
      notes: ['The timing includes a few milliseconds of set-up, so the silence is a little longer than the minimum: that is the safe direction.', 'The legal limit may be a duty cycle, a dwell time or a listen-before-talk rule depending on country and band. This only shows how to enforce a duty cycle ([[transmit-power-and-regulations]]).']
    }
  ],
  quiz: [
    { q: 'A node moves from SF9 to SF10 with everything else unchanged. What happens to the air time of a packet and to the sensitivity?', choices: ['The air time halves and sensitivity improves by 2.5 dB', 'The air time roughly doubles and sensitivity improves by about 2.5 dB', 'The air time stays the same and sensitivity improves by 6 dB', 'The air time doubles and sensitivity is unchanged'], a: 1, why: 'Each SF step doubles the chirp time (so roughly the air time) and lowers the SNR the demodulator needs by about 2.5 dB: range is bought with time.' },
    { q: 'Which change improves the sensitivity of a LoRa receiver?', choices: ['Doubling the bandwidth from 125 to 250 kHz', 'Halving the bandwidth from 125 to 62.5 kHz', 'Raising the transmit power of the receiver', 'Changing the coding rate from 4/8 to 4/5'], a: 1, why: 'Noise grows with bandwidth, so halving it lets in half the noise: 3 dB better. Doubling it costs 3 dB. Transmit power belongs to the other end, and the coding rate does not change sensitivity.' },
    { q: 'A 20-byte packet takes 1.32 s at SF12 and 125 kHz. In a band limited to 1 % duty cycle, about how long must the node stay silent after it?', choices: ['About 13 s', 'About 130 s', 'About 13 minutes', 'There is no limit on a single packet'], a: 1, why: 'At 1 % the silent time is 99 times the air time: $1.32 \\times 99 \\approx 130$ s. That is why SF12 nodes cannot report often.' },
    { q: 'Two boards run SF9 and SF9, 125 kHz, but one is set to coding rate 4/5 and the other to 4/8. Will they communicate?', choices: ['Yes, the receiver detects the coding rate from the preamble', 'Yes, but with more errors', 'Normally yes in explicit-header mode, because the header carries the coding rate; with an implicit header they do not', 'No, never'], a: 2, why: 'In explicit-header mode the packet header states the coding rate, so a receiver can follow it. With an implicit header both ends must be configured identically. Frequency, SF and bandwidth must always match.' }
  ],
  applications: [
    'Planning how many readings a sensor network may send per hour before the duty-cycle limit bites.',
    'Choosing the spreading factor of a gateway-less link between two buildings from the signal-to-noise ratio measured in a test.',
    'Estimating battery life: the number of packets a day times the energy of one air time, as in [[battery-life-budget]].',
    'Reading the data-rate setting of a LoRaWAN device, which is a spreading factor and bandwidth under another name.'
  ],
  sources: [
    'Semtech: SX1272/3/6/7/8 LoRa Modem Designer\'s Guide (application note AN1200.13), for the time-on-air formula.',
    'Semtech: LoRa Modulation Basics (application note AN1200.22).',
    'LoRa Alliance: LoRaWAN Regional Parameters, for the data rates and payload limits of each region.'
  ]
},

/* ================================================================ LoRaWAN */
{
  id: 'lorawan',
  parent: 'long-range-and-other-radios',
  title: 'LoRaWAN',
  level: 2,
  short: 'LoRaWAN turns LoRa radios into a network: devices talk to any gateway in range, gateways pass packets to a network server, and a strict rhythm of two short receive windows keeps the battery nearly untouched.',
  keywords: ['LoRaWAN', 'gateway', 'network server', 'OTAA', 'ABP', 'class A', 'class B', 'class C', 'DevEUI', 'AppKey', 'The Things Network', 'TTN', 'ChirpStack', 'ADR', 'fair use', 'uplink', 'downlink', 'LoRa Alliance', 'frame counter', 'payload'],
  prereq: ['lora', 'lora-parameters', 'iot-architecture'],
  related: ['meshtastic', 'lora-boards', 'device-identity-and-provisioning', 'bits-and-bytes', 'data-formats', 'project-lora-field-sensor', 'choosing-a-long-range-link'],
  body: `LoRaWAN turns LoRa radios into a network. A sensor, the **end device**, sends to any **gateway** in range; the gateways pass every packet over the internet to a **network server**, which removes duplicates, checks the keys and hands the data to your application. The device never knows which gateway heard it, and a gateway makes no decisions about the data.

### Who does what
A gateway is a radio relay: it listens on several channels at once and forwards what it hears. The network server owns the addresses, the frame counters and the data rates; an application server decrypts the payload. Community networks (The Things Network is the best known), commercial operators and your own server (ChirpStack is open source) speak the same protocol, which the LoRa Alliance specifies together with regional parameters for each band.

### Two ways to join
With **OTAA** (over-the-air activation) the device holds a DevEUI, a JoinEUI and a 128-bit AppKey. It sends a join request and the network replies with a new address and fresh session keys. With **ABP** the keys are typed in and there is no join; it works until the device forgets its frame counter after a reset, and then the network discards its packets as replays. Prefer OTAA. Two AES-128 keys then protect every frame: one signs it, so forgeries are rejected, and one encrypts the payload.

### The classes
In **class A** every uplink is followed by two short receive windows, one second and two seconds after it ends; only then can the network answer. The device sleeps in between, so this is the low-power class. **Class B** adds listening slots synchronised by gateway beacons. **Class C** listens all the time except when sending: instant downlinks, but the receiver current never stops.

### The small print of a small packet
A frame adds 13 bytes (header, address, counter, port and a 4-byte integrity code), so 10 bytes of readings is 23 bytes on the air: 62 ms at SF7, 1.5 s at SF12. Allowed payload shrinks with the spreading factor, and downlinks are scarce because gateways are bound by duty cycle too. At the time of writing, The Things Network's fair-use policy for its community network allows each device 30 seconds of uplink air time and 10 downlinks a day.

> [!key] LoRaWAN is a star of gateways around a network server, with encrypted frames, two receive windows after every uplink, and strict air-time budgets. Join with OTAA, keep the payload to a few bytes, and design as if the device could never be told anything.`,
  ideas: [
    'End devices talk to any gateway in range; gateways forward blindly and the network server does the thinking.',
    'Class A devices can receive only in two short windows after each uplink, which is what keeps them on a coin of energy.',
    'OTAA gives fresh session keys at every join; ABP reuses fixed keys and breaks if the frame counter is lost.',
    'A frame adds 13 bytes to your payload, and air-time budgets (duty cycle, fair use) cap how often you can send.'
  ],
  pitfalls: [
    'The gateway reads and routes my data — It only forwards encrypted frames to the network server; the payload is encrypted with a key the gateway does not hold.',
    'I can send a command to my sensor whenever I like — A class A device listens only briefly after it has transmitted. A command queued now waits until the next uplink, which may be minutes or hours away.',
    'An ESP32 with a LoRa chip is a LoRaWAN gateway — A single-channel board listens on one channel and one spreading factor, which real devices do not stick to. A proper gateway has a concentrator chip that listens on eight or more channels at once.'
  ],
  terms: [
    { term: 'LoRaWAN gateway', also: ['gateway', 'concentrator'], def: 'A radio station that receives LoRa packets on several channels and forwards them over IP to the network server, and sends the downlinks of the server back out. It does not read the payload.' },
    { term: 'Network server', also: ['LNS', 'NS'], def: 'The LoRaWAN service that removes duplicate packets, checks integrity codes and frame counters, adapts data rates and schedules downlinks.' },
    { term: 'OTAA', also: ['over-the-air activation', 'join'], def: 'Joining a LoRaWAN network by a request and an answer, which gives the device a new address and fresh session keys every time.' },
    { term: 'ABP', also: ['activation by personalisation'], def: 'Joining by fixing the address and session keys in the device. There is no handshake, and a reset that loses the frame counter makes the network reject the device.' },
    { term: 'Device class', also: ['class A', 'class B', 'class C'], def: 'How often a LoRaWAN device listens: class A only in two windows after sending, class B also in scheduled slots, class C almost continuously.' },
    { term: 'Adaptive data rate', also: ['ADR'], def: 'A mechanism by which the network server moves a stationary device to the fastest data rate and lowest power that still leave a safe signal margin.' }
  ],
  sim: 'lr-lorawan',
  formulas: [
    {
      name: 'Uplinks per day under an air-time budget',
      expr: 'N = Tb/ta',
      tex: 'N = \\frac{T_b}{t_a}',
      vars: {
        N: { name: 'uplinks per day', q: 'count' },
        Tb: { name: 'air-time budget per day', q: 'time', unit: 's', value: 30, tex: 'T_b' },
        ta: { name: 'air time of one uplink', q: 'time', unit: 'ms', value: 206, tex: 't_a' }
      },
      solveFor: 'N',
      note: 'The 30 s is the daily uplink budget of The Things Network\'s fair-use policy; check the current policy and your own network\'s rules. A frame is the payload plus 13 bytes.',
      stories: { N: 'An uplink takes {ta} on the air and the network allows {Tb} of uplink air time a day. How many uplinks can the device send per day?' }
    }
  ],
  examples: [
    {
      title: 'How often can the sensor report on a community network?',
      q: 'A node sends 10 bytes of readings at SF9 and 125 kHz. The community network allows 30 s of uplink air time a day. How many uplinks a day is that, and how often?',
      steps: ['The frame is $10 + 13 = 23$ bytes. At SF9, 125 kHz it takes about 206 ms on the air.', 'Uplinks a day: $30 / 0.206 \\approx 145$.', 'One every $86\\,400 / 145 \\approx 600$ s, so about every ten minutes.'],
      a: 'About 145 uplinks a day, one every ten minutes. At SF12 the same payload takes 1.48 s and the budget shrinks to 20 uplinks, so a node that needs SF12 has to report hourly or less.'
    }
  ],
  choose: {
    good: ['Many small sensors spread over a wide area, each sending a few bytes every few minutes or hours', 'Where a community or operator network already covers the site, so you need no gateway of your own', 'A battery that must last years, with downlinks that can wait for the next uplink'],
    avoid: ['Commands that must reach a device immediately, unless it is class C on mains', 'Large or frequent payloads, and anything near-real-time', 'A single-channel ESP32 pretending to be a gateway'],
    check: ['Whether a gateway of your network is in range of the site', 'The payload size allowed at the data rate you will really get', 'The fair-use or duty-cycle limit, in uplinks per day']
  },
  code: [
    {
      title: 'Pack readings into four bytes',
      about: 'A LoRaWAN uplink should carry bytes, not text. This packs a temperature, a humidity and a battery voltage into 4 bytes, the form you would hand to a LoRaWAN stack as an uplink on a chosen port.',
      needs: 'Any ESP32-family board and the serial monitor. The LoRaWAN stack itself (RadioLib has one, and so have MCCI\'s LMIC library and Semtech\'s reference stack) is outside this page: pass `payload` to its send call.',
      blocks: `
        when started
          start serial at (115200) baud
          set [t v] to (round ((21.37) * (100)))
          set [h v] to (round ((48.5) * (2)))
          set [b v] to (round (((3.62) - (2)) * (100)))
          set [payload v] to (bytes (t as 2 bytes) (h) (b))
          print (join [bytes: ] (payload as hex))
          send (payload) as LoRaWAN uplink on port (1) :: radio
      `,
      cpp: String.raw`
        // Layout, big-endian: temperature in 0.01 degC (int16), humidity in 0.5 % (uint8),
        // battery in 10 mV steps above 2 V (uint8). Four bytes instead of 20 characters of text.
        size_t packReadings(float tempC, float humidity, float batteryV, uint8_t *out) {
          int16_t t = (int16_t)lroundf(tempC * 100);
          uint8_t h = (uint8_t)lroundf(humidity * 2);
          uint8_t b = (uint8_t)constrain(lroundf((batteryV - 2.0f) * 100), 0, 255);
          out[0] = t >> 8;
          out[1] = t & 0xFF;
          out[2] = h;
          out[3] = b;
          return 4;
        }

        void setup() {
          Serial.begin(115200);
          uint8_t payload[4];
          size_t n = packReadings(21.37, 48.5, 3.62, payload);
          Serial.printf("%u bytes:", (unsigned)n);
          for (size_t i = 0; i < n; i++) Serial.printf(" %02X", payload[i]);
          Serial.println();
          // hand payload and n to the LoRaWAN stack's send call, on port 1
        }

        void loop() {}
      `,
      py: String.raw`
        import struct

        # Layout, big-endian: temperature in 0.01 degC (int16), humidity in 0.5 % (uint8),
        # battery in 10 mV steps above 2 V (uint8). Four bytes instead of 20 characters of text.
        def pack_readings(temp_c, humidity, battery_v):
            t = round(temp_c * 100)
            h = round(humidity * 2)
            b = max(0, min(255, round((battery_v - 2.0) * 100)))
            return struct.pack(">hBB", t, h, b)

        payload = pack_readings(21.37, 48.5, 3.62)
        print(len(payload), "bytes:", " ".join("%02X" % x for x in payload))
        # hand payload to the LoRaWAN stack's send call, on port 1
      `,
      output: `
        4 bytes: 08 59 61 A2
      `,
      notes: ['On the network side a payload formatter (a short script in the network server) turns the four bytes back into numbers. Agree the byte layout and write both ends together.', 'Four bytes plus the 13 of the frame is 17 bytes: 58 ms at SF7 and 1.2 s at SF12.']
    }
  ],
  quiz: [
    { q: 'A class A device has just sent an uplink. When can the network send it a downlink?', choices: ['At any time, the device is always listening', 'Only in the two receive windows that follow that uplink', 'Only in the hour after joining', 'Whenever a gateway is in range'], a: 1, why: 'Class A devices open a receive window one second after the uplink ends and another a second later, and are deaf otherwise. A message queued on the server waits for the next uplink.' },
    { q: 'An ABP device is reset and starts counting its frames from zero. What does the network server do?', choices: ['Accepts everything and resets its own counter', 'Drops the packets as replays until the device\'s counter passes the stored value', 'Asks the device to join again', 'Encrypts the packets with a new key'], a: 1, why: 'The frame counter prevents replay attacks, so the server ignores counters it has already seen. An OTAA device would simply join again and start fresh.' },
    { q: 'A LoRaWAN gateway can read the sensor values it forwards.', a: false, why: 'The gateway forwards frames; the payload is encrypted with an application key that the gateway does not have. Only the application server (and so whoever runs it) can decrypt it.' },
    { q: 'A node sends 10 bytes at SF7. How many bytes are on the air, and why?', choices: ['10, the payload alone', '23: the payload plus 13 bytes of headers and integrity code', '12: a two-byte header', '255: a LoRaWAN frame has a fixed size'], a: 1, why: 'A LoRaWAN frame adds a header byte, a four-byte address, control, a two-byte counter, a port byte and a four-byte message integrity code: 13 bytes in all.' }
  ],
  applications: [
    'Smart metering of water, gas or heat in buildings, with a gateway on a roof covering a district.',
    'Environmental and agricultural sensors (soil, weather, river levels) reporting a few times an hour on a battery for years.',
    'Asset and container tracking where a position every few minutes is enough.',
    'Building sensors (leaks, occupancy, doors) that report on a change and every few hours otherwise.'
  ],
  sources: [
    'LoRa Alliance: the LoRaWAN Specification (1.0.x and 1.1) and the LoRaWAN Regional Parameters.',
    'The Things Network documentation, including its Fair Use Policy for the community network.',
    'The documentation of the stack you use (RadioLib\'s LoRaWAN node, MCCI LMIC, or Semtech\'s LoRa Basics Modem).'
  ]
},

/* ================================================================ Meshtastic */
{
  id: 'meshtastic',
  parent: 'long-range-and-other-radios',
  title: 'Meshtastic',
  level: 2,
  short: 'Meshtastic is open-source firmware that turns LoRa boards into an off-grid text messenger: no gateway, no internet, no subscription, just nodes that hear each other and repeat what they hear.',
  keywords: ['Meshtastic', 'mesh', 'LoRa mesh', 'flooding', 'hop limit', 'modem preset', 'Long Fast', 'T-Beam', 'Heltec V3', 'T-Deck', 'off-grid', 'channel', 'PSK', 'router', 'repeater', 'client mute', 'region'],
  prereq: ['lora', 'lora-parameters'],
  related: ['lorawan', 'lora-boards', 'mesh-networks-on-esp', 'esp-now', 'choosing-a-long-range-link', 'transmit-power-and-regulations'],
  body: `Meshtastic is open-source firmware that turns LoRa boards into an off-grid messenger. Nodes form a mesh with no gateway, no internet and no subscription: a text typed on a phone paired with one node hops from node to node until it reaches the one it is meant for, or everyone nearby. Many boards of the catalogue run it, among them the Heltec WiFi LoRa 32 V3, the LilyGO T-Beam, T-Deck and T3-S3, and Seeed's XIAO ESP32-S3 with a Wio-SX1262.

### Not LoRaWAN
Meshtastic has its own protocol on top of LoRa. Every node is both a user and a relay; there are no gateways. The phone talks to its node over Bluetooth LE, Wi-Fi or USB, and the node does the radio work. Messages carry a sender, a destination and a hop limit.

### Managed flooding
A node that hears a packet it has not seen rebroadcasts it and lowers the hop limit by one. The default limit is 3 and the largest allowed 7; a packet that arrives with none left is heard but not passed on. A node that hears someone else already repeating a packet may stay silent. So the reach grows with hops, but every hop costs air time on a channel everyone shares. A **Router** or **Repeater** on a hilltop extends the mesh; many routers close together only add noise.

### Presets, channels and keys
The **modem preset** chooses the spreading factor and bandwidth. Long Fast, the default, uses SF11 at 250 kHz, roughly 1 kbit/s; Short Fast uses SF7 and is about ten times quicker with far less range. All nodes of a mesh need the same preset and region. A **channel** has a name and a pre-shared key. The default channel's key is the same on every node in the world, so treat it as public. A private channel needs its own key, and direct messages use public-key encryption in recent versions.

### Region and rules
Setting the region fixes frequency, power and duty cycle to your country's rules, so choose it first and use an antenna for that band. The firmware is not an emergency service: a mesh depends on who is in range.

~~~sh
pip install meshtastic
meshtastic --info
meshtastic --set lora.region EU_868
meshtastic --set lora.modem_preset LONG_FAST
meshtastic --sendtext "hello from the hill"
~~~

> [!key] Meshtastic is firmware, not a radio: boards with LoRa chips repeat each other's packets, a hop at a time, with no infrastructure. Reach comes from hops and well-placed nodes, but the shared channel fills up quickly, so keep the hop limit and the number of routers modest.`,
  ideas: [
    'Meshtastic runs a flooding mesh on LoRa boards: each node repeats packets it has not seen, up to a hop limit.',
    'The modem preset sets spreading factor and bandwidth: a long, slow preset reaches farther and uses more air time.',
    'The default channel has a public key; privacy needs your own channel key.',
    'Reach comes from hops and hilltop nodes, and every hop spends air time that all nodes share.'
  ],
  pitfalls: [
    'More routers always make a better mesh — Each router repeats traffic, so many in one area multiply transmissions and fill the channel. A few well-placed ones help; the rest should be ordinary clients.',
    'My messages are private by default — The default channel uses a key that is the same for every Meshtastic node. Anyone with a node on the default settings can read it; set up your own channel.',
    'A hop limit of 7 gives seven times the range — Each extra hop is another rebroadcast on the shared channel, so the mesh fills with repeats and can lose messages. The default of 3 is a deliberate compromise.'
  ],
  terms: [
    { term: 'Mesh flooding', also: ['managed flooding', 'rebroadcast'], def: 'Delivering a message by having each node repeat it once, with some rules (a hop limit, staying silent when someone else repeated it) to stop the repeats going on for ever.' },
    { term: 'Hop limit', also: ['TTL', 'hops'], def: 'The number of times a packet may still be repeated. Each repeating node lowers it by one, and a packet with none left is not forwarded.' },
    { term: 'Modem preset', also: ['LongFast', 'ShortFast'], def: 'A named bundle of LoRa spreading factor, bandwidth and coding rate. All nodes of a mesh must use the same preset.' },
    { term: 'Pre-shared key', also: ['PSK', 'channel key'], def: 'A secret shared in advance by everyone who is allowed to read a channel. It is used to encrypt each packet; a channel with a well-known key offers no privacy.' },
    { term: 'Device role', also: ['client', 'router', 'repeater'], def: 'A setting that tells a Meshtastic node how to behave in the mesh: a normal Client, a Client Mute that does not repeat, a Router or Repeater that is placed to relay, a Tracker, or a Sensor.' }
  ],
  sim: 'lr-mesh',
  choose: {
    good: ['Off-grid text and position sharing for a hiking, sailing, festival or neighbourhood group', 'A mesh where no gateway or internet link may exist', 'Experimenting with LoRa on boards that have a screen, a battery and a GNSS receiver already'],
    avoid: ['Safety of life: it carries no delivery guarantee', 'Large, busy meshes of hundreds of chatty nodes', 'Private information on the default channel'],
    check: ['The region setting and the antenna for your band', 'The number of routers and the hop limit', 'The channel and the key before you share it']
  },
  quiz: [
    { q: 'A message leaves node A with a hop limit of 3. How many relays can pass it on?', choices: ['One', 'Three', 'Seven', 'As many as are in range'], a: 1, why: 'Each repeating node lowers the limit by one; at zero a packet is received but not forwarded. So three relays at most: the message can reach nodes up to four radio links from A.' },
    { q: 'Why not set every node to Router and the hop limit to 7?', choices: ['The firmware forbids it', 'Every extra repeat uses the shared channel, so the mesh floods itself and loses messages', 'Routers have shorter range than clients', 'Higher hop limits are slower for a single message'], a: 1, why: 'Flooding multiplies transmissions. A congested LoRa channel loses packets, so more routers and hops can lower the delivery rate.' },
    { q: 'Meshtastic nodes need an internet connection to deliver a message between two phones.', a: false, why: 'The messages travel over LoRa between nodes. Internet bridges (MQTT) are optional extras.' },
    { q: 'You join a mesh on the default channel with its default key. Who can read your text?', choices: ['Only the node you sent it to', 'Only members of your group', 'Anyone with a Meshtastic node set to the defaults and in range', 'Nobody: it is encrypted end to end'], a: 2, why: 'The default key is the same for every node, so encryption on it provides no privacy. Create a private channel with your own key for a group.' }
  ],
  applications: [
    'Groups on a hike, ski tour or sailing trip, passing short messages and positions without a mobile signal.',
    'Event teams (marshals, festival crew) with handheld nodes and a few hilltop repeaters.',
    'Neighbourhood or farm networks sharing sensor readings and text between buildings.',
    'A learning platform for LoRa: boards with screens and batteries, and the firmware open to read.'
  ],
  sources: [
    'The Meshtastic project documentation: modem presets, roles, channels and the hop limit.',
    'Semtech: LoRa Modulation Basics (application note AN1200.22).',
    'Your national regulator\'s rules for the band selected by the region setting.'
  ]
},

/* ================================================================ 433 and 868 MHz radios */
{
  id: 'sub-ghz-radios',
  parent: 'long-range-and-other-radios',
  title: '433 and 868 MHz: CC1101, RFM69, OOK',
  level: 2,
  short: 'Below 1 GHz live the remote controls, weather sensors and doorbells of everyday life. Why those frequencies reach farther than 2.4 GHz, how a one-way OOK link differs from an FSK radio chip, and why a fixed code protects nothing.',
  keywords: ['433 MHz', '868 MHz', '915 MHz', 'sub-GHz', 'OOK', 'ASK', 'FSK', 'GFSK', 'CC1101', 'RFM69', 'RFM69HCW', 'EV1527', 'PT2262', 'rolling code', 'KeeLoq', 'superheterodyne', 'superregenerative', 'RXB6', 'remote control', 'rc-switch', 'path loss', 'quarter wave', 'wavelength'],
  prereq: ['radio-basics', 'link-budget', 'lora'],
  related: ['nrf24', 'lora-parameters', 'external-antennas', 'transmit-power-and-regulations', 'choosing-a-long-range-link', 'antenna-gain-and-patterns'],
  body: `Below 1 GHz sit the bands of the garage-door remote, the weather station, the wireless doorbell and the LoRa node: 433 MHz in Europe and some other regions, 868 MHz in Europe, 915 MHz in the Americas. A radio there reaches farther than a 2.4 GHz one with the same power, and the reason is plain geometry.

### Why lower frequencies reach farther
Between antennas of the same kind the free-space path loss grows with the square of the frequency. Over any distance, 868 MHz loses 9 dB less than 2.44 GHz and 433 MHz 15 dB less: in free space, 2.8 times and 5.6 times the range for the same power and sensitivity. Longer waves also bend round and through obstacles a little better, and the band is far less crowded. The price is the antenna: a quarter wave is about 164 mm at 433.92 MHz, 82 mm at 868 MHz and only 29 mm at 2.4 GHz, so a good small antenna is harder to make.

### Two kinds of radio
**OOK** (on-off keying, also called ASK) switches the carrier on for a 1 and off for a 0. The cheap 433 MHz transmitter and receiver module pairs do this: one-way, no addresses, no error checking, and a receiver that outputs noise whenever nobody is transmitting. They run most remote switches, doorbells and weather sensors. **FSK** shifts the carrier between two frequencies, which is more robust and goes faster. Chips such as the **CC1101** (Texas Instruments, several sub-GHz bands) and the **RFM69** (a HopeRF module on a Semtech chip, with hardware AES) do FSK, GFSK and OOK, take commands over SPI, handle packets, addresses and checks themselves, and send up to a few hundred kilobits a second. RadioLib drives both with the same style of calls it uses for LoRa chips, and the catalogue lists a board with a CC1101, the LilyGO T-Embed CC1101.

### A fixed code protects nothing
A remote built on a fixed-code chip (the EV1527 family) sends the same pulse train for every press, so anyone with a receiver can record and repeat it. Never guard anything valuable with it. Garage and car remotes use rolling codes designed to defeat copying: work only on devices you own.

### Rules
Short-range-device rules limit power and sometimes the share of time on the air: in Europe 433.05 to 434.79 MHz allows about 10 mW radiated, and 868 MHz is cut into sub-bands with their own limits. Use a module certified for your region and keep its antenna.

> [!key] Lower frequency means less path loss and longer antennas: 868 MHz reaches 2.8 times farther than 2.4 GHz in free space. Cheap OOK modules are one-way and noisy; FSK chips such as the CC1101 and RFM69 are packet radios. A fixed code is a convenience, not a lock.`,
  ideas: [
    'Free-space path loss grows with frequency squared: 868 MHz is 9 dB better than 2.4 GHz and 433 MHz is 15 dB better, with a longer antenna as the price.',
    'OOK modules are one-way on-off keying with no addressing or checking; FSK chips such as the CC1101 and RFM69 are packet radios.',
    'A receiver module outputs noise when idle, so software looks for a long pause and a plausible pulse pattern.',
    'Fixed-code remotes can be copied; rolling-code remotes are designed to resist it.'
  ],
  pitfalls: [
    'A 433 MHz module "has a range of 500 m" because the listing says so — That is an open-field figure for the transmitter at 12 V with a good antenna. At 3.3 V, indoors, with a wire stub on the receiver, tens of metres is normal.',
    'A remote with a code on it is secure — A fixed code is repeated exactly each press, so it can be recorded and replayed. Only rolling-code or properly encrypted systems resist that.',
    'Any 433 MHz module may transmit at any power — The legal limit is a few milliwatts of radiated power in most countries, and a cheap module with a long antenna can exceed it. Use certified parts for anything you ship.'
  ],
  terms: [
    { term: 'OOK', also: ['on-off keying', 'ASK', 'amplitude-shift keying'], def: 'Modulation by switching the carrier on and off: on for a 1, off for a 0. It is the simplest and cheapest radio link, and the most easily disturbed.' },
    { term: 'FSK', also: ['GFSK', 'frequency-shift keying'], def: 'Modulation that shifts the carrier between two frequencies to send 0 and 1. More robust against noise than OOK; GFSK smooths the shifts to narrow the signal.' },
    { term: 'Superregenerative receiver', also: ['super-regen', 'super-regenerative'], def: 'The type of receiver in the cheapest 433 MHz modules: simple and sensitive but broad, drifting and noisy. A superheterodyne receiver, the better kind, rejects other signals more and costs a little more.' },
    { term: 'Rolling code', also: ['hopping code', 'KeeLoq'], def: 'A remote-control scheme in which every press sends a new code from a sequence shared with the receiver, so a recorded code is useless when replayed.' },
    { term: 'EV1527', also: ['PT2262', 'fixed code'], def: 'A common encoder chip for cheap remotes that sends a 24-bit fixed code as pulses of one basic time unit: a long high and short low for a 1, the reverse for a 0.' }
  ],
  sim: 'lr-range',
  formulas: [
    {
      name: 'Free-space path loss',
      expr: 'L = 20*log(d) + 20*log(f) - 147.55',
      tex: 'L = 20\\log_{10} d + 20\\log_{10} f - 147.55',
      vars: {
        L: { name: 'path loss', q: 'gain', unit: 'dB', tex: 'L' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 1000, min: 1, tex: 'd' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 868, min: 1, tex: 'f' }
      },
      solveFor: 'L',
      note: 'Between two isotropic antennas in free space, with the distance in metres and the frequency in hertz inside the sum (the calculator converts). Walls, ground reflections and trees add loss on top.',
      stories: { L: 'A transmitter and receiver are {d} apart at {f}. How much path loss does free space give?' }
    },
    {
      name: 'Quarter-wave antenna length',
      expr: 'l = 0.95*c/(4*f)',
      tex: 'l = \\frac{0.95\\, c}{4 f}',
      vars: {
        l: { name: 'antenna length', q: 'length', unit: 'mm', tex: 'l' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 433.92, min: 1, tex: 'f' }
      },
      solveFor: 'l',
      note: 'The 0.95 is a typical shortening for a thin wire; a trimmed length on the bench with an analyser beats the calculation.',
      stories: { l: 'A wire antenna for {f} is cut to a quarter wave with the usual shortening. How long is it?' }
    }
  ],
  choose: {
    good: ['OOK modules for one-way remote switches and sensors on your own equipment, with 10 mW or less', 'CC1101 or RFM69 for two-way FSK links of a few hundred metres at kilobits a second', 'Reusing an existing 433 or 868 MHz sensor fleet with a receiver on an ESP'],
    avoid: ['Protecting anything valuable with a fixed code', 'Counting on range figures from a module listing', 'A transmitter without its antenna'],
    check: ['The legal power, band and duty cycle for your country', 'That the module is certified for the region where it is sold or used', 'The supply: transmitters droop on a weak 3.3 V rail']
  },
  code: [
    {
      title: 'Print the pulses of a 433 MHz remote',
      about: 'Waits for the long pause that starts a frame from a cheap remote, then prints the widths of the next 48 pulses in microseconds. A typical fixed-code remote shows pulses near 350 and 1050 microseconds: the basic time unit and three times it.',
      needs: 'An ESP32 DevKit and a 433 MHz receiver module (a superheterodyne type gives a cleaner signal than a super-regenerative one), powered from 3V3 so that its output never exceeds 3.3 V, with a wire of about 16 cm as its antenna. Use only a remote you own.',
      wiring: [['GPIO27', 'receiver DATA', 'input'], ['3V3', 'receiver VCC', 'not 5 V: the data pin would then exceed the ESP\'s 3.3 V'], ['GND', 'receiver GND'], ['ANT', '16 cm of wire', 'a quarter wave at 433.92 MHz']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input v]
        forever
          wait for a low pulse longer than (5000) µs on pin (27) :: pins
          record (48) pulses from pin (27) into [widths v] :: pins
          print (join [pulses (us): ] (widths))
        end
      `,
      cpp: String.raw`
        const int RX_PIN = 27;                  // DATA of the 433 MHz receiver

        void setup() {
          Serial.begin(115200);
          pinMode(RX_PIN, INPUT);
        }

        void loop() {
          // the long low gap between two frames: anything shorter is noise
          if (pulseIn(RX_PIN, LOW, 200000) < 5000) return;
          uint16_t w[48];
          for (int i = 0; i < 48; i += 2) {
            w[i]     = pulseIn(RX_PIN, HIGH, 5000);     // 0 means the pulse timed out
            w[i + 1] = pulseIn(RX_PIN, LOW, 5000);
          }
          Serial.print("pulses (us):");
          for (int i = 0; i < 48; i++) {
            Serial.print(' ');
            Serial.print(w[i]);
          }
          Serial.println();
        }
      `,
      py: String.raw`
        from machine import Pin, time_pulse_us

        rx = Pin(27, Pin.IN)                    # DATA of the 433 MHz receiver

        while True:
            # the long low gap between two frames: anything shorter is noise
            if time_pulse_us(rx, 0, 200000) < 5000:
                continue
            widths = []
            for _ in range(24):
                widths.append(time_pulse_us(rx, 1, 5000))    # negative means the pulse timed out
                widths.append(time_pulse_us(rx, 0, 5000))
            print("pulses (us):", *widths)
      `,
      output: `
        pulses (us): 354 1062 351 1065 1058 349 354 1060 1057 352 353 1063 ...
      `,
      notes: ['A long pulse is a 1 and a short one a 0 (or the reverse, depending on the encoder). Frames repeat several times per press, so you will see the same line a few times.', 'A super-regenerative receiver prints noise between frames; the 5 ms gap test and the plausibility of the numbers separate signal from noise.']
    },
    {
      title: 'Send a 24-bit code as OOK pulses',
      about: 'Sends a fixed 24-bit code in the timing of the common EV1527 remotes (one time unit of 350 microseconds), repeated ten times, once every five seconds, to a switch that you have taught that code.',
      needs: 'An ESP32 DevKit and a 433 MHz OOK transmitter module (certified for your region) with a 16 cm wire antenna, and a receiver socket or switch of your own that learns fixed codes. Radio rules apply: check them ([[transmit-power-and-regulations]]).',
      wiring: [['GPIO25', 'transmitter DATA'], ['3V3', 'transmitter VCC', 'a higher supply voltage raises the output power: stay inside the legal limit'], ['GND', 'transmitter GND'], ['ANT', '16 cm of wire']],
      blocks: `
        define pulse (high) (low) :: my
          set pin (25) to [HIGH v]
          wait ((high) * (0.00035)) seconds
          set pin (25) to [LOW v]
          wait ((low) * (0.00035)) seconds

        define send code (code) (bits) :: my
          repeat (10)
            for each [bit v] in (the (bits) bits of (code), highest first)
              if <(bit) = (1)> then
                pulse (3) (1) :: my
              else
                pulse (1) (3) :: my
              end
            end
            pulse (1) (31) :: my
          end

        when started
          set pin (25) as [output v]
        forever
          send code (5393) (24) :: my
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        const int TX_PIN = 25;                       // DATA of the 433 MHz transmitter
        const int T_US = 350;                        // one time unit

        void pulse(int high, int low) {              // both in time units
          digitalWrite(TX_PIN, HIGH);
          delayMicroseconds(high * T_US);
          digitalWrite(TX_PIN, LOW);
          delayMicroseconds(low * T_US);
        }

        void sendCode(uint32_t code, int bits) {
          for (int repeat = 0; repeat < 10; repeat++) {   // remotes repeat the frame so one survives
            for (int i = bits - 1; i >= 0; i--) {
              if (code & (1UL << i)) pulse(3, 1);         // 1: long high, short low
              else                   pulse(1, 3);         // 0: short high, long low
            }
            pulse(1, 31);                                 // the sync gap before the next frame
          }
        }

        void setup() {
          pinMode(TX_PIN, OUTPUT);
          digitalWrite(TX_PIN, LOW);
        }

        void loop() {
          sendCode(5393, 24);
          delay(5000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        tx = Pin(25, Pin.OUT, value=0)               # DATA of the 433 MHz transmitter
        T_US = 350                                   # one time unit

        def pulse(high, low):                        # both in time units
            tx.value(1)
            time.sleep_us(high * T_US)
            tx.value(0)
            time.sleep_us(low * T_US)

        def send_code(code, bits):
            for _ in range(10):                      # remotes repeat the frame so one survives
                for i in range(bits - 1, -1, -1):
                    if code & (1 << i):
                        pulse(3, 1)                  # 1: long high, short low
                    else:
                        pulse(1, 3)                  # 0: short high, long low
                pulse(1, 31)                         # the sync gap before the next frame

        while True:
            send_code(5393, 24)
            time.sleep(5)
      `,
      notes: ['Timing inside a few tens of microseconds is enough for these receivers; MicroPython\'s sleep_us is good enough, but a busy program with interrupts can stretch a pulse.', 'The libraries rc-switch (Arduino) and rmt-based drivers do this with several protocols, and the RMT peripheral ([[the-rmt-peripheral]]) makes the timing exact.', 'Send only codes for equipment you own. Rolling-code remotes cannot be replayed this way, by design.']
    }
  ],
  quiz: [
    { q: 'Two links with the same transmit power, antennas and receiver sensitivity, at 433 MHz and at 2.44 GHz. How much path loss does free space give each, and what follows?', choices: ['The same loss: the frequency does not matter', '15 dB less at 433 MHz, so about 5.6 times the range', '15 dB more at 433 MHz, so a shorter range', '3 dB less at 433 MHz'], a: 1, why: 'Path loss grows as $20 \\log_{10} f$: $20 \\log_{10}(2442/433) = 15$ dB, and 15 dB is a factor 5.6 in distance in free space.' },
    { q: 'What is a quarter-wave antenna length at 868 MHz?', choices: ['About 8 mm', 'About 82 mm', 'About 345 mm', 'About 1 m'], a: 1, why: 'The wavelength is 299.8 / 868 = 0.345 m. A quarter is 86 mm, and the usual 0.95 shortening gives about 82 mm.' },
    { q: 'A garage-door remote with a fixed code is safe because nobody else knows the code.', a: false, why: 'The code is sent in the clear every time you press the button. A receiver within range can record it and repeat it. Rolling-code systems change the code on every press.' },
    { q: 'Why does the capture program wait for a pause of more than 5 ms before recording?', choices: ['The ESP32 needs 5 ms to wake up', 'An idle OOK receiver outputs noise; the long gap marks the start of a real frame', 'Receivers cannot work without a pause', 'It saves memory'], a: 1, why: 'Without a carrier the receiver amplifies noise until its automatic gain control settles, producing random edges. A real frame starts after a long low gap, which noise rarely produces.' }
  ],
  applications: [
    'Remote switches, dimmers and blinds with 433 MHz handsets, controlled from an ESP through a transmitter module.',
    'Receiving the temperature of a commercial 433 or 868 MHz weather sensor into your own display.',
    'A two-way telemetry link with a CC1101 or RFM69 where LoRa\'s slow rate is unnecessary.',
    'Wireless doorbells, alarm sensors and gate openers that you own, reading or replacing the handset.'
  ],
  sources: [
    'Texas Instruments: CC1101 low-power sub-1 GHz RF transceiver data sheet.',
    'HopeRF: RFM69HCW data sheet; Semtech: SX1231 data sheet.',
    'ETSI EN 300 220 (short-range devices, 25 MHz to 1 GHz) and your national rules for 433 and 868 MHz.'
  ]
},

/* ================================================================ nRF24L01 */
{
  id: 'nrf24',
  parent: 'long-range-and-other-radios',
  title: 'nRF24L01',
  level: 2,
  short: 'The nRF24L01+ is a tiny, cheap 2.4 GHz radio with a built-in packet engine: addresses, acknowledgements and retries done in hardware, 32-byte packets, and nothing in common with Wi-Fi or Bluetooth.',
  keywords: ['nRF24L01', 'nRF24L01+', 'NRF24', 'RF24', 'Enhanced ShockBurst', '2.4 GHz', 'Nordic', 'data pipe', 'CE', 'CSN', 'PA LNA', 'clone', 'Si24R1', 'proprietary', '250 kbps', 'channel 76'],
  prereq: ['radio-basics', 'spi', 'esp-now'],
  related: ['sub-ghz-radios', 'interference-and-channels', 'external-antennas', 'choosing-a-long-range-link', 'esp-now-topologies'],
  body: `The nRF24L01+ is a 2.4 GHz transceiver from Nordic Semiconductor in a 4 mm package, sold on a postage-stamp module for very little. It sends GFSK packets at 250 kbit/s, 1 Mbit/s or 2 Mbit/s and has a **packet engine**: it adds the address and the CRC, waits for an acknowledgement and retries, all in hardware, while the microcontroller only writes and reads 32-byte payloads over SPI. It is proprietary: no phone, router or Bluetooth chip can hear it; only another nRF24 (or a compatible clone) does.

### What it offers
Channels 0 to 125 sit 1 MHz apart from 2400 MHz, so channel 76 is 2476 MHz, the usual default. Six receive **pipes**, each with its own 5-byte address, let one receiver listen to six transmitters. In the *Enhanced ShockBurst* scheme a sender waits for an acknowledgement and retries up to fifteen times, then reports failure; the receiver may put a payload in the acknowledgement. Output power steps from -18 to 0 dBm, and the receiver is most sensitive at 250 kbit/s (about -94 dBm, against -82 dBm at 2 Mbit/s), so that is the range setting.

### Living next to Wi-Fi
A Wi-Fi channel is 20 MHz wide and the nRF24 channel only 1 MHz, so pick channels in the gaps or above the Wi-Fi in use. Do not go above channel 83: 2.4835 GHz is the top of the licence-free band in Europe and North America.

### Module habits
The supply is 3.3 V (the inputs tolerate 5 V logic), and it must be clean: a 10 µF capacitor across the module's supply pins cures most flaky behaviour. The versions with a power amplifier, an LNA and an SMA antenna reach hundreds of metres in the open, but need a good supply and an antenna fitted before power. Genuine Nordic chips are rare among cheap modules; clones behave nearly alike but not exactly, which explains many "works on one, not on the other" reports. The chip has no encryption, so wireless keyboards and mice that sent unencrypted packets over it have been attacked; encrypt your own payload if it matters.

### Today
For ESP-to-ESP links, [[esp-now]] needs no extra chip and has far more range options, so the nRF24 is chosen for old fleets, tiny nodes, and the pleasure of a protocol you can read.

> [!key] The nRF24L01+ is a 1 MHz-wide 2.4 GHz packet radio with hardware acknowledgements and six pipes, at 250 kbit/s for range. It speaks only to its own kind, needs a clean 3.3 V supply with a capacitor, and has no encryption.`,
  ideas: [
    'The chip does addresses, CRC, acknowledgements and retries itself; the program writes and reads 32-byte payloads.',
    'Channel n is 2400 + n MHz and only 1 MHz wide: choose a gap in the Wi-Fi, and never above channel 83.',
    'Range comes from 250 kbit/s (best sensitivity) and the amplified module, and both depend on a clean supply.',
    'It is proprietary and unencrypted; it cannot talk to Wi-Fi, Bluetooth or ESP-NOW.'
  ],
  pitfalls: [
    'The nRF24L01 and ESP-NOW can talk to each other, both being 2.4 GHz — They use different modulations and packet formats. Only radios of the same kind understand each other.',
    'Module is dead, the library says "not found" — The usual causes are the supply (no capacitor, a weak 3.3 V rail), a wrong CSN or CE pin, and swapped MISO and MOSI. Counterfeit parts are another suspect.',
    'Higher power is always better — At close range maximum power can overload a receiver, and a power-amplified module on a weak supply resets the whole board. Start at the lowest step.'
  ],
  terms: [
    { term: 'Enhanced ShockBurst', also: ['ESB', 'auto-acknowledge'], def: 'Nordic\'s packet scheme built into the nRF24 chips: the sender waits for an acknowledgement and automatically resends up to a set number of times.' },
    { term: 'Data pipe', also: ['pipe', 'RX pipe'], def: 'One of six receive addresses of an nRF24 chip. A packet sent to a pipe\'s address is accepted by that pipe, so one receiver can serve several senders.' },
    { term: 'CE pin', also: ['chip enable'], def: 'The nRF24 pin that switches the radio between standby and active transmit or receive. The program drives it from a normal GPIO alongside the SPI chip-select (CSN).' },
    { term: 'Payload size', also: ['static payload', 'dynamic payload'], def: 'The number of data bytes in a packet, from 1 to 32. It is either fixed at the same value at both ends or sent with each packet (dynamic payloads).' }
  ],
  choose: {
    good: ['Reviving or extending a fleet of nRF24 nodes, remotes or toys', 'Very small battery nodes talking to one receiver at 250 kbit/s', 'A learning exercise in packet radios with hardware acknowledgements'],
    avoid: ['New ESP-to-ESP designs, where ESP-NOW needs no extra chip', 'Anything that must be secure without added encryption', 'Counting on the range figures of cheap PA and LNA modules'],
    check: ['A 10 µF capacitor and a clean 3.3 V supply', 'That the channel is at or below 83 and clear of your Wi-Fi', 'Whether the module is genuine or a clone, if the two ends must behave identically']
  },
  code: [
    {
      title: 'Send a counter and wait for the acknowledgement',
      about: 'Sends a 4-byte counter once a second on channel 76 at 250 kbit/s and reports whether the receiver acknowledged it.',
      needs: 'An ESP32 DevKit and an nRF24L01+ module with a 10 µF capacitor across its supply. Arduino: the RF24 library. MicroPython: the add-on `nrf24l01.py` driver from micropython-lib, which is not in the firmware.',
      wiring: [['GPIO18', 'SCK', 'the default SPI clock'], ['GPIO23', 'MOSI'], ['GPIO19', 'MISO'], ['GPIO21', 'CSN'], ['GPIO22', 'CE'], ['3V3', 'VCC', 'with 10 µF to GND at the module'], ['GND', 'GND']],
      libs: ['RF24'],
      blocks: `
        when started
          start serial at (115200) baud
          start SPI on SCK (18) MISO (19) MOSI (23)
          start nRF24 with CE (22) CSN (21) channel (76) rate [250 kbps v] :: radio
          set nRF24 destination address [NODE1] :: radio
          set [counter v] to (0)
        forever
          send (counter) to nRF24 :: radio
          if <nRF24 acknowledged?> then
            print (join [sent ] (counter))
          else
            print (join [no acknowledgement for ] (counter))
          end
          change [counter v] by (1)
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <RF24.h>

        const int PIN_CE = 22, PIN_CSN = 21;
        RF24 radio(PIN_CE, PIN_CSN);
        const byte ADDRESS[6] = "NODE1";                 // five characters and a terminator
        int counter = 0;

        void setup() {
          Serial.begin(115200);
          SPI.begin(18, 19, 23, PIN_CSN);                // SCK, MISO, MOSI, SS
          if (!radio.begin(&SPI)) {
            Serial.println("nRF24L01 not found: check wiring and the supply");
            while (true) delay(1000);
          }
          radio.setChannel(76);                          // 2476 MHz
          radio.setDataRate(RF24_250KBPS);               // the most sensitive rate
          radio.setPALevel(RF24_PA_LOW);                 // -12 dBm: enough on the bench
          radio.setPayloadSize(sizeof(counter));
          radio.openWritingPipe(ADDRESS);
          radio.stopListening();                         // transmitter
        }

        void loop() {
          bool ok = radio.write(&counter, sizeof(counter));    // true when the receiver acknowledged
          Serial.printf("%s %d\n", ok ? "sent" : "no acknowledgement for", counter);
          counter++;
          delay(1000);
        }
      `,
      py: String.raw`
        import struct
        import time
        from machine import Pin, SPI
        from nrf24l01 import NRF24L01, POWER_1, SPEED_250K     # add-on driver: not in the firmware

        spi = SPI(2, baudrate=4_000_000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))   # id 2: the default SPI pins
        nrf = NRF24L01(spi, Pin(21), Pin(22), channel=76, payload_size=4)   # CSN, CE
        nrf.set_power_speed(POWER_1, SPEED_250K)         # -12 dBm, 250 kbit/s
        nrf.open_tx_pipe(b"NODE1")
        nrf.stop_listening()                             # transmitter
        counter = 0

        while True:
            try:
                nrf.send(struct.pack("i", counter))      # raises OSError when nobody acknowledges
                print("sent", counter)
            except OSError:
                print("no acknowledgement for", counter)
            counter += 1
            time.sleep(1)
      `,
      output: `
        sent 0
        sent 1
        no acknowledgement for 2
        sent 3
      `,
      notes: ['The first thing to try when "not found" appears is the capacitor and the CSN and CE pins; the next is a shorter wire to the module.', 'Both ends need the same channel, data rate, address and payload size. The MicroPython driver\'s constants and calls follow micropython-lib: check them against the version you install.']
    },
    {
      title: 'Receive and print the counter',
      about: 'The matching receiver: listens on pipe 1 at the same address and prints each counter it gets.',
      needs: 'A second ESP32 and nRF24L01+ module wired the same way.',
      libs: ['RF24'],
      blocks: `
        when started
          start serial at (115200) baud
          start SPI on SCK (18) MISO (19) MOSI (23)
          start nRF24 with CE (22) CSN (21) channel (76) rate [250 kbps v] :: radio
          listen on nRF24 pipe (1) address [NODE1] :: radio

        when data received :: radio
          print (join [received ] (nRF24 payload as number))
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <RF24.h>

        const int PIN_CE = 22, PIN_CSN = 21;
        RF24 radio(PIN_CE, PIN_CSN);
        const byte ADDRESS[6] = "NODE1";

        void setup() {
          Serial.begin(115200);
          SPI.begin(18, 19, 23, PIN_CSN);
          if (!radio.begin(&SPI)) {
            Serial.println("nRF24L01 not found: check wiring and the supply");
            while (true) delay(1000);
          }
          radio.setChannel(76);
          radio.setDataRate(RF24_250KBPS);
          radio.setPALevel(RF24_PA_LOW);
          radio.setPayloadSize(sizeof(int));
          radio.openReadingPipe(1, ADDRESS);
          radio.startListening();                        // receiver
        }

        void loop() {
          if (radio.available()) {
            int value;
            radio.read(&value, sizeof(value));
            Serial.printf("received %d\n", value);
          }
        }
      `,
      py: String.raw`
        import struct
        from machine import Pin, SPI
        from nrf24l01 import NRF24L01, POWER_1, SPEED_250K     # add-on driver: not in the firmware

        spi = SPI(2, baudrate=4_000_000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        nrf = NRF24L01(spi, Pin(21), Pin(22), channel=76, payload_size=4)   # CSN, CE
        nrf.set_power_speed(POWER_1, SPEED_250K)
        nrf.open_rx_pipe(1, b"NODE1")
        nrf.start_listening()                            # receiver

        while True:
            if nrf.any():
                value = struct.unpack("i", nrf.recv())[0]
                print("received", value)
      `,
      output: `
        received 0
        received 1
        received 3
      `,
      notes: ['The "no acknowledgement" lines of the sender match the counters the receiver misses, which makes a handy range test: walk away with the receiver and watch where they start.']
    }
  ],
  quiz: [
    { q: 'What frequency is nRF24L01 channel 76?', choices: ['2.476 MHz', '2476 MHz', '76 MHz', '2.4 GHz plus 76 kHz'], a: 1, why: 'Channel n sits at 2400 + n MHz, so channel 76 is 2476 MHz, 1 MHz wide.' },
    { q: 'For the longest range, which data rate should you choose?', choices: ['2 Mbit/s', '1 Mbit/s', '250 kbit/s', 'The rate has no effect on range'], a: 2, why: 'The slowest rate gives the best receiver sensitivity: about -94 dBm at 250 kbit/s against about -82 dBm at 2 Mbit/s, a 12 dB advantage.' },
    { q: 'An nRF24L01 module sends packets that an ESP32 running ESP-NOW can receive.', a: false, why: 'The two use different modulations and packet formats. ESP-NOW rides on Wi-Fi frames; the nRF24 sends its own GFSK packets.' },
    { q: 'The library reports "chip not found" on a new module. Which is the most likely cause?', choices: ['The program is in the wrong language', 'A weak or noisy supply, or a wrong CE or CSN pin', 'Channel 76 is not allowed', 'The module needs 5 V'], a: 1, why: 'The module needs a clean 3.3 V supply (a capacitor across its pins) and the right pins. Nothing about the channel affects detecting the chip, and 5 V would damage it.' }
  ],
  applications: [
    'A custom remote control (a drone, a robot, a model) with a low-latency link and a small receiver.',
    'A star of battery sensors talking to one hub on six pipes.',
    'Reviving or replacing nodes in a home-automation network built on nRF24 modules years ago.',
    'A teaching exercise in packet radios, with the whole protocol readable in one data sheet.'
  ],
  sources: [
    'Nordic Semiconductor: nRF24L01+ Single Chip 2.4 GHz Transceiver Product Specification.',
    'The RF24 library documentation (TMRh20) and the micropython-lib nrf24l01 driver.',
    'Your national limits for the 2.4 GHz licence-free band (the band ends at 2.4835 GHz in Europe and North America).'
  ]
},

/* ================================================================ cellular IoT */
{
  id: 'cellular-iot',
  parent: 'long-range-and-other-radios',
  title: 'Cellular: LTE-M, NB-IoT, 4G',
  level: 2,
  short: 'A cellular modem gives an ESP coverage almost everywhere people live, on someone else\'s network. The price is a subscription, bursts of current that break weak supplies, and a modem you talk to in AT commands.',
  keywords: ['cellular', 'LTE-M', 'Cat-M1', 'NB-IoT', 'LTE Cat 1', '4G', 'GSM', 'GPRS', 'SIM7000', 'SIM7600', 'A7670', 'AT commands', 'APN', 'PSM', 'eDRX', 'TinyGSM', 'esp_modem', 'SIM card', 'modem', 'AT+CSQ', 'brownout'],
  prereq: ['uart-on-the-esp', 'current-peaks-and-capacitors', 'lora'],
  related: ['cellular-boards', 'brownout', 'lithium-cells', 'deep-sleep', 'store-and-forward', 'batching-rates-and-cost', 'regulatory-approval', 'choosing-a-long-range-link'],
  body: `A cellular modem gives an ESP the one thing no other radio on these pages does: coverage almost everywhere people live, on infrastructure someone else maintains. In return it costs a subscription, a large current in short bursts, and some weeks of reading AT-command manuals.

### The flavours
**LTE-M** (Cat-M1) reaches up to about 1 Mbit/s, handles moving devices and suits trackers. **NB-IoT** is slower, tens of kilobits a second, reaches deep into buildings and basements, and suits fixed sensors. **LTE Cat 1** gives broadband for a heavier power budget and is the choice where a carrier offers neither of the first two. **2G (GSM/GPRS)** is still a fallback in some modems, but many countries have switched it off. Bands and supported technologies differ by country and by modem variant, so check both before buying. Boards in the catalogue include the LilyGO T-SIM7000G (LTE-M, NB-IoT and 2G, with GNSS and solar charging), the T-A7670X (Cat 1) and the T-SIM7670G-S3.

### The modem is another computer
You talk to it over a UART in **AT commands**, a text protocol standardised by 3GPP (\`AT\`, \`AT+CSQ\`, \`AT+CEREG?\`) with vendor additions. Its own stack can open TCP sockets or run HTTP and MQTT, and libraries such as TinyGSM and the ESP-IDF esp_modem component hide the commands, even presenting the modem as a network interface through PPP. A session goes: power-key pulse, SIM unlocked, network registration, data attach with the operator's APN, then data. \`AT+CSQ\` reports signal as 0 to 31; the power in dBm is -113 + 2n, and 99 means unknown.

### Power is the part that bites
LTE-M and NB-IoT transmit with a few hundred milliamps; the 2G fallback and some Cat 1 modems peak near 2 A for fractions of a millisecond, repeated hundreds of times a second. A USB port, a thin cable or the 3.3 V pin of a dev board cannot supply that: the voltage dips, and the modem or the ESP resets in the middle of registering ([[brownout]]). Give the modem its own supply of about 3.8 V from a lithium cell or a converter rated 2 A or more, with several hundred microfarads of low-resistance capacitance next to the module. The simulation shows the dip. For batteries use PSM and eDRX: the modem sleeps for minutes to hours at microamps while staying registered, and downlinks wait until it wakes.

### Practicalities
You need a SIM and a data plan for IoT use. A product with a cellular module usually needs the carrier's or a certification body's approval. Antennas must suit the LTE bands you use.

> [!warn] A lithium cell needs a charger IC and a protection circuit ([[lithium-cells]]). Never wire a bare cell, or a charger without protection, to a modem.

> [!key] A cellular modem trades a subscription and a high peak current for coverage nearly anywhere. Choose LTE-M for moving things and NB-IoT for fixed ones, feed the modem its own 2 A-capable supply, and use PSM to make a battery last.`,
  ideas: [
    'LTE-M suits moving trackers, NB-IoT slow fixed sensors, Cat 1 heavier traffic; 2G is vanishing in many countries.',
    'The modem is a separate device controlled by AT commands over a UART; libraries hide them but the commands are the truth.',
    'Transmit bursts can reach 2 A, so the modem needs its own supply with a large capacitor next to it.',
    'PSM and eDRX let the modem sleep for hours while registered, at the cost of waiting to be reachable.'
  ],
  pitfalls: [
    'I can power the modem from the dev board\'s 3V3 pin — The regulator cannot give hundreds of milliamps in bursts, let alone 2 A, and the sag resets the board mid-attach.',
    'LTE-M and NB-IoT are the same, and coverage is a given — They are different technologies with different coverage; which ones a carrier offers varies by country and operator. Check before choosing.',
    'A cellular IoT device can be called up at any moment — With PSM the modem is unreachable between its reporting times, and downlinks wait until it wakes.'
  ],
  terms: [
    { term: 'LTE Cat 1', also: ['Cat 1', 'Cat-1', '4G'], def: 'An LTE category with up to about 10 Mbit/s, available wherever LTE is. It uses more power than LTE-M or NB-IoT and suits devices that need real bandwidth, or places where a carrier offers no IoT-specific service.' },
    { term: 'Network registration', also: ['attach', 'CEREG'], def: 'How the modem joins the cellular network: it finds a tower, identifies itself with the SIM and is accepted. AT+CEREG? reports the result: 1 on the home network, 5 when roaming.' },
    { term: 'APN', also: ['access point name'], def: 'The name of the gateway through which a cellular data connection reaches the internet. The operator or plan gives it, and the modem needs it to attach.' },
    { term: 'PSM', also: ['power saving mode', 'eDRX', 'extended DRX'], def: 'Cellular sleep modes in which the modem stays registered but stops listening for long, agreed periods, drawing microamps. eDRX listens in periodic windows; PSM is deaf until the device itself wakes.' }
  ],
  sim: 'lr-cellular',
  choose: {
    good: ['Remote or moving devices with no Wi-Fi or own gateway, reporting every minutes to hours', 'Trackers that must work across a whole country (LTE-M)', 'Sensors in basements or inside buildings where radio reach is poor (NB-IoT)'],
    avoid: ['Places with Wi-Fi or a LoRa gateway you already own', 'Weak supplies: a USB port, a thin lead, an undersized converter', 'Battery nodes that keep the modem awake between reports'],
    check: ['Which technologies and bands the local carriers actually offer, and the modem variant for them', 'The peak current and the supply, with a scope if you can', 'The plan, SIM and certification route if you ship a product']
  },
  code: [
    {
      title: 'Talk to a modem and read the signal',
      about: 'Sends AT commands to a cellular modem over UART1: it checks that the modem answers, that the SIM is ready, and then prints the signal quality in dBm and the registration status every ten seconds.',
      needs: 'An ESP32 DevKit and a cellular modem board with its own supply that can deliver 2 A (never from the DevKit\'s 3V3 pin), a SIM and an antenna. The LilyGO T-SIM7000G and T-A7670X have the modem wired to GPIO26 and GPIO27 and a power key on GPIO4. Many modems start at 115200 baud: check yours, and its logic level.',
      wiring: [['GPIO26 (TX)', 'modem RXD', 'check the modem\'s logic level; many are 1.8 V and need a shifter'], ['GPIO27 (RX)', 'modem TXD'], ['GND', 'modem GND', 'common ground'], ['modem supply', '3.8 V, 2 A', 'its own supply, with a large capacitor at the module; a lithium cell only with a charger and protection circuit']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (115200) baud on TX (26) RX (27)
          print (send AT command [AT])
          print (send AT command [AT+CPIN?])
        forever
          set [reply v] to (send AT command [AT+CSQ])
          set [n v] to (number after [+CSQ:] in (reply))
          if <(n) = (99)> then
            print [signal unknown]
          else
            print (join [signal dBm: ] (((2) * (n)) - (113)))
          end
          print (send AT command [AT+CEREG?])
          wait (10) seconds
        end
      `,
      cpp: String.raw`
        const int MODEM_TX = 26, MODEM_RX = 27;     // ESP32 UART pins: TX to the modem's RXD, RX from its TXD

        String sendAT(const String &cmd, uint32_t timeoutMs) {
          while (Serial1.available()) Serial1.read();         // drop old output
          Serial1.println(cmd);
          String reply;
          uint32_t t0 = millis();
          while (millis() - t0 < timeoutMs) {
            while (Serial1.available()) reply += (char)Serial1.read();
            if (reply.endsWith("OK\r\n") || reply.indexOf("ERROR") >= 0) break;
          }
          return reply;
        }

        void setup() {
          Serial.begin(115200);
          Serial1.begin(115200, SERIAL_8N1, MODEM_RX, MODEM_TX);    // order: baud, config, RX, TX
          Serial.println(sendAT("AT", 2000));         // OK when the modem is awake
          Serial.println(sendAT("AT+CPIN?", 2000));   // +CPIN: READY when the SIM is unlocked
        }

        void loop() {
          String r = sendAT("AT+CSQ", 2000);          // +CSQ: <n>,<ber>
          int i = r.indexOf("+CSQ:");
          if (i >= 0) {
            int n = r.substring(i + 5).toInt();       // 0 to 31, or 99 for unknown
            if (n == 99) Serial.println("signal unknown");
            else Serial.printf("signal dBm: %d\n", -113 + 2 * n);
          }
          Serial.println(sendAT("AT+CEREG?", 2000));  // +CEREG: 0,1 home network, 0,5 roaming
          delay(10000);
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        modem = UART(1, baudrate=115200, tx=26, rx=27)       # TX to the modem's RXD, RX from its TXD

        def send_at(cmd, timeout_ms=2000):
            while modem.any():
                modem.read()                                  # drop old output
            modem.write(cmd + "\r\n")
            reply = b""
            t0 = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), t0) < timeout_ms:
                if modem.any():
                    reply += modem.read()
                if reply.endswith(b"OK\r\n") or b"ERROR" in reply:
                    break
            return reply.decode()

        print(send_at("AT"))                                  # OK when the modem is awake
        print(send_at("AT+CPIN?"))                            # +CPIN: READY when the SIM is unlocked
        while True:
            r = send_at("AT+CSQ")                             # +CSQ: <n>,<ber>
            if "+CSQ:" in r:
                n = int(r.split("+CSQ:")[1].split(",")[0])    # 0 to 31, or 99 for unknown
                print("signal unknown" if n == 99 else "signal dBm: %d" % (-113 + 2 * n))
            print(send_at("AT+CEREG?"))                       # +CEREG: 0,1 home network, 0,5 roaming
            time.sleep(10)
      `,
      output: `
        AT
        OK
        +CPIN: READY
        signal dBm: -77
        +CEREG: 0,1
      `,
      notes: ['Commands and replies vary a little between modules: the module\'s AT command manual is the reference, and 3GPP defines the common ones. Some modems need a power-key pulse of about a second before they answer.', 'AT+CEREG? is the registration status on LTE; older networks use AT+CREG? and AT+CGREG?. Status 1 is registered on the home network and 5 is registered while roaming.']
    }
  ],
  quiz: [
    { q: 'The modem answers "+CSQ: 18,99". What is the signal in dBm?', choices: ['-18 dBm', '-77 dBm', '-95 dBm', 'Unknown, because of the 99'], a: 1, why: 'The first number is the signal index n = 18, and dBm = -113 + 2n = -77. The 99 is the bit-error figure, which is unknown here and does not make the signal unknown.' },
    { q: 'A modem board on the ESP32 DevKit\'s 3V3 pin keeps rebooting when it registers on the network. Why?', choices: ['The SIM is faulty', 'The supply sags under the modem\'s current bursts and the board browns out', 'The ESP32 cannot talk to modems', 'The antenna is too short'], a: 1, why: 'Registration means the highest transmit power, in bursts of hundreds of milliamps up to 2 A. A weak supply dips below the brown-out threshold and resets.' },
    { q: 'A modem in PSM can receive a command at any moment, as long as it is registered.', a: false, why: 'In PSM the modem stays registered but does not listen. Anything sent to it waits until the device wakes at its next agreed time.' },
    { q: 'A tracker that moves between towns and reports every ten minutes. Which standard fits best?', choices: ['NB-IoT, because it is the most sensitive', 'LTE-M, which supports moving devices', 'Bluetooth LE', '2G, because it is the oldest'], a: 1, why: 'LTE-M supports mobility and handover between cells, which NB-IoT is not designed for. NB-IoT suits fixed sensors; 2G is being switched off in many countries.' }
  ],
  applications: [
    'Vehicle and asset trackers, with a GNSS receiver and LTE-M.',
    'Water-tank, pump and flood sensors at remote sites with no Wi-Fi.',
    'Smart meters and vending machines on NB-IoT or Cat 1.',
    'Solar-powered weather or environment stations that report over a mobile network.'
  ],
  sources: [
    '3GPP TS 27.007: AT command set for User Equipment, and your modem\'s AT command manual.',
    'The module data sheet for its power supply, peak current and bands (for example the SIMCom SIM7000 or A7670 series).',
    'The ESP-IDF Programming Guide (esp_modem component) and the TinyGSM library documentation.'
  ]
},

/* ================================================================ ultra-wideband */
{
  id: 'uwb-ranging',
  parent: 'long-range-and-other-radios',
  title: 'Ultra-wideband ranging',
  level: 3,
  short: 'Ultra-wideband measures distance, not just messages: the radios time how long very short pulses take to fly, and since light covers 30 cm in a nanosecond, centimetres become readable. How two-way ranging works and why clocks are the catch.',
  keywords: ['UWB', 'ultra-wideband', 'DW1000', 'DW3000', 'time of flight', 'ToF', 'two-way ranging', 'TWR', 'SS-TWR', 'DS-TWR', 'anchor', 'tag', 'trilateration', 'TDoA', 'indoor positioning', 'IEEE 802.15.4z', 'Qorvo', 'MaUWB', 'RTLS'],
  prereq: ['radio-basics', 'ieee-802-15-4', 'crystals-and-clocks'],
  related: ['gnss-receivers', 'rssi-and-signal-quality', 'wifi-sensing-and-ftm', 'choosing-a-long-range-link', 'ble-beacons'],
  body: `UWB measures distance, not just messages. Two UWB radios swap short pulses and time how long the waves take to fly. Light travels 30 cm in a nanosecond, so a clock that can tell time to a fraction of a nanosecond can tell distance to centimetres. That is how tags that find your keys, digital car keys and indoor tracking systems place something within about ten centimetres, where the signal strength of Wi-Fi or Bluetooth gives metres at best.

### What UWB is
The pulses last about two nanoseconds, so the signal is at least 500 MHz wide, centred in the 6.5 GHz or 8 GHz regions (channels 5 and 9 on the DW3000 family), at a power density so low that it passes unnoticed by other radios. IEEE 802.15.4z defines the physical layer, including a scrambled form that makes ranging harder to spoof. The Qorvo (formerly Decawave) DW1000 and DW3000 are the best-known chips. No ESP chip has UWB, so it arrives as a module: the Makerfabs MaUWB boards in the catalogue pair a DW3000 with an STM32 that does the radio timing, and the ESP32-S3 on the same board only sends it AT commands.

### Two-way ranging
Two radios' clocks are not synchronised, so one-way travel times mean nothing. Instead A sends a *poll*, B answers after a **reply delay**, and A measures the whole round trip. Subtracting B's reply delay leaves twice the flight time: $d = c\\,(T_{\\mathrm{round}} - T_{\\mathrm{reply}})/2$.

The catch is the clocks. B measures its reply delay on its own crystal, A the round trip on another, and they differ by up to some tens of parts per million. The error in the single-sided scheme is about $c \\, T_{\\mathrm{reply}} \\cdot \\mathrm{offset} / 2$: with a 300 µs reply and 20 ppm it is 0.9 m, enough to ruin everything. **Double-sided** ranging adds a third message and combines two round trips so that the clock error cancels to first order. The program below does that arithmetic on 40-bit timestamps that tick every 15.65 ps and wrap every 17.2 seconds.

### From distances to positions
Distances to three fixed **anchors** fix a tag in a plane, four in space (trilateration). Another scheme has the tag only transmit and synchronised anchors compare arrival times (TDoA), which lets hundreds of tags share a system. Bodies and walls delay the signal, so errors are almost always too long.

### Practicalities
UWB is licence-free in most major markets, in different bands and with different rules; check yours. Receiving costs tens to over a hundred milliamps, so battery tags range rarely. Tracking people needs their consent.

> [!key] UWB turns time of flight into centimetres, using two-way ranging whose clock error cancels in the double-sided form. The ESP gets it through a module, and clocks, not radio reach, set the accuracy.`,
  ideas: [
    'UWB pulses are so short that arrival times, and so distances, can be read to centimetres: 1 ns is 30 cm.',
    'Two-way ranging needs no shared clock: round-trip time minus the other side\'s reply delay is twice the flight time.',
    'Clock offset between the two radios turns a long reply delay into metres of error in single-sided ranging; double-sided ranging cancels it.',
    'Positions come from distances to three or four anchors, and non-line-of-sight paths bias distances long.'
  ],
  pitfalls: [
    'UWB is "Bluetooth with better range" — It is a different radio whose strength is timing, not range or data rate; a typical link reaches tens of metres and sends tiny messages.',
    'Single-sided ranging is fine if the reply is quick — The error is proportional to the reply delay times the clock offset, so even 100 µs and 20 ppm gives 0.3 m. Double-sided ranging, or a short and calibrated reply, is the answer.',
    'A UWB tag works through anything — Walls and bodies add delay and bend the path, so the measured distance is too long; accuracy of ten centimetres holds only with a clear line of sight.'
  ],
  terms: [
    { term: 'Ultra-wideband', also: ['UWB'], def: 'A radio that uses extremely short pulses and a bandwidth of at least 500 MHz, at very low power density. Its timing resolution lets it measure distance to centimetres.' },
    { term: 'Two-way ranging', also: ['TWR', 'SS-TWR', 'DS-TWR'], def: 'Finding a distance from the round-trip time of a message and its answer. Single-sided uses two messages; double-sided uses three so that clock errors cancel.' },
    { term: 'Anchor', also: ['tag', 'beacon'], def: 'A UWB radio at a known fixed position. A tag, the thing being located, ranges to several anchors to find where it is.' },
    { term: 'Trilateration', also: ['multilateration'], def: 'Finding a position from its distances to known points: three anchors in a plane, four in space.' },
    { term: 'TDoA', also: ['time difference of arrival'], def: 'Locating a tag from the differences in the times at which several synchronised anchors receive its one transmission. It needs no replies from the tag, so it scales to many tags.' }
  ],
  sim: 'lr-uwb',
  formulas: [
    {
      name: 'Distance from a two-way exchange',
      expr: 'd = c*(Tr - Tp)/2',
      tex: 'd = \\frac{c\\,(T_r - T_p)}{2}',
      vars: {
        d: { name: 'distance', q: 'length', unit: 'm', tex: 'd' },
        c: { const: 'c' },
        Tr: { name: 'round trip measured by the initiator', q: 'time', unit: 'µs', value: 300.0334, tex: 'T_r' },
        Tp: { name: 'reply delay of the responder', q: 'time', unit: 'µs', value: 300, tex: 'T_p' }
      },
      solveFor: 'd',
      note: 'Single-sided two-way ranging, assuming both clocks are perfect. Real timestamps are in device ticks of about 15.65 ps.',
      stories: { d: 'The initiator measures {Tr} from its poll to the response; the responder says it waited {Tp}. How far apart are they?' }
    },
    {
      name: 'Error from the clock offset in single-sided ranging',
      expr: 'dd = c*Tp*off/2',
      tex: '\\Delta d = \\frac{c\\, T_p\\, \\mathrm{off}}{2}',
      vars: {
        dd: { name: 'distance error', q: 'length', unit: 'm', signed: true, tex: '\\Delta d' },
        c: { const: 'c' },
        Tp: { name: 'reply delay', q: 'time', unit: 'µs', value: 300, tex: 'T_p' },
        off: { name: 'clock offset between the two devices', q: 'ratio', unit: 'ppm', value: 20, signed: true, tex: '\\mathrm{off}' }
      },
      solveFor: 'dd',
      note: 'The two radios\' crystals differ by up to about the sum of their tolerances, often 10 to 40 ppm. Double-sided ranging cancels most of this.',
      stories: { dd: 'A single-sided exchange has a reply delay of {Tp} and the two clocks differ by {off}. How large is the distance error?' }
    }
  ],
  examples: [
    {
      title: 'The error of a lazy reply',
      q: 'Two devices are 5 m apart and range with single-sided two-way ranging. The responder takes 300 µs to reply, and its clock runs 20 ppm fast relative to the initiator. How wrong is the distance?',
      steps: ['The flight time is $5 / 3 \\times 10^8 = 16.7$ ns, so the round trip is $300\\,\\mu\\mathrm{s} + 33.4$ ns.', 'The clock offset acts on the long reply delay: $300\\,\\mu\\mathrm{s} \\times 20\\ \\mathrm{ppm} = 6$ ns of timing error.', 'Half of it is counted: 3 ns, or $c \\times 3\\ \\mathrm{ns} \\approx 0.9$ m.'],
      a: 'About 0.9 m, nearly a fifth of the distance, from a mismatch that is perfectly normal for crystals. Double-sided ranging brings the same exchange to millimetres.'
    }
  ],
  choose: {
    good: ['Centimetre-level positioning of tags and robots indoors with fixed anchors', 'Secure distance bounding (digital keys, access) where a relay attack must fail', 'Ranging where Wi-Fi or Bluetooth signal strength is far too coarse'],
    avoid: ['Carrying data or covering long distances', 'Battery tags that must range several times a second', 'Positions where bodies and metal block the line of sight and nothing can be done about it'],
    check: ['That UWB is allowed in your country and in which bands', 'Antenna-delay calibration of every board', 'The anchors\' geometry and line of sight to the tags']
  },
  code: [
    {
      title: 'From six timestamps to a distance',
      about: 'The arithmetic of double-sided two-way ranging: six timestamps from one exchange of three messages, taken on two unrelated clocks, are turned into a flight time and a distance. The timestamps are 40-bit and wrap, which the subtraction handles.',
      needs: 'Any ESP32-family board and the serial monitor. A real system takes the timestamps from the UWB chip\'s registers or from the module\'s answers; here they are fixed numbers, made for a distance of about 5 m.',
      blocks: `
        define elapsed (later) (earlier) :: my
          set [diff v] to (((later) - (earlier)) mod (2 ^ 40))

        when started
          start serial at (115200) baud
          elapsed (A resp rx) (A poll tx) :: my
          set [Ra v] to (diff)
          elapsed (A final tx) (A resp rx) :: my
          set [Da v] to (diff)
          elapsed (B final rx) (B resp tx) :: my
          set [Rb v] to (diff)
          elapsed (B resp tx) (B poll rx) :: my
          set [Db v] to (diff)
          set [tof v] to ((((Ra) * (Rb)) - ((Da) * (Db))) / ((Ra) + (Rb) + (Da) + (Db)))
          print (join [distance m: ] ((tof) * (1.565e-11) * (299792458)))
      `,
      cpp: String.raw`
        const uint64_t MASK40 = (1ULL << 40) - 1;          // timestamps are 40 bits wide: they wrap every 17.2 s
        const double TICK_S = 1.0 / (499.2e6 * 128);       // one device time unit: about 15.65 ps
        const double C = 299792458.0;                      // metres per second

        // the six timestamps of one exchange, in device time units
        const uint64_t A_POLL_TX = 1099494000000ULL, A_RESP_RX = 1542356ULL, A_FINAL_TX = 20742356ULL;      // the initiator's clock
        const uint64_t B_POLL_RX = 499982373290ULL, B_RESP_TX = 500001541290ULL, B_FINAL_RX = 500020743422ULL;  // the responder's clock

        uint64_t elapsed(uint64_t later, uint64_t earlier) {
          return (later - earlier) & MASK40;               // correct across the wrap
        }

        void setup() {
          Serial.begin(115200);
          int64_t Ra = elapsed(A_RESP_RX, A_POLL_TX);      // initiator: poll sent to response received
          int64_t Da = elapsed(A_FINAL_TX, A_RESP_RX);     // initiator: response received to final sent
          int64_t Rb = elapsed(B_FINAL_RX, B_RESP_TX);     // responder: response sent to final received
          int64_t Db = elapsed(B_RESP_TX, B_POLL_RX);      // responder: poll received to response sent
          double tof = (double)(Ra * Rb - Da * Db) / (double)(Ra + Rb + Da + Db);    // in time units
          Serial.printf("time of flight %.0f ticks = %.2f ns\n", tof, tof * TICK_S * 1e9);
          Serial.printf("distance %.2f m\n", tof * TICK_S * C);
        }

        void loop() {}
      `,
      py: String.raw`
        MASK40 = (1 << 40) - 1                             # timestamps are 40 bits wide: they wrap every 17.2 s
        TICK_S = 1 / (499.2e6 * 128)                       # one device time unit: about 15.65 ps
        C = 299792458                                      # metres per second

        # the six timestamps of one exchange, in device time units
        A_POLL_TX, A_RESP_RX, A_FINAL_TX = 1099494000000, 1542356, 20742356                  # the initiator's clock
        B_POLL_RX, B_RESP_TX, B_FINAL_RX = 499982373290, 500001541290, 500020743422          # the responder's clock

        def elapsed(later, earlier):
            return (later - earlier) & MASK40              # correct across the wrap

        Ra = elapsed(A_RESP_RX, A_POLL_TX)                 # initiator: poll sent to response received
        Da = elapsed(A_FINAL_TX, A_RESP_RX)                # initiator: response received to final sent
        Rb = elapsed(B_FINAL_RX, B_RESP_TX)                # responder: response sent to final received
        Db = elapsed(B_RESP_TX, B_POLL_RX)                 # responder: poll received to response sent
        tof = (Ra * Rb - Da * Db) / (Ra + Rb + Da + Db)    # in time units
        print("time of flight %.0f ticks = %.2f ns" % (tof, tof * TICK_S * 1e9))
        print("distance %.2f m" % (tof * TICK_S * C))
      `,
      output: `
        time of flight 1066 ticks = 16.68 ns
        distance 5.00 m
      `,
      notes: ['The responder\'s clock is 500 billion ticks ahead of the initiator\'s: the two clocks need not agree on the time, only on the length of a second, and the double-sided formula forgives most of that.', 'A real ranging adds a calibration for the antenna delay of each board, measured at a known distance.']
    }
  ],
  quiz: [
    { q: 'How far does a radio wave travel in one nanosecond?', choices: ['3 mm', '30 cm', '3 m', '30 m'], a: 1, why: 'The speed of light is about $3 \\times 10^8$ m/s, which is 0.3 m per nanosecond. A ranging chip that resolves 0.3 ns resolves 10 cm.' },
    { q: 'Single-sided two-way ranging: the reply delay is 100 µs and the clocks differ by 20 ppm. About what distance error results?', choices: ['3 mm', '0.3 m', '3 m', 'None, the delay is subtracted'], a: 1, why: 'The error is $c\\,T_p \\cdot \\mathrm{off}/2 = 3 \\times 10^8 \\times 100\\,\\mu\\mathrm{s} \\times 20\\,\\mathrm{ppm}/2 \\approx 0.3$ m. The delay is subtracted, but it is measured with a different clock.' },
    { q: 'A UWB distance measured through a wall comes out shorter than the true distance.', a: false, why: 'Materials slow the wave and may bend the path, so the signal arrives later and the measured distance is too long. Errors from non-line-of-sight paths are nearly always positive.' },
    { q: 'What does the double-sided scheme add to the single-sided one?', choices: ['A stronger signal', 'A third message, so that two round trips can be combined and clock errors cancel', 'A GPS receiver', 'A second antenna'], a: 1, why: 'With a final message, each side measures a round trip and a reply delay, and the formula combines the two so that the effect of each clock\'s rate error cancels to first order.' }
  ],
  applications: [
    'Indoor positioning of tags on tools, trolleys or people in warehouses, with anchors on the walls.',
    'Robots and drones that find a docking station or follow a person by ranging to a tag.',
    'Digital car and door keys that measure the distance of the phone, so a relayed signal cannot open the lock.',
    'Item finders: phone to tag distance and direction.'
  ],
  sources: [
    'IEEE 802.15.4z: enhanced ultra-wideband physical layers.',
    'Qorvo (Decawave): DW1000 and DW3000 data sheets and user manuals, including the ranging and antenna-delay sections.',
    'The manufacturer\'s documentation for the module used, such as the Makerfabs MaUWB AT command guide.'
  ]
},

/* ================================================================ infrared links */
{
  id: 'infrared-links',
  parent: 'long-range-and-other-radios',
  title: 'Infrared links',
  level: 1,
  short: 'The remote control\'s LED is the oldest wireless link in the house: line of sight, a few metres, no licence. How a 38 kHz carrier and bursts of light carry a code, and how an ESP sends and reads it.',
  keywords: ['infrared', 'IR', 'remote control', 'NEC protocol', '38 kHz', 'carrier', 'TSOP', 'VS1838B', 'IR LED', '940 nm', 'IRremote', 'IRremoteESP8266', 'RC5', 'Sony SIRC', 'air conditioner', 'mark and space', 'raw capture'],
  prereq: ['pwm-with-ledc', 'transistor-as-a-switch', 'leds'],
  related: ['infrared-remotes', 'infrared-transmitters', 'the-rmt-peripheral', 'pulse-counting', 'choosing-a-long-range-link', 'measuring-frequency-and-time'],
  body: `A remote control's LED is the oldest wireless link in the house, and it still earns its place: it needs line of sight, reaches a few metres, costs almost nothing and is untouched by radio rules. An ESP can send the codes of a television, a fan or an air conditioner, and read the codes of a remote you own.

### How a remote talks
An infrared LED (940 nm: invisible to the eye, but a phone camera shows it) is switched in short bursts. To stand out from sunlight and lamps the LED does not simply light: during a burst it flickers at a **carrier**, usually 38 kHz. The receiver module (a TSOP or VS1838B type) holds a photodiode, a filter tuned to the carrier and a demodulator, and gives a clean logic level: high at rest, low while a burst is present. All the information is in the **lengths of the bursts and spaces**. The LED side is treated in [[infrared-transmitters]] and the buttons in [[infrared-remotes]].

### The NEC format
| Part | Burst | Space |
|---|---|---|
| Leader | 9 ms | 4.5 ms |
| Bit 0 | 560 µs | 560 µs |
| Bit 1 | 560 µs | 1690 µs |
| Closing burst | 560 µs | |

After the leader come 32 bits, least significant bit first: the address, its inverse, the command and its inverse. The inverses let the receiver check the frame, and they make every frame the same length: half of the 32 bits are always 1s, so any code takes about 68 ms. Holding the key repeats a short code every 108 ms. Sony's format (40 kHz) and RC5 (36 kHz) are different, and air-conditioner remotes send frames of a hundred bits or more that describe the whole setting, which is why they are usually captured raw. The IRremote and IRremoteESP8266 libraries know dozens of formats.

### On the ESP
To send, a PWM pin makes the 38 kHz carrier and the program switches it on and off for each burst; the RMT peripheral ([[the-rmt-peripheral]]) can do carrier and timing in hardware. The LED wants 30 to 100 mA while on, more than a pin should give, so a transistor drives it. To receive, the module's output goes to a GPIO and the program measures pulse widths.

### Limits
A few metres, in the direction the LED points; many LEDs or a wide-angle lens widen it. Sunlight and some lamps interfere, glass passes it but walls do not, and the link is one-way, with no confirmation that the device obeyed.

> [!key] An IR remote sends a code as bursts of a 38 kHz carrier whose lengths carry the bits: in the NEC format a 9 ms leader, then 32 bits as short or long spaces. An ESP makes the carrier with PWM, drives the LED through a transistor, and reads the module's demodulated output as pulse widths.`,
  ideas: [
    'The LED flickers at a carrier (usually 38 kHz) so the receiver can ignore sunlight; the information is in burst and space lengths.',
    'In the NEC format a 9 ms burst and 4.5 ms space start a frame of 32 bits: address, its inverse, command, its inverse.',
    'The receiver module outputs a clean logic level, low during a burst, so reading a remote is just measuring pulse widths.',
    'The LED needs a transistor, and the link needs line of sight within a few metres.'
  ],
  pitfalls: [
    'The IR LED can be driven straight from a GPIO — A useful IR burst needs 30 to 100 mA, beyond what a pin should deliver. Drive the LED through a transistor.',
    'Any IR receiver reads any remote — The filter in the module is tuned to one carrier: a 38 kHz module has poor sensitivity to a 56 kHz remote, and a bare photodiode without a module cannot reject sunlight.',
    'Every remote uses the NEC format — NEC is one of many. Sony, RC5, Samsung and the air-conditioner makers each have their own timing, and a decoder written for one prints nonsense for the others.'
  ],
  terms: [
    { term: 'Demodulated output', also: ['OUT', 'receiver output'], def: 'The clean logic signal a receiver module produces after removing the carrier: high at rest, low while a burst is present. Reading a remote means measuring the lengths of its highs and lows.' },
    { term: 'Extended NEC', also: ['16-bit address NEC'], def: 'A variant of the NEC format with a 16-bit address and no inverse byte after it. The frame is the same length, but a decoder that checks for the inverse byte rejects it.' },
    { term: 'Raw capture', also: ['raw timings'], def: 'Recording the lengths of every mark and space of a remote\'s signal, to be replayed as they are, for formats no library understands.' }
  ],
  sim: 'lr-ir',
  choose: {
    good: ['Controlling the TV, fan or air conditioner you own from an ESP, with the LED aimed at it', 'A cheap one-way trigger within a room', 'Reading a spare remote as a set of buttons for a project'],
    avoid: ['Anything that must work through walls or without aiming', 'Sunlit places, where the receiver may be blinded', 'A bare LED on a GPIO instead of a transistor'],
    check: ['The carrier frequency of the receiver module against the remote', 'The LED current and the transistor', 'The protocol: NEC, Sony, RC5 or raw']
  },
  code: [
    {
      title: 'Send an NEC code',
      about: 'Sends the NEC code with address 0x00 and command 0x45 every two seconds. A PWM pin makes the 38 kHz carrier at one third duty and the program switches it on for each mark.',
      needs: 'An ESP32 DevKit, an IR LED (940 nm), an NPN transistor such as a BC337 or 2N2222, a 1 kΩ and a 56 Ω resistor. Point the LED at a receiver module or a TV you can teach the code to.',
      wiring: [['GPIO4', '1 kΩ → transistor base'], ['3V3', 'IR LED anode', 'with a 56 Ω resistor in series: about 30 mA while on'], ['transistor collector', 'IR LED cathode'], ['transistor emitter', 'GND']],
      blocks: `
        define mark (us) :: my
          set PWM on pin (4) to (85)
          wait ((us) / (1000000)) seconds

        define space (us) :: my
          set PWM on pin (4) to (0)
          wait ((us) / (1000000)) seconds

        define send NEC (address) (command) :: my
          mark (9000) :: my
          space (4500) :: my
          for each [bit v] in (the 32 bits of (address, not address, command, not command), lowest first)
            mark (560) :: my
            if <(bit) = (1)> then
              space (1690) :: my
            else
              space (560) :: my
            end
          end
          mark (560) :: my
          space (0) :: my

        when started
          set PWM on pin (4) frequency (38000) resolution (8)
        forever
          send NEC (0) (69) :: my
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int IR_PIN = 4;             // to the transistor that drives the IR LED
        const int FREQ = 38000;           // carrier, Hz

        void mark(unsigned int us)  { ledcWrite(IR_PIN, 85); delayMicroseconds(us); }   // carrier on: 85/255 = a third
        void space(unsigned int us) { ledcWrite(IR_PIN, 0);  delayMicroseconds(us); }   // carrier off

        void sendNEC(uint8_t addr, uint8_t cmd) {
          uint32_t code = addr | ((uint32_t)(uint8_t)~addr << 8) | ((uint32_t)cmd << 16) | ((uint32_t)(uint8_t)~cmd << 24);
          mark(9000); space(4500);                        // leader
          for (int i = 0; i < 32; i++) {                  // least significant bit first
            mark(560);
            space((code >> i) & 1 ? 1690 : 560);
          }
          mark(560);                                      // closing burst
          space(0);
        }

        void setup() {
          ledcAttach(IR_PIN, FREQ, 8);                    // 38 kHz, 8 bits
          ledcWrite(IR_PIN, 0);
        }

        void loop() {
          sendNEC(0x00, 0x45);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        pwm = PWM(Pin(4), freq=38000, duty_u16=0)         # the 38 kHz carrier, off for now

        def mark(us):                                     # carrier on: a third duty
            pwm.duty_u16(21845)
            time.sleep_us(us)

        def space(us):                                    # carrier off
            pwm.duty_u16(0)
            time.sleep_us(us)

        def send_nec(addr, cmd):
            code = addr | ((~addr & 0xFF) << 8) | (cmd << 16) | ((~cmd & 0xFF) << 24)
            mark(9000); space(4500)                       # leader
            for i in range(32):                           # least significant bit first
                mark(560)
                space(1690 if (code >> i) & 1 else 560)
            mark(560)                                     # closing burst
            space(0)

        while True:
            send_nec(0x00, 0x45)
            time.sleep(2)
      `,
      notes: ['A phone camera shows the LED flashing, which is the quickest test that something is transmitted.', 'delayMicroseconds and sleep_us are accurate to some microseconds, which receivers tolerate. The RMT peripheral does the timing and carrier in hardware.']
    },
    {
      title: 'Read and decode an NEC remote',
      about: 'Waits for the 9 ms leader of an NEC remote, reads the 32 bits from the receiver module\'s output as pulse widths, checks the inverse bytes and prints the address and command.',
      needs: 'An ESP32 DevKit and an IR receiver module (VS1838B or TSOP38238 type) on 3.3 V, and a remote that uses the NEC format.',
      wiring: [['GPIO27', 'receiver OUT', 'high at rest, low during a burst'], ['3V3', 'receiver VCC'], ['GND', 'receiver GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input v]
        forever
          set [leader v] to (low pulse length on pin (27) in µs) :: pins
          if <<(leader) > (8000)> and <(leader) < (10000)>> then
            set [space v] to (high pulse length on pin (27) in µs) :: pins
            if <<(space) > (3500)> and <(space) < (5500)>> then
              set [code v] to (0)
              for each [i v] in (list of 0 to 31)
                low pulse length on pin (27) in µs :: pins
                if <(high pulse length on pin (27) in µs) > (1100)> then
                  set bit (i) of [code v] :: my
                end
              end
              print (join [address ] (code AND 255) [ command ] ((code >> 16) AND 255))
            end
          end
        end
      `,
      cpp: String.raw`
        const int IR_PIN = 27;     // OUT of the IR receiver module: high at rest, low during a burst

        void setup() {
          Serial.begin(115200);
          pinMode(IR_PIN, INPUT);
        }

        void loop() {
          unsigned long leader = pulseIn(IR_PIN, LOW, 200000);        // the 9 ms burst
          if (leader < 8000 || leader > 10000) return;
          unsigned long space = pulseIn(IR_PIN, HIGH, 7000);          // the 4.5 ms space
          if (space < 3500 || space > 5500) return;
          uint32_t code = 0;
          for (int i = 0; i < 32; i++) {
            pulseIn(IR_PIN, LOW, 3000);                               // the 560 us burst that opens every bit
            unsigned long gap = pulseIn(IR_PIN, HIGH, 3000);          // short space = 0, long space = 1
            if (gap > 1100) code |= 1UL << i;                         // least significant bit first
          }
          uint8_t addr = code & 0xFF, naddr = (code >> 8) & 0xFF;
          uint8_t cmd = (code >> 16) & 0xFF, ncmd = (code >> 24) & 0xFF;
          bool valid = (uint8_t)~addr == naddr && (uint8_t)~cmd == ncmd;
          Serial.printf("address 0x%02X command 0x%02X%s\n", addr, cmd, valid ? "" : "  (check bytes do not match)");
        }
      `,
      py: String.raw`
        from machine import Pin, time_pulse_us

        ir = Pin(27, Pin.IN)       # OUT of the IR receiver module: high at rest, low during a burst

        while True:
            leader = time_pulse_us(ir, 0, 200000)                     # the 9 ms burst
            if not 8000 < leader < 10000:
                continue
            space = time_pulse_us(ir, 1, 7000)                        # the 4.5 ms space
            if not 3500 < space < 5500:
                continue
            code = 0
            for i in range(32):
                time_pulse_us(ir, 0, 3000)                            # the 560 us burst that opens every bit
                gap = time_pulse_us(ir, 1, 3000)                      # short space = 0, long space = 1
                if gap > 1100:
                    code |= 1 << i                                    # least significant bit first
            addr, naddr = code & 0xFF, (code >> 8) & 0xFF
            cmd, ncmd = (code >> 16) & 0xFF, (code >> 24) & 0xFF
            valid = (~addr & 0xFF) == naddr and (~cmd & 0xFF) == ncmd
            print("address 0x%02X command 0x%02X%s" % (addr, cmd, "" if valid else "  (check bytes do not match)"))
      `,
      output: `
        address 0x00 command 0x45
        address 0x00 command 0x46
      `,
      notes: ['A held key sends repeat frames (a 9 ms burst, 2.25 ms space, one short burst) that this decoder ignores. For other formats use IRremote or IRremoteESP8266, or record raw timings.', 'Extended NEC remotes use a 16-bit address with no inverse: the check bytes then fail although the frame is fine.']
    }
  ],
  quiz: [
    { q: 'Why does a remote control flicker its LED at 38 kHz during a burst instead of simply lighting it?', choices: ['To save battery', 'So that the receiver can tell it from sunlight and lamps, which are steady or slow', 'Because LEDs cannot stay on', 'To carry a second data channel'], a: 1, why: 'The receiver module is tuned to the carrier and ignores light that does not flicker at it. A steady burst would be lost in ambient light.' },
    { q: 'An NEC frame carries command 0x45. What is the next byte on the wire?', choices: ['0x45 again', '0xBA, the inverse', '0x00', '0x54, the bits reversed'], a: 1, why: 'Each of the address and the command is followed by its bitwise inverse so that the receiver can check the frame: the inverse of 0x45 is 0xBA.' },
    { q: 'The IR receiver module\'s output is low while a burst is received and high otherwise.', a: true, why: 'The module inverts: the demodulated carrier pulls the output low. A decoder therefore measures low pulses as marks and high pulses as spaces.' },
    { q: 'A 56 Ω resistor and a transistor drive the LED from 3.3 V at about 30 mA. Why not connect the LED to a GPIO through the resistor?', choices: ['The LED would be too bright', 'A pin is not meant to supply that much current for a whole burst; the transistor carries it', 'The carrier would not pass', 'There is no reason'], a: 1, why: 'The ESP32 pins are specified for far less continuous current than a bright IR burst needs. The transistor switches the LED current from the supply, and the pin supplies only the small base current.' }
  ],
  applications: [
    'A hub that controls the television, soundbar and air conditioner from a phone or a voice assistant.',
    'Turning a spare remote into the button panel of a project, with codes decoded as inputs.',
    'An IR break-beam or proximity trigger, with a modulated LED and a matching receiver.',
    'Recording the raw signal of an old device and replaying it from a schedule.'
  ],
  sources: [
    'The data sheet of the IR receiver module (for example Vishay TSOP38238) for the carrier and the output behaviour.',
    'The documentation of the IRremote and IRremoteESP8266 libraries, which list the supported formats and their timings.',
    'ESP-IDF Programming Guide: the RMT peripheral and its carrier modulation.'
  ]
},

/* ================================================================ choosing */
{
  id: 'choosing-a-long-range-link',
  parent: 'long-range-and-other-radios',
  title: 'Choosing a long-range link',
  level: 2,
  short: 'Range, data rate, power, who runs the network, and the rules: ten links side by side, and the five questions that pick between them.',
  keywords: ['choosing', 'comparison', 'range', 'data rate', 'LoRa', 'LoRaWAN', 'cellular', 'Wi-Fi', 'ESP-NOW', 'nRF24', 'Meshtastic', 'UWB', 'infrared', 'link budget', 'service cost', 'licence', 'battery'],
  prereq: ['lora', 'lorawan', 'cellular-iot', 'sub-ghz-radios'],
  related: ['meshtastic', 'nrf24', 'uwb-ranging', 'infrared-links', 'esp-now', 'wifi-long-range-mode', 'choosing-a-smart-home-radio', 'project-lora-field-sensor', 'link-budget'],
  body: `The right link is the one whose range, data rate, power draw and running costs fit the job, and whose rules you can live with. Wireless choices fail in a predictable way: someone picks the radio first and finds out later about the duty cycle, the subscription or the battery.

### Ten links side by side
| Link | Range | Data rate | Power | Service | Rules |
|---|---|---|---|---|---|
| Wi-Fi 2.4 GHz | tens of metres indoors | Mbit/s | hundreds of mA in bursts | your own router | licence-free band |
| ESP-NOW | hundreds of metres in the open | 1 Mbit/s by default, more if set | as Wi-Fi bursts | none | licence-free band |
| nRF24L01+ | tens to a hundred metres | 0.25 to 2 Mbit/s | about 12 mA | none | licence-free band |
| 433 / 868 MHz FSK, OOK | hundreds of metres | 1 to 100 kbit/s | 10 to 40 mA sending | none | power, duty cycle |
| LoRa, point to point | 1 to 15 km | 0.3 to 5.5 kbit/s | tens of mA sending, µA asleep | none | duty cycle |
| LoRaWAN | the same, via gateways | the same | the same | free community or paid operator | plus fair use |
| Meshtastic | km per hop, several hops | about 1 kbit/s | the same | none | region rules |
| Cellular IoT | wherever the carrier covers | tens of kbit/s to 1 Mbit/s | 100 mA to 2 A bursts | SIM subscription | licensed spectrum, certification |
| UWB | 10 to 50 m | ranging first | tens to 100+ mA receiving | none | by country |
| Infrared | 3 to 10 m in sight | kbit/s | 30 to 100 mA pulsed | none | none |

These are typical open-air or indoor figures; walls, antennas and settings move them by factors of several.

### Five questions
1. **How far, through what?** Metres in a room point to Wi-Fi, ESP-NOW or infrared; hundreds of metres to ESP-NOW or FSK; kilometres to LoRa or cellular.
2. **How much data, how often?** A few bytes every few minutes is LoRa's home; kilobytes a minute is cellular or Wi-Fi.
3. **What powers it?** A coin cell or solar cell wants microamps asleep and short, rare bursts: LoRa, or cellular with PSM. Mains allows anything.
4. **Who answers, and how fast?** Commands to a node need class C or a gateway-less link; a class A LoRaWAN node can only be told things after it speaks.
5. **Who runs the network?** Your own gateways, a community network with a fair-use limit, a paid operator or a mobile carrier each shift cost and responsibility.

Then look up the rules: duty cycle, power and the band are law, not preference ([[transmit-power-and-regulations]]).

> [!key] Start from distance, data, power, reply and who runs the network, not from the radio you already own. LoRa for kilobytes a day over kilometres, cellular where nothing else covers, Wi-Fi or ESP-NOW where an access point or another ESP is near, and the rules decide the rest.`,
  ideas: [
    'Pick by distance, data volume, power source, reply need and network ownership, in that order, and check the rules.',
    'LoRa trades speed for reach on little power; cellular trades a subscription and peak current for coverage; Wi-Fi and ESP-NOW trade reach for speed.',
    'A link that cannot reach a node when you need to (class A, PSM) suits reporting, not control.',
    'A comparison of range depends on the environment and the antennas; the same radios differ by factors of several from field to room.'
  ],
  pitfalls: [
    'The link with the biggest range number is the best — Range comes with a data rate, power and rule cost. A 15 km link at 300 bit/s cannot send a photograph, and a duty-cycle limit may allow one packet a minute.',
    'I will decide the radio now and sort the rules later — Duty cycle, band and power limits shape the design from the start: they decide how often a node may speak, and so how it is built.',
    'Cellular is always the easy answer because it works everywhere — It needs a subscription per device, a supply that survives 2 A bursts, certification for a product, and coverage that varies by country and technology.'
  ],
  terms: [
    { term: 'Fade margin', also: ['safety margin'], def: 'The decibels of signal kept in hand above what the receiver needs, so that the link still works on a bad day: rain, a moved obstacle, a tired battery.' },
    { term: 'Gateway-less link', also: ['point to point', 'peer to peer'], def: 'A radio link between two nodes you own, with no network or provider in between, in contrast to a network such as LoRaWAN or a cellular carrier.' },
    { term: 'Fair-use policy', also: ['airtime budget'], def: 'A limit set by a shared network on how much each device may use it, such as a daily air-time allowance, to keep the network usable for everyone.' }
  ],
  sim: 'lr-compare',
  choose: {
    good: ['A written list of distance, data per day, power source, reply need and who runs the network', 'The cheapest link that meets the list with a margin', 'A test in the real place with the real antenna before you commit'],
    avoid: ['Choosing from the biggest range figure on a listing', 'Starting with the radio you happen to own', 'Ignoring duty cycle, fair use and certification until the end'],
    check: ['What the site gives: a gateway, a carrier, an access point, mains power', 'The legal limits of every band you consider', 'The cost over years: the service, the battery, the visits to change it']
  },
  quiz: [
    { q: 'A soil probe 4 km from the farmhouse reports 10 bytes every 15 minutes and runs from a small solar cell. Which link fits best?', choices: ['Wi-Fi', 'ESP-NOW', 'LoRa (with a gateway or a receiver at the farmhouse)', 'Infrared'], a: 2, why: 'Kilometres of range, tiny and rare messages and a small supply are LoRa\'s case. Wi-Fi and ESP-NOW do not reach 4 km reliably and use far more energy; infrared reaches a few metres.' },
    { q: 'A command must reach a sensor within a second whenever the owner sends it. Which of these designs cannot meet that?', choices: ['A class A LoRaWAN node on a coin cell', 'A mains-powered node on Wi-Fi', 'A class C LoRaWAN node on mains', 'A node on a private point-to-point link, always listening'], a: 0, why: 'A class A device listens only briefly after it transmits, so a command waits for its next report. The other designs can listen continuously.' },
    { q: 'A cellular modem is preferred to LoRa for every remote sensor because it works everywhere.', a: false, why: 'It needs a subscription per device, a supply for current bursts, and a carrier that covers the site with the right technology, which varies by country. For tiny, rare messages LoRa costs less in service and energy.' },
    { q: 'Why do legal duty cycles belong at the start of the choice rather than at the end?', choices: ['They are optional guidelines', 'They set how often a node may transmit, which changes the design and the data you can send', 'They only apply to cellular', 'They only matter for batteries'], a: 1, why: 'A 1 % limit may allow one 20-byte SF12 packet every two minutes at best. That decides how many nodes, what data and what interval are possible, so it shapes the design.' }
  ],
  applications: [
    'Choosing between LoRa and cellular for a network of water-tank sensors across a farm or a municipality.',
    'Deciding whether a garden or garage needs a long-range radio at all, or whether ESP-NOW or Wi-Fi covers it.',
    'Planning an indoor positioning system, where UWB ranges and a different radio reports the results.',
    'Reviewing a product idea\'s running costs: service plans, batteries and field visits.'
  ],
  sources: [
    'The data sheets and regional rules cited on the pages for each link, starting with ETSI EN 300 220 for sub-GHz devices.',
    'LoRa Alliance: the LoRaWAN Specification and Regional Parameters; the documentation of the network you intend to use.',
    '3GPP specifications and your carrier\'s documentation for LTE-M and NB-IoT coverage and terms.'
  ]
}
);
