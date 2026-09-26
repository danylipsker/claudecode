/* HYPER-ELECTRONICS · content/waveforms.js — signals and waveforms: periodic waveforms,
 * peak/average/RMS values, decibels, spectra and harmonics, noise. */
Hyper.add(

{
  id: 'periodic-waveforms', parent: 'waveforms', title: 'Periodic waveforms', level: 1,
  short: 'Signals that repeat: their period, frequency, amplitude, phase and duty cycle, and the sine, square, triangle, sawtooth and pulse shapes that electronics uses every day.',
  keywords: ['waveform', 'period', 'frequency', 'amplitude', 'peak-to-peak', 'phase', 'duty cycle', 'sine wave', 'square wave', 'triangle wave', 'sawtooth', 'pulse', 'angular frequency', 'DC offset', 'rise time'],
  prereq: ['voltage', 'physics:alternating-current', 'math:trig-graphs'],
  related: ['rms-values', 'spectrum-harmonics', 'oscilloscope', 'pwm', 'phasors-ac'],
  body: `
A **waveform** is a voltage (or current) drawn against time — exactly what an [[oscilloscope]] shows. Most signals worth naming are **periodic**: the same shape repeats every **period** $T$. The number of repeats per second is the **frequency**,

$$f = \\frac{1}{T}$$

measured in hertz. Mains electricity repeats 50 times a second in Europe ($T = 20\\ \\mathrm{ms}$) and 60 in the Americas (16.7 ms); hearing spans about 20 Hz to 20 kHz; a microcontroller clock of 16 MHz ticks every 62.5 ns; Wi-Fi carriers run at 2.4 and 5 GHz.

### The sine wave
$$v(t) = V_p \\sin(\\omega t + \\varphi) + V_\\text{DC}, \\qquad \\omega = 2\\pi f$$

Four numbers describe it: the **amplitude** or peak $V_p$ (measured from the centre line), the **angular frequency** $\\omega$ in radians per second, the **phase** $\\varphi$ that says where in its cycle it is at $t = 0$, and any **DC offset** $V_\\text{DC}$. The **peak-to-peak** value is $2V_p$.

The sine is not just one shape among many. It is what a rotating generator naturally makes, and it is the only waveform that keeps its shape through any circuit of resistors, capacitors and inductors: differentiate or integrate a sine and you get a sine, only scaled and shifted. That is why AC analysis ([[phasors-ac]]) and filters ([[transfer-function]]) are built on it — and why every other waveform is best understood as a sum of sines ([[spectrum-harmonics]]).

### The other everyday shapes
| Shape | Where you meet it |
|---|---|
| Square wave | clocks, logic signals, test signals |
| Pulse train, duty cycle $D$ | [[pwm\\|PWM]] for motors, LEDs and converters |
| Triangle | the integral of a square wave; function generators, class-D modulators |
| Sawtooth (ramp) | timebases, ramp ADCs, sweep generators |
| Rectified sine | the output of a [[full-wave-rectifier\\|rectifier]] before smoothing |

The **duty cycle** of a pulse train is the fraction of each period it spends high: $D = t_\\text{on}/T$. A 20 kHz PWM signal that is on for 12 µs of its 50 µs period has $D = 24\\ \\%$.

### Phase between two signals
Two waves of the same frequency can be shifted in time. A shift $\\Delta t$ is a phase difference of $360^\\circ \\times \\Delta t/T$: one wave reaching its peak a quarter-period after the other **lags** it by 90°. Voltage and current in a capacitor or inductor are shifted exactly like this, which is the whole subject of [[impedance]].

### Real edges take time
An ideal square wave jumps instantly; a real one has a **rise time** $t_r$, usually quoted from 10 % to 90 % of the step — nanoseconds for logic, microseconds for power switches. For a circuit that behaves like a single RC low-pass, the rise time and the −3 dB bandwidth are tied by $t_r \\approx 0.35/f_\\text{BW}$. It works both ways: a 100 MHz oscilloscope cannot show an edge faster than about 3.5 ns, and a signal with 1 ns edges needs hundreds of megahertz of bandwidth even if it repeats only once a millisecond.

> [!tip] Function generators often display the amplitude they would deliver into a 50 Ω load. Connected to a high-impedance scope input, the same setting shows **twice** the voltage — a classic first-day-in-the-lab puzzle.
`,
  ideas: [
    'Frequency is repeats per second, f = 1/T; angular frequency is ω = 2πf in radians per second.',
    'A sine is described by amplitude, frequency, phase and DC offset; peak-to-peak is twice the amplitude.',
    'The sine keeps its shape through any RLC circuit, which is why AC analysis is built on it.',
    'Duty cycle is the fraction of the period a pulse is high: D = t_on/T.',
    'A time shift Δt between two waves is a phase shift of 360° × Δt/T.'
  ],
  pitfalls: [
    'Frequency and angular frequency are the same number — ω = 2πf: 50 Hz is 314 rad/s. Mixing them up is an error of a factor 6.28.',
    'Amplitude means peak-to-peak — Amplitude is normally the peak, measured from the centre line; peak-to-peak is twice that for a symmetric wave. Generators and datasheets use either, so check which.',
    'A square wave switches instantly — Real edges take nanoseconds to microseconds, and the rise time, not the repetition rate, decides how much bandwidth the signal needs.'
  ],
  formulas: [
    {
      name: 'Frequency and period',
      expr: 'f = 1/T', tex: 'f = \\frac{1}{T}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz' },
        T: { name: 'period', q: 'time', unit: 'ms', value: 20 }
      },
      stories: { f: 'A signal repeats every {T}. What is its frequency?', T: 'A clock runs at {f}. How long is one period?' }
    },
    {
      name: 'Angular frequency',
      expr: 'w = 2*pi*f', tex: '\\omega = 2\\pi f',
      vars: {
        w: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 }
      },
      stories: { w: 'What is the angular frequency of a {f} supply?' }
    },
    {
      name: 'Phase difference from a time shift',
      expr: 'phi = 2*pi*dt/T', tex: '\\varphi = \\frac{\\Delta t}{T} \\times 360^{\\circ}',
      vars: {
        phi: { name: 'phase difference', q: 'angle', unit: '°', tex: '\\varphi' },
        dt: { name: 'time shift between the two waves', q: 'time', unit: 'ms', value: 2.5, tex: '\\Delta t' },
        T: { name: 'period', q: 'time', unit: 'ms', value: 20 }
      },
      note: 'Measure the shift between matching points, such as rising zero crossings, of two waves of the same frequency.',
      stories: { phi: 'On a scope, the current crosses zero {dt} after the voltage; the period is {T}. By how many degrees does the current lag?' }
    },
    {
      name: 'Duty cycle',
      expr: 'D = ton/T', tex: 'D = \\frac{t_{\\text{on}}}{T}',
      vars: {
        D: { name: 'duty cycle', q: 'ratio', unit: '%' },
        ton: { name: 'time high in each period', q: 'time', unit: 'µs', value: 12, tex: 't_{\\text{on}}' },
        T: { name: 'period', q: 'time', unit: 'µs', value: 50 }
      },
      stories: { D: 'A PWM signal is high for {ton} of every {T}. What is its duty cycle?' }
    },
    {
      name: 'Rise time and bandwidth',
      expr: 'tr = 0.35/B', tex: 't_r \\approx \\frac{0.35}{f_{\\text{BW}}}',
      vars: {
        tr: { name: '10–90 % rise time', q: 'time', unit: 'ns', tex: 't_r' },
        B: { name: '−3 dB bandwidth', q: 'frequency', unit: 'MHz', value: 100, tex: 'f_{\\text{BW}}' }
      },
      note: 'Exact for a single-pole (RC-like) response, where $t_r = 2.2\\tau$ and $f_\\text{BW} = 1/(2\\pi\\tau)$; a good estimate for oscilloscopes and amplifiers.',
      stories: { tr: 'What is the fastest rise time a {B} oscilloscope can display?', B: 'A logic signal has {tr} edges. Roughly what bandwidth must a scope have to show them?' }
    }
  ],
  examples: [
    {
      title: 'Reading a sine off the screen',
      q: 'A sine wave spans 4 divisions peak to peak at 2 V/div, and one full cycle covers 5 divisions at 0.2 ms/div. Find its amplitude, period, frequency and angular frequency.',
      steps: [
        'Peak-to-peak: $4 \\times 2\\ \\mathrm{V} = 8\\ \\mathrm{V}$, so the amplitude is $V_p = 4\\ \\mathrm{V}$.',
        'Period: $5 \\times 0.2\\ \\mathrm{ms} = 1\\ \\mathrm{ms}$.',
        '$f = 1/T = 1\\ \\mathrm{kHz}$ and $\\omega = 2\\pi f = 6283\\ \\mathrm{rad/s}$.'
      ],
      a: 'V_p = 4 V (8 V peak to peak), T = 1 ms, f = 1 kHz, ω ≈ 6280 rad/s.'
    },
    {
      title: 'Phase between voltage and current',
      q: 'A 50 Hz motor is measured with a two-channel scope. The current crosses zero going upwards 3.3 ms after the voltage does. What is the phase difference?',
      steps: [
        'The period at 50 Hz is 20 ms.',
        { text: 'The phase shift is the fraction of a period, times 360°:', tex: '\\varphi = \\frac{3.3}{20} \\times 360^{\\circ} = 59.4^{\\circ}' },
        'The current comes later, so it **lags** the voltage by about 59° — typical of an inductive load such as a lightly loaded motor.'
      ],
      a: 'The current lags the voltage by about 59°.'
    }
  ],
  quiz: [
    { q: 'What is the period of 60 Hz mains?', choices: ['60 ms', '16.7 ms', '20 ms', '6.0 ms'], a: 1,
      why: 'T = 1/f = 1/60 s = 16.7 ms. 20 ms is the period of 50 Hz mains.' },
    { q: 'Doubling the frequency of a sine wave halves its peak voltage.', a: false,
      why: 'Frequency and amplitude are independent. Doubling the frequency halves the period; the peak stays where it was.' },
    { q: 'Signal B reaches each peak a quarter of a period after signal A (same frequency). B…', choices: ['leads A by 90°', 'lags A by 90°', 'lags A by 25°', 'is in phase with A'], a: 1,
      why: 'Arriving later is lagging. A quarter period is a quarter of 360°, i.e. 90°.' },
    { q: 'What is the angular frequency of 400 Hz aircraft power?', answer: 2513, unit: 'rad/s',
      why: 'ω = 2πf = 2π × 400 ≈ 2513 rad/s.' },
    { q: 'A logic signal with 5 ns edges is viewed on a 20 MHz oscilloscope. The edges on the screen look about…', choices: ['5 ns', '18 ns', '0.5 ns', '1 µs'], a: 1,
      why: 'The scope alone has a rise time of about 0.35/20 MHz = 17.5 ns. Rise times combine roughly as the root of the sum of squares: √(5² + 17.5²) ≈ 18 ns. The scope, not the signal, dominates.' }
  ],
  applications: ['Mains supply at 50 or 60 Hz, and 400 Hz aircraft power.', 'Clock signals in every digital circuit.', 'PWM for motor speed, LED dimming and switching converters.', 'Test signals from function generators.'],
  sim: 'acf-waveforms'
},

{
  id: 'rms-values', parent: 'waveforms', title: 'Peak, average and RMS values', level: 1,
  short: 'The numbers that describe the size of an AC waveform — and why the root-mean-square value is the one that tells you how much heat and power it delivers.',
  keywords: ['RMS', 'root mean square', 'peak value', 'average value', 'rectified average', 'crest factor', 'form factor', 'true RMS', 'effective value', '230 V', '325 V', 'multimeter'],
  prereq: ['periodic-waveforms', 'power-energy', 'physics:alternating-current', 'math:average-value'],
  related: ['multimeter', 'ac-power', 'decibels', 'noise-snr', 'pwm'],
  body: `
A DC voltage has one obvious size. An AC voltage changes all the time, so which number should describe it? There are several, each for a purpose:

- the **peak** $V_p$ — what insulation, diodes and capacitors must withstand;
- the **peak-to-peak** $V_{pp}$ — what you read off an oscilloscope;
- the **average** — for a symmetric AC wave it is zero over a whole cycle, which tells you nothing about its strength (it is the DC component);
- the **rectified average** — the mean of $|v|$, which is what a simple meter actually measures;
- the **RMS** value — the one that counts for power.

### RMS: the heating value
The power in a resistor at each instant is $v^2/R$. Average that over a cycle and you get the power the resistor really dissipates. The **root-mean-square** voltage is the DC voltage that would heat the resistor equally:

$$V_\\text{rms} = \\sqrt{\\overline{v^2}}, \\qquad P = \\frac{V_\\text{rms}^2}{R} = I_\\text{rms}^2 R$$

The recipe is in the name, read backwards: **square** the waveform, take the **mean**, take the **root**. For a sine the mean of $\\sin^2$ is exactly one half, so

$$V_\\text{rms} = \\frac{V_p}{\\sqrt 2} \\approx 0.707\\,V_p$$

The 230 V of European mains is an RMS value: the peak is $230\\sqrt2 = 325\\ \\mathrm{V}$ and the peak-to-peak 650 V. The 120 V of American mains peaks at 170 V. A capacitor across the mains, or a rectifier's smoothing capacitor, must be rated for the peak.

### Other shapes
| Waveform (peak $A$) | Average | Rectified average | RMS | Crest factor |
|---|---|---|---|---|
| Sine | 0 | $0.637A$ | $0.707A$ | 1.41 |
| Square ±A | 0 | $A$ | $A$ | 1 |
| Triangle or sawtooth ±A | 0 | $0.5A$ | $0.577A$ | 1.73 |
| Half-wave rectified sine | $0.318A$ | $0.318A$ | $0.5A$ | 2 |
| Full-wave rectified sine | $0.637A$ | $0.637A$ | $0.707A$ | 1.41 |
| Pulse 0 to $A$, duty $D$ | $DA$ | $DA$ | $\\sqrt{D}\\,A$ | $1/\\sqrt D$ |

The **crest factor** (peak/RMS) says how spiky a wave is; the current drawn by a rectifier with a big smoothing capacitor can reach 3 to 5, which matters for fuses, transformers and meters.

### DC plus AC
A DC level with an AC signal on top has
$$V_\\text{rms}^2 = V_\\text{DC}^2 + V_\\text{ac,rms}^2$$
because the cross term averages to zero. The same holds for any mix of different frequencies: their **powers** add, so their RMS values add in quadrature.

### What your meter shows
A cheap meter on its AC range rectifies the signal, measures the rectified average, and multiplies by 1.111 — the ratio that is correct **for a sine**. On anything else it is wrong: +11 % on a square wave, −4 % on a triangle, and badly low on the peaky current of a switch-mode supply. A **true-RMS** meter computes the RMS itself. The [[multimeter]] page has more.

> [!warn] For a PWM signal the average and the RMS are different, and the difference matters: a heater driven at 25 % duty from 12 V sees 3 V average but 6 V RMS — and the power follows the RMS.
`,
  ideas: [
    'RMS is the DC voltage that would deliver the same average power into a resistor.',
    'Square, take the mean, take the root: V_rms = √(mean of v²).',
    'For a sine only, V_rms = V_p/√2 ≈ 0.707 V_p; mains 230 V RMS peaks at 325 V.',
    'DC and AC parts (and different frequencies) add in quadrature: V_rms² = V_DC² + V_ac²',
    'Averaging meters are calibrated for sines; true-RMS meters are needed for anything else.'
  ],
  pitfalls: [
    'The average of an AC voltage tells you its strength — A symmetric AC wave averages to zero over a cycle; the heating and power depend on the RMS value.',
    'V_rms = 0.707 V_peak for any waveform — Only for a sine. A square wave\'s RMS equals its peak; a triangle\'s is 0.577 of it; a narrow pulse train\'s can be far below its peak.',
    'Every multimeter reads RMS — Most inexpensive meters rectify, average and scale for a sine. On distorted waveforms they can be wrong by tens of per cent; look for "true RMS".'
  ],
  derivation: {
    title: 'Why a sine\'s RMS is its peak over √2',
    steps: [
      { text: 'Square the sine and use the identity $\\sin^2 x = \\tfrac12(1 - \\cos 2x)$:', tex: 'v^2 = V_p^2 \\sin^2 \\omega t = \\frac{V_p^2}{2}\\left(1 - \\cos 2\\omega t\\right)' },
      { text: 'Over a whole period the cosine term averages to zero, leaving the constant:', tex: '\\overline{v^2} = \\frac{V_p^2}{2}' },
      { text: 'Take the square root:', tex: 'V_\\text{rms} = \\sqrt{\\overline{v^2}} = \\frac{V_p}{\\sqrt{2}}' }
    ]
  },
  formulas: [
    {
      name: 'RMS value of a sine',
      expr: 'Vrms = Vp/sqrt(2)', tex: 'V_{\\text{rms}} = \\frac{V_p}{\\sqrt{2}}',
      vars: {
        Vrms: { name: 'RMS voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{rms}}' },
        Vp: { name: 'peak voltage', q: 'voltage', unit: 'V', value: 325, tex: 'V_p' }
      },
      note: 'Only for a pure sine. Other shapes have other factors (see the table).',
      stories: { Vp: 'A sinusoidal supply is rated {Vrms} RMS. What is its peak voltage?', Vrms: 'A sine wave peaks at {Vp}. What is its RMS value?' }
    },
    {
      name: 'Average power in a resistor',
      expr: 'P = Vrms^2/R', tex: 'P = \\frac{V_{\\text{rms}}^2}{R}',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W' },
        Vrms: { name: 'RMS voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_{\\text{rms}}' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 23 }
      },
      stories: { P: 'A heating element of {R} is connected to {Vrms} mains. What power does it draw?', R: 'A {P} kettle runs from {Vrms}. What is the resistance of its element when hot?' }
    },
    {
      name: 'RMS of DC plus AC',
      expr: 'Vrms = sqrt(Vdc^2 + Vac^2)', tex: 'V_{\\text{rms}} = \\sqrt{V_{\\text{DC}}^2 + V_{\\text{ac}}^2}',
      vars: {
        Vrms: { name: 'total RMS voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{rms}}' },
        Vdc: { name: 'DC component (the average)', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{DC}}' },
        Vac: { name: 'RMS of the AC component', q: 'voltage', unit: 'V', value: 0.5, tex: 'V_{\\text{ac}}' }
      },
      stories: { Vrms: 'A 12 V supply of {Vdc} carries {Vac} RMS of ripple. What is the total RMS voltage?' }
    },
    {
      name: 'RMS of a pulse train',
      expr: 'Vrms = Vp*sqrt(D)', tex: 'V_{\\text{rms}} = V_p\\sqrt{D}',
      vars: {
        Vrms: { name: 'RMS voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{rms}}' },
        Vp: { name: 'pulse height', q: 'voltage', unit: 'V', value: 12, tex: 'V_p' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 }
      },
      note: 'For pulses between 0 and $V_p$. The average is $D V_p$, which is smaller than the RMS whenever $D < 1$.',
      stories: { Vrms: 'A heater is driven by {Vp} PWM at a duty cycle of {D}. What RMS voltage does it see?' }
    }
  ],
  examples: [
    {
      title: 'A kettle on the mains',
      q: 'A 2.3 kW kettle runs from 230 V, 50 Hz mains. Find the element\'s resistance, the RMS and peak currents, and the peak voltage.',
      steps: [
        'Resistance from the power: $R = V_\\text{rms}^2/P = 230^2/2300 = 23\\ \\Omega$.',
        'RMS current: $I_\\text{rms} = 230/23 = 10\\ \\mathrm{A}$.',
        'Peaks: $I_p = 10\\sqrt2 = 14.1\\ \\mathrm{A}$ and $V_p = 230\\sqrt2 = 325\\ \\mathrm{V}$.'
      ],
      a: '23 Ω; 10 A RMS (14.1 A peak); 325 V peak.'
    },
    {
      title: 'A PWM-driven heater',
      q: 'A 4 Ω heater pad is switched from 12 V at 25 % duty cycle. What power does it dissipate? What answer would the average voltage wrongly give?',
      steps: [
        'Fully on, the pad takes $12^2/4 = 36\\ \\mathrm{W}$. For a quarter of the time: 9 W average.',
        'Via the RMS: $V_\\text{rms} = 12\\sqrt{0.25} = 6\\ \\mathrm{V}$, and $6^2/4 = 9\\ \\mathrm{W}$ — the same.',
        'The average voltage is $0.25 \\times 12 = 3\\ \\mathrm{V}$, and $3^2/4 = 2.25\\ \\mathrm{W}$: four times too small.'
      ],
      a: '9 W. Using the 3 V average would give 2.25 W, which is wrong.'
    },
    {
      title: 'An averaging meter on a square wave',
      q: 'A ±5 V square wave is measured with an averaging (non-true-RMS) meter. What does it read, and what is the true RMS?',
      steps: [
        'The rectified average of a ±5 V square wave is 5 V (|v| is always 5 V).',
        'The meter multiplies by the sine\'s form factor 1.111: it reads 5.55 V.',
        'The true RMS is 5 V, so the meter reads 11 % high.'
      ],
      a: 'The meter shows 5.55 V; the true RMS is 5.00 V.'
    }
  ],
  quiz: [
    { q: 'European mains is 230 V RMS. What is its peak voltage?', choices: ['230 V', '163 V', '325 V', '460 V'], a: 2,
      why: 'V_p = √2 × 230 ≈ 325 V. 163 V would be dividing instead of multiplying; 460 V is not related.' },
    { q: 'A ±10 V square wave and a sine of 10 V peak drive identical resistors. The square wave delivers…', choices: ['the same power', 'twice the power', '1.41 times the power', 'half the power'], a: 1,
      why: 'The square wave\'s RMS is 10 V, the sine\'s 7.07 V. Power goes as V²: (10/7.07)² = 2.' },
    { q: 'A signal is 3 V DC with 4 V RMS of AC on top. What is its total RMS value?', answer: 5, unit: 'V',
      why: 'DC and AC add in quadrature: √(3² + 4²) = 5 V.' },
    { q: 'An averaging (non-true-RMS) meter reads the RMS of a triangle wave correctly.', a: false,
      why: 'It measures the rectified average (0.5 of the peak) and scales it by 1.111, giving 0.555 of the peak; the true RMS is 0.577 of the peak, so it reads about 4 % low.' },
    { q: 'A 0–10 V pulse train at 50 % duty drives a resistor. Which value decides how hot it gets?', choices: ['The average, 5 V', 'The RMS, 7.07 V', 'The peak, 10 V', 'The peak-to-peak, 10 V'], a: 1,
      why: 'Heating goes with the mean of v², i.e. the RMS: 10√0.5 = 7.07 V. The resistor gets half of its full-on power, not a quarter.' }
  ],
  applications: ['Voltage ratings of mains equipment: RMS for power, peak for insulation and capacitors.', 'Sizing fuses, wires and transformers by RMS current.', 'Audio amplifier power ratings into a loudspeaker.', 'Choosing a true-RMS meter for PWM, inverter and switch-mode supply work.'],
  sim: 'acf-waveforms'
},

{
  id: 'decibels', parent: 'waveforms', title: 'Decibels', level: 2,
  short: 'A logarithmic way to express ratios of power, voltage or current — so that gains in a chain add instead of multiply, and a range from microvolts to kilovolts fits in a few numbers.',
  keywords: ['decibel', 'dB', 'dBm', 'dBV', 'dBu', 'gain', 'attenuation', 'logarithm', 'power ratio', 'voltage ratio', '−3 dB', '6 dB per doubling', '20 log', '10 log', 'link budget'],
  prereq: ['math:logarithms', 'power-energy', 'rms-values'],
  related: ['bode-plots', 'noise-snr', 'transfer-function', 'physics:sound-intensity', 'math:logarithmic-scales'],
  body: `
Electronics deals in ratios that span enormous ranges: a radio receiver amplifies microvolts to volts, a filter cuts interference by a factor of a million, an op-amp has a gain of 100 000. And gains in a chain **multiply**. Logarithms turn multiplication into addition and squeeze the range into manageable numbers — that is all a decibel is.

### The definition
The decibel is defined for a ratio of **powers**:

$$G_\\text{dB} = 10 \\log_{10} \\frac{P_2}{P_1}$$

Since power goes as voltage squared ($P = V^2/R$) in the same resistance, a ratio of **voltages** (or currents) is

$$G_\\text{dB} = 20 \\log_{10} \\frac{V_2}{V_1}$$

The same 20 dB means a power ratio of 100 **and** a voltage ratio of 10 — it is one ratio seen two ways. Engineers use the 20-log form for voltage gain even when the input and output impedances differ; then it is a voltage gain in dB, not a power gain.

### Numbers worth knowing by heart
| dB | Power ratio | Voltage ratio |
|---|---|---|
| +3 | 2 | 1.41 |
| +6 | 4 | 2 |
| +10 | 10 | 3.16 |
| +20 | 100 | 10 |
| +40 | 10 000 | 100 |
| −3 | 0.5 | 0.707 |
| −20 | 0.01 | 0.1 |

With these you can do most dB arithmetic in your head: 26 dB is 20 + 6, a voltage gain of 10 × 2 = 20. The **−3 dB** point — half the power, 70.7 % of the voltage — is where filter corners and amplifier bandwidths are measured ([[bode-plots]]).

### Chains add
A receiver front end: an antenna signal passes a +20 dB low-noise amplifier, a cable losing 3 dB, a mixer losing 7 dB and a +40 dB IF amplifier. The total is $20 - 3 - 7 + 40 = 50\\ \\mathrm{dB}$ — no multiplication needed.

### Absolute levels
Put a fixed reference in the denominator and dB describes a **level**, not a ratio:

- **dBm**: relative to 1 mW. 0 dBm = 1 mW, +30 dBm = 1 W, −90 dBm = 1 pW. In a 50 Ω system 0 dBm is 0.224 V RMS. The language of RF.
- **dBV**: relative to 1 V RMS; **dBu**: relative to 0.775 V RMS (1 mW in 600 Ω, from telephone lines). Professional audio line level is +4 dBu (1.23 V RMS); consumer line level is −10 dBV (0.316 V).
- **dBµV**: relative to 1 µV, used in EMC limits. **dBc**: relative to a carrier, for spurs and harmonics.

Ratios in dB add to levels in dB: a −90 dBm signal through 50 dB of gain comes out at −40 dBm. But two levels do **not** add as numbers — two uncorrelated 0 dBm signals together make +3 dBm, because their powers add.

> [!tip] Sound levels in dB SPL work the same way (reference 20 µPa, 20 log for pressure) — see [[physics:sound-intensity|sound intensity]].
`,
  ideas: [
    'Decibels express a ratio logarithmically: 10 log for powers, 20 log for voltages or currents.',
    '+3 dB doubles the power; +6 dB doubles the voltage; +20 dB is ten times the voltage.',
    '−3 dB is half power and 70.7 % of the voltage — the edge of a bandwidth.',
    'Gains and losses in a chain add in dB.',
    'dBm, dBV and dBu are absolute levels: dB relative to 1 mW, 1 V and 0.775 V.'
  ],
  pitfalls: [
    '10 log and 20 log are interchangeable — Use 10 log for power ratios and 20 log for voltage or current ratios; mixing them doubles or halves every answer.',
    'Any dB values can be added — Gains in dB add to each other and to a level. Two absolute levels do not: two uncorrelated 0 dBm signals make 3 dBm, not 0 dBm.',
    'A negative dB value means something is wrong — It is just a ratio below one: an attenuator, a cable loss or a filter\'s stop band.'
  ],
  derivation: {
    title: 'From a power ratio to a voltage ratio',
    steps: [
      { text: 'Both powers are measured in the same resistance $R$:', tex: 'P_1 = \\frac{V_1^2}{R}, \\qquad P_2 = \\frac{V_2^2}{R}' },
      { text: 'The resistance cancels in the ratio:', tex: '10\\log_{10}\\frac{P_2}{P_1} = 10\\log_{10}\\left(\\frac{V_2}{V_1}\\right)^2' },
      { text: 'A log of a square is twice the log:', tex: '= 20\\log_{10}\\frac{V_2}{V_1}' }
    ]
  },
  formulas: [
    {
      name: 'Power ratio in decibels',
      expr: 'G = 10*log(P2/P1)', tex: 'G = 10\\log_{10}\\frac{P_2}{P_1}',
      vars: {
        G: { name: 'gain', q: 'gain', unit: 'dB', signed: true },
        P2: { name: 'output power', q: 'power', unit: 'W', value: 5, tex: 'P_2' },
        P1: { name: 'input power', q: 'power', unit: 'mW', value: 50, tex: 'P_1' }
      },
      stories: { G: 'An amplifier turns {P1} into {P2}. What is its power gain in dB?', P2: 'An amplifier with {G} of power gain is fed {P1}. What is the output power?' }
    },
    {
      name: 'Voltage ratio in decibels',
      expr: 'G = 20*log(V2/V1)', tex: 'G = 20\\log_{10}\\frac{V_2}{V_1}',
      vars: {
        G: { name: 'voltage gain', q: 'gain', unit: 'dB', signed: true },
        V2: { name: 'output voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_2' },
        V1: { name: 'input voltage', q: 'voltage', unit: 'mV', value: 50, tex: 'V_1' }
      },
      stories: { G: 'A preamplifier turns {V1} into {V2}. What is its voltage gain in dB?', V1: 'A {G} amplifier must deliver {V2}. What input voltage does it need?' }
    },
    {
      name: 'Power level in dBm',
      expr: 'L = 10*log(P/P0)', tex: 'L_{\\text{dBm}} = 10\\log_{10}\\frac{P}{P_0}',
      vars: {
        L: { name: 'level in dBm', q: 'gain', unit: 'dB', signed: true, tex: 'L_{\\text{dBm}}' },
        P: { name: 'power', q: 'power', unit: 'W', value: 2 },
        P0: { name: 'reference power, 1 mW', q: 'power', unit: 'mW', value: 1, fixed: true, tex: 'P_0' }
      },
      stories: { L: 'A transmitter delivers {P}. What is that in dBm?', P: 'A signal generator is set to {L} (dBm). What power is that?' }
    },
    {
      name: 'RMS voltage of a dBm level',
      expr: 'V = sqrt(P0*10^(L/10)*R)', tex: 'V = \\sqrt{R\\, P_0\\, 10^{L_{\\text{dBm}}/10}}',
      vars: {
        V: { name: 'RMS voltage', q: 'voltage', unit: 'mV' },
        L: { name: 'level in dBm', q: 'gain', unit: 'dB', value: 0, signed: true, tex: 'L_{\\text{dBm}}' },
        R: { name: 'system impedance', q: 'resistance', unit: 'Ω', value: 50 },
        P0: { name: 'reference power, 1 mW', q: 'power', unit: 'mW', value: 1, fixed: true, tex: 'P_0' }
      },
      note: 'RF systems are 50 Ω (75 Ω for video and cable TV); old audio lines were 600 Ω.',
      stories: { V: 'A spectrum analyser shows {L} (dBm) in a {R} system. What RMS voltage is that?' }
    }
  ],
  examples: [
    {
      title: 'A receiver link budget',
      q: 'An antenna delivers −90 dBm. It passes an LNA (+20 dB), a cable (−3 dB), a mixer (−7 dB) and an IF amplifier (+40 dB). What is the output level in dBm, in watts, and in volts RMS across 50 Ω?',
      steps: [
        'Add the gains to the level: $-90 + 20 - 3 - 7 + 40 = -40\\ \\mathrm{dBm}$.',
        '$P = 1\\ \\mathrm{mW} \\times 10^{-40/10} = 10^{-7}\\ \\mathrm{W} = 100\\ \\mathrm{nW}$.',
        '$V = \\sqrt{PR} = \\sqrt{10^{-7} \\times 50} = 2.24\\ \\mathrm{mV}$ RMS.'
      ],
      a: '−40 dBm = 100 nW = 2.24 mV RMS in 50 Ω.'
    },
    {
      title: 'Voltage gain is not power gain',
      q: 'An audio amplifier turns 50 mV across its 10 kΩ input into 5 V across an 8 Ω loudspeaker. Find its voltage gain and its power gain in dB.',
      steps: [
        'Voltage gain: $20\\log_{10}(5/0.05) = 20\\log_{10}100 = 40\\ \\mathrm{dB}$.',
        'Input power: $0.05^2/10^4 = 0.25\\ \\mu\\mathrm{W}$. Output power: $5^2/8 = 3.13\\ \\mathrm{W}$.',
        'Power gain: $10\\log_{10}(3.13/0.25 \\times 10^{-6}) = 10\\log_{10}(1.25 \\times 10^7) = 71\\ \\mathrm{dB}$.',
        'The two differ because the impedances differ. Both are legitimate; say which one you mean.'
      ],
      a: 'Voltage gain 40 dB; power gain 71 dB.'
    }
  ],
  quiz: [
    { q: 'A voltage gain of 1000 is…', choices: ['30 dB', '60 dB', '100 dB', '1000 dB'], a: 1,
      why: '20 log₁₀ 1000 = 20 × 3 = 60 dB. 30 dB would be the 10-log (power) reading of the same number.' },
    { q: 'An amplifier\'s output power doubles. Its output level rises by about…', choices: ['2 dB', '3 dB', '6 dB', '10 dB'], a: 1,
      why: '10 log₁₀ 2 = 3.01 dB. A doubled voltage would be 6 dB.' },
    { q: 'What RMS voltage is 0 dBm in a 50 Ω system?', answer: 0.224, unit: 'V',
      why: 'V = √(PR) = √(0.001 × 50) = 0.224 V.' },
    { q: 'Two uncorrelated noise sources of −80 dBm each are combined. The total is…', choices: ['−160 dBm', '−80 dBm', '−77 dBm', '−40 dBm'], a: 2,
      why: 'Their powers add: twice the power is +3 dB, so −77 dBm. Adding the dB numbers (−160) is meaningless for levels.' },
    { q: 'A −20 dB attenuator reduces the voltage to one tenth and the power to one hundredth.', a: true,
      why: 'For voltage, 20 log(0.1) = −20 dB; for power, 10 log(0.01) = −20 dB. Same ratio, two views.' }
  ],
  applications: ['RF link budgets and receiver sensitivity (dBm).', 'Audio levels on mixing desks (dBu, dBV) and loudspeaker sensitivity.', 'Filter and amplifier specifications: −3 dB bandwidth, stop-band attenuation, op-amp open-loop gain of 100 dB.', 'EMC emission limits in dBµV.'],
  sim: { id: 'acf-spectrum', params: { db: true, n: 15 } }
},

{
  id: 'spectrum-harmonics', parent: 'waveforms', title: 'Spectrum and harmonics', level: 2,
  short: 'Any repeating waveform is a sum of sine waves at whole multiples of its frequency; the list of their sizes is its spectrum — the key to filters, distortion and interference.',
  keywords: ['Fourier series', 'harmonics', 'fundamental', 'spectrum', 'line spectrum', 'frequency domain', 'THD', 'total harmonic distortion', 'Gibbs phenomenon', 'odd harmonics', 'spectrum analyser', 'FFT', 'EMC', 'rise time'],
  prereq: ['periodic-waveforms', 'rms-values', 'math:fourier-series'],
  related: ['decibels', 'noise-snr', 'rc-low-pass', 'filter-order', 'sampling-nyquist', 'physics:harmonics-timbre', 'three-phase'],
  body: `
Play the same note on a flute and a violin: same pitch, different sound. The difference is in the **harmonics** — sine waves at 2, 3, 4… times the note's frequency, mixed in different proportions. Electrical waveforms are no different. Fourier's theorem says that **any** periodic signal of frequency $f_1$ is a sum of a DC part and sines at $f_1, 2f_1, 3f_1, \\dots$, each with its own amplitude and phase ([[math:fourier-series|Fourier series]]). The first is the **fundamental**; the rest are harmonics. Their amplitudes plotted against frequency form the **spectrum** — a picture of the signal in the *frequency domain*, which a spectrum analyser (or the FFT function of a scope) shows directly.

### Three spectra to know
A square wave of peak $A$:
$$v(t) = \\frac{4A}{\\pi}\\left(\\sin \\omega t + \\frac{\\sin 3\\omega t}{3} + \\frac{\\sin 5\\omega t}{5} + \\cdots\\right)$$
Only **odd** harmonics, falling as $1/n$ (−20 dB per decade). The fundamental is $4/\\pi = 1.27$ times taller than the square wave itself, and carries 81 % of its power.

A **triangle** also has only odd harmonics, but they fall as $1/n^2$ (−40 dB per decade) — three terms already look convincing. A **sawtooth** has every harmonic, falling as $1/n$. A **pulse train** of duty cycle $D$ has harmonics under a $\\sin(n\\pi D)/n$ envelope, so at 25 % duty every fourth harmonic vanishes.

The pattern: **jumps** give $1/n$, **corners** give $1/n^2$, smooth curves fall faster still. How fast the spectrum falls is decided by the sharpest feature of the wave.

### Why an engineer cares
- **Filters act on spectra.** A linear circuit treats each harmonic separately ([[superposition]]): a [[rc-low-pass|low-pass filter]] that removes the high harmonics of a square wave rounds its edges — the RC charging curve on a scope *is* a spectrum with its top cut off.
- **Edges need bandwidth.** A logic signal's spectrum falls at −20 dB/decade up to about $1/(\\pi t_r)$ and at −40 dB/decade beyond. A 10 MHz clock with 1 ns edges has strong harmonics to 300 MHz, and radiates there. Slowing the edges (a series resistor of 22–47 Ω at the driver) is a standard cure for EMC problems.
- **Distortion creates harmonics.** Feed a pure sine to an amplifier; anything at $2f$, $3f$… in the output was added by the amplifier. **Total harmonic distortion** is
$$\\text{THD} = \\frac{\\sqrt{V_2^2 + V_3^2 + V_4^2 + \\cdots}}{V_1}$$
with RMS (or peak) values of each harmonic. Hi-fi amplifiers manage below 0.01 %; a square wave is 48 % THD.
- **Mains harmonics.** Rectifier-capacitor loads draw current in short peaks, rich in the 3rd (150 Hz), 5th and 7th. In a [[three-phase]] system the 3rd harmonics of the three phases add in the neutral instead of cancelling.

### The Gibbs overshoot
Add up more and more harmonics of a square wave and the sum gets closer everywhere — except that next to each jump it overshoots by about **9 % of the jump**, however many terms you take; the ripples only crowd closer to the edge. Real band-limited systems (a sharp filter, a steep anti-aliasing filter) ring on edges the same way.
`,
  ideas: [
    'Every periodic signal is a sum of sines at whole multiples of its fundamental frequency.',
    'A square wave has odd harmonics falling as 1/n; a triangle, odd harmonics falling as 1/n².',
    'Jumps give a 1/n spectrum, corners 1/n²: the sharpest feature sets the bandwidth.',
    'Linear circuits act on each harmonic separately, so filtering is shaping a spectrum.',
    'THD is the RMS of all the harmonics divided by the fundamental.'
  ],
  pitfalls: [
    'Harmonics are faults added by bad circuits — Every non-sinusoidal waveform is made of harmonics; a perfect square wave has them by definition. Distortion is harmonics a circuit adds that were not in its input.',
    'Adding more harmonics removes the overshoot at a jump — The ripples crowd towards the edge but the overshoot stays near 9 % of the jump (the Gibbs phenomenon).',
    'A signal\'s bandwidth is set by how often it repeats — It is set by its edges: a 1 kHz square wave with 10 ns edges has significant content up to tens of megahertz.'
  ],
  derivation: {
    title: 'The harmonics of a square wave',
    intro: 'Take a square wave of height $\\pm A$, with $\\theta = \\omega t$: $+A$ for $0 < \\theta < \\pi$ and $-A$ for $\\pi < \\theta < 2\\pi$. It is an odd function, so only sine terms appear.',
    steps: [
      { text: 'The Fourier sine coefficient is an average of the wave times $\\sin n\\theta$:', tex: 'b_n = \\frac{1}{\\pi}\\int_0^{2\\pi} v(\\theta)\\sin n\\theta\\, d\\theta = \\frac{A}{\\pi}\\left[\\int_0^{\\pi}\\sin n\\theta\\, d\\theta - \\int_{\\pi}^{2\\pi}\\sin n\\theta\\, d\\theta\\right]' },
      { text: 'Both integrals give the same size:', tex: 'b_n = \\frac{A}{\\pi}\\cdot\\frac{2\\left(1 - \\cos n\\pi\\right)}{n}' },
      { text: 'Since $\\cos n\\pi = (-1)^n$, even harmonics vanish and odd ones remain:', tex: 'b_n = \\begin{cases} \\dfrac{4A}{n\\pi} & n \\text{ odd} \\\\ 0 & n \\text{ even} \\end{cases}' }
    ]
  },
  formulas: [
    {
      name: 'Harmonic amplitude of a square wave',
      expr: 'Vn = 4*A/(n*pi)', tex: 'V_n = \\frac{4A}{n\\pi}',
      vars: {
        Vn: { name: 'peak amplitude of harmonic n', q: 'voltage', unit: 'V', tex: 'V_n' },
        A: { name: 'square-wave peak (±A)', q: 'voltage', unit: 'V', value: 5 },
        n: { name: 'harmonic number (odd)', int: true, value: 3 }
      },
      note: 'Odd $n$ only; the even harmonics of a symmetric square wave are zero.',
      stories: { Vn: 'A ±{A} square wave is analysed. What is the peak amplitude of harmonic {n}?' }
    },
    {
      name: 'Total harmonic distortion (two harmonics)',
      expr: 'THD = sqrt(V2^2 + V3^2)/V1', tex: '\\text{THD} = \\frac{\\sqrt{V_2^2 + V_3^2}}{V_1}',
      vars: {
        THD: { name: 'total harmonic distortion', q: 'ratio', unit: '%', tex: '\\text{THD}' },
        V1: { name: 'fundamental', q: 'voltage', unit: 'V', value: 2, tex: 'V_1' },
        V2: { name: 'second harmonic', q: 'voltage', unit: 'mV', value: 20, tex: 'V_2' },
        V3: { name: 'third harmonic', q: 'voltage', unit: 'mV', value: 60, tex: 'V_3' }
      },
      note: 'Add further harmonics under the root the same way; usually the first few dominate.',
      stories: { THD: 'An amplifier fed a pure sine puts out {V1} at the fundamental, {V2} of second and {V3} of third harmonic. What is its THD?' }
    },
    {
      name: 'Spectral knee of a digital edge',
      expr: 'fk = 1/(pi*tr)', tex: 'f_k = \\frac{1}{\\pi t_r}',
      vars: {
        fk: { name: 'frequency where the spectrum turns to −40 dB/decade', q: 'frequency', unit: 'MHz', tex: 'f_k' },
        tr: { name: 'rise time', q: 'time', unit: 'ns', value: 1, tex: 't_r' }
      },
      note: 'Above $f_k$ the harmonics of a trapezoidal wave fall at −40 dB/decade instead of −20. It is where EMC trouble from fast logic concentrates.',
      stories: { fk: 'A clock signal has {tr} edges. Up to about what frequency is its spectrum still strong?' }
    }
  ],
  examples: [
    {
      title: 'The spectrum of a 1 kHz square wave',
      q: 'A ±5 V square wave at 1 kHz. Find the peak amplitudes of the fundamental, 3rd and 5th harmonics, their levels relative to the fundamental, and the share of the total power in the fundamental.',
      steps: [
        'Fundamental: $4 \\times 5/\\pi = 6.37\\ \\mathrm{V}$ peak at 1 kHz.',
        '3rd: $6.37/3 = 2.12\\ \\mathrm{V}$ at 3 kHz ($20\\log_{10}\\tfrac13 = -9.5\\ \\mathrm{dB}$). 5th: $1.27\\ \\mathrm{V}$ at 5 kHz (−14 dB).',
        'The fundamental\'s RMS is $6.37/\\sqrt2 = 4.50\\ \\mathrm{V}$; the square wave\'s RMS is 5 V.',
        'Power share: $(4.50/5)^2 = 0.81$ — 81 % in the fundamental, 19 % in all the harmonics together.'
      ],
      a: '6.37 V, 2.12 V (−9.5 dB), 1.27 V (−14 dB); the fundamental carries 81 % of the power.'
    },
    {
      title: 'Distortion of an amplifier',
      q: 'An amplifier driven with a pure 1 kHz sine delivers 2 V at 1 kHz, 20 mV at 2 kHz and 60 mV at 3 kHz. What is its THD, in per cent and in dB?',
      steps: [
        '$\\sqrt{0.02^2 + 0.06^2} = 0.0632\\ \\mathrm{V}$ of harmonics.',
        '$\\text{THD} = 0.0632/2 = 3.16\\ \\%$.',
        'In dB: $20\\log_{10}0.0316 = -30\\ \\mathrm{dB}$ relative to the fundamental.'
      ],
      a: 'THD = 3.2 %, or −30 dB.'
    }
  ],
  quiz: [
    { q: 'Which harmonics does a symmetric square wave contain?', choices: ['All of them', 'Only the odd ones', 'Only the even ones', 'None: it is a single frequency'], a: 1,
      why: 'Its half-wave symmetry cancels every even harmonic; the odd ones fall as 1/n.' },
    { q: 'Why do a triangle wave\'s harmonics fall faster (1/n²) than a square wave\'s (1/n)?', choices: ['It has a lower amplitude', 'It has corners but no jumps', 'It is not periodic', 'It contains a DC component'], a: 1,
      why: 'The smoothness of a waveform sets how fast its spectrum falls: a jump gives 1/n, a corner (a jump in slope) 1/n².' },
    { q: 'Slowing down the edges of a digital signal reduces the interference it radiates at high frequencies.', a: true,
      why: 'The spectrum turns to −40 dB/decade above about 1/(πt_r): longer rise times move that knee down and cut the high harmonics.' },
    { q: 'A pulse train has a 25 % duty cycle. Which is the lowest harmonic missing from its spectrum?', choices: ['2nd', '3rd', '4th', '5th'], a: 2,
      why: 'The amplitudes follow |sin(nπD)|/n; with D = 0.25 that is zero when n is a multiple of 4.' },
    { q: 'A square wave is low-pass filtered so that only its fundamental and 3rd harmonic pass. On the scope you see…', choices: ['a perfect square wave', 'a pure sine', 'a rounded wave with a dip in each flat top', 'a triangle wave'], a: 2,
      why: 'The sum sin ωt + (1/3) sin 3ωt already has flattened tops with a small dip in the middle — the first stage of the Fourier sum.' }
  ],
  applications: ['Spectrum analysers and the FFT function of oscilloscopes.', 'EMC design: edge rates, harmonics of clocks and switching converters.', 'Distortion specifications of amplifiers and power quality on the mains.', 'Synthesisers and the timbre of musical instruments.'],
  sim: 'acf-spectrum'
},

{
  id: 'noise-snr', parent: 'waveforms', title: 'Noise and signal-to-noise ratio', level: 2,
  short: 'The random voltages every circuit adds — thermal, shot and 1/f noise — how they add up, how bandwidth sets their size, and how far a signal must stand above them.',
  keywords: ['noise', 'thermal noise', 'Johnson noise', 'shot noise', 'flicker noise', '1/f noise', 'SNR', 'signal-to-noise ratio', 'noise bandwidth', 'kTB', 'noise density', 'nV/√Hz', 'averaging', 'interference', 'hum'],
  prereq: ['rms-values', 'decibels', 'spectrum-harmonics'],
  related: ['physics:equipartition', 'math:normal-distribution', 'rc-low-pass', 'adc', 'sensor-interfacing', 'decoupling'],
  body: `
Turn an audio amplifier up with nothing connected and you hear a hiss. Look at a sensitive sensor signal on a scope and the trace is fuzzy. That randomness is **noise**: fluctuations nobody can predict, only describe statistically — by their RMS value and by how they spread across frequency. It is different from **interference** (50 Hz hum, switching spikes, radio pick-up), which is deterministic and can in principle be removed by shielding, layout, grounding and filtering. Noise sets the ultimate floor.

### Thermal (Johnson–Nyquist) noise
Every resistance above absolute zero generates a noise voltage, because its electrons jiggle thermally:

$$V_n = \\sqrt{4 k_B T R B}$$

where $B$ is the bandwidth you measure over. It is **white**: the same in every hertz. A 1 kΩ resistor at room temperature makes 4 nV per root hertz ($\\mathrm{nV}/\\sqrt{\\mathrm{Hz}}$); over the 20 kHz audio band that is 0.58 µV RMS. A 1 MΩ resistor makes 129 nV/√Hz — which is why low-level front ends avoid large resistances. The noise power available from any resistor is $k_B T B$: −174 dBm in each hertz at room temperature, the number every radio designer starts from.

### Shot noise and 1/f noise
Current is made of discrete electrons crossing a barrier at random moments, so a DC current $I$ carries **shot noise** $I_n = \\sqrt{2 q I B}$ — 18 pA/√Hz for 1 mA. It matters in photodiodes, diodes and transistors. **Flicker** or **1/f noise** grows at low frequencies; below its corner (from a few hertz to a few kilohertz for op-amps) it dominates, which makes precise DC measurement hard. Chopper and auto-zero amplifiers exist to beat it.

### Density, bandwidth and filtering
Datasheets give noise as a **density** in nV/√Hz. The RMS noise is the density times the square root of the bandwidth. So bandwidth is the designer's main lever: cut it from 100 kHz to 1 kHz and white noise falls tenfold. Measure only as fast as you need. (A single [[rc-low-pass|RC low-pass]] has an effective noise bandwidth of $\\tfrac{\\pi}{2}f_c$, a little more than its corner.)

### Adding noise sources
Independent noise sources add in **quadrature** — their powers add:
$$V_\\text{total} = \\sqrt{V_1^2 + V_2^2 + \\cdots}$$
So the biggest source dominates: a source one-third the size of another adds only 5 % to the total. Find the largest contributor and fix that one.

### Signal-to-noise ratio
$$\\text{SNR} = \\frac{P_\\text{signal}}{P_\\text{noise}}, \\qquad \\text{SNR}_\\text{dB} = 20\\log_{10}\\frac{V_\\text{signal}}{V_\\text{noise}}\\ \\text{(RMS values)}$$

Rough targets: a readable voice radio link needs about 10 dB, FM broadcast 50 dB, CD audio reaches 96 dB, and an ideal $N$-bit [[adc|ADC]] $6.02N + 1.76\\ \\mathrm{dB}$. For a repetitive signal, averaging $N$ sweeps improves the SNR by $\\sqrt N$ in voltage (10 log N dB), because the signal adds coherently and the noise does not.

> [!tip] On a scope, random noise looks about **six times** larger peak-to-peak than its RMS value (a Gaussian exceeds ±3.3σ only 0.1 % of the time). Divide a peak-to-peak reading by 6 to estimate the RMS.
`,
  ideas: [
    'Noise is random and described by its RMS value and spectrum; interference is deterministic and can be removed.',
    'Thermal noise V_n = √(4k_BTRB): every resistance makes it, more for larger R, higher T and wider bandwidth.',
    'RMS noise = density × √bandwidth, so limiting bandwidth is the first way to reduce it.',
    'Independent noise sources add in quadrature; the largest dominates.',
    'SNR in dB is 20 log of the RMS voltage ratio; averaging N sweeps gains √N.'
  ],
  pitfalls: [
    'Noise voltages add like ordinary voltages — Independent noise sources add in quadrature: 3 µV and 4 µV of noise make 5 µV, not 7 µV.',
    'Good design removes noise — Thermal noise is physics: every resistance above absolute zero makes it. Design chooses resistances, gain and bandwidth so that it stays below what matters.',
    'A scope\'s peak-to-peak noise reading is the RMS noise — For random noise the peak-to-peak value is roughly six times the RMS.'
  ],
  formulas: [
    {
      name: 'Thermal (Johnson) noise of a resistor',
      expr: 'Vn = sqrt(4*kB*T*R*B)', tex: 'V_n = \\sqrt{4 k_B T R B}',
      vars: {
        Vn: { name: 'RMS noise voltage', q: 'voltage', unit: 'µV', tex: 'V_n' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        B: { name: 'bandwidth', q: 'frequency', unit: 'kHz', value: 20 }
      },
      stories: { Vn: 'What RMS noise voltage does a {R} resistor at {T} produce over a {B} bandwidth?', R: 'A front end must keep resistor noise below {Vn} over {B} at {T}. What is the largest resistance allowed?' }
    },
    {
      name: 'Shot noise of a current',
      expr: 'In = sqrt(2*qe*I*B)', tex: 'I_n = \\sqrt{2 q_e I B}',
      vars: {
        In: { name: 'RMS noise current', q: 'current', unit: 'nA', tex: 'I_n' },
        qe: { const: 'qe' },
        I: { name: 'DC current', q: 'current', unit: 'mA', value: 1 },
        B: { name: 'bandwidth', q: 'frequency', unit: 'kHz', value: 10 }
      },
      stories: { In: 'A photodiode carries {I} of photocurrent. What shot noise does it have over {B}?' }
    },
    {
      name: 'Signal-to-noise ratio',
      expr: 'SNR = 20*log(Vs/Vn)', tex: '\\text{SNR} = 20\\log_{10}\\frac{V_s}{V_n}',
      vars: {
        SNR: { name: 'signal-to-noise ratio', q: 'gain', unit: 'dB', signed: true, tex: '\\text{SNR}' },
        Vs: { name: 'RMS signal', q: 'voltage', unit: 'mV', value: 1, tex: 'V_s' },
        Vn: { name: 'RMS noise', q: 'voltage', unit: 'µV', value: 2, tex: 'V_n' }
      },
      stories: { SNR: 'A microphone delivers {Vs} RMS against {Vn} RMS of noise. What is the SNR?', Vn: 'A system needs an SNR of {SNR} with {Vs} of signal. How much noise can it tolerate?' }
    },
    {
      name: 'Adding independent noise sources',
      expr: 'Vt = sqrt(V1^2 + V2^2)', tex: 'V_{\\text{total}} = \\sqrt{V_1^2 + V_2^2}',
      vars: {
        Vt: { name: 'total RMS noise', q: 'voltage', unit: 'µV', tex: 'V_{\\text{total}}' },
        V1: { name: 'first source', q: 'voltage', unit: 'µV', value: 3, tex: 'V_1' },
        V2: { name: 'second source', q: 'voltage', unit: 'µV', value: 4, tex: 'V_2' }
      },
      stories: { Vt: 'An amplifier contributes {V1} of noise and its source resistor {V2}. What is the total?' }
    }
  ],
  examples: [
    {
      title: 'The noise floor of a sensor',
      q: 'A sensor with a 10 kΩ source resistance delivers 1 mV RMS of audio-band signal. How much thermal noise does its resistance add over 20 kHz at 300 K, and what is the best possible SNR?',
      steps: [
        { text: 'Thermal noise:', tex: 'V_n = \\sqrt{4 \\times 1.38\\times10^{-23} \\times 300 \\times 10^4 \\times 2\\times10^4} = 1.82\\ \\mu\\mathrm{V}' },
        'SNR: $20\\log_{10}(1000/1.82) = 54.8\\ \\mathrm{dB}$ — before the amplifier has added any noise of its own.',
        'On a scope that noise would look like about $6 \\times 1.82 \\approx 11\\ \\mu\\mathrm{V}$ peak to peak.'
      ],
      a: '1.8 µV RMS of noise; at best about 55 dB SNR.'
    },
    {
      title: 'Which noise source matters?',
      q: 'An op-amp with 10 nV/√Hz input noise amplifies a sensor with a 1 kΩ source resistance (4 nV/√Hz). What is the total input noise density, and what would a 100 kΩ source (40.7 nV/√Hz) give?',
      steps: [
        'With 1 kΩ: $\\sqrt{10^2 + 4^2} = 10.8\\ \\mathrm{nV}/\\sqrt{\\mathrm{Hz}}$. The resistor adds only 8 %; the op-amp dominates.',
        'With 100 kΩ: $\\sqrt{10^2 + 40.7^2} = 41.9\\ \\mathrm{nV}/\\sqrt{\\mathrm{Hz}}$. Now the resistor dominates, and a quieter op-amp would hardly help.',
        'Lesson: compare the contributions before spending money on the smallest one.'
      ],
      a: '10.8 nV/√Hz (op-amp dominated) and 41.9 nV/√Hz (source dominated).'
    }
  ],
  quiz: [
    { q: 'Doubling the measurement bandwidth multiplies the thermal noise voltage by…', choices: ['2', '√2 ≈ 1.41', '4', '1: it is independent of bandwidth'], a: 1,
      why: 'Noise power is proportional to bandwidth, so the RMS voltage goes as √B: ×1.41, or +3 dB.' },
    { q: 'Two independent noise sources of 3 µV and 4 µV RMS act together. What is the total RMS noise?', answer: 5, unit: 'µV',
      why: 'Independent noise adds in quadrature: √(3² + 4²) = 5 µV.' },
    { q: 'Cooling a resistor from 300 K to 75 K halves its thermal noise voltage.', a: true,
      why: 'V_n ∝ √T, and √(75/300) = √0.25 = 0.5. Cooled front ends in radio astronomy use exactly this.' },
    { q: 'A steady 50 Hz hum on a sensor signal is best described as…', choices: ['thermal noise', 'shot noise', 'interference from the mains', '1/f noise'], a: 2,
      why: 'It is deterministic and at a known frequency — interference, cured by grounding, shielding and layout rather than by bandwidth or averaging tricks.' },
    { q: 'A thermocouple is read once a second. Which change reduces the noise most without touching the sensor?', choices: ['A wider-bandwidth amplifier', 'Filtering the signal to a few hertz', 'A larger feedback resistor', 'Higher supply voltage'], a: 1,
      why: 'White noise goes as √bandwidth. A signal that changes once a second needs a few hertz, not the tens of kilohertz an amplifier offers.' }
  ],
  applications: ['Radio receiver sensitivity, which starts from −174 dBm/Hz.', 'Audio preamplifiers and microphone inputs.', 'Sensor front ends: strain gauges, thermocouples, photodiodes.', 'ADC resolution: whether the last bits are signal or noise.']
}

);
