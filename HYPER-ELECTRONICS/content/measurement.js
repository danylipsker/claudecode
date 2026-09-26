/* HYPER-ELECTRONICS · content/measurement.js — seeing what a circuit does: the
 * multimeter, the oscilloscope, and how measuring changes what you measure. */
Hyper.add(

{
  id: 'multimeter', parent: 'measurement', title: 'The multimeter', level: 1,
  short: 'Voltmeter, ammeter and ohmmeter in one box. Voltage across, current in series through the meter, resistance with the power off — and always check which socket the red lead is in.',
  keywords: ['multimeter', 'DMM', 'voltmeter', 'ammeter', 'ohmmeter', 'continuity', 'diode test', 'counts', 'accuracy', 'resolution', 'true RMS', 'CAT rating', 'fuse', 'burden voltage', 'clamp meter', 'shunt'],
  prereq: ['voltage', 'charge-and-current', 'resistance-ohms-law'],
  related: ['meter-loading', 'current-divider', 'oscilloscope', 'rms-values', 'hall-sensors'],
  body: `
The digital multimeter (DMM) is the first instrument on any bench: a voltmeter, an ammeter and an ohmmeter in one box, usually with continuity, diode test and often capacitance, frequency and temperature as well. Using it well comes down to knowing **how each function connects to the circuit**, because each one changes the circuit in a different way.

### Voltage: across the part
To measure a voltage, the two leads go **across** the part, one on each side — the meter in parallel with it. Its input resistance is high, typically 10 MΩ, so it draws almost no current and barely disturbs the circuit ([[meter-loading]]). Red lead in the V socket, black in COM; the reading is the red lead's voltage relative to the black, and a minus sign only means the red lead is on the lower side.

### Current: through the meter
To measure a current, the current must **flow through** the meter: break the circuit and put the meter in the gap, in series. Inside, the current passes through a low-value **shunt** resistor and the meter reads the voltage across it ([[current-divider]]). That drop, the **burden voltage** — around 2 mV per milliamp on the mA range of a typical handheld meter — is taken from the circuit under test.

> [!warn] The classic mistake: leaving the red lead in the A or mA socket and then measuring a voltage. The meter is now a near short circuit across whatever you probe. On a battery it blows the meter's fuse; on the mains, a cheap meter without a proper high-breaking-capacity fuse can explode in an arc flash. Check the sockets before every measurement.

The opposite mistake — a voltmeter in series — harms nothing, but the circuit stops working: 10 MΩ in the loop lets almost no current through, and the meter reads nearly the full supply voltage. The simulation lets you make both mistakes safely.

### Resistance: power off
An ohmmeter pushes a small known current through the part and measures the voltage. The circuit must be **unpowered** — other voltages corrupt the reading and can damage the meter — and a part is best measured out of circuit, because anything in parallel with it makes the reading low. The leads themselves add 0.1–0.3 Ω; use the relative (REL, Δ) mode to zero them before measuring small resistances.

**Continuity** mode beeps below a few tens of ohms. **Diode test** drives about 1 mA and shows the forward voltage: 0.5–0.7 V for a silicon junction, 0.2–0.4 V for a Schottky, 1.8–3 V for an LED (which may glow faintly), and "OL" in reverse.

### Reading the specification
- **Counts.** A 6000-count meter shows up to 5999, so its 6 V range resolves 1 mV.
- **Accuracy** is quoted as ±(% of reading + digits). ±(0.5 % + 2) on the 6 V range, reading 5.000 V, means ±(25 + 2) mV = ±27 mV.
- **AC.** Average-responding meters are calibrated for sine waves and read other shapes wrongly — 11 % high on a square wave. A **true-RMS** meter handles any waveform within its bandwidth, which on handhelds may be only a few hundred hertz to a few kilohertz ([[rms-values]]).
- **CAT ratings** (CAT II, III, IV, with a voltage) state what transient overvoltages the meter and its leads survive: CAT II for appliances and sockets, CAT III for distribution boards, CAT IV at the origin of the supply. Use a meter rated for where you are working.

### Current without breaking the circuit
Often you cannot open the circuit. Measure the voltage across a known series resistor — a current-sense resistor, or even a length of track — and divide by its resistance. Or use a **clamp meter**, which senses the magnetic field round a single conductor: a current transformer for AC, a Hall sensor for DC ([[hall-sensors]]). Clamp only one conductor: around a whole cable the outgoing and returning currents cancel.
`,
  ideas: [
    'Voltage: leads across the part, meter in parallel, high input resistance (about 10 MΩ).',
    'Current: circuit broken, meter in series, current through an internal shunt.',
    'Resistance and diode test: circuit unpowered, part preferably out of circuit.',
    'Accuracy is ±(% of reading + digits); counts set the resolution, not the accuracy.',
    'An ammeter across a source is a short circuit: check the sockets every time.'
  ],
  pitfalls: [
    'An ammeter is connected across the part, like a voltmeter — It must be in series, so the current flows through it; across a source it is a short circuit.',
    'Low voltages are safe to measure resistance on — Any voltage in the circuit corrupts an ohmmeter reading, and stored charge in capacitors can damage the meter.',
    'More digits mean more accuracy — A 6000-count display resolves 1 mV on 6 V, but the specified accuracy may be ±30 mV.'
  ],
  formulas: [
    {
      name: 'Accuracy of a reading',
      expr: 'dV = p*V + n*res', tex: '\\Delta V = p\\,V + n\\,\\delta',
      vars: {
        dV: { name: 'possible error (±)', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        p: { name: 'percentage of reading', q: 'ratio', unit: '%', value: 0.5, tex: 'p' },
        V: { name: 'reading', q: 'voltage', unit: 'V', value: 5, tex: 'V' },
        n: { name: 'number of digits (counts) added', q: 'count', unit: '', value: 2, int: true, tex: 'n' },
        res: { name: 'resolution of the range (one count)', q: 'voltage', unit: 'mV', value: 1, tex: '\\delta' }
      },
      practice: { unknowns: ['dV'] },
      stories: { dV: 'A meter specified ±({p} + {n} digits) reads {V} on a range with {res} resolution. How far could the true value be from the reading?' }
    },
    {
      name: 'Resolution of a range',
      expr: 'res = FS/N', tex: '\\delta = \\frac{V_{\\text{FS}}}{N}',
      vars: {
        res: { name: 'resolution (one count)', q: 'voltage', unit: 'mV', tex: '\\delta' },
        FS: { name: 'full-scale range', q: 'voltage', unit: 'V', value: 6, tex: 'V_{\\text{FS}}' },
        N: { name: 'counts of the display', q: 'count', unit: '', value: 6000, int: true, tex: 'N' }
      },
      stories: { res: 'A {N}-count meter is on its {FS} range. What is the smallest step it can show?' }
    },
    {
      name: 'Current from a sense resistor',
      expr: 'I = V/Rs', tex: 'I = \\frac{V}{R_s}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'mA', tex: 'I' },
        V: { name: 'voltage across the sense resistor', q: 'voltage', unit: 'mV', value: 47, tex: 'V' },
        Rs: { name: 'sense resistance', q: 'resistance', unit: 'mΩ', value: 100, tex: 'R_s' }
      },
      stories: { I: 'You read {V} across a {Rs} current-sense resistor. What current flows?' }
    }
  ],
  examples: [
    {
      title: 'Is the 3.3 V rail in specification?',
      q: 'A 3.3 V rail must be within ±1 %. A 6000-count meter on its 6 V range, specified ±(0.5 % + 3 digits), reads 3.297 V. Can you say the rail is in specification?',
      steps: [
        'Resolution on the 6 V range: 1 mV. Possible error: $0.005 \\times 3.297 + 3 \\times 0.001 = 0.0165 + 0.003 = 0.0195\\ \\mathrm{V}$.',
        'So the true voltage lies between 3.278 V and 3.317 V.',
        'The specification allows 3.267–3.333 V. The whole uncertainty band lies inside it, so yes — but the meter\'s uncertainty uses up more than half of the tolerance. For tighter limits you need a better meter.'
      ],
      a: 'Yes: the true value is 3.297 ± 0.020 V, inside 3.267–3.333 V.'
    },
    {
      title: 'Why current ranges have serious fuses',
      q: 'The red lead is left in the 10 A socket and touched, with the black lead, across a car battery (12.6 V, 8 mΩ internal). The meter\'s shunt is 10 mΩ and the leads and fuse add 0.1 Ω. What current flows?',
      steps: [
        'Loop resistance: $0.008 + 0.010 + 0.1 = 0.118\\ \\Omega$.',
        'Current: $12.6/0.118 \\approx 107\\ \\mathrm{A}$ — ten times the range.',
        'A good meter\'s high-breaking-capacity fuse clears this in milliseconds. On a mains circuit the prospective current can be thousands of amps, and a glass fuse can sustain an arc: that is what CAT ratings and HRC fuses are about.'
      ],
      a: 'About 100 A, until the fuse blows.'
    }
  ],
  quiz: [
    { q: 'To measure the current through an LED, the multimeter must be…', choices: ['connected across the LED', 'connected across the resistor', 'inserted in series, with the circuit broken', 'connected from the LED to ground'], a: 2,
      why: 'The current has to flow through the meter, so it goes into a gap in the loop. Measuring the voltage across the known series resistor and dividing is the alternative.' },
    { q: 'A voltmeter is accidentally connected in series with a lamp and a 12 V battery. What happens?', choices: ['The meter\'s fuse blows', 'The lamp stays lit and the meter reads the lamp voltage', 'The lamp goes out and the meter reads nearly 12 V', 'The meter reads zero'], a: 2,
      why: 'The meter\'s 10 MΩ lets only about a microamp flow, so the lamp is dark and drops almost nothing; almost all 12 V appears across the meter.' },
    { q: 'It is fine to measure a resistor with an ohmmeter while the circuit is powered, as long as the supply is only 5 V.', a: false,
      why: 'The ohmmeter works by driving its own small current; any other voltage in the circuit corrupts the result, and can damage the meter.' },
    { q: 'A 4000-count meter on its 4 V range can show steps of…', choices: ['0.1 mV', '1 mV', '10 mV', '4 mV'], a: 1,
      why: 'It shows up to 3.999 V: one count is 4 V/4000 = 1 mV. Whether the reading is accurate to 1 mV is a separate question.' },
    { q: 'An average-responding (not true-RMS) meter measures a symmetrical square wave of ±5 V. It displays…', choices: ['5.00 V, correct', 'about 5.55 V, 11 % high', '3.54 V', '0 V'], a: 1,
      why: 'The meter rectifies and averages (5 V here), then multiplies by 1.11, the ratio of RMS to average for a sine wave. The square wave\'s true RMS is 5 V.' }
  ],
  applications: ['Checking supply rails and node voltages when fault finding.', 'Measuring load and sleep currents of battery-powered devices.', 'Testing continuity of cables, fuses and PCB tracks.', 'Checking diodes, transistor junctions and LEDs out of circuit.'],
  sim: 'fund-meters'
},

{
  id: 'oscilloscope', parent: 'measurement', title: 'The oscilloscope', level: 2,
  short: 'A graph of voltage against time: volts per division set the vertical scale, time per division the horizontal, and the trigger makes a repeating signal stand still.',
  keywords: ['oscilloscope', 'scope', 'volts per division', 'time per division', 'time base', 'trigger', 'trigger level', 'coupling', 'AC coupling', 'probe', 'x10 probe', 'probe compensation', 'bandwidth', 'rise time', 'sample rate', 'aliasing', 'ground lead'],
  prereq: ['voltage', 'multimeter', 'periodic-waveforms'],
  related: ['meter-loading', 'rc-high-pass', 'sampling-nyquist', 'rms-values', 'switches'],
  body: `
A multimeter gives one number; an oscilloscope draws the voltage as it changes, so you can see a signal's shape, time it, and catch the glitches no meter will show. The screen is a graph: **voltage upwards, time across**, on a grid of 10 divisions across and usually 8 up.

### Vertical: volts per division
Each channel has a sensitivity in **volts per division**. At 1 V/div a 5 V logic signal spans five divisions; at 2 V/div, two and a half. Choose the setting that makes the signal fill most of the screen: a digital scope's resolution (8 bits on most) is spread over the screen height, so a small trace wastes it. A **position** control moves the trace up and down.

**Coupling** decides what reaches the screen:
- **DC** shows everything, including the steady level. Use it by default.
- **AC** puts a capacitor in series with the input, blocking the average so that a small ripple on a large DC level can be magnified. It is a high-pass filter with its corner at a few hertz ([[rc-high-pass]]), so a slow square wave tilts, or "droops" — the simulation shows it.
- **GND** disconnects the input to show where zero volts is.

### Horizontal: time per division
The **time base** sets the time per division; the whole screen covers ten times that. To see a 1 kHz signal (period 1 ms) as two to five cycles, choose 0.2–0.5 ms/div. The period is read from the grid,

$$T = n_\\text{div} \\times (\\text{time/div}), \\qquad f = \\frac{1}{T}$$

or taken from the scope's automatic measurements — which are only as good as the trace they measure.

### The trigger: making it stand still
Each sweep must start at the same point of the waveform, or successive traces land at different phases and the display is a blur. The **trigger** starts the sweep when the signal crosses a chosen **level** on a chosen **slope** (rising or falling). If the level lies outside the signal, nothing triggers: in **auto** mode the scope sweeps anyway and the trace rolls across the screen; in **normal** mode it waits and the last trace stays frozen; **single** captures one event — the tool for catching a one-off glitch or the bounce of a switch contact ([[switches]]).

### Probes
A standard passive probe has a ×1/×10 switch. At ×10 its 9 MΩ resistor, with the scope's 1 MΩ input, divides the signal by ten — and loads the circuit ten times less: about 10 MΩ in parallel with 10–15 pF, against 1 MΩ and around 100 pF at ×1, most of it the cable's capacitance. Use ×10 unless the signal is tiny. Before use, **compensate** the probe on the scope's 1 kHz square-wave output: trim its small capacitor until the corners are square, neither overshooting nor rounded ([[meter-loading]]).

> [!warn] The probe's ground clip is joined to the scope's chassis and, through the mains lead, to **earth**. Clip it to a point that is not at earth potential — anywhere on the primary side of a mains power supply, for instance — and you create a short circuit through the probe, which can vaporise the ground lead and destroy the circuit or the scope. Use a differential probe or an isolated input for such measurements; never defeat the scope's earth.

For fast edges keep the ground connection short: a 15 cm ground lead is an inductive loop that rings on nanosecond edges, while the probe's short spring tip does not.

### Bandwidth, rise time and sampling
A scope's **bandwidth** is the frequency at which a sine wave is shown 3 dB (about 30 %) too small. A square wave contains harmonics at 3, 5, 7… times its frequency, so to show its shape faithfully you need a bandwidth around five times its fundamental. The scope's own **rise time** is roughly

$$t_r \\approx \\frac{0.35}{BW}$$

— 3.5 ns for a 100 MHz scope — and it adds to the signal's in quadrature: $t_\\text{shown} \\approx \\sqrt{t_\\text{signal}^2 + t_\\text{scope}^2}$. A scope three to five times faster than the edges you measure is enough. A digital scope must also **sample** several times faster than its bandwidth; on a slow time base with too few samples per cycle, a fast signal **aliases** into a false, slower one ([[sampling-nyquist]]).
`,
  ideas: [
    'The screen is voltage against time: volts per division vertically, time per division across ten divisions.',
    'The trigger starts every sweep at the same level and slope, so a repeating signal stands still.',
    'AC coupling removes the DC level with a series capacitor, and tilts slow square waves.',
    'Use ×10 probes, compensated on the calibrator, with a short ground connection.',
    'Rise time ≈ 0.35/bandwidth; choose a scope three to five times faster than the signal.'
  ],
  pitfalls: [
    'A rolling trace means the signal is unstable — Usually the trigger level is outside the signal or on the wrong channel; the signal itself may be perfectly steady.',
    'The probe\'s ground clip can go anywhere, like a meter\'s black lead — It is earthed through the scope; on a mains-referenced point it makes a short circuit.',
    'A 100 MHz scope shows a 100 MHz square wave properly — At its bandwidth a scope shows only an attenuated fundamental; a square wave needs about five times its frequency.'
  ],
  formulas: [
    {
      name: 'Frequency from the screen',
      expr: 'f = 1/(n*tdiv)', tex: 'f = \\frac{1}{n_{\\text{div}}\\, t_{\\text{div}}}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', tex: 'f' },
        n: { name: 'divisions per period', value: 4, tex: 'n_{\\text{div}}' },
        tdiv: { name: 'time base (time per division)', q: 'time', unit: 'ms', value: 0.5, tex: 't_{\\text{div}}' }
      },
      stories: { f: 'One cycle of a signal spans {n} divisions at {tdiv} per division. What is its frequency?' }
    },
    {
      name: 'Peak-to-peak voltage from the screen',
      expr: 'Vpp = m*vdiv', tex: 'V_{\\text{pp}} = m\\, V_{\\text{div}}',
      vars: {
        Vpp: { name: 'peak-to-peak voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{pp}}' },
        m: { name: 'divisions from trough to crest', value: 5.2, tex: 'm' },
        vdiv: { name: 'vertical sensitivity (per division)', q: 'voltage', unit: 'V', value: 0.5, tex: 'V_{\\text{div}}' }
      },
      stories: { Vpp: 'A trace spans {m} divisions from trough to crest at {vdiv} per division. What is its peak-to-peak voltage?' }
    },
    {
      name: 'Rise time of a scope',
      expr: 'tr = 0.35/BW', tex: 't_r = \\frac{0.35}{\\mathrm{BW}}',
      vars: {
        tr: { name: 'rise time (10–90 %)', q: 'time', unit: 'ns', tex: 't_r' },
        BW: { name: 'bandwidth', q: 'frequency', unit: 'MHz', value: 100, tex: '\\mathrm{BW}' }
      },
      stories: { tr: 'What is the rise time of a {BW} oscilloscope?', BW: 'You need a scope whose own rise time is no more than {tr}. What bandwidth is that?' }
    },
    {
      name: 'Rise time shown on the screen',
      expr: 'ts = sqrt(tsig^2 + tscope^2)', tex: 't_{\\text{shown}} = \\sqrt{t_{\\text{sig}}^2 + t_{\\text{scope}}^2}',
      vars: {
        ts: { name: 'rise time on the screen', q: 'time', unit: 'ns', tex: 't_{\\text{shown}}' },
        tsig: { name: 'true rise time of the signal', q: 'time', unit: 'ns', value: 5, tex: 't_{\\text{sig}}' },
        tscope: { name: 'rise time of the scope (and probe)', q: 'time', unit: 'ns', value: 3.5, tex: 't_{\\text{scope}}' }
      },
      note: 'Solve for the true signal rise time to correct a measurement.',
      stories: { ts: 'An edge with a true rise time of {tsig} is viewed on a scope whose rise time is {tscope}. What does the screen show?' }
    }
  ],
  examples: [
    {
      title: 'Reading a trace',
      q: 'A sine wave on the screen repeats every 3.2 divisions at 0.2 ms/div, and spans 6.4 divisions from trough to crest at 0.5 V/div. Find its frequency, peak voltage and RMS voltage.',
      steps: [
        'Period: $T = 3.2 \\times 0.2\\ \\mathrm{ms} = 0.64\\ \\mathrm{ms}$, so $f = 1/T = 1.56\\ \\mathrm{kHz}$.',
        'Peak to peak: $6.4 \\times 0.5 = 3.2\\ \\mathrm{V}$; peak $1.6\\ \\mathrm{V}$.',
        'For a sine, RMS = peak/$\\sqrt{2}$ = 1.13 V — the number a true-RMS meter would show.'
      ],
      a: '1.56 kHz, 1.6 V peak (3.2 V p-p), 1.13 V RMS.'
    },
    {
      title: 'How fast a scope do you need?',
      q: 'You want to measure logic edges of about 20 ns rise time with no more than 5 % error. What bandwidth does the scope (with its probe) need?',
      steps: [
        'Allowed shown rise time: $1.05 \\times 20 = 21\\ \\mathrm{ns}$, so $t_\\text{scope} \\le \\sqrt{21^2 - 20^2} = 6.4\\ \\mathrm{ns}$.',
        'Bandwidth: $BW \\ge 0.35/6.4\\ \\mathrm{ns} = 55\\ \\mathrm{MHz}$.',
        'A 100 MHz scope (3.5 ns) would show $\\sqrt{20^2 + 3.5^2} = 20.3\\ \\mathrm{ns}$ — a 1.5 % error.'
      ],
      a: 'At least about 55 MHz; a 100 MHz scope is comfortable.'
    }
  ],
  quiz: [
    { q: 'A steady sine wave rolls across the screen and will not stand still. The most likely cause is…', choices: ['the signal is unstable', 'the trigger level is outside the signal\'s range', 'the volts per division is too large', 'the probe is set to ×10'], a: 1,
      why: 'If the level is never crossed, auto mode sweeps untriggered at random phases. Move the level into the signal, or check the trigger source.' },
    { q: 'At 1 ms/div, exactly five full cycles fill the ten-division screen. What is the frequency, in hertz?', answer: 500, unit: 'Hz',
      why: 'The screen spans 10 ms, so one cycle is 2 ms: f = 1/0.002 = 500 Hz.' },
    { q: 'A 5 Hz square wave is viewed with AC coupling. It looks…', choices: ['perfectly square', 'tilted: each flat top droops towards zero', 'like a sine wave', 'like a DC line'], a: 1,
      why: 'AC coupling is a high-pass filter with a corner of a few hertz. During each half-cycle the coupling capacitor charges, so the flat tops decay: use DC coupling for slow signals.' },
    { q: 'An earthed oscilloscope\'s ground clip can safely go on any point of a mains-powered circuit, as long as the scope itself is earthed.', a: false,
      why: 'The earth is exactly the problem: the clip is earthed, so on a point at mains potential it short-circuits that point to earth through the probe. Use a differential probe or an isolated input.' },
    { q: 'What is the rise time of a 350 MHz oscilloscope, approximately?', choices: ['0.1 ns', '1 ns', '3.5 ns', '10 ns'], a: 1,
      why: 't_r ≈ 0.35/BW = 0.35/(350 × 10⁶) = 1 ns.' }
  ],
  applications: ['Checking clock and data signals, timing and glitches.', 'Measuring ripple on power supplies (AC coupling).', 'Viewing switch bounce, motor-drive PWM and sensor outputs.', 'Measuring rise times, delays and frequency response.'],
  history: 'Karl Ferdinand Braun built the first cathode-ray display tube in 1897. The triggered sweep, which made repeating waveforms stand still, became standard with Tektronix\'s first oscilloscope in 1947; digital storage scopes took over from the 1980s.',
  sim: 'fund-scope'
},

{
  id: 'meter-loading', parent: 'measurement', title: 'Meter loading and accuracy', level: 2,
  short: 'Every instrument disturbs what it measures: a voltmeter loads a high-resistance node, an ammeter adds its burden, a probe adds capacitance. Know the size of the effect, and the difference between accuracy and resolution.',
  keywords: ['meter loading', 'loading effect', 'input resistance', 'input impedance', 'burden voltage', 'ohms per volt', 'four-wire', 'Kelvin', 'probe capacitance', 'accuracy', 'resolution', 'precision', 'uncertainty', 'error'],
  prereq: ['multimeter', 'thevenin-norton', 'voltage-divider'],
  related: ['oscilloscope', 'voltage-follower', 'current-divider', 'wheatstone-bridge'],
  body: `
Every measurement takes something from the circuit. A voltmeter draws a small current, an ammeter inserts a small resistance, a scope probe adds resistance and capacitance. Usually the effect is negligible; the skill is knowing when it is not.

### The voltmeter as a load
Seen from the two points you measure, the circuit is a [[thevenin-norton|Thévenin source]] $V_\\text{th}$ behind $R_\\text{th}$. The meter's input resistance $R_\\text{in}$ forms a divider with it, so it reads

$$V_\\text{meas} = V_\\text{th} \\frac{R_\\text{in}}{R_\\text{in} + R_\\text{th}}$$

— low by the fraction $R_\\text{th}/(R_\\text{in} + R_\\text{th})$, which is about $R_\\text{th}/R_\\text{in}$ when small. A 10 MΩ digital meter on a supply rail or a 1 kΩ divider is perfect. On a divider of two 1 MΩ resistors ($R_\\text{th} = 500\\ \\mathrm{k\\Omega}$) it reads 4.8 % low. An old analogue meter rated 20 kΩ/V has only 200 kΩ on its 10 V range: on a 100 kΩ / 100 kΩ divider it reads 20 % low — the simulation shows both.

Where loading bites: high-value battery-monitor dividers, CMOS inputs, MOSFET gates, reference voltages behind large resistors, and charged capacitors, which the meter slowly discharges ($\\tau = C \\times 10\\ \\mathrm{M\\Omega}$: ten seconds for 1 µF). The cures: a meter with higher input resistance (bench meters offer 10 GΩ on their low ranges), a correction from the known $R_\\text{th}$, or a [[voltage-follower]] buffer.

### The ammeter's burden
An ammeter adds its shunt and leads, a resistance $R_b$, into the loop. In a circuit of total resistance $R$ driven by $V$, the current falls from $V/R$ to

$$I_\\text{meas} = \\frac{V}{R + R_b}$$

Negligible in a 12 V, 1 kΩ circuit; not in a 1.5 V circuit of a few ohms. A classic trap is measuring a microcontroller's sleep current on the µA range, where the shunt is of the order of 100 Ω: it works until the chip wakes and draws 10 mA, drops a volt across the meter, and resets. Dedicated current-profiling tools switch shunts automatically for this reason.

### Low resistances: four wires
Measuring 0.1 Ω with two leads measures the leads and contacts too, 0.1–0.3 Ω. A **four-wire (Kelvin)** measurement drives the test current through one pair of leads and senses the voltage with a separate pair clipped right at the part; the sense leads carry almost no current, so their resistance does not matter. Current-sense resistors have four pads for the same reason.

### Probes add capacitance
A ×10 scope probe adds 10–15 pF as well as its 10 MΩ. At 10 MHz, 10 pF has a reactance of $1/(2\\pi f C) \\approx 1.6\\ \\mathrm{k\\Omega}$ — far below 10 MΩ — so on fast or high-impedance nodes the capacitance is the real load: it slows edges and can stop a crystal oscillator when you probe it ([[oscilloscope]]).

### Accuracy, resolution, precision
- **Resolution** is the smallest step the display shows: 1 mV on a 6000-count meter's 6 V range.
- **Accuracy** is how close the reading is to the truth: ±(% of reading + digits), valid within a temperature range and a calibration interval.
- **Precision** (repeatability) is how closely repeated readings agree with each other.

A meter can show five digits and be wrong in the third. When a result is calculated from several readings, their uncertainties combine ([[math:error-propagation|error propagation]]): for a product or quotient, relative uncertainties add in the worst case, or in quadrature when they are independent. A power $P = VI$ from a 0.5 % voltage and a 1 % current reading is uncertain by about 1.1 % in quadrature, 1.5 % at worst.
`,
  ideas: [
    'A voltmeter reads V_th·R_in/(R_in + R_th): low by about R_th/R_in.',
    'Keep the meter\'s input resistance at least 100 times the source\'s Thévenin resistance for 1 % accuracy.',
    'An ammeter adds its burden resistance to the loop: I = V/(R + R_b).',
    'Four-wire (Kelvin) connections remove lead resistance from low-resistance measurements.',
    'Resolution, accuracy and precision are different things; uncertainties combine when results are calculated.'
  ],
  pitfalls: [
    'A digital meter\'s 10 MΩ never loads anything — On megohm dividers, reference networks and capacitor voltages it causes errors of several per cent.',
    'An ammeter has no effect on the circuit — Its burden voltage is taken from the circuit; in low-voltage or µA-range measurements it can change the current or even reset the device.',
    'A reading with more digits is more accurate — Digits show resolution; accuracy comes from the specification and the calibration.'
  ],
  formulas: [
    {
      name: 'What a voltmeter reads',
      expr: 'Vm = Vth*Rin/(Rin + Rth)', tex: 'V_{\\text{meas}} = V_{\\text{th}} \\frac{R_{\\text{in}}}{R_{\\text{in}} + R_{\\text{th}}}',
      vars: {
        Vm: { name: 'meter reading', q: 'voltage', unit: 'V', tex: 'V_{\\text{meas}}' },
        Vth: { name: 'true (unloaded) voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{th}}' },
        Rin: { name: 'meter input resistance', q: 'resistance', unit: 'MΩ', value: 10, tex: 'R_{\\text{in}}' },
        Rth: { name: 'Thévenin resistance of the point measured', q: 'resistance', unit: 'kΩ', value: 500, tex: 'R_{\\text{th}}' }
      },
      stories: { Vm: 'A point at {Vth} with a Thévenin resistance of {Rth} is measured with a {Rin} meter. What does it read?' }
    },
    {
      name: 'Relative loading error of a voltmeter',
      expr: 'err = Rth/(Rin + Rth)', tex: '\\varepsilon = \\frac{R_{\\text{th}}}{R_{\\text{in}} + R_{\\text{th}}}',
      vars: {
        err: { name: 'reading low by', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        Rth: { name: 'Thévenin resistance of the point measured', q: 'resistance', unit: 'kΩ', value: 50, tex: 'R_{\\text{th}}' },
        Rin: { name: 'meter input resistance', q: 'resistance', unit: 'kΩ', value: 200, tex: 'R_{\\text{in}}' }
      },
      stories: { err: 'An analogue meter with {Rin} on its range measures a point whose Thévenin resistance is {Rth}. By how much does it read low?', Rin: 'The loading error must be below {err} on a point of {Rth}. What input resistance is needed?' }
    },
    {
      name: 'Current with an ammeter in the loop',
      expr: 'Im = V/(R + Rb)', tex: 'I_{\\text{meas}} = \\frac{V}{R + R_b}',
      vars: {
        Im: { name: 'current with the meter in place', q: 'current', unit: 'mA', tex: 'I_{\\text{meas}}' },
        V: { name: 'driving voltage', q: 'voltage', unit: 'V', value: 1.5, tex: 'V' },
        R: { name: 'resistance of the circuit', q: 'resistance', unit: 'Ω', value: 4.9, tex: 'R' },
        Rb: { name: 'meter burden resistance (shunt and leads)', q: 'resistance', unit: 'Ω', value: 0.13, tex: 'R_b' }
      },
      stories: { Im: 'A {V} cell drives a circuit of {R}. An ammeter with {Rb} of shunt and leads is inserted. What current does it read?' }
    },
    {
      name: 'Combined uncertainty of a product (independent errors)',
      expr: 'u = sqrt(u1^2 + u2^2)', tex: 'u = \\sqrt{u_1^2 + u_2^2}',
      vars: {
        u: { name: 'relative uncertainty of the result', q: 'ratio', unit: '%', tex: 'u' },
        u1: { name: 'relative uncertainty of the first reading', q: 'ratio', unit: '%', value: 0.5, tex: 'u_1' },
        u2: { name: 'relative uncertainty of the second reading', q: 'ratio', unit: '%', value: 1, tex: 'u_2' }
      },
      note: 'For P = VI or R = V/I. The worst case is the plain sum u₁ + u₂.',
      stories: { u: 'A power is calculated from a voltage known to {u1} and a current known to {u2}. How uncertain is it?' }
    }
  ],
  examples: [
    {
      title: 'Calibrating against a loaded reading',
      q: 'A 12 V battery monitor uses 1 MΩ over 330 kΩ to feed an ADC. A technician checks the divider output with a 10 MΩ meter, to calibrate the firmware. What does the meter read, and what should the output be?',
      steps: [
        'True output: $12 \\times 330/1330 = 2.977\\ \\mathrm{V}$.',
        'Thévenin resistance: $1\\ \\mathrm{M\\Omega} \\parallel 330\\ \\mathrm{k\\Omega} = 248\\ \\mathrm{k\\Omega}$.',
        'Reading: $2.977 \\times 10/(10 + 0.248) = 2.905\\ \\mathrm{V}$ — 2.4 % low.',
        'Calibrating the firmware to the meter would build a 2.4 % error into every battery reading. Measure the battery itself instead (a low-impedance point) and calculate. Note that the ADC\'s sampling capacitor also wants a low source impedance: a 100 nF capacitor on the divider output helps it.'
      ],
      a: 'The meter reads 2.905 V; the true output is 2.977 V.'
    },
    {
      title: 'The ammeter that changes the current',
      q: 'A 1.5 V cell (0.2 Ω internal) drives a 4.7 Ω load. An ammeter on its 10 A range adds 0.03 Ω of shunt and 0.1 Ω of leads. What current flows with and without it?',
      steps: [
        'Without the meter: $1.5/(4.7 + 0.2) = 306\\ \\mathrm{mA}$.',
        'With it: $1.5/(4.9 + 0.13) = 298\\ \\mathrm{mA}$ — 2.6 % lower, because the meter took 39 mV of a 1.5 V budget.',
        'For low-voltage circuits, measure the voltage across a known resistor already in the circuit, or use a clamp meter.'
      ],
      a: '306 mA without, 298 mA with the meter.'
    }
  ],
  quiz: [
    { q: 'Which instrument reads the midpoint of a 1 MΩ / 1 MΩ divider most accurately?', choices: ['An analogue meter rated 20 kΩ/V on its 10 V range', 'A 10 MΩ digital multimeter', 'A bench meter with 10 GΩ input resistance', 'All read the same'], a: 2,
      why: 'R_th is 500 kΩ. The analogue meter (200 kΩ) reads only 29 % of the true value, the 10 MΩ meter 95 %, the 10 GΩ meter 99.995 %.' },
    { q: 'A 10 MΩ meter measures a point with a Thévenin resistance of 100 kΩ. It reads low by about…', choices: ['0.1 %', '1 %', '10 %', '0 %'], a: 1,
      why: 'R_th/(R_in + R_th) = 0.1/10.1 ≈ 1 %.' },
    { q: 'A ×10 probe loads a circuit less than a ×1 probe.', a: true,
      why: 'At ×10 the probe presents about 10 MΩ and 10–15 pF, against 1 MΩ and around 100 pF at ×1 — at the price of ten times less sensitivity.' },
    { q: 'In a four-wire resistance measurement, why does the resistance of the sense leads not matter?', choices: ['They are made of silver', 'They carry almost no current, so they drop almost no voltage', 'The meter subtracts them', 'They are shorter than the drive leads'], a: 1,
      why: 'The drive current flows in the other pair. With no current, the sense leads\' resistance produces no voltage error.' },
    { q: 'A meter shows 1.00046 V. You can conclude the voltage is known to 10 µV.', a: false,
      why: 'Those digits are resolution. The accuracy comes from the specification, e.g. ±(0.01 % + 5 counts), and the calibration.' }
  ],
  applications: ['Checking high-impedance dividers, references and sensor outputs.', 'Measuring sleep and burst currents of low-power devices.', 'Four-wire measurement of shunts, contacts and windings.', 'Uncertainty budgets for test and calibration reports.'],
  sim: { id: 'fund-meters', params: { scale: 1e5, meter: 'analog' } }
}

);
