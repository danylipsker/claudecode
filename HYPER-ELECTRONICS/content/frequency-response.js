/* HYPER-ELECTRONICS · content/frequency-response.js — frequency response and filters:
 * transfer functions, Bode plots, RC low- and high-pass, band-pass and band-stop,
 * filter order and the Butterworth response, active filters, decoupling. */
Hyper.add(

{
  id: 'transfer-function', parent: 'frequency-response', title: 'Transfer functions', level: 2,
  short: 'A circuit\'s transfer function H = V_out/V_in, a complex function of frequency, says how much each sine is scaled and shifted on its way through — the whole frequency response in one formula.',
  keywords: ['transfer function', 'frequency response', 'H(jω)', 'H(s)', 'gain', 'phase', 'poles', 'zeros', 's-domain', 'Laplace', 'complex gain', 'linear time-invariant', 'second-order', 'order'],
  prereq: ['impedance', 'decibels', 'math:complex-numbers', 'math:rational-functions'],
  related: ['bode-plots', 'rc-low-pass', 'filter-order', 'math:laplace-transform', 'negative-feedback', 'spectrum-harmonics', 'rlc-transient'],
  body: `
Feed a linear circuit a sine wave and, once the switch-on transient has died away, a sine of the **same frequency** comes out — only bigger or smaller, and shifted. The ratio of the output phasor to the input phasor captures both changes in one complex number, and as a function of frequency it is the **transfer function**:
$$H(j\\omega) = \\frac{\\mathbf{V}_\\text{out}}{\\mathbf{V}_\\text{in}}, \\qquad |H| = \\text{gain}, \\qquad \\arg H = \\text{phase shift}$$

### Finding it
Treat the circuit as a divider of [[impedance|impedances]]. For a resistor followed by a capacitor to ground:
$$H = \\frac{1/j\\omega C}{R + 1/j\\omega C} = \\frac{1}{1 + j\\omega RC}$$
Below $\\omega = 1/RC$ it is nearly 1; above, it falls in proportion to frequency — the [[rc-low-pass]]. Any network can be treated this way, with nodal analysis if it is not a simple divider.

### Why one function says everything
By [[superposition]], a linear circuit treats every frequency separately. Split any input into its spectrum ([[spectrum-harmonics]]), multiply each component by $H$ at its frequency, add the results — and you have the output. So $H$ predicts what the circuit does to a square wave, to music, to noise. It is what a network analyser measures, and what you measure by hand by sweeping a generator and reading two traces on a scope.

### Poles, zeros and order
Write $s$ in place of $j\\omega$. For circuits of R, L, C (and op-amps) $H(s)$ is a ratio of polynomials:
$$H(s) = K\\,\\frac{(s - z_1)(s - z_2)\\cdots}{(s - p_1)(s - p_2)\\cdots}$$
The roots of the top are **zeros**, those of the bottom **poles**, and the number of poles is the **order**. Each pole bends the gain down by 20 dB per decade beyond its frequency and adds up to −90° of phase; each zero does the opposite — the basis of sketching [[bode-plots]]. Real poles give gentle corners; a **complex pair** of poles gives a second-order section with a resonant frequency $\\omega_0$ and a quality factor $Q$:
$$H(s) = \\frac{\\omega_0^2}{s^2 + \\dfrac{\\omega_0}{Q}s + \\omega_0^2}\\quad\\text{(second-order low-pass)}$$
At $\\omega_0$ its gain is exactly $Q$: above 0.707 it peaks. Poles must lie in the left half of the $s$-plane for the circuit to be stable.

### Frequency and time: one description
The same $H(s)$, through the [[math:laplace-transform|Laplace transform]], gives the step response. A first-order low-pass with corner $f_c$ has time constant $\\tau = 1/(2\\pi f_c)$; a second-order section with $\\omega_0$ and $Q$ rings like the [[rlc-transient|RLC circuit]] with $\\zeta = 1/(2Q)$. A narrow frequency response means a slow time response, and a peak in frequency means overshoot in time.

### Cascading
If stage 1 drives stage 2 without being loaded by it (an op-amp buffer between them, or a much higher impedance), the transfer functions multiply and their gains in dB add. Passive stages usually do load each other, and then the product is wrong — two identical RC sections give not $1/(1 + j\\omega RC)^2$ but $1/(1 + 3j\\omega RC - \\omega^2R^2C^2)$ ([[filter-order]]).
`,
  ideas: [
    'H(jω) = V_out/V_in as phasors: its size is the gain and its angle the phase shift at each frequency.',
    'Find it by treating the circuit as a divider of impedances.',
    'By superposition, H at every frequency predicts the response to any input.',
    'Poles bend the gain down by 20 dB/decade each; zeros bend it up; complex pole pairs can peak.',
    'Transfer functions of stages multiply only if the stages do not load each other.'
  ],
  pitfalls: [
    'The transfer function describes what a circuit does to any signal directly — It describes what it does to each sine; other signals are handled by splitting them into sines and adding the results, which works only for linear circuits.',
    'Transfer functions of stages always multiply — Only when each stage does not load the one before it; passive stages interact.',
    'A passive circuit can never have a gain above 1 — A resonant passive circuit can: a second-order low-pass with Q above 0.707 has voltage gain above 1 near f₀, though it cannot add power.'
  ],
  formulas: [
    {
      name: 'Gain of a second-order low-pass',
      expr: 'H = 1/sqrt((1 - (f/f0)^2)^2 + (f/(Q*f0))^2)', tex: 'A_v = \\frac{1}{\\sqrt{\\left(1 - (f/f_0)^2\\right)^2 + \\left(\\dfrac{f}{Q f_0}\\right)^2}}',
      vars: {
        H: { name: 'voltage gain |H| (output/input)', tex: 'A_v' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 2 },
        f0: { name: 'natural frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_0' },
        Q: { name: 'quality factor', value: 0.707 }
      },
      note: 'At $f = f_0$ the gain is exactly $Q$. $Q = 0.707$ is the Butterworth (maximally flat) choice.',
      stories: { H: 'A second-order low-pass has f₀ = {f0} and Q = {Q}. What fraction of a {f} signal gets through?' }
    },
    {
      name: 'Time constant of a first-order filter',
      expr: 'tau = 1/(2*pi*fc)', tex: '\\tau = \\frac{1}{2\\pi f_c}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'µs', tex: '\\tau' },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' }
      },
      stories: { tau: 'A first-order filter has its corner at {fc}. What time constant does its step response have?', fc: 'A first-order sensor responds with a time constant of {tau}. What is its bandwidth?' }
    },
    {
      name: 'Gain of a divider at one frequency (RC low-pass)',
      expr: 'H = 1/sqrt(1 + (2*pi*f*R*C)^2)', tex: 'A_v = \\frac{1}{\\sqrt{1 + (\\omega RC)^2}}, \\quad \\omega = 2\\pi f',
      vars: {
        H: { name: 'voltage gain |H| (output/input)', tex: 'A_v' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 3 },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 15.9 }
      },
      stories: { H: 'An RC divider of {R} and {C} is driven at {f}. What fraction of the input reaches the capacitor?' }
    }
  ],
  examples: [
    {
      title: 'Evaluating H at one frequency',
      q: 'An RC low-pass with R = 10 kΩ and C = 15.9 nF (corner 1 kHz) is fed 3 kHz. Find the gain and the phase.',
      steps: [
        '$\\omega RC = 2\\pi \\times 3000 \\times 10^4 \\times 15.9 \\times 10^{-9} = 3.0$.',
        '$H = 1/(1 + j3)$, so $|H| = 1/\\sqrt{10} = 0.316$ — that is $-10\\ \\mathrm{dB}$.',
        '$\\arg H = -\\arctan 3 = -71.6^\\circ$: the output lags by 71.6°, which at 3 kHz is a delay of $71.6/360 \\times 333\\ \\mu\\mathrm{s} = 66\\ \\mu\\mathrm{s}$.'
      ],
      a: 'Gain 0.316 (−10 dB), phase −71.6°.'
    },
    {
      title: 'From the frequency response to the step response',
      q: 'A sensor amplifier behaves as a first-order low-pass with a 1 kHz bandwidth. How long does its output take to settle after a step, and what is its rise time?',
      steps: [
        '$\\tau = 1/(2\\pi \\times 1000) = 159\\ \\mu\\mathrm{s}$.',
        'The 10–90 % rise time is $2.2\\tau = 350\\ \\mu\\mathrm{s}$ — the same as $0.35/f_c$.',
        'To within 1 %: about $5\\tau = 0.8\\ \\mathrm{ms}$.'
      ],
      a: 'τ = 159 µs; rise time 350 µs; settled to 1 % in about 0.8 ms.'
    }
  ],
  quiz: [
    { q: 'A linear circuit is driven by a pure 1 kHz sine. In the steady state its output contains…', choices: ['1 kHz and its harmonics', 'only 1 kHz, scaled and shifted', 'all frequencies below 1 kHz', 'only DC'], a: 1,
      why: 'Linear circuits cannot create new frequencies; they only change amplitude and phase. New frequencies are the sign of a non-linearity (distortion).' },
    { q: 'A gain of |H| = 0.5 is…', choices: ['−3 dB', '−6 dB', '−10 dB', '−20 dB'], a: 1,
      why: 'For a voltage ratio, 20 log₁₀ 0.5 = −6.02 dB.' },
    { q: 'A transfer function with three poles and no zeros falls at 60 dB per decade at high frequency.', a: true,
      why: 'Each pole contributes −20 dB/decade beyond its frequency: three poles give −60 dB/decade.' },
    { q: 'Two identical, unbuffered RC low-pass sections in cascade have a transfer function equal to the square of one section\'s.', a: false,
      why: 'The second section loads the first. The result is 1/(1 + 3jωRC − ω²R²C²), not 1/(1 + jωRC)².' },
    { q: 'What is the gain of a first-order low-pass at its corner frequency?', answer: 0.707,
      why: '|H| = 1/√(1 + 1) = 0.707, i.e. −3 dB.' }
  ],
  applications: ['Specifying and measuring amplifiers, filters and sensors.', 'Network analysers and frequency-response analysers.', 'Control-loop design (the same mathematics describes servos and power supplies).', 'Audio equalisers and loudspeaker crossovers.'],
  sim: { id: 'acf-bode', params: { type: 'bs', f: 700 } }
},

{
  id: 'bode-plots', parent: 'frequency-response', title: 'Bode plots', level: 2,
  short: 'Gain in decibels and phase in degrees against log frequency: on these scales every pole and zero draws a straight line, so a frequency response can be sketched by hand and read at a glance.',
  keywords: ['Bode plot', 'magnitude plot', 'phase plot', 'logarithmic axis', 'decade', 'octave', 'asymptote', '−20 dB/decade', '−6 dB/octave', 'corner frequency', 'break frequency', '−3 dB', 'pole', 'zero', 'phase margin'],
  prereq: ['transfer-function', 'decibels', 'math:logarithmic-scales'],
  related: ['rc-low-pass', 'filter-order', 'gain-bandwidth', 'negative-feedback', 'oscilloscope'],
  body: `
A **Bode plot** is two graphs sharing a logarithmic frequency axis: the gain $20\\log_{10}|H|$ in decibels, and the phase $\\arg H$ in degrees. Hendrik Bode, at Bell Labs in the 1930s, noticed that on these scales frequency responses become almost entirely **straight lines**.

### Why log–log makes straight lines
Two reasons. A power law $|H| \\propto f^n$ is a straight line of slope $20n$ dB per decade on log axes. And a transfer function is a product of simple factors — multiplying gains is **adding** decibels, and phases of factors add too. So the plot of a complicated circuit is the sum of the plots of its pieces.

### The single pole
$H = 1/(1 + jf/f_c)$ gives:
- **Gain**: flat at 0 dB well below $f_c$; a straight fall of **−20 dB per decade** (−6 dB per octave) well above. The two asymptotes meet at the **corner** $f_c$, where the true curve is 3 dB below them — the largest error anywhere.
- **Phase**: 0° well below, −90° well above, −45° exactly at $f_c$. A good straight-line approximation runs from 0° at $f_c/10$ to −90° at $10f_c$, never more than about 6° out.

| $f/f_c$ | 0.1 | 0.5 | 1 | 2 | 10 | 100 |
|---|---|---|---|---|---|---|
| Gain (dB) | −0.04 | −0.97 | −3.0 | −7.0 | −20.0 | −40.0 |
| Phase | −5.7° | −26.6° | −45° | −63.4° | −84.3° | −89.4° |

A **zero** is the mirror image: +20 dB/decade and +90°. A constant gain $K$ shifts the whole magnitude plot by $20\\log K$.

### Sketching by hand
1. Write $H$ as a product of standard factors and list their corner frequencies.
2. Start at low frequency with the right level and slope.
3. At each corner, bend the slope by −20 dB/decade for a pole, +20 for a zero.
4. Add the phase contributions, each sweeping over two decades around its corner.

Two real poles at $f_1 < f_2$: flat, then −20 dB/decade from $f_1$, then −40 from $f_2$. A **complex pair** also gives −40 dB/decade beyond $f_0$, but near $f_0$ the true curve rises above the asymptotes by $20\\log_{10}Q$ dB when $Q > 0.707$, and its phase swings from 0° to −180° more abruptly the higher the $Q$.

### Reading one
- **Bandwidth**: where the gain has fallen 3 dB.
- **Order**: the final slope divided by 20 dB/decade.
- **Stop-band attenuation**: how far down the plot is at an unwanted frequency.
- **Delay**: a phase lag $\\varphi$ at frequency $f$ is a time delay $\\varphi/(360^\\circ f)$.
- **Stability of feedback loops**: for an amplifier with feedback, the phase at the frequency where the loop gain crosses 0 dB must stay well short of −180°. The remaining **phase margin** (45–60° is a common target) decides whether it rings or oscillates ([[negative-feedback]], [[gain-bandwidth]]).
`,
  ideas: [
    'A Bode plot shows gain in dB and phase against log frequency.',
    'A pole gives a corner and then −20 dB/decade; the real curve is 3 dB down at the corner.',
    'A single pole\'s phase moves from 0° to −90° over about two decades, −45° at the corner.',
    'Factors multiply, so their dB curves and phases add — complex plots are sums of simple ones.',
    'A resonant pair peaks by 20 log Q above the asymptotes and falls at −40 dB/decade.'
  ],
  pitfalls: [
    'The asymptotes are the response — They are approximations: the real curve of a single pole is 3 dB below them at the corner, and a resonant pair can peak far above them.',
    'At the −3 dB point the signal has gone — 71 % of the voltage still gets through; the corner is where attenuation begins, not where it is complete.',
    'Phase only changes near the corner — A single pole shifts the phase over two decades, from about a tenth of the corner frequency to ten times it.'
  ],
  formulas: [
    {
      name: 'Attenuation well above the corner (asymptote)',
      expr: 'A = 20*n*log(f/fc)', tex: 'A = 20\\,n\\,\\log_{10}\\frac{f}{f_c}',
      vars: {
        A: { name: 'attenuation', q: 'gain', unit: 'dB' },
        n: { name: 'number of poles (order)', int: true, value: 2 },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 10 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' }
      },
      note: 'The straight-line estimate; accurate once $f$ is a few times $f_c$ (for a Butterworth or a single pole).',
      stories: { A: 'A low-pass of order {n} has its corner at {fc}. Roughly how much does it attenuate {f}?', n: 'A filter with its corner at {fc} must attenuate {f} by {A}. How many poles does it need?' }
    },
    {
      name: 'Gain of a single pole, in dB',
      expr: 'G = -10*log(1 + (f/fc)^2)', tex: 'G = -10\\log_{10}\\left(1 + (f/f_c)^2\\right)',
      vars: {
        G: { name: 'gain', q: 'gain', unit: 'dB', signed: true },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 2 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' }
      },
      stories: { G: 'A first-order low-pass has its corner at {fc}. What is its gain in dB at {f}?' }
    },
    {
      name: 'Phase of a single pole',
      expr: 'phi = -atan(f/fc)', tex: '\\varphi = -\\arctan\\frac{f}{f_c}',
      vars: {
        phi: { name: 'phase shift', q: 'angle', unit: '°', signed: true, tex: '\\varphi' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 2 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' }
      },
      stories: { phi: 'By how many degrees does a first-order low-pass with its corner at {fc} delay a {f} sine?', f: 'At what frequency does a first-order low-pass with corner {fc} shift the phase by {phi}?' }
    }
  ],
  examples: [
    {
      title: 'Sketching an amplifier',
      q: 'An amplifier has a mid-band gain of 100 (40 dB) and poles at 10 kHz and 1 MHz. Sketch its Bode plot and estimate the gain at 100 kHz and the phase at 1 MHz.',
      steps: [
        'Flat at 40 dB up to 10 kHz.',
        'From 10 kHz, −20 dB/decade: 20 dB at 100 kHz, 0 dB at 1 MHz (asymptotically).',
        'Beyond 1 MHz, −40 dB/decade.',
        'Phase at 1 MHz: the first pole is two decades past its corner (≈ −90°, exactly −89.4°), the second is at its corner (−45°): about −135°.'
      ],
      a: 'About 20 dB at 100 kHz; about −135° at 1 MHz.'
    },
    {
      title: 'How much does a filter remove?',
      q: 'A first-order low-pass with its corner at 1 kHz filters a sensor signal. How much does it attenuate 50 kHz switching noise? What would a second-order Butterworth at the same corner do?',
      steps: [
        'First order: $20\\log_{10}50 = 34\\ \\mathrm{dB}$ (exact: $10\\log_{10}(1 + 2500) = 34.0\\ \\mathrm{dB}$), a factor of 50.',
        'Second order: twice the slope, $40\\log_{10}50 = 68\\ \\mathrm{dB}$, a factor of 2500.'
      ],
      a: '34 dB with one pole; 68 dB with two.'
    }
  ],
  quiz: [
    { q: 'A slope of −20 dB per decade is the same as −6 dB per octave.', a: true,
      why: 'An octave is a factor of 2 in frequency: 20 log₁₀ 2 = 6.02 dB.' },
    { q: 'At the corner frequency of a single-pole low-pass, the gain and phase are…', choices: ['0 dB and 0°', '−3 dB and −45°', '−6 dB and −90°', '−20 dB and −90°'], a: 1,
      why: '|H| = 1/√2 (−3 dB) and arg H = −arctan 1 = −45°.' },
    { q: 'A third-order low-pass falls, well above its corner, at…', choices: ['−20 dB/decade', '−40 dB/decade', '−60 dB/decade', '−3 dB/decade'], a: 2,
      why: 'Three poles, each −20 dB/decade.' },
    { q: 'How much does a first-order low-pass with its corner at 1 kHz attenuate 100 kHz (in dB)?', answer: 40, unit: 'dB',
      why: 'Two decades above the corner at −20 dB/decade: 40 dB (exactly 40.0).' },
    { q: 'The phase of a single pole changes noticeably over roughly…', choices: ['a few per cent around the corner', 'one octave', 'from a tenth of the corner frequency to ten times it', 'only above the corner'], a: 2,
      why: 'The phase is −5.7° at f_c/10 and −84.3° at 10 f_c: it spreads over two decades.' }
  ],
  applications: ['Specifying filters and amplifiers from their data sheets.', 'Checking the stability of op-amp circuits, regulators and switching converters (phase margin).', 'Measuring loudspeakers, microphones and audio chains.', 'Control engineering: the same plots for motors and servos.'],
  sim: { id: 'acf-bode', params: { type: 'lp2' } }
},

{
  id: 'rc-low-pass', parent: 'frequency-response', title: 'The RC low-pass filter', level: 1,
  short: 'A resistor followed by a capacitor to ground passes slow signals and attenuates fast ones: flat below f_c = 1/(2πRC), falling 20 dB per decade above it — the simplest and most used filter in electronics.',
  keywords: ['RC filter', 'low-pass', 'cutoff frequency', 'corner frequency', '−3 dB', '1/(2πRC)', 'first-order', 'roll-off', 'phase lag', 'PWM filter', 'anti-aliasing', 'smoothing', 'loading'],
  prereq: ['transfer-function', 'rc-transient', 'impedance'],
  related: ['rc-high-pass', 'bode-plots', 'filter-order', 'decoupling', 'pwm', 'adc', 'sampling-nyquist', 'noise-snr'],
  body: `
Put a resistor in series with the signal and a capacitor from the output to ground. At low frequencies the capacitor's reactance is huge and it hardly loads the output: the signal passes. At high frequencies its reactance becomes small and it shorts the signal to ground: the output shrinks. It is a [[voltage-divider]] whose lower "resistor" gets smaller as the frequency rises:
$$H = \\frac{1}{1 + jf/f_c}, \\qquad |H| = \\frac{1}{\\sqrt{1 + (f/f_c)^2}}, \\qquad \\varphi = -\\arctan\\frac{f}{f_c}, \\qquad f_c = \\frac{1}{2\\pi RC}$$

At the **corner** $f_c$ the reactance equals $R$, the gain is −3 dB (70.7 %) and the output lags by 45°. Above it the gain falls in proportion to frequency: a tenth at $10f_c$, a hundredth at $100f_c$ — −20 dB per decade. 10 kΩ with 100 nF gives $f_c = 159\\ \\mathrm{Hz}$; 1 kΩ with 1 nF, 159 kHz.

### The same circuit in time
It is the circuit of [[rc-transient]]: a step comes out as the exponential charging curve with $\\tau = RC = 1/(2\\pi f_c)$, a rise time of $2.2RC$. For signals far above the corner it behaves as an **integrator** — a square wave comes out as a small triangle — and for signals far below it passes them almost untouched.

### What it is used for
- **PWM to analogue.** Filtering a PWM output gives a DC level equal to the average ([[pwm]]); the corner must sit far below the PWM frequency to reduce the ripple, and the lower it is, the slower the output responds. That trade-off is the central design decision.
- **Anti-aliasing** in front of an [[adc|ADC]]: remove what lies above half the sampling rate ([[sampling-nyquist]]). One pole gives only 20 dB per decade, so sharp cases need a higher [[filter-order|order]].
- **Noise reduction**: limiting the bandwidth to what the signal needs reduces random noise ([[noise-snr]]).
- **Supply filtering** for small, sensitive loads (an RC from a digital rail to a reference or a sensor), and RF-suppression capacitors at op-amp inputs.

### Design details that bite
- **Source and load.** The source's resistance adds to $R$. A load $R_L$ across $C$ forms a divider with $R$, reducing the gain to $R_L/(R + R_L)$ and moving the corner up, to $1/(2\\pi (R\\parallel R_L)C)$. Keep the load at least ten times $R$, or buffer the output.
- **Output impedance.** The output looks like $R$ in series at low frequencies. A 100 kΩ filter feeding an ADC that samples with a small capacitor will be disturbed by each sample — add a capacitor that is large compared with the ADC's, or buffer it.
- **Capacitor type.** High-k ceramics (X7R, X5R, Y5V) lose capacitance with DC bias, temperature and age, moving the corner. For an accurate corner use C0G (NP0) ceramics or film capacitors.
`,
  ideas: [
    'f_c = 1/(2πRC): below it the signal passes, above it the gain falls as 1/f (−20 dB/decade).',
    'At f_c the gain is 70.7 % (−3 dB) and the phase −45°.',
    'In time it is the RC charging curve: τ = RC = 1/(2πf_c), rise time 2.2RC.',
    'Every low-pass trades ripple or noise rejection against response speed.',
    'Source resistance adds to R; a load across C lowers the gain and raises the corner.'
  ],
  pitfalls: [
    'Above f_c the signal is blocked — A first-order filter attenuates gradually: a decade above the corner 10 % of the voltage still gets through.',
    'The corner depends only on the R and C drawn — The source resistance adds to R and a load across C forms a divider; both move the corner and the gain.',
    'Any capacitor will do — High-k ceramic capacitors lose much of their value with DC bias and temperature; use C0G or film where the corner matters.'
  ],
  derivation: {
    title: 'From the divider to the −3 dB corner',
    steps: [
      { text: 'The capacitor is the lower arm of a divider:', tex: 'H = \\frac{Z_C}{R + Z_C} = \\frac{1/j\\omega C}{R + 1/j\\omega C} = \\frac{1}{1 + j\\omega RC}' },
      { text: 'Its size and angle:', tex: '|H| = \\frac{1}{\\sqrt{1 + (\\omega RC)^2}}, \\qquad \\varphi = -\\arctan(\\omega RC)' },
      { text: 'At $\\omega RC = 1$ the real and imaginary parts of the denominator are equal:', tex: '|H| = \\frac{1}{\\sqrt 2} = 0.707 \\;(-3\\ \\mathrm{dB}), \\qquad \\varphi = -45^{\\circ}, \\qquad f_c = \\frac{1}{2\\pi RC}' },
      { text: 'Far above the corner the 1 is negligible, so the gain falls as $1/f$:', tex: '|H| \\approx \\frac{1}{\\omega RC} = \\frac{f_c}{f}' }
    ]
  },
  formulas: [
    {
      name: 'Corner (cut-off) frequency',
      expr: 'fc = 1/(2*pi*R*C)', tex: 'f_c = \\frac{1}{2\\pi RC}',
      vars: {
        fc: { name: 'corner frequency (−3 dB)', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { fc: 'What is the corner frequency of an RC low-pass with {R} and {C}?', C: 'You want a corner at {fc} with a {R} resistor. What capacitor do you need?' }
    },
    {
      name: 'Output amplitude of a sine',
      expr: 'Vout = Vin/sqrt(1 + (f/fc)^2)', tex: 'V_{\\text{out}} = \\frac{V_{\\text{in}}}{\\sqrt{1 + (f/f_c)^2}}',
      vars: {
        Vout: { name: 'output amplitude', q: 'voltage', unit: 'mV', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input amplitude', q: 'voltage', unit: 'V', value: 3.18, tex: 'V_{\\text{in}}' },
        f: { name: 'signal frequency', q: 'frequency', unit: 'Hz', value: 490 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'Hz', value: 7.2, tex: 'f_c' }
      },
      stories: { Vout: 'A {Vin} ripple component at {f} passes a low-pass with its corner at {fc}. How much is left?', fc: 'A {Vin} component at {f} must be reduced to {Vout}. Where must the corner of a first-order low-pass be?' }
    },
    {
      name: 'Rise time of an RC low-pass',
      expr: 'tr = 2.2*R*C', tex: 't_r = 2.2\\,RC',
      vars: {
        tr: { name: '10–90 % rise time', q: 'time', unit: 'µs', tex: 't_r' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 1 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 1 }
      },
      note: 'From $e^{-t_1/\\tau} = 0.9$ and $e^{-t_2/\\tau} = 0.1$: $t_2 - t_1 = \\tau\\ln 9 = 2.2\\tau$.',
      stories: { tr: 'A logic line has {R} of source resistance and {C} of load capacitance. What is its rise time?' }
    }
  ],
  examples: [
    {
      title: 'PWM to DC',
      q: 'A microcontroller makes a 490 Hz, 0–5 V PWM signal at 50 % duty. Design an RC filter that leaves less than 50 mV (peak) of ripple at the fundamental, and find its response time.',
      steps: [
        'The fundamental of a 0–5 V square wave is $2 \\times 5/\\pi = 3.18\\ \\mathrm{V}$ peak at 490 Hz.',
        'Needed gain at 490 Hz: $0.05/3.18 = 0.0157$. Far above the corner $|H| \\approx f_c/f$, so $f_c \\le 490 \\times 0.0157 = 7.7\\ \\mathrm{Hz}$.',
        'Take 10 kΩ and 2.2 µF: $f_c = 7.2\\ \\mathrm{Hz}$, ripple $3.18 \\times 7.2/490 = 47\\ \\mathrm{mV}$.',
        'But $\\tau = RC = 22\\ \\mathrm{ms}$: the output needs about 0.1 s to follow a new duty cycle. A higher PWM frequency (say 31 kHz) or a second-order filter relaxes the trade-off.'
      ],
      a: '10 kΩ and 2.2 µF (f_c ≈ 7 Hz): 47 mV of ripple, but a 22 ms time constant.'
    },
    {
      title: 'A load on the filter',
      q: 'An RC low-pass of 10 kΩ and 100 nF (f_c = 159 Hz) drives a 10 kΩ load. What are the low-frequency gain and the new corner?',
      steps: [
        'At DC the capacitor is open and the load forms a divider with R: gain $10/(10 + 10) = 0.5$ (−6 dB).',
        'By Thévenin, the capacitor sees $R \\parallel R_L = 5\\ \\mathrm{k\\Omega}$: $f_c = 1/(2\\pi \\times 5000 \\times 10^{-7}) = 318\\ \\mathrm{Hz}$.',
        'The load halved the gain and doubled the corner. Buffer the output, or make the load at least ten times R.'
      ],
      a: 'Gain 0.5 and a corner of 318 Hz.'
    }
  ],
  quiz: [
    { q: 'What is the corner frequency of 1 kΩ and 1 µF?', choices: ['1 kHz', '159 Hz', '6.28 kHz', '1 MHz'], a: 1,
      why: 'f_c = 1/(2π × 1000 × 10⁻⁶) = 159 Hz. 1 kHz would forget the 2π.' },
    { q: 'At ten times its corner frequency, an RC low-pass passes…', choices: ['nothing', 'about 10 % of the voltage, lagging about 84°', '50 % of the voltage', '70.7 %, lagging 45°'], a: 1,
      why: '|H| = 1/√(1 + 100) ≈ 0.1 and φ = −arctan 10 = −84.3°.' },
    { q: 'Doubling the capacitor of an RC low-pass halves its corner frequency.', a: true,
      why: 'f_c = 1/(2πRC) is inversely proportional to C.' },
    { q: 'A load equal to R is connected across the capacitor. The filter\'s DC gain and corner become…', choices: ['unchanged', '0.5 and twice as high', '0.5 and half as high', '1 and twice as high'], a: 1,
      why: 'The load and R make a 1:2 divider, and the capacitor sees R ∥ R_L = R/2, doubling the corner.' },
    { q: 'What is the 10–90 % rise time of an RC low-pass with R = 1 kΩ and C = 1 nF?', answer: 2.2, unit: 'µs',
      why: 't_r = 2.2RC = 2.2 × 1000 × 10⁻⁹ s = 2.2 µs.' }
  ],
  applications: ['Turning PWM into an analogue voltage.', 'Anti-aliasing and noise filters in front of ADCs.', 'Smoothing sensor readings.', 'RF suppression at amplifier inputs and on long cables.'],
  sim: [{ id: 'acf-bode', params: { type: 'lp', f: 3000 } }, { id: 'acf-spectrum', params: { filter: 'lp', n: 49 } }]
},

{
  id: 'rc-high-pass', parent: 'frequency-response', title: 'The RC high-pass filter', level: 1,
  short: 'A series capacitor followed by a resistor to ground blocks DC and slow changes and passes fast ones: the coupling capacitor, the AC-coupled scope input and the edge detector.',
  keywords: ['high-pass', 'RC filter', 'coupling capacitor', 'DC blocking', 'AC coupling', 'cutoff frequency', 'differentiator', 'tilt', 'droop', 'phase lead', 'bass cut', 'edge detector'],
  prereq: ['rc-low-pass', 'impedance', 'rc-transient'],
  related: ['bode-plots', 'band-pass-stop', 'oscilloscope', 'common-emitter', 'integrator-differentiator'],
  body: `
Swap the resistor and capacitor of the [[rc-low-pass]] and the behaviour turns over. The capacitor in series blocks DC completely and slow signals partly; fast signals pass through it as if it were a wire:
$$H = \\frac{jf/f_c}{1 + jf/f_c}, \\qquad |H| = \\frac{f/f_c}{\\sqrt{1 + (f/f_c)^2}}, \\qquad \\varphi = 90^\\circ - \\arctan\\frac{f}{f_c}, \\qquad f_c = \\frac{1}{2\\pi RC}$$
The corner is the same $1/(2\\pi RC)$. Below it the gain rises at +20 dB per decade; above it the response is flat. The output **leads** the input — by 45° at the corner, approaching 90° far below it.

### The coupling capacitor
Its main job in circuits is **coupling**: passing a signal from one stage to the next while blocking the DC bias of the first from upsetting the second. The capacitor and the next stage's input resistance form the high-pass, so choose the corner well below the lowest frequency you care about. For audio (from 20 Hz) into a 10 kΩ input, 10 µF gives $f_c = 1.6\\ \\mathrm{Hz}$: at 20 Hz the loss is 0.03 dB and the phase lead 4.5°. A value ten times too small would audibly thin the bass.

### In time: droop and spikes
A step through a high-pass jumps straight through and then decays with $\\tau = RC$ — the output shows the **changes** of the input. Two consequences:
- **Tilt on square waves.** If the period is not much shorter than $\\tau$, the flat tops sag: over a half-period $T/2$ the top droops by $1 - e^{-T/2\\tau}$ of its value. A scope's **AC coupling** is exactly this filter (corner around 5–10 Hz), which is why slow square waves look slanted with it switched on.
- **Differentiator.** Far below the corner, $v_\\text{out} \\approx RC\\,dv_\\text{in}/dt$: fast edges become short spikes, which is how an edge detector or a pulse-from-an-edge circuit works ([[integrator-differentiator]]).

### Settling at switch-on
The output sits at whatever DC level its resistor ties it to — ground, or the bias of the next stage — and the capacitor charges to the difference. After power-up that takes about $5\\tau$; in audio equipment the charging current causes the familiar "thump" in loudspeakers, which muting circuits hide.

### Everyday examples
- Blocking the DC of a microphone preamplifier or phantom power.
- Removing a sensor's offset or slow drift so a small AC signal can be amplified a lot.
- Rumble filters and bass cut in audio; the treble-only feed to a tweeter.
- The input of every AC-coupled measurement.
`,
  ideas: [
    'A series capacitor and a resistor to ground block DC and pass high frequencies; f_c = 1/(2πRC).',
    'Below the corner the gain rises at +20 dB/decade and the output leads by up to 90°.',
    'A coupling capacitor with the next stage\'s input resistance forms a high-pass: put its corner well below the signal band.',
    'Square waves slower than τ come out with tilted tops; far below the corner the circuit differentiates.',
    'The output settles to its bias level after about 5τ from switch-on.'
  ],
  pitfalls: [
    'A coupling capacitor only blocks DC and leaves signals alone — It is a high-pass filter: below its corner it cuts and phase-shifts low frequencies, and it tilts slow square waves.',
    'The output of a high-pass sits at 0 V — It sits at whatever DC level its resistor sets, often the bias of the next stage; reaching it takes about 5τ after switch-on.',
    'AC coupling on a scope is harmless — It hides the DC level and distorts slow signals; use DC coupling unless you need to magnify a small ripple on a large DC voltage.'
  ],
  formulas: [
    {
      name: 'Corner of a coupling capacitor',
      expr: 'fc = 1/(2*pi*R*C)', tex: 'f_c = \\frac{1}{2\\pi R_{\\text{in}} C}',
      vars: {
        fc: { name: 'corner frequency', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        R: { name: 'input resistance of the next stage', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_{\\text{in}}' },
        C: { name: 'coupling capacitance', q: 'capacitance', unit: 'µF', value: 10 }
      },
      stories: { C: 'A stage with a {R} input must pass everything above {fc}. What coupling capacitor is needed?', fc: 'A {C} capacitor couples into a {R} input. Where is the corner?' }
    },
    {
      name: 'Gain of a single-pole high-pass',
      expr: 'H = (f/fc)/sqrt(1 + (f/fc)^2)', tex: 'A_v = \\frac{f/f_c}{\\sqrt{1 + (f/f_c)^2}}',
      vars: {
        H: { name: 'voltage gain |H| (output/input)', tex: 'A_v' },
        f: { name: 'signal frequency', q: 'frequency', unit: 'Hz', value: 20 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'Hz', value: 1.59, tex: 'f_c' }
      },
      stories: { H: 'A high-pass has its corner at {fc}. What fraction of a {f} signal passes?' }
    },
    {
      name: 'Droop of a square wave',
      expr: 'D = 1 - exp(-T/(2*R*C))', tex: 'D = 1 - e^{-T/2RC}',
      vars: {
        D: { name: 'droop of the top over a half-period', q: 'ratio', unit: '%' },
        T: { name: 'period of the square wave', q: 'time', unit: 'ms', value: 1 },
        R: { name: 'resistance', q: 'resistance', unit: 'MΩ', value: 1 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 22 }
      },
      note: 'The fraction by which each flat top sags before the next edge. Scope AC coupling is typically about 1 MΩ with a few tens of nanofarads.',
      stories: { D: 'A square wave of period {T} passes through AC coupling of {R} and {C}. By how much does each top sag?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a coupling capacitor',
      q: 'An audio stage has a 10 kΩ input resistance. Choose a coupling capacitor so that 20 Hz is essentially untouched, and check the loss and phase at 20 Hz.',
      steps: [
        'Aim for a corner a decade below 20 Hz: $C = 1/(2\\pi \\times 10^4 \\times 2) = 8.0\\ \\mu\\mathrm{F}$; use 10 µF, giving $f_c = 1.59\\ \\mathrm{Hz}$.',
        'At 20 Hz: $f/f_c = 12.6$, $|H| = 12.6/\\sqrt{1 + 158} = 0.997$ — a loss of 0.03 dB.',
        'Phase lead: $90^\\circ - \\arctan 12.6 = 4.5^\\circ$.'
      ],
      a: '10 µF: −0.03 dB and +4.5° at 20 Hz.'
    },
    {
      title: 'A 50 Hz square wave on AC coupling',
      q: 'A 50 Hz square wave is viewed with the scope\'s AC coupling, about 1 MΩ with 22 nF. How much do the tops droop?',
      steps: [
        '$\\tau = 1\\ \\mathrm{M\\Omega} \\times 22\\ \\mathrm{nF} = 22\\ \\mathrm{ms}$; the half-period is 10 ms.',
        'Droop $= 1 - e^{-10/22} = 0.37$: each top falls by more than a third before the next edge.',
        'Switch to DC coupling to see the true shape.'
      ],
      a: 'About 37 % droop per half-cycle.'
    }
  ],
  quiz: [
    { q: 'At DC, the output of an RC high-pass (resistor to ground) is…', choices: ['equal to the input', 'zero', 'half the input', 'infinite'], a: 1,
      why: 'The capacitor is an open circuit at DC, so the resistor holds the output at ground.' },
    { q: 'At the corner frequency the output of an RC high-pass is…', choices: ['−3 dB, lagging 45°', '−3 dB, leading 45°', '0 dB, in phase', '−6 dB, leading 90°'], a: 1,
      why: '|H| = 1/√2 and the phase is 90° − 45° = +45°: the output leads.' },
    { q: 'A coupling capacitor that is too small cuts the bass of an audio signal.', a: true,
      why: 'Its corner 1/(2πR_in C) rises into the audio band, attenuating the low frequencies.' },
    { q: 'A slow square wave viewed with AC coupling on a scope shows…', choices: ['rounded edges', 'sloping (drooping) tops', 'a higher frequency', 'no change'], a: 1,
      why: 'The high-pass lets the edges through but lets each flat top decay towards zero with τ = RC.' },
    { q: 'What coupling capacitor gives a 16 Hz corner into a 10 kΩ input?', answer: 0.995, unit: 'µF',
      why: 'C = 1/(2π × 10⁴ × 16) = 0.995 µF — a 1 µF part.' }
  ],
  applications: ['Coupling capacitors between amplifier stages.', 'AC coupling of oscilloscopes and data acquisition inputs.', 'Removing sensor offset and drift before high gain.', 'Edge detectors and pulse generators.', 'Bass-cut and rumble filters; tweeter feeds.'],
  sim: [{ id: 'acf-bode', params: { type: 'hp', f: 300 } }, { id: 'acf-spectrum', params: { filter: 'hp', n: 49, shape: 'square' } }]
},

{
  id: 'band-pass-stop', parent: 'frequency-response', title: 'Band-pass and band-stop filters', level: 2,
  short: 'Filters that pass, or reject, a band of frequencies around a centre f₀: built from a high-pass and a low-pass together, or from a resonant LC circuit whose Q sets the width.',
  keywords: ['band-pass', 'band-stop', 'notch filter', 'centre frequency', 'bandwidth', 'Q factor', 'twin-T', 'RLC filter', '50 Hz notch', 'hum filter', 'passband', 'stopband', 'geometric mean', 'crossover'],
  prereq: ['rc-low-pass', 'rc-high-pass', 'resonance-q'],
  related: ['bode-plots', 'filter-order', 'active-filters', 'transfer-function', 'noise-snr'],
  body: `
A **band-pass** filter keeps a range of frequencies and rejects those on either side; a **band-stop** (or **notch**) filter does the reverse. There are two ways to build them.

### Wide bands: a high-pass and a low-pass together
Cascade a [[rc-high-pass|high-pass]] with its corner at $f_1$ and a [[rc-low-pass|low-pass]] with its corner at $f_2$. The telephone voice band, 300 Hz to 3.4 kHz, is the classic example. Each side falls at 20 dB per decade per pole. This works well when $f_2$ is at least ten times $f_1$ and the second section does not load the first (make its impedance much higher, or buffer it). With corners close together, the two slopes overlap and the peak sinks well below 0 dB.

A useful fact: the centre of such a band is the **geometric mean** of its edges,
$$f_0 = \\sqrt{f_1 f_2}$$
halfway on a log scale — the voice band centres on about 1 kHz, not on 1.85 kHz.

### Narrow bands: resonance
For a narrow band, use [[resonance-q|resonance]]. A series L and C with the output taken across a resistor $R$:
$$H = \\frac{R}{R + j\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)}$$
At $f_0 = 1/(2\\pi\\sqrt{LC})$ the reactances cancel and the whole input appears across $R$: 0 dB and no phase shift. Away from $f_0$ the growing reactance takes over. The width between the −3 dB points is $f_0/Q$, with $Q = (1/R)\\sqrt{L/C}$; the band edges are
$$f_{1,2} = f_0\\left(\\sqrt{1 + \\frac{1}{4Q^2}} \\mp \\frac{1}{2Q}\\right)$$
Far from the centre the response falls at 20 dB per decade on each side, and the higher the $Q$, the lower it lies: roughly $20\\log_{10}(Q f_0/f)$ dB of attenuation well below $f_0$.

Turn the same LC around — R in series, and L with C in series from the output to ground — and it becomes a **notch**: at $f_0$ the LC is a short circuit and the output collapses, limited only by the coil's resistance.

### Notches without inductors
The **twin-T** network uses three resistors ($R$, $R$, $R/2$) and three capacitors ($C$, $C$, $2C$) to cancel one frequency, $f_0 = 1/(2\\pi RC)$. It is the classic mains-hum notch. On its own its $Q$ is only 1/4, so it also eats into neighbouring frequencies, and the depth depends on matching the parts to better than 1 %; an op-amp around it raises the $Q$ ([[active-filters]]).

### Where they are used
- Radio: intermediate-frequency filters (455 kHz, 10.7 MHz) select one channel; crystal and ceramic filters give the steep sides.
- Audio: the midrange feed in a loudspeaker crossover; graphic equalisers are rows of band-pass filters.
- Measurement: 50/60 Hz notches in ECG and EEG amplifiers; band-pass filters around a machine's bearing frequencies in vibration monitoring; tone detection.
`,
  ideas: [
    'A band-pass passes f₁ to f₂; a band-stop (notch) rejects a band.',
    'Wide bands: a high-pass and a low-pass in cascade, with corners well apart.',
    'The centre of a band is the geometric mean √(f₁f₂).',
    'Narrow bands use resonance: bandwidth = f₀/Q, with Q = (1/R)√(L/C) for the series RLC.',
    'A series LC across the output makes a notch; the twin-T does it with R and C only, but broadly.'
  ],
  pitfalls: [
    'The centre frequency lies halfway between the band edges — It is their geometric mean, √(f₁f₂), halfway on a logarithmic scale.',
    'Any high-pass plus any low-pass gives the band you designed — Only with corners well apart and without the stages loading each other; close corners leave the peak well below 0 dB.',
    'A notch removes only the offending frequency — A passive notch is broad: a twin-T with Q = 1/4 noticeably attenuates frequencies an octave either side. Narrow notches need active circuits and precise parts.'
  ],
  formulas: [
    {
      name: 'Centre frequency of a band',
      expr: 'f0 = sqrt(f1*f2)', tex: 'f_0 = \\sqrt{f_1 f_2}',
      vars: {
        f0: { name: 'centre frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        f1: { name: 'lower band edge', q: 'frequency', unit: 'Hz', value: 300, tex: 'f_1' },
        f2: { name: 'upper band edge', q: 'frequency', unit: 'Hz', value: 3400, tex: 'f_2' }
      },
      stories: { f0: 'A band-pass filter passes {f1} to {f2}. What is its centre frequency?' }
    },
    {
      name: 'Q from the bandwidth',
      expr: 'Q = f0/(f2 - f1)', tex: 'Q = \\frac{f_0}{f_2 - f_1}',
      vars: {
        Q: { name: 'quality factor' },
        f0: { name: 'centre frequency', q: 'frequency', unit: 'MHz', value: 10.7, tex: 'f_0' },
        f2: { name: 'upper −3 dB frequency', q: 'frequency', unit: 'MHz', value: 10.8, tex: 'f_2' },
        f1: { name: 'lower −3 dB frequency', q: 'frequency', unit: 'MHz', value: 10.6, tex: 'f_1' }
      },
      stories: { Q: 'An IF filter centred on {f0} passes {f1} to {f2}. What is its Q?' }
    },
    {
      name: 'Lower band edge of a resonant band-pass',
      expr: 'f1 = f0*(sqrt(1 + 1/(4*Q^2)) - 1/(2*Q))', tex: 'f_1 = f_0\\left(\\sqrt{1 + \\frac{1}{4Q^2}} - \\frac{1}{2Q}\\right)',
      vars: {
        f1: { name: 'lower −3 dB frequency', q: 'frequency', unit: 'Hz', tex: 'f_1' },
        f0: { name: 'centre frequency', q: 'frequency', unit: 'Hz', value: 1000, tex: 'f_0' },
        Q: { name: 'quality factor', value: 2 }
      },
      note: 'The upper edge has a + in place of the −; the two edges multiply to $f_0^2$.',
      stories: { f1: 'A resonant band-pass is centred on {f0} with Q = {Q}. Where is its lower −3 dB point?' }
    },
    {
      name: 'Twin-T notch frequency',
      expr: 'f0 = 1/(2*pi*R*C)', tex: 'f_0 = \\frac{1}{2\\pi RC}',
      vars: {
        f0: { name: 'notch frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        R: { name: 'the two series resistors (the shunt is R/2)', q: 'resistance', unit: 'kΩ', value: 31.8 },
        C: { name: 'the two series capacitors (the shunt is 2C)', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { R: 'A twin-T notch uses {C} capacitors. What resistors put the notch at {f0}?' }
    }
  ],
  examples: [
    {
      title: 'A resonant band-pass at 1 kHz',
      q: 'A series L = 159 mH, C = 159 nF with R = 500 Ω across the output. Find f₀, Q, the bandwidth and the band edges.',
      steps: [
        '$f_0 = 1/(2\\pi\\sqrt{0.159 \\times 159 \\times 10^{-9}}) = 1.00\\ \\mathrm{kHz}$; $\\sqrt{L/C} = 1000\\ \\Omega$.',
        '$Q = 1000/500 = 2$; bandwidth $f_0/Q = 500\\ \\mathrm{Hz}$.',
        '$f_{1,2} = 1000\\left(\\sqrt{1 + 1/16} \\mp 1/4\\right) = 781\\ \\mathrm{Hz}$ and $1281\\ \\mathrm{Hz}$.',
        'Check: $781 \\times 1281 = 1.00 \\times 10^6 = f_0^2$ — the edges sit symmetrically on a log scale, not a linear one.'
      ],
      a: 'f₀ = 1 kHz, Q = 2, 500 Hz wide, from 781 Hz to 1281 Hz.'
    },
    {
      title: 'A mains-hum notch',
      q: 'Design a twin-T notch for 50 Hz using 100 nF capacitors.',
      steps: [
        '$R = 1/(2\\pi \\times 50 \\times 100 \\times 10^{-9}) = 31.8\\ \\mathrm{k\\Omega}$.',
        'The twin-T needs $R$, $R$ and $R/2 = 15.9\\ \\mathrm{k\\Omega}$, with $C$, $C$ and $2C = 200\\ \\mathrm{nF}$.',
        'Use 1 % resistors (31.6 kΩ and 15.8 kΩ from the E96 series) and matched film capacitors, or trim one resistor for the deepest notch.',
        'Expect a broad dip: at 25 Hz and 100 Hz the signal is still noticeably attenuated unless the notch is sharpened with an op-amp.'
      ],
      a: 'R = 31.8 kΩ (and 15.9 kΩ), C = 100 nF (and 200 nF).'
    }
  ],
  quiz: [
    { q: 'A band-pass filter runs from 100 Hz to 10 kHz. Its centre frequency is…', choices: ['5.05 kHz', '1 kHz', '9.9 kHz', '10.1 kHz'], a: 1,
      why: 'The geometric mean √(100 × 10 000) = 1000 Hz. 5.05 kHz is the arithmetic mean, which is not the centre on a log scale.' },
    { q: 'Raising the Q of a resonant band-pass (same L and C)…', choices: ['moves the centre frequency up', 'narrows the passband and leaves f₀ unchanged', 'widens the passband', 'turns it into a notch'], a: 1,
      why: 'f₀ depends only on L and C; the bandwidth f₀/Q shrinks as Q grows.' },
    { q: 'A passive twin-T notch at 50 Hz removes mains hum while leaving 40 Hz and 60 Hz untouched.', a: false,
      why: 'With Q = 1/4 it is broad: 40 Hz and 60 Hz are heavily attenuated too. A narrow notch needs active circuitry.' },
    { q: 'An IF filter is centred on 10.7 MHz with a 200 kHz bandwidth. What is its Q?', answer: 53.5,
      why: 'Q = f₀/Δf = 10.7/0.2 = 53.5.' },
    { q: 'In a notch made of a series L and C from the output to ground, at f₀ the LC branch acts as…', choices: ['an open circuit', 'a short circuit', 'a pure capacitor', 'a pure inductor'], a: 1,
      why: 'At resonance the series reactances cancel, leaving only the coil\'s resistance — the output is pulled almost to zero.' }
  ],
  applications: ['Channel selection in radio receivers.', 'Loudspeaker crossovers and graphic equalisers.', 'Mains-hum notches in biomedical amplifiers.', 'Vibration monitoring and tone detection.'],
  sim: { id: 'acf-bode', params: { type: 'bp' } }
},

{
  id: 'filter-order', parent: 'frequency-response', title: 'Filter order and the Butterworth response', level: 3,
  short: 'Each extra pole steepens a filter\'s roll-off by 20 dB per decade; how the poles are placed — Butterworth, Chebyshev, Bessel — trades a flat passband, a sharp knee and a clean step response against each other.',
  keywords: ['filter order', 'roll-off', 'poles', 'Butterworth', 'Chebyshev', 'Bessel', 'elliptic', 'maximally flat', 'passband ripple', 'group delay', 'second-order section', 'Q', 'anti-aliasing', '−40 dB/decade'],
  prereq: ['bode-plots', 'rc-low-pass', 'rlc-transient'],
  related: ['active-filters', 'sampling-nyquist', 'adc', 'transfer-function', 'band-pass-stop'],
  body: `
A first-order filter's 20 dB per decade is gentle: a decade above the corner, a tenth of the voltage still gets through. When the wanted and unwanted frequencies are close — an ADC sampling at 10 kHz must pass 1 kHz but crush 9 kHz — you need a steeper edge. A filter of **order** $n$ has $n$ poles and falls at $20n$ dB per decade ($6n$ dB per octave).

### Why stacking RC sections is not enough
Two identical RC sections in cascade are second-order, but the second loads the first:
$$H = \\frac{1}{1 + 3j\\omega RC - \\omega^2R^2C^2}$$
— two real poles at $0.38f_c$ and $2.6f_c$, a quality factor of only 1/3, and already −9.5 dB at $f_c$. Even with a buffer between them the pair is −6 dB at the corner. Real poles can only make a soft, drooping knee. A sharp knee needs **complex** pole pairs, $Q > 0.5$, which means inductors or [[active-filters|op-amps]].

### The classic responses
All three below are all-pole low-passes of order $n$ falling at $20n$ dB/decade eventually. They differ in where they put the poles:
- **Butterworth** — the flattest possible passband, with no ripple:
$$|H| = \\frac{1}{\\sqrt{1 + (f/f_c)^{2n}}}$$
Every order is −3 dB at $f_c$. The second-order Butterworth is a single section with $Q = 0.707$; the third adds a real pole to a pair with $Q = 1$; the fourth uses two pairs with $Q = 0.541$ and $1.307$. The good all-round choice.
- **Chebyshev** — allows a small ripple in the passband (0.5 or 1 dB) and in return turns the corner more sharply. More overshoot and ringing on steps.
- **Bessel** — keeps the time delay nearly constant across the passband, so pulses keep their shape; almost no overshoot (0.4 % for the second order, $Q = 0.577$), but the softest knee.
- **Elliptic** (Cauer) — ripple in both bands and notches in the stop band: the steepest transition for a given order.

### The time-domain price
Sharpness in frequency costs behaviour in time. A second-order Butterworth overshoots a step by 4.3 % ($\\zeta = 0.707$, exactly as in [[rlc-transient]]); a fourth-order one by about 11 %; a Chebyshev more. For audio and anti-aliasing the frequency response matters most; for pulses, scopes and control loops, Bessel-like behaviour often wins.

### Choosing the order
For a Butterworth low-pass, the attenuation at a frequency $f$ above the corner is $10\\log_{10}\\left(1 + (f/f_c)^{2n}\\right)$ dB, close to $20n\\log_{10}(f/f_c)$. Example: pass 1 kHz, attenuate 9 kHz by 60 dB. Third order gives 57 dB at 9 kHz, fourth order 76 dB: choose the fourth. Higher orders are built as a cascade of second-order sections (plus one first-order section if $n$ is odd), each with its own $f_0$ and $Q$ from standard tables, usually arranged in order of increasing $Q$.
`,
  ideas: [
    'An nth-order filter falls at 20n dB/decade far above its corner.',
    'Cascading passive RC sections gives real poles and a soft knee (Q ≤ 1/2); sharp knees need complex poles.',
    'Butterworth: flattest passband, −3 dB at f_c for every order; Q = 0.707 for the second order.',
    'Chebyshev trades passband ripple for a sharper knee; Bessel trades sharpness for waveform fidelity.',
    'Higher orders are cascades of second-order sections with tabulated Q values.'
  ],
  pitfalls: [
    'Stacking identical RC stages makes a sharp filter — The knee gets softer: two passive sections are already −9.5 dB at the corner. Sharp knees need complex poles (Q > 0.5).',
    'A steeper filter is always better — Steepness costs overshoot, ringing and uneven delay; for pulses and control loops a gentler Bessel response is often the better choice.',
    'The corner means the same thing for every response type — Butterworth corners are at −3 dB; Chebyshev designs are often quoted at the edge of the ripple band; Bessel at −3 dB but with a much softer knee.'
  ],
  formulas: [
    {
      name: 'Butterworth gain',
      expr: 'H = 1/sqrt(1 + (f/fc)^(2*n))', tex: 'A_v = \\frac{1}{\\sqrt{1 + (f/f_c)^{2n}}}',
      vars: {
        H: { name: 'voltage gain |H| (output/input)', tex: 'A_v' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 2 },
        fc: { name: 'corner (−3 dB) frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' },
        n: { name: 'order', int: true, value: 4 }
      },
      stories: { H: 'A Butterworth low-pass of order {n} has its corner at {fc}. What fraction of a {f} signal passes?' }
    },
    {
      name: 'Butterworth attenuation in dB',
      expr: 'A = 10*log(1 + (f/fc)^(2*n))', tex: 'A = 10\\log_{10}\\left(1 + (f/f_c)^{2n}\\right)',
      vars: {
        A: { name: 'attenuation', q: 'gain', unit: 'dB' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 9 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' },
        n: { name: 'order', int: true, value: 4 }
      },
      stories: { A: 'How much does an order-{n} Butterworth low-pass with its corner at {fc} attenuate {f}?', n: 'A Butterworth filter with its corner at {fc} must attenuate {f} by at least {A}. What order is needed?' }
    },
    {
      name: 'Order needed (straight-line estimate)',
      expr: 'n = A/(20*log(f/fc))', tex: 'n \\ge \\frac{A}{20\\log_{10}(f/f_c)}',
      vars: {
        n: { name: 'order (round up to a whole number)' },
        A: { name: 'attenuation required', q: 'gain', unit: 'dB', value: 60 },
        f: { name: 'frequency to be rejected', q: 'frequency', unit: 'kHz', value: 9 },
        fc: { name: 'corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' }
      },
      note: 'From the asymptote of $20n$ dB/decade. Check the exact Butterworth attenuation afterwards: near the corner it is a little less.',
      stories: { n: 'A filter with its corner at {fc} must attenuate {f} by {A}. Roughly what order does it need?' }
    }
  ],
  examples: [
    {
      title: 'Choosing an anti-aliasing filter',
      q: 'An ADC samples at 10 kHz. Signals up to 1 kHz must pass (corner at 1 kHz), and anything at 9 kHz — which would alias onto 1 kHz — must be attenuated by at least 60 dB. What Butterworth order is needed?',
      steps: [
        'Estimate: $n \\ge 60/(20\\log_{10}9) = 60/19.1 = 3.1$.',
        'Check exactly: third order gives $10\\log_{10}(1 + 9^6) = 57.3\\ \\mathrm{dB}$ — not enough.',
        'Fourth order gives $10\\log_{10}(1 + 9^8) = 76.3\\ \\mathrm{dB}$.',
        'Build it from two second-order sections at 1 kHz with $Q = 0.541$ and $Q = 1.307$ ([[active-filters]]).'
      ],
      a: 'Fourth order (76 dB at 9 kHz).'
    },
    {
      title: 'Passive RC ladder against Butterworth',
      q: 'Compare, at half the corner frequency, a second-order Butterworth with two equal passive RC sections of the same $RC = 1/(2\\pi f_c)$.',
      steps: [
        'Butterworth at $f = f_c/2$: $10\\log_{10}(1 + 0.5^4) = 0.26\\ \\mathrm{dB}$ down — the passband is still flat.',
        'Passive ladder: with $x = f/f_c = 0.5$, $|1 - x^2 + 3jx| = |0.75 + 1.5j| = 1.68$, i.e. 4.5 dB down.',
        'The RC ladder eats into the passband long before it earns its −40 dB/decade.'
      ],
      a: 'Butterworth −0.26 dB; passive RC ladder −4.5 dB at half the corner.'
    }
  ],
  quiz: [
    { q: 'A fourth-order low-pass rolls off, far above its corner, at…', choices: ['−20 dB/decade', '−40 dB/decade', '−80 dB/decade', '−24 dB/decade'], a: 2,
      why: '20 dB/decade per pole: 4 × 20 = 80 dB/decade, the same as 24 dB/octave.' },
    { q: 'A data-acquisition system must pass pulses without overshoot or distortion of their shape. The best response type is…', choices: ['Chebyshev', 'Elliptic', 'Bessel', 'Butterworth of high order'], a: 2,
      why: 'A Bessel filter has nearly constant delay across the passband, so all components of a pulse are delayed equally and it barely overshoots.' },
    { q: 'Cascading two identical RC low-pass sections gives a second-order Butterworth filter.', a: false,
      why: 'Its poles are real, with Q = 1/3 (or 1/2 if buffered); Butterworth needs Q = 0.707, a complex pair.' },
    { q: 'At its corner frequency, a Butterworth low-pass of any order is down by…', choices: ['3 dB × the order', '3 dB', '6 dB', '20 dB'], a: 1,
      why: '|H| = 1/√(1 + 1) at f = f_c, whatever n is.' },
    { q: 'How much does a third-order Butterworth low-pass attenuate at ten times its corner frequency (in dB)?', answer: 60, unit: 'dB',
      why: '10 log₁₀(1 + 10⁶) = 60.0 dB.' }
  ],
  applications: ['Anti-aliasing filters before ADCs and reconstruction filters after DACs.', 'Audio crossovers (Linkwitz–Riley filters are cascaded Butterworths).', 'Measurement front ends where pulse shape matters (Bessel).', 'Channel filters in communications (Chebyshev, elliptic).'],
  sim: { id: 'acf-bode', params: { type: 'sk' } }
},

{
  id: 'active-filters', parent: 'frequency-response', title: 'Active filters', level: 3,
  short: 'Op-amps with resistors and capacitors make filters without inductors: buffered sections that do not load each other, gain where it is wanted, and second-order poles of any Q — the Sallen–Key and multiple-feedback circuits.',
  keywords: ['active filter', 'Sallen–Key', 'multiple feedback', 'MFB', 'op-amp filter', 'unity gain', 'second-order section', 'Q', 'Butterworth', 'state-variable', 'gain–bandwidth', 'anti-aliasing', 'filter design', 'sensitivity'],
  prereq: ['filter-order', 'non-inverting-amplifier', 'ideal-opamp'],
  related: ['gain-bandwidth', 'integrator-differentiator', 'voltage-follower', 'band-pass-stop', 'adc', 'slew-rate'],
  body: `
A sharp filter needs complex poles, and passively that means inductors. At audio and sensor frequencies inductors are big, lossy, expensive and pick up hum. An op-amp with a few resistors and capacitors does the same job better:
- its low output impedance lets sections be cascaded **without loading** — transfer functions simply multiply;
- **positive or negative feedback** around the op-amp gives complex poles of any $Q$ without inductors;
- it can add **gain** at the same time.

### First order, buffered
The simplest active filter is an RC low-pass followed by a [[voltage-follower]], or an inverting amplifier with a capacitor across its feedback resistor $R_2$:
$$H = -\\frac{R_2/R_1}{1 + j\\omega R_2 C}, \\qquad f_c = \\frac{1}{2\\pi R_2 C}$$
— gain $R_2/R_1$ in the passband, a single pole above.

### The Sallen–Key second-order section
Two resistors in series lead to the op-amp's non-inverting input, which has a capacitor $C_2$ to ground; a second capacitor $C_1$ runs from the junction of the resistors back to the output. With the op-amp as a unity-gain follower and $R_1 = R_2 = R$:
$$f_0 = \\frac{1}{2\\pi R\\sqrt{C_1C_2}}, \\qquad Q = \\frac12\\sqrt{\\frac{C_1}{C_2}}$$
Near $f_0$, $C_1$ feeds the output back positively and lifts the response into a sharp knee; the ratio $C_1/C_2$ sets how much. For a Butterworth section ($Q = 0.707$) make $C_1 = 2C_2$. The unity-gain version is popular because its $Q$ depends only on a capacitor ratio and it uses the op-amp at its widest bandwidth. Swap the Rs and Cs for a high-pass.

### Multiple feedback (MFB)
The multiple-feedback low-pass puts the op-amp in its inverting configuration with two feedback paths (a resistor and a capacitor). It inverts the signal, gives gain easily, handles higher $Q$ well and is less sensitive to the op-amp's limitations at high frequency. For band-pass sections it is the usual choice.

### Other topologies
The **state-variable** filter (two integrators and a summer) gives low-pass, band-pass and high-pass outputs at once, with $f_0$ and $Q$ tunable independently — the basis of universal filter chips. **Switched-capacitor** filters replace resistors by clocked capacitors, so the corner follows a clock frequency. And increasingly the filter is **digital**: a modest analogue anti-aliasing filter, then filtering in software after the [[adc|ADC]].

### Real op-amps set the limits
- **Gain–bandwidth.** The op-amp must have loop gain to spare at $f_0$: choose a [[gain-bandwidth|gain–bandwidth product]] at least tens of times $f_0 \\cdot Q$, or $f_0$ and $Q$ drift from their design values.
- **Stop-band leakage.** At high frequencies a Sallen–Key low-pass leaks: the signal passes straight through $C_1$ to the output, and the op-amp — running out of loop gain — can no longer hold its output impedance low. Instead of falling for ever, the response bottoms out and climbs back (the simulation shows it above about 100 kHz for a 1 MHz op-amp). An RC low-pass after the section, or an MFB design, cures it.
- **Tolerances.** Sensitivity grows with $Q$: a section with $Q = 5$ built with 5 % capacitors can land far off. Use 1 % resistors and C0G or film capacitors.
- **Signal swing.** A high-$Q$ section peaks inside, so it can clip near $f_0$ while its input and output look small. Put lower-Q sections first.
`,
  ideas: [
    'Op-amps give complex poles without inductors, buffered outputs for clean cascading, and gain.',
    'Unity-gain Sallen–Key: f₀ = 1/(2πR√(C₁C₂)) and Q = ½√(C₁/C₂); C₁ = 2C₂ gives Butterworth.',
    'Multiple-feedback sections invert, give gain easily and suit high Q and band-pass work.',
    'The op-amp\'s gain–bandwidth must be well above f₀·Q; at high frequency a Sallen–Key low-pass leaks.',
    'Sensitivity to component tolerances grows with Q: use precise parts and put low-Q sections first.'
  ],
  pitfalls: [
    'Any op-amp will do — Its gain–bandwidth product must be well above f₀·Q, or the achieved f₀ and Q drift; at high frequency a Sallen–Key low-pass leaks through its feedback capacitor.',
    'High-Q sections are as easy as low-Q ones — Sensitivity to tolerances grows with Q; a Q of 10 with 5 % capacitors can land far from the design. Use 1 % parts, C0G capacitors, or a state-variable topology.',
    'An active filter handles any signal that fits at its input and output — A high-Q section peaks internally and can clip near f₀; slew rate limits large, fast signals.'
  ],
  formulas: [
    {
      name: 'Natural frequency of a Sallen–Key section',
      expr: 'f0 = 1/(2*pi*R*sqrt(C1*C2))', tex: 'f_0 = \\frac{1}{2\\pi R\\sqrt{C_1C_2}}',
      vars: {
        f0: { name: 'natural frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        R: { name: 'each of the two equal resistors', q: 'resistance', unit: 'kΩ', value: 11.25 },
        C1: { name: 'feedback capacitor (to the output)', q: 'capacitance', unit: 'nF', value: 20, tex: 'C_1' },
        C2: { name: 'capacitor to ground', q: 'capacitance', unit: 'nF', value: 10, tex: 'C_2' }
      },
      note: 'Unity-gain Sallen–Key low-pass with equal resistors.',
      stories: { R: 'A Sallen–Key section uses {C1} and {C2}. What equal resistors put f₀ at {f0}?', f0: 'A unity-gain Sallen–Key low-pass has R = {R}, C₁ = {C1} and C₂ = {C2}. What is its natural frequency?' }
    },
    {
      name: 'Q of a unity-gain Sallen–Key section',
      expr: 'Q = sqrt(C1/C2)/2', tex: 'Q = \\frac12\\sqrt{\\frac{C_1}{C_2}}',
      vars: {
        Q: { name: 'quality factor' },
        C1: { name: 'feedback capacitor', q: 'capacitance', unit: 'nF', value: 20, tex: 'C_1' },
        C2: { name: 'capacitor to ground', q: 'capacitance', unit: 'nF', value: 10, tex: 'C_2' }
      },
      stories: { Q: 'A unity-gain Sallen–Key section has C₁ = {C1} and C₂ = {C2}. What is its Q?', C1: 'With C₂ = {C2}, what feedback capacitor gives Q = {Q}?' }
    },
    {
      name: 'Corner of an inverting first-order active low-pass',
      expr: 'fc = 1/(2*pi*R2*C)', tex: 'f_c = \\frac{1}{2\\pi R_2 C}',
      vars: {
        fc: { name: 'corner frequency', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        R2: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' },
        C: { name: 'capacitor across the feedback resistor', q: 'capacitance', unit: 'nF', value: 1.5 }
      },
      note: 'The passband gain is $-R_2/R_1$.',
      stories: { C: 'An inverting amplifier has a {R2} feedback resistor. What capacitor across it gives a corner at {fc}?' }
    }
  ],
  examples: [
    {
      title: 'A 1 kHz Butterworth section',
      q: 'Design a unity-gain Sallen–Key second-order Butterworth low-pass at 1 kHz with C₂ = 10 nF.',
      steps: [
        'Butterworth: $Q = 0.707$, so $C_1 = 4Q^2C_2 = 2C_2 = 20\\ \\mathrm{nF}$ (use 22 nF, or 2 × 10 nF in parallel for accuracy).',
        '$R = 1/(2\\pi f_0\\sqrt{C_1C_2}) = 1/(2\\pi \\times 1000 \\times 14.1\\ \\mathrm{nF}) = 11.3\\ \\mathrm{k\\Omega}$ — 11 kΩ from the E24 series gives $f_0 = 1.02\\ \\mathrm{kHz}$.',
        'Op-amp: a gain–bandwidth product of 1 MHz or more is ample at 1 kHz.'
      ],
      a: 'R₁ = R₂ ≈ 11 kΩ, C₁ = 20 nF, C₂ = 10 nF.'
    },
    {
      title: 'A fourth-order Butterworth',
      q: 'Extend the design to a fourth-order Butterworth at 1 kHz, still with C₂ = 10 nF in each section.',
      steps: [
        'Two sections at $f_0 = 1\\ \\mathrm{kHz}$ with $Q = 0.541$ and $Q = 1.307$.',
        'Section 1: $C_1 = 4 \\times 0.541^2 \\times 10 = 11.7\\ \\mathrm{nF}$, $R = 1/(2\\pi \\times 1000 \\times 2 \\times 0.541 \\times 10\\ \\mathrm{nF}) = 14.7\\ \\mathrm{k\\Omega}$.',
        'Section 2: $C_1 = 4 \\times 1.307^2 \\times 10 = 68.3\\ \\mathrm{nF}$, $R = 1/(2\\pi \\times 1000 \\times 2 \\times 1.307 \\times 10\\ \\mathrm{nF}) = 6.09\\ \\mathrm{k\\Omega}$.',
        'Place the low-Q section first so that the peaking of the high-Q section cannot clip an unfiltered signal.'
      ],
      a: 'Section 1: 14.7 kΩ, 11.7 nF, 10 nF (Q = 0.54); section 2: 6.09 kΩ, 68 nF, 10 nF (Q = 1.31).'
    }
  ],
  quiz: [
    { q: 'The main advantage of an active filter over a passive RC ladder is that…', choices: ['it needs no power supply', 'its sections do not load each other and it can realise complex poles without inductors', 'it works at any frequency', 'it has no noise'], a: 1,
      why: 'Buffered outputs let the transfer functions multiply, and feedback gives Q above 0.5 without inductors.' },
    { q: 'In a unity-gain Sallen–Key low-pass with equal resistors, increasing C₁/C₂…', choices: ['lowers Q', 'raises Q', 'changes only the gain', 'turns it into a high-pass'], a: 1,
      why: 'Q = ½√(C₁/C₂): a bigger feedback capacitor strengthens the positive feedback near f₀.' },
    { q: 'An active low-pass keeps falling at −40 dB/decade to any frequency.', a: false,
      why: 'Real op-amps run out of gain: in a Sallen–Key the signal leaks through C₁ and the output impedance rises, so the response bottoms out and climbs back.' },
    { q: 'What Q does a unity-gain Sallen–Key section with C₁ = 20 nF and C₂ = 10 nF have?', answer: 0.707,
      why: 'Q = ½√(20/10) = ½√2 = 0.707: a Butterworth section.' },
    { q: 'Why are the sections of a high-order active filter usually arranged in order of increasing Q?', choices: ['To lower the noise of the first stage only', 'So that a high-Q section\'s internal peak cannot clip on unfiltered signal', 'Because the op-amps need it for stability', 'It makes no difference'], a: 1,
      why: 'A high-Q section has gain above 1 near f₀. Placing it after the gentler sections means out-of-band energy has already been reduced.' }
  ],
  applications: ['Anti-aliasing filters for ADCs and reconstruction filters for DACs.', 'Audio equalisers, crossovers and tone controls.', 'Sensor signal conditioning (strain gauges, accelerometers, ECG).', 'Universal filter ICs and switched-capacitor filters.'],
  sim: { id: 'acf-bode', params: { type: 'sk', f: 300000 } }
},

{
  id: 'decoupling', parent: 'frequency-response', title: 'Decoupling and bypass capacitors', level: 2,
  short: 'Small capacitors right at every chip\'s supply pins supply the fast current pulses that the supply wiring cannot, keeping the rail steady — provided their inductance and self-resonance are respected.',
  keywords: ['decoupling capacitor', 'bypass capacitor', '100 nF', 'ESL', 'ESR', 'self-resonant frequency', 'anti-resonance', 'power distribution network', 'PDN', 'target impedance', 'bulk capacitor', 'MLCC', 'ground bounce', 'layout', 'ferrite bead', 'DC bias'],
  prereq: ['impedance', 'resonance-q', 'capacitors'],
  related: ['rc-low-pass', 'noise-snr', 'rlc-transient', 'linear-regulators', 'logic-families', 'microcontrollers'],
  body: `
A digital chip does not draw a steady current. On every clock edge thousands of transistors switch at once and the supply current jumps — say by 100 mA within a nanosecond. The regulator is centimetres away, and every centimetre of trace has around 10 nH of inductance. With $v = L\\,di/dt$, 10 nH and 100 mA per nanosecond make a **1 V** dip on a 3.3 V rail. Logic misbehaves, analogue parts pick up the noise, and the board radiates.

### A local reservoir
A **decoupling** (or **bypass**) capacitor placed right at the supply pins supplies the pulse from its own charge. The dip is then only
$$\\Delta V = \\frac{I\\,\\Delta t}{C}$$
— 100 mA for 1 ns from 100 nF is 1 mV — and the capacitor refills slowly between pulses from the distant supply. In frequency terms: the chip sees the supply through an impedance, and the capacitor keeps that impedance low at the frequencies where the chip's current changes.

### Real capacitors are series RLC circuits
Every capacitor has an **equivalent series resistance** (ESR) and an **equivalent series inductance** (ESL) from its body, its pads and the vias to the planes. Its impedance therefore falls as $1/(2\\pi fC)$ only up to its **self-resonant frequency**
$$f_\\text{SRF} = \\frac{1}{2\\pi\\sqrt{\\text{ESL}\\cdot C}}$$
where the reactances cancel and only the ESR is left ([[resonance-q]]). Above it the capacitor is an **inductor**, and its capacitance no longer matters. A 100 nF ceramic with 1 nH of part and mounting inductance resonates at 16 MHz; above that, a smaller package and shorter connections help far more than more microfarads. That gives the layout rules:
- one small ceramic (100 nF is the classic value) at **every** supply pin, as close as possible;
- the shortest, widest connection to the pin and a via straight to the ground plane — loop area is inductance;
- solid power and ground planes, which are themselves a low-inductance capacitor.

### Bulk capacitors and the anti-resonance trap
Slower load changes, from microseconds to milliseconds, are handled by **bulk** capacitors of 10–100 µF near the regulator or the load. Put a 10 µF and a 100 nF in parallel, though, and between their two self-resonances the big one is already inductive while the small one is still capacitive: the pair forms a **parallel resonance** — an impedance peak, possibly higher than either part alone. The simulation shows it. The ESR of the parts damps the peak, which is why a bulk capacitor with some ESR (a polymer or electrolytic type) can behave better than a perfect ceramic, and why the old recipe of 100 nF + 10 nF + 1 nF can do more harm than good. Several capacitors of the **same** value in parallel lower the impedance without creating peaks.

### The target impedance
Power-integrity engineers work backwards: if the rail may move by $\\Delta V$ when the current steps by $\\Delta I$, the supply network must stay below
$$Z_\\text{target} = \\frac{\\Delta V}{\\Delta I}$$
at every frequency up to the chip's switching content. A 3.3 V rail with 5 % tolerance and 1 A steps needs 165 mΩ; a 1.0 V FPGA core with 3 % and 10 A steps needs 3 mΩ.

### Practical traps
- **DC bias**: X5R and X7R ceramics lose much of their capacitance under voltage — a 10 µF, 6.3 V part in 0603 may give only 3–4 µF at 5 V.
- **Ferrite bead plus ceramic** filters on analogue rails form a lightly damped LC that can **amplify** noise at its resonance; add damping.
- **Op-amps** need their supply pins bypassed too, or supply coupling can make them oscillate.
`,
  ideas: [
    'Fast current pulses and supply-trace inductance make rail noise: v = L di/dt.',
    'A decoupling capacitor at the pins supplies the pulse locally: ΔV = IΔt/C.',
    'A real capacitor is a series RLC: capacitive below its self-resonance, inductive above it.',
    'Above self-resonance only the mounting inductance matters: small packages, short connections, vias to the planes.',
    'Unequal capacitors in parallel can form an anti-resonance peak; ESR damps it.'
  ],
  pitfalls: [
    'A bigger capacitor is always a better decoupler — At high frequencies the inductance of the package and mounting dominates; a 100 nF right at the pin beats 10 µF a few centimetres away.',
    'Mixing values (10 µF + 100 nF + 1 nF) always widens the low-impedance band — Between self-resonances the combination has an anti-resonance, an impedance peak that can be worse than either part alone unless damped.',
    'A ceramic capacitor keeps its marked value — High-k ceramics (X5R, X7R) lose a large fraction of their capacitance under DC bias and with temperature.'
  ],
  formulas: [
    {
      name: 'Rail dip from a current pulse',
      expr: 'dV = I*dt/C', tex: '\\Delta V = \\frac{I\\,\\Delta t}{C}',
      vars: {
        dV: { name: 'dip of the rail', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        I: { name: 'current of the pulse', q: 'current', unit: 'mA', value: 100 },
        dt: { name: 'duration of the pulse', q: 'time', unit: 'ns', value: 2, tex: '\\Delta t' },
        C: { name: 'decoupling capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      note: 'Assumes the capacitor supplies the whole pulse and its inductance is negligible — true only if it is placed very close to the pin.',
      stories: { dV: 'A chip draws {I} for {dt} on each clock edge from a {C} decoupling capacitor. How far does the rail dip?', C: 'A {I}, {dt} pulse must not pull the rail down by more than {dV}. What decoupling capacitance is needed?' }
    },
    {
      name: 'Self-resonant frequency of a capacitor',
      expr: 'fsrf = 1/(2*pi*sqrt(ESL*C))', tex: 'f_{\\text{SRF}} = \\frac{1}{2\\pi\\sqrt{\\text{ESL}\\cdot C}}',
      vars: {
        fsrf: { name: 'self-resonant frequency', q: 'frequency', unit: 'MHz', tex: 'f_{\\text{SRF}}' },
        ESL: { name: 'equivalent series inductance (part and mounting)', q: 'inductance', unit: 'nH', value: 1, tex: '\\text{ESL}' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { fsrf: 'A {C} capacitor has {ESL} of series inductance once mounted. Above what frequency does it behave like an inductor?' }
    },
    {
      name: 'Target impedance of a supply rail',
      expr: 'Zt = V*r/dI', tex: 'Z_{\\text{target}} = \\frac{V\\,r}{\\Delta I}',
      vars: {
        Zt: { name: 'target impedance', q: 'resistance', unit: 'mΩ', tex: 'Z_{\\text{target}}' },
        V: { name: 'rail voltage', q: 'voltage', unit: 'V', value: 3.3 },
        r: { name: 'allowed ripple, as a fraction of the rail', q: 'ratio', unit: '%', value: 5 },
        dI: { name: 'current step', q: 'current', unit: 'A', value: 1, tex: '\\Delta I' }
      },
      stories: { Zt: 'A {V} rail may move by {r} when the load steps by {dI}. What impedance must its supply network stay below?' }
    }
  ],
  examples: [
    {
      title: 'Capacitance is not the problem — inductance is',
      q: 'A microcontroller draws 50 mA pulses of 5 ns on each clock edge, with 1 ns rise times; the rail may dip by 20 mV. What capacitance is needed, and what does 2 nH of connection inductance do?',
      steps: [
        'Charge: $C \\ge I\\,\\Delta t/\\Delta V = 0.05 \\times 5 \\times 10^{-9}/0.02 = 12.5\\ \\mathrm{nF}$. A 100 nF capacitor gives only $2.5\\ \\mathrm{mV}$.',
        'Inductance: $di/dt = 50\\ \\mathrm{mA}/1\\ \\mathrm{ns} = 5 \\times 10^7\\ \\mathrm{A/s}$, so 2 nH drops $L\\,di/dt = 0.1\\ \\mathrm{V}$ — five times the budget.',
        'The fix is geometry, not microfarads: place the capacitor at the pin with the shortest loop, use a smaller package, or put several in parallel to divide the inductance.'
      ],
      a: '100 nF is plenty of charge; the connection inductance must be well under 1 nH.'
    },
    {
      title: 'Where do the resonances fall?',
      q: 'A 100 nF MLCC with 1 nH mounted ESL sits in parallel with a 10 µF with 2 nH. Find both self-resonant frequencies and the parallel anti-resonance.',
      steps: [
        '100 nF: $f_\\text{SRF} = 1/(2\\pi\\sqrt{10^{-9} \\times 10^{-7}}) = 15.9\\ \\mathrm{MHz}$.',
        '10 µF: $1/(2\\pi\\sqrt{2 \\times 10^{-9} \\times 10^{-5}}) = 1.13\\ \\mathrm{MHz}$.',
        'Between them the 10 µF acts as its 2 nH and the 100 nF as a capacitor; they resonate in parallel at $1/(2\\pi\\sqrt{2\\ \\mathrm{nH} \\times 100\\ \\mathrm{nF}}) = 11.3\\ \\mathrm{MHz}$, where the impedance peaks — set the simulation to these values and look.'
      ],
      a: 'SRFs of 15.9 MHz and 1.13 MHz; an anti-resonance peak near 11 MHz.'
    }
  ],
  quiz: [
    { q: 'Above its self-resonant frequency a capacitor behaves like…', choices: ['a larger capacitor', 'a resistor equal to its ESR', 'an inductor', 'an open circuit'], a: 2,
      why: 'Its series inductance dominates: the impedance rises as 2πf·ESL.' },
    { q: 'Why must decoupling capacitors sit close to the supply pins?', choices: ['To keep them cool', 'To minimise the inductance of the loop that carries the current pulses', 'To increase their capacitance', 'To reduce their voltage rating'], a: 1,
      why: 'Every millimetre of trace adds inductance, and at nanosecond edges L·di/dt dominates the rail noise.' },
    { q: 'Adding more capacitors of different values in parallel always lowers the impedance at every frequency.', a: false,
      why: 'Between two self-resonances the combination can resonate in parallel, producing an impedance peak.' },
    { q: 'What is the self-resonant frequency of a 10 nF capacitor with 0.5 nH of ESL?', answer: 71.2, unit: 'MHz',
      why: 'f = 1/(2π√(0.5 × 10⁻⁹ × 10⁻⁸)) = 1/(2π × 2.24 × 10⁻⁹) = 71.2 MHz.' },
    { q: 'A 10 µF, 6.3 V X5R ceramic in an 0603 package is used on a 5 V rail. Its effective capacitance is likely to be…', choices: ['10 µF', 'more than 10 µF', 'only about 3–4 µF', 'zero'], a: 2,
      why: 'High-k ceramics lose most of their capacitance near their rated voltage; check the maker\'s DC-bias curves.' }
  ],
  applications: ['Supply pins of every digital and analogue IC.', 'Power distribution networks of processors and FPGAs.', 'Filtering analogue rails with RC or LC (ferrite) networks.', 'Taming EMC: keeping switching currents in small local loops.'],
  sim: { id: 'acf-resonance', params: { mode: 'cap' } }
}

);
