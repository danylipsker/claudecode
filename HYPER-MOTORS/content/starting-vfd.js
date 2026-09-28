/* HYPER-MOTORS · content/starting-vfd.js
 * Starting and protecting AC motors (DOL, star-delta, autotransformer and reactor, soft starters, overloads, breakers and
 * thermistors) and the variable-frequency drive (principle, V/f, vector control and DTC, parameters, braking, wiring and
 * EMC, energy saving on fans and pumps). Simulations: sims/starting-vfd.js (prefix sd-).
 */
Hyper.add(

/* ================================================================ STARTING AND PROTECTION */
{
  id: 'dol-starting', parent: 'starting-methods', title: 'Direct-on-line starting', level: 1,
  short: 'The simplest way to start a cage motor: a contactor puts full mains voltage on it at once. It gives the full starting torque but draws five to eight times the rated current, dips the supply voltage and jolts the machine. A contactor, an overload relay and a start/stop latching circuit make the classic DOL starter.',
  keywords: ['DOL', 'direct on line', 'across the line', 'contactor', 'overload relay', 'start stop circuit', 'latching', 'seal-in', 'holding contact', 'inrush current', 'locked-rotor current', 'voltage dip', 'AC-3', 'no-volt release', 'run-up time'],
  prereq: ['torque-slip-curve', 'squirrel-cage', 'nameplate-reading'],
  related: ['star-delta-starting', 'soft-starters', 'motor-protection', 'vfd-principle', 'reversing-three-phase', 'emergency-stop', 'electronics:relays', 'pneumatics:ladder-diagrams'],
  body: `
Direct-on-line (DOL, or "across the line") starting is the simplest thing you can do with a cage motor: close a contactor and put the full mains voltage on the windings. At standstill there is no [[back-emf]] yet, so the motor behaves like a transformer with a short-circuited secondary and only its leakage reactances limit the current. It draws its **locked-rotor current**, typically **5–8 times** the rated current (7–9 times for many IE3 and IE4 motors, whose low-resistance rotors trade inrush for efficiency), at a poor power factor of about 0.3–0.5. The current stays high while the motor climbs its [[torque-slip-curve|torque–speed curve]] and falls to the load current only in the last few per cent of speed. A 7.5 kW 4-pole motor rated 14–15 A at 400 V draws 90–110 A for anything from a fraction of a second to several seconds; a 90 kW motor draws well over 1000 A.

### The starter
| Part | What it does | Typical choice |
|---|---|---|
| Short-circuit protection | clears faults in the cable and the motor | aM or gG fuses, or a motor-protective circuit breaker with a magnetic trip at about 12–14 × its setting |
| Contactor K1 | switches the motor, for hundreds of thousands of operations or more | chosen by its **AC-3** rating (cage motors started, and switched off while running): an 18 A contactor for 7.5 kW at 400 V |
| Overload relay F1 | trips when the current stays too high for too long | set to the nameplate current; trip class 10 for normal starts (see [[motor-protection]]) |
| Control circuit | start, stop, interlocks, emergency stop | coil for 24 V DC, 110 V AC or 230 V AC |

On a DIN rail a contactor for motors up to about 15–18.5 kW at 400 V is typically 45 mm wide; up to about 37 kW, 55–60 mm; larger ones 70 mm and more. The main contacts lose roughly 1–3 W at rated current; the coil takes a few watts to hold (an AC coil draws several times more for a few tens of milliseconds while it pulls in).

### The start/stop latching circuit
The control circuit is a small chain in series with the contactor coil A1–A2: the **Stop** button (normally closed), then the **Start** button (normally open), then the overload relay's NC contact 95–96. Across the Start button sits K1's own auxiliary NO contact 13–14. Press Start: the coil pulls in, the main contacts close and so does 13–14. Release Start: the coil stays fed through 13–14 — the contactor **seals itself in**. Press Stop, or let the overload open 95–96, or let the supply fail, and the coil drops out, 13–14 opens and the motor stays off until someone presses Start again.

That last point is a safety feature, **no-volt release**: after a power cut the machine does not restart by itself. A maintained switch in place of the pushbuttons would restart a saw or a conveyor the moment power returned. IEC 60204-1 requires machines to be protected against such unexpected restarts where they could be dangerous.

| Marking | Meaning |
|---|---|
| 1/L1–2/T1, 3/L2–4/T2, 5/L3–6/T3 | main poles: line side in, motor side out |
| A1–A2 | contactor coil |
| 13–14, 23–24 / 21–22 | auxiliary contacts: last digits 3–4 are NO, 1–2 are NC |
| 95–96 / 97–98 | overload relay: NC trip contact / NO signal contact |
| U1, V1, W1 | motor terminals (IEC 60034-8) |

### The voltage dip
The starting current flows through the supply transformer and the cables, and the voltage everyone else sees sags. Roughly ([[?approx|≈]]), the fractional dip is the motor's starting apparent power divided by the short-circuit power at the connection point, $\\Delta V/V \\approx S_{start}/S_{sc}$, and for a transformer $S_{sc} \\approx S_T/u_k$. A 55 kW motor drawing 700 A at 400 V asks for 485 kVA; behind a 630 kVA transformer with $u_k$ = 6 % (10.5 MVA short-circuit power) the busbar dips about 4.6 %, behind a 250 kVA, 4 % transformer about 8 %. The long motor cable adds its own drop at the motor terminals. Lights flicker, other motors slow, drives may trip on undervoltage, and a deep enough dip lets contactor coils drop out. Utilities limit DOL starting on public low-voltage networks, often to motors of a few kilowatts; in a plant with its own transformer, motors of 100 kW and more are routinely started DOL.

### The mechanical jolt and the run-up
Full starting torque — typically 1.5–3 times the rated torque — arrives in a few milliseconds. Belts slip and squeal, gear teeth hammer across their backlash, couplings wear, products slide on conveyors, and pumps on long pipelines surge ([[hydraulics:water-hammer|water hammer]]). The run-up time is set by the inertia and the torque left over for accelerating, $t = J\\omega/T_{acc}$: a pump comes up in well under a second, a big fan with a heavy wheel may take 10–30 s, and all that time the motor carries its starting current. That is what the overload relay's trip class must allow.

**In the simulation**, press *Start* and watch the latching circuit light up, the current leap to its locked-rotor value and the busbar voltage dip; try a weak transformer and a big motor, cut the power and see that the motor does not restart, and jam the load to watch the overload relay open 95–96.

> [!warn] Starters work at mains voltage. Wiring, testing and fault-finding in a starter are for qualified electricians, with the supply isolated, locked off and proven dead. The motor's terminal-box diagram, the starter maker's instructions and local wiring rules govern; an emergency stop must follow ISO 13850 and IEC 60204-1.

> [!key] DOL is the cheapest, smallest and most robust starter and gives the motor its full starting torque — at the price of five to eight times the rated current, a voltage dip and a mechanical jolt. Use it when the supply and the machine can take both.
`,
  ideas: [
    'At standstill there is no back-EMF, so a cage motor draws its locked-rotor current: 5–8 times rated, at a power factor of about 0.3–0.5.',
    'A DOL starter is short-circuit protection, a contactor sized by its AC-3 rating, and an overload relay set to the nameplate current.',
    'The start/stop circuit seals in through the contactor\'s own 13–14 contact, so the motor stays off after a power cut until Start is pressed again.',
    'The voltage dip is roughly the starting kVA divided by the short-circuit power of the supply.',
    'The run-up time t = Jω/T_acc must fit inside the overload relay\'s trip time at the starting current.'
  ],
  pitfalls: [
    'The starting current lasts only an instant, so it does not matter — It lasts the whole run-up, which for high-inertia loads is 10–30 s, and it heats the motor, trips overloads and dips the supply for all of that time.',
    'A start/stop toggle switch is as good as two pushbuttons — A maintained switch restarts the motor by itself when power returns after a cut; the latching pushbutton circuit does not.',
    'A contactor rated 18 A can switch any 18 A load — Its motor rating is the AC-3 current; for plugging and inching (AC-4) or for resistive loads (AC-1) the ratings differ.'
  ],
  formulas: [
    {
      name: 'Rated current of a three-phase motor',
      expr: 'I = P/(sqrt(3)*V*eta*pf)', tex: 'I = \\dfrac{P}{\\sqrt{3}\\,V\\,\\eta\\,\\mathrm{PF}}',
      vars: {
        I: { name: 'line current', q: 'current', unit: 'A' },
        P: { name: 'rated output (shaft) power', q: 'power', unit: 'kW', value: 7.5 },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 90.4, tex: '\\eta', min: 1, max: 100 },
        pf: { name: 'power factor (cos φ)', value: 0.82, min: 0.05, max: 1, tex: '\\mathrm{PF}' }
      },
      note: 'Multiply by the locked-rotor ratio on the nameplate or datasheet (often 6–8) for the DOL starting current.',
      stories: { I: 'A {P} motor at {V} has an efficiency of {eta} and a power factor of {pf}. What current does it draw at full load?', P: 'A motor on {V} draws {I} at efficiency {eta} and power factor {pf}. What shaft power does it deliver?' }
    },
    {
      name: 'Voltage dip when a motor starts (estimate)',
      expr: 'dV = sqrt(3)*V*I*uk/S', tex: '\\Delta V \\approx \\dfrac{\\sqrt{3}\\,V\\,I_{LR}\\,u_k}{S_T}',
      vars: {
        dV: { name: 'voltage dip, as a fraction of the nominal voltage', q: 'ratio', unit: '%', tex: '\\Delta V' },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 },
        I: { name: 'locked-rotor (starting) current', q: 'current', unit: 'A', value: 700, tex: 'I_{LR}' },
        uk: { name: 'transformer short-circuit impedance', q: 'ratio', unit: '%', value: 6, tex: 'u_k' },
        S: { name: 'transformer rating', q: 'apparentpower', unit: 'kVA', value: 630, tex: 'S_T' }
      },
      note: 'The starting kVA over the short-circuit power S_T/u_k. It ignores the upstream network (which makes the dip larger) and the difference in phase angle between the two impedances; the cable drop comes on top at the motor terminals.',
      stories: { dV: 'A motor draws {I} when started on {V} from a {S} transformer with u_k = {uk}. How deep is the voltage dip at the busbar?', S: 'A motor drawing {I} at {V} may dip the supply by no more than {dV}. How large a transformer (u_k = {uk}) is needed?' }
    },
    {
      name: 'Run-up time',
      expr: 't = J*w/T', tex: 't = \\dfrac{J\\,\\omega}{T_{acc}}',
      vars: {
        t: { name: 'run-up time', q: 'time', unit: 's' },
        J: { name: 'inertia of motor and load (at the motor shaft)', q: 'inertia', unit: 'kg·m²', value: 12.15 },
        w: { name: 'final speed', q: 'angvel', unit: 'rpm', value: 1470, tex: '\\omega' },
        T: { name: 'average accelerating torque (motor minus load)', q: 'torque', unit: 'N·m', value: 243, tex: 'T_{acc}' }
      },
      note: 'Use the average of motor torque minus load torque over the run-up; a fan\'s load torque averages about a third of its full-speed value.',
      stories: { t: 'A fan and motor with {J} are accelerated to {w} by an average surplus torque of {T}. How long is the run-up?', T: 'A load of {J} must reach {w} within {t}. What average accelerating torque is needed?' }
    }
  ],
  examples: [
    {
      title: 'The current of a 7.5 kW motor, running and starting',
      q: 'A 7.5 kW, 400 V, 4-pole IE3 motor has an efficiency of 90.4 %, a power factor of 0.82, a rated speed of 1455 rpm and, on its datasheet, a locked-rotor current of 7.2 × rated and a locked-rotor torque of 2.3 × rated. Find its rated current, its DOL starting current and starting torque.',
      steps: [
        '$I_n = 7500/(\\sqrt{3} \\times 400 \\times 0.904 \\times 0.82) = 7500/513.6 = 14.6$ A.',
        'Starting current $7.2 \\times 14.6 = 105$ A, at a power factor near 0.4.',
        'Rated torque $T_n = 7500/(1455 \\times 2\\pi/60) = 7500/152.4 = 49.2$ N·m; starting torque $2.3 \\times 49.2 = 113$ N·m.'
      ],
      a: 'About 14.6 A running, 105 A and 113 N·m at the start.'
    },
    {
      title: 'How deep is the dip?',
      q: 'A 55 kW pump motor (rated 100 A, locked-rotor current 7 × rated) is started DOL at 400 V. Estimate the busbar voltage dip behind a 630 kVA transformer with $u_k$ = 6 %, and behind a 250 kVA transformer with $u_k$ = 4 %.',
      steps: [
        'Starting apparent power $S = \\sqrt{3} \\times 400 \\times 700 = 485$ kVA.',
        '630 kVA, 6 %: $S_{sc} = 630/0.06 = 10\\,500$ kVA, dip $\\approx 485/10\\,500 = 4.6$ %.',
        '250 kVA, 4 %: $S_{sc} = 6250$ kVA, dip $\\approx 7.8$ % — at the busbar, before the cable drop to the motor.'
      ],
      a: 'About 4.6 % on the 630 kVA transformer and about 8 % on the 250 kVA one; the smaller supply calls for a reduced-voltage starter or a VFD.'
    },
    {
      title: 'Will the overload trip during the start?',
      q: 'A 22 kW, 1470 rpm fan motor (rated torque 143 N·m) drives a fan wheel of 12 kg·m² (motor rotor 0.15 kg·m²). The motor averages about 2 × rated torque during the run-up and the fan about 43 N·m. How long is the run-up, and is a class 10 overload relay suitable?',
      steps: [
        'Average accelerating torque $2 \\times 143 - 43 = 243$ N·m; $\\omega = 1470 \\times 2\\pi/60 = 153.9$ rad/s.',
        '$t = J\\omega/T_{acc} = 12.15 \\times 153.9/243 = 7.7$ s.',
        'A class 10 relay may trip anywhere between 4 and 10 s at 7.2 × its setting, so a 7.7 s start at about 7 × is marginal: choose class 20 (6–20 s), and check that the motor itself is allowed a 7.7 s start.'
      ],
      a: 'About 7.7 s; use a class 20 relay rather than class 10.'
    }
  ],
  quiz: [
    { q: 'Why does a cage motor draw five to eight times its rated current when started DOL?', choices: ['At standstill there is no back-EMF; only the leakage impedance limits the current', 'The contactor contacts bounce', 'The rotor is magnetised for the first time', 'The overload relay adds resistance only after the start'], a: 0, why: 'The rotor is not moving, so no speed voltage opposes the supply; the motor looks like a short-circuited transformer until it speeds up.' },
    { q: 'In a start/stop circuit, which contact keeps the coil energised after the Start button is released?', choices: ['The contactor\'s own auxiliary NO contact 13–14, wired across Start', 'The overload relay\'s 95–96', 'The Stop button\'s NC contact', 'The main contact 1–2'], a: 0, why: 'The auxiliary NO contact closes when the coil pulls in and bypasses the Start button: the contactor seals itself in.' },
    { q: 'After a short power cut, a conveyor started by a latching pushbutton circuit restarts by itself when the power returns.', a: false, why: 'The coil drops out when the supply fails and its seal-in contact opens with it; the motor stays off until Start is pressed — no-volt release.' },
    { q: 'A motor needs 500 kVA to start and the supply\'s short-circuit power is 10 MVA. The dip is about…', choices: ['5 %', '0.5 %', '20 %', '50 %'], a: 0, why: 'ΔV/V ≈ S_start/S_sc = 0.5/10 = 5 %.' },
    { q: 'Which change makes a DOL run-up longer?', choices: ['A heavier fan wheel on the same motor', 'A stiffer supply transformer', 'A higher trip class on the overload relay', 'A smaller motor cable voltage drop'], a: 0, why: 't = Jω/T_acc: more inertia, same surplus torque, longer run-up. The trip class changes only how long the relay tolerates it.' }
  ],
  problems: [
    { q: 'A 15 kW, 400 V motor has an efficiency of 91.9 % and a power factor of 0.85. What is its rated current?', answer: 27.7, unit: 'A', tol: 0.02, steps: ['$I = 15\\,000/(\\sqrt{3} \\times 400 \\times 0.919 \\times 0.85)$', '$= 15\\,000/541.2 = 27.7$ A.'] },
    { q: 'A pump and motor with a combined inertia of 2.5 kg·m² run up to 1475 rpm with an average accelerating torque of 150 N·m. How long does the start take?', answer: 2.57, unit: 's', tol: 0.02, steps: ['$\\omega = 1475 \\times 2\\pi/60 = 154.5$ rad/s.', '$t = 2.5 \\times 154.5/150 = 2.57$ s.'] }
  ],
  choose: {
    good: [
      'Small and medium motors on a stiff supply: the cheapest, smallest and most robust starter, with no electronics.',
      'Loads that need the full starting torque, such as loaded conveyors, mixers and crushers, when the supply can take the current.',
      'Pumps and fans with modest inertia and short pipelines, started a few times an hour.'
    ],
    avoid: [
      'Weak supplies — small transformers, generator sets, long feeders — where the dip upsets other equipment or the utility forbids it.',
      'Belt, gear and chain drives and fragile products that suffer from the torque jolt; pumps on long pipelines (water hammer).',
      'High-inertia loads with long run-ups and frequent starts, which overheat the motor.'
    ],
    check: [
      'The supply\'s short-circuit power and the resulting dip, and the utility\'s rules for DOL starting.',
      'The run-up time against the overload relay\'s trip class and the motor\'s allowed locked-rotor time.',
      'The contactor\'s AC-3 rating at your voltage and the short-circuit coordination with the fuses or breaker.',
      'Starts per hour allowed for the motor (each start heats it as much as minutes of running).'
    ]
  },
  applications: [
    'Workshop compressors, small pumps, fans and machine tools: a DOL starter in a small enclosure, often a motor-protective breaker plus a contactor.',
    'Large plant motors on their own transformer: DOL starting of 100–500 kW pumps and fans is common where the supply is stiff.',
    'Try the control and power circuits in [the starter wiring diagrams](#/tools/wiring/starters).'
  ],
  sources: [
    'IEC 60947-4-1, *Low-voltage switchgear and controlgear — Contactors and motor-starters — Electromechanical contactors and motor-starters*: utilisation categories (AC-3, AC-4), overload relay trip classes, coordination types.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines — General requirements*: control circuits, protection against unexpected restart.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.',
    'NEMA MG 1, *Motors and Generators*: locked-rotor kVA code letters on American nameplates.',
    'Hughes and Drury, *Electric Motors and Drives*: the induction motor\'s starting current and torque.'
  ],
  sim: ['sd-dol', 'sd-starter-compare']
},

{
  id: 'star-delta-starting', parent: 'starting-methods', title: 'Star-delta starting', level: 2,
  short: 'A motor built to run in delta is started in star, so each winding sees only 1/√3 of the line voltage: line current and torque both fall to a third of their direct-on-line values. After a few seconds a timer switches it to delta. Three contactors, a timer and six motor leads; cheap and electronics-free, but only for loads that start light.',
  keywords: ['star-delta', 'wye-delta', 'Y-Δ starter', 'star delta starter', 'reduced voltage starting', 'three contactors', 'timer', 'open transition', 'closed transition', 'transition current', 'six leads', '400/690 V motor'],
  prereq: ['dol-starting', 'star-delta-connection', 'torque-slip-curve'],
  related: ['autotransformer-starting', 'soft-starters', 'motor-protection', 'dual-voltage-motors', 'load-torque-types', 'electronics:three-phase'],
  body: `
A motor wound for 400 V per winding runs in **delta** on a 400 V network (its nameplate reads 400 V Δ / 690 V Y). Connect the same windings in **star** and each one gets only $400/\\sqrt{3}$ = 231 V. The impedance of a winding is the same either way, so the winding current falls by [[?square-root|the square root]] $\\sqrt{3}$; and in delta the line current is $\\sqrt{3}$ times the winding current while in star it equals it. Put together:

$$\\frac{I_{line,\\,Y}}{I_{line,\\,\\Delta}} = \\frac{1}{\\sqrt{3}}\\cdot\\frac{1}{\\sqrt{3}} = \\frac{1}{3}, \\qquad \\frac{T_Y}{T_\\Delta} = \\left(\\frac{1}{\\sqrt{3}}\\right)^2 = \\frac{1}{3}$$

Torque goes with the square of the voltage (see [[star-delta-connection]]), so the torque falls to a third as well. A motor that would draw 7 × rated current and give 2.2 × rated torque direct on line draws about 2.3 × and gives about 0.73 × in star.

### The starter
| Device | Job | Size (for motor current $I_n$) |
|---|---|---|
| KM1, main contactor | feeds U1, V1, W1 from L1, L2, L3 | $0.58\\,I_n$ (AC-3) |
| KM3, star contactor | shorts U2, V2, W2 together | $0.33\\,I_n$ |
| KM2, delta contactor | connects W2, U2, V2 to L1, L2, L3 | $0.58\\,I_n$ |
| Timer KT | ends the star stage, with a dead time before delta | a few seconds to about 30 s |
| Overload relay | in the winding lines after KM1 | set to $0.58\\,I_n$ ($I_n/\\sqrt{3}$) |

The star and delta contactors must never close together — that would short the supply through the windings — so they are **interlocked** both electrically (each one's NC auxiliary contact in the other's coil circuit) and, better, mechanically. A dedicated star-delta timer has a changeover with a fixed dead time of a few tens of milliseconds (often about 50 ms) so that the star contactor's arc is out before the delta contactor closes. The motor needs **six leads** and so two three-core cables (or one six-core), and the delta connections must pair U1 with W2, V1 with U2 and W1 with V2; swap a pair and the motor tries to reverse at the switch-over, with an enormous current.

### When to switch
Switch too early and the motor, still slow, takes almost its DOL current in delta — the starter has saved nothing. Switch when the motor has reached nearly its full speed **in star**: typically 85–95 % of rated speed, where the star current has fallen close to the load current. Set the timer to the measured run-up time in star plus a small margin; with a clamp meter you can watch the current settle. If the load needs more than the star torque at some speed, the motor hangs there in star, and the timer then switches it to delta at low speed — a DOL start in disguise.

### The transition
In an **open transition** the motor is disconnected for the dead time. Its rotor keeps turning and its decaying field keeps generating a voltage, which by the time the delta contactor closes is out of step with the supply — partly because the delta winding voltage sits 30° away from the star one, partly because the rotor has slipped back. The difference drives a transient current that can briefly reach or even exceed the DOL starting current, with a torque kick. A **closed transition** keeps the motor connected through a fourth contactor and a set of resistors during the switch, so the transient is much smaller; it costs more and is used on large motors and weak supplies.

| | DOL | Star-delta (star stage) |
|---|---|---|
| Line current at start | 5–8 × $I_n$ | 1.7–2.7 × $I_n$ |
| Starting torque | 1.5–3 × $T_n$ | 0.5–1 × $T_n$ |
| Breakdown torque | 2–3 × $T_n$ | 0.7–1 × $T_n$ |

**In the simulation**, watch the windings change from a Y to a triangle at the switch-over, and the current trace: the star stage, the transition spike and the delta current. Load the motor until the star curve can no longer carry it, and shorten the timer until the spike looks like a DOL start.

> [!warn] Six motor leads and three contactors give more ways to wire it wrong. A wrong delta pairing, a missing interlock or a star and delta contactor closing together can destroy the starter. Wiring is for qualified electricians; follow the motor's terminal-box diagram and the starter maker's circuit.

> [!key] Star-delta cuts the starting current and torque to a third, cheaply and without electronics — but only suits loads that need little torque until they are nearly up to speed, and the motor must be rated for delta at the line voltage.
`,
  ideas: [
    'In star each winding sees 1/√3 of the line voltage, so the line current and the torque both fall to one third of their DOL values.',
    'The motor must be rated for delta at the line voltage (400 V Δ on a 400 V network) and needs six leads.',
    'Three contactors: main and delta sized for 0.58 of the motor current, star for 0.33; the overload in the winding lines is set to 0.58 × I_n.',
    'Switch to delta near full speed in star; too early and the delta current is nearly the DOL current.',
    'An open transition causes a current spike; a closed transition with resistors keeps it small.'
  ],
  pitfalls: [
    'Star-delta works with any three-phase motor — A 230/400 V motor runs in star on 400 V and cannot go into delta there; only motors rated Δ at the line voltage can be star-delta started.',
    'The overload relay is set to the motor\'s full nameplate current — In the usual arrangement it carries the winding current, which is 1/√3 = 0.58 of the line current.',
    'A longer star time is always gentler — If the load cannot be carried in star the motor stops accelerating and heats up; the switch to delta then comes at low speed with a near-DOL current.'
  ],
  formulas: [
    {
      name: 'Line current in star',
      expr: 'IY = ID/3', tex: 'I_Y = \\dfrac{I_{\\Delta}}{3}',
      vars: {
        IY: { name: 'line current with the windings in star', q: 'current', unit: 'A', tex: 'I_Y' },
        ID: { name: 'line current at the same speed in delta (DOL)', q: 'current', unit: 'A', value: 385, tex: 'I_{\\Delta}' }
      },
      stories: { IY: 'Direct on line in delta a motor would draw {ID}. What does it draw in star?' }
    },
    {
      name: 'Torque in star',
      expr: 'TY = TD/3', tex: 'T_Y = \\dfrac{T_{\\Delta}}{3}',
      vars: {
        TY: { name: 'torque with the windings in star', q: 'torque', unit: 'N·m', tex: 'T_Y' },
        TD: { name: 'torque at the same speed in delta', q: 'torque', unit: 'N·m', value: 429, tex: 'T_{\\Delta}' }
      },
      note: 'At every speed the star curve is the delta curve scaled by 1/3 — including the breakdown torque.',
      stories: { TY: 'A motor gives a starting torque of {TD} direct on line in delta. How much does it give in star?', TD: 'A load needs {TY} to break away. What DOL starting torque must the motor have for star-delta to work?' }
    },
    {
      name: 'Overload setting in a star-delta starter',
      expr: 'Is = In/sqrt(3)', tex: 'I_{set} = \\dfrac{I_n}{\\sqrt{3}}',
      vars: {
        Is: { name: 'overload relay setting (winding current)', q: 'current', unit: 'A', tex: 'I_{set}' },
        In: { name: 'motor rated (line) current', q: 'current', unit: 'A', value: 55, tex: 'I_n' }
      },
      note: 'For the usual position of the relay, in the winding lines after the main contactor. The main and delta contactors are sized for the same 0.58 × I_n, the star contactor for 0.33 × I_n.',
      stories: { Is: 'A motor rated {In} is started star-delta. What should the overload relay be set to?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a star-delta starter for 30 kW',
      q: 'A 30 kW, 400 V Δ / 690 V Y, 1470 rpm motor has a rated current of 55 A, a locked-rotor current of 7 × and a locked-rotor torque of 2.2 ×. Find the starting current and torque in star, the contactor ratings and the overload setting.',
      steps: [
        'DOL: $7 \\times 55 = 385$ A; star: $385/3 = 128$ A (2.3 × rated).',
        'Rated torque $30\\,000/(1470 \\times 2\\pi/60) = 195$ N·m; DOL starting torque $2.2 \\times 195 = 429$ N·m; star $429/3 = 143$ N·m (0.73 × rated).',
        'Main and delta contactors $\\ge 0.58 \\times 55 = 32$ A AC-3; star contactor $\\ge 0.33 \\times 55 = 18$ A.',
        'Overload relay in the winding lines set to $55/\\sqrt{3} = 31.8$ A.'
      ],
      a: '128 A and 143 N·m in star; 32 A, 32 A and 18 A contactors; overload at 31.8 A.'
    },
    {
      title: 'Will it start in star?',
      q: 'The same motor drives (a) a fan whose torque at full speed is 180 N·m and grows with the square of speed, (b) a loaded belt conveyor needing a steady 150 N·m. Its breakdown torque in delta is 2.8 × rated. Which one star-delta can start?',
      steps: [
        'Star torque at standstill: 143 N·m; star breakdown torque $2.8 \\times 195/3 = 182$ N·m.',
        '(a) The fan needs almost nothing at low speed and 180 N·m only at full speed: the star curve carries it to about 90 % of speed, where a switch to delta costs a modest spike.',
        '(b) The conveyor needs 150 N·m from standstill — more than the 143 N·m star starting torque. It will not break away in star; the timer would then switch it to delta at zero speed: a DOL start.'
      ],
      a: 'The fan starts well in star-delta; the loaded conveyor needs DOL, a soft starter with enough torque, or a VFD.'
    }
  ],
  quiz: [
    { q: 'Star-delta starting reduces the line current at start to…', choices: ['1/3 of the DOL current', '1/√3 of the DOL current', '1/2 of the DOL current', '1/9 of the DOL current'], a: 0, why: 'Each winding sees 1/√3 of the voltage (current ÷ √3), and in star the line current equals the winding current instead of √3 times it: 1/√3 × 1/√3 = 1/3.' },
    { q: 'A motor\'s nameplate reads 230 V Δ / 400 V Y. On a 400 V network, can it be star-delta started?', choices: ['No — on 400 V it must run in star, so it has no delta stage', 'Yes, like any motor', 'Yes, if the timer is set short', 'Only with a closed transition'], a: 0, why: 'Its windings are rated 230 V; in delta on 400 V they would be over-voltaged by √3. Star-delta needs a 400 V Δ (400/690 V) motor.' },
    { q: 'Where the overload relay sits in the winding lines after the main contactor, it is set to…', choices: ['0.58 × the motor\'s rated current', 'the motor\'s rated current', '1.73 × the rated current', '0.33 × the rated current'], a: 0, why: 'It carries the winding (phase) current, which in delta is the line current divided by √3.' },
    { q: 'Why does an open transition cause a current spike?', choices: ['The spinning motor\'s own voltage is out of step with the supply when delta closes', 'The star contactor welds', 'The timer adds resistance', 'The delta connection has lower impedance than the motor at standstill'], a: 0, why: 'During the dead time the rotor field decays and slips back in phase, and the delta voltage is 30° away from the star one; the difference drives a transient current.' },
    { q: 'The timer switches to delta while the motor is still at 40 % speed. The current at the switch is about…', choices: ['close to the DOL starting current', 'a third of the DOL current', 'the rated current', 'zero'], a: 0, why: 'At 40 % speed the motor is still far down its curve, where the delta current is nearly the locked-rotor current.' }
  ],
  problems: [
    { q: 'A motor gives 330 N·m of locked-rotor torque direct on line (in delta). What does it give at standstill in star?', answer: 110, unit: 'N·m', tol: 0.01, steps: ['$T_Y = T_\\Delta/3 = 330/3 = 110$ N·m.'] },
    { q: 'A 400 V Δ motor has a rated current of 72 A. To what current is the overload relay of its star-delta starter set?', answer: 41.6, unit: 'A', tol: 0.02, steps: ['$I_{set} = 72/\\sqrt{3} = 41.6$ A.'] }
  ],
  choose: {
    good: [
      'Fans, centrifugal pumps, and compressors or machine tools that start unloaded: little torque until near full speed.',
      'Medium motors (roughly 5–150 kW) where the supply cannot take a DOL start and electronics are unwelcome.',
      'Simple, robust installations: no harmonics, no heat sinks, easily repaired with standard contactors.'
    ],
    avoid: [
      'Loads that need more than about a third of the motor\'s starting torque: loaded conveyors, crushers, positive-displacement pumps against pressure.',
      'Motors not rated delta at the line voltage, or installations where six leads are impractical.',
      'Places where the transition spike and torque kick are unacceptable (long belts, weak generators) — use a closed transition, a soft starter or a VFD.'
    ],
    check: [
      'The nameplate: delta voltage equal to the line voltage (400 V Δ on 400 V).',
      'The load torque against one third of the motor\'s torque curve over the whole speed range.',
      'The timer against the measured run-up time in star; the dead time and interlocks.',
      'Contactor ratings (0.58, 0.58 and 0.33 × I_n) and the overload setting (0.58 × I_n).'
    ]
  },
  applications: [
    'Ventilation fans, cooling-tower fans and circulating pumps of 5–150 kW in buildings and plants.',
    'Screw compressors that start unloaded (the inlet valve closed) and switch to load after reaching speed.',
    'The control circuit with timer and interlocks is drawn in [the starter wiring diagrams](#/tools/wiring/starters).'
  ],
  sources: [
    'IEC 60947-4-1, *Contactors and motor-starters — Electromechanical contactors and motor-starters*: star-delta starters among the starter types it covers.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*: U1–U2, V1–V2, W1–W2.',
    'Hughes and Drury, *Electric Motors and Drives*: starting methods of induction motors.',
    'Chapman, *Electric Machinery Fundamentals*: induction motor starting.'
  ],
  sim: ['sd-star-delta', 'sd-starter-compare']
},

{
  id: 'autotransformer-starting', parent: 'starting-methods', title: 'Autotransformer and reactor starting', level: 2,
  short: 'Two old, robust ways to start a big motor at reduced voltage. An autotransformer feeds the motor from a tap (50, 65 or 80 %): the motor current falls by the tap ratio and the line current by its square. A series reactor drops the voltage in the line instead: simpler, but the line current falls only by the ratio. In both, torque falls with the square of the voltage.',
  keywords: ['autotransformer starter', 'Korndorfer', 'Korndörfer', 'closed transition', 'reactor starting', 'primary reactance', 'primary resistance starter', 'reduced voltage starting', 'taps 50 65 80', 'medium voltage motor starting'],
  prereq: ['dol-starting', 'star-delta-starting', 'physics:transformers'],
  related: ['soft-starters', 'wound-rotor-motor', 'torque-slip-curve', 'motors-pumps-fans', 'electronics:transformers-practical'],
  body: `
Every reduced-voltage starter trades torque for current. A cage motor's starting current is roughly proportional to the voltage across it and its torque to the voltage squared, so giving the motor a fraction $k$ of the mains voltage gives it $k$ times the current and $k^2$ — [[?exponent|k squared]] — times the torque. What differs between methods is **how much the supply sees** — and there the autotransformer is the most generous.

### The autotransformer starter
A three-phase autotransformer, usually star-connected with taps at **50, 65 and 80 %** of the line voltage, feeds the motor during the start. An ideal transformer passes power through unchanged, so if the motor takes $k\\,I_{LR}$ at the voltage $kV$, the line delivers only $k^2 I_{LR}$ at the full voltage $V$:

$$I_{motor} = k\\,I_{LR}, \\qquad I_{line} = k^2\\,I_{LR}, \\qquad T = k^2\\,T_{LR}$$

So the line current falls in exactly the same proportion as the torque — the best any passive starter can do, and with the tap you choose how much. On the 65 % tap a motor with a locked-rotor current of 6.5 × rated draws only 2.7 × rated from the line and still gives 42 % of its full starting torque.

The usual circuit, the **Korndörfer connection**, is a closed transition with three contactors. At the start the star-point contactor and the transformer contactor are closed and the motor runs up on the tap. Near full speed the star-point contactor opens: the upper part of each transformer winding is now simply a choke in series with the motor, which stays connected. Then the run contactor closes and bypasses it, and the transformer contactor opens. The motor never loses its supply, so there is no transition spike worth mentioning.

The autotransformer is **short-time rated**: it is designed for a stated number of starts of a stated length per hour, and repeated starts or a jammed load cook it — a classic failure. A thermal switch in the transformer, wired into the control circuit, guards against that. Autotransformer starters are larger, heavier and dearer than star-delta starters, but they need only a **three-lead motor**, let you pick the torque with the tap, and suit large motors, from about 50 kW up to medium-voltage machines.

### Reactor and resistor starting
A **series reactor** in each line (primary reactance starting) drops part of the voltage before the motor; after the run-up a bypass contactor shorts it. The motor current and the line current are the same thing here, so

$$I_{line} = k\\,I_{LR}, \\qquad T = k^2\\,T_{LR}$$

For the same starting torque the supply carries $1/k$ times more current than with an autotransformer — on a 65 % setting, about 1.5 times more. Its advantage is simplicity and a gentle rise: as the motor speeds up its current falls, the drop across the reactor falls with it and the motor voltage rises by itself. Reactor starting is common for large **medium-voltage** motors (pumps and fans of hundreds of kilowatts to megawatts at 3.3–11 kV). **Primary resistors** do the same with resistance: they make the starting power factor better, but burn energy and need cooling between starts. A **wound-rotor** motor puts the resistance in the rotor instead and so gets high torque at low current (see [[wound-rotor-motor]]).

| Method (motor with $I_{LR}$ = 6.5 × $I_n$, $T_{LR}$ = 2 × $T_n$) | Line current at start | Starting torque |
|---|---|---|
| DOL | 6.5 × $I_n$ | 2.0 × $T_n$ |
| Autotransformer 80 % | 4.2 × $I_n$ | 1.28 × $T_n$ |
| Autotransformer 65 % | 2.7 × $I_n$ | 0.85 × $T_n$ |
| Autotransformer 50 % | 1.6 × $I_n$ | 0.5 × $T_n$ |
| Reactor, 65 % at standstill | 4.2 × $I_n$ | 0.85 × $T_n$ |
| Star-delta | 2.2 × $I_n$ | 0.67 × $T_n$ |

**In the simulation** choose each method in turn and compare the current and torque curves against DOL: the autotransformer's line current is the lowest for its torque, the reactor's curve rises towards the DOL curve as the motor speeds up, and the table ranks all the methods for your load.

> [!warn] Autotransformer and reactor starters for large and medium-voltage motors carry high energy: work on them follows the site's switching and lockout procedures and is done by authorised people only. Respect the starts-per-hour rating of the autotransformer.

> [!key] Voltage × k gives current × k and torque × k². An autotransformer passes the current reduction on to the line a second time (line current × k²); a reactor or resistor does not (line current × k).
`,
  ideas: [
    'At a fraction k of the voltage a motor draws k times the current and gives k² times the torque.',
    'With an autotransformer the line current is only k² × the locked-rotor current: it falls as much as the torque.',
    'With a series reactor or resistor the line current is k × the locked-rotor current, so for the same torque the supply sees 1/k times more.',
    'The Korndörfer connection makes the autotransformer switch-over a closed transition, without a current spike.',
    'Autotransformers are short-time rated: respect their starts per hour.'
  ],
  pitfalls: [
    'The autotransformer halves the current on the 50 % tap — The motor current halves, but the line current falls to a quarter, and so does the torque.',
    'A reactor and an autotransformer set to the same voltage are equivalent — They give the same torque, but the reactor draws 1/k times more line current.',
    'An autotransformer starter can be used for as many starts as the motor allows — It is designed for a limited number of short starts per hour and overheats if used more often.'
  ],
  formulas: [
    {
      name: 'Line current with an autotransformer starter',
      expr: 'IL = k^2*ILR', tex: 'I_L = k^2\\,I_{LR}',
      vars: {
        IL: { name: 'line current at the start', q: 'current', unit: 'A', tex: 'I_L' },
        k: { name: 'tap (fraction of the line voltage)', q: 'ratio', unit: '%', value: 65, min: 1, max: 100 },
        ILR: { name: 'DOL locked-rotor current', q: 'current', unit: 'A', value: 1040, tex: 'I_{LR}' }
      },
      note: 'The motor itself carries k × I_LR; the transformer steps it down again for the line (plus a little magnetising current).',
      stories: { IL: 'A motor with a locked-rotor current of {ILR} is started on the {k} tap of an autotransformer. What does the line carry?', k: 'The line current at the start of a motor with {ILR} locked-rotor current must stay below {IL}. Which tap is needed?' }
    },
    {
      name: 'Starting torque at reduced voltage',
      expr: 'T = k^2*TLR', tex: 'T = k^2\\,T_{LR}',
      vars: {
        T: { name: 'starting torque', q: 'torque', unit: 'N·m' },
        k: { name: 'fraction of the rated voltage at the motor', q: 'ratio', unit: '%', value: 65, min: 1, max: 100 },
        TLR: { name: 'DOL locked-rotor torque', q: 'torque', unit: 'N·m', value: 1150, tex: 'T_{LR}' }
      },
      note: 'Holds for any reduced-voltage starter: autotransformer, reactor, resistor, star-delta (k = 1/√3) and, at standstill, a soft starter.',
      stories: { T: 'A motor with {TLR} locked-rotor torque is started at {k} voltage. What torque does it give?', k: 'A load needs {T} to break away; the motor gives {TLR} direct on line. What fraction of the voltage is the least that will start it?' }
    },
    {
      name: 'Line current with a series reactor',
      expr: 'IL = k*ILR', tex: 'I_L = k\\,I_{LR}',
      vars: {
        IL: { name: 'line (and motor) current at the start', q: 'current', unit: 'A', tex: 'I_L' },
        k: { name: 'fraction of the voltage left at the motor at standstill', q: 'ratio', unit: '%', value: 65, min: 1, max: 100 },
        ILR: { name: 'DOL locked-rotor current', q: 'current', unit: 'A', value: 1040, tex: 'I_{LR}' }
      },
      stories: { IL: 'A series reactor leaves {k} of the voltage at a motor whose locked-rotor current is {ILR}. What current does the supply carry at the start?' }
    }
  ],
  examples: [
    {
      title: 'Autotransformer or reactor for a 90 kW pump',
      q: 'A 90 kW, 400 V pump motor has a rated current of 160 A, a locked-rotor current of 6.5 × and a locked-rotor torque of 2.0 ×. Compare the line current and starting torque on the 65 % and 80 % autotransformer taps and with a reactor giving 65 % at standstill.',
      steps: [
        '$I_{LR} = 6.5 \\times 160 = 1040$ A.',
        '65 % tap: line current $0.65^2 \\times 1040 = 439$ A (2.7 × rated), torque $0.4225 \\times 2.0 = 0.85$ × rated.',
        '80 % tap: line current $0.64 \\times 1040 = 666$ A (4.2 ×), torque 1.28 × rated.',
        'Reactor at 65 %: line current $0.65 \\times 1040 = 676$ A (4.2 ×) for the same 0.85 × torque as the 65 % tap.'
      ],
      a: 'For 0.85 × rated torque the autotransformer draws 439 A from the line, the reactor 676 A.'
    },
    {
      title: 'Choosing the tap',
      q: 'The pump needs 0.5 × rated torque to break away, and you want a 20 % margin. With $T_{LR}$ = 2.0 × rated, which tap is the lowest that will do?',
      steps: [
        'Required torque $0.5 \\times 1.2 = 0.6$ × rated.',
        '$k = \\sqrt{0.6/2.0} = 0.548$, so the 50 % tap (0.5 × torque) is too low.',
        'The 65 % tap gives 0.85 × rated: enough, with a line current of 2.7 × rated.'
      ],
      a: 'The 65 % tap.'
    }
  ],
  quiz: [
    { q: 'On the 65 % tap of an autotransformer starter, the line current is about what fraction of the DOL starting current?', choices: ['42 %', '65 %', '81 %', '35 %'], a: 0, why: 'Line current = k² × I_LR = 0.65² = 0.42.' },
    { q: 'An autotransformer and a series reactor both give a motor 65 % of its voltage at standstill. Which statement is true?', choices: ['Same torque, but the reactor draws about 1.5 times more line current', 'The reactor gives more torque', 'The autotransformer draws more line current', 'They are identical in every way'], a: 0, why: 'Both give k² × torque; the autotransformer\'s line current is k² × I_LR, the reactor\'s k × I_LR — a factor 1/k = 1.54 more.' },
    { q: 'With a series reactor, the voltage at the motor terminals rises by itself as the motor speeds up.', a: true, why: 'The motor current falls as it speeds up, so the drop across the reactor falls and more of the supply voltage reaches the motor.' },
    { q: 'What does the Korndörfer connection achieve?', choices: ['A switch to full voltage without disconnecting the motor', 'A lower tap voltage', 'Reversing during the start', 'Braking at the end of the start'], a: 0, why: 'Opening the star point turns the transformer windings into series chokes while the run contactor closes: a closed transition.' },
    { q: 'Why does an autotransformer starter carry a thermal switch?', choices: ['It is short-time rated and overheats with too many or too long starts', 'To measure the motor temperature', 'To detect phase loss', 'To limit the tap voltage'], a: 0, why: 'The transformer is built for a limited duty of starts per hour; a jammed load or repeated starts would overheat it.' }
  ],
  problems: [
    { q: 'A motor has a DOL locked-rotor torque of 250 N·m. What torque does it give at standstill on the 80 % tap of an autotransformer?', answer: 160, unit: 'N·m', tol: 0.01, steps: ['$T = 0.8^2 \\times 250 = 0.64 \\times 250 = 160$ N·m.'] },
    { q: 'A motor draws 600 A direct on line. What is the line current at the start on the 50 % tap of an autotransformer starter?', answer: 150, unit: 'A', tol: 0.01, steps: ['$I_L = 0.5^2 \\times 600 = 150$ A (the motor itself carries 300 A).'] }
  ],
  choose: {
    good: [
      'Large motors (roughly 50 kW and up) that need more starting torque than star-delta gives, with only three motor leads.',
      'Medium-voltage motors on pumps, fans and compressors: reactor or autotransformer starters are simple and very robust.',
      'Sites where the torque and current must be matched to the load by choosing a tap.'
    ],
    avoid: [
      'Frequent starting: autotransformers are short-time rated and resistors need cooling time.',
      'Small motors, where a soft starter or star-delta is cheaper and smaller.',
      'Applications that need speed control or soft stopping — use a VFD or a soft starter.'
    ],
    check: [
      'The tap against the load\'s breakaway and acceleration torque, with a margin.',
      'The starts-per-hour and start-duration rating of the autotransformer or reactor.',
      'A closed transition (Korndörfer) if the transition spike matters.',
      'The line current against the supply\'s allowed dip.'
    ]
  },
  applications: [
    'Large water-supply and irrigation pumps of 100 kW to several megawatts, often at medium voltage.',
    'Compressors and refrigeration machines where star-delta torque is too low.',
    'Older ships and mines, where rugged, electronics-free starters are preferred.'
  ],
  sources: [
    'IEC 60947-4-1, *Contactors and motor-starters — Electromechanical contactors and motor-starters*: two-step autotransformer starters among the starter types it covers.',
    'Chapman, *Electric Machinery Fundamentals*: induction motor starting circuits.',
    'Hughes and Drury, *Electric Motors and Drives*: reduced-voltage starting and its effect on current and torque.'
  ],
  sim: 'sd-starter-compare'
},

{
  id: 'soft-starters', parent: 'starting-methods', title: 'Soft starters', level: 2,
  short: 'A soft starter ramps the motor voltage up with pairs of thyristors that switch on a little later in each half-cycle, then a bypass contactor takes over. It limits the starting current and the torque jolt, and can stop a pump slowly to avoid water hammer — but it cannot change the running speed, and the torque still falls with the square of the voltage.',
  keywords: ['soft starter', 'soft start', 'thyristor', 'SCR', 'phase angle control', 'firing angle', 'voltage ramp', 'current limit', 'kick start', 'soft stop', 'pump control', 'water hammer', 'bypass contactor', 'AC-53a', 'AC-53b', 'in-delta', 'two-phase control'],
  prereq: ['dol-starting', 'autotransformer-starting', 'torque-slip-curve'],
  related: ['vfd-principle', 'motor-protection', 'motors-pumps-fans', 'load-torque-types', 'hydraulics:water-hammer', 'electronics:heat-sinks', 'electronics:rms-values'],
  body: `
A soft starter is an electronic reduced-voltage starter. In each phase sits a pair of **thyristors** (SCRs) connected back to back, one for each half of the sine wave. A thyristor conducts from the moment its gate is fired until its current falls to zero. Fire it right at the voltage zero and the motor gets the whole sine wave; fire it later, at a delay angle $\\alpha$, and the motor gets only the tail of each half-cycle. Sweep $\\alpha$ from late to early over a few seconds and the motor voltage rises smoothly from perhaps 30–50 % to 100 %. Because a motor is inductive, the current lags and keeps flowing a little past each voltage zero, so the chopped waveform also depends on the motor's power factor — the controller measures and adapts.

Once the motor is up to speed and the thyristors are fully on, a **bypass contactor** closes across them. Nearly all soft starters today have one, often built in: a thyristor drops about 1–1.5 V, which in three phases makes roughly **3–4.5 W of heat per ampere** of motor current. A 100 A motor would keep 300–450 W in the cabinet all day; bypassed, the losses are a few watts of contact resistance, and the starter's heat sink only works during starts.

Small and medium soft starters often control only **two phases** and connect the third straight through (cheaper, with some unbalance during the start); larger ones control all three. An **in-delta** connection puts the starter inside the delta loop of a six-lead motor, where it carries only $1/\\sqrt{3}$ = 58 % of the line current — a smaller unit for the same motor.

### Starting modes
| Mode | What it does | Typical setting |
|---|---|---|
| Voltage ramp | initial voltage, then a linear ramp to full voltage | 30–60 % initial, 2–20 s ramp |
| Current limit | holds the current at a ceiling until the motor is up | 2–5 × $I_e$ (3–4 × for most loads) |
| Kick start | a short pulse of high voltage to break away sticky loads | a fraction of a second |
| Torque (pump) control | shapes the voltage so the torque rises smoothly | for pumps and conveyors |
| Soft stop | ramps the voltage down so the motor slows more gently | 2–30 s |

### The catch: torque still goes with voltage squared
At standstill the current is [[?proportional|proportional]] to the voltage and the torque to its square, so limiting the current to a fraction of the locked-rotor value costs that fraction squared in torque:

$$T = T_{LR}\\left(\\frac{I}{I_{LR}}\\right)^2$$

A motor with $I_{LR}$ = 7 × and $T_{LR}$ = 2.3 × rated, limited to 3.5 ×, gives $2.3 \\times 0.25 = 0.58$ × rated torque — fine for a pump or a fan, not for a fully loaded conveyor. A soft starter therefore reduces the jolt and the current, but never below what the load's torque demands; a VFD, by contrast, gives rated torque at about rated current (see [[vfd-principle]]).

### Soft stop and water hammer
When a pump is simply switched off, it stops in a fraction of a second, the water column in a long pipe decelerates, reverses, and slams the check valve shut: a pressure spike of several bar, the [[hydraulics:water-hammer|water hammer]] ($\\Delta p = \\rho\\,a\\,\\Delta v$, about 10 bar per m/s in a steel pipe). A soft stop brings the speed down over 10–30 s, so the flow tapers towards zero while the pump still nearly holds the head, and the valve closes on a much smaller reverse flow. Plain voltage ramps work poorly here — the pump keeps its speed until the voltage is low, then collapses — so soft starters offer a *pump control* stop that shapes the torque instead. A soft stop can only make stopping *slower* than coasting, never faster — it is no brake.

### Rating, sizing and heat
IEC 60947-4-2 rates soft starters with a code such as **AC-53a: 3.5-17: 90-5** — 3.5 × $I_e$ for 17 s at start, on for 90 % of each cycle, 5 starts per hour — or **AC-53b** with an off-time for bypassed units. Size for the motor current, the start current and time, the starts per hour and the ambient temperature; heavy starts (high-inertia fans, crushers) need a larger unit. A start at 3.5 × for 12 s of a 45 kW motor puts about 15 kJ into the heat sink. Soft starters make harmonics only while ramping; built-in electronic overload, phase-loss and phase-sequence protection are standard.

**In the simulation** watch the chopped voltage and the lagging current in one phase, the current limit holding the motor at 3–4 × rated, the bypass closing and the heat sink cooling — then stop the pump by coasting and by soft stop and compare the pressure spike at the check valve.

> [!warn] A soft starter does not isolate: with the thyristors off, the motor terminals are still connected to the mains through them. Isolate upstream and prove dead before touching the motor. Power-factor correction capacitors must never be connected between a soft starter and its motor.

> [!key] A soft starter ramps the voltage with thyristors and then bypasses them: gentle, compact and cheap for pumps, fans and compressors. It limits current and jolt, and soft-stops pumps against water hammer, but torque still goes with voltage squared and it cannot control speed.
`,
  ideas: [
    'Back-to-back thyristors fired later in each half-cycle lower the motor voltage; the firing angle is ramped to start the motor.',
    'Torque falls with the square of the current reduction: T = T_LR (I/I_LR)².',
    'A bypass contactor removes the 3–4.5 W per ampere of thyristor losses once the motor is at speed.',
    'Soft stop lets a pump\'s flow taper off so the check valve does not slam — it only lengthens the stop, it never brakes.',
    'Soft starters are rated for a start current, a start time and a number of starts per hour (AC-53a / AC-53b).'
  ],
  pitfalls: [
    'A soft starter can run a motor at reduced speed — Lowering the voltage of a loaded cage motor only increases its slip and heats it; speed control needs a VFD.',
    'A soft starter starts any load with little current — The torque falls with the square of the current; heavy loads need nearly the DOL current to start.',
    'Soft stop helps stop a high-inertia fan quickly — It can only make the stop slower than coasting; stopping faster needs braking (DC injection or a VFD with a resistor).'
  ],
  formulas: [
    {
      name: 'Starting torque at a current limit',
      expr: 'T = TLR*(I/ILR)^2', tex: 'T = T_{LR}\\left(\\dfrac{I}{I_{LR}}\\right)^2',
      vars: {
        T: { name: 'starting torque', q: 'torque', unit: 'N·m' },
        TLR: { name: 'DOL locked-rotor torque', q: 'torque', unit: 'N·m', value: 113, tex: 'T_{LR}' },
        I: { name: 'current limit', q: 'current', unit: 'A', value: 51.1 },
        ILR: { name: 'DOL locked-rotor current', q: 'current', unit: 'A', value: 105, tex: 'I_{LR}' }
      },
      note: 'At standstill; as the motor speeds up at the same current limit its torque rises towards its curve.',
      stories: { T: 'A motor gives {TLR} and draws {ILR} direct on line. A soft starter limits the current to {I}. What starting torque is left?', I: 'A motor gives {TLR} at {ILR} direct on line; the load needs {T} to break away. What current limit is the least that works?' }
    },
    {
      name: 'Motor voltage for a current limit',
      expr: 'V = Vn*I/ILR', tex: 'V = V_n\\,\\dfrac{I}{I_{LR}}',
      vars: {
        V: { name: 'motor voltage at standstill', q: 'voltage', unit: 'V' },
        Vn: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_n' },
        I: { name: 'current limit', q: 'current', unit: 'A', value: 51.1 },
        ILR: { name: 'DOL locked-rotor current', q: 'current', unit: 'A', value: 105, tex: 'I_{LR}' }
      },
      stories: { V: 'A {Vn} motor draws {ILR} direct on line. What voltage does the soft starter give it at standstill to hold the current at {I}?' }
    },
    {
      name: 'Heat in the thyristors',
      expr: 'P = 3*(0.9*VT*I + rT*I^2)', tex: 'P = 3\\left(0.9\\,V_{T0}\\,I + r_T\\,I^2\\right)',
      vars: {
        P: { name: 'thyristor losses, three phases', q: 'power', unit: 'W' },
        VT: { name: 'thyristor threshold voltage', q: 'voltage', unit: 'V', value: 1.0, tex: 'V_{T0}' },
        I: { name: 'motor current (rms)', q: 'current', unit: 'A', value: 82 },
        rT: { name: 'thyristor slope resistance', q: 'resistance', unit: 'mΩ', value: 2, tex: 'r_T' }
      },
      note: 'Each thyristor pair carries an average of 0.9 I (two half-waves of 0.45 I) through its threshold voltage, and I² through its slope resistance. Take them from the thyristor datasheet.',
      stories: { P: 'A soft starter without bypass carries {I} with thyristors of V_T0 = {VT} and r_T = {rT}. How much heat does it make?' }
    }
  ],
  examples: [
    {
      title: 'Enough torque on a current limit?',
      q: 'The 7.5 kW motor of the DOL page (rated 14.6 A and 49.2 N·m; locked-rotor 105 A and 113 N·m) gets a soft starter set to a 3.5 × current limit. Can it start a centrifugal pump needing 0.15 × rated torque at standstill? A conveyor needing 0.8 × rated?',
      steps: [
        'Current limit $3.5 \\times 14.6 = 51.1$ A, so $I/I_{LR} = 0.487$.',
        '$T = 113 \\times 0.487^2 = 26.8$ N·m = 0.54 × rated.',
        'The pump needs 7.4 N·m: plenty of margin. The conveyor needs 39 N·m: more than 26.8, it will not break away.',
        'For the conveyor the limit would have to be $105\\sqrt{39/113} = 61.7$ A (4.2 ×), and even then the run-up is slow — a VFD suits it better.'
      ],
      a: '0.54 × rated torque: enough for the pump, not for the loaded conveyor.'
    },
    {
      title: 'Heat with and without a bypass',
      q: 'A 45 kW motor draws 82 A. Its soft starter\'s thyristors have $V_{T0}$ = 1.0 V and $r_T$ = 2 mΩ. Find the running losses without a bypass, and the energy of a 12 s start at 3.5 × rated current.',
      steps: [
        'Running: $P = 3(0.9 \\times 1.0 \\times 82 + 0.002 \\times 82^2) = 3(73.8 + 13.4) = 262$ W, all day.',
        'Start at $3.5 \\times 82 = 287$ A: $P = 3(0.9 \\times 287 + 0.002 \\times 287^2) = 3(258 + 165) = 1269$ W.',
        'For 12 s: $E = 1269 \\times 12 = 15.2$ kJ per start, which the heat sink must absorb and shed before the next start.'
      ],
      a: 'About 260 W continuously without a bypass (about 3.2 W/A); about 15 kJ per start.'
    },
    {
      title: 'In-delta connection',
      q: 'A 110 kW, 400 V Δ motor draws 195 A. What current does a soft starter carry in line and in the in-delta connection?',
      steps: ['In line it carries the line current, 195 A.', 'In-delta it sits in each winding branch and carries $195/\\sqrt{3} = 113$ A.'],
      a: '195 A in line, 113 A in-delta: a smaller unit will do, at the price of six motor leads.'
    }
  ],
  quiz: [
    { q: 'A soft starter halves the starting current compared with DOL. The starting torque becomes…', choices: ['a quarter of the DOL torque', 'half of the DOL torque', 'the same as DOL', 'twice the DOL torque'], a: 0, why: 'Current ∝ voltage and torque ∝ voltage², so torque ∝ current²: (1/2)² = 1/4.' },
    { q: 'Soft stop lets a high-inertia fan stop faster than coasting.', a: false, why: 'A soft stop reduces the motor voltage gradually, which keeps some driving torque: it lengthens the stop. Stopping faster needs a brake.' },
    { q: 'Why do soft starters have a bypass contactor?', choices: ['To remove the thyristors\' conduction losses once the motor is at speed', 'To reverse the motor', 'To make the start faster', 'To filter harmonics'], a: 0, why: 'Thyristors drop about 1–1.5 V: roughly 3–4.5 W per ampere in three phases. Bypassed, only contact resistance remains.' },
    { q: 'Where may power-factor correction capacitors for a soft-started motor be connected?', choices: ['On the supply side, switched in only after the start', 'Between the soft starter and the motor', 'Across the thyristors', 'Anywhere'], a: 0, why: 'Capacitors on the output would be hit by chopped voltage and could damage the thyristors; they go upstream, switched after the start.' },
    { q: 'Why is soft stopping used on pumps with long delivery pipes?', choices: ['To let the flow fall gently so the check valve does not slam (water hammer)', 'To save energy while stopping', 'To stop the pump faster', 'To reduce the starting current'], a: 0, why: 'A sudden stop reverses the flow and slams the valve; a slow stop lets the flow reach zero while the pump still holds the head.' }
  ],
  problems: [
    { q: 'A motor gives 240 N·m and draws 700 A direct on line. A soft starter limits the current to 400 A. What torque does the motor give at standstill?', answer: 78.4, unit: 'N·m', tol: 0.02, steps: ['$I/I_{LR} = 400/700 = 0.571$.', '$T = 240 \\times 0.571^2 = 78.4$ N·m.'] },
    { q: 'A soft starter without bypass carries 30 A through thyristors with $V_{T0}$ = 1.1 V and $r_T$ = 4 mΩ. How much heat does it make?', answer: 99.9, unit: 'W', tol: 0.02, steps: ['$P = 3(0.9 \\times 1.1 \\times 30 + 0.004 \\times 30^2)$', '$= 3(29.7 + 3.6) = 99.9$ W.'] }
  ],
  choose: {
    good: [
      'Centrifugal pumps, fans, compressors and conveyors with moderate starting torque: gentle starts at 3–4 × rated current.',
      'Pumps on long pipelines: soft stop against water hammer.',
      'Replacing DOL or star-delta starters where the jolt breaks belts or the dip upsets the supply; compact and cheaper than a VFD of the same power.'
    ],
    avoid: [
      'Loads that need high torque from standstill at low current (loaded conveyors, crushers, positive-displacement pumps) — a VFD does it at about rated current.',
      'Anything that needs speed control, fast stopping or frequent starts of high-inertia loads.',
      'Motors fed through long cables to a weak supply where even 3–4 × rated current dips too much.'
    ],
    check: [
      'The load torque against T_LR (I_limit/I_LR)² over the whole run-up.',
      'The soft starter\'s rating code: start current, start time, starts per hour, ambient temperature.',
      'A bypass (internal or external) and the enclosure\'s heat dissipation.',
      'Built-in protection (overload class, phase loss) and whether soft stop or pump control is needed.'
    ]
  },
  applications: [
    'Water and waste-water pumping stations: soft start and soft stop keep pipes and valves from being hammered.',
    'Belt conveyors, escalators and fans: a smooth start without belt slip or product spills.',
    'Try ramps and current limits on [the soft-start tool](#/tools/drives/softstart).'
  ],
  history: 'Thyristors (silicon-controlled rectifiers) became commercial in the late 1950s, and phase-angle control of AC loads followed quickly in dimmers and heaters. Soft starters for motors spread in the 1980s and 1990s, and the built-in bypass contactor made them compact enough to replace star-delta starters in ordinary control panels.',
  sources: [
    'IEC 60947-4-2, *Low-voltage switchgear and controlgear — Contactors and motor-starters — AC semiconductor motor controllers and starters*: utilisation categories AC-53a and AC-53b and their rating codes.',
    'Mohan, Undeland and Robbins, *Power Electronics: Converters, Applications and Design*: thyristors and AC voltage controllers.',
    'Hughes and Drury, *Electric Motors and Drives*: soft starting of induction motors.'
  ],
  sim: ['sd-soft-starter', 'sd-starter-compare']
},

{
  id: 'motor-protection', parent: 'starting-methods', title: 'Motor protection: overloads, breakers, thermistors', level: 2,
  short: 'A motor dies of heat. Overload relays copy its heating from the current and trip before the winding cooks — within a time set by the trip class (10, 20 or 30); motor-protective breakers add an instant magnetic trip for short circuits; PTC thermistors in the windings measure the temperature itself and catch what the current cannot show: blocked cooling, hot rooms, slow running on a VFD.',
  keywords: ['overload relay', 'thermal overload', 'bimetal', 'trip class', 'class 10', 'class 20', 'class 30', 'electronic overload', 'motor protective circuit breaker', 'MPCB', 'manual motor starter', 'PTC thermistor', 'thermistor relay', 'phase loss', 'single phasing', 'voltage unbalance', 'type 2 coordination', 'aM fuse', 'insulation resistance'],
  prereq: ['dol-starting', 'motor-heating', 'insulation-classes'],
  related: ['star-delta-starting', 'soft-starters', 'vfd-parameters', 'motor-failures', 'duty-cycles', 'electronics:fuses-protection', 'electronics:thermistors-rtd'],
  body: `
Nearly every motor that fails electrically dies of heat: the winding insulation ages, cracks and shorts. Insulation life roughly halves for every 10 K above its rating (see [[insulation-classes]]), and a locked rotor can take a winding from its running temperature past its class limit in ten or twenty seconds. Protection has to act fast enough for a stall, slowly enough to allow a normal start, and not at all for the load the motor is built to carry.

| Threat | Current shows it? | What catches it |
|---|---|---|
| Mechanical overload, stall, jam | yes | overload relay (thermal or electronic) |
| Long or too-frequent starts | partly | overload relay with thermal memory; thermistors |
| Loss of a phase, voltage unbalance | yes, in two lines | phase-loss-sensitive or electronic relay |
| Short circuit | yes, huge | fuses or the magnetic trip of a breaker |
| Earth fault | as leakage | residual-current or earth-fault relay |
| Blocked cooling, hot room, slow running on a VFD | **no** | PTC thermistors or sensors in the winding |

### Overload relays and trip classes
A **thermal overload relay** carries the motor current through a small heater in each phase, which bends a bimetal strip; enough bending trips a contact (95–96 opens, 97–98 closes). Its heating and cooling rise and fall [[?exponential|exponentially]], imitating the motor's, so it trips sooner after the motor has been running than from cold. It is set to the motor's **nameplate current** (0.58 × of it in a star-delta starter), compensated for the ambient temperature, and has a test button and manual or automatic reset. Its speed is described by the **trip class**: the longest time it may take to trip at 7.2 × its setting from cold (IEC 60947-4-1).

| Trip class | Trip time at 7.2 × setting, from cold | Use |
|---|---|---|
| 10A | 2–10 s | fast; small motors, submersible pumps |
| 10 | 4–10 s | normal starts (most motors) |
| 20 | 6–20 s | heavy starts: fans, centrifuges, loaded conveyors |
| 30 | 9–30 s | very heavy starts with high inertia |

At 1.05 × the setting it must not trip within two hours; at 1.2 × it must trip within two hours. So the setting is a line, and the class is how steeply time falls with current. The motor's start must fit under the curve with a margin, and the curve under the motor's own thermal limit (its allowed locked-rotor time, from the maker, hot and cold).

An **electronic overload relay** measures the currents with current transformers and computes a thermal image: it has a wide setting range (often 1:4 against about 1:1.5 for bimetal), selectable class, low losses, and trips for phase loss or heavy unbalance within seconds; many add earth-fault detection and a fieldbus.

### Motor-protective circuit breakers
A **motor-protective circuit breaker** (MPCB, also sold as a manual motor starter/protector) combines an adjustable thermal trip (normally class 10) with a fixed **magnetic trip** at roughly 12–14 times the top of its setting range, clearing short circuits in milliseconds; small ones break tens of kilo-amperes. It is 45–55 mm wide up to about 32–40 A, has a rotary handle that can be padlocked off, and with a contactor makes a compact starter. The alternative is fuses — **aM** motor fuses tolerate starting currents and leave overload to the relay — with an overload relay. **Coordination** says what happens to the starter after a short circuit: **type 1**, it may be damaged but causes no danger; **type 2**, it is fit to use again, apart from lightly welded contacts that can be separated.

### Thermistors: measuring the winding itself
**PTC thermistors** are small sensors embedded in the winding overhang, one per phase, wired in series to a thermistor relay (or a VFD's PTC input). Their resistance is low — a few tens to a couple of hundred ohms each — until the **nominal response temperature** (chosen a little below the insulation limit, often 130–155 °C for class F), then shoots up by a factor of ten or more within about 10 K. The relay trips at roughly 3 kΩ for the chain and resets somewhere near 1.5–1.8 kΩ once the winding has cooled; good relays also detect a shorted or broken sensor lead. Thermistors catch everything that heats without extra current — a clogged fan cowl, a hot room, a self-cooled motor running slowly on a VFD, too many starts — but a large motor's rotor can overheat during a stall faster than the stator sensor warms up. Current protection and thermistors complement each other. For measurement rather than a switch, drives use linear sensors (KTY or Pt100/Pt1000).

### Phase loss and unbalance
Lose a phase (a blown fuse, a burnt contact) and a running motor keeps turning on the other two, humming, with the current in the remaining lines up by $\\sqrt{3}$ or more and extra rotor heating; a stopped motor will not start at all and draws locked-rotor current. A voltage unbalance of only a few per cent drives a current unbalance of several times that. NEMA MG 1 gives a rule of thumb: the temperature rise grows by about $2u^2$ per cent for an unbalance of $u$ per cent — 3.5 % unbalance, 25 % more heating — and derates motors above 1 %.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Trips during the start | class too fast for the run-up; setting too low; star-delta relay set to the line current | class 20/30; set to nameplate (0.58 × in star-delta) |
| Trips after running a while | real overload, low or unbalanced voltage, phase loss, hot room | measure the three currents and voltages; fix the cause |
| Trips instantly at start | short circuit or earth fault; magnetic trip too low | test insulation; check the breaker's range |
| Thermistor trips, current normal | blocked cooling, high ambient, slow running on a VFD | clean, ventilate, add a separate fan |

**In the simulation** start the motor and see its start on the trip curves, then overload it, jam it, lose a phase or block its fan: watch the relay's thermal image race the winding temperature, and see which device trips first.

> [!warn] Never reset a tripped relay again and again to "get the job done": each attempt heats the winding further. Find the cause first. Insulation tests (at 500 V DC or more) and work in the terminal box are for qualified people with the motor isolated and locked off.

> [!key] Set the overload to the nameplate current, pick the trip class so the start fits under its curve, clear short circuits with fuses or a magnetic trip, and add thermistors wherever the motor can overheat without drawing more current.
`,
  ideas: [
    'An overload relay is a thermal image of the motor: it trips sooner when current is higher and when the motor was already warm.',
    'Trip class = the longest trip time in seconds at 7.2 × the setting from cold: 10, 20 or 30.',
    'A motor-protective breaker adds a magnetic trip at about 12–14 × its range for short circuits.',
    'PTC thermistors measure the winding temperature and catch blocked cooling, hot rooms and slow running on a VFD.',
    'Phase loss raises the current in two lines by √3 or more; a few per cent voltage unbalance heats the motor by tens of per cent.'
  ],
  pitfalls: [
    'Fuses protect the motor — Fuses protect the cable against short circuits; a motor can burn out at 1.5 × its current without blowing a fuse. Overload protection is a separate job.',
    'A motor with thermistors needs no overload relay — A stall heats a large rotor faster than the stator sensor can follow; current protection and thermistors complement each other.',
    'If the relay trips during the start, set it higher — Set it to the nameplate current and choose a slower class instead; a higher setting leaves the motor unprotected when running.'
  ],
  formulas: [
    {
      name: 'Trip time of a thermal image, from cold',
      expr: 't = tau*ln(x^2/(x^2 - k^2))', tex: 't = \\tau\\,\\ln\\dfrac{x^2}{x^2 - k^2}',
      vars: {
        t: { name: 'time to trip', q: 'time', unit: 's' },
        tau: { name: 'thermal time constant of the relay model', q: 'time', unit: 's', value: 310, tex: '\\tau' },
        x: { name: 'current as a multiple of the setting', value: 7.2, min: 1.16, max: 20 },
        k: { name: 'trip threshold (multiple of the setting)', value: 1.15, min: 1.05, max: 1.2 }
      },
      note: 'A first-order model of a relay (heating ∝ current²), not a standard curve. With τ = 310 s it trips at 8 s at 7.2 × (class 10); τ ≈ 620 s and 930 s give class 20 and 30. From a warm start (after running at the setting) use ln((x² − 1)/(x² − k²)).',
      stories: { t: 'A relay modelled with τ = {tau} and threshold {k} sees {x} times its setting from cold. How long until it trips?', tau: 'A relay with threshold {k} must trip in {t} at {x} times its setting. What time constant does it need?' }
    },
    {
      name: 'Voltage unbalance',
      expr: 'u = dV/Va', tex: 'u = \\dfrac{\\Delta V_{max}}{V_{avg}}',
      vars: {
        u: { name: 'voltage unbalance', q: 'ratio', unit: '%' },
        dV: { name: 'largest deviation of a line voltage from the average', q: 'voltage', unit: 'V', value: 7.7, tex: '\\Delta V_{max}' },
        Va: { name: 'average of the three line voltages', q: 'voltage', unit: 'V', value: 402.3, tex: 'V_{avg}' }
      },
      stories: { u: 'The three line voltages average {Va} and one of them is {dV} away from the average. What is the unbalance?' }
    },
    {
      name: 'Extra heating from unbalance (rule of thumb)',
      expr: 'h = 2*u^2', tex: '\\Delta\\theta = 2\\,u^2',
      vars: {
        h: { name: 'increase of the winding temperature rise', q: false, unit: '%', tex: '\\Delta\\theta' },
        u: { name: 'voltage unbalance', q: false, unit: '%', value: 1.91 }
      },
      note: 'From NEMA MG 1\'s guidance on unbalanced voltages; both numbers in per cent. Motors are derated above 1 % unbalance, and operation above 5 % is not recommended.',
      stories: { h: 'A motor runs on a supply with {u} voltage unbalance. By how much does its temperature rise increase?' }
    }
  ],
  examples: [
    {
      title: 'Protecting a 7.5 kW motor',
      q: 'The 7.5 kW motor of the DOL page draws 14.6 A (105 A at start, a 1 s run-up on its pump). Choose the setting of a motor-protective breaker with a 10–16 A range and check that its magnetic trip, at about 13 × the top of its range, leaves the start alone.',
      steps: [
        'Set the thermal trip to the nameplate current, 14.6 A; class 10 is enough for a 1 s start at about 7 ×.',
        'Magnetic trip $\\approx 13 \\times 16 = 208$ A — about twice the 105 A starting current, so the start (including its first-cycle peak, which is higher than the rms value) does not trip it in normal cases.',
        'A short circuit in the cable, hundreds to thousands of amperes, trips it in milliseconds.'
      ],
      a: 'Set 14.6 A, class 10; the ~208 A magnetic trip sits well above the start.'
    },
    {
      title: 'Hot or cold?',
      q: 'Model a class 10 relay with τ = 310 s and a threshold of 1.15 × its setting. How long does it take to trip at 1.5 × its setting from cold, and after running for hours at its setting?',
      steps: [
        'Cold: $t = 310\\,\\ln\\dfrac{2.25}{2.25 - 1.3225} = 310 \\times 0.886 = 275$ s, about 4.6 min.',
        'Warm: $t = 310\\,\\ln\\dfrac{2.25 - 1}{2.25 - 1.3225} = 310 \\times 0.298 = 92$ s.',
        'The standard asks a class 10 relay to trip within 2 min at 1.5 × from warm: the model does.'
      ],
      a: 'About 4.6 min from cold, 1.5 min from warm — the relay remembers the motor\'s heat.'
    },
    {
      title: 'An unbalanced supply',
      q: 'The line voltages at a motor are 402, 395 and 410 V. What is the unbalance, and how much hotter will the winding run if its rated rise is 80 K?',
      steps: [
        'Average $(402 + 395 + 410)/3 = 402.3$ V; largest deviation $410 - 402.3 = 7.7$ V; $u = 7.7/402.3 = 1.91$ %.',
        'Extra heating $\\approx 2 \\times 1.91^2 = 7.3$ % of the rise: $80 \\times 1.073 = 85.8$ K.'
      ],
      a: '1.9 % unbalance, about 6 K more — at 3.5 % it would be 20 K more.'
    }
  ],
  quiz: [
    { q: 'What does "class 20" on an overload relay mean?', choices: ['It trips within 20 s at 7.2 × its setting from cold (and not before 6 s)', 'It trips at 20 % overload', 'It trips after 20 minutes at rated current', 'It suits motors up to 20 kW'], a: 0, why: 'The trip class is the upper limit of the trip time in seconds at 7.2 × the setting from the cold state.' },
    { q: 'A motor\'s cooling fan cowl is clogged with fluff. Its current is normal but the winding is getting hot. What trips it?', choices: ['The PTC thermistors in the winding', 'The overload relay', 'The magnetic trip', 'The fuses'], a: 0, why: 'Only a sensor in the winding sees heating that comes without extra current.' },
    { q: 'A fuse blows in one phase of a running, loaded motor. What happens?', choices: ['It keeps running on two phases, humming, with the current in two lines up by about √3 or more', 'It stops at once', 'It runs normally', 'It reverses'], a: 0, why: 'A running motor keeps turning on single-phase supply but must draw more current in the remaining lines; it overheats unless a relay trips.' },
    { q: 'After a short circuit, a starter with type 2 coordination…', choices: ['is fit for further use, apart from lightly welded contacts that can be separated', 'may be destroyed but causes no danger', 'must always be replaced', 'has no fuses'], a: 0, why: 'Type 2: no damage apart from easily separated contact welding. Type 1 allows damage requiring repair, as long as it is not dangerous.' },
    { q: 'An overload relay set above the nameplate current is a good fix for trips during long starts.', a: false, why: 'Choose a slower trip class; raising the setting leaves the running motor unprotected.' }
  ],
  problems: [
    { q: 'The line voltages at a motor are 398, 405 and 390 V. What is the voltage unbalance?', answer: 1.93, unit: '%', tol: 0.02, steps: ['Average $(398 + 405 + 390)/3 = 397.7$ V.', 'Largest deviation $397.7 - 390 = 7.7$ V.', '$u = 7.7/397.7 = 1.93$ %.'] },
    { q: 'Model a class 20 relay with τ = 620 s and a threshold of 1.15. How long does it take to trip at 3 × its setting from cold?', answer: 98.5, unit: 's', tol: 0.02, steps: ['$t = 620\\,\\ln\\dfrac{9}{9 - 1.3225} = 620\\,\\ln 1.1723$', '$= 620 \\times 0.1589 = 98.5$ s.'] }
  ],
  choose: {
    good: [
      'Thermal (bimetal) overload relay with a contactor: simple, cheap, no auxiliary supply — for most DOL and star-delta starters.',
      'Electronic overload relay: wide setting range, selectable class, fast phase-loss trip, low losses, diagnostics over a fieldbus.',
      'Motor-protective breaker: short-circuit and overload protection in one compact, lockable device for motors up to a few tens of kilowatts.',
      'PTC thermistors: wherever cooling can fail, the room is hot, the motor runs slowly on a VFD or starts often.'
    ],
    avoid: [
      'Fuses alone: they do not protect against overload.',
      'Thermistors alone on large motors with heavy starts: the rotor can overheat before the stator sensor responds.',
      'Class 10 on high-inertia starts: nuisance trips — or, worse, a raised setting.'
    ],
    check: [
      'The setting equals the nameplate current (0.58 × in the winding lines of a star-delta starter).',
      'The run-up time and current against the trip curve, and the curve against the motor\'s allowed locked-rotor time (hot and cold).',
      'Short-circuit rating and coordination type (1 or 2) with the chosen fuses or breaker.',
      'Phase-loss sensitivity, reset mode (manual for machines where an automatic restart is dangerous), and the thermistor relay\'s compatibility with the sensors.'
    ]
  },
  applications: [
    'Every motor starter in a control panel: an overload relay or motor-protective breaker per motor.',
    'Submersible pumps, cooled by the water flowing past them: fast class 10A relays and underload detection for dry running.',
    'Motors on VFDs: the drive\'s electronic motor model plus PTC thermistors wired to its thermistor input.'
  ],
  sources: [
    'IEC 60947-4-1, *Contactors and motor-starters — Electromechanical contactors and motor-starters*: overload relays, trip classes and their limits, type 1 and type 2 coordination.',
    'IEC 60947-2, *Low-voltage switchgear and controlgear — Circuit-breakers*.',
    'IEC 60947-8, *Control units for built-in thermal protection (PTC) for rotating electrical machines*.',
    'IEC 60034-11, *Rotating electrical machines — Thermal protection*.',
    'NEMA MG 1, *Motors and Generators*: operation on unbalanced voltages and the derating it calls for.',
    'IEC 60204-1, *Electrical equipment of machines*: protection of motors against overheating, insulation resistance tests.'
  ],
  sim: 'sd-overload'
},

/* ================================================================ VARIABLE-FREQUENCY DRIVES */
{
  id: 'vfd-principle', parent: 'vfd-topic', title: 'How a variable-frequency drive works', level: 2,
  short: 'A VFD rectifies the mains into DC, stores it on a bank of capacitors, and chops it back into three-phase AC of any frequency and voltage with six fast transistors (IGBTs) switching thousands of times a second. The motor\'s inductance smooths the pulses into nearly sinusoidal currents. The result: an induction motor that starts gently at rated current and runs at any speed.',
  keywords: ['VFD', 'variable frequency drive', 'inverter', 'frequency converter', 'AC drive', 'rectifier', 'DC bus', 'DC link', 'IGBT', 'PWM', 'switching frequency', 'carrier frequency', 'space vector modulation', 'precharge', 'heavy duty', 'normal duty', 'drive losses'],
  prereq: ['rotating-field', 'slip-and-speed', 'electronics:pwm', 'electronics:full-wave-rectifier'],
  related: ['v-over-f-control', 'vector-control-vfd', 'vfd-parameters', 'vfd-braking', 'vfd-wiring-emc', 'vfd-energy-saving', 'soft-starters', 'positioning-vs-speed', 'electronics:smoothing-ripple', 'electronics:gate-drive'],
  body: `
An induction motor turns at a speed fixed by the supply frequency, $n_s = 120 f/p$ ([[slip-and-speed]]). To change its speed you must change the frequency — and, to keep the magnetic flux right, the voltage with it. A variable-frequency drive (VFD, inverter, frequency converter, AC drive) does exactly that in three stages.

### 1. The rectifier
Six diodes in a bridge turn the three-phase mains into DC ([[electronics:full-wave-rectifier|a full-wave bridge]]). The DC bus settles near the peak of the line voltage: on average

$$V_{dc} \\approx \\frac{3\\sqrt{2}}{\\pi}\\,V_{LL} = 1.35\\,V_{LL}$$

— about 540 V from 400 V, 650 V from 480 V; small drives on 230 V single-phase get about 300–325 V. The diodes only conduct near the peaks of the line voltage, so the input current comes in pulses, rich in 5th, 7th, 11th and 13th [[?fourier|harmonics]] (see [[vfd-wiring-emc]]). A **precharge** resistor limits the inrush when the capacitors first charge, then a relay or thyristor bypasses it.

### 2. The DC link
Electrolytic (or, in "slim" drives, film) capacitors hold the bus steady and supply the pulsed currents of the inverter; often a DC choke sits in series to smooth the input current. The bus is also where braking energy arrives when the motor generates ([[vfd-braking]]).

### 3. The inverter
Three half-bridges of **IGBTs** — six transistors, each with a freewheeling diode — connect each motor terminal either to the + or the − bus, switching at the **carrier (switching) frequency**, typically 2–16 kHz (4 kHz is a common default). By varying the width of the pulses along a sine pattern (sine–triangle comparison or space-vector modulation), the *average* voltage of each output follows a sine of any frequency and amplitude — [[electronics:pwm|pulse-width modulation]]. The motor's leakage inductance filters the pulses, so the current is nearly sinusoidal with a small ripple at the carrier frequency. The highest output voltage with ordinary modulation is about $V_{dc}/\\sqrt{2}$ line to line, 382 V from a 540 V bus: a drive on 400 V gives its motor slightly less than the mains voltage at full load.

| Item | Small drive | Medium drive | Large drive |
|---|---|---|---|
| Power at 400 V | 0.75 kW | 7.5 kW | 75 kW |
| Output current (heavy duty) | ≈ 2.2 A | ≈ 16 A | ≈ 145 A |
| Typical size (W × H) | 70–90 × 150–200 mm | 130–200 × 250–350 mm | 250–350 × 600–900 mm |
| Heat at full load (≈ 2–3 %) | 25–40 W | 150–250 W | 1.5–2.5 kW |

Sizes vary by make and enclosure; wall-mounted IP55 drives are larger. A drive is **chosen by output current**, not kilowatts: its continuous current must cover the motor's nameplate current, in the right duty — **heavy duty** (typically 150 % overload for 60 s) for conveyors, hoists and mixers, **normal duty** (about 110 % for 60 s, a larger motor on the same drive) for fans and pumps. It derates with altitude above about 1000 m, with ambient temperature above about 40 °C and at higher switching frequencies.

### What the motor and the mains see
The motor receives pulses with steep edges (a few kV/µs) whose average is a sine: slightly more losses (a few per cent), magnetic noise at the carrier frequency, extra stress on the insulation and possible bearing currents ([[vfd-wiring-emc]]). The mains sees a load with a displacement power factor near 1 — the motor's magnetising current circulates between the motor and the DC-link capacitors — and draws only the **real** power. At low speed and full torque the input current can be a fraction of the motor current.

| Terminal | Purpose |
|---|---|
| L1, L2, L3 (or L, N) / PE | supply and protective earth |
| U, V, W | motor (shielded cable) |
| DC+, DC−, BR | DC bus and brake resistor (if fitted) |
| DI, AI, AO, RO | digital inputs (run, direction, presets), analogue 0–10 V / 4–20 mA speed reference, outputs, relay contacts |
| STO | safe torque off inputs (IEC 61800-5-2) |

**In the simulation** follow the energy: the input current pulses, the DC bus, the IGBTs switching (drawn in slow motion), the PWM line voltage and the smooth motor current; change the output frequency and the carrier and watch the pulse pattern and the current ripple change.

> [!warn] The DC-link capacitors of a VFD stay charged at 300–800 V for minutes after the supply is switched off — drives carry a label giving the waiting time, often 5–15 minutes. Wait, then measure DC+ to DC− before touching anything. The motor terminals carry lethal PWM voltage whenever the drive is powered, even with the motor stopped.

> [!key] Rectifier, DC link, inverter: a VFD rebuilds the mains at any frequency from a DC bus of about 1.35 × the line voltage, with IGBTs switching at kilohertz. Choose it by current and duty, and remember it draws real power only.
`,
  ideas: [
    'A VFD has three stages: a diode rectifier, a DC link of capacitors, and an IGBT inverter.',
    'The DC bus is about 1.35 × the line voltage: 540 V on 400 V mains.',
    'PWM at 2–16 kHz makes the average output voltage a sine of any frequency; the motor inductance smooths the current.',
    'The drive draws only real power: at low speed its input current can be far below the motor current.',
    'Choose a drive by output current and duty (heavy or normal), derated for altitude, ambient temperature and switching frequency.'
  ],
  pitfalls: [
    'A 7.5 kW drive suits any 7.5 kW motor — Drives are rated in current; a 7.5 kW 6-pole or low-efficiency motor may draw more than a 7.5 kW 4-pole one, and heavy duty needs a bigger drive than normal duty.',
    'Once the drive is switched off the motor cable is dead — The DC bus keeps its charge for minutes; wait the time on the label and measure.',
    'The switching frequency sets the motor speed — The carrier only shapes the pulses; the output (fundamental) frequency sets the speed.'
  ],
  formulas: [
    {
      name: 'DC bus voltage of a six-pulse rectifier',
      expr: 'Vdc = 3*sqrt(2)/pi*V', tex: 'V_{dc} = \\dfrac{3\\sqrt{2}}{\\pi}\\,V_{LL}',
      vars: {
        Vdc: { name: 'average DC bus voltage', q: 'voltage', unit: 'V', tex: 'V_{dc}' },
        V: { name: 'line-to-line mains voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_{LL}' }
      },
      note: 'Under load; with no load the bus charges to the peak, √2 × V_LL (566 V on 400 V).',
      stories: { Vdc: 'A drive is fed from {V} three-phase mains. What is its DC bus voltage?' }
    },
    {
      name: 'Highest output voltage',
      expr: 'Vo = Vdc/sqrt(2)', tex: 'V_{out} = \\dfrac{V_{dc}}{\\sqrt{2}}',
      vars: {
        Vo: { name: 'largest line-to-line output voltage (rms), linear space-vector modulation', q: 'voltage', unit: 'V', tex: 'V_{out}' },
        Vdc: { name: 'DC bus voltage', q: 'voltage', unit: 'V', value: 540, tex: 'V_{dc}' }
      },
      note: 'Plain sine–triangle modulation reaches only 0.612 V_dc; overmodulation squeezes out a few per cent more at the cost of low-order harmonics.',
      stories: { Vo: 'A drive\'s DC bus sits at {Vdc}. What is the highest sinusoidal line voltage it can give the motor?' }
    },
    {
      name: 'Input current of a drive',
      expr: 'I = P/(sqrt(3)*V*lam)', tex: 'I_{in} = \\dfrac{P_{in}}{\\sqrt{3}\\,V_{LL}\\,\\lambda}',
      vars: {
        I: { name: 'input line current (rms)', q: 'current', unit: 'A', tex: 'I_{in}' },
        P: { name: 'input (real) power', q: 'power', unit: 'kW', value: 4.33, tex: 'P_{in}' },
        V: { name: 'line-to-line mains voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_{LL}' },
        lam: { name: 'true power factor at the input (about 0.9–0.95 with a choke)', value: 0.93, min: 0.3, max: 1, tex: '\\lambda' }
      },
      note: 'The input power is the shaft power divided by the motor and drive efficiencies; the motor\'s own power factor does not appear.',
      stories: { I: 'A drive takes {P} from {V} mains at a power factor of {lam}. What input current does it draw?' }
    }
  ],
  examples: [
    {
      title: 'Bus and output voltages',
      q: 'Find the DC bus voltage and the largest output line voltage of drives on 400 V and on 480 V mains.',
      steps: [
        '400 V: $V_{dc} = 1.35 \\times 400 = 540$ V; $V_{out} = 540/\\sqrt{2} = 382$ V.',
        '480 V: $V_{dc} = 1.35 \\times 480 = 648$ V; $V_{out} = 458$ V.'
      ],
      a: '540 V and 382 V; 648 V and 458 V — slightly below the mains, which is why motors on drives run marginally weaker at full speed.'
    },
    {
      title: 'Low speed, full torque: input against motor current',
      q: 'A 7.5 kW conveyor motor (rated 14.6 A, 49 N·m) runs on a drive at 25 Hz (about 720 rpm) with rated torque. Its efficiency there is about 88 %, the drive\'s 97 %. What current does the drive draw from 400 V mains at a power factor of 0.93?',
      steps: [
        'Shaft power $49 \\times 720 \\times 2\\pi/60 = 3.7$ kW.',
        'Input power $3.7/(0.88 \\times 0.97) = 4.33$ kW.',
        '$I_{in} = 4330/(\\sqrt{3} \\times 400 \\times 0.93) = 6.7$ A.',
        'The motor still carries about its rated 14–15 A: torque needs current, but half the speed needs only half the power.'
      ],
      a: 'About 6.7 A from the mains while the motor draws about 14.6 A.'
    }
  ],
  quiz: [
    { q: 'What is the DC bus voltage of a drive on 400 V three-phase mains?', choices: ['About 540 V', 'About 400 V', 'About 230 V', 'About 800 V'], a: 0, why: 'A six-pulse bridge gives 1.35 × V_LL on average: 540 V (566 V at no load).' },
    { q: 'A motor on a drive runs at 20 Hz with rated torque. The drive\'s input current compared with the motor current is…', choices: ['much smaller', 'the same', 'larger', 'zero'], a: 0, why: 'The drive draws real power only; at 40 % speed the power is about 40 % while the motor current, which follows the torque, is near rated.' },
    { q: 'Which quantity sets the motor\'s speed?', choices: ['The output (fundamental) frequency', 'The switching (carrier) frequency', 'The DC bus voltage', 'The input frequency'], a: 0, why: 'The carrier shapes the pulses; the modulated sine\'s frequency sets the rotating field\'s speed.' },
    { q: 'A few seconds after switching off a drive, its DC bus is safe to touch.', a: false, why: 'The capacitors hold hundreds of volts for minutes; wait the time on the label and measure.' },
    { q: 'Why does a drive have a precharge circuit?', choices: ['To limit the inrush current into the empty DC-link capacitors at power-up', 'To start the motor gently', 'To brake the motor', 'To filter harmonics'], a: 0, why: 'Empty capacitors on a diode bridge would draw a huge current; a resistor limits it, then is bypassed.' }
  ],
  problems: [
    { q: 'What is the DC bus voltage of a drive on 480 V three-phase mains, under load?', answer: 648, unit: 'V', tol: 0.01, steps: ['$V_{dc} = 3\\sqrt{2}/\\pi \\times 480 = 1.3505 \\times 480 = 648$ V.'] },
    { q: 'A drive powers a motor giving 11 kW at the shaft (motor efficiency 90 %, drive 97 %) from 400 V mains at a power factor of 0.94. What is the input current?', answer: 19.4, unit: 'A', tol: 0.02, steps: ['$P_{in} = 11/(0.9 \\times 0.97) = 12.6$ kW.', '$I = 12\\,600/(\\sqrt{3} \\times 400 \\times 0.94) = 19.4$ A.'] }
  ],
  choose: {
    good: [
      'Any induction motor whose speed must vary: fans, pumps, conveyors, mixers, machine tools, hoists.',
      'Starting high-inertia or heavily loaded machines at about rated current with full torque.',
      'Energy saving where flow or speed varies (fans and pumps), and smooth ramps where products or mechanics are fragile.'
    ],
    avoid: [
      'Motors that run at constant full speed and start easily: a drive adds cost, 2–3 % losses, harmonics and EMC work — a DOL or soft starter is enough.',
      'Very long motor cables or old motors with weak insulation, unless filters are added.',
      'Hazardous areas, unless the motor is certified for converter supply with the drive and its thermal protection.'
    ],
    check: [
      'Motor nameplate current against the drive\'s output current in the right duty (heavy or normal), with derating for altitude, ambient and switching frequency.',
      'The supply: harmonics (chokes, filters), the upstream protection and the RCD type.',
      'Cable length, EMC category and motor insulation for converter duty.',
      'Braking needs (resistor or regeneration), enclosure cooling for the drive\'s heat, and the safety functions (STO).'
    ]
  },
  applications: [
    'Building ventilation fans and chilled-water pumps: speed follows demand.',
    'Conveyors, extruders, mixers, winders and machine-tool spindles: speed set by the process.',
    'Explore the drive in [the drives and signals tools](#/tools/drives/vfd) and the induction motor on a VFD in [the motor lab](#/tools/motorlab/induction).'
  ],
  history: 'Early variable-frequency inverters of the 1960s and 1970s used thyristors and needed commutation circuits to switch them off. Power bipolar transistors made PWM drives practical for general industry in the 1980s, and the insulated-gate bipolar transistor (IGBT), developed in the early 1980s, became the standard drive switch in the 1990s, making drives smaller, quieter and cheaper every decade since.',
  sources: [
    'IEC 61800-2, *Adjustable speed electrical power drive systems — General requirements — Rating specifications for low voltage adjustable speed AC power drive systems*.',
    'IEC 61800-5-1, *Adjustable speed electrical power drive systems — Safety requirements — Electrical, thermal and energy*.',
    'Mohan, *Electric Drives: An Integrative Approach*: the PWM inverter and the induction motor drive.',
    'Hughes and Drury, *Electric Motors and Drives*: inverter-fed induction motors.'
  ],
  sim: ['sd-vfd-inside', 'ref-induction']
},

{
  id: 'v-over-f-control', parent: 'vfd-topic', title: 'V/f control', level: 2,
  short: 'The simplest way to drive an induction motor at variable speed: raise the voltage in proportion to the frequency so the magnetic flux stays constant. The torque–speed curve then slides along the speed axis unchanged. A boost helps at low speed, a quadratic curve saves energy on fans, and above the base frequency the voltage runs out and the field weakens.',
  keywords: ['V/f', 'V/Hz', 'volts per hertz', 'scalar control', 'boost', 'IR compensation', 'base frequency', 'field weakening', 'constant power', 'quadratic V/f', '87 Hz', 'slip compensation', 'flux', 'multi-motor drive'],
  prereq: ['vfd-principle', 'torque-slip-curve', 'magnetic-circuits'],
  related: ['vector-control-vfd', 'vfd-parameters', 'vfd-energy-saving', 'dual-voltage-motors', 'load-torque-types', 'motor-heating'],
  body: `
The flux in an induction motor's iron is set by the voltage per unit of frequency — it is [[?proportional|proportional]] to $V/f$. By Faraday's law the voltage a winding needs to drive a given flux through the iron grows with how fast that flux alternates, so to keep the flux — and with it the torque per ampere and the breakdown torque — constant, the drive keeps the ratio $V/f$ constant: 400 V at 50 Hz is **8 V/Hz**, so 200 V at 25 Hz and 80 V at 10 Hz. With constant flux the whole [[torque-slip-curve|torque–speed curve]] slides along the speed axis keeping its shape: the slip in rpm for a given torque stays about the same, and the motor can give its rated torque at any speed below the base speed.

### Boost at low frequency
The stator winding's resistance takes a fixed voltage drop $I R_1$, whatever the frequency. At 50 Hz it is a few per cent of the 400 V; at 5 Hz it eats a large part of the 40 V, the flux collapses and the torque with it. A **boost** adds a fixed voltage at low frequency:

$$V = V_0 + (V_n - V_0)\\,\\frac{f}{f_n}$$

For the 7.5 kW motor of the simulations, the breakdown torque at 5 Hz is 0.7 × rated without boost and 1.4 × rated with a 20 V (5 %) boost. Too much boost overexcites the motor at light load — the iron saturates, the magnetising current soars, it heats and may trip the drive — so set it just high enough to start the load, or use the drive's automatic boost (IR compensation), which adds voltage in proportion to the measured current.

### Above the base frequency: field weakening
The drive cannot give more than its supply voltage. Above the **base frequency** (the nameplate 50 or 60 Hz) the voltage stays at maximum while the frequency rises, so the flux falls as $1/f$. The torque per ampere falls with it: at rated current the motor gives roughly **constant power** — half torque at twice the speed — and its breakdown torque falls as $1/f^2$, so at high speed the motor can stall on a load it carried easily at 50 Hz. Most general-purpose 4-pole motors can run to perhaps 1.5–2 × base speed if the bearings, balance and fan noise allow; check the maker's maximum speed.

| Region | Voltage | Flux | Torque available (continuous) | Power |
|---|---|---|---|---|
| Low speed, below ~5 Hz | boosted | falls without boost | limited (and cooling!) | small |
| Up to base frequency | $\\propto f$ | constant | about rated (if cooled) | $\\propto f$ |
| Above base (field weakening) | constant (maximum) | $\\propto 1/f$ | $\\propto 1/f$; breakdown $\\propto 1/f^2$ | about constant |

### The 87 Hz trick
A 230 V Δ / 400 V Y motor is normally run in star on a 400 V drive. Connect it in **delta** instead and set the drive's base frequency to $50 \\times 400/230$ = **87 Hz**: its windings get the correct V/f all the way to 87 Hz and 400 V, so it gives rated torque up to 1.73 times its speed — 1.73 times the power — if its bearings, balance and cooling allow. The price: in delta it draws 1.73 times the current, so the drive must be sized for the delta current.

### Patterns and helpers
- **Linear V/f** for constant-torque loads (conveyors, mixers, positive-displacement pumps).
- **Quadratic V/f** for fans and centrifugal pumps, whose torque falls with the square of speed: less flux at part speed means lower magnetising losses and less noise. Never on a constant-torque load.
- **Slip compensation** raises the frequency a little in proportion to the load, so the speed droops less than the 1–5 % slip.
- **Multi-motor drives**: several motors in parallel on one drive work only in V/f, each with its own overload relay.

A self-cooled motor has its fan on its own shaft: at half speed it moves roughly half the air, so it cannot carry its full rated torque continuously at low speed; the maker's derating curve says how much, and a separately powered fan removes the limit.

**In the simulation** move the frequency and watch the voltage follow the V/f line, the curve slide, the flux gauge stay full — then go below 10 Hz with and without boost, above 50 Hz into field weakening, and try the 87 Hz connection.

> [!key] V/f keeps the flux constant by keeping volts per hertz constant: rated torque at any speed below base, a boost at low speed, constant power and a shrinking breakdown torque above base. Simple, robust and good enough for most fans, pumps and conveyors.
`,
  ideas: [
    'Flux ∝ V/f: keep the ratio constant (8 V/Hz for 400 V, 50 Hz) and the torque–speed curve keeps its shape at any frequency.',
    'At low frequency the stator IR drop steals flux; a boost puts it back, but too much boost overexcites the motor.',
    'Above base frequency the voltage is at its limit: the field weakens, available torque falls as 1/f and breakdown torque as 1/f².',
    'A 230/400 V motor in delta on a 400 V drive keeps full flux up to 87 Hz — at 1.73 times the current.',
    'Quadratic V/f suits fans and pumps; slip compensation reduces the speed droop under load.'
  ],
  pitfalls: [
    'More boost always gives more torque — Beyond what the IR drop needs it saturates the iron, raises the magnetising current and heats the motor at light load.',
    'A motor on a drive gives rated torque at any speed — Above base frequency the field weakens; below about half speed a self-cooled motor cannot shed the heat of rated torque.',
    'Quadratic V/f saves energy on any machine — On a constant-torque load the reduced flux means much more current for the same torque, or a stall.'
  ],
  formulas: [
    {
      name: 'The V/f line with boost',
      expr: 'V = V0 + (Vn - V0)*f/fn', tex: 'V = V_0 + (V_n - V_0)\\,\\dfrac{f}{f_n}',
      vars: {
        V: { name: 'output voltage (line to line)', q: 'voltage', unit: 'V' },
        V0: { name: 'boost voltage at 0 Hz', q: 'voltage', unit: 'V', value: 16, tex: 'V_0' },
        Vn: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 400, tex: 'V_n' },
        f: { name: 'output frequency', q: 'frequency', unit: 'Hz', value: 20 },
        fn: { name: 'base (rated) frequency', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_n' }
      },
      note: 'Valid up to the base frequency; above it V = V_n.',
      stories: { V: 'A {Vn}, {fn} motor runs on a drive at {f} with a boost of {V0}. What voltage does the drive give it?', f: 'At what frequency does a drive with boost {V0} reach {V} on a {Vn}, {fn} V/f line?' }
    },
    {
      name: 'Motor speed from frequency',
      expr: 'n = 2*f/p*(1 - s)', tex: 'n = \\dfrac{2f}{p}\\,(1 - s)',
      vars: {
        n: { name: 'rotor speed', q: 'frequency', unit: 'rpm' },
        f: { name: 'output frequency', q: 'frequency', unit: 'Hz', value: 50 },
        p: { name: 'number of poles', value: 4, int: true, min: 2, max: 48 },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 3.2, min: 0, max: 100 }
      },
      note: 'In rpm this is the familiar 120 f/p × (1 − s). On a drive the slip in rpm stays about the same at every frequency for the same torque.',
      stories: { n: 'A {p}-pole motor runs at {f} with a slip of {s}. How fast does it turn?', f: 'A {p}-pole motor must turn at {n} with a slip of {s}. What frequency does the drive need?' }
    },
    {
      name: 'Breakdown torque in field weakening',
      expr: 'Tk = Tkn*(fn/f)^2', tex: 'T_k = T_{k,n}\\left(\\dfrac{f_n}{f}\\right)^2',
      vars: {
        Tk: { name: 'breakdown torque at frequency f', q: 'torque', unit: 'N·m', tex: 'T_k' },
        Tkn: { name: 'breakdown torque at base frequency', q: 'torque', unit: 'N·m', value: 141, tex: 'T_{k,n}' },
        fn: { name: 'base frequency', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_n' },
        f: { name: 'output frequency (above base)', q: 'frequency', unit: 'Hz', value: 75 }
      },
      note: 'Neglecting the stator resistance; for f above the base frequency at constant voltage.',
      stories: { Tk: 'A motor with a breakdown torque of {Tkn} at {fn} runs at {f} on full voltage. What is its breakdown torque now?', f: 'Up to what frequency does a motor with breakdown torque {Tkn} at {fn} keep a breakdown torque of at least {Tk}?' }
    },
    {
      name: 'Base frequency of the 87 Hz connection',
      expr: 'fb = fn*V/Vm', tex: 'f_b = f_n\\,\\dfrac{V}{V_m}',
      vars: {
        fb: { name: 'new base frequency', q: 'frequency', unit: 'Hz', tex: 'f_b' },
        fn: { name: 'rated frequency of the motor', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_n' },
        V: { name: 'drive output voltage', q: 'voltage', unit: 'V', value: 400 },
        Vm: { name: 'rated voltage of the motor in the connection used', q: 'voltage', unit: 'V', value: 230, tex: 'V_m' }
      },
      stories: { fb: 'A {Vm}, {fn} motor connection is fed from a {V} drive. At what frequency does it reach its rated V/f at full drive voltage?' }
    }
  ],
  examples: [
    {
      title: 'The voltage at 20 Hz',
      q: 'A 400 V, 50 Hz motor runs on a drive at 20 Hz with a boost of 16 V (4 %). What voltage does it get, and what would it get without boost?',
      steps: ['$V = 16 + (400 - 16) \\times 20/50 = 16 + 153.6 = 169.6$ V.', 'Without boost: $400 \\times 20/50 = 160$ V.'],
      a: 'About 170 V with boost, 160 V without — the 10 V difference replaces the stator resistance drop.'
    },
    {
      title: 'A 4 kW motor at 87 Hz',
      q: 'A 4 kW, 230 V Δ / 400 V Y, 1440 rpm motor is rated 14.2 A in delta and 8.2 A in star. It is connected in delta to a 400 V drive with an 87 Hz base frequency. What speed, power and drive current does it get?',
      steps: [
        'Base frequency $50 \\times 400/230 = 87$ Hz; synchronous speed $1500 \\times 87/50 = 2610$ rpm; with the same 60 rpm slip about 2550 rpm.',
        'Rated torque stays $4000/(1440 \\times 2\\pi/60) = 26.5$ N·m, so the power is about $26.5 \\times 2550 \\times 2\\pi/60 = 7.1$ kW — about 1.73 times, if its bearings and cooling allow.',
        'The drive must deliver the delta current, 14.2 A: a drive rated about 16 A (a 7.5 kW size), not a 4 kW one.'
      ],
      a: 'About 2550 rpm and 7 kW, drawing 14.2 A: the drive is sized for 7.5 kW.'
    },
    {
      title: 'Is there enough torque at 100 Hz?',
      q: 'The 7.5 kW motor (rated 49 N·m at 1450 rpm, breakdown 141 N·m) is run at 100 Hz on full voltage to drive a machine that needs its rated 7.5 kW at 2900 rpm. Is the breakdown torque sufficient?',
      steps: [
        'Torque needed: $7500/(2900 \\times 2\\pi/60) = 24.7$ N·m.',
        'Breakdown at 100 Hz: $141 \\times (50/100)^2 = 35$ N·m (a little more with the stator resistance taken into account).',
        'The margin, 35/24.7 = 1.4, is thin: a load surge could stall the motor, and the bearings and fan must be checked for 2900 rpm.'
      ],
      a: 'Barely: about 1.4 times the torque needed. A 2-pole motor at 50 Hz or a larger motor would be safer.'
    }
  ],
  quiz: [
    { q: 'A 400 V, 50 Hz motor runs on plain V/f (no boost) at 25 Hz. What voltage does the drive give it?', choices: ['200 V', '400 V', '100 V', '283 V'], a: 0, why: '8 V/Hz × 25 Hz = 200 V, keeping the flux constant.' },
    { q: 'Why is a boost needed at low frequency?', choices: ['The stator resistance drop becomes a large part of the small voltage and the flux collapses', 'The motor\'s inductance rises at low frequency', 'The DC bus voltage falls at low speed', 'To speed up the fan'], a: 0, why: 'I·R₁ does not shrink with frequency while the voltage does; the boost replaces the lost flux.' },
    { q: 'Above the base frequency the torque the motor can give falls because…', choices: ['the voltage cannot rise any further, so the flux falls as 1/f', 'the rotor resistance rises', 'the drive limits the current', 'the slip becomes negative'], a: 0, why: 'The drive is at its maximum voltage; V/f and so the flux fall as the frequency rises: field weakening.' },
    { q: 'Quadratic V/f is a good energy-saving setting for a loaded belt conveyor.', a: false, why: 'A conveyor needs roughly constant torque; the reduced flux at part speed would demand far more current or stall it. Quadratic V/f is for fans and centrifugal pumps.' },
    { q: 'For the 87 Hz trick, a 230/400 V motor is connected…', choices: ['in delta, and the drive is sized for the delta current', 'in star, and the drive is set to 87 Hz', 'in delta to a 230 V drive', 'in star to a 690 V drive'], a: 0, why: 'In delta its windings are rated 230 V; 400 V at 87 Hz keeps V/f right. It draws the (larger) delta current.' }
  ],
  problems: [
    { q: 'A 400 V, 50 Hz motor on a drive with a 10 V boost runs at 35 Hz. What voltage does the drive apply?', answer: 283, unit: 'V', tol: 0.01, steps: ['$V = 10 + (400 - 10) \\times 35/50 = 10 + 273 = 283$ V.'] },
    { q: 'A 6-pole motor runs on a drive at 40 Hz with 3 % slip. What is its speed?', answer: 776, unit: 'rpm', tol: 0.01, steps: ['Synchronous speed $120 \\times 40/6 = 800$ rpm.', '$n = 800 \\times 0.97 = 776$ rpm.'] }
  ],
  choose: {
    good: [
      'Fans, centrifugal pumps, conveyors and mixers with moderate starting torque and no need for precise speed.',
      'Several motors in parallel on one drive (each with its own overload relay).',
      'Simple commissioning: works with any induction motor, even when its data are uncertain.'
    ],
    avoid: [
      'Full torque at very low speed (below about 3–5 Hz) or holding a load at standstill: use vector control with an encoder.',
      'Precise speed under changing load, or torque control (winders, extruders): use vector control.',
      'Hoists and cranes: they need torque at zero speed and coordinated brake control.'
    ],
    check: [
      'The V/f pattern: linear for constant torque, quadratic only for fans and pumps.',
      'The boost against the load\'s breakaway torque — and no more.',
      'The motor\'s cooling at low speed (derating curve or separate fan) and its maximum speed above base.',
      'Slip compensation if speed droop matters.'
    ]
  },
  applications: [
    'HVAC fans and pumps: quadratic V/f with a 20–50 Hz range.',
    'Conveyors and simple machine drives: linear V/f with slip compensation.',
    'Textile and paper lines with many small motors on one large drive, all following one frequency.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: inverter-fed induction motors, constant-flux operation and field weakening.',
    'IEC TS 60034-17, *Rotating electrical machines — Cage induction motors when fed from converters — Application guide*: derating, noise, maximum speed.',
    'Chapman, *Electric Machinery Fundamentals*: variable-frequency speed control of induction motors.'
  ],
  sim: 'sd-vf-curve'
},

{
  id: 'vector-control-vfd', parent: 'vfd-topic', title: 'Sensorless vector control and DTC', level: 3,
  short: 'Vector control splits the motor current into a part that makes flux and a part that makes torque, and controls each one directly — as a DC motor has a field current and an armature current. With a motor model (sensorless) or an encoder (closed loop) the drive gives full torque at low or zero speed, holds speed under load and responds in milliseconds. Direct torque control reaches the same goal by choosing the inverter\'s switch states directly.',
  keywords: ['vector control', 'field-oriented control', 'FOC', 'sensorless vector', 'SVC', 'closed-loop vector', 'flux vector', 'direct torque control', 'DTC', 'Id Iq', 'flux current', 'torque current', 'rotor time constant', 'slip frequency', 'auto-tune', 'motor model', 'encoder feedback'],
  prereq: ['v-over-f-control', 'equivalent-circuit', 'foc-control'],
  related: ['vfd-parameters', 'incremental-encoders', 'motors-conveyors-hoists', 'servo-drives', 'pmsm-motor', 'motor-brakes'],
  body: `
In a DC motor, flux and torque are controlled separately: the field current sets the flux, the armature current sets the torque, and they sit at right angles on the commutator. An induction motor mixes both in one stator current. **Vector control** (field-oriented control) untangles them. The drive describes the three phase currents as one rotating current [[?vector|vector]] and projects it onto axes that turn with the rotor flux:

- $I_d$, along the flux: the **magnetising** (flux-producing) current, held at its rated value — typically 25–50 % of the rated current in small and medium motors;
- $I_q$, at right angles: the **torque-producing** current, $T \\propto \\psi_r\\,I_q$.

The measured current is the vector sum, $I = \\sqrt{I_d^2 + I_q^2}$. Two fast PI current loops (updated every 60–250 µs or so) hold $I_d$ and $I_q$ at their references, and the modulator makes the voltages needed. A speed loop around them sets the torque reference. The motor now behaves like a separately excited DC motor: torque changes in a few milliseconds, independently of the flux.

### Where is the flux? Sensorless or with an encoder
The whole trick depends on knowing the angle of the rotor flux, which cannot be measured directly.
- **Closed-loop vector** (flux vector): an encoder gives the rotor angle; the drive adds the **slip** it calculates from the currents, $\\omega_{sl} = I_q/(\\tau_r I_d)$, with $\\tau_r$ the rotor time constant. It works right down to zero speed: full torque at standstill, needed for hoists, winders and positioning.
- **Sensorless vector** (SVC): a motor model in the drive estimates the flux from the measured currents and the voltages it applies. It needs the motor's stator resistance, leakage and magnetising inductances and rotor time constant — hence the **auto-tune**, which measures them with test pulses at standstill or, better, with the motor turning freely. The model relies on back-EMF, which vanishes at zero frequency, so sensorless control holds full torque down to about 0.5–1 Hz but not indefinitely at standstill.

### Direct torque control
**DTC** skips the current loops and the modulator. Every few tens of microseconds it estimates the stator flux and the torque and compares them with their references in hysteresis bands; a switching table then picks one of the inverter's eight switch states (six active vectors and two zero vectors) to push flux and torque the right way. Torque responds in a few milliseconds and the drive needs no encoder for most jobs; the switching frequency varies with the operating point.

| | V/f | Sensorless vector / DTC | Closed-loop vector |
|---|---|---|---|
| Speed range at full torque | about 1:10–1:20 | about 1:100 | 1:1000 and zero speed |
| Static speed error | the slip, 1–5 % (less with slip compensation) | roughly 0.1–0.5 % | set by the encoder, 0.01 % or better |
| Torque at low speed | limited below 3–5 Hz | 150–200 % down to ~1 Hz | 150–200 % at standstill |
| Torque response | tens to hundreds of ms | a few to ~20 ms | a few ms |
| Motors per drive | several | one | one, with an encoder |

### Why the model matters
Everything rests on the motor data. A rotor that warms by 80 K has about 30 % more resistance, so its rotor time constant falls by the same factor; a drive that still assumes the cold value calculates the slip wrongly, misplaces the flux axis, and loses torque accuracy and speed accuracy. Good drives adapt the model while running; all need correct nameplate data and an auto-tune. Vector control also drives **permanent-magnet** synchronous motors (see [[pmsm-motor]]), where the magnets provide the flux and $I_d$ is held near zero.

**In the simulation** run the motor slowly and hit it with a load step. On V/f the speed sags by the slip — or the motor stalls; with slip compensation it recovers slowly; sensorless vector pulls it back in a fraction of a second; closed loop holds it almost exactly, even at zero speed. Watch the current vector split into its flux and torque parts.

> [!warn] Vector control can hold a load at zero speed — but it is not a brake. A hoist needs a mechanical holding brake controlled by the drive, and loads must be secured before a drive is switched off, reset or re-tuned. A rotating auto-tune spins the motor: uncouple it or make sure the machine may move.

> [!key] Vector control turns an induction motor into a DC-motor-like servo: flux current $I_d$ and torque current $I_q$ controlled separately. It needs correct motor data (auto-tune), and an encoder when full torque at zero speed is required.
`,
  ideas: [
    'Vector control splits the stator current into a flux part I_d and a torque part I_q, controlled separately like a DC motor\'s field and armature.',
    'The measured current is √(I_d² + I_q²); torque is proportional to I_q at rated flux.',
    'Sensorless vector estimates the flux from a motor model; it needs an auto-tune and loses accuracy near zero frequency.',
    'Closed-loop vector uses an encoder plus the calculated slip and gives full torque at standstill.',
    'DTC selects inverter switch states directly from flux and torque errors, without a modulator.'
  ],
  pitfalls: [
    'Sensorless vector can hold a hoist at standstill indefinitely — At zero frequency the back-EMF that the model uses vanishes; holding needs an encoder and a mechanical brake.',
    'The auto-tune is optional polish — Without correct motor data the flux angle is wrong and vector control can be worse than V/f.',
    'A vector drive can run several motors in parallel — The model describes one motor; parallel motors need V/f.'
  ],
  formulas: [
    {
      name: 'Current from its flux and torque parts',
      expr: 'I = sqrt(Id^2 + Iq^2)', tex: 'I = \\sqrt{I_d^2 + I_q^2}',
      vars: {
        I: { name: 'stator current (rms)', q: 'current', unit: 'A' },
        Id: { name: 'flux-producing (magnetising) current', q: 'current', unit: 'A', value: 6, tex: 'I_d' },
        Iq: { name: 'torque-producing current', q: 'current', unit: 'A', value: 13.75, tex: 'I_q' }
      },
      stories: { I: 'A motor needs {Id} of magnetising current and {Iq} of torque current. What current does the drive supply?', Iq: 'A motor with {Id} magnetising current draws {I}. How much of it makes torque?' }
    },
    {
      name: 'Torque from the torque current',
      expr: 'T = Tn*Iq/Iqn', tex: 'T = T_n\\,\\dfrac{I_q}{I_{q,n}}',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        Tn: { name: 'rated torque', q: 'torque', unit: 'N·m', value: 49.2, tex: 'T_n' },
        Iq: { name: 'torque current', q: 'current', unit: 'A', value: 20.6, tex: 'I_q' },
        Iqn: { name: 'torque current at rated torque', q: 'current', unit: 'A', value: 13.75, tex: 'I_{q,n}' }
      },
      note: 'At rated flux (below base speed); in field weakening the flux and so the torque per ampere fall.',
      stories: { T: 'A motor rated {Tn} at a torque current of {Iqn} is given {Iq}. What torque does it make?', Iq: 'A motor rated {Tn} at {Iqn} must give {T}. What torque current does it need?' }
    },
    {
      name: 'Slip frequency in field-oriented control',
      expr: 'fs = Iq/(2*pi*tr*Id)', tex: 'f_{sl} = \\dfrac{I_q}{2\\pi\\,\\tau_r\\,I_d}',
      vars: {
        fs: { name: 'slip frequency', q: 'frequency', unit: 'Hz', tex: 'f_{sl}' },
        Iq: { name: 'torque current', q: 'current', unit: 'A', value: 13.75, tex: 'I_q' },
        tr: { name: 'rotor time constant L_r/R_r', q: 'time', unit: 's', value: 0.25, tex: '\\tau_r' },
        Id: { name: 'flux current', q: 'current', unit: 'A', value: 6, tex: 'I_d' }
      },
      note: 'What a closed-loop vector drive adds to the measured rotor speed to place the flux; a wrong τ_r (a hot or cold rotor) puts the flux axis in the wrong place.',
      stories: { fs: 'A motor with rotor time constant {tr} runs with {Id} flux current and {Iq} torque current. What is its slip frequency?', tr: 'At {Id} flux current and {Iq} torque current a motor slips at {fs}. What is its rotor time constant?' }
    }
  ],
  examples: [
    {
      title: 'The current for 150 % torque',
      q: 'A 7.5 kW motor has a rated current of 15 A and a magnetising current of 6 A. What current does a vector drive need for 150 % of rated torque?',
      steps: [
        'Rated torque current: $I_{q,n} = \\sqrt{15^2 - 6^2} = 13.75$ A.',
        'For 150 %: $I_q = 1.5 \\times 13.75 = 20.6$ A, with $I_d$ still 6 A.',
        '$I = \\sqrt{20.6^2 + 6^2} = 21.5$ A = 143 % of rated current.'
      ],
      a: '21.5 A — 1.5 × torque for only 1.43 × current, because the flux part does not grow.'
    },
    {
      title: 'The slip — and a warm rotor',
      q: 'The same motor has a rotor time constant of 0.25 s when cold. Find the slip frequency at rated torque. The rotor then warms and its time constant falls to 0.2 s; what happens if the drive does not adapt?',
      steps: [
        '$f_{sl} = 13.75/(2\\pi \\times 0.25 \\times 6) = 1.46$ Hz — 2.9 % slip at 50 Hz.',
        'With $\\tau_r$ = 0.2 s the real slip is $13.75/(2\\pi \\times 0.2 \\times 6) = 1.82$ Hz.',
        'The drive still assumes 1.46 Hz: its flux axis drifts, torque per ampere falls and, in sensorless mode, the speed is off by about 0.36 Hz (11 rpm for 4 poles).'
      ],
      a: '1.46 Hz cold; a warm rotor needs 1.82 Hz, so a non-adaptive model loses accuracy.'
    }
  ],
  quiz: [
    { q: 'In field-oriented control, which current component makes torque?', choices: ['I_q, at right angles to the rotor flux', 'I_d, along the rotor flux', 'The zero-sequence current', 'The DC bus current'], a: 0, why: 'I_d builds the flux; torque is proportional to flux × I_q, as armature current × field in a DC motor.' },
    { q: 'Why does a sensorless vector drive need an auto-tune?', choices: ['Its motor model needs the stator resistance, inductances and rotor time constant', 'To find the mains frequency', 'To set the ramps', 'To test the brake resistor'], a: 0, why: 'The drive estimates where the flux is from a model of the motor; without the right parameters the estimate is wrong.' },
    { q: 'Which control suits a hoist that must hold full torque at zero speed?', choices: ['Closed-loop vector with an encoder, plus a mechanical holding brake', 'V/f with extra boost', 'Sensorless vector alone', 'Quadratic V/f'], a: 0, why: 'At zero frequency there is no back-EMF for a sensorless model; the encoder tells the drive exactly where the rotor is. The brake holds when the drive is off.' },
    { q: 'A vector drive can control three motors wired in parallel as easily as one.', a: false, why: 'The model and the current loops describe one motor; parallel motors share current in unknown ways. Use V/f for multi-motor drives.' },
    { q: 'What makes DTC different from classic vector control?', choices: ['It chooses inverter switch states directly from flux and torque errors, without current loops or a PWM modulator', 'It needs no motor model', 'It works only with an encoder', 'It keeps the switching frequency fixed'], a: 0, why: 'Hysteresis comparators and a switching table replace the current loops and the modulator; the switching frequency varies.' }
  ],
  problems: [
    { q: 'A motor runs with 8 A of flux current and 20 A of torque current. What stator current does it draw?', answer: 21.5, unit: 'A', tol: 0.02, steps: ['$I = \\sqrt{8^2 + 20^2} = \\sqrt{464} = 21.5$ A.'] },
    { q: 'A motor with a rotor time constant of 0.3 s runs with a torque current twice its flux current. What is its slip frequency?', answer: 1.06, unit: 'Hz', tol: 0.02, steps: ['$f_{sl} = I_q/(2\\pi \\tau_r I_d) = 2/(2\\pi \\times 0.3)$', '$= 1.06$ Hz.'] }
  ],
  choose: {
    good: [
      'High starting torque and full torque at low speed: loaded conveyors, extruders, mixers, crushers.',
      'Speed that must hold under changing load, and torque control: winders, test benches, extruders.',
      'Hoists, cranes and lifts (closed loop with an encoder and drive-controlled brake).'
    ],
    avoid: [
      'Several motors on one drive, or a motor of unknown data that cannot be auto-tuned: use V/f.',
      'Simple fans and pumps where V/f already does the job — vector adds nothing but set-up work.',
      'Precise positioning with frequent short moves: a servo drive and a servo motor are made for it.'
    ],
    check: [
      'Correct nameplate data and an auto-tune (rotating, with the load uncoupled, gives the best model).',
      'Whether torque at zero speed is needed: then an encoder, its cable and the drive\'s encoder interface.',
      'The drive\'s overload current for the peak torque (I rises less than torque, but it rises).',
      'The motor\'s cooling at low speed and full torque.'
    ]
  },
  applications: [
    'Cranes and hoists: closed-loop vector with brake control holds loads without roll-back.',
    'Winders and unwinders in paper, film and wire lines: torque control keeps web tension.',
    'Extruders and mixers: high torque at low speed with steady speed under changing load.'
  ],
  history: 'The principle of field orientation was worked out around 1970 in Germany: Karl Hasse described indirect (slip-calculating) field orientation in the late 1960s and Felix Blaschke published direct field orientation in the early 1970s. Direct torque control was proposed in the mid-1980s by Isao Takahashi and Toshihiko Noguchi in Japan and, as direct self control, by Manfred Depenbrock in Germany. Cheap microprocessors made sensorless vector control a standard drive feature in the 1990s.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: field-oriented (vector) control and direct torque control.',
    'Mohan, *Electric Drives: An Integrative Approach*: space vectors and vector control of induction motors.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: dq theory and field-oriented control.',
    'I. Takahashi and T. Noguchi, "A new quick-response and high-efficiency control strategy of an induction motor", *IEEE Transactions on Industry Applications*, 1986.'
  ],
  sim: 'sd-vector'
},

{
  id: 'vfd-parameters', parent: 'vfd-topic', title: 'Setting up a VFD: the essential parameters', level: 2,
  short: 'A drive fresh from the box knows nothing about its motor or machine. Commissioning means entering the nameplate data, running an auto-tune, choosing the control mode and the speed reference, setting minimum and maximum frequency, ramps, current limit and stop mode — and understanding the faults (overcurrent, overvoltage, overload) that tell you a setting does not match the machine.',
  keywords: ['VFD parameters', 'commissioning', 'motor data', 'nameplate', 'auto-tune', 'acceleration time', 'deceleration time', 'ramp', 'S-curve', 'current limit', 'minimum frequency', 'maximum frequency', 'stop mode', 'coast', 'skip frequency', 'flying start', 'automatic restart', '4-20 mA', '0-10 V', 'two-wire', 'three-wire', 'fault codes', 'overcurrent', 'overvoltage'],
  prereq: ['vfd-principle', 'v-over-f-control', 'nameplate-reading'],
  related: ['vector-control-vfd', 'vfd-braking', 'motor-protection', 'motion-profiles', 'inertia-reflected', 'emergency-stop'],
  body: `
A drive out of the box assumes a generic motor and a generic machine. Most drive trouble on site comes from a handful of parameters left at their defaults. The order that works:

1. **Check the wiring and safety first** — supply, motor cable and screen, PE, STO and emergency stop circuits (see [[vfd-wiring-emc]]).
2. **Motor data** from the nameplate, *for the connection actually used*: a 230 Δ / 400 Y motor in star on a 400 V drive is entered as 400 V and the star current. Rated power, voltage, current, frequency, speed and cos φ feed the motor model and the motor's thermal protection.
3. **Auto-tune** (identification): at standstill the drive measures the stator resistance and leakage inductance with test pulses; a rotating tune, with the load uncoupled, also finds the magnetising current. Essential for vector control, helpful for V/f.
4. **Control mode**: V/f (linear or quadratic), sensorless vector or closed loop (see [[v-over-f-control]] and [[vector-control-vfd]]).
5. **Commands and reference**: start/stop from the keypad, terminals or a fieldbus; speed from the keypad, a potentiometer (0–10 V), a 4–20 mA loop or preset speeds.
6. **Limits, ramps and stop mode**, then the application functions — and finally a test run and a saved copy of the parameters.

| Parameter | What it does | Typical setting |
|---|---|---|
| Minimum frequency | lowest speed any reference can ask for | 0 Hz for conveyors; 20–30 Hz for pumps (to hold pressure and keep submersibles cooled) |
| Maximum frequency | highest speed | 50 Hz, or up to the motor's and machine's limit |
| Acceleration time | time from 0 to the reference frequency (often the maximum) | 1–10 s on small machines, 30–120 s on large fans |
| Deceleration time | the same, downwards | as short as braking allows (see [[vfd-braking]]) |
| S-curve | rounds the ends of the ramp | 0.1–1 s, for smooth handling of products and people |
| Current limit | caps the motor current by stretching the ramp | 150 % (heavy duty), about 110 % (normal duty) |
| Motor overload | the drive's thermal model of the motor, or a PTC input | from the motor data |
| Switching frequency | motor noise against drive losses | 4 kHz default; 8–16 kHz quieter, with derating |
| Stop mode | ramp to stop, or coast (inverter off) | ramp for conveyors; coast for fans |
| Skip frequencies | bands the drive will not dwell in | around a mechanical resonance, 1–4 Hz wide |
| Flying start | catches a load that is already turning | on for fans that windmill |
| Automatic restart | restarts after a trip or a supply dip | only where a restart cannot hurt anyone |

### Ramps and the current limit
Accelerating a load takes torque on top of what the load needs — the inertia times the [[?derivative|rate of change]] of speed:

$$T = \\frac{J\\,\\omega}{t_{acc}} + T_L$$

If that exceeds what the current limit allows, the drive holds the ramp until the motor catches up (stall prevention) — or, if that is off or the step too sudden, trips on **overcurrent**. Big fans are the classic case: the fan torque is largest at the top of the ramp, just when a linear ramp still demands full acceleration. Watch out for the ramp definition: many drives count the time from 0 to the *maximum* frequency, so the time to any other speed is $t = t_r f/f_{max}$.

Decelerating turns the motor into a generator, and the energy climbs into the DC bus. Too short a deceleration time on a high-inertia load trips the drive on **overvoltage**, unless its overvoltage controller stretches the ramp, or a brake resistor takes the energy.

### Two-wire or three-wire
With **two-wire** control a maintained contact means "run": after a power cut the drive restarts by itself as soon as the supply returns. **Three-wire** control uses momentary start and stop buttons and latches inside the drive, like a contactor's seal-in: after a power cut it stays stopped. Choose deliberately — an automatic restart must be justified by the machine's risk assessment (IEC 60204-1).

| Fault | Typical cause | Remedy |
|---|---|---|
| Overcurrent during acceleration | ramp too short, boost too high, motor data wrong | longer ramp, less boost, auto-tune |
| Overcurrent at start or at any time | short circuit or earth fault in cable or motor; long cable charging currents | insulation test; output reactor |
| Overvoltage during deceleration | ramp too short for the inertia, overhauling load | longer ramp, overvoltage control, brake resistor |
| Undervoltage | supply dip, loose supply connection, a phase missing | check the supply |
| Motor overload | real overload, low-speed operation without cooling, wrong motor current entered | check the load and motor data |
| Drive overtemperature | clogged heat sink, dead fan, hot cabinet | clean, ventilate, derate |

**In the simulation** set the ramps and current limit on a heavy fan, press *Run* and *Stop*, and watch the frequency, the current and the DC bus. Shorten the acceleration until the current limit stretches the ramp; shorten the deceleration until the bus hits the overvoltage trip; switch on overvoltage control and see the ramp stretch instead.

> [!warn] Parameters decide how a machine moves. Change them only with the machine safe, test at low speed first, and keep people clear during auto-tunes that rotate the motor. A drive's stop command is not an emergency stop and "off" on the keypad is not isolation: use the STO function and the emergency-stop circuit for safety, and isolate the supply before work.

> [!key] Enter the motor data for the connection used, auto-tune, then set limits, ramps and stop mode to suit the load: a ramp too short for the inertia gives overcurrent on the way up and overvoltage on the way down.
`,
  ideas: [
    'Enter the nameplate data for the connection actually used, then auto-tune.',
    'The torque a ramp needs is Jω/t plus the load torque; the current limit stretches a ramp that asks for too much.',
    'Deceleration faster than losses and braking can absorb raises the DC bus to an overvoltage trip.',
    'Ramp times are often defined from 0 to maximum frequency: the time to reach f is t_r × f/f_max.',
    'Three-wire control, like a contactor seal-in, prevents an automatic restart after a power cut; two-wire does not.'
  ],
  pitfalls: [
    'The motor data only matter for vector control — The drive\'s motor overload protection, slip compensation and boost all use them too; a wrong rated current leaves the motor unprotected.',
    'A shorter ramp always gives a faster machine — Past the current limit the drive stretches the ramp anyway, or trips; the achievable ramp is set by torque and inertia.',
    'The keypad stop button makes the machine safe — It is an operating command; safety needs the STO function, the emergency stop and isolation.'
  ],
  formulas: [
    {
      name: 'Torque needed for a ramp',
      expr: 'T = J*w/t + TL', tex: 'T = \\dfrac{J\\,\\omega}{t_{acc}} + T_L',
      vars: {
        T: { name: 'motor torque during the ramp', q: 'torque', unit: 'N·m' },
        J: { name: 'total inertia at the motor shaft', q: 'inertia', unit: 'kg·m²', value: 6 },
        w: { name: 'speed reached', q: 'angvel', unit: 'rpm', value: 1465, tex: '\\omega' },
        t: { name: 'acceleration time', q: 'time', unit: 's', value: 20, tex: 't_{acc}' },
        TL: { name: 'load torque (at the end of the ramp, for a fan)', q: 'torque', unit: 'N·m', value: 60, tex: 'T_L' }
      },
      note: 'Compare the result with the current limit (150 % of rated torque for a heavy-duty drive, roughly).',
      stories: { T: 'A load of {J} is accelerated to {w} in {t} against {TL}. What torque must the motor give?', t: 'A motor can give {T} to accelerate {J} against {TL}. What is the shortest ramp to {w}?' }
    },
    {
      name: 'Actual ramp time to a set-point',
      expr: 't = tr*f/fm', tex: 't = t_r\\,\\dfrac{f}{f_{max}}',
      vars: {
        t: { name: 'time to reach the set-point', q: 'time', unit: 's' },
        tr: { name: 'ramp time parameter (0 to maximum frequency)', q: 'time', unit: 's', value: 10, tex: 't_r' },
        f: { name: 'set-point frequency', q: 'frequency', unit: 'Hz', value: 30 },
        fm: { name: 'maximum (reference) frequency', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_{max}' }
      },
      note: 'For drives that define the ramp from 0 to the maximum frequency; check the manual — some use the base frequency.',
      stories: { t: 'A drive\'s acceleration time is {tr} from 0 to {fm}. How long does it take to reach {f}?' }
    },
    {
      name: 'Shortest linear ramp within the current limit',
      expr: 'tm = J*w/(Tl - TL)', tex: 't_{min} = \\dfrac{J\\,\\omega}{T_{cl} - T_L}',
      vars: {
        tm: { name: 'shortest acceleration time', q: 'time', unit: 's', tex: 't_{min}' },
        J: { name: 'total inertia at the motor shaft', q: 'inertia', unit: 'kg·m²', value: 6 },
        w: { name: 'speed reached', q: 'angvel', unit: 'rpm', value: 1465, tex: '\\omega' },
        Tl: { name: 'torque at the current limit', q: 'torque', unit: 'N·m', value: 107.6, tex: 'T_{cl}' },
        TL: { name: 'largest load torque during the ramp', q: 'torque', unit: 'N·m', value: 60, tex: 'T_L' }
      },
      note: 'A linear ramp asks for the same acceleration all the way, so the worst point (for a fan, the top) sets the limit.',
      stories: { tm: 'A drive\'s current limit allows {Tl}; the load needs up to {TL} and has {J}. What is the shortest linear ramp to {w}?' }
    }
  ],
  examples: [
    {
      title: 'Ramping a heavy fan',
      q: 'An 11 kW, 1465 rpm motor (rated 71.7 N·m) on a heavy-duty drive (current limit 150 %) drives a fan of 6 kg·m² that needs 60 N·m at full speed. Is a 10 s acceleration possible? What is the shortest linear ramp?',
      steps: [
        '$\\omega = 1465 \\times 2\\pi/60 = 153.4$ rad/s; a 10 s ramp needs $J\\alpha = 6 \\times 15.34 = 92$ N·m of accelerating torque.',
        'At the top the fan adds 60 N·m: $152$ N·m = 2.1 × rated. The limit gives $1.5 \\times 71.7 = 107.6$ N·m, so the drive stretches the ramp (or trips on overcurrent if stall prevention is off).',
        'Shortest linear ramp: $t_{min} = 6 \\times 153.4/(107.6 - 60) = 19.3$ s. Set 20–25 s, or use an S-curve that eases off near the top.'
      ],
      a: 'No: about 20 s is the shortest ramp that stays within 150 % current.'
    },
    {
      title: 'A pump on a 4–20 mA loop',
      q: 'A pump drive gets its speed from a 4–20 mA pressure controller, scaled so that 4 mA is the minimum frequency of 25 Hz and 20 mA is 50 Hz. What frequency does 12 mA give, and how long does the 10 s (0–50 Hz) ramp take from standstill to that speed?',
      steps: [
        '12 mA is $(12 - 4)/16 = 50$ % of the span: $25 + 0.5 \\times 25 = 37.5$ Hz.',
        '$t = 10 \\times 37.5/50 = 7.5$ s.'
      ],
      a: '37.5 Hz, reached in 7.5 s.'
    }
  ],
  quiz: [
    { q: 'A 230 V Δ / 400 V Y motor is connected in star to a 400 V drive. Which motor data are entered?', choices: ['400 V and the star (smaller) current', '230 V and the delta current', '400 V and the delta current', '230 V and the star current'], a: 0, why: 'Enter the voltage and current of the connection actually used; the model and the thermal protection depend on it.' },
    { q: 'A large fan trips on overvoltage every time it is stopped. The most likely cause?', choices: ['The deceleration time is too short for its inertia, and there is no brake resistor', 'The acceleration time is too long', 'The motor is too small', 'The switching frequency is too low'], a: 0, why: 'A fast deceleration makes the motor a generator; the energy lifts the DC bus to its trip level.' },
    { q: 'A drive\'s ramp is 10 s from 0 to its 50 Hz maximum. How long does it take to reach 30 Hz?', choices: ['6 s', '10 s', '3 s', '16.7 s'], a: 0, why: 'The slope is 5 Hz/s, so 30 Hz takes 6 s.' },
    { q: 'Which control wiring keeps a machine stopped when power returns after a cut?', choices: ['Three-wire (momentary start and stop, latched in the drive)', 'Two-wire (a maintained run contact)', 'Either', 'Neither'], a: 0, why: 'Three-wire latches like a contactor seal-in and drops out on power loss; a maintained two-wire run contact restarts the drive.' },
    { q: 'Why do pump drives often have a minimum frequency of 20–30 Hz?', choices: ['Below it the pump cannot overcome the static head and delivers nothing (and submersibles lose cooling)', 'The motor cannot turn more slowly', 'The DC bus would collapse', 'To reduce harmonics'], a: 0, why: 'A pump\'s head falls with the square of speed; below some speed it only churns against the static head.' }
  ],
  problems: [
    { q: 'A load of 2 kg·m² is accelerated to 1470 rpm in 5 s against a load torque of 20 N·m. What motor torque is needed?', answer: 81.6, unit: 'N·m', tol: 0.02, steps: ['$\\omega = 1470 \\times 2\\pi/60 = 153.9$ rad/s.', '$T = 2 \\times 153.9/5 + 20 = 61.6 + 20 = 81.6$ N·m.'] },
    { q: 'A drive scales 4–20 mA to 0–50 Hz. What frequency does 8 mA give?', answer: 12.5, unit: 'Hz', tol: 0.01, steps: ['$(8 - 4)/16 = 0.25$ of the span.', '$0.25 \\times 50 = 12.5$ Hz.'] }
  ],
  choose: {
    good: [
      'Coast to stop for fans and other loads that may simply run down; ramp to stop for conveyors and machines that must stop in place.',
      'S-curves where products, liquids or people are moved; skip frequencies where a structure resonates.',
      'Three-wire control and manual restart wherever an unexpected restart could hurt someone.'
    ],
    avoid: [
      'Leaving motor data, current limit and overload settings at their defaults.',
      'Ramps shorter than the inertia and the current limit allow — they only turn into trips.',
      'Automatic restart on machines people can reach.'
    ],
    check: [
      'Motor data for the connection used, and an auto-tune (rotating if possible).',
      'Minimum and maximum frequency against the process and the machine\'s mechanical limits.',
      'Ramps against Jω/t + T_L and the current limit; deceleration against the braking available.',
      'The reference scaling (0–10 V, 4–20 mA), the start/stop logic, and a saved backup of the parameters.'
    ]
  },
  applications: [
    'Pumping stations: 4–20 mA pressure control, minimum frequency, sleep mode and pipe-fill ramps.',
    'Conveyors and packaging lines: S-curves, preset speeds and ramp-to-stop.',
    'Try ramps, V/f and parameters in [the VFD tool](#/tools/drives/vfd).'
  ],
  sources: [
    'IEC 61800-2, *Adjustable speed electrical power drive systems — General requirements — Rating specifications for low voltage adjustable speed AC power drive systems*: overload ratings and duty.',
    'IEC 61800-5-2, *Adjustable speed electrical power drive systems — Safety requirements — Functional*: safe torque off and other safety functions.',
    'IEC 60204-1, *Electrical equipment of machines*: restart after supply interruption, stop categories.',
    'Mohan, *Electric Drives: An Integrative Approach*: acceleration, load torque and inertia.'
  ],
  sim: 'sd-vfd-ramps'
},

{
  id: 'vfd-braking', parent: 'vfd-topic', title: 'Braking resistors and regeneration', level: 2,
  short: 'When a load drives the motor — a heavy fan slowing down, a hoist lowering, a conveyor running downhill — the motor generates and the energy flows back into the drive\'s DC bus. The diode rectifier cannot return it, so the bus voltage climbs. The drive can stretch the ramp, burn the energy in a brake resistor, inject DC to brake at low speed, or feed the energy back to the mains with a regenerative front end.',
  keywords: ['VFD braking', 'braking resistor', 'brake chopper', 'dynamic braking', 'regenerative braking', 'active front end', 'AFE', 'DC injection braking', 'flux braking', 'overvoltage', 'overhauling load', 'kinetic energy', 'common DC bus', 'regeneration'],
  prereq: ['vfd-principle', 'vfd-parameters', 'physics:rotational-kinetic-energy'],
  related: ['motor-brakes', 'dc-braking', 'motors-conveyors-hoists', 'motor-generator-duality', 'emergency-stop'],
  body: `
Slow a motor faster than its load would coast, or let the load pull it along, and the rotor turns faster than the rotating field: the slip becomes negative and the motor becomes a generator ([[motor-generator-duality]]). Its power flows back through the inverter's freewheeling diodes into the DC bus. The input diode bridge can only pass energy one way, so the capacitors charge and the bus voltage rises — from 540 V to the **overvoltage trip**, typically somewhere around 800–850 V on a 400 V drive. The capacitors themselves hold very little: a drive's DC link can absorb a few hundred joules, while a big fan at full speed stores tens of kilojoules — energy that grows with the [[?exponent|square]] of the speed:

$$E = \\tfrac12 J\\left(\\omega_1^2 - \\omega_2^2\\right), \\qquad P = T\\,\\omega$$

### The options
| Method | How | Braking power | Energy goes to | Typical use |
|---|---|---|---|---|
| Longer ramp / overvoltage control | the drive stretches the deceleration to keep the bus below the trip | whatever the losses absorb, roughly 10–20 % of rated | motor and drive losses | fans, pumps: a slower stop is fine |
| Flux (overexcitation) braking | raises the motor flux while braking | somewhat more | motor heating | occasional faster stops |
| Brake chopper + resistor | a transistor switches a resistor across the bus above about 750–800 V (400 V drives) | up to the drive's rating and more | heat in the resistor | high-inertia stops, short cycles, hoists |
| DC injection | direct current in two phases makes a stationary field | strong only at low speed | heat in the rotor | stopping the last few hertz, brief holding at the end of a ramp |
| Regenerative (active front end) | an IGBT rectifier feeds the energy back to the mains | full | the mains | cranes, lifts, test benches, downhill conveyors, centrifuges |
| Common DC bus | drives share their DC link | as needed | other motoring drives | winders and unwinders, multi-axis lines |

### Sizing a brake resistor
The chopper switches the resistor across the bus at its threshold voltage $V$, so the most power the resistor can take is $V^2/R$. That sets a **maximum** resistance for the peak braking power, $R \\le V^2/P_{peak}$; the chopper transistor sets a **minimum** resistance (in the drive's manual) that it must not go below. The resistor's continuous rating comes from the energy per stop and how often it stops: its thermal mass absorbs each stop, its surface sheds the average. Resistors reach several hundred degrees: they go outside the cabinet or in their own ventilated housing, away from anything combustible, with a **thermal switch** wired to stop the drive — a chopper transistor that fails short would otherwise heat the resistor without limit.

### DC injection and regeneration
DC in the stator makes a field that stands still; the rotor, turning through it, carries induced currents that brake it, and all the energy is dissipated in the rotor. The braking torque is strong at a few per cent of speed and weak near full speed — so drives use DC braking for the last few hertz of a ramp or for a few seconds of holding, typically at 50–100 % of rated current. It gives no holding torque at standstill and heats the motor.

A **regenerative front end** replaces the diode bridge with a second IGBT bridge and a line filter. It returns braking energy to the mains at a near-sinusoidal current (with low harmonics as a bonus) — worth its higher price where braking is frequent or continuous: a hoist lowering 1000 kg at 0.5 m/s generates about 4.9 kW for as long as it descends.

**In the simulation** stop a heavy fan with each method. Without a resistor the bus climbs to the trip, or the drive stretches the ramp; with a resistor watch the chopper switch and the resistor warm; try DC injection from full speed and from 5 Hz; and see how much energy a regenerative front end returns.

> [!warn] Brake resistors get hot enough to burn and to ignite dust — mount them where nothing can touch them and wire their thermal switch. Electrical braking (resistor, DC injection, regeneration) needs the drive and the supply to work; loads that could fall or run away need a mechanical brake and safety functions designed to ISO 13849-1 and IEC 61800-5-2.

> [!key] Braking energy is ½ J ω² (or m g h); the drive can only absorb it by stretching the stop, burning it in a resistor (R ≤ V²/P_peak), braking with DC at low speed, or returning it to the mains.
`,
  ideas: [
    'A motor slowed faster than it would coast, or driven by its load, generates power into the DC bus.',
    'The diode rectifier cannot return that energy; the bus rises to an overvoltage trip unless something absorbs it.',
    'A brake chopper switches a resistor across the bus; R ≤ V²/P_peak and never below the drive\'s minimum.',
    'DC injection brakes strongly only at low speed and does not hold at standstill.',
    'A regenerative front end returns the energy to the mains — worth it for frequent or continuous braking.'
  ],
  pitfalls: [
    'DC injection is a holding brake — It gives no torque at standstill; loads that must be held need a mechanical brake.',
    'A larger resistance absorbs more energy — A larger resistance takes less power (V²/R) at the chopper voltage; too large and the bus still climbs to the trip.',
    'The DC-link capacitors can soak up the braking energy — They hold a few hundred joules; a large fan stores tens of kilojoules.'
  ],
  formulas: [
    {
      name: 'Kinetic energy to remove',
      expr: 'E = J*(w1^2 - w2^2)/2', tex: 'E = \\tfrac12 J\\left(\\omega_1^2 - \\omega_2^2\\right)',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'kJ' },
        J: { name: 'total inertia at the motor shaft', q: 'inertia', unit: 'kg·m²', value: 6 },
        w1: { name: 'initial speed', q: 'angvel', unit: 'rpm', value: 1465, tex: '\\omega_1' },
        w2: { name: 'final speed', q: 'angvel', unit: 'rpm', value: 300, tex: '\\omega_2' }
      },
      stories: { E: 'A load of {J} is slowed from {w1} to {w2}. How much energy must go somewhere?' }
    },
    {
      name: 'Braking power',
      expr: 'P = T*w', tex: 'P = T\\,\\omega',
      vars: {
        P: { name: 'braking power', q: 'power', unit: 'kW' },
        T: { name: 'braking torque', q: 'torque', unit: 'N·m', value: 92 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 1465, tex: '\\omega' }
      },
      note: 'Largest at the start of a stop from full speed with constant deceleration torque.',
      stories: { P: 'A motor brakes with {T} at {w}. How much power flows back into the drive?' }
    },
    {
      name: 'Largest brake resistance for a peak power',
      expr: 'R = V^2/P', tex: 'R = \\dfrac{V_{ch}^2}{P_{peak}}',
      vars: {
        R: { name: 'brake resistance (maximum)', q: 'resistance', unit: 'Ω' },
        V: { name: 'chopper switching voltage', q: 'voltage', unit: 'V', value: 760, tex: 'V_{ch}' },
        P: { name: 'peak braking power', q: 'power', unit: 'kW', value: 14.1, tex: 'P_{peak}' }
      },
      note: 'Choose a resistance at or below this value but not below the drive\'s stated minimum.',
      stories: { R: 'A chopper switches at {V} and must absorb {P}. What is the largest resistance that will do?', P: 'A {R} resistor is switched across a {V} bus. How much power does it take?' }
    },
    {
      name: 'Energy the DC-link capacitors can take',
      expr: 'Ec = C*(V2^2 - V1^2)/2', tex: 'E_C = \\tfrac12 C\\left(V_2^2 - V_1^2\\right)',
      vars: {
        Ec: { name: 'energy absorbed by the capacitors', q: 'energy', unit: 'J', tex: 'E_C' },
        C: { name: 'DC-link capacitance', q: 'capacitance', unit: 'mF', value: 1.1 },
        V2: { name: 'bus voltage at the overvoltage trip', q: 'voltage', unit: 'V', value: 800, tex: 'V_2' },
        V1: { name: 'bus voltage before braking', q: 'voltage', unit: 'V', value: 560, tex: 'V_1' }
      },
      stories: { Ec: 'A drive has {C} of bus capacitance at {V1}; it trips at {V2}. How much braking energy can the capacitors take?' }
    }
  ],
  examples: [
    {
      title: 'A brake resistor for a fan',
      q: 'The 6 kg·m² fan of the parameters page (1465 rpm) must stop in 10 s, once every 2 minutes. The chopper switches at 760 V. Find the energy per stop, the peak braking power, the largest resistance and the average power (neglect the fan\'s own drag, which only helps).',
      steps: [
        '$E = \\tfrac12 \\times 6 \\times 153.4^2 = 70.6$ kJ per stop.',
        'Constant deceleration: $T = J\\alpha = 6 \\times 153.4/10 = 92$ N·m; peak power at the start $92 \\times 153.4 = 14.1$ kW.',
        '$R \\le 760^2/14\\,100 = 41$ Ω; choose, say, 39 Ω if the drive\'s minimum is lower.',
        'Average $70.6/120 = 0.59$ kW: a resistor rated about 1 kW continuous whose thermal mass takes the 14 kW peaks — or check the maker\'s duty-cycle tables.'
      ],
      a: '70.6 kJ per stop, 14.1 kW peak, at most 41 Ω, about 0.6 kW average.'
    },
    {
      title: 'What the DC bus can hold',
      q: 'The drive has 1.1 mF of bus capacitance at 560 V and trips at 800 V. What fraction of the fan\'s 70.6 kJ can the capacitors take?',
      steps: ['$E_C = \\tfrac12 \\times 1.1 \\times 10^{-3} \\times (800^2 - 560^2) = 180$ J.', '$180/70\\,600 = 0.25$ %.'],
      a: 'About 180 J — a quarter of one per cent.'
    },
    {
      title: 'A hoist lowering its load',
      q: 'A hoist lowers 1000 kg at 0.5 m/s for 30 % of an 8-hour shift. How much power does it regenerate, and how much energy per shift could a regenerative front end return (efficiency about 85 % from rope to mains)?',
      steps: ['$P = m g v = 1000 \\times 9.81 \\times 0.5 = 4.9$ kW while lowering.', 'Energy $4.9 \\times 8 \\times 0.3 = 11.8$ kWh; returned about $0.85 \\times 11.8 = 10$ kWh per shift.'],
      a: 'About 4.9 kW while lowering; roughly 10 kWh per shift returned instead of burnt.'
    }
  ],
  quiz: [
    { q: 'A drive with no brake resistor tries to stop a large fan in 3 s. What happens?', choices: ['The DC bus rises to the overvoltage trip (or the drive stretches the ramp)', 'The motor draws a huge current from the mains', 'The fan stops in 3 s anyway', 'The rectifier returns the energy to the mains'], a: 0, why: 'The motor generates into the bus; the diode bridge cannot pass it back.' },
    { q: 'Why is DC injection braking weak at full speed?', choices: ['The rotor currents are at high frequency, where the rotor\'s reactance limits them; the torque peaks at a few per cent of speed', 'The DC current is too small at high speed', 'The drive switches it off above 10 Hz', 'The fan blows it away'], a: 0, why: 'DC braking behaves like a motor with a stationary field: the "slip" is the whole speed, far beyond the breakdown slip, so the torque is small until the rotor has slowed.' },
    { q: 'A brake resistor of too high a resistance…', choices: ['cannot absorb the peak power, so the bus still trips on overvoltage', 'absorbs more power', 'overloads the chopper transistor', 'makes no difference'], a: 0, why: 'At the chopper voltage it takes V²/R: more ohms, less power.' },
    { q: 'DC injection braking can hold a hoist load at standstill.', a: false, why: 'At standstill a stationary field induces nothing in a stationary rotor: no torque. Holding needs a mechanical brake.' },
    { q: 'Where does braking energy go with an active front end?', choices: ['Back to the mains', 'Into a resistor', 'Into the motor windings', 'Into the capacitors, permanently'], a: 0, why: 'The IGBT rectifier can pass power both ways and returns it to the supply at near-sinusoidal current.' }
  ],
  problems: [
    { q: 'A rotor and load of 0.5 kg·m² turning at 3000 rpm are stopped. How much energy is released?', answer: 24.7, unit: 'kJ', tol: 0.02, steps: ['$\\omega = 3000 \\times 2\\pi/60 = 314.2$ rad/s.', '$E = \\tfrac12 \\times 0.5 \\times 314.2^2 = 24\\,670$ J = 24.7 kJ.'] },
    { q: 'A brake chopper switches at 760 V and must absorb a peak of 20 kW. What is the largest resistance that will do?', answer: 28.9, unit: 'Ω', tol: 0.02, steps: ['$R = 760^2/20\\,000 = 577\\,600/20\\,000 = 28.9$ Ω.'] }
  ],
  choose: {
    good: [
      'Brake chopper and resistor: occasional fast stops of high-inertia loads, short machine cycles, small hoists.',
      'Regenerative front end or common DC bus: frequent or continuous braking — cranes, lifts, test benches, downhill conveyors, centrifuges, winders.',
      'Overvoltage control (a stretched ramp): fans and pumps whose stop time does not matter.'
    ],
    avoid: [
      'DC injection as a holding brake, or to stop high-inertia loads from full speed.',
      'Brake resistors inside a sealed cabinet or near combustible material.',
      'Relying on any electrical braking for safety: loads that can fall need a mechanical brake.'
    ],
    check: [
      'Energy per stop (½ J ω², m g h) and stops per hour; the peak power at the start of braking.',
      'Resistance between the drive\'s minimum and V²/P_peak; continuous and peak power ratings; a thermal switch wired to the drive.',
      'Whether the drive has a built-in chopper, and its overvoltage trip level.',
      'The price of energy and the braking duty, to judge a regenerative front end.'
    ]
  },
  applications: [
    'Centrifuges and large fans: brake resistors or regeneration to stop tonnes of rotating mass in minutes instead of an hour.',
    'Cranes, lifts and elevators: regenerative drives return lowering energy to the building.',
    'Machine tools and packaging machines: brake resistors for fast, frequent stops.'
  ],
  sources: [
    'IEC 61800-2, *Adjustable speed electrical power drive systems — General requirements — Rating specifications for low voltage adjustable speed AC power drive systems*.',
    'Hughes and Drury, *Electric Motors and Drives*: regenerative braking, braking resistors and the four quadrants of operation.',
    'Mohan, *Electric Drives: An Integrative Approach*: four-quadrant operation and regeneration.',
    'ISO 13849-1, *Safety of machinery — Safety-related parts of control systems*; IEC 61800-5-2 for drive safety functions.'
  ],
  sim: 'sd-vfd-braking'
},

{
  id: 'vfd-wiring-emc', parent: 'vfd-topic', title: 'VFD wiring, EMC and bearing currents', level: 3,
  short: 'A drive switches hundreds of volts in a fraction of a microsecond thousands of times a second. The fast edges push high-frequency currents through every stray capacitance — into the earth, into neighbouring cables, through the motor\'s bearings — and bounce back and forth along long motor cables; the rectifier draws harmonic currents from the mains. Shielded symmetrical cable, 360° bonding, chokes and filters keep it all in check.',
  keywords: ['EMC', 'EMI', 'shielded motor cable', 'screen bonding', '360 degree', 'grounding', 'earthing', 'IEC 61800-3', 'C1 C2 C3', 'leakage current', 'RCD type B', 'IT network', 'harmonics', 'THD', 'line reactor', 'DC choke', 'dv/dt', 'reflected wave', 'cable length', 'dv/dt filter', 'sine filter', 'bearing currents', 'EDM', 'fluting', 'common-mode voltage', 'insulated bearing', 'shaft grounding ring'],
  prereq: ['vfd-principle', 'electronics:spectrum-harmonics', 'bearings-motors'],
  related: ['vfd-parameters', 'bearing-failures', 'motor-noise', 'motor-failures', 'insulation-classes', 'electronics:power-factor-correction', 'electronics:three-phase', 'math:fourier-series'],
  body: `
Each IGBT edge swings a motor terminal by the whole DC bus, 540 V, in 0.05–0.5 µs: a $dv/dt$ of several kV/µs. Through a capacitance $C$ that drives a current $i = C\\,dv/dt$ — and a motor cable is a long capacitor to earth, a winding is a capacitor to the frame, a rotor is a capacitor to the stator. On the supply side the diode rectifier draws current in pulses. Four problems follow, each with its standard cure.

### 1. Keep the high-frequency current in its own loop (EMC)
The high-frequency currents want to return to the drive by the shortest path. Give them one — the motor cable's screen — or they find others: the building's steel, signal cables, the mains.

| Item | Good practice |
|---|---|
| Motor cable | symmetrical shielded cable: three phase conductors with a concentric screen (and symmetrical PE conductors) |
| Screen | bonded all round (360°) at both ends — EMC glands at the motor, clamps on the drive's plate; no long "pigtails" |
| Earthing | motor PE back to the drive's PE; drive to the cabinet PE bar; a bare galvanised mounting plate with the drive and filter bonded to it |
| Separation | motor cables 0.3 m or more from signal cables, crossing at right angles |
| Signals | shielded, screens bonded at the drive; 4–20 mA preferred to 0–10 V over long runs |
| Output contactor | switched only while the drive is stopped or inhibited |
| Capacitors | never on the drive output |

**IEC 61800-3** sets emission limits by category: **C1** for drives used in residential areas (the "first environment"), **C2** for fixed installations there by professionals, **C3** for industrial networks (the "second environment"), **C4** for very large or special systems. Built-in or added **RFI filters** meet them, but their capacitors to earth leak tens of milliamperes (more with long cables): use a **type B** residual-current device where one is needed (a three-phase drive can cause smooth DC fault currents), rated for the leakage, and disconnect the filter's earth capacitors on unearthed **IT networks**.

### 2. Harmonics on the mains
A six-pulse rectifier draws current only near the voltage peaks, so its input current contains [[?fourier|harmonics]] of orders $6k \\pm 1$ — the 5th (250 Hz), 7th, 11th, 13th… Without any choke the total harmonic distortion of the current is often 80 % or more; a **3–4 % line reactor** or a **DC choke** brings it to roughly 35–45 %; 12- and 18-pulse rectifiers, active filters and **active front ends** reach single figures. Harmonics heat transformers and cables, distort the voltage for everyone, and can excite resonance in power-factor capacitor banks (detuned banks with reactors avoid it). Equipment limits are in IEC 61000-3-2 and -3-12; the limits at the connection to the utility in IEEE 519 and local rules. The rms current, which sizes cables and fuses, is $I = I_1\\sqrt{1 + \\mathrm{THD}^2}$.

### 3. Long cables: reflected waves and charging currents
A motor cable is a transmission line with a surge impedance $Z_c$ of tens of ohms; a motor's surge impedance $Z_m$ is hundreds of ohms to kilo-ohms. A pulse reaching the motor reflects with $\\Gamma = (Z_m - Z_c)/(Z_m + Z_c)$, about 0.8–0.95, so the motor terminals see up to $(1 + \\Gamma)$ times the bus — about **1000–1100 V on a 400 V drive**, more with ringing. Full reflection happens once the pulse's rise time is shorter than the cable's round trip: beyond the **critical length** $l_c = v\\,t_r/2$, with $v$ ≈ 150–180 m/µs, which for fast IGBTs is only 10–20 m. Motors built for converter duty (IEC TS 60034-25, NEMA MG 1 Part 31) withstand such peaks; older motors, and motors on 500–690 V, may not. The cable's capacitance also takes a current spike at every edge — 10 nF at 3 kV/µs is 30 A — which heats the drive and trips small drives on overcurrent; manuals give maximum cable lengths. **Output reactors** slow the edges, **dv/dt filters** limit them to a few hundred V/µs, **sine filters** remove the pulses altogether (for very long cables, old motors, step-up transformers).

### 4. Bearing currents
The three PWM outputs never add up to zero: their common point jumps in steps of $V_{dc}/3$. This **common-mode voltage** couples through the stator-to-rotor capacitance onto the shaft, and when the shaft voltage exceeds what the bearing's lubricant film can insulate — a few volts to some tens of volts — it discharges through the balls and races. Each spark melts a microscopic crater (**EDM**); millions of them frost the race and then cut regular grooves across it, **fluting** — a washboard that whines and destroys the bearing, sometimes within months. Large motors (above about 100 kW) also suffer circulating currents around the shaft and frame. Cures: symmetrical shielded cable and good high-frequency earthing first; an **insulated bearing** at the non-drive end on larger motors; a **shaft grounding ring** or brush; hybrid bearings with ceramic balls; common-mode cores or filters on the drive output.

| Symptom | Likely cause | Remedy |
|---|---|---|
| RCD trips when the drive runs | filter and cable leakage; wrong RCD type | type B RCD with a suitable rating; shorter cable |
| Sensors, encoders or 4–20 mA signals disturbed | unscreened or badly bonded motor cable; signals run alongside | 360° screen bonding, separation, shielded signals |
| Drive trips on overcurrent with a long cable | cable charging currents | output reactor; follow the length limit |
| Motor insulation fails on a drive | reflected-wave peaks on a long cable | converter-duty motor, dv/dt or sine filter |
| Motor bearings whine after months | EDM and fluting from shaft voltage | earthing, insulated bearing, grounding ring, CM filter |
| Transformer hot, capacitor bank failing | harmonics, resonance | line reactors, detuned capacitors, filters |

**In the simulation** lengthen the motor cable and watch the pulse at the motor terminals grow towards twice the bus voltage and ring; add a reactor, a dv/dt filter or a sine filter. Then watch the common-mode voltage step, the shaft voltage build and the bearing spark — until a grounding ring or insulated bearing stops it.

> [!warn] The motor cable, its screen and the filters carry lethal voltages and leakage currents while the drive is powered; a missing PE connection can leave a motor frame live through the filter capacitors. Wiring and earthing are for qualified electricians and follow the drive manual, IEC 60204-1 and local rules; measure only with the drive isolated and its DC bus discharged.

> [!key] Give the high-frequency currents a path — symmetrical shielded cable bonded 360° at both ends and a solid PE — choke the harmonics on the input, respect cable lengths or filter the output, and protect bearings on larger motors.
`,
  ideas: [
    'Fast IGBT edges (several kV/µs) drive high-frequency currents through every stray capacitance: i = C dv/dt.',
    'Symmetrical shielded motor cable bonded 360° at both ends gives those currents a controlled path back to the drive.',
    'A six-pulse rectifier draws 5th, 7th, 11th… harmonics; a 3–4 % reactor or DC choke roughly halves the distortion.',
    'Beyond the critical length v·t_r/2 (10–20 m for fast IGBTs) the pulse at the motor can nearly double.',
    'The common-mode voltage charges the shaft and discharges through the bearings (EDM, fluting); insulated bearings, grounding rings and good earthing prevent it.'
  ],
  pitfalls: [
    'The motor cable screen should be earthed at one end only, like a signal screen — For motor cables the screen carries the high-frequency return current and must be bonded 360° at both ends.',
    'A longer cable only means a bit more voltage drop — On a drive it raises the reflected-wave peaks at the motor and the charging currents at the drive.',
    'Bearing failures on a drive-fed motor are just bad bearings — Frosted and fluted races point to electrical discharge; replacing the bearing without fixing the cause repeats the failure.'
  ],
  formulas: [
    {
      name: 'Critical cable length for reflections',
      expr: 'lc = v*tr/2', tex: 'l_c = \\dfrac{v\\,t_r}{2}',
      vars: {
        lc: { name: 'critical cable length', q: false, unit: 'm', tex: 'l_c' },
        v: { name: 'pulse speed in the cable', q: false, unit: 'm/µs', value: 170 },
        tr: { name: 'rise time of the voltage pulse', q: false, unit: 'µs', value: 0.1, tex: 't_r' }
      },
      note: 'Longer cables give (almost) full reflection at the motor.',
      stories: { lc: 'Pulses with a rise time of {tr} travel at {v} in a motor cable. Beyond what length does the pulse reflect fully at the motor?', tr: 'A {lc} cable carries pulses at {v}. How slow must the rise time be to keep it below the critical length?' }
    },
    {
      name: 'Reflection coefficient at the motor',
      expr: 'G = (Zm - Zc)/(Zm + Zc)', tex: '\\Gamma = \\dfrac{Z_m - Z_c}{Z_m + Z_c}',
      vars: {
        G: { name: 'reflection coefficient', tex: '\\Gamma', min: 0, max: 1 },
        Zm: { name: 'surge impedance of the motor', q: 'resistance', unit: 'Ω', value: 2000, tex: 'Z_m' },
        Zc: { name: 'surge impedance of the cable', q: 'resistance', unit: 'Ω', value: 80, tex: 'Z_c' }
      },
      stories: { G: 'A cable of surge impedance {Zc} feeds a motor of surge impedance {Zm}. What fraction of each pulse is reflected?' }
    },
    {
      name: 'Peak voltage at the motor terminals',
      expr: 'Vp = Vdc*(1 + G)', tex: 'V_{pk} = V_{dc}\\,(1 + \\Gamma)',
      vars: {
        Vp: { name: 'peak voltage at the motor (without ringing)', q: 'voltage', unit: 'V', tex: 'V_{pk}' },
        Vdc: { name: 'DC bus voltage', q: 'voltage', unit: 'V', value: 540, tex: 'V_{dc}' },
        G: { name: 'reflection coefficient', value: 0.923, tex: '\\Gamma', min: 0, max: 1 }
      },
      stories: { Vp: 'A {Vdc} drive feeds a long cable whose pulses reflect at the motor with Γ = {G}. What peak does the motor see?' }
    },
    {
      name: 'Charging current of a cable at each edge',
      expr: 'I = C*S', tex: 'I_{pk} = C\\,\\dot{v}',
      vars: {
        I: { name: 'peak charging current', q: 'current', unit: 'A', tex: 'I_{pk}' },
        C: { name: 'capacitance of the motor cable (conductor to screen)', q: 'capacitance', unit: 'nF', value: 10 },
        S: { name: 'rate of rise of the voltage, dv/dt', q: 'slewrate', unit: 'V/µs', value: 3000, tex: '\\dot{v}' }
      },
      stories: { I: 'A motor cable of {C} is switched at {S}. How large are the current spikes at each edge?' }
    },
    {
      name: 'RMS current with harmonics',
      expr: 'I = I1*sqrt(1 + THD^2)', tex: 'I = I_1\\sqrt{1 + \\mathrm{THD}^2}',
      vars: {
        I: { name: 'total rms input current', q: 'current', unit: 'A' },
        I1: { name: 'fundamental (50 Hz) current', q: 'current', unit: 'A', value: 45, tex: 'I_1' },
        THD: { name: 'total harmonic distortion of the current', q: 'ratio', unit: '%', value: 90, tex: '\\mathrm{THD}' }
      },
      stories: { I: 'A drive draws a fundamental current of {I1} with a current THD of {THD}. What rms current must its cable and fuses carry?' }
    }
  ],
  examples: [
    {
      title: 'How long is long?',
      q: 'A 400 V drive (540 V bus) switches with a rise time of 0.1 µs; pulses travel at 170 m/µs. The motor, 40 m away, has a surge impedance of 2 kΩ and the cable 80 Ω. Find the critical length and the peak at the motor.',
      steps: [
        '$l_c = 170 \\times 0.1/2 = 8.5$ m: the 40 m cable is well beyond it.',
        '$\\Gamma = (2000 - 80)/(2000 + 80) = 0.923$.',
        '$V_{pk} = 540 \\times 1.923 = 1038$ V, plus ringing on top.'
      ],
      a: 'About 8.5 m; the motor sees roughly 1040 V peaks — fine for a converter-duty motor, a risk for an old one.'
    },
    {
      title: 'Charging currents on a small drive',
      q: 'A 1.5 kW drive (rated 4 A) feeds a 50 m shielded cable with about 0.2 nF/m between conductor and screen. Its edges rise at 3 kV/µs. How large are the spikes?',
      steps: ['$C = 50 \\times 0.2 = 10$ nF.', '$I_{pk} = 10 \\times 10^{-9} \\times 3 \\times 10^{9} = 30$ A — over seven times the drive\'s rating, at every edge.'],
      a: 'About 30 A spikes: the drive may trip on overcurrent; an output reactor or a shorter cable is needed.'
    },
    {
      title: 'Harmonics and the fuse',
      q: 'A 30 kW drive draws a fundamental current of 45 A. Without a choke its current THD is 90 %; with a 3 % line reactor 40 %. What rms currents must the supply cable carry?',
      steps: ['Without: $45\\sqrt{1 + 0.81} = 60.5$ A.', 'With the reactor: $45\\sqrt{1 + 0.16} = 48.5$ A.'],
      a: '60.5 A without a choke, 48.5 A with one — a quarter less heating in the cable and transformer.'
    }
  ],
  quiz: [
    { q: 'How should the screen of a VFD motor cable be connected?', choices: ['Bonded all round (360°) at both the drive and the motor', 'At the drive end only', 'At the motor end only, with a pigtail', 'Not at all'], a: 0, why: 'The screen is the return path for the high-frequency currents; it must be continuous and bonded with low inductance at both ends.' },
    { q: 'Why can a VFD trip an ordinary AC residual-current device?', choices: ['Its filter and cable capacitances leak tens of mA, and faults can produce DC currents; a suitably rated type B RCD is needed', 'Because the drive draws too much power', 'Because the motor is too big', 'Because of the DC bus voltage'], a: 0, why: 'Leakage through Y-capacitors and cable capacitance adds up; three-phase drives can cause smooth DC fault current that blinds type AC and A devices.' },
    { q: 'What causes the voltage at the motor to reach nearly twice the DC bus on long cables?', choices: ['Reflection of the fast pulse at the motor\'s high surge impedance', 'The motor generating', 'The line reactor', 'Harmonics on the mains'], a: 0, why: 'The cable is a transmission line; at the high-impedance motor end the wave reflects and adds.' },
    { q: 'A drive-fed motor\'s bearing race shows regular washboard grooves. The likely cause?', choices: ['Electrical discharge through the bearing (fluting) from shaft voltage', 'Lack of grease', 'Misalignment', 'Overload'], a: 0, why: 'Fluting is the signature of repeated EDM discharges driven by the common-mode voltage.' },
    { q: 'Power-factor correction capacitors may be connected at a drive\'s output to improve the motor\'s power factor.', a: false, why: 'The PWM edges would drive enormous currents into them; the drive already draws near-unity displacement power factor.' }
  ],
  problems: [
    { q: 'Voltage pulses rise in 0.2 µs and travel at 160 m/µs in a motor cable. What is the critical cable length?', answer: 16, unit: 'm', tol: 0.01, steps: ['$l_c = v t_r/2 = 160 \\times 0.2/2 = 16$ m.'] },
    { q: 'A drive draws a fundamental current of 20 A with a current THD of 80 %. What is its rms input current?', answer: 25.6, unit: 'A', tol: 0.02, steps: ['$I = 20\\sqrt{1 + 0.8^2} = 20\\sqrt{1.64} = 25.6$ A.'] }
  ],
  choose: {
    good: [
      'Symmetrical shielded motor cable with 360° glands: every drive installation, and essential where EMC limits apply.',
      'Line reactor or DC choke: almost always — lower harmonics and rms current, better tolerance of supply spikes.',
      'Output reactor or dv/dt filter for long cables; sine filter for very long cables, old motors and step-up transformers.',
      'Insulated non-drive-end bearing or shaft grounding ring on larger motors (roughly 100 kW and up) and on critical machines.'
    ],
    avoid: [
      'Unscreened motor cable run alongside signal and data cables.',
      'Pigtail screen connections and painted mounting plates.',
      'Power-factor capacitors or unplanned contactor switching on the drive output.'
    ],
    check: [
      'The EMC category (C1–C3) required where the drive is installed, and the filter it needs.',
      'The maximum motor cable length in the drive manual, and the motor\'s peak-voltage withstand for converter duty.',
      'Earth-leakage current and the RCD type; the network type (TN, TT or IT).',
      'Harmonic limits at the connection point, and existing capacitor banks.'
    ]
  },
  applications: [
    'Hospitals, laboratories and buildings with sensitive electronics: C1/C2 filters, careful screening and separation.',
    'Pumps in deep wells and borehole motors on long cables: sine filters protect the motor insulation.',
    'Large fans and compressors: insulated bearings and grounding rings against fluting.'
  ],
  sources: [
    'IEC 61800-3, *Adjustable speed electrical power drive systems — EMC requirements and specific test methods*: environments and categories C1–C4.',
    'IEC TS 60034-25, *Rotating electrical machines — AC electrical machines used in power drive systems — Application guide*, and IEC TS 60034-17 for cage motors fed from converters.',
    'NEMA MG 1, *Motors and Generators*, Part 31: definite-purpose inverter-fed motors.',
    'IEC 61000-3-2 and IEC 61000-3-12 (harmonic current emissions of equipment); IEEE 519, *Standard for Harmonic Control in Electric Power Systems*.',
    'IEC 61800-5-1, *Safety requirements — Electrical, thermal and energy*: earthing, leakage current and residual-current devices.'
  ],
  sim: ['sd-vfd-emc', 'sd-vfd-inside']
},

{
  id: 'vfd-energy-saving', parent: 'vfd-topic', title: 'Energy saving with fans and pumps', level: 2,
  short: 'A centrifugal pump or fan needs power in proportion to the cube of its speed. Slowing it with a drive instead of throttling it with a valve or damper can cut the power by half at 80 % flow — the biggest energy saving most plants can make. Static head, the drive\'s own losses and the hours at each flow decide how much you really save.',
  keywords: ['energy saving', 'affinity laws', 'cube law', 'fan laws', 'pump laws', 'throttling', 'damper', 'bypass', 'static head', 'system curve', 'pump curve', 'variable speed pumping', 'payback', 'IE classes of drives', 'IES'],
  prereq: ['vfd-principle', 'hydraulics:affinity-laws', 'load-torque-types'],
  related: ['v-over-f-control', 'vfd-parameters', 'motors-pumps-fans', 'efficiency-classes', 'motor-life-cost', 'hydraulics:pump-curves', 'hydraulics:pump-head-power'],
  body: `
In a centrifugal pump or fan the fluid leaves the impeller at a speed [[?proportional|proportional]] to the impeller's speed. Flow follows that speed, head (pressure) follows its square, and power — flow times head — its cube. These are the **affinity laws** ([[hydraulics:affinity-laws]]):

$$\\frac{Q_2}{Q_1} = \\frac{n_2}{n_1}, \\qquad \\frac{H_2}{H_1} = \\left(\\frac{n_2}{n_1}\\right)^2, \\qquad \\frac{P_2}{P_1} = \\left(\\frac{n_2}{n_1}\\right)^3$$

At 80 % speed a fan moves 80 % of the air with 51 % of the power; at 50 % speed, half the air with an eighth of the power.

### Throttling against slowing down
Most pumps and fans are sized for the worst day and spend their lives delivering less. The old ways to reduce flow waste the difference:
- A **throttle valve** or **damper** adds resistance: the pump or fan still runs at full speed, moves up its curve to a higher head, and the valve burns the extra head. The power falls only a little: for the example pump below, 91 % of full power at 80 % flow and 83 % at 60 %.
- A **bypass** (recirculation) is worse: the pump delivers full flow and sends part of it back.
- **On/off** cycling with a tank averages the flow, at full power while running.

A drive instead lowers the pump curve until it meets the system curve at the flow wanted. Nothing is burnt in a valve, and the pump can stay near its best efficiency point.

### Static head: why the cube law is an upper bound
The cube law assumes a system with friction only, whose required head falls with the square of the flow. Most real systems also have a **static head** — lifting water to a tank, holding a pressure — that does not fall with flow. The system curve is then $H = H_{st} + kQ^2$, the speed cannot fall as far, and the saving shrinks; below some speed the pump delivers nothing at all (the minimum frequency of [[vfd-parameters]]). For the example pump (250 m³/h at 32 m, 30 kW motor) with half its head static, 70 % flow needs 83 % speed and about 54 % of the full-flow power — against 87 % throttled. Still a large saving, but not the 34 % the cube law promises.

| Flow | Throttled (example pump) | VFD, friction only (cube law) | VFD, half the head static |
|---|---|---|---|
| 100 % | 100 % | 100 % (+ drive losses) | 100 % (+ drive losses) |
| 80 % | 91 % | 51 % | about 66 % |
| 70 % | 87 % | 34 % | about 54 % |
| 60 % | 83 % | 22 % | about 43 % |

### The losses you add, and the other gains
A drive loses 2–3 % of the power it passes, and the motor's efficiency drops a little at light load and on PWM, so at full speed a drive-fed pump uses slightly *more* than a direct-on-line one — the saving comes only from running slower. IEC 61800-9-2 rates drives (IE0–IE2) and motor-drive combinations (IES0–IES2) by their losses. Beyond energy, variable speed brings soft starts, gentler stops against [[hydraulics:water-hammer|water hammer]], less noise and wear, and control of pressure or flow directly from a sensor. Watch for pumps run below their minimum flow (heating, recirculation), fans in stall, and resonances at some speeds (skip frequencies). **Constant-torque** machines (conveyors, positive-displacement pumps) save only in proportion to speed, not its cube.

### Is it worth it?
The saving in kilowatts, times the hours at each flow, times the energy price, against the drive's installed cost. A pump running 6000 h a year at 70 % flow on the example system saves about 8.6 kW × 6000 h = 52 000 kWh a year — at ¤0.15 per kWh, about ¤7,700 a year, typically paying for a 30 kW drive in one to two years.

**In the simulation** choose throttling or speed control, set the flow demand and the static head, and watch the operating point on the pump and system curves, the power meter and the annual energy bill.

> [!key] Power ∝ speed³ for centrifugal pumps and fans: slowing down instead of throttling saves most of the energy at part flow. Static head, drive losses and the load profile decide the real saving — calculate it with the hours at each flow.
`,
  ideas: [
    'For centrifugal pumps and fans: flow ∝ speed, head ∝ speed², power ∝ speed³.',
    'Throttling or damping keeps the machine at full speed and burns the surplus head; the power falls only a little.',
    'Static head limits how far the speed can fall, so real savings are smaller than the cube law.',
    'A drive adds 2–3 % losses: at full speed it saves nothing; the saving comes from running slower.',
    'Constant-torque loads save only in proportion to speed.'
  ],
  pitfalls: [
    'Any motor on a VFD saves energy — Only if it runs slower than before; at full speed the drive adds its losses.',
    'At half flow a pump always needs one eighth of the power — Only in a friction-only system; with static head the speed cannot fall to half and the power stays higher.',
    'The cube law applies to every pump — Positive-displacement pumps and constant-torque machines need power in proportion to speed, not its cube.'
  ],
  formulas: [
    {
      name: 'Affinity law for power',
      expr: 'P2 = P1*(n2/n1)^3', tex: 'P_2 = P_1\\left(\\dfrac{n_2}{n_1}\\right)^3',
      vars: {
        P2: { name: 'power at the new speed', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'power at the original speed', q: 'power', unit: 'kW', value: 30, tex: 'P_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1184, tex: 'n_2' },
        n1: { name: 'original speed', q: 'angvel', unit: 'rpm', value: 1480, tex: 'n_1' }
      },
      note: 'Centrifugal pumps and fans in a friction-only system (no static head), at similar efficiency.',
      stories: { P2: 'A fan takes {P1} at {n1}. How much does it take at {n2}?', n2: 'A fan takes {P1} at {n1}. At what speed does it take {P2}?' }
    },
    {
      name: 'Affinity law for flow',
      expr: 'Q2 = Q1*n2/n1', tex: 'Q_2 = Q_1\\,\\dfrac{n_2}{n_1}',
      vars: {
        Q2: { name: 'flow at the new speed', q: 'flowrate', unit: 'm³/h', tex: 'Q_2' },
        Q1: { name: 'flow at the original speed', q: 'flowrate', unit: 'm³/h', value: 250, tex: 'Q_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1184, tex: 'n_2' },
        n1: { name: 'original speed', q: 'angvel', unit: 'rpm', value: 1480, tex: 'n_1' }
      },
      stories: { Q2: 'A pump delivers {Q1} at {n1}. What does it deliver at {n2} in a friction-only system?' }
    },
    {
      name: 'Affinity law for head',
      expr: 'H2 = H1*(n2/n1)^2', tex: 'H_2 = H_1\\left(\\dfrac{n_2}{n_1}\\right)^2',
      vars: {
        H2: { name: 'head at the new speed', q: 'length', unit: 'm', tex: 'H_2' },
        H1: { name: 'head at the original speed', q: 'length', unit: 'm', value: 32, tex: 'H_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1184, tex: 'n_2' },
        n1: { name: 'original speed', q: 'angvel', unit: 'rpm', value: 1480, tex: 'n_1' }
      },
      stories: { n2: 'A pump gives {H1} at {n1}. To what speed can it be slowed before its head falls to {H2}?' }
    },
    {
      name: 'Pump shaft power',
      expr: 'P = rho*g*Q*H/eta', tex: 'P = \\dfrac{\\rho_w\\,g\\,Q\\,H}{\\eta}',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        rho: { const: 'rhoW' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 175 },
        H: { name: 'head', q: 'length', unit: 'm', value: 23.84 },
        eta: { name: 'pump efficiency', q: 'ratio', unit: '%', value: 78, tex: '\\eta', min: 1, max: 100 }
      },
      stories: { P: 'A pump moves {Q} of water against {H} at an efficiency of {eta}. What shaft power does it need?' }
    },
    {
      name: 'Energy saved in a year',
      expr: 'E = P*t', tex: 'E = \\Delta P\\,t',
      vars: {
        E: { name: 'energy saved', q: 'energy', unit: 'kWh' },
        P: { name: 'power saved', q: 'power', unit: 'kW', value: 8.6, tex: '\\Delta P' },
        t: { name: 'running hours', q: 'time', unit: 'h', value: 6000 }
      },
      stories: { E: 'A drive saves {P} for {t} a year. How much energy is that?' }
    }
  ],
  examples: [
    {
      title: 'The cube law',
      q: 'A fan takes 30 kW at 1480 rpm in a duct system with no static pressure. What does it take at 80 % and at 50 % speed?',
      steps: ['80 %: $30 \\times 0.8^3 = 30 \\times 0.512 = 15.4$ kW.', '50 %: $30 \\times 0.5^3 = 3.75$ kW.'],
      a: '15.4 kW and 3.75 kW (plus a few per cent of drive and motor losses).'
    },
    {
      title: 'A pump with static head',
      q: 'A pump delivers 250 m³/h at 32 m with 80 % efficiency (shut-off head 40 m) into a system with 16 m of static head. Flow must fall to 175 m³/h. Compare throttling with a drive.',
      steps: [
        'Full power: $1000 \\times 9.81 \\times (250/3600) \\times 32/0.8 = 27.2$ kW.',
        'Throttled at full speed: the pump curve gives 36.1 m at 175 m³/h, at about 73 % efficiency: $P = 9810 \\times 0.0486 \\times 36.1/0.73 = 23.6$ kW.',
        'With a drive the system needs only $16 + 16 \\times 0.7^2 = 23.8$ m; the pump reaches it at 83 % speed, near its best efficiency (78 %): $P = 9810 \\times 0.0486 \\times 23.8/0.78 = 14.6$ kW, about 15.0 kW with drive losses.',
        'Saving $23.6 - 15.0 = 8.6$ kW.'
      ],
      a: 'About 23.6 kW throttled against 15 kW on a drive: 8.6 kW saved — much less than the cube law would suggest, but still a third.'
    },
    {
      title: 'Payback',
      q: 'That pump runs 6000 h a year at 175 m³/h. Energy costs ¤0.15 per kWh, and the drive costs about ¤9,000 installed. What is the simple payback?',
      steps: ['Energy saved $8.6 \\times 6000 = 51\\,600$ kWh a year.', 'Money saved: $51\\,600 \\times 0.15$ = ¤7,740 a year.', 'Payback $9000/7740 = 1.2$ years.'],
      a: 'About 52 000 kWh and ¤7,700 a year; payback in a little over a year.'
    }
  ],
  quiz: [
    { q: 'A fan runs at half its speed in a friction-only duct. Its power is…', choices: ['one eighth', 'one half', 'one quarter', 'unchanged'], a: 0, why: 'P ∝ n³: 0.5³ = 0.125.' },
    { q: 'Why does a pump lifting water to a high tank save less on a VFD than the cube law says?', choices: ['The static head does not fall with speed, so the speed cannot fall as far', 'The drive is less efficient on pumps', 'Water is heavier than air', 'The motor overheats'], a: 0, why: 'The system curve starts at the static head; the pump must still reach it, so speed and power stay higher.' },
    { q: 'At full speed, a pump on a VFD uses slightly more energy than the same pump started direct on line.', a: true, why: 'The drive\'s 2–3 % losses (and a little extra motor loss) are added; savings come only from running slower.' },
    { q: 'A pump throttled from 100 % to 70 % flow at full speed typically takes…', choices: ['most of its full power, perhaps 85–90 %', 'about 34 % of full power', 'about 70 % of full power', 'more than full power'], a: 0, why: 'It moves up its curve to a higher head; the power falls only a little — the valve burns the difference.' },
    { q: 'A conveyor (constant torque) is slowed to half speed on a drive. Its power falls to about…', choices: ['a half', 'an eighth', 'a quarter', 'nothing changes'], a: 0, why: 'P = Tω with T constant: power falls in proportion to speed, not its cube.' }
  ],
  problems: [
    { q: 'A fan takes 15 kW at 1470 rpm. What does it take at 1100 rpm in the same (friction-only) system?', answer: 6.29, unit: 'kW', tol: 0.02, steps: ['$(1100/1470)^3 = 0.748^3 = 0.419$.', '$P = 15 \\times 0.419 = 6.29$ kW.'] },
    { q: 'A drive saves 10 kW for 4000 h a year. How much energy is saved?', answer: 40000, unit: 'kWh', tol: 0.01, steps: ['$E = 10 \\times 4000 = 40\\,000$ kWh.'] }
  ],
  choose: {
    good: [
      'Centrifugal pumps and fans whose demand varies and which run many hours a year.',
      'Replacing throttle valves, dampers, inlet vanes, bypasses and on/off cycling.',
      'Systems dominated by friction head: circulation loops, ventilation ducts, cooling water.'
    ],
    avoid: [
      'Pumps and fans that run at constant full flow — the drive only adds losses (or add a bypass contactor for full speed).',
      'Systems with high static head and little flow variation, where the speed can hardly fall.',
      'Expecting cube-law savings from positive-displacement pumps and constant-torque machines.'
    ],
    check: [
      'The load profile: hours at each flow over a year.',
      'Static and friction head (the system curve) and the minimum speed that still delivers.',
      'Pump efficiency along the new operating points, and the drive and motor losses.',
      'Payback from the energy price and the installed cost; harmonics and EMC for the new drive.'
    ]
  },
  applications: [
    'Heating and chilled-water circulation pumps in buildings: differential-pressure control on a drive.',
    'Ventilation and cooling-tower fans: speed follows temperature or air quality instead of dampers.',
    'Water supply and irrigation: constant-pressure pumping without pressure tanks cycling. Size it in [the pump and fan sizing tool](#/tools/sizing/pumpfan).'
  ],
  sources: [
    'IEC 61800-9-2, *Adjustable speed electrical power drive systems — Ecodesign for power drive systems, motor starters, power electronics and their driven applications — Energy efficiency indicators*: IE classes of drives and IES classes of motor systems.',
    'Hydraulic Institute and Europump, *Variable Speed Pumping — A Guide to Successful Applications*.',
    'Hughes and Drury, *Electric Motors and Drives*: fan and pump loads on variable-speed drives.'
  ],
  sim: 'sd-pump-savings'
}

);
