/* HYPER-ELECTRONICS · content/passive-components.js — resistors, potentiometers,
 * capacitors, inductors and transformers as they really are on the bench. */
Hyper.add(

{
  id: 'resistors', parent: 'passive-components', title: 'Resistors: values, tolerance and power', level: 1,
  short: 'A real resistor is chosen by four numbers, not one: its resistance, its tolerance, its power rating and its temperature coefficient. Getting all four right keeps a circuit accurate and cool.',
  keywords: ['resistor', 'colour code', 'color code', 'E12', 'E24', 'E96', 'tolerance', 'power rating', 'derating', 'SMD code', 'temperature coefficient', 'ppm/K', 'metal film', 'thick film', 'wirewound', '0805'],
  prereq: ['resistance-ohms-law', 'power-energy', 'physics:resistivity'],
  related: ['voltage-divider', 'potentiometers', 'heat-sinks', 'wire-sizing', 'leds'],
  body: `
A resistor is the simplest component in the drawer, and it is chosen by four numbers: its **resistance**, its **tolerance**, its **power rating** and its **temperature coefficient**. Get the ohms right and the rest wrong and the circuit still works on the desk — then drifts in a warm cabinet, or scorches the board a month later.

### What is inside
- **Metal film** (through-hole, often blue): a nickel–chromium film cut into a helix. ±1 % and 50 ppm/K are standard; the default for anything analogue.
- **Carbon film** (often beige): cheap, ±5 %, with a larger and negative temperature coefficient of a few hundred ppm/K.
- **Thick-film chip** (surface-mount 0402, 0603, 0805, 1206 …): printed resistive paste, ±1 % or ±5 %, about 100 ppm/K. Most resistors made today are these.
- **Thin-film chip**: ±0.1 % and 10–25 ppm/K, for precision dividers and references.
- **Wirewound**: resistance wire on a ceramic former, for watts to hundreds of watts and for current shunts. The winding is also an inductor, so it is a poor choice at high frequency.

### Standard values: the E-series
Resistors are not made in every value. The **E-series** spaces values evenly on a logarithmic scale: E12 has twelve values per decade, each about $10^{1/12} = 1.21$ times the last — 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2 — repeated in every decade (47 Ω, 470 Ω, 4.7 kΩ …). The spacing matches the tolerance: with ±10 % parts, neighbouring E12 values just about meet, so every resistance is covered by some part. E24 (±5 %) has 24 values per decade and E96 (±1 %) 96. The values form a [[math:geometric-series|geometric sequence]], which is why they look irregular.

### Reading the markings
Through-hole parts carry **colour bands**: two digits, a multiplier and a tolerance (four bands), or three digits, a multiplier and a tolerance (five bands, usual for 1 % parts). The digits run black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. As a multiplier gold means ×0.1 and silver ×0.01; as a tolerance, brown ±1 %, red ±2 %, gold ±5 %, silver ±10 %. So yellow–violet–red–gold is 47 × 100 = 4.7 kΩ ±5 %. Chip resistors print a code instead: "472" is 47 × 10² = 4.7 kΩ, "4701" is 470 × 10¹ = 4.7 kΩ (a 1 % part), and "4R7" is 4.7 Ω. When in doubt, measure — a [[multimeter]] settles it in a second.

### Power: the rating that burns boards
A resistor turns $P = I^2 R = V^2/R$ into heat. Its power rating is how much it can shed **at an ambient temperature of 70 °C** (a typical datasheet figure): about 0.125 W for an 0805 chip and 0.25 W for a small axial part. Above that ambient the allowed power falls in a straight line to zero at the element's maximum temperature, about 155 °C. The body runs hot even within its rating — a small ¼ W resistor at full power in a room at 25 °C reaches about 110 °C — hence the everyday rule:

> [!tip] Design for no more than **half** the rated power. It keeps the part, the board and neighbouring electrolytic capacitors cool, and makes everything last.

Two less obvious limits: a **maximum working voltage** (roughly 150 V for an 0805 chip and 200–250 V for a small axial part), which matters in mains dividers — split a high-voltage divider into several resistors in series — and **pulse** capability: a short surge of many times the rated power may be fine for a wirewound part and fatal for a thin film.

### Temperature coefficient
Resistance changes with temperature: $R = R_0(1 + \\alpha\\,\\Delta T)$, with $\\alpha$ quoted in ppm/K. A 100 ppm/K part warming by 40 K changes by 0.4 % — invisible in an LED circuit, a real error in a precision [[voltage-divider|divider]]. Where a ratio matters (dividers, amplifier gains), use resistors of the same type, side by side, so that they drift together and the ratio holds.
`,
  ideas: [
    'A resistor is specified by resistance, tolerance, power rating and temperature coefficient — all four matter.',
    'Standard values follow the E-series, spaced geometrically so that the tolerance bands of neighbouring values just meet.',
    'Power ratings are quoted at 70 °C ambient and fall to zero near 155 °C; design for at most half the rating.',
    'Colour bands give two or three digits, a multiplier and a tolerance; chip resistors print a three- or four-digit code.',
    'Matched resistors of one type drift together, so ratios are far more stable than absolute values.'
  ],
  pitfalls: [
    'A ¼ W resistor is fine as long as it dissipates less than ¼ W — Only up to 70 °C ambient, and even then it runs over 100 °C. Allow a factor of two, and derate further in a warm enclosure.',
    'Any resistance value can be bought — Stock values follow the E-series: a calculated 5 kΩ becomes 4.7 kΩ or 5.1 kΩ (E24), or 4.99 kΩ (E96). Check the circuit still works with the nearest value and its tolerance.',
    'A 1 % resistor stays within 1 % — Only at its reference temperature and when new; the temperature coefficient, soldering heat and ageing add to the tolerance.'
  ],
  formulas: [
    {
      name: 'Power dissipated in a resistor',
      expr: 'P = V^2/R', tex: 'P = \\frac{V^2}{R}',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W' },
        V: { name: 'voltage across the resistor', q: 'voltage', unit: 'V', value: 9 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 100 }
      },
      stories: {
        P: 'A {R} resistor is connected across {V}. How much power does it dissipate?',
        R: 'What is the smallest resistor you can put across {V} if it may dissipate no more than {P}?'
      }
    },
    {
      name: 'Power derating above the knee temperature',
      expr: 'Pmax = Prated*(Tmax - Ta)/(Tmax - Tk)', tex: 'P_{\\max} = P_{\\text{rated}}\\,\\frac{T_{\\max} - T_a}{T_{\\max} - T_k}',
      vars: {
        Pmax: { name: 'allowed power at this ambient', q: 'power', unit: 'W', tex: 'P_{\\max}' },
        Prated: { name: 'rated power', q: 'power', unit: 'W', value: 0.25, tex: 'P_{\\text{rated}}' },
        Tmax: { name: 'maximum element temperature', q: 'temperature', unit: '°C', value: 155, tex: 'T_{\\max}' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 100, tex: 'T_a' },
        Tk: { name: 'knee temperature (full rating up to here)', q: 'temperature', unit: '°C', value: 70, tex: 'T_k' }
      },
      note: 'Applies between the knee (usually 70 °C) and the maximum; below the knee the full rating applies. Some parts knee at 125 °C: read the datasheet.',
      practice: { unknowns: ['Pmax', 'Ta'] },
      stories: {
        Pmax: 'A resistor rated {Prated} (full rating up to {Tk}, zero at {Tmax}) works in a cabinet at {Ta}. What power may it dissipate?',
        Ta: 'A {Prated} resistor (full rating to {Tk}, zero at {Tmax}) must dissipate {Pmax}. What is the hottest ambient it can tolerate?'
      }
    },
    {
      name: 'Body temperature from the thermal resistance',
      expr: 'T = Ta + P*Rth', tex: 'T = T_a + P\\,R_{\\theta}',
      vars: {
        T: { name: 'body (hot-spot) temperature', q: 'temperature', unit: '°C' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_a' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 0.1 },
        Rth: { name: 'thermal resistance, body to air', q: 'thermalres', unit: 'K/W', value: 340, tex: 'R_{\\theta}' }
      },
      note: 'About 340 K/W for a small ¼ W axial resistor (85 K of rise at full rating). For chip resistors it depends mostly on the copper of the board around them.',
      stories: { T: 'A small axial resistor ({Rth}) dissipates {P} in air at {Ta}. How hot does its body get?' }
    },
    {
      name: 'Drift with temperature',
      expr: 'R = R0*(1 + alpha*dT)', tex: 'R = R_0\\,(1 + \\alpha\\,\\Delta T)',
      vars: {
        R: { name: 'resistance after the change', q: 'resistance', unit: 'kΩ' },
        R0: { name: 'resistance at the reference temperature', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_0' },
        alpha: { name: 'temperature coefficient', q: 'expansion', unit: 'ppm/K', value: 100, signed: true, tex: '\\alpha' },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 40, signed: true, tex: '\\Delta T' }
      },
      note: 'Typical coefficients: thin film 10–25 ppm/K, metal film 50 ppm/K, thick-film chips 100–200 ppm/K, carbon film −200 to −800 ppm/K.',
      practice: { unknowns: ['R', 'dT'] }
    }
  ],
  examples: [
    {
      title: 'An indicator LED on a 24 V machine supply',
      q: 'A red LED (2.0 V at 10 mA) must run from the 24 V control supply of a machine. Choose the series resistor: its value, a standard value and its power rating.',
      steps: [
        'The resistor drops the rest of the supply: $24 - 2.0 = 22$ V at 10 mA, so $R = 22/0.010 = 2.2\\ \\mathrm{k\\Omega}$ — an E12 value, as it happens.',
        'Power: $P = I^2 R = 0.010^2 \\times 2200 = 0.22$ W.',
        'A ¼ W part would run at 88 % of its rating: close to 150 °C in a warm cabinet. A 0.5 W part runs at 44 %; so do two 1.1 kΩ ¼ W parts in series (0.11 W each).',
        'Tolerance: at ±5 % the current lies between 9.5 and 10.5 mA — irrelevant for an indicator.'
      ],
      a: '2.2 kΩ rated 0.5 W, or two 1.1 kΩ ¼ W resistors in series.'
    },
    {
      title: 'Reading two parts',
      q: 'A through-hole resistor reads brown–black–black–red–brown, and a chip resistor is printed 104. What are they?',
      steps: [
        'Five bands: three digits 1, 0, 0 → 100; red multiplier ×100 → 10 000 Ω; brown tolerance ±1 %.',
        'So 10 kΩ ±1 %: it may measure anywhere from 9.9 to 10.1 kΩ.',
        'Chip code 104: the digits 10 followed by four zeros, 100 000 Ω.'
      ],
      a: '10 kΩ ±1 %, and 100 kΩ.'
    }
  ],
  quiz: [
    { q: 'Which is the next E12 value above 3.3 kΩ?', choices: ['3.6 kΩ', '3.9 kΩ', '4.3 kΩ', '4.7 kΩ'], a: 1,
      why: 'E12 runs … 3.3, 3.9, 4.7 …; 3.6 and 4.3 exist only in the finer E24 series.' },
    { q: 'A ¼ W resistor (full rating to 70 °C, zero at 155 °C) sits in an enclosure at 110 °C. The most it may dissipate is about…', choices: ['0.25 W', '0.13 W', '0.06 W', '0 W'], a: 1,
      why: '0.25 × (155 − 110)/(155 − 70) = 0.25 × 45/85 = 0.13 W — and for a long life you would stay under half of that.' },
    { q: 'Two 10 kΩ ±5 % resistors in series make 20 kΩ with a worst-case tolerance of…', choices: ['±2.5 %', '±5 %', '±7.1 %', '±10 %'], a: 1,
      why: 'If both are 5 % high, the total is 5 % high: percentage tolerance does not grow in series. (For randomly chosen parts the likely error even shrinks, to about ±3.5 %.)' },
    { q: 'A chip resistor is marked 331. Its value is…', choices: ['331 Ω', '33 Ω', '330 Ω', '3.3 kΩ'], a: 2,
      why: 'Two digits then the number of zeros: 33 followed by one zero, 330 Ω.' },
    { q: 'A 10 kΩ resistor with a coefficient of 100 ppm/K warms from 20 °C to 70 °C. By how many ohms does it change?', answer: 50, unit: 'Ω',
      why: '10 000 × 100 × 10⁻⁶ × 50 = 50 Ω, which is 0.5 %.' }
  ],
  applications: ['Current limiting for LEDs and transistor bases.', 'Dividers that let a microcontroller measure battery and supply voltages.', 'Current-sense shunts of a few milliohms, in power supplies and motor drives.', 'Pull-up and pull-down resistors on logic inputs.'],
  sim: 'cp-resistor'
},

{
  id: 'potentiometers', parent: 'passive-components', title: 'Potentiometers and rheostats', level: 1,
  short: 'A resistive track with a sliding contact: wired with three terminals it is an adjustable voltage divider, with two it is a variable resistor — and its wiper is always the weak point.',
  keywords: ['potentiometer', 'pot', 'rheostat', 'trimmer', 'trimpot', 'wiper', 'taper', 'logarithmic', 'audio taper', 'linear taper', 'digital potentiometer', 'position sensor', 'volume control'],
  prereq: ['voltage-divider', 'resistors', 'series-parallel'],
  related: ['thevenin-norton', 'sensor-interfacing', 'adc', 'voltage-follower'],
  body: `
A potentiometer is a resistive track with a third contact, the **wiper**, that slides along it. With the ends across a voltage, the wiper picks off any fraction of it: it is a [[voltage-divider|voltage divider]] whose ratio you set by hand. Turned to a fraction $x$ of its travel (0 at one end, 1 at the other), an unloaded linear pot gives

$$V_w = x\\,V_\\text{in}$$

### Pot or rheostat
- **As a potentiometer** (three terminals) it sets a voltage: volume and tone controls, the set-point knob of a thermostat, the reference of a comparator, the axis of a joystick.
- **As a rheostat** (two terminals: the wiper and one end) it is a variable resistor that sets a current — the old way to dim a lamp or adjust a charging current. Connect the unused end to the wiper, so that if the wiper lifts off a worn patch the full track stays in circuit instead of the circuit opening.

A rheostat can be turned down to zero ohms. Always put a fixed resistor in series where zero would mean an LED with no current limit or a transistor base straight on the supply.

### Tapers
The track need not be uniform. A **linear** taper (marked B on most parts made today) gives resistance proportional to rotation. An **audio** or **logarithmic** taper (A) is built from two or three linear segments so that mid-rotation gives only about 10–15 % of the voltage: our hearing is roughly logarithmic, so equal turns then sound like equal steps of loudness. A linear pot used for volume crams almost all the useful range into the first quarter of the turn.

### Loading: the same catch as any divider
The wiper sits between two parts of the track, $xR$ and $(1-x)R$. Seen from the wiper the pot is a source with an output ([[thevenin-norton|Thévenin]]) resistance

$$R_\\text{out} = x(1-x)\\,R$$

largest, $R/4$, at mid-travel. A load on the wiper sits in parallel with the lower part of the track and bends the law: a 10 kΩ pot at mid-travel feeding a 10 kΩ load gives 40 % of the input, not 50 %. Keep the load at least ten times the pot's value, or [[voltage-follower|buffer]] the wiper with an op-amp.

### Kinds you will meet
- **Panel pots**: carbon track for general use; conductive plastic for long life and smooth output (faders, position sensors); wirewound for power.
- **Trimmers**: small single-turn or multi-turn (15–25 turns) parts for calibration, set once with a screwdriver. Choose the range so that the setting falls near mid-travel.
- **Digital potentiometers**: a string of resistors and electronic switches, set over I²C or SPI. The "wiper" has tens to hundreds of ohms of its own, carries only a few milliamps, and every terminal must stay within the chip's supply rails.
- **Position sensors**: a pot on a shaft is the simplest absolute angle sensor — the feedback element of every hobby servo. Read it ratiometrically, powered from the ADC reference, so that supply changes cancel ([[sensor-interfacing]]).

### Current and wear
The power rating of a pot (0.1–0.5 W for small parts) assumes the whole track shares the heat. As a rheostat set to a fraction $x$, only that part of the track carries current, so it may dissipate only about $x$ times the rating. The current limit works out the same at every setting: $I_\\text{max} = \\sqrt{P_\\text{rated}/R}$, the current that would dissipate the full rating in the whole track. The wiper contact itself tolerates only milliamps in signal pots, and direct current through it makes a pot crackle as it wears; in audio circuits keep DC off the wiper with a coupling capacitor.
`,
  ideas: [
    'Three terminals make an adjustable divider; two terminals make a rheostat (variable resistor).',
    'Seen from the wiper, a pot has an output resistance x(1 − x)R — at most R/4, at mid-travel.',
    'Audio (log) tapers give about 10–15 % at mid-rotation to match the ear; linear tapers are for set-points and position.',
    'As a rheostat only part of the track heats up; the safe current is √(P/R) whatever the setting.',
    'Put a fixed resistor in series with any rheostat that must never reach zero ohms.'
  ],
  pitfalls: [
    'A pot used as a rheostat can take its full power rating at any setting — Only the part of the track in use carries current. At 20 % travel it can take about 20 % of the rated power, and the wiper may tolerate even less.',
    'The wiper voltage is always x·V_in — Only unloaded. A load comparable with the pot resistance pulls it down, most at mid-travel.',
    'Any pot will do for a volume control — A linear pot makes almost all the change happen early in the turn; audio circuits use a log taper.'
  ],
  formulas: [
    {
      name: 'Wiper voltage, unloaded',
      expr: 'Vw = x*Vin', tex: 'V_w = x\\,V_{\\text{in}}',
      vars: {
        Vw: { name: 'wiper voltage', q: 'voltage', unit: 'V', tex: 'V_w' },
        x: { name: 'fraction of the travel', q: 'ratio', unit: '', value: 0.3, min: 0, max: 1 },
        Vin: { name: 'voltage across the track', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{in}}' }
      }
    },
    {
      name: 'Wiper voltage with a load',
      expr: 'Vw = Vin*(x*R*RL/(x*R + RL))/((1 - x)*R + x*R*RL/(x*R + RL))',
      tex: 'V_w = V_{\\text{in}}\\,\\frac{x R \\parallel R_L}{(1-x) R + x R \\parallel R_L}',
      vars: {
        Vw: { name: 'wiper voltage (loaded)', q: 'voltage', unit: 'V', tex: 'V_w' },
        Vin: { name: 'voltage across the track', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{in}}' },
        x: { name: 'fraction of the travel', q: 'ratio', unit: '', value: 0.5, min: 0, max: 1 },
        R: { name: 'track resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        RL: { name: 'load resistance', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_L' }
      },
      note: 'The load sits in parallel with the lower part of the track, $xR$.',
      practice: { unknowns: ['Vw', 'RL'] },
      stories: { Vw: 'A {R} pot across {Vin}, set to a fraction {x} of its travel, feeds a {RL} load. What voltage reaches the load?' }
    },
    {
      name: 'Output resistance at the wiper',
      expr: 'Rout = x*(1 - x)*R', tex: 'R_{\\text{out}} = x(1-x)\\,R',
      vars: {
        Rout: { name: 'output resistance', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{out}}' },
        x: { name: 'fraction of the travel', q: 'ratio', unit: '', value: 0.5, min: 0, max: 1 },
        R: { name: 'track resistance', q: 'resistance', unit: 'kΩ', value: 10 }
      },
      note: 'Two settings give the same output resistance ($x$ and $1-x$): the calculator finds both.',
      practice: { unknowns: ['Rout'] }
    },
    {
      name: 'Safe current of a rheostat',
      expr: 'Imax = sqrt(P/R)', tex: 'I_{\\max} = \\sqrt{\\frac{P_{\\text{rated}}}{R}}',
      vars: {
        Imax: { name: 'largest safe current', q: 'current', unit: 'mA', tex: 'I_{\\max}' },
        P: { name: 'power rating of the whole track', q: 'power', unit: 'W', value: 0.5, tex: 'P_{\\text{rated}}' },
        R: { name: 'resistance of the whole track', q: 'resistance', unit: 'kΩ', value: 1 }
      },
      note: 'The same at every setting, because the allowed power shrinks in proportion to the part of the track in use. The wiper\'s own limit may be lower.',
      stories: { Imax: 'A {R}, {P} potentiometer is wired as a rheostat. What current may it carry?' }
    }
  ],
  examples: [
    {
      title: 'A loaded pot',
      q: 'A 10 kΩ pot across 5 V is set to mid-travel and feeds a 10 kΩ input. What does the input see, and how could you fix it?',
      steps: [
        'The lower half of the track, 5 kΩ, is in parallel with the load: $5 \\parallel 10 = 3.33\\ \\mathrm{k\\Omega}$.',
        'The upper half is 5 kΩ, so $V_w = 5 \\times 3.33/(5 + 3.33) = 2.0$ V instead of 2.5 V.',
        'The output resistance at mid-travel is $R/4 = 2.5\\ \\mathrm{k\\Omega}$, only four times smaller than the load.',
        'Fixes: a 1 kΩ pot (output resistance 250 Ω, still drawing only 5 mA), or a voltage follower between wiper and load.'
      ],
      a: '2.0 V instead of 2.5 V; use a smaller pot or buffer the wiper.'
    },
    {
      title: 'A dimmer for an LED',
      q: 'A white LED (3.0 V, at most 20 mA) runs from 12 V through a fixed resistor and a 1 kΩ, 0.5 W rheostat. Choose the fixed resistor and check the rheostat.',
      steps: [
        'At zero rheostat resistance the fixed resistor alone must limit the current: $R \\ge (12 - 3)/0.020 = 450\\ \\Omega$ → 470 Ω (E12), giving 19 mA.',
        'At full resistance: $I = 9/(470 + 1000) = 6.1$ mA — a useful dimming range.',
        'Rheostat limit: $I_\\text{max} = \\sqrt{0.5/1000} = 22$ mA, above the 19 mA it will ever carry.',
        'Fixed resistor power at 19 mA: $0.019^2 \\times 470 = 0.17$ W → use a 0.5 W part.'
      ],
      a: '470 Ω (0.5 W) in series; the current then ranges from 6 to 19 mA, within the rheostat\'s 22 mA limit.'
    }
  ],
  quiz: [
    { q: 'What is the output resistance at the wiper of a 20 kΩ pot set to mid-travel?', choices: ['20 kΩ', '10 kΩ', '5 kΩ', '0 Ω'], a: 2,
      why: 'Two 10 kΩ halves in parallel: x(1 − x)R = 0.25 × 20 kΩ = 5 kΩ.' },
    { q: 'An audio-taper (log) volume pot at mid-rotation passes roughly what fraction of the signal?', choices: ['50 %', '10–15 %', '1 %', '90 %'], a: 1,
      why: 'Log tapers are built so that mid-rotation gives about 10–15 %, which the ear hears as about half as loud.' },
    { q: 'A 10 kΩ, 0.5 W pot wired as a rheostat can safely carry 10 mA at any setting.', a: false,
      why: 'Its safe current is √(0.5/10 000) = 7.1 mA whatever the setting. 10 mA would overheat the part of the track in use.' },
    { q: 'Why is a rheostat usually wired with the unused end joined to the wiper?', choices: ['It doubles the power rating', 'If the wiper loses contact, the full track stays in circuit instead of an open circuit', 'It makes the taper logarithmic', 'It removes the need for a series resistor'], a: 1,
      why: 'A worn or dirty track can make the wiper lift momentarily; with the end tied to it, the resistance jumps to the full value rather than to infinity.' },
    { q: 'Can a 5 V digital potentiometer directly replace the volume pot in a ±12 V audio circuit?', choices: ['Yes, it is just a resistor', 'No: every terminal must stay within its own supply rails', 'Only if the signal is small', 'Only with a log taper'], a: 1,
      why: 'The resistors are switched by transistors inside the chip; signals outside its rails forward-bias its protection diodes. Use a part designed for split supplies, or bias the signal into its range.' }
  ],
  applications: ['Volume, tone and balance controls.', 'Calibration trimmers on sensor and power-supply boards.', 'Angle sensing in servos, joysticks and throttle pedals.', 'Set-point knobs on thermostats, dimmers and motor speed controllers.'],
  sim: 'ref-divider'
},

{
  id: 'capacitors', parent: 'passive-components', title: 'Capacitors in practice', level: 2,
  short: 'Real capacitors differ enormously with their dielectric: ceramic, electrolytic, tantalum and film parts each bring their own ESR, voltage and temperature behaviour, lifetime and way of failing — and the job decides which one fits.',
  keywords: ['capacitor', 'ceramic', 'MLCC', 'C0G', 'NP0', 'X7R', 'X5R', 'electrolytic', 'tantalum', 'polymer', 'film capacitor', 'ESR', 'ESL', 'ripple current', 'DC bias', 'self-resonance', 'lifetime', 'X2', 'Y2'],
  prereq: ['physics:capacitance', 'physics:dielectrics', 'impedance', 'physics:energy-in-capacitor'],
  related: ['decoupling', 'smoothing-ripple', 'supercapacitors', 'buck-converter', 'rc-transient'],
  body: `
In a schematic a capacitor is two lines and a value. On the bench a 10 µF part may be a ceramic chip the size of a grain of rice, an aluminium can, a tantalum bead or a film block — and swapping one for another can make a regulator oscillate, a converter overheat, a filter lose half its capacitance, or a board catch fire. The type matters as much as the value.

### The families
| Type | Typical values | Strengths | Watch out for |
|---|---|---|---|
| Ceramic C0G (NP0) | 1 pF – 100 nF | stable (±30 ppm/K), no loss under DC bias, low loss | small values only |
| Ceramic X7R, X5R | 1 nF – 100 µF | tiny, very low ESR and ESL | value falls with DC bias and temperature; cracks if the board flexes |
| Aluminium electrolytic | 1 µF – 1 F | large capacitance and voltage, cheap | polarised, high ESR, wears out, leaks |
| Polymer (aluminium or tantalum) | 1 µF – 1 mF | very low ESR, long life | cost; mostly low voltages |
| Tantalum (MnO₂) | 0.1 – 1000 µF | stable, compact | fails short and can burn: use at half its rated voltage |
| Film (polypropylene, polyester) | 100 pF – 100 µF | low loss, self-healing, high voltage | bulky |

### The real capacitor: C, ESR and ESL
Every capacitor behaves like an ideal capacitance in series with a small resistance, the **equivalent series resistance (ESR)**, and a small inductance, the **ESL**, from its leads and internal geometry. At low frequency the capacitance dominates and the [[impedance]] falls as $1/(2\\pi f C)$. At the **self-resonant frequency**

$$f_\\text{SR} = \\frac{1}{2\\pi\\sqrt{L_\\text{ESL}\\,C}}$$

the impedance reaches its minimum, equal to the ESR, and above it the part behaves as an inductor. A 100 nF ceramic in an 0603 case, with about 0.8 nH of ESL, resonates near 18 MHz — which is why [[decoupling]] uses small parts placed close to the pins, often several values in parallel.

ESR turns a ripple current into heat, $P = I_\\text{rms}^2\\,R_\\text{ESR}$, and adds a step to the ripple voltage, $\\Delta V = \\Delta I \\cdot R_\\text{ESR}$. On the output of a [[buck-converter|switching converter]], an ordinary electrolytic with 0.2 Ω of ESR and 0.6 A of ripple current makes 120 mV of ripple however many microfarads it has; a polymer or ceramic part with 10 mΩ makes 6 mV. Electrolytic datasheets give a **ripple-current rating**: exceed it and the part heats up and dies early.

### Class 2 ceramics lose capacitance
X5R and X7R dielectrics are ferroelectric: their permittivity falls as DC voltage is applied. A 10 µF, 6.3 V part in a small case can offer less than half its nominal value at 5 V. The value also moves by up to ±15 % over temperature (that is what the code means: X7R is ±15 % from −55 to +125 °C) and falls slowly with age. Choose a higher voltage rating or a larger case, and read the DC-bias curve in the datasheet. C0G parts have none of these effects, which is why timing and filter circuits use them.

### Electrolytics wear out
An aluminium electrolytic contains a liquid electrolyte that slowly escapes through its seal. Datasheets give a life at the maximum temperature — 2000 h at 105 °C is typical — and a rule that works well in practice: **life doubles for every 10 °C cooler**,

$$L = L_0 \\cdot 2^{(T_0 - T)/10\\,\\mathrm{K}}$$

so the same part running at 65 °C lasts 2000 × 2⁴ = 32 000 h, nearly four years of continuous use. Keep electrolytics away from heat sinks and power resistors. They are polarised: reversed, they conduct, heat and can vent. Their leakage current, microamps, matters in timers and in battery-powered equipment.

### Energy and safety
A capacitor stores $E = \\tfrac{1}{2} C V^2$ ([[physics:energy-in-capacitor|energy in a capacitor]]). A 4700 µF, 63 V reservoir holds 9.3 J — enough to weld a screwdriver tip. The reservoir capacitors in mains equipment charge to about 325 V (the peak of 230 V AC) and can hold a dangerous charge long after the plug is pulled: designs include a bleeder resistor, and before touching you check with a meter.

> [!warn] Across the mains, only safety-rated capacitors may be used: **class X** (X2) between live and neutral, and **class Y** (Y2) from live or neutral to earth, where a failure must never become a short. An ordinary film or ceramic capacitor is not acceptable in either place.
`,
  ideas: [
    'The dielectric decides the behaviour: C0G is stable, X7R/X5R are small but lose value under DC bias, electrolytics are big but lossy and wear out.',
    'A real capacitor is C in series with ESR and ESL; above its self-resonant frequency it behaves as an inductor.',
    'Ripple current heats the ESR (I²·R) and adds ΔI·R to the ripple voltage.',
    'Electrolytic life roughly doubles for every 10 °C cooler.',
    'A charged capacitor stores ½CV² and can stay dangerous after the power is removed.'
  ],
  pitfalls: [
    'A 10 µF ceramic gives 10 µF — A small X5R or X7R part near its rated voltage may keep well under half of that; check the DC-bias curve.',
    'More microfarads always means less ripple — Once ESR dominates, extra capacitance of the same type barely helps. A low-ESR type does, or parts in parallel, which divide the ESR.',
    'A capacitor can be run at its rated voltage — Tantalum (MnO₂) parts should see about half of it; ceramics lose capacitance near it; electrolytics age faster with heat and ripple.'
  ],
  formulas: [
    {
      name: 'Energy stored',
      expr: 'E = 0.5*C*V^2', tex: 'E = \\tfrac{1}{2} C V^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 4700 },
        V: { name: 'voltage', q: 'voltage', unit: 'V', value: 63 }
      },
      stories: { E: 'How much energy does a {C} capacitor charged to {V} hold?', V: 'To what voltage must a {C} capacitor be charged to store {E}?' }
    },
    {
      name: 'Heating by ripple current',
      expr: 'P = Irms^2*Resr', tex: 'P = I_{\\text{rms}}^2\\,R_{\\text{ESR}}',
      vars: {
        P: { name: 'power dissipated in the capacitor', q: 'power', unit: 'W' },
        Irms: { name: 'RMS ripple current', q: 'current', unit: 'A', value: 1.5, tex: 'I_{\\text{rms}}' },
        Resr: { name: 'equivalent series resistance', q: 'resistance', unit: 'mΩ', value: 80, tex: 'R_{\\text{ESR}}' }
      },
      stories: { P: 'An electrolytic with an ESR of {Resr} carries {Irms} of ripple current. How much heat does it make?' }
    },
    {
      name: 'Self-resonant frequency',
      expr: 'f = 1/(2*pi*sqrt(L*C))', tex: 'f_{\\text{SR}} = \\frac{1}{2\\pi\\sqrt{L_{\\text{ESL}}\\,C}}',
      vars: {
        f: { name: 'self-resonant frequency', q: 'frequency', unit: 'MHz', tex: 'f_{\\text{SR}}' },
        L: { name: 'equivalent series inductance', q: 'inductance', unit: 'nH', value: 0.8, tex: 'L_{\\text{ESL}}' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      note: 'Above this frequency the part behaves as an inductor. ESL is roughly 0.5–1 nH for small chip capacitors and several nH for leaded parts.',
      stories: { f: 'A {C} capacitor has an ESL of {L}. Above what frequency does it stop behaving as a capacitor?' }
    },
    {
      name: 'Electrolytic lifetime (10-degree rule)',
      expr: 'life = L0*2^((Tr - T)/10)', tex: 'L = L_0 \\cdot 2^{(T_r - T)/10\\,\\mathrm{K}}',
      vars: {
        life: { name: 'expected life', q: 'time', unit: 'h', tex: 'L' },
        L0: { name: 'rated life at the rated temperature', q: 'time', unit: 'h', value: 2000, tex: 'L_0' },
        Tr: { name: 'rated temperature', q: 'temperature', unit: '°C', value: 105, tex: 'T_r' },
        T: { name: 'operating (core) temperature', q: 'temperature', unit: '°C', value: 65 }
      },
      note: 'A rule of thumb for aluminium electrolytics, reasonable between about 40 °C and the rated temperature. Ripple current raises the core above the surrounding air.',
      stories: {
        life: 'An electrolytic rated {L0} at {Tr} runs at {T}. Roughly how long will it last?',
        T: 'A capacitor rated {L0} at {Tr} must last {life}. At what temperature may it run?'
      }
    }
  ],
  examples: [
    {
      title: 'Choosing an output capacitor for a converter',
      q: 'A buck converter\'s output capacitor must absorb a 0.6 A peak-to-peak triangular ripple current at 100 kHz. Compare a 47 µF electrolytic with an ESR of 0.3 Ω and a 47 µF polymer part with 20 mΩ.',
      steps: [
        'The capacitance alone gives a ripple of $\\Delta I/(8 f C) = 0.6/(8 \\times 10^5 \\times 47\\times10^{-6}) = 16$ mV.',
        'The ESR adds $\\Delta I \\cdot R$: 0.6 × 0.3 = 180 mV for the electrolytic, 0.6 × 0.02 = 12 mV for the polymer.',
        'The RMS value of a triangle is $\\Delta I/\\sqrt{12} = 0.17$ A, so the electrolytic dissipates $0.17^2 \\times 0.3 = 9$ mW — no heating problem.',
        'Here the ESR, not the heat and not the capacitance, is what decides: the polymer part gives about a tenth of the ripple.'
      ],
      a: 'About 200 mV of ripple with the electrolytic, about 30 mV with the polymer part.'
    },
    {
      title: 'How long will it last?',
      q: 'An electrolytic rated 2000 h at 105 °C runs at 75 °C inside a power supply. How long will it last, and what part would last ten years of continuous use?',
      steps: [
        '30 °C cooler than rated: $2^{30/10} = 8$, so $2000 \\times 8 = 16\\,000$ h, about 1.8 years of continuous running.',
        'Ten years is 87 600 h: a factor of about 44 over 2000 h, far more than 8.',
        'A 10 000 h, 105 °C part gives $10\\,000 \\times 8 = 80\\,000$ h, about nine years; lowering its temperature by another 5–10 °C (better airflow, away from the heat sink) makes up the rest.'
      ],
      a: 'About 16 000 h (1.8 years); choose a 10 000 h part and keep it cooler.'
    }
  ],
  quiz: [
    { q: 'You need a 10 nF capacitor for a precise 1 kHz filter. Which dielectric?', choices: ['X7R ceramic', 'C0G (NP0) ceramic', 'aluminium electrolytic', 'tantalum'], a: 1,
      why: 'C0G is stable with temperature and voltage and has very low loss. X7R changes by up to 15 % with temperature and more with DC bias; electrolytics and tantalums are not made or suited for this.' },
    { q: 'Above its self-resonant frequency a capacitor behaves like…', choices: ['a resistor', 'an inductor', 'a larger capacitor', 'an open circuit'], a: 1,
      why: 'The ESL dominates: the impedance rises with frequency, as an inductor\'s does.' },
    { q: 'An electrolytic runs 20 °C cooler than before. Its expected life becomes about…', choices: ['the same', 'twice as long', 'four times as long', 'twenty times as long'], a: 2,
      why: 'Life doubles per 10 °C: two doublings, ×4.' },
    { q: 'Two identical electrolytics in parallel have half the ESR of one.', a: true,
      why: 'Their ESRs are in parallel. Together they also share the ripple current, so each heats less — a common fix for ripple problems.' },
    { q: 'How much energy does a 1000 µF capacitor store at 50 V?', answer: 1.25, unit: 'J',
      why: '½ × 0.001 × 50² = 1.25 J.' }
  ],
  applications: ['Decoupling the supply pins of every integrated circuit.', 'Reservoir and output filters of power supplies and switching converters.', 'Timing and filter networks, where C0G and film parts keep their value.', 'Motor-run capacitors and mains interference suppression (X and Y classes).'],
  sim: { id: 'cp-converter', params: { topo: 'buck' } }
},

{
  id: 'inductors', parent: 'passive-components', title: 'Inductors in practice', level: 2,
  short: 'A coil stores energy in its magnetic field and resists changes of current. In practice an inductor is chosen by its inductance, its saturation and heating currents, its resistance and its core.',
  keywords: ['inductor', 'choke', 'coil', 'ferrite', 'toroid', 'saturation current', 'Isat', 'DCR', 'AL value', 'inductance factor', 'core', 'shielded inductor', 'ferrite bead', 'common-mode choke', 'inductive kick', 'air gap'],
  prereq: ['physics:inductance', 'physics:energy-in-inductor', 'physics:magnetic-materials', 'impedance'],
  related: ['buck-converter', 'rl-transient', 'flyback-diode', 'transformers-practical', 'boost-converter'],
  body: `
An inductor is a coil of wire, usually on a magnetic core. Its defining law is

$$v = L\\,\\frac{di}{dt}$$

A voltage appears only while the current changes, and it opposes the change ([[physics:lenzs-law|Lenz's law]]). An inductor is therefore **inertia for current**: it lets current build up gradually, keeps it flowing when the source is removed, and stores the energy $E = \\tfrac{1}{2} L I^2$ in its magnetic field. That is exactly what a [[buck-converter|switching converter]] needs, what a filter uses to block high frequencies, and what makes a relay coil spit a spike of hundreds of volts when it is switched off ([[flyback-diode]]).

### Cores
- **Air core**: no saturation and no core loss, but little inductance per turn; used in radio circuits and loudspeaker crossovers.
- **Ferrite**: high permeability and low loss up to megahertz — the standard material for switching converters and filters. Ferrite saturates fairly abruptly, at a flux density of about 0.3–0.5 T, less when hot.
- **Powdered iron and alloy powders**: the magnetic material is spread out with tiny insulating gaps, so saturation is gradual ("soft") and DC is well tolerated, at the price of more core loss.
- **Toroids** keep the field inside the ring and **shielded** surface-mount inductors keep it inside a magnetic box. An unshielded drum-core inductor sprays its field into neighbouring circuits.

The inductance of a wound core follows from the manufacturer's **inductance factor** $A_L$ (in nH per turn squared): $L = A_L N^2$. Doubling the turns quadruples the inductance.

### The numbers on the datasheet
- **Inductance** and its tolerance — ±20 % is common for power inductors.
- **DCR**, the DC resistance of the winding. The copper loss is $I_\\text{rms}^2 \\cdot \\text{DCR}$.
- **Saturation current** $I_\\text{sat}$: where the inductance has fallen by a stated amount (often 20–30 %) because the core is saturating. Above it the inductance collapses, and the current in a converter can spike to destructive levels within a single cycle.
- **Rated (heating) current** $I_\\text{rms}$: the RMS current that raises the part's temperature by typically 40 K. It may be larger or smaller than $I_\\text{sat}$; a design must respect both.
- **Self-resonant frequency**: the capacitance between turns resonates with the inductance; above it the part is a capacitor.

In a converter the peak current is the load current plus half the ripple, $I_\\text{pk} = I_\\text{out} + \\Delta I/2$. It must stay below $I_\\text{sat}$ with a margin — at full load, at start-up, in an overload and at the hottest operating temperature.

### Saturation, physically
The flux density in the core is $B = L I/(N A_e)$, with $A_e$ the core's effective cross-section. As $B$ approaches the material's saturation flux density, the permeability collapses. That is why a small inductor has a small current rating however thick its wire: the core volume limits the energy it can store. Designers add an **air gap** to ferrite cores for power inductors: the gap stores most of the energy and pushes saturation to a higher current, at the cost of fewer henries per turn.

### Parts that look like inductors
**Ferrite beads** are specified by their impedance at 100 MHz (for instance 600 Ω), not by inductance: they are deliberately lossy and turn high-frequency noise into heat while passing DC. **Common-mode chokes** carry two windings that cancel for the normal (differential) current but present a high impedance to noise flowing the same way in both wires — on USB, Ethernet and mains input filters.
`,
  ideas: [
    'v = L di/dt: an inductor opposes changes of current and stores ½LI² in its magnetic field.',
    'Inductance grows as the square of the turns: L = A_L N².',
    'Two current ratings matter — saturation (the core) and heating (the copper) — and both must be respected.',
    'The peak current, load current plus half the ripple, must stay below the saturation current.',
    'Ferrite beads and common-mode chokes are lossy filters, specified by impedance rather than inductance.'
  ],
  pitfalls: [
    'Thick enough wire means enough current — The core saturates at a current set by its size and air gap. Beyond Isat the inductance collapses, whatever the wire.',
    'An inductor is an inductor at every frequency — Its winding capacitance gives a self-resonant frequency above which it behaves as a capacitor, and ferrite becomes lossy at high frequency.',
    'The current in an inductor can be switched off instantly — Interrupting it creates v = L di/dt, often hundreds or thousands of volts. Always give the current a path: a diode, a snubber or a clamp.'
  ],
  formulas: [
    {
      name: 'Voltage across an inductor',
      expr: 'V = L*dI/dt', tex: 'V = L\\,\\frac{\\Delta I}{\\Delta t}',
      vars: {
        V: { name: 'induced voltage', q: 'voltage', unit: 'V' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 },
        dI: { name: 'change of current', q: 'current', unit: 'mA', value: 50, tex: '\\Delta I' },
        dt: { name: 'time taken', q: 'time', unit: 'µs', value: 1, tex: '\\Delta t' }
      },
      note: 'For a steady rate of change. In practice the voltage is limited by whatever breaks down first — which is why a flyback diode is fitted.',
      stories: {
        V: 'A relay coil of {L} carrying {dI} is switched off in {dt}. What voltage appears across it?',
        dt: 'How slowly must {dI} in a {L} coil be switched off to keep the induced voltage below {V}?'
      }
    },
    {
      name: 'Energy stored in an inductor',
      expr: 'E = 0.5*L*I^2', tex: 'E = \\tfrac{1}{2} L I^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'mJ' },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 47 },
        I: { name: 'current', q: 'current', unit: 'A', value: 3 }
      },
      stories: { E: 'How much energy does a {L} inductor store at {I}?' }
    },
    {
      name: 'Inductance from the inductance factor',
      expr: 'L = AL*N^2', tex: 'L = A_L N^2',
      vars: {
        L: { name: 'inductance', q: 'inductance', unit: 'µH' },
        AL: { name: 'inductance factor (per turn squared)', q: 'inductance', unit: 'nH', value: 50, tex: 'A_L' },
        N: { name: 'number of turns', q: 'count', value: 31, int: true }
      },
      stories: { L: 'A core with {AL} per turn² carries {N} turns. What is the inductance?' },
      practice: { unknowns: ['L'] }
    },
    {
      name: 'Peak flux density in the core',
      expr: 'B = L*I/(N*A)', tex: 'B = \\frac{L I}{N A_e}',
      vars: {
        B: { name: 'peak flux density', q: 'bfield', unit: 'mT' },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 47 },
        I: { name: 'peak current', q: 'current', unit: 'A', value: 3 },
        N: { name: 'number of turns', q: 'count', value: 20, int: true },
        A: { name: 'effective core area', q: 'area', unit: 'mm²', value: 20, tex: 'A_e' }
      },
      note: 'Compare with the core material\'s saturation flux density: roughly 300–500 mT for power ferrite, lower when hot.',
      practice: { unknowns: ['B', 'I'] },
      stories: { B: 'A {L} inductor with {N} turns on a core of area {A} carries a peak of {I}. What is the peak flux density?' }
    }
  ],
  examples: [
    {
      title: 'The kick of a relay coil',
      q: 'A relay coil of about 0.1 H carries 50 mA. A transistor switches it off in about 1 µs. What voltage appears, and what does a flyback diode change?',
      steps: [
        {text: 'Without a diode:', tex: 'V = L\\frac{\\Delta I}{\\Delta t} = 0.1 \\times \\frac{0.05}{1\\times10^{-6}} = 5000\\ \\mathrm{V}'},
        'Long before that the transistor breaks down, and does so on every switch-off until it fails.',
        'A diode across the coil gives the current a path: the coil voltage is clamped to about 0.7 V (reversed), the transistor sees only the supply plus 0.7 V, and the current decays gently with the coil\'s own time constant $L/R$.',
        'For a 240 Ω coil, $\\tau = 0.1/240 \\approx 0.4$ ms — which is also why a diode makes the relay release a little later.'
      ],
      a: 'Kilovolts in principle; with a diode the transistor sees only about the supply voltage.'
    },
    {
      title: 'Winding a 47 µH inductor',
      q: 'You have a powdered-iron toroid with $A_L$ = 50 nH/turn². How many turns give about 47 µH, and what is the copper loss at 3 A with 0.8 mm wire, if one turn uses 40 mm of wire?',
      steps: [
        {text: 'Turns:', tex: 'N = \\sqrt{L/A_L} = \\sqrt{47\\times10^{-6}/50\\times10^{-9}} = 30.7'},
        'Take 31 turns: $L = 50\\ \\mathrm{nH} \\times 31^2 = 48\\ \\mu\\mathrm{H}$.',
        'Wire: $31 \\times 40$ mm = 1.24 m of 0.8 mm wire (0.50 mm²): $R = 1.72\\times10^{-8} \\times 1.24/0.50\\times10^{-6} = 43\\ \\mathrm{m\\Omega}$.',
        'Copper loss: $3^2 \\times 0.043 = 0.39$ W. Then check the core\'s datasheet that 3 A (plus ripple) does not saturate it.'
      ],
      a: '31 turns for 48 µH; about 0.4 W of copper loss at 3 A.'
    }
  ],
  quiz: [
    { q: 'You double the number of turns on the same core. The inductance becomes…', choices: ['twice as large', 'four times as large', 'half as large', 'unchanged'], a: 1,
      why: 'L = A_L N²: twice the turns, four times the inductance (as long as the core does not saturate).' },
    { q: 'A buck converter\'s inductor current peaks above the inductor\'s saturation current. What happens?', choices: ['Nothing — only the heating current matters', 'The inductance collapses and the current rises steeply within the cycle, stressing the switch', 'The output voltage rises', 'The switching frequency falls'], a: 1,
      why: 'With a saturated core the current ramps at V/L with a much smaller L; the peak can multiply in a single cycle and destroy the MOSFET.' },
    { q: 'A ferrite bead is specified mainly by…', choices: ['its inductance in µH', 'its impedance at 100 MHz', 'its saturation flux density', 'its capacitance'], a: 1,
      why: 'Beads are lossy parts meant to absorb high-frequency noise; datasheets give impedance (mostly resistive) versus frequency, typically quoted at 100 MHz.' },
    { q: 'A larger air gap in a ferrite core raises the current at which it saturates, but lowers the inductance per turn.', a: true,
      why: 'The gap dominates the magnetic path: less flux per ampere-turn, so more current before the ferrite saturates, and a lower A_L.' },
    { q: 'How much energy does a 10 µH inductor store at 5 A?', answer: 125e-6, unit: 'J',
      why: '½ × 10 × 10⁻⁶ × 5² = 125 µJ.' }
  ],
  applications: ['Energy storage in buck, boost and flyback converters.', 'LC filters on supply rails, and loudspeaker crossovers.', 'Common-mode chokes on mains inputs and data cables.', 'Tuned circuits in radio receivers and transmitters.'],
  sim: 'cp-converter'
},

{
  id: 'transformers-practical', parent: 'passive-components', title: 'Transformers in practice', level: 2,
  short: 'A transformer trades voltage for current in the ratio of its turns and isolates one circuit from another. Real ones add magnetising current, losses, regulation, inrush and a VA rating to respect.',
  keywords: ['transformer', 'turns ratio', 'mains transformer', 'toroidal transformer', 'VA rating', 'regulation', 'inrush current', 'isolation', 'impedance matching', 'current transformer', 'core saturation', 'volts per turn', '50 Hz', '60 Hz'],
  prereq: ['physics:transformers', 'physics:faradays-law', 'rms-values', 'inductors'],
  related: ['power-supply-design', 'full-wave-rectifier', 'buck-boost', 'three-phase'],
  body: `
Two windings share one magnetic core. An alternating current in the **primary** makes an alternating flux, and the flux induces a voltage in every turn of every winding ([[physics:faradays-law|Faraday's law]]). Every turn gets the same volts, so the voltages go as the turns; and since power in equals power out for an ideal transformer, the currents go the other way:

$$\\frac{V_s}{V_p} = \\frac{N_s}{N_p}, \\qquad \\frac{I_s}{I_p} = \\frac{N_p}{N_s}$$

A 230 V to 12 V transformer has about 19 times fewer secondary turns and delivers about 19 times the current its primary draws. Seen from the primary, a load $Z_s$ looks like $Z_s (N_p/N_s)^2$: a transformer is also an **impedance converter**, which is how an 8 Ω loudspeaker is matched to a valve amplifier that wants a few kilohms.

Just as important is what it does not do: no wire connects the windings. The secondary is **galvanically isolated** from the mains, which is what makes a mains-powered device safe to touch — the insulation between the windings is a safety component.

### What a real transformer adds
- **Magnetising current**: even unloaded, the primary draws a current to magnetise the core — it is an inductor across the mains. Small transformers draw a few percent of their rated current with no load and stay warm all the time.
- **Copper and core losses**: winding resistance ($I^2R$), and hysteresis and eddy currents in the core. Efficiency ranges from about 80–90 % for a 10 VA part to over 98 % for large ones.
- **Regulation**: winding resistance makes the output sag under load. Secondary voltages are rated **at full load**; unloaded, a small transformer gives 10–25 % more, so a "12 V" transformer may read 14.5 V with nothing connected. [[power-supply-design|Designing a supply]] has to allow for both ends.
- **VA rating**: a transformer is rated in volt-amperes because its heating depends on current, whatever the power factor. Feeding a [[full-wave-rectifier|bridge rectifier]] and reservoir capacitor, the secondary current flows in short tall pulses whose RMS value is about 1.6–1.8 times the DC output current, so the VA rating must exceed the DC watts by a similar factor.

### Flux, frequency and size
The peak flux density in the core follows from the applied voltage:

$$V_\\text{rms} = \\sqrt{2}\\,\\pi f N A_e B_\\text{pk} \\approx 4.44\\, f N A_e B_\\text{pk}$$

For a given core area $A_e$ and peak flux density (about 1.2–1.5 T for silicon steel), the volts per turn are proportional to frequency. Two practical facts follow. A transformer designed for 60 Hz and used on 50 Hz runs at 20 % more flux and may saturate and overheat, while a 50 Hz design is fine on 60 Hz. And at 100 kHz the same power needs a far smaller core — which is why the transformer in a phone charger's [[buck-boost|flyback converter]] is a thumb-sized ferrite part, while a 50 Hz transformer of the same rating weighs half a kilogram.

### Inrush
At switch-on the core can be driven into saturation for the first few cycles, depending on where in the mains cycle the switch closes and on the flux left in the core from last time. The primary current can then reach ten times the rated value or more — toroidal transformers are notorious for it. Use a time-delay (T) fuse on the primary, and for larger toroids a soft-start circuit or an NTC inrush limiter.

> [!warn] Mains transformers carry lethal voltages on the primary side. Use a transformer certified as a safety-isolating type (to IEC 61558 or equivalent), fuse the primary, keep primary and secondary wiring apart, and earth the core or chassis as the design requires. Never leave the secondary of a **current transformer** open while current flows in its primary: with no burden resistor to carry the secondary current, the voltage across it can rise to kilovolts.
`,
  ideas: [
    'Voltages go as the turns and currents inversely; impedances go as the square of the turns ratio.',
    'Isolation between the windings is what makes mains-powered equipment safe to touch.',
    'Real transformers sag under load: the rated voltage is at full load, and unloaded they read 10–25 % high.',
    'Volts per turn are proportional to frequency, which is why high-frequency transformers are small.',
    'Rectifier loads draw peaky current, so the VA rating must comfortably exceed the DC power.'
  ],
  pitfalls: [
    'A transformer rated 12 V gives 12 V — Only at full load. Unloaded it gives more, and into a rectifier and capacitor the DC is near the peak, about √2 times higher still.',
    'A transformer can pass DC — It transforms only changing flux. DC in a winding just saturates the core and heats the copper.',
    'VA and watts are the same for a transformer — Heating follows the RMS current. With a capacitor-input rectifier the RMS current is well above the DC current, so a 24 W DC load needs a transformer of roughly 40 VA.'
  ],
  formulas: [
    {
      name: 'Turns ratio',
      expr: 'Vs = Vp*Ns/Np', tex: 'V_s = V_p\\,\\frac{N_s}{N_p}',
      vars: {
        Vs: { name: 'secondary voltage', q: 'voltage', unit: 'V', tex: 'V_s' },
        Vp: { name: 'primary voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_p' },
        Ns: { name: 'secondary turns', q: 'count', value: 52, int: true, tex: 'N_s' },
        Np: { name: 'primary turns', q: 'count', value: 1000, int: true, tex: 'N_p' }
      },
      practice: { unknowns: ['Vs'] },
      stories: { Vs: 'A transformer has {Np} primary turns and {Ns} secondary turns. What does it give from {Vp}?' }
    },
    {
      name: 'Reflected impedance',
      expr: 'Zp = Zs*n^2', tex: 'Z_p = Z_s\\,n^2, \\quad n = \\frac{N_p}{N_s}',
      vars: {
        Zp: { name: 'impedance seen at the primary', q: 'resistance', unit: 'kΩ', tex: 'Z_p' },
        Zs: { name: 'load on the secondary', q: 'resistance', unit: 'Ω', value: 8, tex: 'Z_s' },
        n: { name: 'turns ratio N_p/N_s', q: 'ratio', unit: '', value: 25 }
      },
      stories: {
        Zp: 'A {Zs} loudspeaker is connected through a transformer with a turns ratio of {n}. What load does the amplifier see?',
        n: 'An amplifier wants a load of {Zp}. What turns ratio matches it to a {Zs} loudspeaker?'
      }
    },
    {
      name: 'The transformer EMF equation',
      expr: 'V = sqrt(2)*pi*f*N*A*B', tex: 'V_{\\text{rms}} = \\sqrt{2}\\,\\pi f N A_e B_{\\text{pk}}',
      vars: {
        V: { name: 'RMS winding voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_{\\text{rms}}' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        N: { name: 'number of turns', q: 'count' },
        A: { name: 'effective core area', q: 'area', unit: 'cm²', value: 10, tex: 'A_e' },
        B: { name: 'peak flux density', q: 'bfield', unit: 'T', value: 1.2, tex: 'B_{\\text{pk}}' }
      },
      solveFor: 'N',
      note: 'For a sine wave. Round the number of turns up. The constant √2·π ≈ 4.44 is why the equation is often written 4.44 fNAB.',
      stories: {
        N: 'A {f} transformer core has an area of {A} and should run at {B}. How many turns does a {V} winding need?',
        B: 'A winding of {N} turns on a {A} core is fed {V} at {f}. What is the peak flux density?'
      }
    },
    {
      name: 'Regulation: unloaded against loaded voltage',
      expr: 'Vnl = Vfl*(1 + reg)', tex: 'V_{\\text{nl}} = V_{\\text{fl}}\\,(1 + r)',
      vars: {
        Vnl: { name: 'no-load secondary voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{nl}}' },
        Vfl: { name: 'full-load (rated) secondary voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{fl}}' },
        reg: { name: 'regulation', q: 'ratio', unit: '%', value: 15, tex: 'r' }
      },
      note: 'Datasheets quote the regulation; 10–25 % is typical for transformers of a few tens of VA, less for large ones.',
      stories: { Vnl: 'A {Vfl} transformer has a regulation of {reg}. What does it read with no load?' }
    }
  ],
  examples: [
    {
      title: 'Turns for a mains transformer',
      q: 'A core of 10 cm² effective area is to run at 1.2 T peak on 230 V, 50 Hz. How many turns for the primary, and for a 12 V (full-load) secondary allowing 10 % for winding resistance?',
      steps: [
        {text: 'Volts per turn:', tex: '\\frac{V}{N} = 4.44 \\times 50 \\times 10\\times10^{-4} \\times 1.2 = 0.267\\ \\mathrm{V}'},
        'Primary: $230/0.267 = 863$ turns.',
        'Secondary: wind for about $12 \\times 1.1 = 13.2$ V unloaded-ish, so $13.2/0.267 = 49.5$ → 50 turns.',
        'With 863 primary turns the magnetising current stays small; fewer turns would raise the flux and drive the core towards saturation.'
      ],
      a: 'About 863 primary turns and 50 secondary turns.'
    },
    {
      title: 'Matching a loudspeaker',
      q: 'A valve output stage wants a 5 kΩ load. What turns ratio matches an 8 Ω loudspeaker?',
      steps: [
        'The impedance ratio is $5000/8 = 625$.',
        'Impedances go as the square of the turns ratio: $n = \\sqrt{625} = 25$.',
        'So the primary has 25 times the turns of the secondary.'
      ],
      a: 'A 25 : 1 turns ratio.'
    }
  ],
  quiz: [
    { q: 'A transformer designed for 60 Hz is used on 50 Hz mains of the same voltage. Its core flux…', choices: ['falls by 20 %', 'stays the same', 'rises by 20 %', 'doubles'], a: 2,
      why: 'At the same voltage, flux is inversely proportional to frequency: 60/50 = 1.2. The core may saturate and the transformer overheat.' },
    { q: 'An 8 Ω loudspeaker on a transformer with a 4 : 1 turns ratio (primary : secondary) looks, from the primary, like…', choices: ['2 Ω', '32 Ω', '128 Ω', '8 Ω'], a: 2,
      why: 'Z_p = Z_s n² = 8 × 16 = 128 Ω.' },
    { q: 'A "12 V" transformer reads 14.2 V with no load connected. Is it faulty?', choices: ['Yes, it should read 12 V', 'No: the rating is at full load, and small transformers regulate poorly', 'No: meters read RMS values high', 'Yes, the turns ratio is wrong'], a: 1,
      why: 'Secondary ratings are at full load. With no load there is no drop in the winding resistance, so 10–25 % high is normal for small transformers.' },
    { q: 'Why must the secondary of a current transformer never be left open while the primary carries current?', choices: ['It would stop measuring', 'The secondary voltage can rise to kilovolts', 'It would short the primary', 'It would reverse the phase'], a: 1,
      why: 'A CT forces a current in its secondary; with no burden to carry it, the core magnetises hard and the secondary voltage rises to dangerous levels.' },
    { q: 'At twice the frequency, the same core needs only half the turns for the same voltage and peak flux.', a: true,
      why: 'V = 4.44 f N A B: doubling f halves N. This is why high-frequency transformers are so small.' }
  ],
  applications: ['Mains power supplies: isolation and step-down.', 'Flyback and forward converters in chargers and computer supplies (high-frequency ferrite transformers).', 'Current transformers for measuring AC current in meters and protection relays.', 'Audio output transformers, and isolation transformers for safe servicing of mains equipment.']
}

);
