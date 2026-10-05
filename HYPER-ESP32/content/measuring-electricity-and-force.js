/* HYPER-ESP32 · content/measuring-electricity-and-force.js
 *
 * Topic "Measuring electricity and force" (simulations: sims/measuring-electricity-and-force.js, ids me-…):
 *   the-esp-adc · adc-attenuation-and-calibration · oversampling-and-noise · measuring-voltage ·
 *   measuring-current-with-shunts · hall-current-sensors · mains-energy-monitoring · load-cells-and-hx711 ·
 *   pulse-counting · measuring-frequency-and-time · four-to-twenty-milliamp
 */
Hyper.add(
/* ================================================================ the ESP ADC */
{
  id: 'the-esp-adc',
  parent: 'measuring-electricity-and-force',
  title: 'The ESP ADC and its limits',
  level: 2,
  short: 'Every chip of the family has a 12-bit converter, but 12 bits is what it reports, not what it knows. Non-linearity, offsets, noise and the Wi-Fi conflict decide how many of those bits are worth having, and when an outside converter is the honest answer.',
  keywords: ['ADC', 'SAR', '12 bit', 'effective resolution', 'ENOB', 'nonlinearity', 'ADC1', 'ADC2', 'one-shot', 'continuous mode', 'DMA', 'dead zone', 'accuracy', 'ADS1115', 'internal reference', 'channels', 'analogRead', 'sampling'],
  prereq: ['analog-input', 'adc1-adc2-and-wifi', 'three-volt-logic'],
  related: ['adc-attenuation-and-calibration', 'oversampling-and-noise', 'measuring-voltage', 'external-adc-and-dac', 'accuracy-resolution-precision', 'esp-as-a-voltmeter', 'electronics:adc', 'electronics:sampling-nyquist'],
  body: `Every ESP32-family microcontroller turns a voltage into a number of 12 bits: 0 to 4095. That sounds like one part in four thousand; it is not. A measurement is judged by three things: **resolution** (how finely the converter divides its range), **accuracy** (how close the reading is to the truth) and **noise** (how much it wobbles from one reading to the next). The ESP's converter is generous with the first and modest with the other two: fine for knobs, light levels and rough battery readings, poor for an instrument.

### What is inside

The converter is of the **successive-approximation** kind: it compares the input with a trial voltage, one bit at a time. Each unit has one converter and a multiplexer that connects it to one pin at a time, so a pin needs a moment to settle after the channel changes. The chips differ in how many units and channels they have:

| Chip | Units | Channels | Remark |
|---|---|---|---|
| ESP32 | 2 | 18 | ADC2 cannot be used while Wi-Fi runs |
| ESP32-S2, S3 | 2 | 20 | ADC2 shares hardware with Wi-Fi |
| ESP32-C3 | 2 | 6 | the ADC2 channel (GPIO5) is unusable: five remain |
| ESP32-C6, C5 | 1 | 7, 6 | one unit, nothing to avoid |
| ESP32-C2, H2 | 1 | 5 | |
| ESP32-C61 | 1 | 4 | |
| ESP32-P4, S31 | 2 | 14, 16 | |
| ESP8266 | 1 | 1 | 10 bits, about 1 V full scale |


### Resolution, accuracy and noise

- **Resolution** is 12 bits: a count is worth 0.2 mV (at 0 dB) to about 0.8 mV (at 11 dB).
- **Accuracy** is the weak point. The original ESP32's converter reads about zero below 0.1 V and flattens near the top of every range; factory calibration removes most of that and leaves a few percent ([[adc-attenuation-and-calibration]]).
- **Noise** scatters a single reading by several counts, more while the radio transmits, so the *effective* resolution is nearer 9 or 10 bits ([[oversampling-and-noise]]).

### Wi-Fi, one-shot and continuous

On the original ESP32 the ADC2 pins cannot be read while Wi-Fi runs, on the S3 such reads can time out, and on the C3 that channel is unusable: **put analogue sensors on ADC1 pins**. A reading is either *one-shot* (one value, now) or *continuous* (DMA): the converter samples in the background at a rate you choose and fills a buffer, the way to capture a waveform such as a mains current ([[hall-current-sensors]]).

### Enough, or not

The internal converter is enough for anything good to a few percent: potentiometers, light, soil moisture, a battery gauge. It is not enough for millivolt signals (a thermocouple, a load cell) or for better than about one percent. An external converter such as the ADS1115 (16 bits, its own reference, a programmable-gain amplifier) costs little and removes the problem ([[external-adc-and-dac]]).

> [!key] The ESP's ADC reports 12 bits, but offsets, non-linearity and noise leave nearer 9 or 10 of them useful, and accuracy of a few percent. Use ADC1 pins, read millivolts, average — and reach for an external converter when a measurement must be better than that.`,
  ideas: [
    'Resolution, accuracy and noise are three different things: the ESP ADC has 12 bits of resolution, a few percent of accuracy and several counts of noise.',
    'The converter has one core per unit, shared by many pins through a multiplexer; the number of channels differs from chip to chip.',
    'Analogue sensors belong on ADC1 pins: ADC2 conflicts with Wi-Fi on the ESP32 and S3 and is unusable on the C3.',
    'When a measurement must be better than about one percent, an external 16-bit converter is cheaper than fighting the internal one.'
  ],
  pitfalls: [
    'A 12-bit converter is accurate to one part in 4096 — Resolution is how finely it divides the range; accuracy is how close the answer is to the truth. Non-linearity, offset and noise cost most of the bottom bits.',
    'The datasheet channel count is the number of usable analogue pins — The C3 lists 6 channels, one of them on the unusable ADC2, and on every chip some channels share their pin with a strapping pin, flash or USB. Check the pin table of your board.',
    'A higher reading rate gives a better measurement — Each reading carries its own noise, and a very high rate also loads a high-impedance source. Averaging a moderate number of readings is what helps.'
  ],
  terms: [
    { term: 'Successive-approximation ADC', also: ['SAR ADC'], def: 'A converter that finds the input voltage by bisection: it compares the input with a trial voltage and settles one bit per step, from the most significant bit down. The ESP32 family uses 12 steps per reading.' },
    { term: 'Effective number of bits', also: ['ENOB', 'effective resolution'], def: 'The resolution a converter really delivers once noise and distortion are counted. A 12-bit ESP32 converter typically behaves like one of 9 to 10 bits.' },
    { term: 'Non-linearity', also: ['INL', 'integral non-linearity'], def: 'The deviation of a converter\'s transfer curve from a straight line. The original ESP32 reads zero at the bottom of the range and bends near the top.' },
    { term: 'Continuous mode', also: ['DMA mode', 'ADC continuous'], def: 'A way of using the ADC in which the hardware samples one or more channels at a fixed rate in the background and stores the results in a buffer, with no CPU work per sample.' }
  ],
  choose: {
    good: ['Knobs, light levels, soil moisture and other readings good to a few percent', 'A rough battery or supply gauge through a divider', 'Slow signals that can be averaged over many readings'],
    avoid: ['Absolute accuracy better than about one percent without calibration', 'Signals of a few millivolts (thermocouples, load cells) without an amplifier', 'ADC2 pins when the original ESP32 uses Wi-Fi'],
    check: ['That the signal fits the range of the attenuation you chose', 'How much noise your own board adds: read one steady voltage a few hundred times', 'Whether an external converter ([[external-adc-and-dac]]) saves more time than calibrating the internal one']
  },
  sim: 'me-adc-curve',
  code: [
    {
      title: 'Check the ADC against a known voltage',
      about: 'Averages 64 calibrated readings of a voltage you also measure with a multimeter, and prints how far the ESP is from it, in millivolts and percent. Repeat at several voltages to see where on the range your chip is good and where it is not.',
      needs: 'An ESP32 DevKit (or any chip with a pin on ADC1), two 10 kΩ resistors, 100 nF and a multimeter.',
      wiring: [['3V3', '10 kΩ → GPIO34', 'the upper resistor'], ['GPIO34', '10 kΩ → GND', 'the lower resistor: the pin sits at about half of 3.3 V'], ['GPIO34', '100 nF → GND', 'steadies the reading'], ['multimeter', 'between GPIO34 and GND', 'read the true voltage; type it into the program']],
      blocks: `
        when started
          start serial at (115200) baud
          set [reference v] to (1650)    // what the multimeter reads at the pin, in millivolts
        forever
          set [total v] to (0)
          repeat (64)
            change [total v] by (analog read pin (34) in millivolts)
          end
          set [average v] to ((total) / (64))
          print (join [average ] (average) [ mV, error ] ((average) - (reference)) [ mV])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                 // an ADC1 pin: ESP32 GPIO32…39, S3 GPIO1…10, C3 GPIO0…4
        const float REFERENCE_MV = 1650.0;      // what the multimeter reads at the pin, in millivolts
        const int SAMPLES = 64;

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(ADC_PIN, ADC_11db);   // the widest range, also the default
        }

        void loop() {
          uint32_t sum = 0;
          for (int i = 0; i < SAMPLES; i++) sum += analogReadMilliVolts(ADC_PIN);
          float average = sum / (float)SAMPLES;
          float error = average - REFERENCE_MV;
          Serial.printf("raw %d   average %.1f mV   error %+.1f mV (%+.2f %%)\n",
                        analogRead(ADC_PIN), average, error, 100.0 * error / REFERENCE_MV);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # an ADC1 pin: the widest range
        REFERENCE_MV = 1650.0                     # what the multimeter reads at the pin, in millivolts
        SAMPLES = 64

        while True:
            total = 0
            for _ in range(SAMPLES):
                total += adc.read_uv()
            average = total / SAMPLES / 1000      # microvolts to millivolts
            error = average - REFERENCE_MV
            print("raw", adc.read_u16() >> 4, "  average %.1f mV   error %+.1f mV (%+.2f %%)" % (average, error, 100 * error / REFERENCE_MV))
            time.sleep(1)
      `,
      output: `
        raw 2019   average 1642.3 mV   error -7.7 mV (-0.47 %)
        raw 2021   average 1643.8 mV   error -6.2 mV (-0.38 %)
      `,
      notes: ['The numbers are an illustration: your chip, your resistors and your multimeter will give others.', 'The error changes along the range. Redo the test with other dividers — near 0.3 V and near 2.2 V — and you see the curve of the simulation above on your own board.', 'Do not trust the resistor values: measure the voltage at the pin with a meter. A 1 % resistor pair already moves the half-way point by half a percent.']
    }
  ],
  examples: [
    {
      title: 'How many bits does it really have?',
      q: 'An original ESP32 at 11 dB reads a steady 1.2 V. Over a few seconds the raw count wanders over a band 6 counts wide. How many of the 12 bits carry information, and how much is that in volts?',
      steps: ['A noise band 6 counts wide hides $\\log_2 6 \\approx 2.6$ bits.', 'That leaves $12 - 2.6 \\approx 9.4$ useful bits.', 'One count at this setting is about 0.8 mV, so the band is 6 × 0.8 ≈ 5 mV wide, which is 0.4 % of 1.2 V.'],
      a: 'About 9.4 useful bits and ±2.5 mV of wobble: plenty for a knob or a battery gauge, not enough for a thermometer that must be good to 0.1 °C.'
    }
  ],
  quiz: [
    { q: 'A datasheet says a converter is 12 bits. What does that tell you for certain?', choices: ['Readings are accurate to 0.025 %', 'The range is cut into 4096 steps', 'Noise is below one count', 'It can be used with Wi-Fi on any pin'], a: 1, why: 'The bit count is the resolution: how many steps the range is divided into. Accuracy and noise are separate properties, and on the ESP they are much worse than the resolution suggests.' },
    { q: 'An ESP32-C3 datasheet lists 6 ADC channels. How many can you use for ordinary readings?', choices: ['6', '5', '3', '2'], a: 1, why: 'Five channels are on ADC1 (GPIO0 to GPIO4). The sixth is on ADC2, which is not dependable on the C3.' },
    { q: 'A 12-bit ESP32 ADC is accurate to one part in 4096.', a: false, why: 'One part in 4096 is its resolution. Non-linearity and offset make the accuracy a few percent, and noise costs another two or three bits of useful resolution.' },
    { q: 'A project must measure a 0 to 3 V sensor to better than 0.1 %. What is the sensible plan?', choices: ['Average 10 000 readings of the internal ADC', 'Use an external 16-bit converter with its own reference', 'Use the 0 dB attenuation', 'Add a 100 nF capacitor and trust the result'], a: 1, why: 'Averaging cannot remove the internal converter\'s non-linearity or offset. A converter with a precision reference and 16 bits is built for 0.1 %.' }
  ],
  applications: [
    'Potentiometers, light sensors and soil-moisture probes on almost every hobby project.',
    'Battery gauges: a divider, an averaged reading and a lookup table of volts against charge.',
    'Rough power monitoring: a current clamp or a shunt amplifier feeding an ADC1 pin.',
    'Microphone envelopes and simple waveform capture in continuous mode.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: the section on ADC characteristics, and the same section for the ESP32-S3, ESP32-C3 and ESP32-C6.',
    'Espressif, *ESP-IDF Programming Guide*: the one-shot and continuous mode ADC drivers and the ADC calibration driver.',
    'Texas Instruments, *ADS1115 datasheet* (the external 16-bit converter named above).'
  ]
},

/* ================================================================ attenuation and calibration */
{
  id: 'adc-attenuation-and-calibration',
  parent: 'measuring-electricity-and-force',
  title: 'Attenuation and calibration',
  level: 2,
  short: 'Attenuation decides how much of the voltage reaches the converter: a narrow range with fine steps, or a wide one with coarse steps. Calibration, the factory\'s or your own two-point kind, then turns counts into volts better than straight scaling can.',
  keywords: ['attenuation', 'ADC_0db', 'ADC_11db', 'ADC_ATTEN_DB_12', 'ATTN_11DB', 'calibration', 'eFuse', 'Vref', 'line fitting', 'curve fitting', 'analogReadMilliVolts', 'read_uv', 'two-point calibration', 'gain', 'offset', 'ADC range', 'dead zone'],
  prereq: ['the-esp-adc', 'analog-input'],
  related: ['oversampling-and-noise', 'measuring-voltage', 'sensor-calibration', 'uncertainty-and-calibration', 'efuses', 'electronics:voltage-divider'],
  body: `The converter inside an ESP32 was designed for a signal of about one volt. To measure up to 3 V something has to divide the input first, and the chip lets the program choose how much: four settings called 0, 2.5, 6 and 11 dB per pin. In ESP-IDF the top setting is now spelled \`ADC_ATTEN_DB_12\`; the Arduino core still calls it \`ADC_11db\` and MicroPython \`ATTN_11DB\`. It is the default.

### The four ranges

More attenuation means a wider range and coarser steps. The recommended ranges, from the catalogue:

| Setting | ESP32 | ESP32-C3 | ESP32-S3 | ESP32-C6 |
|---|---|---|---|---|
| 0 dB | 0.10–0.95 V | 0–0.75 V | 0–0.95 V | 0–1.0 V |
| 2.5 dB | 0.10–1.25 V | 0–1.05 V | 0–1.25 V | 0–1.3 V |
| 6 dB | 0.15–1.75 V | 0–1.30 V | 0–1.75 V | 0–1.9 V |
| 11 dB | 0.15–2.45 V | 0–2.5 V | 0–3.1 V | 0–3.3 V |

Outside its range a setting does not fail politely: below the range the ESP32 reads zero, above it the curve bends and finally clips at 4095. Documents disagree about the top of the original ESP32's 11 dB range (2.45 V in the figures above, up to 3.1 V in the Arduino tables); the lower figure is the cautious one. Whatever the setting, the pin itself must never see more than 3.3 V.

**Choosing:** take the smallest range that contains the whole signal with a few percent to spare. A 0 to 0.8 V sensor wants 0 dB, which gives steps three times finer than 11 dB. And because the converter has a dead zone at the bottom on the original ESP32, a small signal that can reach zero volts is better lifted a little (a bias) than read at 0 dB.

### From counts to volts

The factory measures every chip and burns correction data into its eFuses ([[efuses]]). The Arduino function \`analogReadMilliVolts\` and MicroPython's \`read_uv\` apply it, so they return volts at the pin; scaling the raw count yourself ignores it. The original ESP32 uses a simple line fit; newer chips use a fitted curve. A chip without the data falls back to a default curve with a larger error. The reference inside the chip is its own, so **the reading does not depend on the 3.3 V rail**: a potentiometer across a sagging supply shows a falling voltage, because the converter measures absolute volts.

### Your own calibration

Factory calibration leaves a few percent. When more matters, do a two-point calibration per setting: apply two known voltages inside the range, near 20 % and 80 % of it, measure both with a trusted multimeter, read them with the ESP, and correct every later reading with a line through the two pairs (the calculator below). It removes gain and offset error, not noise, and holds for the range in which you measured it.

> [!key] Attenuation picks the voltage range and the step size: choose the smallest range that holds the signal. The millivolt functions apply the factory calibration; a two-point calibration of your own removes the gain and offset that remain.`,
  ideas: [
    'Four attenuation settings trade range against step size; the default, 11 dB, is the widest and the coarsest.',
    'Outside the range of a setting the reading reads zero, bends or clips: choose a range that contains the whole signal.',
    'The factory burns calibration data into the chip; the millivolt functions apply it, and raw scaling does not.',
    'A two-point calibration with a trusted meter removes the remaining gain and offset error, per setting.'
  ],
  pitfalls: [
    'The default attenuation is right for every sensor — 11 dB is the widest range and has the coarsest steps. A sensor that swings 0 to 0.8 V is read three times more finely at 0 dB.',
    'The reading follows the 3.3 V supply like on an Arduino Uno — The ESP\'s converter has its own internal reference. Only a ratiometric arrangement (the sensor fed from the same 3.3 V and its reading divided by it) makes the supply cancel.',
    'Calibrate once at midscale and the job is done — Gain and offset are two unknowns: two points are the minimum, and a calibration made at one attenuation does not carry over to another.'
  ],
  terms: [
    { term: 'Attenuation', also: ['ADC_11db', 'ATTN_11DB', 'input attenuation'], def: 'A divider in front of the converter that the program can switch among 0, 2.5, 6 and 11 dB. More attenuation widens the measurable range and enlarges the voltage of one count.' },
    { term: 'Factory calibration', also: ['eFuse calibration', 'Vref calibration'], def: 'Correction data that Espressif measures for each chip and burns into its eFuses. The ADC calibration driver, and with it analogReadMilliVolts and read_uv, uses it to turn counts into volts.' },
    { term: 'Two-point calibration', also: ['gain and offset calibration', 'linear calibration'], def: 'Correcting readings with a straight line fixed by two known inputs: the first fixes the offset, the second the gain. It cannot remove noise or a curve that is not a line.' },
    { term: 'Ratiometric measurement', also: ['ratiometric'], def: 'A measurement whose result depends on a ratio, such as a sensor and the converter sharing one reference, so that a change of the supply cancels out. The ESP\'s ADC has an internal reference, so it is not ratiometric by itself.' }
  ],
  sim: ['me-attenuation', { id: 'me-adc-curve', params: { view: 'error' }, title: 'The error of the converter, with and without calibration' }],
  formulas: [
    {
      name: 'Two-point calibration',
      expr: 'Vc = (Vr - V1r) * (V2t - V1t) / (V2r - V1r) + V1t',
      tex: 'V_{c} = \\frac{(V_{r} - V_{1r})\\,(V_{2t} - V_{1t})}{V_{2r} - V_{1r}} + V_{1t}',
      vars: {
        Vc: { name: 'corrected voltage', q: 'voltage', unit: 'V', tex: 'V_{c}' },
        Vr: { name: 'reading to correct', q: 'voltage', unit: 'V', value: 1.5, tex: 'V_{r}' },
        V1r: { name: 'reading at the first point', q: 'voltage', unit: 'V', value: 0.512, tex: 'V_{1r}' },
        V2r: { name: 'reading at the second point', q: 'voltage', unit: 'V', value: 2.018, tex: 'V_{2r}' },
        V1t: { name: 'true value at the first point', q: 'voltage', unit: 'V', value: 0.500, tex: 'V_{1t}' },
        V2t: { name: 'true value at the second point', q: 'voltage', unit: 'V', value: 2.000, tex: 'V_{2t}' }
      },
      solveFor: 'Vc',
      note: 'The line through the points (V1r, V1t) and (V2r, V2t). Take the two points inside the range, far apart, and measure the true values with a multimeter.',
      stories: { Vc: 'At 0.5 V (true) the ESP reads {V1r}; at 2.0 V (true) it reads {V2r}. A later reading is {Vr}. What is the corrected voltage?' }
    }
  ],
  code: [
    {
      title: 'One voltage at four attenuations',
      about: 'Reads the same pin at each of the four settings and prints the calibrated millivolts. The setting that is too narrow clips; the others agree. Apply a steady voltage of about 1.2 V.',
      needs: 'An ESP32 DevKit, a potentiometer or a divider giving a steady voltage between 0.3 V and 0.9 V (so that every setting can show it), and a multimeter to check the true value.',
      wiring: [['GPIO34', 'potentiometer wiper', 'an ADC1 pin'], ['3V3', 'potentiometer end'], ['GND', 'potentiometer other end']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          for each [setting v] in (list [0 dB] [2.5 dB] [6 dB] [11 dB])
            set attenuation of pin (34) to (setting) :: pins
            set [total v] to (0)
            repeat (16)
              change [total v] by (analog read pin (34) in millivolts)
            end
            print (join (setting) [: ] ((total) / (16)) [ mV])
          end
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                     // an ADC1 pin
        const adc_attenuation_t SETTINGS[4] = { ADC_0db, ADC_2_5db, ADC_6db, ADC_11db };
        const char *NAMES[4] = { "0 dB", "2.5 dB", "6 dB", "11 dB" };

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          for (int i = 0; i < 4; i++) {
            analogSetPinAttenuation(ADC_PIN, SETTINGS[i]);
            analogReadMilliVolts(ADC_PIN);          // throw the first reading away: the range has just changed
            uint32_t sum = 0;
            for (int k = 0; k < 16; k++) sum += analogReadMilliVolts(ADC_PIN);
            Serial.printf("%-7s %4u mV\n", NAMES[i], (unsigned)(sum / 16));
          }
          Serial.println("---");
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        PIN = 34                                    # an ADC1 pin
        SETTINGS = [("0 dB", ADC.ATTN_0DB), ("2.5 dB", ADC.ATTN_2_5DB), ("6 dB", ADC.ATTN_6DB), ("11 dB", ADC.ATTN_11DB)]

        while True:
            for name, atten in SETTINGS:
                adc = ADC(Pin(PIN), atten=atten)
                adc.read_uv()                       # throw the first reading away: the range has just changed
                total = 0
                for _ in range(16):
                    total += adc.read_uv()
                print("%-7s %4d mV" % (name, total // 16 // 1000))
            print("---")
            time.sleep(2)
      `,
      output: `
        0 dB     628 mV
        2.5 dB   633 mV
        6 dB     631 mV
        11 dB    627 mV
        ---
      `,
      notes: ['An illustrative run with a 0.63 V input. Raise the input above about 0.95 V and the 0 dB line stops following it: the converter has run out of range.', 'The four numbers differ by a few millivolts although the voltage is the same: that is the calibration error plus noise, a useful picture of how much to trust the last digit.', 'The old Arduino constant ADC_12db does not exist; the widest setting is ADC_11db.']
    }
  ],
  examples: [
    {
      title: 'Fitting a sensor to a range',
      q: 'A light sensor gives 0.05 V in the dark and 1.1 V in full sun, and you read it with an ESP32-S3. Which attenuation suits it, and how fine is one count?',
      steps: ['From the table, 0 dB covers 0 to 0.95 V and 2.5 dB covers 0 to 1.25 V. The 1.1 V peak needs at least the 2.5 dB setting, which leaves 14 % to spare.', 'One count is about $1.25\\ \\mathrm{V} / 4096 \\approx 0.3$ mV.', 'The default 11 dB would also work (range 0 to 3.1 V), but each count would be 0.76 mV, two and a half times coarser.'],
      a: 'Use 2.5 dB: the whole signal fits and the steps are about 0.3 mV.'
    }
  ],
  quiz: [
    { q: 'A sensor gives 0 to 0.8 V and you read it with the default setting. What do you gain by switching to 0 dB?', choices: ['A wider range', 'Steps about three times finer', 'Immunity from Wi-Fi noise', 'Nothing: the settings are equivalent'], a: 1, why: '0 dB covers about 0 to 0.95 V against about 0 to 3 V at 11 dB, so the same 4096 counts are spread over a much smaller span.' },
    { q: 'A 3.3 V potentiometer is read by an ESP32. The supply sags from 3.3 V to 3.0 V while the knob stays put. What does the reading do?', choices: ['Stays the same', 'Falls with the supply', 'Rises', 'Reads zero'], a: 1, why: 'The converter measures absolute volts against its own internal reference, so a pin voltage that follows the supply falls with it.' },
    { q: 'Which of these does a two-point calibration remove?', choices: ['Noise', 'A gain error and an offset', 'Any shape of curve', 'The ADC2 conflict'], a: 1, why: 'Two points fix a line: its slope (gain) and its intercept (offset). A curve and random noise remain.' },
    { q: 'An original ESP32 reads zero for every input below about 0.1 V. What is a sensible remedy for a sensor that swings from 0 V to 0.5 V?', choices: ['Use 11 dB', 'Lift the signal with a small bias so it stays above the dead zone', 'Average more readings', 'Move it to an ADC2 pin'], a: 1, why: 'The dead zone is a property of the converter, not of noise. Averaging cannot recover a signal that reads zero; a bias or an amplifier moves it into the range that works.' }
  ],
  choose: {
    good: ['0 dB or 2.5 dB for small signals, with the sensor range inside the table', '11 dB when the signal can reach 2.5 V or more', 'A two-point calibration where better than a few percent is needed'],
    avoid: ['Letting the signal leave the range of the setting', 'Scaling the raw count with 3.3 / 4095 and trusting the answer', 'Reusing one calibration for another attenuation or another board'],
    check: ['The range of your chip and setting in the table above', 'That analogReadMilliVolts (read_uv) is what the program calls', 'The true voltage with a multimeter before you trust a calibration']
  },
  applications: [
    'Choosing the range for a sensor with a small output, such as a photodiode amplifier or a shunt amplifier.',
    'Battery monitors, where a divider is chosen so that the top voltage lands inside a range.',
    'Production test: a two-point check of the ADC of each board against a reference.',
    'Bench instruments built on the ESP, which calibrate against a trusted meter.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: ADC one-shot mode (attenuation and the recommended ranges) and the ADC calibration driver.',
    'Arduino core for ESP32 documentation: the *ADC* API (analogSetPinAttenuation, analogReadMilliVolts), core 3.3.',
    'MicroPython documentation: *machine.ADC* and the ESP32 quick reference (ATTN_* constants, read_uv), version 1.29.'
  ]
},

/* ================================================================ noise, averaging and oversampling */
{
  id: 'oversampling-and-noise',
  parent: 'measuring-electricity-and-force',
  title: 'Noise, averaging and oversampling',
  level: 2,
  short: 'One ADC reading wobbles; the average of many wobbles less, by the square root of their number. Averaging, oversampling to gain bits and a median each cure a different kind of noise, and none of them cures an offset.',
  keywords: ['noise', 'averaging', 'oversampling', 'decimation', 'dither', 'median filter', 'moving average', 'exponential filter', 'EMA', 'effective bits', 'ENOB', 'hum', '50 Hz', 'bypass capacitor', 'Wi-Fi noise', 'spikes', 'square root'],
  prereq: ['the-esp-adc', 'adc-attenuation-and-calibration'],
  related: ['measuring-voltage', 'filtering-sensor-data', 'reading-sensors-reliably', 'rc-filters-and-debounce', 'sample-time-and-jitter', 'electronics:noise-snr', 'electronics:sampling-nyquist'],
  body: `Read a perfectly steady voltage twice and the ESP rarely gives the same number. The converter has noise of its own, the supply has ripple, the radio injects bursts every time it transmits, and a wire is an antenna for mains hum. Most of it is **random**: sometimes high, sometimes low, with no pattern. Random noise has a gift: it averages away.

### Averaging

Add up N readings and divide by N, and the random noise shrinks by the **square root of N**. Four readings halve it; sixteen cut it to a quarter; a hundred give a tenth. The cost grows faster than the gain: to halve the noise again you need four times as many readings. What averaging cannot touch is anything that is *the same in every reading*: an offset, a gain error, the converter's curve, or a drift. Those need calibration, not more samples.

| Readings averaged | Noise left | Bits gained |
|---|---|---|
| 1 | 100 % | 0 |
| 4 | 50 % | 1 |
| 16 | 25 % | 2 |
| 64 | 12.5 % | 3 |
| 256 | 6 % | 4 |

### Oversampling: more bits

Averaging also buys *resolution*. Add 4 readings and shift the sum right by one bit and you have a 13-bit number from a 12-bit converter; add 16 and shift right by two for 14 bits; 256 readings and a shift of four give 16 bits. It works only if the noise is at least about one count, so that the input wanders across the step edges: that wandering is called **dither**. A noise-free input stuck between two steps is read as the same count every time, and no averaging helps. And the extra bits are worth having only to the extent that the converter's accuracy supports them.

### The right filter for the noise

- **Random scatter** → average, or an exponential filter, which needs one variable instead of a buffer.
- **Occasional spikes** (a radio burst, a loose contact) → take a **median** of five or so: one wild value is thrown out instead of smeared into the average.
- **Mains hum** → average over a whole number of mains cycles: 20 ms at 50 Hz or 16.7 ms at 60 Hz. The hum then cancels exactly.

### Before the software

Cleaner input beats clever averaging. Put 100 nF from the pin to ground, keep the wire short, keep it away from PWM and motor lines, join the sensor's ground to the ESP's with a short wire, and read from ADC1. Sample between radio transmissions where you can. Check the effect by recording a few hundred readings of one steady voltage and looking at the spread, as the simulation does.

> [!key] Averaging N readings divides random noise by the square root of N, and 4^k readings with a shift of k bits add k bits of resolution when the noise is at least one count. A median removes spikes; neither method removes offset or gain error.`,
  ideas: [
    'Random noise falls with the square root of the number of readings averaged; offsets and gain errors do not fall at all.',
    'Four readings per extra bit: add 4^k readings and shift right by k bits to gain k bits, provided the noise dithers the input across the steps.',
    'Use a median to throw out spikes and an average for scatter; average over whole mains cycles to cancel hum.',
    'A 100 nF capacitor, short wires and an ADC1 pin do more for the noise than any software.'
  ],
  pitfalls: [
    'Averaging 100 readings makes the measurement 100 times better — Random noise falls by the square root, to a tenth. Offset and gain error are untouched, and a drift is not random at all.',
    'Oversampling always adds bits — Only when the noise is at least about one count. A perfectly quiet input gives the same count every time, and the extra bits are zeros.',
    'A moving average is the right filter for everything — Spikes smear into it; a median rejects them. The two are often used in sequence: median first, then average.'
  ],
  terms: [
    { term: 'Oversampling', also: ['decimation'], def: 'Taking many more readings than the output needs, adding them and shifting the sum right to get a result with more bits: 4^k readings give k extra bits.' },
    { term: 'Dither', also: ['noise dither'], def: 'A small amount of noise that makes an input wander across the edges between converter steps, so that averaging can resolve the fraction of a step. Without it a steady input reads the same count each time.' },
    { term: 'Median filter', also: ['median of five'], def: 'A filter that sorts a few recent readings and passes on the middle one. A single spike never reaches the output, which an average would smear into it.' },
    { term: 'Exponential filter', also: ['EMA', 'exponential moving average', 'low-pass filter in software'], def: 'A filter that moves the output a fixed fraction alpha of the way towards each new reading: y = y + alpha × (x − y). It needs one stored value and acts like a first-order low-pass.' },
    { term: 'Hum', also: ['mains interference', '50 Hz pickup', '60 Hz pickup'], def: 'Interference at the mains frequency picked up by long wires and high-impedance inputs. Averaging over a whole number of mains periods cancels it.' }
  ],
  sim: 'me-noise',
  formulas: [
    {
      name: 'Noise after averaging',
      expr: 'sigN = sig1 / sqrt(n)',
      tex: '\\sigma_{N} = \\frac{\\sigma_{1}}{\\sqrt{N}}',
      vars: {
        sigN: { name: 'noise after averaging', q: 'count', tex: '\\sigma_{N}' },
        sig1: { name: 'noise of one reading', q: 'count', value: 4, tex: '\\sigma_{1}' },
        n: { name: 'readings averaged', q: 'count', value: 16, min: 1, int: true, tex: 'N' }
      },
      solveFor: 'sigN',
      note: 'For random noise that is independent from one reading to the next. Both noises are in counts (root-mean-square).',
      stories: { sigN: 'One reading of an ADC scatters by {sig1} counts. What does the average of {n} readings scatter by?', n: 'One reading scatters by {sig1} counts and you want {sigN}. How many readings must be averaged?' }
    },
    {
      name: 'Readings for extra bits',
      expr: 'N = 4^k',
      tex: 'N = 4^{k}',
      vars: {
        N: { name: 'readings to add', q: 'count', tex: 'N' },
        k: { name: 'extra bits', q: 'count', value: 2, min: 0, max: 8, int: true, tex: 'k' }
      },
      solveFor: 'N',
      note: 'Add N readings, then shift the sum right by k bits. It needs noise of at least about one count to dither the input.',
      stories: { N: 'You want {k} extra bits from a 12-bit converter by oversampling. How many readings do you add?', k: 'You add {N} readings and shift. How many extra bits does that give at most?' }
    },
    {
      name: 'Effective number of bits',
      expr: 'enob = bits - log2(sig * sqrt(12))',
      tex: '\\mathrm{ENOB} = n - \\log_2\\!\\left(\\sigma\\sqrt{12}\\right)',
      vars: {
        enob: { name: 'effective bits', q: 'count', tex: '\\mathrm{ENOB}' },
        bits: { name: 'converter bits', q: 'count', value: 12, min: 8, max: 24, int: true, tex: 'n' },
        sig: { name: 'noise of one reading (rms)', q: 'count', value: 2, min: 0.3, tex: '\\sigma' }
      },
      solveFor: 'enob',
      note: 'The noise is in counts, root-mean-square. A noise of 0.29 counts is the quantisation noise of an ideal converter and costs nothing; every doubling above that costs one bit.',
      stories: { enob: 'A {bits}-bit converter shows a noise of {sig} counts rms. How many effective bits does it have?' }
    }
  ],
  code: [
    {
      title: 'Two more bits from sixteen readings',
      about: 'Measures how much a steady voltage wanders, once with single readings and once with sixteen added and shifted right by two bits (a 14-bit result). The spread of the second is printed in 12-bit counts so the two are comparable.',
      needs: 'An ESP32 DevKit and a steady voltage on an ADC1 pin: a potentiometer or the divider of the first program of this topic.',
      wiring: [['GPIO34', 'steady voltage', 'with 100 nF to GND'], ['3V3', 'divider top'], ['GND', 'divider bottom']],
      blocks: `
        define read single :: my
          return (analog read pin (34))

        define read oversampled :: my
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34))
          end
          return (round ((sum) / (4)))    // 16 readings shifted right by 2 bits: a 14-bit value

        when started
          start serial at (115200) baud
          set [low v] to (100000)
          set [high v] to (0)
          repeat (40)
            set [x v] to (read oversampled)
            if <(x) < (low)> then
              set [low v] to (x)
            end
            if <(x) > (high)> then
              set [high v] to (x)
            end
            wait (0.005) seconds
          end
          print (join [14-bit spread: ] ((high) - (low)) [ steps = ] (((high) - (low)) / (4)) [ counts of 12 bits])
      `,
      cpp: String.raw`
        const int PIN = 34;                       // an ADC1 pin

        int readSingle() {
          return analogRead(PIN);                 // a 12-bit count
        }

        int readOversampled() {                   // 16 readings added, shifted right by 2 bits: a 14-bit value
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogRead(PIN);
          return sum >> 2;
        }

        // 40 values: print the smallest, the largest and the width of the band in 12-bit counts
        void spread(const char *name, int (*reader)(), float toCounts) {
          int low = 1 << 30, high = -1;
          for (int i = 0; i < 40; i++) {
            int v = reader();
            if (v < low) low = v;
            if (v > high) high = v;
            delay(5);
          }
          Serial.printf("%-20s min %6d  max %6d  spread %.1f counts of 12 bits\n", name, low, high, (high - low) * toCounts);
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          spread("single readings", readSingle, 1.0);
          spread("16 added, 14 bit", readOversampled, 0.25);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # an ADC1 pin

        def read_single():
            return adc.read_u16() >> 4            # a 12-bit count

        def read_oversampled():                   # 16 readings added, shifted right by 2 bits: a 14-bit value
            total = 0
            for _ in range(16):
                total += adc.read_u16() >> 4
            return total >> 2

        def spread(name, reader, to_counts):      # 40 values: print the smallest, the largest and the width of the band
            low, high = 1 << 30, -1
            for _ in range(40):
                v = reader()
                low = min(low, v)
                high = max(high, v)
                time.sleep_ms(5)
            print("%-20s min %6d  max %6d  spread %.1f counts of 12 bits" % (name, low, high, (high - low) * to_counts))

        while True:
            spread("single readings", read_single, 1.0)
            spread("16 added, 14 bit", read_oversampled, 0.25)
            time.sleep(1)
      `,
      output: `
        single readings      min   2012  max   2023  spread 11.0 counts of 12 bits
        16 added, 14 bit     min   8071  max   8081  spread 2.5 counts of 12 bits
      `,
      notes: ['An illustrative run. The second spread is smaller than the first by about a factor of four, as the square-root law predicts; with only 40 values the ratio is rough.', 'The blocks version prints the spread once; the C++ and MicroPython versions repeat it every second.', 'The extra two bits are only as good as the converter: they show a steadier number, not a more accurate one.']
    }
  ],
  examples: [
    {
      title: 'How many readings for 16 bits?',
      q: 'A 12-bit converter has a noise of 3 counts rms and you need a 16-bit result. How many readings are added and shifted, and how long does it take if one reading needs 40 µs?',
      steps: ['Four extra bits need $4^4 = 256$ readings.', 'The noise of 3 counts is more than one count, so it dithers the input across the steps: the method works.', 'The time is $256 \\times 40\\ \\mu\\mathrm{s} \\approx 10$ ms.'],
      a: '256 readings, shifted right by 4 bits, about 10 ms for the result. The numbers beyond the converter\'s accuracy are still only a steadier reading, not a truer one.'
    }
  ],
  quiz: [
    { q: 'One reading scatters by 8 counts. You average 64 readings. About how much does the average scatter?', choices: ['8 counts', '4 counts', '1 count', '0.125 counts'], a: 2, why: 'Noise falls with the square root: 8 / sqrt(64) = 8 / 8 = 1 count.' },
    { q: 'A radio burst occasionally throws one reading far off. Which filter handles it best?', choices: ['A plain average of 16', 'A median of 5', 'Shifting the sum right', 'A higher attenuation'], a: 1, why: 'A median discards the single wild value. An average smears it into the result, shifting every output until it leaves the window.' },
    { q: 'An input is perfectly steady and sits exactly between two converter steps, with no noise at all. Oversampling 16 readings will give a 14-bit result with extra information.', a: false, why: 'With no noise every reading is the same count, so the sum carries no extra information: oversampling needs noise to dither the input across the step edges.' },
    { q: 'Why average over exactly 20 ms at 50 Hz?', choices: ['The converter needs 20 ms to settle', 'A whole number of mains cycles contains equal positive and negative hum, which cancels', 'It halves the noise', 'The ADC2 conflict ends'], a: 1, why: 'Averaged over a whole number of periods, a sine wave sums to zero, so the 50 Hz hum disappears from the average.' }
  ],
  choose: {
    good: ['An average or exponential filter for random scatter', 'A median of five for spikes', 'Oversampling when the noise is a count or more and a few extra bits are worth the time'],
    avoid: ['Oversampling a noise-free input', 'Hoping averaging fixes offset, gain or drift', 'Averaging while a motor or radio burst is running if you can sample between bursts'],
    check: ['The spread of a few hundred readings of one steady voltage, before and after', 'That the averaging window is a whole number of mains cycles if hum is a problem', 'How long the readings take: 256 readings must fit in the time you have']
  },
  applications: [
    'Steadying a battery-voltage display that otherwise flickers by a digit.',
    'Reading a thermistor or a light sensor to a fraction of a degree or a lux.',
    'Getting a useful reading of a small signal, such as a shunt or a bridge, from the internal converter.',
    'Mains current measurement, where a whole number of cycles is sampled and the squares are averaged.'
  ],
  sources: [
    'Atmel, application note AVR121, *Enhancing ADC resolution by oversampling*: the 4^k rule.',
    'Espressif, *ESP-IDF Programming Guide*, ADC chapter: the notes on noise and the suggestions for multisampling.',
    'Analog Devices, *Data Conversion Handbook* (W. Kester, editor): the chapters on sampling, noise and oversampling converters.'
  ]
},

/* ================================================================ measuring a voltage */
{
  id: 'measuring-voltage',
  parent: 'measuring-electricity-and-force',
  title: 'Measuring a voltage',
  level: 1,
  short: 'The ESP can read 0 to about 3 V. Anything larger needs a divider, anything negative a bias, anything noisy a capacitor, and anything that can bite needs a clamp and often isolation. The same few moves bring a battery, a car and a factory into range.',
  keywords: ['voltage divider', 'resistor divider', 'battery voltage', '12 V', '24 V', '5 V sensor', 'ratio', 'overvoltage', 'clamp', 'Zener', 'TVS', 'protection', 'isolation', 'negative voltage', 'bias', 'source resistance', 'high impedance', 'voltmeter', 'divider current'],
  prereq: ['the-esp-adc', 'adc-attenuation-and-calibration', 'voltage-dividers-for-inputs'],
  related: ['measuring-battery-level', 'oversampling-and-noise', 'protection-parts', 'optocouplers', 'external-adc-and-dac', 'op-amps-for-sensors', 'esp-as-a-voltmeter', 'electronics:voltage-divider', 'electronics:meter-loading'],
  body: `The pin of an ESP reads 0 to about 3 V and must never see more than 3.3 V. The world is bigger: a lithium cell reaches 4.2 V, a car 14.4 V, an industrial supply 24 V, a sensor 5 V or 10 V, and some signals swing below zero. Bringing each into range takes the same few moves.

### Dividing down

Two resistors make a **voltage divider**: the pin sits at $V_{in} \\cdot R_2 / (R_1 + R_2)$, with R1 from the input to the pin and R2 from the pin to ground. Choose the ratio so that the highest voltage you expect lands at 80 to 90 % of the range of the attenuation you use ([[adc-attenuation-and-calibration]]). A twelve-volt battery that charges to 14.4 V: 56 kΩ and 10 kΩ give a ratio of 0.1515, so 14.4 V becomes 2.18 V, inside the range of every chip. A 47 kΩ and 10 kΩ pair looks similar but puts 14.4 V at 2.53 V, over the top of the original ESP32 and the C3.

### How big should the resistors be?

- **Small** (a few kΩ) makes the divider stiff: the converter's input and stray pickup hardly disturb it. It also draws current all the time: 14.4 V across 66 kΩ is 0.22 mA, which does not matter on a mains-powered board and ruins a battery product that sleeps at microamps.
- **Large** (hundreds of kΩ or MΩ) draws almost nothing but gives the converter a high source resistance: the first reading after a channel change is too low because the sampling capacitor has not filled. Put **100 nF from the pin to ground**, and read after waiting several times R × C (a 100 kΩ source and 100 nF settle in about 50 ms).
- **In between** (the usual choice, a total of 50 to 200 kΩ) with 100 nF and an average. For battery products use a MOSFET that connects the divider only while measuring.

### Accuracy

Resistors with 1 % tolerance move the ratio by up to about 2 % in the worst case. Measure the real input with a multimeter once and put the ratio of the two readings in the program as a correction factor. The ADC's own error ([[the-esp-adc]]) comes on top.

### Protection and special cases

- **Overvoltage.** The large top resistor limits the current if the input spikes; a 3.3 V Zener or a TVS diode at the pin, or Schottky diodes to the 3.3 V rail and to ground, clamp the excursion. Cars and industrial supplies produce spikes far above their nominal voltage.
- **Negative or alternating voltages.** Reference the divider to the 1.65 V mid-point (two equal resistors from 3.3 V to ground, with a capacitor), so that zero input reads half scale, or use an op-amp ([[op-amps-for-sensors]]).
- **High voltage, long cables, dirty grounds.** Use isolation: an isolated converter module, an optocoupler stage ([[optocouplers]]) or an isolating amplifier. **Never connect a divider to the mains** ([[mains-energy-monitoring]]).

> [!key] A divider brings a bigger voltage into the 0 to 3 V range; pick the ratio from the highest voltage expected, the resistance from the current you can afford, and add 100 nF at the pin. Clamp the pin against spikes, and isolate anything high or far away.`,
  ideas: [
    'A two-resistor divider scales a larger voltage down; choose the ratio so that the highest voltage lands at 80 to 90 % of the ADC range.',
    'The divider\'s resistance is a trade: small resistors waste current, large ones need 100 nF at the pin and time to settle.',
    'A divider that stays connected can use more current than the chip does asleep: switch it off with a MOSFET in a battery product.',
    'Clamp the pin against spikes, bias it for negative signals, and isolate high voltages and long cables.'
  ],
  pitfalls: [
    'Any two resistors in the right ratio will do — The sum matters too: it sets the drain current and the source resistance the ADC sees. A 10 MΩ pair without a capacitor reads low and noisily.',
    'The divider makes the pin safe for any input — It only scales a steady voltage. A spike of several times the nominal still drives the pin past 3.6 V unless a clamp and the top resistor hold it back.',
    'A 5 V sensor output can go straight to the pin if the sensor is lightly loaded — The pin tolerates 3.3 V (3.6 V at most). A sensor that swings to 5 V needs a divider, or a 3.3 V part.'
  ],
  terms: [
    { term: 'Voltage divider', also: ['resistor divider', 'potential divider'], def: 'Two resistors in series across a voltage, with the output taken from their junction: Vout = Vin × R2 / (R1 + R2). It scales a voltage down by a fixed ratio.' },
    { term: 'Source resistance', also: ['source impedance', 'output impedance'], def: 'The resistance a signal source presents to the converter: for a divider, R1 and R2 in parallel. A high value lets the sampling capacitor fill slowly and makes the reading too low.' },
    { term: 'Bias', also: ['mid-rail bias', 'virtual ground', 'DC offset'], def: 'A fixed voltage, usually half the supply, added to an alternating or bipolar signal so that it stays inside the converter\'s range of zero to full scale.' },
    { term: 'Clamp', also: ['input clamp', 'TVS diode', 'Zener clamp'], def: 'A component or pair of diodes that conducts when the pin voltage leaves its allowed range and so limits the excursion. The series resistance in front of it limits the current it must carry.' }
  ],
  sim: 'me-divider',
  formulas: [
    {
      name: 'Divider output',
      expr: 'Vout = Vin * R2 / (R1 + R2)',
      tex: 'V_{\\mathrm{out}} = V_{\\mathrm{in}}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vout: { name: 'voltage at the pin', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 14.4, min: 0, tex: 'V_{\\mathrm{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 56, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      },
      solveFor: 'Vout',
      note: 'The divider unloaded. The ADC and a stray wire load it a little: keep R1 in parallel with R2 below some tens of kΩ, or add 100 nF at the pin.',
      stories: { Vout: 'A battery of {Vin} is read through {R1} and {R2}. What voltage reaches the pin?', R1: 'A pin should see {Vout} when the input is {Vin}, with {R2} to ground. How large is the upper resistor?' }
    },
    {
      name: 'Current drawn by the divider',
      expr: 'I = Vin / (R1 + R2)',
      tex: 'I = \\frac{V_{\\mathrm{in}}}{R_1 + R_2}',
      vars: {
        I: { name: 'divider current', q: 'current', unit: 'µA', tex: 'I' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 4.2, min: 0, tex: 'V_{\\mathrm{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      solveFor: 'I',
      note: 'Compare it with the sleep current of the whole product ([[battery-life-budget]]).',
      stories: { I: 'A divider of {R1} and {R2} sits across a {Vin} battery. How much current does it draw all day?' }
    }
  ],
  code: [
    {
      title: 'A voltmeter for a 12 V battery',
      about: 'Reads a battery of up to about 16 V through a 56 kΩ and 10 kΩ divider, averages 64 readings, applies a correction factor and prints the voltage once a second. It warns below 11.8 V, a lead-acid battery that is nearly flat.',
      needs: 'An ESP32 DevKit, a 56 kΩ and a 10 kΩ resistor (1 %), 100 nF, a 3.3 V Zener diode (optional protection) and a 12 V battery. Keep the ESP\'s ground and the battery\'s negative joined.',
      wiring: [['battery +', '56 kΩ → GPIO34', 'the upper resistor R1'], ['GPIO34', '10 kΩ → GND', 'the lower resistor R2'], ['GPIO34', '100 nF → GND', 'steadies the reading'], ['GPIO34', '3.3 V Zener to GND, cathode on GPIO34', 'optional clamp against spikes'], ['battery −', 'GND']],
      blocks: `
        define input volts :: my
          set [total v] to (0)
          repeat (64)
            change [total v] by (analog read pin (34) in millivolts)
          end
          set [pinVolts v] to (((total) / (64)) / (1000))
          return (((pinVolts) * (((56000) + (10000)) / (10000))) * (1.000))    // 1.000: the correction found with a multimeter

        when started
          start serial at (115200) baud
        forever
          set [volts v] to (input volts)
          print (join [input: ] (volts) [ V])
          if <(volts) < (11.8)> then
            print [battery low]
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                  // an ADC1 pin
        const float R1 = 56000.0;                // from the input to the pin
        const float R2 = 10000.0;                // from the pin to ground
        const float CORRECTION = 1.000;          // true volts / shown volts, found once with a multimeter
        const int SAMPLES = 64;

        float inputVolts() {
          uint32_t sum = 0;
          for (int i = 0; i < SAMPLES; i++) {
            sum += analogReadMilliVolts(ADC_PIN);
            delayMicroseconds(100);
          }
          float pinVolts = sum / (float)SAMPLES / 1000.0;
          return pinVolts * (R1 + R2) / R2 * CORRECTION;
        }

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(ADC_PIN, ADC_11db);
        }

        void loop() {
          float volts = inputVolts();
          Serial.printf("input: %.2f V\n", volts);
          if (volts < 11.8) Serial.println("battery low");
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)  # an ADC1 pin
        R1 = 56000.0                             # from the input to the pin
        R2 = 10000.0                             # from the pin to ground
        CORRECTION = 1.000                       # true volts / shown volts, found once with a multimeter
        SAMPLES = 64

        def input_volts():
            total = 0
            for _ in range(SAMPLES):
                total += adc.read_uv()
                time.sleep_us(100)
            pin_volts = total / SAMPLES / 1e6
            return pin_volts * (R1 + R2) / R2 * CORRECTION

        while True:
            volts = input_volts()
            print("input: %.2f V" % volts)
            if volts < 11.8:
                print("battery low")
            time.sleep(1)
      `,
      output: `
        input: 12.64 V
        input: 12.63 V
        input: 11.74 V
        battery low
      `,
      notes: ['At 16 V the pin sees 2.42 V, the top of the usable range of the original ESP32 and the C3. A battery that may go higher needs a larger ratio.', 'The divider draws 0.18 mA at 12 V: fine on a car, not for a sleeping device. Use a MOSFET to connect it, or a pair of 1 MΩ and 180 kΩ with 100 nF and a longer settling time.', 'Put the correction factor in once: measure the battery with a multimeter, divide it by the number the program prints.']
    }
  ],
  choose: {
    good: ['A divider of 50 to 200 kΩ in total with 100 nF at the pin for most supplies and batteries', 'A MOSFET that switches the divider on only during a reading, for sleeping products', 'An isolated module when the voltage is high, the cable long or the grounds differ'],
    avoid: ['A divider of several MΩ read without a capacitor and a settling wait', 'A direct connection of any 5 V or 12 V signal to a pin', 'A divider on the mains, ever'],
    check: ['The highest voltage the input can reach, including spikes', 'That the pin voltage at that maximum is inside the range of the attenuation', 'The current the divider draws, against what the battery can spare']
  },
  examples: [
    {
      title: 'The divider that eats the battery',
      q: 'A battery sensor on an ESP32-C3 reads its 1000 mAh lithium cell (3.0 V to 4.2 V) through two 100 kΩ resistors. The C3 sleeps at 5 µA. What does the divider cost?',
      steps: ['At 4.2 V the divider draws $4.2 / 200\\,000 = 21\\ \\mu\\mathrm{A}$, four times the chip\'s own sleep current.', 'The average draw rises from about 5 µA to about 26 µA. With an 80 % usable capacity and a cell that loses 3 % a month by itself, the battery lasts roughly 2.0 years without the divider and 1.3 years with it.', 'Two 1 MΩ resistors cut the drain to 2.1 µA; with 100 nF at the pin, wait about 0.5 s after the pin is first read, or switch the divider with a MOSFET.'],
      a: 'The divider costs about a third of the battery life. Use megohm resistors with a capacitor and a wait, or a MOSFET that connects the divider only during the reading.'
    }
  ],
  quiz: [
    { q: 'A 12 V car battery charges up to 14.4 V. A 47 kΩ and 10 kΩ divider feeds an original ESP32 at 11 dB (usable to about 2.45 V). What happens at 14.4 V?', choices: ['The pin sees 2.1 V: fine', 'The pin sees 2.5 V: over the range, the reading bends and clips', 'The pin sees 3.3 V', 'The chip is damaged'], a: 1, why: '14.4 V × 10 / 57 = 2.53 V. The pin is not in danger, but it is above the recommended range of the original ESP32, so the top of the scale is unreliable. 56 kΩ and 10 kΩ would give 2.18 V.' },
    { q: 'You replace a 10 kΩ divider by one of 10 MΩ to save current. The readings are now low and jumpy. Why?', choices: ['The ADC cannot read high voltages', 'The high source resistance lets the sampling capacitor fill slowly; add 100 nF and let it settle', 'The ESP reads ratios', 'The resistors are too accurate'], a: 1, why: 'The converter draws a little charge at every sample. A high-resistance source cannot supply it in time, so the reading is low and noisy. A capacitor at the pin holds the charge.' },
    { q: 'A divider of 20 kΩ in total across a 4.2 V cell is harmless to a battery product that sleeps at 10 µA.', a: false, why: 'It draws 4.2 V / 20 kΩ = 210 µA all the time, twenty times the sleep current. The product would be flat in weeks.' },
    { q: 'A signal swings from −1 V to +1 V. What is the standard way to read it with the ESP?', choices: ['Connect it straight to the pin', 'Scale it down and add a bias of half the range, so that zero reads mid-scale', 'Use a larger attenuation', 'Read the absolute value'], a: 1, why: 'The converter cannot read below 0 V and a negative input can damage the pin. A resistor network that scales and lifts the signal around 1.65 V maps it into the range.' }
  ],
  applications: [
    'Battery gauges in cars, solar systems, e-bikes and model vehicles.',
    'Reading the output of 0 to 5 V or 0 to 10 V sensors and control signals ([[four-to-twenty-milliamp]]).',
    'Monitoring supply rails to detect brown-outs and failed regulators.',
    'A home-built voltmeter or data logger ([[esp-as-a-voltmeter]]).'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: absolute maximum ratings of the pins, and the ADC characteristics.',
    'Horowitz and Hill, *The Art of Electronics*: the sections on voltage dividers, source impedance and input protection.',
    'Espressif, *ESP-IDF Programming Guide*, ADC chapter: the advice on source impedance and a capacitor at the pin.'
  ]
},

/* ================================================================ shunts and the INA219 */
{
  id: 'measuring-current-with-shunts',
  parent: 'measuring-electricity-and-force',
  title: 'Measuring current: shunts and the INA219',
  level: 2,
  short: 'To measure a current, pass it through a small known resistor and measure the voltage across it. The art is choosing a resistor big enough to read and small enough not to disturb, and an amplifier that can read millivolts on a rail that may sit at 12 V.',
  keywords: ['shunt', 'current sense', 'INA219', 'INA226', 'high side', 'low side', 'burden voltage', 'Kelvin', 'four-wire', 'PGA', 'milliohm', 'current measurement', 'I2C', 'power monitor', 'bus voltage', 'calibration register', 'ampere'],
  prereq: ['measuring-voltage', 'i2c', 'registers-and-datasheets'],
  related: ['measuring-current', 'hall-current-sensors', 'op-amps-for-sensors', 'esp-as-a-power-meter', 'project-energy-monitor', 'electronics:instrumentation-amplifier', 'electronics:resistance-ohms-law'],
  body: `Ohm's law turns current into voltage: $V = I \\cdot R$. Put a resistor of known value, a **shunt**, in the path of the current and measure the voltage across it. A shunt for a 3 A load might be 0.1 Ω: at 3 A it drops 0.3 V and at 1 mA only 0.1 mV. That last number is the whole problem. One count of the ESP's own ADC is worth about 0.6 mV, so the ADC alone sees nothing of a few milliamps through 0.1 Ω; an amplifier or a converter built for millivolts has to look at the shunt.

### The trade

A bigger shunt gives a bigger signal, and costs twice. It drops voltage in the supply of the load, the **burden voltage** I × R, and it burns power $I^2 R$ as heat. Take the smallest resistance whose full-scale voltage the measuring chip can use. A shunt must be rated for at least twice the power it dissipates, have a low temperature coefficient and be a four-terminal ("Kelvin") part or be connected with separate sense traces from its own pads, or the resistance of the copper becomes part of the shunt.

### High side and low side

A **low-side** shunt sits between the load and ground: simple, the signal is near 0 V, but the load's ground rises by the burden voltage. A **high-side** shunt sits between the supply and the load: the load's ground is clean, but the millivolts ride on top of the supply voltage, so the measuring chip must tolerate a large common-mode voltage. The INA219 is built for exactly that.

### The INA219 and its relatives

The INA219 is an I2C chip (address 0x40, sixteen choices with its A0 and A1 pins) that measures the voltage across the shunt and the bus voltage on the load side, from 0 to 26 V. Its shunt range is selectable in four steps: ±40, ±80, ±160 or ±320 mV, always with 12 bits, so one step is the range divided by 4096: 10, 20, 40 or 80 µV. The usual module has a 0.1 Ω shunt, so ±320 mV means ±3.2 A in steps of 0.8 mA, and ±40 mV means ±0.4 A in steps of 0.1 mA. A conversion takes 84 µs at 9 bits to 532 µs at 12 bits, and the chip can average up to 128 of them. A calibration register, set from the shunt's value, lets it compute the current and the power itself. The INA226 has 16 bits (2.5 µV steps, a range of ±81.92 mV), and measures up to 36 V.

### Traps

- **Conversion time against bursts.** The INA219 averages over its conversion window: it logs a Wi-Fi burst of a few milliseconds coarsely.
- **Wrong range.** More than the range's voltage across the shunt saturates the reading; pick the range with the shunt value in mind.
- **Shunt tolerance.** A 1 % shunt gives 1 % error on its own. Calibrate against a multimeter in series.

> [!key] A shunt turns current into a voltage: choose its resistance for the full-scale voltage of the amplifier, remembering the burden voltage and the heat. A chip such as the INA219 reads millivolts on a rail of up to 26 V over I2C and computes current and power for you.`,
  ideas: [
    'A shunt converts current to voltage by Ohm\'s law; the ESP\'s own ADC is too coarse for milliamps through a small shunt, so an amplifier or a precision converter reads it.',
    'The burden voltage and the heat in the shunt grow with the resistance: use the smallest resistance whose full-scale voltage the chip can use.',
    'A high-side shunt keeps the load\'s ground clean but needs a chip that withstands the supply voltage at its inputs, such as the INA219 (to 26 V).',
    'The INA219\'s four ranges give 10, 20, 40 or 80 µV per step: the smaller the range, the finer the current step.'
  ],
  pitfalls: [
    'A bigger shunt is always better — It reads better and it disturbs more: the load loses I × R volts and the shunt dissipates I²R. A phone charger on a 1 Ω shunt at 2 A loses 2 V and burns 4 W.',
    'The INA219 measures to 0.1 mA with the usual module — Only on its lowest range (±40 mV, ±0.4 A). On the default ±320 mV range the step is 0.8 mA, and the module\'s limit is 3.2 A.',
    'Any PCB trace is fine for the sense connection — A milliohm of copper in series with a 10 mΩ shunt is ten percent. Take the sense lines from the shunt\'s own pads.'
  ],
  terms: [
    { term: 'Shunt', also: ['current-sense resistor', 'shunt resistor'], def: 'A low-value precision resistor in the path of a current, used to measure the current as the voltage across it. Typical values run from 1 mΩ to 1 Ω.' },
    { term: 'Burden voltage', also: ['insertion drop', 'voltage drop'], def: 'The voltage a current-measuring device removes from the circuit being measured: for a shunt, the current times its resistance. The load sees the supply minus this.' },
    { term: 'High-side sensing', also: ['low-side sensing'], def: 'Placing the shunt in the supply line, between the supply and the load (high side) or in the ground line (low side). High side keeps the load grounded but needs inputs that tolerate the supply voltage.' },
    { term: 'INA219', also: ['INA226', 'power monitor', 'current-sense amplifier'], def: 'An I2C chip that measures the voltage across a shunt and the bus voltage and reports current and power. The INA219 reads up to 26 V with 12-bit steps; the INA226 is a 16-bit part for up to 36 V.' },
    { term: 'Kelvin connection', also: ['four-wire sensing', 'four-terminal shunt'], def: 'A way of connecting a shunt with two terminals for the current and two separate sense terminals, so that the resistance of the wiring and solder joints is not part of the measured resistance.' }
  ],
  sim: 'me-shunt',
  formulas: [
    {
      name: 'Voltage across the shunt',
      expr: 'Vs = I * R',
      tex: 'V_{s} = I\\,R',
      vars: {
        Vs: { name: 'shunt voltage', q: 'voltage', unit: 'mV', tex: 'V_{s}' },
        I: { name: 'current', q: 'current', unit: 'A', value: 0.5, min: 0, tex: 'I' },
        R: { name: 'shunt resistance', q: 'resistance', unit: 'mΩ', value: 100, tex: 'R' }
      },
      solveFor: 'Vs',
      note: 'Ohm\'s law. The same voltage is the burden voltage that the load loses from its supply.',
      stories: { Vs: 'A load takes {I} through a shunt of {R}. What voltage drops across it?', I: 'A shunt of {R} shows {Vs}. What current flows?' }
    },
    {
      name: 'Heat in the shunt',
      expr: 'P = I^2 * R',
      tex: 'P = I^{2} R',
      vars: {
        P: { name: 'power in the shunt', q: 'power', unit: 'W', tex: 'P' },
        I: { name: 'current', q: 'current', unit: 'A', value: 3, min: 0, tex: 'I' },
        R: { name: 'shunt resistance', q: 'resistance', unit: 'mΩ', value: 100, tex: 'R' }
      },
      solveFor: 'P',
      note: 'Choose a shunt rated for at least twice this, or the resistance will drift as it heats.',
      stories: { P: 'A shunt of {R} carries {I}. How much power does it dissipate?' }
    },
    {
      name: 'Shunt for a full scale',
      expr: 'R = Vfs / Imax',
      tex: 'R = \\frac{V_{\\mathrm{fs}}}{I_{\\max}}',
      vars: {
        R: { name: 'shunt resistance', q: 'resistance', unit: 'mΩ', tex: 'R' },
        Vfs: { name: 'full-scale shunt voltage', q: 'voltage', unit: 'mV', value: 40, min: 0, tex: 'V_{\\mathrm{fs}}' },
        Imax: { name: 'largest current', q: 'current', unit: 'A', value: 2, min: 0, tex: 'I_{\\max}' }
      },
      solveFor: 'R',
      note: 'The largest resistance that does not clip: with the INA219 take Vfs of 40, 80, 160 or 320 mV. Then check the power and the burden voltage.',
      stories: { R: 'An INA219 range of {Vfs} must cover up to {Imax}. What shunt resistance does it need?' }
    },
    {
      name: 'Smallest current step',
      expr: 'Istep = Vstep / R',
      tex: 'I_{\\mathrm{step}} = \\frac{V_{\\mathrm{step}}}{R}',
      vars: {
        Istep: { name: 'current of one step', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{step}}' },
        Vstep: { name: 'voltage of one step', q: 'voltage', unit: 'µV', value: 10, min: 0, tex: 'V_{\\mathrm{step}}' },
        R: { name: 'shunt resistance', q: 'resistance', unit: 'mΩ', value: 100, tex: 'R' }
      },
      solveFor: 'Istep',
      note: 'For the INA219 the step is the range divided by 4096: 10, 20, 40 or 80 µV.',
      stories: { Istep: 'A converter with a step of {Vstep} reads a shunt of {R}. What current does one step stand for?' }
    }
  ],
  code: [
    {
      title: 'Current, voltage and power with an INA219',
      about: 'Sets the INA219 to its ±40 mV range (±0.4 A with the usual 0.1 Ω shunt) and writes the calibration register for steps of 0.05 mA, then prints bus voltage, shunt voltage, current and power twice a second. The registers are used directly so the three languages stay alike.',
      needs: 'An ESP32 DevKit, an INA219 module with a 0.1 Ω shunt (address 0x40) and a load of up to 400 mA, such as a few LEDs with resistors, on a supply of up to 16 V.',
      wiring: [['INA219 VIN+', 'supply +', 'the current enters here'], ['INA219 VIN−', 'load +', 'the current leaves here'], ['load −', 'supply − and GND'], ['INA219 VCC, GND', '3V3, GND'], ['INA219 SDA, SCL', 'GPIO21, GPIO22', 'add 4.7 kΩ pull-ups if the module has none']],
      blocks: `
        define write register (reg) value (value) :: bus
          I2C write (value) to address (0x40) register (reg)

        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz
          write register (0x00) value (0x019F)    // 16 V range, ±40 mV, 12-bit, continuous
          write register (0x05) value (8192)      // calibration: 0.04096 / (0.00005 A x 0.1 ohm)
        forever
          set [busV v] to (((I2C read (2 bytes) from address (0x40) register (0x02)) / (8)) * (0.004))
          set [shuntmV v] to ((I2C read (2 bytes, signed) from address (0x40) register (0x01)) * (0.01))
          set [currentmA v] to ((I2C read (2 bytes, signed) from address (0x40) register (0x04)) * (0.05))
          print (join [bus ] (busV) [ V  shunt ] (shuntmV) [ mV  current ] (currentmA) [ mA])
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t INA219 = 0x40;                // A0 and A1 to GND
        const uint8_t REG_CONFIG = 0x00, REG_SHUNT = 0x01, REG_BUS = 0x02, REG_POWER = 0x03, REG_CURRENT = 0x04, REG_CAL = 0x05;
        const float CURRENT_LSB_MA = 0.05;          // Cal = 0.04096 / (0.00005 A x 0.1 ohm) = 8192
        const float POWER_LSB_MW = 20 * CURRENT_LSB_MA;

        void writeReg(uint8_t reg, uint16_t value) {
          Wire.beginTransmission(INA219);
          Wire.write(reg);
          Wire.write(value >> 8);
          Wire.write(value & 0xFF);
          Wire.endTransmission();
        }

        uint16_t readReg(uint8_t reg) {
          Wire.beginTransmission(INA219);
          Wire.write(reg);
          Wire.endTransmission(false);
          Wire.requestFrom(INA219, (size_t)2);
          uint16_t value = Wire.read() << 8;
          value |= Wire.read();
          return value;
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22, 400000);
          writeReg(REG_CONFIG, 0x019F);             // 16 V range, +-40 mV, 12-bit, continuous
          writeReg(REG_CAL, 8192);
        }

        void loop() {
          float busV = (readReg(REG_BUS) >> 3) * 0.004;              // bits 15..3, 4 mV per step
          float shuntMv = (int16_t)readReg(REG_SHUNT) * 0.01;        // 10 uV per step
          float currentMa = (int16_t)readReg(REG_CURRENT) * CURRENT_LSB_MA;
          float powerMw = readReg(REG_POWER) * POWER_LSB_MW;
          Serial.printf("bus %.3f V  shunt %.2f mV  current %.2f mA  power %.1f mW\n", busV, shuntMv, currentMa, powerMw);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import struct, time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        INA219 = 0x40                               # A0 and A1 to GND
        REG_CONFIG, REG_SHUNT, REG_BUS, REG_POWER, REG_CURRENT, REG_CAL = 0x00, 0x01, 0x02, 0x03, 0x04, 0x05
        CURRENT_LSB_MA = 0.05                       # Cal = 0.04096 / (0.00005 A x 0.1 ohm) = 8192
        POWER_LSB_MW = 20 * CURRENT_LSB_MA

        def write_reg(reg, value):
            i2c.writeto_mem(INA219, reg, struct.pack(">H", value))

        def read_reg(reg, signed=False):
            return struct.unpack(">h" if signed else ">H", i2c.readfrom_mem(INA219, reg, 2))[0]

        write_reg(REG_CONFIG, 0x019F)               # 16 V range, +-40 mV, 12-bit, continuous
        write_reg(REG_CAL, 8192)

        while True:
            bus_v = (read_reg(REG_BUS) >> 3) * 0.004               # bits 15..3, 4 mV per step
            shunt_mv = read_reg(REG_SHUNT, True) * 0.01            # 10 uV per step
            current_ma = read_reg(REG_CURRENT, True) * CURRENT_LSB_MA
            power_mw = read_reg(REG_POWER) * POWER_LSB_MW
            print("bus %.3f V  shunt %.2f mV  current %.2f mA  power %.1f mW" % (bus_v, shunt_mv, current_ma, power_mw))
            time.sleep_ms(500)
      `,
      output: `
        bus 5.012 V  shunt 1.84 mV  current 18.40 mA  power 92.0 mW
        bus 5.012 V  shunt 1.85 mV  current 18.50 mA  power 92.5 mW
      `,
      notes: ['With the module\'s 0.1 Ω shunt the ±40 mV range ends at 0.4 A. For up to 3.2 A write 0x399F (the power-on default, ±320 mV) and a calibration of 4096, which gives steps of 0.1 mA in the current register but readings that are good only to 0.8 mA.', 'The bus voltage is measured on the load side of the shunt; all three grounds must be joined. The module\'s supply pin takes 3.3 V.', 'The registers and their scaling are those of the INA219 datasheet; libraries such as the Adafruit INA219 wrap the same steps.']
    }
  ],
  choose: {
    good: ['An INA219 or INA226 for currents from a milliamp to a few amperes on rails up to 26 V or 36 V', 'A high-side shunt when the load must stay grounded', 'A multimeter in series, once, to check the shunt\'s real value'],
    avoid: ['The ESP\'s own ADC across a shunt below an ampere, with no amplifier', 'A shunt larger than the burden voltage allows', 'Sensing wires taken from the high-current copper instead of the shunt\'s pads'],
    check: ['The largest current and the voltage that gives across the shunt', 'The power in the shunt against its rating, with a factor of two', 'That the chip\'s range and step fit both the smallest and the largest current you care about']
  },
  examples: [
    {
      title: 'Choosing the range and the shunt',
      q: 'A device draws between 5 mA and 1.2 A from a 5 V supply. An INA219 module has a 0.1 Ω shunt. Which range suits, what is the step, and what does the shunt cost the device?',
      steps: ['At 1.2 A the shunt drops $1.2 \\times 0.1 = 0.12$ V = 120 mV, so the ±40 mV range clips; the ±160 mV range (up to 1.6 A) is the smallest that fits.', 'On that range one step is 160 mV / 4096 = 39 µV, which is 0.39 mA with 0.1 Ω. The 5 mA end is read to about 8 %.', 'At 1.2 A the device loses 0.12 V of its 5 V and the shunt dissipates $1.2^2 \\times 0.1 = 0.14$ W.'],
      a: 'Use the ±160 mV range: 0.39 mA steps, 0.12 V burden and 0.14 W of heat. The 5 mA floor is only read to a few percent; a second, larger shunt range or a 1 Ω shunt for the low currents would improve it.'
    }
  ],
  quiz: [
    { q: 'A 0.1 Ω shunt carries 2 A. How much voltage does the load lose, and how much heat does the shunt make?', choices: ['0.2 V and 0.4 W', '0.2 V and 0.2 W', '2 V and 4 W', '0.1 V and 0.2 W'], a: 0, why: 'V = I × R = 2 × 0.1 = 0.2 V; P = I² × R = 4 × 0.1 = 0.4 W.' },
    { q: 'An INA219 on its ±320 mV range with a 0.1 Ω shunt. What is the smallest current step?', choices: ['0.1 mA', '0.8 mA', '3.2 mA', '10 µA'], a: 1, why: 'Twelve bits across the range: 320 mV / 4096 = 78 µV per step, which is about 0.8 mA through 0.1 Ω. Only the ±40 mV range gives 0.1 mA.' },
    { q: 'A shunt in the ground line of a load is called a high-side shunt.', a: false, why: 'A shunt in the ground line is low-side. High side means between the supply and the load, where the measuring chip must tolerate the supply voltage on its inputs.' },
    { q: 'You want to measure a few milliamps with the ESP\'s own ADC across a 0.1 Ω shunt. Why does it fail?', choices: ['The ADC cannot read voltages', 'Five milliamps give 0.5 mV, below one count of the ADC', 'Shunts only work with AC', 'The pin is input only'], a: 1, why: '5 mA through 0.1 Ω is 0.5 mV, which is less than one ADC count (about 0.6 mV) and below the noise. A shunt amplifier or a converter built for millivolts is needed.' }
  ],
  applications: [
    'A power logger that measures the current of a battery project from deep sleep to Wi-Fi burst ([[measuring-current]]).',
    'Monitoring a solar panel, a battery bank or a 12 V accessory.',
    'Detecting a jammed motor or a blown LED string from the change of its current.',
    'Bench power supplies and chargers with a built-in current display ([[esp-as-a-power-meter]]).'
  ],
  sources: [
    'Texas Instruments, *INA219 datasheet*: register map, shunt and bus voltage steps, calibration register and conversion times.',
    'Texas Instruments, *INA226 datasheet*, for the 16-bit part.',
    'Espressif, *ESP-IDF Programming Guide*, I2C master driver; Arduino core for ESP32, *Wire* API (core 3.3).'
  ]
},

/* ================================================================ Hall sensors and clamps */
{
  id: 'hall-current-sensors',
  parent: 'measuring-electricity-and-force',
  title: 'Hall current sensors and clamps',
  level: 2,
  short: 'Two ways to measure current without breaking the circuit: a Hall chip beside a copper bar (the ACS712 family), which handles direct current and has a 2.5 V mid-point, and a clamp-on transformer (the SCT-013), which handles alternating current only and needs a burden resistor and a bias.',
  keywords: ['ACS712', 'Hall effect', 'current sensor', 'SCT-013', 'current transformer', 'CT clamp', 'burden resistor', 'bias', 'RMS', 'non-invasive', 'split-core', '2.5 V', 'sensitivity', 'mV per amp', 'AC current', 'isolation', 'zero offset'],
  prereq: ['measuring-voltage', 'oversampling-and-noise', 'measuring-current-with-shunts'],
  related: ['mains-energy-monitoring', 'switching-mains-safely', 'project-energy-monitor', 'esp-as-a-power-meter', 'electronics:hall-sensors', 'electronics:rms-values', 'physics:hall-effect', 'electronics:transformers-practical'],
  body: `A shunt has to sit in the path of the current, and on a mains cable that means on a live conductor. Two sensors read current through its *magnetic field* instead and isolate the circuit: the **Hall chip**, which senses the field of the current in its own copper bar, and the **clamp**, a current transformer that closes round the wire.

### The Hall chip: ACS712

In the ACS712 the current flows through a copper path inside the chip (about 1.2 mΩ) and a Hall element beside it puts out $V = V_{cc}/2 + S \\cdot I$. On its 5 V supply the output rests at **2.5 V** with no current and moves up for one direction, down for the other, so it measures direct and alternating current alike. The sensitivity S depends on the version:

| Version | Range | Sensitivity |
|---|---|---|
| ACS712-05B | ±5 A | 185 mV/A |
| ACS712-20A | ±20 A | 100 mV/A |
| ACS712-30A | ±30 A | 66 mV/A |

It is a **5 V part**, so the output must be scaled before it reaches an ESP pin: two resistors in a 2:3 ratio (10 kΩ over 20 kΩ) bring 2.5 V to 1.67 V and the 5 A version's sensitivity to 123 mV/A. The output is *ratiometric*: it follows the 5 V supply, which the ESP's converter does not, so a 2 % sag moves the zero by 50 mV (a quarter of an ampere): re-measure the zero often. Its noise, about 20 mV peak to peak, hides currents below roughly 0.1 A. 

### The clamp: SCT-013

A clamp-on **current transformer** has thousands of secondary turns: the SCT-013-000 turns 100 A in the wire into 50 mA at its jack. It works only for **alternating current**. A resistor, the **burden**, across the jack turns that current into a voltage, and two equal resistors give a **mid-rail bias** so that the voltage swings around 1.65 V. Choose the burden so that the peak at your largest current stays inside the ADC's range (at 11 dB the original ESP32 allows about ±0.8 V around the bias): $R = V_{swing} / (\\sqrt{2}\\, I_{max} / N)$. For 20 A and N = 2000 that is about 56 Ω. Clamps with a built-in burden (30 A to 1 V, say) give a voltage: check its peak against the range.

### From waveform to current

Both sensors give a waveform, not a number. Sample it for a whole number of mains cycles (200 ms holds ten at 50 Hz and twelve at 60 Hz), subtract the mean, square, average and take the square root. That is the **RMS** current ([[mains-energy-monitoring]]).

> [!warn] A clamp is the least invasive way to measure mains current, but it is still mains. Clamp one insulated conductor of a cable you may touch (both conductors of a flex cancel), and never open a consumer unit unless you are qualified. Never leave a current transformer open-circuit while current flows: its secondary can develop a dangerous voltage.

> [!key] A Hall chip measures DC and AC current through its isolated copper bar and rests at mid-supply; a clamp measures AC only and needs a burden resistor and a mid-rail bias. Scale the 5 V Hall output down, size the burden for the ADC range, and sample whole cycles to get RMS.`,
  ideas: [
    'A Hall current sensor reads direct and alternating current through isolated copper; its output rests at half the supply, so it needs an offset and a scaled-down 5 V output.',
    'A clamp-on current transformer measures alternating current only, giving a current that a burden resistor turns into a voltage.',
    'Bias the clamp\'s signal to 1.65 V and size the burden so that the peak stays inside the ADC\'s range; the original ESP32 gives only about ±0.8 V.',
    'Sample whole mains cycles, subtract the mean and take the root of the mean square to get the RMS current.'
  ],
  pitfalls: [
    'The ESP32\'s own Hall sensor measures current — That sensor measured magnetic field, was never meant for current and has been withdrawn from current software. The sensors on this page are external parts.',
    'An SCT-013 clamp measures DC too — A transformer cannot pass steady current. For direct current use a Hall sensor or a shunt.',
    'The clamp can go round the whole cable — A flex carries the live and the neutral in opposite directions, and their fields cancel. Clamp one conductor only.'
  ],
  terms: [
    { term: 'Hall effect sensor', also: ['Hall sensor', 'Hall current sensor', 'ACS712'], def: 'A sensor that produces a voltage proportional to the magnetic field through it. A current sensor of this kind lets the current flow through an internal conductor and measures its field, isolating the circuit.' },
    { term: 'Current transformer', also: ['CT', 'clamp meter sensor', 'SCT-013'], def: 'A transformer with the measured wire as a single-turn primary and a coil of many turns as the secondary, so that a small proportional alternating current flows in the secondary. It works only for alternating current.' },
    { term: 'Burden resistor', also: ['burden', 'termination resistor'], def: 'The resistor across a current transformer\'s secondary that turns its current into a voltage. It must always be connected while the primary carries current.' },
    { term: 'RMS', also: ['root mean square', 'RMS current'], def: 'The root of the mean of the squares of an alternating quantity: the value of a steady current that would give the same heating. Computed from samples over a whole number of cycles.' }
  ],
  sim: 'me-clamp',
  formulas: [
    {
      name: 'Burden resistor for a current clamp',
      expr: 'R = Vswing * N / (sqrt(2) * Imax)',
      tex: 'R = \\frac{V_{\\mathrm{swing}}\\,N}{\\sqrt{2}\\;I_{\\max}}',
      vars: {
        R: { name: 'burden resistance', q: 'resistance', unit: 'Ω', tex: 'R' },
        Vswing: { name: 'allowed peak swing around the bias', q: 'voltage', unit: 'V', value: 0.8, min: 0, tex: 'V_{\\mathrm{swing}}' },
        N: { name: 'turns ratio', q: 'count', value: 2000, min: 1, tex: 'N' },
        Imax: { name: 'largest RMS current', q: 'current', unit: 'A', value: 20, min: 0, tex: 'I_{\\max}' }
      },
      solveFor: 'R',
      note: 'The secondary peak current is √2 × Imax / N; the burden turns it into the swing. The 2000 is the ratio of the SCT-013 clamps (100 A to 50 mA). Take the next smaller standard value.',
      stories: { R: 'A clamp with a ratio of {N} must measure up to {Imax} RMS with a peak swing of {Vswing} around the bias. What burden resistor is needed?' }
    },
    {
      name: 'Output of a Hall sensor',
      expr: 'V = Vcc / 2 + S * I',
      tex: 'V = \\frac{V_{cc}}{2} + S\\,I',
      vars: {
        V: { name: 'sensor output', q: 'voltage', unit: 'V', tex: 'V' },
        Vcc: { name: 'sensor supply', q: 'voltage', unit: 'V', value: 5, min: 0, tex: 'V_{cc}' },
        S: { name: 'sensitivity', unit: 'V/A', value: 0.185, tex: 'S' },
        I: { name: 'current', q: 'current', unit: 'A', value: 3, signed: true, tex: 'I' }
      },
      solveFor: 'V',
      note: 'For a bidirectional Hall sensor such as the ACS712 (S = 0.185 V/A for the 5 A version). The ESP pin then sees this voltage after its divider.',
      stories: { V: 'A Hall sensor on {Vcc} with a sensitivity of {S} carries {I}. What is its output voltage?' }
    }
  ],
  code: [
    {
      title: 'RMS current from an SCT-013 clamp',
      about: 'Samples the clamp\'s signal 400 times at 500 µs intervals (200 ms: whole cycles at 50 Hz and at 60 Hz), takes away the bias, and prints the RMS current once a second. The apparent power at 230 V is only a rough guide: it ignores the power factor ([[mains-energy-monitoring]]).',
      needs: 'An ESP32 DevKit, an SCT-013-000 clamp with its 3.5 mm jack, a 56 Ω burden resistor, two 10 kΩ resistors for the bias, and 10 µF. For a smaller current choose a larger burden (and check the peak voltage).',
      wiring: [['3V3', '10 kΩ → bias node'], ['bias node', '10 kΩ → GND'], ['bias node', '10 µF → GND', 'steadies the bias'], ['jack sleeve', 'bias node'], ['jack tip', 'GPIO35 and 56 Ω to the bias node', 'the burden: tip to sleeve']],
      blocks: `
        define current rms :: my
          set [sum v] to (0)
          set [sumsq v] to (0)
          repeat (400)
            set [volts v] to ((analog read pin (35) in millivolts) / (1000))
            change [sum v] by (volts)
            change [sumsq v] by ((volts) * (volts))
            wait (0.0005) seconds       // 500 microseconds between samples
          end
          set [mean v] to ((sum) / (400))
          set [rms v] to (sqrt of (((sumsq) / (400)) - ((mean) * (mean))))
          return (((rms) / (56)) * (2000))    // burden 56 ohm, turns ratio 2000

        when started
          start serial at (115200) baud
        forever
          set [amps v] to (current rms)
          print (join (amps) [ A, about ] ((amps) * (230)) [ VA at 230 V])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int PIN = 35;                          // an ADC1 pin
        const float TURNS = 2000.0;                  // SCT-013-000: 100 A in, 50 mA out
        const float BURDEN_OHMS = 56.0;
        const int SAMPLES = 400;                     // 400 x 500 us = 200 ms = 10 cycles of 50 Hz, 12 of 60 Hz
        const uint32_t INTERVAL_US = 500;

        float readCurrentRms() {
          double sum = 0, sumSq = 0;
          uint32_t next = micros();
          for (int i = 0; i < SAMPLES; i++) {
            float v = analogReadMilliVolts(PIN) / 1000.0;      // volts at the pin
            sum += v;
            sumSq += v * v;
            next += INTERVAL_US;
            while ((int32_t)(micros() - next) < 0) {}          // wait for the next tick
          }
          double mean = sum / SAMPLES;                          // the mean is the bias: take it away
          double rmsVolts = sqrt(sumSq / SAMPLES - mean * mean);
          return rmsVolts / BURDEN_OHMS * TURNS;               // secondary amps times the turns ratio
        }

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(PIN, ADC_11db);
        }

        void loop() {
          float amps = readCurrentRms();
          Serial.printf("%.2f A, about %.0f VA at 230 V\n", amps, amps * 230);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time, math

        adc = ADC(Pin(35), atten=ADC.ATTN_11DB)      # an ADC1 pin
        TURNS = 2000.0                               # SCT-013-000: 100 A in, 50 mA out
        BURDEN_OHMS = 56.0
        SAMPLES = 400                                # 400 x 500 us = 200 ms = 10 cycles of 50 Hz, 12 of 60 Hz
        INTERVAL_US = 500

        def read_current_rms():
            total = 0.0
            total_sq = 0.0
            nxt = time.ticks_us()
            for _ in range(SAMPLES):
                v = adc.read_uv() / 1e6              # volts at the pin
                total += v
                total_sq += v * v
                nxt = time.ticks_add(nxt, INTERVAL_US)
                while time.ticks_diff(nxt, time.ticks_us()) > 0:
                    pass                             # wait for the next tick
            mean = total / SAMPLES                   # the mean is the bias: take it away
            rms_volts = math.sqrt(max(0.0, total_sq / SAMPLES - mean * mean))
            return rms_volts / BURDEN_OHMS * TURNS   # secondary amps times the turns ratio

        while True:
            amps = read_current_rms()
            print("%.2f A, about %.0f VA at 230 V" % (amps, amps * 230))
            time.sleep(1)
      `,
      output: `
        0.04 A, about 9 VA at 230 V
        4.37 A, about 1005 VA at 230 V
        4.41 A, about 1014 VA at 230 V
      `,
      notes: ['With nothing clamped the program shows a small offset (here 0.04 A): that is the noise floor. Subtract it, or ignore readings below it.', 'If one reading takes longer than 500 µs the window lengthens and is no longer whole cycles; MicroPython is slower than C++ here. Lengthen the interval and use a window of exactly 200 ms.', 'Calibrate against a known load, such as a kettle or a heater of stated power on a meter, and put the factor into the program.']
    }
  ],
  choose: {
    good: ['A split-core clamp to measure the current of a cable without opening it, for alternating current', 'A Hall chip on a PCB for direct current or alternating current when isolation is wanted', 'A burden chosen from the formula, with the peak checked against the ADC range'],
    avoid: ['A clamp for DC', 'A Hall sensor and its 5 V output wired straight to a pin', 'A current transformer with the burden removed while current flows'],
    check: ['The peak voltage at the pin for your largest current', 'That the noise floor is below the currents you want to measure', 'That the clamp rating (and its jack) suits the cable and the installation']
  },
  examples: [
    {
      title: 'A burden for a 16 A circuit',
      q: 'An SCT-013-000 (ratio 2000) measures a 16 A circuit with an original ESP32 at 11 dB, biased at 1.65 V. The ADC is clean up to about 2.45 V. What burden resistor do you choose?',
      steps: ['Above the bias there is $2.45 - 1.65 = 0.8$ V of swing.', 'At 16 A RMS the secondary current peaks at $\\sqrt{2} \\times 16 / 2000 = 11.3$ mA.', '$R = 0.8 / 0.0113 = 70.7\\ \\Omega$, so take the next smaller standard value: 68 Ω, giving a peak of 0.77 V.'],
      a: '68 Ω. On an S3 (range to 3.1 V, swing 1.45 V) the same clamp could take up to 120 Ω.'
    }
  ],
  quiz: [
    { q: 'An ACS712-05B has a sensitivity of 185 mV/A on 5 V. What does its output do for a current of +2 A and for −2 A?', choices: ['2.5 V in both cases', '2.87 V and 2.13 V', '3.5 V and 1.5 V', '0.37 V and −0.37 V'], a: 1, why: '2 A × 185 mV/A = 0.37 V either side of the 2.5 V rest level: 2.87 V and 2.13 V.' },
    { q: 'You clamp an SCT-013 around a two-core mains flex (live and neutral together). What does it read?', choices: ['The load current', 'Twice the load current', 'About zero', 'Only the neutral current'], a: 2, why: 'Live and neutral carry the same current in opposite directions, so their magnetic fields cancel in the clamp. Clamp one conductor.' },
    { q: 'A clamp can measure the steady current of a battery charger.', a: false, why: 'A current transformer works only on changing current: a steady direct current produces no voltage in the secondary. Use a Hall sensor or a shunt.' },
    { q: 'Why does the reading from an ACS712 drift when its 5 V supply sags and the ESP\'s ADC stays at 3.3 V?', choices: ['The sensor is ratiometric: its zero follows the supply, while the converter uses its own reference', 'The sensor heats up', 'The ESP adds noise', 'The burden changes'], a: 0, why: 'The sensor\'s output rests at half its supply, so it moves when the supply moves; the ADC has an internal reference and does not follow. Measure the zero often or measure the supply too.' }
  ],
  applications: [
    'A home energy monitor that clamps the incoming live conductor of a consumer unit, in the hands of a qualified person ([[project-energy-monitor]]).',
    'Detecting whether a pump, heater or machine is running from its current.',
    'Overcurrent shutdown of a motor or a battery pack measured with a Hall chip.',
    'Solar and battery systems that measure direct current with a Hall sensor.'
  ],
  sources: [
    'Allegro MicroSystems, *ACS712 datasheet*: sensitivity of the three versions, the output at zero current, noise and isolation.',
    'Manufacturer datasheets of the SCT-013 family of split-core current transformers (the -000 current output and the voltage-output versions).',
    'Espressif, *ESP32 Series Datasheet*, ADC characteristics, for the usable range of each attenuation.'
  ]
},

/* ================================================================ mains energy */
{
  id: 'mains-energy-monitoring',
  parent: 'measuring-electricity-and-force',
  title: 'Monitoring mains energy',
  level: 3,
  short: 'To know what a mains load uses, measure voltage and current at the same instants, multiply them sample by sample and average. That gives real power; voltage times current alone gives only apparent power. For a maker the safe road is an isolated metering module, not wires on a live conductor.',
  keywords: ['energy monitor', 'power meter', 'real power', 'apparent power', 'reactive power', 'power factor', 'kWh', 'PZEM-004T', 'HLW8012', 'BL0937', 'CSE7766', 'ZMPT101B', 'smart plug', 'metering IC', 'RMS', 'sampling', 'Modbus', 'zero crossing', 'watt-hour'],
  prereq: ['hall-current-sensors', 'oversampling-and-noise', 'uart-on-the-esp'],
  related: ['switching-mains-safely', 'isolation-and-long-cables', 'project-energy-monitor', 'esp-as-a-power-meter', 'shelly-sonoff-and-smart-plugs', 'measuring-frequency-and-time', 'electronics:ac-power', 'electronics:power-factor-correction', 'electronics:rms-values'],
  body: `> [!warn] **Mains voltage kills.** Anything that measures 110–230 V is work for a qualified person: behind isolation, in an enclosure, following the local wiring code. A bare module on a desk is not a product. Reflashing a mains device means opening it: never while it is plugged in. Below: what the measurement means and the isolated modules; this is not a wiring guide.

### Three kinds of power

A kettle takes 2.3 kW whatever the timing of its current. A motor, or a phone charger, takes current that is out of step with the voltage, or peaky, and the product of the two readings overstates the work done. **Real power** P, in watts, is what is turned into heat or motion, and what the electricity company bills (as energy). **Apparent power** S = $V_{\\mathrm{rms}} \\times I_{\\mathrm{rms}}$, in volt-amperes, is what the wires must carry. Their ratio is the **power factor**, PF = P / S: 1 for a heater, 0.6 to 0.8 for a motor, often 0.5 to 0.7 for a plain switching supply. The energy is the power added up over time, E = ∫ P dt, usually in kilowatt-hours.

### How it is computed

Sample the voltage v and the current i at the same instants, over a whole number of mains cycles. Then P is the **average of v × i**, $V_{\\mathrm{rms}}$ and $I_{\\mathrm{rms}}$ are the roots of the averages of v² and i², and S, PF follow. Two traps: the ESP's ADC reads one channel at a time, and a delay of 100 µs between the two samples is a phase error of 1.8° at 50 Hz, which spoils the power factor (interpolate, or use a converter that samples both together); and a current transformer adds a small phase error of its own.

### Ways to do it, safest first

1. **An isolated metering module.** The PZEM-004T measures voltage, current, power, energy, frequency and power factor, and reports them over a serial line with Modbus commands; the mains side and the logic side are isolated from each other.
2. **A metering IC**, the kind inside smart plugs: HLW8012 and BL0937 give a *pulse train* whose frequency is proportional to power ([[pulse-counting]]); CSE7766 and BL0942 give numbers over a serial port. They are on mains potential: they belong inside a product that is built to be safe ([[shelly-sonoff-and-smart-plugs]]).
3. **A clamp for current and a voltage transformer module** read by the ESP's ADC ([[hall-current-sensors]]). The voltage side is wired to the mains, so it is for the qualified.

### Accuracy, energy, law

Calibrate against a resistive load of known power and a reference meter, and expect a few percent. Add up energy in memory and save it to flash rarely: a write every second would wear the flash out ([[flash-wear]], [[nvs-and-preferences]]).

> [!key] Real power is the average of voltage times current over whole cycles; apparent power is only the product of the two RMS values, and their ratio is the power factor. Use an isolated module, calibrate against a known load, and never put the measurement wiring on a live conductor unless you are qualified.`,
  ideas: [
    'Real power is the average of v × i over whole mains cycles; apparent power is V rms × I rms, and the ratio is the power factor.',
    'A heater has a power factor of 1; motors and plain switching supplies draw current out of step or peaky, and a simple V × I overstates their power.',
    'The safe road for a maker is an isolated metering module such as the PZEM-004T, read over a serial port; metering ICs belong inside a properly built product.',
    'Energy is power added up over time: keep the sum in RAM and save it to flash rarely.'
  ],
  pitfalls: [
    'Power is voltage times current — Only for a resistive load. For anything else the product of the RMS readings is the apparent power in VA, and the real power is lower by the power factor.',
    'Any 230 V measurement needs only a divider and the ADC — A divider on a live conductor puts mains potential on your board and your USB cable. Use an isolated module or a voltage transformer designed for it, in an enclosure, installed by a qualified person.',
    'A home monitor can replace the meter — It has no approval and no seal. It is good for finding what uses power, not for billing.'
  ],
  terms: [
    { term: 'Real power', also: ['active power', 'watts', 'P'], def: 'The average of the instantaneous product of voltage and current: the part of the power that does work or makes heat. Measured in watts; its integral over time is the energy that is billed.' },
    { term: 'Apparent power', also: ['VA', 'S'], def: 'The product of the RMS voltage and the RMS current, in volt-amperes. It is what the wires and the supply must carry, and it is equal to the real power only for a resistive load.' },
    { term: 'Power factor', also: ['PF', 'cos φ'], def: 'The ratio of real to apparent power, from 0 to 1. A resistive load has 1; a motor or a rectifier-fed supply has less, because the current is out of step with the voltage or not sinusoidal.' },
    { term: 'Metering IC', also: ['energy metering chip', 'HLW8012', 'BL0937', 'CSE7766'], def: 'A chip that samples a shunt or clamp voltage and a mains voltage, multiplies them and delivers power, either as a pulse frequency or as numbers over a serial port. It is on mains potential.' },
    { term: 'PZEM-004T', also: ['PZEM-004T v3.0'], def: 'A ready-made isolated module that measures mains voltage, current, power, energy, frequency and power factor and answers Modbus requests on a TTL serial line at 9600 baud.' }
  ],
  sim: 'me-power',
  formulas: [
    {
      name: 'Real power',
      expr: 'P = V * I * PF',
      tex: 'P = V_{\\mathrm{rms}}\\,I_{\\mathrm{rms}}\\,\\mathrm{PF}',
      vars: {
        P: { name: 'real power', q: 'power', unit: 'W', tex: 'P' },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230, min: 0, tex: 'V_{\\mathrm{rms}}' },
        I: { name: 'RMS current', q: 'current', unit: 'A', value: 1.2, min: 0, tex: 'I_{\\mathrm{rms}}' },
        PF: { name: 'power factor', q: 'ratio', value: 0.65, min: 0, max: 1, tex: '\\mathrm{PF}' }
      },
      solveFor: 'P',
      note: 'The product of the two RMS values is the apparent power; the power factor takes it down to the real power. A heater has a power factor of 1.',
      stories: { P: 'A load draws {I} at {V} with a power factor of {PF}. What real power does it use?', PF: 'A load draws {I} at {V} and a meter shows {P}. What is its power factor?' }
    },
    {
      name: 'Apparent power',
      expr: 'S = V * I',
      tex: 'S = V_{\\mathrm{rms}}\\,I_{\\mathrm{rms}}',
      vars: {
        S: { name: 'apparent power', q: 'apparentpower', unit: 'VA', tex: 'S' },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230, min: 0, tex: 'V_{\\mathrm{rms}}' },
        I: { name: 'RMS current', q: 'current', unit: 'A', value: 1.2, min: 0, tex: 'I_{\\mathrm{rms}}' }
      },
      solveFor: 'S',
      note: 'What a clamp and a voltage reading give without the timing between them. The wiring and the supply must be sized for it.',
      stories: { S: 'A clamp reads {I} on a {V} supply. What is the apparent power?' }
    },
    {
      name: 'Energy from power and time',
      expr: 'E = P * t',
      tex: 'E = P\\,t',
      vars: {
        E: { name: 'energy', q: 'energy', unit: 'kWh', tex: 'E' },
        P: { name: 'average real power', q: 'power', unit: 'W', value: 150, min: 0, tex: 'P' },
        t: { name: 'time', q: 'time', unit: 'h', value: 24, min: 0, tex: 't' }
      },
      solveFor: 'E',
      note: 'Valid for a constant power; for a varying one add up P × Δt over the samples. Choose kWh as the unit of the answer.',
      stories: { E: 'A device averages {P} for {t}. How much energy does it use?' }
    }
  ],
  code: [
    {
      title: 'Read a PZEM-004T module over its serial line',
      about: 'Sends the module\'s Modbus request for its ten measurement registers once a second and prints voltage, current, power, energy, frequency and power factor. Only the 5 V logic side of the module is connected to the ESP; the mains side is wired by a qualified person.',
      needs: 'An ESP32 DevKit and a PZEM-004T v3.0 module, installed by a qualified person in an enclosure. The module\'s logic side takes 5 V; its TX line may swing to 5 V, so put a divider (for example 2 kΩ over 3.3 kΩ) between it and the ESP pin unless its documentation says 3.3 V is fine.',
      wiring: [['PZEM 5V, GND', 'ESP 5V (VIN), GND', 'the logic side only'], ['PZEM TX', 'GPIO26 (ESP RX)', 'through a divider if the line is 5 V'], ['PZEM RX', 'GPIO27 (ESP TX)']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on RX (26) TX (27) :: bus
        forever
          send bytes (0x01 0x04 0x00 0x00 0x00 0x0A 0x70 0x0D) to UART (1) :: bus    // read 10 registers, Modbus CRC included
          wait (0.3) seconds
          set [reply v] to (read (25 bytes) from UART (1)) :: bus
          if <(length of (reply)) = (25)> then
            set [volts v] to ((register (0) of (reply)) / (10))      // 16-bit registers, high byte first
            set [amps v] to ((32-bit value of registers (1) and (2) of (reply)) / (1000))    // low word first
            set [watts v] to ((32-bit value of registers (3) and (4) of (reply)) / (10))
            set [wh v] to (32-bit value of registers (5) and (6) of (reply))
            print (join (volts) [ V  ] (amps) [ A  ] (watts) [ W  ] (wh) [ Wh])
          else
            print [no answer: check the wiring and the 5 V]
          end
          wait (0.7) seconds
        end
      `,
      cpp: String.raw`
        const int RX_PIN = 26;                       // ESP RX  <- PZEM TX
        const int TX_PIN = 27;                       // ESP TX  -> PZEM RX

        uint16_t crc16(const uint8_t *data, int len) {            // the Modbus CRC-16
          uint16_t crc = 0xFFFF;
          for (int i = 0; i < len; i++) {
            crc ^= data[i];
            for (int b = 0; b < 8; b++) crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : crc >> 1;
          }
          return crc;
        }

        bool readPzem(float &volts, float &amps, float &watts, uint32_t &wh, float &hz, float &pf) {
          uint8_t req[8] = { 0x01, 0x04, 0x00, 0x00, 0x00, 0x0A, 0, 0 };   // slave 1, read 10 input registers from 0
          uint16_t crc = crc16(req, 6);
          req[6] = crc & 0xFF;                                             // the CRC goes low byte first
          req[7] = crc >> 8;
          while (Serial1.available()) Serial1.read();                      // drop anything old
          Serial1.write(req, 8);
          uint8_t resp[25];                                                // address, function, count, 20 data bytes, 2 CRC
          if (Serial1.readBytes(resp, 25) != 25) return false;
          if (crc16(resp, 23) != (uint16_t)(resp[23] | (resp[24] << 8))) return false;
          auto reg = [&](int i) { return (uint32_t)((resp[3 + 2 * i] << 8) | resp[4 + 2 * i]); };
          volts = reg(0) / 10.0;
          amps = (reg(1) | (reg(2) << 16)) / 1000.0;                       // 32-bit values: low word first
          watts = (reg(3) | (reg(4) << 16)) / 10.0;
          wh = reg(5) | (reg(6) << 16);
          hz = reg(7) / 10.0;
          pf = reg(8) / 100.0;
          return true;
        }

        void setup() {
          Serial.begin(115200);
          Serial1.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);
          Serial1.setTimeout(500);
        }

        void loop() {
          float volts, amps, watts, hz, pf;
          uint32_t wh;
          if (readPzem(volts, amps, watts, wh, hz, pf))
            Serial.printf("%.1f V  %.3f A  %.1f W  %lu Wh  %.1f Hz  PF %.2f\n", volts, amps, watts, (unsigned long)wh, hz, pf);
          else
            Serial.println("no answer: check the wiring and the 5 V");
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import UART
        import struct, time

        uart = UART(1, baudrate=9600, rx=26, tx=27, timeout=500)    # ESP RX <- PZEM TX, ESP TX -> PZEM RX

        def crc16(data):                                            # the Modbus CRC-16
            crc = 0xFFFF
            for byte in data:
                crc ^= byte
                for _ in range(8):
                    crc = (crc >> 1) ^ 0xA001 if crc & 1 else crc >> 1
            return crc

        def read_pzem():
            req = bytearray([0x01, 0x04, 0x00, 0x00, 0x00, 0x0A, 0, 0])   # slave 1, read 10 input registers from 0
            crc = crc16(req[:6])
            req[6] = crc & 0xFF                                        # the CRC goes low byte first
            req[7] = crc >> 8
            while uart.any():
                uart.read()                                            # drop anything old
            uart.write(req)
            resp = uart.read(25)                                       # address, function, count, 20 data bytes, 2 CRC
            if resp is None or len(resp) != 25 or crc16(resp[:23]) != resp[23] | (resp[24] << 8):
                return None
            r = struct.unpack(">10H", resp[3:23])
            return (r[0] / 10, (r[1] | r[2] << 16) / 1000, (r[3] | r[4] << 16) / 10,   # 32-bit values: low word first
                    r[5] | r[6] << 16, r[7] / 10, r[8] / 100)

        while True:
            m = read_pzem()
            if m:
                print("%.1f V  %.3f A  %.1f W  %d Wh  %.1f Hz  PF %.2f" % m)
            else:
                print("no answer: check the wiring and the 5 V")
            time.sleep(1)
      `,
      output: `
        230.4 V  0.452 A  64.7 W  1830 Wh  50.0 Hz  PF 0.62
        230.3 V  0.449 A  64.2 W  1830 Wh  50.0 Hz  PF 0.62
      `,
      notes: ['The request is the fixed frame 01 04 00 00 00 0A 70 0D: slave 1, function 4 (read input registers), start 0, count 10, then the CRC (0x0D70, sent low byte first). The program computes it so that other requests can be built the same way.', 'The module counts energy by itself and keeps it across power cuts; resetting it needs a different command (function 0x42). Keep the value on your side too if you need history.', 'The figures are the module\'s own measurement and carry its accuracy of about one percent at best, not a billing meter\'s.', 'The register layout (voltage in 0.1 V, current in 1 mA and power in 0.1 W as 32-bit values with the low word first, energy in Wh, frequency in 0.1 Hz, power factor in 0.01) is that of the v3.0 module; check the datasheet of yours.']
    }
  ],
  choose: {
    good: ['An isolated module such as the PZEM-004T for a first monitor of one circuit', 'A metering IC inside a product built and tested for mains', 'A clamp for the current on a cable, read in short bursts of whole cycles'],
    avoid: ['Any bare divider or home-made voltage sensor on a live conductor', 'Reading power as RMS voltage times RMS current for a non-resistive load', 'Writing the energy total to flash every second'],
    check: ['That a qualified person does all the mains wiring, in an enclosure', 'The power factor of your load: a motor or a switching supply is not 1', 'The module\'s serial voltage level against the ESP\'s 3.3 V']
  },
  examples: [
    {
      title: 'A fridge in a month',
      q: 'A meter shows an average real power of 45 W for a refrigerator. Its current is 0.45 A at 230 V. What are its apparent power, its power factor, and its energy in 30 days?',
      steps: ['Apparent power $S = 230 \\times 0.45 = 103.5$ VA.', 'Power factor $\\mathrm{PF} = P / S = 45 / 103.5 = 0.43$: a compressor motor is a poor, reactive load.', 'Energy $E = 45\\ \\mathrm{W} \\times 720\\ \\mathrm{h} = 32.4$ kWh.'],
      a: '104 VA, a power factor of about 0.43, and 32 kWh a month. A clamp alone would have shown 0.45 A and suggested 104 W: more than twice the truth.'
    }
  ],
  quiz: [
    { q: 'A motor draws 2 A at 230 V and its power factor is 0.7. What real power does it use?', choices: ['460 W', '322 W', '657 W', '230 W'], a: 1, why: 'Apparent power is 230 × 2 = 460 VA. Real power is 460 × 0.7 = 322 W.' },
    { q: 'Why must the voltage and the current be sampled at the same moments for a power measurement?', choices: ['So the ADC is not overloaded', 'Because the power at each instant is the product of the two at that instant', 'To save memory', 'To cancel the offset'], a: 1, why: 'Real power is the average of v × i. If the two samples are apart in time the product mixes the wrong values, and the power factor comes out wrong.' },
    { q: 'A home-built monitor with an ADC and a clamp can be used to bill a tenant for electricity.', a: false, why: 'Billing meters are type-approved and sealed. A home monitor shows where power goes and is accurate to a few percent at best, but it has no legal standing.' },
    { q: 'Which of these is the safest first step to put a mains measurement on an ESP?', choices: ['A resistor divider from the live wire to an ADC pin', 'An isolated metering module read over a serial line, wired by a qualified person', 'A bare current sensor soldered into the mains cable', 'A shunt in the neutral wire'], a: 1, why: 'The module isolates the mains side from the logic side and returns numbers over a serial line. The others put mains potential on the board and on the USB cable.' }
  ],
  applications: [
    'Finding which appliance uses the most energy in a home or a workshop.',
    'Smart plugs that report watts and kilowatt-hours to Home Assistant ([[shelly-sonoff-and-smart-plugs]]).',
    'Solar self-consumption: the balance between production and use in a house ([[project-energy-monitor]]).',
    'Predictive maintenance: a pump or a compressor whose current and power factor change before it fails.'
  ],
  sources: [
    'Peacefair, *PZEM-004T v3.0 user manual*: the Modbus-RTU register map and the electrical specification.',
    'Datasheets of the HLW8012, BL0937, CSE7766 and BL0942 metering chips.',
    'IEC 62053 series, *Electricity metering equipment* (the standards behind billing meters), for what a legal meter must meet.'
  ]
},

/* ================================================================ load cells and the HX711 */
{
  id: 'load-cells-and-hx711',
  parent: 'measuring-electricity-and-force',
  title: 'Load cells and the HX711',
  level: 2,
  short: 'A load cell turns force into a few millivolts, and the HX711 turns those into a 24-bit number. A scale is then two steps of arithmetic, tare and scale factor, around a mechanical problem: mounting the cell so that only the weight reaches it.',
  keywords: ['load cell', 'HX711', 'strain gauge', 'Wheatstone bridge', 'weighing', 'scale', 'tare', 'calibration', 'bridge sensor', 'mV/V', 'gain 128', '24-bit', 'amplifier', 'excitation', 'bar load cell', 'creep', 'drift'],
  prereq: ['measuring-voltage', 'oversampling-and-noise', 'bits-and-bytes'],
  related: ['sensor-calibration', 'reading-sensors-reliably', 'project-data-logger', 'external-adc-and-dac', 'electronics:strain-gauges', 'electronics:wheatstone-bridge', 'electronics:instrumentation-amplifier'],
  body: `A load cell is a block of metal with strain gauges glued on it. When force bends the block, the gauges stretch or shorten and their resistance changes by a minute fraction. Four of them are wired as a **Wheatstone bridge**, so that the bridge's two outputs move apart in proportion to the load. The signal is tiny: a typical cell is rated 2 mV per volt of supply, so at full load on a 3.3 V supply it gives 6.6 mV. The ESP's own ADC cannot read that. The **HX711** is a chip made for it: an amplifier with a gain of 128, a 24-bit converter and a two-wire serial output.

### The cell

A bar-type cell has four wires: **E+ and E−** (excitation, the supply of the bridge) and **A+ and A−** (the signal). Wire colours differ between makers: red and black are usually the excitation, white and green the signal; if the reading falls when you add weight, swap the two signal wires. Fix one end of the bar and load the other along the arrow printed on it. Never load it beyond its rating: the safe overload is of the order of 120 to 150 % of capacity, then the metal bends for good.

### The HX711

It has two input channels: A, with a gain of 128 or 64, and B, with a gain of 32. Its full-scale input is half the supply divided by the gain, so with a 3.3 V supply and a gain of 128 it takes about ±13 mV. It delivers 10 or 80 readings a second (the RATE pin; many modules tie it for 10). The data come out on **DOUT** one bit per clock pulse on **SCK**: DOUT goes low when a reading is ready, 24 pulses shift out the number (two's complement, ±8 388 608) and a 25th, 26th or 27th pulse chooses the next gain. If SCK stays high for 60 µs the chip goes to sleep. Power the module from 3.3 V so that DOUT is not a 5 V signal.

### Tare and scale factor

The number is meaningless until two calibrations turn it into grams. **Tare**: read the empty scale, and subtract that value from everything. **Scale factor**: put on a known mass, divide the change in the reading by the mass, and you have counts per gram. Then $m = (\\mathrm{raw} - \\mathrm{tare}) / k$. The relation is a straight line, so two points are enough, and the factor stays good while the wiring, supply voltage and gain stay the same.

### What limits it

The converter noise is a few tens of counts: roughly 16 or 17 useful bits, so a 1 kg cell is good to about 0.1 g, not to a milligram. The zero **drifts** with temperature and, after a heavy load, with **creep**: tare often, keep the cell out of sun and draughts, and wait. Keep the cable short or shielded.

> [!key] A load cell gives millivolts; the HX711 amplifies and digitises them. Tare the empty scale, calibrate with a known mass to get counts per gram, and expect a resolution of about a ten-thousandth of the capacity — limited by noise, drift and how the cell is mounted.`,
  ideas: [
    'A load cell is a bridge of strain gauges whose output, a few millivolts at full load, is proportional to the force; the HX711 amplifies and digitises it.',
    'The HX711 gives a 24-bit number over a two-wire interface: DOUT goes low when ready, 24 clock pulses read it, and an extra pulse picks the gain.',
    'Weight = (reading − tare) / scale factor: tare with nothing on the scale, calibrate with a known mass.',
    'Real resolution is about a ten-thousandth of the capacity: noise, thermal drift, creep and mounting limit it, not the 24 bits.'
  ],
  pitfalls: [
    'A 24-bit converter weighs to one part in sixteen million — The converter\'s noise leaves 16 or 17 useful bits, and the mechanics and drift usually cost more. A 1 kg cell is good to 0.1 g in practice.',
    'Calibrate once and trust the scale for ever — The zero drifts with temperature and the cell creeps under load. Tare when the scale is empty, and check with a known mass now and then.',
    'The module can run on 5 V with an ESP32 — At 5 V the module\'s DOUT is a 5 V signal into a pin that tolerates 3.3 V. Power the module from 3.3 V (and keep the excitation within the cell\'s limit).'
  ],
  terms: [
    { term: 'Load cell', also: ['strain-gauge load cell', 'bar load cell', 'weighing cell'], def: 'A metal element with strain gauges that changes its electrical output in proportion to the force that bends it. A typical cell gives 1 to 3 mV for each volt of supply at full load.' },
    { term: 'Wheatstone bridge', also: ['bridge circuit', 'full bridge'], def: 'Four resistors, here strain gauges, in a diamond. A change of the gauges unbalances it and produces a small differential voltage between its two outputs, proportional to the change.' },
    { term: 'HX711', also: ['load cell amplifier', '24-bit ADC for load cells'], def: 'A chip with a low-noise amplifier (gain 128, 64 or 32), a 24-bit converter and a two-wire serial output, made to read the millivolts of a load cell at 10 or 80 readings a second.' },
    { term: 'Tare', also: ['zeroing', 'taring'], def: 'Reading the scale with nothing (or only the empty container) on it and subtracting that value from later readings, so that the display starts at zero.' },
    { term: 'Creep', also: ['load cell drift', 'zero drift'], def: 'A slow change of a load cell\'s output at constant load or after unloading, caused by the metal and the glue. It, and temperature, set the limit of a scale\'s accuracy.' }
  ],
  sim: 'me-loadcell',
  formulas: [
    {
      name: 'Bridge output',
      expr: 'Vo = S * Vex * load / cap',
      tex: 'V_{o} = S\\,V_{\\mathrm{ex}}\\,\\frac{F}{F_{\\mathrm{rated}}}',
      vars: {
        Vo: { name: 'bridge output', q: 'voltage', unit: 'mV', tex: 'V_{o}' },
        S: { name: 'rated output (mV per V; 2 ‰ is 2 mV/V)', q: 'ratio', unit: '‰', value: 2, min: 0, tex: 'S' },
        Vex: { name: 'excitation', q: 'voltage', unit: 'V', value: 3.3, min: 0, tex: 'V_{\\mathrm{ex}}' },
        load: { name: 'load', q: 'mass', unit: 'kg', value: 0.5, min: 0, tex: 'F' },
        cap: { name: 'rated capacity', q: 'mass', unit: 'kg', value: 1, min: 0, tex: 'F_{\\mathrm{rated}}' }
      },
      solveFor: 'Vo',
      note: 'The millivolts between A+ and A−. At full load the output is the rated output (mV/V) times the excitation.',
      stories: { Vo: 'A {cap} load cell rated {S} on {Vex} excitation carries {load}. What is its output?' }
    },
    {
      name: 'HX711 counts from the bridge voltage',
      expr: 'N = 16777216 * G * Vo / AVDD',
      tex: 'N = \\frac{2^{24}\\,G\\,V_{o}}{\\mathrm{AVDD}}',
      vars: {
        N: { name: 'counts', q: 'count', tex: 'N' },
        G: { name: 'gain', q: 'count', value: 128, min: 32, max: 128, int: true, tex: 'G' },
        Vo: { name: 'bridge output', q: 'voltage', unit: 'mV', value: 3.3, min: 0, tex: 'V_{o}' },
        AVDD: { name: 'supply of the HX711', q: 'voltage', unit: 'V', value: 3.3, min: 0, tex: '\\mathrm{AVDD}' }
      },
      solveFor: 'N',
      note: 'Full scale is ± AVDD / (2 G), which is ± 8 388 608 counts. The 16777216 is 2^24. Check that your load cell\'s full-load output fits in it.',
      stories: { N: 'A bridge gives {Vo} to an HX711 with a gain of {G} on a supply of {AVDD}. How many counts is that?' }
    },
    {
      name: 'Weight from the reading',
      expr: 'm = (raw - tare) / k',
      tex: 'm = \\frac{\\mathrm{raw} - \\mathrm{tare}}{k}',
      vars: {
        m: { name: 'weight in grams', unit: 'g', tex: 'm' },
        raw: { name: 'reading', q: 'count', value: 2200000, signed: true, tex: '\\mathrm{raw}' },
        tare: { name: 'reading of the empty scale', q: 'count', value: 84000, signed: true, tex: '\\mathrm{tare}' },
        k: { name: 'scale factor', unit: 'counts/g', value: 4203, min: 0, tex: 'k' }
      },
      solveFor: 'm',
      note: 'The scale factor comes from a known mass: k = (reading with the mass − tare) / mass.',
      stories: { m: 'The scale reads {raw} (empty: {tare}) and its factor is {k}. What does it weigh?' }
    }
  ],
  code: [
    {
      title: 'A kitchen scale: tare, calibrate and weigh',
      about: 'Reads the HX711 with a bit-banged 24-bit routine. At start it tares the empty scale. With SCALE set to 0 it then asks for a known weight and prints the scale factor to put in the program; with SCALE set it weighs in grams twice a second.',
      needs: 'An ESP32 DevKit, an HX711 module powered from 3.3 V, a 1 kg bar load cell and a known mass (500 g of water in a closed bottle will do).',
      wiring: [['HX711 VCC, GND', '3V3, GND', 'not 5 V'], ['HX711 DT', 'GPIO18'], ['HX711 SCK', 'GPIO19'], ['HX711 E+, E−', 'load cell excitation'], ['HX711 A+, A−', 'load cell signal', 'swap them if the reading falls under load']],
      blocks: `
        define read raw :: my
          wait until <(read pin (18)) = [LOW v]>    // DOUT low: a reading is ready
          set [value v] to (0)
          repeat (24)
            set pin (19) to [HIGH v]
            set [value v] to ((value) * (2) + (read pin (18)))
            set pin (19) to [LOW v]
          end
          set pin (19) to [HIGH v]                  // the 25th pulse keeps gain 128 for the next reading
          set pin (19) to [LOW v]
          if <(value) ≥ (8388608)> then
            change [value v] by (-16777216)         // two's complement
          end
          return (value)

        define average (n) :: my
          set [sum v] to (0)
          repeat (n)
            change [sum v] by (read raw)
          end
          return ((sum) / (n))

        when started
          set pin (19) as [output v]
          set pin (18) as [input v]
          start serial at (115200) baud
          print [Empty the scale]
          wait (3) seconds
          set [tare v] to (average (10))
          set [scale v] to (0)                     // 0: calibration run
          if <(scale) = (0)> then
            print [Put the 500 g weight on now]
            wait (8) seconds
            set [scale v] to (((average (10)) - (tare)) / (500))
            print (join [scale ] (scale) [ counts per gram: put it at the top])
          end
        forever
          print (join (((average (4)) - (tare)) / (scale)) [ g])
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int DOUT_PIN = 18;                     // HX711 DT
        const int SCK_PIN = 19;                      // HX711 SCK
        const float KNOWN_GRAMS = 500.0;             // the mass used for the calibration run
        float scale = 0;                             // counts per gram: 0 = calibration run, then put the printed value here
        long tare = 0;

        long readRaw() {                             // one 24-bit reading, channel A, gain 128
          uint32_t start = millis();
          while (digitalRead(DOUT_PIN) == HIGH) {    // DOUT low: a reading is ready
            if (millis() - start > 1000) { Serial.println("HX711 not ready: check the wiring"); return 0; }
            delay(1);
          }
          noInterrupts();                            // the clock must never stay high for 60 us
          long value = 0;
          for (int i = 0; i < 24; i++) {
            digitalWrite(SCK_PIN, HIGH);
            delayMicroseconds(1);
            value = (value << 1) | digitalRead(DOUT_PIN);
            digitalWrite(SCK_PIN, LOW);
            delayMicroseconds(1);
          }
          digitalWrite(SCK_PIN, HIGH);               // the 25th pulse keeps gain 128 for the next reading
          delayMicroseconds(1);
          digitalWrite(SCK_PIN, LOW);
          interrupts();
          if (value & 0x800000) value |= 0xFF000000; // two's complement: extend the sign
          return value;
        }

        long average(int n) {
          long long sum = 0;
          for (int i = 0; i < n; i++) sum += readRaw();
          return sum / n;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(SCK_PIN, OUTPUT);
          pinMode(DOUT_PIN, INPUT);
          digitalWrite(SCK_PIN, LOW);
          Serial.println("Empty the scale");
          delay(3000);
          tare = average(10);
          if (scale == 0) {
            Serial.println("Put the 500 g weight on now");
            delay(8000);
            scale = (average(10) - tare) / KNOWN_GRAMS;
            Serial.printf("scale %.1f counts per gram: put it at the top\n", scale);
          }
        }

        void loop() {
          Serial.printf("%.1f g\n", (average(4) - tare) / scale);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import machine, time

        dout = Pin(18, Pin.IN)                       # HX711 DT
        sck = Pin(19, Pin.OUT, value=0)              # HX711 SCK
        KNOWN_GRAMS = 500.0                          # the mass used for the calibration run
        scale = 0                                    # counts per gram: 0 = calibration run, then put the printed value here

        def read_raw():                              # one 24-bit reading, channel A, gain 128
            start = time.ticks_ms()
            while dout.value():                      # DOUT low: a reading is ready
                if time.ticks_diff(time.ticks_ms(), start) > 1000:
                    print("HX711 not ready: check the wiring")
                    return 0
                time.sleep_ms(1)
            state = machine.disable_irq()            # the clock must never stay high for 60 us
            value = 0
            for _ in range(24):
                sck.value(1)
                value = (value << 1) | dout.value()
                sck.value(0)
            sck.value(1)                             # the 25th pulse keeps gain 128 for the next reading
            sck.value(0)
            machine.enable_irq(state)
            if value & 0x800000:
                value -= 1 << 24                     # two's complement
            return value

        def average(n):
            return sum(read_raw() for _ in range(n)) / n

        print("Empty the scale")
        time.sleep(3)
        tare = average(10)
        if scale == 0:
            print("Put the 500 g weight on now")
            time.sleep(8)
            scale = (average(10) - tare) / KNOWN_GRAMS
            print("scale %.1f counts per gram: put it at the top" % scale)

        while True:
            print("%.1f g" % ((average(4) - tare) / scale))
            time.sleep_ms(500)
      `,
      output: `
        Empty the scale
        Put the 500 g weight on now
        scale 4203.1 counts per gram: put it at the top
        0.2 g
        499.8 g
        500.1 g
      `,
      notes: ['The 10 readings of an average take a second at 10 readings a second; the module ties its RATE pin low for 10 and high for 80 readings a second (more noise).', 'The scale factor depends on the cell, the gain and the supply. After you change any of them, calibrate again.', 'A library such as HX711 by bogde wraps the same steps (tare, get_units) if you prefer; the bit-banged read is shown to make the protocol visible.', 'Disabling interrupts for the 25 clock pulses lasts only some tens of microseconds; it keeps the Wi-Fi tasks from stretching a clock pulse past 60 µs.']
    }
  ],
  choose: {
    good: ['A bar cell and an HX711 for kitchen, parcel and hive scales from grams to hundreds of kilograms', 'Averaging four to ten readings and a tare at every start', 'A calibration with a known mass near the weights you will weigh'],
    avoid: ['Loading the cell beyond its rating or from the side', 'Powering the module from 5 V with an ESP32', 'Expecting milligram resolution from a 24-bit converter on a kilogram cell'],
    check: ['The rated output (mV/V) and the capacity of your cell', 'That the cell is fixed at one end and loaded along its arrow', 'The drift: leave the empty scale on for an hour and watch the zero']
  },
  examples: [
    {
      title: 'How fine can a 1 kg scale be?',
      q: 'A 1 kg cell rated 2 mV/V is on an HX711 with a gain of 128 and a 3.3 V supply. The converter\'s noise is about 30 counts rms. What is the full-load count, and what mass is one noise count?',
      steps: ['Full-load output: $2 \\times 3.3 = 6.6$ mV.', 'Counts: $2^{24} \\times 128 \\times 6.6\\ \\mathrm{mV} / 3.3\\ \\mathrm{V} \\approx 4.3$ million, so one gram is about 4300 counts.', 'The noise of 30 counts rms is $30 / 4300 \\approx 0.007$ g rms, or about 0.05 g from peak to peak: a few hundredths of a gram on the best day.'],
      a: 'About 4.3 million counts at full load, 4300 counts per gram, and noise around 0.05 g peak to peak. Drift, creep and mounting usually make it 0.1 g or worse.'
    }
  ],
  quiz: [
    { q: 'A load cell is rated 3 mV/V and is excited with 5 V. What is its output at full load?', choices: ['3 mV', '5 mV', '15 mV', '60 mV'], a: 2, why: 'The output is the rating times the excitation: 3 mV/V × 5 V = 15 mV.' },
    { q: 'The empty scale reads 84 000 counts. With a 500 g mass it reads 2 185 000. What is the scale factor?', choices: ['4202 counts per gram', '4370 counts per gram', '2101 counts per gram', '168 counts per gram'], a: 0, why: '(2 185 000 − 84 000) / 500 = 4202 counts per gram.' },
    { q: 'After taring, the reading falls when you put weight on the scale. What is the most likely fix?', choices: ['A larger capacitor', 'Swap the two signal wires (A+ and A−)', 'Use 5 V', 'Reduce the gain to 32'], a: 1, why: 'The bridge\'s output polarity is reversed. Swapping A+ and A− makes the reading rise with load.' },
    { q: 'Holding the HX711\'s SCK pin high for more than about 60 µs…', choices: ['starts the next reading', 'puts the chip to sleep, spoiling the reading', 'selects gain 32', 'resets the load cell'], a: 1, why: 'A long high on the clock powers the chip down. That is why the 24 clock pulses are kept short, with interrupts off, in the program above.' }
  ],
  applications: [
    'Kitchen and postal scales, and a hive scale that logs the weight of a beehive through the season.',
    'Filling and dosing: stop a pump when the weight of the container reaches the target.',
    'Detecting presence, such as a chair, a bed or a pet feeder.',
    'Force measurement on a test rig, a hand grip or a 3D printer\'s filament spool.'
  ],
  sources: [
    'Avia Semiconductor, *HX711 datasheet*: gain, full-scale input, data rate, the serial interface and its timing.',
    'The datasheet of the load cell you use (rated output, capacity, wiring colours, overload).',
    'Arduino core for ESP32 documentation, GPIO and Wire; MicroPython documentation, *machine.disable_irq* (version 1.29).'
  ]
},

/* ================================================================ counting pulses */
{
  id: 'pulse-counting',
  parent: 'measuring-electricity-and-force',
  title: 'Counting pulses',
  level: 2,
  short: 'Flow meters, anemometers, rain gauges, wheels and energy meters all report in pulses. A program counts them with a loop, with an interrupt or with the pulse counter hardware, and the right choice depends on how fast, how clean and how costly a lost pulse is.',
  keywords: ['pulse counting', 'flow meter', 'YF-S201', 'anemometer', 'rain gauge', 'tipping bucket', 'S0 pulse', 'tachometer', 'interrupt counter', 'PCNT', 'debounce', 'glitch filter', 'IRAM_ATTR', 'volatile', 'pulses per litre', 'K factor', 'Hall sensor'],
  prereq: ['interrupts', 'digital-input', 'debouncing'],
  related: ['pulse-counter-pcnt', 'measuring-frequency-and-time', 'mains-energy-monitoring', 'soil-and-water-sensors', 'rotary-encoders', 'esp-as-a-frequency-counter', 'race-conditions'],
  body: `A great many sensors have no analogue output at all: they send a **pulse** for each unit of what they measure. A flow meter gives about 450 pulses for each litre; an anemometer a few pulses a turn; a tipping-bucket rain gauge one pulse for a fixed fraction of a millimetre; an electricity meter's S0 output one pulse for each fraction of a kilowatt-hour (1000 pulses per kWh is common). The program's job is to count them without missing any, and to turn the count into a quantity with the sensor's **K factor**, its number of pulses per unit.

### Three ways to count

- **Polling.** Look at the pin in the loop and note each change. It works only if the loop goes round faster than the shortest pulse and does nothing slow: one \`delay\` and pulses vanish.
- **An interrupt on each edge.** The handler adds one to a counter. Every edge costs several microseconds of processor time and a pulse that arrives while the handler is still pending is merged with the previous one, so the method is trustworthy up to some kilohertz and degrades when Wi-Fi or flash writes hold interrupts off.
- **The pulse counter hardware (PCNT).** A counter beside the pin adds one at each edge with no processor involved, up to many megahertz, and a **glitch filter** can ignore pulses shorter than a few microseconds ([[pulse-counter-pcnt]]). It exists on the ESP32 (8 units), S2, S3, C5, C6, H2 and P4 (4), the S31 (2) — but **not on the C3, C2 or C61**, which must use interrupts.

### From count to quantity

Count over a fixed **gate** time T, then the frequency is n / T, and the quantity is the count divided by K. One pulse more or less is the resolution of the measurement: a flow meter of 450 pulses per litre, read for one second, resolves 0.13 litres per minute, so a slow drip needs a longer gate or a measurement of the *time between pulses* ([[measuring-frequency-and-time]]). The running total is the sum of all counts: keep it in RAM and save it to flash rarely ([[nvs-and-preferences]]).

### Clean pulses

- **Mechanical contacts bounce** for a millisecond or several: a reed switch in an anemometer or a rain gauge gives a burst of edges for each closure. Ignore edges closer than a **dead time** longer than the bounce, but shorter than the quickest real pulse ([[debouncing]]).
- **Hall and optical sensors** are clean but often open-collector: use a pull-up to **3.3 V**. A sensor powered from 5 V may give 5 V pulses: divide them down.
- **Share the counter safely.** The handler writes the counter and the loop reads it: declare it \`volatile\`, put the handler in IRAM, and copy a multi-word value with interrupts off ([[race-conditions]]).

> [!key] A pulse sensor is read by counting edges over a gate time and dividing by its K factor. Polling is for slow, clean signals, an interrupt for a few kilohertz, the pulse counter hardware for anything faster, and a dead time or glitch filter keeps bounce from being counted.`,
  ideas: [
    'Pulse sensors send one pulse per unit of the measured quantity; the K factor (pulses per unit) turns a count into litres, millimetres or kilowatt-hours.',
    'Polling, an interrupt per edge and the pulse counter hardware cover slow, moderate and fast pulses; the C3, C2 and C61 have no pulse counter.',
    'Counting over a gate gives a resolution of one pulse per gate; slow signals need a longer gate or a measurement of the interval.',
    'Bounce needs a dead time or a filter; open-collector outputs need a pull-up to 3.3 V.'
  ],
  pitfalls: [
    'An interrupt counts every pulse for ever — Edges that arrive while the handler is pending are merged, and a handler that runs late when Wi-Fi or flash is busy loses counts. Above some kilohertz, count in hardware.',
    'A reed switch is a clean digital signal — It bounces for milliseconds, and an unfiltered counter counts the bounce as extra pulses.',
    'The pulse counter exists on every ESP32 chip — The ESP32-C3, C2 and C61 have none; on those the program must count interrupts.'
  ],
  terms: [
    { term: 'K factor', also: ['pulses per litre', 'pulses per unit', 'pulse constant'], def: 'The number of pulses a sensor gives for one unit of the measured quantity, for example 450 pulses per litre for a flow meter or 1000 pulses per kilowatt-hour for an S0 meter.' },
    { term: 'Gate time', also: ['counting interval', 'gate'], def: 'The fixed time over which pulses are counted. Frequency is the count divided by the gate time, and one pulse in the count is the resolution.' },
    { term: 'Dead time', also: ['debounce time', 'lockout time'], def: 'A time after each counted edge during which further edges are ignored, so that the bounce of a mechanical contact is not counted as extra pulses.' },
    { term: 'S0 interface', also: ['S0 pulse output', 'pulse output of an energy meter'], def: 'A pulse output of electricity meters: a short closure of an opto-isolated contact for each fixed amount of energy, such as 1000 pulses for each kilowatt-hour.' }
  ],
  sim: 'me-pulses',
  formulas: [
    {
      name: 'Frequency from a gated count',
      expr: 'f = n / T',
      tex: 'f = \\frac{n}{T}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', tex: 'f' },
        n: { name: 'pulses counted', q: 'count', value: 225, min: 0, tex: 'n' },
        T: { name: 'gate time', q: 'time', unit: 's', value: 1, min: 0, tex: 'T' }
      },
      solveFor: 'f',
      note: 'The count can be one too high or too low, so the error is 1 / (f T) of the reading.',
      stories: { f: '{n} pulses arrive in a gate of {T}. What is their frequency?' }
    },
    {
      name: 'Quantity from the K factor',
      expr: 'x = n / K',
      tex: 'x = \\frac{n}{K}',
      vars: {
        x: { name: 'quantity (litres, kWh, mm …)', q: 'none', tex: 'x' },
        n: { name: 'pulses counted', q: 'count', value: 4500, min: 0, tex: 'n' },
        K: { name: 'K factor (pulses per unit)', q: 'none', value: 450, min: 0, tex: 'K' }
      },
      solveFor: 'x',
      note: 'For a flow meter of 450 pulses per litre, 4500 pulses are 10 litres. The unit is whatever the K factor counts.',
      stories: { x: 'A sensor with a K factor of {K} pulses per unit gives {n} pulses. How many units is that?' }
    }
  ],
  code: [
    {
      title: 'A flow meter with an interrupt',
      about: 'Counts the falling edges of a flow meter in an interrupt handler that ignores edges closer than 200 µs, and prints the flow in litres per minute and the total in litres once a second.',
      needs: 'An ESP32 DevKit and a flow meter of the YF-S201 type (450 pulses per litre; check yours). Power the sensor from 5 V only if its output is open-collector; otherwise divide the pulses down to 3.3 V.',
      wiring: [['sensor red', '5 V (VIN)'], ['sensor black', 'GND'], ['sensor yellow', 'GPIO27', 'with the internal pull-up; divide the pulses down if they reach 5 V']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input with pull-up v]
          set [pulses v] to (0)
          set [total v] to (0)

        when pin (27) goes [low v]
          change [pulses v] by (1)    // the handler ignores edges closer than 200 microseconds :: my

        every (1) seconds
          set [n v] to (pulses)
          set [pulses v] to (0)
          change [total v] by ((n) / (450))
          print (join [flow ] (((n) / (450)) * (60)) [ L/min   total ] (total) [ L])
      `,
      cpp: String.raw`
        const int FLOW_PIN = 27;
        const float PULSES_PER_LITRE = 450.0;          // the K factor of a YF-S201 type sensor
        const uint32_t MIN_GAP_US = 200;               // ignore edges closer than this: glitches

        volatile uint32_t pulses = 0;
        volatile uint32_t lastEdgeUs = 0;
        uint32_t lastCount = 0, lastMs = 0;
        float totalLitres = 0;

        void IRAM_ATTR onPulse() {
          uint32_t now = micros();
          if (now - lastEdgeUs >= MIN_GAP_US) {
            pulses++;
            lastEdgeUs = now;
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(FLOW_PIN, INPUT_PULLUP);
          attachInterrupt(FLOW_PIN, onPulse, FALLING);
          lastMs = millis();
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastMs >= 1000) {
            uint32_t seconds = now - lastMs;           // milliseconds since the last report
            lastMs = now;
            noInterrupts();                            // copy the counter while the handler cannot change it
            uint32_t n = pulses;
            interrupts();
            uint32_t delta = n - lastCount;
            lastCount = n;
            totalLitres += delta / PULSES_PER_LITRE;
            float litresPerMin = delta / PULSES_PER_LITRE * 60000.0 / seconds;
            Serial.printf("flow %.2f L/min   total %.2f L\n", litresPerMin, totalLitres);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        FLOW_PIN = 27
        PULSES_PER_LITRE = 450.0                       # the K factor of a YF-S201 type sensor
        MIN_GAP_US = 200                               # ignore edges closer than this: glitches

        pulses = 0
        last_edge_us = time.ticks_us()

        def on_pulse(pin):                             # a scheduled (soft) handler: fine for a few hundred pulses a second
            global pulses, last_edge_us
            now = time.ticks_us()
            if time.ticks_diff(now, last_edge_us) >= MIN_GAP_US:
                pulses += 1
                last_edge_us = now

        flow = Pin(FLOW_PIN, Pin.IN, Pin.PULL_UP)
        flow.irq(handler=on_pulse, trigger=Pin.IRQ_FALLING)

        last_count = 0
        last_ms = time.ticks_ms()
        total_litres = 0.0

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_ms) >= 1000:
                seconds = time.ticks_diff(now, last_ms) / 1000
                last_ms = now
                n = pulses                             # one read of an integer is safe
                delta = n - last_count
                last_count = n
                total_litres += delta / PULSES_PER_LITRE
                print("flow %.2f L/min   total %.2f L" % (delta / PULSES_PER_LITRE * 60 / seconds, total_litres))
            time.sleep_ms(10)
      `,
      output: `
        flow 0.00 L/min   total 0.00 L
        flow 3.02 L/min   total 0.05 L
        flow 3.04 L/min   total 0.10 L
      `,
      notes: ['The dead time of 200 µs limits the count to 5 kHz: far above the 225 Hz of a flow meter at 30 L/min. For a reed contact that bounces use 5 to 20 ms.', 'The MicroPython handler is scheduled, not instant, so it can lose pulses above a few hundred a second; the pulse counter below never does.', 'Save the total to flash only now and then (every few litres, or when the flow stops), not on every pulse.']
    },
    {
      title: 'The same, with the pulse counter',
      about: 'The pulse counter hardware counts the falling edges with a glitch filter of 1 µs and no interrupt per pulse. The program reads the count once a second. It runs on the ESP32, S2, S3, C5, C6, H2 and P4, not on the C3, C2 or C61.',
      needs: 'The same sensor and wiring. The Arduino core has no wrapper for the pulse counter, so the sketch includes the ESP-IDF driver.',
      wiring: [['sensor yellow', 'GPIO27', 'with a pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          start pulse counter unit (0) on pin (27), count falling edges, ignore pulses shorter than (1) µs :: my
          set [last v] to (0)
          set [total v] to (0)

        every (1) seconds
          set [n v] to (pulse counter value)
          change [total v] by (((n) - (last)) / (450))
          print (join [flow ] ((((n) - (last)) / (450)) * (60)) [ L/min   total ] (total) [ L])
          set [last v] to (n)
      `,
      cpp: String.raw`
        #include "driver/pulse_cnt.h"
        #include "driver/gpio.h"

        const int FLOW_PIN = 27;
        const float PULSES_PER_LITRE = 450.0;
        pcnt_unit_handle_t unit = nullptr;
        int lastCount = 0;
        float totalLitres = 0;

        void setup() {
          Serial.begin(115200);

          pcnt_unit_config_t unitConfig = {};
          unitConfig.low_limit = -32768;
          unitConfig.high_limit = 32767;
          unitConfig.flags.accum_count = 1;          // let the driver extend the 16-bit count in software
          pcnt_new_unit(&unitConfig, &unit);

          pcnt_glitch_filter_config_t filter = {};
          filter.max_glitch_ns = 1000;               // ignore pulses shorter than 1 us
          pcnt_unit_set_glitch_filter(unit, &filter);

          pcnt_chan_config_t chanConfig = {};
          chanConfig.edge_gpio_num = FLOW_PIN;
          chanConfig.level_gpio_num = -1;            // no second signal
          pcnt_channel_handle_t chan = nullptr;
          pcnt_new_channel(unit, &chanConfig, &chan);
          pcnt_channel_set_edge_action(chan, PCNT_CHANNEL_EDGE_ACTION_HOLD, PCNT_CHANNEL_EDGE_ACTION_INCREASE);   // count falling edges

          gpio_set_pull_mode((gpio_num_t)FLOW_PIN, GPIO_PULLUP_ONLY);
          pcnt_unit_enable(unit);
          pcnt_unit_clear_count(unit);
          pcnt_unit_start(unit);
        }

        void loop() {
          int n = 0;
          pcnt_unit_get_count(unit, &n);
          int delta = n - lastCount;
          lastCount = n;
          totalLitres += delta / PULSES_PER_LITRE;
          Serial.printf("flow %.2f L/min   total %.2f L\n", delta / PULSES_PER_LITRE * 60.0, totalLitres);
          delay(1000);
        }
      `,
      na: { py: 'MicroPython has no pulse-counter class in the version this guide follows: use the interrupt version above.' },
      output: `
        flow 3.02 L/min   total 0.05 L
        flow 3.04 L/min   total 0.10 L
      `,
      notes: ['The names are those of ESP-IDF 5.x and 6.x (the old driver/pcnt.h was removed in 6.0).', 'The count is read without being cleared, so no pulse can fall between the read and the clear.', 'On a chip with no pulse counter (C3, C2, C61) use the interrupt version.']
    }
  ],
  choose: {
    good: ['Polling for slow, clean signals when nothing else is happening', 'An interrupt with a dead time for up to a few kilohertz', 'The pulse counter for faster signals, for signals that must not lose a pulse, and when Wi-Fi is busy'],
    avoid: ['An interrupt per edge for tens of kilohertz', 'Counting a reed switch without a dead time', 'A delay() in a loop that polls a pulse pin'],
    check: ['The K factor of your sensor, from its datasheet and with a measuring jug', 'The shortest and the fastest pulse it can give', 'That your chip has the pulse counter: not the C2, C3 or C61']
  },
  examples: [
    {
      title: 'A flow meter at 12 litres a minute',
      q: 'A flow meter gives 450 pulses per litre. At 12 L/min, what is the pulse frequency, how many pulses does a one-second gate collect, and how fine is the reading?',
      steps: ['12 L/min is 0.2 L/s, so $f = 0.2 \\times 450 = 90$ Hz.', 'A gate of 1 s collects about 90 pulses.', 'One pulse is $1/450 = 0.0022$ L per second, which is 0.13 L/min: 1.1 % of the reading.'],
      a: '90 Hz, 90 pulses a second, a resolution of 0.13 L/min. 90 Hz is easy for an interrupt; a meter at several kilohertz would want the pulse counter.'
    }
  ],
  quiz: [
    { q: 'An S0 output gives 1000 pulses per kWh. A load takes 600 W for one hour. How many pulses arrive?', choices: ['600', '6000', '60', '1000'], a: 0, why: '600 W for one hour is 0.6 kWh, which is 0.6 × 1000 = 600 pulses.' },
    { q: 'A sensor gives 5 kHz. Which method is the safest for counting every pulse?', choices: ['Polling in the loop', 'An interrupt on each edge, with Wi-Fi running', 'The pulse counter hardware', 'attachInterrupt with delay() inside'], a: 2, why: 'At 5 kHz an interrupt every 200 µs strains a CPU that also runs Wi-Fi, and polling is hopeless. Counting in hardware never loses a pulse.' },
    { q: 'The ESP32-C3 has a pulse counter like the ESP32.', a: false, why: 'The C3, C2 and C61 have none. On those chips a program counts interrupts.' },
    { q: 'A flow meter is read with a gate of 1 s and gives 450 pulses per litre. What is the smallest change in flow it can show?', choices: ['0.13 L/min', '1 L/min', '0.001 L/min', '13 L/min'], a: 0, why: 'One pulse in a second is 1/450 L per second, which is 60/450 = 0.133 L/min. A longer gate or timing the gap between pulses is finer.' }
  ],
  applications: [
    'Water, gas and heat meters, and irrigation controllers that know how much was used.',
    'Wind speed from an anemometer and rainfall from a tipping-bucket gauge in a weather station.',
    'Wheel and motor speed with a Hall or optical pickup ([[rotary-encoders]]).',
    'Reading the S0 output of an electricity meter to log household consumption.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, *Pulse Counter (PCNT)*: units, channels, edge actions and the glitch filter.',
    'Arduino core for ESP32 documentation, *GPIO* API (attachInterrupt) and the ESP32 interrupt notes; MicroPython documentation, *machine.Pin.irq* (version 1.29).',
    'IEC 62053-31, *Pulse output devices* (the S0 interface), and the datasheet of the flow sensor you use.'
  ]
},

/* ================================================================ frequency and time */
{
  id: 'measuring-frequency-and-time',
  parent: 'measuring-electricity-and-force',
  title: 'Measuring frequency and time',
  level: 3,
  short: 'A frequency is found either by counting pulses for a fixed time or by timing one period. Counting suits fast signals, timing suits slow ones, and timing whole periods against a fast clock suits both. Every answer is only as good as the clock behind it.',
  keywords: ['frequency counter', 'period', 'gate time', 'reciprocal counting', 'pulseIn', 'time_pulse_us', 'micros', 'cycle counter', 'getCycleCount', 'input capture', 'RMT', 'MCPWM capture', 'resolution', 'crystal', 'ppm', 'time base', 'tachometer', 'zero crossing', 'interval'],
  prereq: ['pulse-counting', 'hardware-timers', 'interrupts'],
  related: ['pulse-counter-pcnt', 'the-rmt-peripheral', 'mcpwm', 'esp-as-a-frequency-counter', 'crystals-and-clocks', 'time-sync-between-boards', 'accuracy-resolution-precision', 'electronics:crystal-oscillators'],
  body: `Of all quantities a microcontroller can measure, time is the best known: its crystal is good to tens of parts per million, a hundred times better than its ADC measures voltage. So a signal that repeats, a mains zero crossing, a tachometer, a sensor that outputs a frequency, can be measured very finely, if the measurement is arranged well. There are two basic ways.

### Count in a gate

Open a gate of T seconds, count the n edges that arrive, and the frequency is n / T. The count is whole, so it can be one too high or too low, and the relative error is 1 / (f × T): 1 % for a 100 Hz signal in a one-second gate, 1 ppm for 1 MHz. Great for fast signals, hopeless for slow ones: a 1 Hz signal read in one second is wrong by up to 100 %.

### Time the period

Measure the time between two edges with a fast clock and the frequency is its reciprocal. The clock's tick is the uncertainty: with the 1 µs of \`micros()\` a 1 kHz signal has a period of 1000 ticks, so ±0.1 %; a 10 kHz signal ±1 %. Slow signals are measured superbly this way (1 Hz to 1 ppm) and fast ones badly, the opposite of counting. Timing *N periods* at once divides the error by N, at the price of N / f seconds.

### Where they meet, and the best of both

Setting the two errors equal gives a crossover at $f = \\sqrt{f_{clk} / T}$: about 1 kHz for a 1 µs clock and a 1 s gate; 9 kHz for an 80 MHz timer clock; 15 kHz for the 240 MHz CPU cycle counter. **Reciprocal counting** takes the best of both: count whole periods during the gate and time those same periods with the fast clock, so the error is 1 / ($f_{\\mathrm{clk}}$ × T) at any frequency, 1 ppm for a 1 MHz clock and a one-second gate. The program below does that with edge time stamps.

### Tools on the ESP

- **\`pulseIn()\`** (Arduino) and MicroPython's **\`machine.time_pulse_us()\`** time one pulse in microseconds and block while they wait.
- **Interrupt time stamps** with \`micros()\` cost an interrupt per edge and are blurred by the latency of the interrupt: microseconds, more with Wi-Fi.
- **The cycle counter** \`ESP.getCycleCount()\` ticks at the CPU frequency (4.2 ns at 240 MHz) and wraps after about 18 s.
- **Hardware capture**, on the chips that have it: the RMT receiver and the motor-PWM capture channels time-stamp edges at up to 80 MHz without the CPU ([[the-rmt-peripheral]], [[mcpwm]]); the pulse counter counts in a gate set by a hardware timer ([[pulse-counter-pcnt]]).

### The time base

The main crystal is good to tens of ppm and drifts a little with temperature: 50 Hz reads within about ±0.003 Hz. For better, compare against a GPS second pulse or a temperature-compensated oscillator. The internal RC oscillators are off by percent: never use them as a time base for a measurement ([[crystals-and-clocks]]).

> [!key] Count edges in a gate for fast signals, time the period for slow ones, and time whole periods for both: the error of each follows from the gate time and the clock tick, and all of them are limited by the crystal.`,
  ideas: [
    'Counting edges in a gate has a relative error of 1 / (f × T): fine for fast signals, poor for slow ones.',
    'Timing one period has a relative error of f / f_clk: superb for slow signals and poor for fast ones; timing N periods divides it by N.',
    'Reciprocal counting, whole periods timed against a fast clock, gives 1 / (f_clk × T) at any frequency.',
    'The crystal sets the ultimate accuracy: tens of ppm; the internal RC oscillators are off by percent.'
  ],
  pitfalls: [
    'A one-second gate always gives the most accurate frequency — Not for slow signals: at 1 Hz a one-second gate is wrong by up to 100 %. Time the period instead.',
    'micros() in an interrupt gives microsecond timing — The interrupt starts late by a latency that varies by microseconds and more under Wi-Fi load; a handler in MicroPython is scheduled and much later still.',
    'The crystal is exact — It is good to some tens of ppm, and a board that does not use it (the internal RC) is off by percent.'
  ],
  terms: [
    { term: 'Gate time', also: ['counting window', 'measurement window'], def: 'The fixed time during which edges are counted by a frequency counter. A longer gate means a finer result and a slower one.' },
    { term: 'Reciprocal counting', also: ['reciprocal frequency counter', 'period averaging'], def: 'Measuring a frequency by counting whole periods over about a gate time and timing exactly those periods with a fast clock; the resolution is then the clock tick divided by the time, whatever the frequency.' },
    { term: 'Input capture', also: ['edge capture', 'timestamp capture'], def: 'Hardware that copies a free-running timer into a register at the moment an edge arrives, so the time of the edge is known to one clock tick with no interrupt latency.' },
    { term: 'Time base', also: ['reference clock', 'crystal accuracy', 'ppm'], def: 'The clock that every time and frequency measurement is compared with. A crystal is good to some tens of parts per million; the result can never be better than its time base.' },
    { term: 'Cycle counter', also: ['CCOUNT', 'ESP.getCycleCount'], def: 'A counter inside the CPU that increases at every clock cycle: a 32-bit timer with a tick of 4.2 ns at 240 MHz, wrapping after about 18 seconds.' }
  ],
  sim: 'me-frequency',
  formulas: [
    {
      name: 'Error of a gate count',
      expr: 'err = 1 / (f * T)',
      tex: 'e = \\frac{1}{f\\,T}',
      vars: {
        err: { name: 'relative error', q: 'ratio', unit: '%', tex: 'e' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 100, min: 0, tex: 'f' },
        T: { name: 'gate time', q: 'time', unit: 's', value: 1, min: 0, tex: 'T' }
      },
      solveFor: 'err',
      note: 'The worst case: the count is off by one pulse. At 1 / (f T) = 1 the answer is meaningless.',
      stories: { err: 'A {f} signal is counted for {T}. How large can the relative error be?', T: 'A {f} signal must be measured to {err}. How long must the gate be?' }
    },
    {
      name: 'Error of timing periods',
      expr: 'err = f / (fclk * N)',
      tex: 'e = \\frac{f}{f_{\\mathrm{clk}}\\,N}',
      vars: {
        err: { name: 'relative error', q: 'ratio', unit: '%', tex: 'e' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 1000, min: 0, tex: 'f' },
        fclk: { name: 'clock of the timer', q: 'frequency', unit: 'MHz', value: 1, min: 0, tex: 'f_{\\mathrm{clk}}' },
        N: { name: 'periods timed together', q: 'count', value: 1, min: 1, int: true, tex: 'N' }
      },
      solveFor: 'err',
      note: 'The worst case: the interval is off by one clock tick. micros() ticks at 1 MHz, the timer peripherals at up to 80 MHz and the cycle counter at the CPU frequency.',
      stories: { err: 'A {f} signal is timed over {N} period(s) with a {fclk} clock. How large can the relative error be?' }
    },
    {
      name: 'Crossover of the two methods',
      expr: 'fx = sqrt(fclk / T)',
      tex: 'f_{x} = \\sqrt{\\frac{f_{\\mathrm{clk}}}{T}}',
      vars: {
        fx: { name: 'crossover frequency', q: 'frequency', unit: 'Hz', tex: 'f_{x}' },
        fclk: { name: 'clock of the timer', q: 'frequency', unit: 'MHz', value: 1, min: 0, tex: 'f_{\\mathrm{clk}}' },
        T: { name: 'gate time', q: 'time', unit: 's', value: 1, min: 0, tex: 'T' }
      },
      solveFor: 'fx',
      note: 'Below this frequency timing the period is the more accurate method, above it counting in the gate. Reciprocal counting is better than both.',
      stories: { fx: 'A timer ticks at {fclk} and the gate is {T}. Above what frequency does counting beat timing one period?' }
    }
  ],
  code: [
    {
      title: 'A frequency counter, counted and timed',
      about: 'An interrupt counts the rising edges of a signal and stores the time of the first and the last edge. Once a second the program prints the frequency from the count (n edges in the gate) and from the time stamps (n − 1 whole periods over their measured time): the second is the reciprocal method.',
      needs: 'An ESP32 DevKit and a signal of 1 Hz to about 20 kHz, 0 to 3.3 V: a signal generator, a 555 timer on 3.3 V, or the board\'s own PWM output on another pin. Connect the grounds.',
      wiring: [['signal', 'GPIO27', '0 to 3.3 V only'], ['signal ground', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input v]
          set [edges v] to (0)

        when pin (27) goes [high v]
          if <(edges) = (0)> then
            set [first v] to (microseconds since start)
          end
          set [last v] to (microseconds since start)
          change [edges v] by (1)

        every (1) seconds
          set [n v] to (edges)
          set [t0 v] to (first)
          set [t1 v] to (last)
          set [edges v] to (0)
          print (join [counted ] (n) [ Hz   timed ] (((n) - (1)) * (1000000) / ((t1) - (t0))) [ Hz])
      `,
      cpp: String.raw`
        const int SIGNAL_PIN = 27;
        const uint32_t GATE_MS = 1000;              // the gate; delay() times it to about a millisecond

        volatile uint32_t edges = 0;                // rising edges in this gate
        volatile uint32_t firstUs = 0, lastUs = 0;  // time stamps of the first and the last edge

        void IRAM_ATTR onEdge() {
          uint32_t now = micros();
          if (edges == 0) firstUs = now;
          lastUs = now;
          edges++;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(SIGNAL_PIN, INPUT);
          attachInterrupt(SIGNAL_PIN, onEdge, RISING);
        }

        void loop() {
          delay(GATE_MS);
          noInterrupts();                           // copy and restart while the handler cannot interfere
          uint32_t n = edges, first = firstUs, last = lastUs;
          edges = 0;
          interrupts();
          float counted = n * 1000.0 / GATE_MS;                                      // method A: n edges in the gate
          float timed = n > 1 ? (n - 1) * 1e6 / (float)(last - first) : 0;           // method B: whole periods over their time
          Serial.printf("%lu edges   counted %.2f Hz   timed %.3f Hz\n", (unsigned long)n, counted, timed);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SIGNAL_PIN = 27
        GATE_MS = 1000                              # the gate

        edges = 0                                   # rising edges in this gate
        first_us = 0                                # time stamps of the first and the last edge
        last_us = 0

        def on_edge(pin):                           # a scheduled (soft) handler: the time stamps are blurred
            global edges, first_us, last_us
            now = time.ticks_us()
            if edges == 0:
                first_us = now
            last_us = now
            edges += 1

        Pin(SIGNAL_PIN, Pin.IN).irq(handler=on_edge, trigger=Pin.IRQ_RISING)

        while True:
            time.sleep_ms(GATE_MS)
            n, first, last = edges, first_us, last_us
            edges = 0
            counted = n * 1000 / GATE_MS                                                  # method A: n edges in the gate
            timed = (n - 1) * 1e6 / time.ticks_diff(last, first) if n > 1 else 0          # method B: whole periods over their time
            print("%d edges   counted %.2f Hz   timed %.3f Hz" % (n, counted, timed))
      `,
      output: `
        1000 edges   counted 1000.00 Hz   timed 999.982 Hz
        1000 edges   counted 1000.00 Hz   timed 1000.016 Hz
        7 edges   counted 7.00 Hz   timed 6.998 Hz
      `,
      notes: ['The last line shows a slow signal: the count can only be 7 or 8, while the timed value tells 6.998 Hz.', 'A rising edge arrives between two reads and can be seen twice or not at all: the one-edge uncertainty of the gate is built in. Method B has no such uncertainty, but it cannot do better than the jitter of the interrupt (microseconds in C++, hundreds of microseconds in MicroPython).', 'Above about 20 kHz an interrupt per edge is too much: count with the pulse counter hardware and time the gate with a hardware timer ([[pulse-counter-pcnt]], [[hardware-timers]]).']
    }
  ],
  choose: {
    good: ['Counting in a gate for signals of tens of kilohertz and up', 'Timing the period (or N periods) for signals below a kilohertz or so', 'Reciprocal counting, or hardware capture, when both fast and slow signals must be read well'],
    avoid: ['A one-second gate on a signal of a few hertz', 'An interrupt per edge for tens of kilohertz', 'The internal RC oscillators as the reference for a measurement'],
    check: ['Your gate time and clock tick against the frequency range you need', 'The jitter of the interrupt on your board, with Wi-Fi on', 'The crystal tolerance, if ppm matter']
  },
  examples: [
    {
      title: 'The mains frequency to a millihertz',
      q: 'You time the period of the 50 Hz mains from a zero-crossing detector with micros() (1 µs ticks). How good is one period, and how many periods give 0.001 Hz?',
      steps: ['One period is 20 000 ticks, so ±1 tick is $1 / 20\\,000 = 50$ ppm, which is ±0.0025 Hz.', 'Timing N periods divides this by N: for ±0.0005 Hz take N = 5; with the interrupt\'s jitter of some microseconds, take N = 50, a one-second measurement.', 'The crystal\'s own accuracy (tens of ppm) is then the limit: about ±0.002 Hz.'],
      a: 'One period is good to about 0.0025 Hz; fifty periods in a second to 0.0001 Hz of timing error, with the crystal limiting the answer to a few millihertz.'
    }
  ],
  quiz: [
    { q: 'A signal of 5 Hz is counted in a gate of 1 s. How large can the relative error be?', choices: ['0.2 %', '20 %', '2 %', '0.02 %'], a: 1, why: 'The count is off by up to one pulse: 1 / (5 × 1) = 0.2 = 20 %. Time the period instead.' },
    { q: 'A 10 kHz signal is timed over one period with the 1 µs clock of micros(). How large can the error be?', choices: ['0.01 %', '0.1 %', '1 %', '10 %'], a: 2, why: 'The period is 100 µs and the tick 1 µs: 1 %. A faster clock or a count in a gate does better.' },
    { q: 'Timing the period and counting in a gate have the same accuracy at every frequency.', a: false, why: 'Counting improves as the frequency rises (1 / (f T)) and timing gets worse (f / f_clk). They meet at the crossover frequency, and reciprocal counting is good at all of them.' },
    { q: 'What is the crossover frequency for a 1 MHz timer tick and a gate of 1 s?', choices: ['1 Hz', '100 Hz', '1 kHz', '1 MHz'], a: 2, why: 'The square root of f_clk / T = sqrt(1 000 000 / 1) = 1000 Hz.' }
  ],
  applications: [
    'Reading a 555-based or other sensor that outputs a frequency, such as a capacitive humidity sensor.',
    'A tachometer for a motor or a fan, from an optical or Hall pulse.',
    'Monitoring the mains frequency from a zero-crossing detector.',
    'Calibrating another oscillator or a crystal against a reference ([[esp-as-a-frequency-counter]]).'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *Timing* functions (micros, pulseIn) and ESP.getCycleCount; MicroPython documentation, *machine.time_pulse_us* and the time module (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, RMT, MCPWM capture and PCNT chapters.',
    'Hewlett-Packard, *Application Note 200, Fundamentals of Electronic Counters* (the gate and the reciprocal method).'
  ]
},

/* ================================================================ 4-20 mA and 0-10 V */
{
  id: 'four-to-twenty-milliamp',
  parent: 'measuring-electricity-and-force',
  title: '4–20 mA and 0–10 V signals',
  level: 2,
  short: 'Industry sends a measurement as a current of 4 to 20 mA or a voltage of 0 to 10 V, because both survive long, noisy cables. The ESP reads them with a precise resistor or a divider, a clamp at the pin and, where the grounds differ, isolation.',
  keywords: ['4-20 mA', 'current loop', '0-10 V', 'industrial signals', 'transmitter', 'shunt', '150 ohm', '100 ohm', 'loop power', 'two-wire', 'NAMUR NE 43', 'live zero', 'wire break', 'protection', 'isolation', 'pressure transmitter', 'PLC', 'ground loop', 'HART'],
  prereq: ['measuring-voltage', 'measuring-current-with-shunts', 'optocouplers'],
  related: ['industrial-signals', 'relay-and-industrial-boards', 'isolation-and-long-cables', 'protection-parts', 'external-adc-and-dac', 'rs-485', 'modbus', 'electronics:sensor-interfacing'],
  body: `A factory's sensors are far from its controllers, and the cables run beside motors. A voltage on such a cable picks up noise and loses some of itself to the wire's resistance. A **current** does neither: a transmitter that forces 12 mA into the loop gives 12 mA at the far end, however long the cable, and noise can add little to it. That is why the standard signal is a **4–20 mA loop**.

### How the loop works

The transmitter, powered by the loop itself (a *two-wire* transmitter) from a supply of typically 24 V, varies the current between 4 mA, the bottom of its range, and 20 mA, the top. The receiver puts a precise resistor, the **shunt**, in the loop and measures the voltage across it. The 4 mA floor, the **live zero**, makes a fault visible: a broken wire gives 0 mA, which is not a possible measurement. To get the process value, scale linearly: a pressure transmitter for 0 to 10 bar gives 12 mA at 5 bar. The standard NAMUR NE 43 sets the valid range at about 3.8 to 20.5 mA and reads below 3.6 mA or above 21 mA as a failure.

### Reading it with an ESP

$V = I \\cdot R$ with the shunt, and the voltage must fit the ADC's range for your chip ([[adc-attenuation-and-calibration]]). A **150 Ω** shunt gives 0.6 to 3.0 V: right for the ESP32-S3 (to 3.1 V) and C6 (to 3.3 V) and **too much** for the original ESP32 and the C3, whose usable range ends at 2.45 to 2.5 V. For those, **100 Ω** gives 0.4 to 2.0 V, and at 20.5 mA still only 2.05 V. Use a 0.1 % resistor, put 100 nF across the pin and average. A 100 Ω shunt puts the 16 mA span across 1.6 V: about 2000 to 2600 counts, 0.006 to 0.008 mA per count, depending on the chip.

### Protection and isolation

The loop is a current source with 24 V behind it. If the shunt comes unsoldered or a wire touches the wrong terminal, the pin can see the whole 24 V. Put a series resistor of about 1 kΩ in front of the pin and a clamp (a Zener, a TVS or a Schottky pair) at the pin. And because the loop's ground and the ESP's ground are rarely the same, ground loops and noise on the line often call for **isolation**: an isolated 4–20 mA input module, a loop isolator, or an isolated converter.

### 0 to 10 V

A voltage output is simpler and less robust: the wire's resistance and noise count, and 0 V cannot be told from a broken wire. A divider of 33 kΩ and 10 kΩ gives 2.33 V at 10 V, inside every chip's range with about 5 % to spare for a source that overshoots ([[measuring-voltage]]). Clamp the pin; a 0 to 10 V cable can be hit by 24 V.

> [!key] A 4–20 mA loop is read with a precise shunt chosen so that 20 mA stays inside the ADC range (100 Ω on the original ESP32 and the C3), with a series resistor and a clamp at the pin. The live zero turns a broken wire into a visible fault; 0 to 10 V needs a divider and the same care.`,
  ideas: [
    'A current is insensitive to cable length and noise, so industry sends measurements as 4–20 mA; the 4 mA live zero shows a broken wire as 0 mA.',
    'The receiver is a precise shunt: choose its value so that the voltage at 20 mA stays inside the ADC range of your chip: 100 Ω for the original ESP32 and C3, 150 Ω for the S3 and C6.',
    'Scale linearly from 4–20 mA to the process range, and treat below 3.6 mA and above 21 mA as faults (NAMUR NE 43).',
    'A loop is a 24 V source: add a series resistor and a clamp at the pin, and isolate when grounds differ.'
  ],
  pitfalls: [
    'A 150 Ω shunt is the standard for any ESP — It gives 3.0 V at 20 mA, over the usable range of the original ESP32 and the C3 (2.45 and 2.5 V). Use 100 Ω there.',
    'Zero current means zero pressure — On a live-zero loop zero current is a fault: the valid range starts at 4 mA, and below about 3.6 mA the wire or the transmitter is dead.',
    'A 0 to 10 V input can go to a divider and the pin and nothing else — The cable can be hit by 24 V and noise. Add a clamp, and isolate when the grounds differ.'
  ],
  terms: [
    { term: '4–20 mA loop', also: ['current loop', 'two-wire transmitter'], def: 'An industrial signal in which a transmitter regulates the current in a pair of wires between 4 mA (the bottom of its range) and 20 mA (the top). The receiver measures the current with a shunt.' },
    { term: 'Live zero', also: ['elevated zero'], def: 'The use of 4 mA, not 0 mA, for the bottom of the range, so that a real zero can be told from a broken wire or a dead transmitter, which both read 0 mA.' },
    { term: 'NAMUR NE 43', also: ['NE43', 'failure signal'], def: 'A recommendation for 4–20 mA signals: the valid range is about 3.8 to 20.5 mA, and a current below 3.6 mA or above 21 mA signals a failure of the sensor or the wiring.' },
    { term: 'Loop isolator', also: ['signal isolator', 'galvanic isolation'], def: 'A device that passes a 4–20 mA or 0–10 V signal between two circuits that have no electrical connection, to break ground loops and protect the receiver.' }
  ],
  sim: 'me-loop',
  formulas: [
    {
      name: 'Process value from the loop current',
      expr: 'x = xmin + (I - 0.004) * (xmax - xmin) / 0.016',
      tex: 'x = x_{\\min} + \\frac{I - 4\\ \\mathrm{mA}}{16\\ \\mathrm{mA}}\\,(x_{\\max} - x_{\\min})',
      vars: {
        x: { name: 'process value', q: 'none', tex: 'x' },
        xmin: { name: 'value at 4 mA', q: 'none', value: 0, signed: true, tex: 'x_{\\min}' },
        xmax: { name: 'value at 20 mA', q: 'none', value: 10, signed: true, tex: 'x_{\\max}' },
        I: { name: 'loop current', q: 'current', unit: 'mA', value: 12, min: 0, tex: 'I' }
      },
      solveFor: 'x',
      note: 'The line from (4 mA, xmin) to (20 mA, xmax). Valid between about 3.8 and 20.5 mA; outside it, treat the loop as faulty. The unit of x is that of the range you enter, such as bar or °C.',
      stories: { x: 'A transmitter spans {xmin} at 4 mA to {xmax} at 20 mA and gives {I}. What does it measure?', I: 'A transmitter spans {xmin} at 4 mA to {xmax} at 20 mA and reads {x}. What is the loop current?' }
    },
    {
      name: 'Largest shunt for the ADC range',
      expr: 'R = Vtop / Imax',
      tex: 'R = \\frac{V_{\\mathrm{top}}}{I_{\\max}}',
      vars: {
        R: { name: 'shunt resistance', q: 'resistance', unit: 'Ω', tex: 'R' },
        Vtop: { name: 'top of the ADC range', q: 'voltage', unit: 'V', value: 2.45, min: 0, tex: 'V_{\\mathrm{top}}' },
        Imax: { name: 'largest loop current', q: 'current', unit: 'mA', value: 21, min: 0, tex: 'I_{\\max}' }
      },
      solveFor: 'R',
      note: 'Imax of 21 mA allows for the failure signal. Take the next smaller standard value and a 0.1 % part: for 2.45 V this gives about 117 Ω, so 100 Ω.',
      stories: { R: 'The ADC range ends at {Vtop} and the loop can reach {Imax}. What is the largest shunt?' }
    }
  ],
  code: [
    {
      title: 'Read a pressure transmitter, 0 to 10 bar',
      about: 'Averages 64 readings across a 100 Ω shunt, converts to milliamps, and prints the pressure for a 4–20 mA transmitter spanning 0 to 10 bar. Below 3.6 mA it reports a broken wire; above 21 mA, over range.',
      needs: 'An ESP32 DevKit, a 100 Ω 0.1 % resistor, 100 nF, 1 kΩ, a 3.3 V Zener (optional clamp), a 24 V supply and a two-wire 4–20 mA pressure transmitter. Join the ESP\'s ground and the supply\'s negative.',
      wiring: [['24 V +', 'transmitter +'], ['transmitter −', '100 Ω → GND', 'the shunt: 24 V − joined to GND'], ['shunt top', '1 kΩ → GPIO34', 'series protection'], ['GPIO34', '100 nF → GND, and a 3.3 V Zener to GND (cathode on the pin)']],
      blocks: `
        define loop milliamps :: my
          set [total v] to (0)
          repeat (64)
            change [total v] by (analog read pin (34) in millivolts)
          end
          return ((((total) / (64)) / (100)))    // millivolts across 100 ohm = milliamps

        when started
          start serial at (115200) baud
        forever
          set [mA v] to (loop milliamps)
          if <(mA) < (3.6)> then
            print (join (mA) [ mA: wire broken or transmitter dead])
          else if <(mA) > (21)> then
            print (join (mA) [ mA: over range])
          else
            print (join (mA) [ mA = ] (((mA) - (4)) / (16) * (10)) [ bar])
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                      // an ADC1 pin
        const float SHUNT_OHMS = 100.0;              // 0.1 %: 4 mA gives 0.4 V, 20 mA gives 2.0 V
        const float RANGE_MIN = 0.0, RANGE_MAX = 10.0;   // the transmitter's span in bar

        float loopMilliamps() {
          uint32_t sum = 0;
          for (int i = 0; i < 64; i++) sum += analogReadMilliVolts(ADC_PIN);
          float millivolts = sum / 64.0;
          return millivolts / SHUNT_OHMS;            // millivolts over ohms is milliamps
        }

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(ADC_PIN, ADC_11db);
        }

        void loop() {
          float mA = loopMilliamps();
          if (mA < 3.6) Serial.printf("%.2f mA: wire broken or transmitter dead\n", mA);
          else if (mA > 21.0) Serial.printf("%.2f mA: over range\n", mA);
          else Serial.printf("%.2f mA = %.2f bar\n", mA, RANGE_MIN + (mA - 4.0) / 16.0 * (RANGE_MAX - RANGE_MIN));
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)      # an ADC1 pin
        SHUNT_OHMS = 100.0                           # 0.1 %: 4 mA gives 0.4 V, 20 mA gives 2.0 V
        RANGE_MIN, RANGE_MAX = 0.0, 10.0             # the transmitter's span in bar

        def loop_milliamps():
            total = 0
            for _ in range(64):
                total += adc.read_uv()
            millivolts = total / 64 / 1000
            return millivolts / SHUNT_OHMS           # millivolts over ohms is milliamps

        while True:
            mA = loop_milliamps()
            if mA < 3.6:
                print("%.2f mA: wire broken or transmitter dead" % mA)
            elif mA > 21.0:
                print("%.2f mA: over range" % mA)
            else:
                print("%.2f mA = %.2f bar" % (mA, RANGE_MIN + (mA - 4.0) / 16.0 * (RANGE_MAX - RANGE_MIN)))
            time.sleep(1)
      `,
      output: `
        12.01 mA = 5.01 bar
        15.97 mA = 7.48 bar
        0.02 mA: wire broken or transmitter dead
      `,
      notes: ['The shunt is in the return leg, so the ESP\'s ground is the loop\'s negative. If several loops or other equipment share the ground, or the cable is long, use an isolated receiver.', 'On an ESP32-S3 or C6 a 150 Ω shunt (0.6 to 3.0 V) gives finer steps; the original ESP32 and the C3 must use about 100 Ω.', 'Calibrate: set the transmitter simulator (or a calibrator) to 4 and 20 mA and apply the two-point correction of [[adc-attenuation-and-calibration]].']
    }
  ],
  choose: {
    good: ['4–20 mA for any sensor more than a few metres away, or near motors and drives', 'A 100 Ω 0.1 % shunt on the original ESP32 and C3, 150 Ω on the S3 and C6', 'An isolated receiver module whenever the loop shares ground with other equipment'],
    avoid: ['Connecting the loop to the pin with no series resistor and no clamp', 'A 150 Ω shunt on a chip whose range ends at 2.45 or 2.5 V', 'Reading 0 mA as "zero" instead of a fault'],
    check: ['The transmitter\'s minimum supply voltage against the 24 V minus the drop across the shunt', 'That the voltage at 21 mA stays inside the ADC range', 'The grounds: are the ESP\'s and the loop\'s the same?']
  },
  examples: [
    {
      title: 'The tank level',
      q: 'A level transmitter spans 0 to 4 m as 4–20 mA. An ESP32 reads it across 100 Ω and the ADC reports 1.12 V. What is the current and the level?',
      steps: ['$I = V / R = 1.12 / 100 = 11.2$ mA.', 'The fraction of the span is $(11.2 - 4) / 16 = 0.45$.', 'The level is $0.45 \\times 4\\ \\mathrm{m} = 1.8$ m.'],
      a: '11.2 mA, which is a level of 1.8 m. At 3.5 mA the same program would report a broken wire.'
    }
  ],
  quiz: [
    { q: 'A 4–20 mA transmitter spans 0 to 100 °C. The loop carries 8 mA. What is the temperature?', choices: ['25 °C', '40 °C', '8 °C', '50 °C'], a: 0, why: '(8 − 4) / 16 = 0.25 of the span, so 25 °C.' },
    { q: 'Why does a 4–20 mA loop start at 4 mA and not at 0 mA?', choices: ['It saves power', 'So that a broken wire (0 mA) can be told from a real zero reading', 'The transmitter needs 4 mA to run', 'To make the scale non-linear'], a: 1, why: 'The live zero makes a fault visible: zero current is not a valid measurement. (A two-wire transmitter also draws its own supply from the loop, which needs the 4 mA, but that is not why the standard chooses it.)' },
    { q: 'A 150 Ω shunt can be used on any ESP32 chip without a problem.', a: false, why: '20 mA through 150 Ω is 3.0 V. The original ESP32 and the C3 have usable ranges that end at about 2.45 and 2.5 V, so 100 Ω is the right choice there.' },
    { q: 'What is the purpose of a 1 kΩ resistor and a clamp at the ADC pin of a 4–20 mA input?', choices: ['They improve the resolution', 'If the shunt opens or a wire touches 24 V, they keep the pin below its limit', 'They remove noise', 'They make the loop two-wire'], a: 1, why: 'The loop is a 24 V source. A fault can present that voltage to the pin; the series resistor limits the current and the clamp holds the voltage near 3.3 V.' }
  ],
  applications: [
    'Pressure, level, temperature and flow transmitters in water, process and building plants.',
    'Reading the analogue outputs of a PLC or a drive, or an old industrial sensor, into a data logger.',
    'Retrofitting a monitoring ESP onto a machine that already has 4–20 mA sensors.',
    'Test benches that simulate a transmitter to check a receiver.'
  ],
  sources: [
    'IEC 60381-1, *Analogue signals for process control systems: analogue direct current signals* (4–20 mA).',
    'NAMUR recommendation NE 43, *Standardization of the signal level for the failure information of digital transmitters*.',
    'Espressif, *ESP32 Series Datasheet*, ADC characteristics, for the range of the attenuation you use.'
  ]
}
);
