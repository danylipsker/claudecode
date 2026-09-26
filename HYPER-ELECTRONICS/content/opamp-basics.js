/* HYPER-ELECTRONICS · content/opamp-basics.js — the op-amp: the ideal model and its golden
 * rules, negative feedback, and the op-amp without feedback: comparators and Schmitt triggers.
 * Simulations in sims/opamps.js. */
Hyper.add(

{
  id: 'ideal-opamp', parent: 'opamp-basics', title: 'The ideal op-amp and its golden rules', level: 1,
  short: 'An amplifier of the difference between two inputs with an enormous gain. With negative feedback two simple rules — no input current, equal input voltages — are enough to design with it.',
  keywords: ['op-amp', 'operational amplifier', 'golden rules', 'open-loop gain', 'ideal op-amp', 'differential input', 'virtual short', 'supply rails', 'LM358', 'TL072'],
  prereq: ['voltage', 'kirchhoffs-laws', 'voltage-divider'],
  related: ['negative-feedback', 'differential-pair', 'comparators', 'inverting-amplifier', 'non-inverting-amplifier', 'gain-bandwidth'],
  body: `
An operational amplifier — an op-amp — is a voltage amplifier with two inputs and one output. It amplifies the **difference** between the non-inverting input (+) and the inverting input (−) by a very large factor, the **open-loop gain** $A$:

$$V_\\text{out} = A\\,(V_+ - V_-)$$

$A$ is typically $10^5$ to $10^7$ (100 to 140 dB, see [[decibels]]): about 100 000 for an LM358, 200 000 for a TL072. The output can only move between limits set by the supply — say ±13.5 V on a ±15 V supply — so the input difference that drives it from one limit to the other is minute: $13.5\\ \\mathrm{V}/200\\,000 \\approx 68\\ \\mu\\mathrm{V}$. On its own, as an amplifier of a real signal, an op-amp is therefore useless: a millivolt of input slams the output against a rail, and the gain itself varies by a factor of two or more from one chip to the next and with temperature.

The trick is to use it with **[[negative-feedback|negative feedback]]**: a path from the output back to the − input, usually through resistors. The feedback lets the huge, sloppy gain be traded for a smaller gain fixed by the resistors alone.

### The ideal op-amp
For designing, pretend the op-amp is perfect:
- infinite open-loop gain,
- no current into either input (infinite input resistance),
- zero output resistance — the output voltage does not depend on the load,
- infinite bandwidth and no offset.

Real parts come remarkably close at low frequencies. A TL072's inputs draw only tens of picoamps; with feedback the output resistance is milliohms. The ways they fall short — [[gain-bandwidth|bandwidth]], [[slew-rate]], [[offset-bias|offsets]], [[single-supply|output swing]] — are the subject of the real op-amp topic.

### The golden rules
With negative feedback, and as long as the output is not at a limit:

1. **No current flows into either input.**
2. **The output does whatever is needed to make $V_- = V_+$.**

Rule 1 is a property of the chip. Rule 2 is a property of the *circuit*: the output is finite, so $V_+ - V_- = V_\\text{out}/A$, which vanishes as $A$ grows. The two inputs behave as if joined by a wire that carries no current — a *virtual short*.

### A recipe that solves almost every circuit
1. Check there is negative feedback (the output connects, directly or through components, to the − input).
2. Set $V_- = V_+$.
3. Write [[kirchhoffs-laws|Kirchhoff's current law]] at the input nodes, with no current into the op-amp.
4. Solve for $V_\\text{out}$.

For the [[non-inverting-amplifier]]: $V_+ = V_\\text{in}$, and $R_f$ over $R_1$ form a [[voltage-divider]] from the output, so $V_- = V_\\text{out}R_1/(R_1+R_f)$. Setting them equal gives $V_\\text{out} = V_\\text{in}(1 + R_f/R_1)$ — three lines of algebra, no transistor physics.

### What the rules do not say
- **Where the output current comes from.** The inputs take nothing, but the output can source or sink 10–40 mA. That current flows through the supply pins, which most schematics leave off the symbol. Kirchhoff's law holds for the whole chip, supply pins included.
- **What happens at the limits.** Once the output reaches a rail, it can no longer move to equalise the inputs, and rule 2 fails: the − input wanders away from the + input.
- **What happens without negative feedback.** With no feedback the op-amp is a [[comparators|comparator]]; with positive feedback it is a [[schmitt-trigger|Schmitt trigger]]. Neither obeys rule 2.

> [!key] Rule 2 is not magic: it is what a very high gain does when feedback lets the output find a finite, stable value. Whenever you apply it, check that such a value exists and lies inside the output's limits.
`,
  ideas: [
    'An op-amp amplifies the difference between its inputs by an enormous and poorly controlled gain.',
    'Used alone it saturates at once; with negative feedback its gain is set by external resistors.',
    'Golden rule 1: no current flows into the inputs.',
    'Golden rule 2: with negative feedback the output drives V₋ to equal V₊.',
    'The rules hold only while the output is within its limits and the feedback is negative.'
  ],
  pitfalls: [
    'V₊ = V₋ in every op-amp circuit — Only with negative feedback and the output within its limits. A comparator\'s inputs can differ by volts.',
    'No current flows anywhere in an op-amp — Only the inputs draw (almost) nothing. The output can deliver tens of milliamps, supplied through the power pins that the symbol usually leaves out.',
    'A higher open-loop gain gives a higher amplifier gain — With feedback the gain is set by the resistors; extra open-loop gain only makes that setting more exact.'
  ],
  derivation: {
    title: 'Why the inputs end up equal',
    steps: [
      { text: 'The op-amp multiplies the input difference by its open-loop gain:', tex: 'V_\\text{out} = A\\,(V_+ - V_-)' },
      { text: 'Divide by $A$. In a working circuit the output is finite — somewhere between the rails:', tex: 'V_+ - V_- = \\frac{V_\\text{out}}{A}' },
      { text: 'With $|V_\\text{out}| < 13.5\\ \\mathrm{V}$ and $A = 2\\times 10^5$ the difference is below 68 µV; as the gain grows without limit it vanishes:', tex: '\\lim_{A \\to \\infty} (V_+ - V_-) = 0 \\;\\Rightarrow\\; V_- = V_+' },
      'The step "the output is finite" is where negative feedback comes in: it is the feedback that makes the output settle at a finite value. Without feedback nothing does, and the output runs to a rail.'
    ]
  },
  formulas: [
    {
      name: 'Input difference needed for an output',
      expr: 'Vd = Vout/A', tex: 'V_d = \\frac{V_{\\text{out}}}{A}',
      vars: {
        Vd: { name: 'input difference V₊ − V₋', q: 'voltage', unit: 'µV', tex: 'V_d', signed: true },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 10, tex: 'V_{\\text{out}}', signed: true },
        A: { name: 'open-loop gain', value: 200000, tex: 'A' }
      },
      note: 'This is how far the inputs are apart in a working amplifier — the error behind the golden rule $V_- = V_+$.',
      stories: {
        Vd: 'A TL072 with an open-loop gain of {A} holds its output at {Vout}. How far apart are its inputs?',
        A: 'In a working amplifier the output is {Vout} and you measure {Vd} between the inputs. What is the open-loop gain?'
      }
    },
    {
      name: 'Open-loop gain in decibels',
      expr: 'AdB = 20*log(A)', tex: 'A_{\\text{dB}} = 20\\log_{10} A',
      vars: {
        AdB: { name: 'open-loop gain in dB', q: 'gain', unit: 'dB', tex: 'A_{\\text{dB}}' },
        A: { name: 'open-loop gain (ratio)', value: 200000, tex: 'A' }
      },
      note: 'Data sheets quote the gain as V/mV (200 V/mV = 200 000) or in dB (106 dB).',
      stories: { A: 'A data sheet gives an open-loop gain of {AdB}. What is it as a plain ratio?' }
    }
  ],
  examples: [
    {
      title: 'How close are the inputs really?',
      q: 'A TL072 (open-loop gain 200 000) drives its output to 10 V. How far apart are its inputs? And for an LM358 at its guaranteed minimum gain of 25 000?',
      steps: [
        'TL072: $V_+ - V_- = 10\\ \\mathrm{V}/200\\,000 = 50\\ \\mu\\mathrm{V}$.',
        'LM358 at minimum gain: $10\\ \\mathrm{V}/25\\,000 = 400\\ \\mu\\mathrm{V}$.',
        'Compared with a 1 V input signal these are 0.005 % and 0.04 %: treating the inputs as equal costs very little. The resistors\' tolerances (typically 1 % or 0.1 %) matter far more.'
      ],
      a: '50 µV for the TL072, 400 µV for a minimum-gain LM358.'
    },
    {
      title: 'Solving an amplifier with the golden rules',
      q: 'An op-amp has its + input at 0.5 V. Its output connects to the − input through $R_f = 90\\ \\mathrm{k\\Omega}$, and $R_1 = 10\\ \\mathrm{k\\Omega}$ runs from the − input to ground. Find the output voltage.',
      steps: [
        'There is negative feedback (output to − input), so $V_- = V_+ = 0.5\\ \\mathrm{V}$.',
        'The current in $R_1$ is $0.5\\ \\mathrm{V}/10\\ \\mathrm{k\\Omega} = 50\\ \\mu\\mathrm{A}$.',
        'No current enters the − input, so the same 50 µA flows through $R_f$, dropping $50\\ \\mu\\mathrm{A} \\times 90\\ \\mathrm{k\\Omega} = 4.5\\ \\mathrm{V}$.',
        '$V_\\text{out} = 0.5 + 4.5 = 5.0\\ \\mathrm{V}$ — a gain of $1 + R_f/R_1 = 10$.'
      ],
      a: '5.0 V (gain 10).'
    }
  ],
  quiz: [
    { q: 'A TL072 on ±15 V has **no feedback**. Its + input is at 2.001 V and its − input at 2.000 V. The output is…', choices: ['+0.2 V', '+200 V', 'near the positive limit, about +13.5 V', '0 V, because the inputs are nearly equal'], a: 2,
      why: 'The ideal output would be 1 mV × 200 000 = 200 V, which is impossible: the output stops at its upper limit, about 1.5 V below the positive rail.' },
    { q: 'In every op-amp circuit the two input voltages are equal.', a: false,
      why: 'Only with negative feedback and the output inside its limits. In a comparator, or an amplifier driven into clipping, the inputs can differ by volts.' },
    { q: 'In a working amplifier you measure 30 µV between the op-amp\'s inputs. This means…', choices: ['the op-amp is faulty', 'nothing is wrong: it is V_out/A', 'the feedback resistor is open', 'the input current is too high'], a: 1,
      why: 'A finite open-loop gain needs a small input difference to produce the output: V_out/A. With 3 V out and A = 100 000 it is exactly 30 µV.' },
    { q: 'No current flows into an op-amp\'s inputs. Where does the current come from when its output drives a 1 kΩ load?', choices: ['from the inputs', 'from the feedback resistor', 'from the supply pins', 'nowhere: an op-amp cannot drive a load'], a: 2,
      why: 'The output stage connects the load to the positive or negative supply. The supply pins are rarely drawn, but Kirchhoff\'s current law for the chip includes them.' },
    { q: 'A data sheet gives an open-loop gain of 120 dB. What is it as a plain ratio?', answer: 1e6,
      why: '120 dB / 20 = 6, so the ratio is 10⁶ — one million.' }
  ],
  applications: [
    'Amplifiers for sensors, microphones and measurement.',
    'Buffers for voltage references and ADC inputs.',
    'Active filters, integrators and analogue computation.',
    'Comparators, oscillators and control loops.'
  ],
  history: 'The name comes from analogue computers of the 1940s, where high-gain amplifiers with feedback performed mathematical *operations* — adding, integrating — to solve differential equations; the term appeared in a 1947 paper by Ragazzini, Randall and Russell. Bob Widlar designed the first successful monolithic op-amps at Fairchild in the mid-1960s (μA702, μA709), and the internally compensated μA741 of 1968 made the op-amp a cheap, everyday part.',
  sim: 'oa-virtual-earth'
},

{
  id: 'negative-feedback', parent: 'opamp-basics', title: 'Negative feedback', level: 2,
  short: 'Feeding a fraction of the output back to subtract from the input: the gain becomes 1/β, set by resistors, and precision, linearity, bandwidth and output impedance all improve — paid for with raw gain.',
  keywords: ['negative feedback', 'loop gain', 'closed-loop gain', 'feedback factor', 'beta', 'desensitivity', 'phase margin', 'stability', 'compensation', 'servo'],
  prereq: ['ideal-opamp', 'voltage-divider', 'math:linear-equations'],
  related: ['gain-bandwidth', 'non-inverting-amplifier', 'oscillator-principle', 'schmitt-trigger', 'bode-plots'],
  body: `
Feedback means sending part of the output back to the input. With **negative** feedback it is *subtracted*, so the amplifier no longer amplifies the input itself but the **error** between what the input asks for and what the output is delivering. If the output is too high, the error goes negative and pulls it down; if too low, the error pushes it up. With enough gain, the output settles where the error is almost zero.

A mechanical engineer knows this loop: it is a servo. A position controller with a very stiff proportional gain needs only a tiny position error to produce whatever torque the load demands; the op-amp needs only microvolts between its inputs to produce whatever output voltage the circuit demands.

### The closed-loop gain
Let the amplifier have gain $A$ and let a network (usually a [[voltage-divider]]) return a fraction $\\beta$ of the output. The amplifier sees the error $V_\\text{in} - \\beta V_\\text{out}$, and multiplies it by $A$:

$$G = \\frac{V_\\text{out}}{V_\\text{in}} = \\frac{A}{1 + A\\beta}$$

The product $A\\beta$ is the **loop gain** $T$ — the gain met by a signal going once round the loop. When $T \\gg 1$ the 1 in the denominator is negligible and

$$G \\approx \\frac{1}{\\beta}$$

The gain now depends only on the feedback network: resistors, stable to 0.1 % and 25 ppm/°C, instead of the op-amp's $A$, which may vary by a factor of two between parts and drifts with temperature. For the [[non-inverting-amplifier]], $\\beta = R_1/(R_1 + R_f)$ and $1/\\beta = 1 + R_f/R_1$.

### What feedback buys
Each of these improves by the factor $1 + T$:
- **Precision.** A fractional change of $A$ reaches $G$ divided by $1 + T$. With $1/\\beta = 100$, halving $A$ from 100 000 to 50 000 moves the gain from 99.90 to 99.80 — 0.1 %.
- **Linearity.** Distortion produced inside the loop (a crossover kink in the output stage, a curved transistor characteristic) is reduced by $1 + T$.
- **Output impedance.** An open-loop output resistance of tens of ohms becomes milliohms.
- **Input impedance** of the non-inverting configuration rises by $1 + T$.
- **Bandwidth.** The closed loop is faster than the open loop by the same factor: the product of gain and bandwidth stays constant ([[gain-bandwidth]]).

All of it is paid for with gain: you give up a factor $1 + T$ of raw gain — plentiful and unreliable — to buy qualities that are scarce. And since $A$ falls with frequency, so does $T$, and so do the benefits: at 20 kHz a 1 MHz op-amp at a gain of 10 has a loop gain of only 5.

### When negative feedback turns positive
The loop gain is really a complex number: every stage delays the signal a little, and at high frequency the delays add up. If the phase lag round the loop reaches 180° while $|T|$ is still 1 or more, the fed-back signal arrives *in phase* with the input: the feedback has become positive and the circuit oscillates (the [[oscillator-principle|Barkhausen condition]]). General-purpose op-amps are therefore **internally compensated**: a deliberate dominant pole makes $A$ fall at 20 dB per decade, so $|T|$ drops below 1 before the other delays matter. The margin left over — the **phase margin** — should be at least 45°, and 60° is comfortable. Anything that adds lag eats into it: a capacitive load such as a cable, a capacitor at the − input (a photodiode, see [[transimpedance]]), or a decompensated op-amp run at too low a gain.
`,
  ideas: [
    'Negative feedback amplifies the error between the input and a fraction β of the output.',
    'Closed-loop gain G = A/(1 + Aβ), which tends to 1/β when the loop gain Aβ is large.',
    'Precision, linearity, output impedance and bandwidth improve by the factor 1 + Aβ.',
    'The benefits shrink as the loop gain falls with frequency.',
    'Too much phase lag round the loop turns negative feedback positive: the circuit oscillates.'
  ],
  pitfalls: [
    'Negative feedback throws gain away for nothing — It trades raw gain, which is plentiful and unreliable, for precision, linearity, bandwidth and low output impedance.',
    'Feedback corrects every error — Only errors that arise inside the loop. A wrong feedback resistor, or noise already on the input, passes straight through.',
    'More loop gain is always better — Loop gain at high frequency comes with phase lag; if the lag reaches 180° while the loop gain is still above 1, the amplifier oscillates.'
  ],
  derivation: {
    title: 'Derive the closed-loop gain and its sensitivity',
    steps: [
      { text: 'The amplifier sees the input minus the fed-back fraction of the output, and multiplies it by $A$:', tex: 'V_\\text{out} = A\\,(V_\\text{in} - \\beta V_\\text{out})' },
      { text: 'Collect the output terms ([[math:linear-equations|a linear equation]] in $V_\\text{out}$):', tex: 'V_\\text{out}(1 + A\\beta) = A V_\\text{in} \\;\\Rightarrow\\; G = \\frac{A}{1 + A\\beta}' },
      { text: 'Rewrite it to show the ideal gain and the shortfall from it:', tex: 'G = \\frac{1}{\\beta}\\cdot\\frac{A\\beta}{1 + A\\beta} = \\frac{1}{\\beta}\\left(1 - \\frac{1}{1 + A\\beta}\\right)' },
      { text: 'Differentiate with respect to $A$ to see how a change of $A$ reaches $G$:', tex: '\\frac{dG}{dA} = \\frac{1}{(1 + A\\beta)^2} \\;\\Rightarrow\\; \\frac{dG}{G} = \\frac{1}{1 + A\\beta}\\,\\frac{dA}{A}' }
    ]
  },
  formulas: [
    {
      name: 'Closed-loop gain',
      expr: 'G = A/(1 + A*beta)', tex: 'G = \\frac{A}{1 + A\\beta}',
      vars: {
        G: { name: 'closed-loop gain', tex: 'G' },
        A: { name: 'open-loop gain', value: 100000, tex: 'A' },
        beta: { name: 'feedback fraction β', value: 0.01, min: 0, max: 1, tex: '\\beta' }
      },
      note: 'For a non-inverting amplifier $\\beta = R_1/(R_1 + R_f)$. When $A\\beta \\gg 1$, $G \\approx 1/\\beta$.',
      stories: { G: 'An op-amp with an open-loop gain of {A} has a feedback fraction of {beta}. What is the closed-loop gain?' }
    },
    {
      name: 'Gain error: the shortfall from 1/β',
      expr: 'err = 1/(1 + A*beta)', tex: '\\varepsilon = \\frac{1}{1 + A\\beta}',
      vars: {
        err: { name: 'fractional gain error', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        A: { name: 'open-loop gain', value: 100000, tex: 'A' },
        beta: { name: 'feedback fraction β', value: 0.01, min: 0, max: 1, tex: '\\beta' }
      },
      note: 'The real gain is $(1/\\beta)(1 - \\varepsilon)$. Solve for $A$ to find the open-loop gain a given accuracy needs.',
      stories: { A: 'An amplifier with a gain of about 1/{beta} must be accurate to {err}. What open-loop gain does the op-amp need?' }
    },
    {
      name: 'Sensitivity to the open-loop gain (small changes)',
      expr: 'sG = sA/(1 + A*beta)', tex: '\\delta_G = \\frac{\\delta_A}{1 + A\\beta}',
      vars: {
        sG: { name: 'fractional change of the closed-loop gain, ΔG/G', q: 'ratio', unit: '%', tex: '\\delta_G', signed: true },
        sA: { name: 'fractional change of the open-loop gain, ΔA/A', q: 'ratio', unit: '%', value: 10, tex: '\\delta_A', signed: true },
        A: { name: 'open-loop gain', value: 100000, tex: 'A' },
        beta: { name: 'feedback fraction β', value: 0.01, min: 0, max: 1, tex: '\\beta' }
      },
      note: 'Valid for small changes of $A$; for a large change compare the two gain errors instead.'
    },
    {
      name: 'Output resistance with feedback',
      expr: 'Rcl = Ro/(1 + A*beta)', tex: 'R_{\\text{out,cl}} = \\frac{R_o}{1 + A\\beta}',
      vars: {
        Rcl: { name: 'closed-loop output resistance', q: 'resistance', unit: 'mΩ', tex: 'R_{\\text{out,cl}}' },
        Ro: { name: 'open-loop output resistance', q: 'resistance', unit: 'Ω', value: 75, tex: 'R_o' },
        A: { name: 'open-loop gain', value: 100000, tex: 'A' },
        beta: { name: 'feedback fraction β', value: 0.1, min: 0, max: 1, tex: '\\beta' }
      },
      note: 'At DC. The loop gain falls with frequency, so the output impedance rises — which is why a capacitive load can upset stability.'
    }
  ],
  examples: [
    {
      title: 'How much does the op-amp\'s gain matter?',
      q: 'An LM358 has an open-loop gain of 100 000 typically but only 25 000 guaranteed. It is used as a non-inverting amplifier with $1/\\beta = 100$. What is the closed-loop gain in both cases?',
      steps: [
        'Typical: $A\\beta = 100\\,000/100 = 1000$, so $G = 100 \\times 1000/1001 = 99.90$.',
        'Worst case: $A\\beta = 250$, so $G = 100 \\times 250/251 = 99.60$.',
        'A fourfold spread of $A$ moves the gain by 0.3 %. Two 1 % resistors can move it by up to about 2 %: they, not the op-amp, set the accuracy. Use 0.1 % resistors for a precise gain.'
      ],
      a: '99.90 typically, 99.60 at worst — a 0.3 % spread.'
    },
    {
      title: 'Distortion inside and outside the loop',
      q: 'An output stage produces 2 % distortion on its own. It sits inside a feedback loop with a loop gain of 500 at 1 kHz. The op-amp has a gain–bandwidth product of 1 MHz and the closed-loop gain is 10. Estimate the distortion at 1 kHz and at 20 kHz.',
      steps: [
        'At 1 kHz: $2\\,\\% / (1 + 500) \\approx 0.004\\,\\%$.',
        'At 20 kHz the open-loop gain is only about $1\\ \\mathrm{MHz}/20\\ \\mathrm{kHz} = 50$, so the loop gain is $50/10 = 5$.',
        'Distortion $\\approx 2\\,\\%/(1 + 5) \\approx 0.33\\,\\%$ — nearly a hundred times worse. Feedback works only where there is loop gain to spare.'
      ],
      a: 'About 0.004 % at 1 kHz but 0.3 % at 20 kHz.'
    }
  ],
  quiz: [
    { q: 'An amplifier has a loop gain Aβ = 1000. The op-amp is replaced by one with half the open-loop gain. The closed-loop gain changes by about…', choices: ['50 %', '10 %', '0.1 %', 'exactly nothing'], a: 2,
      why: 'The shortfall from 1/β is 1/(1 + Aβ): about 0.1 % before (1/1001) and 0.2 % after (1/501). The gain moves by only about 0.1 %.' },
    { q: 'Negative feedback increases the gain of an amplifier.', a: false,
      why: 'It reduces the gain from A to about 1/β. What it increases is the precision, linearity and bandwidth.' },
    { q: 'What is the loop gain of a voltage follower built with an op-amp whose open-loop gain is 200 000?', choices: ['1', '200 000', '100 000', '0.000005'], a: 1,
      why: 'In a follower the whole output is fed back: β = 1, so the loop gain equals A. That is why a follower is the most accurate — and the hardest to keep stable — configuration.' },
    { q: 'Why do general-purpose op-amps have a deliberate dominant pole (internal compensation)?', choices: ['to reduce their noise', 'so the loop gain falls below 1 before the phase lag reaches 180°', 'to raise the slew rate', 'to lower the offset voltage'], a: 1,
      why: 'Without it, the lags of the internal stages could reach 180° while the loop gain is still above 1, and the amplifier would oscillate with feedback.' },
    { q: 'With a loop gain of 2000, what is the gain error, in percent?', answer: 0.05,
      why: '1/(1 + 2000) = 0.0005, i.e. 0.05 %: the gain is 0.05 % below 1/β.' }
  ],
  applications: [
    'Every op-amp amplifier, buffer and active filter.',
    'Voltage regulators, which compare the output with a reference and correct it.',
    'Servo systems, motor speed control and temperature control.',
    'Audio power amplifiers, where feedback cuts distortion.'
  ],
  history: 'Harold Black, an engineer at Bell Labs, conceived the negative-feedback amplifier in 1927 to stop the distortion of telephone repeaters from piling up along long lines. The idea — throw away gain to buy linearity — was so counter-intuitive that his patent took nine years to be granted.',
  sim: ['oa-gbw', { id: 'oa-virtual-earth', params: { a0: 1000 } }]
},

{
  id: 'comparators', parent: 'opamp-basics', title: 'Comparators', level: 2,
  short: 'An amplifier with no feedback snaps its output to one limit or the other depending on which input is higher: a one-bit decision. Dedicated comparators do it fast and with logic-level outputs.',
  keywords: ['comparator', 'threshold', 'LM393', 'LM339', 'open collector', 'open drain', 'pull-up resistor', 'chatter', 'zero-crossing detector', 'window comparator', 'response time'],
  prereq: ['ideal-opamp', 'voltage-divider', 'pull-resistors'],
  related: ['schmitt-trigger', 'adc', 'logic-families', 'relaxation-oscillators', 'thermistors-rtd', 'pwm'],
  body: `
Take the feedback away from an op-amp and its huge gain turns it into a decision-maker. If $V_+ > V_-$ by even a fraction of a millivolt the output goes to its upper limit; if $V_+ < V_-$, to its lower limit. Put a fixed **reference** voltage on one input and the signal on the other, and the output answers one question: *is the signal above the threshold?* It is a one-bit [[adc|analogue-to-digital converter]].

Everyday uses:
- **Alarms and trips:** battery low, over-temperature, over-current.
- **Zero-crossing detectors:** a square wave in step with the mains, for timing.
- **[[pwm|PWM]] generation:** compare a triangle wave with a control voltage; the output is high for a fraction of each cycle set by the control voltage.
- **Window comparators:** two comparators flag a signal that leaves a band.
- **ADCs:** a flash converter is a row of comparators; a successive-approximation converter uses one many times.

The threshold usually comes from a [[voltage-divider]] across the supply, or from a precision reference such as a TL431 for accuracy.

### Comparator chips versus op-amps
Any op-amp can compare, but a **comparator** chip — the LM393 (dual) and LM339 (quad) are the classics — is built for it:
- **Speed.** A comparator has no compensation capacitor and switches in about a microsecond (LM393) down to tens of nanoseconds (TLV3201). An op-amp used as a comparator must [[slew-rate|slew]] across its whole output range — an LM358 at 0.3 V/µs needs about 12 µs to rise 3.5 V — and first recover from saturation.
- **Logic outputs.** The LM393's output is an **open-collector** transistor: it can pull the output low but not high. A [[pull-resistors|pull-up resistor]] to the logic supply supplies the high level, so a comparator on 12 V can feed a 3.3 V microcontroller, and several outputs can share one pull-up. Push-pull comparators need no pull-up.
- **No feedback allowed.** Without compensation a comparator oscillates if you wrap negative feedback round it. Conversely, many op-amps have protection diodes between their inputs that conduct when the inputs differ by more than about 0.7 V — check the *differential input voltage* rating before using one as a comparator.

The response time also depends on the **overdrive** — how far past the threshold the input goes. Data sheets quote it for, say, 5 mV and 100 mV of overdrive; a signal that barely crosses switches slowly.

### Choosing the pull-up
The pull-up and the capacitance of the output node (wiring plus the input it feeds) form an RC circuit: the rising edge is an exponential with $\\tau = R_p C_L$, taking about $2.2\\,R_p C_L$ from 10 % to 90 %. Smaller resistors give faster edges but more current when the output is low, which the comparator must sink — keep it to a few milliamps (the LM393 guarantees 6 mA). Values of 1–10 kΩ are typical.

### Noise and chatter
A comparator decides afresh at every instant. A slow signal with a little noise, passing through the threshold, crosses it several times in quick succession, and the output **chatters** — a burst of edges instead of one. A counter counts too many; a relay buzzes. The cure is hysteresis: the [[schmitt-trigger]].
`,
  ideas: [
    'Without feedback, an op-amp or comparator output goes to one limit or the other: V₊ > V₋ gives high.',
    'A reference voltage on one input sets the threshold, often from a divider.',
    'Comparator chips are fast, uncompensated and have logic-compatible outputs.',
    'Open-collector outputs need a pull-up resistor; its value trades speed against current.',
    'Noise on a slowly crossing input makes a plain comparator chatter.'
  ],
  pitfalls: [
    'A comparator is just an op-amp without feedback — Comparators are built for fast switching with logic outputs and no compensation; an op-amp used as a comparator is slow, and may have input clamp diodes or odd behaviour when overdriven.',
    'An open-collector output drives high by itself — It can only pull low; without a pull-up the "high" state simply floats.',
    'A comparator makes one clean decision per crossing — Near the threshold every wiggle of noise is a new decision, so a slow noisy input gives a burst of edges.'
  ],
  formulas: [
    {
      name: 'Threshold set by a divider',
      expr: 'Vth = Vs*R2/(R1 + R2)', tex: 'V_{\\text{th}} = V_s\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vth: { name: 'threshold voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{th}}' },
        Vs: { name: 'supply or reference voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 3.6, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      },
      stories: { R1: 'A comparator must trip at {Vth} from a {Vs} supply, with {R2} as the lower divider resistor. What upper resistor do you need?' }
    },
    {
      name: 'Rise time with a pull-up resistor',
      expr: 'tr = 2.2*Rp*CL', tex: 't_r \\approx 2.2\\,R_p C_L',
      vars: {
        tr: { name: '10–90 % rise time', q: 'time', unit: 'µs', tex: 't_r' },
        Rp: { name: 'pull-up resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_p' },
        CL: { name: 'load capacitance', q: 'capacitance', unit: 'pF', value: 20, tex: 'C_L' }
      },
      note: 'The falling edge is driven by the comparator\'s transistor and is much faster.',
      stories: { Rp: 'An open-collector output drives {CL} and must rise in {tr}. What is the largest pull-up resistor you can use?' }
    },
    {
      name: 'Current sunk in the low state',
      expr: 'I = (Vcc - Vol)/Rp', tex: 'I = \\frac{V_{cc} - V_{OL}}{R_p}',
      vars: {
        I: { name: 'current through the pull-up', q: 'current', unit: 'mA' },
        Vcc: { name: 'pull-up supply', q: 'voltage', unit: 'V', value: 5, tex: 'V_{cc}' },
        Vol: { name: 'low output voltage', q: 'voltage', unit: 'V', value: 0.2, tex: 'V_{OL}' },
        Rp: { name: 'pull-up resistor', q: 'resistance', unit: 'kΩ', value: 4.7, tex: 'R_p' }
      },
      note: 'Keep it within the comparator\'s sink rating — a few milliamps for an LM393.'
    }
  ],
  examples: [
    {
      title: 'An over-temperature switch',
      q: 'A 10 kΩ NTC thermistor ($B = 3950$ K) runs from 5 V to a node, with 10 kΩ from the node to ground. An LM393 must trip at 50 °C. Design the reference divider.',
      steps: [
        'The thermistor at 50 °C (323.15 K): $R = 10\\ \\mathrm{k\\Omega}\\,\\exp\\!\\left[3950\\left(\\tfrac{1}{323.15} - \\tfrac{1}{298.15}\\right)\\right] = 3.59\\ \\mathrm{k\\Omega}$.',
        'The sensor node is then at $5 \\times 10/(10 + 3.59) = 3.68\\ \\mathrm{V}$. It rises with temperature, because the NTC\'s resistance falls.',
        'Reference: $10\\ \\mathrm{k\\Omega}$ at the bottom and $R_1 = 10 \\times (5/3.68 - 1) = 3.59\\ \\mathrm{k\\Omega}$ at the top; the E24 value 3.6 kΩ gives 3.676 V.',
        'Sensor node to the + input, reference to the − input: above 50 °C the output transistor turns off and a 10 kΩ pull-up takes the output high — the alarm.'
      ],
      a: 'A 3.6 kΩ / 10 kΩ reference divider (3.68 V), sensor on the + input.'
    },
    {
      title: 'A pull-up for a 100 kHz signal',
      q: 'An LM393 output on 5 V drives 30 pF of wiring and logic input. The signal runs at 100 kHz. Choose the pull-up.',
      steps: [
        'Each half-cycle lasts 5 µs; aim for a rise time of at most a tenth of it, 0.5 µs.',
        '$R_p \\le 0.5\\ \\mu\\mathrm{s}/(2.2 \\times 30\\ \\mathrm{pF}) = 7.6\\ \\mathrm{k\\Omega}$.',
        'Choose 4.7 kΩ: $t_r = 2.2 \\times 4.7\\ \\mathrm{k\\Omega} \\times 30\\ \\mathrm{pF} = 0.31\\ \\mu\\mathrm{s}$, and the low-state current is about $5/4.7 = 1.1\\ \\mathrm{mA}$ — well within the LM393\'s rating.'
      ],
      a: '4.7 kΩ: 0.31 µs rise time, 1.1 mA when low.'
    }
  ],
  quiz: [
    { q: 'An LM393\'s output is wired straight to a microcontroller input, with no pull-up. What does the microcontroller see?', choices: ['clean logic levels', 'low when the output transistor is on, and a floating input otherwise', 'always high', 'an analogue copy of the input'], a: 1,
      why: 'An open-collector output can only pull down. Without a pull-up the high state is undefined, and a CMOS input left floating reads at random.' },
    { q: 'Why does a slowly rising, slightly noisy signal make a comparator produce a burst of pulses?', choices: ['the comparator is too slow', 'each small wiggle of noise across the threshold is a new decision', 'the pull-up resistor is too small', 'the reference is noisy'], a: 1,
      why: 'The input spends a while near the threshold, and during that time noise carries it back and forth across it. Hysteresis cures this.' },
    { q: 'An LM393 comparator can be used as a linear amplifier by adding negative feedback.', a: false,
      why: 'Comparators have no internal compensation: with negative feedback they oscillate. Their open-collector output is not meant for linear use either.' },
    { q: 'An LM358 op-amp (slew rate 0.3 V/µs) is used as a comparator on 5 V. Roughly how long does its output take to rise from 0 to 3.5 V?', choices: ['35 ns', '1.2 µs', '12 µs', '1.2 ms'], a: 2,
      why: '3.5 V / 0.3 V/µs ≈ 12 µs — far slower than a comparator chip, before even counting the time to recover from saturation.' }
  ],
  applications: [
    'Battery-low, over-temperature and over-current alarms.',
    'Zero-crossing detectors for mains timing and phase control.',
    'PWM generation by comparing a triangle wave with a control voltage.',
    'Flash and successive-approximation ADCs.'
  ],
  sim: 'oa-schmitt'
},

{
  id: 'schmitt-trigger', parent: 'opamp-basics', title: 'The Schmitt trigger', level: 2,
  short: 'A comparator with positive feedback has two thresholds, one for rising and one for falling inputs. Noise smaller than the gap between them cannot make it chatter.',
  keywords: ['Schmitt trigger', 'hysteresis', 'positive feedback', 'thresholds', 'chatter', 'debouncing', 'relaxation oscillator', '74HC14', 'snap action', 'bistable'],
  prereq: ['comparators', 'voltage-divider', 'superposition'],
  related: ['relaxation-oscillators', 'switches', 'noise-snr', 'timer-555', 'negative-feedback'],
  body: `
A plain [[comparators|comparator]] chatters because its threshold is a single point: a noisy input near it keeps crossing back and forth. The Schmitt trigger gives the threshold a memory. A resistor from the output to the + input — **positive feedback** — moves the threshold *away from the input* each time the output switches. Once the output has gone high, the input must fall well below where it rose before the output will go low again. The gap between the two switching points is the **hysteresis**; noise smaller than it cannot undo a decision.

You already know this behaviour from a room thermostat that switches the heating on at 19 °C and off at 21 °C instead of clicking on and off around 20 °C — and from any snap-action (over-centre) mechanism, such as a light switch, which needs a definite push to flip and a definite push to flip back.

### The inverting Schmitt trigger (split supply)
The input goes to the − input; a divider $R_2$ (from the output) over $R_1$ (to ground) sets the + input at $\\beta V_\\text{out}$ with $\\beta = R_1/(R_1 + R_2)$. With the output at $\\pm V_\\text{sat}$ the thresholds are

$$V_T = \\pm\\,\\beta V_\\text{sat} = \\pm\\, V_\\text{sat}\\,\\frac{R_1}{R_1 + R_2}$$

symmetric about zero, and the output is inverted: it goes low when the input rises past $+V_T$.

### The non-inverting Schmitt trigger with a reference (single supply)
The input reaches the + input through $R_1$, and $R_2$ runs from the output back to the + input; the − input sits at a reference $V_\\text{ref}$. With the output switching between 0 and $V_{OH}$:

$$V_{TH} = V_\\text{ref}\\left(1 + \\frac{R_1}{R_2}\\right), \\qquad V_{TL} = V_{TH} - V_{OH}\\frac{R_1}{R_2}, \\qquad \\Delta V = V_{OH}\\frac{R_1}{R_2}$$

The window is centred on $V_\\text{ref}$ only when $V_\\text{ref} = V_{OH}/2$; otherwise shift the reference to put it where you need it. With an open-collector comparator the pull-up resistor sits in series with $R_2$ when the output is high, which shifts the upper level — keep $R_2$ much larger than the pull-up.

### Choosing the hysteresis
Make it larger than the peak-to-peak noise with a margin — twice is a good start — but no larger than necessary, because it also moves the switching points away from the nominal threshold and hides genuine small changes. Sensor signals typically get tens of millivolts; debouncing a switch through an RC filter uses a volt or so. Logic chips offer Schmitt inputs ready-made (the 74HC14 hex inverter, single gates such as the 74LVC1G17), with a few hundred millivolts of hysteresis.

### A square-wave oscillator for free
Connect a resistor $R$ from the output of an inverting Schmitt trigger back to its − input, and a capacitor $C$ from there to ground. The capacitor charges towards the output level until it reaches the threshold, the output flips, and it charges the other way: a [[relaxation-oscillators|relaxation oscillator]] with

$$f = \\frac{1}{2RC\\,\\ln\\dfrac{1+\\beta}{1-\\beta}}$$

For $\\beta = 0.5$ this is about $1/(2.2\\,RC)$.

> [!note] The golden rule $V_+ = V_-$ does not apply here: there is no negative feedback. The inputs are equal only at the instant the output switches.
`,
  ideas: [
    'Positive feedback moves the threshold away from the input each time the output switches.',
    'Two thresholds, V_TH for rising and V_TL for falling inputs; their gap is the hysteresis.',
    'Noise smaller than the hysteresis cannot make the output chatter.',
    'The resistor ratio sets the hysteresis; the reference sets where the window sits.',
    'A Schmitt trigger plus an RC network is a square-wave oscillator.'
  ],
  pitfalls: [
    'More hysteresis is always safer — It also moves the switching points further from the nominal threshold and makes the circuit ignore genuine small changes.',
    'The thresholds are always symmetric about the reference — Only with symmetric supplies, or with V_ref = V_OH/2 in the single-supply circuit; otherwise the window is shifted.',
    'The golden rule V₊ = V₋ applies — There is no negative feedback; the output sits at a limit and the inputs differ, except at the moment of switching.'
  ],
  derivation: {
    title: 'Derive the thresholds of the non-inverting Schmitt trigger',
    steps: [
      { text: 'The + input is fed by the input through $R_1$ and by the output through $R_2$. By [[superposition]] its voltage is', tex: 'V_+ = V_\\text{in}\\,\\frac{R_2}{R_1 + R_2} + V_\\text{out}\\,\\frac{R_1}{R_1 + R_2}' },
      { text: 'The output switches when $V_+$ crosses the reference on the − input. Set $V_+ = V_\\text{ref}$ and solve for the input:', tex: 'V_\\text{in} = V_\\text{ref}\\left(1 + \\frac{R_1}{R_2}\\right) - V_\\text{out}\\,\\frac{R_1}{R_2}' },
      { text: 'A rising input finds the output low ($V_\\text{out} = 0$): the upper threshold.', tex: 'V_{TH} = V_\\text{ref}\\left(1 + \\frac{R_1}{R_2}\\right)' },
      { text: 'A falling input finds the output high ($V_\\text{out} = V_{OH}$): the lower threshold, and the gap between them.', tex: 'V_{TL} = V_{TH} - V_{OH}\\frac{R_1}{R_2}, \\qquad \\Delta V = V_{OH}\\frac{R_1}{R_2}' }
    ]
  },
  formulas: [
    {
      name: 'Thresholds of the inverting Schmitt trigger (split supply)',
      expr: 'VT = Vsat*R1/(R1 + R2)', tex: 'V_T = V_{\\text{sat}}\\,\\frac{R_1}{R_1 + R_2}',
      vars: {
        VT: { name: 'threshold (±)', q: 'voltage', unit: 'V', tex: 'V_T' },
        Vsat: { name: 'output limit (±)', q: 'voltage', unit: 'V', value: 13.5, tex: 'V_{\\text{sat}}' },
        R1: { name: 'resistor from + input to ground', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'resistor from output to + input', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      note: 'The thresholds are $+V_T$ and $-V_T$; the hysteresis is $2V_T$.',
      stories: { VT: 'An inverting Schmitt trigger swings its output to ±{Vsat}, with {R1} to ground and {R2} from the output. Where are its thresholds?' }
    },
    {
      name: 'Upper threshold of the non-inverting Schmitt trigger',
      expr: 'VTH = Vref*(1 + R1/R2)', tex: 'V_{TH} = V_{\\text{ref}}\\left(1 + \\frac{R_1}{R_2}\\right)',
      vars: {
        VTH: { name: 'upper (rising) threshold', q: 'voltage', unit: 'V', tex: 'V_{TH}' },
        Vref: { name: 'reference on the − input', q: 'voltage', unit: 'V', value: 2.5, tex: 'V_{\\text{ref}}' },
        R1: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 150, tex: 'R_2' }
      }
    },
    {
      name: 'Hysteresis of the non-inverting Schmitt trigger',
      expr: 'dV = Voh*R1/R2', tex: '\\Delta V = V_{OH}\\,\\frac{R_1}{R_2}',
      vars: {
        dV: { name: 'hysteresis V_TH − V_TL', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        Voh: { name: 'high output level', q: 'voltage', unit: 'V', value: 5, tex: 'V_{OH}' },
        R1: { name: 'input resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'feedback resistor', q: 'resistance', unit: 'kΩ', value: 150, tex: 'R_2' }
      },
      stories: { R2: 'A 5 V comparator ({Voh} high level) has {R1} in series with its input. What feedback resistor gives {dV} of hysteresis?' }
    },
    {
      name: 'Schmitt-trigger relaxation oscillator',
      expr: 'f = 1/(2*R*C*ln((1 + b)/(1 - b)))', tex: 'f = \\frac{1}{2RC\\,\\ln\\dfrac{1+\\beta}{1-\\beta}}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz' },
        R: { name: 'timing resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'timing capacitor', q: 'capacitance', unit: 'nF', value: 100 },
        b: { name: 'feedback fraction β = R₁/(R₁ + R₂)', value: 0.5, min: 0.01, max: 0.99, tex: '\\beta' }
      },
      note: 'For an inverting Schmitt trigger with symmetric output levels.',
      stories: { C: 'A Schmitt-trigger oscillator with β = {b} and a {R} timing resistor must run at {f}. What capacitor do you need?' }
    }
  ],
  examples: [
    {
      title: 'Hysteresis for a noisy sensor on 5 V',
      q: 'A push-pull comparator on 5 V (output 0 or 5 V) squares up a slow sensor signal centred on 2.5 V, which carries 150 mV of peak-to-peak noise. Design a non-inverting Schmitt trigger with a 2.5 V reference and about twice the noise as hysteresis.',
      steps: [
        'Aim for $\\Delta V \\approx 0.3\\ \\mathrm{V}$: $R_1/R_2 = 0.3/5 = 0.06$.',
        'Take $R_2 = 100\\ \\mathrm{k\\Omega}$ and $R_1 = 6.2\\ \\mathrm{k\\Omega}$ (E24): $\\Delta V = 5 \\times 0.062 = 0.31\\ \\mathrm{V}$.',
        '$V_{TH} = 2.5 \\times 1.062 = 2.655\\ \\mathrm{V}$ and $V_{TL} = 2.655 - 0.31 = 2.345\\ \\mathrm{V}$.',
        'The window is centred on 2.5 V because the reference is half the output swing.'
      ],
      a: 'R₁ = 6.2 kΩ, R₂ = 100 kΩ: thresholds 2.655 V and 2.345 V.'
    },
    {
      title: 'An inverting Schmitt trigger, and an oscillator from it',
      q: 'A TL072 on ±15 V (output ±13.5 V) has $R_1 = 10\\ \\mathrm{k\\Omega}$ from the + input to ground and $R_2 = 100\\ \\mathrm{k\\Omega}$ from the output. Find the thresholds. Then add $R = 10\\ \\mathrm{k\\Omega}$ from the output to the − input and $C = 100\\ \\mathrm{nF}$ to ground: what frequency does it oscillate at?',
      steps: [
        '$\\beta = 10/110 = 0.0909$, so $V_T = \\pm 0.0909 \\times 13.5 = \\pm 1.23\\ \\mathrm{V}$.',
        '$\\ln\\frac{1 + \\beta}{1 - \\beta} = \\ln\\frac{1.0909}{0.9091} = \\ln 1.2 = 0.182$.',
        '$f = 1/(2 \\times 10\\ \\mathrm{k\\Omega} \\times 100\\ \\mathrm{nF} \\times 0.182) = 2.74\\ \\mathrm{kHz}$.'
      ],
      a: 'Thresholds ±1.23 V; the oscillator runs at about 2.7 kHz.'
    }
  ],
  quiz: [
    { q: 'A Schmitt trigger\'s thresholds are 2.35 V and 2.65 V. Its input carries 0.5 V peak-to-peak of noise. It will switch cleanly.', a: false,
      why: 'The hysteresis is 0.3 V, smaller than the 0.5 V of noise, so noise can still carry the input across both thresholds. Increase the hysteresis or filter the input.' },
    { q: 'An inverting Schmitt trigger on ±12 V (output ±12 V) has R₁ = 10 kΩ from the + input to ground and R₂ = 90 kΩ from the output. Its thresholds are…', choices: ['±1.2 V', '±1.33 V', '±10.8 V', '±12 V'], a: 0,
      why: 'β = 10/(10 + 90) = 0.1, so the thresholds are ±0.1 × 12 = ±1.2 V.' },
    { q: 'What does the positive feedback do at the instant the output switches?', choices: ['It returns the output to the middle', 'It moves the threshold away from the input, reinforcing the new state', 'It adds noise', 'It reduces the output swing'], a: 1,
      why: 'The fed-back fraction of the new output shifts the + input so that the input is now well past the new threshold. The decision locks in until the input travels the whole hysteresis back.' },
    { q: 'Which of these is a mechanical Schmitt trigger?', choices: ['a potentiometer', 'a snap-action (over-centre) switch', 'a spring balance', 'a viscous damper'], a: 1,
      why: 'An over-centre switch needs a definite push past one point to flip and a definite push back past a different point to return: two thresholds, hysteresis, and no dithering in between.' },
    { q: 'A non-inverting Schmitt trigger switches its output between 0 and 5 V, with R₁ = 10 kΩ and R₂ = 200 kΩ. What is its hysteresis, in volts?', answer: 0.25,
      why: 'ΔV = V_OH · R₁/R₂ = 5 × 10/200 = 0.25 V.' }
  ],
  applications: [
    'Squaring up slow or noisy sensor signals, such as a hall sensor on a gear wheel.',
    'Debouncing mechanical switches together with an RC filter.',
    'Relaxation oscillators and function generators.',
    'Thermostats and battery chargers that must not dither around a set point.'
  ],
  history: 'Otto Schmitt invented the circuit in 1934 as a graduate student, while studying how nerve impulses propagate in squid; he built it with vacuum tubes and called it a thermionic trigger.',
  sim: 'oa-schmitt'
}

);
