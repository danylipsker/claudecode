/* HYPER-ELECTRONICS · content/power-supplies.js — linear regulators and LDOs, and the
 * design of a complete linear power supply. */
Hyper.add(

{
  id: 'linear-regulators', parent: 'power-supplies', title: 'Linear regulators and LDOs', level: 2,
  short: 'A linear regulator holds its output steady by burning the difference between input and output as heat in a pass transistor. Simple, quiet and cheap — but its efficiency can never exceed V_out/V_in, and it needs a minimum headroom, the dropout.',
  keywords: ['linear regulator', 'LDO', 'low dropout', 'dropout voltage', '7805', 'LM317', 'AMS1117', 'pass transistor', 'error amplifier', 'bandgap reference', 'quiescent current', 'PSRR', 'thermal shutdown', 'junction temperature', 'heat sink'],
  prereq: ['zener-regulator', 'negative-feedback', 'emitter-follower', 'power-energy'],
  related: ['power-supply-design', 'heat-sinks', 'buck-converter', 'smoothing-ripple', 'decoupling'],
  body: `
A linear regulator is a variable resistor that adjusts itself. A **pass transistor** sits between input and output. An **error amplifier** compares a fraction of the output, taken from a feedback divider, with a **reference** — usually a bandgap reference of about 1.2 V — and drives the pass transistor harder or softer until the two match. It is [[negative-feedback|negative feedback]] wrapped around a power transistor, and the output stays put whatever the input and the load do, within limits.

### The price: heat
The same current flows in and out (plus a small **quiescent current** $I_q$ that runs the regulator itself), so the voltage difference is burnt in the pass device:

$$P = (V_\\text{in} - V_\\text{out})\\,I_\\text{out} + V_\\text{in}\\,I_q$$

and the efficiency is at best $V_\\text{out}/V_\\text{in}$. Regulating 12 V down to 5 V at 1 A delivers 5 W to the load and 7 W to the regulator: 42 % efficient, and a heat problem. Whether that is acceptable is a thermal question. The junction temperature is

$$T_j = T_a + P\\,\\theta_{JA}$$

where $\\theta_{JA}$, junction to ambient, is about 50–65 K/W for a TO-220 package standing in free air, roughly 60–150 K/W for SOT-223 and DPAK parts depending on the copper under them, and 200 K/W or more for a SOT-23. Junctions are rated to 125–150 °C, and most regulators shut themselves down at about 150–165 °C. For more dissipation, bolt the regulator to a [[heat-sinks|heat sink]] — or use a [[buck-converter|switching converter]].

### Dropout
The pass device needs some voltage across it to work. The smallest input-to-output difference at which the regulator still regulates is its **dropout voltage**:
- **Standard** regulators (the 78xx family, the LM317) use an NPN Darlington pass stage whose base drive comes from the input; they need about 1.5–2.5 V of headroom. A 7805 wants about 7 V or more at its input.
- **Low-dropout (LDO)** regulators use a PNP transistor or a P-channel MOSFET, which the control circuit can drive fully on, so the dropout is set by its saturation voltage or on-resistance: a few tenths of a volt at the rated current, less at light load. They make 3.3 V from a single lithium cell (3.6–4.2 V) possible.

Beware the in-betweens: the popular AMS1117 is an NPN-based regulator with about 1.1 V of dropout at 800 mA — too much for 3.3 V from a lithium cell that is half empty.

When the input comes from a rectifier, it carries ripple, and the regulator needs its headroom at the **bottom** of every ripple valley, not just on average ([[power-supply-design]]). The simulation below shows what happens otherwise.

### Fixed and adjustable
Fixed regulators (7805, 7812; the 78L05 for 100 mA; LDOs in many voltages) need nothing but capacitors. Adjustable ones set the output with two resistors. An LM317 holds 1.25 V between its output and its adjust pin, so

$$V_\\text{out} = V_\\text{ref}\\left(1 + \\frac{R_2}{R_1}\\right) + I_\\text{adj}\\,R_2$$

with $R_1$ typically 240 Ω, which makes the divider draw the few milliamps the part needs in order to regulate; the adjust current, about 50 µA, is usually small enough to neglect. Modern adjustable LDOs work the same way through a feedback pin.

### What else the datasheet tells you
- **Output capacitor and stability**: the output capacitor is part of the feedback loop. Older LDOs needed a capacitor whose ESR fell inside a window (a tantalum, not a ceramic); most modern ones are stable with small ceramics. Follow the datasheet exactly.
- **PSRR** (power-supply rejection ratio): how well ripple on the input is kept off the output — typically 60–80 dB at 100 Hz, far less at hundreds of kilohertz. That is why a linear regulator after a switching converter removes less of the switching ripple than one might hope.
- **Quiescent current**: from several milliamps for a 7805 down to a microamp for LDOs designed for batteries. For a device that sleeps most of the time, it matters more than efficiency.
- **Protection**: current limiting, thermal shutdown, and — where the output could end up above the input, say when the input is shorted with a large output capacitor charged — a reverse diode from output to input.
`,
  ideas: [
    'A linear regulator is a pass transistor controlled by an error amplifier comparing the output with a reference.',
    'It dissipates (V_in − V_out)·I: its efficiency can never exceed V_out/V_in.',
    'The junction temperature, T_a + P·θ_JA, decides whether it needs a heat sink.',
    'Dropout: about 2 V for standard (NPN) regulators, a few tenths of a volt for LDOs (PNP or PMOS).',
    'The input must clear the dropout at the bottom of every ripple valley.'
  ],
  pitfalls: [
    'A regulator can deliver its rated current from any input voltage — Its thermal limit usually bites first: 1.5 A with 10 V across it is 15 W.',
    'Any "LDO" works from a lithium cell to 3.3 V — Some popular parts drop more than a volt; read the dropout at your current.',
    'The output capacitor is just for smoothing — It is part of the regulator\'s feedback loop; the wrong type or value can make it oscillate.'
  ],
  formulas: [
    {
      name: 'Power dissipated in the regulator',
      expr: 'P = (Vin - Vout)*I', tex: 'P = (V_{\\text{in}} - V_{\\text{out}})\\,I_{\\text{out}}',
      vars: {
        P: { name: 'dissipation', q: 'power', unit: 'W' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{out}}' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 1, tex: 'I_{\\text{out}}' }
      },
      note: 'Neglects the quiescent current, which adds V_in·I_q.',
      stories: { P: 'A regulator makes {Vout} from {Vin} at {I}. How much power does it turn into heat?', I: 'A regulator dropping {Vin} to {Vout} may dissipate {P}. What load current can it supply?' }
    },
    {
      name: 'Junction temperature',
      expr: 'Tj = Ta + P*theta', tex: 'T_j = T_a + P\\,\\theta_{JA}',
      vars: {
        Tj: { name: 'junction temperature', q: 'temperature', unit: '°C', tex: 'T_j' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_a' },
        P: { name: 'dissipation', q: 'power', unit: 'W', value: 1.5 },
        theta: { name: 'thermal resistance, junction to ambient', q: 'thermalres', unit: 'K/W', value: 50, tex: '\\theta_{JA}' }
      },
      note: 'With a heat sink, θ_JA is the sum θ_JC + θ_CS + θ_SA ([[heat-sinks]]).',
      practice: { unknowns: ['Tj', 'P', 'theta'] },
      stories: {
        Tj: 'A TO-220 regulator ({theta} to air) dissipates {P} in a box at {Ta}. How hot is its junction?',
        P: 'A regulator with {theta} to air works at {Ta}; its junction must stay below {Tj}. How much may it dissipate?'
      }
    },
    {
      name: 'Adjustable regulator (LM317 type)',
      expr: 'Vout = Vref*(1 + R2/R1)', tex: 'V_{\\text{out}} = V_{\\text{ref}}\\left(1 + \\frac{R_2}{R_1}\\right)',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vref: { name: 'reference voltage (1.25 V for the LM317)', q: 'voltage', unit: 'V', value: 1.25, tex: 'V_{\\text{ref}}' },
        R1: { name: 'resistor from output to adjust pin', q: 'resistance', unit: 'Ω', value: 240 },
        R2: { name: 'resistor from adjust pin to ground', q: 'resistance', unit: 'kΩ', value: 1.5 }
      },
      note: 'Neglects the adjust-pin current (about 50 µA), which adds about 50 µA × R₂.',
      practice: { unknowns: ['Vout', 'R2'] },
      stories: {
        Vout: 'An LM317 has {R1} from output to adjust and {R2} from adjust to ground. What is its output?',
        R2: 'With {R1} from output to adjust, what resistor to ground gives {Vout}?'
      }
    },
    {
      name: 'Efficiency including the quiescent current',
      expr: 'eta = Vout*I/(Vin*(I + Iq))', tex: '\\eta = \\frac{V_{\\text{out}}\\,I}{V_{\\text{in}}\\,(I + I_q)}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 4.2, tex: 'V_{\\text{in}}' },
        I: { name: 'load current', q: 'current', unit: 'mA', value: 10 },
        Iq: { name: 'quiescent current of the regulator', q: 'current', unit: 'µA', value: 5, tex: 'I_q' }
      },
      note: 'At light loads the quiescent current dominates: a sleeping device drawing 10 µA from a regulator with 5 µA of I_q wastes a third of the battery.',
      practice: { unknowns: ['eta'] }
    }
  ],
  examples: [
    {
      title: 'A 7805 on 12 V',
      q: 'A 7805 in a TO-220 package supplies 0.5 A from a 12 V rail inside a box at 40 °C. θ_JA without a heat sink is 50 K/W; θ_JC is 5 K/W and a greased mounting adds 0.5 K/W. Does it need a heat sink, and how good must it be to keep the junction below 125 °C?',
      steps: [
        'Dissipation: $(12 - 5) \\times 0.5 = 3.5$ W.',
        'Without a heat sink: $T_j = 40 + 3.5 \\times 50 = 215$ °C. It would shut down.',
        'Allowed total: $(125 - 40)/3.5 = 24.3$ K/W. Subtract 5 + 0.5: the heat sink must be better than about 18.8 K/W — a small clip-on or extruded fin.',
        'Or replace it with a small buck module: at 90 % efficiency it wastes about 0.3 W instead of 3.5 W.'
      ],
      a: 'Yes: 3.5 W needs a heat sink of about 18 K/W or better (or a switching regulator).'
    },
    {
      title: 'An LM317 set to 9 V',
      q: 'Choose the resistors for 9 V from an LM317 and find the minimum input at 1 A, given a dropout of about 2 V.',
      steps: [
        'Take $R_1 = 240\\ \\Omega$. Then $R_2 = 240 \\times (9/1.25 - 1) = 1488\\ \\Omega$ → 1.5 kΩ (E12).',
        'Output: $1.25 \\times (1 + 1500/240) = 9.06$ V, plus $50\\ \\mu\\mathrm{A} \\times 1.5\\ \\mathrm{k\\Omega} \\approx 0.08$ V from the adjust current: about 9.1 V.',
        'Minimum input, at the bottom of any ripple: $9.1 + 2 \\approx 11.1$ V; allow half a volt more.'
      ],
      a: 'R₁ = 240 Ω, R₂ = 1.5 kΩ (≈ 9.1 V); keep the input above about 11.5 V.'
    }
  ],
  quiz: [
    { q: 'What is the best possible efficiency of a linear regulator making 5 V from 12 V?', choices: ['100 %', '71 %', '42 %', '29 %'], a: 2,
      why: 'Efficiency ≤ V_out/V_in = 5/12 = 42 %; the rest is heat in the pass transistor.' },
    { q: 'A 7805 (dropout about 2 V) is fed from a rectifier whose output averages 7.5 V with 2 V of peak-to-peak ripple. At full load the output…', choices: ['is a clean 5 V', 'dips below 5 V in each ripple valley', 'rises above 5 V', 'oscillates at high frequency'], a: 1,
      why: 'The valleys fall to about 6.5 V, below the 7 V the regulator needs; the output follows the input down in each valley.' },
    { q: 'A linear regulator can make 5 V from a 3.7 V lithium cell.', a: false,
      why: 'A linear regulator can only drop voltage. Stepping up needs a switching (boost) converter.' },
    { q: 'An LDO has a lower dropout than a 7805 mainly because…', choices: ['it uses a better reference', 'its pass device (PNP or P-MOSFET) can be driven fully on, instead of an NPN emitter follower that needs base drive above the output', 'it has a larger heat sink', 'it switches at high frequency'], a: 1,
      why: 'An NPN follower\'s base must sit about 1.5 V above the output, supplied from the input. A PNP or PMOS pass device is pulled on towards ground, so it can conduct with only its saturation voltage across it.' },
    { q: 'A TO-220 regulator dissipates 2 W in free air (θ_JA = 50 K/W) at 30 °C. What is its junction temperature?', answer: 130, unit: '°C',
      why: '30 + 2 × 50 = 130 °C — within rating for most parts, but hot enough to justify a heat sink.' }
  ],
  applications: ['Clean, quiet rails for analogue circuits, sensors and ADC references.', 'Post-regulation after a switching converter.', 'Microcontroller boards making 3.3 V from USB 5 V.', 'Battery equipment, with microamp-quiescent LDOs.'],
  sim: 'cp-linear-reg'
},

{
  id: 'power-supply-design', parent: 'power-supplies', title: 'Designing a linear power supply', level: 2,
  short: 'A mains linear supply chains a transformer, a bridge rectifier, a reservoir capacitor and a regulator. Designing one means working backwards from the output, so that the regulator keeps its headroom at the bottom of the ripple at low mains — without cooking at high mains.',
  keywords: ['power supply design', 'linear power supply', 'bridge rectifier', 'reservoir capacitor', 'ripple', 'transformer selection', 'low mains', 'high mains', 'headroom', 'bleeder resistor', 'fuse', 'mains safety'],
  prereq: ['linear-regulators', 'full-wave-rectifier', 'smoothing-ripple', 'transformers-practical'],
  related: ['heat-sinks', 'fuses-protection', 'capacitors', 'buck-converter'],
  body: `
A classic linear power supply turns mains into a steady low-voltage rail in five stages:

1. A **fuse and switch** on the mains side ([[fuses-protection]]).
2. A **transformer** steps the voltage down and isolates the output ([[transformers-practical]]).
3. A **bridge rectifier** turns AC into pulsating DC ([[full-wave-rectifier]]).
4. A **reservoir capacitor** charges to the peaks and carries the load in between, leaving a ripple ([[smoothing-ripple]]).
5. A **regulator** removes the ripple and holds the output steady ([[linear-regulators]]).

Each stage hands its imperfections to the next, so the design works **backwards from the output**, and must hold at the worst combinations: low mains and full load for headroom, high mains and full load for heat, high mains and no load for voltage ratings. Mains is typically allowed to vary by ±10 %.

### Step 1 — what the regulator needs
At the bottom of every ripple valley, the regulator's input must stay above $V_\\text{out} + V_\\text{dropout}$, plus about half a volt of margin. For a 7805 at 1 A that means about 7.5 V at the lowest point.

### Step 2 — the ripple
Between peaks, the reservoir capacitor alone supplies the load. With a full-wave rectifier the peaks come at twice the mains frequency — 100 Hz on 50 Hz mains — and the capacitor discharges for nearly the whole interval, so the peak-to-peak ripple is about

$$\\Delta V \\approx \\frac{I}{2 f C}$$

1 A from 4700 µF on 50 Hz gives 2.1 V; doubling the capacitor halves it. Bigger capacitors have a cost besides price: the capacitor recharges in short, tall current pulses near each peak, which heat the transformer and the diodes, and it draws a large surge at switch-on.

### Step 3 — the peak, and the valley
The capacitor charges to the peak of the secondary voltage minus the two bridge diodes conducting in series — together 1–1.5 V at the high peak currents: $V_\\text{pk} = \\sqrt{2}\\,V_s - 2V_f$. The secondary voltage $V_s$ is the transformer's rating **at full load**, and it falls with the mains. Putting it together, the lowest point of the ripple at low mains is

$$V_\\text{min} = \\sqrt{2}\\,V_s\\,(1 - m) - 2V_f - \\frac{I}{2fC}$$

with $m$ = 0.1 for mains 10 % low. This must exceed what step 1 asked for.

### Step 4 — check the other corners
- **Heat**: at high mains and full load, the regulator dissipates $(V_\\text{in,avg} - V_\\text{out})\\,I$, with the average input about half the ripple below the peak. This sizes the [[heat-sinks|heat sink]] — and often shows why a switcher would be better.
- **Voltage ratings**: at high mains and no load there is no drop in the windings (small transformers read 10–25 % high unloaded) and no ripple, so the capacitor charges to the highest peak of all. The capacitor and the regulator's maximum input must survive it.
- **Transformer rating**: the recharging pulses make the secondary RMS current about 1.6–1.8 times the DC output current; choose the VA rating from that, not from the DC watts.
- **Diodes**: the bridge must survive the switch-on surge into an empty capacitor (tens of amperes for a half-cycle is common) and the repetitive peak current.

### Step 5 — the details
A **bleeder resistor** across the reservoir discharges it after switch-off. Small capacitors at the regulator's pins (100 nF ceramic at the input, whatever the datasheet asks at the output) keep it stable. A time-delay **fuse** on the primary rides through the transformer's inrush while protecting the wiring; a second fuse on the secondary protects the rectifier and capacitor. The loads need their own local decoupling.

> [!warn] The primary side of a mains supply is lethal. Use a certified safety-isolating transformer, a fused mains inlet with proper strain relief, earth all exposed metal, keep mains wiring separated and insulated, and never work on it live. For most projects a certified plug-in supply is both safer and cheaper.

### Why switchers took over
A linear supply's transformer is heavy and its regulator runs hot: the 5 V, 1 A design below dissipates more in its regulator than it delivers to the load. A switching supply does the same job in a fraction of the size at 80–90 % efficiency. Linear supplies survive where their virtues matter: very low noise (audio, precision measurement, laboratory supplies) and simplicity at small powers.
`,
  ideas: [
    'Work backwards: regulator headroom, then ripple, then the transformer voltage.',
    'The design corner for headroom is low mains at full load, at the bottom of the ripple.',
    'Ripple ≈ I/(2fC) for a full-wave rectifier; double the capacitance to halve it.',
    'Check heat at high mains and full load, and voltage ratings at high mains and no load.',
    'The transformer\'s VA rating must allow for peaky charging currents, about 1.6–1.8 × the DC current.'
  ],
  pitfalls: [
    'Design with the average input voltage — The regulator drops out at the bottom of each ripple valley; design for the minimum.',
    'A transformer\'s rated voltage is what the capacitor charges to — The capacitor charges near √2 times the RMS voltage minus the diode drops, and higher still with no load and high mains.',
    'A bigger reservoir capacitor is free — It raises the peak charging currents, transformer heating and switch-on surge.'
  ],
  formulas: [
    {
      name: 'Ripple of a full-wave rectifier with a reservoir capacitor',
      expr: 'dV = I/(2*f*C)', tex: '\\Delta V = \\frac{I}{2 f C}',
      vars: {
        dV: { name: 'peak-to-peak ripple', q: 'voltage', unit: 'V', tex: '\\Delta V' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 1 },
        f: { name: 'mains frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'reservoir capacitance', q: 'capacitance', unit: 'µF', value: 4700 }
      },
      note: 'Assumes the capacitor supplies the load for the whole half-period; slightly pessimistic, which is the safe side. For a half-wave rectifier, drop the 2.',
      stories: { dV: 'A bridge rectifier on {f} mains feeds a {C} capacitor and a {I} load. How big is the ripple?', C: 'What reservoir capacitor keeps the ripple to {dV} at {I} on {f} mains?' }
    },
    {
      name: 'Peak voltage on the reservoir capacitor',
      expr: 'Vpk = sqrt(2)*Vs - 2*Vf', tex: 'V_{\\text{pk}} = \\sqrt{2}\\,V_s - 2V_f',
      vars: {
        Vpk: { name: 'peak capacitor voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{pk}}' },
        Vs: { name: 'secondary RMS voltage (at this load)', q: 'voltage', unit: 'V', value: 9, tex: 'V_s' },
        Vf: { name: 'forward drop of one bridge diode at peak current', q: 'voltage', unit: 'V', value: 1.0, tex: 'V_f' }
      },
      stories: { Vpk: 'A {Vs} transformer feeds a bridge rectifier whose diodes drop {Vf} each. What does the reservoir capacitor charge to?' }
    },
    {
      name: 'Lowest input to the regulator (low mains, full load)',
      expr: 'Vmin = sqrt(2)*Vs*(1 - m) - 2*Vf - I/(2*f*C)', tex: 'V_{\\min} = \\sqrt{2}\\,V_s\\,(1 - m) - 2V_f - \\frac{I}{2 f C}',
      vars: {
        Vmin: { name: 'bottom of the ripple', q: 'voltage', unit: 'V', tex: 'V_{\\min}' },
        Vs: { name: 'transformer secondary (RMS, full load)', q: 'voltage', unit: 'V', value: 9, tex: 'V_s' },
        m: { name: 'mains tolerance (low)', q: 'ratio', unit: '%', value: 10 },
        Vf: { name: 'diode drop', q: 'voltage', unit: 'V', value: 1.0, tex: 'V_f' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 1 },
        f: { name: 'mains frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'reservoir capacitance', q: 'capacitance', unit: 'µF', value: 10000 }
      },
      solveFor: 'Vmin',
      note: 'Must exceed the regulator\'s output plus dropout plus a margin. Solve for $V_s$ to choose the transformer, or for $C$ to choose the capacitor.',
      practice: { unknowns: ['Vmin', 'Vs', 'C'] },
      stories: {
        Vs: 'The regulator needs at least {Vmin} at full load ({I}) with mains {m} low. With a {C} reservoir on {f} mains and diodes dropping {Vf}, what transformer secondary voltage is needed?',
        C: 'A {Vs} transformer on {f} mains, diodes dropping {Vf}, supplies {I}. With mains {m} low, what reservoir keeps the valleys above {Vmin}?'
      }
    },
    {
      name: 'Regulator dissipation at high mains',
      expr: 'P = (sqrt(2)*Vs*(1 + m) - 2*Vf - I/(4*f*C) - Vout)*I', tex: 'P = \\left(\\sqrt{2}\\,V_s(1+m) - 2V_f - \\frac{I}{4fC} - V_{\\text{out}}\\right) I',
      vars: {
        P: { name: 'regulator dissipation', q: 'power', unit: 'W' },
        Vs: { name: 'transformer secondary (RMS, full load)', q: 'voltage', unit: 'V', value: 9, tex: 'V_s' },
        m: { name: 'mains tolerance (high)', q: 'ratio', unit: '%', value: 10 },
        Vf: { name: 'diode drop', q: 'voltage', unit: 'V', value: 1.0, tex: 'V_f' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 1 },
        f: { name: 'mains frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'reservoir capacitance', q: 'capacitance', unit: 'µF', value: 10000 },
        Vout: { name: 'regulated output', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{out}}' }
      },
      solveFor: 'P',
      note: 'Uses the average input, about half the ripple below the peak.',
      practice: { unknowns: ['P'] }
    }
  ],
  examples: [
    {
      title: 'A 5 V, 1 A supply from 230 V mains',
      q: 'Design a 5 V, 1 A supply with a 7805 (dropout 2 V) on 230 V, 50 Hz mains (±10 %). Choose the transformer secondary and the reservoir capacitor, then check heat and voltage ratings.',
      steps: [
        'The regulator needs $5 + 2 + 0.5 = 7.5$ V at the bottom of the ripple.',
        'Try a 9 V secondary with 4700 µF: $V_\\text{min} = 12.73 \\times 0.9 - 2.0 - 2.13 = 7.33$ V. Short of 7.5 V.',
        'With 10 000 µF: $11.46 - 2.0 - 1.06 = 8.40$ V — 0.9 V to spare. Keep 9 V and 10 000 µF.',
        'Heat at high mains: peak $12.73 \\times 1.1 - 2.0 = 12.0$ V, average about 11.5 V, so $P = (11.5 - 5) \\times 1 = 6.5$ W. For a 125 °C junction at 40 °C: $85/6.5 - 5.5 = 7.6$ K/W of heat sink.',
        'No load, high mains: the transformer reads about 20 % high, so the capacitor sees up to $9 \\times 1.2 \\times 1.1 \\times 1.414 = 16.8$ V → a 25 V capacitor; well within the 7805\'s 35 V limit.',
        'Transformer: secondary RMS current about $1.8 \\times 1 = 1.8$ A, so $9 \\times 1.8 = 16$ VA → a 20 VA part. A time-delay primary fuse as the transformer maker recommends, and a 2.5 A time-delay fuse in the secondary (above the 1.8 A RMS, with margin).'
      ],
      a: '9 V, 20 VA transformer; 10 000 µF, 25 V; a 7.6 K/W heat sink — for 5 W out, some 7 W of heat.'
    }
  ],
  quiz: [
    { q: 'Which condition sets the minimum transformer voltage of a linear supply?', choices: ['high mains, no load', 'low mains, full load, at the bottom of the ripple', 'nominal mains, average voltage', 'high mains, full load'], a: 1,
      why: 'Headroom is tightest when the mains is low, the load is highest (most ripple, most winding drop) and at the instant of the ripple valley.' },
    { q: 'You double the reservoir capacitance. The ripple…', choices: ['doubles', 'halves', 'stays the same', 'falls by √2'], a: 1,
      why: 'ΔV ≈ I/(2fC): ripple is inversely proportional to the capacitance.' },
    { q: 'On 60 Hz mains, what is the ripple frequency after a bridge rectifier?', choices: ['30 Hz', '60 Hz', '120 Hz', '240 Hz'], a: 2,
      why: 'A full-wave rectifier produces a peak in each half-cycle: twice the mains frequency.' },
    { q: 'The reservoir capacitor\'s voltage rating only needs to exceed the regulator\'s input at full load.', a: false,
      why: 'At no load there is no winding drop and no ripple, and at high mains everything is 10 % higher: the capacitor sees its highest voltage then.' },
    { q: 'What ripple does a 2 A load produce on a 6800 µF reservoir after a bridge rectifier on 50 Hz mains?', answer: 2.94, unit: 'V',
      why: 'ΔV = I/(2fC) = 2/(2 × 50 × 0.0068) = 2.94 V.' }
  ],
  applications: ['Low-noise supplies for audio amplifiers and precision instruments.', 'Laboratory bench supplies, often with a switching pre-regulator.', 'Simple low-power supplies in appliances and control panels.', 'The rectifier and reservoir front end found inside every mains switch-mode supply.'],
  sim: 'cp-linear-reg'
}

);
