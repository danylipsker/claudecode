/* HYPER-ELECTRONICS · content/sensors.js — thermistors and RTDs, thermocouples, strain
 * gauges and load cells, Hall-effect sensors, and signal conditioning for sensors. */
Hyper.add(

{
  id: 'thermistors-rtd', parent: 'sensors', title: 'Thermistors and RTDs', level: 2,
  short: 'Resistors whose resistance is the measurement: an NTC thermistor changes by about 4 % per kelvin and needs a nonlinear equation; a platinum RTD changes by only 0.385 % per kelvin, but almost linearly and to an international standard.',
  keywords: ['thermistor', 'NTC', 'PTC', 'RTD', 'Pt100', 'Pt1000', 'beta equation', 'Steinhart–Hart', 'Callendar–Van Dusen', 'temperature sensor', 'self-heating', 'three-wire', 'four-wire', 'lead resistance', '10k NTC'],
  prereq: ['voltage-divider', 'physics:temperature', 'math:logarithms'],
  related: ['sensor-interfacing', 'adc', 'thermocouples', 'wheatstone-bridge', 'physics:semiconductors'],
  body: `
The simplest electrical thermometer is a resistor whose resistance depends on temperature. Two families dominate: **thermistors**, sintered metal-oxide ceramics whose resistance changes strongly and nonlinearly, and **resistance temperature detectors (RTDs)**, usually platinum, which change weakly but predictably. Both are read the same way: turn the resistance into a voltage with a [[voltage-divider|divider]], a bridge or a current source, and digitise it with an [[adc|ADC]].

### NTC thermistors
An NTC (negative temperature coefficient) thermistor's resistance falls as it warms — by about 4 % per kelvin near room temperature, ten times more than any metal. Parts are named by their resistance at 25 °C; 10 kΩ and 100 kΩ are the most common. Over a moderate range the **β equation** fits well:

$$R = R_{25}\\,\\exp\\!\\left[\\beta\\left(\\frac{1}{T} - \\frac{1}{T_{25}}\\right)\\right]$$

with temperatures in kelvin, $T_{25} = 298.15$ K, and β typically 3000–4500 K. A 10 kΩ part with β = 3950 K reads about 33 kΩ at 0 °C and 3.6 kΩ at 50 °C. For better than about a kelvin over a wide range, use the **Steinhart–Hart equation**, with three constants fitted to calibration points or supplied by the maker:

$$\\frac{1}{T} = A + B\\ln R + C(\\ln R)^3$$

Firmware either evaluates it or interpolates in a table. ([[math:logarithms|Logarithms]] appear because the resistance is, near enough, an exponential of $1/T$.)

The fixed resistor of the divider decides where the measurement is most sensitive: the output changes fastest where the thermistor equals the fixed resistor. So choose the fixed resistor equal to the thermistor's value in the middle of the range that matters most — a 10 kΩ thermistor with a 10 kΩ resistor is most sensitive around 25 °C. A 3D printer's 100 kΩ hot-end thermistor with the usual 4.7 kΩ pull-up is most sensitive near 100 °C; at printing temperatures, around 250 °C, each step of a 10-bit ADC is worth about 1.5 °C, which is why printer firmware lists many table points up there.

**PTC** thermistors, whose resistance rises sharply above a switching temperature, are used as resettable fuses and self-regulating heaters rather than for measurement.

### Platinum RTDs
A **Pt100** has 100 Ω at 0 °C, a **Pt1000** 1000 Ω. Their resistance rises by about 0.385 % per kelvin (α = 0.00385 /K, the IEC 60751 curve), nearly in a straight line. The standard **Callendar–Van Dusen** equation, $R = R_0(1 + AT + BT^2)$ above 0 °C with $A = 3.9083\\times10^{-3}\\ \\mathrm{K^{-1}}$ and $B = -5.775\\times10^{-7}\\ \\mathrm{K^{-2}}$ (T in °C), is the same for every maker, so sensors are interchangeable. Tolerance classes are standardised too: class B is ±(0.3 + 0.005 |T|) K, class A ±(0.15 + 0.002 |T|) K. RTDs cover −200 °C to above 600 °C and are the choice for accuracy and long-term stability in industry.

Their weakness is the small signal. A Pt100 changes by only 0.385 Ω per kelvin, so **lead resistance** matters: 1 Ω of copper in the leads reads as 2.6 K. Hence the **three-wire** connection (a third lead lets the electronics subtract the lead resistance, provided both leads match) and the **four-wire** (Kelvin) connection, in which two leads carry the excitation current and two others sense the voltage with no current flowing, so their resistance drops out entirely. Dedicated converters, such as the MAX31865, handle the wiring schemes and the linearisation.

### Self-heating
The measuring current heats the sensor, $P = I^2R$, and the sensor settles above its surroundings by $P$ times its thermal resistance (the datasheet's **dissipation constant**, in mW/K, is its inverse — far lower in still air than in stirred liquid). A small bead at 1.5 mW/K in still air, dissipating 0.3 mW, reads 0.2 K high. Keep the excitation low: RTD currents are typically 0.1–1 mA, and precise thermistor dividers keep the sensor's power in the tens of microwatts.
`,
  ideas: [
    'NTC thermistors change by about −4 %/K and follow the β or Steinhart–Hart equation; platinum RTDs change by +0.385 %/K, nearly linearly.',
    'A divider is most sensitive where the thermistor equals the fixed resistor: centre that on the range you care about.',
    'Lead resistance ruins two-wire RTD measurements; three- and four-wire connections remove it.',
    'Self-heating makes the sensor read high; keep the measuring power small.',
    'Read resistive sensors ratiometrically, with the divider and the ADC reference on the same supply.'
  ],
  pitfalls: [
    'A thermistor gives a linear reading — Its resistance is roughly exponential in 1/T; the reading needs the β or Steinhart–Hart equation, or a table.',
    'More excitation current always means a better RTD measurement — The signal grows as I but self-heating grows as I², so beyond a point the error rises.',
    'The leads of a Pt100 do not matter — Every ohm of lead resistance reads as 2.6 K; use three or four wires.'
  ],
  derivation: {
    title: 'Why the fixed resistor should equal the thermistor',
    steps: [
      { text: 'With the thermistor $R_T$ at the bottom of a divider from $V_s$ through a fixed resistor $R_f$:', tex: 'V = V_s\\,\\frac{R_T}{R_T + R_f}' },
      { text: 'How the output moves with the thermistor ([[math:derivative|differentiate]]):', tex: '\\frac{dV}{dR_T} = V_s\\,\\frac{R_f}{(R_T + R_f)^2}' },
      { text: 'From the β equation, the thermistor itself changes with temperature as', tex: '\\frac{dR_T}{dT} = -\\frac{\\beta}{T^2}\\,R_T' },
      { text: 'Chain the two:', tex: '\\frac{dV}{dT} = -\\frac{V_s\\,\\beta}{T^2}\\cdot\\frac{R_f\\,R_T}{(R_f + R_T)^2}' },
      { text: 'The last factor is largest when its derivative with respect to $R_f$ vanishes, which happens at $R_f = R_T$; it is then $\\tfrac14$. So the steepest possible slope is', tex: '\\left|\\frac{dV}{dT}\\right|_{\\max} = \\frac{V_s\\,\\beta}{4T^2}' },
      { text: 'For 3.3 V, β = 3950 K at 25 °C this is 36.7 mV/K: with a 12-bit ADC (0.81 mV per step), about 0.02 K per step at the best point — and coarser away from it.' }
    ]
  },
  formulas: [
    {
      name: 'NTC thermistor: the β equation',
      expr: 'R = R25*exp(B*(1/T - 1/T25))', tex: 'R = R_{25}\\,e^{\\beta\\left(\\frac{1}{T} - \\frac{1}{T_{25}}\\right)}',
      vars: {
        R: { name: 'resistance at temperature T', q: 'resistance', unit: 'kΩ' },
        R25: { name: 'resistance at the reference temperature', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_{25}' },
        B: { name: 'β constant', q: 'dtemp', unit: 'K', value: 3950, tex: '\\beta' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 50 },
        T25: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_{25}' }
      },
      note: 'Temperatures are converted to kelvin inside the formula. Good to about ±1 K over a range of a few tens of kelvin around the reference.',
      practice: { unknowns: ['R', 'T', 'B'] },
      stories: {
        R: 'A {R25} NTC thermistor has β = {B}. What is its resistance at {T}?',
        T: 'A {R25} NTC thermistor with β = {B} measures {R}. What temperature is it at?',
        B: 'A thermistor reads {R25} at {T25} and {R} at {T}. What is its β?'
      }
    },
    {
      name: 'Steinhart–Hart equation',
      expr: '1/T = A + B*ln(R) + C*ln(R)^3', tex: '\\frac{1}{T} = A + B\\ln R + C(\\ln R)^3',
      vars: {
        T: { name: 'temperature', q: 'temperature', unit: '°C' },
        A: { name: 'coefficient A (1/K)', q: 'none', value: 1.129148e-3 },
        B: { name: 'coefficient B (1/K)', q: 'none', value: 2.34125e-4 },
        C: { name: 'coefficient C (1/K)', q: 'none', value: 8.76741e-8 },
        R: { name: 'thermistor resistance', q: 'resistance', unit: 'kΩ', value: 10 }
      },
      solveFor: 'T',
      note: 'R is taken in ohms inside the logarithm. The default coefficients describe a typical 10 kΩ NTC; fit your own from three calibration temperatures.',
      practice: { unknowns: ['T', 'R'] },
      stories: { T: 'A 10 kΩ NTC with the given Steinhart–Hart coefficients reads {R}. What is the temperature?' }
    },
    {
      name: 'Platinum RTD (linear approximation)',
      expr: 'R = R0*(1 + alpha*(T - T0))', tex: 'R = R_0\\,[1 + \\alpha\\,(T - T_0)]',
      vars: {
        R: { name: 'resistance at temperature T', q: 'resistance', unit: 'Ω' },
        R0: { name: 'resistance at 0 °C (100 for a Pt100)', q: 'resistance', unit: 'Ω', value: 100, tex: 'R_0' },
        alpha: { name: 'mean temperature coefficient', q: 'expansion', unit: '1/K', value: 0.00385, tex: '\\alpha' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 100 },
        T0: { const: 'T0' }
      },
      note: 'Exact at 0 and 100 °C for the standard α = 0.00385; within about 0.4 K elsewhere between 0 and 200 °C. Use Callendar–Van Dusen for more.',
      practice: { unknowns: ['R', 'T'] },
      stories: { R: 'What does a Pt100 read at {T}?', T: 'A Pt1000-style sensor with R₀ = {R0} reads {R}. What is the temperature?' }
    },
    {
      name: 'Self-heating error',
      expr: 'dT = I^2*R*theta', tex: '\\Delta T = I^2 R\\,\\theta',
      vars: {
        dT: { name: 'reading error (sensor above its surroundings)', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        I: { name: 'current through the sensor', q: 'current', unit: 'mA', value: 0.165 },
        R: { name: 'sensor resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        theta: { name: 'thermal resistance to the surroundings (1 / dissipation constant)', q: 'thermalres', unit: 'K/W', value: 667, tex: '\\theta' }
      },
      note: 'A dissipation constant of 1.5 mW/K is a thermal resistance of 667 K/W — typical of a small bead in still air.',
      practice: { unknowns: ['dT', 'I'] },
      stories: { I: 'A sensor of {R} with a thermal resistance of {theta} must not read more than {dT} high. What is the largest measuring current?' }
    },
    {
      name: 'Error from lead resistance in a two-wire RTD',
      expr: 'err = Rl/(alpha*R0)', tex: '\\Delta T_{\\text{err}} = \\frac{R_{\\text{leads}}}{\\alpha\\,R_0}',
      vars: {
        err: { name: 'temperature error', q: 'dtemp', unit: 'K', tex: '\\Delta T_{\\text{err}}' },
        Rl: { name: 'total resistance of both leads', q: 'resistance', unit: 'Ω', value: 0.78, tex: 'R_{\\text{leads}}' },
        alpha: { name: 'temperature coefficient', q: 'expansion', unit: '1/K', value: 0.00385, tex: '\\alpha' },
        R0: { name: 'sensor resistance at 0 °C', q: 'resistance', unit: 'Ω', value: 100, tex: 'R_0' }
      },
      practice: { unknowns: ['err', 'Rl'] },
      stories: { err: 'A Pt100 is read with two leads totalling {Rl}. How far off is the reading?' }
    }
  ],
  examples: [
    {
      title: 'A thermistor divider for a battery pack',
      q: 'A 10 kΩ, β = 3950 K NTC monitors a battery pack whose critical range is around 50 °C. It sits at the bottom of a divider from 3.3 V. Choose the fixed resistor and find the output at 25, 50 and 75 °C.',
      steps: [
        {text: 'Resistance at 50 °C (323.15 K):', tex: 'R = 10\\ \\mathrm{k\\Omega}\\;e^{3950\\,(1/323.15 - 1/298.15)} = 10 \\times e^{-1.025} = 3.59\\ \\mathrm{k\\Omega}'},
        'For the steepest slope at 50 °C, make the fixed resistor equal to that: 3.6 kΩ (E24).',
        'At 50 °C: $V = 3.3 \\times 3.59/(3.59 + 3.6) = 1.65$ V, mid-scale.',
        'At 25 °C: $3.3 \\times 10/13.6 = 2.43$ V; at 75 °C the thermistor is 1.49 kΩ and $V = 3.3 \\times 1.49/5.09 = 0.97$ V.',
        'Supply the divider from the ADC reference so the 3.3 V cancels out of the reading.'
      ],
      a: '3.6 kΩ: 2.43 V at 25 °C, 1.65 V at 50 °C, 0.97 V at 75 °C.'
    },
    {
      title: 'β from two points',
      q: 'A thermistor reads 10.0 kΩ at 25 °C and 1.10 kΩ at 85 °C. What is its β?',
      steps: [
        'Take the ratio of the β equation at the two temperatures: $\\ln(R_1/R_2) = \\beta\\,(1/T_1 - 1/T_2)$.',
        {text: 'With T₁ = 298.15 K and T₂ = 358.15 K:', tex: '\\beta = \\frac{\\ln(10.0/1.10)}{1/298.15 - 1/358.15} = \\frac{2.207}{5.619\\times10^{-4}} = 3930\\ \\mathrm{K}'}
      ],
      a: 'β ≈ 3930 K.'
    },
    {
      title: 'The cost of two wires',
      q: 'A Pt100 on a machine is connected with 5 m of two-core 0.22 mm² cable. How large is the error with a two-wire connection?',
      steps: [
        'The current flows through both cores: 10 m of 0.22 mm² copper, $R = 0.0172 \\times 10/0.22 = 0.78\\ \\Omega$.',
        'The sensor changes by $0.385\\ \\Omega$ per kelvin, so the reading is $0.78/0.385 = 2.0$ K too high — and it drifts as the cable warms.',
        'A three-core cable in a three-wire circuit cancels most of it; a four-wire circuit cancels all of it.'
      ],
      a: 'About 2 K too high.'
    }
  ],
  quiz: [
    { q: 'A 10 kΩ NTC thermistor at 25 °C warms by one kelvin. It now reads about…', choices: ['10.4 kΩ', '10.0 kΩ', '9.6 kΩ', '5 kΩ'], a: 2,
      why: 'Near room temperature an NTC falls by about 4 % per kelvin (β/T² ≈ 3950/298² = 4.4 %).' },
    { q: 'Why does a four-wire RTD connection remove the lead resistance?', choices: ['The leads are thicker', 'The sensing pair carries no current, so its resistance drops no voltage', 'The four leads average out', 'It measures the leads separately'], a: 1,
      why: 'One pair carries the excitation current; the other only senses the voltage at the sensor with (almost) no current, so its resistance does not matter.' },
    { q: 'A 10 kΩ, β = 3950 K NTC is used mainly between 0 and 10 °C. The best fixed resistor for the divider is about…', choices: ['1 kΩ', '10 kΩ', '27 kΩ', '100 kΩ'], a: 2,
      why: 'At 5 °C the thermistor reads about 26 kΩ; matching the fixed resistor to that puts the steepest part of the curve in the range of interest.' },
    { q: 'What does a Pt100 read at 100 °C?', answer: 138.5, unit: 'Ω',
      why: '100 × (1 + 0.00385 × 100) = 138.5 Ω — the standard α is defined by exactly this pair of values.' },
    { q: 'Raising an RTD\'s excitation current always improves accuracy, because the signal grows.', a: false,
      why: 'The signal grows as I, the self-heating as I². Beyond a modest current, self-heating dominates the error.' }
  ],
  applications: ['Battery-pack and charger temperature monitoring with 10 kΩ NTCs.', 'Hot-ends and heated beds of 3D printers; ovens, kettles and HVAC.', 'Industrial process temperature with Pt100 sensors and transmitters.', 'Inrush limiting (power NTCs) and resettable protection (PTCs).'],
  sim: 'cp-thermistor'
},

{
  id: 'thermocouples', parent: 'sensors', title: 'Thermocouples', level: 2,
  short: 'Two different metals joined at the hot end produce a few tens of microvolts per kelvin of temperature difference. Thermocouples reach 1200 °C and beyond, but their tiny signal needs amplification and cold-junction compensation.',
  keywords: ['thermocouple', 'type K', 'type J', 'type T', 'type N', 'Seebeck effect', 'cold-junction compensation', 'CJC', 'reference junction', 'extension wire', 'MAX31855', 'microvolts per kelvin', 'hot junction'],
  prereq: ['physics:temperature', 'voltage', 'instrumentation-amplifier'],
  related: ['thermistors-rtd', 'sensor-interfacing', 'adc', 'noise-snr'],
  body: `
Join two wires of different metals at one end and heat it: a small voltage appears between the free ends. This is the **Seebeck effect**, and it is how temperatures up to 1200 °C and beyond are measured in furnaces, kilns, exhausts, turbines and the hot-ends of high-temperature 3D printers. The standard pairings have letter names:

| Type | Metals | Sensitivity | Range (roughly) | Notes |
|---|---|---|---|---|
| K | chromel – alumel | 41 µV/K | −200 to 1250 °C | the general-purpose default |
| J | iron – constantan | 52 µV/K | −40 to 750 °C | iron rusts; older equipment |
| T | copper – constantan | 43 µV/K | −200 to 350 °C | good at low temperatures |
| N | nicrosil – nisil | 26–39 µV/K | −200 to 1300 °C | more stable than K when hot |
| R, S, B | platinum – rhodium | about 6–12 µV/K | up to 1600–1800 °C | costly; very high temperatures |

### What a thermocouple actually measures
The voltage is not made at the junction. It is generated **along the wires**, wherever they cross a temperature gradient, and it depends only on the temperatures at their two ends: the **hot (measuring) junction**, and the **cold (reference) junction** where the thermocouple metals meet the copper of the instrument. A thermocouple therefore measures a **temperature difference**. Over a modest range, with a nearly constant sensitivity $S$,

$$V = S\\,(T_\\text{hot} - T_\\text{cold})$$

A type K probe at 200 °C with its terminals at 25 °C gives 7.14 mV — not the 8.14 mV it would give with the terminals at 0 °C (from the standard tables: 8.138 mV at 200 °C minus 1.000 mV at 25 °C).

### Cold-junction compensation
To know the hot temperature, you must know the cold one. Instruments measure the temperature of the terminal block with a thermistor or a silicon sensor and add the equivalent voltage back: **cold-junction compensation (CJC)**. Done properly, with the standard (NIST) tables or polynomials: convert the terminal temperature to a voltage, add it to the measured voltage, and convert the sum back to a temperature. Adding degrees instead of volts is only an approximation, because the sensitivity varies with temperature. Converter chips do all of this: the MAX31855 (type K, 0.25 °C steps, SPI output), the MAX31856 (any type), or the AD8495, an amplifier with built-in compensation giving 5 mV/°C.

Two wiring rules follow:
- Extend a thermocouple only with **thermocouple extension wire** of matching alloys (colour-coded by type). Copper extension wire moves the cold junction to wherever the copper joins — at whatever temperature that point happens to be.
- Keep the terminal block **isothermal**: the compensation sensor must be at the same temperature as the junctions themselves, so keep it away from heat sinks and draughts.

### A tiny signal
Tens of microvolts per kelvin means that resolving 0.1 K takes about 4 µV — the size of op-amp offsets, the thermal voltages of dissimilar metals in connectors, and noise picked up by long leads. Use a low-offset [[instrumentation-amplifier|instrumentation amplifier]] or a dedicated converter, filter the input, twist the leads, and beware of **grounded-junction** probes touching earthed metal: the ground loop feeds mains noise straight into the measurement. Most converters also detect an **open thermocouple** — a common failure, since the junction is often the hottest, most stressed spot on the machine.

Accuracy is set by the wire itself: standard type K is good to about ±2.2 K or ±0.75 % of the reading, whichever is larger. Resolution far finer than that is easy; better accuracy needs calibration, special-grade wire, or — below about 600 °C — an [[thermistors-rtd|RTD]].
`,
  ideas: [
    'A thermocouple\'s voltage depends on the difference between its hot junction and its cold (reference) junction.',
    'The signal is tens of microvolts per kelvin: amplify with care and fight offsets and noise.',
    'Cold-junction compensation adds back the voltage for the terminal temperature — in volts, then converted to temperature.',
    'Extend thermocouples only with matching extension wire, and keep the terminals at one temperature.',
    'Thermocouples win at high temperatures; below about 600 °C RTDs are more accurate.'
  ],
  pitfalls: [
    'The voltage is generated at the tip — It is generated along the wires wherever they cross a temperature gradient; only the two end temperatures determine the total.',
    'Copper wire can extend a thermocouple — It creates a new junction at the joint, so the reading depends on the joint\'s temperature.',
    'CJC means adding the terminal temperature to the reading — Add the equivalent voltage, then convert; adding degrees is only approximate because the sensitivity changes with temperature.'
  ],
  formulas: [
    {
      name: 'Thermocouple voltage (constant sensitivity)',
      expr: 'V = S*(Th - Tc)', tex: 'V = S\\,(T_{\\text{hot}} - T_{\\text{cold}})',
      vars: {
        V: { name: 'thermocouple voltage', q: 'voltage', unit: 'mV', signed: true },
        S: { name: 'Seebeck coefficient (type K ≈ 4.1 × 10⁻⁵ V/K)', unit: 'V/K', value: 4.1e-5 },
        Th: { name: 'hot-junction temperature', q: 'temperature', unit: '°C', value: 200, tex: 'T_{\\text{hot}}' },
        Tc: { name: 'cold-junction (terminal) temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_{\\text{cold}}' }
      },
      note: 'A linear approximation: good to a few kelvin for type K between 0 and 1000 °C. Use the standard tables for accuracy.',
      practice: { unknowns: ['V', 'Th'] },
      stories: {
        V: 'A type K thermocouple ({S}) has its tip at {Th} and its terminals at {Tc}. What voltage does it give?',
        Th: 'A type K thermocouple ({S}) gives {V} with its terminals at {Tc}. About how hot is the tip?'
      }
    },
    {
      name: 'Amplifier gain to fill the ADC',
      expr: 'G = Vfs/(S*(Tmax - Tc))', tex: 'G = \\frac{V_{\\text{FS}}}{S\\,(T_{\\max} - T_{\\text{cold}})}',
      vars: {
        G: { name: 'amplifier gain', q: 'none' },
        Vfs: { name: 'usable ADC input range', q: 'voltage', unit: 'V', value: 3, tex: 'V_{\\text{FS}}' },
        S: { name: 'Seebeck coefficient', unit: 'V/K', value: 4.1e-5 },
        Tmax: { name: 'highest temperature to measure', q: 'temperature', unit: '°C', value: 400, tex: 'T_{\\max}' },
        Tc: { name: 'cold-junction temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_{\\text{cold}}' }
      },
      note: 'Leave margin: a colder terminal block gives a larger signal for the same hot temperature.',
      practice: { unknowns: ['G', 'Tmax'] }
    },
    {
      name: 'Temperature resolution of the chain',
      expr: 'dT = Vref/(2^n*G*S)', tex: '\\Delta T_{\\text{LSB}} = \\frac{V_{\\text{ref}}}{2^n\\,G\\,S}',
      vars: {
        dT: { name: 'temperature per ADC step', q: 'dtemp', unit: 'K', tex: '\\Delta T_{\\text{LSB}}' },
        Vref: { name: 'ADC reference', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{ref}}' },
        n: { name: 'ADC bits', q: 'count', value: 12, int: true },
        G: { name: 'amplifier gain', q: 'none', value: 180 },
        S: { name: 'Seebeck coefficient', unit: 'V/K', value: 4.1e-5 }
      },
      practice: { unknowns: ['dT', 'G'] }
    }
  ],
  examples: [
    {
      title: 'Why the cold junction matters',
      q: 'A millivoltmeter connected directly to a type K thermocouple reads 8.138 mV. The meter\'s terminals are at 25 °C. How hot is the tip?',
      steps: [
        'Read naively from the table (which assumes terminals at 0 °C), 8.138 mV is 200 °C — wrong.',
        'The table gives 1.000 mV for 25 °C. Add it: $8.138 + 1.000 = 9.138$ mV, as if referred to 0 °C.',
        'From the table, 200 °C is 8.138 mV and 250 °C is 10.153 mV; interpolating, 9.138 mV is about 225 °C.',
        'The quick linear estimate, $25 + 8.138\\ \\mathrm{mV}/41\\ \\mu\\mathrm{V/K} = 223$ °C, is close but not exact.'
      ],
      a: 'About 225 °C — 25 °C more than the uncompensated reading.'
    },
    {
      title: 'A type K channel for a 12-bit ADC',
      q: 'Measure 0–400 °C with a type K thermocouple into a 12-bit, 3.3 V ADC. Choose the gain and find the resolution.',
      steps: [
        'Largest signal: with the terminals possibly as cold as 0 °C, 400 °C gives 16.4 mV (tables).',
        'Gain for about 3.0 V at most: $3.0/0.0164 = 183$; take 180.',
        {text: 'Resolution:', tex: '\\Delta T = \\frac{3.3}{4096 \\times 180 \\times 41\\times10^{-6}} = 0.11\\ \\mathrm{K}'},
        'That is twenty times finer than the ±2.2 K accuracy of standard wire: the sensor, not the electronics, limits the result. The amplifier\'s offset must stay below a few microvolts, or be calibrated out.'
      ],
      a: 'A gain of about 180; 0.11 K per ADC step.'
    }
  ],
  quiz: [
    { q: 'A thermocouple is extended to the instrument with ordinary copper cable. What goes wrong?', choices: ['Nothing — copper conducts better', 'The cold junction moves to the copper joint, whose temperature is unknown', 'The signal doubles', 'The thermocouple becomes a type T'], a: 1,
      why: 'Wherever the thermocouple metals meet copper, that is the reference junction. Its temperature is no longer the one the instrument measures and compensates.' },
    { q: 'A thermocouple, on its own, measures…', choices: ['the temperature of its tip', 'the difference between its tip and its terminals', 'the heat flow along it', 'the ambient temperature'], a: 1,
      why: 'The voltage depends on the temperatures at both ends; the instrument must know the terminal temperature to find the tip\'s.' },
    { q: 'With its terminals at 0 °C, a type K thermocouple at 100 °C gives about…', choices: ['41 mV', '4.1 mV', '0.41 V', '41 µV'], a: 1,
      why: '41 µV/K × 100 K = 4.1 mV (the table gives 4.096 mV).' },
    { q: 'Cold-junction compensation can be done exactly by adding the terminal temperature, in degrees, to the temperature computed from the voltage.', a: false,
      why: 'The sensitivity varies with temperature, so the correct way is to add the voltages, then convert once. Adding degrees is an approximation that is good only where the sensitivity is nearly constant.' },
    { q: 'Which sensor would you choose for a heat-treatment furnace at 1000 °C?', choices: ['a 10 kΩ NTC thermistor', 'a Pt100', 'a type K or N thermocouple', 'a silicon temperature IC'], a: 2,
      why: 'Thermistors and silicon sensors stop well below that, and most RTDs around 600 °C; K and N thermocouples work continuously near 1000–1200 °C.' }
  ],
  applications: ['Furnaces, kilns and heat-treatment ovens.', 'Exhaust-gas and turbine temperatures in engines.', 'Hot-ends of high-temperature 3D printers and soldering stations.', 'Multi-point temperature logging on test rigs.']
},

{
  id: 'strain-gauges', parent: 'sensors', title: 'Strain gauges and load cells', level: 2,
  short: 'A strain gauge is a foil resistor bonded to a part: stretch the part and the gauge\'s resistance rises by about twice the strain. Wired into a Wheatstone bridge and amplified, gauges weigh, measure force and watch structures.',
  keywords: ['strain gauge', 'gauge factor', 'microstrain', 'µε', 'Wheatstone bridge', 'quarter bridge', 'half bridge', 'full bridge', 'load cell', 'mV/V', 'HX711', 'bridge excitation', 'temperature compensation', 'dummy gauge'],
  prereq: ['wheatstone-bridge', 'physics:stress-strain', 'instrumentation-amplifier'],
  related: ['sensor-interfacing', 'adc', 'physics:hookes-law', 'thermistors-rtd'],
  body: `
Stretch a wire and it grows longer and thinner, so its resistance rises. A **strain gauge** is a thin metal-foil grid (usually constantan, a copper–nickel alloy) on a plastic backing, glued to the surface of a part. When the part strains, the gauge strains with it, and

$$\\frac{\\Delta R}{R} = \\text{GF}\\cdot\\varepsilon$$

where $\\varepsilon = \\Delta L/L$ is the strain and the **gauge factor** GF is about 2.0–2.1 for foil gauges. Strain is tiny: engineers count it in **microstrain** (µε, parts per million). Steel near its yield point is strained 1000–2000 µε, and by Hooke's law, $\\sigma = E\\varepsilon$ ([[physics:stress-strain|stress and strain]]), 500 µε in steel ($E \\approx 200$ GPa) means 100 MPa of stress. A 350 Ω gauge at 1000 µε changes by only 0.7 Ω: 0.2 %.

### The bridge
Measured directly, that 0.2 % would drown in the gauge's own 350 Ω. The [[wheatstone-bridge|Wheatstone bridge]] subtracts the part that does not change: four arms, excited by a voltage $V_\\text{ex}$, with the output taken between the two mid-points. Balanced, it gives zero; a small change in the arms gives

$$V_o = \\frac{N\\,V_\\text{ex}\\,\\text{GF}\\,\\varepsilon}{4}$$

where $N$ counts the active arms, placed so that their signals add:
- **Quarter bridge** ($N$ = 1): one gauge, three fixed resistors. Simple, but the gauge's own temperature drift reads as false strain.
- **Half bridge** ($N$ = 2): two gauges, for instance one on top and one underneath a bending beam, one in tension and one in compression. The signal doubles, and temperature, which changes both gauges alike, cancels.
- **Full bridge** ($N$ = 4): four active gauges — four times the signal, temperature compensated. This is what sits inside every **load cell**.

The numbers stay small: a quarter bridge at 5 V and 500 µε gives 1.25 mV, riding on a common-mode voltage of half the excitation, 2.5 V. So the bridge feeds an [[instrumentation-amplifier|instrumentation amplifier]] (INA125, INA333, AD623 and their relatives), whose high common-mode rejection ignores the 2.5 V and amplifies only the difference — or a bridge ADC with a built-in programmable-gain amplifier: the HX711 in countless kitchen scales has a gain of 128 and 24-bit resolution.

### Load cells
A load cell is a machined aluminium or steel element with a full bridge bonded where the strain is largest and most linear. Its sensitivity is its **rated output in mV/V** — millivolts of output per volt of excitation at full load, typically 1–3 mV/V. A 2 mV/V, 20 kg cell excited at 5 V gives 10 mV at 20 kg: 0.5 µV per gram. Measure **ratiometrically**: supply the bridge and the ADC reference from the same voltage, so that excitation changes cancel.

### Practical gauging
- **Temperature**: self-temperature-compensated gauges are matched to the expansion of steel (about 11 ppm/K) or aluminium (about 23 ppm/K). On the wrong metal, or in a quarter bridge, a few kelvin of warming reads as tens of microstrain.
- **Lead wires**: in a quarter bridge the lead resistance sits in the active arm and drifts with temperature; a three-wire connection moves one lead into the neighbouring arm, where it cancels.
- **Bonding**: most gauge failures are bonding failures. Clean, abrade, degrease, and use the adhesive the gauge maker specifies.
- **Excitation**: more voltage gives more signal but heats the gauges — in a bridge excited at 5 V, each 350 Ω gauge sees 2.5 V and dissipates 18 mW. Between 2.5 and 10 V is usual.
- **Creep and drift**: adhesives and cells creep under a steady load; good load cells specify creep over 30 minutes.
`,
  ideas: [
    'ΔR/R = GF·ε with GF ≈ 2: strains of hundreds of microstrain change a gauge by a fraction of a percent.',
    'A Wheatstone bridge turns tiny resistance changes into a differential voltage around zero.',
    'More active arms (half, full bridge) multiply the signal and cancel temperature effects.',
    'Load cells are rated in mV/V: output per volt of excitation at full load.',
    'Amplify with an instrumentation amplifier or a bridge ADC, and measure ratiometrically.'
  ],
  pitfalls: [
    'Any op-amp can amplify a bridge — The millivolt signal sits on half the excitation voltage; you need the common-mode rejection and high input impedance of an instrumentation amplifier.',
    'A quarter bridge is temperature-stable if the gauge is — Lead resistance and the gauge–material mismatch still drift; half and full bridges cancel what affects all gauges alike.',
    'More excitation is always better — It raises the signal but also the gauges\' self-heating, which causes drift.'
  ],
  formulas: [
    {
      name: 'Resistance change of a gauge',
      expr: 'dR = R*GF*eps', tex: '\\Delta R = R\\,\\text{GF}\\,\\varepsilon',
      vars: {
        dR: { name: 'resistance change', q: 'resistance', unit: 'mΩ', signed: true, tex: '\\Delta R' },
        R: { name: 'gauge resistance', q: 'resistance', unit: 'Ω', value: 350 },
        GF: { name: 'gauge factor', q: 'none', value: 2.0, tex: '\\text{GF}' },
        eps: { name: 'strain', q: 'strain', unit: 'µε', value: 1000, signed: true, tex: '\\varepsilon' }
      },
      practice: { unknowns: ['dR', 'eps'] },
      stories: { dR: 'A {R} gauge with a gauge factor of {GF} is strained by {eps}. By how much does its resistance change?' }
    },
    {
      name: 'Bridge output',
      expr: 'Vo = N*Vex*GF*eps/4', tex: 'V_o = \\frac{N\\,V_{\\text{ex}}\\,\\text{GF}\\,\\varepsilon}{4}',
      vars: {
        Vo: { name: 'bridge output', q: 'voltage', unit: 'mV', signed: true, tex: 'V_o' },
        N: { name: 'number of active arms (1, 2 or 4)', q: 'count', value: 1, int: true, min: 1, max: 4 },
        Vex: { name: 'excitation voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{ex}}' },
        GF: { name: 'gauge factor', q: 'none', value: 2.0, tex: '\\text{GF}' },
        eps: { name: 'strain', q: 'strain', unit: 'µε', value: 500, signed: true, tex: '\\varepsilon' }
      },
      note: 'Small-strain approximation; a quarter bridge is also slightly nonlinear (about 0.1 % at 1000 µε).',
      practice: { unknowns: ['Vo', 'eps'] },
      stories: {
        Vo: 'A bridge with {N} active arm(s), gauge factor {GF}, is excited at {Vex} and strained by {eps}. What does it output?',
        eps: 'A bridge with {N} active arm(s) (GF = {GF}) excited at {Vex} outputs {Vo}. What is the strain?'
      }
    },
    {
      name: 'Load-cell output',
      expr: 'Vo = 0.001*S*Vex*m/mmax', tex: 'V_o = S\\,V_{\\text{ex}}\\,\\frac{m}{m_{\\max}}',
      vars: {
        Vo: { name: 'output', q: 'voltage', unit: 'mV', tex: 'V_o' },
        S: { name: 'rated output (millivolts per volt at full load)', unit: 'mV/V', value: 2 },
        Vex: { name: 'excitation voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{ex}}' },
        m: { name: 'load', q: 'mass', unit: 'kg', value: 10 },
        mmax: { name: 'rated capacity', q: 'mass', unit: 'kg', value: 20, tex: 'm_{\\max}' }
      },
      note: 'With the output in millivolts and S in mV/V the formula reads directly; the calculator converts to volts internally.',
      practice: { unknowns: ['Vo', 'm'] },
      stories: { m: 'A {mmax} load cell rated {S} is excited at {Vex} and outputs {Vo}. What load is on it?' }
    },
    {
      name: 'Stress from measured strain',
      expr: 'sigma = E*eps', tex: '\\sigma = E\\,\\varepsilon',
      vars: {
        sigma: { name: 'stress', q: 'stress', unit: 'MPa', signed: true, tex: '\\sigma' },
        E: { name: 'Young\'s modulus (steel ≈ 200 GPa, aluminium ≈ 70 GPa)', q: 'stress', unit: 'GPa', value: 200 },
        eps: { name: 'strain', q: 'strain', unit: 'µε', value: 500, signed: true, tex: '\\varepsilon' }
      },
      note: 'For uniaxial stress in the elastic range. With strain in two directions, use a rosette and the plane-stress equations.',
      stories: { sigma: 'A gauge on a steel member ({E}) reads {eps}. What is the stress?' }
    }
  ],
  examples: [
    {
      title: 'A gauge on a steel tie rod',
      q: 'A quarter bridge with a 350 Ω gauge (GF = 2.0) on a steel tie rod, excited at 5 V, reads 1.25 mV. What are the strain and the stress, and what gain brings the signal to 0.25 V?',
      steps: [
        {text: 'Strain:', tex: '\\varepsilon = \\frac{4 V_o}{V_{\\text{ex}}\\,\\text{GF}} = \\frac{4 \\times 1.25\\times10^{-3}}{5 \\times 2.0} = 500\\ \\mu\\varepsilon'},
        'Stress: $200\\ \\mathrm{GPa} \\times 500\\times10^{-6} = 100$ MPa — about a third of the yield strength of mild steel.',
        'Gain for 0.25 V: $0.25/1.25\\times10^{-3} = 200$. With a three-op-amp in-amp ($G = 1 + 49.4\\ \\mathrm{k\\Omega}/R_G$), $R_G = 49.4\\ \\mathrm{k}/199 = 248\\ \\Omega$.'
      ],
      a: '500 µε, 100 MPa; a gain of 200 (R_G ≈ 248 Ω).'
    },
    {
      title: 'Resolution of a kitchen scale',
      q: 'A 5 kg single-point load cell rated 1.0 mV/V is excited at 5 V and read by a bridge ADC with a gain of 128. What signal does 1 g produce at the cell, and after the gain?',
      steps: [
        'Full scale: $1.0\\ \\mathrm{mV/V} \\times 5\\ \\mathrm{V} = 5$ mV for 5 kg.',
        'One gram: $5\\ \\mathrm{mV}/5000 = 1\\ \\mu\\mathrm{V}$.',
        'After a gain of 128: 128 µV per gram at the converter\'s input.',
        'The 24-bit converter\'s steps are far finer than that; in practice its noise, of the order of 0.1 µV at the input, and the cell\'s creep and temperature drift set the useful resolution — a few tenths of a gram, plus averaging.'
      ],
      a: '1 µV per gram at the cell; 128 µV per gram after the gain.'
    },
    {
      title: 'A quarter bridge in the sun',
      q: 'A quarter bridge uses a gauge whose apparent strain on this material is 10 µε per kelvin. The part warms by 10 K. What stress error does that mean on steel?',
      steps: [
        'Apparent strain: $10 \\times 10 = 100\\ \\mu\\varepsilon$.',
        'As stress: $200\\ \\mathrm{GPa} \\times 100\\times10^{-6} = 20$ MPa of error — from sunshine alone.',
        'A half bridge with the second gauge on the other side of the beam, or an unstrained dummy gauge on the same material nearby, cancels it.'
      ],
      a: '100 µε of false strain: about 20 MPa on steel.'
    }
  ],
  quiz: [
    { q: 'A foil gauge (GF = 2) sees 1000 µε. Its resistance changes by…', choices: ['2 %', '0.2 %', '0.02 %', '20 %'], a: 1,
      why: 'ΔR/R = 2 × 1000 × 10⁻⁶ = 0.002 = 0.2 %.' },
    { q: 'Gauges on the top and bottom of a bending beam are wired as a half bridge. Compared with a quarter bridge, the output…', choices: ['halves and drifts more', 'doubles and temperature effects cancel', 'is the same but quieter', 'doubles and drifts twice as much'], a: 1,
      why: 'One gauge is in tension and one in compression, so their signals add; temperature changes both alike and cancels.' },
    { q: 'A 2 mV/V load cell excited at 10 V gives, at full load…', choices: ['2 mV', '10 mV', '20 mV', '200 mV'], a: 2,
      why: '2 mV per volt × 10 V = 20 mV.' },
    { q: 'What does a quarter bridge (GF = 2.1, 5 V excitation) output at 800 µε?', answer: 2.1, unit: 'mV',
      why: '5 × 2.1 × 800 × 10⁻⁶ / 4 = 2.1 mV.' },
    { q: 'Why is a bridge usually amplified with an instrumentation amplifier rather than a single op-amp stage?', choices: ['It is cheaper', 'The millivolt difference sits on about half the excitation voltage, which must be rejected without loading the bridge', 'Op-amps cannot amplify millivolts', 'It gives a negative output'], a: 1,
      why: 'An in-amp has high input impedance on both inputs and high common-mode rejection, so it amplifies only the difference between the bridge mid-points.' }
  ],
  applications: ['Weighing scales, hoppers and force sensors (load cells).', 'Structural tests on bridges, aircraft and machine frames.', 'Torque sensing on shafts and in robot joints.', 'Pressure sensors built on a strain-gauged diaphragm.'],
  sim: 'cp-strain-bridge'
},

{
  id: 'hall-sensors', parent: 'sensors', title: 'Hall-effect sensors', level: 2,
  short: 'A Hall-effect sensor turns a magnetic field into a voltage. Packaged with an amplifier, it becomes a contactless switch, a linear field sensor, an angle encoder or an isolated current sensor.',
  keywords: ['Hall effect', 'Hall sensor', 'Hall switch', 'latch', 'linear Hall sensor', 'ratiometric', 'current sensor', 'magnetic encoder', 'BLDC commutation', 'gauss', 'millitesla', 'magnet', 'proximity sensor', 'open drain', 'neodymium magnet'],
  prereq: ['physics:hall-effect', 'physics:magnetic-field', 'pull-resistors'],
  related: ['sensor-interfacing', 'dc-motor-control', 'adc', 'comparators', 'schmitt-trigger'],
  body: `
Pass a current through a thin plate of semiconductor in a magnetic field, and the moving charges are pushed sideways by the magnetic force and pile up on one edge. A voltage appears across the plate, at right angles to both the current and the field — the [[physics:hall-effect|Hall effect]]:

$$V_H = \\frac{I B}{n q t}$$

with $n$ the density of charge carriers, $q$ their charge and $t$ the plate's thickness. Semiconductors are used because $n$ is small; even so, a doped silicon plate with 1 mA and 10 mT gives well under a millivolt. That is too little to use directly, so practical Hall sensors are integrated circuits: a Hall plate, a bias current source, an amplifier, offset cancellation ("chopper stabilisation") and an output stage, in a three-pin package.

### Kinds of Hall sensor
- **Switches** give a digital output when the field passes an operate point $B_{OP}$ (a few millitesla) and release at a lower point $B_{RP}$. The built-in hysteresis, as in a [[schmitt-trigger|Schmitt trigger]], gives one clean edge even for a slowly approaching magnet — and no contact bounce. **Unipolar** switches respond to one pole, **omnipolar** ones to either, and **latches** turn on at one pole and off only at the opposite pole, which suits rotating multi-pole magnets such as brushless-motor rotors. Most outputs are **open-drain**: they pull the line low and need a [[pull-resistors|pull-up resistor]].
- **Linear (ratiometric) sensors** give an analogue voltage proportional to the field, centred on half the supply at zero field, $V_\\text{out} = V_q + S\\,B$, with sensitivities of tens of millivolts per millitesla. Offset and sensitivity scale with the supply, so read them with an ADC referenced to that same supply.
- **Angle sensors** (magnetic encoders) place several Hall plates under a diametrically magnetised magnet on the end of a shaft and report the angle directly, typically to 12–14 bits: robust, contactless absolute encoders.
- **Current sensors** place a Hall element in the field of the current itself — in the gap of a ferrite ring around a busbar, or over a copper path inside the package. The output is again centred on half the supply, for example 100 mV/A for a ±20 A part, with the load current galvanically isolated from the electronics. **Closed-loop** transducers add a winding that nulls the field in the core, for better accuracy and bandwidth.

### Magnets and distances
The field of a small magnet falls off steeply. On the axis of a cylindrical magnet with remanence $B_r$, radius $R$ and length $D$, at a distance $z$ from its face,

$$B = \\frac{B_r}{2}\\left(\\frac{D + z}{\\sqrt{R^2 + (D+z)^2}} - \\frac{z}{\\sqrt{R^2 + z^2}}\\right)$$

and far away it falls roughly as $1/z^3$. A 6 mm × 3 mm neodymium disc (grade N42, $B_r \\approx 1.3$ T) gives about 50 mT at 5 mm but only about 11 mT at 10 mm. Mechanical tolerances on the air gap therefore matter as much as the sensor's own: design so that the field at the switching position is comfortably above the largest $B_{OP}$ over the whole tolerance range, and comfortably below the smallest $B_{RP}$ when the magnet has moved away. The Earth's field, about 0.05 mT, is negligible for switches but not for sensitive linear measurements.

### Where they are used
Contactless limit and home switches on machines (no wear, no bounce), brushless-motor commutation and speed sensing, gear-tooth sensors (a back-biased sensor sees the field change as each tooth passes), lid and door detection in phones and laptops, joysticks and throttle position, and isolated current measurement in motor drives, inverters and chargers.
`,
  ideas: [
    'A current in a thin semiconductor plate in a field gives a transverse voltage V_H = IB/(nqt); integrated sensors amplify it.',
    'Hall switches have built-in hysteresis and open-drain outputs; latches suit rotating multi-pole magnets.',
    'Linear sensors are ratiometric: V_out = V_cc/2 + S·B, best read against the same supply.',
    'Hall current sensors measure a current through its magnetic field, with galvanic isolation.',
    'A magnet\'s field falls steeply with distance, so air-gap tolerances dominate the design.'
  ],
  pitfalls: [
    'A Hall switch output drives the input high by itself — Most outputs are open-drain and only pull low; fit a pull-up resistor.',
    'Twice the distance means half the field — Near a small magnet the field falls much faster, roughly as 1/z³ far away: twice the distance gives about an eighth.',
    'A linear Hall sensor reads the same whatever its supply — Its zero point and sensitivity scale with the supply; measure against the same supply or a stable one.'
  ],
  formulas: [
    {
      name: 'Hall voltage in a plate',
      expr: 'VH = I*B/(n*qe*t)', tex: 'V_H = \\frac{I B}{n\\,e\\,t}',
      vars: {
        VH: { name: 'Hall voltage', q: 'voltage', unit: 'mV', tex: 'V_H' },
        I: { name: 'bias current', q: 'current', unit: 'mA', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 10 },
        n: { name: 'carrier density', q: 'numberdensity', unit: '1/m³', value: 1e22 },
        qe: { const: 'qe' },
        t: { name: 'plate thickness', q: 'length', unit: 'µm', value: 10 }
      },
      note: 'Metals have n ≈ 10²⁸ m⁻³ and a Hall voltage a million times smaller; lightly doped semiconductors are used for sensors.',
      practice: { unknowns: ['VH', 'B'] },
      stories: { VH: 'A silicon Hall plate {t} thick, with {n} carriers, carries {I} in a field of {B}. What is the Hall voltage?' }
    },
    {
      name: 'Linear (ratiometric) Hall sensor',
      expr: 'Vout = Vq + S*B', tex: 'V_{\\text{out}} = V_q + S\\,B',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vq: { name: 'quiescent output (zero field)', q: 'voltage', unit: 'V', value: 2.5, tex: 'V_q' },
        S: { name: 'sensitivity', unit: 'mV/mT', value: 50 },
        B: { name: 'magnetic field (sign = pole)', q: 'bfield', unit: 'mT', value: 20, signed: true }
      },
      note: 'Millivolts per millitesla are the same as volts per tesla, so the sensitivity enters the formula unchanged. Output saturates near the rails.',
      practice: { unknowns: ['Vout', 'B'] },
      stories: { B: 'A linear Hall sensor ({S}, {Vq} at zero field) outputs {Vout}. What field does it see?' }
    },
    {
      name: 'Hall current sensor',
      expr: 'Vout = Vq + S*I', tex: 'V_{\\text{out}} = V_q + S\\,I',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vq: { name: 'output at zero current', q: 'voltage', unit: 'V', value: 2.5, tex: 'V_q' },
        S: { name: 'sensitivity', unit: 'V/A', value: 0.1 },
        I: { name: 'measured current (signed)', q: 'current', unit: 'A', value: 12, signed: true }
      },
      practice: { unknowns: ['I', 'Vout'] },
      stories: { I: 'A Hall current sensor with {S} and {Vq} at zero current outputs {Vout}. What current flows?' }
    },
    {
      name: 'Field on the axis of a cylindrical magnet',
      expr: 'B = Br/2*((D + z)/sqrt(R^2 + (D + z)^2) - z/sqrt(R^2 + z^2))',
      tex: 'B = \\frac{B_r}{2}\\left(\\frac{D + z}{\\sqrt{R^2 + (D+z)^2}} - \\frac{z}{\\sqrt{R^2 + z^2}}\\right)',
      vars: {
        B: { name: 'field at the sensor', q: 'bfield', unit: 'mT' },
        Br: { name: 'remanence of the magnet (N42 ≈ 1.3 T)', q: 'bfield', unit: 'T', value: 1.3, tex: 'B_r' },
        D: { name: 'magnet length (thickness)', q: 'length', unit: 'mm', value: 3 },
        R: { name: 'magnet radius', q: 'length', unit: 'mm', value: 3 },
        z: { name: 'distance from the magnet\'s face', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'For a uniformly magnetised cylinder, on its axis. Off-axis, and with steel nearby, the field differs — measure it.',
      practice: { unknowns: ['B', 'z'] },
      stories: {
        B: 'A neodymium disc ({Br}) of radius {R} and thickness {D} sits {z} from a Hall sensor, on its axis. What field does the sensor see?',
        z: 'How close must a disc magnet ({Br}, radius {R}, thickness {D}) come to give {B} on its axis?'
      }
    }
  ],
  examples: [
    {
      title: 'A contactless end stop',
      q: 'A Hall switch operates at no more than 10 mT and releases at no less than 1 mT. It is triggered by a 6 mm × 3 mm N42 disc magnet on its axis. At what distances is it guaranteed to switch on, and to switch off?',
      steps: [
        'With $B_r = 1.3$ T, $R = 3$ mm, $D = 3$ mm: at 8 mm, $B = 0.65 \\times (11/\\sqrt{130} - 8/\\sqrt{73}) = 0.65 \\times 0.0284 = 18.5$ mT.',
        'At 10 mm the field is about 10.8 mT — barely above the worst-case 10 mT operate point. So design for the magnet to come within about 8 mm, where there is margin.',
        'Release: at 20 mm, $B \\approx 1.7$ mT; at 25 mm, $B \\approx 0.9$ mT. The magnet must retreat to about 25 mm to guarantee release.',
        'The hysteresis gives a clean, bounce-free edge, and nothing wears out — unlike a mechanical limit switch.'
      ],
      a: 'On within about 8 mm; off beyond about 25 mm.'
    },
    {
      title: 'Reading a Hall current sensor',
      q: 'A ±20 A Hall current sensor (100 mV/A, 2.5 V at zero) feeds a 10-bit ADC with a 5 V reference. The ADC reads 757. What is the current, and what is one ADC step worth?',
      steps: [
        'Voltage: $757/1024 \\times 5 = 3.696$ V.',
        'Current: $(3.696 - 2.5)/0.1 = 12.0$ A.',
        'One step is $5/1024 = 4.88$ mV, which is $4.88/100 = 0.049$ A: about 49 mA per step.',
        'Since the sensor is ratiometric, supplying it from the same 5 V as the ADC reference cancels supply variations.'
      ],
      a: '12.0 A; about 49 mA per ADC step.'
    }
  ],
  quiz: [
    { q: 'A Hall switch\'s output never goes high, though the sensor clearly switches. What is most likely missing?', choices: ['a bypass capacitor', 'a pull-up resistor on the open-drain output', 'a magnet of the other pole', 'a Schmitt trigger'], a: 1,
      why: 'Most Hall switches have open-drain outputs: they can only pull low. Without a pull-up the line just floats.' },
    { q: 'Which device suits commutation of a brushless motor with a multi-pole ring magnet?', choices: ['a unipolar switch', 'an omnipolar switch', 'a latch', 'a linear sensor with a comparator set at zero'], a: 2,
      why: 'A latch turns on at a north pole and off only at a south pole, so its output follows the alternating poles of the rotor.' },
    { q: 'Far from a small magnet, doubling the distance makes the field about…', choices: ['half as strong', 'a quarter as strong', 'an eighth as strong', 'unchanged'], a: 2,
      why: 'A small magnet is a dipole: its far field falls as 1/z³, and 2³ = 8.' },
    { q: 'A ratiometric linear Hall sensor, read by an ADC referenced to the sensor\'s own supply, is largely insensitive to changes of that supply.', a: true,
      why: 'Both the zero point and the sensitivity scale with the supply, and the ADC measures relative to the same voltage, so the ratio stays put.' },
    { q: 'A linear Hall sensor with 50 mV/mT and 2.5 V at zero field reads 1.9 V. What is the field?', answer: -12, unit: 'mT',
      why: '(1.9 − 2.5)/0.05 = −12 mT: 12 mT of the opposite pole.' }
  ],
  applications: ['Brushless-motor commutation and speed sensing.', 'Contactless limit and home switches on machines.', 'Isolated current measurement in chargers, inverters and motor drives.', 'Absolute shaft-angle encoders, joysticks and lid detection.']
},

{
  id: 'sensor-interfacing', parent: 'sensors', title: 'Signal conditioning for sensors', level: 3,
  short: 'Getting a sensor\'s signal into an ADC intact: excite the sensor, match its range to the converter, filter the noise, protect the input, then calibrate what remains.',
  keywords: ['signal conditioning', 'sensor interface', 'ratiometric', 'anti-aliasing filter', 'instrumentation amplifier', '4–20 mA', 'current loop', 'calibration', 'two-point calibration', 'averaging', 'ADC input', 'source impedance', 'offset and gain', 'input protection'],
  prereq: ['adc', 'instrumentation-amplifier', 'voltage-divider', 'rc-low-pass'],
  related: ['thermistors-rtd', 'strain-gauges', 'thermocouples', 'hall-sensors', 'noise-snr', 'sampling-nyquist'],
  body: `
A sensor produces a signal in its own terms — ohms, millivolts, milliamps, microvolts riding on volts of common mode. An ADC wants a clean, low-impedance voltage spanning most of its input range. **Signal conditioning** is everything in between, and a good chain follows the same steps whatever the sensor:

1. **Excite** the sensor if it is passive: a current for an RTD, a voltage for a bridge or a divider.
2. **Amplify and shift** the signal so that its range fills the ADC's range.
3. **Filter** out noise, and everything above half the sampling rate.
4. **Protect** the input from overvoltage and static.
5. **Digitise**, then **calibrate** and **linearise** in software.

### Matching the range
If the sensor gives $V_\\text{min}$ to $V_\\text{max}$ and the ADC accepts 0 to $V_\\text{FS}$, the conditioning needs a gain

$$G = \\frac{V_\\text{FS}}{V_\\text{max} - V_\\text{min}}$$

and an offset that puts $V_\\text{min}$ near zero — keeping 5–10 % of margin at each end for tolerances. A 12-bit ADC has 4096 steps; a signal spanning only a tenth of the range throws away more than three bits. Small differential signals — bridges, current shunts, thermocouples — go through an [[instrumentation-amplifier|instrumentation amplifier]], whose gain is set by a single resistor (for the classic three-op-amp parts $G = 1 + 49.4\\ \\mathrm{k\\Omega}/R_G$) and which rejects the common-mode voltage. Many modern ADCs include a programmable-gain amplifier and accept a bridge directly.

### Ratiometric measurement
Where a sensor's output is proportional to its supply — dividers, potentiometers, bridges, ratiometric Hall sensors — power it from the voltage that is also the ADC's reference. The ADC measures a ratio, $V_\\text{in}/V_\\text{ref}$, so the supply cancels: a 1 % drift of the 3.3 V rail costs nothing. Supply the sensor from one rail and the reference from another, and every wobble of either becomes a measurement error.

### What the ADC input needs
A SAR converter, the kind inside most microcontrollers, charges a small sampling capacitor (a few picofarads) from the input during a short acquisition time. A high source impedance cannot charge it in time, and the reading comes out low and depends on the channel read before. Keep the source impedance low (often below about 10 kΩ — check the datasheet), put a capacitor of a few nanofarads or more directly on the pin to supply the charge, or buffer the signal with an op-amp ([[voltage-follower]]).

### Noise and filtering
- Put an **anti-aliasing low-pass filter** in front of the ADC ([[rc-low-pass]], or an active filter for a sharper cut), with its corner well below half the sampling rate ([[sampling-nyquist]]). Otherwise noise above that frequency folds down into the band you are measuring.
- **Average**: $N$ samples of random noise average to $1/\\sqrt{N}$ of one sample's noise; sixteen samples quarter it.
- Use **twisted pairs**, shields grounded at one end, differential inputs and short, direct return paths; keep sensor cables away from motor and mains wiring.
- For long industrial runs, send **current** instead of voltage: the **4–20 mA loop** carries the signal as a current that wire resistance and induced voltages cannot change. The receiver reads it across a precision resistor — 250 Ω gives 1–5 V — and the "live zero" of 4 mA tells a genuine zero reading from a broken wire (0 mA).

### Protection
Inputs that leave the board need a series resistor and clamp diodes (or a TVS) to the rails, so that a wiring mistake or an electrostatic discharge dumps its current into the supply rather than through the converter. Where ground loops or dangerous voltages are possible, use an **isolated** amplifier or a digital isolator.

### Calibration
Every real chain has an offset error and a gain error. A **two-point calibration** measures two known inputs — zero load and a reference weight, an ice bath and a known hot point — and fits a straight line through them; anything nonlinear (thermistors, thermocouples) is then corrected with an equation or a table. Keep three words apart: **resolution** is the smallest step you can see, **precision** is how repeatable the readings are, and **accuracy** is how close they are to the truth. A 24-bit converter behind an uncalibrated sensor is precise, not accurate.
`,
  ideas: [
    'Condition the signal so it fills the ADC\'s range: gain from the span, offset from the minimum.',
    'Ratiometric measurement makes supply variations cancel.',
    'SAR ADC inputs need a low source impedance, a capacitor on the pin, or a buffer.',
    'Filter below half the sampling rate before the ADC; average to reduce random noise by √N.',
    'A 4–20 mA loop survives long wires and reveals a broken one; calibrate offset and gain at two points.'
  ],
  pitfalls: [
    'More ADC bits mean a more accurate measurement — Bits give resolution. Accuracy comes from the sensor, the reference and calibration.',
    'Averaging removes any error — It reduces random noise only; offsets, gain errors and interference at a steady frequency stay.',
    'Any source can drive a microcontroller ADC pin — A high-impedance source cannot charge the sampling capacitor in time; buffer it or add a capacitor.'
  ],
  formulas: [
    {
      name: 'Gain needed to fill the ADC',
      expr: 'G = Vfs/(Vmax - Vmin)', tex: 'G = \\frac{V_{\\text{FS}}}{V_{\\max} - V_{\\min}}',
      vars: {
        G: { name: 'gain', q: 'none' },
        Vfs: { name: 'usable ADC input span', q: 'voltage', unit: 'V', value: 3, tex: 'V_{\\text{FS}}' },
        Vmax: { name: 'largest sensor signal', q: 'voltage', unit: 'mV', value: 5, signed: true, tex: 'V_{\\max}' },
        Vmin: { name: 'smallest sensor signal', q: 'voltage', unit: 'mV', value: -5, signed: true, tex: 'V_{\\min}' }
      },
      note: 'An offset of about $-G\\,V_{\\min}$ (plus a little margin) then shifts the bottom of the range to near zero.',
      practice: { unknowns: ['G', 'Vmax'] },
      stories: { G: 'A sensor swings from {Vmin} to {Vmax}. What gain makes it span {Vfs}?' }
    },
    {
      name: 'Gain of a three-op-amp instrumentation amplifier',
      expr: 'G = 1 + RK/RG', tex: 'G = 1 + \\frac{R_K}{R_G}',
      vars: {
        G: { name: 'gain', q: 'none' },
        RK: { name: 'internal gain constant (49.4 kΩ for AD620- and INA128-type parts)', q: 'resistance', unit: 'kΩ', value: 49.4, tex: 'R_K' },
        RG: { name: 'gain resistor', q: 'resistance', unit: 'Ω', value: 165, tex: 'R_G' }
      },
      note: 'R_K is twice the internal feedback resistor; read it from the datasheet of your part.',
      practice: { unknowns: ['G', 'RG'] },
      stories: { RG: 'An in-amp has a gain constant of {RK}. What gain resistor gives a gain of {G}?' }
    },
    {
      name: 'Size of one ADC step',
      expr: 'q = Vref/2^n', tex: 'q = \\frac{V_{\\text{ref}}}{2^n}',
      vars: {
        q: { name: 'one step (LSB)', q: 'voltage', unit: 'mV' },
        Vref: { name: 'reference voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{ref}}' },
        n: { name: 'number of bits', q: 'count', value: 12, int: true }
      },
      practice: { unknowns: ['q'] }
    },
    {
      name: 'Scaling a 4–20 mA signal',
      expr: 'p = pfs*(I - I0)/(I1 - I0)', tex: 'x = x_{\\text{FS}}\\,\\frac{I - I_0}{I_1 - I_0}',
      vars: {
        p: { name: 'measured value (here a pressure)', q: 'pressure', unit: 'bar', tex: 'x' },
        pfs: { name: 'full-scale value of the transmitter', q: 'pressure', unit: 'bar', value: 10, tex: 'x_{\\text{FS}}' },
        I: { name: 'loop current', q: 'current', unit: 'mA', value: 12 },
        I0: { name: 'current at zero (live zero)', q: 'current', unit: 'mA', value: 4, fixed: true, tex: 'I_0' },
        I1: { name: 'current at full scale', q: 'current', unit: 'mA', value: 20, fixed: true, tex: 'I_1' }
      },
      note: 'Below about 3.6 mA the loop is broken or the transmitter has failed; transmitters also signal faults by driving above about 21 mA.',
      practice: { unknowns: ['p', 'I'] },
      stories: { p: 'A 0–{pfs} pressure transmitter sends {I}. What is the pressure?', I: 'What current does a 0–{pfs} transmitter send at {p}?' }
    },
    {
      name: 'Noise reduction by averaging',
      expr: 'sn = s1/sqrt(N)', tex: '\\sigma_N = \\frac{\\sigma_1}{\\sqrt{N}}',
      vars: {
        sn: { name: 'noise of the average', q: 'voltage', unit: 'µV', tex: '\\sigma_N' },
        s1: { name: 'noise of one sample (RMS)', q: 'voltage', unit: 'µV', value: 40, tex: '\\sigma_1' },
        N: { name: 'number of samples averaged', q: 'count', value: 16, int: true }
      },
      note: 'Only for random, uncorrelated noise. See [[math:standard-deviation|standard deviation]].',
      practice: { unknowns: ['sn', 'N'] },
      stories: { N: 'Each reading has {s1} of random noise. How many readings must be averaged to get down to {sn}?' }
    }
  ],
  examples: [
    {
      title: 'A load cell into a 3.3 V microcontroller',
      q: 'A 20 kg load cell rated 2 mV/V is excited from the 3.3 V ADC reference and amplified by an instrumentation amplifier into a 12-bit ADC. Choose the gain resistor for about 3 V at full load and find the weight per ADC step.',
      steps: [
        'Full-scale signal: $2\\ \\mathrm{mV/V} \\times 3.3\\ \\mathrm{V} = 6.6$ mV.',
        'Gain: $3.0/0.0066 = 455$. With $G = 1 + 49.4\\ \\mathrm{k\\Omega}/R_G$: $R_G = 49.4\\ \\mathrm{k}/454 = 109\\ \\Omega$ → 110 Ω (E24) gives $G = 450$.',
        'One ADC step is $3.3/4096 = 0.806$ mV at the output, or $0.806/450 = 1.79\\ \\mu\\mathrm{V}$ at the cell.',
        'The cell gives 6.6 mV for 20 kg, so one step is $20\\ \\mathrm{kg} \\times 1.79/6600 = 5.4$ g. Averaging, and a reference offset so the output never touches 0 V, finish the job.'
      ],
      a: 'R_G = 110 Ω (G = 450): about 5 g per step.'
    },
    {
      title: 'Reading a 4–20 mA pressure transmitter',
      q: 'A 0–10 bar transmitter\'s loop runs through a 250 Ω resistor into an ADC. The ADC reads 3.20 V, and later 0.30 V. What do the readings mean?',
      steps: [
        'First reading: $I = 3.20/250 = 12.8$ mA.',
        'Pressure: $10 \\times (12.8 - 4)/16 = 5.5$ bar.',
        'Second reading: $0.30/250 = 1.2$ mA — below the 4 mA live zero, which no healthy transmitter sends.',
        'That is a fault: a broken wire, a failed transmitter or a lost supply. With a 0–10 V signal, a broken wire would simply have read as 0 bar.'
      ],
      a: '5.5 bar; then a loop fault (1.2 mA is below the live zero).'
    }
  ],
  quiz: [
    { q: 'A thermistor divider and a microcontroller ADC are both powered from the same 3.3 V rail, which drifts by 2 %. The temperature reading…', choices: ['drifts by 2 %', 'is unaffected, to first order', 'drifts by 4 %', 'drifts by 1 %'], a: 1,
      why: 'The divider output and the ADC reference both scale with the rail; the ADC measures their ratio, which does not change.' },
    { q: 'Averaging 100 readings reduces random noise by a factor of about…', choices: ['100', '50', '10', '2'], a: 2,
      why: 'Random noise falls as 1/√N: √100 = 10.' },
    { q: 'Why does an industrial transmitter use 4 mA, not 0 mA, for the bottom of its range?', choices: ['It improves resolution', 'So that a broken loop (0 mA) can be told apart from a zero reading, and to power the transmitter', 'Resistors cannot measure 0 mA', 'It is required by Ohm\'s law'], a: 1,
      why: 'The live zero makes wiring faults visible, and the 4 mA leaves enough current to power a two-wire transmitter from the loop itself.' },
    { q: 'A microcontroller ADC reads a 100 kΩ divider consistently low, and the error depends on which channel was read before. The best fix is…', choices: ['a higher reference', 'a capacitor on the pin or a buffer amplifier', 'more bits', 'a longer wire'], a: 1,
      why: 'The source cannot recharge the ADC\'s sampling capacitor during the short acquisition time. A local capacitor supplies the charge; a buffer provides a low impedance.' },
    { q: 'How large is one step of a 16-bit ADC with a 2.5 V reference?', answer: 38.1, unit: 'µV',
      why: '2.5/65 536 = 38.1 µV.' }
  ],
  applications: ['Weighing, pressure and force measurement with bridges and in-amps.', 'Temperature channels on microcontrollers, from NTCs to thermocouples.', 'Industrial 4–20 mA transmitters and PLC analogue inputs.', 'Data loggers and instrumented test rigs.'],
  sim: ['cp-strain-bridge', 'cp-thermistor']
}

);
