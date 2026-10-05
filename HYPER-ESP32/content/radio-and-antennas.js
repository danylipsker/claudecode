/* HYPER-ESP32 · content/radio-and-antennas.js
 *
 * Topic "radio-and-antennas" (branch wireless): radio at 2.4 GHz, decibels and dBm, the link budget, RSSI, PCB antennas and
 * their keep-out, external antennas and connectors, gain, pattern and polarization, placement and enclosures, range,
 * walls and the Fresnel zone, interference and channels, transmit power and the rules, 5 GHz and beyond, and matching.
 * Simulations: sims/radio-and-antennas.js (ids ra-*).
 */
Hyper.add(
/* ================================================================ radio at 2.4 GHz */
{
  id: 'radio-basics',
  parent: 'radio-and-antennas',
  title: 'Radio at 2.4 GHz',
  level: 1,
  short: 'A radio wave is an electric and magnetic ripple that carries bits through the air. At 2.4 GHz it is about 12 cm long, which is why a working antenna fits on a corner of a module, and why Wi-Fi, Bluetooth and Zigbee must share one crowded slice of spectrum.',
  keywords: ['radio', 'radio wave', '2.4 GHz', 'ISM band', 'frequency', 'wavelength', 'quarter wave', 'modulation', 'carrier', 'spectrum', 'speed of light', 'antenna length', 'band', 'MHz', 'GHz'],
  prereq: ['chip-module-board', 'the-shared-radio'],
  related: ['decibels-and-dbm', 'pcb-antennas', 'interference-and-channels', 'wifi-basics', 'bluetooth-classic-and-le', 'ieee-802-15-4', 'lora', 'physics:electromagnetic-waves', 'electronics:antennas'],
  body: `Everything wireless on an ESP32 (Wi-Fi, Bluetooth LE, Zigbee, Thread, ESP-NOW) is **radio**. A rapidly alternating current in a piece of metal, the antenna, throws off an electric and magnetic ripple that travels at the speed of light; another antenna far away turns a tiny part of that ripple back into a current. Data rides on the ripple by changing it a little in a pattern the receiver knows: its strength, its frequency or its phase. That is **modulation**, and the chip does all of it in hardware. Your program only hands over bytes ([[the-shared-radio]]).

### Frequency and wavelength

A wave has a **frequency** $f$, how many ripples pass each second, and a **wavelength** $\\lambda$, the distance between two crests. The speed of light ties them together: $\\lambda = c / f$. The family's main band runs from 2400 to 2483.5 MHz, and in the middle of it one wavelength is about 12.3 cm.

| Band | Typical use | Wavelength | Quarter wave |
|---|---|---|---|
| 433 MHz | remote controls, some LoRa | 69 cm | 17 cm |
| 868 / 915 MHz | LoRa, Meshtastic ([[lora]]) | 35 / 33 cm | 8.6 / 8.2 cm |
| 2.4 GHz | Wi-Fi, Bluetooth, Zigbee, Thread, ESP-NOW | 12.3 cm | 3.1 cm |
| 5 GHz | Wi-Fi on the ESP32-C5 | 5.5 cm | 1.4 cm |

The last column is the one that matters. The simplest antenna is a wire a **quarter wave** long standing on a ground plane, so the size of an antenna follows the wavelength. At 2.4 GHz about 3 cm of copper will do, which is why a meandered trace at one end of a module really is an antenna ([[pcb-antennas]]); a 433 MHz one needs 17 cm (see the calculator).

### A band everybody shares

2.4 GHz is an **ISM band**, set aside for industrial, scientific and medical use. Anyone may transmit in it without a licence as long as the equipment obeys the power limits ([[transmit-power-and-regulations]]). That is also why the band is crowded: Wi-Fi, Bluetooth, Zigbee, cordless phones, baby monitors and the leakage of a microwave oven all live there ([[interference-and-channels]]).

### The numbers are extreme

A chip transmits roughly 100 mW at most. Ten metres away, in open air, the antenna collects about a ten-thousandth of a milliwatt, and across a house, through walls, about a billionth. The receiver can still decode about a ten-billionth of a milliwatt. The ratio between the loudest thing the chip sends and the faintest it can hear is more than a hundred billion to one, which is why radio people count in decibels ([[decibels-and-dbm]]).

### What radio does not do

Radio at 2.4 GHz travels in straight lines, bounces off metal, and is absorbed by walls and by anything full of water, people and plants included. Range is therefore never one number: it is a budget of gains and losses ([[link-budget]]).

> [!key] A 2.4 GHz wave is about 12 cm long, so a useful antenna is about 3 cm of copper, and every nearby radio shares the same licence-free band. What arrives is billions of times weaker than what was sent, so this topic is about wasting none of it.`,
  ideas: [
    'A radio wave of frequency f has wavelength c/f: about 12.3 cm in the middle of the 2.4 GHz band.',
    'A quarter-wave antenna is about 3 cm at 2.4 GHz, 8.6 cm at 868 MHz and 17 cm at 433 MHz: antenna size follows wavelength.',
    '2.4 GHz is a licence-free ISM band, shared by Wi-Fi, Bluetooth, Zigbee, Thread and many other devices.',
    'The receiver works with signals more than a hundred billion times weaker than the transmitter sends.'
  ],
  pitfalls: [
    'A higher frequency carries further — The opposite, for the same antenna sizes: a higher frequency loses more energy over the same distance and is absorbed more by walls. A higher frequency buys capacity and a smaller antenna, not range.',
    'The antenna is a bare wire, so any wire will do — An antenna works only when its length, shape and surroundings suit one wavelength. A wire of the wrong length, or one lying next to metal, radiates badly.',
    'Wi-Fi, Bluetooth and Zigbee each have their own piece of spectrum — At 2.4 GHz all three share the same 83 MHz and interfere with one another; only the channel plans differ.'
  ],
  terms: [
    { term: 'Frequency', also: ['Hz', 'MHz', 'GHz'], def: 'How many times a wave repeats each second, in hertz. Wi-Fi at 2.4 GHz repeats 2.4 billion times a second; one MHz is a million hertz and one GHz a thousand million.' },
    { term: 'Wavelength', also: ['lambda'], def: 'The distance a radio wave travels during one cycle, equal to the speed of light divided by the frequency. About 12.3 cm at 2.4 GHz and 5.5 cm at 5.5 GHz.' },
    { term: 'ISM band', also: ['industrial, scientific and medical band', 'licence-free band'], def: 'A slice of spectrum that may be used without a licence, within power limits, by equipment of any kind. 2.4 GHz (2400 to 2483.5 MHz) is the one that Wi-Fi, Bluetooth and Zigbee share.' },
    { term: 'Modulation', def: 'Changing a radio wave in a pattern that carries data: its amplitude, frequency or phase. The receiver watches for the same pattern and recovers the bits.' },
    { term: 'Quarter-wave antenna', also: ['monopole', 'whip'], def: 'The simplest antenna: a conductor one quarter of a wavelength long above a ground plane. About 3 cm at 2.4 GHz, a little less in practice.' }
  ],
  formulas: [
    {
      name: 'Wavelength of a radio wave',
      expr: 'lambda = c/f',
      tex: '\\lambda = \\frac{c}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'cm' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 2442 }
      },
      solveFor: 'lambda',
      note: 'In free space. Wi-Fi channel 6 is at 2437 MHz, Bluetooth LE advertising channel 38 at 2426 MHz.',
      stories: { lambda: 'A Wi-Fi link runs at {f}. How long is one wavelength?' }
    },
    {
      name: 'Length of a quarter-wave antenna',
      expr: 'L = k*c/(4*f)',
      tex: 'L = k\\,\\frac{c}{4f}',
      vars: {
        L: { name: 'antenna length', q: 'length', unit: 'mm' },
        k: { name: 'shortening factor', q: 'ratio', value: 0.95, min: 0.5, max: 1 },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 2442 }
      },
      solveFor: 'L',
      note: 'The factor k, about 0.95 for a wire or trace, shortens the antenna a little; the surroundings change it, so a real antenna is tuned, not just cut ([[matching-and-tuning]]).'
    }
  ],
  examples: [
    {
      title: 'Why does a LoRa board have a long whip?',
      q: 'A Wi-Fi module carries a 3 cm antenna on its board, but a 868 MHz LoRa board needs a rod about 8 cm long. Check the sizes.',
      steps: ['A quarter wave is $c/(4f)$. At 2442 MHz that is $299\\,792\\,458 / (4 \\times 2.442 \\times 10^9) = 30.7$ mm, and with the 0.95 factor about 29 mm.', 'At 868 MHz it is $299\\,792\\,458 / (4 \\times 868 \\times 10^6) = 86$ mm, and about 82 mm with the factor.', 'The ratio of the two is $2442 / 868 = 2.8$: a lower frequency needs a proportionally longer antenna.'],
      a: 'About 3 cm against 8 cm. The 868 MHz wave is 2.8 times longer, so its antenna is too big to meander into a corner of a small module.'
    }
  ],
  quiz: [
    { q: 'What is the wavelength of a 2.4 GHz radio wave?', choices: ['About 12.5 cm', 'About 1.25 m', 'About 1.25 mm', 'About 30 cm'], a: 0, why: 'Wavelength is the speed of light divided by the frequency: 299 792 458 m/s ÷ 2.4 × 10⁹ Hz = 0.125 m, which is 12.5 cm.' },
    { q: 'A simple quarter-wave antenna for 433 MHz is about how many times longer than one for 2.4 GHz?', choices: ['About 5.5 times', 'About the same', 'About twice', 'About 20 times'], a: 0, why: 'Antenna length follows wavelength, which is inversely proportional to frequency. 2442 ÷ 433.9 is about 5.6, so roughly 17 cm against 3 cm.' },
    { q: 'Because 5 GHz has a shorter wavelength, an ESP32-C5 on 5 GHz reaches further than on 2.4 GHz.', a: false, why: 'Shorter wavelength means higher frequency, and for antennas of the same gain the path loss grows with frequency: about 7 dB more at 5.5 GHz than at 2.4 GHz. Walls also absorb more. The gain is capacity and clear channels ([[five-ghz-and-six-ghz]]).' },
    { q: 'How many centimetres long is one wavelength of 915 MHz radio?', answer: 32.8, unit: 'cm', why: 'c / f = 299 792 458 / 915 × 10⁶ = 0.3277 m, about 32.8 cm.' }
  ],
  applications: [
    'Understanding why a Wi-Fi board carries a small trace antenna while a LoRa board needs a long whip ([[lora]], [[pcb-antennas]]).',
    'Choosing which band to build on: 2.4 GHz for anything a phone must talk to, a sub-GHz radio for range ([[choosing-a-long-range-link]]).',
    'Explaining why a running microwave oven (2.45 GHz) can stall a Wi-Fi link in the next room ([[interference-and-channels]]).',
    'Reading any module datasheet: the frequency range, the antenna type and the allowed power all start here ([[module-certification]]).'
  ],
  sources: [
    'IEEE Std 802.11: the 2.4 GHz channel plan; and the Bluetooth Core Specification, physical layer: its 2.4 GHz channels.',
    'ITU Radio Regulations: the industrial, scientific and medical (ISM) bands.',
    'Espressif, *ESP32 Series Hardware Design Guidelines*: the RF section, with antenna and layout rules.'
  ],
  code: [
    {
      title: 'From the Wi-Fi channel to the wavelength',
      about: 'Joins your network, reads the channel the router uses, turns it into a frequency ($2407 + 5n$ MHz on 2.4 GHz, $5000 + 5n$ on 5 GHz) and prints the wavelength and the quarter-wave length.',
      needs: 'Any ESP32-family board with Wi-Fi, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          repeat until <Wi-Fi connected?>
            wait (0.25) seconds
          end
          set [channel v] to (Wi-Fi channel) :: wifi
          if <(channel) > (14)> then
            set [mhz v] to ((5000) + ((5) * (channel)))
          else
            set [mhz v] to ((2407) + ((5) * (channel)))
          end
          set [wavelength v] to ((29979.2458) / (mhz))
          print (join [channel ] (channel) [ = ] (mhz) [ MHz])
          print (join [wavelength ] (wavelength) [ cm, quarter wave ] ((wavelength) / (4)) [ cm])
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);

          int channel = WiFi.channel();                         // the router's channel
          float mhz = channel > 14 ? 5000 + 5 * channel : 2407 + 5 * channel;
          float wavelength = 29979.2458f / mhz;                 // speed of light / frequency, in cm
          Serial.printf("channel %d = %.0f MHz\n", channel, mhz);
          Serial.printf("wavelength %.1f cm, quarter wave %.1f cm\n", wavelength, wavelength / 4);
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time

        SSID = "your-ssid"
        PASS = "your-password"

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        while not wlan.isconnected():
            time.sleep_ms(250)

        channel = wlan.config("channel")                        # the router's channel
        mhz = 5000 + 5 * channel if channel > 14 else 2407 + 5 * channel
        wavelength = 29979.2458 / mhz                           # speed of light / frequency, in cm
        print("channel %d = %d MHz" % (channel, mhz))
        print("wavelength %.1f cm, quarter wave %.1f cm" % (wavelength, wavelength / 4))
      `,
      output: `
        channel 6 = 2437 MHz
        wavelength 12.3 cm, quarter wave 3.1 cm
      `,
      notes: ['Keep the name and password out of code you share ([[credentials-handling]]).', 'Channel 14, used only in Japan, sits at 2484 MHz and does not follow the 5 MHz rule.']
    }
  ],
  sim: 'ra-wave'
},

/* ================================================================ decibels and dBm */
{
  id: 'decibels-and-dbm',
  parent: 'radio-and-antennas',
  title: 'Decibels and dBm',
  level: 1,
  short: 'Radio power spans a dozen powers of ten, so it is counted on a logarithmic scale where multiplying becomes adding. Decibels, dBm and dBi, the rules for adding them, and why 3 dB doubles the power and 6 dB doubles the range.',
  keywords: ['decibel', 'dB', 'dBm', 'dBi', 'dBd', 'milliwatt', 'logarithm', 'gain', 'loss', 'attenuation', '3 dB', 'power ratio', 'isotropic', 'EIRP', 'log scale', 'mW to dBm'],
  prereq: ['radio-basics'],
  related: ['link-budget', 'rssi-and-signal-quality', 'transmit-power-and-regulations', 'antenna-gain-and-patterns', 'electronics:decibels', 'math:logarithms', 'math:logarithmic-scales'],
  body: `An ESP transmits about 100 mW. A receiver a few rooms away may get a hundred-billionth of that, and the faintest signal it can still decode is only a few times weaker again. A scale with that many zeros is hard to read and harder to multiply, so radio uses **decibels**: a logarithmic scale on which multiplying ratios becomes adding numbers.

### The decibel

A decibel measures a *ratio* of two powers: $\\mathrm{dB} = 10 \\log_{10}(P_2 / P_1)$. Two facts carry you a long way: **+3 dB doubles the power and +10 dB multiplies it by ten.** A negative number divides instead.

| Change | Power ratio |
|---|---|
| 0 dB | × 1, no change |
| +3 dB | × 2 |
| +6 dB | × 4 |
| +10 dB | × 10 |
| +20 dB | × 100 |
| −3 dB | half |
| −10 dB | a tenth |
| −30 dB | a thousandth |

Any other ratio is built from these: +13 dB is 10 + 3, so × 20; −7 dB is −10 + 3, so about × 0.2.

### dBm: decibels against one milliwatt

A decibel on its own is a ratio. To say *how much power*, compare with a fixed reference: **dBm** is decibels relative to 1 mW. So 0 dBm is 1 mW, +20 dBm is 100 mW, and −30 dBm is one microwatt.

| Level | Power | Where you meet it |
|---|---|---|
| +20 dBm | 100 mW | about the most an ESP radio sends (19.5 to 22 dBm) |
| 0 dBm | 1 mW | a Bluetooth LE device at a modest setting |
| −50 dBm | 10 nW | a good Wi-Fi signal |
| −70 dBm | 0.1 nW | a usable but weak link |
| −98 dBm | 0.16 pW | the best sensitivity of most chips in the catalogue |

### Doing the arithmetic

- **dBm + dB = dBm.** A +20 dBm transmitter feeding a cable that loses 3 dB delivers +17 dBm.
- **dBm − dBm = dB.** A signal of −50 dBm over noise of −95 dBm is 45 dB above it.
- **Never add two dBm values.** Two transmitters of 20 dBm together make 200 mW, which is 23 dBm, not 40. Convert to milliwatts, add, convert back.

Other flavours are written dB with a letter: **dBi** is the gain of an antenna against an imaginary one that radiates equally in all directions, and **dBd** is against a half-wave dipole (dBi = dBd + 2.15, [[antenna-gain-and-patterns]]). Cable loss is in dB per metre.

### Why 6 dB doubles the range

In free space the power of a signal falls with the square of the distance. Twice as far means a quarter of the power, which is −6 dB. So 6 dB of extra gain or less loss doubles the free-space range, and 3 dB extends it by 41 per cent. Indoors, where loss grows faster with distance, the same 6 dB buys less ([[range-and-obstacles]]).

> [!key] Decibels turn the multiplications of radio into additions: +3 dB is twice the power, +10 dB ten times, and dBm counts power against 1 mW. Add and subtract dB freely, but never add two dBm values: convert to milliwatts first.`,
  ideas: [
    'Decibels are ten times the base-10 logarithm of a power ratio: +3 dB doubles power, +10 dB multiplies it by ten.',
    'dBm is power against 1 mW: 0 dBm is 1 mW, +20 dBm is 100 mW, −90 dBm is a picowatt.',
    'dBm plus dB gives dBm; dBm minus dBm gives dB; two dBm values are never added.',
    'In free space each 6 dB of gain doubles the range.'
  ],
  pitfalls: [
    'Two 20 dBm transmitters make 40 dBm — Decibels add only for ratios. Two 100 mW sources make 200 mW, which is 23 dBm.',
    'A reading of −60 dBm is only a little weaker than −50 dBm — The 10 dB difference is a factor of ten in power, and 30 dB is a factor of a thousand. Differences in decibels are ratios, so small-looking steps are large ones.',
    'dBi and dBm are interchangeable "dB" units — dBm is an amount of power; dBi is an antenna gain. dBm + dBi is allowed and gives dBm of effective power in the best direction, but they do not mean the same thing.'
  ],
  terms: [
    { term: 'Decibel', also: ['dB'], def: 'A logarithmic unit for a ratio of two powers: ten times the base-10 logarithm of the ratio. +3 dB is twice the power, +10 dB ten times.' },
    { term: 'dBm', def: 'Power in decibels relative to one milliwatt. 0 dBm is 1 mW, +20 dBm is 100 mW, −30 dBm is 1 µW.' },
    { term: 'dBi', also: ['antenna gain', 'dBd'], def: 'The gain of an antenna in decibels against an isotropic one that radiates equally in all directions. A half-wave dipole has 2.15 dBi. dBd is the same measured against a dipole.' },
    { term: 'Isotropic radiator', also: ['isotropic antenna'], def: 'An imaginary antenna that radiates equally in every direction. It cannot be built, but it is the reference for antenna gain in dBi.' },
    { term: 'Attenuation', also: ['loss', 'insertion loss'], def: 'The power lost on the way, in dB: in a cable, a connector, a wall or across distance. A loss of 3 dB leaves half the power.' }
  ],
  formulas: [
    {
      name: 'dBm to milliwatts',
      expr: 'P = 1e-3*10^(L/10)',
      tex: 'P = 1\\,\\mathrm{mW} \\cdot 10^{L/10}',
      vars: {
        P: { name: 'power', q: 'power', unit: 'mW' },
        L: { name: 'level in dBm', unit: 'dBm', value: 20, signed: true }
      },
      solveFor: 'P',
      note: 'Solve for L to turn a power into dBm. +20 dBm is 100 mW, 0 dBm is 1 mW, −30 dBm is 1 µW.'
    },
    {
      name: 'Power ratio in decibels',
      expr: 'G = 10*log10(r)',
      tex: 'G = 10\\log_{10} r',
      vars: {
        G: { name: 'gain or loss', q: 'gain', unit: 'dB', signed: true },
        r: { name: 'power ratio (output ÷ input)', q: 'ratio', value: 2 }
      },
      solveFor: 'G',
      note: 'A ratio below 1 is a loss and gives a negative number of decibels.'
    }
  ],
  examples: [
    {
      title: 'The power leaving the antenna',
      q: 'An ESP32-S3 module is set to 21 dBm. It feeds a pigtail and connector that lose 1.5 dB into an antenna of 3 dBi. What is the effective radiated power in the best direction, in dBm and in milliwatts?',
      steps: ['Start at 21 dBm. The cable and connector subtract 1.5 dB: $21 - 1.5 = 19.5$ dBm reaches the antenna.', 'The antenna concentrates the power by 3 dB in its best direction: $19.5 + 3 = 22.5$ dBm.', 'Convert: $10^{22.5/10} = 178$ mW.'],
      a: 'About 22.5 dBm, or 178 mW, in the strongest direction. That is above the 20 dBm European limit for 2.4 GHz, so the power would have to be lowered ([[transmit-power-and-regulations]]).'
    }
  ],
  quiz: [
    { q: 'A transmitter sends 20 dBm and the cable to the antenna loses 3 dB. What reaches the antenna?', choices: ['17 dBm', '23 dBm', '17 mW', '60 dBm'], a: 0, why: 'Losses in dB subtract from a level in dBm: 20 − 3 = 17 dBm, which is about 50 mW, half of the original 100 mW.' },
    { q: 'Two ESP boards sit side by side, each transmitting 20 dBm at the same moment. What is the total power?', choices: ['About 23 dBm (200 mW)', '40 dBm', '20 dBm', '30 dBm'], a: 0, why: 'Decibel levels cannot be added directly. 100 mW + 100 mW = 200 mW, and 10 log₁₀(200) is about 23 dBm.' },
    { q: 'Between a received level of −60 dBm and one of −66 dBm, how much did the free-space distance change?', choices: ['It doubled', 'It halved', 'It quadrupled', 'It grew by 6 m'], a: 0, why: 'In free space 6 dB less power means twice the distance, since power falls with the square of the distance.' },
    { q: 'How many milliwatts is 23 dBm?', answer: 200, unit: 'mW', why: '23 dBm = 20 + 3 dBm = 100 mW × 2 = about 200 mW (exactly 199.5 mW).' }
  ],
  applications: [
    'Reading the transmit power and sensitivity lines of any module datasheet ([[reading-a-module-part-number]]).',
    'Setting a Wi-Fi transmit power in a program, where the steps are named in dBm ([[transmit-power-and-regulations]]).',
    'Adding up a link budget from antenna gains and cable losses ([[link-budget]]).',
    'Interpreting a signal-strength reading on the serial monitor ([[rssi-and-signal-quality]]).'
  ],
  sources: [
    'IEC 60027-3: logarithmic and related quantities and their units, including the decibel.',
    'Espressif, datasheets of the ESP32 series: the RF characteristics tables quote transmit power and sensitivity in dBm.',
    'Constantine A. Balanis, *Antenna Theory: Analysis and Design*: the definitions of gain and the isotropic reference.'
  ],
  code: [
    {
      title: 'dBm to milliwatts and back',
      about: 'Prints a table of power levels in dBm with their power in milliwatts, then converts 100 mW back to dBm. No radio is needed: it is only arithmetic, but it is exactly the arithmetic of every radio datasheet.',
      needs: 'Any ESP board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [dbm v] in (list 20 10 0 -30 -60 -90)
            set [mw v] to (10 to the power ((dbm) / (10)))
            print (join (dbm) [ dBm = ] (mw) [ mW])
          end
          print (join [100 mW = ] ((10) * (log10 of (100))) [ dBm])
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          const float levels[] = {20, 10, 0, -30, -60, -90};
          for (float dbm : levels) {
            float mw = powf(10.0f, dbm / 10.0f);              // dBm to milliwatts
            Serial.printf("%4.0f dBm = %g mW\n", dbm, mw);
          }
          Serial.printf("100 mW = %.1f dBm\n", 10.0f * log10f(100.0f));   // milliwatts to dBm
        }

        void loop() {}
      `,
      py: String.raw`
        import math

        for dbm in (20, 10, 0, -30, -60, -90):
            mw = 10 ** (dbm / 10)                               # dBm to milliwatts
            print("%4d dBm = %g mW" % (dbm, mw))

        print("100 mW = %.1f dBm" % (10 * math.log10(100)))     # milliwatts to dBm
      `,
      output: `
          20 dBm = 100 mW
          10 dBm = 10 mW
           0 dBm = 1 mW
         -30 dBm = 0.001 mW
         -60 dBm = 1e-06 mW
         -90 dBm = 1e-09 mW
        100 mW = 20.0 dBm
      `,
      notes: ['The same sum, 10 raised to the level divided by 10, converts any RSSI reading to milliwatts when you need to add or average powers.']
    }
  ],
  sim: 'ra-db'
},

/* ================================================================ the link budget */
{
  id: 'link-budget',
  parent: 'radio-and-antennas',
  title: 'The link budget',
  level: 2,
  short: 'Range is an account kept in decibels: what the transmitter sends, plus the gain of both antennas, minus every loss on the way, set against what the receiver needs. How to add it up, what each line costs, and what a 20 dB margin is for.',
  keywords: ['link budget', 'path loss', 'free-space path loss', 'FSPL', 'Friis', 'range', 'sensitivity', 'link margin', 'fade margin', 'path-loss exponent', 'transmit power', 'received power', 'uplink', 'downlink', 'wall loss', 'Prx'],
  prereq: ['radio-basics', 'decibels-and-dbm'],
  related: ['rssi-and-signal-quality', 'range-and-obstacles', 'antenna-gain-and-patterns', 'transmit-power-and-regulations', 'lora-parameters', 'wifi-troubleshooting', 'choosing-a-long-range-link'],
  body: `Will it reach? A **link budget** answers by keeping accounts in decibels. Start from the power the transmitter sends, add what the antennas contribute, subtract every loss on the way, and compare what is left with what the receiver needs.

$$P_{rx} = P_{tx} + G_{tx} - L_{cable} - L_{path} + G_{rx}$$

### The lines of the account

- **Transmit power.** From the catalogue: 19.5 dBm on the ESP32, 21 dBm on the ESP32-C3 and S3, 20 dBm on the ESP32-C5. These are the maximums, for the slowest Wi-Fi rates; faster rates are sent a few dB lower.
- **Antenna gains.** A small PCB antenna is around 0 dBi; a stick antenna 2 to 5 dBi ([[antenna-gain-and-patterns]]). Both ends count.
- **Cable and connector losses**, a few tenths of a dB for a short pigtail ([[external-antennas]]).
- **Path loss**, which is the big one. In free space it is $20\\log_{10}(4\\pi d/\\lambda)$: **40 dB at 1 m, 60 dB at 10 m, 80 dB at 100 m, 100 dB at 1 km** at 2.4 GHz. Every tenfold distance costs 20 dB.
- **Walls and obstacles**, 3 to 15 dB each ([[range-and-obstacles]]), and indoors the loss grows faster than free space: use a path-loss exponent $n$ of 2.7 to 3.5 instead of 2 and the distance term becomes $10\\,n\\log_{10}d$.

### What the receiver needs

The **sensitivity** is the weakest signal it can decode. The catalogue gives the best figure of each chip, −97 to −102.5 dBm, which applies to the slowest, most robust rate. The fastest Wi-Fi rates need 20 to 25 dB more, so a link that is fine at 1 Mbit/s may be far too weak for 54 Mbit/s. The difference between what arrives and what is needed is the **margin**. Radio signals fade and wander by 10 dB or more, so a link planned with 0 dB of margin works only half the time; **10 to 20 dB** is the usual reserve.

### An example, with the engine's numbers

An ESP32-C3 sends 21 dBm; the router has a 0 dBi antenna; the receiver needs −98.4 dBm. The budget is $21 + 98.4 = 119.4$ dB. In free space, subtracting the 40 dB of the first metre, that stretches to about 9 km, which no house will ever give you. In a house with $n = 3$ and a 20 dB margin the same budget gives about 94 m, and two 5 dB walls cut it to 44 m.

### The weakest direction

A link must work both ways. A router usually sends with more power and a better antenna than a small ESP, so the ESP hears the router from further than the router hears it. The *uplink* from the ESP sets the range.

> [!key] A link budget adds the transmitter's power and both antenna gains and subtracts cable, path and wall losses; what remains must exceed the receiver's sensitivity by a 10 to 20 dB margin. Free space costs 20 dB for every tenfold distance, so rooms and walls, not kilometres, decide most ESP links.`,
  ideas: [
    'Received power = transmit power + antenna gains − cable losses − path loss; compare it with the receiver sensitivity.',
    'Free-space path loss at 2.4 GHz is 40 dB at 1 m and grows by 20 dB for every tenfold distance.',
    'Keep a margin of 10 to 20 dB, because signals fade; the fastest data rates need 20 to 25 dB more than the slowest.',
    'The uplink from the small device is usually the weak direction, not the downlink from the router.'
  ],
  pitfalls: [
    'The datasheet range of 300 m is what I will get indoors — Datasheet and marketing ranges come from free space, a perfect antenna and the slowest rate. A house with walls (exponent 3 and a few 5 dB walls) cuts that to tens of metres.',
    'Doubling the transmit power doubles the range — Doubling the power is only 3 dB: about 1.4 times the free-space range, and less indoors. And the legal limit stops you ([[transmit-power-and-regulations]]).',
    'If the receiver hears the router, the router hears me — Not necessarily. The router transmits more strongly with a better antenna, so the ESP can hear a signal it cannot answer.'
  ],
  terms: [
    { term: 'Link budget', def: 'The account of a radio link in decibels: transmit power plus gains minus losses, giving the power at the receiver, which is compared with what the receiver needs.' },
    { term: 'Path loss', also: ['free-space path loss', 'FSPL'], def: 'The power lost between two antennas as the wave spreads out. In free space it grows by 20 dB for every tenfold distance and by 6 dB for every doubling; indoors it grows faster.' },
    { term: 'Receiver sensitivity', also: ['sensitivity'], def: 'The weakest signal, in dBm, that a receiver can still decode at a given data rate. Lower is better; the figure gets worse for faster rates.' },
    { term: 'Link margin', also: ['fade margin'], def: 'The number of decibels by which the received power exceeds the sensitivity. It is the reserve against fading, moving people and changes of weather.' },
    { term: 'Path-loss exponent', def: 'The number n in the distance term 10·n·log₁₀(d) of the loss. It is 2 in free space and about 2.7 to 3.5 inside buildings.' }
  ],
  choose: {
    good: ['Planning a deployment before drilling holes: how far apart can the nodes be?', 'Finding which line of the account is worth improving: antenna, cable, wall, power', 'Explaining to a customer why a link works in one room and not the next'],
    avoid: ['Taking one figure as a guarantee: budgets give typical ranges, real rooms differ by 10 dB', 'Planning with zero margin', 'Forgetting the return path from the weak device'],
    check: ['The sensitivity at the data rate you will really use', 'The legal power limit, after antenna gain ([[transmit-power-and-regulations]])', 'A measured signal at the real place, with the real enclosure ([[rssi-and-signal-quality]])']
  },
  formulas: [
    {
      name: 'Received power',
      expr: 'Prx = Ptx + Gt + Gr - L',
      tex: 'P_{\\mathrm{rx}} = P_{\\mathrm{tx}} + G_{t} + G_{r} - L',
      vars: {
        Prx: { name: 'received power', unit: 'dBm', signed: true, tex: 'P_{\\mathrm{rx}}' },
        Ptx: { name: 'transmit power', unit: 'dBm', value: 15, signed: true, tex: 'P_{\\mathrm{tx}}' },
        Gt: { name: 'transmit antenna gain, net of cable', q: 'gain', unit: 'dB', value: 0, signed: true, tex: 'G_{t}' },
        Gr: { name: 'receive antenna gain', q: 'gain', unit: 'dB', value: 2, signed: true, tex: 'G_{r}' },
        L: { name: 'total path loss, walls included', q: 'gain', unit: 'dB', value: 90, min: 0 }
      },
      solveFor: 'Prx',
      note: 'Everything in dB and dBm, so it is addition. Compare the result with the receiver sensitivity: the difference is the margin.'
    },
    {
      name: 'Free-space path loss',
      expr: 'L = 20*log10(4*pi*d*f/c)',
      tex: 'L = 20\\log_{10}\\left(\\frac{4\\pi d f}{c}\\right)',
      vars: {
        L: { name: 'path loss', q: 'gain', unit: 'dB' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 100 },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 2442 },
        c: { const: 'c' }
      },
      solveFor: 'L',
      note: 'Free space only: no walls, no ground, antennas in line of sight. Add the walls separately, and use a larger exponent indoors.',
      stories: { L: 'A link at {f} spans {d} in open air. What is the free-space path loss?' }
    }
  ],
  examples: [
    {
      title: 'Does a garden shed link work?',
      q: 'An ESP32 sends 15 dBm from the shed. The router has a 2 dBi antenna and the shed antenna is 0 dBi. The path is 50 m through a house with a path-loss exponent of 3 and one 5 dB wall. The receiver needs −90 dBm. What is the margin?',
      steps: ['Loss at the first metre, 2442 MHz: $20\\log_{10}(2442) - 27.55 = 40.2$ dB.', 'Distance term: $10 \\times 3 \\times \\log_{10}(50) = 51.0$ dB. One wall adds 5 dB, so the path loss is $40.2 + 51.0 + 5 = 96.2$ dB.', 'Received power: $15 + 0 + 2 - 96.2 = -79.2$ dBm.', 'Margin: $-79.2 - (-90) = 10.8$ dB.'],
      a: 'A margin of about 11 dB: the link works, with the minimum sensible reserve. Move the shed to 100 m and the margin falls to about 2 dB.'
    }
  ],
  quiz: [
    { q: 'In free space, how much extra path loss does going from 10 m to 100 m add?', choices: ['20 dB', '10 dB', '6 dB', '100 dB'], a: 0, why: 'Free-space loss grows by 20 dB for every tenfold distance: 60 dB at 10 m and 80 dB at 100 m at 2.4 GHz.' },
    { q: 'A link has a margin of 12 dB. A new wall that costs 8 dB is built across the path. What is the situation now?', choices: ['The link fails', 'A margin of 4 dB: it works, with little reserve', 'A margin of 20 dB', 'Nothing changes: walls do not affect radio'], a: 1, why: 'Losses in decibels simply subtract: 12 − 8 = 4 dB. The link is still above the sensitivity, but a 4 dB fade will drop it.' },
    { q: 'An ESP can usually hear its router from further away than the router can hear the ESP.', a: true, why: 'The router normally has more transmit power and better antennas than a small ESP board, so the downlink is stronger than the uplink. The uplink limits the range.' },
    { q: 'About how many decibels is the free-space path loss at 100 m and 2.4 GHz?', answer: 80, unit: 'dB', why: '40 dB for the first metre plus 20 dB for each tenfold distance: 40 + 20 + 20 = 80 dB (80.2 dB exactly).' }
  ],
  applications: [
    'Deciding how far apart ESP-NOW sensor nodes can be placed before they need a repeater ([[esp-now-topologies]]).',
    'Choosing a LoRa spreading factor, which trades data rate for 5 to 17 dB of sensitivity ([[lora-parameters]]).',
    'Working out whether a garden, garage or outbuilding is in reach of the house Wi-Fi ([[project-garage-door]]).',
    'Comparing an external antenna against a PCB antenna: each dB is a line of the budget ([[external-antennas]]).'
  ],
  sources: [
    'H. T. Friis, "A Note on a Simple Transmission Formula" (1946): the free-space transmission equation behind the path-loss term.',
    'Espressif, datasheets of the ESP32 series: the transmit power and receiver sensitivity tables.',
    'ITU-R Recommendation P.1238: propagation inside buildings, the source of the path-loss exponent for indoor links.'
  ],
  code: [
    {
      title: 'A link budget table',
      about: 'Works out the path loss, the received power and the margin of a link at six distances, for settings you change at the top. It shows where the link stops being comfortable.',
      needs: 'Any ESP board and the serial monitor at 115200 baud. No radio is used: it is arithmetic.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [d v] in (list 5 10 25 50 100 200)
            set [loss v] to (((20) * (log10 of (2442))) - (27.55) + ((30) * (log10 of (d))) + (5))
            set [rx v] to ((15) + (0) + (2) - (loss))
            set [margin v] to ((rx) - (-90))
            print (join (d) [ m  loss ] (loss) [ dB  signal ] (rx) [ dBm  margin ] (margin) [ dB])
          end
      `,
      cpp: String.raw`
        const float MHZ = 2442;        // Wi-Fi channel 6
        const float TX_DBM = 15, G_TX = 0, G_RX = 2;
        const float SENS_DBM = -90;    // what the receiver needs
        const float N = 3.0;           // path-loss exponent: 2 free space, about 3 in a house
        const int   WALLS = 1;
        const float WALL_DB = 5;

        void setup() {
          Serial.begin(115200);
          const float dist[] = {5, 10, 25, 50, 100, 200};
          for (float d : dist) {
            float loss = 20 * log10f(MHZ) - 27.55f      // loss at 1 m
                       + 10 * N * log10f(d)             // growth with distance
                       + WALLS * WALL_DB;
            float rx = TX_DBM + G_TX + G_RX - loss;
            float margin = rx - SENS_DBM;
            Serial.printf("%3.0f m  loss %5.1f dB  signal %6.1f dBm  margin %5.1f dB  %s\n", d, loss, rx, margin,
                          margin >= 10 ? "ok" : margin >= 0 ? "marginal" : "lost");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import math

        MHZ = 2442                     # Wi-Fi channel 6
        TX_DBM, G_TX, G_RX = 15, 0, 2
        SENS_DBM = -90                 # what the receiver needs
        N = 3.0                        # path-loss exponent: 2 free space, about 3 in a house
        WALLS = 1
        WALL_DB = 5

        for d in (5, 10, 25, 50, 100, 200):
            loss = (20 * math.log10(MHZ) - 27.55           # loss at 1 m
                    + 10 * N * math.log10(d)               # growth with distance
                    + WALLS * WALL_DB)
            rx = TX_DBM + G_TX + G_RX - loss
            margin = rx - SENS_DBM
            verdict = "ok" if margin >= 10 else "marginal" if margin >= 0 else "lost"
            print("%3d m  loss %5.1f dB  signal %6.1f dBm  margin %5.1f dB  %s" % (d, loss, rx, margin, verdict))
      `,
      output: `
            5 m  loss  66.2 dB  signal  -49.2 dBm  margin  40.8 dB  ok
           10 m  loss  75.2 dB  signal  -58.2 dBm  margin  31.8 dB  ok
           25 m  loss  87.1 dB  signal  -70.1 dBm  margin  19.9 dB  ok
           50 m  loss  96.2 dB  signal  -79.2 dBm  margin  10.8 dB  ok
          100 m  loss 105.2 dB  signal  -88.2 dBm  margin   1.8 dB  marginal
          200 m  loss 114.2 dB  signal  -97.2 dBm  margin  -7.2 dB  lost
      `,
      notes: ['Change SENS_DBM to a figure for a faster data rate (20 to 25 dB higher) and watch the usable distance shrink.', 'The 27.55 is the constant of the free-space formula when distance is in metres and frequency in MHz.']
    }
  ],
  sim: 'ra-link'
},

/* ================================================================ RSSI */
{
  id: 'rssi-and-signal-quality',
  parent: 'radio-and-antennas',
  title: 'RSSI and signal quality',
  level: 1,
  short: 'RSSI is the radio\'s own estimate of how strong the last frame was, in dBm. What the numbers mean, why a motionless board still sees them jump, how to smooth a reading, and why strength is not the same as quality or distance.',
  keywords: ['RSSI', 'signal strength', 'WiFi.RSSI', 'dBm', 'signal quality', 'noise floor', 'SNR', 'fading', 'multipath', 'smoothing', 'moving average', 'hysteresis', 'signal bars', 'distance from RSSI', 'status rssi'],
  prereq: ['radio-basics', 'decibels-and-dbm'],
  related: ['link-budget', 'wifi-troubleshooting', 'wifi-scanning', 'ble-beacons', 'project-ble-presence', 'range-and-obstacles', 'electronics:noise-snr'],
  body: `**RSSI**, the received signal strength indicator, is how the radio reports the strength of what it just heard. On an ESP it is a whole number of dBm, always negative: about −30 close to the transmitter, −50 in the same room, −70 two walls away, and −90 at the edge of hearing. Every scan result, every Bluetooth advertisement and every received ESP-NOW frame carries one, and a connected station can read the strength of its link to the router.

### What the numbers mean

| RSSI (dBm) | What to expect |
|---|---|
| −30 to −50 | excellent: beside the router |
| −50 to −60 | good: full speed, no retries |
| −60 to −70 | fair: fine for sensors and web pages |
| −70 to −80 | weak: low data rates, retries, more battery used |
| below −80 | poor: dropouts and failed connections |

These are rules of thumb, not standards. The bars on a phone are each maker's own invention, and different chips are calibrated a few dB apart, so compare readings from the *same* chip.

### A reading is a noisy sample

Hold a board perfectly still and the RSSI still wanders by several dB. The signal reaches the antenna by many paths, direct and reflected from walls, furniture and people, and the copies add and cancel. This **multipath fading** has dips about half a wavelength apart, which is 6 cm at 2.4 GHz: moving a board by a hand's width can change the reading by 10 dB or more, and a person walking through the room changes it continually.

So never act on one reading. **Smooth** it: a moving average, or an exponential average $s \\leftarrow s + \\alpha\\,(x - s)$ with $\\alpha$ around 0.1 to 0.2, or a median of the last few. And for a decision, such as "the phone is near, switch the light on", use two thresholds, one to switch on and a lower one to switch off (**hysteresis**), or the light will flicker at the boundary.

### Strength is not quality, and not distance

A strong signal on a noisy channel still fails. What decides whether bits get through is the **signal-to-noise ratio**: the signal against the noise floor, about −101 dBm for a 20 MHz channel before the receiver adds its own noise, and much higher when other transmitters are busy ([[interference-and-channels]]). Nor is RSSI a distance. With a path-loss model you can turn it into one, but a spread of 5 to 10 dB makes the answer uncertain by a factor of two or more. Use RSSI for zones such as near, far and gone ([[ble-beacons]]), not for a tape measure.

> [!key] RSSI is the radio's own estimate of signal strength in dBm: −50 is good, −70 weak, −90 hopeless. It jumps by several dB even when nothing moves, so smooth it, use hysteresis for decisions, and remember that strength is neither quality nor distance.`,
  ideas: [
    'RSSI is a negative number of dBm: closer to zero is stronger, and about −50 is good and −70 weak.',
    'Multipath fading makes RSSI jump by several dB even for a still board; fades are about 6 cm apart at 2.4 GHz.',
    'Smooth readings with a moving or exponential average, and use two thresholds (hysteresis) for decisions.',
    'Strength is not quality (noise matters too) and not a reliable distance.'
  ],
  pitfalls: [
    'RSSI tells me how far away the device is — It tells how strong the signal is, which depends on walls, antennas, fading and orientation as much as on distance. Use it for rough zones, not metres.',
    'A strong signal means a fast, reliable link — Interference raises the noise and what counts is signal over noise. A neighbour on your channel can wreck a −45 dBm link.',
    'The exact RSSI of two different chips can be compared — Each chip is calibrated slightly differently and the figure is an estimate: trust changes on one device, not absolute values across devices.'
  ],
  terms: [
    { term: 'RSSI', also: ['received signal strength indicator', 'signal strength'], def: 'The radio\'s estimate of the strength of a received frame, reported by the ESP stack as a whole number of dBm, always negative. Closer to zero is stronger.' },
    { term: 'Noise floor', def: 'The level of background radio noise at the receiver, below which no signal can be heard. It is about −101 dBm for a 20 MHz channel at best, and higher where other transmitters are active.' },
    { term: 'Signal-to-noise ratio', also: ['SNR'], def: 'The signal level minus the noise level, in dB. It, rather than the signal alone, decides how fast and how reliably data gets through.' },
    { term: 'Multipath fading', also: ['fading', 'multipath'], def: 'Fluctuation of the received strength because the wave arrives along several paths whose copies add and cancel. Moving a few centimetres or a person walking by changes it.' },
    { term: 'Hysteresis', def: 'Using two thresholds, one to switch on and a lower one to switch off, so that a noisy reading hovering near the boundary does not make the output flicker.' }
  ],
  formulas: [
    {
      name: 'Noise floor of a receiver',
      expr: 'N = -174 + 10*log10(B) + NF',
      tex: 'N = -174 + 10\\log_{10} B + \\mathrm{NF}',
      vars: {
        N: { name: 'noise floor', unit: 'dBm', signed: true },
        B: { name: 'channel bandwidth', q: 'frequency', unit: 'MHz', value: 20 },
        NF: { name: 'receiver noise figure', q: 'gain', unit: 'dB', value: 6, tex: '\\mathrm{NF}' }
      },
      solveFor: 'N',
      note: '−174 dBm per hertz is the thermal noise at room temperature. The receiver adds its own noise, the noise figure; 6 dB is an assumed typical value, not a catalogue figure.'
    },
    {
      name: 'Signal-to-noise ratio',
      expr: 'SNR = S - N',
      tex: '\\mathrm{SNR} = S - N',
      vars: {
        SNR: { name: 'signal-to-noise ratio', q: 'gain', unit: 'dB', signed: true, tex: '\\mathrm{SNR}' },
        S: { name: 'signal (RSSI)', unit: 'dBm', value: -70, signed: true },
        N: { name: 'noise floor', unit: 'dBm', value: -95, signed: true }
      },
      solveFor: 'SNR',
      note: 'Both levels in dBm. Roughly 25 dB or more is needed for the fast Wi-Fi rates, a few dB for the slowest.'
    }
  ],
  quiz: [
    { q: 'Which reading is the stronger signal?', choices: ['−45 dBm', '−75 dBm', '−90 dBm', 'They are equal'], a: 0, why: 'RSSI is a level in dBm; closer to zero is more power. −45 dBm is thirty decibels, a factor of a thousand, stronger than −75 dBm.' },
    { q: 'You hold an ESP perfectly still and its RSSI wanders between −58 and −64 dBm. The most likely reason is:', choices: ['The chip is faulty', 'Multipath fading: reflected copies of the wave add and cancel as the room changes', 'The router changes its power every second', 'dBm is an unstable unit'], a: 1, why: 'Reflections from walls, furniture and moving people change the sum of the copies from moment to moment. A swing of several dB is normal; smooth it before using it.' },
    { q: 'An RSSI of −55 dBm guarantees a fast, reliable connection.', a: false, why: 'Strength is only half of it. On a busy channel the noise is high, the signal-to-noise ratio is poor and packets fail even at −55 dBm.' },
    { q: 'A light should switch on when a phone is near, judged by Bluetooth RSSI. What design avoids flickering?', choices: ['Switch on the first reading above a threshold', 'Average several readings and use two thresholds, one to switch on and a lower one to switch off', 'Compute the exact distance from one reading', 'Use the signal bars shown on the phone'], a: 1, why: 'A single reading is noisy by several dB. Averaging steadies it, and hysteresis (two thresholds) stops a value hovering at the boundary from toggling the output.' }
  ],
  applications: [
    'Showing signal bars on a display, and warning when a battery node is too weak to connect ([[wifi-troubleshooting]]).',
    'Presence detection: is the phone or the beacon in the room? ([[project-ble-presence]]).',
    'Walking a house with a board and a serial monitor to find the dead spots ([[antenna-placement-and-enclosures]]).',
    'Comparing two antenna positions or enclosures by their average RSSI ([[pcb-antennas]]).'
  ],
  sources: [
    'IEEE Std 802.11: receive signal strength indication, its definition and its reporting in the PHY.',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the RSSI fields of access point records and received packets.',
    'MicroPython documentation, *network.WLAN*: the status method and its rssi query (version 1.29).'
  ],
  code: [
    {
      title: 'A smoothed RSSI meter',
      about: 'Prints the raw signal strength of the link to your router twice a second, with a smoothed value and a quality word. The smoothing is an exponential average with a weight of 0.2 for each new reading.',
      needs: 'Any ESP32-family board with Wi-Fi, a router in range, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          set [smooth v] to (0)
        forever
          if <Wi-Fi connected?> then
            set [rssi v] to (signal strength)
            if <(smooth) = (0)> then
              set [smooth v] to (rssi)
            else
              change [smooth v] by ((0.2) * ((rssi) - (smooth)))
            end
            print (join [raw ] (rssi) [ dBm  smoothed ] (round (smooth)) [ dBm  ] (quality word for (smooth)))
          end
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const float ALPHA = 0.2;             // the weight of each new reading
        float smooth = 0;                    // 0 means "no reading yet": a real RSSI is never 0

        const char *quality(float dbm) {
          if (dbm >= -50) return "excellent";
          if (dbm >= -60) return "good";
          if (dbm >= -70) return "fair";
          if (dbm >= -80) return "weak";
          return "poor";
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
        }

        void loop() {
          if (WiFi.status() == WL_CONNECTED) {
            int rssi = WiFi.RSSI();          // dBm of the link to the router
            smooth = (smooth == 0) ? rssi : smooth + ALPHA * (rssi - smooth);
            Serial.printf("raw %d dBm  smoothed %.0f dBm  %s\n", rssi, smooth, quality(smooth));
          }
          delay(500);
        }
      `,
      py: String.raw`
        import network, time

        SSID = "your-ssid"
        PASS = "your-password"
        ALPHA = 0.2                          # the weight of each new reading
        smooth = None                        # None means "no reading yet"

        def quality(dbm):
            if dbm >= -50:
                return "excellent"
            if dbm >= -60:
                return "good"
            if dbm >= -70:
                return "fair"
            if dbm >= -80:
                return "weak"
            return "poor"

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)

        while True:
            if wlan.isconnected():
                rssi = wlan.status("rssi")   # dBm of the link to the router
                smooth = rssi if smooth is None else smooth + ALPHA * (rssi - smooth)
                print("raw %d dBm  smoothed %.0f dBm  %s" % (rssi, smooth, quality(smooth)))
            time.sleep_ms(500)
      `,
      output: `
        raw -58 dBm  smoothed -58 dBm  good
        raw -63 dBm  smoothed -59 dBm  good
        raw -55 dBm  smoothed -58 dBm  good
        raw -67 dBm  smoothed -60 dBm  good
        raw -71 dBm  smoothed -62 dBm  fair
      `,
      notes: ['A smaller ALPHA is steadier but slower to follow a real change; 0.1 to 0.2 suits a reading every half second.', 'WiFi.RSSI() returns 0 when there is no link, so test the connection first.']
    }
  ],
  sim: 'ra-rssi'
},

/* ================================================================ PCB antennas */
{
  id: 'pcb-antennas',
  parent: 'radio-and-antennas',
  title: 'PCB antennas and the keep-out',
  level: 2,
  short: 'The squiggle of copper at the end of a module is a tuned antenna, and it only works if nothing lies near it. What a printed antenna is, the keep-out rule, why a hand or a battery detunes it, and how to check a layout.',
  keywords: ['PCB antenna', 'trace antenna', 'meander antenna', 'inverted-F', 'IFA', 'MIFA', 'keep-out', 'keepout zone', 'ground plane', 'detuning', 'chip antenna', 'module antenna', 'hand effect', 'antenna placement', 'board edge'],
  prereq: ['radio-basics', 'link-budget', 'what-a-module-adds'],
  related: ['pcb-antenna-or-connector', 'antenna-placement-and-enclosures', 'matching-and-tuning', 'pcb-layout-for-modules', 'module-certification', 'external-antennas', 'electronics:antennas'],
  body: `The antenna of almost every ESP module is a piece of copper printed on the circuit board itself: a thin trace, folded back and forth (a **meander**) or bent into an **inverted F**, about a quarter wave long. It costs nothing and needs no connector. In the module catalogue roughly 50 of the 89 modules carry one, about 30 have a connector for an external antenna, and four system-in-package parts have none.

### What a printed antenna is

It is a resonator. Like a guitar string it responds strongly at the one frequency its length and shape set, which the designer tunes to the middle of the 2.4 GHz band, and weakly elsewhere. Its peak gain is modest, in the region of 0 to 3 dBi, and its pattern has lumps and nulls rather than a tidy doughnut ([[antenna-gain-and-patterns]]). The antenna also needs a **ground plane** beside it to push against, which is the odd part of the layout rule: ground under the module body, but none under or beside the antenna.

### The keep-out rule

Every module datasheet draws an area round the antenna and says the same thing: **keep it empty**. No copper on any layer, no ground pour, no traces, no components, no screws, no metal. In practice:

- Put the module at the **edge of the board** with the antenna end hanging beyond it or flush with it, never in the middle.
- Keep **batteries, displays, speakers, motors and USB shells** out of the zone and away from it; each one is metal, and batteries and displays are large sheets of it.
- Keep **metal enclosures, brackets and heat sinks** away, and keep cables from running past the antenna.
- Follow the drawing of *your* module for the dimensions: they differ between modules.

### Why a nearby object matters: detuning

The resonance depends on the electric field around the copper, so anything within a fraction of a wavelength (a few centimetres at 2.4 GHz) changes it. Plastic, the board itself and a hand lower the resonant frequency; metal can push it either way and also shorts out the field. The antenna then resonates at 2.3 GHz instead of 2.44 GHz and stops matching the chip: some power is reflected back instead of radiated ([[matching-and-tuning]]). Lossy objects, such as a hand or a battery, also soak power up as heat. Between them a hand round the end of a board commonly costs 3 to 6 dB, which is half the range indoors.

### Checking a layout

You cannot see an antenna's health, but you can measure its effect. Fix the board, take the average RSSI over a few seconds with and without the object, in the final enclosure and with the battery fitted, and compare: a drop of more than 3 dB is a warning ([[rssi-and-signal-quality]]). A network analyser shows the resonance itself.

> [!key] A PCB antenna is a quarter-wave resonator printed at the end of the module and tuned in free space. Keep the area the datasheet marks free of copper, parts, batteries and metal, put it at the board edge, and test in the real enclosure, because anything near it, a hand included, detunes it.`,
  ideas: [
    'A PCB antenna is a quarter-wave trace, meandered or inverted-F, tuned to the middle of 2.4 GHz with nothing near it.',
    'The keep-out zone round the antenna must be empty on every layer: no copper, parts, ground pour or metal.',
    'Put the antenna at the board edge, away from batteries, displays and metal enclosures.',
    'Nearby objects detune the antenna and absorb power: a hand costs 3 to 6 dB.'
  ],
  pitfalls: [
    'A ground plane under the antenna will improve it — The opposite. The antenna needs ground beside the module body, but copper under or around the antenna smothers it. Obey the keep-out in the datasheet.',
    'If the module is certified, my product\'s antenna is certain to work — The module is tuned alone on a standard board. Your battery, case and layout can each detune it, so test the finished product.',
    'The antenna is on the module, so the board underneath can be anything — The board edge, the ground plane and the neighbours of the antenna change its tuning and pattern. Use the module\'s layout guidance.'
  ],
  terms: [
    { term: 'PCB antenna', also: ['trace antenna', 'printed antenna'], def: 'An antenna made from a copper trace on the circuit board, usually meandered or inverted-F in shape and about a quarter of a wavelength long. It adds no component or cost.' },
    { term: 'Keep-out zone', also: ['keepout', 'clearance area'], def: 'The area round an antenna in which the board has no copper on any layer, and no components, traces or metal, so that the antenna can work as designed.' },
    { term: 'Inverted-F antenna', also: ['IFA', 'MIFA', 'meander antenna'], def: 'A compact antenna in which a trace runs parallel to the ground plane and is fed through a short stub, with a bend like an upside-down F. A meandered version folds the trace to save space.' },
    { term: 'Ground plane', def: 'A large sheet of copper connected to the circuit\'s ground. For a quarter-wave antenna it acts as the missing half; for the rest of the board it also carries return currents.' },
    { term: 'Detuning', also: ['antenna detuning'], def: 'A shift of an antenna\'s resonant frequency caused by nearby objects such as a hand, a battery or a case. The antenna then radiates poorly at the frequency in use.' }
  ],
  choose: {
    good: ['Small plastic products: no extra part, cost or connector', 'Boards where the antenna end can overhang the edge, in the open', 'Devices carried or fixed within a few metres of their access point'],
    avoid: ['Metal enclosures (use a connector and an external antenna)', 'Boards crowded with a battery and display beside the antenna', 'Products that need the most range you can get'],
    check: ['The keep-out drawing of your exact module', 'RSSI with the battery fitted and the case closed', 'Whether the case will be held in a hand']
  },
  examples: [
    {
      title: 'How much range does a hand cost?',
      q: 'A board with a PCB antenna reaches 40 m indoors. A hand wrapped round the antenna end costs 5 dB. With an indoor path-loss exponent of 3, how far does it reach now?',
      steps: ['In dB terms the range scales as $10^{-\\Delta/(10\\,n)}$. Here $\\Delta = 5$ dB and $n = 3$, so the factor is $10^{-5/30} = 0.68$.', 'New range: $40 \\times 0.68 = 27$ m.'],
      a: 'About 27 m: five decibels of detuning and absorption take a third off the range.'
    }
  ],
  quiz: [
    { q: 'Which of these belongs inside the antenna keep-out zone of a module?', choices: ['Nothing: no copper, parts or traces', 'A ground pour for shielding', 'The battery connector', 'The decoupling capacitors'], a: 0, why: 'The keep-out is to be empty on every layer. Copper or components near the radiating trace detune it and absorb or reflect its field.' },
    { q: 'Why does holding a board in your hand change its Wi-Fi range?', choices: ['The hand detunes the antenna and absorbs some of the power', 'The hand adds power to the signal', 'It heats the chip, which then transmits less', 'Static from the skin switches the radio off'], a: 0, why: 'A hand is a lossy dielectric close to the antenna: it shifts the resonance and soaks up part of the radiated power, commonly 3 to 6 dB.' },
    { q: 'A ground plane under a module\'s PCB antenna improves its range.', a: false, why: 'Copper under the antenna smothers it. The ground plane belongs under the module body and beside the antenna, not under it.' },
    { q: 'Where should the antenna end of a module sit on your own board?', choices: ['At the board edge, overhanging it if possible', 'In the middle of the board, where it is protected', 'Under the display', 'Next to the battery'], a: 0, why: 'The edge, with the free end beyond it or flush, leaves the antenna with air round it and a ground plane behind it, which is what it was tuned for.' }
  ],
  applications: [
    'Laying out a product round an ESP32-S3-WROOM-1 or ESP32-C3-MINI-1 module: the keep-out is the first thing placed ([[pcb-layout-for-modules]]).',
    'Understanding why a development board works better held by the edge than gripped round the antenna end ([[anatomy-of-a-dev-board]]).',
    'Deciding whether a small wearable can use a PCB antenna at all, with a body next to it ([[wearables-and-handhelds]]).',
    'Comparing two enclosure designs by measuring the signal strength of the same board in each ([[antenna-placement-and-enclosures]]).'
  ],
  sources: [
    'Espressif, module datasheets (for example ESP32-S3-WROOM-1 and ESP32-C3-MINI-1): the antenna placement and keep-out drawings.',
    'Espressif, *ESP32 Series Hardware Design Guidelines*: the RF layout section, covering module placement and clearance.',
    'Constantine A. Balanis, *Antenna Theory: Analysis and Design*: the inverted-F and monopole antenna over a ground plane.'
  ],
  code: [
    {
      title: 'Compare two placements by their average RSSI',
      about: 'Every ten seconds prints the mean, lowest and highest signal strength of the link to your router over 40 readings. Run it, note the mean, then change one thing (a hand over the antenna, the lid on, the battery moved) and read the next line.',
      needs: 'Any ESP32-family board with Wi-Fi, a router in range, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          repeat until <Wi-Fi connected?>
            wait (0.25) seconds
          end
        forever
          set [sum v] to (0)
          set [lowest v] to (127)
          set [highest v] to (-127)
          repeat (40)
            set [r v] to (signal strength)
            change [sum v] by (r)
            if <(r) < (lowest)> then
              set [lowest v] to (r)
            end
            if <(r) > (highest)> then
              set [highest v] to (r)
            end
            wait (0.25) seconds
          end
          print (join [mean ] ((sum) / (40)) [ dBm  lowest ] (lowest) [  highest ] (highest))
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const int SAMPLES = 40;              // 40 readings, a quarter of a second apart: ten seconds

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          long sum = 0;
          int lowest = 127, highest = -127;
          for (int i = 0; i < SAMPLES; i++) {
            int r = WiFi.RSSI();
            sum += r;
            if (r < lowest) lowest = r;
            if (r > highest) highest = r;
            delay(250);
          }
          Serial.printf("mean %.1f dBm  lowest %d  highest %d\n", sum / (float)SAMPLES, lowest, highest);
        }
      `,
      py: String.raw`
        import network, time

        SSID = "your-ssid"
        PASS = "your-password"
        SAMPLES = 40                         # 40 readings, a quarter of a second apart: ten seconds

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        while not wlan.isconnected():
            time.sleep_ms(250)

        while True:
            total = 0
            lowest, highest = 127, -127
            for i in range(SAMPLES):
                r = wlan.status("rssi")
                total += r
                lowest = min(lowest, r)
                highest = max(highest, r)
                time.sleep_ms(250)
            print("mean %.1f dBm  lowest %d  highest %d" % (total / SAMPLES, lowest, highest))
      `,
      output: `
        mean -61.3 dBm  lowest -66  highest -57
        mean -61.8 dBm  lowest -67  highest -56
        mean -68.9 dBm  lowest -75  highest -62
      `,
      notes: ['In this example the third line was taken with a hand wrapped round the antenna end: about 7 dB lower than the others. Differences of 1 to 2 dB are inside the noise of fading.', 'Keep the board still and the router unchanged between runs, and compare means, not single readings.']
    }
  ],
  sim: 'ra-keepout'
},

/* ================================================================ external antennas and connectors */
{
  id: 'external-antennas',
  parent: 'radio-and-antennas',
  title: 'External antennas and connectors',
  level: 2,
  short: 'When a printed antenna will not do (a metal box, a long path, a mast) the module offers a connector instead. The U.FL and MHF4 sockets, pigtails, SMA against RP-SMA, the 50 ohm rule, what a cable costs in decibels, and what a new antenna does to the approval.',
  keywords: ['external antenna', 'U.FL', 'IPEX', 'MHF1', 'MHF4', 'AMC', 'pigtail', 'SMA', 'RP-SMA', 'reverse polarity', 'coax', 'cable loss', '50 ohm', 'rubber duck', 'whip', 'FPC antenna', 'patch antenna', 'bulkhead', 'WROOM-1U'],
  prereq: ['pcb-antennas', 'decibels-and-dbm'],
  related: ['pcb-antenna-or-connector', 'antenna-gain-and-patterns', 'module-certification', 'link-budget', 'antenna-placement-and-enclosures', 'transmit-power-and-regulations', 'electronics:transmission-lines'],
  body: `A module with a PCB antenna is fine in a plastic box on a shelf. In a metal enclosure, on a roof, or at the end of a 30 m garden it is not. For those cases many modules come in a second version with a tiny coaxial socket in place of the printed antenna (the "U" modules, such as ESP32-C3-MINI-1U or ESP32-S3-WROOM-1U), and the antenna is a separate part you choose, place and point, with no keep-out to respect.

### The chain: socket, pigtail, antenna

The module's socket takes a **U.FL** plug (also sold as I-PEX MHF1 or Amphenol AMC, which mate with it; the S31 module datasheet in the catalogue lists exactly these). A short cable of thin coax, the **pigtail**, runs to the antenna or to a larger connector on the enclosure wall. Three facts:

- **U.FL is delicate.** Rated for only about thirty connections, it is lifted off with a tool, not pulled by the cable.
- **MHF4** (IPEX 4) is a newer, smaller connector with about half the footprint. It looks the same at a glance and does **not** fit a U.FL socket.
- **SMA and RP-SMA** are the screw connectors for antennas. The thread is identical; RP-SMA swaps the centre contacts. So an RP-SMA antenna *screws onto* an SMA socket, and the centre pin and socket never meet. Wi-Fi gear often uses RP-SMA; check before you buy.

Every part of the chain, from the module to the antenna, is **50 Ω**, and the antenna must be made for the 2.4 GHz band (a dual-band 2.4/5 GHz one for the ESP32-C5, [[five-ghz-and-six-ghz]]).

### Antenna types

| Type | Gain | Pattern | Use |
|---|---|---|---|
| Rubber-duck whip | 2 to 5 dBi | doughnut, all round | the usual choice |
| Flexible adhesive (FPC) | around 0 to 3 dBi | irregular | stuck inside a plastic case |
| Panel or patch | 6 to 9 dBi | one wide beam | one fixed direction |
| Yagi, dish | 10 dBi and more | narrow beam | long point-to-point links |

### Cables eat gain

Coax loses power by the metre, more the thinner and cheaper it is, and more as the frequency rises. Typical figures at 2.4 GHz are about 3 dB per metre for thin pigtail coax, 1 to 1.5 dB for RG174, about 1 dB for RG58 and 0.2 dB for thick low-loss cable. A 3 dBi antenna on 3 m of thin cable ends up 6 dB *worse* than the PCB antenna it was meant to improve. Keep the cable short and put the radio next to the antenna rather than the other way round.

### Approval

A module is certified with the antennas listed in its report; the datasheet of the ESP32-C3-WROOM-02U, for instance, names a 2.33 dBi monopole. Fitting a different antenna, particularly one of higher gain, can invalidate the approval and push the radiated power over the limit ([[module-certification]], [[transmit-power-and-regulations]]).

> [!key] A U-version module swaps the printed antenna for a U.FL (or MHF4) socket, a pigtail and an antenna you choose. Match the connector family and polarity, keep everything 50 Ω and the cable short, because thin coax can cost more than the antenna gains, and remember a new antenna changes the approval.`,
  ideas: [
    'A U-version module has a U.FL or MHF4 socket instead of a printed antenna and needs no keep-out zone.',
    'U.FL, MHF1 and AMC mate with one another, MHF4 is smaller and does not; SMA and RP-SMA thread together but do not connect.',
    'The whole chain is 50 Ω and must suit the band in use; the cable adds loss that can cancel an antenna\'s gain.',
    'Changing the antenna of a certified module changes its approval and may exceed the power limit.'
  ],
  pitfalls: [
    'A higher-gain antenna always improves a link — Gain only concentrates power in some directions, a cable can eat it, and a panel pointed the wrong way is worse than the printed antenna. And the legal limit may stop you.',
    'U.FL and MHF4 are the same thing in two sizes — They are different families and do not interchange. A pigtail for one will not fit the other.',
    'An RP-SMA antenna fits an SMA socket because it screws on — The threads match but the centre contacts do not, so no signal passes and the pin can be damaged.'
  ],
  terms: [
    { term: 'U.FL', also: ['IPEX', 'MHF1', 'AMC', 'u.FL connector'], def: 'A tiny coaxial snap-on connector used on modules for an external antenna. Hirose U.FL, I-PEX MHF I and Amphenol AMC are compatible; it is rated for only about thirty mating cycles.' },
    { term: 'MHF4', also: ['IPEX 4', 'MHF4L'], def: 'A smaller snap-on coaxial connector than U.FL, with about half its footprint, used where space is short. It is not compatible with U.FL.' },
    { term: 'Pigtail', also: ['antenna cable', 'coax jumper'], def: 'A short length of thin coaxial cable with a small connector on one end (U.FL or MHF4) and a larger one (SMA, RP-SMA) or a bare end on the other, joining a module to its antenna.' },
    { term: 'SMA and RP-SMA', also: ['reverse-polarity SMA'], def: 'Threaded coaxial connectors for antennas. RP-SMA has the same thread as SMA but with the centre pin and socket swapped, so the two do not make contact with each other.' },
    { term: '50 ohm', also: ['characteristic impedance'], def: 'The impedance of the cables, connectors and antennas in an ESP radio chain. Parts of the same impedance pass power without reflection; a mismatch sends some of it back.' }
  ],
  choose: {
    good: ['Metal enclosures, cabinets and vehicles, with the antenna outside', 'A mast, roof or window position better than the box\'s own', 'A directional antenna for one fixed link'],
    avoid: ['A small plastic product, where the connector and cable add cost, loss and a fragile joint', 'Long runs of thin pigtail', 'Fitting a stronger antenna to a certified module without checking the approval'],
    check: ['The connector family (U.FL or MHF4) and thread (SMA or RP-SMA)', 'That the antenna is 50 Ω and made for the band, dual-band for a C5', 'The loss per metre of the cable at 2.4 GHz']
  },
  formulas: [
    {
      name: 'Net gain of an antenna on a cable',
      expr: 'Gnet = G - a*l - Lc',
      tex: 'G_{\\mathrm{net}} = G - a\\,\\ell - L_{c}',
      vars: {
        Gnet: { name: 'net gain at the module', q: 'gain', unit: 'dB', signed: true, tex: 'G_{\\mathrm{net}}' },
        G: { name: 'antenna gain', q: 'gain', unit: 'dB', value: 3, signed: true },
        a: { name: 'cable loss per metre', unit: 'dB/m', value: 1, min: 0 },
        l: { name: 'cable length', q: 'length', unit: 'm', value: 2, tex: '\\ell' },
        Lc: { name: 'connector losses', q: 'gain', unit: 'dB', value: 0.5, min: 0, tex: 'L_{c}' }
      },
      solveFor: 'Gnet',
      note: 'Compare the result with the gain of the printed antenna you would otherwise use, about 0 dBi. Cable loss figures are typical values at 2.4 GHz: read the datasheet of the cable you buy.'
    }
  ],
  quiz: [
    { q: 'An RP-SMA antenna is screwed onto an SMA socket. What happens?', choices: ['The threads engage but the centre contacts do not meet: nothing is transmitted', 'It works, with about 3 dB loss', 'It works perfectly', 'The ESP32 resets'], a: 0, why: 'RP-SMA swaps the centre conductors but keeps the thread, so the parts screw together without connecting. Check "RP" on both parts.' },
    { q: 'A 3 dBi antenna is fitted on 4 m of thin coax losing 2 dB per metre. Compared with a 0 dBi printed antenna, the net gain is:', choices: ['5 dB worse', '3 dB better', '8 dB better', 'The same'], a: 0, why: 'Net gain is 3 − 4 × 2 = −5 dB, so the setup is 5 dB worse than the 0 dBi printed antenna. A short pigtail, or the radio near the antenna, avoids this.' },
    { q: 'U.FL and MHF4 connectors can be used interchangeably.', a: false, why: 'MHF4 is a smaller, different connector. A pigtail made for one does not fit the other. Look at the module\'s datasheet for which it has.' },
    { q: 'A product must go in a closed aluminium case. Which design is sound?', choices: ['A module with a printed antenna, inside, as it is', 'A U-version module with a short low-loss cable to an antenna on the outside of the case', 'The same module with the keep-out zone covered in foil', 'A longer firmware delay'], a: 1, why: 'A closed metal case shields a printed antenna almost completely. Bringing the antenna outside through a connector solves it, and the short cable keeps loss small.' }
  ],
  applications: [
    'A weatherproof sensor box in a metal enclosure with a bulkhead antenna on the outside ([[relay-and-industrial-boards]]).',
    'A garden or outbuilding link where an outdoor antenna and a short feed give the extra decibels ([[range-and-obstacles]]).',
    'The U-variants of the ESP32-C6, C5 and S3 modules in products that go in a cabinet ([[wroom-wrover-mini-pico]]).',
    'A wireless camera or gateway with two antennas for a better pattern ([[esp32-cam-boards]]).'
  ],
  sources: [
    'Espressif, module datasheets of the "U" variants (for example ESP32-C3-WROOM-02U, ESP32-S3-WROOM-1U): the connector and the certified antenna.',
    'Hirose Electric, U.FL series connector catalogue: the connector family, its dimensions and its rated number of mating cycles.',
    'Constantine A. Balanis, *Antenna Theory: Analysis and Design*: antenna types and their gains.'
  ],
  sim: 'ra-cable'
},

/* ================================================================ gain, pattern, polarization */
{
  id: 'antenna-gain-and-patterns',
  parent: 'radio-and-antennas',
  title: 'Gain, pattern and polarization',
  level: 2,
  short: 'An antenna cannot make power, only point it. What gain in dBi really means, the lobes and nulls of a radiation pattern, why a high-gain omni antenna has a thin beam, and how a rotated antenna loses the signal through polarization.',
  keywords: ['antenna gain', 'dBi', 'radiation pattern', 'polar plot', 'lobe', 'null', 'beamwidth', 'directivity', 'omnidirectional', 'directional', 'dipole', 'patch', 'Yagi', 'polarization', 'polarisation loss', 'vertical', 'horizontal', 'circular polarization', 'aiming'],
  prereq: ['decibels-and-dbm', 'external-antennas'],
  related: ['pcb-antennas', 'antenna-placement-and-enclosures', 'link-budget', 'transmit-power-and-regulations', 'physics:polarization', 'optics:polarizers-and-malus-law', 'electronics:antennas'],
  body: `An antenna cannot create power. A 9 dBi antenna radiates exactly as much as a 0 dBi one fed by the same transmitter; it simply puts the power where you want it and takes it away from everywhere else, as a reflector does for a torch. **Gain** is how much stronger the antenna is in its best direction than an imaginary antenna that radiates equally in all directions (an **isotropic radiator**), measured in dBi.
### The pattern

The **radiation pattern** is the picture of strength against direction, usually drawn as two polar plots: one cut round the horizon and one cut standing up. Its parts have names. The **main lobe** is the direction of peak gain, the **nulls** are directions with almost no signal, and the **beamwidth** is the angle over which the gain stays within 3 dB of the peak.

Gain and beamwidth trade against each other. Squeeze the beam in both planes and the power concentrates: $G \\approx 4\\pi/(\\theta_E\\theta_H)$, with the angles in radians, which is an upper bound that real antennas fall a little short of.

| Antenna | Gain | Shape |
|---|---|---|
| Isotropic (imaginary) | 0 dBi | a sphere |
| Half-wave dipole, whip | 2.15 dBi | a doughnut round the wire, about 78° thick |
| 5 dBi omnidirectional stick | 5 dBi | a flatter doughnut, about 35° thick |
| 9 dBi omnidirectional stick | 9 dBi | a thin pancake, about 15° thick |
| Patch or panel | 6 to 9 dBi | one beam of 60° to 90° |
| Yagi, dish | 10 dBi and more | a narrow beam of 30° or less |

The catch for an omnidirectional antenna is clear in the table: more gain means a *thinner* doughnut. A 9 dBi stick on the ground floor covers the room well, but reaches the floors above and below poorly.

### Polarization

A radio wave's electric field points in a direction, its **polarization**. A vertical whip sends vertically polarised waves and hears them best, and a receiving antenna tilted by an angle $\\theta$ from it loses $-20\\log_{10}|\\cos\\theta|$ dB: nothing at 0°, 3 dB at 45°, 6 dB at 60°, 15 dB at 80°, and at 90° almost everything. Indoors the walls scramble polarization, so the loss is smaller in practice, but across a clear garden the effect is large. A **circularly polarised** antenna, such as a helix or some patches, loses 3 dB against a linear one but does not care how it is rotated.

### What it means for an ESP

The printed antenna of a module has an irregular pattern, around 0 to 3 dBi with lumps and nulls ([[pcb-antennas]]). Turn a board through 90° and its signal can change by several dB, so for a fixed installation try the orientations and keep the best. Aim a high-gain antenna, and keep the polarization the same at both ends.

> [!key] Gain only concentrates power: more dBi means a narrower beam, and the pattern has nulls where almost nothing arrives. Match the polarization at both ends, because a linear antenna turned 90° loses almost everything in a clear path, and aim directional antennas.`,
  ideas: [
    'Gain in dBi is how much stronger an antenna is in its best direction than an isotropic one; it concentrates power, it does not add any.',
    'Higher gain means a narrower beam: a 9 dBi omnidirectional antenna has a pancake of about 15° and covers other floors poorly.',
    'A radiation pattern has a main lobe, side lobes and nulls; the printed antenna of a module has an irregular pattern of 0 to 3 dBi.',
    'A linear antenna turned by θ from its partner loses −20·log₁₀|cos θ|: 3 dB at 45°, 6 dB at 60°, almost everything at 90°.'
  ],
  pitfalls: [
    'A 9 dBi antenna gives me 9 dB more signal everywhere — Only in its main lobe, and only if it is aimed. Elsewhere it gives less than a plain antenna, and an omnidirectional one pays for its gain with a thinner beam.',
    'Gain makes the transmitter stronger — The transmitter\'s power is unchanged; the antenna redistributes it. That is also why a legal limit is placed on the combined power and gain ([[transmit-power-and-regulations]]).',
    'Polarization does not matter indoors with a printed antenna — It matters less because reflections mix it up, but a board rotated through 90° can still change by several dB. Test the orientation.'
  ],
  terms: [
    { term: 'Radiation pattern', also: ['antenna pattern', 'polar plot'], def: 'The strength an antenna radiates or receives in each direction, drawn as a polar plot of a horizontal and a vertical cut. Lobes are its peaks and nulls its near-zero directions.' },
    { term: 'Beamwidth', also: ['half-power beamwidth', '3 dB beamwidth'], def: 'The angle between the two directions, either side of the main lobe, at which the gain has fallen by 3 dB from its peak. Narrower beams have higher gain.' },
    { term: 'Polarization', also: ['polarisation'], def: 'The direction of the electric field of a radio wave: vertical, horizontal or rotating (circular). A receiving antenna works best when it is aligned with the wave.' },
    { term: 'Null', also: ['pattern null'], def: 'A direction in which an antenna radiates or receives almost nothing, which every real pattern has. Signals arriving from a null can be 20 dB or more weaker.' },
    { term: 'Omnidirectional antenna', also: ['omni'], def: 'An antenna that radiates equally in every direction of the horizontal plane. It is a doughnut, not a sphere, and its vertical beam grows thinner as its gain rises.' }
  ],
  choose: {
    good: ['Omnidirectional sticks when devices sit all round', 'A patch or panel for one fixed direction: a gate, a shed, a gateway at the end of a corridor', 'Matching the polarization at both ends of a fixed link'],
    avoid: ['High-gain omnidirectional antennas between floors', 'A directional antenna on a device that moves', 'Gain as the answer to a poor placement ([[antenna-placement-and-enclosures]])'],
    check: ['The beamwidth in both planes, not only the gain', 'The legal limit on gain with your transmit power', 'The orientation of the antennas at both ends']
  },
  formulas: [
    {
      name: 'Polarization mismatch loss',
      expr: 'Lp = -20*log10(cos(th))',
      tex: 'L_{p} = -20\\log_{10}\\cos\\theta',
      vars: {
        Lp: { name: 'polarization loss', q: 'gain', unit: 'dB', tex: 'L_{p}' },
        th: { name: 'angle between the polarizations', q: 'angle', unit: '°', value: 45, min: 0, max: 85, tex: '\\theta' }
      },
      solveFor: 'Lp',
      note: 'For two linearly polarised antennas in a clear path with no reflections. At 90° the loss is theoretically infinite and in practice 20 to 30 dB.'
    },
    {
      name: 'Gain from the beamwidths (upper bound)',
      expr: 'G = 10*log10(4*pi/(thE*thH))',
      tex: 'G = 10\\log_{10}\\frac{4\\pi}{\\theta_{E}\\,\\theta_{H}}',
      vars: {
        G: { name: 'gain', q: 'gain', unit: 'dB', signed: true },
        thE: { name: 'beamwidth in the E-plane', q: 'angle', unit: '°', value: 70, min: 5, max: 180, tex: '\\theta_{E}' },
        thH: { name: 'beamwidth in the H-plane', q: 'angle', unit: '°', value: 70, min: 5, max: 360, tex: '\\theta_{H}' }
      },
      solveFor: 'G',
      note: 'The ideal of a beam of uniform strength that radiates nothing outside it. Real antennas have side lobes and losses, and fall a few dB short.'
    }
  ],
  examples: [
    {
      title: 'What can a patch antenna give?',
      q: 'A patch antenna has a beamwidth of 70° in both planes. What is the upper limit of its gain?',
      steps: ['Convert to radians: $70° = 1.222$ rad.', 'The solid angle of the beam is about $1.222^2 = 1.49$ sr, and $4\\pi / 1.49 = 8.4$.', 'In decibels: $10\\log_{10}(8.4) = 9.3$ dBi.'],
      a: 'At most about 9.3 dBi. Real patch antennas, with side lobes and losses, reach 7 to 8 dBi.'
    }
  ],
  quiz: [
    { q: 'A 9 dBi antenna produces more power than a 2 dBi antenna fed by the same transmitter.', a: false, why: 'Both radiate the same total power. The 9 dBi antenna concentrates it in a narrower beam, so it is stronger in that direction and weaker elsewhere.' },
    { q: 'Two linearly polarised antennas in a clear path are turned 90° from each other. What is the received signal?', choices: ['Almost lost: tens of dB down', '3 dB lower', 'Unchanged', '6 dB higher'], a: 0, why: 'The loss follows −20 log₁₀|cos θ|, which grows without limit as θ approaches 90°. Reflections limit it indoors, but in the open the signal nearly vanishes.' },
    { q: 'What does an omnidirectional antenna give up when its gain is raised from 2 dBi to 9 dBi?', choices: ['It covers a thinner slice vertically, reaching other floors poorly', 'Nothing at all', 'Some of its channels', 'The ability to receive'], a: 0, why: 'Its extra gain comes from flattening the doughnut into a pancake: stronger round the horizon, weaker above and below it.' },
    { q: 'A linear antenna is tilted 60° from its partner. About how many decibels of polarization loss?', answer: 6, unit: 'dB', why: '−20 log₁₀(cos 60°) = −20 log₁₀(0.5) = 6.0 dB.' }
  ],
  applications: [
    'Choosing a patch antenna for a gateway that serves one end of a long hall ([[esp-now-gateway]]).',
    'Tilting the antennas of a router and an ESP-NOW node to the same polarization for the best signal ([[esp-now-topologies]]).',
    'Understanding why the same board reads different RSSI at different angles ([[rssi-and-signal-quality]]).',
    'Reading a datasheet\'s pattern plot to see where a module\'s nulls lie ([[module-certification]]).'
  ],
  sources: [
    'Constantine A. Balanis, *Antenna Theory: Analysis and Design*: gain, directivity, pattern and polarization loss.',
    'IEEE Std 145, *Definitions of Terms for Antennas*: the definitions of gain, beamwidth and polarization.',
    'Espressif, module datasheets: radiation pattern notes and the antenna gain of the certified antennas.'
  ],
  sim: 'ra-pattern'
},

/* ================================================================ placement and enclosures */
{
  id: 'antenna-placement-and-enclosures',
  parent: 'radio-and-antennas',
  title: 'Placement and enclosures',
  level: 2,
  short: 'Where the device sits, what it is made of and what stands round it matter as much as the antenna. A table of what plastic, metal, batteries and hands do, the height and orientation rules, and why you test in the finished box.',
  keywords: ['antenna placement', 'enclosure', 'plastic case', 'metal case', 'battery', 'display', 'height', 'orientation', 'RF window', 'conductive plastic', 'metallised paint', 'mounting', 'wall mount', 'dead spot', 'site survey', 'product design'],
  prereq: ['pcb-antennas', 'antenna-gain-and-patterns'],
  related: ['external-antennas', 'range-and-obstacles', 'rssi-and-signal-quality', 'enclosures', 'pcb-layout-for-modules', 'battery-pads-and-tiny-antennas', 'module-certification'],
  body: `A good antenna in a bad place is a bad antenna. The same module can reach 60 m on a bench and 12 m inside the finished product, with no change in the firmware. What stands within a few centimetres of the antenna, and where in the building the box sits, decide whether you get the range you expect.

### What lies near the antenna

| Near the antenna | What happens | What to do |
|---|---|---|
| Plastic case (ABS, polycarbonate) | slight detuning, about 0.5 to 2 dB, growing with thickness and with contact | leave an air gap of some millimetres; keep walls thin |
| Metallised paint, plated plastic, carbon-filled black plastic | behaves like metal | avoid, or leave a clear window |
| Metal case | shields almost totally, 30 dB or more | take the antenna outside ([[external-antennas]]) |
| Battery, heat sink, screws | detune and shadow, 3 to 6 dB or more | place at the far end of the board |
| Display, speaker, motor, USB shell | metal frames and noise | keep out of the keep-out zone and a few centimetres beyond ([[pcb-antennas]]) |
| A hand or body | absorbs, 3 to 6 dB | put the antenna on the side away from the body |
| Water, soil, plants | absorb | keep the antenna above ground and clear of them |
| Metal-coated (low-E) glass | blocks strongly | do not put the box behind it |

### Rules for the position

- **Height.** Mount at 1.5 to 2 m, on a wall or high shelf, not on the floor or inside a cabinet: the zone round the path ([[range-and-obstacles]]) stays clear.
- **Open side.** Point the antenna end towards the room the signal must reach, and the back towards the wall, the cupboard or the metal.
- **Orientation.** Match it to the access point's, usually upright, and try 90° steps ([[antenna-gain-and-patterns]]).
- **Distance from metal.** Several centimetres from a metal wall or rack: flat against metal smothers a printed antenna.
- **Cables.** Keep cables away from the antenna: they re-radiate and change the pattern.

### Products: design the antenna in

Decide the antenna first, before the box: a plastic housing with a clear space at the antenna end, or a window in the metal. Fix the battery at the opposite end. And **measure in the finished product**, with its battery, its lid closed and its cables fitted, in a hand and on a wall: a change of more than 3 dB against the bare board means the box has changed the antenna.

### Finding dead spots

Walls and furniture cast radio shadows, as the simulation shows behind a metal cabinet or a thick wall. Carry a board with a battery round the building and log the RSSI as you go. Move the *access point* before you move the device: one central, high router often does more than any antenna.

> [!key] What stands within centimetres of the antenna and where the box sits matter as much as the antenna's gain: keep the antenna at the open side, away from metal, batteries and bodies, mount high, match polarization, and measure in the finished product, because every case, battery and hand costs decibels.`,
  ideas: [
    'The same module can lose three quarters of its range in a product: the case, battery, hand and position matter.',
    'Metal shields; metallised or carbon-filled plastic acts as metal; ordinary plastic detunes a little, more when close.',
    'Mount high, with the antenna end towards the room and clear of metal, and match the polarization to the access point.',
    'Measure the finished product with battery, lid and cables, and compare with the bare board.'
  ],
  pitfalls: [
    'Plastic is invisible to radio — It detunes an antenna a little and absorbs a little, more the thicker and closer it is. Paint with metal flakes and carbon-filled plastic are nearly metal.',
    'If the bare board works on my desk, the product will — The case, the battery, the cable, your hand and the wall all change it. Test the finished product in place.',
    'A better antenna fixes a bad location — Gain cannot defeat a metal cabinet or a basement wall. Move the access point or the device first.'
  ],
  terms: [
    { term: 'RF window', also: ['radio window'], def: 'A part of a metal enclosure made of radio-transparent material, such as plastic, so that an antenna behind it can radiate.' },
    { term: 'Conductive plastic', also: ['carbon-filled plastic', 'metallised plastic'], def: 'Plastic made conductive by carbon, metal flakes or plating. At 2.4 GHz it shields and detunes almost like metal, so it must not cover an antenna.' },
    { term: 'Dead spot', also: ['coverage hole', 'radio shadow'], def: 'A place where the signal is too weak to use because walls, metal or distance take away more than the link margin. Moving the access point or the device often cures it.' },
    { term: 'Air gap', def: 'The clear space left between an antenna and a plastic case or other material. A few millimetres reduce the loading of the antenna and keep it closer to the frequency it was tuned for.' }
  ],
  examples: [
    {
      title: 'What the box costs',
      q: 'A bare board gives −62 dBm at a spot in the house. The same board in its finished box with the battery fitted reads −71 dBm. How many decibels did the box cost, and what does that do to the range indoors with an exponent of 3?',
      steps: ['The difference is $-62 - (-71) = 9$ dB.', 'The range scales as $10^{-\\Delta / (10 n)}$, here $10^{-9/30} = 0.50$.'],
      a: '9 dB, which halves the range. The placement of the battery and the case need to be rethought, not a firmware fix.'
    }
  ],
  quiz: [
    { q: 'A board with a printed antenna works well on the bench, but badly in a closed aluminium box. What is the sound fix?', choices: ['Take the antenna outside the box on a connector', 'Raise the transmit power', 'Add a ground plane inside', 'Change the Wi-Fi channel'], a: 0, why: 'A closed metal box blocks radio. The antenna must be outside it or behind a radio window; power, channel or ground cannot reach through the metal.' },
    { q: 'Black plastic that is filled with carbon is fine over an antenna because it is plastic.', a: false, why: 'Carbon filling makes plastic conductive, and at 2.4 GHz it shields and detunes almost like metal. Use a plain plastic window.' },
    { q: 'Which position gives the best chance of good signal for a small sensor box?', choices: ['On the floor behind a metal cabinet', 'High on a wall with the antenna end towards the room and clear of metal', 'Inside the cabinet next to the router', 'Tight against a steel pipe'], a: 1, why: 'Height, an open side and distance from metal keep the path clear and the antenna undisturbed. The other places are shadowed or loaded by metal.' },
    { q: 'You compare the finished product with the bare board and find it 4 dB weaker. What does that suggest?', choices: ['The enclosure, battery or cables are detuning or shadowing the antenna', 'The access point is broken', 'dB measurements are unreliable', 'Nothing: 4 dB is within the noise'], a: 0, why: 'Fading averages out over several seconds. A consistent 4 dB means a real change: the box has altered the antenna and may be worth redesigning.' }
  ],
  applications: [
    'Designing a plastic enclosure for a battery sensor so that the antenna end is clear ([[enclosures]]).',
    'Siting a smart-home gateway centrally and high before adding extra access points ([[thread-border-router-hardware]]).',
    'Choosing a tiny board with an antenna that must survive being put near a battery ([[battery-pads-and-tiny-antennas]]).',
    'Surveying a house for dead spots with a board and a battery ([[wifi-troubleshooting]]).'
  ],
  sources: [
    'Espressif, *ESP32 Series Hardware Design Guidelines*: the placement of the module and the effect of the enclosure on the antenna.',
    'Espressif, module datasheets: the antenna keep-out drawings and the notes on placing the module in a product.',
    'Constantine A. Balanis, *Antenna Theory: Analysis and Design*: how nearby conductors and dielectrics change an antenna.'
  ],
  code: [
    {
      title: 'A walk test: log the signal as you move',
      about: 'Once a second prints the time and the signal strength of the link to your router, marks readings below −75 dBm and says when the link is lost. Carry the board round the building and note where it goes weak.',
      needs: 'Any ESP32-family board with Wi-Fi and a way to see the output while you walk (a laptop on the serial monitor, or a USB power bank and a phone with a serial app).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
        forever
          set [seconds v] to ((milliseconds since start) / (1000))
          if <Wi-Fi connected?> then
            set [rssi v] to (signal strength)
            if <(rssi) < (-75)> then
              print (join (seconds) [ s  ] (rssi) [ dBm  <- weak])
            else
              print (join (seconds) [ s  ] (rssi) [ dBm])
            end
          else
            print (join (seconds) [ s  no link])
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const int WEAK_DBM = -75;            // mark anything below this

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
        }

        void loop() {
          unsigned long seconds = millis() / 1000;
          if (WiFi.status() == WL_CONNECTED) {
            int rssi = WiFi.RSSI();
            Serial.printf("%5lu s  %d dBm%s\n", seconds, rssi, rssi < WEAK_DBM ? "  <- weak" : "");
          } else {
            Serial.printf("%5lu s  no link\n", seconds);
          }
          delay(1000);
        }
      `,
      py: String.raw`
        import network, time

        SSID = "your-ssid"
        PASS = "your-password"
        WEAK_DBM = -75                       # mark anything below this

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)

        while True:
            seconds = time.ticks_ms() // 1000
            if wlan.isconnected():
                rssi = wlan.status("rssi")
                print("%5d s  %d dBm%s" % (seconds, rssi, "  <- weak" if rssi < WEAK_DBM else ""))
            else:
                print("%5d s  no link" % seconds)
            time.sleep_ms(1000)
      `,
      output: `
           41 s  -52 dBm
           42 s  -57 dBm
           43 s  -66 dBm
           44 s  -78 dBm  <- weak
           45 s  -81 dBm  <- weak
           46 s  no link
      `,
      notes: ['Walk at an even pace and hold the board the way the product will be held; the readings jump several dB from fading, so look for trends over several seconds.', 'To log without a laptop, write the lines to a file on the board and read them afterwards ([[logging-data]]).']
    }
  ],
  sim: 'ra-floorplan'
},

/* ================================================================ range, walls and the Fresnel zone */
{
  id: 'range-and-obstacles',
  parent: 'radio-and-antennas',
  title: 'Range, walls and the Fresnel zone',
  level: 2,
  short: 'What really sets the range of a link: walls and floors, people, the ground, and the football-shaped Fresnel zone round the straight line between the antennas. Typical losses, the 60 per cent rule, and why raising the antennas matters.',
  keywords: ['range', 'obstacles', 'walls', 'wall loss', 'Fresnel zone', 'line of sight', 'diffraction', 'knife edge', 'shadowing', 'ground reflection', 'antenna height', 'path-loss exponent', 'outdoor range', 'mast', 'floors', 'foliage'],
  prereq: ['link-budget', 'antenna-gain-and-patterns'],
  related: ['antenna-placement-and-enclosures', 'five-ghz-and-six-ghz', 'external-antennas', 'wifi-long-range-mode', 'choosing-a-long-range-link', 'physics:wave-reflection', 'optics:fresnel-diffraction-and-zone-plates'],
  body: `The link budget gave range as a distance in free space. Real links run through walls, past people and over the ground, and each of those takes decibels away. Two ideas explain most of what you will see: obstacles add losses that you can tabulate, and radio travels in a *zone*, not along a line.

### Walls, floors and people

Typical losses for 2.4 GHz, rounded, for one wall or floor in the path:

| Obstacle | Loss |
|---|---|
| Plasterboard (drywall) partition | about 3 dB |
| Wooden door, ordinary glass window | 2 to 4 dB |
| Brick wall | 5 to 10 dB |
| Concrete wall or floor | 10 to 15 dB |
| Reinforced concrete, foil insulation, metal door | 20 dB or more |
| A person | 3 to 5 dB |

They add: three brick walls are 15 to 30 dB, which is as much as a ten-fold change of distance in free space. Inside a building the open-air loss also grows faster than free space, which the path-loss exponent captures ([[link-budget]]). Metal and wet things reflect or absorb, so a lift shaft, a fridge, a water tank or a rack of foil-backed insulation casts a shadow.

### The Fresnel zone

Radio does not follow a thread between two antennas. It spreads, and the energy that arrives has taken paths of slightly different length, which add or cancel. The paths that arrive within half a wavelength of the direct one form the **first Fresnel zone**: a rugby-ball shape between the antennas. At the middle of a link of length $d$ its radius is

$$r = \\tfrac{1}{2}\\sqrt{\\lambda d}$$

which is **1.75 m for a 100 m link and 5.5 m for a 1 km link** at 2.4 GHz (at 5.5 GHz it is about two thirds as wide). Obstacles that poke into this zone cost power even though they do not touch the straight line. The rule is to keep **at least 60 per cent of the zone clear**. An obstacle that just touches the line costs about 6 dB, and one that cuts well across it 15 to 25 dB, because the wave has to bend round the edge (**diffraction**).

### The ground, height and foliage

This is why antenna height matters outdoors. Two antennas at 0.3 m over grass have the ground inside the Fresnel zone, and the wave reflected from it arrives out of step with the direct one and can cancel it. At 2 m the zone mostly clears the ground, and the same hardware reaches much further. Wet foliage and hedges absorb, and the leaves of a tree on the line cost several dB.

### What to do

Raise the antennas, find or make a line of sight, use a repeater or a mesh ([[mesh-networks-on-esp]]), accept a lower data rate (and a longer range) or move to a lower frequency with LoRa ([[choosing-a-long-range-link]]).

> [!key] Walls cost 3 dB (plasterboard) to 20 dB or more (reinforced concrete) each, and add up. Radio travels in a Fresnel zone 1.75 m wide for 100 m at 2.4 GHz, so keep 60 per cent of it clear, and raise the antennas above the ground.`,
  ideas: [
    'Each wall or floor takes 3 dB (plasterboard) up to 20 dB or more (reinforced concrete) off the signal; losses add up.',
    'Radio travels in the first Fresnel zone, about 1.75 m wide for a 100 m link at 2.4 GHz; keep 60 per cent of it clear.',
    'An obstacle that just grazes the line of sight costs about 6 dB; one that cuts across it costs 15 to 25 dB.',
    'Raising the antennas lifts the ground out of the Fresnel zone, which can win back many decibels on an outdoor link.'
  ],
  pitfalls: [
    'If I can see the other antenna, nothing blocks the link — Obstacles within the Fresnel zone cost power even when the straight line is clear, and the ground reflects. A clear line of sight is necessary, not sufficient.',
    'Radio goes round corners as light does not — It diffracts a little, with a loss of 15 to 25 dB or more, and it reflects off walls. A corner costs far more than a clear path.',
    'The wall figures are fixed numbers — They depend on thickness, material, reinforcement and angle. Use them as estimates and measure the real house.'
  ],
  terms: [
    { term: 'Line of sight', also: ['LOS'], def: 'A straight path between two antennas with no obstacle on it. It is needed for a good link but is not enough: the area round it, the Fresnel zone, must be clear too.' },
    { term: 'Fresnel zone', also: ['first Fresnel zone'], def: 'The rugby-ball shaped region between two antennas within which paths differ from the direct one by less than half a wavelength. Obstacles in it reduce the received power.' },
    { term: 'Diffraction', also: ['knife-edge diffraction'], def: 'The bending of a wave round an obstacle\'s edge. It lets a little signal reach behind a wall or a hill, with a loss of 6 dB at grazing and more for deeper shadow.' },
    { term: 'Shadowing', also: ['shadow fading'], def: 'The loss of signal behind a large obstacle, as opposed to the quick ups and downs of multipath fading. It changes slowly as you move round the object.' }
  ],
  formulas: [
    {
      name: 'Radius of the first Fresnel zone',
      expr: 'r = sqrt(c*d1*d2/(f*(d1 + d2)))',
      tex: 'r = \\sqrt{\\frac{c\\, d_{1} d_{2}}{f\\,(d_{1} + d_{2})}}',
      vars: {
        r: { name: 'zone radius', q: 'length', unit: 'm' },
        c: { const: 'c' },
        d1: { name: 'distance to one antenna', q: 'length', unit: 'm', value: 50, tex: 'd_{1}' },
        d2: { name: 'distance to the other antenna', q: 'length', unit: 'm', value: 50, tex: 'd_{2}' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 2442 }
      },
      solveFor: 'r',
      note: 'At the middle of a link d1 = d2, and the radius is half the square root of the wavelength times the length. Keep 60 per cent of this clear.'
    },
    {
      name: 'What a loss of decibels does to the range',
      expr: 'R2 = R1*10^(-dL/(10*n))',
      tex: 'R_{2} = R_{1}\\, 10^{-\\Delta L / (10\\,n)}',
      vars: {
        R2: { name: 'new range', q: 'length', unit: 'm', tex: 'R_{2}' },
        R1: { name: 'old range', q: 'length', unit: 'm', value: 40, tex: 'R_{1}' },
        dL: { name: 'extra loss (negative for a gain)', q: 'gain', unit: 'dB', value: 6, signed: true, tex: '\\Delta L' },
        n: { name: 'path-loss exponent', q: 'ratio', value: 3, min: 1.5, max: 6 }
      },
      solveFor: 'R2',
      note: 'With n = 2 (free space) 6 dB halves the range; with n = 3 (a house) it takes it down to 63 per cent.'
    }
  ],
  examples: [
    {
      title: 'How high must the posts be?',
      q: 'A 2.4 GHz link of 100 m runs across a flat lawn. What clearance does the middle of the link need above the grass?',
      steps: ['The first Fresnel radius at the middle is $r = \\tfrac{1}{2}\\sqrt{\\lambda d} = \\tfrac{1}{2}\\sqrt{0.123 \\times 100} = 1.75$ m.', 'Sixty per cent of it is $0.6 \\times 1.75 = 1.05$ m.'],
      a: 'About 1.05 m above the ground at the middle, so antennas on posts about 1.5 to 2 m high clear it comfortably, while 0.3 m is well inside the zone.'
    }
  ],
  quiz: [
    { q: 'What is the radius of the first Fresnel zone at the middle of a 100 m link at 2.44 GHz, in metres?', answer: 1.75, unit: 'm', why: 'r = ½ √(λ d) = ½ √(0.1229 × 100) = ½ × 3.5 = 1.75 m.' },
    { q: 'An obstacle just touches the straight line between two antennas. About how much loss does it add?', choices: ['About 6 dB', 'None', 'About 30 dB', 'About 1 dB'], a: 0, why: 'At grazing incidence half of the first Fresnel zone is blocked and the diffraction loss is about 6 dB. It rises quickly as the obstacle cuts deeper.' },
    { q: 'How much of the first Fresnel zone should be kept clear for a dependable link?', choices: ['About 60 per cent or more', 'None: only the straight line matters', 'All of it and the second zone', 'About 10 per cent'], a: 0, why: 'At 60 per cent clearance the extra loss is close to zero. With less, the loss grows quickly.' },
    { q: 'Moving the same link from 2.4 GHz to 5 GHz makes its Fresnel zone narrower.', a: true, why: 'The radius is proportional to the square root of the wavelength, so a higher frequency gives a narrower zone: about two thirds as wide at 5.5 GHz.' }
  ],
  applications: [
    'Placing an ESP-NOW sensor at the far end of a garden so that a post, not the lawn, carries the antenna ([[esp-now-topologies]]).',
    'Estimating how many walls a Wi-Fi sensor can sit behind, from the budget ([[link-budget]]).',
    'Deciding when LoRa or a mesh is cheaper than fighting for another 10 dB ([[choosing-a-long-range-link]], [[mesh-networks-on-esp]]).',
    'Siting a Zigbee or Thread router between rooms so that two neighbouring ones see it ([[choosing-a-smart-home-radio]]).'
  ],
  sources: [
    'ITU-R Recommendation P.526: propagation by diffraction, the Fresnel zone and knife-edge loss.',
    'ITU-R Recommendation P.1238: propagation data for indoor radio systems, including wall and floor losses.',
    'Theodore S. Rappaport, *Wireless Communications: Principles and Practice*: path loss, shadowing and the Fresnel zones.'
  ],
  sim: 'ra-fresnel'
},

/* ================================================================ interference and channels */
{
  id: 'interference-and-channels',
  parent: 'radio-and-antennas',
  title: 'Interference and channels',
  level: 2,
  short: 'Wi-Fi, Bluetooth, Zigbee, Thread and the neighbours\' gadgets all sit in the same 83 MHz. How their channel plans fit together, why an overlapping channel is worse than a shared one, what a microwave oven and a USB 3 cable do, and how to choose channels.',
  keywords: ['interference', 'coexistence', 'channel plan', 'co-channel', 'adjacent channel', 'channel 1 6 11', 'Zigbee channel', 'BLE channels', 'advertising channels', 'frequency hopping', 'adaptive frequency hopping', 'microwave oven', 'USB 3.0 noise', 'airtime', 'congestion', 'crowded band'],
  prereq: ['radio-basics', 'rssi-and-signal-quality'],
  related: ['wifi-basics', 'wifi-scanning', 'the-shared-radio', 'esp-now-with-wifi', 'ieee-802-15-4', 'ble-advertising', 'five-ghz-and-six-ghz', 'wifi-and-ble-analysers', 'spectrum-analysers-and-vnas'],
  body: `The 2.4 GHz band is 83.5 MHz wide, and everything in it shares that. Your ESP, your router, the phones, a neighbour's Wi-Fi, a Zigbee light, a baby monitor and a microwave oven all take turns, or fail to.

### Who is in the band

| Radio | Channels | Spacing and width | Behaviour |
|---|---|---|---|
| Wi-Fi | 1 to 13 (14 in Japan) | 5 MHz apart, about 20 MHz wide | sits on one channel; only 1, 6 and 11 are clear of each other |
| Bluetooth Classic | 79 | 1 MHz | hops 1600 times a second, and avoids busy channels |
| Bluetooth LE | 40 | 2 MHz apart | 37 data channels hop; advertising uses 37, 38, 39 at 2402, 2426, 2480 MHz |
| Zigbee, Thread | 16 (numbered 11 to 26) | 5 MHz apart, about 2 MHz wide | sits on one channel |
| Not radios | | | microwave ovens, USB 3 cables and hubs, switching power supplies, LED drivers |

The three Bluetooth advertising channels sit in the gaps between Wi-Fi channels 1, 6 and 11. So do four Zigbee and Thread channels: **15, 20, 25 and 26**. Pick one of them if your Wi-Fi uses 1, 6 or 11.

### How they live together

- **Wi-Fi listens before it speaks.** Two networks on the *same* channel take turns, sharing the airtime between them. Two on *overlapping* channels (1 and 3, say) do not recognise one another's transmissions as Wi-Fi and so do not wait: they collide. An overlapping neighbour is worse than one on your own channel, which is why 1, 6 and 11 are the standard choices.
- **Bluetooth hops.** A connection moves to a new channel for every event, and a channel map lets it leave channels where it keeps failing. Advertising is the weak point, because its three channels are fixed.
- **Zigbee and Thread stay put**, so their channel is chosen once, and chosen well.
- **One chip, one radio.** An ESP that runs Wi-Fi and Bluetooth, or Wi-Fi and ESP-NOW, shares one radio and one antenna and takes turns, so each slows when the other is busy ([[the-shared-radio]], [[esp-now-with-wifi]]). ESP-NOW uses the chip's Wi-Fi channel.

### Noise that is not a radio

A microwave oven leaks around 2.45 GHz while it runs, in bursts at the mains rhythm, and can stall nearby Wi-Fi and Bluetooth. USB 3 cables, ports and hubs radiate broad noise in this band: keep antennas away from them.

### Symptoms and cures

Slowness, retries and drops that come and go with the time of day, or with the oven, point to interference rather than weak signal ([[rssi-and-signal-quality]]). The cures, roughly in order of effect: a cable or 5 GHz for a fixed device ([[five-ghz-and-six-ghz]]), the quietest of channels 1, 6 and 11 on the router, a Zigbee channel in a gap, distance from the source, and fewer, smaller messages. A scan counts the neighbours; a spectrum analyser shows the rest ([[spectrum-analysers-and-vnas]]).

> [!key] All 2.4 GHz radios share 83.5 MHz: use Wi-Fi channels 1, 6 and 11, put Zigbee or Thread on 15, 20, 25 or 26, and keep antennas away from microwave ovens and USB 3 cables. An overlapping channel is worse than a shared one.`,
  ideas: [
    'Wi-Fi, Bluetooth, Zigbee and Thread all share 2400 to 2483.5 MHz with different channel plans.',
    'Same-channel Wi-Fi networks share airtime politely; overlapping channels collide, so use 1, 6 or 11.',
    'Zigbee and Thread channels 15, 20, 25 and 26 and the BLE advertising channels sit in the gaps between Wi-Fi 1, 6 and 11.',
    'Microwave ovens, USB 3 cables and switching supplies add noise; 5 GHz or a cable avoids the crowd.'
  ],
  pitfalls: [
    'Changing my router to channel 3 will avoid my neighbour on channel 1 and 6 — Channel 3 overlaps both, so it collides with both instead of sharing airtime with one. Use 1, 6 or 11.',
    'More power cures interference — A louder transmitter wins briefly and adds noise for everyone else, including your own other devices. Move channel, band or place instead.',
    'Bluetooth and Wi-Fi are different technologies, so they do not interfere — They share the band; coexistence between them has to be managed in time and by hopping, and on one chip they share a single radio.'
  ],
  terms: [
    { term: 'Co-channel interference', also: ['same-channel interference'], def: 'Interference from another network on the same channel. Wi-Fi devices detect each other and take turns, so airtime is shared rather than lost.' },
    { term: 'Adjacent-channel interference', also: ['overlapping channels'], def: 'Interference from a network on a nearby, overlapping channel. The devices do not recognise each other as Wi-Fi and do not wait, so their frames collide.' },
    { term: 'Frequency hopping', also: ['AFH', 'adaptive frequency hopping'], def: 'Moving a connection to a different channel at every step, in a pattern both ends know. Bluetooth does so, and can drop channels that keep failing (adaptive hopping).' },
    { term: 'Coexistence', def: 'The set of rules and arbitration by which radios in the same band, or on the same chip, avoid disturbing one another, by taking turns, hopping or choosing clear channels.' },
    { term: 'Airtime', def: 'The time a channel spends carrying a device\'s transmissions. Every device on a channel, including other networks\', uses a share of it.' }
  ],
  choose: {
    good: ['Wi-Fi on channel 1, 6 or 11, whichever the scan shows quietest', 'Zigbee or Thread on 15, 20, 25 or 26 when Wi-Fi is on 1, 6 or 11', '5 GHz or a cable for fixed devices that need bandwidth'],
    avoid: ['Wi-Fi on any of the in-between channels', '40 MHz channels on a crowded 2.4 GHz band', 'Putting Zigbee or Thread on the channel of your strongest Wi-Fi network'],
    check: ['A scan from the place where the device will sit ([[wifi-scanning]])', 'Whether the interference follows a pattern in time', 'That ESP-NOW nodes and the Wi-Fi station use the same channel']
  },
  quiz: [
    { q: 'Your Wi-Fi is on channel 6. Which Zigbee channel sits clear of channels 1, 6 and 11?', choices: ['Channel 20', 'Channel 17', 'Channel 18', 'Channel 22'], a: 0, why: 'Zigbee channel 20 is at 2450 MHz, between Wi-Fi 6 (up to about 2447) and Wi-Fi 11 (from about 2452). Channels 17, 18 and 22 fall inside Wi-Fi 6 or 11.' },
    { q: 'Why is a neighbour on channel 3 worse for your router on channel 1 than a neighbour on channel 1?', choices: ['Overlapping channels do not hear each other as Wi-Fi and so do not take turns: they collide, while same-channel networks share the airtime', 'Channel 3 is faster', 'Channel numbers are unrelated to frequency', 'It is not worse'], a: 0, why: 'Wi-Fi\'s politeness (listen before transmitting) works only when a device recognises the other\'s transmission, which needs the same channel.' },
    { q: 'A Wi-Fi network moved to 5 GHz no longer interferes with Bluetooth LE devices.', a: true, why: 'Bluetooth LE lives only in the 2.4 GHz band. A network on 5 GHz does not overlap it at all.' },
    { q: 'Wi-Fi drops out each time the kitchen microwave runs. What is the best fix?', choices: ['Move the devices or antennas away from it, or use 5 GHz or a cable', 'Raise the transmit power to maximum', 'Nothing: ovens do not affect radio', 'Turn off Bluetooth'], a: 0, why: 'The oven leaks around 2.45 GHz while it runs. Distance, another band or a cable avoids it; more power adds to the noise.' }
  ],
  applications: [
    'Choosing the channel of a Zigbee or Thread network so it clears the house Wi-Fi ([[zigbee]], [[thread]]).',
    'Setting the Wi-Fi channel of a router after a scan ([[wifi-scanning]]).',
    'Understanding why a Bluetooth device loses its connection when the Wi-Fi is busy ([[ble-advertising]]).',
    'Keeping a sensor\'s antenna away from a USB 3 hub on the same desk ([[usb-on-the-esp]]).'
  ],
  sources: [
    'IEEE Std 802.11: the 2.4 GHz channel plan and the medium access rules (carrier sense).',
    'Bluetooth Core Specification: the channel map, the channel selection algorithms and adaptive frequency hopping.',
    'IEEE Std 802.15.4: the 2.4 GHz channels 11 to 26 used by Zigbee and Thread.'
  ],
  code: [
    {
      title: 'Choose the quietest of channels 1, 6 and 11',
      about: 'Scans once, then for each of the three standard channels adds up the power of every network that overlaps it, counting a network fully on the same channel and less as its channel moves away. The channel with the least interference is the one to give your router.',
      needs: 'Any ESP32-family board with Wi-Fi and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          scan networks :: wifi
          for each [c v] in (list 1 6 11)
            set [load v] to (0)
            for each [net v] in (scan results)
              set [apart v] to (abs of ((channel of [net]) - (c)))
              if <(apart) < (4)> then
                change [load v] by (((1) - ((apart) / (4))) * (10 to the power ((signal of [net]) / (10))))
              end
            end
            print (join [channel ] (c) [  interference ] (10 * log10 of (load)) [ dBm])
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.disconnect();
          int n = WiFi.scanNetworks();

          const int candidates[] = {1, 6, 11};
          for (int c : candidates) {
            float load = 0;                                       // interfering power in milliwatts
            for (int i = 0; i < n; i++) {
              int apart = abs(WiFi.channel(i) - c);
              if (apart >= 4) continue;                           // 4 channels apart or more: no overlap
              float overlap = 1.0f - apart / 4.0f;                // 1 on the same channel, falling to 0
              load += overlap * powf(10.0f, WiFi.RSSI(i) / 10.0f);
            }
            float dbm = load > 0 ? 10.0f * log10f(load) : -120.0f;
            Serial.printf("channel %2d  interference %.1f dBm\n", c, dbm);
          }
          WiFi.scanDelete();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, math

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.disconnect()
        found = wlan.scan()                                       # (ssid, bssid, channel, rssi, auth, hidden)

        for c in (1, 6, 11):
            load = 0.0                                            # interfering power in milliwatts
            for ssid, bssid, channel, rssi, auth, hidden in found:
                apart = abs(channel - c)
                if apart >= 4:                                    # 4 channels apart or more: no overlap
                    continue
                overlap = 1.0 - apart / 4.0                       # 1 on the same channel, falling to 0
                load += overlap * 10 ** (rssi / 10)
            dbm = 10 * math.log10(load) if load > 0 else -120.0
            print("channel %2d  interference %.1f dBm" % (c, dbm))
      `,
      output: `
        channel  1  interference -66.0 dBm
        channel  6  interference -52.0 dBm
        channel 11  interference -70.0 dBm
      `,
      notes: ['The lowest figure wins: in this example channel 11, because the strongest neighbour is on channel 6. The weights are a simple model of 20 MHz signals, not a measurement.', 'Scan from where the device will sit, and again at another time of day: the neighbours change.']
    }
  ],
  sim: 'ra-band'
},

/* ================================================================ transmit power and the rules */
{
  id: 'transmit-power-and-regulations',
  parent: 'radio-and-antennas',
  title: 'Transmit power and the rules',
  level: 2,
  short: 'The air belongs to everyone, so power, channels and duty cycle are regulated. EIRP and conducted power, the 2.4 GHz limits in Europe and the United States, how to set an ESP\'s transmit power, and what changing an antenna does to an approval.',
  keywords: ['transmit power', 'EIRP', 'conducted power', 'regulation', 'ETSI', 'FCC', 'CE', 'RED', 'duty cycle', 'country code', 'regulatory domain', 'certification', 'WiFi.setTxPower', 'txpower', 'max tx power', 'antenna gain limit', 'ISM', 'check your country\'s rules'],
  prereq: ['decibels-and-dbm', 'external-antennas', 'antenna-gain-and-patterns'],
  related: ['module-certification', 'regulatory-approval', 'regulations-cra-and-red', 'link-budget', 'five-ghz-and-six-ghz', 'lora-parameters', 'battery-life-budget', 'wifi-power-save-and-dtim'],
  body: `A louder transmitter drowns its neighbours, and radio is also used by aircraft, radar, weather services and medical devices, so every country limits what an unlicensed device may do: its power, its channels, how often it may transmit, and how it is tested and marked. This page explains the principles; the figures differ by country and change, so **check your country's rules** or ask a test laboratory.

### Two ways to count power

- **Conducted power** is what leaves the radio, measured at the antenna socket.
- **EIRP**, the *effective isotropic radiated power*, adds what the antenna does: $\\mathrm{EIRP} = P_{tx} - L_{cable} + G_{antenna}$, in dBm.

Regulators use one or the other, or both. In **Europe** the 2.4 GHz limit is about **20 dBm EIRP** (100 mW) for Wi-Fi, Bluetooth and Zigbee. In the **United States** the rule allows up to **1 W (30 dBm) conducted** with an antenna of up to 6 dBi, and then asks for a decibel less power for each decibel of gain above that. Other countries differ again.

### On the ESP

The catalogue gives the largest output of each chip: **19.5 dBm** on the ESP32, **21 dBm** on the ESP32-S3, C3 and C6, **20 dBm** on the ESP32-C5 and H2. These apply to the slowest Wi-Fi modulation; faster rates are sent a few decibels lower, and the firmware limits the power further by the **country code** that sets the allowed channels.

The catalogue also shows what transmitting costs: a peak current of about 240 mA on the ESP32, 335 to 354 mA on the C3, S3 and C6, and 408 mA on the C5. Lower power lowers the current, though not in proportion, and shortens the range ([[link-budget]]).

### Setting the power in a program

Arduino has \`WiFi.setTxPower()\` with named steps from 19.5 down to 2 dBm, and MicroPython \`wlan.config(txpower=…)\` in dBm; both set a ceiling, once the radio is on. The program below picks the highest step that keeps the EIRP within a limit, for the antenna and cable you fitted. Bluetooth LE has its own setting; ESP-NOW uses the Wi-Fi radio and so follows the same cap.

### What you must not do

A higher-gain antenna, a cable that loses less or an amplifier changes the radiated power of a certified module, and so its approval ([[module-certification]]). In the European Union the *product*, not only the module, must meet the radio rules and be marked ([[regulations-cra-and-red]], [[regulatory-approval]]). Never use boosters beyond the limit, and never interfere with anyone's radio.

> [!warn] Radio rules are law and differ by country. Set the country code, keep the EIRP within your limit, and do not change the antenna of a certified module without checking its approval. This page is guidance, not legal advice.

> [!key] EIRP is transmit power minus cable loss plus antenna gain, and regulators limit it: about 20 dBm at 2.4 GHz in Europe, up to 1 W conducted with a 6 dBi antenna in the United States. Cap the ESP's power so that your antenna keeps it inside, and remember a new antenna changes the approval.`,
  ideas: [
    'Regulators limit conducted power (at the antenna socket) or EIRP (power plus antenna gain), or both.',
    'About 20 dBm EIRP is the 2.4 GHz limit in Europe; the United States allows up to 1 W conducted with up to 6 dBi of antenna gain.',
    'The ESP sets a ceiling on its Wi-Fi power in steps from 19.5 to 2 dBm; the ceiling is for you to choose, below the chip\'s maximum.',
    'Changing the antenna of a certified module can invalidate its approval and exceed the limit.'
  ],
  pitfalls: [
    'A higher-gain antenna is a free upgrade — Gain adds to EIRP, so an antenna of 9 dBi on a 20 dBm radio is over the European limit by 9 dB unless the power is lowered, and the approval no longer matches.',
    'A certified module makes my product legal — The module\'s certificate helps, but the finished product, with its own antenna, cable and enclosure, still has to meet the rules and carry its marks.',
    'The maximum power in the datasheet is the power I will transmit — It is the ceiling at the slowest rate. Faster rates are sent lower, the country code limits it, and you can set it lower.'
  ],
  terms: [
    { term: 'EIRP', also: ['effective isotropic radiated power'], def: 'The transmit power, minus cable losses, plus the antenna gain in dBi: the power an all-round antenna would need to radiate to give the same signal in the strongest direction. Regulators limit it.' },
    { term: 'Conducted power', also: ['conducted output power'], def: 'The power a radio delivers at its antenna connector, measured with a cable instead of an antenna. Some rules limit it, rather than the radiated power.' },
    { term: 'Duty cycle', also: ['transmit duty cycle limit'], def: 'The share of time a device may transmit. Many sub-GHz bands limit it, for example to 1 per cent, so a LoRa node may send only a short burst each minute.' },
    { term: 'Country code', also: ['regulatory domain'], def: 'A setting that tells the Wi-Fi firmware which country\'s rules apply: the channels allowed, the maximum power and whether radar detection is needed.' },
    { term: 'Certification', also: ['type approval', 'CE marking', 'FCC ID'], def: 'Testing by a laboratory and a declaration or grant that a radio product meets the rules of a region, shown by marks such as CE in Europe or an FCC ID in the United States.' }
  ],
  formulas: [
    {
      name: 'Effective radiated power (EIRP)',
      expr: 'EIRP = P - Lc + G',
      tex: '\\mathrm{EIRP} = P - L_{c} + G',
      vars: {
        EIRP: { name: 'EIRP', unit: 'dBm', signed: true, tex: '\\mathrm{EIRP}' },
        P: { name: 'transmit power at the socket', unit: 'dBm', value: 15, signed: true },
        Lc: { name: 'cable and connector loss', q: 'gain', unit: 'dB', value: 0.5, min: 0, tex: 'L_{c}' },
        G: { name: 'antenna gain', q: 'gain', unit: 'dB', value: 5, signed: true }
      },
      solveFor: 'EIRP',
      note: 'Solve for P to find the most the radio may be set to for a given limit. Compare EIRP with the limit of your country, for example 20 dBm in Europe at 2.4 GHz.'
    }
  ],
  examples: [
    {
      title: 'How far must the power come down?',
      q: 'A module is fitted with a 5 dBi antenna through a cable that loses 0.5 dB. The limit is 20 dBm EIRP. What is the highest transmit power the module may be set to?',
      steps: ['EIRP is $P - L_c + G$. Solve for the power: $P = \\mathrm{EIRP} + L_c - G = 20 + 0.5 - 5 = 15.5$ dBm.', 'The largest named step of the Arduino core that does not exceed that is 15 dBm.'],
      a: '15.5 dBm at most, so the 15 dBm step: the module has to be set 4.5 dB or more below its 19.5 dBm maximum.'
    }
  ],
  quiz: [
    { q: 'A module outputs 20 dBm into a cable that loses 0.5 dB and a 5 dBi antenna. What is the EIRP?', choices: ['24.5 dBm', '25.5 dBm', '20 dBm', '15 dBm'], a: 0, why: 'EIRP = 20 − 0.5 + 5 = 24.5 dBm, which is more than the 20 dBm European limit at 2.4 GHz. The power would have to come down.' },
    { q: 'To stay within 20 dBm EIRP with a 5 dBi antenna and 0.5 dB of cable loss, what is the highest transmit power setting?', choices: ['15.5 dBm', '20 dBm', '24.5 dBm', '10 dBm'], a: 0, why: 'P = EIRP limit + cable loss − antenna gain = 20 + 0.5 − 5 = 15.5 dBm.' },
    { q: 'Replacing the antenna of a certified module with a higher-gain one does not affect the approval.', a: false, why: 'The certificate covers the module with the antennas listed in its report. A different antenna changes the radiated power and the pattern and can invalidate the approval.' },
    { q: 'What is a side effect of lowering the Wi-Fi transmit power?', choices: ['Lower transmit current and a shorter range', 'Longer range', 'A faster data rate', 'Louder to the neighbours'], a: 0, why: 'A lower power draws less current in the power amplifier and gives less signal at the far end, so the link budget shrinks. It also disturbs the neighbours less.' }
  ],
  applications: [
    'Capping the power of a product that carries a 5 dBi antenna so it meets the European limit ([[external-antennas]]).',
    'Reducing the transmit power of a battery sensor that sits next to its access point, to save charge ([[battery-life-budget]]).',
    'Planning a LoRa node within a 1 per cent duty cycle ([[lora-parameters]]).',
    'Preparing a product for CE marking or an FCC grant ([[regulatory-approval]], [[module-certification]]).'
  ],
  sources: [
    'ETSI EN 300 328: wideband transmission systems in the 2.4 GHz band, the European limits and test methods.',
    'US Code of Federal Regulations, title 47 part 15 (the FCC rules for unlicensed devices), including section 15.247 for the 2.4 GHz band.',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": maximum transmit power and the country code.'
  ],
  code: [
    {
      title: 'Cap the transmit power to stay inside a limit',
      about: 'Works out the highest transmit power that keeps the EIRP within a limit, for the antenna gain and cable loss you give it, picks the highest step that fits, applies it and prints the result.',
      needs: 'Any ESP32-family board with Wi-Fi and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [limit v] to (20)
          set [gain v] to (2)
          set [cable v] to (0.5)
          set [target v] to ((limit) - (gain) + (cable))
          start Wi-Fi as station :: wifi
          for each [step v] in (list 19.5 19 18.5 17 15 13 11 8.5 7 5 2)
            if <(step) ≤ (target)> then
              set Wi-Fi transmit power to (step) dBm :: wifi
              print (join [module set to ] (step) [ dBm, EIRP ] ((step) + (gain) - (cable)) [ dBm])
              stop [this script v]
            end
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const float LIMIT_DBM = 20.0;        // the EIRP limit you must meet (Europe, 2.4 GHz)
        const float ANTENNA_DBI = 2.0;       // gain of the antenna you fitted
        const float CABLE_DB = 0.5;          // loss of the cable and connector

        struct Step { wifi_power_t level; float dbm; };
        const Step STEPS[] = {               // the named steps of the Arduino core, highest first
          {WIFI_POWER_19_5dBm, 19.5}, {WIFI_POWER_19dBm, 19}, {WIFI_POWER_18_5dBm, 18.5}, {WIFI_POWER_17dBm, 17},
          {WIFI_POWER_15dBm, 15}, {WIFI_POWER_13dBm, 13}, {WIFI_POWER_11dBm, 11}, {WIFI_POWER_8_5dBm, 8.5},
          {WIFI_POWER_7dBm, 7}, {WIFI_POWER_5dBm, 5}, {WIFI_POWER_2dBm, 2}
        };

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);                                    // the radio must be on first
          float target = LIMIT_DBM - ANTENNA_DBI + CABLE_DB;      // the most the module may send
          for (const Step &s : STEPS) {
            if (s.dbm <= target) {                                // the highest step that fits
              WiFi.setTxPower(s.level);
              Serial.printf("module set to %.1f dBm, EIRP %.1f dBm\n", s.dbm, s.dbm + ANTENNA_DBI - CABLE_DB);
              return;
            }
          }
          Serial.println("no step is low enough");
        }

        void loop() {}
      `,
      py: String.raw`
        import network

        LIMIT_DBM = 20.0                     # the EIRP limit you must meet (Europe, 2.4 GHz)
        ANTENNA_DBI = 2.0                    # gain of the antenna you fitted
        CABLE_DB = 0.5                       # loss of the cable and connector
        STEPS = (19.5, 19, 18.5, 17, 15, 13, 11, 8.5, 7, 5, 2)    # the steps of the Arduino core, highest first

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)                    # the radio must be on first
        target = LIMIT_DBM - ANTENNA_DBI + CABLE_DB               # the most the module may send
        for dbm in STEPS:
            if dbm <= target:                                     # the highest step that fits
                wlan.config(txpower=dbm)
                print("module set to %.1f dBm, EIRP %.1f dBm" % (dbm, dbm + ANTENNA_DBI - CABLE_DB))
                break
        else:
            print("no step is low enough")
      `,
      output: `
        module set to 18.5 dBm, EIRP 20.0 dBm
      `,
      notes: ['Set the numbers for your own antenna and your own country\'s limit. The power is a ceiling: the chip may send lower at fast data rates.', 'Call it after the radio is on and before connecting, and check that the call succeeded on your core version.']
    }
  ],
  sim: 'ra-eirp'
},

/* ================================================================ 5 GHz and beyond */
{
  id: 'five-ghz-and-six-ghz',
  parent: 'radio-and-antennas',
  title: '5 GHz and beyond',
  level: 2,
  short: 'Only one microcontroller of the family, the ESP32-C5, speaks Wi-Fi on 5 GHz, and none speaks 6 GHz. What the higher bands offer (many clear channels, no Bluetooth or microwave ovens) and what they cost (about 7 dB more loss and weaker walls), radar avoidance, and the dual-band antenna.',
  keywords: ['5 GHz', '6 GHz', 'ESP32-C5', 'dual-band', 'Wi-Fi 6E', 'DFS', 'radar', 'U-NII', 'channel width', '40 MHz', 'band steering', 'dual-band antenna', 'less crowded', 'more loss', 'ESP32-E22'],
  prereq: ['radio-basics', 'link-budget', 'interference-and-channels'],
  related: ['wifi-basics', 'wifi-6-on-esp', 'soc-esp32-c5', 'external-antennas', 'range-and-obstacles', 'wifi-scanning', 'the-newest-chips'],
  body: `At 2.4 GHz three clear Wi-Fi channels are shared with Bluetooth, Zigbee, neighbours and the microwave oven. The **5 GHz** band offers a wide, quiet alternative, and of all the microcontrollers in the catalogue only the **ESP32-C5** can use it. Wi-Fi 6E adds 6 GHz; no ESP microcontroller has that, though the ESP32-E22 co-processor in the catalogue (a radio for a Linux host, not a chip to program like the others) speaks Wi-Fi 6E on 2.4, 5 and 6 GHz.

### What the bands offer

| Band | Wavelength | Clear 20 MHz channels | Shared with | Free-space loss at 10 m |
|---|---|---|---|---|
| 2.4 GHz | 12.3 cm | 3 (1, 6, 11) | Wi-Fi, Bluetooth, Zigbee, Thread, ovens | 60 dB |
| 5 GHz | 5.5 cm | about 20 to 25, by country | Wi-Fi, and radar on some channels | 67 dB |
| 6 GHz | 4.6 cm | up to 59 where the whole band is open | Wi-Fi 6E and later only | 68 dB |

The quiet is real: a house full of Zigbee lights and Bluetooth speakers does not touch 5 GHz.

### What they cost

The free-space loss grows with $20\\log_{10} f$, so with antennas of the same gain 5.5 GHz loses about **7 dB** more than 2.44 GHz. Indoors, where the path-loss exponent is about 3, that is $10^{-7/30} = 0.58$ of the distance, before walls: and walls absorb more at 5 GHz too, a few dB more each. Expect something like half to two thirds of the 2.4 GHz range. The Fresnel zone narrows ([[range-and-obstacles]]), which helps a little.

### Radar and DFS

Parts of the 5 GHz band are shared with weather and other radar. An access point that uses those channels must listen for radar and, if it hears it, move: **dynamic frequency selection**, DFS. For a station like the C5 it means a network can disappear from one channel and reappear on another, and that scans on those channels listen rather than transmit.

### The ESP32-C5

The catalogue lists it with Wi-Fi 6 on 2.4 and 5 GHz, channels of 20 or 40 MHz, 20 dBm of transmit power and a best sensitivity of −100.5 dBm. Its Bluetooth LE and 802.15.4 (Zigbee, Thread) radios stay on 2.4 GHz, so the chip can run a quiet 5 GHz Wi-Fi link beside Thread. It comes in modules with a printed antenna (ESP32-C5-MINI-1, ESP32-C5-WROOM-1) or a connector (the "U" versions). An antenna for it, or for any external use, must be **dual-band**: a 2.4-only whip is poor at 5 GHz.

### Practical points

A dual-band router often uses one name for both bands; a chip that only knows 2.4 GHz may then fail to join, so give the 2.4 GHz network its own name. A 5 GHz link suits a device close to its router and in need of bandwidth, such as a camera ([[camera-and-vision]]); it is a poor choice for a far sensor on a battery.

> [!key] 5 GHz gives 20 or more clear channels and escapes the 2.4 GHz crowd, but loses about 7 dB more and is absorbed more by walls: half to two thirds of the range. Only the ESP32-C5 has it, and it needs a dual-band antenna; no ESP microcontroller has 6 GHz.`,
  ideas: [
    'Of the microcontrollers in the catalogue only the ESP32-C5 has 5 GHz Wi-Fi; none has 6 GHz.',
    '5 GHz has about 20 to 25 clear 20 MHz channels and no Bluetooth, Zigbee or ovens, against 3 clear channels at 2.4 GHz.',
    'For antennas of the same gain 5.5 GHz loses about 7 dB more than 2.44 GHz, and walls absorb more: expect half to two thirds of the range.',
    'The C5\'s Bluetooth LE and 802.15.4 radios stay on 2.4 GHz; antennas must be dual-band.'
  ],
  pitfalls: [
    'My ESP32-S3 can join my router\'s 5 GHz network — Only the ESP32-C5 has a 5 GHz radio. Any other ESP needs a 2.4 GHz network, which a dual-band router must offer.',
    'A shorter wavelength means a shorter antenna, so 5 GHz is cheaper to build and reach — The antenna is smaller, but the range for the same gain is smaller too, and the antenna must work at both bands for a dual-band chip.',
    '5 GHz is always the better choice — Better for a nearby, bandwidth-hungry device in a crowded home; worse for range through walls or a distant battery sensor.'
  ],
  terms: [
    { term: 'Dual-band', also: ['2.4/5 GHz', 'dual-band antenna'], def: 'Working on both the 2.4 GHz and the 5 GHz bands. An antenna for a dual-band radio must be matched to both, and a router is dual-band when it runs a network in each.' },
    { term: 'DFS', also: ['dynamic frequency selection', 'radar avoidance'], def: 'A requirement on some 5 GHz channels that an access point listens for radar and, if it hears any, leaves the channel for another at once.' },
    { term: 'Wi-Fi 6E', def: 'Wi-Fi 6 extended into the 6 GHz band. It needs a radio that works there, which no ESP microcontroller has; the ESP32-E22 co-processor of the catalogue does.' },
    { term: 'Channel width', also: ['20 MHz', '40 MHz', '80 MHz', '160 MHz'], def: 'The span of spectrum one Wi-Fi network uses. Wider channels give higher data rates and fewer clear channels; the ESP32-C5 uses 20 or 40 MHz.' }
  ],
  choose: {
    good: ['A device close to its router that needs bandwidth, such as a camera or a display', 'A crowded flat where 2.4 GHz is full of neighbours and gadgets', 'Products that must coexist with Bluetooth and Thread on the same chip'],
    avoid: ['Far sensors behind several walls on a battery', 'Projects that must run on the ESP32, S3 or C3, which have no 5 GHz radio', 'Using a 2.4 GHz-only antenna'],
    check: ['That the board really is an ESP32-C5 and its module has the connector or antenna you need', 'That the router offers a separate 2.4 GHz network for other devices', 'The signal strength at the place, not at the bench ([[rssi-and-signal-quality]])']
  },
  formulas: [
    {
      name: 'Extra path loss at a higher frequency',
      expr: 'dL = 20*log10(f2/f1)',
      tex: '\\Delta L = 20\\log_{10}\\frac{f_{2}}{f_{1}}',
      vars: {
        dL: { name: 'extra free-space loss', q: 'gain', unit: 'dB', tex: '\\Delta L' },
        f2: { name: 'the higher frequency', q: 'frequency', unit: 'MHz', value: 5500, tex: 'f_{2}' },
        f1: { name: 'the lower frequency', q: 'frequency', unit: 'MHz', value: 2442, tex: 'f_{1}' }
      },
      solveFor: 'dL',
      note: 'For antennas of the same gain at the same distance in free space. A real house adds more for the walls.'
    },
    {
      name: 'Range at a higher frequency, relative',
      expr: 'k = (f1/f2)^(2/n)',
      tex: 'k = \\left(\\frac{f_{1}}{f_{2}}\\right)^{2/n}',
      vars: {
        k: { name: 'range as a fraction of the lower band\'s', q: 'ratio' },
        f1: { name: 'the lower frequency', q: 'frequency', unit: 'MHz', value: 2442, tex: 'f_{1}' },
        f2: { name: 'the higher frequency', q: 'frequency', unit: 'MHz', value: 5500, tex: 'f_{2}' },
        n: { name: 'path-loss exponent', q: 'ratio', value: 3, min: 1.5, max: 6 }
      },
      solveFor: 'k',
      note: 'Same budget, same antennas, no walls: 0.44 in free space (n = 2), 0.58 with n = 3. Extra wall absorption at the higher band lowers it further.'
    }
  ],
  examples: [
    {
      title: 'How much shorter is the range?',
      q: 'An ESP32-C5 link in a house (exponent 3) reaches 20 m on 2.4 GHz. Estimate the reach on channel 36 (5180 MHz) with the same antennas and no extra wall loss.',
      steps: ['The extra loss is $20\\log_{10}(5180 / 2442) = 6.5$ dB.', 'The range scales by $10^{-6.5/(10 \\times 3)} = 0.61$.', 'So $20 \\times 0.61 = 12$ m.'],
      a: 'About 12 m. Extra absorption in the walls takes it lower, so measure in place rather than trust the estimate.'
    }
  ],
  quiz: [
    { q: 'Which microcontroller of the family can join a 5 GHz network?', choices: ['ESP32-C5', 'ESP32-C6', 'ESP32-S3', 'ESP32-C3'], a: 0, why: 'The ESP32-C5 is the only microcontroller in the catalogue with a 5 GHz radio. The C6 has Wi-Fi 6 but only on 2.4 GHz.' },
    { q: 'Compared with 2.4 GHz, about how much more free-space path loss does 5.5 GHz have, antennas being equal?', choices: ['About 7 dB', 'About 3 dB', 'About 20 dB', 'None'], a: 0, why: '20 × log₁₀(5500 / 2442) = 7.0 dB. That is more than twice the power lost and, in a house, about 40 per cent less distance.' },
    { q: 'The ESP32-C5 uses 5 GHz for its Bluetooth LE and Zigbee radios too.', a: false, why: 'Only the Wi-Fi radio can use 5 GHz. Bluetooth LE and 802.15.4 stay on 2.4 GHz on the C5.' },
    { q: 'What does dynamic frequency selection (DFS) do?', choices: ['Makes an access point leave a channel when it detects radar', 'Raises the data rate', 'Encrypts the traffic', 'Switches between antennas'], a: 0, why: 'Radar shares parts of the 5 GHz band. DFS lets Wi-Fi use those channels as long as it moves away when radar is heard.' }
  ],
  applications: [
    'A wall-mounted display or camera on an ESP32-C5 that needs bandwidth on a quiet band ([[camera-and-vision]]).',
    'A Thread border router on 802.15.4 with its Wi-Fi uplink on 5 GHz, so the two do not compete ([[thread-border-router]]).',
    'Counting the 5 GHz networks around a flat with a scan to choose a channel ([[wifi-scanning]]).',
    'Choosing between the ESP32-C6 (2.4 GHz Wi-Fi 6) and the C5 for a new design ([[soc-esp32-c5]]).'
  ],
  sources: [
    'Espressif, ESP32-C5 datasheet: the dual-band Wi-Fi 6 features, transmit power and receiver sensitivity.',
    'IEEE Std 802.11 (the 2020 revision with its amendments, including 802.11ax): the 5 GHz and 6 GHz channel plans and DFS.',
    'ETSI EN 301 893: the European requirements for 5 GHz wireless access systems, including radar detection.'
  ],
  code: [
    {
      title: 'Count the networks on each band',
      about: 'Scans once and counts the networks whose channel is up to 14 (2.4 GHz) and above 14 (5 GHz). On an ESP32-C5 the second number shows what the 5 GHz band holds; on every other chip it is always zero.',
      needs: 'Any ESP32-family board with Wi-Fi (an ESP32-C5 for 5 GHz results) and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          scan networks :: wifi
          set [n24 v] to (0)
          set [n5 v] to (0)
          for each [net v] in (scan results)
            if <(channel of [net]) ≤ (14)> then
              change [n24 v] by (1)
            else
              change [n5 v] by (1)
            end
          end
          print (join (n24) [ networks on 2.4 GHz, ] (n5) [ on 5 GHz])
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.disconnect();
          int n = WiFi.scanNetworks();
          int n24 = 0, n5 = 0;
          for (int i = 0; i < n; i++) {
            if (WiFi.channel(i) <= 14) n24++;      // channels 1 to 14 are 2.4 GHz
            else n5++;                              // channels 32 and up are 5 GHz
          }
          Serial.printf("%d networks on 2.4 GHz, %d on 5 GHz\n", n24, n5);
          WiFi.scanDelete();
        }

        void loop() {}
      `,
      py: String.raw`
        import network

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.disconnect()
        n24 = n5 = 0
        for ssid, bssid, channel, rssi, auth, hidden in wlan.scan():
            if channel <= 14:                       # channels 1 to 14 are 2.4 GHz
                n24 += 1
            else:                                   # channels 32 and up are 5 GHz
                n5 += 1
        print("%d networks on 2.4 GHz, %d on 5 GHz" % (n24, n5))
      `,
      output: `
        9 networks on 2.4 GHz, 5 on 5 GHz
      `,
      notes: ['This output is what an ESP32-C5 might show in a flat; every other chip prints 0 for 5 GHz because its radio never hears that band.', 'A C5 scan covers both bands unless the band mode has been restricted.']
    }
  ],
  sim: { id: 'ra-band', params: { view: 'five' } }
},

/* ================================================================ matching and tuning */
{
  id: 'matching-and-tuning',
  parent: 'radio-and-antennas',
  title: 'Matching and tuning an antenna',
  level: 3,
  short: 'Between the chip and the antenna a radio wants both sides to agree on 50 ohms; where they do not, power bounces back. Reflection, VSWR and return loss, the pi network, and why tuning needs a vector network analyser and is not a beginner\'s job.',
  keywords: ['matching', 'impedance matching', 'tuning', 'pi network', 'VSWR', 'SWR', 'return loss', 'S11', 'reflection coefficient', 'mismatch loss', 'VNA', 'vector network analyser', 'NanoVNA', '50 ohm', 'resonance', 'antenna bandwidth', 'RF trace', 'Smith chart'],
  prereq: ['pcb-antennas', 'external-antennas', 'decibels-and-dbm'],
  related: ['designing-with-the-bare-chip', 'pcb-layout-for-modules', 'spectrum-analysers-and-vnas', 'module-certification', 'electronics:reflections-matching', 'electronics:impedance', 'electronics:resonance-q'],
  body: `The chip, its RF trace and the antenna must all agree on one impedance, **50 Ω**, for power to flow from one to the next. Where they do not, part of the wave is **reflected** back towards the chip instead of radiated. **Matching** is the work of making them agree. For an ESP *module* it was done, and certified, by the maker. For a board built on a bare chip it is yours, and it is specialist work.

### Measuring a mismatch

If the load is not 50 Ω, a fraction $\\Gamma$ of the wave's amplitude is reflected: $\\Gamma = (R - Z_0)/(R + Z_0)$ for a resistive load $R$ on a line of impedance $Z_0$. Four equivalent ways to say how bad it is:

| VSWR | Reflection Γ | Return loss | Power reflected | Mismatch loss |
|---|---|---|---|---|
| 1.5 : 1 | 0.20 | 14 dB | 4 % | 0.18 dB |
| 2 : 1 | 0.33 | 9.5 dB | 11 % | 0.51 dB |
| 3 : 1 | 0.50 | 6 dB | 25 % | 1.25 dB |
| infinite | 1 | 0 dB | all | all |

The usual aim is a VSWR below 2 : 1, a return loss better than about 10 dB. Notice how modest the loss to reflection is for a moderate mismatch: half a decibel at 2 : 1. A detuned antenna hurts more because it is far from resonance, so it radiates poorly and is badly mismatched.

### The curve

Return loss against frequency has a dip at the antenna's resonance. The antenna matches where the dip is deep, and the useful **bandwidth** is the span in which the return loss stays better than 10 dB. For Wi-Fi it should cover 2400 to 2484 MHz: 84 MHz, which a small printed antenna only just does. A hand, battery or case slides the dip down and can leave the band uncovered ([[pcb-antennas]]).

### The pi network

Between the chip's RF pin and the antenna feed, a board with a bare chip carries a footprint for three parts in the shape of the letter pi: one shunt part to ground, one in series, another shunt. Capacitors and inductors, or zero-ohm links, go there, and their values move the antenna's impedance towards 50 Ω. The values depend on the layout, the board's stack-up, the antenna and the enclosure, so they must be tuned **with the enclosure and battery in place**, with a **vector network analyser** (VNA) that measures the return loss and phase. Low-cost VNAs exist and are good for learning, but need calibration, a fixture and care: it is not a beginner's afternoon.

### What to do

- **With a module**: nothing to tune. If a product's signal is poor, fix the layout, distance and enclosure ([[antenna-placement-and-enclosures]]), not the parts: do not trim a printed antenna or alter the module.
- **With a bare chip**: copy Espressif's reference design to the letter (50 Ω line geometry for your stack-up, the pi footprint, the antenna), then arrange a VNA session or a laboratory ([[designing-with-the-bare-chip]]).

> [!key] Matching makes the chip, the trace and the antenna agree on 50 Ω; a VSWR of 2 : 1 reflects 11 per cent. Tuning a pi network needs a vector network analyser and the finished enclosure, so use a certified module unless you are ready for RF work.`,
  ideas: [
    'Matching makes the chip\'s RF output, the trace and the antenna agree on 50 Ω; a mismatch reflects part of the power back.',
    'VSWR, reflection coefficient, return loss and mismatch loss all describe the same thing; a VSWR below 2 : 1 is the usual aim.',
    'A mismatch of 2 : 1 costs only half a decibel, but a detuned antenna also radiates poorly.',
    'Tuning a pi network needs a vector network analyser, with the enclosure and battery in place.'
  ],
  pitfalls: [
    'A perfect match gives the best range — It gives the best power transfer into the antenna; the antenna must also radiate efficiently and where you want. A matched dummy load radiates nothing.',
    'I can tune an antenna by trimming it until the RSSI is highest — RSSI averages fading, and moves with everything else. Without measuring the return loss you can easily detune it, and it may no longer match the approval.',
    'A certified module is matched, so my product is — The module is matched alone on a standard board. The case, battery and your board can shift it, and a bare-chip design needs its own tuning.'
  ],
  terms: [
    { term: 'Impedance matching', also: ['matching network', 'matching'], def: 'Arranging that a source, a line and a load share the same impedance, 50 Ω in radio work, so that power flows from one to the next with little reflected.' },
    { term: 'VSWR', also: ['SWR', 'voltage standing wave ratio'], def: 'A measure of mismatch: the ratio of the highest to the lowest voltage along a line. 1 : 1 is a perfect match, 2 : 1 reflects 11 per cent of the power, and the ratio is infinite when everything is reflected.' },
    { term: 'Return loss', also: ['S11'], def: 'How many decibels weaker the reflected wave is than the one sent. A high return loss (20 dB) is a good match; 10 dB or more is the usual requirement; 0 dB means all is reflected.' },
    { term: 'Pi network', also: ['CLC matching', 'matching network'], def: 'Three parts in the shape of the letter pi between the chip\'s RF output and the antenna: a shunt part, a series part and another shunt. Their values tune the impedance towards 50 Ω.' },
    { term: 'Vector network analyser', also: ['VNA'], def: 'An instrument that sends a swept signal into an antenna or circuit and measures what comes back, giving return loss and impedance against frequency. It is the tool for tuning a match.' }
  ],
  formulas: [
    {
      name: 'Reflection coefficient of a resistive load',
      expr: 'G = (R - Z0)/(R + Z0)',
      tex: '\\Gamma = \\frac{R - Z_{0}}{R + Z_{0}}',
      vars: {
        G: { name: 'reflection coefficient', q: 'ratio', signed: true, tex: '\\Gamma' },
        R: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 100 },
        Z0: { name: 'line impedance', q: 'resistance', unit: 'Ω', value: 50, fixed: true, tex: 'Z_{0}' }
      },
      solveFor: 'G',
      note: 'A purely resistive load. A real antenna also has a reactive part, which a full calculation (or a Smith chart) includes.'
    },
    {
      name: 'VSWR from the reflection',
      expr: 'S = (1 + G)/(1 - G)',
      tex: 'S = \\frac{1 + \\Gamma}{1 - \\Gamma}',
      vars: {
        S: { name: 'VSWR', q: 'ratio' },
        G: { name: 'reflection magnitude', q: 'ratio', value: 0.33, min: 0, max: 0.99, tex: '\\Gamma' }
      },
      solveFor: 'S',
      note: '1 is a perfect match. A VSWR below 2 corresponds to a reflection of less than 0.33.'
    },
    {
      name: 'Return loss',
      expr: 'RL = -20*log10(G)',
      tex: '\\mathrm{RL} = -20\\log_{10}\\Gamma',
      vars: {
        RL: { name: 'return loss', q: 'gain', unit: 'dB', tex: '\\mathrm{RL}' },
        G: { name: 'reflection magnitude', q: 'ratio', value: 0.33, min: 0.001, max: 1, tex: '\\Gamma' }
      },
      solveFor: 'RL',
      note: 'A larger return loss is a better match: 10 dB is 0.32, 20 dB is 0.1.'
    },
    {
      name: 'Mismatch loss',
      expr: 'ML = -10*log10(1 - G^2)',
      tex: '\\mathrm{ML} = -10\\log_{10}\\left(1 - \\Gamma^{2}\\right)',
      vars: {
        ML: { name: 'mismatch loss', q: 'gain', unit: 'dB', tex: '\\mathrm{ML}' },
        G: { name: 'reflection magnitude', q: 'ratio', value: 0.33, min: 0, max: 0.99, tex: '\\Gamma' }
      },
      solveFor: 'ML',
      note: 'The power lost to the reflection alone: 0.5 dB at a VSWR of 2, 1.25 dB at 3.'
    }
  ],
  examples: [
    {
      title: 'How bad is a 100 Ω antenna?',
      q: 'An antenna presents a resistive 100 Ω to a 50 Ω line. Find the reflection, the VSWR, the return loss and the power lost to reflection.',
      steps: ['$\\Gamma = (100 - 50)/(100 + 50) = 0.333$.', '$\\mathrm{VSWR} = (1 + 0.333)/(1 - 0.333) = 2.0$.', '$\\mathrm{RL} = -20\\log_{10}(0.333) = 9.5$ dB.', 'The power reflected is $\\Gamma^2 = 11\\,\\%$, a mismatch loss of $-10\\log_{10}(1 - 0.111) = 0.51$ dB.'],
      a: 'VSWR 2 : 1, a return loss of 9.5 dB and only about half a decibel lost: a mediocre but usable match.'
    }
  ],
  quiz: [
    { q: 'A VSWR of 2 : 1 means about what fraction of the power is reflected?', choices: ['About 11 per cent', 'About 50 per cent', 'About 2 per cent', 'All of it'], a: 0, why: 'Γ = (S − 1)/(S + 1) = 1/3, and the reflected power is Γ² = 1/9, about 11 per cent: half a decibel of loss.' },
    { q: 'Which instrument shows how well an antenna is matched in its finished enclosure?', choices: ['A vector network analyser measuring return loss', 'A multimeter on the supply', 'An oscilloscope on the 3.3 V rail', 'A logic analyser'], a: 0, why: 'A VNA sends a signal over the band and measures what is reflected, giving return loss against frequency. The others measure low-frequency signals.' },
    { q: 'Because a module is certified, its antenna stays matched in any product.', a: false, why: 'The match was made on a standard board in free space. A battery, case or different board can shift the resonance and spoil the match.' },
    { q: 'What is the return loss, in decibels, of a reflection coefficient of 0.1?', answer: 20, unit: 'dB', why: 'RL = −20 log₁₀(0.1) = 20 dB: only 1 per cent of the power is reflected.' }
  ],
  applications: [
    'Designing a board around the bare ESP32-C3 or S3 chip, where the pi network and RF trace are yours ([[designing-with-the-bare-chip]]).',
    'Checking an antenna\'s resonance in a product with a low-cost VNA before the approval tests ([[spectrum-analysers-and-vnas]]).',
    'Explaining why trimming a printed antenna or moving the keep-out is risky ([[pcb-layout-for-modules]]).',
    'Reading the return loss plot in an antenna\'s datasheet ([[external-antennas]]).'
  ],
  sources: [
    'David M. Pozar, *Microwave Engineering*: the reflection coefficient, VSWR, return loss and matching networks.',
    'Espressif, *ESP32 Series Hardware Design Guidelines*: the RF trace, the pi-network footprint and the antenna matching notes.',
    'Constantine A. Balanis, *Antenna Theory: Analysis and Design*: antenna impedance and bandwidth.'
  ],
  sim: 'ra-match'
}
);
