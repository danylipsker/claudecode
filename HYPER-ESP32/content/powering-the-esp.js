/* HYPER-ESP32 · content/powering-the-esp.js
 *
 * Topic "Powering the ESP" (branch pins-and-power): the 3.3 V rail, regulators, transmit peaks and capacitors, brownout,
 * USB power, lithium cells, chargers, measuring the battery, AA and coin cells, solar, power paths, measuring current.
 * Simulations: sims/powering-the-esp.js (ids pw-…).
 */
Hyper.add(
/* ================================================================ the 3.3 V rail */
{
  id: 'the-3v3-rail',
  parent: 'powering-the-esp',
  title: 'The 3.3 V rail',
  level: 1,
  short: 'Every ESP chip lives on one 3.0–3.6 V supply that feeds its processor, its radio, its flash and everything you wire to the 3V3 pin. It is not a fixed 3.3 V: it dips when the radio transmits, and most "mystery" resets start there.',
  keywords: ['3V3', '3.3 V', 'supply voltage', 'VDD', 'power rail', 'supply range', '3.0 V', 'current budget', '3V3 pin', 'power supply', 'rail', 'transmit current', 'operating voltage'],
  prereq: ['anatomy-of-a-dev-board', 'three-volt-logic', 'electronics:resistance-ohms-law'],
  related: ['regulators-ldo-and-buck', 'current-peaks-and-capacitors', 'brownout', 'the-board-is-not-the-chip', 'minimal-esp32-circuit', 'pin-current-limits'],
  body: `Every ESP chip is supplied at about 3.3 V. There is no 5 V input and no separate supply for the radio: the same rail feeds the processor, the Wi-Fi and Bluetooth radio, the flash memory and, on a development board, every part you attach to the pin marked 3V3. When someone says "the ESP resets by itself" or "Wi-Fi works only sometimes", the cause is more often this rail than the program.

### What the chips ask for

The catalogue gives the same supply range for almost every chip, 3.0 to 3.6 V (the ESP8266 will start from 2.5 V). What changes is the current, which follows what the radio is doing:

| Chip | Supply | Transmitting | Receiving | Deep sleep |
|---|---|---|---|---|
| ESP32 | 3.0–3.6 V | 240 mA | 100 mA | 10 µA |
| ESP32-S2 | 3.0–3.6 V | 310 mA | 68 mA | 25 µA |
| ESP32-S3 | 3.0–3.6 V | 340 mA | 91 mA | 7 µA |
| ESP32-C3 | 3.0–3.6 V | 335 mA | 87 mA | 5 µA |
| ESP32-C6 | 3.0–3.6 V | 354 mA | 82 mA | 7 µA |
| ESP32-H2 | 3.0–3.6 V | 140 mA | 25 mA | 7 µA |
| ESP8266 | 2.5–3.6 V | 170 mA | 56 mA | 20 µA |

These are datasheet figures for full-power transmission and for the receiver listening; the rest of a board adds to them. The same rail must deliver 7 µA for hours and 340 mA for a few milliseconds: a ratio above forty thousand to one.

### A budget, not a number

3.3 V against a 3.0 V floor leaves 0.3 V, under 10 %, for everything that pulls the rail down: the regulator's tolerance, ripple, the voltage lost in a cable, a breadboard strip or a battery's internal resistance, and the dip when the radio switches on. Below the floor the chip is outside its specification; lower still and its brownout detector resets it ([[brownout]]).

To size a supply, take your chip's transmit current, add what other parts draw at the same moment (a backlight, a sensor, a relay coil), add a third for margin and round up: 500 mA is the figure most boards are designed around.

### The 3V3 pin

On a USB-powered board the 3V3 pin is an **output** of the board's regulator, shared with the chip. Small sensors may draw from it; motors, LED strips and relay coils may not, because the regulator (commonly rated for 500–800 mA) is already busy. Fed from outside, the pin becomes an **input** and must be the only source: a board powered through 3V3 while USB is plugged in sets two regulators against each other. No pin tolerates 5 V ([[three-volt-logic]]).

### Clean enough

The rail must also be quiet: ripple on 3V3 appears as noise in the analogue converter ([[the-esp-adc]]) and as weaker reception. That is why capacitors sit next to the module ([[current-peaks-and-capacitors]]) and why a switching regulator needs care ([[regulators-ldo-and-buck]]).

> [!key] The ESP runs from one 3.0–3.6 V rail shared by the chip and everything on 3V3, and that rail must follow a load that swings by a factor of tens of thousands. Treat the 0.3 V between 3.3 V and the 3.0 V floor as a budget that cable, regulator, ripple and transmit bursts all spend.`,
  ideas: [
    'All the ESP chips run from one supply, 3.0–3.6 V (2.5–3.6 V for the ESP8266); the processor, radio, flash and your parts share it.',
    'The rail must supply microamps in sleep and hundreds of milliamps in a transmit burst: a ratio above 40 000 to one.',
    'Only 0.3 V separates the nominal 3.3 V from the 3.0 V floor, and cable, regulator tolerance, ripple and the burst dip must all fit in it.',
    'On a USB board the 3V3 pin is a small shared output; fed from outside it is an input and must be the only source.'
  ],
  pitfalls: [
    'The chip draws about 80 mA, so any 100 mA supply will do — The average hides the peaks. A transmit burst needs 240–410 mA for milliseconds, and a source that cannot give it lets the rail sag until the chip resets.',
    'The 3V3 pin can power anything I attach — It is the output of the board\'s own regulator, shared with the chip and rated for a few hundred milliamps at most. Motors, strips and relay coils need a supply of their own.',
    'A multimeter reading 3.30 V proves the rail is healthy — A meter shows an average over a fraction of a second. A dip lasting one millisecond, exactly when the radio transmits, is invisible to it ([[measuring-current]]).'
  ],
  terms: [
    { term: 'Supply rail', also: ['rail', 'power rail'], def: 'A wire or plane at a fixed supply voltage that several parts share. On an ESP board the 3.3 V rail feeds the chip, the flash and the parts on the 3V3 pin.' },
    { term: '3V3 pin', also: ['3.3 V pin', '3V3 header'], def: 'The header pin carrying the board\'s 3.3 V rail. It is an output of the on-board regulator when the board is powered from USB, and an input when you bypass the regulator.' },
    { term: 'Current budget', also: ['power budget'], def: 'The sum of what every part can draw at the same moment, compared with what the supply can give. For an ESP it is set by the transmit burst, not by the average.' },
    { term: 'Ripple', also: ['supply noise', 'rail noise'], def: 'The small, fast variation riding on a supply voltage, left by a switching converter or caused by the load. It disturbs analogue readings and radio reception.' }
  ],
  examples: [
    {
      title: 'What must the supply give?',
      q: 'An ESP32-S3 board runs Wi-Fi, drives an OLED display (20 mA) and two I2C sensors (10 mA together). What current should its supply be able to deliver?',
      steps: ['The catalogue gives 340 mA for the S3 transmitting at full power.', 'Add the other parts, which are on at the same moment: $340 + 20 + 10 = 370$ mA.', 'Add a third for margin: $370 \\times 1.3 \\approx 480$ mA, so a 500 mA supply is the smallest sensible choice.'],
      a: 'About 500 mA, even though the average current of the project may be below 100 mA.'
    }
  ],
  quiz: [
    { q: 'A chip draws 5 µA asleep and 340 mA in a short transmit burst. What must the supply be designed for?', choices: ['The 5 µA, because the chip sleeps most of the time', 'The average of the two', 'The 340 mA peak (plus the rest of the board), while wasting little at 5 µA', 'Only the typical figure in the datasheet'], a: 2, why: 'The supply must deliver the peak when it is asked for, and a good design also keeps its own consumption small during sleep. The average describes the battery life, not what the regulator must cope with.' },
    { q: 'On a USB-powered DevKit you can also feed 5 V into the 3V3 pin; the regulator will cope.', a: false, why: '5 V is above the 3.6 V ceiling of the chip, and the 3V3 pin is the regulator\'s output. Feeding it from outside is only for a clean 3.3 V source, and then with nothing else powering the board.' },
    { q: 'The rail measures 3.3 V at idle and 3.05 V while the radio transmits. What is the situation?', choices: ['Healthy: it is above 3.0 V', 'Inside the specification but with almost no margin: a little more droop and trouble starts', 'Dangerous: the chip is overvoltage', 'Impossible: a rail cannot change'], a: 1, why: 'The range is 3.0–3.6 V, so 3.05 V is legal, but 50 mV of margin is too thin: a longer cable or a colder battery would push the rail under the floor.' },
    { q: 'What limits how much current you may take from the 3V3 pin of a USB-powered board?', choices: ['The USB-serial chip', 'The board\'s regulator, which is shared with the chip and everything else on the board', 'The length of the pin header', 'The flash memory'], a: 1, why: 'The pin is wired to the regulator output. What you draw there is current the chip cannot have.' }
  ],
  applications: [
    'Choosing a supply or battery for any new project starts from the transmit current on this page.',
    'Fault-finding an unstable board starts by looking at the rail at the module while the radio works.',
    'Deciding whether a sensor can run from the 3V3 pin or needs a regulator of its own.'
  ],
  sources: [
    'Espressif, ESP32, ESP32-S3, ESP32-C3 and ESP32-C6 datasheets: recommended operating conditions (supply voltage) and the current-consumption tables.',
    'Espressif, ESP32 Series Hardware Design Guidelines: the power-supply section on decoupling and the current the supply must provide.',
    'Espressif, ESP8266EX datasheet: operating voltage and current figures.'
  ],
  code: [
    {
      title: 'Read the 3V3 rail through a divider',
      about: 'The converter measures against its own internal reference, not against the supply, so it can watch the rail it runs on. Two equal resistors halve the rail, the program doubles the reading back. Good to a few per cent: enough to see a sag, not to calibrate a meter.',
      needs: 'An ESP32 DevKit (on an ESP32-S3 use GPIO1, on an ESP32-C3 GPIO0), two 100 kΩ resistors and a 100 nF capacitor.',
      wiring: [['3V3', '100 kΩ → GPIO34', 'the upper resistor'], ['GPIO34', '100 kΩ → GND, and 100 nF → GND', 'the capacitor steadies the reading'], ['GPIO34', 'ADC1 and input only', 'safe to read while Wi-Fi runs']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [pin_mv v] to (analog read pin (34) in millivolts)
          set [rail_mv v] to ((pin_mv) * (2))
          print (join [rail in mV: ] (rail_mv))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int RAIL_PIN = 34;                      // ADC1, input only: fine with Wi-Fi on

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          uint32_t pin_mv  = analogReadMilliVolts(RAIL_PIN);   // calibrated millivolts at the pin
          uint32_t rail_mv = pin_mv * 2;                       // undo the 1:2 divider
          Serial.printf("rail = %u mV\n", rail_mv);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)       # ADC1, input only: fine with Wi-Fi on

        while True:
            pin_mv = adc.read_uv() // 1000            # calibrated microvolts at the pin, as millivolts
            rail_mv = pin_mv * 2                      # undo the 1:2 divider
            print("rail =", rail_mv, "mV")
            time.sleep(1)
      `,
      output: `
        rail = 3291 mV
        rail = 3288 mV
        rail = 3294 mV
      `,
      notes: ['The divider draws 3.3 V / 200 kΩ = 16.5 µA for as long as it is connected: fine on a USB board, a big bite out of a sleeping battery project.', 'Use 1 % resistors. The two resistors, not the converter, set the accuracy.']
    }
  ],
  sim: { id: 'pw-burst', params: { supply: 'usb' } }
},

/* ================================================================ regulators */
{
  id: 'regulators-ldo-and-buck',
  parent: 'powering-the-esp',
  title: 'Regulators: LDO, buck and boost',
  level: 2,
  short: 'A regulator turns the source — USB, a lithium cell, 12 V, two AAs — into the steady 3.3 V the chip wants. A linear regulator wastes the difference as heat, a switching converter wastes little but adds noise, and the quiescent current of either can matter more than the chip.',
  keywords: ['LDO', 'linear regulator', 'buck converter', 'boost converter', 'buck-boost', 'dropout', 'quiescent current', 'Iq', 'AMS1117', 'ME6211', 'HT7333', 'MCP1700', 'TPS7A02', 'efficiency', 'step-down', 'step-up', 'regulator heat'],
  prereq: ['the-3v3-rail', 'electronics:linear-regulators', 'electronics:switching-converters'],
  related: ['current-peaks-and-capacitors', 'lithium-cells', 'the-board-is-not-the-chip', 'thermal-design', 'electronics:buck-converter', 'electronics:boost-converter', 'electronics:buck-boost'],
  body: `A regulator turns whatever the source gives (5 V from USB, 3.7 V from a lithium cell, 12 V from a supply, 3 V from two batteries) into the steady 3.3 V the chip wants. There are three families, and choosing among them is the biggest decision in powering an ESP.

### The linear regulator, or LDO

A linear regulator is a transistor acting as a variable resistor: it burns off whatever voltage is too much. Input current equals output current, so the loss is (Vin − Vout) × I and the efficiency cannot beat Vout ÷ Vin. From 5 V that is 66 %; from 12 V, 27 %. At 80 mA the first wastes 0.14 W and the second 0.70 W, more than a small package can shed. It is silent and needs only two capacitors: the cleanest supply for the radio and the ADC.

Two numbers separate the parts. **Dropout** is the smallest gap between input and output that still regulates. A classic AMS1117-3.3 needs about 1.1 V, so it wants 4.4 V in: fine from USB, hopeless from a lithium cell, where 3.7 V in gives roughly 2.6 V out. A *low-dropout* part needs 0.1–0.3 V. **Quiescent current** is what the regulator burns doing nothing: several milliamps for an AMS1117 (typical), tens of microamps for a part such as the ME6211, a few microamps or less for micro-power types such as the MCP1700, HT7333 or TPS7A02. Beside a chip asleep at 10 µA, an AMS1117 uses hundreds of times more. Micro-power parts are often rated for only 200–250 mA: check that yours can deliver the transmit burst.

### Switching converters

A buck converter chops the input into an inductor many thousand times a second and delivers the same *power* at a lower voltage: 85–95 % efficient, and its input current *falls* as the input voltage rises. From 12 V at 80 mA of output it takes about 25 mA, not 80. The costs are an inductor, layout care and switching noise at hundreds of kilohertz that can leak into the ADC and the radio. A **boost** converter steps up (two AA cells to 3.3 V); a **buck-boost** goes both ways, which suits a lithium cell that crosses 3.3 V as it empties.

| | LDO | Buck | Boost, buck-boost |
|---|---|---|---|
| Efficiency | Vout ÷ Vin | 85–95 % | 85–95 % |
| Input current | equals the load | falls as Vin rises | rises as Vin falls |
| Own current | AMS1117 mA; micro-power µA | tens of µA; nano-power parts tens of nA | tens of µA |
| Noise | none | switching ripple | switching ripple |

### Which, when

From USB at modest current, an LDO is simplest. From a lithium cell, a low-dropout LDO is efficient (3.3 ÷ 3.7 = 89 %) but strands the last tenth of the capacity below about 3.5 V; a buck-boost keeps it. From 12 V or more, use a buck; from two AA cells, a boost. Under 1 mA of average load the regulator's own current decides the battery life ([[the-board-is-not-the-chip]]).

> [!key] An LDO is silent and simple but wastes (Vin − Vout) × I, and a buck converter is efficient but noisy. Pick by the source voltage, the dropout the source leaves you, and the quiescent current the sleeping chip has to live with.`,
  ideas: [
    'A linear regulator turns the excess voltage into heat: loss = (Vin − Vout) × I, efficiency = Vout ÷ Vin.',
    'Dropout is the least Vin − Vout that still regulates: about 1.1 V for an AMS1117, 0.1–0.3 V for low-dropout parts.',
    'Quiescent current is what the regulator burns itself, from several mA (AMS1117) down to under 1 µA, and it can dwarf a sleeping chip.',
    'A buck converter keeps the power, not the current: its input current falls as Vin rises, but it adds switching noise.'
  ],
  pitfalls: [
    'A 3.3 V regulator gives 3.3 V from any input above 3.3 V — It needs the dropout on top. An AMS1117 fed from a 3.7 V lithium cell gives about 2.6 V, below the chip\'s 3.0 V floor.',
    'Switching converters are always the efficient choice — At microamp loads their own quiescent current and switching losses can make them worse than a micro-power LDO, and their noise can ruin ADC readings.',
    'The chip sleeps at 10 µA, so the board sleeps at 10 µA — The regulator and the other parts on the board have their own current. Several milliamps from an AMS1117 alone outweighs the chip by hundreds.'
  ],
  terms: [
    { term: 'LDO', also: ['low-dropout regulator', 'linear regulator'], def: 'A linear regulator that keeps regulating with only a small difference between input and output voltage, often 0.1–0.3 V. It dissipates (Vin − Vout) × I as heat.' },
    { term: 'Dropout voltage', also: ['dropout'], def: 'The smallest input-to-output difference at which a linear regulator still holds its output. Below it the output simply follows the input minus the dropout.' },
    { term: 'Quiescent current', also: ['Iq', 'ground current'], def: 'The current a regulator draws for its own operation with no load connected. It is a loss that never stops, and it dominates the battery life of a sleeping device.' },
    { term: 'Buck converter', also: ['step-down converter', 'switching regulator'], def: 'A switching regulator that produces a lower voltage than its input by chopping the input into an inductor. It is usually 85–95 % efficient and its input current falls as the input voltage rises.' },
    { term: 'Boost converter', also: ['step-up converter'], def: 'A switching regulator that produces a higher voltage than its input, such as 3.3 V from two AA cells. Its input current rises as the input voltage falls.' },
    { term: 'Buck-boost converter', also: ['buck-boost'], def: 'A switching regulator that holds its output whether the input is above or below it, which lets a lithium cell be used from 4.2 V all the way down to 3.0 V.' }
  ],
  choose: {
    good: ['An LDO from USB 5 V at modest current: silent, tiny, two capacitors', 'A low-dropout LDO from a single lithium cell: about 89 % efficient at 3.7 V', 'A buck converter from 9–24 V supplies, where an LDO would cook', 'A buck-boost or boost where the battery crosses or stays below 3.3 V'],
    avoid: ['An AMS1117 on a lithium cell or on two or three AA cells: it drops out', 'An LDO from 12 V or more at 100 mA and up: 0.9 W and more of heat', 'A noisy switcher beside an unfiltered ADC input or an antenna, without layout care', 'A micro-power LDO rated 200–250 mA behind a Wi-Fi radio'],
    check: ['Dropout voltage at your peak current and your lowest input', 'Quiescent current against your sleep budget', 'The maximum output current against the transmit burst plus the board', 'Output capacitor requirements: some older LDOs are fussy about the type']
  },
  examples: [
    {
      title: 'LDO or buck from 12 V?',
      q: 'A project runs from a 12 V supply and averages 80 mA at 3.3 V. Compare an LDO with a 90 % buck converter: heat and input current.',
      steps: ['LDO: input current equals the load, 80 mA. Heat $= (12 - 3.3) \\times 0.08 = 0.70$ W, efficiency $3.3/12 = 27$ %.', 'Buck: output power $3.3 \\times 0.08 = 0.264$ W. Input power $= 0.264 / 0.9 = 0.293$ W, so input current $= 0.293 / 12 = 24$ mA. Heat $= 0.293 - 0.264 = 0.03$ W.', 'The buck takes a third of the current and produces one twenty-fourth of the heat.'],
      a: 'The LDO dissipates 0.70 W and draws 80 mA; the buck dissipates 0.03 W and draws 24 mA. Above about 6 V in, use a buck.'
    }
  ],
  formulas: [
    {
      name: 'Heat in a linear regulator',
      expr: 'P = (Vin - Vout)*I',
      tex: 'P = \\left(V_{\\mathrm{in}} - V_{\\mathrm{out}}\\right) I',
      vars: {
        P: { name: 'heat in the regulator', q: 'power', unit: 'mW' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\mathrm{in}}' },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{out}}' },
        I: { name: 'load current', q: 'current', unit: 'mA', value: 80 }
      },
      note: 'Valid while Vin exceeds Vout by at least the dropout voltage. The input current is the load current plus the regulator\'s own quiescent current.',
      stories: { P: 'A linear regulator turns {Vin} into {Vout} for a load of {I}. How much heat does it dissipate?' },
      practice: { unknowns: ['P', 'I'] }
    },
    {
      name: 'Efficiency of a linear regulator',
      expr: 'eta = Vout/Vin',
      tex: '\\eta = \\frac{V_{\\mathrm{out}}}{V_{\\mathrm{in}}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\mathrm{in}}' }
      },
      note: 'Ignores the regulator\'s quiescent current, which dominates the efficiency at microamp loads.',
      stories: { eta: 'An LDO turns {Vin} into {Vout}. What is its best possible efficiency?' }
    },
    {
      name: 'Input current of a buck converter',
      expr: 'Iin = Vout*Iout/(eta*Vin)',
      tex: 'I_{\\mathrm{in}} = \\frac{V_{\\mathrm{out}}\\, I_{\\mathrm{out}}}{\\eta\\, V_{\\mathrm{in}}}',
      vars: {
        Iin: { name: 'input current', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{in}}' },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{out}}' },
        Iout: { name: 'output current', q: 'current', unit: 'mA', value: 80, tex: 'I_{\\mathrm{out}}' },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 90, tex: '\\eta' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\mathrm{in}}' }
      },
      note: 'Power in equals power out divided by the efficiency. At very light loads the converter\'s own quiescent current adds to Iin.',
      stories: { Iin: 'A buck converter at {eta} efficiency delivers {Iout} at {Vout} from a {Vin} supply. What current does it draw from the supply?' }
    }
  ],
  quiz: [
    { q: 'An AMS1117-3.3 is fed from a freshly charged lithium cell at 4.2 V. What does the output look like under a Wi-Fi burst?', choices: ['A steady 3.3 V', 'About 3.1 V or less: 4.2 V minus the 1.1 V dropout is already below 3.3 V', 'About 4.2 V', 'Zero: it shuts down above 4.0 V'], a: 1, why: 'It needs about 4.4 V in to hold 3.3 V. With 4.2 V in the output follows the input minus the dropout, about 3.1 V, and falls further as the cell discharges.' },
    { q: 'Why can a switching converter draw less input current than the load it feeds, while an LDO never can?', choices: ['The converter creates energy', 'The converter delivers the same power at a lower voltage, so the current at the higher input voltage is smaller', 'The LDO is not rated for it', 'It cannot: the statement is false'], a: 1, why: 'Power in is about power out divided by the efficiency. A higher input voltage means a proportionally lower input current. A linear regulator passes the load current straight through.' },
    { q: 'A battery sensor sleeps at 10 µA, but the board draws 5 mA asleep. Which part is the likeliest culprit?', choices: ['The flash memory', 'An AMS1117 regulator with its several milliamps of quiescent current', 'The antenna', 'The 40 MHz crystal'], a: 1, why: 'Several milliamps of quiescent current is typical of an AMS1117. A micro-power LDO or a nano-power buck with microamps would leave the 10 µA visible.' },
    { q: 'A 12 V supply feeds an LDO that delivers 3.3 V at 100 mA. How much power turns into heat?', answer: 0.87, unit: 'W', why: '(12 − 3.3) V × 0.1 A = 0.87 W. A small surface-mount package cannot lose that without getting very hot; use a buck converter.' }
  ],
  applications: [
    'Every development board has an LDO or a buck on it: knowing which one explains the board\'s sleep current and its behaviour on a battery.',
    'Battery projects choose between a low-quiescent LDO, a buck-boost and a boost from the source voltage and the sleep budget.',
    'Industrial 12 V and 24 V nodes use a buck converter ahead of the ESP.',
    'Boards with Wi-Fi and a camera or display need a regulator rated well above the 340 mA transmit burst.'
  ],
  sources: [
    'Datasheets of the AMS1117, ME6211, HT7333, MCP1700 and TPS7A02 regulators: dropout voltage, quiescent current and maximum output current.',
    'Hyper Electronics: linear regulators, switching converters, buck, boost and buck-boost converters.',
    'Espressif, ESP32 Series Hardware Design Guidelines: power-supply requirements for the chip and its modules.'
  ],
  sim: 'pw-regulators'
},

/* ================================================================ current peaks and capacitors */
{
  id: 'current-peaks-and-capacitors',
  parent: 'powering-the-esp',
  title: 'Transmit peaks and the capacitor that saves the day',
  level: 2,
  short: 'A radio draws tens of milliamps for ages and 250–400 mA in bursts a millisecond long. The supply cannot follow instantly, so the rail dips; a capacitor beside the module supplies the first microseconds.',
  keywords: ['transmit burst', 'current peak', 'bulk capacitor', 'decoupling', 'hold-up', 'ESR', 'voltage dip', 'sag', 'rail droop', '100 uF', '470 uF', 'electrolytic', 'ceramic', 'DC bias'],
  prereq: ['the-3v3-rail', 'regulators-ldo-and-buck', 'electronics:capacitors'],
  related: ['brownout', 'capacitors-in-esp-circuits', 'usb-power', 'aa-cells-and-coin-cells', 'measuring-current', 'electronics:decoupling', 'electronics:supercapacitors'],
  body: `A radio does not draw a steady current. It idles at a few tens of milliamps, listens at 80–110 mA, and when it transmits the current climbs to 240 mA on the ESP32, 335–354 mA on the C3, S3 and C6 and over 400 mA on the C5. The climb takes a few microseconds, the burst lasts from about a hundred microseconds to several milliseconds, and it ends as abruptly. Bursts come when your program sends, when the board connects, and, if the board is an access point, every beacon, about ten times a second.

### Why the rail dips

Two things stand between the source and the chip, and neither is perfect.

1. **Resistance.** A cable, a connector, a breadboard strip and a battery's internal resistance each drop voltage in proportion to current: ΔV = I × R. A burst of 0.34 A through 1 Ω of cable and contacts takes 0.34 V off the rail, more than the whole 0.3 V margin ([[the-3v3-rail]]).
2. **Time.** A regulator needs tens of microseconds to answer a sudden load, and a battery or a long cable cannot deliver current that fast. For that moment the output sags by the current step times the output impedance.

### The capacitor as a local battery

A capacitor next to the module holds charge and gives it up the instant the current is demanded; the source refills it between bursts. The charge a burst takes is I × t, and the capacitor must supply it without dropping more than ΔV:

C = I × t ÷ ΔV

A 340 mA step that the regulator needs 100 µs to catch up with, held to 0.1 V, asks for 340 µF. If the source can give nothing at all for a whole 2 ms burst, it asks for 6.8 mF, which tells you the source is too weak ([[aa-cells-and-coin-cells]]).

### What to fit

- **100 nF ceramic** at each supply pin, for the nanosecond edges.
- **10 µF ceramic** close by. Ceramics lose capacitance under DC bias: a 10 µF part rated 6.3 V may give only 4 µF at 3.3 V.
- **100–470 µF low-ESR** (polymer, tantalum or a good electrolytic) at the module's 3V3 and GND pins. ESR matters: 0.5 Ω of series resistance turns a 340 mA step into a 0.17 V jump before the capacitor even starts to help.

Put them where the current flows: short, wide tracks, at the module, not at the far end of a breadboard. See [[capacitors-in-esp-circuits]] for the parts and [the battery calculator](#/tools/espcalc/battery) for what the bursts cost in battery life.

### See it

Watch the rail at the module with an oscilloscope while the board connects ([[the-oscilloscope]]), or use the program below to log how low the rail goes while Wi-Fi starts. The simulation lets you vary the supply, the capacitor and the burst.

> [!key] The radio asks for 250–400 mA in bursts of microseconds to milliseconds, and cable, battery and regulator cannot answer instantly. A 100–470 µF low-ESR capacitor at the module, with 100 nF at the pins, supplies the first moments: C = I × t ÷ ΔV.`,
  ideas: [
    'Radio current comes in bursts: a rise in microseconds to 240–400 mA, lasting 0.1–several ms.',
    'The rail dips by I × R across the cable, contacts and battery, and by the regulator\'s slow reaction.',
    'A capacitor at the module supplies the burst\'s first moments: C = I × t ÷ ΔV, in the hundreds of microfarads.',
    'ESR and DC-bias loss decide whether the capacitor you fitted does its job.'
  ],
  pitfalls: [
    'A 100 nF capacitor on the supply is all an ESP needs — It handles the nanosecond edges of the logic. The radio burst needs hundreds of microfarads close to the module.',
    'A bigger capacitor fixes any weak supply — It supplies a burst once and must be refilled. If the source cannot refill it between bursts, or has high resistance, the dip returns.',
    'Any 470 µF capacitor will do — A cheap electrolytic with 0.5–1 Ω of ESR drops 0.17–0.34 V in the first microsecond. Use low-ESR types, or add ceramics in parallel.'
  ],
  terms: [
    { term: 'Transmit burst', also: ['TX burst', 'current peak'], def: 'The short interval, from about a hundred microseconds to a few milliseconds, in which the radio transmits and the chip draws its highest current: 240–410 mA depending on the chip.' },
    { term: 'Bulk capacitor', also: ['reservoir capacitor', 'hold-up capacitor'], def: 'A larger capacitor, typically 100–470 µF, placed at the module to supply the first moments of a current burst while the regulator or battery catches up.' },
    { term: 'ESR', also: ['equivalent series resistance'], def: 'The small resistance in series with a real capacitor. During a current step it causes an immediate voltage jump of I × ESR, so a low value matters for hold-up capacitors.' },
    { term: 'Decoupling capacitor', also: ['bypass capacitor'], def: 'A small capacitor, usually 100 nF, placed at a chip\'s supply pin to supply very fast current edges locally and keep high-frequency noise off the rail.' }
  ],
  choose: {
    good: ['Low-ESR polymer or tantalum 100–470 µF at the module, with ceramics in parallel', '100 nF ceramic at every supply pin, 10 µF close by', 'Short, wide supply tracks and a solid ground path to the capacitor'],
    avoid: ['A single 100 nF capacitor as the only decoupling of a Wi-Fi board', 'Cheap high-ESR electrolytics with no ceramic beside them', 'Capacitors parked at the other end of a breadboard from the module'],
    check: ['The ceramic\'s DC-bias derating at 3.3 V', 'The rail at the module with an oscilloscope while Wi-Fi connects', 'Whether the source can refill the capacitor between bursts']
  },
  code: [
    {
      title: 'How low does the rail go while Wi-Fi starts?',
      about: 'Starts a Wi-Fi connection (the credentials may be wrong: the board still transmits while it searches) and watches the rail for three seconds as fast as the converter allows, remembering the lowest and highest values. The reading goes through the 1:2 divider of the previous page.',
      needs: 'An ESP32 DevKit with the rail divider on GPIO34 (GPIO1 on an S3, GPIO0 on a C3).',
      wiring: [['3V3', '100 kΩ → GPIO34'], ['GPIO34', '100 kΩ → GND, and 100 nF → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set [lowest v] to (9999)
          set [highest v] to (0)
          connect to Wi-Fi [your-ssid] password [your-password]
          set [start v] to (milliseconds since start)
          repeat until <((milliseconds since start) - (start)) > (3000)>
            set [mv v] to ((analog read pin (34) in millivolts) * (2))
            if <(mv) < (lowest)> then
              set [lowest v] to (mv)
            end
            if <(mv) > (highest)> then
              set [highest v] to (mv)
            end
          end
          print (join [dip in mV: ] ((highest) - (lowest)))
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const int RAIL_PIN = 34;                 // ADC1: the rail through 100 k + 100 k

        void setup() {
          Serial.begin(115200);
          uint32_t lowest = 9999, highest = 0;
          WiFi.begin("your-ssid", "your-password");   // returns at once; the radio keeps working
          uint32_t start = millis();
          while (millis() - start < 3000) {
            uint32_t mv = analogReadMilliVolts(RAIL_PIN) * 2;
            if (mv < lowest) lowest = mv;
            if (mv > highest) highest = mv;
          }
          Serial.printf("rail: lowest %u mV, highest %u mV, dip %u mV\n", lowest, highest, highest - lowest);
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time
        from machine import ADC, Pin

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)  # ADC1: the rail through 100 k + 100 k
        lowest, highest = 9999, 0
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")   # returns at once; the radio keeps working
        start = time.ticks_ms()
        while time.ticks_diff(time.ticks_ms(), start) < 3000:
            mv = adc.read_uv() // 500                # microvolts at the pin to millivolts of the rail
            if mv < lowest:
                lowest = mv
            if mv > highest:
                highest = mv
        print("rail: lowest", lowest, "mV, highest", highest, "mV, dip", highest - lowest, "mV")
      `,
      output: `
        rail: lowest 3187 mV, highest 3302 mV, dip 115 mV
      `,
      notes: ['The converter is noisy while the radio works, adding a few tens of millivolts of scatter: believe dips well above that, and use an oscilloscope for the real shape.', 'The sampling is slower than the shortest bursts, so the true minimum is lower than the program reports. Do not leave a real password in shared code ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'Size the capacitor',
      q: 'An ESP32-C3 steps from receiving (87 mA) to transmitting (335 mA). The regulator needs about 100 µs to respond, and the rail may dip by 0.1 V at most. What capacitor holds it?',
      steps: ['The current step is $335 - 87 = 248$ mA.', '$C = I\\,t/\\Delta V = 0.248 \\times 100\\times10^{-6} / 0.1 = 248\\ \\mu\\text{F}$.', 'A ceramic loses capacitance under bias, and ESR adds its own jump, so fit a 330 µF low-ESR capacitor, or 100 µF with ceramics in parallel, and test it.'],
      a: 'About 250 µF of effective capacitance: a 330 µF low-ESR part at the module.'
    }
  ],
  formulas: [
    {
      name: 'Hold-up capacitance',
      expr: 'C = I*t/dV',
      tex: 'C = \\frac{I\\, t}{\\Delta V}',
      vars: {
        C: { name: 'capacitance needed', q: 'capacitance', unit: 'µF' },
        I: { name: 'current the capacitor must supply', q: 'current', unit: 'mA', value: 340 },
        t: { name: 'time until the source takes over', q: 'time', unit: 'µs', value: 100 },
        dV: { name: 'allowed droop', q: 'voltage', unit: 'V', value: 0.1, tex: '\\Delta V' }
      },
      note: 'Assumes the capacitor supplies the whole current for the whole time. Ignores ESR, DC-bias loss and the current the source does supply, so treat it as the minimum.',
      stories: { C: 'A load steps by {I} for {t} before the source catches up, and the rail may sag by {dV}. What capacitance supplies it?' },
      practice: { unknowns: ['C', 'dV'] }
    },
    {
      name: 'Dip across a supply\'s resistance',
      expr: 'dV = I*R',
      tex: '\\Delta V = I\\, R',
      vars: {
        dV: { name: 'voltage lost', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        I: { name: 'burst current', q: 'current', unit: 'mA', value: 340 },
        R: { name: 'series resistance (cable, contacts, cell)', q: 'resistance', unit: 'Ω', value: 0.5 }
      },
      note: 'Ohm\'s law across everything between the source and the chip. A coin cell has 10–20 Ω, a LiPo cell 0.1–0.3 Ω, a breadboard strip a fraction of an ohm.',
      stories: { dV: 'A burst of {I} flows through {R} of cable and contacts. How much voltage is lost?' }
    }
  ],
  quiz: [
    { q: 'A board resets only when Wi-Fi connects. A 470 µF capacitor beside the module cures it. Why?', choices: ['The capacitor filters out the Wi-Fi signal', 'It supplies the burst\'s first moments, so the rail no longer dips below the brownout threshold', 'It raises the supply voltage', 'It slows the radio down'], a: 1, why: 'The capacitor is a local reservoir: during the burst it gives the extra current, and the source refills it afterwards. The dip shrinks from hundreds of millivolts to tens.' },
    { q: 'How much capacitance holds a 300 mA step for 50 µs to within 0.15 V of droop?', answer: 100, unit: 'µF', why: 'C = I × t ÷ ΔV = 0.3 × 50×10⁻⁶ ÷ 0.15 = 100 µF.' },
    { q: 'A 10 µF ceramic capacitor rated for 6.3 V always provides 10 µF.', a: false, why: 'Ceramic capacitors of the common X5R and X7R types lose a large part of their capacitance as the DC voltage across them rises. At 3.3 V a small, low-voltage part may give less than half its rating.' },
    { q: 'Why does a low-ESR capacitor matter in this job?', choices: ['It lasts longer', 'The burst current times the ESR is an immediate voltage jump before the capacitor even starts to help', 'It stores more charge', 'It costs less'], a: 1, why: 'A step of 340 mA through 0.5 Ω of ESR drops 0.17 V at once. The capacitance cannot fix that: only a lower ESR, or ceramics in parallel, can.' }
  ],
  applications: [
    'Cure for the Wi-Fi boot loop on a USB board with a long cable.',
    'Making a LiPo or AA-powered Wi-Fi sensor survive its transmit bursts.',
    'Choosing the 100–470 µF capacitor of a custom board around an ESP module.',
    'Reading an oscilloscope trace of the 3V3 rail at connect time.'
  ],
  sources: [
    'Espressif, ESP32 Series Hardware Design Guidelines: power-supply decoupling and the current the supply must deliver.',
    'Espressif, ESP32-C3, ESP32-S3 and ESP32-C6 datasheets: current-consumption tables for transmit and receive.',
    'Hyper Electronics: capacitors, decoupling and supercapacitors.'
  ],
  sim: { id: 'pw-burst', params: { supply: 'usb-thin', cap: 1 } }
},

/* ================================================================ brownout */
{
  id: 'brownout',
  parent: 'powering-the-esp',
  title: 'Brownout: the reset that looks like a bug',
  level: 2,
  short: 'When the supply sags below a threshold, the chip resets itself rather than run on a rail it cannot trust. The result is a boot loop that looks like a software bug but is a power problem, and the cures run from a better cable to a capacitor, never to switching the detector off.',
  keywords: ['brownout', 'brown-out', 'BROWNOUT_RST', 'Brownout detector was triggered', 'boot loop', 'reset loop', 'random reset', 'reboot', 'ESP32-CAM', 'supply sag', 'undervoltage', 'reset reason'],
  prereq: ['current-peaks-and-capacitors', 'the-3v3-rail', 'reset-reasons'],
  related: ['reading-boot-messages', 'watchdog-resets', 'usb-power', 'regulators-ldo-and-buck', 'fault-finding-method', 'flash-wear'],
  body: `Inside every ESP chip a small circuit compares the supply voltage with a threshold. If the rail falls below it, the chip does not try to carry on: it resets itself. The default threshold is a little under 2.5 V, and the build configuration can raise it (the ESP32 offers levels up to about 2.8 V). The reason is sound: logic and flash below their rated voltage misbehave, an instruction fetch returns garbage, a flash write stores a wrong value. A reset is the safe answer. The trouble is that from the outside it looks like a crash.

### What it looks like

On the serial monitor, again and again:

~~~text
Brownout detector was triggered

ets Jul 29 2019 12:21:46
rst:0xf (BROWNOUT_RST),boot:0x13 (SPI_FAST_FLASH_BOOT)
~~~

The wording differs between chips and versions, but "brownout" is in it, and the reset reason read at the next start says so ([[reset-reasons]]). The telling pattern is a **boot loop** that begins at the same moment of every run: the instant the program starts Wi-Fi, switches on a backlight or moves a servo. Boot, start the radio, the current jumps, the rail dips below the threshold, reset, boot again.

### Why Wi-Fi start-up is the classic trigger

At start the radio calibrates and then transmits at full power, often together with other new loads. The rail dips most when the capacitor is missing, the source is weak, or the regulator is already close to dropout ([[current-peaks-and-capacitors]]). A board that works on a bench supply and fails on a battery, a long cable or a hub is almost always this.

### The cures, in order

1. **The cable and the port.** A thin or long USB cable, or an unpowered hub, can lose a quarter of a volt ([[usb-power]]). Try a short cable straight into a computer port or a charger.
2. **The supply.** A 5 V source that can give 1 A; a battery that can give the peak (a coin cell, a tiny LiPo, or two AAs near the end cannot).
3. **A bulk capacitor** of 100–470 µF, low-ESR, at the module, with 100 nF at the pins.
4. **The regulator.** A low-dropout part rated for at least 500 mA; never an AMS1117 on a lithium cell ([[regulators-ldo-and-buck]]).

### The cure not to use

Forum posts show a line that writes zero to the detector's control register. The resets stop; the problem stays. The chip now runs on a rail below its rating: Wi-Fi drops packets, ADC readings drift, and a flash write at low voltage can corrupt the file system, the saved settings or an update in progress. Disabling the detector hides the symptom and keeps the cause. Fix the supply.

> [!key] Brownout is the chip protecting itself from a rail that has sagged below about 2.5 V, usually in the radio's start-up burst. Cure it at the source, in order: cable, supply, bulk capacitor, regulator. Switching the detector off only trades clean resets for corrupted flash.`,
  ideas: [
    'A comparator on the chip resets it whenever the supply falls below a threshold of about 2.4–2.8 V.',
    'The symptom is a boot loop whose message says "Brownout detector was triggered" and whose reset reason is BROWNOUT, often starting when Wi-Fi starts.',
    'Cure the supply in order: cable and port, source, a bulk capacitor at the module, the regulator.',
    'Switching the detector off hides the symptom and risks corrupt flash, drifting readings and lost packets.'
  ],
  pitfalls: [
    'A reset loop means my program has a bug — A brownout reset repeats at exactly the moment a power-hungry task starts. Read the boot message and the reset reason before touching the code.',
    'It works on my bench supply, so the board is fine — A bench supply is stiff. The same board on a thin cable, a hub or a battery sags. The test is the rail at the module under load, not the supply you chose.',
    'Disabling the brownout detector solved it — It silenced it. The chip is now running below its rated voltage, where flash writes can be corrupted and the radio misbehaves.'
  ],
  terms: [
    { term: 'Brownout', also: ['brown-out', 'undervoltage reset'], def: 'A drop of the supply voltage below the level at which the chip can work reliably, as opposed to a complete loss of power. The chip answers by resetting itself.' },
    { term: 'Brownout detector', also: ['BOD', 'brownout reset circuit'], def: 'A circuit inside the chip that compares the supply with a threshold of about 2.4–2.8 V and forces a reset when the supply falls below it. The level is set in the build configuration.' },
    { term: 'Boot loop', also: ['reset loop', 'reboot loop'], def: 'A chip that starts, fails at the same point and resets again, over and over. After a brownout the failing step is usually the first heavy load, such as starting Wi-Fi.' }
  ],
  code: [
    {
      title: 'Why did it restart? Then stress the supply',
      about: 'Prints the reason for the last restart, then makes the radio transmit by scanning for networks, the usual way to provoke a brownout on a weak supply. If the board is marginal, the next start-up reports a brownout.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [last restart: ] (restart reason))
          scan Wi-Fi networks
          print (join [networks found: ] (number of networks))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_system.h>

        const char* reasonText(esp_reset_reason_t r) {
          switch (r) {
            case ESP_RST_POWERON:   return "power-on";
            case ESP_RST_BROWNOUT:  return "BROWNOUT: the supply sagged";
            case ESP_RST_SW:        return "software restart";
            case ESP_RST_PANIC:     return "crash (panic)";
            case ESP_RST_DEEPSLEEP: return "woke from deep sleep";
            case ESP_RST_TASK_WDT:
            case ESP_RST_INT_WDT:
            case ESP_RST_WDT:       return "watchdog";
            default:                return "other";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(500);
          Serial.printf("last restart: %s\n", reasonText(esp_reset_reason()));
          WiFi.mode(WIFI_STA);
          int n = WiFi.scanNetworks();               // transmits probe requests on every channel
          Serial.printf("networks found: %d\n", n);
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, network

        causes = {
            machine.PWRON_RESET: "power-on or brownout",
            machine.HARD_RESET: "hard reset",
            machine.WDT_RESET: "watchdog",
            machine.DEEPSLEEP_RESET: "woke from deep sleep",
            machine.SOFT_RESET: "software restart",
        }
        print("last restart:", causes.get(machine.reset_cause(), "other"))
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        n = len(wlan.scan())                         # transmits probe requests on every channel
        print("networks found:", n)
      `,
      output: `
        last restart: BROWNOUT: the supply sagged
        networks found: 7
      `,
      notes: ['MicroPython\'s reset_cause groups a brownout with a power-on reset, so it cannot tell them apart: watch the serial boot message ("Brownout detector was triggered") instead.', 'The blocks lines "restart reason" and "scan Wi-Fi networks" are in words because each tool names them differently.']
    }
  ],
  examples: [
    {
      title: 'Diagnose a battery-only boot loop',
      q: 'A Wi-Fi weather node runs fine from USB. On a 3.7 V LiPo it resets every few seconds with "Brownout detector was triggered". The board carries an AMS1117-3.3. What is happening, and what do you change?',
      steps: ['The AMS1117 needs about 4.4 V in to hold 3.3 V. From 3.7 V it gives roughly 2.6 V, and less at the radio burst.', 'The rail is therefore close to the brownout threshold even at idle, and the burst pushes it under.', 'Changing the program cannot help. Replace the regulator by a low-dropout LDO rated 500 mA or more (or a buck-boost), and add a 220 µF low-ESR capacitor at the module.'],
      a: 'The regulator is in dropout on a lithium cell. Use a low-dropout regulator or buck-boost, and add a bulk capacitor.'
    }
  ],
  quiz: [
    { q: 'A board prints "Brownout detector was triggered" and restarts every few seconds, always just after "Connecting to Wi-Fi". What is the most likely cause?', choices: ['A bug in the Wi-Fi library', 'The supply sags during the radio\'s start-up burst', 'The flash is full', 'The antenna is missing'], a: 1, why: 'The pattern, resets at the instant of the first heavy load, is the signature of a supply that cannot follow the burst. A software crash would print a panic and a backtrace instead ([[guru-meditation-and-backtraces]]).' },
    { q: 'A forum suggests disabling the brownout detector in code. What really happens when you do?', choices: ['The supply gets stronger', 'The chip keeps running on a rail below its rating: crashes, drifting readings and possible flash corruption replace the clean resets', 'Nothing changes', 'The radio transmits at higher power'], a: 1, why: 'The detector does not cause the sag, it reports it. Silencing it leaves the chip running outside its specification.' },
    { q: 'A brownout reset during a flash write can corrupt the file system or the saved settings.', a: true, why: 'Writing flash below its rated voltage can store wrong bits, and an interrupted write can leave a half-updated structure. Robust designs also check their data on start-up, but the supply is the first cure.' },
    { q: 'A board resets only on battery, never on a bench supply. What do you try first?', choices: ['Rewrite the Wi-Fi code', 'Check what the battery and regulator can deliver at the peak (cell size, regulator dropout) and add a bulk capacitor', 'Lower the CPU frequency to 80 MHz', 'Replace the chip'], a: 1, why: 'The bench supply is stiff, so the board is fine and the battery path is not. Cell resistance, regulator dropout and missing capacitance are the usual culprits.' }
  ],
  applications: [
    'Boot loops that begin when Wi-Fi, a camera or a display backlight starts, the best-known case being camera boards on weak USB ports.',
    'Battery and solar nodes whose first transmission after a long sleep sags a tired cell.',
    'Marginal USB cables and hubs on a workshop bench.',
    'Production test: a board that browns out only on a long cable fails the supply requirements and is better found early.'
  ],
  sources: [
    'Espressif, ESP-IDF Programming Guide: the brownout-detector configuration and the reset reasons.',
    'Espressif, ESP32 Technical Reference Manual: the sections on reset and on the brownout detector.',
    'Arduino core for ESP32 documentation: the chip-information and reset-reason functions.'
  ],
  sim: { id: 'pw-burst', params: { supply: 'lipo-ams', cap: 1 } }
},

/* ================================================================ USB power */
{
  id: 'usb-power',
  parent: 'powering-the-esp',
  title: 'Power from USB',
  level: 1,
  short: 'Most boards are powered through their USB socket. What a USB port promises, why a C-to-C cable can leave a board dead, how a thin cable steals a quarter of a volt, and why a power bank may turn a sleeping project off.',
  keywords: ['USB power', 'VBUS', '5 V', 'USB-C', 'CC resistors', '5.1 kΩ', 'USB PD', 'power bank', 'cable drop', 'polyfuse', '5V pin', 'VIN', 'charger', '500 mA', 'back-feed'],
  prereq: ['anatomy-of-a-dev-board', 'the-3v3-rail', 'electronics:wire-sizing'],
  related: ['brownout', 'regulators-ldo-and-buck', 'current-peaks-and-capacitors', 'usb-on-the-esp', 'usb-serial-bridges-and-auto-reset', 'usb-power-meters-and-profilers', 'diodes-in-esp-circuits'],
  body: `A development board takes its 5 V from the USB socket, passes it through a protection part and a regulator, and makes 3.3 V. Everything about the power then depends on what is behind the socket and the cable in between.

### What a port promises

| Source | Voltage | Current you can count on |
|---|---|---|
| USB 2.0 port, not yet configured | 5 V | 100 mA |
| USB 2.0 port, configured | 5 V | 500 mA |
| USB 3.x port, configured | 5 V | 900 mA |
| USB-C port, plain | 5 V | 500–900 mA, or 1.5 A or 3 A if it announces so on the CC wires |
| Phone charger | 5 V | 1–3 A, and no data |

In practice most ports give more than they promise and a few trip a limit: a camera or display board with a Wi-Fi burst is close to 500 mA, so use a charger or a good port.

### USB-C and the two resistors

A USB-C source gives no power until it sees a sink. A sink shows itself with a 5.1 kΩ resistor from each of the two CC pins to ground. A board that lacks them powers from an old A-to-C cable (which supplies 5 V by wiring) but stays dead on a C-to-C charger. If a USB-C board is dead on one charger only, check these. USB Power Delivery gives only 5 V until the device asks for more; a board never receives 9 V or 20 V unless a trigger circuit requests it.

### The cable is part of the supply

Cheap cables use thin conductors, often 28 AWG (0.08 mm², about 0.21 Ω per metre). A 1.8 m cable has two power conductors totalling about 0.77 Ω, so 340 mA costs 0.26 V, 500 mA 0.39 V and 1 A 0.77 V. A port at the lowest legal 4.75 V and a cable like that leave about 4.35 V at the board, less than a classic AMS1117 needs ([[regulators-ldo-and-buck]]). Use the formula below, then a short, thick cable.

### The 5 V pin and the diode

On most boards the 5V (or VIN) pin joins the USB 5 V rail, often through a diode. It is an output while USB is connected and an input otherwise. Feeding 5 V in while USB is plugged in can push current back into the computer's port if the board has no diode; check the schematic.

### Power banks switch off

Many power banks stop their output when the load stays below some threshold, often 50–100 mA, for several seconds. A sleeping ESP drawing microamps looks like no load: the bank switches off and the project dies. Choose a bank with a low-current mode, or use a wall charger.

> [!key] USB gives 5 V at 500 mA or more, but the cable and the port set what reaches the board: thin cables lose 0.3–0.8 V, USB-C boards need two 5.1 kΩ resistors, and power banks may cut off a sleeping device. Budget the peak current and use a short, thick cable.`,
  ideas: [
    'A USB 2.0 port promises 500 mA at 5 V once configured, and a USB-C port 1.5 A or 3 A if it announces it.',
    'A USB-C sink needs a 5.1 kΩ resistor on each CC pin, or a C-to-C charger gives it nothing.',
    'A thin cable has about 0.2 Ω per metre per conductor: V = 2 × I × ρ × L ÷ A across the pair.',
    'A power bank may switch off when the load is a few microamps; a sleeping node needs a bank with a low-current mode or a wall charger.'
  ],
  pitfalls: [
    'USB always supplies 500 mA, so the cable does not matter — The port can give it, but the cable\'s resistance takes its share: a thin 1.8 m cable loses about 0.4 V at 500 mA and can push an AMS1117 into dropout.',
    'A USB-C board works with every USB-C charger — Only if it has the two 5.1 kΩ CC resistors. Without them a C-to-C charger supplies nothing.',
    'A power bank is just a big battery, so it will run my sleeping sensor for months — It may cut its output after seconds of microamp load. Test it before relying on it.'
  ],
  terms: [
    { term: 'VBUS', also: ['USB 5 V', 'bus power'], def: 'The 5 V supply wire of a USB connector, from which a bus-powered device takes its power.' },
    { term: 'CC pins', also: ['configuration channel', 'CC1', 'CC2', 'Rd resistors'], def: 'The two signal pins of a USB-C connector that detect the cable orientation and negotiate power. A power-receiving device pulls each to ground through 5.1 kΩ so that the source switches 5 V on.' },
    { term: 'USB Power Delivery', also: ['USB PD', 'PD'], def: 'A protocol over the USB-C CC wire that lets a charger offer higher voltages, such as 9, 15 or 20 V. A device must ask for them; a plain board gets 5 V.' },
    { term: 'Polyfuse', also: ['resettable fuse', 'PTC fuse'], def: 'A part whose resistance rises sharply when too much current flows through it and falls again when it cools. Many boards put one in series with VBUS.' }
  ],
  choose: {
    good: ['Development, where the same cable carries power and programming', 'Fixed installations with a quality 5 V adapter of 1 A or more', 'Any board whose peak current is below what the adapter, cable and port can give'],
    avoid: ['Long, thin cables and unpowered hubs for cameras, displays or motors', 'Power banks as the supply of a deep-sleeping sensor', 'USB-C boards without CC resistors on C-to-C chargers'],
    check: ['The CC resistors on any USB-C-only board', 'Whether the 5V pin can back-feed the computer', 'The rail at the module under load, not the voltage at the adapter']
  },
  examples: [
    {
      title: 'How much does a thin cable lose?',
      q: 'A 1.8 m USB cable has 28 AWG power conductors (0.08 mm²). Copper has a resistivity of 0.0172 Ω·mm²/m. How much voltage is lost at 500 mA, and what arrives from a 4.75 V port?',
      steps: ['One conductor: $R = 0.0172 \\times 1.8 / 0.0804 = 0.385\\ \\Omega$. Two conductors (supply and return): 0.77 Ω.', 'Voltage lost: $0.5 \\times 0.77 = 0.385$ V.', 'At the board: $4.75 - 0.385 = 4.37$ V.'],
      a: 'About 0.39 V is lost and 4.37 V arrives: too little for an AMS1117 at its full load, though a low-dropout regulator copes.'
    }
  ],
  formulas: [
    {
      name: 'Voltage lost in a cable',
      expr: 'Vdrop = 2*I*rho*L/A',
      tex: 'V_{\\mathrm{drop}} = \\frac{2\\, I\\, \\rho\\, L}{A}',
      vars: {
        Vdrop: { name: 'voltage lost in the pair', q: 'voltage', unit: 'mV', tex: 'V_{\\mathrm{drop}}' },
        I: { name: 'current', q: 'current', unit: 'mA', value: 500 },
        rho: { name: 'resistivity of copper', q: 'resistivity', unit: 'Ω·mm²/m', value: 0.0172, tex: '\\rho' },
        L: { name: 'cable length', q: 'length', unit: 'm', value: 1.8 },
        A: { name: 'conductor cross-section', q: 'area', unit: 'mm²', value: 0.0804 }
      },
      note: 'The factor 2 counts the supply and the return conductor. Common sizes: 28 AWG 0.081 mm², 26 AWG 0.13 mm², 24 AWG 0.205 mm². Connector contacts add more.',
      stories: { Vdrop: 'A {L} cable with {A} conductors carries {I}. How much voltage is lost between the plug ends?' }
    }
  ],
  quiz: [
    { q: 'A USB-C ESP32 board runs from an A-to-C cable but is dead on a C-to-C phone charger. What is the most likely cause?', choices: ['The charger is too weak', 'The board lacks the two 5.1 kΩ resistors on the CC pins that tell a C-to-C source to switch 5 V on', 'The cable has no data wires', 'The board needs 12 V'], a: 1, why: 'A USB-C source waits for a sink to announce itself with 5.1 kΩ from each CC pin to ground. An A-to-C cable supplies 5 V by wiring, so it works anyway.' },
    { q: 'A cable\'s two power conductors total 0.8 Ω. The board draws 500 mA. How many volts are lost in the cable?', answer: 0.4, unit: 'V', why: 'V = I × R = 0.5 × 0.8 = 0.4 V, which is 8 % of 5 V and enough to matter to a regulator with a high dropout.' },
    { q: 'A power bank keeps switching off a deep-sleeping sensor. Why?', choices: ['The sensor draws too much current', 'The bank decides nothing is connected when the current stays below its threshold', 'The cable is too long', 'The USB port is damaged'], a: 1, why: 'Many banks, designed to charge phones, switch off when the load falls below a few tens of milliamps for some seconds. Microamps look like an unplugged cable.' },
    { q: 'Feeding 5 V into a board\'s 5V pin while USB is connected can push current back into the computer\'s port if the board has no protection diode.', a: true, why: 'The USB 5 V rail and the 5V pin are the same node on many boards. Two sources on one rail fight, and the stronger one may push current into the weaker. A diode in the USB path prevents it.' }
  ],
  applications: [
    'Powering and programming a development board over one cable.',
    'Choosing the adapter and cable for a wall-powered display or camera.',
    'Debugging resets that appear on one laptop port and not another.',
    'Deciding whether a battery bank can run a sleeping sensor.'
  ],
  sources: [
    'USB 2.0 Specification: bus-powered devices and unit loads (100 mA and 500 mA).',
    'USB Type-C Cable and Connector Specification: the CC pins and the Rd and Rp resistors.',
    'Espressif, DevKit user guides: the power-supply section (the USB 5 V path and the 5V pin).'
  ],
  sim: { id: 'pw-burst', params: { supply: 'usb-thin' } }
},

/* ================================================================ lithium cells */
{
  id: 'lithium-cells',
  parent: 'powering-the-esp',
  title: 'Lithium cells: LiPo, 18650, LiFePO4',
  level: 2,
  short: 'A single lithium cell, 3.0–4.2 V, is the usual battery of an ESP project. How the three common types differ, why peak current and cell size matter for Wi-Fi, what protection must be on the cell, and how to stop discharging before it hurts.',
  keywords: ['LiPo', 'lithium polymer', 'Li-ion', '18650', 'LiFePO4', 'lithium cell', 'battery', '3.7 V', '4.2 V', 'C-rate', 'protection circuit', 'PCM', 'JST polarity', 'cut-off voltage', 'cell capacity'],
  prereq: ['the-3v3-rail', 'regulators-ldo-and-buck', 'electronics:batteries'],
  related: ['battery-chargers', 'measuring-battery-level', 'aa-cells-and-coin-cells', 'power-switching-and-load-sharing', 'battery-life-budget', 'solar-power', 'electronics:energy-storage'],
  body: `One lithium cell, between 3.0 and 4.2 V, is the usual battery of an ESP project: it is rechargeable, small, and its voltage range sits just above the chip's, so one low-dropout regulator turns it into 3.3 V. It is also the only part of this topic that can start a fire.

### Three types

| Cell | Nominal | Full | Empty | What it is |
|---|---|---|---|---|
| LiPo pouch | 3.7 V | 4.2 V | 3.0 V | Flat, from 100 mAh to several Ah; a small JST plug |
| Li-ion 18650 | 3.6 V | 4.2 V | 2.8 V | Cylinder, 18 × 65 mm; real cells hold 2000–3500 mAh |
| LiFePO4 | 3.2 V | 3.6 V | 2.5 V | Different chemistry: flatter, safer, less energy |

For an ESP project a LiPo and a Li-ion cell behave alike. A claim of 9900 mAh on an 18650 is false. LiFePO4 is the odd one out: its 3.6 V limit sits at the chip's ceiling and its curve is flat near 3.2 V, so it can often run the chip without a regulator, with little margin at either end.

### Voltage against the chip

From 4.2 V full down to 3.0 V, a lithium cell sits mostly above the chip's 3.0 V floor, so a low-dropout LDO or a buck-boost can feed it 3.3 V. An LDO with 0.2 V dropout holds the rail until the cell reaches about 3.5 V, leaving roughly the last tenth of the capacity unused ([[regulators-ldo-and-buck]]).

### Size and peak current

A cell's current is quoted in C, the capacity per hour: for 1000 mAh, 1C is 1 A. A 340 mA Wi-Fi burst is 0.34C on a 1000 mAh cell, but 2.3C on a 150 mAh cell, which then sags, heats and ages quickly. For Wi-Fi use 500 mAh or more; tiny cells suit Bluetooth LE and sleeping sensors.

### Protection

A **protection circuit** on the cell, a small chip and two MOSFETs, disconnects it above about 4.3 V, below about 2.5 V and in a short circuit. Protected 18650s carry it under the wrap, which makes them a few millimetres longer; many pouch cells have a small board on the leads. It is a last resort, not a gauge ([[measuring-battery-level]]). Check the polarity of a JST plug before connecting: makers wire the same plug both ways.

> [!warn] A lithium cell stores a great deal of energy. Charge it only with a charger IC that limits at 4.2 V and the current ([[battery-chargers]]), on a cell with a protection circuit; never from a GPIO, a USB port directly or a bare supply. LiFePO4 has a 3.6 V limit and needs its own charger. A cell that swells, is punctured, gets hot or is shorted can catch fire: stop using it and keep it away from anything flammable. Do not charge below 0 °C or above about 45 °C.

### Care

Do not run a cell flat: stop at about 3.3 V, where a few per cent remain, and the cell ages far more slowly. For storage, leave it near 3.8 V. The program below shows a safe cut-off.

> [!key] A lithium cell spans 3.0–4.2 V (LiFePO4 2.5–3.6 V). Choose its capacity by the burst, since 340 mA is 2.3C on a 150 mAh cell, keep a protection circuit on it, charge only with a proper charger, and stop discharging at about 3.3 V.`,
  ideas: [
    'A LiPo or Li-ion cell runs from 4.2 V full to about 3.0 V empty, with a nominal 3.7 V; LiFePO4 runs 3.6 V down to 2.5 V.',
    'C-rate decides whether a cell can feed the burst: 340 mA is 0.34C on 1000 mAh but 2.3C on 150 mAh.',
    'A protection circuit on the cell guards against over-charge, over-discharge and shorts, and does not replace stopping the discharge in software.',
    'Charge only with a charger IC and a protection circuit; LiFePO4 needs a 3.6 V charger, never the 4.2 V kind.'
  ],
  pitfalls: [
    'A battery that reads 3.7 V is half empty — 3.7 V is the nominal figure. A resting cell at 3.7 V holds about 40 % and the curve is flat there ([[measuring-battery-level]]).',
    'The protection circuit will stop my discharge in time — It cuts in near 2.5 V, after the cell has been hurt by a deep discharge. Stop at about 3.3 V in software.',
    'Any JST battery plug fits any LiPo, so it is safe to plug in — The same connector is wired both ways by different makers, and reversed polarity destroys the board and can ignite the cell. Check the red wire against the board\'s marking.'
  ],
  terms: [
    { term: 'LiPo', also: ['lithium polymer', 'lithium-ion polymer'], def: 'A flat pouch-shaped lithium-ion cell with a gel electrolyte, 3.7 V nominal and 4.2 V full. It is the usual battery for small ESP boards, with a JST plug.' },
    { term: '18650', also: ['Li-ion 18650', '21700'], def: 'A cylindrical lithium-ion cell 18 mm across and 65 mm long, 3.6–3.7 V nominal. Real cells hold 2000–3500 mAh. The 21700 is the larger cousin.' },
    { term: 'LiFePO4', also: ['LFP', 'lithium iron phosphate'], def: 'A lithium chemistry with a flat 3.2 V nominal voltage and a 3.6 V charging limit. It is safer and lasts more cycles, but holds less energy than LiPo, and needs its own charger.' },
    { term: 'C-rate', also: ['C rating'], def: 'A current expressed in multiples of the cell\'s capacity per hour: for a 1000 mAh cell, 1C is 1 A and 0.5C is 500 mA. It tells whether a load or a charger is gentle or harsh on the cell.' },
    { term: 'Protection circuit', also: ['PCM', 'BMS', 'protection board'], def: 'A small board on a lithium cell that opens the circuit on over-voltage, under-voltage and over-current. A multi-cell pack needs a battery-management system (BMS) that also balances the cells.' }
  ],
  choose: {
    good: ['A protected LiPo of 500 mAh or more for Wi-Fi sensors with a low-dropout LDO', 'A protected 18650 for projects that need days of Wi-Fi or a few amp-hours', 'A LiFePO4 cell with its own charger where safety and long life outweigh size'],
    avoid: ['Tiny LiPos of 100–200 mAh behind a Wi-Fi radio', 'Unprotected cells in a product, or with unattended charging', 'Cells from unknown makers claiming impossible capacities'],
    check: ['The JST polarity against your board', 'That the cell and charger agree on 4.2 V or 3.6 V', 'The operating and charging temperature range']
  },
  code: [
    {
      title: 'Stop working when the cell is low',
      about: 'Wakes, averages the battery voltage, and works only while the cell is above 3.3 V. Below it, the node halts and re-checks hourly, resuming only when the cell is back above 3.7 V (after recharging): that gap stops a tired cell flapping between the two states.',
      needs: 'An ESP32 DevKit with the cell on a battery input and a divider (two 100 kΩ resistors and 100 nF) into ADC1 pin GPIO35.',
      wiring: [['battery +', '100 kΩ → GPIO35', 'upper resistor'], ['GPIO35', '100 kΩ → GND, and 100 nF → GND'], ['battery −', 'GND']],
      blocks: `
        when started
          set [mv v] to ((analog read pin (35) in millivolts) * (2))
          if <(mv) < (3300)> then
            set [halted v] to <true>
          end
          if <(mv) > (3700)> then
            set [halted v] to <false>
          end
          if <not <halted>> then
            do the real work    // measure and send
          end
          if <halted> then
            deep sleep for (3600) seconds
          else
            deep sleep for (60) seconds
          end
      `,
      cpp: String.raw`
        const int BAT_PIN = 35;                      // ADC1: the cell through 100 k + 100 k
        const uint32_t STOP_MV = 3300;               // below this, stop working
        const uint32_t RESUME_MV = 3700;             // above this again (after charging), resume
        RTC_DATA_ATTR bool halted = false;           // survives deep sleep

        uint32_t batteryMv() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(BAT_PIN);
          return sum / 16 * 2;                       // average of 16 readings, divider undone
        }

        void setup() {
          Serial.begin(115200);
          uint32_t mv = batteryMv();
          if (mv < STOP_MV) halted = true;
          if (mv > RESUME_MV) halted = false;
          Serial.printf("battery %u mV, halted: %d\n", mv, halted);
          if (!halted) {
            // the real work: measure, send
          }
          esp_sleep_enable_timer_wakeup((halted ? 3600ULL : 60ULL) * 1000000ULL);   // an hour when halted
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine
        from machine import ADC, Pin, RTC

        STOP_MV = 3300                               # below this, stop working
        RESUME_MV = 3700                             # above this again (after charging), resume
        adc = ADC(Pin(35), atten=ADC.ATTN_11DB)      # ADC1: the cell through 100 k + 100 k
        rtc = RTC()

        def battery_mv():
            total = 0
            for _ in range(16):
                total += adc.read_uv() // 1000
            return total // 16 * 2                   # average of 16 readings, divider undone

        halted = rtc.memory() == b"1"                # survives deep sleep
        mv = battery_mv()
        if mv < STOP_MV:
            halted = True
        if mv > RESUME_MV:
            halted = False
        rtc.memory(b"1" if halted else b"0")
        print("battery", mv, "mV, halted:", halted)
        if not halted:
            pass                                     # the real work: measure, send
        machine.deepsleep(3600_000 if halted else 60_000)   # an hour when halted
      `,
      output: `
        battery 3842 mV, halted: 0
      `,
      notes: ['The voltage under a Wi-Fi burst is lower than the resting voltage: read it before the radio starts, or the cut-off will trigger early.', 'A real node would also keep the divider off between readings: see [[measuring-battery-level]].']
    }
  ],
  examples: [
    {
      title: 'Can this cell feed the burst?',
      q: 'A 400 mAh LiPo is to power an ESP32-C3 on Wi-Fi, which bursts to 335 mA. What C-rate is the burst, and is it a sensible pairing?',
      steps: ['The C-rate is $335 / 400 = 0.84\\,C$.', 'Most small LiPos are rated for about 1C continuous and a little more for pulses, so this is within rating but not by much, and a cell that is cold or half empty has more resistance and sags further.', 'A 1000 mAh cell would see 0.34C, a far easier life.'],
      a: 'About 0.84C: workable but marginal. Prefer 800–1000 mAh, or add a bulk capacitor to spread the burst.'
    }
  ],
  quiz: [
    { q: 'A 150 mAh LiPo feeds a Wi-Fi board whose bursts reach 340 mA. What is the burst as a C-rate, and why does it matter?', choices: ['0.34C: harmless', '2.3C: more than such a small cell likes, so it sags, heats and ages quickly', '23C: instantly fatal', 'It does not matter because the burst is short'], a: 1, why: '340 mA ÷ 150 mAh = 2.3C. Small cells are built for about 1C; at 2.3C the voltage drops by the cell\'s internal resistance, the cell warms up, and its lifetime shortens.' },
    { q: 'Which charger may you use for a LiFePO4 cell?', choices: ['The 4.2 V lithium-ion charger: it is the same chemistry', 'A charger made for LiFePO4, with a 3.6 V limit', 'A bare 5 V supply', 'A GPIO pin'], a: 1, why: 'LiFePO4 is charged to 3.6 V. A 4.2 V charger would overcharge it badly.' },
    { q: 'A lithium cell may be charged straight from a microcontroller GPIO pin.', a: false, why: 'A pin gives a few milliamps at 3.3 V and has no charge control. A lithium cell needs a charger IC that regulates current and stops at 4.2 V. Never charge one from a pin.' },
    { q: 'About how much of a LiPo\'s capacity is left at a resting 3.7 V?', choices: ['About 10 %', 'About 40 %', 'About 75 %', 'About 95 %'], a: 1, why: 'The discharge curve is flat in the middle: a resting 3.7 V is near 40 %, 3.8 V near 60 %, 4.0 V about 85 %. See the simulation here and on [[measuring-battery-level]].' }
  ],
  applications: [
    'The battery of nearly every portable ESP board with a JST socket, from Adafruit Feathers to LilyGO and DFRobot FireBeetle boards.',
    'Solar-charged outdoor sensors that bank energy by day.',
    'Handheld devices such as displays, trackers and the LoRa nodes of Heltec and LilyGO.',
    'An 18650 holder on boards such as the LilyGO T-Beam, which run for days.'
  ],
  sources: [
    'Datasheets of the cells you use: the cut-off voltage, the maximum continuous discharge current and the charging temperature range.',
    'Datasheets of charger and protection ICs: the 4.2 V charge limit and the protection thresholds.',
    'Hyper Electronics: batteries and energy storage.'
  ],
  sim: 'pw-lipo'
},

/* ================================================================ chargers */
{
  id: 'battery-chargers',
  parent: 'powering-the-esp',
  title: 'Chargers and protection',
  level: 2,
  short: 'A lithium cell is charged at constant current, then at constant voltage, by a charger IC. The TP4056 module explained, the charge-current resistor, why a bare module has no protection, and why charging while running can keep a charger from ever finishing.',
  keywords: ['TP4056', 'charger', 'CC/CV', 'constant current', 'constant voltage', 'charge termination', 'PROG resistor', 'protection', 'DW01', 'MCP73831', 'power path', 'AXP2101', 'TP4057', 'charge current', 'LiFePO4 charger'],
  prereq: ['lithium-cells', 'usb-power', 'electronics:power-supplies'],
  related: ['power-switching-and-load-sharing', 'solar-power', 'measuring-battery-level', 'diodes-in-esp-circuits', 'protection-parts'],
  body: `A lithium cell cannot be charged from a plain voltage source: a flat cell on a fixed 4.2 V would draw amps. The standard method is two stages in one chip.

### Constant current, then constant voltage

First the charger holds a fixed **constant current**, typically 0.5C to 1C, while the cell voltage climbs to 4.2 V. Then it holds **4.2 V** steady, and the current falls by itself as the cell fills. When it has dropped to about a tenth of the first value, the charger stops. Most of the capacity goes in during the first stage; the second takes a long time for the rest. The simulation draws both.

### The TP4056 module

The blue TP4056 board is the commonest charger for small projects. Its chip is a **linear** charger that holds the cell to 4.2 V within about 1.5 % and sets the current with one resistor: the charge current is 1200 divided by R in ohms, so 1.2 kΩ gives 1 A, 2.4 kΩ gives 500 mA and 10 kΩ gives 120 mA. The default of 1 A is too much for a cell below about 1000 mAh; replace the resistor. Because it is linear it dissipates (5 V − cell) × I: at 1 A into a 3.4 V cell that is 1.6 W, so it runs hot and cuts its current when the chip is too warm.

Two versions are sold. One only charges. The other adds a protection chip (a DW01-type monitor and a dual MOSFET) with extra OUT pads: it cuts off an over-discharged cell near 2.4–2.5 V and a short circuit. The charging chip alone does nothing during discharge.

### Other chargers

The MCP73831 is a small charger for up to 500 mA. Many ESP boards carry their own: the catalogue lists a TP4057 limited to 400 mA on DFRobot's Beetle ESP32-C3, an ETA6003 on the FireBeetle 2 ESP32-S3, an AXP192 or AXP2101 power-management chip with programmable current on LilyGO's T-Beam, and chargers fed from the USB-C plug on Adafruit Feathers. A charger made for 4.2 V cells must never charge a LiFePO4 cell, which needs a 3.6 V charger.

### Charging while running

If the ESP runs from the cell while the charger charges it, the charger's termination current includes the load. When the load exceeds a tenth of the charge current the charger never sees the "done" level; the cell sits at 4.2 V for ever and ages. A **power-path** charger feeds the load from the USB and charges the cell separately ([[power-switching-and-load-sharing]]).

> [!warn] Charge a lithium cell only with a charger IC set to its chemistry (4.2 V for LiPo and Li-ion, 3.6 V for LiFePO4), at a current within 1C, on a cell with a protection circuit, between 0 and 45 °C, and not unattended. A swollen, hot or punctured cell burns: unplug it and move it outside onto a non-flammable surface.

> [!key] A lithium charger holds constant current until 4.2 V, then constant voltage until the current falls to about a tenth. Set the TP4056 current with its resistor (1200 ÷ R), remember the module may have no protection, and use a power-path charger if the load runs while charging.`,
  ideas: [
    'Charging is constant current until 4.2 V, then constant voltage until the current falls to about a tenth of it.',
    'The TP4056 sets its current with a resistor: I = 1200 ÷ R, so 1.2 kΩ gives 1 A, too fast for small cells.',
    'A charger does not protect the cell: over-discharge and short-circuit protection need a protection circuit on the cell.',
    'A load connected across the cell while charging can keep a charger from ever terminating; a power-path charger avoids it.'
  ],
  pitfalls: [
    'The TP4056 module protects my cell — Many modules only charge. Only the version with the protection chip and the OUT pads cuts off a short or a deep discharge, and even then only as a last resort.',
    'A charger made for lithium cells works for any lithium chemistry — LiPo and Li-ion end at 4.2 V, LiFePO4 at 3.6 V. The wrong charger over-charges the cell.',
    'The cell is charged when the LED turns green — With a load on the cell it may never turn green; and a cell that sits at 4.2 V for weeks ages faster than one stored near 3.8 V.'
  ],
  terms: [
    { term: 'CC/CV charging', also: ['constant current constant voltage'], def: 'The charging method for lithium cells: constant current until the cell reaches its voltage limit, then constant voltage while the current decays, ending when it falls to about a tenth of the first value.' },
    { term: 'Charge termination', also: ['end of charge', 'termination current'], def: 'The point at which a charger stops charging, usually when the current in the constant-voltage stage has fallen to about 10 % of the constant-current value.' },
    { term: 'Linear charger', also: ['TP4056'], def: 'A charger that drops the surplus input voltage as heat, with a power loss of (Vin − Vcell) × I. It is simple and quiet, and hot at high currents; a switching charger wastes less.' },
    { term: 'Power path', also: ['load sharing', 'power-path charger'], def: 'A circuit that feeds the load from the USB supply whenever it is present, and charges the battery separately, so the load does not disturb the charge and a flat cell does not stop the device from starting.' }
  ],
  choose: {
    good: ['A TP4056 module with protection for single LiPo or Li-ion cells at up to 1 A', 'A small charger such as the MCP73831 on a custom board, with the current set by its resistor', 'A power-management chip or power-path charger when the board runs while charging'],
    avoid: ['A bare charge-only module with an unprotected cell in a product', 'The 1 A default on a small cell', 'The 4.2 V charger on a LiFePO4 cell', 'Charging in the cold or in a closed hot box'],
    check: ['That the charge limit matches the chemistry', 'The charge current against the cell\'s C-rate', 'Whether the charger terminates with the load connected']
  },
  code: [
    {
      title: 'Watch a charge',
      about: 'Logs the cell voltage every 30 seconds as a table you can plot, and says when the voltage has settled near 4.2 V, the sign that the charger has entered its constant-voltage stage. The board runs from USB; only the divider touches the cell.',
      needs: 'An ESP32 DevKit on USB, a cell connected to a TP4056-type charger, and a divider (two 100 kΩ resistors, 100 nF) from the cell into GPIO35.',
      wiring: [['cell +', '100 kΩ → GPIO35', 'across the cell, not across the charger input'], ['GPIO35', '100 kΩ → GND, and 100 nF → GND'], ['cell −', 'GND', 'common with the board']],
      blocks: `
        when started
          start serial at (115200) baud
          set [last v] to (0)
          set [minutes v] to (0)
          print [minutes,mV]
        forever
          set [mv v] to ((analog read pin (35) in millivolts) * (2))
          print (join (minutes) (join [,] (mv)))
          if <<(mv) > (4150)> and <((mv) - (last)) < (5)>> then
            print [constant-voltage stage: nearly full]
          end
          set [last v] to (mv)
          wait (30) seconds
          change [minutes v] by (0.5)
        end
      `,
      cpp: String.raw`
        const int BAT_PIN = 35;                      // ADC1: the cell through 100 k + 100 k
        uint32_t last = 0;
        float minutes = 0;

        uint32_t batteryMv() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(BAT_PIN);
          return sum / 16 * 2;                       // average of 16 readings, divider undone
        }

        void setup() {
          Serial.begin(115200);
          Serial.println("minutes,mV");
        }

        void loop() {
          uint32_t mv = batteryMv();
          Serial.printf("%.1f,%u\n", minutes, mv);
          if (mv > 4150 && (int)mv - (int)last < 5) {
            Serial.println("constant-voltage stage: nearly full");
          }
          last = mv;
          delay(30000);
          minutes += 0.5;
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(35), atten=ADC.ATTN_11DB)      # ADC1: the cell through 100 k + 100 k
        last = 0
        minutes = 0.0

        def battery_mv():
            total = 0
            for _ in range(16):
                total += adc.read_uv() // 1000
            return total // 16 * 2                   # average of 16 readings, divider undone

        print("minutes,mV")
        while True:
            mv = battery_mv()
            print("%.1f,%d" % (minutes, mv))
            if mv > 4150 and mv - last < 5:
                print("constant-voltage stage: nearly full")
            last = mv
            time.sleep(30)
            minutes += 0.5
      `,
      output: `
        minutes,mV
        0.0,3612
        0.5,3985
        1.0,4043
        ...
        92.5,4198
        93.0,4199
        constant-voltage stage: nearly full
      `,
      notes: ['While charging, the reading is above the cell\'s resting voltage by the charge current times its internal resistance, so the curve flatters a half-empty cell.', 'The status outputs of a TP4056 module run through the module\'s LEDs: do not connect them straight to a GPIO without checking their voltage with a meter.']
    }
  ],
  examples: [
    {
      title: 'Set the charge current for a 500 mAh cell',
      q: 'A TP4056 module has the stock 1.2 kΩ programming resistor. Your cell is 500 mAh and you want 0.5C. Which resistor, and how long does a charge take?',
      steps: ['0.5C is 250 mA. $R = 1200 / 0.25 = 4800\\ \\Omega$, so a 4.7 kΩ resistor gives about 255 mA.', 'The constant-current stage fills most of the cell in roughly 2 hours at 0.5C, and the constant-voltage tail adds another hour or so.', 'The stock 1.2 kΩ would charge at 1 A, 2C, which is hard on a 500 mAh cell.'],
      a: 'About 4.7 kΩ. Expect roughly 2.5–3 hours from empty.'
    }
  ],
  formulas: [
    {
      name: 'TP4056 charge current',
      expr: 'I = 1200/R',
      tex: 'I_{\\mathrm{chg}} = \\frac{1200\\ \\mathrm{V}}{R_{\\mathrm{PROG}}}',
      vars: {
        I: { name: 'charge current', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{chg}}' },
        R: { name: 'programming resistor', q: 'resistance', unit: 'kΩ', value: 1.2, tex: 'R_{\\mathrm{PROG}}' }
      },
      note: 'The TP4056 rule: 1200 ÷ R (in ohms) gives amperes. Other charger chips use their own constants; read their datasheet.',
      stories: { I: 'A TP4056 charger has a {R} programming resistor. What charge current does it set?' },
      practice: { unknowns: ['I', 'R'] }
    }
  ],
  quiz: [
    { q: 'In the constant-voltage stage the charge current...', choices: ['stays at its maximum', 'falls as the cell fills, and the charger stops at about a tenth of the first value', 'rises', 'is zero'], a: 1, why: 'The voltage is held at 4.2 V, so as the cell\'s own voltage rises the current through the cell\'s resistance shrinks. Termination is at about a tenth of the programmed value.' },
    { q: 'A TP4056 module with its stock 1.2 kΩ resistor is connected to a 400 mAh LiPo. What is wrong?', choices: ['Nothing', 'It charges at about 1 A, 2.5C, too fast for the cell: fit a larger resistor, about 3 kΩ for 400 mA', 'It will not charge', 'It will charge to 5 V'], a: 1, why: 'The charge current is 1200 ÷ R, so 1.2 kΩ gives 1 A. For 0.5–1C on a 400 mAh cell choose 3–6 kΩ.' },
    { q: 'A TP4056 module without the protection chip protects the cell against deep discharge.', a: false, why: 'The charging chip does nothing during discharge. Only the version with the extra monitor chip and MOSFETs (and OUT pads), or a protection board on the cell, cuts off at low voltage.' },
    { q: 'An ESP runs from the cell while it charges, and the "done" LED never lights. Why?', choices: ['The cell is faulty', 'The charger counts the ESP\'s current as charge current, so it never falls below the termination level', 'The USB cable is too long', 'The chip is too hot'], a: 1, why: 'The charger terminates when the total current into the battery node falls to about a tenth of the charge current. A load of that size or more keeps it above for ever. A power-path charger fixes this.' }
  ],
  applications: [
    'USB-rechargeable sensors and handheld ESP projects.',
    'Solar nodes, where a charger IC with an input voltage window takes the panel\'s energy ([[solar-power]]).',
    'Boards from DFRobot, LilyGO and Adafruit with charging built in.',
    'Replacing the stock resistor on a bargain TP4056 module so that it suits the cell.'
  ],
  sources: [
    'TP4056 datasheet: the constant-current and constant-voltage stages, the PROG resistor formula, the thermal regulation.',
    'Datasheets of the MCP73831, DW01-type protection chips and the AXP2101 power-management chip.',
    'The board makers\' schematics and pages for the boards named above (DFRobot, LilyGO, Adafruit).'
  ],
  sim: 'pw-charge'
},

/* ================================================================ measuring the battery */
{
  id: 'measuring-battery-level',
  parent: 'powering-the-esp',
  title: 'Measuring the battery',
  level: 2,
  short: 'Reading a lithium cell through a divider into an ADC1 pin, without draining it; why the voltage is a good alarm but a poor gauge in the middle of the curve; and the fuel-gauge chips that do better.',
  keywords: ['battery level', 'battery voltage', 'voltage divider', 'ADC1', 'analogReadMilliVolts', 'read_uv', 'state of charge', 'fuel gauge', 'MAX17048', 'LC709203', 'BQ27220', 'coulomb counter', 'percentage', 'discharge curve', 'battery monitor'],
  prereq: ['lithium-cells', 'adc1-adc2-and-wifi', 'voltage-dividers-for-inputs'],
  related: ['the-esp-adc', 'adc-attenuation-and-calibration', 'oversampling-and-noise', 'measuring-voltage', 'battery-life-budget', 'electronics:voltage-divider', 'electronics:adc'],
  body: `A user wants to know how full the battery is. The easy measurement is its voltage, and it works well as an alarm and badly as a gauge.

### The divider

A lithium cell reaches 4.2 V, above what an ADC pin accepts: the catalogue's readable range at the top setting is about 2.5 V on the S2 and C3, 3.1 V on the S3 and about 2.45 V on the original ESP32, and nothing above 3.6 V is safe. Two equal resistors halve the voltage, so 4.2 V becomes 2.1 V, inside every range: Vpin = Vbat × R2 ÷ (R1 + R2). Use an ADC1 pin so that Wi-Fi does not interfere ([[adc1-adc2-and-wifi]]), read **calibrated** millivolts (analogReadMilliVolts, or read_uv in MicroPython) rather than raw counts, and average 16 readings.

### Do not drain the cell with the divider

The divider draws Vbat ÷ (R1 + R2) all the time: 21 µA with 2 × 100 kΩ at 4.2 V. A node that sleeps at 10 µA more than triples its drain. Three remedies: use 1 MΩ resistors (2.1 µA) with a 100 nF capacitor at the pin to feed the converter's sampling; switch the lower leg with a GPIO or a transistor (while it is open the sense node floats up towards the cell voltage through the upper resistor, so keep that resistor large or clamp the node); or take the divider from a board that has it. The catalogue shows Adafruit's Feather ESP32 V2 reading its cell through two 200 kΩ resistors on GPIO35, and an ADC-control pin on Heltec's Wireless Tracker for the switched kind.

### Voltage lies a little

Read the cell at rest, not during a radio burst: a 340 mA burst through 0.2 Ω of internal resistance pulls the reading down by 68 mV, which in the middle of the curve is a sixth of the capacity. Then the curve itself is flat.

| Resting voltage | 4.2 | 4.0 | 3.9 | 3.8 | 3.7 | 3.6 | 3.5 | 3.3 |
|---|---|---|---|---|---|---|---|---|
| Charge left | 100 % | 86 % | 76 % | 62 % | 42 % | 22 % | 12 % | 5 % |

Between 3.7 and 3.9 V, 0.2 V of range holds a third of the capacity, so an ADC error of 30 mV is an error of about 5 % in the answer, and temperature and ageing shift the curve by more. Show four bars, not three digits.

### Fuel gauges

A fuel-gauge chip does better. The MAX17048 estimates charge from a model of the cell and needs no sense resistor; the catalogue lists it on Adafruit's Feather ESP32-C6 and S3 boards, and an LC709203 on the S2 Feathers. Chips such as the BQ27220 (on LilyGO's T-Deck Pro) count charge through a sense resistor and learn the cell's capacity. All speak I2C.

> [!key] Read the cell through a divider into an ADC1 pin, at rest and averaged, with resistors large enough not to drain it. The voltage is a fine alarm (stop at 3.3 V) but only a rough percentage; a fuel-gauge chip is the better gauge.`,
  ideas: [
    'A divider (two 100 kΩ) brings 4.2 V to 2.1 V, inside every ADC range; read it on an ADC1 pin in calibrated millivolts.',
    'The divider draws Vbat ÷ (R1 + R2) for ever: 21 µA with 100 kΩ pairs, so use 1 MΩ with a capacitor, or switch it.',
    'Read the cell at rest: a burst through 0.2 Ω of internal resistance lowers the reading by 68 mV.',
    'The discharge curve is flat from 3.7 to 3.9 V, so voltage gives rough percentages; a fuel-gauge chip such as the MAX17048 does better.'
  ],
  pitfalls: [
    'Direct connection to the ADC pin is fine for a 3.7 V cell — A full cell is 4.2 V, above the pin\'s 3.6 V limit and above its readable range. Always divide.',
    'The percentage from the voltage is accurate to 1 % — A 30 mV ADC error, the sag under load and the temperature shift together make it good to perhaps 10 % in the middle of the curve.',
    'A 100 kΩ divider is high enough to ignore — It draws 21 µA from a full cell, twice what a sleeping ESP32 node uses, and halves the battery life.'
  ],
  terms: [
    { term: 'State of charge', also: ['SoC', 'battery percentage'], def: 'The fraction of a cell\'s capacity that remains, from 100 % full to 0 % empty. It cannot be measured directly; it is estimated from voltage, from counted charge, or from both.' },
    { term: 'Fuel gauge', also: ['battery gauge', 'MAX17048', 'coulomb counter'], def: 'A chip that estimates the state of charge of a cell, from a voltage model (such as the MAX17048) or by integrating the current through a sense resistor, and reports it over I2C.' },
    { term: 'Open-circuit voltage', also: ['OCV', 'resting voltage'], def: 'The voltage of a cell with no load, after it has rested. It follows the state of charge; under load the terminal voltage is lower by the current times the internal resistance.' },
    { term: 'Calibrated reading', also: ['analogReadMilliVolts', 'read_uv'], def: 'An ADC result already converted to millivolts or microvolts with the correction values stored in the chip at the factory, as opposed to a raw count that depends on the unit\'s own error.' }
  ],
  choose: {
    good: ['A divider on an ADC1 pin for a low-battery alarm and a four-level indicator', 'A switched or megaohm divider on a sleeping battery node', 'A fuel-gauge chip when the percentage matters to the user'],
    avoid: ['Reading during a radio burst or a motor start', 'A direct connection to a 4.2 V cell', 'A "remaining hours" claim made from the voltage alone'],
    check: ['The divider current against the sleep budget', 'That the divided voltage stays within the pin\'s range at 4.2 V', 'That the pin is on ADC1 if Wi-Fi is used']
  },
  code: [
    {
      title: 'Battery voltage and a rough percentage',
      about: 'Averages 16 readings, undoes the 1:2 divider and converts the voltage to a percentage by drawing straight lines between points of a typical LiPo curve. The numbers are those of the simulation beside this page.',
      needs: 'An ESP32 DevKit, a LiPo cell on its battery input, two 100 kΩ resistors and a 100 nF capacitor as the divider on GPIO35.',
      wiring: [['battery +', '100 kΩ → GPIO35', 'the upper resistor'], ['GPIO35', '100 kΩ → GND, and 100 nF → GND'], ['battery −', 'GND']],
      blocks: `
        define percent for (v)
          report (percent from the lipo curve at (v))

        when started
          start serial at (115200) baud
        forever
          set [mv v] to ((analog read pin (35) in millivolts) * (2))
          print (join [battery mV: ] (mv))
          print (join [about percent: ] (percent for ((mv) / (1000))))
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int BAT_PIN = 35;                      // ADC1: the cell through 100 k + 100 k
        const int N = 10;
        const float VOLTS[N]   = {3.0, 3.3, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2};
        const float PERCENT[N] = {0, 5, 12, 22, 42, 62, 76, 86, 94, 100};

        uint32_t batteryMv() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(BAT_PIN);
          return sum / 16 * 2;                       // average of 16 readings, divider undone
        }

        int percentFor(float v) {                    // straight lines between the table points
          if (v <= VOLTS[0]) return 0;
          for (int i = 1; i < N; i++) {
            if (v <= VOLTS[i]) {
              float f = (v - VOLTS[i - 1]) / (VOLTS[i] - VOLTS[i - 1]);
              return (int)(PERCENT[i - 1] + f * (PERCENT[i] - PERCENT[i - 1]) + 0.5);
            }
          }
          return 100;
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          uint32_t mv = batteryMv();
          Serial.printf("battery %u mV, about %d %%\n", mv, percentFor(mv / 1000.0));
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(35), atten=ADC.ATTN_11DB)      # ADC1: the cell through 100 k + 100 k
        VOLTS = (3.0, 3.3, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2)
        PERCENT = (0, 5, 12, 22, 42, 62, 76, 86, 94, 100)

        def battery_mv():
            total = 0
            for _ in range(16):
                total += adc.read_uv() // 1000
            return total // 16 * 2                   # average of 16 readings, divider undone

        def percent_for(v):                          # straight lines between the table points
            if v <= VOLTS[0]:
                return 0
            for i in range(1, len(VOLTS)):
                if v <= VOLTS[i]:
                    f = (v - VOLTS[i - 1]) / (VOLTS[i] - VOLTS[i - 1])
                    return round(PERCENT[i - 1] + f * (PERCENT[i] - PERCENT[i - 1]))
            return 100

        while True:
            mv = battery_mv()
            print("battery", mv, "mV, about", percent_for(mv / 1000), "%")
            time.sleep(2)
      `,
      output: `
        battery 3846 mV, about 69 %
        battery 3844 mV, about 69 %
      `,
      notes: ['On an ESP32-S3 use an ADC1 pin from GPIO1–10, on a C3 GPIO0–4.', 'The percentage is for a resting LiPo or Li-ion cell at room temperature. For a LiFePO4 cell the table is different, and nearly flat.', 'The blocks define the lookup in one word, because every tool names it differently.']
    }
  ],
  examples: [
    {
      title: 'Choose the divider',
      q: 'A node sleeps at 8 µA from a 4.2 V cell. How large may the divider current be if it is to add no more than 10 % to the sleep drain, and what total resistance does that need?',
      steps: ['10 % of 8 µA is 0.8 µA.', 'Total resistance $R = 4.2\\ \\text{V} / 0.8\\ \\mu\\text{A} = 5.25\\ \\text{M}\\Omega$.', 'Two 2.2 MΩ resistors (4.4 MΩ, 0.95 µA) are close; with 100 nF at the pin the converter can be read slowly. Or switch the lower leg and use 100 kΩ resistors.'],
      a: 'About 5 MΩ in total: two 2.2 MΩ resistors with a 100 nF capacitor, or a switched 100 kΩ divider.'
    }
  ],
  formulas: [
    {
      name: 'Divider output',
      expr: 'Vpin = Vbat*R2/(R1 + R2)',
      tex: 'V_{\\mathrm{pin}} = V_{\\mathrm{bat}} \\frac{R_2}{R_1 + R_2}',
      vars: {
        Vpin: { name: 'voltage at the ADC pin', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{pin}}' },
        Vbat: { name: 'cell voltage', q: 'voltage', unit: 'V', value: 4.2, tex: 'V_{\\mathrm{bat}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      note: 'Valid while the pin draws no current. A large R1 with a capacitor at the pin keeps the error small.',
      stories: { Vpin: 'A divider of {R1} over {R2} is connected to a {Vbat} cell. What voltage reaches the ADC pin?' },
      practice: { unknowns: ['Vpin', 'Vbat'] }
    },
    {
      name: 'Divider drain',
      expr: 'Idiv = Vbat/(R1 + R2)',
      tex: 'I_{\\mathrm{div}} = \\frac{V_{\\mathrm{bat}}}{R_1 + R_2}',
      vars: {
        Idiv: { name: 'current the divider draws', q: 'current', unit: 'µA', tex: 'I_{\\mathrm{div}}' },
        Vbat: { name: 'cell voltage', q: 'voltage', unit: 'V', value: 4.2, tex: 'V_{\\mathrm{bat}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      note: 'This current flows all the time the divider is connected, including during deep sleep.',
      stories: { Idiv: 'A divider of {R1} and {R2} sits across a {Vbat} cell. How much current does it draw all the time?' }
    }
  ],
  quiz: [
    { q: 'A divider of two equal resistors reads 1.85 V at the ADC pin. What is the cell voltage?', answer: 3.7, unit: 'V', why: 'The divider halves the voltage, so the cell is twice the pin reading: 2 × 1.85 = 3.7 V.' },
    { q: 'Why is voltage a poor gauge of charge around 3.7–3.9 V?', choices: ['The ADC is inaccurate there', 'The curve is flat: 0.2 V holds a third of the capacity, so a small voltage error becomes a large error in charge', 'The cell is unstable', 'Wi-Fi interferes with it'], a: 1, why: 'Between 3.7 and 3.9 V a lithium cell goes from about 42 % to about 76 %. A 30 mV error is therefore an error of about 5 % in the percentage.' },
    { q: 'A 200 kΩ divider across the cell is harmless for a battery sensor that sleeps at 10 µA.', a: false, why: 'It draws about 21 µA from a full cell, twice the sleep current of the node. Use megaohm resistors with a capacitor, or switch the divider off between readings.' },
    { q: 'A cell rests at 3.7 V and has 0.2 Ω of internal resistance. What does an ADC reading show during a 340 mA burst?', answer: 3.63, unit: 'V', why: 'The cell loses I × R = 0.34 × 0.2 = 0.068 V, so the terminal voltage reads about 3.63 V, which looks like a cell about 15 % emptier. Read at rest.' }
  ],
  applications: [
    'The battery icon on portable ESP devices.',
    'Deciding to stop transmitting, or to sleep longer, when the cell is low ([[lithium-cells]]).',
    'Battery sensors that report their own charge to Home Assistant or a dashboard.',
    'Trackers and LoRa nodes whose boards carry a battery-sense pin, such as the Heltec and LilyGO boards in the catalogue.'
  ],
  sources: [
    'Espressif, ESP-IDF Programming Guide: the ADC chapter (attenuation, calibration, the ADC1 and ADC2 limitations).',
    'Arduino core for ESP32 documentation, the ADC API (analogReadMilliVolts); MicroPython documentation, machine.ADC (read_uv).',
    'Datasheets of the MAX17048, LC709203F and BQ27220 fuel-gauge chips.'
  ],
  sim: { id: 'pw-lipo', params: { view: 'adc' } }
},

/* ================================================================ AA cells and coin cells */
{
  id: 'aa-cells-and-coin-cells',
  parent: 'powering-the-esp',
  title: 'AA cells and coin cells',
  level: 1,
  short: 'Two AA cells are too low for an ESP, three need a regulator, and a coin cell cannot give the transmit peak at all. The numbers behind each, and what a boost converter or a large capacitor can and cannot do.',
  keywords: ['AA', 'alkaline', 'NiMH', 'coin cell', 'CR2032', 'CR123A', 'Li-SOCl2', 'ER14505', 'primary cell', 'internal resistance', 'boost converter', 'supercapacitor', 'battery life', 'self-discharge', 'button cell'],
  prereq: ['the-3v3-rail', 'current-peaks-and-capacitors', 'electronics:batteries'],
  related: ['regulators-ldo-and-buck', 'lithium-cells', 'battery-life-budget', 'sleepy-ble-zigbee-thread', 'ble-advertising', 'electronics:supercapacitors'],
  body: `Not every project has a lithium cell. AA cells are everywhere and a coin cell is tiny. All are *primary* cells with a higher internal resistance than a LiPo, so what matters is not the label but what they can deliver at the burst.

### The cells in numbers

| Cell | Fresh to empty | Capacity | What to know |
|---|---|---|---|
| 2 × AA alkaline | 3.2 to 1.8 V | 2500 mAh | Falls below the chip's 3.0 V floor early |
| 3 × AA alkaline | 4.8 to 2.7 V | 2500 mAh | Needs a regulator; uses nearly all the capacity |
| CR2032 coin | 3.2 to 2.0 V | 225 mAh | A few milliamps only |
| CR123A lithium | 3.2 to 2.0 V | 1500 mAh | High pulse current, ten-year shelf life |
| Li-SOCl2 AA (ER14505) | 3.65 to 3.0 V | 2400 mAh | Decade-long sensors; needs a capacitor for radio pulses |

### Two AA cells: too low

Two alkaline cells are 3.0 V nominal and the chip wants 3.0 V at least. With 0.3–1 Ω of internal resistance a 340 mA burst takes another 0.1–0.34 V, and the rail breaks the floor with most of the capacity still inside. A **boost converter** fixes it: it holds 3.3 V while the cells fall to about 1 V each and so recovers the capacity. Alternatives: three cells (or NiMH at 1.2 V each) behind an LDO or buck, or lithium AAs, whose voltage is much flatter.

### The coin cell

A CR2032 is 3 V and 225 mAh with 10–20 Ω of internal resistance that rises as it empties. It can give a few milliamps continuously and perhaps 10–15 mA for a moment. A 340 mA Wi-Fi burst through 15 Ω would need 5 V of drop, so it cannot be fed directly. The remedy is the same capacitor as before: a burst of 340 mA for 2 ms is 0.68 mC, which a 2200 µF capacitor supplies with 0.31 V of droop, and the cell recharges it between bursts through its 15 Ω in about 33 ms. That makes a **Bluetooth LE beacon** possible, with a large low-leakage capacitor, but the chip's 3.0 V floor strands most of the cell: a coin cell soon falls below 3.0 V. Wi-Fi from a coin cell remains a stunt.

### Capacity is not one number

The rated capacity is quoted at a gentle drain: alkaline AAs give about 2500 mAh at 25 mA but markedly less at 500 mA, and the cold takes more. Coin cells are rated at under 1 mA. The simulation shows how much capacity is usable before the chip's floor is crossed.

### Run time

Run time is capacity × usable fraction ÷ average current. Three AAs of 2500 mAh, 80 % usable, at 0.1 mA average run 20 000 hours, over two years, before self-discharge and the regulator's own current ([the battery calculator](#/tools/espcalc/battery)).

> [!warn] A swallowed coin cell can burn the throat of a small child within hours: keep them out of reach. Never recharge alkaline or lithium primary cells, and never mix old and new or different types in one holder.

> [!key] AA and coin cells are weak sources. Two AAs need a boost converter, three need a regulator, and a coin cell needs a big capacitor even for Bluetooth LE. Judge them by voltage and internal resistance at the burst, not by their rated capacity.`,
  ideas: [
    'Two alkaline AA cells (3.0 V nominal) fall below the chip\'s 3.0 V floor early; a boost converter recovers their capacity.',
    'Three AA cells need a regulator but use nearly all their capacity; lithium AAs hold their voltage much flatter.',
    'A CR2032 has 10–20 Ω of internal resistance: a few milliamps continuously, so it cannot feed a 340 mA Wi-Fi burst, only a Bluetooth LE beacon with a large capacitor.',
    'Capacity falls with load and cold: run time = capacity × usable fraction ÷ average current is an upper estimate.'
  ],
  pitfalls: [
    'Two AA cells make 3 V, which is what the ESP needs — The chip needs at least 3.0 V, and a loaded alkaline cell has already fallen below that. Use a boost converter.',
    'A bigger capacitor lets a coin cell run Wi-Fi — It can deliver one burst, but the cell must refill it, and its internal resistance, rising as it empties, limits how often. Treat Wi-Fi on a coin cell as unsuitable.',
    'The capacity on the label is what I will get — It is measured at a low drain. At the burst and in the cold, a primary cell gives noticeably less.'
  ],
  terms: [
    { term: 'Primary cell', also: ['non-rechargeable cell', 'disposable battery'], def: 'A cell that is used once and not recharged: alkaline, lithium coin cells and lithium thionyl chloride cells among them.' },
    { term: 'Internal resistance', also: ['source resistance', 'ESR of a cell'], def: 'The resistance inside a cell. It makes the terminal voltage fall by current × resistance under load, and it limits the pulses a cell can give; it rises as the cell empties and in the cold.' },
    { term: 'Pulse current', also: ['peak current rating'], def: 'The current a cell can give for a short moment, as in a radio burst. It is limited by the internal resistance of the cell, and for small primary cells it is far below the 340 mA of a Wi-Fi burst.' },
    { term: 'Self-discharge', also: ['shelf life'], def: 'The slow loss of a cell\'s charge while it is not used. It is small for alkaline and lithium primaries and large for some rechargeables.' }
  ],
  choose: {
    good: ['3 × AA through an LDO or a buck for Wi-Fi sensors that report rarely', '2 × AA with a boost converter for 3.3 V from a small holder', 'CR2032 with a 470–2200 µF capacitor for an occasional Bluetooth LE beacon, accepting that only the early part of its capacity is usable', 'Li-SOCl2 AA cells with a pulse capacitor for decade-long sensors'],
    avoid: ['Wi-Fi from a CR2032', '2 × AA straight onto the 3V3 pin', 'Mixing old and new cells, or alkaline with lithium, in one holder', 'Recharging non-rechargeable cells'],
    check: ['The pulse current the cell can give, not only its capacity', 'The capacity at your drain and your temperature', 'The converter\'s quiescent current against your sleep budget']
  },
  examples: [
    {
      title: 'Can a coin cell feed a beacon?',
      q: 'A CR2032 (15 Ω internal resistance) feeds a Bluetooth LE beacon that bursts to 15 mA for 3 ms. How large a droop does the cell alone give, and what capacitor holds it to 0.1 V?',
      steps: ['The cell alone drops $15\\ \\text{mA} \\times 15\\ \\Omega = 0.225$ V, tolerable but not roomy.', 'The capacitor holds the burst to 0.1 V: $C = 0.015 \\times 0.003 / 0.1 = 450\\ \\mu\\text{F}$.', 'A 470 µF low-ESR capacitor makes the supply comfortable; at 15 Ω the cell refills it in about $15 \\times 470\\ \\mu\\text{F} \\approx 7$ ms.'],
      a: 'The cell alone gives 0.225 V of droop; a 470 µF capacitor brings it under 0.1 V. The chip\'s 3.0 V floor, not the burst, then limits how much of the cell is usable.'
    }
  ],
  formulas: [
    {
      name: 'Run time from capacity and average current',
      expr: 't = Q*u/I',
      tex: 't = \\frac{Q\\, u}{I}',
      vars: {
        t: { name: 'run time', q: 'time', unit: 'day' },
        Q: { name: 'rated capacity', q: 'charge', unit: 'mA·h', value: 2500 },
        u: { name: 'usable fraction', q: 'ratio', unit: '%', value: 80 },
        I: { name: 'average current', q: 'current', unit: 'mA', value: 0.1 }
      },
      note: 'An upper estimate: it ignores self-discharge, the regulator\'s own current and the loss of capacity at high drain or in the cold. Get the average current from the duty-cycle calculation.',
      stories: { t: 'A device averaging {I} runs from a {Q} battery, of which {u} is usable. How long does it last?' },
      practice: { unknowns: ['t', 'I'] }
    }
  ],
  quiz: [
    { q: 'Why can a CR2032 not power a Wi-Fi ESP32 directly?', choices: ['Its voltage is too low', 'Its 10–20 Ω of internal resistance cannot supply a 300 mA burst without the voltage collapsing', 'It would overheat', 'Coin cells cannot supply 3.3 V'], a: 1, why: 'A burst of 300 mA across 15 Ω would need 4.5 V of drop. The cell\'s voltage collapses and the chip resets.' },
    { q: 'A project averages 0.1 mA from 3 × AA cells (2500 mAh, 80 % usable). About how long does it run, ignoring self-discharge and the regulator?', choices: ['About 2 months', 'About 8 months', 'About 2.3 years', 'About 23 years'], a: 2, why: '2000 mAh ÷ 0.1 mA = 20 000 h, which is 833 days, about 2.3 years.' },
    { q: 'Two alkaline AA cells in series run an ESP32 directly until they are empty.', a: false, why: 'The chip needs 3.0 V; loaded alkaline cells are below that long before they are empty. A boost converter keeps 3.3 V down to about 1 V per cell.' },
    { q: 'What makes a boost converter attractive for two AA cells?', choices: ['It increases the capacity', 'It holds the rail at 3.3 V while the cells fall to about 1 V each, using nearly all their energy', 'It removes the need for capacitors', 'It makes no noise'], a: 1, why: 'Without it the chip stops when the cells fall to 3.0 V in total, wasting most of the capacity. A boost converter has its own losses and noise, but keeps the chip alive.' }
  ],
  applications: [
    'Coin-cell Bluetooth LE tags, usually built on chips that run lower than the ESP\'s 3.0 V.',
    'Years-long sensors on lithium thionyl chloride AA cells with a pulse capacitor.',
    'Wi-Fi door and window sensors on three AA cells.',
    'Wearables and tags that advertise on Bluetooth LE a few times a second.'
  ],
  sources: [
    'Cell datasheets (alkaline AA, CR2032, CR123A, ER14505): capacity against load, internal resistance and pulse ratings.',
    'Hyper Electronics: batteries and supercapacitors.',
    'Espressif, ESP32-C3 and ESP32-H2 datasheets: current-consumption figures for Bluetooth LE.'
  ],
  sim: 'pw-cells'
},

/* ================================================================ solar */
{
  id: 'solar-power',
  parent: 'powering-the-esp',
  title: 'Solar power',
  level: 2,
  short: 'A small panel and a lithium cell can run a sleeping sensor for ever, and cannot run an always-on Wi-Fi board at all. How to size the panel, the charger that must sit between them, and what winter does.',
  keywords: ['solar', 'panel', 'peak sun hours', 'MPPT', 'CN3791', 'BQ25570', 'energy harvesting', 'solar charger', 'outdoor sensor', 'off-grid', 'days of autonomy', 'blocking diode', 'solar port', 'sizing'],
  prereq: ['lithium-cells', 'battery-chargers', 'electronics:solar-cells'],
  related: ['measuring-battery-level', 'battery-life-budget', 'deep-sleep', 'project-lora-field-sensor', 'power-switching-and-load-sharing', 'enclosures'],
  body: `A small solar panel and a lithium cell can run a sleeping sensor for years. The same panel cannot run a Wi-Fi board that never sleeps. The difference is arithmetic.

### The chain

Panel, then a charger designed for panels, then the cell, then the regulator, then the ESP. A panel is not a battery: its current follows the light, and its voltage climbs towards its open-circuit value (a "6 V" panel reaches 7 V or more) when little is drawn. Never connect one straight to a lithium cell ([[battery-chargers]]).

### Energy in, energy out

A panel's energy per day is its rated power × the day's **peak sun hours** × the efficiency of the charge path. Peak sun hours measure the day's light as hours of full sun (1000 W/m²): under 1 on a dark winter day at high latitude, 5 or 6 on a clear summer day. A 1 W panel at 3 peak sun hours and 70 % efficiency delivers 2.1 Wh a day, about 570 mAh at 3.7 V.

Compare with the load. A node that wakes every 10 minutes for 5 s at 80 mA averages 0.7 mA: 17 mAh a day, thirty times less than the panel gives. An always-on Wi-Fi board at 100 mA uses 2400 mAh a day, four times the panel's best, and needs a 4 W panel and a large cell. So: sleep, and spend the energy on the rare transmission.

The cell must bridge the nights and the bad weeks: days of autonomy = capacity × usable fraction ÷ daily use. Plan for three to seven days, more far from the equator.

### The charger matters

A panel that gives 1 W in full sun gives 0.1 W under cloud, and a charger that insists on its full current drags the panel's voltage to the floor and collects nothing. A charger meant for panels holds the input near the panel's best operating point: MPPT-style lithium chargers such as the CN3791, and energy-harvesting chips such as the BQ25570 for tiny panels. A TP4056 module on a panel works poorly for this reason. The catalogue shows boards with a solar input: DFRobot's FireBeetle 2 ESP32-C6 (a CN3165 charger), Heltec's WiFi LoRa 32 V4 and Wireless Tracker V2, LilyGO's T-SIM7000G (a CN3065).

### Cold, heat and dark

A lithium cell must not be charged below 0 °C: choose a charger with a temperature input or one that stops by itself. An enclosure in full sun climbs past 45 °C, which ages a cell. At night the panel must not leak current back: the charger IC or a Schottky diode blocks it. Tilt to the sun, keep it clear of shade, snow and dust: a quarter of a panel in shade can cut its output by far more than a quarter.

> [!warn] Panels feed lithium cells: use a charger IC for panels with temperature protection and a cell with a protection circuit, never a direct connection. See [[lithium-cells]].

> [!key] A panel's daily energy is power × peak sun hours × about 0.7. A sleeping node needs far less than a small panel gives; an always-on Wi-Fi board needs far more. Use a charger made for panels, size the cell for several dark days, and keep it warm enough to charge.`,
  ideas: [
    'Daily energy = panel power × peak sun hours × about 0.7 charge-path efficiency: 2.1 Wh for a 1 W panel at 3 hours.',
    'Duty-cycled sensors average well under 1 mA; always-on Wi-Fi at 100 mA needs a large panel and cell.',
    'A charger designed for panels holds the input near its best power point; a plain linear charger collapses the panel voltage.',
    'The cell must bridge dark days, and a lithium cell must not be charged below 0 °C.'
  ],
  pitfalls: [
    'A 5 V panel can charge a LiPo directly — It can overcharge the cell and, in the cold or in strong sun, ruin it. A charger IC with a 4.2 V limit and temperature protection must sit between them.',
    'A 6 W panel in the catalogue gives 6 W — That is the peak under full sun at the optimum angle. Over a day, a panel in clear summer delivers its rated power times three to five hours, and in winter a fraction of one.',
    'A bigger battery fixes any shortfall — It bridges a dark week, not a deficit that repeats every day. The panel must exceed the daily consumption.'
  ],
  terms: [
    { term: 'Peak sun hours', also: ['PSH', 'insolation'], def: 'A day\'s solar energy on a surface, expressed as the number of hours of full sun (1000 W/m²) that would deliver the same energy. About 1 on a dark winter day at high latitude, 5–6 on a clear summer day.' },
    { term: 'MPPT', also: ['maximum power point tracking'], def: 'A charging method that adjusts what it draws from a panel so that the panel works at its maximum-power voltage, instead of collapsing under a load that is too big for the light.' },
    { term: 'Blocking diode', also: ['reverse-current diode'], def: 'A diode in series with a panel that stops current flowing back into it at night or in shade. Many solar charger ICs include the function, so a separate diode is not needed.' },
    { term: 'Days of autonomy', also: ['autonomy'], def: 'How many days a battery can run the device with no input at all: capacity × usable fraction ÷ daily consumption.' }
  ],
  choose: {
    good: ['A sleeping sensor with a small panel, an MPPT-style charger and a 1000–3000 mAh cell', 'A LoRa or BLE node that transmits rarely, on a board with a solar input', 'A panel sized for twice the daily need in the worst month'],
    avoid: ['Always-on Wi-Fi on a small panel', 'Connecting a panel straight to a cell', 'A panel in permanent partial shade', 'A box that heats above 45 °C or charges below 0 °C unprotected'],
    check: ['The worst month\'s peak sun hours at your latitude', 'The panel\'s open-circuit voltage against the charger\'s input range', 'The charger\'s temperature protection']
  },
  code: [
    {
      title: 'Report as often as the cell can afford',
      about: 'Reads the battery voltage on every wake and chooses the sleep time from it: often when the cell is full, rarely when it is low. A solar node that does this survives a dark week by slowing down instead of dying.',
      needs: 'An ESP32 DevKit, a lithium cell with its charger and panel, and a divider (two 100 kΩ resistors, 100 nF) on GPIO35.',
      wiring: [['cell +', '100 kΩ → GPIO35', 'upper resistor'], ['GPIO35', '100 kΩ → GND, and 100 nF → GND'], ['cell −', 'GND']],
      blocks: `
        when started
          set [mv v] to ((analog read pin (35) in millivolts) * (2))
          if <(mv) > (4000)> then
            set [seconds v] to (300)
          else if <(mv) > (3700)> then
            set [seconds v] to (900)
          else if <(mv) > (3400)> then
            set [seconds v] to (3600)
          else
            set [seconds v] to (14400)
          end
          do the real work    // measure and send
          deep sleep for (seconds) seconds
      `,
      cpp: String.raw`
        const int BAT_PIN = 35;                      // ADC1: the cell through 100 k + 100 k

        uint32_t batteryMv() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(BAT_PIN);
          return sum / 16 * 2;                       // average of 16 readings, divider undone
        }

        uint32_t secondsFor(uint32_t mv) {           // seconds between reports
          if (mv > 4000) return 300;                 // plenty: every 5 minutes
          if (mv > 3700) return 900;                 // fine: every 15 minutes
          if (mv > 3400) return 3600;                // saving: every hour
          return 14400;                              // nearly flat: every 4 hours
        }

        void setup() {
          Serial.begin(115200);
          uint32_t mv = batteryMv();
          uint32_t secs = secondsFor(mv);
          Serial.printf("battery %u mV, next report in %u s\n", mv, secs);
          // the real work: measure, send
          esp_sleep_enable_timer_wakeup((uint64_t)secs * 1000000ULL);
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine
        from machine import ADC, Pin

        adc = ADC(Pin(35), atten=ADC.ATTN_11DB)      # ADC1: the cell through 100 k + 100 k

        def battery_mv():
            total = 0
            for _ in range(16):
                total += adc.read_uv() // 1000
            return total // 16 * 2                   # average of 16 readings, divider undone

        def seconds_for(mv):                         # seconds between reports
            if mv > 4000:
                return 300                           # plenty: every 5 minutes
            if mv > 3700:
                return 900                           # fine: every 15 minutes
            if mv > 3400:
                return 3600                          # saving: every hour
            return 14400                             # nearly flat: every 4 hours

        mv = battery_mv()
        secs = seconds_for(mv)
        print("battery", mv, "mV, next report in", secs, "s")
        # the real work: measure, send
        machine.deepsleep(secs * 1000)
      `,
      output: `
        battery 3912 mV, next report in 900 s
      `,
      notes: ['Read the voltage at the start, before the radio switches on, so that the burst does not make the cell look emptier.', 'Add some hysteresis in a real node, so that a cell near a threshold does not change its rhythm on every wake.']
    }
  ],
  examples: [
    {
      title: 'Will a 1 W panel keep this node alive in December?',
      q: 'A node averages 1 mA (24 mAh a day). Your site gets 1 peak sun hour in December. A 1 W panel with a 70 % charge path feeds a 3.7 V cell. Is it enough?',
      steps: ['Energy per day: $1\\ \\text{W} \\times 1\\ \\text{h} \\times 0.7 = 0.7$ Wh.', 'In charge: $0.7\\ \\text{Wh} / 3.7\\ \\text{V} = 189$ mAh a day.', 'The node uses 24 mAh a day, so the panel gives nearly eight times what it needs, even in December.'],
      a: 'Yes, with a large margin. The same panel would fall short, by a factor of ten, for a Wi-Fi board drawing 100 mA all day.'
    }
  ],
  formulas: [
    {
      name: 'Energy from a panel in a day',
      expr: 'E = P*H*eta',
      tex: 'E = P\\, H\\, \\eta',
      vars: {
        E: { name: 'energy into the cell per day', q: 'energy', unit: 'Wh' },
        P: { name: 'rated panel power', q: 'power', unit: 'W', value: 1 },
        H: { name: 'peak sun hours in the day', q: 'time', unit: 'h', value: 3 },
        eta: { name: 'charge-path efficiency', q: 'ratio', unit: '%', value: 70, tex: '\\eta' }
      },
      note: 'Peak sun hours are hours of full sun (1000 W/m²) equal to the day\'s light. Clouds, shade, tilt and temperature are all inside H and η.',
      stories: { E: 'A {P} panel receives {H} of peak sun and the charge path is {eta} efficient. How much energy reaches the cell in a day?' },
      practice: { unknowns: ['E', 'P'] }
    }
  ],
  quiz: [
    { q: 'A 1 W panel under 3 peak sun hours with a 70 % charge path puts how much energy into the cell per day?', answer: 2.1, unit: 'Wh', why: '1 W × 3 h × 0.7 = 2.1 Wh, about 570 mAh at 3.7 V.' },
    { q: 'Why does a TP4056 module work poorly with a small panel?', choices: ['It cannot charge above 1 A', 'It insists on its full current, so a weak panel\'s voltage collapses and little energy is collected', 'It needs 12 V', 'It has no temperature input'], a: 1, why: 'A panel under cloud gives a fraction of its current. A charger that demands more drags the panel voltage down to the floor. An MPPT-style charger backs off to keep the panel at its best point.' },
    { q: 'A small 6 V panel can be wired directly to a LiPo cell, provided the panel is small.', a: false, why: 'A panel has no regulation: its voltage rises above 4.2 V when the cell is full, and in strong sun the cell is overcharged. Always put a charger IC with a 4.2 V limit between them.' },
    { q: 'An ESP32 with Wi-Fi always on draws about 100 mA. Can a 1 W panel keep it running?', choices: ['Yes, in sunshine', 'No: a day\'s 2400 mAh is several times what a 1 W panel supplies (about 570 mAh at 3 peak sun hours)', 'Yes, with a bigger battery', 'Only in winter'], a: 1, why: 'A bigger battery bridges bad weather but cannot make up a daily deficit. The panel itself must supply more than the daily consumption.' }
  ],
  applications: [
    'Garden, weather and soil sensors that report every few minutes.',
    'LoRa and Meshtastic nodes on roofs and poles, on boards with a solar port.',
    'Outdoor cameras and trackers with a sleeping controller and a large cell.',
    'Water-tank and gate monitors far from any socket.'
  ],
  sources: [
    'Datasheets of the CN3791 and BQ25570 solar and harvesting charger ICs: the input range and the maximum-power-point setting.',
    'Hyper Electronics: solar cells.',
    'Board user guides for the FireBeetle 2 ESP32-C6, WiFi LoRa 32 V4 and Wireless Tracker V2: the solar input.'
  ],
  sim: 'pw-solar'
},

/* ================================================================ power paths and switching */
{
  id: 'power-switching-and-load-sharing',
  parent: 'powering-the-esp',
  title: 'Power paths and switching loads off',
  level: 3,
  short: 'A sleeping ESP can draw 10 µA while the sensor beside it draws milliamps. How to switch a part off with a pin, a MOSFET or a load switch, and how to join USB and a battery without wasting voltage or confusing the charger.',
  keywords: ['load switch', 'high-side switch', 'low-side switch', 'P-channel MOSFET', 'power path', 'ideal diode', 'OR-ing', 'Schottky', 'inrush current', 'switched supply', 'sensor power', 'reverse polarity', 'deep sleep hold', 'Vext'],
  prereq: ['battery-chargers', 'mosfets-for-loads', 'pin-current-limits'],
  related: ['lithium-cells', 'usb-power', 'deep-sleep', 'the-board-is-not-the-chip', 'diodes-in-esp-circuits', 'transistor-as-a-switch', 'electronics:mosfet-switch'],
  body: `A sleeping ESP can draw 10 µA, and the sensor beside it may draw milliamps all the time. The cure is to switch the part off. A second, related question is how to join two sources, USB and a battery, on one board.

### Switching a load off

- **From a pin.** A GPIO can supply a few milliamps ([[pin-current-limits]] gives the figure for your chip): enough for a thermistor divider, a soil probe or a small sensor. Set the pin high, wait for the part to settle, read, set it low. The program below does it.
- **Low-side switch.** An N-channel MOSFET between the load and ground, driven directly by a 3.3 V pin if it is a logic-level type ([[mosfets-for-loads]]). Easy, but when off, the load's ground floats. A sensor with signal wires to the ESP is then powered through those wires and their protection diodes, and half wakes up.
- **High-side switch.** A P-channel MOSFET or a load-switch IC between the supply and the load; ground stays solid. A P-FET on a 3.3 V supply is switched off by a 3.3 V pin; on a higher supply (5 V, a cell) the pin cannot reach the gate level and a small NPN or N-FET inverts the drive. A **load switch** IC does the level shifting, limits the **inrush** and costs little.
- **Inrush.** Switching on a rail with 100 µF of capacitance draws a surge: 3.7 V into 0.5 Ω is 7 A for 50 µs, a brownout in the making. A load switch with a 1 ms ramp holds it to about C × dV/dt = 100 µF × 3300 V/s = 0.33 A.
- **Off must mean off in sleep.** A pin that was high when the chip entered deep sleep may float or fall, so the load switches on. Fit a pull-down (100 kΩ) on an N-FET gate, a pull-up on a P-FET gate, and hold the pin through sleep ([[deep-sleep]]).

Boards do this for you: the catalogue shows Adafruit's Feather ESP32 V2 switching its NeoPixel and STEMMA QT power with GPIO2, and Heltec's Wireless Tracker with a Vext control pin.

### Two sources: USB and a battery

The simplest way to join them is two diodes, "OR-ing": the higher voltage feeds the load, and each diode stops current flowing back into the other source. A Schottky diode drops 0.2–0.4 V at a few hundred milliamps, which is a tenth of a cell's range and wastes energy. An **ideal diode**, a P-FET with a little control, drops tens of millivolts. The same P-FET in series gives **reverse-polarity protection**.

A **power-path** charger goes further: the load runs from USB when it is present, the cell charges separately, and when USB leaves, the cell takes over seamlessly. A flat cell cannot hold the board in reset, and the charger's termination is not confused by the load ([[battery-chargers]]).

Never join the 5 V of USB and a cell directly, and never let the cell feed back into a USB port.

> [!key] Switch a part off with a pin for a few milliamps, otherwise with a high-side MOSFET or a load switch (low-side switching floats the ground), and make sure it stays off in deep sleep. Join USB and a battery through ideal diodes or a power-path charger, not a bare diode that wastes 0.3 V.`,
  ideas: [
    'A GPIO can power a small sensor for a few milliamps; larger or signal-connected parts need a MOSFET.',
    'Switch the high side for sensors with signal wires: switching the ground leaves it floating and powered through its signal pins.',
    'A pin may float in deep sleep, so give the gate a pull resistor and hold the pin, or the load turns on.',
    'USB-plus-battery needs ideal diodes or a power-path charger; a Schottky diode wastes 0.2–0.4 V.'
  ],
  pitfalls: [
    'Switching the ground of an I2C sensor is as good as switching its supply — The sensor\'s ground floats and it is powered through the I2C lines, so it neither turns fully off nor behaves. Switch the supply side.',
    'A pin I set low before sleeping will stay low — In deep sleep a digital pin may release, and a gate that floats can turn the load on. Add a pull resistor and hold the pin.',
    'A Schottky diode costs nothing in a battery project — It drops 0.2–0.4 V, which on a cell is the last tenth of its range, and its loss runs all the time.'
  ],
  terms: [
    { term: 'High-side switch', also: ['P-channel switch'], def: 'A switch placed in the supply line, between the source and the load, so that the load keeps its ground connection. Usually a P-channel MOSFET or a load-switch IC.' },
    { term: 'Low-side switch', also: ['N-channel switch'], def: 'A switch placed in the ground line of the load, usually an N-channel MOSFET. It is simple to drive, but the load\'s ground floats when it is off.' },
    { term: 'Load switch', also: ['power switch IC'], def: 'A small chip that switches a supply rail on and off from a logic signal, with a controlled turn-on ramp, low leakage and often an overcurrent limit.' },
    { term: 'Ideal diode', also: ['active OR-ing'], def: 'A MOSFET driven so that it behaves like a diode with a drop of tens of millivolts instead of a Schottky diode\'s 0.2–0.4 V. It joins two supplies without wasting voltage.' },
    { term: 'Inrush current', also: ['switch-on surge'], def: 'The surge a rail draws when it is first connected, while its capacitors charge. Small cells and thin wires sag under it unless a load switch limits the ramp.' }
  ],
  choose: {
    good: ['A GPIO directly for a few-milliamp analogue sensor', 'A P-FET or load switch on the supply of I2C and SPI sensors', 'An N-FET low-side switch for loads with no signal wires, such as a lone LED strip or buzzer', 'A power-path charger or ideal diode where USB and a cell share a board'],
    avoid: ['Driving more than the pin\'s limit from a GPIO', 'Switching the ground of a part with signal wires', 'Gates left floating through deep sleep', 'A Schottky OR-ing diode in a cell-powered node where headroom matters'],
    check: ['The pin\'s state in deep sleep, with a pull resistor and a hold', 'Inrush into the switched capacitance', 'The switch\'s own leakage against your sleep budget']
  },
  code: [
    {
      title: 'Power a sensor only while reading it',
      about: 'A GPIO is the sensor\'s supply. The program switches it on, lets the sensor settle, averages eight readings, and switches it off again, so the sensor costs nothing between readings. Suited to an analogue sensor of a few milliamps, such as a soil probe or a thermistor divider.',
      needs: 'An ESP32 DevKit and an analogue sensor drawing under 10 mA (check the sensor, and the pin limits of your chip).',
      wiring: [['GPIO27', 'sensor VCC', 'the switched supply'], ['GPIO34', 'sensor output', 'ADC1, input only'], ['GND', 'sensor GND']],
      blocks: `
        define read sensor
          set pin (27) to [HIGH v]
          wait (0.03) seconds
          set [mv v] to (analog read pin (34) in millivolts)
          set pin (27) to [LOW v]

        when started
          start serial at (115200) baud
          set pin (27) as [output v]
          set pin (27) to [LOW v]
        forever
          read sensor :: my
          print (join [sensor in mV: ] (mv))
          wait (10) seconds
        end
      `,
      cpp: String.raw`
        const int SENSOR_POWER = 27;                 // GPIO27 -> sensor VCC (a few mA at most)
        const int SENSOR_PIN = 34;                   // ADC1: the sensor's output

        int readSensorMv() {
          digitalWrite(SENSOR_POWER, HIGH);          // power the sensor
          delay(30);                                 // let it settle; slow sensors need longer
          uint32_t sum = 0;
          for (int i = 0; i < 8; i++) sum += analogReadMilliVolts(SENSOR_PIN);
          digitalWrite(SENSOR_POWER, LOW);           // and off again
          return sum / 8;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(SENSOR_POWER, OUTPUT);
          digitalWrite(SENSOR_POWER, LOW);
        }

        void loop() {
          Serial.printf("sensor: %d mV\n", readSensorMv());
          delay(10000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        power = Pin(27, Pin.OUT, value=0)            # GPIO27 -> sensor VCC (a few mA at most)
        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)      # ADC1: the sensor's output

        def read_sensor_mv():
            power.value(1)                           # power the sensor
            time.sleep_ms(30)                        # let it settle; slow sensors need longer
            total = 0
            for _ in range(8):
                total += adc.read_uv() // 1000
            power.value(0)                           # and off again
            return total // 8

        while True:
            print("sensor:", read_sensor_mv(), "mV")
            time.sleep(10)
      `,
      output: `
        sensor: 1624 mV
        sensor: 1631 mV
      `,
      notes: ['Before deep sleep, hold the pin low (gpio_hold_en in the Arduino core, hold=True in MicroPython) or fit a 100 kΩ pull-down, or the sensor may power up while the chip sleeps.', 'A sensor that draws more than the pin allows, or has an I2C bus, belongs behind a high-side MOSFET or a load switch driven by the same pin.']
    }
  ],
  examples: [
    {
      title: 'How big is the switch-on surge?',
      q: 'A sensor board with 100 µF of capacitance is switched on from a 3.7 V cell by a switch of 0.5 Ω. What is the surge, and how long a ramp keeps it under 0.2 A?',
      steps: ['Surge: $I = V/R = 3.7 / 0.5 = 7.4$ A, decaying with a time constant of $RC = 0.5 \\times 100\\ \\mu\\text{F} = 50\\ \\mu\\text{s}$.', 'A ramp of duration $T$ gives an average $I = C\\,\\Delta V / T$. For 0.2 A with $\\Delta V = 3.3$ V: $T = 100\\ \\mu\\text{F} \\times 3.3 / 0.2 = 1.65$ ms.', 'A load switch with a ramp of 2 ms or longer holds the surge under 0.2 A.'],
      a: 'A 7.4 A surge for tens of microseconds; a ramp of about 1.7 ms or more keeps it under 0.2 A.'
    }
  ],
  quiz: [
    { q: 'Why switch the supply of an I2C sensor, not its ground?', choices: ['It is cheaper', 'With the ground switched off the sensor\'s ground floats and its signal pins can power it through their protection diodes', 'It is faster', 'It needs no transistor'], a: 1, why: 'A part with signal wires to the ESP finds another supply path through them when its ground is cut. A high-side switch removes the supply and leaves the ground, and the signals, consistent.' },
    { q: 'A switched sensor is powered from a GPIO set low before deep sleep, but it sometimes comes on during sleep. The likeliest reason and cure?', choices: ['The pin floats during deep sleep unless held; hold the pin and add a pull-down', 'The sensor is faulty', 'Deep sleep sets every pin high', 'The ADC pulls it up'], a: 0, why: 'In deep sleep the digital pads may release their state. A pull-down resistor, or a hold function, keeps the switched supply off.' },
    { q: 'A Schottky OR-ing diode between a cell and the board typically costs 0.2–0.4 V at a few hundred milliamps.', a: true, why: 'That is a large part of the cell\'s usable range and a loss that runs all the time. An ideal diode (a P-FET with a little control) reduces it to tens of millivolts.' },
    { q: 'What does a power-path charger do that a plain charger cannot?', choices: ['It charges faster', 'It feeds the load from USB and charges the cell separately, so termination works and a flat cell does not block start-up', 'It raises the voltage', 'It protects against short circuits'], a: 1, why: 'The load no longer sits across the cell, so the charge current is measured honestly, and the board runs from USB even with an empty cell.' }
  ],
  applications: [
    'Soil-moisture probes and thermistor dividers powered only while measured.',
    'Battery projects that switch off displays, GNSS modules and sensor boards between uses.',
    'Boards that accept both USB and a cell, such as the Feather and FireBeetle families.',
    'Boards with a switched external supply, like the Vext pin of Heltec\'s trackers.'
  ],
  sources: [
    'Datasheets of load-switch ICs and logic-level MOSFETs: on-resistance, gate threshold, turn-on slew rate and leakage.',
    'Espressif, ESP-IDF Programming Guide: GPIO and the hold function in deep sleep.',
    'Hyper Electronics: the MOSFET as a switch.'
  ]
},

/* ================================================================ measuring current */
{
  id: 'measuring-current',
  parent: 'powering-the-esp',
  title: 'Measuring what it really draws',
  level: 2,
  short: 'The datasheet gives the chip; the board draws what it draws. A series multimeter, a shunt with an oscilloscope, a purpose-made profiler and a home-made INA219 logger each see something different, and each has a burden that can break what it measures.',
  keywords: ['measure current', 'multimeter', 'burden voltage', 'shunt resistor', 'oscilloscope', 'Power Profiler Kit', 'PPK2', 'Joulescope', 'uCurrent', 'INA219', 'current profile', 'sleep current', 'average current', 'current logger'],
  prereq: ['the-3v3-rail', 'current-peaks-and-capacitors', 'electronics:multimeter'],
  related: ['the-multimeter', 'the-oscilloscope', 'usb-power-meters-and-profilers', 'measuring-current-with-shunts', 'esp-as-a-power-meter', 'the-board-is-not-the-chip', 'battery-life-budget', 'electronics:meter-loading'],
  body: `The datasheet gives the current of the chip. Your board draws what it draws: the regulator, the USB chip, an LED and every part wired to the rail are in the figure, and it changes by a factor of tens of thousands between sleeping and transmitting ([[the-board-is-not-the-chip]]). Only measurement tells you, and each method sees something different.

### A multimeter in series

Break the supply wire and put the meter, on its mA or µA range, in the gap. Two things go wrong. The first is **burden voltage**: the meter is a small resistor, and V = I × R across it comes off your rail. A milliamp range commonly has a fraction of an ohm to a few ohms (check the manual): at 340 mA and 1 Ω, 0.34 V disappears and the chip browns out. The microamp range is far worse, so many sleep-current measurements fail the instant the chip wakes. The second is **averaging**: the display updates two or three times a second. A 2 ms burst at 340 mA every 100 ms averages 6.8 mA; the meter shows a calm number that hides the burst entirely. Use it for the steady sleep current, with a button to bypass the meter during start-up.

### A shunt and an oscilloscope

Put a small resistor in the supply line and look across it with a scope: V = I × R. A 0.1 Ω shunt gives 1 mV per 10 mA: a 340 mA burst is a 34 mV pulse, with a burden of only 34 mV. Now you see the shape, the duration and the repeat rate ([[the-oscilloscope]]). Use the smallest resistor whose signal you can read, and put the shunt where the scope's ground clip does no harm.

### A profiler

Instruments made for this job, such as Nordic's Power Profiler Kit II, the Joulescope and the µCurrent adapter, switch ranges automatically or keep the burden tiny, and record. The first two sample on the order of a hundred thousand times a second or more, show nanoamps to amps, and integrate the charge, giving the average and the battery life of a whole cycle at once ([[usb-power-meters-and-profilers]]).

### A home-made logger: the INA219

The INA219 is an I2C chip with a 0.1 Ω shunt on a small board. It reports the shunt voltage (10 µV per step, so 0.1 mA per step with 0.1 Ω) and the bus voltage (4 mV per step), up to about 3.2 A. A conversion takes 84 µs at 9 bits to 532 µs at 12 bits, so it logs averages well and sees a few-millisecond burst coarsely. Newer parts such as the INA226 are faster and quieter.

> [!warn] Never put a current meter across a voltage source: the current is limited only by the fuse, which blows. These methods are for low-voltage circuits only, never for mains.

> [!key] A meter in series shows averages and robs the rail of I × R; a shunt and a scope show the shape; a profiler gives both and integrates. Choose by what you need: the sleep current, the burst, or the energy of a whole cycle.`,
  ideas: [
    'A meter in series adds a burden: V = I × R comes off the rail, so a 1 Ω range browns out a 340 mA burst.',
    'A multimeter averages over a fraction of a second and cannot see a 2 ms burst.',
    'A shunt of 0.1–1 Ω with an oscilloscope shows the burst\'s shape with a small burden.',
    'Profilers sample fast and integrate charge; an INA219 logs averages cheaply over I2C.'
  ],
  pitfalls: [
    'The meter reads 28 mA, so that is the peak — It reads the average over its display period. A 340 mA burst of 2 ms every 100 ms is nearly invisible to it, and its burden may be what sagged the rail.',
    'The sleep current measured on the µA range is the board\'s sleep current — The burden of that range can brown the chip out at wake-up, and a measured value that changes between runs means the meter is part of the circuit.',
    'A bigger shunt gives a better picture — It gives a bigger signal, and a bigger burden. Take the smallest shunt whose voltage you can read.'
  ],
  terms: [
    { term: 'Burden voltage', also: ['insertion drop', 'shunt drop'], def: 'The voltage lost across an ammeter or shunt placed in the circuit, equal to the current times its resistance. It is taken from the circuit under test.' },
    { term: 'Shunt resistor', also: ['current-sense resistor', 'sense resistor'], def: 'A small, accurate resistor placed in the path of the current so that its voltage drop, I × R, can be measured. Typically 0.01 Ω to 1 Ω for supply currents.' },
    { term: 'Current profiler', also: ['power profiler', 'PPK2', 'Joulescope'], def: 'An instrument that records current against time at high sample rates over many ranges, from nanoamps to amps, and integrates charge and energy. It shows the bursts that a multimeter averages away.' },
    { term: 'INA219', also: ['INA226', 'current-sense amplifier'], def: 'A chip that measures the voltage across a shunt resistor and the bus voltage and reports both over I2C. The INA219 reaches about 3.2 A with the usual 0.1 Ω shunt.' }
  ],
  choose: {
    good: ['A bench meter for steady sleep current, with a bypass for start-up', 'A shunt and an oscilloscope for the shape and length of the bursts', 'A profiler for battery budgets, integrating the whole wake-send-sleep cycle', 'An INA219 for a cheap logger of averages over hours'],
    avoid: ['A meter\'s mA range for bursts', 'A large shunt that browns out the circuit', 'Putting any current meter across a voltage source', 'Trusting a reading that changes with the range'],
    check: ['The burden voltage at your peak current', 'The sample rate against the length of the burst', 'The range-switching glitch of an auto-ranging meter']
  },
  code: [
    {
      title: 'Read an INA219 over I2C',
      about: 'A second ESP32 reads an INA219 module that sits in the supply line of the board under test, and prints the bus voltage and the current twice a second. It reads the shunt register directly, so no calibration is needed: with the module\'s 0.1 Ω shunt every step is 0.1 mA.',
      needs: 'An ESP32 as the logger, an INA219 module (0.1 Ω shunt, I2C address 0x40) and the board to be measured.',
      wiring: [['INA219 VIN+', 'the supply +', 'the current enters here'], ['INA219 VIN−', 'the board under test, supply input'], ['INA219 GND', 'GND', 'common with the logger and the board'], ['INA219 VCC', 'logger 3V3'], ['INA219 SDA, SCL', 'logger GPIO21, GPIO22', 'add 4.7 kΩ pull-ups if the module has none']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
        forever
          set [shunt v] to (I2C read (2) bytes from address (0x40) register (0x01))    // two bytes, high byte first, as a signed number
          set [bus v] to (I2C read (2) bytes from address (0x40) register (0x02))
          set [mA v] to (((shunt) * (0.01)) / (0.1))
          print (join [mA: ] (mA))
          print (join [bus mV: ] (((bus) / (8)) * (4)))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t INA219 = 0x40;                 // address with A0 and A1 to GND
        const float SHUNT_OHMS = 0.1;                // the module's shunt resistor

        uint16_t readReg(uint8_t reg) {
          Wire.beginTransmission(INA219);
          Wire.write(reg);
          Wire.endTransmission(false);               // repeated start
          Wire.requestFrom(INA219, (size_t)2);
          uint16_t hi = Wire.read();
          uint16_t lo = Wire.read();
          return (hi << 8) | lo;
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
        }

        void loop() {
          int16_t shunt = (int16_t)readReg(0x01);    // shunt voltage, 10 µV per step, signed
          uint16_t bus = readReg(0x02) >> 3;         // bus voltage, 4 mV per step
          float mA = shunt * 0.01 / SHUNT_OHMS;      // 0.01 mV per step, divided by ohms
          Serial.printf("%.2f V  %.1f mA\n", bus * 0.004, mA);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import struct, time

        INA219 = 0x40                                # address with A0 and A1 to GND
        SHUNT_OHMS = 0.1                             # the module's shunt resistor
        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)

        def read_reg(reg, signed=False):
            return struct.unpack(">h" if signed else ">H", i2c.readfrom_mem(INA219, reg, 2))[0]

        while True:
            shunt = read_reg(0x01, True)             # shunt voltage, 10 µV per step, signed
            bus = read_reg(0x02) >> 3                # bus voltage, 4 mV per step
            ma = shunt * 0.01 / SHUNT_OHMS           # 0.01 mV per step, divided by ohms
            print("%.2f V  %.1f mA" % (bus * 0.004, ma))
            time.sleep_ms(500)
      `,
      output: `
        3.31 V  81.4 mA
        3.31 V  83.0 mA
        3.30 V  82.2 mA
      `,
      notes: ['The default configuration measures up to 3.2 A with a 12-bit conversion of about 0.5 ms; the readings are averages over that window, not instantaneous values.', 'The INA219 measures on the high side: the bus voltage it reports is on the load side of the shunt. All three grounds must be joined.']
    }
  ],
  examples: [
    {
      title: 'Choose a shunt',
      q: 'You want to see a 340 mA burst on a 3.3 V rail with at most 50 mV of burden, and a signal of at least 20 mV. Which shunt resistance fits?',
      steps: ['Burden limit: $R \\le 0.05 / 0.34 = 0.147\\ \\Omega$.', 'Signal need: $R \\ge 0.02 / 0.34 = 0.059\\ \\Omega$.', 'Any value between 0.06 and 0.15 Ω works; 0.1 Ω is the usual choice: 34 mV of signal and 34 mV of burden.'],
      a: '0.1 Ω: 34 mV across it at the peak, a burden of 34 mV.'
    }
  ],
  formulas: [
    {
      name: 'Burden voltage',
      expr: 'Vb = I*R',
      tex: 'V_{\\mathrm{b}} = I\\, R',
      vars: {
        Vb: { name: 'burden voltage (and shunt signal)', q: 'voltage', unit: 'mV', tex: 'V_{\\mathrm{b}}' },
        I: { name: 'current', q: 'current', unit: 'mA', value: 340 },
        R: { name: 'meter or shunt resistance', q: 'resistance', unit: 'Ω', value: 0.1 }
      },
      note: 'The same equation gives the burden taken from the circuit and the signal an oscilloscope sees. Keep Vb a small fraction of the rail.',
      stories: { Vb: 'A {R} shunt carries {I}. What voltage is across it?' },
      practice: { unknowns: ['Vb', 'R'] }
    }
  ],
  quiz: [
    { q: 'A multimeter on its mA range reads a steady 28 mA on a Wi-Fi node that bursts to 340 mA for 2 ms every 100 ms. What does the reading mean?', choices: ['The peak is 28 mA', 'It is about the average over the display period; the bursts are invisible and the burden may even disturb them', 'The chip is faulty', 'The average is 340 mA'], a: 1, why: 'The meter integrates over a fraction of a second and shows the average. The burst contributes 340 × 0.02 = 6.8 mA to it, and its burden voltage may be what sags the rail.' },
    { q: 'What voltage appears across a 0.1 Ω shunt carrying 340 mA?', answer: 34, unit: 'mV', why: 'V = I × R = 0.34 × 0.1 = 0.034 V = 34 mV, easily seen on an oscilloscope, and a small burden on a 3.3 V rail.' },
    { q: 'A meter placed in series is harmless to the circuit being measured.', a: false, why: 'It is a resistor in the supply line: its burden voltage comes off the rail, and its range switching causes glitches.' },
    { q: 'Which of these can catch a 2 ms burst?', choices: ['A bench meter updating three times a second', 'A 0.1 Ω shunt with an oscilloscope, or a profiler sampling at 100 kS/s', 'A power bank display', 'A USB cable'], a: 1, why: 'Only an instrument that samples much faster than the burst lasts can show it: a scope across a shunt, or a profiler.' }
  ],
  applications: [
    'Verifying the sleep current of a battery node before trusting a battery-life estimate ([[battery-life-budget]]).',
    'Seeing why a board browns out: the burst height and length at the module.',
    'Finding which part of a board, the regulator, the USB chip or an LED, wastes the sleep budget.',
    'Logging the consumption of a device over days with a cheap INA219 logger.'
  ],
  sources: [
    'INA219 datasheet: the register map, the shunt and bus voltage steps and the conversion times.',
    'Nordic Semiconductor, Power Profiler Kit II user guide; Joulescope documentation; the µCurrent documentation.',
    'Hyper Electronics: the multimeter, the oscilloscope and meter loading.'
  ],
  sim: 'pw-meter'
}
);
