/* HYPER-ELECTRONICS · content/ac-analysis.js — AC circuit analysis: phasors, impedance,
 * real/reactive/apparent power, power-factor correction, resonance and Q, three-phase. */
Hyper.add(

{
  id: 'phasors-ac', parent: 'ac-analysis', title: 'Phasors', level: 2,
  short: 'A sine wave of known frequency is fully described by its amplitude and phase — one complex number, drawn as a rotating arrow. Phasors turn the calculus of AC circuits into algebra.',
  keywords: ['phasor', 'complex number', 'rotating vector', 'amplitude', 'phase angle', 'polar form', 'rectangular form', 'j operator', 'phasor diagram', 'lead', 'lag', 'sinusoidal steady state', 'RMS phasor'],
  prereq: ['periodic-waveforms', 'math:complex-numbers', 'math:phasors', 'math:eulers-formula'],
  related: ['impedance', 'ac-power', 'three-phase', 'physics:rlc-impedance', 'math:polar-form'],
  body: `
Drive a circuit of resistors, capacitors and inductors with a sine wave and wait for the switch-on transient to die away. Every voltage and every current in it is then a sine of the **same frequency**. They differ in only two things: how big they are and how far they are shifted in time. So each needs just two numbers — an amplitude and a phase — and a complex number holds exactly two numbers. That complex number is a **phasor**.

### The rotating arrow
Picture an arrow of length $V_p$ turning anticlockwise at $\\omega$ radians per second. Its shadow on an axis rises and falls as a sine wave: that is the waveform. Freeze the arrow at $t = 0$ and you have the phasor,
$$\\mathbf{V} = V_p\\,\\angle\\,\\varphi = V_p\\,e^{j\\varphi} = V_p\\cos\\varphi + jV_p\\sin\\varphi$$
Engineers write $j$ for $\\sqrt{-1}$ because $i$ is taken by current. The waveform is recovered by letting the arrow turn again: $v(t) = \\mathrm{Re}\\left(\\mathbf{V}e^{j\\omega t}\\right) = V_p\\cos(\\omega t + \\varphi)$. (Some books use the sine and the imaginary part instead — the simulation does, projecting onto the vertical axis. It shifts every phase by the same 90° and changes nothing else.)

All the arrows of one circuit turn together, so their **relative** angles never change. A phasor ahead of another in the anticlockwise sense **leads** it; one behind **lags**.

### Why it works: calculus becomes algebra
Differentiating $e^{j\\omega t}$ just multiplies it by $j\\omega$. So for phasors
$$\\frac{d}{dt} \\;\\longrightarrow\\; \\times j\\omega, \\qquad \\int dt \\;\\longrightarrow\\; \\div j\\omega$$
The inductor's $v = L\\,di/dt$ becomes $\\mathbf{V} = j\\omega L\\,\\mathbf{I}$, the capacitor's $i = C\\,dv/dt$ becomes $\\mathbf{I} = j\\omega C\\,\\mathbf{V}$. The differential equations of a circuit turn into complex linear equations, solved with Ohm's and Kirchhoff's laws exactly as in DC — that is [[impedance]]. Multiplying by $j$ is a rotation by +90°: the inductor's voltage leads its current by a quarter cycle.

### Doing the arithmetic
- **Adding** sines of one frequency is adding phasors as vectors (tip to tail). $3\\ \\mathrm{V}\\angle 0^\\circ$ plus $4\\ \\mathrm{V}\\angle 90^\\circ$ is $5\\ \\mathrm{V}\\angle 53.1^\\circ$ — not 7 V. Kirchhoff's laws hold for phasors, not for their sizes.
- **Converting**: $a + jb = r\\angle\\theta$ with $r = \\sqrt{a^2 + b^2}$ and $\\theta = \\arctan(b/a)$ (add 180° if $a < 0$); back again with $a = r\\cos\\theta$, $b = r\\sin\\theta$.
- **Multiplying and dividing**: multiply the sizes and add the angles; divide the sizes and subtract the angles. Use rectangular form to add, polar form to multiply.

### Peak or RMS?
The length of the arrow can be the peak value or the RMS value; power engineers almost always use RMS ("230 V ∠ 0°"), signal work often uses peak. Either is fine if you stay consistent — the ratios and angles are the same.

> [!note] Phasors describe **one frequency** in the **steady state** of a **linear** circuit. A square wave needs one phasor per harmonic ([[spectrum-harmonics]]); a switch-on transient needs the time domain ([[rlc-transient]]).
`,
  ideas: [
    'In a linear circuit driven by one sine, every quantity is a sine of that frequency: only amplitude and phase differ.',
    'A phasor is the complex number V_p∠φ; the waveform is the shadow of the arrow turning at ω.',
    'd/dt becomes multiplication by jω, which turns circuit equations into algebra.',
    'Sines of one frequency add as phasors (tip to tail), not by their sizes.',
    'Multiplying by j rotates a phasor by +90°: a quarter-cycle lead.'
  ],
  pitfalls: [
    'A phasor is an arrow in space — It is a complex number holding the amplitude and phase of a sine in time; the rotation pictures time passing, not anything moving.',
    'Phasor sizes add like numbers — Only when the phasors are in phase. In general they add as complex numbers: 3 V and 4 V at 90° make 5 V.',
    'Phasors work for any signal — Only for sinusoids of one frequency, in the steady state of a linear circuit. Other waveforms need one phasor per harmonic, or time-domain analysis.'
  ],
  derivation: {
    title: 'Why differentiation becomes multiplication by jω',
    steps: [
      { text: 'Write the waveform as the real part of a rotating phasor:', tex: 'v(t) = \\mathrm{Re}\\left(\\mathbf{V}e^{j\\omega t}\\right)' },
      { text: 'The derivative of the exponential brings down $j\\omega$:', tex: '\\frac{dv}{dt} = \\mathrm{Re}\\left(j\\omega\\,\\mathbf{V}e^{j\\omega t}\\right)' },
      { text: 'So the phasor of $dv/dt$ is $j\\omega\\mathbf{V}$. For an inductor, $v = L\\,di/dt$ gives', tex: '\\mathbf{V} = j\\omega L\\,\\mathbf{I}' },
      { text: 'and since $j = e^{j\\pi/2}$, the voltage is the current rotated by 90° and scaled by $\\omega L$.', tex: 'j\\omega L\\,\\mathbf{I} = \\omega L\\,|\\mathbf{I}|\\angle\\left(\\varphi_I + 90^{\\circ}\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Size of a phasor from its components',
      expr: 'r = sqrt(a^2 + b^2)', tex: 'V_m = \\sqrt{a^2 + b^2}',
      vars: {
        r: { name: 'magnitude (size) of the phasor', q: 'voltage', unit: 'V', tex: 'V_m' },
        a: { name: 'real (in-phase) part', q: 'voltage', unit: 'V', value: 3, signed: true },
        b: { name: 'imaginary (quadrature) part', q: 'voltage', unit: 'V', value: 4, signed: true }
      },
      stories: { r: 'A phasor is {a} + j{b}. What is its size?' }
    },
    {
      name: 'Angle of a phasor',
      expr: 'phi = atan(b/a)', tex: '\\varphi = \\arctan\\frac{b}{a}',
      vars: {
        phi: { name: 'phase angle', q: 'angle', unit: '°', signed: true, tex: '\\varphi' },
        b: { name: 'imaginary part', q: 'voltage', unit: 'V', value: 4, signed: true },
        a: { name: 'real part (positive)', q: 'voltage', unit: 'V', value: 3 }
      },
      note: 'For a positive real part. If $a < 0$ the phasor points left: add 180°.',
      stories: { phi: 'At what angle does the phasor {a} + j{b} point?' }
    },
    {
      name: 'In-phase component from polar form',
      expr: 'a = r*cos(phi)', tex: 'a = V_m\\cos\\varphi',
      vars: {
        a: { name: 'real part', q: 'voltage', unit: 'V', signed: true },
        r: { name: 'magnitude of the phasor', q: 'voltage', unit: 'V', value: 230, tex: 'V_m' },
        phi: { name: 'angle', q: 'angle', unit: '°', value: 30, min: -180, max: 180, signed: true, tex: '\\varphi' }
      },
      note: 'The quadrature part is $b = V_m\\sin\\varphi$.',
      stories: { a: 'A voltage of {r} at {phi}: what is its in-phase (real) component?' }
    }
  ],
  examples: [
    {
      title: 'Adding two voltages',
      q: 'Two 50 Hz voltages, $v_1 = 10\\sin\\omega t$ and $v_2 = 10\\sin(\\omega t + 60^\\circ)$, are connected in series. What is the total?',
      steps: [
        'Phasors: $10\\angle 0^\\circ = 10 + j0$ and $10\\angle 60^\\circ = 5 + j8.66$.',
        'Add the components: $15 + j8.66$.',
        'Back to polar: $\\sqrt{15^2 + 8.66^2} = 17.3$ at $\\arctan(8.66/15) = 30^\\circ$.',
        'So $v_1 + v_2 = 17.3\\sin(\\omega t + 30^\\circ)$ — less than the 20 V a meter-reading sum would suggest.'
      ],
      a: '17.3 V peak, leading v₁ by 30°.'
    },
    {
      title: 'An inductor\'s voltage',
      q: 'A current of 0.5 A peak at 1 kHz flows through a 10 mH inductor. Find the voltage phasor.',
      steps: [
        '$\\omega L = 2\\pi \\times 1000 \\times 0.01 = 62.8\\ \\Omega$.',
        'Taking the current as the reference, $\\mathbf{I} = 0.5\\angle 0^\\circ$.',
        '$\\mathbf{V} = j\\omega L\\,\\mathbf{I} = j \\times 62.8 \\times 0.5 = 31.4\\angle 90^\\circ\\ \\mathrm{V}$.'
      ],
      a: '31.4 V peak, leading the current by 90°.'
    }
  ],
  quiz: [
    { q: 'Two 1 kHz sines of 3 V and 4 V peak, 90° apart, are added. The sum has a peak of…', choices: ['7 V', '5 V', '1 V', '12 V'], a: 1,
      why: 'Phasors at right angles add like the sides of a right triangle: √(3² + 4²) = 5 V.' },
    { q: 'Multiplying a phasor by j…', choices: ['doubles its size', 'rotates it by +90° without changing its size', 'makes it imaginary and therefore zero', 'reverses it'], a: 1,
      why: 'j = 1∠90°. Multiplying adds 90° to the angle and multiplies the size by 1.' },
    { q: 'Phasors can be used to add a 50 Hz and a 150 Hz signal directly.', a: false,
      why: 'Phasors of different frequencies rotate at different speeds, so their relative angle keeps changing. Each frequency must be handled separately.' },
    { q: 'What is the size of the phasor 6 − j8?', answer: 10,
      why: '√(6² + 8²) = 10, at an angle of −53.1°.' },
    { q: 'In a phasor diagram the current phasor sits 30° clockwise from the voltage phasor. The current…', choices: ['leads the voltage by 30°', 'lags the voltage by 30°', 'is in phase with it', 'lags by 330°'], a: 1,
      why: 'Phasors turn anticlockwise, so one that is clockwise from another is behind it in time: it lags.' }
  ],
  applications: ['Hand analysis of any AC circuit: filters, power networks, amplifiers at one frequency.', 'Phasor diagrams for motors, transformers and three-phase systems.', 'Phasor measurement units that monitor the grid\'s phase angles in real time.'],
  sim: { id: 'acf-phasor', params: { mode: 'origin' } }
},

{
  id: 'impedance', parent: 'ac-analysis', title: 'Impedance and reactance', level: 2,
  short: 'Impedance Z = V/I is Ohm\'s law for AC: a complex number whose real part (resistance) dissipates power and whose imaginary part (reactance, ωL or −1/ωC) stores energy and returns it.',
  keywords: ['impedance', 'reactance', 'capacitive reactance', 'inductive reactance', 'admittance', 'complex impedance', 'jωL', '1/jωC', 'impedance triangle', 'phase angle', 'series', 'parallel', 'scope input impedance'],
  prereq: ['phasors-ac', 'resistance-ohms-law', 'physics:reactance', 'physics:rlc-impedance'],
  related: ['ac-power', 'resonance-q', 'transfer-function', 'rc-low-pass', 'decoupling', 'capacitors', 'inductors'],
  body: `
With [[phasors-ac|phasors]], each component obeys a law of the form $\\mathbf{V} = \\mathbf{Z}\\,\\mathbf{I}$ — Ohm's law, with a complex number $\\mathbf{Z}$, the **impedance**, in place of the resistance:

| Component | Impedance | Size | Voltage relative to current |
|---|---|---|---|
| Resistor | $R$ | $R$ | in phase |
| Inductor | $j\\omega L$ | $X_L = \\omega L$ | leads by 90° |
| Capacitor | $\\dfrac{1}{j\\omega C} = -\\dfrac{j}{\\omega C}$ | $X_C = \\dfrac{1}{\\omega C}$ | lags by 90° |

The imaginary part is the **reactance** $X$; in general $\\mathbf{Z} = R + jX$, positive $X$ for inductive, negative for capacitive. (The old mnemonic "ELI the ICE man": in L, E before I; in C, I before E.)

### Frequency is everything
Reactance changes with frequency, in opposite directions:
- a 100 nF capacitor is 31.8 kΩ at 50 Hz, 1.59 kΩ at 1 kHz and 1.59 Ω at 1 MHz;
- a 10 mH inductor is 3.1 Ω at 50 Hz and 6.3 kΩ at 100 kHz.

At DC an inductor is a short circuit and a capacitor an open circuit; at very high frequency it is the other way round. That single fact explains coupling capacitors (block DC, pass signal), [[decoupling|decoupling]] capacitors (short out noise), chokes (pass DC, block noise) and every [[rc-low-pass|filter]].

### Combining impedances
Series impedances add; parallel ones combine by reciprocals — the same rules as resistors, with complex arithmetic:
$$\\mathbf{Z}_\\text{series} = \\mathbf{Z}_1 + \\mathbf{Z}_2, \\qquad \\mathbf{Z}_\\text{parallel} = \\frac{\\mathbf{Z}_1\\mathbf{Z}_2}{\\mathbf{Z}_1 + \\mathbf{Z}_2}$$
For parallel networks the **admittance** $\\mathbf{Y} = 1/\\mathbf{Z}$ (in siemens) is often easier, because admittances in parallel simply add.

A series R, L and C together:
$$\\mathbf{Z} = R + j\\left(\\omega L - \\frac{1}{\\omega C}\\right), \\qquad |\\mathbf{Z}| = \\sqrt{R^2 + X^2}, \\qquad \\varphi = \\arctan\\frac{X}{R}$$
Drawn as a right triangle — $R$ along, $X$ up or down, $|\\mathbf{Z}|$ the hypotenuse — this is the **impedance triangle**; the angle $\\varphi$ is how far the current lags the voltage (negative: leads).

### Impedance in practice
- An oscilloscope input is "1 MΩ" — in parallel with about 15 pF. At 10 MHz that capacitance is only 1.06 kΩ, so the input loads a circuit a thousand times more than the label suggests. Hence 10× probes.
- A loudspeaker is "8 Ω" nominally; its impedance swings from about 6 Ω to 40 Ω or more across the audio band, peaking at the cone's mechanical resonance.
- Real parts are not pure: capacitors have series resistance and inductance, inductors have winding resistance and capacitance between turns. Each therefore has a **self-resonant frequency** above which it behaves like the opposite kind of component.

> [!key] Only the resistive part of an impedance dissipates power. Reactance stores energy for part of a cycle and gives it back — see [[ac-power]].
`,
  ideas: [
    'Impedance Z = V/I is Ohm\'s law with phasors: Z = R + jX.',
    'X_L = ωL rises with frequency; X_C = 1/ωC falls with frequency.',
    'At DC a capacitor is open and an inductor shorted; at high frequency the reverse.',
    'Impedances combine like resistances, using complex arithmetic: |Z| = √(R² + X²).',
    'Only the resistive part of an impedance dissipates power.'
  ],
  pitfalls: [
    'Resistance and reactance add like resistances — They are at right angles: 30 Ω of resistance and 40 Ω of reactance make 50 Ω, not 70 Ω.',
    'A capacitor has a fixed "AC resistance" — Its reactance 1/(2πfC) depends on frequency: 100 nF is 32 kΩ at 50 Hz but 1.6 Ω at 1 MHz.',
    'Reactance dissipates power like resistance — Ideal inductors and capacitors only store and return energy; the heat comes from the resistive part alone.'
  ],
  formulas: [
    {
      name: 'Inductive reactance',
      expr: 'XL = 2*pi*f*L', tex: 'X_L = 2\\pi f L',
      vars: {
        XL: { name: 'inductive reactance', q: 'resistance', unit: 'Ω', tex: 'X_L' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 1 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 }
      },
      stories: { XL: 'What is the reactance of a {L} inductor at {f}?', f: 'At what frequency does a {L} inductor have a reactance of {XL}?' }
    },
    {
      name: 'Capacitive reactance',
      expr: 'XC = 1/(2*pi*f*C)', tex: 'X_C = \\frac{1}{2\\pi f C}',
      vars: {
        XC: { name: 'capacitive reactance', q: 'resistance', unit: 'Ω', tex: 'X_C' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { XC: 'What is the reactance of a {C} capacitor at {f}?', C: 'What capacitor has a reactance of {XC} at {f}?' }
    },
    {
      name: 'Size of a series impedance',
      expr: 'Z = sqrt(R^2 + X^2)', tex: 'Z = \\sqrt{R^2 + X^2}, \\qquad X = \\left|X_L - X_C\\right|',
      vars: {
        Z: { name: 'impedance magnitude |Z|', q: 'resistance', unit: 'Ω' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 100 },
        X: { name: 'net reactance, the size of X_L − X_C', q: 'resistance', unit: 'Ω', value: 342 }
      },
      note: 'For a series RLC, $X$ is the difference of the two reactances; for series RL it is $X_L$, for series RC it is $X_C$.',
      stories: { Z: 'A series circuit has {R} of resistance and a net reactance of {X}. What is the size of its impedance?', R: 'A coil draws current as if it were {Z} at a frequency where its reactance is {X}. What is its resistance?' }
    },
    {
      name: 'Phase angle of a series impedance',
      expr: 'phi = atan((XL - XC)/R)', tex: '\\varphi = \\arctan\\frac{X_L - X_C}{R}',
      vars: {
        phi: { name: 'phase of the voltage relative to the current', q: 'angle', unit: '°', signed: true, tex: '\\varphi' },
        XL: { name: 'inductive reactance', q: 'resistance', unit: 'Ω', value: 188.5, tex: 'X_L' },
        XC: { name: 'capacitive reactance', q: 'resistance', unit: 'Ω', value: 530.5, tex: 'X_C' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 100 }
      },
      note: 'Positive φ: inductive, the current lags. Negative φ: capacitive, the current leads.',
      stories: { phi: 'A series circuit has {R} with reactances {XL} (inductive) and {XC} (capacitive). By what angle is the voltage ahead of the current?' }
    }
  ],
  examples: [
    {
      title: 'A series RLC at 300 Hz',
      q: 'R = 100 Ω, L = 100 mH and C = 1 µF in series are driven by 10 V peak at 300 Hz. Find the reactances, the impedance and the current.',
      steps: [
        '$X_L = 2\\pi \\times 300 \\times 0.1 = 188.5\\ \\Omega$ and $X_C = 1/(2\\pi \\times 300 \\times 10^{-6}) = 530.5\\ \\Omega$.',
        '$X = X_L - X_C = -342.0\\ \\Omega$: the circuit is capacitive.',
        '$|\\mathbf{Z}| = \\sqrt{100^2 + 342.0^2} = 356.3\\ \\Omega$ and $\\varphi = \\arctan(-342.0/100) = -73.7^\\circ$.',
        '$I = 10/356.3 = 28.1\\ \\mathrm{mA}$ peak, leading the voltage by 73.7°.'
      ],
      a: '|Z| = 356 Ω at −73.7°; the current is 28.1 mA peak and leads by 73.7°.'
    },
    {
      title: 'The "1 MΩ" scope input at 10 MHz',
      q: 'A scope input is 1 MΩ in parallel with 15 pF. What is its impedance at 10 MHz?',
      steps: [
        '$X_C = 1/(2\\pi \\times 10^7 \\times 15 \\times 10^{-12}) = 1.06\\ \\mathrm{k\\Omega}$.',
        'In parallel with 1 MΩ, the much smaller capacitive reactance dominates: $|\\mathbf{Z}| \\approx 1.06\\ \\mathrm{k\\Omega}$ at almost −90°.',
        'A source of a few kilohms is heavily loaded. A 10× probe (10 MΩ with about 10 pF) raises the impedance and reduces the loading.'
      ],
      a: 'About 1.06 kΩ — not 1 MΩ.'
    }
  ],
  quiz: [
    { q: 'The frequency across a capacitor doubles. Its reactance…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 1,
      why: 'X_C = 1/(2πfC) is inversely proportional to frequency.' },
    { q: 'What is the reactance of a 10 mH inductor at 1 kHz?', answer: 62.8, unit: 'Ω',
      why: 'X_L = 2π × 1000 × 0.01 = 62.8 Ω.' },
    { q: 'At DC an ideal inductor is a short circuit and an ideal capacitor an open circuit.', a: true,
      why: 'At f = 0, X_L = 0 and X_C is infinite.' },
    { q: 'A series circuit has R = 30 Ω and X_L = 40 Ω. Its impedance is…', choices: ['70 Ω, current in phase', '50 Ω, current lagging by 53°', '50 Ω, current leading by 53°', '10 Ω'], a: 1,
      why: '|Z| = √(30² + 40²) = 50 Ω; φ = arctan(40/30) = 53° with positive (inductive) reactance, so the current lags.' },
    { q: 'What is the reactance of a 1 µF capacitor at 50 Hz?', choices: ['3.18 Ω', '318 Ω', '3.18 kΩ', '31.8 kΩ'], a: 2,
      why: 'X_C = 1/(2π × 50 × 10⁻⁶) = 3183 Ω.' }
  ],
  applications: ['Coupling and decoupling capacitors, chokes and filters.', 'Input impedance of instruments: scopes, probes, ADCs.', 'Loudspeaker and transducer impedance curves.', 'Matching impedances in audio and radio systems.'],
  sim: { id: 'acf-phasor', params: { mode: 'chain' } }
},

{
  id: 'ac-power', parent: 'ac-analysis', title: 'Real, reactive and apparent power', level: 2,
  short: 'In AC, volts times amps is not the whole story: real power P does the work, reactive power Q is borrowed and returned every cycle, and apparent power S = VI is what the wiring must carry.',
  keywords: ['real power', 'active power', 'reactive power', 'apparent power', 'power factor', 'watt', 'var', 'VA', 'power triangle', 'complex power', 'cos phi', 'instantaneous power', 'kVA rating'],
  prereq: ['impedance', 'rms-values', 'physics:ac-power'],
  related: ['power-factor-correction', 'three-phase', 'transformers-practical', 'power-energy'],
  body: `
In a DC circuit the power is simply $VI$. In AC, multiply the voltage and current **at each instant**, $p(t) = v(t)\\,i(t)$, and something new appears. With a current lagging the voltage by $\\varphi$,
$$p(t) = VI\\cos\\varphi \\;-\\; VI\\cos\\left(2\\omega t - \\varphi\\right)$$
($V$ and $I$ are RMS values). The power has a steady part and a part that swings at **twice** the supply frequency. When $\\varphi$ is not zero, $p$ dips **below zero** for part of each cycle: energy stored in the load's magnetic or electric field flows back to the supply.

### Three powers
| Quantity | Formula | Unit | Meaning |
|---|---|---|---|
| Real (active) power $P$ | $VI\\cos\\varphi = I^2R$ | watt (W) | the average: heat, light, mechanical work |
| Reactive power $Q$ | $VI\\sin\\varphi = I^2X$ | volt-ampere reactive (var) | energy borrowed and returned each cycle |
| Apparent power $S$ | $VI$ | volt-ampere (VA) | what the wiring and the source must carry |

They form the **power triangle**, $S^2 = P^2 + Q^2$, with the same angle as the load's [[impedance]] triangle. In phasor form the **complex power** is $\\mathbf{S} = \\mathbf{V}\\mathbf{I}^* = P + jQ$ (RMS phasors). Inductive loads — motors, transformers, magnetic ballasts — absorb reactive power ($Q > 0$, "lagging"); capacitors deliver it ($Q < 0$, "leading").

### Power factor
$$\\text{pf} = \\frac{P}{S} = \\cos\\varphi$$
A kettle has a power factor of 1. A lightly loaded induction motor may be 0.3–0.5, a fully loaded one about 0.85.

### Why it matters
Cables, fuses, transformers and generators heat with **current**, whatever the power factor. A 10 kW load at pf 0.7 on 230 V draws 62 A; at pf 1 it would draw 43 A. The feeder losses go as $I^2$, so the poor power factor doubles them. That is why transformers, generators and UPSs are rated in **kVA**, not kW, and why industrial customers pay for reactive energy or for a low power factor — and why they install [[power-factor-correction]].

### Worked numbers
The simulation's load is 20 Ω in series with 50 mH on 230 V, 50 Hz: $X_L = 15.7\\ \\Omega$, $|\\mathbf{Z}| = 25.4\\ \\Omega$, $I = 9.04\\ \\mathrm{A}$. So $P = I^2R = 1.64\\ \\mathrm{kW}$, $Q = I^2X = 1.28\\ \\mathrm{kvar}$, $S = 2.08\\ \\mathrm{kVA}$ and the power factor is 0.79 lagging.

### Distorted currents
The formula pf = cos φ assumes sinusoidal current. A rectifier with a big smoothing capacitor draws current in short peaks: little phase shift, yet a power factor of 0.5–0.7, because the harmonics carry current without carrying power. In general pf = (displacement factor $\\cos\\varphi_1$) × (distortion factor $I_1/I$). Harmonic limits for mains equipment are why most supplies above about 75 W contain **active PFC**.
`,
  ideas: [
    'Instantaneous power in AC has an average P and a swing at twice the supply frequency.',
    'Real power P = VI cos φ does work; reactive power Q = VI sin φ is borrowed and returned; apparent power S = VI is what the wiring carries.',
    'S² = P² + Q²: the power triangle has the same angle as the impedance triangle.',
    'Power factor = P/S; for sinusoids it is cos φ.',
    'Equipment heats with current, so it is rated in VA, and a low power factor costs capacity and losses.'
  ],
  pitfalls: [
    'Power is always volts times amps — V_rms × I_rms is the apparent power; the real power is smaller by the power factor.',
    'Reactive power is wasted energy — It averages to zero, being returned every half-cycle; the waste is the extra I²R loss its current causes in the wiring.',
    'Power factor is just cos φ — Only for sinusoidal currents. Distorted currents (rectifiers, switch-mode supplies) have a poor power factor even with no phase shift.'
  ],
  derivation: {
    title: 'The instantaneous power',
    steps: [
      { text: 'Take RMS values $V$, $I$ and a current lagging by $\\varphi$:', tex: 'v = \\sqrt2 V\\sin\\omega t, \\qquad i = \\sqrt2 I\\sin(\\omega t - \\varphi)' },
      { text: 'Use $\\sin a \\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$:', tex: 'p = vi = VI\\left[\\cos\\varphi - \\cos(2\\omega t - \\varphi)\\right]' },
      { text: 'The second term averages to zero over a cycle, so the real power is', tex: 'P = \\overline{p} = VI\\cos\\varphi' },
      { text: 'Expanding the swing, $\\cos(2\\omega t - \\varphi) = \\cos\\varphi\\cos 2\\omega t + \\sin\\varphi\\sin 2\\omega t$: the part with amplitude $VI\\sin\\varphi$ is pure back-and-forth exchange — the reactive power.', tex: 'p = P\\left(1 - \\cos 2\\omega t\\right) - Q\\sin 2\\omega t' }
    ]
  },
  formulas: [
    {
      name: 'Real power',
      expr: 'P = V*I*cos(phi)', tex: 'P = VI\\cos\\varphi',
      vars: {
        P: { name: 'real power', q: 'power', unit: 'W' },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230 },
        I: { name: 'RMS current', q: 'current', unit: 'A', value: 10 },
        phi: { name: 'phase angle between voltage and current', q: 'angle', unit: '°', value: 36.9, min: 0, max: 90, tex: '\\varphi' }
      },
      stories: { P: 'A load draws {I} from {V} with the current lagging by {phi}. What real power does it take?' }
    },
    {
      name: 'Reactive power',
      expr: 'Q = V*I*sin(phi)', tex: 'Q = VI\\sin\\varphi',
      vars: {
        Q: { name: 'reactive power', unit: 'var' },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230 },
        I: { name: 'RMS current', q: 'current', unit: 'A', value: 10 },
        phi: { name: 'phase angle', q: 'angle', unit: '°', value: 36.9, min: 0, max: 90, tex: '\\varphi' }
      },
      stories: { Q: 'A motor takes {I} at {V} with the current lagging by {phi}. How much reactive power does it draw?' }
    },
    {
      name: 'The power triangle',
      expr: 'S = sqrt(P^2 + Q^2)', tex: 'S = \\sqrt{P^2 + Q^2}',
      vars: {
        S: { name: 'apparent power', unit: 'VA' },
        P: { name: 'real power', q: 'power', unit: 'W', value: 1840 },
        Q: { name: 'reactive power', unit: 'var', value: 1380 }
      },
      stories: { S: 'A load takes {P} of real and {Q} of reactive power. What apparent power must the supply provide?', Q: 'A {S} transformer supplies {P} of real power at full load. How much reactive power is flowing?' }
    },
    {
      name: 'Power factor',
      expr: 'pf = P/S', tex: '\\text{pf} = \\frac{P}{S}',
      vars: {
        pf: { name: 'power factor', tex: '\\text{pf}' },
        P: { name: 'real power', q: 'power', unit: 'W', value: 1636 },
        S: { name: 'apparent power', unit: 'VA', value: 2080 }
      },
      stories: { pf: 'A load takes {P} while drawing {S}. What is its power factor?' }
    },
    {
      name: 'Current drawn by a single-phase load',
      expr: 'I = P/(V*pf)', tex: 'I = \\frac{P}{V\\,\\text{pf}}',
      vars: {
        I: { name: 'RMS current', q: 'current', unit: 'A' },
        P: { name: 'real power', q: 'power', unit: 'kW', value: 10 },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230 },
        pf: { name: 'power factor', value: 0.7, min: 0.01, max: 1, tex: '\\text{pf}' }
      },
      stories: { I: 'A {P} load on {V} has a power factor of {pf}. What current must the wiring carry?' }
    }
  ],
  examples: [
    {
      title: 'An inductive load on the mains',
      q: 'A load of 20 Ω in series with 50 mH is connected to 230 V, 50 Hz. Find the current, P, Q, S and the power factor.',
      steps: [
        '$X_L = 2\\pi \\times 50 \\times 0.05 = 15.7\\ \\Omega$; $|\\mathbf{Z}| = \\sqrt{20^2 + 15.7^2} = 25.4\\ \\Omega$.',
        '$I = 230/25.4 = 9.04\\ \\mathrm{A}$.',
        '$P = I^2R = 9.04^2 \\times 20 = 1.64\\ \\mathrm{kW}$; $Q = I^2X_L = 1.28\\ \\mathrm{kvar}$; $S = VI = 2.08\\ \\mathrm{kVA}$.',
        'pf $= 1.64/2.08 = 0.79$ lagging ($\\varphi = 38^\\circ$).'
      ],
      a: '9.04 A; P = 1.64 kW, Q = 1.28 kvar, S = 2.08 kVA; pf = 0.79 lagging.'
    },
    {
      title: 'What a poor power factor costs',
      q: 'A 10 kW single-phase load runs from 230 V. Compare the current at pf 0.7 and pf 1, and the cable losses.',
      steps: [
        'At pf 0.7: $I = 10\\,000/(230 \\times 0.7) = 62.1\\ \\mathrm{A}$.',
        'At pf 1: $I = 10\\,000/230 = 43.5\\ \\mathrm{A}$.',
        'Cable losses go as $I^2$: $(62.1/43.5)^2 = 2.04$ — twice the loss for the same useful power, and a thicker cable and larger fuse.'
      ],
      a: '62 A versus 43 A; the poor power factor doubles the cable losses.'
    }
  ],
  quiz: [
    { q: 'A load draws 10 A from 230 V at a power factor of 0.8. What real power does it take?', answer: 1840, unit: 'W',
      why: 'P = VI × pf = 230 × 10 × 0.8 = 1840 W. The apparent power is 2300 VA.' },
    { q: 'Reactive power…', choices: ['is converted to heat in the load', 'flows back and forth between source and load with zero average', 'is the power lost in the cables', 'exists only in DC circuits'], a: 1,
      why: 'It is energy stored in fields for part of each cycle and returned; its average is zero. It costs only through the extra current it needs.' },
    { q: 'Transformers are rated in kVA rather than kW because their heating depends on current, whatever the load\'s power factor.', a: true,
      why: 'Winding losses go as I² and core losses depend on voltage; neither cares whether the current is in phase.' },
    { q: 'An ideal capacitor connected to the mains takes…', choices: ['positive P and zero Q', 'zero P and negative Q (it supplies vars)', 'positive P and positive Q', 'zero P and zero Q'], a: 1,
      why: 'Its current leads by 90°: cos 90° = 0, so no real power; by convention its reactive power is negative — it supplies what inductive loads absorb.' },
    { q: 'A load takes S = 5 kVA and P = 4 kW. Its reactive power and power factor are…', choices: ['1 kvar, 0.8', '3 kvar, 0.8', '3 kvar, 0.6', '9 kvar, 1.25'], a: 1,
      why: 'Q = √(5² − 4²) = 3 kvar; pf = 4/5 = 0.8.' }
  ],
  applications: ['Sizing cables, fuses, transformers, generators and UPSs (in kVA).', 'Industrial electricity tariffs with reactive-energy charges.', 'Energy meters that record kWh and kvarh.', 'Motor selection and efficiency studies.'],
  sim: 'acf-power'
},

{
  id: 'power-factor-correction', parent: 'ac-analysis', title: 'Power factor correction', level: 2,
  short: 'Capacitors beside an inductive load supply its reactive power locally, so the supply current, the cable losses and the kVA the utility must deliver all fall — while the load works exactly as before.',
  keywords: ['power factor correction', 'PFC', 'capacitor bank', 'reactive power compensation', 'kvar', 'lagging', 'leading', 'over-correction', 'active PFC', 'boost PFC', 'detuned bank', 'harmonic resonance'],
  prereq: ['ac-power', 'impedance', 'capacitors'],
  related: ['three-phase', 'boost-converter', 'resonance-q', 'spectrum-harmonics'],
  body: `
An inductive load — a motor, a transformer, a magnetic ballast — draws a current that lags the voltage. Split it into two parts: an **in-phase** part that carries the real power, and a **quadrature** part, 90° behind, that only shuttles energy into the magnetic field and back. A capacitor draws a current 90° **ahead** of the voltage. Put the right capacitor in parallel with the load and its current cancels the load's quadrature current: the supply now delivers only the in-phase part. The reactive energy still sloshes back and forth — but between the capacitor and the motor's field, a metre apart, instead of through the whole grid.

### Sizing the capacitor
To raise the power factor of a load of real power $P$ from $\\cos\\varphi_1$ to $\\cos\\varphi_2$, the capacitor must supply
$$Q_C = P\\left(\\tan\\varphi_1 - \\tan\\varphi_2\\right)$$
and a capacitor across an RMS voltage $V$ at frequency $f$ supplies $Q_C = 2\\pi f C V^2$, so
$$C = \\frac{Q_C}{2\\pi f V^2}$$
For the load in [[ac-power]] (1.64 kW, 1.28 kvar at 230 V, 50 Hz), full correction needs $C = 1285/(2\\pi \\times 50 \\times 230^2) = 77\\ \\mu\\mathrm{F}$. The supply current falls from 9.04 A to 7.11 A — 21 % less current and 38 % less loss in the feeder — while the load's own current is unchanged.

### Practical correction
- **Aim for about 0.95, not 1.** The last few per cent save little current (at pf 0.95 the current is only 5 % above the minimum) and a bank sized for unity at full load will **over-correct** at light load, making the site capacitive, with the current rising again and the voltage creeping up.
- **Where to put it.** A capacitor at each large motor switches with the motor; a central bank with automatic steps follows the site's load.
- **Discharge.** Capacitor banks carry discharge resistors so the terminals are safe soon after disconnection.
- **Harmonic resonance.** The bank and the inductance of the supply transformer form a parallel resonant circuit ([[resonance-q]]). If it lands near the 5th or 7th harmonic that drives and rectifiers produce, harmonic currents are amplified and capacitors fail. Sites with many drives use **detuned** banks: a reactor in series with each step moves the resonance below the 5th harmonic.
- **Three-phase.** Banks are usually connected in delta, so each capacitor sees the line voltage and supplies three times the kvar it would in star ([[three-phase]]).

### Active PFC in electronics
A mains rectifier with a smoothing capacitor has a poor power factor for a different reason: its current comes in short peaks (see [[spectrum-harmonics]]). No capacitor fixes that. Instead, supplies above about 75 W use **active PFC**: a [[boost-converter]] between the rectifier and the bulk capacitor, controlled so that its input current follows the shape of the mains voltage. Power factors above 0.95 are routine — laptop chargers, LED drivers, EV chargers.
`,
  ideas: [
    'A capacitor in parallel supplies the reactive power of an inductive load locally.',
    'The load itself is unchanged; the supply current, cable losses and kVA demand fall.',
    'Q_C = P(tan φ₁ − tan φ₂), and C = Q_C/(2πfV²).',
    'Correct to about 0.95; unity at full load over-corrects at light load.',
    'Distorted rectifier currents need active PFC, a controlled boost converter, not capacitors.'
  ],
  pitfalls: [
    'PFC reduces the energy the load uses — The real power is unchanged. PFC reduces the supply current, and with it the wiring losses and the kVA the supply must provide.',
    'More capacitance is always better — Past unity the site turns capacitive (leading) and the current rises again; a fixed bank can over-correct at light load.',
    'A capacitor bank is harmless because capacitors do not dissipate — It can resonate with the supply inductance at a harmonic and amplify harmonic currents; banks in plants with drives are detuned with series reactors.'
  ],
  formulas: [
    {
      name: 'Reactive power the capacitors must supply',
      expr: 'Qc = P*(tan(acos(pf1)) - tan(acos(pf2)))', tex: 'Q_C = P\\left(\\tan\\varphi_1 - \\tan\\varphi_2\\right), \\quad \\cos\\varphi_1 = \\text{pf}_1,\\; \\cos\\varphi_2 = \\text{pf}_2',
      vars: {
        Qc: { name: 'capacitor reactive power', unit: 'var', tex: 'Q_C' },
        P: { name: 'real power of the load', q: 'power', unit: 'kW', value: 10 },
        pf1: { name: 'power factor before', value: 0.7, min: 0.05, max: 1, tex: '\\text{pf}_1' },
        pf2: { name: 'power factor wanted', value: 0.95, min: 0.05, max: 1, tex: '\\text{pf}_2' }
      },
      stories: { Qc: 'A {P} load has a power factor of {pf1}. How many var of capacitors raise it to {pf2}?' }
    },
    {
      name: 'Capacitance for a given reactive power',
      expr: 'C = Qc/(2*pi*f*V^2)', tex: 'C = \\frac{Q_C}{2\\pi f V^2}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF' },
        Qc: { name: 'reactive power to supply', unit: 'var', value: 1285, tex: 'Q_C' },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        V: { name: 'RMS voltage across the capacitor', q: 'voltage', unit: 'V', value: 230 }
      },
      stories: { C: 'What capacitor supplies {Qc} on a {V}, {f} supply?' }
    },
    {
      name: 'Supply current before and after',
      expr: 'I = P/(V*pf)', tex: 'I = \\frac{P}{V\\,\\text{pf}}',
      vars: {
        I: { name: 'RMS supply current', q: 'current', unit: 'A' },
        P: { name: 'real power', q: 'power', unit: 'W', value: 1636 },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230 },
        pf: { name: 'power factor', value: 0.787, min: 0.01, max: 1, tex: '\\text{pf}' }
      },
      stories: { I: 'A {P} load on {V} runs at a power factor of {pf}. What current does the supply deliver?' }
    }
  ],
  examples: [
    {
      title: 'Correcting a single load',
      q: 'The load of 20 Ω and 50 mH on 230 V, 50 Hz takes P = 1.64 kW and Q = 1.28 kvar. What capacitor corrects it to unity, and what happens to the supply current?',
      steps: [
        '$C = Q/(2\\pi f V^2) = 1285/(2\\pi \\times 50 \\times 230^2) = 77.3\\ \\mu\\mathrm{F}$ (a 75 or 80 µF motor-run capacitor rated for the mains).',
        'Before: $I = S/V = 2080/230 = 9.04\\ \\mathrm{A}$. After: $I = P/V = 1636/230 = 7.11\\ \\mathrm{A}$.',
        'The load still draws 9.04 A; the capacitor draws $2\\pi f C V = 5.59\\ \\mathrm{A}$, 90° ahead; the phasor sum is 7.11 A.'
      ],
      a: 'About 77 µF; the supply current falls from 9.0 A to 7.1 A.'
    },
    {
      title: 'A workshop on three-phase',
      q: 'A workshop takes 10 kW at pf 0.70 from a 400 V three-phase supply. How much capacitive kvar raises it to 0.95, and how does the line current change?',
      steps: [
        '$\\tan\\varphi_1 = \\tan(\\arccos 0.70) = 1.020$; $\\tan\\varphi_2 = \\tan(\\arccos 0.95) = 0.329$.',
        '$Q_C = 10 \\times (1.020 - 0.329) = 6.9\\ \\mathrm{kvar}$.',
        'Line current $I = P/(\\sqrt3\\,V\\,\\text{pf})$: 20.6 A before, 15.2 A after.',
        'Losses in the feeder fall by $1 - (15.2/20.6)^2 = 46\\ \\%$.'
      ],
      a: 'About 6.9 kvar; the line current drops from 20.6 A to 15.2 A.'
    },
    {
      title: 'Over-correction',
      q: 'Instead of 77 µF, 150 µF is fitted to the 1.64 kW, 1.28 kvar load. What are the power factor and supply current now?',
      steps: [
        'The capacitor supplies $2\\pi \\times 50 \\times 150 \\times 10^{-6} \\times 230^2 = 2.49\\ \\mathrm{kvar}$.',
        'Net $Q = 1.28 - 2.49 = -1.21\\ \\mathrm{kvar}$ (capacitive); $S = \\sqrt{1.64^2 + 1.21^2} = 2.03\\ \\mathrm{kVA}$.',
        'pf $= 1.64/2.03 = 0.80$ **leading**, and $I = 2030/230 = 8.8\\ \\mathrm{A}$ — almost as bad as no correction.'
      ],
      a: 'pf 0.80 leading and 8.8 A: over-correction undoes most of the benefit.'
    }
  ],
  quiz: [
    { q: 'After a correction capacitor is fitted beside a motor, the current in the motor itself…', choices: ['falls', 'rises', 'is unchanged', 'becomes zero'], a: 2,
      why: 'The motor sees the same voltage and draws the same current. Only the supply current, the sum of motor and capacitor currents, falls.' },
    { q: 'Correcting the power factor reduces the real power the load consumes.', a: false,
      why: 'The load does the same work and takes the same P. The saving is in the supply current and its I²R losses upstream.' },
    { q: 'What capacitance supplies 1 kvar on a 230 V, 50 Hz supply?', answer: 60.2, unit: 'µF',
      why: 'C = Q/(2πfV²) = 1000/(2π × 50 × 230²) = 60.2 µF.' },
    { q: 'Why is correction usually taken to about 0.95 rather than 1.0?', choices: ['Capacitors cannot reach 1.0', 'The last few per cent save little current, and a full bank over-corrects at light load', 'Utilities forbid unity power factor', 'It would stop the motor'], a: 1,
      why: 'Current goes as 1/pf: from 0.95 to 1 saves only 5 %. At light load the fixed kvar would exceed the load\'s needs and make the site capacitive.' },
    { q: 'A site fitted with far too much correction capacitance has a power factor that is…', choices: ['lagging', 'leading', 'exactly 1', 'greater than 1'], a: 1,
      why: 'Excess capacitive vars make the net reactive power negative: the current leads the voltage.' }
  ],
  applications: ['Capacitor banks in factories, with automatic step control.', 'Motor-run capacitors at individual motors.', 'Active PFC stages in PC supplies, LED drivers and EV chargers.', 'Static var compensators on the transmission grid.'],
  sim: { id: 'acf-power', params: { c: 77 } }
},

{
  id: 'resonance-q', parent: 'ac-analysis', title: 'Resonance and Q factor', level: 2,
  short: 'At one frequency an inductor\'s and a capacitor\'s reactances cancel: a series circuit\'s current peaks, a parallel circuit\'s impedance peaks, and the quality factor Q says how sharp the peak is.',
  keywords: ['resonance', 'resonant frequency', 'Q factor', 'quality factor', 'bandwidth', 'half-power points', 'series resonance', 'parallel resonance', 'tank circuit', 'selectivity', 'voltage magnification', 'tuned circuit', 'self-resonance'],
  prereq: ['impedance', 'rlc-transient', 'physics:lc-resonance', 'math:forced-oscillator-ode'],
  related: ['band-pass-stop', 'lc-oscillators', 'crystal-oscillators', 'decoupling', 'power-factor-correction', 'physics:driven-oscillations'],
  body: `
An inductor's reactance rises with frequency, a capacitor's falls. At one frequency they are equal, and because one is $+j$ and the other $-j$ they cancel exactly:
$$\\omega_0 L = \\frac{1}{\\omega_0 C} \\quad\\Longrightarrow\\quad f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$$
That is **resonance** — the frequency at which the circuit, left alone, would ring ([[rlc-transient]]). Driving it there is like pushing a swing in time with its motion.

### Series resonance
In a series R, L and C, the reactances cancel at $f_0$ and only $R$ is left: the impedance is at its **minimum** and the current at its **maximum**, $V/R$, in phase with the voltage. Below $f_0$ the circuit is capacitive, above it inductive. The voltages across L and C do not vanish — each is $Q$ times the supply, equal and opposite, so they cancel only in the sum. That **voltage magnification** is useful (a tuned circuit picks up a weak signal) and dangerous: a series LC at resonance on 230 V with $Q = 10$ puts 2.3 kV across the capacitor.

### Parallel resonance
L and C in parallel (a **tank circuit**) do the opposite: the impedance is at its **maximum** at $f_0$ and the source current at its minimum, while a current $Q$ times larger circulates between L and C. With a coil of resistance $r$, the peak impedance is about $L/(rC) = Q^2 r$. Tank circuits set the frequency of [[lc-oscillators|LC oscillators]], and unwanted parallel resonances appear between capacitor banks and supply transformers ([[power-factor-correction]]) and between decoupling capacitors ([[decoupling]]).

### The quality factor
$$Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}} \\quad\\text{(series)}, \\qquad Q = 2\\pi\\,\\frac{\\text{energy stored}}{\\text{energy lost per cycle}}$$
$Q$ measures how little the circuit loses per cycle, and it sets the **bandwidth** — the width of the peak between the half-power (−3 dB) frequencies:
$$\\Delta f = f_2 - f_1 = \\frac{f_0}{Q}$$
With $L = 10\\ \\mathrm{mH}$, $C = 100\\ \\mathrm{nF}$ and $R = 20\\ \\Omega$: $f_0 = 5.03\\ \\mathrm{kHz}$, $Q = 15.8$, a bandwidth of 318 Hz. Typical values: an RLC made from ordinary parts, 5–100; a good radio coil, 100–300; a quartz crystal, $10^4$–$10^6$ ([[crystal-oscillators]]).

Frequency and time tell the same story: a high-Q circuit has a narrow peak and, struck once, **rings for about $Q$ cycles** before dying away.

### Where resonance works for you
- **Tuning a radio**: a variable capacitor with a fixed coil selects one station.
- **Band-pass and notch filters** ([[band-pass-stop]]).
- **Wireless charging**: transmitter and receiver coils resonate at around 100–200 kHz, so they exchange energy efficiently across a gap.
- **Induction heating** and **ultrasonic transducers** run at the resonance of their tank.
`,
  ideas: [
    'At f₀ = 1/(2π√LC) the inductive and capacitive reactances cancel.',
    'Series resonance: minimum impedance (R), maximum current, and Q times the supply across L and C.',
    'Parallel resonance: maximum impedance, minimum source current, Q times larger circulating current.',
    'Q = (1/R)√(L/C) for a series circuit; the bandwidth between half-power points is f₀/Q.',
    'A high-Q circuit has a narrow peak and rings for about Q cycles.'
  ],
  pitfalls: [
    'At resonance there is no voltage across L and C — Each has Q times the supply voltage across it; they are equal and opposite, so they cancel only in the sum.',
    'The resonant frequency depends on the resistance — For a series RLC, f₀ = 1/(2π√LC) regardless of R; R sets the height and width of the peak.',
    'Higher Q is always better — High Q means a narrow bandwidth, slow settling and large internal voltages and currents; filters that must pass a band need modest Q.'
  ],
  derivation: {
    title: 'Why the bandwidth is f₀/Q',
    steps: [
      { text: 'The current in a series RLC driven by $V$ is', tex: 'I = \\frac{V}{R + jX}, \\qquad X = \\omega L - \\frac{1}{\\omega C}' },
      { text: 'Half power means $|I|^2$ halves, which happens where the reactance equals the resistance:', tex: '|R + jX| = \\sqrt2\\,R \\;\\Longleftrightarrow\\; X = \\pm R' },
      { text: 'Write $\\omega L - 1/\\omega C = \\pm R$ at the two edges $\\omega_2$ and $\\omega_1$ and subtract; using $\\omega_1\\omega_2 = \\omega_0^2 = 1/LC$ the capacitor terms combine:', tex: '(\\omega_2 - \\omega_1)\\,L + \\frac{\\omega_2 - \\omega_1}{\\omega_1\\omega_2 C} = 2R \\;\\Rightarrow\\; \\omega_2 - \\omega_1 = \\frac{R}{L}' },
      { text: 'Divide by $\\omega_0$:', tex: '\\frac{\\Delta\\omega}{\\omega_0} = \\frac{R}{\\omega_0 L} = \\frac{1}{Q} \\;\\Rightarrow\\; \\Delta f = \\frac{f_0}{Q}' }
    ]
  },
  formulas: [
    {
      name: 'Resonant frequency',
      expr: 'f0 = 1/(2*pi*sqrt(L*C))', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}',
      vars: {
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'kHz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 250 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF', value: 100 }
      },
      stories: { f0: 'A radio coil of {L} is tuned by {C}. What frequency does it select?', C: 'What capacitance tunes a {L} coil to {f0}?' }
    },
    {
      name: 'Q of a series RLC circuit',
      expr: 'Q = sqrt(L/C)/R', tex: 'Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}',
      vars: {
        Q: { name: 'quality factor' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 },
        R: { name: 'series resistance', q: 'resistance', unit: 'Ω', value: 20 }
      },
      stories: { Q: 'What is the Q of {R} in series with {L} and {C}?', R: 'What series resistance gives Q = {Q} with {L} and {C}?' }
    },
    {
      name: 'Bandwidth',
      expr: 'B = f0/Q', tex: '\\Delta f = \\frac{f_0}{Q}',
      vars: {
        B: { name: 'bandwidth between the half-power points', q: 'frequency', unit: 'Hz', tex: '\\Delta f' },
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'kHz', value: 5.03, tex: 'f_0' },
        Q: { name: 'quality factor', value: 15.8 }
      },
      stories: { B: 'A tuned circuit at {f0} has Q = {Q}. How wide is its passband?', Q: 'A filter centred on {f0} must have a bandwidth of {B}. What Q does it need?' }
    },
    {
      name: 'Voltage across C (or L) at series resonance',
      expr: 'Vc = Q*V', tex: 'V_C = Q\\,V',
      vars: {
        Vc: { name: 'capacitor voltage at resonance', q: 'voltage', unit: 'V', tex: 'V_C' },
        Q: { name: 'quality factor', value: 10 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 230 }
      },
      stories: { Vc: 'A series LC with Q = {Q} is driven at resonance by {V}. What voltage appears across the capacitor?' }
    }
  ],
  examples: [
    {
      title: 'A series resonant circuit',
      q: '1 V drives 20 Ω, 10 mH and 100 nF in series. Find f₀, Q, the bandwidth, the current at resonance and the capacitor voltage there.',
      steps: [
        '$f_0 = 1/(2\\pi\\sqrt{0.01 \\times 10^{-7}}) = 5.03\\ \\mathrm{kHz}$.',
        '$Q = \\sqrt{0.01/10^{-7}}/20 = 316/20 = 15.8$; bandwidth $5030/15.8 = 318\\ \\mathrm{Hz}$.',
        'At resonance only R remains: $I = 1/20 = 50\\ \\mathrm{mA}$.',
        '$V_C = I X_C = 0.05 \\times 316 = 15.8\\ \\mathrm{V}$ — $Q$ times the supply.'
      ],
      a: 'f₀ = 5.03 kHz, Q = 15.8, Δf = 318 Hz, I = 50 mA, V_C = 15.8 V.'
    },
    {
      title: 'Tuning the AM band',
      q: 'An AM radio uses a 250 µH coil. What range must the tuning capacitor cover for 530–1700 kHz? With Q = 50, how wide is the passband at 1 MHz?',
      steps: [
        { text: 'From $f_0 = 1/(2\\pi\\sqrt{LC})$:', tex: 'C = \\frac{1}{(2\\pi f)^2 L}' },
        'At 530 kHz: $C = 361\\ \\mathrm{pF}$. At 1700 kHz: $C = 35\\ \\mathrm{pF}$ — the classic 10–365 pF variable capacitor.',
        'At 1 MHz with $Q = 50$: $\\Delta f = 1000/50 = 20\\ \\mathrm{kHz}$, about two channel spacings. One tuned circuit is not selective enough, which is why receivers use several stages or a superheterodyne.'
      ],
      a: 'About 35–361 pF; a 20 kHz passband at 1 MHz.'
    }
  ],
  quiz: [
    { q: 'At series resonance the impedance of an RLC circuit is…', choices: ['zero', 'R, its minimum', 'infinite', '√(L/C)'], a: 1,
      why: 'X_L and X_C cancel, leaving only the resistance.' },
    { q: 'Doubling R in a series RLC circuit…', choices: ['halves f₀', 'halves Q and doubles the bandwidth', 'doubles Q', 'changes nothing'], a: 1,
      why: 'Q = (1/R)√(L/C) halves; the bandwidth f₀/Q doubles; f₀ does not involve R.' },
    { q: 'What is the resonant frequency of 1 mH with 1 µF?', answer: 5033, unit: 'Hz',
      why: 'f₀ = 1/(2π√(10⁻³ × 10⁻⁶)) = 1/(2π × 3.16 × 10⁻⁵) = 5.03 kHz.' },
    { q: 'At series resonance the voltage across the capacitor can be much larger than the supply voltage.', a: true,
      why: 'It is Q times the supply. With Q = 50, a 1 V source puts 50 V across C — and across L, in antiphase.' },
    { q: 'A parallel LC tank at resonance draws from its source…', choices: ['its maximum current', 'its minimum current, because its impedance peaks', 'a current Q times the circulating current', 'a DC current'], a: 1,
      why: 'In parallel the opposing currents of L and C cancel in the supply lead; a large current circulates inside the tank instead.' }
  ],
  applications: ['Tuning radios and selecting channels.', 'LC and crystal oscillators.', 'Wireless (inductive) charging and RFID.', 'Induction heating and ultrasonic cleaners.', 'Avoiding harmful resonances in capacitor banks and decoupling networks.'],
  sim: { id: 'acf-resonance', params: { mode: 'series' } }
},

{
  id: 'three-phase', parent: 'ac-analysis', title: 'Three-phase power', level: 2,
  short: 'Three sine voltages 120° apart on three or four wires: the most economical way to move power, with steady total power, rotating fields for motors, and line voltages √3 times the phase voltage.',
  keywords: ['three-phase', '3-phase', 'line voltage', 'phase voltage', 'star', 'wye', 'delta', 'neutral', '400 V', '230 V', 'square root of 3', 'balanced load', 'rotating magnetic field', 'phase sequence', 'neutral current', 'lost neutral'],
  prereq: ['phasors-ac', 'ac-power', 'physics:generators'],
  related: ['power-factor-correction', 'transformers-practical', 'dc-motor-control', 'spectrum-harmonics', 'full-wave-rectifier'],
  body: `
A generator with three windings spaced 120° around its stator produces three sine voltages, equal in size and 120° apart in time: the **phases**, called L1, L2 and L3 (or R, Y, B, or A, B, C). Almost all electricity is generated, transmitted and distributed this way; single-phase sockets are just one phase and the neutral.

### Star and delta
In a **star** (wye) system the three windings share a common point, the **neutral**. The voltage from each line to neutral is the **phase voltage** $V_\\text{ph}$; the voltage between two lines is the **line voltage** $V_L$. The difference of two phasors 120° apart is $\\sqrt3$ times either one, and 30° ahead of the first:
$$V_L = \\sqrt3\\,V_\\text{ph}$$
That is why European supplies are "230/400 V" and North American ones "120/208 V" (or 277/480 V in commercial buildings). In a **delta** connection the loads sit between lines, each seeing $V_L$; with a balanced load the line current is then $\\sqrt3$ times the current in each load.

### Why three phases?
- **Steady power.** In a single-phase circuit the power pulsates at twice the supply frequency ([[ac-power]]). With a balanced three-phase load the three pulsations are 240° apart and cancel: the total power is **constant**. Motors run without torque ripple and generators turn smoothly.
- **Less copper.** Three wires carrying current $I$ at phase voltage $V$ deliver $3VI$; the two wires of a single-phase circuit deliver $VI$. Each three-phase conductor does twice the work — and with a balanced load the neutral carries nothing and can be small or absent.
- **Rotating fields.** Three coils 120° apart in space, fed with currents 120° apart in time, produce a magnetic field that rotates at the supply frequency. That is the induction motor: no brushes, no commutator, self-starting. Swap any two lines and the field — and the motor — reverses.
- **Smooth rectification.** A six-diode bridge on three phases gives a DC output that never falls below 87 % of its peak, with ripple at six times the supply frequency — about 4 % of the DC in RMS terms before any smoothing, against 48 % for a single-phase bridge. See [[full-wave-rectifier]].

### Power
For a balanced load of power factor $\\cos\\varphi$:
$$P = \\sqrt3\\,V_L I_L\\cos\\varphi = 3\\,V_\\text{ph} I_\\text{ph}\\cos\\varphi$$
A 400 V motor taking 20 A per line at pf 0.85 draws 11.8 kW.

### The neutral and unbalance
Single-phase loads are spread across the phases, and never perfectly. The neutral carries the **phasor** sum of the three line currents — small when the loads are similar. Two cautions:
- **Harmonics add in the neutral.** Third harmonics of the three phases are all in step (3 × 120° = 360°), so rectifier-fed loads (computers, LED lighting) can load the neutral more than any phase. Office buildings use oversized neutrals.
- **A broken neutral is dangerous.** Without it, an unbalanced star load's common point drifts. The lightly loaded phases then rise towards the line voltage: appliances rated 230 V can see over 300 V and fail. The simulation shows it.
`,
  ideas: [
    'Three voltages of equal size, 120° apart; line voltage = √3 × phase voltage (400 V from 230 V).',
    'A balanced three-phase load draws constant total power: no pulsation.',
    'Balanced line currents sum to zero, so the neutral carries only the unbalance (and triplen harmonics).',
    'Three phases produce a rotating magnetic field; swapping two lines reverses it.',
    'P = √3 V_L I_L cos φ.'
  ],
  pitfalls: [
    'The line voltage is three (or two) times the phase voltage — It is √3 times, because the two phase voltages are 120° apart, not in antiphase.',
    'The neutral carries the sum of the three current sizes — It carries their phasor sum: nothing for a balanced load, the difference for an unbalanced one — though third harmonics do add up in it.',
    'The neutral is unimportant because it carries little current — If it breaks while the loads are unbalanced, the star point drifts and single-phase equipment can see up to the line voltage.'
  ],
  derivation: {
    title: 'Why the line voltage is √3 times the phase voltage',
    steps: [
      { text: 'Two phase voltages of size $V$, 120° apart:', tex: '\\mathbf{V}_1 = V\\angle 0^{\\circ}, \\qquad \\mathbf{V}_2 = V\\angle -120^{\\circ} = V\\left(-\\tfrac12 - j\\tfrac{\\sqrt3}{2}\\right)' },
      { text: 'Subtract them:', tex: '\\mathbf{V}_{12} = \\mathbf{V}_1 - \\mathbf{V}_2 = V\\left(\\tfrac32 + j\\tfrac{\\sqrt3}{2}\\right)' },
      { text: 'Its size and angle:', tex: '|\\mathbf{V}_{12}| = V\\sqrt{\\tfrac94 + \\tfrac34} = \\sqrt3\\,V, \\qquad \\arg \\mathbf{V}_{12} = \\arctan\\frac{\\sqrt3/2}{3/2} = 30^{\\circ}' }
    ]
  },
  formulas: [
    {
      name: 'Line voltage of a star system',
      expr: 'VL = sqrt(3)*Vph', tex: 'V_L = \\sqrt{3}\\,V_{\\text{ph}}',
      vars: {
        VL: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', tex: 'V_L' },
        Vph: { name: 'phase (line-to-neutral) voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_{\\text{ph}}' }
      },
      stories: { VL: 'A star-connected supply has {Vph} from each line to neutral. What is the voltage between two lines?', Vph: 'An industrial supply is {VL} between lines. What is it from line to neutral?' }
    },
    {
      name: 'Power of a balanced three-phase load',
      expr: 'P = sqrt(3)*VL*IL*pf', tex: 'P = \\sqrt{3}\\,V_L I_L\\,\\text{pf}',
      vars: {
        P: { name: 'total real power', q: 'power', unit: 'kW' },
        VL: { name: 'line voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_L' },
        IL: { name: 'line current', q: 'current', unit: 'A', value: 20, tex: 'I_L' },
        pf: { name: 'power factor', value: 0.85, min: 0.01, max: 1, tex: '\\text{pf}' }
      },
      stories: { P: 'A motor on {VL} draws {IL} per line at a power factor of {pf}. What power does it take?', IL: 'A {P} load runs on {VL} at a power factor of {pf}. What current flows in each line?' }
    },
    {
      name: 'Line current of a balanced delta load',
      expr: 'IL = sqrt(3)*Iph', tex: 'I_L = \\sqrt{3}\\,I_{\\text{ph}}',
      vars: {
        IL: { name: 'line current', q: 'current', unit: 'A', tex: 'I_L' },
        Iph: { name: 'current in each branch of the delta', q: 'current', unit: 'A', value: 10, tex: 'I_{\\text{ph}}' }
      },
      stories: { IL: 'Each branch of a balanced delta load carries {Iph}. What current flows in each supply line?' }
    }
  ],
  examples: [
    {
      title: 'Sizing the supply of a motor',
      q: 'An 11 kW (shaft output) motor runs on 400 V three-phase with an efficiency of 90 % and a power factor of 0.85. What line current does it draw?',
      steps: [
        'Electrical input: $11/0.90 = 12.2\\ \\mathrm{kW}$.',
        { text: 'Line current:', tex: 'I_L = \\frac{P}{\\sqrt3\\,V_L\\,\\text{pf}} = \\frac{12\\,200}{\\sqrt3 \\times 400 \\times 0.85} = 20.8\\ \\mathrm{A}' },
        'A 25 A motor-rated breaker and cable would be the starting point, checked against the starting current (several times this).'
      ],
      a: 'About 21 A per line.'
    },
    {
      title: 'A broken neutral',
      q: 'Three single-phase loads of 50 Ω, 100 Ω and 500 Ω hang on a 230/400 V supply. Describe what they see with the neutral connected, and with it broken.',
      steps: [
        'With the neutral each load sees its phase voltage, 230 V, whatever the others do; the neutral carries the phasor sum of the three currents (4.6 A, 2.3 A and 0.46 A).',
        'Without the neutral, the load currents must sum to zero, so the star point moves until they do. Solving the circuit (as the simulation does) gives about 139 V, 262 V and 329 V across the three loads.',
        'The lightest load — perhaps a television or a router — gets 329 V, 43 % above its rating, while the heaviest browns out.'
      ],
      a: 'Connected: 230 V each. Broken: about 139 V, 262 V and 329 V — the lightly loaded phase is badly over-voltaged.'
    }
  ],
  quiz: [
    { q: 'A star supply has 230 V between each line and neutral. The line-to-line voltage is…', choices: ['460 V', '690 V', '400 V', '325 V'], a: 2,
      why: '√3 × 230 = 398 ≈ 400 V. 460 V would be true only if the phases were 180° apart.' },
    { q: 'A perfectly balanced star load is connected with a neutral. The neutral current is…', choices: ['the same as each line current', 'three times a line current', 'zero', '√3 times a line current'], a: 2,
      why: 'Three equal phasors 120° apart sum to zero.' },
    { q: 'Swapping any two of the three lines to an induction motor reverses its direction of rotation.', a: true,
      why: 'It reverses the phase sequence, so the magnetic field rotates the other way.' },
    { q: 'What real power does a balanced 400 V load drawing 10 A per line at unity power factor take?', answer: 6928, unit: 'W',
      why: 'P = √3 × 400 × 10 × 1 = 6928 W.' },
    { q: 'Why does the total power of a balanced three-phase load not pulsate?', choices: ['The frequency is higher', 'The three double-frequency power swings are 240° apart and cancel', 'Motors store the energy', 'The neutral absorbs the ripple'], a: 1,
      why: 'Each phase\'s power swings at 2f; shifting a phase by 120° shifts its power swing by 240°, and three such swings sum to zero.' }
  ],
  applications: ['Generation, transmission and distribution of nearly all grid power.', 'Induction motors in industry, pumps and fans.', 'Six-pulse rectifiers for drives and DC links.', 'Balancing single-phase loads in buildings, and sizing neutrals for harmonic currents.'],
  sim: 'acf-three-phase'
}

);
