/* HYPER-ELECTRONICS · content/transients.js — what happens when a circuit switches:
 * RC charging and discharging, RL transients, and the RLC step response. */
Hyper.add(

{
  id: 'rc-transient', parent: 'transients', title: 'RC charging and discharging', level: 1,
  short: 'A capacitor charging or discharging through a resistor follows an exponential with the time constant τ = RC: 63 % of the way in one τ, and within 1 % after five.',
  keywords: ['RC circuit', 'time constant', 'tau', 'exponential', 'charging', 'discharging', '63 %', '5 tau', 'step response', 'power-on reset', 'debounce', 'bleeder resistor', 'inrush'],
  prereq: ['capacitors', 'resistance-ohms-law', 'physics:rc-circuits', 'math:first-order-linear'],
  related: ['rl-transient', 'rc-low-pass', 'timer-555', 'switches', 'relaxation-oscillators', 'math:exponential-growth-decay'],
  body: `
Connect an empty capacitor to a battery through a resistor. At first the capacitor has no voltage, so the whole supply sits across the resistor and a large current $V_S/R$ flows. As charge builds up, the capacitor's voltage rises, the difference across the resistor shrinks, and so does the current. The filling slows down the fuller it gets — the signature of an **exponential**:

$$v_C(t) = V_S\\left(1 - e^{-t/\\tau}\\right), \\qquad i(t) = \\frac{V_S}{R}\\,e^{-t/\\tau}, \\qquad \\tau = RC$$

The **time constant** $\\tau = RC$ has units of seconds (ohms times farads): 10 kΩ with 100 nF gives 1 ms, 1 MΩ with 10 µF gives 10 s. Discharging through the resistor is the mirror image, $v_C = V_0\\,e^{-t/\\tau}$.

### The numbers to remember
| Time | 1τ | 2τ | 3τ | 4τ | 5τ |
|---|---|---|---|---|---|
| Charged to | 63.2 % | 86.5 % | 95.0 % | 98.2 % | 99.3 % |

After one time constant the capacitor is 63 % of the way there, not full; after five it is within 1 % and engineers call it done. If the voltage kept its initial slope it would arrive in exactly one τ — a handy way to read τ off a scope trace.

### One formula for every step
Every first-order circuit (one capacitor, or one inductor, plus resistors) moves from where it starts to where it is heading along the same curve:

$$v(t) = v_\\text{final} + \\left(v_\\text{initial} - v_\\text{final}\\right)e^{-t/\\tau}$$

For a circuit with several resistors, $R$ is the [[thevenin-norton|Thévenin resistance]] the capacitor sees. Solving for the time to reach a threshold gives

$$t = \\tau \\ln\\frac{v_\\text{final} - v_\\text{initial}}{v_\\text{final} - v_\\text{threshold}}$$

### Where you use it
- **Power-on reset.** An RC on a microcontroller's reset pin holds it low for a few milliseconds while the supply settles.
- **Switch debouncing.** An RC smooths the bouncing of a mechanical contact; a Schmitt-trigger input then gives one clean edge ([[switches]]).
- **Timers and oscillators.** The [[timer-555|555]] charges a capacitor between 1/3 and 2/3 of the supply, which takes $RC\\ln 2 = 0.693RC$.
- **ADC sampling.** A sample-and-hold capacitor must settle to within half a bit: about $(N+1)\\ln 2$ time constants for $N$ bits — nine for 12 bits.
- **Safety bleeders.** A resistor across a high-voltage capacitor discharges it after switch-off.
- **Filters.** Driven by a sine instead of a step, the same circuit is the [[rc-low-pass|RC low-pass filter]]; the reference simulation below shows both faces at once.

### Energy: a surprise
Charging a capacitor from a fixed voltage through a resistor always wastes **exactly half** of the energy drawn from the supply: $\\tfrac12 CV^2$ ends up in the capacitor and the same amount heats the resistor, **whatever its value**. A smaller resistor only makes the loss quicker — and the inrush current peak $V_S/R$ larger, which is why big smoothing capacitors need inrush limiting.
`,
  ideas: [
    'The time constant τ = RC sets the speed; it does not depend on the voltage.',
    'After τ: 63 %; after 5τ: within 1 %.',
    'Every first-order step goes from its initial to its final value as v_f + (v_i − v_f)e^(−t/τ).',
    'The capacitor\'s voltage cannot jump, but its current can: at switch-on the current is V/R.',
    'Charging through a resistor from a fixed voltage wastes half the energy, whatever R is.'
  ],
  pitfalls: [
    'After one time constant the capacitor is charged — It is 63 % of the way. It takes about five time constants to get within 1 %.',
    'A higher supply voltage charges the capacitor faster — τ = RC is independent of voltage: the capacitor reaches the same fraction of the supply in the same time. (It reaches a fixed threshold sooner, which is a different thing.)',
    'A larger resistor wastes less energy while charging — Charging from a fixed voltage loses half the energy drawn, for any resistance; the resistor only sets how fast.'
  ],
  derivation: {
    title: 'Solving the charging equation',
    steps: [
      { text: 'Kirchhoff\'s voltage law around the loop, with $i = C\\,dv_C/dt$:', tex: 'V_S = iR + v_C = RC\\frac{dv_C}{dt} + v_C' },
      { text: 'Separate the variables:', tex: '\\frac{dv_C}{V_S - v_C} = \\frac{dt}{RC}' },
      { text: 'Integrate from $v_C = 0$ at $t = 0$:', tex: '-\\ln\\frac{V_S - v_C}{V_S} = \\frac{t}{RC}' },
      { text: 'Solve for $v_C$:', tex: 'v_C = V_S\\left(1 - e^{-t/RC}\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Time constant',
      expr: 'tau = R*C', tex: '\\tau = RC',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { tau: 'What is the time constant of {R} and {C}?', C: 'You need a {tau} time constant with a {R} resistor. What capacitor?' }
    },
    {
      name: 'Charging towards a supply',
      expr: 'v = Vs*(1 - exp(-t/tau))', tex: 'v_C = V_S\\left(1 - e^{-t/\\tau}\\right)',
      vars: {
        v: { name: 'capacitor voltage', q: 'voltage', unit: 'V', tex: 'v_C' },
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_S' },
        t: { name: 'time since switch-on', q: 'time', unit: 'ms', value: 2 },
        tau: { name: 'time constant RC', q: 'time', unit: 'ms', value: 1, tex: '\\tau' }
      },
      stories: { v: 'An empty capacitor charges from {Vs} with τ = {tau}. What is its voltage after {t}?', t: 'How long does a capacitor charging from {Vs} with τ = {tau} take to reach {v}?' }
    },
    {
      name: 'Discharging through a resistor',
      expr: 'v = V0*exp(-t/(R*C))', tex: 'v_C = V_0\\,e^{-t/RC}',
      vars: {
        v: { name: 'capacitor voltage', q: 'voltage', unit: 'V', tex: 'v_C' },
        V0: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_0' },
        t: { name: 'time', q: 'time', unit: 's', value: 60 },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 100 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 470 }
      },
      stories: { t: 'A {C} capacitor at {V0} discharges through a {R} bleeder. How long until it is down to {v}?', v: 'A {C} capacitor charged to {V0} discharges through {R}. What is its voltage after {t}?' }
    },
    {
      name: 'Time to reach a threshold',
      expr: 't = R*C*ln((Vf - Vi)/(Vf - Vth))', tex: 't = RC\\,\\ln\\frac{V_f - V_i}{V_f - V_{\\text{th}}}',
      vars: {
        t: { name: 'time to reach the threshold', q: 'time', unit: 'ms' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1 },
        Vf: { name: 'final voltage it is heading for', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_f' },
        Vi: { name: 'initial voltage', q: 'voltage', unit: 'V', value: 0, signed: true, tex: 'V_i' },
        Vth: { name: 'threshold voltage', q: 'voltage', unit: 'V', value: 2.31, tex: 'V_{\\text{th}}' }
      },
      note: 'Works for charging and discharging alike; the threshold must lie between the initial and final values.',
      stories: { t: 'A reset pin with {R} and {C} charges from {Vi} towards {Vf}. How long until it passes the {Vth} threshold?' }
    }
  ],
  examples: [
    {
      title: 'A power-on reset delay',
      q: 'A microcontroller\'s reset pin is pulled up to 3.3 V through 10 kΩ with 1 µF to ground. The chip leaves reset when the pin passes 0.7 × 3.3 V. How long is the reset held?',
      steps: [
        '$\\tau = 10\\ \\mathrm{k\\Omega} \\times 1\\ \\mu\\mathrm{F} = 10\\ \\mathrm{ms}$; the threshold is 2.31 V.',
        { text: 'Time to the threshold, starting from 0 V:', tex: 't = 10\\ \\mathrm{ms} \\times \\ln\\frac{3.3 - 0}{3.3 - 2.31} = 10\\ \\mathrm{ms} \\times \\ln 3.33 = 12.0\\ \\mathrm{ms}' },
        'Independent of the supply voltage, because the threshold is a fixed fraction of it: $\\tau\\ln(1/0.3) = 1.2\\tau$.'
      ],
      a: 'About 12 ms.'
    },
    {
      title: 'A bleeder resistor for a DC link',
      q: 'A 470 µF capacitor on a 400 V DC bus must fall below 50 V after switch-off. A 100 kΩ bleeder is fitted. How long does that take, and what does the bleeder dissipate in normal running?',
      steps: [
        '$\\tau = 100\\ \\mathrm{k\\Omega} \\times 470\\ \\mu\\mathrm{F} = 47\\ \\mathrm{s}$.',
        '$t = \\tau\\ln(400/50) = 47 \\times 2.08 = 98\\ \\mathrm{s}$ — over a minute and a half.',
        'Power while running: $400^2/100\\ \\mathrm{k\\Omega} = 1.6\\ \\mathrm{W}$, all the time. Use two 2 W resistors in series, which also shares the voltage stress.',
        'A faster bleed needs a smaller resistor and more wasted power — or a bleeder switched in only at power-off.'
      ],
      a: 'About 98 s to 50 V; the bleeder dissipates 1.6 W.'
    }
  ],
  quiz: [
    { q: 'One time constant after switch-on, an initially empty capacitor has charged to…', choices: ['50 %', '63 %', '100 %', '37 %'], a: 1,
      why: '1 − e⁻¹ = 0.632. 37 % is what is left to go (or what remains after one τ of discharging).' },
    { q: 'Doubling the supply voltage doubles the time a capacitor takes to charge to 63 % of it.', a: false,
      why: 'τ = RC contains no voltage. The capacitor reaches 63 % of whatever supply it has in the same time.' },
    { q: 'What is the time constant of 4.7 kΩ and 220 nF?', answer: 1.034, unit: 'ms',
      why: 'τ = 4700 × 220 × 10⁻⁹ = 1.034 × 10⁻³ s.' },
    { q: 'At the instant an empty capacitor is switched to a supply through R, the current is…', choices: ['zero', 'V/R, its largest value', 'V/2R', 'unlimited'], a: 1,
      why: 'An empty capacitor has no voltage across it, so the whole supply is across R. The current then decays as the capacitor charges.' },
    { q: 'A 1000 µF capacitor is charged to 12 V through 1 Ω, then (discharged and) again through 100 Ω. The energy lost in the resistor is…', choices: ['larger with 1 Ω', 'larger with 100 Ω', 'the same, 72 mJ, both times', 'zero with 100 Ω'], a: 2,
      why: 'The loss is ½CV² = ½ × 10⁻³ × 144 = 72 mJ for any resistor. The resistance changes only the time it takes and the peak current.' }
  ],
  applications: ['Power-on reset and enable delays.', 'Debouncing switch contacts.', 'Timing in 555 timers and relaxation oscillators.', 'Bleeder resistors that make high-voltage capacitors safe.', 'Inrush current at switch-on of supplies with large capacitors.'],
  sim: 'ref-rc-scope'
},

{
  id: 'rl-transient', parent: 'transients', title: 'RL transients', level: 2,
  short: 'An inductor resists changes of current: in an RL circuit the current rises and decays exponentially with τ = L/R — and interrupting it suddenly produces a large voltage spike.',
  keywords: ['RL circuit', 'inductor', 'time constant', 'L/R', 'current rise', 'back EMF', 'inductive kick', 'flyback', 'relay coil', 'solenoid', 'stored energy', 'switch-off spike', 'snubber'],
  prereq: ['inductors', 'rc-transient', 'physics:rl-circuits', 'physics:inductance'],
  related: ['flyback-diode', 'relays', 'buck-converter', 'rlc-transient', 'physics:energy-in-inductor'],
  body: `
An inductor is the capacitor's mirror image. A capacitor's **voltage** cannot change instantly; an inductor's **current** cannot, because
$$v_L = L\\frac{di}{dt}$$
and a sudden change of current would need an infinite voltage.

### Switching on
Connect a coil of inductance $L$ and resistance $R$ to a DC supply $V$. At the first instant the current is still zero, so there is no drop across $R$ and the whole supply appears across the inductance. That voltage drives the current up, the drop across $R$ grows, and less is left to push: the current rises along the familiar exponential,

$$i(t) = \\frac{V}{R}\\left(1 - e^{-t/\\tau}\\right), \\qquad v_L = V e^{-t/\\tau}, \\qquad \\tau = \\frac{L}{R}$$

A 12 V relay coil of 100 mH and 200 Ω has $\\tau = 0.5\\ \\mathrm{ms}$ and settles to 60 mA; a large contactor coil of 5 H and 50 Ω takes 100 ms. Note the reversal from RC: here a **larger** resistance makes the circuit **faster** (and the final current smaller).

For times much shorter than τ the rise is practically a straight line, $i \\approx (V/L)\\,t$. That is how a [[buck-converter|switching converter]] uses its inductor: it switches long before the exponential bends, so the current ramps up and down linearly.

### Switching off: the inductive kick
Now open the switch. The inductor's current wants to continue, and its stored energy $\\tfrac12 LI^2$ has to go somewhere. If the circuit is simply broken, $di/dt$ becomes enormous and so does the voltage: interrupting 60 mA in a 100 mH coil within 1 µs would take $0.1 \\times 0.06/10^{-6} = 6\\ \\mathrm{kV}$. In practice the voltage rises until something gives way — the switch contacts arc (and erode), or the driving transistor breaks down.

The standard cure is a **[[flyback-diode|flyback diode]]** across the coil. At switch-off the current transfers into the diode and circulates through the coil's own resistance, decaying with $\\tau = L/R$; the voltage is clamped one diode drop beyond the supply. The price is speed: a relay with a plain diode releases noticeably later, because the current dies away slowly. Where release time matters, a Zener or TVS in series with the diode lets the voltage rise to a safe, higher clamp, and the energy is dissipated faster.

### Driving inductive loads
- **Solenoids and relays** pull in on current, not voltage: the time to reach the pull-in current is set by $L/R$. "Peak-and-hold" drivers apply a high voltage to get the current up fast, then reduce it.
- **Stepper motors** lose torque at speed because their winding current cannot rise fast enough within each step. Drivers use a supply several times the winding's rating and chop the current to its limit: a higher voltage reaches the target current sooner.
- **Measuring τ** on the bench: put a small resistor in series and watch its voltage (proportional to the current) on the scope, as in the simulation.
`,
  ideas: [
    'An inductor\'s current cannot jump: at switch-on it starts at zero and rises with τ = L/R.',
    'In an RL circuit more resistance means a faster but smaller current.',
    'For t ≪ τ the current ramps linearly, di/dt = V/L — the basis of switching converters.',
    'Breaking an inductor\'s current produces a voltage L·di/dt that can reach kilovolts.',
    'A flyback diode clamps the kick and lets the current decay, at the cost of a slower release.'
  ],
  pitfalls: [
    'More resistance makes an RL circuit slower, as in RC — τ = L/R: more resistance makes it faster, while lowering the final current.',
    'Opening a switch stops an inductor\'s current instantly — The current keeps flowing for a moment; with no path, the voltage climbs until a contact arcs or a transistor breaks down.',
    'A flyback diode has no downside — It slows the release of relays and solenoids. Where release time matters, a Zener or TVS in series raises the clamp and speeds the decay.'
  ],
  derivation: {
    title: 'The current in an RL circuit',
    steps: [
      { text: 'Kirchhoff\'s voltage law with the inductor\'s $v = L\\,di/dt$:', tex: 'V = iR + L\\frac{di}{dt}' },
      { text: 'Rearrange as a first-order linear equation:', tex: '\\frac{di}{dt} + \\frac{R}{L}\\,i = \\frac{V}{L}' },
      { text: 'Its solution with $i(0) = 0$ approaches the final current $V/R$ exponentially:', tex: 'i(t) = \\frac{V}{R}\\left(1 - e^{-Rt/L}\\right)' },
      { text: 'For small $t$, expand $e^{-x} \\approx 1 - x$ to see the linear start:', tex: 'i \\approx \\frac{V}{R}\\cdot\\frac{Rt}{L} = \\frac{V}{L}\\,t' }
    ]
  },
  formulas: [
    {
      name: 'Time constant of an RL circuit',
      expr: 'tau = L/R', tex: '\\tau = \\frac{L}{R}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 },
        R: { name: 'total series resistance', q: 'resistance', unit: 'Ω', value: 200 }
      },
      stories: { tau: 'A relay coil has {L} and {R}. What is its time constant?' }
    },
    {
      name: 'Current rise after switch-on',
      expr: 'i = V/R*(1 - exp(-t*R/L))', tex: 'i = \\frac{V}{R}\\left(1 - e^{-tR/L}\\right)',
      vars: {
        i: { name: 'current', q: 'current', unit: 'mA' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 200 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 },
        t: { name: 'time since switch-on', q: 'time', unit: 'ms', value: 0.5 }
      },
      stories: { i: 'A {L}, {R} coil is switched onto {V}. What is the current after {t}?', t: 'A {L}, {R} coil on {V} must reach {i} to pull in. How long does that take?' }
    },
    {
      name: 'Voltage from a change of current',
      expr: 'v = L*dI/dt', tex: 'v = L\\frac{\\Delta I}{\\Delta t}',
      vars: {
        v: { name: 'induced voltage', q: 'voltage', unit: 'V' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 },
        dI: { name: 'change of current', q: 'current', unit: 'mA', value: 60, tex: '\\Delta I' },
        dt: { name: 'time the change takes', q: 'time', unit: 'µs', value: 1, tex: '\\Delta t' }
      },
      note: 'An estimate for a fast interruption; in reality the voltage is limited by whatever breaks down first.',
      stories: { v: 'A transistor switches off {dI} in a {L} coil in {dt}. What voltage does the coil try to produce?' }
    },
    {
      name: 'Energy stored in an inductor',
      expr: 'E = L*I^2/2', tex: 'E = \\tfrac{1}{2}LI^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'mJ' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 },
        I: { name: 'current', q: 'current', unit: 'mA', value: 60 }
      },
      stories: { E: 'How much energy must a flyback diode deal with when a {L} coil carrying {I} is switched off?' }
    }
  ],
  examples: [
    {
      title: 'How fast does a relay pull in?',
      q: 'A 12 V relay coil has 100 mH and 200 Ω and pulls in at 40 mA. How long after switch-on does it operate (ignoring the armature\'s travel)?',
      steps: [
        '$\\tau = L/R = 0.1/200 = 0.5\\ \\mathrm{ms}$; the final current is $12/200 = 60\\ \\mathrm{mA}$.',
        { text: 'Time for the current to reach 40 mA:', tex: 't = \\tau\\ln\\frac{60}{60 - 40} = 0.5\\ \\mathrm{ms} \\times \\ln 3 = 0.55\\ \\mathrm{ms}' },
        'The mechanical movement then takes several milliseconds more, so the electrical delay is small here.'
      ],
      a: 'About 0.55 ms for the current to reach 40 mA.'
    },
    {
      title: 'Switching the relay off',
      q: 'The same coil is driven by a transistor that turns off in about 1 µs. Estimate the voltage spike without protection, then describe what happens with a flyback diode.',
      steps: [
        'Without protection: $v \\approx L\\,\\Delta I/\\Delta t = 0.1 \\times 0.06/10^{-6} = 6000\\ \\mathrm{V}$ — the transistor will avalanche long before that.',
        'The energy to be disposed of is $\\tfrac12 \\times 0.1 \\times 0.06^2 = 0.18\\ \\mathrm{mJ}$ at every switch-off.',
        'With a diode across the coil, the collector rises only to $12 + 0.7 = 12.7\\ \\mathrm{V}$, and the 60 mA decays through the coil\'s own 200 Ω with $\\tau = 0.5\\ \\mathrm{ms}$.'
      ],
      a: 'Kilovolts without protection; 12.7 V with a flyback diode, the current dying away in a few milliseconds.'
    }
  ],
  quiz: [
    { q: 'At the instant a DC supply is connected to a series RL circuit, the current is…', choices: ['V/R', 'zero', 'V/L', 'infinite'], a: 1,
      why: 'An inductor\'s current cannot jump, so it starts at zero; the full supply voltage appears across the inductance.' },
    { q: 'Adding series resistance to an RL circuit makes the current reach its final value…', choices: ['more slowly, and a larger final value', 'faster, but a smaller final value', 'at the same speed', 'faster, and a larger final value'], a: 1,
      why: 'τ = L/R falls as R rises, so the curve is quicker; the final current V/R is smaller. Stepper drivers exploit exactly this.' },
    { q: 'What is the time constant of a 50 mH inductor in series with 25 Ω?', answer: 2, unit: 'ms',
      why: 'τ = L/R = 0.05/25 = 0.002 s.' },
    { q: 'A flyback diode across a relay coil makes the relay release faster.', a: false,
      why: 'It lets the coil current circulate and decay slowly through the coil resistance, so the relay holds on longer. A Zener in series speeds it up.' },
    { q: 'How much energy is stored in a 10 mH inductor carrying 2 A?', answer: 20, unit: 'mJ',
      why: 'E = ½LI² = 0.5 × 0.01 × 4 = 0.02 J.' }
  ],
  applications: ['Relay, contactor and solenoid drivers, with their flyback protection.', 'Current rise in stepper-motor windings and chopper drives.', 'The linear current ramps in switching converters.', 'Ignition coils, which use the inductive kick on purpose.'],
  sim: { id: 'acf-step', params: { circuit: 'rl' } }
},

{
  id: 'rlc-transient', parent: 'transients', title: 'RLC step response and damping', level: 3,
  short: 'With both an inductor and a capacitor, energy sloshes between them: a step makes the circuit ring near 1/(2π√LC), and the resistance decides whether it rings, settles fast, or crawls.',
  keywords: ['RLC circuit', 'step response', 'damping ratio', 'zeta', 'under-damped', 'critically damped', 'over-damped', 'ringing', 'overshoot', 'natural frequency', 'settling time', 'Q factor', 'second-order system', 'hot plugging', 'snubber'],
  prereq: ['rc-transient', 'rl-transient', 'math:damped-oscillator-ode', 'physics:damped-oscillations'],
  related: ['resonance-q', 'filter-order', 'math:second-order-linear', 'math:laplace-transform', 'decoupling', 'buck-converter'],
  body: `
Put an inductor and a capacitor in the same loop and something new happens: energy can pass back and forth between the capacitor's electric field and the inductor's magnetic field. It is a mass on a spring — the inductor is the **mass** (it keeps current moving), the capacitor the **spring** (its voltage pushes back), the resistor the **friction**. Hit it with a step and it may overshoot and ring before it settles.

### The equation and its three numbers
For a series RLC driven by a voltage step $V$, Kirchhoff's law gives
$$LC\\frac{d^2v_C}{dt^2} + RC\\frac{dv_C}{dt} + v_C = V$$
Everything about its behaviour is captured by

$$\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\qquad \\zeta = \\frac{R}{2}\\sqrt{\\frac{C}{L}}, \\qquad Q = \\frac{1}{2\\zeta} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$$

the **natural frequency**, the **damping ratio** and the **quality factor**. The combination $Z_0 = \\sqrt{L/C}$, the characteristic impedance, is the yardstick for $R$: damping is light when $R \\ll 2Z_0$.

### Three kinds of response
- **Under-damped** ($\\zeta < 1$, $R < 2Z_0$): the voltage overshoots and rings at $\\omega_d = \\omega_0\\sqrt{1 - \\zeta^2}$ inside an envelope $e^{-\\zeta\\omega_0 t}$. The first overshoot is
$$\\text{overshoot} = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}$$
and it settles to 2 % in about $4/(\\zeta\\omega_0)$.
- **Critically damped** ($\\zeta = 1$, $R = 2\\sqrt{L/C}$): the fastest possible rise with no overshoot at all.
- **Over-damped** ($\\zeta > 1$): two plain exponentials, the slower one growing longer as $R$ increases (it tends to $RC$). More resistance now makes things *slower*.

| ζ | 0.1 | 0.2 | 0.5 | 0.707 | 1 |
|---|---|---|---|---|---|
| Overshoot | 73 % | 53 % | 16 % | 4.3 % | 0 |

A damping ratio near 0.7 is a common design target: a few per cent of overshoot buys a much faster rise than critical damping — the same choice as the Butterworth filter ([[filter-order]]).

Example: $L = 10\\ \\mathrm{mH}$, $C = 100\\ \\mathrm{nF}$ gives $f_0 = 5.03\\ \\mathrm{kHz}$ and $Z_0 = 316\\ \\Omega$. With $R = 100\\ \\Omega$, $\\zeta = 0.16$: a 5 V step overshoots by 60 %, to 8 V.

### Where unwanted ringing lives
You rarely build an RLC on purpose to watch it ring, but parasitic ones are everywhere:
- **Fast logic edges** ring on the inductance of a long trace and the capacitance of the input it drives.
- **Hot-plugging.** A board with low-ESR ceramic input capacitors plugged into a supply through a cable forms a lightly damped LC: the input can overshoot to nearly **twice** the supply voltage and destroy parts rated with too little margin.
- **Converter output filters** ring at start-up and on load steps ([[buck-converter]]).
- **Switch nodes** ring with the transistor's capacitance and the loop inductance; an RC **snubber** adds the missing damping.

The cure is always to add resistance where it dissipates the ringing energy without wasting DC power: a series resistor at a driver, an electrolytic capacitor whose ESR is close to $Z_0$, or an RC snubber in parallel.
`,
  ideas: [
    'An RLC circuit behaves like a mass on a spring: L is inertia, C the spring, R the friction.',
    'ω₀ = 1/√(LC) sets the frequency; ζ = (R/2)√(C/L) sets the damping; Q = 1/(2ζ).',
    'Under-damped circuits overshoot and ring; critical damping (R = 2√(L/C)) is the fastest response without overshoot.',
    'Over-damping makes the response slower again, not faster.',
    'Parasitic RLC circuits ring on edges, cables and switch nodes; the cure is well-placed damping.'
  ],
  pitfalls: [
    'More resistance always gives a faster, cleaner response — Beyond critical damping the response becomes sluggish, with a slow exponential tending to τ = RC.',
    'The circuit rings at exactly f₀ — It rings at f₀√(1 − ζ²), close to f₀ only when the damping is light.',
    'Ringing needs a deliberate inductor and capacitor — Every wire has inductance and every input has capacitance; fast edges on long traces and cables ring the same way.'
  ],
  derivation: {
    title: 'Where the three regimes come from',
    steps: [
      { text: 'Without the source, try $v_C = e^{st}$ in the homogeneous equation:', tex: 'LCs^2 + RCs + 1 = 0 \\;\\Rightarrow\\; s^2 + \\frac{R}{L}s + \\frac{1}{LC} = 0' },
      { text: 'With $\\omega_0^2 = 1/LC$ and $\\zeta\\omega_0 = R/2L$ the roots are', tex: 's = -\\zeta\\omega_0 \\pm \\omega_0\\sqrt{\\zeta^2 - 1}' },
      { text: 'For $\\zeta < 1$ the roots are complex: a decaying oscillation at $\\omega_d = \\omega_0\\sqrt{1-\\zeta^2}$. For $\\zeta > 1$ they are two real negative numbers: two exponentials. At $\\zeta = 1$ they merge.', tex: '\\zeta = \\frac{R}{2L}\\sqrt{LC} = \\frac{R}{2}\\sqrt{\\frac{C}{L}}' },
      { text: 'The under-damped step response from rest is', tex: 'v_C = V\\left[1 - e^{-\\zeta\\omega_0 t}\\left(\\cos\\omega_d t + \\frac{\\zeta}{\\sqrt{1-\\zeta^2}}\\sin\\omega_d t\\right)\\right]' },
      { text: 'Its first peak comes at $\\omega_d t = \\pi$, where the bracket gives the overshoot:', tex: '\\frac{v_\\text{max} - V}{V} = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}' }
    ]
  },
  formulas: [
    {
      name: 'Natural frequency',
      expr: 'f0 = 1/(2*pi*sqrt(L*C))', tex: 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}',
      vars: {
        f0: { name: 'natural (resonant) frequency', q: 'frequency', unit: 'kHz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { f0: 'At what frequency does a {L}, {C} circuit ring?' }
    },
    {
      name: 'Damping ratio of a series RLC',
      expr: 'zeta = R/2*sqrt(C/L)', tex: '\\zeta = \\frac{R}{2}\\sqrt{\\frac{C}{L}}',
      vars: {
        zeta: { name: 'damping ratio', tex: '\\zeta' },
        R: { name: 'series resistance', q: 'resistance', unit: 'Ω', value: 100 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 }
      },
      stories: { zeta: 'What is the damping ratio of {R} in series with {L} and {C}?', R: 'What series resistance gives a damping ratio of {zeta} with {L} and {C}?' }
    },
    {
      name: 'Resistance for critical damping',
      expr: 'Rc = 2*sqrt(L/C)', tex: 'R_{\\text{crit}} = 2\\sqrt{\\frac{L}{C}}',
      vars: {
        Rc: { name: 'critical resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{crit}}' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      stories: { Rc: 'What series resistance critically damps {L} with {C}?' }
    },
    {
      name: 'Overshoot of the step response',
      expr: 'OS = exp(-pi*zeta/sqrt(1 - zeta^2))', tex: '\\text{OS} = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}',
      vars: {
        OS: { name: 'first overshoot, as a fraction of the step', q: 'ratio', unit: '%', tex: '\\text{OS}' },
        zeta: { name: 'damping ratio', value: 0.2, min: 0, max: 0.999, tex: '\\zeta' }
      },
      note: 'Valid for $\\zeta < 1$; at critical damping and above there is no overshoot.',
      stories: { OS: 'A second-order system has ζ = {zeta}. By what fraction does its step response overshoot?', zeta: 'A step response overshoots by {OS}. What is the damping ratio?' }
    },
    {
      name: 'Frequency of the ringing',
      expr: 'fd = f0*sqrt(1 - zeta^2)', tex: 'f_d = f_0\\sqrt{1 - \\zeta^2}',
      vars: {
        fd: { name: 'damped ringing frequency', q: 'frequency', unit: 'kHz', tex: 'f_d' },
        f0: { name: 'natural frequency', q: 'frequency', unit: 'kHz', value: 5, tex: 'f_0' },
        zeta: { name: 'damping ratio', value: 0.3, min: 0, max: 0.999, tex: '\\zeta' }
      },
      stories: { fd: 'A circuit with f₀ = {f0} and ζ = {zeta} is stepped. At what frequency does it ring?' }
    }
  ],
  examples: [
    {
      title: 'A lightly damped LC',
      q: 'A 5 V step drives 100 Ω in series with 10 mH and 100 nF. Find $f_0$, $\\zeta$, $Q$, the peak capacitor voltage, the ringing frequency and the 2 % settling time.',
      steps: [
        '$f_0 = 1/(2\\pi\\sqrt{0.01 \\times 10^{-7}}) = 5.03\\ \\mathrm{kHz}$, so $\\omega_0 = 31\\,600\\ \\mathrm{rad/s}$.',
        '$\\zeta = 50\\sqrt{10^{-7}/0.01} = 0.158$ and $Q = 1/(2\\zeta) = 3.16$.',
        'Overshoot $= e^{-\\pi \\times 0.158/0.987} = 0.60$: the capacitor peaks at $5 \\times 1.60 = 8.0\\ \\mathrm{V}$.',
        'It rings at $5.03\\sqrt{1 - 0.025} = 4.97\\ \\mathrm{kHz}$ and settles to 2 % in $4/(\\zeta\\omega_0) = 0.8\\ \\mathrm{ms}$ — about four cycles.'
      ],
      a: 'f₀ = 5.0 kHz, ζ = 0.16, Q = 3.2; peak 8.0 V; rings at 4.97 kHz; settles in about 0.8 ms.'
    },
    {
      title: 'Hot-plugging a board',
      q: 'A board with 10 µF of ceramic input capacitance (negligible ESR) is plugged into a 24 V supply through a 2 m cable of about 1.5 µH loop inductance and 55 mΩ total resistance. How high can the input voltage ring, and what resistance would damp it critically?',
      steps: [
        '$Z_0 = \\sqrt{1.5\\ \\mu\\mathrm{H}/10\\ \\mu\\mathrm{F}} = 0.39\\ \\Omega$, and $\\zeta = R/(2Z_0) = 0.055/0.77 = 0.07$.',
        'Overshoot $= e^{-\\pi \\times 0.07} \\approx 0.80$: the input peaks near $24 \\times 1.8 = 43\\ \\mathrm{V}$, at $f_0 = 41\\ \\mathrm{kHz}$.',
        'A regulator rated 35 V may not survive. Critical damping needs about $2Z_0 = 0.8\\ \\Omega$ in the loop.',
        'In practice: add a bulk electrolytic (its ESR of a few hundred milliohms damps the ringing), a TVS diode, or a soft-start hot-swap controller.'
      ],
      a: 'Up to about 43 V; about 0.8 Ω of damping would stop the overshoot.'
    }
  ],
  quiz: [
    { q: 'What series resistance critically damps L = 10 mH with C = 100 nF?', choices: ['316 Ω', '632 Ω', '100 Ω', '6.3 kΩ'], a: 1,
      why: 'R_crit = 2√(L/C) = 2√(10⁵) = 632 Ω. 316 Ω is √(L/C) itself, which gives ζ = 0.5.' },
    { q: 'Raising R in an under-damped series RLC (but staying under-damped)…', choices: ['increases the overshoot', 'reduces the overshoot and barely changes the ringing frequency', 'raises the ringing frequency a lot', 'makes it oscillate for ever'], a: 1,
      why: 'ζ grows with R, so the overshoot e^(−πζ/√(1−ζ²)) falls; the ringing frequency f₀√(1−ζ²) changes little until ζ approaches 1.' },
    { q: 'Critical damping gives the fastest step response that does not overshoot.', a: true,
      why: 'Less damping overshoots; more damping is slower. ζ = 1 sits exactly on the boundary.' },
    { q: 'What is the overshoot (in %) of a second-order step response with ζ = 0.5?', answer: 16.3, unit: '%',
      why: 'e^(−π × 0.5/√0.75) = e^(−1.814) = 0.163.' },
    { q: 'Doubling C in an LC circuit changes its natural frequency by a factor of…', choices: ['2', '1/2', '1/√2 ≈ 0.71', '√2 ≈ 1.41'], a: 2,
      why: 'f₀ = 1/(2π√(LC)), so doubling C divides f₀ by √2.' }
  ],
  applications: ['Damping the output LC filters of switching converters.', 'Hot-plug protection for boards with ceramic input capacitors.', 'Snubbers across switches and relay contacts.', 'Signal integrity: series termination to stop ringing on fast lines.', 'Control systems, where the same ζ describes overshoot of a servo.'],
  sim: { id: 'acf-step', params: { circuit: 'rlc' } }
}

);
