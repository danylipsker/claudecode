/* HYPER-ELECTRONICS · content/diode-circuits.js — what diodes are used for:
 * rectifiers and smoothing, the Zener regulator, clippers and clampers, voltage
 * multipliers and the flyback diode. Simulations in sims/diodes.js. */
Hyper.add(

{
  id: 'half-wave-rectifier', parent: 'diode-circuits', title: 'The half-wave rectifier', level: 1,
  short: 'One diode in series with the load passes the positive half-cycles of an AC voltage and blocks the negative ones — the simplest way to turn AC into (lumpy) DC.',
  keywords: ['half-wave rectifier', 'rectification', 'AC to DC', 'peak inverse voltage', 'PIV', 'average voltage', 'pulsating DC', 'transformer', 'peak detector', 'envelope detector'],
  prereq: ['pn-diode', 'diode-models', 'rms-values'],
  related: ['full-wave-rectifier', 'smoothing-ripple', 'transformers-practical', 'modulation', 'power-supply-design'],
  body: `
Mains electricity alternates; electronics wants a steady, one-way voltage. The first step is **rectification**: letting current through in one direction only. The simplest rectifier is a single diode in series with the load, fed from a transformer's secondary winding.

On the positive half-cycle the diode is forward-biased and the load sees the input, less one diode drop. On the negative half-cycle the diode blocks and the load sees nothing. The result is a train of positive humps, one per cycle: **pulsating DC** — it never reverses, but it is far from steady.

### What comes out
Transformer voltages are quoted as [[rms-values|RMS]] values; the peak is $\\sqrt 2$ times larger. A "12 V" secondary peaks at 17.0 V, and the output peaks one diode drop lower:

$$V_{pk} = \\sqrt 2\\, V_{rms} - V_F$$

With a resistive load the output is a half-sine for half the time and zero for the other half, so its **average** (what a DC meter reads, and what charges a battery) and **RMS** (what heats a resistor) are

$$V_{dc} = \\frac{V_{pk}}{\\pi} \\approx 0.318\\,V_{pk}, \\qquad V_{rms,out} = \\frac{V_{pk}}{2}$$

The **ripple frequency** is the mains frequency, 50 or 60 Hz — only one charging pulse per cycle.

### Peak inverse voltage
While blocking, the diode must withstand the whole negative peak, $V_p$. Add a smoothing capacitor ([[smoothing-ripple]]) and it gets worse: the capacitor holds the cathode near $+V_p$ while the anode swings to $-V_p$, so the diode sees about **$2V_p$**. For the 12 V secondary that is 34 V — use at least a 100 V part; the 1000 V 1N4007 costs the same.

### Why it is rarely used for power
- **DC in the transformer.** The secondary carries current only one way, which magnetises the core and pushes a small transformer towards saturation: it runs hot and hums.
- **Poor use of the winding**, and a large reservoir capacitor, because it is recharged only once a cycle.

It survives where the current is small: auxiliary bias rails, a negative supply for an op-amp, and the **peak detector** — a diode charging a capacitor to the highest voltage seen — which is also the AM radio's **envelope detector** ([[modulation]]).

### Small signals
A diode needs 0.3–0.7 V before it conducts, so a half-wave rectifier ignores small signals entirely: 200 mV of audio comes out as nothing. Measuring instruments use a **precision rectifier**, a diode inside an op-amp's feedback loop, where the loop gain divides the drop down to microvolts.

> [!warn] Mains is lethal. Experiment only on the low-voltage secondary of a proper safety transformer, with the primary side fused and enclosed. Circuits that rectify the mains directly (capacitive droppers, off-line switchers) have no isolation: every part of them is live.
`,
  ideas: [
    'One diode passes one half of each cycle: the output is pulsating DC with a ripple at the mains frequency.',
    'Output peak = √2 × V_rms − V_F; average = V_pk/π; RMS = V_pk/2 (resistive load).',
    'The diode blocks the negative peak — about 2V_p once a smoothing capacitor is added.',
    'DC in the transformer winding and once-a-cycle recharging make it a low-power circuit.',
    'The same circuit with a capacitor is a peak detector and an AM envelope detector.'
  ],
  pitfalls: [
    'A 12 V transformer gives 12 V DC after rectification — 12 V is the RMS value: the peak is 17 V, the average of the half-wave output only 5 V, and a smoothed output about 16 V.',
    'The diode only needs to be rated for the peak input voltage — With a reservoir capacitor it sees twice the peak.',
    'A multimeter on AC measures the half-wave output correctly — Most meters assume a sine; the half-wave output needs a true-RMS meter (or the DC range, which reads the average).'
  ],
  formulas: [
    {
      name: 'Peak output',
      expr: 'Vpk = sqrt(2)*Vrms - VF', tex: 'V_{pk} = \\sqrt{2}\\,V_{rms} - V_F',
      vars: {
        Vpk: { name: 'peak output voltage', q: 'voltage', unit: 'V', tex: 'V_{pk}' },
        Vrms: { name: 'secondary voltage (RMS)', q: 'voltage', unit: 'V', value: 12, tex: 'V_{rms}' },
        VF: { name: 'diode forward drop at the peak current', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_F' }
      },
      stories: { Vpk: 'A {Vrms} transformer feeds a half-wave rectifier ({VF} diode drop). What is the peak output?', Vrms: 'What secondary voltage (RMS) gives a peak of {Vpk} after a diode dropping {VF}?' }
    },
    {
      name: 'Average (DC) output, resistive load',
      expr: 'Vdc = (sqrt(2)*Vrms - VF)/pi', tex: 'V_{dc} = \\frac{\\sqrt{2}\\,V_{rms} - V_F}{\\pi}',
      vars: {
        Vdc: { name: 'average output voltage', q: 'voltage', unit: 'V', tex: 'V_{dc}' },
        Vrms: { name: 'secondary voltage (RMS)', q: 'voltage', unit: 'V', value: 12, tex: 'V_{rms}' },
        VF: { name: 'diode forward drop', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_F' }
      },
      note: 'No smoothing capacitor. The average is the area of one half-sine, $2V_{pk}/\\omega$, spread over a whole period.',
      stories: { Vdc: 'A half-wave rectifier on a {Vrms} secondary drives a resistor ({VF} drop). What does a DC voltmeter read across the resistor?' }
    },
    {
      name: 'RMS output, resistive load',
      expr: 'Vro = (sqrt(2)*Vrms - VF)/2', tex: 'V_{rms,out} = \\frac{\\sqrt{2}\\,V_{rms} - V_F}{2}',
      vars: {
        Vro: { name: 'RMS output voltage', q: 'voltage', unit: 'V', tex: 'V_{rms,out}' },
        Vrms: { name: 'secondary voltage (RMS)', q: 'voltage', unit: 'V', value: 12, tex: 'V_{rms}' },
        VF: { name: 'diode forward drop', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_F' }
      },
      note: 'Use it for the power in a resistive load: $P = V_{rms,out}^2/R$ — half the power the load would get on the full AC.'
    }
  ],
  examples: [
    {
      title: 'A 12 V transformer into a 100 Ω load',
      q: 'A 12 V (RMS) secondary feeds a 1N4007 (about 0.8 V drop at the peak) and a 100 Ω resistor. Find the peak, the average and the RMS output, the average current and the power in the resistor.',
      steps: [
        'Peak: $\\sqrt 2 \\times 12 - 0.8 = 16.97 - 0.8 = 16.2\\ \\mathrm{V}$.',
        'Average: $16.2/\\pi = 5.15\\ \\mathrm{V}$, so the average current is $5.15/100 = 51.5\\ \\mathrm{mA}$.',
        'RMS: $16.2/2 = 8.1\\ \\mathrm{V}$; power $8.1^2/100 = 0.66\\ \\mathrm{W}$.',
        'The simulator gives 16.1 V and 5.0 V: the diode drop is smaller near the start and end of each hump, and the winding resistance takes a little more.'
      ],
      a: 'About 16.2 V peak, 5.15 V average (51.5 mA), 8.1 V RMS, 0.66 W.'
    },
    {
      title: 'What must the diode block?',
      q: 'The same rectifier is given a large reservoir capacitor. What reverse voltage does the diode see, and what rating would you choose?',
      steps: [
        'The capacitor charges to about 16.2 V and holds it.',
        'At the negative peak the anode is at $-16.97\\ \\mathrm{V}$, the cathode at $+16.2\\ \\mathrm{V}$: $16.97 + 16.2 = 33.2\\ \\mathrm{V}$ reverse.',
        'Allow for mains 10 % high and for transients: at least 50 V, better 100 V or more. In practice a 1N4007 (1000 V) is fitted because it is the cheapest in the series.'
      ],
      a: 'About 33 V (twice the peak); fit a 100–1000 V diode.'
    }
  ],
  quiz: [
    { q: 'A half-wave rectifier (ideal diode) is fed with a 10 V peak sine and drives a resistor. What average voltage does it deliver?', answer: 3.18, unit: 'V',
      why: 'V_dc = V_pk/π = 10/π = 3.18 V: the half-sine\'s average over its own half is 2V_pk/π, and it is present only half the time.' },
    { q: 'On 50 Hz mains, the ripple of a half-wave rectifier repeats at…', choices: ['25 Hz', '50 Hz', '100 Hz', '0 Hz: the output is DC'], a: 1,
      why: 'One conducting pulse per mains cycle: 50 Hz. A full-wave rectifier doubles it to 100 Hz.' },
    { q: 'Adding a reservoir capacitor to a half-wave rectifier roughly doubles the reverse voltage across the diode.', a: true,
      why: 'The capacitor holds the cathode at +V_p while the anode goes to −V_p, so the diode sees about 2V_p.' },
    { q: 'Why is the half-wave rectifier avoided for supplies of more than a few watts?', choices: ['Diodes cannot carry the current', 'The one-way current magnetises the transformer core and the reservoir needs twice the capacitance', 'It produces a negative output', 'It works only at 60 Hz'], a: 1,
      why: 'DC in the secondary pushes the core towards saturation, and with one charging pulse per cycle the capacitor must be twice as large for the same ripple.' }
  ],
  applications: ['Low-current auxiliary and bias supplies.', 'Peak detectors in measuring instruments.', 'The envelope detector of an AM radio.', 'Precision (op-amp) rectifiers in AC meters.'],
  sim: { id: 'dio-rectifier', params: { mode: 'half' } }
},

{
  id: 'full-wave-rectifier', parent: 'diode-circuits', title: 'Full-wave and bridge rectifiers', level: 1,
  short: 'Two diodes with a centre-tapped transformer, or four in a bridge, rectify both halves of the cycle: twice the average output, ripple at twice the mains frequency, and no DC in the transformer.',
  keywords: ['full-wave rectifier', 'bridge rectifier', 'centre-tap', 'center tap', 'diode bridge', 'Graetz bridge', 'split supply', 'dual supply', 'ripple frequency', 'DB107', 'KBP206', 'GBU806', 'transformer VA'],
  prereq: ['half-wave-rectifier', 'transformers-practical'],
  related: ['smoothing-ripple', 'power-supply-design', 'diode-types', 'linear-regulators', 'oscilloscope'],
  body: `
A half-wave rectifier throws away half of every cycle. A **full-wave rectifier** flips the negative half over instead, so the load gets a hump every half-cycle: twice the average output, a ripple at **twice the mains frequency** (100 Hz on 50 Hz mains), and current in the transformer that alternates, as it should. There are two ways to do it.

### The centre-tapped rectifier
The secondary has a **centre tap**, which becomes the 0 V rail; its two ends swing in opposite directions. Two diodes each take the end that is currently positive. A "12-0-12 V" transformer gives a 17 V peak output, less **one** diode drop.
- Each diode must block the full voltage of both halves, about **$2V_p$**.
- Each half of the winding works only half the time, so the transformer is bigger than it needs to be.
- Only one diode is in the path — its advantage at low voltage and high current, especially with Schottky diodes.

### The bridge rectifier
Four diodes in a ring (a **bridge**, after Graetz) steer both halves of an ordinary secondary. On one half-cycle current flows through one pair of opposite diodes, on the other half through the other pair; the load always sees it the same way round.
- Two diodes are always in series: the output is **two drops** below the peak (about 1.5–2 V lost).
- Each diode blocks only about **$V_p$**.
- The whole winding works all the time: the smallest transformer for the power.

Bridges come as one part: the DB107 (1 A, 1000 V), KBP206 (2 A), GBU806 (8 A), and chassis-mounted KBPC types to 35 A and more. Their **heat** is easy to underestimate: $2V_F \\times I_{dc}$, so a bridge delivering 5 A dissipates about 10 W and needs a heat sink.

### Output with a resistive load
For both circuits, with $V_{pk}$ the peak output (after the drops):

$$V_{dc} = \\frac{2V_{pk}}{\\pi} \\approx 0.637\\,V_{pk}, \\qquad V_{rms,out} = \\frac{V_{pk}}{\\sqrt 2}$$

### A split supply from one transformer
Put a bridge on a centre-tapped secondary and take the centre tap as 0 V: the bridge's + terminal gives $+V$ and its − terminal $-V$. This is how ±15 V rails for op-amps and audio amplifiers are made.

### Sizing the transformer
With a smoothing capacitor the current flows in short, tall pulses ([[smoothing-ripple]]), so the RMS current in the secondary is well above the DC load current — typically **1.6–1.8 times** for a bridge. Rate the transformer's volt-amperes accordingly:

$$S \\approx k\\, V_{rms}\\, I_{dc}, \\qquad k \\approx 1.6\\ \\text{to}\\ 1.8$$

> [!warn] Neither end of a bridge's secondary is at 0 V. Clip a mains-earthed oscilloscope's ground lead to a secondary terminal and you short one diode of the bridge through the scope's earth — use a differential probe, or measure between the output terminals only. See [[oscilloscope]].
`,
  ideas: [
    'Full-wave rectification uses both half-cycles: average 2V_pk/π and ripple at 2f.',
    'Centre-tap: two diodes, one drop, each diode blocks 2V_p, half of the winding idle at a time.',
    'Bridge: four diodes, two drops, each blocks V_p, best use of the transformer.',
    'A bridge dissipates about 2V_F × I_dc — 10 W at 5 A — and often needs a heat sink.',
    'With a smoothing capacitor, rate the transformer at 1.6–1.8 × V_rms × I_dc volt-amperes.'
  ],
  pitfalls: [
    'A bridge has only one diode drop — Two diodes are always in series with the load; at 5 V outputs those 1.5–2 V matter.',
    'The negative output terminal of a bridge is one end of the secondary — It is not; neither secondary terminal is at the output 0 V, which is why earthed scope probes short bridges.',
    'A 24 VA transformer can deliver 1 A DC at 24 V after rectification and smoothing — The pulsed current raises the RMS winding current well above 1 A; allow a factor of about 1.7.'
  ],
  formulas: [
    {
      name: 'Average output of a full-wave rectifier (resistive load)',
      expr: 'Vdc = 2*(sqrt(2)*Vrms - nD*VF)/pi', tex: 'V_{dc} = \\frac{2\\left(\\sqrt{2}\\,V_{rms} - n_D V_F\\right)}{\\pi}',
      vars: {
        Vdc: { name: 'average output voltage', q: 'voltage', unit: 'V', tex: 'V_{dc}' },
        Vrms: { name: 'secondary voltage, RMS (each half for centre-tap)', q: 'voltage', unit: 'V', value: 12, tex: 'V_{rms}' },
        nD: { name: 'diodes in the current path (2 for a bridge, 1 for centre-tap)', value: 2, int: true, min: 1, max: 2, tex: 'n_D' },
        VF: { name: 'forward drop per diode', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_F' }
      },
      stories: { Vdc: 'A bridge rectifier ({VF} per diode) on a {Vrms} secondary drives a resistor. What average voltage does the resistor get?' }
    },
    {
      name: 'Rectifier dissipation',
      expr: 'P = nD*VF*Idc', tex: 'P = n_D\\, V_F\\, I_{dc}',
      vars: {
        P: { name: 'total power in the diodes', q: 'power', unit: 'W' },
        nD: { name: 'diodes in the current path', value: 2, int: true, min: 1, max: 2, tex: 'n_D' },
        VF: { name: 'forward drop per diode', q: 'voltage', unit: 'V', value: 0.9, tex: 'V_F' },
        Idc: { name: 'DC load current', q: 'current', unit: 'A', value: 3, tex: 'I_{dc}' }
      },
      note: 'An estimate with the average current; the pulsed current of a capacitor-input supply adds some loss in the diodes\' resistance.',
      stories: { P: 'A bridge ({VF} per diode) supplies {Idc}. How much heat must it get rid of?' }
    },
    {
      name: 'Transformer rating for a capacitor-input supply',
      expr: 'S = k*Vrms*Idc', tex: 'S \\approx k\\, V_{rms}\\, I_{dc}',
      vars: {
        S: { name: 'transformer apparent-power rating', unit: 'VA' },
        k: { name: 'form factor of the pulsed current', value: 1.7, min: 1, max: 2.5 },
        Vrms: { name: 'secondary voltage (RMS)', q: 'voltage', unit: 'V', value: 12, tex: 'V_{rms}' },
        Idc: { name: 'DC load current', q: 'current', unit: 'A', value: 2, tex: 'I_{dc}' }
      },
      note: 'Rule of thumb for a bridge feeding a reservoir capacitor: $k$ ≈ 1.6–1.8. Larger capacitors mean narrower, taller pulses and a larger $k$.',
      stories: { S: 'A bridge and reservoir capacitor on a {Vrms} secondary must supply {Idc} DC. What VA rating should the transformer have?' }
    }
  ],
  examples: [
    {
      title: 'Bridge or centre-tap for 2 A?',
      q: 'Compare a bridge on a 12 V secondary with a centre-tap rectifier on a 12-0-12 V secondary, both delivering 2 A with diodes dropping 0.9 V. Give the peak output, the diode loss and the reverse voltage per diode.',
      steps: [
        'The secondary peak is $\\sqrt 2 \\times 12 = 17.0\\ \\mathrm{V}$ in both cases.',
        'Bridge: peak output $17.0 - 2 \\times 0.9 = 15.2\\ \\mathrm{V}$; loss $2 \\times 0.9 \\times 2 = 3.6\\ \\mathrm{W}$; each diode blocks about 17 V.',
        'Centre-tap: peak output $17.0 - 0.9 = 16.1\\ \\mathrm{V}$; loss $0.9 \\times 2 = 1.8\\ \\mathrm{W}$; each diode blocks about 34 V.',
        'The centre-tap wins on loss and drop, but needs a transformer with twice the secondary turns, each half used half the time. Above a few volts the bridge is normally the better buy.'
      ],
      a: 'Bridge: 15.2 V, 3.6 W, 17 V per diode. Centre-tap: 16.1 V, 1.8 W, 34 V per diode.'
    },
    {
      title: 'A ±15 V supply for op-amps',
      q: 'You want about ±18 V unregulated (for ±15 V regulators) at 0.5 A per rail. What transformer do you need?',
      steps: [
        'Use a bridge on a centre-tapped secondary, centre tap to 0 V: each rail is a full-wave rectifier with one diode drop from each half.',
        'Each half must peak at about $18 + 0.9 + 1$ V (drop and ripple margin) ≈ 20 V, so $V_{rms} \\approx 20/\\sqrt 2 = 14\\ \\mathrm{V}$ — a standard 15-0-15 V transformer.',
        'Rating: each half delivers 0.5 A, conducting on alternate half-cycles for its rail; taking $k$ ≈ 1.7 overall, $S \\approx 1.7 \\times 30\\ \\mathrm{V} \\times 0.5\\ \\mathrm{A} \\approx 25\\ \\mathrm{VA}$. Choose 30 VA.'
      ],
      a: 'A 15-0-15 V, 30 VA transformer with a bridge, centre tap to ground.'
    }
  ],
  quiz: [
    { q: 'On 60 Hz mains, the ripple of a full-wave rectifier has a frequency of…', choices: ['30 Hz', '60 Hz', '120 Hz', '240 Hz'], a: 2,
      why: 'There is a charging pulse on every half-cycle: twice the mains frequency.' },
    { q: 'At any moment while a bridge rectifier conducts, how many of its diodes carry current?', choices: ['one', 'two', 'three', 'all four'], a: 1,
      why: 'One pair of opposite diodes on each half-cycle — which is why the output is two drops below the peak.' },
    { q: 'In a centre-tap rectifier with a 12-0-12 V secondary, each diode must block about…', choices: ['12 V', '17 V', '34 V', '0.7 V'], a: 2,
      why: 'While one end of the winding is at +17 V (and the output near +17 V), the other end is at −17 V: about 2V_p = 34 V across the blocking diode.' },
    { q: 'Clipping a mains-earthed oscilloscope\'s ground lead to one secondary terminal of a working bridge rectifier is safe, because the circuit is low voltage.', a: false,
      why: 'The scope ground is earthed; the secondary terminal is not at the circuit\'s 0 V. The earth lead shorts a diode of the bridge, and a large current flows through the probe lead.' },
    { q: 'For a 5 V, 10 A output from a low-voltage winding, the better rectifier is…', choices: ['a silicon bridge', 'a centre-tap rectifier with Schottky diodes', 'a single diode', 'a voltage doubler'], a: 1,
      why: 'At low voltage every drop counts: one Schottky drop (≈ 0.5 V) instead of two silicon drops (≈ 2 V) halves the loss and saves a volt and a half.' }
  ],
  applications: ['Every linear power supply and battery charger.', 'Split ±V rails for analogue and audio circuits.', 'The input stage of switch-mode supplies (rectifying the mains directly).', 'AC-input protection: a bridge makes a device polarity-proof on a DC supply.'],
  sim: { id: 'dio-rectifier', params: { mode: 'bridge' } }
},

{
  id: 'smoothing-ripple', parent: 'diode-circuits', title: 'Smoothing capacitors and ripple', level: 2,
  short: 'A reservoir capacitor charges at each peak and feeds the load in between, turning rectified humps into DC with a small sawtooth ripple — at the cost of short, tall diode current pulses.',
  keywords: ['smoothing capacitor', 'reservoir capacitor', 'ripple', 'ripple voltage', 'filter capacitor', 'conduction angle', 'peak current', 'ripple current', 'inrush', 'capacitor-input filter', 'unregulated supply'],
  prereq: ['full-wave-rectifier', 'capacitors', 'physics:rc-circuits'],
  related: ['linear-regulators', 'power-supply-design', 'power-factor-correction', 'half-wave-rectifier', 'fuses-protection'],
  body: `
Put a large capacitor across the output of a rectifier and it charges to the peak voltage. When the input falls away the diodes switch off, and the capacitor alone supplies the load, its voltage sagging slowly until the next peak rises above it and tops it up. The output is DC with a sawtooth **ripple** on it.

### How big is the ripple?
Between peaks the load draws a current $I$ for (almost) the whole ripple period $1/f_r$, taking a charge $Q = I/f_r$ out of the capacitor. Since $\\Delta V = Q/C$:

$$\\Delta V \\approx \\frac{I}{f_r\\,C}$$

with $f_r = f$ for a half-wave and $2f$ for a full-wave rectifier. The formula assumes the capacitor discharges for the whole period, so it slightly overestimates — the simulator typically shows 70–85 % of it, a welcome margin. Doubling $C$ halves the ripple; so does full-wave instead of half-wave. The average output is about $V_{pk} - \\Delta V/2$.

### The price: pulses of current
The diodes conduct only while the input is above the capacitor voltage — a short window near each peak, the **conduction angle** $\\theta$:

$$\\cos\\theta = 1 - \\frac{\\Delta V}{V_{pk}}$$

For 10 % ripple that is about 26° of each 180° half-cycle. All the charge the load used in a whole half-cycle must be put back in that window, so the current comes in tall pulses — typically **5 to 10 times the DC load current** (more with a stiff transformer, less with winding resistance). Consequences:
- The **RMS current** in the transformer, the diodes and the capacitor is much larger than the DC current: size the transformer and the diodes for it.
- The capacitor has a **ripple-current rating** (RMS, at 100 Hz or 120 Hz). Its internal resistance (ESR) heats it, and electrolytic capacitor life roughly halves for every 10 °C. Expect a ripple current of 1.5–2.5 times $I_{dc}$.
- The mains current is spiky and rich in harmonics: a poor **power factor**. That is why larger off-line supplies must add [[power-factor-correction]].
- At switch-on the empty capacitor draws an **inrush** limited only by the winding and diode resistances: tens of amps for a few milliseconds. The diode's surge rating $I_{FSM}$ and a slow-blow fuse must allow for it.

### Designing a reservoir capacitor
1. Decide the **lowest voltage** you can accept at the bottom of the ripple — for a linear regulator, its output plus its dropout (a 7805 needs about 7–7.5 V; an LDO less).
2. Work out the **lowest peak**: low mains (−10 %), full load, the diode drops at peak current.
3. The allowed ripple is the difference: $C = I/(f_r\\,\\Delta V)$. Round up to a standard value.
4. Check the **voltage rating** at high mains and no load (a small transformer's off-load voltage is 10–20 % above its rating), and the **ripple-current rating**.

> [!tip] More capacitance is not free. It narrows the pulses, raising the peak and RMS currents, the inrush and the heating. Let the capacitor take the ripple down to what the regulator can follow, and let the regulator do the rest.
`,
  ideas: [
    'The reservoir capacitor charges at each peak and feeds the load between peaks.',
    'Ripple ΔV ≈ I/(f_r C), with f_r = f (half-wave) or 2f (full-wave); the estimate is slightly pessimistic.',
    'The diodes conduct only for a short angle near each peak: cos θ = 1 − ΔV/V_pk.',
    'Current flows in pulses of 5–10 × I_dc: size transformer, diodes and capacitor ripple current for them.',
    'Design from the lowest acceptable voltage at low mains and full load.'
  ],
  pitfalls: [
    'The bigger the capacitor, the better — It narrows the current pulses, increasing peak and RMS currents, inrush and heating; beyond what the regulator needs it only costs.',
    'The diodes carry the DC load current — They carry short pulses several times larger; their RMS and surge ratings matter.',
    'An electrolytic rated 25 V is fine on a 24 V output — The off-load peak at high mains can exceed 30 V from a "24 V" design; leave margin.'
  ],
  formulas: [
    {
      name: 'Ripple voltage (peak to peak)',
      expr: 'Vr = I/(fr*C)', tex: '\\Delta V = \\frac{I}{f_r\\, C}',
      vars: {
        Vr: { name: 'ripple, peak to peak', q: 'voltage', unit: 'V', tex: '\\Delta V' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 1 },
        fr: { name: 'ripple frequency (2 × mains for full-wave)', q: 'frequency', unit: 'Hz', value: 100, tex: 'f_r' },
        C: { name: 'reservoir capacitance', q: 'capacitance', unit: 'µF', value: 4700 }
      },
      note: 'Solve for $C$ to size the capacitor. Slightly pessimistic, because the capacitor is being recharged for part of each period.',
      stories: { Vr: 'A full-wave rectifier on 50 Hz mains ($f_r$ = {fr}) with {C} supplies {I}. Estimate the ripple.', C: 'What capacitance keeps the ripple to {Vr} at {I}, with a ripple frequency of {fr}?' },
      practice: { unknowns: ['Vr', 'C'] }
    },
    {
      name: 'Conduction angle',
      expr: 'theta = acos(1 - Vr/Vp)', tex: '\\theta = \\arccos\\left(1 - \\frac{\\Delta V}{V_{pk}}\\right)',
      vars: {
        theta: { name: 'conduction angle per pulse', q: 'angle', unit: '°', min: 0, max: 180 },
        Vr: { name: 'ripple, peak to peak', q: 'voltage', unit: 'V', value: 1.5, tex: '\\Delta V' },
        Vp: { name: 'peak output voltage', q: 'voltage', unit: 'V', value: 15, tex: 'V_{pk}' }
      },
      note: 'The diodes start conducting when the rising input meets the capacitor voltage at the bottom of the ripple, and stop at the peak.',
      stories: { theta: 'A supply peaks at {Vp} with {Vr} of ripple. For how many degrees of each half-cycle do the diodes conduct?' }
    },
    {
      name: 'Peak diode current, full-wave (triangular-pulse estimate)',
      expr: 'Ipk = 2*pi*I/theta', tex: 'I_{pk} \\approx \\frac{2\\pi\\, I}{\\theta}',
      vars: {
        Ipk: { name: 'peak diode current', q: 'current', unit: 'A', tex: 'I_{pk}' },
        I: { name: 'DC load current', q: 'current', unit: 'A', value: 1 },
        theta: { name: 'conduction angle (in mains-cycle degrees)', q: 'angle', unit: '°', value: 30, min: 1, max: 180 }
      },
      note: 'Each pulse must deliver the charge of a whole half-cycle, $I/(2f)$, in a time $\\theta/(2\\pi f)$. For a half-wave rectifier the peak is twice as large. Winding resistance widens and lowers real pulses.',
      stories: { Ipk: 'A full-wave supply delivers {I}; its diodes conduct for {theta} of each half-cycle. Estimate the peak diode current.' }
    }
  ],
  derivation: {
    title: 'Where the ripple formula comes from',
    steps: [
      { text: 'Between recharges the capacitor alone feeds the load. Over one ripple period $T_r = 1/f_r$ it loses the charge', tex: 'Q = I\\, T_r = \\frac{I}{f_r}' },
      { text: 'A capacitor\'s voltage changes by charge over capacitance:', tex: '\\Delta V = \\frac{Q}{C} = \\frac{I}{f_r\\, C}' },
      { text: 'This assumes the discharge lasts the whole period and the load current is constant. The recharge window takes up $\\theta/180°$ of it, so the true ripple is smaller by roughly that fraction — and with a resistive load the current falls a little as the voltage sags. Both errors make the formula safe to design with.' }
    ]
  },
  examples: [
    {
      title: 'The reservoir for a 5 V, 1 A regulated supply',
      q: 'A 7805 regulator needs at least 7.5 V at its input. It is fed from a 9 V (RMS) transformer through a bridge on 50 Hz mains that can be 10 % low. The diodes drop 1.0 V each at the peak current. Size the capacitor.',
      steps: [
        'Lowest secondary: $9 \\times 0.9 = 8.1\\ \\mathrm{V_{rms}}$, peak $8.1\\sqrt 2 = 11.46\\ \\mathrm{V}$.',
        'Minus two diode drops: $V_{pk} = 11.46 - 2.0 = 9.46\\ \\mathrm{V}$.',
        'Allowed ripple: $9.46 - 7.5 = 1.96\\ \\mathrm{V}$. $C = 1/(100 \\times 1.96) = 5100\\ \\mu\\mathrm{F}$.',
        'Choose 6800 µF (ripple ≈ 1.5 V). Voltage rating: at high mains the peak is about 14 V, and more off-load — a 25 V capacitor. Ripple-current rating: about 2 A RMS.'
      ],
      a: '6800 µF, 25 V, rated for about 2 A of ripple current.'
    },
    {
      title: 'How hard do the diodes work?',
      q: 'A bridge supply peaks at 15 V with 1.5 V of ripple, delivering 0.15 A. Estimate the conduction angle and the peak diode current.',
      steps: [
        '$\\cos\\theta = 1 - 1.5/15 = 0.9$, so $\\theta = 25.8°$ of each 180° half-cycle.',
        '$I_{pk} \\approx 2\\pi \\times 0.15/(25.8° \\times \\pi/180°) = 0.94/0.450 = 2.1\\ \\mathrm{A}$ — fourteen times the load current.',
        'In the simulator (1000 µF, 100 Ω, 0.5 Ω winding resistance) the winding resistance stretches the pulses to about 40° and the peak is 1.1 A, seven times the load current. Either way, far more than 0.15 A.'
      ],
      a: 'About 26° and 1–2 A peaks for a 0.15 A load.'
    }
  ],
  quiz: [
    { q: 'You double the reservoir capacitance of a supply. The ripple…', choices: ['doubles', 'halves', 'stays the same', 'falls to a quarter'], a: 1,
      why: 'ΔV ≈ I/(f_r C): the ripple is inversely proportional to C.' },
    { q: 'Estimate the ripple of a full-wave, 50 Hz supply delivering 2 A from 10 000 µF.', answer: 2, unit: 'V',
      why: 'ΔV = I/(f_r C) = 2 / (100 × 0.01) = 2 V (a little less in reality).' },
    { q: 'For the same ripple and load, a half-wave rectifier needs how much capacitance compared with a full-wave one?', choices: ['half', 'the same', 'twice', 'four times'], a: 2,
      why: 'Its capacitor is recharged once per cycle instead of twice, so f_r halves and C must double.' },
    { q: 'Making the reservoir capacitor larger makes the diode current pulses…', choices: ['longer and lower', 'shorter and taller', 'unchanged', 'disappear'], a: 1,
      why: 'Less ripple means the input rises above the capacitor voltage later: a shorter window, into which the same charge must be squeezed.' },
    { q: 'The formula ΔV = I/(f_r C) tends to overestimate the ripple slightly.', a: true,
      why: 'It assumes the capacitor discharges for the whole period, but part of each period is spent recharging.' }
  ],
  applications: ['The unregulated input of every linear power supply.', 'The DC bus of mains-powered switch-mode supplies and motor drives.', 'Sizing capacitors for ripple current and lifetime.', 'Explaining why power-factor correction exists.'],
  sim: { id: 'dio-rectifier', params: { mode: 'bridge', cap: true } }
},

{
  id: 'zener-regulator', parent: 'diode-circuits', title: 'The Zener voltage regulator', level: 2,
  short: 'A resistor and a Zener diode hold a steady voltage from a varying supply: the Zener takes whatever current the load does not. Simple and robust, but inefficient and only as good as the Zener\'s slope.',
  keywords: ['Zener regulator', 'shunt regulator', 'series resistor', 'load regulation', 'line regulation', 'drop-out', 'Zener dissipation', 'emitter follower regulator', 'pass transistor', 'reference'],
  prereq: ['zener-diodes', 'kirchhoffs-laws', 'power-energy'],
  related: ['linear-regulators', 'emitter-follower', 'power-supply-design', 'thevenin-norton', 'smoothing-ripple'],
  body: `
Feed a Zener diode through a resistor from a voltage higher than its $V_Z$, and connect the load across the Zener. The resistor carries a current set by the difference between input and output; the Zener and the load share it. If the load draws less, the Zener takes more; if the input rises, the extra current goes into the Zener. Either way the output stays near $V_Z$. It is a **shunt regulator**: the regulating element is in parallel with the load.

$$I_R = \\frac{V_{in} - V_Z}{R} = I_Z + I_L$$

### Designing it: two worst cases
**Keeping regulation.** At the lowest input and the highest load current, there must still be enough current left for the Zener to stay above its knee, $I_{Z,min}$ (1–5 mA, or about 10 % of the load current):

$$R \\le \\frac{V_{in,min} - V_Z}{I_{L,max} + I_{Z,min}}$$

**Surviving.** At the highest input and the lightest load (often no load at all) the Zener takes everything:

$$P_Z = V_Z\\left(\\frac{V_{in,max} - V_Z}{R} - I_{L,min}\\right)$$

That must stay well inside the Zener's derated power. The resistor dissipates $(V_{in,max} - V_Z)^2/R$.

### How well does it regulate?
Beyond the knee the Zener behaves like a voltage $V_Z$ in series with its dynamic resistance $r_z$ (a few ohms to a few tens of ohms). Treating the circuit as a divider:
- **Line regulation:** a change $\\Delta V_{in}$ appears at the output reduced by $r_z/(R + r_z)$ — typically 5–10 % of it.
- **Load regulation:** the output resistance is $R \\parallel r_z \\approx r_z$, so a load change $\\Delta I_L$ moves the output by about $r_z\\,\\Delta I_L$.

With $r_z$ = 15 Ω, a 20 mA load step moves the output by about 0.3 V: a few percent, fine for a bias rail, poor for a precision reference.

### Where it runs out
- **Drop-out:** if the load draws more than $I_R$, the Zener turns off and the output simply follows the resistor divider down. The load-line graph in the simulation shows the moment it happens.
- **Efficiency:** the resistor current flows whatever the load; at light load nearly all of it heats the Zener. Efficiencies of 10–30 % are normal.

### Doing better
- **Add an emitter follower.** Put the Zener on the base of a transistor and take the output from its emitter, one $V_{BE}$ (about 0.65 V) lower. The Zener now supplies only the base current, $I_L/\\beta$, and the output resistance falls by roughly the transistor's gain. This is the basic series regulator inside every [[linear-regulators|linear regulator]].
- **Feed it from a current source** instead of a resistor: line regulation improves dramatically.
- **Use a better shunt element:** a TL431 has a slope resistance of about 0.2 Ω, a hundred times better than a Zener.
- Or simply use a three-terminal regulator (78xx, LM317, an LDO).

> [!tip] Put 10–100 µF across the Zener. It shunts the Zener's own noise (avalanche diodes are noisy — some are sold as noise sources) and helps the regulator ride through load steps.
`,
  ideas: [
    'A shunt regulator: the resistor current is shared by Zener and load; the Zener absorbs the variation.',
    'Size R at minimum input and maximum load, keeping the Zener above its knee current.',
    'Check Zener power at maximum input and minimum load — often no load.',
    'Output resistance ≈ r_z; line changes are reduced by r_z/(R + r_z).',
    'An emitter follower on the Zener cuts its burden by β and gives the basic series regulator.'
  ],
  pitfalls: [
    'The Zener\'s power is worst at full load — It is worst with no load, when the Zener takes all of the resistor\'s current.',
    'A smaller resistor is always safer because it guarantees regulation — It also raises the Zener\'s no-load current and dissipation, and the resistor\'s own power.',
    'The Zener regulator\'s output is exactly V_Z — It rises with Zener current through r_z, so it changes with load and input; expect a few percent.'
  ],
  formulas: [
    {
      name: 'Series resistor',
      expr: 'R = (Vin - Vz)/(IL + Iz)', tex: 'R = \\frac{V_{in} - V_Z}{I_L + I_Z}',
      vars: {
        R: { name: 'series resistor (maximum value)', q: 'resistance', unit: 'Ω' },
        Vin: { name: 'lowest input voltage', q: 'voltage', unit: 'V', value: 9, tex: 'V_{in}' },
        Vz: { name: 'Zener voltage', q: 'voltage', unit: 'V', value: 5.1, tex: 'V_Z' },
        IL: { name: 'largest load current', q: 'current', unit: 'mA', value: 20, tex: 'I_L' },
        Iz: { name: 'minimum Zener current', q: 'current', unit: 'mA', value: 5, tex: 'I_Z' }
      },
      stories: { R: 'A {Vz} Zener regulator runs from an input that can fall to {Vin} and must supply up to {IL}, keeping at least {Iz} in the Zener. What is the largest series resistor?', IL: 'With {R} from {Vin} and a {Vz} Zener that needs {Iz}, what is the largest load current?' }
    },
    {
      name: 'Zener dissipation, worst case',
      expr: 'Pz = Vz*((Vmax - Vz)/R - ILmin)', tex: 'P_Z = V_Z\\left(\\frac{V_{in,max} - V_Z}{R} - I_{L,min}\\right)',
      vars: {
        Pz: { name: 'Zener power', q: 'power', unit: 'mW', tex: 'P_Z' },
        Vz: { name: 'Zener voltage', q: 'voltage', unit: 'V', value: 5.1, tex: 'V_Z' },
        Vmax: { name: 'highest input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{in,max}' },
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', value: 150 },
        ILmin: { name: 'smallest load current', q: 'current', unit: 'mA', value: 0, tex: 'I_{L,min}' }
      },
      stories: { Pz: 'A {Vz} Zener is fed through {R} from up to {Vmax}; the load can fall to {ILmin}. What must the Zener dissipate?' }
    },
    {
      name: 'Line regulation',
      expr: 'dVo = dVin*rz/(R + rz)', tex: '\\Delta V_{out} = \\Delta V_{in}\\,\\frac{r_z}{R + r_z}',
      vars: {
        dVo: { name: 'change of output', q: 'voltage', unit: 'mV', tex: '\\Delta V_{out}' },
        dVin: { name: 'change of input', q: 'voltage', unit: 'V', value: 3, tex: '\\Delta V_{in}' },
        rz: { name: 'Zener dynamic resistance', q: 'resistance', unit: 'Ω', value: 15, tex: 'r_z' },
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', value: 150 }
      },
      stories: { dVo: 'The input of a Zener regulator ({R}, $r_z$ = {rz}) swings by {dVin}. How much does the output move?' }
    },
    {
      name: 'Load regulation',
      expr: 'dVo = dIL*R*rz/(R + rz)', tex: '\\Delta V_{out} = \\Delta I_L\\,(R \\parallel r_z)',
      vars: {
        dVo: { name: 'fall of output', q: 'voltage', unit: 'mV', tex: '\\Delta V_{out}' },
        dIL: { name: 'change of load current', q: 'current', unit: 'mA', value: 20, tex: '\\Delta I_L' },
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', value: 150 },
        rz: { name: 'Zener dynamic resistance', q: 'resistance', unit: 'Ω', value: 15, tex: 'r_z' }
      },
      note: 'Valid while the Zener stays above its knee. Since $r_z \\ll R$, the output resistance is nearly $r_z$.',
      stories: { dVo: 'The load on a Zener regulator ({R}, $r_z$ = {rz}) rises by {dIL}. By how much does the output fall?' }
    }
  ],
  examples: [
    {
      title: 'A 5.1 V rail for up to 20 mA',
      q: 'Design a Zener regulator giving 5.1 V at 0–20 mA from an input of 9–12 V, with a 500 mW Zener ($r_z$ ≈ 15 Ω). Estimate its regulation and efficiency.',
      steps: [
        'Resistor: $R \\le (9 - 5.1)/(20 + 5\\ \\mathrm{mA}) = 156\\ \\Omega$. Choose 150 Ω (E12).',
        'Check at 9 V, full load: $I_R = 3.9/150 = 26\\ \\mathrm{mA}$, leaving 6 mA for the Zener. Good.',
        'Zener at 12 V, no load: $I_R = 6.9/150 = 46\\ \\mathrm{mA}$, $P_Z = 5.1 \\times 0.046 = 235\\ \\mathrm{mW}$ — inside 500 mW even derated to 70 °C (350 mW). Resistor: $6.9^2/150 = 0.32\\ \\mathrm{W}$: use a 0.5 W part or larger.',
        'Regulation: a 20 mA load step moves the output by about $20\\ \\mathrm{mA} \\times (150 \\parallel 15) = 0.27\\ \\mathrm{V}$; the 3 V input range by $3 \\times 15/165 = 0.27\\ \\mathrm{V}$.',
        'Efficiency at 12 V and full load: $5.1 \\times 0.020/(12 \\times 0.046) = 18\\ \\%$.'
      ],
      a: 'R = 150 Ω (0.5 W); Zener up to 235 mW; output within about ±0.3 V; efficiency under 20 %.'
    },
    {
      title: 'Adding an emitter follower',
      q: 'A 5.6 V Zener ($r_z$ = 15 Ω) drives the base of an NPN transistor (β ≈ 50) supplying 100 mA from 9–12 V. Choose the Zener resistor and compare the output resistance with the bare Zener circuit.',
      steps: [
        'The output is one $V_{BE}$ below the Zener: $5.6 - 0.65 \\approx 4.95\\ \\mathrm{V}$.',
        'The base needs $100/50 = 2\\ \\mathrm{mA}$; with 5 mA for the Zener, $R \\le (9 - 5.6)/7\\ \\mathrm{mA} = 486\\ \\Omega$: use 470 Ω.',
        'Output resistance ≈ $r_e + (R \\parallel r_z)/\\beta = 26\\ \\mathrm{mV}/100\\ \\mathrm{mA} + 14.5/51 = 0.26 + 0.28 \\approx 0.5\\ \\Omega$, against about 14 Ω for a bare Zener regulator.',
        'The transistor dissipates up to $(12 - 4.95) \\times 0.1 = 0.7\\ \\mathrm{W}$: a TO-126 or TO-220 part, with a small heat sink in a warm box.'
      ],
      a: 'R = 470 Ω; output ≈ 4.95 V with about 0.5 Ω output resistance — some thirty times stiffer.'
    }
  ],
  quiz: [
    { q: 'The load of a working Zener regulator is disconnected. The Zener current…', choices: ['falls to zero', 'rises by the load current that was flowing', 'stays the same', 'reverses'], a: 1,
      why: 'The resistor current hardly changes (the output is nearly constant), so the Zener takes the share the load no longer draws.' },
    { q: 'When is a Zener regulator\'s Zener diode most likely to overheat?', choices: ['Lowest input, full load', 'Highest input, no load', 'Lowest input, no load', 'Highest input, full load'], a: 1,
      why: 'Most resistor current (highest input) and none of it diverted to the load.' },
    { q: 'What is the largest series resistor for a 5.1 V Zener regulator supplying 30 mA from a minimum of 12 V, keeping 5 mA in the Zener?', answer: 197, unit: 'Ω',
      why: 'R = (12 − 5.1)/(30 + 5 mA) = 6.9/0.035 = 197 Ω; choose 180 Ω from the E12 series.' },
    { q: 'A larger series resistor improves line regulation but lowers the load current the regulator can supply.', a: true,
      why: 'Line regulation goes as r_z/(R + r_z), better for larger R; but the available current (V_in − V_Z)/R falls.' },
    { q: 'The output resistance of a simple Zener regulator is roughly…', choices: ['the series resistor R', 'the Zener\'s dynamic resistance r_z', 'zero', 'the load resistance'], a: 1,
      why: 'Looking back into the output you see R in parallel with r_z; since r_z ≪ R, it is about r_z.' }
  ],
  applications: ['Bias rails and references for comparators and transistor stages.', 'Supplying a small circuit from a higher voltage (a microcontroller\'s supervisor, a gate driver).', 'The reference inside discrete series regulators.', 'Clamping a supply against over-voltage with a series resistor or fuse.'],
  sim: 'dio-zener'
},

{
  id: 'clippers-clampers', parent: 'diode-circuits', title: 'Clippers and clampers', level: 2,
  short: 'Diodes can cut a waveform off at a chosen level (clipping, used to protect inputs) or, with a capacitor, shift the whole waveform up or down without changing its shape (clamping).',
  keywords: ['clipper', 'limiter', 'clamper', 'clamp', 'DC restorer', 'input protection', 'ESD diodes', 'injection current', 'clamp diode', 'BAT54S', 'waveform shaping', 'level shift'],
  prereq: ['diode-models', 'half-wave-rectifier', 'rc-transient'],
  related: ['voltage-multiplier', 'zener-diodes', 'microcontrollers', 'rc-low-pass', 'comparators'],
  body: `
Two diode tricks shape waveforms: a **clipper** removes whatever goes beyond a level; a **clamper** keeps the shape but slides the whole waveform up or down.

### Clippers (limiters)
A series resistor feeds the output; a diode from the output to a reference voltage $V_B$ conducts as soon as the output tries to exceed $V_B + V_F$, and the resistor drops the excess:

$$V_{clip} = V_B + V_F$$

Variations:
- **Two diodes back to back** across the signal limit it to about ±0.6 V whatever comes in — the standard protection across the inputs of a sensitive amplifier or a headphone driver.
- **Back-to-back Zeners** limit at $\\pm(V_Z + V_F)$.
- A diode in **series** (the half-wave rectifier) removes a whole polarity.
- The shape is soft because the diode's curve is exponential; for sharp, accurate limits put the diodes in an op-amp's feedback loop.

### The clamp diodes you already have
Every CMOS input has **ESD protection diodes** to both supply rails. They clamp the pin to between $-0.5$ V and $V_{DD} + 0.5$ V — but they are small, and datasheets allow only a milliamp or a few of **injection current** (some allow none). An input that can see more than the supply needs a **series resistor** to limit that current:

$$R \\ge \\frac{V_{in,max} - V_{DD} - V_F}{I_{inj,max}}$$

With external Schottky diodes (a BAT54S pair to the rails) the clamp takes over from the internal diodes at 0.3 V instead of 0.6 V. Two traps:
- **Back-powering.** Injected current flows into the $V_{DD}$ rail. If the circuit draws less than that — asleep, or switched off — the rail rises, and a board can half-power itself from an input signal. A Zener or a small load on the rail prevents it.
- The series resistor and the pin capacitance form an [[rc-low-pass|RC low-pass]]: 22 kΩ and 10 pF have a corner near 700 kHz — fine for a switch input, not for a fast bus.

### Clampers (DC restorers)
Now make the series element a **capacitor** and point a diode from ground to the output. On the first negative peak the diode conducts and charges the capacitor to $V_p - V_F$. After that the capacitor behaves like a battery in series with the signal, and the whole waveform sits above ground: it swings from $-V_F$ to $2V_p - V_F$. Reverse the diode and it hangs below ground; put a battery in series with the diode and the lowest point is clamped at $V_B - V_F$.

The capacitor slowly loses charge into the load between peaks, and the diode tops it up each cycle. For the shape to survive, the time constant must be long compared with the period — $RC \\gg T$ — and the droop per cycle is about

$$\\Delta V \\approx \\frac{V_C}{R C f}$$

If $RC$ is short instead, the circuit is just a high-pass filter with a diode on it.

**Where clampers are used:** restoring the black level of video after a coupling capacitor (a *sync-tip clamp*), shifting a gate-drive signal to sit below or above a rail, bringing an AC-coupled signal into an ADC's range — and as the first half of every [[voltage-multiplier]].
`,
  ideas: [
    'A shunt clipper: series resistor plus a diode to a reference; the output cannot pass V_B + V_F.',
    'Back-to-back diodes limit to about ±0.6 V; back-to-back Zeners to ±(V_Z + 0.6 V).',
    'CMOS inputs have clamp diodes to the rails; limit the injected current with a series resistor.',
    'A clamper (capacitor + diode) shifts the waveform so one of its peaks sits at the clamp level.',
    'Clamping needs RC ≫ T; the droop per cycle is about V_C/(RCf).'
  ],
  pitfalls: [
    'The microcontroller\'s internal clamp diodes make any input voltage safe — They are rated for a few milliamps at most; without a series resistor they fail or latch the chip up.',
    'Injected current simply disappears into the supply — It raises the supply rail if nothing else draws it, back-powering the circuit.',
    'A clamper changes the waveform\'s shape — An ideal clamper only adds a DC shift; the shape changes only if RC is too short.'
  ],
  formulas: [
    {
      name: 'Clipping level of a shunt clipper',
      expr: 'Vclip = VB + VF', tex: 'V_{clip} = V_B + V_F',
      vars: {
        Vclip: { name: 'clipping level', q: 'voltage', unit: 'V', tex: 'V_{clip}', signed: true },
        VB: { name: 'bias (reference) voltage', q: 'voltage', unit: 'V', value: 2, signed: true, tex: 'V_B' },
        VF: { name: 'diode forward drop', q: 'voltage', unit: 'V', value: 0.6, tex: 'V_F' }
      },
      stories: { Vclip: 'A shunt clipper uses a silicon diode ({VF}) to a {VB} reference. At what level does it clip?' }
    },
    {
      name: 'Input protection resistor',
      expr: 'R = (Vin - Vdd - VF)/Iinj', tex: 'R = \\frac{V_{in,max} - V_{DD} - V_F}{I_{inj,max}}',
      vars: {
        R: { name: 'minimum series resistor', q: 'resistance', unit: 'kΩ' },
        Vin: { name: 'highest input voltage', q: 'voltage', unit: 'V', value: 24, tex: 'V_{in,max}' },
        Vdd: { name: 'supply voltage of the input', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{DD}' },
        VF: { name: 'clamp diode drop', q: 'voltage', unit: 'V', value: 0.5, tex: 'V_F' },
        Iinj: { name: 'allowed injection current', q: 'current', unit: 'mA', value: 1, tex: 'I_{inj,max}' }
      },
      stories: { R: 'A {Vdd} microcontroller pin may see {Vin}; its clamp diodes drop {VF} and may take {Iinj}. What series resistor is needed?' }
    },
    {
      name: 'Clamper droop per cycle',
      expr: 'dV = Vc/(R*C*f)', tex: '\\Delta V \\approx \\frac{V_C}{R\\,C\\,f}',
      vars: {
        dV: { name: 'droop per cycle', q: 'voltage', unit: 'mV', tex: '\\Delta V' },
        Vc: { name: 'capacitor (shift) voltage', q: 'voltage', unit: 'V', value: 4.4, tex: 'V_C' },
        R: { name: 'load resistance', q: 'resistance', unit: 'kΩ', value: 100 },
        C: { name: 'coupling capacitor', q: 'capacitance', unit: 'µF', value: 1 },
        f: { name: 'signal frequency', q: 'frequency', unit: 'kHz', value: 1 }
      },
      note: 'Valid while the droop is small, i.e. $RC \\gg 1/f$. The diode replaces the lost charge at each peak.',
      stories: { dV: 'A clamper holds {Vc} on {C}, feeding {R}, at {f}. How far does the level sag in each cycle?' }
    }
  ],
  examples: [
    {
      title: 'A 24 V signal into a 3.3 V microcontroller',
      q: 'An industrial sensor gives 0 or 24 V (up to 30 V with tolerances). The 3.3 V microcontroller allows 1 mA of injection per pin through its 0.5 V clamp diodes. Design the protection.',
      steps: [
        '$R \\ge (30 - 3.3 - 0.5)/1\\ \\mathrm{mA} = 26.2\\ \\mathrm{k\\Omega}$. Choose 33 kΩ: 0.79 mA at 30 V.',
        'At 24 V: $(24 - 3.8)/33\\ \\mathrm{k\\Omega} = 0.61\\ \\mathrm{mA}$ flows into the 3.3 V rail. If the board can sleep at less than 1 mA, add a load or a 3.6 V Zener on the rail against back-powering.',
        'Pin capacitance of 10 pF gives a corner at $1/(2\\pi \\times 33\\ \\mathrm{k\\Omega} \\times 10\\ \\mathrm{pF}) \\approx 480\\ \\mathrm{kHz}$ — no problem for a sensor.',
        'Better still: divide the 24 V down first (for example 47 kΩ over 10 kΩ gives 4.2 V at 24 V, clamped to 3.8 V) so the clamp works only on faults — or use an optocoupler.'
      ],
      a: 'At least 26 kΩ (use 33 kΩ); watch for back-powering of the 3.3 V rail.'
    },
    {
      title: 'A positive clamper on a 5 V sine',
      q: 'A 1 kHz sine of 5 V peak passes through 1 µF into 100 kΩ, with a 1N4148 from ground (anode) to the output (cathode). Describe the output.',
      steps: [
        'On the first negative peak the diode conducts and charges the capacitor to about $5 - 0.6 = 4.4\\ \\mathrm{V}$.',
        'The output is then the input plus 4.4 V: from about $-0.6$ V to $+9.4$ V, average $+4.4$ V. The shape is unchanged.',
        'Droop per cycle: $4.4/(100\\ \\mathrm{k\\Omega} \\times 1\\ \\mu\\mathrm{F} \\times 1\\ \\mathrm{kHz}) = 44\\ \\mathrm{mV}$, replaced by the diode at each negative peak.'
      ],
      a: 'A 10 V peak-to-peak sine from −0.6 V to +9.4 V.'
    }
  ],
  quiz: [
    { q: 'Two silicon diodes connected in antiparallel across a signal (with a series resistor) limit it to about…', choices: ['±0.06 V', '±0.6 V', '±6 V', 'only the positive half'], a: 1,
      why: 'Each diode conducts in one direction at about 0.6 V.' },
    { q: 'A positive clamper is fed with a 3 V peak sine. Ignoring the diode drop, its output swings between…', choices: ['−3 V and +3 V', '0 and +3 V', '0 and +6 V', '+3 V and +6 V'], a: 2,
      why: 'The capacitor charges to 3 V, shifting the waveform up so its lowest point sits at 0: from 0 to 6 V.' },
    { q: 'A clamper is built with RC much shorter than the signal period. What does it do?', choices: ['Clamps perfectly', 'It behaves like a high-pass filter with a diode: the shape is lost', 'It doubles the voltage', 'Nothing at all'], a: 1,
      why: 'The capacitor charges and discharges within each cycle, so the output shows spikes at the edges — the shape is not preserved.' },
    { q: 'What series resistor protects a 5 V input (0.5 V clamps, 2 mA allowed) from a 12 V signal?', answer: 3250, unit: 'Ω',
      why: 'R ≥ (12 − 5 − 0.5)/2 mA = 3.25 kΩ; choose 3.9 kΩ or more.' },
    { q: 'Current injected through a microcontroller\'s upper clamp diode can raise its supply rail.', a: true,
      why: 'It flows into V_DD; if the rest of the circuit draws less than that current, the rail voltage climbs — back-powering.' }
  ],
  applications: ['Protecting op-amp, ADC and microcontroller inputs.', 'Limiting the drive to headphones, meters or speakers.', 'Video black-level (sync-tip) clamps.', 'Level-shifting gate-drive signals; the first stage of voltage doublers.'],
  sim: { id: 'dio-shaper', params: { mode: 'clip' } }
},

{
  id: 'voltage-multiplier', parent: 'diode-circuits', title: 'Voltage multipliers', level: 3,
  short: 'Capacitors and diodes pump charge up a ladder, one step per cycle, to reach several times the input peak — no transformer windings needed, but the output sags quickly under load.',
  keywords: ['voltage multiplier', 'voltage doubler', 'Greinacher', 'Villard', 'Delon', 'Cockcroft-Walton', 'charge pump', 'voltage tripler', 'high voltage', 'ICL7660', 'MAX232'],
  prereq: ['clippers-clampers', 'smoothing-ripple', 'capacitors'],
  related: ['half-wave-rectifier', 'full-wave-rectifier', 'boost-converter', 'serial-buses', 'gate-drive'],
  body: `
A clamper shifts a sine up so that it swings from 0 to $2V_p$. Follow it with a peak detector — a diode into a capacitor — and you have a steady $2V_p$: the **half-wave (Greinacher) voltage doubler**. Stack more stages and the voltage climbs further.

### The doubler, step by step
1. **Negative half-cycle:** D1 conducts and charges C1 to $V_p$, positive on the diode side.
2. **Positive half-cycle:** C1 is now a $V_p$ battery in series with the source, so the node between them reaches $2V_p$. D2 conducts and charges C2 to $2V_p$.
3. Each cycle tops both up; with no load C2 settles at $2V_p$ less two diode drops.

Each diode and C2 must withstand $2V_p$; C1 only $V_p$. The **full-wave (Delon) doubler** uses two peak detectors, one on each half-cycle, stacked in series: its ripple is at $2f$ and it regulates better. It hides inside many older PC power supplies, where a 115/230 V switch turns the input bridge into a doubler on 115 V mains.

### The Cockcroft–Walton ladder
Repeat the clamper–peak-detector pair $N$ times and the output approaches

$$V_{out} = 2N\\,(V_p - V_F)$$

while no single diode or capacitor ever sees more than $2V_p$ — which is why the ladder reaches hundreds of kilovolts from modest parts. It charges up gradually: each cycle passes a packet of charge one rung higher, so it takes many cycles to fill.

### Loading: the catch
Every rung must pass the load current up the ladder, so each capacitor's charge is shared, and the output falls sharply with load. For $N$ stages, capacitors $C$, frequency $f$ and load current $I$:

$$\\Delta V = \\frac{I}{fC}\\left(\\frac{2N^3}{3} + \\frac{N^2}{2} - \\frac{N}{6}\\right), \\qquad V_r = \\frac{I}{fC}\\cdot\\frac{N(N+1)}{2}$$

(drop and peak-to-peak ripple). The $N^3$ term dominates: doubling the stages multiplies the drop by about eight. Multipliers therefore serve **small currents** — microamps to milliamps — and modern ones run at **tens of kilohertz** so that $I/(fC)$ is tiny.

### Where they are used
- The anode supply of cathode-ray tubes (the "tripler"), photomultiplier tubes, X-ray tubes, electrostatic precipitators, ionisers, insect zappers and laser-printer corona wires.
- **Charge pumps** in ICs — the same principle with switches instead of diodes: the ICL7660 makes −5 V from +5 V, and the MAX232 generates ±10 V for RS-232 lines from a 5 V supply.
- Bootstrap gate drivers, which lift a capacitor above a rail to drive a high-side MOSFET ([[gate-drive]]).

> [!warn] High-voltage multipliers store their charge after switch-off. Fit bleeder resistors, and discharge every capacitor with an insulated, resistive probe before touching.
`,
  ideas: [
    'A doubler is a clamper followed by a peak detector: output 2V_p.',
    'An N-stage Cockcroft–Walton ladder reaches 2N(V_p − V_F), with no part seeing more than 2V_p.',
    'The ladder charges up gradually, one packet of charge per rung per cycle.',
    'The load drop grows as N³ and falls as 1/(fC): few stages, high frequency, small currents.',
    'Switched-capacitor charge pumps are the IC version of the same idea.'
  ],
  pitfalls: [
    'More stages always give more voltage — Under load the drop grows as N³; beyond a few stages extra rungs add little except loss.',
    'A multiplier gets energy for free — The source supplies at least the output power (plus losses); the input current is correspondingly larger than the output current.',
    'Every capacitor in a Cockcroft–Walton ladder needs to be rated for the full output voltage — Each needs only about 2V_p (the first one V_p).'
  ],
  formulas: [
    {
      name: 'Unloaded output of an N-stage multiplier',
      expr: 'Vout = 2*N*(Vp - VF)', tex: 'V_{out} = 2N\\,(V_p - V_F)',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{out}' },
        N: { name: 'number of stages (1 = doubler)', value: 3, int: true, min: 1, max: 20 },
        Vp: { name: 'input peak voltage', q: 'voltage', unit: 'V', value: 10, tex: 'V_p' },
        VF: { name: 'diode drop', q: 'voltage', unit: 'V', value: 0.6, tex: 'V_F' }
      },
      stories: { Vout: 'An {N}-stage Cockcroft–Walton ladder is fed with a {Vp} peak sine ({VF} per diode). What is its no-load output?', N: 'How many stages are needed to reach {Vout} from a {Vp} peak input ({VF} per diode)?' }
    },
    {
      name: 'Output drop under load (Cockcroft–Walton)',
      expr: 'dV = I/(f*C)*(2*N^3/3 + N^2/2 - N/6)', tex: '\\Delta V = \\frac{I}{f C}\\left(\\frac{2N^3}{3} + \\frac{N^2}{2} - \\frac{N}{6}\\right)',
      vars: {
        dV: { name: 'drop from the no-load voltage', q: 'voltage', unit: 'V', tex: '\\Delta V' },
        I: { name: 'load current', q: 'current', unit: 'mA', value: 0.4 },
        f: { name: 'input frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'each capacitor', q: 'capacitance', unit: 'µF', value: 10 },
        N: { name: 'number of stages', value: 3, int: true, min: 1, max: 20 }
      },
      note: 'All capacitors equal. For $N = 1$ (the doubler) it reduces to $I/(fC)$.',
      stories: { dV: 'A {N}-stage ladder with {C} capacitors runs at {f} and supplies {I}. How far does its output fall below the no-load value?', C: 'What capacitance keeps the drop of a {N}-stage ladder at {f} to {dV} at {I}?' },
      practice: { unknowns: ['dV', 'C'] }
    },
    {
      name: 'Output ripple (Cockcroft–Walton)',
      expr: 'Vr = I/(f*C)*N*(N + 1)/2', tex: 'V_r = \\frac{I}{f C}\\cdot\\frac{N(N+1)}{2}',
      vars: {
        Vr: { name: 'ripple, peak to peak', q: 'voltage', unit: 'V', tex: 'V_r' },
        I: { name: 'load current', q: 'current', unit: 'mA', value: 0.4 },
        f: { name: 'input frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'each capacitor', q: 'capacitance', unit: 'µF', value: 10 },
        N: { name: 'number of stages', value: 3, int: true, min: 1, max: 20 }
      },
      stories: { Vr: 'A {N}-stage ladder with {C} capacitors at {f} supplies {I}. What is its ripple?' }
    }
  ],
  examples: [
    {
      title: 'A three-stage ladder on 50 Hz and on 20 kHz',
      q: 'A 3-stage Cockcroft–Walton ladder with 10 µF capacitors is fed with 10 V peak and loaded with 0.4 mA. Find the no-load voltage, the loaded voltage and the ripple at 50 Hz, then at 20 kHz.',
      steps: [
        'No load: $2 \\times 3 \\times (10 - 0.6) = 56.4\\ \\mathrm{V}$.',
        'At 50 Hz: $I/(fC) = 0.4\\ \\mathrm{mA}/(50 \\times 10\\ \\mu\\mathrm{F}) = 0.8\\ \\mathrm{V}$. Drop: $0.8 \\times (18 + 4.5 - 0.5) = 17.6\\ \\mathrm{V}$, so about 39 V; ripple $0.8 \\times 6 = 4.8\\ \\mathrm{V}$.',
        'At 20 kHz: $I/(fC) = 2\\ \\mathrm{mV}$; the drop is 44 mV and the ripple 12 mV. The same parts now give a stiff 56 V.',
        'The simulator agrees: about 37–40 V with 4 V of ripple at 50 Hz, about 54 V at 20 kHz (the diode drops at real currents are a little larger than 0.6 V).'
      ],
      a: '56.4 V unloaded; about 39 V with 4.8 V ripple at 50 Hz; essentially 56 V at 20 kHz.'
    },
    {
      title: 'How many stages for 1 kV?',
      q: 'You need about 1 kV at microamps from a 120 V (RMS) source. How many stages?',
      steps: [
        'Peak: $120\\sqrt 2 = 170\\ \\mathrm{V}$.',
        '$2N(170 - 1) \\ge 1000 \\Rightarrow N \\ge 2.96$: three stages give 1014 V with no load.',
        'At microamps the load drop is small, but use four stages for margin if the load is tens of microamps or the capacitors are small. Every capacitor needs a rating of at least 340 V (2V_p) plus margin: 400–630 V parts.'
      ],
      a: 'Three stages at minimum (1014 V no-load); four for margin, with 630 V capacitors.'
    }
  ],
  quiz: [
    { q: 'A Greinacher doubler is fed from 12 V RMS. Ignoring diode drops and load, what is its output?', answer: 33.9, unit: 'V',
      why: 'V_p = 12√2 = 17.0 V and the doubler gives 2V_p = 33.9 V.' },
    { q: 'In a 4-stage Cockcroft–Walton ladder fed with V_p, each capacitor after the first needs to withstand about…', choices: ['V_p', '2V_p', '4V_p', '8V_p'], a: 1,
      why: 'Each rung is only 2V_p above the one below; that is the ladder\'s great advantage.' },
    { q: 'Raising a multiplier\'s operating frequency from 50 Hz to 50 kHz, with the same capacitors and load, makes the load drop…', choices: ['a thousand times smaller', 'a thousand times larger', 'unchanged', 'ten times smaller'], a: 0,
      why: 'ΔV ∝ I/(fC): a thousand times the frequency, a thousandth of the drop.' },
    { q: 'Going from 2 to 4 stages (same C, f and load) multiplies the load drop by roughly…', choices: ['2', '4', '8', '16'], a: 2,
      why: 'The drop is dominated by 2N³/3. Exactly: N = 2 gives 7.0 and N = 4 gives 50.0 — a factor of about 7, close to the 8 of a pure cube.' },
    { q: 'A voltage multiplier can supply more power at its output than it draws from its source.', a: false,
      why: 'Energy is conserved. It trades current for voltage: the higher the output voltage, the smaller the current it can deliver.' }
  ],
  applications: ['CRT, photomultiplier and X-ray tube supplies.', 'Ionisers, precipitators and laser-printer corona supplies.', 'On-chip charge pumps (RS-232 transceivers, flash memory programming, negative rails).', 'Particle accelerators: the original Cockcroft–Walton generator.'],
  history: 'Heinrich Greinacher described the doubler and its multi-stage cascade between 1914 and 1920. John Cockcroft and Ernest Walton built a cascade of several hundred kilovolts at the Cavendish Laboratory and in 1932 used the protons it accelerated to split lithium nuclei — the first nuclear reaction produced by artificially accelerated particles.',
  sim: { id: 'dio-multiplier', params: { n: 1 } }
},

{
  id: 'flyback-diode', parent: 'diode-circuits', title: 'Flyback diodes and inductive kick', level: 2,
  short: 'Switching off a relay coil, solenoid or motor makes its inductance drive the voltage as high as needed to keep the current flowing; a diode across the coil gives the current a safe path and clamps the spike.',
  keywords: ['flyback diode', 'freewheeling diode', 'snubber diode', 'catch diode', 'suppression diode', 'inductive kick', 'back EMF', 'relay coil', 'solenoid', 'L di/dt', 'voltage spike', 'avalanche', 'Zener clamp', 'TVS', 'release time'],
  prereq: ['physics:inductance', 'rl-transient', 'pn-diode'],
  related: ['relays', 'bjt-switch', 'mosfet-switch', 'h-bridge', 'dc-motor-control', 'zener-diodes', 'buck-converter', 'physics:energy-in-inductor'],
  body: `
An inductor resists changes of current: $V = L\\,\\dfrac{di}{dt}$. Switch a relay coil on and the current rises gently, with the time constant $L/R$. Switch it off and the inductor insists on keeping the same current flowing for a moment — and it will produce **whatever voltage it takes** to do so. If the transistor tries to stop 30 mA in a microsecond, a 0.25 H coil answers with $0.25 \\times 0.03/10^{-6}$ = 7500 V.

In practice something gives way first: the stray capacitance of the wiring rings up to hundreds of volts, the transistor's collector breaks down in **avalanche**, or a mechanical switch **arcs**. The coil's stored energy, $\\tfrac12 LI^2$, is dumped into whatever broke down. A transistor survives some of this, then fails; contacts pit and weld; the interference resets microcontrollers nearby.

### The flyback diode
Put a diode across the coil, **cathode to the positive supply**. While the coil is energised the diode is reverse-biased and does nothing. At switch-off the coil's voltage reverses, the diode conducts, and the current circulates round the loop of coil and diode, dying away with the time constant $L/R$ of the coil. The switch sees only the supply plus one diode drop — 12.7 V on a 12 V relay — and the energy ends up as heat in the coil's own resistance.

It goes by many names: flyback, freewheeling, snubber, catch, suppression diode. A 1N4148 suits relays up to 100–200 mA; a 1N4007 larger ones. Many relay modules and some relays have it built in — which makes their coil polarised.

### The catch: slow release
The diode lets the current decay slowly, so the relay's armature lets go later — a few milliseconds — and its contacts open slowly, which increases arcing on the *load* side. When release time matters:
- **Diode + Zener** in series: the clamp rises to $V_{CC} + V_Z + V_F$ and the current falls roughly linearly, in about $LI/V_Z$ — several times faster.
- **Diode + resistor**: the clamp is $V_{CC} + IR$ and the time constant becomes $L/(R_{coil} + R)$.
- A **TVS** across the transistor does the same job as the Zener.
Either way the transistor's rating ($V_{CEO}$ or $V_{DS}$) must exceed the clamp voltage with margin. The simulation compares all four.

### Beyond relays
- **PWM-driven motors and solenoids:** the diode conducts on every PWM cycle, carrying the full load current for part of each period — use a fast (Schottky or ultrafast) diode rated for that current. In an [[h-bridge]] the freewheeling diodes (often the MOSFETs' body diodes) do this job, and in a [[buck-converter]] the freewheeling diode *is* the converter.
- **AC coils:** a diode would short every other half-cycle. Use an RC snubber or a varistor instead.
- **Long cables to inductive loads:** put the suppression at the coil, not at the switch, so that the circulating current does not radiate from the cable.

> [!warn] Fitted backwards, a flyback diode is a short circuit across the supply the moment the transistor turns on — the diode or the transistor fails immediately. The band (cathode) goes to the supply side.
`,
  ideas: [
    'An inductor keeps its current flowing at switch-off by producing whatever voltage is needed: V = L di/dt.',
    'Without protection the stored energy ½LI² is dumped into an avalanching transistor or an arcing contact.',
    'A reverse diode across the coil clamps the switch at V_supply + 0.7 V and lets the current decay with τ = L/R.',
    'The slow decay delays relay release; a series Zener or resistor speeds it at the cost of a higher clamp voltage.',
    'PWM loads need a fast diode rated for the load current; AC coils need RC snubbers or varistors instead.'
  ],
  pitfalls: [
    'The flyback diode must be rated for the spike voltage — It prevents the spike: it only ever sees the supply voltage in reverse, and carries the coil current forwards briefly.',
    'Any diode works on a PWM-driven motor — There it conducts every cycle; a slow rectifier recovers too slowly and overheats, and its current rating must match the motor current.',
    'A flyback diode is harmless whichever way round it goes — Reversed, it shorts the supply as soon as the switch closes.'
  ],
  formulas: [
    {
      name: 'Voltage of an interrupted inductor current',
      expr: 'V = L*I/t', tex: 'V = L\\,\\frac{\\Delta I}{\\Delta t}',
      vars: {
        V: { name: 'induced voltage', q: 'voltage', unit: 'V' },
        L: { name: 'inductance', q: 'inductance', unit: 'H', value: 0.25 },
        I: { name: 'current interrupted', q: 'current', unit: 'mA', value: 30, tex: '\\Delta I' },
        t: { name: 'time taken to interrupt it', q: 'time', unit: 'µs', value: 10, tex: '\\Delta t' }
      },
      note: 'An average over the switching time; the real peak is set by whatever breaks down or by the stray capacitance.',
      stories: { V: 'A {L} relay coil carrying {I} is switched off in {t}. What voltage would it produce?' }
    },
    {
      name: 'Energy stored in the coil',
      expr: 'E = L*I^2/2', tex: 'E = \\tfrac12 L I^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'mJ' },
        L: { name: 'inductance', q: 'inductance', unit: 'H', value: 0.25 },
        I: { name: 'coil current', q: 'current', unit: 'mA', value: 30 }
      },
      stories: { E: 'How much energy does a {L} coil store at {I}?' }
    },
    {
      name: 'Current decay time with a plain flyback diode',
      expr: 't = L/R*ln(I0/I1)', tex: 't = \\frac{L}{R}\\,\\ln\\frac{I_0}{I_1}',
      vars: {
        t: { name: 'time for the current to fall to I₁', q: 'time', unit: 'ms' },
        L: { name: 'coil inductance', q: 'inductance', unit: 'H', value: 0.25 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 400 },
        I0: { name: 'current at switch-off', q: 'current', unit: 'mA', value: 30, tex: 'I_0' },
        I1: { name: 'current of interest (e.g. drop-out)', q: 'current', unit: 'mA', value: 3, tex: 'I_1' }
      },
      note: 'Ignores the diode drop, which speeds the decay slightly. The armature\'s own mechanical release time comes on top.',
      stories: { t: 'A relay coil ({L}, {R}) carries {I0} and has a flyback diode. How long until the current falls to {I1}?' }
    },
    {
      name: 'Decay time with a Zener clamp',
      expr: 't = L*I0/(Vz + VF)', tex: 't \\approx \\frac{L\\, I_0}{V_Z + V_F}',
      vars: {
        t: { name: 'time for the current to reach zero', q: 'time', unit: 'ms' },
        L: { name: 'coil inductance', q: 'inductance', unit: 'H', value: 0.25 },
        I0: { name: 'current at switch-off', q: 'current', unit: 'mA', value: 30, tex: 'I_0' },
        Vz: { name: 'Zener voltage', q: 'voltage', unit: 'V', value: 24, tex: 'V_Z' },
        VF: { name: 'diode drop', q: 'voltage', unit: 'V', value: 0.7, tex: 'V_F' }
      },
      note: 'A constant voltage across the coil makes the current fall in a straight line. The coil resistance helps, so this slightly overestimates.',
      stories: { t: 'A coil ({L}, {I0}) is clamped by a diode and a {Vz} Zener. Roughly how quickly does its current fall to zero?' }
    }
  ],
  examples: [
    {
      title: 'An unprotected relay driver',
      q: 'A 12 V relay coil (400 Ω, 0.25 H) is switched by a BC337 ($V_{CEO}$ = 45 V). About 100 pF of stray capacitance sits across the transistor. What happens at switch-off without a diode?',
      steps: [
        'Coil current: $12/400 = 30\\ \\mathrm{mA}$; stored energy $\\tfrac12 \\times 0.25 \\times 0.03^2 = 113\\ \\mu\\mathrm{J}$.',
        'If only the stray capacitance absorbed it, the voltage would ring up to about $I\\sqrt{L/C} = 0.03\\sqrt{0.25/10^{-10}} = 1500\\ \\mathrm{V}$.',
        'Long before that the transistor breaks down in avalanche (at roughly 60 V here), and the 113 µJ is dissipated in its junction at every switch-off — well beyond its 45 V rating.',
        'The simulator shows the collector hitting its breakdown voltage and the current collapsing within about 0.1 ms.'
      ],
      a: 'A spike limited only by avalanche breakdown, far above the 45 V rating, with 113 µJ dumped into the transistor each time.'
    },
    {
      title: 'Plain diode or diode + Zener?',
      q: 'For the same coil, compare the time for the current to fall to 10 % with a plain flyback diode and with a diode plus 24 V Zener, and the peak voltage on the transistor in each case.',
      steps: [
        'Plain diode: $\\tau = L/R = 0.25/400 = 0.625\\ \\mathrm{ms}$; to 10 %: $0.625 \\ln 10 = 1.44\\ \\mathrm{ms}$. Peak: $12 + 0.7 = 12.7\\ \\mathrm{V}$.',
        'Diode + Zener: the coil sees about 24.7 V (plus its own IR drop), so the current falls in a nearly straight line: to 10 % in about $0.25 \\times 0.027/24.7 = 0.27\\ \\mathrm{ms}$. Peak: $12 + 24 + 0.7 = 36.7\\ \\mathrm{V}$ — inside the 45 V rating.',
        'The simulator gives 1.2 ms and 0.22 ms (the diode drop and coil resistance speed both a little).'
      ],
      a: 'About 1.4 ms at 12.7 V (diode) against about 0.25 ms at 36.7 V (diode + Zener).'
    }
  ],
  quiz: [
    { q: 'A flyback diode across a relay coil driven by a low-side NPN transistor is connected with its cathode to…', choices: ['the transistor\'s collector', 'the positive supply', 'ground', 'the transistor\'s base'], a: 1,
      why: 'Normally reverse-biased: cathode at the supply, anode at the collector. At switch-off the collector rises above the supply and the diode conducts.' },
    { q: 'With a plain flyback diode on a 24 V coil, the switching transistor sees at most about…', choices: ['0.7 V', '24.7 V', '48 V', 'several hundred volts'], a: 1,
      why: 'The diode clamps the collector one drop above the supply.' },
    { q: 'How much energy does a 0.5 H solenoid store at 100 mA?', answer: 2.5, unit: 'mJ',
      why: 'E = ½LI² = 0.5 × 0.5 × 0.1² = 2.5 mJ — to be dumped somewhere at every switch-off.' },
    { q: 'Adding a Zener in series with the flyback diode…', choices: ['slows the relay\'s release', 'speeds the release but raises the voltage on the transistor', 'removes the need for the diode', 'reduces the coil current while on'], a: 1,
      why: 'The coil discharges against V_Z + V_F instead of 0.7 V, so its current falls much faster; the transistor must withstand V_CC + V_Z + V_F.' },
    { q: 'A flyback diode is the right protection for a relay with a 230 V AC coil.', a: false,
      why: 'On AC the diode would conduct on every other half-cycle and short the supply. AC coils use RC snubbers or varistors.' }
  ],
  applications: ['Every transistor-driven relay, solenoid valve and contactor coil.', 'Freewheeling paths in PWM motor drives and H-bridges.', 'Fuel injectors and ignition-coil drivers (with controlled clamps).', 'Protecting microcontroller boards from inductive interference.'],
  sim: 'dio-flyback'
}

);
