/* HYPER-MOTORS · content/induction.js — three-phase induction motors: the rotating field, the squirrel cage, slip,
 * the torque–speed curve and design letters, the equivalent circuit and its tests, wound rotors, star and delta,
 * dual-voltage motors and reversing. Simulations in sims/induction.js (prefix im-). */
Hyper.add(

{
  id: 'rotating-field', parent: 'three-phase-induction', title: 'The rotating magnetic field', level: 1,
  short: 'Three coils set 120° apart round a stator and fed with three currents 120° apart in time make a magnetic field of constant strength that turns at the synchronous speed 120 f / p. It is the heart of every three-phase motor; swapping two supply lines reverses it, losing one stops it turning.',
  keywords: ['rotating magnetic field', 'synchronous speed', 'poles', 'pole pairs', 'phase sequence', 'three-phase', '120 f / p', 'single phasing', 'phase loss', 'space harmonics', 'magnetising current', 'Ferraris', 'Tesla'],
  prereq: ['force-on-conductor', 'magnetic-circuits', 'electronics:three-phase'],
  related: ['squirrel-cage', 'slip-and-speed', 'reversing-three-phase', 'single-phase-problem', 'synchronous-motor', 'pmsm-motor', 'motor-protection', 'physics:magnetic-field', 'math:phasors'],
  body: `
Put three identical coils round a steel ring, 120° apart, and feed them from the three phases of the mains. Each coil on its own makes a field that only pulses — it grows, shrinks, reverses and grows again fifty or sixty times a second, always along the coil's own axis. But the three pulses are a third of a cycle apart in time as well as in space, and their sum is something new: a field of **constant strength that turns steadily round the ring**. Nothing moves, yet there is a magnet spinning inside the stator. Induction motors, synchronous motors, PM servos and brushless motors all rest on this one trick.

### Three pulsing fields make one turning field
Let phase U's coil point along 0°, V's along 120° and W's along 240°, and let each carry $i = I_m\\cos(\\omega t - \\varphi)$ with $\\varphi$ = 0°, 120° and 240° — the same [[?phase]] shift as the coils. Each coil's field is a [[?vector]] along its own axis whose length follows its current. Add the three (the [[?sine-cosine|cosines]] do the work) and the result is

$$\\vec B = \\tfrac32\\,B_m\\,(\\cos\\omega t,\\ \\sin\\omega t)$$

a vector of fixed length $\\tfrac32 B_m$ turning at the supply's [[?angular-frequency]] $\\omega = 2\\pi f$. In the simulation the three thin arrows grow, shrink and flip, while their sum — the thick orange arrow — keeps its length and turns. Each phase contributes to the field all the time, which is one reason three-phase motors are smaller and smoother than single-phase ones.

### Poles and synchronous speed
The winding pattern U, V, W can repeat several times round the stator. With $p$ poles ($p/2$ north–south pairs) the field advances one pole pair per cycle of the supply, so it turns at the **synchronous speed**

$$n_s = \\frac{120\\,f}{p}\\ \\text{rpm}$$

Many IEC texts write $p$ for the number of pole *pairs* and $n_s = 60 f/p$: check which one a book or data sheet means.

| Poles | $n_s$ at 50 Hz | $n_s$ at 60 Hz | Rated speed at 50 Hz (≈ 7.5 kW) | Typical uses |
|---|---|---|---|---|
| 2 | 3000 rpm | 3600 rpm | 2900–2950 rpm | pumps, fans, compressors, blowers |
| 4 | 1500 rpm | 1800 rpm | 1440–1470 rpm | the general-purpose motor: conveyors, mixers, gearboxes |
| 6 | 1000 rpm | 1200 rpm | 960–975 rpm | slower fans, crushers, mills |
| 8 | 750 rpm | 900 rpm | 715–730 rpm | large slow fans and pumps |

More poles give a slower field and more torque for the same power — but a bigger, heavier and costlier motor, with a lower power factor. The rotor itself always runs a little below $n_s$ ([[slip-and-speed]]).

### Which way it turns
The field turns from the coil whose current peaks first towards the coil that peaks next, so its direction is set by the **phase sequence** of the supply, not by the motor. Swap any two supply lines and the field — and the motor — reverses: tick *Swap V and W* in the simulation. That is the whole secret of [[reversing-three-phase|reversing]].

### Losing a phase
If one line opens — a blown fuse, a burnt contactor tip, a loose terminal — the two remaining windings carry one and the same current in series. Their field no longer turns: it pulses along a fixed axis (picture it as two half-strength fields turning opposite ways). A stopped motor then cannot start: it hums, draws locked-rotor current and heats up. A running motor keeps turning, dragged by the forward half, but draws roughly 1.7–2 times its current in the two healthy lines at the same load and overheats within minutes. This **single-phasing** is one of the commonest causes of burnt windings; overload relays and motor-protective breakers with phase-loss sensitivity guard against it ([[motor-protection]]). Tick *Line W open* and watch the arrow stop turning and just pulse.

### Real windings
Real stators spread each phase over many slots (24 to 72 in small and medium motors) and short-pitch the coils, so that the field round the air gap is close to a sine wave. It is never perfect: leftover **space harmonics** — the 5th turning backwards at a fifth of the speed, the 7th forwards at a seventh — cause the dip in the starting torque ([[torque-slip-curve]]) and magnetic noise. Making the field costs a **magnetising current** that flows even at no load, because the flux must cross an air gap of a few tenths of a millimetre in small motors and 1–2 mm in large ones: typically about 60 % of the rated current in a 0.75 kW 4-pole motor, 35–40 % at 7.5 kW and 25–35 % at 75 kW. That is why a lightly loaded induction motor has a poor [[power-factor]].

> [!key] Three coils 120° apart, three currents 120° apart in time: the sum is a field of constant strength — 3/2 of one phase's peak — turning at 120 f / p rpm in the direction of the phase sequence.

> [!warn] Motor terminals and the supply to them carry mains voltage. Work on them only when qualified, with the supply isolated, locked off and proven dead; the motor's own nameplate and terminal-box diagram govern.
`,
  ideas: [
    'Three pulsing fields, displaced 120° in space and 120° in time, add up to one field of constant strength that turns.',
    'The rotating field is 3/2 times the peak field of one phase.',
    'Synchronous speed is 120 f / p rpm (p = number of poles): 1500 rpm for 4 poles at 50 Hz, 1800 rpm at 60 Hz.',
    'The phase sequence sets the direction: swap two lines and the field reverses.',
    'With one line lost the field only pulses: a stopped motor cannot start and a running one overheats.'
  ],
  pitfalls: [
    'The rotating field needs a rotating magnet or commutator — It is made by stationary coils alone; only the currents change.',
    'Swapping all three lines reverses the motor — Moving all three one place along keeps the same sequence; only swapping two of them reverses it.',
    'A motor that has lost a phase simply stops — A running motor keeps turning on two phases, drawing much more current, and burns out slowly unless protection trips it.'
  ],
  derivation: {
    title: 'Why the sum turns with constant length',
    steps: [
      { text: 'The three coil axes are unit vectors at 0°, 120° and 240°; each field is the peak field times the cosine of its current\'s phase:', tex: '\\vec B = B_m\\sum_{k=0}^{2}\\cos\\!\\left(\\omega t - \\tfrac{2\\pi k}{3}\\right)\\left(\\cos\\tfrac{2\\pi k}{3},\\ \\sin\\tfrac{2\\pi k}{3}\\right)' },
      { text: 'Use cos A cos B = ½[cos(A − B) + cos(A + B)] and the same for cos A sin B. The terms with (A + B) are three equal cosines 120° apart, which sum to zero.' },
      { text: 'The terms with (A − B) are all the same, cos ωt (or sin ωt), three times over, each with the factor ½:', tex: '\\vec B = \\tfrac32 B_m\\,(\\cos\\omega t,\\ \\sin\\omega t)' },
      { text: 'A vector whose components are a cosine and a sine of the same angle has constant length and points along that angle: it turns at ω, one revolution per cycle for two poles.' }
    ]
  },
  formulas: [
    {
      name: 'Synchronous speed',
      expr: 'ns = 120*f/p', tex: 'n_s = \\dfrac{120\\,f}{p}',
      vars: {
        ns: { name: 'synchronous speed', q: false, unit: 'rpm', tex: 'n_s' },
        f: { name: 'supply frequency', q: false, unit: 'Hz', value: 50 },
        p: { name: 'number of poles', int: true, value: 4, min: 2, max: 48 }
      },
      note: 'p counts poles, not pole pairs. The rotor of an induction motor runs a few per cent slower; a synchronous motor runs exactly at n_s.',
      stories: { ns: 'A {p}-pole motor is fed at {f}. How fast does its field turn?', p: 'A motor on {f} has a field turning at {ns}. How many poles has it?', f: 'A VFD must make the field of a {p}-pole motor turn at {ns}. What frequency must it output?' }
    },
    {
      name: 'Strength of the rotating field',
      expr: 'B = m*Bm/2', tex: 'B = \\dfrac{m}{2}\\,B_m',
      vars: {
        B: { name: 'amplitude of the rotating field', q: 'bfield', unit: 'T' },
        m: { name: 'number of phases (symmetrical winding)', int: true, value: 3, min: 2, max: 12 },
        Bm: { name: 'peak field of one phase alone', q: 'bfield', unit: 'T', value: 0.5, tex: 'B_m' }
      },
      note: 'For a symmetrical m-phase winding fed with balanced currents; three phases give 3/2.',
      stories: { B: 'Each of the {m} phases alone gives a peak air-gap field of {Bm}. How strong is the rotating field?', Bm: 'A {m}-phase motor needs a rotating air-gap field of {B}. What peak field must each phase make on its own?' }
    },
    {
      name: 'Electrical and mechanical angle',
      expr: 'the = p*thm/2', tex: '\\theta_e = \\dfrac{p}{2}\\,\\theta_m',
      vars: {
        the: { name: 'electrical angle', q: 'angle', unit: '°', tex: '\\theta_e' },
        p: { name: 'number of poles', int: true, value: 4, min: 2, max: 48 },
        thm: { name: 'mechanical angle', q: 'angle', unit: '°', value: 90, tex: '\\theta_m' }
      },
      note: 'One pole pair is 360 electrical degrees: a 4-pole field turns half a revolution per supply cycle.',
      stories: { the: 'The field of a {p}-pole motor has turned {thm} mechanically. How many electrical degrees is that?' }
    }
  ],
  examples: [
    {
      title: 'A 60 Hz machine in a 50 Hz country',
      q: 'A 4-pole pump motor rated 1750 rpm at 60 Hz is run on a 50 Hz supply (at a voltage reduced in proportion, so the flux stays right). Estimate its speed and what happens to the pump.',
      steps: [
        'At 60 Hz: $n_s = 120 \\times 60/4 = 1800$ rpm, so the rated slip is 50 rpm.',
        'At 50 Hz: $n_s = 120 \\times 50/4 = 1500$ rpm. With about the same slip in rpm at the same torque, it runs near 1455 rpm.',
        'A centrifugal pump\'s flow follows the speed and its head the square of the speed: flow falls by about 17 %, head by about 31 %.'
      ],
      a: 'About 1455 rpm; the pump delivers roughly a sixth less flow at two-thirds of the head.'
    },
    {
      title: 'Counting poles from a nameplate',
      q: 'A nameplate says 50 Hz, 965 rpm. How many poles has the motor, and what is its slip?',
      steps: [
        'The synchronous speed must be just above 965 rpm; $120 \\times 50/p$ gives 3000, 1500, 1000, 750 … for p = 2, 4, 6, 8.',
        'So $n_s$ = 1000 rpm and $p$ = 6.',
        'Slip $= (1000 - 965)/1000 = 3.5\\,\\%$.'
      ],
      a: 'Six poles, 3.5 % slip.'
    }
  ],
  quiz: [
    { q: 'Two of the three supply lines to a running motor are swapped. The field…', choices: ['reverses its direction of rotation', 'stops turning and only pulses', 'turns at twice the speed', 'is unchanged: the motor keeps its direction'], a: 0, why: 'Swapping two lines reverses the phase sequence, so the coil that used to peak next now peaks last: the field turns the other way.' },
    { q: 'What is the synchronous speed of a 2-pole motor on 60 Hz?', choices: ['3600 rpm', '1800 rpm', '3000 rpm', '7200 rpm'], a: 0, why: '120 × 60 / 2 = 3600 rpm.' },
    { q: 'A stopped three-phase motor has lost one line (a blown fuse). When it is switched on it will most likely…', choices: ['hum, draw a large current and not start', 'start normally but run slowly', 'start in the reverse direction', 'not draw any current'], a: 0, why: 'Two lines give a pulsating field with no preferred direction: no starting torque, but the locked-rotor current flows and heats the windings.' },
    { q: 'True or false: the strength of the rotating field of a balanced three-phase winding pulses at twice the supply frequency.', a: false, why: 'Its magnitude is constant, 3/2 of one phase\'s peak; only its direction changes. A single-phase winding\'s field is the one that pulses.' },
    { q: 'For the same output power, a 6-pole motor compared with a 2-pole motor…', choices: ['runs slower and must deliver three times the torque, so it is larger', 'runs faster and is smaller', 'runs at the same speed with a better power factor', 'needs a capacitor to start'], a: 0, why: 'Its field turns at a third of the speed; P = Tω means three times the torque, and torque sets the size of the rotor.' }
  ],
  problems: [
    { q: 'What is the synchronous speed of an 8-pole motor on a 50 Hz supply?', answer: 750, unit: 'rpm', tol: 0.01, steps: ['$n_s = 120 f/p = 120 \\times 50/8 = 750$ rpm.'] },
    { q: 'A 60 Hz motor is rated 1165 rpm. How many poles does it have?', answer: 6, tol: 0.001, steps: ['$120 \\times 60/p$ just above 1165 rpm: 1200 rpm for p = 6.', 'Slip (1200 − 1165)/1200 = 2.9 %, a normal value.'] },
    { q: 'Each phase of a three-phase winding alone would give a peak air-gap field of 0.55 T. How strong is the rotating field?', answer: 0.825, unit: 'T', tol: 0.01, steps: ['$B = \\tfrac32 B_m = 1.5 \\times 0.55 = 0.825$ T.'] }
  ],
  choose: {
    good: [
      'Any machine with a three-phase supply: the field starts the motor by itself, with no capacitor, brushes or electronics.',
      'Constant-speed drives — pumps, fans, conveyors, compressors — whose speed a pole number at 50/60 Hz suits (or a belt or gearbox matches).',
      'Variable speed with a [[vfd-principle|VFD]]: changing the frequency moves the field\'s speed smoothly.'
    ],
    avoid: [
      'Sites with only a single-phase supply: see [[single-phase-problem]], a VFD with single-phase input, or [[steinmetz-connection]] for small motors.',
      'Speeds no pole number gives at 50/60 Hz (2000 rpm, a 12 000 rpm spindle) without a gearbox or a drive.',
      'Loads damaged by running backwards, unless the phase sequence is checked at commissioning or watched by a phase-sequence relay.'
    ],
    check: [
      'The supply frequency and the pole number: together they fix the speed.',
      'The phase sequence at the motor terminals before the load is coupled.',
      'Phase-loss protection in the starter (overload relay or motor-protective breaker).',
      'The magnetising current and power factor at your real, often partial, load.'
    ]
  },
  applications: [
    'Every three-phase motor, from a 0.12 kW fan to a 20 MW compressor drive, and every VFD-fed motor, uses the rotating field.',
    'Phase-sequence relays and portable phase-rotation testers check the sequence before a motor is coupled to a load that must not reverse.',
    'Try the connections in [the three-phase wiring diagrams](#/tools/wiring/threephase) and the curves in [the induction motor lab](#/tools/motorlab/induction).'
  ],
  history: 'Galileo Ferraris in Turin made a rotating field from out-of-phase currents and published his analysis in 1888; Nikola Tesla\'s polyphase motor patents were granted the same year. Mikhail Dolivo-Dobrovolsky, working for AEG, built a three-phase motor with a cage rotor in 1889 and helped show three-phase transmission at the Lauffen–Frankfurt exhibition of 1891 — the design that still runs most of the world\'s machines.',
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.',
    'Hughes and Drury, *Electric Motors and Drives* — the chapter on induction motors: the rotating magnetic field and its speed.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery* — the MMF of distributed windings and the rotating field.'
  ],
  sim: 'im-rotating-field'
},

{
  id: 'squirrel-cage', parent: 'three-phase-induction', title: 'The squirrel-cage rotor', level: 1,
  short: 'Bars of aluminium or copper in a laminated steel rotor, shorted by rings at both ends: the rotating field induces the currents, so nothing is connected to the rotor and nothing wears but the bearings. The shape of the bars — shallow, deep, double cage or high-resistance — sets the starting torque, the starting current and the slip: the NEMA design letters A to D.',
  keywords: ['squirrel cage', 'cage rotor', 'rotor bars', 'end ring', 'die-cast aluminium', 'copper rotor', 'deep bar', 'double cage', 'skin effect', 'skew', 'NEMA design letter', 'design B', 'design C', 'design D', 'IEC design N', 'design H', 'broken rotor bar'],
  prereq: ['rotating-field', 'back-emf', 'physics:faradays-law'],
  related: ['torque-slip-curve', 'slip-and-speed', 'wound-rotor-motor', 'equivalent-circuit', 'dol-starting', 'motor-failures', 'maintenance-diagnostics', 'efficiency-classes', 'physics:lenzs-law'],
  body: `
The rotor of almost every industrial motor is a **squirrel cage**: a stack of steel laminations with bars in slots near its surface, the bars joined at both ends by short-circuiting rings. Take away the steel and the bars and rings look like a pet rodent's exercise wheel — hence the name. Nothing is connected to the rotor: the rotating field sweeps past the bars, induces a voltage in them ([[physics:faradays-law|Faraday's law]]), the voltage drives currents round the rings, and the field pushes on those currents. No brushes, no slip rings, no magnets — only the bearings wear.

### How it is built
| Part | What it is | Typical |
|---|---|---|
| Core | electrical-steel laminations, insulated from each other to stop eddy currents | 0.35–0.65 mm sheets |
| Bars | conductors in the rotor slots | die-cast aluminium in most motors up to a few hundred kW; brazed copper bars in large motors; die-cast copper in some premium small ones |
| End rings | short the bars at both ends, often cast with fan blades | same metal as the bars |
| Skew | slots twisted along the rotor by about one slot pitch | smoother torque, less noise and cogging |
| Slot numbers | rotor and stator slot counts chosen to differ | avoids locking at start, crawling and whine |

### The rotor-resistance dilemma
The bar resistance sets the motor's character. A **high** rotor resistance gives a strong start with a modest current, but the motor slips more under load, and the rotor losses — slip × the power crossing the air gap ([[slip-and-speed]]) — waste energy. A **low** resistance runs efficiently with little slip but starts weakly and draws a huge current. The designer gets both from the rotor frequency: at standstill the bar currents alternate at the supply frequency, 50 or 60 Hz; at full speed only at the slip frequency, 1–3 Hz.

### Deep bars and double cages
In a tall bar, current at 50 Hz crowds into the top, near the air gap, because the lower part is linked by more slot leakage flux; the current density falls off roughly [[?exponential|exponentially]] with depth. The **penetration depth**

$$\\delta = \\sqrt{\\frac{\\rho}{\\pi f_2 \\mu_0}}$$

is about 13 mm in warm aluminium at 50 Hz but 75 mm at 1.5 Hz. A 30 mm deep bar therefore uses mainly its top at start — its effective resistance more than doubles — while at running speed the current spreads over the whole bar. A **double cage** does the same on purpose: a small, high-resistance outer cage carries the starting current, while a large inner cage, sunk behind a narrow slit that gives it a high leakage reactance, takes over as the motor speeds up. In the simulation, pick a bar and move the speed: at standstill the colour gathers at the top of the bar; near full speed it evens out.

### Rotor design and design letters
| Rotor | Bars | Starting torque | Starting current | Breakdown torque | Rated slip | Typical loads |
|---|---|---|---|---|---|---|
| NEMA A | shallow, low resistance | ≈ 150–170 % | high, not limited | high, ≥ 250 % | 1–3 % | where a high inrush is acceptable |
| NEMA B ≈ IEC N | deep bars | ≈ 150–200 % | limited, ≈ 5–7 × | ≈ 200–280 % | 1–4 % | the general-purpose motor: fans, pumps, light conveyors |
| NEMA C ≈ IEC H | double cage | ≈ 200–250 % | limited | ≈ 190–225 % | 2–5 % | loaded conveyors, compressors, crushers |
| NEMA D | high-resistance bars (brass or resistive alloy) | ≥ 275 % | limited | at or near standstill | 5–13 % | flywheel presses, hoists, cranes |

Percentages are of rated torque, typical of medium 4-pole motors; the standards set minimum values by power and speed, and [[torque-slip-curve]] draws the curves.

### What goes wrong in real rotors
- **Broken bars** and cracked bar-to-ring joints, from thermal cycling in motors that start often or heavily, or from porosity in the casting. Symptoms: a slow beat in the current and hum at twice the slip frequency, speed hunting, weak starting; current-signature analysis shows sidebands at $(1 \\pm 2s)\\,f$ beside the supply line ([[maintenance-diagnostics]]).
- **Starting heat.** Every start leaves in the rotor at least the kinetic energy it gives the load, more when the load drags. A heavy fan can heat the bars by tens of kelvin in one start: data sheets limit starts per hour, hot restarts and load inertia.
- **Eccentricity** from worn bearings or a bent shaft: unbalanced magnetic pull, a rub, and vibration at twice the supply frequency ([[motor-vibration]]).

> [!tip] On a VFD the deep-bar effect hardly matters: the drive starts the motor at a few hertz, where the rotor frequency is low and the cage behaves like its running self — full torque from a modest current.

> [!key] The cage turns the rotating field into torque with no connections at all. Its bar shape trades starting torque and inrush against running slip and efficiency — and deep bars and double cages get the best of both by using the rotor frequency.
`,
  ideas: [
    'The cage has no connections: the rotating field induces the bar currents, so only the bearings wear.',
    'High rotor resistance means a strong start and high slip; low resistance means an efficient run and a weak start.',
    'At standstill the rotor frequency is the supply frequency; deep bars and double cages use this to raise the starting resistance.',
    'The skin (penetration) depth in aluminium is about 13 mm at 50 Hz and several times more at the slip frequency.',
    'NEMA design letters A–D (IEC designs N and H) name the rotor\'s starting and running character.'
  ],
  pitfalls: [
    'A cage rotor must have a low resistance to be any good — Too low a resistance gives a weak start and a huge inrush; the designer shapes the bars so the resistance is high at start and low when running.',
    'Broken rotor bars show up as a dead short or a blown fuse — The motor keeps running; the signs are a beating current, hunting speed, poor starting and sidebands at (1 ± 2s)f in the current spectrum.',
    'The starting heat in the rotor depends only on the motor — It grows with the load inertia: a no-load start leaves in the rotor as much energy as the kinetic energy it gives the load.'
  ],
  formulas: [
    {
      name: 'Penetration (skin) depth in a rotor bar',
      expr: 'delta = sqrt(rho/(pi*f2*mu0))', tex: '\\delta = \\sqrt{\\dfrac{\\rho}{\\pi f_2 \\mu_0}}',
      vars: {
        delta: { name: 'penetration depth', q: 'length', unit: 'mm', tex: '\\delta' },
        rho: { name: 'resistivity of the bar metal', q: 'resistivity', unit: 'µΩ·cm', value: 3.4, tex: '\\rho' },
        f2: { name: 'rotor frequency (s·f)', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_2' },
        mu0: { const: 'mu0' }
      },
      note: 'Warm aluminium ≈ 3.4 µΩ·cm, warm copper ≈ 2.1 µΩ·cm, brass ≈ 7 µΩ·cm. A bar much deeper than δ carries its current mainly in its top δ.',
      stories: { delta: 'How deep does a {f2} rotor current penetrate a bar of resistivity {rho}?', f2: 'At what rotor frequency does the current penetrate {delta} into a bar of resistivity {rho}?' }
    },
    {
      name: 'Resistance factor of a deep rectangular bar',
      expr: 'KR = xi*(sinh(2*xi) + sin(2*xi))/(cosh(2*xi) - cos(2*xi))', tex: 'K_R = \\xi\\,\\dfrac{\\sinh 2\\xi + \\sin 2\\xi}{\\cosh 2\\xi - \\cos 2\\xi}',
      vars: {
        KR: { name: 'AC resistance ÷ DC resistance', tex: 'K_R' },
        xi: { name: 'reduced bar height ξ = h/δ', value: 2.3, min: 0.05, max: 20, tex: '\\xi' }
      },
      note: 'For a rectangular bar of height h filling its slot. K_R ≈ 1 for ξ < 0.7 and ≈ ξ for ξ > 2: the current uses about one penetration depth.',
      stories: { KR: 'A rotor bar is {xi} penetration depths tall. By what factor does its resistance rise?', xi: 'A rotor bar must have {KR} times its DC resistance at standstill. How many penetration depths tall must it be?' }
    },
    {
      name: 'Bar temperature rise in one no-load start',
      expr: 'dT = J*ws^2/(2*m*c)', tex: '\\Delta T = \\dfrac{J\\,\\omega_s^2}{2\\,m\\,c}',
      vars: {
        dT: { name: 'temperature rise of the cage', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        J: { name: 'total inertia (rotor + load)', q: 'inertia', unit: 'kg·m²', value: 5 },
        ws: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega_s' },
        m: { name: 'mass of the cage (bars and rings)', q: 'mass', unit: 'kg', value: 2 },
        c: { name: 'specific heat of the cage metal', q: 'specificheat', unit: 'J/(kg·K)', value: 900 }
      },
      note: 'A no-load start leaves ½Jω_s² in the rotor. Adiabatic and cage-only: an upper bound for the bars, which soon share the heat with the iron. A loaded start adds more.',
      stories: { dT: 'A {J} fan on a motor whose field turns at {ws} is started direct on line. The cage weighs {m}. By how much can the bars heat up?', J: 'The cage ({m}, {c}) may heat by at most {dT} per start at {ws}. What total inertia can be started?' }
    }
  ],
  examples: [
    {
      title: 'A deep bar at start and at full speed',
      q: 'A 4-pole, 50 Hz motor has aluminium bars 30 mm deep (ρ ≈ 3.4 µΩ·cm warm). Compare the bar\'s effective resistance at standstill and at 3 % slip.',
      steps: [
        'At standstill $f_2 = 50$ Hz: $\\delta = \\sqrt{3.4\\times10^{-8}/(\\pi \\times 50 \\times 4\\pi\\times10^{-7})} = 13.1$ mm, so $\\xi = 30/13.1 = 2.29$.',
        '$K_R = 2.29\\,(\\sinh 4.58 + \\sin 4.58)/(\\cosh 4.58 - \\cos 4.58) \\approx 2.29 \\times 0.977 = 2.24$.',
        'At 3 % slip $f_2 = 1.5$ Hz: $\\delta = 13.1\\sqrt{50/1.5} = 76$ mm, $\\xi = 0.40$ and $K_R \\approx 1 + 4\\xi^4/45 = 1.002$.'
      ],
      a: 'The bar has about 2.2 times its DC resistance at start and practically its DC resistance when running.'
    },
    {
      title: 'Starting a heavy fan',
      q: 'A 7.5 kW 4-pole motor (50 Hz) starts a fan; motor and fan together have J = 5 kg·m². The aluminium cage weighs about 2 kg (c = 900 J/(kg·K)). Estimate the energy left in the rotor and the bars\' temperature rise.',
      steps: [
        '$\\omega_s = 1500 \\times 2\\pi/60 = 157.1$ rad/s.',
        'Rotor heat in a no-load start $= \\tfrac12 J\\omega_s^2 = 0.5 \\times 5 \\times 157.1^2 = 61.7$ kJ.',
        '$\\Delta T = 61\\,700/(2 \\times 900) = 34$ K for the bars alone — before the fan\'s own torque adds more.'
      ],
      a: 'About 62 kJ, enough to heat the bars by roughly 34 K per start: a few starts in a row reach the rotor\'s limit.'
    }
  ],
  quiz: [
    { q: 'Why does a deep-bar rotor give more starting torque than a shallow-bar rotor with the same running resistance?', choices: ['At standstill the rotor frequency is high, the current crowds into the top of the bars and the effective resistance rises', 'The deep bars hold more magnetism', 'The bars are connected to the supply at start', 'Deep bars reduce the air gap'], a: 0, why: 'The skin effect at 50/60 Hz raises the rotor resistance at start; at the 1–3 Hz slip frequency of running the current spreads out again.' },
    { q: 'Which rotor design suits a punch press with a large flywheel that gives up energy on every stroke?', choices: ['NEMA design D: high slip, maximum torque near standstill', 'NEMA design A: low slip, high inrush', 'NEMA design B: the general-purpose motor', 'Any design: the flywheel does not matter'], a: 0, why: 'The high slip lets the speed sag so the flywheel can release its energy, and the high torque at low speed re-accelerates it.' },
    { q: 'True or false: a squirrel-cage rotor needs brushes to carry current into its bars.', a: false, why: 'The currents are induced by the rotating field and flow round the end rings; nothing is connected to the rotor.' },
    { q: 'A motor on a 50 Hz supply runs at 3 % slip. At what frequency do its rotor bar currents alternate?', answer: 1.5, unit: 'Hz', why: 'f₂ = s·f = 0.03 × 50 = 1.5 Hz.' },
    { q: 'A motor drives a large fan and is started and stopped every few minutes. What usually limits how often it may start?', choices: ['The heat left in the rotor (and stator) by each start', 'The wear of the brushes', 'The magnetising current', 'The number of poles'], a: 0, why: 'Each start dumps at least ½Jω² into the rotor; data sheets give allowed starts per hour and maximum load inertia.' }
  ],
  problems: [
    { q: 'How deep does a 60 Hz current penetrate a warm copper bar (ρ = 2.1 µΩ·cm)?', answer: 9.4, unit: 'mm', tol: 0.02, steps: ['$\\delta = \\sqrt{\\rho/(\\pi f \\mu_0)} = \\sqrt{2.1\\times10^{-8}/(\\pi \\times 60 \\times 1.2566\\times10^{-6})}$.', '$= \\sqrt{8.87\\times10^{-5}} = 9.4\\times10^{-3}$ m = 9.4 mm.'] },
    { q: 'Motor and load have J = 1.2 kg·m²; the field turns at 1500 rpm. How much heat does a no-load direct-on-line start leave in the rotor?', answer: 14.8, unit: 'kJ', tol: 0.02, steps: ['$\\omega_s = 157.1$ rad/s.', '$E = \\tfrac12 J\\omega_s^2 = 0.5 \\times 1.2 \\times 157.1^2 = 14\\,800$ J = 14.8 kJ.'] }
  ],
  choose: {
    good: [
      'Almost every fixed-speed industrial drive: the cage has no wearing parts, shrugs off overloads and dirt, and costs least per kW.',
      'Design B (IEC N) for fans, centrifugal pumps and conveyors that start lightly loaded.',
      'Design C (IEC H) for conveyors and compressors that must start loaded; design D for flywheel presses, shears and hoists.'
    ],
    avoid: [
      'Very frequent starts or reversals of a large inertia straight on the mains: the rotor heat per start limits you — use a VFD, or a [[wound-rotor-motor|wound rotor]] for very large drives.',
      'Design D for continuous running: 5–13 % slip wastes that share of the air-gap power as rotor heat.',
      'Low-resistance, high-inrush rotors (design A, many IE3/IE4 motors) on weak supplies or with breakers sized for older motors.'
    ],
    check: [
      'Locked-rotor torque, pull-up torque and locked-rotor current against the load and the supply (data sheet, design letter or IEC design).',
      'Allowed starts per hour and the maximum load inertia for a start.',
      'The locked-rotor code letter or kVA against your fuses and breakers.',
      'On a VFD the design letter matters little; efficiency class and insulation for inverter duty matter more.'
    ]
  },
  applications: [
    'Die-cast aluminium cages in the millions of small and medium motors made each year; fabricated copper cages in large motors and in premium-efficiency designs.',
    'Motor current signature analysis finds broken bars in running motors from the (1 ± 2s)f sidebands.',
    'Compare starting behaviour in [the induction motor lab](#/tools/motorlab/induction).'
  ],
  history: 'Mikhail Dolivo-Dobrovolsky\'s three-phase motor of 1889 already had a cage rotor; its simplicity is why the induction motor, not the DC motor, became the workhorse of industry. Deep-bar and double-cage rotors were developed early in the twentieth century to give a strong start without slip rings, and die-casting the whole cage in aluminium made it cheap to mass-produce.',
  sources: [
    'IEC 60034-12, *Rotating electrical machines — Starting performance of single-speed three-phase cage induction motors* (designs N and H).',
    'NEMA MG 1, *Motors and Generators* — design letters A, B, C and D and the locked-rotor code letters.',
    'Chapman, *Electric Machinery Fundamentals* — induction motors: rotor design classes, deep-bar and double-cage rotors.',
    'Hughes and Drury, *Electric Motors and Drives* — the cage rotor, rotor resistance and starting.'
  ],
  sim: 'im-cage'
},

{
  id: 'slip-and-speed', parent: 'three-phase-induction', title: 'Slip and speed', level: 1,
  short: 'An induction motor always runs a little slower than its rotating field — the slip — because only a difference in speed induces current in the rotor. Slip grows almost in proportion to the load, sets the rotor frequency, and is a loss: the rotor turns the fraction s of the air-gap power into heat.',
  keywords: ['slip', 'synchronous speed', 'rated speed', 'rotor frequency', 'slip frequency', 'air-gap power', 'rotor copper loss', 'speed droop', 'load estimation', 'nameplate speed', 'slip compensation'],
  prereq: ['rotating-field', 'squirrel-cage', 'torque-and-power'],
  related: ['torque-slip-curve', 'equivalent-circuit', 'efficiency-losses', 'nameplate-reading', 'vfd-principle', 'v-over-f-control', 'wound-rotor-motor', 'load-torque-types'],
  body: `
An induction motor can never quite catch its own field. If the rotor turned at the synchronous speed, the field would stand still relative to the bars: no voltage would be induced in them, no current would flow and there would be no torque. So the rotor always lags a little — just enough for the bars to cut the field fast enough to make the torque the load asks for. That lag is the **slip**:

$$s = \\frac{n_s - n}{n_s}$$

### How much slip
| Motor (4-pole, 50 Hz) | Rated speed | Rated slip | Rotor frequency at rated load |
|---|---|---|---|
| 0.37 kW | 1370–1400 rpm | 7–9 % | 3.5–4.5 Hz |
| 0.75 kW | 1390–1430 rpm | 5–7 % | 2.5–3.5 Hz |
| 7.5 kW | 1450–1470 rpm | 2–3.5 % | 1–1.7 Hz |
| 75 kW | 1480–1490 rpm | 0.7–1.3 % | 0.3–0.7 Hz |
| 1 MW and more | 1490–1497 rpm | 0.2–0.7 % | 0.1–0.35 Hz |

Large motors slip less because their rotor resistance is small compared with their size — and a small slip means a small rotor loss, which is part of why they are more efficient. The simulation lets you compare a 0.75 kW, a 7.5 kW and a 75 kW motor.

### The slip frequency
The rotor currents alternate at the **slip frequency** $f_2 = s\\,f$, only 1.5 Hz in a 7.5 kW motor at 3 % slip. Tick *Ride with the field* in the simulation: seen from the field the rotor drifts slowly backwards, and the pattern of bar currents — red one way, blue the other — sweeps round the rotor once per slip cycle. A clamp meter on a rotor circuit, or the slow beat of a motor with a broken bar, shows the same low frequency.

### Slip grows with load
In the working region the torque is almost [[?proportional]] to the slip: double the torque, double the slip. The speed droops in a nearly straight line, from about 1498 rpm at no load to 1455 rpm at full load in a typical 4-pole motor. That makes a tachometer a cheap load meter: a motor with a nameplate speed of 1455 rpm running at 1475 rpm carries about (1500 − 1475)/(1500 − 1455) ≈ 56 % of its rated torque. IEC 60034-1 lets the real slip differ from the nameplate figure by up to about a fifth (more for small motors), and slip rises as the rotor warms, so such estimates are good to ±20 %.

### Slip is a loss
The power crossing the air gap, $P_{ag}$, splits in a fixed ratio: the fraction $s$ becomes heat in the rotor bars, the rest becomes mechanical power,

$$P_{cu2} = s\\,P_{ag}, \\qquad P_{mech} = (1 - s)\\,P_{ag}$$

A motor at 3 % slip turns 3 % of its air-gap power into rotor heat; the power-flow bar in the simulation follows every stage from the terminals to the shaft. It follows that **reducing speed by increasing slip wastes power**: run a constant-torque load at half speed with extra rotor resistance or a lowered voltage and half the air-gap power becomes heat. A [[vfd-principle|VFD]] lowers the speed of the field instead and keeps the slip small.

### What changes the slip
- **Voltage.** At a given slip the torque goes as $V^2$, so at a fixed load the slip goes roughly as $1/V^2$: 10 % undervoltage raises the slip by about 23 %, and the rotor loss and stator current with it.
- **Temperature.** The bar resistance rises about 0.4 % per kelvin and the slip with it: a hot motor runs a few rpm slower than a cold one.
- **Frequency.** On a VFD the slip in rpm stays roughly constant at a given torque, so at 10 Hz the same 40 rpm is a large part of the speed; drives offer slip compensation or vector control ([[v-over-f-control]]).

### Living with slip
- **Speed accuracy.** On the mains a cage motor holds its speed only within its slip — fine for pumps, fans and conveyors, not for machines that must hold an exact speed or ratio; use a drive with encoder feedback, or a synchronous or PM motor.
- **Load sharing.** Two motors on one belt share the load because each slows a little as it takes more — a gift of slip.
- **Rated torque** comes from the rated speed, not the synchronous one: $T = P/\\omega$, so 7.5 kW at 1460 rpm is 49 N·m.

> [!warn] Measure shaft speed with an optical (non-contact) tachometer through the guard or on a marked shaft end. Never remove guards from a running machine or reach near rotating shafts and couplings.

> [!key] Slip is the price of induction: no slip, no rotor current, no torque. It grows almost in proportion to the load, sets the rotor frequency s·f, and burns the fraction s of the air-gap power in the rotor.
`,
  ideas: [
    'The rotor must run slower than the field; the fractional difference is the slip s = (n_s − n)/n_s.',
    'Rated slip is 5–9 % in small motors and under 1 % in large ones.',
    'The rotor currents alternate at the slip frequency s·f, only a hertz or two in normal running.',
    'In the working region slip is nearly proportional to load torque, so speed droops slightly with load.',
    'The rotor loss is s times the air-gap power: speed control by adding slip wastes energy.'
  ],
  pitfalls: [
    'Slip is a fault or a sign of wear — Slip is how the motor makes torque; it is normal and rises with load. Only slip well above the nameplate value signals trouble (low voltage, overload, a broken cage).',
    'Rated torque is the power divided by the synchronous speed — Use the rated (nameplate) speed: T = P/ω at 1460 rpm, not 1500 rpm.',
    'Lowering the voltage is an efficient way to slow an induction motor — It slows it by increasing slip, and the fraction s of the air-gap power becomes rotor heat; only fan loads, whose torque falls with speed, tolerate it.'
  ],
  formulas: [
    {
      name: 'Slip',
      expr: 's = (ns - n)/ns', tex: 's = \\dfrac{n_s - n}{n_s}',
      vars: {
        s: { name: 'slip', q: 'ratio', unit: '%' },
        ns: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_s' },
        n: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 1460 }
      },
      stories: { s: 'A motor whose field turns at {ns} runs at {n}. What is its slip?', n: 'A motor with a synchronous speed of {ns} runs at a slip of {s}. How fast does the shaft turn?' }
    },
    {
      name: 'Rotor (slip) frequency',
      expr: 'f2 = s*f', tex: 'f_2 = s\\,f',
      vars: {
        f2: { name: 'frequency of the rotor currents', q: 'frequency', unit: 'Hz', tex: 'f_2' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 2.67 },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 }
      },
      stories: { f2: 'A motor on {f} runs at {s} slip. At what frequency do its rotor currents alternate?', s: 'The rotor currents of a motor on {f} alternate at {f2}. What is the slip?' }
    },
    {
      name: 'Rotor copper loss',
      expr: 'Pcu2 = s*Pag', tex: 'P_{cu2} = s\\,P_{ag}',
      vars: {
        Pcu2: { name: 'rotor copper (cage) loss', q: 'power', unit: 'W', tex: 'P_{cu2}' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 2.67 },
        Pag: { name: 'air-gap power', q: 'power', unit: 'kW', value: 7.77, tex: 'P_{ag}' }
      },
      note: 'The mechanical power is the rest: (1 − s)·P_ag, before friction and windage.',
      stories: { Pcu2: 'A motor transfers {Pag} across its air gap at {s} slip. How much heats the rotor?', s: 'A rotor dissipates {Pcu2} while {Pag} crosses the air gap. What is the slip?' }
    },
    {
      name: 'Shaft torque from power and speed',
      expr: 'T = P/w', tex: 'T = \\dfrac{P}{\\omega}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        P: { name: 'shaft power', q: 'power', unit: 'kW', value: 7.5 },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 1460, tex: '\\omega' }
      },
      note: 'With P in kW and n in rpm: T = 9550 P/n.',
      stories: { T: 'A motor is rated {P} at {w}. What is its rated torque?', P: 'A motor delivers {T} at {w}. What power is that?' }
    },
    {
      name: 'Slip at another voltage (same torque)',
      expr: 's2 = s1*(V1/V2)^2', tex: 's_2 = s_1 \\left(\\dfrac{V_1}{V_2}\\right)^2',
      vars: {
        s2: { name: 'slip at the new voltage', q: 'ratio', unit: '%', tex: 's_2' },
        s1: { name: 'slip at the rated voltage', q: 'ratio', unit: '%', value: 2.67, tex: 's_1' },
        V1: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_1' },
        V2: { name: 'actual voltage', q: 'voltage', unit: 'V', value: 360, tex: 'V_2' }
      },
      note: 'In the nearly linear working region, where torque ∝ s·V².',
      stories: { s2: 'A motor runs at {s1} slip on {V1}. The supply sags to {V2}; at the same load, what is the slip?' }
    }
  ],
  examples: [
    {
      title: 'Reading slip from a nameplate',
      q: 'A 4-pole motor is rated 7.5 kW, 50 Hz, 1460 rpm. Find the slip, the rotor frequency and the rated torque.',
      steps: [
        '$n_s = 120 \\times 50/4 = 1500$ rpm; $s = (1500 - 1460)/1500 = 2.67\\,\\%$.',
        '$f_2 = s f = 0.0267 \\times 50 = 1.33$ Hz.',
        '$T = P/\\omega = 7500/(1460 \\times 2\\pi/60) = 7500/152.9 = 49.1$ N·m.'
      ],
      a: 'Slip 2.67 %, rotor frequency 1.33 Hz, rated torque 49 N·m.'
    },
    {
      title: 'A tachometer as a load meter',
      q: 'The same motor is measured at 1475 rpm. Roughly what torque and power is it delivering?',
      steps: [
        'Slip now $(1500 - 1475)/1500 = 1.67\\,\\%$, against 2.67 % at rated torque.',
        'In the working region torque ∝ slip: $T \\approx 49.1 \\times 1.67/2.67 = 30.7$ N·m, about 63 % of rated.',
        '$P = T\\omega = 30.7 \\times 1475 \\times 2\\pi/60 = 4.74$ kW (±20 %, since the real slip may differ from the nameplate).'
      ],
      a: 'About 31 N·m and 4.7 kW — roughly 60 % load.'
    },
    {
      title: 'Where the rotor loss comes from',
      q: 'At rated load the motor delivers 7.5 kW and loses about 60 W in friction and windage. Find the air-gap power and the rotor copper loss.',
      steps: [
        'Mechanical power developed $P_{mech} = 7500 + 60 = 7560$ W.',
        '$P_{ag} = P_{mech}/(1 - s) = 7560/0.9733 = 7767$ W.',
        '$P_{cu2} = s P_{ag} = 0.0267 \\times 7767 = 207$ W.'
      ],
      a: 'About 7.77 kW crosses the gap; about 210 W heats the rotor.'
    }
  ],
  quiz: [
    { q: 'Why can an induction motor not reach its synchronous speed by itself?', choices: ['At synchronous speed the bars no longer cut the field, so no current is induced and there is no torque', 'Friction always prevents it', 'The supply frequency varies', 'The rotor would overheat'], a: 0, why: 'Torque needs rotor current, and rotor current needs relative motion between the field and the bars.' },
    { q: 'A 4-pole, 60 Hz motor runs at 1740 rpm. What is its slip (in %)?', answer: 3.33, unit: '%', why: 'n_s = 1800 rpm; s = 60/1800 = 3.33 %.' },
    { q: 'A 4-pole, 50 Hz motor runs at 1455 rpm at full load. If the load torque halves, it will run at about…', choices: ['1478 rpm', '1500 rpm', '1410 rpm', '1455 rpm — the speed is fixed by the frequency'], a: 0, why: 'Torque ∝ slip in the working region: half the torque, half the 45 rpm slip, so about 1477–1478 rpm.' },
    { q: 'True or false: slowing a constant-torque load to half speed by adding rotor resistance turns about half of the air-gap power into heat.', a: true, why: 'The rotor-circuit loss is s·P_ag; at half speed s = 0.5.' },
    { q: 'The supply voltage drops 10 %. At the same load torque the slip…', choices: ['rises by about 23 %', 'falls by 10 %', 'stays the same', 'rises by 10 %'], a: 0, why: 'Torque at a given slip ∝ V², so s ∝ 1/V² at constant torque: 1/0.81 = 1.23.' }
  ],
  problems: [
    { q: 'A 6-pole motor on 50 Hz runs at 970 rpm. At what frequency do its rotor currents alternate?', answer: 1.5, unit: 'Hz', tol: 0.02, steps: ['$n_s = 1000$ rpm, $s = 30/1000 = 3\\,\\%$.', '$f_2 = s f = 0.03 \\times 50 = 1.5$ Hz.'] },
    { q: '20 kW crosses the air gap of a motor running at 2 % slip. How much power heats the rotor?', answer: 400, unit: 'W', tol: 0.01, steps: ['$P_{cu2} = s P_{ag} = 0.02 \\times 20\\,000 = 400$ W.'] },
    { q: 'A motor is rated 55 kW at 1485 rpm. What is its rated torque?', answer: 353.7, unit: 'N·m', tol: 0.01, steps: ['$\\omega = 1485 \\times 2\\pi/60 = 155.5$ rad/s.', '$T = 55\\,000/155.5 = 353.7$ N·m.'] }
  ],
  choose: {
    good: [
      'Pumps, fans, compressors and conveyors, where a few per cent change of speed with load is harmless.',
      'Several motors sharing one load (long belts, multi-drive conveyors): slip shares the torque naturally.',
      'Flywheel loads that must give up energy: a high-slip motor lets the speed sag.'
    ],
    avoid: [
      'Processes that need an exact speed or ratio (winders, printing, synchronised lines) on the mains alone — use drives with feedback, or synchronous or PM motors.',
      'Speed control by adding slip (rotor resistance or voltage control) on constant-torque loads: the slip power is burnt.',
      'Very low speeds on a simple V/f drive without slip compensation: the slip becomes a large share of the speed.'
    ],
    check: [
      'The nameplate speed and its tolerance at your load and temperature.',
      'Whether the process tolerates the droop from no load to full load (about 1–7 %).',
      'The voltage at the motor terminals under load: low voltage means more slip, current and heat.',
      'On a drive: slip compensation, vector control or an encoder where speed must be held.'
    ]
  },
  applications: [
    'Estimating the load of pumps and fans in an energy audit from a speed measurement and the nameplate slip.',
    'Slip compensation in VFDs raises the output frequency with load so the shaft speed stays put.',
    'Try loads and voltages in [the induction motor lab](#/tools/motorlab/induction).'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: rated values and their tolerances, including slip.',
    'Hughes and Drury, *Electric Motors and Drives* — slip, rotor frequency and the power flow of the induction motor.',
    'Chapman, *Electric Machinery Fundamentals* — the power-flow diagram and the relation between air-gap power, rotor copper loss and slip.'
  ],
  sim: ['im-slip', 'ref-induction']
},

{
  id: 'torque-slip-curve', parent: 'three-phase-induction', title: 'The torque–speed curve', level: 2,
  short: 'From standstill to synchronous speed an induction motor\'s torque rises from the locked-rotor torque, dips to the pull-up torque, peaks at the breakdown torque and falls steeply to zero. Every torque goes as the square of the voltage; the rotor design (NEMA A–D, IEC N and H) shapes the curve; the gap between motor and load curves sets the run-up.',
  keywords: ['torque–speed curve', 'torque–slip curve', 'locked-rotor torque', 'starting torque', 'pull-up torque', 'breakdown torque', 'pull-out torque', 'Kloss formula', 'NEMA design', 'starting current', 'run-up time', 'accelerating torque', 'stall', 'crawling', 'voltage dip'],
  prereq: ['slip-and-speed', 'squirrel-cage', 'load-torque-types'],
  related: ['equivalent-circuit', 'wound-rotor-motor', 'dol-starting', 'star-delta-starting', 'soft-starters', 'motor-heating', 'motors-conveyors-hoists', 'motors-pumps-fans', 'inertia-reflected'],
  body: `
Plot an induction motor's torque against its speed, from standstill to synchronous speed, and you have the curve that decides whether a motor will start its load, how long it takes to get there and how much overload it can ride through. It has four landmarks:

| Point | Where | Typical (4-pole, medium size) | What it decides |
|---|---|---|---|
| Locked-rotor (starting) torque $T_{LR}$ | standstill | 150–250 % of rated | whether the load breaks away |
| Pull-up torque $T_{PU}$ | lowest point during run-up | 100–200 % | whether it gets through to speed |
| Breakdown (pull-out) torque $T_{max}$ | 10–30 % slip | 200–300 % | how much overload it survives |
| Rated torque $T_n$ | 1–5 % slip | 100 % | continuous duty |

Right of the breakdown point the curve is steep and almost straight: small changes of speed make big changes of torque, so the motor holds its speed — the stable **working region**. Left of it the torque falls as the motor slows: a load that drags the speed below breakdown makes it slow further and stall ("pull out"), drawing locked-rotor current.

### The shape in one formula
Neglecting the stator resistance, the curve follows the Kloss formula

$$T = \\frac{2\\,T_{max}}{s/s_m + s_m/s}$$

with $s_m$ the slip at breakdown. Near synchronous speed ($s \\ll s_m$) the torque is [[?proportional]] to slip; at large slip it falls as $1/s$. The breakdown slip is roughly the rotor resistance over the total leakage reactance, $s_m \\approx R_2'/(X_1 + X_2')$, but the breakdown torque itself does **not** depend on rotor resistance: more rotor resistance slides the peak towards standstill without lowering it — the trick of the [[wound-rotor-motor]].

### Voltage counts twice
Every torque on the curve is proportional to the square of the voltage: at 90 % voltage a motor has 81 % of its starting and breakdown torque, at 80 % only 64 %. A long cable or a small transformer that sags 15 % during a direct-on-line start takes 28 % off the starting torque exactly when it is needed. Star connection on a supply meant for delta gives $(1/\\sqrt3)^2 = 1/3$ — the basis of [[star-delta-starting]].

### Rotor design shapes the curve
Pick a design in the simulation ([[squirrel-cage]] shows the bars):
- **A** — low rotor resistance: modest starting torque, high inrush, high breakdown, low slip.
- **B ≈ IEC N** — deep bars: the general-purpose curve, with a margin everywhere.
- **C ≈ IEC H** — double cage: high starting torque, a flatter curve, lower breakdown.
- **D** — high resistance: the maximum at or near standstill, high slip — for flywheels and hoists.

The dip after starting comes mainly from the 7th space harmonic of the winding, which acts like a small motor with a synchronous speed of $n_s/7$: it helps below that speed and brakes above it. A heavily loaded conveyor can hang there and "crawl" at about a seventh of full speed. Untick *7th harmonic* to see the smooth textbook curve.

### Current, run-up and heat
The current curve is nearly flat from standstill to half speed at 5–8 times the rated current — 7–9 times in many IE3 and IE4 motors, whose low-resistance rotors raise the inrush (check breakers and fuses when replacing an old motor). The run-up time comes from the **accelerating torque**, the gap between the motor and load curves:

$$t \\approx \\frac{J\\,\\Delta\\omega}{T_{acc}}$$

A pump comes up in 0.5–2 s, a big fan with a heavy impeller in 10–30 s. The motor's permissible locked-rotor time (often 5–20 s from hot for medium motors) must exceed the run-up time, or the rotor overheats ([[dol-starting]], [[soft-starters]]).

### Matching the load
| Load | Torque with speed | Start | Advice |
|---|---|---|---|
| Fan, centrifugal pump | rises as speed² | easy | any design; watch run-up time with heavy impellers |
| Conveyor, screw pump, mixer | constant, breakaway 1.2–1.8 × running | medium | check $T_{LR}$ and $T_{PU}$ at the lowest voltage; design C if loaded |
| Crusher, loaded compressor | high breakaway | hard | design C, a soft starter with care, or a VFD |
| Flywheel press, shear, hoist | pulses, torque at low speed | hard | design D, or a VFD |

> [!tip] For a direct-on-line start, the motor curve must stay above the load curve at every speed, with a clear margin (many engineers ask for 10–20 % of rated torque), at the lowest voltage the supply will give during the start.

> [!key] Four numbers describe the curve — locked-rotor, pull-up, breakdown and rated torque. All scale with V². The motor runs on the steep part right of breakdown, and the area between motor and load curves is what accelerates the load.
`,
  ideas: [
    'The curve has four landmarks: locked-rotor, pull-up, breakdown and rated torque.',
    'The working region is the steep part between breakdown and synchronous speed; left of breakdown the motor stalls.',
    'All torques scale with the square of the voltage: a 10 % sag costs 19 % of torque.',
    'Rotor resistance moves the breakdown point without changing the breakdown torque.',
    'The accelerating torque (motor minus load) and the inertia set the run-up time and the rotor heat.'
  ],
  pitfalls: [
    'A motor with enough rated power will always start its load — Starting depends on the locked-rotor and pull-up torque at the actual (sagging) voltage, not on the rated power.',
    'The breakdown torque is a rating the motor can run at — It is a peak for brief overloads; beyond it the motor stalls, and running near it overheats the motor quickly.',
    'A fan is harder to start than a conveyor because it is big — A fan\'s torque is tiny at low speed; only its inertia makes the start long. A loaded conveyor needs full torque from standstill.'
  ],
  formulas: [
    {
      name: 'The Kloss formula',
      expr: 'T = 2*Tm/(s/sm + sm/s)', tex: 'T = \\dfrac{2\\,T_{max}}{s/s_m + s_m/s}',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        Tm: { name: 'breakdown torque', q: 'torque', unit: 'N·m', value: 137, tex: 'T_{max}' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 3.33, min: 0.01, max: 100 },
        sm: { name: 'slip at breakdown', q: 'ratio', unit: '%', value: 18, min: 0.1, max: 100, tex: 's_m' }
      },
      note: 'An approximation that neglects the stator resistance; good in the working region, rough at standstill. Solving for s gives two slips — the stable one is the smaller.',
      stories: { T: 'A motor has a breakdown torque of {Tm} at {sm} slip. What torque does it give at {s} slip?', s: 'A motor with a breakdown torque of {Tm} at {sm} slip drives a load of {T}. At what slip does it run?' }
    },
    {
      name: 'Torque at another voltage',
      expr: 'T2 = T1*(V2/V1)^2', tex: 'T_2 = T_1\\left(\\dfrac{V_2}{V_1}\\right)^2',
      vars: {
        T2: { name: 'torque at the actual voltage', q: 'torque', unit: 'N·m', tex: 'T_2' },
        T1: { name: 'torque at the rated voltage', q: 'torque', unit: 'N·m', value: 98, tex: 'T_1' },
        V1: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_1' },
        V2: { name: 'actual voltage at the terminals', q: 'voltage', unit: 'V', value: 340, tex: 'V_2' }
      },
      note: 'Holds for every point of the curve at the same slip (starting, pull-up, breakdown).',
      stories: { T2: 'A motor has {T1} of starting torque at {V1}. During the start the terminal voltage sags to {V2}. What starting torque is left?', V2: 'A load needs {T2} to break away; the motor gives {T1} at {V1}. What is the lowest terminal voltage that still starts it?' }
    },
    {
      name: 'Run-up time',
      expr: 't = J*dw/Ta', tex: 't = \\dfrac{J\\,\\Delta\\omega}{T_{acc}}',
      vars: {
        t: { name: 'run-up time', q: 'time', unit: 's' },
        J: { name: 'total inertia (motor + load, at the motor shaft)', q: 'inertia', unit: 'kg·m²', value: 1.2 },
        dw: { name: 'speed gained', q: 'angvel', unit: 'rpm', value: 1470, tex: '\\Delta\\omega' },
        Ta: { name: 'average accelerating torque (motor − load)', q: 'torque', unit: 'N·m', value: 60, tex: 'T_{acc}' }
      },
      stories: { t: 'Motor and load have {J}. With an average accelerating torque of {Ta}, how long does it take to reach {dw}?', Ta: 'A {J} load must reach {dw} within {t}. What average accelerating torque is needed?' }
    }
  ],
  examples: [
    {
      title: 'Where does the motor run?',
      q: 'A motor has a breakdown torque of 137 N·m at 18 % slip (4 poles, 50 Hz). Using the Kloss formula, at what speed does it carry its rated 49 N·m?',
      steps: [
        '$s/s_m + s_m/s = 2 \\times 137/49 = 5.59$. With $u = s/s_m$: $u + 1/u = 5.59$.',
        '$u = (5.59 - \\sqrt{5.59^2 - 4})/2 = (5.59 - 5.22)/2 = 0.185$ (the other root is the unstable point).',
        '$s = 0.185 \\times 0.18 = 3.3\\,\\%$, so $n = 1500 \\times (1 - 0.033) = 1450$ rpm.'
      ],
      a: 'About 3.3 % slip, 1450 rpm.'
    },
    {
      title: 'A start on a sagging supply',
      q: 'A design B motor has a locked-rotor torque of 200 % of rated. A loaded conveyor needs 160 % to break away. During the direct-on-line start the terminal voltage sags 15 %. Will it start?',
      steps: [
        'Available starting torque $= 200\\,\\% \\times 0.85^2 = 144.5\\,\\%$ of rated.',
        '144.5 % < 160 %: the conveyor does not break away; the motor sits at locked-rotor current until the overload trips.',
        'Cures: a bigger cable or transformer (less sag), a design C motor (≈ 250 % × 0.72 = 181 %), or a VFD, which gives full torque at start from a modest current.'
      ],
      a: 'No — only about 145 % is available; reduce the sag, use a high-torque design or a VFD.'
    },
    {
      title: 'Run-up of a fan',
      q: 'A fan and its 4-pole motor have J = 1.2 kg·m²; the average accelerating torque from standstill to 1470 rpm is about 60 N·m. How long is the start?',
      steps: [
        '$\\Delta\\omega = 1470 \\times 2\\pi/60 = 153.9$ rad/s.',
        '$t = J\\Delta\\omega/T_{acc} = 1.2 \\times 153.9/60 = 3.1$ s.'
      ],
      a: 'About 3 s — comfortably inside a typical permissible locked-rotor time.'
    }
  ],
  quiz: [
    { q: 'The supply voltage is 90 % of rated. The motor\'s breakdown torque is…', choices: ['81 % of its rated-voltage value', '90 %', '95 %', 'unchanged'], a: 0, why: 'Torque goes as V²: 0.9² = 0.81.' },
    { q: 'Where on the curve does an induction motor run stably?', choices: ['Between the breakdown point and synchronous speed', 'Between standstill and the breakdown point', 'Only exactly at the breakdown point', 'Anywhere on the curve'], a: 0, why: 'On the steep part a small slowdown raises the torque and restores the speed; left of breakdown a slowdown lowers the torque and the motor stalls.' },
    { q: 'Adding resistance to the rotor circuit of a wound-rotor motor…', choices: ['moves the breakdown torque towards standstill without changing its size', 'raises the breakdown torque', 'lowers the breakdown torque in proportion', 'changes only the synchronous speed'], a: 0, why: 's_m ∝ R₂ while T_max does not depend on R₂ — enough resistance puts the maximum torque at standstill.' },
    { q: 'True or false: a centrifugal fan needs more torque at the start than at full speed.', a: false, why: 'Its torque rises with the square of speed: almost none at standstill. Only its inertia makes the start long.' },
    { q: 'A load pulls a motor past its breakdown torque. The current…', choices: ['rises towards the locked-rotor current (5–8 × rated) as the motor stalls', 'falls to zero', 'stays at the rated value', 'falls to the no-load current'], a: 0, why: 'Stalling means large slip: the rotor impedance R₂/s falls and the current climbs to the locked-rotor value.' }
  ],
  problems: [
    { q: 'A motor gives 88 N·m of starting torque at 400 V. What does it give when the terminal voltage sags to 340 V during the start?', answer: 63.6, unit: 'N·m', tol: 0.01, steps: ['$T_2 = T_1 (V_2/V_1)^2 = 88 \\times (340/400)^2 = 88 \\times 0.7225 = 63.6$ N·m.'] },
    { q: 'A pump and motor (J = 0.5 kg·m²) accelerate to 1450 rpm with an average accelerating torque of 80 N·m. How long is the run-up?', answer: 0.95, unit: 's', tol: 0.02, steps: ['$\\Delta\\omega = 1450 \\times 2\\pi/60 = 151.8$ rad/s.', '$t = 0.5 \\times 151.8/80 = 0.95$ s.'] }
  ],
  choose: {
    good: [
      'Design B (IEC N) for fans, centrifugal pumps, machine tools and lightly loaded conveyors.',
      'Design C (IEC H) for conveyors, reciprocating compressors, crushers and mixers that start loaded.',
      'Design D for flywheel presses, shears and hoists that need torque at low speed and tolerate slip.'
    ],
    avoid: [
      'Direct-on-line starting on a weak supply where the voltage dip robs the motor of torque — use a soft starter, star–delta for light loads, or a VFD for heavy starts.',
      'Choosing by rated power alone for loads with a high breakaway torque.',
      'Running for long at speeds below breakdown: that region is unstable and very hot.'
    ],
    check: [
      'Motor torque above load torque at every speed, at the lowest supply voltage, with margin.',
      'Run-up time against the permissible locked-rotor (stall) time from hot.',
      'Starting current against breakers, fuses and the supply transformer.',
      'Breakdown torque against the largest overload the process can produce.'
    ]
  },
  applications: [
    'Checking a conveyor or crusher start before buying the motor, with the data-sheet curve and the load\'s breakaway torque.',
    'Motor-protection relays set their stall and start-time limits from the run-up time and the permissible locked-rotor time.',
    'Experiment with curves and loads in [the induction motor lab](#/tools/motorlab/induction) and with starters in [the starter diagrams](#/tools/wiring/starters).'
  ],
  sources: [
    'NEMA MG 1, *Motors and Generators* — locked-rotor, pull-up and breakdown torque, and the design letters.',
    'IEC 60034-12, *Starting performance of single-speed three-phase cage induction motors* — designs N and H.',
    'Chapman, *Electric Machinery Fundamentals* — the induction motor torque–speed characteristic and maximum torque.',
    'Hughes and Drury, *Electric Motors and Drives* — torque–slip curves, starting and run-up.'
  ],
  sim: 'im-torque-curve'
},

{
  id: 'equivalent-circuit', parent: 'three-phase-induction', title: 'The equivalent circuit', level: 3,
  short: 'Seen from one phase, an induction motor is a transformer with a spinning secondary: stator resistance and leakage, a magnetising branch, and a rotor branch whose resistance is divided by the slip. Three simple tests — DC resistance, no load, locked rotor — give its values, and it then predicts current, power factor, torque and efficiency at any load.',
  keywords: ['equivalent circuit', 'per-phase circuit', 'magnetising reactance', 'leakage reactance', 'R2/s', 'referred rotor', 'no-load test', 'locked-rotor test', 'blocked-rotor test', 'DC resistance test', 'core loss', 'air-gap power', 'autotune', 'motor parameters'],
  prereq: ['torque-slip-curve', 'power-factor', 'efficiency-losses', 'physics:transformers'],
  related: ['slip-and-speed', 'squirrel-cage', 'wound-rotor-motor', 'vfd-parameters', 'vector-control-vfd', 'motor-heating', 'electronics:impedance', 'electronics:phasors-ac', 'math:complex-numbers'],
  body: `
An induction motor is a transformer whose secondary winding spins. Seen from one phase of the supply, everything it does — current, power factor, torque and efficiency at any speed — follows from a small circuit of five or six elements. It is the model inside every data-sheet calculation, every motor-design program and every VFD that "autotunes" to its motor.

### The circuit
| Element | Stands for | 7.5 kW, 400 V, 4-pole motor (per phase, star) |
|---|---|---|
| $R_1$ | stator winding resistance | ≈ 0.7 Ω |
| $X_1$ | stator leakage reactance: flux that never reaches the rotor | ≈ 1.1 Ω |
| $X_m$ | magnetising reactance: the main field across the air gap | ≈ 45 Ω |
| $R_c$ | iron (core) loss, drawn in parallel with $X_m$ | ≈ 1 kΩ |
| $X_2'$ | rotor leakage reactance at supply frequency, referred to the stator | ≈ 1.6 Ω |
| $R_2'/s$ | rotor resistance divided by the slip, referred to the stator | $R_2'$ ≈ 0.55 Ω |

"Referred" means scaled by the square of the turns ratio, as for a transformer, so the rotor can be drawn on the stator's side. In per-unit terms (divided by $V^2/P$) medium motors have $R_1$ and $R_2'$ of a few hundredths, leakage reactances of 0.05–0.1 each and $X_m$ of 2–4.

### Why R₂ over s
At slip $s$ the field sweeps past the rotor at $s$ times synchronous speed, so the rotor voltage is $sE_2$ at frequency $sf$ and its leakage reactance is $sX_2$. With $j$ the [[?imaginary-unit]] of AC circuit maths ([[?complex-number|complex numbers]]):

$$I_2 = \\frac{sE_2}{R_2 + jsX_2} = \\frac{E_2}{R_2/s + jX_2}$$

— the same current as a standing rotor with resistance $R_2/s$. Split it as $R_2/s = R_2 + R_2(1-s)/s$: the first part is the real copper loss, the second a fictitious resistance whose "loss" is the mechanical power. At standstill ($s = 1$) it vanishes — no motion; at no load ($s \\to 0$) it is nearly an open circuit and only the magnetising current flows. Move the slip slider in the simulation and watch the rotor branch take over from the magnetising branch as the load grows. The torque follows from the air-gap power:

$$T = \\frac{3\\,I_2'^2 R_2'}{s\\,\\omega_s}$$

### Measuring the parameters
1. **DC resistance** between two terminals: for a star winding $R_1$ is half the reading, for delta 1.5 times it. Correct to working temperature (+0.39 %/K for copper).
2. **No-load test**: rated voltage and frequency, shaft uncoupled; measure $V$, $I_0$ and $P_0$. The current is almost all magnetising: $X_1 + X_m \\approx V_{ph}/I_0$. $P_0$ minus the stator copper loss is core loss plus friction and windage; repeating at falling voltages and extrapolating to zero voltage separates the friction.
3. **Locked-rotor test**: rotor blocked, voltage raised from zero until rated current flows — typically 15–25 % of rated voltage. Then $R_1 + R_2' = P/(3I^2)$ and $X_1 + X_2' = \\sqrt{Z^2 - R^2}$ with $Z = V_{ph}/I$. A rule of thumb splits the reactance by design: half and half for designs A and D and wound rotors, about 40 : 60 for B, 30 : 70 for C. Deep bars raise the rotor resistance at 50 Hz, so test standards recommend doing this test at reduced frequency, around a quarter of rated, to get the running value.

| Test | Readings (7.5 kW motor) | Result |
|---|---|---|
| DC | 1.40 Ω between two terminals (star) | $R_1$ = 0.70 Ω |
| No load | 400 V, 5.1 A, 330 W | $X_1 + X_m$ ≈ 45.3 Ω; core + friction ≈ 275 W |
| Locked rotor (at reduced frequency, scaled to 50 Hz) | 70 V, 13.5 A, 685 W | $R_1 + R_2'$ ≈ 1.25 Ω; $X_1 + X_2'$ ≈ 2.7 Ω |

> [!warn] These tests are made on live motors at mains or reduced voltage: only by qualified people, with the shaft guarded (no-load test) or the rotor securely clamped (locked-rotor test). A locked rotor heats fast even at reduced voltage — keep each reading brief.

### What the circuit says about real motors
- **Power factor at light load** is poor because $X_m$ draws its current whatever the load: cos φ 0.2–0.4 at no load, 0.8–0.9 at full load in medium motors ([[power-factor]]).
- **Efficiency** peaks at 75–100 % load and falls quickly below about 40 %: oversized motors waste energy ([[efficiency-losses]]).
- **Starting current** is set mainly by the leakage reactances: $I_{LR} \\approx V_{ph}/\\sqrt{(R_1 + R_2')^2 + (X_1 + X_2')^2}$.
- **What it misses**: saturation of the leakage paths at start (real starting currents run higher than the linear model), temperature, stray load losses, harmonics from a VFD and fast transients — for those, dynamic d–q models are used ([[vector-control-vfd]]).
- **VFD autotune** repeats these tests electrically: a stationary autotune injects DC and pulses to find $R_1$ and the leakage inductance; a rotating autotune measures the magnetising current at no load ([[vfd-parameters]]).

> [!key] One phase of an induction motor is a transformer with the load resistance R₂(1 − s)/s: the magnetising branch sets the no-load current and poor light-load power factor, the leakage reactances set the starting current, R₂/s sets the torque. Three tests measure it all.
`,
  ideas: [
    'Per phase, the motor is a transformer: R₁ + jX₁, a magnetising branch jX_m ∥ R_c, and a rotor branch R₂′/s + jX₂′.',
    'R₂′/s = R₂′ + R₂′(1 − s)/s: copper loss plus a resistance whose power is the mechanical output.',
    'Torque is the air-gap power divided by the synchronous angular speed: T = 3I₂′²R₂′/(sω_s).',
    'The no-load test gives the magnetising reactance and core loss; the locked-rotor test gives the resistances and leakage reactances.',
    'VFD autotuning measures the same parameters for vector control.'
  ],
  pitfalls: [
    'The no-load current is a sign of wasted power — It is mostly reactive magnetising current; its real power is only the core, friction and small copper losses.',
    'A locked-rotor test at 50 Hz gives the running rotor resistance — With deep bars it gives the much higher starting value; test at reduced frequency or correct for it.',
    'Line and phase values can be mixed freely — The circuit is per phase: use V/√3 for a star winding and convert delta measurements before calculating.'
  ],
  formulas: [
    {
      name: 'Torque from the rotor branch',
      expr: 'T = 3*I2^2*R2/(s*ws)', tex: 'T = \\dfrac{3\\,I_2^2 R_2}{s\\,\\omega_s}',
      vars: {
        T: { name: 'electromagnetic torque', q: 'torque', unit: 'N·m' },
        I2: { name: 'rotor current (referred)', q: 'current', unit: 'A', value: 12.2, tex: 'I_2' },
        R2: { name: 'rotor resistance (referred)', q: 'resistance', unit: 'Ω', value: 0.57, tex: 'R_2' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 3.23 },
        ws: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega_s' }
      },
      note: '3 I₂²R₂/s is the air-gap power of the three phases; divided by ω_s it is the torque.',
      stories: { T: 'A motor with a field at {ws} runs at {s} slip; each phase carries a referred rotor current of {I2} through {R2}. What torque does it develop?', I2: 'To develop {T} at {s} slip ({ws}, R₂ = {R2}), what referred rotor current is needed?' }
    },
    {
      name: 'No-load test: magnetising reactance',
      expr: 'X0 = V/(sqrt(3)*I0)', tex: 'X_0 = \\dfrac{V}{\\sqrt3\\,I_0}',
      vars: {
        X0: { name: 'no-load reactance X₁ + X_m (per phase, star)', q: 'resistance', unit: 'Ω', tex: 'X_0' },
        V: { name: 'line voltage', q: 'voltage', unit: 'V', value: 400 },
        I0: { name: 'no-load line current', q: 'current', unit: 'A', value: 5.1, tex: 'I_0' }
      },
      note: 'For a star-connected winding; the small resistive part is neglected.',
      stories: { X0: 'An uncoupled motor on {V} draws {I0}. What is X₁ + X_m per phase?' }
    },
    {
      name: 'Locked-rotor test: resistance',
      expr: 'Rlr = Plr/(3*Ilr^2)', tex: 'R_{LR} = \\dfrac{P_{LR}}{3\\,I_{LR}^2}',
      vars: {
        Rlr: { name: 'R₁ + R₂′ per phase', q: 'resistance', unit: 'Ω', tex: 'R_{LR}' },
        Plr: { name: 'input power, rotor locked', q: 'power', unit: 'W', value: 685, tex: 'P_{LR}' },
        Ilr: { name: 'line current, rotor locked', q: 'current', unit: 'A', value: 13.5, tex: 'I_{LR}' }
      },
      stories: { Rlr: 'With the rotor locked, a motor draws {Ilr} and {Plr}. What is R₁ + R₂′ per phase?' }
    },
    {
      name: 'Locked-rotor test: leakage reactance',
      expr: 'Xlr = sqrt((V/(sqrt(3)*I))^2 - Rlr^2)', tex: 'X_{LR} = \\sqrt{\\left(\\dfrac{V}{\\sqrt3\\,I}\\right)^2 - R_{LR}^2}',
      vars: {
        Xlr: { name: 'X₁ + X₂′ per phase', q: 'resistance', unit: 'Ω', tex: 'X_{LR}' },
        V: { name: 'line voltage, rotor locked', q: 'voltage', unit: 'V', value: 70 },
        I: { name: 'line current, rotor locked', q: 'current', unit: 'A', value: 13.5 },
        Rlr: { name: 'R₁ + R₂′ per phase', q: 'resistance', unit: 'Ω', value: 1.25, tex: 'R_{LR}' }
      },
      note: 'Star winding; split X_LR between stator and rotor by the design (≈ 40 : 60 for design B).',
      stories: { Xlr: 'A locked-rotor test gives {V}, {I} and R₁ + R₂′ = {Rlr}. What is X₁ + X₂′?' }
    }
  ],
  examples: [
    {
      title: 'From three tests to the circuit',
      q: 'A 7.5 kW, 400 V star motor (design B) gives: DC 1.40 Ω between two terminals; no load 400 V, 5.1 A; locked rotor (reduced-frequency test, scaled to 50 Hz) 70 V, 13.5 A, 685 W. Find R₁, R₂′, X₁, X₂′ and X_m.',
      steps: [
        '$R_1 = 1.40/2 = 0.70$ Ω.',
        'Locked rotor: $R_1 + R_2\' = 685/(3 \\times 13.5^2) = 1.25$ Ω, so $R_2\' = 0.55$ Ω. $Z = 70/(\\sqrt3 \\times 13.5) = 2.99$ Ω and $X_1 + X_2\' = \\sqrt{2.99^2 - 1.25^2} = 2.72$ Ω.',
        'Design B split 40 : 60: $X_1 = 1.09$ Ω, $X_2\' = 1.63$ Ω.',
        'No load: $X_1 + X_m = 400/(\\sqrt3 \\times 5.1) = 45.3$ Ω, so $X_m = 44.2$ Ω.'
      ],
      a: 'R₁ = 0.70 Ω, R₂′ = 0.55 Ω, X₁ ≈ 1.1 Ω, X₂′ ≈ 1.6 Ω, X_m ≈ 44 Ω — the values used in the simulation.'
    },
    {
      title: 'Torque and rotor loss from the circuit',
      q: 'At 3.23 % slip the referred rotor current is 12.2 A and R₂′ (with its small deep-bar rise) is 0.57 Ω. Find the torque, the air-gap power and the rotor copper loss (4 poles, 50 Hz).',
      steps: [
        '$\\omega_s = 157.1$ rad/s. $T = 3 \\times 12.2^2 \\times 0.57/(0.0323 \\times 157.1) = 254.5/5.07 = 50.2$ N·m.',
        '$P_{ag} = T\\omega_s = 50.2 \\times 157.1 = 7.89$ kW.',
        '$P_{cu2} = sP_{ag} = 0.0323 \\times 7890 = 255$ W.'
      ],
      a: 'About 50 N·m (rated), 7.9 kW across the gap, 255 W of rotor loss.'
    },
    {
      title: 'Estimating the starting current',
      q: 'With the same motor at standstill on 400 V, the deep bars roughly double R₂′ to 1.1 Ω. Estimate the starting current.',
      steps: [
        'Neglect the magnetising branch (it carries little at standstill): $Z \\approx \\sqrt{(0.70 + 1.1)^2 + (1.1 + 1.6)^2} = \\sqrt{3.24 + 7.29} = 3.25$ Ω.',
        '$I_{LR} \\approx 231/3.25 = 71$ A, about 5.3 times the 13.5 A rated current.'
      ],
      a: 'About 71 A — the simulation\'s full circuit gives 73 A.'
    }
  ],
  quiz: [
    { q: 'In the equivalent circuit, the power in the resistance R₂′(1 − s)/s is…', choices: ['the mechanical power developed by the rotor', 'the rotor copper loss', 'the core loss', 'the reactive power of magnetisation'], a: 0, why: 'R₂′/s splits into R₂′ (copper loss) and R₂′(1 − s)/s, whose power (1 − s)P_ag is the mechanical power.' },
    { q: 'In the no-load test the current drawn is mostly…', choices: ['magnetising current through X_m', 'rotor current', 'current that heats the stator', 'current for the friction losses'], a: 0, why: 'At near-zero slip the rotor branch is almost open; the current magnetises the iron and is mostly reactive.' },
    { q: 'Why is the locked-rotor test done at reduced voltage?', choices: ['At rated voltage the current would be 5–8 times rated and the windings would overheat in seconds', 'The motor cannot be locked at rated voltage', 'The magnetising reactance needs it', 'To find the no-load current'], a: 0, why: 'The aim is rated current with the rotor still, which takes only 15–25 % of rated voltage.' },
    { q: 'True or false: at standstill (s = 1) the fictitious "mechanical" resistance R₂′(1 − s)/s is zero.', a: true, why: 'No motion, no mechanical power: all the air-gap power heats the rotor.' },
    { q: 'Why does a lightly loaded induction motor have a poor power factor?', choices: ['The magnetising current through X_m is about the same at every load, and dominates when the load current is small', 'The rotor resistance becomes reactive', 'The slip becomes negative', 'The core loss vanishes'], a: 0, why: 'The reactive magnetising current stays; the active load current shrinks, so the current lags more.' }
  ],
  problems: [
    { q: 'A locked-rotor test on a star motor reads 80 V, 15 A and 900 W. What is R₁ + R₂′ per phase?', answer: 1.333, unit: 'Ω', tol: 0.01, steps: ['$R = P/(3I^2) = 900/(3 \\times 225) = 1.333$ Ω.'] },
    { q: 'An uncoupled star motor on 400 V draws 6.0 A. What is X₁ + X_m per phase?', answer: 38.5, unit: 'Ω', tol: 0.01, steps: ['$X_0 = V/(\\sqrt3 I_0) = 400/(1.732 \\times 6.0) = 38.5$ Ω.'] }
  ],
  choose: {
    good: [
      'Predicting current, power factor, torque and efficiency at any load or voltage from a few test values.',
      'Checking a rewound or repaired motor: the tests reveal shorted turns, a damaged cage or a wrong connection.',
      'Setting up vector-controlled drives: stator resistance, leakage and magnetising current come from the same circuit.'
    ],
    avoid: [
      'Fast transients (short circuits, reclosing, current-controller design): use a dynamic d–q model.',
      'Starting currents and torques from running parameters without the deep-bar correction.',
      'Test results used without correcting for the winding temperature.'
    ],
    check: [
      'Whether values are per phase of star or delta, and whether readings are line or phase quantities.',
      'The winding temperature during each test.',
      'The test frequency of the locked-rotor test on deep-bar rotors.',
      'Safety: guarded shaft, clamped rotor, qualified staff, brief locked-rotor readings.'
    ]
  },
  applications: [
    'Motor data sheets and motor-selection software compute their load curves (current, cos φ, efficiency) from this circuit.',
    'Repair shops compare no-load and locked-rotor readings before and after a rewind.',
    'VFD autotuning identifies R₁, leakage inductance and magnetising current for sensorless vector control; try the circuit in [the induction motor lab](#/tools/motorlab/induction).'
  ],
  history: 'The per-phase circuit, and the habit of solving AC machines with complex numbers, owe much to Charles Proteus Steinmetz, who worked out the theory of alternating currents and of the induction motor in the 1890s.',
  sources: [
    'IEEE Std 112, *IEEE Standard Test Procedure for Polyphase Induction Motors and Generators* — no-load, locked-rotor and resistance tests.',
    'IEC 60034-2-1, *Rotating electrical machines — Standard methods for determining losses and efficiency from tests*.',
    'Chapman, *Electric Machinery Fundamentals* — the induction motor equivalent circuit and determining its parameters.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery* — the polyphase induction machine and its equivalent circuit.'
  ],
  sim: 'im-equivalent-circuit'
},

{
  id: 'wound-rotor-motor', parent: 'three-phase-induction', title: 'The wound-rotor (slip-ring) motor', level: 2,
  short: 'An induction motor whose rotor carries a three-phase winding brought out through slip rings to external resistors. Adding resistance moves the breakdown torque to standstill — full torque at start with a modest current — and can lower the speed, at the cost of burning the slip power. Once common on cranes and mills; today it survives on very large, heavy starts and as the doubly-fed wind generator.',
  keywords: ['wound rotor', 'slip ring motor', 'slip rings', 'brushes', 'rotor resistance', 'rotor starter', 'liquid resistance starter', 'rotor voltage', 'rotor current', 'speed control', 'slip energy recovery', 'Kramer drive', 'doubly-fed induction generator', 'DFIG'],
  prereq: ['torque-slip-curve', 'equivalent-circuit', 'squirrel-cage'],
  related: ['slip-and-speed', 'dol-starting', 'soft-starters', 'vfd-principle', 'motors-conveyors-hoists', 'brushes-commutator', 'motor-heating', 'hazardous-areas'],
  body: `
A wound-rotor (slip-ring) motor has the stator of any induction motor, but its rotor carries a three-phase winding instead of a cage. The winding — usually star-connected — is brought out through three **slip rings** on the shaft, where carbon or metal-graphite brushes connect it to external resistors. With the rings shorted it runs like a cage motor; with resistance added it becomes a motor whose starting torque, starting current and speed can be set from outside.

### Why add resistance
The rotor resistance sets the slip at which the breakdown torque occurs, $s_m \\approx R_2/X_2$, but not the breakdown torque itself ([[torque-slip-curve]]). Add enough external resistance per phase that $s_m = 1$ and the motor gives its full breakdown torque — two to three times rated — at standstill, while the added resistance holds the starting current to perhaps 1.5–3 times rated instead of 6–8. Short the resistance in steps as the motor speeds up and each step puts it on a new curve whose peak lies nearer full speed. In the simulation, press *Start from rest* with the automatic starter: the operating point climbs from curve to curve, the current swinging between two limits.

| Starting method | Starting current | Starting torque | Suits |
|---|---|---|---|
| Cage, direct on line | 5–8 × rated | 1.5–2.5 × rated | most drives |
| Cage, star–delta | ≈ 1/3 of DOL | ≈ 1/3 of DOL | light starts |
| Wound rotor with a resistance starter | ≈ 1.5–3 × rated, set by the steps | up to the breakdown torque | heavy, high-inertia starts on weak supplies |
| Cage on a VFD | ≈ 1–1.5 × rated | 1.5–2 × rated | almost anything, with speed control |

### Resistors, contactors and liquid starters
Small and medium starters use metal grid or wire-wound resistors in three to six steps, shorted by contactors on timers or current relays. Large motors — hundreds of kilowatts to several megawatts on mills, crushers and big fans — often use **liquid resistance starters**: electrodes moving in a tank of electrolyte, giving a smooth resistance that falls as the motor accelerates. Up to speed, the rings are shorted by a contactor or by a brush-lifting, short-circuiting gear on the motor, which also saves brush wear.

### Speed control, and its cost
Leave resistance in and the motor runs at a higher slip for the same torque: at constant torque the slip grows in proportion to the rotor-circuit resistance. Cranes, hoists and some fans were controlled like this for decades. But the rotor-circuit loss is $s\\,P_{ag}$ ([[slip-and-speed]]): at 70 % speed on a constant-torque load, 30 % of the air-gap power heats the resistors, which must be rated and ventilated for it. **Slip-energy recovery** drives (the static Kramer and Scherbius schemes) rectify the rotor power and return it to the mains instead. Many wind turbines use the same idea as **doubly-fed induction generators**: a converter in the rotor circuit, rated for only about a quarter to a third of the machine's power, because the speed range is limited to roughly ±30 % around synchronous.

### On the nameplate
Besides the stator data, the nameplate gives the **rotor voltage** — the open-circuit voltage between the slip rings at standstill, often a few hundred volts — and the **rotor current** at full load. Resistors, cables, contactors and slip-ring gear are sized from them. The ring voltage falls in proportion to slip, $E_{2s} = sE_{20}$: 200 V at standstill is 6 V at 3 % slip.

### In service
Brushes wear and shed carbon dust; rings groove and spark and need inspection every few months in hard service. Wound rotors cost more than cages, need maintenance, and waste energy whenever resistance is left in circuit; most have been replaced by cage motors with soft starters or VFDs. They survive where a very large motor must start a very heavy load on a supply that cannot stand the inrush, on older cranes, hoists and mills, and in doubly-fed generators.

> [!warn] With the stator energised and the rotor circuit open, the full rotor voltage appears at the slip rings and resistor terminals. Never open the rotor circuit of an energised motor; isolate and lock off both the stator supply and the resistor bank before touching brushes, rings or resistors — and let resistor grids cool, they stay hot long after a start.

> [!key] Rotor resistance moves the breakdown torque along the speed axis without shrinking it: a wound rotor can start with its maximum torque at a modest current. Speed control by resistance works but burns the fraction s of the air-gap power.
`,
  ideas: [
    'A wound rotor brings its three-phase winding out through slip rings to external resistance.',
    'Enough rotor resistance puts the breakdown torque at standstill: maximum starting torque at low current.',
    'Stepping the resistance out gives a family of curves; the motor climbs from one to the next.',
    'At constant torque, slip is proportional to rotor-circuit resistance — and the slip power is burnt.',
    'Slip-energy recovery and doubly-fed generators return the rotor power instead of burning it.'
  ],
  pitfalls: [
    'More rotor resistance means more maximum torque — The maximum stays the same; only the speed at which it occurs moves.',
    'Speed control with rotor resistors is efficient because the stator current is unchanged — The rotor-circuit loss is s × air-gap power: at 70 % speed and constant torque, 30 % is burnt.',
    'An open rotor circuit is safe because no current flows — The full rotor voltage stands at the rings, and the motor has no torque to hold its load.'
  ],
  formulas: [
    {
      name: 'Slip at maximum torque with added resistance',
      expr: 'sm = (R2 + Rx)/X2', tex: 's_m = \\dfrac{R_2 + R_x}{X_2}',
      vars: {
        sm: { name: 'slip at breakdown torque', q: 'ratio', unit: '%', tex: 's_m' },
        R2: { name: 'rotor winding resistance per phase', q: 'resistance', unit: 'Ω', value: 0.06, tex: 'R_2' },
        Rx: { name: 'external resistance per phase', q: 'resistance', unit: 'Ω', value: 0.1, tex: 'R_x' },
        X2: { name: 'rotor leakage reactance at standstill', q: 'resistance', unit: 'Ω', value: 0.4, tex: 'X_2' }
      },
      note: 'All on the rotor side (or all referred). Neglects the stator impedance, so it overestimates s_m; s_m = 100 % puts the maximum torque at standstill.',
      stories: { sm: 'A rotor with {R2} and {X2} per phase has {Rx} added. At what slip is its torque greatest?', Rx: 'A rotor has {R2} and {X2} per phase. What external resistance puts the maximum torque at a slip of {sm}?' }
    },
    {
      name: 'Slip with added resistance at the same torque',
      expr: 's2 = s1*(R2 + Rx)/R2', tex: 's_2 = s_1\\,\\dfrac{R_2 + R_x}{R_2}',
      vars: {
        s2: { name: 'slip with the resistance', q: 'ratio', unit: '%', tex: 's_2' },
        s1: { name: 'slip with the rings shorted', q: 'ratio', unit: '%', value: 3, tex: 's_1' },
        R2: { name: 'rotor winding resistance per phase', q: 'resistance', unit: 'Ω', value: 0.06, tex: 'R_2' },
        Rx: { name: 'external resistance per phase', q: 'resistance', unit: 'Ω', value: 0.24, tex: 'R_x' }
      },
      note: 'The torque depends on R/s, so the same torque needs the same R/s.',
      stories: { s2: 'A slip-ring motor carries its load at {s1} with the rings shorted. With {Rx} per phase added to its {R2} rotor, what is the slip?', Rx: 'A motor slips {s1} with its {R2} rotor shorted. What resistance per phase makes it slip {s2} at the same torque?' }
    },
    {
      name: 'Slip-ring voltage',
      expr: 'E2s = s*E20', tex: 'E_{2s} = s\\,E_{20}',
      vars: {
        E2s: { name: 'rotor voltage between rings (open circuit) at slip s', q: 'voltage', unit: 'V', tex: 'E_{2s}' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 3 },
        E20: { name: 'rotor voltage at standstill (nameplate)', q: 'voltage', unit: 'V', value: 200, tex: 'E_{20}' }
      },
      stories: { E2s: 'A motor has a nameplate rotor voltage of {E20}. What open-circuit voltage appears between the rings at {s} slip?' }
    },
    {
      name: 'Power in the rotor resistors',
      expr: 'Px = 3*I2^2*Rx', tex: 'P_x = 3\\,I_2^2 R_x',
      vars: {
        Px: { name: 'power dissipated in the external resistors', q: 'power', unit: 'W', tex: 'P_x' },
        I2: { name: 'rotor current', q: 'current', unit: 'A', value: 24, tex: 'I_2' },
        Rx: { name: 'external resistance per phase', q: 'resistance', unit: 'Ω', value: 0.24, tex: 'R_x' }
      },
      stories: { Px: 'A rotor current of {I2} flows through {Rx} per phase. How much power heats the resistor bank?' }
    }
  ],
  examples: [
    {
      title: 'Resistance for maximum torque at start',
      q: 'A wound rotor has R₂ = 0.06 Ω and X₂ = 0.40 Ω per phase (rotor side, 50 Hz). Roughly what external resistance per phase gives maximum torque at standstill?',
      steps: [
        'We want $s_m = (R_2 + R_x)/X_2 = 1$, so $R_x = X_2 - R_2 = 0.40 - 0.06 = 0.34$ Ω.',
        'The stator impedance, neglected here, lowers the true value somewhat; starters are set up from the maker\'s data and adjusted by test.'
      ],
      a: 'About 0.34 Ω per phase.'
    },
    {
      title: 'Slowing a load with rotor resistance',
      q: 'The motor (4 poles, 50 Hz) carries a constant 50 N·m at 3 % slip with its rings shorted (R₂ = 0.06 Ω). With 0.24 Ω added per phase, find the speed and the power heating the resistors.',
      steps: [
        '$s_2 = 3\\,\\% \\times (0.06 + 0.24)/0.06 = 15\\,\\%$, so $n = 1500 \\times 0.85 = 1275$ rpm.',
        'At constant torque the air-gap power stays $T\\omega_s = 50 \\times 157.1 = 7.85$ kW.',
        'Rotor-circuit loss $s P_{ag} = 0.15 \\times 7.85 = 1.18$ kW, of which the resistors take $0.24/0.30$ = 80 %: about 0.94 kW. The shaft gives $0.85 \\times 7.85 \\approx 6.7$ kW.'
      ],
      a: 'About 1275 rpm, with roughly 0.94 kW burnt in the resistors.'
    }
  ],
  quiz: [
    { q: 'Why is a wound-rotor motor started with resistance in its rotor circuit?', choices: ['To give high starting torque with a low starting current', 'To raise the synchronous speed', 'To improve the running efficiency', 'Because the rotor would otherwise not turn'], a: 0, why: 'The resistance moves the breakdown torque towards standstill and limits the current.' },
    { q: 'True or false: adding rotor resistance increases the breakdown torque.', a: false, why: 'The breakdown torque does not depend on rotor resistance; only the slip at which it occurs changes.' },
    { q: 'A wound-rotor motor drives a constant-torque load at 70 % of synchronous speed using rotor resistors. Roughly what share of the air-gap power heats the rotor circuit?', choices: ['30 %', '70 %', '3 %', 'none — it is returned to the mains'], a: 0, why: 'Rotor-circuit loss = s × P_ag, and s = 0.3.' },
    { q: 'What does the rotor voltage on a slip-ring motor\'s nameplate mean?', choices: ['The open-circuit voltage between the slip rings with the rotor at standstill', 'The voltage to apply to the rings to start it', 'The voltage between rings at full load', 'The stator voltage in delta'], a: 0, why: 'It is the standstill, open-circuit value; it falls in proportion to slip as the motor speeds up.' },
    { q: 'In a doubly-fed wind generator the rotor converter is rated at only a fraction of the machine\'s power because…', choices: ['it handles only the slip power, and the speed range is limited to about ±30 %', 'the rotor carries no current', 'the stator is disconnected', 'the converter works only at start'], a: 0, why: 'The slip power is about s × P, so a limited slip range needs a converter of about that fraction of the rating.' }
  ],
  problems: [
    { q: 'A wound rotor has R₂ = 0.05 Ω and X₂ = 0.35 Ω per phase. Roughly what external resistance per phase puts the maximum torque at standstill?', answer: 0.3, unit: 'Ω', tol: 0.01, steps: ['$R_x = X_2 - R_2 = 0.35 - 0.05 = 0.30$ Ω.'] },
    { q: 'During a start a rotor current of 120 A flows through 0.5 Ω per phase of external resistance. How much power heats the resistor bank?', answer: 21.6, unit: 'kW', tol: 0.01, steps: ['$P_x = 3 I_2^2 R_x = 3 \\times 120^2 \\times 0.5 = 21\\,600$ W = 21.6 kW.'] }
  ],
  choose: {
    good: [
      'Very large, high-inertia drives (mills, crushers, large fans) on supplies that cannot stand a cage motor\'s inrush.',
      'Refurbishing existing slip-ring cranes, hoists and mills where the resistor gear is in place.',
      'Doubly-fed generators with a limited speed range, where a small rotor converter handles only the slip power.'
    ],
    avoid: [
      'New small and medium drives: a cage motor with a soft starter or a VFD is cheaper, more efficient and needs no brush care.',
      'Long running at reduced speed on resistors with constant-torque loads: the slip power is wasted.',
      'Dirty, explosive or unattended sites, where sparking brushes and rings are a liability.'
    ],
    check: [
      'Rotor voltage and current, to size resistors, cables and contactors.',
      'Resistor duty: energy per start, starts per hour, cooling and enclosure.',
      'Brush grade, ring condition and the maintenance plan.',
      'Whether a cage motor on a VFD would do the job for less.'
    ]
  },
  applications: [
    'Ball and SAG mills, crushers and large fans started with liquid resistance starters.',
    'Older overhead cranes and hoists with stepped rotor resistors and drum controllers.',
    'Doubly-fed induction generators in wind turbines; compare starting methods in [the starter diagrams](#/tools/wiring/starters).'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.',
    'IEC 60947-4-1, *Low-voltage switchgear and controlgear — Contactors and motor-starters*.',
    'Chapman, *Electric Machinery Fundamentals* — wound-rotor induction motors, rotor resistance and speed control.',
    'Hughes and Drury, *Electric Motors and Drives* — slip-ring motors, rotor resistance starting and slip-energy recovery.'
  ],
  sim: 'im-wound-rotor'
},

{
  id: 'star-delta-connection', parent: 'three-phase-induction', title: 'Star and delta connections', level: 1,
  short: 'The six terminals of a three-phase motor are linked either in star (Y), where each winding gets the line voltage divided by √3, or in delta (Δ), where it gets the full line voltage. Each winding must see its rated voltage: a 230/400 V motor is delta on 230 V and star on 400 V. The wrong choice gives a third of the torque — or burns the motor.',
  keywords: ['star', 'delta', 'wye', 'Y connection', 'Δ connection', 'terminal box', 'links', 'U1 V1 W1', 'U2 V2 W2', 'T1 T6', 'line voltage', 'phase voltage', '230/400 V', '400/690 V', 'star point', '87 Hz'],
  prereq: ['electronics:three-phase', 'rotating-field', 'nameplate-reading'],
  related: ['dual-voltage-motors', 'star-delta-starting', 'reversing-three-phase', 'dol-starting', 'vfd-parameters', 'power-factor', 'electronics:ac-power', 'electronics:three-phase'],
  body: `
A three-phase motor has three windings, each with two ends — six ends in all, brought to the six studs of the terminal box. With three short links you connect them in one of two ways: **star** (Y, wye), with one end of every winding joined at a common point, or **delta** (Δ), with the windings joined end to end in a ring. The choice decides what voltage each winding sees, and it must match the supply to the nameplate.

### The terminal box
IEC 60034-8 marks the windings U1–U2, V1–V2 and W1–W2 (older motors: U–X, V–Y, W–Z). The studs sit in two staggered rows:

| Row | Left | Middle | Right |
|---|---|---|---|
| Top | W2 | U2 | V2 |
| Bottom | U1 | V1 | W1 |

The supply lines L1, L2, L3 go to U1, V1, W1. For **star**, the three links lie along the top row, joining W2, U2 and V2 into the star point. For **delta**, the same three links stand upright — U1–W2, V1–U2, W1–V2 — each joining the start of one winding to the end of another. The staggered order lets the same three links make either connection. North American six-lead motors mark the leads T1–T6 (T1, T2, T3 the starts; T4, T5, T6 the ends).

### Voltages and currents
| | Star (Y) | Delta (Δ) |
|---|---|---|
| Voltage across each winding | $V_L/\\sqrt3$ | $V_L$ |
| Current in each winding | $I_L$ | $I_L/\\sqrt3$ |
| Input power (both) | $P = \\sqrt3\\,V_L I_L \\cos\\varphi$ | the same |
| Neutral | the star point, normally not connected to the supply neutral | none |

The winding does not care how it is connected: it wants its rated voltage. A nameplate "230/400 V Δ/Y" means windings built for 230 V: **delta on a 230 V (line) supply, star on a 400 V supply**. Each winding then sees 230 V, carries the same current and gives the same power; only the line current differs, by √3 — a 7.5 kW example reads "25.3/14.6 A". A "400/690 V Δ/Y" motor has 400 V windings: delta on 400 V networks (which is what suits it to [[star-delta-starting]]) and star on 690 V.

### Wrong connections
- **Star where delta is needed** (a 400/690 V motor starred on 400 V): each winding gets 58 % of its voltage, so every torque falls to a third. The motor may start and run light, but under load it pulls out and stalls, or crawls hot — a breakdown torque of 2.8 × rated becomes 0.93 ×.
- **Delta where star is needed** (a 230/400 V motor in delta on 400 V): each winding gets 173 % of its voltage. The iron saturates, the magnetising current rises many times, the motor roars and trips or burns within minutes, even unloaded.

The simulation lets you make both mistakes safely and see the currents and torques that result.

### Practice at the terminal box
- Read the nameplate and the diagram inside the terminal-box lid before touching links; follow them, not habit.
- Tighten links and nuts to the maker's torque: a loose link runs hot, burns the terminal board and can open a phase ([[rotating-field|single-phasing]]).
- Connect the protective earth first; test the insulation resistance of a motor that has stood idle or damp (a few megohms or more is normal for a dry low-voltage motor — follow the maker's minimum).
- Check the direction of rotation before coupling the load ([[reversing-three-phase]]).
- On a VFD the drive's output voltage must match the connection: a 230/400 V motor in delta on a 230 V output, in star on 400 V. The same motor in delta on a 400 V drive can run at full flux up to about 87 Hz — about √3 times the power, if the drive can supply √3 times the current and the machine can take the speed.

> [!warn] Terminal boxes carry mains voltage. Change links only with the supply isolated, locked off and proven dead — a VFD's DC bus stays charged for minutes after switch-off. Qualified electricians only; the nameplate and the diagram in the box lid govern.

> [!key] Each winding must see its rated voltage. Star divides the line voltage by √3, delta gives it in full: connect so that the winding voltage equals the nameplate's lower figure.
`,
  ideas: [
    'Six terminals, three links: star joins one end of each winding; delta joins the windings in a ring.',
    'In star each winding sees V_L/√3 and carries the line current; in delta it sees V_L and carries I_L/√3.',
    'A 230/400 V Δ/Y motor has 230 V windings: delta on 230 V, star on 400 V.',
    'Star where delta belongs gives one third of the torque; delta where star belongs saturates and burns the motor.',
    'The staggered stud layout (W2 U2 V2 over U1 V1 W1) lets three links make either connection.'
  ],
  pitfalls: [
    'The motor\'s star point must be connected to the supply neutral — A balanced motor needs no neutral; the star point is normally left unconnected to it.',
    'Delta gives more power, so it is the "strong" connection — Delta is only right when the line voltage equals the winding voltage; on the higher supply it destroys the motor.',
    'A 230/400 V motor can be star–delta started on a 400 V network — It must run in star on 400 V, so there is nothing to switch to; star–delta starting needs a 400/690 V motor there.'
  ],
  formulas: [
    {
      name: 'Winding voltage in star',
      expr: 'Vph = VL/sqrt(3)', tex: 'V_{ph} = \\dfrac{V_L}{\\sqrt3}',
      vars: {
        Vph: { name: 'voltage across each winding', q: 'voltage', unit: 'V', tex: 'V_{ph}' },
        VL: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_L' }
      },
      stories: { Vph: 'A motor is connected in star on {VL}. What voltage does each winding get?', VL: 'A motor\'s windings are rated {Vph}. On what line voltage should it run in star?' }
    },
    {
      name: 'Line current in delta',
      expr: 'IL = sqrt(3)*Iph', tex: 'I_L = \\sqrt3\\,I_{ph}',
      vars: {
        IL: { name: 'line current', q: 'current', unit: 'A', tex: 'I_L' },
        Iph: { name: 'current in each winding', q: 'current', unit: 'A', value: 14.6, tex: 'I_{ph}' }
      },
      stories: { IL: 'In delta, each winding carries {Iph}. What current flows in each line?', Iph: 'A delta-connected motor draws {IL} per line. What does each winding carry?' }
    },
    {
      name: 'Three-phase input power',
      expr: 'P = sqrt(3)*V*I*pf', tex: 'P = \\sqrt3\\,V\\,I\\,\\mathrm{PF}',
      vars: {
        P: { name: 'electrical input power', q: 'power', unit: 'kW' },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 },
        I: { name: 'line current', q: 'current', unit: 'A', value: 14.6 },
        pf: { name: 'power factor cos φ', value: 0.82, min: 0.01, max: 1, tex: '\\mathrm{PF}' }
      },
      note: 'The same in star and delta. The shaft output is this times the efficiency.',
      stories: { P: 'A motor on {V} draws {I} at cos φ = {pf}. What power does it take from the supply?', I: 'A motor takes {P} from a {V} supply at cos φ = {pf}. What is the line current?' }
    }
  ],
  examples: [
    {
      title: 'One motor, two supplies',
      q: 'A 7.5 kW motor is marked 230/400 V Δ/Y, 25.3/14.6 A. Give the winding voltage, winding current and line current on a 400 V and on a 230 V supply.',
      steps: [
        'On 400 V it must be star: winding voltage $400/\\sqrt3 = 231$ V; winding current = line current = 14.6 A.',
        'On 230 V it must be delta: winding voltage 230 V; line current 25.3 A, winding current $25.3/\\sqrt3 = 14.6$ A.',
        'The winding sees the same voltage and current either way — the same motor, the same power.'
      ],
      a: 'Both ways: about 230 V and 14.6 A per winding; the line current is 14.6 A on 400 V and 25.3 A on 230 V.'
    },
    {
      title: 'The wrong link pattern',
      q: 'A 400/690 V Δ/Y motor, whose breakdown torque is 2.8 × rated, is connected in star on a 400 V network by mistake. What happens under full load?',
      steps: [
        'Each 400 V winding gets $400/\\sqrt3 = 231$ V, 58 % of its rating.',
        'Torque ∝ V²: every torque is multiplied by $0.577^2 = 1/3$. Breakdown torque $= 2.8/3 = 0.93$ × rated.',
        'Full load exceeds the breakdown torque: the motor cannot carry it — it slows, stalls and draws a high current until the overload trips.'
      ],
      a: 'It stalls under full load (only 93 % of rated torque is available at best); it must be connected in delta.'
    },
    {
      title: 'Checking the nameplate',
      q: 'A 7.5 kW motor on 400 V draws 14.6 A at cos φ = 0.82 at full load. What is its input power and efficiency?',
      steps: [
        '$P_{in} = \\sqrt3 \\times 400 \\times 14.6 \\times 0.82 = 8.29$ kW.',
        '$\\eta = 7.5/8.29 = 90.4\\,\\%$ — the IE3 level for a 7.5 kW 4-pole motor.'
      ],
      a: '8.29 kW in, about 90.4 % efficient.'
    }
  ],
  quiz: [
    { q: 'A motor marked 230/400 V Δ/Y is to run on a 400 V (line-to-line) network. Connect it in…', choices: ['star', 'delta', 'either — the motor adapts', 'delta with the star point earthed'], a: 0, why: 'Its windings are rated 230 V; star gives 400/√3 = 231 V per winding.' },
    { q: 'A delta-connected motor draws 26 A per line. What current flows in each winding?', answer: 15, unit: 'A', why: 'I_ph = I_L/√3 = 26/1.732 = 15 A.' },
    { q: 'A 400/690 V motor is connected in star on 400 V. Compared with the correct connection, its torque is about…', choices: ['one third', 'one half', 'the same', 'three times'], a: 0, why: 'The windings get 1/√3 of their voltage; torque goes as V², so (1/√3)² = 1/3.' },
    { q: 'True or false: in the IEC terminal box, delta is made with three upright links U1–W2, V1–U2, W1–V2.', a: true, why: 'Each link joins the start of one winding to the end of another, closing the ring; star uses the links across the top row W2–U2–V2.' },
    { q: 'What happens if a 230/400 V motor is connected in delta on a 400 V network?', choices: ['Each winding gets 400 V, the iron saturates, the current soars and the motor trips or burns', 'It runs 73 % faster', 'It runs normally with more torque and nothing else changes', 'It runs backwards'], a: 0, why: '400 V on a 230 V winding is 173 % of rated: magnetising current rises many times and the losses destroy the insulation.' }
  ],
  problems: [
    { q: 'A motor is connected in star on a 690 V network. What voltage does each winding get?', answer: 398, unit: 'V', tol: 0.01, steps: ['$V_{ph} = 690/\\sqrt3 = 398$ V — a 400 V winding, so a 400/690 V motor is right.'] },
    { q: 'Each winding of a delta-connected motor carries 20 A. What is the line current?', answer: 34.6, unit: 'A', tol: 0.01, steps: ['$I_L = \\sqrt3 \\times 20 = 34.6$ A.'] }
  ],
  choose: {
    good: [
      'Delta when the network\'s line voltage equals the nameplate\'s lower voltage (230 V for 230/400 V; 400 V for 400/690 V).',
      'Star when it equals the higher one.',
      'A 400/690 V Δ/Y motor on a 400 V network when [[star-delta-starting]] is planned.'
    ],
    avoid: [
      'Star–delta starting with a 230/400 V motor on a 400 V network: it must run in star, so it cannot be switched to delta.',
      'Changing links on a hunch because a motor runs hot: check the load, voltage and cooling first.',
      'Loose links or missing washers: hot joints and single-phasing follow.'
    ],
    check: [
      'The nameplate voltage pair and symbols (Δ/Y), the network\'s line voltage and the diagram in the box lid.',
      'Link and nut tightness, the earth connection and the insulation resistance.',
      'The direction of rotation before coupling.',
      'On a VFD: that the drive output voltage and the connection agree.'
    ]
  },
  applications: [
    'Every three-phase motor installation; practise the links in [the three-phase wiring diagrams](#/tools/wiring/threephase).',
    'Star–delta starters switch the same six terminals from star to delta with contactors ([the starter diagrams](#/tools/wiring/starters)).',
    'The "87 Hz" connection: a 230/400 V motor in delta on a 400 V VFD for extra speed and power.'
  ],
  sources: [
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.',
    'IEC 60038, *IEC standard voltages* (230/400 V and 400/690 V systems).',
    'Hughes and Drury, *Electric Motors and Drives* — star and delta connection of three-phase windings.'
  ],
  sim: 'im-terminal-box'
},

{
  id: 'dual-voltage-motors', parent: 'three-phase-induction', title: 'Dual-voltage motors and terminal boxes', level: 2,
  short: 'Most motors can be connected for two voltages: IEC motors by star or delta (230/400 V, 400/690 V — a ratio of √3), North American motors by putting half-windings in series or parallel (230/460 V — a ratio of 2) with 9 or 12 leads. The rule is always the same: each coil must get its rated voltage. Frequency counts too: 50 and 60 Hz ratings, and fans on the wrong one.',
  keywords: ['dual voltage', '230/400 V', '400/690 V', '230/460 V', '208-230/460 V', 'nine lead', '9-lead', '12-lead', 'T1 T9', 'series parallel', 'low voltage connection', 'high voltage connection', '50/60 Hz', 'voltage tolerance', 'part winding'],
  prereq: ['star-delta-connection', 'nameplate-reading', 'rotating-field'],
  related: ['star-delta-starting', 'torque-slip-curve', 'slip-and-speed', 'motors-pumps-fans', 'motor-standards', 'vfd-parameters', 'electronics:three-phase'],
  body: `
Motors are built to be sold everywhere, and networks differ: 230/400 V in most of the world (220/380 V in older systems), 400/690 V for large industrial drives and mines, 208, 240, 480 and 600 V in North America; 50 Hz in some countries and 60 Hz in others. So most motors can be connected for two voltages, in one of two ways.

### Ratio √3: star or delta
A six-terminal IEC motor changes voltage by changing star to delta ([[star-delta-connection]]): 230/400 V Δ/Y or 400/690 V Δ/Y. The winding voltage stays the same; the line voltage differs by √3.

### Ratio 2: halves in series or parallel
North American motors are usually wound for 230/460 V (often sold as 208-230/460 V). Each phase winding is split into two equal halves: in **series** they share the high voltage; in **parallel** each takes the low voltage. Either way each half sees the same voltage, and the line current at 230 V is twice that at 460 V.

- **Nine leads, wye**: the second halves are joined in a star inside the motor; leads T1–T9 come out.
- **Nine leads, delta**: the halves form an internal delta; again T1–T9.
- **Twelve leads**: every half-winding end comes out (T1–T12), so the motor can be connected star or delta at either voltage — for star–delta starting, or part-winding starting (one half first, then both) at the low voltage.

Typical connections (the motor's own nameplate governs):

| Motor | Voltage | L1 | L2 | L3 | Join together |
|---|---|---|---|---|---|
| 9-lead wye | low (230 V), parallel | T1, T7 | T2, T8 | T3, T9 | T4–T5–T6 |
| 9-lead wye | high (460 V), series | T1 | T2 | T3 | T4–T7, T5–T8, T6–T9 |
| 9-lead delta | low (230 V), parallel | T1, T6, T7 | T2, T4, T8 | T3, T5, T9 | — |
| 9-lead delta | high (460 V), series | T1 | T2 | T3 | T4–T7, T5–T8, T6–T9 |

The high-voltage connection is the same for both kinds, but the low-voltage ones differ — know which motor you have (the nameplate says; a qualified person can confirm with an ohmmeter whether T4, T5 and T6 are joined to anything inside). In the simulation, pick a motor, a connection and a supply: every half-coil lights up with its own voltage and current.

### The rule: count the coil voltage
Whatever the lead numbers, ask what voltage each coil gets. If it is its rated voltage, the connection is right. The common mistakes:
- **Low-voltage connection on the high supply** (parallel on 460 V): each coil gets twice its voltage; the iron saturates, the current soars, the motor trips or burns within seconds to minutes.
- **High-voltage connection on the low supply** (series on 230 V): each coil gets half its voltage — a quarter of the torque; under load it stalls and overheats.
- **208 V networks**: a 230 V motor on 208 V is 10 % low — about 18 % less torque, more slip and current. Motors marked 208-230 V are designed for it; others may run hot at full load.

### 50 and 60 Hz
Many IEC motors are marked for both, for example 400 V 50 Hz and 460 V 60 Hz: almost the same volts per hertz and so the same flux. At 60 Hz the motor runs 20 % faster and is often rated for about 15 % more power. Trouble comes when the ratio is wrong:
- A 400 V, 50 Hz motor on **400 V, 60 Hz**: the flux falls by a sixth and the starting and breakdown torques by about 30 %, the motor runs 20 % faster — and a fan or pump on it now needs $1.2^3 \\approx 1.73$ times the power ([[motors-pumps-fans]]). Overload is likely.
- A 60 Hz motor on 50 Hz at full voltage: the flux rises 20 %, the iron saturates and the motor runs hot even lightly loaded; it needs about 5/6 of the voltage.

### What the supply really gives
IEC 60034-1 expects a motor to deliver its rating over ±5 % of rated voltage (zone A) and to keep working, with more heating, over ±10 % (zone B). Supplies sag at the end of long cables and rise at night: measure at the terminals under load, and size cables for it ([the cable sizing tool](#/tools/sizing/cable)).

> [!warn] Reconnecting leads is mains work: isolate, lock off and prove dead first; qualified electricians only; the nameplate and the connection diagram govern, and unmarked or re-marked leads must be identified by test, never guessed.

> [!key] Dual voltage means rearranging coils so each keeps its rated voltage: star/delta for a √3 ratio, series/parallel halves for a 2 : 1 ratio. Check the frequency too — volts per hertz sets the flux.
`,
  ideas: [
    'IEC dual voltage (230/400, 400/690 V) uses star and delta: a ratio of √3.',
    'North American dual voltage (230/460 V) puts half-windings in series (high) or parallel (low): a ratio of 2.',
    'Nine-lead motors are wye or delta inside; twelve-lead motors bring every end out.',
    'The test of any connection: each coil must see its rated voltage.',
    'Volts per hertz sets the flux: 400 V 50 Hz ≈ 460 V 60 Hz; a fan moved from 50 to 60 Hz needs 1.73 times the power.'
  ],
  pitfalls: [
    'The line current is the same at both voltages — For the same power it is inversely proportional to the voltage: twice as much at 230 V as at 460 V.',
    'A 50 Hz motor on a 60 Hz supply of the same voltage just runs faster — The flux and torque fall, and a fan or pump load rises with the cube of speed: overload is likely.',
    'Any 9-lead motor is connected the same way — The high-voltage connection is common, but wye and delta 9-lead motors have different low-voltage connections.'
  ],
  formulas: [
    {
      name: 'Full-load line current from the rating',
      expr: 'I = P/(sqrt(3)*V*eta*pf)', tex: 'I = \\dfrac{P}{\\sqrt3\\,V\\,\\eta\\,\\mathrm{PF}}',
      vars: {
        I: { name: 'line current', q: 'current', unit: 'A' },
        P: { name: 'rated output (shaft) power', q: 'power', unit: 'hp', value: 10 },
        V: { name: 'line voltage', q: 'voltage', unit: 'V', value: 460 },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 91.7, min: 1, max: 100, tex: '\\eta' },
        pf: { name: 'power factor cos φ', value: 0.82, min: 0.01, max: 1, tex: '\\mathrm{PF}' }
      },
      stories: { I: 'A {P} motor on {V} has an efficiency of {eta} and cos φ = {pf}. What full-load current should the nameplate show?' }
    },
    {
      name: 'Current at the other voltage',
      expr: 'I2 = I1*V1/V2', tex: 'I_2 = I_1\\,\\dfrac{V_1}{V_2}',
      vars: {
        I2: { name: 'line current at the other voltage', q: 'current', unit: 'A', tex: 'I_2' },
        I1: { name: 'line current at the first voltage', q: 'current', unit: 'A', value: 12.45, tex: 'I_1' },
        V1: { name: 'first voltage', q: 'voltage', unit: 'V', value: 460, tex: 'V_1' },
        V2: { name: 'other voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_2' }
      },
      note: 'Same power, same coil voltage: the current scales inversely with the line voltage.',
      stories: { I2: 'A dual-voltage motor draws {I1} at {V1}. What will it draw at {V2}?' }
    },
    {
      name: 'Fan or pump power at another speed',
      expr: 'P2 = P1*(f2/f1)^3', tex: 'P_2 = P_1\\left(\\dfrac{f_2}{f_1}\\right)^3',
      vars: {
        P2: { name: 'power absorbed at the new frequency', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'power absorbed at the old frequency', q: 'power', unit: 'kW', value: 7, tex: 'P_1' },
        f1: { name: 'old supply frequency', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_1' },
        f2: { name: 'new supply frequency', q: 'frequency', unit: 'Hz', value: 60, tex: 'f_2' }
      },
      note: 'Affinity law for centrifugal fans and pumps (speed follows frequency; slip neglected).',
      stories: { P2: 'A fan absorbs {P1} at {f1}. The machine is shipped to a {f2} country. What power will the fan absorb?' }
    }
  ],
  examples: [
    {
      title: 'A 10 hp motor at both voltages',
      q: 'A 10 hp, 230/460 V, 4-pole, 60 Hz motor has an efficiency of 91.7 % and cos φ = 0.82. Find the full-load current at each voltage.',
      steps: [
        '$P = 10 \\times 745.7 = 7457$ W.',
        'At 460 V: $I = 7457/(\\sqrt3 \\times 460 \\times 0.917 \\times 0.82) = 7457/599 = 12.45$ A.',
        'At 230 V: $I = 12.45 \\times 460/230 = 24.9$ A.'
      ],
      a: 'About 12.5 A at 460 V and 24.9 A at 230 V.'
    },
    {
      title: 'A fan shipped from a 50 Hz to a 60 Hz country',
      q: 'A 7.5 kW, 400 V, 50 Hz motor drives a fan absorbing 7.0 kW. The machine is installed on a 400 V, 60 Hz supply. What happens?',
      steps: [
        'The motor runs about 20 % faster, and the fan\'s power rises with the cube of speed: $7.0 \\times 1.2^3 = 12.1$ kW.',
        'That is 61 % above the motor\'s rating — and at 400 V, 60 Hz its flux is a sixth low, so its torque margin has shrunk too.',
        'Cures: a 60 Hz-rated motor sized for the fan at 60 Hz, a smaller fan pulley or impeller, or a VFD set to 50 Hz output.'
      ],
      a: 'The fan would absorb about 12 kW: the motor is badly overloaded and will trip or burn.'
    },
    {
      title: 'The series connection on the low supply',
      q: 'A 9-lead 230/460 V motor is left in its high-voltage (series) connection and put on 230 V. Its breakdown torque is 2.8 × rated. What happens at full load?',
      steps: [
        'Each half-coil should see $460/(2\\sqrt3) = 133$ V; in series on 230 V it sees $230/(2\\sqrt3) = 66$ V — half.',
        'Torque ∝ V²: all torques fall to a quarter; breakdown becomes $2.8/4 = 0.7$ × rated.',
        'At full load the motor cannot run: it stalls or will not start, drawing a high current.'
      ],
      a: 'It stalls under full load — only 70 % of rated torque is available at best.'
    }
  ],
  quiz: [
    { q: 'A 230/460 V nine-lead motor is to run on 460 V. The halves of each phase go in…', choices: ['series', 'parallel', 'delta, whatever the leads', 'either, it does not matter'], a: 0, why: 'In series the two halves share 460 V, so each gets the voltage it gets in parallel on 230 V.' },
    { q: 'For the same load, the line current of a 230/460 V motor on 230 V is…', choices: ['twice the 460 V current', 'the same as on 460 V', 'half the 460 V current', '√3 times the 460 V current'], a: 0, why: 'Same power at half the voltage needs twice the current.' },
    { q: 'A fan driven by a 400 V 50 Hz motor is moved to a 400 V 60 Hz supply. The fan\'s power demand rises by roughly…', choices: ['73 %', '20 %', '44 %', 'nothing — the motor limits it'], a: 0, why: 'Fan power goes as speed cubed: 1.2³ = 1.73.' },
    { q: 'True or false: the high-voltage connection of nine-lead wye and nine-lead delta motors is the same (T1, T2, T3 to the lines; T4–T7, T5–T8, T6–T9 joined).', a: true, why: 'Both put the halves in series; it is the low-voltage (parallel) connections that differ.' },
    { q: 'A nine-lead motor in its low-voltage (parallel) connection is put on 460 V. Each coil gets…', choices: ['twice its rated voltage: it saturates and burns', 'half its rated voltage', 'its rated voltage', 'no voltage'], a: 0, why: 'In parallel each coil takes the full phase voltage; on 460 V that is double what it was built for.' }
  ],
  problems: [
    { q: 'A 15 kW, 400 V motor has an efficiency of 92.1 % and cos φ = 0.84. What is its full-load current?', answer: 28.0, unit: 'A', tol: 0.01, steps: ['$I = P/(\\sqrt3 V\\eta\\cos\\varphi) = 15\\,000/(1.732 \\times 400 \\times 0.921 \\times 0.84)$.', '$= 15\\,000/536.0 = 28.0$ A.'] },
    { q: 'A pump absorbs 11 kW at 50 Hz. What will it absorb if run 20 % faster on 60 Hz?', answer: 19.0, unit: 'kW', tol: 0.01, steps: ['$P_2 = 11 \\times (60/50)^3 = 11 \\times 1.728 = 19.0$ kW.'] }
  ],
  choose: {
    good: [
      'Machines sold into several countries: one motor, two connections.',
      '400/690 V Δ/Y motors on 400 V networks where star–delta starting is planned.',
      '12-lead motors where star–delta or part-winding starting is needed at either voltage.'
    ],
    avoid: [
      'Guessing the lead groups of an old or re-marked motor: have the leads identified by test.',
      'Running a 50 Hz fan or pump drive on 60 Hz (or the reverse) without re-checking the load and the motor rating.',
      'Supplies outside ±10 % of the nameplate voltage at the terminals.'
    ],
    check: [
      'The nameplate voltage and frequency pairs, the connection diagram and the lead markings.',
      'Which coil voltage your connection gives on your supply.',
      'The line current at the chosen voltage for cables, contactors and the overload setting.',
      'The voltage at the terminals under load.'
    ]
  },
  applications: [
    'Machine builders who export to North America and Europe choose 230/460 V or 400/690 V motors and document both connections.',
    'Part-winding starting of large 230 V twelve-lead motors, and star–delta starting of 400/690 V motors.',
    'Try the connections in [the three-phase wiring diagrams](#/tools/wiring/threephase).'
  ],
  sources: [
    'NEMA MG 1, *Motors and Generators* — terminal markings of dual-voltage motors (T1 to T12) and their connections.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: voltage and frequency variations (zones A and B).',
    'IEC 60034-8, *Terminal markings and direction of rotation*; IEC 60038, *IEC standard voltages*.',
    'Hughes and Drury, *Electric Motors and Drives* — supply voltage, frequency and the induction motor\'s flux.'
  ],
  sim: 'im-nine-lead'
},

{
  id: 'reversing-three-phase', parent: 'three-phase-induction', title: 'Reversing a three-phase motor', level: 1,
  short: 'Swap any two supply lines and a three-phase motor turns the other way. A reversing starter does it with two interlocked contactors — never both closed, or two lines are shorted. Reversing a running motor (plugging) brakes it hard, draws more than starting current and heats the rotor with four times the load\'s kinetic energy; a VFD reverses along ramps instead.',
  keywords: ['reversing', 'direction of rotation', 'phase sequence', 'swap two phases', 'reversing contactor', 'interlock', 'mechanical interlock', 'electrical interlock', 'pushbutton interlock', 'plugging', 'plug stop', 'AC-3', 'AC-4', 'zero-speed switch', 'phase-sequence relay', 'bump test'],
  prereq: ['rotating-field', 'star-delta-connection', 'dol-starting'],
  related: ['slip-and-speed', 'torque-slip-curve', 'motor-protection', 'vfd-braking', 'vfd-parameters', 'limit-switches', 'emergency-stop', 'motor-brakes', 'electronics:relays'],
  body: `
To reverse a three-phase motor, swap any two of its three supply lines. The phase sequence reverses, the rotating field turns the other way ([[rotating-field]]) and the rotor follows. That is all on the motor's side; the engineering is in doing it safely and knowing what a reversal costs.

### Which way is forward?
IEC 60034-8 defines it: with the supply sequence L1–L2–L3 on terminals U1–V1–W1, the motor turns clockwise seen from the drive end (looking at the shaft). But the phase sequence of a site's supply is rarely known for certain, so direction is checked at commissioning:
- **Bump test**: with the load uncoupled, or safe to turn backwards, start the motor for a moment and watch the shaft or fan.
- **Phase-sequence meter** on the supply, and a motor rotation tester on the dead motor, to match them before energising.

Some loads are damaged by running backwards: pumps with screwed-on impellers can unscrew, screw compressors and gearboxes with backstops must not reverse, mechanical seals and one-way fans suffer. Guard them with a phase-sequence relay or a mechanical backstop. When a new motor runs the wrong way, swap two leads **at that motor or its starter output** (after isolating) — not at the panel supply, which would reverse every other motor too.

### The reversing starter
Two contactors do the swap: **K1** (forward) connects L1–L2–L3 to U1–V1–W1; **K2** (reverse) connects them with L1 and L3 exchanged. If both closed together they would short L1 to L3 — a phase-to-phase short circuit that welds contacts and trips the breaker. Interlocks prevent it:

| Interlock | How | Stops |
|---|---|---|
| Mechanical | a lever or rocker between the two contactors | both closing at once, even with both coils energised |
| Electrical | an NC auxiliary contact of K2 in K1's coil circuit, and of K1 in K2's | a coil being energised while the other contactor is closed |
| Pushbutton | the NC contact of each direction button in the other direction's circuit | lets REV drop K1 before K2 picks up: direct reversing |

A **stop-before-reverse** circuit uses the contactor interlocks only: the operator presses STOP before the other direction. A **direct-reversing** circuit adds the pushbutton interlock: pressing REV while running forwards reverses at once. In the simulation, press the buttons on the ladder diagram and try all three control circuits — including one with no interlocks at all.

### Plugging: reversing a running motor
At the moment of reversal the field turns backwards while the rotor still turns forwards: the slip is nearly 2 and the rotor frequency nearly twice the supply frequency. The current is at or above locked-rotor level, the torque brakes hard, and couplings and gears take a shock. The rotor takes the heat: with no load torque, a reversal from full speed leaves in it **four times** the load's kinetic energy at synchronous speed, a plug stop three times, a start once:

$$Q_r = k\\,\\tfrac12 J\\omega_s^2, \\qquad k = 1 \\text{ (start)},\\ 3 \\text{ (plug stop)},\\ 4 \\text{ (reversal)}$$

Contactors suffer too: IEC 60947-4-1 separates **AC-3** duty (starting cage motors, switching off running ones) from **AC-4** (plugging and inching). A contactor's AC-4 rating is far below its AC-3 rating, so plugging duty needs a larger contactor or accepts a much shorter contact life. A plug stop also needs a **zero-speed (plugging) switch** to drop the reverse contactor at standstill, or the motor runs up backwards.

### Reversing on a VFD
A drive reverses by changing the order in which its transistors switch — a terminal or a parameter, with ramps. It decelerates along a ramp (the energy returns to the DC bus, where a [[vfd-braking|braking resistor]] absorbs it on fast stops of big inertias), passes through zero and accelerates the other way: no plugging shock, no contactor wear. Never swap phases between a running drive and its motor with contactors; output contactors switch only with the drive stopped.

### In machines
- Reversing axes need **limit switches**: the forward limit opens the forward circuit and leaves reverse free ([[limit-switches]]).
- Hoists and cranes reverse with a **brake** and a time-delayed changeover ([[motor-brakes]]).
- Contactor interlocks are **not safety functions**: emergency stops follow ISO 13850 and the machine's safety chain; drives use safe torque off ([[emergency-stop]]).

> [!warn] Reversing starters are mains power and control wiring: design and wire them with qualified people to the machine's circuit diagram and IEC 60204-1, isolate and lock off before work, and test the interlocks before hand-over. Never defeat an interlock to reverse faster.

> [!key] Swap two lines to reverse. Interlock the two contactors mechanically and electrically so they can never close together. Plugging a running motor costs a surge of current, a mechanical shock and four times the kinetic energy in rotor heat — for frequent reversal use a VFD.
`,
  ideas: [
    'Swapping any two supply lines reverses the phase sequence, the field and the motor.',
    'A reversing starter uses two contactors; if both closed, two lines would be short-circuited — so they are interlocked mechanically and electrically.',
    'Pushbutton interlocks allow direct reversing; contactor interlocks alone force a stop first.',
    'Plugging draws at least locked-rotor current and leaves 3 (stop) to 4 (reversal) times the kinetic energy in the rotor.',
    'A VFD reverses along ramps, with no contactor wear; braking energy goes to the DC bus.'
  ],
  pitfalls: [
    'Moving all three leads one place along reverses the motor — L1→V1, L2→W1, L3→U1 keeps the same sequence; only swapping two reverses it.',
    'An electrical interlock alone is enough — A welded contact or a stuck armature can defeat it; the mechanical interlock covers what the auxiliary contacts cannot.',
    'Plugging is a free brake — The rotor absorbs about three times the kinetic energy on a plug stop, the current exceeds starting current, and AC-4 duty wears contactors fast.'
  ],
  formulas: [
    {
      name: 'Slip at the moment of reversal',
      expr: 's = (ns + n)/ns', tex: 's = \\dfrac{n_s + n}{n_s}',
      vars: {
        s: { name: 'slip just after reversal', q: 'ratio', unit: '%' },
        ns: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_s' },
        n: { name: 'speed in the old direction', q: 'angvel', unit: 'rpm', value: 1455 }
      },
      note: 'The field now turns at −n_s while the rotor still turns at +n: the slip is close to 2 (200 %).',
      stories: { s: 'A motor with a synchronous speed of {ns} runs at {n} when two lines are swapped. What is its slip at that instant?' }
    },
    {
      name: 'Rotor heat in a start, plug stop or reversal',
      expr: 'Q = k*J*ws^2/2', tex: 'Q_r = k\\,\\tfrac12 J\\,\\omega_s^2',
      vars: {
        Q: { name: 'energy dissipated in the rotor', q: 'energy', unit: 'kJ', tex: 'Q_r' },
        k: { name: 'factor: 1 start, 3 plug stop, 4 full reversal', int: true, value: 4, min: 1, max: 4 },
        J: { name: 'total inertia at the motor shaft', q: 'inertia', unit: 'kg·m²', value: 0.8 },
        ws: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega_s' }
      },
      note: 'With no load torque (a braking load reduces the heat of a plug stop, a driving one adds to it). The stator losses come on top.',
      stories: { Q: 'Motor and load have {J}; the field turns at {ws}. How much heat does the rotor absorb in an operation with factor k = {k}?', J: 'The rotor can absorb {Q} per operation (k = {k}) at {ws}. What is the largest inertia it can handle?' }
    }
  ],
  examples: [
    {
      title: 'The heat of reversing a conveyor',
      q: 'A conveyor and its 4-pole, 50 Hz motor have J = 0.8 kg·m² at the motor shaft. Compare the rotor heat of a start, a plug stop and a full reversal.',
      steps: [
        '$\\omega_s = 157.1$ rad/s; $\\tfrac12 J\\omega_s^2 = 0.5 \\times 0.8 \\times 157.1^2 = 9.87$ kJ.',
        'Start 9.9 kJ; plug stop $3 \\times 9.87 = 29.6$ kJ; reversal $4 \\times 9.87 = 39.5$ kJ.',
        'With a cage of about 2 kg of aluminium (900 J/(kg·K)), one reversal could warm the bars by up to about 22 K before the heat spreads into the iron: a few reversals a minute would soon cook the rotor.'
      ],
      a: 'About 10 kJ, 30 kJ and 40 kJ: each reversal costs as much rotor heat as four starts.'
    },
    {
      title: 'Plugging slip and rotor frequency',
      q: 'A 4-pole, 50 Hz motor running at 1455 rpm is plugged. Find the slip and the rotor frequency at that instant.',
      steps: [
        '$s = (1500 + 1455)/1500 = 1.97$ (197 %).',
        '$f_2 = s f = 1.97 \\times 50 = 98.5$ Hz: the deep-bar effect is at its strongest, which gives a high braking torque.'
      ],
      a: 's ≈ 1.97; the rotor currents alternate at about 98.5 Hz.'
    },
    {
      title: 'A new pump runs backwards',
      q: 'After installation a pump turns the wrong way. The panel feeds six other motors. How should it be corrected?',
      steps: [
        'Isolate, lock off and prove the pump circuit dead.',
        'Swap two leads at the pump motor terminals or at its starter output (for example those on U1 and W1) — not at the panel\'s incoming supply, which would reverse all six other motors.',
        'Re-energise, bump-test, and note the corrected connection in the drawings.'
      ],
      a: 'Swap two leads at that motor or its starter only, after lock-out, and re-check.'
    }
  ],
  quiz: [
    { q: 'How do you reverse a three-phase induction motor?', choices: ['Swap any two of the three supply lines', 'Swap all three lines one place along', 'Change from star to delta', 'Reverse the neutral'], a: 0, why: 'Swapping two lines reverses the phase sequence and so the rotating field.' },
    { q: 'Why must the forward and reverse contactors never close together?', choices: ['They would short two supply lines together', 'The motor would stop', 'The motor would run at double speed', 'The overload relay would reset'], a: 0, why: 'K2 exchanges L1 and L3; with K1 also closed, L1 and L3 are joined through the contacts — a phase-to-phase short.' },
    { q: 'True or false: reversing a motor from full speed heats its rotor about four times as much as a start from rest.', a: true, why: 'With no load torque, the rotor absorbs 4 × ½Jω_s² in a reversal against 1 × ½Jω_s² in a start.' },
    { q: 'Which contactor utilisation category covers plugging and inching?', choices: ['AC-4', 'AC-3', 'AC-1', 'DC-1'], a: 0, why: 'AC-3 is normal starting and switching off of running cage motors; AC-4 adds plugging and inching, with much lower ratings.' },
    { q: 'A VFD-driven conveyor must reverse often. The best way is to…', choices: ['command reverse at the drive and let it ramp down and up', 'swap two motor leads with contactors while the drive runs', 'plug it with a reversing starter ahead of the drive', 'switch the drive off and on'], a: 0, why: 'The drive reverses its switching sequence with ramps; contactors between a running drive and its motor can damage the drive.' }
  ],
  problems: [
    { q: 'A 6-pole, 50 Hz motor and load (J = 2 kg·m²) are stopped by plugging. How much heat does the rotor absorb (no load torque)?', answer: 32.9, unit: 'kJ', tol: 0.02, steps: ['$\\omega_s = 1000 \\times 2\\pi/60 = 104.7$ rad/s.', '$\\tfrac12 J\\omega_s^2 = 0.5 \\times 2 \\times 104.7^2 = 10.97$ kJ.', 'Plug stop: $3 \\times 10.97 = 32.9$ kJ.'] },
    { q: 'A 2-pole, 50 Hz motor running at 2950 rpm is plugged. What is its slip at that instant (in %)?', answer: 198.3, unit: '%', tol: 0.01, steps: ['$s = (3000 + 2950)/3000 = 1.983$.'] }
  ],
  choose: {
    good: [
      'Contactor reversing for occasional changes of direction after a stop: gates, doors, conveyors, simple axes with limit switches.',
      'Direct reversing (plugging) of small, low-inertia drives with light duty, where a quick stop matters.',
      'A VFD for frequent reversal, smooth ramps, controlled braking energy and positioning.'
    ],
    avoid: [
      'Frequent plugging of large inertias: rotor heat (four times the kinetic energy per reversal) and AC-4 contact wear add up fast.',
      'Loads that must not run backwards (screw compressors, some pumps and gearboxes) without a backstop or phase-sequence monitoring.',
      'Contactor interlocks used as a safety function or emergency stop.'
    ],
    check: [
      'Mechanical and electrical interlocks between K1 and K2, and contactors rated for AC-3 or AC-4 as the duty requires.',
      'Zero-speed detection or a timed pause before reversing a large inertia.',
      'Limit switches and brakes on axes and hoists.',
      'The direction of rotation at commissioning, and what the load does if it runs backwards.'
    ]
  },
  applications: [
    'Roller doors, gates, turntables and simple conveyors with a reversing contactor pair and limit switches.',
    'Hoists with reversing contactors, brakes and upper and lower limits.',
    'See the power and control circuits in [the three-phase wiring diagrams](#/tools/wiring/threephase) and [the starter diagrams](#/tools/wiring/starters); for drives, [the VFD tool](#/tools/drives/vfd).'
  ],
  sources: [
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.',
    'IEC 60947-4-1, *Low-voltage switchgear and controlgear — Contactors and motor-starters* (utilisation categories AC-3 and AC-4).',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines*; ISO 13850, *Safety of machinery — Emergency stop function*.',
    'Hughes and Drury, *Electric Motors and Drives* — reversing and plugging of induction motors.'
  ],
  sim: 'im-reversing'
}

);
