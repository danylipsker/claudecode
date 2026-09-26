/* HYPER-ELECTRONICS · content/mixed-signal.js — between analogue and digital: sampling
 * and aliasing, ADCs, DACs, serial buses and microcontrollers. */
Hyper.add(

{
  id: 'sampling-nyquist', parent: 'mixed-signal', title: 'Sampling and the Nyquist theorem', level: 2,
  short: 'A signal measured at regular instants is fully captured only if it contains nothing at or above half the sampling rate; anything higher folds down and masquerades as a lower frequency — aliasing.',
  keywords: ['sampling', 'sample rate', 'Nyquist', 'Nyquist frequency', 'Shannon', 'aliasing', 'anti-alias filter', 'folding', 'oversampling', 'sample and hold', 'aperture jitter', 'undersampling', 'reconstruction'],
  prereq: ['periodic-waveforms', 'spectrum-harmonics', 'math:fourier-series'],
  related: ['adc', 'dac', 'rc-low-pass', 'filter-order', 'oscilloscope'],
  body: `
An ADC does not watch a signal continuously; it takes **samples**, one every $T_s = 1/f_s$ seconds, and knows nothing about what happens in between. The surprising result that makes digital audio, digital control and digital oscilloscopes possible is that, under one condition, nothing is lost.

### The sampling theorem
If a signal contains no frequency components at or above $f_s/2$ — the **Nyquist frequency** — its samples determine it completely, and an ideal low-pass filter can rebuild the original waveform exactly from them. Intuitively, a sine sampled more than twice per cycle leaves only one sine below $f_s/2$ that passes through all the dots. CD audio samples at 44.1 kHz to cover hearing up to 20 kHz; telephone speech, band-limited to 3.4 kHz, is sampled at 8 kHz.

### Aliasing
Break the condition and the samples lie. A component at frequency $f$ produces exactly the same samples as one at $|f - k f_s|$ for any whole $k$. Everything above $f_s/2$ **folds** back into the range 0 to $f_s/2$:

$$f_{\\text{alias}} = |f - k f_s|, \\qquad k = \\text{the whole number nearest } f/f_s$$

Sample a 9 kHz tone at 10 kHz and you get a flawless-looking 1 kHz tone. The wagon wheels turning backwards in a film are the same effect (24 frames a second sampling the spokes). Once aliased, a component is indistinguishable from a genuine signal at the alias frequency: **no processing afterwards can remove it**. The simulation shows this — push the signal past $f_s/2$ and even the reconstruction filter confidently draws the wrong sine.

### The anti-alias filter
So everything above $f_s/2$ must be removed *before* sampling, by an analogue low-pass filter — the **anti-alias filter**. Real filters roll off gradually, about $20n$ dB per decade for an $n$-th-order filter ([[filter-order]]), so they need room between the highest wanted frequency $f_b$ and the frequency $f_s - f_b$ that would alias onto it. That is why practical systems sample at 2.5 to 10 times the highest frequency of interest rather than at twice it, and why **oversampling** — sampling much faster than needed, then filtering and decimating digitally — is so popular: it lets a simple RC filter do the analogue job. For a slow sensor read by a microcontroller, one RC low-pass at the ADC pin, with its corner well below $f_s/2$, is often all that is needed.

### Sample and hold, and jitter
Converters take time, so the input is frozen by a **sample-and-hold** circuit — a switch and a capacitor — at the sampling instant. That instant must be precise: if it wobbles by $t_j$ (clock **jitter**), a signal changing at up to $2\\pi f A$ volts per second is sampled with an error that grows with frequency, limiting the signal-to-noise ratio to $-20\\log_{10}(2\\pi f t_j)$. For audio this is easy; digitising 100 MHz with 70 dB of SNR needs jitter below about half a picosecond.

### Aliasing in everyday engineering
- A digital oscilloscope on too slow a timebase can show a stable, entirely false low-frequency waveform ([[oscilloscope]]).
- Sampling a motor current at an arbitrary moment catches random points on the PWM ripple; sampling synchronously at the centre of the PWM period gives the average cleanly — a deliberate use of sampling.
- Radio receivers deliberately **undersample** a narrow band around a high carrier, letting it alias down to a convenient frequency.
`,
  ideas: [
    'A signal with nothing at or above f_s/2 is completely determined by its samples.',
    'A component at f appears at |f − k·f_s|: frequencies above f_s/2 fold back into the band.',
    'Aliasing cannot be undone after sampling; filter in the analogue domain first.',
    'Real anti-alias filters need room: sample at 2.5–10 times the highest wanted frequency, or oversample.',
    'Sampling-clock jitter limits SNR at high signal frequencies.'
  ],
  pitfalls: [
    'Twice the highest frequency is enough in practice — At exactly 2× a sine can be sampled at its zero crossings, and real filters need a transition band. Sample well above.',
    'A digital filter after the ADC removes aliases — Once folded, an alias is indistinguishable from a real signal at that frequency; only filtering before sampling prevents it.',
    'Only high-frequency signals alias — Any component above f_s/2 folds down: switching noise, PWM ripple, harmonics of slow signals.'
  ],
  formulas: [
    {
      name: 'Nyquist frequency',
      expr: 'fN = fs/2', tex: 'f_N = \\frac{f_s}{2}',
      vars: {
        fN: { name: 'highest frequency sampled without aliasing', q: 'frequency', unit: 'kHz', tex: 'f_N' },
        fs: { name: 'sampling rate', q: 'frequency', unit: 'kHz', value: 44.1, tex: 'f_s' }
      },
      stories: { fN: 'A signal is sampled at {fs}. Above what frequency will components alias?', fs: 'A system must capture signals up to {fN} without aliasing. What is the absolute minimum sampling rate?' }
    },
    {
      name: 'Attenuation of an anti-alias filter well above its corner',
      expr: 'A = 20*n*log(fa/fc)', tex: 'A = 20\\,n\\,\\log_{10}\\frac{f_a}{f_c}',
      vars: {
        A: { name: 'attenuation', q: 'gain', unit: 'dB' },
        n: { name: 'filter order', q: 'count', value: 4, int: true },
        fa: { name: 'frequency that would alias into the band (f_s − f_b)', q: 'frequency', unit: 'kHz', value: 9, tex: 'f_a' },
        fc: { name: 'filter corner frequency', q: 'frequency', unit: 'kHz', value: 1, tex: 'f_c' }
      },
      note: 'The asymptote of a Butterworth filter, valid well above the corner. Compare the result with the ADC\'s dynamic range, 6.02N + 1.76 dB.',
      practice: { unknowns: ['A', 'fc'] },
      stories: { A: 'A {n}th-order low-pass filter has its corner at {fc}. How much does it attenuate an interferer at {fa}?' }
    },
    {
      name: 'SNR limit set by sampling jitter',
      expr: 'SNR = -20*log(2*pi*f*tj)', tex: '\\text{SNR} = -20\\log_{10}(2\\pi f\\,t_j)',
      vars: {
        SNR: { name: 'best achievable signal-to-noise ratio', q: 'gain', unit: 'dB', tex: '\\text{SNR}' },
        f: { name: 'signal frequency', q: 'frequency', unit: 'MHz', value: 1 },
        tj: { name: 'RMS jitter of the sampling clock', q: 'time', unit: 'ps', value: 10, tex: 't_j' }
      },
      stories: { SNR: 'A {f} sine is sampled with a clock having {tj} of RMS jitter. What SNR can the system reach at best?', tj: 'To sample a {f} signal with an SNR of {SNR}, how small must the clock jitter be?' }
    }
  ],
  examples: [
    {
      title: 'Where does the tone go?',
      q: 'Tones at 3 kHz, 7 kHz and 12 kHz are sampled at 10 kHz. At what frequencies do they appear?',
      steps: [
        '3 kHz is below the Nyquist frequency of 5 kHz: it appears correctly at 3 kHz.',
        '7 kHz: nearest multiple of 10 kHz is 10 kHz, so it appears at $|7 - 10| = 3\\ \\mathrm{kHz}$ — on top of the genuine 3 kHz tone.',
        '12 kHz: nearest multiple is 10 kHz, so it appears at $|12 - 10| = 2\\ \\mathrm{kHz}$.'
      ],
      a: '3 kHz, 3 kHz (alias) and 2 kHz (alias).'
    },
    {
      title: 'Is a fourth-order filter enough?',
      q: 'A 12-bit ADC (dynamic range about 74 dB) samples a sensor band up to 1 kHz. Compare sampling at 10 kHz and at 5 kHz with a fourth-order Butterworth anti-alias filter whose corner is at 1 kHz.',
      steps: [
        'At 10 kHz the first frequency to alias onto the top of the band is $10 - 1 = 9\\ \\mathrm{kHz}$: $A = 80\\log_{10} 9 = 76\\ \\mathrm{dB}$ — more than 74 dB. Enough.',
        'At 5 kHz it is $5 - 1 = 4\\ \\mathrm{kHz}$: $A = 80\\log_{10} 4 = 48\\ \\mathrm{dB}$. Interference there would alias at well above the 1-LSB level.',
        'To keep 5 kHz sampling you would need about a seventh-order filter ($140\\log_{10}4 = 84$ dB); sampling faster is cheaper.'
      ],
      a: 'Fine at 10 kHz (76 dB); not at 5 kHz (48 dB).'
    },
    {
      title: 'Jitter for hi-fi audio',
      q: 'How much clock jitter can a converter tolerate while keeping 98 dB of SNR for a 20 kHz full-scale tone?',
      steps: [
        '$2\\pi f t_j = 10^{-98/20} = 1.26\\times10^{-5}$.',
        '$t_j = 1.26\\times10^{-5} / (2\\pi \\times 20\\,000) = 1.0\\times10^{-10}\\ \\mathrm{s}$.'
      ],
      a: 'About 100 ps RMS.'
    }
  ],
  quiz: [
    { q: 'A 7 kHz tone sampled at 10 kHz appears as…', choices: ['7 kHz', '3 kHz', '17 kHz', 'it disappears'], a: 1,
      why: '7 kHz is above the 5 kHz Nyquist frequency and folds to |7 − 10| = 3 kHz.' },
    { q: 'Aliasing can be removed afterwards with a digital filter.', a: false,
      why: 'After sampling, an alias is a perfectly valid-looking signal at its new frequency; there is nothing left to tell it apart. Filter before the ADC.' },
    { q: 'Why do practical systems sample at 2.5–10 times the highest frequency of interest rather than just over twice it?', choices: ['ADCs are more accurate at high rates', 'Real anti-alias filters need a transition band to roll off in', 'The Nyquist theorem requires it', 'To reduce quantisation error'], a: 1,
      why: 'Between the top of the wanted band and f_s − f_b the filter must fall by the ADC\'s dynamic range; that needs room, or a very steep filter.' },
    { q: 'The anti-alias filter belongs…', choices: ['after the ADC, in software', 'before the ADC, in the analogue domain', 'on the ADC\'s reference pin', 'in the DAC'], a: 1,
      why: 'It has to remove high frequencies before the sampling folds them down.' },
    { q: 'A 50 Hz mains waveform is sampled at exactly 50 Hz. The samples show…', choices: ['a 50 Hz sine', 'a 25 Hz sine', 'a constant value', 'random noise'], a: 2,
      why: 'Every sample falls at the same point of the cycle: the alias frequency is |50 − 50| = 0 Hz.' }
  ],
  applications: ['Choosing sampling rates and anti-alias filters for data acquisition.', 'Digital audio (44.1 and 48 kHz) and telephony (8 kHz).', 'Motor-current sampling synchronised to PWM.', 'Recognising false waveforms on a digital oscilloscope.'],
  history: 'Harry Nyquist (1928) and Claude Shannon (1949) put the result on a firm footing; Vladimir Kotelnikov and Edmund Whittaker found it independently.',
  sim: [{ id: 'dig-adc', params: { f: 9000, recon: true }, title: 'Aliasing: 9 kHz sampled at 10 kHz' }]
},

{
  id: 'adc', parent: 'mixed-signal', title: 'Analogue-to-digital converters', level: 2,
  short: 'An ADC turns a voltage into a number relative to a reference. Its resolution sets the step size and the ideal noise floor; its architecture — SAR, delta-sigma, flash — sets the speed; the reference and the input circuit set how good the numbers really are.',
  keywords: ['ADC', 'analogue-to-digital', 'resolution', 'LSB', 'quantisation', 'quantisation noise', 'SNR', 'ENOB', 'SINAD', 'SAR', 'successive approximation', 'delta-sigma', 'flash ADC', 'reference voltage', 'ADS1115', 'HX711', 'INL', 'DNL', 'ratiometric', 'oversampling'],
  prereq: ['sampling-nyquist', 'binary-numbers', 'noise-snr'],
  related: ['dac', 'sensor-interfacing', 'microcontrollers', 'multiplexers', 'comparators'],
  body: `
An **analogue-to-digital converter** compares an input voltage with a **reference** voltage and reports the ratio as an $N$-bit number:

$$D = \\frac{V_{in}}{V_{ref}}\\,2^N \\quad\\text{(rounded to a whole code)}$$

The step between codes, one **LSB**, is $V_{ref}/2^N$: 3.22 mV for the 10-bit converter of an ATmega328P on 3.3 V, 0.81 mV for the 12-bit ADC of an STM32, 7.8 µV for an ADS1115 on its ±0.256 V range.

### Quantisation and the ideal SNR
Rounding to the nearest code leaves an error of up to ±½ LSB. For a busy signal that error behaves like noise spread evenly over ±½ LSB, with an RMS value of $\\text{LSB}/\\sqrt{12}$. A full-scale sine then has a signal-to-noise ratio of

$$\\text{SNR} = 6.02\\,N + 1.76\\ \\mathrm{dB}$$

— each extra bit halves the step and adds 6 dB: 62 dB for 10 bits, 74 dB for 12, 98 dB for 16. A real converter adds its own noise and distortion; its measured SINAD gives the **effective number of bits**, $\\text{ENOB} = (\\text{SINAD} - 1.76)/6.02$, usually one to three bits fewer than the nominal resolution.

### Resolution is not accuracy
The number of bits says how finely the converter divides its range; it says nothing about how true the answer is. **Offset** and **gain** errors shift and stretch the transfer curve; **INL** (integral non-linearity) bends it; **DNL** (differential non-linearity) makes some steps wider than others, and a DNL worse than −1 LSB means missing codes. Above all, every reading is relative to the reference: an ATmega's internal 1.1 V reference may be anywhere from 1.0 to 1.2 V until calibrated, and a USB 5 V rail used as reference wanders by several percent. For sensors that are themselves powered from the reference — potentiometers, bridges, thermistor dividers — this cancels: the measurement is **ratiometric**, and the supply drops out.

### Architectures
| Type | How it works | Typical | Where |
|---|---|---|---|
| SAR | binary search with a DAC and a comparator, one bit per clock | 10–18 bits, kS/s to a few MS/s | inside microcontrollers |
| Delta-sigma | 1-bit modulator oversampled many times, then a digital filter | 16–24 bits, a few S/s to kS/s | ADS1115, HX711 for load cells, audio |
| Flash | $2^N - 1$ comparators in parallel | 6–8 bits, GS/s | oscilloscopes, radar |
| Dual-slope | integrates the input, then de-integrates against the reference | slow, very linear, rejects mains hum | multimeters |

The **successive-approximation** (SAR) converter is the one you meet most. It tries the MSB first (is the input above half the reference?), keeps or clears it, then tries the next bit — $N$ comparisons for $N$ bits. An STM32 converts 12 bits in about 1 µs; an ATmega328P in about 100 µs.

### Driving the input
A SAR input is not a high-impedance voltmeter. At each conversion it connects a **sampling capacitor** (about 14 pF in an ATmega328P) to the pin, which must charge through the source's resistance to within ½ LSB in the sampling time — that takes about $(N+1)\\ln 2$ time constants. With a high source impedance the reading comes out low, or remembers the previous channel ([[multiplexers]]). The remedies: keep the source below the datasheet's limit (10 kΩ for the ATmega328P), lengthen the sampling time, put a capacitor of a few nanofarads to 100 nF right at the pin to act as a charge reservoir, or buffer the signal with an op-amp. The capacitor also forms the anti-alias filter with the source resistance ([[sampling-nyquist]]).

### Squeezing out more
If the signal carries at least an LSB or so of noise, **averaging** helps: averaging $4^k$ samples gains $k$ bits (16 readings of a 10-bit ADC give about 12 bits), at the cost of rate. That is exactly what a delta-sigma converter does internally, on a grand scale.
`,
  ideas: [
    'The code is the input as a fraction of the reference, times 2ᴺ; one LSB is V_ref/2ᴺ.',
    'Quantisation error is ±½ LSB, RMS LSB/√12; the ideal SNR is 6.02N + 1.76 dB.',
    'Resolution is not accuracy: offset, gain, non-linearity, noise and the reference limit what the bits mean.',
    'SAR converters in microcontrollers; delta-sigma for high resolution at low speed; flash for extreme speed.',
    'A SAR input charges a sampling capacitor: keep the source impedance low or add a capacitor or buffer.'
  ],
  pitfalls: [
    'More bits means more accuracy — Resolution is not accuracy: the reference, offset, gain error and noise decide what the bits are worth.',
    'The ADC input behaves like a high-impedance voltmeter — A SAR input charges a sample capacitor at every conversion; a high source impedance leaves it short of the final value.',
    'The supply rail is a good enough reference — It varies by percent with load and USB cable; use a proper reference or a ratiometric measurement.'
  ],
  formulas: [
    {
      name: 'Size of one step (LSB)',
      expr: 'LSB = Vref/2^N', tex: '\\text{LSB} = \\frac{V_{\\text{ref}}}{2^{N}}',
      vars: {
        LSB: { name: 'voltage of one code step', q: 'voltage', unit: 'mV', tex: '\\text{LSB}' },
        Vref: { name: 'reference voltage (full scale)', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{ref}}' },
        N: { name: 'resolution', q: 'count', value: 12, int: true }
      },
      practice: { unknowns: ['LSB', 'Vref'] },
      stories: { LSB: 'What voltage does one step of a {N}-bit ADC with a {Vref} reference represent?' }
    },
    {
      name: 'Output code for an input voltage',
      expr: 'D = Vin/Vref*2^N', tex: 'D = \\frac{V_{\\text{in}}}{V_{\\text{ref}}}\\,2^{N}',
      vars: {
        D: { name: 'output code (before rounding)', q: 'count' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 1.2, tex: 'V_{\\text{in}}' },
        Vref: { name: 'reference voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{ref}}' },
        N: { name: 'resolution', q: 'count', value: 12, int: true }
      },
      note: 'The converter reports a whole code (rounded or truncated, depending on the design). Solving for $V_{in}$ turns a reading back into volts.',
      practice: { unknowns: ['D', 'Vin'] },
      stories: { D: 'A {N}-bit ADC with a {Vref} reference measures {Vin}. What code does it report (before rounding)?', Vin: 'A {N}-bit ADC with a {Vref} reference reads {D}. What is the input voltage?' }
    },
    {
      name: 'Ideal signal-to-noise ratio',
      expr: 'SNR = 6.02*N + 1.76', tex: '\\text{SNR} = 6.02\\,N + 1.76\\ \\mathrm{dB}',
      vars: {
        SNR: { name: 'SNR for a full-scale sine', q: 'gain', unit: 'dB', tex: '\\text{SNR}' },
        N: { name: 'resolution', q: 'count', value: 12, int: true }
      },
      practice: { unknowns: ['SNR'] },
      stories: { SNR: 'What is the best possible SNR of an ideal {N}-bit converter for a full-scale sine?' }
    },
    {
      name: 'Effective number of bits',
      expr: 'ENOB = (SINAD - 1.76)/6.02', tex: '\\text{ENOB} = \\frac{\\text{SINAD} - 1.76}{6.02}',
      vars: {
        ENOB: { name: 'effective number of bits', q: 'count', tex: '\\text{ENOB}' },
        SINAD: { name: 'measured signal to noise and distortion', q: 'gain', unit: 'dB', value: 68, tex: '\\text{SINAD}' }
      },
      stories: { ENOB: 'A 12-bit ADC measures a SINAD of {SINAD}. How many bits is it really worth?' }
    }
  ],
  derivation: {
    title: 'Where 6.02N + 1.76 dB comes from',
    steps: [
      { text: 'A full-scale sine spans $2^N$ steps, so its amplitude is $2^{N-1}$ LSB and its RMS value is:', tex: 'V_{\\text{signal}} = \\frac{2^{N-1}\\,\\text{LSB}}{\\sqrt{2}}' },
      { text: 'The rounding error is spread evenly between $-\\tfrac12$ and $+\\tfrac12$ LSB; the RMS of a uniform distribution of width LSB is:', tex: 'V_{\\text{noise}} = \\frac{\\text{LSB}}{\\sqrt{12}}' },
      { text: 'Their ratio:', tex: '\\frac{V_{\\text{signal}}}{V_{\\text{noise}}} = 2^{N-1}\\sqrt{\\frac{12}{2}} = 2^{N}\\sqrt{\\tfrac{3}{2}}' },
      { text: 'In decibels, $20\\log_{10} 2 = 6.02$ and $20\\log_{10}\\sqrt{1.5} = 1.76$:', tex: '\\text{SNR} = 20\\log_{10}\\left(2^{N}\\sqrt{1.5}\\right) = 6.02\\,N + 1.76\\ \\mathrm{dB}' }
    ]
  },
  examples: [
    {
      title: 'Choosing a reference for a temperature sensor',
      q: 'An LM35 gives 10 mV/°C and must read 0–100 °C on an ATmega328P\'s 10-bit ADC. Compare the 5 V supply as reference with the internal 1.1 V reference.',
      steps: [
        'With 5 V: LSB = $5/1024 = 4.88\\ \\mathrm{mV}$, i.e. 0.49 °C per step, and any drift of the USB supply shows up as a temperature error.',
        'With 1.1 V: LSB = $1.1/1024 = 1.07\\ \\mathrm{mV}$, i.e. 0.11 °C per step; full scale is 110 °C, just covering the range.',
        'The internal reference is not precise (1.0–1.2 V between chips) but it is stable: calibrate it once against a known temperature or voltage.'
      ],
      a: 'The 1.1 V reference gives 0.11 °C steps against 0.49 °C, and does not follow the supply.'
    },
    {
      title: 'How many bits are real?',
      q: 'A 12-bit ADC is tested with a pure sine and shows a SINAD of 68 dB. What is its ENOB, and what does that mean?',
      steps: [
        '$\\text{ENOB} = (68 - 1.76)/6.02 = 11.0$ bits.',
        'The ideal 12-bit SNR is 74 dB; this converter loses 6 dB, one bit, to its own noise and distortion.',
        'Averaging four readings would win that bit back — if the error is noise rather than distortion.'
      ],
      a: 'About 11 effective bits.'
    }
  ],
  quiz: [
    { q: 'What is one LSB of a 12-bit ADC with a 3.3 V reference?', answer: 0.806, unit: 'mV',
      why: '3.3 V / 4096 = 0.806 mV.' },
    { q: 'Each extra bit of resolution improves the ideal SNR by about…', choices: ['1 dB', '3 dB', '6 dB', '20 dB'], a: 2,
      why: 'One more bit halves the step and the quantisation noise: 20 log₁₀ 2 = 6.02 dB.' },
    { q: 'Which ADC architecture is almost always the one built into a microcontroller?', choices: ['Flash', 'Successive approximation (SAR)', 'Dual-slope', 'Delta-sigma'], a: 1,
      why: 'SAR converters give 10–12 bits at up to a few MS/s from a compact, low-power circuit — the right compromise for a general-purpose chip.' },
    { q: 'A 16-bit ADC gives measurements accurate to 1 part in 65 536.', a: false,
      why: 'That is its resolution. Accuracy depends on the reference, offset, gain error, non-linearity and noise, and is often several times worse.' },
    { q: 'An MCU reads a potentiometer through 100 kΩ of source resistance and the readings are low and jumpy. The best simple fix is…', choices: ['a higher reference voltage', 'a capacitor of a few nanofarads to 100 nF from the pin to ground', 'a faster ADC clock', 'a series resistor'], a: 1,
      why: 'The capacitor holds the voltage while the sampling capacitor draws its charge, so the ADC sees a low source impedance; the reading then settles between conversions.' }
  ],
  applications: ['Reading sensors with a microcontroller: temperature, pressure, current, position.', 'Weighing with load cells and a 24-bit delta-sigma converter (HX711).', 'Precision measurement over I²C with an ADS1115 and its programmable gain.', 'Digital audio, oscilloscopes and software-defined radio.'],
  sim: 'dig-adc'
},

{
  id: 'dac', parent: 'mixed-signal', title: 'Digital-to-analogue converters', level: 2,
  short: 'A DAC turns a number into a voltage, a fraction of a reference. It is built from resistor ladders or strings, or faked with filtered PWM, and its staircase output needs a reconstruction filter.',
  keywords: ['DAC', 'digital-to-analogue', 'R-2R ladder', 'binary-weighted', 'string DAC', 'PWM DAC', 'reconstruction filter', 'zero-order hold', 'settling time', 'glitch', 'monotonic', 'MCP4725', 'resolution'],
  prereq: ['adc', 'voltage-divider', 'binary-numbers'],
  related: ['pwm', 'rc-low-pass', 'sampling-nyquist', 'voltage-follower'],
  body: `
A **digital-to-analogue converter** is the reverse of an [[adc|ADC]]: it takes an $N$-bit code $D$ and produces a voltage (or current) proportional to it,

$$V_{out} = V_{ref}\\,\\frac{D}{2^N}$$

so the steps are $V_{ref}/2^N$ and the top code gives one LSB less than the reference. Microcontroller projects use them to set a motor driver's current limit, generate a test waveform, trim a bias, or play sound.

### Weighted resistors and the R-2R ladder
The obvious design sums currents through resistors weighted R, 2R, 4R, 8R … one per bit — but for 12 bits that needs ratios of 2048 matched to 0.01 %, which is impractical. The **R-2R ladder** needs only two values. Each bit switches its 2R leg between the reference and ground; looking into any node of the ladder towards the least significant end you always see a resistance of 2R in parallel with 2R, so each step along the ladder halves the contribution of the bit before. Only the ratio of R to 2R must be accurate, which is easy on a chip or with a resistor array. A ladder's output resistance is R whatever the code, so it usually needs a [[voltage-follower|buffer]].

A **string DAC** simply taps a chain of $2^N$ equal resistors with switches. It is automatically **monotonic** — a higher code can never give a lower voltage — and common in small DACs. The **MCP4725** is a typical part: 12 bits, an I²C interface, EEPROM to remember its setting at power-up, a buffered rail-to-rail output, with its supply as reference. Some microcontrollers include DACs (the high-density STM32F1 parts have two 12-bit ones); the ATmega328P has none.

### PWM as a DAC
A pin switched with duty cycle $d$ has an average of $d\\,V_{DD}$ ([[pwm]]). Pass it through an RC low-pass filter and the average remains while most of the switching is removed — a DAC made of one resistor and one capacitor. The catch is a trade-off: the residual ripple is about

$$\\Delta V \\approx \\frac{V\\,d(1-d)}{f_{PWM}\\,RC}$$

(worst at 50 % duty), while the filter also slows every change of output by the time constant $RC$. With Arduino's 490 Hz PWM, low ripple needs a time constant of a quarter of a second; raising the PWM frequency to tens of kilohertz, or using a two-pole filter, relaxes it a hundredfold. The timer's bits set the resolution.

### The staircase and its filter
A DAC holds each value until the next — a **zero-order hold** — so the output is a staircase. Its steps contain energy at and around multiples of the update rate (*images*), which a **reconstruction filter** removes, leaving the smooth waveform the samples represent. The simulation shows the staircase and the filtered result. The hold also droops the response slightly towards $f_s/2$, which audio DACs compensate digitally.

### What else the datasheet tells you
- **Settling time**: how long after a code change the output is within ½ LSB — microseconds for general-purpose parts.
- **Glitch energy**: at a major carry (0111 1111 → 1000 0000) all bits switch at slightly different moments, and the output spikes briefly towards a wrong value.
- **DNL and INL**, as for ADCs; DNL better than −1 LSB guarantees monotonicity, which matters inside control loops.
- **Output drive**: few DACs can drive more than a few milliamps or a large capacitance without a buffer.
`,
  ideas: [
    'V_out = V_ref·D/2ᴺ; the top code is one LSB below the reference.',
    'The R-2R ladder needs only two resistor values, so it can be accurate at many bits.',
    'Filtered PWM is a DAC: ripple ≈ V·d(1 − d)/(f·RC), traded against response time RC.',
    'A DAC outputs a staircase; a reconstruction filter removes the steps.',
    'Settling time, glitches, monotonicity and output drive matter as much as resolution.'
  ],
  pitfalls: [
    'A DAC output can drive any load — Many DAC outputs (an R-2R ladder in particular) have kilohms of output resistance; buffer them with an op-amp.',
    'A DAC\'s full-scale output equals its reference — The top code gives V_ref(1 − 2⁻ᴺ), one LSB short.',
    'Filtered PWM is as good as a real DAC — Heavy filtering makes it slow to respond; light filtering leaves ripple.'
  ],
  formulas: [
    {
      name: 'DAC output voltage',
      expr: 'Vout = Vref*D/2^N', tex: 'V_{\\text{out}} = V_{\\text{ref}}\\,\\frac{D}{2^{N}}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vref: { name: 'reference voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{ref}}' },
        D: { name: 'input code', q: 'count', value: 2048 },
        N: { name: 'resolution', q: 'count', value: 12, int: true }
      },
      practice: { unknowns: ['Vout', 'D'] },
      stories: { Vout: 'A {N}-bit DAC with a {Vref} reference receives the code {D}. What does it output?', D: 'Which code makes a {N}-bit DAC with a {Vref} reference output {Vout} (round to a whole code)?' }
    },
    {
      name: 'Ripple of a PWM output after an RC filter',
      expr: 'dV = V*d*(1 - d)/(f*R*C)', tex: '\\Delta V = \\frac{V\\,d\\,(1-d)}{f_{\\text{PWM}}\\,R\\,C}',
      vars: {
        dV: { name: 'peak-to-peak ripple', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        V: { name: 'PWM amplitude (supply)', q: 'voltage', unit: 'V', value: 5 },
        d: { name: 'duty cycle', q: 'ratio', value: 0.25, min: 0, max: 1 },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'Hz', value: 490, tex: 'f_{\\text{PWM}}' },
        R: { name: 'filter resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'filter capacitance', q: 'capacitance', unit: 'µF', value: 10 }
      },
      note: 'Valid when $RC$ is much longer than the PWM period. The ripple is largest at 50 % duty; solving for $d$ gives two answers, $d$ and $1 - d$.',
      practice: { unknowns: ['dV', 'C'] },
      stories: { dV: 'A {f} PWM signal of amplitude {V} at duty {d} is filtered by {R} and {C}. How much ripple is left?', C: 'With {R}, what capacitor keeps the ripple of a {f}, {V} PWM signal at duty {d} down to {dV}?' }
    }
  ],
  derivation: {
    title: 'Why the R-2R ladder halves each bit',
    steps: [
      { text: 'At the least significant end the ladder ends in a 2R resistor to ground, in parallel with the LSB\'s 2R leg (switched to ground when the bit is 0). Seen from that node, the resistance is:', tex: '2R \\parallel 2R = R' },
      { text: 'Adding the series R to the next node gives 2R again — so every node sees 2R towards the LSB end, in parallel with its own 2R leg:', tex: 'R + R = 2R' },
      { text: 'By superposition, drive one bit to $V_{ref}$ and the others to 0 V. Seen from its own node, the bit is a Thévenin source: its 2R leg in parallel with the 2R towards the LSB end:', tex: 'V_{th} = \\frac{V_{ref}}{2}, \\qquad R_{th} = 2R \\parallel 2R = R' },
      { text: 'Each section towards the output adds R in series (making 2R) and meets the next node\'s 2R leg to ground: the voltage halves and the source resistance is R again:', tex: '\\frac{V_{ref}}{2} \\to \\frac{V_{ref}}{4} \\to \\frac{V_{ref}}{8} \\to \\cdots' },
      { text: 'So the MSB contributes $V_{ref}/2$ at the output, the next bit $V_{ref}/4$, and so on — binary weights from just two resistor values, with an output resistance of R whatever the code.' }
    ]
  },
  examples: [
    {
      title: 'Setting 1.000 V with an MCP4725',
      q: 'An MCP4725 runs from 3.3 V (its reference). What code gives 1.000 V, and how close is it?',
      steps: [
        '$D = 1.000/3.3 \\times 4096 = 1241.2$, so send 1241.',
        '$V_{out} = 3.3 \\times 1241/4096 = 0.99983\\ \\mathrm{V}$, within half an LSB (0.40 mV).',
        'The real accuracy is set by the 3.3 V rail: if it is 1 % high, so is the output. A separate reference would fix that.'
      ],
      a: 'Code 1241 → 0.9998 V (as accurate as the 3.3 V supply).'
    },
    {
      title: 'A PWM DAC for a motor-driver reference',
      q: 'An Arduino\'s 490 Hz PWM (5 V) must set a stepper driver\'s current reference with less than 10 mV of ripple at any duty cycle. What RC is needed, and what is the price?',
      steps: [
        'Worst case is $d = 0.5$: $\\Delta V = 5 \\times 0.25/(490\\,RC) \\le 0.01$, so $RC \\ge 0.255\\ \\mathrm{s}$.',
        'For example 27 kΩ and 10 µF (0.27 s). The output then takes about $5RC \\approx 1.4\\ \\mathrm{s}$ to settle after each change.',
        'Better: set the timer to 31.25 kHz (prescaler 1, 8-bit phase-correct PWM on a 16 MHz ATmega). Then $RC \\ge 4\\ \\mathrm{ms}$ and the response is 64 times faster.'
      ],
      a: 'RC ≥ 0.26 s at 490 Hz (slow); at 31.25 kHz, RC ≥ 4 ms.'
    }
  ],
  quiz: [
    { q: 'A 12-bit DAC with a 3.3 V reference receives code 1024. Its output is…', choices: ['0.825 V', '1.024 V', '1.65 V', '3.3 V'], a: 0,
      why: '1024 is a quarter of 4096, so the output is a quarter of 3.3 V.' },
    { q: 'Why is the R-2R ladder so widely used?', choices: ['It needs no reference', 'It needs only two resistor values, so matching is easy', 'It is always faster than other types', 'It has zero output resistance'], a: 1,
      why: 'Accuracy then depends on one ratio (2:1) rather than on a spread of ratios up to 2ᴺ⁻¹.' },
    { q: 'A PWM output followed by an RC filter can serve as a DAC, with a trade-off between ripple and response speed.', a: true,
      why: 'A longer time constant leaves less ripple but takes longer to follow a change of duty cycle.' },
    { q: 'The staircase output of a DAC contains unwanted components near…', choices: ['0 Hz', 'multiples of the update rate', 'the signal frequency only', 'half the signal frequency'], a: 1,
      why: 'The steps repeat at the update rate, producing images around its multiples; the reconstruction filter removes them.' },
    { q: 'Why may a DAC\'s output spike when the code goes from 0111 1111 to 1000 0000?', choices: ['The reference collapses', 'All the bits switch at slightly different moments, briefly forming wrong codes', 'The code is invalid', 'The output amplifier saturates'], a: 1,
      why: 'At this major carry every bit changes; for a few nanoseconds the DAC may see 0000 0000 or 1111 1111 — the glitch.' }
  ],
  applications: ['Setting current limits and references for motor drivers and power supplies.', 'Waveform and audio generation.', 'Trimming offsets and biases under software control.', 'Programmable voltage sources in test equipment.'],
  sim: [{ id: 'dig-adc', params: { recon: true, bits: 4 }, title: 'The DAC staircase and its reconstruction filter' }]
},

{
  id: 'serial-buses', parent: 'mixed-signal', title: 'Serial buses: UART, I²C and SPI', level: 2,
  short: 'The three ways chips and boards most often talk one bit at a time: the asynchronous UART, the two-wire addressed I²C bus, and the fast four-wire SPI — how each frames its data, how fast it goes, and when to use which.',
  keywords: ['serial', 'UART', 'baud rate', 'start bit', 'stop bit', 'parity', '8N1', 'RS-232', 'RS-485', 'I²C', 'I2C', 'SDA', 'SCL', 'ACK', 'I²C address', 'clock stretching', 'SPI', 'MOSI', 'MISO', 'SCK', 'chip select', 'SPI mode', 'CPOL', 'CPHA', 'data rate'],
  prereq: ['shift-registers', 'pull-resistors', 'binary-numbers'],
  related: ['microcontrollers', 'state-machines', 'transmission-lines', 'adc'],
  body: `
Sending bits one after another on a single wire saves pins, cables and board space; the price is that the receiver must know **when** each bit is valid. The three everyday buses solve that differently.

### UART: asynchronous, no clock wire
A **UART** (universal asynchronous receiver/transmitter) sends each byte as a *frame*: the line idles high; a **start bit** (0) marks the beginning; 5 to 9 data bits follow, least significant first; an optional **parity** bit; and one or two **stop bits** (1). "8N1" — 8 data bits, no parity, 1 stop — is 10 bits per byte. Both ends must agree on the **baud rate** in advance (9600 and 115 200 are the classics). The receiver waits for the falling edge of the start bit, then samples each bit near its middle, usually by counting 16 ticks of its own clock per bit.

Because it re-synchronises only at the start bit, the two clocks must match: by the last bit, a mismatch has accumulated over nine and a half bit times, and must stay under half a bit — about 5 % in total, so about ±2 % per side in practice. That is why UARTs want a crystal rather than an RC oscillator, and why baud-rate generators with awkward divisors cause trouble ([[microcontrollers]]). Connect TX to RX and RX to TX, plus ground. A UART is point-to-point and full duplex; at logic level it reaches a metre or so. For longer runs the same frames travel as **RS-232** (inverted ±3 to ±15 V, via a MAX3232-type transceiver) or **RS-485** (differential, multi-drop, up to about 1200 m — the physical layer of Modbus RTU and many industrial devices). USB-to-serial adapters (FT232, CP2102, CH340) connect a UART to a PC.

### I²C: two wires, many devices
**I²C** uses a clock line SCL and a data line SDA, both **open-drain** with pull-up resistors ([[pull-resistors]]). A master starts a transfer with a START condition (SDA falls while SCL is high), sends a 7-bit **address** and a read/write bit, and the addressed device pulls SDA low for one clock to **acknowledge**; data bytes follow, each acknowledged, and a STOP (SDA rises while SCL is high) ends it. Every byte costs nine clocks. Standard mode runs at 100 kHz, fast mode at 400 kHz, fast-mode plus at 1 MHz. Dozens of devices share the two wires, each with its own address — an ADS1115 at 0x48 to 0x4B (set by its ADDR pin), an MCP4725 DAC at 0x60 or 0x61, a DS3231 clock at 0x68, an SSD1306 OLED at 0x3C. Two identical sensors need different address-pin settings, or a multiplexer. A slow slave may hold SCL low to make the master wait (**clock stretching**). I²C is designed for a board: the bus capacitance limit of 400 pF and the pull-up rise time keep it to short distances.

### SPI: four wires, fast
**SPI** is a pair of [[shift-registers|shift registers]] joined in a ring. The master drives the clock SCK, sends on MOSI (master out, slave in), receives on MISO, and selects one slave by pulling its $\\overline{CS}$ low — one select line per slave, no addresses. Each clock moves a bit each way: SPI is full duplex. Four **modes** fix the clock's idle level (CPOL) and whether data is sampled on the first or second edge (CPHA); master and slave must use the same one. With no acknowledgement and no protocol overhead, SPI runs at 1 to 50 MHz: flash memories, SD cards, displays, fast ADCs and DACs, and 74HC595 chains use it.

### Choosing
| | UART | I²C | SPI |
|---|---|---|---|
| Wires | 2 + ground | 2 + ground | 3 + one select per slave |
| Clock | none (agreed baud) | SCL, open-drain | SCK, push-pull |
| Devices | 2 | many, addressed | several, by select line |
| Speed | up to ~1 Mbit/s | 0.1–1 Mbit/s | 1–50 Mbit/s |
| Typical use | PC link, GPS, radio modules | sensors, EEPROM, RTC, small displays | flash, SD, displays, fast converters |

For long cables in electrically noisy places — machines, vehicles — none of the three is right: use RS-485 or CAN, which are differential.
`,
  ideas: [
    'UART frames each byte with start and stop bits; both ends must agree on the baud rate within a few percent.',
    'I²C shares two open-drain lines among many addressed devices; each byte takes nine clocks including the ACK.',
    'SPI is two shift registers in a ring: a clock, data both ways, and a select line per slave.',
    'SPI modes set clock polarity and phase; master and slave must match.',
    'For long, noisy runs use differential links (RS-485, CAN), not logic-level buses.'
  ],
  pitfalls: [
    'TX connects to TX — A UART\'s TX goes to the other side\'s RX and RX to TX, with a common ground.',
    'RS-232 is the same as a microcontroller\'s UART pins — RS-232 uses inverted ±3 to ±15 V levels that can destroy a 3.3 V pin; use a MAX3232-type transceiver.',
    'I²C can run over long cables — It is designed for a circuit board: bus capacitance and ground noise break it beyond a metre or so without special buffers.'
  ],
  formulas: [
    {
      name: 'UART payload throughput',
      expr: 'R = baud*8/nf', tex: 'R = \\frac{8\\,B}{n_f}',
      vars: {
        R: { name: 'payload data rate', q: 'datarate', unit: 'kB/s' },
        baud: { name: 'baud rate', q: 'datarate', unit: 'baud', value: 115200, tex: 'B' },
        nf: { name: 'bits per frame (10 for 8N1)', q: 'count', value: 10, tex: 'n_f' }
      },
      note: 'Assumes frames follow each other with no idle time; 8 of every $n_f$ bits carry data.',
      stories: { R: 'A UART runs at {baud} with {nf} bits per frame. How many bytes per second can it carry?', baud: 'A data logger must stream {R} over a UART with {nf}-bit frames. What baud rate is needed?' }
    },
    {
      name: 'SPI transfer time',
      expr: 't = 8*Nb/f', tex: 't = \\frac{8\\,N_b}{f_{\\text{SCK}}}',
      vars: {
        t: { name: 'transfer time', q: 'time', unit: 'ms' },
        Nb: { name: 'number of bytes', q: 'count', value: 153600, tex: 'N_b' },
        f: { name: 'SPI clock', q: 'frequency', unit: 'MHz', value: 40, tex: 'f_{\\text{SCK}}' }
      },
      note: 'Pure shifting time; chip-select handling and gaps between bytes add to it.',
      stories: { t: 'A 320 × 240 display with 16-bit colour needs {Nb} per frame. How long does one frame take at an SPI clock of {f}?', f: 'To send {Nb} in {t}, what SPI clock is needed?' }
    },
    {
      name: 'UART clock tolerance',
      expr: 'err = 0.5/(nf - 0.5)', tex: '\\varepsilon_{\\text{max}} = \\frac{0.5}{n_f - 0.5}',
      vars: {
        err: { name: 'total allowed clock mismatch', q: 'ratio', unit: '%', tex: '\\varepsilon_{\\text{max}}' },
        nf: { name: 'bits per frame', q: 'count', value: 10, tex: 'n_f' }
      },
      note: 'The last bit is sampled $n_f - 0.5$ bit times after the start edge and must stay within half a bit. Receiver oversampling and edge slopes take a bite out of this, so keep each side within about ±2 %.',
      stories: { err: 'A UART frame has {nf} bits. What total mismatch between the two clocks can it tolerate in theory?' }
    }
  ],
  examples: [
    {
      title: 'Streaming G-code over a UART',
      q: 'A PC sends G-code to a CNC controller at 115 200 baud, 8N1. How long does a 64-character line take, and how many such lines per second can the link carry?',
      steps: [
        'Bit time $= 1/115\\,200 = 8.68\\ \\mathrm{\\mu s}$; a 10-bit frame takes $86.8\\ \\mathrm{\\mu s}$.',
        '64 characters: $64 \\times 86.8\\ \\mathrm{\\mu s} = 5.6\\ \\mathrm{ms}$.',
        'At most $11\\,520/64 = 180$ lines per second — enough for most jobs, but short segments of a finely tessellated 3D surface can starve the planner, which is why fast machines move to USB or Ethernet.'
      ],
      a: '5.6 ms per line; at most about 180 lines per second.'
    },
    {
      title: 'Reading an ADS1115 over I²C',
      q: 'Reading one 16-bit result from an ADS1115 means writing its register pointer (address byte + 1 byte), then reading (address byte + 2 bytes). How long does that take at 400 kHz?',
      steps: [
        'Write phase: 2 bytes × 9 clocks = 18 clocks. Read phase: 3 bytes × 9 clocks = 27 clocks.',
        'About 45 clocks plus a few for the START, repeated START and STOP conditions: say 48.',
        '$48 \\times 2.5\\ \\mathrm{\\mu s} = 120\\ \\mathrm{\\mu s}$. The converter itself, at its fastest 860 samples per second, takes 1.2 ms — the bus is not the bottleneck.'
      ],
      a: 'About 120 µs on the bus.'
    }
  ],
  quiz: [
    { q: 'At 115 200 baud with 8N1 framing, the maximum payload is about…', choices: ['115 200 bytes/s', '14 400 bytes/s', '11 520 bytes/s', '9 600 bytes/s'], a: 2,
      why: 'Each byte takes 10 bit times (start + 8 data + stop): 115 200 / 10 = 11 520 bytes per second.' },
    { q: 'Which of the three buses needs pull-up resistors?', choices: ['UART', 'I²C', 'SPI', 'All of them'], a: 1,
      why: 'I²C lines are open-drain: devices only pull low, and the pull-ups make the high level.' },
    { q: 'In SPI mode 0 (CPOL = 0, CPHA = 0), data is sampled on…', choices: ['the rising edge of SCK', 'the falling edge of SCK', 'both edges', 'the falling edge of CS'], a: 0,
      why: 'CPOL = 0: the clock idles low, so the first edge is rising; CPHA = 0: data is sampled on that first edge and changed on the second.' },
    { q: 'Two I²C sensors with the same fixed address can share a bus as long as they are different models.', a: false,
      why: 'Both would answer and acknowledge the same address. Use a sensor with an address pin, a second bus, or an I²C multiplexer.' },
    { q: 'Why does a UART tolerate only a few percent of clock mismatch?', choices: ['The start bit is too short', 'The receiver re-synchronises only at the start bit, so timing errors accumulate up to the last bit', 'Parity bits need an exact clock', 'Higher mismatch overheats the transmitter'], a: 1,
      why: 'By the stop bit the receiver\'s sampling point has drifted by (n_f − ½) times the mismatch; it must stay within half a bit.' }
  ],
  applications: ['Talking to a PC, a GPS module or a Bluetooth/Wi-Fi module over a UART.', 'Connecting sensors, ADCs, DACs, EEPROMs and real-time clocks on one I²C bus.', 'Fast peripherals on SPI: flash memory, SD cards, TFT displays, shift-register outputs.', 'Industrial links over RS-485 (Modbus RTU) using the same UART frames.'],
  sim: 'dig-bus'
},

{
  id: 'microcontrollers', parent: 'mixed-signal', title: 'Microcontrollers', level: 2,
  short: 'A complete small computer on one chip — processor, memory, clock and a set of peripherals (GPIO, timers, ADC, serial ports) — that turns digital electronics into something you program.',
  keywords: ['microcontroller', 'MCU', 'ATmega328P', 'Arduino', 'STM32', 'RP2040', 'ESP32', 'GPIO', 'timer', 'PWM', 'interrupt', 'ISR', 'flash', 'SRAM', 'EEPROM', 'watchdog', 'crystal', 'prescaler', 'baud-rate generator', 'decoupling'],
  prereq: ['logic-gates', 'counters', 'serial-buses'],
  related: ['adc', 'pwm', 'pull-resistors', 'state-machines', 'decoupling', 'mosfet-switch'],
  body: `
A **microcontroller** (MCU) puts a processor, its memory and a collection of hardware helpers on one chip. Add a supply, a couple of decoupling capacitors and often a crystal, and it runs a program that reads inputs and drives outputs — the brain of nearly every appliance, instrument and machine controller made today.

### What is inside
- **CPU**: an 8-bit AVR in the ATmega328P (Arduino Uno), a 32-bit ARM Cortex-M in the STM32 family and the RP2040, an Xtensa or RISC-V core in the ESP32 series.
- **Flash** for the program (32 KB in the ATmega328P, 64 KB in the STM32F103C8 of the "Blue Pill" board), **SRAM** for variables (2 KB and 20 KB respectively), sometimes **EEPROM** for settings that survive power-off.
- A **clock**: an internal RC oscillator (accurate to about ±1–10 %) or an external crystal (tens of ppm).
- **Peripherals**, each a block of dedicated hardware controlled through registers: general-purpose I/O, timers, ADC (and on some parts a DAC), UART, SPI and I²C ([[serial-buses]]), USB, CAN, DMA, a watchdog.

### GPIO: the pins
Each pin can be an input (with an optional internal pull-up, [[pull-resistors]]) or an output, push-pull or open-drain, and most have *alternate functions* that hand the pin to a peripheral. An output is a small CMOS driver: an ATmega328P pin can supply about 20 mA (40 mA absolute maximum, 200 mA for the whole chip); an STM32 pin is specified for about 8 mA at full logic levels. That is enough for an LED or the gate of a logic-level MOSFET — **never** for a motor, relay coil or LED strip, which need a transistor or MOSFET switch with a flyback diode ([[mosfet-switch]]). Inputs must stay within the supply rails unless the pin is marked 5 V tolerant (many STM32 pins are; the RP2040's are not).

### Timers
A timer is a [[counters|counter]] clocked through a **prescaler**, with compare registers that toggle a pin when the count matches — hardware **PWM** — and capture registers that record the count when an input edge arrives. The PWM frequency is

$$f_{PWM} = \\frac{f_{clk}}{N\\,(\\text{TOP} + 1)}$$

for prescaler $N$ and a count from 0 to TOP, and the resolution is TOP + 1 steps. STM32 timers also decode quadrature encoders in hardware, counting a motor or handwheel position without software.

### Interrupts
Instead of **polling** — checking a flag again and again in the main loop — a peripheral can raise an **interrupt**: the CPU finishes its instruction, saves its state and runs an *interrupt service routine* (ISR), then resumes. ISRs should be short (set a flag, copy a byte, count an edge) and variables they share with the main code must be declared \`volatile\` and read with interrupts briefly disabled if they span several bytes, or the main code may read a half-updated value.

### Clocks and baud rates
Every timing in the chip derives from its clock, so the clock's accuracy is the timing accuracy. A UART's baud rate comes from dividing the clock; on an AVR at normal speed, $\\text{baud} = f_{clk}/\\big(16(\\text{UBRR} + 1)\\big)$, and not every rate comes out exactly — 115 200 baud from 16 MHz is 3.5 % off, too much for a reliable link, while 14.7456 MHz divides exactly. Crystal-controlled MCUs are accurate to 50 ppm or better; an internal RC oscillator may drift by several percent with temperature, marginal for a UART and useless for timekeeping.

### Keeping it alive
- **Decoupling**: 100 nF ceramic capacitors at every supply pin plus a few microfarads of bulk ([[decoupling]]); an MCU's current comes in nanosecond gulps at each clock edge.
- **Brown-out detection** holds the chip in reset while the supply is too low to run reliably.
- A **watchdog** timer resets the chip if the firmware stops refreshing it — the last line of defence against a hang.
- The reset pin needs a pull-up (and often 100 nF) to stay out of reset in a noisy environment.

### Choosing one
An 8-bit AVR is simple, robust, runs from 5 V and draws microamps when asleep. A Cortex-M part brings 32-bit arithmetic, tens to hundreds of MHz, 12-bit ADCs, DMA and rich timers for motor control. Wireless SoCs such as the ESP32 add Wi-Fi and Bluetooth. The deciding questions are usually the peripherals (how many timers, ADC channels, UARTs), the supply voltage, and the tools you already know.
`,
  ideas: [
    'An MCU is a CPU, flash, SRAM, a clock and peripherals on one chip.',
    'GPIO pins source or sink a few to 20 mA: switch real loads with transistors.',
    'Timers are counters with prescalers, compare (PWM) and capture registers: f_PWM = f_clk / (N·(TOP + 1)).',
    'Interrupts let peripherals demand attention; keep ISRs short and shared variables volatile.',
    'The clock sets every timing: crystals for UARTs and timekeeping, RC oscillators only where a few percent is fine.'
  ],
  pitfalls: [
    'A GPIO pin can drive a motor, relay or LED strip — Pins supply at most a few to 20 mA; use a transistor or MOSFET, with a flyback diode on inductive loads.',
    'The internal RC oscillator is as good as a crystal — It is accurate to about ±1–10 %: fine for blinking, marginal for a UART, useless for a clock.',
    'Variables shared with an interrupt need no special care — Declare them volatile and read multi-byte values with interrupts off, or the main code can see a half-updated value.'
  ],
  formulas: [
    {
      name: 'PWM frequency of a timer',
      expr: 'f = fclk/(N*(TOP + 1))', tex: 'f_{\\text{PWM}} = \\frac{f_{\\text{clk}}}{N\\,(\\text{TOP} + 1)}',
      vars: {
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', tex: 'f_{\\text{PWM}}' },
        fclk: { name: 'timer clock', q: 'frequency', unit: 'MHz', value: 16, tex: 'f_{\\text{clk}}' },
        N: { name: 'prescaler', q: 'count', value: 8 },
        TOP: { name: 'top of the count', q: 'count', value: 1999, tex: '\\text{TOP}' }
      },
      note: 'For a single-slope (fast) PWM. Phase-correct PWM counts up and down and halves the frequency. The duty cycle has TOP + 1 steps.',
      practice: { unknowns: ['f', 'TOP'] },
      stories: { f: 'A timer clocked at {fclk} with a prescaler of {N} counts from 0 to {TOP}. What is its PWM frequency?', TOP: 'A timer on {fclk} with prescaler {N} must produce {f} PWM. What TOP value is needed?' }
    },
    {
      name: 'UART baud rate from a divisor (AVR, normal speed)',
      expr: 'baud = fclk/(16*(UBRR + 1))', tex: '\\text{baud} = \\frac{f_{\\text{clk}}}{16\\,(\\text{UBRR} + 1)}',
      vars: {
        baud: { name: 'actual baud rate', q: 'datarate', unit: 'baud', tex: '\\text{baud}' },
        fclk: { name: 'CPU clock', q: 'frequency', unit: 'MHz', value: 16, tex: 'f_{\\text{clk}}' },
        UBRR: { name: 'baud-rate register value', q: 'count', value: 8, int: true, tex: '\\text{UBRR}' }
      },
      note: 'UBRR must be a whole number, so the actual rate is rarely exactly the one wanted. Double-speed mode (U2X) uses 8 instead of 16.',
      practice: { unknowns: ['baud'] },
      stories: { baud: 'An AVR at {fclk} has UBRR = {UBRR}. What baud rate does it actually produce?' }
    }
  ],
  examples: [
    {
      title: '20 kHz PWM for a motor driver',
      q: 'A 16 MHz ATmega328P must drive a motor bridge at 20 kHz (above hearing) with 16-bit Timer1 in fast PWM mode. Choose the prescaler and TOP, and find the resolution.',
      steps: [
        'With prescaler 1: $\\text{TOP} + 1 = 16\\times10^6 / 20\\times10^3 = 800$, so TOP = 799.',
        'The duty cycle then has 800 steps — about 9.6 bits, plenty for speed control.',
        'A prescaler of 8 would give only 100 steps; always use the smallest prescaler that lets TOP fit the counter.'
      ],
      a: 'Prescaler 1, TOP = 799: 800 duty steps at exactly 20 kHz.'
    },
    {
      title: 'The 115 200 baud trap',
      q: 'On a 16 MHz AVR, what is the closest achievable rate to 115 200 baud, with and without double-speed mode? Why do many boards use a 14.7456 MHz crystal?',
      steps: [
        'Normal speed: $\\text{UBRR} = 16\\times10^6/(16 \\times 115\\,200) - 1 = 7.68$, rounded to 8: $16\\times10^6/(16 \\times 9) = 111\\,111$ baud, 3.5 % slow.',
        'Double speed: $\\text{UBRR} = 16\\times10^6/(8 \\times 115\\,200) - 1 = 16.4$, rounded to 16: $16\\times10^6/(8 \\times 17) = 117\\,647$ baud, 2.1 % fast — usable.',
        '14.7456 MHz / (16 × 115 200) = 8 exactly, so UBRR = 7 gives 0 % error at every standard rate.'
      ],
      a: '−3.5 % (normal) or +2.1 % (U2X) at 16 MHz; a 14.7456 MHz crystal divides exactly.'
    }
  ],
  quiz: [
    { q: 'Where does a microcontroller keep its program?', choices: ['SRAM', 'Flash memory', 'The ADC', 'The stack'], a: 1,
      why: 'Flash is non-volatile and holds the program; SRAM holds variables and is lost at power-off.' },
    { q: 'A 16 MHz timer with a prescaler of 64 counts from 0 to 249 and repeats. How often does it overflow?', choices: ['250 Hz', '1 kHz', '4 kHz', '62.5 kHz'], a: 1,
      why: '16 MHz / 64 = 250 kHz; divided by 250 counts gives 1 kHz — a convenient millisecond tick.' },
    { q: 'An interrupt service routine should do as little as possible and return, leaving longer work to the main loop.', a: true,
      why: 'While one ISR runs, other interrupts wait; long ISRs add latency and jitter to everything else.' },
    { q: 'Why fit a crystal rather than rely on the internal RC oscillator for a 115 200 baud UART?', choices: ['Crystals use less power', 'The RC oscillator\'s error of a few percent can exceed the UART\'s tolerance', 'The UART cannot use the internal clock', 'Crystals make the CPU faster'], a: 1,
      why: 'A UART tolerates only about ±2 % per side; an uncalibrated RC oscillator may drift further with temperature and supply.' },
    { q: 'What is the right way to switch a 12 V relay coil from a GPIO pin?', choices: ['Connect the coil directly to the pin', 'Through a transistor or logic-level MOSFET, with a flyback diode across the coil', 'Through a 100 Ω resistor', 'With an I²C command'], a: 1,
      why: 'The coil needs more current and voltage than a pin can give, and its inductive kick at switch-off must be clamped by a diode.' }
  ],
  applications: ['Machine and CNC controllers, 3D printers and motor drives.', 'Data loggers and instruments reading sensors through ADCs and serial buses.', 'Consumer appliances, toys and remote controls.', 'Connected devices with Wi-Fi or Bluetooth (ESP32, nRF52).'],
  sim: [{ id: 'dig-bus', params: { bus: 'spi' }, title: 'An MCU peripheral at work: an SPI transfer' }]
}

);
