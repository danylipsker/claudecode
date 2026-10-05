/* HYPER-ESP32 · content/the-esp-as-an-instrument.js
 *
 * Topic "The ESP as an instrument" (simulations: sims/the-esp-as-an-instrument.js, ids in-…):
 *   accuracy-resolution-precision · esp-as-a-voltmeter · esp-as-an-oscilloscope · esp-as-a-logic-analyser ·
 *   esp-as-a-frequency-counter · esp-as-a-signal-generator · esp-as-a-data-logger · esp-as-a-network-scanner ·
 *   esp-as-a-power-meter · presenting-live-data · uncertainty-and-calibration
 */
Hyper.add(
/* ================================================================ accuracy, resolution, precision */
{
  id: 'accuracy-resolution-precision',
  parent: 'the-esp-as-an-instrument',
  title: 'Accuracy, resolution, precision',
  level: 1,
  short: 'Three words that sound alike and mean three different things. Resolution is the smallest step a reading can take, precision is how well it repeats, accuracy is how close it is to the truth. A display with many digits can claim the first and still fail the other two.',
  keywords: ['accuracy', 'precision', 'resolution', 'repeatability', 'trueness', 'bias', 'systematic error', 'random error', 'LSB', 'least significant bit', 'false precision', 'significant digits', 'error band', 'measurement', 'standard deviation', 'ENOB'],
  prereq: ['the-esp-adc', 'analog-input'],
  related: ['oversampling-and-noise', 'adc-attenuation-and-calibration', 'uncertainty-and-calibration', 'esp-as-a-voltmeter', 'sensor-calibration', 'electronics:measurement', 'math:standard-deviation'],
  body: `Aim at a target. Five shots land in a tight cluster, but in the top-left corner: the shooter is **precise** (the shots agree with each other) and not **accurate** (they agree on the wrong place). Five more are scattered evenly around the bull's-eye: on average right, individually unreliable. Now imagine the target is printed on a grid of coarse squares and every shot is moved to the centre of its square: that is limited **resolution**. A measuring instrument can fail in any of the three ways, and the cure for each is different.

### The three words

- **Resolution** is the smallest change the instrument can show. For the ESP's 12-bit converter it is one count: the full-scale voltage divided by 4096, about 0.8 mV when the range reaches 3.1 V. Resolution is a property of the converter and the range, and you can read it off the datasheet.
- **Precision** (or repeatability) is how closely repeated readings of the same steady input agree. It is noise: the standard deviation of the readings. It can be improved by averaging ([[oversampling-and-noise]]).
- **Accuracy** is how close the reading is to the true value. The part that stays the same from reading to reading is the **bias** (a systematic error: offset and gain); only comparison with something better than the instrument can reveal it, and calibration can remove most of it ([[uncertainty-and-calibration]]).

A fine step does not make a reading true. Averaging 10 000 readings of an ESP32's converter makes the answer very steady, and exactly as wrong as its offset and non-linearity left it.

### False precision

The serial monitor will happily print 1.65374 V. If the converter's step is 0.8 mV, noise a few counts and accuracy a percent, then only the first two or three digits mean anything: 1.65 V, and the real statement is "1.65 V, give or take 0.02". Show digits down to the resolution at most, and fewer if the noise or the accuracy is worse ([[presenting-live-data]]).

### How good is good enough

- An instrument should be several times better than the tolerance of what it checks. A 5 % resistor can be sorted with a 1 % meter; a 1 % reference needs a 0.1 % meter.
- Specifications are written as **percent of reading plus a number of counts**, for example ±(0.5 % + 2 counts). The percentage is the bias, the counts are the resolution and noise. The first formula below turns such a line into millivolts.
- Of the ESP's own converter, expect a **resolution** of 12 bits, an **effective resolution** of about 9 to 10 bits after noise, and an **accuracy** of a few percent raw or around one percent after calibration ([[the-esp-adc]], [[adc-attenuation-and-calibration]]). An external 16-bit converter with its own reference is better on all three ([[external-adc-and-dac]]).

> [!key] Resolution is the step, precision is the scatter, accuracy is the distance from the truth: three separate properties. Averaging cures scatter, calibration cures bias, and only a finer converter cures the step. Print only the digits you can defend.`,
  ideas: [
    'Resolution is the smallest step, precision is the repeatability of readings, accuracy is the closeness to the true value.',
    'Noise is a random error and can be averaged away; bias (offset and gain) is a systematic error and cannot.',
    'A reading can have many digits and still be wrong in all of them: show only the digits you can defend.',
    'An instrument\'s specification is a percentage of the reading plus a few counts; the ESP\'s own converter is good to a few percent until it is calibrated.'
  ],
  pitfalls: [
    'A 12-bit converter is accurate to one part in 4096 — That is its resolution. Accuracy is decided by offset, gain error and non-linearity, which on the ESP\'s converter amount to a percent or more.',
    'Averaging many readings makes the result accurate — It makes it precise. The average of a million readings is a very steady number that is as far from the truth as the converter\'s bias.',
    'More decimals mean a better meter — Digits beyond the resolution are noise or rounding; digits beyond the accuracy are fiction. Count the steps, not the zeros.'
  ],
  terms: [
    { term: 'Resolution', also: ['step size', 'LSB', 'least significant bit'], def: 'The smallest change of the input that changes the reading: for an n-bit converter the full-scale range divided by 2 to the power n. It says how finely the reading is divided, not how true it is.' },
    { term: 'Precision', also: ['repeatability', 'scatter'], def: 'How closely repeated readings of the same steady input agree with each other, usually the standard deviation of the readings. High precision with a large bias is a tight cluster on the wrong spot.' },
    { term: 'Accuracy', also: ['trueness', 'closeness to the truth'], def: 'How close a reading is to the true value of what is measured. It includes the systematic error (bias) and the scatter, and is judged against a reference that is better than the instrument.' },
    { term: 'Bias', also: ['systematic error', 'offset error', 'gain error'], def: 'The part of the error that is the same every time for a given input, such as an offset or a gain error. Averaging does not reduce it; calibration against a reference does.' },
    { term: 'False precision', also: ['spurious digits'], def: 'Showing more digits than the resolution, noise and accuracy of a measurement support, which suggests a certainty that the instrument does not have.' }
  ],
  sim: 'in-target',
  formulas: [
    {
      name: 'One step of a converter',
      expr: 'lsb = Vfs / 2^N',
      tex: '\\mathrm{lsb} = \\frac{V_{\\mathrm{fs}}}{2^{N}}',
      vars: {
        lsb: { name: 'size of one count', q: 'voltage', unit: 'mV', tex: '\\mathrm{lsb}' },
        Vfs: { name: 'full-scale voltage', q: 'voltage', unit: 'V', value: 3.1, min: 0, tex: 'V_{\\mathrm{fs}}' },
        N: { name: 'bits', q: 'count', value: 12, min: 1, int: true, tex: 'N' }
      },
      solveFor: 'lsb',
      note: 'The resolution of an ideal converter. Noise and non-linearity make the useful step larger: see the effective number of bits.',
      stories: { lsb: 'A {N}-bit converter measures up to {Vfs}. How large is one count?', N: 'A converter with a full scale of {Vfs} must resolve {lsb}. How many bits does it need?' }
    },
    {
      name: 'Error band of a reading',
      expr: 'err = a * x + b * d',
      tex: 'e = a\\,x + b\\,d',
      vars: {
        err: { name: 'largest error', q: 'voltage', unit: 'mV', tex: 'e' },
        a: { name: 'gain error (share of the reading)', q: 'ratio', unit: '%', value: 1, min: 0, tex: 'a' },
        x: { name: 'reading', q: 'voltage', unit: 'mV', value: 1650, min: 0, tex: 'x' },
        b: { name: 'counts of error', q: 'count', value: 2, min: 0, tex: 'b' },
        d: { name: 'size of one count', q: 'voltage', unit: 'mV', value: 0.8, min: 0, tex: 'd' }
      },
      solveFor: 'err',
      note: 'The way a meter\'s specification is written: ± (a % of the reading + b counts). The first part grows with the reading, the second is fixed.',
      stories: { err: 'A meter is specified as ± ({a} of reading + {b} counts), a count being {d}. How far can a reading of {x} be off?' }
    }
  ],
  code: [
    {
      title: 'The three numbers of your own converter',
      about: 'Reads a steady voltage 200 times and prints the mean, the error against a reference you measured with a multimeter (accuracy), the standard deviation (precision) and the spread from the lowest to the highest reading. The resolution is one count of the converter, the step of the readings.',
      needs: 'An ESP32 DevKit (or any chip with a pin on ADC1), two 10 kΩ resistors for a half-supply voltage, 100 nF and a multimeter.',
      wiring: [['3V3', '10 kΩ → GPIO34'], ['GPIO34', '10 kΩ → GND', 'the pin sits at about 1.65 V'], ['GPIO34', '100 nF → GND', 'steadies the reading'], ['multimeter', 'between GPIO34 and GND', 'type its reading into the program']],
      blocks: `
        when started
          start serial at (115200) baud
          set [reference v] to (1650)    // what the multimeter reads at the pin, in millivolts
        forever
          make list [mv v]
          repeat (200)
            add (analog read pin (34) in millivolts) to [mv v]
          end
          set [total v] to (0)
          for each [x v] in (mv)
            change [total v] by (x)
          end
          set [mean v] to ((total) / (200))
          set [squares v] to (0)
          for each [x v] in (mv)
            change [squares v] by (((x) - (mean)) * ((x) - (mean)))
          end
          set [sd v] to (square root of ((squares) / (199)))
          print (join [mean ] (mean) [ mV   error ] ((mean) - (reference)) [ mV   scatter ] (sd) [ mV   spread ] ((largest of [mv v]) - (smallest of [mv v])) [ mV])
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                 // an ADC1 pin: ESP32 GPIO32…39, S3 GPIO1…10, C3 GPIO0…4
        const float REFERENCE_MV = 1650.0;      // what the multimeter reads at the pin, in millivolts
        const int N = 200;
        int mv[N];

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(ADC_PIN, ADC_11db);
        }

        void loop() {
          long total = 0;
          int lo = 100000, hi = 0;
          for (int i = 0; i < N; i++) {
            mv[i] = analogReadMilliVolts(ADC_PIN);
            total += mv[i];
            lo = min(lo, mv[i]);
            hi = max(hi, mv[i]);
          }
          float mean = total / (float)N;
          float squares = 0;
          for (int i = 0; i < N; i++) squares += (mv[i] - mean) * (mv[i] - mean);
          float sd = sqrt(squares / (N - 1));    // the scatter: precision
          Serial.printf("mean %.1f mV   error %+.1f mV   scatter %.2f mV   spread %d mV\n",
                        mean, mean - REFERENCE_MV, sd, hi - lo);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import math
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # an ADC1 pin
        REFERENCE_MV = 1650.0                     # what the multimeter reads at the pin, in millivolts
        N = 200

        while True:
            mv = [adc.read_uv() / 1000 for _ in range(N)]    # microvolts to millivolts
            mean = sum(mv) / N
            squares = sum((x - mean) * (x - mean) for x in mv)
            sd = math.sqrt(squares / (N - 1))                # the scatter: precision
            print("mean %.1f mV   error %+.1f mV   scatter %.2f mV   spread %d mV"
                  % (mean, mean - REFERENCE_MV, sd, max(mv) - min(mv)))
            time.sleep(2)
      `,
      output: `
        mean 1642.1 mV   error -7.9 mV   scatter 2.31 mV   spread 14 mV
        mean 1642.4 mV   error -7.6 mV   scatter 2.18 mV   spread 12 mV
      `,
      notes: ['The numbers are an illustration. The error is the bias: it hardly changes between lines, while the scatter and the spread belong to the noise.', 'Averaging 200 readings cuts the scatter of the mean to about a fourteenth (the square root of 200); the error does not move at all.', 'Repeat with a divider that gives about 0.4 V and another at about 2.2 V: the error changes along the range, which is why one reference point is not a calibration.']
    }
  ],
  examples: [
    {
      title: 'How many digits to show',
      q: 'A converter has a step of 0.8 mV, a scatter of 2 mV and a bias of up to 15 mV after the factory calibration. A program shows 1.65374 V. Which digits are worth showing?',
      steps: ['The step (0.8 mV) would allow 1.654 V, three decimals.', 'The scatter of 2 mV, before averaging, already blurs the third decimal; averaging 64 readings reduces it to $2/\\sqrt{64} = 0.25$ mV.', 'The bias of up to 15 mV, however, makes the second decimal doubtful: the truth may be anywhere in 1.65 ± 0.015 V.'],
      a: 'Show 1.65 V, and state that it is good to about ±0.02 V. The third and later decimals are scatter and rounding, and the converter\'s bias is larger than all of them.'
    }
  ],
  quiz: [
    { q: 'An ESP reads a steady 1.000 V as 1.043 V, 1.044 V, 1.043 V, 1.042 V. Which description is right?', choices: ['Accurate and precise', 'Precise but not accurate', 'Accurate but not precise', 'Neither precise nor accurate'], a: 1, why: 'The readings agree within 2 mV, so the scatter is small: precise. They are all 43 mV above the truth: a bias, so not accurate. Calibration would fix it.' },
    { q: 'You average 10 000 readings of a converter with a 20 mV offset. What happens to the offset?', choices: ['It shrinks by 100 times', 'It disappears', 'It stays 20 mV', 'It doubles'], a: 2, why: 'Averaging reduces random noise by the square root of the number of readings. An offset is the same in every reading, so averaging leaves it untouched.' },
    { q: 'A converter has 12 bits and a full scale of 3.3 V. How large is one count?', choices: ['0.8 mV', '3.3 mV', '0.08 mV', '8 mV'], a: 0, why: '3.3 V divided by 4096 is 0.81 mV.' },
    { q: 'A meter is specified as ±(1 % of reading + 2 counts), a count being 1 mV. What is the largest error at 2.000 V?', choices: ['2 mV', '20 mV', '22 mV', '4 mV'], a: 2, why: '1 % of 2000 mV is 20 mV, and 2 counts add 2 mV: 22 mV.' }
  ],
  applications: [
    'Deciding whether the ESP\'s own converter is good enough for a battery gauge, a thermometer or a load cell.',
    'Reading a datasheet or a multimeter specification and knowing what the figures promise.',
    'Choosing how many digits to print on a display or in a log.',
    'Comparing an inexpensive converter module with a better one on the same footing.'
  ],
  sources: [
    'JCGM 200, *International Vocabulary of Metrology* (VIM): the definitions of accuracy, trueness, precision and resolution.',
    'Espressif, *ESP32 Series Datasheet*, ADC characteristics; and the ESP-IDF Programming Guide chapter on the ADC.',
    'Horowitz and Hill, *The Art of Electronics*: the chapters on analogue-to-digital conversion and on noise.'
  ]
},

/* ================================================================ the ESP as a voltmeter */
{
  id: 'esp-as-a-voltmeter',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a voltmeter',
  level: 2,
  short: 'A voltmeter is an ADC with a front end: ranges, an input resistance that does not disturb the circuit, protection, a calibration and a display. The ESP supplies the converter and the display; you build the rest, and you must know what it cannot do.',
  keywords: ['voltmeter', 'multimeter', 'input resistance', 'input impedance', 'meter loading', 'ranges', 'auto-range', 'divider', 'calibration', 'common ground', 'differential', 'ADS1115', 'DC voltage', 'min max', 'hold', 'clamp', 'protection'],
  prereq: ['measuring-voltage', 'adc-attenuation-and-calibration', 'accuracy-resolution-precision'],
  related: ['voltage-dividers-for-inputs', 'external-adc-and-dac', 'op-amps-for-sensors', 'uncertainty-and-calibration', 'the-multimeter', 'measuring-battery-level', 'electronics:multimeter', 'electronics:meter-loading'],
  body: `[[measuring-voltage]] showed how to bring a voltage into the converter's range. A **voltmeter** asks more: that it covers several ranges, that it does not change the voltage it measures, that it survives mistakes, that it is calibrated and that its number can be read. Here is how an ESP fares on each.

### Ranges and resolution

The converter reaches about 2.4 V without trouble (the original ESP32 is specified from 0.15 to 2.45 V and keeps reading to about 3.1 V, less and less accurately). A divider moves that window: each range has its own ratio, and the step grows by the same factor.

| Range | Front end | One count (about) | Input resistance |
|---|---|---|---|
| 0 to 2.4 V | direct, 10 kΩ series, clamp diodes | 0.8 mV | very high (pin leakage) |
| 0 to 12 V | 330 kΩ over 82 kΩ | 4 mV | about 410 kΩ |
| 0 to 30 V | 1 MΩ over 82 kΩ | 10 mV | about 1.08 MΩ |

A range switch (a switch that selects the pin) picks the front end. **Auto-ranging** reads on the widest range and steps down when the reading falls below a third of the narrower range's top, with a gap between the up and down thresholds so that it does not hunt.

### The meter must not disturb the circuit

A voltmeter in parallel with a source of resistance R_s reads low by the fraction $R_s / (R_s + R_{in})$. A common multimeter has 10 MΩ, and a divider of 1 MΩ is already ten times worse: measuring a 100 kΩ sensor divider with it makes a 9 % error. A larger divider needs the 100 nF at the pin and a longer settling wait ([[measuring-voltage]]), or a buffer op-amp ([[op-amps-for-sensors]]).

### Calibration and the display

Every range has its own gain and offset. Measure two known voltages per range with a trusted meter, compute both numbers and keep them in non-volatile storage ([[nvs-and-preferences]]); [[uncertainty-and-calibration]] shows how.
### What an ESP voltmeter cannot do

- **Float.** The input is single-ended: it measures against the ESP's own ground. To measure across a component that is not connected to ground you need a differential converter (the ADS1115 has differential inputs, [[external-adc-and-dac]]).
- **Negative voltages and AC.** Both need a bias network and, for AC, a sampling routine over whole cycles ([[hall-current-sensors]]).
- **Safety.** A board on USB is grounded through the computer, which is often earthed. Connect its ground to a mains-referenced point and you have made a short circuit.

> [!warn] Never connect this meter, or any ESP input, to mains voltage or to anything connected to it. A divider is not isolation. Measure mains with a certified instrument, or an isolated metering module inside a proper enclosure ([[mains-energy-monitoring]]).

> [!key] An ESP voltmeter is a converter plus a front end per range: pick the divider for the range, keep its resistance high compared with the source, calibrate each range with two points, and show only the digits one count allows. It reads one voltage against its own ground and never the mains.`,
  ideas: [
    'Each range is a divider ratio: the full scale grows by the ratio and so does the size of one count.',
    'The meter in parallel with a source reads low by R_s / (R_s + R_in): the input resistance of a good voltmeter is large compared with the circuits it checks.',
    'Every range has its own gain and offset: calibrate each with two reference voltages and keep the numbers in non-volatile storage.',
    'The input is single-ended and shares the ESP\'s ground: floating measurements need a differential converter, and mains needs isolation and a certified instrument.'
  ],
  pitfalls: [
    'Any divider will do for a voltmeter — Its resistance is the meter\'s load. A 100 kΩ divider across a 100 kΩ source halves the reading; a meter\'s input resistance should be ten times the source resistance or more.',
    'A calibration made on one range holds on the others — Each range has its own divider tolerance, so its own gain: calibrate each, with two points.',
    'The ESP can measure the voltage across any component — Only voltages relative to its own ground. A floating part needs a differential converter, or two readings subtracted, which loses resolution.'
  ],
  terms: [
    { term: 'Input resistance', also: ['input impedance', 'meter loading'], def: 'The resistance a meter presents to the circuit it measures. A low value draws current and pulls the measured voltage down; multimeters use about 10 MΩ.' },
    { term: 'Range', also: ['full scale', 'measuring range'], def: 'The span of input that a setting of the instrument can measure; a narrower range gives a smaller step and a wider one a larger step.' },
    { term: 'Auto-ranging', also: ['auto-range'], def: 'Choosing the range automatically from the reading: widen when the reading nears the top, narrow when it falls well below the next lower range, with a gap between the two thresholds.' },
    { term: 'Single-ended input', also: ['common ground', 'ground-referenced'], def: 'An input that measures a voltage against the instrument\'s own ground. It cannot measure across a floating component, which needs a differential input.' },
    { term: 'Differential input', also: ['floating measurement'], def: 'An input that measures the difference between two pins, whatever their voltage to ground within a stated range, as an external converter such as the ADS1115 can.' }
  ],
  choose: {
    good: ['A direct range plus one or two divider ranges for DC supplies, batteries and sensor outputs', 'Per-range calibration constants stored in the device', 'An external differential converter when a floating or millivolt-level measurement is needed'],
    avoid: ['Using the instrument on mains or on a circuit that is not isolated from it', 'A divider of low resistance across a high-resistance source', 'Showing digits finer than one count'],
    check: ['The source resistance of the circuit against the meter\'s input resistance', 'That the highest possible input, with spikes, is clamped before the pin', 'That a mistake of plugging the lead into the wrong range cannot damage the pin']
  },
  sim: 'in-voltmeter',
  code: [
    {
      title: 'A two-range DC voltmeter',
      about: 'Two inputs and a switch: the direct range (0 to 2.4 V) on GPIO34 and the 30 V range, through a 1 MΩ and 82 kΩ divider, on GPIO35. Every half second the program averages 64 readings of the chosen input, applies the range\'s gain and offset, and prints the voltage with the lowest and highest since the start.',
      needs: 'An ESP32 DevKit, a 1 MΩ and an 82 kΩ resistor, a 10 kΩ resistor, two Schottky diodes (1N5819 or similar) and 100 nF capacitors, a switch, two sockets for the test leads.',
      wiring: [['LOW socket +', '10 kΩ → GPIO34', 'with a Schottky diode from the pin to 3V3 (cathode) and one to GND (anode), and 100 nF to GND'], ['HIGH socket +', '1 MΩ → GPIO35', 'then 82 kΩ from GPIO35 to GND and 100 nF from GPIO35 to GND'], ['both sockets −', 'GND', 'the measured circuit shares this ground'], ['GPIO27', 'switch → GND', 'closed: the 30 V range, using the internal pull-up']],
      blocks: `
        define pin volts (pin) :: my
          set [total v] to (0)
          repeat (64)
            change [total v] by (analog read pin (pin) in millivolts)
            wait (0.0002) seconds
          end
          return (((total) / (64)) / (1000))

        when started
          start serial at (115200) baud
          set pin (27) as [input with pull-up v]
          set [gain v] to (1.000)       // found with the calibration of each range
          set [offset v] to (0.000)
          set [lowest v] to (1000)
          set [highest v] to (-1000)
        forever
          if <(read pin (27)) = [LOW v]> then
            set [volts v] to (((pin volts (35)) * (((1000000) + (82000)) / (82000))) * (gain) + (offset))
          else
            set [volts v] to (((pin volts (34)) * (gain)) + (offset))
          end
          set [lowest v] to (smaller of (lowest) and (volts))
          set [highest v] to (larger of (highest) and (volts))
          print (join [volts ] (volts) [   lowest ] (lowest) [   highest ] (highest))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int PIN_LOW = 34, PIN_HIGH = 35, RANGE_PIN = 27;   // two inputs and a switch to choose between them
        const float R_TOP = 1000000.0, R_BOTTOM = 82000.0;       // the divider of the high range
        const float GAIN[2] = {1.000, 1.000};                    // per range: found with the calibration page
        const float OFFSET_V[2] = {0.000, 0.000};
        const int SAMPLES = 64;
        float vMin = 1000, vMax = -1000;

        float pinVolts(int pin) {
          uint32_t sum = 0;
          for (int i = 0; i < SAMPLES; i++) {
            sum += analogReadMilliVolts(pin);
            delayMicroseconds(200);
          }
          return sum / (float)SAMPLES / 1000.0;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(RANGE_PIN, INPUT_PULLUP);                      // closed to ground: the 30 V range
        }

        void loop() {
          int range = digitalRead(RANGE_PIN) == LOW ? 1 : 0;
          float v = range ? pinVolts(PIN_HIGH) * (R_TOP + R_BOTTOM) / R_BOTTOM : pinVolts(PIN_LOW);
          v = v * GAIN[range] + OFFSET_V[range];
          vMin = min(vMin, v);
          vMax = max(vMax, v);
          Serial.printf("%s  %7.3f V   lowest %.3f   highest %.3f\n", range ? "30 V " : "2.4 V", v, vMin, vMax);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc_low = ADC(Pin(34), atten=ADC.ATTN_11DB)      # the direct range
        adc_high = ADC(Pin(35), atten=ADC.ATTN_11DB)     # the 30 V range, behind the divider
        switch = Pin(27, Pin.IN, Pin.PULL_UP)            # closed to ground: the 30 V range
        R_TOP, R_BOTTOM = 1000000.0, 82000.0             # the divider of the high range
        GAIN = (1.000, 1.000)                            # per range: found with the calibration page
        OFFSET_V = (0.000, 0.000)
        SAMPLES = 64
        v_min, v_max = 1000, -1000

        def pin_volts(adc):
            total = 0
            for _ in range(SAMPLES):
                total += adc.read_uv()
                time.sleep_us(200)
            return total / SAMPLES / 1e6

        while True:
            rng = 1 if switch.value() == 0 else 0
            if rng:
                v = pin_volts(adc_high) * (R_TOP + R_BOTTOM) / R_BOTTOM
            else:
                v = pin_volts(adc_low)
            v = v * GAIN[rng] + OFFSET_V[rng]
            v_min = min(v_min, v)
            v_max = max(v_max, v)
            print("%s  %7.3f V   lowest %.3f   highest %.3f" % ("30 V " if rng else "2.4 V", v, v_min, v_max))
            time.sleep_ms(500)
      `,
      output: `
        2.4 V    1.652 V   lowest 1.652   highest 1.652
        30 V    12.071 V   lowest 1.652   highest 12.071
      `,
      notes: ['The lowest and highest mix the two ranges after a change of switch: reset them in the program when the range changes if that matters.', 'On the 30 V range one count is about 10 mV, so the third decimal of the printout is noise. Round to 0.01 V.', 'The gain and offset are stored in the program for brevity. A real instrument keeps them in non-volatile storage so that the calibration survives an upload ([[nvs-and-preferences]]).']
    }
  ],
  examples: [
    {
      title: 'The meter that changes the circuit',
      q: 'A sensor with an output resistance of 100 kΩ is measured with the 30 V range of the meter above, whose input resistance is 1.082 MΩ. What does it read when the sensor really gives 2.000 V, and what would a 10 MΩ multimeter read?',
      steps: ['The meter and the sensor form a divider: the reading is $2.000 \\times R_{in} / (R_s + R_{in})$.', 'With 1.082 MΩ: $2.000 \\times 1.082 / 1.182 = 1.831$ V, a loss of 8.5 %.', 'With 10 MΩ: $2.000 \\times 10 / 10.1 = 1.980$ V, a loss of 1 %.'],
      a: 'The home-made meter reads 1.83 V instead of 2.00 V, and a good multimeter 1.98 V. Use the direct range, whose input resistance is far higher, or a buffer.'
    }
  ],
  quiz: [
    { q: 'You measure the output of a 100 kΩ divider with a meter of 1 MΩ input resistance. How much too low does it read?', choices: ['About 0.1 %', 'About 1 %', 'About 9 %', 'About 50 %'], a: 2, why: 'The meter loads the divider: the reading falls by R_s / (R_s + R_in) = 100 / 1100 = 9 %.' },
    { q: 'On the 30 V range, one count of a 3.1 V full-scale converter is about:', choices: ['0.8 mV', '10 mV', '100 mV', '1 V'], a: 1, why: 'The divider ratio is about 0.076, so the 0.76 mV count at the pin stands for roughly 10 mV at the input.' },
    { q: 'The ESP can measure the voltage across a resistor in a circuit whose other parts are not connected to the ESP\'s ground.', a: false, why: 'The input is single-ended and refers to the ESP\'s ground. Across a floating resistor you need a differential converter, or both ends measured against ground and subtracted.' },
    { q: 'Why does an auto-ranging meter need a gap between the "range up" and "range down" thresholds?', choices: ['To save current', 'So that a reading near the limit does not make it hunt between two ranges', 'To keep the display steady in the dark', 'Because the converter has two halves'], a: 1, why: 'With one threshold, a reading that sits on it would flip the range at every sample. A gap (hysteresis) makes it switch once and stay.' }
  ],
  applications: [
    'A bench voltmeter with a bar graph for a power supply you built.',
    'A battery tester for a car, a bicycle or a solar system.',
    'Monitoring several supply rails of a product, and logging them ([[esp-as-a-data-logger]]).',
    'A teaching instrument that shows what each stage of a real multimeter does.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: absolute maximum ratings and ADC characteristics.',
    'Espressif, *ESP-IDF Programming Guide*, ADC chapter: oneshot mode, calibration and the advice on source impedance.',
    'Horowitz and Hill, *The Art of Electronics*: the sections on meters, loading and input protection.'
  ]
},

/* ================================================================ the ESP as an oscilloscope */
{
  id: 'esp-as-an-oscilloscope',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as an oscilloscope',
  level: 2,
  short: 'Sample a voltage again and again, line the pictures up with a trigger and draw them: that is an oscilloscope. An ESP can do it for slow and audio-range signals, and it will draw false pictures of faster ones unless you respect the sampling rule.',
  keywords: ['oscilloscope', 'sampling', 'sample rate', 'aliasing', 'Nyquist', 'trigger', 'time base', 'bandwidth', 'continuous ADC', 'DMA', 'analogRead speed', 'anti-alias filter', 'AC coupling', 'bias', 'serial plotter', 'trace'],
  prereq: ['the-esp-adc', 'accuracy-resolution-precision', 'rc-filters-and-debounce'],
  related: ['analog-input', 'oversampling-and-noise', 'fft-and-spectrum', 'esp-as-a-logic-analyser', 'the-oscilloscope', 'hardware-timers', 'electronics:oscilloscope', 'electronics:sampling-nyquist'],
  body: `An oscilloscope draws a voltage against time. Inside it is nothing more than a fast converter, a memory and a **trigger** that decides where each picture starts, so that a repeating signal shows as one steady picture instead of a smear. An ESP has the converter and the memory. The question is how fast the converter can go, and what the picture means when it cannot go fast enough.

### The sampling rule

A signal is seen faithfully only if it is sampled **more than twice per period** at the very least (the Nyquist limit), and to see its *shape*, five to ten samples per period are needed. A sine of 1 kHz sampled at 5 kHz is drawn with five points per cycle: recognisable. Sampled at 1.2 kHz it is drawn as a slow wave of 200 Hz that does not exist: an **alias**. The simulation shows both.

The cure is a low-pass filter in front of the pin, with its corner below half the sample rate, so that what cannot be sampled is removed before sampling ([[rc-filters-and-debounce]]). A scope that lacks it shows false pictures without warning.

### How fast is an ESP?

- **One reading at a time** with \`analogRead\` or \`analogReadMilliVolts\` in a loop: each call takes tens of microseconds, so tens of kilosamples a second at best, and it varies with the chip, the library and the load of the processor. The program below measures what your board achieves.
- **Continuous mode**: the ADC driver samples by itself at a rate you set and fills a buffer by DMA, with no timing work for the processor. This is the right tool, and the highest rate depends on the chip: look it up in the ADC chapter of the ESP-IDF Programming Guide for yours ([[analog-input]]).

Either way the result is an oscilloscope for **audio-range signals**, supply ripple at hundreds of hertz and slow transients, not for a 20 kHz PWM edge or a data bus.

### The front end

The converter reads 0 to about 2.4 V, so a signal that swings around zero needs a **bias**: two equal resistors from 3.3 V to ground and a capacitor to couple the signal in, which moves the picture to the middle of the range (AC coupling). A signal larger than the range needs an attenuator, as a x10 probe has. And every vertical step is an ADC count with noise: expect eight to ten useful bits ([[the-esp-adc]]).

### The trigger and the display

A software trigger looks for the first sample that crosses a level going up, and starts the picture there. Capture twice as many samples as you show, so that the trigger can be found in the first half. To see the trace, print it as lines of time and value to a serial plotter or a spreadsheet, draw it on a display ([the display lab](#/tools/displaylab)), or send it to a web page ([[web-ui-as-a-display]]).

> [!key] An ESP scope is a converter, a buffer and a trigger. It is honest for signals well below its sampling rate, filtered before the pin; above half the rate it draws aliases that look real. Measure your own sample rate, filter first, and use continuous mode for anything quick.`,
  ideas: [
    'A signal must be sampled more than twice per period to be seen at all, and five to ten times to be seen in shape.',
    'Above half the sample rate a signal appears as a false, slower one (an alias); a low-pass filter in front of the pin removes it before it is sampled.',
    'Reading in a loop gives tens of kilosamples a second at best; the continuous (DMA) mode of the ADC driver is faster, and its limit depends on the chip.',
    'A trigger starts each picture at the same point of the wave, so that a repeating signal looks steady; capture more than you show so that it can be found.'
  ],
  pitfalls: [
    'The trace shows what the signal does — It shows what the samples say. A signal faster than half the sample rate is drawn as a slower wave that is not there.',
    'A higher sample rate always means a better scope — Past the converter\'s own settling time and noise, more samples add no information. Sampling at 1 MS/s a source of high resistance without a capacitor at the pin shows only distortion.',
    'The ESP can show a PWM or data signal like a real scope — The converter cannot follow edges of microseconds. For digital signals use a logic analyser ([[esp-as-a-logic-analyser]]).'
  ],
  terms: [
    { term: 'Sample rate', also: ['sampling frequency', 'samples per second', 'kS/s'], def: 'The number of readings taken each second, in samples per second or kilosamples per second (kS/s). It sets the highest signal frequency that can be shown.' },
    { term: 'Nyquist limit', also: ['Nyquist frequency', 'sampling theorem'], def: 'Half the sample rate: the highest frequency that can be represented. A signal above it is not lost but misread as a lower frequency.' },
    { term: 'Aliasing', also: ['alias'], def: 'The appearance of a signal above the Nyquist limit as a false signal of lower frequency, because the samples cannot tell the two apart. A filter before the converter prevents it.' },
    { term: 'Trigger', also: ['trigger level', 'trigger edge'], def: 'The rule that decides where each captured picture starts, usually the first rising crossing of a chosen level, so that repeating signals look steady.' },
    { term: 'Bias', also: ['DC offset', 'AC coupling'], def: 'A fixed voltage, usually half the supply, added to a signal that swings around zero so that it stays within the converter\'s range; a capacitor couples the signal in.' }
  ],
  choose: {
    good: ['Audio-range signals, mains-frequency waveforms (through a safe sensor) and slow transients', 'The continuous ADC mode with a filter in front, for signals of tens of kilohertz', 'A trace sent to a plotter or a web page for looking at a slow process'],
    avoid: ['PWM edges, data buses and anything with fast edges', 'Signals above half the sample rate with no filter', 'Connecting a probe to mains or to a circuit not isolated from it'],
    check: ['The sample rate your board really achieves, measured', 'That the signal stays inside 0 to about 2.4 V with its bias', 'That a filter corner sits below half the sample rate']
  },
  sim: 'in-scope',
  code: [
    {
      title: 'Capture, trigger and print a trace',
      about: 'Reads 800 samples as fast as the converter allows, measures how long that took (so the real sample rate is known), finds the first rising crossing of mid-scale in the first half and prints 400 points as lines of time in microseconds and counts. Paste the lines into a spreadsheet, or into a plotter.',
      needs: 'An ESP32 DevKit and a signal between 0 and 3.3 V, a few hundred hertz to a few kilohertz: the board\'s own PWM through an RC filter, a signal generator, a potentiometer wiggled by hand.',
      wiring: [['signal', 'GPIO34', '0 to 3.3 V only; for a signal that swings around zero add the bias of the page'], ['signal ground', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          make list [samples v]
          set [t0 v] to (microseconds since start)
          repeat (800)
            add (analog read pin (34)) to [samples v]
          end
          set [step v] to ((((microseconds since start) - (t0))) / (800))
          set [start v] to (1)
          for each [i v] in (numbers 2 to 400)
            if <<(item ((i) - (1)) of [samples v]) < (2048)> and <(item (i) of [samples v]) ≥ (2048)>> then
              set [start v] to (i)
              stop [this script v]
            end
          end
          print (join [# microseconds per sample: ] (step))
          for each [i v] in (numbers 0 to 399)
            print (join ((i) * (step)) [,] (item ((start) + (i)) of [samples v]))
          end
          wait (3) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;
        const int N = 400;                    // points shown; twice as many are captured
        const int LEVEL = 2048;               // trigger level in counts: mid-scale
        uint16_t buf[2 * N];

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          uint32_t t0 = micros();
          for (int i = 0; i < 2 * N; i++) buf[i] = analogRead(ADC_PIN);   // as fast as the converter allows
          float us = (micros() - t0) / (2.0 * N);                          // microseconds per sample
          int start = 0;                                                   // the first rising crossing of LEVEL
          for (int i = 1; i < N; i++) {
            if (buf[i - 1] < LEVEL && buf[i] >= LEVEL) { start = i; break; }
          }
          Serial.printf("# %.1f us per sample = %.1f kS/s\n", us, 1000.0 / us);
          for (int i = 0; i < N; i++) Serial.printf("%.1f,%u\n", i * us, buf[start + i]);
          delay(3000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        from array import array
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)
        N = 400                               # points shown; twice as many are captured
        LEVEL = 2048                          # trigger level in counts: mid-scale
        buf = array("H", [0] * (2 * N))

        while True:
            t0 = time.ticks_us()
            for i in range(2 * N):
                buf[i] = adc.read_u16() >> 4                         # 16-bit reading to 12 bits
            us = time.ticks_diff(time.ticks_us(), t0) / (2 * N)      # microseconds per sample
            start = 0                                                # the first rising crossing of LEVEL
            for i in range(1, N):
                if buf[i - 1] < LEVEL and buf[i] >= LEVEL:
                    start = i
                    break
            print("# %.1f us per sample = %.1f kS/s" % (us, 1000 / us))
            for i in range(N):
                print("%.1f,%d" % (i * us, buf[start + i]))
            time.sleep(3)
      `,
      output: `
        # 41.3 us per sample = 24.2 kS/s
        0.0,2051
        41.3,2288
        82.6,2509
      `,
      notes: ['The figures are an example: the first line is the sample rate your own board achieves, and MicroPython will report a much lower one than C++.', 'The counts are raw and uncalibrated, which is fine for the shape of a wave. For true voltages use the calibrated millivolt functions, which are slower.', 'The samples are not evenly spaced when the processor is interrupted (by Wi-Fi, for instance). For even spacing use the continuous ADC mode, which paces the converter in hardware.']
    }
  ],
  examples: [
    {
      title: 'Is the picture true?',
      q: 'A scope built on an ESP samples at 20 kS/s. It shows a clean sine on the screen with a period of 2.5 ms. The signal is a 19.6 kHz tone from a sensor. What is happening, and what fixes it?',
      steps: ['The Nyquist limit is 10 kHz. The tone at 19.6 kHz is above it, so it is aliased.', 'The apparent frequency is the distance to the nearest multiple of the sample rate: $|19.6 - 20| = 0.4$ kHz, a period of 2.5 ms.', 'The picture is a clean, steady and completely false 400 Hz sine.'],
      a: 'The display shows an alias at 400 Hz. A low-pass filter with its corner near 5 kHz in front of the pin removes the 19.6 kHz tone before it is sampled; a higher sample rate would show the real signal.'
    }
  ],
  quiz: [
    { q: 'A 1 kHz sine is sampled at 1.2 kS/s without a filter. What does the trace show?', choices: ['A 1 kHz sine, coarse', 'A 200 Hz sine that is not in the signal', 'Nothing, a flat line', 'A 2.2 kHz sine'], a: 1, why: 'The signal is above the Nyquist limit of 600 Hz, so it aliases to |1000 − 1200| = 200 Hz.' },
    { q: 'What is the job of the low-pass filter in front of a sampling input?', choices: ['To reduce the noise of the supply', 'To remove frequencies above half the sample rate before they can alias', 'To raise the resolution', 'To protect the pin from overvoltage'], a: 1, why: 'Once a high frequency has been sampled it cannot be told from a low one. The filter removes it first.' },
    { q: 'Reading the ADC in a plain loop is the best way to capture a 50 kHz signal on an ESP.', a: false, why: 'A loop gives tens of kilosamples a second at best, with uneven spacing. The continuous mode of the ADC driver paces the converter in hardware and goes faster, and even then the limit depends on the chip.' },
    { q: 'Why does the program capture 800 samples to show 400?', choices: ['The converter needs warming up', 'So the trigger can be found in the first half and a whole picture still follows it', 'Because the buffer must be a power of two', 'To average pairs of samples'], a: 1, why: 'The picture starts at the first trigger crossing, which can be anywhere in the first half. Capturing twice as many guarantees 400 samples after it.' }
  ],
  applications: [
    'Looking at supply ripple, a slow transient or a sensor\'s analogue output while a project is being built.',
    'An audio level meter or a simple waveform display for sound in the audible range ([[fft-and-spectrum]]).',
    'A mains-frequency waveform seen through an isolated transformer or sensor module ([[hall-current-sensors]]).',
    'Teaching sampling and aliasing with real hardware.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ADC chapter: continuous mode, its sampling frequency limits per chip and the conversion frame format.',
    'Arduino core for ESP32 documentation, ADC API (analogRead, analogReadMilliVolts and the continuous functions).',
    'Oppenheim and Schafer, *Discrete-Time Signal Processing*: the sampling theorem and aliasing.'
  ]
},

/* ================================================================ the ESP as a logic analyser */
{
  id: 'esp-as-a-logic-analyser',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a logic analyser',
  level: 2,
  short: 'A logic analyser records several digital lines against time and decodes what they carry. An ESP can watch slow buses by polling, time-stamp the edges of sparse signals with interrupts, and use its capture hardware for faster ones: a modest analyser with honest limits.',
  keywords: ['logic analyser', 'logic analyzer', 'polling', 'sample rate', 'edge time stamp', 'RMT receiver', 'I2S parallel', 'baud rate detection', 'protocol decoder', 'UART sniffer', 'I2C sniffer', 'sigrok', 'PulseView', 'trigger', 'capture buffer', 'level shifting', 'glitch'],
  prereq: ['digital-input', 'interrupts', 'serial-communication-basics'],
  related: ['the-logic-analyser', 'esp-as-an-oscilloscope', 'the-rmt-peripheral', 'uart', 'i2c', 'i2c-addresses-and-scanning', 'three-volt-logic', 'electronics:logic-basics'],
  body: `A logic analyser is an oscilloscope that has given up the shades of grey: every line is either high or low, and in return it can watch eight or sixteen lines at once, for a long time, and turn the wiggles into bytes: "this was an I2C write of 0x80 to address 0x48". Debugging a bus without one is guessing. An ESP can play the part for slow and moderate signals.

### Three ways to record

- **Polling.** A tight loop reads the pins and notes the time whenever something changed. Simple, and it works for lines of up to a few hundred kilohertz in C++, and much less in MicroPython. The weakness is the loop itself: whenever the processor does something else (the Wi-Fi stack, a timer) samples are missing, so the spacing is uneven. The program below prints how many edges it caught and how short the shortest was.
- **An interrupt per edge** stamps the time of each change with \`micros()\`. It records only changes, so a quiet line costs nothing, and a long capture fits in a small buffer. The interrupt starts a few microseconds late and not always the same number.
- **Hardware capture.** The receiver of the RMT peripheral records how long each high and low run lasts, with a resolution of tens of nanoseconds and a glitch filter, without the processor ([[the-rmt-peripheral]]). Peripherals made for cameras and displays (the parallel input of I2S on the original ESP32, the camera interface of other chips) can clock eight or sixteen pins into memory by DMA at a steady rate, which some open-source logic analysers use. These are the way to higher speeds, and they take more work.

### The sampling rule

A digital signal's edge is placed only to within one sample. To decode a UART at 115 200 baud (a bit lasts 8.7 µs) you want several samples per bit, say four, which is a sample every 2 µs. For I2C at 400 kHz the same rule asks for a rate of several megahertz. If the rate is too low, the analyser does not say so: it shows clean, wrong bytes. The simulation lets you lower the sample rate and watch the decoder fail.

### What it cannot do

- **5 V and other levels.** The pins accept 3.3 V; a 5 V line needs a level shifter or a divider first ([[three-volt-logic]]). The threshold is fixed by the chip: you cannot set it as a bench analyser can.
- **Pre-trigger and long captures.** Memory is a few hundred kilobytes at best. A ring buffer lets a software trigger show what came before it.
- **Loading.** A long lead and the pin's capacitance load a fast line.

A cheap USB logic analyser with eight channels and tens of megahertz costs less than the time to write all of this; the ESP is the right choice when the capture must sit inside the product, or the decoding must act on what it sees ([[the-logic-analyser]]). Listen only to buses you are entitled to examine.

> [!key] An ESP logic analyser samples by polling, by interrupt time stamps or by capture hardware. Sample several times faster than the fastest edge you must place, or the decoder prints clean, wrong bytes; keep to 3.3 V, and use a real analyser when speed or many channels matter.`,
  ideas: [
    'A logic analyser records many digital lines against time and decodes the bytes that they carry.',
    'Polling and interrupts suit slow lines; the RMT receiver and the parallel input of I2S or the camera interface record faster ones without the processor.',
    'To decode a bus, sample several times per bit: at too low a rate a decoder gives clean, wrong answers.',
    'The pins accept 3.3 V only, have a fixed threshold and limited memory: a bench analyser still wins on speed and channels.'
  ],
  pitfalls: [
    'A digital signal can be sampled at any rate — An edge is placed to within one sample, and a pulse shorter than a sample can vanish. Sample at least four times per bit.',
    'A polling loop records every change — Whenever the processor is busy with something else, changes are missed or stamped late. Disable the Wi-Fi, use an interrupt or use capture hardware when it matters.',
    'A 5 V bus can be watched directly with an input pin — The pins are 3.3 V devices. A 5 V line needs a level shifter or divider, or the pin is damaged.'
  ],
  terms: [
    { term: 'Logic analyser', also: ['logic analyzer', 'protocol analyser'], def: 'An instrument that records several digital lines against time and shows them as traces, usually with decoders that turn the traces of a bus into bytes and fields.' },
    { term: 'Polling', also: ['busy-wait sampling'], def: 'Reading a pin over and over in a loop to see whether it changed. Simple, but it occupies the processor and misses changes when the processor is busy with something else.' },
    { term: 'Decoder', also: ['protocol decoder'], def: 'Software that turns a recorded set of digital traces into the bytes and fields of a protocol such as UART, I2C or SPI, by sampling at the instants the protocol defines.' },
    { term: 'Capture buffer', also: ['sample memory', 'ring buffer'], def: 'The memory that holds the recorded samples. Its size, with the sample rate, sets how long a capture can be; a ring buffer keeps the latest samples so that a trigger can show what came before it.' },
    { term: 'Time stamp', also: ['edge time stamp'], def: 'The recorded time of an edge, taken from a timer when the edge arrives. Recording only the edges of a sparse signal needs far less memory than recording every sample.' }
  ],
  choose: {
    good: ['Polling or edge time stamps for slow buses and for finding a baud rate', 'The RMT receiver for single-wire protocols and remote-control signals', 'A decoder built into the product when it must react to what it sees'],
    avoid: ['Polling with Wi-Fi busy, for anything where a missed edge matters', 'Connecting 5 V lines straight to the pins', 'An ESP for a 24 MHz or eight-channel job: buy an analyser'],
    check: ['Your sample interval against the shortest pulse you must see', 'The logic levels of the line and a common ground', 'How long a capture the memory can hold at that rate']
  },
  sim: 'in-logic',
  code: [
    {
      title: 'Find the baud rate of a serial line',
      about: 'Watches one line for two seconds, time-stamps every change by polling, finds the shortest interval between two changes (that is one bit time) and turns it into a baud rate, which it rounds to the nearest standard rate. Connect it to the transmit line of any UART device to learn what speed that device uses.',
      needs: 'An ESP32 DevKit and a UART transmit line at 3.3 V that sends something (a GPS module, a sensor, another board).',
      wiring: [['TX of the device', 'GPIO16', '3.3 V levels only; a 5 V transmit line needs a divider'], ['device ground', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (16) as [input v]
        forever
          make list [stamps v]
          set [last v] to (read pin (16))
          set [start v] to (microseconds since start)
          repeat until <<(length of [stamps v]) ≥ (600)> or <((microseconds since start) - (start)) ≥ (2000000)>>
            if <(read pin (16)) ≠ (last)> then
              add (microseconds since start) to [stamps v]
              set [last v] to (read pin (16))
            end
          end
          set [shortest v] to (smallest gap between neighbours in [stamps v])
          set [guess v] to ((1000000) / (shortest))
          print (join (length of [stamps v]) [ edges, shortest ] (shortest) [ us = ] (guess) [ baud, nearest standard ] (nearest standard rate to (guess)))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int LINE_PIN = 16;                       // the line to watch: idle high
        const int MAX_EDGES = 600;
        const uint32_t WATCH_US = 2000000;             // watch for two seconds
        const uint32_t RATES[] = {1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600};
        uint32_t stamp[MAX_EDGES];

        void setup() {
          Serial.begin(115200);
          pinMode(LINE_PIN, INPUT);
        }

        void loop() {
          int n = 0, last = digitalRead(LINE_PIN);
          uint32_t start = micros();
          while (n < MAX_EDGES && micros() - start < WATCH_US) {   // poll as fast as the loop goes
            int now = digitalRead(LINE_PIN);
            if (now != last) { stamp[n++] = micros(); last = now; }
          }
          if (n < 2) { Serial.println("no activity on the line"); delay(1000); return; }
          uint32_t shortest = 0xFFFFFFFF;
          for (int i = 1; i < n; i++) shortest = min(shortest, stamp[i] - stamp[i - 1]);
          float guess = 1e6 / shortest;                            // one bit lasts 'shortest' microseconds
          uint32_t nearest = RATES[0];
          for (uint32_t r : RATES) if (fabs((float)r - guess) < fabs((float)nearest - guess)) nearest = r;
          Serial.printf("%d edges, shortest %lu us = %.0f baud, nearest standard %lu\n", n, (unsigned long)shortest, guess, (unsigned long)nearest);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LINE_PIN = 16                                  # the line to watch: idle high
        MAX_EDGES = 600
        WATCH_US = 2000000                             # watch for two seconds
        RATES = (1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600)
        line = Pin(LINE_PIN, Pin.IN)

        while True:
            stamp = []
            last = line.value()
            start = time.ticks_us()
            while len(stamp) < MAX_EDGES and time.ticks_diff(time.ticks_us(), start) < WATCH_US:
                now = line.value()                     # poll as fast as the loop goes
                if now != last:
                    stamp.append(time.ticks_us())
                    last = now
            if len(stamp) < 2:
                print("no activity on the line")
                time.sleep(1)
                continue
            shortest = min(time.ticks_diff(stamp[i], stamp[i - 1]) for i in range(1, len(stamp)))
            guess = 1e6 / shortest                     # one bit lasts 'shortest' microseconds
            nearest = min(RATES, key=lambda r: abs(r - guess))
            print("%d edges, shortest %d us = %.0f baud, nearest standard %d" % (len(stamp), shortest, guess, nearest))
            time.sleep(1)
      `,
      output: `
        312 edges, shortest 104 us = 9615 baud, nearest standard 9600
        298 edges, shortest 104 us = 9615 baud, nearest standard 9600
      `,
      notes: ['The shortest interval between changes is one bit when the data holds at least one single-bit run, which nearly all text does. Trust the result only if it repeats.', 'MicroPython polls much more slowly than C++: use it on slow lines, and distrust a guess that comes out as a round multiple of its own loop time.', 'The line must idle high, as a UART does. An RS-232 line (plus and minus 12 V) needs a level converter, never a divider.']
    }
  ],
  examples: [
    {
      title: 'How fast must the analyser sample?',
      q: 'You want to decode an I2C bus at 400 kHz and be able to place the SCL edges to within a tenth of a clock period. What sample rate does that call for, and what can a polling loop of 1 µs per pass do?',
      steps: ['A clock period is 2.5 µs; a tenth of it is 0.25 µs, which means a sample every 0.25 µs: 4 MS/s.', 'A polling loop that takes 1 µs per pass samples at 1 MS/s: 2.5 samples per clock period.', 'Two and a half samples per period is enough to see that a clock exists, and not enough to decode the data reliably: the data line changes between the samples.'],
      a: 'It needs about 4 MS/s. Polling at 1 MS/s is borderline for 400 kHz and fine for 100 kHz I2C; for more, use a capture peripheral or a real analyser.'
    }
  ],
  quiz: [
    { q: 'A UART runs at 115 200 baud, so one bit lasts 8.7 µs. A sensible sample interval for decoding is:', choices: ['8.7 µs (one sample per bit)', 'About 2 µs (several samples per bit)', '100 µs', 'Any: the signal is digital'], a: 1, why: 'The decoder needs several samples per bit to find the middle of each bit and to survive a little jitter. One sample per bit lets the edges slip across the sampling instants.' },
    { q: 'A polling loop on an ESP with Wi-Fi running gives perfectly even sample spacing.', a: false, why: 'Whenever the processor serves the Wi-Fi stack or an interrupt, the loop pauses: samples are late or missing. Hardware capture or interrupt time stamps are the dependable ways.' },
    { q: 'Which ESP peripheral records how long each high and low run lasts without help from the processor?', choices: ['The DAC', 'The receiver of the RMT peripheral', 'The touch sensor', 'The ADC'], a: 1, why: 'The RMT receiver stores the duration of every run with a clock of tens of nanoseconds, which is how infrared signals and similar single-wire protocols are captured.' },
    { q: 'You want to watch a 5 V I2C bus with an ESP input. What comes first?', choices: ['Connect it directly: I2C uses little current', 'A level shifter or divider so the pin sees 3.3 V at most', 'Nothing: ESP pins tolerate 5 V', 'A pull-up to 5 V on the pin'], a: 1, why: 'ESP pins are not 5 V tolerant. A level shifter, or a pair of resistors for a one-way tap, keeps the pin within 3.3 V.' }
  ],
  applications: [
    'Finding the baud rate and the framing of an unknown serial device.',
    'Checking that a sensor really answers on I2C, and with which bytes ([[i2c-addresses-and-scanning]]).',
    'Capturing the pulses of an infrared remote or a one-wire protocol with the RMT receiver.',
    'A self-diagnosing product that records its own bus traffic when something goes wrong.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, RMT chapter: the receiver, the resolution and the glitch filter.',
    'NXP, *UM10204, I2C-bus specification and user manual*: the timing of START, STOP, data and acknowledge.',
    'Arduino core for ESP32 documentation, GPIO API (digitalRead, attachInterrupt, micros).'
  ]
},

/* ================================================================ the ESP as a frequency counter */
{
  id: 'esp-as-a-frequency-counter',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a frequency counter',
  level: 2,
  short: 'Counting edges in a gate is the method; making it an instrument takes an input stage that counts each edge once, a gate that suits the frequency, a display that shows only the digits the gate allows, and an awareness that the ESP\'s crystal is also its ruler.',
  keywords: ['frequency counter', 'gate time', 'auto-range', 'input conditioning', 'Schmitt trigger', 'hysteresis', 'glitch filter', 'prescaler', 'loopback', 'self-test', 'time base', 'ppm', 'LEDC', 'pulse counter', 'PCNT', 'tachometer', 'resolution'],
  prereq: ['measuring-frequency-and-time', 'pulse-counting', 'accuracy-resolution-precision'],
  related: ['pulse-counter-pcnt', 'the-rmt-peripheral', 'crystals-and-clocks', 'esp-as-a-signal-generator', 'hardware-timers', 'rc-filters-and-debounce', 'electronics:counters', 'electronics:noise-snr'],
  body: `[[measuring-frequency-and-time]] explains how to count edges in a gate or to time periods. A **frequency counter** is the instrument built from them, and it adds four things: an input that turns a real signal into clean pulses, a gate time chosen automatically, a display that does not claim more digits than the gate gives, and a reference clock whose accuracy you know.

### The input stage

The ESP counts edges, and an edge is only a crossing of a threshold. A real signal misbehaves around that threshold: a slow edge with a little noise crosses it several times, and each crossing is counted. The result is a count too high, by a different amount each time. Three cures, from the pin outwards:

- **Hysteresis**: a Schmitt-trigger buffer (a 74HC14 or a single-gate 74LVC1G17 on 3.3 V) switches at two different levels, so noise smaller than the gap cannot make it chatter.
- **A comparator or a coupling stage** for signals that are small, or centred on zero: the pin must see a swing across its threshold, and nothing beyond 0 to 3.3 V ([[voltage-dividers-for-inputs]]).
- **The glitch filter** of the pulse counter ignores pulses shorter than a time you choose, which removes spikes but not slow chatter ([[pulse-counter-pcnt]]).

The ceiling of the instrument is set by the peripheral: an interrupt per edge keeps up with tens of kilohertz, the pulse counter hardware counts far faster, limited by its glitch filter and clock; beyond that, a divide-by-N prescaler in front brings the signal down.

### Choose the gate

The resolution of a count in a gate T is 1 / T hertz: 1 Hz in one second, 10 Hz in 100 ms. The relative error is 1 / (f × T), so a counter that wants about 0.01 % aims for **10 000 counts** per gate and picks T = 10 000 / f, between a floor of a few milliseconds and a ceiling of a second or two. Below a few hertz it is better to time the period. This is **auto-ranging**, and the program below does it.

### Show what the gate gives

A counter that reads 1000.000 Hz from a 100 ms gate is lying by four digits: its resolution is 10 Hz. Print the frequency with the resolution beside it, or round to it.

### The ruler is the thing measured

The gate is timed by the ESP's own crystal. If you wire a PWM output of the ESP to its own counter, the answer is exact, and it proves only that the counting logic works: counter and generator share the clock, so a crystal that is 30 ppm off is invisible. To test accuracy, count a signal whose frequency comes from elsewhere, such as the one-second pulse of a GPS receiver or the 32 kHz output of a temperature-compensated clock chip, and compare ([[crystals-and-clocks]]).

> [!warn] Count mains frequency only through an isolated zero-crossing module or a small transformer made for the purpose; never wire an input pin to the mains.

> [!key] A counter is a clean input, a gate that aims for about 10 000 counts, a display that shows only the digits the gate allows, and a time base you trust. A loopback test checks the counting and says nothing about the crystal.`,
  ideas: [
    'A slow or noisy edge near the threshold is counted several times: hysteresis (a Schmitt trigger) or a glitch filter keeps one edge as one count.',
    'The resolution of a gate count is 1 / T; aiming for about 10 000 counts per gate gives 0.01 % at any frequency by choosing T automatically.',
    'Show the resolution with the number: a 100 ms gate gives steps of 10 Hz, whatever digits the arithmetic produces.',
    'An ESP that counts its own PWM output shares the clock with it: the loopback test proves the logic, not the accuracy.'
  ],
  pitfalls: [
    'If the counter works on a clean square wave it works on any signal — A slow, noisy or small signal crosses the threshold wrongly or several times. Condition the input first.',
    'A longer gate is always better — It improves the resolution and slows the display; for a changing signal it averages the change away. Choose the gate for the digits you need.',
    'Counting the ESP\'s own PWM proves the counter is accurate — Both use the same crystal, so any error cancels. Compare with an independent reference to learn the accuracy.'
  ],
  terms: [
    { term: 'Gate time', also: ['gate', 'measurement window'], def: 'The time during which a frequency counter counts edges. The frequency is the count divided by the gate time, and the resolution is one count in the gate.' },
    { term: 'Schmitt trigger', also: ['hysteresis', 'Schmitt buffer'], def: 'A comparator or gate with two switching levels, a higher one for rising and a lower one for falling inputs, so that noise smaller than the gap cannot make the output chatter.' },
    { term: 'Glitch filter', also: ['input filter', 'pulse-width filter'], def: 'A hardware filter that ignores pulses shorter than a chosen width, as the pulse counter does; it removes spikes without any software.' },
    { term: 'Prescaler', also: ['divider', 'divide-by-N counter'], def: 'A fast counter placed before the instrument that outputs one pulse for every N input pulses, bringing a frequency down into the range the instrument can count.' },
    { term: 'Loopback test', also: ['self-test'], def: 'Connecting an output of a device to its own input to check that the path works. It cannot reveal errors that both ends share, such as a wrong clock.' }
  ],
  choose: {
    good: ['A Schmitt-trigger input stage and an automatic gate for general use', 'The pulse counter hardware for fast signals, with the glitch filter set', 'An independent reference (GPS pulse, clock chip) to learn the accuracy'],
    avoid: ['Slow edges straight into a pin', 'Printing digits finer than the gate allows', 'Trusting a loopback as proof of accuracy'],
    check: ['That the signal crosses the threshold cleanly and never beyond 0 to 3.3 V', 'The resolution that the gate gives at the frequency you measure', 'The crystal tolerance, if ppm matter']
  },
  sim: 'in-counter',
  code: [
    {
      title: 'A frequency counter that picks its gate, with a loopback test',
      about: 'The ESP makes a 1 kHz test signal on one pin and counts the edges of another. Each round it times the gate with the microsecond clock, prints the frequency with its resolution, and chooses the next gate to give about 10 000 counts (between 10 ms and 2 s). Wire the two pins together for the self-test, then connect your own signal to the input.',
      needs: 'An ESP32 DevKit, a jumper wire and, for the real thing, a signal of 0 to 3.3 V from a few hertz to a few tens of kilohertz.',
      wiring: [['GPIO25', 'test signal, 1 kHz', 'jumper to GPIO27 for the self-test'], ['signal', 'GPIO27', '0 to 3.3 V only'], ['signal ground', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set PWM on pin (25) frequency (1000) resolution (8)
          set PWM on pin (25) to (128)
          set pin (27) as [input v]
          set [edges v] to (0)
          set [gate v] to (100)
        forever
          set [edges v] to (0)
          set [t0 v] to (microseconds since start)
          wait ((gate) / (1000)) seconds
          set [n v] to (edges)
          set [seconds v] to (((microseconds since start) - (t0)) / (1000000))
          set [hz v] to ((n) / (seconds))
          print (join (hz) [ Hz   (gate ] (gate) [ ms, step ] ((1) / (seconds)) [ Hz)])
          set [gate v] to (limit ((10000000) / (hz)) between (10) and (2000))
        end

        when pin (27) goes [high v]
          change [edges v] by (1)
      `,
      cpp: String.raw`
        const int OUT_PIN = 25;                  // test signal: 1 kHz, from the LEDC peripheral
        const int IN_PIN = 27;                   // wire GPIO25 to GPIO27 for the self-test
        volatile uint32_t edges = 0;
        uint32_t gateMs = 100;

        void IRAM_ATTR onEdge() { edges++; }

        void setup() {
          Serial.begin(115200);
          ledcAttach(OUT_PIN, 1000, 8);
          ledcWrite(OUT_PIN, 128);               // 50 % duty
          pinMode(IN_PIN, INPUT);
          attachInterrupt(IN_PIN, onEdge, RISING);
        }

        void loop() {
          edges = 0;
          uint32_t t0 = micros();
          delay(gateMs);
          uint32_t n = edges;
          float seconds = (micros() - t0) / 1e6;  // the true length of the gate, from the microsecond clock
          float hz = n / seconds;
          Serial.printf("%.1f Hz   (gate %lu ms, step %.1f Hz)\n", hz, (unsigned long)gateMs, 1.0 / seconds);
          float wanted = hz > 0 ? 10000.0 / hz * 1000.0 : 2000.0;   // gate for about 10 000 counts, in ms
          gateMs = constrain((long)wanted, 10, 2000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        OUT_PIN = 25                             # test signal: 1 kHz, from the PWM peripheral
        IN_PIN = 27                              # wire GPIO25 to GPIO27 for the self-test
        edges = 0
        gate_ms = 100

        def on_edge(pin):                        # a scheduled handler: it can miss edges at high rates
            global edges
            edges += 1

        test = PWM(Pin(OUT_PIN), freq=1000, duty_u16=32768)   # 50 % duty
        Pin(IN_PIN, Pin.IN).irq(handler=on_edge, trigger=Pin.IRQ_RISING)

        while True:
            edges = 0
            t0 = time.ticks_us()
            time.sleep_ms(gate_ms)
            n = edges
            seconds = time.ticks_diff(time.ticks_us(), t0) / 1e6   # the true length of the gate
            hz = n / seconds
            print("%.1f Hz   (gate %d ms, step %.1f Hz)" % (hz, gate_ms, 1 / seconds))
            wanted = 10000 / hz * 1000 if hz > 0 else 2000          # gate for about 10 000 counts, in ms
            gate_ms = int(min(2000, max(10, wanted)))
      `,
      output: `
        1000.0 Hz   (gate 100 ms, step 10.0 Hz)
        1000.0 Hz   (gate 2000 ms, step 0.5 Hz)
        1000.0 Hz   (gate 2000 ms, step 0.5 Hz)
      `,
      notes: ['At 1 kHz the wanted gate would be 10 s, so the 2-second ceiling holds it at 2 s and the step is 0.5 Hz. A faster signal gets a shorter gate: 100 kHz gets 100 ms.', 'The self-test passes by construction: the generator and the gate share one crystal. A real accuracy test needs a signal from another source.', 'An interrupt per edge works up to tens of kilohertz in C++ and much less in MicroPython. Above that, count with the pulse counter hardware ([[pulse-counter-pcnt]]); it has no Arduino wrapper and is missing on the C3, C2 and C61.']
    }
  ],
  examples: [
    {
      title: 'Which gate for 0.01 %?',
      q: 'A counter measures a signal of about 8 kHz and wants a relative error of at most 0.01 %. How long must the gate be, and what resolution does that give?',
      steps: ['The relative error of a count is $1/(f\\,T)$, so $T = 1/(f \\times 10^{-4})$.', 'For 8000 Hz: $T = 1 / (8000 \\times 0.0001) = 1.25$ s.', 'The resolution is $1/T = 0.8$ Hz, which is 0.01 % of 8000 Hz.'],
      a: 'A gate of 1.25 s, with a step of 0.8 Hz. A 0.1 s gate would give steps of 10 Hz, 0.125 %.'
    }
  ],
  quiz: [
    { q: 'You wire the ESP\'s 1 kHz PWM output to its own counter and read 1000.0 Hz. What does that prove?', choices: ['The crystal is exact', 'The counting works; accuracy is not tested, because both ends share the clock', 'The input stage is sound for any signal', 'The ESP is within 1 ppm'], a: 1, why: 'The generator and the gate come from the same clock, so a clock error cancels. The test checks the logic only.' },
    { q: 'A slow sine with a little noise is counted as 1030 Hz instead of 1000 Hz. What is the likely cause and cure?', choices: ['The crystal; replace it', 'Chatter around the threshold; add hysteresis (a Schmitt trigger)', 'The gate is too long', 'The signal is too strong'], a: 1, why: 'Noise on a slow edge near the threshold crosses it several times, and each crossing is counted. Two thresholds (hysteresis) allow one count per edge.' },
    { q: 'A 1 s gate gives a resolution of 1 Hz.', a: true, why: 'The count is a whole number of edges in the gate, so the frequency changes in steps of 1 / T: 1 Hz for one second, 10 Hz for 100 ms.' },
    { q: 'About how long a gate gives 10 000 counts of a 50 kHz signal?', choices: ['20 ms', '0.2 s', '2 s', '10 s'], a: 1, why: 'T = 10 000 / 50 000 = 0.2 s.' }
  ],
  applications: [
    'A bench frequency counter for 555 timers, oscillators and sensors that output a frequency.',
    'A tachometer for a fan or a motor, from an optical or Hall pulse.',
    'Comparing a clock chip or a crystal oscillator with a reference pulse.',
    'Reading the frequency output of capacitive humidity or light sensors.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Pulse Counter (PCNT) chapter: counting edges and the glitch filter.',
    'Hewlett-Packard, *Application Note 200, Fundamentals of Electronic Counters*: gate time, resolution and the time base.',
    'Arduino core for ESP32 documentation, LEDC API (the test signal) and the GPIO interrupt functions.'
  ]
},

/* ================================================================ the ESP as a signal generator */
{
  id: 'esp-as-a-signal-generator',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a signal generator',
  level: 2,
  short: 'An ESP makes square waves from hertz into the megahertz range with a resolution that shrinks as the frequency rises, a staircase sine from its 8-bit DAC on the chips that have one, and arbitrary pulse trains from the RMT. Useful on the bench, within clear limits.',
  keywords: ['signal generator', 'function generator', 'LEDC', 'PWM frequency', 'duty resolution', 'DAC', 'sine wave', 'staircase', 'cosine generator', 'sweep', 'RC filter', 'RMT', 'square wave', 'test signal', 'sigma-delta'],
  prereq: ['pwm-with-ledc', 'dac-output', 'the-esp-adc'],
  related: ['esp-as-a-frequency-counter', 'esp-as-an-oscilloscope', 'the-rmt-peripheral', 'external-adc-and-dac', 'rc-filters-and-debounce', 'signal-generators', 'electronics:pwm', 'electronics:dac'],
  body: `A signal generator is a source of known waveforms: a square wave to test a counter, a sweep to find where a filter cuts, a sine to feed an amplifier. An ESP has three sources, and each one trades something.

### Square waves from the LEDC

The LED-control peripheral makes a square wave on almost any pin, at a frequency and duty cycle you choose. The two are coupled: the timer counts the 80 MHz clock, so a period of $2^{n}$ ticks gives n bits of duty resolution, and the best resolution is about $\\log_2(80\\ \\mathrm{MHz} / f)$, capped by the timer width (14 bits on the S2, S3, C3 and C2, 20 on the others).

| Frequency | Duty resolution | Steps |
|---|---|---|
| 1 kHz | 14 bits (capped) | 16 384 |
| 78 kHz | 10 bits | 1024 |
| 1 MHz | 6 bits | 64 |
| 5 MHz | 4 bits | 16 |
| 40 MHz | 1 bit | 50 % only |

So a "1 MHz PWM" has 64 duty steps, and a 40 MHz clock output is a 50 % square wave and nothing else ([[pwm-with-ledc]]). Two channels that share a timer share a frequency.

### A sine from the DAC

The original ESP32 and the ESP32-S2 have two **8-bit** DACs (the catalogue lists two for the preview ESP32-S31 as well): 256 levels over about 0 to 3.3 V, one step is 13 mV. A sine is a table of points written one after the other: the frequency is 1 / (points × step time). The output is a staircase, whose steps are removed by an RC low-pass filter. Writing the table from a software loop has jitter and is limited in speed; the continuous and cosine-generator modes of the ESP-IDF DAC driver play a table or a built-in sine by hardware, much better ([[dac-output]]). The other chips have no DAC: a PWM at a high frequency with an RC filter averages to a slow analogue level, enough for a sine of some hundreds of hertz, or an external DAC over I2C or SPI ([[external-adc-and-dac]]).

### Any pattern from the RMT

The RMT transmitter plays a list of "high for this long, low for that long" items with a resolution of tens of nanoseconds and no processor time: infrared codes, LED-strip data and odd pulse trains ([[the-rmt-peripheral]]).

### The limits

Outputs are 0 to 3.3 V, unipolar, with a low drive current (a pin gives milliamps, [[pin-current-limits]]), so a generator that must drive a load needs a buffer. There is no amplitude control without an extra stage. The time base is the crystal (tens of ppm), the jitter of software-timed outputs is microseconds, and radio frequencies are out of the question.

> [!key] LEDC squares run to megahertz, with duty steps that shrink as the frequency rises; the 8-bit DAC of the ESP32 and S2 draws a staircase sine that an RC filter smooths; the RMT plays any pulse pattern. All are 3.3 V, unipolar and weak: buffer before you drive anything.`,
  ideas: [
    'The LEDC squares reach megahertz, and the duty resolution is about log2(80 MHz / f) bits: 6 bits at 1 MHz, 1 bit at 40 MHz.',
    'The DAC of the ESP32 and ESP32-S2 has 8 bits and a 13 mV step; a sine from it is a staircase that an RC filter smooths.',
    'The RMT plays arbitrary pulse trains with tens of nanoseconds of resolution and no processor time.',
    'Outputs are 0 to 3.3 V and weak: a buffer or an op-amp stage gives amplitude control and drive.'
  ],
  pitfalls: [
    'Any chip can make a sine with dacWrite — Only the ESP32 and the ESP32-S2 (and, in the catalogue, the preview S31) have a DAC. On the others use PWM with a filter, or an external DAC.',
    'A 1 MHz PWM can be set to any duty with fine steps — At 1 MHz the timer has 64 steps. The finer the duty, the lower the frequency must be.',
    'A software sine loop is as clean as a function generator — It has jitter and a speed limit; the wave is a staircase of 8-bit steps. Smooth it with a filter or use the hardware modes.'
  ],
  terms: [
    { term: 'Duty-cycle resolution', also: ['PWM resolution'], def: 'The number of distinct duty values a PWM channel can produce, 2 to the power of its bits. At a given clock, higher frequencies leave fewer bits.' },
    { term: 'DAC', also: ['digital-to-analogue converter', 'dacWrite'], def: 'A converter that turns a number into a voltage. The ESP32 and ESP32-S2 have two 8-bit DACs on fixed pins; other ESP chips have none.' },
    { term: 'Staircase wave', also: ['stepped waveform'], def: 'The output of a DAC fed a new value at regular intervals: a series of flat steps that approximates the wave. A low-pass filter after the DAC smooths the steps.' },
    { term: 'Sweep', also: ['frequency sweep', 'chirp'], def: 'A test signal whose frequency steps or glides across a range, used to find how a circuit, such as a filter, responds at each frequency.' },
    { term: 'Sigma-delta', also: ['PWM DAC'], def: 'Making a slow analogue level from a fast digital pulse stream and a low-pass filter: the filter averages the pulses, so the duty sets the voltage.' }
  ],
  choose: {
    good: ['LEDC for test squares, clock outputs and sweeps up to a few megahertz', 'The DAC with a filter for a low-frequency sine on the ESP32 or ESP32-S2', 'The RMT for exact pulse patterns'],
    avoid: ['A DAC call on a chip that has none', 'Expecting fine duty steps at megahertz', 'Driving a load straight from a pin'],
    check: ['The chip: is there a DAC at all', 'The duty resolution at your frequency', 'A buffer and a filter for what the output drives']
  },
  sim: 'in-generator',
  code: [
    {
      title: 'A square-wave sweep with the best resolution at each step',
      about: 'Steps the frequency of a 50 % square wave from 100 Hz to 1 MHz in five steps per decade, half a second each, and prints the frequency with the number of duty bits the LEDC timer can give at it. Watch the output with the frequency counter or an oscilloscope.',
      needs: 'Any ESP board with LEDC (all chips of the family but the ESP8266); a scope, counter or logic analyser to look at the result.',
      wiring: [['GPIO4', 'the generator output', '3.3 V square wave; to the instrument and, for a load, through a buffer'], ['instrument ground', 'GND']],
      blocks: `
        define bits for (hz) :: my
          set [bits v] to (1)
          repeat until <<(bits) ≥ (14)> or <((80000000) / (2 ^ ((bits) + (1)))) < (hz)>>
            change [bits v] by (1)
          end
          return (bits)

        when started
          start serial at (115200) baud
          set [hz v] to (100)
        forever
          set PWM on pin (4) frequency (hz) resolution (bits for (hz))
          set PWM on pin (4) to (2 ^ ((bits for (hz)) - (1)))
          print (join (hz) [ Hz  ] (bits for (hz)) [ bits of duty])
          wait (0.5) seconds
          set [hz v] to (round ((hz) * (1.5849)))
          if <(hz) > (1000000)> then
            set [hz v] to (100)
          end
        end
      `,
      cpp: String.raw`
        const int OUT_PIN = 4;
        const uint32_t CLOCK_HZ = 80000000;      // the LEDC timer clock used for the arithmetic
        const int MAX_BITS = 14;                 // fits every chip; the ESP32, C6 and H2 could go to 20
        uint32_t hz = 100;

        int bitsFor(uint32_t f) {                // the finest duty resolution this frequency allows
          int bits = 1;
          while (bits < MAX_BITS && (CLOCK_HZ >> (bits + 1)) >= f) bits++;
          return bits;
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int bits = bitsFor(hz);
          ledcDetach(OUT_PIN);                           // so the pin can be attached again with new settings
          if (ledcAttach(OUT_PIN, hz, bits)) ledcWrite(OUT_PIN, 1 << (bits - 1));   // 50 %: half of 2^bits
          Serial.printf("%lu Hz  %d bits of duty\n", (unsigned long)hz, bits);
          delay(500);
          hz = round(hz * 1.5849);                       // five steps per decade
          if (hz > 1000000) hz = 100;
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        OUT_PIN = 4
        CLOCK_HZ = 80000000                      # the LEDC timer clock used for the arithmetic
        MAX_BITS = 14                            # fits every chip; the ESP32, C6 and H2 could go to 20
        hz = 100

        def bits_for(f):                         # the finest duty resolution this frequency allows
            bits = 1
            while bits < MAX_BITS and (CLOCK_HZ >> (bits + 1)) >= f:
                bits += 1
            return bits

        pwm = PWM(Pin(OUT_PIN), freq=hz, duty_u16=32768)    # 50 % duty, whatever the resolution

        while True:
            pwm.freq(hz)
            pwm.duty_u16(32768)
            print("%d Hz  %d bits of duty" % (hz, bits_for(hz)))
            time.sleep_ms(500)
            hz = round(hz * 1.5849)              # five steps per decade
            if hz > 1000000:
                hz = 100
      `,
      output: `
        100 Hz  14 bits of duty
        158 Hz  14 bits of duty
        251 Hz  14 bits of duty
        100000 Hz  9 bits of duty
        1000000 Hz  6 bits of duty
      `,
      notes: ['The duty is always half of 2 to the power of the bits, so it is exactly 50 % at every step. The printed bits are what the timer could give; MicroPython chooses its own resolution and only the 16-bit duty value is portable.', 'Above 40 MHz the LEDC cannot run: ledcAttach returns false. The sweep stops at 1 MHz, well inside the limit.', 'The output is 3.3 V and weak: do not load it with anything but a probe or an input.']
    },
    {
      title: 'A sine wave from the DAC',
      about: 'Writes 64 points of a sine to the 8-bit DAC, 100 µs apart: a staircase of about 150 Hz (the writes take a little time too). Smooth it with 10 kΩ and 100 nF to ground and look at it with a scope or the ADC.',
      needs: 'An ESP32 (DAC on GPIO25 and GPIO26) or an ESP32-S2 (GPIO17 and GPIO18). The other chips have no DAC.',
      wiring: [['GPIO25', 'wave out', 'ESP32-S2: GPIO17'], ['GPIO25', '10 kΩ → 100 nF → GND', 'take the smooth wave from between them'], ['instrument ground', 'GND']],
      blocks: `
        when started
          make list [wave v]
          for each [i v] in (numbers 0 to 63)
            add ((128) + ((127) * (sine of ((360) * (i) / (64))))) to [wave v]
          end
        forever
          for each [value v] in (wave)
            set DAC pin (25) to (value)
            wait (0.0001) seconds
          end
        end
      `,
      cpp: String.raw`
        const int DAC_PIN = 25;                  // ESP32: GPIO25 or 26; ESP32-S2: GPIO17 or 18
        const int POINTS = 64;                   // samples per cycle
        const int STEP_US = 100;                 // time between samples
        uint8_t wave[POINTS];

        void setup() {
          for (int i = 0; i < POINTS; i++) wave[i] = 128 + 127 * sin(2 * PI * i / POINTS);
        }

        void loop() {
          for (int i = 0; i < POINTS; i++) {
            dacWrite(DAC_PIN, wave[i]);
            delayMicroseconds(STEP_US);
          }
        }
      `,
      py: String.raw`
        from machine import DAC, Pin
        import math
        import time

        DAC_PIN = 25                             # ESP32: pin 25 or 26; ESP32-S2: pin 17 or 18
        POINTS = 64                              # samples per cycle
        STEP_US = 100                            # time between samples
        dac = DAC(Pin(DAC_PIN))
        wave = [int(128 + 127 * math.sin(2 * math.pi * i / POINTS)) for i in range(POINTS)]

        while True:
            for value in wave:
                dac.write(value)
                time.sleep_us(STEP_US)
      `,
      output: `
        (a sine of about 150 Hz and 3.3 V peak to peak on GPIO25; in MicroPython the loop is slower, so the frequency is lower)
      `,
      notes: ['The frequency is 1 / (64 × 100 µs) = 156 Hz at most: each write and each delay add a little, MicroPython adds a lot.', 'For a clean and fast sine use the ESP-IDF cosine generator or the continuous DAC mode, which play the wave by hardware.', 'On a chip without a DAC, make the level with LEDC at a high frequency and the same RC filter.']
    }
  ],
  examples: [
    {
      title: 'How fine is a 100 kHz PWM?',
      q: 'You want to dim a load with a 100 kHz PWM from an ESP32-C3 (LEDC clock 80 MHz, timer width 14 bits). How many bits of duty do you get, and how large is the smallest step?',
      steps: ['The ticks per period are $80\\,000\\,000 / 100\\,000 = 800$.', 'The largest power of two that fits is $2^9 = 512$, so the best resolution is 9 bits.', 'The smallest duty step is $1/512 = 0.2$ %.'],
      a: '9 bits: 512 steps of about 0.2 %. For finer control lower the frequency; at 20 kHz there are 12 bits.'
    }
  ],
  quiz: [
    { q: 'How many bits of duty can an LEDC channel give at 1 MHz from an 80 MHz clock?', choices: ['4', '6', '8', '10'], a: 1, why: '80 MHz / 1 MHz = 80 ticks per period; the largest power of two below that is 64 = 2 to the 6.' },
    { q: 'About how large is one step of the ESP32\'s 8-bit DAC over a 3.3 V range?', choices: ['0.8 mV', '13 mV', '3.3 mV', '50 mV'], a: 1, why: '3.3 V divided by 256 levels is about 13 mV.' },
    { q: 'An ESP32-S3 can make a sine with dacWrite on GPIO25.', a: false, why: 'The S3 has no DAC. Only the original ESP32 and the ESP32-S2 do. On the S3 use PWM with a filter, or an external DAC.' },
    { q: 'A table of 64 points is written every 100 µs. What is the frequency of the sine at most?', choices: ['64 Hz', '156 Hz', '640 Hz', '6.4 kHz'], a: 1, why: 'One cycle takes 64 × 100 µs = 6.4 ms, so f = 1 / 6.4 ms = 156 Hz. Overheads make it a little lower.' }
  ],
  applications: [
    'A test signal for a frequency counter or a filter, from a spare pin.',
    'A swept square or sine to measure a filter or a speaker: generate, read back with the ADC, plot.',
    'A reference clock output for another chip or a camera.',
    'Teaching sampling, quantisation and filtering with something that can be seen on a scope.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: the LED Control (LEDC) chapter for the resolution against frequency, and the DAC chapter for the oneshot, continuous and cosine modes.',
    'Arduino core for ESP32 documentation, LEDC and DAC APIs.',
    'Horowitz and Hill, *The Art of Electronics*: digital-to-analogue conversion and filtering of PWM.'
  ]
},

/* ================================================================ the ESP as a data logger */
{
  id: 'esp-as-a-data-logger',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a data logger',
  level: 2,
  short: 'A data logger writes down what happens while nobody watches. Its quality lies not in the reading but in four decisions around it: where the time comes from, the format of a line, what happens when the storage is full, and what survives a power cut.',
  keywords: ['data logger', 'logging', 'CSV', 'timestamp', 'NTP', 'RTC', 'DS3231', 'LittleFS', 'SD card', 'ring buffer', 'log rotation', 'flush', 'flash wear', 'power loss', 'sample interval', 'storage budget', 'deep sleep logging'],
  prereq: ['littlefs-and-file-systems', 'ntp-and-time', 'esp-as-a-voltmeter'],
  related: ['logging-data', 'flash-wear', 'sd-cards', 'rtc-memory', 'deep-sleep', 'time-series-data', 'store-and-forward', 'project-data-logger', 'electronics:adc'],
  body: `A thermometer that shows the temperature is a meter. A thermometer that writes it down every minute for a month is a **logger**, and what it produces is only as useful as four decisions made around the reading.

### 1. Where does the time come from?

A value without a time is nearly worthless. The choices:

- **NTP over Wi-Fi** sets the clock to the second, at start-up and now and then after; without a network the clock is wrong ([[ntp-and-time]]).
- **A clock chip** (a DS3231 on I2C, accurate to a few parts per million, with its own coin cell) keeps time through power cuts and without a network.
- **The ESP's own clock** survives a deep sleep but not a power cut, and is not as steady as a crystal.
- **Seconds since start** needs no clock at all and is fine for a short experiment.

Write times in UTC, in one fixed format (\`2026-10-04T12:00:00\`, or seconds since 1970); local time with daylight saving makes the file ambiguous twice a year.

### 2. What does a line look like?

One line per reading, comma-separated, a header on the first line: any spreadsheet opens it, and a line that is half-written spoils only itself. Write the units in the header, keep the order fixed, and give a missing value an empty field, not a zero.

### 3. How long until it is full?

| Rate | Per day (30-byte lines) | A 1 MB file system lasts |
|---|---|---|
| one a minute | 43 kB | about 24 days |
| one every 10 s | 259 kB | about 4 days |
| one a second | 2.6 MB | under 10 hours |

The internal flash gives a megabyte or so ([[littlefs-and-file-systems]]); an SD card gives gigabytes ([[sd-cards]]). When it is full there are three honest plans: **stop** (keep the oldest), **rotate** (move the file aside and start another, keeping the last two), or **ring** (overwrite the oldest). Send the data away before it fills ([[store-and-forward]]).

### 4. What survives a power cut?

Data that was never written is lost: closing or flushing the file after each line loses at most the line in progress. But every flush is a flash write, and flash wears: at one flush a second, even with wear levelling, a megabyte partition lasts about a year ([[flash-wear]]). Compromise by buffering a dozen readings in RAM (or, in deep sleep, in the RTC memory, [[rtc-memory]]) and writing them together. An SD card draws current spikes while writing; a weak supply that dips there corrupts the card ([[brownout]]).

> [!key] A logger is a reading plus four decisions: a trustworthy time in a fixed format, one self-contained line per reading, a plan for the day the storage is full, and a flush policy that balances losing data against wearing the flash.`,
  ideas: [
    'Time is half the data: use NTP, a clock chip or seconds since start, and log in UTC in one fixed format.',
    'One line per reading with a header makes every spreadsheet your viewer, and a torn line spoils only itself.',
    'Storage is a budget: bytes per line × lines per day against the free space, with a plan (stop, rotate or ring) for when it is full.',
    'Flushing every line loses almost nothing in a power cut and wears the flash; buffer a few readings and write them together.'
  ],
  pitfalls: [
    'The ESP knows the time — After a power-on it knows nothing until it is told: NTP, a clock chip or you set it. Logs from before the sync show the year 1970.',
    'Writing every reading straight to flash is safest — It loses the least in a power cut, and wears the flash fastest. Flash cells endure on the order of a hundred thousand erase cycles.',
    'When the storage is full the logger stops cleanly — A file system near full slows down and may fail in odd ways. Rotate or ring before it is full, and check the free space.'
  ],
  terms: [
    { term: 'Data logger', also: ['logger'], def: 'A device that records measurements over time, with their time stamps, for later study, usually without anyone watching.' },
    { term: 'Time stamp', also: ['timestamp'], def: 'The date and time written with each reading. In a log it should be in UTC and in one fixed format, such as ISO 8601.' },
    { term: 'Log rotation', also: ['rotating files'], def: 'Closing the current log file when it reaches a size and starting a new one, keeping only the last few, so that the storage never fills.' },
    { term: 'Ring buffer', also: ['circular buffer'], def: 'A fixed-size storage area written in a loop, so that the newest data overwrites the oldest. It always holds the most recent readings.' },
    { term: 'Flush', also: ['sync', 'fsync'], def: 'Forcing data that is waiting in memory to be written to the storage now. Flushing often protects against power loss and wears flash faster.' }
  ],
  choose: {
    good: ['CSV lines with UTC time on LittleFS for weeks of slow data', 'An SD card for fast or long logs, with a supply that holds up', 'Buffering a few readings in RAM before each write'],
    avoid: ['Logging without any time source', 'Flushing flash on every reading of a fast log', 'No plan for the day the storage is full'],
    check: ['Bytes per day against the free space', 'How the clock is set after a power cut', 'How many lines you can afford to lose']
  },
  sim: 'in-logger',
  code: [
    {
      title: 'Log a reading a minute to a CSV file that rotates',
      about: 'Connects to Wi-Fi to set the clock from NTP, then once a minute appends one line (the UTC time and the pin voltage in millivolts) to a file in flash. When the file passes about 100 kB it is renamed to log.old, replacing the older copy, and a new file starts. The file is closed after each line, so a power cut loses at most the line in progress.',
      needs: 'An ESP32 DevKit with Wi-Fi, an analogue signal on an ADC1 pin (a sensor or a potentiometer), a file-system partition (the default partition scheme of most boards has one).',
      wiring: [['sensor output', 'GPIO34', '0 to 3.3 V'], ['sensor ground', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          mount the file system :: storage
          connect to Wi-Fi [your-ssid] password [your-password]
          set the clock from [pool.ntp.org] with zone [UTC0] :: net
        forever
          append (join (current time) [,] (analog read pin (34) in millivolts)) to file [log.csv]
          if <(size of file [log.csv]) > (100000)> then
            delete file [log.old]
            rename file [log.csv] to [log.old]
          end
          wait (60) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <LittleFS.h>
        #include <time.h>

        const char *SSID = "your-ssid";             // keep real credentials out of shared code
        const char *PASS = "your-password";
        const int ADC_PIN = 34;
        const uint32_t MAX_BYTES = 100000;          // rotate the file at about 100 kB

        void setup() {
          Serial.begin(115200);
          LittleFS.begin(true);                     // true: format if the file system cannot be mounted
          WiFi.begin(SSID, PASS);
          for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
          configTzTime("UTC0", "pool.ntp.org");     // the clock then runs on its own and is corrected now and then
        }

        void loop() {
          struct tm t;
          char stamp[24] = "no-time";
          if (getLocalTime(&t, 2000)) strftime(stamp, sizeof stamp, "%Y-%m-%dT%H:%M:%S", &t);
          File f = LittleFS.open("/log.csv", FILE_APPEND);
          f.printf("%s,%u\n", stamp, (unsigned)analogReadMilliVolts(ADC_PIN));
          size_t size = f.size();
          f.close();                                // closing flushes: at most one line is lost in a power cut
          if (size > MAX_BYTES) {
            LittleFS.remove("/log.old");
            LittleFS.rename("/log.csv", "/log.old");
          }
          delay(60000);
        }
      `,
      py: String.raw`
        import network, ntptime, time, os
        from machine import ADC, Pin

        SSID = "your-ssid"                          # keep real credentials out of shared code
        PASS = "your-password"
        ADC_PIN = 34
        MAX_BYTES = 100000                          # rotate the file at about 100 kB
        adc = ADC(Pin(ADC_PIN), atten=ADC.ATTN_11DB)

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        for _ in range(40):
            if wlan.isconnected():
                break
            time.sleep_ms(250)
        try:
            ntptime.settime()                       # sets the clock to UTC
        except OSError:
            print("no time yet")

        while True:
            t = time.localtime()                    # UTC after the sync
            stamp = "%04d-%02d-%02dT%02d:%02d:%02d" % t[:6] if t[0] > 2020 else "no-time"
            with open("log.csv", "a") as f:         # leaving the block closes and flushes the file
                f.write("%s,%d\n" % (stamp, adc.read_uv() // 1000))
            if os.stat("log.csv")[6] > MAX_BYTES:
                try:
                    os.remove("log.old")
                except OSError:
                    pass
                os.rename("log.csv", "log.old")
            time.sleep(60)
      `,
      output: `
        (log.csv)
        2026-10-04T12:00:03,1651
        2026-10-04T12:01:03,1649
        2026-10-04T12:02:03,1652
      `,
      notes: ['Without a network the program still logs, with "no-time" as the time. Add a clock chip, or the RTC memory with a start time, if the logger must work offline.', 'The MicroPython clock starts in the year 2000 until the NTP call succeeds: the program tests for a year after 2020.', 'For a battery logger do not wait in a loop: read, write, and go to deep sleep ([[deep-sleep]]), keeping a few readings in RTC memory between writes.']
    }
  ],
  examples: [
    {
      title: 'How long does the flash last?',
      q: 'A logger flushes one 30-byte line to a flash partition of 1 MB (256 sectors of 4 kB) every 10 seconds. With wear levelling spreading the writes over all sectors and an endurance of 100 000 erase cycles per sector, how many years until the flash wears out, if every flush costs one sector write?',
      steps: ['There are $86\\,400 / 10 = 8640$ flushes a day.', 'The partition can take $100\\,000 \\times 256 = 25.6 \\times 10^{6}$ sector writes in all.', 'That lasts $25.6 \\times 10^{6} / 8640 \\approx 2960$ days, about 8 years.'],
      a: 'About 8 years at one flush every 10 seconds, but under 1 year at one a second (86 400 flushes a day). Buffer a dozen lines per write and the life grows twelve-fold. Real file systems write more than the data, so treat this as an upper bound.'
    }
  ],
  quiz: [
    { q: 'A logger at one 30-byte line a minute has a 1 MB file system. About how long until it is full?', choices: ['A day', 'About 3 weeks', 'About 2 years', 'It never fills'], a: 1, why: '30 bytes × 1440 lines is 43 kB a day; 1 MB / 43 kB is about 24 days.' },
    { q: 'You see log lines dated 1 January 1970. What happened?', choices: ['The sensor failed', 'The clock was never set after power-on', 'The file system is full', 'Daylight saving began'], a: 1, why: 'An ESP that knows no time starts counting from 1970 (or 2000 in MicroPython). Set it by NTP, a clock chip or by hand before logging.' },
    { q: 'Flushing the file after every line is free of cost.', a: false, why: 'It limits a power cut to losing one line, but every flush is a flash write, and flash wears out after about a hundred thousand erase cycles per sector.' },
    { q: 'When the storage must never fill and only recent data matters, which plan fits?', choices: ['Stop writing when full', 'Rotate: keep the last two files, delete the older', 'Write faster', 'Compress the time stamps'], a: 1, why: 'Rotation (or a ring) keeps the newest data and bounds the space used. Stopping keeps the oldest data instead.' }
  ],
  applications: [
    'Temperature, humidity and light records of a greenhouse, a cellar or a freezer over weeks ([[project-data-logger]]).',
    'Battery voltage and current during a discharge test.',
    'The history of a machine\'s supply voltage to catch an intermittent fault.',
    'A flight recorder: a ring buffer that keeps the last minutes before a fault.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, LittleFS, time functions (configTzTime, getLocalTime) and SD libraries.',
    'MicroPython documentation, *os*, *time* and the esp32 port notes (the clock epoch and the file system), version 1.29.',
    'ISO 8601, *Date and time: representations for information interchange* (the time format of a log).'
  ]
},

/* ================================================================ the ESP as a Wi-Fi and Bluetooth scanner */
{
  id: 'esp-as-a-network-scanner',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a Wi-Fi and Bluetooth scanner',
  level: 2,
  short: 'An ESP listens to the beacons and advertisements that every network and every Bluetooth device broadcasts to everyone. That makes it a channel surveyor, a signal-strength meter and a device counter, all passive, and with accuracy limits that its signal-strength figure cannot escape.',
  keywords: ['Wi-Fi scanner', 'BLE scanner', 'site survey', 'RSSI', 'channel survey', 'signal strength meter', 'coverage map', 'beacon', 'advertisement', 'device count', 'passive scan', 'privacy', 'random address', 'channel congestion', 'dBm'],
  prereq: ['wifi-scanning', 'rssi-and-signal-quality', 'ble-advertising'],
  related: ['interference-and-channels', 'wifi-and-ble-analysers', 'project-ble-presence', 'wifi-sensing-and-ftm', 'antenna-placement-and-enclosures', 'ble-beacons', 'electronics:noise-snr'],
  body: `Every Wi-Fi access point announces itself some ten times a second with a **beacon**, and every Bluetooth LE device that wants to be found sends **advertisements**. Both are public and addressed to everyone, and a receiver can note who it hears, on which channel and how loudly. An ESP with the right program is a small radio survey instrument. [[wifi-scanning]] shows the programs; this page is about using them as an instrument.

### What a scanner can tell you

- **Channel survey.** Count the networks on each channel and weigh them by strength: the quiet one is where your own router should sit ([[interference-and-channels]]). The simulation does the sum, with the way neighbouring channels overlap.
- **Signal-strength meter.** Track the strength of *one* network, or one BLE device, as you move: to place an antenna, find a dead spot or decide where an access point belongs. The program below prints a smoothed figure and a word for it.
- **Device census.** How many BLE devices are advertising nearby, and which of mine are alive: useful for checking that a sensor is advertising at all.
- **Coverage map.** Walk with a battery board that logs the strength with the place ([[esp-as-a-data-logger]]).

### How far to trust the number

The strength is **RSSI**, in dBm, and it is a rough figure: the same spot reads several dB differently from one second to the next, the board's own antenna has a pattern, a hand or a body in the way costs ten decibels or more, and reflections add and cancel. It is not a distance: the same figure belongs to a near device behind a wall and a far one in the open ([[rssi-and-signal-quality]]). Average a few readings, hold the board the same way, and compare *differences* (a better spot, a worse one) rather than absolute values.

A scan takes seconds (about 300 ms on each channel for an active Wi-Fi scan) and takes the radio off its channel, so a connected board stutters. The ESP32-C5 alone scans 5 GHz.

### Listening is not joining

Reading beacons and advertisements is passive and open to everyone. What follows from it needs care:

- **Do not connect** to a network or device you have no permission to use. Do not interfere, jam or impersonate: those are offences, and tools for them are not taught here.
- **Names and addresses are personal data.** A list of neighbours' networks with their positions is a record of where people live; do not publish it. A BLE device's address can identify a person's phone or watch, which is why phones change theirs every few minutes; never build a tracker.
- **Capturing the data frames** of networks that are not yours is a legal matter in most countries. Promiscuous mode is a measurement tool on *your own* network ([[wifi-sensing-and-ftm]]).

> [!key] A scanner reads public broadcasts: count networks per channel to choose a channel, track one RSSI as you move to place an antenna, count BLE advertisers to see what is alive. RSSI is noisy and is not a distance; listening is allowed, connecting or tracking is not.`,
  ideas: [
    'Beacons and advertisements are public broadcasts: scanning them is passive and a legitimate way to survey a radio environment.',
    'A channel survey counts and weighs the networks per channel, with neighbouring channels overlapping, to find the quietest of 1, 6 and 11.',
    'RSSI wanders by several dB, depends on the antenna and the body, and is not a distance: compare differences, average, and hold the board the same way.',
    'Names, positions and addresses of other people\'s devices are personal data: do not publish them, do not track, and never connect without permission.'
  ],
  pitfalls: [
    'The RSSI tells me the distance — It tells how much arrived. Walls, bodies, antennas and reflections change it by tens of decibels at the same distance.',
    'Every BLE address is a device — Phones and watches change their address every few minutes, so one device can appear as many, and the count overstates.',
    'A scan does no harm to the board\'s own link — The radio leaves its channel for the scan: a connected board loses traffic, and an ESP-NOW link stutters.'
  ],
  terms: [
    { term: 'Beacon', also: ['beacon frame'], def: 'A frame that a Wi-Fi access point sends about ten times a second to announce its name, channel and capabilities to anyone listening.' },
    { term: 'Advertisement', also: ['advertising packet', 'BLE advertising'], def: 'The short packet a Bluetooth LE device sends on the three advertising channels so that others can find it; it can carry a name, service identifiers and data.' },
    { term: 'RSSI', also: ['received signal strength', 'signal strength indicator'], def: 'The power a receiver measures from a transmission, in dBm. A larger (less negative) figure means a stronger signal; it varies with antenna, obstacles and reflections and is not a reliable distance.' },
    { term: 'Site survey', also: ['channel survey', 'coverage survey'], def: 'A measurement of the radio environment at a place: which networks and channels are present and how strong they are, used to place access points and choose channels.' },
    { term: 'Random address', also: ['resolvable private address', 'address rotation'], def: 'A Bluetooth LE address that a device changes every few minutes, for privacy, so that observers cannot follow it. One device then appears as several in a scan.' }
  ],
  choose: {
    good: ['A scan to choose a router channel or to learn what the board can hear', 'A smoothed RSSI meter to compare two antenna positions', 'A BLE listener that counts known sensors to check they are alive'],
    avoid: ['Reading an RSSI as a distance', 'Scanning every few seconds on a connected board or a battery', 'Publishing or storing other people\'s network names, positions or addresses'],
    check: ['That the board is held the same way for every reading', 'Which band the network uses (only the C5 hears 5 GHz)', 'Your country\'s rules on what may be recorded']
  },
  sim: 'in-wifiscan',
  code: [
    {
      title: 'A signal-strength meter for one Wi-Fi network',
      about: 'Scans over and over and picks the strongest access point called your network name (a name may be shared by several), smooths the figure so that it stops jumping, and prints it with a word for its quality and a bar. Walk with the board to see where the signal fades.',
      needs: 'Any ESP32-family board with Wi-Fi, and a network that you can see (put its name in TARGET). The serial monitor at 115200 baud.',
      blocks: `
        define quality of (r) :: my
          if <(r) ≥ (-50)> then
            return [excellent]
          else if <(r) ≥ (-60)> then
            return [good]
          else if <(r) ≥ (-70)> then
            return [fair]
          else if <(r) ≥ (-80)> then
            return [weak]
          end
          return [unusable]

        when started
          start serial at (115200) baud
          set [smooth v] to (0)
        forever
          scan networks :: wifi
          set [rssi v] to (-127)
          for each [net v] in (scan results)
            if <<(name of [net]) = [your-ssid]> and <(signal of [net]) > (rssi)>> then
              set [rssi v] to (signal of [net])
            end
          end
          if <(rssi) = (-127)> then
            print [not seen]
          else
            if <(smooth) = (0)> then
              set [smooth v] to (rssi)
            end
            set [smooth v] to (((0.7) * (smooth)) + ((0.3) * (rssi)))
            print (join (rssi) [ dBm, smoothed ] (round (smooth)) [ dBm: ] (quality of (smooth)))
          end
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *TARGET = "your-ssid";          // the network to follow
        float smooth = 0;                          // 0 means: no reading yet

        const char *quality(float r) {
          if (r >= -50) return "excellent";
          if (r >= -60) return "good";
          if (r >= -70) return "fair";
          if (r >= -80) return "weak";
          return "unusable";
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.disconnect();
        }

        void loop() {
          int n = WiFi.scanNetworks();             // a few seconds; the radio leaves its channel meanwhile
          int rssi = -127;                         // -127: not seen
          for (int i = 0; i < n; i++) {
            if (WiFi.SSID(i) == TARGET) rssi = max(rssi, (int)WiFi.RSSI(i));   // the strongest of several access points
          }
          WiFi.scanDelete();
          if (rssi == -127) { Serial.println("not seen"); return; }
          smooth = (smooth == 0) ? rssi : 0.7 * smooth + 0.3 * rssi;
          Serial.printf("%d dBm, smoothed %.0f dBm: %s  ", rssi, smooth, quality(smooth));
          for (int i = 0; i < constrain((int)((smooth + 100) / 3), 0, 20); i++) Serial.print('#');
          Serial.println();
        }
      `,
      py: String.raw`
        import network

        TARGET = b"your-ssid"                      # the network to follow (the scan gives names as bytes)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.disconnect()
        smooth = None                              # no reading yet

        def quality(r):
            if r >= -50: return "excellent"
            if r >= -60: return "good"
            if r >= -70: return "fair"
            if r >= -80: return "weak"
            return "unusable"

        while True:
            rssi = -127                            # -127: not seen
            for ap in wlan.scan():                 # (ssid, bssid, channel, rssi, security, hidden)
                if ap[0] == TARGET and ap[3] > rssi:
                    rssi = ap[3]                   # the strongest of several access points
            if rssi == -127:
                print("not seen")
                continue
            smooth = rssi if smooth is None else 0.7 * smooth + 0.3 * rssi
            bars = max(0, min(20, int((smooth + 100) / 3)))
            print("%d dBm, smoothed %.0f dBm: %s  %s" % (rssi, smooth, quality(smooth), "#" * bars))
      `,
      output: `
        -58 dBm, smoothed -58 dBm: good  ##############
        -61 dBm, smoothed -59 dBm: good  #############
        -66 dBm, smoothed -61 dBm: fair  #############
        not seen
      `,
      notes: ['The word for the quality is a convention, the same one as in the signal-quality page: it is a rule of thumb, not a standard.', 'Each pass takes several seconds, because the scan visits every channel. For a faster meter fix the channel of your network if the scan function allows it.', 'The meter is relative: compare one spot with another, with the board held the same way.']
    },
    {
      title: 'Count the Bluetooth LE advertisers around',
      about: 'Listens passively for five seconds (it sends nothing, not even a request for more data) and prints how many different addresses it heard and the strongest signal, every ten seconds or so. Many phones and wearables change their address, so the count overstates the number of devices.',
      needs: 'Any ESP32-family board with Bluetooth LE. No connection is ever made; do not store or publish the addresses of other people\'s devices.',
      blocks: `
        when started
          start serial at (115200) baud
          start BLE as [] :: ble
        forever
          scan for (5) seconds, passively :: ble
          set [strongest v] to (-127)
          for each [device v] in (scan results :: ble)
            if <(RSSI of (device)) > (strongest)> then
              set [strongest v] to (RSSI of (device))
            end
          end
          print (join (length of (scan results :: ble)) [ advertisers, strongest ] (strongest) [ dBm])
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEScan.h>

        void setup() {
          Serial.begin(115200);
          BLEDevice::init("");                       // no name: we only listen
        }

        void loop() {
          BLEScan *scan = BLEDevice::getScan();
          scan->setActiveScan(false);                // passive: ask nobody for more
          scan->setInterval(100);
          scan->setWindow(99);
          BLEScanResults *found = scan->start(5, false);   // five seconds, waits here
          int strongest = -127;
          for (int i = 0; i < found->getCount(); i++) {
            BLEAdvertisedDevice d = found->getDevice(i);
            strongest = max(strongest, d.getRSSI());
          }
          Serial.printf("%d advertisers, strongest %d dBm\n", found->getCount(), strongest);
          scan->clearResults();                      // free the memory of the list
          delay(5000);
        }
      `,
      py: String.raw`
        import bluetooth, time

        _IRQ_SCAN_RESULT = 5
        ble = bluetooth.BLE()
        ble.active(True)
        seen = {}                                    # address -> strongest RSSI heard

        def irq(event, data):
            if event == _IRQ_SCAN_RESULT:
                addr_type, addr, adv_type, rssi, adv = data
                key = bytes(addr)                    # the values are only valid inside the handler: copy them
                seen[key] = max(rssi, seen.get(key, -127))

        ble.irq(irq)
        while True:
            seen.clear()
            ble.gap_scan(5000, 100_000, 99_000, False)     # five seconds, interval and window in microseconds, passive
            time.sleep(6)
            strongest = max(seen.values()) if seen else -127
            print("%d advertisers, strongest %d dBm" % (len(seen), strongest))
            time.sleep(5)
      `,
      output: `
        14 advertisers, strongest -47 dBm
        17 advertisers, strongest -47 dBm
        12 advertisers, strongest -52 dBm
      `,
      notes: ['The address is a number, not a name: only your own devices, whose addresses you know, can be told apart. Keep the list in RAM and do not log it.', 'Passive scanning hears advertisements only; active scanning also asks for the scan response, where many devices put their name, at the price of a few more packets.', 'The count changes from scan to scan because devices advertise every few hundred milliseconds and some are out of range part of the time. Take the maximum of several scans.']
    }
  ],
  examples: [
    {
      title: 'Is the signal getting worse or is it noise?',
      q: 'You walk away from an access point and the meter reads -58, -61, -57, -64, -63 dBm over five scans. The five readings at the first position had a spread of about ±3 dB. Can you say the signal has fallen?',
      steps: ['The first position gives -58 ±3 dB: anything from -61 to -55 is the same place.', 'The readings -61, -57, -64, -63 average -61, 3 dB lower: within the spread of one position.', 'Only a drop well beyond the scatter, say 10 dB, is a real change.'],
      a: 'Not yet: a 3 dB drop is inside the noise of a single position. Average ten readings at each spot and compare the averages.'
    }
  ],
  quiz: [
    { q: 'A phone and a router give the same RSSI of -60 dBm at the ESP. Which statement is safe?', choices: ['They are the same distance away', 'The phone is nearer', 'Nothing about the distance: antennas, power and obstacles differ', 'The router is nearer'], a: 2, why: 'RSSI mixes the transmit power, the antennas and everything on the path. Equal figures from different transmitters say nothing about their distances.' },
    { q: 'An ESP scans for Bluetooth LE devices for ten seconds in a street and counts 80 addresses. How many devices are there?', choices: ['80', 'Fewer than 80, probably: many change their address', 'Exactly 40', 'More than 80, since some are silent'], a: 1, why: 'Phones and wearables rotate their random addresses every few minutes, so one device can appear as several. The count is an upper bound.' },
    { q: 'Scanning for networks and reading their names is passive and allowed anywhere, so publishing the list of every network and its position is also harmless.', a: false, why: 'The scan is passive, but the list of neighbours\' network names with their positions is personal data about where people live and which devices they own. Keep your own survey private.' },
    { q: 'Which is a sound way to compare two antenna positions with RSSI?', choices: ['One reading at each position', 'The average of about ten readings at each, with the board held the same way', 'The strongest reading seen at either', 'Read the distance in metres from the table'], a: 1, why: 'RSSI scatters by several dB; averaging and a fixed orientation reveal the real difference between the places.' }
  ],
  applications: [
    'Choosing the channel of a home router, and placing an access point or a repeater.',
    'Finding where a sensor board\'s Wi-Fi fades, before deciding where to mount it.',
    'Checking that a Bluetooth LE sensor is advertising and how strongly it is heard ([[project-ble-presence]]).',
    'A coverage survey of a workshop or a greenhouse, logged while walking.'
  ],
  sources: [
    'IEEE Std 802.11, *Wireless LAN MAC and PHY specifications*: beacon frames, probe requests and the 2.4 GHz channel plan.',
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 3 Part C, Generic Access Profile: advertising and scanning, and the privacy feature with resolvable private addresses.',
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi scan and Bluetooth LE GAP chapters.'
  ]
},

/* ================================================================ the ESP as a power meter */
{
  id: 'esp-as-a-power-meter',
  parent: 'the-esp-as-an-instrument',
  title: 'The ESP as a power meter',
  level: 2,
  short: 'Power is voltage times current and energy is power added up over time. Adding it up honestly is the hard part: a device that sleeps at microamps and transmits at hundreds of milliamps cannot be read with one range or one reading a second.',
  keywords: ['power meter', 'energy meter', 'mAh', 'Wh', 'INA219', 'INA226', 'INA228', 'current profile', 'sleep current', 'duty cycle', 'average current', 'burden voltage', 'averaging', 'integration', 'sampling', 'profiler', 'battery test', 'coulomb counting'],
  prereq: ['measuring-current-with-shunts', 'measuring-voltage', 'battery-life-budget'],
  related: ['measuring-current', 'usb-power-meters-and-profilers', 'mains-energy-monitoring', 'deep-sleep', 'brownout', 'project-energy-monitor', 'the-board-is-not-the-chip', 'electronics:power-energy'],
  body: `A power meter measures the voltage across a load and the current through it, multiplies them, and adds the product up over time: watts, then watt-hours or, for a battery, milliamp-hours. [[measuring-current-with-shunts]] covers the sensing. The difficulty is the *adding up*, and it is greatest for the very devices an ESP person most wants to measure.

### The range problem

A battery product wakes, joins the network, sends and sleeps. The catalogue lists deep-sleep currents of 5 to 25 µA for the chips and transmit peaks of 140 to 408 mA: a ratio of ten thousand to one, inside one second. A shunt that suits the peak, 0.1 Ω giving 40 mV at 400 mA, steps in tenths of a milliamp on the INA219's finest range, which is ten times the whole sleep current: the sleep is invisible and the average is dominated by what you cannot see. (And a board's sleep current is higher than the chip's, [[the-board-is-not-the-chip]].) The fixes are a shunt that switches between two values, an instrument built to profile such currents ([[usb-power-meters-and-profilers]]), or a long, slow integration of the charge.

### Spot readings and averages

The average current of a cycle is the sum of each phase's current times its time, divided by the whole time ([[battery-life-budget]]). A meter that *looks* once per second looks at one instant of that cycle; if the wake lasts 2 s in every 60 s, most looks see sleep and a few see the peak, and the mean of the looks depends on luck. The chip should average itself: the INA219 can average up to 128 conversions (68 ms), so each reading is a mean over the last 68 ms, and a program that reads at about that rate, multiplies each reading by the true time since the last, and sums them, gets the charge. Some newer power monitors (the INA228 is one) accumulate energy and charge in hardware, which is better still. The simulation compares spot readings with the true average.

### The meter disturbs the supply

A shunt in the supply line drops its burden voltage; with the Wi-Fi burst of 300 mA through 0.1 Ω that is only 30 mV, but through a 10 Ω shunt chosen to see microamps it is 3 V, and the board browns out ([[brownout]]).

### Keeping the sum

Add \`mA × seconds / 3600\` to a running charge in mAh, and the power times the time to the energy in Wh. Keep the sum in RAM and write it down rarely ([[flash-wear]]).

> [!warn] Measuring the mains power of an appliance means working with line voltage. Use a certified plug-in meter or an isolated metering module inside a proper enclosure, wired by a qualified person; never connect a shunt, a divider or an ESP pin to the mains ([[mains-energy-monitoring]]).

> [!key] Power meter work is mostly about adding up correctly: a range that sees both the microamps of sleep and the milliamps of the radio, a reading that averages instead of spotting, and the true time between readings. The meter in the supply line also costs voltage: check the burden.`,
  ideas: [
    'Energy is power added up over time: sum current × time to get charge in mAh, then multiply by the voltage for Wh.',
    'A duty-cycled device spans a ratio of ten thousand between sleep and radio currents: one shunt and one range cannot show both.',
    'A single reading is a spot sample of the cycle; have the chip average over its window and add up each reading times the true time elapsed.',
    'A shunt in the supply drops the burden voltage: large enough to see microamps, it can make the board brown out when it transmits.'
  ],
  pitfalls: [
    'One reading a second is enough to find the average current — For a device that is awake two seconds in a minute, each reading falls in sleep or in the peak by chance; the mean of a few of them is a lottery. Average in the chip, or read much faster than the shortest phase.',
    'The sleep current is in the datasheet, so the meter will show it — A shunt sized for the radio peak has a step of 100 µA; a deep sleep of 10 µA is under one step. Use a range or a profiler for the sleep.',
    'The meter is free of side effects — Its shunt is in the supply: its burden voltage drops the voltage the board sees. A large shunt browns the board out in a Wi-Fi burst.'
  ],
  terms: [
    { term: 'Charge', also: ['mAh', 'coulomb counting'], def: 'The current added up over time, in milliamp-hours: a battery\'s capacity and a load\'s consumption are both quoted in it. A meter finds it by summing current times the time between readings.' },
    { term: 'Energy', also: ['Wh', 'watt-hour'], def: 'Power added up over time, in watt-hours; for a battery, the charge in ampere-hours times the voltage. It is what a bill or a battery pack is measured in.' },
    { term: 'Current profile', also: ['power profile', 'load profile'], def: 'A trace of a device\'s current against time over a work cycle, showing the sleep, wake and transmit phases and their durations.' },
    { term: 'Burden voltage', also: ['insertion drop'], def: 'The voltage a current meter takes from the circuit, equal to the current times the resistance of its shunt. It lowers the supply of the device under test.' },
    { term: 'Averaging window', also: ['integration time', 'conversion time'], def: 'The time over which a converter averages its input to give one reading; a reading is then the mean over that window, and anything between windows is not seen.' }
  ],
  choose: {
    good: ['An INA219 or INA226 module with averaging, for DC loads of milliamps to an ampere', 'A profiler or a switchable shunt for sleep-and-wake devices', 'A certified plug-in meter for anything on the mains'],
    avoid: ['Reading a duty-cycled load once a second and calling the mean the average', 'A shunt chosen for microamps in a line that carries Wi-Fi bursts', 'Any home-made connection to the mains'],
    check: ['The smallest current that one step of your meter represents', 'The burden voltage at the largest current', 'That every reading is weighted by the true time between readings']
  },
  sim: 'in-power',
  formulas: [
    {
      name: 'Average current of a cycle',
      expr: 'Iavg = (Iact * tact + Islp * tslp) / (tact + tslp)',
      tex: 'I_{\\mathrm{avg}} = \\frac{I_{\\mathrm{act}}\\,t_{\\mathrm{act}} + I_{\\mathrm{slp}}\\,t_{\\mathrm{slp}}}{t_{\\mathrm{act}} + t_{\\mathrm{slp}}}',
      vars: {
        Iavg: { name: 'average current', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{avg}}' },
        Iact: { name: 'current while awake', q: 'current', unit: 'mA', value: 80, min: 0, tex: 'I_{\\mathrm{act}}' },
        tact: { name: 'time awake', q: 'time', unit: 's', value: 2, min: 0, tex: 't_{\\mathrm{act}}' },
        Islp: { name: 'current asleep', q: 'current', unit: 'µA', value: 15, min: 0, tex: 'I_{\\mathrm{slp}}' },
        tslp: { name: 'time asleep', q: 'time', unit: 's', value: 58, min: 0, tex: 't_{\\mathrm{slp}}' }
      },
      solveFor: 'Iavg',
      note: 'The charge of one cycle divided by its length. Two phases here; add terms for more (a transmit burst, a connect phase). It is what a meter must reproduce when it adds up its readings.',
      stories: { Iavg: 'A device draws {Iact} for {tact} and {Islp} for {tslp}, over and over. What is its average current?' }
    }
  ],
  code: [
    {
      title: 'An energy counter with an INA219',
      about: 'Configures the INA219 to average 128 conversions per reading (68 ms) on its ±40 mV range, reads current and bus voltage about every 70 ms, multiplies each current by the true time since the previous reading, and adds it into a charge in mAh and an energy in Wh. Every ten seconds it prints the voltage, the latest current and the totals.',
      needs: 'An ESP32 DevKit, an INA219 module with a 0.1 Ω shunt (address 0x40) and a DC load of up to 400 mA on a supply of up to 16 V.',
      wiring: [['INA219 VIN+', 'supply +', 'the current enters here'], ['INA219 VIN−', 'load +', 'the current leaves here'], ['load −', 'supply − and GND'], ['INA219 VCC, GND', '3V3, GND'], ['INA219 SDA, SCL', 'GPIO21, GPIO22', 'add 4.7 kΩ pull-ups if the module has none']],
      blocks: `
        define write register (reg) value (value) :: bus
          I2C write (value) to address (0x40) register (reg)

        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz
          write register (0x00) value (0x07FF)    // 16 V range, ±40 mV, 12 bits, 128 conversions averaged
          write register (0x05) value (8192)      // calibration for steps of 0.05 mA with 0.1 ohm
          set [charge v] to (0)
          set [energy v] to (0)
          set [last v] to (milliseconds since start)
          set [lastPrint v] to (milliseconds since start)
        forever
          wait (0.07) seconds
          set [now v] to (milliseconds since start)
          set [dt v] to (((now) - (last)) / (1000))
          set [last v] to (now)
          set [volts v] to (((I2C read (2 bytes) from address (0x40) register (0x02)) / (8)) * (0.004))
          set [mA v] to ((I2C read (2 bytes, signed) from address (0x40) register (0x04)) * (0.05))
          change [charge v] by (((mA) * (dt)) / (3600))
          change [energy v] by (((((volts) * (mA)) / (1000)) * (dt)) / (3600))
          if <((now) - (lastPrint)) ≥ (10000)> then
            set [lastPrint v] to (now)
            print (join (volts) [ V  ] (mA) [ mA  ] (charge) [ mAh  ] (energy) [ Wh])
          end
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t INA219 = 0x40;                 // A0 and A1 to GND
        const uint8_t REG_CONFIG = 0x00, REG_BUS = 0x02, REG_CURRENT = 0x04, REG_CAL = 0x05;
        const float CURRENT_LSB_MA = 0.05;           // calibration 8192 for a 0.1 ohm shunt
        float chargeMah = 0, energyWh = 0;
        uint32_t lastRead, lastPrint;

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
          writeReg(REG_CONFIG, 0x07FF);              // 16 V range, +-40 mV, 12 bits, 128 conversions averaged (68 ms)
          writeReg(REG_CAL, 8192);
          lastRead = lastPrint = millis();
        }

        void loop() {
          delay(70);                                 // about one averaging window
          uint32_t now = millis();
          float dt = (now - lastRead) / 1000.0;      // the true time since the last reading
          lastRead = now;
          float volts = (readReg(REG_BUS) >> 3) * 0.004;
          float mA = (int16_t)readReg(REG_CURRENT) * CURRENT_LSB_MA;
          chargeMah += mA * dt / 3600.0;             // mA x s / 3600 = mAh
          energyWh += volts * mA / 1000.0 * dt / 3600.0;
          if (now - lastPrint >= 10000) {
            lastPrint = now;
            Serial.printf("%.2f V  %.2f mA  %.3f mAh  %.4f Wh\n", volts, mA, chargeMah, energyWh);
          }
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import struct
        import time

        INA219 = 0x40                                # A0 and A1 to GND
        REG_CONFIG, REG_BUS, REG_CURRENT, REG_CAL = 0x00, 0x02, 0x04, 0x05
        CURRENT_LSB_MA = 0.05                        # calibration 8192 for a 0.1 ohm shunt
        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)

        def write_reg(reg, value):
            i2c.writeto_mem(INA219, reg, struct.pack(">H", value))

        def read_reg(reg, signed=False):
            return struct.unpack(">h" if signed else ">H", i2c.readfrom_mem(INA219, reg, 2))[0]

        write_reg(REG_CONFIG, 0x07FF)                # 16 V range, +-40 mV, 12 bits, 128 conversions averaged (68 ms)
        write_reg(REG_CAL, 8192)
        charge_mah = 0.0
        energy_wh = 0.0
        last_read = last_print = time.ticks_ms()

        while True:
            time.sleep_ms(70)                        # about one averaging window
            now = time.ticks_ms()
            dt = time.ticks_diff(now, last_read) / 1000    # the true time since the last reading
            last_read = now
            volts = (read_reg(REG_BUS) >> 3) * 0.004
            ma = read_reg(REG_CURRENT, True) * CURRENT_LSB_MA
            charge_mah += ma * dt / 3600             # mA x s / 3600 = mAh
            energy_wh += volts * ma / 1000 * dt / 3600
            if time.ticks_diff(now, last_print) >= 10000:
                last_print = now
                print("%.2f V  %.2f mA  %.3f mAh  %.4f Wh" % (volts, ma, charge_mah, energy_wh))
      `,
      output: `
        4.98 V  212.35 mA  0.589 mAh  0.0029 Wh
        4.98 V  211.90 mA  1.178 mAh  0.0059 Wh
      `,
      notes: ['The reading interval of 70 ms is a little longer than the 68 ms averaging window, so now and then a window is skipped: the sum is a good estimate, not an exact one. A part with hardware accumulators does not have this limit.', 'On the ±40 mV range one step is 0.1 mA with the usual 0.1 Ω shunt: a sleep current of tens of microamps does not show. The counter measures the awake phases well and the sleep not at all.', 'The sums live in RAM and are lost at a reset; write them to storage rarely, never in every pass ([[flash-wear]]).']
    }
  ],
  examples: [
    {
      title: 'The average of a sensor that sleeps',
      q: 'A node sleeps at 15 µA for 58 s and then spends 2 s awake at 80 mA. A meter that reads once a minute at a random moment shows either 15 µA or 80 mA. What is the true average, and how long does a 2000 mAh battery last at it (80 % usable)?',
      steps: ['The charge of one cycle: $80 \\times 2 + 0.015 \\times 58 = 160.87$ mA·s, over 60 s.', 'The average is $160.87 / 60 = 2.68$ mA.', 'The battery gives $0.8 \\times 2000 = 1600$ mAh usable: $1600 / 2.68 = 597$ hours, about 25 days.'],
      a: 'The average is 2.7 mA and the battery lasts about 25 days. Almost the whole consumption is the 2 s awake; the sleep adds only 0.015 mA to 2.68 mA.'
    }
  ],
  quiz: [
    { q: 'A device sleeps at 10 µA and draws 100 mA for 1 s every 100 s. About what is its average current?', choices: ['10 µA', '1 mA', '100 mA', '50 mA'], a: 1, why: 'The charge per cycle is 100 mA × 1 s = 100 mA·s, over 100 s: 1 mA, plus 0.01 mA of sleep. The awake second dominates.' },
    { q: 'A meter takes one spot reading per minute of a load that is awake two seconds a minute. What do its readings show?', choices: ['The average current', 'Mostly sleep current, sometimes the peak: not the average', 'Always the peak', 'Always the sleep current'], a: 1, why: 'Each reading catches the cycle at one instant. Most land in the sleep, a few in the wake; their mean depends on chance.' },
    { q: 'A 0.1 Ω shunt on the INA219\'s ±40 mV range shows a deep sleep of 10 µA clearly.', a: false, why: 'One step on that range is 10 µV, which is 0.1 mA through 0.1 Ω: ten times the sleep current. The sleep is invisible.' },
    { q: 'Why multiply each current reading by the true time since the previous reading?', choices: ['To convert to volts', 'Because the loop time is never exactly the same, and charge is current times time', 'To save memory', 'To smooth the noise'], a: 1, why: 'Charge is the integral of current over time; with uneven spacing, each reading must be weighted by the time it stands for.' }
  ],
  applications: [
    'Testing how long a battery product will run, from its measured profile rather than the datasheet ([[battery-life-budget]]).',
    'A bench energy counter for a solar charger, an LED lamp or a pump.',
    'Finding which part of a product\'s cycle uses the energy: the connect phase, the sensor or the radio.',
    'Logging the consumption of a device for a day ([[project-energy-monitor]]).'
  ],
  sources: [
    'Texas Instruments, *INA219 datasheet*: the configuration register, averaging and conversion times, and the calibration register.',
    'Espressif, *ESP32 Series Datasheet* (and those of the other chips): current consumption in the active and deep-sleep modes.',
    'Horowitz and Hill, *The Art of Electronics*: the sections on current measurement and shunts.'
  ]
},

/* ================================================================ presenting live data */
{
  id: 'presenting-live-data',
  parent: 'the-esp-as-an-instrument',
  title: 'Presenting live data',
  level: 1,
  short: 'A reading is for a person, and a person reads about three numbers a second. How often to update, how much to smooth, how many digits to show, what context to add and where to put it: the choices that turn a flickering number into something you can use.',
  keywords: ['live data', 'update rate', 'refresh rate', 'smoothing', 'EMA', 'exponential moving average', 'deadband', 'hysteresis', 'min max average', 'sparkline', 'trend', 'serial plotter', 'downsampling', 'units', 'dashboard', 'display', 'WebSocket', 'lag'],
  prereq: ['accuracy-resolution-precision', 'oversampling-and-noise', 'non-blocking-timing'],
  related: ['presenting-data', 'filtering-sensor-data', 'dashboards', 'web-ui-as-a-display', 'formatting-numbers', 'on-off-control-and-hysteresis', 'hmi-design-rules', 'esp-as-a-voltmeter'],
  body: `A converter produces fifty readings a second, each a little different. Printed raw, they are a blur: the last digit changes faster than the eye can follow, the number never seems to settle, and the one fact you wanted, whether it is rising, is hidden. Presenting live data is the craft of showing a measurement so that it can be read. The tools for the display itself are in [[presenting-data|the touch-and-display pages]] and [the display lab](#/tools/displaylab); this page is about what to show.

### How often

A person can read a changing number a few times a second at most: update digits **two to five times a second**. Sampling can be much faster than that (and should be, for averaging) while the display refreshes slowly. A graph can move faster, because the eye follows a line and not digits, and a web page rarely needs more than one to five updates a second ([[web-ui-as-a-display]]).

### Smoothing, and what it costs

A simple, cheap and good filter is the exponential average: each new reading moves the shown value by a fraction α of the difference. Its **time constant** is about Δt / α (more exactly −Δt / ln(1 − α)), and the shown value reaches 95 % of a step after three time constants. A long constant calms the digits and delays the news: a pump that failed at 12:00 still reads normal at 12:00 and 2 seconds. Choose the constant for the reader (a second or two for a display), use a short one or none for alarms, and keep the raw reading for logging ([[filtering-sensor-data]]).

### Digits and the last digit

Show no digit finer than the resolution or the accuracy ([[accuracy-resolution-precision]]). A **deadband** helps: change the displayed value only when the reading has moved by more than half a step, so the last digit stops flickering between two neighbours. State the unit beside the number, and the range if it matters.

### Context beats numbers

- **Minimum, maximum and average** over a stated period say more than the instant.
- **A trend** (an arrow, or a small line graph of the last minute, a *sparkline*) answers "is it rising?" at a glance.
- **Thresholds** with colours need hysteresis: a value hovering at the limit must not flip the colour at every update ([[on-off-control-and-hysteresis]]).
- **Missing data** is a dash or "no data", never a zero: a disconnected sensor reading 0 °C is a lie.

### Charts and plotters

For a long history, send fewer points than there are: keep the minimum and the maximum of each bucket, not every n-th sample, so that a brief peak survives. In development the serial plotter of the Arduino IDE draws lines from "name:value" pairs separated by commas, one line per update; the program below prints that.

> [!key] Sample fast, show slowly: update digits two to five times a second, smooth for the reader and not for the log, show only the digits the accuracy supports, add a minimum, maximum and trend, and show missing data as missing.`,
  ideas: [
    'A reader follows a few updates a second: sample fast for averaging, update the digits two to five times a second.',
    'An exponential average calms a reading at the price of a lag of about three time constants to settle; use a short constant or none for alarms.',
    'A deadband (change the display only when the value moves by half a step) stops the last digit flickering.',
    'Minimum, maximum, average and a small trend graph are worth more than any instant number; missing data is shown as missing.'
  ],
  pitfalls: [
    'Showing every sample is the most honest display — It is the least readable. The digits blur, and the noise hides the trend. Average, then show slowly, and log the raw data as well.',
    'Smoothing costs nothing — It delays what you see by about three time constants, and flattens a brief event. An alarm must not wait for the display\'s filter.',
    'A dead sensor can show zero — A zero is a value. Show a dash, and let the program tell a missing reading from a real one.'
  ],
  terms: [
    { term: 'Update rate', also: ['refresh rate', 'display rate'], def: 'How often the shown value is replaced. Numbers read comfortably at two to five updates a second; the sampling behind them can be much faster.' },
    { term: 'Exponential moving average', also: ['EMA', 'single-pole low-pass filter', 'smoothing'], def: 'A filter that moves its output by a fixed fraction of the difference to each new reading. It needs one stored number and has a time constant of about the sample time divided by that fraction.' },
    { term: 'Deadband', also: ['display hysteresis'], def: 'A margin within which a change of the reading is ignored by the display, so that a value that wobbles between two neighbouring digits does not flicker.' },
    { term: 'Sparkline', also: ['trend graph'], def: 'A very small line graph, without axes, that shows the recent history of a value next to its number, so that its direction and range can be seen at a glance.' },
    { term: 'Downsampling', also: ['decimation', 'min-max decimation'], def: 'Reducing a long series of points to fewer for a chart. Keeping the minimum and maximum of each bucket preserves the peaks that taking every n-th point would lose.' }
  ],
  sim: 'in-present',
  formulas: [
    {
      name: 'Smoothing constant from a time constant',
      expr: 'alpha = 1 - exp(-dt / tau)',
      tex: '\\alpha = 1 - e^{-\\Delta t / \\tau}',
      vars: {
        alpha: { name: 'smoothing constant', q: 'none', tex: '\\alpha' },
        dt: { name: 'time between readings', q: 'time', unit: 'ms', value: 20, min: 0, tex: '\\Delta t' },
        tau: { name: 'time constant', q: 'time', unit: 'ms', value: 190, min: 0, tex: '\\tau' }
      },
      solveFor: 'alpha',
      note: 'For a small step the common shortcut is alpha = dt / tau. The filter is: shown = shown + alpha × (reading − shown).',
      stories: { alpha: 'A reading arrives every {dt} and the display should lag with a time constant of {tau}. What smoothing constant does the filter use?', tau: 'A filter with a smoothing constant of {alpha} runs on readings {dt} apart. What is its time constant?' }
    },
    {
      name: 'Time to settle',
      expr: 'p = 1 - exp(-ts / tau)',
      tex: 'p = 1 - e^{-t_s / \\tau}',
      vars: {
        p: { name: 'fraction of a step shown', q: 'ratio', unit: '%', min: 0, max: 99.99, tex: 'p' },
        ts: { name: 'time since the step', q: 'time', unit: 'ms', value: 570, min: 0, tex: 't_s' },
        tau: { name: 'time constant', q: 'time', unit: 'ms', value: 190, min: 0, tex: '\\tau' }
      },
      solveFor: 'p',
      note: 'After one time constant the display shows 63 % of a step, after three 95 %, after five 99 %.',
      stories: { p: 'A display filter has a time constant of {tau}. How much of a sudden step does it show after {ts}?', ts: 'A filter has a time constant of {tau}. How long until it shows {p} of a step?' }
    }
  ],
  code: [
    {
      title: 'Smooth, hold the extremes and plot',
      about: 'Reads the pin 50 times a second, smooths the readings with an exponential average, keeps the lowest, highest and average since the start, and every 0.2 s prints one line of name:value pairs that the serial plotter draws as five curves.',
      needs: 'An ESP32 DevKit with the serial plotter (Arduino IDE 2) or any plotter that reads name:value pairs, and a changing voltage on GPIO34: a potentiometer between 3V3 and GND with its wiper on the pin.',
      wiring: [['3V3', 'potentiometer end'], ['GPIO34', 'potentiometer wiper'], ['GND', 'potentiometer other end']],
      blocks: `
        when started
          start serial at (115200) baud
          set [smooth v] to (-1)
          set [lowest v] to (100000)
          set [highest v] to (-100000)
          set [total v] to (0)
          set [count v] to (0)
          set [raw v] to (0)

        every (0.02) seconds
          set [raw v] to (analog read pin (34) in millivolts)
          if <(smooth) < (0)> then
            set [smooth v] to (raw)
          else
            change [smooth v] by ((0.1) * ((raw) - (smooth)))
          end
          set [lowest v] to (smaller of (lowest) and (raw))
          set [highest v] to (larger of (highest) and (raw))
          change [total v] by (raw)
          change [count v] by (1)

        every (0.2) seconds
          print (join [raw:] (raw) [,smooth:] (round (smooth)) [,lowest:] (lowest) [,highest:] (highest) [,average:] (round ((total) / (count))))
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;
        const uint32_t SAMPLE_MS = 20;               // read at 50 Hz
        const uint32_t REPORT_MS = 200;              // show at 5 Hz: the eye cannot read faster
        const float ALPHA = 0.1;                     // time constant about 0.19 s at this sample time
        float raw = 0, smooth = -1, lowest = 1e9, highest = -1e9, total = 0;
        uint32_t count = 0, lastSample, lastReport;

        void setup() {
          Serial.begin(115200);
          lastSample = lastReport = millis();
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastSample >= SAMPLE_MS) {
            lastSample += SAMPLE_MS;
            raw = analogReadMilliVolts(ADC_PIN);
            smooth = smooth < 0 ? raw : smooth + ALPHA * (raw - smooth);   // the exponential average
            lowest = min(lowest, raw);
            highest = max(highest, raw);
            total += raw;
            count++;
          }
          if (now - lastReport >= REPORT_MS) {
            lastReport += REPORT_MS;
            Serial.printf("raw:%.0f,smooth:%.0f,lowest:%.0f,highest:%.0f,average:%.0f\n", raw, smooth, lowest, highest, total / count);
          }
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)
        SAMPLE_MS = 20                               # read at 50 Hz
        REPORT_MS = 200                              # show at 5 Hz: the eye cannot read faster
        ALPHA = 0.1                                  # time constant about 0.19 s at this sample time
        raw, smooth, lowest, highest, total, count = 0, -1, 1e9, -1e9, 0, 0
        last_sample = last_report = time.ticks_ms()

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_sample) >= SAMPLE_MS:
                last_sample = time.ticks_add(last_sample, SAMPLE_MS)
                raw = adc.read_uv() / 1000
                smooth = raw if smooth < 0 else smooth + ALPHA * (raw - smooth)   # the exponential average
                lowest = min(lowest, raw)
                highest = max(highest, raw)
                total += raw
                count += 1
            if time.ticks_diff(now, last_report) >= REPORT_MS:
                last_report = time.ticks_add(last_report, REPORT_MS)
                print("raw:%.0f,smooth:%.0f,lowest:%.0f,highest:%.0f,average:%.0f" % (raw, smooth, lowest, highest, total / count))
      `,
      output: `
        raw:1652,smooth:1649,lowest:1641,highest:1657,average:1650
        raw:1660,smooth:1653,lowest:1641,highest:1660,average:1651
      `,
      notes: ['The sampling loop never waits: it looks at the clock and acts when a period has passed, so the two rates run side by side ([[non-blocking-timing]]).', 'The five curves are the raw reading, the smoothed one, and the extremes and average since the start. Turn the potentiometer and watch the smoothed curve follow with its lag.', 'Show the smoothed value on the display, log the raw one, and give an alarm its own, faster path.']
    }
  ],
  choose: {
    good: ['Fast sampling, a slow display (two to five updates a second) and a smoothing constant chosen for the reader', 'A number with its unit, the minimum and maximum, and a small trend graph', 'Min-max downsampling for long charts'],
    avoid: ['Printing every raw reading as the display', 'A long smoothing constant on a value that drives an alarm', 'Zeros for missing data'],
    check: ['How soon a real change must be visible against how steady the number must be', 'That the digits shown do not exceed the accuracy', 'What the display shows when the sensor fails']
  },
  examples: [
    {
      title: 'Choosing the smoothing constant',
      q: 'A display shows a reading taken every 20 ms. You want the displayed value to reach 95 % of a sudden change within one second. What time constant and what α does that call for?',
      steps: ['95 % of a step is reached after three time constants, so $\\tau = 1 / 3 = 0.33$ s.', 'The smoothing constant is $\\alpha = 1 - e^{-0.02/0.333} = 0.058$.', 'With α = 0.1 the time constant is 0.19 s and 95 % takes 0.57 s: quicker than asked, and noisier.'],
      a: 'A time constant of 0.33 s, which is α of about 0.06 at 50 readings a second. A smaller α smooths more and delays more.'
    }
  ],
  quiz: [
    { q: 'A filter averages with α = 0.1 on readings 20 ms apart. About how long is its time constant?', choices: ['20 ms', '190 ms', '2 s', '10 ms'], a: 1, why: 'The time constant is −Δt / ln(1 − α) = 20 ms / 0.105 = 190 ms (close to Δt / α = 200 ms).' },
    { q: 'A reading changes 20 times a second. How often should the digits on a display be updated?', choices: ['20 times a second, to show everything', 'About two to five times a second', 'Once a minute', 'It does not matter: the eye adapts'], a: 1, why: 'Digits that change faster than a few times a second cannot be read. Keep sampling fast for averaging and refresh the display slowly.' },
    { q: 'Smoothing a reading costs nothing but reduces the noise.', a: false, why: 'It delays the displayed value, by about three time constants to settle, and flattens brief events. An alarm should not wait for it.' },
    { q: 'A sensor is unplugged. What should a display show?', choices: ['0', 'The last value, to keep it steady', 'A dash or "no data"', 'The average of the last minute'], a: 2, why: 'Zero and an old value are both plausible readings. Only a clear "no data" tells the reader that the number is not a measurement.' }
  ],
  applications: [
    'A bench voltmeter or power meter whose number can be read ([[esp-as-a-voltmeter]], [[esp-as-a-power-meter]]).',
    'A sensor dashboard on a small display or a web page.',
    'The serial plotter while tuning a filter or a control loop ([[pid-tuning]]).',
    'A status screen that shows a value, its range for the last hour and a trend.'
  ],
  sources: [
    'Arduino IDE 2 documentation, *Serial Plotter*: the name:value format.',
    'Tufte, *The Visual Display of Quantitative Information*: sparklines and the data-ink principle (the idea of small word-sized graphics is in his later *Beautiful Evidence*).',
    'Oppenheim and Schafer, *Discrete-Time Signal Processing*: the first-order recursive filter.'
  ]
},

/* ================================================================ uncertainty and calibration */
{
  id: 'uncertainty-and-calibration',
  parent: 'the-esp-as-an-instrument',
  title: 'Uncertainty and calibration',
  level: 2,
  short: 'Calibration compares an instrument with something better and corrects its gain and offset; uncertainty states how far the corrected reading can still be from the truth. A result without an uncertainty is a number, not a measurement.',
  keywords: ['calibration', 'uncertainty', 'least squares', 'gain', 'offset', 'linear fit', 'residuals', 'reference', 'traceability', 'expanded uncertainty', 'coverage factor', 'uncertainty budget', 'quantisation', 'drift', 'two-point calibration', 'lookup table', 'non-linearity', 'GUM'],
  prereq: ['accuracy-resolution-precision', 'adc-attenuation-and-calibration', 'oversampling-and-noise'],
  related: ['sensor-calibration', 'esp-as-a-voltmeter', 'the-esp-adc', 'measuring-voltage', 'nvs-and-preferences', 'math:linear-regression', 'math:error-propagation', 'electronics:measurement'],
  body: `**Calibration** compares an instrument with a reference and corrects what differs. **Uncertainty** says how far the corrected reading may still be from the truth. Together they turn "1.65" into "1.650 V ± 0.012 V", which is a statement someone can check. [[adc-attenuation-and-calibration]] gave the two-point recipe; this page does it properly, with more points, and puts a number on what remains.

### The reference

Something better than what you calibrate, by a factor of three, ideally ten: a multimeter whose own accuracy you know (a handheld is good to about half a percent of the reading), a precision voltage-reference chip, or a known resistor with a known current. The reference's own uncertainty is the first item in your budget: you cannot be more certain than the thing you compared with.

### Many points, then a line

- Measure **five or more** points across the range you will use, spread evenly, and average each with at least 64 readings so that noise does not become part of the calibration.
- Fit the straight line $\\text{reading} = g \\times \\text{truth} + b$ by **least squares**. The program below does it; the correction is the inverse: $\\text{truth} = (\\text{reading} - b) / g$. For a good converter the gain is within a few percent of 1 and the offset within tens of millivolts.
- Look at the **residuals**, the distances of the points from the line. If they scatter at random, the line is the right model. If they form a curve, the converter is non-linear: use a table with interpolation between the points instead of a line ([[sensor-calibration]]).

### The uncertainty budget

Every source of doubt is a number in the same unit:

| Source | How to estimate it (as a standard uncertainty) |
|---|---|
| The reference | its stated limit divided by √3 (limits of a range: a rectangular distribution) |
| Noise | the standard deviation of the readings divided by √n for an average of n |
| The step | one count divided by √12 (the rms rounding error of a quantiser) |
| The fit | the rms of the residuals |
| Drift | what you measure by repeating the calibration in the temperature and after the time of use |

Independent contributions add **in quadrature**: $u = \\sqrt{u_1^2 + u_2^2 + \\cdots}$. Multiply by a coverage factor, $k = 2$, to get the **expanded uncertainty** U, which covers the true value in about 95 % of cases if the errors are roughly normal. Quote it: "1.650 V ± 0.012 V (k = 2)".

### It does not last

A calibration holds for the conditions of the measurement: the chip, the attenuation, the supply, roughly the temperature, and for a time. Change any of them, or let a year pass, and compare again. Keep the gain, the offset and the date in non-volatile storage with the device ([[nvs-and-preferences]]).

> [!key] Compare with a better reference at five or more points, fit a line by least squares, read the residuals, and write the result with an uncertainty built from the reference, the noise, the step and the fit. A calibration is good for one set of conditions and one stretch of time.`,
  ideas: [
    'Calibrate against a reference at least three times better, over five or more points, each averaged to remove noise.',
    'A least-squares line gives the gain and offset; the correction is its inverse; the residuals show whether a line is the right model.',
    'The uncertainty combines the reference, noise, quantisation and the fit in quadrature; multiplying by k = 2 gives about 95 % coverage.',
    'A calibration is valid only for the chip, range, supply and temperature it was made in, and for a limited time.'
  ],
  pitfalls: [
    'Two points are enough for any converter — They fix a line, and cannot show that the converter is not a line. Five or more points reveal curvature in the residuals.',
    'After calibration the reading is exact — It is closer to the truth by the amount of the gain and offset error, and still uncertain by the reference, noise, step and fit.',
    'A calibration made once is good for ever — Temperature, supply, ageing and a change of attenuation or chip all move it. Date it, and repeat it.'
  ],
  terms: [
    { term: 'Calibration', also: ['calibrate'], def: 'Comparing an instrument with a better reference at known points and deriving a correction, such as a gain and an offset, that brings its readings closer to the truth.' },
    { term: 'Measurement uncertainty', also: ['uncertainty', 'error bar'], def: 'A statement of how far a result may be from the true value, usually given as a number with a unit and the confidence it carries. A result without it is incomplete.' },
    { term: 'Least squares', also: ['linear regression', 'line fit'], def: 'The way of choosing a line through scattered points that makes the sum of the squared distances from the points to the line as small as possible.' },
    { term: 'Residual', also: ['fit error'], def: 'The distance of a data point from the fitted line. Random residuals say the line is a good model; residuals that form a curve say the instrument is not linear.' },
    { term: 'Expanded uncertainty', also: ['coverage factor', 'k = 2'], def: 'The combined standard uncertainty multiplied by a coverage factor k, usually 2, to give an interval that holds the true value in about 95 % of cases.' }
  ],
  sim: 'in-calibrate',
  formulas: [
    {
      name: 'Rounding uncertainty of one step',
      expr: 'uq = lsb / sqrt(12)',
      tex: 'u_q = \\frac{\\mathrm{lsb}}{\\sqrt{12}}',
      vars: {
        uq: { name: 'standard uncertainty from the step', q: 'voltage', unit: 'mV', tex: 'u_q' },
        lsb: { name: 'size of one count', q: 'voltage', unit: 'mV', value: 0.8, min: 0, tex: '\\mathrm{lsb}' }
      },
      solveFor: 'uq',
      note: 'The rms rounding error of a converter when the true value is equally likely anywhere inside a step: the step divided by the square root of 12, about 0.29 of a step.',
      stories: { uq: 'A converter has a step of {lsb}. What standard uncertainty does the rounding contribute?' }
    },
    {
      name: 'Expanded uncertainty of a reading',
      expr: 'U = k * sqrt(ur^2 + un^2 + uq^2 + uf^2)',
      tex: 'U = k\\,\\sqrt{u_r^2 + u_n^2 + u_q^2 + u_f^2}',
      vars: {
        U: { name: 'expanded uncertainty', q: 'voltage', unit: 'mV', tex: 'U' },
        k: { name: 'coverage factor', q: 'none', value: 2, min: 1, tex: 'k' },
        ur: { name: 'reference', q: 'voltage', unit: 'mV', value: 4.8, min: 0, tex: 'u_r' },
        un: { name: 'noise of the average', q: 'voltage', unit: 'mV', value: 0.3, min: 0, tex: 'u_n' },
        uq: { name: 'rounding of the step', q: 'voltage', unit: 'mV', value: 0.23, min: 0, tex: 'u_q' },
        uf: { name: 'residual of the fit', q: 'voltage', unit: 'mV', value: 4.4, min: 0, tex: 'u_f' }
      },
      solveFor: 'U',
      note: 'For independent contributions. A reference limit of ±8.25 mV (0.5 % of 1650 mV) is a standard uncertainty of 4.8 mV (divide by √3). Whichever term is largest is the one worth reducing.',
      stories: { U: 'A calibrated reading has standard uncertainties of {ur} from the reference, {un} from noise, {uq} from the step and {uf} from the fit. What is the expanded uncertainty for k = {k}?' }
    }
  ],
  code: [
    {
      title: 'Fit a calibration line from five points',
      about: 'You measure five voltages with the ESP (each an average of many readings) and with a trusted multimeter, and type both lists into the program. It fits reading = gain × truth + offset by least squares, prints the gain, the offset, the residual rms and the worst residual, then shows each point before and after the correction.',
      needs: 'Any ESP board and the serial monitor; the numbers come from your own measurements (for example with the program of the first page and a multimeter, at five divider settings).',
      blocks: `
        when started
          start serial at (115200) baud
          set [truth v] to (list (300) (800) (1300) (1800) (2300))     // the multimeter, in mV
          set [reading v] to (list (318) (817) (1331) (1840) (2352))   // the ESP, in mV
          set [meanX v] to ((sum of [truth v]) / (5))
          set [meanY v] to ((sum of [reading v]) / (5))
          set [sxx v] to (0)
          set [sxy v] to (0)
          for each [i v] in (numbers 1 to 5)
            change [sxx v] by (((item (i) of [truth v]) - (meanX)) * ((item (i) of [truth v]) - (meanX)))
            change [sxy v] by (((item (i) of [truth v]) - (meanX)) * ((item (i) of [reading v]) - (meanY)))
          end
          set [gain v] to ((sxy) / (sxx))
          set [offset v] to ((meanY) - ((gain) * (meanX)))
          set [squares v] to (0)
          set [worst v] to (0)
          for each [i v] in (numbers 1 to 5)
            set [r v] to ((item (i) of [reading v]) - (((gain) * (item (i) of [truth v])) + (offset)))
            change [squares v] by ((r) * (r))
            set [worst v] to (larger of (worst) and (absolute value of (r)))
          end
          print (join [gain ] (gain) [  offset ] (offset) [ mV  residual rms ] (square root of ((squares) / (3))) [ mV  worst ] (worst) [ mV])
          for each [i v] in (numbers 1 to 5)
            print (join (item (i) of [truth v]) [ mV: reads ] (item (i) of [reading v]) [ , corrected ] (((item (i) of [reading v]) - (offset)) / (gain)))
          end
      `,
      cpp: String.raw`
        const int N = 5;
        const float TRUTH_MV[N]   = {300, 800, 1300, 1800, 2300};    // what the multimeter read at each point
        const float READING_MV[N] = {318, 817, 1331, 1840, 2352};    // what the ESP reported, averaged, at the same points

        void setup() {
          Serial.begin(115200);
          float meanX = 0, meanY = 0;
          for (int i = 0; i < N; i++) { meanX += TRUTH_MV[i]; meanY += READING_MV[i]; }
          meanX /= N;
          meanY /= N;
          float sxx = 0, sxy = 0;
          for (int i = 0; i < N; i++) {
            sxx += (TRUTH_MV[i] - meanX) * (TRUTH_MV[i] - meanX);
            sxy += (TRUTH_MV[i] - meanX) * (READING_MV[i] - meanY);
          }
          float gain = sxy / sxx;                          // reading = gain * truth + offset
          float offset = meanY - gain * meanX;
          float squares = 0, worst = 0;
          for (int i = 0; i < N; i++) {
            float r = READING_MV[i] - (gain * TRUTH_MV[i] + offset);   // the residual: distance from the line
            squares += r * r;
            worst = max(worst, fabs(r));
          }
          Serial.printf("gain %.4f  offset %.2f mV  residual rms %.2f mV  worst %.2f mV\n", gain, offset, sqrt(squares / (N - 2)), worst);
          for (int i = 0; i < N; i++) {
            Serial.printf("%4.0f mV: reads %4.0f, corrected %.1f\n", TRUTH_MV[i], READING_MV[i], (READING_MV[i] - offset) / gain);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import math

        TRUTH_MV = [300, 800, 1300, 1800, 2300]          # what the multimeter read at each point
        READING_MV = [318, 817, 1331, 1840, 2352]        # what the ESP reported, averaged, at the same points
        N = len(TRUTH_MV)

        mean_x = sum(TRUTH_MV) / N
        mean_y = sum(READING_MV) / N
        sxx = sum((x - mean_x) * (x - mean_x) for x in TRUTH_MV)
        sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(TRUTH_MV, READING_MV))
        gain = sxy / sxx                                 # reading = gain * truth + offset
        offset = mean_y - gain * mean_x
        residuals = [y - (gain * x + offset) for x, y in zip(TRUTH_MV, READING_MV)]   # the distances from the line
        rms = math.sqrt(sum(r * r for r in residuals) / (N - 2))
        print("gain %.4f  offset %.2f mV  residual rms %.2f mV  worst %.2f mV" % (gain, offset, rms, max(abs(r) for r in residuals)))
        for x, y in zip(TRUTH_MV, READING_MV):
            print("%4.0f mV: reads %4.0f, corrected %.1f" % (x, y, (y - offset) / gain))
      `,
      output: `
        gain 1.0182  offset 7.94 mV  residual rms 4.36 mV  worst 5.50 mV
         300 mV: reads  318, corrected 304.5
         800 mV: reads  817, corrected 794.6
        1300 mV: reads 1331, corrected 1299.4
        1800 mV: reads 1840, corrected 1799.3
        2300 mV: reads 2352, corrected 2302.2
      `,
      notes: ['The data are an illustration. Before the correction the worst error is 52 mV; after it, 5.5 mV: the line removed the gain and offset, the residual rms is what is left.', 'The residuals here (+4.6, −5.5, −0.6, −0.7, +2.2 mV) scatter around zero, so a line is a fair model. A run of same-sign residuals, then the other sign, means a curve.', 'Put the gain and offset into the voltmeter\'s program or into non-volatile storage, with the date and the conditions of the calibration ([[nvs-and-preferences]]).']
    }
  ],
  examples: [
    {
      title: 'What is the uncertainty of the voltmeter?',
      q: 'A voltmeter has been calibrated against a multimeter specified as ±0.5 % of reading at 1650 mV. The noise of the average is 0.3 mV, the step is 0.8 mV and the fit residual has an rms of 4.4 mV. What is the expanded uncertainty at 1650 mV (k = 2)?',
      steps: ['The reference: ±0.5 % of 1650 mV is ±8.25 mV; as a rectangular distribution its standard uncertainty is $8.25/\\sqrt{3} = 4.8$ mV.', 'The step: $0.8/\\sqrt{12} = 0.23$ mV.', 'Combine in quadrature: $\\sqrt{4.8^2 + 0.3^2 + 0.23^2 + 4.4^2} = \\sqrt{42.5} = 6.5$ mV, and $U = 2 \\times 6.5 = 13$ mV.'],
      a: 'U = 13 mV, about 0.8 % of 1650 mV: "1.650 V ± 0.013 V (k = 2)". The reference and the fit dominate; averaging more readings would change nothing.'
    }
  ],
  quiz: [
    { q: 'Which is the best reason to use five calibration points instead of two?', choices: ['A line needs five points', 'Five points show whether a straight line is the right model', 'It makes the reference more accurate', 'It removes the noise of the reference'], a: 1, why: 'Two points always fit a line exactly. With five, the residuals show whether the converter is really linear or has a curve.' },
    { q: 'Uncertainty contributions of 3 mV, 4 mV and 0 mV (three independent sources) combine to:', choices: ['7 mV', '5 mV', '3.5 mV', '12 mV'], a: 1, why: 'Independent contributions add in quadrature: the square root of 9 + 16 = 5 mV.' },
    { q: 'After a calibration, the reading is exact.', a: false, why: 'The correction removes the gain and offset error found with the reference. The reference\'s own uncertainty, the noise, the step and the fit residual remain.' },
    { q: 'You calibrated a voltmeter at 11 dB attenuation. Later you switch the program to 6 dB. What now?', choices: ['The calibration still holds', 'It does not hold: calibrate again for the new setting', 'Only the offset changes', 'Only the gain changes'], a: 1, why: 'Each attenuation has its own gain and non-linearity. A calibration belongs to the conditions it was made in.' }
  ],
  applications: [
    'Bringing a home-built voltmeter, battery gauge or thermometer to a stated accuracy.',
    'Checking a batch of sensors against one reference and giving each its own constants.',
    'Deciding whether a measurement is good enough for its purpose by looking at the budget.',
    'Documenting a product\'s accuracy for a customer or a test report.'
  ],
  sources: [
    'JCGM 100, *Evaluation of measurement data: Guide to the expression of uncertainty in measurement* (the GUM): standard and expanded uncertainty and the combination in quadrature.',
    'Espressif, *ESP-IDF Programming Guide*, ADC calibration: the factory calibration data and the calibration driver.',
    'Bevington and Robinson, *Data Reduction and Error Analysis for the Physical Sciences*: least-squares fits and residuals.'
  ]
}
);
