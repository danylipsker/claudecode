/* HYPER-ELECTRONICS · content/opamp-real.js — where the ideal op-amp breaks down:
 * gain–bandwidth product, slew rate, offset voltage and bias currents, and supply rails
 * with single-supply design. Simulations in sims/opamps.js. */
Hyper.add(

{
  id: 'gain-bandwidth', parent: 'opamp-real', title: 'Gain–bandwidth product', level: 2,
  short: 'An op-amp\'s open-loop gain falls in proportion to frequency, so gain times bandwidth is constant: an amplifier set to a gain of 100 has a hundredth of the op-amp\'s gain–bandwidth product as its bandwidth.',
  keywords: ['gain-bandwidth product', 'GBW', 'GBP', 'unity-gain frequency', 'dominant pole', 'compensation', 'closed-loop bandwidth', 'noise gain', 'rise time', 'Bode plot'],
  prereq: ['negative-feedback', 'bode-plots', 'non-inverting-amplifier'],
  related: ['slew-rate', 'rc-low-pass', 'transimpedance', 'active-filters', 'decibels'],
  body: `
An op-amp's enormous open-loop gain exists only at low frequencies. Inside the chip a small **compensation capacitor** — about 30 pF in the μA741 — creates a deliberate *dominant pole* at a few hertz. Above it the gain falls at 20 dB per decade, in proportion to $1/f$, until it reaches 1 at the **unity-gain frequency**. Along that slope gain times frequency is constant: the **gain–bandwidth product** GBW.

$$A(f) \\approx \\frac{\\text{GBW}}{f}$$

A TL072 (GBW 3 MHz) has an open-loop gain of 200 000 at DC, but only 3000 at 1 kHz and 30 at 100 kHz. On a [[bode-plots|Bode plot]] it is a straight line sloping down one decade per decade. The compensation is not a flaw: it keeps the phase lag round the loop below 180° while the loop gain is above one, so the op-amp is stable with feedback ([[negative-feedback]]).

### The closed-loop bandwidth
With feedback the amplifier keeps its designed gain $1/\\beta$ while the open-loop gain is far larger. The two meet where $A(f) = 1/\\beta$; beyond that the amplifier can do no better than the open-loop curve and follows it down. The result behaves like a first-order [[rc-low-pass|low-pass filter]] with

$$f_{-3\\,\\text{dB}} = \\frac{\\text{GBW}}{\\text{NG}}, \\qquad \\text{NG} = \\frac{1}{\\beta}$$

$\\text{NG}$ is the **noise gain**, the gain seen by a small voltage at the + input. For a [[non-inverting-amplifier]] it equals the signal gain; for an [[inverting-amplifier]] of gain $-R_f/R_1$ it is $1 + R_f/R_1$ — so a unity-gain inverter has half the bandwidth of a follower. With an LM358 (about 1 MHz) a gain of 100 leaves 10 kHz; a TL072 (3 MHz) at a gain of 10 gives 300 kHz; an NE5532 (10 MHz) or OPA2134 (8 MHz) is a common choice for audio; video and fast data use parts with hundreds of megahertz.

### Accuracy runs out long before the −3 dB point
At $f_{-3\\,\\text{dB}}$ the gain is already 29 % low and the phase 45° late. At a tenth of it the gain is 0.5 % low and the phase 6° late; at a hundredth, 0.005 %. An amplifier that must be accurate to 0.1 % needs a bandwidth over twenty times its highest signal frequency. The step response of a first-order system has a 10–90 % **rise time** $t_r = 0.35/f_{-3\\,\\text{dB}}$.

### Splitting the gain
Two stages of gain $\\sqrt{G}$ each have a bandwidth of $\\text{GBW}/\\sqrt{G}$ — far more than one stage of gain $G$. The cascade's own −3 dB point is a little lower than each stage's: $\\sqrt{2^{1/n} - 1}$ times it for $n$ identical stages, 0.64 for two.

### Beyond the simple picture
- **Decompensated** op-amps trade unity-gain stability for more GBW: they are specified for a minimum gain, say 5.
- **Current-feedback** amplifiers do not follow the rule: their bandwidth is set mostly by the feedback resistor, almost independent of gain.
- GBW describes small signals. A large, fast signal meets the [[slew-rate]] first.
`,
  ideas: [
    'The open-loop gain falls as 1/f above a low dominant pole: A(f) ≈ GBW/f.',
    'Closed-loop bandwidth = GBW divided by the noise gain 1/β.',
    'For an inverting amplifier the noise gain is 1 + R_f/R₁, not the signal gain.',
    'Accuracy degrades long before the −3 dB point: 0.5 % at a tenth of it.',
    'Splitting a large gain over two stages buys a lot of bandwidth.'
  ],
  pitfalls: [
    'The bandwidth depends on the signal gain — It depends on the noise gain; an inverting amplifier of gain −1 has only half the bandwidth of a follower.',
    'Below the −3 dB frequency the gain is exact — At a tenth of the bandwidth the gain is still 0.5 % low and the phase 6° late.',
    'A fast enough GBW means large signals are fine — Large signals are limited by the slew rate, a separate and often harder limit.'
  ],
  derivation: {
    title: 'Derive the closed-loop bandwidth from a single-pole op-amp',
    steps: [
      { text: 'A dominant-pole op-amp: DC gain $A_0$, pole at $f_p$, with $A_0 f_p = \\text{GBW}$:', tex: 'A(f) = \\frac{A_0}{1 + jf/f_p}' },
      { text: 'Write the closed-loop gain in terms of the loop gain $A\\beta$:', tex: 'G = \\frac{A}{1 + A\\beta} = \\frac{1}{\\beta}\\cdot\\frac{1}{1 + 1/(A\\beta)}' },
      { text: 'Substitute $A(f)$. Because $A_0\\beta \\gg 1$, the constant term is negligible:', tex: '\\frac{1}{A\\beta} = \\frac{1 + jf/f_p}{A_0\\beta} \\approx \\frac{jf}{\\beta\\,\\text{GBW}}' },
      { text: 'The closed loop is a first-order low-pass whose corner is the GBW divided by the noise gain $1/\\beta$:', tex: 'G \\approx \\frac{1/\\beta}{1 + jf/(\\beta\\,\\text{GBW})} \\;\\Rightarrow\\; f_{-3\\,\\text{dB}} = \\beta\\,\\text{GBW}' }
    ]
  },
  formulas: [
    {
      name: 'Closed-loop bandwidth',
      expr: 'f3 = GBW/NG', tex: 'f_{-3\\,\\text{dB}} = \\frac{\\text{GBW}}{\\text{NG}}',
      vars: {
        f3: { name: 'closed-loop −3 dB bandwidth', q: 'frequency', unit: 'kHz', tex: 'f_{-3\\,\\text{dB}}' },
        GBW: { name: 'gain–bandwidth product', q: 'frequency', unit: 'MHz', value: 3, tex: '\\text{GBW}' },
        NG: { name: 'noise gain 1/β', value: 10, tex: '\\text{NG}' }
      },
      note: 'Non-inverting: NG = G. Inverting: NG = 1 + R_f/R₁.',
      stories: {
        f3: 'A TL072 ({GBW}) is used at a noise gain of {NG}. What is the bandwidth?',
        GBW: 'An amplifier with a noise gain of {NG} needs {f3} of bandwidth. What gain–bandwidth product must the op-amp have?'
      }
    },
    {
      name: 'Open-loop gain at a frequency',
      expr: 'A = GBW/f', tex: 'A \\approx \\frac{\\text{GBW}}{f}',
      vars: {
        A: { name: 'open-loop gain at f', tex: 'A' },
        GBW: { name: 'gain–bandwidth product', q: 'frequency', unit: 'MHz', value: 3, tex: '\\text{GBW}' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 1 }
      },
      note: 'Valid above the dominant pole (a few hertz to a few hundred hertz).'
    },
    {
      name: 'Closed-loop gain at a frequency (non-inverting)',
      expr: 'G = G0/sqrt(1 + (f*G0/GBW)^2)', tex: 'G = \\frac{G_0}{\\sqrt{1 + (f\\,G_0/\\text{GBW})^2}}',
      vars: {
        G: { name: 'gain magnitude at f', tex: 'G' },
        G0: { name: 'low-frequency gain', value: 10, tex: 'G_0' },
        f: { name: 'signal frequency', q: 'frequency', unit: 'kHz', value: 100 },
        GBW: { name: 'gain–bandwidth product', q: 'frequency', unit: 'MHz', value: 3, tex: '\\text{GBW}' }
      },
      stories: { G: 'A non-inverting amplifier set to {G0} uses an op-amp of {GBW}. What is its gain at {f}?' }
    },
    {
      name: 'Rise time of a first-order response',
      expr: 'tr = 0.35/f3', tex: 't_r = \\frac{0.35}{f_{-3\\,\\text{dB}}}',
      vars: {
        tr: { name: '10–90 % rise time', q: 'time', unit: 'µs', tex: 't_r' },
        f3: { name: '−3 dB bandwidth', q: 'frequency', unit: 'kHz', value: 300, tex: 'f_{-3\\,\\text{dB}}' }
      }
    },
    {
      name: 'Bandwidth of n identical stages in cascade',
      expr: 'ft = f1*sqrt(2^(1/n) - 1)', tex: 'f_{\\text{tot}} = f_1\\sqrt{2^{1/n} - 1}',
      vars: {
        ft: { name: 'overall −3 dB bandwidth', q: 'frequency', unit: 'kHz', tex: 'f_{\\text{tot}}' },
        f1: { name: 'bandwidth of each stage', q: 'frequency', unit: 'kHz', value: 253, tex: 'f_1' },
        n: { name: 'number of stages', value: 2, int: true }
      }
    }
  ],
  examples: [
    {
      title: 'A 60 dB microphone preamplifier',
      q: 'A preamplifier needs a gain of 1000 (60 dB) over the audio band, using an OPA2134 (GBW 8 MHz). Compare one stage with two.',
      steps: [
        'One stage: $8\\ \\mathrm{MHz}/1000 = 8\\ \\mathrm{kHz}$ — the top of the audio band would be lost.',
        'Two stages of $\\sqrt{1000} = 31.6$ (30 dB) each: $8\\ \\mathrm{MHz}/31.6 = 253\\ \\mathrm{kHz}$ per stage.',
        'The cascade: $253 \\times \\sqrt{2^{1/2} - 1} = 253 \\times 0.64 = 163\\ \\mathrm{kHz}$ — eight times the audio band, so the gain at 20 kHz is flat to within about 1 %.'
      ],
      a: 'One stage: 8 kHz. Two stages of 30 dB: about 160 kHz.'
    },
    {
      title: 'How much GBW for 0.1 % accuracy?',
      q: 'A gain of 10 must be accurate to 0.1 % in magnitude at 20 kHz. What GBW is needed, and what does a TL072 (3 MHz) achieve?',
      steps: [
        'A first-order response is 0.1 % low where $1/\\sqrt{1 + x^2} = 0.999$, i.e. $x = f/f_{-3\\,\\text{dB}} = 0.0447$.',
        'So $f_{-3\\,\\text{dB}} \\ge 20\\ \\mathrm{kHz}/0.0447 = 447\\ \\mathrm{kHz}$, and $\\text{GBW} \\ge 10 \\times 447\\ \\mathrm{kHz} = 4.5\\ \\mathrm{MHz}$.',
        'TL072: $f_{-3\\,\\text{dB}} = 300\\ \\mathrm{kHz}$, so $x = 0.067$: the gain is 0.22 % low and the phase 3.8° late at 20 kHz.'
      ],
      a: 'At least 4.5 MHz; a TL072 is 0.22 % low at 20 kHz.'
    }
  ],
  quiz: [
    { q: 'An op-amp with a GBW of 1 MHz is used as a non-inverting amplifier with a gain of 100. Its bandwidth is about…', choices: ['1 MHz', '100 kHz', '10 kHz', '100 Hz'], a: 2,
      why: 'f = GBW/NG = 1 MHz/100 = 10 kHz.' },
    { q: 'On the same op-amp, how does the bandwidth of an inverting amplifier of gain −1 compare with a voltage follower\'s?', choices: ['the same', 'half', 'double', 'a tenth'], a: 1,
      why: 'The inverter\'s noise gain is 1 + R_f/R₁ = 2, the follower\'s is 1: the inverter has half the bandwidth.' },
    { q: 'A TL072 has a GBW of 3 MHz. What is its open-loop gain at 1 kHz?', choices: ['200 000', '3000', '300', '3'], a: 1,
      why: 'Above the dominant pole A ≈ GBW/f = 3 MHz/1 kHz = 3000, about 70 dB — far below the DC figure.' },
    { q: 'The closed-loop bandwidth of an op-amp amplifier depends only on its signal gain.', a: false,
      why: 'It depends on the noise gain 1/β. They are equal for a non-inverting amplifier but not for an inverting one or a summer.' },
    { q: 'You need a gain of 100 from 1 MHz op-amps. One stage gives 10 kHz of bandwidth. Two stages of 10 give about…', choices: ['5 kHz', '10 kHz', '64 kHz', '200 kHz'], a: 2,
      why: 'Each stage has 100 kHz; two identical first-order stages in cascade give 100 × √(√2 − 1) ≈ 64 kHz.' }
  ],
  applications: [
    'Choosing an op-amp for audio, sensor and video amplifiers.',
    'Deciding how many stages a high-gain amplifier needs.',
    'Designing active filters, whose op-amps need GBW well above the filter\'s frequencies.',
    'Estimating the settling of ADC drivers and data-acquisition front ends.'
  ],
  sim: 'oa-gbw'
},

{
  id: 'slew-rate', parent: 'opamp-real', title: 'Slew rate', level: 2,
  short: 'The fastest an op-amp\'s output can change, in volts per microsecond. A large, fast sine wave that asks for more is turned into a triangle.',
  keywords: ['slew rate', 'V/µs', 'full-power bandwidth', 'large-signal', 'distortion', 'triangle', 'compensation capacitor', 'settling time', 'step response'],
  prereq: ['gain-bandwidth', 'periodic-waveforms', 'math:derivative'],
  related: ['comparators', 'spectrum-harmonics', 'voltage-follower', 'capacitors'],
  body: `
[[gain-bandwidth|Gain–bandwidth]] describes how an op-amp treats *small* signals. A large signal meets a different and harder limit: the output simply cannot move faster than a certain rate, the **slew rate** SR, quoted in volts per microsecond.

### Where it comes from
In most op-amps the input stage delivers a current to the compensation capacitor $C_c$, whose voltage, buffered, is the output. For small signals that current is proportional to the input difference and everything is linear. A large, fast input overdrives the input stage, which can then deliver no more than its bias current $I$; the capacitor charges at a fixed rate:

$$\\text{SR} = \\frac{I}{C_c}$$

The classic μA741, with roughly 20 µA into 30 pF, manages about 0.6 V/µs. Typical figures: LM358 0.3 V/µs, μA741 0.5, NE5532 9, TL072 13, OPA2134 20, high-speed parts hundreds.

### Full-power bandwidth
A sine wave $V_p \\sin 2\\pi f t$ changes fastest at its zero crossings, at $2\\pi f V_p$ (its [[math:derivative|derivative]] there). If that exceeds the slew rate the output cannot keep up. The highest frequency at which the op-amp can deliver a full, undistorted sine of amplitude $V_p$ is the **full-power bandwidth**

$$f_p = \\frac{\\text{SR}}{2\\pi V_p}$$

For 10 V peak: an LM358 manages 4.8 kHz, a TL072 207 kHz. Above $f_p$ the output turns into a triangle whose slopes are $\\pm$SR: its amplitude falls, odd [[spectrum-harmonics|harmonics]] appear, and the output lags. Halve the amplitude and $f_p$ doubles — slewing is a *large-signal* limit, which is how you tell it from gain–bandwidth.

### Recognising it
- Small signals pass cleanly but large ones distort: slew rate. Small and large signals both lose amplitude at high frequency, without changing shape: gain–bandwidth.
- A square wave into a follower comes out as straight-line ramps whose slope is the slew rate. Data sheets measure it that way, with a step of several volts.
- **Settling time** — how long the output takes to reach its final value within a tolerance after a step — is slewing followed by the small-signal tail.

### Designing with it
Work out $2\\pi f_\\text{max} V_p$ for the largest, fastest signal, and choose a slew rate two to five times higher. An audio stage delivering 10 V peak at 20 kHz needs 1.3 V/µs as a bare minimum, so the LM358 is out and the TL072 comfortable. Slew rate also sets how fast an op-amp can act as a [[comparators|comparator]] (about swing/SR), and how quickly a DAC buffer or sample-and-hold settles.
`,
  ideas: [
    'The slew rate is the output\'s maximum rate of change, set by I/C_c inside the op-amp.',
    'A sine of amplitude V_p at frequency f needs a slew rate of 2πfV_p.',
    'Full-power bandwidth f_p = SR/(2πV_p); halving the amplitude doubles it.',
    'Slew-limited sines become triangles: amplitude falls and harmonics appear.',
    'Slewing is a large-signal limit; gain–bandwidth is a small-signal one.'
  ],
  pitfalls: [
    'Slew rate and gain–bandwidth are the same limit — GBW limits small signals linearly; slew rate limits large signals and distorts them.',
    'If a small test signal passes at 100 kHz, a large one will too — A large signal needs a proportionally faster output; it can be slew-limited while the small one is fine.',
    'The full-power bandwidth is a fixed property of the op-amp — It depends on the amplitude: f_p = SR/(2πV_p).'
  ],
  derivation: {
    title: 'Derive the full-power bandwidth',
    steps: [
      { text: 'The output must follow a sine:', tex: 'v(t) = V_p \\sin(2\\pi f t)' },
      { text: 'Its rate of change is the derivative:', tex: '\\frac{dv}{dt} = 2\\pi f V_p \\cos(2\\pi f t)' },
      { text: 'The largest value occurs at the zero crossings, where $\\cos = \\pm 1$. The op-amp keeps up only if this is within its slew rate:', tex: '2\\pi f V_p \\le \\text{SR}' },
      { text: 'The limiting frequency is the full-power bandwidth:', tex: 'f_p = \\frac{\\text{SR}}{2\\pi V_p}' }
    ]
  },
  formulas: [
    {
      name: 'Full-power bandwidth',
      expr: 'SR = 2*pi*fp*Vp', tex: '\\text{SR} = 2\\pi f_p V_p',
      solveFor: 'fp',
      vars: {
        SR: { name: 'slew rate', q: 'slewrate', unit: 'V/µs', value: 13, tex: '\\text{SR}' },
        fp: { name: 'full-power bandwidth', q: 'frequency', unit: 'kHz', tex: 'f_p' },
        Vp: { name: 'output amplitude (peak)', q: 'voltage', unit: 'V', value: 10, tex: 'V_p' }
      },
      stories: {
        fp: 'An op-amp with a slew rate of {SR} must deliver a {Vp} peak sine. Up to what frequency can it do so?',
        SR: 'An amplifier must produce a {Vp} peak sine at {fp}. What slew rate does the op-amp need, at least?'
      }
    },
    {
      name: 'Slew rate from the internal current and capacitor',
      expr: 'SR = I/Cc', tex: '\\text{SR} = \\frac{I}{C_c}',
      vars: {
        SR: { name: 'slew rate', q: 'slewrate', unit: 'V/µs', tex: '\\text{SR}' },
        I: { name: 'maximum input-stage current', q: 'current', unit: 'µA', value: 20 },
        Cc: { name: 'compensation capacitor', q: 'capacitance', unit: 'pF', value: 30, tex: 'C_c' }
      }
    },
    {
      name: 'Time to slew across a step',
      expr: 't = dV/SR', tex: 't = \\frac{\\Delta V}{\\text{SR}}',
      vars: {
        t: { name: 'slewing time', q: 'time', unit: 'µs' },
        dV: { name: 'size of the output step', q: 'voltage', unit: 'V', value: 10, tex: '\\Delta V' },
        SR: { name: 'slew rate', q: 'slewrate', unit: 'V/µs', value: 0.3, tex: '\\text{SR}' }
      },
      note: 'Settling to a fine tolerance takes longer: add the small-signal tail.'
    }
  ],
  examples: [
    {
      title: 'LM358 or TL072 for an audio line driver?',
      q: 'A line driver must deliver 10 V peak up to 20 kHz. Check an LM358 (0.3 V/µs) and a TL072 (13 V/µs).',
      steps: [
        'Required slope: $2\\pi \\times 20\\ \\mathrm{kHz} \\times 10\\ \\mathrm{V} = 1.26\\ \\mathrm{V/\\mu s}$.',
        'LM358: $f_p = 0.3\\ \\mathrm{V/\\mu s}/(2\\pi \\times 10\\ \\mathrm{V}) = 4.8\\ \\mathrm{kHz}$. At 20 kHz the output is a triangle of about $0.3/(4 \\times 0.02) = 3.75\\ \\mathrm{V}$ peak.',
        'TL072: $f_p = 207\\ \\mathrm{kHz}$, ten times the requirement.'
      ],
      a: 'The LM358 fails (full power only to 4.8 kHz); the TL072 has a tenfold margin.'
    },
    {
      title: 'Measuring the slew rate',
      q: 'A TL072 follower is driven with a square wave from −5 V to +5 V. The output ramps take 0.77 µs. What is the slew rate? How long would an LM358 take?',
      steps: [
        '$\\text{SR} = 10\\ \\mathrm{V}/0.77\\ \\mu\\mathrm{s} = 13\\ \\mathrm{V/\\mu s}$.',
        'LM358: $10\\ \\mathrm{V}/0.3\\ \\mathrm{V/\\mu s} = 33\\ \\mu\\mathrm{s}$ per edge — on a 20 kHz square wave (25 µs half-period) it never reaches the top.'
      ],
      a: '13 V/µs; the LM358 needs 33 µs per edge.'
    }
  ],
  quiz: [
    { q: 'An amplifier must output a 5 V peak sine at 50 kHz. The minimum slew rate is about…', choices: ['0.16 V/µs', '0.25 V/µs', '1.6 V/µs', '16 V/µs'], a: 2,
      why: '2π × 50 kHz × 5 V = 1.57 × 10⁶ V/s ≈ 1.6 V/µs.' },
    { q: 'On the scope, a slew-limited sine wave looks like…', choices: ['a smaller sine wave', 'a triangle wave of reduced amplitude', 'a square wave', 'a sine with clipped tops'], a: 1,
      why: 'The output ramps at ±SR between the turning points, so the waveform becomes triangular and shrinks as the frequency rises.' },
    { q: 'A 10 mV peak, 100 kHz sine passes through an LM358 follower (0.3 V/µs, 1 MHz). It is distorted by the slew rate.', a: false,
      why: 'It needs only 2π × 100 kHz × 10 mV = 6.3 mV/µs — far below 0.3 V/µs. A small signal is limited by GBW, not slew rate; at 1 MHz of bandwidth it passes cleanly.' },
    { q: 'The amplitude of a sine is doubled. The full-power bandwidth…', choices: ['doubles', 'is unchanged', 'halves', 'falls to a quarter'], a: 2,
      why: 'f_p = SR/(2πV_p): twice the amplitude, half the frequency.' },
    { q: 'An op-amp\'s input stage can deliver 20 µA to a 30 pF compensation capacitor. What is its slew rate?', answer: 0.667, unit: 'V/µs',
      why: 'SR = I/C = 20 µA/30 pF = 0.67 × 10⁶ V/s = 0.67 V/µs.' }
  ],
  applications: [
    'Choosing op-amps for audio power stages and line drivers.',
    'DAC output buffers and sample-and-hold circuits, which must settle quickly.',
    'Video and pulse amplifiers.',
    'Estimating how fast an op-amp can serve as a comparator.'
  ],
  sim: 'oa-slew'
},

{
  id: 'offset-bias', parent: 'opamp-real', title: 'Offset voltage and bias currents', level: 3,
  short: 'A real op-amp behaves as if a few microvolts to millivolts sat in series with its input and small currents flowed into its inputs. Amplified by the noise gain, they set the limit of DC precision.',
  keywords: ['input offset voltage', 'Vos', 'input bias current', 'input offset current', 'drift', 'µV/°C', 'bias compensation resistor', 'zero-drift', 'chopper', 'auto-zero', 'offset null', 'DC error'],
  prereq: ['inverting-amplifier', 'non-inverting-amplifier', 'superposition'],
  related: ['integrator-differentiator', 'instrumentation-amplifier', 'thermocouples', 'transimpedance', 'negative-feedback'],
  body: `
Ground the input of an ideal amplifier and its output sits at exactly 0 V. A real one sits at a few millivolts, or a few hundred, and the value drifts with temperature. The causes are inside the op-amp's input stage; the size of the damage is decided by the circuit around it.

### Input offset voltage
The two input transistors are never perfectly matched, so the output is zero not when $V_+ = V_-$ but when they differ by a small **input offset voltage** $V_{os}$. Model it as a tiny source in series with the + input. The circuit amplifies it by the **noise gain** $1 + R_f/R_1$ — for inverting and non-inverting amplifiers alike, since it sits where the non-inverting gain applies:

$$V_{o} = V_{os}\\left(1 + \\frac{R_f}{R_1}\\right)$$

Typical values: LM358 and TL072 about 3 mV (up to 7 and 10 mV worst case); OPA2134 0.5 mV; precision bipolar parts such as the OP07 tens of microvolts; **zero-drift** (chopper or auto-zero) amplifiers such as the OPA333 under 10 µV. It also **drifts**: a few µV/°C for ordinary parts, 0.05 µV/°C for zero-drift ones. And it changes a little with the common-mode and supply voltages — the CMRR and PSRR, often quoted in µV/V.

### Input bias and offset currents
The inputs take a small DC current, the **input bias current** $I_b$: nanoamps for bipolar inputs (LM358 about 20 nA, NE5532 about 200 nA), picoamps for JFET and CMOS inputs (TL072 tens of picoamps, OPA2134 about 5 pA). FET bias currents double about every 10 °C, so a JFET input drawing 30 pA at 25 °C draws about 2 nA at 85 °C. The **offset current** $I_{os}$ is the difference between the two inputs' bias currents, usually much smaller than either.

The bias current into the − input can only come through $R_f$, so it produces $I_b R_f$ at the output. A resistor $R_p = R_1 \\parallel R_f$ from the + input to ground makes the + input's bias current develop an equal and opposite error, leaving only $I_{os} R_f$. It helps with bipolar op-amps, whose two bias currents match; with FET inputs it is unnecessary, and it only adds noise.

### Adding it up — and reducing it
The worst-case output error is $V_{os}(1 + R_f/R_1) + I_b R_f$ (or $I_{os}R_f$ with $R_p$), plus the drifts over the temperature range. To reduce it:
- **Choose the part.** Zero-drift amplifiers for microvolt-level DC signals ([[thermocouples]], shunts, [[strain-gauges|strain gauges]]); FET inputs where resistances are high.
- **Keep resistances low** where bias current flows.
- **Calibrate.** Measure the output with the input shorted and subtract it in software. Offset-null pins (μA741, OP07) trim $V_{os}$ but not its drift.
- **Block DC** when it is not wanted: a capacitor in series with $R_1$ in a [[non-inverting-amplifier]] makes the DC gain 1.
- **Beware integrators.** With infinite DC gain an [[integrator-differentiator|integrator]] integrates its own offsets: the output ramps at $V_{os}/RC + I_b/C$ until it reaches a rail.
`,
  ideas: [
    'The offset voltage acts like a small source in series with the + input.',
    'It is amplified by the noise gain 1 + R_f/R₁, in inverting and non-inverting circuits alike.',
    'The bias current into the − input flows through R_f and adds I_b·R_f at the output.',
    'A resistor R₁ ∥ R_f on the + input cancels matched bias currents, leaving I_os·R_f.',
    'Zero-drift op-amps, low resistances and calibration tame DC errors; integrators suffer most.'
  ],
  pitfalls: [
    'An inverting amplifier of gain −10 multiplies the offset by 10 — It multiplies it by the noise gain, 11.',
    'The bias-compensation resistor always helps — Only for bipolar op-amps with matched bias currents; with FET inputs it just adds noise.',
    'Trimming the offset to zero solves it — The offset drifts with temperature and time; a trimmed general-purpose part can be millivolts off again 50 °C later.'
  ],
  derivation: {
    title: 'Derive the output error, and why R₁ ∥ R_f cancels the bias currents',
    steps: [
      { text: 'Model the offset as a source $V_{os}$ at the + input, and the bias currents $I_{b+}$ and $I_{b-}$ flowing into the inputs; a resistor $R_p$ connects the + input to ground. Treat each error separately ([[superposition]]). The offset alone sees the non-inverting gain:', tex: 'V_{o,1} = V_{os}\\left(1 + \\frac{R_f}{R_1}\\right)' },
      { text: 'The − input is held at 0 V (with the other sources off), so its bias current can only be supplied through $R_f$ from the output:', tex: 'V_{o,2} = I_{b-}\\,R_f' },
      { text: 'The + input\'s bias current flows through $R_p$, putting $-I_{b+}R_p$ on the + input, which is then amplified by the noise gain:', tex: 'V_{o,3} = -I_{b+}\\,R_p\\left(1 + \\frac{R_f}{R_1}\\right)' },
      { text: 'Choose $R_p = R_1 R_f/(R_1 + R_f)$. Then $R_p(1 + R_f/R_1) = R_f$, and the two bias terms leave only the offset current:', tex: 'V_{o,2} + V_{o,3} = (I_{b-} - I_{b+})\\,R_f = \\pm I_{os}R_f' }
    ]
  },
  formulas: [
    {
      name: 'Output error from the offset voltage',
      expr: 'Vo = Vos*(1 + Rf/R1)', tex: 'V_o = V_{os}\\left(1 + \\frac{R_f}{R_1}\\right)',
      vars: {
        Vo: { name: 'output offset', q: 'voltage', unit: 'mV', tex: 'V_o', signed: true },
        Vos: { name: 'input offset voltage', q: 'voltage', unit: 'mV', value: 3, tex: 'V_{os}', signed: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' },
        R1: { name: 'resistor to ground (or input resistor)', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' }
      },
      note: 'The same for inverting and non-inverting amplifiers: the offset sees the noise gain.',
      stories: { Vo: 'An LM358 with {Vos} of offset is used with R₁ = {R1} and R_f = {Rf}. How far off zero is its output with the input grounded?' }
    },
    {
      name: 'Output error from bias current (no compensation)',
      expr: 'Vo = Ib*Rf', tex: 'V_o = I_b R_f',
      vars: {
        Vo: { name: 'output error', q: 'voltage', unit: 'mV', tex: 'V_o' },
        Ib: { name: 'input bias current', q: 'current', unit: 'nA', value: 20, tex: 'I_b' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' }
      },
      note: 'With $R_p = R_1 \\parallel R_f$ on the + input, replace $I_b$ by the offset current $I_{os}$.'
    },
    {
      name: 'Integrator drift',
      expr: 'r = Vos/(R*C) + Ib/C', tex: '\\dot{V}_o = \\frac{V_{os}}{RC} + \\frac{I_b}{C}',
      vars: {
        r: { name: 'drift rate of the output, dV_o/dt', q: 'slewrate', unit: 'V/s', tex: '\\dot{V}_o' },
        Vos: { name: 'input offset voltage', q: 'voltage', unit: 'mV', value: 3, tex: 'V_{os}' },
        R: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 100 },
        C: { name: 'feedback capacitor', q: 'capacitance', unit: 'µF', value: 1 },
        Ib: { name: 'input bias current', q: 'current', unit: 'nA', value: 20, tex: 'I_b' }
      },
      note: 'Worst case, with both errors pushing the same way.'
    },
    {
      name: 'FET bias current against temperature',
      expr: 'Ib = Ib0*2^(dT/10)', tex: 'I_b = I_{b0}\\,2^{\\Delta T/10\\,^{\\circ}\\mathrm{C}}',
      vars: {
        Ib: { name: 'bias current when hot', q: 'current', unit: 'nA', tex: 'I_b' },
        Ib0: { name: 'bias current at 25 °C', q: 'current', unit: 'nA', value: 0.03, tex: 'I_{b0}' },
        dT: { name: 'temperature rise above 25 °C', q: 'dtemp', unit: '°C', value: 60, tex: '\\Delta T' }
      },
      note: 'A rule of thumb for JFET and CMOS inputs: the current roughly doubles every 10 °C.'
    }
  ],
  examples: [
    {
      title: 'A thermocouple amplifier: which op-amp?',
      q: 'A type K thermocouple (about 41 µV/°C) is amplified by a non-inverting stage with $R_1 = 1\\ \\mathrm{k\\Omega}$ and $R_f = 100\\ \\mathrm{k\\Omega}$. Compare an LM358 (3 mV, 20 nA) with a zero-drift OPA333 (10 µV, bias negligible).',
      steps: [
        'Noise gain $1 + 100/1 = 101$.',
        'LM358: offset $3\\ \\mathrm{mV} \\times 101 = 0.303\\ \\mathrm{V}$; bias $20\\ \\mathrm{nA} \\times 100\\ \\mathrm{k\\Omega} = 2\\ \\mathrm{mV}$. Referred to the input that is about 3 mV — a temperature error of $3\\ \\mathrm{mV}/41\\ \\mu\\mathrm{V/^\\circ C} \\approx 73\\ ^{\\circ}\\mathrm{C}$.',
        'OPA333: $10\\ \\mu\\mathrm{V} \\times 101 = 1\\ \\mathrm{mV}$ at the output, $0.24\\ ^{\\circ}\\mathrm{C}$ at the input.',
        'The LM358\'s offset could be calibrated out at one temperature, but its drift (several µV/°C, i.e. about 0.1 °C of reading per °C of board temperature) could not.'
      ],
      a: 'LM358: about 73 °C of error. OPA333: about 0.24 °C.'
    },
    {
      title: 'An integrator that drifts',
      q: 'An integrator uses $R = 100\\ \\mathrm{k\\Omega}$, $C = 1\\ \\mu\\mathrm{F}$ and an LM358 (3 mV, 20 nA) on ±15 V. How fast does it drift with its input grounded, and where does a 10 MΩ leak resistor across $C$ hold it?',
      steps: [
        'Drift: $3\\ \\mathrm{mV}/0.1\\ \\mathrm{s} + 20\\ \\mathrm{nA}/1\\ \\mu\\mathrm{F} = 30 + 20 = 50\\ \\mathrm{mV/s}$ (worst case).',
        'From 0 V it reaches the 13.5 V limit in about $13.5/0.05 = 270\\ \\mathrm{s}$.',
        'With $R_f = 10\\ \\mathrm{M\\Omega}$: $3\\ \\mathrm{mV} \\times (1 + 100) + 20\\ \\mathrm{nA} \\times 10\\ \\mathrm{M\\Omega} = 0.30 + 0.20 = 0.5\\ \\mathrm{V}$ — steady, but the circuit now integrates only above $1/(2\\pi \\times 10\\ \\mathrm{M\\Omega} \\times 1\\ \\mu\\mathrm{F}) = 0.016\\ \\mathrm{Hz}$.'
      ],
      a: 'About 50 mV/s, reaching the rail in under 5 minutes; with the leak it settles at about 0.5 V.'
    }
  ],
  quiz: [
    { q: 'An inverting amplifier with R_f/R₁ = 10 uses an op-amp with 1 mV of offset. With the input grounded, the output is about…', choices: ['1 mV', '10 mV', '11 mV', '0 V, since the input is grounded'], a: 2,
      why: 'The offset is amplified by the noise gain 1 + R_f/R₁ = 11, not by the signal gain of 10.' },
    { q: 'Why is a resistor equal to R₁ ∥ R_f often placed between the + input and ground?', choices: ['to set the gain', 'to make both inputs see the same resistance, so matched bias currents cancel', 'to protect the input', 'to reduce noise'], a: 1,
      why: 'Each bias current then produces the same output error with opposite sign, leaving only the offset current I_os times R_f.' },
    { q: 'A JFET-input op-amp has 30 pA of bias current at 25 °C. Roughly what is it at 85 °C?', choices: ['30 pA', '60 pA', '0.2 nA', '2 nA'], a: 3,
      why: 'Doubling every 10 °C over 60 °C is 2⁶ = 64 times: about 1.9 nA.' },
    { q: 'An integrator with its input grounded will stay at 0 V indefinitely if the op-amp is good enough.', a: false,
      why: 'Any offset voltage or bias current, however small, is integrated; only its rate depends on the op-amp. A reset, a leak resistor or an outer loop is needed.' },
    { q: 'A 20 nA bias current flows through a 10 MΩ feedback resistor. What output error does it cause, in volts?', answer: 0.2,
      why: 'I_b·R_f = 20 nA × 10 MΩ = 0.2 V.' }
  ],
  applications: [
    'Thermocouple, shunt and strain-gauge amplifiers, where microvolts matter.',
    'Integrators, sample-and-hold circuits and peak detectors.',
    'Electrometers and photodiode amplifiers with large feedback resistors.',
    'Choosing between general-purpose, precision and zero-drift op-amps.'
  ],
  sim: { id: 'oa-integrator', params: { mode: 'int', wave: 'none', vos: 2 } }
},

{
  id: 'single-supply', parent: 'opamp-real', title: 'Supply rails, rail-to-rail and single-supply design', level: 2,
  short: 'How close the output gets to each rail, and which input voltages the op-amp accepts, decide whether a circuit works on a single 3.3 V or 5 V supply — and signals must be biased around a mid-point.',
  keywords: ['single supply', 'rail-to-rail', 'output swing', 'input common-mode range', 'mid-supply bias', 'virtual ground', 'headroom', 'phase reversal', 'LM358', 'MCP6002', 'AC coupling'],
  prereq: ['non-inverting-amplifier', 'inverting-amplifier', 'voltage-divider'],
  related: ['adc', 'decoupling', 'microcontrollers', 'batteries', 'voltage-follower', 'rc-high-pass'],
  body: `
Classic op-amp circuits assume ±15 V, with ground in the middle and signals swinging either side of it. Most boards today have one supply — 3.3 V, 5 V, a battery — and ground is one of the rails. Two lines of the data sheet then decide whether a circuit works.

### Output swing
How close the output gets to each rail depends on the output stage and on the load current:
- **Classic bipolar and JFET parts** (TL072, NE5532) stop about 1.5 V from each rail. On 5 V that leaves 1.5–3.5 V.
- **"Single-supply" parts of the 1970s** (LM358, LM324) swing down to within millivolts of ground at light load, but only to about 1.5 V below the positive rail: 0–3.5 V on 5 V.
- **Rail-to-rail output** parts (MCP6002, TLV9002, OPA333) come within tens of millivolts of both rails at light load — "within 25 mV into 10 kΩ" — and further away as the load current rises. None reaches the rail exactly.

### Input common-mode range
Which input voltages the op-amp works with:
- A TL072 needs its inputs 3–4 V above its negative rail. On a single 5 V supply almost nothing is left, and inputs pushed below the range can make the output jump to the opposite rail (phase reversal).
- The LM358's inputs work from ground up to 1.5 V below the positive rail, so it can sense signals at ground.
- Rail-to-rail-input parts (the MCP6002 accepts 0.3 V beyond either rail) often use two input pairs, with a small step in offset where one hands over to the other.

In a [[non-inverting-amplifier]] or [[voltage-follower]] the inputs follow the signal, so the whole signal must fit the input range. In an [[inverting-amplifier]] the inputs sit at the bias voltage, and only that must fit.

### Biasing around a mid-point
An AC signal swings positive and negative, but the op-amp can only produce voltages between its rails. So the signal is shifted to ride on a **bias voltage** $V_b$ (a *virtual ground*), usually from a [[voltage-divider]] across the supply, decoupled with a capacitor of a few microfarads and buffered if it must supply current. Coupling capacitors block the DC at the input and output ([[rc-high-pass]]). The best bias is the middle of the *output range*, not of the supply: an LM358 on 5 V swings from about 0 to 3.5 V, so bias it at 1.75 V for ±1.75 V, not at 2.5 V, which leaves only ±1 V.

### DC signals that start at zero
A current shunt or a bridge sensor may need an output down to 0 V. An op-amp whose inputs include ground and whose output comes close to it gets within millivolts; the last few millivolts are lost. Accept that, add a small deliberate offset, or give the op-amp a small negative rail from a charge-pump chip made for the purpose.

### Mind the supply itself
A divider reference passes half of the supply's noise straight into the signal path, which is why it needs its capacitor ([[decoupling]]). And since the output can reach neither rail exactly, choose the gain so that the signal never asks it to.
`,
  ideas: [
    'Two limits matter on a single supply: output swing and input common-mode range.',
    'Classic parts lose about 1.5 V at each rail; rail-to-rail parts tens of millivolts — never zero.',
    'AC signals are biased around a mid-point from a decoupled divider, with coupling capacitors.',
    'Bias at the middle of the actual output range, not of the supply.',
    'In followers and non-inverting stages the whole input swing must fit the input range.'
  ],
  pitfalls: [
    'A rail-to-rail output reaches the rails — It comes within tens of millivolts at light load, and further at higher current.',
    'Any op-amp works on 5 V if its supply rating allows it — Its input range and output swing may leave little or no usable signal range; a TL072 is nearly unusable on a single 5 V.',
    'Mid-supply bias is always V_cc/2 — The best bias is the middle of the op-amp\'s real output swing, which for an LM358 on 5 V is about 1.75 V.'
  ],
  formulas: [
    {
      name: 'Best bias point',
      expr: 'Vb = (Voh + Vol)/2', tex: 'V_b = \\frac{V_{OH} + V_{OL}}{2}',
      vars: {
        Vb: { name: 'bias voltage for the largest symmetric swing', q: 'voltage', unit: 'V', tex: 'V_b' },
        Voh: { name: 'highest output voltage', q: 'voltage', unit: 'V', value: 3.5, tex: 'V_{OH}' },
        Vol: { name: 'lowest output voltage', q: 'voltage', unit: 'V', value: 0.02, tex: 'V_{OL}' }
      },
      stories: { Vb: 'An op-amp\'s output can swing from {Vol} to {Voh}. At what voltage should the signal be biased?' }
    },
    {
      name: 'Largest symmetric output peak',
      expr: 'Vpk = (Voh - Vol)/2', tex: 'V_{pk} = \\frac{V_{OH} - V_{OL}}{2}',
      vars: {
        Vpk: { name: 'largest undistorted peak', q: 'voltage', unit: 'V', tex: 'V_{pk}' },
        Voh: { name: 'highest output voltage', q: 'voltage', unit: 'V', value: 3.5, tex: 'V_{OH}' },
        Vol: { name: 'lowest output voltage', q: 'voltage', unit: 'V', value: 0.02, tex: 'V_{OL}' }
      }
    },
    {
      name: 'Input coupling corner with a bias divider',
      expr: 'fc = 1/(2*pi*C*R1*R2/(R1 + R2))', tex: 'f_c = \\frac{1}{2\\pi C\\,(R_1 \\parallel R_2)}',
      vars: {
        fc: { name: 'high-pass corner', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        C: { name: 'coupling capacitor', q: 'capacitance', unit: 'µF', value: 1 },
        R1: { name: 'upper bias resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_1' },
        R2: { name: 'lower bias resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      note: 'The signal sees the two bias resistors in parallel to the (AC-grounded) supply.',
      stories: { C: 'An input biased by {R1} and {R2} must pass signals down to {fc}. What coupling capacitor do you need?' }
    }
  ],
  examples: [
    {
      title: 'An LM358 preamplifier on 5 V',
      q: 'An LM358 on 5 V amplifies a microphone signal of 40 mV peak by 40. Its output swings from about 0.02 V to 3.5 V. Will a 2.5 V bias work? Choose a better one.',
      steps: [
        'Output: $40 \\times 40\\ \\mathrm{mV} = 1.6\\ \\mathrm{V}$ peak.',
        'Biased at 2.5 V it would need 0.9–4.1 V: the top is cut at 3.5 V.',
        'Best bias $(3.5 + 0.02)/2 = 1.76\\ \\mathrm{V}$, giving up to ±1.74 V — enough.',
        'A divider of 100 kΩ over 56 kΩ gives $5 \\times 56/156 = 1.79\\ \\mathrm{V}$; decouple it with 10 µF. For the non-inverting stage, return $R_1$ to ground through a capacitor so the DC gain is 1 and the output rests at the bias.'
      ],
      a: 'No — 2.5 V clips the tops. Bias at about 1.8 V (100 kΩ over 56 kΩ).'
    },
    {
      title: 'Driving a 12-bit ADC on 3.3 V',
      q: 'A rail-to-rail op-amp on 3.3 V drives a 12-bit ADC with a 0–3.3 V range. The output comes within 25 mV of each rail. How many codes can it never reach?',
      steps: [
        'One code is $3.3\\ \\mathrm{V}/4096 = 0.81\\ \\mathrm{mV}$.',
        '25 mV is about 31 codes at each end: 62 codes, 1.5 % of the range, are out of reach.',
        'If they matter, scale the signal to about 0.05–3.25 V, or use an ADC reference slightly below the op-amp\'s supply.'
      ],
      a: 'About 31 codes at each end (1.5 % of the range).'
    }
  ],
  quiz: [
    { q: 'An LM358 runs from a single 5 V supply. Roughly what is the highest voltage its output can reach?', choices: ['5.0 V', '4.9 V', '3.5 V', '2.5 V'], a: 2,
      why: 'Its output stage stops about 1.5 V below the positive rail; it is its lower end that reaches ground.' },
    { q: 'Why is a TL072 a poor choice on a single 5 V supply?', choices: ['it draws too much current', 'its input range and output swing each exclude several volts, leaving almost no usable range', 'it is too slow', 'it needs a negative reference'], a: 1,
      why: 'Its inputs must stay 3–4 V above the negative rail and its output stops about 1.5 V from each rail; on 5 V the two leave essentially nothing.' },
    { q: 'A rail-to-rail output op-amp on a single supply can pull its output to exactly 0 V.', a: false,
      why: 'Its output transistors always leave a small voltage — tens of millivolts at light load, more at higher current.' },
    { q: 'Why is the mid-supply divider decoupled with a capacitor?', choices: ['to set the gain', 'because the divider passes half of the supply\'s noise and ripple into the signal path', 'to make it start faster', 'to protect the op-amp'], a: 1,
      why: 'Without the capacitor, any noise on the supply appears, halved, on the bias node and is amplified along with the signal.' },
    { q: 'An op-amp output swings from 0.02 V to 3.5 V. What is the best bias voltage for the largest symmetric signal, in volts?', answer: 1.76,
      why: '(3.5 + 0.02)/2 = 1.76 V, which leaves ±1.74 V.' }
  ],
  applications: [
    'Battery-powered and USB-powered sensor front ends.',
    'ADC drivers next to 3.3 V microcontrollers.',
    'Audio circuits on single 5 V or 12 V supplies.',
    'Choosing between general-purpose, single-supply and rail-to-rail op-amps.'
  ],
  sim: { id: 'oa-config-lab', params: { config: 'noninv', supply: 'single', part: 'lm358', amp: 0.5, rf: 22e3 } }
}

);
