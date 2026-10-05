/* HYPER-ESP32 · content/active-components.js
 *
 * Topic: Active parts around an ESP — the standard circuits between a 3.3 V pin and the world.
 * LEDs, diodes, the transistor and the MOSFET as switches, relays, solid-state relays, optocouplers, level shifters,
 * port expanders and shift registers, external ADCs and DACs, op-amps, analogue multiplexers.
 */
Hyper.add(
/* ================================================================ leds */
{
  id: 'leds',
  parent: 'active-components',
  title: 'LEDs',
  level: 1,
  short: `An LED is a diode that glows, and what limits its current is never the pin but the resistor in series. Choose the resistor from the supply, the LED's forward voltage and the few milliamps you want, and check which side of the pin the LED hangs on.`,
  keywords: ['LED', 'light emitting diode', 'series resistor', 'forward voltage', 'Vf', 'current limiting', 'anode', 'cathode', 'sink', 'source', 'active low', 'blue LED', 'white LED', 'indicator', 'brightness', 'resistor value'],
  prereq: ['pin-current-limits', 'three-volt-logic', 'electronics:leds', 'electronics:resistance-ohms-law'],
  related: ['driving-leds-with-pwm', 'rgb-leds', 'indicator-leds-and-bar-graphs', 'resistors-in-esp-circuits', 'transistor-as-a-switch', 'first-program-blink'],
  body: `An LED conducts in one direction only: from the **anode** (the longer leg, the smaller plate inside the case) to the **cathode** (the shorter leg, the flat edge of the case). Once it conducts, the voltage across it barely changes with the current. That is the trap. An LED is not a resistor: put 3.3 V straight across one and the current is decided by the pin's output stage and by luck. The part that sets the current is a **series resistor**.

### The one calculation

The LED keeps a nearly fixed **forward voltage** $V_f$ across itself, and the resistor takes whatever is left of the supply:

$$R = \\frac{V_s - V_f}{I}$$

A red LED with $V_f \\approx 2.0$ V from a 3.3 V pin at 5 mA needs $(3.3 - 2.0)/0.005 = 260\\ \\Omega$. Take the next standard value, 270 Ω, and the current is 4.8 mA. Modern LEDs are bright at 1 to 5 mA, and a pin is happier there ([[pin-current-limits]]).

### Colour decides the headroom

| Colour | Forward voltage at a few mA | Resistor for 5 mA from 3.3 V |
|---|---|---|
| Red | 1.8 to 2.2 V | 270 Ω |
| Yellow, amber | 2.0 to 2.2 V | 240 Ω to 270 Ω |
| Green | 2.0 to 3.2 V, depending on the type | measure it |
| Blue, white | 2.8 to 3.4 V | no reliable value |

The last row is the surprise. From 3.3 V a blue or white LED leaves 0 to 0.5 V for the resistor, and the spread from one LED to the next is as large as that. The current swings between nothing and far too much. Power such LEDs from 5 V with a transistor ([[transistor-as-a-switch]]), or accept a dim one with a small resistor and test every unit.

### Which side of the pin

An LED from the pin through a resistor to ground lights when the pin is high: the pin **sources** the current. An LED from 3.3 V through a resistor to the pin lights when the pin is low: the pin **sinks** it. Both draw from the same budget. The sinking arrangement is the safer one for a strapping pin, because the pin's own pull-up at reset leaves the LED dark ([[strapping-pins]]).

### Rules that save a board

- **One resistor per LED.** Two LEDs in parallel behind one resistor do not share the current evenly, and one of them takes most of it.
- **A string in series** works if the forward voltages add up to less than the supply, which on 3.3 V means a single LED.
- **Brightness against current** is close to proportional, but the eye responds roughly logarithmically: half the current looks only a little dimmer. Dimming is done with PWM ([[driving-leds-with-pwm]]), not with a bigger resistor.

> [!key] The resistor, not the pin, sets the LED's current: $R = (V_s - V_f)/I$, usually 220 Ω to 470 Ω from 3.3 V. Red and yellow LEDs work well on a pin; blue and white ones have almost no headroom at 3.3 V.`,
  ideas: [
    `An LED holds a nearly fixed forward voltage, so a series resistor must take the rest of the supply: R = (Vs − Vf)/I.`,
    `Red and yellow LEDs (about 2 V) work on a 3.3 V pin at a few milliamps; blue and white (about 3 V) leave almost no headroom and vary from unit to unit.`,
    `A pin can source the current (LED to ground, lit on HIGH) or sink it (LED to 3.3 V, lit on LOW); both count against the pin's limits.`,
    `Every LED needs its own resistor; parallel LEDs behind a shared resistor take unequal currents.`
  ],
  pitfalls: [
    `A 3.3 V pin is gentle, so a resistor is optional — Without one the current is limited only by the output stage: it overloads the pin, shortens the chip's life and can burn the LED. Fit a resistor every time.`,
    `Use the same resistor for every colour — The value depends on the forward voltage. A 270 Ω resistor gives about 5 mA with a red LED and a very different current with a green or white one.`,
    `A bigger LED current always means a much brighter LED — The eye is roughly logarithmic, and a pin has a current budget. Going from 5 mA to 10 mA looks a little brighter, not twice as bright.`
  ],
  terms: [
    { term: 'Forward voltage', also: ['Vf', 'forward drop'], def: `The voltage across a diode or LED while it conducts. It is almost constant: about 0.7 V for a silicon diode, 2 V for a red LED, 3 V for a blue or white one.` },
    { term: 'Series resistor', also: ['current-limiting resistor', 'LED resistor'], def: `A resistor wired in series with an LED so that it, and not the pin, sets the current. Its value is the supply minus the forward voltage, divided by the wanted current.` },
    { term: 'Anode', also: ['cathode'], def: `The positive terminal of a diode or LED, from which current enters. The other terminal is the cathode; on a through-hole LED the anode is the longer leg.` },
    { term: 'Sourcing and sinking', also: ['source current', 'sink current'], def: `A pin that is high sources current out of the chip into the load; a pin that is low sinks current from the load into the chip.` }
  ],
  choose: {
    good: [`Red, yellow or green indicator LEDs at 2 to 5 mA straight from a pin`, `One resistor per LED, 220 Ω to 470 Ω from 3.3 V`, `The sinking arrangement (LED to 3.3 V, lit on LOW) for LEDs on a strapping pin`],
    avoid: [`Blue or white LEDs from 3.3 V with a small resistor`, `Several LEDs in parallel behind one resistor`, `An LED with no resistor "because it is only 3.3 V"`],
    check: [`The LED's forward voltage in its datasheet, or measure it with a multimeter's diode test`, `That the resistor leaves the current under the pin's limit with the LED's worst-case forward voltage`, `Whether the on-board LED of your board lights on HIGH or on LOW`]
  },
  code: [
    {
      title: 'One LED on each side of the pin',
      about: `Two LEDs blink in step with the pins. The LED on GPIO18 is wired to ground, so it lights while its pin is HIGH (the pin sources the current). The LED on GPIO19 is wired to 3.3 V, so it lights while its pin is LOW (the pin sinks the current). Because both pins change together, the two LEDs light alternately.`,
      needs: `An ESP32 DevKit, two LEDs and two resistors (270 Ω for red LEDs).`,
      wiring: [['GPIO18', '270 Ω → LED anode, LED cathode → GND', 'lights when GPIO18 is HIGH'], ['GPIO19', 'LED cathode, LED anode → 270 Ω → 3V3', 'lights when GPIO19 is LOW']],
      blocks: `
        when started
          set pin (18) as [output v]
          set pin (19) as [output v]
        forever
          set pin (18) to [HIGH v]    // this LED lights on HIGH
          set pin (19) to [HIGH v]    // this LED lights on LOW: dark now
          wait (0.5) seconds
          set pin (18) to [LOW v]
          set pin (19) to [LOW v]
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int SOURCE_LED = 18;   // pin -> resistor -> LED -> GND: lit when HIGH
        const int SINK_LED   = 19;   // 3V3 -> resistor -> LED -> pin: lit when LOW

        void setup() {
          pinMode(SOURCE_LED, OUTPUT);
          pinMode(SINK_LED, OUTPUT);
        }

        void loop() {
          digitalWrite(SOURCE_LED, HIGH);   // this one is on
          digitalWrite(SINK_LED, HIGH);     // this one is off
          delay(500);
          digitalWrite(SOURCE_LED, LOW);
          digitalWrite(SINK_LED, LOW);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SOURCE_LED = Pin(18, Pin.OUT)   # pin -> resistor -> LED -> GND: lit when 1
        SINK_LED = Pin(19, Pin.OUT)     # 3V3 -> resistor -> LED -> pin: lit when 0

        while True:
            SOURCE_LED.value(1)         # this one is on
            SINK_LED.value(1)           # this one is off
            time.sleep_ms(500)
            SOURCE_LED.value(0)
            SINK_LED.value(0)
            time.sleep_ms(500)
      `,
      notes: [`The same wiring explains the "active low" LED of a NodeMCU or D1 mini: it is wired to 3.3 V, so the program must write LOW to light it.`, `On the ESP32-S3, C3 and C6 DevKits the on-board LED is an addressable RGB LED, not a plain one: see [[first-program-blink]].`]
    }
  ],
  formulas: [
    {
      name: 'Series resistor for an LED',
      expr: 'R = (Vs - Vf)/I',
      tex: 'R = \\frac{V_s - V_f}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω' },
        Vs: { name: 'supply (high level of the pin)', tex: 'V_s', q: 'voltage', unit: 'V', value: 3.3 },
        Vf: { name: 'LED forward voltage', tex: 'V_f', q: 'voltage', unit: 'V', value: 2.0 },
        I: { name: 'LED current', q: 'current', unit: 'mA', value: 5 }
      },
      solveFor: 'R',
      note: `Round up to the next standard value (E12). The pin's own output resistance, a few tens of ohms, is ignored here. Solve for I to see the current a standard resistor really gives.`,
      stories: { R: 'A pin at {Vs} drives an LED whose forward voltage is {Vf}. The LED should carry {I}. What resistor goes in series?', I: 'A {R} resistor is fitted in series with an LED of {Vf} on a {Vs} supply. What current flows?' },
      practice: { unknowns: ['R', 'I'] }
    }
  ],
  examples: [
    {
      title: 'A resistor for a green LED',
      q: `A green LED has a forward voltage of 2.2 V. How should it be wired to an ESP32 pin so that it carries about 4 mA, and what happens to the current if you fit a 330 Ω resistor?`,
      steps: [`The resistor must drop $3.3 - 2.2 = 1.1$ V at 4 mA: $R = 1.1 / 0.004 = 275\\ \\Omega$. The nearest standard values are 270 Ω and 330 Ω.`, `With 330 Ω: $I = 1.1 / 330 = 3.3$ mA. With 270 Ω: $I = 4.1$ mA.`, `Both are well under the pin's limit, and both are visibly bright.`],
      a: `Use 270 Ω for 4.1 mA, or 330 Ω for a gentler 3.3 mA; either gives a bright indicator.`
    }
  ],
  quiz: [
    { q: `A red LED (2.0 V) is wired to a 3.3 V pin through 100 Ω. What current flows when the pin is high?`, choices: [`3 mA`, `13 mA`, `33 mA`, `Whatever the LED draws`], a: 1, why: `The resistor drops 3.3 − 2.0 = 1.3 V, so I = 1.3 / 100 = 13 mA. That is more than a pin should be asked to give for a mere indicator; 270 Ω gives about 5 mA.` },
    { q: `Why is a blue LED a poor match for a 3.3 V pin?`, choices: [`It needs more than 20 mA`, `Its forward voltage is close to 3.3 V, leaving no headroom for a resistor`, `Blue light cannot be dimmed`, `It only works with active-low wiring`], a: 1, why: `A blue LED drops 2.8 to 3.4 V. The resistor would have to drop 0 to 0.5 V, and a small change in the LED's voltage changes the current from nothing to far too much.` },
    { q: `An LED is wired from 3.3 V through a resistor to GPIO19. The program writes HIGH. What does the LED do?`, a: false, why: `With both ends at 3.3 V there is no voltage across the LED, so it is dark. This wiring lights the LED when the pin is LOW.` },
    { q: `Two identical LEDs are wired in parallel behind one 270 Ω resistor. What is the likely result?`, choices: [`They share the current exactly`, `One of them takes more current than the other`, `The resistor value must be halved`, `Neither lights`], a: 1, why: `Real LEDs differ slightly in forward voltage, and the exponential current-voltage curve makes the one with the lower voltage take much more current. Give each LED its own resistor.` }
  ],
  applications: [
    `Power, status and error indicators on every board, from a heartbeat blink to a Wi-Fi connected light.`,
    `Backlighting and indicator rows on front panels, one resistor per LED.`,
    `Optocoupler input LEDs and the infrared LED of a remote control, sized with the same formula.`
  ],
  sources: [
    `Hyper Electronics, the LED and diode pages: the diode equation and forward-voltage values.`,
    `Espressif, ESP32 datasheet: the output drive strength of the GPIO pins.`,
    `LED manufacturers' datasheets (forward voltage and maximum current by colour).`
  ],
  sim: 'ac-led-resistor'
},

/* ================================================================ diodes-in-esp-circuits */
{
  id: 'diodes-in-esp-circuits',
  parent: 'active-components',
  title: 'Diodes: flyback, Schottky, reverse protection',
  level: 2,
  short: `A diode lets current through one way. Around an ESP it catches the voltage spike of a relay or motor coil, ORs two supplies together, and stops a battery being connected backwards: three small jobs, three kinds of diode.`,
  keywords: ['diode', 'flyback diode', 'freewheel diode', 'Schottky', '1N4148', '1N4007', '1N5819', 'SS14', 'reverse polarity', 'OR-ing', 'power selection', 'voltage drop', 'Zener', 'TVS', 'inductive kick', 'back EMF'],
  prereq: ['leds', 'transistor-as-a-switch', 'electronics:flyback-diode', 'electronics:diode-types'],
  related: ['relays', 'mosfets-for-loads', 'protection-parts', 'usb-power', 'power-switching-and-load-sharing', 'switching-dc-loads', 'electronics:zener-diodes'],
  body: `A diode conducts one way and blocks the other, and drops a fairly constant **forward voltage** while it conducts. Three jobs come up again and again in ESP circuits.

### Catching the kick of a coil

A relay coil, a solenoid, a motor and a buzzer's magnet are inductors. While current flows they store energy, $E = \\tfrac{1}{2} L I^2$, and when the switch opens the current cannot stop at once: the coil drives its terminals to whatever voltage it takes, in practice tens to hundreds of volts, until the switch breaks down or an arc forms. A diode wired across the coil, cathode towards the positive supply, gives the current a loop to die in. This is the **flyback diode** (also *freewheel* or *snubber* diode). For small coils a 1N4148 is enough; for a motor or a big relay use a 1N4007 or a Schottky that can carry the full coil current. It goes **across every coil**, every time, and the simulation shows what happens without it.

The price: the current now dies slowly, with the time constant $\\tau = L/R$, so the relay lets go a few milliseconds later. A Zener in series with the diode, or a resistor, shortens that.

### Choosing the diode

| Diode | Forward drop | Notes |
|---|---|---|
| 1N4148 | about 0.7 V | small-signal, fast, 100 V; coils up to about 100 mA |
| 1N4001 to 1N4007 | 0.8 to 1.1 V at 1 A | rectifier, 1 A, slow to switch off; coils and motors |
| 1N5817 to 1N5819, SS14 | 0.3 to 0.45 V | Schottky: low drop, fast, but leaks more when hot |

### Supplies and mistakes

- **OR-ing.** Two diodes (or one diode and a P-channel MOSFET) let a board take power from USB *or* a battery without one pushing current back into the other. A Schottky costs 0.3 V; a silicon diode 0.7 V ([[power-switching-and-load-sharing]], [[usb-power]]).
- **Reverse polarity.** A series diode in a battery input protects against a reversed connector at the price of its forward drop times the current: 0.3 V at 500 mA is 0.15 W. A P-channel MOSFET wired as an "ideal diode" drops almost nothing ([[protection-parts]]).
- **Zeners and TVS diodes** clamp a line to a fixed voltage; they protect an input against static and spikes rather than steer current.

> [!key] A flyback diode across every inductive load — cathode to the positive supply — is not optional. Use Schottky diodes where the voltage drop matters, and remember that every series diode costs its forward voltage times the current.`,
  ideas: [
    `An inductor stores ½·L·I² and, when its switch opens, forces the voltage up until something breaks down: a diode across the coil gives the current a path.`,
    `The flyback diode sits across the coil, cathode towards the positive supply, and slows the release by about L/R.`,
    `A Schottky diode drops 0.3 to 0.45 V instead of 0.7 V, which matters when a diode is in series with the supply; it leaks more when hot.`,
    `Diodes OR two supplies together and protect against a reversed battery, each at the cost of its forward voltage times the current.`
  ],
  pitfalls: [
    `A relay module already has a diode, so my own coil needs none — The diode on a module protects the module's own coil. A relay, solenoid or motor that you wire yourself needs its own across its own terminals.`,
    `The diode can go either way — Backwards it conducts as soon as the coil is powered and shorts the supply. Cathode (the banded end) goes to the positive side of the coil.`,
    `A bigger diode is always better — A diode that is slow (a 1N4007) is wrong for a fast PWM load, and a Schottky leaks too much at high temperature on a battery that must last for years.`
  ],
  terms: [
    { term: 'Flyback diode', also: ['freewheel diode', 'snubber diode', 'catch diode', 'clamp diode'], def: `A diode across an inductive load, cathode to the positive side, that gives the coil current a path when the switch opens and so prevents a large voltage spike.` },
    { term: 'Schottky diode', def: `A diode made from a metal-semiconductor junction. Its forward drop is low (0.3 to 0.45 V) and it switches off very quickly, but it leaks more current, especially when warm.` },
    { term: 'Reverse-polarity protection', also: ['reverse-battery protection'], def: `A series diode or a P-channel MOSFET that blocks current when the supply is connected the wrong way round, so the circuit behind it is not damaged.` },
    { term: 'OR-ing diode', also: ['power ORing', 'diode OR'], def: `One diode per supply, joined at their cathodes, so that the load takes power from whichever supply is higher and neither supply can push current into the other.` },
    { term: 'Inductive kick', also: ['back EMF', 'flyback voltage'], def: `The voltage spike an inductor produces when the current through it is suddenly interrupted, because its stored magnetic energy must go somewhere.` }
  ],
  choose: {
    good: [`1N4148 across a small relay coil or buzzer`, `1N4007 or a Schottky across a motor, fan or large relay`, `A Schottky diode for OR-ing a USB supply and a battery`],
    avoid: [`Leaving a coil, solenoid or motor without a flyback diode`, `A silicon diode in series with a battery that is already low`, `A leaky Schottky in a sleeping battery device without checking its leakage`],
    check: [`The diode's current rating against the coil's current, not just the voltage`, `That the cathode (banded end) faces the positive supply`, `The release delay if the load must stop quickly`]
  },
  formulas: [
    {
      name: 'Energy stored in a coil',
      expr: 'E = L*I^2/2',
      tex: 'E = \\frac{1}{2} L I^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'mJ' },
        L: { name: 'coil inductance', q: 'inductance', unit: 'mH', value: 200 },
        I: { name: 'coil current', q: 'current', unit: 'mA', value: 70 }
      },
      solveFor: 'E',
      note: `A small relay coil stores about half a millijoule. That is tiny, but it is released in microseconds into a transistor that may have a rating of 30 to 45 V.`,
      stories: { E: 'A relay coil of {L} carries {I}. How much energy does it store?' }
    },
    {
      name: 'Release time constant with a flyback diode',
      expr: 'tau = L/R',
      tex: '\\tau = \\frac{L}{R}',
      vars: {
        tau: { name: 'time constant', tex: '\\tau', q: 'time', unit: 'ms' },
        L: { name: 'coil inductance', q: 'inductance', unit: 'mH', value: 200 },
        R: { name: 'loop resistance (coil plus diode)', q: 'resistance', unit: 'Ω', value: 71 }
      },
      solveFor: 'tau',
      note: `The coil current falls to 37 % in one time constant and to a few percent in three. The relay lets go when the current is below its release value, so the contacts open a little later than without the diode.`,
      stories: { tau: 'A coil of {L} and {R} loop resistance releases through a flyback diode. What is the time constant?' }
    }
  ],
  examples: [
    {
      title: 'How much does the diode delay the relay?',
      q: `A 5 V relay coil has 71 Ω resistance and about 200 mH inductance. With a flyback diode, how long is the time constant, and how does a 1 kΩ resistor in series with the diode change it?`,
      steps: [`With the diode alone the loop resistance is about 71 Ω: $\\tau = 0.2 / 71 = 2.8$ ms.`, `With 1 kΩ in series: the loop is 1071 Ω and $\\tau = 0.2 / 1071 = 0.19$ ms, fifteen times faster.`, `The price is the voltage: the coil's current of 70 mA through 1 kΩ makes a spike of about 70 V, which the transistor must withstand.`],
      a: `About 2.8 ms with the diode alone and 0.19 ms with the resistor; a lower-value resistor (100 Ω to 220 Ω) is the usual compromise.`
    }
  ],
  quiz: [
    { q: `Where does the flyback diode of a relay coil go?`, choices: [`In series with the coil, anode to the transistor`, `Across the coil, cathode towards the positive supply`, `Across the transistor`, `Between the base resistor and ground`], a: 1, why: `The diode is reverse-biased while the coil is powered, so it does nothing; when the switch opens the coil's voltage reverses and the diode conducts, carrying the current round the coil.` },
    { q: `The diode is fitted the wrong way round, anode to the positive supply. What happens when the transistor switches the coil on?`, choices: [`Nothing, the diode is only for turn-off`, `The coil gets a higher voltage`, `The supply is shorted through the diode`, `The relay turns on faster`], a: 2, why: `Facing the wrong way, the diode conducts from the supply straight to ground through the transistor as soon as it turns on. The diode, the transistor or the supply fails.` },
    { q: `A Schottky diode in series with a 5 V USB supply drops 0.35 V at the load current. What does the ESP's regulator see?`, choices: [`5.35 V`, `4.65 V`, `5.0 V`, `3.3 V`], a: 1, why: `The diode drops 0.35 V, so the board sees about 4.65 V: still plenty for a 3.3 V regulator, and 0.35 V is better than the 0.7 V of a silicon diode.` },
    { q: `A flyback diode makes a relay release more slowly than it would with no diode, but never makes it faster.`, a: true, why: `With no diode the coil current is cut at once (and the voltage spikes), so the field collapses fast. With the diode the current decays with a time constant L/R, so the contacts open a little later. A resistor or Zener in series speeds it up again.` }
  ],
  applications: [
    `Across the coil of every relay, solenoid valve, buzzer with a magnet or motor switched by a transistor or MOSFET.`,
    `Selecting between a USB supply and a battery on a portable board.`,
    `Protecting a battery connector against being plugged in backwards.`
  ],
  sources: [
    `Hyper Electronics, the flyback diode and diode-types pages.`,
    `Manufacturers' datasheets for the 1N4148, the 1N400x series and the 1N5817 to 1N5819 Schottky diodes.`,
    `Relay manufacturers' application notes on coil suppression (diode, diode with Zener, resistor).`
  ],
  sim: 'ac-flyback'
},

/* ================================================================ transistor-as-a-switch */
{
  id: 'transistor-as-a-switch',
  parent: 'active-components',
  title: 'The transistor as a switch',
  level: 2,
  short: `A bipolar transistor lets a few milliamps from a pin switch a few hundred. Wire the load between the supply and the collector, drive the base through a resistor, and push the transistor so hard that it saturates and drops only a fraction of a volt.`,
  keywords: ['NPN', 'BJT', '2N2222', 'BC547', 'PN2222', 'base resistor', 'saturation', 'low-side switch', 'switch a load', 'forced beta', 'hFE', 'PNP', 'collector', 'emitter', 'pull-down', 'Darlington'],
  prereq: ['leds', 'pin-current-limits', 'electronics:bjt-switch', 'electronics:resistance-ohms-law'],
  related: ['mosfets-for-loads', 'diodes-in-esp-circuits', 'relays', 'switching-dc-loads', 'level-shifters', 'buzzers-and-tones'],
  body: `A pin supplies a few milliamps; a relay coil, a buzzer, a small fan or a strip of LEDs wants tens or hundreds. A **bipolar transistor** bridges the gap: a small current into its base lets a much larger current flow from collector to emitter. Used as a switch, it is either off or driven so hard that it is *saturated*, like a closed contact.

### The low-side NPN switch

The standard circuit has the load between the supply and the transistor's collector, the emitter on ground, and the pin connected to the base **through a resistor**. A high pin pushes current into the base and the load switches on; a low pin switches it off. Because the transistor sits on the ground side of the load, this is *low-side* switching: the load's own ground is no longer ground when it is off, which hardly matters for a coil, a fan or a buzzer. Typical parts: the 2N2222 or PN2222 for loads up to a few hundred milliamps, the BC547 for up to about 100 mA.

### Sizing the base resistor

In its linear region the collector current is $\\beta$ times the base current, with $\\beta$ (hFE) anywhere from 100 to 300 and wide spread. A switch must not depend on that, so assume a **forced beta of about 10**: supply a tenth of the collector current as base current. The pin's 3.3 V less the 0.7 V base-emitter drop falls across the base resistor:

$$R_b = \\frac{(V_{pin} - V_{BE})\\,\\beta_{forced}}{I_C}$$

For a 70 mA relay coil, $R_b = 2.6 \\times 10 / 0.07 = 371\\ \\Omega$: take 330 Ω, which asks 7.9 mA of the pin. For loads up to about 30 mA, 1 kΩ (2.6 mA) is plenty and kinder to the pin.

### The rest of the circuit

- **A 10 kΩ resistor from base to ground** keeps the transistor off while the pin floats at boot or reset.
- **A flyback diode** across any coil ([[diodes-in-esp-circuits]]).
- **Saturation** means $V_{CE}$ of about 0.1 to 0.3 V: the transistor then dissipates $V_{CE} \\cdot I_C$, tens of milliwatts, and stays cool. If it is under-driven it sits in the linear region, drops volts, and burns watts.
- **High-side switching** with a PNP is awkward from a 3.3 V pin when the load's supply is higher, because the pin cannot turn the PNP off. Use a P-channel MOSFET with a small NPN to drive its gate, or a high-side driver ([[mosfets-for-loads]]).

For anything beyond a few hundred milliamps, or for PWM at higher frequencies, a logic-level MOSFET is usually the better switch.

> [!key] A pin drives the base through a resistor chosen for a forced beta of about 10; the load sits between the supply and the collector, with a diode across it if it is a coil. Driven this way the transistor saturates, drops a fraction of a volt and stays cool.`,
  ideas: [
    `A small base current switches a collector current ten times larger or more; the load goes between the supply and the collector, the emitter to ground.`,
    `Size the base resistor for a forced beta of about 10, not for the datasheet's beta: R = (3.3 V − 0.7 V) × 10 / Ic.`,
    `A saturated transistor drops 0.1 to 0.3 V and stays cool; an under-driven one sits in its linear region and gets hot.`,
    `A 10 kΩ resistor from base to ground keeps the load off while the pin floats during boot.`
  ],
  pitfalls: [
    `No base resistor is needed, the pin is only 3.3 V — The base-emitter junction is a diode: without a resistor the pin drives a short circuit through 0.7 V. The pin or the transistor fails.`,
    `Use the datasheet beta of 200 to compute the base current — The beta falls as the current rises, and parts vary. Assume ten and the switch works with every unit.`,
    `A transistor can switch a coil with no diode, it is rated for the current — The rating is for the current, not for the spike of an inductive turn-off, which can exceed the transistor's voltage rating by far.`
  ],
  terms: [
    { term: 'Saturation', def: `The state of a transistor driven so hard that it cannot pass more current: the collector-emitter voltage falls to 0.1 to 0.3 V and the transistor behaves like a closed switch.` },
    { term: 'Forced beta', also: ['switching beta'], def: `The ratio of collector current to base current that a switch is designed for, deliberately smaller than the transistor's beta (usually 10) so that the transistor saturates for every unit.` },
    { term: 'Low-side switch', def: `A switch between the load and ground. The load stays connected to the positive supply, which is why an NPN transistor or an N-channel MOSFET suits it.` },
    { term: 'Base resistor', def: `The resistor between a pin and a transistor's base. It sets the base current, and without it the pin drives the 0.7 V base-emitter junction directly.` },
    { term: 'Collector', also: ['base', 'emitter', 'hFE'], def: `The three terminals of a bipolar transistor. A small current into the base controls a larger current between collector and emitter; hFE is the gain, collector current divided by base current.` }
  ],
  choose: {
    good: [`2N2222, PN2222 or BC547 as a low-side switch for loads up to 100 to 500 mA`, `A base resistor of 330 Ω to 1 kΩ from a 3.3 V pin`, `A 10 kΩ pull-down on the base for a clean boot`],
    avoid: [`Driving a base straight from a pin`, `A PNP high-side switch from a 3.3 V pin with a 5 V or 12 V load`, `A bipolar switch for amperes or fast PWM: use a MOSFET`],
    check: [`The collector current at the worst case, against the part's rating`, `The base current against the pin's limit`, `That the load has a flyback diode if it is a coil`]
  },
  code: [
    {
      title: 'Run a load for three seconds after a button press',
      about: `A button on GPIO27 starts a load, switched by an NPN transistor on GPIO23, for three seconds. A second press during the run is ignored. The loop never waits, so the button is read all the time.`,
      needs: `An ESP32 DevKit, a push button, an NPN transistor (2N2222 or BC547), a 1 kΩ base resistor, a 10 kΩ base pull-down, a small 5 V load (buzzer, fan or relay coil with a flyback diode) and its supply.`,
      wiring: [['GPIO27', 'button → GND', 'internal pull-up'], ['GPIO23', '1 kΩ → base; 10 kΩ from base to GND'], ['emitter', 'GND, common with the ESP'], ['collector', 'one side of the load; the other side to the load supply (5 V)', 'diode across a coil, cathode to +5 V']],
      blocks: `
        when started
          set pin (27) as [input with pull-up v]
          set pin (23) as [output v]
          set pin (23) to [LOW v]
          set [running v] to <false>
        forever
          if <<not <running>> and <(read pin (27)) = [LOW v]>> then
            set [running v] to <true>
            set [startedAt v] to (milliseconds since start)
            set pin (23) to [HIGH v]
          end
          if <<running> and <((milliseconds since start) - (startedAt)) ≥ (3000)>> then
            set pin (23) to [LOW v]
            set [running v] to <false>
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON_PIN = 27;
        const int LOAD_PIN   = 23;
        const uint32_t RUN_MS = 3000;

        bool running = false;
        uint32_t startedAt = 0;

        void setup() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          pinMode(LOAD_PIN, OUTPUT);
          digitalWrite(LOAD_PIN, LOW);
        }

        void loop() {
          if (!running && digitalRead(BUTTON_PIN) == LOW) {
            running = true;
            startedAt = millis();
            digitalWrite(LOAD_PIN, HIGH);          // base current flows, the transistor saturates
          }
          if (running && millis() - startedAt >= RUN_MS) {
            digitalWrite(LOAD_PIN, LOW);
            running = false;
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        button = Pin(27, Pin.IN, Pin.PULL_UP)
        load = Pin(23, Pin.OUT, value=0)
        RUN_MS = 3000

        running = False
        started_at = 0

        while True:
            if not running and button.value() == 0:
                running = True
                started_at = time.ticks_ms()
                load.value(1)                      # base current flows, the transistor saturates
            if running and time.ticks_diff(time.ticks_ms(), started_at) >= RUN_MS:
                load.value(0)
                running = False
      `,
      notes: [`The press is not debounced; during the three seconds extra presses are ignored anyway. See [[debouncing]] for the general case.`, `For a load that must never stay on if the program hangs, add a hardware timer or a watchdog; see [[watchdogs]].`]
    }
  ],
  formulas: [
    {
      name: 'Base resistor for a transistor switch',
      expr: 'Rb = (Vp - Vbe)*beta/Ic',
      tex: 'R_b = \\frac{(V_p - V_{BE})\\,\\beta}{I_C}',
      vars: {
        Rb: { name: 'base resistor', tex: 'R_b', q: 'resistance', unit: 'Ω' },
        Vp: { name: 'pin high level', tex: 'V_p', q: 'voltage', unit: 'V', value: 3.3 },
        Vbe: { name: 'base-emitter voltage', tex: 'V_{BE}', q: 'voltage', unit: 'V', value: 0.7 },
        beta: { name: 'forced beta (collector current per base current)', tex: '\\beta', q: 'none', value: 10 },
        Ic: { name: 'collector (load) current', tex: 'I_C', q: 'current', unit: 'mA', value: 70 }
      },
      solveFor: 'Rb',
      note: `Use a forced beta of 10 for a switch, whatever the datasheet's beta says. Pick the next lower standard resistor value, so that the transistor is certainly saturated, and check the base current against the pin's limit.`,
      stories: { Rb: 'A load takes {Ic} through an NPN transistor driven from a pin at {Vp}. With a forced beta of {beta} and a base-emitter drop of {Vbe}, what base resistor is needed?' },
      practice: { unknowns: ['Rb', 'Ic'] }
    }
  ],
  examples: [
    {
      title: 'A small 5 V fan',
      q: `A 5 V fan takes 150 mA. Choose a base resistor for a BC547 on an ESP32 pin, and check the pin's current.`,
      steps: [`A BC547 is rated for about 100 mA, so choose a 2N2222 or PN2222, which takes several hundred milliamps.`, `Forced beta 10: base current $150 / 10 = 15$ mA, which is too much for a pin. A forced beta of 30 (a 2N2222's gain at 150 mA is comfortably above that) needs 5 mA: $R_b = 2.6 / 0.005 = 520\\ \\Omega$, so 470 Ω.`, `The pin supplies $2.6 / 470 = 5.5$ mA: acceptable. A logic-level MOSFET would need no base current at all.`],
      a: `A 2N2222 with 470 Ω gives about 5.5 mA of base current; better still, switch a fan of this size with a MOSFET.`
    }
  ],
  quiz: [
    { q: `A 100 mA load is switched by an NPN transistor from a 3.3 V pin. Which base resistor suits a forced beta of 10?`, choices: [`47 Ω`, `260 Ω`, `1 kΩ`, `10 kΩ`], a: 1, why: `Base current = 100 / 10 = 10 mA, and (3.3 − 0.7) / 0.010 = 260 Ω. 1 kΩ gives only 2.6 mA, a forced beta of 38; 10 kΩ would leave the transistor in its linear region and hot.` },
    { q: `What is the job of the 10 kΩ resistor from the base to ground?`, choices: [`To limit the base current`, `To keep the transistor off while the pin floats during boot`, `To speed up switch-on`, `To protect the load`], a: 1, why: `A floating pin can drift and half-switch the transistor, so the load may flicker or switch on during reset. A pull-down holds the base at 0 V until the program drives it.` },
    { q: `A transistor in saturation drops about 0.2 V across a 100 mA load. How much power does it dissipate?`, choices: [`20 mW`, `0.2 W`, `1 W`, `0.7 W`], a: 0, why: `P = V × I = 0.2 V × 0.1 A = 20 mW, which is why a saturated small transistor stays cool. If it were under-driven and dropped 2 V it would dissipate 200 mW and get hot.` },
    { q: `A bipolar transistor switch is safe for any size of coil because its current rating is high.`, a: false, why: `The turn-off spike of a coil can reach hundreds of volts, far above the transistor's voltage rating. Every coil needs a flyback diode, whatever the current.` }
  ],
  applications: [
    `Switching a relay coil, a buzzer or a small fan from a GPIO pin.`,
    `Inside every relay module and every driver board: a transistor between the pin and the load.`,
    `Pulling the gate of a power MOSFET high or low quickly, and level-shifting for a P-channel high-side switch.`
  ],
  sources: [
    `Manufacturers' datasheets for the 2N2222 / PN2222 and the BC547: ratings and saturation voltage.`,
    `Hyper Electronics, the BJT switch page.`,
    `Espressif, ESP32 datasheet: GPIO output drive strength.`
  ],
  sim: 'ac-bjt-switch'
},

/* ================================================================ mosfets-for-loads */
{
  id: 'mosfets-for-loads',
  parent: 'active-components',
  title: 'MOSFETs for loads',
  level: 2,
  short: `A logic-level N-channel MOSFET switches amperes from a 3.3 V pin with no gate current to speak of and almost no loss. The part number decides whether it works: the gate threshold is where it starts to conduct, not where it is fully on.`,
  keywords: ['MOSFET', 'logic level', 'AO3400', 'IRLZ44N', 'IRF540', 'IRF520', 'gate threshold', 'Vgs(th)', 'Rds(on)', 'N-channel', 'P-channel', 'gate resistor', 'gate pull-down', 'low-side', 'high-side', 'PWM driver', 'body diode', 'MOSFET module'],
  prereq: ['transistor-as-a-switch', 'diodes-in-esp-circuits', 'electronics:mosfet-switch', 'electronics:gate-drive'],
  related: ['switching-dc-loads', 'powering-led-strips', 'driving-leds-with-pwm', 'fans-and-pwm-control', 'dc-motors-and-h-bridges', 'relays', 'power-switching-and-load-sharing'],
  body: `A power MOSFET is a switch controlled by a *voltage*. Once its gate capacitance is charged, the gate draws no current, and when it is on, the drain-to-source path has a resistance of only milliohms, so even a few amperes lose little power. That is why a MOSFET, not a bipolar transistor, switches strips, fans, pumps and solenoids, and why it can be PWM-driven at kilohertz.

### The threshold trap

The datasheet's **gate threshold** $V_{GS(th)}$ is the gate voltage at which a tiny current (typically 250 µA) begins to flow. It says where the MOSFET starts to turn on, not where it is on. What matters is the on-resistance $R_{DS(on)}$ at the gate voltage you will actually apply, listed at the head of the datasheet:

| Part | Type | $R_{DS(on)}$ is specified at | From a 3.3 V pin |
|---|---|---|---|
| AO3400 | 30 V, SOT-23, a few amperes | 2.5 V and up: tens of milliohms | works well |
| IRLZ44N | 55 V, TO-220, tens of amperes | 4 V and up | fine for moderate current: check the curves |
| IRF520, IRF540 | 100 V, TO-220 | 10 V | **not fully on**: the threshold is 2 to 4 V |

The cheap "MOSFET driver" modules sold for Arduino often carry an IRF520, which is designed for 10 V gates. At 3.3 V it passes a little current and then gets hot. Look for *logic level* in the description, or for an $R_{DS(on)}$ figure at 2.5 V or 4.5 V.

### The standard circuit

The N-channel MOSFET goes on the ground side of the load: **source to ground, drain to the load, load to the supply**. From the pin:

- **a resistor of 100 to 220 Ω** in series with the gate, to limit the charging pulse and tame ringing;
- **a 10 to 100 kΩ resistor from gate to ground**, so the gate is held off while the pin floats at reset;
- **a flyback diode** across any coil or motor ([[diodes-in-esp-circuits]]).

The MOSFET has a **body diode** from source to drain, so it also conducts backwards, a fact that matters for reversed supplies and for H-bridges ([[dc-motors-and-h-bridges]]).

### Heat

The loss is $P = I^2 R_{DS(on)}$. A 2 A strip through 50 mΩ dissipates 0.2 W, which a SOT-23 part handles with its warm copper. At 20 A the same part would need a heat sink or a better MOSFET. Switching a high frequency adds loss while the gate charges.

### Switching the positive side

A P-channel MOSFET switches the high side, but its gate must rise to the load's supply to turn it off. A 3.3 V pin cannot do that for a 12 V load; a small NPN or N-channel MOSFET pulls the gate down instead, and inverts the logic.

> [!key] Pick a MOSFET whose on-resistance is specified at 2.5 V to 4.5 V of gate drive, wire it low-side with a gate resistor, a gate pull-down and a flyback diode for coils, and it switches amperes from a 3.3 V pin almost for free.`,
  ideas: [
    `A MOSFET is controlled by gate voltage; once the gate is charged it draws no current, and when on it has a resistance of milliohms.`,
    `The gate threshold is where conduction starts, not where the switch is fully on: look for the on-resistance specified at 2.5 V to 4.5 V.`,
    `The standard circuit: source to ground, a 100 to 220 Ω gate resistor, a 10 to 100 kΩ gate pull-down and a flyback diode across a coil.`,
    `The loss is I²·Rds(on); a P-channel high-side switch needs its gate pulled up to the load supply, which a 3.3 V pin cannot do alone.`
  ],
  pitfalls: [
    `The threshold is 2 V, so 3.3 V turns it fully on — The threshold marks the very start of conduction. Between 2 V and the 10 V the datasheet quotes for IRF540-class parts the resistance is high, and the part dissipates watts.`,
    `Any MOSFET module from a shop will do — Many are built around IRF520s that expect a 10 V gate. Check the part number and its on-resistance at 3.3 V.`,
    `The gate needs no resistor or pull-down because it draws no current — The gate has capacitance, so the pin delivers a current spike at every edge, and a floating gate at reset picks up noise and half-switches the load.`
  ],
  terms: [
    { term: 'Logic-level MOSFET', def: `A power MOSFET whose on-resistance is specified at a low gate voltage (2.5 V, 4.5 V), so that a 3.3 V or 5 V logic pin can switch it fully on.` },
    { term: 'Gate threshold voltage', also: ['Vgs(th)', 'VGS(th)'], def: `The gate-to-source voltage at which a MOSFET just begins to conduct (at a specified small current). It is far below the voltage needed to switch the part fully on.` },
    { term: 'On-resistance', also: ['Rds(on)', 'RDS(on)'], def: `The drain-to-source resistance of a MOSFET that is fully on, in milliohms. The loss in the switch is the load current squared times this resistance.` },
    { term: 'Body diode', def: `The diode that exists inside every power MOSFET between source and drain. It conducts when the voltage across the switch is reversed, which a motor or a reversed supply can cause.` },
    { term: 'Gate pull-down', def: `A resistor of 10 to 100 kΩ from a MOSFET's gate to ground that keeps the switch off while the driving pin is undefined, for example during reset.` }
  ],
  choose: {
    good: [`AO3400-class logic-level MOSFETs in SOT-23 for a few amperes`, `IRLZ44N or similar for tens of amperes with a heat sink`, `Low-side N-channel switching with a gate resistor and a pull-down`],
    avoid: [`IRF520 / IRF540 and other 10 V-gate parts driven from 3.3 V`, `A floating gate with no pull-down`, `A P-channel high-side switch driven straight from a 3.3 V pin on a higher supply`],
    check: [`Rds(on) in the datasheet at the gate voltage the pin gives`, `The drain current, voltage rating and dissipation against the load`, `That any coil or motor has a flyback diode`]
  },
  code: [
    {
      title: 'Fade a 12 V LED strip with a MOSFET',
      about: `A logic-level MOSFET on GPIO4 switches a 12 V LED strip, and PWM at 1 kHz fades it up and down. The loop keeps the time with the clock, so it is never stuck waiting. GPIO4 is also a good pin for a gate: it has a pull-down while the chip resets.`,
      needs: `An ESP32 DevKit, a logic-level N-channel MOSFET (for example an AO3400 breakout or an IRLZ44N), a 150 Ω gate resistor, a 47 kΩ gate pull-down, a 12 V LED strip (under 2 A) with its own 12 V supply, grounds joined.`,
      wiring: [['GPIO4', '150 Ω → MOSFET gate; 47 kΩ from gate to GND'], ['MOSFET source', 'GND of the ESP and of the 12 V supply'], ['MOSFET drain', 'strip negative (−)'], ['strip +', '+12 V supply']],
      blocks: `
        when started
          set PWM on pin (4) frequency (1000) resolution (10)
          set [level v] to (0)
          set [step v] to (8)
          set [last v] to (milliseconds since start)
        forever
          if <((milliseconds since start) - (last)) ≥ (10)> then
            change [last v] by (10)
            change [level v] by (step)
            if <<(level) ≥ (1023)> or <(level) ≤ (0)>> then
              set [step v] to ((step) * (-1))
            end
            set PWM on pin (4) to (level)
          end
        end
      `,
      cpp: String.raw`
        const int GATE_PIN = 4;
        const int PWM_FREQ = 1000;       // Hz
        const int PWM_BITS = 10;         // duty 0 .. 1023
        const uint32_t STEP_MS = 10;

        int level = 0;
        int step = 8;
        uint32_t last = 0;

        void setup() {
          ledcAttach(GATE_PIN, PWM_FREQ, PWM_BITS);
          ledcWrite(GATE_PIN, 0);
        }

        void loop() {
          uint32_t now = millis();
          if (now - last >= STEP_MS) {
            last += STEP_MS;
            level += step;
            if (level >= 1023) { level = 1023; step = -step; }
            if (level <= 0)    { level = 0;    step = -step; }
            ledcWrite(GATE_PIN, level);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        GATE_PIN = 4
        STEP_MS = 10

        pwm = PWM(Pin(GATE_PIN), freq=1000, duty_u16=0)   # 1 kHz
        level = 0                                          # 0 .. 1023, as in the other versions
        step = 8
        last = time.ticks_ms()

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) >= STEP_MS:
                last = time.ticks_add(last, STEP_MS)
                level += step
                if level >= 1023:
                    level = 1023
                    step = -step
                if level <= 0:
                    level = 0
                    step = -step
                pwm.duty_u16(level * 64)                   # 1023 * 64 = 65472 of 65535
      `,
      notes: [`The strip's own supply must share ground with the ESP, and the MOSFET sits in the ground wire of the strip, so the strip's positive wire is always live.`, `1 kHz is audible only if the strip or the supply whines; 5 kHz to 20 kHz is common for LED strips: see [[driving-leds-with-pwm]]. A bigger MOSFET, or a faster edge, may need a gate driver above about 20 kHz.`, `An LED strip of several amperes needs thick wire and a fuse: see [[powering-led-strips]].`]
    }
  ],
  formulas: [
    {
      name: 'Loss in a MOSFET switch',
      expr: 'P = I^2*Rds',
      tex: 'P = I^2 \\, R_{DS(on)}',
      vars: {
        P: { name: 'power lost in the MOSFET', q: 'power', unit: 'W' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 2 },
        Rds: { name: 'on-resistance at the gate voltage used', tex: 'R_{DS(on)}', q: 'resistance', unit: 'mΩ', value: 50 }
      },
      solveFor: 'P',
      note: `Use the on-resistance at your gate voltage, hot: it rises by about half again between 25 °C and 100 °C. A SOT-23 part is happy with a few tenths of a watt; a TO-220 part with a heat sink handles several watts.`,
      stories: { P: 'A MOSFET with {Rds} of on-resistance at the gate voltage in use carries {I}. How much power does it dissipate?', I: 'A MOSFET with {Rds} on-resistance may dissipate {P}. What current can it carry?' },
      practice: { unknowns: ['P', 'I'] }
    }
  ],
  examples: [
    {
      title: 'Will the AO3400 stay cool?',
      q: `A 12 V LED strip draws 2.5 A. A SOT-23 MOSFET has an on-resistance of about 50 mΩ with 3.3 V on the gate. How much heat is produced?`,
      steps: [`$P = I^2 R = 2.5^2 \\times 0.05 = 0.31$ W.`, `A SOT-23 package can dissipate a few tenths of a watt without trouble if it has some copper to spread the heat, so it will be warm but safe.`, `A strip of 5 A would produce $1.25$ W, which a SOT-23 cannot take: use a TO-220 or a DPAK part with a larger area.`],
      a: `About 0.31 W: acceptable for a small surface-mount part with some copper under it.`
    }
  ],
  quiz: [
    { q: `An IRF540 has a gate threshold of 2 to 4 V. Is it a good switch for a 3.3 V ESP32 pin?`, choices: [`Yes, 3.3 V is above the threshold`, `No: it is specified for a 10 V gate and is only partly on at 3.3 V`, `Yes, but only above 5 A`, `No, because it cannot be PWM-driven`], a: 1, why: `The threshold is only where conduction begins. At 3.3 V the resistance is still high, so the part passes limited current and dissipates much heat. Choose a logic-level part.` },
    { q: `What does the 47 kΩ resistor from gate to ground do?`, choices: [`It limits the gate current`, `It holds the MOSFET off while the pin is floating, for instance during reset`, `It speeds up switch-off at 20 kHz`, `It sets the MOSFET's threshold`], a: 1, why: `During reset the pin floats; without a pull-down the gate can drift up and switch the load on at random. The gate itself draws no current, so a large resistor is enough.` },
    { q: `A MOSFET with 40 mΩ on-resistance carries 3 A. What power does it dissipate?`, choices: [`0.12 W`, `0.36 W`, `1.2 W`, `120 W`], a: 1, why: `P = I² R = 9 × 0.04 = 0.36 W.` },
    { q: `A P-channel MOSFET switches the positive side of a 12 V load, and its gate is wired straight to a 3.3 V pin. What is wrong?`, choices: [`Nothing: low turns it on, high turns it off`, `With the pin high the gate is still 8.7 V below the source, so the MOSFET stays on`, `The load can never turn on`, `The gate resistor is too small`], a: 1, why: `A P-channel MOSFET turns off only when its gate is near the source voltage (12 V). A 3.3 V pin cannot reach it. A small NPN transistor or N-channel MOSFET must pull the gate, inverting the logic.` }
  ],
  applications: [
    `Dimming a 12 V or 24 V LED strip, a lamp or a heater element with PWM.`,
    `Switching a pump, a solenoid valve or a fan from a battery or a separate supply.`,
    `Cutting power to a sensor between readings to save battery, as a load switch.`,
    `One half of an H-bridge for a motor.`
  ],
  sources: [
    `Manufacturers' datasheets for the AO3400 (Alpha and Omega Semiconductor), the IRLZ44N and the IRF540 / IRF520 (Infineon / Vishay): the on-resistance tables and the gate-threshold definition.`,
    `Hyper Electronics, the MOSFET switch and gate-drive pages.`,
    `Espressif, ESP32 datasheet: GPIO characteristics and the LED PWM controller.`
  ],
  sim: 'ac-mosfet-gate'
},

/* ================================================================ relays */
{
  id: 'relays',
  parent: 'active-components',
  title: 'Relays and relay modules',
  level: 2,
  short: `A relay is an electromagnet that moves a pair of contacts: a pin switches a coil, and the contacts switch a load that may be of another voltage altogether. Ready-made modules add the driver, the diode and an optocoupler, and most of them switch on when the input is low.`,
  keywords: ['relay', 'relay module', 'coil', 'COM NO NC', 'contacts', 'active low', 'JD-VCC', 'optocoupler', 'SRD-05VDC', 'flyback', 'contact rating', 'latching relay', 'reed relay', 'click', 'relay board', 'isolated'],
  prereq: ['transistor-as-a-switch', 'diodes-in-esp-circuits', 'electronics:relays', 'optocouplers'],
  related: ['solid-state-relays-and-triacs', 'switching-mains-safely', 'switching-dc-loads', 'relay-and-industrial-boards', 'pins-at-boot', 'mosfets-for-loads', 'esp32-devkitc'],
  body: `A relay is the oldest remote-controlled switch: a coil that, when current flows, pulls an armature and moves a set of contacts. The coil circuit and the contact circuit are separate, so the relay can switch a mains lamp, a 24 V valve or a car's headlights with a 3.3 V pin, and nothing electrical connects the two sides. The three contact terminals are **COM** (common), **NO** (normally open, connected to COM when the coil is on) and **NC** (normally closed, connected when it is off).

> [!warn] Switching mains (110 to 230 V) is work for a qualified person: the wiring must follow the local code, sit behind proper isolation and inside an enclosure. A bare relay board on a desk with mains on its terminals is not a product, and a mistake can kill. If the device you reflash switches mains, it means opening it, never while it is plugged in.

### The coil, and why a module

A common 5 V relay (the blue SRD-05VDC type) takes about 70 to 90 mA at 5 V: far beyond a pin and beyond the board's 3.3 V regulator. A coil therefore needs a transistor, a flyback diode and its own 5 V supply ([[transistor-as-a-switch]], [[diodes-in-esp-circuits]]). A **relay module** puts all that on a board, usually with an **optocoupler** between the input and the coil circuit. You connect VCC (5 V), GND and IN.

### What to know about a module

- **The input is usually active low.** The optocoupler's LED sits between the module's supply and the IN pin, so IN low switches the relay on. Write LOW to energise, HIGH to release; keep that inversion in one function.
- **3.3 V logic mostly works, not always.** Some modules, supplied at 5 V, leave a high 3.3 V input conducting a little, so the relay does not release cleanly. Put the pin in input mode (floating) to switch off, or choose a module advertised for 3.3 V.
- **JD-VCC and the jumper.** Many modules have a separate coil supply. With the jumper removed and a separate supply on JD-VCC, the control side and the coil side share nothing, and the isolation is real.
- **The pin at boot.** While the chip resets, the pin floats and the relay may click. Choose a pin that is quiet at boot ([[pins-at-boot]]) and fit the pull-up the module expects.

### The contacts

The rating on the case, for example 10 A at 250 V AC or 30 V DC, applies to resistive loads. A DC load is harder: the arc does not die at a zero crossing, so the DC rating is lower. Motors, lamps and transformers draw several times their running current at start-up. A relay lasts roughly 100 000 operations at full load, millions at light load. It takes about 10 ms to close, with a few milliseconds of contact bounce. Do not switch a relay more often than every few seconds; for frequent or silent switching choose a solid-state relay ([[solid-state-relays-and-triacs]]).

> [!key] A relay module is a transistor, a diode and an optocoupler around a coil: give it its own 5 V, treat the input as active low, and keep the rated contact current well above the load, particularly for DC.`,
  ideas: [
    `A relay separates the coil circuit from the contact circuit, so a 3.3 V pin can switch a load of any voltage within the contacts' rating.`,
    `A relay coil takes tens of milliamps at 5 V, which a pin cannot give: a transistor, a flyback diode and a 5 V supply are needed, and a module already has them.`,
    `Most relay modules are active low, and some do not release cleanly from a 3.3 V high: test your module and switch it off by floating the pin if needed.`,
    `Contact ratings are for resistive loads, and DC and inductive loads are much harder on the contacts than AC resistive ones.`
  ],
  pitfalls: [
    `A relay rated 10 A switches 10 A of anything — The 10 A is for a resistive AC load. A DC motor or a lamp, with its starting current and arc that does not die at a zero crossing, can weld the contacts at a fraction of the rating.`,
    `The relay module can be powered from the 3V3 pin — The coil needs 5 V and 70 to 90 mA. Use the board's 5 V pin (USB) or a separate supply and share the ground.`,
    `HIGH switches the relay on — On most modules the input is active low: LOW energises the coil. Write HIGH as the pin becomes an output, or the relay clicks on at start-up.`
  ],
  terms: [
    { term: 'Relay', def: `An electromechanical switch: a coil whose current pulls an armature and moves one or more sets of contacts, separating the control circuit from the switched circuit.` },
    { term: 'COM, NO, NC', also: ['common', 'normally open', 'normally closed'], def: `The contact terminals of a relay. COM is the moving contact; NO is joined to it when the coil is energised, NC when it is not.` },
    { term: 'Relay module', also: ['relay board'], def: `A small board carrying a relay with its driver transistor, flyback diode, indicator LED and often an optocoupler, with screw terminals for the contacts.` },
    { term: 'Active-low input', also: ['active low', 'low-level trigger'], def: `An input that switches the function on when the pin is low. Most relay modules are active low: the optocoupler LED is lit by pulling the pin to ground.` },
    { term: 'JD-VCC', also: ['coil supply jumper'], def: `The separate coil supply pin found on many relay modules. With the jumper to VCC removed and a separate supply fitted, the control side and the coil side are electrically isolated.` },
    { term: 'Latching relay', also: ['bistable relay'], def: `A relay that keeps its position without current and needs only a short pulse to change, so it draws no power while on or off.` }
  ],
  choose: {
    good: [`A 5 V relay module with an optocoupler for occasional switching`, `A separate coil supply on JD-VCC where isolation matters`, `Latching relays for battery-powered devices that must hold a state`],
    avoid: [`Switching mains on a bare board outside an enclosure`, `A relay for fast or frequent switching, or for PWM`, `Powering the coil from the 3V3 pin`],
    check: [`The contact rating for your load type (AC or DC, resistive or inductive)`, `That the module releases cleanly from a 3.3 V high`, `That the pin is quiet while the chip boots`]
  },
  code: [
    {
      title: 'Switch a relay module every five seconds',
      about: `The relay module's input is on GPIO26 and is active low. One function holds the inversion, so the rest of the program speaks of "on" and "off". The pin is set high before it becomes an output, so the relay does not click on at start-up. The loop switches the relay every five seconds without waiting.`,
      needs: `An ESP32 DevKit and a 5 V relay module with an active-low input. Use a lamp on a safe low voltage, not mains, for first tests.`,
      wiring: [['GPIO26', 'module IN'], ['5V (VIN)', 'module VCC', 'the coil needs 5 V'], ['GND', 'module GND'], ['COM / NO', 'the test load, on a safe low voltage']],
      blocks: `
        define switch relay (on)
          if <on> then
            set pin (26) to [LOW v]     // active low: LOW energises the coil
          else
            set pin (26) to [HIGH v]
          end

        when started
          set pin (26) to [HIGH v]      // off first, then drive it
          set pin (26) as [output v]
          set [relayOn v] to <false>
          start serial at (115200) baud

        every (5) seconds
          set [relayOn v] to <not <relayOn>>
          switch relay (relayOn) :: my
          print (join [relay on: ] (relayOn))
      `,
      cpp: String.raw`
        const int RELAY_PIN = 26;
        const bool ACTIVE_LOW = true;          // most relay modules
        const uint32_t PERIOD_MS = 5000;

        bool relayOn = false;
        uint32_t last = 0;

        void switchRelay(bool on) {
          relayOn = on;
          digitalWrite(RELAY_PIN, (on == ACTIVE_LOW) ? LOW : HIGH);   // on + active low -> LOW
        }

        void setup() {
          Serial.begin(115200);
          pinMode(RELAY_PIN, OUTPUT);
          switchRelay(false);                   // off at once
        }

        void loop() {
          if (millis() - last >= PERIOD_MS) {
            last += PERIOD_MS;
            switchRelay(!relayOn);
            Serial.printf("relay on: %s\n", relayOn ? "yes" : "no");
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        RELAY_PIN = 26
        ACTIVE_LOW = True                      # most relay modules
        PERIOD_MS = 5000

        relay = Pin(RELAY_PIN, Pin.OUT, value=1)   # value=1 at creation: no click at start-up
        relay_on = False
        last = time.ticks_ms()

        def switch_relay(on):
            global relay_on
            relay_on = on
            relay.value(0 if (on == ACTIVE_LOW) else 1)   # on + active low -> 0

        switch_relay(False)

        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= PERIOD_MS:
                last = time.ticks_add(last, PERIOD_MS)
                switch_relay(not relay_on)
                print("relay on:", "yes" if relay_on else "no")
      `,
      output: `
        relay on: yes
        relay on: no
        relay on: yes
      `,
      notes: [`In the Arduino version the pin is briefly undefined between reset and setup(); a pull-up on the module's input (or a module with one) keeps the relay from clicking during that time.`, `If your module will not release from a 3.3 V high, release it by calling pinMode(RELAY_PIN, INPUT) instead of writing HIGH, and pinMode(OUTPUT) with LOW to energise it.`, `A relay should not be switched faster than every few seconds: let the program refuse a second change until a minimum time has passed.`]
    }
  ],
  examples: [
    {
      title: 'Is the relay big enough?',
      q: `A relay is rated 10 A at 250 V AC and 10 A at 30 V DC. You want to switch a 12 V DC pump that draws 4 A running and about 20 A for a moment at start. Is it suitable?`,
      steps: [`Running current: 4 A is well within 10 A at 12 V DC.`, `Start-up: a motor takes about five times its running current for a moment, so 20 A, twice the rating.`, `The rating is for steady resistive current; a 20 A peak, and a pump that may stall, make welded contacts a real risk.`],
      a: `Marginal. Use a relay rated for 20 A or more, or a MOSFET ([[mosfets-for-loads]]) with a flyback diode, which has no contacts to wear.`
    }
  ],
  quiz: [
    { q: `A relay module is wired, and the relay clicks ON when the ESP32 starts, before the program does anything. What is the most likely cause?`, choices: [`The relay is broken`, `The pin floats or is low during reset while the module is active low`, `The relay needs a flyback diode`, `The coil voltage is too low`], a: 1, why: `On most modules a low input energises the relay, and an undefined or low pin during reset acts as that low. Choose a quiet pin and a pull-up on the input, and write HIGH as the pin becomes an output.` },
    { q: `Why does a relay's rating for DC switching come out lower than for AC?`, choices: [`DC is a higher voltage`, `The arc between opening contacts does not die at a zero crossing`, `DC loads are always inductive`, `AC loads need heavier wire`], a: 1, why: `An AC current passes through zero a hundred times a second and the arc dies out; a DC arc is sustained, and burns the contacts.` },
    { q: `The relay module is powered from the ESP32 board's 3V3 pin. What happens?`, choices: [`It works but slowly`, `The coil gets too little voltage and too much current is taken from the regulator, so the relay does not work reliably`, `Nothing: 3.3 V is enough for any relay`, `The module becomes isolated`], a: 1, why: `A 5 V relay needs about 5 V and 70 to 90 mA, more than the 3.3 V regulator can usually spare. Use the 5 V pin or a separate supply.` },
    { q: `With the JD-VCC jumper removed and a separate supply connected, the control side and the coil side of an optocoupler relay module are electrically isolated.`, a: true, why: `The optocoupler carries only light between the sides. With separate supplies and no shared ground, the ESP's side shares nothing with the coil side, apart from what you connect.` }
  ],
  applications: [
    `Switching a mains lamp, a heater or a pump inside a proper enclosure, in a product built by someone qualified.`,
    `Switching a low-voltage load of a different voltage: a 24 V valve, a 12 V pump, a car circuit.`,
    `Garage-door and gate controllers, which usually simulate a button press with a relay contact.`,
    `Smart plugs and relay boards such as those in [[relay-and-industrial-boards]].`
  ],
  sources: [
    `Relay manufacturers' datasheets (for example the SRD-05VDC-SL-C family): coil data, contact ratings and life.`,
    `Hyper Electronics, the relays page.`,
    `Espressif, ESP32 datasheet: the state of the pins during and after reset.`
  ],
  sim: { id: 'ac-flyback', params: { protect: 'diode' } }
},

/* ================================================================ solid-state-relays-and-triacs */
{
  id: 'solid-state-relays-and-triacs',
  parent: 'active-components',
  title: 'Solid-state relays and triacs',
  level: 3,
  short: `A solid-state relay switches a load with a triac or MOSFETs instead of contacts: silent, fast, and good for millions of operations. An AC type with zero-cross turn-on suits heaters and lamps; it switches whole mains half-cycles, so the control is slow, time-proportional on and off.`,
  keywords: ['SSR', 'solid-state relay', 'triac', 'zero-cross', 'random fire', 'optotriac', 'MOC3041', 'MOC3021', 'snubber', 'burst firing', 'time proportioning', 'Fotek', 'heat sink', 'leakage current', 'heater control', 'phase control', 'dimmer'],
  prereq: ['relays', 'optocouplers', 'electronics:optocouplers', 'electronics:switches'],
  related: ['switching-mains-safely', 'heaters-and-thermal-loads', 'time-proportioning', 'mains-energy-monitoring', 'thermostats', 'thermal-design'],
  body: `A **solid-state relay** (SSR) is a switch with no moving parts: an LED on the input side lights a photo-sensitive triac, or a pair of MOSFETs, on the output side, and the load circuit is isolated from the control circuit by light. It makes no click, does not bounce and does not wear: a relay's contacts last a hundred thousand operations or so, an SSR is limited only by heat.

> [!warn] Mains voltage is dangerous and the terminals of an SSR are live. Wiring one is work for a qualified person, inside an enclosure with the right fusing, isolation and clearances, to the local code. Reflashing a mains device means opening it: never while it is plugged in.

### Kinds of SSR

| Type | Turns on | Use for | Do not use for |
|---|---|---|---|
| AC, zero-cross | at the next zero crossing of the mains | heaters, lamps, resistive loads | phase-angle dimming; some motors |
| AC, random-fire (instant-on) | at once | phase control, inductive loads, with a zero-cross detector | — |
| DC, MOSFET output | at once | DC loads, observing polarity | AC loads |

An AC SSR will not switch DC: a triac that has turned on stays on until the current falls to zero, and DC never does. Conversely, a DC MOSFET SSR cannot switch AC.

### The numbers

- **Input.** A common module accepts 3 to 32 V DC at several milliamps; check that your 3.3 V pin really turns it on, and use a transistor from 5 V if it does not.
- **Drop and heat.** An on triac drops about 1 to 1.6 V, so it dissipates roughly **1 to 1.5 W per ampere**. Above two or three amperes it needs a heat sink; many SSR failures are heat.
- **Leakage.** When off, an SSR still passes a milliampere or two through its snubber, enough to keep a small lamp glowing or a sensitive load energised.
- **Failure mode.** An overheated or over-current SSR usually fails *short*: the load stays on. Heaters need an independent thermal cut-off.
- **Inductive loads** need a **snubber** (a resistor and capacitor across the triac); motors and transformers are better served by a relay or a random-fire type with a snubber designed for them.

### How to control it: whole cycles

A zero-cross SSR changes state only at a zero crossing, 100 or 120 times a second, so fast PWM is pointless. Instead use **burst firing**, also called time-proportional control: choose a window of a few seconds and keep the SSR on for a fraction of it. With a 5 s window, 30 % means 1.5 s on, 3.5 s off. A heater, with its thermal mass, averages this smoothly ([[time-proportioning]], [[thermostats]]).

> [!key] An SSR switches mains silently and without wear, but it dissipates about a watt per ampere, may leak when off, and fails short. With a zero-cross type, control power by time-proportioning over a window of seconds, not by fast PWM.`,
  ideas: [
    `An SSR couples its input LED to a triac or MOSFETs by light: no contacts, no clicking, no wear, but a voltage drop that turns into heat.`,
    `AC zero-cross SSRs suit heaters and lamps; random-fire ones suit phase control; an AC SSR cannot switch DC, nor a DC SSR AC.`,
    `An on SSR dissipates about 1 to 1.5 W per ampere; above two or three amperes it needs a heat sink, and it usually fails short.`,
    `A zero-cross SSR is controlled with burst firing over a window of seconds, not with fast PWM.`
  ],
  pitfalls: [
    `Fast PWM on an SSR dims the load — A zero-cross SSR only changes state at the mains zero crossings, so it cannot follow PWM above a few hertz. Use burst firing over seconds for heaters, a phase-control circuit for lamps.`,
    `The SSR is off, so the load is safe to touch — Leakage current flows through an off SSR, and the load stays at mains potential on one side. Isolate with a proper mains switch before any work.`,
    `A big SSR needs no heat sink because it is rated for the current — The rating assumes a specified heat sink. At 10 A it dissipates 10 to 15 W, which a bare case cannot lose.`
  ],
  terms: [
    { term: 'Solid-state relay', also: ['SSR'], def: `A relay with no moving contacts: an LED on the input optically triggers a triac, thyristors or MOSFETs on the output, which switch the load and isolate it from the control circuit.` },
    { term: 'Zero-cross switching', also: ['zero-crossing detection'], def: `A way of turning an AC solid-state relay on only at the instant the mains voltage passes through zero, which avoids a surge and radio noise but means the relay changes state only at half-cycle boundaries.` },
    { term: 'Triac', def: `A semiconductor switch that conducts in both directions once triggered at its gate, and keeps conducting until the current falls to zero. It is the output device of most AC solid-state relays and dimmers.` },
    { term: 'Snubber', also: ['RC snubber'], def: `A resistor and capacitor in series across a switch, to absorb the voltage spike of an inductive load and prevent a triac from turning on by itself.` },
    { term: 'Burst firing', also: ['time-proportional control', 'slow PWM'], def: `Controlling power by switching an AC load on for whole mains cycles during a window of one to ten seconds: 30 % power means on for 30 % of the window.` }
  ],
  choose: {
    good: [`An AC zero-cross SSR with a heat sink for heaters and lamps`, `Burst firing over a window of 1 to 10 seconds`, `A DC MOSFET SSR for silent DC switching`],
    avoid: [`An SSR for DC when it is an AC type, and the reverse`, `A cheap clone at its full rated current with no heat sink`, `A heater without an independent thermal cut-off`],
    check: [`The input voltage range and current against what the 3.3 V pin can give`, `The off-state leakage for small loads`, `The heat: about 1 to 1.5 W per ampere of load current`]
  },
  code: [
    {
      title: 'Control a heater with a zero-cross SSR: burst firing',
      about: `The SSR's input is on GPIO25. Each 5 s window the SSR is switched on for a fraction POWER of it, here 30 %, and off for the rest. The loop reads the clock and never waits, so a thermostat or sensor could be added to the same loop. A status line is printed at the start of each window.`,
      needs: `An ESP32 DevKit and a DC-input SSR module whose input accepts 3.3 V. For first tests, use a lamp and a safe low-voltage supply or a DC SSR, never mains on a bench.`,
      wiring: [['GPIO25', 'SSR input +', 'a transistor stage if the SSR needs more than the pin can give'], ['GND', 'SSR input −'], ['SSR output', 'in series with the load, by a qualified person, in an enclosure']],
      blocks: `
        when started
          set pin (25) as [output v]
          set pin (25) to [LOW v]
          set [windowStart v] to (milliseconds since start)
          start serial at (115200) baud
        forever
          if <((milliseconds since start) - (windowStart)) ≥ (5000)> then
            change [windowStart v] by (5000)
            print [power 30 %]
          end
          if <((milliseconds since start) - (windowStart)) < (1500)> then
            set pin (25) to [HIGH v]
          else
            set pin (25) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int SSR_PIN = 25;
        const uint32_t WINDOW_MS = 5000;     // one control window
        const float POWER = 0.30;            // fraction of the window the SSR is on

        uint32_t windowStart = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(SSR_PIN, OUTPUT);
          digitalWrite(SSR_PIN, LOW);
        }

        void loop() {
          uint32_t now = millis();
          if (now - windowStart >= WINDOW_MS) {
            windowStart += WINDOW_MS;
            Serial.printf("power %.0f %%\n", POWER * 100);
          }
          bool on = (now - windowStart) < (uint32_t)(POWER * WINDOW_MS);
          digitalWrite(SSR_PIN, on ? HIGH : LOW);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SSR_PIN = 25
        WINDOW_MS = 5000                 # one control window
        POWER = 0.30                     # fraction of the window the SSR is on

        ssr = Pin(SSR_PIN, Pin.OUT, value=0)
        window_start = time.ticks_ms()

        while True:
            now = time.ticks_ms()
            elapsed = time.ticks_diff(now, window_start)
            if elapsed >= WINDOW_MS:
                window_start = time.ticks_add(window_start, WINDOW_MS)
                elapsed = time.ticks_diff(now, window_start)
                print("power", round(POWER * 100), "%")
            ssr.value(1 if elapsed < POWER * WINDOW_MS else 0)
      `,
      output: `
        power 30 %
        power 30 %
        power 30 %
      `,
      notes: [`A thermostat would change POWER from a PID output once per window: see [[time-proportioning]] and [[pid-control]].`, `Over a few seconds the heater's thermal mass averages the bursts; for a lamp the bursts would be visible as flicker, so lamps need phase control instead.`, `Keep a separate hardware thermal fuse on any heater: an SSR usually fails with its contacts closed.`]
    }
  ],
  formulas: [
    {
      name: 'Heat lost in a solid-state relay',
      expr: 'P = Von*I',
      tex: 'P = V_{on} \\, I',
      vars: {
        P: { name: 'power lost in the SSR', q: 'power', unit: 'W' },
        Von: { name: 'on-state voltage drop', tex: 'V_{on}', q: 'voltage', unit: 'V', value: 1.2 },
        I: { name: 'load current', q: 'current', unit: 'A', value: 8 }
      },
      solveFor: 'P',
      note: `A triac-output SSR drops about 1 to 1.6 V. The power is lost as heat in the case, and the heat sink must carry it away.`,
      stories: { P: 'A triac SSR drops {Von} while it carries {I}. How much heat does it generate?' },
      practice: { unknowns: ['P'] }
    }
  ],
  examples: [
    {
      title: 'Heater power over a window',
      q: `A 1 kW heater is switched by a zero-cross SSR over a 5 s window. What on-time gives an average of 400 W, and how many mains half-cycles is that at 50 Hz?`,
      steps: [`The duty is 400 W / 1000 W = 40 %, so the SSR is on for $0.4 \\times 5 = 2$ s.`, `At 50 Hz there are 100 half-cycles a second, so 2 s are 200 half-cycles; a window is 500 half-cycles.`, `The SSR can therefore realise any power in steps of 1/500, or 0.2 %: far finer than needed.`],
      a: `On for 2 s of every 5 s: 200 of the window's 500 half-cycles at 50 Hz.`
    }
  ],
  quiz: [
    { q: `Why is 1 kHz PWM useless on a zero-cross AC SSR?`, choices: [`The ESP cannot produce 1 kHz`, `The SSR changes state only at mains zero crossings, 100 or 120 times a second`, `The LED inside is too slow`, `The load would be silent`], a: 1, why: `A zero-cross SSR waits for the next zero crossing of the mains to turn on, and a triac stops conducting only when the current falls to zero. State changes cannot happen faster than every half-cycle.` },
    { q: `A 10 A load is switched by a triac SSR that drops 1.2 V. What heat does the SSR make?`, choices: [`1.2 W`, `12 W`, `120 W`, `0.12 W`], a: 1, why: `P = V × I = 1.2 V × 10 A = 12 W, which needs a proper heat sink.` },
    { q: `Can an AC SSR switch a 24 V DC motor?`, choices: [`Yes, any SSR can`, `No: a triac stays on once triggered, and DC never falls to zero`, `Yes, if it is zero-cross`, `Yes, with a snubber`], a: 1, why: `A triac turns off only when its current falls below the holding value. With DC the current never reaches zero, so the SSR would stay on after the input is removed. Use a DC MOSFET SSR.` },
    { q: `An SSR that is overheated is more likely to fail with the load permanently off than permanently on.`, a: false, why: `Overstressed triacs usually fail short-circuited, leaving the load on. That is why heaters need an independent thermal cut-off.` }
  ],
  applications: [
    `Temperature control of ovens, kilns, 3D-printer beds and sous-vide cookers, with time-proportional control.`,
    `Silent switching of lamps and appliances in smart plugs and strips, by qualified manufacturers.`,
    `Switching a motor or pump frequently, where relay contacts would wear out.`
  ],
  sources: [
    `SSR manufacturers' datasheets: zero-cross and random-fire types, input range, leakage, derating curves.`,
    `Optotriac driver datasheets (the MOC302x and MOC304x families): the zero-cross variants and snubber guidance.`,
    `Hyper Electronics, the switches and relays pages.`
  ]
},

/* ================================================================ optocouplers */
{
  id: 'optocouplers',
  parent: 'active-components',
  title: 'Optocouplers and isolation',
  level: 2,
  short: `An optocoupler passes a signal as light across a gap, so two circuits with different grounds can talk without any electrical connection. The input is an LED that needs a resistor; the output is a phototransistor that inverts the signal and is slow.`,
  keywords: ['optocoupler', 'optoisolator', 'PC817', '4N35', '6N137', 'CTR', 'current transfer ratio', 'isolation', 'galvanic isolation', 'ground loop', 'isolated input', '24 V input', 'phototransistor', 'digital isolator', 'ISO7721', 'isolated DC-DC'],
  prereq: ['leds', 'transistor-as-a-switch', 'electronics:optocouplers', 'three-volt-logic'],
  related: ['relays', 'solid-state-relays-and-triacs', 'level-shifters', 'isolation-and-long-cables', 'rs-485', 'four-to-twenty-milliamp', 'mains-energy-monitoring'],
  body: `An **optocoupler** (or optoisolator) is an LED and a light-sensitive transistor in one package, with a gap of transparent plastic between them. Current through the LED makes light; the light turns the transistor on. Nothing electrical crosses the gap, so the two sides can have different grounds, different voltages and, within the part's rating (about 5 kV for a PC817), a surge on one side will not reach the other. That is **galvanic isolation**.

### What it is used for

- reading an industrial 12 V or 24 V input, or a switch at the far end of a long cable, without exposing the ESP to it;
- breaking a **ground loop** between two devices whose grounds differ by volts of noise;
- the input stage of a relay module and of a solid-state relay;
- isolating a serial link, with a fast part (see below).

### The input side: an LED

The input is an LED with a forward voltage of about 1.2 V and a maximum of about 50 mA, so it needs a series resistor like any LED: $R = (V_{in} - V_f)/I_F$. For 5 mA from 24 V that is $(24 - 1.2)/0.005 = 4.56$ kΩ, so 4.7 kΩ; from 3.3 V, 390 to 470 Ω.

### The output side: a transistor that inverts

The phototransistor's collector goes to the pin with a pull-up, its emitter to ground. When the LED is lit the transistor conducts and the pin reads **low**; when it is dark the pull-up holds the pin high. The signal is inverted, as with any open-collector stage.

The transistor can pass at most $I_C = \\mathrm{CTR} \\times I_F$, where the **current transfer ratio** is a spread: 50 to 600 % at 5 mA for the PC817, depending on grade, and it falls as the LED ages. Design for half of the nominal value: the transistor must be able to sink the pull-up's current ($3.3\\ \\mathrm{V} / 10\\ \\mathrm{k\\Omega} = 0.33$ mA) with plenty to spare, or the pin never gets low.

### Speed, and the other side's power

A PC817 switches in several microseconds and in practice handles signals up to tens of kilohertz. For serial lines at 115 200 baud and above, use a fast logic-output optocoupler such as the 6N137, or a digital isolator such as the ISO7721. And the far side needs a supply of its own: an isolated DC-DC module, or the field supply. If the two grounds are joined, nothing is isolated.

> [!warn] Detecting mains voltage or its zero crossings with an optocoupler needs resistors and spacings rated for mains. It is mains wiring: leave it to a qualified person, in an enclosure, and never probe it while it is connected.

> [!key] Size the input resistor like an LED resistor, expect an inverted output, keep the output within CTR times the LED current, and remember that isolation also needs a separate supply and separate grounds on the far side.`,
  ideas: [
    `An optocoupler is an LED and a phototransistor in one package: the signal crosses as light, so the two sides share no electrical connection.`,
    `The input needs a series resistor, R = (Vin − 1.2 V)/IF; the output is a transistor with a pull-up, and the signal comes out inverted.`,
    `The current transfer ratio (CTR) varies widely and falls with age: the output can sink only CTR × IF, so design with half the nominal value.`,
    `A PC817 is slow (tens of kilohertz at best); fast serial links need a 6N137-class part or a digital isolator, and the far side needs its own supply.`
  ],
  pitfalls: [
    `The optocoupler isolates, so a shared ground wire is harmless — A shared ground defeats the isolation. The far side must have its own supply and ground, linked to the near side only by the light.`,
    `The output follows the input — The common-emitter output is inverted: a lit LED gives a low pin. Invert it in the program, or use the other pin polarity.`,
    `Any optocoupler works for serial data — A PC817 smears edges over microseconds; at 115 200 baud (8.7 µs per bit) the data are distorted. Choose a high-speed part.`
  ],
  terms: [
    { term: 'Optocoupler', also: ['optoisolator', 'photocoupler'], def: `A component with an LED and a phototransistor (or another light sensor) facing each other in one package, which passes a signal as light and isolates the two circuits electrically.` },
    { term: 'Galvanic isolation', also: ['electrical isolation'], def: `The absence of any conductive path between two circuits, so that they can have different grounds and a fault or surge on one side does not reach the other.` },
    { term: 'Current transfer ratio', also: ['CTR'], def: `The ratio of an optocoupler's output current to the current in its input LED, in per cent. It varies between units, with temperature and with age.` },
    { term: 'Ground loop', def: `A circulating current caused by two grounds of a system that are at slightly different voltages, which adds noise to the signals. Isolation breaks the loop.` },
    { term: 'Digital isolator', also: ['capacitive isolator'], def: `An isolation chip that passes logic signals across a barrier magnetically or capacitively instead of with light: faster and longer-lived than an optocoupler.` }
  ],
  choose: {
    good: [`PC817 or similar for slow inputs: switches, 24 V inputs, relay and SSR drive`, `6N137 or a digital isolator for UART, SPI and RS-485 at speed`, `A separate isolated supply (DC-DC module) for the far side`],
    avoid: [`Sharing a ground wire across the barrier`, `A PC817 for serial data at 115 200 baud or more`, `Driving the LED without a resistor`],
    check: [`The LED current at the lowest input voltage, against the CTR at the end of the part's life`, `That the output can sink the pull-up's current with margin`, `The isolation voltage and the creepage distance on the board`]
  },
  code: [
    {
      title: 'Read an isolated 24 V input',
      about: `A PC817 turns a 24 V input into a clean logic level. Its transistor pulls GPIO27 low when the input is on, so the program inverts it: pressed means 0. The program debounces the input with the clock and prints each change and a running count.`,
      needs: `An ESP32 DevKit, a PC817, a 4.7 kΩ resistor (0.25 W) in series with the LED, and a 24 V DC input signal.`,
      wiring: [['24 V input +', '4.7 kΩ → PC817 pin 1 (anode)'], ['24 V input −', 'PC817 pin 2 (cathode)'], ['GPIO27', 'PC817 pin 4 (collector)', 'internal pull-up on'], ['GND', 'PC817 pin 3 (emitter)']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input with pull-up v]
          set [stable v] to <false>
          set [raw v] to <false>
          set [changedAt v] to (milliseconds since start)
          set [count v] to (0)
        forever
          set [now v] to <(read pin (27)) = [LOW v]>
          if <not <(now) = (raw)>> then
            set [raw v] to (now)
            set [changedAt v] to (milliseconds since start)
          end
          if <<((milliseconds since start) - (changedAt)) ≥ (20)> and <not <(raw) = (stable)>>> then
            set [stable v] to (raw)
            if <stable> then
              change [count v] by (1)
            end
            print (join [input on: ] (stable))
          end
        end
      `,
      cpp: String.raw`
        const int INPUT_PIN = 27;              // PC817 collector: low while the 24 V input is on
        const uint32_t DEBOUNCE_MS = 20;

        bool stableOn = false;                 // debounced state of the field input
        bool rawOn = false;
        uint32_t changedAt = 0;
        uint32_t count = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(INPUT_PIN, INPUT_PULLUP);
        }

        void loop() {
          bool nowOn = (digitalRead(INPUT_PIN) == LOW);    // inverted by the optocoupler
          if (nowOn != rawOn) {
            rawOn = nowOn;
            changedAt = millis();
          }
          if (rawOn != stableOn && millis() - changedAt >= DEBOUNCE_MS) {
            stableOn = rawOn;
            if (stableOn) count++;
            Serial.printf("input %s, count %lu\n", stableOn ? "on" : "off", (unsigned long)count);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        INPUT_PIN = 27                         # PC817 collector: low while the 24 V input is on
        DEBOUNCE_MS = 20

        pin = Pin(INPUT_PIN, Pin.IN, Pin.PULL_UP)
        stable_on = False                      # debounced state of the field input
        raw_on = False
        changed_at = time.ticks_ms()
        count = 0

        while True:
            now_on = (pin.value() == 0)        # inverted by the optocoupler
            if now_on != raw_on:
                raw_on = now_on
                changed_at = time.ticks_ms()
            if raw_on != stable_on and time.ticks_diff(time.ticks_ms(), changed_at) >= DEBOUNCE_MS:
                stable_on = raw_on
                if stable_on:
                    count += 1
                print("input", "on" if stable_on else "off", "count", count)
      `,
      output: `
        input on, count 1
        input off, count 1
        input on, count 2
      `,
      notes: [`With a 4.7 kΩ resistor the LED current is about 4.85 mA at 24 V and 2.2 mA at 12 V: the input still works, with less margin. Size the resistor for the lowest input voltage that must be detected.`, `The pin's internal pull-up (tens of kilohms) is enough for a slow input; a 4.7 kΩ to 10 kΩ external pull-up gives faster edges.`]
    }
  ],
  formulas: [
    {
      name: 'Input resistor of an optocoupler',
      expr: 'R = (Vin - Vf)/If',
      tex: 'R = \\frac{V_{in} - V_f}{I_F}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'kΩ' },
        Vin: { name: 'input voltage', tex: 'V_{in}', q: 'voltage', unit: 'V', value: 24 },
        Vf: { name: 'LED forward voltage', tex: 'V_f', q: 'voltage', unit: 'V', value: 1.2 },
        If: { name: 'LED current', tex: 'I_F', q: 'current', unit: 'mA', value: 5 }
      },
      solveFor: 'R',
      note: `Check the resistor's power, $(V_{in} - V_f) \\times I_F$: 0.11 W at 24 V and 5 mA, comfortably within a 0.25 W part.`,
      stories: { R: 'An optocoupler LED with a forward voltage of {Vf} should carry {If} from a {Vin} input. What series resistor is needed?' },
      practice: { unknowns: ['R', 'If'] }
    },
    {
      name: 'Output current the phototransistor can sink',
      expr: 'Ic = CTR*If/100',
      tex: 'I_C = \\frac{\\mathrm{CTR}}{100\\,\\%}\\, I_F',
      vars: {
        Ic: { name: 'output (collector) current available', tex: 'I_C', q: 'current', unit: 'mA' },
        CTR: { name: 'current transfer ratio (per cent)', tex: '\\mathrm{CTR}', value: 50 },
        If: { name: 'LED current', tex: 'I_F', q: 'current', unit: 'mA', value: 5 }
      },
      solveFor: 'Ic',
      note: `Use half of the nominal CTR for the worst case at the end of life. The result must be well above the pull-up's current (3.3 V divided by its resistance), or the output cannot reach a low level.`,
      stories: { Ic: 'An optocoupler with a CTR of {CTR} per cent carries {If} in its LED. How much current can its transistor sink?' }
    }
  ],
  examples: [
    {
      title: 'Will the pin go low?',
      q: `A PC817 of grade A (CTR 80 % at best) is fed 2.2 mA in its LED. The output has a 10 kΩ pull-up to 3.3 V. Does the pin reach a low level?`,
      steps: [`Take half of 80 %, 40 %, for ageing: $I_C = 0.4 \\times 2.2 = 0.88$ mA.`, `The pull-up demands $3.3 / 10\\,000 = 0.33$ mA.`, `The transistor can sink more than the pull-up supplies, so it saturates and the pin sits at a few tenths of a volt: a clear low.`],
      a: `Yes: 0.88 mA available against 0.33 mA needed. With the internal 45 kΩ pull-up the margin is larger still.`
    }
  ],
  quiz: [
    { q: `A 12 V input drives a PC817 LED through 2.2 kΩ. About what current flows in the LED?`, choices: [`1 mA`, `5 mA`, `12 mA`, `22 mA`], a: 1, why: `$(12 - 1.2)/2200 = 4.9$ mA.` },
    { q: `The input of an optocoupler is lit and the ESP32 pin reads LOW. What does it read when the input is dark?`, choices: [`LOW still`, `HIGH, because the pull-up lifts it`, `Floating`, `Whatever it read before`], a: 1, why: `With the LED dark the phototransistor is off and the pull-up holds the pin high. The signal is inverted: lit means low.` },
    { q: `A PC817 is used to isolate a 115 200 baud serial line, and the data arrive corrupted. Why?`, choices: [`The CTR is too high`, `The optocoupler's edges are several microseconds slow, close to the 8.7 µs bit time`, `The ground is shared`, `The input resistor is too small`], a: 1, why: `A PC817 needs several microseconds to switch each way, which nearly fills the 8.7 µs bit period. A 6N137 or a digital isolator handles megabits.` },
    { q: `A shared ground wire between the two sides of an optocoupler circuit makes no difference to the isolation.`, a: false, why: `Isolation means that there is no conductive path. Joining the grounds creates one, and the ground loop and the surge protection return.` }
  ],
  applications: [
    `Industrial inputs of 12 V and 24 V, as in PLC-style input cards and relay boards.`,
    `Relay modules and solid-state relays, whose inputs are optocoupler LEDs.`,
    `Isolated RS-485 and CAN nodes, in noisy plants or over long cables.`,
    `Zero-crossing detection and the mains-presence sensing of a dimmer, done by qualified designers.`
  ],
  sources: [
    `Sharp, PC817 datasheet: CTR grades, isolation voltage and switching times.`,
    `Datasheets of the 6N137 high-speed optocoupler and of the ISO77xx digital isolators.`,
    `Hyper Electronics, the optocouplers page.`
  ],
  sim: 'ac-opto'
},

/* ================================================================ level-shifters */
{
  id: 'level-shifters',
  parent: 'active-components',
  title: 'Level shifters: talking to 5 V',
  level: 2,
  short: `An ESP pin cannot take 5 V, and a 5 V chip may not recognise the ESP's 3.3 V as a high. Level shifters bridge the two: a buffer for fast one-way signals such as NeoPixel data, a divider for slow ones, and a BSS138 MOSFET for I2C.`,
  keywords: ['level shifter', 'logic level converter', '5 V', '3.3 V', 'BSS138', '74AHCT125', '74HCT245', 'TXS0108E', 'TXB0108', 'PCA9306', 'NeoPixel data', 'WS2812', 'resistor divider', 'VIH', 'I2C level shifting', 'bidirectional', '5 V tolerant'],
  prereq: ['three-volt-logic', 'transistor-as-a-switch', 'mosfets-for-loads', 'electronics:logic-families'],
  related: ['i2c-pull-ups-and-bus-problems', 'addressable-leds', 'powering-led-strips', 'spi-modes-and-speed', 'voltage-dividers-for-inputs', 'optocouplers'],
  body: `The ESP's pins run at 3.3 V and are **not 5 V tolerant**: a 5 V signal on an input is outside the chip's absolute maximum and, sooner or later, damages it. Going the other way is subtler. A chip powered at 5 V has an input threshold $V_{IH}$, the lowest voltage it reads as high, and for ordinary CMOS that is 0.7 times the supply, 3.5 V. The ESP's 3.3 V output is below it. Many 5 V parts work anyway, and a few do so only on a good day.

### First, ask whether you need one

Many "5 V" breakout boards run happily from 3.3 V, and their logic then runs at 3.3 V too. Their pull-ups, if any, go to the board's own supply. Power the board at 3.3 V first; check the voltage on the data lines with a meter before connecting.

### The ways to shift

| Direction | Signal | Part | Note |
|---|---|---|---|
| 3.3 V to 5 V, one way | NeoPixel data, SPI to a 5 V part, an LCD | 74AHCT125, 74HCT245 | powered at 5 V; its input accepts 3.3 V because TTL levels need only 2.0 V |
| 5 V to 3.3 V, one way, slow | echo of an ultrasonic sensor, a 5 V output | resistor divider, 1 kΩ and 2 kΩ | the divider gives 3.33 V; good to some 100 kHz |
| 5 V to 3.3 V, one way, fast | any | 74LVC125 at 3.3 V | 5 V-tolerant inputs |
| two ways, open drain | I2C, 1-Wire | BSS138 and two pull-ups | the standard four-channel breakout |
| two ways, push-pull | SPI, UART, fast | TXS0108E, TXB0108 | weak drivers; dislike strong pull-ups |

### The BSS138 trick

The MOSFET is wired with its gate on the 3.3 V rail, its source on the 3.3 V side of the line and its drain on the 5 V side, with a pull-up on each side. When the 3.3 V side pulls low, the gate-to-source voltage reaches 3.3 V, the MOSFET conducts and pulls the 5 V side low. When the 5 V side pulls low, the body diode pulls the source down, the MOSFET turns on, and both sides go low. Released, each side rises through its own pull-up to its own voltage. The simulation shows an I2C edge crossing it.

### NeoPixels

A WS2812B on 5 V wants $V_{IH} = 0.7 \\times 5\\ \\mathrm{V} = 3.5$ V, which the ESP does not reach. A 74AHCT125 at 5 V, a 330 Ω resistor in series with the data line, and a common ground make it reliable ([[addressable-leds]], [[powering-led-strips]]).

> [!key] Never put 5 V on an ESP pin. Use a 74AHCT-type buffer for one-way 3.3 V to 5 V, a divider for slow signals back, a BSS138 shifter for I2C, and first check whether the 5 V module will simply run at 3.3 V.`,
  ideas: [
    `ESP pins are not 5 V tolerant, and a 5 V CMOS input needs 3.5 V to read a high, which a 3.3 V output does not guarantee.`,
    `For a fast one-way 3.3 V to 5 V signal use a 74AHCT125 or 74HCT245 powered at 5 V: its TTL threshold of 2.0 V accepts 3.3 V.`,
    `A BSS138 and two pull-ups shift an open-drain bus such as I2C in both directions.`,
    `Often the best level shifter is none: power the module from 3.3 V.`
  ],
  pitfalls: [
    `3.3 V is "close enough" to drive any 5 V input — A 5 V CMOS input (a plain 74HC, a WS2812B) needs 3.5 V. It may work on the bench, at room temperature and short wires, and fail in the field.`,
    `A resistor divider shifts any signal — It is one-way and slow: it attenuates 5 V down to 3.3 V, but it cannot raise 3.3 V, and the resistors with the wire capacitance limit the speed.`,
    `Auto-direction shifters work on every bus — The TXB-type are push-pull with weak drivers, and strong I2C pull-ups can hold them. Use a BSS138 board or a PCA9306-type part for I2C.`
  ],
  terms: [
    { term: 'Level shifter', also: ['logic level converter'], def: `A circuit or chip that translates logic levels between two supply voltages, such as a 3.3 V ESP and a 5 V peripheral.` },
    { term: 'Logic threshold', also: ['VIH', 'VIL', 'V_IH'], def: `The input voltage above which a chip reads a high (VIH) and below which it reads a low (VIL). For CMOS they are about 0.7 and 0.3 of the supply; TTL-compatible inputs accept 2.0 V as a high.` },
    { term: '5 V tolerant', def: `Said of an input that withstands 5 V even when the chip itself runs at 3.3 V. The ESP's pins are not 5 V tolerant; the 74LVC family's inputs are.` },
    { term: 'Open-drain bus', also: ['open-collector bus'], def: `A bus on which devices only pull the line low and a pull-up resistor raises it, as I2C does. The BSS138 shifter relies on this.` }
  ],
  choose: {
    good: [`74AHCT125 (or 74HCT245) at 5 V for NeoPixel data and one-way 3.3 V to 5 V`, `A BSS138 four-channel board for I2C and UART at modest speeds`, `A 1 kΩ and 2 kΩ divider for slow 5 V outputs`],
    avoid: [`Connecting a 5 V output straight to an ESP input`, `Auto-direction shifters on an I2C bus with strong pull-ups`, `A BSS138 shifter for SPI above a megahertz or so`],
    check: [`Whether the module works from 3.3 V and needs no shifter at all`, `The thresholds of the receiving chip (VIH) at its own supply`, `The pull-ups on both sides, so that only one set of each is fitted`]
  },
  code: [
    {
      title: 'Drive a 5 V NeoPixel strip through a 74AHCT125',
      about: `GPIO18 goes to the input of a 74AHCT125 powered at 5 V, and its output through a 330 Ω resistor to the strip's data input. The program chases one red pixel along an 8-pixel strip. The level shifter is invisible to the program: it is the same code as for a 3.3 V strip.`,
      needs: `An ESP32 DevKit, a 74AHCT125, a 330 Ω resistor, an 8-pixel WS2812B strip, a 5 V supply for the strip with a 470 µF capacitor across it, and the Adafruit NeoPixel library for the Arduino version.`,
      libs: ['Adafruit NeoPixel'],
      wiring: [['GPIO18', '74AHCT125 pin 2 (1A)'], ['74AHCT125 pin 3 (1Y)', '330 Ω → strip DIN'], ['74AHCT125 pin 1 (1OE)', 'GND', 'enables the buffer'], ['74AHCT125 VCC (pin 14)', '+5 V, with a 100 nF capacitor to GND'], ['grounds', 'ESP GND, 74AHCT125 GND and strip GND joined']],
      blocks: `
        when started
          start pixel strip on pin (18) with (8) pixels, brightness (40) :: light
          set [i v] to (0)
        forever
          clear all pixels :: light
          set pixel (i) to colour (255) (0) (0)
          show pixels
          wait (0.1) seconds
          change [i v] by (1)
          if <(i) ≥ (8)> then
            set [i v] to (0)
          end
        end
      `,
      cpp: String.raw`
        #include <Adafruit_NeoPixel.h>

        const int LED_PIN = 18;                 // to the 74AHCT125, not to the strip
        const int LED_COUNT = 8;
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

        void setup() {
          strip.begin();
          strip.setBrightness(40);              // 0 - 255
        }

        void loop() {
          for (int i = 0; i < LED_COUNT; i++) {
            strip.clear();
            strip.setPixelColor(i, strip.Color(255, 0, 0));
            strip.show();
            delay(100);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 18                            # to the 74AHCT125, not to the strip
        LED_COUNT = 8
        np = NeoPixel(Pin(LED_PIN), LED_COUNT)
        RED = (40, 0, 0)                        # about full red at brightness 40 of 255

        while True:
            for i in range(LED_COUNT):
                np.fill((0, 0, 0))
                np[i] = RED
                np.write()
                time.sleep_ms(100)
      `,
      notes: [`Keep the wire from the shifter to the strip short, and put the resistor close to the first pixel's DIN.`, `Switch the strip's 5 V on before the data, or the first pixel may be powered through its data pin.`, `An RGB LED on a DevKit is on 3.3 V and needs none of this: see [[addressable-leds]].`]
    }
  ],
  examples: [
    {
      title: 'A divider for a 5 V echo pin',
      q: `An ultrasonic sensor's echo output swings to 5 V. Design a divider to bring it to a safe level for an ESP32 input.`,
      steps: [`Use $R_1 = 1\\ \\text{k}\\Omega$ in series and $R_2 = 2\\ \\text{k}\\Omega$ to ground: $V_{out} = 5 \\times 2 / 3 = 3.33$ V.`, `The load on the sensor is 5 V / 3 kΩ = 1.7 mA: acceptable for a signal pin.`, `With 10 pF of wiring and pin capacitance, the divider's output impedance of 667 Ω gives a time constant of about 7 ns: far faster than an echo pulse of hundreds of microseconds.`],
      a: `1 kΩ and 2 kΩ give 3.33 V and are fast enough for a slow signal such as an echo; for fast edges use a 74LVC buffer.`
    }
  ],
  quiz: [
    { q: `Why can a 74AHCT125 powered at 5 V accept a 3.3 V input from an ESP?`, choices: [`It is 5 V tolerant at any supply`, `Its input threshold is TTL-compatible: about 2.0 V`, `It contains a voltage doubler`, `The ESP drives it at 5 V`], a: 1, why: `The AHCT family has TTL-compatible inputs, which read 2.0 V and above as high; a 3.3 V output is comfortably above. A plain 74HC at 5 V would need 3.5 V.` },
    { q: `Which level shifter suits an I2C bus between a 3.3 V ESP and a 5 V sensor?`, choices: [`A 1 kΩ and 2 kΩ divider`, `A 74AHCT125`, `A BSS138 with a pull-up on each side`, `A TXB0108`], a: 2, why: `I2C is bidirectional and open drain. A divider and a buffer work only one way; the BSS138 circuit passes the low in both directions and lets each side rise through its own pull-up.` },
    { q: `A 5 V WS2812B strip works from the ESP's 3.3 V data pin on the bench but fails in a long installation. Why?`, choices: [`The ESP's output is exactly at the threshold: 3.3 V against the 3.5 V the strip needs`, `The strip needs a ground wire only`, `WS2812B inputs are 3.3 V devices`, `3.3 V is too high`], a: 0, why: `At a 5 V supply the strip wants 0.7 × 5 V = 3.5 V for a high. 3.3 V is below that, so it works only with margin from temperature, supply and wire length. A level shifter removes the gamble.` },
    { q: `An ESP32 input pin is safe with a 5 V signal if a 10 kΩ resistor is placed in series.`, a: false, why: `A series resistor limits the current into the pin's protection diode, but the pin's voltage is still above the supply and the diode conducts, feeding 5 V into the chip's 3.3 V rail. Use a divider or a level shifter.` }
  ],
  applications: [
    `Driving 5 V NeoPixel and APA102 strips from an ESP.`,
    `Connecting a 5 V I2C sensor, a 5 V character LCD or a 5 V Arduino shield to an ESP.`,
    `Reading the 5 V output of an ultrasonic sensor or a 5 V logic output.`
  ],
  sources: [
    `NXP, application note AN10441 on level shifting techniques in I2C-bus design (the BSS138 circuit).`,
    `Datasheets of the 74AHCT125, 74LVC125, TXS0108E and PCA9306 level-shifting parts.`,
    `Worldsemi, WS2812B datasheet: input thresholds as a fraction of the supply.`
  ],
  sim: 'ac-level-shift'
},

/* ================================================================ io-expanders-and-shift-registers */
{
  id: 'io-expanders-and-shift-registers',
  parent: 'active-components',
  title: 'More pins: expanders and shift registers',
  level: 2,
  short: `When the pins run out, a chip can supply more: an I2C expander such as the MCP23017 gives 16 pins and interrupts on two wires; a 74HC595 gives eight outputs, a 74HC165 eight inputs, from three, and chains for as many as you like.`,
  keywords: ['I/O expander', 'port expander', 'MCP23017', 'MCP23S17', 'PCF8574', '74HC595', '74HC165', 'shift register', 'latch', 'daisy chain', 'more pins', 'SER', 'SRCLK', 'RCLK', 'output enable', 'interrupt pin', 'LED matrix driver'],
  prereq: ['i2c', 'spi', 'digital-output', 'electronics:shift-registers'],
  related: ['keypads-and-matrices', 'led-matrices', 'seven-segment-displays', 'level-shifters', 'planning-pins', 'i2c-addresses-and-scanning', 'registers-and-datasheets'],
  body: `An ESP has plenty of pins until the project has a keypad, sixteen LEDs and a relay bank. Rather than change the chip, add pins with a chip that has them.

### Two families

**An I2C expander** is a small peripheral with a register for each port. The **MCP23017** has 16 pins in two ports; each pin is an input or an output, with an optional pull-up of about 100 kΩ, can sink or source up to 25 mA, and can raise an interrupt on one of two output pins when an input changes. Its address is 0x20 plus the three address pins, so up to eight share a bus: 128 pins on two wires. The **PCF8574** is simpler: eight pins, "quasi-bidirectional", which means a pin's output can sink 25 mA but sources only about 100 µA, so a LED must be wired to the supply and lit by a low level. Its addresses are 0x20 to 0x27 (0x38 to 0x3F for the PCF8574A); LCD backpacks use it.

**A shift register** moves bits through a chain of flip-flops. The **74HC595** takes a bit stream and presents it as eight parallel outputs: you shift in eight bits with a clock, then give a pulse on the **latch** (RCLK) to copy them to the outputs. The **74HC165** does the reverse: a pulse on its load pin captures eight inputs, and a clock shifts them out. Both chain: connect one's serial out to the next one's serial in, and 16 or 24 pins cost the same three or four ESP pins.

### Which to use

| Need | Choose | Why |
|---|---|---|
| inputs and outputs mixed, with interrupts | MCP23017 | each pin set individually |
| many LEDs or relays, fast | 74HC595 chain on SPI | 1 µs per byte at a few MHz |
| many switches | 74HC165 chain, or a keypad matrix | simple, cheap |
| a spare I2C bus | MCP23017 | no extra GPIO at all |

An I2C expander is slower: at 400 kHz a three-byte write takes about 80 µs, and every I2C device on the bus shares the time. A shift register on SPI is faster than any ESP needs.

### Habits that avoid trouble

- **Latch.** Outputs change only when the latch pulses, never while bits are shifted in, so partial patterns are never seen.
- **Start-up.** A 74HC595's outputs are undefined at power-up. Pull /OE high with a resistor until the program has sent the first byte, then take it low.
- **Current.** A 595 output gives only a few milliamps (a pin's worth): LEDs yes, relays no; drive those through a transistor ([[transistor-as-a-switch]]) or use a ULN2803.
- **Supply.** Power at 3.3 V. A 74HC at 5 V needs 3.5 V inputs, which the ESP does not give ([[level-shifters]]).

> [!key] An MCP23017 adds 16 pins on the I2C bus you already have; a 74HC595 or 74HC165 adds eight outputs or inputs per chip from three pins and chains without limit. Latch the outputs, hold /OE high until the first byte is sent, and remember the current of each pin.`,
  ideas: [
    `An MCP23017 gives 16 individually configurable pins with pull-ups and interrupts on the I2C bus; eight of them can share one bus.`,
    `A 74HC595 turns a serial stream into eight outputs, a 74HC165 captures eight inputs; both chain for as many pins as needed.`,
    `Outputs of a shift register change only on the latch pulse, so a partly shifted byte is never visible.`,
    `Expander and register pins give only a few milliamps (the PCF8574 sources far less): drive loads through transistors.`
  ],
  pitfalls: [
    `Shift registers update instantly as I shift — The outputs hold the old byte until the latch pulses; that is the point of the latch. Without the pulse, nothing seems to happen.`,
    `The PCF8574 can drive LEDs high like any pin — Its output pulls up with only about 100 µA. A LED must be wired to the supply and lit by a low level.`,
    `All outputs start off — A 595's outputs are random at power-up. Hold /OE high with a resistor until the program sends a known byte.`
  ],
  terms: [
    { term: 'I/O expander', also: ['port expander', 'GPIO expander'], def: `A chip that adds general-purpose input/output pins to a microcontroller over a serial bus, usually I2C or SPI, with registers to set each pin's direction and read or write its level.` },
    { term: 'Shift register', def: `A chain of flip-flops that moves a bit along one position at each clock pulse. A serial-in parallel-out one (74HC595) adds outputs; a parallel-in serial-out one (74HC165) adds inputs.` },
    { term: 'Latch', also: ['RCLK', 'storage register clock'], def: `A pulse (or the pin that takes it) that copies the bits shifted into a 74HC595 to its output pins all at once, so the outputs never show a half-shifted byte.` },
    { term: 'Daisy chain', also: ['cascade'], def: `Connecting the serial output of one shift register to the serial input of the next, so that one data stream and one clock drive many chips.` },
    { term: 'Quasi-bidirectional pin', def: `A pin that has a weak pull-up and a strong pull-down, as on the PCF8574: writing 1 releases it so that it can be read, but it cannot source more than a trickle.` }
  ],
  choose: {
    good: [`MCP23017 for mixed inputs and outputs, with interrupts, on a bus you already use`, `74HC595 on hardware SPI for many LEDs or a display's segments`, `74HC165 for a bank of switches`],
    avoid: [`Relying on expander pins to drive relays or strips directly`, `A PCF8574 with LEDs wired to ground`, `A 74HC595 at 5 V fed straight from 3.3 V pins`],
    check: [`The I2C address of each expander, so that they do not clash`, `The current per pin and per chip against the load`, `That /OE is held off until the first byte is shifted in`]
  },
  code: [
    {
      title: 'Chase an LED along a 74HC595',
      about: `The program sends one byte to a 74HC595 over SPI and pulses the latch, then moves a single lit LED along the eight outputs. The chain would work the same with more chips: you would send more bytes before the latch.`,
      needs: `An ESP32 DevKit, a 74HC595 and eight LEDs with 330 Ω resistors. Power the 74HC595 from 3.3 V.`,
      wiring: [['GPIO23', '74HC595 SER (pin 14)'], ['GPIO18', 'SRCLK (pin 11)'], ['GPIO4', 'RCLK, the latch (pin 12)'], ['3V3', 'VCC (pin 16) and /SRCLR (pin 10)'], ['GND', 'GND (pin 8) and /OE (pin 13)', 'or /OE to a pull-up until the first byte'], ['Q0 to Q7', 'each → 330 Ω → LED → GND']],
      blocks: `
        when started
          start SPI on SCK (18) MOSI (23) at (1000000) Hz :: bus
          set pin (4) as [output v]
          set [pattern v] to (1)
        forever
          set pin (4) to [LOW v]
          SPI write (pattern) :: bus
          set pin (4) to [HIGH v]           // the latch pulse: the outputs take the new byte
          wait (0.15) seconds
          set [pattern v] to ((pattern) * (2))
          if <(pattern) > (128)> then
            set [pattern v] to (1)
          end
        end
      `,
      cpp: String.raw`
        #include <SPI.h>

        const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23;
        const int PIN_LATCH = 4;
        uint8_t pattern = 1;

        void setup() {
          pinMode(PIN_LATCH, OUTPUT);
          digitalWrite(PIN_LATCH, LOW);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI);
        }

        void loop() {
          SPI.beginTransaction(SPISettings(1000000, MSBFIRST, SPI_MODE0));
          digitalWrite(PIN_LATCH, LOW);
          SPI.transfer(pattern);              // eight bits into the shift register
          digitalWrite(PIN_LATCH, HIGH);      // the latch pulse: the outputs take the new byte
          SPI.endTransaction();
          delay(150);
          pattern <<= 1;                      // the next LED
          if (pattern == 0) pattern = 1;      // 128 << 1 overflows to 0: start again
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import time

        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, bits=8, firstbit=SPI.MSB,
                  sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        latch = Pin(4, Pin.OUT, value=0)
        pattern = 1

        while True:
            latch.value(0)
            spi.write(bytes([pattern]))       # eight bits into the shift register
            latch.value(1)                    # the latch pulse: the outputs take the new byte
            time.sleep_ms(150)
            pattern = (pattern << 1) & 0xFF   # the next LED
            if pattern == 0:
                pattern = 1                   # 128 << 1 overflows to 0: start again
      `,
      notes: [`With two chips in a chain, send two bytes (the second chip's byte first) and pulse the latch once.`, `The first bit shifted in ends up on the last output (QH) after eight clocks: sending the byte most significant bit first puts bit 0 on Q0.`, `delay() is fine for a demonstration; a real display refreshes from a timer or a task: see [[non-blocking-timing]].`]
    },
    {
      title: 'Sixteen pins on two wires: MCP23017',
      about: `Port A of an MCP23017 reads eight buttons, with its internal pull-ups; port B drives eight LEDs. Every 20 ms the program reads port A and writes it, inverted, to port B, so a pressed button (a low) lights its LED. The chip is at address 0x20, with its three address pins grounded.`,
      needs: `An ESP32 DevKit, an MCP23017 on a breakout or breadboard with 4.7 kΩ I2C pull-ups, eight buttons to ground on port A, eight LEDs with 330 Ω resistors on port B.`,
      wiring: [['GPIO21', 'MCP23017 SDA, with a pull-up to 3V3'], ['GPIO22', 'SCL, with a pull-up to 3V3'], ['A0, A1, A2', 'GND (address 0x20)'], ['/RESET', '3V3'], ['GPA0 to GPA7', 'buttons to GND'], ['GPB0 to GPB7', '330 Ω → LED → GND']],
      blocks: `
        define write register (reg) value (value)
          I2C write (reg) then (value) to address (0x20) :: bus

        when started
          start I2C on SDA (21) SCL (22) at (400000) Hz :: bus
          write register (0x00) value (0xFF) :: my
          write register (0x0C) value (0xFF) :: my
          write register (0x01) value (0x00) :: my
        forever
          set [pins v] to (I2C read (1) bytes from address (0x20) register (0x12))
          write register (0x13) value ((255) - (pins)) :: my
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t MCP = 0x20;                  // A0, A1, A2 tied to GND
        const uint8_t IODIRA = 0x00, IODIRB = 0x01, GPPUA = 0x0C, GPIOA = 0x12, GPIOB = 0x13;

        void writeReg(uint8_t reg, uint8_t value) {
          Wire.beginTransmission(MCP);
          Wire.write(reg);
          Wire.write(value);
          Wire.endTransmission();
        }

        uint8_t readReg(uint8_t reg) {
          Wire.beginTransmission(MCP);
          Wire.write(reg);
          Wire.endTransmission(false);             // repeated start
          Wire.requestFrom(MCP, (size_t)1);
          return Wire.available() ? Wire.read() : 0xFF;
        }

        void setup() {
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
          writeReg(IODIRA, 0xFF);                  // port A: all inputs
          writeReg(GPPUA, 0xFF);                   // with pull-ups: a button to GND reads 0
          writeReg(IODIRB, 0x00);                  // port B: all outputs
        }

        void loop() {
          uint8_t pins = readReg(GPIOA);
          writeReg(GPIOB, ~pins);                  // a pressed button (0) lights its LED (1)
          delay(20);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        SDA_PIN, SCL_PIN = 21, 22
        MCP = 0x20                                  # A0, A1, A2 tied to GND
        IODIRA, IODIRB, GPPUA, GPIOA, GPIOB = 0x00, 0x01, 0x0C, 0x12, 0x13

        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=400000)

        def write_reg(reg, value):
            i2c.writeto_mem(MCP, reg, bytes([value]))

        def read_reg(reg):
            return i2c.readfrom_mem(MCP, reg, 1)[0]

        write_reg(IODIRA, 0xFF)                     # port A: all inputs
        write_reg(GPPUA, 0xFF)                      # with pull-ups: a button to GND reads 0
        write_reg(IODIRB, 0x00)                     # port B: all outputs

        while True:
            pins = read_reg(GPIOA)
            write_reg(GPIOB, (~pins) & 0xFF)        # a pressed button (0) lights its LED (1)
            time.sleep_ms(20)
      `,
      notes: [`The register numbers are those of the MCP23017 with its default (BANK 0) addressing: IODIR 0x00/0x01, GPPU 0x0C/0x0D, GPIO 0x12/0x13.`, `For a change-driven design, enable the interrupt-on-change registers and connect INTA or INTB to a GPIO instead of polling every 20 ms: see [[interrupts]].`, `Adafruit's MCP23017 library does the same through readable function names.`]
    }
  ],
  examples: [
    {
      title: 'Pins for a control panel',
      q: `A panel has 24 switches, 24 LEDs and a display on I2C. The ESP32 has 8 pins to spare. Propose an expansion and count the ESP pins used.`,
      steps: [`24 LEDs: three 74HC595 in a chain, driven over SPI: SER, SRCLK, RCLK, three pins, and all 24 outputs update in one latch.`, `24 switches: three 74HC165 in a chain: a clock, a load pulse and one serial-out line, three more pins.`, `The display stays on I2C, on the two pins that are already in use: six new pins in all, within the eight available.`],
      a: `Three 74HC595 and three 74HC165 use six ESP pins; alternatively two MCP23017 on the existing I2C bus would use none.`
    }
  ],
  quiz: [
    { q: `You shift eight bits into a 74HC595 but the LEDs do not change. What is missing?`, choices: [`A pull-up on SER`, `A pulse on RCLK, the latch`, `A faster clock`, `A second chip`], a: 1, why: `The shifted bits sit in the shift register; the outputs change only when the latch pulses and copies them over.` },
    { q: `How many ESP pins does a chain of four 74HC595 chips need?`, choices: [`Four`, `Three: data, clock and latch`, `Sixteen`, `Eight`], a: 1, why: `The chips share clock and latch and pass the data from one to the next, so a chain of any length costs the same three pins.` },
    { q: `LEDs wired from the supply to the pins of a PCF8574 light when the pin is written low. Why not wire them to ground?`, choices: [`Because it is an active-low part`, `Because its pins source only about 100 µA but sink 25 mA`, `Because LEDs need 5 V`, `Because the address would change`], a: 1, why: `The PCF8574 pulls its outputs up weakly and down strongly. Wired the other way the LED would barely glow.` },
    { q: `An MCP23017 and a second MCP23017 can both be on one I2C bus at address 0x20.`, a: false, why: `The three address pins A0, A1 and A2 select 0x20 to 0x27. Two chips at the same address would answer together and corrupt the transfer; tie their address pins differently.` }
  ],
  applications: [
    `Keypads, switch banks and front panels with dozens of buttons and LEDs.`,
    `Driving LED bar graphs, seven-segment digits and small LED matrices with few ESP pins.`,
    `Reading the digital inputs of a PLC-style board, such as the industrial boards of [[relay-and-industrial-boards]].`
  ],
  sources: [
    `Microchip, MCP23017 / MCP23S17 datasheet: register map, addressing and electrical limits.`,
    `Texas Instruments and Nexperia datasheets for the 74HC595 and 74HC165; NXP for the PCF8574.`,
    `NXP, UM10204: the I2C-bus specification.`
  ],
  sim: 'ac-shift-register'
},

/* ================================================================ external-adc-and-dac */
{
  id: 'external-adc-and-dac',
  parent: 'active-components',
  title: 'External ADCs and DACs',
  level: 3,
  short: `The ESP's own converters are good enough for a battery level and not for much more. An ADS1115 reads 16 bits with a programmable gain over I2C; an MCP4725 gives a true 12-bit analogue output where only the ESP32 and S2 have an 8-bit one.`,
  keywords: ['ADS1115', 'ADS1015', 'MCP3008', 'MCP4725', 'external ADC', 'DAC', '16 bit', 'PGA', 'programmable gain', 'differential', 'delta-sigma', 'resolution', 'LSB', '0-10 V', 'analogue output', 'I2C ADC', 'precision'],
  prereq: ['the-esp-adc', 'i2c', 'electronics:adc', 'electronics:dac'],
  related: ['adc-attenuation-and-calibration', 'oversampling-and-noise', 'dac-output', 'op-amps-for-sensors', 'registers-and-datasheets', 'load-cells-and-hx711', 'four-to-twenty-milliamp'],
  body: `The ADC inside the ESP is a convenience. Its twelve bits are 0.8 mV steps over about 3 V, but noise, non-linearity near both ends, and (on the original ESP32) a curve that needs calibration leave fewer good bits than that ([[the-esp-adc]]). It has no differential input and no gain, so a 20 mV signal is a handful of counts. An **external ADC** puts a better converter on the bus.

### The ADS1115

The ADS1115 is a 16-bit delta-sigma converter on I2C: four single-ended inputs or two differential pairs, a **programmable gain amplifier** and 8 to 860 samples a second. The address, 0x48 to 0x4B, is set by wiring the ADDR pin. The full-scale range is chosen in software, and one count is the range divided by 32 768:

| Range | one count (LSB) |
|---|---|
| ±6.144 V | 187.5 µV |
| ±4.096 V | 125 µV |
| ±2.048 V (the default) | 62.5 µV |
| ±1.024 V | 31.25 µV |
| ±0.256 V | 7.8 µV |

Two limits apply. Single-ended readings use only the positive half, so 15 bits. And an input may never exceed the supply plus 0.3 V, whatever range is chosen: at 3.3 V the ±6.144 V setting does not let a 5 V signal in.

Siblings: the ADS1015 is 12 bits and up to 3300 samples a second; the MCP3008 is a 10-bit SPI converter with eight inputs and tens of thousands of samples a second.

### Reading it

A single-shot read is three steps: write the configuration register, which starts a conversion (channel, range, rate); wait for it, 7.8 ms at 128 samples a second; read the conversion register, two bytes, high byte first, a signed number. The ALERT/RDY pin can announce the end of the conversion.

### The DAC side

The ESP32 and the ESP32-S2 have two 8-bit DACs (on the ESP32, GPIO25 and GPIO26); the S3, C3, C6 and others have none. The **MCP4725** is a 12-bit DAC on I2C at 0x60 to 0x63 with a buffered output from 0 V to its supply: $V_{out} = D \\times V_{DD} / 4096$. A PWM pin with an RC filter is a cheap alternative: the cleaner the filter, the slower it follows. A 0 to 10 V output takes an op-amp with a gain of three, powered from 12 V ([[op-amps-for-sensors]]).

> [!key] An ADS1115 gives 16 bits with a gain from ±6.144 V down to ±0.256 V on I2C, and so reads millivolt signals the ESP's ADC cannot; an MCP4725 gives a 12-bit analogue output. Mind the input limit of supply plus 0.3 V.`,
  ideas: [
    `The ESP's 12-bit ADC has noise, non-linearity and no gain: small or precise signals need an external converter.`,
    `The ADS1115 is a 16-bit I2C converter with a programmable gain from ±6.144 V to ±0.256 V and four inputs; one count is the range divided by 32 768.`,
    `An input of the ADS1115 must stay below its supply plus 0.3 V, whatever range is set; single-ended readings use 15 bits.`,
    `Only the ESP32 and ESP32-S2 have a DAC (8 bits, two channels); the MCP4725 adds a 12-bit one with a buffered output over I2C.`
  ],
  pitfalls: [
    `Setting the range to ±6.144 V lets me measure 6 V — The range sets the gain, not the input limit. An input must stay between ground and the supply plus 0.3 V, so a 3.3 V part reads at most 3.6 V.`,
    `16 bits means 16 bits of accuracy — Resolution is not accuracy: noise, offset and the reference limit the real result, and in single-ended use only 15 bits are positive. Averaging and a good layout matter.`,
    `The DAC is on every ESP32 — Only the ESP32 and the S2 have one (8 bits). The S3, C3, C6 and the rest have none: use an external DAC or a PWM pin with a filter.`
  ],
  terms: [
    { term: 'Programmable gain amplifier', also: ['PGA'], def: `An amplifier in front of an ADC whose gain is set by software, so that small signals use the converter's whole range.` },
    { term: 'Delta-sigma converter', also: ['sigma-delta ADC'], def: `An ADC that samples very fast at one bit and averages the stream. It gives high resolution at modest speed with good noise rejection, as the ADS1115 does.` },
    { term: 'Differential input', def: `A measurement between two input pins instead of between one pin and ground, which ignores voltage common to both and suits bridges and shunts.` },
    { term: 'LSB', also: ['least significant bit', 'one count'], def: `The smallest step an ADC or DAC can distinguish: the full-scale range divided by the number of codes.` },
    { term: 'DAC', also: ['digital-to-analogue converter'], def: `A converter that turns a number into a voltage. The ESP32 and ESP32-S2 have two 8-bit ones; an MCP4725 adds a 12-bit one over I2C.` }
  ],
  choose: {
    good: [`ADS1115 for millivolt-level signals, thermocouple amplifiers, shunts and anything that needs more than about 10 bits`, `ADS1015 when 12 bits and speed are enough`, `MCP4725 for a real analogue control voltage`],
    avoid: [`An external ADC for a battery level or a potentiometer: the internal one is enough`, `Expecting 16 bits of accuracy without a clean reference and layout`, `The MCP4725's EEPROM store on every update: it wears out`],
    check: [`The input voltage against the supply plus 0.3 V`, `The I2C address selected by the ADDR or A0 pin`, `The conversion time at the chosen rate before reading the result`]
  },
  code: [
    {
      title: 'Read an ADS1115 over I2C',
      about: `One conversion on input AIN0 against ground, at the ±4.096 V range and 128 samples a second. The program writes the configuration register, which starts the conversion, waits 10 ms, reads the two result bytes and converts counts to volts with 125 µV per count. It works without a library, so you can see the register values.`,
      needs: `An ESP32 DevKit and an ADS1115 breakout powered from 3.3 V (ADDR to GND for 0x48). Connect a voltage between 0 and 3.3 V to AIN0.`,
      wiring: [['GPIO21', 'ADS1115 SDA'], ['GPIO22', 'SCL'], ['3V3', 'VDD'], ['GND', 'GND and ADDR (address 0x48)'], ['AIN0', 'the voltage to measure, 0 to 3.3 V']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz :: bus
        forever
          I2C write (0x01) (0xC3) (0x83) to address (0x48) :: bus    // start one conversion on AIN0, +-4.096 V, 128 SPS
          wait (0.01) seconds
          set [raw v] to (I2C read (2) bytes from address (0x48) register (0x00) as signed 16-bit)
          print (join [counts ] (raw))
          print (join [volts ] ((raw) * (0.000125)))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t ADS = 0x48;                  // ADDR pin to GND
        const float LSB_V = 4.096 / 32768.0;       // 125 microvolts per count at the +-4.096 V range

        int16_t readChannel0() {
          Wire.beginTransmission(ADS);
          Wire.write(0x01);                        // the configuration register
          Wire.write(0xC3);                        // start one conversion, AIN0 against GND, +-4.096 V, single shot
          Wire.write(0x83);                        // 128 samples a second, comparator off
          Wire.endTransmission();
          delay(10);                               // a conversion takes 7.8 ms at 128 samples a second
          Wire.beginTransmission(ADS);
          Wire.write(0x00);                        // the conversion register
          Wire.endTransmission(false);
          if (Wire.requestFrom(ADS, (size_t)2) != 2) return 0;
          int16_t high = Wire.read();
          return (high << 8) | Wire.read();        // a signed 16-bit number, high byte first
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
        }

        void loop() {
          int16_t raw = readChannel0();
          Serial.printf("counts %d  volts %.4f\n", raw, raw * LSB_V);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        SDA_PIN, SCL_PIN = 21, 22
        ADS = 0x48                                 # ADDR pin to GND
        LSB_V = 4.096 / 32768                      # 125 microvolts per count at the +-4.096 V range

        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=400000)

        def read_channel0():
            i2c.writeto_mem(ADS, 0x01, bytes([0xC3, 0x83]))   # config: single shot, AIN0 against GND, +-4.096 V, 128 SPS
            time.sleep_ms(10)                      # a conversion takes 7.8 ms at 128 samples a second
            data = i2c.readfrom_mem(ADS, 0x00, 2)  # the conversion register, high byte first
            raw = (data[0] << 8) | data[1]
            if raw & 0x8000:
                raw -= 65536                       # a signed 16-bit number
            return raw

        while True:
            raw = read_channel0()
            print("counts", raw, " volts", round(raw * LSB_V, 4))
            time.sleep_ms(500)
      `,
      output: `
        counts 13193  volts 1.6491
        counts 13190  volts 1.6488
      `,
      notes: [`The configuration is 0xC383: start (bit 15), AIN0 against ground (100), ±4.096 V (001), single-shot mode, 128 samples a second (100), comparator off (11).`, `For a differential measurement change the input-select bits; Adafruit's ADS1X15 library names the gains and does the same work.`, `A value of −1 or a few counts below zero at 0 V is normal noise; clip it if the sign matters.`]
    },
    {
      title: 'Set an MCP4725 output voltage',
      about: `A sawtooth from 0 V to 3.3 V on the MCP4725's output: the 12-bit code rises by 64 every 20 ms and wraps. The program uses the chip's "fast mode", which writes the DAC register in two bytes and leaves the stored power-on value in its EEPROM alone. The voltage is code × 3.3 V / 4096.`,
      needs: `An ESP32 DevKit and an MCP4725 breakout powered from 3.3 V, with its output measured by a multimeter or an oscilloscope.`,
      wiring: [['GPIO21', 'MCP4725 SDA'], ['GPIO22', 'SCL'], ['3V3', 'VCC'], ['GND', 'GND (A0 to GND for address 0x60)'], ['VOUT', 'the output to measure']],
      blocks: `
        define set DAC (code)
          I2C write ((code) / (256)) then ((code) mod (256)) to address (0x60) :: bus

        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz :: bus
          set [code v] to (0)

        every (0.02) seconds
          set DAC (code) :: my
          print (join [volts ] (((code) * (3.3)) / (4096)))
          change [code v] by (64)
          if <(code) ≥ (4096)> then
            set [code v] to (0)
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t DAC = 0x60;                  // A0 to GND
        const float VDD = 3.3;

        uint16_t code = 0;
        uint32_t last = 0;

        void setDac(uint16_t value) {              // 0 .. 4095
          Wire.beginTransmission(DAC);
          Wire.write((value >> 8) & 0x0F);         // fast mode: the high four bits first
          Wire.write(value & 0xFF);
          Wire.endTransmission();
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
        }

        void loop() {
          if (millis() - last >= 20) {
            last += 20;
            setDac(code);
            Serial.printf("volts %.3f\n", code * VDD / 4096.0);
            code += 64;
            if (code >= 4096) code = 0;
          }
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        SDA_PIN, SCL_PIN = 21, 22
        DAC = 0x60                                  # A0 to GND
        VDD = 3.3

        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=400000)

        def set_dac(value):                         # 0 .. 4095
            i2c.writeto(DAC, bytes([(value >> 8) & 0x0F, value & 0xFF]))   # fast mode: high four bits first

        code = 0
        last = time.ticks_ms()

        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 20:
                last = time.ticks_add(last, 20)
                set_dac(code)
                print("volts", round(code * VDD / 4096, 3))
                code += 64
                if code >= 4096:
                    code = 0
      `,
      output: `
        volts 0.000
        volts 0.052
        volts 0.103
      `,
      notes: [`The "fast mode" write does not touch the EEPROM. The chip's other write commands store the value for the next power-up, but the EEPROM survives only a limited number of writes: never store on every update.`, `Some breakouts use a different address (0x61 to 0x63): scan the bus first, see [[i2c-addresses-and-scanning]].`, `The ESP32 and S2's built-in DAC does this with dacWrite() on GPIO25 and GPIO26, at 8 bits: see [[dac-output]].`]
    }
  ],
  formulas: [
    {
      name: 'ADS1115 counts to volts',
      expr: 'V = raw*Vfs/32768',
      tex: 'V = \\frac{\\mathrm{raw} \\cdot V_{fs}}{32768}',
      vars: {
        V: { name: 'input voltage', q: 'voltage', unit: 'V' },
        raw: { name: 'counts read from the conversion register', tex: '\\mathrm{raw}', value: 13193, int: true, signed: true },
        Vfs: { name: 'full-scale range', tex: 'V_{fs}', q: 'voltage', unit: 'V', value: 4.096 }
      },
      solveFor: 'V',
      note: `The full-scale range is the one chosen in the configuration register: 6.144, 4.096, 2.048, 1.024, 0.512 or 0.256 V. One count is that range divided by 32768.`,
      stories: { V: 'An ADS1115 on the ±{Vfs} range returns {raw} counts. What voltage is that?' },
      practice: { unknowns: ['V', 'raw'] }
    },
    {
      name: 'DAC output voltage',
      expr: 'Vout = D*Vdd/4096',
      tex: 'V_{out} = \\frac{D \\cdot V_{DD}}{4096}',
      vars: {
        Vout: { name: 'output voltage', tex: 'V_{out}', q: 'voltage', unit: 'V' },
        D: { name: 'code written to the DAC', value: 2048, int: true },
        Vdd: { name: 'supply (the reference)', tex: 'V_{DD}', q: 'voltage', unit: 'V', value: 3.3 }
      },
      solveFor: 'Vout',
      note: `For a 12-bit DAC such as the MCP4725 the codes run from 0 to 4095; the highest output is 4095/4096 of the supply. An 8-bit DAC divides by 256.`,
      stories: { Vout: 'An MCP4725 on a {Vdd} supply is given the code {D}. What is its output voltage?', D: 'An MCP4725 on a {Vdd} supply must output {Vout}. What code is needed?' },
      practice: { unknowns: ['Vout', 'D'] }
    }
  ],
  examples: [
    {
      title: 'How fine can a small signal be read?',
      q: `A load-cell bridge gives 0 to 100 mV. Compare the number of steps from the ESP's 12-bit ADC (about 3.1 V full scale) with an ADS1115 on its ±0.256 V range.`,
      steps: [`The ESP: one step is $3.1 / 4096 = 0.76$ mV, so 100 mV is about 132 steps, before noise.`, `The ADS1115 at ±0.256 V: one count is $0.256 / 32768 = 7.8$ µV, so 100 mV is about 12 800 counts.`, `That is about 100 times finer, and the ADS1115's differential input suits a bridge directly.`],
      a: `About 130 steps against 12 800: the external converter is a hundred times finer for this signal.`
    }
  ],
  quiz: [
    { q: `An ADS1115 on the ±2.048 V range returns 16 384 counts. What is the voltage?`, choices: [`0.512 V`, `1.024 V`, `2.048 V`, `4.096 V`], a: 1, why: `One count is 2.048 / 32768 = 62.5 µV, so 16 384 counts is 1.024 V: exactly half of full scale.` },
    { q: `The ADS1115 is powered at 3.3 V and set to the ±6.144 V range. Is a 5 V input safe?`, choices: [`Yes, the range allows it`, `No: the input must not exceed the supply plus 0.3 V`, `Yes, if the gain is 1`, `Only on AIN3`], a: 1, why: `The range is a gain setting and does not widen the input limit, which is the supply plus 0.3 V (3.6 V here). Divide a 5 V signal first.` },
    { q: `Which chips among the ESP32, ESP32-S2, ESP32-S3 and ESP32-C3 have a built-in DAC?`, choices: [`All of them`, `ESP32 and ESP32-S2 only`, `ESP32-S3 and ESP32-C3 only`, `None`], a: 1, why: `The original ESP32 and the S2 each have two 8-bit DAC channels. The S3, C3 and the newer chips have none.` },
    { q: `Setting an MCP4725 to code 3072 on a 3.3 V supply gives an output of about 2.5 V.`, a: true, why: `3072 / 4096 = 0.75, and 0.75 × 3.3 V = 2.475 V.` }
  ],
  applications: [
    `Reading thermocouple amplifiers, pressure sensors and shunt voltages where millivolts matter.`,
    `Data loggers that need a calibrated, stable measurement independent of Wi-Fi activity.`,
    `A programmable bias, a reference or a 0 to 10 V control output for industrial equipment.`
  ],
  sources: [
    `Texas Instruments, ADS1115 datasheet: register map, gain settings and input limits.`,
    `Microchip, MCP4725 datasheet: write commands, fast mode and the EEPROM.`,
    `Espressif, ESP32 and ESP32-S2 datasheets: the DAC channels.`
  ],
  sim: 'ac-adc-resolution'
},

/* ================================================================ op-amps-for-sensors */
{
  id: 'op-amps-for-sensors',
  parent: 'active-components',
  title: 'Op-amps in front of the ADC',
  level: 3,
  short: `An op-amp makes a signal fit the ADC: it amplifies a few millivolts, buffers a source that cannot drive the input, and moves the level. On a 3.3 V board choose a rail-to-rail type and make sure the output can never exceed the ADC's range.`,
  keywords: ['op-amp', 'operational amplifier', 'LM358', 'MCP6002', 'rail-to-rail', 'non-inverting amplifier', 'voltage follower', 'buffer', 'gain', 'single supply', 'instrumentation amplifier', 'INA333', 'offset', 'clamp', 'ADC input', 'sensor signal conditioning'],
  prereq: ['the-esp-adc', 'voltage-dividers-for-inputs', 'electronics:non-inverting-amplifier', 'electronics:single-supply'],
  related: ['external-adc-and-dac', 'measuring-voltage', 'oversampling-and-noise', 'thermistors-and-ldrs', 'load-cells-and-hx711', 'rc-filters-and-debounce', 'protection-parts'],
  body: `The ESP's ADC wants a signal of roughly 0.1 to 3.1 V from a source with low impedance. Many sensors do not offer that: a thermocouple, a current-sense resistor or a bridge gives millivolts; a pH probe or a piezo disc cannot drive the ADC's sampling input; an audio signal swings below ground. An **op-amp** between the sensor and the pin makes the signal fit.

### Three jobs

- **Buffer** (voltage follower): output tied to the inverting input, gain 1. The input draws almost nothing and the output drives the ADC firmly. Use it after a high-impedance divider or sensor.
- **Gain**: the non-inverting amplifier has $G = 1 + R_f/R_g$. With 100 kΩ and 10 kΩ the gain is 11, so a sensor of 0 to 250 mV fills the ADC to 2.75 V.
- **Level shift and filter**: adding a bias voltage and a capacitor places the signal and trims noise.

### Single supply, rail to rail

On a 3.3 V board there is no negative rail, so use an op-amp made for it. The **LM358** works from 3 V and its input includes ground, but its output cannot come within about 1.5 V of the positive supply: on 3.3 V it saturates near 1.8 V. The **MCP6002** is rail-to-rail on inputs and output, runs from 1.8 V to 6 V, and takes about 100 µA per amplifier. Even a rail-to-rail output stops a few millivolts short of ground, so the lowest readings are not exact zero.

### Protect the ADC

**Never power the op-amp above 3.3 V** if its output goes straight to the ADC: at 5 V the output can reach 5 V and damage the pin. Power it from 3.3 V, or add a series resistor of 1 kΩ and a Schottky diode to the 3.3 V rail ([[protection-parts]]). A 100 nF capacitor at the pin takes the kick of the sampler, and the series resistor keeps the op-amp stable with it.

### Offset and precision

Input offset of a millivolt, multiplied by a gain of 100, is a tenth of a volt at the output. For microvolt signals choose a zero-drift part (for example the MCP6V family) or an **instrumentation amplifier** such as the INA333, which also gives a differential input for bridges. For a load cell, the HX711 builds the amplifier and the converter in one ([[load-cells-and-hx711]]).

> [!key] Choose a rail-to-rail op-amp powered from 3.3 V, set the gain so that the largest signal stays below about 3 V, and never let the output exceed what the ADC pin takes. Remember that offset is multiplied by the gain.`,
  ideas: [
    `An op-amp can buffer a high-impedance source, amplify a small signal (G = 1 + Rf/Rg for the non-inverting stage) and shift its level, so that it fits the ADC.`,
    `On a 3.3 V board use a rail-to-rail op-amp such as the MCP6002; an LM358's output cannot reach within about 1.5 V of the positive supply.`,
    `Power the op-amp from 3.3 V, or clamp its output: at 5 V it can drive the ADC pin beyond its limit.`,
    `Input offset is multiplied by the gain; microvolt signals need a zero-drift op-amp or an instrumentation amplifier.`
  ],
  pitfalls: [
    `Any op-amp will do — An LM358 on 3.3 V clips at about 1.8 V and cannot reach the supply; a 5 V design copied onto a 3.3 V board silently loses the top of the range.`,
    `The op-amp can run from 5 V while the ADC runs from 3.3 V — Its output can then reach 5 V and destroy the ADC input. Power it from 3.3 V or clamp the output.`,
    `Amplify as much as possible — Gain also multiplies noise, offset and drift, and a signal that clips at the rail reads as a flat line. Set the gain so that the largest signal is about 90 % of the range.`
  ],
  terms: [
    { term: 'Op-amp', also: ['operational amplifier'], def: `A high-gain amplifier with two inputs and one output. With feedback it makes amplifiers and buffers whose gain depends only on resistor values.` },
    { term: 'Voltage follower', also: ['buffer', 'unity-gain buffer'], def: `An op-amp with its output joined to its inverting input: gain 1, very high input impedance and low output impedance. It lets a weak source drive a load.` },
    { term: 'Rail-to-rail', also: ['RRIO', 'rail-to-rail output'], def: `Said of an op-amp whose output (and often its input) can swing to within millivolts of both supply rails.` },
    { term: 'Input offset voltage', also: ['offset'], def: `The small voltage that must be applied between an op-amp's inputs for its output to be zero. An amplifier multiplies it by its gain.` },
    { term: 'Instrumentation amplifier', also: ['INA'], def: `A precision amplifier with a differential input and a gain set by one resistor, designed for bridges, shunts and other small differential signals.` }
  ],
  choose: {
    good: [`MCP6002 (or another rail-to-rail op-amp) on 3.3 V for sensors and buffers`, `A non-inverting gain of 10 to 50 with 1 % resistors for millivolt signals`, `An instrumentation amplifier for bridges and shunts`],
    avoid: [`An LM358 on 3.3 V where the full range is needed`, `An op-amp powered above the ADC's supply, with no clamp`, `High gain with a noisy input and no filter`],
    check: [`The output swing with your supply and load, from the datasheet`, `The offset times the gain against the smallest signal`, `That the largest signal times the gain stays below the ADC's maximum`]
  },
  code: [
    {
      title: 'Read an amplified sensor and report it in millivolts',
      about: `A non-inverting op-amp stage with a gain of 11 raises a 0 to 250 mV sensor signal to 0 to 2.75 V, and feeds GPIO34. The program averages sixteen readings of the calibrated millivolt value, divides by the gain, and prints the sensor voltage, which is what you care about.`,
      needs: `An ESP32 DevKit and an MCP6002 powered from 3.3 V as a non-inverting amplifier with 100 kΩ and 10 kΩ; its output through 1 kΩ to GPIO34, with 100 nF to GND at the pin.`,
      wiring: [['sensor +', 'MCP6002 non-inverting input (+)'], ['feedback', '100 kΩ from output to the inverting input, and 10 kΩ from there to GND', 'gain 11'], ['output', '1 kΩ → GPIO34, 100 nF from GPIO34 to GND'], ['3V3 and GND', 'op-amp supply, with 100 nF decoupling']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34) in millivolts)
          end
          set [pinMv v] to ((sum) / (16))
          print (join [sensor mV: ] ((pinMv) / (11)))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;          // ADC1: also fine with Wi-Fi on
        const float GAIN = 11.0;         // 1 + 100k / 10k
        const int SAMPLES = 16;

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(ADC_PIN, ADC_11db);   // the widest range, about 0.15 V to 3 V
        }

        void loop() {
          uint32_t sum = 0;
          for (int i = 0; i < SAMPLES; i++) sum += analogReadMilliVolts(ADC_PIN);
          float pinMv = sum / (float)SAMPLES;
          Serial.printf("pin %.0f mV, sensor %.1f mV\n", pinMv, pinMv / GAIN);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        ADC_PIN = 34                     # ADC1: also fine with Wi-Fi on
        GAIN = 11.0                      # 1 + 100k / 10k
        SAMPLES = 16

        adc = ADC(Pin(ADC_PIN), atten=ADC.ATTN_11DB)   # the widest range

        while True:
            total = 0
            for _ in range(SAMPLES):
                total += adc.read_uv() / 1000          # microvolts to millivolts
            pin_mv = total / SAMPLES
            print("pin", round(pin_mv), "mV, sensor", round(pin_mv / GAIN, 1), "mV")
            time.sleep_ms(500)
      `,
      output: `
        pin 1485 mV, sensor 135.0 mV
        pin 1487 mV, sensor 135.2 mV
      `,
      notes: [`The ESP32's ADC reads poorly below roughly 100 to 150 mV and flattens near the top of the range, which is exactly why the signal is amplified into the middle.`, `Averaging sixteen samples cuts random noise by four: see [[oversampling-and-noise]].`, `Calibrate with a known input: gain error from 1 % resistors is 1 to 2 %.`]
    }
  ],
  formulas: [
    {
      name: 'Gain of the non-inverting amplifier',
      expr: 'G = 1 + Rf/Rg',
      tex: 'G = 1 + \\frac{R_f}{R_g}',
      vars: {
        G: { name: 'voltage gain', q: 'ratio' },
        Rf: { name: 'feedback resistor', tex: 'R_f', q: 'resistance', unit: 'kΩ', value: 100 },
        Rg: { name: 'resistor to ground', tex: 'R_g', q: 'resistance', unit: 'kΩ', value: 10 }
      },
      solveFor: 'G',
      note: `Valid while the output stays within the supply rails. Use 1 % resistors, or 0.1 % where the gain matters.`,
      stories: { G: 'A non-inverting amplifier has a {Rf} feedback resistor and a {Rg} resistor to ground. What is its gain?', Rf: 'A gain of {G} is wanted with {Rg} to ground. What feedback resistor is needed?' },
      practice: { unknowns: ['G', 'Rf'] }
    },
    {
      name: 'Largest input that still fits',
      expr: 'Vmax = Vfs/G',
      tex: 'V_{in,\\max} = \\frac{V_{fs}}{G}',
      vars: {
        Vmax: { name: 'largest input signal', tex: 'V_{in,\\max}', q: 'voltage', unit: 'mV' },
        Vfs: { name: 'largest output allowed (the ADC range)', tex: 'V_{fs}', q: 'voltage', unit: 'V', value: 2.8 },
        G: { name: 'voltage gain', q: 'ratio', value: 11 }
      },
      solveFor: 'Vmax',
      note: `Choose the full-scale output a little below the top of the ADC range, about 2.8 V for the ESP32 at its widest range, to leave margin for offset and tolerance.`,
      stories: { Vmax: 'An amplifier of gain {G} may swing to {Vfs}. What is the largest input signal?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the gain for a shunt',
      q: `A 0.1 Ω shunt carries up to 1.5 A: the signal is 0 to 150 mV. Choose resistors for the non-inverting stage.`,
      steps: [`The output should not exceed about 2.8 V: $G \\le 2.8 / 0.15 = 18.7$.`, `A gain of 11 (100 kΩ and 10 kΩ) gives 1.65 V at full current: comfortable. A gain of 18 would leave only a little margin.`, `Resolution at the ADC: one 0.76 mV step is $0.76 / 11 = 0.07$ mV at the input, or 0.7 mA through the shunt.`],
      a: `Gain 11 with 100 kΩ and 10 kΩ: 150 mV becomes 1.65 V, and one ADC step is about 0.7 mA.`
    }
  ],
  quiz: [
    { q: `A non-inverting amplifier has Rf = 47 kΩ and Rg = 4.7 kΩ. What is its gain?`, choices: [`10`, `11`, `9`, `0.1`], a: 1, why: `G = 1 + 47 / 4.7 = 11. The 1 is the part people forget.` },
    { q: `An LM358 runs from 3.3 V. At what output voltage does it saturate, roughly?`, choices: [`3.3 V`, `3.0 V`, `About 1.8 V`, `0.5 V`], a: 2, why: `The LM358's output cannot come within about 1.5 V of the positive supply, so it clips near 1.8 V on 3.3 V. A rail-to-rail part such as the MCP6002 reaches within a few millivolts.` },
    { q: `An op-amp powered from 5 V drives an ESP32 ADC pin. What is the risk?`, choices: [`None: the pin tolerates 5 V`, `The output can exceed 3.3 V and damage the pin`, `The gain falls`, `The ADC reads too low`], a: 1, why: `The output swings up to the op-amp's supply. The ESP's pins are not 5 V tolerant: power the op-amp from 3.3 V or clamp the output.` },
    { q: `An op-amp with an input offset of 1 mV and a gain of 100 adds 100 mV of error at its output.`, a: true, why: `The offset appears at the input and is amplified like the signal: 1 mV × 100 = 100 mV.` }
  ],
  applications: [
    `Amplifying a thermocouple, a shunt or a bridge before the ADC.`,
    `Buffering a high-impedance sensor such as a pH probe or a piezo element.`,
    `Level-shifting and amplifying an audio signal for an ADC input.`
  ],
  sources: [
    `Microchip, MCP6001/2/4 datasheet: supply range, rail-to-rail swing and quiescent current.`,
    `Texas Instruments, LM358 datasheet: the output swing near the positive supply.`,
    `Hyper Electronics, the non-inverting amplifier and single-supply pages.`
  ],
  sim: 'ac-opamp-gain'
},

/* ================================================================ analog-multiplexers */
{
  id: 'analog-multiplexers',
  parent: 'active-components',
  title: 'Analogue multiplexers',
  level: 3,
  short: `A 74HC4067 connects one of sixteen analogue signals to a single ADC pin, selected with four logic pins. It saves pins, but the switch has resistance, the signal must stay within its supply, and each channel needs time to settle before it is read.`,
  keywords: ['analogue multiplexer', 'analog multiplexer', 'CD74HC4067', '74HC4051', '74HC4052', 'CD4051', 'mux', 'analogue switch', 'select pins', 'channel select', 'on resistance', 'settling time', 'ghosting', 'crosstalk', 'sample and hold', 'read many sensors'],
  prereq: ['the-esp-adc', 'io-expanders-and-shift-registers', 'electronics:multiplexers', 'op-amps-for-sensors'],
  related: ['external-adc-and-dac', 'adc1-adc2-and-wifi', 'oversampling-and-noise', 'keypads-and-matrices', 'soil-and-water-sensors', 'measuring-voltage'],
  body: `An **analogue multiplexer** is a bank of switches, only one of which is closed. The CD74HC4067 has sixteen channels, I0 to I15, and a common pin, SIG: four logic inputs S0 to S3 pick the channel, and an enable pin turns the whole chip off. Wire SIG to one ADC pin and sixteen sensors share it. The 74HC4051 does the same for eight channels, and the 74HC4052 for two groups of four.

### An analogue switch, not a logic gate

The switch passes the actual voltage, in either direction, but only between the chip's own supply rails: powered from 3.3 V, signals must lie between 0 V and 3.3 V; a 5 V signal would flow into the supply through the chip's protection diodes. The closed switch has a resistance, $R_{on}$, around 70 Ω at 4.5 V and more at 3.3 V. That is nothing against a sensor of 10 kΩ, but it adds to the source resistance.

### Settling: why the first reading is wrong

An ADC pin has a sampling capacitor and the wiring has capacitance. When the multiplexer switches channel, the new source must charge them through $R_s + R_{on}$. If the previous channel was at 2 V and this one is at 0.5 V, the first reading shows part of the old voltage: **ghosting**. The charge takes a time constant $\\tau = (R_s + R_{on}) C$, and reading to 12 bits needs about $12 \\ln 2 \\approx 8.3$ of them. The cures:

- **Wait** a few tens of microseconds after selecting, and **read twice**, discarding the first.
- Keep source resistances low, or buffer each sensor with an op-amp ([[op-amps-for-sensors]]).
- **Never put a large capacitor on SIG.** A 100 nF filter there, charged through 10 kΩ, needs 8 ms to settle. Filter each channel at its own input instead.

### What it cannot do

It reads one channel at a time, so it is no good for comparing signals at the same instant, or for fast sampling of several channels. The leakage of the off channels is nanoamps, which matters for a very high impedance source. For precision, an ADS1115 has four channels and a gain stage ([[external-adc-and-dac]]). The same chips also multiplex digital signals and drive scanned LEDs.

> [!key] A multiplexer shares one ADC pin among up to sixteen signals, powered from 3.3 V so that the signals stay in range. After every channel change, wait for the line to settle and discard the first reading, and keep large capacitors off the common pin.`,
  ideas: [
    `A multiplexer connects one of its channels to a common pin; four select pins choose among sixteen, so one ADC pin reads sixteen sensors in turn.`,
    `It is an analogue switch: signals must stay between its supply rails, and the on-resistance (tens to a couple of hundred ohms) adds to the source's.`,
    `After a channel change the line must settle through (Rs + Ron)·C; wait, read twice and discard the first reading to avoid ghosting.`,
    `A big capacitor on the common pin ruins the settling time; filter each channel at its own input.`
  ],
  pitfalls: [
    `The first reading after a switch is as good as any other — It still carries charge from the previous channel. Discard it, or wait several time constants.`,
    `A filter capacitor on the common pin cleans every channel — It slows settling to milliseconds, so channels bleed into each other. Put the capacitors on the inputs.`,
    `The multiplexer passes any voltage — Only between its own supplies. Powered from 3.3 V, a 5 V signal is passed through the protection diodes into the supply.`
  ],
  terms: [
    { term: 'Analogue multiplexer', also: ['analog mux', 'analogue switch bank'], def: `A chip that connects one of several analogue inputs to a common output under the control of select pins; the signal passes through a low-resistance switch.` },
    { term: 'On-resistance', also: ['Ron'], def: `The resistance of a closed analogue switch, around 70 Ω at 4.5 V for a 74HC4067 and higher at 3.3 V. It adds to the source resistance.` },
    { term: 'Settling time', def: `The time a signal needs to reach its final value within a given error after a change. For an RC network, about 8.3 time constants for 12 bits.` },
    { term: 'Ghosting', also: ['channel crosstalk', 'memory effect'], def: `The error in the first reading after a multiplexer changes channel, caused by charge left from the previous channel on the common line and the ADC's sampling capacitor.` }
  ],
  choose: {
    good: [`74HC4067 for sixteen slow sensors on one ADC pin`, `74HC4051 for eight channels, or 74HC4052 for two groups of four`, `A buffer or low-impedance sources for fast channel scans`],
    avoid: [`Capacitors on the common pin`, `Signals outside the multiplexer's supply range`, `Reading right after switching`],
    check: [`The on-resistance at your supply voltage, against the source resistance`, `The settling wait needed for the capacitance on the common line`, `That the common pin goes to an ADC1 pin if Wi-Fi is used on the ESP32`]
  },
  code: [
    {
      title: 'Read sixteen channels through a 74HC4067',
      about: `The four select pins count through the channels 0 to 15. After each change the program waits 50 µs, throws away one reading and keeps the second, then prints the sixteen millivolt values on one line every second. Channels with nothing connected float and read noise.`,
      needs: `An ESP32 DevKit and a CD74HC4067 breakout powered from 3.3 V, with up to sixteen sensors or potentiometers on its channels.`,
      wiring: [['GPIO25, 26, 27, 33', 'S0, S1, S2, S3 (the channel number in binary)'], ['GPIO34', 'SIG, the common pin'], ['EN', 'GND, which enables the chip'], ['VCC', '3V3 (the signals must be 0 to 3.3 V)'], ['GND', 'GND']],
      blocks: `
        define read channel (ch)
          set pin (25) to <((ch) mod (2)) = (1)>
          set pin (26) to <(((ch) / (2)) mod (2)) = (1)>
          set pin (27) to <(((ch) / (4)) mod (2)) = (1)>
          set pin (33) to <(((ch) / (8)) mod (2)) = (1)>
          wait (0.00005) seconds
          set [junk v] to (analog read pin (34) in millivolts)
          set [value v] to (analog read pin (34) in millivolts)

        when started
          start serial at (115200) baud
          set pin (25) as [output v]
          set pin (26) as [output v]
          set pin (27) as [output v]
          set pin (33) as [output v]

        every (1) seconds
          set [line v] to [ ]
          for each [ch v] in (list 0 to 15)
            read channel (ch) :: my
            set [line v] to (join (line) (join (value) [ ]))
          end
          print (line)
      `,
      cpp: String.raw`
        const int SIG_PIN = 34;                      // ADC1
        const int SEL_PINS[4] = {25, 26, 27, 33};    // S0 .. S3

        void selectChannel(int ch) {
          for (int i = 0; i < 4; i++) digitalWrite(SEL_PINS[i], (ch >> i) & 1);
          delayMicroseconds(50);                     // let the line settle
        }

        uint32_t readChannel(int ch) {
          selectChannel(ch);
          analogReadMilliVolts(SIG_PIN);             // discard: it carries the last channel
          return analogReadMilliVolts(SIG_PIN);
        }

        void setup() {
          Serial.begin(115200);
          for (int i = 0; i < 4; i++) pinMode(SEL_PINS[i], OUTPUT);
          analogSetPinAttenuation(SIG_PIN, ADC_11db);
        }

        void loop() {
          for (int ch = 0; ch < 16; ch++) {
            Serial.print(readChannel(ch));
            Serial.print(ch < 15 ? ' ' : '\n');
          }
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        SIG_PIN = 34                                  # ADC1
        SEL = [Pin(n, Pin.OUT) for n in (25, 26, 27, 33)]   # S0 .. S3
        adc = ADC(Pin(SIG_PIN), atten=ADC.ATTN_11DB)

        def select_channel(ch):
            for i in range(4):
                SEL[i].value((ch >> i) & 1)
            time.sleep_us(50)                         # let the line settle

        def read_channel(ch):
            select_channel(ch)
            adc.read_uv()                             # discard: it carries the last channel
            return adc.read_uv() // 1000              # millivolts

        while True:
            print(" ".join(str(read_channel(ch)) for ch in range(16)))
            time.sleep_ms(1000)
      `,
      output: `
        1650 1203 3 2988 15 1650 1203 3 2988 15 20 1650 1203 3 2988 15
      `,
      notes: [`The select pins are written in binary, S0 the least significant bit: channel 5 is S0 = 1, S1 = 0, S2 = 1, S3 = 0.`, `Disconnected channels float and give noise: tie unused inputs to ground.`, `For sixteen sensors that must be sampled quickly, one ADC per few channels or an ADS1115 is the better design.`]
    }
  ],
  formulas: [
    {
      name: 'Settling time through the multiplexer',
      expr: 't = (Rs + Ron)*C*N*ln(2)',
      tex: 't = (R_s + R_{on})\\, C \\; N \\ln 2',
      vars: {
        t: { name: 'time to settle to within half an LSB', q: 'time', unit: 'µs' },
        Rs: { name: 'source resistance', tex: 'R_s', q: 'resistance', unit: 'kΩ', value: 10 },
        Ron: { name: 'on-resistance of the multiplexer', tex: 'R_{on}', q: 'resistance', unit: 'Ω', value: 150 },
        C: { name: 'capacitance at the common pin', q: 'capacitance', unit: 'pF', value: 100 },
        N: { name: 'bits of the ADC', value: 12, int: true, fixed: true }
      },
      solveFor: 't',
      note: `Settling to half an LSB of N bits takes N·ln 2 time constants (8.3 for 12 bits). With a 100 nF filter capacitor instead of 100 pF the result is a thousand times longer.`,
      stories: { t: 'A source of {Rs} feeds a multiplexer with {Ron} on-resistance and {C} at the common pin. How long must the program wait to settle to 12 bits?' },
      practice: { unknowns: ['t'] }
    }
  ],
  examples: [
    {
      title: 'The filter capacitor that spoils the scan',
      q: `Sensors with 10 kΩ output resistance go through a 74HC4067 (150 Ω on) to an ADC pin with a 100 nF capacitor on the common line. How long must the program wait after each channel change for 12-bit accuracy?`,
      steps: [`The time constant is $\\tau = (10\\,000 + 150) \\times 100 \\times 10^{-9} = 1.0$ ms.`, `Twelve bits need $12 \\ln 2 = 8.3$ time constants: about 8.4 ms.`, `Sixteen channels then take 135 ms per scan. Moving the capacitor to the inputs, or removing it, brings the wait down to microseconds.`],
      a: `About 8.4 ms per channel with the capacitor on the common line; without it, a few microseconds.`
    }
  ],
  quiz: [
    { q: `Why discard the first ADC reading after the multiplexer changes channel?`, choices: [`The ADC needs to warm up`, `The line still carries charge from the previous channel`, `The first reading is always zero`, `The select pins are slow`], a: 1, why: `The sampling capacitor and the wiring hold the previous channel's voltage, and the new source needs a few time constants to replace it.` },
    { q: `A 74HC4067 is powered at 3.3 V. Which input voltage is acceptable?`, choices: [`0 to 3.3 V`, `0 to 5 V`, `−5 to +5 V`, `Any voltage`], a: 0, why: `An analogue switch passes only signals between its supply rails. Anything outside conducts through the protection diodes.` },
    { q: `A 10 kΩ source, 150 Ω on-resistance and 20 pF give a time constant of about:`, choices: [`0.2 µs`, `20 µs`, `2 ms`, `0.2 ms`], a: 0, why: `$\\tau = 10\\,150 \\times 20\\,\\text{pF} = 0.2$ µs, so settling to 12 bits takes about 1.7 µs: a wait of tens of microseconds is generous.` },
    { q: `A multiplexer lets the ESP read sixteen sensors at the same instant.`, a: false, why: `It connects only one channel at a time, so readings are taken in turn. For simultaneous samples you need one converter per signal, or sample-and-hold stages.` }
  ],
  applications: [
    `Reading a bank of potentiometers, soil-moisture probes or analogue buttons on a single ADC pin.`,
    `Scanning a resistor-matrix or an array of analogue sensors in a pressure mat.`,
    `Switching one meter or oscilloscope input between several test points, with a low-resistance part.`
  ],
  sources: [
    `Texas Instruments, CD74HC4067 datasheet: channel select, on-resistance against supply and the enable pin.`,
    `Datasheets of the 74HC4051 and 74HC4052 multiplexers.`,
    `Hyper Electronics, the multiplexers page.`
  ]
},
);
