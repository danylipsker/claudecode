/* HYPER-ELECTRONICS · content/opamp-circuits.js — the classic op-amp configurations:
 * inverting, non-inverting, follower, summing, difference, instrumentation amplifier,
 * integrator and differentiator, transimpedance amplifier. Simulations in sims/opamps.js. */
Hyper.add(

{
  id: 'inverting-amplifier', parent: 'opamp-circuits', title: 'The inverting amplifier', level: 1,
  short: 'The input drives a resistor into a virtual earth; the same current must flow through the feedback resistor, so the gain is −R_f/R₁ — any size, including less than one.',
  keywords: ['inverting amplifier', 'virtual earth', 'virtual ground', 'gain', 'input resistance', 'feedback resistor', 'attenuator', 'phase inversion', 'clipping'],
  prereq: ['ideal-opamp', 'kirchhoffs-laws', 'resistance-ohms-law'],
  related: ['non-inverting-amplifier', 'summing-amplifier', 'transimpedance', 'integrator-differentiator', 'offset-bias', 'gain-bandwidth'],
  body: `
The inverting amplifier is where the golden rules of the [[ideal-opamp]] are easiest to watch at work. The signal drives a resistor $R_1$ into the − input; a feedback resistor $R_f$ runs from the output back to the same node; the + input is grounded.

### The virtual earth
The + input is at 0 V, so negative feedback holds the − input at 0 V as well. That node is not connected to ground, yet it sits at ground potential: a **virtual earth**. The current into it is therefore fixed by $R_1$ alone, $I = V_\\text{in}/R_1$. None of it can enter the op-amp, so all of it continues through $R_f$ — and the output has to go to whatever voltage draws that current out of the node: $V_\\text{out} = 0 - I R_f$.

$$V_\\text{out} = -\\frac{R_f}{R_1}\\,V_\\text{in}$$

The minus sign is the inversion: a sine comes out turned upside down, shifted by 180°. The gain can be any size — $R_f = 10\\ \\mathrm{k\\Omega}$ with $R_1 = 100\\ \\mathrm{k\\Omega}$ attenuates by ten, something the [[non-inverting-amplifier]] cannot do.

### Input and output resistance
The source sees $R_1$ running to a virtual earth, so the **input resistance is $R_1$** — the circuit's main weakness. A source with its own resistance $R_s$ simply adds to $R_1$: a 10 kΩ source feeding $R_1 = 10\\ \\mathrm{k\\Omega}$ halves the gain. Getting a high gain *and* a high input resistance needs huge resistors: $-100$ with 1 MΩ at the input would need $R_f = 100\\ \\mathrm{M\\Omega}$. The output resistance, thanks to [[negative-feedback|feedback]], is a small fraction of an ohm.

### Choosing values
Most designs use $R_1$ between 1 kΩ and 100 kΩ. Too small, and the op-amp's output must drive $R_f$ as a heavy load (1 kΩ at 10 V is 10 mA) while the source is loaded by $R_1$. Too large, and resistor noise, the error from input [[offset-bias|bias currents]] and stray capacitance take over: 1 pF across a 1 MΩ $R_f$ makes a low-pass corner at 160 kHz. With bipolar op-amps a resistor $R_1 \\parallel R_f$ from the + input to ground cancels most of the bias-current error; FET-input parts such as the TL072 do not need it.

### Why designers like it
- **Its inputs never move.** Both sit at 0 V whatever the signal does, so there is no common-mode swing: no common-mode error, no worry about the op-amp's input range. The signal can even exceed the supply rails — $R_1 = 100\\ \\mathrm{k\\Omega}$, $R_f = 10\\ \\mathrm{k\\Omega}$ turns ±50 V into ±5 V on a ±15 V op-amp.
- **More inputs are free.** Add another resistor into the virtual earth and you have a [[summing-amplifier]].
- **Its bandwidth follows the noise gain** $1 + R_f/R_1$, not the signal gain ([[gain-bandwidth]]): at a gain of −1 it has half the bandwidth of a follower.

### Clipping
The output cannot pass its limits — about ±13.5 V for a TL072 on ±15 V — so with a gain of −10 the input must stay within ±1.35 V. Beyond that the output flattens, the feedback can no longer hold the − input at 0 V, and the virtual earth is lost.
`,
  ideas: [
    'Feedback holds the − input at 0 V: a virtual earth.',
    'The input current V_in/R₁ flows on through R_f, so V_out = −(R_f/R₁)·V_in.',
    'The input resistance is R₁; any source resistance adds to it.',
    'Both inputs stay at 0 V, so there is no common-mode swing.',
    'The gain can be below one, and more inputs can be added into the virtual earth.'
  ],
  pitfalls: [
    'The inverting amplifier has a very high input resistance, like the op-amp — The source sees R₁ to a virtual earth; the input resistance is R₁.',
    'The − input is grounded — It is held at 0 V by the feedback, not by a wire. When the output clips, it leaves 0 V.',
    'Bigger resistors are always better because they draw less current — Large values add noise, bias-current error and sensitivity to stray capacitance.'
  ],
  derivation: {
    title: 'Derive the gain from Kirchhoff\'s current law',
    steps: [
      { text: 'Negative feedback and a grounded + input give $V_- = 0$. The currents into the − node through $R_1$ and $R_f$ must add to zero, since none enters the op-amp:', tex: '\\frac{V_\\text{in} - 0}{R_1} + \\frac{V_\\text{out} - 0}{R_f} = 0' },
      { text: 'Solve for the output:', tex: 'V_\\text{out} = -\\frac{R_f}{R_1}\\,V_\\text{in}' },
      { text: 'With a finite open-loop gain $A$ the − input sits at $-V_\\text{out}/A$ instead of 0, and the same steps give', tex: 'G = -\\frac{R_f}{R_1}\\cdot\\frac{1}{1 + (1 + R_f/R_1)/A}' },
      'The correction involves $1 + R_f/R_1$, the noise gain, not the signal gain $R_f/R_1$ — the first hint of why the noise gain sets accuracy and bandwidth.'
    ]
  },
  formulas: [
    {
      name: 'Gain of the inverting amplifier',
      expr: 'G = -Rf/R1', tex: 'G = -\\frac{R_f}{R_1}',
      vars: {
        G: { name: 'voltage gain', tex: 'G', signed: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 47, tex: 'R_f' },
        R1: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' }
      },
      stories: { Rf: 'An inverting amplifier with a {R1} input resistor needs a gain of {G}. What feedback resistor do you need?' }
    },
    {
      name: 'Output of the inverting amplifier',
      expr: 'Vout = -Rf*Vin/R1', tex: 'V_{\\text{out}} = -\\frac{R_f}{R_1}\\,V_{\\text{in}}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}', signed: true },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 0.5, tex: 'V_{\\text{in}}', signed: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 47, tex: 'R_f' },
        R1: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' }
      },
      stories: { Vout: 'An inverting amplifier has R₁ = {R1} and R_f = {Rf}. The input is {Vin}. What is the output?' }
    },
    {
      name: 'Gain with a source resistance',
      expr: 'G = -Rf/(R1 + Rs)', tex: 'G = -\\frac{R_f}{R_1 + R_s}',
      vars: {
        G: { name: 'actual voltage gain', tex: 'G', signed: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' },
        R1: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        Rs: { name: 'source resistance', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_s' }
      },
      note: 'The source resistance is in series with $R_1$. Keep $R_1 \\gg R_s$, or include $R_s$ in the design.',
      stories: { G: 'A sensor with an output resistance of {Rs} feeds an inverting amplifier with R₁ = {R1} and R_f = {Rf}. What is the real gain?' }
    },
    {
      name: 'Bias-current compensation resistor',
      expr: 'Rc = R1*Rf/(R1 + Rf)', tex: 'R_c = R_1 \\parallel R_f = \\frac{R_1 R_f}{R_1 + R_f}',
      vars: {
        Rc: { name: 'resistor from + input to ground', q: 'resistance', unit: 'kΩ', tex: 'R_c' },
        R1: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' }
      },
      note: 'For bipolar-input op-amps: the two inputs then see the same DC resistance, and equal bias currents cancel.'
    }
  ],
  examples: [
    {
      title: 'A gain of −4.7, and how far it can go',
      q: 'Design an inverting amplifier with a gain of −4.7 and an input resistance of 10 kΩ, using a TL072 on ±15 V. What is the largest input peak before clipping?',
      steps: [
        'The input resistance is $R_1$, so $R_1 = 10\\ \\mathrm{k\\Omega}$; then $R_f = 4.7 \\times 10 = 47\\ \\mathrm{k\\Omega}$ (an E12 value).',
        'The TL072 output reaches about ±13.5 V on ±15 V supplies.',
        'Largest input peak: $13.5/4.7 = 2.87\\ \\mathrm{V}$. Above that the output clips.'
      ],
      a: 'R₁ = 10 kΩ, R_f = 47 kΩ; clipping starts at about 2.9 V peak input.'
    },
    {
      title: 'Measuring ±50 V with a ±15 V op-amp',
      q: 'A ±50 V signal must be scaled to ±5 V. Show that an inverting stage can do it with ordinary ±15 V op-amps, and find the power in the input resistor.',
      steps: [
        'Gain −0.1: $R_1 = 100\\ \\mathrm{k\\Omega}$, $R_f = 10\\ \\mathrm{k\\Omega}$.',
        'The op-amp\'s inputs stay at 0 V; the full 50 V appears across $R_1$, not across the op-amp.',
        'Power in $R_1$ at the peak: $50^2/100\\ \\mathrm{k\\Omega} = 25\\ \\mathrm{mW}$ — fine for a 0.25 W resistor, but check its voltage rating (often 200 V for small SMD parts).',
        'The noise gain is $1 + 10/100 = 1.1$, so the bandwidth is almost the full gain–bandwidth product.'
      ],
      a: 'R₁ = 100 kΩ, R_f = 10 kΩ; 25 mW in R₁ at the peaks.'
    }
  ],
  quiz: [
    { q: 'An inverting amplifier has R₁ = 10 kΩ and R_f = 100 kΩ. What input resistance does the signal source see?', choices: ['about 1 TΩ, the op-amp\'s input', '100 kΩ', '10 kΩ', '110 kΩ'], a: 2,
      why: 'The source drives R₁ into a node held at 0 V; the op-amp\'s own input resistance is not in the path.' },
    { q: 'R₁ and R_f are both doubled. Which is true?', choices: ['the gain doubles', 'the gain is unchanged and the input resistance doubles', 'the gain halves', 'nothing changes at all'], a: 1,
      why: 'The gain depends on the ratio only; the input resistance is R₁ itself.' },
    { q: 'An inverting amplifier with a gain of −10 is fed from a sensor with 10 kΩ of output resistance, with R₁ = 10 kΩ and R_f = 100 kΩ. What is the actual gain?', choices: ['−10', '−9.09', '−5', '−1'], a: 2,
      why: 'The source resistance adds to R₁: −100/(10 + 10) = −5.' },
    { q: 'With an inverting stage, the input signal may be larger than the op-amp\'s supply voltage, provided the gain brings the output within its limits.', a: true,
      why: 'Both op-amp inputs stay at 0 V; the input voltage is dropped across R₁. Mind the resistor\'s power and voltage ratings.' },
    { q: 'The input of a −10 amplifier is raised until the output clips at −13.5 V. What does the − input do?', choices: ['stays at exactly 0 V', 'moves away from 0 V towards the input', 'goes to −13.5 V', 'goes to +15 V'], a: 1,
      why: 'Once the output cannot move further, the feedback can no longer cancel the input current, and the divider R₁–R_f between input and output sets the − input voltage.' }
  ],
  applications: [
    'Audio gain stages and mixers.',
    'Scaling and attenuating measurement signals, including ones larger than the supply.',
    'Photodiode and current-input amplifiers (the transimpedance amplifier).',
    'Active filters and integrators built around a virtual earth.'
  ],
  sim: [{ id: 'oa-config-lab', params: { config: 'inv' } }, 'oa-virtual-earth']
},

{
  id: 'non-inverting-amplifier', parent: 'opamp-circuits', title: 'The non-inverting amplifier', level: 1,
  short: 'The signal drives the + input and a divider from the output feeds the − input: gain 1 + R_f/R₁, in phase, with an input resistance as high as the op-amp\'s own.',
  keywords: ['non-inverting amplifier', 'gain', 'feedback divider', 'high input impedance', 'in phase', 'common-mode', 'bias path', 'AC coupling', 'sensor amplifier'],
  prereq: ['ideal-opamp', 'voltage-divider', 'negative-feedback'],
  related: ['inverting-amplifier', 'voltage-follower', 'gain-bandwidth', 'single-supply', 'sensor-interfacing'],
  body: `
Feed the signal straight into the + input and close the loop through a [[voltage-divider]]: $R_f$ from the output to the − input, $R_1$ from the − input to ground. The − input sees a fraction of the output, $V_- = V_\\text{out} R_1/(R_1 + R_f)$, and the golden rule makes that fraction equal to the input:

$$V_\\text{out} = \\left(1 + \\frac{R_f}{R_1}\\right) V_\\text{in}$$

The output is **in phase** with the input, and the gain is never less than 1: with $R_f = 0$ (or $R_1$ left out) it is exactly 1, the [[voltage-follower]].

### The main attraction: input resistance
The source drives only the op-amp's + input. For a JFET or CMOS part (TL072, MCP6002) that is around $10^{12}\\ \\Omega$ and picoamps; for a bipolar part, megohms and nanoamps — and the feedback raises it further. The amplifier does not load the source at all, so it suits sensors with a high output resistance: piezo elements, pH electrodes, high-value dividers, capacitive microphones.

### Practical points
- **Gain accuracy** comes from the resistor ratio: 1 % resistors give up to about 2 % gain error, 0.1 % resistors 0.2 %. Typical values: $R_1$ from 1 kΩ to 10 kΩ, $R_f$ up to a megohm.
- **A DC path for the + input.** The input bias current must flow somewhere. If the input is AC-coupled through a capacitor with nothing else connected, the bias current charges the capacitor and the output drifts into a rail. A resistor from the + input to ground (or to the bias voltage) fixes it — and sets the input resistance.
- **The inputs move with the signal.** The common-mode voltage equals $V_\\text{in}$, so the whole input swing must lie inside the op-amp's input range: a TL072's inputs must stay 3–4 V above its negative supply, an LM358's may go down to it ([[single-supply]]). The op-amp's finite common-mode rejection adds a small error the inverting amplifier does not have.
- **Bandwidth** is the gain–bandwidth product divided by $1 + R_f/R_1$ ([[gain-bandwidth]]).
- **A capacitor across $R_f$** rolls the gain off — but only down to 1, never to zero, because $1 + Z_f/R_1 \\to 1$. A non-inverting stage cannot be turned into a low-pass filter that way.
- **A capacitor in series with $R_1$** does the opposite trick: at DC $R_1$ is disconnected and the gain is 1, so the op-amp's offset is not amplified, while above $f_c = 1/(2\\pi R_1 C)$ the full gain applies. Audio preamplifiers use it all the time.
`,
  ideas: [
    'Gain 1 + R_f/R₁, in phase, never below 1.',
    'The input resistance is the op-amp\'s own: very high, so the source is not loaded.',
    'The + input needs a DC path for its bias current.',
    'Both inputs follow the signal, so it must stay within the op-amp\'s input range.',
    'A capacitor in series with R₁ makes the DC gain 1 while keeping the AC gain.'
  ],
  pitfalls: [
    'A non-inverting amplifier can be set to any gain, like the inverting one — Its gain is at least 1. For less, divide the signal first or use an inverting stage.',
    'A capacitor across R_f makes it a low-pass filter to zero — The gain falls only to 1: the input still reaches the output through the + input.',
    'An AC-coupled input needs nothing else — Without a resistor to ground or to a bias voltage, the input bias current has no path and the output drifts to a rail.'
  ],
  derivation: {
    title: 'Derive the gain',
    steps: [
      { text: 'No current enters the − input, so $R_f$ and $R_1$ carry the same current and form an unloaded divider from the output:', tex: 'V_- = V_\\text{out}\\,\\frac{R_1}{R_1 + R_f}' },
      { text: 'Negative feedback makes $V_- = V_+ = V_\\text{in}$:', tex: 'V_\\text{in} = V_\\text{out}\\,\\frac{R_1}{R_1 + R_f}' },
      { text: 'Solve for the output:', tex: 'V_\\text{out} = \\frac{R_1 + R_f}{R_1}\\,V_\\text{in} = \\left(1 + \\frac{R_f}{R_1}\\right) V_\\text{in}' }
    ]
  },
  formulas: [
    {
      name: 'Gain of the non-inverting amplifier',
      expr: 'G = 1 + Rf/R1', tex: 'G = 1 + \\frac{R_f}{R_1}',
      vars: {
        G: { name: 'voltage gain', tex: 'G' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 90, tex: 'R_f' },
        R1: { name: 'resistor to ground', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' }
      },
      stories: { Rf: 'A non-inverting amplifier with R₁ = {R1} must have a gain of {G}. What feedback resistor do you need?' }
    },
    {
      name: 'Output of the non-inverting amplifier',
      expr: 'Vout = (1 + Rf/R1)*Vin', tex: 'V_{\\text{out}} = \\left(1 + \\frac{R_f}{R_1}\\right)V_{\\text{in}}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}', signed: true },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'mV', value: 50, tex: 'V_{\\text{in}}', signed: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 63.4, tex: 'R_f' },
        R1: { name: 'resistor to ground', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' }
      }
    },
    {
      name: 'Gain in decibels',
      expr: 'GdB = 20*log(1 + Rf/R1)', tex: 'G_{\\text{dB}} = 20\\log_{10}\\!\\left(1 + \\frac{R_f}{R_1}\\right)',
      vars: {
        GdB: { name: 'gain in dB', q: 'gain', unit: 'dB', tex: 'G_{\\text{dB}}' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' },
        R1: { name: 'resistor to ground', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' }
      },
      stories: { Rf: 'A microphone preamplifier needs {GdB} of gain with R₁ = {R1}. What feedback resistor do you need?' }
    },
    {
      name: 'Corner of a capacitor in series with R₁',
      expr: 'fc = 1/(2*pi*R1*C)', tex: 'f_c = \\frac{1}{2\\pi R_1 C}',
      vars: {
        fc: { name: 'frequency above which the full gain applies', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        R1: { name: 'resistor to ground', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' },
        C: { name: 'capacitor in series with R₁', q: 'capacitance', unit: 'µF', value: 47 }
      },
      note: 'Below $f_c$ the gain falls towards 1, so the op-amp\'s DC offset is not amplified.'
    }
  ],
  examples: [
    {
      title: 'A current-shunt amplifier for a 3.3 V ADC',
      q: 'A shunt gives 0–50 mV. Amplify it to 0–3.3 V with an MCP6002 (rail-to-rail, 1 MHz) on a 3.3 V supply. What is the bandwidth, and what happens near zero current?',
      steps: [
        'A rail-to-rail output still stops about 25 mV short of each rail, so aim a little below 3.3 V: $3.2\\ \\mathrm{V}/50\\ \\mathrm{mV} = 64$, $R_f/R_1 = 63$.',
        '$R_1 = 1.00\\ \\mathrm{k\\Omega}$ and $R_f = 63.4\\ \\mathrm{k\\Omega}$ (E96) give a gain of 64.4: full scale is $50\\ \\mathrm{mV} \\times 64.4 = 3.22\\ \\mathrm{V}$.',
        'Bandwidth: $1\\ \\mathrm{MHz}/64.4 \\approx 15\\ \\mathrm{kHz}$.',
        'Near zero current the output cannot go below about 25 mV, so inputs below $25/64.4 = 0.39\\ \\mathrm{mV}$ all read the same — the bottom 0.8 % of the range is lost.'
      ],
      a: 'R₁ = 1 kΩ, R_f = 63.4 kΩ (3.22 V full scale); about 15 kHz of bandwidth; the lowest 0.4 mV of input is not resolved.'
    },
    {
      title: 'An AC-coupled microphone stage',
      q: 'A preamplifier needs a gain of 101 for audio. Choose $R_1$, $R_f$ and a capacitor in series with $R_1$ so that the DC gain is 1 and the gain is full above about 10 Hz.',
      steps: [
        '$R_f/R_1 = 100$: take $R_1 = 1\\ \\mathrm{k\\Omega}$, $R_f = 100\\ \\mathrm{k\\Omega}$.',
        '$C = 1/(2\\pi \\times 1\\ \\mathrm{k\\Omega} \\times 10\\ \\mathrm{Hz}) = 16\\ \\mu\\mathrm{F}$; use 22 µF, giving $f_c = 7.2\\ \\mathrm{Hz}$.',
        'At DC the capacitor is open and the gain is 1: a 2 mV op-amp offset stays 2 mV at the output instead of becoming 0.2 V.',
        'The input coupling capacitor needs its own resistor to ground (say 100 kΩ) as the bias path.'
      ],
      a: 'R₁ = 1 kΩ, R_f = 100 kΩ, 22 µF in series with R₁ (corner 7 Hz).'
    }
  ],
  quiz: [
    { q: 'A non-inverting amplifier has R₁ = 1 kΩ to ground and R_f = 9 kΩ. Its gain is…', choices: ['9', '10', '−9', '0.9'], a: 1,
      why: '1 + R_f/R₁ = 1 + 9 = 10.' },
    { q: 'Can a non-inverting amplifier have a gain of 0.5?', choices: ['yes, with R_f < R₁', 'yes, with R_f = 0', 'no: its gain is at least 1', 'only with a negative supply'], a: 2,
      why: 'G = 1 + R_f/R₁ ≥ 1. Divide the signal before the amplifier, or use an inverting stage, to get less.' },
    { q: 'A non-inverting amplifier\'s input is AC-coupled through a 100 nF capacitor, with nothing else on the + input. After switching on, the output slowly drifts to a rail. Why?', choices: ['the capacitor is too small', 'the input bias current has no DC path and charges the capacitor', 'the gain is too high', 'the op-amp is oscillating'], a: 1,
      why: 'The + input\'s bias current can only flow into the capacitor, whose voltage then ramps. A resistor from the + input to ground or bias fixes it.' },
    { q: 'Which configuration normally loads a sensor less: inverting or non-inverting?', choices: ['inverting', 'non-inverting', 'they are the same', 'it depends only on the op-amp'], a: 1,
      why: 'The non-inverting amplifier presents the op-amp\'s own, very high, input resistance; the inverting one presents R₁.' },
    { q: 'A capacitor is placed across R_f of a non-inverting amplifier with a gain of 11. At very high frequency the gain tends to…', choices: ['0', '1', '11', 'infinity'], a: 1,
      why: 'The capacitor shorts R_f, making the gain 1 + 0/R₁ = 1: the signal still passes from the + input to the output.' }
  ],
  applications: [
    'Sensor amplifiers for piezo, pH and other high-resistance sources.',
    'Microphone and instrument preamplifiers.',
    'Scaling shunt and bridge signals up to an ADC\'s range.',
    'Gain stages inside active filters and regulators.'
  ],
  sim: { id: 'oa-config-lab', params: { config: 'noninv' } }
},

{
  id: 'voltage-follower', parent: 'opamp-circuits', title: 'The voltage follower', level: 1,
  short: 'An op-amp with its output tied to its − input copies the input voltage with a gain of exactly one — taking almost no current from the source and supplying whatever the load needs.',
  keywords: ['voltage follower', 'buffer', 'unity-gain buffer', 'impedance converter', 'loading', 'capacitive load', 'isolation resistor', 'ADC driver', 'guard'],
  prereq: ['non-inverting-amplifier', 'thevenin-norton', 'voltage-divider'],
  related: ['emitter-follower', 'sensor-interfacing', 'adc', 'gain-bandwidth', 'slew-rate', 'single-supply'],
  body: `
Connect the output of an op-amp straight to its − input and feed the signal to the + input. The golden rule says $V_- = V_+$, and $V_-$ is the output: the output copies the input.

$$V_\\text{out} = V_\\text{in}\\,\\frac{A}{1 + A} \\approx V_\\text{in}$$

A gain of one sounds useless. The point is the **impedances**: the input draws picoamps to nanoamps, while the output can supply milliamps with an output resistance of milliohms. The follower is an impedance converter — the [[non-inverting-amplifier]] with $R_f = 0$.

### Why you need one
Any source with internal resistance sags when loaded ([[thevenin-norton|Thévenin]]). A divider of two 100 kΩ resistors on 5 V is a 2.5 V source behind 50 kΩ; connect a 20 kΩ load and the output drops to 0.71 V. Put a follower between them and the load gets 2.5 V, while the divider sees nothing but the op-amp's input. The load current (125 µA here) comes from the op-amp's supply pins.

Typical jobs:
- **Buffering a reference or a bias divider** that must drive several inputs.
- **Driving an [[adc|ADC]].** A successive-approximation ADC charges a sampling capacitor at each conversion; a follower (often with a small RC between it and the ADC pin) supplies the spikes that a high-resistance sensor could not.
- **Isolating stages**, for instance two RC filter sections that would otherwise load each other.
- **Reading high-resistance sources**: pH electrodes (100 MΩ and more), piezo sensors, electrometer measurements.
- **Guarding.** A follower drives a copper ring around a sensitive high-impedance node at the node's own voltage, so no leakage current flows across the board surface.

### Where it goes wrong
- **Stability.** With all the output fed back, the loop gain is the largest it can be and the phase margin the smallest. Unity-gain-stable parts manage, but *decompensated* op-amps (sold as "stable for gains of 5 or more") oscillate as followers.
- **Capacitive loads.** A cable (roughly 100 pF per metre) together with the op-amp's output resistance adds lag inside the loop: ringing, or oscillation. A 50–100 Ω resistor in series with the output, outside the feedback, isolates the capacitance; some parts are specified to drive capacitive loads directly.
- **Input range.** In a follower both inputs swing with the whole signal. A TL072 cannot follow a signal within 3–4 V of its negative supply, and if its inputs are pushed below that its output may jump to the opposite rail (phase reversal). On a single supply use a rail-to-rail-input part such as the MCP6002 ([[single-supply]]).
- **Bias current through the source.** The input current flows through the source's resistance: 20 nA from an LM358 through a 500 MΩ pH electrode is a 10 V error. Electrometer-grade CMOS parts (the LMC6001 is specified at 25 fA) exist for such jobs.
- **Large, fast signals** expose the [[slew-rate]].
`,
  ideas: [
    'Output tied to the − input: the output copies the input, gain 1.',
    'Its value is the impedance change: almost no input current, low output resistance.',
    'The load current comes from the op-amp\'s supply, not from the source.',
    'Unity gain is the hardest case for stability, especially with capacitive loads.',
    'Both inputs follow the whole signal, so the input range must cover it.'
  ],
  pitfalls: [
    'A gain of one does nothing — The follower isolates a weak source from its load; that is often the most important job in a circuit.',
    'Any op-amp can be used as a follower — Decompensated op-amps are unstable at unity gain, and capacitive loads can make even stable ones ring.',
    'The follower\'s output current comes from the signal source — It comes from the supply pins; the source only supplies the tiny input current.'
  ],
  formulas: [
    {
      name: 'Gain of a follower with finite open-loop gain',
      expr: 'G = A/(1 + A)', tex: 'G = \\frac{A}{1 + A}',
      vars: {
        G: { name: 'follower gain', tex: 'G' },
        A: { name: 'open-loop gain', value: 100000, tex: 'A' }
      },
      note: 'With A = 100 000 the output is 10 ppm below the input.'
    },
    {
      name: 'Loaded source without a buffer',
      expr: 'VL = Vth*RL/(Rth + RL)', tex: 'V_L = V_{\\text{th}}\\,\\frac{R_L}{R_{\\text{th}} + R_L}',
      vars: {
        VL: { name: 'voltage across the load', q: 'voltage', unit: 'V', tex: 'V_L' },
        Vth: { name: 'open-circuit source voltage', q: 'voltage', unit: 'V', value: 2.5, tex: 'V_{\\text{th}}' },
        Rth: { name: 'source resistance', q: 'resistance', unit: 'kΩ', value: 50, tex: 'R_{\\text{th}}' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'kΩ', value: 20, tex: 'R_L' }
      },
      note: 'With a follower in between, the load gets the full $V_{\\text{th}}$.',
      stories: { VL: 'A reference of {Vth} with {Rth} of internal resistance feeds a {RL} load directly. What voltage does the load get?' }
    },
    {
      name: 'Error from bias current in the source resistance',
      expr: 'Verr = Ib*Rs', tex: 'V_{\\text{err}} = I_b R_s',
      vars: {
        Verr: { name: 'input error voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{err}}' },
        Ib: { name: 'op-amp input bias current', q: 'current', unit: 'nA', value: 20, tex: 'I_b' },
        Rs: { name: 'source resistance', q: 'resistance', unit: 'MΩ', value: 500, tex: 'R_s' }
      },
      stories: { Ib: 'A pH electrode with {Rs} of resistance must be read with an error below {Verr}. What is the largest bias current the buffer may draw?' }
    }
  ],
  examples: [
    {
      title: 'Buffering a divider reference',
      q: 'Two 100 kΩ resistors across 5 V make a 2.5 V reference, which must feed a 20 kΩ load. What does the load get without a buffer, and with a follower?',
      steps: [
        'Seen from its output the divider is 2.5 V behind $100 \\parallel 100 = 50\\ \\mathrm{k\\Omega}$.',
        'Without a buffer: $2.5 \\times 20/(50 + 20) = 0.71\\ \\mathrm{V}$ — useless.',
        'With a follower: 2.5 V at the load. The op-amp supplies $2.5\\ \\mathrm{V}/20\\ \\mathrm{k\\Omega} = 125\\ \\mu\\mathrm{A}$ from its own supply; the divider supplies only the op-amp\'s input current.'
      ],
      a: '0.71 V without a buffer, 2.5 V with one.'
    },
    {
      title: 'Reading a pH electrode',
      q: 'A pH electrode has 500 MΩ of internal resistance and a sensitivity of 59 mV per pH unit at 25 °C. Compare the error with an LM358 follower (20 nA bias current) and an LMC6001 (25 fA).',
      steps: [
        'LM358: $20\\ \\mathrm{nA} \\times 500\\ \\mathrm{M\\Omega} = 10\\ \\mathrm{V}$ — the reading is meaningless.',
        'LMC6001: $25\\ \\mathrm{fA} \\times 500\\ \\mathrm{M\\Omega} = 12.5\\ \\mu\\mathrm{V}$, about 0.0002 pH.',
        'Board leakage matters at this level too: a guard ring driven by the follower keeps the input traces surrounded by the same voltage.'
      ],
      a: '10 V of error with the LM358; about 12 µV with the electrometer-grade part.'
    }
  ],
  quiz: [
    { q: 'An op-amp with an open-loop gain of 100 000 is used as a follower. Its gain is…', choices: ['exactly 1', '0.99999', '1.00001', '100 000'], a: 1,
      why: 'A/(1 + A) = 100 000/100 001 ≈ 0.99999: ten parts per million low.' },
    { q: 'Why use a follower if its gain is only 1?', choices: ['to invert the signal', 'to isolate a high-resistance source from a load', 'to add gain–bandwidth', 'to remove noise'], a: 1,
      why: 'It draws almost nothing from the source and drives the load from the op-amp\'s supply, so the source is not loaded.' },
    { q: 'A follower driving a 10 m cable rings on every edge. The usual fix is…', choices: ['a bigger feedback resistor', 'a 50–100 Ω resistor in series with the output, outside the loop', 'a capacitor across the inputs', 'a higher supply voltage'], a: 1,
      why: 'The cable\'s capacitance adds phase lag inside the loop. A small series resistor separates the capacitance from the feedback point.' },
    { q: 'The current a follower delivers to its load is supplied by the signal source at its input.', a: false,
      why: 'The source supplies only the op-amp\'s input current; the load current comes through the op-amp\'s supply pins.' },
    { q: 'A TL072 on a single +5 V supply is used as a follower for a 0–1 V signal. What happens?', choices: ['it works perfectly', 'the input is below the TL072\'s input range and the output misbehaves', 'the gain becomes 2', 'the output is inverted but correct'], a: 1,
      why: 'A TL072\'s inputs must stay roughly 3–4 V above its negative supply. Near ground it cannot follow, and may even reverse phase. Use a rail-to-rail-input op-amp.' }
  ],
  applications: [
    'Buffering references, bias dividers and potentiometer wipers.',
    'Driving ADC inputs and cables.',
    'Reading pH electrodes, piezo sensors and other high-resistance sources.',
    'Guard drivers for high-impedance measurements.'
  ],
  sim: { id: 'oa-config-lab', params: { config: 'follower' } }
},

{
  id: 'summing-amplifier', parent: 'opamp-circuits', title: 'The summing amplifier', level: 2,
  short: 'Several inputs, each through its own resistor into a virtual earth: their currents add in the feedback resistor, so the output is a weighted, inverted sum — and the inputs do not disturb each other.',
  keywords: ['summing amplifier', 'summer', 'adder', 'mixer', 'weighted sum', 'level shifting', 'offset', 'binary-weighted DAC', 'virtual earth', 'noise gain'],
  prereq: ['inverting-amplifier', 'superposition', 'kirchhoffs-laws'],
  related: ['dac', 'difference-amplifier', 'single-supply', 'adc', 'gain-bandwidth'],
  body: `
Give an [[inverting-amplifier]] more than one input resistor, all meeting at the virtual earth. Each input pushes a current $V_k/R_k$ into the node, independently of the others, because the node stays at 0 V. The currents add ([[kirchhoffs-laws|Kirchhoff's current law]]) and flow together through $R_f$:

$$V_\\text{out} = -R_f\\left(\\frac{V_1}{R_1} + \\frac{V_2}{R_2} + \\cdots + \\frac{V_n}{R_n}\\right)$$

With equal resistors the output is minus the plain sum times $R_f/R$; with unequal ones, a **weighted** sum. It is [[superposition]] made into hardware.

### No interaction between inputs
Each source sees only its own resistor to 0 V. Turning one input up, or shorting it, does not change what the others contribute — which is exactly what an audio **mixer** needs: every channel has its own level control and none leaks into another.

### Level shifting: the everyday use
The most common summer in instrumentation adds a fixed reference to a signal, to scale and shift it into an [[adc|ADC's]] range. A ±10 V sensor signal can be mapped onto 0–3.3 V by one weight on the signal and another on a reference voltage (worked below). The output is inverted, which software can undo.

### A digital-to-analogue converter
Binary-weighted resistors — $R$, $2R$, $4R$, $8R$ — on the bits of a digital word make the output proportional to the number: the simplest [[dac|DAC]]. It does not scale well: 12 bits need resistors spanning 2048 : 1 matched to better than 0.02 %, which is why real converters use the R–2R ladder.

### The non-inverting summer
Inputs can also meet, through equal resistors, at the + input of a [[non-inverting-amplifier]]: that node takes the average of the inputs, and a gain of $n$ turns the average into the sum. It avoids the inversion, but the inputs now *do* interact — each source is loaded by the others through the resistors — so source resistances must be small compared with the summing resistors.

### The cost: noise gain
Seen from the op-amp, all the input resistors are in parallel from the − input to ground. The **noise gain** is $1 + R_f/(R_1 \\parallel R_2 \\parallel \\cdots)$, and it sets the bandwidth ([[gain-bandwidth]]) and how much the op-amp's own offset and noise are amplified. An eight-channel mixer at unity gain has a noise gain of 9: a ninth of the bandwidth, nine times the op-amp's offset.
`,
  ideas: [
    'Input currents V_k/R_k add at the virtual earth and flow through R_f.',
    'V_out = −R_f (V₁/R₁ + V₂/R₂ + …): a weighted, inverted sum.',
    'The inputs do not interact, because the summing node stays at 0 V.',
    'Adding a reference to a signal shifts and scales it into an ADC\'s range.',
    'Many inputs raise the noise gain, costing bandwidth and amplifying the op-amp\'s errors.'
  ],
  pitfalls: [
    'The inputs of any summer are independent — Only in the inverting summer. In the non-inverting version they interact through the summing resistors.',
    'The noise gain equals the signal gain — With n equal inputs and R_f = R the signal gain per input is −1 but the noise gain is n + 1.',
    'Binary-weighted resistors make a good DAC at any resolution — The resistor range and matching become impossible beyond a few bits; that is why R–2R ladders are used.'
  ],
  formulas: [
    {
      name: 'Two-input summing amplifier',
      expr: 'Vout = -Rf*(V1/R1 + V2/R2)', tex: 'V_{\\text{out}} = -R_f\\left(\\frac{V_1}{R_1} + \\frac{V_2}{R_2}\\right)',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}', signed: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_f' },
        V1: { name: 'input 1', q: 'voltage', unit: 'V', value: 1, tex: 'V_1', signed: true },
        R1: { name: 'input resistor 1', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        V2: { name: 'input 2', q: 'voltage', unit: 'V', value: -0.5, tex: 'V_2', signed: true },
        R2: { name: 'input resistor 2', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      },
      stories: { Vout: 'A summer has R_f = {Rf}, {V1} through {R1} and {V2} through {R2}. What is the output?' }
    },
    {
      name: 'Noise gain with n equal inputs',
      expr: 'NG = 1 + n*Rf/R', tex: '\\text{NG} = 1 + n\\,\\frac{R_f}{R}',
      vars: {
        NG: { name: 'noise gain', tex: '\\text{NG}' },
        n: { name: 'number of inputs', value: 4, int: true },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_f' },
        R: { name: 'each input resistor', q: 'resistance', unit: 'kΩ', value: 10 }
      },
      note: 'The bandwidth is the gain–bandwidth product divided by this, not by the signal gain.'
    }
  ],
  examples: [
    {
      title: 'Mapping ±10 V onto a 0–3.3 V ADC',
      q: 'Use an inverting summer on ±15 V, with a −5 V reference, to map a sensor range of −10 V … +10 V onto 3.3 V … 0 V.',
      steps: [
        'The slope must be $-3.3/20 = -0.165$, so $R_f/R_1 = 0.165$.',
        'At $V_s = 0$ the output must be 1.65 V: $-R_f(-5\\ \\mathrm{V})/R_2 = 1.65$, so $R_f/R_2 = 0.33$.',
        'Take $R_1 = 100\\ \\mathrm{k\\Omega}$, $R_f = 16.5\\ \\mathrm{k\\Omega}$ and $R_2 = 49.9\\ \\mathrm{k\\Omega}$ (E96 values).',
        'Check: $V_s = +10$: $-16.5(10/100 - 5/49.9) = 0.003\\ \\mathrm{V}$; $V_s = -10$: $-16.5(-10/100 - 5/49.9) = 3.30\\ \\mathrm{V}$.',
        'Add a clamp or a series resistor at the ADC pin so that a sensor fault cannot drive it beyond its supply.'
      ],
      a: 'R₁ = 100 kΩ, R₂ = 49.9 kΩ to −5 V, R_f = 16.5 kΩ.'
    },
    {
      title: 'A four-bit binary-weighted DAC',
      q: 'Logic outputs of 0 or 5 V drive 10, 20, 40 and 80 kΩ resistors into a summer with $R_f = 5\\ \\mathrm{k\\Omega}$. Find the output for 1111 and the step per count.',
      steps: [
        'Code 1111: $-5\\ \\mathrm{k\\Omega} \\times 5\\ \\mathrm{V} \\times (1/10 + 1/20 + 1/40 + 1/80)\\ \\mathrm{mS} = -4.6875\\ \\mathrm{V}$.',
        'The smallest step comes from the 80 kΩ input: $5 \\times 5/80 = 0.3125\\ \\mathrm{V}$ per count; 15 counts give 4.6875 V.',
        'An error of 1 % in the 10 kΩ resistor shifts the output by 0.025 V — already 8 % of a step. At 12 bits this approach fails.'
      ],
      a: '−4.69 V for 1111; −0.3125 V per count.'
    }
  ],
  quiz: [
    { q: 'A summer has 10 kΩ everywhere. The inputs are 1 V and −0.5 V. The output is…', choices: ['+0.5 V', '−0.5 V', '−1.5 V', '+1.5 V'], a: 1,
      why: '−(1 + (−0.5)) × 10/10 = −0.5 V.' },
    { q: 'Why does turning up one channel of an inverting mixer not change the others?', choices: ['each channel has its own op-amp', 'the summing node is held at 0 V, so each input current depends only on its own voltage and resistor', 'the resistors are large', 'the feedback resistor is small'], a: 1,
      why: 'The virtual earth makes the node voltage independent of the inputs, so each contributes V_k/R_k regardless of the rest.' },
    { q: 'A four-input summer uses the same resistor R for every input and for R_f. What is its noise gain?', choices: ['1', '4', '5', '0.25'], a: 2,
      why: '1 + R_f/(R/4) = 1 + 4 = 5: the bandwidth is a fifth of the gain–bandwidth product.' },
    { q: 'In a non-inverting summer, the input sources can affect each other.', a: true,
      why: 'They meet at a node that is not held at a fixed voltage, so each source drives current into the others through the resistors.' },
    { q: 'V₁ = 2 V goes through 20 kΩ and V₂ = 1 V through 10 kΩ into a summer with R_f = 10 kΩ. What is the output, in volts?', answer: -2,
      why: '−10 × (2/20 + 1/10) = −10 × 0.2 = −2 V.' }
  ],
  applications: [
    'Audio mixing desks.',
    'Offsetting and scaling signals into an ADC\'s input range.',
    'Simple binary-weighted DACs and waveform synthesis.',
    'Adding set-point and feedback signals in analogue controllers.'
  ],
  sim: { id: 'oa-config-lab', params: { config: 'sum' } }
},

{
  id: 'difference-amplifier', parent: 'opamp-circuits', title: 'The difference amplifier', level: 2,
  short: 'One op-amp and four resistors amplify the difference between two voltages and reject what they have in common — as well as the resistors are matched.',
  keywords: ['difference amplifier', 'differential amplifier', 'subtractor', 'common-mode rejection', 'CMRR', 'resistor matching', 'current sensing', 'high-side shunt', 'ground loop'],
  prereq: ['inverting-amplifier', 'non-inverting-amplifier', 'superposition'],
  related: ['instrumentation-amplifier', 'wheatstone-bridge', 'sensor-interfacing', 'strain-gauges'],
  body: `
Many signals are the difference between two voltages that both sit on something larger: the voltage across a current shunt in a 12 V line, the output of a [[wheatstone-bridge|bridge]] at half its supply, a signal arriving from another board whose ground is not quite yours. The difference amplifier measures the difference and ignores the rest.

### The circuit
$V_1$ drives the − input through $R_1$, with $R_2$ from the output back to it — an [[inverting-amplifier]]. $V_2$ reaches the + input through a divider $R_3$ over $R_4$ — feeding a [[non-inverting-amplifier]]. By [[superposition]]:

$$V_\\text{out} = V_2\\,\\frac{R_4}{R_3 + R_4}\\left(1 + \\frac{R_2}{R_1}\\right) - V_1\\,\\frac{R_2}{R_1}$$

Choose the ratios equal, $R_4/R_3 = R_2/R_1$, and the two paths have the same gain for a common signal:

$$V_\\text{out} = \\frac{R_2}{R_1}\\,(V_2 - V_1)$$

The **differential** input $V_2 - V_1$ is amplified; the **common-mode** voltage $(V_1 + V_2)/2$ cancels.

### Common-mode rejection and resistor matching
The cancellation is only as good as the match between $R_4/R_3$ and $R_2/R_1$. The **common-mode rejection ratio** compares the gain for the difference with the gain for the common part, $\\text{CMRR} = G_d/G_{cm}$, usually in dB. With four resistors of tolerance $t$ the worst case is

$$\\text{CMRR} \\approx \\frac{1 + G}{4t}$$

With $G = 1$ and 1 % resistors that is only 50 (34 dB); with 0.1 % resistors, 500 (54 dB). A higher gain helps. The op-amp's own CMRR (80–120 dB) is rarely the limit — the resistors are. Monolithic difference amplifiers with laser-trimmed resistors (the INA132 family, current-sense amplifiers such as the INA181 and INA240) reach 90 dB and more.

### The input resistances are neither high nor equal
$V_1$ sees $R_1$ into a node that moves with $V_2$; $V_2$ sees $R_3 + R_4$. So the two sources are loaded differently, and any source resistance adds to $R_1$ or $R_3$ and upsets the match — a 175 Ω bridge output in series with a 10 kΩ $R_1$ is a 1.7 % error. For sources with resistance, buffer both inputs first: that is the [[instrumentation-amplifier]].

### A useful trick: beyond the supply
If the resistors attenuate ($R_2 < R_1$), the op-amp's inputs see only a fraction of the common-mode voltage, so a difference amplifier can measure small differences riding on voltages beyond its supply. Specialised parts such as the INA117 accept ±200 V of common mode on ±15 V supplies.
`,
  ideas: [
    'V_out = (R₂/R₁)(V₂ − V₁) when R₄/R₃ = R₂/R₁.',
    'The common-mode voltage cancels only as well as the resistor ratios match.',
    'Worst-case CMRR ≈ (1 + G)/(4t) for resistor tolerance t.',
    'The two inputs present different, modest resistances; source resistance spoils the match.',
    'Attenuating versions can measure differences riding on voltages beyond the supply.'
  ],
  pitfalls: [
    'The op-amp\'s CMRR sets the circuit\'s CMRR — The resistors usually dominate: four 1 % resistors limit a unity-gain difference amplifier to about 34 dB.',
    'The difference amplifier has a high input impedance — Its inputs see R₁ and R₃ + R₄, tens of kilohms, and different ones.',
    'Only the ratio R₂/R₁ matters — R₄/R₃ must equal it; a mismatch turns common-mode voltage into output error.'
  ],
  derivation: {
    title: 'Derive the output by superposition',
    steps: [
      { text: 'With $V_2 = 0$ the + input is grounded through $R_3 \\parallel R_4$ (no current), and the circuit is an inverting amplifier:', tex: 'V_\\text{out,1} = -\\frac{R_2}{R_1}\\,V_1' },
      { text: 'With $V_1 = 0$, the + input is at $V_2 R_4/(R_3 + R_4)$ and the circuit is a non-inverting amplifier of gain $1 + R_2/R_1$:', tex: 'V_\\text{out,2} = V_2\\,\\frac{R_4}{R_3 + R_4}\\left(1 + \\frac{R_2}{R_1}\\right)' },
      { text: 'Add them. If $R_4/R_3 = R_2/R_1$ the factor on $V_2$ simplifies to $R_2/R_1$:', tex: 'V_\\text{out} = \\frac{R_2}{R_1}(V_2 - V_1)' },
      { text: 'Now set $V_1 = V_2 = V_{cm}$ with the ratios not quite equal. What is left is the common-mode gain:', tex: 'G_{cm} = \\frac{V_\\text{out}}{V_{cm}} = \\frac{R_1 R_4 - R_2 R_3}{R_1 (R_3 + R_4)}' }
    ]
  },
  formulas: [
    {
      name: 'Difference amplifier (matched ratios)',
      expr: 'Vout = R2/R1*(V2 - V1)', tex: 'V_{\\text{out}} = \\frac{R_2}{R_1}\\,(V_2 - V_1)',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}', signed: true },
        R2: { name: 'feedback resistor (= R₄)', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' },
        R1: { name: 'input resistor (= R₃)', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        V2: { name: 'voltage at the non-inverting side', q: 'voltage', unit: 'V', value: 12.2, tex: 'V_2', signed: true },
        V1: { name: 'voltage at the inverting side', q: 'voltage', unit: 'V', value: 12, tex: 'V_1', signed: true }
      },
      stories: { Vout: 'A difference amplifier with a gain of R₂/R₁ = {R2}/{R1} reads a shunt whose ends are at {V2} and {V1}. What is the output?' }
    },
    {
      name: 'Difference amplifier with any resistors',
      expr: 'Vout = V2*R4/(R3 + R4)*(1 + R2/R1) - V1*R2/R1', tex: 'V_{\\text{out}} = V_2\\,\\frac{R_4}{R_3 + R_4}\\left(1 + \\frac{R_2}{R_1}\\right) - V_1\\,\\frac{R_2}{R_1}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}', signed: true },
        V2: { name: 'non-inverting-side input', q: 'voltage', unit: 'V', value: 5.1, tex: 'V_2', signed: true },
        V1: { name: 'inverting-side input', q: 'voltage', unit: 'V', value: 5, tex: 'V_1', signed: true },
        R1: { name: 'input resistor, inverting side', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' },
        R3: { name: 'input resistor, non-inverting side', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_3' },
        R4: { name: 'resistor from + input to ground', q: 'resistance', unit: 'kΩ', value: 101, tex: 'R_4' }
      },
      note: 'With the defaults, one resistor 1 % high turns 5 V of common mode into 46 mV of error on a 1 V output.'
    },
    {
      name: 'Worst-case CMRR from resistor tolerance',
      expr: 'CMRR = 20*log((1 + G)/(4*t))', tex: '\\text{CMRR} = 20\\log_{10}\\frac{1 + G}{4t}',
      vars: {
        CMRR: { name: 'common-mode rejection', q: 'gain', unit: 'dB', tex: '\\text{CMRR}' },
        G: { name: 'differential gain R₂/R₁', value: 10, tex: 'G' },
        t: { name: 'resistor tolerance', q: 'ratio', unit: '%', value: 0.1 }
      },
      stories: { t: 'A difference amplifier with a gain of {G} must reject common mode by at least {CMRR}. What resistor tolerance do you need?' }
    }
  ],
  examples: [
    {
      title: 'High-side current sensing',
      q: 'A 0.1 Ω shunt sits in a 12 V supply line carrying 2 A. A difference amplifier with $G = 10$ ($R_1 = R_3 = 10\\ \\mathrm{k\\Omega}$, $R_2 = R_4 = 100\\ \\mathrm{k\\Omega}$) reads it. Find the output, and the worst-case error with 1 % and with 0.1 % resistors.',
      steps: [
        'Differential input $0.1 \\times 2 = 0.2\\ \\mathrm{V}$; ideal output $10 \\times 0.2 = 2.0\\ \\mathrm{V}$. The common mode is about 12 V.',
        '1 %: $\\text{CMRR} = 11/0.04 = 275$, so $G_{cm} = G/\\text{CMRR} = 0.036$, and 12 V of common mode gives up to $0.44\\ \\mathrm{V}$ of error — 22 % of the reading.',
        '0.1 %: CMRR 2750, error $0.044\\ \\mathrm{V}$, or 2.2 %.',
        'The + input sits at $12 \\times 100/110 = 10.9\\ \\mathrm{V}$, so the op-amp needs a supply of about 13 V or more. A dedicated current-sense amplifier with trimmed resistors does this job better.'
      ],
      a: '2.0 V ideally; up to 0.44 V error with 1 % resistors, 0.044 V with 0.1 %.'
    }
  ],
  quiz: [
    { q: 'Both inputs of a unity-gain difference amplifier (perfect resistors) are at 5 V. The output is…', choices: ['5 V', '10 V', '0 V', '2.5 V'], a: 2,
      why: 'The output is (R₂/R₁)(V₂ − V₁) = 0: a pure common-mode input is rejected.' },
    { q: 'A unity-gain difference amplifier is built with four 1 % resistors. Its worst-case CMRR is about…', choices: ['100 dB', '80 dB', '54 dB', '34 dB'], a: 3,
      why: '(1 + 1)/(4 × 0.01) = 50, i.e. 34 dB. Resistor matching, not the op-amp, limits it.' },
    { q: 'With the same resistor tolerance, a higher differential gain gives a better CMRR.', a: true,
      why: 'CMRR ≈ (1 + G)/(4t): the common-mode error stays roughly the same while the wanted signal is amplified more.' },
    { q: 'Why does a difference amplifier read a Wheatstone bridge poorly when its input resistors are 10 kΩ?', choices: ['10 kΩ is too noisy', 'the bridge\'s own output resistance adds to R₁ and R₃ and loads the bridge', 'the op-amp saturates', 'bridges need AC excitation'], a: 1,
      why: 'The bridge\'s few hundred ohms of source resistance appear in series with the input resistors, changing the gain and the ratio match. Buffer the inputs: an instrumentation amplifier.' }
  ],
  applications: [
    'High-side and low-side current sensing.',
    'Reading bridge sensors and thermocouples (usually via an instrumentation amplifier).',
    'Receiving signals across boards whose grounds differ (breaking ground loops).',
    'Measuring small differences on high voltages with attenuating parts.'
  ],
  sim: [{ id: 'oa-config-lab', params: { config: 'diff' } }, 'oa-inamp']
},

{
  id: 'instrumentation-amplifier', parent: 'opamp-circuits', title: 'The instrumentation amplifier', level: 3,
  short: 'Two buffering amplifiers sharing one gain resistor, then a difference amplifier: very high and equal input impedances, gain set by one resistor, and a common-mode rejection that grows with gain.',
  keywords: ['instrumentation amplifier', 'in-amp', 'INA', 'three-op-amp', 'gain resistor', 'R_G', 'CMRR', 'bridge', 'load cell', 'strain gauge', 'INA128', 'AD620', 'reference pin'],
  prereq: ['difference-amplifier', 'non-inverting-amplifier', 'wheatstone-bridge'],
  related: ['strain-gauges', 'sensor-interfacing', 'thermocouples', 'offset-bias', 'single-supply'],
  body: `
A load cell gives 10 mV at full load, sitting on 2.5 V of common-mode voltage, from a source resistance of a few hundred ohms, often with mains hum on its cable. A [[difference-amplifier]] alone loads it and needs impossibly well-matched resistors. The **instrumentation amplifier** fixes both problems.

### The three-op-amp circuit
The first stage is two [[non-inverting-amplifier|non-inverting amplifiers]], one per input, whose − inputs are joined by a single gain resistor $R_G$, each with a feedback resistor $R$ to its output. The golden rule puts the two ends of $R_G$ at $V_+$ and $V_-$ of the inputs, so a current $(V_+ - V_-)/R_G$ flows through $R_G$ and through both $R$'s. The difference between the two outputs is therefore

$$V_{o1} - V_{o2} = \\left(1 + \\frac{2R}{R_G}\\right)(V_+ - V_-)$$

while a **common-mode** input — both inputs moving together — puts no voltage across $R_G$, draws no current and passes through at a gain of exactly 1. The second stage is a unity-gain difference amplifier that removes the common part. The result:

- **Input impedance:** each input goes straight to an op-amp's + input — gigaohms, and equal for both inputs.
- **Gain from one resistor:** INA128: $G = 1 + 50\\ \\mathrm{k\\Omega}/R_G$; AD620: $1 + 49.4\\ \\mathrm{k\\Omega}/R_G$; INA333: $1 + 100\\ \\mathrm{k\\Omega}/R_G$.
- **Common-mode rejection that grows with gain:** the differential signal is amplified by $G$ before the difference stage, while the common mode is not, so the CMRR improves roughly in proportion to the gain. Monolithic parts with trimmed resistors reach well over 100 dB at high gain.

### Using one well
- **The REF pin.** The output is measured from the REF pin, which lets you shift it (to mid-supply on a single supply, for instance). REF connects to the bottom of the difference stage's divider, so it must be driven from a low impedance — a follower, not a divider — or the CMRR collapses.
- **Internal swing.** The first-stage outputs sit at $V_{cm} \\pm (G/2)(V_+ - V_-)$. At high gain and high common mode they can saturate while the output looks innocent. Data sheets show the allowed region as an input common-mode versus output voltage plot; check it, especially on a single supply.
- **A bias return.** The inputs draw bias current. A floating source — a thermocouple, a transformer winding, an AC-coupled input — needs a resistor from one or both inputs to ground or REF, or the inputs drift to a rail.
- **Filter the inputs carefully.** RC filters against radio-frequency interference must be matched on the two inputs, or the mismatch converts common-mode noise into a differential error.

### Bridge sensors
A [[strain-gauges|strain gauge]] with gauge factor $GF$ in a quarter bridge excited by $V_\\text{ex}$ gives $V_d \\approx V_\\text{ex}\\,GF\\,\\varepsilon/4$: 2.5 mV at 1000 µε on 5 V. Load cells are rated in mV/V: 2 mV/V at 5 V is 10 mV at full load. These millivolts ride on half the excitation as common mode, which the in-amp must reject.
`,
  ideas: [
    'Two non-inverting stages share one R_G: differential gain 1 + 2R/R_G, common-mode gain 1.',
    'A unity-gain difference stage then removes the common mode.',
    'Inputs go straight to op-amp + inputs: very high, equal impedances.',
    'The CMRR grows with gain, because the difference is amplified before the subtraction.',
    'Drive REF from a low impedance, provide a bias return, and respect the internal swing limits.'
  ],
  pitfalls: [
    'An instrumentation amplifier is any amplifier used for instruments — It is a specific differential amplifier with high, balanced input impedance and a precisely set gain.',
    'The REF pin can be tied to a resistor divider — REF must see a low impedance; a divider in series unbalances the difference stage and ruins the CMRR.',
    'A floating source can be connected directly — Without a DC return path for the bias currents the inputs drift out of range.'
  ],
  derivation: {
    title: 'Derive the gain of the first stage',
    steps: [
      { text: 'Each input op-amp holds its − input at its + input, so the ends of $R_G$ are at $V_+$ and $V_-$. The current through it:', tex: 'I = \\frac{V_+ - V_-}{R_G}' },
      { text: 'No current enters the op-amps, so the same current flows through both feedback resistors $R$, and the outputs are', tex: 'V_{o1} = V_+ + IR, \\qquad V_{o2} = V_- - IR' },
      { text: 'Subtract:', tex: 'V_{o1} - V_{o2} = (V_+ - V_-) + 2IR = \\left(1 + \\frac{2R}{R_G}\\right)(V_+ - V_-)' },
      { text: 'For a common-mode input $V_+ = V_- = V_{cm}$ the current is zero and both outputs equal $V_{cm}$: the first stage passes common mode at unity gain, and the unity-gain difference stage then subtracts it.', tex: 'V_{o1} = V_{o2} = V_{cm}' }
    ]
  },
  formulas: [
    {
      name: 'Gain of a three-op-amp instrumentation amplifier',
      expr: 'G = 1 + 2*R/RG', tex: 'G = 1 + \\frac{2R}{R_G}',
      vars: {
        G: { name: 'gain', tex: 'G' },
        R: { name: 'first-stage feedback resistor', q: 'resistance', unit: 'kΩ', value: 25 },
        RG: { name: 'gain resistor', q: 'resistance', unit: 'Ω', value: 505, tex: 'R_G' }
      },
      note: 'For the INA128, $R = 25\\ \\mathrm{k\\Omega}$, so $G = 1 + 50\\ \\mathrm{k\\Omega}/R_G$.',
      stories: { RG: 'An INA128 (internal R = {R}) must have a gain of {G}. What gain resistor do you need?' }
    },
    {
      name: 'Quarter-bridge strain-gauge output',
      expr: 'Vd = Vex*GF*eps/4', tex: 'V_d \\approx \\frac{V_{\\text{ex}}\\,\\mathrm{GF}\\,\\varepsilon}{4}',
      vars: {
        Vd: { name: 'bridge output', q: 'voltage', unit: 'mV', tex: 'V_d' },
        Vex: { name: 'excitation voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{ex}}' },
        GF: { name: 'gauge factor', value: 2, tex: '\\mathrm{GF}' },
        eps: { name: 'strain', q: 'strain', unit: 'µε', value: 1000, tex: '\\varepsilon' }
      },
      note: 'For small strains; one active gauge. A half bridge doubles it, a full bridge quadruples it.',
      stories: { Vd: 'A foil gauge (gauge factor {GF}) in a quarter bridge on {Vex} sees {eps}. What does the bridge output?' }
    },
    {
      name: 'Full-scale output of a load cell',
      expr: 'Vd = Vex*S', tex: 'V_d = V_{\\text{ex}}\\,S',
      vars: {
        Vd: { name: 'full-scale output', q: 'voltage', unit: 'mV', tex: 'V_d' },
        Vex: { name: 'excitation voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{ex}}' },
        S: { name: 'rated output (mV/V, written in ‰)', q: 'ratio', unit: '‰', value: 2 }
      },
      note: 'A rated output of 2 mV/V is 2 ‰ of the excitation.'
    },
    {
      name: 'Input error from common-mode voltage',
      expr: 'Verr = Vcm/10^(CMRR/20)', tex: 'V_{\\text{err}} = \\frac{V_{cm}}{10^{\\text{CMRR}/20}}',
      vars: {
        Verr: { name: 'equivalent differential error', q: 'voltage', unit: 'µV', tex: 'V_{\\text{err}}' },
        Vcm: { name: 'common-mode voltage', q: 'voltage', unit: 'V', value: 2.5, tex: 'V_{cm}' },
        CMRR: { name: 'common-mode rejection', q: 'gain', unit: 'dB', value: 100, tex: '\\text{CMRR}' }
      },
      stories: { CMRR: 'A bridge sits at {Vcm} of common mode and the error it causes must stay below {Verr}. What CMRR does the amplifier need?' }
    }
  ],
  examples: [
    {
      title: 'Designing a load-cell amplifier',
      q: 'A 350 Ω load cell rated at 2 mV/V is excited from 5 V. Using an INA128 on ±15 V, scale its full load to about 4 V.',
      steps: [
        'Full-scale bridge output: $5\\ \\mathrm{V} \\times 2\\ \\mathrm{mV/V} = 10\\ \\mathrm{mV}$, on a common mode of 2.5 V.',
        'Gain $4\\ \\mathrm{V}/10\\ \\mathrm{mV} = 400$: $R_G = 50\\ \\mathrm{k\\Omega}/(400 - 1) = 125\\ \\Omega$; the E96 value 124 Ω gives $G = 404$ and 4.04 V.',
        'First-stage outputs: $2.5 \\pm 404 \\times 0.01/2 = 2.5 \\pm 2.02\\ \\mathrm{V}$ — comfortably inside ±15 V. On a single 5 V supply they would crowd the rails: check the data sheet\'s common-mode plot.',
        'Use a metal-film $R_G$ with a low temperature coefficient: the gain drifts with it.'
      ],
      a: 'R_G = 124 Ω, G ≈ 404, 4.04 V at full load.'
    },
    {
      title: 'How much CMRR does a strain gauge need?',
      q: 'A quarter bridge on 5 V ($GF = 2$) must resolve 10 µε. The common mode is 2.5 V. How much CMRR keeps the common-mode error below the signal of 10 µε?',
      steps: [
        'Signal at 10 µε: $5 \\times 2 \\times 10\\times 10^{-6}/4 = 25\\ \\mu\\mathrm{V}$.',
        'A fixed common-mode error can be zeroed in calibration, but its drift and hum cannot; keep it below 25 µV to be safe.',
        '$\\text{CMRR} \\ge 20\\log_{10}(2.5\\ \\mathrm{V}/25\\ \\mu\\mathrm{V}) = 100\\ \\mathrm{dB}$ — an in-amp at high gain, not a discrete difference amplifier.'
      ],
      a: 'At least 100 dB.'
    }
  ],
  quiz: [
    { q: 'An INA128 (G = 1 + 50 kΩ/R_G) has R_G = 5.49 kΩ. Its gain is about…', choices: ['9.1', '10.1', '50', '91'], a: 1,
      why: '1 + 50/5.49 = 1 + 9.1 = 10.1.' },
    { q: 'What is the common-mode gain of the first stage of a three-op-amp instrumentation amplifier?', choices: ['0', '1', 'the same as the differential gain', '−1'], a: 1,
      why: 'A common-mode input puts no voltage across R_G, so no current flows in the feedback resistors and each output simply follows its input.' },
    { q: 'An engineer ties an in-amp\'s REF pin to the midpoint of a 10 kΩ/10 kΩ divider to shift the output to mid-supply. What goes wrong?', choices: ['nothing', 'the gain doubles', 'the divider\'s resistance unbalances the internal difference stage and the CMRR drops', 'the inputs saturate'], a: 2,
      why: 'REF is the bottom of a precisely matched resistor divider inside the part. 5 kΩ in series with it upsets the match. Buffer the divider with a follower.' },
    { q: 'Why is an instrumentation amplifier preferred to a single difference amplifier for a 350 Ω bridge?', choices: ['it is cheaper', 'it has high, equal input impedances, gain set by one resistor, and higher CMRR', 'it needs no power supply', 'it works without excitation'], a: 1,
      why: 'The bridge\'s source resistance does not load or unbalance its inputs, and the CMRR improves with gain.' },
    { q: 'A thermocouple, floating with respect to ground, is wired straight to an in-amp\'s inputs. The output soon sits at a rail.', a: true,
      why: 'The inputs\' bias currents have no path to ground, so the input voltages drift out of the common-mode range. Add a resistor from an input to ground or REF.' }
  ],
  applications: [
    'Load cells, pressure sensors and strain gauges.',
    'Thermocouple and RTD front ends.',
    'Medical signals such as ECG, which are microvolts on large common-mode interference.',
    'Current sensing and bridge measurements in data-acquisition systems.'
  ],
  sim: 'oa-inamp'
},

{
  id: 'integrator-differentiator', parent: 'opamp-circuits', title: 'Integrator and differentiator', level: 2,
  short: 'A capacitor in the feedback path makes the output the running integral of the input; swap it with the input resistor and the output is the derivative. Both need taming in practice.',
  keywords: ['integrator', 'differentiator', 'Miller integrator', 'capacitor', 'RC', 'triangle wave', 'drift', 'leaky integrator', 'reset', 'PID', 'charge amplifier', 'dual-slope ADC'],
  prereq: ['inverting-amplifier', 'capacitors', 'math:definite-integral', 'math:derivative'],
  related: ['offset-bias', 'active-filters', 'rc-transient', 'relaxation-oscillators', 'physics:rc-circuits'],
  body: `
In an [[inverting-amplifier]] the input current $V_\\text{in}/R$ flows into a virtual earth and on through the feedback component. Make that component a capacitor and the current does not set a voltage — it sets a *rate of change*: $i = C\\,dv/dt$. The output now accumulates the input.

### The integrator
The current $V_\\text{in}/R$ charges $C$, whose left plate is held at 0 V, so

$$V_\\text{out}(t) = -\\frac{1}{RC}\\int_0^t V_\\text{in}\\,dt + V_\\text{out}(0)$$

— the [[math:definite-integral|integral]] of the input, scaled by $1/RC$ and inverted. A constant input gives a ramp: 1 V through 10 kΩ into 100 nF moves the output 1 V per millisecond. A square wave becomes a triangle; a triangle becomes smooth parabolic arcs; a sine becomes a cosine. In the frequency domain the gain is $-1/(j\\omega RC)$: it falls at 20 dB per decade, passes unity at $f = 1/(2\\pi RC)$ and shifts the phase by 90° (on top of the inversion). Compared with a passive [[rc-low-pass|RC low-pass]], which integrates only while its output is small, the op-amp version integrates perfectly, because the capacitor always charges from a fixed 0 V node.

### The integrator's weakness: DC
At DC the capacitor is an open circuit and the gain is infinite. Any constant error — the op-amp's [[offset-bias|offset voltage]], its bias current, a tiny DC component of the input — is integrated for ever, and the output creeps until it sits at a rail. Three cures:
- **A reset switch** across $C$ (an analogue switch or a MOSFET) discharges it at the start of each measurement: the integrate-and-dump used in dual-slope ADCs and charge measurements.
- **A leak resistor** $R_f$ across $C$ limits the DC gain to $-R_f/R$. The circuit then integrates only above $f_c = 1/(2\\pi R_f C)$ — make that a decade below the lowest signal frequency.
- **An outer loop.** In a PID controller or a phase-locked loop the rest of the loop drives the integrator's input to zero on average, so no leak is needed — that is what an integral term is for.

### The differentiator
Swap $R$ and $C$: now the input current is $C\\,dV_\\text{in}/dt$ and

$$V_\\text{out} = -RC\\,\\frac{dV_\\text{in}}{dt}$$

— the [[math:derivative|derivative]]. A triangle wave becomes a square wave; a ramp becomes a constant. The gain is $-j\\omega RC$ and *rises* 20 dB per decade without limit. That is the problem: noise and interference are mostly at high frequency, so a pure differentiator amplifies them most, and together with the op-amp's own roll-off it forms a lightly damped second-order loop that rings or oscillates. The practical differentiator puts a resistor $R_s$ in series with $C$ and a small capacitor $C_f$ across $R$: it differentiates up to a chosen frequency and then behaves as a modest fixed gain that falls away. In control systems the derivative term is filtered for the same reason.

### Where they are used
- **Function generators:** a [[schmitt-trigger|Schmitt trigger]] driving an integrator, whose output feeds back to the trigger, makes a triangle and a square wave.
- **Charge amplifiers:** a piezo accelerometer delivers charge; an integrator turns it into a voltage.
- **Dual-slope ADCs** integrate the input for a fixed time, then time the de-integration with a reference.
- **Analogue PID controllers** and filters: an integrator is the core of every state-variable filter.
`,
  ideas: [
    'Integrator: V_out = −(1/RC)∫V_in dt; the gain falls 20 dB/decade and is unity at 1/(2πRC).',
    'Square in, triangle out; a doubled frequency halves the output.',
    'An integrator integrates its own offsets too, and drifts to a rail unless reset or leaked.',
    'Differentiator: V_out = −RC dV_in/dt; its gain rises with frequency, amplifying noise.',
    'Practical differentiators limit the high-frequency gain with a series resistor and a feedback capacitor.'
  ],
  pitfalls: [
    'An integrator with no input stays at zero — Offset voltage and bias current are integrated too; the output drifts until it hits a rail.',
    'A differentiator is just an integrator the other way round — Its gain rises with frequency, so it amplifies noise and tends to ring or oscillate unless its high-frequency gain is limited.',
    'A leak resistor spoils the integrator — It only stops integration below 1/(2πR_f C); above that corner the circuit still integrates.'
  ],
  derivation: {
    title: 'Derive the integrator from the capacitor law',
    steps: [
      { text: 'The − input is a virtual earth, so the input current is fixed by $R$ and all of it enters the capacitor:', tex: 'i = \\frac{V_\\text{in}}{R}' },
      { text: 'The capacitor sits between 0 V and the output, so its voltage is $0 - V_\\text{out}$ and its current is', tex: 'i = C\\,\\frac{d(0 - V_\\text{out})}{dt} = -C\\,\\frac{dV_\\text{out}}{dt}' },
      { text: 'Equate the two and integrate both sides from 0 to $t$ (see [[math:definite-integral|the definite integral]]):', tex: '\\frac{dV_\\text{out}}{dt} = -\\frac{V_\\text{in}}{RC} \\;\\Rightarrow\\; V_\\text{out}(t) = V_\\text{out}(0) - \\frac{1}{RC}\\int_0^t V_\\text{in}\\,dt' },
      { text: 'For a sine $V_\\text{in} = V_p\\sin\\omega t$ the integral gives a cosine of amplitude', tex: '|V_\\text{out}| = \\frac{V_p}{\\omega RC} \\quad (\\text{unity at } \\omega = 1/RC)' }
    ]
  },
  formulas: [
    {
      name: 'Integrator: output change for a constant input',
      expr: 'dV = -Vin*t/(R*C)', tex: '\\Delta V_{\\text{out}} = -\\frac{V_{\\text{in}}\\,t}{RC}',
      vars: {
        dV: { name: 'change of the output', q: 'voltage', unit: 'V', tex: '\\Delta V_{\\text{out}}', signed: true },
        Vin: { name: 'constant input voltage', q: 'voltage', unit: 'V', value: 1, tex: 'V_{\\text{in}}', signed: true },
        t: { name: 'integration time', q: 'time', unit: 'ms', value: 1 },
        R: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'feedback capacitor', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { t: 'An integrator with R = {R} and C = {C} has {Vin} at its input. How long until its output has moved by {dV}?' }
    },
    {
      name: 'Unity-gain frequency',
      expr: 'fu = 1/(2*pi*R*C)', tex: 'f_u = \\frac{1}{2\\pi RC}',
      vars: {
        fu: { name: 'frequency where the gain is 1', q: 'frequency', unit: 'Hz', tex: 'f_u' },
        R: { name: 'resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitor', q: 'capacitance', unit: 'nF', value: 100 }
      },
      note: 'An integrator\'s gain is $f_u/f$; a differentiator\'s is $f/f_u$.'
    },
    {
      name: 'Triangle from a square wave',
      expr: 'Vpp = Vp/(2*f*R*C)', tex: 'V_{pp} = \\frac{V_p}{2fRC}',
      vars: {
        Vpp: { name: 'triangle peak-to-peak', q: 'voltage', unit: 'V', tex: 'V_{pp}' },
        Vp: { name: 'square-wave amplitude (±)', q: 'voltage', unit: 'V', value: 1, tex: 'V_p' },
        f: { name: 'frequency', q: 'frequency', unit: 'kHz', value: 1 },
        R: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'feedback capacitor', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { C: 'A ±{Vp} square wave at {f} drives an integrator with R = {R}. What capacitor gives a triangle of {Vpp} peak-to-peak?' }
    },
    {
      name: 'Differentiator: output for a ramp',
      expr: 'Vout = -R*C*k', tex: 'V_{\\text{out}} = -RC\\,\\dot{V}_{\\text{in}}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}', signed: true },
        R: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'input capacitor', q: 'capacitance', unit: 'nF', value: 100 },
        k: { name: 'input slope dV_in/dt', q: 'slewrate', unit: 'V/ms', value: 2, tex: '\\dot{V}_{\\text{in}}', signed: true }
      }
    },
    {
      name: 'Leaky integrator: lowest integrating frequency',
      expr: 'fc = 1/(2*pi*Rf*C)', tex: 'f_c = \\frac{1}{2\\pi R_f C}',
      vars: {
        fc: { name: 'corner frequency', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        Rf: { name: 'leak resistor across C', q: 'resistance', unit: 'MΩ', value: 1, tex: 'R_f' },
        C: { name: 'feedback capacitor', q: 'capacitance', unit: 'nF', value: 100 }
      },
      note: 'Below $f_c$ the gain levels off at $-R_f/R$; well above it the circuit integrates.'
    }
  ],
  examples: [
    {
      title: 'A triangle from a square wave',
      q: 'A ±1 V, 1 kHz square wave drives an integrator with $R = 10\\ \\mathrm{k\\Omega}$ and $C = 100\\ \\mathrm{nF}$. What does the output look like? What happens at 2 kHz?',
      steps: [
        'During each half-cycle (0.5 ms) the input is constant, so the output ramps at $1\\ \\mathrm{V}/(10\\ \\mathrm{k\\Omega} \\times 100\\ \\mathrm{nF}) = 1\\ \\mathrm{V/ms}$.',
        'In 0.5 ms it moves 0.5 V, then ramps back: a triangle of 0.5 V peak-to-peak (±0.25 V if it starts centred).',
        'At 2 kHz each half-cycle lasts only 0.25 ms: 0.25 V peak-to-peak — the gain falls as $1/f$.'
      ],
      a: 'A 0.5 V peak-to-peak triangle at 1 kHz; 0.25 V at 2 kHz.'
    },
    {
      title: 'Choosing a leak resistor',
      q: 'The integrator above must work for signals from 50 Hz upwards, and must not drift. Choose a leak resistor and find the DC output from a 2 mV offset.',
      steps: [
        'Put the corner a decade below 50 Hz: $f_c = 5\\ \\mathrm{Hz}$, so $R_f = 1/(2\\pi \\times 5 \\times 100\\ \\mathrm{nF}) = 318\\ \\mathrm{k\\Omega}$; use 330 kΩ.',
        'The DC gain is now $-330/10 = -33$. The offset appears at the output multiplied by the noise gain $1 + 33 = 34$: about 68 mV — a small, fixed offset instead of a drift to the rail.',
        'At 50 Hz the phase is within 6° of a true integrator\'s.'
      ],
      a: 'R_f ≈ 330 kΩ; a steady 68 mV output offset instead of drift.'
    }
  ],
  quiz: [
    { q: 'A square wave drives an ideal integrator. The output is…', choices: ['a square wave', 'a triangle wave', 'a sine wave', 'a train of spikes'], a: 1,
      why: 'Each half-cycle is a constant input, which the integrator turns into a straight ramp; the ramps alternate in direction.' },
    { q: 'The frequency of a sine wave into an integrator is doubled. The output amplitude…', choices: ['doubles', 'halves', 'stays the same', 'falls to a quarter'], a: 1,
      why: 'The integrator\'s gain is 1/(ωRC): twice the frequency, half the output.' },
    { q: 'An integrator with its input grounded slowly drifts until its output sits at a rail. Why?', choices: ['the capacitor leaks', 'the op-amp\'s offset voltage and bias current are integrated', 'the feedback is positive', 'the supply is noisy'], a: 1,
      why: 'A few millivolts of offset across R is a constant current into C; with infinite DC gain it ramps for ever. Reset it, add a leak resistor, or close an outer loop.' },
    { q: 'Why is a pure differentiator a poor circuit in practice?', choices: ['its gain falls with frequency', 'its gain rises with frequency, so it amplifies noise and tends to ring', 'it cannot handle DC', 'it inverts the signal'], a: 1,
      why: 'Noise and interference live mostly at high frequency, where the differentiator\'s gain is largest; combined with the op-amp\'s roll-off it forms a lightly damped loop.' },
    { q: 'A triangle wave rising at 2 V/ms enters a differentiator with R = 10 kΩ and C = 100 nF. What is the output while it rises, in volts?', answer: -2,
      why: '−RC · dV/dt = −(1 ms)(2 V/ms) = −2 V: a constant level, so the triangle becomes a square wave.' }
  ],
  applications: [
    'Triangle and square function generators.',
    'Charge amplifiers for piezo accelerometers and force sensors.',
    'Dual-slope and charge-balancing ADCs.',
    'The integral and derivative terms of analogue PID controllers; state-variable filters.'
  ],
  sim: 'oa-integrator'
},

{
  id: 'transimpedance', parent: 'opamp-circuits', title: 'The transimpedance amplifier', level: 3,
  short: 'An op-amp that turns a small current into a voltage, V_out = I·R_f, while holding the source at a fixed voltage — the standard photodiode amplifier, and a lesson in feedback stability.',
  keywords: ['transimpedance amplifier', 'TIA', 'current-to-voltage converter', 'photodiode amplifier', 'feedback capacitor', 'junction capacitance', 'noise gain', 'peaking', 'stability', 'OPA380'],
  prereq: ['inverting-amplifier', 'photodiodes', 'gain-bandwidth'],
  related: ['negative-feedback', 'noise-snr', 'optocouplers', 'sensor-interfacing', 'offset-bias'],
  body: `
Some sensors deliver a **current**: a photodiode (nanoamps to milliamps in proportion to light), a photomultiplier, an ionisation chamber, an electrochemical cell. The transimpedance amplifier (TIA) converts it into a voltage. It is an [[inverting-amplifier]] with the input resistor removed: the current goes straight into the virtual earth and out through $R_f$,

$$V_\\text{out} = -I_\\text{in} R_f$$

(or $+I R_f$ with the [[photodiodes|photodiode]] turned round, cathode to the − input). The "gain" has units of ohms — volts per amp — hence *trans-impedance*: 1 MΩ gives 1 V per µA.

### Why not just a resistor?
A photodiode feeding a 1 MΩ resistor also gives 1 V per µA — but the diode's own voltage then changes with the light. That makes the response nonlinear (the diode starts to forward-bias and swallow its own current) and slow, because every change must charge the diode's junction capacitance $C_j$ (tens of picofarads) through 1 MΩ. The TIA holds the diode at 0 V (or at a fixed reverse bias), so its current is linear in the light and $C_j$ never has to charge.

### The stability problem
That capacitance is still there, from the − input to ground, and it changes the feedback: at high frequency $C_j$ shunts the input, the fraction fed back shrinks, and the **noise gain** rises above $f_z = 1/(2\\pi R_f C_j)$. The rising noise gain meets the op-amp's falling open-loop gain at a steep angle, with almost 180° of phase lag: the loop rings, and may oscillate. A small **feedback capacitor** $C_f$ across $R_f$ fixes it by levelling off the noise gain. The value for a flat (Butterworth) response is about

$$C_f = \\sqrt{\\frac{C_j}{\\pi R_f\\,\\text{GBW}}}$$

and the bandwidth is then close to

$$f_{-3\\,\\text{dB}} \\approx \\sqrt{\\frac{\\text{GBW}}{2\\pi R_f C_j}}$$

— the geometric mean of the op-amp's gain–bandwidth product and $f_z$. Picofarads are typical, and the resistor's own stray capacitance (about 0.1–0.2 pF for a small SMD part) already counts towards $C_f$.

### Design choices
- **Op-amp:** FET or CMOS input, because its bias current flows through $R_f$: 1 nA through 10 MΩ is a 10 mV error. Low voltage noise matters too, since the noise gain is high. Parts made for the job, such as the OPA380, combine a high GBW with picoamp inputs.
- **$R_f$ as large as the output swing allows.** The signal grows with $R_f$, but the resistor's thermal noise current $\\sqrt{4kT/R_f}$ *falls*, so a larger $R_f$ improves the signal-to-noise ratio. The cost is bandwidth, which falls as $1/\\sqrt{R_f}$.
- **Photodiode bias:** zero bias (photovoltaic mode) gives the lowest dark current and noise; reverse bias (photoconductive mode) lowers $C_j$ — a BPW34 drops from about 70 pF at 0 V to about 25 pF at 3 V — for more speed.
`,
  ideas: [
    'A TIA turns current into voltage: V_out = I·R_f, in ohms of "gain".',
    'The virtual earth holds the photodiode at a fixed voltage, so its response is linear and C_j never charges.',
    'The diode\'s capacitance raises the noise gain at high frequency and makes the loop ring.',
    'A feedback capacitor C_f ≈ √(C_j/(πR_f·GBW)) gives a flat response.',
    'Bandwidth ≈ √(GBW/(2πR_f C_j)); larger R_f gives better signal-to-noise but less bandwidth.'
  ],
  pitfalls: [
    'A resistor across the photodiode does the same job — It gives the same gain, but the diode voltage then varies with light, making the response nonlinear and slowed by C_j.',
    'Any op-amp that is unity-gain stable is stable as a TIA — The diode capacitance raises the noise gain where the op-amp\'s phase lag is largest; without C_f most TIAs ring or oscillate.',
    'A larger feedback capacitor is always safer — It stabilises the loop but sets a pole at 1/(2πR_f C_f); too much and the amplifier becomes slow.'
  ],
  formulas: [
    {
      name: 'Output of a transimpedance amplifier',
      expr: 'Vout = I*Rf', tex: 'V_{\\text{out}} = I\\,R_f',
      vars: {
        Vout: { name: 'output voltage (magnitude)', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        I: { name: 'input current', q: 'current', unit: 'µA', value: 5 },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' }
      },
      stories: { Rf: 'A photodiode gives up to {I}, and the output must reach {Vout} at that current. What feedback resistor do you need?' }
    },
    {
      name: 'Photocurrent from optical power',
      expr: 'I = Rr*P', tex: 'I = \\mathcal{R}\\,P',
      vars: {
        I: { name: 'photocurrent', q: 'current', unit: 'µA' },
        Rr: { name: 'responsivity', unit: 'A/W', value: 0.55, tex: '\\mathcal{R}' },
        P: { name: 'optical power on the diode', q: 'power', unit: 'µW', value: 10 }
      },
      note: 'Silicon photodiodes give about 0.5–0.6 A/W in the near infrared.'
    },
    {
      name: 'Feedback capacitor for a flat response',
      expr: 'Cf = sqrt(Cj/(pi*Rf*GBW))', tex: 'C_f = \\sqrt{\\frac{C_j}{\\pi R_f\\,\\text{GBW}}}',
      vars: {
        Cf: { name: 'feedback capacitor', q: 'capacitance', unit: 'pF', tex: 'C_f' },
        Cj: { name: 'total input capacitance (diode + op-amp)', q: 'capacitance', unit: 'pF', value: 20, tex: 'C_j' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' },
        GBW: { name: 'op-amp gain–bandwidth product', q: 'frequency', unit: 'MHz', value: 8, tex: '\\text{GBW}' }
      },
      note: 'Assumes $C_f \\ll C_j$. A value about 30 % smaller gives a little peaking and more speed.'
    },
    {
      name: 'Bandwidth of a compensated TIA',
      expr: 'f3 = sqrt(GBW/(2*pi*Rf*Cj))', tex: 'f_{-3\\,\\text{dB}} \\approx \\sqrt{\\frac{\\text{GBW}}{2\\pi R_f C_j}}',
      vars: {
        f3: { name: '−3 dB bandwidth', q: 'frequency', unit: 'kHz', tex: 'f_{-3\\,\\text{dB}}' },
        GBW: { name: 'op-amp gain–bandwidth product', q: 'frequency', unit: 'MHz', value: 8, tex: '\\text{GBW}' },
        Rf: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_f' },
        Cj: { name: 'total input capacitance', q: 'capacitance', unit: 'pF', value: 20, tex: 'C_j' }
      },
      stories: { GBW: 'A TIA with R_f = {Rf} on a photodiode of {Cj} must reach {f3}. What gain–bandwidth product must the op-amp have?' }
    }
  ],
  examples: [
    {
      title: 'Designing a photodiode amplifier',
      q: 'A silicon photodiode (0.55 A/W, 20 pF including the op-amp\'s input) receives up to 10 µW. The output should reach about 0.5 V, using an OPA2134 (GBW 8 MHz). Choose $R_f$ and $C_f$ and estimate the bandwidth.',
      steps: [
        'Photocurrent: $0.55 \\times 10\\ \\mu\\mathrm{W} = 5.5\\ \\mu\\mathrm{A}$. For 0.5 V: $R_f \\approx 91\\ \\mathrm{k\\Omega}$; take 100 kΩ (0.55 V).',
        '$C_f = \\sqrt{20\\ \\mathrm{pF}/(\\pi \\times 100\\ \\mathrm{k\\Omega} \\times 8\\ \\mathrm{MHz})} = 2.8\\ \\mathrm{pF}$; fit 2.7 pF (the resistor adds a little stray).',
        'Bandwidth $\\approx \\sqrt{8\\ \\mathrm{MHz}/(2\\pi \\times 100\\ \\mathrm{k\\Omega} \\times 20\\ \\mathrm{pF})} \\approx 800\\ \\mathrm{kHz}$.',
        'Without $C_f$ the same circuit peaks by nearly 20 dB and rings on every light pulse — try it in the simulation.'
      ],
      a: 'R_f = 100 kΩ, C_f ≈ 2.7 pF, about 0.8 MHz of bandwidth.'
    }
  ],
  quiz: [
    { q: 'A TIA has R_f = 1 MΩ. A photocurrent of 2.5 µA gives an output of…', choices: ['2.5 mV', '0.25 V', '2.5 V', '25 V'], a: 2,
      why: 'V = I·R_f = 2.5 µA × 1 MΩ = 2.5 V.' },
    { q: 'What voltage does the photodiode see in a TIA?', choices: ['the output voltage', 'essentially 0 V (or the fixed bias), because it is held by the virtual earth', 'half the supply', 'it varies with the light'], a: 1,
      why: 'The diode connects to the virtual earth, so its voltage does not change with the signal; its current is therefore linear in the light and its capacitance is never charged.' },
    { q: 'A TIA with no feedback capacitor rings on every light pulse. What causes it?', choices: ['the photodiode\'s dark current', 'the diode\'s capacitance raising the noise gain where the op-amp has little phase margin', 'too small an R_f', 'the light source flickering'], a: 1,
      why: 'C_j makes the fed-back fraction fall at high frequency, so the loop closes at a steep rate with nearly 180° of lag. C_f restores the margin.' },
    { q: 'In a compensated TIA, R_f is quadrupled (with C_f re-optimised). The bandwidth…', choices: ['falls to a quarter', 'halves', 'is unchanged', 'doubles'], a: 1,
      why: 'f ≈ √(GBW/(2πR_f C_j)) goes as 1/√R_f: four times R_f, half the bandwidth.' },
    { q: 'Doubling R_f in a TIA improves the signal-to-noise ratio set by the resistor\'s thermal noise.', a: true,
      why: 'The signal voltage doubles, while the resistor\'s noise voltage at the output grows only as √R_f. Equivalently, its noise current √(4kT/R_f) falls.' }
  ],
  applications: [
    'Photodiode receivers: optical links, barcode scanners, light meters, pulse oximeters.',
    'Photomultiplier and ionisation-chamber readout.',
    'Electrochemical gas sensors and potentiostats.',
    'Current measurement in scanning tunnelling microscopes and electrometers.'
  ],
  sim: 'oa-tia'
}

);
