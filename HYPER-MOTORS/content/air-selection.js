/* HYPER-MOTORS · content/air-selection.js
 *   air-motor-topic: how an air motor works, vane, piston and turbine air motors, control, where air motors win
 *   comparisons:     the families compared, stepper/servo/VFD, pumps and fans, conveyors and hoists, machine tools,
 *                    traction, robots and drones (hazardous areas and life-cycle cost are written elsewhere)
 * Simulations in sims/air-selection.js (ids as-…). */
Hyper.add(

{
  id: 'air-motor-principle', parent: 'air-motor-topic', title: 'How an air motor works', level: 1,
  short: 'Compressed air pushes on vanes, pistons or turbine blades and turns a shaft. At a steady inlet pressure the torque falls in a straight line from stall to free speed, so the power is a parabola that peaks at half the free speed; the air used rises with speed, the torque follows the gauge pressure, and an overloaded air motor simply stalls without harm.',
  keywords: ['air motor', 'pneumatic motor', 'free speed', 'stall torque', 'power curve', 'half free speed', 'air consumption', 'specific air consumption', 'free air', 'ANR', 'supply pressure', 'pressure correction', 'stall', 'energy chain', 'overall efficiency'],
  prereq: ['torque-and-power', 'dc-torque-speed', 'pneumatics:standard-air'],
  related: ['vane-air-motors', 'piston-air-motors', 'turbine-air-motors', 'air-motor-control', 'air-motor-applications', 'hydraulic-motor-principle', 'motor-comparison', 'pneumatics:air-motors', 'pneumatics:cost-of-compressed-air', 'pneumatics:air-consumption'],
  body: `
An air motor turns the pressure of compressed air into rotation. Air at the supply pressure — usually 5–7 bar gauge in a factory — is let into a chamber that grows as the shaft turns (vane and piston motors), or blown through nozzles into jets that strike blades (turbines). Having pushed, it leaves through the exhaust at atmospheric pressure. There is no winding to burn, nothing to spark, and no harm in stopping the shaft by force.

### The torque line and the power parabola
At a steady inlet pressure the torque falls almost in a straight line from the **stall torque** $T_s$ at standstill to zero at the **free speed** $n_0$:

$$T = T_s\\left(1 - \\frac{n}{n_0}\\right)$$

The faster the motor turns, the less time each chamber has to fill through its port, so the mean pressure on the vanes or pistons falls; leakage and friction take a share too. The power $P = 2\\pi n T$ is then a parabola — zero at stall, zero at free speed, and [[?stationary|largest]] at **half the free speed**:

$$P = 4P_{\\max}\\,\\frac{n}{n_0}\\left(1 - \\frac{n}{n_0}\\right), \\qquad P_{\\max} = \\frac{\\pi n_0 T_s}{2}$$

with $n_0$ in revolutions per second. The shape is that of the [[dc-torque-speed|DC motor's line]], for a different reason. The motor settles where its line meets the load's torque: add load and it slows until its torque rises to match. Watch the dot slide along the line in the sim below.

| Point on the curve | Torque | Speed | Power | Air used |
|---|---|---|---|---|
| Stall | $T_s$ | 0 | 0 | only leakage |
| Peak power | $T_s/2$ | $n_0/2$ | $P_{\\max}$ | about 1–1.5 m³/min of free air per kW |
| Free speed | 0 | $n_0$ | 0 | the most of all — for no work |

### Air consumption
Air is counted as free air ([[pneumatics:standard-air|ANR]]), the volume it would fill at atmospheric pressure. Consumption rises with speed, because the chambers fill more often: at stall only leakage passes, at free speed the motor swallows the most air while doing nothing. Per kilowatt delivered it is usually lowest somewhat below the peak-power speed. So choose a motor whose working point lies **near or a little below half its free speed**, not one that races near free speed with a light load.

| Typical motor at 6 bar | Peak power | Free speed | Stall torque | Free air at peak power |
|---|---|---|---|---|
| Small vane (die-grinder size) | 0.3 kW | 20 000 rpm | 0.57 N·m | 5–7.5 L/s |
| Vane | 1 kW | 6000 rpm | 6.4 N·m | 17–25 L/s |
| Vane with a 20:1 planetary gearbox | 0.9 kW | 300 rpm | 115 N·m | 17–25 L/s |
| Vane | 4 kW | 4000 rpm | 38 N·m | 65–100 L/s |
| Radial piston | 2 kW | 1500 rpm | 51 N·m | 35–50 L/s |

### Pressure is torque
The force on a vane or piston is the gauge pressure times its area, so the stall torque is [[?proportional|proportional]] to the **gauge pressure at the motor inlet**; the free speed changes much less. Catalogues give curves at 6 or 6.3 bar with correction factors for other pressures; roughly, the power falls a little faster than the pressure — a motor rated at 6.3 bar gives about 70 % of its power at 5 bar and about half at 4 bar. The pressure that counts is the one at the inlet *while running*: long thin hoses, quick couplings, small valves and a clogged filter can lose a bar at full flow.

### Stall without harm — but no holding
An overloaded air motor stops and holds its stall torque as long as air is supplied. Nothing heats up, and it starts again when the load eases; it can be started, stopped and reversed as often as the job needs. What it cannot do is *hold a position*: air leaks past vanes and pistons, so a hanging load creeps down, and when the air is shut off the torque is gone — hoists and winches carry a [[motor-brakes|spring-applied brake]] released by air pressure. Vane motors also start with a little less than their stall torque (see [[vane-air-motors]]).

### The energy chain
Expanding free air from 6 bar gauge could ideally give about 2.5 kW for each m³/min; a real vane motor recovers about a third of that, and producing the air cost the compressor 6–7 kW per m³/min. Each shaft kilowatt therefore costs **7–10 kW of electricity**: an overall efficiency of 10–15 %, against 80–95 % for an electric motor. Air motors earn their place by what they tolerate, not by what they save (see [[air-motor-applications]] and [[pneumatics:cost-of-compressed-air]]).

> [!warn] A stalled air motor still holds its full torque, and a jammed tool can kick back. Before changing a tool, clearing a jam or opening a motor, shut off the air, exhaust the line and make sure no load is held by the motor alone. Never point exhaust or supply air at anyone.

> [!key] Torque falls in a straight line from stall to free speed; power peaks at half the free speed; torque follows the gauge pressure at the inlet; air use rises with speed. Size the motor so it works near half its free speed at the pressure it really gets.
`,
  ideas: [
    'At a steady inlet pressure the torque falls linearly from the stall torque to zero at the free speed.',
    'The power 2πnT is a parabola with its peak, πn₀T_s/2, at half the free speed.',
    'Air consumption rises with speed and is largest at free speed, where no work is done.',
    'Stall torque is proportional to the gauge pressure at the inlet while the motor runs.',
    'An air motor stalls safely but cannot hold a position: a suspended load needs a brake.'
  ],
  pitfalls: [
    'A lightly loaded air motor near free speed is economical — At free speed it uses the most air and gives no power; per kilowatt, air use is lowest a little below half the free speed.',
    'The compressor gauge reading is the motor\'s pressure — The torque follows the pressure at the motor inlet while it runs, after hoses, couplings, filters and valves have taken their drop.',
    'A stalled air motor holds its load safely — It holds torque only while air flows in; leakage lets a hanging load creep, and without air it falls unless a brake holds it.'
  ],
  formulas: [
    {
      name: 'Torque against speed',
      expr: 'T = Ts*(1 - n/n0)', tex: 'T = T_s\\left(1 - \\dfrac{n}{n_0}\\right)',
      vars: {
        T: { name: 'torque at speed n', q: 'torque', unit: 'N·m' },
        Ts: { name: 'stall torque', q: 'torque', unit: 'N·m', value: 3.82, tex: 'T_s' },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 3000 },
        n0: { name: 'free speed', q: 'frequency', unit: 'rpm', value: 8000, tex: 'n_0' }
      },
      note: 'At a steady inlet pressure. The motor runs where this line meets the load torque.',
      practice: { unknowns: ['T', 'n'] },
      stories: { T: 'An air motor with a stall torque of {Ts} and a free speed of {n0} runs at {n}. What torque does it give?', n: 'An air motor ({Ts} stall torque, {n0} free speed) drives a load needing {T}. At what speed does it settle?' }
    },
    {
      name: 'Peak power',
      expr: 'Pmax = pi*n0*Ts/2', tex: 'P_{\\max} = \\dfrac{\\pi\\,n_0\\,T_s}{2}',
      vars: {
        Pmax: { name: 'peak power (at half the free speed)', q: 'power', unit: 'W', tex: 'P_{\\max}' },
        n0: { name: 'free speed', q: 'frequency', unit: 'rpm', value: 8000, tex: 'n_0' },
        Ts: { name: 'stall torque', q: 'torque', unit: 'N·m', value: 3.82, tex: 'T_s' }
      },
      note: 'From the straight torque line: P = 2π (n₀/2)(T_s/2), with n₀ in revolutions per second (the calculator converts rpm).',
      practice: { unknowns: ['Pmax', 'Ts'] },
      stories: { Pmax: 'An air motor has a free speed of {n0} and a stall torque of {Ts}. What is its peak power?', Ts: 'A catalogue lists an air motor of {Pmax} peak power and {n0} free speed. What is its stall torque?' }
    },
    {
      name: 'Power at any speed',
      expr: 'P = 4*Pmax*(n/n0)*(1 - n/n0)', tex: 'P = 4P_{\\max}\\,\\dfrac{n}{n_0}\\left(1 - \\dfrac{n}{n_0}\\right)',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'W' },
        Pmax: { name: 'peak power', q: 'power', unit: 'W', value: 800, tex: 'P_{\\max}' },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 3000, min: 0, max: 200000 },
        n0: { name: 'free speed', q: 'frequency', unit: 'rpm', value: 8000, min: 1, max: 500000, tex: 'n_0' }
      },
      note: 'Every power below the peak is reached at two speeds, one on each side of n₀/2; the lower one uses less air.',
      practice: { unknowns: ['P', 'n'] },
      stories: { P: 'An air motor of {Pmax} peak power and {n0} free speed runs at {n}. What power does it give?', n: 'An air motor of {Pmax} peak power and {n0} free speed must deliver {P}. At what speeds can it do so?' }
    },
    {
      name: 'Stall torque at another pressure',
      expr: 'T2 = T1*p2/p1', tex: 'T_2 = T_1\\,\\dfrac{p_2}{p_1}',
      vars: {
        T2: { name: 'stall torque at the new pressure', q: 'torque', unit: 'N·m', tex: 'T_2' },
        T1: { name: 'catalogue stall torque', q: 'torque', unit: 'N·m', value: 6.4, tex: 'T_1' },
        p2: { name: 'gauge pressure at the motor inlet', q: 'pressure', unit: 'bar', value: 5, tex: 'p_2' },
        p1: { name: 'catalogue gauge pressure', q: 'pressure', unit: 'bar', value: 6.3, tex: 'p_1' }
      },
      note: 'Gauge pressures: the force on a vane or piston is the pressure above the exhaust (atmospheric) times its area. The free speed changes much less, so the power falls a little faster than the pressure.',
      stories: { T2: 'A motor gives {T1} at stall at {p1}, but the pressure at its inlet is only {p2}. What stall torque is left?', p2: 'A motor gives {T1} at stall at {p1}. What inlet pressure limits its stall torque to {T2}?' }
    }
  ],
  examples: [
    {
      title: 'Reading a catalogue line',
      q: 'A vane motor is listed at 6.3 bar with a peak power of 0.8 kW and a free speed of 8000 rpm. Find its stall torque, and the torque and power at 3000 rpm.',
      steps: [
        '$\\omega_0 = 8000 \\times 2\\pi/60 = 837.8$ rad/s; from $P_{\\max} = T_s\\omega_0/4$: $T_s = 4 \\times 800/837.8 = 3.82$ N·m.',
        'At 3000 rpm, $n/n_0 = 0.375$: $T = 3.82 \\times (1 - 0.375) = 2.39$ N·m.',
        '$P = 2\\pi \\times 50 \\times 2.39 = 750$ W — the same as $4 \\times 800 \\times 0.375 \\times 0.625$.'
      ],
      a: 'Stall torque 3.8 N·m; at 3000 rpm it gives 2.4 N·m and 0.75 kW, close to its peak.'
    },
    {
      title: 'Matching a mixer',
      q: 'A paint mixer needs 2 N·m at about 1500 rpm. Two motors are offered: A, 0.4 kW peak with a free speed of 3000 rpm; B, 0.4 kW peak at 12 000 rpm. Which one, and where will it run?',
      steps: [
        'A: $T_s = 4 \\times 400/(3000 \\times 2\\pi/60) = 1600/314.2 = 5.09$ N·m. It settles at $n = 3000\\,(1 - 2/5.09) = 1820$ rpm, 61 % of free speed, giving $2\\pi \\times 30.3 \\times 2 = 381$ W.',
        'B: $T_s = 1600/1256.6 = 1.27$ N·m — less than the 2 N·m the mixer needs: it stalls.',
        'B with a 5:1 gearbox of 90 % efficiency: $T_s = 1.27 \\times 5 \\times 0.9 = 5.7$ N·m, $n_0$ = 2400 rpm, running speed $2400\\,(1 - 2/5.7) = 1560$ rpm.',
        'Either A, throttled a little to 1500 rpm, or B with the gearbox. A mixer\'s torque rises as the paint thickens; both will stall safely if it sets.'
      ],
      a: 'Motor A runs at about 1820 rpm (throttle it to 1500); motor B stalls unless it gets a gearbox, then about 1560 rpm.'
    },
    {
      title: 'The pressure the motor really gets',
      q: 'The 1 kW vane motor of the table (6.4 N·m, 6000 rpm at 6.3 bar) sits at the end of a long hose and sees only 5.0 bar gauge while running. Estimate its stall torque, free speed and peak power.',
      steps: [
        'Stall torque follows the gauge pressure: $6.4 \\times 5.0/6.3 = 5.08$ N·m.',
        'Take the free speed as rising with the square root of the absolute pressure: $6000\\sqrt{6.01/7.31} = 5440$ rpm (a typical correction; the catalogue\'s own factors govern).',
        '$P_{\\max} = \\pi \\times (5440/60) \\times 5.08/2 = 724$ W.'
      ],
      a: 'About 5.1 N·m, 5400 rpm and 0.72 kW — more than a quarter of the power lost to the hose.'
    }
  ],
  quiz: [
    { q: 'An air motor has a free speed of 8000 rpm. At what speed does it deliver the most power?', choices: ['4000 rpm', '8000 rpm', '2000 rpm', 'At standstill'], a: 0, why: 'With a straight torque line the power $2\\pi n T_s(1 - n/n_0)$ peaks at $n_0/2$.' },
    { q: 'When does an air motor use the most air?', choices: ['At free speed', 'At stall', 'At peak power', 'The same at every speed'], a: 0, why: 'The chambers fill once per cycle, so the flow rises with speed; at free speed it is largest while the power is zero. At stall only leakage flows.' },
    { q: 'The gauge pressure at a motor\'s inlet falls from 6.3 to 5 bar. Its stall torque…', choices: ['falls by about a fifth', 'stays the same', 'rises, because the air expands more', 'falls to about half'], a: 0, why: 'Stall torque is proportional to the gauge pressure: 5/6.3 = 0.79. The power falls somewhat more (to about 70 %), because the free speed drops a little too.' },
    { q: 'A stalled air motor on a hoist holds its load in place indefinitely, even with the air shut off.', a: false, why: 'Torque needs pressure: leakage lets the load creep while air is on, and with the air off nothing holds it. Hoists use a spring-applied brake released by air.' },
    { q: 'What is the stall torque of an air motor with a peak power of 2 kW and a free speed of 3000 rpm?', answer: 25.5, unit: 'N·m', why: '$T_s = 4P_{\\max}/\\omega_0 = 8000/314.2 = 25.5$ N·m.' }
  ],
  problems: [
    { q: 'An air motor with a stall torque of 12 N·m and a free speed of 4000 rpm drives a conveyor needing a steady 5 N·m. At what speed does it run?', answer: 2333, unit: 'rpm', tol: 0.02,
      steps: ['$n = n_0(1 - T/T_s) = 4000 \\times (1 - 5/12) = 2333$ rpm.', 'Power: $2\\pi \\times 38.9 \\times 5 = 1.22$ kW, near its peak of $\\pi \\times 66.7 \\times 12/2 = 1.26$ kW.'] },
    { q: 'A motor gives 0.5 kW at its peak using 1.3 m³/min of free air per kW. The compressor needs 6.5 kW per m³/min. What electrical power does the compressor draw for this motor?', answer: 4.2, unit: 'kW', tol: 0.03,
      steps: ['Air: $0.5 \\times 1.3 = 0.65$ m³/min.', 'Compressor: $0.65 \\times 6.5 = 4.2$ kW — more than eight times the shaft power.'] }
  ],
  choose: {
    good: [
      'Explosive, wet, dusty or hot places where sparks, water or heat rule out an ordinary electric motor.',
      'Duties that stall, reverse and restart often — nutrunners, winches, mixers whose load changes — since stalling does no harm.',
      'Light, powerful hand tools and compact drives where compressed air is already piped.'
    ],
    avoid: [
      'Long continuous running: each shaft kilowatt costs 7–10 kW at the compressor.',
      'Precise speed or position: the speed sags with load, and without a brake it cannot hold a position.',
      'Quiet workplaces, unless the exhaust is silenced or piped away.'
    ],
    check: [
      'The gauge pressure at the motor inlet while it runs — torque follows it.',
      'Where the working point lies: near or a little below half the free speed.',
      'The air consumption at that point, and whether the compressor, pipes and valve can supply it.',
      'Lubricated or oil-free air, filtration and dryness, exhaust noise and icing.'
    ]
  },
  applications: [
    'Hand tools: drills, grinders, sanders, screwdrivers and nutrunners.',
    'Mixers, agitators and pumps in paint, chemical and food plants.',
    'Winches and hoists in mines, refineries and offshore.',
    'Try your own motor in [the air-motor lab](#/tools/motorlab/air).'
  ],
  history: 'Compressed air drove the rock drills and locomotives of nineteenth-century mines and tunnels, where steam fouled the air underground and electricity was a fire risk. Cities experimented with compressed air as a public utility too: in the late nineteenth century Paris ran a public compressed-air network, first to drive pneumatic clocks and then small motors in workshops.',
  sources: [
    'ISO 8778, *Pneumatic fluid power — Standard reference atmosphere*: the free-air (ANR) basis on which air consumption is quoted.',
    'ISO 4414, *Pneumatic fluid power — General rules and safety requirements for systems and their components*.',
    'Esposito, *Fluid Power with Applications* — the chapters on pneumatic components and air motors.',
    'Air-motor makers\' catalogues give torque, power and air-consumption curves at a stated inlet pressure (commonly 6 or 6.3 bar) with correction factors for other pressures.'
  ],
  sim: 'as-air-curves'
},

{
  id: 'vane-air-motors', parent: 'air-motor-topic', title: 'Vane air motors', level: 2,
  short: 'The commonest air motor: a slotted rotor turning off-centre in a bore, with sliding vanes that form chambers which grow as air pushes in. Light, simple and reversible, from 0.1 to about 20 kW at thousands of rpm, usually with a planetary gearbox — lubricated by oil mist, or oil-free with self-lubricating vanes.',
  keywords: ['vane motor', 'rotary vane', 'air vane motor', 'eccentric rotor', 'vanes', 'displacement', 'eccentricity', 'starting torque', 'vane springs', 'reversible air motor', 'residual exhaust', 'planetary gearbox', 'lubricated air', 'oil-free air motor', 'lube-free vanes'],
  prereq: ['air-motor-principle', 'gearboxes', 'pneumatics:lubricators'],
  related: ['piston-air-motors', 'turbine-air-motors', 'air-motor-control', 'vane-motors-hyd', 'motor-brakes', 'pneumatics:air-motors', 'pneumatics:frl-units', 'pneumatics:noise-silencers', 'hydraulics:vane-pumps'],
  body: `
Nine air motors in ten are vane motors: they are small, light, cheap and reversible, and they run from a few hundred to more than twenty thousand rpm.

### Inside
A slotted rotor turns in a cylindrical bore (the *cylinder* or stator) whose centre is offset by the **eccentricity** $e$. Typically four to eight **vanes** slide in the rotor's slots; end plates carry the bearings and close the chambers. Between two vanes the space is crescent-shaped: it grows on one side of the rotor and shrinks on the other. Air enters where the chambers grow. The leading vane of a filling chamber sticks out further than the trailing one, so the pressure pushes harder on it — that difference is the torque. Further round, the exhaust port opens and the air escapes; the shrinking chambers sweep out what is left. Follow the colours of the chambers in the sim.

Each chamber grows from almost nothing to its largest once a revolution, so the **displacement** — the air volume swept per revolution — is about

$$V = 2\\,e\\,L\\,(\\pi D - z\\,s)$$

for a bore of diameter $D$ and length $L$ and $z$ vanes of thickness $s$. With full pressure on the growing chambers the torque would be $T = V\\,p/(2\\pi)$, the same rule as for a [[hydraulic-motor-principle|hydraulic motor]]. Real motors give less: air leaks past the vane tips and ends, the vanes rub, the ports throttle the flow, and many motors close the inlet before the chamber is full so that the air expands and less is used.

### Vanes out at the start
At speed, centrifugal force holds the vanes against the bore. At standstill they may lie in their slots, and air blows straight through. Motors therefore push the vanes out with small springs, or feed supply air beneath them. Even so a vane motor's **starting torque** is below its stall torque (often around three-quarters of it) and depends on where the rotor stopped — check the starting torque against the load's breakaway torque, not the stall torque.

### Reversible or one direction
A reversible motor has symmetrical ports: air in at one gives one direction, at the other the reverse, and the idle port becomes a second (*residual*) exhaust that must be free to vent through the valve. A motor built for one direction has its port timing optimised and gives somewhat more power for the same air.

### Sizes, gearboxes and brakes
| Class | Power | Free speed (bare motor) | Stall torque |
|---|---|---|---|
| Miniature, in tools | 0.1–0.5 kW | 10 000–30 000 rpm | 0.1–2 N·m |
| Industrial | 0.5–5 kW | 3000–10 000 rpm | 2–60 N·m |
| Large | 5–20 kW | 2000–6000 rpm | 20–250 N·m |

Bare vane motors are too fast for most loads, so most are sold as **gearmotors**: in-line planetary stages (a few per cent of loss each), helical or bevel gears, or worm gears for a compact right angle (low efficiency at high ratios, and not a reliable brake). Output speeds run down to a few rpm and torques to thousands of N·m. A 1 kW vane motor weighs around 1–2 kg; an electric motor of the same power, 10–20 kg. For hoists and winches a **brake motor** has a spring-applied brake released by the supply air, so it holds the moment the air goes.

### Lubricated or oil-free
Classic vane motors run on air carrying a fine **oil mist** from a [[pneumatics:lubricators|lubricator]]: it seals the vane tips, lets the vanes slide, and stops rust. **Oil-free** motors have vanes of self-lubricating materials (carbon-graphite or filled polymers) and often stainless parts; their exhaust carries no oil, which food, pharmaceutical and clean areas require. They usually give somewhat less power and need clean, dry air. Once a motor has run on oiled air, keep oiling it: the oil washes out its original lubricant film.

| Fault | Likely cause | Remedy |
|---|---|---|
| Weak, slow | low inlet pressure (hose, coupling, filter), blocked silencer, worn vanes, no oil | measure the inlet pressure while running; clean the silencer; service |
| Will not start in some positions | vanes stuck by gum, water or swelling; broken vane springs | dry and filter the air; replace vanes |
| Exhaust ices up | wet air expanding and cooling | dry the air; larger silencer; pipe the exhaust away |
| Oil mist in the room | over-lubrication, exhaust not piped | reduce the drip rate; pipe the exhaust; oil-free motor |
| Noisy, hot, vibrating | worn bearings, rotor rubbing the end plates, misaligned coupling | overhaul; align |

> [!warn] Shut off and exhaust the air before removing a motor or its silencer; a motor holding a load through its gearbox may release it when the air goes, unless a brake holds it.

> [!key] A vane motor's displacement is set by its eccentricity, bore and length; its torque by the gauge pressure on that displacement. Choose it with a gearbox that puts the load near half the free speed, check the starting torque, and decide early between oiled and oil-free air.
`,
  ideas: [
    'Chambers between the vanes grow on the inlet side; the leading vane has more area exposed, so pressure makes torque.',
    'Displacement is about 2eL(πD − zs); ideal torque is the displacement times the gauge pressure over 2π.',
    'Springs or air under the vanes are needed to start; starting torque is below stall torque.',
    'Most vane motors drive through a planetary gearbox; brake motors hold when the air goes.',
    'Lubricated motors need oil mist every time; oil-free motors need clean, dry air.'
  ],
  pitfalls: [
    'The stall torque is what the motor can start against — Vane motors start with less, often about three-quarters of the stall torque, depending on the rotor position.',
    'A worm gearbox makes a hoist safe without a brake — Worm gears may creep or back-drive under vibration; loads that can fall need a real brake.',
    'An oiled motor can be switched to oil-free air to keep the exhaust clean — Its lubricant film has been washed out; it will wear quickly. Use a motor built to run oil-free.'
  ],
  formulas: [
    {
      name: 'Displacement of a vane motor',
      expr: 'V = 2*ecc*L*(pi*D - z*s)', tex: 'V = 2\\,e\\,L\\,(\\pi D - z\\,s)',
      vars: {
        V: { name: 'displacement per revolution', q: 'displacement', unit: 'cm³/rev' },
        ecc: { name: 'eccentricity of the rotor', q: 'length', unit: 'mm', value: 4, tex: 'e' },
        L: { name: 'length of the rotor', q: 'length', unit: 'mm', value: 50 },
        D: { name: 'bore diameter', q: 'length', unit: 'mm', value: 50 },
        z: { name: 'number of vanes', q: 'count', value: 5, int: true },
        s: { name: 'vane thickness', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'Each chamber grows from nearly nothing to its largest once a revolution; the vanes take up zs of the circumference.',
      practice: { unknowns: ['V', 'ecc'] },
      stories: { V: 'A vane motor has a bore of {D}, a rotor {L} long offset by {ecc}, and {z} vanes {s} thick. What is its displacement?' }
    },
    {
      name: 'Ideal torque from displacement',
      expr: 'T = V*p/(2*pi)', tex: 'T = \\dfrac{V\\,p}{2\\pi}',
      vars: {
        T: { name: 'ideal (full-admission) torque', q: 'torque', unit: 'N·m' },
        V: { name: 'displacement per revolution', q: 'displacement', unit: 'cm³/rev', value: 56.8 },
        p: { name: 'gauge pressure at the inlet', q: 'pressure', unit: 'bar', value: 6 }
      },
      note: 'An upper bound: leakage, vane friction, port throttling and early inlet cut-off make the real stall torque lower.',
      stories: { T: 'A motor of {V} displacement gets {p}. What torque could it give at most?', V: 'What displacement would give {T} at {p}, before losses?' }
    },
    {
      name: 'Output of a gearbox',
      expr: 'To = T*i*eta', tex: 'T_o = T\\,i\\,\\eta',
      vars: {
        To: { name: 'torque at the gearbox output', q: 'torque', unit: 'N·m', tex: 'T_o' },
        T: { name: 'motor torque', q: 'torque', unit: 'N·m', value: 6.4 },
        i: { name: 'gear ratio', value: 25 },
        eta: { name: 'gearbox efficiency', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'The speeds divide by the ratio: free speed at the output = n₀/i. Planetary stages lose a few per cent each; worm gears much more.',
      stories: { To: 'A motor with a stall torque of {T} drives through a {i}:1 gearbox of {eta} efficiency. What is the stall torque at the output?', i: 'What ratio turns {T} into {To} with {eta} efficiency?' }
    }
  ],
  examples: [
    {
      title: 'Displacement and torque of a motor',
      q: 'A vane motor has a 50 mm bore, a 50 mm long rotor offset by 4 mm, and five vanes 3 mm thick. Estimate its displacement and its ideal torque at 6 bar gauge.',
      steps: [
        '$\\pi D - z s = 157.1 - 15 = 142.1$ mm.',
        '$V = 2 \\times 4 \\times 50 \\times 142.1 = 56\\,800$ mm³ = 56.8 cm³ per revolution.',
        '$T = V p/(2\\pi) = 56.8\\times10^{-6} \\times 6\\times10^{5}/(2\\pi) = 5.4$ N·m.'
      ],
      a: 'About 57 cm³/rev and at most 5.4 N·m at 6 bar; the catalogue stall torque will be lower.'
    },
    {
      title: 'A gearmotor for a winch drum',
      q: 'A winch drum needs 60 N·m at 100 rpm. You have the 1 kW vane motor of the table (stall 6.4 N·m, free speed 6000 rpm). Choose a planetary ratio (90 % efficient).',
      steps: [
        'Power needed: $2\\pi \\times (100/60) \\times 60 = 628$ W — within the motor\'s 0.9 kW at the output.',
        'Try 25:1: output stall torque $6.4 \\times 25 \\times 0.9 = 144$ N·m, free speed 240 rpm.',
        'Unthrottled it runs at $240\\,(1 - 60/144) = 140$ rpm, 58 % of free speed; a throttle brings it to 100 rpm.',
        'Starting reserve: about three-quarters of 144, 108 N·m, well above 60 N·m. A winch also needs a brake.'
      ],
      a: 'A 25:1 gearbox: 144 N·m at stall, about 140 rpm unthrottled at 60 N·m, trimmed to 100 rpm.'
    }
  ],
  quiz: [
    { q: 'Why do vane motors have springs or supply air behind their vanes?', choices: ['To hold the vanes against the bore when there is no centrifugal force, so the motor can start', 'To cool the vanes', 'To reverse the motor', 'To reduce noise'], a: 0, why: 'At standstill the vanes can sit in their slots and let air blow through; springs or air underneath keep them sealing.' },
    { q: 'You double a vane motor\'s eccentricity, keeping everything else. Its displacement and ideal torque…', choices: ['roughly double', 'stay the same', 'rise four times', 'halve'], a: 0, why: '$V = 2eL(\\pi D - zs)$ is proportional to $e$, and the torque is proportional to $V$.' },
    { q: 'A lubricated vane motor can be run on dry, oil-free air without consequence.', a: false, why: 'Its vanes are made for oil and its original lubricant has been washed out; it will wear and lose power quickly. Use a motor designed to run oil-free.' },
    { q: 'A reversible vane motor is used in one direction only. Compared with a one-direction motor of the same size it…', choices: ['gives somewhat less power for the air it uses', 'gives more power', 'cannot start', 'needs no exhaust'], a: 0, why: 'Its ports are symmetrical, a compromise; a one-direction motor has its port timing optimised.' },
    { q: 'A motor with a stall torque of 4 N·m and a free speed of 9000 rpm drives a 10:1 gearbox of 92 % efficiency. What is the stall torque at the output?', answer: 36.8, unit: 'N·m', why: '$4 \\times 10 \\times 0.92 = 36.8$ N·m; the output free speed is 900 rpm.' }
  ],
  problems: [
    { q: 'A vane motor has a 40 mm bore, a 40 mm rotor offset by 3 mm, and four vanes 2.5 mm thick. What is its ideal torque at 6 bar gauge?', answer: 2.65, unit: 'N·m', tol: 0.02,
      steps: ['$V = 2 \\times 3 \\times 40 \\times (125.7 - 10) = 27\\,760$ mm³ = 27.8 cm³.', '$T = 27.76\\times10^{-6} \\times 6\\times10^{5}/(2\\pi) = 2.65$ N·m.'] }
  ],
  choose: {
    good: [
      'General air drives from 0.1 to about 20 kW: mixers, agitators, feeders, winches, tools.',
      'Reversing duties and frequent stalls, and compact gearmotors where weight matters.',
      'Oil-free versions for food, pharmaceutical and clean areas.'
    ],
    avoid: [
      'Smooth, slow running with a heavy start from any position — a [[piston-air-motors|piston motor]] does that better.',
      'Wet, dirty air: vanes stick, swell and wear.',
      'Continuous heavy duty where the air bill outweighs the benefits.'
    ],
    check: [
      'Starting torque (not stall torque) against the breakaway torque of the load.',
      'Gear ratio and efficiency so the load sits near half the output free speed.',
      'Lubricated or oil-free, and the air quality it needs.',
      'Reversible or one-direction, brake or no brake, exhaust silencing and piping.'
    ]
  },
  applications: [
    'Air tools: die grinders, drills, screwdrivers and sanders use miniature vane motors.',
    'Agitators in paint tanks and chemical drums, driven through planetary gearboxes.',
    'Air winches and brake motors on hoists.',
    'Rotary vane pumps and vacuum pumps are the same machine run the other way ([[hydraulics:vane-pumps]]).'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — vane pumps and motors, and pneumatic components.',
    'ISO 8573-1, *Compressed air — Contaminants and purity classes*: the air quality a motor maker specifies.',
    'ISO 4414, *Pneumatic fluid power — General rules and safety requirements for systems and their components*.'
  ],
  sim: 'as-vane-motor'
},

{
  id: 'piston-air-motors', parent: 'air-motor-topic', title: 'Piston air motors', level: 2,
  short: 'Air motors with pistons: radial motors with four to six cylinders round a crankshaft, and compact axial motors pushing a swash plate. They give a high starting torque from any position, run smoothly at low speed and suit hoists, winches and heavy mixers — at the price of weight, cost and lubrication.',
  keywords: ['piston air motor', 'radial piston motor', 'axial piston air motor', 'crankshaft', 'swash plate', 'wobble plate', 'rotary distributor valve', 'starting torque', 'torque ripple', 'number of cylinders', 'dead centre', 'air hoist', 'air winch', 'expansion', 'cut-off'],
  prereq: ['air-motor-principle', 'torque-and-power', 'physics:torque'],
  related: ['vane-air-motors', 'air-motor-control', 'radial-piston-motors', 'axial-piston-motors', 'motors-conveyors-hoists', 'motor-brakes', 'pneumatics:air-motors', 'hydraulics:lsht-motors'],
  body: `
When an air motor must start a heavy load from rest, turn it slowly and evenly, and do so from whatever position it stopped in, the choice is a piston motor.

### Radial and axial
A **radial** piston motor has four to six cylinders arranged like the spokes of a wheel round a crankshaft, much like an old aircraft engine. A **rotary distributor valve**, turning with the crank, admits air to each cylinder during its working stroke and opens it to the exhaust on the return stroke. Each piston pushes its connecting rod against the crank pin, and the torque from one cylinder is roughly

$$T = p\\,A\\,r\\,\\sin\\theta$$

— the gauge pressure times the piston area, times the crank radius $r$, times the [[?sine-cosine|sine]] of the crank angle $\\theta$ from top dead centre (neglecting the slant of the rod). An **axial** piston motor puts its pistons parallel to the shaft, pushing on an inclined swash or wobble plate: more compact, very smooth, usually in the smaller sizes.

The displacement is the swept volume of all cylinders, $V = z\\,\\tfrac{\\pi}{4} d^2 s$ for $z$ cylinders of bore $d$ and stroke $s = 2r$, and the full-admission torque averaged over a turn is again $V p/(2\\pi)$ — the same rule as for [[vane-air-motors|vane]] and [[radial-piston-motors|hydraulic piston motors]].

### Why five cylinders
One cylinder pushes only for half a turn and gives nothing at its dead centres; two opposed cylinders still leave dead points where the motor cannot start. With more cylinders their pushes overlap, and the sum ripples less. With an **odd** number the working strokes interleave evenly; with an even number opposite cylinders work in pairs, so six are no smoother than three. For an odd number $z$ the worst-case torque is a fraction

$$k_{\\min} = \\frac{\\pi/2z}{\\tan(\\pi/2z)}$$

of the mean: 91 % for three cylinders, 97 % for five, 98 % for seven. That is what the sim below shows — the thin lines are the cylinders, the thick line their sum:

| Cylinders | Worst-case torque / mean | Ripple (peak to trough) | Starts from any position? |
|---|---|---|---|
| 1 | 0 | — | no: dead centres |
| 2 (opposed) | 0 | — | no |
| 3 | 91 % | about 14 % | yes |
| 4 | 79 % | about 33 % | yes |
| 5 | 97 % | about 5 % | yes, almost full torque |
| 6 | 91 % | about 14 % | yes |

### What they are like
- **Starting torque** close to the stall torque, from any rotor position — vane motors start with less (see [[vane-air-motors]]).
- **Low, steady speed**: free speeds of a few thousand rpm at most, and smooth running far below that, often with no gearbox or a small one.
- **Air economy**: the distributor can close the inlet part-way through the stroke and let the air expand, so piston motors tend to use their air more economically at low speed than vane motors.
- **Heavier and dearer** than a vane motor of the same power, with more moving parts; powers roughly from 1 to 25 kW.
- **Lubrication**: an oil mist in the air (and, in many designs, grease or oil in the crankcase). Water in the air rusts cylinders and washes out the oil.

### Where you meet them
Air hoists and winches lifting from a few hundred kilograms to tens of tonnes, capstans and haulage in mines, mixers for thick materials, and feed drives that must creep. On a hoist the motor always works with a **spring-applied brake** released by air, so the load is held when the air stops (see [[motors-conveyors-hoists]] and [[motor-brakes]]).

| Fault | Likely cause | Remedy |
|---|---|---|
| Will not start in one position | a cylinder not getting air (distributor worn or blocked), stuck piston | service the distributor; check the pistons |
| Uneven running, knocking | worn big-end or crank bearings, one cylinder weak | overhaul; compare cylinder pressures |
| Weak at low speed | low inlet pressure, leaking piston rings | measure the inlet pressure under load; replace rings |
| Rust in the exhaust | wet air | dry the air; keep the lubricator filled |

> [!warn] A hoist or winch motor must never be the only thing holding a load: lower the load or support it, and let the brake set, before disconnecting the air or opening the motor. Exhaust the line first.

> [!key] Many pistons sharing one crank make a torque that hardly varies with position: an odd number, five being common, starts a heavy load from anywhere and runs smoothly at low speed. Choose a piston motor for heavy starts and slow, steady duty; a vane motor for light, fast and cheap.
`,
  ideas: [
    'Each cylinder gives a torque of about pAr·sin θ during its working stroke and nothing on the return.',
    'Displacement z·(π/4)d²·s; the mean full-admission torque is Vp/2π, as for any displacement motor.',
    'With an odd number of cylinders the strokes interleave evenly; five ripple only about 5 %.',
    'Piston motors start heavy loads from any position and run smoothly slowly; they are heavier and dearer than vane motors.',
    'Hoists and winches pair them with a spring-applied brake released by air.'
  ],
  pitfalls: [
    'More cylinders always means smoother torque — Six cylinders work in opposed pairs and ripple like three; an odd number interleaves evenly.',
    'A piston motor holds a load when it is stopped — Air leaks past the rings and valves; only a brake holds a load safely.',
    'Air motors all start with their stall torque — Vane motors start with less; piston motors come close to their stall torque from any position.'
  ],
  formulas: [
    {
      name: 'Displacement of a piston motor',
      expr: 'V = z*pi*d^2/4*s', tex: 'V = z\\,\\dfrac{\\pi d^2}{4}\\,s',
      vars: {
        V: { name: 'displacement per revolution', q: 'displacement', unit: 'cm³/rev' },
        z: { name: 'number of cylinders', q: 'count', value: 5, int: true },
        d: { name: 'bore', q: 'length', unit: 'mm', value: 60 },
        s: { name: 'stroke (twice the crank radius)', q: 'length', unit: 'mm', value: 45 }
      },
      note: 'Single-acting cylinders, each working once a revolution. The mean full-admission torque is V p / 2π.',
      practice: { unknowns: ['V', 'd'] },
      stories: { V: 'A radial air motor has {z} cylinders of {d} bore and {s} stroke. What is its displacement?', d: 'What bore do {z} cylinders of {s} stroke need for a displacement of {V}?' }
    },
    {
      name: 'Torque from one cylinder',
      expr: 'T = p*A*r*sin(theta)', tex: 'T = p\\,A\\,r\\,\\sin\\theta',
      vars: {
        T: { name: 'torque on the crank', q: 'torque', unit: 'N·m' },
        p: { name: 'gauge pressure in the cylinder', q: 'pressure', unit: 'bar', value: 6 },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 28.27 },
        r: { name: 'crank radius (half the stroke)', q: 'length', unit: 'mm', value: 22.5 },
        theta: { name: 'crank angle from top dead centre', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'During the working stroke, neglecting the slant of the connecting rod. Every torque below the peak occurs at two angles.',
      practice: { unknowns: ['T', 'theta'] },
      stories: { T: 'A piston of {A} at {p} works on a crank of radius {r}. What torque does it give at {theta}?', theta: 'At what crank angles does a piston of {A} at {p} on a {r} crank give {T}?' }
    },
    {
      name: 'Worst-case torque with an odd number of cylinders',
      expr: 'k = (pi/(2*z))/tan(pi/(2*z))', tex: 'k_{\\min} = \\dfrac{\\pi/2z}{\\tan(\\pi/2z)}',
      vars: {
        k: { name: 'lowest torque as a fraction of the mean', q: 'ratio', unit: '%', tex: 'k_{\\min}' },
        z: { name: 'number of cylinders (odd)', q: 'count', value: 5, int: true, min: 3, max: 15 }
      },
      note: 'Equal cylinders evenly spaced, each pushing for half a turn with full admission. An even number z works like z/2 opposed pairs.',
      stories: { k: 'A radial motor has {z} cylinders. What fraction of its mean torque can it be sure to start with?' }
    }
  ],
  examples: [
    {
      title: 'A radial motor for a winch',
      q: 'A five-cylinder radial air motor has a 60 mm bore and a 45 mm stroke. Find its displacement, its mean full-admission torque at 6 bar gauge, and the torque it can count on to start.',
      steps: [
        'Piston area $\\pi \\times 6.0^2/4 = 28.27$ cm²; $V = 5 \\times 28.27 \\times 4.5 = 636$ cm³ per revolution.',
        'Mean torque $V p/(2\\pi) = 636\\times10^{-6} \\times 6\\times10^{5}/(2\\pi) = 60.8$ N·m.',
        'Worst position: $k_{\\min} = 0.967$ for five cylinders, so about $0.967 \\times 60.8 = 58.8$ N·m — before leakage and friction.'
      ],
      a: 'About 636 cm³/rev and 61 N·m mean; it can start against roughly 59 N·m from any position (less in practice).'
    },
    {
      title: 'Why a two-cylinder motor sticks',
      q: 'A motor has two opposed cylinders, each giving $pAr\\sin\\theta$ during its working half-turn. What torque does it have with the crank at 0°?',
      steps: [
        'Cylinder 1 is at $\\theta = 0$: $\\sin 0 = 0$.',
        'Cylinder 2 is at 180°, the end of its stroke: $\\sin 180° = 0$.',
        'The total is zero: at this dead point no pressure can turn the crank — the motor needs a push, like a single-cylinder engine.'
      ],
      a: 'Zero: two opposed cylinders have dead points; three or more (preferably odd) do not.'
    }
  ],
  quiz: [
    { q: 'Why do radial air motors usually have an odd number of cylinders, such as five?', choices: ['Their working strokes interleave evenly, so the torque ripples least', 'Odd numbers use less air at free speed', 'The distributor valve needs an odd number of ports', 'An even number cannot be balanced'], a: 0, why: 'With an even number, opposite cylinders act together in pairs, so six ripple like three. Five ripple only about 5 %.' },
    { q: 'Compared with a vane motor of the same power, a radial piston motor…', choices: ['starts a heavy load from any position and runs smoothly slowly, but is heavier and dearer', 'is lighter and faster', 'needs no lubrication', 'cannot be reversed'], a: 0, why: 'That is the trade: starting torque and smoothness for weight, cost and moving parts.' },
    { q: 'A single-cylinder air motor can start from any crank position.', a: false, why: 'At top and bottom dead centre $\\sin\\theta = 0$, and on its return stroke it gives nothing at all.' },
    { q: 'A piston of 20 cm² at 6 bar gauge works on a 25 mm crank. What torque does it give at 90°?', answer: 30, unit: 'N·m', why: '$T = 6\\times10^5 \\times 20\\times10^{-4} \\times 0.025 \\times 1 = 30$ N·m.' }
  ],
  problems: [
    { q: 'A five-cylinder radial motor has 50 mm bores and a 40 mm stroke. What is its mean full-admission torque at 6 bar gauge?', answer: 37.5, unit: 'N·m', tol: 0.02,
      steps: ['$V = 5 \\times \\pi \\times 5^2/4 \\times 4 = 392.7$ cm³.', '$T = 392.7\\times10^{-6} \\times 6\\times10^5/(2\\pi) = 37.5$ N·m.'] }
  ],
  choose: {
    good: [
      'Hoists, winches and capstans: full torque to start from any position, steady at low speed.',
      'Heavy mixers and feed drives that must creep smoothly without a big gearbox.',
      'Explosive or wet places where the load needs more starting torque than a vane motor gives.'
    ],
    avoid: [
      'Light, fast drives and hand tools: a vane motor is lighter, cheaper and faster.',
      'Places that need oil-free exhaust, unless the motor is made for it.',
      'Continuous heavy duty where an electric or hydraulic drive would cost far less to run.'
    ],
    check: [
      'Starting torque at the lowest pressure the motor will get, against the load\'s breakaway torque.',
      'The brake: spring-applied, released by air, sized for the load.',
      'Lubrication, air dryness, and the exhaust noise.',
      'Weight and mounting, and the speed range you need.'
    ]
  },
  applications: [
    'Air chain hoists and wire-rope winches in refineries, shipyards and mines.',
    'Anchor and mooring winches and capstans where electricity is unwelcome.',
    'Slow agitators for thick pastes and adhesives.',
    'The hydraulic cousins — radial-piston LSHT motors — do the same job with oil at far higher torque ([[hydraulics:lsht-motors]]).'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — piston pumps and motors, and pneumatic components.',
    'ISO 4414, *Pneumatic fluid power — General rules and safety requirements for systems and their components*.',
    'ISO 4301-1, *Cranes — Classification — General*: the duty groups that hoist mechanisms, including air hoists, are rated for.'
  ],
  sim: 'as-piston-motor'
},

{
  id: 'turbine-air-motors', parent: 'air-motor-topic', title: 'Turbine air motors', level: 2,
  short: 'Air turbines blow jets of expanding air at hundreds of metres per second onto small bladed rotors. Their torque also falls in a straight line with speed and their power peaks at half the runaway speed, so they spin extremely fast — dental handpieces, governed grinders, high-speed spindles and engine starters — light, oil-free and smooth, but weak at low speed.',
  keywords: ['air turbine', 'turbine motor', 'impulse turbine', 'jet speed', 'nozzle', 'blade speed', 'runaway speed', 'governor', 'turbine grinder', 'dental turbine', 'air turbine starter', 'oil-free', 'high speed', 'isentropic expansion', 'overspeed'],
  prereq: ['air-motor-principle', 'pneumatics:choked-flow', 'hydraulics:pelton-wheel'],
  related: ['vane-air-motors', 'air-motor-control', 'air-motor-applications', 'motors-machine-tools', 'pneumatics:air-tools', 'pneumatics:isothermal-adiabatic', 'aerodynamics:propellers'],
  body: `
A turbine has no chambers at all. The air expands through **nozzles** into fast jets, and the jets strike or pass through curved **blades** (buckets) on a light rotor. Nothing rubs — the only contacts are the bearings — so turbines run oil-free, with little vibration, at speeds no vane could survive.

### How fast is the jet?
Expanding from the supply pressure $p_0$ to the atmosphere $p_a$ without losses, air reaches the speed

$$v = \\sqrt{2c_pT_0\\left[1 - \\left(\\frac{p_a}{p_0}\\right)^{(\\gamma-1)/\\gamma}\\right]}$$

with $c_p$ = 1005 J/(kg·K), $\\gamma$ = 1.4 and the supply temperature $T_0$ in kelvin. From 6 bar gauge (7 bar absolute) at 20 °C that is about **500 m/s**, one and a half times the speed of sound in still air — a simple converging nozzle chokes at the speed of sound in its throat and the jet finishes expanding outside it. The expansion also chills the jet far below freezing (see [[air-motor-control]]).

### The same straight line, much faster
Like a [[hydraulics:pelton-wheel|Pelton wheel]], an impulse blade moving at speed $u$ sees the jet arrive at $v - u$, and the force it gets is [[?proportional|proportional]] to that difference. So the torque falls in a straight line from standstill to the **runaway speed** where the blades move as fast as the jet — the same line as every air motor — and the power

$$P = 2\\dot m\\,u\\,(v - u)$$

(for buckets that turn the jet right round) peaks when the blades move at **half the jet speed**, where in principle all the jet's kinetic energy is taken. With a 500 m/s jet the best blade speed is about 250 m/s. On a rotor of radius $r$ that means

$$n = \\frac{v}{4\\pi r}$$

— about 120 000 rpm for a 20 mm radius and 600 000 rpm for 4 mm. Turbines are fast because the jet is fast and the rotor small.

| Where turbines are used | Typical speed | Why a turbine |
|---|---|---|
| Dental handpieces | 300 000–400 000 rpm | tiny, light, oil-free, easy to sterilise; only watts to tens of watts |
| Air-turbine spindles (engraving, fine milling, deburring) | tens of thousands of rpm | smooth, no heat from a winding, clean |
| Turbine grinders (125–230 mm wheels) | governed to the wheel's rating: about 6600–12 000 rpm at 80 m/s rim speed | high power for their weight, speed held by a governor under load |
| Air-turbine starters on large diesel and gas engines and on jet engines | turbine fast, output through a reduction gearbox | high power for seconds, no batteries, robust |

### Governors and overspeed
Left alone, a turbine at light load races towards its runaway speed. Grinding wheels burst if spun too fast, so turbine grinders carry a **governor** — a centrifugal valve that throttles the air as the speed rises — and hold nearly constant speed from no load to full load. The rim speed of a wheel is $\\pi D n$: a 180 mm wheel rated for 80 m/s may turn at most $80/(\\pi \\times 0.18)$ = 141 rev/s, about 8500 rpm.

> [!warn] Never fit a wheel, disc or cutter whose marked maximum speed is below the tool's speed, and never run a turbine or grinder with a faulty or tampered governor: an overspeeding wheel can burst with lethal force. Shut off and exhaust the air before changing wheels, and wear eye, face and hearing protection.

### Strengths and weaknesses
- **Weak at low speed**: the stall torque of a small fast rotor is small, so turbines need a gearbox for slow loads and cannot start high-breakaway loads directly.
- **Efficiency**: near its design speed a well-made turbine uses its air well; away from it the efficiency falls quickly, following the parabola.
- **Noise**: a high-pitched whine plus exhaust noise — silencers and piped exhausts matter.
- **Oil-free**: bearings greased or air-lubricated for life; clean exhaust for medical, food and electronics work.

> [!key] A turbine turns the speed of an expanding jet into torque: force ∝ (jet speed − blade speed), power peaks at half the jet speed, so the rotor must spin enormously fast. Use one where speed, lightness and clean air matter; add a governor where overspeed is dangerous and a gearbox where torque is needed.
`,
  ideas: [
    'Air expanding from 6 bar gauge can reach about 500 m/s in an ideal nozzle.',
    'The force on an impulse blade is proportional to jet speed minus blade speed: torque falls linearly to the runaway speed.',
    'Power peaks when the blades move at half the jet speed, so small rotors must spin at tens or hundreds of thousands of rpm.',
    'Governors hold turbine grinders at the wheel\'s rated speed; overspeed bursts wheels.',
    'Turbines are oil-free and smooth but weak at low speed and need gearing for torque.'
  ],
  pitfalls: [
    'A turbine gives most power at its highest speed — At runaway speed the blades move with the jet and take no energy; the peak is at half the jet speed.',
    'Any wheel that fits the spindle is safe — Only a wheel rated for at least the tool\'s governed speed is; the rim speed πDn must stay within its marking.',
    'Turbines are good for slow, heavy starting loads — Their stall torque is small; they need a reduction gearbox, as air starters on engines have.'
  ],
  formulas: [
    {
      name: 'Ideal jet speed of expanding air',
      expr: 'v = sqrt(2*cp*T0*(1 - (pa/p0)^((k - 1)/k)))', tex: 'v = \\sqrt{2c_pT_0\\left[1 - \\left(\\dfrac{p_a}{p_0}\\right)^{(\\gamma-1)/\\gamma}\\right]}',
      vars: {
        v: { name: 'jet speed', q: 'speed', unit: 'm/s' },
        cp: { name: 'specific heat of air at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' },
        T0: { name: 'supply temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_0' },
        pa: { name: 'outlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.0, tex: 'p_a' },
        p0: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_0' },
        k: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' }
      },
      note: 'Isentropic expansion: all the enthalpy drop becomes kinetic energy. Absolute pressures. A converging nozzle alone chokes at the speed of sound; the rest of the expansion happens outside it.',
      practice: { unknowns: ['v', 'p0'] },
      stories: { v: 'Air at {T0} and {p0} absolute expands to {pa}. How fast can the jet be?', p0: 'What absolute supply pressure gives an ideal jet of {v} from air at {T0} into {pa}?' }
    },
    {
      name: 'Power of an ideal impulse turbine',
      expr: 'P = 2*m*u*(v - u)', tex: 'P = 2\\dot m\\,u\\,(v - u)',
      vars: {
        P: { name: 'power to the rotor', q: 'power', unit: 'W' },
        m: { name: 'mass flow of air', q: 'massflow', unit: 'kg/s', value: 0.01, tex: '\\dot m' },
        u: { name: 'blade speed', q: 'speed', unit: 'm/s', value: 200, min: 0, max: 2000 },
        v: { name: 'jet speed', q: 'speed', unit: 'm/s', value: 500 }
      },
      note: 'Buckets that turn the jet right round, no friction. Largest, ṁv²/2, at u = v/2; 0.01 kg/s is about 0.5 m³/min of free air.',
      practice: { unknowns: ['P', 'u'] },
      stories: { P: 'A jet of {v} carrying {m} of air drives buckets moving at {u}. What power can they take?', u: 'At what blade speeds does a jet of {v} and {m} deliver {P}?' }
    },
    {
      name: 'Best rotor speed',
      expr: 'n = v/(4*pi*r)', tex: 'n = \\dfrac{v}{4\\pi r}',
      vars: {
        n: { name: 'rotor speed for blades at half the jet speed', q: 'frequency', unit: 'rpm' },
        v: { name: 'jet speed', q: 'speed', unit: 'm/s', value: 500 },
        r: { name: 'radius of the blade ring', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Blade speed u = 2πnr = v/2.',
      stories: { n: 'A turbine\'s blades sit at a radius of {r} in a jet of {v}. At what speed should it run?', r: 'A turbine must run best at {n} with a jet of {v}. What blade radius does it need?' }
    }
  ],
  examples: [
    {
      title: 'Jet and rotor of a small turbine',
      q: 'Air at 20 °C and 6 bar gauge (7.0 bar absolute) drives an impulse turbine with its blades at 15 mm radius. Estimate the ideal jet speed, the best rotor speed and the runaway speed.',
      steps: [
        '$(1/7)^{0.2857} = 0.5735$; $v = \\sqrt{2 \\times 1005 \\times 293 \\times 0.4265} = 501$ m/s.',
        'Best speed: $n = 501/(4\\pi \\times 0.015) = 2660$ rev/s, about 160 000 rpm.',
        'Runaway (blades as fast as the jet): twice that, about 320 000 rpm — real runaway is lower because of friction and windage, but still far beyond what a load or a wheel may see.'
      ],
      a: 'About 500 m/s; best near 160 000 rpm; runaway up to about 320 000 rpm, which is why governors exist.'
    },
    {
      title: 'Choosing a grinding wheel',
      q: 'A turbine grinder is governed to 8500 rpm. A 180 mm wheel is marked 80 m/s. May it be fitted? What about a 230 mm wheel of the same rating?',
      steps: [
        'Rim speed of the 180 mm wheel: $\\pi \\times 0.18 \\times 8500/60 = 80.1$ m/s — right at its rating: acceptable only if the tool\'s marked speed is not above the wheel\'s marked maximum rpm.',
        '230 mm wheel: $\\pi \\times 0.23 \\times 141.7 = 102$ m/s — far over 80 m/s: never.'
      ],
      a: 'The 180 mm wheel matches the governed speed; the 230 mm wheel would overspeed by about a quarter and must not be used.'
    }
  ],
  quiz: [
    { q: 'An impulse air turbine gives its greatest power when its blades move at…', choices: ['half the jet speed', 'the jet speed', 'a quarter of the jet speed', 'as slowly as possible'], a: 0, why: '$P = 2\\dot m u(v - u)$ is largest at $u = v/2$; at $u = v$ the blades just ride along with the jet.' },
    { q: 'Why do air turbines spin so fast?', choices: ['The jet is several hundred m/s and the rotor is small, so half the jet speed means a huge rpm', 'Air has no friction', 'They have no load', 'Governors make them fast'], a: 0, why: '$n = v/(4\\pi r)$: 500 m/s on a 20 mm radius is about 120 000 rpm.' },
    { q: 'A turbine grinder\'s governor fails. What is the main danger?', choices: ['The wheel overspeeds towards the runaway speed and can burst', 'The motor overheats and burns', 'The exhaust stops', 'It loses torque'], a: 0, why: 'At light load a turbine races towards its runaway speed; the wheel\'s rim speed rises in proportion.' },
    { q: 'What is the ideal jet speed of air at 20 °C expanding from 4 bar absolute to 1 bar absolute?', answer: 439, unit: 'm/s', why: '$(1/4)^{0.2857} = 0.673$; $v = \\sqrt{2 \\times 1005 \\times 293 \\times 0.327} = 439$ m/s — lower pressure, slower jet, slower best rotor speed.' }
  ],
  problems: [
    { q: 'A jet of 500 m/s carrying 0.02 kg/s of air drives ideal buckets moving at 250 m/s. What power do they take?', answer: 2500, unit: 'W', tol: 0.02,
      steps: ['$P = 2 \\times 0.02 \\times 250 \\times (500 - 250) = 2500$ W.', 'That is all the jet\'s kinetic power, $\\dot m v^2/2 = 0.02 \\times 500^2/2 = 2500$ W.'] }
  ],
  choose: {
    good: [
      'Very high speeds from a light, cool, vibration-free drive: dental and medical handpieces, fine spindles.',
      'Governed grinders where power-to-weight and steady speed under load matter.',
      'Engine starters and oil-free, clean-exhaust duties.'
    ],
    avoid: [
      'Slow loads and heavy breakaway torque without a reduction gearbox.',
      'Wide speed ranges: efficiency falls away from the design speed.',
      'Any use where the governor could be bypassed or a wrongly rated wheel fitted.'
    ],
    check: [
      'The governed or maximum speed against every wheel, disc or cutter it will carry.',
      'Air supply: pressure at the tool while running, dryness (the jet is far below freezing), filtration.',
      'Noise level, exhaust routing and hearing protection.',
      'Gearbox ratio and starting torque for starters and slow drives.'
    ]
  },
  applications: [
    'Dental high-speed handpieces, whose small turbines run at hundreds of thousands of rpm.',
    'Turbine-driven grinders in foundries and shipyards.',
    'Air-turbine starters on aircraft jet engines, fed by an auxiliary power unit or a ground cart, and on large diesel and gas engines.',
    'The rim-speed arithmetic of grinding wheels is in [[motors-machine-tools]].'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — pneumatic components and air motors.',
    'ISO 4414, *Pneumatic fluid power — General rules and safety requirements for systems and their components*.',
    'Grinding-wheel safety rules (for example EN 12413 for bonded abrasive products) require the maximum operating speed marked on every wheel to be respected.'
  ],
  sim: 'as-turbine'
},

{
  id: 'air-motor-control', parent: 'air-motor-topic', title: 'Controlling an air motor', level: 2,
  short: 'An air motor is started, stopped and reversed by a directional valve, slowed by throttling its inlet or its exhaust, and torque-limited by a pressure regulator. The valve and hoses must pass its air without a large drop; the air must be filtered, dry and (for most motors) oiled; and the cold, loud exhaust must be silenced or piped away.',
  keywords: ['air motor control', 'speed control', 'inlet throttling', 'exhaust throttling', 'meter-in', 'meter-out', 'pressure regulator', 'torque limiting', 'reversing valve', '5/3 valve', 'closed centre', 'exhaust centre', 'valve sizing', 'sonic conductance', 'silencer', 'exhaust icing', 'lubricator', 'FRL', 'brake'],
  prereq: ['air-motor-principle', 'pneumatics:flow-control-pneu', 'pneumatics:sonic-conductance'],
  related: ['vane-air-motors', 'piston-air-motors', 'air-motor-applications', 'motor-brakes', 'emergency-stop', 'pneumatics:frl-units', 'pneumatics:pressure-regulators', 'pneumatics:noise-silencers', 'pneumatics:pressure-dew-point', 'pneumatics:way-valves'],
  body: `
Everything that controls an air motor sits in its air line. A typical circuit runs: a lockable **isolating and dump valve** (which also exhausts the system), a **filter–regulator–lubricator** ([[pneumatics:frl-units|FRL]]), a **directional valve**, **flow controls**, the motor, and a **silencer** or an exhaust pipe. The sim below draws it with the ISO 1219 symbols and lets you try each way of control.

### Speed: throttle the inlet or the exhaust
Throttling limits the flow, and since a motor's air use rises with its speed, it limits the speed. At standstill no air flows, so no pressure is lost across the throttle and the **stall torque stays**: the torque line swings about its stall point towards a lower free speed. The motor slows at light load but still starts heavy loads.

| Method | Stall torque | Free speed | Air for the same speed | Best for |
|---|---|---|---|---|
| Throttle the inlet (meter-in) | kept | lowered | least — the chambers fill at reduced pressure | simple one-direction drives |
| Throttle the exhaust (meter-out) | kept | lowered | more — the chambers stay at supply pressure | loads that overrun (lowering, braking), quieter exhaust |
| Lower the pressure (regulator) | lowered in proportion | lowered a little | less | limiting torque: tensioning, screwing to a torque |
| Proportional valve and speed sensor | as needed | held in closed loop | — | steady speed under changing load |
| Built-in governor | kept | held near the set speed | — | grinders and tools |

When the load **drives** the motor — a winch lowering, a conveyor running downhill — a motor throttled at its inlet simply runs faster, pumping air; throttled at its exhaust it must push its air out through the restriction, which brakes it. The rule is the same as for [[pneumatics:flow-control-pneu|cylinders]]: meter out when the load can overrun. For a reversible motor use a throttle with a bypass check valve in each line, or throttle the valve's two exhaust ports separately.

### Torque: set the pressure
Because the stall torque is [[?proportional|proportional]] to the gauge pressure, a regulator is a **torque limiter**. Stall-type nutrunners and tensioning winches run until the load stops them, then hold exactly the torque the pressure allows — as long as it is the pressure at the motor, measured while air flows.

### Start, stop, reverse
A 3/2 valve starts and stops a one-direction motor. A reversible motor needs a 5/3 (or 4/3) valve, and the centre position matters:
- **Exhaust centre**: both motor ports vent; the motor coasts to a stop — and a hanging load falls unless a brake holds it.
- **Closed centre**: the ports are blocked; the motor compresses the trapped air and brakes hard, but leakage lets a load creep, and the trapped pressure stays in the lines.

Air motors can be started, stopped and reversed as often as the job needs. Holding is a brake's job: a **spring-applied brake** released by air — often through a shuttle valve from whichever motor line is pressurised — sets whenever the valve returns to centre or the air fails (see [[motor-brakes]]).

### Size the valve and hoses for the flow
A motor that needs 20 L/s of free air loses torque and speed if the valve cannot pass it. With the [[pneumatics:sonic-conductance|sonic conductance]] $C$ and critical pressure ratio $b$ of the valve, the flow at a small pressure drop is

$$Q = C\\,p_1\\sqrt{1 - \\left(\\frac{p_2/p_1 - b}{1 - b}\\right)^2}$$

(absolute pressures, air at about 20 °C). Aim for a drop of a few tenths of a bar at full flow, and count hoses and couplings too — they are often worse than the valve.

### Air quality, noise and icing
Filter the air (typically 5–40 µm, finer for oil-free motors), drain water, and set the lubricator as the motor's maker says — or use an oil-free motor on clean, dry air ([[pneumatics:iso-8573|ISO 8573-1]] classes). The exhaust is loud: a silencer, or a pipe to a collector, is essential, but a clogged silencer throttles the exhaust and robs power. The air also cools as it expands; ideally

$$T_2 = T_1\\left(\\frac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma}$$

which from 7 to 1 bar absolute at 20 °C is about −105 °C. A real motor's exhaust is far warmer, because the expansion is partial. A better estimate is that the air leaves colder by the work it has done, $\\Delta T \\approx P/(\\dot m\\,c_p)$: a 1 kW vane motor at full power, using 1.2 m³/min of free air (about 24 g/s), cools its air by about 40 K — from 20 °C to around −20 °C, less if the housing warms it. That is below freezing and, for wet air, below its dew point, so water turns to ice in the exhaust ports and silencer. Dry the air enough (a lower [[pneumatics:pressure-dew-point|pressure dew point]]), use generous silencers, and pipe the exhaust away.

> [!warn] Before working on an air motor, its valve or its load: lower or support the load, shut and lock the isolating valve, and exhaust the lines — a closed-centre valve keeps pressure trapped between it and the motor. An emergency stop that dumps the air stops the torque but not a coasting load: brakes and safety functions are designed to [[emergency-stop|machinery-safety standards]].

> [!key] Throttle the flow to set the speed (the stall torque stays), meter out when the load can overrun, set the pressure to set the torque, let a spring brake hold, size the valve and hoses for the flow, and dry, filter and silence the air.
`,
  ideas: [
    'Throttling lowers the free speed but keeps the stall torque, because no air flows at stall.',
    'Meter out (throttle the exhaust) when the load can drive the motor; meter in uses less air.',
    'A regulator limits the stall torque in proportion to the gauge pressure: a torque limiter.',
    'An exhaust-centre valve lets the motor coast; a closed centre brakes on trapped air; only a brake holds.',
    'Expanding air cools sharply: wet air ices the exhaust; dry it and silence or pipe the exhaust.'
  ],
  pitfalls: [
    'Throttling an air motor weakens it — Only at speed: at stall no air flows, the throttle drops no pressure and the full stall torque remains.',
    'A closed-centre valve holds a hanging load — Leakage past vanes, pistons and seals lets the load creep; hold it with a brake.',
    'Any valve with the right thread size will do — Valves of the same port size differ greatly in flow; an undersized valve or hose costs a bar or more at the motor.'
  ],
  formulas: [
    {
      name: 'Flow through a valve (ISO 6358, subsonic)',
      expr: 'Q = C*p1*sqrt(1 - ((p2/p1 - b)/(1 - b))^2)', tex: 'Q = C\\,p_1\\sqrt{1 - \\left(\\dfrac{p_2/p_1 - b}{1 - b}\\right)^2}',
      vars: {
        Q: { name: 'free-air flow through the valve', q: 'airflow', unit: 'L/s ANR' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 8.1 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.3, tex: 'p_1' },
        p2: { name: 'downstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_2' },
        b: { name: 'critical pressure ratio', value: 0.3, min: 0, max: 0.6 }
      },
      note: 'For p₂/p₁ above b (not choked) and air at about 20 °C. Choked flow is Q = C p₁. See [[pneumatics:sonic-conductance]].',
      practice: { unknowns: ['Q', 'C'] },
      stories: { Q: 'A valve with C = {C} and b = {b} feeds a motor from {p1} to {p2} absolute. How much free air passes?', C: 'A motor needs {Q} with no more than a drop from {p1} to {p2} absolute (b = {b}). What conductance must the valve have?' }
    },
    {
      name: 'Temperature after an ideal expansion',
      expr: 'T2 = T1*(p2/p1)^((k - 1)/k)', tex: 'T_2 = T_1\\left(\\dfrac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma}',
      vars: {
        T2: { name: 'temperature after expansion', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'supply temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        p2: { name: 'exhaust pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.0, tex: 'p_2' },
        p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_1' },
        k: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' }
      },
      note: 'Adiabatic and reversible: the coldest the air could get. A real motor\'s exhaust is much warmer, but can still drop below freezing.',
      practice: { unknowns: ['T2', 'p1'] },
      stories: { T2: 'Air at {T1} and {p1} absolute expands to {p2} without heat or losses. How cold does it get?' }
    }
  ],
  examples: [
    {
      title: 'An undersized valve',
      q: 'A 1 kW vane motor needs 20 L/s of free air at 6.3 bar gauge (7.3 bar absolute) upstream. (a) What sonic conductance keeps the drop to 0.3 bar (b = 0.3)? (b) What pressure reaches the motor through a valve of C = 4 dm³/(s·bar)?',
      steps: [
        '(a) $p_2/p_1 = 7.0/7.3 = 0.959$; $(0.959 - 0.3)/0.7 = 0.941$; $\\sqrt{1 - 0.941^2} = 0.338$. $C = 20/(7.3 \\times 0.338) = 8.1$ dm³/(s·bar).',
        '(b) $\\sqrt{1 - y^2} = 20/(4 \\times 7.3) = 0.685$, so $y = 0.729$ and $p_2/p_1 = 0.3 + 0.7 \\times 0.729 = 0.810$: $p_2 = 5.9$ bar absolute, 4.9 bar gauge.',
        'The motor loses 1.4 bar: its stall torque falls to $4.9/6.3$ = 78 % and its power to about two-thirds.'
      ],
      a: 'C of about 8 dm³/(s·bar); with C = 4 the motor gets only 4.9 bar gauge and loses about a third of its power.'
    },
    {
      title: 'Lowering a load on a winch',
      q: 'An air winch lowers a load that drives the motor. Why does the circuit throttle the exhaust rather than the inlet, and what holds the load when the valve is centred?',
      steps: [
        'Lowering, the load turns the motor faster than the air alone would; with an inlet throttle nothing resists, and the load runs away.',
        'With the exhaust throttled, the motor must push its air out through the restriction; the back pressure brakes it and the speed stays controlled.',
        'At rest the valve centres, the brake line exhausts and a spring-applied brake sets. The motor itself never holds the load.'
      ],
      a: 'Meter out to control an overrunning load; a spring-applied brake holds it.'
    }
  ],
  quiz: [
    { q: 'You throttle the inlet of an air motor. What happens to its stall torque and free speed?', choices: ['Stall torque stays, free speed falls', 'Both fall in proportion', 'Stall torque falls, free speed stays', 'Nothing changes'], a: 0, why: 'At stall no air flows, so the throttle drops no pressure; at speed it limits the flow and so the speed.' },
    { q: 'An air nutrunner must tighten bolts to a set torque. The simplest way is to…', choices: ['set the pressure at the tool with a regulator, since the stall torque follows it', 'throttle the inlet', 'throttle the exhaust', 'use a bigger valve'], a: 0, why: 'Stall torque is proportional to the gauge pressure; throttling would change the speed, not the stall torque.' },
    { q: 'A reversible air motor on a 5/3 exhaust-centre valve drives a hoist with no brake. The valve is centred. What happens?', choices: ['Both motor ports vent and the load runs down', 'The motor holds the load', 'The motor brakes on trapped air and stops', 'The valve pressurises both ports'], a: 0, why: 'An exhaust centre vents both lines, so nothing resists the load. Hoists need a brake.' },
    { q: 'Throttling the exhaust of an air motor uses less air than throttling its inlet for the same speed.', a: false, why: 'With exhaust throttling the chambers fill at full supply pressure, so each revolution takes more air; inlet throttling fills them at reduced pressure.' },
    { q: 'Ice forms in an air motor\'s silencer. The first remedy is to…', choices: ['dry the compressed air to a lower dew point', 'raise the supply pressure', 'add more oil', 'throttle the exhaust harder'], a: 0, why: 'The ice is water from the air, frozen by the cooling of the expansion. Less water, and generous silencers or a piped exhaust, stop it.' }
  ],
  problems: [
    { q: 'Air at 20 °C and 5 bar absolute expands ideally to 1 bar absolute. What temperature does it reach?', answer: -88, unit: '°C', tol: 0.03,
      steps: ['$(1/5)^{0.2857} = 0.631$.', '$T_2 = 293.15 \\times 0.631 = 185$ K $= -88$ °C.'] }
  ],
  choose: {
    good: [
      'Inlet throttling for simple speed setting of one-direction motors with resisting loads.',
      'Exhaust throttling (with bypass check valves) for reversible motors and loads that can overrun.',
      'A regulator at the tool for torque limiting; a governor or closed loop where the speed must stay put.'
    ],
    avoid: [
      'Relying on a valve centre position to hold a load: use a spring-applied brake.',
      'Throttling the supply to a whole machine to slow one motor: throttle at the motor.',
      'Unsilenced exhausts, and silencers left to clog.'
    ],
    check: [
      'The valve\'s flow (C, b or Cv) and the hose and coupling sizes against the motor\'s air at full speed.',
      'The pressure at the motor inlet while running.',
      'Air quality: filtration, dew point low enough to avoid exhaust icing, lubrication or oil-free.',
      'Brake release and set logic, the emergency stop and dump valve, and how the load is held.'
    ]
  },
  applications: [
    'Winch and hoist circuits: meter-out throttles, a 5/3 valve and an air-released spring brake.',
    'Stall-type nutrunners and tensioning drives set by a precision regulator.',
    'Paint-mixer drives with a simple inlet throttle and a piped exhaust.',
    'Valve and pipe calculators: [the pneumatics valve tool](#/tools/pneu/valve) in Hyper Pneumatics.'
  ],
  sources: [
    'ISO 6358-1, *Pneumatic fluid power — Determination of flow-rate characteristics of components using compressible fluids*: sonic conductance C and critical pressure ratio b.',
    'ISO 1219-1, *Fluid power systems and components — Graphical symbols and circuit diagrams*.',
    'ISO 8573-1, *Compressed air — Contaminants and purity classes*.',
    'ISO 4414, *Pneumatic fluid power — General rules and safety requirements for systems and their components*.'
  ],
  sim: 'as-air-control'
},

{
  id: 'air-motor-applications', parent: 'air-motor-topic', title: 'Where air motors win', level: 1,
  short: 'Air motors win where an electric motor would be unsafe, unhappy or overworked: explosive, wet, hot or dirty places, duties that stall and reverse all day, light hand tools and simple variable speed. They lose wherever the running hours are long, because each shaft kilowatt costs 7–10 kW of compressor electricity.',
  keywords: ['air motor applications', 'explosive atmosphere', 'ATEX', 'washdown', 'air tools', 'nutrunner', 'running cost', 'break-even', 'payback', 'air versus electric', 'cordless tools', 'mixer', 'agitator', 'air starter', 'hoist'],
  prereq: ['air-motor-principle', 'pneumatics:cost-of-compressed-air'],
  related: ['hazardous-areas', 'motor-life-cost', 'motor-comparison', 'vane-air-motors', 'piston-air-motors', 'turbine-air-motors', 'air-motor-control', 'hydraulic-motor-principle', 'pneumatics:pneumatic-vs-electric', 'pneumatics:air-tools', 'pneumatics:air-leaks'],
  body: `
Nobody chooses an air motor for its efficiency. It is chosen because of what it tolerates — and the decision is honest only when the cost of its air is on the table too.

### Where they win
| Situation | Why an air motor | Examples |
|---|---|---|
| Explosive gas, vapour or dust | no electrical ignition source; certified air motors are made for hazardous zones | paint and solvent mixers, drum pumps, refinery and offshore hoists, flour and grain handling, mines |
| Water, washdown, humidity | nothing electrical to short or corrode; stainless and oil-free versions | food processing, deck machinery, car washes |
| Frequent stalls, starts and reversals | stalling is harmless and costs no heat | nutrunners, tapping, tensioning, winches, capstans |
| Heat and heavy vibration | no winding insulation to age, no electronics | foundries, forges, vibrating equipment (within the maker's temperature limits) |
| Hand tools | high power for their weight, cool to hold, no cable to the mains | grinders, drills, impact wrenches, sanders |
| Simple variable speed | a valve and a throttle, no drive electronics | agitators, feeders, winches |
| Air already piped, short duty | cheap to install | occasional drives, maintenance tools |

### Where they lose
- **Running cost**: each shaft kilowatt costs 7–10 kW at the compressor (see [[air-motor-principle]]) — more with leaks, pressure drops and compressors idling.
- **Noise and exhaust**: silencers, piped exhausts and hearing protection.
- **Precision**: the speed follows the load and the pressure; no position holding without a brake.
- **No air network**: a compressor, dryer and pipes cost more than the motor.

### The arithmetic
For a shaft power $P$ running $t$ hours a year, with $a$ m³/min of free air per kW, a compressor needing $w$ kW per m³/min and electricity at $c$ per kWh, the air costs

$$C_{\\text{air}} = P\\,a\\,w\\,t\\,c$$

while an electric motor of efficiency $\\eta$ costs $P\\,t\\,c/\\eta$. If the electric solution costs $\\Delta K$ more to buy (a certified motor, a drive, a cable), it pays for itself within a year once the hours exceed

$$t = \\frac{\\Delta K}{P\\,c\\,(a\\,w - 1/\\eta)}$$

With typical numbers the bill for air is **seven to ten times** the electric one; a few hundred hours a year are enough to justify the electric drive. Leaks in the network — often a fifth or more of a compressor's output — raise the real cost further ([[pneumatics:air-leaks]]). The sim below draws the energy flow from the meter to the shaft for both and the cost against running hours.

### The competition
| | Air motor | Electric motor for hazardous areas | Hydraulic motor |
|---|---|---|---|
| Ignition safety | no electrical sources; certified versions for zones | by protection type: flameproof enclosure, increased safety and others ([[hazardous-areas]]) | no electrical sources at the motor; hot oil and leaks |
| Stall and overload | harmless | needs protection, current limits | relief valve limits torque; heat in the oil |
| Running cost | high | low | medium (pump, losses) |
| Weight at the machine | very low | high | very low for its torque |
| Infrastructure | compressed air | cables, certified glands, often a drive | power unit, hoses |
| Noise | loud exhaust | quiet | pump noise |

For portable tools, **cordless brushless** tools have taken over much of the occasional work that air tools used to do; air still leads where tools run all shift, are dropped and abused, or stall constantly. For very high torque in a hostile place, a [[hydraulic-motor-principle|hydraulic motor]] is often better.

> [!warn] "Pneumatic" does not mean "safe in an explosive atmosphere". A failing vane or bearing can make sparks and hot surfaces, and plastic parts and hoses can build static charge. Use only motors certified for the zone and temperature class, earth them, and follow the site's hazardous-area rules and the maker's instructions.

### How to decide
1. Is there an explosive atmosphere, water, heat or constant stalling? If not, an electric motor is almost always cheaper.
2. How many hours a year? Work out $C_{\\text{air}}$ and the break-even hours.
3. Is compressed air already there, clean and dry, with capacity to spare?
4. Can the noise be handled, and can a brake hold whatever must not move?
5. Compare with an Ex-rated electric motor and with hydraulics for the same duty (see [[motor-comparison]]).

> [!key] Choose an air motor for safety, ruggedness, stall-proof duty and light tools; reject it for long running hours. Put the cost of air — seven to ten times the electric bill — into the decision.
`,
  ideas: [
    'Air motors are chosen for what they tolerate: explosive, wet, hot places, stalling, reversing, heavy handling.',
    'The yearly cost of the air is P·a·w·t·c: seven to ten times an electric motor\'s.',
    'An electric alternative that costs ΔK more pays back in a year above ΔK / (P c (aw − 1/η)) hours.',
    'Pneumatic is not automatically explosion-proof: certified motors, earthing and zone rules still apply.',
    'Cordless brushless tools and hydraulic motors compete for many former air-motor jobs.'
  ],
  pitfalls: [
    'Air is free, so air motors are cheap to run — The compressor turns most of its electricity into heat; a shaft kilowatt of air costs 7–10 kW of electricity.',
    'Any air motor may be used in a hazardous area — Only certified motors, earthed and used within their temperature class; mechanical sparks and static are real ignition sources.',
    'Air tools are always lighter, so always better in the hand — For occasional work a cordless tool avoids hoses, noise and the air bill.'
  ],
  formulas: [
    {
      name: 'Yearly cost of the air',
      expr: 'C = P*a*w*t*c', tex: 'C_{\\text{air}} = P\\,a\\,w\\,t\\,c',
      vars: {
        C: { name: 'cost of the air per year', q: 'money', unit: '$', tex: 'C_{\\text{air}}' },
        P: { name: 'shaft power', q: false, unit: 'kW', value: 0.75 },
        a: { name: 'free air per shaft kW', q: false, unit: 'm³/min per kW', value: 1.3 },
        w: { name: 'compressor specific power', q: false, unit: 'kW per m³/min', value: 6.5 },
        t: { name: 'running hours per year', q: false, unit: 'h', value: 1500 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.2 }
      },
      note: 'Typical a = 1–1.5, w = 6–7 near 7 bar. Leaks and idling compressors add to it.',
      stories: { C: 'An air motor gives {P} for {t} a year, using {a}; the compressor needs {w} and electricity costs {c} per kWh. What does its air cost a year?', t: 'How many hours a year can a {P} air motor run on a budget of {C} (a = {a}, w = {w}, {c} per kWh)?' }
    },
    {
      name: 'Yearly cost of an electric motor',
      expr: 'Ce = P*t*c/eta', tex: 'C_e = \\dfrac{P\\,t\\,c}{\\eta}',
      vars: {
        Ce: { name: 'electricity cost per year', q: 'money', unit: '$', tex: 'C_e' },
        P: { name: 'shaft power', q: false, unit: 'kW', value: 0.75 },
        t: { name: 'running hours per year', q: false, unit: 'h', value: 1500 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.2 },
        eta: { name: 'motor (and drive) efficiency', q: 'ratio', unit: '%', value: 82, min: 10, max: 100, tex: '\\eta' }
      },
      stories: { Ce: 'An electric motor of {eta} efficiency gives {P} for {t} a year at {c} per kWh. What does its electricity cost?' }
    },
    {
      name: 'Break-even running time',
      expr: 't = dK/(P*c*(a*w - 1/eta))', tex: 't = \\dfrac{\\Delta K}{P\\,c\\,(a\\,w - 1/\\eta)}',
      vars: {
        t: { name: 'running hours per year above which the electric drive pays back in a year', q: false, unit: 'h' },
        dK: { name: 'extra purchase cost of the electric drive', q: 'money', unit: '$', value: 900, tex: '\\Delta K' },
        P: { name: 'shaft power', q: false, unit: 'kW', value: 0.75 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.2 },
        a: { name: 'free air per shaft kW', q: false, unit: 'm³/min per kW', value: 1.3 },
        w: { name: 'compressor specific power', q: false, unit: 'kW per m³/min', value: 6.5 },
        eta: { name: 'electric motor efficiency', q: 'ratio', unit: '%', value: 82, min: 10, max: 100, tex: '\\eta' }
      },
      note: 'Energy only: add maintenance, downtime and the cost of certification to ΔK for a full picture (see [[motor-life-cost]]).',
      stories: { t: 'An electric drive costs {dK} more than an air motor of {P} (a = {a}, w = {w}, efficiency {eta}, electricity {c} per kWh). Above how many hours a year does it pay back within a year?' }
    }
  ],
  examples: [
    {
      title: 'A mixer: air or electric?',
      q: 'A 0.75 kW mixer runs 1500 h a year. The air motor uses 1.3 m³/min per kW; the compressors need 6.5 kW per m³/min; electricity costs ¤0.20 per kWh. An electric motor would be 82 % efficient. Compare the yearly energy costs.',
      steps: [
        'Air: $0.75 \\times 1.3 = 0.975$ m³/min; compressor $0.975 \\times 6.5 = 6.34$ kW; $6.34 \\times 1500 = 9510$ kWh = ¤1,902.',
        'Electric: $0.75/0.82 = 0.915$ kW; $0.915 \\times 1500 = 1372$ kWh = ¤274.',
        'The air motor costs about ¤1,630 a year more — seven times as much.'
      ],
      a: 'About ¤1,900 against ¤270 a year.'
    },
    {
      title: 'When does the certified electric drive pay?',
      q: 'The mixer stands in a zone where an electric motor must be a certified type; with its cable and gland it costs ¤900 more than the air motor. Above how many hours a year does it pay back within a year?',
      steps: [
        '$a w = 1.3 \\times 6.5 = 8.45$ kW of electricity per shaft kW for air; $1/\\eta = 1.22$ for electric.',
        'Saving per hour: $0.75 \\times 0.20 \\times (8.45 - 1.22) = ¤1.08$.',
        '$t = 900/1.08 = 830$ h a year.'
      ],
      a: 'Above roughly 830 running hours a year; at 1500 h it pays back in about seven months.'
    }
  ],
  quiz: [
    { q: 'Which duty most clearly favours an air motor?', choices: ['A solvent mixer in a hazardous zone that stalls when the batch thickens', 'A ventilation fan running 8000 h a year', 'A conveyor in a dry warehouse', 'A precise positioning axis'], a: 0, why: 'Hazardous atmosphere plus stalling: both play to the air motor\'s strengths. The fan\'s hours would make its air ruinous.' },
    { q: 'Roughly how many kilowatts of compressor electricity does one kilowatt at an air motor\'s shaft cost?', choices: ['7–10 kW', '1.1–1.3 kW', '2–3 kW', '20–30 kW'], a: 0, why: 'About 1–1.5 m³/min of free air per shaft kW, and 6–7 kW of compressor power per m³/min.' },
    { q: 'An air motor needs no certification for use in an explosive atmosphere, because it has no electrical parts.', a: false, why: 'Mechanical sparks, hot surfaces and static electricity can ignite an atmosphere; only certified equipment, earthed and used within its temperature class, may be used.' },
    { q: 'A 2 kW air motor (a = 1.2, w = 6.5) runs 1000 h a year at ¤0.15 per kWh. What does its air cost a year (in your currency)?', answer: 2340, why: '$2 \\times 1.2 \\times 6.5 \\times 1000 \\times 0.15 = 2340$.' }
  ],
  problems: [
    { q: 'An electric drive costs ¤1,200 more than a 1.5 kW air motor (a = 1.2 m³/min per kW, w = 6.5 kW per m³/min); the electric motor is 88 % efficient and electricity costs ¤0.18 per kWh. Above how many hours a year does the electric drive pay back within a year?', answer: 667, unit: 'h', tol: 0.02,
      steps: ['$a w - 1/\\eta = 7.8 - 1.136 = 6.66$.', 'Saving per hour: $1.5 \\times 0.18 \\times 6.66 = ¤1.80$.', '$t = 1200/1.80 = 667$ h.'] }
  ],
  choose: {
    good: [
      'Explosive, wet, hot or dirty places where a certified air motor is simpler than a certified electric drive.',
      'Duties that stall, start, stop and reverse all day; heavy-use hand tools.',
      'Short running hours where compressed air is already available.'
    ],
    avoid: [
      'Long running hours: compare the yearly air cost with an electric drive first.',
      'Sites without a clean, dry, adequate air supply.',
      'Precise speed or positioning, and quiet workplaces.'
    ],
    check: [
      'Hazardous-area certification (group, category, temperature class) of the whole assembly.',
      'Running hours, the yearly cost of the air and the break-even against an electric drive.',
      'Compressor capacity, air quality and the pressure at the motor.',
      'Noise, exhaust routing and how the load is held when the air goes.'
    ]
  },
  applications: [
    'Mixers, agitators and drum pumps in paint, ink, adhesive and chemical plants.',
    'Air hoists and winches in refineries, on offshore platforms and in mines.',
    'Air starters on diesel generators and ships\' engines, which need no large batteries.',
    'Assembly lines of nutrunners and screwdrivers that stall on every joint.',
    'Try the numbers in [the selection guide](#/tools/sizing/choose).'
  ],
  sources: [
    'Directive 2014/34/EU (ATEX) on equipment for potentially explosive atmospheres, and EN ISO 80079-36 and -37 on non-electrical equipment for explosive atmospheres.',
    'ISO 4414, *Pneumatic fluid power — General rules and safety requirements for systems and their components*.',
    'Compressor specific power and leak figures are typical of industrial compressed-air audits; see [[pneumatics:cost-of-compressed-air]].'
  ],
  sim: 'as-air-vs-electric'
},

{
  id: 'motor-comparison', parent: 'comparisons', title: 'The motor families compared', level: 1,
  short: 'Every motor family side by side — power and speed range, torque density and overload, efficiency, control, cost, maintenance and environment — with the questions that decide between them: what supply, what motion, what load, what place, and what the motor will cost over its life.',
  keywords: ['motor comparison', 'choosing a motor', 'motor selection', 'motor types', 'torque density', 'efficiency', 'DC motor', 'BLDC', 'induction motor', 'stepper', 'servo', 'hydraulic motor', 'air motor', 'decision matrix', 'weighted scoring'],
  prereq: ['torque-and-power', 'efficiency-losses', 'load-torque-types'],
  related: ['positioning-vs-speed', 'motor-selection-method', 'motor-life-cost', 'hazardous-areas', 'dc-torque-speed', 'bldc-selection', 'vfd-principle', 'stepper-sizing', 'servo-principle', 'hydraulic-motor-principle', 'air-motor-applications', 'efficiency-classes'],
  body: `
No motor is best; each is a set of compromises. The table puts the families side by side with typical figures — ranges, not limits — and the sim below lets you weight what matters to you and see how the ranking moves.

| Family | Power | Speed | Torque and overload | Efficiency | Control | Cost | Upkeep | Environment |
|---|---|---|---|---|---|---|---|---|
| [[pmdc-motor|Brushed PM DC]] | 1 W–5 kW | 1000–10 000 rpm | good; peaks limited by brushes and magnets | 50–85 % | voltage or PWM, very simple | low | brushes wear | sparks, carbon dust, interference |
| [[universal-motor|Universal]] | 0.1–2 kW | 10 000–35 000 rpm | high for its weight, at speed | 40–70 % | triac phase control | lowest | short brush life | loud |
| [[bldc-motor|Brushless DC / PMSM]] | 1 W–500 kW | 0 to over 20 000 rpm | very high; peaks 2–3 × | 80–97 % | needs a driver or inverter | medium | bearings only | quiet |
| [[squirrel-cage|Induction]], direct on line | 0.1 kW–tens of MW | fixed, just below 3000/1500/1000 rpm at 50 Hz | moderate; breakdown 2–3 × rated | 75–97 % (IE3 7.5 kW: 90.4 %) | contactor, starter | lowest per kW | bearings; decades of life | rugged, IP55, Ex versions |
| Induction + [[vfd-principle|VFD]] | as above | 1:10 to 1:100+, to about twice base speed | drive allows about 150 % for 60 s | motor × 95–98 % | ramps, set-points, fieldbus | medium | drive fans and capacitors | EMC, bearing currents |
| [[psc-motor|Single-phase induction]] | 0.1–3 kW | fixed | low to moderate starting torque | 50–80 % | switch and capacitor | low | capacitors, switches | homes, small pumps and fans |
| [[reluctance-motors|Synchronous reluctance]] | 1–500 kW | variable, on an inverter | good | IE4–IE5 | inverter needed | medium | bearings | no magnets |
| [[stepper-types|Hybrid stepper]] | holding 0.02–20 N·m | useful to about 1000–1500 rpm | highest at standstill; overload means lost steps | low | step and direction, open loop | low | bearings | warm at rest, resonance |
| [[ac-servo-motors|AC servo]] | 50 W–15 kW and more | 0–3000 or 6000 rpm | about 3 × rated for short peaks | 85–95 % | closed loop: position, speed, torque | high | bearings, encoder | IP65 common |
| [[hydraulic-motor-principle|Hydraulic]] | 0.1 kW–1 MW | 0–5000 rpm; low-speed types to a few hundred | very high; relief valve limits it | motor 80–95 %, system much lower | valves, variable pumps | high with its power unit | oil, filters, hoses | wet and dirty fine; leaks, fire risk |
| [[air-motor-principle|Air]] | 0.1–25 kW | to 25 000 rpm (turbines far more) | stall-proof | 10–15 % from the meter | valve and throttle | low motor, costly air | vanes, oil mist | Ex, wet, hot; loud |

### What a few anchor numbers say
- Torque sets size. A 7.5 kW 4-pole motor at 1460 rpm gives 49 N·m; a 7.5 kW servo at 3000 rpm needs only 24 N·m and is much smaller. The relation is $T = P/\\omega$, with $\\omega$ the [[?angular-frequency|angular speed]] — gearing trades speed for torque.
- Efficiency sets heat and running cost. A stepper giving 50 W at 40 % must shed 75 W; a servo at 90 % sheds 6 W. On a 7.5 kW motor running 4000 h a year, five points of efficiency are worth a few hundred in money every year ([[efficiency-classes]]).
- Power density: brushless and hydraulic motors lead, induction motors are heavy but cheap, air motors light but costly to feed.

### The questions that decide
1. **Supply**: three-phase or single-phase mains, a battery or DC bus, compressed air, a hydraulic power unit?
2. **Motion**: constant speed, variable speed, positioning, or torque/force control? (see [[positioning-vs-speed]])
3. **Load**: torque against speed ([[load-torque-types]]), peak and RMS torque, inertia, duty ([[rms-torque-sizing]]).
4. **Place**: temperature, dust and water (IP), explosive atmosphere ([[hazardous-areas]]), noise limits, washdown.
5. **Life and money**: running hours, maintenance access, energy price, purchase cost of motor *and* drive ([[motor-life-cost]]).

| You need | First choices |
|---|---|
| Constant speed from the mains, above about 0.2 kW | three-phase induction (IE3/IE4), direct on line or soft-started |
| Variable speed: pumps, fans, conveyors | induction, PM or reluctance motor on a VFD |
| Light positioning, low speed, low cost | hybrid stepper (closed-loop if a lost step matters) |
| Fast, precise, dynamic positioning | AC servo |
| Battery power | brushless DC; brushed DC where cost rules |
| Very high torque at low speed in a hostile place | hydraulic low-speed motor, or a gearmotor |
| Explosive atmosphere | Ex-certified induction motor, or an air motor |
| No backlash, direct drive | [[torque-motors|torque]] or [[linear-motors|linear]] motor |

> [!tip] Score the candidates on your own weights in the sim, then check the winner properly with [[motor-selection-method]] and [the selection guide](#/tools/sizing/choose). A score ranks families; only sizing proves a motor.

> [!key] Start from the supply, the motion and the place: they eliminate most families. Among the rest, torque at speed sets the size, efficiency sets the heat and the bill, and the drive's cost and complexity often decide.
`,
  ideas: [
    'Supply, kind of motion and environment eliminate most motor families before any sizing.',
    'Torque, not power, sets a motor\'s size: T = P/ω, so fast motors with gearboxes are small.',
    'Efficiency decides heat and running cost; purchase cost must include the drive.',
    'Induction motors are cheapest per kW for fixed speed; servos for dynamic positioning; steppers for cheap light positioning.',
    'Hydraulic and air motors win in hostile places, at the cost of system efficiency.'
  ],
  pitfalls: [
    'The most efficient motor is always the best choice — A servo on a pump that runs at one speed wastes money; an IE3 induction motor on the mains does the job.',
    'Two motors of the same kW are the same size — A 3000 rpm motor has half the torque, and roughly half the size, of a 1500 rpm motor of the same power.',
    'The motor price is the cost — The drive, cabling, sensors, maintenance and decades of electricity usually cost far more.'
  ],
  formulas: [
    {
      name: 'Torque from power and speed',
      expr: 'T = P/(2*pi*n)', tex: 'T = \\dfrac{P}{2\\pi n}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        P: { name: 'shaft power', q: 'power', unit: 'kW', value: 7.5 },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 1460 }
      },
      note: 'The machinist\'s form is T = 9550 P/n with P in kW and n in rpm.',
      stories: { T: 'A motor gives {P} at {n}. What torque is that?', n: 'At what speed does {P} correspond to {T}?' }
    },
    {
      name: 'Heat a motor must shed',
      expr: 'Pl = P*(1/eta - 1)', tex: 'P_l = P\\left(\\dfrac{1}{\\eta} - 1\\right)',
      vars: {
        Pl: { name: 'losses turned into heat', q: 'power', unit: 'W', tex: 'P_l' },
        P: { name: 'shaft power', q: 'power', unit: 'W', value: 50 },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 40, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { Pl: 'A motor delivers {P} at {eta} efficiency. How much heat does it make?', eta: 'A motor delivers {P} and makes {Pl} of heat. How efficient is it?' }
    },
    {
      name: 'Yearly cost of a difference in efficiency',
      expr: 'dC = P*t*c*(1/eta1 - 1/eta2)', tex: '\\Delta C = P\\,t\\,c\\left(\\dfrac{1}{\\eta_1} - \\dfrac{1}{\\eta_2}\\right)',
      vars: {
        dC: { name: 'extra energy cost per year of the less efficient motor', q: 'money', unit: '$', tex: '\\Delta C' },
        P: { name: 'shaft power', q: false, unit: 'kW', value: 7.5 },
        t: { name: 'running hours per year', q: false, unit: 'h', value: 4000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15 },
        eta1: { name: 'efficiency of the poorer motor', q: 'ratio', unit: '%', value: 88, min: 1, max: 100, tex: '\\eta_1' },
        eta2: { name: 'efficiency of the better motor', q: 'ratio', unit: '%', value: 93, min: 1, max: 100, tex: '\\eta_2' }
      },
      note: 'At full load; at part load the gap is often larger for small motors.',
      stories: { dC: 'Two {P} motors run {t} a year at {c} per kWh; one is {eta1} efficient, the other {eta2}. What does the difference cost a year?' }
    }
  ],
  examples: [
    {
      title: 'Same power, different torque',
      q: 'Compare the torque of a 7.5 kW 4-pole induction motor at 1460 rpm with a 7.5 kW servo motor at 3000 rpm.',
      steps: [
        'Induction: $T = 7500/(2\\pi \\times 1460/60) = 7500/152.9 = 49$ N·m.',
        'Servo: $T = 7500/(2\\pi \\times 50) = 23.9$ N·m.',
        'Size follows torque, so the faster motor is roughly half the frame — and a 2:1 belt would give the same 49 N·m at 1500 rpm.'
      ],
      a: '49 N·m against 24 N·m: power is the same, torque and size are not.'
    },
    {
      title: 'Heat in a stepper and a servo',
      q: 'An axis needs 50 W of mechanical power. A stepper does it at about 40 % efficiency, a servo at about 90 %. How much heat does each make?',
      steps: [
        'Stepper: $P_l = 50\\,(1/0.40 - 1) = 75$ W.',
        'Servo: $P_l = 50\\,(1/0.90 - 1) = 5.6$ W.',
        'The stepper also draws current while standing still; in a sealed enclosure that heat decides the choice.'
      ],
      a: '75 W against about 6 W.'
    },
    {
      title: 'Five points of efficiency',
      q: 'A 7.5 kW fan motor runs 4000 h a year at ¤0.15 per kWh. What is the yearly difference between an 88 % and a 93 % efficient motor?',
      steps: [
        '$1/0.88 - 1/0.93 = 1.1364 - 1.0753 = 0.0611$.',
        '$\\Delta C = 7.5 \\times 4000 \\times 0.15 \\times 0.0611 = ¤275$ a year.'
      ],
      a: 'About ¤275 a year — over a 15-year life, far more than the price difference.'
    }
  ],
  quiz: [
    { q: 'A pump must run at one speed, 24 h a day, from a three-phase supply. The obvious family is…', choices: ['a three-phase induction motor of a high efficiency class', 'an AC servo', 'a hybrid stepper', 'an air motor'], a: 0, why: 'Fixed speed from the mains is exactly what induction motors do cheaply and for decades; nothing else earns its extra cost here.' },
    { q: 'Which usually decides a motor\'s physical size?', choices: ['Its continuous torque', 'Its power in kW alone', 'Its voltage', 'Its number of leads'], a: 0, why: 'Torque needs magnetic force times radius, which means iron and copper; power is torque times speed.' },
    { q: 'In an explosive atmosphere, which two families are the natural candidates?', choices: ['Ex-certified induction motors and air motors', 'Universal and brushed DC motors', 'Steppers and RC servos', 'Any brushless motor'], a: 0, why: 'Brushes spark; the usual certified choices are induction motors in protected enclosures and certified air motors ([[hazardous-areas]]).' },
    { q: 'A motor gives 30 kW at 1475 rpm. What is its torque?', answer: 194, unit: 'N·m', why: '$T = 30\\,000/(2\\pi \\times 24.58) = 194$ N·m.' },
    { q: 'A higher efficiency always pays for itself.', a: false, why: 'Only if the motor runs enough hours: at a few hundred hours a year a small efficiency gain may never repay a higher price.' }
  ],
  problems: [
    { q: 'A 15 kW motor runs 6000 h a year at ¤0.12 per kWh. What is the yearly saving of a 94 % motor over a 91 % one?', answer: 379, tol: 0.02,
      steps: ['$1/0.91 - 1/0.94 = 1.0989 - 1.0638 = 0.0351$.', '$15 \\times 6000 \\times 0.12 \\times 0.0351 = 379$.'] }
  ],
  choose: {
    good: [
      'Narrowing a long list quickly by supply, motion and environment.',
      'Explaining a choice to others with a weighted comparison.',
      'Spotting when a cheaper family would do the job.'
    ],
    avoid: [
      'Choosing from the table alone: sizing (torque, speed, inertia, duty) decides the actual motor.',
      'Comparing motors without their drives, gearboxes and running costs.'
    ],
    check: [
      'Continuous and peak torque at the speeds you need, with margin.',
      'Supply voltage and phases, and the drive or starter it needs.',
      'IP rating, temperature, hazardous-area certification and noise.',
      'Running hours, efficiency and the life-cycle cost.'
    ]
  },
  applications: [
    'The first step of every machine design: a shortlist of two or three families, then sizing.',
    '[The selection guide](#/tools/sizing/choose) asks the same questions and proposes families.',
    'Replacing a motor: check whether the same family is still the best — many fixed-speed drives gain from a VFD, many brushed motors from brushless ones.'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*; IEC 60034-30-1, *Efficiency classes of line operated AC motors (IE code)*.',
    'Hughes and Drury, *Electric Motors and Drives* — the families, their characteristics and their drives.',
    'NEMA ICS 16, *Motion/position control motors, controls and feedback devices*.',
    'Esposito, *Fluid Power with Applications* — hydraulic and pneumatic motors.'
  ],
  sim: 'as-family-compare'
},

{
  id: 'positioning-vs-speed', parent: 'comparisons', title: 'Stepper, servo or VFD?', level: 2,
  short: 'For moving to positions: a stepper counts steps open-loop, cheaply, at low speed; a servo measures and corrects, fast, stiff and with three times its rated torque for peaks; a VFD runs an induction motor at a set speed, and positions only with an encoder and a positioning function. The move — speed, acceleration, inertia and duty — decides.',
  keywords: ['stepper vs servo', 'servo vs VFD', 'positioning', 'speed control', 'open loop', 'closed loop', 'lost steps', 'pull-out torque', 'inertia ratio', 'move profile', 'step rate', 'encoder resolution', 'closed-loop stepper', 'vector control', 'axis sizing'],
  prereq: ['stepper-torque-speed', 'servo-principle', 'vfd-principle', 'motion-profiles'],
  related: ['motor-comparison', 'closed-loop-steppers', 'inertia-matching', 'rms-torque-sizing', 'stepper-sizing', 'vector-control-vfd', 'lead-ball-screws', 'step-dir-signals', 'servo-brakes', 'motors-machine-tools'],
  body: `
Three drive families answer three different questions. A **stepper** is told how many steps to take and assumes it took them. A **servo** is told where to be and checks, thousands of times a second, that it is there. A **VFD** is told how fast to turn an induction motor and, unless given an encoder, does not know where the shaft is at all.

| | Open-loop stepper | Closed-loop stepper | AC servo | Induction motor + VFD |
|---|---|---|---|---|
| Feedback | none | encoder | high-resolution encoder, often 17–24 bit | none (V/f, sensorless) or encoder |
| Positioning | counts steps; a lost step goes unnoticed | detects and corrects errors | precise, stiff, settles in milliseconds | only with an encoder and a positioning function |
| Useful speed | to about 1000–1500 rpm | similar, better near the limit | to 3000–6000 rpm, torque flat to rated speed | 1:10 (V/f) to 1:100+ (vector), up to about twice base speed |
| Torque at speed | highest at standstill, falls fast | same curve, used more fully | flat to rated speed | flat to base speed, then falls (constant power) |
| Short overload | none: beyond pull-out it loses steps | small | about 3 × rated | about 1.5 × for 60 s |
| Load inertia | best below about 10 × rotor | a little more | about 10 × easily, far more with tuning | large rotor inertia of its own |
| Set-up | current and microsteps | little | tuning (often automatic) | parameters, ramps |
| Heat and noise | full current at rest; resonance | cooler, quieter | cool; quiet | fine at speed; low-speed cooling |
| Relative cost (≈400 W) | 1 × | about 1.5 × | 2–4 × | lowest per kW at larger powers |

### Size the move, then pick
Everything follows from the move ([[motion-profiles]]): distance, time, the speed and acceleration they imply, and the load's inertia seen by the motor ([[inertia-reflected]]). The motor torque in each phase is

$$T = (J_m + J_L)\\,\\alpha + T_L$$

— accelerating the rotor $J_m$ and the load $J_L$, plus friction and gravity $T_L$. Put the peak torque against the motor's curve *at the top speed*, and the RMS torque — the [[?square-root|square root]] of the [[?mean|time-average]] of the torque squared, which is what heats the winding — against its continuous rating ([[rms-torque-sizing]]). The sim below does this for a ball-screw axis and three candidate motors; the dots trace the move on each motor's torque–speed map.

- **Stepper**: its torque falls steeply above a corner speed set by supply voltage and winding inductance ([[stepper-torque-speed]]); keep the needed torque within about half to two-thirds of the pull-out curve, because resonance and load variations eat margin and one stall loses position silently. The step rate is $f = n\\,z\\,m$ — 600 rpm at 200 steps and 16 microsteps is 32 kHz. Microsteps improve smoothness and resolution, not accuracy (typically ±5 % of a full step).
- **Servo**: the peak torque can be three times the rated, so short fast moves are cheap in motor size; the RMS torque and the inertia ratio decide ([[inertia-matching]]). Every vertical axis needs a [[servo-brakes|holding brake]].
- **VFD**: good at speed, bad at stopping exactly: without an encoder the stop depends on ramps and slip. With a closed-loop vector drive and an encoder it positions well for conveyors, indexing tables and hoists — slower and softer than a servo, but cheaper at kilowatts.

### Rules of thumb
1. Only speed matters, above a few hundred watts: **induction motor + VFD** (or a PM motor on the VFD for efficiency).
2. Positions, light loads, below about 1000 rpm, cost first: **stepper**; if a stall must never go unnoticed, **closed-loop stepper**.
3. Positions at higher speed, high acceleration, changing loads, or no tolerance for lost steps: **servo**.
4. Positioning above a few kW: servo, or an induction motor with closed-loop vector control and an encoder.
5. Change the mechanics before the motor: a different screw lead or belt ratio can move the operating point into a cheaper motor's comfortable zone.

> [!warn] Losing steps, a following error or a coasting VFD stop can crash an axis. Limit switches and safe torque off are part of the design, not optional ([[limit-switches]], [[emergency-stop]]); vertical axes need a holding brake.

> [!key] Stepper: counts, cheap, slow, no overload. Servo: measures, fast, 3 × peak, needs tuning. VFD: speed, not position, unless you add an encoder. Size the move first — torque at top speed, RMS torque, inertia ratio — then pick.
`,
  ideas: [
    'A stepper counts steps open-loop; a servo measures and corrects; a VFD controls speed and knows no position without an encoder.',
    'Stepper torque falls steeply with speed; keep the need within about half to two-thirds of the pull-out curve.',
    'A servo gives about three times its rated torque for short peaks; its RMS torque and inertia ratio decide its size.',
    'Motor torque = (J_m + J_L)α + T_L in each phase of the move; check peak at top speed and RMS against continuous.',
    'Changing the screw lead or belt ratio often changes which motor fits.'
  ],
  pitfalls: [
    'Microstepping makes a stepper as accurate as its resolution — It makes motion smoother and finer, but accuracy stays about ±5 % of a full step, and a lost step is never noticed.',
    'A VFD can position an induction motor like a servo — Without an encoder and a positioning function the stop depends on ramps and slip; even with one it is slower and softer.',
    'A servo is always better than a stepper — For light, slow, cheap axes a stepper does the job with no tuning and a fraction of the cost.'
  ],
  formulas: [
    {
      name: 'Step pulse frequency',
      expr: 'f = n*z*m', tex: 'f = n\\,z\\,m',
      vars: {
        f: { name: 'step pulse frequency', q: 'frequency', unit: 'kHz' },
        n: { name: 'motor speed', q: 'frequency', unit: 'rpm', value: 600 },
        z: { name: 'full steps per revolution', q: 'count', value: 200, int: true, fixed: true },
        m: { name: 'microsteps per full step', q: 'count', value: 16, int: true }
      },
      note: 'The controller must produce this pulse rate, and the driver accept it.',
      stories: { f: 'A 200-step motor runs at {n} with {m} microsteps. What pulse rate does the controller need?', n: 'A controller can give at most {f} with {m} microsteps on a 200-step motor. What is the top speed?' }
    },
    {
      name: 'Motor torque during acceleration',
      expr: 'T = (Jm + JL)*alpha + TL', tex: 'T = (J_m + J_L)\\,\\alpha + T_L',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        Jm: { name: 'rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 0.3, tex: 'J_m' },
        JL: { name: 'load inertia seen by the motor', q: 'inertia', unit: 'kg·cm²', value: 2.7, tex: 'J_L' },
        alpha: { name: 'angular acceleration of the motor', q: 'angacc', unit: 'rad/s²', value: 442, tex: '\\alpha' },
        TL: { name: 'friction and gravity torque at the motor', q: 'torque', unit: 'N·m', value: 0.042, tex: 'T_L' }
      },
      note: 'J_L includes the screw, coupling and the load reflected through the drive (divided by the drive efficiency when accelerating).',
      stories: { T: 'A rotor of {Jm} drives a load of {JL} at {alpha} against {TL}. What torque is needed?', alpha: 'A motor can give {T}; rotor {Jm}, load {JL}, friction {TL}. What acceleration can it reach?' }
    },
    {
      name: 'Resolution of a screw axis',
      expr: 'dx = p/N', tex: '\\Delta x = \\dfrac{p}{N}',
      vars: {
        dx: { name: 'smallest step of the carriage', q: 'length', unit: 'µm', tex: '\\Delta x' },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 20 },
        N: { name: 'steps or encoder counts per revolution', q: 'count', value: 3200, int: true }
      },
      note: 'Resolution, not accuracy: screw lead error, backlash and (for steppers) step-angle error come on top.',
      stories: { dx: 'A {p} lead screw is driven with {N} steps per revolution. What is the smallest carriage step?' }
    }
  ],
  examples: [
    {
      title: 'Can a stepper do it?',
      q: 'A 20 kg carriage on a ball screw (20 mm lead, 90 % efficient, screw and coupling 0.4 kg·cm²) must move 200 mm in 0.8 s — a third accelerating, a third cruising, a third braking. Friction is 0.01 × weight plus 10 N. Can a NEMA 23 stepper (1.26 N·m holding, rotor 0.3 kg·cm², about 0.54 N·m at 1125 rpm on 48 V) do it?',
      steps: [
        'Top speed $v = 1.5 \\times 0.2/0.8 = 0.375$ m/s, reached in 0.267 s: $a = 1.41$ m/s².',
        'Motor: $n = 0.375/0.020 \\times 60 = 1125$ rpm; $\\alpha = 1.41/0.020 \\times 2\\pi = 442$ rad/s².',
        'Load inertia: $20 \\times (0.02/2\\pi)^2 = 2.03$ kg·cm², plus 0.4 = 2.43 kg·cm²; divided by 0.9 when accelerating: 2.70.',
        'Friction force $0.01 \\times 196 + 10 = 12$ N: $T_L = 12 \\times 0.02/(2\\pi \\times 0.9) = 0.042$ N·m.',
        '$T = (0.3 + 2.70)\\times10^{-4} \\times 442 + 0.042 = 0.175$ N·m, against about 0.54 N·m available at 1125 rpm — a third of the curve.',
        'Inertia ratio $2.43/0.3 = 8$: acceptable. Step rate at 16 microsteps: $1125/60 \\times 200 \\times 16 = 60$ kHz.'
      ],
      a: 'Yes, with a comfortable margin — but with a 10 mm lead the motor would need 2250 rpm, beyond this stepper: then a servo.'
    },
    {
      title: 'The same move on a servo',
      q: 'Use a 10 mm lead instead and a 400 W servo (1.27 N·m continuous, 3.8 N·m peak, rotor 0.34 kg·cm²). What peak torque is needed?',
      steps: [
        '$n = 0.375/0.010 \\times 60 = 2250$ rpm; $\\alpha = 1.41/0.010 \\times 2\\pi = 884$ rad/s².',
        '$J_L = 20 \\times (0.01/2\\pi)^2 = 0.51$ kg·cm², plus 0.4 = 0.91; divided by 0.9: 1.01 kg·cm².',
        '$T_L = 12 \\times 0.01/(2\\pi \\times 0.9) = 0.021$ N·m; $T = (0.34 + 1.01)\\times10^{-4} \\times 884 + 0.021 = 0.14$ N·m.',
        'Tiny against 3.8 N·m: this axis could move far faster; the servo\'s limit here is speed, not torque.'
      ],
      a: 'About 0.14 N·m at 2250 rpm — easily within the servo; a smaller servo would do.'
    }
  ],
  quiz: [
    { q: 'An axis must never lose its position unnoticed, runs at 2500 rpm and accelerates hard. Choose…', choices: ['an AC servo', 'an open-loop stepper', 'an induction motor on a V/f drive', 'a universal motor'], a: 0, why: 'Speed above a stepper\'s range, high dynamics and no tolerance for lost steps all point to a servo.' },
    { q: 'What does a stepper do when the load briefly needs more than its pull-out torque?', choices: ['It loses steps, and the controller does not know', 'It gives three times its rated torque', 'It trips on overcurrent', 'It slows down but keeps its position'], a: 0, why: 'An open-loop stepper has no overload margin and no feedback: the rotor slips poles and the count is wrong from then on.' },
    { q: 'Microstepping a 1.8° stepper at 1/16 makes its positioning accuracy 0.11°.', a: false, why: 'The resolution is 0.11°, but the accuracy is set by the motor\'s step-angle error (typically ±5 % of a full step) and the load.' },
    { q: 'A 200-step motor runs at 900 rpm with 8 microsteps. What pulse frequency is needed, in kHz?', answer: 24, unit: 'kHz', why: '$900/60 \\times 200 \\times 8 = 24\\,000$ Hz.' },
    { q: 'A conveyor must run at adjustable speed, 3 kW, positions do not matter. The natural drive is…', choices: ['an induction motor on a VFD', 'a 3 kW servo', 'a large stepper', 'an air motor'], a: 0, why: 'Speed control only, a few kilowatts: an induction motor and VFD are rugged and cheapest.' }
  ],
  problems: [
    { q: 'A motor of rotor inertia 0.5 kg·cm² drives a load of 4.5 kg·cm² (reflected) with 0.1 N·m of friction. What torque does an acceleration of 1000 rad/s² need?', answer: 0.6, unit: 'N·m', tol: 0.02,
      steps: ['$(0.5 + 4.5)\\times10^{-4} \\times 1000 = 0.5$ N·m.', 'Plus friction: 0.6 N·m.'] }
  ],
  choose: {
    good: [
      'Stepper: cheap, simple positioning of light loads at low speed; holding at rest without a brake.',
      'Servo: fast, precise, dynamic axes; high short peaks; vertical axes with a brake.',
      'VFD + induction motor: speed control of pumps, fans, conveyors and spindles; positioning with an encoder where softness is acceptable.'
    ],
    avoid: [
      'Steppers above about 1000–1500 rpm or where a lost step is dangerous.',
      'Servos where a fixed or slowly varying speed is all that is needed.',
      'Open-loop VFDs for exact stops.'
    ],
    check: [
      'The move: top speed, acceleration, reflected inertia, friction and gravity.',
      'Peak torque at top speed against the curve; RMS torque against the continuous rating.',
      'Inertia ratio, pulse rate, encoder resolution and required accuracy.',
      'Brakes, limit switches, safe torque off and homing.'
    ]
  },
  applications: [
    '3-D printers and small routers: steppers; production machining centres: servos.',
    'Packaging and pick-and-place: servos for their peaks and settling time.',
    'Conveyors, fans, pumps and simple indexing: induction motors on VFDs.',
    'Size your own axis in [the axis sizing tool](#/tools/sizing/axis).'
  ],
  sources: [
    'NEMA ICS 16, *Motion/position control motors, controls and feedback devices*.',
    'Kenjo and Sugawara, *Stepping Motors and Their Microprocessor Controls* — pull-out torque, resonance and step accuracy.',
    'Hughes and Drury, *Electric Motors and Drives* — servo and inverter-fed induction drives.',
    'IEC 61800 series, *Adjustable speed electrical power drive systems*.'
  ],
  sim: 'as-move-check'
},

{
  id: 'motors-pumps-fans', parent: 'comparisons', title: 'Motors for pumps and fans', level: 2,
  short: 'Pumps and fans use more motor energy than any other machines. Centrifugal ones need torque that grows with the square of speed and power with its cube, so they start easily and save enormously when slowed by a VFD instead of throttled — down to a minimum speed set by the static head. Positive-displacement pumps need full torque from standstill.',
  keywords: ['pump motor', 'fan motor', 'centrifugal pump', 'affinity laws', 'cube law', 'variable torque', 'throttling', 'VFD energy saving', 'static head', 'minimum speed', 'EC fan', 'submersible motor', 'canned motor pump', 'water hammer', 'positive displacement pump', 'run-out'],
  prereq: ['load-torque-types', 'vfd-energy-saving', 'hydraulics:affinity-laws'],
  related: ['motor-comparison', 'vfd-principle', 'soft-starters', 'efficiency-classes', 'dol-starting', 'vfd-wiring-emc', 'motor-life-cost', 'hydraulics:pump-curves', 'hydraulics:system-curve', 'hydraulics:operating-point', 'hydraulics:cavitation-npsh', 'hydraulics:pump-head-power'],
  body: `
Pumps, fans and compressors drive a large share of the world's electric motors, and they are where motor choices save the most energy.

### Two kinds of load
- **Centrifugal pumps and fans** are variable-torque loads: at a fixed system, flow ∝ speed, head or pressure ∝ speed², so torque ∝ speed² and **power ∝ speed³** — a [[?exponent|cube law]] ([[hydraulics:affinity-laws|the affinity laws]]). They start easily, but a large fan's inertia can make the run-up long.
- **Positive-displacement pumps** (gear, screw, lobe, piston) are constant-torque loads: torque follows the pressure, not the speed, from standstill — and against a closed valve the pressure rises until a relief valve or the motor gives way.

### Which motor
| Motor | Where it fits | Watch |
|---|---|---|
| IE3/IE4 induction, direct on line or soft-started | fixed duty, from fractions of a kW to megawatts | starting current; [[soft-starters|soft stop]] against water hammer |
| Induction, PM or reluctance motor on a [[vfd-principle|VFD]] | flow or pressure that varies | minimum speed, resonant speeds to skip, [[vfd-wiring-emc|bearing currents and EMC]] |
| EC fan (external-rotor brushless with built-in electronics) | ventilation and cooling fans up to a few kW | speed set by 0–10 V or a bus; efficient at part load |
| Submersible motor (borehole, sewage) | slim water- or oil-filled motors below the pump | needs the flow past it for cooling; long cables |
| Canned motor or magnetic-drive pump | toxic or flammable liquids | no shaft seal; must never run dry |
| Single-phase capacitor motor | domestic pumps, small fans | low efficiency; capacitors fail |

### Sizing the motor
The shaft power at a duty point is $P = \\rho g Q H/\\eta_p$ ([[hydraulics:pump-head-power]]). Size the motor for the **largest power the pump can draw in service**, not just the design point: a radial centrifugal pump's power rises with flow, so a system that runs out to the right (an empty pipe at start-up, a burst, a second pump off) can overload a tightly sized motor. Axial-flow pumps are the opposite — their power is highest at low flow, so they are never started against a closed valve. A margin of roughly 10–20 % above the largest expected power is usual. Fans that move hot gas draw more power when started cold, because cold air is denser.

### Throttle or slow down
A throttling valve or damper moves the operating point back along the pump curve and burns the extra head in the valve. A VFD lowers the whole pump curve instead ([[hydraulics:operating-point]]). With pure friction, power falls with the cube of speed: 80 % flow costs about half the power. With a **static head** $H_s$ (lifting water uphill) the savings are smaller, and below a minimum speed

$$n_{\\min} = n_1\\sqrt{\\frac{H_s}{H_0}}$$

($H_0$ the shut-off head at speed $n_1$) the pump delivers nothing at all while still consuming power. The sim below compares throttling and speed control on the same pump and system; the operating points are where the pump curve meets the system curve.

| Pump at 2900 rpm, 60 m³/h and 28 m at full flow, 10 m static head | Throttled to 40 m³/h | VFD to 40 m³/h |
|---|---|---|
| Speed | 2900 rpm | about 2215 rpm (38 Hz) |
| Pump head | 34.7 m (16.7 m lost in the valve) | 18 m |
| Shaft power | about 5.5 kW | about 2.6 kW |

### Real-life notes
- A motor on a VFD at low speed runs cool enough on a pump or fan, because the torque falls with speed squared.
- Long motor cables from a VFD need filters; bearing currents pit the bearings of larger motors ([[vfd-wiring-emc]]).
- Cavitation, noise and vibration usually come from the hydraulics, not the motor: check [[hydraulics:cavitation-npsh|NPSH]] before blaming the drive.
- Several pumps in parallel: switching one on or off and trimming another with a VFD often beats slowing all of them.

> [!warn] Pumps and fans restart by themselves after a power cut when controlled automatically; isolate and lock off the supply (and wait for the VFD's DC bus to discharge) before opening a pump or reaching into a fan. Closed-valve starting of positive-displacement pumps bursts pipes unless a relief valve is fitted.

> [!key] Centrifugal pumps and fans are cube-law loads: slow them with a VFD rather than throttling, but not below the speed the static head demands. Size the motor for the largest power the pump can draw, and use a high-efficiency motor — it runs for decades.
`,
  ideas: [
    'Centrifugal pumps and fans: torque ∝ speed², power ∝ speed³.',
    'Throttling wastes head in the valve; a VFD lowers the pump curve and saves most of that power.',
    'Static head sets a minimum speed, n₁√(H_s/H₀), below which the pump delivers nothing.',
    'Size the motor for the largest power the pump can draw: run-out for radial pumps, shut-off for axial ones.',
    'Positive-displacement pumps are constant-torque loads and need full torque from standstill.'
  ],
  pitfalls: [
    'Half the speed always means an eighth of the power — Only with pure friction; against a static head the operating point moves differently and the saving is smaller.',
    'A VFD can slow a pump to any speed — Below the static-head limit the pump produces no flow and just churns and heats the liquid.',
    'A motor sized for the design point is enough — A radial pump that runs out to higher flow draws more power and can overload it.'
  ],
  formulas: [
    {
      name: 'Pump shaft power',
      expr: 'P = rho*g*Q*H/eta', tex: 'P = \\dfrac{\\rho\\,g\\,Q\\,H}{\\eta_p}',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 60 },
        H: { name: 'pump head', q: 'length', unit: 'm', value: 28 },
        eta: { name: 'pump efficiency', q: 'ratio', unit: '%', value: 74, min: 1, max: 100, tex: '\\eta_p' }
      },
      stories: { P: 'A pump delivers {Q} of liquid of density {rho} against {H} at {eta} efficiency. What shaft power does it need?', Q: 'A {P} pump works at {eta} against {H}. What flow can it deliver?' }
    },
    {
      name: 'Fan shaft power',
      expr: 'P = Q*dp/eta', tex: 'P = \\dfrac{Q\\,\\Delta p}{\\eta_f}',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        Q: { name: 'air flow', q: 'flowrate', unit: 'm³/s', value: 3 },
        dp: { name: 'fan total pressure rise', q: 'pressure', unit: 'Pa', value: 800, tex: '\\Delta p' },
        eta: { name: 'fan efficiency', q: 'ratio', unit: '%', value: 70, min: 1, max: 100, tex: '\\eta_f' }
      },
      stories: { P: 'A fan moves {Q} against {dp} at {eta} efficiency. What shaft power does it need?' }
    },
    {
      name: 'Power at another speed (affinity, friction only)',
      expr: 'P2 = P1*(n2/n1)^3', tex: 'P_2 = P_1\\left(\\dfrac{n_2}{n_1}\\right)^3',
      vars: {
        P2: { name: 'power at the new speed', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'power at the original speed', q: 'power', unit: 'kW', value: 6.2, tex: 'P_1' },
        n2: { name: 'new speed', q: 'frequency', unit: 'rpm', value: 2320, tex: 'n_2' },
        n1: { name: 'original speed', q: 'frequency', unit: 'rpm', value: 2900, tex: 'n_1' }
      },
      note: 'Along a system curve through the origin (no static head), with the pump efficiency unchanged.',
      stories: { P2: 'A fan takes {P1} at {n1}. What does it take at {n2}?', n2: 'A fan takes {P1} at {n1}. At what speed does it take only {P2}?' }
    },
    {
      name: 'Minimum speed against a static head',
      expr: 'n = n1*sqrt(Hs/H0)', tex: 'n_{\\min} = n_1\\sqrt{\\dfrac{H_s}{H_0}}',
      vars: {
        n: { name: 'speed at which the pump just reaches the static head', q: 'frequency', unit: 'rpm', tex: 'n_{\\min}' },
        n1: { name: 'rated speed', q: 'frequency', unit: 'rpm', value: 2900, tex: 'n_1' },
        Hs: { name: 'static head', q: 'length', unit: 'm', value: 10, tex: 'H_s' },
        H0: { name: 'shut-off head at the rated speed', q: 'length', unit: 'm', value: 40, tex: 'H_0' }
      },
      note: 'The shut-off head falls with the square of speed; below this speed there is no flow.',
      stories: { n: 'A pump with {H0} shut-off head at {n1} lifts against {Hs} of static head. Below what speed does it deliver nothing?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the motor',
      q: 'A water pump must deliver 60 m³/h at 28 m, where it is 74 % efficient. What motor rating would you choose?',
      steps: [
        '$P = 1000 \\times 9.81 \\times (60/3600) \\times 28/0.74 = 6.19$ kW.',
        'With 10–20 % margin: 6.8–7.4 kW, so the next standard size, 7.5 kW (frame 132M for a 4-pole, 132S for a 2-pole motor at 2900 rpm).',
        'Check the pump curve for run-out: if the flow can reach 70 m³/h at start-up, find the power there too.'
      ],
      a: 'About 6.2 kW at the shaft: a 7.5 kW motor.'
    },
    {
      title: 'Throttle or VFD?',
      q: 'The same pump (shut-off head 40 m, 60 m³/h at 28 m; 10 m static head) must now deliver 40 m³/h for 6000 h a year. Throttled, it gives 34.7 m at 69 % efficiency; on a VFD it needs 18 m at 75 %. Compare the shaft powers and the yearly saving (motor 90 %, VFD 97 %, ¤0.15 per kWh).',
      steps: [
        'Throttled: $9810 \\times 0.0111 \\times 34.7/0.69 = 5.5$ kW; electrical $5.5/0.90 = 6.1$ kW.',
        'VFD: $9810 \\times 0.0111 \\times 18/0.75 = 2.6$ kW; electrical $2.6/(0.90 \\times 0.97) = 3.0$ kW.',
        'Saving $3.1 \\times 6000 = 18\\,600$ kWh = ¤2,790 a year.',
        'Speed needed: $40 r^2 - 0.00333 \\times 40^2 = 18$ gives $r = 0.764$, 2215 rpm; the minimum speed is $2900\\sqrt{10/40} = 1450$ rpm.'
      ],
      a: 'About 6.1 kW against 3.0 kW electrical: roughly ¤2,800 a year saved by the VFD.'
    }
  ],
  quiz: [
    { q: 'A fan\'s speed is reduced to 80 %. Its power becomes about…', choices: ['51 %', '80 %', '64 %', '90 %'], a: 0, why: 'Power ∝ speed³: $0.8^3 = 0.51$ (no static pressure, efficiency unchanged).' },
    { q: 'A pump lifts water 30 m up; its shut-off head at 2900 rpm is 45 m. Below what speed does it deliver nothing?', answer: 2368, unit: 'rpm', why: '$2900\\sqrt{30/45} = 2368$ rpm — a VFD cannot slow this pump much.' },
    { q: 'An axial-flow pump should be started with its discharge valve closed.', a: false, why: 'Axial pumps draw their greatest power at low flow; starting them against a closed valve overloads the motor. Radial pumps are the ones started closed.' },
    { q: 'Why does a motor driving a centrifugal pump on a VFD not overheat at low speed, although its fan slows down?', choices: ['The load torque falls with the square of speed, so the current falls too', 'The VFD cools it', 'Pumps are water-cooled', 'The motor becomes more efficient'], a: 0, why: 'Heat comes from current; the torque, and so the current, drops much faster than the cooling does.' },
    { q: 'A positive-displacement pump is a…', choices: ['constant-torque load that needs full torque from standstill', 'variable-torque load like a fan', 'constant-power load', 'load that needs no torque at start'], a: 0, why: 'Its torque follows the pressure it works against, whatever the speed.' }
  ],
  problems: [
    { q: 'A fan moves 5 m³/s against 1200 Pa at 72 % efficiency. What shaft power does it need?', answer: 8.33, unit: 'kW', tol: 0.02,
      steps: ['$P = 5 \\times 1200/0.72 = 8333$ W.'] }
  ],
  choose: {
    good: [
      'VFD speed control for pumps and fans whose flow varies — the largest energy saving in most plants.',
      'High-efficiency (IE3/IE4) induction or PM motors for long running hours.',
      'EC fans for HVAC, canned or magnetic-drive pumps for hazardous liquids, submersible motors for boreholes.'
    ],
    avoid: [
      'Throttling valves and dampers as the permanent way of reducing flow.',
      'VFD speeds below the static-head limit, and resonant speeds of the machine.',
      'Motors sized only for the design point of a radial pump that can run out.'
    ],
    check: [
      'The pump or fan curve: largest power in service, and at start-up.',
      'Static head and the minimum useful speed.',
      'Starting: inertia of large fans, water hammer on stopping (soft stop), closed-valve start.',
      'Cable length and filters, bearing currents, IP rating and ambient.'
    ]
  },
  applications: [
    'Building services: EC fans and VFD-driven circulation pumps.',
    'Water supply: borehole submersible motors, booster sets with several pumps and one VFD.',
    'Industrial cooling towers and process fans on VFDs.',
    'Try the numbers in [the pump and fan tool](#/tools/sizing/pumpfan) and Hyper Hydraulics\' [pump calculator](#/tools/hydro/pump).'
  ],
  sources: [
    'IEC 60034-30-1, *Efficiency classes of line operated AC motors (IE code)*.',
    'IEC 61800 series, *Adjustable speed electrical power drive systems*.',
    'Hughes and Drury, *Electric Motors and Drives* — fan and pump loads on inverter-fed motors.',
    'The affinity laws and pump curves: see [[hydraulics:affinity-laws]] and [[hydraulics:pump-curves]].'
  ],
  sim: 'as-pump-vfd'
},

{
  id: 'motors-conveyors-hoists', parent: 'comparisons', title: 'Motors for conveyors, cranes and hoists', level: 2,
  short: 'Conveyors and hoists are constant-torque loads that must start fully loaded. Conveyors want gearmotors with soft starts, backstops and sometimes load-sharing VFDs; hoists want a motor that can lift more than the rated load, a spring-applied brake that never lets go by accident, a brake sequence that proves torque before release, and somewhere to put the energy of a lowering load.',
  keywords: ['conveyor motor', 'hoist motor', 'crane motor', 'gearmotor', 'breakaway torque', 'backstop', 'holdback', 'brake motor', 'spring-applied brake', 'torque proving', 'brake sequence', 'rollback', 'regenerative braking', 'braking resistor', 'intermittent duty', 'ISO 4301', 'two-speed hoist', 'conical rotor motor'],
  prereq: ['load-torque-types', 'motor-brakes', 'duty-cycles', 'gearboxes'],
  related: ['vfd-braking', 'vfd-parameters', 'soft-starters', 'limit-switches', 'emergency-stop', 'servo-brakes', 'piston-air-motors', 'counterbalance-brake-valves', 'motor-heating', 'hydraulics:lifts-cranes'],
  body: `
Conveyors and hoists look simple — a constant load at a steady speed — but they punish a poor choice: a conveyor that will not start when loaded, a hoist whose load drops a few centimetres every time the brake opens.

### Conveyors
- **Constant torque**, set by friction and incline: the belt pull is $F = m g(\\mu\\cos\\alpha + \\sin\\alpha)$ for a load $m$ on an incline $\\alpha$ (the [[?sine-cosine|sine]] term lifts the load, the cosine term presses it on the idlers), and the drum torque $F D/2$.
- **Breakaway**: static friction, cold grease and a belt full of material need more torque to start than to run — often 1.3–2 times. A motor that runs happily may not start after a stop with full belts; check the motor's starting torque (direct on line) or the drive's overload (VFD).
- **Gentle starts**: direct-on-line starting jerks chains and slips belts; long belt conveyors need controlled acceleration to avoid tension waves. Soft starters and VFD ramps do this; a VFD also sets the speed and shares the load between several drives.
- **Gearmotors**: most conveyors are driven by helical, bevel-helical or worm gearmotors of 0.18 to tens of kW. Helical and bevel stages lose a few per cent each; worm gears lose far more at high ratios (and more when cold and new).
- **Inclines**: a loaded inclined conveyor runs backwards when stopped. A **backstop** (a one-way clutch) or a brake holds it.

### Cranes and hoists
The hoist motor must lift the rated load at rated speed, $P = m g v/\\eta$, plus the overload of the crane's proof tests (typically about 110 % moving and 125 % static), and do it many times an hour: hoist motors are rated for **intermittent duty** (S3 or S4, say 40 % on-time with a stated number of starts per hour — see [[duty-cycles]]), and cranes classify their mechanisms by load spectrum and running time (ISO 4301-1 groups M1 to M8).

| Hoist drive | Character |
|---|---|
| Two-speed pole-changing motor with brake | fast and creep speeds (about 4:1 to 6:1); simple; jerky |
| Conical-rotor brake motor | the rotor's axial pull releases the brake as it starts — a classic of chain and rope hoists |
| Slip-ring motor with rotor resistors | older large cranes; heat in the resistors |
| Induction motor on a closed-loop vector VFD with an encoder | smooth, precise, full torque at zero speed; the modern standard |
| Air or hydraulic motor with brake | hazardous areas, offshore, mobile cranes |

**The brake** is spring-applied and released electrically (or by air or oil): it holds whenever power is lost. It is a safety component, sized well above the load torque, inspected and adjusted as it wears ([[motor-brakes]]).

**The brake sequence** with a VFD matters as much as the brake. To start: enable the drive, magnetise the motor, and **prove torque** — make sure it can hold the load — before releasing the brake, then accelerate. To stop: decelerate to zero speed, *hold* with the motor while the brake sets, then switch off. Release too early and the load drops (rollback); switch off too early and it drops again. The sim below lets you get it wrong safely.

**Lowering** a load, the motor is driven by it and generates: $P = m g v\\,\\eta$ must go into a braking resistor or back to the mains through a regenerative unit ([[vfd-braking]]).

**Limits and protection**: upper and lower hoist limits (rotary cam or geared limit switches) with an independent ultimate limit, an overload limiter, slack-rope detection, and an emergency stop that sets the brake ([[limit-switches]], [[emergency-stop]]). Travel drives (trolley, bridge) use ramps shaped to limit load sway.

> [!warn] Never stand or work under a suspended load. Before maintenance, land the load, isolate and lock off the supply, and secure anything the brake was holding. Brake adjustments, limit-switch settings and drive parameters on hoists are for competent persons and follow the crane's manual and local lifting regulations.

> [!key] Conveyors: size for breakaway, start gently, stop runback. Hoists: size for lifting plus test overload in intermittent duty, prove torque before releasing a fail-safe brake, hold with the motor until the brake sets, and burn or return the lowering energy.
`,
  ideas: [
    'Conveyors and hoists are constant-torque loads that must start fully loaded.',
    'Breakaway torque can be 1.3–2 times running torque: check starting, not only running.',
    'Hoist power m·g·v/η in intermittent duty; mechanisms are classified by load spectrum and running time.',
    'A hoist brake is spring-applied; the drive must prove torque before release and hold until it sets.',
    'Lowering loads regenerate m·g·v·η, which a braking resistor or regenerative unit must take.'
  ],
  pitfalls: [
    'A worm gearbox is self-locking, so the hoist needs no brake — Worm gears can back-drive, especially under vibration and as they wear; hoists need a spring-applied brake.',
    'A motor that runs the conveyor will also start it — Breakaway torque with a full belt can far exceed running torque.',
    'Releasing the brake as the drive starts is fine — Until the motor has built torque, the load is free; it drops — rollback.'
  ],
  formulas: [
    {
      name: 'Hoisting power',
      expr: 'P = m*g*v/eta', tex: 'P = \\dfrac{m\\,g\\,v}{\\eta}',
      vars: {
        P: { name: 'motor shaft power', q: 'power', unit: 'kW' },
        m: { name: 'load (with hook and ropes)', q: 'mass', unit: 'kg', value: 2000 },
        g: { const: 'g' },
        v: { name: 'hoisting speed', q: 'speed', unit: 'm/s', value: 0.133 },
        eta: { name: 'efficiency of gearbox, drum and reeving', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta' }
      },
      note: '0.133 m/s is 8 m/min. Add the crane\'s proof overload and check the duty (S3/S4).',
      stories: { P: 'A hoist lifts {m} at {v} through a train of {eta} efficiency. What motor power does it need?', v: 'A {P} hoist motor with {eta} efficiency lifts {m}. How fast can it lift?' }
    },
    {
      name: 'Pull to move a conveyor load',
      expr: 'F = m*g*(mu*cos(a) + sin(a))', tex: 'F = m\\,g\\,(\\mu\\cos\\alpha + \\sin\\alpha)',
      vars: {
        F: { name: 'belt pull', q: 'force', unit: 'N' },
        m: { name: 'load on the belt', q: 'mass', unit: 'kg', value: 800 },
        g: { const: 'g' },
        mu: { name: 'equivalent friction coefficient', value: 0.03, tex: '\\mu' },
        a: { name: 'incline', q: 'angle', unit: '°', value: 10, min: 0, max: 45, tex: '\\alpha' }
      },
      note: 'μ lumps together idler and belt resistance: a few hundredths for belts on idlers, much more for belts sliding on a bed. Add the belt\'s own mass and the breakaway margin.',
      stories: { F: 'A belt carries {m} up an incline of {a} with an equivalent friction of {mu}. What pull does it need?' }
    },
    {
      name: 'Torque at the motor',
      expr: 'T = F*D/(2*i*eta)', tex: 'T = \\dfrac{F\\,D}{2\\,i\\,\\eta}',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        F: { name: 'pull at the drum or rope', q: 'force', unit: 'N', value: 19620 },
        D: { name: 'drum diameter', q: 'length', unit: 'mm', value: 250 },
        i: { name: 'total ratio (gearbox and reeving)', value: 60 },
        eta: { name: 'efficiency of the train', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { T: 'A drum of {D} pulls {F} through a ratio of {i} at {eta}. What torque must the motor give?', i: 'What ratio lets a motor of {T} pull {F} on a {D} drum at {eta}?' }
    },
    {
      name: 'Power returned while lowering',
      expr: 'P = m*g*v*eta', tex: 'P_r = m\\,g\\,v\\,\\eta',
      vars: {
        P: { name: 'power reaching the drive while lowering', q: 'power', unit: 'kW', tex: 'P_r' },
        m: { name: 'load', q: 'mass', unit: 'kg', value: 2000 },
        g: { const: 'g' },
        v: { name: 'lowering speed', q: 'speed', unit: 'm/s', value: 0.133 },
        eta: { name: 'efficiency of the train (and motor)', q: 'ratio', unit: '%', value: 80, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'The braking resistor or regenerative unit must take this for the whole lowering time.',
      stories: { P: 'A hoist lowers {m} at {v} with {eta} efficiency. What power must the braking resistor absorb?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a hoist motor',
      q: 'A hoist lifts 2 t at 8 m/min with a drum of 250 mm, a total ratio (gearbox and 2:1 reeving) of 60 and 85 % efficiency. Find the motor power, torque and speed.',
      steps: [
        '$P = 2000 \\times 9.81 \\times 0.133/0.85 = 3.08$ kW.',
        'Rope pull on the drum $2000 \\times 9.81 = 19.6$ kN (the reeving is in the ratio); $T = 19\\,620 \\times 0.25/(2 \\times 60 \\times 0.85) = 48$ N·m.',
        'Motor speed $= P/T$: $3080/48 = 64$ rad/s, about 610 rpm — so a 4-pole motor at 1450 rpm would need a ratio of about 140, or a larger drum.',
        'With the proof overload and S3 duty, a 4 kW hoist-rated brake motor is a sensible choice.'
      ],
      a: 'About 3.1 kW and 48 N·m at the motor; choose a 4 kW hoist-duty brake motor and match the ratio to its speed.'
    },
    {
      title: 'An inclined conveyor',
      q: '800 kg of material rides a belt up a 10° incline (μ = 0.03) on a 400 mm drum through a 40:1 gearbox at 90 %. What torque does the motor need running, and how much to break away if breakaway is 1.6 times?',
      steps: [
        '$F = 800 \\times 9.81 \\times (0.03\\cos 10° + \\sin 10°) = 7848 \\times 0.203 = 1594$ N.',
        '$T = 1594 \\times 0.4/(2 \\times 40 \\times 0.9) = 8.9$ N·m running.',
        'Breakaway $1.6 \\times 8.9 = 14$ N·m — and a backstop to stop the loaded belt running back.'
      ],
      a: 'About 9 N·m running, 14 N·m to start.'
    }
  ],
  quiz: [
    { q: 'A hoist drive releases its brake the instant the start command arrives, before the motor has built torque. What happens?', choices: ['The load drops a little before the motor catches it', 'Nothing: the brake is too slow to matter', 'The motor overheats', 'The VFD trips on undervoltage'], a: 0, why: 'For a moment nothing holds the load; the result is rollback. Drives prove torque before releasing the brake.' },
    { q: 'Where does the energy of a load being lowered go on a VFD-driven hoist?', choices: ['Into a braking resistor or back to the mains through a regenerative unit', 'Into the brake linings', 'Into the motor\'s fan', 'It is stored in the gearbox'], a: 0, why: 'The motor generates while lowering; the DC bus rises and the chopper or regenerative unit takes the energy.' },
    { q: 'A loaded conveyor that runs well after a pause may fail to start because…', choices: ['breakaway torque exceeds running torque', 'the motor has cooled', 'the belt is lighter', 'the gearbox is warm'], a: 0, why: 'Static friction, cold grease and settled material raise the starting torque above the running torque.' },
    { q: 'A hoist lifts 1000 kg at 0.2 m/s with 80 % efficiency. What motor power is needed?', answer: 2.45, unit: 'kW', why: '$1000 \\times 9.81 \\times 0.2/0.8 = 2452$ W.' }
  ],
  problems: [
    { q: 'A crane lowers 5 t at 0.1 m/s; 85 % of the power reaches the drive. What power must the braking resistor absorb?', answer: 4.17, unit: 'kW', tol: 0.02,
      steps: ['$P = 5000 \\times 9.81 \\times 0.1 \\times 0.85 = 4169$ W.'] }
  ],
  choose: {
    good: [
      'Conveyors: helical or bevel gearmotors with soft starters or VFDs; backstops on inclines.',
      'Hoists: brake motors rated for intermittent duty, on closed-loop vector VFDs with torque proving.',
      'Hazardous or offshore hoisting: air or hydraulic motors with spring-applied brakes.'
    ],
    avoid: [
      'Direct-on-line starts on long belts and chains.',
      'Relying on worm gears, closed valves or a stopped motor to hold a load.',
      'Brake control left to a timer instead of the drive\'s brake logic.'
    ],
    check: [
      'Breakaway torque, starting torque or drive overload, and the duty (starts per hour, on-time).',
      'Brake torque, release and set times, and the brake sequence.',
      'Where the lowering energy goes: braking resistor rating or regeneration.',
      'Limit switches, overload limiter, emergency stop, and the crane\'s classification and rules.'
    ]
  },
  applications: [
    'Warehouse and airport baggage conveyors: gearmotors with VFDs and accumulation logic.',
    'Overhead travelling cranes: VFD hoists with encoders, anti-sway travel drives.',
    'Mine and quarry belt conveyors: large soft-started or VFD drives with load sharing.',
    'Size your own in [the conveyor](#/tools/sizing/conveyor) and [hoist](#/tools/sizing/hoist) tools.'
  ],
  sources: [
    'ISO 4301-1, *Cranes — Classification — General*.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: duty types S1–S10.',
    'IEC 60204-32, *Safety of machinery — Electrical equipment of machines — Requirements for hoisting machines*.',
    'IEC 61800-5-2, *Adjustable speed electrical power drive systems — Safety requirements — Functional*.'
  ],
  sim: 'as-hoist'
},

{
  id: 'motors-machine-tools', parent: 'comparisons', title: 'Spindle and axis motors in machine tools', level: 2,
  short: 'A machine tool has two kinds of drive. The spindle needs power over a wide speed range — constant torque up to a base speed, constant power above it — from an induction or PM motor on a vector drive, belted, geared or built into the spindle. The axes need fast, stiff, precise positioning from servo motors on ball screws, linear motors or direct-drive torque motors.',
  keywords: ['spindle motor', 'machining centre', 'lathe', 'router spindle', 'motorised spindle', 'constant power', 'base speed', 'S6 rating', 'cutting speed', 'material removal rate', 'specific cutting energy', 'feed axis', 'ball screw', 'linear motor', 'torque motor', 'rigid tapping', 'thermal growth'],
  prereq: ['positioning-vs-speed', 'vector-control-vfd', 'lead-ball-screws', 'duty-cycles'],
  related: ['ac-servo-motors', 'servo-tuning', 'following-error', 'linear-motors', 'torque-motors', 'bearings-motors', 'motor-heating', 'closed-loop-steppers', 'absolute-encoders', 'turbine-air-motors', 'inertia-matching'],
  body: `
A machine tool asks two very different things of its motors: the **spindle** must deliver cutting power across a wide range of speeds, and the **axes** must put the tool exactly where the program says, fast and without overshoot.

### Spindles: power over a speed range
A spindle motor — usually an induction motor on a closed-loop vector drive, sometimes a PM synchronous motor — gives **constant torque up to its base speed and constant power above it**, where the drive weakens the field. A small tool at high speed needs power, not torque; a large face mill or a tap at low speed needs torque. Spindle motors are rated **S1** (continuous) and **S6** (periodic, for example 40 % on-load), the S6 figure often a third or more higher ([[duty-cycles]]).

| Spindle | Typical rating | Speeds | Character |
|---|---|---|---|
| Belt-driven machining centre | 7.5–22 kW S1 | base 1000–1500 rpm, top 6000–12 000 rpm | flexible ratio, motor out of the heat |
| Geared (lathes, heavy mills) | 11–50 kW | two or more ranges | high torque at low speed |
| Motorised (built-in) spindle | 10–40 kW | to 15 000–40 000 rpm | motor inside the spindle, water-cooled, no belt |
| Router / engraving spindle on a VFD | 0.8–6 kW | 6000–24 000 rpm | constant torque: the rated power only at top speed |
| Air-turbine or high-frequency spindles | watts to a few kW | 40 000 rpm and more | small tools, fine work (see [[turbine-air-motors]]) |

The **cutting speed** $v_c$ (m/min) sets the spindle speed, $n = 1000\\,v_c/(\\pi D)$ for a tool of diameter $D$ in mm. Typical values: carbide in steel 150–300 m/min, in aluminium 300–1000 m/min or more, high-speed steel in steel 20–40 m/min. The **cutting power** is the metal removed per second times the material's **specific cutting energy** $u$ — roughly 0.4–1.1 W·s/mm³ for aluminium alloys, 1–5 for cast iron, 2–9 for steels, 2–5 for stainless steel and titanium:

$$P = u\\,Q, \\qquad Q = a_p\\,a_e\\,v_f$$

(depth of cut, width of cut, feed rate). The torque the spindle must give is $T = 9550\\,P/n$ (kW, rpm). The sim below puts your cut on the spindle's torque and power curves.

A router spindle rated 2.2 kW at 24 000 rpm gives a constant 0.88 N·m, so its power is [[?proportional|proportional]] to speed: at 12 000 rpm it has only 1.1 kW, and at 6000 rpm 0.55 kW — fine for small cutters in wood and aluminium, weak for large tools at low speed. That, not the kilowatt figure, is what separates it from a machining-centre spindle.

Spindles also **orient** (stop at an angle for tool changes) and **synchronise** with an axis for rigid tapping, both through an encoder on the spindle. Their bearings (preloaded angular-contact sets) and their heat set the speed limit and the accuracy: a spindle grows by several micrometres as it warms, which is why machines warm up before precision work.

### Axes: position, fast and stiff
Feed axes use **AC servo motors** on ball screws — typical rapids 24–60 m/min and accelerations of a few m/s² on general machining centres — or **linear motors** for higher speed and acceleration without screw whip, and **direct-drive torque motors** on rotary tables and trunnions ([[linear-motors]], [[torque-motors]]). Absolute encoders avoid homing; the vertical axis carries a holding brake and often a counterbalance. The axis servo is tuned for stiffness and low [[following-error|following error]], with feed-forward so that contours stay true at speed. Small and hobby machines use steppers (open or [[closed-loop-steppers|closed-loop]]) on lead or ball screws, sized as in [[positioning-vs-speed]].

Heat matters here too: motor and screw heat lengthen a steel ball screw by about 11–12 µm per metre per kelvin, so precision machines cool their screws or measure with linear scales.

> [!warn] A spindle can hold enormous stored energy, and a tool or workpiece that comes loose is a projectile. Never exceed the maximum speed marked on a tool, chuck or grinding wheel; keep guards and door interlocks working; and stop, isolate and wait for the spindle to stand still (with safe torque off where fitted) before reaching in.

> [!key] Spindle: choose by torque *and* power across the speeds your tools need — constant torque to base speed, constant power above. Axes: servos (or linear and torque motors) sized by the move, tuned for stiffness, with brakes on vertical axes.
`,
  ideas: [
    'Spindles give constant torque up to base speed and constant power above it.',
    'Spindle speed n = 1000 v_c/(πD); cutting power = specific cutting energy × material removal rate.',
    'Router spindles are constant-torque: their rated power exists only at top speed.',
    'Feed axes are servo positioning drives: ball screws, linear motors or torque motors, with brakes on vertical axes.',
    'Heat from spindle and axis motors becomes growth in micrometres: warm-up, cooling and scales.'
  ],
  pitfalls: [
    'A 2.2 kW router spindle can take a 2.2 kW cut at any speed — Its torque is constant, so at half speed it has half the power.',
    'The spindle\'s kW rating is what matters for large tools — At low speed the torque (below base speed) limits the cut.',
    'Axis motors are sized for the cutting force — Usually the rapid moves and accelerations set their peak torque; the cutting force sets the continuous torque.'
  ],
  formulas: [
    {
      name: 'Spindle speed from cutting speed',
      expr: 'n = 1000*vc/(pi*D)', tex: 'n = \\dfrac{1000\\,v_c}{\\pi D}',
      vars: {
        n: { name: 'spindle speed', q: false, unit: 'rpm' },
        vc: { name: 'cutting speed', q: false, unit: 'm/min', value: 200, tex: 'v_c' },
        D: { name: 'tool (or workpiece) diameter', q: false, unit: 'mm', value: 80 }
      },
      stories: { n: 'A {D} cutter should cut at {vc}. What spindle speed is that?', vc: 'A {D} tool turns at {n}. What is its cutting speed?' }
    },
    {
      name: 'Material removal rate in milling',
      expr: 'Q = ap*ae*vf/1000', tex: 'Q = \\dfrac{a_p\\,a_e\\,v_f}{1000}',
      vars: {
        Q: { name: 'material removal rate', q: false, unit: 'cm³/min' },
        ap: { name: 'depth of cut', q: false, unit: 'mm', value: 2, tex: 'a_p' },
        ae: { name: 'width of cut', q: false, unit: 'mm', value: 60, tex: 'a_e' },
        vf: { name: 'feed rate', q: false, unit: 'mm/min', value: 400, tex: 'v_f' }
      },
      stories: { Q: 'A cut {ap} deep and {ae} wide advances at {vf}. How much metal does it remove?' }
    },
    {
      name: 'Cutting power',
      expr: 'P = u*Q/60', tex: 'P = \\dfrac{u\\,Q}{60}',
      vars: {
        P: { name: 'cutting power at the tool', q: false, unit: 'kW' },
        u: { name: 'specific cutting energy', q: false, unit: 'W·s/mm³', value: 3 },
        Q: { name: 'material removal rate', q: false, unit: 'cm³/min', value: 48 }
      },
      note: 'u depends on the material and falls with thicker chips; divide by the spindle drive efficiency for the motor power.',
      stories: { P: 'Removing {Q} of a material needing {u}: what power reaches the tool?', Q: 'A spindle can give {P} at the tool in a material needing {u}. What removal rate can it support?' }
    },
    {
      name: 'Spindle torque',
      expr: 'T = 9550*P/n', tex: 'T = \\dfrac{9550\\,P}{n}',
      vars: {
        T: { name: 'spindle torque', q: false, unit: 'N·m' },
        P: { name: 'power', q: false, unit: 'kW', value: 2.4 },
        n: { name: 'spindle speed', q: false, unit: 'rpm', value: 796 }
      },
      note: '9550 = 60 000/(2π).',
      stories: { T: 'A cut needs {P} at {n}. What torque must the spindle give?' }
    }
  ],
  examples: [
    {
      title: 'Face milling steel',
      q: 'An 80 mm face mill cuts steel at 200 m/min, 2 mm deep, 60 mm wide, feeding 400 mm/min; take u = 3 W·s/mm³. Find the spindle speed, power and torque, and check an 11 kW spindle with a base speed of 1500 rpm.',
      steps: [
        '$n = 1000 \\times 200/(\\pi \\times 80) = 796$ rpm.',
        '$Q = 2 \\times 60 \\times 400/1000 = 48$ cm³/min; $P = 3 \\times 48/60 = 2.4$ kW at the tool.',
        '$T = 9550 \\times 2.4/796 = 29$ N·m.',
        'Below its base speed the spindle gives $9550 \\times 11/1500 = 70$ N·m continuously: at 796 rpm it can offer $70 \\times 796/9550 = 5.8$ kW. The cut uses less than half.'
      ],
      a: '796 rpm, 2.4 kW and 29 N·m — well within the spindle.'
    },
    {
      title: 'A router spindle at low speed',
      q: 'A 2.2 kW router spindle (rated at 24 000 rpm, constant torque) drives a 20 mm cutter in aluminium at 300 m/min. How much power is available?',
      steps: [
        '$n = 1000 \\times 300/(\\pi \\times 20) = 4775$ rpm — below the spindle\'s usual minimum of about 6000 rpm.',
        'Torque $9550 \\times 2.2/24\\,000 = 0.88$ N·m; at 6000 rpm, $P = 0.88 \\times 6000/9550 = 0.55$ kW.',
        'Run at 6000 rpm (377 m/min) and keep the cut within about 0.5 kW, or use a smaller cutter at higher speed.'
      ],
      a: 'Only about 0.55 kW at 6000 rpm: a router spindle wants small tools at high speed.'
    },
    {
      title: 'Axis speed',
      q: 'A machining centre rapids at 30 m/min on a 10 mm lead ball screw driven directly. What motor speed is needed?',
      steps: ['$n = 30\\,000/10 = 3000$ rpm — exactly the rated speed of common servo motors.'],
      a: '3000 rpm.'
    }
  ],
  quiz: [
    { q: 'A spindle has constant torque to 1500 rpm and constant power above. A small drill at 8000 rpm is limited by…', choices: ['the spindle\'s power', 'the spindle\'s torque', 'the axis motors', 'nothing'], a: 0, why: 'Above base speed the available torque falls as P/ω; the power is the limit.' },
    { q: 'A 2.2 kW router spindle rated at 24 000 rpm is used at 12 000 rpm. About how much power can it give?', answer: 1.1, unit: 'kW', why: 'Constant torque (0.88 N·m): power is proportional to speed, 2.2 × 12/24.' },
    { q: 'What is the spindle speed for a 10 mm carbide end mill in aluminium at 500 m/min?', answer: 15915, unit: 'rpm', why: '$1000 \\times 500/(\\pi \\times 10) = 15\\,915$ rpm.' },
    { q: 'A machine\'s ball screws grow as they warm, by about 11–12 µm per metre per kelvin.', a: true, why: 'That is the expansion of steel; a few kelvin over a metre of screw is tens of micrometres, which is why screws are cooled or scales used.' }
  ],
  problems: [
    { q: 'Slotting steel with a 16 mm cutter: 8 mm deep, 16 mm wide, feed 300 mm/min, u = 3.5 W·s/mm³. What cutting power is needed?', answer: 2.24, unit: 'kW', tol: 0.02,
      steps: ['$Q = 8 \\times 16 \\times 300/1000 = 38.4$ cm³/min.', '$P = 3.5 \\times 38.4/60 = 2.24$ kW.'] }
  ],
  choose: {
    good: [
      'Belt or geared induction spindles on vector drives for general machining with large tools.',
      'Motorised spindles for high speed and precision; router spindles for small tools in soft materials.',
      'AC servos on ball screws for axes; linear and torque motors for the highest dynamics and rotary tables.'
    ],
    avoid: [
      'Judging spindles by kW alone: check torque at the speeds your largest tools need.',
      'Router spindles for large tools at low speed.',
      'Open-loop steppers on production machines where a lost step scraps a part.'
    ],
    check: [
      'The torque and power curves (S1 and S6) against your cuts; minimum and maximum speeds.',
      'Orientation and rigid tapping (spindle encoder), cooling, bearings and warm-up.',
      'Axis rapids, acceleration, inertia ratio, brake on the vertical axis, encoder type.',
      'Guards, interlocks and safe stopping of the spindle.'
    ]
  },
  applications: [
    'Vertical machining centres: 7.5–22 kW belt-driven spindles, servo axes at 24–60 m/min.',
    'High-speed mould machining with motorised spindles at 20 000–40 000 rpm.',
    'CNC routers for wood and aluminium: VFD router spindles and stepper or servo axes.',
    'Size an axis in [the axis sizing tool](#/tools/sizing/axis).'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: duty types S1 and S6.',
    'Kalpakjian and Schmid, *Manufacturing Engineering and Technology* — cutting mechanics and approximate specific energies for common materials.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines*; ISO 16090-1 on the safety of machining centres.',
    'Hughes and Drury, *Electric Motors and Drives* — field weakening and constant-power operation.'
  ],
  sim: 'as-spindle'
},

{
  id: 'motors-vehicles', parent: 'comparisons', title: 'Traction motors: cars, bikes and trains', level: 2,
  short: 'A traction motor must pull from standstill up hills, then run efficiently over a wide range of speeds: full torque up to a base speed, constant power above it. Electric cars mostly use permanent-magnet synchronous motors on SiC or IGBT inverters, e-bikes brushless hub or mid-drive motors, trains three-phase induction motors fed from the catenary — all braking regeneratively.',
  keywords: ['traction motor', 'electric vehicle motor', 'EV motor', 'PMSM', 'IPM motor', 'induction traction motor', 'e-bike motor', 'hub motor', 'mid-drive', 'pedelec', 'train traction', 'catenary', 'regenerative braking', 'road load', 'tractive effort', 'field weakening', 'gradeability', 'adhesion'],
  prereq: ['torque-and-power', 'pmsm-motor', 'foc-control', 'load-torque-types'],
  related: ['bldc-motor', 'bldc-selection', 'vfd-braking', 'pancake-motors', 'efficiency-losses', 'motor-heating', 'squirrel-cage', 'reluctance-motors', 'motor-comparison', 'electronics:batteries', 'physics:rolling-motion'],
  body: `
A vehicle's motor faces the widest duty of any: full torque to start on a hill, high speed on a motorway, a great deal of part-load cruising, and braking energy to recover.

### What the road asks
The force to keep a vehicle of mass $m$ moving at speed $v$ up a grade $\\theta$ is the **road load**

$$F = m g\\,(C_{rr} + \\sin\\theta) + \\tfrac12 \\rho\\, C_d A\\, v^2$$

— rolling resistance, gravity and air drag, which grows with the [[?exponent|square]] of speed — plus $m a$ to accelerate. At the wheel of radius $r$, through a reduction $i$ of efficiency $\\eta$, the motor torque is $T = F r/(i\\eta)$ and its speed $n = v\\,i/(2\\pi r)$. The motor's **tractive-effort curve** — constant torque up to a base speed, then constant power as the inverter weakens the field — must lie above the road load: where the curves cross is the top speed, and the gap below it is the acceleration. The sim below draws both for a car, an e-bike and a tram.

A 1800 kg car ($C_{rr}$ = 0.010, $C_dA$ = 0.64 m²) needs only about 13 kW at a steady 100 km/h on the level; the same car accelerating hard or climbing a steep hill needs ten times that. Traction motors therefore have a large **peak** rating (for seconds to tens of seconds) and a smaller **continuous** one, set by cooling.

### Cars
- **Motors**: mostly interior permanent-magnet synchronous motors ([[pmsm-motor]]), for efficiency and power density; also induction motors (no magnets, cheap, good at high speed) and wound-field synchronous motors (no rare earths). Typical 50–300 kW per motor, 12 000–20 000 rpm, a single reduction of about 8:1 to 12:1.
- **Inverters**: IGBT or SiC transistors on 400 V or 800 V batteries, with [[foc-control|field-oriented control]]; efficiency of motor and inverter peaks in the mid-90s per cent and is lower at light load and very high speed.
- **Regeneration**: the motor brakes the car and returns energy to the battery, limited by the battery's charge acceptance; the friction brakes remain for hard stops.

### E-bikes
- **Limits**: in the EU a pedelec may assist only while the rider pedals, up to 25 km/h, with a continuous rated power of 250 W (EN 15194); in the US the federal low-speed electric bicycle is limited to 750 W and 20 mph on the motor alone, and many states use three classes.
- **Hub motors** (brushless, geared or direct-drive) in a wheel; **mid-drive** motors at the crank use the bike's gears and give typically 50–90 N·m at the crank. Batteries of 36 V or 48 V; torque sensors make the assistance feel natural.

### Trains and trams
- **Motors**: three-phase induction traction motors, rugged and brushless, on IGBT or SiC inverters; some newer designs use PM motors. Metros and trams have motors of a hundred to a few hundred kW; a locomotive puts one to about 1.6 MW on each axle.
- **Supply**: DC catenary or third rail (600–750 V for trams and metros, 1.5 kV and 3 kV on main lines), or AC at 15 kV 16.7 Hz or 25 kV 50 Hz through a transformer and rectifier. Older trains used DC series motors with resistors or choppers ([[series-dc-motor]]).
- **Adhesion**: steel on steel transmits only about a quarter to a third of the weight on the driven wheels as tractive force; the inverter controls wheel slip.
- **Regenerative braking** feeds energy back into the line when another train can take it; otherwise it is burned in onboard resistors.

> [!warn] Traction batteries and inverters run at hundreds of volts DC and can deliver enormous currents; their capacitors stay charged after switch-off. Work on them needs high-voltage training, isolation and verification of absence of voltage. Rail catenaries are lethal at a distance: never approach or touch them.

> [!key] Size a traction motor from the road load: peak torque for the steepest start and the acceleration you want, base speed and constant power for the top speed, continuous rating for the hill you climb for minutes. PM motors lead in cars, brushless motors in bikes, induction motors on rails — all braking regeneratively.
`,
  ideas: [
    'Road load = rolling + grade + ½ρC_dAv²; add m·a to accelerate.',
    'Traction motors give constant torque to base speed and constant power above: the tractive-effort curve.',
    'Cars mostly use PM synchronous motors; induction and wound-field motors avoid magnets.',
    'EU pedelecs: assistance to 25 km/h with 250 W continuous; hub and mid-drive motors.',
    'Trains use induction traction motors; adhesion limits the pull to about a quarter to a third of the driven weight.'
  ],
  pitfalls: [
    'A car needs its peak power to cruise — Steady cruising takes a small fraction (about 13 kW at 100 km/h for a mid-size car); peak power is for acceleration and hills.',
    'More motor torque always gives more pull — The tyres or wheels can only transmit what adhesion allows; beyond it they slip.',
    'Regenerative braking recovers all the braking energy — Only what the motor, inverter and battery (or line) can accept, minus their losses.'
  ],
  formulas: [
    {
      name: 'Road load',
      expr: 'F = m*g*(Crr + sin(theta)) + 0.5*rho*Cd*A*v^2', tex: 'F = m g\\,(C_{rr} + \\sin\\theta) + \\tfrac12 \\rho\\, C_d A\\, v^2',
      vars: {
        F: { name: 'force at the wheels', q: 'force', unit: 'N' },
        m: { name: 'vehicle mass', q: 'mass', unit: 'kg', value: 1800 },
        g: { const: 'g' },
        Crr: { name: 'rolling-resistance coefficient', value: 0.01, tex: 'C_{rr}' },
        theta: { name: 'grade angle', q: 'angle', unit: '°', value: 2, min: 0, max: 45, tex: '\\theta' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho' },
        Cd: { name: 'drag coefficient', value: 0.28, tex: 'C_d' },
        A: { name: 'frontal area', q: 'area', unit: 'm²', value: 2.3 },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 100 }
      },
      note: 'Steady speed, small grades (cos θ ≈ 1 in the rolling term). A grade of p % is θ = atan(p/100).',
      practice: { unknowns: ['F', 'v'] },
      stories: { F: 'A {m} car (C_rr {Crr}, C_d {Cd}, A {A}) drives at {v} up a grade of {theta}. What force must the wheels give?', v: 'A {m} car can give {F} at its wheels on a grade of {theta}. How fast can it go?' }
    },
    {
      name: 'Motor torque from the wheel force',
      expr: 'T = F*r/(i*eta)', tex: 'T = \\dfrac{F\\,r}{i\\,\\eta}',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        F: { name: 'force at the wheels', q: 'force', unit: 'N', value: 5436 },
        r: { name: 'wheel radius', q: 'length', unit: 'm', value: 0.33 },
        i: { name: 'reduction ratio', value: 9 },
        eta: { name: 'drivetrain efficiency', q: 'ratio', unit: '%', value: 95, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { T: 'The wheels (radius {r}) must push {F} through a {i}:1 reduction of {eta} efficiency. What torque must the motor give?' }
    },
    {
      name: 'Motor speed from road speed',
      expr: 'n = v*i/(2*pi*r)', tex: 'n = \\dfrac{v\\,i}{2\\pi r}',
      vars: {
        n: { name: 'motor speed', q: 'frequency', unit: 'rpm' },
        v: { name: 'road speed', q: 'speed', unit: 'km/h', value: 150 },
        i: { name: 'reduction ratio', value: 9 },
        r: { name: 'wheel radius', q: 'length', unit: 'm', value: 0.33 }
      },
      stories: { n: 'A car with {r} wheels and a {i}:1 reduction drives at {v}. How fast does its motor turn?', v: 'A motor limited to {n} drives {r} wheels through {i}:1. What is the top speed?' }
    },
    {
      name: 'Power at the wheels',
      expr: 'P = F*v', tex: 'P = F\\,v',
      vars: {
        P: { name: 'power at the wheels', q: 'power', unit: 'kW' },
        F: { name: 'force at the wheels', q: 'force', unit: 'N', value: 476 },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 100 }
      },
      stories: { P: 'A vehicle needs {F} at {v}. What power reaches the wheels?' }
    }
  ],
  examples: [
    {
      title: 'Cruising and climbing',
      q: 'An 1800 kg car (C_rr 0.010, C_d 0.28, A 2.3 m²) drives at 100 km/h on the level. Find the force and power. Then find the motor torque for a hill start on a 20 % grade while accelerating at 1 m/s² (wheel radius 0.33 m, 9:1 reduction, 95 %).',
      steps: [
        'Rolling $1800 \\times 9.81 \\times 0.010 = 177$ N; drag $\\tfrac12 \\times 1.2 \\times 0.28 \\times 2.3 \\times 27.8^2 = 298$ N; total 475 N.',
        '$P = 475 \\times 27.8 = 13.2$ kW.',
        '20 % grade: $\\theta = \\arctan 0.2 = 11.3°$; $F = 17\\,660 \\times (0.010 + 0.196) + 1800 \\times 1 = 5440$ N.',
        '$T = 5440 \\times 0.33/(9 \\times 0.95) = 210$ N·m at the motor.'
      ],
      a: 'About 475 N and 13 kW to cruise; about 210 N·m for the hill start.'
    },
    {
      title: 'An e-bike on a hill',
      q: 'Rider and bike weigh 105 kg (C_rr 0.006, C_dA 0.5 m²). What power is needed at 25 km/h on the level and on a 6 % hill? With 250 W from the motor and 150 W from the rider, how fast does it climb?',
      steps: [
        'Level: rolling $105 \\times 9.81 \\times 0.006 = 6.2$ N, drag $0.5 \\times 1.2 \\times 0.5 \\times 6.94^2 = 14.5$ N: $20.7 \\times 6.94 = 144$ W.',
        '6 % adds $105 \\times 9.81 \\times 0.060 = 61.7$ N: $82.4 \\times 6.94 = 572$ W.',
        'With 400 W: at 5.3 m/s the need is $(6.2 + 61.7 + 8.4) \\times 5.3 = 404$ W, so about 19 km/h.'
      ],
      a: '144 W on the level, 572 W on the hill at 25 km/h; with 400 W it climbs at about 19 km/h.'
    }
  ],
  quiz: [
    { q: 'Where does a traction motor\'s constant-power region come from?', choices: ['The inverter weakens the field above base speed because the voltage is at its limit', 'The gearbox changes ratio', 'The battery voltage rises', 'Friction falls'], a: 0, why: 'Back-EMF grows with speed; once it reaches the available voltage, the field is weakened and torque falls as 1/speed.' },
    { q: 'At 100 km/h on the level, which resistance dominates for a typical car?', choices: ['Air drag', 'Rolling resistance', 'Gravity', 'Bearing friction'], a: 0, why: 'Drag grows with v²; at 100 km/h it is well above rolling resistance for a car.' },
    { q: 'A train\'s pull is limited not only by its motors but by adhesion between wheel and rail.', a: true, why: 'Steel on steel transmits only about a quarter to a third of the weight on the driven wheels; beyond that the wheels slip.' },
    { q: 'A motor limited to 16 000 rpm drives 0.33 m wheels through 9:1. What is the top speed in km/h?', answer: 221, unit: 'km/h', why: '$v = 2\\pi r n/i = 2\\pi \\times 0.33 \\times 266.7/9 = 61.4$ m/s = 221 km/h.' }
  ],
  problems: [
    { q: 'A 1500 kg car climbs a 10 % grade at a steady 50 km/h (C_rr 0.012; ignore drag). What power is needed at the wheels?', answer: 22.8, unit: 'kW', tol: 0.02,
      steps: ['$\\theta = \\arctan 0.1 = 5.71°$, $\\sin\\theta = 0.0995$.', '$F = 1500 \\times 9.81 \\times (0.012 + 0.0995) = 1641$ N.', '$P = 1641 \\times 13.89 = 22.8$ kW.'] }
  ],
  choose: {
    good: [
      'PM synchronous motors for cars and buses where efficiency and power density rule.',
      'Induction traction motors for rail and for cars that value robustness and no magnets.',
      'Brushless hub or mid-drive motors for e-bikes and light vehicles, within the legal limits.'
    ],
    avoid: [
      'Sizing by peak power alone: the continuous rating decides long hills and towing.',
      'Brushed DC traction outside very cheap, low-power vehicles.',
      'Ignoring adhesion and tyre grip when adding torque.'
    ],
    check: [
      'Peak and continuous torque and power; base and maximum speed; the reduction ratio.',
      'Efficiency over the drive cycle, not just the peak; cooling.',
      'Battery or line voltage, inverter current, regeneration limits.',
      'Legal limits (e-bikes), safety of high-voltage systems.'
    ]
  },
  applications: [
    'Electric cars with one or two PM motors and single-speed reductions.',
    'Pedelecs with 250 W mid-drive motors; cargo bikes with hub motors.',
    'Trams and metros with induction motors on inverters, braking regeneratively into the line.',
    'Forklifts and warehouse vehicles with 24–80 V induction or PM traction motors.'
  ],
  sources: [
    'EN 15194, *Cycles — Electrically power assisted cycles — EPAC bicycles*.',
    'Hughes and Drury, *Electric Motors and Drives* — traction, field weakening and inverter-fed motors.',
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines* — interior PM motors and their constant-power range.',
    'IEC 60349 series, *Electric traction — Rotating electrical machines for rail and road vehicles*.'
  ],
  sim: 'as-traction'
},

{
  id: 'motors-robots-drones', parent: 'comparisons', title: 'Motors for robots and drones', level: 2,
  short: 'Robot joints need high torque at low speed with no backlash: servo or frameless brushless motors behind strain-wave, cycloidal or planetary reducers, with a brake and an absolute encoder on every axis. Drones need the opposite: light outrunner brushless motors turning propellers directly, chosen by Kv, propeller size and battery voltage so that hovering takes a comfortable part of full throttle.',
  keywords: ['robot motor', 'robot joint', 'harmonic drive', 'strain wave gear', 'cycloidal reducer', 'RV reducer', 'frameless motor', 'cobot', 'quasi-direct drive', 'AGV', 'drone motor', 'multicopter', 'outrunner', 'Kv', 'propeller', 'hover power', 'thrust-to-weight', 'flight time', 'ESC'],
  prereq: ['servo-principle', 'bldc-selection', 'gearboxes', 'inertia-matching'],
  related: ['ac-servo-motors', 'servo-brakes', 'absolute-encoders', 'inrunner-outrunner', 'esc-drivers', 'pancake-motors', 'torque-motors', 'rms-torque-sizing', 'emergency-stop', 'aerodynamics:hover-power', 'aerodynamics:multicopters', 'electronics:batteries'],
  body: `
Robots and drones sit at the two ends of the motor world: a robot joint wants enormous torque at a few revolutions per minute, a drone propeller wants modest torque at ten thousand.

### Robot joints
A joint must hold an arm against gravity, accelerate it quickly, stop it exactly, and be stiff and free of backlash. The usual answer is a fast, small motor behind a high-ratio reducer:

| Reducer | Ratio | Backlash | Strengths | Where |
|---|---|---|---|---|
| Strain-wave (harmonic) | 30:1–160:1 in one stage | essentially none | compact, light, hollow shaft | wrists, cobots, small arms |
| Cycloidal (RV) | 30:1–200:1 | arc-minutes or less | very stiff, takes shock | base and shoulder axes of large robots |
| Planetary | 3:1–100:1 | a few arc-minutes | efficient, cheap, backdrivable at low ratio | SCARA, mobile robots, legged robots |

The motor is an [[ac-servo-motors|AC servo]] or a frameless brushless motor built into the joint, with an **absolute multi-turn encoder** (no homing after a power cut) and a **spring-applied holding brake** on every axis gravity can move ([[servo-brakes]]). **Collaborative robots** add joint torque sensing or current-based collision detection, so they can stop on contact. **Legged robots** use *quasi-direct drive*: a large-diameter outrunner with a low ratio (about 6:1 to 10:1) so the leg stays backdrivable and survives impacts. Mobile robots and AGVs use 24–48 V brushless wheel motors with gearboxes and brakes.

Sizing a joint: the torque is gravity plus acceleration, $T = m g L\\cos\\theta + J\\alpha$ at the joint, divided by $i\\eta$ at the motor, plus the motor's own inertia times $i$ times the joint acceleration. Check the peak against the motor's peak, the RMS over a cycle against its continuous rating, the motor speed ($i$ times the joint speed), and the brake against the worst holding torque ([[rms-torque-sizing]]). Try it in the sim below.

### Drones
Multicopters use **outrunner** brushless motors ([[inrunner-outrunner]]) turning the propeller directly, each on its own electronic speed controller ([[esc-drivers]]). A motor is named by its stator (2306: 23 mm diameter, 6 mm tall) and its **Kv** — no-load rpm per volt. Large propellers need low Kv (a few hundred rpm/V) at high voltage; small racing props high Kv (about 1700–2800 rpm/V on 4–6 cells).

A propeller's thrust grows with the square of its speed and the fourth power of its diameter, its power with the cube of speed and the fifth power of diameter. From momentum theory the ideal power to hover is a [[?square-root|square root]]:

$$P = \\sqrt{\\frac{T^3}{2\\rho A}}$$

for a thrust $T$ through a disc of area $A$ ([[aerodynamics:hover-power]]); real propellers need about 1.5 times that, and the motor and ESC lose another 15–25 %. **Bigger, slower propellers hover more efficiently** — the same thrust through a larger disc. Rules of thumb: a thrust-to-weight ratio of at least 2 for camera and work drones (so hovering is about half throttle), 5–10 for racing; hover efficiency of roughly 5–12 grams per watt; LiPo cells at 3.7 V nominal (4.2 V full) in 3S–12S packs.

| Drone | Mass | Props | Motor, Kv | Cells | Typical hover time |
|---|---|---|---|---|---|
| 5-inch racer | 0.5–0.8 kg | 5 in | 2306, 1700–2600 | 4–6S | a few minutes of hard flying |
| Camera quad | 1–3 kg | 9–15 in | 2212–4114, 400–900 | 4–6S | 20–35 min |
| Heavy-lift octo | 10–25 kg | 20–30 in | large outrunners, 100–300 | 12S | 15–30 min |

> [!warn] Robot arms move suddenly and hard: stay outside the guarded cell unless the robot is in a safe mode, and never release joint brakes on a gravity axis without supporting the arm. Drone propellers cut: remove them for any work on the bench, arm only in the open, and follow the local drone rules. LiPo batteries burn fiercely when damaged or overcharged.

> [!key] Robot joints: fast small motor, high-ratio low-backlash reducer, absolute encoder, brake; size by gravity plus acceleration at the joint. Drones: direct-drive outrunners chosen by propeller, Kv and cell count so hover sits near half throttle; bigger props hover more efficiently.
`,
  ideas: [
    'Robot joints pair small fast servo or frameless motors with strain-wave, cycloidal or planetary reducers.',
    'Every gravity-loaded axis needs a spring-applied brake; absolute encoders avoid homing.',
    'Joint torque = m g L cos θ + J α; at the motor divide by iη and add the motor inertia term.',
    'Drone motors are direct-drive outrunners; Kv, propeller and cell count must match.',
    'Ideal hover power √(T³/2ρA): bigger, slower propellers hover more efficiently.'
  ],
  pitfalls: [
    'A high-ratio reducer makes any small motor enough — Reflected inertia and the motor speed (i × joint speed) grow with the ratio; check speed and dynamics too.',
    'A higher-Kv motor is a stronger motor — Kv only sets speed per volt; with a large propeller a high-Kv motor draws huge currents and burns.',
    'Hover time grows in proportion to battery size — A bigger battery is heavier, so hover power rises too; the gain flattens and then reverses.'
  ],
  formulas: [
    {
      name: 'Ideal hover power of a rotor',
      expr: 'P = sqrt(T^3/(2*rho*pi*D^2/4))', tex: 'P = \\sqrt{\\dfrac{T^3}{2\\rho\\,(\\pi D^2/4)}}',
      vars: {
        P: { name: 'ideal power to hover (momentum theory)', q: 'power', unit: 'W' },
        T: { name: 'thrust of the rotor', q: 'force', unit: 'N', value: 4.9 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        D: { name: 'propeller diameter', q: 'length', unit: 'in', value: 10 }
      },
      note: 'Real propellers need about 1.5 times this (figure of merit 0.6–0.7); divide again by the motor and ESC efficiency.',
      stories: { P: 'A {D} propeller must give {T} of thrust in air of {rho}. What is the least power it could hover with?', D: 'What propeller diameter would hover {T} with an ideal {P}?' }
    },
    {
      name: 'No-load speed from Kv',
      expr: 'n = Kv*V', tex: 'n = K_v\\,V',
      vars: {
        n: { name: 'no-load speed', q: false, unit: 'rpm' },
        Kv: { name: 'speed constant', q: false, unit: 'rpm/V', value: 900, tex: 'K_v' },
        V: { name: 'battery voltage', q: false, unit: 'V', value: 14.8 }
      },
      note: 'Under a propeller the speed is lower, typically 75–90 % of this at full throttle.',
      stories: { n: 'A {Kv} motor runs from {V}. What is its no-load speed?', Kv: 'A motor must reach about {n} unloaded from {V}. What Kv does it need?' }
    },
    {
      name: 'Flight time',
      expr: 't = 60*E*u/P', tex: 't = \\dfrac{60\\,E\\,u}{P}',
      vars: {
        t: { name: 'hover time', q: false, unit: 'min' },
        E: { name: 'battery energy', q: false, unit: 'Wh', value: 74 },
        u: { name: 'usable fraction of the energy', q: 'ratio', unit: '%', value: 80, min: 1, max: 100 },
        P: { name: 'electrical power in hover', q: false, unit: 'W', value: 256 }
      },
      stories: { t: 'A {E} battery, of which {u} is usable, feeds a drone drawing {P} in hover. How long can it hover?' }
    },
    {
      name: 'Motor torque to hold a robot arm',
      expr: 'T = m*g*L/(i*eta)', tex: 'T = \\dfrac{m\\,g\\,L}{i\\,\\eta}',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        m: { name: 'mass (payload and arm, lumped)', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        L: { name: 'horizontal distance to its centre of gravity', q: 'length', unit: 'm', value: 0.6 },
        i: { name: 'reducer ratio', value: 100 },
        eta: { name: 'reducer efficiency', q: 'ratio', unit: '%', value: 75, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'Arm horizontal, holding still; add J α for acceleration. The brake must hold m g L at the joint (times its margin).',
      stories: { T: 'An arm holds {m} at {L} through a {i}:1 reducer of {eta}. What torque must the motor give?' }
    }
  ],
  examples: [
    {
      title: 'A shoulder joint',
      q: 'A small arm carries 3 kg at 0.5 m; the arm itself weighs 4 kg with its centre at 0.25 m. It must accelerate at 3 rad/s² from horizontal. The joint has a 100:1 strain-wave gear (75 %). Find the joint and motor torques, and the motor speed at 90°/s.',
      steps: [
        'Gravity: $3 \\times 9.81 \\times 0.5 + 4 \\times 9.81 \\times 0.25 = 14.7 + 9.8 = 24.5$ N·m.',
        'Inertia about the joint: $3 \\times 0.5^2 + 4 \\times 0.5^2/3 = 0.75 + 0.33 = 1.08$ kg·m²; $J\\alpha = 3.25$ N·m. Total 27.8 N·m.',
        'Motor: $27.8/(100 \\times 0.75) = 0.37$ N·m (plus its own inertia term).',
        'Motor speed: $90°/\\text{s} = 1.57$ rad/s, ×100 = 157 rad/s = 1500 rpm. A 200 W servo (0.64 N·m, 3000 rpm) fits; the brake must hold 24.5 N·m at the joint.'
      ],
      a: 'About 28 N·m at the joint, 0.37 N·m and 1500 rpm at the motor.'
    },
    {
      title: 'A camera quad',
      q: 'A 2.0 kg quad has 10-inch propellers. Estimate the hover power and hover time on a 4S 5 Ah pack (14.8 V, 80 % usable), assuming the real propeller needs 1.6 times the ideal power and motor and ESC are 80 % efficient.',
      steps: [
        'Thrust per rotor $2.0 \\times 9.81/4 = 4.9$ N; ideal $P = \\sqrt{4.9^3/(2 \\times 1.225 \\times 0.0507)} = 30.8$ W.',
        'Real: $30.8 \\times 1.6/0.8 = 62$ W per rotor, 246 W in all — about 8 g/W.',
        'Energy $14.8 \\times 5 = 74$ Wh; $t = 60 \\times 74 \\times 0.8/246 = 14$ min.'
      ],
      a: 'About 250 W and 14 minutes of hover.'
    }
  ],
  quiz: [
    { q: 'Which reducer suits a cobot\'s wrist joint best?', choices: ['A strain-wave (harmonic) gear', 'A worm gear', 'A chain drive', 'A single spur-gear pair'], a: 0, why: 'High ratio in one small, light stage with essentially no backlash.' },
    { q: 'Doubling a rotor\'s diameter at the same thrust changes its ideal hover power by a factor of…', choices: ['1/2', '1/4', '2', '1/√2'], a: 0, why: '$P \\propto T^{3/2}/\\sqrt{A} \\propto 1/D$: twice the diameter, half the power.' },
    { q: 'What is the ideal hover power of a 12-inch rotor giving 10 N of thrust at sea level (ρ = 1.225)?', answer: 74.8, unit: 'W', why: '$A = \\pi \\times 0.3048^2/4 = 0.0730$ m²; $P = \\sqrt{10^3/(2 \\times 1.225 \\times 0.0730)} = \\sqrt{1000/0.1788} = 74.8$ W.' },
    { q: 'Every robot axis that gravity can move needs a holding brake.', a: true, why: 'When power or the drive is lost, only a spring-applied brake stops the arm falling.' }
  ],
  problems: [
    { q: 'A drone draws 400 W in hover from a 6S 8 Ah pack (22.2 V), 80 % usable. How long can it hover?', answer: 21.3, unit: 'min', tol: 0.02,
      steps: ['$E = 22.2 \\times 8 = 177.6$ Wh.', '$t = 60 \\times 177.6 \\times 0.8/400 = 21.3$ min.'] }
  ],
  choose: {
    good: [
      'Robot joints: AC servo or frameless brushless motors with strain-wave or cycloidal reducers, absolute encoders and brakes.',
      'Legged robots: quasi-direct-drive outrunners with low-ratio planetaries.',
      'Drones: outrunner brushless motors matched to the propeller, Kv and cell count.'
    ],
    avoid: [
      'Steppers in robot joints that must be safe, backdrivable or dynamic.',
      'Gravity axes without brakes; brakes released without supporting the arm.',
      'High-Kv motors on large props: huge currents, hot motors and ESCs.'
    ],
    check: [
      'Joint torque (gravity plus acceleration), motor speed, RMS torque and inertia ratio.',
      'Reducer backlash, stiffness, efficiency and shock rating.',
      'Drone: hover throttle near half, thrust-to-weight, current per motor against the ESC, hover time.',
      'Safety: guarding, collaborative limits, propeller guards and local drone rules.'
    ]
  },
  applications: [
    'Six-axis industrial robots: servo motors with cycloidal reducers at the base and strain-wave gears in the wrist.',
    'Collaborative robots: integrated joint modules with torque sensing.',
    'Camera and inspection drones: low-Kv outrunners on large props for long hover.',
    'Warehouse AGVs: brushless wheel motors with gearboxes and brakes.'
  ],
  sources: [
    'ISO 10218-1 and -2, *Robotics — Safety requirements for industrial robots*; ISO/TS 15066, *Robots and robotic devices — Collaborative robots*.',
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines* — outrunner and frameless brushless motors.',
    'Momentum (actuator-disc) theory of hovering rotors: see [[aerodynamics:hover-power]].',
    'Hughes and Drury, *Electric Motors and Drives* — servo drives and gearing.'
  ],
  sim: 'as-robot-drone'
}

);
