/* HYPER-ESP32 · content/passive-components.js
 *
 * Topic "passive-components": the resistors, capacitors, dividers, filters, potentiometers, thermistors, crystals,
 * ferrites, protection parts and breadboards around an ESP. Ten pages; the simulations are in sims/passive-components.js
 * (every id starts with pc-).
 */
Hyper.add(
/* ================================================================ resistors-in-esp-circuits */
{
  id: 'resistors-in-esp-circuits',
  parent: 'passive-components',
  title: 'Resistors: limiting, pulling, dividing',
  level: 1,
  short: 'Almost every resistor next to an ESP does one of four jobs: it limits a current, pulls a pin to a rest level, divides a voltage, or sits in series with a signal to protect and tame it. Knowing the job tells you the value.',
  keywords: ['resistor', 'LED resistor', 'current limiting', 'pull-up', 'pull-down', 'series resistor', 'E12', 'E24', 'tolerance', 'colour code', 'Ohm\'s law', '330 ohm', '10k', '1/8 W'],
  prereq: ['three-volt-logic', 'pin-current-limits', 'electronics:resistance-ohms-law'],
  related: ['pull-ups-and-pull-downs', 'leds', 'voltage-dividers-for-inputs', 'protection-parts', 'i2c-pull-ups-and-bus-problems', 'electronics:resistors'],
  body: `A resistor does one thing: it turns a voltage across it into a current, $I = V/R$. Around a microcontroller that single law is used in four ways, and once you know which of them you want, the value almost chooses itself.

### The four jobs

| Job | Where | Typical value | Why that size |
|---|---|---|---|
| **Limit a current** | in series with an LED | 220 Ω – 1 kΩ | a few milliamps is bright enough, and well inside what a pin can give |
| **Pull a pin to a level** | from a pin to 3.3 V or to ground | 10 kΩ (I2C: 2.2 – 4.7 kΩ) | weak enough to be overridden by a button or a driver, strong enough to beat stray pick-up |
| **Divide a voltage** | two in series, tapped in the middle | 10 kΩ – 1 MΩ in total | high enough not to waste current, low enough for the ADC input |
| **Sit in series with a signal** | between a pin and the outside world | 100 Ω – 1 kΩ | limits the current if something goes wrong, softens fast edges |

### Sizing an LED resistor

The resistor takes up the voltage the LED does not: $R = (V_{CC} - V_f)/I$. A red LED drops about 2.0 V; from 3.3 V at 5 mA that is $1.3\\ \\mathrm{V}/5\\ \\mathrm{mA} = 260\\ \\Omega$, and the nearest standard value, 270 Ω, gives 4.8 mA. Blue and white LEDs drop about 3.0 V, which leaves only 0.3 V for the resistor, so the current swings widely from one LED to the next: use the calculator below and try the simulation.

### Standard values and tolerance

Resistors come only in **E-series** values: 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2 (E12) times a power of ten, with 24 values per decade in E24. A computed 260 Ω is therefore never bought; you take 270 Ω. Cheap parts are 5 % (E12 or E24), good ones 1 % (E96). For an LED or a pull-up the tolerance does not matter; for a divider that feeds an ADC it does.

### Power is never the problem here

A resistor passing 5 mA at 1.3 V dissipates 6.5 mW; the common eighth-watt part is rated for 125 mW. Power matters only for shunts and for resistors across a battery or a supply, such as the 1 Ω in a current sense.

### What goes wrong

- **No resistor.** An LED from a pin to ground with nothing in series demands whatever the pin can give. See [[pin-current-limits]].
- **A pull resistor that is too strong.** 1 kΩ to 3.3 V on a button input wastes 3.3 mA whenever the button is held, and may fight a strapping pin ([[strapping-pins]]).
- **A pull resistor that is too weak.** At 1 MΩ a long wire or a finger still moves the pin: it floats in all but name.

> [!key] Choose the resistor by its job: a few hundred ohms in series with an LED, 10 kΩ for a pull, hundreds of kilohms for a divider, a few hundred ohms in series with a signal. Compute the value from Ohm's law, then take the nearest value in the E12 or E24 series.`,
  ideas: [
    'A resistor turns voltage into current, I = V/R; around an ESP it limits, pulls, divides or protects.',
    'An LED resistor is (supply − LED voltage) / wanted current; blue and white LEDs leave so little voltage that the current varies widely.',
    'Pull-up and pull-down resistors are about 10 kΩ: weak enough to be overridden, strong enough to hold the level.',
    'Resistors come in E-series values; compute the ideal value and take the nearest standard one.'
  ],
  pitfalls: [
    'A resistor next to a pin is always a pull-up — It may limit, divide or protect. Look at the other end: to an LED, to ground, to a supply, to a long wire.',
    'A smaller resistor makes a more reliable pull-up — Smaller means more wasted current and a pin that fights whatever should drive it. 10 kΩ is a compromise that works almost everywhere.',
    'The LED resistor must be exactly the calculated value — The LED has a spread of ±0.15 V or more; any value within 20 % gives much the same brightness, except with blue and white LEDs on 3.3 V.'
  ],
  terms: [
    { term: 'Current-limiting resistor', also: ['LED resistor', 'series resistor for an LED'], def: 'A resistor in series with a load that sets the current by Ohm\'s law. For an LED it equals the supply voltage minus the LED\'s forward voltage, divided by the current wanted.' },
    { term: 'E series', also: ['E6', 'E12', 'E24', 'E96', 'preferred values'], def: 'The agreed set of standard resistor values, spaced so that neighbouring values differ by about the tolerance. E12 has 12 values per decade (1.0, 1.2, 1.5 …), E24 has 24.' },
    { term: 'Tolerance', also: ['±1 %', '±5 %'], def: 'How far a resistor\'s real value may be from the printed one. It decides how exactly a divider divides; for an LED resistor it hardly matters.' },
    { term: 'Power rating', also: ['eighth-watt', '1/8 W', '0805'], def: 'The heat a resistor can lose without damage. Small surface-mount and 1/8 W parts handle 100 mW or more, far above what a signal circuit dissipates.' },
    { term: 'Series resistor', also: ['damping resistor', 'source resistor'], def: 'A small resistor placed in line with a signal, close to its driver. It limits fault current and slows the edges a little, which calms ringing and radio noise.' }
  ],
  choose: {
    good: ['330 Ω for a standard LED on 3.3 V: about 4 mA, bright enough indoors', '10 kΩ for button and enable pull-ups and for MOSFET gate pull-downs', '100 kΩ and up for a battery divider that must not drain the cell', 'A 1 % part wherever a ratio sets an accuracy'],
    avoid: ['No resistor at all in series with an LED', 'Pull resistors of 1 kΩ or less on inputs that other parts must drive', 'Pull resistors of 1 MΩ or more on long wires or noisy places'],
    check: ['What the LED\'s voltage really is at the current you want (blue and white LEDs differ most)', 'That the nearest E-series value still gives a safe current', 'The power rating when a resistor sits across a supply or shunts a large current']
  },
  code: [
    {
      title: 'A button with a 10 kΩ pull-up lights an LED',
      about: 'The button pulls its node to ground; a 10 kΩ resistor holds it at 3.3 V otherwise, and a 1 kΩ series resistor protects the pin from a wiring slip. The LED has its own 330 Ω. The pin has no internal pull-up enabled: the resistor is the pull.',
      needs: 'An ESP32 DevKit, a push button, an LED, and resistors of 330 Ω, 1 kΩ and 10 kΩ.',
      wiring: [['3V3', '10 kΩ → node A'], ['node A', 'button → GND'], ['node A', '1 kΩ → GPIO27'], ['GPIO4', '330 Ω → LED anode, cathode → GND']],
      blocks: `
        when started
          set pin (4) as [output v]
          set pin (27) as [input v]
        forever
          if <(read pin (27)) = [LOW v]> then    // pressed: the button pulls the node to ground
            set pin (4) to [HIGH v]
          else
            set pin (4) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int LED = 4;                 // GPIO4 -> 330 ohm -> LED -> GND
        const int BUTTON = 27;             // node A -> 1 k -> GPIO27, with 10 k up to 3V3

        void setup() {
          pinMode(LED, OUTPUT);
          pinMode(BUTTON, INPUT);          // no internal pull: the external 10 k does it
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;   // the button pulls the node to ground
          digitalWrite(LED, pressed);
        }
      `,
      py: String.raw`
        from machine import Pin

        led = Pin(4, Pin.OUT)              # GPIO4 -> 330 ohm -> LED -> GND
        button = Pin(27, Pin.IN)           # node A -> 1 k -> GPIO27, with 10 k up to 3V3

        while True:
            pressed = button.value() == 0  # the button pulls the node to ground
            led.value(pressed)
      `,
      notes: ['The 1 kΩ in series with the input forms an RC low-pass with the pin\'s capacitance of a few picofarads: far too fast to matter here.', 'On an ESP32-C3 use GPIO4 for the LED and GPIO5 for the button; keep clear of GPIO2, 8 and 9 ([[strapping-pins]]).']
    }
  ],
  formulas: [
    {
      name: 'LED series resistor',
      expr: 'R = (Vcc - Vf)/I',
      tex: 'R = \\frac{V_{\\mathrm{CC}} - V_f}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{CC}}' },
        Vf: { name: 'LED forward voltage', q: 'voltage', unit: 'V', value: 2.0, tex: 'V_f' },
        I: { name: 'wanted LED current', q: 'current', unit: 'mA', value: 5 }
      },
      note: 'The result is the ideal value: take the nearest E12 or E24 value and recompute the current. A pin should not give more than a few milliamps for this to be safe.',
      stories: { R: 'An LED with a forward voltage of {Vf} runs from a {Vcc} pin at {I}. What series resistor does it need?' },
      practice: { unknowns: ['R', 'I'] }
    }
  ],
  examples: [
    {
      title: 'A white LED on 3.3 V',
      q: 'A white LED drops about 3.0 V and should run at 5 mA from a 3.3 V pin. Choose the resistor, and see what an LED with a forward voltage 0.15 V higher or lower does.',
      steps: ['The resistor sees $3.3 - 3.0 = 0.3$ V, so $R = 0.3/0.005 = 60\\ \\Omega$.', 'The nearest E12 values are 56 Ω and 68 Ω. With 68 Ω the current is $0.3/68 \\approx 4.4$ mA.', 'An LED of 3.15 V leaves 0.15 V: $0.15/68 \\approx 2.2$ mA. One of 2.85 V leaves 0.45 V: $0.45/68 \\approx 6.6$ mA.'],
      a: 'About 68 Ω, giving 4.4 mA. A spread of ±0.15 V in the LED changes the current from 2.2 to 6.6 mA — a factor of three. With a red LED at 2.0 V the same spread changes it by only ±12 %.'
    }
  ],
  quiz: [
    { q: 'A red LED (about 2.0 V) is to run at 5 mA from a 3.3 V pin. Which standard resistor is the best choice?', choices: ['27 Ω', '270 Ω', '2.7 kΩ', '27 kΩ'], a: 1, why: '(3.3 − 2.0) V / 5 mA = 260 Ω; the nearest E12 value is 270 Ω. 27 Ω would pass about 48 mA, far more than a pin should give; 2.7 kΩ gives only 0.5 mA.' },
    { q: 'Why does a white LED on 3.3 V show a much bigger brightness spread between samples than a red one?', choices: ['White LEDs are made worse', 'Its forward voltage is close to the supply, so a small change in it is a large change in the voltage across the resistor', 'The resistor value is different', 'The pin supplies less voltage'], a: 1, why: 'The current is set by the voltage left over for the resistor. With 0.3 V left, ±0.15 V from the LED is ±50 %; with 1.3 V left, it is ±12 %.' },
    { q: 'A 10 kΩ pull-up is replaced by 100 Ω because "stronger is more reliable". What is the main cost?', choices: ['The pin can no longer read the button', 'Holding the button wastes 33 mA, and anything that should drive the pin must fight it', 'The resistor will burn', 'Nothing: smaller is always better'], a: 1, why: '3.3 V across 100 Ω is 33 mA, close to the limit of a single pin and a waste on a battery. A pull is meant to be weak so that a button or another driver easily overrides it.' },
    { q: 'You need a 2.2 kΩ resistor, but your drawer has E12 values only. Is 2.2 kΩ available?', a: true, why: '2.2 is one of the E12 (and E6) values: 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2.' }
  ],
  applications: [
    'The 330 Ω or 1 kΩ in front of every indicator LED on a board.',
    'The 10 kΩ pull-ups on the EN pin and on boot and user buttons of a development board.',
    'The 4.7 kΩ pull-ups of an I2C bus and the 120 Ω terminations of a CAN bus.',
    'Series resistors of 22 – 100 Ω on fast SPI and I2S lines to calm ringing.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*, electrical characteristics: input and output voltage levels and pin currents.',
    'Espressif, *ESP32 Hardware Design Guidelines*: the pull-up and series-resistor components on strapping, EN and signal pins.',
    'IEC 60063, *Preferred number series for resistors and capacitors* (the E series).'
  ],
  sim: 'pc-led-resistor'
},

/* ================================================================ capacitors-in-esp-circuits */
{
  id: 'capacitors-in-esp-circuits',
  parent: 'passive-components',
  title: 'Capacitors: decoupling, bulk, timing',
  level: 1,
  short: 'A capacitor is a tiny local reservoir of charge. Near the chip it supplies the sudden gulps of current that the supply cannot deliver in time; on a pin with a resistor it makes a delay.',
  keywords: ['capacitor', 'decoupling', 'bypass', '100 nF', 'bulk capacitor', '10 uF', 'electrolytic', 'ceramic', 'X5R', 'DC bias', 'ESR', 'RC delay', 'EN pin', 'brownout', 'time constant'],
  prereq: ['resistors-in-esp-circuits', 'the-3v3-rail', 'electronics:capacitors'],
  related: ['current-peaks-and-capacitors', 'brownout', 'rc-filters-and-debounce', 'regulators-ldo-and-buck', 'electronics:decoupling', 'electronics:rc-transient'],
  body: `A radio chip does not draw its current steadily. When the ESP transmits, its demand jumps from tens of milliamps to a few hundred in microseconds (the catalogue gives 335 mA for the ESP32-C3 and about 340 mA for the S3 at full transmit power). The regulator, the cable and the battery are all a little too slow and a little too resistive to follow instantly. A capacitor beside the chip is a reservoir that gives that charge for the first few microseconds, while the rest catches up.

### Three jobs

1. **Decoupling (bypass).** A **100 nF** ceramic at every supply pin, as close to the pin as the board allows, short and wide connections to ground. It supplies the very fast current of the digital logic, and keeps that noise from travelling onto the rail. Modules already have these inside; your own board must add its own where it connects other chips.
2. **Bulk.** **10 – 100 µF**, close to the module's supply pin, for the slower, larger bursts of the radio. How much? The charge in one burst is $Q = I\\,t$, and the capacitor must supply it while the rail sags by no more than $\\Delta V$: $C = I\\,t/\\Delta V$. For 340 mA over 100 µs and a 0.1 V droop that is 340 µF; a regulator that reacts faster needs much less.
3. **Timing.** A capacitor with a resistor takes time to charge: $\\tau = RC$. A 10 kΩ pull-up on the EN pin with 1 µF to ground gives 10 ms, which holds the chip in reset until the supply has settled. The next page, [[rc-filters-and-debounce]], uses the same idea to smooth signals.

### Which kind

| Type | Strength | Weakness |
|---|---|---|
| **Ceramic (X5R, X7R)** | very low ESR, fast, small, no polarity | a 10 µF part may keep under half its value at 3.3 V (DC bias), and loses more when hot |
| **Aluminium electrolytic** | cheap, large values | higher ESR, polarised, wears out, slower |
| **Tantalum, polymer** | compact, low ESR | tantalum fails short if over-stressed; polarised |

Use ceramics for decoupling and bulk where you can; check the *effective* value at your voltage in the datasheet curve, and use a part rated for at least twice the working voltage.

### Traps

- **A big capacitor far away** is a small one: the wiring's inductance and resistance cut it off from the pins. Place it close.
- **A huge bulk capacitor on a regulator** can make it unstable or draw a large charging surge at power-up. Follow the regulator's datasheet.
- **Reversed electrolytic** vents and can burst. The stripe marks the negative side.

> [!key] Put 100 nF at every supply pin and 10 – 100 µF near the module; the charge a burst needs is current times time, and the capacitor must hold it with the voltage staying above the brownout limit. With a resistor the same part is a delay: τ = RC.`,
  ideas: [
    'A capacitor next to the chip supplies the fast current spikes that the supply cannot follow in time.',
    '100 nF ceramic at each supply pin plus 10 – 100 µF bulk near the module is the standard pattern.',
    'The capacitance needed for a burst is current times duration divided by the allowed droop.',
    'With a resistor a capacitor gives a delay of τ = RC: the EN pin uses it to start the chip only when the rail is steady.'
  ],
  pitfalls: [
    'One big capacitor replaces the small ones — They do different jobs: the small ceramic is fast and near the pin, the large one is slower and holds more charge. Use both.',
    'A 10 µF ceramic is 10 µF at any voltage — The capacitance of a class-2 ceramic falls as the DC voltage rises; at 3.3 V a small-case part may give half its rating.',
    'The capacitor can sit anywhere on the rail — The copper between it and the pin has inductance and resistance. A capacitor 5 cm away does little against microsecond spikes.'
  ],
  terms: [
    { term: 'Decoupling capacitor', also: ['bypass capacitor', 'supply capacitor', '100 nF'], def: 'A small capacitor, usually 100 nF, placed across a chip\'s supply pins to supply its fast current spikes locally and keep the noise off the rail.' },
    { term: 'Bulk capacitor', also: ['reservoir capacitor', 'bypass electrolytic'], def: 'A larger capacitor, 10 – 100 µF, near a module to supply the slower, larger current of a radio burst while the regulator catches up.' },
    { term: 'ESR', also: ['equivalent series resistance'], def: 'The small resistance that every real capacitor has in series with its capacitance. Low ESR lets it deliver a sudden current without the voltage dropping.' },
    { term: 'DC bias', also: ['capacitance derating', 'voltage coefficient'], def: 'The loss of capacitance of a class-2 ceramic (X5R, X7R) when a voltage is applied. A part labelled 10 µF may give under half that at its working voltage.' },
    { term: 'Time constant', also: ['τ', 'RC time'], def: 'For a resistor and capacitor, the product τ = RC. After one τ a charging capacitor has reached 63 % of its final voltage; after five, over 99 %.' }
  ],
  choose: {
    good: ['100 nF X7R ceramic at every supply pin of every chip on your board', '10 – 22 µF ceramic, or 47 – 100 µF polymer, beside the module for radio bursts', '10 kΩ with 1 µF on EN to delay the start-up', 'Capacitors rated for double the working voltage'],
    avoid: ['Placing the capacitor far from the pin it serves', 'Counting on the labelled value of a small-case ceramic at full voltage', 'Reversing a polarised capacitor', 'A large capacitor on the output of a regulator that does not allow it'],
    check: ['The size of the burst: transmit current and duration from the datasheet', 'The effective capacitance at 3.3 V (the DC-bias curve)', 'The regulator\'s datasheet for the minimum and maximum output capacitance and ESR', 'How the rail looks on an oscilloscope during a transmit burst ([[the-oscilloscope]])']
  },
  code: [
    {
      title: 'A capacitance meter from a resistor and the ADC',
      about: 'Charge an unknown capacitor through a known 10 kΩ resistor from a pin, and time how long the voltage takes to reach 63.2 % of 3.3 V. That time is one τ, so the capacitance is the time divided by the resistance. Works from about 1 µF to a few hundred µF.',
      needs: 'An ESP32 DevKit, a 10 kΩ resistor and the capacitor to measure (no electrolytic the wrong way round).',
      wiring: [['GPIO25', '10 kΩ → node A'], ['node A', 'capacitor + → GND'], ['node A', 'GPIO34 (ADC1, input only)']],
      libs: [],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (25) as [output v]
        forever
          set pin (25) to [LOW v]                    // discharge through the resistor
          wait (3) seconds
          set pin (25) to [HIGH v]                   // start charging
          set [t0 v] to (microseconds since start)
          repeat until <(analog read pin (34) in millivolts) > (2085)>    // 63.2 % of 3300 mV
          end
          set [tau v] to ((microseconds since start) - (t0))
          print (join [Capacitance in uF: ] ((tau) / (10000)))
        end
      `,
      cpp: String.raw`
        const int CHARGE_PIN = 25;               // GPIO25 -> 10 k -> node A
        const int SENSE_PIN = 34;                // node A -> GPIO34 (ADC1)
        const float R_OHMS = 10000.0;
        const uint32_t TARGET_MV = 2085;         // 63.2 % of 3300 mV

        void setup() {
          Serial.begin(115200);
          pinMode(CHARGE_PIN, OUTPUT);
        }

        void loop() {
          digitalWrite(CHARGE_PIN, LOW);         // discharge through the resistor
          delay(3000);
          digitalWrite(CHARGE_PIN, HIGH);        // start charging
          uint32_t t0 = micros();
          while (analogReadMilliVolts(SENSE_PIN) < TARGET_MV) {
            if (micros() - t0 > 5000000) break;  // give up after 5 s
          }
          uint32_t tau = micros() - t0;          // one time constant, in microseconds
          Serial.printf("Capacitance: %.2f uF\n", tau / R_OHMS);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        charge = Pin(25, Pin.OUT)                          # GPIO25 -> 10 k -> node A
        sense = ADC(Pin(34), atten=ADC.ATTN_11DB)          # node A -> GPIO34 (ADC1)
        R_OHMS = 10000
        TARGET_UV = 2085000                                # 63.2 % of 3300 mV, in microvolts

        while True:
            charge.value(0)                                # discharge through the resistor
            time.sleep(3)
            charge.value(1)                                # start charging
            t0 = time.ticks_us()
            while sense.read_uv() < TARGET_UV:
                if time.ticks_diff(time.ticks_us(), t0) > 5000000:   # give up after 5 s
                    break
            tau = time.ticks_diff(time.ticks_us(), t0)     # one time constant, in microseconds
            print("Capacitance: %.2f uF" % (tau / R_OHMS))
      `,
      output: `
        Capacitance: 9.84 uF
      `,
      notes: ['The result includes the tolerance of the resistor (use a 1 % part) and of the 3.3 V rail, so expect an error of a few per cent: it is a way to tell 10 µF from 100 µF, not a measuring instrument.', 'On an ESP32-C3 or S3 use another ADC1 pin: GPIO3 for the sense pin on the C3, GPIO4 on the S3, and any free output for charging.']
    }
  ],
  formulas: [
    {
      name: 'Capacitance to carry a current burst',
      expr: 'C = I*t/dV',
      tex: 'C = \\frac{I\\, t}{\\Delta V}',
      vars: {
        C: { name: 'capacitance needed', q: 'capacitance', unit: 'µF' },
        I: { name: 'current the capacitor must supply', q: 'current', unit: 'mA', value: 340 },
        t: { name: 'time until the supply takes over', q: 'time', unit: 'µs', value: 100 },
        dV: { name: 'allowed sag of the rail', q: 'voltage', unit: 'V', value: 0.1, tex: '\\Delta V' }
      },
      note: 'Assumes the capacitor supplies the whole current for the whole time. Real capacitors have ESR and lose capacitance with DC bias, so use this as the minimum and add margin.',
      stories: { C: 'A radio burst needs {I} for {t} before the regulator catches up, and the rail may sag by {dV}. What capacitance is needed?' },
      practice: { unknowns: ['C', 'dV'] }
    },
    {
      name: 'RC time constant',
      expr: 'tau = R*C',
      tex: '\\tau = R\\, C',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1 }
      },
      note: 'After one τ a charging capacitor is at 63 % of its final voltage; after 3τ, 95 %; after 5τ, 99 %. The EN pin\'s 10 kΩ with 1 µF gives 10 ms.',
      stories: { tau: 'A {R} resistor charges a {C} capacitor. What is the time constant?' },
      practice: { unknowns: ['tau', 'C'] }
    }
  ],
  examples: [
    {
      title: 'Sizing the bulk capacitor',
      q: 'An ESP32-S3 module on a long thin USB cable transmits in bursts of 340 mA that last 2 ms. The board\'s regulator reacts after about 100 µs. The rail may sag 0.1 V. What must the bulk capacitor supply, and how much capacitance does that need?',
      steps: ['Until the regulator reacts, the capacitor supplies the whole burst current for 100 µs.', '$C = I\\,t/\\Delta V = 0.34 \\times 100\\times10^{-6} / 0.1 = 340\\ \\mu\\mathrm{F}$.', 'A 100 µF polymer capacitor in parallel with a 22 µF ceramic gives the low ESR and the size; add margin for the capacitance lost to DC bias.'],
      a: 'About 340 µF in total for a 0.1 V droop. If the regulator is fast, or the droop may be larger, much less is needed. The remaining 1.9 ms of the burst come from the supply itself, which is why the cable matters too ([[current-peaks-and-capacitors]]).'
    }
  ],
  quiz: [
    { q: 'Which pair is the usual way to decouple an ESP module on your own board?', choices: ['A 100 pF ceramic only', '100 nF at each supply pin and 10 – 100 µF near the module', 'A single 1000 µF electrolytic anywhere on the board', 'No capacitors: the module has everything'], a: 1, why: 'The small ceramic supplies the fastest current spikes at the pin; the larger one supplies the radio bursts. The module has some capacitors inside, but the supply that feeds it needs its own bulk capacitance.' },
    { q: 'A 10 µF X5R ceramic in a small case is used on the 3.3 V rail. What should you expect?', choices: ['Exactly 10 µF', 'Noticeably less than 10 µF because of DC bias', 'More than 10 µF', 'It acts as an inductor'], a: 1, why: 'The capacitance of class-2 ceramics falls with applied DC voltage; on small cases at 3.3 V it can be half the label.' },
    { q: 'A 10 kΩ pull-up and a 1 µF capacitor are on the EN pin. About how long does EN take to reach 63 % of 3.3 V after power-up?', choices: ['10 µs', '1 ms', '10 ms', '1 s'], a: 2, why: 'τ = RC = 10 kΩ × 1 µF = 10 ms. After one time constant the voltage has risen to 63 % of its final value.' },
    { q: 'Moving a 10 µF capacitor from beside the module to the far end of the board makes no difference to the supply spikes at the chip.', a: false, why: 'Distance matters: the copper between the capacitor and the pin adds inductance and resistance, so the capacitor cannot deliver microsecond currents to the chip. Place it close.' }
  ],
  applications: [
    'The pair of capacitors beside every ESP32 module on a DevKit: a ceramic for the fast spikes and a larger one for the radio.',
    'The RC on the EN pin that holds a chip in reset until the supply has settled.',
    'Battery sensors that wake, transmit and sleep, where a bulk capacitor lets a weak cell feed a short burst.',
    'Smoothing a noisy analogue input before the ADC, the subject of the next page.'
  ],
  sources: [
    'Espressif, *ESP32 Hardware Design Guidelines*: power-supply circuit, decoupling and the EN-pin RC delay.',
    'Espressif, *ESP32-S3 Series Datasheet* and *ESP32-C3 Series Datasheet*: transmit current in the electrical characteristics.',
    'Manufacturers\' application notes on the DC-bias characteristic of multilayer ceramic capacitors (class 2 dielectrics).'
  ],
  sim: 'pc-decoupling'
},

/* ================================================================ voltage-dividers-for-inputs */
{
  id: 'voltage-dividers-for-inputs',
  parent: 'passive-components',
  title: 'Voltage dividers for inputs',
  level: 1,
  short: 'Two resistors that scale a voltage down. They bring a 5 V signal or a lithium cell\'s 4.2 V into the 3.3 V pin and the ADC\'s range — if you size them for the ADC and for the battery.',
  keywords: ['voltage divider', 'resistor divider', 'battery voltage', '5 V to 3.3 V', 'ADC range', 'attenuation', 'source impedance', 'divider ratio', 'battery monitor', 'level shifting'],
  prereq: ['resistors-in-esp-circuits', 'three-volt-logic', 'electronics:voltage-divider'],
  related: ['adc-attenuation-and-calibration', 'measuring-battery-level', 'measuring-voltage', 'level-shifters', 'the-esp-adc', 'protection-parts'],
  body: `Two resistors in series across a voltage, tapped in the middle, give a fraction of it: $V_{out} = V_{in}\\, R_2/(R_1 + R_2)$. It is the cheapest way to bring a voltage that is too big for the chip down to one the chip can take, and it appears in almost every ESP project that measures a battery or reads a 5 V sensor.

### Why a pin needs one

The pins of an ESP are 3.3 V devices, with an absolute maximum a little above that (see [[three-volt-logic]]). The ADC measures less: on the original ESP32 at the highest attenuation the usable range ends near 2.5 V, on the S3 near 3.1 V, on the C3 near 2.5 V (the catalogue lists the ranges). A freshly charged lithium cell is 4.2 V; a 5 V sensor output can be 5 V. Both need to be scaled.

### Choosing the resistors

1. **The ratio.** Choose the divider so that the largest input gives about 75 – 90 % of the ADC's usable range. For a 4.2 V cell into about 2.1 V on the pin, two equal resistors do it (ratio ½). For a 5 V signal into 3.0 V, $R_1 = 82\\ \\mathrm{k}\\Omega$ with $R_2 = 120\\ \\mathrm{k}\\Omega$ gives 2.97 V.
2. **The total.** The divider draws $V_{in}/(R_1 + R_2)$ all the time. Two 100 kΩ resistors on a 4.2 V cell draw 21 µA — more than the chip itself in deep sleep. For a battery node that sleeps, use 1 MΩ or more and a capacitor, or switch the divider with a MOSFET.
3. **The impedance.** The ADC briefly draws a little charge from the pin each time it samples. Seen from the pin, the divider's resistance is $R_1 \\parallel R_2$: the larger it is, the more the reading sags. A 100 nF capacitor from the pin to ground supplies that charge; with it, a few hundred kilohms is fine for slow signals.
4. **The tolerance.** A 1 % pair gives a ratio good to about 1 %; 5 % parts can be 10 % off. Calibrate the final ratio against a multimeter and store it in the program.

### Fast signals

A divider is fine for slow signals. For a fast 5 V signal such as SPI or a serial line it slows the edge, because the resistors and the pin's capacitance form a low-pass filter, and it does nothing for a signal that must go the other way. Use a level shifter ([[level-shifters]]).

### Traps

- **ADC2 on the original ESP32** cannot be read while Wi-Fi runs: put the divider on an ADC1 pin (GPIO32 – 39).
- **A divider is not protection.** If the 5 V source can rise or the divider's top resistor can be shorted, 5 V arrives at the pin. See [[protection-parts]].
- **Do not use the raw count and the nominal 3.3 V.** Use the calibrated millivolt reading, then multiply by the ratio.

> [!key] A divider scales a voltage by R2/(R1 + R2). Size it so the biggest input lands inside the ADC's range, make the total resistance high enough not to drain a battery, and add 100 nF at the pin so the ADC's sampling does not disturb the reading.`,
  ideas: [
    'Two resistors scale a voltage by R2/(R1 + R2); the ratio sets the range and the total sets the current wasted.',
    'A lithium cell (4.2 V) or a 5 V signal must be scaled below the ADC\'s range; two equal resistors halve a cell voltage.',
    'The divider\'s source impedance disturbs the ADC reading unless a 100 nF capacitor sits at the pin.',
    'Always-on dividers drain a battery: 200 kΩ across a lithium cell draws 21 µA.'
  ],
  pitfalls: [
    'A divider makes a 5 V signal safe — It scales the signal it sees. If the top resistor shorts or the input exceeds its plan, the pin can still see 5 V. Add a clamp or series resistor where a failure would be costly.',
    'Higher resistors are always better for the battery — Above about 1 MΩ the ADC\'s own input leakage and sampling current disturb the reading and noise pick-up grows. Use a capacitor, or switch the divider off.',
    'The ratio on the schematic is the ratio of the board — With 5 % resistors the ratio can be off by several per cent. Calibrate against a multimeter.'
  ],
  terms: [
    { term: 'Voltage divider', also: ['resistor divider', 'potential divider'], def: 'Two resistors in series across a voltage, with the output taken from their junction: V_out = V_in · R2/(R1 + R2). It scales a voltage down and loads the source by V_in/(R1 + R2).' },
    { term: 'Divider ratio', also: ['attenuation ratio', 'scale factor'], def: 'The factor by which a divider scales a voltage. A 100 kΩ pair has the ratio ½; the program multiplies the reading by the inverse, 2, to get the original voltage.' },
    { term: 'Source impedance', also: ['output impedance', 'Thevenin resistance'], def: 'The resistance a circuit presents at its output. For a divider it is R1 in parallel with R2; a high one makes an ADC reading sag because the ADC draws a little current to sample.' },
    { term: 'Loading', also: ['loading effect'], def: 'The change in a voltage when something draws current from it. An ADC input, a sensor or a second divider connected to the tap lowers the output of a divider.' }
  ],
  choose: {
    good: ['Two equal 100 kΩ resistors to read a lithium cell up to 4.2 V', '82 kΩ and 120 kΩ to bring a 5 V analogue output to just under 3.0 V', 'A 100 nF capacitor from the tap to ground', 'A high-side switch or MOSFET that turns the battery divider off between readings'],
    avoid: ['Dividers of 1 kΩ or less across a battery', 'A divider with no capacitor on a long wire or a sampled input', 'Reading the divider on ADC2 of a Wi-Fi ESP32', 'Relying on the divider alone against an input that can reach 5 V'],
    check: ['The ADC range of your chip at the attenuation you choose', 'The current the divider draws at the highest voltage', 'The resistor tolerance, and calibrate the ratio against a multimeter', 'That the tap voltage stays under 3.3 V in every fault you can imagine']
  },
  code: [
    {
      title: 'Read a lithium cell through a 100 kΩ divider',
      about: 'Two equal resistors halve the cell voltage; the program averages 16 readings of the calibrated millivolts at the pin and doubles them. A 100 nF capacitor from the pin to ground absorbs the ADC\'s sampling.',
      needs: 'An ESP32 DevKit powered over USB, two 100 kΩ resistors, a 100 nF capacitor, and a single lithium cell connected only to the divider (it is charged elsewhere, with a charger IC: never from a pin).',
      wiring: [['battery +', '100 kΩ → node A'], ['node A', '100 kΩ → GND'], ['node A', '100 nF → GND'], ['node A', 'GPIO34 (ADC1)'], ['battery −', 'GND of the board']],
      blocks: `
        when started
          start serial at (115200) baud
          set [ratio v] to (2)                   // (100 k + 100 k) / 100 k
        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34) in millivolts)
          end
          set [vbat v] to (((sum) / (16)) * (ratio))
          print (join [Battery in mV: ] (vbat))
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int BAT_PIN = 34;                  // node A -> GPIO34 (ADC1, input only)
        const float RATIO = 2.0;                 // (100 k + 100 k) / 100 k

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(BAT_PIN, ADC_11db);
        }

        void loop() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(BAT_PIN);
          float vbat = sum / 16.0 * RATIO;       // millivolts at the cell
          Serial.printf("Battery: %.0f mV\n", vbat);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # node A -> GPIO34 (ADC1, input only)
        RATIO = 2.0                               # (100 k + 100 k) / 100 k

        while True:
            total = 0
            for i in range(16):
                total += adc.read_uv()            # calibrated microvolts
            vbat = total / 16 / 1000 * RATIO      # millivolts at the cell
            print("Battery: %.0f mV" % vbat)
            time.sleep(2)
      `,
      output: `
        Battery: 4012 mV
      `,
      notes: ['A lithium cell\'s voltage is only a rough indicator of its charge: see [[measuring-battery-level]].', 'On an ESP32-S3 use GPIO1 – 10 (ADC1); on a C3 GPIO0 – 4; avoid pins that Wi-Fi or the strapping rules claim.']
    }
  ],
  formulas: [
    {
      name: 'Divider output',
      expr: 'Vout = Vin*R2/(R1 + R2)',
      tex: 'V_{\\mathrm{out}} = V_{\\mathrm{in}}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vout: { name: 'voltage at the pin', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\mathrm{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 82 },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 120 }
      },
      note: 'Valid for an unloaded output. An ADC pin or any load in parallel with R2 lowers the result; keep the load at least ten times larger than R2, or add a capacitor at the pin and read slowly.',
      stories: { Vout: 'A {Vin} signal is divided by {R1} above and {R2} below. What does the pin see?' },
      practice: { unknowns: ['Vout', 'R2'] }
    }
  ],
  examples: [
    {
      title: 'A 5 V sensor on a 3.3 V ADC',
      q: 'A sensor has an analogue output of 0 – 5 V. Choose a divider for an ESP32-C3 whose ADC reads up to about 2.5 V at the highest attenuation, drawing under 30 µA.',
      steps: ['Aim for a full-scale output near 2.2 V, comfortably inside the range: ratio $2.2/5 = 0.44$.', 'The total must exceed $5\\ \\mathrm{V}/30\\ \\mu\\mathrm{A} \\approx 167\\ \\mathrm{k}\\Omega$. Take $R_2 = 100\\ \\mathrm{k}\\Omega$ and $R_1 = 120\\ \\mathrm{k}\\Omega$: ratio $100/220 = 0.455$, total 220 kΩ, current 23 µA.', 'At 5 V the pin sees $5 \\times 0.455 = 2.27$ V. The source resistance is $120 \\parallel 100 = 55$ kΩ, so add 100 nF at the pin.'],
      a: 'R1 = 120 kΩ, R2 = 100 kΩ, 100 nF at the pin. Full scale gives 2.27 V and the divider draws 23 µA. The program multiplies the reading by 2.2.'
    }
  ],
  quiz: [
    { q: 'A divider of 100 kΩ and 100 kΩ is used to measure a lithium cell. The pin reads 1.95 V. What is the cell voltage?', choices: ['0.98 V', '1.95 V', '3.90 V', '5.85 V'], a: 2, why: 'The ratio is ½, so the cell voltage is twice what the pin sees: 2 × 1.95 = 3.90 V.' },
    { q: 'Why add a 100 nF capacitor from the tap of a divider to ground, before the ADC pin?', choices: ['To make the divider more accurate in DC', 'To supply the brief charge the ADC takes when it samples, so a high source resistance does not make the reading sag', 'To raise the voltage', 'To lower the divider\'s current'], a: 1, why: 'The ADC\'s sample-and-hold takes a tiny charge from the pin each time. A source of tens of kilohms cannot supply it instantly; the capacitor can.' },
    { q: 'A 200 kΩ divider is permanently connected across a 4.2 V cell in a sensor that sleeps at 10 µA. What happens to battery life?', choices: ['Nothing', 'The divider\'s 21 µA is twice the sleep current, so the battery lasts about a third as long', 'It lasts twice as long', 'The ADC stops working'], a: 1, why: '4.2 V / 200 kΩ = 21 µA, on top of 10 µA: 31 µA, or three times the sleep drain. Use a larger resistor with a capacitor, or switch the divider.' },
    { q: 'A divider guarantees that a 5 V input can never damage a 3.3 V pin.', a: false, why: 'It only scales the voltage it sees. If R1 shorts, R2 opens or the input rises above its plan, the pin can see the full voltage. Add a clamp or a series resistor when a fault matters.' }
  ],
  applications: [
    'Battery-voltage monitors on almost every portable ESP board: the 100 kΩ pair on GPIO34 or GPIO35.',
    'Reading 0 – 5 V analogue sensors and industrial 0 – 10 V inputs with a larger ratio.',
    'Bringing a 5 V logic output down to 3.3 V for a slow input where a level shifter would be overkill.',
    'The two resistors that set the output of an adjustable regulator, which are a divider in the feedback.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ADC oneshot-mode driver: attenuation, input ranges and calibration.',
    'Arduino core for ESP32 documentation, *ADC* API: analogReadMilliVolts and the attenuation table.',
    'Espressif, *ESP32 Hardware Design Guidelines* and the DevKit schematics: the battery-voltage divider and its capacitor.'
  ],
  sim: 'pc-divider'
},

/* ================================================================ rc-filters-and-debounce */
{
  id: 'rc-filters-and-debounce',
  parent: 'passive-components',
  title: 'RC filters and hardware debouncing',
  level: 2,
  short: 'A resistor and a capacitor make a low-pass filter: fast wobbles are smoothed away, slow changes pass. It cleans a noisy analogue input before the ADC and swallows a button\'s contact bounce before the pin ever sees it.',
  keywords: ['RC filter', 'low-pass', 'cutoff frequency', 'debounce', 'hardware debounce', 'Schmitt trigger', '74HC14', 'anti-aliasing', 'noise', 'hum', 'time constant', 'EMA', 'smoothing'],
  prereq: ['capacitors-in-esp-circuits', 'voltage-dividers-for-inputs', 'electronics:rc-low-pass'],
  related: ['debouncing', 'oversampling-and-noise', 'filtering-sensor-data', 'reading-sensors-reliably', 'buttons-and-switches', 'electronics:schmitt-trigger'],
  body: `Put a resistor in line with a signal and a capacitor from the signal to ground, and the capacitor must charge or discharge through the resistor before the voltage can change. A slow change gets through; a quick one has gone by before the capacitor has moved. That is a **low-pass filter**, and its one number is the time constant $\\tau = RC$, or the **cutoff frequency**

$$f_c = \\frac{1}{2\\pi R C}$$

Above $f_c$ the signal falls by 20 dB for each tenfold rise in frequency. With 10 kΩ and 100 nF, $\\tau$ is 1 ms and $f_c$ is 159 Hz.

### Cleaning an analogue input

Wires pick up mains hum (50 or 60 Hz) and the clatter of switching supplies and Wi-Fi bursts. Averaging samples in software ([[oversampling-and-noise]]) removes noise that is random from sample to sample, but a disturbance faster than half the sample rate is not removed: it folds down into the band you are measuring (*aliasing*). The filter must therefore come *before* the ADC. For a slow sensor (a temperature, a battery, a potentiometer) a 10 kΩ resistor with 1 – 10 µF gives a cutoff of 16 – 1.6 Hz, and the hum all but disappears. Keep the resistor modest: the ADC draws a little current and a large resistor will make it read low.

You can do the same in a program with an **exponential moving average**, $y \\leftarrow y + \\alpha\\,(x - y)$, where $\\alpha = \\Delta t/(\\tau + \\Delta t)$. It is the digital twin of the RC, and the program below uses it.

### Debouncing a button

A mechanical contact does not close cleanly: for a few milliseconds it bounces between open and closed, and a pin reads that as several presses. Software can wait it out ([[debouncing]]); hardware can do it with the same RC. A pull-up resistor of 10 kΩ with 1 µF across the button gives $\\tau = 10$ ms. The press discharges the capacitor at once through the contact; the bounces that follow reopen it for a millisecond or so, and in that time the capacitor recharges by only about a tenth, nowhere near a logic high. The node rises again only when the button is really released.

The edges of that RC are slow, and a slow edge through the input's threshold region can still make an ordinary input chatter. The tidy solution is a **Schmitt-trigger** buffer such as a 74HC14 (or a single-gate 74LVC1G14): its two thresholds ignore small wobbles. Use it when the pin drives an interrupt, or when the chip is asleep and only the hardware is awake: a button that wakes the ESP from deep sleep cannot be debounced in software.

### Choosing the time constant

For a button, about 5 – 10 ms; for hum, 30 – 100 ms; for a slow sensor, whatever the signal's own speed allows. The price of filtering is **delay**: a signal needs about $3\\tau$ to settle within 5 %.

> [!key] A resistor and a capacitor give a low-pass filter with τ = RC and f_c = 1/(2πRC). Put it before the ADC to remove noise that software cannot, and across a button, with τ of about 10 ms and a Schmitt buffer after it, to remove contact bounce in hardware.`,
  ideas: [
    'An RC low-pass passes slow changes and blocks fast ones; its cutoff is 1/(2πRC) and its time constant RC.',
    'Noise faster than half the sampling rate cannot be removed after the ADC: filter before it.',
    'A pull-up with a capacitor across a button debounces in hardware; a Schmitt-trigger gate cleans the slow edge.',
    'A filter always costs delay: about three time constants to settle within 5 %.'
  ],
  pitfalls: [
    'Averaging in software is the same as an RC filter — Averaging removes noise that varies from sample to sample, not noise that is faster than the sampling: that has already been folded into the readings by the ADC.',
    'A bigger capacitor is always a better debounce — Too large, and the button feels sluggish, or a quick tap never reaches a threshold. About 10 ms covers most switches; 10 kΩ with 100 nF (1 ms) is too short for a bouncy one.',
    'The RC makes the edge clean — It makes it slow. Straight into an ordinary input, a slow edge can chatter around the threshold; put a Schmitt gate after it.'
  ],
  terms: [
    { term: 'Low-pass filter', also: ['RC filter', 'smoothing filter'], def: 'A circuit that passes slow signals and attenuates fast ones. The simplest is a resistor in line and a capacitor to ground, with cutoff f_c = 1/(2πRC).' },
    { term: 'Cutoff frequency', also: ['corner frequency', '−3 dB point', 'f_c'], def: 'The frequency at which a low-pass filter passes 70.7 % of the amplitude (−3 dB). Above it the output falls 20 dB per decade for a first-order filter.' },
    { term: 'Aliasing', also: ['folding'], def: 'The error when a signal changes faster than half the sampling rate: it appears in the samples as a slower, false signal that no later processing can remove.' },
    { term: 'Schmitt trigger', also: ['hysteresis', '74HC14'], def: 'A logic input with two thresholds: a rising signal must pass the upper one to switch, a falling one the lower. Small wobbles between them are ignored, which cleans slow edges.' },
    { term: 'Exponential moving average', also: ['EMA', 'IIR filter', 'digital RC'], def: 'A filter that moves the output a fixed fraction α toward each new sample, y ← y + α(x − y). It behaves like an RC low-pass with τ = Δt(1 − α)/α.' }
  ],
  choose: {
    good: ['10 kΩ and 1 – 10 µF in front of the ADC for a slow sensor in a noisy place', '10 kΩ and 1 µF across a button that wakes the chip from deep sleep, with a Schmitt-trigger gate', 'An exponential moving average in the program as a second stage after the hardware filter', 'A series resistor of 10 kΩ or less at the ADC pin'],
    avoid: ['Software averaging as the only defence against hum picked up by a long wire', 'Time constants much longer than the signal needs', 'Driving an interrupt pin straight from a slow RC node', 'A series resistor of 100 kΩ or more ahead of the ADC'],
    check: ['The signal\'s own speed: the cutoff must be well above it', 'The noise frequency you must remove (mains hum, switching supply)', 'That the filtered signal still settles within the time you have between readings', 'The ADC\'s behaviour with your source resistance: add a capacitor at the pin']
  },
  code: [
    {
      title: 'A digital RC: smooth a noisy ADC reading',
      about: 'Reads an analogue input every 10 ms and keeps an exponential moving average with a time constant of 200 ms. Print both numbers and the serial plotter shows the raw reading jumping and the smoothed one gliding.',
      needs: 'An ESP32 DevKit and a sensor, or a potentiometer, on GPIO34 (ADC1).',
      wiring: [['GPIO34', 'sensor output or potentiometer wiper'], ['3V3 / GND', 'ends of the potentiometer']],
      blocks: `
        when started
          start serial at (115200) baud
          set [y v] to (analog read pin (34) in millivolts)
          set [alpha v] to ((10) / ((200) + (10)))       // dt / (tau + dt)
        forever
          set [x v] to (analog read pin (34) in millivolts)
          change [y v] by ((alpha) * ((x) - (y)))
          print (join (x) [, ] (y))
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;                  // ADC1
        const float DT_MS = 10.0;                   // one reading every 10 ms
        const float TAU_MS = 200.0;                 // the filter's time constant
        const float ALPHA = DT_MS / (TAU_MS + DT_MS);
        float y;                                    // the smoothed value, in millivolts

        void setup() {
          Serial.begin(115200);
          y = analogReadMilliVolts(SENSOR_PIN);     // start from the first reading
        }

        void loop() {
          float x = analogReadMilliVolts(SENSOR_PIN);
          y += ALPHA * (x - y);                     // the digital twin of an RC
          Serial.printf("%.0f %.1f\n", x, y);       // raw, smoothed
          delay(10);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)     # ADC1
        DT_MS = 10                                  # one reading every 10 ms
        TAU_MS = 200                                # the filter's time constant
        ALPHA = DT_MS / (TAU_MS + DT_MS)
        y = adc.read_uv() / 1000                    # start from the first reading, in millivolts

        while True:
            x = adc.read_uv() / 1000
            y += ALPHA * (x - y)                    # the digital twin of an RC
            print("%.0f %.1f" % (x, y))             # raw, smoothed
            time.sleep_ms(10)
      `,
      notes: ['The smoothed value lags the real one by about τ. For a thermostat that is fine; for a fast control loop use a shorter τ.', 'Software cannot remove noise faster than 50 Hz at this sampling rate: it is already folded into the samples. Add the hardware RC first.']
    },
    {
      title: 'Count presses behind a hardware debounce',
      about: 'A 10 kΩ pull-up with 1 µF across the button (τ = 10 ms) outlasts the bounce, and a 74HC14 Schmitt-trigger inverter turns the slow node into a clean edge. The pin counts a rising edge for every press, with no debounce code at all.',
      needs: 'An ESP32 DevKit, a push button, a 10 kΩ resistor, a 1 µF capacitor and a 74HC14 (or one gate of a 74LVC1G14) powered from 3.3 V.',
      wiring: [['3V3', '10 kΩ → node A'], ['node A', 'button → GND'], ['node A', '1 µF → GND'], ['node A', '74HC14 input'], ['74HC14 output', 'GPIO18 (high while pressed)']],
      blocks: `
        when started
          start serial at (115200) baud
          set [presses v] to (0)
          set pin (18) as [input v]

        when pin (18) goes [high v]
          change [presses v] by (1)              // the inverter makes a press a rising edge

        every (1) seconds
          print (join [Presses: ] (presses))
      `,
      cpp: String.raw`
        const int INPUT_PIN = 18;                   // 74HC14 output: high while the button is down
        volatile uint32_t presses = 0;

        void IRAM_ATTR onPress() {
          presses++;                                // the hardware has removed the bounce
        }

        void setup() {
          Serial.begin(115200);
          pinMode(INPUT_PIN, INPUT);
          attachInterrupt(INPUT_PIN, onPress, RISING);   // a press is a rising edge
        }

        void loop() {
          Serial.printf("Presses: %lu\n", (unsigned long)presses);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        presses = 0

        def on_press(pin):                          # the hardware has removed the bounce
            global presses
            presses += 1

        button = Pin(18, Pin.IN)                    # 74HC14 output: high while the button is down
        button.irq(handler=on_press, trigger=Pin.IRQ_RISING)   # a press is a rising edge

        while True:
            print("Presses:", presses)
            time.sleep(1)
      `,
      output: `
        Presses: 0
        Presses: 3
        Presses: 3
        Presses: 4
      `,
      notes: ['Without the RC and the Schmitt gate the same program counts several presses for each real one: try it with the button wired straight to the pin.', 'The 74HC14 inverts, so the pin is high while the button is down. Take its supply from 3.3 V, not 5 V, so that its output is safe for the pin.']
    }
  ],
  formulas: [
    {
      name: 'Cutoff frequency of an RC low-pass',
      expr: 'fc = 1/(2*pi*R*C)',
      tex: 'f_c = \\frac{1}{2\\pi R C}',
      vars: {
        fc: { name: 'cutoff frequency', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      note: 'The output is down 3 dB (to 70.7 % of the amplitude) at fc and falls 20 dB per decade above it. It is valid for an unloaded RC: whatever the output drives must have a much higher resistance than R.',
      stories: { fc: 'A signal passes through a {R} resistor with a {C} capacitor to ground. What is the cutoff frequency?' },
      practice: { unknowns: ['fc', 'C'] }
    },
    {
      name: 'Smoothing factor of a moving average',
      expr: 'alpha = dt/(tau + dt)',
      tex: '\\alpha = \\frac{\\Delta t}{\\tau + \\Delta t}',
      vars: {
        alpha: { name: 'smoothing factor', tex: '\\alpha' },
        dt: { name: 'time between readings', q: 'time', unit: 'ms', value: 10, tex: '\\Delta t' },
        tau: { name: 'filter time constant', q: 'time', unit: 'ms', value: 200, tex: '\\tau' }
      },
      note: 'The program line is y = y + alpha × (x − y). A small α smooths strongly and lags; α = 1 passes the readings unchanged.',
      stories: { alpha: 'A program reads a sensor every {dt} and wants a filter time constant of {tau}. What smoothing factor does it use?' },
      practice: { unknowns: ['alpha', 'tau'] }
    }
  ],
  examples: [
    {
      title: 'Which RC for a hum-ridden sensor?',
      q: 'A temperature sensor\'s analogue output changes over minutes, but a long wire adds 50 Hz hum. Choose an RC that cuts the hum by a factor of at least 30.',
      steps: ['A first-order filter falls 20 dB per decade, so attenuating 50 Hz by 30 (about 30 dB) needs a cutoff about $50/30 \\approx 1.7$ Hz.', 'From $f_c = 1/(2\\pi R C)$, with $R = 10\\ \\mathrm{k}\\Omega$: $C = 1/(2\\pi \\times 10^4 \\times 1.7) \\approx 9.4\\ \\mu\\mathrm{F}$; take 10 µF.', 'The time constant is $RC = 0.1$ s, so the output settles in about 0.3 s: harmless for a temperature.'],
      a: 'About 10 kΩ with 10 µF (cutoff 1.6 Hz). The hum is reduced about 30-fold, and the signal is delayed by a third of a second.'
    }
  ],
  quiz: [
    { q: 'Which cutoff does a 10 kΩ resistor with a 100 nF capacitor give?', choices: ['16 Hz', '159 Hz', '1.6 kHz', '16 kHz'], a: 1, why: 'f_c = 1/(2πRC) = 1/(2π × 10 000 × 100 × 10⁻⁹) = 159 Hz.' },
    { q: 'Mains hum is picked up by a long sensor wire. Why does averaging 64 readings in software not remove it fully?', choices: ['64 readings are too few', 'Noise faster than half the sampling rate has been folded into the readings (aliasing); software cannot tell it from signal', 'Averaging only removes DC', 'The ADC averages already'], a: 1, why: 'A disturbance faster than half the sample rate is turned into a slow false signal by sampling. Only a filter ahead of the ADC can stop it.' },
    { q: 'You debounce a button with an RC and connect the slow node straight to an interrupt pin. What can still go wrong?', choices: ['Nothing', 'The slow edge through the threshold region can still make the input chatter and trigger several interrupts', 'The capacitor will charge the pin', 'The interrupt cannot see rising edges'], a: 1, why: 'An ordinary input has no guaranteed hysteresis; a slow signal that lingers near the threshold can make several edges. A Schmitt-trigger gate after the RC gives one clean edge.' },
    { q: 'A button must wake the ESP from deep sleep and be debounced. Can the debouncing be done in the program?', a: false, why: 'The program is not running while the chip sleeps; the first edge wakes it and further bounces may arrive before it has booted. A hardware RC (with a Schmitt gate) is the answer.' }
  ],
  applications: [
    'The RC on the button of nearly every DevKit that must wake the chip reliably.',
    'Anti-aliasing and hum filters in front of the ADC of battery, light, current and temperature sensors.',
    'Smoothing a PWM output into a steady control voltage: an RC after a PWM pin is a simple digital-to-analogue converter.',
    'The exponential moving average in sensor firmware, from thermostats to displays that show a steady number.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: input voltage thresholds of the pins and the characteristics of the ADC.',
    'Manufacturers\' datasheets of the 74HC14 and 74LVC1G14 Schmitt-trigger inverters: input thresholds and hysteresis.',
    'Standard texts on first-order filters and on sampling (Nyquist and aliasing).'
  ],
  sim: 'pc-rc-filter'
},

/* ================================================================ potentiometers */
{
  id: 'potentiometers',
  parent: 'passive-components',
  title: 'Potentiometers',
  level: 1,
  short: 'A potentiometer is a divider you can turn. Wired across 3.3 V with its slider to an ADC pin, it is the simplest analogue input there is — and the ADC\'s dead zones are its commonest trap.',
  keywords: ['potentiometer', 'pot', 'trimmer', 'trim pot', 'wiper', 'taper', 'linear taper', 'log taper', 'audio taper', 'rheostat', 'knob', 'slide pot', 'ADC', 'dead zone'],
  prereq: ['voltage-dividers-for-inputs', 'the-esp-adc', 'resistors-in-esp-circuits'],
  related: ['analog-input', 'adc-attenuation-and-calibration', 'joysticks', 'driving-leds-with-pwm', 'rc-filters-and-debounce', 'electronics:potentiometers'],
  body: `A potentiometer is a resistive track with a contact, the **wiper**, that slides along it. The track's two ends are the outer terminals; the wiper is the middle one. Connect the ends across a voltage and the wiper takes a fraction of it set by the knob: a voltage divider whose ratio you can change by hand.

### Wiring it for an ESP

- One end to 3.3 V, the other to ground, the wiper to an ADC pin. Turn clockwise and the voltage should rise: if it falls, swap the end terminals.
- **Never power it from 5 V** and take the wiper to a pin: at one end of the travel the pin sees 5 V.
- Use **ADC1** pins on the original ESP32 when Wi-Fi is on ([[adc1-adc2-and-wifi]]).
- 10 kΩ is the usual value. A lower value draws more current (330 µA across 3.3 V at 10 kΩ); a higher one (100 kΩ) makes the reading sag at the ADC and picks up more noise. Add 100 nF from the wiper to ground.

### What the ADC does at the ends

The readings do not run neatly from 0 to 4095. The ESP32's ADC reads zero below about 0.1 V and flattens near the top of its range; the usable top is about 2.5 V on the ESP32 and C3 and about 3.1 V on the S3 at the highest attenuation (see [[adc-attenuation-and-calibration]]). A pot powered from 3.3 V therefore has a flat stretch of reading at one end or both. Two cures: a **fixed resistor** between the pot and 3.3 V, so the top reaches only about 2.3 V; or accept the dead zone and use the middle 80 % of the travel.

### Tapers

- **Linear (B)**: the resistance follows the angle: half way gives half the voltage. The right choice for a control voltage.
- **Logarithmic (A, audio)**: the resistance rises slowly at first and then quickly, to match the way we hear loudness. Wired as a divider it bunches most of the readings into the top of the knob's travel. If you must use one, correct it in software.

### Noise and wear

A carbon track wears, and a dirty wiper makes the voltage jump for a moment (a crackle in an audio pot). A small capacitor and an averaging filter hide it ([[rc-filters-and-debounce]]); for a knob that turns constantly, as in a joystick, prefer a **Hall-effect** or **conductive-plastic** part.

### Trimmers and the rheostat

A **trimmer** is a small pot set once with a screwdriver, for calibration. A **rheostat** uses only the wiper and one end, as a variable resistor, to set a current. An ESP rarely needs one, but the wiring is the same.

> [!key] A potentiometer is a divider with a movable tap: ends to 3.3 V and ground, wiper to an ADC1 pin, 10 kΩ with 100 nF. Expect dead zones at the ends of the ADC's range, use a linear taper, and filter the reading.`,
  ideas: [
    'The wiper takes a fraction of the voltage across the track; ends to 3.3 V and ground, wiper to the ADC.',
    'The ADC is flat near zero and near the top of its range, so the knob has dead zones at the ends of its travel.',
    'A linear taper suits a control voltage; a logarithmic taper bunches the readings unless corrected.',
    '10 kΩ with 100 nF at the wiper is a robust default; never power the pot from 5 V into a pin.'
  ],
  pitfalls: [
    'The knob will read 0 to 4095 over its whole turn — The ADC reads zero below about 0.1 V and flattens at the top of its range. The first and last part of the turn often change nothing.',
    'Any 10 kΩ pot gives the same result — An audio (A) taper puts most of the change into one end of the turn; a control voltage needs a linear (B) taper. The value is printed on the body.',
    'The reading jumps because the ESP is faulty — A worn or dirty wiper loses contact for a moment. A filter or a better part is the cure.'
  ],
  terms: [
    { term: 'Potentiometer', also: ['pot', 'variable resistor', 'knob'], def: 'A three-terminal resistor with a sliding contact. Across a voltage it acts as an adjustable divider; with only two terminals used, it is a rheostat.' },
    { term: 'Wiper', also: ['slider', 'tap'], def: 'The movable contact of a potentiometer and its middle terminal. Its voltage is the fraction of the supply set by the knob.' },
    { term: 'Taper', also: ['linear taper', 'B taper', 'logarithmic taper', 'A taper', 'audio taper'], def: 'How resistance follows the position. A linear (B) taper is proportional to the angle; a logarithmic (A) taper changes slowly at first and quickly later.' },
    { term: 'Trimmer', also: ['trim pot', 'preset'], def: 'A small potentiometer, adjusted with a screwdriver, set once to calibrate or tune a circuit.' }
  ],
  choose: {
    good: ['A 10 kΩ linear (B) pot for a control voltage', 'A fixed resistor of about 4.7 kΩ between 3.3 V and the pot to keep the ADC inside its range', 'A 100 nF capacitor from the wiper to ground and a software filter', 'A Hall-effect or conductive-plastic part for a knob that turns all day'],
    avoid: ['Powering the track from 5 V with the wiper on a pin', 'A logarithmic pot for a control voltage', 'Pots of 100 kΩ and up straight into the ADC', 'Putting the wiper on ADC2 of a Wi-Fi ESP32'],
    check: ['The ADC\'s usable range at the attenuation you chose', 'The taper letter printed on the pot', 'That clockwise raises the voltage (swap the end wires if not)', 'The current across the track against your battery budget']
  },
  code: [
    {
      title: 'A knob sets the LED brightness',
      about: 'Reads the knob 100 times a second and turns the 12-bit reading into a PWM duty for an LED. The 4.7 kΩ resistor above the pot keeps the top of the ADC range out of the flat zone.',
      needs: 'An ESP32 DevKit, a 10 kΩ linear potentiometer, a 4.7 kΩ resistor, a 100 nF capacitor, an LED and a 330 Ω resistor.',
      wiring: [['3V3', '4.7 kΩ → pot end 1'], ['pot end 2', 'GND'], ['pot wiper', 'GPIO34 and 100 nF → GND'], ['GPIO4', '330 Ω → LED anode, cathode → GND']],
      blocks: `
        when started
          set PWM on pin (4) frequency (5000) resolution (10)
        forever
          set PWM on pin (4) to (map (analog read pin (34)) from (0) (4095) to (0) (1023))
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;                    // wiper -> GPIO34 (ADC1, input only)
        const int LED_PIN = 4;                     // GPIO4 -> 330 ohm -> LED -> GND
        const int PWM_FREQ = 5000;                 // Hz
        const int PWM_BITS = 10;                   // duty 0 .. 1023

        void setup() {
          ledcAttach(LED_PIN, PWM_FREQ, PWM_BITS);
        }

        void loop() {
          int raw = analogRead(POT_PIN);                       // 0 .. 4095
          int duty = map(raw, 0, 4095, 0, (1 << PWM_BITS) - 1);
          ledcWrite(LED_PIN, duty);
          delay(10);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC, PWM
        import time

        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)    # wiper -> GPIO34 (ADC1, input only)
        led = PWM(Pin(4), freq=5000)               # GPIO4 -> 330 ohm -> LED -> GND

        while True:
            led.duty_u16(pot.read_u16())           # 0 .. 65535 follows the knob
            time.sleep_ms(10)
      `,
      notes: ['The brightness does not look linear to the eye: a perceived half needs a much smaller duty. Apply a gamma curve ([[driving-leds-with-pwm]]).', 'On an ESP32-C3 put the wiper on GPIO0 – 4 and the LED on GPIO6.']
    }
  ],
  examples: [
    {
      title: 'Keep a knob out of the flat zone',
      q: 'A 10 kΩ pot is wired across 3.3 V to an ESP32 whose ADC is usable to about 2.45 V. How much of the turn is lost, and what resistor above the pot fixes it?',
      steps: ['The wiper voltage is $3.3 \\times x$ for a position $x$ from 0 to 1; it reaches 2.45 V at $x = 0.74$. The last 26 % of the turn reads the same.', 'Add a resistor $R_t$ above the pot: the top of the travel is $3.3 \\times 10/(10 + R_t)$ kΩ. For 2.3 V, $R_t = 10(3.3/2.3 - 1) \\approx 4.3$ kΩ; take 4.7 kΩ.', 'With 4.7 kΩ the top reaches $3.3 \\times 10/14.7 = 2.24$ V, inside the range, at the price of a smaller span: the bottom dead zone grows from 5 % to about 7 % of the turn.'],
      a: 'About a quarter of the turn is dead. A 4.7 kΩ fixed resistor between 3.3 V and the pot brings the top to 2.24 V, and nearly all of the travel works.'
    }
  ],
  quiz: [
    { q: 'A 10 kΩ pot across 3.3 V is read by an ESP32 ADC at the highest attenuation. The top quarter of the knob changes nothing. Why?', choices: ['The pot is faulty', 'The ADC\'s usable range ends below 3.3 V, so the top readings are the same', 'The ADC cannot read a pot', 'The chip is in sleep'], a: 1, why: 'The usable top of the range is about 2.5 V on the original ESP32. Above it the reading stays at the top value.' },
    { q: 'Which taper should a pot have to provide a control voltage that grows in proportion to the angle?', choices: ['A (logarithmic)', 'B (linear)', 'Either', 'Neither: a pot cannot do this'], a: 1, why: 'A linear (B) taper gives resistance proportional to the angle. An A (audio) taper is meant for volume controls.' },
    { q: 'What is wrong with a 5 V supply across a pot whose wiper goes to a pin?', choices: ['Nothing', 'At one end of the turn the wiper reaches 5 V, which is above what the pin may see', 'The pot gets hot', 'The ADC reads zero'], a: 1, why: 'The wiper can reach the full supply voltage. Power the pot from 3.3 V, or divide the wiper voltage as well.' },
    { q: 'The readings from a knob jump briefly now and then although you leave it alone. What is the likely cause, and the cure?', choices: ['The ADC is faulty; replace the chip', 'A worn or dirty wiper loses contact; add a small capacitor and a software filter, or use a better part', 'Wi-Fi is on', 'The program is too slow'], a: 1, why: 'Intermittent wiper contact shows up as sudden jumps. A capacitor at the wiper and an averaging or median filter hide it; a conductive-plastic or Hall part removes it.' }
  ],
  applications: [
    'Volume, brightness and speed knobs on instruments, lamps and fans.',
    'Trimmers that set the threshold of a comparator, the span of a sensor or the output of a regulator.',
    'Joysticks, which are two pots on one stick ([[joysticks]]).',
    'Position feedback on small servos and sliders, from the pot that reports the angle.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ADC oneshot-mode driver: attenuation and input ranges.',
    'Arduino core for ESP32 documentation, *ADC* and *LEDC* APIs (analogRead, analogReadMilliVolts, ledcAttach).',
    'Potentiometer manufacturers\' datasheets: resistance tapers (linear, logarithmic) and track materials.'
  ],
  sim: 'pc-pot'
},

/* ================================================================ thermistors-and-ldrs */
{
  id: 'thermistors-and-ldrs',
  parent: 'passive-components',
  title: 'Thermistors and light-dependent resistors',
  level: 2,
  short: 'Two resistors whose value changes with the world: an NTC thermistor falls in resistance as it warms, a light-dependent resistor falls as light grows. In a divider with a fixed resistor each becomes a voltage the ADC can read.',
  keywords: ['NTC', 'thermistor', 'beta', 'Steinhart-Hart', 'LDR', 'photoresistor', 'light dependent resistor', 'CdS', '10k NTC', 'temperature', 'self-heating', 'divider', 'GL5528'],
  prereq: ['voltage-dividers-for-inputs', 'resistors-in-esp-circuits', 'the-esp-adc'],
  related: ['temperature-sensors', 'light-sensors', 'sensor-calibration', 'reading-sensors-reliably', 'adc-attenuation-and-calibration', 'electronics:thermistors-rtd'],
  body: `Most resistors try to keep their value; these two change on purpose. Each is a sensor that costs a few cents and needs no bus, no library and no address — only a fixed resistor beside it, and an ADC pin.

### The NTC thermistor

An **NTC** (negative temperature coefficient) thermistor falls in resistance as it warms. The common 10 kΩ part has 10 kΩ at 25 °C and follows, to a good approximation, the **beta equation**

$$R_T = R_{25}\\, e^{\\,\\beta\\,(1/T - 1/T_{25})}$$

with temperatures in kelvin and $\\beta$ (typically 3 400 – 4 000 K, printed in the part's data) setting how steeply it falls. Solved for temperature, $T = 1/(1/T_{25} + \\ln(R/R_{25})/\\beta)$: that is the line of code in the program below. The beta equation is good within about ±20 K of 25 °C; for more, use the three-coefficient Steinhart–Hart equation.

With $\\beta = 3950$ K a 10 kΩ NTC gives 33.6 kΩ at 0 °C, 10 kΩ at 25 °C, 2.5 kΩ at 60 °C and 0.7 kΩ at 100 °C. Its sensitivity near 25 °C is about −4.4 % per kelvin, the best of any simple sensor.

### Reading it

Put it in a divider with a fixed resistor equal to its value at the middle of your range (10 kΩ), and read the voltage in the middle. On 3.3 V, with the NTC to ground, the pin gives 2.54 V at 0 °C, 1.65 V at 25 °C and 0.66 V at 60 °C, about 36 mV per kelvin near 25 °C. Three things matter:

- **The ADC range.** On an original ESP32 the ADC flattens near 2.5 V: this layout therefore loses everything below about 3 °C. For a freezer, swap the two resistors so that the voltage *rises* with temperature; the hot end then flattens above about 50 °C.
- **Self-heating.** The current warms the thermistor and the reading rises. At 1.65 V across 10 kΩ it dissipates 0.27 mW, a small but real error in still air; keep it under 0.1 mW if accuracy matters, with a larger resistor, or read the pin only briefly.
- **Tolerance.** A 1 % part with a 1 % beta is good to ±1 K. For better, calibrate at two temperatures ([[sensor-calibration]]).

### The light-dependent resistor

An **LDR** (a CdS photoresistor) falls from megohms in the dark to a few kilohms in bright light, roughly as $R \\propto E^{-\\gamma}$ with $\\gamma$ around 0.7 – 0.9. It is slow (tens of milliseconds, slower after bright light), differs widely from part to part, and responds best to green-yellow light. It is a sensor of *more or less light*, good for a night light or a dusk switch, not for a lux reading. Use the same divider, with a fixed resistor near the geometric mean of the range you care about, typically 10 kΩ. For a measurement, see [[light-sensors]].

> [!key] An NTC thermistor and an LDR are resistors that sense: put each in a divider with a 10 kΩ fixed resistor and read the middle with the ADC. For the NTC compute the temperature with the beta equation, watch the ADC's range and the self-heating; an LDR tells brighter from darker, not lux.`,
  ideas: [
    'An NTC thermistor falls in resistance as it warms; the beta equation turns its resistance into a temperature.',
    'A divider with a fixed resistor equal to the thermistor\'s middle value gives the largest swing: about 36 mV per kelvin near 25 °C on 3.3 V.',
    'The ADC range, self-heating and tolerance limit accuracy; calibrate at two temperatures for better.',
    'An LDR is slow and varies between parts: use it to tell light from dark, not to measure lux.'
  ],
  pitfalls: [
    'A thermistor reads temperature directly — It reads resistance. The temperature comes from a curve, and the ADC, the supply voltage and the fixed resistor all enter the result.',
    'The beta equation is exact — It is an approximation that is good within about ±20 K of 25 °C. Over a wide range use Steinhart–Hart or a table.',
    'An LDR gives a lux reading — Its value varies by part and over time, and it is slow. Use it for light or dark, and a proper light sensor for lux.'
  ],
  terms: [
    { term: 'NTC thermistor', also: ['NTC', 'thermistor', 'negative temperature coefficient'], def: 'A resistor whose value falls as it warms. A 10 kΩ NTC has 10 kΩ at 25 °C and about 33 kΩ at 0 °C.' },
    { term: 'Beta value', also: ['β', 'B25/85', 'B constant'], def: 'The constant, in kelvin, that gives the steepness of an NTC\'s resistance curve in the beta equation. Typical values are 3 400 to 4 000 K.' },
    { term: 'Steinhart–Hart equation', also: ['Steinhart-Hart'], def: 'A three-coefficient formula for 1/T as a polynomial in ln R. It fits an NTC more closely than the beta equation over a wide temperature range.' },
    { term: 'Self-heating', also: ['dissipation constant'], def: 'The warming of a sensor by the current used to read it. For a thermistor it raises the reading above the true temperature, by the power divided by the dissipation constant.' },
    { term: 'LDR', also: ['photoresistor', 'light-dependent resistor', 'CdS cell'], def: 'A resistor made of cadmium sulphide whose value falls as light on it grows: megohms in the dark, kilohms in bright light. It is slow and varies from part to part.' }
  ],
  choose: {
    good: ['A 10 kΩ NTC with β of about 3950 K and a 10 kΩ 1 % fixed resistor for temperatures from about 5 to 80 °C', 'A fixed resistor at the geometric mean of the LDR\'s range for a day-and-night switch', 'Averaging 16 readings, and a 100 nF capacitor at the pin', 'A glass-bead or epoxy thermistor for liquids and surfaces, soldered or clipped'],
    avoid: ['NTCs for a precision measurement without calibration', 'Reading the divider on ADC2 of a Wi-Fi ESP32', 'An LDR where an exposure or a lux value is needed', 'Leaving the divider energised at full current all the time on a battery device'],
    check: ['The beta value and tolerance in the thermistor\'s datasheet', 'The ADC range at the temperatures you need', 'The self-heating at the current you use', 'What you want from the light sensor: brighter or darker, or a number in lux']
  },
  code: [
    {
      title: 'Read a 10 kΩ NTC in degrees',
      about: 'The NTC is the lower resistor of a divider with a 10 kΩ fixed resistor. The program averages 16 readings, turns the pin voltage into the thermistor\'s resistance, and applies the beta equation. A reading near the supply or near zero is reported as a broken sensor.',
      needs: 'An ESP32 DevKit, a 10 kΩ NTC thermistor (β about 3950 K), a 10 kΩ 1 % resistor and a 100 nF capacitor.',
      wiring: [['3V3', '10 kΩ fixed → node A'], ['node A', 'NTC → GND'], ['node A', '100 nF → GND'], ['node A', 'GPIO34 (ADC1)']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34) in millivolts)
          end
          set [mv v] to ((sum) / (16))
          if <<(mv) < (50)> or <(mv) > (3200)>> then
            print [Sensor open or shorted]
          else
            set [r v] to ((10000) * ((mv) / ((3300) - (mv))))                  // the NTC's resistance
            set [tK v] to ((1) / (((1) / (298.15)) + ((ln of ((r) / (10000))) / (3950))))    // beta equation
            print (join [Temperature in C: ] ((tK) - (273.15)))
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <math.h>

        const int NTC_PIN = 34;                    // node A -> GPIO34 (ADC1)
        const float R_FIXED = 10000.0;             // the fixed resistor to 3V3
        const float R0 = 10000.0;                  // the NTC at 25 C
        const float BETA = 3950.0;                 // kelvin, from the NTC's datasheet
        const float T_REF = 298.15;                // 25 C in kelvin (T0 is a name the core uses)
        const float VCC_MV = 3300.0;

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(NTC_PIN);
          float mv = sum / 16.0;
          if (mv < 50 || mv > 3200) {
            Serial.println("Sensor open or shorted");
          } else {
            float r = R_FIXED * mv / (VCC_MV - mv);                 // the NTC's resistance
            float tK = 1.0 / (1.0 / T_REF + log(r / R0) / BETA);       // beta equation
            Serial.printf("Temperature: %.1f C\n", tK - 273.15);
          }
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import math
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)    # node A -> GPIO34 (ADC1)
        R_FIXED = 10000.0                          # the fixed resistor to 3V3
        R0 = 10000.0                               # the NTC at 25 C
        BETA = 3950.0                              # kelvin, from the NTC's datasheet
        T0 = 298.15                                # 25 C in kelvin
        VCC_MV = 3300.0

        while True:
            total = 0
            for i in range(16):
                total += adc.read_uv()
            mv = total / 16 / 1000
            if mv < 50 or mv > 3200:
                print("Sensor open or shorted")
            else:
                r = R_FIXED * mv / (VCC_MV - mv)                    # the NTC's resistance
                tK = 1.0 / (1.0 / T0 + math.log(r / R0) / BETA)     # beta equation
                print("Temperature: %.1f C" % (tK - 273.15))
            time.sleep(1)
      `,
      output: `
        Temperature: 23.8 C
      `,
      notes: ['The program takes the supply as exactly 3300 mV. A real 3.3 V rail may be 3.25 or 3.35 V: measure it with a multimeter and put the number in.', 'On an ESP32-S3 use an ADC1 pin (GPIO1 – 10); on a C3 GPIO0 – 4. The ADC range differs by chip: see [[adc-attenuation-and-calibration]].', 'The open-sensor test (above 3200 mV) only works on a chip whose ADC reaches that high. On an original ESP32 the ADC stops near 2.5 V, so a disconnected NTC reads as a cold one: lower the limit to about 2400 mV there.']
    }
  ],
  formulas: [
    {
      name: 'NTC thermistor: the beta equation',
      expr: 'R = R0*exp(B*(1/T - 1/T0))',
      tex: 'R_T = R_{25}\\, e^{\\,\\beta\\,(1/T - 1/T_{25})}',
      vars: {
        R: { name: 'resistance at temperature T', q: 'resistance', unit: 'kΩ', tex: 'R_T' },
        R0: { name: 'resistance at 25 °C', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_{25}' },
        B: { name: 'beta value', q: 'dtemp', unit: 'K', value: 3950, tex: '\\beta' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 60, min: -40, max: 125 },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, fixed: true, tex: 'T_{25}' }
      },
      note: 'Valid within about ±20 K of the reference temperature. Temperatures are converted to kelvin for you. Solve for T to turn a measured resistance into a temperature.',
      stories: { R: 'A 10 kΩ NTC with β = {B} is at {T}. What is its resistance?' },
      practice: { unknowns: ['R', 'T'] }
    }
  ],
  examples: [
    {
      title: 'What does the pin see at 60 °C?',
      q: 'A 10 kΩ NTC (β = 3950 K) is the lower resistor of a divider with 10 kΩ, on 3.3 V. What voltage is on the pin at 60 °C, and what temperature step does one ADC count of 0.8 mV represent near there?',
      steps: ['At 60 °C: $R = 10\\,\\mathrm{k}\\Omega \\cdot e^{3950(1/333.15 - 1/298.15)} \\approx 2.49\\ \\mathrm{k}\\Omega$.', 'The pin sees $3.3 \\times 2.49/(2.49 + 10) = 0.66$ V.', 'The slope of $R$ there is about $-3.6\\%$ per kelvin; the voltage changes roughly 19 mV per kelvin, so 0.8 mV is about 0.04 K.'],
      a: 'About 0.66 V. The ADC resolves much finer than the thermistor\'s accuracy; noise, tolerance and self-heating limit the result to a few tenths of a kelvin.'
    }
  ],
  quiz: [
    { q: 'A 10 kΩ NTC (to ground) and a 10 kΩ resistor (to 3.3 V) form a divider. The thermistor warms from 25 °C to 60 °C. What does the pin voltage do?', choices: ['Rises from 1.65 V to about 2.6 V', 'Falls from 1.65 V to about 0.66 V', 'Stays the same', 'Falls to zero'], a: 1, why: 'An NTC\'s resistance falls as it warms (10 kΩ to about 2.5 kΩ). With it as the lower resistor, the voltage across it falls from 1.65 V to about 0.66 V.' },
    { q: 'Why is a 10 kΩ NTC usually paired with a 10 kΩ fixed resistor?', choices: ['They must be equal for the ADC to work', 'Equal values give the largest voltage swing around the middle of the range, 25 °C', 'It halves the current', 'It makes the reading linear'], a: 1, why: 'A divider is most sensitive when the two resistors are equal; the fixed resistor is set to the thermistor\'s value at the middle of the range. The output is not linear, though: the program applies the beta equation.' },
    { q: 'What is the effect of self-heating on a thermistor reading?', choices: ['It makes the reading lower than the true temperature', 'It makes the reading higher than the true temperature', 'None', 'It makes the thermistor positive'], a: 1, why: 'The current warms the thermistor, so it is a little hotter than its surroundings and reads high. Use less current, or read it only briefly.' },
    { q: 'An LDR with a fixed resistor is a good light meter for calibrated lux values.', a: false, why: 'LDRs are slow, differ widely from part to part and change with age; they tell light from dark. For lux use a digital light sensor.' }
  ],
  applications: [
    'Battery-pack and heatsink temperature on chargers, motor drivers and 3D printers.',
    'Room, water and soil-probe temperatures in cheap data loggers.',
    'Night lights, dusk-to-dawn lamps and "is the box open?" detectors using an LDR.',
    'Temperature compensation of a sensor whose output drifts with warmth.'
  ],
  sources: [
    'Thermistor manufacturers\' datasheets: the R–T table, the beta value (B25/85) and the dissipation constant.',
    'Espressif, *ESP-IDF Programming Guide*, ADC oneshot-mode driver: attenuation, input ranges and calibration.',
    'Steinhart and Hart (1968), the three-coefficient equation for thermistors, as presented in thermistor application notes.'
  ],
  sim: 'pc-ntc'
},

/* ================================================================ crystals-and-clocks */
{
  id: 'crystals-and-clocks',
  parent: 'passive-components',
  title: 'Crystals and the 32 kHz clock',
  level: 2,
  short: 'Every ESP runs from a quartz crystal that is already inside the module. A second, optional 32.768 kHz crystal on two special pins makes sleep timing and sleepy radios far more accurate — at the price of two pins.',
  keywords: ['crystal', 'XTAL', '40 MHz', '32.768 kHz', '32K_XP', 'XTAL_32K_P', 'RTC clock', 'slow clock', 'ppm', 'load capacitance', 'drift', 'deep sleep timer', 'RTC crystal', 'oscillator', 'accuracy'],
  prereq: ['rtc-domain-and-lp-core', 'deep-sleep', 'capacitors-in-esp-circuits'],
  related: ['wake-up-sources', 'ntp-and-time', 'sleepy-ble-zigbee-thread', 'designing-with-the-bare-chip', 'cpu-cores-and-clocks', 'electronics:crystal-oscillators'],
  body: `A quartz crystal is a sliver of mineral cut so that it rings, electrically, at a very precise frequency. An ESP uses it to keep time in two different ways.

### The main crystal

The radio needs a frequency reference accurate to about ±10 ppm (parts per million), and everything that counts time while the chip is awake runs from it: the CPU clock (through a phase-locked loop), the UART, I2C and SPI clocks, and the microsecond counter behind \`millis()\` and \`micros()\`. It is **40 MHz** on most chips (32 MHz on the ESP32-H2, 48 MHz on the ESP32-C5, 26 or 40 MHz on the C2). Every module and DevKit has it inside. You meet it only on a **bare-chip board**, where you choose its frequency, tolerance and load capacitance ([[designing-with-the-bare-chip]]).

### The slow clock

When the chip sleeps the main crystal is switched off, and a **slow clock** keeps time: it drives the timer that wakes the chip, the RTC counter, and the schedule of sleepy radios. There are two sources:

- **An internal RC oscillator**, in every chip, of roughly 100 – 150 kHz depending on the chip. It costs nothing, but its frequency moves with temperature and supply voltage by percent. The chip calibrates it against the main crystal whenever it can, but it cannot do that while it sleeps.
- **An external 32.768 kHz crystal**, the "watch crystal", on two dedicated pins. It is typically good to ±20 ppm at 25 °C, and its error grows only with the square of the distance from 25 °C, by about 0.034 ppm per °C². That is an error of a few seconds a day instead of minutes.

### Which pins

The crystal takes two pins that are otherwise ordinary GPIOs (from the catalogue):

| Chip | Crystal pins |
|---|---|
| ESP32 | GPIO32 and GPIO33 |
| ESP32-S2, S3 | GPIO15 and GPIO16 |
| ESP32-C3, C5, C6, C61, P4 | GPIO0 and GPIO1 |
| ESP32-H2 | GPIO13 and GPIO14 |
| ESP32-C2 | none: no external slow-clock option |

Most DevKits and modules fit none, so these pins are free.

### When it matters

- **A punctual timer wake-up**: a 1 % RC error is 36 s an hour.
- **Sleepy radios** must wake early by the worst-case clock error: the worse the clock, the longer they listen and the more energy they spend.
- **Never for wall-clock time.** Even a crystal drifts about 2 s a day: set the time by NTP ([[ntp-and-time]]) or with a temperature-compensated RTC chip, good to about 2 ppm.

### Load capacitance

A crystal oscillates at its stated frequency only with the **load capacitance** $C_L$ it was cut for, usually 6 – 12.5 pF for a watch crystal. Each of the two capacitors on the pins, in series with the other and the stray capacitance of the board $C_s$, makes up that load: $C_L = C_1 C_2/(C_1 + C_2) + C_s$, so with equal capacitors $C = 2\\,(C_L - C_s)$. Wrong values shift the frequency by tens of ppm.

> [!key] The main crystal, inside every module, times everything while the chip is awake. An optional 32.768 kHz crystal on two special pins improves sleep timing from percent to tens of ppm; set real time by NTP.`,
  ideas: [
    'The main crystal (mostly 40 MHz) times everything while the chip is awake; modules already contain it.',
    'In sleep a slow clock keeps time: an internal RC oscillator that drifts by percent, or an external 32.768 kHz crystal good to tens of ppm.',
    'The 32 kHz crystal takes two fixed pins per chip, which are then lost as GPIOs.',
    'Neither clock is a calendar: set the real time over the network or with a temperature-compensated RTC chip.'
  ],
  pitfalls: [
    'A crystal makes the time exact — A good watch crystal is still off by about 2 s a day, and by more at temperature extremes. Wall-clock time needs NTP or a temperature-compensated RTC.',
    'Deep-sleep timers are as accurate as millis() — millis() counts the main crystal while the chip is awake; in sleep the slow clock counts, with percent-level error unless an external crystal is fitted.',
    'The capacitors on a crystal can be any small value — The pair, with the board\'s stray capacitance, must equal the crystal\'s specified load capacitance. The wrong value shifts the frequency and can stop it starting.'
  ],
  terms: [
    { term: 'Crystal', also: ['quartz crystal', 'XTAL', 'resonator'], def: 'A cut piece of quartz that vibrates electrically at one very exact frequency. The chip\'s oscillator circuit keeps it ringing and uses it as a clock.' },
    { term: 'ppm', also: ['parts per million'], def: 'A relative error of one millionth. A clock that is 20 ppm off gains or loses 20 µs in every second, or about 1.7 s per day.' },
    { term: 'Slow clock', also: ['RTC_SLOW_CLK', 'RTC clock', '32 kHz clock'], def: 'The low-frequency clock that runs while the chip sleeps. It is an internal RC oscillator or, optionally, an external 32.768 kHz crystal.' },
    { term: 'Load capacitance', also: ['C_L'], def: 'The capacitance a crystal expects to see across its terminals so that it runs at its stated frequency. The two external capacitors and the board\'s stray capacitance together provide it.' },
    { term: 'Temperature-compensated oscillator', also: ['TCXO', 'temperature-compensated RTC'], def: 'An oscillator that measures its own temperature and corrects its frequency. RTC chips of this kind keep time to about 2 ppm.' }
  ],
  choose: {
    good: ['The internal slow clock for devices that wake every few minutes and can tolerate seconds of error', 'An external 32.768 kHz crystal for a timer wake-up that must be punctual, or a sleepy BLE or Zigbee device', 'NTP or a temperature-compensated RTC chip for real time', 'A crystal with the load capacitance the datasheet asks for, and capacitors computed from it'],
    avoid: ['Fitting a 32 kHz crystal when you still need its two pins as GPIO', 'Treating either clock as the date and time', 'Capacitors of "about the right" value on a crystal', 'Long wires or noisy lines near the crystal pins on your own board'],
    check: ['Which two pins your chip uses for the crystal, and that no other part is on them', 'The crystal\'s load capacitance and the stray capacitance of your layout', 'How much timing error your project tolerates over one sleep interval', 'Whether your module or board already fits a crystal']
  },
  formulas: [
    {
      name: 'Load capacitors of a crystal',
      expr: 'C = 2*(CL - Cs)',
      tex: 'C = 2\\,(C_L - C_s)',
      vars: {
        C: { name: 'each of the two capacitors', q: 'capacitance', unit: 'pF' },
        CL: { name: 'crystal\'s load capacitance', q: 'capacitance', unit: 'pF', value: 12.5, tex: 'C_L' },
        Cs: { name: 'stray capacitance of the board', q: 'capacitance', unit: 'pF', value: 3, tex: 'C_s' }
      },
      note: 'Assumes two equal capacitors, one from each crystal pin to ground. Strays of 2 – 5 pF are typical; take the nearest standard value, and check the real frequency if timing matters.',
      stories: { C: 'A 32.768 kHz crystal specifies a load capacitance of {CL}; the board adds about {Cs} of stray capacitance. What two equal capacitors does it need?' },
      practice: { unknowns: ['C', 'CL'] }
    },
    {
      name: 'Clock error over an interval',
      expr: 'err = ppm/1000000*t',
      tex: '\\mathrm{err} = \\frac{\\mathrm{ppm}}{10^{6}}\\, t',
      vars: {
        err: { name: 'time error', q: 'time', unit: 's' },
        ppm: { name: 'clock error in parts per million', value: 20, tex: '\\mathrm{ppm}' },
        t: { name: 'interval', q: 'time', unit: 'h', value: 24 }
      },
      note: 'A 20 ppm crystal is off by 1.7 s in a day; a 2 % internal oscillator (20 000 ppm) by 29 minutes.',
      stories: { err: 'A clock is {ppm} ppm fast. By how much does it differ from true time after {t}?' },
      practice: { unknowns: ['err', 'ppm'] }
    }
  ],
  examples: [
    {
      title: 'How early must a sleepy sensor wake?',
      q: 'A sensor sleeps 10 minutes between transmissions, and the gateway expects it within a window of ±50 ms. Is the internal slow clock, with a 2 % error after calibration, good enough? And a 32.768 kHz crystal at 30 ppm?',
      steps: ['The internal clock: 2 % of 600 s is $0.02 \\times 600 = 12$ s of uncertainty. Far outside ±50 ms.', 'The crystal: $30\\times10^{-6} \\times 600 = 18$ ms. Inside the window.', 'The sensor can also wake early and listen, but with the RC it must listen for 24 s each time (±12 s) and the battery pays for that.'],
      a: 'No for the internal clock (12 s), yes for the crystal (18 ms). For a short wake window the crystal also saves energy, because the receiver is on for much less time.'
    }
  ],
  quiz: [
    { q: 'An ESP32-S3 board fits a 32.768 kHz crystal. Which pins does it take?', choices: ['GPIO0 and GPIO1', 'GPIO15 and GPIO16', 'GPIO32 and GPIO33', 'GPIO13 and GPIO14'], a: 1, why: 'On the S3 and S2 the crystal pins are GPIO15 and GPIO16. The ESP32 uses GPIO32 and 33, the C3, C6 and P4 use GPIO0 and 1, the H2 GPIO13 and 14.' },
    { q: 'A data logger must wake every minute and must not drift more than a few seconds in a day. What does it need?', choices: ['Nothing: the internal clock is good to ppm', 'An external 32.768 kHz crystal or a periodic correction from NTP', 'A faster CPU', 'A larger battery'], a: 1, why: 'The internal RC oscillator drifts by percent, which is minutes a day. The crystal is good to tens of ppm (seconds a day), and NTP corrects any remaining drift.' },
    { q: 'A clock is 20 ppm slow. How far is it behind after one day?', choices: ['About 1.7 ms', 'About 1.7 s', 'About 17 s', 'About 29 minutes'], a: 1, why: '20 × 10⁻⁶ × 86 400 s = 1.73 s.' },
    { q: 'The crystal of an ESP running Wi-Fi is also what times the program\'s millis().', a: true, why: 'While the chip is awake the CPU and its microsecond counter are derived from the main crystal (40 MHz on most chips), so millis() is as accurate as that crystal, to a few ppm.' }
  ],
  applications: [
    'Data loggers that wake on a schedule, where a crystal replaces a separate RTC chip.',
    'Battery-powered BLE, Zigbee and Thread devices, where tighter clocks mean shorter listening windows and longer battery life.',
    'Bare-chip products, where the 40 MHz crystal and its two capacitors are on the bill of materials.',
    'Metering and timestamping, where an NTP-corrected clock and a stable slow clock work together.'
  ],
  sources: [
    'Espressif, datasheets of the ESP32, ESP32-S3, ESP32-C3 and ESP32-C6: clock sources, crystal requirements and the XTAL_32K pins.',
    'Espressif, *ESP32 Hardware Design Guidelines*: the crystal circuit and its load capacitors.',
    'Espressif, *ESP-IDF Programming Guide*, *Sleep Modes* and *System Time*: the RTC slow clock sources and their accuracy.'
  ],
  sim: 'pc-crystal'
},

/* ================================================================ inductors-and-ferrites */
{
  id: 'inductors-and-ferrites',
  parent: 'passive-components',
  title: 'Inductors and ferrite beads',
  level: 2,
  short: 'An inductor resists any change in current. In a buck converter it stores and passes on energy; as a ferrite bead it turns radio-frequency noise on a supply line into heat; as a choke it keeps noise out of a cable.',
  keywords: ['inductor', 'ferrite bead', 'choke', 'common-mode choke', 'DC-DC', 'buck converter', 'saturation current', 'DCR', 'LC filter', 'EMI', 'noise', 'analog supply', 'impedance at 100 MHz', 'resonance'],
  prereq: ['capacitors-in-esp-circuits', 'regulators-ldo-and-buck', 'electronics:inductors'],
  related: ['the-3v3-rail', 'matching-and-tuning', 'usb-power', 'oversampling-and-noise', 'isolation-and-long-cables', 'electronics:buck-converter'],
  body: `A capacitor resists a change of voltage; an inductor resists a change of current: $v = L\\,\\mathrm{d}i/\\mathrm{d}t$. A current through a coil builds a magnetic field, the field stores energy, and the coil gives it back when the current falls. You rarely design one into an ESP circuit, but three kinds of inductor are on nearly every board.

### In the power supply: the buck converter

A switching regulator ([[regulators-ldo-and-buck]]) chops the input into pulses, and the inductor smooths them into a steady current for the output. Values are 1 – 22 µH. Two numbers matter: the **saturation current** (above it the core can hold no more magnetism, the inductance collapses and the current spikes) must exceed the peak current; the **DC resistance** (DCR) sets the loss. A converter's switching, often 1 – 2 MHz, leaves a small ripple on the output: it can show up as noise on ADC readings.

### The ferrite bead: a noise-eating inductor

A **ferrite bead** is an inductor made to be lossy. At low frequency it is a tiny resistance, a fraction of an ohm, and passes a supply current without fuss. At radio frequencies its impedance is large and *resistive*: it does not reflect noise back, it turns it into heat. It is specified by its impedance at 100 MHz, for example 600 Ω, and its DC resistance and rated current.

Used well it separates a noisy rail from a quiet one. A bead followed by a capacitor to ground forms a low-pass filter for the supply of an analogue sensor or a reference. Used badly it makes things worse:

- **Resonance.** A plain inductor with a ceramic capacitor rings at its resonant frequency and amplifies noise there; a lossy bead damps it, but an under-damped LC still peaks. The simulation shows it.
- **DC drop.** A bead of 0.2 Ω carrying a radio burst of 340 mA drops 68 mV. Do not put one in series with the module's main supply unless the bulk capacitor is on the module's side of it.
- **Saturation.** The impedance of a bead falls as its DC current rises. Check the curve at your current.

### Common-mode chokes

Two windings on one core let the wanted signal (current in one wire, out in the other) pass freely but resist noise that flows the same way in both wires. They appear on USB lines, CAN and Ethernet, and protect both a cable's emissions and its immunity.

### Radio parts

The tiny inductors in an antenna matching network are part of the radio design: leave them alone ([[matching-and-tuning]]).

> [!key] An inductor opposes changes in current: it smooths the output of a buck converter (check saturation current and DCR), and as a ferrite bead it turns radio-frequency noise into heat on an analogue or sensor supply. Pair a bead with a capacitor, mind the resonance, and keep it out of the module's own burst current path.`,
  ideas: [
    'An inductor stores energy in a magnetic field and opposes changes in current; v = L di/dt.',
    'In a buck converter it must not saturate at the peak current, and its DC resistance sets the loss.',
    'A ferrite bead is lossy: it turns high-frequency noise into heat and passes DC current; it is specified by its impedance at 100 MHz.',
    'A bead with a capacitor filters an analogue rail, but an under-damped LC resonance can amplify noise, and the bead\'s DC drop must be allowed for.'
  ],
  pitfalls: [
    'A ferrite bead and an inductor are the same thing — A bead is designed to be resistive at high frequency and absorb noise; an inductor is designed to store energy with little loss. They are used for different jobs.',
    'A bigger inductor is always a better filter — Above its self-resonance an inductor stops being an inductor, and with a capacitor it can resonate and amplify noise at one frequency.',
    'A bead can go anywhere in the supply — In the path of the radio\'s burst current it drops millivolts and starves the chip. Put it on analogue and sensor rails.'
  ],
  terms: [
    { term: 'Inductor', also: ['coil', 'choke'], def: 'A coil of wire that stores energy in a magnetic field and opposes changes of current. Its value is in henries; those on a board are microhenries.' },
    { term: 'Ferrite bead', also: ['bead', 'EMI bead'], def: 'An inductor made lossy on purpose: a small resistance at DC, a large resistive impedance at radio frequencies, where it turns noise into heat.' },
    { term: 'Saturation current', also: ['I_sat'], def: 'The current at which an inductor\'s core can hold no more magnetism and its inductance collapses. A converter\'s inductor must stay well below it at peak current.' },
    { term: 'DCR', also: ['DC resistance'], def: 'The resistance of an inductor\'s wire at DC. It causes a voltage drop and a power loss proportional to the current.' },
    { term: 'Common-mode choke', also: ['common-mode filter'], def: 'Two windings on one core that pass differential signals but oppose the noise current that flows in the same direction in both wires.' }
  ],
  choose: {
    good: ['A bead of about 600 Ω at 100 MHz and a rated current well above the load in front of an analogue sensor\'s supply', 'A converter inductor with a saturation current above the peak current, from the converter\'s datasheet', 'A common-mode choke on a USB or CAN cable that leaves the enclosure', 'A bead followed by 1 – 10 µF to ground, checking the resonance'],
    avoid: ['A bead in series with the module\'s own supply and no bulk capacitor on the module side', 'A converter inductor chosen only by its microhenries', 'Changing the matching inductors of a certified antenna', 'An LC filter with no damping where noise at its resonance matters'],
    check: ['DC resistance times the current, as millivolts lost', 'The impedance curve of the bead, not only the 100 MHz figure', 'Saturation or rated current against the peak', 'The measured noise on the filtered rail with an oscilloscope ([[the-oscilloscope]])']
  },
  examples: [
    {
      title: 'A quiet supply for a bridge sensor',
      q: 'A load-cell amplifier shares the 3.3 V rail with the ESP. Switching noise at 1.5 MHz from the board\'s buck converter appears on its readings. Design a filter and check the voltage drop for an amplifier that draws 10 mA.',
      steps: ['Choose a ferrite bead of 600 Ω at 100 MHz with DCR 0.1 Ω and a rated current of 500 mA, followed by 10 µF to ground at the amplifier.', 'DC drop: $0.01 \\times 0.1 = 1$ mV. Negligible.', 'The resonance of the bead\'s inductance (about 1 µH) with 10 µF is near 50 kHz, where there is little noise; check it on the oscilloscope.'],
      a: 'In the ideal model a 600 Ω bead and 10 µF cut the 1.5 MHz noise by 50 dB or more (a real layout gets less), and cost 1 mV of supply voltage. The same bead on the ESP\'s own supply would drop about 34 mV in a 340 mA burst.'
    }
  ],
  quiz: [
    { q: 'A ferrite bead is chosen with "600 Ω at 100 MHz". What does that tell you?', choices: ['It has a resistance of 600 Ω at DC', 'Its impedance at 100 MHz is about 600 Ω, so it will block noise at that frequency', 'It can carry 600 mA', 'Its inductance is 600 µH'], a: 1, why: 'Beads are rated by their impedance at 100 MHz, which says how strongly they absorb noise there. At DC they are a fraction of an ohm.' },
    { q: 'Why should a ferrite bead not be placed directly in series with the module\'s main 3.3 V when the radio bursts at 340 mA?', choices: ['It would block the Wi-Fi', 'Its DC resistance drops millivolts at the burst current and the supply sags as the radio starts', 'It would heat the module', 'Beads cannot carry current'], a: 1, why: 'A bead of 0.2 Ω drops 68 mV at 340 mA, and the bulk capacitor must be on the module side of it to supply the very first microseconds. Keep it on sensor and analogue rails.' },
    { q: 'What is the main specification of a converter\'s inductor to avoid trouble?', choices: ['Its colour', 'Its saturation current, above the converter\'s peak current', 'Its impedance at 100 MHz', 'Its length'], a: 1, why: 'When the core saturates, the inductance collapses and the current spikes, which can damage the converter. Choose a saturation current well above the peak.' },
    { q: 'A plain inductor and a ceramic capacitor can make noise worse at one frequency.', a: true, why: 'They form a resonant circuit with little damping, and noise near the resonant frequency is amplified. A lossy bead or a damping resistor reduces the peak.' }
  ],
  applications: [
    'The bead between the digital and analogue supplies of an audio codec or an ADC front end.',
    'The inductor next to the switching regulator on a battery-powered board.',
    'The common-mode chokes on USB, CAN and Ethernet connectors.',
    'The tiny inductors in the antenna matching network of a module, set by the maker.'
  ],
  sources: [
    'Manufacturers\' application notes on ferrite beads: impedance curves, DC resistance and rated current.',
    'Espressif, *ESP32 Hardware Design Guidelines*: the power supply and the RF matching network.',
    'Datasheets of switching regulators: the inductor selection, saturation current and DCR.'
  ],
  sim: 'pc-ferrite'
},

/* ================================================================ protection-parts */
{
  id: 'protection-parts',
  parent: 'passive-components',
  title: 'Protection: fuses, TVS diodes, series resistors',
  level: 2,
  short: 'Pins are fragile: a wrong voltage, a static spark, a spike from a motor or a short on the supply can end a board. A few cheap parts at the edges of the circuit turn most of these from fatal to forgettable.',
  keywords: ['protection', 'TVS', 'ESD', 'fuse', 'PTC', 'polyfuse', 'series resistor', 'clamp', 'overvoltage', 'reverse polarity', 'surge', 'Zener', 'USB protection', 'flyback', 'USBLC6'],
  prereq: ['resistors-in-esp-circuits', 'pin-current-limits', 'voltage-dividers-for-inputs'],
  related: ['diodes-in-esp-circuits', 'optocouplers', 'isolation-and-long-cables', 'esd-and-bench-safety', 'level-shifters', 'usb-power', 'relays'],
  body: `Protection is not about what the circuit does when it works. It is about what happens when a wire is plugged in the wrong place, a finger touches a connector on a dry day, or a long field cable picks up a distant lightning surge. You cannot make a pin invincible, but you can make the cheap part fail first.

### What goes wrong

| Event | Time scale | First defence |
|---|---|---|
| Too much voltage on a pin (5 V on a 3.3 V input) | steady | series resistor, clamp, divider |
| Static discharge (ESD) from people and cables | nanoseconds, kilovolts | TVS diode array at the connector |
| Inductive kick of a relay, motor, solenoid | microseconds, tens of volts | flyback diode ([[diodes-in-esp-circuits]]) |
| Reverse-connected supply | steady | series Schottky diode or P-channel MOSFET |
| Short circuit or overload on a supply | milliseconds to seconds | fuse, resettable fuse, current-limited supply |
| Surge on a long field cable | microseconds, hundreds of volts | TVS, series resistance, isolation ([[isolation-and-long-cables]]) |

### The series resistor: the cheapest protection

Every pin has diodes to the supply rails inside, which clamp a pin that strays beyond them. They are meant for brief ESD events, not for continuous current. A **series resistor** limits how much current such a diode must take: with 5 V on a pin of a 3.3 V chip, a 4.7 kΩ resistor lets about 0.2 mA flow, which the clamp absorbs; with no resistor the current is whatever the source gives. As a rule of thumb keep it below about 1 mA (our rule, not a datasheet figure). 1 kΩ to 10 kΩ in front of an input costs nothing at DC and safeguards against wiring slips.

### The TVS diode: for sparks and surges

A **TVS** (transient-voltage suppressor) is a diode that does nothing until the voltage passes its breakdown, and then conducts hard, clamping the line. Pick one with a standoff voltage at or above the highest normal signal (a 3.3 V part for a 3.3 V line, 5 V for USB), a low **capacitance** on fast lines (a pF or two on USB), and a short, fat ground connection. Place it right at the connector. Ready-made arrays for USB data lines exist (the USBLC6 type is one). Every protection part adds some leakage or capacitance of its own.

### The fuse

A fuse protects the wiring and the supply, not the chip. A **resettable fuse** (polymeric PTC) heats and raises its resistance when its trip current is passed, and recovers when the fault is gone. It is slow (seconds) and has a hold current, below which it never trips. Size it above the greatest normal load, with margin for the radio's bursts, and below what the wire, the connector or the supply can take. A fuse does not make mains wiring safe: that work belongs to a qualified person, with certified parts.

> [!key] Protect the edges of the circuit: a series resistor and a clamp on inputs, a TVS diode at every connector that leaves the box, a flyback diode on every coil, and a fuse on the supply. The cheapest part should fail first.`,
  ideas: [
    'A series resistor limits the current into a pin\'s internal clamp diodes; 1 – 10 kΩ keeps it under about 1 mA for a 5 V mistake.',
    'A TVS diode conducts only above its breakdown, clamping sparks and surges; place it at the connector with a short ground.',
    'A fuse or PTC protects the wiring and supply from overload, and has a hold and a trip current.',
    'Each fault has its own cure: overvoltage, ESD, inductive kick, reversed supply, short circuit, surge.'
  ],
  pitfalls: [
    'The chip already has ESD protection, so nothing more is needed — The pins have small diodes for handling, not for a connector people touch, a long cable or a 5 V mistake. Add protection at the connector.',
    'A fuse protects the chip — A fuse is far too slow for a spike; it protects wires and supplies from overload. Use a TVS and a series resistor for the chip.',
    'More protection parts always make a design safer — Each adds capacitance and leakage, and a wrong choice, such as a large TVS capacitance on USB, can break the interface.'
  ],
  terms: [
    { term: 'TVS diode', also: ['transient-voltage suppressor', 'ESD diode', 'ESD protection'], def: 'A diode that conducts only when the voltage rises past its breakdown, so it clamps sparks and surges. It must have a standoff voltage above the normal signal.' },
    { term: 'ESD', also: ['electrostatic discharge', 'static spark'], def: 'A sudden discharge of static electricity, nanoseconds long and kilovolts high, from a person or object touching a connector or a pin.' },
    { term: 'Resettable fuse', also: ['PTC', 'polyfuse', 'PPTC'], def: 'A polymer fuse whose resistance rises sharply when it overheats from excess current, and falls again when the fault is cleared. It has a hold current and a trip current.' },
    { term: 'Clamp', also: ['clamp diode', 'protection diode'], def: 'A diode that conducts when a node leaves its allowed range, holding it near the rail. Each pin of a chip has clamps to its supply rails inside.' },
    { term: 'Standoff voltage', also: ['working voltage', 'V_RWM'], def: 'The highest voltage a TVS can have across it without conducting. It must be at or above the normal signal.' }
  ],
  choose: {
    good: ['A 1 – 10 kΩ series resistor in front of an input that could meet 5 V or a long wire', 'A low-capacitance TVS array at the USB connector, close to the pins', 'A flyback diode across every relay or motor coil', 'A fuse or PTC with hold current just above the greatest normal load'],
    avoid: ['Relying on a pin\'s internal diodes for continuous overvoltage', 'A fuse as the only protection of a chip', 'A TVS of high capacitance on USB, Ethernet or other fast lines', 'A Zener clamp with high leakage across a battery that must last a year'],
    check: ['The highest voltage the line can meet in service and in a fault', 'The standoff voltage, capacitance and clamp voltage of the TVS', 'The hold and trip currents of the fuse against the radio\'s bursts', 'That the ground path of the TVS is short and wide']
  },
  examples: [
    {
      title: 'A 12 V sensor wired to the wrong input',
      q: 'A 12 V signal is wired by mistake to an ESP32 input that has a 4.7 kΩ resistor in series. The pin\'s clamp diode conducts at about 3.9 V. How much current flows, and what does the resistor dissipate?',
      steps: ['The resistor sees $12 - 3.9 = 8.1$ V, so $I = 8.1/4700 = 1.7$ mA.', 'It dissipates $8.1 \\times 1.7\\ \\mathrm{mA} = 14$ mW, harmless for an eighth-watt part.', 'The current is above the 1 mA guideline: a 10 kΩ resistor would give 0.81 mA.'],
      a: 'About 1.7 mA through the clamp, 14 mW in the resistor: probably survivable, but a 10 kΩ resistor brings it under 1 mA. Anything beyond that wants a TVS or a divider.'
    }
  ],
  quiz: [
    { q: 'An input may meet 5 V by mistake. What is the cheapest first defence for a 3.3 V pin?', choices: ['A larger power supply', 'A 4.7 – 10 kΩ resistor in series with the pin', 'A 10 A fuse', 'A bigger capacitor'], a: 1, why: 'The resistor limits the current into the pin\'s clamp diode to a fraction of a milliamp. It costs nothing at DC for a normal input.' },
    { q: 'Which part is best at stopping a static spark at a USB connector?', choices: ['A fuse', 'A low-capacitance TVS diode array close to the connector', 'A 100 µF capacitor', 'A ferrite bead'], a: 1, why: 'An ESD pulse lasts nanoseconds; a fuse is far too slow, and a TVS clamps within nanoseconds. USB signals are fast, so its capacitance must be a pF or two.' },
    { q: 'What does a resettable (PTC) fuse protect best?', choices: ['The chip against static', 'The wiring and supply against a lasting overload or short', 'The input against reverse voltage', 'The antenna'], a: 1, why: 'A PTC takes seconds to heat and raise its resistance. It guards against overload, not against microsecond transients.' },
    { q: 'Because the chip has internal ESD diodes on every pin, a pin can safely carry a continuous 20 mA from a 5 V mistake.', a: false, why: 'The diodes are sized for brief ESD events, not for continuous current. Limit the current to under a milliamp with a series resistor.' }
  ],
  applications: [
    'The TVS array and the PTC on the USB connector of a DevKit or product.',
    'The 1 kΩ series resistors on every GPIO that goes to a header, a button or a cable.',
    'The flyback diode and the fuse on a board that drives relays, motors and valves.',
    'The TVS and the isolation of RS-485 and 4 – 20 mA inputs on industrial boards.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: absolute maximum ratings and ESD ratings; *ESP32 Hardware Design Guidelines*.',
    'IEC 61000-4-2, electrostatic discharge immunity testing (the standard behind connector protection).',
    'Manufacturers\' datasheets of TVS diode arrays and polymeric PTC fuses: standoff voltage, capacitance, hold and trip current.'
  ],
  sim: 'pc-protect'
},

/* ================================================================ breadboards-wires-and-connectors */
{
  id: 'breadboards-wires-and-connectors',
  parent: 'passive-components',
  title: 'Breadboards, wires and connectors',
  level: 1,
  short: 'A solderless breadboard joins holes in a pattern you must know by heart; the wires and connectors that go with it have their own conventions, and most "my circuit does not work" stories end in one of them.',
  keywords: ['breadboard', 'solderless', 'jumper wire', 'Dupont', 'pin header', 'JST', 'Qwiic', 'STEMMA QT', 'Grove', 'USB-C', 'screw terminal', 'power rail', 'contact resistance', 'perfboard', 'prototype'],
  prereq: ['anatomy-of-a-dev-board', 'resistors-in-esp-circuits'],
  related: ['prototyping-stages', 'i2c-addresses-and-scanning', 'm5-units-and-grove-ports', 'qt-py-and-stemma-qt', 'soldering-and-rework', 'lithium-cells'],
  body: `A solderless breadboard is a plastic block of small holes with metal strips beneath. Push a wire or a component leg into a hole and it is joined to every other hole on the same strip. A circuit can be built and changed in minutes, but the strips run in a fixed pattern, and a leg in the wrong hole joins the wrong things.

### Which holes are joined

- **In the main area** the holes are joined in short **columns of five**: on a typical board, the five holes above the centre gap in one column are one connection, and the five below it another. Nothing is joined across a row or across the gap.
- **The centre gap** separates the two halves, so that a chip with two rows of pins can sit across it without joining them.
- **The power rails** are the long strips along the edges, joined along their whole length. On many boards the rail is *broken in the middle*: the left half and the right half are separate. A wire at the far end of a split rail gets no power. Check with a multimeter.

The simulation shows the pattern, and you can click on holes to light up what they join to.

### What a breadboard is and is not

It is for signals and for up to an ampere or so. The metal clips have a contact resistance of tens of milliohms that grows with wear; the strips and wires add a few picofarads and some inductance. They are fine for I2C, UART, ordinary SPI and analogue signals at a few kilohertz. They are poor for high-speed SPI, I2S above a couple of megahertz and USB, for anything near a radio antenna, and for loads that draw more than an ampere. A wide ESP32 DevKit covers almost the whole board: find a board with spare columns on both sides, or use two boards side by side.

### Wires

Use **solid 22 – 24 AWG** wire cut to length for tidy builds, or **Dupont jumper wires** (flexible, with a crimped pin or socket at each end) for flexible links. Use a colour code and stick to it: red for the positive supply, black or blue for ground, other colours for signals. A loose pin makes an intermittent fault that feels like a software bug.

### Connectors you will meet

| Connector | Pitch | Typical use | Remark |
|---|---|---|---|
| Pin header, Dupont | 2.54 mm | development boards, breadboards | the common standard |
| JST-PH | 2.0 mm | lithium cells on boards | **polarity differs between makers**: check before you plug in |
| JST-SH (Qwiic, STEMMA QT) | 1.0 mm | I2C sensors | four wires: GND, 3.3 V, SDA, SCL |
| Grove | 2.0 mm | Seeed modules | four wires; digital, analogue, I2C or UART versions |
| Screw terminal | 3.5 – 5 mm | field wiring | for wires up to a few amps |
| USB-C | | power and data | a power-only port needs 5.1 kΩ from each CC pin to ground |

> [!key] A breadboard joins columns of five holes either side of the centre gap and the long power rails, which may be split in the middle; it suits signals and slow buses, not speed or amps. Keep wires colour-coded, check the polarity of every battery connector, and move a working design to a soldered board.`,
  ideas: [
    'Holes in the same column of five, either side of the centre gap, are joined; the rows and the gap are not.',
    'The power rails run the full length of the board, but many are split in the middle.',
    'A breadboard suits signals and slow buses; it limits speed, current and noise.',
    'Connectors have conventions (colour, pitch and above all polarity) that differ between makers: check before connecting a battery.'
  ],
  pitfalls: [
    'The rails always run the whole length — Many full-size boards split them in the middle. If half of your circuit has no power, measure the rail.',
    'Both legs of a part in the same column is fine — They are joined: the part is shorted out and does nothing. Put its legs in different columns.',
    'All LiPo connectors with the same plug have the same polarity — They do not: two makers can wire the same JST-PH plug backwards. Check the plug against the battery and the board.'
  ],
  terms: [
    { term: 'Breadboard', also: ['solderless breadboard', 'protoboard'], def: 'A plastic board with holes joined by metal strips so that parts can be connected by pushing them in, without solder.' },
    { term: 'Power rail', also: ['bus strip', 'rail'], def: 'A long strip along the edge of a breadboard, joined along its length, for the supply and the ground. Some are split in the middle.' },
    { term: 'Dupont wire', also: ['jumper wire', 'jumper lead'], def: 'A flexible wire with a crimped pin or socket at each end, made to fit 2.54 mm headers.' },
    { term: 'JST connector', also: ['JST-PH', 'JST-SH', 'JST-XH'], def: 'A family of small keyed connectors. PH (2.0 mm) is common for lithium cells, SH (1.0 mm) for Qwiic and STEMMA QT sensors.' },
    { term: 'Qwiic', also: ['STEMMA QT'], def: 'A four-wire I2C connector, JST-SH 1.0 mm: ground, 3.3 V, SDA and SCL, so sensors plug in without wiring.' }
  ],
  choose: {
    good: ['A breadboard for first tests of sensors, LEDs, buttons and slow buses', 'Solid-core 22 – 24 AWG wire cut to length, colour-coded', 'Qwiic, STEMMA QT or Grove cables for sensors, which cannot be plugged in wrongly', 'A multimeter in continuity mode to check suspected joins'],
    avoid: ['Fast SPI, I2S and USB on a breadboard', 'More than about an ampere through breadboard contacts', 'Plugging in a lithium cell before checking the polarity', 'Leaving a breadboard as the finished product'],
    check: ['Whether the rails are split in the middle of your board', 'That both legs of every part are in different columns', 'The polarity of every battery plug against the board\'s marking', 'The contact of every jumper wire if a fault comes and goes']
  },
  code: [
    {
      title: 'Find out what is really connected: scan the I2C bus',
      about: 'A fast way to test a breadboard build: the program asks every address on the I2C bus and lists the devices that answer. A missing device usually means a bad contact, a wrong column or swapped wires.',
      needs: 'An ESP32 DevKit and an I2C module, for example an OLED display or a sensor, on a breadboard, with 4.7 kΩ pull-ups on SDA and SCL if the module has none.',
      wiring: [['GPIO21', 'module SDA'], ['GPIO22', 'module SCL'], ['3V3', 'module VCC'], ['GND', 'module GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          for each [address v] in (1 to 126)
            if <(I2C device answers at address (address))> then
              print (join [Found device at address ] (address))
            end
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21;                    // GPIO21 -> module SDA
        const int SCL_PIN = 22;                    // GPIO22 -> module SCL

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);    // (sda, scl, clock): 100 kHz is forgiving
          int found = 0;
          for (uint8_t a = 1; a < 127; a++) {
            Wire.beginTransmission(a);
            if (Wire.endTransmission() == 0) {     // 0 means the address was acknowledged
              Serial.printf("Found device at 0x%02X\n", a);
              found++;
            }
          }
          if (found == 0) Serial.println("No devices: check the contacts, columns and wires");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)   # GPIO22 -> SCL, GPIO21 -> SDA
        found = i2c.scan()                                    # a list of the addresses that answered
        for a in found:
            print("Found device at 0x%02X" % a)
        if not found:
            print("No devices: check the contacts, columns and wires")
      `,
      output: `
        Found device at 0x3C
      `,
      notes: ['0x3C is the usual address of a small OLED display; the module\'s datasheet lists its address. See [[i2c-addresses-and-scanning]].', 'On an ESP32-C3 or S3 use GPIO8 and GPIO9, or any other pins you pass in; a missing device that appears when you press the wires down is a contact fault, not a software one.']
    }
  ],
  examples: [
    {
      title: 'Why does the LED stay dark?',
      q: 'On a breadboard, a 330 Ω resistor and an LED are in series from the top rail to the bottom rail. The LED does not light. You find the resistor\'s legs in holes 4 and 5 of the same column, above the gap. What is wrong?',
      steps: ['The five holes above the gap in one column are joined, so both legs of the resistor are on the same strip.', 'The resistor is shorted out and cannot be part of the circuit: the other end of the LED chain is not connected to it.', 'Move one leg to the next column. The current then runs through the resistor, and the LED lights.'],
      a: 'Both resistor legs are in the same column, which is a single connection. Place the legs in different columns.'
    }
  ],
  quiz: [
    { q: 'Two resistor legs are in the same column of five holes above the centre gap. What does the resistor do?', choices: ['Works normally', 'Is shorted out: both legs are on the same connection', 'Is connected to the rail', 'Is connected to the holes below the gap'], a: 1, why: 'The holes of a column are one connection; a part with both legs there has no voltage across it and no effect.' },
    { q: 'Half of your breadboard circuit has no power although the rail wire is in place. What is the likely cause?', choices: ['The ESP32 is broken', 'The power rail is split in the middle, and the wire went to the wrong half', 'The wire is too short', 'The multimeter is wrong'], a: 1, why: 'Many boards split the rails in the middle. Measure the rail at both ends, or bridge the split with a jumper.' },
    { q: 'You are given a lithium cell with a JST-PH plug for a board with a JST-PH socket. Is it safe to plug it in without looking?', choices: ['Yes, the plug is a standard', 'No: the polarity of the wires differs between makers, so check it first', 'Yes, the connector is keyed so that it cannot be reversed', 'Only on a breadboard'], a: 1, why: 'The connector fits both ways of wiring. Two makers can put positive and negative on opposite pins; a reversed cell can destroy the board. Check the colours and the markings.' },
    { q: 'A breadboard is a good place to test high-speed SPI at 40 MHz.', a: false, why: 'The added capacitance, inductance and loose contacts spoil fast edges. Use short wires and a lower clock on a breadboard, or a soldered board.' }
  ],
  applications: [
    'First tests of every sensor, display and module before a circuit board is designed.',
    'Teaching and workshops, where the circuit is rebuilt many times.',
    'Debugging: a quick I2C scan to find out whether a module answers at all.',
    'Qwiic and Grove ecosystems, where a breadboard is not needed at all.'
  ],
  sources: [
    'Breadboard manufacturers\' data sheets: contact resistance, current rating and capacitance between strips.',
    'Sparkfun and Seeed documentation of the Qwiic and Grove connector systems (pin order and voltage).',
    'USB Type-C specification: the CC resistors of a power sink (5.1 kΩ to ground on each CC pin).'
  ],
  sim: 'pc-breadboard'
}
);
