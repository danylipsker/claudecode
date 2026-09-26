/* HYPER-ELECTRONICS · content/optoelectronics.js — diodes and light: LEDs and their
 * resistors, photodiodes and phototransistors, solar cells, optocouplers.
 * Simulations in sims/diodes.js. */
Hyper.add(

{
  id: 'leds', parent: 'optoelectronics', title: 'LEDs and the current-limiting resistor', level: 1,
  short: 'A light-emitting diode turns current into light whose colour is set by the semiconductor\'s band gap. Because its current rises exponentially with voltage, it must be driven through a resistor or a current source — never straight from a voltage.',
  keywords: ['LED', 'light-emitting diode', 'current-limiting resistor', 'series resistor', 'forward voltage', 'colour', 'wavelength', 'band gap', 'InGaN', 'AlGaInP', 'white LED', 'phosphor', 'infrared', 'constant current', 'PWM dimming', 'indicator'],
  prereq: ['pn-diode', 'resistance-ohms-law', 'physics:photon'],
  related: ['photodiodes', 'optocouplers', 'pwm', 'buck-converter', 'microcontrollers', 'bjt-switch', 'physics:color-vision'],
  body: `
In any forward-biased diode, electrons crossing the junction recombine with holes. In silicon the energy is released as heat; in **direct-gap** semiconductors such as gallium arsenide, aluminium gallium indium phosphide (AlGaInP) and indium gallium nitride (InGaN) it comes out as a **photon** whose energy is close to the band gap. That fixes the colour:

$$\\lambda = \\frac{hc}{E_g} \\qquad \\lambda\\,[\\mathrm{nm}] \\approx \\frac{1240}{E_g\\,[\\mathrm{eV}]}$$

and it also fixes, roughly, the **forward voltage**, since each electron must be given at least that much energy:

| Colour | Wavelength | Material | Typical $V_F$ at 20 mA |
|---|---|---|---|
| Infrared | 850–940 nm | GaAs, AlGaAs | 1.2–1.5 V |
| Red | 620–630 nm | AlGaInP | 1.8–2.1 V |
| Yellow, amber | 590 nm | AlGaInP | 2.0–2.2 V |
| Green | 520–530 nm | InGaN | 2.8–3.3 V |
| Blue | 460–470 nm | InGaN | 2.8–3.3 V |
| White | blue die + yellow phosphor | InGaN | 2.8–3.3 V |

### Why an LED needs a resistor
An LED is a diode: its current grows exponentially with voltage, and its forward voltage varies by ±0.1–0.2 V between parts and falls by about 2 mV/°C as it warms. Connect one straight across a voltage source and either nothing happens or a destructive current flows — and as the LED heats, its voltage falls and the current rises further. Instead, **set the current** and let the voltage be whatever it is. The simplest current setter is a series resistor:

$$R = \\frac{V_s - nV_F}{I}$$

for $n$ LEDs in series. The resistor drops the difference between supply and LED voltages; the more of the supply it drops, the less the current depends on the exact $V_F$. Round **up** to the next standard value, and check its power, $I^2R$.

### How much current?
- A classic 5 mm indicator LED is rated at **20 mA**, absolute maximum about 30 mA. Modern high-efficiency parts are clearly visible at **1–5 mA**, which saves power and avoids dazzling indicators.
- Brightness is roughly proportional to current at low currents; efficiency falls a little at high current and high temperature.
- The eye is most sensitive to green-yellow (about 555 nm), so a green LED looks brighter than a red or blue one at the same power.
- **Power LEDs** (350 mA, 700 mA, 1 A and more) turn a large share of their power into heat: they need a heat sink and a **constant-current driver** — usually a small switching regulator ([[buck-converter]]) rather than a resistor.

### Practical rules
- **Series, not parallel.** LEDs in parallel on one resistor share badly: the one with the lowest $V_F$ takes most of the current, warms, and takes even more. Give each string its own resistor.
- **Leave headroom.** With a 3.3 V logic pin and a 3.1 V blue LED, only 0.2 V is left for the resistor, so the current depends almost entirely on the particular LED and the pin's own drop. Drive such LEDs from a higher rail through a [[bjt-switch|transistor]], or choose red.
- **Reverse voltage** is typically limited to 5 V. On AC or where polarity might be reversed, put an ordinary diode in antiparallel.
- **Dimming** is best done with [[pwm]]: full current, switched faster than the eye can follow, with the duty cycle setting the average brightness.
`,
  ideas: [
    'An LED emits photons with energy close to its band gap: the material sets the colour and the forward voltage.',
    'λ (nm) ≈ 1240 / E_g (eV): red ≈ 2 V, blue and white ≈ 3 V, infrared ≈ 1.2–1.5 V.',
    'Always set the current, not the voltage: R = (V_s − nV_F)/I.',
    'Indicators need 1–20 mA; power LEDs need constant-current drivers and heat sinks.',
    'Never parallel LEDs on one resistor; leave enough voltage across the resistor for a stable current.'
  ],
  pitfalls: [
    'An LED with a 2 V rating can be connected to a 2 V supply — Its exponential curve and part-to-part spread make the current unpredictable and possibly destructive; always limit the current.',
    'One resistor can serve several LEDs in parallel — The LED with the lowest forward voltage hogs the current.',
    'A blue LED is fine on a 3.3 V pin with a small resistor — Too little voltage is left across the resistor for the current to be controlled.'
  ],
  formulas: [
    {
      name: 'Series resistor for an LED string',
      expr: 'R = (Vs - n*Vf)/I', tex: 'R = \\frac{V_s - n V_F}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω' },
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        n: { name: 'LEDs in series', value: 1, int: true, min: 1, max: 20 },
        Vf: { name: 'forward voltage of one LED', q: 'voltage', unit: 'V', value: 2.0, tex: 'V_F' },
        I: { name: 'LED current', q: 'current', unit: 'mA', value: 20 }
      },
      stories: { R: 'What resistor runs {n} LED(s) with a forward voltage of {Vf} each at {I} from {Vs}?', I: 'A {R} resistor feeds {n} LED(s) ({Vf} each) from {Vs}. What current flows?' },
      practice: { unknowns: ['R', 'I'] }
    },
    {
      name: 'Power in the resistor',
      expr: 'P = I^2*R', tex: 'P = I^2 R',
      vars: {
        P: { name: 'resistor power', q: 'power', unit: 'mW' },
        I: { name: 'LED current', q: 'current', unit: 'mA', value: 20 },
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', value: 510 }
      },
      note: 'Choose a resistor rated for at least twice this, or it will run hot.',
      stories: { P: 'An LED on a 12 V supply runs at {I} through {R}. How much power does the resistor dissipate?' }
    },
    {
      name: 'Wavelength of the light from the band gap',
      expr: 'lambda = h*c/Eg', tex: '\\lambda = \\frac{h c}{E_g}',
      vars: {
        lambda: { name: 'peak wavelength', q: 'length', unit: 'nm', tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' },
        Eg: { name: 'band gap (photon energy)', q: 'energy', unit: 'eV', value: 1.97, tex: 'E_g' }
      },
      stories: { lambda: 'An LED\'s photons carry {Eg}. What colour — what wavelength — is its light?', Eg: 'A green LED emits at {lambda}. What photon energy does that correspond to?' }
    }
  ],
  examples: [
    {
      title: 'A red indicator on 5 V',
      q: 'Run a red LED ($V_F$ ≈ 2.0 V) at about 10 mA from 5 V.',
      steps: [
        '$R = (5 - 2.0)/0.010 = 300\\ \\Omega$. The next E12 value up is 330 Ω.',
        'With 330 Ω: $I = 3.0/330 = 9.1\\ \\mathrm{mA}$ — plenty for an indicator.',
        'Resistor power: $0.0091^2 \\times 330 = 27\\ \\mathrm{mW}$; any resistor will do.'
      ],
      a: '330 Ω, giving about 9 mA.'
    },
    {
      title: 'Three white LEDs on 12 V',
      q: 'Three white LEDs ($V_F$ ≈ 3.2 V each) are wired in series on a 12 V supply for 20 mA. Choose the resistor, and see what happens if the LEDs are 3.0 V parts, or if the "12 V" is a car battery at 14.4 V.',
      steps: [
        'The string drops $3 \\times 3.2 = 9.6\\ \\mathrm{V}$, leaving 2.4 V: $R = 2.4/0.020 = 120\\ \\Omega$. 80 % of the power reaches the LEDs.',
        'With 3.0 V LEDs the resistor sees 3.0 V: $I = 3.0/120 = 25\\ \\mathrm{mA}$ (+25 %).',
        'On 14.4 V: $I = (14.4 - 9.6)/120 = 40\\ \\mathrm{mA}$ — double the design current and over the maximum.',
        'Little headroom means a sensitive current. In a car, use two LEDs per string (more headroom) or a constant-current driver.'
      ],
      a: '120 Ω for 20 mA — but only on a stable 12 V supply.'
    }
  ],
  quiz: [
    { q: 'Why must an LED not be connected straight across a 3 V battery, even if its forward voltage is "3 V"?', choices: ['It would light too dimly', 'Its current depends exponentially on voltage, so the current is uncontrolled and may destroy it', 'LEDs only work on AC', 'Batteries cannot supply LEDs'], a: 1,
      why: 'A small difference between the battery voltage and the LED\'s actual V_F means either almost no current or far too much. Only the battery\'s internal resistance limits it.' },
    { q: 'What resistor runs a red LED (2.0 V) at 15 mA from a 9 V battery?', answer: 467, unit: 'Ω',
      why: 'R = (9 − 2)/0.015 = 467 Ω; choose 470 Ω (E12).' },
    { q: 'Which LED has the highest forward voltage?', choices: ['infrared', 'red', 'yellow', 'blue'], a: 3,
      why: 'Blue photons carry the most energy (about 2.6 eV at 470 nm); the forward voltage must at least match it.' },
    { q: 'Two identical-looking LEDs in parallel on a single resistor share the current equally.', a: false,
      why: 'Their forward voltages differ by tens of millivolts; the lower one takes most of the current, warms up, and takes even more.' },
    { q: 'Gallium arsenide has a band gap of 1.42 eV. At about what wavelength does a GaAs LED emit?', answer: 873, unit: 'nm',
      why: 'λ = 1240/1.42 ≈ 873 nm, in the near infrared.' }
  ],
  applications: ['Indicators and displays.', 'Lighting: white LEDs driven by constant-current converters.', 'Infrared remote controls, proximity sensors and optocouplers.', 'Backlights, dimmed with PWM.'],
  history: 'Nick Holonyak made the first practical visible (red) LED in 1962. Bright blue LEDs, and with them white LEDs, followed in the early 1990s from Isamu Akasaki, Hiroshi Amano and Shuji Nakamura, who shared the 2014 Nobel Prize in Physics for the work.',
  sim: 'dio-led'
},

{
  id: 'photodiodes', parent: 'optoelectronics', title: 'Photodiodes and phototransistors', level: 2,
  short: 'Run a diode in reverse and shine light on it: every absorbed photon adds an electron to a current that is proportional to the light power, linear over many decades. A phototransistor adds gain, at the cost of speed.',
  keywords: ['photodiode', 'phototransistor', 'photocurrent', 'responsivity', 'quantum efficiency', 'dark current', 'photovoltaic mode', 'photoconductive mode', 'PIN photodiode', 'avalanche photodiode', 'APD', 'transimpedance amplifier', 'BPW34', 'light sensor'],
  prereq: ['pn-diode', 'physics:photoelectric-effect', 'physics:photon'],
  related: ['transimpedance', 'solar-cells', 'optocouplers', 'leds', 'noise-snr', 'sensor-interfacing'],
  body: `
A photon with more energy than the band gap can break a bond in the semiconductor, making an electron–hole pair. If that happens in or near the depletion region of a junction, the built-in field sweeps the two apart — electron to the n side, hole to the p side — and they flow round the external circuit as a **photocurrent**. It flows in the diode's *reverse* direction, and it is proportional to the number of photons absorbed: to the **optical power**, linearly, over six to nine decades.

### Responsivity
If a fraction $\\eta$ of the photons (the **quantum efficiency**) each yields one electron, the current per watt of light is

$$\\mathcal{R} = \\frac{I_p}{P} = \\frac{\\eta\\, e\\, \\lambda}{h c} \\approx \\frac{\\eta\\,\\lambda\\,[\\mathrm{nm}]}{1240}\\ \\mathrm{A/W}$$

Longer wavelengths give more amps per watt (each photon carries less energy, so there are more of them) — until the photon energy drops below the band gap and the material becomes transparent. **Silicon** responds from about 400 nm to 1100 nm, peaking near 850–950 nm at roughly 0.5–0.6 A/W. For 1300 and 1550 nm fibre links, **InGaAs** takes over.

### Two ways to operate it
A photodiode is a current source $I_p$ in parallel with an ordinary diode, a junction capacitance $C_j$ (tens of pF for a few mm²) and a large leakage resistance.
- **Photovoltaic (zero bias).** The diode feeds a virtual ground, usually a [[transimpedance|transimpedance amplifier]]: $V_{out} = I_p R_f$. With no bias there is no **dark current**, so this is the quietest and most linear mode — light meters, colour sensors, precision instruments.
- **Photoconductive (reverse bias).** A few volts of reverse bias widen the depletion region, cutting $C_j$ severalfold and speeding the diode up. The price is a **dark current** (nanoamps, doubling about every 10 °C) that adds to the signal and to its noise.

The simplest circuit — a load resistor $R$ from the reverse-biased diode — gives $V = I_p R$, with a bandwidth of about $1/(2\\pi R C_j)$: more gain means less speed. The transimpedance amplifier breaks that trade-off by holding the diode's voltage constant, so $C_j$ barely charges.

### Numbers to calibrate intuition
- Direct sunlight is about 1000 W/m². On a 7.5 mm² silicon diode (a BPW34-sized chip) that is 7.5 mW — a photocurrent of a few milliamps.
- Office lighting of 500 lux puts only microwatts on the same chip: microamps.
- A fibre receiver may see a microwatt: about half a microamp.

### PIN, avalanche and phototransistors
- **PIN photodiodes** put an undoped (intrinsic) layer between p and n: a wide depletion region, low capacitance, high speed and good red and infrared response.
- **Avalanche photodiodes** are biased near breakdown, so each photo-electron triggers an avalanche: internal gains of 10–100, for fibre receivers and laser rangefinders.
- A **phototransistor** is a bipolar transistor whose collector–base junction is the photodiode; the transistor multiplies the photocurrent by its gain (100–1000). It gives milliamps without an amplifier, but its large junction capacitance is multiplied too (the Miller effect), so it takes microseconds to tens of microseconds to respond, and its gain varies from part to part. It is the detector in slotted and reflective sensors, and in most [[optocouplers]].

> [!tip] Ambient light swamps weak signals. Infrared remote controls modulate their LED at 30–56 kHz, and the receiver module filters out everything else — a trick worth copying for any optical sensor that must work in daylight.
`,
  ideas: [
    'Absorbed photons make electron–hole pairs; the junction field separates them into a photocurrent proportional to light power.',
    'Responsivity = ηeλ/hc ≈ ηλ(nm)/1240 A/W: about 0.5–0.6 A/W for silicon near 900 nm.',
    'Zero bias into a transimpedance amplifier: lowest noise. Reverse bias: faster, but with dark current.',
    'With a plain load resistor, bandwidth ≈ 1/(2πRC_j): gain trades against speed.',
    'Phototransistors multiply the photocurrent by β but are slow and less predictable.'
  ],
  pitfalls: [
    'A photodiode produces a voltage proportional to light — Its current is proportional; the open-circuit voltage is logarithmic, which is how a solar cell behaves.',
    'Reverse bias makes a photodiode more sensitive — It makes it faster (less capacitance); the photocurrent per watt hardly changes, and dark current is added.',
    'A silicon photodiode detects any light — Photons beyond about 1100 nm carry less than the 1.12 eV band gap and pass straight through.'
  ],
  formulas: [
    {
      name: 'Responsivity',
      expr: 'Rsp = eta*qe*lambda/(h*c)', tex: '\\mathcal{R} = \\frac{\\eta\\, e\\, \\lambda}{h c}',
      vars: {
        Rsp: { name: 'responsivity', unit: 'A/W', tex: '\\mathcal{R}' },
        eta: { name: 'quantum efficiency', value: 0.8, min: 0, max: 1, tex: '\\eta' },
        qe: { const: 'qe' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 850, tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      stories: { Rsp: 'A photodiode has a quantum efficiency of {eta} at {lambda}. What is its responsivity?' }
    },
    {
      name: 'Photocurrent',
      expr: 'Ip = Rsp*P', tex: 'I_p = \\mathcal{R}\\, P',
      vars: {
        Ip: { name: 'photocurrent', q: 'current', unit: 'µA', tex: 'I_p' },
        Rsp: { name: 'responsivity', unit: 'A/W', value: 0.55, tex: '\\mathcal{R}' },
        P: { name: 'optical power on the diode', q: 'power', unit: 'µW', value: 20 }
      },
      stories: { Ip: 'A photodiode with a responsivity of {Rsp} receives {P}. What current does it produce?' }
    },
    {
      name: 'Transimpedance amplifier output',
      expr: 'Vout = Ip*Rf', tex: 'V_{out} = I_p\\, R_f',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{out}' },
        Ip: { name: 'photocurrent', q: 'current', unit: 'µA', value: 11, tex: 'I_p' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' }
      },
      stories: { Rf: 'A photocurrent of {Ip} should give {Vout} at the amplifier output. What feedback resistor is needed?' }
    },
    {
      name: 'Bandwidth with a load resistor',
      expr: 'f = 1/(2*pi*R*C)', tex: 'f_{-3\\,dB} = \\frac{1}{2\\pi R C_j}',
      vars: {
        f: { name: 'bandwidth (−3 dB)', q: 'frequency', unit: 'kHz', tex: 'f_{-3\\,dB}' },
        R: { name: 'load resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'junction capacitance', q: 'capacitance', unit: 'pF', value: 20, tex: 'C_j' }
      },
      stories: { f: 'A photodiode with {C} of capacitance works into {R}. What bandwidth can it reach?', R: 'What is the largest load resistor that keeps a {C} photodiode\'s bandwidth at {f}?' }
    }
  ],
  examples: [
    {
      title: 'An 850 nm optical link receiver',
      q: 'An infrared link delivers 20 µW at 850 nm to a silicon PIN photodiode (quantum efficiency 0.8, 20 pF at 10 V reverse bias). Find the photocurrent, the signal across a 100 kΩ load and the bandwidth, and suggest an improvement.',
      steps: [
        'Responsivity: $0.8 \\times 850/1240 = 0.55\\ \\mathrm{A/W}$; photocurrent $0.55 \\times 20\\ \\mu\\mathrm{W} = 11\\ \\mu\\mathrm{A}$.',
        'Across 100 kΩ: $11\\ \\mu\\mathrm{A} \\times 100\\ \\mathrm{k\\Omega} = 1.1\\ \\mathrm{V}$ — a healthy signal.',
        'But the bandwidth is only $1/(2\\pi \\times 100\\ \\mathrm{k\\Omega} \\times 20\\ \\mathrm{pF}) = 80\\ \\mathrm{kHz}$.',
        'A transimpedance amplifier with the same 100 kΩ holds the diode at a constant voltage, so its capacitance no longer limits the speed; bandwidths of MHz become possible, set by the op-amp and a small feedback capacitor.'
      ],
      a: '11 µA, 1.1 V across 100 kΩ, but only 80 kHz; use a transimpedance amplifier for speed.'
    },
    {
      title: 'Dark current against a faint signal',
      q: 'A photodiode leaks 2 nA at 25 °C with 5 V reverse bias. You want to measure 1 nW of 650 nm light ($\\mathcal{R}$ ≈ 0.4 A/W) inside equipment at 65 °C. What goes wrong, and what is the fix?',
      steps: [
        'The signal: $0.4 \\times 1\\ \\mathrm{nW} = 0.4\\ \\mathrm{nA}$.',
        'The dark current at 65 °C: four doublings, $2 \\times 2^4 = 32\\ \\mathrm{nA}$ — eighty times the signal, and drifting with temperature.',
        'Run the diode at zero bias (photovoltaic mode) into a transimpedance amplifier, so there is no bias to drive a dark current; and modulate the light and detect synchronously, so any remaining offset is rejected.'
      ],
      a: 'The 32 nA of dark current buries the 0.4 nA signal; use zero bias and modulated light.'
    }
  ],
  quiz: [
    { q: 'Through the photodiode itself, the photocurrent flows…', choices: ['from anode to cathode, like forward current', 'from cathode to anode — the reverse direction', 'in either direction depending on the colour', 'only when forward biased'], a: 1,
      why: 'The junction field sends electrons to the n side (cathode) and holes to the p side (anode): conventional current flows from cathode to anode inside the diode.' },
    { q: 'Reverse-biasing a photodiode makes it faster mainly because…', choices: ['more photons are absorbed', 'the wider depletion region has less capacitance', 'the dark current falls', 'the responsivity doubles'], a: 1,
      why: 'The depletion region acts as the capacitor\'s dielectric; widening it reduces C_j, and with it the RC time constant.' },
    { q: 'What is the responsivity of a photodiode with 70 % quantum efficiency at 650 nm?', answer: 0.367, unit: 'A/W',
      why: 'ℛ = ηλ(nm)/1240 = 0.7 × 650/1240 ≈ 0.37 A/W.' },
    { q: 'A silicon photodiode cannot detect 1550 nm light from a telecom fibre.', a: true,
      why: 'A 1550 nm photon carries 0.8 eV, less than silicon\'s 1.12 eV band gap, so it is not absorbed. InGaAs photodiodes are used instead.' },
    { q: 'Compared with a photodiode of the same area, a phototransistor is…', choices: ['more sensitive and faster', 'more sensitive but slower', 'less sensitive and slower', 'identical'], a: 1,
      why: 'It multiplies the photocurrent by the transistor\'s gain, but its junction capacitance is multiplied too, making it much slower.' }
  ],
  applications: ['Light meters, colour sensors and ambient-light sensors.', 'Optical-fibre and infrared data receivers.', 'Smoke detectors, pulse oximeters and barcode scanners.', 'Slotted and reflective position sensors, and optical encoders.']
},

{
  id: 'solar-cells', parent: 'optoelectronics', title: 'Solar cells', level: 2,
  short: 'A large photodiode used as a power source: light drives a current out through the load while the cell\'s own diode sets a voltage of about 0.6 V. The most power comes from one point on its curve, the maximum power point.',
  keywords: ['solar cell', 'photovoltaic', 'PV', 'solar panel', 'solar module', 'I-V curve', 'maximum power point', 'MPP', 'MPPT', 'fill factor', 'open-circuit voltage', 'short-circuit current', 'STC', 'bypass diode', 'hot spot', 'irradiance', 'temperature coefficient'],
  prereq: ['photodiodes', 'pn-diode', 'power-energy'],
  related: ['batteries', 'buck-converter', 'boost-converter', 'max-power-transfer', 'diode-types'],
  body: `
A solar cell is a photodiode with a very large area — a whole wafer — used the other way round: instead of an amplifier drawing its photocurrent into a virtual ground, a load lets the cell **push current out at a positive voltage**, delivering power.

### The cell as a circuit
Light generates a current $I_{ph}$ proportional to the irradiance. The cell's own junction is in parallel with it, and as the output voltage rises that diode starts to conduct and takes an ever larger share:

$$I = I_{ph} - I_0\\left(e^{V/(nV_T)} - 1\\right)$$

(plus the small losses of a series resistance and a shunt leakage). Two points anchor the curve:
- **Short circuit:** $V = 0$, so all of the photocurrent flows out: $I_{sc} \\approx I_{ph}$, proportional to the light. A 125 mm silicon cell gives about 6 A in full sun; a 156–182 mm cell 9–14 A.
- **Open circuit:** $I = 0$, so the diode takes it all:

$$V_{oc} = nV_T\\ln\\left(\\frac{I_{sc}}{I_0} + 1\\right)$$

about 0.6–0.7 V for silicon. It grows only with the **logarithm** of the light: at a fifth of full sun a cell loses only about 50 mV. That is why a panel on a dull day still reaches nearly its full voltage but little current.

### The maximum power point
Power is zero at both ends, so there is a best point in between — the **maximum power point** (MPP), at the knee of the curve, typically at $V_{mp} \\approx 0.8\\,V_{oc}$ and $I_{mp} \\approx 0.93\\,I_{sc}$. How square the curve is shows in the **fill factor**:

$$FF = \\frac{V_{mp} I_{mp}}{V_{oc} I_{sc}}$$

0.75–0.83 for good silicon cells. Panels are rated at **standard test conditions** (STC): 1000 W/m², a cell temperature of 25 °C, and a sunlight spectrum called AM1.5. Commercial silicon modules convert 20–23 % of the light.

### Heat hurts
At a constant current, a cell's voltage falls by about 2 mV/°C, like any diode. $V_{oc}$ drops by about **0.3 %/°C** and the maximum power by **0.35–0.45 %/°C**, while the current rises only 0.05 %/°C. In full sun cells run 20–30 °C above the air, so a summer panel may give 10–15 % below its rating — and a cold, bright winter day beats it.

### Modules, strings and shading
Cells are wired in series to reach a useful voltage: the classic **36-cell module** has $V_{oc}$ ≈ 22 V and $V_{mp}$ ≈ 17–18 V, enough to charge a 12 V battery even when hot. Series wiring has a weakness: the **current is set by the weakest cell**. A shaded cell cannot pass the string's current, so the others drive it into reverse bias, where it dissipates power as a **hot spot** that can crack or burn it. **Bypass diodes** — Schottky diodes in the junction box, one across every 12–24 cells — give the current a way round a shaded group. The group's power is lost, but the rest of the panel keeps working, and the power curve grows two or more peaks.

### Getting the power out
- A **resistor** operates wherever its line crosses the curve — usually not at the MPP, and further from it as the light changes.
- A **battery** connected directly (through a simple PWM charge controller and a blocking diode) pins the panel at the battery voltage, around 13–14 V, well below $V_{mp}$ — wasting 15–25 %.
- An **MPPT charge controller** is a DC–DC converter ([[buck-converter]]) that continually adjusts its input to sit at the maximum power point. It gains most in cold weather, and must search the whole curve when shading creates several peaks.
`,
  ideas: [
    'A solar cell is a large photodiode delivering power: I = I_ph − I₀(e^(V/nV_T) − 1).',
    'Short-circuit current is proportional to light; open-circuit voltage (~0.6–0.7 V) grows only logarithmically.',
    'Maximum power is at the knee: V_mp ≈ 0.8 V_oc; fill factor FF = V_mp·I_mp/(V_oc·I_sc).',
    'Heat lowers voltage and power by about 0.3–0.45 %/°C.',
    'In series strings the weakest cell limits the current; bypass diodes prevent hot spots; MPPT controllers find the best operating point.'
  ],
  pitfalls: [
    'A solar panel is a voltage source — It is closer to a current source up to the knee; the voltage collapses if you draw more than the short-circuit current.',
    'Panels produce most power on hot summer days — The irradiance helps, but every degree of cell temperature costs about 0.4 % of power; cold, bright days are the most efficient.',
    'Shading one cell costs one cell\'s worth of power — Without bypass diodes it can cut the whole string\'s current to that of the shaded cell, and heat it dangerously.'
  ],
  formulas: [
    {
      name: 'Open-circuit voltage',
      expr: 'Voc = n*VT*ln(Isc/I0 + 1)', tex: 'V_{oc} = n V_T \\ln\\left(\\frac{I_{sc}}{I_0} + 1\\right)',
      vars: {
        Voc: { name: 'open-circuit voltage (one cell)', q: 'voltage', unit: 'V', tex: 'V_{oc}' },
        n: { name: 'ideality factor', value: 1.25, min: 1, max: 2 },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.7, tex: 'V_T' },
        Isc: { name: 'short-circuit current', q: 'current', unit: 'A', value: 6.1, tex: 'I_{sc}' },
        I0: { name: 'dark saturation current', q: 'current', unit: 'nA', value: 30, tex: 'I_0' }
      },
      note: 'Multiply by the number of cells in series for a module. Solve for $I_{sc}$ to see how little the voltage changes with light.',
      stories: { Voc: 'A cell with $I_0$ = {I0} and $n$ = {n} gives {Isc} in short circuit. What is its open-circuit voltage?' }
    },
    {
      name: 'Fill factor',
      expr: 'FF = Vmp*Imp/(Voc*Isc)', tex: '\\mathrm{FF} = \\frac{V_{mp} I_{mp}}{V_{oc} I_{sc}}',
      vars: {
        FF: { name: 'fill factor', tex: '\\mathrm{FF}' },
        Vmp: { name: 'voltage at maximum power', q: 'voltage', unit: 'V', value: 17.3, tex: 'V_{mp}' },
        Imp: { name: 'current at maximum power', q: 'current', unit: 'A', value: 5.65, tex: 'I_{mp}' },
        Voc: { name: 'open-circuit voltage', q: 'voltage', unit: 'V', value: 22.1, tex: 'V_{oc}' },
        Isc: { name: 'short-circuit current', q: 'current', unit: 'A', value: 6.1, tex: 'I_{sc}' }
      },
      stories: { FF: 'A panel\'s datasheet gives {Vmp}, {Imp}, {Voc} and {Isc}. What is its fill factor?' }
    },
    {
      name: 'Efficiency',
      expr: 'eta = Pmax/(G*A)', tex: '\\eta = \\frac{P_{max}}{G A}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Pmax: { name: 'maximum power', q: 'power', unit: 'W', value: 98, tex: 'P_{max}' },
        G: { name: 'irradiance', q: 'intensity', unit: 'W/m²', value: 1000 },
        A: { name: 'module area', q: 'area', unit: 'm²', value: 0.65 }
      },
      stories: { eta: 'A {A} panel gives {Pmax} under {G}. How efficient is it?', A: 'How large must a panel of efficiency {eta} be to give {Pmax} under {G}?' }
    },
    {
      name: 'Power at another cell temperature',
      expr: 'P = P25*(1 + gam*(T - T0))', tex: 'P = P_{25}\\left(1 + \\gamma\\,(T - T_0)\\right)',
      vars: {
        P: { name: 'maximum power at T', q: 'power', unit: 'W' },
        P25: { name: 'rated maximum power (25 °C)', q: 'power', unit: 'W', value: 100, tex: 'P_{25}' },
        gam: { name: 'temperature coefficient of power', unit: '1/K', value: -0.004, signed: true, tex: '\\gamma' },
        T: { name: 'cell temperature', q: 'temperature', unit: '°C', value: 60 },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_0' }
      },
      note: 'About −0.004 per kelvin (−0.4 %/°C) for common silicon modules; better heterojunction cells reach −0.0026.',
      stories: { P: 'A {P25} panel ($\\gamma$ = {gam}) has cells at {T}. What maximum power can it give?' }
    }
  ],
  examples: [
    {
      title: 'Battery direct or MPPT?',
      q: 'A 36-cell panel has its MPP at 17.3 V, 5.65 A (98 W) under full sun. Connected directly to a 12 V battery it runs at 13.6 V and 6.05 A. How much does an MPPT controller of 95 % efficiency gain?',
      steps: [
        'Direct: $13.6 \\times 6.05 = 82\\ \\mathrm{W}$ — 84 % of what the panel could give.',
        'MPPT: $0.95 \\times 98 = 93\\ \\mathrm{W}$ into the battery.',
        'Gain: $93/82 = 1.13$, about 13 %. With hot cells the MPP voltage falls towards the battery voltage and the gain shrinks; in cold weather, or with a deeply discharged battery, it grows.'
      ],
      a: 'About 13 % more energy (93 W against 82 W).'
    },
    {
      title: 'A dull day',
      q: 'Under 1000 W/m² a cell ($n$ = 1.25, 25 °C) gives $I_{sc}$ = 6.1 A and $V_{oc}$ = 0.615 V. Estimate both at 200 W/m², and the 36-cell module\'s open-circuit voltage.',
      steps: [
        'Current is proportional to light: $I_{sc} = 6.1 \\times 0.2 = 1.22\\ \\mathrm{A}$.',
        'Voltage changes by $nV_T \\ln 0.2 = 1.25 \\times 25.7\\ \\mathrm{mV} \\times (-1.61) = -52\\ \\mathrm{mV}$: $V_{oc} = 0.563\\ \\mathrm{V}$.',
        'Module: $36 \\times 0.563 = 20.3\\ \\mathrm{V}$ against 22.1 V in full sun. A fifth of the current, 92 % of the voltage.'
      ],
      a: 'About 1.2 A and 0.56 V per cell (20.3 V for the module).'
    },
    {
      title: 'A hot roof',
      q: 'A 100 W module ($\\gamma$ = −0.4 %/°C) sits on a roof where its cells reach 60 °C. What can it deliver at 1000 W/m²?',
      steps: [
        '$P = 100 \\times (1 - 0.004 \\times (60 - 25)) = 100 \\times 0.86 = 86\\ \\mathrm{W}$.',
        'Its open-circuit voltage falls by about $0.3\\ \\% \\times 35 \\approx 10\\ \\%$: from 22.1 V to about 19.8 V.'
      ],
      a: 'About 86 W.'
    }
  ],
  quiz: [
    { q: 'The irradiance on a solar cell halves. Its short-circuit current and open-circuit voltage…', choices: ['both halve', 'current halves, voltage falls only slightly', 'voltage halves, current stays', 'both stay the same'], a: 1,
      why: 'I_sc is proportional to light; V_oc depends on the logarithm of I_sc, falling by only nV_T ln 2 ≈ 22 mV per cell.' },
    { q: 'A panel has V_mp = 30 V, I_mp = 9 A, V_oc = 37 V and I_sc = 9.6 A. What is its fill factor?', answer: 0.76,
      why: 'FF = (30 × 9)/(37 × 9.6) = 270/355 = 0.76.' },
    { q: 'With the same irradiance, a solar panel produces more power on a hot summer day than on a cold winter day.', a: false,
      why: 'Heat lowers the voltage and the maximum power by roughly 0.4 %/°C; a cold panel is more efficient.' },
    { q: 'What does a bypass diode across a group of cells do?', choices: ['Stops the battery discharging into the panel at night', 'Lets the string current flow round a shaded group, preventing a hot spot', 'Raises the voltage', 'Converts the output to AC'], a: 1,
      why: 'When a group cannot pass the string current, its bypass diode conducts, so the shaded cells are not driven hard into reverse. (The night-time job belongs to a blocking diode.)' },
    { q: 'Why does a "12 V" panel have 36 cells (V_mp ≈ 17–18 V) rather than 24?', choices: ['To make it heavier', 'So that it can still charge a battery to about 14.4 V when hot, after the drop in the blocking diode and wiring', 'Because 36 cells have a better fill factor', 'It is a historical accident with no reason'], a: 1,
      why: 'Twenty-four cells would give about 12 V at the MPP — too little to charge a 12 V lead-acid battery at all, let alone on a hot day.' }
  ],
  applications: ['Rooftop and utility photovoltaic systems.', 'Off-grid battery charging for boats, caravans and remote sensors.', 'Calculators, garden lights and energy-harvesting sensor nodes.', 'Satellites and space probes.'],
  sim: 'dio-solar'
},

{
  id: 'optocouplers', parent: 'optoelectronics', title: 'Optocouplers', level: 2,
  short: 'An LED and a photodetector sealed in one package pass a signal across a gap of insulation: the two sides share no electrical connection and may be thousands of volts apart. The current-transfer ratio sets how the output responds.',
  keywords: ['optocoupler', 'optoisolator', 'opto-isolator', 'galvanic isolation', 'current-transfer ratio', 'CTR', 'PC817', '4N35', '4N25', '6N137', 'MOC3021', 'MOC3063', 'triac driver', 'isolation voltage', 'creepage', 'digital isolator', 'PLC input'],
  prereq: ['leds', 'photodiodes', 'bjt-switch'],
  related: ['pull-resistors', 'microcontrollers', 'relays', 'power-supply-design', 'comparators'],
  body: `
Sometimes a signal must cross between two circuits that must not be connected: a microcontroller reading a 24 V industrial sensor, a switch-mode supply's output regulating a controller that sits at mains potential, a logic board firing a triac on 230 V. An **optocoupler** carries the signal as light: an infrared LED on one side, a photodetector on the other, separated by clear insulating plastic. Typical parts withstand **3.75–5 kV RMS** between input and output, and the two sides may use completely separate grounds.

### What is inside
- **Phototransistor output** — the everyday kind: PC817, 4N25, 4N35. Slow (microseconds) but cheap and versatile.
- **Photodarlington output** (4N32): far more gain, even slower.
- **Logic output** with a built-in amplifier (6N137): megabits per second, a clean digital edge.
- **Photo-triac output** (MOC3021, and zero-crossing types such as MOC3063): drives the gate of a power triac directly from a logic signal — the heart of many solid-state relays.
- **Photovoltaic output**: a stack of tiny solar cells that charges a MOSFET gate — the MOSFET solid-state relay.

### The current-transfer ratio
For a phototransistor coupler the key figure is

$$\\mathrm{CTR} = \\frac{I_C}{I_F}$$

the collector current obtained per unit of LED current, usually in percent. It is **not tightly controlled**. The PC817 is sold in grades A (80–160 %), B (130–260 %), C (200–400 %) and D (300–600 %), measured at 5 mA; the 4N35 promises at least 100 % at 10 mA, the 4N25 only 20 %. CTR also falls at low LED currents, changes with temperature, and — most importantly — **falls as the LED ages**, typically by tens of percent over years at high current. Design with the minimum CTR, and then allow another factor of two.

### Designing a switching input
The usual job is to turn a voltage on one side into a clean logic level on the other:
1. **LED side:** choose $I_F$ (5–10 mA is typical) and set it with $R_F = (V_{in} - V_F)/I_F$, $V_F$ ≈ 1.2 V. Check the resistor's power, and add a reverse diode if the input can be reversed (the LED only withstands about 5 V backwards).
2. **Output side:** a pull-up $R_L$ to the logic supply. When the LED is on, the transistor must **saturate**, pulling the output below about 0.4 V. It can only do that if the current it is able to sink exceeds what the pull-up asks for:

$$\\mathrm{CTR}_{min} \\times k \\times I_F \\;>\\; \\frac{V_{CC} - V_{CE(sat)}}{R_L}$$

with $k$ ≈ 0.5 for ageing. If it does not, the output sits at an in-between voltage that logic may read either way — the most common optocoupler bug.
3. **Speed:** a larger pull-up needs less current but switches more slowly — the phototransistor's capacitance must charge through $R_L$, and a hard-saturated transistor takes longer to turn off. Kilohm pull-ups give switching times of several to tens of microseconds; for fast data use a logic-output coupler or a **digital isolator** (capacitive or magnetic coupling, no LED to age).

### Linear use: the feedback loop of a switch-mode supply
Almost every mains adapter contains a PC817 and a TL431. The TL431 compares the output voltage with its reference and drives the LED; the phototransistor pulls on the controller's feedback pin on the mains side. Here the CTR is part of the loop gain, and its spread and drift are absorbed by the feedback.

> [!warn] The isolation is only as good as the board around it. Keep the required **creepage** (along the surface) and **clearance** (through the air) between the two sides — often 6–8 mm for mains — with nothing crossing under the part, and sometimes a slot cut in the board.
`,
  ideas: [
    'An optocoupler passes a signal as light across insulation rated for thousands of volts.',
    'CTR = I_C/I_F varies widely between parts, with current, temperature and age.',
    'For a switching output, the available collector current must exceed what the pull-up demands — with margin.',
    'Larger pull-ups save current but slow the output; fast data needs logic-output couplers or digital isolators.',
    'In switch-mode supplies an optocoupler and a TL431 carry the feedback across the isolation barrier.'
  ],
  pitfalls: [
    'The CTR on the datasheet cover is what you get — It is a range at one test current; it varies with I_F and temperature and falls with age. Design with half the minimum.',
    'A smaller pull-up makes the output stronger — It demands more collector current; if the phototransistor cannot supply it, the output never goes properly low.',
    'The package\'s isolation rating protects the circuit on its own — The PCB\'s creepage and clearance must match it, or the isolation fails across the board surface.'
  ],
  formulas: [
    {
      name: 'Current-transfer ratio',
      expr: 'CTR = IC/IF', tex: '\\mathrm{CTR} = \\frac{I_C}{I_F}',
      vars: {
        CTR: { name: 'current-transfer ratio', q: 'ratio', unit: '%', tex: '\\mathrm{CTR}' },
        IC: { name: 'collector current', q: 'current', unit: 'mA', value: 6, tex: 'I_C' },
        IF: { name: 'LED forward current', q: 'current', unit: 'mA', value: 5, tex: 'I_F' }
      },
      stories: { CTR: 'An optocoupler passes {IC} at its output with {IF} in its LED. What is its CTR?', IC: 'An optocoupler with a CTR of {CTR} has {IF} in its LED. What collector current can it pass?' }
    },
    {
      name: 'LED series resistor',
      expr: 'RF = (Vin - VF)/IF', tex: 'R_F = \\frac{V_{in} - V_F}{I_F}',
      vars: {
        RF: { name: 'input resistor', q: 'resistance', unit: 'kΩ', tex: 'R_F' },
        Vin: { name: 'input voltage (on)', q: 'voltage', unit: 'V', value: 24, tex: 'V_{in}' },
        VF: { name: 'LED forward voltage', q: 'voltage', unit: 'V', value: 1.2, tex: 'V_F' },
        IF: { name: 'LED current', q: 'current', unit: 'mA', value: 5, tex: 'I_F' }
      },
      stories: { RF: 'An optocoupler LED ({VF}) must carry {IF} from a {Vin} input. What resistor is needed?' }
    },
    {
      name: 'LED current for a saturated output',
      expr: 'IF = (Vcc - Vsat)/(RL*CTR*k)', tex: 'I_F = \\frac{V_{CC} - V_{CE(sat)}}{R_L\\,\\mathrm{CTR}_{min}\\, k}',
      vars: {
        IF: { name: 'minimum LED current', q: 'current', unit: 'mA', tex: 'I_F' },
        Vcc: { name: 'output-side supply', q: 'voltage', unit: 'V', value: 5, tex: 'V_{CC}' },
        Vsat: { name: 'saturation voltage', q: 'voltage', unit: 'V', value: 0.2, tex: 'V_{CE(sat)}' },
        RL: { name: 'pull-up resistor', q: 'resistance', unit: 'kΩ', value: 4.7, tex: 'R_L' },
        CTR: { name: 'minimum CTR', q: 'ratio', unit: '%', value: 80, tex: '\\mathrm{CTR}_{min}' },
        k: { name: 'ageing and temperature margin', value: 0.5, min: 0.1, max: 1 }
      },
      stories: { IF: 'A coupler with a minimum CTR of {CTR} drives a {RL} pull-up to {Vcc}. With a margin factor of {k}, what LED current guarantees saturation?', RL: 'With {IF} in the LED and a minimum CTR of {CTR} (margin {k}), what is the smallest pull-up to {Vcc} that still saturates?' }
    }
  ],
  examples: [
    {
      title: 'A 24 V PLC input for a 3.3 V microcontroller',
      q: 'Design an isolated input with a PC817A (CTR 80–160 %) that reads a 24 V signal as a logic low on a 3.3 V microcontroller pin.',
      steps: [
        'LED current 5 mA: $R_F = (24 - 1.2)/5\\ \\mathrm{mA} = 4.56\\ \\mathrm{k\\Omega}$ → 4.7 kΩ, giving 4.85 mA. Its power: $22.8^2/4700 = 0.11\\ \\mathrm{W}$ — use a 0.25 W resistor or larger.',
        'Output: a 10 kΩ pull-up to 3.3 V asks for $(3.3 - 0.2)/10\\ \\mathrm{k\\Omega} = 0.31\\ \\mathrm{mA}$.',
        'Worst-case available: $0.8 \\times 0.5 \\times 4.85\\ \\mathrm{mA} = 1.9\\ \\mathrm{mA}$ — six times more than needed, so it saturates hard, even after years.',
        'Switching takes tens of microseconds with 10 kΩ: irrelevant for a limit switch. Add a diode in antiparallel with the LED (or in series) to survive reverse wiring.'
      ],
      a: 'R_F = 4.7 kΩ (0.25 W), pull-up 10 kΩ: saturates with a sixfold margin.'
    },
    {
      title: 'The output that would not go low',
      q: 'A coupler whose CTR has aged to 50 % runs its LED at 10 mA and drives a 470 Ω pull-up to 5 V. What is the output voltage when the LED is on, and how do you fix it?',
      steps: [
        'Available collector current: $0.5 \\times 10\\ \\mathrm{mA} = 5\\ \\mathrm{mA}$.',
        'To saturate, the pull-up would need $(5 - 0.2)/470 = 10.2\\ \\mathrm{mA}$. The transistor cannot pull that much, so it stays in its active region.',
        'Output: $5 - 5\\ \\mathrm{mA} \\times 470\\ \\Omega = 2.65\\ \\mathrm{V}$ — neither high nor low for 5 V logic (the simulator shows the same, 2.7 V).',
        'Fix: a 4.7 kΩ pull-up needs only 1 mA, well within 5 mA — or double the LED current.'
      ],
      a: 'About 2.7 V, an invalid level; use a larger pull-up (4.7 kΩ).'
    }
  ],
  quiz: [
    { q: 'An optocoupler passes 6 mA at its output with 10 mA in its LED. Its CTR is…', answer: 60, unit: '%',
      why: 'CTR = I_C/I_F = 6/10 = 60 %.' },
    { q: 'Why design with only half of the datasheet\'s minimum CTR?', choices: ['Because datasheets exaggerate', 'Because the LED\'s output falls with age and temperature, and the CTR falls with it', 'To save power', 'It is required by law'], a: 1,
      why: 'LED degradation over the product\'s life, plus temperature and current effects, can cut the CTR substantially; the margin keeps the output saturated.' },
    { q: 'Increasing the pull-up resistor on a phototransistor output makes it switch more slowly.', a: true,
      why: 'The phototransistor\'s capacitance charges through R_L, so the time constant grows with R_L.' },
    { q: 'The input and output grounds of an optocoupler may be at very different potentials, up to its isolation rating.', a: true,
      why: 'That is its purpose: the only link is light across an insulating gap.' },
    { q: 'You need to pass a 10 Mbit/s data stream across an isolation barrier. Choose…', choices: ['a PC817', 'a 4N32 photodarlington', 'a logic-output coupler such as the 6N137, or a digital isolator', 'a MOC3021'], a: 2,
      why: 'Phototransistor and photodarlington outputs take microseconds to switch; the MOC3021 drives triacs. Logic-output couplers and digital isolators handle megabits per second.' }
  ],
  applications: ['Isolated 24 V inputs on PLCs and industrial controllers.', 'Feedback across the isolation barrier of switch-mode power supplies.', 'Triac drivers and solid-state relays switching mains loads.', 'Breaking ground loops in measurement, audio and MIDI interfaces.'],
  sim: { id: 'dio-led', params: { mode: 'opto' } }
}

);
