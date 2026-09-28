/* HYPER-MOTORS · content/reference.js — the reference concept for Hyper Motors authors:
 * its depth, tone, numbers, tables, warnings, formulas and practical advice are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'dc-torque-speed', parent: 'dc-control', title: 'The DC motor torque–speed line', level: 2,
  short: 'A permanent-magnet DC motor slows down in a straight line as the load torque rises, from its no-load speed to a standstill at its stall torque. Its current rises along another straight line; its output power peaks halfway; its efficiency peaks at a light load. Two constants and a resistance describe it all.',
  keywords: ['DC motor', 'torque–speed curve', 'stall torque', 'no-load speed', 'torque constant', 'back-EMF constant', 'Kt', 'Ke', 'Kv', 'winding resistance', 'efficiency', 'maximum power', 'operating point', 'PMDC'],
  prereq: ['back-emf', 'torque-and-power', 'pmdc-motor'],
  related: ['pwm-speed-control', 'h-bridge', 'dc-motor-drivers', 'motor-heating', 'efficiency-losses', 'bldc-selection', 'electronics:dc-motor-control', 'physics:faradays-law'],
  body: `
Everything a permanent-magnet DC motor does follows from two equations. The winding has a resistance $R$, and turning in the magnets' field it generates a back-EMF proportional to its speed. So the supply voltage is shared between the resistance and the back-EMF:

$$V = R\\,I + K\\,\\omega$$

and the torque is proportional to the current:

$$T = K\\,(I - I_0)$$

$K$ is the motor constant: in SI units the **back-EMF constant** (V·s/rad) and the **torque constant** (N·m/A) are the same number, because the motor converts electrical power $K\\omega I$ into mechanical power $T\\omega$. $I_0$ is the small **no-load current** that overcomes friction and iron losses. Datasheets often give the speed constant $K_v$ in rpm per volt instead; $K = 60/(2\\pi K_v)$.

### The line
Eliminate the current and the speed falls in a straight line with torque — the motor's characteristic:

$$\\omega = \\frac{V - R\\,I_0}{K} - \\frac{R}{K^2}\\,T$$

It meets the axes at two points on every datasheet: the **no-load speed** $\\omega_0 \\approx V/K$ (no torque, almost no current) and the **stall torque** $T_s \\approx K V/R$ (no speed, stall current $V/R$). The slope $R/K^2$ says how much the motor slows under load: a stiff motor has a large $K$ and a small $R$. Double the voltage and the whole line moves outwards parallel to itself — speed doubles at every torque. That is why a DC motor's speed is controlled by its voltage, and in practice by [[pwm-speed-control|pulse-width modulation]].

### Power and efficiency along the line
The output power $P = T\\omega$ is zero at both ends and a parabola between them, peaking at half the stall torque and half the no-load speed: $P_{\\max} \\approx V^2/4R$. But at that point half the input power heats the winding — the efficiency is below 50 %. Efficiency peaks much nearer no-load: with the no-load current it is

$$\\eta_{\\max} = \\left(1 - \\sqrt{I_0 / I_s}\\right)^2$$

reached at a current $\\sqrt{I_0 I_s}$. A good small motor reaches 80–90 % at a torque of perhaps a tenth of stall. **Motors are rated for continuous operation near their efficiency peak, not at their power peak**, because the power peak cooks the winding.

| Operating point | Torque | Speed | Current | Efficiency | Use |
|---|---|---|---|---|---|
| No load | 0 | $\\omega_0$ | $I_0$ | 0 | — |
| Best efficiency | ≈ 5–15 % of $T_s$ | ≈ 85–95 % of $\\omega_0$ | $\\sqrt{I_0I_s}$ | highest | continuous duty |
| Rated (nameplate) | the torque it can give continuously without overheating | | | near the peak | continuous |
| Maximum power | $T_s/2$ | $\\omega_0/2$ | $\\approx I_s/2$ | < 50 % | short bursts only |
| Stall | $T_s$ | 0 | $I_s = V/R$ | 0 | an instant — then it burns |

### An example: a 24 V, 100 W motor
Take $V$ = 24 V, $R$ = 0.5 Ω, $K$ = 0.055 V·s/rad (a $K_v$ of 174 rpm/V) and $I_0$ = 0.25 A. The no-load speed is $(24 - 0.125)/0.055$ = 434 rad/s = 4145 rpm; the stall current 48 A and the stall torque $0.055 \\times 47.75$ = 2.6 N·m; the best efficiency $(1 - \\sqrt{0.25/48})^2$ = 86 %. At 0.25 N·m the current is 4.8 A, the speed 3750 rpm, the output 98 W and the efficiency 85 % — a sensible rated point. The winding then dissipates $I^2R$ = 11.5 W; at the 2.6 N·m stall it would dissipate 1150 W, which is why drivers limit the current.

### What the line leaves out
- **Heat:** copper's resistance rises about 0.4 % per °C, so a hot motor has a steeper line — slower under load and weaker at stall (see [[motor-heating]]).
- **Inductance:** the current cannot change instantly; it follows with the electrical time constant $L/R$ (milliseconds), while the speed follows with the mechanical time constant $JR/K^2$.
- **Brushes and commutation:** a small voltage drop across the brushes, sparking and wear at high current (see [[brushes-commutator]]).
- **Magnet limits:** very high currents can partly demagnetise the magnets — another reason to respect the peak current on the datasheet.

> [!warn] A stalled DC motor draws its full stall current — often ten to twenty times the rated current — and can overheat its winding in seconds. Size fuses and driver current limits for the rated current, not for the stall.

> [!key] A DC motor is a straight line: speed falls with torque from $V/K$ to zero, torque rises with current as $K$, and the voltage sets where the line sits. Run it near its efficiency peak, not its power peak.
`,
  ideas: [
    'Speed falls linearly with torque, from the no-load speed V/K to zero at the stall torque KV/R.',
    'In SI units the torque constant (N·m/A) equals the back-EMF constant (V·s/rad).',
    'Raising the voltage shifts the whole line outwards; that is how voltage (or PWM) controls speed.',
    'Maximum power comes at half stall torque and half speed, with under 50 % efficiency; best efficiency comes at light load.',
    'Stall current V/R is many times the rated current: limit the current, or the winding burns.'
  ],
  pitfalls: [
    'A motor should run at its maximum power point — That point wastes half the input as heat and overheats the winding; continuous duty belongs near the efficiency peak.',
    'Higher voltage gives more torque at every speed — It gives more speed at every torque; the torque per ampere (K) is fixed by the motor.',
    'The no-load current is wasted, so it does not matter — It sets the peak efficiency: a motor with a large friction or iron loss can never be efficient at light load.'
  ],
  formulas: [
    {
      name: 'Speed of a DC motor',
      expr: 'w = (V - R*I)/K', tex: '\\omega = \\dfrac{V - R\\,I}{K}',
      vars: {
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 0.5 },
        I: { name: 'current', q: 'current', unit: 'A', value: 4.8 },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 }
      },
      note: 'The back-EMF Kω takes what the resistance leaves of the supply voltage.',
      stories: { w: 'A {V} motor with R = {R} and K = {K} draws {I}. How fast does it turn?', I: 'A {V} motor with R = {R} and K = {K} turns at {w}. What current does it draw?' }
    },
    {
      name: 'Torque from current',
      expr: 'T = K*(I - I0)', tex: 'T = K\\,(I - I_0)',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        K: { name: 'torque constant', q: 'ktorque', unit: 'N·m/A', value: 0.055 },
        I: { name: 'current', q: 'current', unit: 'A', value: 4.8 },
        I0: { name: 'no-load current', q: 'current', unit: 'A', value: 0.25, tex: 'I_0' }
      },
      stories: { I: 'A motor with Kt = {K} and I₀ = {I0} must give {T}. What current does it need?' }
    },
    {
      name: 'Maximum output power',
      expr: 'P = V^2/(4*R)', tex: 'P_{\\max} = \\dfrac{V^2}{4R}',
      vars: {
        P: { name: 'maximum mechanical power', q: 'power', unit: 'W', tex: 'P_{\\max}' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 0.5 }
      },
      note: 'At half the stall torque and half the no-load speed, neglecting the no-load current — a peak, not a rating.',
      stories: { P: 'What is the most mechanical power a {V} motor of resistance {R} can deliver, however briefly?' }
    },
    {
      name: 'Efficiency',
      expr: 'eta = T*w/(V*I)', tex: '\\eta = \\dfrac{T\\,\\omega}{V\\,I}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m', value: 0.25 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3750, tex: '\\omega' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        I: { name: 'current', q: 'current', unit: 'A', value: 4.8 }
      },
      stories: { eta: 'A {V} motor draws {I} while giving {T} at {w}. How efficient is it?' }
    },
    {
      name: 'Mechanical time constant',
      expr: 'tau = J*R/K^2', tex: '\\tau_m = \\dfrac{J\\,R}{K^2}',
      vars: {
        tau: { name: 'mechanical time constant', q: 'time', unit: 'ms', tex: '\\tau_m' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·cm²', value: 1 },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 0.5 },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 }
      },
      note: 'The time to reach 63 % of the final speed after a voltage step (when the electrical time constant L/R is much shorter).',
      stories: { tau: 'A rotor and load of {J} on a motor with R = {R} and K = {K}: how quickly does it come up to speed?' }
    }
  ],
  examples: [
    {
      title: 'Reading a small motor\'s datasheet',
      q: 'A 12 V motor has a no-load speed of 6000 rpm and a stall current of 10 A. Estimate its motor constant, resistance and stall torque (ignore the no-load current).',
      steps: [
        '$\\omega_0 = 6000 \\times 2\\pi/60 = 628$ rad/s, so $K \\approx V/\\omega_0 = 12/628 = 0.0191$ V·s/rad.',
        '$R = V/I_s = 12/10 = 1.2$ Ω.',
        '$T_s = K I_s = 0.0191 \\times 10 = 0.19$ N·m.'
      ],
      a: 'K ≈ 0.019 N·m/A, R = 1.2 Ω, stall torque ≈ 0.19 N·m.'
    },
    {
      title: 'Where does it run with a given load?',
      q: 'The 24 V motor of the text (R = 0.5 Ω, K = 0.055, I₀ = 0.25 A) drives a fan needing 0.4 N·m. Find the speed, current and efficiency.',
      steps: [
        'Current: $I = T/K + I_0 = 0.4/0.055 + 0.25 = 7.52$ A.',
        'Speed: $\\omega = (24 - 0.5 \\times 7.52)/0.055 = 368$ rad/s = 3515 rpm.',
        'Output $0.4 \\times 368 = 147$ W; input $24 \\times 7.52 = 180$ W; efficiency 82 %.'
      ],
      a: '3515 rpm, 7.5 A, about 82 % efficient.'
    },
    {
      title: 'Halving the voltage',
      q: 'The same motor and load, but on 12 V. What happens?',
      steps: [
        'The current is set by the torque, so it stays 7.52 A.',
        '$\\omega = (12 - 3.76)/0.055 = 150$ rad/s = 1430 rpm — less than half, because the $RI$ drop is the same while the voltage halved.',
        'Output 60 W, input 90 W: efficiency falls to 66 %. A fan\'s torque would actually fall with speed too, so the real point moves further down its curve.'
      ],
      a: 'About 1430 rpm at the same 7.5 A; efficiency drops to about 66 %.'
    }
  ],
  quiz: [
    { q: 'A DC motor\'s load torque doubles. To a first approximation its current…', choices: ['doubles (plus the small no-load current)', 'halves', 'stays the same', 'quadruples'], a: 0, why: 'Torque is K times current: twice the torque needs twice the current above I₀.' },
    { q: 'Where on the torque–speed line is the output power greatest?', choices: ['At half the stall torque and half the no-load speed', 'At stall', 'At no load', 'At the rated point'], a: 0, why: 'P = Tω, and on a straight line from (0, ω₀) to (Ts, 0) the product is largest in the middle.' },
    { q: 'Why is a DC motor not run continuously at its maximum-power point?', choices: ['Half the input is lost as heat in the winding and it overheats', 'The speed is unstable there', 'The brushes cannot carry that current at all', 'The torque constant changes'], a: 0, why: 'At maximum power the resistive loss equals the output: efficiency is under 50 % and the heating is far above the continuous rating.' },
    { q: 'In SI units, how are the torque constant and the back-EMF constant related?', choices: ['They are equal', 'Kt = 2π Ke', 'Kt = Ke/60', 'They are unrelated'], a: 0, why: 'Power balance: the electrical power turned into motion, (Ke ω) I, equals the mechanical power (Kt I) ω.' },
    { q: 'A motor gets hot and its winding resistance rises. Under the same load it will…', choices: ['run a little slower', 'run a little faster', 'draw less current', 'give more stall torque'], a: 0, why: 'A larger R makes the line steeper: more voltage is lost in the winding, less is left for back-EMF, so the speed drops.' }
  ],
  problems: [
    { q: 'A 48 V motor has R = 0.2 Ω and K = 0.1 V·s/rad (ignore I₀). What is its stall torque?', answer: 24, unit: 'N·m', tol: 0.01, steps: ['Stall current $I_s = V/R = 48/0.2 = 240$ A.', '$T_s = K I_s = 0.1 \\times 240 = 24$ N·m.'] },
    { q: 'A motor has a no-load current of 0.3 A and a stall current of 30 A. What is its best possible efficiency?', answer: 81, unit: '%', tol: 0.01, steps: ['$\\eta_{\\max} = (1 - \\sqrt{0.3/30})^2 = (1 - 0.1)^2 = 0.81$.'] }
  ],
  choose: {
    good: [
      'Battery and 12/24/48 V equipment: speed set simply by voltage or PWM, high starting torque.',
      'Low-cost drives where brushes are acceptable: car accessories, small pumps, actuators, toys and hand tools.',
      'Gearmotors that must give strong torque at low speed from a small package.'
    ],
    avoid: [
      'Long continuous duty at high speed: brushes wear (often a few thousand hours in small motors) and spark — a [[bldc-motor|brushless motor]] lasts far longer.',
      'Explosive atmospheres and electrically quiet equipment: commutator sparking and interference.',
      'Accurate positioning without feedback: the speed sags with load — add an encoder, or use a stepper or servo.'
    ],
    check: [
      'The rated (continuous) torque and speed at your voltage — not the stall or maximum-power figures.',
      'The stall current against your driver\'s current limit and your fuse.',
      'The duty cycle and cooling: the winding temperature at your load.',
      'Brush life, acoustic noise and the interference your product may emit.',
      'The gear ratio that puts your load near the best-efficiency point.'
    ]
  },
  applications: [
    'Car window lifters, seat adjusters and wipers: permanent-magnet DC gearmotors on 12 V.',
    'Battery tools and toys: cheap brushed motors run near stall for short bursts, with the battery current as the real limit.',
    'Choosing a motor in [the motor lab](#/tools/motorlab): enter V, R and K and see the line, the efficiency and your operating point.'
  ],
  history: 'Thomas Davenport patented a battery-powered DC motor in 1837; Zénobe Gramme\'s ring-armature machine (1871) was the first practical industrial DC motor and generator. Permanent-magnet DC motors spread with ferrite magnets from the 1950s and rare-earth magnets from the 1970s, which made small, powerful motors cheap enough for every car and appliance.',
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: the definitions behind ratings and duty.',
    'Manufacturers\' datasheets for small DC motors list the same quantities: nominal voltage, no-load speed and current, stall torque and current, terminal resistance, torque constant, speed constant and the mechanical time constant.'
  ],
  sim: ['ref-dc-motor', 'ref-induction']
}

);
