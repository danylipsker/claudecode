/* HYPER-PHYSICS · content/ac-circuits.js — alternating current: RMS values, reactance,
 * impedance, resonance and power. */
Hyper.add(

{
  id: 'alternating-current', parent: 'ac-circuits', title: 'Alternating current and RMS values', level: 1,
  short: 'Mains electricity reverses direction many times a second, following a sine wave; its RMS value is the steady (DC) value that would heat a resistor equally: peak ÷ √2.',
  keywords: ['alternating current', 'AC', 'RMS', 'root mean square', 'peak voltage', 'peak-to-peak', 'mains', '50 Hz', '60 Hz', '230 V', 'frequency', 'sinusoidal', 'average power'],
  prereq: ['electric-power', 'generators', 'math:trig-graphs'],
  related: ['reactance', 'ac-power', 'transformers', 'simple-harmonic-motion', 'math:average-value'],
  body: `
The electricity from a wall socket does not flow steadily one way. The voltage swings positive, falls through zero, swings negative and back — fifty times a second in Europe, sixty in North America — tracing a sine wave, because that is what a rotating [[generators|generator]] produces:

$$v(t) = V_0\\sin\\omega t, \\qquad \\omega = 2\\pi f$$

$V_0$ is the **peak** voltage, $f$ the frequency and $\\omega$ the angular frequency. The current in a resistor follows the voltage in step: $i = I_0 \\sin\\omega t$ with $I_0 = V_0/R$.

### Which number describes it?
The *average* voltage over a whole cycle is zero — as much positive as negative — yet a kettle plainly gets hot. Heating goes as $i^2R$, which is never negative. So the useful average is of $i^2$. Over a cycle $\\sin^2$ averages to exactly one half (see [[math:average-value|average value]]), so the mean power in a resistor is

$$\\bar P = \\tfrac12 I_0^2 R = I_\\text{rms}^2 R, \\qquad I_\\text{rms} = \\frac{I_0}{\\sqrt 2}$$

The **root-mean-square** value — square the waveform, take the mean, take the square root — is the steady DC value that would heat the resistor equally. For a sine wave it is the peak divided by $\\sqrt 2 \\approx 1.414$. With RMS values the familiar DC formulas $P = VI = I^2R = V^2/R$ give the average power.

### Mains numbers
UK and European mains is **230 V RMS** at 50 Hz, so the voltage actually peaks at $230\\sqrt 2 = 325$ V, and swings 650 V from peak to peak. North American mains is 120 V RMS (170 V peak) at 60 Hz. Unless told otherwise, AC voltages and currents are always quoted as RMS values, and ordinary meters read RMS.

A 2.3 kW kettle on 230 V draws 10 A RMS; its current peaks at 14 A, and the power it takes pulses between zero and 4.6 kW a hundred times a second — far too fast for the water to notice.

### Why AC?
- Generators make it naturally.
- [[transformers|Transformers]] can step it up and down, so power can travel at high voltage and low current, with small losses.
- It passes through zero a hundred times a second, which makes it easier to switch off safely.

The price is that capacitors and inductors now matter all the time: their opposition to AC, the [[reactance]], depends on frequency, and current and voltage can fall out of step, which changes the [[ac-power|power]].

> [!note] The RMS value is peak/√2 only for a sine wave. A square wave's RMS equals its peak; a triangle wave's is peak/√3.
`,
  ideas: [
    'Alternating current follows a sine wave: v = V₀ sin ωt, with ω = 2πf.',
    'The RMS value gives the same heating as a steady DC value; for a sine wave it is the peak divided by √2.',
    'Mains at 230 V RMS peaks at 325 V.',
    'With RMS values, P = VI = I²R = V²/R give the average power in a resistor.'
  ],
  pitfalls: [
    'The mains voltage never goes above 230 V — 230 V is the RMS value; the voltage peaks at ±325 V every cycle, and insulation must withstand that.',
    'The average power in a resistor on AC is V₀I₀ — It is V_rms I_rms = ½V₀I₀; the power reaches V₀I₀ only for an instant at each peak.',
    'RMS is peak/√2 for any waveform — Only for sine waves. A square wave\'s RMS equals its peak; a triangle wave\'s is peak/√3.'
  ],
  formulas: [
    {
      name: 'RMS value of a sine wave',
      expr: 'Vrms = V0/sqrt(2)', tex: 'V_{\\text{rms}} = \\frac{V_0}{\\sqrt 2}',
      vars: {
        Vrms: { name: 'RMS voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{rms}}' },
        V0: { name: 'peak voltage', q: 'voltage', unit: 'V', value: 325, tex: 'V_0' }
      },
      note: 'The same relation holds for currents. Sine waves only.',
      stories: { V0: 'A mains supply is rated at {Vrms}. What is its peak voltage?', Vrms: 'An oscilloscope shows a sine wave peaking at {V0}. What would a meter read?' }
    },
    {
      name: 'Instantaneous voltage',
      expr: 'v = V0*sin(2*pi*f*t)', tex: 'v = V_0\\sin(2\\pi f t)',
      vars: {
        v: { name: 'voltage at time t', q: 'voltage', unit: 'V', signed: true },
        V0: { name: 'peak voltage', q: 'voltage', unit: 'V', value: 325, tex: 'V_0' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        t: { name: 'time after an upward zero crossing', q: 'time', unit: 'ms', value: 2.5 }
      },
      note: 'Solving for $t$ gives the first time the voltage reaches $v$; it reaches it again half a period minus that time later.',
      practice: { unknowns: ['v'] },
      stories: { v: 'A {f} supply peaks at {V0}. What is the voltage {t} after it crosses zero going upwards?' }
    },
    {
      name: 'Average power in a resistor',
      expr: 'P = Vrms^2/R', tex: 'P = \\frac{V_{\\text{rms}}^2}{R}',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W' },
        Vrms: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_{\\text{rms}}' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 23 }
      },
      stories: {
        P: 'A kettle element of resistance {R} is plugged into {Vrms} mains. What average power does it use?',
        R: 'A heater takes {P} from {Vrms} mains. What is its resistance?'
      }
    }
  ],
  examples: [
    {
      title: 'Inside a kettle',
      q: 'A 2.3 kW kettle runs on 230 V, 50 Hz mains. Find its resistance, its RMS and peak currents, and the largest instantaneous power it takes.',
      steps: [
        'Resistance: $R = V_\\text{rms}^2/P = 230^2/2300 = 23\\ \\Omega$.',
        'Current: $I_\\text{rms} = V_\\text{rms}/R = 10$ A, so $I_0 = 10\\sqrt 2 = 14.1$ A.',
        'The power $i^2R$ peaks at $I_0^2R = (14.1)^2(23) = 4.6$ kW — twice the average — and falls to zero twice every cycle.'
      ],
      a: '23 Ω; 10 A RMS, 14.1 A peak; up to 4.6 kW for an instant, 2.3 kW on average.'
    },
    {
      title: 'Reading the waveform',
      q: 'A sine-wave supply has a peak of 325 V at 50 Hz. What is the voltage 2.5 ms after it crosses zero going upward, and when does it first reach 300 V?',
      steps: [
        '$v = 325\\sin(2\\pi \\times 50 \\times 0.0025) = 325\\sin 45° = 230$ V — at that moment it equals the RMS value.',
        'For 300 V: $\\sin(2\\pi f t) = 300/325 = 0.923$, so $2\\pi f t = 1.176$ rad and $t = 1.176/(2\\pi \\times 50) = 3.7$ ms.'
      ],
      a: '230 V after 2.5 ms; 300 V is first reached after 3.7 ms.'
    }
  ],
  quiz: [
    { q: 'UK mains is 230 V (RMS). Its peak voltage is about…', choices: ['230 V', '325 V', '460 V', '163 V'], a: 1, why: '$230 \\times \\sqrt 2 = 325$ V.' },
    { q: 'The average of a sinusoidal current over a whole cycle is…', choices: ['its RMS value', 'zero', 'half its peak', 'its peak'], a: 1,
      why: 'It spends as long flowing one way as the other. That is why the RMS, not the plain average, is used.' },
    { q: 'A resistor takes 100 W from a sinusoidal supply. If the peak voltage is doubled, the power becomes…', choices: ['200 W', '400 W', '141 W', '100 W'], a: 1,
      why: 'The RMS voltage doubles too, and $P = V_\\text{rms}^2/R$ quadruples.' },
    { q: 'On a 50 Hz supply, the power delivered to a heater pulses 100 times a second.', a: true,
      why: 'The power goes as $\\sin^2$, which peaks twice per cycle: once for each direction of current.' },
    { q: 'Why is the RMS value used to describe AC?', choices: ['It is the largest value', 'It gives the same heating as that value of steady DC', 'Meters cannot measure averages', 'It is the peak value'], a: 1,
      why: 'A 230 V RMS supply heats a resistor exactly as much as a 230 V battery would.' }
  ],
  applications: [
    'Mains electricity: 230 V at 50 Hz across most of the world, 120 V at 60 Hz in North America.',
    'Audio signals, which are alternating voltages at many frequencies at once.',
    'Induction heating and AC motors.',
    'RMS-reading multimeters.'
  ],
  history: 'In the 1880s Edison\'s DC systems competed with the AC systems of Westinghouse, using Tesla\'s motors. AC won the "war of the currents" because transformers could step it up for efficient long-distance transmission.',
  sim: 'em2-generator'
},

{
  id: 'reactance', parent: 'ac-circuits', title: 'Capacitive and inductive reactance', level: 2,
  short: 'Capacitors and inductors limit an alternating current without using up power. Their "resistance" to AC, the reactance — 1/ωC and ωL — depends on the frequency.',
  keywords: ['reactance', 'capacitive reactance', 'inductive reactance', 'X_C', 'X_L', '1/ωC', 'ωL', 'phase lead', 'phase lag', '90 degrees', 'ELI the ICE man', 'frequency dependence', 'filter', 'crossover'],
  prereq: ['alternating-current', 'capacitance', 'inductance'],
  related: ['rlc-impedance', 'math:phasors', 'lc-resonance', 'ac-power'],
  body: `
Put a capacitor across an AC supply and a current flows round the circuit, even though no charge ever crosses the gap between the plates: charge simply sloshes on and off them, reversing every half cycle. Put an inductor there instead and the current is limited, not by resistance, but by the back EMF the coil keeps generating. Both behave a little like resistors, with two important differences.

### Capacitors: current leads
A capacitor's charge follows the voltage, $q = Cv$, and the current is how fast the charge changes. For $v = V_0\\sin\\omega t$,

$$i = C\\,\\frac{dv}{dt} = \\omega C V_0\\cos\\omega t$$

The current's amplitude is $\\omega C V_0$, so the ratio of voltage to current — the **capacitive reactance** — is

$$X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C}$$

measured in ohms. And the current is a **cosine** while the voltage is a sine: the current peaks a quarter cycle earlier. In a capacitor the current **leads** the voltage by 90°.

### Inductors: current lags
In an inductor $v = L\\,di/dt$. The current is the one that has to "build up", so it peaks a quarter cycle after the voltage — it **lags** by 90° — and the **inductive reactance** is

$$X_L = \\omega L = 2\\pi f L$$

A mnemonic: **ELI the ICE man** — in an inductor (L) the EMF (E) comes before the current (I); in a capacitor (C) the current (I) comes before the EMF (E).

### Frequency matters
The two reactances go opposite ways:

| | Low frequency | High frequency | DC |
|---|---|---|---|
| Capacitor, $X_C = 1/\\omega C$ | large | small | blocks completely |
| Inductor, $X_L = \\omega L$ | small | large | passes freely |

A 10 µF capacitor has a reactance of 318 Ω at 50 Hz but only 3.2 Ω at 5 kHz. A 100 mH coil has 31 Ω at 50 Hz and 3.1 kΩ at 5 kHz. This is the basis of every **filter**: a loudspeaker crossover sends the treble to the tweeter through a capacitor and the bass to the woofer through an inductor.

### No power used
Over a cycle an ideal capacitor or inductor takes energy from the supply during one quarter cycle and hands it back in the next — storing it in its electric or magnetic field. Its average power is zero, unlike a resistor's. That is why reactance is not resistance, even though both are measured in ohms. When resistance and reactance appear together, they combine as described under [[rlc-impedance]]; the bookkeeping of power is in [[ac-power]].

> [!tip] In the simulation choose "Capacitor only" or "Inductor only", sweep the frequency, and watch the current follow $X_C$ or $X_L$.
`,
  ideas: [
    'Capacitive reactance X_C = 1/ωC falls with frequency; a capacitor blocks DC.',
    'Inductive reactance X_L = ωL rises with frequency; an inductor passes DC freely.',
    'In a capacitor the current leads the voltage by 90°; in an inductor it lags by 90°.',
    'An ideal reactance takes no average power: it stores energy and returns it every cycle.'
  ],
  pitfalls: [
    'Reactance is just another resistance — It limits the current like a resistance, but the current is 90° out of step with the voltage and no energy is used up on average.',
    'A capacitor blocks AC because charge cannot cross the gap — Charge sloshes on and off the plates, so an alternating current flows in the circuit. A capacitor blocks only DC.',
    'Inductive and capacitive reactance change the same way with frequency — X_L rises in proportion to f while X_C falls as 1/f.'
  ],
  derivation: {
    title: 'Why a capacitor\'s current leads by 90°',
    steps: [
      { text: 'Apply a sinusoidal voltage to a capacitor. Its charge follows the voltage:', tex: 'q = C v = C V_0\\sin\\omega t' },
      { text: 'The current is the rate of change of charge:', tex: 'i = \\frac{dq}{dt} = \\omega C V_0\\cos\\omega t = \\omega C V_0\\sin\\left(\\omega t + 90°\\right)' },
      { text: 'So the current peaks a quarter cycle before the voltage, with amplitude $I_0 = \\omega C V_0$, and', tex: 'X_C = \\frac{V_0}{I_0} = \\frac{1}{\\omega C}' }
    ]
  },
  formulas: [
    {
      name: 'Capacitive reactance',
      expr: 'XC = 1/(2*pi*f*C)', tex: 'X_C = \\frac{1}{2\\pi f C}',
      vars: {
        XC: { name: 'capacitive reactance', q: 'resistance', unit: 'Ω', tex: 'X_C' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 10 }
      },
      stories: {
        XC: 'What is the reactance of a {C} capacitor at {f}?',
        f: 'At what frequency does a {C} capacitor have a reactance of {XC}?',
        C: 'What capacitor has a reactance of {XC} at {f}?'
      }
    },
    {
      name: 'Inductive reactance',
      expr: 'XL = 2*pi*f*L', tex: 'X_L = 2\\pi f L',
      vars: {
        XL: { name: 'inductive reactance', q: 'resistance', unit: 'Ω', tex: 'X_L' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 }
      },
      stories: { XL: 'What is the reactance of a {L} coil at {f}?', f: 'At what frequency does a {L} coil have a reactance of {XL}?' }
    },
    {
      name: 'Current through a capacitor on AC',
      expr: 'I = 2*pi*f*C*V', tex: 'I = 2\\pi f C\\, V',
      vars: {
        I: { name: 'RMS current', q: 'current', unit: 'mA' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 10 },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230 }
      },
      note: '$I = V/X_C$. Use RMS values throughout (or peak values throughout).',
      stories: { I: 'A {C} capacitor is connected across {V}, {f} mains. What RMS current flows?' }
    }
  ],
  examples: [
    {
      title: 'A loudspeaker crossover',
      q: 'A tweeter has a resistance of 8 Ω. What series capacitor has a reactance equal to that at 3 kHz, so that it lets the treble through but holds back the bass? What is its reactance at 300 Hz?',
      steps: [
        '$C = \\dfrac{1}{2\\pi f X_C} = \\dfrac{1}{2\\pi(3000)(8)} = 6.6\\times10^{-6}$ F: about 6.6 µF.',
        'At 300 Hz, ten times lower in frequency, the reactance is ten times larger: 80 Ω, so little bass current reaches the tweeter.'
      ],
      a: 'About 6.6 µF; 80 Ω at 300 Hz.'
    },
    {
      title: 'A mains choke',
      q: 'A 0.50 H inductor is placed in a mains lead. What is its reactance at 50 Hz, and to interference at 50 kHz?',
      steps: [
        'At 50 Hz: $X_L = 2\\pi(50)(0.50) = 157\\ \\Omega$.',
        'At 50 kHz, a thousand times higher: $157\\ \\mathrm{k\\Omega}$.'
      ],
      a: '157 Ω at 50 Hz; 157 kΩ at 50 kHz — high-frequency noise is strongly blocked.'
    }
  ],
  quiz: [
    { q: 'Raising the frequency of the supply to a capacitor makes the current…', choices: ['smaller', 'larger', 'unchanged', 'zero'], a: 1,
      why: '$X_C = 1/2\\pi fC$ falls as the frequency rises, so more current flows.' },
    { q: 'In a purely inductive AC circuit, the current…', choices: ['is in step with the voltage', 'leads the voltage by 90°', 'lags the voltage by 90°', 'is 180° out of step'], a: 2,
      why: 'The coil\'s EMF depends on $di/dt$, so the current peaks a quarter cycle after the voltage. ELI: E before I.' },
    { q: 'The average power taken by an ideal capacitor on AC is…', choices: ['$V_\\text{rms}I_\\text{rms}$', 'zero', '$I^2X_C$', '$\\tfrac12CV^2$'], a: 1,
      why: 'It stores energy for a quarter cycle and returns it the next; on average, nothing is used.' },
    { q: 'An inductor lets DC through easily but opposes rapidly changing currents.', a: true, why: '$X_L = 2\\pi fL$ is zero at $f = 0$ and grows with frequency.' },
    { q: 'At about what frequency does a 1 µF capacitor have a reactance of 1 kΩ?', choices: ['16 Hz', '160 Hz', '1.6 kHz', '16 kHz'], a: 1,
      why: '$f = 1/(2\\pi X_C C) = 1/(2\\pi \\times 1000 \\times 10^{-6}) \\approx 159$ Hz.' }
  ],
  applications: [
    'Loudspeaker crossovers and tone controls.',
    'Smoothing and decoupling capacitors, and chokes, in power supplies.',
    'Radio tuning and filters of every kind.',
    'Touchscreens and capacitive sensors, which detect a change of reactance.'
  ],
  sim: { id: 'em2-rlc', params: { circuit: 'C' } }
},

{
  id: 'rlc-impedance', parent: 'ac-circuits', title: 'RLC circuits and impedance', level: 3,
  short: 'In a series RLC circuit the resistance and the two reactances do not simply add: they combine like perpendicular arrows (phasors) into the impedance Z = √(R² + (X_L − X_C)²).',
  keywords: ['impedance', 'RLC circuit', 'series RLC', 'phasor', 'phasor diagram', 'phase angle', 'complex impedance', 'j', 'Z', 'AC circuit analysis', 'voltage triangle'],
  prereq: ['reactance', 'math:phasors', 'math:complex-numbers'],
  related: ['lc-resonance', 'ac-power', 'kirchhoffs-laws', 'resistors-combinations'],
  body: `
Connect a resistor, an inductor and a capacitor in series across an AC supply. The same current flows through all three, but their voltages peak at different moments: the resistor's in step with the current, the inductor's a quarter cycle **ahead**, the capacitor's a quarter cycle **behind**. So you cannot add their RMS voltages like numbers. Measure 30 V, 60 V and 20 V across them and the supply may be only 50 V.

### Phasors
The way out is to represent each sinusoid by a **phasor** — an arrow whose length is the amplitude and whose angle is the phase, spinning round at $\\omega$; the actual value at any moment is its projection (see [[math:phasors|phasors]]). Adding sinusoids of the same frequency is then just adding arrows. Draw the current along the reference direction:

- $V_R = IR$ points along the current;
- $V_L = IX_L$ points 90° ahead;
- $V_C = IX_C$ points 90° behind — exactly opposite $V_L$.

$V_L$ and $V_C$ partly cancel, and what is left is at right angles to $V_R$. By [[math:pythagorean-theorem|Pythagoras]],

$$V^2 = V_R^2 + (V_L - V_C)^2 \\quad\\Rightarrow\\quad Z = \\frac{V}{I} = \\sqrt{R^2 + (X_L - X_C)^2}$$

The **impedance** $Z$, in ohms, plays the role of resistance for the whole circuit: $I = V/Z$ for RMS (or peak) values. The supply voltage leads the current by the **phase angle**

$$\\tan\\varphi = \\frac{X_L - X_C}{R}$$

If $X_L > X_C$ the circuit is **inductive** ($\\varphi > 0$, current lags); if $X_C > X_L$ it is **capacitive** ($\\varphi < 0$, current leads). At low frequency the capacitor dominates, at high frequency the inductor; in between, where they cancel, lies [[lc-resonance|resonance]].

### Complex impedance
Engineers let the arrows be [[math:complex-numbers|complex numbers]], writing $j$ for $\\sqrt{-1}$ (because $i$ is the current):

$$Z_R = R, \\qquad Z_L = j\\omega L, \\qquad Z_C = \\frac{1}{j\\omega C} = -\\frac{j}{\\omega C}$$

Now the rules for [[resistors-combinations|resistors]] carry straight over: in series $Z = Z_1 + Z_2 + \\dots$, in parallel $1/Z = 1/Z_1 + 1/Z_2 + \\dots$, and [[kirchhoffs-laws|Kirchhoff's laws]] hold with complex voltages and currents. The size $|Z|$ gives the current and the argument $\\arg Z$ gives the phase. For the series circuit, $Z = R + j(\\omega L - 1/\\omega C)$, whose size is the formula above.

> [!warn] The voltage across the inductor or the capacitor alone can be larger than the supply voltage. Nothing is wrong: they are out of step with each other and largely cancel.
`,
  ideas: [
    'In series, the same current flows through R, L and C, but their voltages are out of step.',
    'Voltages add as phasors: V² = V_R² + (V_L − V_C)².',
    'The impedance is Z = √(R² + (X_L − X_C)²) and I = V/Z.',
    'The phase angle obeys tan φ = (X_L − X_C)/R: positive for an inductive circuit, negative for a capacitive one.',
    'With complex impedances R, jωL and 1/jωC, the DC circuit rules carry over to AC.'
  ],
  pitfalls: [
    'Add the RMS voltages across R, L and C to get the supply voltage — They peak at different moments. Add them as phasors: V² = V_R² + (V_L − V_C)².',
    'The impedance is R + X_L + X_C — Resistance and reactance are at right angles, and the two reactances oppose each other: Z = √(R² + (X_L − X_C)²).'
  ],
  derivation: {
    title: 'Impedance from the phasor diagram',
    steps: [
      { text: 'Take the current phasor $I$ as the reference. The three voltage phasors are', tex: 'V_R = IR\\ (\\text{along } I), \\quad V_L = IX_L\\ (90° \\text{ ahead}), \\quad V_C = IX_C\\ (90° \\text{ behind})' },
      { text: '$V_L$ and $V_C$ lie on the same line, pointing opposite ways, at right angles to $V_R$. The supply voltage is the sum of the arrows:', tex: 'V^2 = (IR)^2 + (IX_L - IX_C)^2' },
      { text: 'Divide by $I^2$:', tex: 'Z = \\frac{V}{I} = \\sqrt{R^2 + \\left(X_L - X_C\\right)^2}, \\qquad \\tan\\varphi = \\frac{X_L - X_C}{R}' }
    ]
  },
  formulas: [
    {
      name: 'Impedance of a series RLC circuit',
      expr: 'Z = sqrt(R^2 + (XL - XC)^2)', tex: 'Z = \\sqrt{R^2 + \\left(X_L - X_C\\right)^2}',
      vars: {
        Z: { name: 'impedance', q: 'resistance', unit: 'Ω' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 30 },
        XL: { name: 'inductive reactance', q: 'resistance', unit: 'Ω', value: 80, tex: 'X_L' },
        XC: { name: 'capacitive reactance', q: 'resistance', unit: 'Ω', value: 40, tex: 'X_C' }
      },
      practice: { unknowns: ['Z', 'R'] },
      stories: {
        Z: 'A series circuit has resistance {R}, inductive reactance {XL} and capacitive reactance {XC}. What is its impedance?',
        R: 'A series circuit with reactances {XL} and {XC} has an impedance of {Z}. What is its resistance?'
      }
    },
    {
      name: 'Phase angle',
      expr: 'tan(phi) = (XL - XC)/R', tex: '\\tan\\varphi = \\frac{X_L - X_C}{R}', solveFor: 'phi',
      vars: {
        phi: { name: 'phase angle (voltage ahead of current)', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\varphi' },
        XL: { name: 'inductive reactance', q: 'resistance', unit: 'Ω', value: 80, tex: 'X_L' },
        XC: { name: 'capacitive reactance', q: 'resistance', unit: 'Ω', value: 40, tex: 'X_C' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 30 }
      },
      stories: { phi: 'A series circuit has R = {R}, X_L = {XL} and X_C = {XC}. By what angle does the supply voltage lead the current?' }
    },
    {
      name: 'Current in a series RLC circuit',
      expr: 'I = V/sqrt(R^2 + (2*pi*f*L - 1/(2*pi*f*C))^2)', tex: 'I = \\frac{V}{\\sqrt{R^2 + \\left(2\\pi f L - \\dfrac{1}{2\\pi f C}\\right)^2}}',
      vars: {
        I: { name: 'RMS current', q: 'current', unit: 'mA' },
        V: { name: 'RMS supply voltage', q: 'voltage', unit: 'V', value: 10 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 20 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 1000, min: 1, max: 10000000, log: true },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10, min: 0.001, max: 100000, log: true },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1, min: 0.00001, max: 100000, log: true }
      },
      note: 'Two frequencies give each current below the peak — one on each side of resonance — and the calculator finds both.',
      practice: { unknowns: ['I', 'V'] },
      stories: { I: 'A {V} (RMS), {f} supply drives a series circuit of {R}, {L} and {C}. What current flows?' }
    }
  ],
  examples: [
    {
      title: 'Voltages that add up to more than the supply',
      q: 'A series circuit of 30 Ω, 0.25 H and 80 µF is connected to 230 V, 50 Hz mains. Find the impedance, the current, the phase angle and the voltage across each component.',
      steps: [
        'Reactances: $X_L = 2\\pi(50)(0.25) = 78.5\\ \\Omega$ and $X_C = 1/(2\\pi(50)(80\\times10^{-6})) = 39.8\\ \\Omega$.',
        '$Z = \\sqrt{30^2 + (78.5 - 39.8)^2} = \\sqrt{900 + 1500} = 49.0\\ \\Omega$, so $I = 230/49.0 = 4.69$ A.',
        '$\\tan\\varphi = 38.7/30$, so $\\varphi = 52.3°$: inductive, the current lags.',
        '$V_R = 141$ V, $V_L = 369$ V, $V_C = 187$ V. Their plain sum is 697 V, but as phasors: $\\sqrt{141^2 + (369 - 187)^2} = 230$ V.',
        'In complex form: $Z = 30 + 38.7j\\ \\Omega$, with $|Z| = 49.0\\ \\Omega$ and $\\arg Z = 52°$.'
      ],
      a: 'Z = 49 Ω, I = 4.7 A lagging by 52.3°; V_R = 141 V, V_L = 369 V, V_C = 187 V.'
    }
  ],
  quiz: [
    { q: 'In a series RLC circuit the RMS voltages across R, L and C are 30 V, 60 V and 20 V. The supply voltage is…', choices: ['110 V', '50 V', '70 V', '10 V'], a: 1,
      why: '$\\sqrt{30^2 + (60 - 20)^2} = \\sqrt{900 + 1600} = 50$ V.' },
    { q: 'If $X_L > X_C$ in a series circuit, the current…', choices: ['leads the supply voltage', 'lags the supply voltage', 'is in step with it', 'is zero'], a: 1,
      why: 'The inductor wins, so the circuit behaves inductively: the voltage leads and the current lags.' },
    { q: 'The complex impedance of an inductor is…', choices: ['$\\omega L$', '$j\\omega L$', '$-j/\\omega C$', '$R + \\omega L$'], a: 1,
      why: 'Its size is $\\omega L$ and the factor $j$ records the 90° lead of voltage over current.' },
    { q: 'In a series RLC circuit, the voltage across the capacitor can be larger than the supply voltage.', a: true,
      why: 'The capacitor\'s and inductor\'s voltages are in opposite phase and largely cancel, so each can exceed the total.' },
    { q: 'At very low frequencies the impedance of a series RLC circuit is dominated by…', choices: ['R', 'L', 'C', 'none of them'], a: 2,
      why: '$X_C = 1/2\\pi fC$ grows without limit as $f \\to 0$, while $X_L$ shrinks.' }
  ],
  applications: [
    'Designing filters and tuned circuits.',
    'Matching aerials and amplifiers to their loads.',
    'Analysing motors and power networks.',
    'Bioimpedance measurements, such as body-fat scales, which pass a small AC current through the body.'
  ],
  sim: 'em2-rlc'
},

{
  id: 'lc-resonance', parent: 'ac-circuits', title: 'Resonance in RLC circuits', level: 3,
  short: 'When the inductive and capacitive reactances cancel, at f₀ = 1/(2π√LC), a series RLC circuit passes the largest current — the tuning principle of every radio.',
  keywords: ['resonance', 'resonant frequency', 'LC circuit', 'tuned circuit', 'Q factor', 'quality factor', 'bandwidth', 'LC oscillation', 'radio tuning', 'selectivity', 'voltage magnification'],
  prereq: ['rlc-impedance', 'driven-oscillations', 'energy-in-inductor'],
  related: ['energy-in-capacitor', 'damped-oscillations', 'simple-harmonic-motion', 'math:forced-oscillator-ode', 'electromagnetic-waves'],
  body: `
Charge a capacitor and connect it across a coil. The capacitor discharges through the coil, but the coil's inductance keeps the current going after the capacitor is empty, charging it up the other way. Then it discharges back. The energy sloshes between the capacitor's electric field, $\\tfrac12CV^2$, and the coil's magnetic field, $\\tfrac12LI^2$, like a mass on a spring swapping potential and kinetic energy. The circuit rings at its natural frequency

$$\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\qquad f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$$

The analogy is exact: $L$ plays the part of the mass, $1/C$ the spring's stiffness, the charge the displacement — see [[simple-harmonic-motion]]. Resistance acts as friction and makes the oscillation die away ([[damped-oscillations]]).

### Driving it: the resonance peak
Now drive a series RLC circuit with an AC source of adjustable frequency. The impedance $Z = \\sqrt{R^2 + (X_L - X_C)^2}$ ([[rlc-impedance]]) is smallest when the two reactances cancel, $\\omega L = 1/\\omega C$ — exactly at $f_0$. There:

- the impedance is just $R$, and the current is as large as it can be, $I = V/R$;
- current and voltage are in step ($\\varphi = 0$), so the power factor is 1;
- $V_L$ and $V_C$ are equal and opposite — and each can be far larger than the supply voltage.

Away from $f_0$ the current falls off on both sides, tracing the **resonance curve**. This is [[driven-oscillations|driven oscillation]] again, in electrical form.

### Sharpness: the Q factor
How narrow is the peak? The **quality factor**

$$Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$$

measures it. The band of frequencies over which the power is at least half its peak value has width

$$\\Delta f = \\frac{f_0}{Q} = \\frac{R}{2\\pi L}$$

and at resonance the voltage across the capacitor (or the inductor) is $Q$ times the supply voltage. A circuit with $Q = 50$ driven by 5 V has 250 V across its capacitor.

| Resonator | Typical Q |
|---|---|
| Radio tuning circuit | 50–200 |
| Quartz crystal in a watch | about 10⁴–10⁵ |
| Superconducting microwave cavity | up to 10¹⁰ |

### Tuning a radio
An aerial picks up every station at once, each at its own frequency. A tuned circuit responds strongly only near $f_0$, so turning a variable capacitor selects one station. With a 240 µH coil, a capacitor adjustable from 40 pF to 365 pF tunes from about 1.6 MHz down to 540 kHz — the medium-wave band.
`,
  ideas: [
    'An LC circuit oscillates at f₀ = 1/(2π√LC), swapping energy between the capacitor and the coil.',
    'Driven at f₀, a series RLC circuit has X_L = X_C, impedance R, and maximum current, in step with the voltage.',
    'The quality factor Q = (1/R)√(L/C) sets the sharpness: bandwidth Δf = f₀/Q.',
    'At resonance the voltages across L and C are Q times the supply voltage.'
  ],
  pitfalls: [
    'At resonance the inductor and capacitor are switched off — Their voltages are large (Q times the supply) but equal and opposite at every instant, so they cancel in the sum.',
    'The resistance shifts the resonant frequency of a series RLC circuit — The current peaks at f₀ = 1/2π√LC whatever R is; R sets only how tall and how sharp the peak is.'
  ],
  derivation: {
    title: 'LC oscillations from energy conservation',
    steps: [
      { text: 'With no resistance the total energy in the capacitor and the coil stays constant. With charge $q$ and current $I = dq/dt$:', tex: '\\frac{q^2}{2C} + \\tfrac12 L I^2 = \\text{constant}' },
      { text: 'Differentiate with respect to time:', tex: '\\frac{q}{C}\\,\\frac{dq}{dt} + L I\\,\\frac{dI}{dt} = I\\left(\\frac{q}{C} + L\\,\\frac{d^2q}{dt^2}\\right) = 0' },
      { text: 'This is the equation of simple harmonic motion (see [[math:harmonic-oscillator-ode|the harmonic oscillator equation]]):', tex: '\\frac{d^2q}{dt^2} = -\\frac{1}{LC}\\,q' },
      { text: 'So the charge oscillates as $q = q_0\\cos\\omega_0 t$ with', tex: '\\omega_0 = \\frac{1}{\\sqrt{LC}}' }
    ]
  },
  formulas: [
    {
      name: 'Resonant frequency',
      expr: 'f0 = 1/(2*pi*sqrt(L*C))', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}',
      vars: {
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'kHz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 240 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF', value: 365 }
      },
      stories: {
        f0: 'A tuned circuit has a {L} coil and a {C} capacitor. At what frequency does it resonate?',
        C: 'A radio\'s tuning coil has inductance {L}. What capacitance tunes it to a station at {f0}?',
        L: 'What inductance resonates with a {C} capacitor at {f0}?'
      }
    },
    {
      name: 'Quality factor of a series RLC circuit',
      expr: 'Q = sqrt(L/C)/R', tex: 'Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}',
      vars: {
        Q: { name: 'quality factor' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 20 }
      },
      note: 'Also $Q = \\omega_0 L/R = f_0/\\Delta f$, and at resonance $V_C = V_L = QV$.',
      stories: { Q: 'A series circuit has L = {L}, C = {C} and R = {R}. What is its Q factor?', R: 'What resistance gives a circuit with L = {L} and C = {C} a Q of {Q}?' }
    },
    {
      name: 'Bandwidth (half-power width)',
      expr: 'df = R/(2*pi*L)', tex: '\\Delta f = \\frac{R}{2\\pi L}',
      vars: {
        df: { name: 'bandwidth', q: 'frequency', unit: 'Hz', tex: '\\Delta f' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 20 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 }
      },
      note: 'For a series RLC circuit; equal to $f_0/Q$. It does not depend on $C$.'
    }
  ],
  examples: [
    {
      title: 'Tuning a medium-wave radio',
      q: 'A radio\'s tuning coil is 240 µH. What range of frequencies can it tune with a variable capacitor of 40–365 pF? What capacitance selects a station at 1.00 MHz?',
      steps: [
        'Largest capacitance, lowest frequency: $f = \\dfrac{1}{2\\pi\\sqrt{(240\\times10^{-6})(365\\times10^{-12})}} = 538$ kHz.',
        'Smallest capacitance: $f = \\dfrac{1}{2\\pi\\sqrt{(240\\times10^{-6})(40\\times10^{-12})}} = 1.62$ MHz.',
        'For 1.00 MHz: $C = \\dfrac{1}{(2\\pi f)^2 L} = \\dfrac{1}{(6.28\\times10^6)^2(240\\times10^{-6})} = 106$ pF.'
      ],
      a: 'About 540 kHz to 1.6 MHz; 106 pF for 1.00 MHz.'
    },
    {
      title: '250 volts from a 5-volt supply',
      q: 'A 5.0 V (RMS) source drives a series circuit with R = 10 Ω, L = 50 mH and C = 0.20 µF at its resonant frequency. Find f₀, the current, Q and the voltage across the capacitor.',
      steps: [
        '$f_0 = \\dfrac{1}{2\\pi\\sqrt{(0.050)(0.20\\times10^{-6})}} = 1.59$ kHz.',
        'At resonance $Z = R$, so $I = 5.0/10 = 0.50$ A.',
        '$X_C = X_L = 2\\pi f_0 L = 500\\ \\Omega$, so $V_C = IX_C = 250$ V; and $Q = X_L/R = 50$.'
      ],
      a: 'f₀ = 1.59 kHz, I = 0.50 A, Q = 50, and 250 V across the capacitor — fifty times the supply.'
    }
  ],
  quiz: [
    { q: 'At resonance, the impedance of a series RLC circuit is…', choices: ['zero', 'equal to R', 'infinite', 'equal to X_L + X_C'], a: 1, why: 'The reactances cancel, leaving only the resistance.' },
    { q: 'To tune a radio to a higher frequency, the capacitance must be…', choices: ['increased', 'decreased', 'unchanged', 'made negative'], a: 1,
      why: '$f_0 \\propto 1/\\sqrt{C}$: a smaller capacitance gives a higher resonant frequency.' },
    { q: 'Halving R in a series RLC circuit (same L and C)…', choices: ['halves the resonant frequency', 'doubles Q and makes the peak taller and sharper', 'doubles the bandwidth', 'has no effect'], a: 1,
      why: '$f_0$ does not involve $R$, but $Q = \\sqrt{L/C}/R$ doubles and the bandwidth $R/2\\pi L$ halves.' },
    { q: 'At resonance in a series RLC circuit, the voltage across the capacitor can be many times the supply voltage.', a: true,
      why: 'It is $Q$ times the supply voltage, cancelled at every instant by the equal and opposite voltage across the inductor.' },
    { q: 'In the mechanical analogy of an LC circuit, the inductance plays the part of…', choices: ['the spring', 'the mass', 'friction', 'the driving force'], a: 1,
      why: 'Both resist changes of motion: $V = L\\,dI/dt$ matches $F = m\\,dv/dt$. The capacitor is the spring (stiffness $1/C$).' }
  ],
  applications: [
    'Radio and television tuning, and the filters that separate channels.',
    'Quartz-crystal oscillators in clocks, watches and computers.',
    'Wireless charging, which uses coils tuned to the same frequency.',
    'MRI receive coils, tuned to the resonance frequency of protons.',
    'Metal detectors, which sense the shift of a tuned circuit\'s frequency.'
  ],
  history: 'Heinrich Hertz used a spark-gap LC circuit to make and detect radio waves in 1887. Oliver Lodge patented "syntonic" tuning — matched resonant circuits in transmitter and receiver — in 1897, which let many radio stations share the air.',
  sim: 'em2-rlc'
},

{
  id: 'ac-power', parent: 'ac-circuits', title: 'Power in AC circuits', level: 2,
  short: 'Only resistance uses up energy in an AC circuit. The average power is V_rms I_rms cos φ, where cos φ — the power factor — measures how well current and voltage keep in step.',
  keywords: ['AC power', 'power factor', 'cos φ', 'real power', 'apparent power', 'reactive power', 'volt-ampere', 'VA', 'var', 'power triangle', 'power factor correction', 'kWh'],
  prereq: ['alternating-current', 'rlc-impedance', 'electric-power'],
  related: ['transformers', 'reactance', 'lc-resonance'],
  body: `
In a DC circuit the power is simply $VI$. In an AC circuit the instantaneous power is still $p = vi$, but if the current is out of step with the voltage, part of each cycle has $v$ and $i$ of opposite signs: the load is **giving energy back** to the supply. The average is less than $V_\\text{rms}I_\\text{rms}$.

### The power factor
If the current lags (or leads) the voltage by an angle $\\varphi$, the average power is

$$P = V_\\text{rms}\\, I_\\text{rms}\\cos\\varphi$$

One way to see it: split the current into a part in step with the voltage, $I\\cos\\varphi$, and a part 90° out of step, $I\\sin\\varphi$. The in-step part behaves like a current through a resistor and delivers power; the out-of-step part behaves like a current through a pure [[reactance]] and delivers none on average. The factor $\\cos\\varphi$ is the **power factor**. For a series circuit it equals $R/Z$, and the power all ends up in the resistance:

$$P = I_\\text{rms}^2 R$$

A pure resistor has $\\cos\\varphi = 1$; a pure inductor or capacitor has $\\cos\\varphi = 0$ and uses no power at all, however large its current.

### Three kinds of "power"
Engineers keep three books:

| Quantity | Formula | Unit |
|---|---|---|
| Real power (does work, heats) | $P = VI\\cos\\varphi$ | watt, W |
| Reactive power (sloshes back and forth) | $Q = VI\\sin\\varphi$ | volt-ampere reactive, var |
| Apparent power (what the wires carry) | $S = VI$ | volt-ampere, VA |

They form a right-angled **power triangle**: $S^2 = P^2 + Q^2$. Generators, cables and transformers are rated in VA or kVA, because what heats *them* is the full current, whatever its phase.

### Why a poor power factor costs money
Electric motors are inductive, with power factors of 0.7–0.85. A 5 kW motor on 230 V at power factor 0.8 draws $5000/(230 \\times 0.8) = 27$ A instead of 22 A. The extra current delivers nothing, but it heats every cable and transformer on its way. Utilities therefore charge large industrial users for their reactive power, and factories install banks of **capacitors** across their motors: the capacitor's leading current cancels the motor's lagging current, a [[lc-resonance|resonance]]-like balancing of the two reactances, so the supply sees a load nearly in step with the voltage.

### Paying for energy
The electricity meter measures real energy, $\\int P\\,dt$, in kilowatt-hours: $1\\ \\mathrm{kWh} = 3.6\\ \\mathrm{MJ}$. A household is billed for watts, not volt-amperes.
`,
  ideas: [
    'The average power in an AC circuit is P = V_rms I_rms cos φ.',
    'The power factor cos φ is 1 for a resistor and 0 for a pure capacitor or inductor; in a series circuit it equals R/Z.',
    'All the average power is dissipated in the resistance: P = I²_rms R.',
    'Real, reactive and apparent power form a right triangle: S² = P² + Q².',
    'A low power factor means extra current and losses; capacitors can correct it.'
  ],
  pitfalls: [
    'Power = V_rms × I_rms for any AC load — Only when voltage and current are in step. In general P = V_rms I_rms cos φ; the plain product is the apparent power, in volt-amperes.',
    'Reactive power is energy wasted — It is energy that flows back and forth each cycle and is returned. It costs indirectly, because the extra current heats the wires.'
  ],
  derivation: {
    title: 'Average power with a phase shift',
    steps: [
      { text: 'Let the voltage be $V_0\\sin\\omega t$ and the current, lagging by $\\varphi$, $I_0\\sin(\\omega t - \\varphi)$. The instantaneous power is', tex: 'p = V_0 I_0 \\sin\\omega t\\,\\sin(\\omega t - \\varphi)' },
      { text: 'Use the product identity $\\sin A\\sin B = \\tfrac12[\\cos(A - B) - \\cos(A + B)]$ (see [[math:trig-identities|trigonometric identities]]):', tex: 'p = \\tfrac12 V_0 I_0\\left[\\cos\\varphi - \\cos(2\\omega t - \\varphi)\\right]' },
      { text: 'The second term averages to zero over a cycle, leaving', tex: 'P = \\tfrac12 V_0 I_0\\cos\\varphi = V_\\text{rms} I_\\text{rms}\\cos\\varphi' }
    ]
  },
  formulas: [
    {
      name: 'Average power',
      expr: 'P = Vrms*Irms*cos(phi)', tex: 'P = V_{\\text{rms}} I_{\\text{rms}}\\cos\\varphi',
      vars: {
        P: { name: 'average (real) power', q: 'power', unit: 'W' },
        Vrms: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_{\\text{rms}}' },
        Irms: { name: 'RMS current', q: 'current', unit: 'A', value: 10, tex: 'I_{\\text{rms}}' },
        phi: { name: 'phase angle between voltage and current', q: 'angle', unit: '°', value: 30, min: -90, max: 90, signed: true, tex: '\\varphi' }
      },
      stories: {
        P: 'A load on {Vrms} mains draws {Irms}, with the current {phi} out of step with the voltage. What power does it use?',
        phi: 'A motor on {Vrms} draws {Irms} and uses {P}. By what angle is its current out of step with the voltage?'
      }
    },
    {
      name: 'Power factor of a series circuit',
      expr: 'cos(phi) = R/Z', tex: '\\cos\\varphi = \\frac{R}{Z}', solveFor: 'phi',
      vars: {
        phi: { name: 'size of the phase angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\varphi' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 40 },
        Z: { name: 'impedance', q: 'resistance', unit: 'Ω', value: 50 }
      },
      stories: { phi: 'A series circuit has resistance {R} and impedance {Z}. What is its phase angle?' }
    },
    {
      name: 'Current drawn for a given power',
      expr: 'I = P/(V*pf)', tex: 'I = \\frac{P}{V\\,\\mathrm{pf}}',
      vars: {
        I: { name: 'RMS current', q: 'current', unit: 'A' },
        P: { name: 'real power', q: 'power', unit: 'kW', value: 5 },
        V: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230 },
        pf: { name: 'power factor cos φ', value: 0.8, min: 0.05, max: 1, tex: '\\mathrm{pf}' }
      },
      stories: {
        I: 'A {P} motor on {V} has a power factor of {pf}. What current does it draw?',
        pf: 'A {P} load on {V} draws {I}. What is its power factor?'
      }
    }
  ],
  examples: [
    {
      title: 'Correcting a motor\'s power factor',
      q: 'A motor on 230 V, 50 Hz draws 12 A at a power factor of 0.75 (lagging). Find the real, apparent and reactive power. What capacitor in parallel would bring the power factor to 1, and what current would the supply then deliver?',
      steps: [
        'Apparent power: $S = VI = 230 \\times 12 = 2760$ VA. Real power: $P = S\\cos\\varphi = 2070$ W.',
        'Reactive power: $Q = \\sqrt{S^2 - P^2} = \\sqrt{2760^2 - 2070^2} = 1830$ var.',
        'A capacitor takes reactive power $V^2/X_C = V^2\\omega C$, leading instead of lagging. Cancel the motor\'s: $C = \\dfrac{Q}{V^2\\omega} = \\dfrac{1830}{230^2 \\times 2\\pi \\times 50} = 1.1\\times10^{-4}$ F, about 110 µF.',
        'Now the supply provides only the real power: $I = 2070/230 = 9.0$ A instead of 12 A.'
      ],
      a: '2070 W, 2760 VA, 1830 var; about 110 µF, after which the supply current falls from 12 A to 9.0 A.'
    },
    {
      title: 'Where the power goes in an RLC circuit',
      q: 'The circuit of 30 Ω, 0.25 H and 80 µF on 230 V, 50 Hz mains carries 4.69 A with a phase angle of 52.3° (see [[rlc-impedance]]). Find the average power two ways.',
      steps: [
        '$P = V I\\cos\\varphi = 230 \\times 4.69 \\times \\cos 52.3° = 660$ W.',
        '$P = I^2R = 4.69^2 \\times 30 = 660$ W.',
        'The inductor and capacitor, despite their 369 V and 187 V, take nothing on average.'
      ],
      a: '660 W, all of it in the resistor.'
    }
  ],
  quiz: [
    { q: 'An ideal inductor on the mains draws 2 A (RMS) at 230 V. The average power it uses is…', choices: ['460 W', '0 W', '230 W', '325 W'], a: 1,
      why: 'Its current lags by 90°, so $\\cos\\varphi = 0$: it stores and returns energy each cycle.' },
    { q: 'A load has a power factor of 0.5. Compared with a purely resistive load taking the same real power from the same supply, its current is…', choices: ['half as big', 'the same', 'twice as big', 'four times as big'], a: 2,
      why: '$I = P/(V\\cos\\varphi)$: halving the power factor doubles the current.' },
    { q: 'Connecting a capacitor in parallel with an induction motor…', choices: ['increases the motor\'s output', 'reduces the current drawn from the supply by cancelling the reactive current', 'lowers the supply voltage', 'increases the losses in the cables'], a: 1,
      why: 'The capacitor\'s leading current cancels the motor\'s lagging reactive current; the motor itself works exactly as before.' },
    { q: 'In a series RLC circuit, all the average power is dissipated in the resistor.', a: true, why: 'Ideal inductors and capacitors take zero average power, so $P = I_\\text{rms}^2R$.' },
    { q: 'A load draws 10 A at 230 V with the current lagging by 60°. Its real power is…', choices: ['2300 W', '1150 W', '1992 W', '0 W'], a: 1, why: '$230 \\times 10 \\times \\cos 60° = 1150$ W.' }
  ],
  applications: [
    'Power-factor-correction capacitor banks in factories.',
    'Electricity meters, which record real energy in kWh.',
    'Rating generators, cables and transformers in kVA.',
    'Power-factor-correction circuits built into chargers, LED drivers and computer power supplies.'
  ],
  sim: 'em2-rlc'
}

);
