/* HYPER-MOTORS · content/dc.js — brushed DC motors: the kinds (PMDC, series, shunt, compound, universal, brushes and
 * the commutator) and their control (PWM, the H-bridge, drivers, braking, gearmotors). The torque–speed line itself is
 * the reference page (content/reference.js). Simulations: sims/dc.js (ids dc-…). */
Hyper.add(

{
  id: 'pmdc-motor', parent: 'dc-types', title: 'The permanent-magnet DC motor', level: 1,
  short: 'Magnets on the stator, a wound rotor, and a commutator with brushes that keeps the torque turning one way. Its speed follows the voltage, its torque follows the current, and swapping its two leads reverses it — the simplest motor there is to drive from a battery.',
  keywords: ['PMDC', 'permanent magnet DC motor', 'can motor', 'ferrite magnet', 'neodymium', 'NdFeB', 'armature', 'commutator', 'brushes', 'cogging', 'torque ripple', 'slot count', 'demagnetisation', 'Kv', '12 V motor', '24 V motor', '90 V DC motor', '180 V DC motor'],
  prereq: ['force-on-conductor', 'back-emf', 'torque-and-power'],
  related: ['dc-torque-speed', 'brushes-commutator', 'pwm-speed-control', 'h-bridge', 'dc-gearmotors', 'coreless-motors', 'bldc-motor', 'motor-heating', 'physics:torque-on-loop', 'electronics:dc-motor-control'],
  body: `
A permanent-magnet DC (PMDC) motor has three parts. The **stator** is a steel tube — the can — lined with two or four curved magnets; the can itself carries the flux from one magnet round to the other. The **rotor** (the armature) is a stack of thin steel laminations with slots, wound with copper coils. The **commutator**, a ring of copper segments on the shaft, rubs against two stationary **brushes** that feed current into whichever coils are passing the magnets. As the rotor turns, the commutator keeps switching the coils so that the conductors under the north pole always carry current one way and those under the south pole the other way: the force on every conductor pushes the same way round, and the torque never reverses.

In the simulation, watch the dots (current out of the screen) and crosses (into it) in the slots: each slot changes sign as it crosses the gap between the magnets — the neutral zone — at the moment its commutator segment passes under a brush.

### What it does
Two straight-line laws describe it (derived on [[dc-torque-speed]]): the back-EMF is [[?proportional|proportional]] to speed, $E = K\\omega$, and the torque to current, $T = K I$. So **speed follows voltage and torque follows current**. Reverse the two leads and it runs backwards: the magnets do not change, so the torque reverses with the current. A switch, a [[pwm-speed-control|PWM chopper]] or an [[h-bridge]] is all it needs.

| Size (can diameter) | Typical supply | No-load speed | Output | Efficiency | Typical uses |
|---|---|---|---|---|---|
| 6–12 mm | 1.5–6 V | 10 000–30 000 rpm | 0.05–1 W | 30–60 % | vibration alerts, cameras, toys |
| 20–36 mm | 3–24 V | 3 000–20 000 rpm | 1–50 W | 50–75 % | pumps, printers, small tools |
| 40–80 mm | 12, 24, 48 V | 1 500–6 000 rpm | 20–500 W | 65–85 % | wipers, windows, seats, fans, carts |
| 80–150 mm | 24–48 V, or 90/180 V from rectified mains | 1 750–3 000 rpm | 0.2–2 kW | 75–88 % | conveyors, treadmills, mixers |

### The magnets set K — and heat weakens them
| Magnet | Remanence $B_r$ | Change of $B_r$ with heat | Notes |
|---|---|---|---|
| Ferrite (ceramic) | 0.35–0.45 T | about −0.2 %/K | cheap, used in most motors; loses coercivity when **cold** |
| Bonded NdFeB | 0.6–0.8 T | about −0.1 %/K | small high-performance motors |
| Sintered NdFeB | 1.1–1.4 T | about −0.12 %/K | compact; each grade has a limit between about 80 and 200 °C |
| SmCo | 0.9–1.15 T | about −0.035 %/K | hot places, up to about 250–350 °C |
| AlNiCo | 0.7–1.3 T | about −0.02 %/K | older motors and tachogenerators; easily demagnetised |

A ferrite motor loses about 0.2 % of its $K$ for every kelvin its magnets warm, while its copper gains 0.39 % of resistance per kelvin. A hot motor therefore runs a little faster at no load but gives less torque per ampere and much less stall torque — 60 K of warming costs nearly 30 % of the stall torque in the second example. The **continuous rating** is thermal: the copper loss $I^2R$ must flow out through the thermal resistance $R_{th}$ from winding to air, so the current that holds a temperature rise $\\Delta T$ is $\\sqrt{\\Delta T/(R\\,R_{th})}$ ([[?square-root]]).

Magnets can be **demagnetised**. The armature current makes a field that opposes the magnets at one edge of each pole (armature reaction). A large enough current — a stall at full voltage, a reversal at full speed, a short circuit — weakens part of a magnet for good, and the motor afterwards runs faster and weaker. Ferrite is most at risk when cold, NdFeB when hot. That is why datasheets give a maximum peak current, and a driver's current limit must respect it.

### Cogging and torque ripple
Turn a PMDC motor by hand and it clicks: the magnets pull the rotor teeth into preferred positions (**cogging**). Skewed slots and odd slot counts reduce it; [[coreless-motors]] have no iron teeth and none at all. Commutation adds **torque ripple**: the torque is the [[?sum]] of the coils' shares, and every switching makes a dip. In an idealised motor with a sinusoidal field the peak-to-peak ripple is about 14 % with 3 slots, 5 % with 5, 2.5 % with 7 and 3.4 % with 12 — an odd count gives twice as many torque pulses per turn as an even one. The sim draws the ripple for each count. It matters at crawl speeds (a camera slider, a dosing pump), hardly at all in a fan.

### Brushes, bearings, noise and life
The brushes are the wear part and the source of electrical noise ([[brushes-commutator]]). Small motors with non-replaceable brushes typically run 1 000–5 000 hours — less at high speed and current, more at light duty; industrial PMDC motors have replaceable carbon brushes. Each commutation sparks slightly, so motors carry suppression capacitors from the terminals to each other and to the case, sometimes chokes too. Cheap motors run in oil-impregnated sintered-bronze sleeve bearings, which dislike the side load of a belt or pinion; better ones use ball bearings.

> [!warn] A stalled PMDC motor draws ten to twenty times its rated current. Fuse the wiring, set the driver's current limit for the motor's rating, and keep peaks below the demagnetisation limit on the datasheet. Battery packs can deliver hundreds of amperes into a short: fuse them close to the battery.

> [!key] A PMDC motor turns volts into speed and amperes into torque, reverses with its leads, and is limited by heat, brush wear and its magnets. Choose it for cheap, simple control on DC; choose a [[bldc-motor|brushless motor]] for long life and high speed.
`,
  ideas: [
    'The commutator switches each coil as it passes the neutral zone, so the torque on the rotor always acts the same way round.',
    'Speed follows voltage (E = Kω) and torque follows current (T = KI); swapping the leads reverses the motor.',
    'K comes from the magnets and falls as they warm (about 0.2 %/K for ferrite), while the winding resistance rises 0.39 %/K: a hot motor is weaker.',
    'The continuous rating is set by heat: the copper loss must flow through the winding-to-air thermal resistance.',
    'Too much current demagnetises the magnets for good — ferrite when cold, NdFeB when hot.'
  ],
  pitfalls: [
    'Reversing a DC motor always needs a special reversing winding — For a PMDC motor swapping the two leads is enough, because the magnets do not reverse; only wound-field motors need their armature reversed relative to the field.',
    'A motor that runs faster when hot must be getting stronger — It runs faster because its magnets are weaker (smaller K); its torque per ampere and its stall torque have fallen.',
    'The stall current is just a big starting surge, harmless if brief — At stall there is no back-EMF to limit it; held for seconds it overheats the winding and can demagnetise the magnets.'
  ],
  formulas: [
    {
      name: 'Motor constant from the speed constant',
      expr: 'K = 60/(2*pi*Kv)', tex: 'K = \\dfrac{60}{2\\pi K_v}',
      vars: {
        K: { name: 'motor constant (torque and back-EMF)', q: 'kemf', unit: 'V·s/rad' },
        Kv: { name: 'speed constant', q: false, unit: 'rpm/V', value: 174, tex: 'K_v' }
      },
      note: 'Datasheets give Kv in rpm per volt; the same number read as N·m/A is the torque constant.',
      stories: { K: 'A motor is listed with Kv = {Kv}. What are its back-EMF and torque constants?', Kv: 'A motor has K = {K}. What speed constant (rpm per volt) is that?' }
    },
    {
      name: 'Magnet temperature and the motor constant',
      expr: 'K = K20*(1 + alpha*dT/100)', tex: 'K = K_{20}\\left(1 + \\alpha\\,\\Delta T\\right)',
      vars: {
        K: { name: 'motor constant when warm', q: 'kemf', unit: 'V·s/rad' },
        K20: { name: 'motor constant at 20 °C', q: 'kemf', unit: 'V·s/rad', value: 0.055, tex: 'K_{20}' },
        alpha: { name: 'temperature coefficient of the magnet', q: false, unit: '%/K', value: -0.2, signed: true, tex: '\\alpha' },
        dT: { name: 'magnet temperature above 20 °C', q: 'dtemp', unit: 'K', value: 60, signed: true, tex: '\\Delta T' }
      },
      note: 'About −0.2 %/K for ferrite, −0.12 %/K for sintered NdFeB, −0.035 %/K for SmCo (reversible change only).',
      stories: { K: 'A ferrite motor with K = {K20} at 20 °C runs with its magnets {dT} warmer. What is its K now?' }
    },
    {
      name: 'Stall torque',
      expr: 'Ts = K*V/R', tex: 'T_s = \\dfrac{K\\,V}{R}',
      vars: {
        Ts: { name: 'stall torque', q: 'torque', unit: 'N·m', tex: 'T_s' },
        K: { name: 'motor constant', q: 'ktorque', unit: 'N·m/A', value: 0.055 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'terminal resistance', q: 'resistance', unit: 'Ω', value: 0.5 }
      },
      note: 'The stall current V/R times K, ignoring the no-load current. Brush drop and a hot winding make it smaller.',
      stories: { Ts: 'A {V} motor with K = {K} and R = {R} is blocked. What torque does it press with?' }
    },
    {
      name: 'Continuous current from the thermal limit',
      expr: 'I = sqrt(dT/(R*Rth))', tex: 'I = \\sqrt{\\dfrac{\\Delta T}{R\\,R_{th}}}',
      vars: {
        I: { name: 'continuous current', q: 'current', unit: 'A' },
        dT: { name: 'allowed winding temperature rise', q: 'dtemp', unit: 'K', value: 85, tex: '\\Delta T' },
        R: { name: 'winding resistance when hot', q: 'resistance', unit: 'Ω', value: 0.706 },
        Rth: { name: 'thermal resistance, winding to air', q: 'thermalres', unit: 'K/W', value: 3, tex: 'R_{th}' }
      },
      note: 'Steady state, copper loss only. Use the hot resistance; a fan, a heat-sinking flange or a colder room raise the limit.',
      stories: { I: 'A winding may rise {dT} above the air. Its hot resistance is {R} and its thermal resistance {Rth}. What current can it carry continuously?' }
    }
  ],
  examples: [
    {
      title: 'A datasheet in rpm per volt',
      q: 'A 24 V PMDC motor is listed with $K_v$ = 174 rpm/V, a terminal resistance of 0.5 Ω and a no-load current of 0.25 A. Find its motor constant, its no-load speed and its stall torque.',
      steps: [
        '$K = 60/(2\\pi \\times 174) = 0.0549$ V·s/rad, which is also 0.0549 N·m/A (54.9 mN·m/A).',
        'No-load speed $\\approx (24 - 0.5 \\times 0.25)/0.0549 = 435$ rad/s = 4 150 rpm (174 × 24 = 4 176 rpm without the no-load current).',
        'Stall current $24/0.5 = 48$ A; stall torque $0.0549 \\times (48 - 0.25) = 2.62$ N·m.'
      ],
      a: 'K ≈ 0.055 N·m/A, about 4 150 rpm at no load, about 2.6 N·m at stall.'
    },
    {
      title: 'The same motor, hot',
      q: 'The ferrite magnets and the copper of that motor both warm by 60 K. What happens to its no-load speed and its stall torque? (Take α = −0.2 %/K for the magnets, +0.393 %/K for copper, K = 0.055 at 20 °C.)',
      steps: [
        '$K = 0.055 \\times (1 - 0.002 \\times 60) = 0.0484$ V·s/rad.',
        '$R = 0.5 \\times (1 + 0.00393 \\times 60) = 0.618$ Ω, so the stall current is $24/0.618 = 38.8$ A.',
        'Stall torque $0.0484 \\times (38.8 - 0.25) = 1.87$ N·m, against 2.63 N·m cold: 29 % less.',
        'No-load speed $\\approx 24/0.0484 = 496$ rad/s = 4 740 rpm, against 4 170 rpm cold: 14 % faster.'
      ],
      a: 'It runs about 14 % faster unloaded but its stall torque falls by nearly 30 %.'
    },
    {
      title: 'How much current can it carry all day?',
      q: 'The winding may reach 125 °C in 40 °C air. The resistance is 0.5 Ω at 20 °C and the thermal resistance from winding to air is 3 K/W. Find the continuous current and torque.',
      steps: [
        'Hot resistance $0.5 \\times (1 + 0.00393 \\times 105) = 0.706$ Ω.',
        '$I = \\sqrt{85/(0.706 \\times 3)} = 6.3$ A.',
        'Torque $\\approx 0.055 \\times (6.3 - 0.25) = 0.33$ N·m — about an eighth of the stall torque, near the best-efficiency point.'
      ],
      a: 'About 6.3 A and 0.33 N·m continuous (less if the magnets are hot as well).'
    }
  ],
  quiz: [
    { q: 'You swap the two leads of a PMDC motor. It…', choices: ['runs the other way', 'runs the same way', 'stops, because the field now opposes itself', 'runs the same way but slower'], a: 0, why: 'The magnets keep their polarity, so reversing the armature current reverses the torque. (A series motor behaves differently: its field reverses too.)' },
    { q: 'Why do small DC motors often have 3, 5 or 7 slots rather than 4, 6 or 8?', choices: ['An odd count gives twice as many torque pulses per turn, so less ripple and cogging', 'Odd counts need fewer brushes', 'Even counts cannot be wound', 'Odd counts raise the back-EMF constant'], a: 0, why: 'With an odd count the two brushes never commutate at the same instant, so the dips interleave: 2N pulses a turn instead of N.' },
    { q: 'A ferrite PMDC motor has warmed up. Compared with cold, at no load it runs…', choices: ['a little faster, and its stall torque is lower', 'a little slower, and its stall torque is higher', 'at the same speed', 'faster, with a higher stall torque'], a: 0, why: 'Warm magnets give a smaller K, so V/K is larger; warm copper has more resistance, so the stall current and K both shrink the stall torque.' },
    { q: 'A 12 V motor has a terminal resistance of 0.8 Ω. What current does it draw at stall?', answer: 15, unit: 'A', why: 'With no back-EMF, I = V/R = 12/0.8 = 15 A.' },
    { q: 'A ferrite motor is most at risk of being demagnetised by a current surge when it is cold.', a: true, why: 'The coercivity of ferrite falls as it cools, so the opposing field of the armature current does more lasting damage on a cold morning. NdFeB is the other way round.' }
  ],
  problems: [
    { q: 'A motor datasheet gives $K_v$ = 300 rpm/V. What is its torque constant?', answer: 0.0318, unit: 'N·m/A', tol: 0.02, steps: ['$K = 60/(2\\pi \\times 300) = 0.0318$ V·s/rad = 0.0318 N·m/A.'] },
    { q: 'A winding may rise 70 K above the air; its hot resistance is 1.2 Ω and its thermal resistance 5 K/W. What current can it carry continuously?', answer: 3.42, unit: 'A', tol: 0.02, steps: ['$I = \\sqrt{70/(1.2 \\times 5)} = \\sqrt{11.7} = 3.42$ A.'] }
  ],
  choose: {
    good: [
      'Battery-powered and 12/24/48 V equipment: one switch, a PWM chopper or an H-bridge controls it.',
      'Low-cost products made in quantity: car accessories, pumps, toys, appliances, actuators.',
      'Gearmotors that must give torque at low speed from a small, cheap package.',
      'Loads that need strong torque from standstill with simple control.'
    ],
    avoid: [
      'Long continuous running at high speed: brushes wear out in thousands of hours — a brushless motor lasts far longer.',
      'Explosive atmospheres, and equipment that must be electrically quiet: the commutator sparks.',
      'Precise positioning without feedback: add an encoder, or choose a stepper or servo.'
    ],
    check: [
      'The continuous torque and speed at your voltage and ambient temperature, not the stall figures.',
      'The peak (demagnetisation) current against your driver\'s current limit.',
      'Brush life at your speed and duty, and whether the brushes can be replaced.',
      'Bearing type (sleeve or ball) against any side load from a belt or pinion.',
      'The interference your product may emit, and the suppression it needs.'
    ]
  },
  applications: [
    'Cars: a typical car has dozens of small PMDC motors — wipers, windows, mirrors, seats, fans, pumps, locks.',
    'Cordless tools and garden equipment on 12–36 V battery packs (brushless motors are taking over the premium end).',
    'Treadmills and small conveyors: 90 V or 180 V PMDC motors on thyristor or PWM drives from the mains.',
    'Compare motors in [the motor lab](#/tools/motorlab/dc): enter V, R and K and see the operating point.'
  ],
  history: 'Early magnets of hardened steel, and AlNiCo from the 1930s, were too weak or too easily demagnetised for anything but small motors, so most DC machines had wound fields. Ferrite magnets (from the 1950s) made cheap PMDC motors practical for cars, toys and appliances; samarium–cobalt (from the late 1960s) and neodymium–iron–boron (from the mid-1980s) made them small and powerful.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: the chapter on conventional DC motors (torque, back-EMF, the equivalent circuit).',
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: permanent-magnet materials, temperature coefficients and demagnetisation (the same magnets are used in PMDC motors).',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.',
    'Manufacturers\' datasheets for small DC motors: speed and torque constants, terminal resistance, thermal resistances and maximum permissible winding temperature.'
  ],
  sim: ['dc-pmdc-cutaway', 'ref-dc-motor']
},

{
  id: 'series-dc-motor', parent: 'dc-types', title: 'The series-wound DC motor', level: 2,
  short: 'The field winding carries the armature current, so the flux grows with the load: torque rises with the square of the current, giving the strongest starting torque of any DC motor — and the speed falls steeply with load and races away when the load is lost.',
  keywords: ['series motor', 'series-wound', 'series field', 'starter motor', 'traction motor', 'winch motor', 'crane motor', 'runaway', 'overspeed', 'field diverter', 'series-parallel control', 'D1 D2', 'S1 S2', 'reversing a series motor'],
  prereq: ['pmdc-motor', 'magnetic-circuits', 'dc-torque-speed'],
  related: ['shunt-dc-motor', 'compound-dc-motor', 'universal-motor', 'dc-braking', 'motors-conveyors-hoists', 'motors-vehicles', 'load-torque-types'],
  body: `
In a series motor the field winding — a few turns of heavy copper on each pole — is connected **in series** with the armature. The same current makes the flux and flows through the armature conductors. Nothing else about the machine changes: the commutator and brushes work exactly as in any DC motor. But because the flux now depends on the load, the behaviour is completely different. In the sim, choose *series* and raise the load: the operating point slides down a steep curve instead of a flat line.

| Terminal (IEC 60034-8) | North American marking | Winding |
|---|---|---|
| A1–A2 | A1–A2 | armature (through the brushes) |
| B1–B2 | — | interpoles, if brought out (usually connected inside) |
| D1–D2 | S1–S2 | series field |

### Torque grows with the square of the current
Below saturation the flux is proportional to the current, so the back-EMF is $E = k\\,I\\,\\omega$ and the torque is

$$T = k\\,I^2$$

([[?exponent|a square law]]). Twice the current gives nearly four times the torque; once the iron saturates, perhaps three times. A permanent-magnet or shunt motor given twice the current gives only twice the torque. That is why series motors start engines, lift cranes and winches and pulled trams and trains for a century: **the most starting torque per ampere** of any DC motor, which is also the most torque per ampere a battery or a supply line can deliver.

### Speed falls steeply — and races when the load goes
The voltage balance is the same as always, $V = I R + E$, so

$$\\omega = \\frac{V - I R}{k\\,I}$$

Light load means little current, little flux and therefore high speed. Neglecting the resistance, $T \\approx V^2/(k\\,\\omega^2)$: torque [[?inverse|inversely]] proportional to the square of speed. A series motor adapts itself: a crane lifts a heavy load slowly and a light hook fast, drawing roughly constant power. Take a 24 V, 2 kW traction motor with $R$ = 0.03 Ω and $k$ = 0.001 N·m/A² (ignoring saturation):

| Load torque | Current | Speed | Output |
|---|---|---|---|
| 2.5 N·m (a quarter) | 50 A | 4 300 rpm | 1.1 kW |
| 10 N·m (rated) | 100 A | 2 000 rpm | 2.1 kW |
| 22.5 N·m | 150 A | 1 240 rpm | 2.9 kW |
| 40 N·m (starting) | 200 A | 860 rpm | 3.6 kW |

The other side of the same equation is **runaway**: with no load the current and the flux fall towards zero and the speed climbs until friction and windage balance it — often far beyond what the armature can survive. Coils are flung from their slots and commutators burst. Press *Throw off the load* in the sim: the overspeed trip opens the supply at 2.2 times rated speed.

> [!warn] Never run a large series motor without load, and never drive a load through a belt or a clutch that can slip or break: couple it by gears or directly. Traction and hoist controllers include overspeed protection. Small series motors (the universal motors in tools) survive only because their own fan and friction load them.

### Reversing
Swapping the two supply leads reverses **both** the field and the armature current, so the torque keeps its direction — the motor runs the same way. (That is also why it runs on AC: see [[universal-motor]].) To reverse it, reverse the armature relative to the field: a pair of reversing contactors or a drum switch exchanges A1 and A2 while D1–D2 stay put.

| Direction | Connection |
|---|---|
| Forward | + → A1, A2 → D1, D2 → − |
| Reverse | + → A2, A1 → D1, D2 → − |

### Speed control and braking
Old tram and crane controllers cut series resistors out step by step and switched pairs of motors from series to parallel; a **field diverter**, a resistor across the field, weakened the flux for more speed. Battery forklifts and golf cars used series motors with transistor or thyristor choppers for decades; newer machines mostly use AC induction or permanent-magnet motors. Braking is awkward: as a generator the series field must be reversed relative to the armature to build up, so series motors are usually braked by **plugging** (reversing against the rotation, see [[dc-braking]]), by dynamic braking with a reconnected field, or mechanically.

### In service
An engine starter draws roughly 100–300 A in a car and several hundred amperes on a truck diesel, for seconds: it is rated for **short-time duty**, and most vehicle makers advise cranking in bursts of about 10–15 s with pauses to cool. Vehicle-mounted winches draw several hundred amperes at full pull and overheat in minutes. The brushes and commutator of a series motor work hard at these currents: check them first when torque fades. Many modern car starters use permanent magnets and a planetary reduction gear instead; heavy-duty starters are still series-wound.

> [!key] A series motor trades a stable speed for enormous starting torque: $T \\propto I^2$, speed falls steeply with load, and without load it runs away. Use it for starting, lifting and traction — always coupled to its load.
`,
  ideas: [
    'The field carries the armature current, so the flux rises with the load and the torque with the square of the current.',
    'Speed falls steeply as the load rises, roughly as 1/√T: heavy loads move slowly, light ones fast, at roughly constant power.',
    'With no load the flux collapses and the speed runs away: never belt-drive or unload a large series motor.',
    'Swapping the supply leads does not reverse it; reverse the armature relative to the field.',
    'Its short-time rating matters: starters and winches are built for seconds or minutes, not hours.'
  ],
  pitfalls: [
    'Swapping the supply leads reverses a series motor — Both the field and the armature current reverse, so the torque keeps its sign; only reversing one winding relative to the other reverses the motor.',
    'A series motor has a no-load speed like a PM motor — Its flux vanishes with the current, so its speed has no natural limit short of friction and windage; unloaded it can destroy itself.',
    'Twice the current always gives four times the torque — Only while the iron is unsaturated; near rated current and above, the flux grows more slowly and the torque rises more like 3× for 2× current.'
  ],
  formulas: [
    {
      name: 'Torque of a series motor (unsaturated)',
      expr: 'T = k*I^2', tex: 'T = k\\,I^2',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        k: { name: 'series motor constant', q: false, unit: 'N·m/A²', value: 0.001 },
        I: { name: 'current', q: 'current', unit: 'A', value: 100 }
      },
      note: 'Valid below saturation; at high current the torque rises more slowly than I².',
      stories: { T: 'A series motor with k = {k} draws {I}. What torque does it give?', I: 'A series motor with k = {k} must start a load needing {T}. What current does it need?' }
    },
    {
      name: 'Speed of a series motor',
      expr: 'w = (V - I*R)/(k*I)', tex: '\\omega = \\dfrac{V - I\\,R}{k\\,I}',
      vars: {
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        I: { name: 'current', q: 'current', unit: 'A', value: 100 },
        R: { name: 'armature plus field resistance', q: 'resistance', unit: 'Ω', value: 0.03 },
        k: { name: 'series motor constant', q: false, unit: 'V·s/(rad·A)', value: 0.001 }
      },
      note: 'k in V·s/(rad·A) is the same number as in N·m/A². The speed rises without limit as the current falls.',
      stories: { w: 'A {V} series motor (R = {R}, k = {k}) draws {I}. How fast does it run?' }
    },
    {
      name: 'The series characteristic (resistance neglected)',
      expr: 'T = V^2/(k*w^2)', tex: 'T = \\dfrac{V^2}{k\\,\\omega^2}',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        k: { name: 'series motor constant', q: false, unit: 'N·m/A²', value: 0.001 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 2000, tex: '\\omega' }
      },
      note: 'An upper bound that shows the shape: halving the speed quadruples the torque; as the torque goes to zero the speed goes to infinity.',
      stories: { w: 'Neglecting resistance, at what speed does a {V} series motor with k = {k} give {T}?' }
    }
  ],
  examples: [
    {
      title: 'A quarter of the load',
      q: 'The 24 V traction motor of the text (R = 0.03 Ω, k = 0.001 N·m/A²) runs at rated torque, 10 N·m. The load falls to 2.5 N·m. Find the new current and speed.',
      steps: [
        '$I = \\sqrt{T/k} = \\sqrt{2.5/0.001} = 50$ A (it was 100 A).',
        '$\\omega = (24 - 50 \\times 0.03)/(0.001 \\times 50) = 22.5/0.05 = 450$ rad/s = 4 300 rpm.',
        'At rated load it ran at $(24 - 3)/0.1 = 210$ rad/s = 2 005 rpm: a quarter of the torque more than doubles the speed.'
      ],
      a: '50 A and about 4 300 rpm — more than twice the rated speed.'
    },
    {
      title: 'Why the leads do not reverse it',
      q: 'A hoist\'s series motor is connected + → A1, A2 → D1, D2 → −. An electrician swaps the two supply leads. Which way does it run, and how would you reverse it?',
      steps: [
        'After the swap, current enters at D2 and leaves at A1: it flows backwards through both windings.',
        'Reversing the field current reverses the flux; reversing the armature current reverses the force on each conductor. Two reversals cancel: the torque is unchanged.',
        'To reverse the motor, reverse one winding only: + → A2, A1 → D1, D2 → −.'
      ],
      a: 'It runs the same way; reverse A1 and A2 (or D1 and D2), not the supply.'
    }
  ],
  quiz: [
    { q: 'A series motor\'s current doubles (below saturation). Its torque becomes about…', choices: ['four times as large', 'twice as large', 'the same', 'half as large'], a: 0, why: 'Flux and armature current both double, so T = kI² quadruples. With saturation, somewhat less.' },
    { q: 'Why must a large series motor never be belt-driven?', choices: ['If the belt slips or breaks the motor loses its load and runs away', 'Belts cannot take the starting torque', 'The field would reverse', 'Belts cause brush sparking'], a: 0, why: 'With no load its flux falls with its current and nothing limits its speed but friction and windage.' },
    { q: 'Swapping the two supply leads of a series motor reverses its rotation.', a: false, why: 'Both the field and the armature currents reverse; the torque keeps its sign. Reverse the armature relative to the field instead.' },
    { q: 'A crane hook with a light load rises much faster than with a heavy one when driven by a series motor. Why?', choices: ['Less current means less flux, so the motor must turn faster to make the same back-EMF', 'The gearbox changes ratio', 'The brushes shift', 'The supply voltage rises at light load'], a: 0, why: 'E = kIω must be close to V; with a small I the speed ω has to be large.' }
  ],
  problems: [
    { q: 'A series motor has k = 0.002 N·m/A² (unsaturated). What current does it need to give 50 N·m?', answer: 158, unit: 'A', tol: 0.02, steps: ['$I = \\sqrt{T/k} = \\sqrt{50/0.002} = \\sqrt{25\\,000} = 158$ A.'] },
    { q: 'A 48 V series motor with R = 0.05 Ω and k = 0.002 V·s/(rad·A) draws 120 A. Find its speed in rpm.', answer: 1671, unit: 'rpm', tol: 0.02, steps: ['$\\omega = (48 - 120 \\times 0.05)/(0.002 \\times 120) = 42/0.24 = 175$ rad/s.', '$n = 175 \\times 60/(2\\pi) = 1\\,671$ rpm.'] }
  ],
  choose: {
    good: [
      'Short, heavy starts: engine starters, vehicle winches, hoists and cranes.',
      'Traction on DC supplies (historically trams, trains, forklifts, golf cars): high torque at low speed, natural speed rise when lightly loaded.',
      'Loads that are never removed, coupled by gears or directly.'
    ],
    avoid: [
      'Any load that can disappear — belts, clutches, fans that can be disconnected: the motor runs away.',
      'Constant-speed duties: its speed changes greatly with load.',
      'Regenerative braking and frequent reversing: the field must be reconnected to generate.'
    ],
    check: [
      'The short-time rating (seconds or minutes) against your duty cycle.',
      'Overspeed protection and a positive coupling to the load.',
      'Reversing wiring: armature reversed relative to the field.',
      'Brush and commutator condition at your peak currents; cable and fuse sizes for hundreds of amperes.'
    ]
  },
  applications: [
    'Engine starters: heavy-duty diesel starters are series-wound; many car starters now use permanent magnets with a reduction gear.',
    'Vehicle and boat winches on 12/24 V, drawing several hundred amperes at full pull.',
    'DC traction for a century of trams, underground trains and locomotives, and battery forklifts until AC drives took over.',
    'The universal motor of drills, grinders and vacuum cleaners is a series motor built to run on AC.'
  ],
  history: 'Series motors dominated electric traction from the first practical electric street railways of the late 1880s until power electronics made induction and permanent-magnet traction motors practical at the end of the twentieth century. Their steep characteristic suited a tram: full torque to pull away, rising speed as the load fell.',
  sources: [
    'Chapman, *Electric Machinery Fundamentals*: the DC motor chapter (series, shunt and compound characteristics).',
    'Hughes and Drury, *Electric Motors and Drives*: series and universal motors.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation* (letters A, B, D for armature, interpoles and series field); NEMA MG 1 for the North American markings.'
  ],
  sim: { id: 'dc-wound-field', params: { type: 'series' } }
},

{
  id: 'shunt-dc-motor', parent: 'dc-types', title: 'The shunt-wound DC motor', level: 2,
  short: 'The field winding is fed with its own, nearly constant current, so the motor behaves like a permanent-magnet motor with an adjustable magnet: nearly constant speed under load, armature-voltage control up to base speed and field weakening above it.',
  keywords: ['shunt motor', 'shunt-wound', 'separately excited', 'field winding', 'field weakening', 'base speed', 'constant power', 'armature voltage control', 'speed regulation', 'field loss', 'thyristor DC drive', 'SCR drive', 'starter', 'E1 E2', 'F1 F2'],
  prereq: ['pmdc-motor', 'magnetic-circuits', 'dc-torque-speed'],
  related: ['series-dc-motor', 'compound-dc-motor', 'dc-motor-drivers', 'dc-braking', 'tachogenerators', 'load-torque-types', 'motor-protection'],
  body: `
In a shunt motor the field winding — many turns of fine wire on each pole — is connected **across** the supply, in parallel with the armature, or fed from a separate field supply (a **separately excited** motor). Either way the field current, and so the flux, hardly depends on the load. The motor then behaves like a permanent-magnet motor whose magnet strength you can set: the back-EMF is $E = L_{af} I_f\\,\\omega$ and the torque $T = L_{af} I_f\\,I_a$, where $L_{af}$ is the mutual inductance between field and armature (in henries) and $I_f$ the field current. In the sim, choose *shunt*: the speed line is almost flat, like a PMDC motor's.

| Terminal (IEC 60034-8) | North American marking | Winding |
|---|---|---|
| A1–A2 | A1–A2 | armature |
| E1–E2 | F1–F2 | shunt field (on the same supply) |
| F1–F2 | F1–F2 | separately excited field |

### Nearly constant speed
Take a 15 kW, 440 V, 1 500 rpm motor: $R_a$ = 0.6 Ω, rated armature current 38 A, field 1.5 A with $L_{af}$ = 1.77 H. At rated load $E = 440 - 38 \\times 0.6 = 417$ V and $\\omega = 417/(1.77 \\times 1.5) = 157$ rad/s — 1 500 rpm. With the load removed the current falls to about 2 A and the speed rises only to about 1 580 rpm. The **speed regulation**, $(n_0 - n)/n$, is about 5 %: typically 5–10 % for small shunt motors and 2–5 % for large ones. A drive that measures the armature voltage and adds IR compensation holds speed to about 1–2 %; with a [[tachogenerators|tachogenerator]] or encoder, 0.1 % or better.

### Two ways to control speed
1. **Armature voltage**, with full field: speed rises in proportion to the voltage from zero to the **base speed**, with rated torque available all the way (the constant-torque region).
2. **Field weakening**, with rated armature voltage: reducing $I_f$ reduces the flux, so the motor must spin faster to make the same back-EMF. Above base speed the torque available at rated current falls as $T_b\\,n_b/n$ — [[?inverse|inversely]] with speed — while the power stays constant (the constant-power region). A typical range is 1 : 2 to 1 : 4 (base 1 150 or 1 500 rpm, top 2 300–4 500 rpm), limited by commutation and the mechanical strength of the armature. The field-weakening sim shows both regions.

| Region | Armature voltage | Field | Torque available | Power available |
|---|---|---|---|---|
| 0 to base speed | rises with speed | full | rated (constant) | rises with speed |
| base to top speed | rated | weakened | falls as 1/n | rated (constant) |

Winders, paper-machine reels and machine-tool spindles have exactly this demand, which kept shunt motors in steel, paper and printing mills for a century.

### Starting
At standstill there is no back-EMF: a 440 V motor with 0.6 Ω across it would draw 730 A. Old installations used a starter — a rheostat of 4–6 steps cut out as the motor gathered speed, with a **no-volt release** coil held in by the field current, so that a lost field or supply dropped the starter back to *off*. To start at twice rated current the resistance is $V/I - R_a = 440/76 - 0.6 = 5.2$ Ω. Today a thyristor (SCR) drive or a PWM converter simply ramps the armature voltage with a current limit.

### Drives
- Single-phase thyristor drives from 120 V or 230 V mains give 90 V or 180 V armatures, up to a few kW, with a field supply of about 100 V or 200 V.
- Three-phase six-pulse thyristor bridges from 400 V mains give armatures of about 400–500 V, from a few kW to megawatts. A second, antiparallel bridge makes the drive **four-quadrant**: it can reverse and regenerate into the mains.
- The drive's current ripple heats the motor more than pure DC; nameplates of motors for rectified supplies state the **form factor** they tolerate.

### Field loss — the dangerous fault
If the field circuit opens while the motor runs, the flux falls to the small residual value. The back-EMF collapses, the armature current surges, and a lightly loaded motor accelerates towards destruction while a loaded one stalls with an enormous current. Drives therefore monitor the field current (**field-loss** protection) and trip at once.

> [!warn] Never open the field circuit of a running shunt motor, and never switch off the field before the armature. The field winding also stores energy: opening it suddenly makes a high voltage that can break its insulation — drives fit a discharge resistor or diode. Armature, field and drive DC links are at mains potential: isolate, lock off and prove dead before touching the terminal box.

> [!key] A shunt motor is a PM motor with an adjustable field: nearly constant speed, armature voltage below base speed, field weakening above it, constant power up there — and field loss is its runaway fault.
`,
  ideas: [
    'The field current is set independently of the load, so the speed changes only a few per cent from no load to full load.',
    'Below base speed, control the armature voltage (constant torque); above it, weaken the field (constant power).',
    'At standstill only the armature resistance limits the current: start with a resistor or a current-limited drive.',
    'Losing the field makes the motor race or draw a huge current: field-loss protection is essential.'
  ],
  pitfalls: [
    'Weakening the field slows the motor down — The opposite: less flux means the armature must spin faster to make the same back-EMF; field weakening raises the speed.',
    'Above base speed the motor still gives its rated torque — With the field weakened, rated current makes less torque; the torque falls as base speed over speed, and only the power stays constant.',
    'A shunt motor is safe to start directly on its supply because its speed is regulated — At standstill there is no back-EMF: the armature current would be many times rated.'
  ],
  formulas: [
    {
      name: 'Speed of a shunt or separately excited motor',
      expr: 'w = (V - Ra*Ia)/(Laf*If)', tex: '\\omega = \\dfrac{V - R_a I_a}{L_{af} I_f}',
      vars: {
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        V: { name: 'armature voltage', q: 'voltage', unit: 'V', value: 440 },
        Ra: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.6, tex: 'R_a' },
        Ia: { name: 'armature current', q: 'current', unit: 'A', value: 38, tex: 'I_a' },
        Laf: { name: 'field–armature mutual inductance', q: 'inductance', unit: 'H', value: 1.771, tex: 'L_{af}' },
        If: { name: 'field current', q: 'current', unit: 'A', value: 1.5, tex: 'I_f' }
      },
      note: 'L_af·I_f is the motor constant K. Saturation makes L_af smaller at high field current.',
      stories: { w: 'A {V} shunt motor (Ra = {Ra}, L_af = {Laf}) draws {Ia} with a field of {If}. How fast does it run?', If: 'What field current makes a {V} motor (Ra = {Ra}, L_af = {Laf}) run at {w} while drawing {Ia}?' }
    },
    {
      name: 'Torque of a shunt motor',
      expr: 'T = Laf*If*Ia', tex: 'T = L_{af} I_f\\,I_a',
      vars: {
        T: { name: 'electromagnetic torque', q: 'torque', unit: 'N·m' },
        Laf: { name: 'field–armature mutual inductance', q: 'inductance', unit: 'H', value: 1.771, tex: 'L_{af}' },
        If: { name: 'field current', q: 'current', unit: 'A', value: 1.5, tex: 'I_f' },
        Ia: { name: 'armature current', q: 'current', unit: 'A', value: 38, tex: 'I_a' }
      },
      note: 'The shaft torque is smaller by the friction and iron-loss torque.',
      stories: { Ia: 'A motor with L_af = {Laf} and a field of {If} must give {T}. What armature current does it need?' }
    },
    {
      name: 'Speed regulation',
      expr: 'SR = (n0 - n)/n', tex: '\\mathrm{SR} = \\dfrac{n_0 - n}{n}',
      vars: {
        SR: { name: 'speed regulation', q: 'ratio', unit: '%', tex: '\\mathrm{SR}' },
        n0: { name: 'no-load speed', q: 'angvel', unit: 'rpm', value: 1577, tex: 'n_0' },
        n: { name: 'full-load speed', q: 'angvel', unit: 'rpm', value: 1500 }
      },
      stories: { SR: 'A motor runs at {n0} unloaded and {n} at full load. What is its speed regulation?' }
    },
    {
      name: 'Starting resistance',
      expr: 'Rs = V/Is - Ra', tex: 'R_s = \\dfrac{V}{I_s} - R_a',
      vars: {
        Rs: { name: 'series starting resistance', q: 'resistance', unit: 'Ω', tex: 'R_s' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 440 },
        Is: { name: 'allowed starting current', q: 'current', unit: 'A', value: 76, tex: 'I_s' },
        Ra: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.6, tex: 'R_a' }
      },
      note: 'The first step of a resistance starter; later steps are cut out as the back-EMF builds up.',
      stories: { Rs: 'A {V} motor with Ra = {Ra} may draw at most {Is} at start. What resistance must be in series?' }
    },
    {
      name: 'Torque available above base speed',
      expr: 'T = Tb*nb/n', tex: 'T = T_b\\,\\dfrac{n_b}{n}',
      vars: {
        T: { name: 'torque available at rated current', q: 'torque', unit: 'N·m' },
        Tb: { name: 'rated torque at base speed', q: 'torque', unit: 'N·m', value: 101, tex: 'T_b' },
        nb: { name: 'base speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_b' },
        n: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3000 }
      },
      note: 'The field-weakening (constant-power) region, between base speed and the maximum speed on the nameplate.',
      stories: { T: 'A motor gives {Tb} at its base speed of {nb}. How much torque can it give at {n} with the field weakened?' }
    }
  ],
  examples: [
    {
      title: 'Speed and regulation of a 15 kW motor',
      q: 'A 440 V shunt motor has $R_a$ = 0.6 Ω, $L_{af}$ = 1.771 H and a field current of 1.5 A. It draws 38 A at full load and 2 A at no load. Find both speeds and the speed regulation.',
      steps: [
        'Full load: $\\omega = (440 - 0.6 \\times 38)/(1.771 \\times 1.5) = 417.2/2.657 = 157.0$ rad/s = 1 500 rpm.',
        'No load: $\\omega = (440 - 1.2)/2.657 = 165.2$ rad/s = 1 577 rpm.',
        'Speed regulation $(1\\,577 - 1\\,500)/1\\,500 = 5.2$ %.'
      ],
      a: '1 500 rpm loaded, 1 577 rpm unloaded, a regulation of about 5 %.'
    },
    {
      title: 'Twice the base speed by weakening the field',
      q: 'The same motor must run at 3 000 rpm for a light, fast pass. Estimate the field current needed and the torque it can then give at rated armature current.',
      steps: [
        'At rated armature voltage and current $E$ stays 417 V, so $L_{af}I_f$ must halve: $I_f \\approx 0.75$ A (in a real, saturated motor a little more, from its magnetisation curve).',
        'Torque at 38 A: $T = 1.771 \\times 0.75 \\times 38 = 50.5$ N·m, half the 101 N·m at base speed.',
        'Power $50.5 \\times 314 = 15.9$ kW: the same as at base speed — the constant-power region.'
      ],
      a: 'About 0.75 A of field; half the torque at the same power.'
    }
  ],
  quiz: [
    { q: 'A shunt motor runs above base speed with a weakened field. To go faster still, you…', choices: ['reduce the field current further', 'increase the field current', 'raise the armature voltage above its rating', 'reverse the field'], a: 0, why: 'Less flux means a higher speed for the same back-EMF. The armature voltage is already at its rating in this region.' },
    { q: 'The field circuit of a lightly loaded shunt motor breaks while it runs. What happens?', choices: ['The speed and the armature current rise sharply — it can run away', 'It stops gently', 'Nothing: the armature keeps it going', 'It reverses'], a: 0, why: 'Only residual flux remains, so the back-EMF collapses; the current surges and the motor accelerates until something limits it. Field-loss protection trips the drive.' },
    { q: 'In the field-weakening region, at rated current, what stays roughly constant?', choices: ['The power', 'The torque', 'The field current', 'The speed'], a: 0, why: 'Voltage and current are at their ratings, so the power is fixed; the torque falls as the speed rises.' },
    { q: 'A 220 V shunt motor has an armature resistance of 0.5 Ω. What current would it draw if switched directly onto its supply at standstill?', answer: 440, unit: 'A', why: 'No back-EMF at standstill: I = 220/0.5 = 440 A — many times rated, hence starters and current-limited drives.' }
  ],
  problems: [
    { q: 'A shunt motor gives 60 N·m at its base speed of 1 750 rpm. How much torque can it give at 2 500 rpm in field weakening, at rated current?', answer: 42, unit: 'N·m', tol: 0.02, steps: ['$T = 60 \\times 1\\,750/2\\,500 = 42$ N·m.'] },
    { q: 'A 180 V motor has $R_a$ = 1.8 Ω. What series resistance limits its starting current to 20 A?', answer: 7.2, unit: 'Ω', tol: 0.02, steps: ['$R_s = 180/20 - 1.8 = 9 - 1.8 = 7.2$ Ω.'] }
  ],
  choose: {
    good: [
      'Wide speed ranges with constant power at the top: winders, reels, spindles, test benches.',
      'Existing DC plant: retrofitting a modern DC drive to a sound motor can be cheaper than replacing both.',
      'Precise speed from a simple drive, with regeneration by a four-quadrant thyristor bridge.'
    ],
    avoid: [
      'New installations where an induction motor and a VFD would do: no brushes, less maintenance.',
      'Dusty, wet or explosive places: open ventilated DC motors and their commutators suffer.',
      'Unattended sites where brushes cannot be inspected.'
    ],
    check: [
      'Base and top speed on the nameplate, and whether the load needs torque or power at the top.',
      'Field-loss and overspeed protection in the drive.',
      'Armature and field voltages and the form factor the motor accepts from your drive.',
      'Brush and commutator maintenance, and forced ventilation at low speed.'
    ]
  },
  applications: [
    'Paper, steel and printing mills: sections of a line held in exact speed ratio (many now converted to AC drives).',
    'Lifts and hoists of older buildings, fed from motor–generator sets and later thyristor drives.',
    'Dynamometers and test benches, where four-quadrant control and smooth low-speed torque matter.'
  ],
  history: 'Before power electronics, the Ward Leonard system (patented by H. Ward Leonard in the 1890s) varied a shunt motor\'s armature voltage by feeding it from its own generator, driven by a constant-speed motor — three machines for one adjustable drive. Mercury-arc rectifiers and then thyristors (from the 1960s) replaced the generator, and variable-frequency drives later replaced much of the DC motor itself.',
  sources: [
    'Chapman, *Electric Machinery Fundamentals*: shunt and separately excited DC motors, speed control and starting.',
    'Hughes and Drury, *Electric Motors and Drives*: DC motor drives, thyristor converters and field weakening.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: DC machine analysis with the field–armature mutual inductance.',
    'IEC 60034-8 (terminal markings E and F for shunt and separately excited fields); NEMA MG 1 for North American markings.'
  ],
  sim: [{ id: 'dc-wound-field', params: { type: 'shunt' } }, 'dc-field-weakening']
},

{
  id: 'compound-dc-motor', parent: 'dc-types', title: 'The compound-wound DC motor', level: 2,
  short: 'A shunt field and a series field on the same poles. Cumulative compounding (the fields aiding) gives more starting torque than a shunt motor and a drooping speed, but a safe no-load speed; differential compounding (opposing) is unstable and rarely used.',
  keywords: ['compound motor', 'cumulative compound', 'differential compound', 'long shunt', 'short shunt', 'stabilised shunt', 'flywheel', 'press', 'shear', 'speed droop', 'series field', 'shunt field'],
  prereq: ['series-dc-motor', 'shunt-dc-motor'],
  related: ['dc-torque-speed', 'dc-braking', 'load-torque-types', 'physics:rotational-kinetic-energy'],
  body: `
A compound motor carries both windings on each pole: a shunt field of many fine turns, fed with a steady current, and a series field of a few heavy turns carrying the armature current. It sits between its parents. The shunt field sets a safe no-load speed; the series field adds flux as the load grows. In the sim, choose *cumulative compound* and compare its curve with the shunt and series curves drawn beside it.

| Connection | What it means |
|---|---|
| **Cumulative** | the series field aids the shunt field: flux rises with load |
| **Differential** | the series field opposes the shunt field: flux falls with load |
| **Long shunt** | the shunt field is across the supply, outside the series field |
| **Short shunt** | the shunt field is across the armature only, inside the series field |
| **Stabilised shunt** | a shunt motor with a light cumulative series winding of a few turns |

Terminals: A1–A2 armature, D1–D2 series field, E1–E2 shunt field (IEC 60034-8); A, S and F in North American practice.

### Cumulative compound: torque and a controlled droop
With a shunt constant $K_{sh}$ and a series contribution $k_{se} I$ the motor constant becomes $K = K_{sh} + k_{se} I$, so

$$T = (K_{sh} + k_{se} I)\\,I, \\qquad \\omega = \\frac{V - I R}{K_{sh} + k_{se} I}$$

Take a 220 V motor with $K_{sh}$ = 1.0 V·s/rad, $k_{se}$ = 0.004 V·s/(rad·A) and $R$ = 0.5 Ω:

| Current | Motor constant | Torque | Speed |
|---|---|---|---|
| 1 A (no load) | 1.004 | 1 N·m | 2 090 rpm |
| 25 A (rated) | 1.10 | 27.5 N·m | 1 800 rpm |
| 50 A (overload) | 1.20 | 60 N·m | 1 550 rpm |

At 50 A a plain shunt motor with $K$ = 1.0 would give 50 N·m; the compound motor gives 60 N·m. Its speed regulation, $(2\\,090 - 1\\,800)/1\\,800 \\approx 16$ %, is typically 10–25 % for cumulative compound motors — much more than a shunt motor's 5 %, much less than a series motor's, and **the no-load speed is bounded** by the shunt field.

### Why a speed drop is useful: flywheels
A punch press, shear or forging hammer needs a huge torque for a fraction of a second. A flywheel supplies it, but a flywheel only gives up energy by slowing down: $\\Delta E = \\tfrac12 J(\\omega_1^2 - \\omega_2^2)$. A 2 kg·m² flywheel slowing from 1 800 to 1 500 rpm gives 10.9 kJ; held within 5 % by a stiff shunt motor it could give only about 3.5 kJ, and the motor itself would have to supply the peak. The compound motor's droop lets the flywheel do the work and keeps the motor current — and the supply — steadier. The same reasoning applies to crushers, compressors and conveyors with heavy starts.

### Differential compound: a warning
If the series field opposes the shunt field, the flux falls as the load rises and the speed may **rise** with load. The speed can then run away under load, and at start — when the current is large — the series field can overpower the shunt field and reverse the net flux, so the motor starts **backwards**. Differential compounding is avoided; it appears by accident when a compound motor is reversed wrongly.

> [!warn] To reverse a compound motor, reverse the **armature** only, leaving both fields as they are. Reversing only the shunt field (or only the series field) turns a cumulative motor into a differential one. After any rewiring, check the direction and the no-load speed with the load uncoupled but the overspeed trip set, and follow the motor's terminal-box diagram.

### Stabilised shunt motors
Armature reaction slightly weakens the field of a heavily loaded shunt motor, which raises its speed with load and can make it unstable. Large shunt motors therefore carry a light series winding — a few turns — that just cancels this effect: the stabilised shunt motor. In field weakening, where armature reaction matters most, this stabilising winding is important.

> [!key] Cumulative compounding buys extra starting torque and a controlled speed droop without the series motor's runaway — ideal with flywheels and heavy starts. Differential compounding is unstable; avoid it.
`,
  ideas: [
    'A compound motor has a shunt field for a safe no-load speed and a series field that adds flux, and torque, with load.',
    'Cumulative compounding gives a speed droop of typically 10–25 %, between a shunt and a series motor.',
    'A drooping speed lets a flywheel deliver energy to pulsed loads such as presses and shears.',
    'Differential compounding makes the speed rise with load and can start the motor backwards: avoid it.',
    'Reverse a compound motor by reversing the armature only.'
  ],
  pitfalls: [
    'A stiff speed is always better — For flywheel loads a drooping speed is what lets the flywheel give up its energy; a stiff motor must supply every peak itself.',
    'Reversing any one winding reverses a compound motor safely — Reversing only one field turns cumulative into differential compounding; reverse the armature.',
    'A compound motor can run away without load like a series motor — Its shunt field keeps a steady flux, so its no-load speed is bounded.'
  ],
  formulas: [
    {
      name: 'Torque of a compound motor',
      expr: 'T = (Ksh + kse*I)*I', tex: 'T = \\left(K_{sh} + k_{se} I\\right) I',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        Ksh: { name: 'shunt-field motor constant', q: 'ktorque', unit: 'N·m/A', value: 1.0, tex: 'K_{sh}' },
        kse: { name: 'series-field constant', q: false, unit: 'N·m/A²', value: 0.004, signed: true, tex: 'k_{se}' },
        I: { name: 'armature current', q: 'current', unit: 'A', value: 25 }
      },
      note: 'k_se is positive for cumulative, negative for differential compounding. Unsaturated iron assumed.',
      stories: { T: 'A compound motor with K_sh = {Ksh} and k_se = {kse} draws {I}. What torque does it give?' }
    },
    {
      name: 'Speed of a compound motor',
      expr: 'w = (V - I*R)/(Ksh + kse*I)', tex: '\\omega = \\dfrac{V - I\\,R}{K_{sh} + k_{se} I}',
      vars: {
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 220 },
        I: { name: 'armature current', q: 'current', unit: 'A', value: 25 },
        R: { name: 'armature plus series-field resistance', q: 'resistance', unit: 'Ω', value: 0.5 },
        Ksh: { name: 'shunt-field motor constant', q: 'kemf', unit: 'V·s/rad', value: 1.0, tex: 'K_{sh}' },
        kse: { name: 'series-field constant', q: false, unit: 'V·s/(rad·A)', value: 0.004, signed: true, tex: 'k_{se}' }
      },
      stories: { w: 'A {V} compound motor (R = {R}, K_sh = {Ksh}, k_se = {kse}) draws {I}. How fast does it run?' }
    },
    {
      name: 'Energy a flywheel gives up as it slows',
      expr: 'E = J*(w1^2 - w2^2)/2', tex: '\\Delta E = \\tfrac12 J\\left(\\omega_1^2 - \\omega_2^2\\right)',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'kJ', tex: '\\Delta E' },
        J: { name: 'flywheel inertia (at the motor shaft)', q: 'inertia', unit: 'kg·m²', value: 2 },
        w1: { name: 'speed before the stroke', q: 'angvel', unit: 'rpm', value: 1800, tex: '\\omega_1' },
        w2: { name: 'speed after the stroke', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega_2' }
      },
      note: 'Only the speed drop releases energy: a motor that holds speed stiffly keeps the flywheel from helping.',
      stories: { E: 'A {J} flywheel slows from {w1} to {w2} during a press stroke. How much energy does it deliver?', w2: 'A {J} flywheel at {w1} must deliver {E}. To what speed does it slow?' }
    }
  ],
  examples: [
    {
      title: 'Compound against shunt at an overload',
      q: 'The 220 V compound motor of the text ($K_{sh}$ = 1.0, $k_{se}$ = 0.004, $R$ = 0.5 Ω) is overloaded to 50 A. Compare its torque and speed with a shunt motor of the same $K$ = 1.0 and $R$ = 0.5 Ω.',
      steps: [
        'Compound: $K = 1.0 + 0.004 \\times 50 = 1.2$; $T = 1.2 \\times 50 = 60$ N·m; $\\omega = (220 - 25)/1.2 = 162.5$ rad/s = 1 550 rpm.',
        'Shunt: $T = 1.0 \\times 50 = 50$ N·m; $\\omega = (220 - 25)/1.0 = 195$ rad/s = 1 860 rpm.',
        'The compound motor gives 20 % more torque for the same current, and slows more.'
      ],
      a: 'Compound: 60 N·m at 1 550 rpm; shunt: 50 N·m at 1 860 rpm.'
    },
    {
      title: 'A press flywheel',
      q: 'A press flywheel reflects 2 kg·m² to the motor shaft. How much energy does it deliver if the speed falls from 1 800 to 1 500 rpm, and how much if it may fall only 5 %?',
      steps: [
        '$\\omega_1 = 188.5$ rad/s, $\\omega_2 = 157.1$ rad/s: $\\Delta E = \\tfrac12 \\times 2 \\times (188.5^2 - 157.1^2) = 10.9$ kJ.',
        'A 5 % drop, to 1 710 rpm = 179.1 rad/s: $\\Delta E = 188.5^2 - 179.1^2 = 3.5$ kJ.',
        'The drooping motor lets the flywheel deliver three times as much energy per stroke.'
      ],
      a: '10.9 kJ with a 300 rpm droop; about 3.5 kJ within 5 %.'
    }
  ],
  quiz: [
    { q: 'Why does a cumulative compound motor not run away at no load?', choices: ['Its shunt field keeps a steady flux', 'Its series field is shorted at no load', 'Its brushes limit the speed', 'It does run away'], a: 0, why: 'At no load the series field contributes almost nothing, but the shunt field still sets the flux and so the no-load speed.' },
    { q: 'Which load benefits most from a cumulative compound motor rather than a shunt motor?', choices: ['A punch press with a flywheel', 'A fan', 'A paper reel needing exact speed', 'A precision spindle'], a: 0, why: 'The speed droop lets the flywheel give up energy on each stroke, smoothing the motor current.' },
    { q: 'A technician reverses a cumulative compound motor by reversing the shunt field only. What has he made?', choices: ['A differential compound motor', 'A series motor', 'A shunt motor running backwards', 'A generator'], a: 0, why: 'The series field now opposes the shunt field; the motor may be unstable or start backwards. Reverse the armature instead.' },
    { q: 'A flywheel of 1 kg·m² slows from 200 rad/s to 180 rad/s. How much energy does it release?', answer: 3800, unit: 'J', why: '½ × 1 × (200² − 180²) = ½ × 7 600 = 3 800 J.' }
  ],
  problems: [
    { q: 'A 220 V compound motor has $K_{sh}$ = 1.2 V·s/rad, $k_{se}$ = 0.005 V·s/(rad·A) and $R$ = 0.4 Ω. Find its speed at 30 A.', answer: 1471, unit: 'rpm', tol: 0.02, steps: ['$K = 1.2 + 0.005 \\times 30 = 1.35$.', '$\\omega = (220 - 12)/1.35 = 154.1$ rad/s = 1 471 rpm.'] }
  ],
  choose: {
    good: [
      'Flywheel loads: presses, shears, punches, forging hammers.',
      'Heavy starts with a bounded no-load speed: crushers, compressors, loaded conveyors, older lifts.',
      'Large shunt drives that need stability in field weakening (a light stabilising series winding).'
    ],
    avoid: [
      'Exact constant speed: the droop is 10–25 %.',
      'Differential compounding in any form.',
      'New designs where an induction motor with a VFD and a flywheel would serve.'
    ],
    check: [
      'That the fields are cumulative: series and shunt magnetising the poles the same way.',
      'Reversing wiring: armature only.',
      'Speed droop at your load against the process, and the flywheel energy per stroke.'
    ]
  },
  applications: [
    'Mechanical presses, shears and punches with flywheels.',
    'Older lifts, hoists and rolling-mill auxiliaries.',
    'DC generators too: over-, flat- and under-compounding set how the output voltage changes with load.'
  ],
  sources: [
    'Chapman, *Electric Machinery Fundamentals*: cumulatively and differentially compounded DC motors.',
    'Hughes and Drury, *Electric Motors and Drives*: DC motor characteristics.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.'
  ],
  sim: { id: 'dc-wound-field', params: { type: 'cumulative' } }
},

{
  id: 'universal-motor', parent: 'dc-types', title: 'The universal motor', level: 2,
  short: 'A series motor with a laminated stator, so it runs on AC as well as DC: field and armature current reverse together and the torque keeps its direction. Very fast (10 000–40 000 rpm) and powerful for its size — the motor of drills, grinders, vacuum cleaners and mixers — but noisy, and its brushes wear quickly.',
  keywords: ['universal motor', 'AC series motor', 'drill motor', 'vacuum cleaner motor', 'angle grinder', 'blender', 'triac speed control', 'phase control', 'tachogenerator', 'carbon brushes', 'EMI suppression', 'X capacitor', 'Y capacitor', '16.7 Hz traction'],
  prereq: ['series-dc-motor', 'brushes-commutator', 'physics:ac-power'],
  related: ['psc-motor', 'bldc-motor', 'motor-noise', 'electronics:dc-motor-control', 'physics:reactance'],
  body: `
Feed a series motor with AC and something remarkable happens: when the current reverses, the field reverses with it, because they are the same current. The force on each armature conductor depends on the product of the two, so it keeps its direction. The torque, [[?proportional|proportional]] to $i^2$, pulses from zero to twice its average at **twice the mains frequency** (100 Hz on 50 Hz mains, 120 Hz on 60 Hz) but never reverses. To run on AC the stator must be **laminated** like a transformer core, or eddy currents would heat it; with that change a series motor becomes a *universal motor*, happy on AC or DC. The sim draws the voltage, current and torque over two mains cycles: watch the torque ride as a train of positive humps.

### Fast, light and powerful
Nothing in a universal motor is tied to the mains frequency, so it can spin as fast as its bearings and armature allow. That makes it the most powerful motor for its weight that plugs into a socket:

| Appliance | Typical input | Typical motor speed |
|---|---|---|
| Hand mixer, blender, food processor | 150–1 500 W | 10 000–30 000 rpm |
| Vacuum cleaner | 500–1 600 W | 20 000–40 000 rpm |
| Drill, hammer drill (geared down) | 500–1 200 W | 15 000–30 000 rpm |
| Angle grinder, circular saw, router | 700–2 500 W | 10 000–30 000 rpm |
| Older washing machines (belt drive) | 300–600 W | up to about 15 000 rpm |

A single-phase induction motor on 50 Hz can never exceed 3 000 rpm and is several times heavier for the same power. Efficiency is modest — typically 40–70 %, lower in the cheapest appliances — and the fan on the shaft takes a good part of the power.

### Why it runs slower on AC
On AC the windings' inductance adds a reactive voltage drop at right angles to the resistive one. With back-EMF $E = k\\,I\\,\\omega$ in phase with the current, $V^2 = (E + IR)^2 + (IX)^2$, so

$$\\omega = \\frac{\\sqrt{V^2 - (I X)^2} - I R}{k\\,I}$$

A 230 V, 1 kW motor with $R$ = 8 Ω, $X$ = 15 Ω and $k$ = 0.0136 V·s/(rad·A) runs at about 25 000 rpm drawing 5 A on AC, with an average torque $kI^2$ = 0.34 N·m; on 230 V DC at the same current it would run about 7 % faster. The speed falls steeply with load, as in every series motor: a drill slows audibly as you press.

### Speed control
The usual controller is a **triac phase control** — electrically a light dimmer: each half-cycle the triac is fired at an angle $\\alpha$ after the zero crossing, so the motor gets only the tail of each half-wave. For a resistive load the RMS voltage is $V\\sqrt{1 - \\alpha/\\pi + \\sin 2\\alpha/(2\\pi)}$: 163 V of 230 V at $\\alpha$ = 90°, 102 V at 120°. The motor's inductance stretches the current beyond the voltage zero, so the real waveform differs; the sim computes it. A plain phase control lets the speed sag with load; better tools and washing machines add a small **tachogenerator** (a magnet and a coil at the end of the shaft) and correct the firing angle to hold the speed. Angle grinders and saws have **soft starts** that ramp the firing angle, so the tool does not kick in the hand.

### Real life
- **Brushes wear fast** at these speeds: from a few hundred hours in cheap appliances to one or two thousand in tools with replaceable brushes. Many tool brushes have an **auto-stop**: a spring-loaded insulating pin that breaks the contact when the brush is worn, before the spring can score the commutator.
- **Interference**: every commutation sparks, and on AC worse than on DC, because the coil being commutated also has a transformer voltage induced by the alternating field. Appliances split the field into two coils, one on each side of the armature, which also act as chokes; add an X capacitor (typically 0.1–0.47 µF) across the supply and small Y capacitors (a few nF) to earth.
- **Noise and vibration**: brush noise, the fan's roar and the 100/120 Hz torque pulsation; a visible ring of sparks round the commutator means worn brushes or a damaged commutator.
- **Reversing**: swap the armature (brush) connections relative to the field. Some tools set the brushes slightly off neutral for one direction; run backwards they spark more.
- **No-load speed** is limited only by the fan and friction: never run a universal motor with its fan removed.

> [!warn] Universal-motor tools and appliances run from the mains: unplug them before changing brushes or opening them, keep double-insulated tools double-insulated (no metal parts added to the housing), and keep the suppression capacitors in place — a failed X capacitor can burn, so replace it only with a correctly rated safety capacitor.

> [!key] A universal motor is a series motor built to run on AC: torque always positive, pulsing at twice the mains frequency; very fast and light; speed set by a triac; limited by brush life, noise and interference.
`,
  ideas: [
    'Field and armature carry the same current, so on AC both reverse together and the torque keeps its direction.',
    'The torque pulses at twice the mains frequency but is never negative; its average is k·I²rms.',
    'Freed from the mains frequency it runs at 10 000–40 000 rpm, the lightest mains motor for its power.',
    'A triac phase control sets its speed; a tachogenerator holds it; soft starts ramp it.',
    'Its weak points are brush life (hundreds to a few thousand hours), noise and radio interference.'
  ],
  pitfalls: [
    'On AC the torque of a universal motor reverses a hundred times a second — Field and armature current reverse together, so the torque only pulsates; it never changes sign.',
    'It runs at the same speed on AC and DC of the same RMS voltage — The winding reactance takes part of the AC voltage, so it runs somewhat slower on AC.',
    'A triac controller lowers the voltage, so it lowers the torque at every speed — It lowers the speed for a given torque, like any voltage control; at stall the torque is still set by the current.'
  ],
  formulas: [
    {
      name: 'Average torque on AC',
      expr: 'T = k*I^2', tex: 'T_{avg} = k\\,I^2',
      vars: {
        T: { name: 'average torque', q: 'torque', unit: 'N·m', tex: 'T_{avg}' },
        k: { name: 'series motor constant', q: false, unit: 'N·m/A²', value: 0.01356 },
        I: { name: 'RMS current', q: 'current', unit: 'A', value: 5 }
      },
      note: 'Field and current are in phase (one current), so the average torque is k times the mean of i², the RMS current squared. Unsaturated iron.',
      stories: { T: 'A universal motor with k = {k} draws {I} RMS. What is its average torque?' }
    },
    {
      name: 'Speed of a universal motor on AC',
      expr: 'w = (sqrt(V^2 - (I*X)^2) - I*R)/(k*I)', tex: '\\omega = \\dfrac{\\sqrt{V^2 - (I X)^2} - I R}{k\\,I}',
      vars: {
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        V: { name: 'RMS supply voltage', q: 'voltage', unit: 'V', value: 230 },
        I: { name: 'RMS current', q: 'current', unit: 'A', value: 5 },
        X: { name: 'winding reactance at the mains frequency', q: 'resistance', unit: 'Ω', value: 15 },
        R: { name: 'winding resistance (field plus armature)', q: 'resistance', unit: 'Ω', value: 8 },
        k: { name: 'series motor constant', q: false, unit: 'V·s/(rad·A)', value: 0.01356 }
      },
      note: 'Set X = 0 for DC. The friction, fan and iron losses are not included.',
      stories: { w: 'A {V} universal motor (R = {R}, X = {X}, k = {k}) draws {I}. How fast does it run?' }
    },
    {
      name: 'RMS voltage after phase control',
      expr: 'Vr = V*sqrt(1 - alpha/pi + sin(2*alpha)/(2*pi))', tex: 'V_{rms} = V\\sqrt{1 - \\dfrac{\\alpha}{\\pi} + \\dfrac{\\sin 2\\alpha}{2\\pi}}',
      vars: {
        Vr: { name: 'RMS voltage delivered', q: 'voltage', unit: 'V', tex: 'V_{rms}' },
        V: { name: 'RMS mains voltage', q: 'voltage', unit: 'V', value: 230 },
        alpha: { name: 'firing angle after the zero crossing', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\alpha' }
      },
      note: 'Exact for a resistive load; the motor\'s inductance makes the current run on past the voltage zero.',
      stories: { Vr: 'A triac fires {alpha} after each zero crossing of {V} mains. What RMS voltage reaches the load?', alpha: 'At what firing angle does a triac deliver {Vr} RMS from {V} mains?' }
    }
  ],
  examples: [
    {
      title: 'A 1 kW motor on AC and DC',
      q: 'A 230 V universal motor has $R$ = 8 Ω, $X$ = 15 Ω at 50 Hz and $k$ = 0.01356. At a load where it draws 5 A, find its speed on AC and on 230 V DC, and its average torque.',
      steps: [
        'AC: $\\sqrt{230^2 - 75^2} = 217.4$ V; $E = 217.4 - 40 = 177.4$ V; $\\omega = 177.4/(0.01356 \\times 5) = 2\\,617$ rad/s = 24 990 rpm.',
        'DC: $E = 230 - 40 = 190$ V; $\\omega = 190/0.0678 = 2\\,802$ rad/s = 26 760 rpm — 7 % faster.',
        'Torque $kI^2 = 0.01356 \\times 25 = 0.34$ N·m either way; electromagnetic power on AC $EI$ = 887 W.'
      ],
      a: 'About 25 000 rpm on AC, 26 800 rpm on DC, 0.34 N·m.'
    },
    {
      title: 'Half speed with a triac?',
      q: 'A triac fires at 90° on 230 V mains. What RMS voltage does a resistive load receive, and why does a motor not simply run at 71 % speed?',
      steps: [
        '$V_{rms} = 230\\sqrt{1 - 0.5 + 0} = 163$ V, 71 % of 230 V.',
        'A series motor\'s speed depends on the load as well as the voltage, and its inductance keeps the current flowing past the voltage zero, changing the waveform.',
        'The speed therefore wanders with load; a tachogenerator loop is needed to hold it.'
      ],
      a: '163 V; the motor\'s speed depends on its load, so the firing angle sets a curve, not a speed.'
    }
  ],
  quiz: [
    { q: 'At what frequency does the torque of a universal motor pulsate on 50 Hz mains?', choices: ['100 Hz', '50 Hz', '25 Hz', 'It does not pulsate'], a: 0, why: 'Torque ∝ i², and the square of a 50 Hz sine has a 100 Hz component.' },
    { q: 'Why is the stator of a universal motor laminated, while a DC series motor may have a solid yoke?', choices: ['On AC the flux alternates and would induce eddy currents in solid iron', 'To make it lighter', 'To reduce brush wear', 'To raise the speed'], a: 0, why: 'An alternating flux induces circulating currents in solid iron; thin insulated laminations block them.' },
    { q: 'A universal motor on AC turns somewhat slower than on DC of the same voltage because…', choices: ['the winding reactance takes part of the AC voltage', 'the brushes drop more voltage on AC', 'AC has a lower peak voltage', 'the torque reverses'], a: 0, why: 'The reactive drop IX is at right angles to the rest, leaving less for the back-EMF.' },
    { q: 'An angle grinder motor spins at 25 000 rpm. Could a two-pole single-phase induction motor on 50 Hz do the same?', a: false, why: 'An induction motor is tied to the supply frequency: at most 3 000 rpm (a little less with slip) on 50 Hz with two poles.' }
  ],
  problems: [
    { q: 'A triac fires at 60° on 230 V mains. What RMS voltage does a resistive load receive?', answer: 206, unit: 'V', tol: 0.02, steps: ['$\\alpha = \\pi/3$: $1 - 1/3 + \\sin(120°)/(2\\pi) = 0.6667 + 0.1378 = 0.8045$.', '$V_{rms} = 230\\sqrt{0.8045} = 206$ V.'] },
    { q: 'A universal motor with k = 0.02 N·m/A² draws 4 A RMS. What is its average torque?', answer: 0.32, unit: 'N·m', tol: 0.02, steps: ['$T = 0.02 \\times 4^2 = 0.32$ N·m.'] }
  ],
  choose: {
    good: [
      'Hand-held mains tools and appliances that need high power in little weight: drills, grinders, saws, routers, vacuum cleaners, mixers.',
      'Short or intermittent duty where brush life of hundreds of hours is enough.',
      'Cheap variable speed from a triac.'
    ],
    avoid: [
      'Continuous duty and long life: choose an induction or a brushless motor.',
      'Quiet rooms and interference-sensitive equipment.',
      'Constant speed under a varying load, unless there is a tachogenerator loop.',
      'Dusty or explosive atmospheres: sparking.'
    ],
    check: [
      'Duty cycle and brush life; replaceable or auto-stop brushes.',
      'Interference limits for your product and the suppression components.',
      'Speed under load (it sags) and the controller: plain triac, feedback, soft start.',
      'Noise and cooling: the fan must stay fitted.'
    ]
  },
  applications: [
    'Power tools: drills, angle grinders, circular saws, routers, jigsaws (cordless tools use PM DC or brushless motors instead).',
    'Household appliances: vacuum cleaners, blenders, food processors, hair dryers; older washing machines with tachogenerator control.',
    'Being replaced by brushless motors in premium appliances for their longer life and lower noise.'
  ],
  history: 'Large AC series motors drove railways: several European countries electrified at 15 kV and a reduced frequency of 16⅔ Hz (now 16.7 Hz) because a low frequency eased the commutation of big AC commutator motors — a choice that still shapes their railway networks. In the home the same principle, scaled down, gave the twentieth century its vacuum cleaners and electric drills.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: the universal (AC series) motor and its speed control.',
    'Chapman, *Electric Machinery Fundamentals*: single-phase and special-purpose motors, including the universal motor.',
    'Mohan, *Electric Drives*: phase-controlled converters and their waveforms.'
  ],
  sim: 'dc-universal'
},

{
  id: 'brushes-commutator', parent: 'dc-types', title: 'Brushes and the commutator', level: 2,
  short: 'The mechanical switch that makes a DC motor work: copper segments on the shaft and carbon brushes sliding on them reverse each coil\'s current as it passes the neutral zone. How commutation works, why it sparks, what the brushes are made of, how fast they wear and how to keep them healthy.',
  keywords: ['commutator', 'carbon brush', 'electrographite', 'metal-graphite', 'precious-metal brushes', 'commutation', 'sparking', 'reactance voltage', 'interpoles', 'commutating poles', 'brush shift', 'neutral plane', 'armature reaction', 'patina', 'brush wear', 'undercutting', 'flashover', 'brush life'],
  prereq: ['pmdc-motor', 'back-emf', 'physics:inductance'],
  related: ['series-dc-motor', 'universal-motor', 'bldc-motor', 'maintenance-diagnostics', 'motor-failures', 'motor-noise', 'hazardous-areas'],
  body: `
The **commutator** is a cylinder of copper segments (bars), insulated from each other by thin mica and clamped on the shaft; each armature coil ends on two neighbouring segments. The **brushes** — blocks of carbon, held against the commutator by springs in brush holders and connected by flexible copper leads (shunts or pigtails) — feed the current in. As the rotor turns, each coil in turn is briefly shorted by a brush bridging its two segments, and during that moment its current must reverse completely. That reversal is **commutation**, and doing it cleanly is the whole art of a DC motor.

### Commutation in slow motion
A brush covers a segment for the **commutation time** $t_c = w_b/v$: brush width over surface speed. With a 10 mm brush on a 150 mm commutator at 1 500 rpm ($v$ = 11.8 m/s) that is 0.85 ms. In that time the coil current must swing from $+I_c$ to $-I_c$. If only the brush contact resistance acted, the current would reverse linearly, the brush sharing current between the two segments in proportion to its contact area (*resistance commutation*). But the coil has inductance, which fights the change with a **reactance voltage** $e_r \\approx L\\,2I_c/t_c$ — with 60 µH and 20 A, about 2.8 V. The reversal lags, and when the trailing segment leaves the brush the unfinished current has to jump the gap: a **spark**. The sim shows it: raise the speed or the current and watch the current curve fail to reach $-I_c$ before the segment leaves.

### The cures
| Method | How it helps | Where used |
|---|---|---|
| **Interpoles** (commutating poles) | small poles between the main poles, in series with the armature, induce in the commutating coil a voltage that cancels $e_r$ — right at every load and speed | almost every industrial DC motor above about 1 kW |
| **Brush shift** | moving the brushes off the neutral plane lets the main field supply the commutating voltage — right at one load only | small motors, universal motors |
| **High-resistance brushes** | more contact resistance forces a more linear reversal | small motors, universal motors |
| **Compensating windings** | conductors in the main pole faces cancel armature reaction under the poles | large, fast-reversing or heavily overloaded motors |
| **More segments, narrower brushes** | less inductance per coil, shorter time per coil | all designs |

Armature reaction — the armature's own field — twists the main field and moves the magnetic neutral with load; that is why a fixed brush shift is only right at one load, while interpoles, carrying the armature current, follow every load. Designers also keep the average voltage between neighbouring segments to roughly 15–20 V, or a flashover can run round the commutator.

### Brush materials
| Grade | Drop for a pair of brushes | Current density | Uses |
|---|---|---|---|
| Carbon-graphite | about 1.5–2.5 V | about 6–8 A/cm² | small, slower motors |
| Electrographite | about 1.5–3 V | about 8–12 A/cm² | industrial DC motors, universal motors |
| Resin-bonded graphite | about 2–5 V | about 6–10 A/cm² | hard commutation, universal motors |
| Metal-graphite (copper or silver) | about 0.2–1 V | about 15–30 A/cm² | low-voltage, high-current: starters, 12/24 V motors, slip rings |
| Precious metal (gold, silver, palladium alloys) | very low and steady | small currents | micro motors, instruments, low noise |

Values are typical; grades vary widely. The brush drop matters little at 400 V but costs 10–20 % of the voltage of a 12 V motor with carbon brushes — hence metal-graphite brushes in car motors. Springs press brushes at about 15–25 kPa in industrial motors, more where vibration is severe.

### Film, wear and life
A healthy commutator carries a thin, even **patina** of copper oxide and graphite, brown to dark grey. It lubricates the brushes and needs some moisture in the air: in very dry air (high altitude, heated winter rooms) brushes can wear many times faster. **Light load** is also bad: below a few A/cm² the film breaks down and the commutator grooves, so an oversized motor may wear brushes faster than a correctly loaded one. Oil, grease and silicone vapour ruin the film. Wear rises with speed, vibration, spring pressure errors, a commutator out of round and, above all, sparking — electrical wear.

Brushes are consumables. Small motors with non-replaceable brushes typically last 1 000–5 000 hours; industrial motors are inspected every few months and their brushes replaced at the wear mark, often about a third of the new length left. **Measure the wear over a known number of hours and extrapolate**: 20 mm of usable length wearing at 1.5 mm per 1 000 h lasts about 13 000 h.

| Symptom | Likely causes | What to do |
|---|---|---|
| Sparking at all loads | worn or wrong brushes, weak springs, brushes off neutral, rough or out-of-round commutator, high mica | replace and bed the brushes, set neutral, skim and undercut the commutator |
| Sparking that grows with load | overload, weak or wrongly connected interpoles | check the load and the interpole circuit |
| Fast wear, black dust | dry air, light load, vibration, oil or silicone contamination, wrong grade | correct the grade or number of brushes, clean, cure the cause |
| Grooves or threads on the commutator | light load, abrasive dust | fewer brushes, another grade, filtered cooling air |
| Every nth bar burnt | an open or high-resistance coil connection | repair the armature |
| Radio interference | sparking; missing suppression capacitor | cure the sparking, restore suppression |

> [!warn] Inspect brushes only with the motor stopped, isolated and locked off; commutator dust is conductive and lowers insulation resistance — remove it with a vacuum, not compressed air into the windings. Sparking brushes ignite flammable gases and dust: brushed motors need a certified enclosure in hazardous areas ([[hazardous-areas]]).

> [!key] Commutation reverses each coil's current in a millisecond or less; the coil's inductance resists, and whatever current is left over sparks. Interpoles, the right brush grade, a smooth filmed commutator and the right load keep a DC motor quiet and its brushes long-lived.
`,
  ideas: [
    'Each coil is shorted by a brush for the commutation time, brush width over surface speed — typically under a millisecond.',
    'The coil\'s inductance resists the reversal (the reactance voltage); unfinished reversal ends in a spark at the trailing edge.',
    'Interpoles cancel the reactance voltage at every load; a brush shift only at one load.',
    'The brush grade sets the contact drop and current density: metal-graphite for low voltage and high current, electrographite for industrial motors.',
    'Brush life depends on film, humidity, load, speed and sparking; measure the wear rate and extrapolate.'
  ],
  pitfalls: [
    'A little sparking means the brushes are about to fail — Slight, even sparking is normal in many motors; what matters is sparking that grows, blackened bars, or fast wear.',
    'An oversized, lightly loaded DC motor will make its brushes last longer — Too little current density breaks down the commutator film and can wear brushes faster; the number or grade of brushes may need to change.',
    'Any carbon brush that fits will do — Grades differ several-fold in contact drop, current density and commutating ability; use the grade the motor was designed for.'
  ],
  formulas: [
    {
      name: 'Commutation time',
      expr: 'tc = wb/(pi*D*n)', tex: 't_c = \\dfrac{w_b}{\\pi D\\,n}',
      vars: {
        tc: { name: 'commutation time', q: 'time', unit: 'ms', tex: 't_c' },
        wb: { name: 'brush width (in the direction of rotation)', q: 'length', unit: 'mm', value: 10, tex: 'w_b' },
        D: { name: 'commutator diameter', q: 'length', unit: 'mm', value: 150 },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 1500 }
      },
      note: 'πDn is the surface speed of the commutator. For a brush exactly one segment wide; wider brushes short several coils at once.',
      stories: { tc: 'A {wb} brush rides on a {D} commutator turning at {n}. How long does each coil have to reverse its current?' }
    },
    {
      name: 'Reactance voltage of the commutating coil',
      expr: 'er = L*2*Ic/tc', tex: 'e_r = L\\,\\dfrac{2 I_c}{t_c}',
      vars: {
        er: { name: 'reactance voltage', q: 'voltage', unit: 'V', tex: 'e_r' },
        L: { name: 'inductance of one coil', q: 'inductance', unit: 'µH', value: 60 },
        Ic: { name: 'current in one coil', q: 'current', unit: 'A', value: 20, tex: 'I_c' },
        tc: { name: 'commutation time', q: 'time', unit: 'ms', value: 0.85, tex: 't_c' }
      },
      note: 'The average voltage the coil\'s inductance sets against a linear reversal. Compare it with the brush contact drop of about a volt per brush.',
      stories: { er: 'A coil of {L} must reverse {Ic} in {tc}. What reactance voltage opposes it?' }
    },
    {
      name: 'Brush current density',
      expr: 'J = I/(nb*A)', tex: 'J = \\dfrac{I}{n_b A}',
      vars: {
        J: { name: 'current density at the brush face', q: 'currentdensity', unit: 'A/cm²' },
        I: { name: 'current through one brush arm', q: 'current', unit: 'A', value: 40 },
        nb: { name: 'brushes per arm', q: 'count', value: 2, int: true, tex: 'n_b' },
        A: { name: 'contact area of one brush', q: 'area', unit: 'cm²', value: 2.5 }
      },
      note: 'Aim for the grade\'s rated range: too high overheats, too low breaks down the film.',
      stories: { J: 'An arm of {nb} brushes of {A} each carries {I}. What is the current density?', nb: 'How many brushes of {A} are needed per arm to carry {I} at {J}?' }
    },
    {
      name: 'Brush life from a measured wear rate',
      expr: 't = 1000*u/r', tex: 't = \\dfrac{1000\\,u}{r}',
      vars: {
        t: { name: 'remaining life', q: false, unit: 'h' },
        u: { name: 'usable length left (to the wear mark)', q: false, unit: 'mm', value: 20 },
        r: { name: 'measured wear per 1 000 h', q: false, unit: 'mm/1000 h', value: 1.5 }
      },
      note: 'Measure the brush length at two inspections a known number of running hours apart.',
      stories: { t: 'Brushes have {u} left to the wear mark and wear {r}. How long will they last?' }
    }
  ],
  examples: [
    {
      title: 'Commutation in an industrial motor',
      q: 'A motor has a 150 mm commutator, brushes 10 mm wide, coils of 60 µH carrying 20 A each. Find the commutation time and the reactance voltage at 1 500 rpm and at 3 000 rpm (field weakening).',
      steps: [
        '1 500 rpm = 25 rev/s: $v = \\pi \\times 0.15 \\times 25 = 11.8$ m/s; $t_c = 0.010/11.8 = 0.85$ ms.',
        '$e_r = 60\\times10^{-6} \\times 40/0.85\\times10^{-3} = 2.8$ V.',
        'At 3 000 rpm $t_c$ halves to 0.42 ms and $e_r$ doubles to 5.7 V: commutation is harder at high speed, which is one limit on field weakening.'
      ],
      a: '0.85 ms and 2.8 V at 1 500 rpm; 0.42 ms and 5.7 V at 3 000 rpm.'
    },
    {
      title: 'Checking the brush current density',
      q: 'Each brush arm of a 40 A motor holds two brushes of 12.5 × 20 mm. Is the current density suitable for electrographite?',
      steps: [
        'Area of one brush $1.25 \\times 2.0 = 2.5$ cm²; two brushes, 5 cm².',
        '$J = 40/5 = 8$ A/cm².',
        'Within the typical 8–12 A/cm² for electrographite. At 10 A (a quarter load) it would be 2 A/cm² — low enough to risk film breakdown if the motor ran there for long.'
      ],
      a: '8 A/cm²: suitable at full load; watch for light-load wear.'
    }
  ],
  quiz: [
    { q: 'Where on a brush does the sparking of poor commutation appear?', choices: ['At the trailing edge, where the segment leaves the brush', 'At the leading edge', 'In the middle of the brush', 'At the brush shunt'], a: 0, why: 'The unfinished current reversal must be broken when the trailing segment loses contact: that interruption is the spark.' },
    { q: 'Why are interpoles better than shifting the brushes?', choices: ['They carry the armature current, so their correction follows every load', 'They are cheaper', 'They reduce the brush drop', 'They make the motor run faster'], a: 0, why: 'The reactance voltage is proportional to the current; interpoles in series with the armature produce a proportional correcting voltage. A brush shift is right at one load only.' },
    { q: 'A 12 V car motor would lose a large share of its voltage in ordinary carbon brushes. Which grade is usual there?', choices: ['Metal-graphite (copper-graphite)', 'Resin-bonded graphite', 'Hard carbon', 'Precious metal'], a: 0, why: 'Metal-graphite has a contact drop of only a few tenths of a volt and carries high current density.' },
    { q: 'Brushes on a lightly loaded, oversized DC motor can wear faster than on a correctly loaded one.', a: true, why: 'Too little current density breaks down the commutator film; the brushes then run on bare copper and wear, and the commutator grooves.' },
    { q: 'If a motor\'s speed doubles, the commutation time…', choices: ['halves and the reactance voltage doubles', 'doubles', 'stays the same', 'halves and the reactance voltage halves'], a: 0, why: 't_c = w_b/v: twice the surface speed, half the time; e_r = L·2I/t_c doubles.' }
  ],
  problems: [
    { q: 'A 6 mm brush rides on a 40 mm commutator at 6 000 rpm. What is the commutation time?', answer: 0.477, unit: 'ms', tol: 0.02, steps: ['$v = \\pi \\times 0.040 \\times 100 = 12.57$ m/s.', '$t_c = 0.006/12.57 = 0.477$ ms.'] },
    { q: 'Brushes measured 32 mm at one inspection and 29 mm 2 000 running hours later. The wear mark is at 12 mm. How many more hours will they last?', answer: 11333, unit: 'h', tol: 0.02, steps: ['Wear rate $3/2 = 1.5$ mm per 1 000 h.', 'Usable length left $29 - 12 = 17$ mm.', '$t = 1000 \\times 17/1.5 = 11\\,333$ h.'] }
  ],
  choose: {
    good: [
      'Brushed motors where the duty allows regular inspection or the life of a sealed motor is long enough.',
      'Low-voltage, high-current motors with metal-graphite brushes.',
      'Simple, cheap control where a few thousand hours of brush life suffice.'
    ],
    avoid: [
      'Maintenance-free, very long life, high speed or clean rooms: choose a brushless motor.',
      'Explosive atmospheres without a certified enclosure: brushes spark.',
      'Very dry air or long periods at light load without the right brush grade.'
    ],
    check: [
      'Brush grade, current density at your real load, and spring pressure.',
      'Commutator condition: film colour, runout, undercut mica, burnt bars.',
      'Inspection interval, wear mark, and a wear-rate record.',
      'Interference suppression and the carbon dust inside the motor.'
    ]
  },
  applications: [
    'Maintenance of DC mill motors, traction motors and cranes: brush inspection is a routine task.',
    'Universal-motor tools with replaceable and auto-stop brushes.',
    'The same brushes serve on slip rings of wound-rotor motors and synchronous machines, and as shaft-earthing brushes against bearing currents on VFD-fed motors.'
  ],
  history: 'Early dynamos used copper-gauze or metal-strip brushes, which sparked badly and wore the commutator. Carbon brushes, introduced in the second half of the 1880s, transformed DC machines: their contact resistance helped commutation and their graphite lubricated the copper. Interpoles came into general use early in the twentieth century and made large, fast DC motors practical.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: commutation and brushes in conventional DC motors.',
    'Chapman, *Electric Machinery Fundamentals*: commutation, armature reaction, interpoles and compensating windings.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: commutator action and commutation in DC machines.',
    'Brush makers\' technical guides describe grades, current densities, spring pressures and commutator film; follow the motor maker\'s recommendation for the grade.'
  ],
  sim: 'dc-commutator'
},

{
  id: 'pwm-speed-control', parent: 'dc-control', title: 'PWM speed control', level: 2,
  short: 'Switch the full supply on and off thousands of times a second and the motor sees the average: speed set by the duty cycle, with almost no loss in the switch. The frequency is a compromise between current ripple and whine at the low end and switching loss and interference at the high end — usually 16–25 kHz.',
  keywords: ['PWM', 'pulse-width modulation', 'duty cycle', 'PWM frequency', 'current ripple', 'audible whine', 'switching loss', 'freewheeling diode', 'chopper', 'inductance', 'electrical time constant', 'coreless motor', 'discontinuous current', 'RMS current', 'EMI'],
  prereq: ['dc-torque-speed', 'pmdc-motor', 'electronics:pwm'],
  related: ['h-bridge', 'dc-motor-drivers', 'motor-noise', 'coreless-motors', 'electronics:flyback-diode', 'electronics:mosfet-switch', 'electronics:gate-drive', 'electronics:buck-converter', 'electronics:rl-transient'],
  body: `
A DC motor's speed follows its voltage, but dropping voltage in a resistor or a linear regulator wastes the difference as heat: to run a 24 V, 5 A motor at half speed that way burns 60 W in the regulator. **Pulse-width modulation** does it with a switch instead. A transistor connects the full supply for a fraction $D$ of each period — the **duty cycle** — and disconnects it for the rest. The motor's inductance smooths the current and its inertia smooths the speed, so the motor responds to the [[?mean|average]] voltage

$$V_{avg} = D\\,V$$

while the switch, being either fully on or fully off, wastes very little. Watch the sim: the terminal voltage is a square wave, the current a sawtooth riding on its average.

### What the current does
During the on-time the supply drives current up through the winding; during the off-time the current keeps flowing — an inductor's current cannot stop — round a **freewheeling path**: a diode across the motor, or the low-side transistors of an [[h-bridge]]. Without that path, the inductance would force a voltage spike of hundreds of volts at every turn-off and destroy the transistor ([[electronics:flyback-diode|flyback diodes]]). The current therefore rises and falls by a **ripple**

$$\\Delta I = \\frac{V\\,D(1-D)}{L\\,f}$$

largest at 50 % duty, [[?inverse|inversely]] proportional to the inductance $L$ and the frequency $f$. The ripple adds nothing to the torque on average, but it heats the winding: the copper loss follows the RMS current, $I_{rms}^2 = I_{avg}^2 + \\Delta I^2/12$ for a triangular ripple. It also makes torque ripple, iron loss in the armature, and more brush sparking.

| 24 V motor, $L$ = 0.4 mH, 5 A average, D = 50 % | 1 kHz | 5 kHz | 20 kHz |
|---|---|---|---|
| Ripple (peak to peak) | 14.5 A | 3.0 A | 0.75 A |
| Extra copper loss | about 70 % | about 3 % | 0.2 % |
| Audible? | loud whine | loud whine | inaudible to most adults |

(At 1 kHz the period is comparable with the winding's time constant $L/R$ = 0.8 ms, so the exact ripple is a little under the 15 A of the formula, and the current dips below zero.)

### Choosing the frequency
- **Too low** — hundreds of hertz to a few kilohertz: large ripple, extra heating, torque pulsation, and an audible whine as the windings and laminations vibrate at the switching frequency. Human hearing spans about 20 Hz to 20 kHz and is most sensitive around 2–5 kHz. Many microcontroller boards default to about 0.5–1 kHz: fine for a toy, noisy for a product.
- **Too high** — every switching edge costs energy, about $\\tfrac12 V I\\,t_s$ where $t_s$ is the rise plus fall time, so the switching loss grows in proportion to $f$; gate-drive power ($Q_g V_g f$) grows too, and fast edges radiate interference.
- **Usual choice**: 16–25 kHz for small and medium drives, just above hearing; tens to about 100 kHz for **coreless motors**, whose inductance is only tens of µH (or add a series choke); a few kHz for large IGBT drives, where switching losses dominate.

The sim plots the ripple loss and the switching loss against frequency: their sum has a minimum.

### Real-life details
- **Discontinuous current.** With a single switch and a diode, at light load and low duty the current can fall to zero before the next pulse. The terminal voltage then shows the back-EMF during the gap, the average voltage is above $DV$, and the speed no longer follows the duty cycle linearly — it depends on the load. An H-bridge with synchronous rectification keeps the current continuous.
- **Speed regulation.** Open-loop PWM sets a voltage, so the speed still sags with load along the torque–speed line. Drivers add IR compensation, back-EMF sensing during the off-time, or a tachogenerator or encoder loop.
- **The supply** sees pulsed current. A low-ESR capacitor close to the switch supplies the pulses (see [[dc-motor-drivers]]); long supply leads without it ring and interfere.
- **Measuring**: an ordinary multimeter may misread a PWM voltage; use a true-RMS meter or, better, an oscilloscope and a current probe.
- **Suppression capacitors** across a motor's terminals are charged and discharged at every edge; large ones make current spikes that trip the driver. Follow the driver maker's advice — small ceramic capacitors at most.

> [!warn] The freewheeling path is not optional: switching an inductive winding off without one makes a voltage spike that destroys the transistor. Twist and shorten the motor leads; PWM edges radiate. On mains-fed PWM drives the motor terminals are at mains potential.

> [!key] PWM controls a DC motor's voltage by the duty cycle with almost no loss; the inductance turns the pulses into a smooth current. Choose the frequency above hearing and high enough for small ripple, but no higher than switching losses and EMC allow.
`,
  ideas: [
    'The motor responds to the average voltage D·V; the switch is fully on or fully off, so it wastes little power.',
    'An inductive winding needs a freewheeling path during the off-time — a diode or the other transistors of a bridge.',
    'Current ripple V·D(1−D)/(L f) is largest at 50 % duty and falls with frequency and inductance.',
    'Ripple heats the winding (RMS current) and makes the motor whine when the frequency is audible.',
    'Higher frequency costs switching loss and interference: 16–25 kHz is the usual compromise; coreless motors need more, or a choke.'
  ],
  pitfalls: [
    'PWM at a low frequency is fine as long as the motor turns smoothly — The speed may be smooth thanks to inertia, while the current ripple heats the winding, the motor whines and the brushes spark more.',
    'The higher the PWM frequency, the better — Switching and gate-drive losses and radiated interference rise in proportion to the frequency.',
    'At 30 % duty the speed is always 30 % of full speed — The speed follows the average voltage minus the IR drop, and with discontinuous current the average voltage itself is above D·V.'
  ],
  derivation: {
    title: 'Where the ripple formula comes from',
    steps: [
      { text: 'In steady running the back-EMF plus the resistive drop is close to the average voltage: $E + RI \\approx DV$.' },
      { text: 'During the on-time the inductor sees the supply minus that: $V - DV = V(1-D)$, so the current rises at a constant rate.', tex: 'L\\,\\frac{di}{dt} = V(1 - D)' },
      { text: 'The on-time is $DT = D/f$, so the rise — equal to the fall in the off-time — is', tex: '\\Delta I = \\frac{V(1-D)}{L}\\cdot\\frac{D}{f} = \\frac{V\\,D(1-D)}{L\\,f}' },
      { text: 'This straight-line picture holds when the period is short compared with the time constant $L/R$; the [[?derivative]] form above is then nearly exact. $D(1-D)$ is largest at $D = ½$.' }
    ]
  },
  formulas: [
    {
      name: 'Average voltage',
      expr: 'Va = D*V', tex: 'V_{avg} = D\\,V',
      vars: {
        Va: { name: 'average voltage at the motor', q: 'voltage', unit: 'V', tex: 'V_{avg}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 }
      },
      note: 'For continuous current. With discontinuous current the average is higher.',
      stories: { D: 'What duty cycle gives a {Va} average from a {V} supply?' }
    },
    {
      name: 'Current ripple',
      expr: 'dI = V*D*(1 - D)/(L*f)', tex: '\\Delta I = \\dfrac{V\\,D(1-D)}{L\\,f}',
      vars: {
        dI: { name: 'peak-to-peak current ripple', q: 'current', unit: 'A', tex: '\\Delta I' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        L: { name: 'winding inductance (plus any choke)', q: 'inductance', unit: 'mH', value: 0.4 },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 }
      },
      note: 'Valid when the period is short against L/R. Both D and 1 − D give the same ripple.',
      stories: { dI: 'A {L} motor on {V} is switched at {f} with {D} duty. What is the current ripple?', f: 'What PWM frequency keeps the ripple of a {L} motor on {V} at {D} duty down to {dI}?', L: 'What total inductance keeps the ripple at {dI} when switching {V} at {f} and {D} duty?' }
    },
    {
      name: 'RMS current with triangular ripple',
      expr: 'Irms = sqrt(I^2 + dI^2/12)', tex: 'I_{rms} = \\sqrt{I^2 + \\dfrac{\\Delta I^2}{12}}',
      vars: {
        Irms: { name: 'RMS current (heats the winding)', q: 'current', unit: 'A', tex: 'I_{rms}' },
        I: { name: 'average current (makes the torque)', q: 'current', unit: 'A', value: 5 },
        dI: { name: 'peak-to-peak ripple', q: 'current', unit: 'A', value: 3, tex: '\\Delta I' }
      },
      stories: { Irms: 'A motor averages {I} with a ripple of {dI} peak to peak. What RMS current heats its winding?' }
    },
    {
      name: 'Switching loss',
      expr: 'P = V*I*ts*f/2', tex: 'P_{sw} = \\tfrac12\\,V\\,I\\,t_s\\,f',
      vars: {
        P: { name: 'switching loss', q: 'power', unit: 'W', tex: 'P_{sw}' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 10 },
        ts: { name: 'rise time plus fall time', q: 'time', unit: 'ns', value: 100, tex: 't_s' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 }
      },
      note: 'A linear-edge estimate for one switching transistor; add the diode\'s reverse recovery and the gate-drive power.',
      stories: { P: 'A transistor switches {I} from {V} with edges totalling {ts}, at {f}. What is its switching loss?' }
    }
  ],
  examples: [
    {
      title: 'From 1 kHz to 20 kHz',
      q: 'A 24 V motor ($L$ = 0.4 mH, $R$ = 0.5 Ω) runs at 50 % duty with 5 A average. Estimate the ripple and the extra copper loss at 1 kHz, 5 kHz and 20 kHz.',
      steps: [
        'Formula: $\\Delta I = 24 \\times 0.25/(0.4\\times10^{-3} f)$ = 15 A, 3 A and 0.75 A.',
        'At 1 kHz the period (1 ms) is not short against $L/R$ = 0.8 ms; the exponential solution gives 14.5 A, from +12.3 A down to −2.3 A (a bridge lets it reverse).',
        '$I_{rms}^2 = 25 + \\Delta I^2/12$: 42.6, 25.75 and 25.05 A² — extra copper loss about 70 %, 3 % and 0.2 %.'
      ],
      a: 'At 1 kHz the winding runs 70 % hotter in copper loss (and whines); at 20 kHz the ripple is negligible.'
    },
    {
      title: 'A coreless motor on a standard driver',
      q: 'A coreless 24 V motor with only 50 µH of inductance draws 2 A on a 20 kHz driver at 50 % duty. What happens, and what are the cures?',
      steps: [
        '$\\Delta I = 24 \\times 0.25/(50\\times10^{-6} \\times 20\\,000) = 6$ A peak to peak — three times the average.',
        '$I_{rms}^2 = 4 + 36/12 = 7$ A²: the copper loss is 1.75 times that of smooth DC for the same torque.',
        'Cures: switch at 100 kHz ($\\Delta I$ = 1.2 A) or add a 200 µH choke in series (total 250 µH, $\\Delta I$ = 1.2 A at 20 kHz).'
      ],
      a: 'A 6 A ripple and 75 % more copper loss; raise the frequency or add a choke.'
    },
    {
      title: 'Fast and slow edges',
      q: 'A driver switches 10 A from 24 V at 20 kHz. Compare the switching loss with 100 ns and with 1 µs of rise plus fall time.',
      steps: [
        '$P = \\tfrac12 \\times 24 \\times 10 \\times 100\\times10^{-9} \\times 20\\,000 = 0.24$ W.',
        'With 1 µs: 2.4 W — ten times more, and the transistor needs a heatsink.',
        'Fast edges save power but radiate more; gate resistors set the compromise.'
      ],
      a: '0.24 W against 2.4 W.'
    }
  ],
  quiz: [
    { q: 'At what duty cycle is the PWM current ripple largest?', choices: ['50 %', '100 %', '10 %', 'It does not depend on duty'], a: 0, why: 'ΔI ∝ D(1 − D), which peaks at D = ½.' },
    { q: 'Why do most DC motor drivers switch at 16–25 kHz?', choices: ['Just above human hearing, with small ripple and moderate switching loss', 'Because motors cannot respond faster', 'It is the mains frequency multiplied up', 'Transistors cannot switch faster'], a: 0, why: 'Below about 20 kHz the motor whines audibly; far above it switching losses and interference grow.' },
    { q: 'Doubling the PWM frequency (same duty, same motor) makes the ripple…', choices: ['half as large', 'twice as large', 'a quarter as large', 'unchanged'], a: 0, why: 'ΔI is inversely proportional to f.' },
    { q: 'Removing the freewheeling diode from a low-side PWM switch driving a motor…', choices: ['causes a destructive voltage spike at each turn-off', 'makes the motor run faster', 'reduces heating', 'has no effect'], a: 0, why: 'The winding\'s current cannot stop instantly; with no path it forces a large voltage across the switch.' },
    { q: 'A motor averages 4 A with a 6 A peak-to-peak triangular ripple. Its RMS current is about…', answer: 4.36, unit: 'A', why: '√(16 + 36/12) = √19 = 4.36 A: 19 % more copper loss than smooth DC.' }
  ],
  problems: [
    { q: 'A 48 V drive switches a 1 mH motor at 16 kHz and 50 % duty. What is the peak-to-peak current ripple?', answer: 0.75, unit: 'A', tol: 0.02, steps: ['$\\Delta I = 48 \\times 0.25/(10^{-3} \\times 16\\,000) = 12/16 = 0.75$ A.'] },
    { q: 'What total inductance keeps the ripple of a 24 V, 20 kHz drive at 50 % duty down to 0.5 A?', answer: 0.6, unit: 'mH', tol: 0.02, steps: ['$L = V D(1-D)/(\\Delta I f) = 6/(0.5 \\times 20\\,000) = 0.6$ mH.'] }
  ],
  choose: {
    good: [
      'Any battery or DC-supplied motor whose speed must vary: efficient, cheap, and easy from a microcontroller.',
      '16–25 kHz for iron-core motors in products people hear; tens of kHz or a choke for coreless motors.',
      'An H-bridge with synchronous rectification when you need direction, braking or linear low-speed behaviour.'
    ],
    avoid: [
      'Low frequencies (below a few kHz) in anything near people, or with low-inductance motors.',
      'Large capacitors across the motor terminals of a PWM driver.',
      'Expecting exact speed from open-loop PWM under a varying load: add feedback.'
    ],
    check: [
      'The motor inductance and the ripple at your frequency and duty.',
      'Switching and conduction losses of the transistors, and their heatsinking.',
      'EMC: lead length, twisting, shielding and the supply capacitor.',
      'The freewheeling path and the voltage rating of the switch with margin.'
    ]
  },
  applications: [
    'Cordless tools, fans, pumps and car blowers: a MOSFET and a PWM controller set the speed.',
    'Robots and small machines: microcontroller PWM into a bridge driver.',
    'Try frequencies, duty cycles and motors in [the PWM tool](#/tools/drives/pwm).'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: chopper-fed DC motor drives and current ripple.',
    'Mohan, *Electric Drives*: switch-mode converters for DC motor drives, PWM and ripple.',
    'Manufacturers\' application notes on PWM drive of coreless motors recommend high frequencies or series chokes.'
  ],
  sim: ['dc-pwm-lab', 'ref-dc-motor']
},

{
  id: 'h-bridge', parent: 'dc-control', title: 'The H-bridge: direction and braking', level: 2,
  short: 'Four switches around the motor, drawn like the letter H. Closing opposite corners drives it one way or the other; closing both lower (or upper) switches brakes it; opening all lets it coast. Dead time keeps the two switches of a leg from shorting the supply; the PWM pattern decides how the current decays.',
  keywords: ['H-bridge', 'full bridge', 'MOSFET', 'shoot-through', 'dead time', 'body diode', 'bootstrap', 'high-side driver', 'sign-magnitude PWM', 'locked antiphase', 'slow decay', 'fast decay', 'coast', 'brake', 'regeneration', 'bus pumping', 'current sense resistor'],
  prereq: ['pwm-speed-control', 'pmdc-motor', 'electronics:mosfet-switch'],
  related: ['dc-motor-drivers', 'dc-braking', 'esc-drivers', 'electronics:h-bridge', 'electronics:gate-drive', 'electronics:heat-sinks', 'stepper-drivers'],
  body: `
To reverse a PMDC motor you reverse its current. The **H-bridge** does it electronically with four switches: two **legs** (half-bridges), each a high-side switch Q1 or Q3 from the supply and a low-side switch Q2 or Q4 to ground, with the motor between the two mid-points. In practice the switches are MOSFETs, each with an inherent **body diode** from source to drain; older integrated bridges used bipolar transistors. The sim lights the path the current takes in every state.

| State | On | Motor voltage | Current path | Use |
|---|---|---|---|---|
| Forward | Q1, Q4 | +V | supply → Q1 → motor → Q4 → ground | drive forwards |
| Reverse | Q3, Q2 | −V | supply → Q3 → motor → Q2 → ground | drive backwards |
| Brake (low) | Q2, Q4 | about 0 | motor shorted through the low side | dynamic braking, slow decay |
| Brake (high) | Q1, Q3 | about 0 | motor shorted through the high side | the same, other side |
| Coast | none | back-EMF | through two body diodes into the supply while current flows, then nothing | free-wheel |
| **Shoot-through** | Q1, Q2 (or Q3, Q4) | — | **supply shorted** | never |

### Shoot-through and dead time
A transistor switches off more slowly than it switches on: a MOSFET takes tens to hundreds of nanoseconds to stop conducting. If a leg's controller turned the low side on at the instant it turned the high side off, both would conduct together for a moment and short the supply. The current in that instant is limited only by the wiring's inductance, and can reach tens of amperes in nanoseconds; repeated 20 000 times a second it overheats the transistors. Drivers therefore insert a **dead time** — typically 0.1–2 µs, longer for IGBTs — during which both switches of a leg are off and the motor current flows through a body diode. Dead time has its own costs: diode conduction loss, and a [[?delta-change|small error]] in the output voltage of about $t_d f$ of the duty cycle per switching leg (2 % at 1 µs and 20 kHz), which shows up at very low speed.

### Driving the high side
An N-channel MOSFET — the cheapest for a given on-resistance — needs its gate 10–12 V above its source, and on the high side the source rises to the supply voltage. Bridge driver chips generate that voltage with a **bootstrap** capacitor, recharged each time the low-side switch is on (so the duty cycle cannot quite reach 100 %, often about 95–99 %), or with a charge pump that allows 100 %. Small bridges use P-channel high-side MOSFETs and need no bootstrap, at the cost of higher on-resistance.

### PWM patterns: what happens in the off-time
- **Sign-magnitude, slow decay**: a direction signal selects the leg pair; during the off-time the high switch opens and the low switch of the same leg closes, so the motor is briefly shorted (brake). The current decays slowly, the ripple is small, and the speed follows the duty cycle almost linearly — the usual choice for DC motors.
- **Sign-magnitude, fast decay**: during the off-time all switches open; the current flows through two body diodes back into the supply, against the full supply voltage, and decays fast. More ripple, and the energy goes back to the supply.
- **Locked antiphase**: the two diagonals alternate every period; 50 % duty means zero average voltage, 0 % full reverse, 100 % full forward. One signal carries speed and direction, and the motor passes smoothly through zero speed — liked for servos — but the ripple is large and a current flows even at standstill.

### Energy that comes back
When a drive slows the motor by lowering its voltage below the back-EMF, or an overhauling load drives it, the motor generates and its current flows back into the supply (briefly also when it coasts or in fast decay, as the winding's current decays through the diodes). Reversing at speed is different: that is plugging, and it draws energy from the supply. A battery absorbs it. A mains power supply cannot: the charge piles up on the bus capacitor and the **bus voltage rises** — "bus pumping" — until something is damaged or the driver trips on overvoltage. Remedies: a battery, a brake resistor switched across the bus (a **brake chopper**), a clamp (TVS) diode, or slow decay only. In the sim, choose the power supply, spin a flywheel up and slow it with slow-decay PWM at a low duty cycle: the rail climbs until the driver trips.

### Losses and sizes
Each conducting MOSFET dissipates $I^2 R_{DS(on)}$, and two conduct at a time: $2I^2R_{DS(on)}$. Modern 30–100 V MOSFETs have 1–20 mΩ, so a 20 A bridge with 5 mΩ switches loses 4 W in conduction plus its switching loss. Older bipolar bridge ICs dropped about 2–4 V in total — at 12 V, a quarter of the supply. Integrated bridge ICs handle about 1–10 A at up to 40–60 V; discrete MOSFET bridges reach hundreds of amperes at 12–100 V (e-bikes, carts, forklifts). A current-sense resistor of a few milliohms in the low-side return lets the driver limit current and detect a short.

> [!warn] Never switch both transistors of one leg on together, even briefly while testing. A bridge fed from a power supply can drive its supply voltage up when the motor brakes: add a brake resistor or clamp. Fuse the supply; a failed bridge usually fails short.

> [!key] Opposite corners drive, the same side brakes, all off coasts, one leg on both sides destroys. Dead time protects the leg; the PWM pattern sets the ripple and where the energy goes.
`,
  ideas: [
    'Q1 + Q4 drive forwards, Q3 + Q2 backwards; Q2 + Q4 (or Q1 + Q3) short the motor to brake; all off lets it coast.',
    'Both switches of one leg on together short the supply (shoot-through); dead time of 0.1–2 µs prevents it.',
    'N-channel high-side switches need a gate voltage above the supply: a bootstrap capacitor or a charge pump.',
    'Slow decay (brake in the off-time) gives small ripple and linear speed control; fast decay returns energy to the supply.',
    'Braking energy fed back into a power supply raises the bus voltage unless a battery, brake resistor or clamp takes it.'
  ],
  pitfalls: [
    'Coasting (all switches off) means no current flows at all — While the motor current decays it flows through two body diodes back into the supply; only then is the motor truly free.',
    'Longer dead time is always safer — Too long a dead time wastes power in the diodes and distorts the output voltage, especially at low speed; it only needs to exceed the switches\' turn-off time with margin.',
    'Any 24 V power supply can feed a motor bridge — Most supplies cannot absorb the energy a braking motor returns; the bus voltage rises and something trips or fails.'
  ],
  formulas: [
    {
      name: 'Conduction loss of a MOSFET bridge',
      expr: 'P = 2*I^2*Rds', tex: 'P = 2\\,I^2 R_{DS(on)}',
      vars: {
        P: { name: 'conduction loss (two switches conducting)', q: 'power', unit: 'W' },
        I: { name: 'motor current (RMS)', q: 'current', unit: 'A', value: 20 },
        Rds: { name: 'on-resistance of one MOSFET (hot)', q: 'resistance', unit: 'mΩ', value: 5, tex: 'R_{DS(on)}' }
      },
      note: 'R_DS(on) rises by roughly half to double from 25 °C to a hot junction; use the hot value.',
      stories: { P: 'A bridge of {Rds} MOSFETs carries {I}. What is its conduction loss?', Rds: 'What on-resistance keeps the conduction loss of a {I} bridge to {P}?' }
    },
    {
      name: 'Duty cycle lost to dead time',
      expr: 'dD = td*f', tex: '\\Delta D = t_d\\,f',
      vars: {
        dD: { name: 'duty-cycle error per switching leg', q: 'ratio', unit: '%', tex: '\\Delta D' },
        td: { name: 'dead time', q: 'time', unit: 'µs', value: 1, tex: 't_d' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 }
      },
      note: 'Its sign depends on the direction of the current; with both legs switching (locked antiphase) it doubles.',
      stories: { dD: 'A bridge switches at {f} with {td} of dead time. How much of the duty cycle does the dead time distort?' }
    },
    {
      name: 'Bootstrap capacitor',
      expr: 'C = Q/dV', tex: 'C_{boot} = \\dfrac{Q_g}{\\Delta V}',
      vars: {
        C: { name: 'minimum bootstrap capacitance', q: 'capacitance', unit: 'nF', tex: 'C_{boot}' },
        Q: { name: 'gate charge of the high-side MOSFET', q: 'charge', unit: 'nC', value: 60, tex: 'Q_g' },
        dV: { name: 'allowed droop of the gate voltage', q: 'voltage', unit: 'V', value: 0.5, tex: '\\Delta V' }
      },
      note: 'A minimum; leakage over long on-times needs more. Several times this value (often 0.1–1 µF) is usual.',
      stories: { C: 'A MOSFET with {Q} of gate charge may let its gate drive droop {dV}. What bootstrap capacitance is the minimum?' }
    },
    {
      name: 'Current-sense resistor',
      expr: 'Rs = Vth/I', tex: 'R_s = \\dfrac{V_{th}}{I_{\\max}}',
      vars: {
        Rs: { name: 'sense resistance', q: 'resistance', unit: 'mΩ', tex: 'R_s' },
        Vth: { name: 'current-limit threshold of the driver', q: 'voltage', unit: 'mV', value: 100, tex: 'V_{th}' },
        I: { name: 'current limit', q: 'current', unit: 'A', value: 20, tex: 'I_{\\max}' }
      },
      note: 'Check the resistor\'s power, I²R_s, at the continuous current, and keep its connections short (Kelvin sensing).',
      stories: { Rs: 'A driver trips at {Vth} across its sense resistor. What resistor sets a {I} limit?' }
    }
  ],
  examples: [
    {
      title: 'Old and new bridges',
      q: 'A 12 V motor draws 2 A. Compare the loss in an older bipolar bridge that drops 3 V in total, an integrated MOSFET bridge with 0.2 Ω per switch and a discrete bridge with 10 mΩ switches.',
      steps: [
        'Bipolar: $3 \\times 2 = 6$ W, and the motor gets only 9 V.',
        'Integrated MOSFET: $2 \\times 2^2 \\times 0.2 = 1.6$ W, 0.8 V lost.',
        'Discrete: $2 \\times 4 \\times 0.01 = 0.08$ W, 0.04 V lost.'
      ],
      a: '6 W, 1.6 W and 0.08 W: the old bipolar bridge wastes a quarter of the supply.'
    },
    {
      title: 'Dead time at two frequencies',
      q: 'A bridge uses 1 µs of dead time. How much of the duty cycle does it distort at 20 kHz and at 100 kHz?',
      steps: [
        '20 kHz: $10^{-6} \\times 20\\,000 = 0.02$ — 2 % per switching leg.',
        '100 kHz: 10 % — a large error at low speed; faster switches and a shorter dead time are needed at high frequency.'
      ],
      a: '2 % at 20 kHz, 10 % at 100 kHz.'
    },
    {
      title: 'A bootstrap capacitor',
      q: 'The high-side MOSFET has 60 nC of total gate charge and its gate drive may droop by 0.5 V. Size the bootstrap capacitor.',
      steps: [
        '$C = 60\\,\\text{nC}/0.5\\,\\text{V} = 120$ nF at minimum.',
        'Allow for leakage and long on-times: several times more, e.g. 470 nF–1 µF, with a matching fast diode.'
      ],
      a: 'At least 120 nF; about 0.5–1 µF in practice.'
    }
  ],
  quiz: [
    { q: 'Which pair of switches drives the motor forwards in the usual labelling (Q1, Q3 high; Q2, Q4 low)?', choices: ['Q1 and Q4', 'Q1 and Q2', 'Q2 and Q4', 'Q1 and Q3'], a: 0, why: 'Opposite corners: Q1 connects one side to the supply and Q4 the other side to ground. Q1 + Q2 would short the supply; Q2 + Q4 and Q1 + Q3 brake.' },
    { q: 'What is the purpose of dead time?', choices: ['To make sure one switch of a leg is off before the other turns on', 'To slow the motor down', 'To reduce the switching frequency', 'To charge the bus capacitor'], a: 0, why: 'Switches turn off more slowly than they turn on; without a gap both would conduct and short the supply.' },
    { q: 'In slow decay, during the PWM off-time the motor current…', choices: ['circulates through the two low-side switches and decays slowly', 'flows back into the supply through the body diodes', 'stops at once', 'reverses'], a: 0, why: 'The motor is shorted through the low side; only the back-EMF and resistance slow the current. Fast decay sends it back to the supply.' },
    { q: 'A motor on a bridge fed from a mains power supply is braked hard by reversing. What may happen to the supply rail?', choices: ['Its voltage rises as the returned energy charges the bus capacitor', 'Its voltage collapses', 'Nothing', 'Its frequency changes'], a: 0, why: 'The motor generates; a supply cannot sink current, so the energy piles up on the capacitor.' },
    { q: 'All four switches off at full speed: the motor current stops instantly.', a: false, why: 'The winding\'s current continues through two body diodes into the supply, decaying quickly, and only then does the motor coast freely.' }
  ],
  problems: [
    { q: 'A bridge with 8 mΩ switches carries 15 A. What is its conduction loss?', answer: 3.6, unit: 'W', tol: 0.02, steps: ['$P = 2 \\times 15^2 \\times 0.008 = 3.6$ W.'] },
    { q: 'A driver trips at 50 mV across its sense resistor. What resistor sets an 8 A limit, and what does it dissipate at 8 A?', answer: 6.25, unit: 'mΩ', tol: 0.02, steps: ['$R_s = 0.05/8 = 6.25$ mΩ.', 'Power $8^2 \\times 0.00625 = 0.4$ W.'] }
  ],
  choose: {
    good: [
      'Any DC motor that must reverse, brake or hold against a load.',
      'Integrated bridge ICs for small motors (up to about 10 A), discrete MOSFET bridges for larger ones.',
      'Slow-decay sign-magnitude PWM for ordinary speed control; locked antiphase for servo loops through zero speed.'
    ],
    avoid: [
      'Bipolar bridge ICs on low supply voltages: their few volts of drop waste power and speed.',
      'A bridge fed from a mains power supply without a way to absorb braking energy.',
      'Home-made gate timing without dead time and current protection.'
    ],
    check: [
      'Continuous and peak current, supply range with margin for regeneration spikes.',
      'Dead time, maximum duty (bootstrap), PWM frequency range.',
      'Protection: current limit, short-circuit, thermal shutdown, undervoltage lockout.',
      'Heat: 2I²R_DS(on) plus switching loss against the heatsink.'
    ]
  },
  applications: [
    'Robot wheels, actuators, car power windows and mirrors driven by bridge ICs.',
    'E-bike, cart and forklift controllers built from parallel MOSFETs.',
    'One H-bridge per winding drives a bipolar stepper motor; three half-bridges drive a brushless motor.'
  ],
  sources: [
    'Mohan, *Electric Drives*: the full-bridge DC–DC converter, PWM switching strategies and four-quadrant operation.',
    'Hughes and Drury, *Electric Motors and Drives*: chopper and full-bridge DC motor drives, regeneration.',
    'Semiconductor makers\' application notes on bootstrap gate drive and dead time.'
  ],
  sim: 'dc-h-bridge'
},

{
  id: 'dc-motor-drivers', parent: 'dc-control', title: 'DC motor drivers', level: 2,
  short: 'The box between the controller and the motor: a PWM power stage with current limiting, ramps, protection and inputs for PWM, analogue, RC-pulse or serial commands. What the kinds look like, how big they are, what their terminals and DIP switches do, and how much heat and power they take.',
  keywords: ['DC motor driver', 'motor controller', 'speed controller', 'DIP switch', 'current limit', 'acceleration ramp', 'IR compensation', 'analogue input 0-10 V', '4-20 mA', 'RC pulse', 'PWM input', 'enable', 'limit switch input', 'fault output', 'SCR drive', 'thyristor drive', 'heatsink', 'power consumption', 'input capacitor'],
  prereq: ['h-bridge', 'pwm-speed-control', 'dc-torque-speed'],
  related: ['dc-braking', 'dc-servo-motors', 'rc-servos', 'esc-drivers', 'limit-switches', 'shunt-dc-motor', 'motor-heating', 'electronics:heat-sinks', 'electronics:optocouplers', 'electronics:fuses-protection', 'electronics:decoupling'],
  body: `
A DC motor driver takes a small command signal and a DC (or mains) supply and delivers a controlled voltage and current to the motor. Inside it are the same few blocks whatever its size: a power stage (a single MOSFET, an [[h-bridge]] or a thyristor bridge), a current sensor, a controller that turns the command into a duty cycle with ramps and a current limit, and protection. The sim draws a generic 20 A board: set its DIP switches and command, load the motor, and watch the current limit, the heatsink temperature and the power drawn from the supply.

### The kinds, and how big they are
| Kind | Typical size | Supply | Continuous current | Command inputs |
|---|---|---|---|---|
| Bridge IC on a small board | 15 × 20 to 50 × 50 mm | 3–40 V | 0.5–5 A per channel | logic PWM + DIR, or IN1/IN2 |
| PWM speed-controller board | 50 × 40 to 100 × 70 mm, with heatsink | 6–60 V | 5–60 A | potentiometer, 0–5 V, PWM |
| Hobby ESC for brushed motors | about 30 × 40 mm | 2–4 lithium cells (7–17 V) | 10–100 A | RC pulse, 1–2 ms at 50 Hz |
| Industrial low-voltage DC drive | DIN rail, 22.5–100 mm wide, or panel | 12–48 V (some to 80 V) | 3–60 A, peaks about twice | 0–10 V, ±10 V, 4–20 mA, PWM, digital I/O, RS-485 or CAN |
| Thyristor (SCR) drive on the mains | chassis 100 × 150 mm upwards; cabinets for large | 120/230 V single-phase, 400 V three-phase | 1 A to thousands | potentiometer, 0–10 V, 4–20 mA |
| DC servo amplifier | panel, 100–200 mm | about 24–90 V | 5–50 A | ±10 V, step and direction, fieldbus |

### Terminals
| Terminal | What it is |
|---|---|
| V+, GND (power) | the supply; fuse it and keep the leads short |
| M+, M− (or A1, A2) | the motor; twisted pair or shielded cable |
| PWM / AIN | the speed command: logic PWM, or an analogue voltage or current |
| DIR | direction (with sign-magnitude commands) |
| EN (or INH) | enable: the stage switches only when it is active |
| BRK | brake: shorts the motor through the low side |
| LIM+, LIM− | limit switches: each stops motion in its own direction only, so the axis can back off |
| FLT | fault output, usually open collector |
| +5 V / +10 V out | reference for a speed potentiometer (typically 5–10 kΩ) |
| ENC A/B, TACH | speed feedback |

Wire limit switches **normally closed**, so that a broken wire stops the motor. For safety functions — emergency stop, guards — the driver's enable is not enough; use a safety-rated stop ([[emergency-stop]]).

### Command signals
- **PWM input**: a logic signal (3.3 or 5 V) whose duty cycle is the speed, typically accepted from about 1 to 20 kHz or more; separate DIR, or locked antiphase.
- **Analogue**: 0–5 V or 0–10 V (unipolar, with DIR), ±10 V (bipolar, the servo standard), 4–20 mA for long runs in noisy plants (a broken wire reads 0 mA, detectable).
- **RC pulse**: a 1.0–2.0 ms pulse every 20 ms: 1.5 ms is stop, 2.0 ms full forward, 1.0 ms full reverse — the command is $(t - 1.5\\,\\text{ms})/0.5\\,\\text{ms}$. Most controllers also stop on loss of signal (failsafe).
- **Serial**: UART, RS-485 (Modbus RTU) or CAN for speed, current and diagnostics.

### A typical DIP-switch table (generic)
Every maker has its own; this is the kind of thing to expect. Read the actual manual, and change switches with the power off — many drivers read them only at power-up.

| Switch | Off | On |
|---|---|---|
| SW1, SW2 | input mode: 00 PWM + DIR, 10 analogue 0–5 V | 01 RC pulse, 11 analogue 0–10 V |
| SW3, SW4 | current limit: 00 25 %, 10 50 % | 01 75 %, 11 100 % of the driver's rating |
| SW5 | fast ramp (about 0.2 s) | slow ramp (about 2 s) |
| SW6 | stop by braking (motor shorted) | stop by coasting |
| SW7 | normal direction | direction inverted |
| SW8 | open loop | IR compensation on |

Mains thyristor drives use trimmers instead: MIN and MAX speed, ACCEL and DECEL, IR compensation, CL (current limit), with jumpers for 115/230 V line and 90/180 V armature.

### Heat and power consumption
The driver's own loss is conduction, $2I^2R_{DS(on)}$, plus switching, $\\tfrac12 V I t_s f$, plus the control electronics, typically 0.5–3 W (and 10–100 mA of standby current, which matters on a battery). A good MOSFET driver is 95–98 % efficient at its rated current. The loss heats the transistors: $T_j = T_a + P\\,R_{th}$, with $R_{th}$ from junction to air through the heatsink. Ratings usually assume 25–40 °C air; above that, derate (often a few per cent per kelvin) and mount the heatsink fins vertical with free air above. The supply must deliver the motor's input power plus the driver's loss, and the peak current up to the current limit; the **input capacitor** — low-ESR, near the bridge — supplies the PWM pulses, with a ripple current of about $I\\sqrt{D(1-D)}$ (5 A RMS for a 10 A motor at 50 % duty).

### Setting up
1. Set the current limit to the motor's rated current (for continuous duty) and below its demagnetisation peak; the driver then also protects the gearbox and the load.
2. Set ramps long enough that the acceleration current stays under the limit and the mechanics are not shocked.
3. Test direction and limit switches at low speed.
4. Check the supply rise when braking, and the heatsink temperature after a full duty cycle.

> [!warn] Mains-fed thyristor and PWM drives have no isolation between the power and the motor terminals, and often not the control terminals either: their potentiometer and signal wires can be at mains potential. Install, wire and service them with the supply isolated and locked off, by qualified people, following the manual. Non-isolated signal inputs also make ground loops: use drives with isolated inputs or optocouplers where the controller is far away.

> [!key] Choose a driver by supply range, continuous and peak current, command input and protection; set its current limit and ramps for the motor and the load; and budget its heat and power like any other component.
`,
  ideas: [
    'Every driver has a power stage, a current sensor, a controller with ramps and a current limit, and protection.',
    'Command inputs: logic PWM with DIR, 0–5/0–10 V, ±10 V, 4–20 mA, RC pulses of 1–2 ms, or serial buses.',
    'DIP switches or trimmers set the input mode, current limit, ramps, stop mode and feedback — read the manual and set them with the power off.',
    'Driver losses are conduction plus switching plus electronics; the heatsink sets the junction temperature.',
    'Wire limit switches normally closed; they stop motion in one direction only.'
  ],
  pitfalls: [
    'The current limit should be set as high as the driver allows, to get the most torque — The limit protects the motor, its magnets, the gearbox and the load; set it for the motor\'s rating and the mechanics.',
    'The driver\'s enable input is an emergency stop — An enable is ordinary control logic; emergency stops and guard interlocks need safety-rated functions.',
    'A driver rated 20 A delivers 20 A in any enclosure — Ratings assume a heatsink and cool, moving air; in a hot, closed box the driver derates or trips on temperature.'
  ],
  formulas: [
    {
      name: 'Junction (or heatsink) temperature',
      expr: 'Tj = Ta + P*Rth', tex: 'T_j = T_a + P\\,R_{th}',
      vars: {
        Tj: { name: 'transistor junction temperature', q: 'temperature', unit: '°C', tex: 'T_j' },
        Ta: { name: 'air temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_a' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 6 },
        Rth: { name: 'thermal resistance, junction to air', q: 'thermalres', unit: 'K/W', value: 6, tex: 'R_{th}' }
      },
      note: 'Rth is the sum of junction-to-case, case-to-heatsink and heatsink-to-air. Keep the junction well under its maximum (often 150–175 °C).',
      stories: { Tj: 'A driver dissipates {P} through {Rth} into {Ta} air. How hot are its transistors?', Rth: 'What thermal resistance keeps a {P} driver at {Tj} in {Ta} air?' }
    },
    {
      name: 'Loss in a MOSFET bridge driver',
      expr: 'P = 2*I^2*Rds + V*I*ts*f/2 + Pq', tex: 'P = 2 I^2 R_{DS(on)} + \\tfrac12 V I\\,t_s f + P_q',
      vars: {
        P: { name: 'total driver loss', q: 'power', unit: 'W' },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 10 },
        Rds: { name: 'on-resistance of one MOSFET', q: 'resistance', unit: 'mΩ', value: 8, tex: 'R_{DS(on)}' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        ts: { name: 'rise plus fall time', q: 'time', unit: 'ns', value: 150, tex: 't_s' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 },
        Pq: { name: 'control electronics and gate drive', q: 'power', unit: 'W', value: 0.5, tex: 'P_q' }
      },
      note: 'Sign-magnitude PWM with one leg switching. Use the hot on-resistance.',
      stories: { P: 'A {V} driver with {Rds} MOSFETs runs a {I} motor at {f} with {ts} edges and {Pq} of electronics. What does it dissipate?' }
    },
    {
      name: 'Command from an RC pulse',
      expr: 'c = (t - t0)/tw', tex: 'c = \\dfrac{t - t_0}{t_w}',
      vars: {
        c: { name: 'speed command (+ forward, − reverse)', q: 'ratio', unit: '%', signed: true },
        t: { name: 'pulse width', q: 'time', unit: 'ms', value: 1.75 },
        t0: { name: 'neutral pulse width', q: 'time', unit: 'ms', value: 1.5, tex: 't_0' },
        tw: { name: 'pulse change for full speed', q: 'time', unit: 'ms', value: 0.5, tex: 't_w' }
      },
      note: 'The usual convention; many controllers add a dead band of a few per cent around neutral and let you calibrate the end points.',
      stories: { c: 'A controller receives {t} pulses (neutral {t0}, full scale ±{tw}). What command is that?', t: 'What pulse width commands {c} (neutral {t0}, full scale ±{tw})?' }
    },
    {
      name: 'Input capacitor for a PWM stage',
      expr: 'C = I*D*(1 - D)/(f*dV)', tex: 'C = \\dfrac{I\\,D(1-D)}{f\\,\\Delta V}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF' },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 10 },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 },
        dV: { name: 'allowed ripple on the supply rail', q: 'voltage', unit: 'V', value: 0.5, tex: '\\Delta V' }
      },
      note: 'Capacitance only: the capacitor\'s ESR adds I·ESR of ripple, and it must be rated for a ripple current of about I√(D(1−D)).',
      stories: { C: 'A {I} motor is switched at {f} with {D} duty. What capacitance keeps the rail ripple to {dV}?' }
    }
  ],
  examples: [
    {
      title: 'Will it need a heatsink?',
      q: 'A 24 V driver runs a 10 A motor at 20 kHz. Its MOSFETs have 8 mΩ hot, edges total 150 ns, and the electronics take 0.5 W. Find the loss, and the junction temperature in 40 °C air with 6 K/W and with 20 K/W (no heatsink).',
      steps: [
        'Conduction $2 \\times 10^2 \\times 0.008 = 1.6$ W; switching $\\tfrac12 \\times 24 \\times 10 \\times 150\\times10^{-9} \\times 20\\,000 = 0.36$ W; plus 0.5 W: 2.46 W.',
        'With 6 K/W: $T_j = 40 + 2.46 \\times 6 = 55$ °C — comfortable.',
        'With 20 K/W: $40 + 49 = 89$ °C for the whole board; the hottest transistor runs hotter still. Workable, but not at 25 A: the loss grows with $I^2$.'
      ],
      a: 'About 2.5 W; 55 °C with the heatsink, about 90 °C without.'
    },
    {
      title: 'The power budget',
      q: 'A 24 V motor draws 10 A at 60 % duty (so its average voltage is 14.4 V and it takes 144 W). The driver loses 2.5 W. What does the supply deliver, and what average current?',
      steps: [
        'Supply power $144 + 2.5 = 146.5$ W.',
        'Average supply current $146.5/24 = 6.1$ A — less than the motor\'s 10 A, because the driver works like a step-down converter.',
        'But the peaks are 10 A at 20 kHz: the input capacitor supplies them, carrying about $10\\sqrt{0.6 \\times 0.4} = 4.9$ A RMS.'
      ],
      a: 'About 147 W and 6.1 A average from the supply; the capacitor handles about 5 A RMS of ripple.'
    },
    {
      title: 'Reading an RC signal',
      q: 'A brushed ESC sees pulses of 1.30 ms. What does it do?',
      steps: [
        '$c = (1.30 - 1.50)/0.50 = -0.40$.',
        'It drives in reverse at 40 % (or brakes first, if it was moving forward — many ESCs brake before reversing).'
      ],
      a: 'Reverse at about 40 %.'
    }
  ],
  quiz: [
    { q: 'An RC controller receives 2.0 ms pulses. The command is…', choices: ['full forward', 'stop', 'full reverse', 'half forward'], a: 0, why: '1.5 ms is neutral and 0.5 ms more is full scale: (2.0 − 1.5)/0.5 = +100 %.' },
    { q: 'Why should a limit switch input be wired with a normally closed contact?', choices: ['A broken wire or loose terminal then stops the motor, like a triggered switch', 'NC contacts carry more current', 'NO contacts cannot be used with PWM', 'It makes homing faster'], a: 0, why: 'Fail-safe: any open circuit reads as "limit reached".' },
    { q: 'A 4–20 mA command reads 0 mA. The most likely cause is…', choices: ['a broken wire', 'a command of zero speed', 'a command of full speed', 'a reversed polarity at full speed'], a: 0, why: 'Zero command is 4 mA, so 0 mA means the loop is open — the reason 4–20 mA is used in plants.' },
    { q: 'The driver\'s DIP switches are changed while it is running. What is the safe expectation?', choices: ['Nothing changes until the power is cycled — follow the manual', 'The change applies instantly and safely', 'The driver resets its current limit to maximum', 'The motor reverses'], a: 0, why: 'Many drivers read their switches only at power-up; some apply changes at once. Change them with the power off.' },
    { q: 'A driver dissipates 5 W into 35 °C air through 8 K/W. Its junction temperature is about…', answer: 75, unit: '°C', why: 'T = 35 + 5 × 8 = 75 °C.' }
  ],
  problems: [
    { q: 'What capacitance keeps the rail ripple of a 20 A, 16 kHz PWM stage at 50 % duty to 0.3 V?', answer: 1042, unit: 'µF', tol: 0.02, steps: ['$C = 20 \\times 0.25/(16\\,000 \\times 0.3) = 5/4\\,800 = 1.04$ mF.'] },
    { q: 'A driver\'s MOSFETs have 12 mΩ hot. It carries 15 A, and its switching and electronics add 1.2 W. What is its total loss?', answer: 6.6, unit: 'W', tol: 0.02, steps: ['Conduction $2 \\times 225 \\times 0.012 = 5.4$ W.', 'Total $5.4 + 1.2 = 6.6$ W.'] }
  ],
  choose: {
    good: [
      'Small robots and prototypes: bridge-IC boards with PWM + DIR inputs.',
      'Machines: DIN-rail drives with 0–10 V or fieldbus, ramps, current limit, limit inputs and a fault output.',
      'Radio-controlled models: ESCs with RC-pulse input, braking and failsafe.',
      '90/180 V PMDC or shunt motors on the mains: a thyristor drive with IR compensation, or a PWM drive for lower ripple.'
    ],
    avoid: [
      'Drivers without a current limit on motors that can stall.',
      'Non-isolated inputs over long cables in electrically noisy plants.',
      'A driver sized for the running current only, when the machine needs peaks at start or on impacts.'
    ],
    check: [
      'Supply range (including regeneration rise), continuous and peak current, PWM frequency.',
      'Command input type and range, isolation, direction, enable, limit and fault signals.',
      'Current limit, ramps, stop mode (brake or coast), feedback options, protection features.',
      'Physical size, mounting (DIN rail or panel), heatsinking, ambient derating and standby consumption.'
    ]
  },
  applications: [
    'Conveyors, feeders and dosing pumps with DIN-rail 24 V drives controlled by a PLC\'s 0–10 V output.',
    'Treadmills and mixers on 90/180 V thyristor or PWM drives.',
    'Mobile robots with dual-channel drivers commanded over serial links.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: DC motor drives, current control and protection.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines*: control circuits, stop functions and emergency stop.',
    'NEMA ICS 16, *Motion/Position Control Motors, Controls and Feedback Devices*.',
    'The drive manufacturer\'s manual governs terminals, switch settings and wiring.'
  ],
  sim: 'dc-driver-lab'
},

{
  id: 'dc-braking', parent: 'dc-control', title: 'Braking a DC motor', level: 2,
  short: 'A DC motor stops quickly when made to generate: into a resistor (dynamic braking), into a short, back into the supply (regeneration), or against its own reversed supply (plugging). How strong each is, where the energy goes, what currents flow — and why none of them holds a load.',
  keywords: ['dynamic braking', 'rheostatic braking', 'regenerative braking', 'plugging', 'short-circuit braking', 'braking resistor', 'four quadrants', 'kinetic energy', 'stopping time', 'holding brake', 'stop category', 'coasting', 'hoist lowering'],
  prereq: ['dc-torque-speed', 'h-bridge', 'physics:rotational-kinetic-energy'],
  related: ['dc-motor-drivers', 'motor-brakes', 'emergency-stop', 'vfd-braking', 'motor-generator-duality', 'shunt-dc-motor', 'series-dc-motor', 'motors-conveyors-hoists'],
  body: `
Switching a motor off lets it **coast**: only friction slows it, and a flywheel or a fan may spin for many seconds. To stop quickly, make the motor work as a generator — every DC motor is one ([[motor-generator-duality]]). Its back-EMF $E = K\\omega$ drives a current backwards through whatever circuit it sees, and that current makes a torque against the rotation. The kinetic energy $\\tfrac12 J\\omega^2$ has to go somewhere: a resistor, the winding, the supply, or a friction brake. The sim spins a flywheel up and stops it each way, drawing speed and current and sharing out the energy.

### The four ways
| Method | Circuit | Braking current | Energy goes to | Stops fully? |
|---|---|---|---|---|
| Coast | open | 0 | friction | slowly |
| Dynamic (rheostatic) | resistor $R_b$ across the armature | $K\\omega/(R + R_b)$, falls with speed | resistor and winding | exponentially slower near zero |
| Short-circuit | armature shorted (low-side brake of an H-bridge) | $K\\omega/R$ — about the stall current at full speed | winding | fastest passive stop |
| Regenerative | drive reverses the current into the supply | set by the drive | mostly back to the battery or mains | yes, at a controlled rate |
| Plugging | supply reversed while running | $(V + K\\omega)/R$ — about twice stall current | winding (and resistor): the kinetic energy plus about twice as much again from the supply | must be cut at zero speed or it reverses |

### Dynamic braking
With a resistor across the armature, the current and so the braking torque are [[?proportional|proportional]] to speed: the speed decays [[?exponential|exponentially]] with the time constant

$$\\tau = \\frac{J\\,(R + R_b)}{K^2}$$

For the 24 V motor of the reference ($R$ = 0.5 Ω, $K$ = 0.055) with a flywheel of 5 kg·cm² at 4 000 rpm (44 J of kinetic energy), a 1 Ω resistor gives $\\tau$ = 0.25 s and a first current of 15 A; shorting the terminals gives $\\tau$ = 0.08 s but 46 A — as much as a stall. The resistor takes the share $R_b/(R + R_b)$ of the energy; the rest heats the winding. Because the torque fades with speed, dynamic braking never quite stops the load and **cannot hold it**. It works without any supply, which makes it a useful fall-back when the power fails.

### Regeneration
A drive that can reverse its current — a four-quadrant bridge or thyristor drive — lowers its output voltage below the back-EMF and returns the energy to the supply. Braking at a constant 10 A, the same flywheel stops in 0.38 s; about 25 J goes back to the battery and 19 J heats the winding. Where it pays: battery vehicles (range), hoists lowering loads, frequent stops of large inertias, test benches. A mains power supply cannot accept the energy; the bus voltage rises and a **brake chopper** must dump it into a resistor (see [[h-bridge]] and, for AC drives, [[vfd-braking]]).

### Plugging
Reversing the supply of a running motor puts the supply voltage and the back-EMF in series across the winding: nearly twice the stall current, unless a resistor limits it. It stops fastest, but the winding absorbs the kinetic energy plus about twice as much again from the supply, the brushes and magnets are stressed, and at zero speed the motor starts to reverse unless a zero-speed switch or the controller cuts it. Old forklifts braked by plugging; modern drives use regeneration.

### The four quadrants
| Quadrant | Speed | Torque | Mode | Example |
|---|---|---|---|---|
| I | forward | forward | motoring | hoist raising |
| II | forward | reverse | braking (generating) | slowing a forward-running conveyor |
| III | reverse | reverse | motoring | running backwards |
| IV | reverse | forward | braking (generating) | hoist lowering a load |

A single transistor and diode works in quadrant I only; an H-bridge gives all four.

### Holding and safety
None of these electrical methods holds a load at rest: a hoist, a vertical axis or a vehicle on a slope needs a **spring-applied holding brake** ([[motor-brakes]]) that engages when power is removed. Emergency stops follow the stop categories of IEC 60204-1: category 0 removes power at once (the motor coasts, or a mechanical brake stops it), category 1 brakes under control and then removes power, category 2 brakes and keeps power on. Which category and which brake a machine needs comes from its risk assessment ([[emergency-stop]]).

> [!warn] Braking resistors run hot enough to burn and to ignite dust — mount them in the open or in a ventilated, guarded enclosure, sized for the energy of repeated stops. Short-circuit and plugging currents reach or exceed the stall current: check the motor's demagnetisation limit and the driver's rating. Never rely on dynamic braking or a drive to hold a suspended load.

> [!key] A braking DC motor is a generator: its current is proportional to speed. Resistors and shorts stop it passively and fade near zero; regeneration recovers energy at a controlled rate; plugging is brutal. Only a mechanical brake holds.
`,
  ideas: [
    'To brake, let the motor generate: its back-EMF drives a current that makes a torque against the rotation.',
    'Dynamic braking decays exponentially with τ = J(R + R_b)/K²; it fades near zero and cannot hold.',
    'Shorting the terminals brakes hardest of the passive methods, with a current near the stall current.',
    'Regeneration returns part of the kinetic energy to a battery or mains; a power supply needs a brake chopper instead.',
    'Plugging draws about twice the stall current and heats the winding with the kinetic energy plus about twice as much from the supply.'
  ],
  pitfalls: [
    'A motor with dynamic braking will hold a hanging load — The braking torque is proportional to speed and vanishes at standstill; the load creeps down. Hoists need a mechanical holding brake.',
    'Plugging is free braking — It takes energy from the supply as well as the load, roughly tripling the heat in the winding compared with the kinetic energy alone.',
    'Regenerated energy is always recovered — Only if the supply can accept it: a battery or a regenerative mains converter can; an ordinary power supply cannot.'
  ],
  formulas: [
    {
      name: 'Time constant of dynamic braking',
      expr: 'tau = J*(R + Rb)/K^2', tex: '\\tau = \\dfrac{J\\,(R + R_b)}{K^2}',
      vars: {
        tau: { name: 'braking time constant', q: 'time', unit: 's', tex: '\\tau' },
        J: { name: 'inertia of motor and load', q: 'inertia', unit: 'kg·cm²', value: 5 },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.5 },
        Rb: { name: 'braking resistor', q: 'resistance', unit: 'Ω', value: 1, tex: 'R_b' },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 }
      },
      note: 'The speed falls to 37 % in τ and to 5 % in 3τ (friction helps at the end). Rb = 0 is a short circuit.',
      stories: { tau: 'A {J} flywheel on a motor with R = {R} and K = {K} is braked through {Rb}. What is the time constant?', Rb: 'What resistor gives a braking time constant of {tau} for {J} on a motor with R = {R}, K = {K}?' }
    },
    {
      name: 'Dynamic braking current',
      expr: 'I = K*w/(R + Rb)', tex: 'I = \\dfrac{K\\,\\omega}{R + R_b}',
      vars: {
        I: { name: 'braking current at the start', q: 'current', unit: 'A' },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 },
        w: { name: 'speed when braking begins', q: 'angvel', unit: 'rpm', value: 4000, tex: '\\omega' },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.5 },
        Rb: { name: 'braking resistor', q: 'resistance', unit: 'Ω', value: 1, tex: 'R_b' }
      },
      stories: { I: 'A motor with K = {K} and R = {R} is braked through {Rb} from {w}. What current flows at first?', Rb: 'What braking resistor limits the first braking current to {I} from {w} (K = {K}, R = {R})?' }
    },
    {
      name: 'Kinetic energy to remove',
      expr: 'E = J*w^2/2', tex: 'E = \\tfrac12 J\\,\\omega^2',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'J' },
        J: { name: 'inertia of motor and load', q: 'inertia', unit: 'kg·cm²', value: 5 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 4000, tex: '\\omega' }
      },
      note: 'Per stop. Multiply by the stops per hour for the resistor\'s average power; add the potential energy of lowered loads.',
      stories: { E: 'How much energy must be removed to stop {J} turning at {w}?' }
    },
    {
      name: 'Plugging current',
      expr: 'I = (V + K*w)/(R + Rx)', tex: 'I = \\dfrac{V + K\\,\\omega}{R + R_x}',
      vars: {
        I: { name: 'current at the moment of reversal', q: 'current', unit: 'A' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 },
        w: { name: 'speed at reversal', q: 'angvel', unit: 'rpm', value: 4000, tex: '\\omega' },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.5 },
        Rx: { name: 'added series resistor', q: 'resistance', unit: 'Ω', value: 0.5, tex: 'R_x' }
      },
      stories: { I: 'A {V} motor (K = {K}, R = {R}) running at {w} is reversed through an extra {Rx}. What current flows?', Rx: 'What series resistor keeps the plugging current of a {V} motor (K = {K}, R = {R}) at {w} down to {I}?' }
    }
  ],
  examples: [
    {
      title: 'Stopping a flywheel four ways',
      q: 'The 24 V motor ($R$ = 0.5 Ω, $K$ = 0.055) drives 5 kg·cm² at 4 000 rpm. Compare dynamic braking through 1 Ω, a short circuit, regeneration at 10 A and plugging without a resistor.',
      steps: [
        'Kinetic energy $\\tfrac12 \\times 5\\times10^{-4} \\times 418.9^2 = 44$ J.',
        'Through 1 Ω: $\\tau = 5\\times10^{-4} \\times 1.5/0.055^2 = 0.25$ s; first current $0.055 \\times 418.9/1.5 = 15$ A; to 5 % in about 0.74 s. The resistor takes two thirds of the 44 J.',
        'Short: $\\tau$ = 0.083 s, first current 46 A (the stall current is 48 A).',
        'Regeneration at 10 A: torque 0.55 N·m, deceleration 1 100 rad/s², stop in 0.38 s; about 25 J returns to the battery, 19 J heats the winding.',
        'Plugging: $(24 + 23)/0.5 = 94$ A at the first instant — twice the stall current.'
      ],
      a: 'Dynamic: 0.25 s time constant, 15 A; short: 0.08 s, 46 A; regeneration: 0.38 s, 25 J recovered; plugging: 94 A.'
    },
    {
      title: 'Sizing a braking resistor',
      q: 'A machine stops the flywheel 6 times a minute through a 1 Ω resistor. What average power must the resistor dissipate?',
      steps: [
        'Energy per stop in the resistor: $44 \\times 1/1.5 = 29$ J.',
        'Six stops a minute: $6 \\times 29/60 = 2.9$ W average — but a peak of $15^2 \\times 1 = 230$ W at the start of each stop.',
        'Choose a resistor rated for the average with a short-time overload rating for the peak pulses (a 10–25 W wirewound resistor, for instance).'
      ],
      a: 'About 3 W average, 230 W peaks.'
    }
  ],
  quiz: [
    { q: 'Why does dynamic braking weaken as the motor slows?', choices: ['The back-EMF, and so the current and torque, are proportional to speed', 'The resistor cools down', 'The magnets weaken', 'The brushes lift'], a: 0, why: 'I = Kω/(R + R_b): half the speed, half the braking torque — the exponential decay.' },
    { q: 'A hoist must hold its load when the power fails. What does it need?', choices: ['A spring-applied mechanical brake', 'A braking resistor', 'Regenerative braking', 'Plugging'], a: 0, why: 'All electrical braking vanishes at zero speed and without power; a spring-applied brake engages when de-energised.' },
    { q: 'Lowering a load on a hoist (reverse speed, forward torque) is which quadrant?', choices: ['IV — braking in reverse', 'I — motoring forward', 'II — braking forward', 'III — motoring in reverse'], a: 0, why: 'The motor turns backwards while its torque holds the load up: it generates, in quadrant IV.' },
    { q: 'Shorting a PM motor\'s terminals at full speed draws a current close to its stall current.', a: true, why: 'At full speed the back-EMF is almost the supply voltage, so the short-circuit current Kω/R is almost V/R.' },
    { q: 'Reducing the braking resistor from 2 Ω to 0.5 Ω (armature 0.5 Ω) changes the time constant by a factor of…', choices: ['0.4 (1.0/2.5)', '0.25', '4', '1 — no change'], a: 0, why: 'τ ∝ R + R_b: 1.0 Ω instead of 2.5 Ω.' }
  ],
  problems: [
    { q: 'A 2 kg·cm² load on a motor with R = 1 Ω and K = 0.04 V·s/rad is braked through 3 Ω. What is the time constant?', answer: 0.5, unit: 's', tol: 0.02, steps: ['$\\tau = 2\\times10^{-4} \\times 4/0.04^2 = 8\\times10^{-4}/1.6\\times10^{-3} = 0.5$ s.'] },
    { q: 'How much kinetic energy does 0.05 kg·m² store at 1 500 rpm?', answer: 617, unit: 'J', tol: 0.02, steps: ['$\\omega = 157.1$ rad/s.', '$E = \\tfrac12 \\times 0.05 \\times 157.1^2 = 617$ J.'] }
  ],
  choose: {
    good: [
      'Dynamic braking: simple, fast stops of moderate inertia, and a stop that works when the supply fails.',
      'Regeneration: battery vehicles, hoists, frequent stops of large inertias — where the energy is worth recovering.',
      'Low-side short (slow decay) in an H-bridge: quick stops of small motors.'
    ],
    avoid: [
      'Plugging without current limiting and a zero-speed cut-off.',
      'Relying on any electrical braking to hold a load at rest or as a safety function by itself.',
      'Regenerating into a power supply without a brake chopper or clamp.'
    ],
    check: [
      'Braking current against the motor\'s peak (demagnetisation) and the driver\'s rating.',
      'Energy per stop and stops per hour, for the resistor\'s average and peak power.',
      'Where regenerated energy goes, and the bus overvoltage limit.',
      'A holding brake for vertical or overhauling loads, and the stop category from the risk assessment.'
    ]
  },
  applications: [
    'Battery vehicles and e-bikes recover part of their kinetic energy when slowing.',
    'Some saws and grinders brake electrically when released, reconnecting the motor as a generator, so the blade stops in seconds.',
    'Cranes and lifts combine dynamic or regenerative braking with spring-applied holding brakes.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: regenerative and dynamic braking of DC motors, four-quadrant operation.',
    'Chapman, *Electric Machinery Fundamentals*: DC motor braking and speed control.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines*: stop categories 0, 1 and 2 and emergency stop.'
  ],
  sim: 'dc-braking-lab'
},

{
  id: 'dc-gearmotors', parent: 'dc-control', title: 'DC gearmotors', level: 1,
  short: 'A small DC motor is efficient at thousands of rpm and a fraction of a newton-metre; most jobs want tens of rpm and several newton-metres. A gearbox on the motor trades one for the other. Spur, planetary and worm gearheads compared: ratio, efficiency, backlash, self-locking, noise and the torque the gears can survive.',
  keywords: ['gearmotor', 'gear motor', 'gearhead', 'spur gearbox', 'planetary gearbox', 'worm gear', 'gear ratio', 'reduction ratio', 'gear efficiency', 'backlash', 'self-locking', 'back-driving', 'output torque', 'rated gearbox torque', 'reflected inertia', 'service factor', 'wiper motor', 'window motor'],
  prereq: ['dc-torque-speed', 'gearboxes', 'pmdc-motor'],
  related: ['inertia-reflected', 'motor-selection-method', 'dc-motor-drivers', 'motor-brakes', 'motor-noise', 'friction-in-motors', 'physics:torque'],
  body: `
A 24 V, 100 W PMDC motor is most efficient near 3 750 rpm and 0.25 N·m. A conveyor roller might need 60 rpm and 8 N·m; a car window, a few N·m at tens of rpm; a turntable, 5 rpm. Running the motor slowly at high torque would put it near stall — hot and inefficient. A **gearbox** of ratio $i$ lets the motor run where it is happy: the output turns $i$ times slower and gives $i$ times the torque, less the gear losses:

$$n_2 = \\frac{n_1}{i}, \\qquad T_2 = T_1\\, i\\, \\eta$$

The whole torque–speed line of the motor is scaled: stretched in torque, squeezed in speed. In the sim, change the ratio and watch the output line swing, and the motor's operating point slide towards its best efficiency.

### Three kinds of gearhead
| | Spur | Planetary | Worm |
|---|---|---|---|
| Shafts | parallel, offset | in line | at right angles |
| Ratio per stage | about 3–6 | about 3–10 | 5–100 in one stage |
| Efficiency | about 90 % per stage (80–95 %) | about 90 % per stage in small gearheads, 95–97 % in precision ones | 85–90 % at 5–10 : 1, 50–70 % at 30–50 : 1, 30–50 % at 60–100 : 1 |
| Torque density | low | highest (load shared by 3–4 planets) | medium |
| Backlash, small commercial units | 1–3° | 0.5–1.5° (a few arcminutes in precision units) | 0.5–2° |
| Noise | noisiest at speed (straight teeth) | moderate | quietest |
| Back-driving | easy | easy | hard; high ratios often self-locking |

Efficiencies multiply: three stages at 90 % give $0.9^3$ = 73 %, four give 66 %. A 100 : 1 small spur gearmotor may therefore deliver only about two thirds of the motor's torque times 100.

### Choosing the ratio
Pick the ratio that puts the motor near its rated point at the load's speed: $i \\approx n_{motor}/n_{load}$. For a conveyor roller needing 60 rpm and 8 N·m with the 24 V motor above, $i$ = 3 750/60 ≈ 62.5 (a three-stage planetary, 73 %). The motor must give $8/(62.5 \\times 0.73)$ = 0.18 N·m, drawing 3.4 A at about 3 870 rpm: the output turns at 62 rpm — close to the target, near the best-efficiency region, with 71 W in at the motor shaft and 52 W out of the gearbox.

### The gearbox has its own limits
- **Rated output torque**, continuous and short-time (for starts and shocks). The motor's stall torque times the ratio is often far above it: our motor stalls at 2.6 N·m, which through 62.5 : 1 at 73 % is **120 N·m** — enough to strip a gearhead rated perhaps 15–20 N·m. Limit the motor current: to keep the output under 20 N·m here, below about 8 A.
- **Maximum input speed** (often 3 000–8 000 rpm for small gearheads) and **shaft loads**: radial and axial forces from pulleys, pinions and cantilevered wheels.
- **Service factor**: shock loads, frequent starts and long daily running need a gearbox rated above the steady torque — typically by 1.25–2 for moderate to heavy shocks.
- **Temperature and lubricant**: grease thickens in the cold, so the no-load current and the efficiency suffer at −20 °C; worm gears run warm and need running in.
- **Backlash**: the free play at the output, which matters for positioning and for loads that reverse. Anti-backlash or precision gearheads cost more.

### Holding and self-locking
A spur or planetary gearmotor can be driven backwards by its load: a hanging weight will turn the motor and descend when the power is off. A worm gear with a lead angle smaller than its friction angle cannot be turned from the wheel — the classic self-locking car window lift and seat adjuster. But self-locking depends on friction, which falls with vibration and wear: **a worm gear is not a brake**. The sim shows a lifted weight with the power off: planetary lets it fall, a high-ratio worm holds it.

### Inertia through the gears
A load inertia $J_L$ appears at the motor as $J_L/i^2$ ([[inertia-reflected]]). High ratios make a heavy load look tiny to the motor — good for acceleration and control, and one reason small gearmotors start big loads easily.

> [!warn] A gearmotor multiplies torque: a small motor through a high ratio can crush fingers, break its own gears or strip the load at stall. Limit the current, guard the output, and support hanging loads with a real brake, not a self-locking worm.

> [!key] A gearhead lets a small, fast motor run near its best point while the output turns slowly with high torque: choose the ratio for the speed, check the efficiency, the gearbox's rated torque, backlash and back-driving.
`,
  ideas: [
    'The output turns i times slower with i·η times the motor torque; efficiencies of stages multiply.',
    'Choose the ratio that puts the motor near its rated point at the load speed.',
    'The gearbox has its own torque rating, usually far below the motor stall torque times the ratio: limit the current.',
    'Spur is cheap and noisy, planetary compact and strong, worm quiet, right-angled, less efficient and often self-locking.',
    'Self-locking is not a brake; the reflected load inertia falls with the square of the ratio.'
  ],
  pitfalls: [
    'A 100 : 1 gearbox gives 100 times the motor torque — It gives 100 × η, and multi-stage efficiency may be only 60–75 %.',
    'The strongest motor that fits is the safest choice — Its stall torque through the gears may exceed the gearbox rating many times; the current limit must protect the gears.',
    'A self-locking worm gear can hold a suspended load safely — Friction falls with vibration, heat and wear; loads can creep or fall. Use a brake.'
  ],
  formulas: [
    {
      name: 'Output torque of a gearmotor',
      expr: 'T2 = T1*i*eta', tex: 'T_2 = T_1\\, i\\, \\eta',
      vars: {
        T2: { name: 'output torque', q: 'torque', unit: 'N·m', tex: 'T_2' },
        T1: { name: 'motor torque', q: 'torque', unit: 'N·m', value: 0.25, tex: 'T_1' },
        i: { name: 'gear ratio', value: 30 },
        eta: { name: 'gearbox efficiency', q: 'ratio', unit: '%', value: 73, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { T2: 'A motor gives {T1} through a {i}:1 gearbox of {eta} efficiency. What torque comes out?', T1: 'A load needs {T2} at the output of a {i}:1 gearbox of {eta} efficiency. What must the motor give?' }
    },
    {
      name: 'Output speed',
      expr: 'n2 = n1/i', tex: 'n_2 = \\dfrac{n_1}{i}',
      vars: {
        n2: { name: 'output speed', q: 'angvel', unit: 'rpm', tex: 'n_2' },
        n1: { name: 'motor speed', q: 'angvel', unit: 'rpm', value: 3750, tex: 'n_1' },
        i: { name: 'gear ratio', value: 30 }
      },
      stories: { i: 'A motor at {n1} must drive a load at {n2}. What ratio is needed?', n2: 'A motor at {n1} drives through {i}:1. How fast is the output?' }
    },
    {
      name: 'Efficiency of several stages',
      expr: 'eta = es^k', tex: '\\eta = \\eta_s^{\\,k}',
      vars: {
        eta: { name: 'overall efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        es: { name: 'efficiency per stage', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta_s' },
        k: { name: 'number of stages', value: 3, int: true }
      },
      stories: { eta: 'A gearhead has {k} stages of {es} each. What is its overall efficiency?' }
    },
    {
      name: 'Load inertia seen by the motor',
      expr: 'Jr = JL/i^2', tex: 'J_r = \\dfrac{J_L}{i^2}',
      vars: {
        Jr: { name: 'reflected inertia at the motor', q: 'inertia', unit: 'kg·cm²', tex: 'J_r' },
        JL: { name: 'load inertia at the output', q: 'inertia', unit: 'kg·m²', value: 0.05, tex: 'J_L' },
        i: { name: 'gear ratio', value: 30 }
      },
      note: 'Gear losses make the effective value a little larger during acceleration; the gearbox\'s own inertia adds to the motor\'s.',
      stories: { Jr: 'A {JL} load is driven through {i}:1. What inertia does the motor feel?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a gearmotor for a conveyor roller',
      q: 'A roller needs 8 N·m at 60 rpm. Use the 24 V motor ($R$ = 0.5 Ω, $K$ = 0.055, $I_0$ = 0.25 A) with a three-stage planetary gearhead (90 % per stage). Choose the ratio and find the motor current and the output speed.',
      steps: [
        'The motor\'s good region is near 3 750 rpm, so $i \\approx 3\\,750/60 = 62.5$.',
        'Gearbox efficiency $0.9^3 = 0.73$. Motor torque $8/(62.5 \\times 0.729) = 0.176$ N·m.',
        'Current $0.176/0.055 + 0.25 = 3.44$ A; motor speed $(24 - 0.5 \\times 3.44)/0.055 = 405$ rad/s = 3 870 rpm.',
        'Output $3\\,870/62.5 = 62$ rpm; power 71 W at the motor shaft, 52 W at the roller.'
      ],
      a: 'A ratio of about 62.5 : 1; 3.4 A; about 62 rpm at the roller.'
    },
    {
      title: 'Protecting the gearbox',
      q: 'The same gearmotor\'s gearhead is rated 20 N·m for short peaks. What does the motor give at stall through it, and what current limit protects it?',
      steps: [
        'Motor stall torque about 2.6 N·m; through the gears $2.6 \\times 62.5 \\times 0.729 = 120$ N·m — six times the rating.',
        'Allowed motor torque $20/(62.5 \\times 0.729) = 0.44$ N·m, i.e. a current of $0.44/0.055 + 0.25 = 8.2$ A.',
        'Set the driver\'s current limit at or below about 8 A.'
      ],
      a: 'About 120 N·m at stall; limit the current to about 8 A.'
    }
  ],
  quiz: [
    { q: 'A motor gives 0.1 N·m at 3 000 rpm through a 50 : 1 gearbox of 70 % efficiency. The output is…', choices: ['3.5 N·m at 60 rpm', '5 N·m at 60 rpm', '3.5 N·m at 150 000 rpm', '0.1 N·m at 60 rpm'], a: 0, why: 'T₂ = 0.1 × 50 × 0.7 = 3.5 N·m; n₂ = 3 000/50 = 60 rpm.' },
    { q: 'Which gearhead lets a hanging load fall when the motor is switched off?', choices: ['A planetary gearhead', 'A high-ratio single-start worm gear', 'Neither — gears always hold', 'Both equally'], a: 0, why: 'Planetary and spur gears back-drive easily; high-ratio worms are often (not reliably) self-locking.' },
    { q: 'Four stages of 90 % each give an overall efficiency of about…', answer: 66, unit: '%', why: '0.9⁴ = 0.656.' },
    { q: 'A load of 0.09 kg·m² is driven through 30 : 1. The inertia the motor feels is…', choices: ['1 kg·cm² (0.0001 kg·m²)', '30 kg·cm²', '0.003 kg·m²', '2.7 kg·m²'], a: 0, why: 'J/i² = 0.09/900 = 0.0001 kg·m² = 1 kg·cm².' },
    { q: 'A worm gearmotor that has held its load for years can be trusted as the holding brake of a hoist.', a: false, why: 'Self-locking depends on friction, which vibration, heat and wear reduce. Hoists need a proper brake.' }
  ],
  problems: [
    { q: 'A load needs 12 N·m at 40 rpm. Through a 75 : 1 gearhead of 70 % efficiency, what torque must the motor give, and at what speed?', answer: 0.229, unit: 'N·m', tol: 0.02, steps: ['$T_1 = 12/(75 \\times 0.7) = 0.229$ N·m.', 'Speed $40 \\times 75 = 3\\,000$ rpm.'] },
    { q: 'What is the overall efficiency of a two-stage spur gearbox at 92 % per stage followed by a worm stage of 60 %?', answer: 50.8, unit: '%', tol: 0.02, steps: ['$0.92^2 \\times 0.60 = 0.508$.'] }
  ],
  choose: {
    good: [
      'Planetary: high torque in line in a small package — conveyors, AGV wheels, actuators, robots.',
      'Spur: cheap and simple at modest torque — toys, vending machines, dispensers, small pumps.',
      'Worm: right-angle, quiet, high single-stage ratio, resists back-driving — windows, seats, gates, turntables.'
    ],
    avoid: [
      'Worm gears where efficiency or battery life matters at high ratios, or where back-driving must be possible.',
      'Plastic spur gears for shock loads or high output torque.',
      'Any gearhead as the only means of holding a suspended load.'
    ],
    check: [
      'Output speed and torque at the rated point; the ratio that puts the motor near its best efficiency.',
      'Continuous and peak output torque ratings against the motor stall torque × ratio × efficiency; set the current limit.',
      'Backlash, back-driving, noise and the shaft\'s radial and axial load ratings.',
      'Service factor for shocks and duty, lubrication and the temperature range.'
    ]
  },
  applications: [
    'Cars: windows, seats, mirrors, wipers and tailgates are PMDC worm or spur gearmotors on 12 V.',
    'Automated guided vehicles and mobile robots: planetary gearmotors with encoders at the wheels.',
    'Gate openers, blinds, dosing pumps, vending machines and laboratory automation.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: the motor and its load, gearing and optimum ratio.',
    'Manufacturers\' gearhead catalogues list ratios, efficiencies, backlash, rated and peak output torques, input speed limits and shaft loads.',
    'Shigley\'s *Mechanical Engineering Design*: spur, planetary and worm gearing, efficiency and self-locking of worm gears.'
  ],
  sim: 'dc-gearmotor-lab'
}

);
