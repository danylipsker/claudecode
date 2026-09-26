/* HYPER-ELECTRONICS · content/oscillators.js — circuits that make their own signals:
 * the oscillation condition, RC, LC and crystal oscillators, relaxation oscillators,
 * the 555 timer and the phase-locked loop. */
Hyper.add(

{
  id: 'oscillator-principle', parent: 'oscillators', title: 'Oscillators and the Barkhausen criterion', level: 2,
  short: 'An amplifier whose output is fed back to its input, in step and with a loop gain of at least one, amplifies its own noise into a steady sine wave. The feedback network picks the frequency; a non-linearity sets the amplitude.',
  keywords: ['oscillator', 'positive feedback', 'Barkhausen criterion', 'loop gain', 'phase shift', 'start-up', 'amplitude stabilisation', 'feedback network', 'sine-wave oscillator', 'frequency stability', 'Q factor', 'howl'],
  prereq: ['negative-feedback', 'transfer-function', 'physics:driven-oscillations', 'math:complex-numbers'],
  related: ['rc-oscillators', 'lc-oscillators', 'crystal-oscillators', 'relaxation-oscillators', 'resonance-q'],
  body: `
Anyone who has held a microphone near its own loudspeaker knows the principle. Sound from the speaker reaches the microphone, is amplified, comes out louder, reaches the microphone again — and within a fraction of a second the system howls at one particular pitch. An electronic oscillator is that howl, tamed and made useful.

### The loop
Take an amplifier of gain $A$ and a feedback network that returns a fraction $\\beta$ of the output to the input, *adding* to it. With an input $v_\\text{in}$ the output is

$$v_\\text{out} = \\frac{A}{1 - A\\beta}\\,v_\\text{in}$$

Both $A$ and $\\beta$ are [[math:complex-numbers|complex]], frequency-dependent numbers: a gain and a phase. When the **loop gain** $A\\beta$ reaches exactly 1, the denominator vanishes and the circuit gives an output with no input at all. That is the **Barkhausen criterion**, named after the German physicist Heinrich Barkhausen. At the oscillation frequency $f_0$:

- $|A\\beta| = 1$ — the signal comes back the same size;
- $\\angle A\\beta = 0°$ (or 360°) — it comes back in step with itself.

The phase condition sets the **frequency**: the feedback network is designed so that its phase is exactly right at one frequency only. The magnitude condition sets whether it runs at all.

### Starting and settling
A loop gain of exactly 1 is useless in practice: nothing would start, and the slightest drift downwards would stop it. Real oscillators start with $|A\\beta|$ a little *above* 1 at $f_0$ — 1.05 to 1.5, say. Resistors and transistors always produce random noise, which contains every frequency; the component at $f_0$ goes round the loop, comes back a little larger, and grows exponentially. Each cycle multiplies its amplitude by the same factor $G$, so the time to reach full amplitude depends on the *logarithm* of how far it must grow: tens of cycles for an RC oscillator, tens of thousands for a crystal. Note that $G$, the growth per cycle, is not the loop gain itself: in a [[rc-oscillators|Wien-bridge oscillator]] a loop gain of 1.033 already gives $G = 1.37$.

Something must then stop the growth, by making the *average* loop gain fall to exactly 1:
- **clipping** at the supply rails — crude, and it distorts the sine;
- **soft limiting**, with diodes that lower the gain at large amplitudes;
- **automatic gain control**: a lamp, thermistor or JFET whose resistance follows the amplitude, correcting the gain slowly without distorting individual cycles.

### What makes a good oscillator
- **Frequency stability** depends on how steeply the network's phase changes with frequency. If the amplifier's own phase drifts by a few degrees, a network with a steep phase curve — a high-Q [[lc-oscillators|LC tank]] or, far better, a [[crystal-oscillators|quartz crystal]] — needs only a tiny frequency change to compensate. RC networks have gentle phase curves and drift more.
- **Purity** depends on how gently the amplitude is limited.
- **Unwanted oscillation** is the same physics working against you: an amplifier with negative feedback oscillates if its phase shift reaches 180° at a frequency where its loop gain is still 1 or more — the reason op-amp circuits need phase margin (see [[negative-feedback]]).

Oscillators that build a waveform by charging a capacitor to thresholds — [[relaxation-oscillators]] and the [[timer-555|555]] — work differently: they switch rather than amplify, and make square and triangular waves.

> [!key] The network sets the frequency, the gain decides whether it starts, and a non-linearity sets the amplitude. Every sine-wave oscillator has all three.
`,
  ideas: [
    'An oscillator is an amplifier with positive feedback: output returned in phase to the input.',
    'Barkhausen: at f₀ the loop gain Aβ has magnitude 1 and phase 0°.',
    'To start, the loop gain must exceed 1; noise at f₀ then grows exponentially.',
    'A non-linearity — clipping, diodes or gain control — brings the average loop gain back to exactly 1.',
    'The steeper the network\'s phase against frequency (the higher its Q), the more stable the frequency.'
  ],
  pitfalls: [
    'A loop gain of exactly 1 is the design target — With exactly 1 nothing starts and any drift stops it; design for a margin above 1 and let the limiting bring it down.',
    'The oscillator needs an input signal to get going — Noise in the components is always there; the loop picks out and grows the part at f₀.',
    'The amplifier sets the frequency — The feedback network does, through the frequency at which its phase shift is right.'
  ],
  formulas: [
    {
      name: 'Closed-loop gain with positive feedback',
      expr: 'Af = A/(1 - A*B)', tex: 'A_f = \\frac{A}{1 - A\\beta}',
      vars: {
        Af: { name: 'gain with feedback', signed: true, tex: 'A_f' },
        A: { name: 'amplifier gain', value: 3, tex: 'A' },
        B: { name: 'feedback fraction', value: 0.3, tex: '\\beta' }
      },
      note: 'At a single frequency, with A and β real and in phase. As Aβ approaches 1 the gain grows without limit: the circuit is about to oscillate.'
    },
    {
      name: 'Start-up time of an oscillator',
      expr: 'ts = ln(Vf/Vn)/(f*ln(G))', tex: 't_s = \\frac{\\ln(V_f/V_n)}{f\\,\\ln G}',
      vars: {
        ts: { name: 'time to build up', q: 'time', unit: 'ms', tex: 't_s' },
        Vf: { name: 'final amplitude', q: 'voltage', unit: 'V', value: 1, tex: 'V_f' },
        Vn: { name: 'starting (noise) amplitude', q: 'voltage', unit: 'µV', value: 10, tex: 'V_n' },
        f: { name: 'oscillation frequency', q: 'frequency', unit: 'kHz', value: 1 },
        G: { name: 'growth factor per cycle', value: 1.37, tex: 'G' }
      },
      note: 'The number of cycles is ln(V_f/V_n)/ln G. G is the amplitude growth per cycle, not the loop gain.',
      stories: { ts: 'An oscillator at {f} grows by a factor of {G} per cycle from {Vn} of noise. How long until it reaches {Vf}?' }
    }
  ],
  examples: [
    {
      title: 'How long does it take to start?',
      q: 'A 1 kHz oscillator grows by 37 % per cycle from about 10 µV of noise. How long until it reaches 1 V? A 32.768 kHz watch-crystal oscillator grows only about 0.03 % per cycle; how long does it take?',
      steps: [
        'The amplitude must grow by $1\\ \\mathrm{V}/10\\ \\mu\\mathrm{V} = 10^5$, and $\\ln 10^5 = 11.5$.',
        'At 37 % per cycle, $\\ln 1.37 = 0.315$, so $11.5/0.315 = 37$ cycles: 37 ms at 1 kHz.',
        'The crystal: $\\ln 1.0003 = 3.0 \\times 10^{-4}$, so $11.5/3.0\\times10^{-4} \\approx 38\\,000$ cycles.',
        'At 32 768 cycles per second that is about 1.2 s — why a real-time clock can take a second to start, and why its firmware must wait for it.'
      ],
      a: 'About 37 ms for the RC oscillator; about a second for the watch crystal.'
    }
  ],
  quiz: [
    { q: 'An oscillator\'s loop gain at $f_0$ is exactly 1.000 when first switched on. It will…', choices: ['start and run normally', 'never start reliably', 'oscillate at twice the frequency', 'saturate at once'], a: 1,
      why: 'With a loop gain of exactly 1 the noise at f₀ does not grow. Oscillators need a start-up margin above 1.' },
    { q: 'What sets the frequency of a sine-wave oscillator?', choices: ['The supply voltage', 'The frequency at which the loop phase shift is 0° (or 360°)', 'The amplifier gain', 'The noise'], a: 1,
      why: 'Only at that frequency does the signal return in step with itself; the network\'s components choose it.' },
    { q: 'Once running steadily, the average loop gain of a stable oscillator is exactly 1.', a: true,
      why: 'Above 1 the amplitude would keep growing, below 1 it would decay. The limiting mechanism adjusts itself until the average is exactly 1.' },
    { q: 'Why is a crystal oscillator more stable than an RC oscillator?', choices: ['Crystals have more gain', 'The phase of a high-Q resonator changes very steeply with frequency, so phase drift in the amplifier moves the frequency very little', 'Crystals are larger', 'Quartz does not warm up'], a: 1,
      why: 'Any phase error must be cancelled by a change of frequency. The steeper the network\'s phase curve, the smaller that change.' },
    { q: 'A 10 kHz oscillator grows by 20 % per cycle from 1 µV of noise. How many cycles does it take to reach 1 V?', answer: 76,
      why: 'ln(10⁶)/ln(1.2) = 13.8/0.182 ≈ 76 cycles, or 7.6 ms.' }
  ],
  applications: ['Clocks for every microcontroller and computer.', 'Local oscillators and carriers in radios.', 'Audio and function generators.', 'Understanding — and preventing — unwanted oscillation in amplifiers and regulators.'],
  sim: 'tr-wien'
},

{
  id: 'rc-oscillators', parent: 'oscillators', title: 'RC oscillators: phase shift and Wien bridge', level: 2,
  short: 'Resistors and capacitors can provide the frequency-selective feedback for audio-range oscillators: the Wien bridge (zero phase shift, gain of 3) for low-distortion sine waves, and the phase-shift oscillator (180°, gain of 29).',
  keywords: ['Wien bridge', 'Wien-bridge oscillator', 'phase-shift oscillator', 'RC oscillator', 'audio oscillator', 'amplitude stabilisation', 'lamp stabilisation', 'HP 200A', 'distortion', 'sine-wave generator', 'JFET AGC'],
  prereq: ['oscillator-principle', 'band-pass-stop', 'non-inverting-amplifier'],
  related: ['lc-oscillators', 'active-filters', 'relaxation-oscillators'],
  body: `
Below about 100 kHz, inductors large enough for an LC oscillator become bulky and lossy. RC networks do the frequency selection instead, with an op-amp or a transistor for gain.

### The Wien-bridge oscillator
The feedback network is a series RC from the amplifier's output to its non-inverting input, and a parallel RC from that input to ground. At low frequencies the series capacitor blocks the signal; at high frequencies the parallel capacitor shorts it. In between it is a [[band-pass-stop|band-pass]] network whose phase shift passes through **zero** at

$$f_0 = \\frac{1}{2\\pi RC}$$

and at that frequency it returns exactly **one third** of the output. The Barkhausen condition therefore asks for a [[non-inverting-amplifier|non-inverting amplifier]] with a gain of exactly 3: $1 + R_f/R_g = 3$, i.e. $R_f = 2R_g$.

With a gain $A$ a little different from 3, the loop behaves like a second-order system with a damping ratio $\\zeta = (3 - A)/2$. Below 3 any oscillation dies away; above 3 the amplitude grows by a factor $e^{\\pi(A-3)}$ every cycle — 37 % per cycle for $A = 3.1$. So the amplifier must start above 3 and be pulled back to exactly 3 as the amplitude builds:

- **Clipping at the rails** works, but gives a flattened, distorted sine.
- **Back-to-back diodes** across part of $R_f$: as the peaks exceed about half a volt across them they conduct and lower the gain. Simple, and good for 1–3 % distortion.
- **A lamp or a thermistor** in the gain network: its resistance follows the *average* signal power, adjusting the gain slowly without bending individual cycles, and distortion falls to hundredths of a per cent. A small incandescent lamp made this work in the HP 200A audio oscillator of 1939, the first product of Hewlett-Packard.
- **A JFET used as a voltage-controlled resistor** in an automatic gain control loop: the modern low-distortion method.

The frequency is tuned with a dual-gang potentiometer (both resistors together), and decade ranges are switched with the capacitors.

### The phase-shift oscillator
Three RC sections in cascade can shift the phase by 180°, and an inverting amplifier adds another 180°. For three equal high-pass sections (series C, shunt R) driven from a low-impedance source, the 180° point falls at

$$f_0 = \\frac{1}{2\\pi\\sqrt{6}\\,RC}$$

where the network attenuates by a factor of exactly **29** — so the amplifier needs a gain of at least 29. The circuit is simple and works with a single transistor, but amplitude control is awkward and tuning is hard, since three components must change together. It appears in textbooks and simple tone generators more than in instruments.

> [!warn] Op-amp bandwidth matters. Near its gain–bandwidth limit the amplifier adds phase shift of its own, pulling the frequency down and demanding more gain. Keep $f_0$ well below the op-amp's gain–bandwidth product divided by the closed-loop gain.
`,
  ideas: [
    'The Wien network has zero phase shift and passes one third of the signal at f₀ = 1/(2πRC).',
    'A Wien-bridge oscillator needs a non-inverting gain of exactly 3: R_f = 2R_g.',
    'Above 3 the amplitude grows by e^π(A−3) per cycle; below 3 it dies.',
    'Diodes, lamps, thermistors or a JFET bring the gain back to 3 as the amplitude builds.',
    'The phase-shift oscillator uses three RC sections (180°) and needs a gain of 29.'
  ],
  pitfalls: [
    'Set the gain to exactly 3 with precision resistors and it will run — It will not start reliably: the gain must start above 3 and be brought down by amplitude limiting.',
    'Clipping at the rails is as good as any other limiting — It works, but the flattened peaks mean several per cent distortion; gentle, slow gain control gives a far purer sine.',
    'Doubling R doubles the frequency — f₀ = 1/(2πRC): doubling R (or C) halves the frequency.'
  ],
  derivation: {
    title: 'Why the Wien network returns one third at zero phase',
    steps: [
      { text: 'The network is a divider: a series R and C ($Z_s$) above, a parallel R and C ($Z_p$) below, so the fraction returned is', tex: '\\beta = \\frac{Z_p}{Z_s + Z_p} = \\frac{1}{1 + Z_s/Z_p}' },
      { text: 'With $Z_s = R + \\frac{1}{j\\omega C}$ and $\\frac{1}{Z_p} = \\frac{1}{R} + j\\omega C$, and writing $x = \\omega RC$:', tex: '\\frac{Z_s}{Z_p} = \\left(1 + \\frac{1}{jx}\\right)(1 + jx) = 2 + j\\left(x - \\frac{1}{x}\\right)' },
      { text: 'So', tex: '\\beta = \\frac{1}{3 + j\\left(x - 1/x\\right)}' },
      { text: 'The imaginary part vanishes — zero phase shift — only at $x = 1$, i.e. $\\omega = 1/RC$, where $\\beta = 1/3$. An amplifier of gain 3 then closes the loop at exactly unity.', tex: 'f_0 = \\frac{1}{2\\pi RC}, \\qquad \\beta(f_0) = \\frac{1}{3}' }
    ]
  },
  formulas: [
    {
      name: 'Frequency of a Wien-bridge oscillator',
      expr: 'f = 1/(2*pi*R*C)', tex: 'f_0 = \\frac{1}{2\\pi RC}',
      vars: {
        f: { name: 'oscillation frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        R: { name: 'Wien resistors (both)', q: 'resistance', unit: 'kΩ', value: 16 },
        C: { name: 'Wien capacitors (both)', q: 'capacitance', unit: 'nF', value: 10 }
      },
      stories: { R: 'A Wien-bridge oscillator uses {C} capacitors. What resistors give {f}?' }
    },
    {
      name: 'Growth per cycle of a Wien-bridge oscillator',
      expr: 'G = exp(pi*(A - 3))', tex: 'G = e^{\\pi(A - 3)}',
      vars: {
        G: { name: 'amplitude growth factor per cycle', tex: 'G' },
        A: { name: 'non-inverting amplifier gain', value: 3.1, tex: 'A' }
      },
      note: 'From the damping ratio ζ = (3 − A)/2 of the loop. G < 1 means the oscillation dies away.'
    },
    {
      name: 'Frequency of a three-section phase-shift oscillator',
      expr: 'f = 1/(2*pi*sqrt(6)*R*C)', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{6}\\,RC}',
      vars: {
        f: { name: 'oscillation frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        R: { name: 'section resistors', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'section capacitors', q: 'capacitance', unit: 'nF', value: 10 }
      },
      note: 'For three equal high-pass sections driven from a low-impedance source; the amplifier needs a gain of at least 29.'
    }
  ],
  examples: [
    {
      title: 'A 1 kHz Wien-bridge oscillator',
      q: 'Design a Wien-bridge oscillator for about 1 kHz with 10 nF capacitors, using an op-amp with back-to-back diodes for amplitude control. Estimate the output amplitude.',
      steps: [
        '$R = 1/(2\\pi \\times 1000 \\times 10\\ \\mathrm{nF}) = 15.9\\ \\mathrm{k\\Omega}$ → 16 kΩ, giving 995 Hz.',
        'Gain network: $R_g$ = 10 kΩ and $R_f$ = 15 kΩ + 6.8 kΩ in series, with two 1N4148s in antiparallel across the 6.8 kΩ. With the diodes off, $A = 1 + 21.8/10 = 3.18$: it starts, growing by $e^{0.18\\pi} = 1.76$ per cycle.',
        'With the diodes fully on, $A = 1 + 15/10 = 2.5$, below 3 — so the amplitude settles in between.',
        'At a peak, the inverting input sits at $V_p/3$, so $V_p/(3 \\times 10\\ \\mathrm{k})$ flows through $R_g$ and on through the 15 kΩ, dropping $V_p/2$. That leaves $V_p - V_p/3 - V_p/2 = V_p/6$ across the diodes, which clamp near 0.55 V: $V_p \\approx 3.3$ V.'
      ],
      a: 'R = 16 kΩ (995 Hz); R_g = 10 kΩ, R_f = 15 kΩ + 6.8 kΩ with diodes; about 3 V peak.'
    }
  ],
  quiz: [
    { q: 'At the Wien network\'s centre frequency, the fraction of the output returned is…', choices: ['1/29', '1/3', '1/2', '1'], a: 1,
      why: 'β = 1/(3 + j(x − 1/x)), which is exactly 1/3 at x = ωRC = 1.' },
    { q: 'A Wien-bridge oscillator has $R_f = 2.2\\,R_g$. What happens?', choices: ['It does not start', 'It starts and grows until something limits it', 'It oscillates at twice f₀', 'It produces a pure sine forever with no limiting'], a: 1,
      why: 'The gain is 1 + 2.2 = 3.2 > 3, so the amplitude grows by e^0.2π ≈ 1.9 per cycle until clipping or the limiting network stops it.' },
    { q: 'You double both capacitors of a Wien-bridge oscillator. The frequency…', choices: ['doubles', 'halves', 'is unchanged', 'falls by √2'], a: 1,
      why: 'f₀ = 1/(2πRC) is inversely proportional to C.' },
    { q: 'A phase-shift oscillator built from three equal RC sections needs an amplifier gain of at least 29.', a: true,
      why: 'At the frequency where the three sections shift the phase by 180°, they attenuate the signal by a factor of 29.' },
    { q: 'Why did the HP 200A use a small incandescent lamp in its feedback network?', choices: ['As a power indicator', 'Its resistance rises with signal power, holding the loop gain at 3 without clipping individual cycles', 'To generate noise for start-up', 'To set the frequency'], a: 1,
      why: 'The filament\'s thermal time constant averages over many cycles, so it adjusts the gain smoothly — automatic gain control with almost no distortion.' }
  ],
  applications: ['Low-distortion audio test oscillators.', 'Tone generators and sirens.', 'Sine references for impedance and filter measurements.', 'Teaching the oscillation condition with a circuit that is easy to build.'],
  sim: 'tr-wien'
},

{
  id: 'lc-oscillators', parent: 'oscillators', title: 'LC oscillators: Colpitts and Hartley', level: 2,
  short: 'An inductor and a capacitor exchange energy at their resonant frequency; a transistor topping up the losses keeps them ringing. Colpitts and Hartley circuits tap the tank for their feedback — the workhorses from 100 kHz to gigahertz.',
  keywords: ['LC oscillator', 'tank circuit', 'Colpitts oscillator', 'Hartley oscillator', 'Clapp oscillator', 'resonance', 'VCO', 'varactor', 'RF oscillator', 'phase noise', 'Q factor', 'negative resistance'],
  prereq: ['oscillator-principle', 'resonance-q', 'physics:lc-resonance'],
  related: ['crystal-oscillators', 'rc-oscillators', 'pll', 'modulation'],
  body: `
Charge a capacitor, connect it across an inductor, and the energy swings back and forth between the capacitor's electric field and the inductor's magnetic field at the [[physics:lc-resonance|resonant frequency]]

$$f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$$

Left alone the ringing dies away: wire resistance and core loss take a fraction of about $2\\pi/Q$ of the stored energy each cycle (see [[resonance-q]]). An LC oscillator adds an amplifier that returns just that much every cycle. Near resonance the tank's impedance peaks and its phase swings rapidly through zero, so it is a far more selective feedback network than any RC circuit; tank Q of 50–200 is routine.

### Colpitts, Hartley and Clapp
The amplifier needs a feedback signal of the right phase. The classic circuits take it from a **tap** on the tank, which also works as an impedance transformer between the tank and the transistor:

- **Colpitts** (Edwin Colpitts, 1918): the capacitor is split into two in series, $C_1$ and $C_2$, and their junction provides the feedback. The tank capacitance is their series combination,
$$C = \\frac{C_1C_2}{C_1 + C_2}$$
and the ratio $C_1/C_2$ sets how much is fed back. No tapped coil is needed, which makes it the most common LC oscillator.
- **Hartley** (Ralph Hartley, 1915): the inductor is tapped instead, and $L = L_1 + L_2$, plus twice the mutual inductance when both halves share one former. A single variable capacitor tunes it — a favourite of early radio.
- **Clapp**: a Colpitts with a small capacitor in series with the inductor. That capacitor dominates the frequency, while large $C_1$ and $C_2$ swamp the transistor's own drifting capacitances: better stability.

A useful way to see the transistor's job is as a **negative resistance**: the active circuit presents a resistance below zero to the tank, cancelling its loss resistance. Start-up needs the negative resistance to exceed the loss by a margin; designers commonly aim for three to five times.

### Where they are used
- **RF signal sources and local oscillators** in radios, from long wave to microwaves (where the "inductor" may be a length of transmission line or a cavity).
- **VCOs**: a **varactor** diode, whose capacitance falls as its reverse voltage rises, replaces part of the tank capacitance, so a voltage tunes the frequency. The heart of every [[pll|phase-locked loop]] synthesiser.
- **Proximity sensors and metal detectors**: a nearby object changes the coil's inductance or loss, shifting the frequency or stopping the oscillation.

The frequency stability of an LC oscillator is limited by the temperature coefficients of $L$ and $C$ — use C0G/NP0 capacitors and stable coils — to tens of ppm per °C at best. For better, use a [[crystal-oscillators|crystal]].

> [!tip] Frequency goes as $1/\\sqrt{LC}$: to double the frequency, divide the product $LC$ by four. A varactor that swings the capacitance over 2:1 tunes the frequency over only $\\sqrt 2$ : 1.
`,
  ideas: [
    'An LC tank rings at f₀ = 1/(2π√(LC)); the amplifier replaces the energy lost each cycle.',
    'Colpitts taps a capacitive divider, Hartley a tapped inductor; Clapp adds a series capacitor for stability.',
    'In a Colpitts the tank sees C₁ and C₂ in series.',
    'The active circuit acts as a negative resistance cancelling the tank\'s loss.',
    'A varactor in the tank makes a voltage-controlled oscillator.'
  ],
  pitfalls: [
    'In a Colpitts the two capacitors add — They are in series around the tank: C = C₁C₂/(C₁ + C₂), smaller than either.',
    'Doubling the capacitance halves the frequency — f₀ goes as 1/√C: doubling C lowers the frequency by only √2.',
    'An LC oscillator is as stable as a crystal — LC components drift tens of ppm per °C; a crystal is a thousand times steadier.'
  ],
  formulas: [
    {
      name: 'Resonant frequency of an LC tank',
      expr: 'f = 1/(2*pi*sqrt(L*C))', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'MHz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 2.3 },
        C: { name: 'tank capacitance', q: 'capacitance', unit: 'pF', value: 110 }
      },
      stories: { L: 'An oscillator must run at {f} with {C} of tank capacitance. What inductance is needed?' }
    },
    {
      name: 'Colpitts oscillator frequency',
      expr: 'f = 1/(2*pi*sqrt(L*C1*C2/(C1 + C2)))', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{L\\,\\dfrac{C_1C_2}{C_1 + C_2}}}',
      vars: {
        f: { name: 'oscillation frequency', q: 'frequency', unit: 'MHz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'µH', value: 2.3 },
        C1: { name: 'first divider capacitor', q: 'capacitance', unit: 'pF', value: 220, tex: 'C_1' },
        C2: { name: 'second divider capacitor', q: 'capacitance', unit: 'pF', value: 220, tex: 'C_2' }
      }
    },
    {
      name: 'Hartley oscillator frequency',
      expr: 'f = 1/(2*pi*sqrt((L1 + L2)*C))', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{(L_1 + L_2)\\,C}}',
      vars: {
        f: { name: 'oscillation frequency', q: 'frequency', unit: 'MHz', tex: 'f_0' },
        L1: { name: 'first part of the coil', q: 'inductance', unit: 'µH', value: 10, tex: 'L_1' },
        L2: { name: 'second part of the coil', q: 'inductance', unit: 'µH', value: 2.5, tex: 'L_2' },
        C: { name: 'tuning capacitance', q: 'capacitance', unit: 'pF', value: 200 }
      },
      note: 'Neglects the mutual inductance between the two parts; with it, L = L₁ + L₂ + 2M.'
    }
  ],
  examples: [
    {
      title: 'A 10 MHz Colpitts',
      q: 'A Colpitts oscillator uses $C_1 = C_2 = 220$ pF. What inductor gives 10 MHz?',
      steps: [
        'The tank sees $C = 220 \\times 220/440 = 110$ pF.',
        { text: 'Rearrange $f_0 = 1/(2\\pi\\sqrt{LC})$:', tex: 'L = \\frac{1}{(2\\pi f_0)^2 C} = \\frac{1}{(6.283\\times10^{7})^2 \\times 110\\times10^{-12}} = 2.30\\ \\mu\\mathrm{H}' },
        'In practice a slug-tuned coil near 2.2 µH, or a trimmer capacitor, trims it onto frequency — and the transistor\'s own capacitances will pull it slightly low.'
      ],
      a: 'About 2.3 µH.'
    },
    {
      title: 'Tuning with a varactor',
      q: 'A tank has $L$ = 1 µH and a fixed 50 pF in parallel with a varactor that ranges from 40 pF (at 1 V) to 10 pF (at 8 V). What frequency range does it cover?',
      steps: [
        'Total capacitance: 90 pF at 1 V, 60 pF at 8 V.',
        '$f = 1/(2\\pi\\sqrt{10^{-6} \\times 90\\times10^{-12}}) = 16.8$ MHz, and $1/(2\\pi\\sqrt{10^{-6} \\times 60\\times10^{-12}}) = 20.5$ MHz.',
        'A 1.5 : 1 capacitance swing gives only a $\\sqrt{1.5} = 1.22$ : 1 frequency swing.'
      ],
      a: 'About 16.8 to 20.5 MHz.'
    }
  ],
  quiz: [
    { q: 'A Colpitts oscillator has $C_1 = C_2 = 1$ nF and $L = 10$ µH. Replacing the inductor with 40 µH changes the frequency by a factor of…', choices: ['4', '2', '½', '¼'], a: 2,
      why: 'f ∝ 1/√L: four times the inductance halves the frequency.' },
    { q: 'What does the transistor in an LC oscillator supply?', choices: ['The frequency', 'The energy lost in the tank each cycle', 'The tank capacitance', 'The inductance'], a: 1,
      why: 'The tank sets the frequency; the transistor replaces its losses — a negative resistance that cancels the tank\'s loss resistance.' },
    { q: 'The effective tank capacitance of a Colpitts with $C_1$ = 100 pF and $C_2$ = 400 pF is 500 pF.', a: false,
      why: 'The two are in series around the tank: 100 × 400/500 = 80 pF.' },
    { q: 'A varactor diode in the tank lets you…', choices: ['switch the oscillator off', 'tune the frequency with a voltage', 'raise the Q', 'raise the output power'], a: 1,
      why: 'Its capacitance depends on its reverse voltage, so the frequency follows a control voltage: a VCO.' }
  ],
  applications: ['Local oscillators and VCOs in radios and synthesisers.', 'RF signal generators and transmitters.', 'Inductive proximity sensors and metal detectors.', 'Wireless-power and RFID readers, which drive a resonant coil.']
},

{
  id: 'crystal-oscillators', parent: 'oscillators', title: 'Crystal oscillators', level: 2,
  short: 'A sliver of quartz vibrates mechanically at a frequency fixed by its cut and size, and couples to the circuit through the piezoelectric effect. It behaves as an LC circuit with a Q in the tens of thousands — why clocks keep time to seconds per week.',
  keywords: ['crystal', 'quartz', 'crystal oscillator', 'piezoelectric', 'Pierce oscillator', 'load capacitance', 'ppm', 'AT-cut', '32.768 kHz', 'watch crystal', 'TCXO', 'OCXO', 'MEMS oscillator', 'motional inductance', 'series resonance', 'parallel resonance', 'drive level'],
  prereq: ['lc-oscillators', 'oscillator-principle', 'resonance-q'],
  related: ['timing-clocks', 'microcontrollers', 'pll'],
  body: `
Quartz is **piezoelectric**: squeezing it produces a voltage across it, and a voltage across it makes it deform. Cut a thin plate from a quartz crystal, plate electrodes on both faces, and an alternating voltage near the plate's mechanical resonance sets it vibrating strongly — and the vibration in turn drives a large current. Electrically the crystal looks like a series RLC circuit (the **motional** arm, standing for the mechanics) in parallel with the ordinary capacitance $C_0$ of its electrodes:

| Element | Typical 10 MHz AT-cut crystal |
|---|---|
| motional inductance $L_1$ | about 13 mH |
| motional capacitance $C_1$ | about 0.02 pF (20 fF) |
| motional resistance $R_1$ (ESR) | 10–40 Ω |
| shunt capacitance $C_0$ | 3–7 pF |

The inductance is enormous and the capacitance minute — no real coil and capacitor could reach the resulting Q of $\\omega L_1/R_1$, typically 20 000–100 000. The frequency is set by the plate's dimensions, and quartz barely changes with temperature, especially with the right cut.

### Series and parallel resonance
The motional arm resonates at the **series resonant frequency** $f_s = 1/(2\\pi\\sqrt{L_1C_1})$, where the crystal looks like just $R_1$. Slightly above it, where the motional arm looks inductive and resonates with $C_0$, lies the **parallel (anti-)resonance**. Between the two — a band only a few hundred ppm wide — the crystal behaves as an inductor, and most oscillators operate it there, with a specified **load capacitance** $C_L$ across it. The frequency then sits above $f_s$ by

$$\\frac{\\Delta f}{f_s} \\approx \\frac{C_1}{2(C_0 + C_L)}$$

That is why a crystal is ordered "for 18 pF load", and why the wrong capacitors shift the frequency by tens of ppm.

### The Pierce oscillator
Nearly every microcontroller clock is a **Pierce** oscillator: an inverting amplifier (a CMOS inverter biased into its linear region by a megohm resistor, usually inside the chip), the crystal from its output to its input, and a capacitor from each end to ground. Crystal and capacitors form a π network with 180° of phase shift at the operating frequency. The crystal sees the two capacitors in series, plus stray capacitance:

$$C_L = \\frac{C_{X1}C_{X2}}{C_{X1} + C_{X2}} + C_\\text{stray}$$

For an 18 pF crystal and about 5 pF of stray, $C_{X1} = C_{X2} = 2 \\times (18 - 5) = 26$ pF: fit 27 pF.

### Accuracy in numbers
Crystal tolerances are quoted in **parts per million**. A typical microcontroller crystal is ±20 ppm at 25 °C, with perhaps ±30 ppm more over temperature. Twenty ppm of a day is 1.7 s — about a minute a month. The 32.768 kHz tuning-fork crystal of watches and real-time clocks ($2^{15}$ Hz, so fifteen halvings give one pulse per second) has a parabolic temperature curve, about $-0.034$ ppm/°C² away from 25 °C: a watch on a cold wrist runs slow. Better references:
- **TCXO** (temperature-compensated): a network or a stored table corrects the drift — ±0.5 to ±2 ppm, in GPS receivers and phones.
- **OCXO** (oven-controlled): the crystal is held at a constant 70–85 °C — 0.01–0.1 ppm, for instruments and base stations.
- **MEMS oscillators** replace quartz with a silicon resonator plus compensation: robust against shock and now common.

> [!warn] Crystals have a maximum **drive level** — often 100–300 µW, and far less for watch crystals. Overdriving ages or even cracks them; a series resistor at the amplifier's output limits it.
`,
  ideas: [
    'A quartz crystal behaves as a series RLC with an enormous L, a tiny C and a Q of tens of thousands.',
    'Most oscillators run the crystal slightly above series resonance, where it looks inductive, with a specified load capacitance.',
    'In a Pierce oscillator the crystal sees its two load capacitors in series plus the stray capacitance.',
    'Accuracy is quoted in ppm: 20 ppm is about a minute a month.',
    'TCXOs and OCXOs trade cost and power for accuracies down to 0.01 ppm.'
  ],
  pitfalls: [
    'Any small capacitors will do — The load capacitance pulls the frequency by tens of ppm per picofarad; use the crystal\'s specified C_L, allowing for stray capacitance.',
    'A crystal oscillator is exact — A standard crystal is typically ±20–50 ppm including temperature, which is seconds per day.',
    'More drive makes a crystal oscillator more reliable — Excess drive level ages or damages the crystal; watch crystals are especially delicate.'
  ],
  formulas: [
    {
      name: 'Load capacitance of a Pierce oscillator',
      expr: 'CL = Cx1*Cx2/(Cx1 + Cx2) + Cs', tex: 'C_L = \\frac{C_{X1}C_{X2}}{C_{X1} + C_{X2}} + C_{\\text{stray}}',
      vars: {
        CL: { name: 'load capacitance seen by the crystal', q: 'capacitance', unit: 'pF', tex: 'C_L' },
        Cx1: { name: 'first load capacitor', q: 'capacitance', unit: 'pF', value: 27, tex: 'C_{X1}' },
        Cx2: { name: 'second load capacitor', q: 'capacitance', unit: 'pF', value: 27, tex: 'C_{X2}' },
        Cs: { name: 'stray capacitance (pins, traces)', q: 'capacitance', unit: 'pF', value: 5, tex: 'C_{\\text{stray}}' }
      },
      stories: { Cx1: 'A crystal specified for {CL} load is used in a Pierce oscillator with {Cs} of stray capacitance and a second capacitor of {Cx2}. What value must the first capacitor have?' }
    },
    {
      name: 'Frequency pulling by the load capacitance',
      expr: 'df = Cm/(2*(C0 + CL))', tex: '\\delta = \\frac{C_1}{2\\left(C_0 + C_L\\right)}',
      vars: {
        df: { name: 'relative offset above series resonance, Δf/f_s', q: 'ratio', unit: 'ppm', tex: '\\delta' },
        Cm: { name: 'motional capacitance', q: 'capacitance', unit: 'pF', value: 0.02, tex: 'C_1' },
        C0: { name: 'shunt capacitance', q: 'capacitance', unit: 'pF', value: 5, tex: 'C_0' },
        CL: { name: 'load capacitance', q: 'capacitance', unit: 'pF', value: 18, tex: 'C_L' }
      },
      note: 'Changing C_L by 1 pF here moves the frequency by about 19 ppm.'
    },
    {
      name: 'Clock drift from a frequency error',
      expr: 'drift = err*T', tex: '\\Delta t = \\epsilon\\,T',
      vars: {
        drift: { name: 'time gained or lost', q: 'time', unit: 's', tex: '\\Delta t' },
        err: { name: 'frequency error', q: 'ratio', unit: 'ppm', value: 20, tex: '\\epsilon' },
        T: { name: 'elapsed time', q: 'time', unit: 'day', value: 30 }
      },
      stories: { drift: 'A real-time clock\'s crystal is off by {err}. How far does the clock drift in {T}?' }
    }
  ],
  examples: [
    {
      title: 'Load capacitors for a watch crystal',
      q: 'A 32.768 kHz crystal is specified for $C_L$ = 12.5 pF. The board and chip add about 3 pF of stray capacitance. What two equal capacitors should you fit?',
      steps: [
        'The capacitors in series must supply $12.5 - 3 = 9.5$ pF.',
        'Two equal capacitors in series give half their value: $C_X = 2 \\times 9.5 = 19$ pF.',
        'Nearest standard value: 18 pF (E12). The result is 12 pF, 0.5 pF low — the clock will run a few ppm fast; trim in firmware if it matters.'
      ],
      a: 'Two 18 pF capacitors.'
    },
    {
      title: 'How far off is the clock?',
      q: 'A data logger\'s real-time clock uses a ±20 ppm watch crystal and spends the winter at 5 °C (its crystal has a turnover at 25 °C and −0.034 ppm/°C²). What drift per month can you expect?',
      steps: [
        'Tolerance alone: $20 \\times 10^{-6} \\times 30 \\times 86\\,400\\ \\mathrm{s} = 52$ s per month, either way.',
        'Temperature: $-0.034 \\times (5 - 25)^2 = -13.6$ ppm, always slow: another 35 s per month.',
        'Worst case about 1.5 minutes a month slow — which is why loggers resynchronise over the network or use a TCXO-based RTC.'
      ],
      a: 'Up to about 52 s from tolerance plus 35 s slow from the cold: roughly 1.5 min per month.'
    }
  ],
  quiz: [
    { q: 'A crystal oscillator is specified at ±50 ppm. At 16 MHz the frequency may be off by up to…', choices: ['50 Hz', '800 Hz', '8 kHz', '16 kHz'], a: 1,
      why: '16 × 10⁶ × 50 × 10⁻⁶ = 800 Hz.' },
    { q: 'Fitting load capacitors larger than the crystal\'s specified value makes the oscillator run…', choices: ['slightly fast', 'slightly slow', 'at exactly the marked frequency', 'at double frequency'], a: 1,
      why: 'Δf/f_s = C₁/2(C₀ + C_L): a larger C_L pulls the frequency down towards series resonance.' },
    { q: '32.768 kHz is used in watches because fifteen halvings of it give exactly one pulse per second.', a: true,
      why: '32 768 = 2¹⁵, so a 15-stage binary counter divides it down to 1 Hz.' },
    { q: 'Why is the Q of a quartz crystal so much higher than that of an LC tank?', choices: ['Quartz is a superconductor', 'Its mechanical vibration loses very little energy per cycle compared with the energy stored', 'The crystal has no capacitance', 'It runs at a higher frequency'], a: 1,
      why: 'Q measures stored energy against the energy lost per cycle; a quartz resonator\'s internal losses are tiny.' }
  ],
  applications: ['Clocks for microcontrollers, processors and USB and Ethernet interfaces.', 'Real-time clocks and watches (32.768 kHz).', 'References for frequency synthesisers in radios and GPS receivers.', 'Frequency counters and laboratory references (OCXO).'],
  history: 'Walter Cady built the first quartz-crystal oscillator in 1921, and by 1927 Warren Marrison at Bell Labs had a quartz clock more accurate than any pendulum. The first quartz wristwatch, the Seiko Astron, went on sale in 1969.'
},

{
  id: 'relaxation-oscillators', parent: 'oscillators', title: 'Relaxation oscillators', level: 2,
  short: 'Charge a capacitor through a resistor until it reaches a threshold, then discharge it or reverse the charging, and repeat: square, triangle and sawtooth waves from a comparator with hysteresis, a Schmitt-trigger gate, or a 555.',
  keywords: ['relaxation oscillator', 'astable', 'astable multivibrator', 'Schmitt trigger oscillator', 'op-amp astable', 'square wave', 'sawtooth', 'triangle wave', 'hysteresis', '74HC14', 'VCO', 'LED flasher'],
  prereq: ['rc-transient', 'schmitt-trigger', 'oscillator-principle'],
  related: ['timer-555', 'comparators', 'pwm'],
  body: `
Not every oscillator makes sine waves. A **relaxation oscillator** works like a dripping tap or a flushing cistern: something slowly fills to a threshold, then suddenly empties, and starts again. In electronics the slow part is a capacitor charging through a resistor, and the sudden part is a switch or a comparator that changes state at a threshold. The waveforms are square, triangular or sawtooth, and the frequency is set by an RC time constant and the two thresholds — not by a resonance.

### The time to charge between two thresholds
A capacitor charging through $R$ towards a voltage $V_S$ follows the [[rc-transient|exponential curve]] $v(t) = V_S - (V_S - v_0)\\,e^{-t/RC}$. The time to go from $V_1$ to $V_2$ is therefore

$$t = RC\\,\\ln\\frac{V_S - V_1}{V_S - V_2}$$

Every relaxation oscillator's period is a sum of terms like this.

### The op-amp (comparator) astable
An op-amp with positive feedback through a divider $R_1$, $R_2$ is a [[schmitt-trigger|Schmitt trigger]]: its output sits at $+V_\\text{sat}$ or $-V_\\text{sat}$, and it switches when its inverting input crosses $\\pm bV_\\text{sat}$, with $b = R_2/(R_1 + R_2)$. Add an RC from the output to the inverting input. The capacitor charges towards the output voltage, crosses the threshold, the output flips, and the capacitor heads back the other way. Its voltage is a rounded triangle between the thresholds, and the output a square wave with period

$$T = 2RC\\,\\ln\\frac{1 + b}{1 - b}$$

With $R_1 = R_2$, $b = 0.5$ and $T = 2RC\\ln 3 \\approx 2.2\\,RC$.

### The Schmitt-trigger gate oscillator
One gate of a 74HC14 (or CD40106), a resistor from its output back to its input, a capacitor from input to ground: the cheapest oscillator there is. Its period depends on the gate's thresholds, which vary from chip to chip and with the supply, so expect ±20–30 % from any formula. Fine for blinking an LED or clocking a charge pump, not for a timebase.

### The family
- **The [[timer-555|555 timer]]**: comparators at $\\tfrac13$ and $\\tfrac23$ of the supply, a flip-flop and a discharge transistor — a relaxation oscillator in a chip, with thresholds tied to the supply so that the frequency does not depend on it.
- **Sawtooth generators**: charge a capacitor from a [[current-mirrors|current source]], giving a straight ramp instead of an exponential, and dump it with a transistor at the threshold — the timebase of analogue oscilloscopes and the ramp inside PWM controllers.
- **The astable multivibrator**: two transistors cross-coupled through capacitors, each in turn switching the other off — the classic two-LED flasher.
- **Voltage-controlled oscillators**, such as the one in the CD4046 [[pll|phase-locked loop]]: the charging current is set by an input voltage, so the frequency follows the voltage.

Relaxation oscillators are less stable than resonant ones — the thresholds, the supply and the capacitor all drift — but they start instantly, work from millihertz to megahertz, and produce edges that digital circuits can use directly.
`,
  ideas: [
    'A relaxation oscillator charges a capacitor to a threshold, switches, and repeats.',
    'Each segment lasts RC·ln((V_S − V₁)/(V_S − V₂)).',
    'An op-amp astable with b = R₂/(R₁ + R₂) has T = 2RC·ln((1 + b)/(1 − b)); 2.2RC for equal resistors.',
    'Schmitt-gate oscillators are cheap but only accurate to tens of per cent.',
    'Charging from a current source gives a linear ramp: sawtooth and triangle generators, and VCOs.'
  ],
  pitfalls: [
    'A relaxation oscillator\'s frequency is set by a resonance — It is set by an RC time constant and two thresholds; there is nothing resonant about it.',
    'The capacitor charges from zero each cycle — In steady state it swings only between the two thresholds; only the very first cycle starts from zero, and is longer.',
    'A Schmitt-gate oscillator is accurate enough for a serial port — Its thresholds vary by tens of per cent between chips; use a crystal or the microcontroller\'s calibrated oscillator.'
  ],
  formulas: [
    {
      name: 'Time for an RC to charge between two voltages',
      expr: 't = R*C*ln((Vs - V1)/(Vs - V2))', tex: 't = RC\\,\\ln\\frac{V_S - V_1}{V_S - V_2}',
      vars: {
        t: { name: 'time', q: 'time', unit: 'ms' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 },
        Vs: { name: 'voltage it charges towards', q: 'voltage', unit: 'V', value: 9, tex: 'V_S' },
        V1: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 3, tex: 'V_1' },
        V2: { name: 'end (threshold) voltage', q: 'voltage', unit: 'V', value: 6, tex: 'V_2' }
      },
      note: 'Works for discharging too: then V_S is below both V₁ and V₂.',
      stories: { t: 'A capacitor of {C} charges through {R} towards {Vs}. How long does it take to go from {V1} to {V2}?' }
    },
    {
      name: 'Period of an op-amp astable',
      expr: 'T = 2*R*C*ln((1 + b)/(1 - b))', tex: 'T = 2RC\\,\\ln\\frac{1 + b}{1 - b}',
      vars: {
        T: { name: 'period', q: 'time', unit: 'ms' },
        R: { name: 'timing resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'timing capacitor', q: 'capacitance', unit: 'nF', value: 100 },
        b: { name: 'feedback fraction R₂/(R₁ + R₂)', value: 0.5, min: 0.01, max: 0.99 }
      },
      stories: { R: 'An op-amp astable uses {C} and equal divider resistors (b = {b}). What timing resistor gives a period of {T}?' }
    }
  ],
  examples: [
    {
      title: 'A 1 kHz op-amp square-wave generator',
      q: 'Build a square-wave oscillator with an op-amp, equal feedback-divider resistors and a 100 nF timing capacitor. What timing resistor gives about 1 kHz?',
      steps: [
        'With $b = 0.5$: $T = 2RC\\ln 3 = 2.197\\,RC$.',
        '$R = 1\\ \\mathrm{ms}/(2.197 \\times 100\\ \\mathrm{nF}) = 4.55\\ \\mathrm{k\\Omega}$.',
        'With 4.7 kΩ: $T = 2.197 \\times 4.7\\ \\mathrm{k} \\times 100\\ \\mathrm{n} = 1.03$ ms, i.e. 968 Hz. The capacitor swings between $\\pm V_\\text{sat}/2$.'
      ],
      a: '4.7 kΩ gives 968 Hz (4.3 kΩ from E24 gives 1.06 kHz).'
    }
  ],
  quiz: [
    { q: 'In an op-amp astable, you make $R_2$ much smaller than $R_1$ (so $b$ is small). The frequency…', choices: ['rises: the thresholds are close together, so each half-cycle is short', 'falls', 'is unchanged', 'goes to zero'], a: 0,
      why: 'For small b, T ≈ 4bRC: thresholds near zero are reached quickly, so the frequency rises (and the capacitor voltage becomes a small triangle).' },
    { q: 'A relaxation oscillator\'s frequency is set by a resonance, like an LC tank.', a: false,
      why: 'It is set by an RC time constant and two thresholds.' },
    { q: 'Why is a 74HC14 RC oscillator a poor clock for a UART?', choices: ['It cannot oscillate fast enough', 'Its thresholds vary between chips and with supply, so its frequency is known only to tens of per cent', 'It makes sine waves', 'It needs a crystal'], a: 1,
      why: 'Serial links need the clocks at both ends to agree within a few per cent.' },
    { q: 'A capacitor charges through 100 kΩ towards 10 V. With C = 1 µF, how long does it take to go from 0 V to 5 V?', answer: 69.3, unit: 'ms',
      why: 't = RC ln(10/5) = 0.1 s × 0.693 = 69.3 ms.' }
  ],
  applications: ['LED flashers and beepers.', 'Clock sources for charge pumps and simple logic.', 'Sawtooth timebases and PWM ramps.', 'Voltage-to-frequency converters and VCOs.'],
  sim: 'tr-555'
},

{
  id: 'timer-555', parent: 'oscillators', title: 'The 555 timer', level: 1,
  short: 'Two comparators, a flip-flop and a discharge transistor in an 8-pin package: with a couple of resistors and a capacitor it makes a pulse of set length (monostable) or runs as an oscillator (astable), from millihertz to hundreds of kilohertz.',
  keywords: ['555', 'NE555', 'LM555', 'TLC555', 'ICM7555', '556', 'timer', 'astable', 'monostable', 'duty cycle', 'one-shot', 'Forrest Mims', 'Hans Camenzind', 'LED flasher', 'threshold', 'trigger', 'control voltage'],
  prereq: ['relaxation-oscillators', 'rc-transient', 'comparators'],
  related: ['pwm', 'flip-flops', 'schmitt-trigger'],
  body: `
Designed by Hans Camenzind for Signetics and introduced in 1972, the 555 is probably the most-produced integrated circuit design of all, and is still made by the billion. It owes that to one idea: its thresholds are **fractions of the supply**, so its timing does not depend on the supply voltage.

### Inside
- Three equal resistors (5 kΩ each in the original — the often-told source of the name) divide the supply into $\\tfrac13 V_{CC}$ and $\\tfrac23 V_{CC}$.
- The **threshold comparator** (pin 6) resets the flip-flop when its input rises above $\\tfrac23 V_{CC}$.
- The **trigger comparator** (pin 2) sets it when its input falls below $\\tfrac13 V_{CC}$.
- The flip-flop drives the **output** (pin 3 — a push-pull stage that sources or sinks up to about 200 mA in the bipolar NE555) and the **discharge** transistor (pin 7), which shorts to ground whenever the output is low.
- **Reset** (pin 4) forces the output low; tie it to $V_{CC}$ when unused. **Control voltage** (pin 5) is the $\\tfrac23$ point itself: decouple it with 10 nF, or drive it to shift both thresholds and so modulate the timing.

### The astable: an oscillator
$R_1$ runs from $V_{CC}$ to pin 7, $R_2$ from pin 7 to pins 6 and 2 joined, and $C$ from there to ground. The capacitor charges through $R_1 + R_2$ from $\\tfrac13$ to $\\tfrac23 V_{CC}$ — a time $\\ln 2\\,(R_1 + R_2)C$ — with the output high. At $\\tfrac23 V_{CC}$ the flip-flop resets, and pin 7 discharges the capacitor through $R_2$ alone back to $\\tfrac13 V_{CC}$, taking $\\ln 2\\,R_2C$, with the output low. So

$$f = \\frac{1}{\\ln 2\\,(R_1 + 2R_2)\\,C} \\approx \\frac{1.44}{(R_1 + 2R_2)\\,C}, \\qquad D = \\frac{R_1 + R_2}{R_1 + 2R_2}$$

The duty cycle $D$ — the fraction of the time the output is high — is always above 50 %. For less, put a diode across $R_2$ (anode at pin 7): the capacitor then charges through $R_1$ and the diode, and discharges through $R_2$, so the two times are set independently (the charging time comes out a little longer than $\\ln 2\\,R_1C$ because of the diode's drop).

### The monostable: a one-shot pulse
With $R$ from $V_{CC}$ to pins 6 and 7 and $C$ to ground, a brief low pulse on pin 2 sets the flip-flop. The output goes high and the capacitor charges from 0 to $\\tfrac23 V_{CC}$, which takes $t = \\ln 3\\,RC \\approx 1.1\\,RC$; then the output drops and the capacitor is discharged, ready for the next trigger. Uses: switch debouncing, stretching a short event into a visible blink, missing-pulse detection.

### Practical points
- The bipolar NE555 needs 4.5–16 V and draws large current spikes at each transition: decouple it with 100 nF right at its pins and a bulk capacitor nearby. The CMOS versions (TLC555, ICM7555, LMC555) run from 2–3 V, draw microamps, and allow much larger timing resistors.
- Keep $R_1$ above about 1 kΩ (pin 7 must sink the current through it when it discharges) and the total below a few megohms (leakage and the comparators' input currents). For long times, the ±20 % tolerance and the leakage of electrolytic capacitors dominate; a CMOS 555 with a large resistor and a film capacitor repeats far better.
- The very first high period after power-up is longer, because the capacitor starts from 0 V rather than from $\\tfrac13 V_{CC}$: $\\ln 3$ instead of $\\ln 2$.

> [!tip] Build them for real: [the 555 Timer Sims collection](../CIRCUITS/555-circuitjs-sims/index.html) holds twenty-eight circuits from Forrest Mims's 555 notebook — flashers, tone generators, sirens, pulse-width modulators, missing-pulse detectors — each opening live in CircuitJS1, so you can probe every node while it runs.
`,
  ideas: [
    'The 555\'s comparators switch at ⅓ and ⅔ of the supply, so its timing does not depend on the supply voltage.',
    'Astable: f ≈ 1.44/((R₁ + 2R₂)C), with the duty cycle always above 50 %.',
    'A diode across R₂ lets the high and low times be set independently.',
    'Monostable: one pulse of about 1.1RC per trigger.',
    'Decouple the supply and pin 5; CMOS versions draw microamps.'
  ],
  pitfalls: [
    'The capacitor swings from 0 V to V_CC — It swings between ⅓ and ⅔ of V_CC; only the first charge starts from 0 V.',
    'A standard 555 astable can give any duty cycle — The high time charges through R₁ + R₂ but the low time only through R₂, so D > 50 % unless a diode is added.',
    'Pin 5 can be left open without consequence — It is the threshold reference itself; noise on it jitters the timing, so decouple it with 10 nF.'
  ],
  formulas: [
    {
      name: 'Frequency of a 555 astable',
      expr: 'f = 1/(ln(2)*(R1 + 2*R2)*C)', tex: 'f = \\frac{1}{\\ln 2\\,(R_1 + 2R_2)\\,C}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz' },
        R1: { name: 'resistor from V_CC to pin 7', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'resistor from pin 7 to pins 6 and 2', q: 'resistance', unit: 'kΩ', value: 68, tex: 'R_2' },
        C: { name: 'timing capacitor', q: 'capacitance', unit: 'µF', value: 10 }
      },
      note: '1/ln 2 ≈ 1.44, the number in the usual rule of thumb.',
      stories: {
        f: 'A 555 astable has R₁ = {R1}, R₂ = {R2} and C = {C}. At what frequency does it run?',
        R2: 'A 555 astable with R₁ = {R1} and C = {C} must run at {f}. What value of R₂?'
      }
    },
    {
      name: 'Duty cycle of a 555 astable',
      expr: 'D = (R1 + R2)/(R1 + 2*R2)', tex: 'D = \\frac{R_1 + R_2}{R_1 + 2R_2}',
      vars: {
        D: { name: 'duty cycle (fraction of the time high)', q: 'ratio', unit: '%' },
        R1: { name: 'resistor from V_CC to pin 7', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'resistor from pin 7 to pins 6 and 2', q: 'resistance', unit: 'kΩ', value: 68, tex: 'R_2' }
      }
    },
    {
      name: 'Pulse length of a 555 monostable',
      expr: 'T = ln(3)*R*C', tex: 'T = \\ln 3\\,RC',
      vars: {
        T: { name: 'pulse length', q: 'time', unit: 's' },
        R: { name: 'timing resistor', q: 'resistance', unit: 'kΩ', value: 100 },
        C: { name: 'timing capacitor', q: 'capacitance', unit: 'µF', value: 10 }
      },
      note: 'ln 3 ≈ 1.1: the capacitor charges from 0 to ⅔ V_CC.',
      stories: { R: 'A 555 monostable uses a {C} capacitor. What resistor gives a pulse of {T}?' }
    }
  ],
  examples: [
    {
      title: 'A 1 Hz LED flasher',
      q: 'Choose $R_1$, $R_2$ and $C$ for a 555 flashing an LED about once a second.',
      steps: [
        'Take $C$ = 10 µF. Then $R_1 + 2R_2 = 1.44/(1\\ \\mathrm{Hz} \\times 10\\ \\mu\\mathrm{F}) = 144\\ \\mathrm{k\\Omega}$.',
        'Keep $R_1$ small so the duty cycle stays near 50 %: $R_1$ = 10 kΩ, $R_2$ = 68 kΩ gives $10 + 136 = 146$ kΩ.',
        '$f = 1/(0.693 \\times 146\\ \\mathrm{k} \\times 10\\ \\mu) = 0.99$ Hz; $D = 78/146 = 53$ %.',
        'The LED, with its series resistor, goes on pin 3. The electrolytic\'s ±20 % tolerance will matter more than the resistors.'
      ],
      a: 'R₁ = 10 kΩ, R₂ = 68 kΩ, C = 10 µF: 0.99 Hz at 53 % duty.'
    },
    {
      title: 'A 38 kHz infrared carrier',
      q: 'Infrared remote receivers expect a carrier near 38 kHz. Choose astable parts with C = 1 nF and a duty cycle near 50 %.',
      steps: [
        '$R_1 + 2R_2 = 1.44/(38\\ \\mathrm{kHz} \\times 1\\ \\mathrm{nF}) = 37.9\\ \\mathrm{k\\Omega}$.',
        'For near 50 %, make $R_1$ small: $R_1$ = 1 kΩ, $R_2$ = 18 kΩ, total 37 kΩ.',
        '$f = 1/(0.693 \\times 37\\ \\mathrm{k} \\times 1\\ \\mathrm{n}) = 39.0$ kHz; $D = 19/37 = 51$ %.',
        'Receivers accept a few per cent, but component tolerances add up: put a 2 kΩ trimmer in series with $R_2$ and set it with a frequency counter.'
      ],
      a: 'R₁ = 1 kΩ, R₂ = 18 kΩ (plus a trimmer), C = 1 nF: about 39 kHz, 51 % duty.'
    }
  ],
  quiz: [
    { q: 'In a 555 astable, the capacitor voltage swings between…', choices: ['0 and V_CC', '⅓ V_CC and ⅔ V_CC', '0.7 V and V_CC − 0.7 V', '0 and ⅔ V_CC'], a: 1,
      why: 'The trigger comparator catches it at ⅓ V_CC and the threshold comparator at ⅔ V_CC.' },
    { q: 'The supply of a 555 astable drops from 12 V to 9 V. The frequency…', choices: ['falls by 25 %', 'barely changes', 'rises by 33 %', 'stops'], a: 1,
      why: 'The thresholds are fixed fractions of the supply, and the charging voltage scales with it too, so the times do not change.' },
    { q: 'Why can a standard 555 astable not give a duty cycle below 50 %?', choices: ['The flip-flop forbids it', 'The capacitor charges through R₁ + R₂ but discharges through R₂ only, so the high time is always longer', 'The output stage is asymmetric', 'The trigger comparator is slower'], a: 1,
      why: 't_high ∝ R₁ + R₂ and t_low ∝ R₂, so t_high > t_low whatever the values; a diode across R₂ breaks the link.' },
    { q: 'A 555 monostable with R = 47 kΩ and C = 10 µF gives a pulse of about…', answer: 0.52, unit: 's',
      why: 'T = 1.1 RC = 1.0986 × 47 kΩ × 10 µF = 0.516 s.' },
    { q: 'Pin 5 (control voltage) can be left without its capacitor with no effect at all.', a: false,
      why: 'Pin 5 is the upper threshold itself. Unbypassed, it picks up supply noise and interference, which jitters the timing.' }
  ],
  applications: ['LED flashers, beepers and sirens.', 'Switch debouncing and one-shot pulse stretching.', 'PWM for motors and lamps (with pin 5 modulated).', 'Missing-pulse detectors, frequency dividers and simple infrared transmitters.'],
  history: 'Hans Camenzind designed the 555 as a contractor for Signetics in 1970–71, and it went on sale in 1972. Forrest Mims\'s hand-drawn notebooks of 555 circuits introduced it to generations of hobbyists.',
  sim: 'tr-555'
},

{
  id: 'pll', parent: 'oscillators', title: 'Phase-locked loops', level: 3,
  short: 'A feedback loop that steers a voltage-controlled oscillator until its phase tracks a reference: it multiplies clock frequencies, synthesises radio channels from one crystal, demodulates FM and recovers clocks from data.',
  keywords: ['phase-locked loop', 'PLL', 'VCO', 'phase detector', 'phase-frequency detector', 'charge pump', 'loop filter', 'frequency synthesiser', 'frequency divider', 'CD4046', '74HC4046', 'lock range', 'capture range', 'clock multiplier', 'fractional-N', 'jitter', 'clock recovery'],
  prereq: ['lc-oscillators', 'negative-feedback', 'counters'],
  related: ['crystal-oscillators', 'modulation', 'relaxation-oscillators', 'timing-clocks'],
  body: `
A phase-locked loop compares the phase of an oscillator it controls with the phase of a reference, and corrects the oscillator until the two march in step. Once **locked**, the oscillator's frequency is not merely close to the reference's: on average it is *exactly* equal, because any frequency difference would make the phase error grow without limit.

### The blocks
1. **Phase detector** — produces a signal proportional to the phase difference between the reference and the fed-back signal. An XOR gate is the simplest: its average output rises linearly with the phase difference from 0° to 180°. The **phase–frequency detector** (two flip-flops and a reset, driving a **charge pump**) also pulls in from large frequency errors, and is almost universal today.
2. **Loop filter** — a low-pass network, usually an RC after the charge pump, that turns the detector's pulses into a smooth control voltage and sets the loop's dynamics.
3. **VCO** — a [[lc-oscillators|varactor-tuned LC]] or ring oscillator whose frequency follows the control voltage: $f = f_0 + K_V V_c$, with $K_V$ in MHz per volt.
4. **Divider** by $N$ (a [[counters|counter]]) in the feedback path. The loop forces $f_\\text{out}/N = f_\\text{ref}$, so

$$f_\\text{out} = N f_\\text{ref}$$

A reference divider $R$ in front of the phase detector gives $f_\\text{out} = (N/R)\\,f_\\text{ref}$.

### What it is used for
- **Clock multiplication.** A microcontroller with an 8 MHz crystal runs its core at 72 or 168 MHz from a PLL; a PC processor derives gigahertz from a 100 MHz reference.
- **Frequency synthesis.** An FM receiver with a 100 kHz reference (a 10 MHz crystal divided by 100) tunes 88–108 MHz by setting $N$ from 880 to 1080 — every channel as accurate as the crystal. Fractional-N synthesisers switch $N$ between neighbouring values to get fine steps without a low reference frequency.
- **FM demodulation.** Lock to an FM signal and the VCO's control voltage *is* the audio, since it must follow the carrier's frequency.
- **Clock and data recovery** in serial links (USB, Ethernet, SATA): the receiver's PLL locks to the edges of the incoming data.

### Loop dynamics, briefly
The loop is a [[negative-feedback|feedback]] system, and like any other it can be sluggish, ring, or oscillate. The VCO turns frequency into phase — an integration — which gives the loop a built-in integrator; the loop filter adds a zero for stability. The **loop bandwidth**, typically a tenth of the reference frequency or less, is the key trade-off: inside it the output follows the clean reference; outside it, it has the VCO's own noise. A wide loop locks fast and cleans up a noisy VCO; a narrow one rejects a noisy reference and suppresses the reference **spurs** that leak through the phase detector.

The classic **CD4046** (a VCO, an XOR detector and a phase–frequency detector in one 16-pin CMOS chip, still made as the 74HC4046) gave the vocabulary: the **lock range** is how far the input can wander while lock is held; the **capture range**, usually narrower with the XOR detector, is how far away it can start and still be acquired.

> [!key] Locked means equal frequencies and a constant phase difference. The phase error that remains is exactly what the phase detector needs to hold the VCO's control voltage where it must be.
`,
  ideas: [
    'A PLL adjusts a VCO until its phase follows a reference.',
    'Locked, the output frequency is exactly N times the reference, on average.',
    'The blocks: phase detector, loop filter, VCO and a divider by N.',
    'Changing N changes the synthesised frequency in steps of the reference frequency.',
    'The loop bandwidth trades lock speed and VCO cleaning against reference noise and spurs.'
  ],
  pitfalls: [
    'A locked PLL\'s frequency is close to N·f_ref — It is exactly N·f_ref on average; only the phase wanders, by the jitter.',
    'The phase error is zero when locked — The detector needs a small steady phase error (or a charge pump with an integrator) to hold the control voltage.',
    'A wider loop bandwidth is always better — It passes more of the reference\'s noise and spurs; the best bandwidth depends on which source is noisier.'
  ],
  formulas: [
    {
      name: 'Output of a PLL synthesiser',
      expr: 'fout = N*fref/R', tex: 'f_{\\text{out}} = \\frac{N}{R}\\,f_{\\text{ref}}',
      vars: {
        fout: { name: 'output frequency', q: 'frequency', unit: 'MHz', tex: 'f_{\\text{out}}' },
        N: { name: 'feedback divider', int: true, value: 985 },
        fref: { name: 'crystal reference frequency', q: 'frequency', unit: 'MHz', value: 10, tex: 'f_{\\text{ref}}' },
        R: { name: 'reference divider', int: true, value: 100 }
      },
      note: 'The channel spacing is f_ref/R.',
      stories: { N: 'An FM synthesiser divides a {fref} crystal by {R}. What feedback divider tunes it to {fout}?' }
    },
    {
      name: 'Average output of an XOR phase detector',
      expr: 'Vd = Vdd*phi/pi', tex: 'V_d = V_{DD}\\,\\frac{\\varphi}{\\pi}',
      vars: {
        Vd: { name: 'average detector output', q: 'voltage', unit: 'V', tex: 'V_d' },
        Vdd: { name: 'logic supply', q: 'voltage', unit: 'V', value: 5, tex: 'V_{DD}' },
        phi: { name: 'phase difference', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\varphi' }
      },
      note: 'For square waves of equal duty, between 0° and 180°. A locked loop sits at the phase that gives the VCO the control voltage it needs.'
    }
  ],
  examples: [
    {
      title: 'An FM-band synthesiser',
      q: 'A 10 MHz crystal and a PLL must tune the FM band, 88–108 MHz, in 100 kHz steps. Choose the reference divider and the range of N.',
      steps: [
        'The step equals the comparison frequency: $R = 10\\ \\mathrm{MHz}/100\\ \\mathrm{kHz} = 100$.',
        'For 88 MHz: $N = 88/0.1 = 880$; for 108 MHz: $N = 1080$. 98.5 MHz needs $N = 985$.',
        'Every channel inherits the crystal\'s accuracy: ±20 ppm is ±2 kHz at 98.5 MHz, far inside the 200 kHz channel.'
      ],
      a: 'R = 100; N from 880 to 1080 (985 for 98.5 MHz).'
    },
    {
      title: 'A microcontroller clock',
      q: 'An STM32F103 runs from an 8 MHz crystal. What multiplication gives its maximum 72 MHz core clock?',
      steps: [
        '$N = 72/8 = 9$: the PLL multiplies the crystal by 9.',
        'The core clock is then as accurate as the crystal — which matters for USB, whose 48 MHz clock is derived from the same PLL output (72 MHz ÷ 1.5).'
      ],
      a: 'A multiplier of 9.'
    }
  ],
  quiz: [
    { q: 'A PLL has $f_\\text{ref}$ = 1 MHz and a feedback divider N = 50. When locked, $f_\\text{out}$ is…', choices: ['1 MHz', '20 kHz', '50 MHz', '51 MHz'], a: 2,
      why: 'The loop forces f_out/N = f_ref, so f_out = 50 × 1 MHz.' },
    { q: 'When locked, the VCO frequency equals N·f_ref…', choices: ['approximately, within 1 %', 'exactly on average, because any frequency error would make the phase error grow without limit', 'only if the VCO is a crystal', 'never'], a: 1,
      why: 'Phase is the integral of frequency. A constant phase error means zero frequency error.' },
    { q: 'In an FM demodulator built from a PLL, the recovered audio is the VCO\'s control voltage.', a: true,
      why: 'To follow the carrier\'s frequency swings, the control voltage must swing with the modulation.' },
    { q: 'To change channel in a PLL synthesiser, you change…', choices: ['the crystal', 'the divider N', 'the loop filter', 'the phase detector'], a: 1,
      why: 'f_out = N f_ref/R: a new N gives a new frequency, locked to the same crystal.' }
  ],
  applications: ['Clock multiplication in microcontrollers, processors and FPGAs.', 'Frequency synthesisers in radios, phones and signal generators.', 'FM and FSK demodulation.', 'Clock and data recovery in serial links.']
}

);
