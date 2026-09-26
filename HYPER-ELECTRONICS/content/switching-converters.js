/* HYPER-ELECTRONICS · content/switching-converters.js — pulse-width modulation, the
 * buck, boost and buck–boost converters, and where a converter's losses go. */
Hyper.add(

{
  id: 'pwm', parent: 'switching-converters', title: 'Pulse-width modulation', level: 1,
  short: 'Switch a load fully on and fully off, quickly, and vary the fraction of time it is on: the average follows the duty cycle and almost nothing is wasted in the switch. PWM dims LEDs, sets motor speeds, controls heaters and makes analogue voltages.',
  keywords: ['PWM', 'pulse-width modulation', 'duty cycle', 'switching frequency', 'average voltage', 'dimming', 'motor speed', 'timer', 'resolution', 'PWM DAC', 'RC filter', 'flicker', 'audible noise'],
  prereq: ['periodic-waveforms', 'rms-values', 'mosfet-switch'],
  related: ['buck-converter', 'dc-motor-control', 'dac', 'leds', 'timer-555', 'microcontrollers'],
  body: `
A switch that is fully on or fully off wastes almost nothing. Fully on, the voltage across it is tiny; fully off, the current through it is zero; either way $V \\cdot I \\approx 0$. **Pulse-width modulation** exploits this: switch the load on and off at a fixed frequency and vary the fraction of each period for which it is on, the **duty cycle** $D$. The average voltage delivered is

$$\\bar V = D\\,V$$

and something in the load does the averaging — the thermal mass of a heater, the inductance and inertia of a motor, the eye watching an LED, or an electrical filter. Compare a linear control: to run a 12 V, 10 A heater at a third of its power, a series transistor would itself dissipate about 29 W; a PWM switch with 10 mΩ of on-resistance dissipates a third of a watt.

### Choosing the frequency
The frequency must be high enough for the load to average, and low enough to keep switching losses and drive circuitry reasonable:
- **LEDs**: above about 200 Hz the eye sees steady light, but cameras and quick eye movements still catch flicker below a few kilohertz; 1–20 kHz is common. The current amplitude sets the colour and efficiency, the duty cycle the brightness ([[leds]]).
- **DC motors**: the winding inductance smooths the current when the period is short compared with $L/R$. At a few kilohertz the motor whines, so 16–25 kHz — just above hearing — is usual ([[dc-motor-control]]).
- **Heaters**: thermal time constants are seconds or minutes, so a period of a second or longer is fine — even whole mains half-cycles, switched by a zero-cross solid-state relay.
- **Switching converters**: 100 kHz to a few megahertz, so that the inductor and capacitors can be small ([[buck-converter]]).

### Resolution
A microcontroller makes PWM with a timer counting clock ticks. With a clock $f_\\text{clk}$ and an $n$-bit counter the PWM frequency is $f_\\text{clk}/2^n$: 16 MHz with 8 bits gives 62.5 kHz; a 72 MHz clock set to 20 kHz leaves 3600 steps, almost 12 bits. Higher frequency means fewer steps — a trade-off that shows in LED dimming, where the eye is most sensitive at low brightness and a single step from 0 to 1/256 is plainly visible.

### The average is not the whole story
- For a **resistive heater** on a fixed supply, power is proportional to $D$, not $D^2$: each pulse delivers the full $V^2/R$, for a fraction $D$ of the time, so $P = D\\,V^2/R$. The [[rms-values|RMS]] voltage is $\\sqrt{D}\\,V$, not $D\\,V$.
- In an **inductive load** such as a motor, the current ripples around its average by about $V D(1 - D)/(fL)$, largest at 50 % duty.
- An inductive load needs a **path for its current** during the off time: a [[flyback-diode|flyback diode]] or a second transistor.

### PWM as a digital-to-analogue converter
Filter a PWM output with an RC low-pass and you get a DC voltage proportional to the duty cycle — a cheap [[dac|DAC]]. For a filter much slower than the PWM period, the ripple left on it is

$$\\Delta V \\approx \\frac{V\\,D(1 - D)}{f R C}$$

largest at 50 % duty. The trade-off is speed: a slower filter leaves less ripple but responds more slowly (its time constant is $RC$). A second filter stage, or a higher PWM frequency, improves both.
`,
  ideas: [
    'A switch that is fully on or fully off dissipates almost nothing, so PWM is efficient.',
    'The average voltage is D·V; the load or a filter does the averaging.',
    'Choose the frequency for the load: hundreds of hertz for LEDs, above hearing for motors, seconds for heaters.',
    'Timer resolution falls as the PWM frequency rises: f = f_clk/2ⁿ.',
    'Heater power goes as D, the RMS voltage as √D — the average is not the whole story.'
  ],
  pitfalls: [
    'PWM power goes as the square of the duty cycle — On a fixed supply each pulse is at full power, so a resistor\'s power is proportional to D.',
    'The RMS value of a PWM wave is D·V — It is √D·V; the average is D·V.',
    'Any frequency will do for a motor — Low frequencies make audible noise and ragged current; too high a frequency wastes power in switching.'
  ],
  formulas: [
    {
      name: 'Average output of PWM',
      expr: 'Vavg = D*V', tex: '\\bar V = D\\,V',
      vars: {
        Vavg: { name: 'average voltage', q: 'voltage', unit: 'V', tex: '\\bar V' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12 }
      },
      stories: { D: 'What duty cycle gives an average of {Vavg} from a {V} supply?' }
    },
    {
      name: 'Power in a resistive load under PWM',
      expr: 'P = D*V^2/R', tex: 'P = D\\,\\frac{V^2}{R}',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 33, min: 0, max: 100 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12 },
        R: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 1.2 }
      },
      stories: {
        P: 'A {R} heater on {V} is switched at a duty cycle of {D}. What average power does it get?',
        D: 'A {R} heater on {V} must deliver {P}. What duty cycle?'
      }
    },
    {
      name: 'PWM frequency from a timer',
      expr: 'f = fclk/2^n', tex: 'f = \\frac{f_{\\text{clk}}}{2^n}',
      vars: {
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz' },
        fclk: { name: 'timer clock', q: 'frequency', unit: 'MHz', value: 16, tex: 'f_{\\text{clk}}' },
        n: { name: 'counter resolution (bits)', q: 'count', value: 8, int: true }
      },
      note: 'For a counter that runs the full 2ⁿ steps; many timers let you choose any top value, trading resolution for frequency.',
      practice: { unknowns: ['f'] }
    },
    {
      name: 'Ripple after an RC filter (PWM DAC)',
      expr: 'dV = V*D*(1 - D)/(f*R*C)', tex: '\\Delta V = \\frac{V\\,D(1 - D)}{f R C}',
      vars: {
        dV: { name: 'peak-to-peak ripple', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        V: { name: 'PWM amplitude', q: 'voltage', unit: 'V', value: 3.3 },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 },
        R: { name: 'filter resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'filter capacitor', q: 'capacitance', unit: 'µF', value: 1 }
      },
      note: 'Valid when RC is much longer than the PWM period. The filter\'s time constant RC is also its settling time scale.',
      practice: { unknowns: ['dV', 'C'] },
      stories: { C: 'A {V}, {f} PWM output is filtered by {R}. What capacitor keeps the ripple below {dV} at a duty cycle of {D}?' }
    }
  ],
  examples: [
    {
      title: 'A 3D printer\'s heated bed',
      q: 'A 12 V bed heater of 1.2 Ω needs 40 W to hold its temperature. Find the duty cycle and the MOSFET\'s loss (on-resistance 10 mΩ), and compare with a linear transistor control.',
      steps: [
        'Full power: $12^2/1.2 = 120$ W, so $D = 40/120 = 33$ %.',
        'The MOSFET carries 10 A for a third of the time: $P = D\\,I^2 R = 0.33 \\times 100 \\times 0.01 = 0.33$ W.',
        'Linear control: 40 W in 1.2 Ω needs $\\sqrt{40 \\times 1.2} = 6.9$ V across the bed at 5.8 A, so the transistor drops 5.1 V at 5.8 A: 29 W of heat.',
        'The bed\'s thermal time constant is minutes, so a PWM period of even a second smooths perfectly.'
      ],
      a: '33 % duty; 0.33 W in the MOSFET, against 29 W for linear control.'
    },
    {
      title: 'A PWM DAC',
      q: 'A 3.3 V, 20 kHz PWM output must give a DC level with at most 1 mV of ripple at any duty cycle. Choose a single RC filter and find its settling time.',
      steps: [
        'Worst case is 50 % duty: $RC \\ge 3.3 \\times 0.25/(20\\,000 \\times 0.001) = 41$ ms.',
        'Take $R = 10\\ \\mathrm{k\\Omega}$ and $C = 4.7\\ \\mu\\mathrm{F}$: $RC = 47$ ms, ripple 0.88 mV.',
        'Settling to 1 % takes about $4.6\\,RC = 0.22$ s — slow. Two RC stages of 10 ms each give similar ripple with a far faster response.'
      ],
      a: '10 kΩ and 4.7 µF (47 ms): 0.9 mV ripple but a slow 0.2 s response.'
    }
  ],
  quiz: [
    { q: 'A heater on a fixed supply runs at 50 % duty cycle. Compared with full on, its power is…', choices: ['a quarter', 'a half', 'the same', '70 %'], a: 1,
      why: 'Each pulse delivers full power, for half the time: P = D·V²/R.' },
    { q: 'A motor driven by 2 kHz PWM whines audibly. The usual fix is…', choices: ['lower the frequency to 200 Hz', 'raise the frequency to about 20 kHz', 'reduce the duty cycle', 'add a series resistor'], a: 1,
      why: 'Magnetic forces in the motor pulse at the PWM frequency; above about 18–20 kHz it is inaudible, and the current is smoother too.' },
    { q: 'Why is PWM far more efficient than controlling a load with a transistor in its linear region?', choices: ['PWM transistors are larger', 'The switch is either fully on (little voltage) or fully off (no current), so it dissipates little', 'PWM uses less current', 'The load absorbs the losses'], a: 1,
      why: 'Power in the switch is V × I; in PWM one of the two is always nearly zero.' },
    { q: 'What PWM frequency does a 16 MHz timer give with a 10-bit counter?', answer: 15.625, unit: 'kHz',
      why: '16 MHz / 1024 = 15.625 kHz.' },
    { q: 'The RMS voltage of a PWM waveform of amplitude V and duty cycle D is D·V.', a: false,
      why: 'It is √D·V. The average is D·V; the RMS, which sets heating, is larger.' }
  ],
  applications: ['LED dimming, from phone backlights to stage lighting.', 'Speed control of fans, pumps, drones and machine-tool axes.', 'Temperature control of heaters and 3D-printer beds.', 'Cheap DACs, and class-D audio amplifiers.'],
  sim: 'cp-motor-pwm'
},

{
  id: 'buck-converter', parent: 'switching-converters', title: 'The buck converter', level: 2,
  short: 'A switch, a diode, an inductor and a capacitor turn a higher DC voltage into a lower one at 85–95 % efficiency: the output is the duty cycle times the input, and the inductor current ramps up and down between them.',
  keywords: ['buck converter', 'step-down converter', 'switching regulator', 'duty cycle', 'inductor ripple current', 'output ripple', 'continuous conduction mode', 'discontinuous conduction mode', 'CCM', 'DCM', 'synchronous rectification', 'volt-second balance', 'switch node', 'LM2596', 'layout'],
  prereq: ['pwm', 'inductors', 'capacitors', 'rl-transient'],
  related: ['boost-converter', 'converter-losses', 'linear-regulators', 'buck-boost', 'decoupling', 'diode-types'],
  body: `
A linear regulator wastes $(V_\\text{in} - V_\\text{out})\\,I$. A **buck converter** avoids that by switching instead of resisting. A transistor connects the input to a node — the **switch node** — for a fraction $D$ of each period, and a diode (or a second switch) connects that node to ground for the rest. The switch node is therefore a square wave between $V_\\text{in}$ and about 0 V, and an inductor and a capacitor filter it down to its average:

$$V_\\text{out} = D\\,V_\\text{in}$$

### Why: volt-seconds on the inductor
In steady state the inductor current must end each period where it began, so the voltage across the inductor must average to zero ([[inductors|v = L di/dt]]). While the switch is on, the inductor sees $V_\\text{in} - V_\\text{out}$ and its current ramps up. While it is off, the diode holds the switch node near ground, the inductor sees $-V_\\text{out}$, and its current ramps down, now flowing through the diode. Balancing the two:

$$(V_\\text{in} - V_\\text{out})\\,D\\,T = V_\\text{out}\\,(1 - D)\\,T \\;\\Rightarrow\\; V_\\text{out} = D\\,V_\\text{in}$$

The inductor current is a triangle riding on the load current. Nothing in the ideal circuit dissipates power, so power in equals power out, and the input current averages only $D$ times the output current: 12 V to 5 V at 2 A draws about 0.83 A from the input, not 2 A.

### Ripple current and the inductor
The peak-to-peak ripple of the inductor current is

$$\\Delta I_L = \\frac{(V_\\text{in} - V_\\text{out})\\,V_\\text{out}}{V_\\text{in}\\,f\\,L}$$

Designers aim for 20–40 % of the full load current: less needs a big inductor, more stresses the capacitors and raises losses. The inductor's saturation current must exceed the peak, $I_\\text{out} + \\Delta I_L/2$, with margin. Higher frequency allows a smaller inductor, at the price of switching losses ([[converter-losses]]).

### The capacitors
The **output capacitor** absorbs the triangular ripple current. Its capacitance alone would leave a ripple of $\\Delta I_L/(8fC)$, but its ESR adds $\\Delta I_L \\cdot R_\\text{ESR}$ — usually the larger term with an electrolytic ([[capacitors]]). The **input capacitor** has the harder job: the input current is chopped into rectangular pulses of the full load current, which the capacitor must supply locally, with an RMS current of $I_\\text{out}\\sqrt{D(1 - D)}$ — half the load current at 50 % duty. Use low-ESR ceramics right at the switch.

### Continuous and discontinuous conduction
When the load current falls below half the ripple, the inductor current reaches zero before the period ends and the diode stops conducting: **discontinuous conduction mode (DCM)**. The output is then no longer $D\\,V_\\text{in}$ but higher, depending on the load; a real regulator's feedback simply reduces $D$ to compensate. In a **synchronous** buck a second MOSFET replaces the diode, the inductor current can reverse, and the converter stays in continuous mode at any load ("forced PWM") — unless the controller deliberately skips pulses at light load to save power.

### A real regulator
Controller ICs — the veteran LM2596 at 150 kHz, and many modern parts from 500 kHz to a few megahertz with the switches built in — add feedback (a divider to a reference, as in a [[linear-regulators|linear regulator]]), soft start, current limiting and compensation of the control loop. Efficiency is typically 85–95 %. Two practical rules:
- **Layout is part of the circuit.** The loop from the input capacitor through the switch and the diode carries pulsed current with nanosecond edges. Keep it as small as possible, or it radiates and rings.
- **Use a Schottky diode** (low forward voltage, no reverse recovery) or a synchronous switch; an ordinary rectifier diode wastes energy at every edge.
`,
  ideas: [
    'The switch node is a square wave from V_in to 0; the LC filter keeps its average, V_out = D·V_in.',
    'Volt-second balance on the inductor gives the conversion ratio of every converter.',
    'Ripple current ΔI_L = (V_in − V_out)V_out/(V_in f L); aim for 20–40 % of the load current.',
    'The input capacitor carries pulsed current; the output capacitor\'s ESR often sets the ripple.',
    'Below half the ripple current the converter enters discontinuous mode, unless it is synchronous.'
  ],
  pitfalls: [
    'A buck draws the same current from its input as it delivers — Power is conserved, not current: the input current is about D times the output current.',
    'The output ripple depends only on the capacitance — With electrolytics the ESR term ΔI·R usually dominates.',
    'The layout does not matter if the schematic is right — The fast pulsed loop through the input capacitor, switch and diode must be tiny, or the converter rings, radiates and misbehaves.'
  ],
  derivation: {
    title: 'Derive the conversion ratio, the ripple current and the output ripple',
    steps: [
      { text: 'During the on-time $DT$ the inductor sees $V_\\text{in} - V_\\text{out}$, so its current rises by', tex: '\\Delta I_{\\text{on}} = \\frac{(V_{\\text{in}} - V_{\\text{out}})\\,D\\,T}{L}' },
      { text: 'During the off-time $(1 - D)T$ it sees $-V_\\text{out}$ (neglecting the diode drop), so its current falls by', tex: '\\Delta I_{\\text{off}} = \\frac{V_{\\text{out}}\\,(1 - D)\\,T}{L}' },
      { text: 'In steady state the rise equals the fall:', tex: '(V_{\\text{in}} - V_{\\text{out}})\\,D = V_{\\text{out}}\\,(1 - D) \\;\\Rightarrow\\; V_{\\text{out}} = D\\,V_{\\text{in}}' },
      { text: 'Put $D = V_\\text{out}/V_\\text{in}$ and $T = 1/f$ into the rise:', tex: '\\Delta I_L = \\frac{(V_{\\text{in}} - V_{\\text{out}})\\,V_{\\text{out}}}{V_{\\text{in}}\\,f\\,L}' },
      { text: 'The load takes the average current and the capacitor the triangular ripple. For half a period the ripple is positive, charging the capacitor by a triangle of base $T/2$ and height $\\Delta I_L/2$:', tex: '\\Delta V = \\frac{\\Delta Q}{C} = \\frac{1}{C}\\cdot\\frac{1}{2}\\cdot\\frac{T}{2}\\cdot\\frac{\\Delta I_L}{2} = \\frac{\\Delta I_L}{8 f C}' }
    ]
  },
  formulas: [
    {
      name: 'Output of a buck converter (continuous mode)',
      expr: 'Vout = D*Vin', tex: 'V_{\\text{out}} = D\\,V_{\\text{in}}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 42, min: 0, max: 100 },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' }
      },
      stories: { D: 'What duty cycle does a buck converter need to make {Vout} from {Vin}?' }
    },
    {
      name: 'Inductor ripple current',
      expr: 'dI = (Vin - Vout)*Vout/(Vin*f*L)', tex: '\\Delta I_L = \\frac{(V_{\\text{in}} - V_{\\text{out}})\\,V_{\\text{out}}}{V_{\\text{in}}\\,f\\,L}',
      vars: {
        dI: { name: 'peak-to-peak inductor ripple', q: 'current', unit: 'A', tex: '\\Delta I_L' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{out}}' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 100 },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 47 }
      },
      practice: { unknowns: ['dI', 'L', 'f'] },
      stories: {
        dI: 'A buck converter makes {Vout} from {Vin} at {f} with a {L} inductor. What is the ripple current?',
        L: 'A {f} buck converter from {Vin} to {Vout} should have {dI} of ripple. What inductance?'
      }
    },
    {
      name: 'Output voltage ripple',
      expr: 'dV = dI/(8*f*C) + dI*ESR', tex: '\\Delta V = \\frac{\\Delta I_L}{8 f C} + \\Delta I_L\\,R_{\\text{ESR}}',
      vars: {
        dV: { name: 'output ripple (peak to peak)', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        dI: { name: 'inductor ripple current', q: 'current', unit: 'A', value: 0.62, tex: '\\Delta I_L' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 100 },
        C: { name: 'output capacitance', q: 'capacitance', unit: 'µF', value: 47 },
        ESR: { name: 'equivalent series resistance', q: 'resistance', unit: 'mΩ', value: 20, tex: 'R_{\\text{ESR}}' }
      },
      note: 'A conservative sum: the two ripples peak a quarter-period apart, so the true peak-to-peak is somewhat less.',
      practice: { unknowns: ['dV', 'C', 'ESR'] }
    },
    {
      name: 'RMS current in the input capacitor',
      expr: 'Icin = Iout*sqrt(D*(1 - D))', tex: 'I_{C,\\text{in}} = I_{\\text{out}}\\sqrt{D(1 - D)}',
      vars: {
        Icin: { name: 'RMS ripple current in the input capacitor', q: 'current', unit: 'A', tex: 'I_{C,\\text{in}}' },
        Iout: { name: 'output current', q: 'current', unit: 'A', value: 2, tex: 'I_{\\text{out}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 41.7, min: 0, max: 100 }
      },
      note: 'Largest, I_out/2, at 50 % duty. Neglects the inductor ripple.',
      practice: { unknowns: ['Icin'] }
    }
  ],
  examples: [
    {
      title: 'A 12 V to 5 V, 2 A buck at 100 kHz',
      q: 'Find the duty cycle, the inductor ripple and peak current with 47 µH, the output ripple with 47 µF of 20 mΩ ESR, and the input capacitor\'s RMS current.',
      steps: [
        'Duty cycle: $D = 5/12 = 0.417$.',
        {text: 'Ripple:', tex: '\\Delta I_L = \\frac{(12 - 5) \\times 5}{12 \\times 10^5 \\times 47\\times10^{-6}} = 0.62\\ \\mathrm{A}'},
        'That is 31 % of 2 A — in the usual range. Peak current $2 + 0.31 = 2.31$ A, so choose an inductor with a saturation current of at least about 3 A.',
        'Output ripple: $0.62/(8 \\times 10^5 \\times 47\\times10^{-6}) = 16.5$ mV from the capacitance, plus $0.62 \\times 0.020 = 12.4$ mV from the ESR — under 29 mV.',
        'Input capacitor: $2\\sqrt{0.417 \\times 0.583} = 0.99$ A RMS — a job for a couple of 10 µF ceramics next to the switch.'
      ],
      a: 'D = 42 %, ΔI = 0.62 A (peak 2.3 A), ripple under 29 mV, input capacitor 1 A RMS.'
    },
    {
      title: 'When does it go discontinuous?',
      q: 'For the same converter with a diode, below what load current does it enter discontinuous mode?',
      steps: [
        'The inductor current just touches zero when the load current equals half the ripple: $0.62/2 = 0.31$ A.',
        'Below 0.31 A (a load above about 16 Ω at 5 V) the current stops for part of each period and, without feedback, the output would rise above 5 V.',
        'A synchronous version never goes discontinuous: its inductor current dips below zero instead, circulating energy back to the input.'
      ],
      a: 'Below about 0.31 A of load.'
    }
  ],
  quiz: [
    { q: 'What duty cycle makes 3.3 V from 12 V in an ideal buck converter?', choices: ['27.5 %', '36 %', '72.5 %', '3.6 %'], a: 0,
      why: 'D = V_out/V_in = 3.3/12 = 0.275.' },
    { q: 'You double the switching frequency, keeping everything else. The inductor ripple current…', choices: ['doubles', 'halves', 'stays the same', 'falls by √2'], a: 1,
      why: 'ΔI_L ∝ 1/(fL): the same volt-seconds are applied for half as long.' },
    { q: 'An ideal buck converter makes 12 V at 3 A from 24 V. What average current does it draw from the input?', choices: ['3 A', '6 A', '1.5 A', '0.75 A'], a: 2,
      why: 'Power in = power out: 36 W / 24 V = 1.5 A.' },
    { q: 'At very light load and with no feedback, a buck converter with a diode delivers more than D·V_in.', a: true,
      why: 'In discontinuous mode the inductor current stops for part of each period and the switch node then sits at V_out, not at 0 V, raising the average.' },
    { q: 'A buck converter makes 3.3 V from 12 V at 500 kHz with a 4.7 µH inductor. What is the ripple current?', answer: 1.02, unit: 'A',
      why: '(12 − 3.3) × 3.3 / (12 × 500 000 × 4.7 × 10⁻⁶) = 28.7/28.2 = 1.02 A.' }
  ],
  applications: ['Point-of-load regulators on every motherboard, phone and FPGA board.', '12 V and 24 V to 5 V or 3.3 V modules on machines and vehicles.', 'Battery chargers — a buck converter regulating current.', 'LED drivers regulating current instead of voltage.'],
  sim: { id: 'cp-converter', params: { topo: 'buck' } }
},

{
  id: 'boost-converter', parent: 'switching-converters', title: 'The boost converter', level: 2,
  short: 'Rearrange the same four parts and the inductor\'s kick adds to the input: a boost converter makes a higher voltage, V_out = V_in/(1 − D), at the cost of pulsed output current and no protection against a short circuit.',
  keywords: ['boost converter', 'step-up converter', 'duty cycle', '1/(1-D)', 'inductor current', 'output ripple', 'power bank', 'LED driver', 'inrush', 'right-half-plane zero', 'load disconnect', 'PFC'],
  prereq: ['buck-converter', 'inductors', 'flyback-diode'],
  related: ['buck-boost', 'converter-losses', 'batteries', 'leds', 'pwm'],
  body: `
The boost converter uses the same parts as the buck — a switch, a diode, an inductor and a capacitor — in a different order. The inductor runs from the input to the switch node; the switch connects that node to ground; the diode leads from the node to the output capacitor.

- **Switch on**: the inductor sits across the input and its current ramps up at $V_\\text{in}/L$, storing energy. The diode is reverse-biased and the output capacitor alone feeds the load.
- **Switch off**: the inductor's current must keep flowing ([[inductors|v = L di/dt]]), so the switch node flies up until the diode conducts. The inductor's voltage now **adds** to the input, pushing current into the output while its current ramps down.

Balancing the inductor's volt-seconds, $V_\\text{in}\\,D = (V_\\text{out} - V_\\text{in})(1 - D)$, gives

$$V_\\text{out} = \\frac{V_\\text{in}}{1 - D}$$

50 % duty doubles the voltage; 75 % quadruples it. Power is conserved (ideally), so the input current exceeds the output current by the same factor, $I_\\text{in} = I_\\text{out}/(1 - D)$ — and all of it flows through the inductor, which must be rated for it.

### Ripple
The inductor ripple is $\\Delta I_L = V_\\text{in} D/(fL)$. The output side is the hard one: the diode delivers current only during the off-time, in pulses that start at the full inductor current, while the load draws steadily. The output capacitor supplies the load alone during the on-time, giving a ripple of about

$$\\Delta V \\approx \\frac{I_\\text{out}\\,D}{f\\,C}$$

plus the ESR times the peak current — so boost outputs need good, low-ESR capacitors. The input side is gentle, because the inductor makes the input current continuous.

### Limits and quirks
- **The real gain is limited.** Losses grow with the circulating current. With the inductor's resistance $R_L$ and a load $R$, the gain becomes $\\frac{1}{1-D}\\cdot\\frac{1}{1 + R_L/[R(1-D)^2]}$, which peaks and then *falls* as $D$ approaches 1. Practical boosts manage about 5–10 times; beyond that, transformer-based converters take over.
- **No short-circuit protection.** There is always a DC path from the input through the inductor and diode to the output. At power-up the output capacitor charges to about $V_\\text{in}$ with an uncontrolled inrush, and a short on the output draws whatever the input can deliver — the switch cannot stop it. Designs that must survive it add a load-disconnect switch or a fuse.
- **Light load.** Without feedback, a boost at light load keeps pumping in energy and its output climbs far above $V_\\text{in}/(1 - D)$ — dangerous for the output capacitor. Real controllers skip pulses.
- **Slower control.** Asking for more output first lengthens the on-time, during which less energy reaches the output, so the output dips before it rises (a "right-half-plane zero"). Boost feedback loops must therefore be slower than buck loops.

### Where you meet it
A single lithium cell (3.0–4.2 V) boosted to 5 V in every USB power bank; strings of LEDs in backlights and torches; and the power-factor-correction stage at the front of larger mains supplies, which boosts rectified mains to about 400 V DC while making the input current follow the mains sine wave.
`,
  ideas: [
    'Switch on: the inductor charges from the input; switch off: its voltage adds to the input and feeds the output.',
    'V_out = V_in/(1 − D), and the input current is I_out/(1 − D).',
    'The output current arrives in pulses through the diode, so the output capacitor sets the ripple.',
    'Losses limit the practical gain to about 5–10.',
    'A boost cannot protect itself against an output short: input and output are always joined through the inductor and diode.'
  ],
  pitfalls: [
    'Turning off the switch turns off the output — The input still reaches the output through the inductor and diode; the output sits near V_in.',
    'Any duty cycle close to 1 gives a huge gain — Resistance in the inductor and switches makes the real gain peak and then fall.',
    'The inductor carries the output current — It carries the input current, which is larger by 1/(1 − D).'
  ],
  derivation: {
    title: 'Derive the gain, ideal and with a lossy inductor',
    steps: [
      { text: 'Switch on, for $DT$: the inductor sees $V_\\text{in}$. Switch off, for $(1 - D)T$: it sees $V_\\text{in} - V_\\text{out}$. Its average voltage must be zero:', tex: 'V_{\\text{in}}\\,D + (V_{\\text{in}} - V_{\\text{out}})(1 - D) = 0 \\;\\Rightarrow\\; V_{\\text{out}} = \\frac{V_{\\text{in}}}{1 - D}' },
      { text: 'Now give the inductor a resistance $R_L$. The inductor carries the input current, and the output receives it only during the off-time:', tex: 'I_L = \\frac{I_{\\text{out}}}{1 - D} = \\frac{V_{\\text{out}}}{R\\,(1 - D)}' },
      { text: 'The average inductor voltage is still zero, now with the resistive drop included:', tex: 'V_{\\text{in}} - I_L R_L - (1 - D)\\,V_{\\text{out}} = 0' },
      { text: 'Substitute $I_L$ and solve for the gain:', tex: 'M = \\frac{V_{\\text{out}}}{V_{\\text{in}}} = \\frac{1}{1 - D}\\cdot\\frac{1}{1 + \\dfrac{R_L}{R(1 - D)^2}}' },
      { text: 'As $D \\to 1$ the second factor collapses faster than the first grows, so the gain peaks — at $1 - D = \\sqrt{R_L/R}$, where $M = \\tfrac12\\sqrt{R/R_L}$ — and then falls.' }
    ]
  },
  formulas: [
    {
      name: 'Output of a boost converter (continuous mode)',
      expr: 'Vout = Vin/(1 - D)', tex: 'V_{\\text{out}} = \\frac{V_{\\text{in}}}{1 - D}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 99 }
      },
      stories: { D: 'What duty cycle lets a boost converter make {Vout} from {Vin}?', Vout: 'A boost converter runs from {Vin} at a duty cycle of {D}. What is its output?' }
    },
    {
      name: 'Inductor ripple current',
      expr: 'dI = Vin*D/(f*L)', tex: '\\Delta I_L = \\frac{V_{\\text{in}}\\,D}{f L}',
      vars: {
        dI: { name: 'peak-to-peak ripple', q: 'current', unit: 'A', tex: '\\Delta I_L' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 3.7, tex: 'V_{\\text{in}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 26, min: 0, max: 100 },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 500 },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 4.7 }
      },
      practice: { unknowns: ['dI', 'L'] }
    },
    {
      name: 'Output ripple from the pulsed diode current',
      expr: 'dV = Iout*D/(f*C)', tex: '\\Delta V = \\frac{I_{\\text{out}}\\,D}{f C}',
      vars: {
        dV: { name: 'output ripple (capacitive part)', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        Iout: { name: 'output current', q: 'current', unit: 'A', value: 1, tex: 'I_{\\text{out}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 26, min: 0, max: 100 },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 500 },
        C: { name: 'output capacitance', q: 'capacitance', unit: 'µF', value: 22 }
      },
      note: 'Add the ESR times the peak inductor current for the step at each switch-off.',
      practice: { unknowns: ['dV', 'C'] }
    },
    {
      name: 'Real gain with inductor resistance',
      expr: 'M = 1/((1 - D)*(1 + RL/(R*(1 - D)^2)))', tex: 'M = \\frac{1}{1-D}\\cdot\\frac{1}{1 + \\frac{R_L}{R(1-D)^2}}',
      vars: {
        M: { name: 'voltage gain V_out/V_in', q: 'none' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 80, min: 0, max: 100 },
        RL: { name: 'resistance of the inductor (and switch)', q: 'resistance', unit: 'Ω', value: 0.1, tex: 'R_L' },
        R: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 10 }
      },
      note: 'Two duty cycles can give the same gain; the useful one is the smaller. The maximum gain is about $\\tfrac12\\sqrt{R/R_L}$.',
      practice: { unknowns: ['M'] }
    }
  ],
  examples: [
    {
      title: 'A power bank\'s 5 V output',
      q: 'A lithium cell at 3.7 V is boosted to 5 V at 1 A at 500 kHz with a 4.7 µH inductor and 22 µF of output capacitance. Find the duty cycle, the input current at 90 % efficiency, the inductor ripple and the output ripple.',
      steps: [
        'Duty cycle: $D = 1 - 3.7/5 = 0.26$.',
        'Input current: $5 \\times 1/(0.9 \\times 3.7) = 1.50$ A — all through the inductor.',
        'Ripple: $\\Delta I_L = 3.7 \\times 0.26/(5\\times10^5 \\times 4.7\\times10^{-6}) = 0.41$ A, so the peak is about 1.7 A.',
        'Output ripple: $1 \\times 0.26/(5\\times10^5 \\times 22\\times10^{-6}) = 24$ mV, plus the ESR step (10 mΩ × 1.7 A = 17 mV).',
        'Worst case is a nearly empty cell at 3.0 V: D = 0.4 and an input current near 1.85 A. Size the inductor\'s saturation current for that, with margin: about 2.5 A.'
      ],
      a: 'D = 26 %; 1.5 A in; ripple 0.41 A in the inductor and about 40 mV at the output.'
    },
    {
      title: 'How far can it boost?',
      q: 'A boost with 0.1 Ω of inductor and switch resistance drives a 10 Ω load. What is the largest gain it can reach?',
      steps: [
        'With $x = 1 - D$, the gain is $M = x/(x^2 + R_L/R) = x/(x^2 + 0.01)$.',
        'It is largest where $x^2 = 0.01$, i.e. $x = 0.1$ ($D = 0.9$): $M = 0.1/0.02 = 5$.',
        'The ideal formula promised 10 at that duty cycle. Past D = 0.9 the output actually falls, and the losses soar.'
      ],
      a: 'About 5 times, at 90 % duty.'
    }
  ],
  quiz: [
    { q: 'An ideal boost converter runs at 50 % duty. Its output is…', choices: ['half the input', 'equal to the input', 'twice the input', 'four times the input'], a: 2,
      why: 'V_out = V_in/(1 − 0.5) = 2 V_in.' },
    { q: 'The output of a running boost converter is short-circuited. What limits the current?', choices: ['the switch turns off', 'the controller\'s current limit', 'only the resistance of the input source, inductor and diode', 'the output capacitor'], a: 2,
      why: 'Input, inductor and diode form a permanent DC path to the output; opening the switch does not break it. A fuse or a load-disconnect switch is needed.' },
    { q: 'In a boost converter, the average inductor current is…', choices: ['the output current', 'the input current, larger than the output current', 'zero', 'D times the output current'], a: 1,
      why: 'The inductor is in series with the input: it carries I_in = I_out/(1 − D).' },
    { q: 'With no load and no feedback, a boost converter settles at V_in/(1 − D).', a: false,
      why: 'In discontinuous mode each cycle delivers a fixed parcel of energy that a light load cannot use; the output climbs well above V_in/(1 − D) and can destroy the capacitor.' },
    { q: 'What duty cycle does an ideal boost need to make 12 V from 5 V?', answer: 58.3, unit: '%',
      why: 'D = 1 − V_in/V_out = 1 − 5/12 = 0.583.' }
  ],
  applications: ['USB power banks and battery-to-5 V converters.', 'LED backlights and torches driving series strings of LEDs.', 'Power-factor-correction front ends of mains supplies.', 'Solar maximum-power-point trackers and energy harvesters.'],
  sim: { id: 'cp-converter', params: { topo: 'boost' } }
},

{
  id: 'buck-boost', parent: 'switching-converters', title: 'Buck–boost and inverting converters', level: 2,
  short: 'When the output must be negative, isolated, or sometimes above and sometimes below the input, the inductor is placed so that it only ever passes stored energy on: the inverting buck–boost, the SEPIC, the Ćuk — and, with a transformer, the flyback.',
  keywords: ['buck-boost', 'inverting converter', 'negative voltage', 'SEPIC', 'Cuk converter', 'four-switch buck-boost', 'flyback converter', 'isolation', 'D/(1-D)', 'switch stress', 'coupled inductor', 'phone charger'],
  prereq: ['buck-converter', 'boost-converter', 'transformers-practical'],
  related: ['converter-losses', 'batteries', 'optocouplers', 'single-supply'],
  body: `
A buck can only go down and a boost only up. When a battery's voltage sweeps across the output voltage — a lithium cell falling from 4.2 V to 3.0 V while a 3.3 V rail must stay put — or when the output must be negative or isolated, you need a converter that can do both.

### The inverting buck–boost
Put the switch between the input and a node, the inductor from that node to ground, and the diode, reversed, from the output to the node:
- **Switch on**: the inductor sits across the input and stores energy; the diode is off, and the output capacitor feeds the load.
- **Switch off**: the inductor's current keeps flowing, pulling the node *below* ground until the diode conducts, and the inductor empties its energy into the output capacitor — charging it **negative**.

The inductor never connects input to output directly: it takes energy in one phase and delivers it in the other. Volt-second balance, $V_\\text{in}\\,D = |V_\\text{out}|\\,(1 - D)$, gives

$$|V_\\text{out}| = V_\\text{in}\\,\\frac{D}{1 - D}$$

At 50 % duty the output equals the input (inverted); below it is smaller, above it larger. The price: both the input and the output currents are pulsed, so both capacitors work hard, and the switch and diode each see the sum $V_\\text{in} + |V_\\text{out}|$. A classic use is a −5 V or −12 V rail for op-amps from a single positive supply.

### Non-inverting versions
- The **four-switch buck–boost** has one inductor and four MOSFETs: it works as a buck when the input is high, as a boost when it is low, and as a mixture in between. It is what holds a phone's 3.3 V rail steady over the whole discharge of its cell.
- The **SEPIC** adds a second inductor (often coupled with the first) and a coupling capacitor: a positive output with the same ratio $D/(1 - D)$, continuous input current, and — unlike a boost — the coupling capacitor blocks DC, so the output falls to zero when switching stops.
- The **Ćuk** converter passes its energy through a capacitor, inverts, and has continuous current at both input and output.

### The flyback: a buck–boost with a transformer
Replace the inductor of the inverting buck–boost with two coupled windings — a transformer with an air gap that stores energy — and the output can be isolated and of either polarity:

$$V_\\text{out} = \\frac{V_\\text{in}}{N}\\,\\frac{D}{1 - D}, \\qquad N = \\frac{N_p}{N_s}$$

During the on-time the primary stores energy in the gap; during the off-time it all flies back out through the secondary. The **flyback** is the workhorse of isolated supplies up to about 100 W — nearly every phone charger and many appliance supplies. The turns ratio does the big step (from 325 V of rectified mains down to 5 V), the duty cycle does the regulation, and the feedback crosses the isolation barrier through an [[optocouplers|optocoupler]]. While the secondary conducts, the output voltage is reflected back into the primary, so the switch sees $V_\\text{in} + N\\,V_\\text{out}$, plus a spike from the transformer's leakage inductance that a snubber or clamp must absorb.

> [!warn] Mains-input flyback converters have 325 V or more on their primary side, stored in a capacitor that stays charged after unplugging. Treat them as mains equipment: build them only with suitable training, and use certified transformers and isolation distances.
`,
  ideas: [
    'In a buck–boost the inductor stores energy from the input, then releases it to the output: the two are never joined directly.',
    '|V_out| = V_in·D/(1 − D): equal at 50 % duty, smaller below, larger above.',
    'The simple buck–boost inverts; SEPIC, Ćuk and four-switch designs give other combinations.',
    'The flyback is a buck–boost with a gapped transformer: isolation and any ratio, the heart of most chargers.',
    'Switches see the input plus the (reflected) output voltage, plus leakage spikes.'
  ],
  pitfalls: [
    'A buck–boost gives a positive output — The basic single-switch version inverts; a positive output needs a SEPIC, a four-switch design or a flyback.',
    'The switch only has to withstand the input voltage — It sees V_in + |V_out| (or V_in + N·V_out in a flyback), plus ringing.',
    'A flyback transformer is an ordinary transformer — It is really a pair of coupled inductors that store energy in an air gap; it must not saturate at the peak primary current.'
  ],
  formulas: [
    {
      name: 'Output of an inverting buck–boost',
      expr: 'Vout = Vin*D/(1 - D)', tex: '|V_{\\text{out}}| = V_{\\text{in}}\\,\\frac{D}{1 - D}',
      vars: {
        Vout: { name: 'output voltage magnitude (the output is negative)', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 40, min: 0, max: 99 }
      },
      note: 'The SEPIC and the four-switch buck–boost follow the same ratio with a positive output.',
      stories: { D: 'What duty cycle makes −{Vout} from +{Vin} in an inverting buck–boost?' }
    },
    {
      name: 'Output of a flyback converter',
      expr: 'Vout = Vin*D/((1 - D)*N)', tex: 'V_{\\text{out}} = \\frac{V_{\\text{in}}}{N}\\,\\frac{D}{1 - D}',
      vars: {
        Vout: { name: 'output voltage (including the rectifier drop)', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 325, tex: 'V_{\\text{in}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 39, min: 0, max: 99 },
        N: { name: 'turns ratio N_p/N_s', q: 'none', value: 38 }
      },
      note: 'Continuous mode. Many small flybacks run discontinuously, where the output depends on the load and feedback sets D.',
      practice: { unknowns: ['Vout', 'D', 'N'] }
    },
    {
      name: 'Voltage stress on the switch',
      expr: 'Vsw = Vin + N*Vout', tex: 'V_{\\text{sw}} = V_{\\text{in}} + N\\,V_{\\text{out}}',
      vars: {
        Vsw: { name: 'switch voltage while off (before any spike)', q: 'voltage', unit: 'V', tex: 'V_{\\text{sw}}' },
        Vin: { name: 'highest input voltage', q: 'voltage', unit: 'V', value: 358, tex: 'V_{\\text{in}}' },
        N: { name: 'turns ratio N_p/N_s (1 for a plain buck–boost)', q: 'none', value: 38 },
        Vout: { name: 'output voltage magnitude (with the rectifier drop)', q: 'voltage', unit: 'V', value: 5.4, tex: 'V_{\\text{out}}' }
      },
      note: 'Leakage inductance adds a spike on top; the MOSFET is typically rated 1.3–1.5 times this value, or a clamp limits the spike.',
      practice: { unknowns: ['Vsw'] }
    }
  ],
  examples: [
    {
      title: 'A −12 V rail from +5 V',
      q: 'An inverting buck–boost makes −12 V at 100 mA from +5 V. Find the duty cycle, the switch voltage, and the average inductor current.',
      steps: [
        'Duty cycle: $D/(1 - D) = 12/5$, so $D = 12/17 = 0.71$.',
        'Switch and diode voltage: $5 + 12 = 17$ V; choose parts rated about 30 V.',
        'The inductor delivers current to the output only during the off-time, so its average is $I_\\text{out}/(1 - D) = 0.1/0.29 = 0.34$ A.',
        'Input power (ideal) $12 \\times 0.1 = 1.2$ W, so the input averages $1.2/5 = 0.24$ A, in pulses.'
      ],
      a: 'D ≈ 71 %; 17 V on the switch; 0.34 A average in the inductor.'
    },
    {
      title: 'The numbers inside a phone charger',
      q: 'A flyback runs from rectified 230 V mains (valleys near 250 V at low mains, peaks of 358 V at high mains) to 5 V; with the diode, the secondary must deliver 5.4 V. The duty cycle should not exceed 45 %. Choose the turns ratio and find the switch voltage.',
      steps: [
        'At the lowest input and the largest duty: $N = V_\\text{in} D/[(1 - D) V_\\text{out}] = 250 \\times 0.45/(0.55 \\times 5.4) = 37.9$ → 38 : 1.',
        'At nominal 325 V the duty cycle drops to about 39 %.',
        'Switch voltage at high mains: $358 + 38 \\times 5.4 = 563$ V, before the leakage spike.',
        'Hence the 650–800 V MOSFETs found in chargers, with a clamp or snubber across the primary.'
      ],
      a: 'About 38 : 1; the switch sees about 560 V plus the leakage spike.'
    }
  ],
  quiz: [
    { q: 'An inverting buck–boost runs at 50 % duty from 9 V. Its output is…', choices: ['+9 V', '−9 V', '−4.5 V', '−18 V'], a: 1,
      why: '|V_out| = V_in·D/(1 − D) = 9 × 1 = 9 V, and the output is negative.' },
    { q: 'Which converter is found in almost every phone charger?', choices: ['a buck', 'a boost', 'a flyback', 'a Ćuk'], a: 2,
      why: 'It must step 325 V down to 5 V and provide isolation; the flyback does both with few parts.' },
    { q: 'Unlike a boost converter, a SEPIC\'s output drops to zero when switching stops.', a: true,
      why: 'Its coupling capacitor blocks the DC path from input to output that a boost always has.' },
    { q: 'An inverting buck–boost converts +12 V at a duty cycle of 60 %. What is the magnitude of its output?', answer: 18, unit: 'V',
      why: '12 × 0.6/0.4 = 18 V, negative.' },
    { q: 'Why does a flyback\'s MOSFET need a rating far above the input voltage?', choices: ['The input can surge', 'The reflected output voltage N·V_out adds to the input while the secondary conducts, plus a leakage spike', 'The gate needs it', 'Mains is AC'], a: 1,
      why: 'During the off-time the drain sits at V_in + N·V_out, and the leakage inductance adds a spike on top.' }
  ],
  applications: ['Negative rails (−5 V, −12 V) for op-amps and display bias.', 'Phone chargers and appliance supplies (flyback).', 'Battery devices whose cell voltage crosses the output voltage (four-switch buck–boost, SEPIC).', 'Automotive supplies that must survive both cold-crank dips and load-dump surges.'],
  sim: { id: 'cp-converter', params: { topo: 'inv' } }
},

{
  id: 'converter-losses', parent: 'switching-converters', title: 'Losses and efficiency in converters', level: 3,
  short: 'Where the missing 5–15 % of a switching converter goes: conduction losses in the switches, diode and inductor, switching losses at every edge, gate drive, core loss and the controller itself — and how each depends on load and frequency.',
  keywords: ['efficiency', 'conduction loss', 'switching loss', 'RDS(on)', 'gate charge', 'diode loss', 'synchronous rectification', 'core loss', 'light-load efficiency', 'PFM', 'burst mode', 'dead time', 'reverse recovery', 'thermal design'],
  prereq: ['buck-converter', 'mosfet-switch', 'gate-drive', 'rms-values'],
  related: ['boost-converter', 'heat-sinks', 'diode-types', 'inductors', 'capacitors'],
  body: `
An ideal switching converter wastes nothing: its switches are either fully on or fully off, and its inductors and capacitors store energy without loss. A real one loses 5–15 % of the power, and much of converter design is an accounting of where. Efficiency is

$$\\eta = \\frac{P_\\text{out}}{P_\\text{out} + P_\\text{loss}}$$

and the losses fall into a few families.

### Conduction losses: proportional to I²
While a MOSFET conducts it is a resistor, $R_{DS(on)}$, losing $I_\\text{rms}^2 R_{DS(on)}$. In a buck with modest ripple the high-side switch carries the load current for a fraction $D$ of the time, so $P = D\\,I^2 R_{DS(on)}$; a synchronous low-side switch takes $(1 - D)\\,I^2 R_{DS(on)}$. The inductor winding adds $I_\\text{rms}^2\\,\\text{DCR}$, the capacitors their ESR losses. $R_{DS(on)}$ rises by 50–80 % between 25 °C and a hot junction, so use the hot value.

The **freewheeling diode** is often the largest single loss at low output voltages. It conducts for the off-time with a forward voltage that barely depends on current:

$$P_D = (1 - D)\\,I\\,V_f$$

At a 3.3 V output, a Schottky's 0.4 V is 12 % of the output voltage, lost for most of every period. Replacing the diode with a MOSFET — **synchronous rectification** — turns that into a much smaller $I^2R$ loss, which is why nearly all low-voltage converters are synchronous. The two switches must never conduct together, so a short **dead time** separates them, during which the low-side MOSFET's body diode carries the current: a small diode loss at every edge.

### Switching losses: proportional to frequency
During each transition the switch passes through states with both voltage across it and current through it. With rise and fall times $t_r$ and $t_f$, the energy per cycle is roughly $\\tfrac12 V I (t_r + t_f)$, so

$$P_\\text{sw} \\approx \\tfrac{1}{2}\\,V_\\text{in}\\,I\\,(t_r + t_f)\\,f$$

To this add the energy stored in the MOSFET's output capacitance, $\\tfrac12 C_{oss} V^2 f$, dumped at each turn-on, and the reverse-recovery charge of any silicon rectifier diode (a Schottky has almost none). Faster edges cut switching loss but increase ringing and electromagnetic interference, so edge speed is itself a compromise.

### Gate drive and the controller
Charging and discharging the gate costs $P_g = Q_g V_g f$, with $Q_g$ the total gate charge ([[gate-drive]]); it is paid by the driver, but it comes from the input all the same. The controller's own quiescent current adds a fixed loss.

### Magnetic losses
The inductor's core loses energy to hysteresis and eddy currents every cycle. Core loss rises with frequency and steeply with the flux swing (roughly as $f^{\\alpha} B^{\\beta}$, with $\\alpha$ about 1–1.5 and $\\beta$ about 2–3 for ferrites), so a large ripple current is expensive. At high frequency the windings suffer skin and proximity effects: their AC resistance exceeds the DC value.

### How efficiency varies
- **Heavy load**: the $I^2R$ terms dominate and efficiency falls.
- **Light load**: fixed losses — gate drive, output-capacitance switching, the controller — dominate and efficiency collapses. Converters for battery devices change to **pulse-frequency modulation** or **burst mode** at light load, switching only as often as needed.
- **Frequency**: higher frequency shrinks the inductor and capacitors but raises every frequency-proportional loss. Integrated converters in phones run at 1–4 MHz with tiny, fast switches; converters of hundreds of watts at 50–500 kHz.

Efficiency peaks roughly where the load-dependent and the fixed losses are equal. And every lost watt becomes heat in small parts: a converter that is 95 % efficient at 50 W still dissipates 2.6 W, and its hottest part sets the design ([[heat-sinks]]).
`,
  ideas: [
    'Conduction losses grow as I²: MOSFET on-resistance, inductor DCR and capacitor ESR.',
    'The diode\'s loss, (1 − D)·I·V_f, dominates at low output voltage; synchronous rectification removes most of it.',
    'Switching and gate-drive losses grow in proportion to frequency.',
    'At light load the fixed losses dominate, so converters skip pulses or burst.',
    'Efficiency peaks where load-dependent and fixed losses are about equal.'
  ],
  pitfalls: [
    'Higher switching frequency is always better — It shrinks the magnetics but raises switching, gate and core losses; there is an optimum.',
    'A converter\'s efficiency is one number — It varies strongly with load (and with input voltage); read the curve at your operating point, especially at light load.',
    'Use the 25 °C on-resistance in loss calculations — A hot MOSFET has 50–80 % more; calculate at the temperature it will actually reach.'
  ],
  formulas: [
    {
      name: 'Efficiency',
      expr: 'eta = Pout/(Pout + Ploss)', tex: '\\eta = \\frac{P_{\\text{out}}}{P_{\\text{out}} + P_{\\text{loss}}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Pout: { name: 'output power', q: 'power', unit: 'W', value: 15, tex: 'P_{\\text{out}}' },
        Ploss: { name: 'total losses', q: 'power', unit: 'W', value: 1.2, tex: 'P_{\\text{loss}}' }
      },
      stories: { Ploss: 'A converter delivers {Pout} at an efficiency of {eta}. How much heat does it make?' }
    },
    {
      name: 'Conduction loss in the high-side switch (buck)',
      expr: 'P = D*I^2*R', tex: 'P = D\\,I^2 R_{DS(on)}',
      vars: {
        P: { name: 'conduction loss', q: 'power', unit: 'W' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 41.7, min: 0, max: 100 },
        I: { name: 'load current', q: 'current', unit: 'A', value: 3 },
        R: { name: 'on-resistance (hot)', q: 'resistance', unit: 'mΩ', value: 20, tex: 'R_{DS(on)}' }
      },
      note: 'Neglects the ripple, which adds ΔI²/12 to I² inside the RMS.',
      practice: { unknowns: ['P', 'R'] }
    },
    {
      name: 'Freewheeling diode loss (buck)',
      expr: 'Pd = (1 - D)*I*Vf', tex: 'P_D = (1 - D)\\,I\\,V_f',
      vars: {
        Pd: { name: 'diode loss', q: 'power', unit: 'W', tex: 'P_D' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 41.7, min: 0, max: 100 },
        I: { name: 'load current', q: 'current', unit: 'A', value: 3 },
        Vf: { name: 'forward voltage of the diode', q: 'voltage', unit: 'V', value: 0.45, tex: 'V_f' }
      },
      practice: { unknowns: ['Pd'] }
    },
    {
      name: 'Switching loss',
      expr: 'Psw = 0.5*V*I*(tr + tf)*f', tex: 'P_{\\text{sw}} = \\tfrac{1}{2}\\,V I\\,(t_r + t_f)\\,f',
      vars: {
        Psw: { name: 'switching loss', q: 'power', unit: 'W', tex: 'P_{\\text{sw}}' },
        V: { name: 'voltage switched (input)', q: 'voltage', unit: 'V', value: 12 },
        I: { name: 'current switched', q: 'current', unit: 'A', value: 3 },
        tr: { name: 'rise time', q: 'time', unit: 'ns', value: 10, tex: 't_r' },
        tf: { name: 'fall time', q: 'time', unit: 'ns', value: 10, tex: 't_f' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 500 }
      },
      note: 'A first estimate for hard switching; output-capacitance and diode-recovery losses come on top.',
      practice: { unknowns: ['Psw', 'f'] }
    },
    {
      name: 'Gate-drive power',
      expr: 'Pg = Qg*Vg*f', tex: 'P_g = Q_g\\,V_g\\,f',
      vars: {
        Pg: { name: 'gate-drive power', q: 'power', unit: 'mW', tex: 'P_g' },
        Qg: { name: 'total gate charge', q: 'charge', unit: 'nC', value: 10, tex: 'Q_g' },
        Vg: { name: 'gate drive voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_g' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 500 }
      },
      practice: { unknowns: ['Pg'] }
    }
  ],
  examples: [
    {
      title: 'A loss budget: diode or synchronous?',
      q: 'A buck converts 12 V to 5 V at 3 A and 500 kHz. The switch has 20 mΩ (hot) and 10 ns rise and fall times, 10 nC of gate charge at 5 V; the inductor\'s DCR is 15 mΩ. Compare a 0.45 V Schottky diode with a synchronous 20 mΩ MOSFET.',
      steps: [
        'Duty cycle $D = 5/12 = 0.417$; output 15 W.',
        'High-side conduction: $0.417 \\times 9 \\times 0.020 = 0.075$ W. Switching: $\\tfrac12 \\times 12 \\times 3 \\times 20\\ \\mathrm{ns} \\times 500\\ \\mathrm{kHz} = 0.18$ W. Gate: $10\\ \\mathrm{nC} \\times 5 \\times 500\\ \\mathrm{kHz} = 0.025$ W. Inductor: $9 \\times 0.015 = 0.135$ W.',
        'Schottky: $(1 - 0.417) \\times 3 \\times 0.45 = 0.79$ W. Total ≈ 1.2 W, so $\\eta = 15/16.2 = 92.6$ %.',
        'Synchronous: $0.583 \\times 9 \\times 0.020 = 0.105$ W, plus another 0.025 W of gate drive and about 0.05 W of body-diode conduction in two 20 ns dead times. Total ≈ 0.6 W, so $\\eta \\approx 96$ %.',
        'The diode alone was two-thirds of the loss; synchronous rectification halves the heat.'
      ],
      a: 'About 92.6 % with the diode and 96 % synchronous.'
    },
    {
      title: 'Why efficiency collapses at light load',
      q: 'The synchronous converter above draws about 50 mW for its two gates, 11 mW to charge 300 pF of switch-node capacitance at 12 V, and 12 mW for its controller. Estimate its efficiency at 0.5 W and at 50 mW of output, ignoring the small conduction losses.',
      steps: [
        'Fixed losses: $50 + 11 + 12 \\approx 73$ mW, whatever the load.',
        'At 0.5 W out: $0.5/0.573 = 87$ %.',
        'At 50 mW out: $0.05/0.123 = 41$ %.',
        'In pulse-skipping mode the converter switches only a few times per millisecond, cutting the fixed losses in proportion — which is how phones keep standby efficiency high.'
      ],
      a: 'About 87 % at 0.5 W, but about 41 % at 50 mW unless it skips pulses.'
    }
  ],
  quiz: [
    { q: 'A buck converter makes 1.2 V from 12 V with a Schottky diode. Which loss is likely the largest?', choices: ['high-side conduction', 'the diode', 'gate drive', 'capacitor ESR'], a: 1,
      why: 'At D = 10 % the diode conducts for 90 % of the time, and its 0.4 V is a third of the output voltage.' },
    { q: 'Doubling the switching frequency (everything else equal) roughly doubles…', choices: ['the conduction losses', 'the switching and gate-drive losses', 'the diode conduction loss', 'nothing'], a: 1,
      why: 'Energy is lost at every edge and every gate charge; twice the edges per second, twice the power.' },
    { q: 'Why is a converter\'s efficiency poor at very light load?', choices: ['The diode drop grows', 'Fixed losses — gate drive, switching of capacitances, the controller — do not shrink with the load', 'The inductor saturates', 'The duty cycle becomes zero'], a: 1,
      why: 'Those losses are paid at every cycle whatever the load, so they become a large fraction of a small output.' },
    { q: 'What is the gate-drive power for 20 nC of gate charge at 10 V and 300 kHz?', answer: 0.06, unit: 'W',
      why: 'Q·V·f = 20 × 10⁻⁹ × 10 × 300 000 = 60 mW.' },
    { q: 'A MOSFET\'s 25 °C on-resistance is the right value for loss calculations.', a: false,
      why: 'On-resistance rises 50–80 % at typical junction temperatures; use the hot value, and iterate if necessary.' }
  ],
  applications: ['Choosing MOSFETs, diodes and inductors for a converter design.', 'Battery-life estimates for portable devices across their load range.', 'Thermal design of power boards, chargers and motor drives.', 'Comparing frequencies and topologies before building anything.'],
  sim: 'cp-converter'
}

);
