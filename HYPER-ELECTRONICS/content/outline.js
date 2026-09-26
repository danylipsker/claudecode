/* HYPER-ELECTRONICS · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 *
 * Electronics here is the practical, engineering side: how to design, build, measure
 * and understand real circuits. The physics underneath (charge, fields, quantum
 * mechanics of semiconductors) lives in Hyper Physics and is linked as physics:<id>;
 * the mathematics (complex numbers, differential equations, logarithms) as math:<id>.
 */
Hyper.add(
  {
    id: 'electronics', kind: 'root', title: 'Hyper Electronics',
    short: 'Electronics as a map of connected ideas: from Ohm\'s law to op-amps, power converters and logic — every concept explained, every formula a calculator, every circuit a live simulation.',
    body: ''
  },

  /* ================================================================ CIRCUIT FUNDAMENTALS */
  {
    id: 'circuit-fundamentals', kind: 'branch', parent: 'electronics', title: 'Circuit Fundamentals', icon: 'meter', hue: 212,
    short: 'Voltage, current, resistance and power, the laws that tie them together, and the methods for solving any circuit.',
    body: 'Every circuit, from a torch to a computer, obeys the same few rules: charge is conserved (Kirchhoff\'s current law), energy is conserved (Kirchhoff\'s voltage law), and each component relates the voltage across it to the current through it. Learn to see a circuit as those rules, and to simplify it with dividers, equivalents and superposition, and every later branch becomes a matter of new components on the same foundation.'
  },
  { id: 'dc-basics', kind: 'topic', parent: 'circuit-fundamentals', title: 'Voltage, current and resistance', short: 'The quantities of a circuit, the components that relate them, and the two ways of connecting them.',
    plan: [['charge-and-current', 'Charge and current'], ['voltage', 'Voltage'], ['resistance-ohms-law', 'Resistance and Ohm\'s law'], ['power-energy', 'Power and energy'],
           ['series-parallel', 'Series and parallel circuits'], ['voltage-divider', 'The voltage divider'], ['current-divider', 'The current divider'], ['sources', 'Voltage and current sources']] },
  { id: 'circuit-analysis', kind: 'topic', parent: 'circuit-fundamentals', title: 'Circuit analysis', short: 'Systematic ways to find every voltage and current, and to replace a network by something simpler.',
    plan: [['kirchhoffs-laws', 'Kirchhoff\'s laws'], ['nodal-analysis', 'Nodal analysis'], ['mesh-analysis', 'Mesh analysis'], ['superposition', 'Superposition'],
           ['thevenin-norton', 'Thévenin and Norton equivalents'], ['max-power-transfer', 'Maximum power transfer'], ['wheatstone-bridge', 'The Wheatstone bridge']] },
  { id: 'measurement', kind: 'topic', parent: 'circuit-fundamentals', title: 'Measurement', short: 'Seeing what a circuit does: meters, the oscilloscope, and how measuring changes what you measure.',
    plan: [['multimeter', 'The multimeter'], ['oscilloscope', 'The oscilloscope'], ['meter-loading', 'Meter loading and accuracy']] },

  /* ================================================================ COMPONENTS */
  {
    id: 'components', kind: 'branch', parent: 'electronics', title: 'Components', icon: 'resistor', hue: 150,
    short: 'The parts in the drawer: resistors, capacitors, inductors and transformers as they really are, switches and relays, protection, and sensors.',
    body: 'A schematic shows ideal parts; the ones on the bench have tolerances, power ratings, parasitic inductance, leakage and temperature coefficients. Knowing the difference is what makes a design work first time: choosing the resistor that will not overheat, the capacitor that keeps its value at 60 °C, the relay that can switch a motor, the fuse that blows before the wire does, and the sensor that turns a temperature or a strain into a voltage.'
  },
  { id: 'passive-components', kind: 'topic', parent: 'components', title: 'Passive components', short: 'Resistors, potentiometers, capacitors, inductors and transformers in practice.',
    plan: [['resistors', 'Resistors: values, tolerance and power'], ['potentiometers', 'Potentiometers and rheostats'], ['capacitors', 'Capacitors in practice'], ['inductors', 'Inductors in practice'], ['transformers-practical', 'Transformers in practice']] },
  { id: 'switching-protection', kind: 'topic', parent: 'components', title: 'Switches, relays and protection', short: 'Making and breaking circuits safely, and wiring sized for the current.',
    plan: [['switches', 'Switches and contact bounce'], ['relays', 'Relays'], ['fuses-protection', 'Fuses and circuit protection'], ['wire-sizing', 'Wire gauge, resistance and current capacity']] },
  { id: 'sensors', kind: 'topic', parent: 'components', title: 'Sensors and transducers', short: 'Turning temperature, strain, magnetic field and light into electrical signals.',
    plan: [['thermistors-rtd', 'Thermistors and RTDs'], ['thermocouples', 'Thermocouples'], ['strain-gauges', 'Strain gauges and load cells'], ['hall-sensors', 'Hall-effect sensors'], ['sensor-interfacing', 'Signal conditioning for sensors']] },

  /* ================================================================ AC AND SIGNALS */
  {
    id: 'ac-signals', kind: 'branch', parent: 'electronics', title: 'AC and Signals', icon: 'sine', hue: 35,
    short: 'Signals that change: waveforms and their measures, transients when a circuit switches, and alternating current described with phasors and impedance.',
    body: 'Most interesting electronics happens when things change. A capacitor or inductor responds to change with a characteristic time, so every switch-on has a transient. A steady sine wave is so common — mains, radio, audio — that engineers describe it with phasors, turning calculus into algebra with complex impedance. And any repeating signal can be seen as a sum of sines, which is why frequency is the most useful word in electronics.'
  },
  { id: 'waveforms', kind: 'topic', parent: 'ac-signals', title: 'Signals and waveforms', short: 'Sine, square and triangle waves, their averages and RMS, decibels, spectra and noise.',
    plan: [['periodic-waveforms', 'Periodic waveforms'], ['rms-values', 'Peak, average and RMS values'], ['decibels', 'Decibels'], ['spectrum-harmonics', 'Spectrum and harmonics'], ['noise-snr', 'Noise and signal-to-noise ratio']] },
  { id: 'transients', kind: 'topic', parent: 'ac-signals', title: 'Transients', short: 'What happens when a circuit switches: exponential charging, and the ringing of an RLC circuit.',
    plan: [['rc-transient', 'RC charging and discharging'], ['rl-transient', 'RL transients'], ['rlc-transient', 'RLC step response and damping']] },
  { id: 'ac-analysis', kind: 'topic', parent: 'ac-signals', title: 'AC circuit analysis', short: 'Phasors and impedance, AC power and power factor, resonance, and three-phase supply.',
    plan: [['phasors-ac', 'Phasors'], ['impedance', 'Impedance and reactance'], ['ac-power', 'Real, reactive and apparent power'], ['power-factor-correction', 'Power factor correction'],
           ['resonance-q', 'Resonance and Q factor'], ['three-phase', 'Three-phase power']] },

  /* ================================================================ FILTERS */
  {
    id: 'filters', kind: 'branch', parent: 'electronics', title: 'Filters and Frequency Response', icon: 'filter', hue: 60,
    short: 'How circuits treat different frequencies: transfer functions, Bode plots, and passive and active filters.',
    body: 'Feed a circuit a sine wave and it comes out as a sine wave of the same frequency, only scaled and shifted. How much, at each frequency, is its frequency response — drawn as a Bode plot on logarithmic axes, where the slopes tell the whole story. Filters exploit it to keep what you want (a voice, a sensor reading) and reject what you do not (hum, hiss, switching noise).'
  },
  { id: 'frequency-response', kind: 'topic', parent: 'filters', title: 'Frequency response and filters', short: 'Transfer functions, Bode plots, RC filters, band-pass and band-stop, filter order, active filters and decoupling.',
    plan: [['transfer-function', 'Transfer functions'], ['bode-plots', 'Bode plots'], ['rc-low-pass', 'The RC low-pass filter'], ['rc-high-pass', 'The RC high-pass filter'],
           ['band-pass-stop', 'Band-pass and band-stop filters'], ['filter-order', 'Filter order and the Butterworth response'], ['active-filters', 'Active filters'], ['decoupling', 'Decoupling and bypass capacitors']] },

  /* ================================================================ DIODES */
  {
    id: 'diodes', kind: 'branch', parent: 'electronics', title: 'Diodes', icon: 'diode', hue: 5,
    short: 'The one-way valve of electronics: how a p–n junction conducts, and the rectifiers, regulators, LEDs and sensors built from it.',
    body: 'A diode lets current through one way and blocks it the other — with a small forward voltage to pay, a reverse limit not to exceed, and a curve that is exponential rather than a switch. That simple behaviour turns AC into DC, holds a voltage steady, protects transistors from inductive spikes, lights a room, and measures light.'
  },
  { id: 'diode-basics', kind: 'topic', parent: 'diodes', title: 'The diode', short: 'From doped silicon to the diode equation, the models engineers use, and the kinds of diode.',
    plan: [['semiconductor-basics', 'Semiconductors for electronics'], ['pn-diode', 'The p–n junction diode'], ['diode-models', 'Diode models: ideal, 0.7 V and Shockley'], ['zener-diodes', 'Zener diodes'], ['diode-types', 'Schottky, fast-recovery and other diodes']] },
  { id: 'diode-circuits', kind: 'topic', parent: 'diodes', title: 'Diode circuits', short: 'Rectifiers and smoothing, Zener regulators, clippers, clampers, multipliers and flyback protection.',
    plan: [['half-wave-rectifier', 'The half-wave rectifier'], ['full-wave-rectifier', 'Full-wave and bridge rectifiers'], ['smoothing-ripple', 'Smoothing capacitors and ripple'], ['zener-regulator', 'The Zener voltage regulator'],
           ['clippers-clampers', 'Clippers and clampers'], ['voltage-multiplier', 'Voltage multipliers'], ['flyback-diode', 'Flyback diodes and inductive kick']] },
  { id: 'optoelectronics', kind: 'topic', parent: 'diodes', title: 'Optoelectronics', short: 'Diodes and light: LEDs, photodiodes, solar cells and optocouplers.',
    plan: [['leds', 'LEDs and the current-limiting resistor'], ['photodiodes', 'Photodiodes and phototransistors'], ['solar-cells', 'Solar cells'], ['optocouplers', 'Optocouplers']] },

  /* ================================================================ TRANSISTORS */
  {
    id: 'transistors', kind: 'branch', parent: 'electronics', title: 'Transistors', icon: 'transistor', hue: 262,
    short: 'The device behind everything: bipolar and field-effect transistors as switches and amplifiers, and the circuits built from them.',
    body: 'A transistor lets a small signal control a large current. Used as a switch it turns motors, lamps and whole computers on and off; used in its linear region it amplifies. The bipolar transistor is controlled by a base current, the MOSFET by a gate voltage — and the details of each decide how you bias it, drive it, protect it and keep it cool.'
  },
  { id: 'bjt', kind: 'topic', parent: 'transistors', title: 'Bipolar transistors', short: 'How a BJT works, its three regions, and its use as a switch and as an amplifier.',
    plan: [['bjt-operation', 'How a bipolar transistor works'], ['bjt-regions', 'Cut-off, active and saturation'], ['bjt-switch', 'The BJT as a switch'], ['bjt-biasing', 'Biasing a BJT amplifier'],
           ['common-emitter', 'The common-emitter amplifier'], ['emitter-follower', 'The emitter follower'], ['darlington', 'Darlington pairs']] },
  { id: 'mosfet', kind: 'topic', parent: 'transistors', title: 'MOSFETs', short: 'The voltage-controlled transistor: how it works, how to switch it hard, and what that costs.',
    plan: [['mosfet-operation', 'How a MOSFET works'], ['mosfet-switch', 'The MOSFET as a switch'], ['gate-drive', 'Gate drive and switching losses']] },
  { id: 'transistor-circuits', kind: 'topic', parent: 'transistors', title: 'Transistor circuits', short: 'Current sources and mirrors, the differential pair, output stages, H-bridges and heat sinks.',
    plan: [['current-mirrors', 'Current sources and mirrors'], ['differential-pair', 'The differential pair'], ['push-pull', 'Push-pull output stages'], ['h-bridge', 'H-bridges and motor drive'], ['heat-sinks', 'Power dissipation and heat sinks']] },

  /* ================================================================ OP-AMPS */
  {
    id: 'op-amps', kind: 'branch', parent: 'electronics', title: 'Operational Amplifiers', icon: 'opamp', hue: 300,
    short: 'The universal analogue building block: ideal op-amp rules, the classic circuits, and the limits of real parts.',
    body: 'An op-amp is an amplifier with enormous gain, used almost always with negative feedback. Feedback makes the gain whatever two resistors say, and two golden rules — no input current, and the inputs driven to equal voltages — are enough to design amplifiers, buffers, summers, integrators, filters and more. Real op-amps then add their own limits: bandwidth, slew rate, offsets and output swing.'
  },
  { id: 'opamp-basics', kind: 'topic', parent: 'op-amps', title: 'The op-amp', short: 'The ideal op-amp, negative feedback, and the op-amp without feedback: comparators and Schmitt triggers.',
    plan: [['ideal-opamp', 'The ideal op-amp and its golden rules'], ['negative-feedback', 'Negative feedback'], ['comparators', 'Comparators'], ['schmitt-trigger', 'The Schmitt trigger']] },
  { id: 'opamp-circuits', kind: 'topic', parent: 'op-amps', title: 'Op-amp circuits', short: 'The classic configurations and what each one is for.',
    plan: [['inverting-amplifier', 'The inverting amplifier'], ['non-inverting-amplifier', 'The non-inverting amplifier'], ['voltage-follower', 'The voltage follower'], ['summing-amplifier', 'The summing amplifier'],
           ['difference-amplifier', 'The difference amplifier'], ['instrumentation-amplifier', 'The instrumentation amplifier'], ['integrator-differentiator', 'Integrator and differentiator'], ['transimpedance', 'The transimpedance amplifier']] },
  { id: 'opamp-real', kind: 'topic', parent: 'op-amps', title: 'Real op-amps', short: 'Where the ideal breaks down: gain–bandwidth, slew rate, offsets, and supply rails.',
    plan: [['gain-bandwidth', 'Gain–bandwidth product'], ['slew-rate', 'Slew rate'], ['offset-bias', 'Offset voltage and bias currents'], ['single-supply', 'Supply rails, rail-to-rail and single-supply design']] },

  /* ================================================================ POWER ELECTRONICS */
  {
    id: 'power-electronics', kind: 'branch', parent: 'electronics', title: 'Power Electronics', icon: 'battery', hue: 95,
    short: 'Supplying and converting power: linear regulators, switching converters and PWM, batteries and motor control.',
    body: 'Every circuit needs the right voltage, delivered efficiently. A linear regulator is simple and quiet but burns the difference as heat; a switching converter chops the input and filters it, reaching 90 % efficiency or more. Pulse-width modulation — switching fast and varying the duty cycle — also dims LEDs and sets motor speeds, and batteries bring their own rules for capacity, current and charging.'
  },
  { id: 'power-supplies', kind: 'topic', parent: 'power-electronics', title: 'Power supplies', short: 'From the mains to a steady DC rail: linear regulators and the design of a complete supply.',
    plan: [['linear-regulators', 'Linear regulators and LDOs'], ['power-supply-design', 'Designing a linear power supply']] },
  { id: 'switching-converters', kind: 'topic', parent: 'power-electronics', title: 'Switching converters', short: 'PWM, and the buck, boost and buck–boost converters with their losses.',
    plan: [['pwm', 'Pulse-width modulation'], ['buck-converter', 'The buck converter'], ['boost-converter', 'The boost converter'], ['buck-boost', 'Buck–boost and inverting converters'], ['converter-losses', 'Losses and efficiency in converters']] },
  { id: 'energy-storage', kind: 'topic', parent: 'power-electronics', title: 'Batteries and motors', short: 'Batteries and supercapacitors, and driving DC motors.',
    plan: [['batteries', 'Batteries: capacity, C-rate and internal resistance'], ['supercapacitors', 'Supercapacitors'], ['dc-motor-control', 'DC motors and speed control']] },

  /* ================================================================ DIGITAL */
  {
    id: 'digital', kind: 'branch', parent: 'electronics', title: 'Digital Electronics', icon: 'gate', hue: 185,
    short: 'Ones and zeros: number systems, logic gates and Boolean algebra, combinational and sequential logic, and the bridge to the analogue world.',
    body: 'Digital circuits decide only between two levels, which makes them tolerant of noise and easy to combine by the million. Logic gates and Boolean algebra build decisions; flip-flops add memory and a clock adds time, giving counters, registers and state machines — the organs of every microcontroller. At the edges, converters and buses connect that world to sensors, actuators and other chips.'
  },
  { id: 'logic-basics', kind: 'topic', parent: 'digital', title: 'Logic', short: 'Binary numbers, gates, Boolean algebra, Karnaugh maps, logic families and pull resistors.',
    plan: [['binary-numbers', 'Binary, hexadecimal and two\'s complement'], ['logic-gates', 'Logic gates'], ['boolean-algebra', 'Boolean algebra and De Morgan\'s laws'], ['karnaugh-maps', 'Karnaugh maps'],
           ['logic-families', 'Logic levels and families: TTL and CMOS'], ['cmos-logic', 'How CMOS gates work'], ['pull-resistors', 'Pull-up and pull-down resistors']] },
  { id: 'combinational', kind: 'topic', parent: 'digital', title: 'Combinational logic', short: 'Circuits whose output depends only on the present inputs: multiplexers, decoders and adders.',
    plan: [['multiplexers', 'Multiplexers and demultiplexers'], ['decoders-encoders', 'Decoders and encoders'], ['binary-adders', 'Binary adders']] },
  { id: 'sequential', kind: 'topic', parent: 'digital', title: 'Sequential logic', short: 'Memory and time: latches, flip-flops, counters, shift registers, state machines and timing.',
    plan: [['latches', 'Latches'], ['flip-flops', 'Flip-flops'], ['counters', 'Counters'], ['shift-registers', 'Shift registers'], ['state-machines', 'Finite state machines'], ['timing-clocks', 'Clocks, propagation delay, setup and hold']] },
  { id: 'mixed-signal', kind: 'topic', parent: 'digital', title: 'Between analogue and digital', short: 'Sampling, ADCs and DACs, serial buses and microcontrollers.',
    plan: [['sampling-nyquist', 'Sampling and the Nyquist theorem'], ['adc', 'Analogue-to-digital converters'], ['dac', 'Digital-to-analogue converters'], ['serial-buses', 'Serial buses: UART, I²C and SPI'], ['microcontrollers', 'Microcontrollers']] },

  /* ================================================================ OSCILLATORS AND RF */
  {
    id: 'oscillators-rf', kind: 'branch', parent: 'electronics', title: 'Oscillators and RF', icon: 'antenna', hue: 330,
    short: 'Circuits that make their own signals — oscillators, timers and PLLs — and the radio-frequency world of modulation, transmission lines and antennas.',
    body: 'Feed an amplifier\'s output back to its input with the right phase and it sings at its own frequency: that is an oscillator, the heartbeat of clocks, radios and computers. At radio frequencies wires stop being wires and become transmission lines with a characteristic impedance, signals reflect from mismatches, and antennas turn currents into waves.'
  },
  { id: 'oscillators', kind: 'topic', parent: 'oscillators-rf', title: 'Oscillators and timers', short: 'The condition for oscillation, RC, LC, crystal and relaxation oscillators, the 555 timer and the PLL.',
    plan: [['oscillator-principle', 'Oscillators and the Barkhausen criterion'], ['rc-oscillators', 'RC oscillators: phase shift and Wien bridge'], ['lc-oscillators', 'LC oscillators: Colpitts and Hartley'], ['crystal-oscillators', 'Crystal oscillators'],
           ['relaxation-oscillators', 'Relaxation oscillators'], ['timer-555', 'The 555 timer'], ['pll', 'Phase-locked loops']] },
  { id: 'rf', kind: 'topic', parent: 'oscillators-rf', title: 'Radio and transmission lines', short: 'Modulation, transmission lines, reflections and matching, and antennas.',
    plan: [['modulation', 'AM and FM modulation'], ['transmission-lines', 'Transmission lines and characteristic impedance'], ['reflections-matching', 'Reflections, SWR and impedance matching'], ['antennas', 'Antennas']] }
);
