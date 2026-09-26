/* HYPER-ELECTRONICS · content/switching-protection.js — switches and contact bounce,
 * relays, fuses and circuit protection, and sizing wires. */
Hyper.add(

{
  id: 'switches', parent: 'switching-protection', title: 'Switches and contact bounce', level: 1,
  short: 'Mechanical switches are rated by poles, throws, current and voltage — AC and DC separately — and every mechanical contact bounces for a few milliseconds as it closes, which a digital input must be taught to ignore.',
  keywords: ['switch', 'SPST', 'SPDT', 'DPDT', 'pole', 'throw', 'momentary', 'latching', 'normally open', 'normally closed', 'contact bounce', 'debounce', 'microswitch', 'limit switch', 'reed switch', 'wetting current', 'rotary encoder'],
  prereq: ['resistance-ohms-law', 'pull-resistors', 'rc-transient'],
  related: ['schmitt-trigger', 'relays', 'microcontrollers', 'fuses-protection'],
  body: `
A switch joins or breaks a circuit. The vocabulary is compact: a **pole** is a separate circuit the switch controls, and a **throw** is a position each pole can connect to. SPST (single-pole, single-throw) is a plain on–off switch; SPDT is a changeover with a common, a normally-open and a normally-closed contact; DPDT switches two independent circuits at once — the classic way to reverse a DC motor. **Momentary** switches (push-buttons) spring back when released; **latching** ones stay where they are put. A button is **normally open (NO)** if pressing it closes the circuit, and **normally closed (NC)** if pressing it opens it.

### Ratings: AC is not DC
A switch is rated for a current and a voltage — and the voltage rating differs for AC and DC. When contacts open under load an **arc** forms between them. With AC the current passes through zero a hundred times a second and the arc goes out by itself; with DC it does not, and a sustained arc erodes and welds the contacts. A switch rated 10 A at 250 V AC may be rated for only a few amperes at 30 V DC, or have no DC rating at all.

The load matters too. A cold filament lamp draws ten times or more its running current for the first few milliseconds, a motor draws its stall current at start, and a capacitor-input power supply draws a large charging surge. Choose a switch rated for the type of load ([[relays]] face the same problem, in more detail).

At the opposite extreme, contacts need a minimum **wetting current** to break through the thin oxide or sulphide film on their surface. Silver contacts rated for amperes can become unreliable switching the few microamps of a logic input; signal-level switches use gold-plated contacts.

### Contact bounce
When metal contacts close they collide and spring apart several times before settling — over 0.1 to 10 ms, often around 1–5 ms, and worse as the switch wears. A lamp does not notice. A microcontroller sampling its input every few microseconds sees a burst of edges and counts one press as five, or toggles a light on and straight back off.

**Hardware debouncing** smooths the edges with an RC network and cleans up the result with a [[schmitt-trigger|Schmitt trigger]]. With the switch open, the capacitor charges through a pull-up resistor $R$ towards the supply; closing the switch discharges it quickly. After release, the input crosses the Schmitt trigger's upper threshold $V_{T+}$ once, at

$$t = RC \\ln\\frac{V_{cc}}{V_{cc} - V_{T+}}$$

Choose $RC$ so that this exceeds the longest bounce — 10 to 20 ms gives a comfortable margin.

**Software debouncing** costs nothing: sample the input every millisecond or so and accept a new state only after it has been stable for 10–20 ms, or ignore further edges for a short hold-off after the first. Every keyboard and every button routine on a [[microcontrollers|microcontroller]] does something of the sort. Rotary encoders bounce too, and are best decoded by a small state machine that accepts only valid quadrature sequences.

### Switches as sensors
- **Snap-action microswitches** change state quickly and cleanly however slowly the lever moves; they are the limit and home switches of CNC machines and 3D printers.
- **Reed switches** close in a magnetic field: door sensors, float switches, speed pick-ups.
- **Wire safety switches normally closed.** A limit switch or an emergency stop should open its contact when actuated, and the controller should treat an open circuit as "stop". A broken wire or a loose connector then stops the machine instead of silently disabling the protection. Emergency stops use positively opening contacts, forced apart by the button itself rather than by a spring.
`,
  ideas: [
    'Poles are independent circuits; throws are the positions each pole can connect to.',
    'DC ratings are far lower than AC ratings, because a DC arc does not extinguish itself.',
    'Lamps, motors and capacitive supplies draw inrush currents far above their running current.',
    'Mechanical contacts bounce for milliseconds: debounce in hardware (RC and a Schmitt trigger) or in software.',
    'Safety limit switches and emergency stops use normally-closed contacts, so that a broken wire fails safe.'
  ],
  pitfalls: [
    'A switch rated 250 V, 10 A can switch 24 V DC at 10 A — The DC rating is usually much lower, and lower still for inductive loads; look for an explicit DC rating.',
    'A button press gives one clean edge — It gives a burst of bounces lasting milliseconds; a fast input counts several presses.',
    'Bigger contacts are always more reliable — Power contacts can fail to pass tiny signal currents through their surface film; low-level signals need gold contacts.'
  ],
  formulas: [
    {
      name: 'RC debounce: time to cross the Schmitt threshold',
      expr: 't = R*C*ln(V/(V - Vth))', tex: 't = RC\\,\\ln\\frac{V_{cc}}{V_{cc} - V_{T+}}',
      vars: {
        t: { name: 'delay after release', q: 'time', unit: 'ms' },
        R: { name: 'pull-up resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'debounce capacitor', q: 'capacitance', unit: 'µF', value: 1 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{cc}' },
        Vth: { name: 'upper threshold of the Schmitt trigger', q: 'voltage', unit: 'V', value: 2.0, tex: 'V_{T+}' }
      },
      note: 'The capacitor charges from 0 V through R after the switch opens. Take the threshold from the Schmitt-trigger gate\'s datasheet at your supply voltage.',
      practice: { unknowns: ['t', 'C'] },
      stories: {
        t: 'A button is debounced by a {R} pull-up and a {C} capacitor on a {V} supply, read by a Schmitt input with a threshold of {Vth}. How long after release does the input change?',
        C: 'With a {R} pull-up on {V} and a Schmitt threshold of {Vth}, what capacitor gives a debounce delay of {t}?'
      }
    },
    {
      name: 'Switch-on surge of a filament lamp',
      expr: 'Ipk = k*P/V', tex: 'I_{\\text{pk}} = k\\,\\frac{P}{V}, \\quad k = \\frac{R_{\\text{hot}}}{R_{\\text{cold}}}',
      vars: {
        Ipk: { name: 'peak current at switch-on', q: 'current', unit: 'A', tex: 'I_{\\text{pk}}' },
        P: { name: 'lamp power', q: 'power', unit: 'W', value: 21 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12 },
        k: { name: 'hot-to-cold resistance ratio of the filament', q: 'ratio', unit: '', value: 12 }
      },
      note: 'Tungsten\'s resistance rises roughly tenfold to fifteenfold from room temperature to operating temperature, so the first milliseconds draw that many times the running current.',
      stories: { Ipk: 'A {P} lamp runs from {V}. Its filament is {k} times more resistive hot than cold. What current flows at the instant it is switched on?' }
    }
  ],
  examples: [
    {
      title: 'A hardware debounce for a machine button',
      q: 'A push-button bounces for up to 5 ms. It is read on a 3.3 V system through a Schmitt-trigger gate whose upper threshold is 2.0 V, with a 10 kΩ pull-up. Choose the capacitor for a delay of about twice the bounce time.',
      steps: [
        'Aim for $t = 10$ ms.',
        {text: 'Solve the charging equation for C:', tex: 'C = \\frac{t}{R\\ln\\frac{V_{cc}}{V_{cc}-V_{T+}}} = \\frac{0.010}{10^4 \\times \\ln(3.3/1.3)} = \\frac{0.010}{10^4 \\times 0.93} = 1.07\\ \\mu\\mathrm{F}'},
        'Take 1 µF: the delay is 9.3 ms.',
        'Put about 100 Ω in series with the switch so that closing it does not dump the capacitor through the contacts in one spike; the press is still registered within a fraction of a millisecond.'
      ],
      a: '1 µF with the 10 kΩ pull-up: about 9 ms after release.'
    },
    {
      title: 'Why the headlamp switch is not rated for its lamp',
      q: 'A 12 V, 55 W headlamp draws 4.6 A when lit. Why is it switched through a relay rather than by the dashboard switch?',
      steps: [
        'Running current: $55/12 = 4.6$ A.',
        'The cold filament has roughly a twelfth of its hot resistance, so at switch-on the current is about $4.6 \\times 12 \\approx 55$ A for a few milliseconds.',
        'Add the voltage drop of a long run to the dashboard and back, and the arcing of DC contacts, and a small panel switch would not last.',
        'The dashboard switch drives only the relay coil (about 0.1–0.2 A); the relay, close to the lamp, carries the surge on short, thick wires.'
      ],
      a: 'The lamp\'s switch-on surge (about 55 A) and DC arcing are too much for a panel switch; a relay near the load does the heavy work.'
    }
  ],
  quiz: [
    { q: 'How many independent circuits can a DPDT switch control?', choices: ['one', 'two', 'three', 'four'], a: 1,
      why: 'Double pole: two separate circuits, each changing over between two throws.' },
    { q: 'Why does a switch have a lower DC rating than AC rating?', choices: ['DC is more dangerous', 'A DC arc does not extinguish itself at a current zero', 'DC heats the contacts through their resistance', 'AC cools the contacts'], a: 1,
      why: 'AC passes through zero every half-cycle and the arc dies; a DC arc can persist and erode the contacts.' },
    { q: 'A microcontroller counts button presses and sometimes registers three for one press. The most likely cause is…', choices: ['a slow clock', 'contact bounce', 'a missing pull-up resistor', 'electrostatic discharge'], a: 1,
      why: 'Each bounce produces an edge. Debounce in hardware or software.' },
    { q: 'A limit switch that must stop a machine should be wired through its normally-closed contact.', a: true,
      why: 'Then a broken wire or a disconnected plug looks the same as the limit being reached, and the machine stops: the failure is safe.' },
    { q: 'A 47 kΩ pull-up and a 220 nF capacitor debounce a 5 V input whose Schmitt threshold is 3.0 V. How long after release does the input change?', answer: 9.47, unit: 'ms',
      why: 't = RC ln(5/2) = 47 000 × 220 × 10⁻⁹ × 0.916 = 9.5 ms.' }
  ],
  applications: ['Keypads, panel buttons and rotary encoders read by microcontrollers.', 'Limit, home and door-interlock switches on machines and 3D printers.', 'Mains on–off and selector switches.', 'Reed switches in door alarms, float switches and cycle computers.']
},

{
  id: 'relays', parent: 'switching-protection', title: 'Relays', level: 1,
  short: 'An electrically operated switch: a small current through a coil moves contacts that switch a large, isolated load. Solid-state relays do the same job with semiconductors, trading different strengths and weaknesses.',
  keywords: ['relay', 'coil', 'contacts', 'armature', 'pick-up voltage', 'drop-out voltage', 'flyback diode', 'solid-state relay', 'SSR', 'triac', 'zero-cross', 'contact rating', 'latching relay', 'reed relay', 'contactor', 'electrical life'],
  prereq: ['switches', 'bjt-switch', 'flyback-diode'],
  related: ['mosfet-switch', 'optocouplers', 'inductors', 'fuses-protection', 'h-bridge'],
  body: `
A relay is a switch worked by an electromagnet. Current through the **coil** pulls an iron **armature**, which moves one or more sets of contacts — changeover (SPDT) contacts are the most common. The coil circuit and the contact circuit are electrically separate, so a 3.3 V microcontroller can switch a 230 V heater with several kilovolts of insulation in between. Built large, for motors and three-phase loads, the same device is called a **contactor**.

### The coil
A coil is specified by its nominal voltage and resistance. A common 5 V relay has a coil of about 70 Ω and draws 71 mA (0.36 W); 12 V versions are typically 360–400 Ω, about 30 mA. The relay is guaranteed to **pick up** (operate) at about 70–80 % of its nominal voltage and to **drop out** (release) only below about 10 % — so once pulled in, the armature can be held with much less power. Some drivers reduce the coil voltage after pick-up, or apply PWM to it, to save power and heat.

A microcontroller pin supplies only a few milliamps, so the coil is driven by a transistor: a low-side [[bjt-switch|NPN transistor]] or a logic-level [[mosfet-switch|MOSFET]], with a **flyback diode** across the coil ([[flyback-diode]]). Without the diode, switching off the coil current produces a spike of hundreds of volts that destroys the transistor. The diode has one side effect: the coil current now decays slowly through it, so the relay releases later and its contacts open more slowly. Where a fast release matters (to reduce arcing), a Zener diode in series with the flyback diode lets the coil voltage rise to a controlled level and the current collapse faster.

### The contacts
Contact ratings depend on voltage, on AC or DC, and on the kind of load:
- **Resistive** loads are the easiest; the headline rating (say 10 A at 250 V AC) is for these.
- **Inductive** loads — motors, solenoids, other relays — arc when opened, so their rating is lower, and DC inductive loads are the hardest of all. An RC snubber across an AC load, or a diode across a DC one, protects the contacts.
- **Lamp and capacitive** loads draw an inrush many times their running current, which can weld the contacts shut.

A relay has two lives: **mechanical** (often ten million operations or more with no load) and **electrical** (often around 100 000 operations at full rated load). At one operation per second, 100 000 operations last barely more than a day — relays are for switching now and then, never for PWM.

### Solid-state relays
A **solid-state relay (SSR)** replaces the moving parts with an [[optocouplers|optocoupler]] driving semiconductors. AC types use a triac or a pair of thyristors, usually with **zero-cross** switching: they turn on only near a zero of the mains voltage, which is kind to lamps and keeps interference down. DC types use MOSFETs.

| | Electromechanical relay | Solid-state relay |
|---|---|---|
| Life | limited by contact wear | practically unlimited |
| Speed and noise | milliseconds, clicks | fast, silent |
| On-state loss | milliohms of contact resistance | about 1–1.6 V for a triac: roughly 1 W per ampere, needs a heat sink |
| Off state | a real air gap | a leakage current of milliamps |
| Typical failure | contacts wear or weld | usually fails short-circuit |

That leakage is enough to keep a small LED lamp glowing faintly when the SSR is "off", and it means an SSR is never a safe isolation for working on the load.

> [!warn] When a relay switches mains, the whole contact side — terminals, tracks, wiring — is at mains potential. Keep the creepage distances of the relay's footprint on the board, fuse the load circuit, and never rely on a relay (least of all an SSR) as the isolation for maintenance work.
`,
  ideas: [
    'A relay isolates the control circuit from the load: a small coil current switches a large one.',
    'Coils pick up at about 75 % of their nominal voltage and hold down to about 10 %, so holding power can be reduced.',
    'Drive the coil with a transistor, and always fit a flyback diode across it.',
    'Contact ratings fall for DC, inductive and lamp loads, and electrical life is far shorter than mechanical life.',
    'Solid-state relays are silent and wear-free, but drop about a volt, leak milliamps and usually fail short.'
  ],
  pitfalls: [
    'A 10 A relay switches any 10 A load — Only a resistive AC one. DC loads, motors and lamps need derating, sometimes drastic.',
    'The flyback diode is optional on small relays — Without it every switch-off hits the driving transistor with a spike of tens to hundreds of volts.',
    'An SSR that is off isolates the load — It leaks milliamps and often fails short. Maintenance needs a mechanical disconnect.'
  ],
  formulas: [
    {
      name: 'Base resistor for driving a relay coil',
      expr: 'Rb = (Vin - Vbe)*beta/(k*Ic)', tex: 'R_B = \\frac{(V_{\\text{in}} - V_{BE})\\,\\beta}{k\\,I_C}',
      vars: {
        Rb: { name: 'base resistor', q: 'resistance', unit: 'kΩ', tex: 'R_B' },
        Vin: { name: 'logic high voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{in}}' },
        Vbe: { name: 'base–emitter voltage', q: 'voltage', unit: 'V', value: 0.7, tex: 'V_{BE}' },
        beta: { name: 'minimum current gain', q: 'none', value: 100, tex: '\\beta' },
        k: { name: 'overdrive factor (base current above the minimum)', q: 'none', value: 5 },
        Ic: { name: 'coil current', q: 'current', unit: 'mA', value: 30, tex: 'I_C' }
      },
      note: 'An overdrive of 5–10 makes sure the transistor saturates even with a low-gain sample. Check that the pin can supply the base current.',
      practice: { unknowns: ['Rb'] },
      stories: { Rb: 'A {Ic} relay coil is switched by an NPN transistor (β at least {beta}) from a {Vin} pin. With an overdrive factor of {k}, what base resistor do you need?' }
    },
    {
      name: 'Coil power at a reduced holding voltage',
      expr: 'P = (h*V)^2/R', tex: 'P = \\frac{(h\\,V)^2}{R}',
      vars: {
        P: { name: 'coil power', q: 'power', unit: 'W' },
        h: { name: 'fraction of the nominal voltage', q: 'ratio', unit: '', value: 0.5, min: 0, max: 1.2 },
        V: { name: 'nominal coil voltage', q: 'voltage', unit: 'V', value: 12 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 400 }
      },
      note: 'Holding at half voltage cuts the coil power to a quarter. Stay well above the specified drop-out voltage, and pick up at full voltage.',
      practice: { unknowns: ['P'] }
    },
    {
      name: 'Junction temperature of a solid-state relay',
      expr: 'T = Ta + Von*I*Rth', tex: 'T_j = T_a + V_{\\text{on}}\\,I\\,R_{\\theta}',
      vars: {
        T: { name: 'junction temperature', q: 'temperature', unit: '°C', tex: 'T_j' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_a' },
        Von: { name: 'on-state voltage', q: 'voltage', unit: 'V', value: 1.2, tex: 'V_{\\text{on}}' },
        I: { name: 'load current (RMS)', q: 'current', unit: 'A', value: 10 },
        Rth: { name: 'thermal resistance, junction to air (via the heat sink)', q: 'thermalres', unit: 'K/W', value: 3, tex: 'R_{\\theta}' }
      },
      note: 'Treats the on-state voltage as constant, which is close for a triac or thyristor output. See [[heat-sinks]] for building up the thermal resistance.',
      practice: { unknowns: ['T', 'Rth'] },
      stories: { Rth: 'An SSR drops {Von} carrying {I}. At an ambient of {Ta}, its junction must stay below {T}. What total thermal resistance to air is allowed?' }
    }
  ],
  examples: [
    {
      title: 'A 12 V relay from a 3.3 V microcontroller',
      q: 'A 12 V relay with a 400 Ω coil is to be driven from a 3.3 V output through an NPN transistor with a minimum gain of 100. Design the driver.',
      steps: [
        'Coil current: $12/400 = 30$ mA; the transistor must saturate at 30 mA.',
        'Minimum base current $30/100 = 0.3$ mA; with an overdrive of 5, aim for 1.5 mA.',
        'Base resistor: $(3.3 - 0.7)/1.5\\ \\mathrm{mA} = 1.73\\ \\mathrm{k\\Omega}$ → 1.5 kΩ (E12), giving 1.7 mA — easy for any microcontroller pin.',
        'A 1N4148 or 1N4007 across the coil, cathode to +12 V, catches the switch-off spike.'
      ],
      a: 'NPN with a 1.5 kΩ base resistor, emitter to ground, coil from +12 V to the collector, diode across the coil.'
    },
    {
      title: 'Heat in a solid-state relay',
      q: 'A zero-cross SSR switches a 10 A heater. Its output drops 1.2 V and its junction-to-case thermal resistance is 1 K/W. The cabinet reaches 40 °C and the junction must stay below 110 °C. What heat sink is needed?',
      steps: [
        'Power: $1.2 \\times 10 = 12$ W.',
        'Allowed total thermal resistance: $(110 - 40)/12 = 5.8$ K/W.',
        'Subtract junction-to-case (1 K/W) and case-to-sink with thermal paste (about 0.3 K/W): the heat sink must be better than about 4.5 K/W.',
        'A contactor would dissipate a fraction of a watt at its contacts instead — but it clicks, wears, and cannot switch every few seconds for years.'
      ],
      a: '12 W of heat: a heat sink of about 4.5 K/W or better.'
    }
  ],
  quiz: [
    { q: 'Why does a relay with a plain flyback diode release more slowly?', choices: ['The diode keeps the coil energised from the supply', 'The coil current decays slowly through the diode, holding the armature a little longer', 'The diode adds capacitance', 'It does not: the diode speeds release'], a: 1,
      why: 'The coil\'s stored energy circulates through the diode with only about 0.7 V across the coil, so the current (and the magnetic pull) decays slowly. A Zener in series speeds it up.' },
    { q: 'Once pulled in, a relay can usually be held at about half its nominal coil voltage.', a: true,
      why: 'Drop-out is typically below 10–20 % of nominal, so half voltage holds reliably and cuts the coil power to a quarter. It must still pick up at full voltage.' },
    { q: 'A relay rated for 100 000 electrical operations is used to switch a heater on and off once every second. It will last about…', choices: ['a century', 'a year', 'a day', 'a minute'], a: 2,
      why: '100 000 s is 28 hours. Frequent switching is a job for an SSR or a transistor.' },
    { q: 'A small LED lamp switched by a triac SSR glows faintly when the SSR is off. Why?', choices: ['The SSR is faulty', 'The SSR\'s off-state leakage current (milliamps, mostly through its snubber) is enough to light an LED lamp', 'Zero-cross switching leaves it half on', 'Mains ripple'], a: 1,
      why: 'An SSR is not an open circuit when off. A filament lamp would not notice; an efficient LED lamp does. A bleeder resistor across the lamp cures it.' },
    { q: 'Which load is the hardest on relay contacts?', choices: ['a 230 V AC heater', 'a 24 V DC solenoid valve', 'a 230 V AC resistor bank', 'a 5 V logic input'], a: 1,
      why: 'Inductive and DC: the stored energy drives an arc when the contacts open, and there is no current zero to extinguish it.' }
  ],
  applications: ['Switching mains loads — heaters, pumps, lights — from a microcontroller with isolation.', 'Automotive starter solenoids, horns, headlamps and fans.', 'Signal routing in test equipment and audio gear (reed and signal relays).', 'Contactors for motors, and safety relays for emergency-stop circuits.']
},

{
  id: 'fuses-protection', parent: 'switching-protection', title: 'Fuses and circuit protection', level: 2,
  short: 'A fuse is a deliberate weak link that melts before the wiring can overheat. Choosing one means matching its current, speed, voltage and breaking capacity to both the load and the wire; other devices guard against surges and reverse polarity.',
  keywords: ['fuse', 'fast-acting', 'slow-blow', 'time-delay fuse', 'I2t', 'I²t', 'breaking capacity', 'time-current curve', 'circuit breaker', 'MCB', 'B curve', 'C curve', 'PTC', 'polyfuse', 'resettable fuse', 'TVS diode', 'MOV', 'reverse polarity protection', 'RCD', 'short circuit'],
  prereq: ['wire-sizing', 'power-energy', 'physics:specific-heat'],
  related: ['resistors', 'zener-diodes', 'smoothing-ripple', 'transformers-practical', 'batteries'],
  body: `
A fuse protects **the wiring**, not the gadget. A short circuit in a battery-powered machine can drive hundreds of amperes through a thin wire; within seconds its insulation melts, and a fire can start. A fuse is a strip of metal designed to melt first — at a known current, in a known time — and open the circuit before anything else is damaged. The first rule follows at once: **the fuse goes at the source end** of the wire it protects, right at the battery terminal or the supply, because a short anywhere along the wire must be downstream of it.

### Heat, and the I²t of a fuse
A fuse element is heated by $I^2R$. At a small overload it warms slowly while losing heat to its surroundings, so it may take seconds or minutes to open — and between 1 and about 1.35 times its rating it may never open at all. At a large fault current it heats almost without losing any, and what counts is the energy of the pulse, $\\int i^2\\,dt$, called its **I²t**. Each fuse has a melting I²t: a surge below it (a capacitor charging at switch-on, a motor starting) leaves the fuse intact, while a short circuit far above it clears in milliseconds. The complete behaviour is drawn as the **time–current curve**, the most useful page of any fuse datasheet.

The wire has an I²t limit as well. With no time to shed heat, the energy $I^2Rt$ all goes into warming the copper; if it pushes the insulation past its short-circuit limit (about 160 °C for PVC), the cable is damaged. A heat balance on the copper gives the time to reach that limit:

$$t = \\frac{c_v\\,S^2\\,\\Delta T}{\\rho\\,I^2} \\;\\approx\\; \\left(\\frac{115\\,S}{I}\\right)^2 \\qquad (S\\ \\text{in mm}^2,\\ t\\ \\text{in s},\\ \\text{PVC copper})$$

where $c_v$ is copper's heat capacity per unit volume and $S$ the cross-section. A 1.5 mm² wire carrying 300 A reaches its limit in about a third of a second. **The fuse's time–current curve must lie below the wire's at every current**: that is the whole design check, and the simulation below draws both.

### Choosing a fuse
1. **Current rating**: above the normal load, with margin. Many fuses should carry continuously no more than about 75 % of their rating, less in a hot enclosure: $I_n \\ge I_\\text{load}/(0.75\\,K_T)$.
2. **Speed**: fast-acting (F) for electronics and loads without surges; time-delay (T, "slow-blow") for motors, transformers and capacitive inputs whose inrush would blow a fast fuse. The inrush pulse's I²t should sit well below the fuse's melting I²t.
3. **Wire protection**: the rating and the curve must protect the thinnest wire downstream.
4. **Voltage rating**: at least the circuit voltage. A 32 V automotive blade fuse has no business on mains.
5. **Breaking capacity**: the largest current it can interrupt safely. A glass 5 × 20 mm fuse may be rated to break only 35 A at 250 V; where a supply can deliver kiloamperes into a short — any mains installation, any large battery — use a sand-filled ceramic fuse rated for 1500 A or more. An overwhelmed glass fuse can shatter and keep arcing.

Never replace a blown fuse with a larger one: the wire it protects has not changed.

### Other protective devices
- **Circuit breakers** (MCBs) combine a thermal trip for overloads and a magnetic trip for short circuits. The curve letter says where the magnetic trip starts: B at 3–5 times the rating (resistive loads), C at 5–10 times (general use, motors), D at 10–20 times (transformers and big inrush).
- **Resettable PTC fuses** ("polyfuses") are polymer parts that turn highly resistive when hot and recover once the fault is removed. They trip slowly — tenths of a second to seconds — pass a small current while tripped, and have more resistance than a fuse. Good for USB ports and battery packs.
- **TVS diodes and MOVs** clamp voltage spikes from inductive switching, electrostatic discharge or surges on mains lines. MOVs wear a little with every large surge.
- **Reverse-polarity protection**: a series diode (simple, but it loses 0.3–0.7 V), or a P-channel MOSFET arranged so that it conducts only when the battery is the right way round, losing almost nothing.
- **Residual-current devices** (RCDs, GFCIs) trip at about 30 mA of current leaking to earth — protection for people, which a fuse cannot give.

> [!warn] Fuses protect wiring against overload and short circuit; they do not protect people against electric shock. That needs insulation, earthing and a residual-current device. Fit the fuse in the live conductor, as close to the source as possible.
`,
  ideas: [
    'A fuse protects the wire: size it for the wire, and put it at the source end.',
    'Small overloads take seconds or minutes to clear; large faults clear in milliseconds, set by the fuse\'s I²t.',
    'The fuse\'s time–current curve must lie below the wire\'s damage curve at every current.',
    'Time-delay fuses ride through motor, transformer and capacitor inrush; fast fuses protect electronics.',
    'Breaking capacity matters wherever the supply can deliver a huge fault current.'
  ],
  pitfalls: [
    'A fuse protects the device it feeds — It protects the wiring. A device can burn internally long before its supply fuse notices.',
    'If a fuse keeps blowing, fit a bigger one — The wire is the same, so a bigger fuse no longer protects it. Find the fault, or the inrush, instead.',
    'Any fuse of the right current will do — Voltage rating, breaking capacity and speed are just as important; a glass fuse on a stiff supply can fail violently.'
  ],
  derivation: {
    title: 'Derive the short-circuit limit of a wire',
    steps: [
      { text: 'A length $\\ell$ of wire of cross-section $S$ carrying a fault current $I$ for a time $t$ receives the heat', tex: 'Q = I^2 R\\,t = I^2\\,\\frac{\\rho\\,\\ell}{S}\\,t' },
      { text: 'In a short fault no heat escapes (adiabatic heating), so it all raises the temperature of the copper, whose heat capacity per unit volume is $c_v$:', tex: 'Q = c_v\\,(S\\,\\ell)\\,\\Delta T' },
      { text: 'Equate the two. The length cancels — every metre heats alike — and the time to reach the limit is', tex: 't = \\frac{c_v\\,S^2\\,\\Delta T}{\\rho\\,I^2}' },
      { text: 'For PVC-insulated copper, heated from 70 °C to 160 °C ($\\Delta T$ = 90 K, $c_v$ = 3.45 MJ/(m³·K), mean $\\rho$ = 2.37 × 10⁻⁸ Ω·m):', tex: '\\sqrt{\\frac{c_v\\,\\Delta T}{\\rho}} = 1.14\\times10^{8}\\ \\mathrm{A\\,s^{1/2}/m^2} \\approx 115\\ \\mathrm{A\\,s^{1/2}/mm^2}' },
      { text: 'Hence the rule used in wiring standards, with $S$ in mm²:', tex: 't = \\left(\\frac{115\\,S}{I}\\right)^2 \\qquad\\text{or}\\qquad I^2 t = 115^2\\,S^2' }
    ]
  },
  formulas: [
    {
      name: 'Adiabatic heating of a wire in a short circuit',
      expr: 't = cv*S^2*dT/(rho*I^2)', tex: 't = \\frac{c_v\\,S^2\\,\\Delta T}{\\rho\\,I^2}',
      vars: {
        t: { name: 'time to reach the insulation\'s limit', q: 'time', unit: 's' },
        cv: { name: 'heat capacity of copper per unit volume', unit: 'J/(m³·K)', value: 3.45e6, tex: 'c_v' },
        S: { name: 'conductor cross-section', q: 'area', unit: 'mm²', value: 1.5 },
        dT: { name: 'allowed temperature rise (70 → 160 °C for PVC)', q: 'dtemp', unit: 'K', value: 90, tex: '\\Delta T' },
        rho: { name: 'mean resistivity over that range', q: 'resistivity', unit: 'Ω·m', value: 2.37e-8, tex: '\\rho' },
        I: { name: 'fault current', q: 'current', unit: 'A', value: 300 }
      },
      note: 'No heat is lost: valid for times up to a few seconds. With these copper and PVC values it reduces to the familiar $t = (115\\,S/I)^2$ with S in mm².',
      practice: { unknowns: ['t', 'S'] },
      stories: {
        t: 'A {S} PVC-insulated copper wire carries a fault current of {I}. How long before its insulation is damaged?',
        S: 'A fault current of {I} may last up to {t} before the fuse opens. What copper cross-section survives it?'
      }
    },
    {
      name: 'I²t of the charging surge of a capacitor',
      expr: 'I2t = C*V^2/(2*R)', tex: '\\mathrm{I^2t} = \\frac{C V^2}{2R}',
      vars: {
        I2t: { name: 'I²t of the charging pulse', unit: 'A²·s', tex: '\\mathrm{I^2t}' },
        C: { name: 'input capacitance', q: 'capacitance', unit: 'µF', value: 1000 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'total resistance in the charging path', q: 'resistance', unit: 'Ω', value: 0.1 }
      },
      note: 'Compare with the fuse\'s melting I²t. For surges that repeat at every switch-on, keep the pulse well below it (often to 20–30 %), or choose a time-delay fuse.',
      stories: { I2t: 'Plugging a board with {C} of input capacitance into a {V} supply charges it through {R}. What is the I²t of the surge?' }
    },
    {
      name: 'Fuse rating with derating',
      expr: 'In = I/(Kd*Kt)', tex: 'I_n = \\frac{I_{\\text{load}}}{K_d\\,K_T}',
      vars: {
        In: { name: 'minimum fuse rating', q: 'current', unit: 'A', tex: 'I_n' },
        I: { name: 'continuous load current', q: 'current', unit: 'A', value: 6, tex: 'I_{\\text{load}}' },
        Kd: { name: 'continuous-load factor', q: 'ratio', unit: '', value: 0.75, tex: 'K_d' },
        Kt: { name: 'temperature derating factor (1 at 25 °C)', q: 'ratio', unit: '', value: 1, tex: 'K_T' }
      },
      note: 'Then take the next standard rating above, and check that it still protects the wire. Both factors come from the fuse datasheet.',
      practice: { unknowns: ['In'] }
    }
  ],
  examples: [
    {
      title: 'Fusing a 12 V accessory circuit',
      q: 'A 6 A pump is fed from a 12 V battery through 4 m of 1.5 mm² wire each way. Choose the fuse, and check what happens in a short circuit at the pump.',
      steps: [
        'Rating: $6/0.75 = 8$ A → a 10 A blade fuse at the battery.',
        'The wire: 1.5 mm² is good for about 15–20 A continuously, so 10 A protects it.',
        'Short at the far end: 8 m of wire at 11.5 mΩ/m is 92 mΩ; with about 10 mΩ of battery and 8 mΩ of fuse, the fault current is $12/0.11 \\approx 110$ A — eleven times the rating. A blade fuse clears that within tens of milliseconds.',
        'The wire\'s limit at 110 A is $(115 \\times 1.5/110)^2 = 2.5$ s: fifty times longer. The fuse wins comfortably.',
        'Normal running: the drop is $6 \\times 0.092 = 0.55$ V, 4.6 % of the supply — acceptable for a pump.'
      ],
      a: 'A 10 A fuse at the battery; a short at the pump clears in milliseconds, long before the wire suffers.'
    },
    {
      title: 'Will the inrush blow it?',
      q: 'A controller with 1000 µF of input capacitance is plugged into a 24 V supply; the charging path has about 0.1 Ω. Suppose the chosen 5 A fast fuse has a melting I²t of 8 A²s. Is it safe?',
      steps: [
        {text: 'The surge:', tex: '\\mathrm{I^2t} = \\frac{C V^2}{2R} = \\frac{10^{-3} \\times 24^2}{2 \\times 0.1} = 2.9\\ \\mathrm{A^2 s}'},
        'That is 36 % of the melting I²t. It would not blow the fuse the first time, but repeated every switch-on it fatigues the element, and the fuse fails after months for no obvious reason.',
        'Better: a time-delay fuse of the same rating (whose melting I²t is typically several times higher), or an inrush limiter (an NTC thermistor or a soft-start MOSFET) in the input.'
      ],
      a: 'Marginal: 2.9 A²s against 8 A²s. Use a time-delay fuse or limit the inrush.'
    }
  ],
  quiz: [
    { q: 'Where should the fuse protecting a car accessory\'s supply wire be fitted?', choices: ['next to the accessory', 'in the middle of the wire', 'as close to the battery as possible', 'in the ground return'], a: 2,
      why: 'A short anywhere along the wire must be downstream of the fuse. Fitted near the load, a short in the wire itself would be unprotected.' },
    { q: 'A 10 A fuse in a circuit wired with 0.75 mm² cable keeps blowing, so someone fits a 20 A fuse. What is the risk?', choices: ['None — fuses are conservative', 'The wire can now overheat without the fuse opening', 'The 20 A fuse will blow sooner', 'The load will get more current'], a: 1,
      why: 'The fuse was sized for the wire. With 20 A the wire can carry an overload hot enough to damage its insulation. Find why the 10 A fuse blows.' },
    { q: 'Which fuse suits the primary of a mains transformer?', choices: ['fast-acting (F)', 'time-delay (T)', 'a PTC resettable fuse', 'any fuse of twice the running current'], a: 1,
      why: 'A transformer\'s switch-on inrush can be ten times its running current for a few cycles; a time-delay fuse rides through it while still protecting against a real fault.' },
    { q: 'How long can a 1.5 mm² PVC-insulated copper wire carry 500 A before its insulation limit is reached? Use t = (115 S/I)².', answer: 0.119, unit: 's',
      why: '(115 × 1.5/500)² = 0.345² = 0.12 s. A fuse must clear such a fault well within that.' },
    { q: 'A type C circuit breaker rated 16 A trips magnetically (instantly) somewhere between…', choices: ['16 and 24 A', '48 and 80 A', '80 and 160 A', '160 and 320 A'], a: 2,
      why: 'Type C: 5–10 times the rating. Below that only the slower thermal trip acts.' }
  ],
  applications: ['Automotive fuse boxes, one fuse per wiring branch.', 'Mains inlet fuses in equipment, and breakers in building installations.', 'Resettable PTC fuses on USB ports and battery packs.', 'TVS and MOV surge protection on data lines and mains inputs.'],
  sim: 'cp-wire-fuse'
},

{
  id: 'wire-sizing', parent: 'switching-protection', title: 'Wire gauge, resistance and current capacity', level: 1,
  short: 'A wire is a resistor: it drops voltage and makes heat in proportion to its length and inversely to its cross-section. Choosing a gauge means limiting both the voltage drop and the temperature rise.',
  keywords: ['wire gauge', 'AWG', 'mm²', 'cross-section', 'voltage drop', 'ampacity', 'current capacity', 'cable sizing', 'copper resistance', 'PCB trace width', 'derating', 'bundling', 'aluminium wire'],
  prereq: ['physics:resistivity', 'resistance-ohms-law', 'power-energy'],
  related: ['fuses-protection', 'resistors', 'batteries', 'dc-motor-control'],
  body: `
Every wire is a resistor. Its resistance is $R = \\rho L/A$ ([[physics:resistivity|resistivity]]), with copper's $\\rho = 1.72 \\times 10^{-8}\\ \\Omega\\,\\mathrm{m}$ (0.0172 Ω·mm²/m) at 20 °C: a metre of 1 mm² copper has 17 mΩ, and the resistance rises by about 0.4 % per kelvin. Two things follow from it — a **voltage drop** $IR$ and **heat** $I^2R$ — and a wire must be thick enough for both.

### The round trip
Current goes out along one conductor and back along another, so the resistance that matters is that of **twice the length** of the run:

$$V_\\text{drop} = \\frac{2 L I \\rho}{A}$$

This is the everyday mistake in low-voltage work. Ten metres of 1.5 mm² cable to a 12 V load drawing 10 A drops $2 \\times 10 \\times 10 \\times 0.0172/1.5 = 2.3$ V — nearly a fifth of the supply — while the wire is barely warm. On 230 V the same 2.3 V would be irrelevant. **At low voltage, the voltage drop rather than the heating usually decides the gauge.** Common limits: 3 % for lighting and electronics, 5–10 % for motors and heaters that tolerate it.

### Gauges
Metric wire is sold by cross-section: 0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10 mm². The **American Wire Gauge** counts the other way — bigger numbers are thinner — and has two handy rules:
- every **3 gauges** halve the cross-section, and double the resistance per metre;
- every **10 gauges** divide the cross-section by ten.

The diameter is $d = 0.127\\ \\mathrm{mm} \\times 92^{(36-n)/39}$. Useful anchors: 24 AWG ≈ 0.2 mm² (signal wire), 18 AWG ≈ 0.82 mm², 14 AWG ≈ 2.1 mm², 10 AWG ≈ 5.3 mm². Stranded wire of the same gauge has almost the same copper area and survives movement and vibration; solid wire belongs in fixed installations and breadboards.

### Heating and current capacity
The heat, $I^2R$ per metre, must escape through the insulation to the surroundings. A wire's current rating is the current at which it settles at its insulation's temperature limit — 70 °C for ordinary PVC, 90–105 °C for cross-linked polyethylene and silicone, about 200 °C for PTFE. The rating therefore depends on **how the wire is installed**, not only on its size:
- a single wire in free air cools best; a bundle or a conduit traps heat, and ratings fall to 50–70 % in large bundles;
- a hot environment — an engine bay, a closed cabinet — leaves less room for the rise;
- a cable reel left coiled is the worst case: it can overheat at a fraction of its rated current.

Rough free-air figures for a single PVC copper wire: 0.5 mm² about 10 A, 1.5 mm² about 20 A, 2.5 mm² about 27 A, 10 mm² about 75 A. Building wiring is different: it follows national rules (BS 7671, IEC 60364, the NEC) with their own installation methods and correction factors.

The rating grows more slowly than the area. The heat per metre falls as $1/A$, but it has to escape through a surface that grows only with the diameter, so doubling the cross-section raises the current capacity by only about 60–70 %.

### Traces on a board
A printed-circuit trace is a flat wire. One-ounce copper is 35 µm thick, so a 1 mm wide trace has a cross-section of 0.035 mm² and about 0.5 mΩ per millimetre of length. Design charts (IPC-2221 and IPC-2152) give the current for a chosen temperature rise; as a rough guide, a 1 mm outer-layer trace in 1 oz copper carries 2–3 A for a 10 K rise. Inner layers, buried in the board, carry less.

### Aluminium
Aluminium's resistivity is about 1.6 times copper's, so it needs about 1.6 times the area for the same resistance — but half the weight for the same conductance, which is why overhead lines use it. Its joints need care: it creeps under pressure and oxidises, and loose aluminium terminations have started many fires.
`,
  ideas: [
    'A wire\'s resistance is ρL/A, and the current flows through the length twice: out and back.',
    'At low voltage the voltage drop usually decides the gauge; at mains voltage the heating does.',
    'Three AWG steps halve the cross-section; ten steps divide it by ten.',
    'Current capacity depends on the insulation\'s temperature limit and on how the wire can shed heat — bundles, conduits and hot surroundings derate it.',
    'Current capacity grows more slowly than cross-section, because the heat escapes through the surface.'
  ],
  pitfalls: [
    'Use the one-way length to work out the drop — The current flows out and back: double the length (unless the chassis is the return, which has its own resistance).',
    'A wire that does not get hot is thick enough — At 12 V a cool wire can still lose 10–20 % of the voltage; check the drop as well as the heat.',
    'A rating is a property of the wire alone — It depends on installation and surroundings; the same wire carries far less in a bundle, a conduit or a hot enclosure.'
  ],
  formulas: [
    {
      name: 'Voltage drop in a two-wire run',
      expr: 'Vd = 2*L*I*rho/A', tex: 'V_{\\text{drop}} = \\frac{2 L I \\rho}{A}',
      vars: {
        Vd: { name: 'voltage lost in the wiring', q: 'voltage', unit: 'V', tex: 'V_{\\text{drop}}' },
        L: { name: 'one-way length of the run', q: 'length', unit: 'm', value: 10 },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        rho: { name: 'resistivity (copper 0.0172, aluminium 0.028)', q: 'resistivity', unit: 'Ω·mm²/m', value: 0.0172, tex: '\\rho' },
        A: { name: 'cross-section of each conductor', q: 'area', unit: 'mm²', value: 1.5 }
      },
      note: 'Resistivity at 20 °C; a warm cable has a few percent more.',
      practice: { unknowns: ['Vd', 'A', 'L'] },
      stories: {
        Vd: 'A {I} load is fed through {L} of {A} copper cable (out and back). How much voltage is lost?',
        A: 'A {I} load sits {L} from its supply. To lose no more than {Vd}, what cross-section must each conductor have?',
        L: 'With {A} conductors carrying {I}, how far away can the load be before {Vd} is lost?'
      }
    },
    {
      name: 'Diameter of an AWG wire',
      expr: 'd = 0.000127*92^((36 - n)/39)', tex: 'd = 0.127\\,\\mathrm{mm} \\times 92^{(36-n)/39}',
      vars: {
        d: { name: 'conductor diameter', q: 'length', unit: 'mm' },
        n: { name: 'gauge number (0 = 0 AWG, −1 = 00 AWG …)', q: 'none', value: 18, int: true, signed: true, min: -3, max: 40 }
      },
      stories: { d: 'What is the diameter of a {n} AWG wire?' }
    },
    {
      name: 'Cross-section from the diameter',
      expr: 'A = pi*d^2/4', tex: 'A = \\frac{\\pi d^2}{4}',
      vars: {
        A: { name: 'cross-section', q: 'area', unit: 'mm²' },
        d: { name: 'conductor diameter', q: 'length', unit: 'mm', value: 1.024 }
      }
    },
    {
      name: 'Steady temperature rise of a wire in air',
      expr: 'dT = I^2*rho*Rth/A', tex: '\\Delta T = \\frac{I^2 \\rho}{A}\\,R_{\\theta}\'',
      vars: {
        dT: { name: 'temperature rise above the air', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        I: { name: 'current', q: 'current', unit: 'A', value: 20 },
        rho: { name: 'resistivity at the working temperature', q: 'resistivity', unit: 'Ω·mm²/m', value: 0.0205, tex: '\\rho' },
        Rth: { name: 'thermal resistance per metre, wire to air', unit: 'K·m/W', value: 8.1, tex: 'R_{\\theta}\'' },
        A: { name: 'cross-section', q: 'area', unit: 'mm²', value: 1.5 }
      },
      note: 'Heat made per metre, $I^2\\rho/A$, times the thermal resistance of a metre of wire to the air. About 8 K·m/W suits a single 1.5 mm² PVC wire in still air; a bundle or a conduit raises it.',
      practice: { unknowns: ['dT', 'I'] },
      stories: { I: 'A {A} wire has a thermal resistance to air of {Rth} per metre. What current raises it {dT} above the air?' }
    }
  ],
  examples: [
    {
      title: 'Feeding an LED strip',
      q: 'A 12 V LED strip draws 8 A and sits 6 m from its power supply. What copper cross-section keeps the drop below 3 %?',
      steps: [
        'Allowed drop: $0.03 \\times 12 = 0.36$ V.',
        {text: 'Solve the drop formula for the area:', tex: 'A = \\frac{2 L I \\rho}{V_{\\text{drop}}} = \\frac{2 \\times 6 \\times 8 \\times 0.0172}{0.36} = 4.6\\ \\mathrm{mm^2}'},
        'Next standard size: 6 mm² (or 10 AWG, 5.3 mm²). At 5 % you would need 2.75 mm² → 4 mm² (12 AWG).',
        'At 8 A a 6 mm² cable is stone cold: here the drop alone sets the size. Moving the supply closer, or using a 24 V strip (half the current for the same power), is cheaper than copper.'
      ],
      a: '6 mm² (10 AWG) for 3 %; 4 mm² would give about 4.1 %.'
    },
    {
      title: 'AWG in millimetres',
      q: 'What are the diameter and cross-section of 16 AWG wire, and which gauge has twice its area?',
      steps: [
        {text: 'Diameter:', tex: 'd = 0.127 \\times 92^{(36-16)/39} = 0.127 \\times 92^{0.513} = 1.29\\ \\mathrm{mm}'},
        'Area: $\\pi \\times 1.29^2/4 = 1.31\\ \\mathrm{mm}^2$ — close to metric 1.5 mm².',
        'Twice the area is three gauges thicker: 13 AWG, about 2.6 mm².'
      ],
      a: '1.29 mm and 1.31 mm²; 13 AWG has twice the area.'
    }
  ],
  quiz: [
    { q: 'Going from 14 AWG to 11 AWG, the cross-section…', choices: ['halves', 'doubles', 'triples', 'grows by 10 %'], a: 1,
      why: 'Three gauges double or halve the area; smaller numbers are thicker.' },
    { q: 'A 12 V pump draws 15 A through 5 m (each way) of 2.5 mm² copper cable. How much voltage is lost?', answer: 1.03, unit: 'V',
      why: '2 × 5 × 15 × 0.0172/2.5 = 1.03 V — 8.6 % of the supply.' },
    { q: 'Why do cable reels carry a lower rating when not fully unwound?', choices: ['The copper is thinner inside', 'The coiled turns trap each other\'s heat', 'Induction between the turns', 'The plug limits the current'], a: 1,
      why: 'Wound up, the cable cannot shed its I²R heat; the inner turns heat each other and the insulation can melt.' },
    { q: 'A wire rated 20 A in free air can still carry 20 A in a bundle of ten similar wires.', a: false,
      why: 'In a bundle each wire\'s heat has less room to escape; ratings typically fall to 50–70 %.' },
    { q: 'Doubling the cross-section of a wire in free air raises its current rating by about…', choices: ['100 %', '60–70 %', '41 %', '0 %'], a: 1,
      why: 'Heat per metre falls as 1/A but the cooling surface grows only as the diameter (√A): the rating grows roughly as A^0.75, i.e. ×1.7.' }
  ],
  applications: ['Battery, solar and vehicle wiring, where the voltage drop dominates.', 'Machine and control-panel wiring, sized by installation method and ambient temperature.', 'Trace widths for the power paths of circuit boards and motor drives.', 'Long sensor and power runs in buildings and on machines.'],
  sim: 'cp-wire-fuse'
}

);
