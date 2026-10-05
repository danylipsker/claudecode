/* HYPER-ESP32 · content/bench-instruments.js
 *
 * Topic: Instruments on the bench (branch: instruments-and-measurement).
 * Eleven pages: the multimeter, the bench power supply, the oscilloscope, the logic analyser, power meters and
 * profilers, USB-serial adapters, signal generators, spectrum analysers and antenna analysers, Wi-Fi and
 * Bluetooth analyser apps, soldering and rework, ESD and safety on the bench.
 * Simulations: sims/bench-instruments.js (ids start with bi-).
 */
Hyper.add(
/* ================================================================ the multimeter */
{
  id: 'the-multimeter',
  parent: 'bench-instruments',
  title: 'The multimeter',
  level: 1,
  short: 'The first instrument on every ESP bench. Voltage, continuity, resistance, a diode test and current: five questions it answers in seconds, and for each of them one way of getting it wrong that costs a board or a fuse.',
  keywords: ['multimeter', 'DMM', 'voltmeter', 'continuity', 'beeper', 'diode test', 'input impedance', 'meter loading', 'burden voltage', 'fuse', 'CAT rating', 'resistance', 'check 3.3 V', 'short circuit', 'mA range'],
  prereq: ['three-volt-logic', 'the-3v3-rail', 'electronics:multimeter'],
  related: ['measuring-current', 'measuring-voltage', 'accuracy-resolution-precision', 'the-bench-power-supply', 'electronics:meter-loading', 'fault-finding-method'],
  body: `A multimeter answers five questions, and most "the board is dead" stories end with one of them: is the voltage there, is the wire connected, is there a short, is the part the right way round, how much current flows? Each has its own mode, and each mode its own way of going wrong.

### Voltage: in parallel, and almost free
Put the probes **across** the thing. A good meter has an input resistance of about 10 MΩ, so it draws a negligible current from a 3.3 V rail. The first measurement on any new board is the 3V3 pin against GND: it should read between 3.0 and 3.6 V, the supply range the chip accepts. Then the pins you doubt: EN should sit high, and a strapping pin ([[strapping-pins]]) should read what the chip needs at reset. The same 10 MΩ is a trap on a high-resistance source: across the middle of a 10 MΩ + 10 MΩ divider the meter is a third resistor, and the reading falls by a third ([[voltage-dividers-for-inputs]]).

### Continuity and resistance: power off
Continuity is a low-resistance test with a beeper: it sends a small current through the path and beeps below a few tens of ohms. Use it with the board **unpowered**: to follow a wire on a breadboard, to find a solder bridge between two pads, and, before the very first power-up of anything you built, to check that 3V3 and GND are *not* joined. Resistance mode reads pull-ups and dividers, but only with the power off and the part out of reach of parallel paths.

### Diode test
The meter pushes a small current through the part and shows the forward voltage: about 0.6 V for a silicon diode, 0.2 to 0.3 V for a Schottky, around 1.8 V for a red LED. It gives the polarity of an unmarked diode and shows whether a protection diode ([[protection-parts]]) is intact.

### Current: in series, and the dangerous one
For current the meter becomes a small resistor in the circuit, with the red lead in another jack behind its own fuse. Two accidents are common. The lead left in the current jack while the probes touch a supply makes a near-short and blows the fuse. And on a radio board the meter's burden voltage sags the rail at every transmit burst ([[measuring-current]]).

### What to expect

| Measurement | Mode | Expect | Trap |
|---|---|---|---|
| 3V3 pin to GND | volts, DC | 3.0 to 3.6 V | USB powered: also check it while the radio transmits |
| Is 3V3 shorted to GND? | continuity, power off | no beep | a beep means stop |
| A pull-up resistor | ohms, power off | its value, e.g. 10 kΩ | other parts in parallel read low |
| LED polarity | diode test | 1.8 to 3 V one way, open the other | blue and white LEDs may not light |

> [!warn] A hobby multimeter is for low-voltage circuits. Mains needs a meter with a CAT II or CAT III rating for the place, and a qualified person.

> [!key] The multimeter reads steady values: rail voltage, continuity, resistance, diode direction. Keep it out of the supply line of a radio board on its current range, and never use the current jack across a voltage source.`,
  ideas: [
    `Voltage is measured across a part, with an input resistance near 10 MΩ; on a high-resistance source the meter itself changes the answer.`,
    `Continuity and resistance are measured with the power off; a beep between 3V3 and GND on a new board means stop.`,
    `Diode mode shows the forward voltage and so the polarity of diodes and LEDs.`,
    `Current is measured in series through a fused jack: the meter adds a burden, and the wrong lead position is a short circuit.`
  ],
  pitfalls: [
    `The meter reads 3.3 V, so the board gets 3.3 V — The meter is slow and averages: a dip of a few milliseconds when the radio transmits is invisible to it. Look at the rail with an oscilloscope.`,
    `The meter's own fuse and jack are safe whatever the lead position — The current jack is a near-short. With the leads in the current jacks, touching a supply blows the fuse or worse.`,
    `A continuity beep proves the wire is good — It proves a low-resistance path, possibly the wrong one. A hairline-cracked trace can beep under the probe and open when the board flexes.`
  ],
  terms: [
    { term: `Input impedance`, also: ['input resistance', 'meter loading'], def: `The resistance the meter presents to the circuit it measures, typically 10 MΩ in voltage mode. It draws a small current, which changes the reading when the source resistance is high.` },
    { term: `Continuity test`, also: ['beeper', 'buzzer mode'], def: `A low-resistance test that beeps when the probes are joined by less than a few tens of ohms. It is done with the circuit unpowered and finds breaks and shorts.` },
    { term: `Diode test`, also: ['diode mode'], def: `A mode in which the meter drives a small current through a part and displays its forward voltage. It shows the polarity of a diode or LED and whether it conducts.` },
    { term: `Measurement category`, also: ['CAT II', 'CAT III', 'CAT rating'], def: `A rating, from IEC 61010, of the surges a meter is built to survive in a given place in a mains installation. Only a meter rated for the place may be used on mains.` }
  ],
  choose: {
    good: [`Rail voltages, continuity, resistance and diode checks on every new board`, `A steady sleep current, in series, with a bypass for the start-up`, `Comparing the ESP's ADC with a known voltage`],
    avoid: [`The mA range in the supply of a radio node during transmit`, `Judging a PWM or serial signal by its average reading`, `Any meter of unknown category on mains`],
    check: [`The fuse ratings and which jack is which`, `The input impedance against the source resistance`, `That the meter is in voltage mode before touching a supply`]
  },
  code: [
    {
      title: `A known voltage to compare with the meter`,
      about: `Reads a divider that sits at half the supply and prints the ESP's own reading in millivolts, averaged over 16 samples. Measure the same node with the multimeter and compare: they should agree to within a few per cent, which is how good the on-chip converter is.`,
      needs: `An ESP32 DevKit, two 10 kΩ resistors and a 100 nF capacitor. The pin is an ADC1 input: GPIO34 on an ESP32 (GPIO4 on an ESP32-C3, GPIO1 on an ESP32-S3).`,
      wiring: [['3V3', '10 kΩ → GPIO34', 'the upper resistor'], ['GPIO34', '10 kΩ → GND', 'the lower resistor, with 100 nF from GPIO34 to GND'], ['multimeter', 'across the lower resistor', 'volts, DC']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34) in millivolts)
            wait (0.002) seconds
          end
          print (join [ADC mV: ] (round ((sum) / (16))))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                        // an ADC1 pin: use one that your chip has

        void setup() {
          Serial.begin(115200);
          analogReadResolution(12);
          analogSetPinAttenuation(ADC_PIN, ADC_11db);  // the widest input range
        }

        void loop() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) {
            sum += analogReadMilliVolts(ADC_PIN);      // calibrated millivolts
            delay(2);
          }
          Serial.printf("ADC mV: %u\n", (unsigned)(sum / 16));
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)        # the widest input range

        while True:
            total = 0
            for _ in range(16):
                total += adc.read_uv()                 # calibrated microvolts
                time.sleep_ms(2)
            print("ADC mV:", total // 16 // 1000)
            time.sleep(1)
      `,
      output: `
        ADC mV: 1648
        ADC mV: 1651
        ADC mV: 1649
      `,
      notes: [`With a 3.3 V supply the divider sits near 1.65 V, inside the range where the converter is best. The 100 nF capacitor gives the converter's sampling switch a reservoir; without it the readings of a 5 kΩ source wander.`, `Do not trust the supply to be exactly 3.3 V: measure 3V3 with the meter too, and compare the ratio rather than the absolute value.`]
    }
  ],
  examples: [
    {
      title: `The meter that halves the reading`,
      q: `You measure the junction of two 10 MΩ resistors from 3.3 V with a meter whose input resistance is 10 MΩ. What does it show?`,
      steps: [`The meter is in parallel with the lower resistor: 10 MΩ ∥ 10 MΩ = 5 MΩ.`, `The divider is now 10 MΩ over 5 MΩ: $V = 3.3 \\times 5/(10+5) = 1.1$ V.`, `Without the meter the junction would sit at 1.65 V: the meter changed the answer by a third.`],
      a: `1.1 V, instead of the true 1.65 V.`
    }
  ],
  formulas: [
    {
      name: `A divider read by a loaded meter`,
      expr: 'Vm = Vs*R2*Rm/(R1*R2 + R1*Rm + R2*Rm)',
      tex: 'V_{\\mathrm{m}} = V_{\\mathrm{s}}\\,\\frac{R_2 R_{\\mathrm{m}}}{R_1 R_2 + R_1 R_{\\mathrm{m}} + R_2 R_{\\mathrm{m}}}',
      vars: {
        Vm: { name: 'reading of the meter', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{m}}' },
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{s}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'MΩ', value: 10, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'MΩ', value: 10, tex: 'R_2' },
        Rm: { name: 'input resistance of the meter', q: 'resistance', unit: 'MΩ', value: 10, tex: 'R_{\\mathrm{m}}' }
      },
      note: `The meter sits in parallel with the lower resistor. The error is small when the meter's resistance is far above R2, and large when they are alike.`,
      stories: { Vm: `A divider of {R1} over {R2} on {Vs} is measured with a meter of {Rm}. What does the meter show?` },
      practice: { unknowns: ['Vm', 'Rm'] }
    }
  ],
  quiz: [
    { q: `A 10 MΩ meter measures the junction of two 10 MΩ resistors across 3.3 V. What does it show?`, choices: ['1.65 V', 'About 1.1 V', '3.3 V', '0 V'], a: 1, why: `The meter in parallel with the lower resistor makes it 5 MΩ, so the divider gives 3.3 × 5/15 = 1.1 V instead of 1.65 V.` },
    { q: `You have just built a board and are about to connect power for the first time. Which check is worth doing first?`, choices: ['Voltage mode on 3V3, with power on', 'Continuity between 3V3 and GND, with power off', 'Current mode in series with USB', 'Diode mode across the module'], a: 1, why: `A short between the rail and ground is the commonest build fault, and it is found in a second with the power off, before anything can be damaged.` },
    { q: `The meter's leads are in the mA and COM jacks and its probes touch a 3.3 V supply. What happens?`, choices: ['It shows 3.3 V', 'It shows 0 V', 'The meter is a near-short: a big current flows until its fuse blows', 'Nothing, the range is too low'], a: 2, why: `In the current jacks the meter is a fraction of an ohm. Across a voltage source that draws a very large current, limited only by the supply and the fuse.` },
    { q: `A multimeter shows a steady 3.3 V on a node that really drops to 2.6 V for 3 ms every second.`, a: true, why: `The display averages over a fraction of a second and updates a few times a second: a short dip hardly moves the number. An oscilloscope shows it.` }
  ],
  applications: [
    `The first checks on a new or repaired board: 3V3, EN and the strapping pins ([[strapping-pins]]).`,
    `Finding a solder bridge or a broken wire on a breadboard or a hand-built shield.`,
    `Checking the voltage of a battery under load, at the module and not at the cell.`,
    `Calibrating the ESP's ADC against a known voltage ([[adc-attenuation-and-calibration]]).`
  ],
  sources: [
    `Multimeter manuals: input impedance, fuse ratings, burden of the current ranges and the measurement category.`,
    `IEC 61010-1: safety requirements for measuring equipment, including the measurement categories.`,
    `Espressif, ESP32 series datasheets: recommended supply voltage range and the ADC characteristics.`
  ],
  sim: 'bi-meter'
},

/* ================================================================ the bench power supply */
{
  id: 'the-bench-power-supply',
  parent: 'bench-instruments',
  title: 'The bench power supply',
  level: 1,
  short: `A bench supply gives an adjustable voltage and an adjustable current limit. The limit is the feature that saves boards: when a fault asks for too much current, the supply stops raising the current and lets the voltage fall instead.`,
  keywords: ['bench power supply', 'lab supply', 'constant current', 'constant voltage', 'CV', 'CC', 'current limit', 'OVP', 'inrush', 'first power-up', 'linear supply', 'switching supply', 'ripple', 'remote sense', 'brownout'],
  prereq: ['the-multimeter', 'the-3v3-rail', 'usb-power'],
  related: ['current-peaks-and-capacitors', 'brownout', 'measuring-current', 'lithium-cells', 'battery-life-budget', 'electronics:power-supply-design'],
  body: `A bench supply is a power source you can set. Two knobs matter: the **voltage** you want, and the **current limit** you will allow. As long as the load draws less than the limit, the supply holds the set voltage (constant-voltage mode, usually a green lamp). The moment a load tries to draw more, the supply holds the *current* at the limit and lets the voltage fall (constant-current mode, usually red). A short circuit then costs the board only the limit's worth of current, and the display tells you something is wrong.

### The first power-up procedure
1. Output off. Set the voltage and measure it at the leads with a multimeter before anything is connected: the dial may be off, and 5 V into a 3V3 pin ends a board.
2. Set the current limit low: 100 mA for an unknown board without a radio, 200 to 300 mA for one with Wi-Fi.
3. Connect, switch on, and read the current. A healthy idle ESP32 board draws tens of milliamps; a hundred-odd milliamps of constant-current lamp means a fault.

### A limit that is too low looks like a fault
An ESP32 on Wi-Fi draws a burst of a few hundred milliamps every time the radio transmits ([[current-peaks-and-capacitors]]). A limit of 100 mA cannot supply that: the supply drops into constant-current mode for those milliseconds, the rail sags, the chip's brown-out detector resets it ([[brownout]]) and the board restarts again and again. It looks like a broken board. The cure is a higher limit, not a new board.

### Where to connect

| Connection | What follows | Set | Note |
|---|---|---|---|
| 5V or VIN pin | the board's regulator | 5.0 V | unplug USB, or the two sources fight |
| 3V3 pin | straight to the chip rail | 3.3 V, never above 3.6 V | bypasses the regulator and the protection |
| battery connector | the board's charger or regulator | 3.7 V as a stand-in cell | the charger sees the supply as a cell |

### Linear or switching
Linear supplies are quiet and have fast recovery; switching ones are lighter and cheaper and carry a little more noise at their switching frequency. For radio and ADC work, look at the output on an oscilloscope ([[the-oscilloscope]]) and add the capacitors a real battery would not need. A supply with *remote sense* measures the voltage at the load end of the leads and cancels their drop.

> [!warn] A bench supply is not a battery charger. Never connect one to a lithium cell to charge it: charge a cell only through a charger IC with its protection circuit ([[lithium-cells]]).

> [!key] Set the voltage first, check it with a meter, then set a current limit a little above what the board really needs and connect. A limit that is too tight produces brown-outs that look like faults; a limit that is too loose protects nothing.`,
  ideas: [
    `In constant-voltage mode the supply holds the set voltage; in constant-current mode it holds the limit and the voltage falls.`,
    `Set and check the voltage, and set the current limit, before connecting a board.`,
    `A limit below the radio's burst current makes the board brown out in a loop that looks like a defect.`,
    `A supply on the 3V3 pin bypasses the regulator: never go above 3.6 V.`
  ],
  pitfalls: [
    `The display says 3.30 V, so the board has 3.30 V — That is the voltage at the supply's terminals. Leads, clips and a breadboard drop part of it at the board, most of all at a transmit burst.`,
    `A bench supply is as good as a battery for any test — It has a different source resistance and recovery time, and no energy limit. A node that works on the supply may brown out on a weak cell, and the reverse.`,
    `Plugging in USB while the supply feeds the 5V pin is harmless — Two sources joined through the board's diodes and regulator fight each other, and one of them can be damaged.`
  ],
  terms: [
    { term: `Constant voltage`, also: ['CV mode'], def: `The mode in which a supply holds its set voltage and the load decides the current, as long as the current stays below the limit.` },
    { term: `Constant current`, also: ['CC mode', 'current limit'], def: `The mode in which a supply holds the set current limit and lets the voltage fall, because the load asks for more than the limit allows.` },
    { term: `Remote sense`, also: ['4-wire sense'], def: `Two extra sense leads that carry the voltage at the load back to the supply, so that it can compensate for the drop in the power leads.` },
    { term: `Over-voltage protection`, also: ['OVP'], def: `A circuit that switches the output off if the voltage rises above a set level, so that a fault in the supply cannot damage the load.` }
  ],
  choose: {
    good: [`A first power-up of any new or repaired board with the limit set`, `Powering a board at its true operating voltage while you measure it`, `Emulating a battery's voltage range to test the brown-out margin`],
    avoid: [`Charging a lithium cell directly`, `A current limit set far above what the board needs`, `Feeding the 3V3 pin above 3.6 V`],
    check: [`The voltage at the board, with a meter, under load`, `The supply's current resolution against a sleep current`, `That USB is unplugged when you feed the 5V pin`]
  },
  code: [
    {
      title: `Count the restarts: is the limit too tight?`,
      about: `Counts every start in non-volatile memory, prints why the chip last restarted, and then scans for Wi-Fi networks every three seconds, which makes the radio draw its burst currents. Run it from the bench supply with different limits: if the count climbs with a low limit and stays at one with a higher one, the supply was the cause.`,
      needs: `An ESP32-family board with Wi-Fi, a bench supply (on the 5V pin, USB unplugged) and the serial monitor at 115200 baud, from a second connection or after the run.`,
      blocks: `
        when started
          start serial at (115200) baud
          wait (0.5) seconds
          set [boots v] to ((load [boots] default (0)) + (1))
          save (boots) as [boots]
          print (join [start # ] (boots))
          print (join [last restart: ] (restart reason))
        forever
          print (join [networks found: ] (scan for Wi-Fi networks))
          wait (3) seconds
        end
      `,
      cpp: String.raw`
        #include <Preferences.h>
        #include <WiFi.h>
        #include <esp_system.h>

        Preferences prefs;

        const char *reasonName(esp_reset_reason_t r) {
          switch (r) {
            case ESP_RST_POWERON:  return "power on";
            case ESP_RST_BROWNOUT: return "brown-out (the supply dipped)";
            case ESP_RST_SW:       return "software restart";
            case ESP_RST_PANIC:    return "crash (panic)";
            default:               return "other";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(500);
          prefs.begin("bench", false);                       // a small store that survives restarts
          uint32_t boots = prefs.getUInt("boots", 0) + 1;
          prefs.putUInt("boots", boots);
          prefs.end();
          Serial.printf("start #%u, last restart: %s\n", (unsigned)boots, reasonName(esp_reset_reason()));
          WiFi.mode(WIFI_STA);
        }

        void loop() {
          int n = WiFi.scanNetworks();                       // the radio transmits probe requests here
          Serial.printf("networks found: %d\n", n);
          WiFi.scanDelete();
          delay(3000);
        }
      `,
      py: String.raw`
        import esp32, machine, network, time

        NAMES = {
            machine.PWRON_RESET: "power on",
            machine.HARD_RESET: "hardware reset",
            machine.WDT_RESET: "watchdog",
            machine.DEEPSLEEP_RESET: "woke from deep sleep",
            machine.SOFT_RESET: "software restart",
        }

        nvs = esp32.NVS("bench")                       # a small store that survives restarts
        try:
            boots = nvs.get_i32("boots")
        except OSError:
            boots = 0
        boots += 1
        nvs.set_i32("boots", boots)
        nvs.commit()
        time.sleep_ms(500)
        print("start #%d, last restart: %s" % (boots, NAMES.get(machine.reset_cause(), "other")))

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        while True:
            print("networks found:", len(wlan.scan()))   # the radio transmits probe requests here
            time.sleep(3)
      `,
      output: `
        start #1, last restart: power on
        networks found: 9
        networks found: 9
        start #2, last restart: brown-out (the supply dipped)
      `,
      notes: [`MicroPython has no value of its own for a brown-out: it files such a restart under the coarser causes, so only the climbing count tells the story there.`, `The count lives in flash and never resets by itself. Erase the flash, or change the namespace name, to start from one again.`]
    }
  ],
  examples: [
    {
      title: `How low can the limit go?`,
      q: `A board idles at 70 mA and its Wi-Fi bursts reach 340 mA for about 2 ms. What current limit lets the burst through?`,
      steps: [`The supply must deliver the peak, or the rail sags during the burst: at least 340 mA.`, `Add margin for the board's other loads and for the burst being a little higher than the datasheet's figure: 400 to 500 mA.`, `A limit of 500 mA still protects against a hard short far better than no limit at all; for a first test of an unknown board, begin at 100 mA without the radio.`],
      a: `About 400 to 500 mA for a Wi-Fi test; 100 mA while the radio is still off.`
    }
  ],
  quiz: [
    { q: `A bench supply set to 3.3 V and 100 mA limit powers a board on Wi-Fi that bursts to 300 mA. What do you most likely see?`, choices: ['A normal 3.3 V rail', 'Constant-current mode at every burst, a sagging rail, brown-out resets', 'The supply shuts down permanently', 'Nothing; the board stores the energy'], a: 1, why: `The burst exceeds the limit, so for those milliseconds the supply holds 100 mA and the voltage falls below what the chip needs: the brown-out detector restarts it.` },
    { q: `A short circuit is applied to a supply set to 5 V with a 200 mA limit. In constant-current mode, what is the output current?`, answer: 200, unit: 'mA', why: `The supply holds the current at the limit and lets the voltage collapse; the short then dissipates almost nothing.` },
    { q: `You set the voltage knob to 3.3 V and connect straight to the 3V3 pin. What should you have done first?`, choices: ['Nothing, the dial is exact', 'Measured the output at the leads with a meter, with no load', 'Set the current limit to maximum', 'Plugged in USB as well'], a: 1, why: `The dial or display can be off or have been moved. 3.6 V is the limit for the pin, so check the real voltage before connecting.` },
    { q: `A bench supply is a good way to charge a lithium cell, because it has a current limit.`, a: false, why: `A cell needs a charge profile and protection: a charger IC with termination and temperature monitoring. A current limit alone does not stop an overcharge.` }
  ],
  applications: [
    `The first power-up of a prototype or a repaired board with a limit that bounds the damage.`,
    `Running a board at 3.0 V and 3.6 V to find out how close its brown-out margin is.`,
    `Finding a short on a board by injecting a limited current and following the warm part or the voltage drop.`,
    `Emulating a discharging battery during a battery-life test ([[battery-life-budget]]).`
  ],
  sources: [
    `Bench power supply manuals: constant-voltage and constant-current operation, remote sense, over-voltage protection.`,
    `Espressif, ESP32 series datasheets: supply voltage range and the current drawn during radio transmission.`,
    `Hyper Electronics: power supply design.`
  ],
  sim: 'bi-supply'
},

/* ================================================================ the oscilloscope */
{
  id: 'the-oscilloscope',
  parent: 'bench-instruments',
  title: 'The oscilloscope',
  level: 2,
  short: `The instrument that shows voltage against time: the rail dipping when the radio transmits, a PWM edge, a glitch that happens once a second. Its three settings (time per division, volts per division, trigger) and its probe decide whether you see the fault or a calm lie.`,
  keywords: ['oscilloscope', 'scope', 'trigger', 'time base', 'volts per division', 'probe', 'x10 probe', 'probe compensation', 'ground clip', 'bandwidth', 'sample rate', 'single shot', 'AC coupling', 'brownout dip', 'ground loop', 'rise time'],
  prereq: ['the-multimeter', 'current-peaks-and-capacitors', 'electronics:oscilloscope'],
  related: ['the-bench-power-supply', 'measuring-current', 'brownout', 'esp-as-an-oscilloscope', 'pwm-with-ledc', 'electronics:sampling-nyquist'],
  body: `A multimeter gives a number; an oscilloscope gives a picture of voltage against time. On an ESP bench that picture catches what the meter averages away: the 3.3 V rail dipping by a few tenths of a volt each time the radio transmits, a PWM edge that arrives late, a glitch on a reset line once a second.

### Three settings and a probe
**Time per division** sets how much time the screen shows (ten divisions across): 1 ms per division shows 10 ms. **Volts per division** sets the height. To look at a 3.3 V rail dipping by 0.3 V, use 100 mV per division with the rail shifted to the middle of the screen, or switch to AC coupling, which blocks the 3.3 V and lets you zoom on the changes. **Trigger** decides where each sweep starts: the scope waits for the signal to cross a chosen level in a chosen direction and starts drawing there, so a repeating signal stands still. A falling-edge trigger just under the rail draws the screen around each dip. In *normal* mode the scope waits for a trigger and shows nothing otherwise; in *auto* mode it draws anyway after a timeout, and the picture drifts if no real trigger came. *Single* mode freezes the first event: that is how you catch a brown-out.

### The probe is part of the circuit
A ×1 probe loads the circuit with about 1 MΩ and a hundred picofarads, mostly cable. A ×10 probe loads it with 10 MΩ and about ten picofarads, which is why it is the one to use on anything fast. Before use, touch it to the scope's square-wave output and turn the trimmer until the corners are square; the second simulation below shows what a wrong setting does. The ground clip should be short: a long lead rings on fast edges.

### Bandwidth and sample rate
The bandwidth is the frequency at which the scope's reading has fallen by 3 dB. A signal's edge of rise time t needs about 0.35 / t of bandwidth. The sample rate should be several times the bandwidth. A 100 MHz entry-level scope at 1 GS/s handles an ESP's 40 MHz SPI clock only roughly; for the 1 kHz PWM and the supply rail of this page it is far more than enough.

> [!warn] The ground clip of a mains-powered oscilloscope is connected to the mains earth. Clipped to a point that is not at ground potential, it is a short circuit through the scope. Never remove the earth pin to "float" a scope. A board powered from a laptop over USB is already tied to the laptop's ground, and a second ground path makes a ground loop. For anything connected to mains, use an isolated or battery scope or a differential probe, and a qualified person.

> [!key] Set the time base to the event, the vertical scale to its size, and trigger on its edge. Use a ×10 probe, compensated, with a short ground, and remember that the clip is earthed.`,
  ideas: [
    `Time per division, volts per division and the trigger decide what you see; the trigger makes a repeating signal stand still.`,
    `Trigger on the edge of the event: normal mode waits, auto mode draws anyway, single mode freezes the first event.`,
    `A ×10 probe loads the circuit far less than ×1 and must be compensated against the scope's square wave.`,
    `A signal edge with rise time t needs about 0.35 / t of bandwidth; the ground clip is joined to mains earth.`
  ],
  pitfalls: [
    `A flat line means the signal is not there — It may be off screen at the wrong volts per division or offset, or untriggered in normal mode. Press autoset, then refine.`,
    `Any ground point will do for the clip — The clip is joined to mains earth. On a board that is not at ground it shorts it through the scope.`,
    `The bandwidth printed on the scope covers every signal — A square wave of 20 MHz has edges needing several times that, and a ×1 probe cuts the bandwidth to a few MHz.`
  ],
  terms: [
    { term: `Trigger`, also: ['trigger level', 'trigger slope', 'holdoff'], def: `The condition that starts each sweep of the screen: the signal crossing a chosen level in a chosen direction. It makes a repeating signal stable.` },
    { term: `Bandwidth`, also: ['-3 dB bandwidth'], def: `The frequency at which a scope or probe shows only about 70 % of the true amplitude. A rough rule is a rise time of 0.35 divided by the bandwidth.` },
    { term: `Probe compensation`, also: ['probe trimmer'], def: `The adjustment of a ×10 probe's small capacitor so that its voltage divider works at every frequency. It is set with the scope's square-wave output until the corners are square.` },
    { term: `AC coupling`, also: ['DC coupling'], def: `A scope input setting that blocks the steady (DC) part of a signal so that small changes riding on it can be magnified.` },
    { term: `Ground loop`, also: ['earth loop'], def: `A circuit formed when two instruments or boards are joined to ground by more than one path. Currents flowing in it add noise and can damage a connection.` }
  ],
  choose: {
    good: [`Supply rails, brown-out dips and switching noise`, `PWM, serial and bus signals up to a few tens of MHz`, `Catching a rare glitch with single-shot or pulse-width triggering`],
    avoid: [`Clipping the ground to anything but the circuit's ground`, `A ×1 probe on fast edges`, `Direct measurements on mains without isolation`],
    check: [`That the probe is set to the scope's ×10 setting and compensated`, `The bandwidth and sample rate against the fastest edge`, `That the board and the scope do not make a ground loop through USB`]
  },
  code: [
    {
      title: `A test signal and a rare glitch`,
      about: `Makes a 1 kHz PWM wave with a 25 % duty on one pin to practise the time base and the trigger, and, on a second pin, a narrow pulse that occurs at random about once a second to practise catching a rare event with single-shot or pulse-width triggering.`,
      needs: `An ESP32 DevKit and an oscilloscope with two probes. The pins are GPIO4 and GPIO18 on an ESP32 (use GPIO4 and GPIO6 on an ESP32-C3).`,
      wiring: [['GPIO4', 'scope channel 1', '1 kHz PWM, 25 % high'], ['GPIO18', 'scope channel 2', 'the glitch line, normally low'], ['GND', 'both probe grounds', 'short ground springs']],
      blocks: `
        when started
          set PWM on pin (4) frequency (1000) resolution (10)
          set PWM on pin (4) to (256)
          set pin (18) as [output v]
        forever
          wait (0.001) seconds
          if <(random (1) to (1000)) = (1)> then
            set pin (18) to [HIGH v]
            wait (0.000005) seconds
            set pin (18) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int PWM_PIN = 4, GLITCH_PIN = 18;

        void setup() {
          ledcAttach(PWM_PIN, 1000, 10);          // 1 kHz, a 10-bit duty (0 to 1023)
          ledcWrite(PWM_PIN, 256);                // 256 / 1024 = 25 % high
          pinMode(GLITCH_PIN, OUTPUT);
          digitalWrite(GLITCH_PIN, LOW);
        }

        void loop() {
          delay(1);
          if (random(1000) == 0) {                // about once a second, at random
            digitalWrite(GLITCH_PIN, HIGH);
            delayMicroseconds(5);                 // a pulse some microseconds wide
            digitalWrite(GLITCH_PIN, LOW);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import random
        import time

        pwm = PWM(Pin(4), freq=1000, duty_u16=16384)   # 16384 / 65536 = 25 % high
        glitch = Pin(18, Pin.OUT, value=0)

        while True:
            time.sleep_ms(1)
            if random.getrandbits(10) == 0:            # about once in 1024 passes
                glitch.value(1)
                time.sleep_us(5)                       # a pulse some microseconds wide
                glitch.value(0)
      `,
      output: `
        channel 1: a square wave, period 1 ms, high for 250 µs
        channel 2: low, with a short pulse at random, about once a second
      `,
      notes: [`The 5 µs pulse is really somewhat wider, and in MicroPython wider still (tens of microseconds), because each call takes time of its own. Measure it with the cursors rather than trusting the number in the program.`, `Trigger on channel 2, rising edge, single mode, a level of 1.5 V, and set 20 µs per division: the scope waits for the next glitch and freezes it.`]
    }
  ],
  examples: [
    {
      title: `Is the scope fast enough?`,
      q: `A GPIO edge on your board has a rise time of 2 ns. How much bandwidth do you need to see it faithfully, and is a 100 MHz scope enough?`,
      steps: [`Bandwidth needed: $0.35 / 2\\ \\mathrm{ns} = 175$ MHz.`, `A 100 MHz scope has a rise time of its own of $0.35 / 100\\ \\mathrm{MHz} = 3.5$ ns, longer than the edge.`, `It will show the edge as about 4 ns rise time: slower than the truth, but enough to see the shape of ringing at tens of MHz. For the timing of the edge itself you need 200 MHz or more.`],
      a: `About 175 MHz; a 100 MHz scope shows it roughly (about 4 ns) and is enough to see the supply and the buses.`
    }
  ],
  formulas: [
    {
      name: `Bandwidth from rise time`,
      expr: 'BW = 0.35/tr',
      tex: '\\mathrm{BW} = \\frac{0.35}{t_{\\mathrm{r}}}',
      vars: {
        BW: { name: 'bandwidth', q: 'frequency', unit: 'MHz', tex: '\\mathrm{BW}' },
        tr: { name: 'rise time, 10 % to 90 %', q: 'time', unit: 'ns', value: 3.5, tex: 't_{\\mathrm{r}}' }
      },
      note: `The same relation links a scope's bandwidth to its own rise time and a signal's rise time to the bandwidth needed to show it. The two combine as the root of the sum of their squares.`,
      stories: { BW: `A signal edge has a rise time of {tr}. What bandwidth shows it faithfully?` },
      practice: { unknowns: ['BW', 'tr'] }
    }
  ],
  quiz: [
    { q: `The scope shows a stable picture of the 3.3 V rail with the brown-out dip in the middle of the screen. What did you most likely set?`, choices: ['A falling-edge trigger just under the rail level', 'Auto mode with the trigger off', 'AC coupling with a long ground lead', 'The ×1 probe'], a: 0, why: `The scope starts each sweep when the rail falls through the trigger level, so the dip is drawn at the same place every time.` },
    { q: `A scope has a 100 MHz bandwidth. What rise time can it just resolve, in nanoseconds?`, answer: 3.5, unit: 'ns', why: `t = 0.35 / BW = 0.35 / 100 MHz = 3.5 ns.` },
    { q: `A ×10 probe is clipped to the scope's square-wave output and the corners show a spike. What is wrong?`, choices: ['The probe is over-compensated: turn the trimmer', 'The scope is broken', 'The ground clip is too short', 'The signal is below the trigger level'], a: 0, why: `A spike at each edge means the probe's divider passes high frequencies too well; the trimmer capacitor is set too high.` },
    { q: `It is safe to clip the ground lead of a mains-powered scope to any node of a circuit you are probing.`, a: false, why: `The ground clip is connected to mains earth. Clipped to a node at another potential it forces a current through the scope's ground. Only the circuit's own ground is safe.` }
  ],
  applications: [
    `Looking at the 3.3 V rail at the module while the radio transmits ([[current-peaks-and-capacitors]], [[brownout]]).`,
    `Checking a PWM frequency, duty cycle and edge shape on an LED or servo line ([[pwm-with-ledc]]).`,
    `Catching a rare glitch on a reset or interrupt line with single-shot triggering.`,
    `Looking at the ripple of a switching regulator, AC coupled at 20 mV per division.`
  ],
  sources: [
    `Oscilloscope and probe manuals: bandwidth, sample rate, memory depth, probe loading and the compensation procedure.`,
    `Espressif, ESP32 series datasheets: supply range and the brown-out detector.`,
    `Hyper Electronics: the oscilloscope and sampling.`
  ],
  sim: ['bi-scope', 'bi-probe']
},

/* ================================================================ the logic analyser */
{
  id: 'the-logic-analyser',
  parent: 'bench-instruments',
  title: 'The logic analyser',
  level: 2,
  short: `An oscilloscope shows voltage on a channel or two. A logic analyser records many digital lines at once, for seconds, and decodes them into bytes: UART text, I2C addresses, SPI words. A cheap one costs little and finds most bus problems.`,
  keywords: ['logic analyser', 'logic analyzer', 'sigrok', 'PulseView', 'Saleae', 'sample rate', 'threshold', 'protocol decoder', 'UART decode', 'I2C decode', 'SPI decode', 'debug pin', 'baud rate', 'FX2', '24 MHz'],
  prereq: ['the-oscilloscope', 'serial-communication-basics', 'uart'],
  related: ['i2c-pull-ups-and-bus-problems', 'spi-modes-and-speed', 'uart-on-the-esp', 'esp-as-a-logic-analyser', 'one-wire', 'addressable-leds', 'the-serial-monitor'],
  body: `A bus fault is a timing fault you cannot see by looking. An oscilloscope shows one or two lines for a few milliseconds. A **logic analyser** records eight, sixteen or more digital lines at once, for as long as its memory lasts, and turns the 0s and 1s into a timing diagram with the decoded bytes written above it: "0x3C W, ACK, 0x00". It is the instrument for I2C that does not answer, SPI that returns 0xFF, a UART that prints garbage.

### What a cheap one is
The common entry-level analysers have eight channels, sample at up to 24 million samples a second and connect over USB. Many are built around the same Cypress FX2 chip and run the open-source **sigrok** software with its **PulseView** front end, which includes decoders for UART, I2C, SPI, 1-Wire, CAN, WS2812 pixels and a hundred more. Commercial ones such as Saleae's Logic add speed, voltage ranges and polished software. A cheap analyser is comfortable up to a few MHz: I2C at 400 kHz or 1 MHz, UART up to a few megabaud, SPI at a few megahertz.

### The two settings that decide what you see
**Sample rate.** The analyser looks at each line at fixed instants. To find an edge to within a fraction of a bit, sample at least 4 times the bit rate, and 10 times if you want exact timing: for 115200 baud, a bit is 8.7 µs, and 1 MS/s gives eight samples per bit. Too slow, and the decoder starts a bit late and reads the next bit's value, so characters turn to garbage while the lines look fine. **Threshold.** The analyser decides "high" or "low" by comparing the voltage with a fixed or adjustable threshold. Many cheap ones have a fixed threshold for 3.3 V and 5 V logic: a 1.8 V sensor bus may never be read as high. Always join the analyser's ground to the board's ground.

### How to use it
Clip one probe per line and a ground; set the sample rate; trigger on an edge (for example the falling edge of chip select or the I2C start condition); capture; then add a decoder with the right settings: baud and parity for UART, mode for SPI. [The signals lab](#/tools/signals) shows what each protocol looks like on the wire. A last trick: toggle a spare pin high around a piece of code, and the pulse width on the analyser is the run time of that code.

| Protocol | Decoder settings | What to look for |
|---|---|---|
| UART | baud, 8N1 | framing errors: wrong baud |
| I2C | none | a NACK after the address: wrong address or no device |
| SPI | mode 0 to 3, bit order | data on MISO all 0xFF: wrong mode or no device |
| WS2812 | 800 kHz | 24 bits per pixel, green first |

> [!key] A logic analyser shows many lines for a long time and decodes them. Sample at least four times faster than the fastest bit, check that its threshold suits your logic level, and join the grounds.`,
  ideas: [
    `A logic analyser records many digital lines for seconds and decodes UART, I2C, SPI and more into bytes.`,
    `Sample at least 4 times the bit rate; with too low a rate, decoding fails on clean-looking lines.`,
    `The input threshold must suit your logic level: a fixed 3.3 V threshold may not read 1.8 V signals.`,
    `A debug pin toggled around a piece of code lets the analyser measure its run time.`
  ],
  pitfalls: [
    `The decoder shows garbage, so the wiring is wrong — Often the baud rate in the decoder or the sample rate is wrong. Measure the shortest pulse: that is one bit.`,
    `An analyser is the same as a scope with more channels — It sees only 0 and 1. It tells you nothing about levels, ringing or slow edges: use a scope for those.`,
    `A cheap analyser works at any bus speed — Its 24 MS/s is shared by the channels and it cannot decode a 20 MHz SPI clock.`
  ],
  terms: [
    { term: `Logic analyser`, also: ['logic analyzer'], def: `An instrument that records the digital level of many lines at fixed sample instants and shows them as a timing diagram, often with protocol decoding.` },
    { term: `Sample rate`, also: ['sampling rate', 'MS/s'], def: `How many times a second the analyser or scope looks at each line. It should be several times higher than the fastest bit rate to locate the edges.` },
    { term: `Logic threshold`, also: ['input threshold'], def: `The voltage an analyser or input compares the signal with to decide between high and low. A fixed threshold suits only some logic families.` },
    { term: `Protocol decoder`, also: ['decoder', 'analyzer plug-in'], def: `Software that reads the recorded lines and writes the bytes of a protocol such as UART, I2C or SPI above them.` },
    { term: `sigrok`, also: ['PulseView'], def: `An open-source project of capture drivers and protocol decoders for cheap analysers and scopes; PulseView is its graphical program.` }
  ],
  choose: {
    good: [`An 8-channel analyser for I2C, SPI, UART and 1-Wire debugging`, `Timing code with a debug pin`, `Checking WS2812 data and CAN bit timing`],
    avoid: [`Judging signal levels or ringing: that is a scope's job`, `Buses faster than a quarter of the sample rate`, `1.8 V logic on a fixed 3.3 V threshold`],
    check: [`The maximum sample rate with all channels in use`, `The input voltage range and threshold`, `That the decoder is set to the protocol's parameters`]
  },
  code: [
    {
      title: `A UART pattern to decode`,
      about: `Sends the byte 0x55 (the bit pattern 01010101, so that every bit width is easy to measure) and then the text ESP32 once a second at 115200 baud on a spare UART. Capture the TX pin, add a UART decoder, and compare the bytes with the ones sent.`,
      needs: `An ESP32 DevKit and a logic analyser, with channel 0 on GPIO17 and its ground on GND.`,
      wiring: [['GPIO17', 'analyser channel 0', 'the UART transmit line'], ['GND', 'analyser ground', 'always joined']],
      blocks: `
        when started
          start UART (1) at (115200) baud on TX (17) RX (16)
        forever
          send byte (0x55) on UART (1)
          send [ESP32] and a new line on UART (1)
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int TX_PIN = 17, RX_PIN = 16;

        void setup() {
          Serial1.begin(115200, SERIAL_8N1, RX_PIN, TX_PIN);
        }

        void loop() {
          Serial1.write(0x55);          // 01010101: the width of one bit is easy to measure
          Serial1.print("ESP32\n");
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        uart = UART(1, baudrate=115200, tx=17, rx=16)

        while True:
            uart.write(b"\x55")           # 01010101: the width of one bit is easy to measure
            uart.write(b"ESP32\n")
            time.sleep(1)
      `,
      output: `
        decoded by the analyser: 55 45 53 50 33 32 0A   (U E S P 3 2 and a line feed)
        one bit lasts 8.68 µs; the 0x55 byte lasts 10 bits, 86.8 µs
      `,
      notes: [`If the decoder shows garbage, change its baud rate until it agrees; the width of the narrowest pulse in the 0x55 byte is one bit, and its reciprocal is the baud rate.`, `Try 9600 baud in the program and a sample rate of 50 kS/s in the analyser, then 1 MS/s: at the low rate the characters break.`]
    },
    {
      title: `Time a piece of code with a debug pin`,
      about: `Sets a spare pin high just before the code to measure and low just after it. The width of the pulse on the analyser is the time the code took, measured from outside, with no help from the program.`,
      needs: `An ESP32 DevKit and a logic analyser on GPIO4 and GND.`,
      wiring: [['GPIO4', 'analyser channel 0', 'high while the code runs'], ['GND', 'analyser ground']],
      blocks: `
        when started
          set pin (4) as [output v]
        forever
          set pin (4) to [HIGH v]
          do the work to be timed :: my
          set pin (4) to [LOW v]
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        const int DEBUG_PIN = 4;
        volatile uint32_t sink = 0;

        void work() {                    // the code to time
          for (int i = 0; i < 2000; i++) sink = sink + i * i;
        }

        void setup() {
          pinMode(DEBUG_PIN, OUTPUT);
        }

        void loop() {
          digitalWrite(DEBUG_PIN, HIGH); // the pulse starts
          work();
          digitalWrite(DEBUG_PIN, LOW);  // and ends: its width is the run time
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        debug = Pin(4, Pin.OUT, value=0)
        sink = 0

        def work():                      # the code to time
            global sink
            for i in range(2000):
                sink += i * i

        while True:
            debug.value(1)               # the pulse starts
            work()
            debug.value(0)               # and ends: its width is the run time
            time.sleep_ms(100)
      `,
      output: `
        C++:         a pulse of some tens of microseconds, every 100 ms
        MicroPython: a pulse of some milliseconds, every 100 ms
      `,
      notes: [`The same loop takes very different times in the two languages: compiled C++ runs it in microseconds, the interpreter in milliseconds. The pulse shows it without any timing code.`, `The two calls that switch the pin add a little time of their own. For a short function, repeat the code ten times between the edges and divide.`]
    }
  ],
  examples: [
    {
      title: `How fast must the analyser sample?`,
      q: `You want to decode a UART at 921600 baud and measure its bit times to about one tenth of a bit. What sample rate do you need, and does a 24 MS/s analyser manage?`,
      steps: [`One bit lasts $1/921600 = 1.085$ µs.`, `A tenth of a bit is 0.1085 µs, so the sample interval must be about that: roughly 9.2 MS/s.`, `A 24 MS/s analyser takes a sample every 0.042 µs, about 26 samples per bit: more than enough.`],
      a: `About 9 MS/s; the 24 MS/s analyser has ample margin.`
    }
  ],
  quiz: [
    { q: `A 24 MS/s analyser records a UART at 3 megabaud. How many samples fall within one bit?`, answer: 8, why: `24 000 000 samples a second divided by 3 000 000 bits a second is 8 samples per bit: enough to decode, not enough for exact edge timing.` },
    { q: `The UART decoder shows random characters and framing errors, but the bytes are present on the line and look clean. What is the most likely cause?`, choices: ['The wire is broken', 'The decoder is set to the wrong baud rate', 'The analyser has too many channels', 'The ESP is in download mode'], a: 1, why: `The edges are there; a decoder with the wrong bit time samples at the wrong instants and reads other bits. Measure the shortest pulse to find the right rate.` },
    { q: `Which problem is better seen on an oscilloscope than on a logic analyser?`, choices: ['An I2C address that is not acknowledged', 'A slow rising edge with ringing on an I2C line', 'The text sent on a UART', 'The order of bytes in an SPI frame'], a: 1, why: `The analyser reduces the line to 0s and 1s. The shape of an edge, its level and ringing are analogue facts that only a scope shows.` },
    { q: `A 1.8 V sensor's bus is read as all zeros by an analyser with a fixed threshold for 3.3 V logic.`, a: true, why: `The signal may never reach the analyser's high threshold. Use an analyser whose threshold can be set, or one with a low-voltage input range.` }
  ],
  applications: [
    `Finding why an I2C sensor does not answer: wrong address, no pull-ups, a missing ACK ([[i2c-pull-ups-and-bus-problems]]).`,
    `Checking the SPI mode and speed that a display or an SD card needs ([[spi-modes-and-speed]]).`,
    `Verifying the WS2812 timing of an LED strip and the byte order of its colours ([[addressable-leds]]).`,
    `Timing a function or an interrupt response by toggling a debug pin.`
  ],
  sources: [
    `The sigrok project: documentation of the supported hardware and the protocol decoders.`,
    `I2C-bus specification and user manual, NXP UM10204: timing, start and stop conditions, acknowledge.`,
    `Espressif, ESP32 Technical Reference Manual: UART, I2C and SPI controllers.`
  ],
  sim: 'bi-logic'
},

/* ================================================================ power meters and profilers */
{
  id: 'usb-power-meters-and-profilers',
  parent: 'bench-instruments',
  title: 'Power meters and current profilers',
  level: 2,
  short: `A USB power meter shows volts, amps and the energy used, as averages and to the nearest milliamp. A current profiler records the whole sleep-wake cycle, microamps and bursts on one trace. The right one for a battery node is the one that sees its sleep current.`,
  keywords: ['USB power meter', 'USB tester', 'current profiler', 'Power Profiler Kit', 'PPK2', 'Joulescope', 'Otii', 'sleep current', 'charge', 'mAh', 'battery life', 'average current', 'auto-ranging', 'burden voltage', 'sample rate', 'digital marker'],
  prereq: ['the-multimeter', 'measuring-current', 'power-modes'],
  related: ['battery-life-budget', 'deep-sleep', 'the-oscilloscope', 'esp-as-a-power-meter', 'usb-power', 'the-board-is-not-the-chip'],
  body: `The energy a device uses decides how long its battery lasts, and it can be measured in three ways that give three different answers. The way to choose is to ask what each one can see.

### The USB power meter: an average to the milliamp
A small adapter that sits between the charger and the board and shows volts, amps, watt-hours and milliamp-hours. It is cheap, needs no wiring, and is right for the question "how much does this board draw while it is running?" Its limits: the current resolution is usually 1 mA (some show 0.1 mA, some only 10 mA); it updates about once a second, so it shows averages; it counts the whole board, including the USB chip and the power LED, which on a development board draw more than the ESP in deep sleep. A sleep current of 20 µA reads 0.000 A.

### The profiler: the whole cycle
A current profiler, such as Nordic's Power Profiler Kit II, the Joulescope or the Otii, measures current with automatic ranges from nanoamps or microamps to hundreds of milliamps, at a hundred thousand samples a second or more, and records it. The trace of a battery node is the pattern of [[battery-life-budget]]: a long, flat, microamp sleep; a short climb through boot and Wi-Fi connection at some tens to a hundred milliamps; the transmit burst of 240 to 340 mA on an ESP32 or ESP32-S3; back to sleep. The tool integrates the trace into **charge** and an average, which gives the battery life directly. Many have a digital input to mark the stages with a GPIO ([[the-logic-analyser]]).

### Why the instrument matters
A multimeter on its microamp range shows the sleep floor but misses the wake; a USB meter shows the wake but not the floor. Taking either one's figure as "the" current gives a battery life that is wrong by a factor of two to ten, and one that can be wrong in either direction. The profiler is the instrument that sees both.

### Numbers

| Instrument | Sees | Misses |
|---|---|---|
| Multimeter, µA range | steady sleep current | the bursts; burden browns out the wake-up |
| USB power meter | the awake current, averaged | currents under about 1 mA |
| Shunt and oscilloscope | the shape of bursts | microamp sleep |
| Profiler | everything, and integrates it | needs wiring into the supply |

> [!warn] A profiler in series is a supply as well as a meter in many models: set its output to the board's voltage before connecting, never above 3.6 V on a 3V3 pin, and never connect a lithium cell to a bench instrument without protection ([[lithium-cells]]).

> [!key] A USB meter shows the average of what is awake, a multimeter shows what is asleep, and a profiler shows the cycle and its charge. Battery life comes from the charge per cycle.`,
  ideas: [
    `A USB power meter shows averages, at about 1 mA resolution: deep-sleep currents read as zero.`,
    `A current profiler records the sleep-wake cycle over many decades of current and integrates charge.`,
    `A multimeter sees the sleep floor and misses the burst; a USB meter does the reverse.`,
    `Battery life comes from the charge per cycle divided into the cell's capacity, not from either extreme.`
  ],
  pitfalls: [
    `The USB meter says 0.000 A in sleep, so the board sleeps well — Its resolution is 1 mA or worse. A development board's USB chip and LED can draw milliamps that the ESP's own few microamps hide behind.`,
    `The multimeter's sleep reading is the battery draw — It omits the wake-up cost, which can be 90 % of the energy. Average the whole cycle.`,
    `A profiler solves the sleep-current puzzle by itself — It measures the board you connect. If the board's regulator and USB chip draw 5 mA, so will the profile.`
  ],
  terms: [
    { term: `Current profiler`, also: ['power profiler', 'PPK2', 'Joulescope', 'Otii'], def: `An instrument that records current against time over a very wide range and at a high sample rate, and integrates it into charge and energy.` },
    { term: `USB power meter`, also: ['USB tester', 'USB multimeter'], def: `An inline adapter that displays the voltage and current of a USB connection and totals the charge and energy. Its resolution is usually a milliampere.` },
    { term: `Charge`, also: ['mAh', 'coulomb'], def: `The current multiplied by time. A cell holds a number of milliamp-hours; a cycle of the device uses so many milliamp-seconds.` },
    { term: `Digital marker`, also: ['stage marker', 'GPIO marker'], def: `A GPIO output of the device under test, driven high during a stage of its work, recorded alongside the current so that each part of the trace can be labelled.` }
  ],
  choose: {
    good: [`A profiler for any battery or energy-harvesting design`, `A USB meter for the awake draw of a mains- or USB-powered device`, `A multimeter for the steady sleep floor`],
    avoid: [`A USB meter for microamp sleep currents`, `Predicting battery life from a single reading`, `A burden voltage that browns the board out at wake-up`],
    check: [`The instrument's lowest range and its resolution`, `The sample rate against the shortest burst`, `What else is on the board: USB chip, LED, regulator`]
  },
  code: [
    {
      title: `A repeatable profile with stage marks`,
      about: `Runs four stages that a profiler can tell apart: the CPU idling for 1.5 s, the CPU busy for 1.5 s, a Wi-Fi scan, then deep sleep for 10 s, after which the board starts again. A marker pin is high while the board is awake, so that the profiler or an analyser can line up the stages.`,
      needs: `An ESP32-family board with Wi-Fi, a profiler or a USB power meter, and a 100 kΩ pull-down resistor from the marker pin to ground.`,
      wiring: [['GPIO4', 'profiler digital input', 'high while the board is awake'], ['GPIO4', '100 kΩ → GND', 'keeps the marker low in deep sleep']],
      blocks: `
        when started
          set pin (4) as [output v]
          set pin (4) to [HIGH v]
          wait (1.5) seconds
          keep the CPU busy for (1.5) seconds :: my
          set [n v] to (scan for Wi-Fi networks)
          turn Wi-Fi off
          set pin (4) to [LOW v]
          deep sleep for (10) seconds
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const int MARK_PIN = 4;                  // high while the board is awake

        void spin(uint32_t ms) {                 // keep the CPU busy
          volatile uint32_t x = 0;
          uint32_t t0 = millis();
          while (millis() - t0 < ms) x = x + 1;
        }

        void setup() {
          pinMode(MARK_PIN, OUTPUT);
          digitalWrite(MARK_PIN, HIGH);
          delay(1500);                           // stage 1: running, doing nothing
          spin(1500);                            // stage 2: the CPU busy
          WiFi.mode(WIFI_STA);
          WiFi.scanNetworks();                   // stage 3: the radio transmits and listens
          WiFi.scanDelete();
          WiFi.mode(WIFI_OFF);
          digitalWrite(MARK_PIN, LOW);
          esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);
          esp_deep_sleep_start();                // stage 4: asleep for 10 s, then setup() runs again
        }

        void loop() {}
      `,
      py: String.raw`
        import machine
        import network
        import time

        mark = machine.Pin(4, machine.Pin.OUT, value=1)   # high while the board is awake

        def spin(ms):                                     # keep the CPU busy
            t0 = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), t0) < ms:
                pass

        time.sleep_ms(1500)                               # stage 1: running, doing nothing
        spin(1500)                                        # stage 2: the CPU busy
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.scan()                                       # stage 3: the radio transmits and listens
        wlan.active(False)
        mark.value(0)
        machine.deepsleep(10000)                          # stage 4: asleep for 10 s, then main.py starts again
      `,
      output: `
        the profile: ~1.5 s low current, ~1.5 s higher, a scan with bursts, then 10 s of microamps
        the marker is high for about 5 s and low for the 10 s of sleep
      `,
      notes: [`The marker pin floats in deep sleep unless something holds it: the pull-down keeps the trace clean. The pin states of the board are the subject of [[pins-at-boot]].`, `Run it on a bare module and on a development board: the sleep floor of the board, with its USB chip, is usually far above the chip's own figure ([[the-board-is-not-the-chip]]).`]
    }
  ],
  examples: [
    {
      title: `What each instrument would tell you`,
      q: `A node sleeps 60 s at 10 µA and wakes for 0.5 s at 120 mA. What is its average current, and what does a multimeter on its µA range (reading the sleep floor) predict for a 2000 mAh cell?`,
      steps: [`Average: $(120 \\times 0.5 + 0.01 \\times 60)/60.5 = 1.0$ mA.`, `Battery life from the true average: $2000 / 1.0 \\approx 2000$ h, about 83 days.`, `The multimeter's floor of 0.01 mA gives $2000 / 0.01 = 200\\,000$ h: it is 100 times too optimistic, because it never saw the wake.`],
      a: `The true average is about 1 mA (about 83 days on 2000 mAh); the sleep reading alone predicts a hundred times too much.`
    }
  ],
  formulas: [
    {
      name: `Average current of a wake-sleep cycle`,
      expr: 'Iavg = (Iw*tw + Is*ts)/(tw + ts)',
      tex: 'I_{\\mathrm{avg}} = \\frac{I_{\\mathrm{w}}\\,t_{\\mathrm{w}} + I_{\\mathrm{s}}\\,t_{\\mathrm{s}}}{t_{\\mathrm{w}} + t_{\\mathrm{s}}}',
      vars: {
        Iavg: { name: 'average current', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{avg}}' },
        Iw: { name: 'current while awake', q: 'current', unit: 'mA', value: 120, tex: 'I_{\\mathrm{w}}' },
        tw: { name: 'time awake', q: 'time', unit: 's', value: 0.5, tex: 't_{\\mathrm{w}}' },
        Is: { name: 'current asleep', q: 'current', unit: 'µA', value: 10, tex: 'I_{\\mathrm{s}}' },
        ts: { name: 'time asleep', q: 'time', unit: 's', value: 60, tex: 't_{\\mathrm{s}}' }
      },
      note: `This treats the awake period as one steady current. A real wake has stages (boot, connect, transmit): a profiler gives the charge of the whole stage, which replaces the product of the first term.`,
      stories: { Iavg: `A node draws {Iw} for {tw} and then {Is} for {ts}. What is its average current?` },
      practice: { unknowns: ['Iavg', 'ts'] }
    }
  ],
  quiz: [
    { q: `A node sleeps at 10 µA and uses 120 mA for 0.5 s every 60 s. Roughly what is its average current?`, answer: 1, unit: 'mA', why: `(120 × 0.5 + 0.01 × 60) / 60.5 is about 1 mA. The wake supplies 99 % of the charge.` },
    { q: `A USB power meter with 1 mA resolution reads 0.000 A while an ESP32 board sleeps. What does this prove?`, choices: ['The board draws nothing', 'The board draws less than about half a milliamp, which says little about microamps', 'The meter is broken', 'The board is in light sleep'], a: 1, why: `The display rounds anything below its resolution to zero. Sleep currents are tens of microamps; the meter cannot tell them from nothing.` },
    { q: `Why can a multimeter on its microamp range stop a node from waking up properly?`, choices: ['It is too accurate', 'Its burden voltage sags the rail when the current rises at wake-up, causing a brown-out', 'It draws power from the node', 'It only works when asleep'], a: 1, why: `That range has a resistance of hundreds of ohms: at tens of milliamps it drops volts, and the chip resets.` },
    { q: `A single reading of the sleep current is enough to estimate the battery life of a node that wakes once a minute.`, a: false, why: `The wake-up usually takes most of the charge. Without the charge of the awake stages the estimate can be wrong by a factor of ten or more.` }
  ],
  applications: [
    `Verifying a battery node's average current before trusting its battery-life estimate ([[battery-life-budget]]).`,
    `Finding the stage of a wake cycle that costs the most: boot, Wi-Fi connection or transmission ([[deep-sleep]]).`,
    `Spotting a regulator or a power LED that sets the sleep floor of a development board.`,
    `Measuring the awake draw of a USB- or mains-powered device with a USB meter.`
  ],
  sources: [
    `Nordic Semiconductor, Power Profiler Kit II user guide; Joulescope and Otii documentation.`,
    `Espressif, ESP32 series datasheets: current consumption in the active, light-sleep and deep-sleep modes.`,
    `Hyper ESP32: measuring what it really draws, and the battery-life budget.`
  ],
  sim: 'bi-profile'
},

/* ================================================================ USB-serial adapters */
{
  id: 'usb-serial-adapters',
  parent: 'bench-instruments',
  title: 'USB-serial adapters',
  level: 1,
  short: `A small board that turns a USB port into a 3.3 V serial line. It programs bare modules, shows the console of boards without USB, and reads other devices' serial output. The one rule: 3.3 V logic, never 5 V, and crossed TX and RX.`,
  keywords: ['USB-serial adapter', 'USB to UART', 'FTDI', 'CP2102', 'CH340', 'FT232', 'TTL serial', '3.3 V', '5 V', 'TX RX crossed', 'DTR RTS', 'auto-reset', 'console', 'programmer', 'ESP-01'],
  prereq: ['the-multimeter', 'serial-communication-basics', 'three-volt-logic'],
  related: ['usb-serial-bridges-and-auto-reset', 'drivers-and-serial-ports', 'flashing-and-esptool', 'uart-on-the-esp', 'boot-modes-and-download-mode', 'esp-01-and-esp-12', 'the-logic-analyser'],
  body: `Many ESP boards have a USB-serial chip built in. A bare module, an ESP-01, a board without a USB connector or a device whose console you want to read do not, and for them you plug in a small separate board: a **USB-serial adapter**. On the USB side it is a virtual serial port on your computer; on the other it has TX, RX, GND and usually a 3.3 V and a 5 V supply pin.

### What you do with one
Program a bare module with esptool ([[flashing-and-esptool]]); watch the console of a board whose USB port is a power connector only; read the serial output of another device's debug port; or test a UART by reading what you send. Chips commonly found on the boards: Silicon Labs' CP210x, WCH's CH340 and CH343, and FTDI's FT232 and FT231X. Newer ESP chips (S3, C3, C6) have a USB serial port inside and need none.

### The wiring that never changes
- **TX of the adapter to RX of the ESP, and RX of the adapter to TX of the ESP.** Crossed, not straight: the commonest first-try failure.
- **Grounds joined.** Without a common ground the voltages mean nothing.
- **3.3 V logic.** The ESP's pins are not 5 V tolerant ([[three-volt-logic]]). Some adapters switch their logic level with a jumper or solder bridge: set it to 3.3 V *before* connecting, and measure with a meter if the board is unmarked.
- **Power the ESP separately if it transmits.** The adapter's 3.3 V pin is a small regulator, good for tens of milliamps. A Wi-Fi burst of 300 mA browns it out, and the board resets in the middle of the upload ([[brownout]]).

### Programming a bare module
Esptool must reset the chip into download mode: GPIO0 low while EN is released. A development board does this with the adapter's DTR and RTS lines and two transistors ([[usb-serial-bridges-and-auto-reset]]). With a bare adapter you wire DTR and RTS likewise, or do it by hand: hold GPIO0 to ground, tap EN to ground, start the upload.

### Speed
115200 baud is the console default. Uploads run faster, up to several hundred thousand or a couple of million baud depending on the adapter; if an upload fails halfway, lower the speed first.

> [!key] An adapter is TX to RX, RX to TX, a common ground and 3.3 V logic. Power a radio board from its own supply, not from the adapter's weak regulator.`,
  ideas: [
    `A USB-serial adapter gives a bare module or a board without USB a console and a programming port.`,
    `Wire TX to RX and RX to TX, join the grounds, and use 3.3 V logic: never 5 V.`,
    `The adapter's own 3.3 V pin cannot supply a Wi-Fi burst: power the board separately.`,
    `A bare module enters download mode with GPIO0 low at reset, by DTR and RTS or by hand.`
  ],
  pitfalls: [
    `TX goes to TX, like with like — The adapter's TX is its output and must meet the ESP's RX input. Straight connection leaves two outputs fighting and nothing heard.`,
    `The 5 V setting is fine, the ESP will cope — The ESP's pins are damaged by 5 V signals, slowly or at once. Set the level to 3.3 V first.`,
    `An upload that dies halfway is the adapter's fault — Often the supply sags at a Wi-Fi burst, or the baud rate is too high for the cable. Power the board separately and drop the speed.`
  ],
  terms: [
    { term: `USB-serial adapter`, also: ['USB-to-UART', 'USB-TTL', 'FTDI cable'], def: `A device that appears as a serial port on a computer and gives TX, RX and ground pins at logic level, used to program and talk to boards without their own USB port.` },
    { term: `TTL serial`, also: ['UART level', '3.3 V serial'], def: `Serial data as plain logic levels, 0 V and 3.3 V or 5 V, as opposed to the plus and minus voltages of RS-232. Check which supply voltage it means.` },
    { term: `DTR and RTS`, also: ['modem control lines'], def: `Two spare output lines of a serial adapter. On ESP boards two transistors turn them into the EN and GPIO0 signals that reset the chip into download mode.` },
    { term: `Virtual COM port`, also: ['COM port', 'ttyUSB'], def: `The serial port that a USB-serial chip's driver creates on the computer. It appears as COMn on Windows and /dev/ttyUSBn or /dev/ttyACMn on Linux.` }
  ],
  choose: {
    good: [`A 3.3 V adapter with DTR and RTS broken out for bare modules`, `A spare adapter on the bench for consoles of boards without USB`, `One with a logic-level switch, clearly marked`],
    avoid: [`An adapter fixed at 5 V logic`, `Using its 3.3 V pin to power a Wi-Fi board`, `Unbranded adapters with no driver you can trust`],
    check: [`The logic level, with a meter on the TX pin`, `That TX and RX are crossed`, `Its supported baud rates and driver for your computer`]
  },
  code: [
    {
      title: `Print what arrives from the adapter`,
      about: `Listens on a second UART and prints every byte that arrives as its code and character. Wire an adapter to it, type in a terminal on the computer, and the ESP shows what it received: a quick test of the wiring, the level and the baud rate.`,
      needs: `An ESP32 DevKit and a USB-serial adapter set to 3.3 V. Its TX goes to GPIO16 and its ground to GND. Open the adapter's port in a terminal at 9600 baud.`,
      wiring: [['adapter TX', 'GPIO16', 'the ESP receives on UART1'], ['adapter GND', 'GND', 'always joined']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on TX (17) RX (16)
        forever
          if <data available on UART (1)> then
            set [b v] to (read byte from UART (1))
            print (join (hex of (b)) [ ])
          end
        end
      `,
      cpp: String.raw`
        const int RX_PIN = 16, TX_PIN = 17;

        void setup() {
          Serial.begin(115200);
          Serial1.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);   // the baud rate of the device you listen to
        }

        void loop() {
          while (Serial1.available()) {
            int b = Serial1.read();
            Serial.printf("%02X %c\n", b, (b >= 32 && b < 127) ? b : '.');
          }
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        uart = UART(1, baudrate=9600, tx=17, rx=16)       # the baud rate of the device you listen to

        while True:
            if uart.any():
                for b in uart.read():
                    print("%02X %s" % (b, chr(b) if 32 <= b < 127 else "."))
            time.sleep_ms(10)
      `,
      output: `
        48 H
        69 i
        0D .
        0A .
      `,
      notes: [`Typing Hi and Enter in the terminal sends 48, 69, 0D and sometimes 0A, depending on the terminal's line-ending setting.`, `Characters that look like noise (a run of FF, or random symbols) usually mean that the two baud rates differ: change the terminal's until the text is clean.`]
    }
  ],
  examples: [
    {
      title: `Why does the upload stop at 30 %?`,
      q: `A bare ESP32 module is wired to an adapter, taking its 3.3 V from the adapter's pin. The upload starts and fails after a few seconds, always at about the same percentage. What do you check first?`,
      steps: [`A failure partway through is not a wiring error: the first bytes got through.`, `During the upload the chip runs the flash writes with the CPU and radio idle, and the draw rises: the adapter's small regulator sags.`, `Power the module from a stronger 3.3 V source (join the grounds), and then lower the upload speed if it persists.`],
      a: `The supply: power the module separately, keep the grounds joined, then lower the baud rate.`
    }
  ],
  quiz: [
    { q: `You connect adapter TX to ESP TX and adapter RX to ESP RX. What do you see on the console?`, choices: ['The normal output', 'Nothing: two outputs meet and two inputs meet', 'Garbage', 'The ESP resets'], a: 1, why: `Each line needs one driver and one receiver. The adapter's TX must go to the ESP's RX.` },
    { q: `An adapter has a 3.3 V and 5 V logic switch. A 5 V setting on an ESP32's RX pin...`, choices: ['is the normal choice', 'exceeds what the pin tolerates and can damage it', 'only matters at high baud rates', 'is needed for programming'], a: 1, why: `The ESP32's pins are not 5 V tolerant. Always select 3.3 V.` },
    { q: `Why can an adapter's own 3.3 V pin fail to power a Wi-Fi board?`, choices: ['It is 3.0 V', 'It is a small regulator that cannot supply a transmit burst of a few hundred milliamps', 'It is AC', 'It is only for LEDs'], a: 1, why: `The burst current sags the adapter's regulator and the module browns out and resets.` },
    { q: `Two devices joined only by TX and RX lines, with no common ground, will communicate reliably.`, a: false, why: `Logic levels are voltages measured against ground. Without a common ground the receiver has no reference.` }
  ],
  applications: [
    `Programming a bare ESP32 module or an ESP-01 on a breadboard ([[esp-01-and-esp-12]]).`,
    `Reading the boot log of a board whose USB port only carries power ([[reading-boot-messages]]).`,
    `Listening to the debug port of a GPS receiver, a modem or another microcontroller.`,
    `Using a second adapter as a serial monitor while the first programs the board.`
  ],
  sources: [
    `Datasheets of the USB-serial chips: Silicon Labs CP2102 and CP2104, WCH CH340, FTDI FT232R.`,
    `Espressif, esptool documentation: the serial interface and the boot mode selection.`,
    `Espressif, ESP32 series datasheets: strapping pins, the supply range and the pin voltage limits.`
  ]
},
/* ================================================================ signal generators */
{
  id: 'signal-generators',
  parent: 'bench-instruments',
  title: 'Signal generators',
  level: 2,
  short: `A generator makes the signal you want to test with: a clean square wave for a counter, a sine for a filter, a sweep to find a resonance. Dedicated generators, cheap synthesiser modules and the ESP's own PWM and DAC cover different ranges.`,
  keywords: ['signal generator', 'function generator', 'DDS', 'AD9833', 'arbitrary waveform', 'sweep', 'square wave', 'sine wave', 'amplitude', 'DC offset', '50 ohm output', 'high impedance', 'LEDC', 'DAC', 'test signal', 'AC coupling', 'bias'],
  prereq: ['the-oscilloscope', 'pwm-with-ledc', 'three-volt-logic'],
  related: ['esp-as-a-signal-generator', 'dac-output', 'rc-filters-and-debounce', 'pulse-counter-pcnt', 'voltage-dividers-for-inputs', 'measuring-frequency-and-time', 'electronics:ac-signals'],
  body: `A scope and an analyser show what a circuit does. A generator makes the signal to show it with: a square wave at a known frequency to check a counter, a sine to see the corner of a filter, a slow sweep to find where a resonance sits, a pulse train to exercise an interrupt.

### What is available
A **function generator** makes sine, square and triangle waves at an adjustable frequency, amplitude and DC offset. Most modern ones are DDS (direct digital synthesis) machines: a table of the waveform is played out through a fast converter, which gives exact frequencies and an arbitrary shape if you can draw one. Low-cost DDS modules built on chips such as the AD9833, set over SPI by a microcontroller, give a sine, triangle or square from a fraction of a hertz to some megahertz. A computer's sound card is a generator and scope for audio frequencies. And the ESP itself can generate: the LEDC peripheral makes square waves from hertz to a few megahertz at the price of shrinking duty resolution ([[pwm-with-ledc]]); the ESP32 and ESP32-S2 also have an 8-bit DAC for audio-range waves ([[dac-output]]).

### The 50 Ω trap
A bench generator has an output resistance of 50 Ω, and its panel assumes that it feeds a 50 Ω load: a "2 V peak-to-peak" setting is 2 V across 50 Ω. An ESP pin or a scope input is a *high-impedance* load: nothing drops across the output resistance and the real amplitude is **twice** the setting, and so is the offset. Many generators have a menu setting for the load; check it, and look at the signal on a scope before you connect it to a pin.

### What an ESP pin can take
A GPIO input accepts about 0 to 3.3 V ([[three-volt-logic]]); below ground or above the supply a protection diode conducts. A generator set to a ±2 V sine is out of range on both sides. Make the wave positive-only (offset equal to half the peak-to-peak) and no larger than 3.3 V, or couple an audio signal through a capacitor into a bias divider, two equal resistors from 3V3 to ground that hold the pin at the middle of the range ([[voltage-dividers-for-inputs]]).

### Where a generator earns its place
Testing a filter by sweeping through its corner; checking a frequency counter or the pulse counter against a known frequency ([[pulse-counter-pcnt]]); feeding an ADC or I2S input a pure tone to see the noise; simulating a flow sensor or a tachometer.

> [!key] A generator makes the test signal. Set the load impedance, keep the signal inside 0 to 3.3 V for an ESP pin, and look at it on a scope first. For slow squares and sweeps the ESP's own LEDC does the job.`,
  ideas: [
    `A function generator makes sine, square and triangle waves with adjustable frequency, amplitude and offset; DDS modules and the ESP's PWM and DAC are cheaper sources.`,
    `A 50 Ω generator driving a high-impedance input shows twice its set amplitude and offset.`,
    `An ESP pin accepts roughly 0 to 3.3 V: make the signal positive-only or bias it through a capacitor.`,
    `LEDC makes square waves up to some megahertz, but the duty resolution falls as the frequency rises.`
  ],
  pitfalls: [
    `The generator says 2 V, so the pin gets 2 V — Into a high-impedance input the output is twice the setting. A 2 V peak-to-peak sine with 1 V offset reaches 4 V and damages the pin.`,
    `A sine from the generator can go straight to the ADC — The ADC sees only 0 to about 3.3 V. A zero-centred sine needs coupling and a bias to the middle of the range.`,
    `PWM from the ESP is a sine if I filter it a bit — A single RC filter leaves large ripple; it is a rough analogue level, not a clean sine.`
  ],
  terms: [
    { term: `Function generator`, also: ['signal generator', 'waveform generator'], def: `An instrument that outputs a repeating waveform, usually a sine, square or triangle, with adjustable frequency, amplitude and DC offset.` },
    { term: `DDS`, also: ['direct digital synthesis', 'AD9833'], def: `A method of making a waveform by stepping through a stored table at a fast fixed clock and converting it to a voltage. The step size sets the frequency with fine resolution.` },
    { term: `DC offset`, also: ['offset'], def: `A constant voltage added to a signal so that it swings around a chosen centre instead of around zero.` },
    { term: `Output impedance`, also: ['source resistance', '50 Ω output'], def: `The resistance in series with a generator's output. With a load of the same value the voltage halves; with a high-impedance load it does not, so the signal is double the labelled amplitude.` }
  ],
  choose: {
    good: [`The ESP's LEDC for a quick square wave or a sweep`, `A DDS module (AD9833 class) for a sine at a fixed or stepped frequency`, `A bench function generator when you need level accuracy and a sweep`],
    avoid: [`A zero-centred wave into a GPIO`, `Trusting the panel amplitude into a high-impedance input`, `Using the ESP DAC above audio frequencies`],
    check: [`The load setting and the real level on the scope`, `That the signal stays between 0 and 3.3 V at the pin`, `The generator's frequency range and amplitude accuracy`]
  },
  code: [
    {
      title: `A frequency sweep from the ESP`,
      about: `Makes a square wave of 50 % duty on a pin and steps its frequency from 100 Hz to 20 kHz, ten steps per decade, half a second at each, printing the frequency. Feed it to a filter, a speaker or a frequency counter and watch what happens as it passes through.`,
      needs: `An ESP32 DevKit and, as the load to test, an RC filter or a small speaker with a series resistor, on GPIO4. The scope or counter goes on the same pin.`,
      wiring: [['GPIO4', 'the circuit under test or the scope probe', 'a 3.3 V square wave'], ['GND', 'the circuit and the probe ground']],
      blocks: `
        when started
          start serial at (115200) baud
          set PWM on pin (4) frequency (100) resolution (10)
          set PWM on pin (4) to (512)
          set [f v] to (100)
        forever
          set PWM on pin (4) frequency (f) resolution (10)
          set PWM on pin (4) to (512)
          print (join [Hz: ] (round (f)))
          wait (0.5) seconds
          set [f v] to ((f) * (1.2589))
          if <(f) > (20000)> then
            set [f v] to (100)
          end
        end
      `,
      cpp: String.raw`
        const int PIN = 4;
        const int BITS = 10;                         // 14 bits or fewer works on every chip

        void setup() {
          Serial.begin(115200);
          ledcAttach(PIN, 100, BITS);                // start at 100 Hz
          ledcWrite(PIN, 512);                       // 512 / 1024 = 50 % duty
        }

        void loop() {
          for (float f = 100; f <= 20000; f *= 1.2589) {   // ten steps per decade
            ledcChangeFrequency(PIN, (uint32_t)f, BITS);
            ledcWrite(PIN, 512);
            Serial.printf("Hz: %u\n", (unsigned)f);
            delay(500);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        pwm = PWM(Pin(4), freq=100, duty_u16=32768)  # 50 % duty

        while True:
            f = 100.0
            while f <= 20000:                        # ten steps per decade
                pwm.freq(int(f))
                pwm.duty_u16(32768)
                print("Hz:", int(f))
                time.sleep_ms(500)
                f *= 1.2589
      `,
      output: `
        Hz: 100
        Hz: 125
        Hz: 158
        Hz: 199
      `,
      notes: [`Frequency and duty resolution trade against each other: at 20 kHz a 10-bit duty is still possible on every chip, at a few megahertz only a few bits remain.`, `On a speaker, put a few hundred ohms in series: a GPIO is not a power amplifier ([[pin-current-limits]]).`]
    },
    {
      title: `A staircase sine from the 8-bit DAC`,
      about: `Plays a 32-step sine wave through the DAC pin in an endless loop. The result is an audio-range sine with visible steps: look at it on the scope and then add a simple RC filter to round the steps.`,
      needs: `An ESP32 (the DAC is on GPIO25 and GPIO26) or an ESP32-S2 (GPIO17 and GPIO18); other chips have no DAC. A scope on the DAC pin.`,
      wiring: [['GPIO25', 'scope probe', 'on an ESP32-S2, GPIO17'], ['GND', 'probe ground']],
      blocks: `
        when started
          set [i v] to (0)
        forever
          set DAC pin (25) to ((128) + ((100) * (sin ((360) * ((i) / (32))))))
          change [i v] by (1)
          if <(i) = (32)> then
            set [i v] to (0)
          end
        end
      `,
      cpp: String.raw`
        const int DAC_PIN = 25;                      // the DAC pad: GPIO25 or GPIO26 on an ESP32
        uint8_t table[32];

        void setup() {
          for (int i = 0; i < 32; i++) {
            table[i] = 128 + (int)(100 * sin(2 * PI * i / 32));   // one sine period, 28 to 228
          }
        }

        void loop() {
          for (int i = 0; i < 32; i++) {
            dacWrite(DAC_PIN, table[i]);             // 0 to 255 is 0 V to about 3.3 V
            delayMicroseconds(30);
          }
        }
      `,
      py: String.raw`
        from machine import DAC, Pin
        import math
        import time

        dac = DAC(Pin(25))                           # the DAC pad: GPIO25 or GPIO26 on an ESP32
        table = [128 + int(100 * math.sin(2 * math.pi * i / 32)) for i in range(32)]   # one sine period

        while True:
            for value in table:
                dac.write(value)                     # 0 to 255 is 0 V to about 3.3 V
                time.sleep_us(30)
      `,
      output: `
        scope: a sine with 32 small steps per period, between about 0.36 V and 2.9 V
        C++: about 1 kHz; MicroPython: a few hundred hertz
      `,
      notes: [`The frequency is set by the delay and by the time each call takes: it is not exact. For a precise, higher-frequency sine the chip's hardware cosine generator (ESP-IDF) or an external DDS module is the tool.`, `The output is positive-only, centred at 1.65 V, so it can feed an ADC or a pin safely.`]
    }
  ],
  examples: [
    {
      title: `What does the pin really see?`,
      q: `A bench generator, set for a 50 Ω load, shows 1.5 V peak-to-peak with an offset of 0.75 V. You connect it to an ESP32 input (high impedance). What swing does the pin see, and is it safe?`,
      steps: [`With a high-impedance load there is no drop in the 50 Ω output resistance: the amplitude doubles, to 3.0 V peak to peak.`, `The offset doubles too, to 1.5 V.`, `The wave swings from 1.5 − 1.5 = 0 V to 1.5 + 1.5 = 3.0 V: inside 0 to 3.3 V, so it is safe, with 0.3 V to spare.`],
      a: `3.0 V peak to peak, from 0 V to 3.0 V: safe, but only just; the setting was chosen well and the doubling was the trap.`
    }
  ],
  quiz: [
    { q: `A generator set for a 50 Ω load displays 1 V peak-to-peak. A high-impedance scope input shows...`, choices: ['0.5 V', '1 V', '2 V', '0 V'], a: 2, why: `Without a 50 Ω load no voltage drops in the generator's output resistance, so the output is twice the labelled value.` },
    { q: `You want to apply an audio sine from a generator to an ESP32 ADC pin. What is the right way?`, choices: ['Connect it directly with zero offset', 'Couple it through a capacitor into a pin biased to half the supply, with an amplitude inside 3.3 V', 'Use 5 V amplitude and trust the clamp diodes', 'Raise the frequency'], a: 1, why: `The ADC measures only positive voltages up to about 3.3 V. The capacitor passes the AC and the divider holds the middle of the range.` },
    { q: `Why use 14 bits or fewer for an LEDC sweep in a program meant for any ESP32 chip?`, choices: ['The chips differ: the S2, S3, C3 and C2 timers are 14 bits wide', 'It is faster', 'MicroPython requires it', 'To save RAM'], a: 0, why: `The LEDC timer is 20 bits on some chips and 14 on others; a program with 14 bits or fewer runs on all.` },
    { q: `A single RC filter turns a PWM output into a clean sine.`, a: false, why: `It smooths a PWM wave into a slowly varying level, leaving ripple at the PWM frequency; shape and purity need more filtering or a DAC.` }
  ],
  applications: [
    `Sweeping a filter, a buzzer or a speaker to find where it responds ([[rc-filters-and-debounce]]).`,
    `Checking a frequency counter and the pulse counter against a known source.`,
    `Feeding an ADC or I2S input a pure tone to measure the noise floor.`,
    `Simulating a tachometer or a flow-sensor pulse train for firmware tests.`
  ],
  sources: [
    `Datasheet of the AD9833 programmable waveform generator.`,
    `Espressif, ESP-IDF Programming Guide: LEDC and the DAC drivers, including the timer resolution of each chip.`,
    `Function generator manuals: output impedance and the load setting.`
  ],
  sim: 'bi-generator'
},

/* ================================================================ spectrum analysers and VNAs */
{
  id: 'spectrum-analysers-and-vnas',
  parent: 'bench-instruments',
  title: 'Spectrum analysers and antenna analysers',
  level: 3,
  short: `A spectrum analyser shows what is on the air, frequency by frequency. A vector network analyser (a NanoVNA, for example) shows how well an antenna matches its feed. Both are receive-side hobby instruments; transmitting test signals is regulated.`,
  keywords: ['spectrum analyser', 'TinySA', 'VNA', 'NanoVNA', 'LiteVNA', 'S11', 'return loss', 'VSWR', 'SWR', 'antenna match', 'resolution bandwidth', 'RBW', 'peak hold', 'calibration', 'short open load', '2.4 GHz band'],
  prereq: ['radio-basics', 'decibels-and-dbm', 'pcb-antennas', 'the-oscilloscope'],
  related: ['matching-and-tuning', 'interference-and-channels', 'antenna-placement-and-enclosures', 'transmit-power-and-regulations', 'wifi-and-ble-analysers', 'electronics:reflections-matching', 'electronics:antennas'],
  body: `The radio of an ESP is invisible: no meter shows it. Two instruments make it visible. A **spectrum analyser** plots power against frequency, so you see which Wi-Fi channels are busy, where a Bluetooth LE advertisement falls and whether a design leaks noise. A **vector network analyser** (VNA) sends a small test signal through a cable to an antenna, measures how much comes back, and plots that as a curve over frequency.

### The spectrum analyser
In the 2.4 GHz band an ESP's Wi-Fi channels are 20 MHz wide humps spaced 5 MHz apart (channel 1 at 2412 MHz, channel 6 at 2437 MHz, channel 11 at 2462 MHz); BLE advertises as narrow 2 MHz spikes at 2402, 2426 and 2480 MHz; Zigbee uses 5 MHz channels between 2405 and 2480 MHz. The settings that matter: the **centre and span** (what part of the band), the **resolution bandwidth** (RBW, how narrow each looking window is: a narrow one lowers the noise floor and takes longer to sweep) and **peak hold**, which keeps the highest value seen and so shows bursty Wi-Fi. Hobby instruments such as the TinySA family are inexpensive; check the frequency range, since the basic model does not reach 2.4 GHz and the Ultra model does.

### The antenna analyser
A VNA measures **S11**, the part of the test signal reflected from the antenna. At the antenna's resonance almost everything is accepted and the reflection falls to a dip. The depth is the **return loss**: −10 dB means 10 % of the power comes back (a VSWR of 1.9 to 2 : 1), −20 dB means 1 %. Rule of thumb: −10 dB across the band is a usable match; the dip should sit on 2.44 GHz. A VNA must be **calibrated** with a short, an open and a load at the end of its cable before every session, and it must reach the frequency: many cheap models stop at 900 MHz or 1.5 GHz, while others such as the NanoVNA V2 and the LiteVNA go to 3 GHz or beyond.

### What you learn
A PCB antenna's dip moves when the board is put in a case, held in a hand or placed near metal ([[antenna-placement-and-enclosures]]). A match measured on the bare board does not hold in the product. A VNA is how you retune ([[matching-and-tuning]]).

> [!warn] A VNA and the generator of a spectrum analyser transmit. At the low levels of a VNA, into a cable and a load, they are conducted tests; radiating them from an antenna is regulated. Check your country's rules ([[transmit-power-and-regulations]]). Soldering a coaxial lead to a module's antenna feed ends its certification: do it on a test board.

> [!key] A spectrum analyser shows what is on the air; a VNA shows how much of the transmitter's power an antenna sends back. Calibrate it, look for a −10 dB dip on your band, and measure in the final enclosure.`,
  ideas: [
    `A spectrum analyser plots power against frequency and shows busy channels and leaks; resolution bandwidth trades noise floor against sweep time.`,
    `A VNA measures S11: the dip of the return-loss curve marks the antenna's resonance.`,
    `A return loss of 10 dB means 10 % reflected; the match is usable across the band when the curve stays below −10 dB.`,
    `The resonance moves with a case, a hand or nearby metal: measure the final assembly.`
  ],
  pitfalls: [
    `The VNA shows −15 dB, so the antenna is efficient — A good match means little power is reflected, not that it radiates well. A resistive load matches perfectly and radiates nothing.`,
    `A VNA can be used straight from the box — Without a short, open and load calibration at the end of the cable the curve is wrong, sometimes by many decibels.`,
    `Any cheap analyser covers 2.4 GHz — Many stop at a few hundred megahertz or at 1.5 GHz. Check the range before buying.`
  ],
  terms: [
    { term: `S11`, also: ['return loss', 'reflection coefficient'], def: `The fraction of a test signal reflected from the input of an antenna, expressed in decibels. A lower value (more negative) means a better match.` },
    { term: `VSWR`, also: ['SWR', 'voltage standing wave ratio'], def: `A measure of mismatch: 1 : 1 is perfect, 2 : 1 is the usual limit for an acceptable antenna, and larger values mean more reflected power.` },
    { term: `Resolution bandwidth`, also: ['RBW'], def: `The width of the frequency window a spectrum analyser looks through at each point. A narrow one separates close signals and lowers the noise floor, but sweeps more slowly.` },
    { term: `Peak hold`, also: ['max hold'], def: `A spectrum analyser mode that keeps the highest value seen at each frequency, so that bursty signals such as Wi-Fi leave a visible trace.` },
    { term: `Calibration`, also: ['SOL calibration', 'short open load'], def: `Measuring three known terminations at the end of the VNA's cable so that the instrument can remove the cable's effect from later measurements.` }
  ],
  choose: {
    good: [`A VNA reaching 3 GHz for the match of 2.4 GHz antennas`, `A hobby spectrum analyser for seeing busy channels and leaks`, `Measuring the antenna in its final enclosure`],
    avoid: [`Transmitting test signals from an antenna without checking the rules`, `A VNA that stops below your band`, `Judging an antenna by its match alone`],
    check: [`The instrument's frequency range`, `That the cable and calibration are fresh`, `That the measurement is made on the assembled product`]
  },
  examples: [
    {
      title: `How much power comes back?`,
      q: `A VNA shows a return loss of 10 dB at 2.44 GHz. What fraction of the power is reflected, and what is the VSWR?`,
      steps: [`Reflection coefficient: $\\Gamma = 10^{-10/20} = 0.316$.`, `Power reflected: $\\Gamma^2 = 0.10$, that is 10 %.`, `VSWR: $(1 + 0.316)/(1 - 0.316) = 1.92$.`],
      a: `10 % of the power is reflected; the VSWR is about 1.9 : 1.`
    }
  ],
  formulas: [
    {
      name: `VSWR from return loss`,
      expr: 'VSWR = (1 + 10^(-RL/20))/(1 - 10^(-RL/20))',
      tex: '\\mathrm{VSWR} = \\frac{1 + 10^{-\\mathrm{RL}/20}}{1 - 10^{-\\mathrm{RL}/20}}',
      vars: {
        VSWR: { name: 'voltage standing wave ratio', tex: '\\mathrm{VSWR}', min: 1 },
        RL: { name: 'return loss', q: 'gain', unit: 'dB', value: 10, min: 0.1, tex: '\\mathrm{RL}' }
      },
      note: `The return loss is the positive number of decibels by which the reflected signal is below the test signal. At 10 dB the VSWR is 1.9; at 20 dB it is 1.2.`,
      stories: { VSWR: `An antenna shows a return loss of {RL}. What is its VSWR?` },
      practice: { unknowns: ['VSWR', 'RL'] }
    }
  ],
  quiz: [
    { q: `An antenna shows a return loss of 20 dB at its centre frequency. What fraction of the power is reflected?`, choices: ['20 %', '10 %', '1 %', '0.1 %'], a: 2, why: `20 dB is a power ratio of 100: one hundredth, 1 %, is reflected.` },
    { q: `A module's PCB antenna shows its dip at 2.44 GHz on the bare board. In a plastic case the dip moves to 2.35 GHz. What do you do?`, choices: ['Nothing, the dip exists', 'Measure and retune in the final enclosure', 'Raise the transmit power', 'Change the channel'], a: 1, why: `The case detunes the antenna. Retune (shorten the element or change the match) with the product assembled.` },
    { q: `Which setting of a spectrum analyser lowers its noise floor at the cost of a slower sweep?`, choices: ['A wider span', 'A narrower resolution bandwidth', 'Peak hold', 'A higher reference level'], a: 1, why: `A narrower RBW admits less noise power, so weak signals stand out, but each point needs more time.` },
    { q: `A perfect match (low S11) proves that an antenna radiates efficiently.`, a: false, why: `Match says that little power is reflected. A lossy antenna or a resistor also matches well and radiates nothing.` }
  ],
  applications: [
    `Checking the match of a PCB or external antenna at 2.4 GHz before certification ([[module-certification]]).`,
    `Seeing which Wi-Fi channels are busy before choosing one ([[interference-and-channels]]).`,
    `Finding noise from a switching regulator or display that leaks into the radio band.`,
    `Measuring the effect of an enclosure, a battery or a hand on the antenna.`
  ],
  sources: [
    `Documentation of the NanoVNA project and of TinySA: frequency ranges and calibration.`,
    `Espressif, Hardware Design Guidelines for the ESP32 series: antenna matching and layout.`,
    `IEEE 802.11 and IEEE 802.15.4 standards: channel plans in the 2.4 GHz band.`
  ],
  sim: 'bi-vna'
},

/* ================================================================ Wi-Fi and Bluetooth analyser apps */
{
  id: 'wifi-and-ble-analysers',
  parent: 'bench-instruments',
  title: 'Wi-Fi and Bluetooth analyser apps',
  level: 1,
  short: `A phone app can show the Wi-Fi networks and Bluetooth LE advertisers around you with their channels and signal strengths. For choosing a channel or checking a BLE device it is the quickest tool there is, and it listens passively.`,
  keywords: ['Wi-Fi analyser', 'WiFi analyzer', 'nRF Connect', 'LightBlue', 'BLE scanner', 'RSSI', 'channel', 'site survey', 'advertising', 'passive scan', 'Android', 'iOS', 'Wireshark', 'monitor mode', 'beacon'],
  prereq: ['wifi-scanning', 'ble-advertising', 'rssi-and-signal-quality'],
  related: ['interference-and-channels', 'wifi-troubleshooting', 'ble-beacons', 'esp-as-a-network-scanner', 'spectrum-analysers-and-vnas', 'wifi-security'],
  body: `Before you reach for any instrument, a phone already in your pocket can show most of what matters about the radio around a project. Wi-Fi analyser and Bluetooth scanner apps are small receivers with a list and a graph.

### Wi-Fi analysers
An app lists every network in range with its **channel**, its signal strength in **dBm** and its security, and draws the 2.4 GHz band as overlapping humps. It uses only the beacons that access points broadcast publicly: it is passive listening, and it never joins anything. Uses: choosing the quietest channel for your own access point (in the 2.4 GHz band only channels 1, 6 and 11 do not overlap at 20 MHz width); walking around with the phone to see how the signal of your access point falls with distance and walls; checking whether the 5 GHz band is available. On Android such apps work; iPhone apps cannot list nearby networks, so use a laptop tool or an Android phone.

### Bluetooth LE scanners
Apps such as Nordic's nRF Connect and LightBlue list nearby advertisers, with the name, the address, the signal strength and the raw advertising data. Most can then connect, list the services and characteristics and read, write and subscribe to them. When you write a BLE peripheral for an ESP, this is the first client to test it with ([[ble-advertising]], [[gatt]]).

### What it cannot tell you
The phone hears with its antenna, at its position. The ESP has a different antenna on a different board in a different place, and the numbers differ by many decibels. For what the ESP itself sees, make the ESP scan (the program below) and print its own list. A phone app shows nothing of non-Wi-Fi interference such as a microwave oven; a spectrum analyser does ([[spectrum-analysers-and-vnas]]).

### Capturing packets
A laptop with a Wi-Fi adapter that supports monitor mode, running a capture program such as Wireshark, can record the frames of **your own** network for debugging. Capturing the traffic of networks you do not own is unlawful in many places: observe public beacons, never other people's data.

> [!key] A phone app is a passive receiver that shows channels and signal strengths for Wi-Fi and the advertisements of BLE devices. It is the quickest way to choose a channel and to test a BLE peripheral, but it shows the phone's view, not the ESP's.`,
  ideas: [
    `Wi-Fi analyser apps list channels and signal strengths from public beacons; they are passive and join nothing.`,
    `In the 2.4 GHz band only channels 1, 6 and 11 avoid overlap at 20 MHz width.`,
    `A BLE scanner app such as nRF Connect shows advertisements and lets you test a peripheral's services.`,
    `The phone's view differs from the ESP's: let the ESP scan too.`
  ],
  pitfalls: [
    `The phone shows −55 dBm, so the ESP will see −55 dBm — The ESP's antenna, board and position differ from the phone's. Use the app for the pattern, not for the figure.`,
    `Any free channel is a good channel — A neighbouring network on channel 3 overlaps channels 1 to 5. Look at the humps, not at the numbers alone.`,
    `Packet capture is just looking — Capturing on your own network is debugging; capturing other people's traffic can be illegal. Stay with beacons and your own devices.`
  ],
  terms: [
    { term: `Wi-Fi analyser`, also: ['WiFi analyzer', 'site survey app'], def: `A program that lists nearby Wi-Fi networks with their channel and signal strength, usually drawn as humps over the band. It listens passively to beacons.` },
    { term: `BLE scanner`, also: ['nRF Connect', 'LightBlue'], def: `An app that lists nearby Bluetooth LE advertisers with their address, signal strength and advertising data, and can connect to read and write characteristics.` },
    { term: `Monitor mode`, also: ['promiscuous mode', 'sniffing'], def: `A Wi-Fi adapter mode that passes every frame heard on a channel to software, not only those addressed to the computer. Use it only on your own network.` },
    { term: `Site survey`, also: ['signal map'], def: `Measuring signal strength at many points of a building or a site to find dead spots and choose where to place access points.` }
  ],
  choose: {
    good: [`A phone app for choosing a Wi-Fi channel and judging coverage`, `nRF Connect or LightBlue to test a BLE peripheral`, `The ESP's own scan to see what the ESP sees`],
    avoid: [`Reading the phone's dBm as the ESP's`, `Capturing other people's traffic`, `Expecting an app to show non-Wi-Fi interference`],
    check: [`The bands the phone supports (2.4 and 5 GHz)`, `That the scan is passive and on your own network`, `The permission the app needs (location on Android)`]
  },
  code: [
    {
      title: `How busy is each channel? A list from the ESP`,
      about: `Scans for Wi-Fi networks and prints, for each 2.4 GHz channel from 1 to 13, a row of # signs, one for each network heard on it. It is a text version of a Wi-Fi analyser, from the ESP's own antenna.`,
      needs: `Any ESP32-family board with Wi-Fi and the serial monitor at 115200 baud.`,
      blocks: `
        when started
          start serial at (115200) baud
          start Wi-Fi as a station
        forever
          set [networks v] to (scan for Wi-Fi networks)
          for each [n v] in (networks)
            add (channel of (n)) to [count v]
          end
          print the number of networks on each channel 1 to 13 as # signs :: my
          wait (10) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
        }

        void loop() {
          int count[14] = {0};
          int n = WiFi.scanNetworks();               // takes a few seconds
          for (int i = 0; i < n; i++) {
            int ch = WiFi.channel(i);
            if (ch >= 1 && ch <= 13) count[ch]++;
          }
          WiFi.scanDelete();                         // free the result list
          Serial.println("channel  networks");
          for (int ch = 1; ch <= 13; ch++) {
            Serial.printf("%5d    ", ch);
            for (int k = 0; k < count[ch]; k++) Serial.print('#');
            Serial.println();
          }
          delay(10000);
        }
      `,
      py: String.raw`
        import network
        import time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)

        while True:
            count = [0] * 14
            for ssid, bssid, channel, rssi, auth, hidden in wlan.scan():   # takes a few seconds
                if 1 <= channel <= 13:
                    count[channel] += 1
            print("channel  networks")
            for ch in range(1, 14):
                print("%5d    %s" % (ch, "#" * count[ch]))
            time.sleep(10)
      `,
      output: `
        channel  networks
            1    ###
            2
            3    #
            4
            5
            6    #####
        ...
           11    ##
      `,
      notes: [`The channel of a network is its centre; each one also occupies the channels on either side, so read the list together with the overlap rule: a network on channel 3 disturbs 1 to 5.`, `On a chip with 5 GHz Wi-Fi, networks on the higher bands are not counted here: their channel numbers are above 13.`]
    }
  ],
  examples: [
    {
      title: `Choose a channel`,
      q: `A scan shows three networks on channel 1, one on channel 4, five on channel 6 and none on channels 9 to 13. You run your own access point at the default 20 MHz width. Which channel do you choose?`,
      steps: [`Channels overlap when their centres are less than 5 channels apart: channel 4 overlaps 1 and 6.`, `Channels 9 to 13 are empty, and channel 11 overlaps neither the busy channel 6 nor channel 1.`, `Channel 11 is clear and is one of the three non-overlapping channels.`],
      a: `Channel 11.`
    }
  ],
  quiz: [
    { q: `Which 2.4 GHz channels do not overlap at 20 MHz width in most regions?`, choices: ['1, 2, 3', '1, 6, 11', '2, 4, 8', '5, 10, 13'], a: 1, why: `Channel centres are 5 MHz apart and the signal is about 20 MHz wide, so channels must be five apart: 1, 6 and 11.` },
    { q: `Why might the ESP see a network at −75 dBm when your phone shows −58 dBm?`, choices: ['The app is wrong', 'Different antennas, boards and positions', 'Wi-Fi has two signal strengths', 'The ESP only listens to 5 GHz'], a: 1, why: `Each receiver has its own antenna gain, losses and position; use the app for the pattern and the ESP's own scan for the ESP.` },
    { q: `Which can an iPhone app not do?`, choices: ['Scan for BLE advertisers', 'List nearby Wi-Fi networks', 'Connect to a BLE peripheral', 'Show a characteristic value'], a: 1, why: `Apple does not give apps access to nearby Wi-Fi networks. Use an Android phone or a laptop for Wi-Fi scanning.` },
    { q: `Capturing the Wi-Fi packets of your neighbours' networks in monitor mode is always lawful, because the radio waves are public.`, a: false, why: `Their beacons are public; their data is not. Capturing it is unlawful in many places. Use monitor mode only on your own network.` }
  ],
  applications: [
    `Choosing the quietest channel for an access point that your ESP projects will join ([[wifi-troubleshooting]]).`,
    `Testing a BLE peripheral you wrote with nRF Connect before writing a client ([[gatt]]).`,
    `Walking a house to see where the ESP's connection will be weakest ([[range-and-obstacles]]).`,
    `Finding out which BLE devices around you advertise, and how often.`
  ],
  sources: [
    `IEEE 802.11: the channel plan of the 2.4 GHz band and the beacon frame.`,
    `Bluetooth Core Specification: advertising channels 37, 38 and 39.`,
    `Documentation of nRF Connect for Mobile and of the Wi-Fi analyser app you use.`
  ]
},
/* ================================================================ soldering and rework */
{
  id: 'soldering-and-rework',
  parent: 'bench-instruments',
  title: 'Soldering and rework',
  level: 2,
  short: `Most ESP projects end at a soldering iron: header pins on a board, wires to a module, a castellated module onto a carrier. A good joint takes the right temperature, flux and a few seconds; a module with a ground pad needs hot air or a reflow profile.`,
  keywords: ['soldering', 'soldering iron', 'flux', 'hot air', 'reflow', 'reflow profile', 'solder paste', 'SAC305', 'leaded solder', 'cold joint', 'solder bridge', 'desoldering', 'module ground pad', 'moisture sensitive', 'thermocouple', 'rework'],
  prereq: ['module-footprints-and-soldering', 'breadboards-wires-and-connectors', 'the-multimeter'],
  related: ['esd-and-bench-safety', 'what-a-module-adds', 'system-in-package', 'pcb-layout-for-modules', 'clones-and-counterfeits', 'production-testing', 'electronics:measurement'],
  body: `Soldering is a measurement problem as much as a craft: the joint is good when the metal has been hot enough for long enough, and no hotter. Everything on this page is about getting heat to the right place and knowing what temperature actually arrived.

### The iron
Use a temperature-controlled iron with a clean tip, tinned before and after use. Lead-free solder (SAC305, an alloy of tin, silver and copper) melts at 217 to 220 °C, so a tip at about 330 to 350 °C does it; traditional tin-lead (Sn63/Pb37) melts at 183 °C and works with a tip near 300 to 320 °C. Touch the tip to **both** the pad and the pin so that both heat, wait a second, feed the solder to the joint and not to the tip, and remove the solder and then the iron. A good joint is bright, concave and wet to both sides; a dull, grainy blob that did not wet is a **cold joint**, the cause of most intermittent faults. **Flux**, the paste or core that cleans the metal and lets solder flow, is the difference between easy and miserable. Pins on a ground plane draw the heat away: give them more time, not a hotter iron.

### Modules and hot air
An ESP module's castellated edge pads can be soldered with an iron, but many modules also have a large ground pad underneath that no iron reaches. For these use a **hot-air station** (300 to 380 °C at low airflow, with flux and a moved nozzle, preheating the board from below on large boards), a hot plate, or a reflow oven with paste. The module's datasheet gives its permitted reflow profile and peak temperature, and the paste's datasheet gives its own; typical lead-free reflow peaks at 235 to 250 °C ([[module-footprints-and-soldering]]). Many modules and chips are moisture sensitive: one stored open can burst its package in the oven ("popcorning"), so follow the packaging's baking instructions.

### Measure, do not guess
A thermocouple under the board shows what the part sees, and the program below logs it. The two numbers that matter are the **peak** and the **time above liquidus**, which should usually be 30 to 90 seconds.

| Method | Good for | Watch |
|---|---|---|
| Iron | header pins, wires, castellated pads | pads that lift when overheated |
| Hot air | modules with a ground pad, removal | blowing small parts away, melting plastic |
| Hot plate or oven | many boards, fine pitch | the profile and moisture |

> [!warn] Solder fumes come from the flux: work with extraction or an open window. Leaded solder is toxic to handle and unlawful in many products; wash your hands. Tips and hot air burn; wear eye protection when clipping leads. Unplug USB and remove any lithium cell before soldering near a board.

> [!key] Heat both sides of the joint long enough with the right tip temperature and flux, and no more. For modules with a ground pad use hot air or reflow, and check the profile with a thermocouple.`,
  ideas: [
    `Lead-free solder melts at about 217 to 220 °C, tin-lead at 183 °C: set the tip well above, heat both pad and pin, and use flux.`,
    `A dull, grainy joint is a cold joint: it never wetted and fails intermittently.`,
    `Modules with a ground pad need hot air, a hot plate or reflow; follow the module's and the paste's profile.`,
    `Peak temperature and time above liquidus are what a thermocouple log tells you about a reflow.`
  ],
  pitfalls: [
    `More heat makes a better joint — Too hot lifts pads, burns flux and damages parts. The joint needs enough time at the right temperature, not the highest one.`,
    `A joint that looks shiny from above is good — A pin can sit on top of a lump of solder that did not wet. Check from the side, with magnification, and with a continuity test.`,
    `Parts are fine in the oven however they were stored — Moisture-sensitive modules and ICs absorb water; heated fast, it bursts the package. Bake them as instructed first.`
  ],
  terms: [
    { term: `Flux`, also: ['rosin core', 'flux paste'], def: `A chemical that removes oxide from metal surfaces when heated and lets molten solder wet them. Without it solder balls up instead of flowing.` },
    { term: `Reflow profile`, also: ['time above liquidus', 'peak temperature'], def: `The temperature-against-time curve of a soldering process: a preheat, a soak, a short stay above the melting point and a cool-down. The solder paste and the parts each specify limits.` },
    { term: `Cold joint`, also: ['dry joint'], def: `A solder joint that did not fully melt or wet. It looks dull and grainy and conducts poorly or only sometimes.` },
    { term: `Moisture sensitivity level`, also: ['MSL', 'baking', 'popcorning'], def: `A rating of how long a part may stay out of its sealed bag before it must be baked. Absorbed moisture can burst the package in reflow.` },
    { term: `Hot-air station`, also: ['rework station'], def: `A tool that blows a controlled stream of hot air through a nozzle, used to solder and remove surface-mount parts and modules.` }
  ],
  choose: {
    good: [`An iron with a temperature control for pins and wires`, `Hot air or a hot plate for modules with a ground pad`, `A thermocouple log to check a profile`],
    avoid: [`An uncontrolled iron at a high temperature`, `Reflowing moisture-sensitive parts without baking`, `Soldering with unplugged-but-charged lithium cells nearby`],
    check: [`The module's and the paste's reflow profiles`, `That flux and ventilation are in place`, `The ground pad of the module and its footprint`]
  },
  code: [
    {
      title: `Log a reflow or hot-air profile`,
      about: `Reads a thermocouple through a MAX31855 converter module twice a second, prints the temperature and counts the seconds spent above the melting point of lead-free solder. Put the thermocouple on the board or against the module while the hot plate or hot air runs, and read off the peak and the time above liquidus.`,
      needs: `An ESP32 DevKit, a MAX31855 thermocouple module with a K-type thermocouple (rated for the temperature) and the serial monitor at 115200 baud.`,
      wiring: [['MAX31855 VCC', '3V3'], ['MAX31855 GND', 'GND'], ['MAX31855 SCK', 'GPIO18'], ['MAX31855 SO', 'GPIO19', 'the data output: the ESP\'s MISO'], ['MAX31855 CS', 'GPIO5']],
      blocks: `
        when started
          start serial at (115200) baud
          start SPI on SCK (18) MISO (19) MOSI (23)
          set pin (5) as [output v]
          set pin (5) to [HIGH v]
          set [above v] to (0)
        forever
          set [word v] to (read a 32-bit word from SPI with CS (5))
          if <((word) and (0x10000)) ≠ (0)> then
            print [thermocouple fault]
          else
            set [temp v] to (((word) shifted right by (18)) * (0.25))
            if <(temp) > (217)> then
              change [above v] by (0.5)
            end
            print (join (temp) (join [ C, seconds above 217 C: ] (above)))
          end
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>

        const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23, PIN_CS = 5;
        const float LIQUIDUS = 217.0;              // lead-free solder (SAC305) melts at about 217 to 220 C
        float secondsAbove = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_CS, OUTPUT);
          digitalWrite(PIN_CS, HIGH);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
        }

        void loop() {
          SPI.beginTransaction(SPISettings(1000000, MSBFIRST, SPI_MODE0));
          digitalWrite(PIN_CS, LOW);
          uint32_t raw = SPI.transfer32(0);        // the module answers with a 32-bit word
          digitalWrite(PIN_CS, HIGH);
          SPI.endTransaction();
          if (raw & 0x10000) {                     // bit 16: a fault (open or shorted thermocouple)
            Serial.println("thermocouple fault");
          } else {
            int32_t t14 = (int32_t)raw >> 18;      // bits 31 to 18: a signed 14-bit number
            float tempC = t14 * 0.25;              // 0.25 C per step
            if (tempC > LIQUIDUS) secondsAbove += 0.5;
            Serial.printf("%.2f C, seconds above %.0f C: %.1f\n", tempC, LIQUIDUS, secondsAbove);
          }
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import time

        LIQUIDUS = 217.0                           # lead-free solder (SAC305) melts at about 217 to 220 C
        cs = Pin(5, Pin.OUT, value=1)
        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        seconds_above = 0.0

        while True:
            cs(0)
            raw = int.from_bytes(spi.read(4), "big")   # the module answers with a 32-bit word
            cs(1)
            if raw & 0x10000:                          # bit 16: a fault (open or shorted thermocouple)
                print("thermocouple fault")
            else:
                t14 = raw >> 18                        # bits 31 to 18: a signed 14-bit number
                if t14 & 0x2000:
                    t14 -= 0x4000
                temp = t14 * 0.25                      # 0.25 C per step
                if temp > LIQUIDUS:
                    seconds_above += 0.5
                print("%.2f C, seconds above %.0f C: %.1f" % (temp, LIQUIDUS, seconds_above))
            time.sleep_ms(500)
      `,
      output: `
        24.75 C, seconds above 217 C: 0.0
        ...
        231.50 C, seconds above 217 C: 14.5
        238.25 C, seconds above 217 C: 22.0
      `,
      notes: [`The converter reads the thermocouple's tip relative to its own board temperature (the cold junction): keep the module away from the hot air.`, `A thermocouple on the board next to the part reads lower than the joint under the part; allow a few degrees, and check the datasheet's limits at the part's body.`]
    }
  ],
  examples: [
    {
      title: `Was that a good profile?`,
      q: `The log shows the board crossing 217 °C at 140 s and falling below it again at 190 s, with a peak of 242 °C. Is the profile acceptable for lead-free paste?`,
      steps: [`Time above liquidus: 190 − 140 = 50 s, inside the usual 30 to 90 s.`, `Peak 242 °C is inside the typical 235 to 250 °C window.`, `Both are acceptable in general; the paste and module datasheets decide the exact limits.`],
      a: `Yes: 50 s above liquidus and a 242 °C peak fit a typical lead-free profile.`
    }
  ],
  quiz: [
    { q: `At about what temperature does lead-free SAC305 solder melt?`, choices: ['183 °C', '217 to 220 °C', '280 °C', '138 °C'], a: 1, why: `SAC305 melts at about 217 to 220 °C; 183 °C is tin-lead and 138 °C is a low-temperature tin-bismuth alloy.` },
    { q: `A pin soldered to a large ground plane will not wet properly at the usual tip temperature. What helps most?`, choices: ['A much hotter tip at once', 'More contact time, a larger tip and flux; preheating the board', 'Less solder', 'Switching the iron off'], a: 1, why: `The plane conducts the heat away. Give the joint more time and a better thermal contact; excessive temperature damages the board.` },
    { q: `A module stored open in a damp room for months goes into the reflow oven. What is the risk?`, choices: ['None', 'Absorbed moisture turns to steam and can crack the package: bake first', 'The solder will not melt', 'The firmware will be erased'], a: 1, why: `Moisture-sensitive parts must be baked as the packaging states before reflow.` },
    { q: `The shinier the top of the joint, the better the contact underneath.`, a: false, why: `A pin can rest on solder that never wetted it. Check the side view and test with a meter.` }
  ],
  applications: [
    `Soldering header pins to a development board or wires to a module.`,
    `Fitting a castellated ESP module with a ground pad to a carrier board by hot air ([[pcb-layout-for-modules]]).`,
    `Tuning a hot plate or oven profile with a thermocouple log.`,
    `Removing a faulty module or a counterfeit chip from a board ([[clones-and-counterfeits]]).`
  ],
  sources: [
    `Espressif, ESP32 module datasheets: the recommended reflow profile and the moisture sensitivity level.`,
    `IPC J-STD-001 (soldering requirements) and J-STD-020 (moisture/reflow sensitivity classification).`,
    `Maxim MAX31855 datasheet: the 32-bit output word and the fault bits.`
  ],
  sim: 'bi-reflow'
},

/* ================================================================ ESD and bench safety */
{
  id: 'esd-and-bench-safety',
  parent: 'bench-instruments',
  title: 'ESD and safety on the bench',
  level: 1,
  short: `A spark you cannot feel can kill a chip that works today and fails next month. And a handful of rules about mains, scope grounds, lithium cells, hot irons and fumes keep the bench from hurting you. Both are cheap habits.`,
  keywords: ['ESD', 'electrostatic discharge', 'wrist strap', 'ESD mat', 'antistatic bag', 'human body model', 'HBM', 'CDM', 'humidity', 'RCD', 'GFCI', 'mains', 'isolation', 'lithium cell fire', 'bench safety', 'fume extraction', 'eye protection'],
  prereq: ['the-multimeter', 'the-oscilloscope', 'soldering-and-rework'],
  related: ['lithium-cells', 'switching-mains-safely', 'mains-energy-monitoring', 'protection-parts', 'reflashing-commercial-devices', 'power-switching-and-load-sharing', 'the-bench-power-supply'],
  body: `Two different dangers share a bench. **Electrostatic discharge** (ESD) is a danger to the parts: a spark far too small to feel can punch through a transistor's gate oxide. The other dangers (mains, heat, fire, fumes) are dangers to you.

### Static: how much, and why it matters
Walking across a carpet in dry air can charge a person to several kilovolts; you feel nothing below about 3 kV. The textbook model of a person, the **human-body model**, is a 100 pF capacitor discharging through 1.5 kΩ: at 3 kV the first current peak is 2 A and lasts a few hundred nanoseconds, a few hundred microjoules, delivered to whatever pin you touch. Datasheets rate their pins against such a test, in kilovolts for the human-body model and in hundreds of volts for the charged-device model; a rating of 2 kV is common for these chips and is a floor, not a promise. Damage is often latent: the part passes today and fails in the field. The risk is highest in dry air, with synthetic clothes and plastic around.

### Habits that cost almost nothing
- Keep boards in antistatic bags until needed; the bag, not the board, goes on the bench first.
- Work on an ESD mat joined to ground through a resistor, and wear a wrist strap whose lead has a built-in 1 MΩ resistor: it drains charge and also limits the current if you touch something live. Never wear one near mains or high voltage.
- Touch the ground of the bench before touching the board; hold boards by the edges, not by the pins or the antenna.
- Humidity of 40 to 60 % helps; avoid carpet, and wool or fleece sleeves, at the bench.

### Safety, in a short list
**Mains:** a project that switches or measures mains voltage is for a qualified person, behind isolation and in an enclosure; a hobby relay board on a desk is not a product ([[switching-mains-safely]]). Put the bench on a switched supply with a residual-current device (RCD or GFCI). **Scopes:** the ground clip is earthed ([[the-oscilloscope]]). **Lithium cells:** never short, puncture or charge them without a charger and protection ([[lithium-cells]]); keep a non-flammable surface under them. **Heat and fumes:** a hot iron or hot air gun burns and sets fire to plastic; use extraction; wear eye protection when clipping leads. **Always:** unplug and remove cells before working on a board.

> [!warn] Opening and reflashing a mains-powered device (a smart plug, a dimmer, a light switch) means working on circuits that can be lethal. Do it only unplugged, and never while a mains lead is connected to a board you are also connecting to a computer.

> [!key] Static kills parts quietly: ground yourself and the board, and keep it in a bag. The big dangers are mains, a clipped-on scope ground, lithium cells and hot tools. A residual-current device on the bench is the cheapest insurance.`,
  ideas: [
    `A discharge too small to feel can damage a chip; the damage may show only later.`,
    `The human-body model is 100 pF through 1.5 kΩ: at 3 kV the peak current is about 2 A for a few hundred nanoseconds.`,
    `A mat and a strap with a 1 MΩ resistor, antistatic bags and humidity of 40 to 60 % cost little.`,
    `Mains, a clipped scope ground, lithium cells and hot tools are the dangers to the person: a residual-current device and caution handle most.`
  ],
  pitfalls: [
    `If I did not feel a spark, there was none — Below about 3 kV a person feels nothing, and chips are damaged by a few hundred volts or less.`,
    `A wrist strap makes working on live circuits safe — It drains static, and its resistor limits only a little current. Never wear one near mains or high voltage.`,
    `A board that still works after a zap was not harmed — ESD damage is often latent: the part degrades and fails after days or months.`
  ],
  terms: [
    { term: `ESD`, also: ['electrostatic discharge', 'static'], def: `A sudden transfer of charge between objects at different voltages, such as a charged person and a pin. Even without feeling it can damage a semiconductor.` },
    { term: `Human-body model`, also: ['HBM', 'charged-device model', 'CDM'], def: `The standard test of ESD robustness: a 100 pF capacitor charged to a voltage and discharged through 1.5 kΩ into a pin. The charged-device model tests a part that is itself charged.` },
    { term: `Wrist strap`, also: ['ESD strap', 'ESD mat'], def: `A band worn on the wrist and joined to ground through about 1 MΩ, so that the wearer's charge drains away continuously and safely.` },
    { term: `Residual-current device`, also: ['RCD', 'GFCI'], def: `A mains protection that cuts the supply within milliseconds if the current in the live and neutral wires differ, as when current flows through a person to earth.` }
  ],
  choose: {
    good: [`An ESD mat, a strap with a 1 MΩ resistor and antistatic bags for storage`, `A bench supply switched through an RCD`, `Extraction and eye protection at the soldering station`],
    avoid: [`Wearing a strap near mains or high voltage`, `Working on mains circuits without isolation or competence`, `Charging lithium cells on the bench unattended`],
    check: [`Humidity and clothing in dry weather`, `That the strap and mat are tested and grounded`, `That unplugged means the cell is removed too`]
  },
  examples: [
    {
      title: `What does a spark carry?`,
      q: `A person charged to 3 kV touches a pin. In the human-body model (100 pF, 1.5 kΩ), what are the peak current and the energy?`,
      steps: [`Peak current: $I = V/R = 3000/1500 = 2$ A.`, `Energy: $E = \\tfrac12 C V^2 = 0.5 \\times 100\\times10^{-12} \\times 3000^2 = 450\\ \\mu\\mathrm{J}$.`, `That is a very short event (the decay constant is $RC = 150$ ns) delivered to a single pin.`],
      a: `About 2 A and 450 µJ, over a few hundred nanoseconds.`
    }
  ],
  formulas: [
    {
      name: `Peak current of an ESD discharge`,
      expr: 'Ipk = V/R',
      tex: 'I_{\\mathrm{pk}} = \\frac{V}{R}',
      vars: {
        Ipk: { name: 'peak current', q: 'current', unit: 'A', tex: 'I_{\\mathrm{pk}}' },
        V: { name: 'voltage of the charged body', q: 'voltage', unit: 'V', value: 3000, tex: 'V' },
        R: { name: 'series resistance (1.5 kΩ in the human-body model)', q: 'resistance', unit: 'Ω', value: 1500, tex: 'R' }
      },
      note: `The first moment of the discharge, before the capacitor has begun to empty. The decay then follows $e^{-t/RC}$ with $RC = 150$ ns for the human-body model.`,
      stories: { Ipk: `A person charged to {V} discharges through {R}. What is the peak current?` },
      practice: { unknowns: ['Ipk', 'V'] }
    }
  ],
  quiz: [
    { q: `A person charged to 3 kV discharges through 1.5 kΩ. What is the peak current?`, answer: 2, unit: 'A', why: `I = V / R = 3000 / 1500 = 2 A, for a few hundred nanoseconds.` },
    { q: `Why does an ESD wrist strap contain a 1 MΩ resistor?`, choices: ['To save wire', 'To drain charge slowly and limit the current if the wearer touches something live', 'To make the strap conduct better', 'To measure the humidity'], a: 1, why: `The resistor is slow enough for safety and fast enough to bleed away static. A strap with none is unsafe.` },
    { q: `Which situation carries the highest static risk?`, choices: ['A humid day, bare floor, cotton shirt', 'A dry winter day, carpet, a fleece jacket', 'An outdoor workshop in the rain', 'A board in an antistatic bag'], a: 1, why: `Dry air, synthetic materials and carpet charge the body to several kilovolts.` },
    { q: `A board that still works after a static zap was not damaged.`, a: false, why: `ESD damage is often latent: the part degrades and fails later, in the field.` }
  ],
  applications: [
    `Handling bare modules and development boards at the bench and in production ([[production-testing]]).`,
    `Setting up a soldering and test bench with extraction, an RCD and an ESD mat.`,
    `Deciding what must not be done with a mains-powered smart plug that you want to reflash ([[reflashing-commercial-devices]]).`,
    `Storing and shipping boards in antistatic packaging.`
  ],
  sources: [
    `ANSI/ESDA/JEDEC JS-001: the human-body model test for component ESD sensitivity.`,
    `IEC 61340-5-1: protection of electronic devices from electrostatic phenomena.`,
    `Espressif, ESP32 series datasheets: the ESD ratings of the pins.`
  ],
  sim: 'bi-esd'
}
);
