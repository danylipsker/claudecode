/* HYPER-ELECTRONICS · content/transistor-circuits.js — the circuits built from
 * transistors: current sources and mirrors, the differential pair, push-pull output
 * stages, H-bridges, and keeping it all cool. */
Hyper.add(

{
  id: 'current-mirrors', parent: 'transistor-circuits', title: 'Current sources and mirrors', level: 2,
  short: 'Circuits that deliver a set current whatever the load voltage: a transistor with a fixed base voltage and an emitter resistor, or two matched transistors where one copies the current of the other.',
  keywords: ['current source', 'current sink', 'current mirror', 'Widlar current source', 'Wilson mirror', 'cascode', 'compliance', 'output resistance', 'Early effect', 'matched transistors', 'LM334', 'active load', 'LED driver'],
  prereq: ['bjt-operation', 'bjt-regions', 'sources'],
  related: ['differential-pair', 'bjt-biasing', 'leds'],
  body: `
An ideal current source pushes the same current through anything connected to it. A transistor in its active region is nearly one already: its collector current hardly depends on the collector voltage. Fix its emitter current and you have a current source.

### The one-transistor source
Hold the base at a fixed voltage — a Zener, two diodes, an LED or a divider — and put $R_E$ in the emitter. The emitter sits one $V_{BE}$ below the base, so

$$I_\\text{out} \\approx \\frac{V_B - V_{BE}}{R_E}$$

The load goes in the collector and receives that current as long as the collector stays a few tenths of a volt above the emitter; that range of load voltage is the source's **compliance**. A red LED (about 1.8 V) makes a good base reference, because its forward voltage falls with temperature at roughly the same 2 mV/°C as $V_{BE}$ and the two drifts partly cancel. The same idea sits inside LED driver chips and the adjustable LM334 source.

### The current mirror
In an integrated circuit, resistors are expensive and matched transistors are free. Connect transistor Q1 as a diode — collector joined to base — and feed it a reference current. It develops exactly the $V_{BE}$ that makes its collector carry that current. Apply the same $V_{BE}$ to an identical Q2, and Q2 carries the same current: it **mirrors** Q1.

$$I_\\text{ref} = \\frac{V_{CC} - V_{BE}}{R}, \\qquad I_\\text{out} = \\frac{I_\\text{ref}}{1 + 2/\\beta}$$

The small error is the two base currents, which are taken out of $I_\\text{ref}$ — 2 % for β = 100. Mirrors appear by the dozen in every op-amp and comparator: they set bias currents, make the tail current of a [[differential-pair]], and serve as **active loads** that give a single stage a gain of thousands.

### What limits a mirror
- **The Early effect.** Q2's current creeps up with its collector voltage, so its output resistance is only $r_o = V_A/I_C$ — about 100 kΩ at 1 mA. The **Wilson** and **cascode** mirrors raise it by a factor of roughly β by holding Q2's collector voltage still.
- **Mismatch and temperature.** Discrete transistors differ in $I_S$: a 10 % difference is a 10 % current error, and if Q2 runs hotter it takes more current still. **Emitter resistors** dropping 0.1–0.3 V swamp both: the currents then follow the resistor ratio, which also makes scaled mirrors easy ($I_2/I_1 = R_1/R_2$).
- **Small currents.** To make 10 µA from a 1 mA reference, the **Widlar source** adds a resistor $R_2$ in Q2's emitter only, so Q2 runs at a lower $V_{BE}$. Since $V_{BE}$ changes by $V_T\\ln$ of the current ratio,
$$I_2 R_2 = V_T \\ln\\frac{I_1}{I_2}$$
— about 12 kΩ, where a simple mirror would need a 1 MΩ reference resistor.

> [!tip] On a breadboard, use a matched dual transistor (BCM847, DMMT3904) or at least two transistors from the same reel, glued together for thermal contact, with 100–470 Ω in each emitter.
`,
  ideas: [
    'A transistor with a fixed base voltage and an emitter resistor is a current source: I ≈ (V_B − V_BE)/R_E.',
    'A mirror copies a reference current: same V_BE, same collector current.',
    'The simple mirror\'s error is its base currents: I_out = I_ref/(1 + 2/β).',
    'Output resistance is limited by the Early effect to about V_A/I_C; Wilson and cascode mirrors do far better.',
    'Emitter resistors swamp mismatch; a Widlar source makes small currents without huge resistors.'
  ],
  pitfalls: [
    'Two random discrete transistors make an accurate mirror — Mismatch in I_S and in temperature gives errors of 10 % or more unless emitter resistors are added.',
    'A current source works into any load — Only while its compliance lasts: the transistor must stay out of saturation, so the load voltage has an upper limit.',
    'A mirror\'s output current is exactly constant — It rises with output voltage through the Early effect: about 10 % over 10 V for a simple mirror.'
  ],
  formulas: [
    {
      name: 'Reference current of a mirror',
      expr: 'Iref = (Vcc - Vbe)/R', tex: 'I_{\\text{ref}} = \\frac{V_{CC} - V_{BE}}{R}',
      vars: {
        Iref: { name: 'reference current', q: 'current', unit: 'mA', tex: 'I_{\\text{ref}}' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{CC}' },
        Vbe: { name: 'base–emitter voltage', q: 'voltage', unit: 'V', value: 0.65, tex: 'V_{BE}' },
        R: { name: 'reference resistor', q: 'resistance', unit: 'kΩ', value: 11 }
      },
      stories: { R: 'A current mirror on a {Vcc} supply must be set to {Iref}. What reference resistor do you need?' }
    },
    {
      name: 'Output of a simple mirror',
      expr: 'Iout = Iref/(1 + 2/beta)', tex: 'I_{\\text{out}} = \\frac{I_{\\text{ref}}}{1 + 2/\\beta}',
      vars: {
        Iout: { name: 'output current', q: 'current', unit: 'mA', tex: 'I_{\\text{out}}' },
        Iref: { name: 'reference current', q: 'current', unit: 'mA', value: 1.03, tex: 'I_{\\text{ref}}' },
        beta: { name: 'current gain', value: 100, tex: '\\beta' }
      }
    },
    {
      name: 'One-transistor current source',
      expr: 'Iout = (Vb - Vbe)/Re', tex: 'I_{\\text{out}} = \\frac{V_B - V_{BE}}{R_E}',
      vars: {
        Iout: { name: 'output current', q: 'current', unit: 'mA', tex: 'I_{\\text{out}}' },
        Vb: { name: 'base reference voltage', q: 'voltage', unit: 'V', value: 1.8, tex: 'V_B' },
        Vbe: { name: 'base–emitter voltage', q: 'voltage', unit: 'V', value: 0.65, tex: 'V_{BE}' },
        Re: { name: 'emitter resistor', q: 'resistance', unit: 'Ω', value: 56, tex: 'R_E' }
      },
      stories: { Re: 'A transistor current source uses a red LED ({Vb}) as its base reference. What emitter resistor gives {Iout}?' }
    },
    {
      name: 'Widlar current source',
      expr: 'I2*R2 = VT*ln(I1/I2)', tex: 'I_2 R_2 = V_T \\ln\\frac{I_1}{I_2}',
      vars: {
        I2: { name: 'output current', q: 'current', unit: 'µA', value: 10, tex: 'I_2' },
        R2: { name: 'emitter resistor of the output transistor', q: 'resistance', unit: 'kΩ', tex: 'R_2' },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' },
        I1: { name: 'reference current', q: 'current', unit: 'mA', value: 1, tex: 'I_1' }
      },
      solveFor: 'R2',
      note: 'I₂ appears twice; the calculator solves for it numerically.'
    }
  ],
  examples: [
    {
      title: 'A 1 mA mirror from 12 V',
      q: 'Build a 1 mA current sink with two matched NPNs (β = 100, $V_A$ = 100 V) on a 12 V supply. How much does the output current change if the output voltage moves by 10 V?',
      steps: [
        '$R = (12 - 0.65)\\ \\mathrm{V}/1\\ \\mathrm{mA} = 11.35\\ \\mathrm{k\\Omega}$ → 11 kΩ, giving $I_\\text{ref} = 11.35/11 = 1.032$ mA.',
        '$I_\\text{out} = 1.032/(1 + 2/100) = 1.012$ mA.',
        'Output resistance $r_o = V_A/I_C = 100\\ \\mathrm{V}/1\\ \\mathrm{mA} = 100\\ \\mathrm{k\\Omega}$: a 10 V change moves the current by $10/100\\ \\mathrm{k} = 0.1$ mA — 10 %.',
        'For better constancy, use a Wilson or cascode mirror, or emitter degeneration, which raises the output resistance too.'
      ],
      a: 'R = 11 kΩ gives 1.01 mA out; the current changes by about 10 % over 10 V.'
    },
    {
      title: 'A constant-current LED string',
      q: 'Drive five white LEDs (about 3 V each) at 20 mA from 24 V with one NPN, a red LED as the base reference (1.8 V) fed through a resistor from 24 V. Size the resistors and check the transistor.',
      steps: [
        'Emitter resistor: $R_E = (1.8 - 0.65)/20\\ \\mathrm{mA} = 57.5\\ \\Omega$ → 56 Ω, giving 20.5 mA.',
        'Reference feed: about 2 mA through the red LED: $(24 - 1.8)/2\\ \\mathrm{mA} = 11\\ \\mathrm{k\\Omega}$ → 10 kΩ (2.2 mA, far more than the 0.1–0.2 mA base current).',
        'Transistor voltage: $24 - 5 \\times 3 - 1.15 = 7.85$ V; dissipation $7.85 \\times 20.5\\ \\mathrm{mA} = 0.16$ W — fine for a BC337 or 2N2222A.',
        'Compliance: the string may use up to about $24 - 1.15 - 0.3 = 22.5$ V, so seven LEDs (21 V) would still be regulated; eight would not.'
      ],
      a: 'R_E = 56 Ω, a 10 kΩ feed for the reference LED; 0.16 W in the transistor; up to seven LEDs.'
    }
  ],
  quiz: [
    { q: 'In a simple two-transistor mirror with β = 50, the output current compared with the reference is…', choices: ['exactly equal', 'about 4 % smaller', 'about 2 % larger', 'half'], a: 1,
      why: 'I_out = I_ref/(1 + 2/β) = I_ref/1.04: both base currents come out of the reference.' },
    { q: 'What sets the compliance of an NPN current sink?', choices: ['β', 'The output must stay above the emitter voltage plus about 0.2–0.3 V', 'The reference current', 'The supply alone'], a: 1,
      why: 'Below that the transistor saturates and stops acting as a current source.' },
    { q: 'Two random discrete BC547s make a mirror accurate to 1 % without emitter resistors.', a: false,
      why: 'Their saturation currents can differ by tens of per cent, and so will the currents. Emitter resistors or a matched pair are needed.' },
    { q: 'Adding equal emitter resistors dropping 0.2 V to a discrete mirror…', choices: ['reduces accuracy', 'swamps V_BE mismatch so the currents match much better', 'doubles the output current', 'removes the compliance limit'], a: 1,
      why: 'A few millivolts of V_BE mismatch are now a small fraction of the 0.2 V across the resistors, so the resistor ratio sets the currents.' }
  ],
  applications: ['Bias currents and active loads inside op-amps, comparators and ADCs.', 'Constant-current LED drivers.', 'Charging a capacitor at a constant rate for linear ramps and timers.', 'Tail currents for differential pairs.'],
  history: 'Bob Widlar designed the current source that bears his name, and much of the style of analogue IC design, at Fairchild in the mid-1960s, in chips such as the μA702 and μA709.'
},

{
  id: 'differential-pair', parent: 'transistor-circuits', title: 'The differential pair', level: 3,
  short: 'Two transistors sharing one tail current: a difference between their inputs steers the current from one to the other, while a signal common to both does almost nothing. The input stage of nearly every op-amp.',
  keywords: ['differential pair', 'long-tailed pair', 'differential amplifier', 'tail current', 'common-mode rejection', 'CMRR', 'tanh', 'emitter-coupled', 'input offset voltage', 'ECL', 'Gilbert cell', 'active load'],
  prereq: ['common-emitter', 'current-mirrors', 'math:hyperbolic-functions'],
  related: ['ideal-opamp', 'difference-amplifier', 'comparators', 'offset-bias', 'noise-snr'],
  body: `
Join the emitters of two matched transistors and feed them from a single current source $I_{EE}$ — the **tail**. Each collector has a load resistor $R_C$ to the supply. Whatever the inputs do, the two collector currents must add up to $I_{EE}$. So the pair cannot respond to the *sum* of its inputs, only to their *difference*: raise one base by a few millivolts relative to the other, and part of the tail current moves across.

### Large signals: current steering
Because each transistor follows the exponential law, the split is exact and elegant:

$$I_{C1} - I_{C2} = I_{EE}\\tanh\\!\\left(\\frac{V_d}{2V_T}\\right), \\qquad V_d = V_{B1} - V_{B2}$$

A difference of 25 mV sends about 73 % of the tail current one way; 100 mV sends 98 %. So the pair is a fast, clean **current switch** — the basis of emitter-coupled logic and of comparators — and, for differences of a few millivolts where the [[math:hyperbolic-functions|tanh]] is nearly straight, a linear amplifier.

### Small signals: gain and rejection
Each transistor runs at $I_{EE}/2$, with transconductance $g_m = I_{EE}/(2V_T)$. A small difference $v_d$ splits equally, $+v_d/2$ on one base and $-v_d/2$ on the other, and the voltage between the two collectors is

$$A_d = g_m R_C = \\frac{I_{EE}R_C}{2V_T}$$

— or half of that taken from one collector alone. A **common-mode** signal, with both inputs moving together, would have to push extra current through the tail. A perfect current source refuses, so nothing changes. A real tail with resistance $R_{EE}$ allows a little: the single-ended common-mode gain is about $-R_C/(2R_{EE})$, and the **common-mode rejection ratio** is

$$\\text{CMRR} = \\frac{A_d}{A_{cm}} \\approx g_m R_{EE}$$

With a 10 kΩ tail resistor at 1 mA that is about 190 (46 dB); a transistor current source with a megohm of output resistance raises it to about 19 000 (86 dB). This is why differential signalling — RS-485, USB, Ethernet, balanced audio, bridge sensors — survives noisy environments: interference arrives on both wires almost equally, and the receiver ignores it.

### In real circuits
- **Offset.** Any mismatch between the two transistors acts like a small voltage in series with one input — typically 1–5 mV in a discrete pair, well under 1 mV in trimmed ICs. This is the origin of an op-amp's [[offset-bias|input offset voltage]], and its drift with temperature.
- **Active loads.** Replacing the two $R_C$ by a [[current-mirrors|current mirror]] converts the differential output into a single-ended one without losing half the gain, and raises the gain to hundreds or thousands. That is the first stage of the classic 741 and its descendants.
- **Emitter resistors** (degeneration) widen the linear input range at the cost of gain.
- **Input range.** Both inputs must stay within the range where the tail source and the loads keep working: the common-mode input range quoted on every op-amp datasheet.
- **Multipliers.** Stacking pairs so that one signal steers the tail current of the others gives the Gilbert cell, the mixer at the heart of many radio receivers.
`,
  ideas: [
    'Two emitters share one tail current; the pair responds to the difference between its inputs.',
    'The tail current splits as tanh(V_d/2V_T): about 100 mV switches it almost entirely.',
    'Differential gain A_d = g_m R_C, with g_m = I_EE/(2V_T).',
    'CMRR ≈ g_m R_EE: a current-source tail gives 80–100 dB.',
    'Mismatch in the pair is the source of an op-amp\'s offset voltage.'
  ],
  pitfalls: [
    'A differential pair amplifies each input independently — It amplifies only their difference; a common signal is rejected by the tail.',
    'It is linear for any input difference — Only for a few tens of millivolts; beyond ±100 mV it simply switches.',
    'A resistor tail is as good as a current source — A resistor gives poor common-mode rejection; a transistor current source improves it a hundredfold.'
  ],
  formulas: [
    {
      name: 'Large-signal current steering',
      expr: 'dI = IEE*tanh(Vd/(2*VT))', tex: '\\Delta I = I_{EE}\\tanh\\frac{V_d}{2V_T}',
      vars: {
        dI: { name: 'difference of the two collector currents', q: 'current', unit: 'mA', signed: true, tex: '\\Delta I' },
        IEE: { name: 'tail current', q: 'current', unit: 'mA', value: 1, tex: 'I_{EE}' },
        Vd: { name: 'difference between the inputs', q: 'voltage', unit: 'mV', value: 25, signed: true, min: -300, max: 300, tex: 'V_d' },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' }
      },
      practice: { unknowns: ['dI', 'Vd'] },
      stories: { Vd: 'A differential pair with a {IEE} tail must steer {dI} of difference between its collectors. What input difference does that take?' }
    },
    {
      name: 'Differential voltage gain',
      expr: 'Ad = IEE*Rc/(2*VT)', tex: 'A_d = \\frac{I_{EE}R_C}{2V_T}',
      vars: {
        Ad: { name: 'differential gain (output between the collectors)', tex: 'A_d' },
        IEE: { name: 'tail current', q: 'current', unit: 'mA', value: 1, tex: 'I_{EE}' },
        Rc: { name: 'collector resistor (each side)', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_C' },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' }
      },
      note: 'Taken from one collector only, the gain is half this.'
    },
    {
      name: 'Common-mode rejection in decibels',
      expr: 'CMRR = 20*log(IEE*Ree/(2*VT))', tex: '\\mathrm{CMRR} = 20\\log_{10}\\frac{I_{EE}R_{EE}}{2V_T}',
      vars: {
        CMRR: { name: 'common-mode rejection ratio', q: 'gain', unit: 'dB', tex: '\\mathrm{CMRR}' },
        IEE: { name: 'tail current', q: 'current', unit: 'mA', value: 1, tex: 'I_{EE}' },
        Ree: { name: 'resistance of the tail', q: 'resistance', unit: 'kΩ', value: 1000, tex: 'R_{EE}' },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' }
      },
      note: 'g_m R_EE for a resistively loaded pair with single-ended output. 1000 kΩ stands for a transistor current source; try a 10 kΩ resistor.'
    }
  ],
  examples: [
    {
      title: 'A long-tailed pair on ±12 V',
      q: 'Two NPNs have their bases near 0 V and their emitters joined to −12 V through $R_{EE}$; each collector has 10 kΩ to +12 V. Choose $R_{EE}$ for about 1 mA of tail current, and find the collector voltages, the gains and the CMRR.',
      steps: [
        'The emitters sit at about −0.65 V, so $R_{EE} = (12 - 0.65)/1\\ \\mathrm{mA} = 11.35\\ \\mathrm{k\\Omega}$ → 11 kΩ: $I_{EE} = 1.03$ mA, 0.516 mA per side.',
        'Collectors: $12 - 0.516 \\times 10 = 6.84$ V.',
        '$g_m = 0.516\\ \\mathrm{mA}/25.85\\ \\mathrm{mV} = 20\\ \\mathrm{mS}$. Differential gain $g_m R_C = 200$; from one collector, 100.',
        'CMRR $\\approx g_m R_{EE} = 0.020 \\times 11\\,000 = 220$, i.e. 47 dB.',
        'Replacing $R_{EE}$ by a transistor current source with $r_o$ ≈ 1 MΩ raises CMRR to about 20 000 (86 dB) without changing anything else.'
      ],
      a: 'R_EE = 11 kΩ; collectors at 6.8 V; A_d = 200 (100 single-ended); CMRR 47 dB, 86 dB with a current-source tail.'
    }
  ],
  quiz: [
    { q: 'Both inputs of a differential pair rise by 1 V together. Ideally, the collector currents…', choices: ['both rise', 'stay the same', 'swap', 'both fall to zero'], a: 1,
      why: 'The tail current is fixed and the inputs have not changed relative to each other, so the split is unchanged. Only the emitters move up by 1 V.' },
    { q: 'What difference in input voltage switches about 98 % of the tail current to one side?', choices: ['1 mV', '100 mV', '0.7 V', '5 V'], a: 1,
      why: 'tanh(100 mV / 51.7 mV) = 0.96, so the currents split 98 % : 2 %.' },
    { q: 'To improve CMRR the most you would…', choices: ['increase R_C', 'replace the tail resistor with a current source', 'lower the supply voltage', 'add capacitors on the inputs'], a: 1,
      why: 'CMRR ≈ g_m R_EE: a current source has a far larger effective R_EE than any practical resistor.' },
    { q: 'A pair has $I_{EE}$ = 2 mA and $R_C$ = 4.7 kΩ. What is its differential voltage gain (output between the collectors)?', answer: 182,
      why: 'Each transistor runs at 1 mA, so g_m = 1 mA/25.85 mV = 38.7 mS and A_d = g_m R_C = 38.7 mS × 4.7 kΩ ≈ 182.' },
    { q: 'An op-amp\'s input offset voltage comes largely from mismatch in its input differential pair.', a: true,
      why: 'Any difference in the two transistors\' V_BE at equal current looks exactly like a small voltage applied between the inputs.' }
  ],
  applications: ['The input stage of op-amps, comparators and instrumentation amplifiers.', 'Line receivers for RS-485, LVDS and balanced audio.', 'Emitter-coupled logic and high-speed comparators.', 'Gilbert-cell mixers and analogue multipliers.']
},

{
  id: 'push-pull', parent: 'transistor-circuits', title: 'Push-pull output stages', level: 2,
  short: 'An NPN follower pushes current into the load and a PNP follower pulls it back: efficient output stages for amplifiers and drivers, with crossover distortion to tame by biasing into class AB.',
  keywords: ['push-pull', 'complementary pair', 'class A', 'class B', 'class AB', 'crossover distortion', 'quiescent current', 'Vbe multiplier', 'amplifier efficiency', 'totem pole', 'output stage', 'audio amplifier', 'thermal runaway', 'emitter resistors'],
  prereq: ['emitter-follower', 'power-energy', 'rms-values'],
  related: ['heat-sinks', 'negative-feedback', 'darlington', 'gate-drive'],
  body: `
A single [[emitter-follower|emitter follower]] can push current into a load but can only pull it back through its emitter resistor. To drive a loudspeaker, a motor or a long cable in both directions, use two followers: an NPN from the positive rail for the positive half-cycles and a PNP from the negative rail for the negative half. Their emitters join at the output, and their bases are driven together.

### Classes of operation
- **Class A**: an output device conducting all the time, with a quiescent current larger than the peak load current. Very linear, but it burns power even in silence: at most 25 % efficiency with a resistive collector load, 50 % with a transformer or a current-source load.
- **Class B**: the two bases tied together, each transistor conducting for exactly half the cycle. Nothing flows without a signal, and the efficiency at full output reaches $\\pi/4 = 78.5$ %. But neither transistor conducts while the input is within about ±0.6 V: the output sticks at zero there, and every zero crossing gets a kink — **crossover distortion**. It is small in volts but clearly audible, because it is present at every level and is relatively worst on quiet passages.
- **Class AB**: bias the two bases about $2V_{BE}$ apart — with two diodes, or with a **$V_{BE}$ multiplier** (a transistor with a divider between collector and base) — so both transistors carry a little current, typically 10–50 mA in an audio amplifier, around the crossover. The distortion nearly vanishes while the efficiency stays close to class B. Almost every linear audio amplifier and op-amp output stage is class AB.

### Power and efficiency (class B, sine wave)
With rails $\\pm V_{CC}$, a load $R_L$ and an output amplitude $V_p$:

$$P_\\text{out} = \\frac{V_p^2}{2R_L}, \\qquad \\eta = \\frac{\\pi}{4}\\,\\frac{V_p}{V_{CC}}$$

The transistors' dissipation peaks not at full output but at $V_p = 2V_{CC}/\\pi$, about 64 % of the rail, where the total reaches

$$P_{D,\\max} = \\frac{2V_{CC}^2}{\\pi^2 R_L} \\approx 0.4\\,P_\\text{out,max}$$

So each transistor must handle about a fifth of the maximum output power — the figure that sizes the [[heat-sinks|heat sink]].

### Keeping class AB stable
The bias voltage is fixed, but the transistors' $V_{BE}$ falls by 2 mV/°C as they warm. The quiescent current rises, they warm further, and the current rises again — **thermal runaway**, the classic way to destroy an amplifier. Three defences are used together: small **emitter resistors** (0.1–0.47 Ω) in each output emitter, which add local feedback; a $V_{BE}$ multiplier **mounted on the heat sink**, so the bias voltage falls as the output transistors heat; and a quiescent current set with a trimmer and checked after warm-up.

Overall [[negative-feedback|negative feedback]] from the output back to the input stage then shrinks what crossover distortion remains by the loop gain.

> [!note] The same topology in digital circuits is the *totem pole*: the output of TTL gates, the complementary pair in every CMOS gate, and the output stage of MOSFET gate drivers.
`,
  ideas: [
    'An NPN follower sources current; a complementary PNP follower sinks it.',
    'Class A: always on, linear, inefficient. Class B: each device conducts half the time, efficient but with crossover distortion.',
    'Class AB biases both devices slightly on to remove crossover distortion.',
    'Class B efficiency is (π/4)·V_p/V_CC, at most 78.5 %.',
    'Worst-case dissipation is about 0.4 of the maximum output power, reached at two-thirds of full swing.'
  ],
  derivation: {
    title: 'Efficiency and worst-case dissipation of class B',
    steps: [
      { text: 'Each transistor conducts for half a cycle, so each rail delivers half-sine pulses of current with peak $V_p/R_L$. The average of a half-sine taken over the whole cycle is $1/\\pi$ of its peak, and there are two rails:', tex: 'P_S = 2\\,V_{CC}\\,\\frac{V_p}{\\pi R_L} = \\frac{2V_{CC}V_p}{\\pi R_L}' },
      { text: 'The load receives', tex: 'P_{\\text{out}} = \\frac{V_p^2}{2R_L}' },
      { text: 'The ratio is the efficiency, which grows in proportion to the swing and reaches π/4 at $V_p = V_{CC}$:', tex: '\\eta = \\frac{P_{\\text{out}}}{P_S} = \\frac{\\pi}{4}\\,\\frac{V_p}{V_{CC}}' },
      { text: 'The transistors dissipate the difference, $P_D = P_S - P_{\\text{out}}$. Setting $\\mathrm{d}P_D/\\mathrm{d}V_p = 2V_{CC}/(\\pi R_L) - V_p/R_L = 0$ gives the worst swing, $V_p = 2V_{CC}/\\pi$, and there', tex: 'P_{D,\\max} = \\frac{4V_{CC}^2}{\\pi^2 R_L} - \\frac{2V_{CC}^2}{\\pi^2 R_L} = \\frac{2V_{CC}^2}{\\pi^2 R_L}' }
    ]
  },
  pitfalls: [
    'An amplifier gets hottest at full volume — In class B the transistors dissipate most at about 64 % of full swing; at full output more of the power goes to the load.',
    'Crossover distortion is negligible because it is only 0.6 V — It appears at every zero crossing and at every volume, and is most audible on quiet sounds.',
    'Once the bias is set, class AB is stable — Without emitter resistors and thermal tracking of the bias, the quiescent current can run away as the transistors heat.'
  ],
  formulas: [
    {
      name: 'Sine-wave output power',
      expr: 'P = Vp^2/(2*RL)', tex: 'P_{\\text{out}} = \\frac{V_p^2}{2R_L}',
      vars: {
        P: { name: 'average output power', q: 'power', unit: 'W', tex: 'P_{\\text{out}}' },
        Vp: { name: 'peak output voltage', q: 'voltage', unit: 'V', value: 13, tex: 'V_p' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 8, tex: 'R_L' }
      },
      stories: { Vp: 'What peak voltage must an amplifier swing to deliver {P} into {RL}?' }
    },
    {
      name: 'Efficiency of a class-B stage',
      expr: 'eta = pi/4*Vp/Vcc', tex: '\\eta = \\frac{\\pi}{4}\\,\\frac{V_p}{V_{CC}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Vp: { name: 'peak output voltage', q: 'voltage', unit: 'V', value: 13, tex: 'V_p' },
        Vcc: { name: 'supply rail (each side)', q: 'voltage', unit: 'V', value: 15, tex: 'V_{CC}' }
      }
    },
    {
      name: 'Worst-case dissipation of a class-B stage',
      expr: 'Pd = 2*Vcc^2/(pi^2*RL)', tex: 'P_{D,\\max} = \\frac{2V_{CC}^2}{\\pi^2 R_L}',
      vars: {
        Pd: { name: 'maximum total transistor dissipation', q: 'power', unit: 'W', tex: 'P_{D,\\max}' },
        Vcc: { name: 'supply rail (each side)', q: 'voltage', unit: 'V', value: 15, tex: 'V_{CC}' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 8, tex: 'R_L' }
      },
      note: 'Shared between the two transistors, and reached at V_p = 2V_CC/π.'
    }
  ],
  examples: [
    {
      title: 'A ±15 V amplifier into 8 Ω',
      q: 'A class-AB output stage on ±15 V rails can swing to about 13 V peak into an 8 Ω speaker. Find the maximum sine power, the efficiency at that level, and the heat each output transistor must handle.',
      steps: [
        '$P_\\text{out} = 13^2/(2 \\times 8) = 10.6$ W.',
        'Efficiency (close to class B): $\\eta = 0.785 \\times 13/15 = 68$ %, so the supplies deliver $10.6/0.68 = 15.5$ W.',
        { text: 'Worst-case dissipation, reached at a lower level ($V_p = 2 \\times 15/\\pi = 9.5$ V):', tex: 'P_{D,\\max} = \\frac{2 \\times 15^2}{\\pi^2 \\times 8} = 5.7\\ \\mathrm{W}' },
        'That is about 2.85 W per transistor, plus a little for the quiescent current — heat-sink both transistors for 3 W each.'
      ],
      a: '10.6 W at 68 % efficiency; design the heat sink for about 3 W per transistor.'
    }
  ],
  quiz: [
    { q: 'Crossover distortion appears because…', choices: ['the transistors saturate', 'neither transistor conducts while the input is within about ±0.6 V', 'the supply is too low', 'the load is inductive'], a: 1,
      why: 'In class B each base needs about 0.6 V before its transistor conducts, leaving a dead band around zero.' },
    { q: 'A class-B amplifier dissipates the most heat when…', choices: ['it is silent', 'its output is at about 64 % of the rails', 'it is at maximum output', 'it is clipping hard'], a: 1,
      why: 'Dissipation is supply power minus output power; that difference peaks at V_p = 2V_CC/π.' },
    { q: 'Class-A output stages are the usual choice where efficiency matters most, such as battery-powered speakers.', a: false,
      why: 'Class A wastes power continuously and reaches at most 25–50 % efficiency; battery products use class AB or, increasingly, class D switching amplifiers.' },
    { q: 'What is the maximum sine power into 4 Ω from a class-B stage whose output can swing ±12 V?', answer: 18, unit: 'W',
      why: 'P = V_p²/(2R_L) = 144/8 = 18 W.' },
    { q: 'Why mount the $V_{BE}$ multiplier on the output transistors\' heat sink?', choices: ['To cool it', 'So the bias voltage falls as the output transistors warm, preventing thermal runaway', 'For mechanical support', 'To raise the gain'], a: 1,
      why: 'The output transistors\' V_BE falls with temperature; a bias voltage that falls with it keeps the quiescent current steady.' }
  ],
  applications: ['Audio power amplifiers and headphone drivers.', 'The output stages of op-amps and line drivers.', 'Totem-pole outputs of logic gates and MOSFET gate drivers.', 'Servo and actuator drivers that must source and sink current.']
},

{
  id: 'h-bridge', parent: 'transistor-circuits', title: 'H-bridges and motor drive', level: 2,
  short: 'Four switches around a motor let current flow through it either way: forwards, backwards, braking and coasting — and a short circuit if the two switches on one side are ever on together.',
  keywords: ['H-bridge', 'full bridge', 'half bridge', 'motor driver', 'DC motor', 'direction control', 'braking', 'coasting', 'shoot-through', 'dead time', 'PWM', 'L298N', 'DRV8833', 'TB6612FNG', 'BTS7960', 'bootstrap', 'body diode', 'regenerative braking'],
  prereq: ['mosfet-switch', 'dc-motor-control', 'flyback-diode'],
  related: ['gate-drive', 'pwm', 'heat-sinks', 'push-pull'],
  body: `
Draw a motor as the crossbar of a capital H. Each upright is a **leg**, or half-bridge: a high-side switch from the supply to one motor terminal and a low-side switch from that terminal to ground. Close the high switch on the left and the low switch on the right, and current flows left to right through the motor; close the other diagonal and it flows right to left. That is the whole trick behind reversing a DC motor, driving a bipolar stepper winding, or making AC from DC in an inverter.

### The four useful states — and the forbidden one
| High L | Low L | High R | Low R | Result |
|---|---|---|---|---|
| on | off | off | on | **forward** |
| off | on | on | off | **reverse** |
| off | on | off | on | **brake**: both terminals grounded; the back-EMF drives a current through the short that stops the motor quickly |
| off | off | off | off | **coast**: the inductive current dies away through the body diodes into the supply; the motor spins down freely |
| on | on | — | — | **shoot-through**: a short from supply to ground through one leg |

Shoot-through needs no software bug. When one switch of a leg is turned off and the other turned on at the same instant, the first is still conducting while the second starts. Drivers therefore insert **dead time** — a few hundred nanoseconds with both switches off — at every transition, during which the body diodes carry the motor current.

### Speed control
Apply [[pwm|PWM]] to the active diagonal and the motor averages the voltage, $V_\\text{avg} = D\\,V_S$, while its inductance smooths the current (see [[dc-motor-control]]). Between pulses the current must keep flowing: through body diodes back into the supply (fast decay), or around a loop of two low-side switches (slow decay, and cooler, because the switches' milliohms replace the diodes' volt). At 20 kHz or more the whine is above hearing, at the price of more [[gate-drive|switching loss]].

### Sizing the bridge
- **Stall current**, $I = V_S/R_m$, flows at start-up and whenever the motor jams — often five to ten times the running current. The driver must survive it, at least briefly, or limit it.
- **Conduction loss**: two switches carry the current, so a MOSFET bridge loses $P = 2I^2R_{DS(on)}$. Bipolar drivers such as the classic **L298N** lose 2–4 V across their two conducting switches: at 1.5 A that is several watts, and the motor sees correspondingly less.
- **Modern MOSFET driver chips** — DRV8833 (about 1.5 A per bridge), TB6612FNG (1.2 A continuous, 3.2 A peak), DRV8871 (3.6 A peak) — lose far less. For tens of amperes, use a gate-driver IC with four discrete MOSFETs, or integrated half-bridges such as the BTS7960.
- **Regenerative braking** returns energy to the supply. A battery absorbs it; a bench supply or regulator that cannot sink current lets the rail rise, sometimes dangerously. A large bulk capacitor across the bridge, and sometimes a clamp, handles it.
- **High-side n-channel switches** need gate voltages above the supply: a bootstrap capacitor, recharged each time the low side conducts (so 100 % duty is impossible), or a charge pump.
`,
  ideas: [
    'Forward and reverse use opposite diagonals of the bridge.',
    'Braking shorts the motor through both low sides; coasting turns everything off.',
    'Both switches of one leg on at once is shoot-through: a short circuit, prevented by dead time.',
    'Size for the stall current, V_S/R_m, not the running current.',
    'MOSFET bridges lose 2I²R_DS(on); old bipolar drivers such as the L298N lose volts.'
  ],
  pitfalls: [
    'Turning on the high and low switch of the same side brakes the motor — That shorts the supply through the leg (shoot-through). Braking uses the two low-side (or two high-side) switches.',
    'The driver only needs to handle the running current — At start-up and stall the motor draws V_S/R_m, often five to ten times more.',
    'Reversing a spinning motor is like starting it — The back-EMF now adds to the supply, and the current jumps to nearly twice the stall current.'
  ],
  formulas: [
    {
      name: 'Stall current',
      expr: 'Is = V/Rm', tex: 'I_{\\text{stall}} = \\frac{V}{R_m}',
      vars: {
        Is: { name: 'stall (start-up) current', q: 'current', unit: 'A', tex: 'I_{\\text{stall}}' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12 },
        Rm: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 1.5, tex: 'R_m' }
      },
      stories: { Is: 'A {V} gear motor has a winding resistance of {Rm}. What current must its driver survive at start-up?' }
    },
    {
      name: 'Running current of a DC motor',
      expr: 'I = (V - Ke*w)/Rm', tex: 'I = \\frac{V - k_e\\,\\omega}{R_m}',
      vars: {
        I: { name: 'motor current', q: 'current', unit: 'A', signed: true },
        V: { name: 'applied voltage', q: 'voltage', unit: 'V', value: 12, signed: true },
        Ke: { name: 'back-EMF constant', unit: 'V·s/rad', value: 0.02, tex: 'k_e' },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 5000, signed: true, tex: '\\omega' },
        Rm: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 1.5, tex: 'R_m' }
      },
      note: 'With V negative (reversed) while ω is still positive, the current is about twice the stall current.'
    },
    {
      name: 'Conduction loss of a MOSFET bridge',
      expr: 'P = 2*I^2*Rds', tex: 'P = 2I^2 R_{DS(on)}',
      vars: {
        P: { name: 'bridge conduction loss', q: 'power', unit: 'W' },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 2 },
        Rds: { name: 'on-resistance of each switch', q: 'resistance', unit: 'mΩ', value: 25, tex: 'R_{DS(on)}' }
      }
    }
  ],
  examples: [
    {
      title: 'Choosing a driver for a 12 V gear motor',
      q: 'A 12 V gear motor measures 1.5 Ω and runs at 1 A. Compare an L298N (about 2.5 V lost at 1 A) with a bridge of four MOSFETs of 25 mΩ each.',
      steps: [
        'Stall current: $12/1.5 = 8$ A — beyond the L298N\'s 2 A per bridge (3 A peak) unless the start is current-limited.',
        'Running, L298N: the motor sees about 9.5 V, and the chip dissipates $2.5 \\times 1 = 2.5$ W — it needs its heat sink.',
        'Running, MOSFET bridge: $2 \\times 1^2 \\times 0.025 = 0.05$ W; the motor sees almost the full 12 V.',
        'At stall the MOSFET bridge dissipates $2 \\times 8^2 \\times 0.025 = 3.2$ W — 1.6 W in each conducting MOSFET. Survivable briefly; add current limiting or a stall timeout for jams.'
      ],
      a: 'The MOSFET bridge: 50 mW instead of 2.5 W running, and it survives the 8 A start.'
    },
    {
      title: 'How hard does braking brake?',
      q: 'The motor above has $k_e = 0.02$ V·s/rad and is spinning at 5000 rpm when both low-side switches (25 mΩ each) close. What is the initial braking current and torque?',
      steps: [
        '$\\omega = 5000 \\times 2\\pi/60 = 524$ rad/s, so the back-EMF is $0.02 \\times 524 = 10.5$ V.',
        'The only resistance in the loop is the winding and two switches: $I = 10.5/(1.5 + 0.05) = 6.8$ A.',
        'Torque $= k_t I = 0.02 \\times 6.8 = 0.135$ N·m (in SI units $k_t = k_e$), falling as the motor slows.',
        'Coasting would give only friction torque; braking stops the motor in a fraction of a second.'
      ],
      a: 'About 6.8 A and 0.14 N·m at first.'
    }
  ],
  quiz: [
    { q: 'Which switches conduct during braking?', choices: ['both high-side switches only', 'both low-side switches (or both high-side)', 'one diagonal', 'none'], a: 1,
      why: 'Connecting both motor terminals to the same rail shorts the motor, so its back-EMF drives a braking current.' },
    { q: 'With all four switches off while the motor is running, where does the motor\'s current go at first?', choices: ['Nowhere; it stops instantly', 'Through two body diodes back into the supply', 'Through the gate drivers', 'Into the PWM pin'], a: 1,
      why: 'The winding inductance keeps the current flowing; the only path is through the body diodes of the opposite diagonal into the supply, where it dies in about a millisecond.' },
    { q: 'A 12 V motor with a 2 Ω winding draws 0.8 A running. What current must the bridge survive at start-up?', answer: 6, unit: 'A',
      why: 'At rest there is no back-EMF: I = V/R = 12/2 = 6 A.' },
    { q: 'Turning on the high and low switches of the same leg brakes the motor.', a: false,
      why: 'That connects the supply straight to ground through one leg: shoot-through, not braking.' },
    { q: 'An L298N drives a 1.5 A motor from 12 V. The motor sees about…', choices: ['12 V', '11.9 V', '9–10 V', '6 V'], a: 2,
      why: 'Its two conducting bipolar switches lose around 2–3 V together at this current.' }
  ],
  applications: ['Robot wheels, toy cars and linear actuators.', 'Bipolar stepper motors (two bridges).', 'Inverters that turn DC into AC, and class-D audio amplifiers.', 'Thermoelectric (Peltier) coolers that must heat as well as cool.'],
  sim: 'tr-hbridge'
},

{
  id: 'heat-sinks', parent: 'transistor-circuits', title: 'Power dissipation and heat sinks', level: 2,
  short: 'Every watt a transistor dissipates must flow out through a chain of thermal resistances — junction to case, case to heat sink, heat sink to air — and each one raises the junction temperature. Adding them up tells you whether the part survives.',
  keywords: ['heat sink', 'thermal resistance', 'junction temperature', 'Tj', 'θJA', 'θJC', 'RthJC', 'thermal pad', 'thermal grease', 'derating', 'TO-220', 'thermal design', 'cooling', 'power dissipation'],
  prereq: ['power-energy', 'physics:conduction', 'physics:convection'],
  related: ['mosfet-switch', 'push-pull', 'linear-regulators', 'bjt-regions'],
  body: `
A transistor turns the power it dissipates into heat in a tiny volume of silicon — the **junction**. That heat has to reach the surrounding air, and every step of the way resists it. The analogy with Ohm's law is close enough to design with: heat flow in watts plays the part of current, temperature difference the part of voltage, and each step is a **thermal resistance** in °C/W (the same as K/W). In series they simply add:

$$T_J = T_A + P\\,\\left(R_{\\theta JC} + R_{\\theta CS} + R_{\\theta SA}\\right)$$

- $R_{\\theta JC}$, **junction to case**, from the datasheet: 0.5–2 °C/W for power MOSFETs and transistors in TO-220 or TO-247 (IRLZ44N 1.4 °C/W; TIP120 about 1.9 °C/W).
- $R_{\\theta CS}$, **case to sink**, through the interface: about 0.5 °C/W with thermal grease, 1–2 °C/W through a mica or silicone insulating pad (needed when the tab is live).
- $R_{\\theta SA}$, **sink to ambient**, from the heat-sink catalogue: 15–25 °C/W for a small clip-on TO-220 fin, 2–5 °C/W for an extruded block a few centimetres across, well under 1 °C/W with a fan.

Without a heat sink the datasheet gives $R_{\\theta JA}$ directly — about 62 °C/W for TO-220, 200–350 °C/W for TO-92 and SOT-23 — so only a watt or two (a few hundred milliwatts for the small packages) can be shed into still air.

### The design procedure
1. **Worst-case dissipation**: $I^2R_{DS(on)}$ with the hot resistance, $V_{CE}I_C$ at the worst operating point, plus switching loss; for a linear regulator, $(V_\\text{in} - V_\\text{out})I$.
2. **Maximum junction temperature** you accept — well below the absolute maximum of 150–175 °C. 110–125 °C gives life and margin.
3. **Worst-case ambient**: inside an enclosure 40–60 °C is common, not 25 °C.
4. **Solve for the heat sink**: $R_{\\theta SA} \\le (T_J - T_A)/P - R_{\\theta JC} - R_{\\theta CS}$. If the answer is negative, no heat sink can do it: share the dissipation between parts, choose a better part, or add forced air.

### Things that catch people out
- **Headline power ratings** such as "65 W" assume the case is held at 25 °C — an infinite heat sink. In practice a TO-220 part in free air handles about 2 W.
- **Heat takes time to arrive.** A heat sink has thermal mass, so short overloads are absorbed, and the datasheet's transient thermal impedance curve covers pulses. But design for steady state.
- **Orientation and airflow matter**: fins vertical in free air, clear of other hot parts. A heat sink inside a sealed box only moves the problem to the box.
- **Electrical and thermal design interact**: $R_{DS(on)}$ grows with temperature, and a BJT draws more current as its $V_{BE}$ falls — the reason for [[bjt-biasing|emitter resistors]] and generous margins.

The physics underneath — [[physics:conduction|conduction]] through the metal, then [[physics:convection|convection]] and [[physics:thermal-radiation|radiation]] from the fins — is why a black, finned heat sink standing vertically outperforms a shiny flat plate of the same mass.
`,
  ideas: [
    'T_J = T_A + P × (sum of the thermal resistances), like Ohm\'s law with heat as the current.',
    'Junction to case comes from the datasheet, case to sink from the interface, sink to air from the heat sink.',
    'A TO-220 in free air sheds only about 2 W; SOT-23 and TO-92 a few hundred milliwatts.',
    'Design for the worst ambient and a junction well below its maximum — 110–125 °C.',
    'Headline power ratings assume a case held at 25 °C.'
  ],
  pitfalls: [
    'A 65 W transistor can dissipate 65 W — Only with its case held at 25 °C by an ideal heat sink; in still air about 2 W.',
    'An insulating pad is as good as grease — It adds 1–2 °C/W, often as much as the junction-to-case resistance itself.',
    'Room temperature is the ambient — Inside a closed enclosure, next to other hot parts, 40–60 °C is typical.'
  ],
  formulas: [
    {
      name: 'Junction temperature on a heat sink',
      expr: 'Tj = Ta + P*(Rjc + Rcs + Rsa)', tex: 'T_J = T_A + P\\left(R_{\\theta JC} + R_{\\theta CS} + R_{\\theta SA}\\right)',
      vars: {
        Tj: { name: 'junction temperature', q: 'temperature', unit: '°C', value: 125, tex: 'T_J' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_A' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 7 },
        Rjc: { name: 'junction to case', q: 'thermalres', unit: '°C/W', value: 5, tex: 'R_{\\theta JC}' },
        Rcs: { name: 'case to sink (interface)', q: 'thermalres', unit: '°C/W', value: 0.5, tex: 'R_{\\theta CS}' },
        Rsa: { name: 'sink to ambient (the heat sink)', q: 'thermalres', unit: '°C/W', tex: 'R_{\\theta SA}' }
      },
      solveFor: 'Rsa',
      note: 'Solving for R_θSA gives the largest heat-sink resistance that keeps the junction at T_J.',
      stories: {
        Rsa: 'A regulator in TO-220 ({Rjc} junction to case, {Rcs} through the pad) dissipates {P} at {Ta}. Which heat sink keeps its junction at {Tj}?',
        Tj: 'A part dissipating {P} sits on a {Rsa} heat sink ({Rjc} + {Rcs} to the sink) in {Ta} air. How hot is the junction?'
      }
    },
    {
      name: 'Junction temperature in free air',
      expr: 'Tj = Ta + P*Rja', tex: 'T_J = T_A + P\\,R_{\\theta JA}',
      vars: {
        Tj: { name: 'junction temperature', q: 'temperature', unit: '°C', tex: 'T_J' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_A' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 1 },
        Rja: { name: 'junction to ambient', q: 'thermalres', unit: '°C/W', value: 62, tex: 'R_{\\theta JA}' }
      }
    },
    {
      name: 'Power rating at a given case temperature',
      expr: 'P = (Tj - Tc)/Rjc', tex: 'P_{\\max} = \\frac{T_{J,\\max} - T_C}{R_{\\theta JC}}',
      vars: {
        P: { name: 'maximum dissipation', q: 'power', unit: 'W', tex: 'P_{\\max}' },
        Tj: { name: 'maximum junction temperature', q: 'temperature', unit: '°C', value: 150, tex: 'T_{J,\\max}' },
        Tc: { name: 'case temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_C' },
        Rjc: { name: 'junction to case', q: 'thermalres', unit: '°C/W', value: 1.92, tex: 'R_{\\theta JC}' }
      },
      note: 'The datasheet\'s headline rating is this with T_C = 25 °C. Put in a realistic case temperature to see the real figure.'
    }
  ],
  examples: [
    {
      title: 'A heat sink for a linear regulator',
      q: 'A 7805-type regulator in TO-220 ($R_{\\theta JC}$ ≈ 5 °C/W) drops 12 V to 5 V at 1 A inside a box at 40 °C. With thermal grease (0.5 °C/W), what heat sink keeps the junction at 125 °C?',
      steps: [
        '$P = (12 - 5) \\times 1 = 7$ W.',
        'Total allowed: $(125 - 40)/7 = 12.1$ °C/W.',
        '$R_{\\theta SA} \\le 12.1 - 5 - 0.5 = 6.6$ °C/W — a finned extrusion a few centimetres long, not a clip-on fin.',
        'Without a heat sink: $7 \\times 62 = 434$ °C of rise. The regulator\'s thermal shutdown would trip within seconds.'
      ],
      a: 'A heat sink of 6.6 °C/W or better.'
    },
    {
      title: 'What "65 W" really means',
      q: 'A TIP120 is rated 65 W ($T_{J,\\max}$ = 150 °C, $R_{\\theta JC}$ = 1.92 °C/W, $R_{\\theta JA}$ = 62.5 °C/W). How much can it dissipate in free air at 25 °C, and on a 5 °C/W heat sink with a 1 °C/W pad at 40 °C?',
      steps: [
        'The rating is $(150 - 25)/1.92 = 65$ W — with the case held at 25 °C.',
        'Free air: $(150 - 25)/62.5 = 2$ W.',
        'On the heat sink: $(150 - 40)/(1.92 + 1 + 5) = 13.9$ W at the absolute limit; for a 125 °C junction, 10.7 W.'
      ],
      a: '2 W in free air; about 11 W on a good heat sink — not 65 W.'
    }
  ],
  quiz: [
    { q: 'A part dissipates 3 W with $R_{\\theta JC}$ = 2, $R_{\\theta CS}$ = 1 and $R_{\\theta SA}$ = 10 °C/W, in air at 30 °C. What is its junction temperature, in °C?', answer: 69,
      why: 'T_J = 30 + 3 × (2 + 1 + 10) = 30 + 39 = 69 °C.' },
    { q: 'A datasheet says $P_{tot}$ = 50 W. In free air, on its own, a TO-220 part can safely dissipate about…', choices: ['50 W', '25 W', '2 W', '0.1 W'], a: 2,
      why: 'R_θJA of about 62 °C/W allows roughly (150 − 25)/62 ≈ 2 W; the 50 W assumes a case held at 25 °C.' },
    { q: 'Using an insulating pad instead of thermal grease lowers the junction temperature.', a: false,
      why: 'The pad adds thermal resistance (1–2 °C/W against about 0.5); it is used for electrical insulation, not for better cooling.' },
    { q: 'The heat-sink formula gives a negative $R_{\\theta SA}$. This means…', choices: ['any heat sink will do', 'no heat sink can keep the junction cool enough at that power and ambient', 'the part needs no heat sink', 'the ambient was entered too low'], a: 1,
      why: 'The junction-to-case and interface resistances alone already use up the allowed temperature rise.' }
  ],
  applications: ['Linear regulators and pass transistors.', 'Motor-driver MOSFETs and audio output transistors.', 'LED lighting, where junction temperature sets lifetime and colour.', 'Choosing between a bigger heat sink, a fan and a more efficient circuit.'],
  sim: { id: 'tr-mosfet-switch', params: { load: 10 } }
}

);
