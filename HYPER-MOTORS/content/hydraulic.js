/* HYPER-MOTORS · content/hydraulic.js — hydraulic motors and the system around them.
 *   hydraulic-motor-types:    principle, gear, vane, axial-piston, radial-piston, orbital motors, sizing
 *   hydraulic-motor-circuits: power unit, control valves, counterbalance and brakes, hydrostatic transmissions,
 *                             fluids and filtration, heat and noise
 * Simulations in sims/hydraulic.js (prefix hy-). */
Hyper.add(

{
  id: 'hydraulic-motor-principle', parent: 'hydraulic-motor-types', title: 'How a hydraulic motor works', level: 1,
  short: 'A hydraulic motor is a positive-displacement pump run backwards: every revolution passes a fixed volume of oil, its displacement. Pressure difference times displacement gives the torque, flow divided by displacement gives the speed, and leakage and friction take a few per cent of each.',
  keywords: ['hydraulic motor', 'displacement', 'cm³/rev', 'torque', 'pressure difference', 'flow', 'speed', 'volumetric efficiency', 'hydromechanical efficiency', 'starting torque', 'breakaway torque', 'leakage', 'case drain', 'hydraulic power'],
  prereq: ['torque-and-power', 'hydraulics:hydraulic-motors', 'hydraulics:pressure-flow-power'],
  related: ['gear-motors-hyd', 'axial-piston-motors', 'radial-piston-motors', 'orbital-motors', 'hydraulic-motor-sizing', 'hydraulic-power-unit', 'air-motor-principle', 'hydraulics:motor-torque-speed', 'hydraulics:pump-efficiencies', 'physics:torque'],
  body: `
A hydraulic motor is a positive-displacement pump driven backwards. Oil under pressure flows into chambers that grow as the shaft turns — the spaces between gear teeth, the pockets behind vanes, the bores behind pistons — and leaves from chambers that shrink on the other side. Every revolution passes one fixed volume of oil through the motor: its **displacement** $V_g$, in cm³/rev. Two facts follow, and between them they hold almost all of hydraulic motor sizing.

### Pressure makes torque
Pushing a volume $V_g$ through the motor against a pressure difference $\\Delta p$ takes the work $\\Delta p\\,V_g$ each revolution, and a revolution is $2\\pi$ [[?radian|radians]]. So the ideal torque is

$$T_{th} = \\frac{V_g\\,\\Delta p}{2\\pi}$$

— about **1.59 N·m for every cm³/rev and every 100 bar**. A 100 cm³/rev motor at 200 bar gives 318 N·m in theory. The $\\Delta p$ is the *difference* between the inlet and the outlet: 20 bar of back-pressure in the return line takes 20 bar off the torque. And the pressure is not chosen — the load sets it. A motor with no load runs at a few bar; brake the shaft and the pressure climbs until the torque balances the load, or until the relief valve opens.

### Flow makes speed
Every revolution swallows $V_g$ of oil, so the speed is the flow divided by the displacement: 60 L/min into 100 cm³/rev turns the shaft at 600 rpm, whatever the load. The pump and the valves set the flow; the motor's speed follows it. That is why a hydraulic drive is stiff against load changes — and why a small motor on a big flow over-speeds.

### Where the losses go
Real motors lose a little of each:

- **Leakage** (volumetric loss): oil slips from the high-pressure side through the clearances to the low side and into the casing. Leakage grows with $\\Delta p$ and with thinner (hotter) oil, and it hardly depends on speed — so it costs a *constant amount of flow*: $n = Q\\,\\eta_v/V_g$. A motor that leaks 1.5 L/min at 200 bar loses 2.5 % of 60 L/min but half of 3 L/min. That is why every motor has a minimum smooth speed, and why a hydraulic motor alone **cannot hold a load still** — it creeps. Loads are held by a brake (see [[counterbalance-brake-valves]]).
- **Friction** (hydromechanical loss): bearings, pistons on their slippers, gears on their side plates, seals and the shear of the oil cost torque: $T = V_g\\,\\Delta p\\,\\eta_{hm}/(2\\pi)$. At rest the friction is static friction, so the **starting (breakaway) torque** is lower than the running torque — a motor that runs a load at 180 bar may need 220 bar to start it.

The overall efficiency is the [[?product]] $\\eta_t = \\eta_v\\,\\eta_{hm}$, and whatever is lost becomes heat in the oil.

| Motor type | Continuous pressure | Speed range | Overall efficiency | Starting torque, % of theoretical |
|---|---|---|---|---|
| [[gear-motors-hyd|External gear]] | 160–250 bar | 500–4000 rpm | 75–88 % | 70–85 % |
| [[vane-motors-hyd|Vane]] | 100–210 bar | 50–3000 rpm | 75–88 % | 75–90 % |
| [[axial-piston-motors|Axial piston]] | 280–420 bar | 20–6000 rpm | 88–95 % | 85–95 % |
| [[radial-piston-motors|Radial piston]] | 250–350 bar | 0.5–300 rpm | 90–95 % | 90–95 % |
| [[orbital-motors|Orbital]] | 100–200 bar | 10–800 rpm | 70–85 % | 75–90 % |

*Typical ranges; each series has its own limits.*

### Small motor, big system
Hydraulic power is $P = \\Delta p\\,Q$: **kW = bar × L/min / 600**. At 250 bar a 100 cm³/rev piston motor gives about 360 N·m and weighs a few tens of kilograms; a four-pole induction motor rated for that torque is a 55 kW, frame 250 machine weighing a few hundred. Hence hydraulic winches, wheel drives and slews — but the motor ends a chain of engine or electric motor, pump, tank, valves, filters and cooler (see [[hydraulic-power-unit]]), and every link loses a little.

### The case drain
Piston motors, reversible gear and vane motors and many orbital motors collect their leakage in the casing; a separate **drain line** takes it straight to the tank. Case pressure is usually limited to 1–3 bar on piston motors; a drain teed into a busy return line, or blocked, blows the shaft seal. Fill the case with clean oil before the first start.

In the simulation, raise the load and watch the pressure climb while the speed barely moves; lower the flow to a few litres a minute and watch the volumetric efficiency collapse; stop the motor near the relief setting and try to start it again.

> [!warn] A hydraulic motor is only as safe as the system around it. Before any work, lower or block the load it holds (a winch, a crane slew, a machine on a slope), stop and lock out the pump's drive, release the pressure in every line and discharge the accumulators. Oil escaping from a pinhole at hundreds of bar can be injected through the skin; an injection injury looks small but is a surgical emergency — seek emergency medical care at once. Never feel for a leak with your hand, and beware of hot oil, hot casings and hoses that whip when a fitting fails.

> [!key] Torque comes from pressure times displacement, speed from flow divided by displacement. Leakage steals speed (most at low speed), friction steals torque (most at start), and both end up as heat.
`,
  ideas: [
    'The displacement Vg (cm³/rev) is the volume of oil that passes the motor in one revolution.',
    'Torque is proportional to the pressure difference: T = Vg Δp ηhm / 2π, about 1.59 N·m per cm³/rev per 100 bar.',
    'Speed is proportional to the flow: n = Q ηv / Vg; the load sets the pressure, the pump sets the flow.',
    'Leakage costs a nearly constant flow, so volumetric efficiency is poor at low speed and a motor cannot hold a load still.',
    'Starting torque is lower than running torque because of static friction; check it for loads that start under full torque.'
  ],
  pitfalls: [
    'A higher system pressure makes a hydraulic motor run faster — Pressure makes torque; speed comes only from flow. Raising the relief setting only lets the motor push harder before it stalls.',
    'A closed valve holds a load on a hydraulic motor as firmly as a brake — Oil leaks through the motor\'s clearances, so the load creeps down; a holding brake (or a mechanical lock) is needed.',
    'The inlet pressure gives the torque — Only the pressure difference does: back-pressure in the return line subtracts directly from the torque.'
  ],
  formulas: [
    {
      name: 'Torque of a hydraulic motor',
      expr: 'T = Vg*dp*etahm/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p\\,\\eta_{hm}}{2\\pi}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_g' },
        dp: { name: 'pressure difference, inlet minus outlet', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        etahm: { name: 'hydromechanical efficiency', q: 'ratio', unit: '%', value: 92, tex: '\\eta_{hm}' }
      },
      note: 'Running torque; the starting torque uses the lower starting efficiency.',
      stories: { T: 'A {Vg} motor works across {dp} with a hydromechanical efficiency of {etahm}. What torque does it give?', dp: 'A {Vg} motor ({etahm} hydromechanical efficiency) must deliver {T}. What pressure difference does it need?', Vg: 'A load needs {T}, and {dp} is available across the motor ({etahm}). What displacement is needed?' }
    },
    {
      name: 'Speed of a hydraulic motor',
      expr: 'n = Q*etav/Vg', tex: 'n = \\dfrac{Q\\,\\eta_v}{V_g}',
      vars: {
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm' },
        Q: { name: 'flow into the motor', q: 'flowrate', unit: 'L/min', value: 60 },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 95, tex: '\\eta_v' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_g' }
      },
      stories: { n: 'A {Vg} motor receives {Q} and has a volumetric efficiency of {etav}. How fast does it turn?', Q: 'A {Vg} motor ({etav} volumetric efficiency) must turn at {n}. What flow must the pump deliver?' }
    },
    {
      name: 'Output power from the hydraulic power',
      expr: 'P = dp*Q*eta', tex: 'P = \\Delta p\\,Q\\,\\eta_t',
      vars: {
        P: { name: 'mechanical output power', q: 'power', unit: 'kW' },
        dp: { name: 'pressure difference', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        Q: { name: 'flow into the motor', q: 'flowrate', unit: 'L/min', value: 60 },
        eta: { name: 'overall efficiency (ηv ηhm)', q: 'ratio', unit: '%', value: 87.4, tex: '\\eta_t' }
      },
      note: 'Δp·Q is the hydraulic power: kW = bar × L/min / 600.',
      stories: { P: 'A motor takes {Q} across {dp} with an overall efficiency of {eta}. What power does its shaft deliver?' }
    },
    {
      name: 'Mechanical power at the shaft',
      expr: 'P = 2*pi*n*T', tex: 'P = 2\\pi\\,n\\,T',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 570 },
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m', value: 293 }
      },
      stories: { P: 'A hydraulic motor gives {T} at {n}. What power is that?', T: 'A winch needs {P} at a motor speed of {n}. What torque must the motor give?' }
    }
  ],
  examples: [
    {
      title: 'A piston motor at its rated point',
      q: 'A 100 cm³/rev motor receives 60 L/min at a pressure difference of 200 bar. Its volumetric efficiency is 95 % and its hydromechanical efficiency 92 %. Find the torque, speed, output power and the heat it makes.',
      steps: [
        'Torque: $T = 100\\times10^{-6} \\times 200\\times10^{5} \\times 0.92/(2\\pi) = 293$ N·m.',
        'Speed: $n = 60\\,000 \\times 0.95/100 = 570$ rpm.',
        'Hydraulic input $200 \\times 60/600 = 20$ kW; output $2\\pi \\times (570/60) \\times 293 = 17.5$ kW.',
        'The difference, 2.5 kW, heats the oil — the overall efficiency is $0.95 \\times 0.92 = 87.4$ %.'
      ],
      a: '293 N·m at 570 rpm, 17.5 kW out of 20 kW in, 2.5 kW of heat.'
    },
    {
      title: 'What pressure does a load need?',
      q: 'A conveyor drum needs 500 N·m, driven directly by a 160 cm³/rev motor with a hydromechanical efficiency of 90 %. The return line holds 10 bar of back-pressure. What pressure must reach the motor\'s inlet?',
      steps: [
        '$\\Delta p = 2\\pi T/(V_g\\,\\eta_{hm}) = 2\\pi \\times 500/(160\\times10^{-6} \\times 0.90) = 21.8$ MPa = 218 bar.',
        'The inlet must be 218 bar above the outlet: $218 + 10 = 228$ bar.',
        'Starting may need more: with a starting efficiency of 80 % the breakaway pressure difference is $218 \\times 0.90/0.80 = 245$ bar.'
      ],
      a: 'About 228 bar at the inlet to run, and about 255 bar to start — check the relief setting allows it.'
    },
    {
      title: 'Leakage at low speed',
      q: 'A 100 cm³/rev motor leaks 2 L/min at 200 bar. Compare its speed and volumetric efficiency with 60 L/min and with 5 L/min supplied, both at 200 bar.',
      steps: [
        'At 60 L/min: 58 L/min turns the shaft, $n = 58\\,000/100 = 580$ rpm, $\\eta_v = 58/60 = 96.7$ %.',
        'At 5 L/min: 3 L/min turns the shaft, $n = 30$ rpm, $\\eta_v = 3/5 = 60$ %.',
        'The leakage is the same 2 L/min; at low speed it is a large share of the flow — and it changes with temperature, so low-speed control without feedback drifts.'
      ],
      a: '580 rpm at 96.7 % against 30 rpm at 60 %: leakage dominates at low speed.'
    }
  ],
  quiz: [
    { q: 'The load torque on a hydraulic motor doubles while the pump flow stays the same. To a first approximation…', choices: ['the pressure doubles and the speed stays almost the same', 'the speed halves and the pressure stays the same', 'both double', 'the speed doubles'], a: 0, why: 'Torque is set by Δp and speed by flow. Only the extra leakage at the higher pressure slows it slightly.' },
    { q: 'A 50 cm³/rev motor gets 30 L/min. Ignoring leakage, how fast does it turn?', answer: 600, unit: 'rpm', why: '30 000 cm³/min ÷ 50 cm³/rev = 600 rev/min.' },
    { q: 'A motor runs a load at 180 bar but will not start it again after a stop at the same pressure. Why?', choices: ['Static friction makes the starting torque lower than the running torque', 'The oil is thicker when stopped', 'The flow is zero at a standstill, so there is no torque', 'Leakage is larger at a standstill'], a: 0, why: 'Breakaway (starting) efficiency is lower than running efficiency; check the starting torque in the data sheet.' },
    { q: 'True or false: a hydraulic motor whose ports are blocked by a closed valve holds a hanging load indefinitely.', a: false, why: 'Internal leakage lets the load turn the motor slowly; a spring-applied brake holds it.' },
    { q: 'Which kind of motor is typically the most efficient and the best at very low speed?', choices: ['Radial piston', 'External gear', 'Vane', 'Orbital (gerotor)'], a: 0, why: 'Radial-piston motors reach 90–95 % overall and run smoothly below 1 rpm; gear motors need several hundred rpm.' }
  ],
  problems: [
    { q: 'What torque does a 250 cm³/rev motor give at a pressure difference of 160 bar with a hydromechanical efficiency of 90 %?', answer: 573, unit: 'N·m', tol: 0.01, steps: ['$T = V_g\\,\\Delta p\\,\\eta_{hm}/2\\pi = 250\\times10^{-6} \\times 160\\times10^{5} \\times 0.9/(2\\pi)$', '$= 573$ N·m.'] },
    { q: 'A motor gives 400 N·m at 300 rpm. What hydraulic power must it receive if its overall efficiency is 85 %?', answer: 14.8, unit: 'kW', tol: 0.02, steps: ['Output $P = 2\\pi \\times 5 \\times 400 = 12.57$ kW.', 'Input $= 12.57/0.85 = 14.8$ kW.'] }
  ],
  choose: {
    good: [
      'Large torque in a small, light motor at the load: winches, wheel and track drives, slewing rings, augers, cutter heads.',
      'Machines that already have hydraulic power — mobile equipment, presses, cranes — where one power unit feeds many motors.',
      'Stalling under load without damage: the relief valve limits the torque and the motor simply stops.',
      'Wet, dirty, hot or shock-loaded places where an electric motor would need heavy protection.'
    ],
    avoid: [
      'A single small drive where an electric gearmotor does the job: the pump, tank, hoses and cooler cost more and lose more.',
      'Clean rooms, food and pharmaceutical areas, where an oil leak is unacceptable.',
      'Precise speed or position over changing loads and temperatures without feedback: leakage makes the speed drift.'
    ],
    check: [
      'The torque at your real pressure difference (after line losses and back-pressure) — running and starting.',
      'The speed range, including the minimum smooth speed and the maximum at your flow.',
      'The case-drain arrangement and the allowed case and back-pressure on the shaft seal.',
      'Side and axial loads on the shaft, and how the load is held when stopped (brake).',
      'The heat the losses make, and the power unit that supplies the flow.'
    ]
  },
  applications: [
    'Winches and hoists on cranes and ships, driven by low-speed high-torque motors.',
    'Wheel, track and slew drives on excavators, loaders, harvesters and forestry machines.',
    'Cooling-fan drives on mobile machines: a gear or piston motor whose speed follows the oil temperature.',
    'Try your own numbers in [the hydraulic motor lab](#/tools/motorlab/hydraulic).'
  ],
  history: 'Water under pressure was piped to machines long before oil: Joseph Bramah patented his hydraulic press in 1795, and William Armstrong built water-hydraulic cranes and engines from the 1840s. Oil hydraulics took over in the twentieth century; the variable-displacement axial-piston units of Harvey Williams and Reynold Janney, from the early 1900s, drove naval gun turrets and led to the piston pumps and motors used today.',
  sources: [
    'ISO 1219-1, *Fluid power systems and components — Graphical symbols and circuit diagrams — Part 1: Graphical symbols*.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.',
    'ISO 4413, *Hydraulic fluid power — General rules and safety requirements for systems and their components*.',
    'Esposito, *Fluid Power with Applications* — the chapter on hydraulic motors: displacement, torque, speed and efficiencies.'
  ],
  sim: ['hy-motor-bench']
},

{
  id: 'gear-motors-hyd', parent: 'hydraulic-motor-types', title: 'Gear motors', level: 1,
  short: 'Two meshing gears in a close-fitting housing: pressure on the teeth leaving the mesh turns them, and the oil is carried round the outside in the tooth spaces. Cheap, compact and robust, gear motors suit fans, conveyors and auxiliary drives at 500–4000 rpm up to about 250 bar.',
  keywords: ['gear motor', 'external gear motor', 'hydraulic gear motor', 'side plates', 'pressure-balanced bushings', 'tooth mesh', 'fan drive', 'external drain', 'reversible gear motor', 'module', 'gear width'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:gear-pumps'],
  related: ['vane-motors-hyd', 'orbital-motors', 'hydraulic-motor-sizing', 'hydraulic-heat-noise', 'hydraulics:positive-displacement', 'gearboxes'],
  body: `
An external gear motor is the simplest hydraulic motor: two spur gears in mesh inside a housing that fits their tips and faces within a few hundredths of a millimetre. One gear is keyed to the output shaft; the other idles. Pressure oil enters on one side of the mesh. There it pushes on the flanks of the teeth that are coming *out* of mesh — the area exposed to pressure is larger on the side that turns the gears forwards than on the side that resists — so both gears turn, carrying the oil round the outside in their tooth spaces to the outlet. Between the gears, the teeth in mesh seal the high-pressure side from the low.

### What makes a good one
- **Pressure-loaded side plates** (bushings or wear plates). Pressure oil is led behind the plates at the gear faces, pressing them onto the gears harder as the pressure rises. This keeps the face clearance tiny and the volumetric efficiency high at high pressure — the step that took gear units from about 100 bar to 250 bar.
- **The bearings.** The pressure acts on one side of each gear, so the bearings carry a large radial load proportional to the pressure. Bearing life, and not the gears, often sets the pressure rating.
- **One gear set, several widths.** A series uses the same gears and housing profile in different widths: displacement grows in [[?proportional|proportion]] to the width, so 4, 8, 11, 16 and 22 cm³/rev may share one frame.

### Typical data

| | Small | Large |
|---|---|---|
| Displacement | 1–10 cm³/rev | 20–100 cm³/rev |
| Continuous pressure | 180–250 bar | 160–250 bar |
| Speed | 800–4000 rpm | 500–3000 rpm |
| Torque at 200 bar (η_hm ≈ 85 %) | 3–27 N·m | 55–270 N·m |
| Starting torque | 70–85 % of theoretical | |

The speed range is the weakness. Below roughly 300–500 rpm the leakage across the side plates and tips is a large share of the flow and the torque pulses with every tooth, so the shaft turns unevenly; a gear motor that must crawl is the wrong choice ([[orbital-motors|an orbital]] or [[radial-piston-motors|a radial-piston motor]] is the right one). At the top end, the limits are the bearings and the filling of the tooth spaces.

### Directions and drains
A **unidirectional** motor has its inlet and outlet sized differently and drains its internal leakage into the outlet; its shaft seal then sees the outlet pressure, so the back-pressure is limited (often a few bar to a few tens of bar — check the data). A **reversible** motor has symmetrical ports and an **external drain** from the casing to the tank, because either port may be under pressure. Running a unidirectional motor backwards, or plugging the drain of a reversible one, blows the shaft seal.

### Noise, heat and wear
Each tooth passing the mesh makes a pressure pulse at the **mesh frequency** $z\\,n/60$: 12 teeth at 3000 rpm whine at 600 Hz. Gear motors are among the louder motors, but they are tolerant of moderate contamination and of abuse, and they are the cheapest per kilowatt. When they wear, the side plates and housing score, leakage rises, and the motor slows under load and heats the oil — a gear motor that is slow only when hot is usually worn.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Slows under load, worse when hot | Worn side plates or housing; oil too thin | Check case/leak flow; replace; review oil grade and cooling |
| Shaft seal leaking | Back-pressure too high on an internally drained motor; blocked drain | Lower the back-pressure; fit an external drain |
| Will not start under load | Starting torque below the breakaway need | Raise the pressure or choose a larger motor |
| Loud whine or rattle | Aeration or cavitation in the supply; bearing wear | Check suction side of the pump and oil level; bearings |

In the simulation, watch the tooth spaces carry oil from the red inlet round to the blue outlet, and plot the volumetric efficiency against speed: at low speed and with hot oil it falls away.

> [!tip] Gear motors take little side load. A belt pulley or a chain sprocket on the shaft needs a motor with an outboard (heavy-duty) bearing, or a separate bearing block and a coupling.

> [!key] A gear motor is cheap, compact and robust, happiest at 1000–3000 rpm and up to about 250 bar. It is the wrong motor for slow speeds, quiet rooms and heavy side loads.
`,
  ideas: [
    'Pressure on the flanks of the teeth leaving the mesh turns the gears; oil is carried round the outside in the tooth spaces.',
    'Pressure-loaded side plates seal the gear faces more tightly as the pressure rises, which allows 200–250 bar.',
    'Displacement grows with the gear width, so one series offers many sizes in one frame.',
    'Below about 300–500 rpm leakage and torque ripple make a gear motor run unevenly.',
    'Reversible gear motors need an external case drain; unidirectional ones limit the back-pressure on the outlet.'
  ],
  pitfalls: [
    'Any gear pump will work as a gear motor — A pump often has a larger inlet, internal drain to the inlet and side plates balanced for one direction; used as a motor or reversed, the shaft seal or the plates fail. Use a unit rated as a motor.',
    'A gear motor can be slowed to a crawl by throttling its flow — Below its minimum speed it turns in jerks and its speed depends on leakage and temperature; choose a low-speed motor instead.'
  ],
  formulas: [
    {
      name: 'Displacement of an external gear motor (approximate)',
      expr: 'Vg = 2*pi*m^2*z*b', tex: 'V_g \\approx 2\\pi\\,m^2 z\\,b',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        m: { name: 'gear module', q: 'length', unit: 'mm', value: 2.5 },
        z: { name: 'number of teeth on each gear', q: 'count', value: 12, int: true },
        b: { name: 'gear width', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'Two equal standard spur gears; the exact value is a few per cent higher.',
      stories: { Vg: 'A gear motor has two gears of module {m} with {z} each, {b} wide. What is its displacement?', b: 'With gears of module {m} and {z}, how wide must the gears be for a displacement of {Vg}?' }
    },
    {
      name: 'Speed with leakage',
      expr: 'n = (Q - QL)/Vg', tex: 'n = \\dfrac{Q - Q_L}{V_g}',
      vars: {
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm' },
        Q: { name: 'flow into the motor', q: 'flowrate', unit: 'L/min', value: 20 },
        QL: { name: 'leakage flow at this pressure and temperature', q: 'flowrate', unit: 'L/min', value: 1.6, tex: 'Q_L' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 16, tex: 'V_g' }
      },
      stories: { n: 'A {Vg} gear motor receives {Q} and leaks {QL}. How fast does it turn?', QL: 'A {Vg} gear motor receives {Q} but turns at only {n}. How much is it leaking?' }
    },
    {
      name: 'Starting (breakaway) torque',
      expr: 'Ts = Vg*dp*etas/(2*pi)', tex: 'T_s = \\dfrac{V_g\\,\\Delta p\\,\\eta_s}{2\\pi}',
      vars: {
        Ts: { name: 'starting torque', q: 'torque', unit: 'N·m', tex: 'T_s' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 16, tex: 'V_g' },
        dp: { name: 'pressure difference', q: 'pressure', unit: 'bar', value: 180, tex: '\\Delta p' },
        etas: { name: 'starting torque efficiency', q: 'ratio', unit: '%', value: 75, tex: '\\eta_s' }
      },
      note: 'The torque available to break a load away from rest; running torque uses the higher ηhm.',
      stories: { Ts: 'A {Vg} gear motor with a starting efficiency of {etas} is fed {dp}. What torque can it start against?', dp: 'A {Vg} motor ({etas} starting efficiency) must break away a load of {Ts}. What pressure difference is needed?' }
    }
  ],
  examples: [
    {
      title: 'A cooling-fan drive',
      q: 'A 16 cm³/rev gear motor drives a cooling fan that needs 30 N·m at 2400 rpm. With η_hm = 85 % and η_v = 92 %, what pressure difference and flow does it need, and how efficient is it?',
      steps: [
        '$\\Delta p = 2\\pi T/(V_g\\,\\eta_{hm}) = 2\\pi \\times 30/(16\\times10^{-6} \\times 0.85) = 13.9$ MPa = 139 bar.',
        '$Q = V_g\\,n/\\eta_v = 16 \\times 2400/0.92 = 41\\,700$ cm³/min = 41.7 L/min.',
        'Output $30 \\times 2\\pi \\times 40 = 7.54$ kW; input $139 \\times 41.7/600 = 9.66$ kW; efficiency 78 %.'
      ],
      a: 'About 139 bar and 42 L/min; 7.5 kW out of 9.7 kW, 78 % efficient — 2 kW heats the oil.'
    },
    {
      title: 'One frame, several sizes',
      q: 'Gears of module 2.5 mm with 12 teeth are made 24 mm and 36 mm wide. What displacements result?',
      steps: [
        '$V_g \\approx 2\\pi m^2 z b = 2\\pi \\times 6.25 \\times 12 \\times 24 = 11\\,300$ mm³ = 11.3 cm³/rev.',
        'At 36 mm: $11.3 \\times 36/24 = 17.0$ cm³/rev.'
      ],
      a: 'About 11 and 17 cm³/rev — displacement in proportion to width.'
    }
  ],
  quiz: [
    { q: 'Where does the oil go on its way through an external gear motor?', choices: ['Round the outside of both gears, in the tooth spaces', 'Through the mesh between the gears', 'Through holes in the gears', 'Along the shaft'], a: 0, why: 'The teeth in mesh seal the inlet from the outlet; the oil travels in the tooth spaces between the tips and the housing.' },
    { q: 'What is the tooth-mesh frequency of a 10-tooth gear motor at 1800 rpm?', answer: 300, unit: 'Hz', why: '$z\\,n/60 = 10 \\times 1800/60 = 300$ Hz.' },
    { q: 'Why do reversible gear motors have an external drain port?', choices: ['Either port can be at high pressure, so leakage must go to tank rather than to the outlet', 'To cool the gears', 'To fill the motor at start-up', 'To measure the speed'], a: 0, why: 'Draining the case to the tank keeps the shaft seal at low pressure whichever way the motor runs.' },
    { q: 'True or false: a gear motor is a good choice to turn a mixer smoothly at 40 rpm without a gearbox.', a: false, why: 'At 40 rpm leakage and torque ripple make a gear motor turn jerkily; an orbital or radial-piston motor suits it.' }
  ],
  problems: [
    { q: 'A 25 cm³/rev gear motor with a starting efficiency of 75 % must break away a 60 N·m load. What pressure difference does it need?', answer: 201, unit: 'bar', tol: 0.02, steps: ['$\\Delta p = 2\\pi T_s/(V_g\\,\\eta_s) = 2\\pi \\times 60/(25\\times10^{-6} \\times 0.75)$', '$= 20.1$ MPa = 201 bar.'] }
  ],
  choose: {
    good: [
      'Fans, conveyors, augers, sweeper brushes, spreaders and pumps turning at 500–3000 rpm.',
      'Low-cost auxiliary drives on mobile machines and simple industrial systems.',
      'Oil that is not perfectly clean: gear motors tolerate moderate contamination.'
    ],
    avoid: [
      'Speeds below about 300–500 rpm, or smooth creeping motion.',
      'Heavy side loads on the shaft (belts, chains) without an outboard bearing.',
      'Quiet places: the mesh whine and pressure pulses carry into the structure.'
    ],
    check: [
      'One direction or two, and the drain arrangement that goes with it.',
      'The maximum back-pressure on the outlet and the shaft seal.',
      'Starting torque against the breakaway load.',
      'Minimum and maximum speed at your flow and temperature.'
    ]
  },
  applications: [
    'Hydraulically driven radiator and oil-cooler fans on tractors, buses and construction machines.',
    'Salt and grit spreader discs, sweeper brushes, conveyor and auger drives.',
    'Log splitters and small industrial drives where cost and robustness matter more than efficiency.'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — gear pumps and motors: construction, displacement and efficiencies.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.',
    'ISO 3019-2, *Hydraulic fluid power — Dimensions and identification code for mounting flanges and shaft ends of displacement pumps and motors — Part 2: Metric series*.'
  ],
  sim: { id: 'hy-gear-vane', params: { type: 'gear' } }
},

{
  id: 'vane-motors-hyd', parent: 'hydraulic-motor-types', title: 'Vane motors', level: 2,
  short: 'A slotted rotor carries vanes that slide out against an oval cam ring; pressure on the vanes\' exposed faces turns the rotor. Balanced vane motors are quiet and smooth, run from about 50 to 3000 rpm at up to about 210 bar, but need springs or pressure to hold the vanes out at start-up.',
  keywords: ['vane motor', 'balanced vane', 'cam ring', 'vane springs', 'rocker springs', 'pressure-loaded vanes', 'rotor', 'quiet hydraulic motor', 'high-torque vane motor'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:vane-pumps'],
  related: ['gear-motors-hyd', 'orbital-motors', 'hydraulic-fluids-filtration', 'hydraulic-heat-noise', 'vane-air-motors'],
  body: `
A vane motor has a slotted rotor on the output shaft, turning inside a cam ring. Flat vanes slide in and out of the slots, their tips riding on the inside of the ring. The ring is not round but oval: on two opposite arcs it lies close to the rotor, on the two arcs between it stands further out. As the rotor turns, each vane slides out where the ring widens and back in where it narrows. Pressure oil enters where the chambers between vanes are growing; there each vane has more of its face exposed on the pressure side than the vane ahead of it, and the difference in force, times its radius, is the torque. The oil is carried round and pushed out where the ring narrows again.

### Balanced by design
Because the oval ring has two inlet zones and two outlet zones facing each other, the pressure forces on the rotor cancel: the bearings carry almost no hydraulic load. That is the **balanced vane motor**, and it is why vane motors are smooth, quiet and long-lived at moderate pressure. The torque ripple is small — ten or twelve vanes pass the ports every revolution — and the rotor is light, so the motor responds quickly.

### Holding the vanes out
A vane pump flings its vanes out by centrifugal force. A motor must make torque at zero speed, so its vanes must touch the ring *before* it turns. Motors hold them out with **springs** — coil springs under the vanes or rocker-arm springs spanning pairs of vanes — and, once running, with **pressure behind the vanes**, fed from whichever port is higher through an internal shuttle or check valves. A motor whose springs have broken, or a pump used as a motor, will not start: the oil simply short-circuits past the retracted vanes. The simulation shows this — untick the vane springs and try to start.

### Typical data

| | Small | Large |
|---|---|---|
| Displacement | 5–40 cm³/rev | 50–300 cm³/rev |
| Continuous pressure | 140–210 bar | 140–210 bar |
| Speed | 100–3000 rpm | 50–2000 rpm |
| Torque at 140 bar (η_hm ≈ 88 %) | 10–80 N·m | 100–590 N·m |
| Overall efficiency | 75–88 % | 80–88 % |

Multi-lobe, low-speed vane motors also exist — a cam ring with more than two lobes gives more displacement in the same diameter and a smooth low speed — but for high torque at low speed most machines use [[radial-piston-motors|radial-piston]] or [[orbital-motors|orbital motors]].

### In service
Vane tips slide on the ring all the time, so vane motors dislike dirt and thin oil: a scratch in the ring or a sticking vane costs efficiency quickly. Keep the oil to the cleanliness the maker asks for — typically ISO 4406 class 18/16/13 or better (see [[hydraulic-fluids-filtration]]) — and within its viscosity window. Worn vane motors lose speed under load and, with vanes sticking in dirty slots, knock or fail to start. Their strengths are quiet running, a steady speed and low cost for their smoothness; their weak points are pressure (rarely above 210 bar) and contamination.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Will not start, or starts only when turned by hand | Broken vane springs; vanes stuck in dirty slots | Replace springs; flush; improve filtration |
| Speed drops as the oil warms | Worn ring and vane tips; oil too thin | Check leakage; choose a higher viscosity grade or cool the oil |
| Knocking at low speed | Vanes chattering; air in the oil | Bleed air; check vane springs and back-pressure |

> [!tip] Where a machine must run quietly near people — a machine-tool feed, a laboratory mixer, a conveyor in a packing hall — a balanced vane motor is often quieter than a gear motor of the same size, at a similar price to an orbital motor.

> [!key] A vane motor is a balanced, quiet, smooth motor for moderate pressures, as long as its vanes are held out at start and its oil is kept clean.
`,
  ideas: [
    'Vanes slide in slots of a rotor and ride on an oval cam ring; the force on their exposed faces makes the torque.',
    'Two opposite inlet and outlet zones balance the pressure forces, so the bearings carry little load and the motor runs quietly.',
    'A motor must make torque at zero speed, so springs and then pressure hold the vanes against the ring.',
    'Vane motors suit 50–3000 rpm and up to about 210 bar, and need clean oil.'
  ],
  pitfalls: [
    'A vane pump can be used as a vane motor — A pump relies on centrifugal force to throw its vanes out; at a standstill they stay in, so it cannot start under load. Motors have vane springs and pressure-loaded vanes.',
    'Balanced means the motor has no torque ripple — Balanced refers to the radial forces on the rotor; the torque still pulses slightly with each vane, though much less than in a gear motor.'
  ],
  formulas: [
    {
      name: 'Displacement of a balanced vane motor',
      expr: 'Vg = 2*pi*b*(R^2 - r^2)', tex: 'V_g \\approx 2\\pi\\,b\\,(R^2 - r^2)',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        b: { name: 'rotor and vane width', q: 'length', unit: 'mm', value: 25 },
        R: { name: 'cam-ring major radius', q: 'length', unit: 'mm', value: 40 },
        r: { name: 'cam-ring minor radius', q: 'length', unit: 'mm', value: 35 }
      },
      note: 'Two strokes per revolution; the thickness of the vanes takes a few per cent off.',
      stories: { Vg: 'A balanced vane motor has a cam ring of radii {R} and {r} and a width of {b}. What is its displacement?', b: 'With ring radii {R} and {r}, how wide must the rotor be for {Vg}?' }
    },
    {
      name: 'Force on one vane',
      expr: 'F = dp*b*h', tex: 'F = \\Delta p\\,b\\,h',
      vars: {
        F: { name: 'force on the vane', q: 'force', unit: 'N' },
        dp: { name: 'pressure difference across the vane', q: 'pressure', unit: 'bar', value: 140, tex: '\\Delta p' },
        b: { name: 'vane width', q: 'length', unit: 'mm', value: 25 },
        h: { name: 'vane extension beyond the rotor', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'The force that bends the vane in its slot and, times its radius, turns the rotor.',
      stories: { F: 'A vane {b} wide stands {h} out of the rotor with {dp} across it. What force acts on it?' }
    },
    {
      name: 'Overall efficiency from its two parts',
      expr: 'eta = etav*etahm', tex: '\\eta_t = \\eta_v\\,\\eta_{hm}',
      vars: {
        eta: { name: 'overall efficiency', q: 'ratio', unit: '%', tex: '\\eta_t' },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 94, tex: '\\eta_v' },
        etahm: { name: 'hydromechanical efficiency', q: 'ratio', unit: '%', value: 88, tex: '\\eta_{hm}' }
      },
      stories: { eta: 'A vane motor has a volumetric efficiency of {etav} and a hydromechanical efficiency of {etahm}. What is its overall efficiency?' }
    }
  ],
  examples: [
    {
      title: 'From the ring to the torque',
      q: 'A balanced vane motor has ring radii of 40 and 35 mm and a width of 25 mm. What is its displacement, and what torque does it give at 140 bar with η_hm = 88 %?',
      steps: [
        '$V_g \\approx 2\\pi \\times 25 \\times (40^2 - 35^2) = 2\\pi \\times 25 \\times 375 = 58\\,900$ mm³ = 58.9 cm³/rev.',
        '$T = 58.9\\times10^{-6} \\times 140\\times10^{5} \\times 0.88/(2\\pi) = 115$ N·m.'
      ],
      a: 'About 59 cm³/rev and 115 N·m.'
    },
    {
      title: 'A quiet conveyor drive',
      q: 'A conveyor needs 90 N·m at 400 rpm. A 60 cm³/rev vane motor has η_hm = 88 % and η_v = 92 % at this point. What pressure difference and flow does it need?',
      steps: [
        '$\\Delta p = 2\\pi \\times 90/(60\\times10^{-6} \\times 0.88) = 10.7$ MPa = 107 bar — well within a vane motor\'s rating.',
        '$Q = 60 \\times 400/0.92 = 26\\,100$ cm³/min = 26.1 L/min.',
        'Hydraulic power $107 \\times 26.1/600 = 4.65$ kW for $90 \\times 2\\pi \\times 400/60 = 3.77$ kW at the shaft (81 %).'
      ],
      a: 'About 107 bar and 26 L/min; 3.8 kW at the shaft.'
    }
  ],
  quiz: [
    { q: 'Why does a hydraulic vane motor need springs under its vanes?', choices: ['At a standstill there is no centrifugal force to push the vanes against the ring', 'To reduce noise at high speed', 'To stop the vanes rotating in their slots', 'To drain the case'], a: 0, why: 'Without contact at the ring the oil bypasses the vanes and no torque is made at start.' },
    { q: 'What does "balanced" mean in a balanced vane motor?', choices: ['Two opposite pressure zones cancel the radial force on the rotor', 'The rotor is dynamically balanced', 'The inlet and outlet pressures are equal', 'The vanes are all the same length'], a: 0, why: 'The oval ring has two inlet and two outlet zones facing each other, so the hydraulic side forces cancel.' },
    { q: 'True or false: vane motors typically work at higher pressures than axial-piston motors.', a: false, why: 'Vane motors are usually rated to about 140–210 bar; axial-piston motors to 350–420 bar.' },
    { q: 'A vane motor has η_v = 90 % and η_hm = 85 %. What is its overall efficiency?', answer: 76.5, unit: '%', why: 'η = η_v η_hm = 0.90 × 0.85 = 0.765.' }
  ],
  problems: [
    { q: 'A vane 30 mm wide stands 6 mm out of its rotor with 160 bar across it. What force acts on it?', answer: 2880, unit: 'N', tol: 0.01, steps: ['$F = \\Delta p\\,b\\,h = 160\\times10^{5} \\times 0.030 \\times 0.006$', '$= 2880$ N.'] }
  ],
  choose: {
    good: [
      'Smooth, quiet drives at moderate pressure: conveyors, mixers, machine-tool and packaging drives.',
      'Speeds from about 50 to 3000 rpm with low torque ripple and quick response.',
      'Systems with good filtration and a steady oil temperature.'
    ],
    avoid: [
      'Pressures above about 210 bar.',
      'Dirty oil or poor filtration: vane tips and ring wear quickly.',
      'Very high torque at very low speed — use a radial-piston or orbital motor.'
    ],
    check: [
      'That the unit is built as a motor (vane springs, pressure-loaded vanes).',
      'The starting torque and minimum speed at your pressure.',
      'The viscosity window and cleanliness class in the data sheet.',
      'Drain and back-pressure limits in both directions.'
    ]
  },
  applications: [
    'Conveyor, mixer and agitator drives in industry.',
    'Machine-tool, packaging and printing-machine drives where quiet running matters.',
    'Marine and mobile auxiliary drives at moderate pressure.'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — vane pumps and motors, balanced designs and displacement.',
    'ISO 4406, *Hydraulic fluid power — Fluids — Method for coding the level of contamination by solid particles*.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.'
  ],
  sim: { id: 'hy-gear-vane', params: { type: 'vane' } }
},

{
  id: 'axial-piston-motors', parent: 'hydraulic-motor-types', title: 'Axial-piston motors', level: 2,
  short: 'Pistons in a rotating cylinder block, parallel to the shaft, pushed out by pressure against an inclined swash plate — or in a block tilted to the shaft (bent axis). The most efficient high-speed hydraulic motors: 350–420 bar, up to several thousand rpm, and variable displacement for hydrostatic drives.',
  keywords: ['axial piston motor', 'swash plate', 'bent axis', 'variable displacement motor', 'fixed displacement motor', 'cylinder block', 'valve plate', 'slippers', 'swivel angle', 'minimum displacement', 'high-pressure override', 'case drain'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:piston-pumps', 'hydraulics:variable-displacement'],
  related: ['radial-piston-motors', 'hydrostatic-transmissions', 'hydraulic-motor-sizing', 'hydraulic-fluids-filtration', 'hydraulics:hydrostatic-transmission'],
  body: `
In an axial-piston motor a ring of pistons — usually seven or nine — sits in bores in a **cylinder block** that turns with the shaft, the bores parallel to it. At one end the block runs against a stationary **valve plate** with two kidney-shaped ports: one connects the bores on one side to the inlet, the other the bores on the other side to the outlet. At the other end the pistons press on an **inclined** surface. Pressure pushes the pistons on the inlet side outwards against the incline, and a force pushing on an inclined surface has a sideways part: that part, at the radius of the pistons, is the torque. On the outlet side the incline pushes the pistons back in and they expel their oil.

### Swash plate and bent axis
- **Swash-plate motors** keep the shaft and the cylinder block in line; the pistons end in slippers that glide on a tilted plate. The stroke of each piston is $D\\tan\\alpha$ (the [[?sine-cosine|tangent]] of the swash angle $\\alpha$), so $V_g = z\\,A_k\\,D\\tan\\alpha$. The angle is limited to about 15–20° by the side force on the pistons. Compact, with room for a through-shaft — common in hydrostatic drives.
- **Bent-axis motors** tilt the whole cylinder block to the shaft, by up to 40–45°; the pistons are linked to a drive flange on the shaft by ball-jointed rods. The stroke is $D\\sin\\alpha$. The pistons carry almost no side force, so bent-axis motors have the best starting torque and efficiency and the widest displacement range, at the price of a longer, bulkier housing.

### Fixed and variable
A **variable** motor can change its angle while running — by a small hydraulic servo piston, with a two-position, proportional-electric or pressure-dependent control. Less displacement means *more speed and less torque* from the same flow and pressure, at the same power: the motor becomes a gearbox with no steps. A travel drive starts at full displacement for traction and swivels back for road speed. A *pressure-dependent* control swivels the motor back out automatically when the pressure rises on a slope — more torque without the driver doing anything. The minimum displacement is limited (often a fifth to a third of the maximum on swash-plate motors; some bent-axis motors reach zero), and the **maximum speed at minimum displacement** is a hard limit: a variable motor swivelled back on too much flow over-speeds.

### Typical data

| | Small (10–30 cm³/rev) | Large (100–250 cm³/rev) |
|---|---|---|
| Continuous / peak pressure | 350–400 / 420–450 bar | 350–400 / 420–450 bar |
| Maximum speed | 5000–8000 rpm | 2500–4000 rpm |
| Minimum smooth speed | 20–50 rpm (bent axis less) | a few tens of rpm |
| Torque at 350 bar (η_hm ≈ 93 %) | 50–155 N·m | 520–1300 N·m |
| Overall efficiency | 88–94 % | 90–95 % |

### In service
Piston motors are precise machines: they want clean oil (typically ISO 4406 class 18/16/13, better for long life), a viscosity in their window (commonly 16–36 mm²/s for best efficiency), a **case drain** straight to the tank at low pressure, and a case filled with oil before start-up. The pistons pass the ports $z\\,n/60$ times a second, and odd numbers of pistons (7, 9) keep the flow ripple small. Worn slippers or a scored valve plate show up as high case-drain flow — measuring it (a bucket and a stopwatch, or a flow meter) is the classic health check.

In the simulation, move the swash angle and watch the pistons' stroke shrink while the shaft speeds up; switch to the bent-axis design.

> [!warn] Never let a variable motor swivel to its minimum displacement with full flow and no load: it can over-speed and destroy itself. Speed limits at minimum displacement are part of the data sheet — and of the control design.

> [!key] Axial-piston motors are the high-pressure, high-efficiency, high-speed motors; the variable ones trade torque for speed at constant power, which is the heart of every hydrostatic travel drive.
`,
  ideas: [
    'Pressure pushes pistons against an inclined plate; the sideways component of the force makes the torque.',
    'Swash-plate motors: displacement ∝ tan α, angles up to about 18°; bent-axis motors: ∝ sin α, angles up to about 45°.',
    'Reducing the displacement of a variable motor raises its speed and lowers its torque at the same power.',
    'Axial-piston motors reach 350–420 bar and 90–95 % efficiency but need clean oil and a free case drain.',
    'The maximum speed at minimum displacement is a hard limit.'
  ],
  pitfalls: [
    'Reducing a variable motor\'s displacement makes it weaker at every speed — It gives less torque but more speed from the same flow: the power stays the same. Displacement is a ratio, like a gearbox.',
    'The case drain can be teed into the main return line — Pressure peaks in the return line reach the case and blow the shaft seal; the drain goes separately to the tank, below the oil level.'
  ],
  formulas: [
    {
      name: 'Displacement of a swash-plate motor',
      expr: 'Vg = z*pi*d^2/4*D*tan(alpha)', tex: 'V_g = z\\,\\frac{\\pi d^2}{4}\\,D\\tan\\alpha',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        z: { name: 'number of pistons', q: 'count', value: 9, int: true },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 16 },
        D: { name: 'pitch-circle diameter of the bores', q: 'length', unit: 'mm', value: 60 },
        alpha: { name: 'swash-plate angle', q: 'angle', unit: '°', value: 18, min: 0, max: 25, tex: '\\alpha' }
      },
      stories: { Vg: 'A swash-plate motor has {z} pistons of {d} on a {D} pitch circle, with the plate at {alpha}. What is its displacement?', alpha: 'At what swash angle does this motor ({z} pistons, {d}, pitch circle {D}) displace {Vg}?' }
    },
    {
      name: 'Displacement of a bent-axis motor',
      expr: 'Vg = z*pi*d^2/4*D*sin(alpha)', tex: 'V_g = z\\,\\frac{\\pi d^2}{4}\\,D\\sin\\alpha',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        z: { name: 'number of pistons', q: 'count', value: 7, int: true },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 20 },
        D: { name: 'pitch-circle diameter at the drive flange', q: 'length', unit: 'mm', value: 70 },
        alpha: { name: 'angle between block and shaft', q: 'angle', unit: '°', value: 40, min: 0, max: 45, tex: '\\alpha' }
      },
      stories: { Vg: 'A bent-axis motor has {z} pistons of {d} on a {D} pitch circle at {alpha}. What is its displacement?' }
    },
    {
      name: 'Speed of a variable motor',
      expr: 'n = Q*etav/(x*Vgmax)', tex: 'n = \\dfrac{Q\\,\\eta_v}{x\\,V_{g,\\max}}',
      vars: {
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm' },
        Q: { name: 'flow into the motor', q: 'flowrate', unit: 'L/min', value: 100 },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 96, tex: '\\eta_v' },
        x: { name: 'displacement setting, fraction of maximum', q: 'ratio', unit: '%', value: 40 },
        Vgmax: { name: 'maximum displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_{g,\\max}' }
      },
      stories: { n: 'A {Vgmax} variable motor set to {x} of its displacement receives {Q}. How fast does it turn?', x: 'To what fraction of its {Vgmax} must a variable motor swivel back to turn at {n} on {Q}?' }
    },
    {
      name: 'Torque of a variable motor',
      expr: 'T = x*Vgmax*dp*etahm/(2*pi)', tex: 'T = \\dfrac{x\\,V_{g,\\max}\\,\\Delta p\\,\\eta_{hm}}{2\\pi}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        x: { name: 'displacement setting, fraction of maximum', q: 'ratio', unit: '%', value: 40 },
        Vgmax: { name: 'maximum displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_{g,\\max}' },
        dp: { name: 'pressure difference', q: 'pressure', unit: 'bar', value: 300, tex: '\\Delta p' },
        etahm: { name: 'hydromechanical efficiency', q: 'ratio', unit: '%', value: 93, tex: '\\eta_{hm}' }
      },
      stories: { T: 'A {Vgmax} variable motor set to {x} works at {dp} ({etahm}). What torque does it give?' }
    }
  ],
  examples: [
    {
      title: 'Displacement from the geometry',
      q: 'A swash-plate motor has nine 16 mm pistons on a 60 mm pitch circle and a plate angle of 18°. Find its displacement.',
      steps: [
        'Piston area $\\pi \\times 16^2/4 = 201$ mm²; stroke $60 \\tan 18° = 19.5$ mm.',
        '$V_g = 9 \\times 201 \\times 19.5 = 35\\,300$ mm³ = 35.3 cm³/rev.'
      ],
      a: 'About 35 cm³/rev.'
    },
    {
      title: 'A two-range travel motor',
      q: 'A 100 cm³/rev variable motor receives 100 L/min at 300 bar (η_v = 96 %, η_hm = 93 %). Compare full displacement with 40 %.',
      steps: [
        'Full: $n = 100\\,000 \\times 0.96/100 = 960$ rpm; $T = 100\\times10^{-6} \\times 300\\times10^{5} \\times 0.93/(2\\pi) = 444$ N·m.',
        '40 %: $n = 960/0.4 = 2400$ rpm; $T = 0.4 \\times 444 = 178$ N·m.',
        'Power in both cases: $444 \\times 2\\pi \\times 16 = 44.6$ kW $= 178 \\times 2\\pi \\times 40$.'
      ],
      a: '960 rpm and 444 N·m, or 2400 rpm and 178 N·m — the same 44.6 kW.'
    }
  ],
  quiz: [
    { q: 'A variable motor on constant flow and pressure is swivelled from 100 % to 50 % displacement. Its speed and torque…', choices: ['speed doubles, torque halves', 'both halve', 'speed halves, torque doubles', 'both stay the same'], a: 0, why: 'n = Qη_v/V_g and T ∝ V_g Δp: half the displacement, twice the speed, half the torque, same power.' },
    { q: 'Why can bent-axis motors use much larger angles than swash-plate motors?', choices: ['Their pistons are driven by rods from a flange and carry little side force', 'They have more pistons', 'Their valve plate is larger', 'They run at lower pressure'], a: 0, why: 'In a swash-plate motor the side force on each piston grows with tan α and limits the angle to about 18°; bent-axis rods take the force along their length.' },
    { q: 'Where should the case drain of a piston motor go?', choices: ['Directly to the tank, below the oil level', 'Into the main return line after the filter', 'Into the motor outlet', 'Into the pump inlet'], a: 0, why: 'The case must stay near tank pressure; return-line pressure peaks would blow the shaft seal.' },
    { q: 'True or false: displacement of a swash-plate motor is proportional to the swash angle itself.', a: false, why: 'It is proportional to tan α — nearly the same at small angles, but not exactly.' }
  ],
  problems: [
    { q: 'A bent-axis motor has seven 20 mm pistons on a 70 mm pitch circle at 40°. What is its displacement?', answer: 99, unit: 'cm³/rev', tol: 0.02, steps: ['Piston area $\\pi \\times 20^2/4 = 314$ mm²; stroke $70 \\sin 40° = 45.0$ mm.', '$V_g = 7 \\times 314 \\times 45.0 = 98\\,900$ mm³ ≈ 99 cm³/rev.'] },
    { q: 'A 160 cm³/rev motor set to 30 % displacement receives 150 L/min (η_v = 95 %). How fast does it turn?', answer: 2969, unit: 'rpm', tol: 0.01, steps: ['$n = Q\\,\\eta_v/(x V_{g,\\max}) = 150\\,000 \\times 0.95/(0.30 \\times 160)$', '$= 2969$ rpm — check the maximum speed at that displacement.'] }
  ],
  choose: {
    good: [
      'High pressure and high efficiency at medium to high speed: travel drives, winches through a gearbox, fan and cutter drives.',
      'Hydrostatic transmissions, where a variable motor gives a wide speed range at constant power.',
      'Compact, powerful drives where every kilogram counts (mobile machines).'
    ],
    avoid: [
      'Dirty oil and poor filtration: slippers, pistons and the valve plate wear.',
      'Very low speeds without a gearbox — a radial-piston motor is simpler.',
      'The lowest-cost auxiliary drives, where a gear motor does the job.'
    ],
    check: [
      'Maximum speed at the displacement you will use (especially minimum displacement).',
      'The control type of a variable motor and its response.',
      'Case-drain pressure limit, flushing and cooling of the case at high power.',
      'Cleanliness and viscosity requirements, and the shaft and flange standard.'
    ]
  },
  applications: [
    'Travel drives of excavators, wheel loaders and agricultural machines (with planetary gearboxes).',
    'Winch and slew drives through planetary gears on cranes and ships.',
    'Variable motors in hydrostatic transmissions and secondary-controlled drives.'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — piston pumps and motors, swash-plate and bent-axis designs.',
    'Merritt, *Hydraulic Control Systems* — pumps and motors, leakage and variable-displacement control.',
    'ISO 4406, *Hydraulic fluid power — Fluids — Method for coding the level of contamination by solid particles*.',
    'ISO 3019-2, *Hydraulic fluid power — Dimensions and identification code for mounting flanges and shaft ends of displacement pumps and motors — Part 2: Metric series*.'
  ],
  sim: ['hy-axial-piston']
},

{
  id: 'radial-piston-motors', parent: 'hydraulic-motor-types', title: 'Radial-piston motors', level: 2,
  short: 'Pistons arranged like the spokes of a wheel push on an eccentric crank or on a cam ring with many lobes. They are the low-speed, high-torque motors: large displacements (0.1 to 30 L/rev and more), smooth running below 1 rpm, 90–95 % efficiency and torques from 1 to hundreds of kN·m without a gearbox.',
  keywords: ['radial piston motor', 'LSHT', 'low speed high torque', 'cam lobe motor', 'multi-stroke', 'crankshaft motor', 'eccentric', 'wheel motor', 'freewheeling', 'two-speed motor', 'boost pressure', 'direct drive'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:lsht-motors', 'hydraulics:piston-pumps'],
  related: ['orbital-motors', 'axial-piston-motors', 'hydraulic-motor-sizing', 'counterbalance-brake-valves', 'torque-motors', 'motors-conveyors-hoists'],
  body: `
A radial-piston motor arranges its pistons like the spokes of a wheel, at right angles to the shaft. Two families dominate.

- **Crankshaft (eccentric) motors.** Five or seven pistons in fixed cylinders around a central eccentric push on it in turn, like the cylinders of a radial aero engine. Each piston makes **one stroke per revolution**. A rotary distributor on the shaft sends the pressure oil to the pistons on the working side.
- **Cam-lobe (multi-stroke) motors.** The pistons sit in a cylinder block and carry rollers that run on a **cam ring with many lobes** — six, eight, ten or more. Every piston makes one stroke per lobe, so a ten-piston, eight-lobe motor gets eighty strokes per revolution. That gives a huge displacement in a compact diameter. Either the block turns (shaft motors) or the housing turns round a fixed block — the **wheel motor** that carries a wheel hub or a winch drum directly.

### Why they are special
With many pistons and strokes, the displacement per revolution is large, so the torque is large and the speed low for a modest flow. A 2 L/rev motor gives about 7.5 kN·m at 250 bar; at 30 rpm it takes about 62 L/min and delivers 23.5 kW. The pistons are well supported and the forces pass through rollers or shoes, so friction is low: overall efficiencies of **90–95 %** and starting torques of **90–95 %** of theoretical — far better than an orbital motor. And because the torque comes from many overlapping strokes, the shaft turns evenly **below 1 rpm**. Driving a drum, a shredder rotor or a wheel directly removes the gearbox, its backlash, its oil and its failures.

### Typical data

| | Crankshaft type | Cam-lobe type |
|---|---|---|
| Displacement | 0.1–10 L/rev | 0.2–30 L/rev and more |
| Continuous / peak pressure | 250–300 / 350 bar | 250–350 / 400–450 bar |
| Speed | 1–600 rpm (small ones faster) | 0.5–300 rpm |
| Torque at 250 bar | 0.4–37 kN·m | 0.75–110 kN·m and more |
| Overall efficiency | 88–94 % | 90–95 % |

### Features worth knowing
- **Two speeds.** Switching half the pistons (or half the lobes) to idle halves the displacement: twice the speed at half the torque, useful for travel or for fast hook speed with light loads.
- **Freewheeling.** Connecting both ports to the tank and pressurising the case slightly pushes the pistons in, off the cam, so a machine can be towed or a winch paid out freely.
- **Minimum back-pressure.** On cam-lobe motors the rollers must stay on the cam when they pass the outlet side; at speed the outlet needs a *boost pressure* that rises with speed (the data sheet gives it). Without it, rollers lift and hammer the cam.
- **Brakes and bearings.** Many have a built-in spring-applied, pressure-released multi-disc brake and bearings that take the wheel or drum loads.

The simulation shows a cam-lobe motor and a crankshaft motor from the front: the pistons on the working flanks are red. Compare how evenly each turns — the graph is the torque over one revolution.

> [!warn] A radial-piston motor on a winch or a wheel may hold tens of kilonewton-metres. The load must be lowered or blocked, the brake applied and the lines depressurised before any fitting is loosened; the case can hold pressure too.

> [!key] For very high torque at very low speed — a winch drum, a shredder, a wheel — a radial-piston motor does directly, smoothly and efficiently what would otherwise need a high-speed motor and a large gearbox.
`,
  ideas: [
    'Radial pistons push on an eccentric (one stroke per revolution) or on a many-lobed cam ring (one stroke per lobe).',
    'Many strokes per revolution give a large displacement, hence large torque and low speed from a modest flow.',
    'Efficiency and starting torque reach 90–95 %, and the shaft turns smoothly below 1 rpm.',
    'Two-speed switching, freewheeling and built-in brakes are common; cam-lobe motors need a minimum back-pressure at speed.'
  ],
  pitfalls: [
    'Low speed means low power, so a radial-piston motor is a small machine — Power is torque times speed: 40 kN·m at 20 rpm is 84 kW, and the pump, cooler and piping must match it.',
    'The outlet of a cam-lobe motor can be vented to the tank at any speed — At speed the rollers need a minimum back-pressure to stay on the cam; follow the boost-pressure curve in the data sheet.'
  ],
  formulas: [
    {
      name: 'Displacement of a multi-stroke radial-piston motor',
      expr: 'Vg = z*k*pi*d^2/4*h', tex: 'V_g = z\\,k\\,\\frac{\\pi d^2}{4}\\,h',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'L/rev', tex: 'V_g' },
        z: { name: 'number of pistons', q: 'count', value: 10, int: true },
        k: { name: 'strokes per revolution (cam lobes; 1 for a crank)', q: 'count', value: 8, int: true },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 40 },
        h: { name: 'piston stroke', q: 'length', unit: 'mm', value: 20 }
      },
      stories: { Vg: 'A cam-lobe motor has {z} pistons of {d} with a stroke of {h} and a cam of {k} lobes. What is its displacement?', k: 'How many cam lobes give {Vg} with {z} pistons of {d} and a stroke of {h}?' }
    },
    {
      name: 'Torque of a large motor',
      expr: 'T = Vg*dp*etahm/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p\\,\\eta_{hm}}{2\\pi}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'kN·m' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'L/rev', value: 2, tex: 'V_g' },
        dp: { name: 'pressure difference', q: 'pressure', unit: 'bar', value: 250, tex: '\\Delta p' },
        etahm: { name: 'hydromechanical efficiency', q: 'ratio', unit: '%', value: 94, tex: '\\eta_{hm}' }
      },
      stories: { T: 'A {Vg} radial-piston motor works across {dp} at {etahm}. What torque does it give?', Vg: 'A drum needs {T} and {dp} is available ({etahm}). What displacement is needed?' }
    },
    {
      name: 'Power at low speed',
      expr: 'P = 2*pi*n*T', tex: 'P = 2\\pi\\,n\\,T',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 30 },
        T: { name: 'shaft torque', q: 'torque', unit: 'kN·m', value: 7.48 }
      },
      stories: { P: 'A radial-piston motor gives {T} at {n}. What power is that?' }
    }
  ],
  examples: [
    {
      title: 'A shredder drive',
      q: 'A shredder rotor needs 40 kN·m at 20 rpm. With 300 bar available and η_hm = 95 %, η_v = 97 %, what displacement, flow and power are needed?',
      steps: [
        '$V_g = 2\\pi T/(\\Delta p\\,\\eta_{hm}) = 2\\pi \\times 40\\,000/(300\\times10^{5} \\times 0.95) = 8.8\\times10^{-3}$ m³ = 8.8 L/rev.',
        '$Q = V_g\\,n/\\eta_v = 8.8 \\times 20/0.97 = 182$ L/min.',
        'Power at the shaft $2\\pi \\times (20/60) \\times 40\\,000 = 83.8$ kW; hydraulic power $300 \\times 182/600 = 91$ kW.'
      ],
      a: 'About 8.8 L/rev, 182 L/min and 84 kW at the shaft — a large machine, directly driven.'
    },
    {
      title: 'Counting strokes',
      q: 'A cam-lobe motor has 10 pistons of 40 mm diameter and 20 mm stroke on an 8-lobe cam. Find the displacement and the torque at 250 bar (η_hm = 94 %).',
      steps: [
        'Strokes per revolution: $10 \\times 8 = 80$; volume per stroke $\\pi \\times 40^2/4 \\times 20 = 25\\,100$ mm³.',
        '$V_g = 80 \\times 25\\,100 = 2.01\\times10^{6}$ mm³ = 2.01 L/rev.',
        '$T = 2.01\\times10^{-3} \\times 250\\times10^{5} \\times 0.94/(2\\pi) = 7.5$ kN·m.'
      ],
      a: '2.0 L/rev and about 7.5 kN·m.'
    }
  ],
  quiz: [
    { q: 'A cam-lobe motor has 8 pistons and a 6-lobe cam. How many piston strokes occur per revolution?', answer: 48, why: 'Each piston makes one stroke per lobe: 8 × 6 = 48.' },
    { q: 'Why can a radial-piston motor run smoothly at 1 rpm when a gear motor cannot?', choices: ['Its leakage is tiny compared with its large displacement, and many overlapping strokes keep the torque steady', 'It has a gearbox inside', 'It runs at lower pressure', 'Its oil is thicker'], a: 0, why: 'At low speed the leakage of a gear motor is most of the flow; a large-displacement piston motor leaks proportionally little.' },
    { q: 'What does freewheeling a cam-lobe motor involve?', choices: ['Venting both ports and pressurising the case slightly so the pistons retract from the cam', 'Removing the shaft', 'Closing both ports', 'Raising the relief setting'], a: 0, why: 'With the pistons pushed in, the housing or shaft can turn without pumping oil — for towing or free-spooling.' },
    { q: 'True or false: switching a two-speed radial-piston motor to half displacement doubles its torque.', a: false, why: 'Half the displacement gives twice the speed and half the torque at the same flow and pressure.' }
  ],
  problems: [
    { q: 'What torque does a 5 L/rev radial-piston motor give at 280 bar with η_hm = 95 %?', answer: 21.2, unit: 'kN·m', tol: 0.01, steps: ['$T = 5\\times10^{-3} \\times 280\\times10^{5} \\times 0.95/(2\\pi)$', '$= 21\\,170$ N·m ≈ 21.2 kN·m.'] }
  ],
  choose: {
    good: [
      'Very high torque at low speed, directly on the load: winch drums, shredders, mixers, cutter heads, conveyor drums.',
      'Smooth creeping motion below a few rpm, and heavy starting torque.',
      'Wheel and track drives with the motor in the hub (rotating-housing motors).'
    ],
    avoid: [
      'High speeds: most are limited to a few hundred rpm.',
      'Very small torques, where an orbital or gear motor is far cheaper.',
      'Tight budgets for a light-duty drive: radial-piston motors are expensive per unit.'
    ],
    check: [
      'Torque at your working pressure, with the starting torque for heavy starts.',
      'Maximum speed and the required boost (back) pressure at that speed.',
      'Case pressure and flushing limits; shaft or housing loads.',
      'Built-in brake, freewheel and two-speed options you need.'
    ]
  },
  applications: [
    'Anchor, mooring and cable winches on ships; drum drives on cranes.',
    'Shredders, crushers, mixers, conveyor drums and cutter heads of tunnelling machines.',
    'Wheel motors for forestry, construction and agricultural machines.'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — radial-piston and low-speed high-torque motors.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.',
    'ISO 4413, *Hydraulic fluid power — General rules and safety requirements for systems and their components*.'
  ],
  sim: ['hy-radial-piston']
},

{
  id: 'orbital-motors', parent: 'hydraulic-motor-types', title: 'Orbital (gerotor and geroler) motors', level: 2,
  short: 'A star-shaped inner gear with N lobes rolls inside a ring with N + 1, orbiting N times per shaft revolution. The many chamber fillings give a large displacement in a small, cheap motor: the everyday low-speed, high-torque motor of light mobile machines, at 10–800 rpm and 100–200 bar.',
  keywords: ['orbital motor', 'orbit motor', 'gerotor', 'geroler', 'star', 'ring gear', 'cardan shaft', 'dog bone', 'disc valve', 'spool valve', 'LSHT', 'wheel motor', 'auger drive'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:lsht-motors'],
  related: ['radial-piston-motors', 'gear-motors-hyd', 'hydraulic-motor-sizing', 'counterbalance-brake-valves', 'hydraulic-heat-noise'],
  body: `
Inside an orbital motor is a **gerotor** set: a star-shaped inner gear with $N$ lobes (usually six) inside an outer ring with $N+1$ lobes (seven). The star cannot turn about its own centre — it does not fit — so as oil pushes it, it **rolls** round the inside of the ring, its centre tracing a small circle. Each time the centre goes round once, the star turns backwards by only one lobe: $1/N$ of a turn. So the star **orbits $N$ times for every revolution** of the output shaft, which it drives through a double-ended splined shaft (the *cardan* or *dog-bone*) that wobbles with the orbit.

### Why so much displacement from so little
Between the star and the ring are $N+1$ chambers. In each orbit every chamber fills and empties once, and there are $N$ orbits per revolution, so the displacement is $N(N+1)$ chamber fillings: 42 for a 6/7 set. A gear set 30–40 mm long and a little over 100 mm across displaces a few hundred cm³/rev — a torque of hundreds of N·m from a motor that weighs 5–15 kg and costs a fraction of a piston motor. A distributor valve, synchronised with the orbit, connects each chamber to the inlet while it grows and to the outlet while it shrinks.

### Gerotor or geroler
- In a **gerotor** motor the ring's lobes are part of the ring, and the star slides on them. Simple and cheap, good at low pressure and with some dirt.
- In a **geroler** motor the ring's lobes are **rollers** in pockets. Rolling replaces sliding: less friction, higher starting torque and efficiency, longer life at high pressure. Most modern orbital motors are gerolers.

The distributor is either a **spool valve** turned by the output shaft (lighter duty, cheaper) or a **disc valve** driven by a second short cardan (higher pressure, better efficiency, often with a separate bearing section for side loads — the wheel-motor variants).

### Typical data

| | Small | Large |
|---|---|---|
| Displacement | 8–100 cm³/rev | 125–1000 cm³/rev |
| Continuous pressure | 100–175 bar | 140–200 bar (intermittent higher) |
| Speed | 50–2000 rpm | 10–400 rpm |
| Continuous torque | 10–230 N·m | 250–2500 N·m |
| Overall efficiency | 70–82 % | 75–85 % (geroler) |

The limits are set by flow (typically 40–75 L/min continuous, which fixes the top speed of the larger sizes), by pressure (the cardan and the gerotor faces), and by heat: at 80 % efficiency a 15 kW orbital motor makes 3 kW of heat in a small body.

### In service
The shaft seal sees the case pressure. Motors with high-pressure seals tolerate some back-pressure, but motors **in series** or working against a high return pressure need a **case-drain line**. A worn orbital motor loses torque at low speed first — the load stalls where it used to crawl — and gets hot. The star's orbit also makes the motor sensitive to shock loads on the cardan. In the simulation, watch the star roll while the shaft turns six times slower, and see which chambers are filling (red) and emptying (blue).

> [!tip] An orbital motor with a built-in spring-applied brake and a heavy bearing section is often the neatest drive for a small winch, a sweeper wheel or an auger; for continuous heavy duty or low-speed precision, step up to a [[radial-piston-motors|radial-piston motor]].

> [!key] Orbital motors are the cheap, compact low-speed high-torque motors: the star orbits N times per revolution and N(N + 1) chamber fillings give a large displacement. Geroler versions start better and last longer.
`,
  ideas: [
    'A star with N lobes rolls inside a ring with N + 1, orbiting N times for each revolution of the shaft.',
    'Each revolution gives N(N + 1) chamber fillings, so the displacement is large for the size.',
    'Gerolers use rollers in the ring: less friction, higher starting torque and efficiency than sliding gerotors.',
    'Orbital motors suit 10–800 rpm and 100–200 bar; flow, pressure and heat limit them.'
  ],
  pitfalls: [
    'The star turns once for each turn of the shaft — It orbits N times per revolution and turns only 1/N of a turn per orbit; the cardan shaft converts the wobbling orbit into shaft rotation.',
    'Orbital motors can replace radial-piston motors in any low-speed duty — Their lower efficiency and pressure rating make them hot and short-lived in heavy continuous duty; they suit light and intermittent work.'
  ],
  formulas: [
    {
      name: 'Orbits of the star',
      expr: 'forb = N*n', tex: 'f_{orb} = N\\,n',
      vars: {
        forb: { name: 'orbit frequency of the star', q: 'frequency', unit: 'rpm', tex: 'f_{orb}' },
        N: { name: 'lobes on the star', q: 'count', value: 6, int: true },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 200 }
      },
      stories: { forb: 'A 6/7 orbital motor with {N} star lobes turns at {n}. How many orbits a minute does its star make?' }
    },
    {
      name: 'Displacement from the chambers',
      expr: 'Vg = N*(N + 1)*dV', tex: 'V_g = N\\,(N+1)\\,\\Delta V',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        N: { name: 'lobes on the star', q: 'count', value: 6, int: true },
        dV: { name: 'volume change of one chamber per orbit', q: 'volume', unit: 'cm³', value: 5, tex: '\\Delta V' }
      },
      stories: { Vg: 'Each chamber of a gerotor with {N} star lobes changes its volume by {dV} per orbit. What is the displacement?', dV: 'A motor with {N} star lobes displaces {Vg}. By how much does one chamber change per orbit?' }
    },
    {
      name: 'Torque of an orbital motor',
      expr: 'T = Vg*dp*etahm/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p\\,\\eta_{hm}}{2\\pi}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 200, tex: 'V_g' },
        dp: { name: 'pressure difference', q: 'pressure', unit: 'bar', value: 140, tex: '\\Delta p' },
        etahm: { name: 'hydromechanical efficiency', q: 'ratio', unit: '%', value: 85, tex: '\\eta_{hm}' }
      },
      stories: { T: 'A {Vg} geroler motor works across {dp} ({etahm}). What torque does it give?', dp: 'A {Vg} orbital motor ({etahm}) must give {T}. What pressure difference is needed?' }
    }
  ],
  examples: [
    {
      title: 'An auger drive',
      q: 'A post-hole auger needs 350 N·m at 150 rpm. A 200 cm³/rev geroler motor has η_hm = 85 % and η_v = 90 % here. What pressure difference and flow does it need?',
      steps: [
        '$\\Delta p = 2\\pi \\times 350/(200\\times10^{-6} \\times 0.85) = 12.9$ MPa = 129 bar.',
        '$Q = 200 \\times 150/0.90 = 33\\,300$ cm³/min = 33.3 L/min.',
        'The star orbits $6 \\times 150 = 900$ times a minute.'
      ],
      a: 'About 129 bar and 33 L/min — comfortably inside a mid-size orbital motor\'s rating.'
    },
    {
      title: 'Where the displacement comes from',
      q: 'A 6/7 geroler set changes each chamber\'s volume by 3.8 cm³ per orbit. What is its displacement? What would a set twice as long give?',
      steps: [
        'Chamber fillings per revolution: $6 \\times 7 = 42$.',
        '$V_g = 42 \\times 3.8 = 160$ cm³/rev.',
        'Doubling the length doubles every chamber: 320 cm³/rev in the same diameter.'
      ],
      a: '160 cm³/rev, and 320 cm³/rev for a set twice as long.'
    }
  ],
  quiz: [
    { q: 'An orbital motor with a 6-lobe star turns at 100 rpm. How often does the star orbit?', answer: 600, unit: 'rpm', why: 'It orbits N = 6 times per revolution: 600 orbits a minute.' },
    { q: 'What is the main advantage of a geroler over a gerotor?', choices: ['Rollers replace sliding contact, so friction is lower and starting torque higher', 'It has more lobes', 'It needs no distributor valve', 'It runs faster without limit'], a: 0, why: 'Rolling contact cuts friction and wear, especially at high pressure and at start.' },
    { q: 'When does an orbital motor need an external case-drain line?', choices: ['When it runs in series with other motors or against high back-pressure', 'Always, at any pressure', 'Never', 'Only when running backwards'], a: 0, why: 'The shaft seal sees case pressure; a drain keeps it low when both ports may be well above tank pressure.' },
    { q: 'True or false: an orbital motor is usually more efficient than a radial-piston motor.', a: false, why: 'Orbital motors reach about 70–85 %; radial-piston motors 90–95 %.' }
  ],
  problems: [
    { q: 'A 315 cm³/rev orbital motor works across 160 bar with η_hm = 86 %. What torque does it give?', answer: 690, unit: 'N·m', tol: 0.01, steps: ['$T = 315\\times10^{-6} \\times 160\\times10^{5} \\times 0.86/(2\\pi)$', '$= 690$ N·m.'] }
  ],
  choose: {
    good: [
      'Low-cost low-speed drives on light mobile machines: augers, sweepers, conveyors, feeders, small winches and wheel drives.',
      'Direct drive at 10–800 rpm without a gearbox, in a compact, light motor.',
      'Intermittent duty at moderate pressure (up to about 200 bar).'
    ],
    avoid: [
      'Heavy continuous duty at high pressure: efficiency and heat limit them — use a radial-piston motor.',
      'Precise low-speed control over changing temperature without feedback.',
      'Severe shock loads on the shaft without a heavy-duty bearing version.'
    ],
    check: [
      'Continuous and intermittent pressure, torque and flow ratings.',
      'Shaft-seal pressure rating, drain needs and series operation.',
      'Starting torque at low speed, especially for gerotor (non-roller) sets.',
      'Side-load capacity of the bearing section and brake options.'
    ]
  },
  applications: [
    'Auger, sweeper-brush, conveyor and spreader drives on agricultural and municipal machines.',
    'Wheel motors of small loaders, mowers and lifts; small capstans and winches.',
    'Rotators and drives on attachments for excavators and tractors.'
  ],
  history: 'The gerotor ("generated rotor") geometry was developed by Myron Hill in the 1920s for pumps; turned into a motor with an orbiting star and a cardan shaft, it became the most widely used low-speed high-torque motor on light mobile machines.',
  sources: [
    'Esposito, *Fluid Power with Applications* — gerotor pumps and low-speed high-torque motors.',
    'ISO 1219-1, *Fluid power systems and components — Graphical symbols and circuit diagrams — Part 1: Graphical symbols*.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.'
  ],
  sim: ['hy-orbital']
},

{
  id: 'hydraulic-motor-sizing', parent: 'hydraulic-motor-types', title: 'Sizing a hydraulic motor and its pump', level: 2,
  short: 'Start at the load: torque and speed, starting and holding. Choose a working pressure below the relief setting, then the displacement from the torque, the flow from the speed, the pump from the flow and the electric motor from the pump\'s power — and check speed limits, starting torque and the heat that is left over.',
  keywords: ['hydraulic motor sizing', 'displacement selection', 'winch', 'direct drive', 'gearbox', 'pump sizing', 'electric motor power', 'working pressure', 'relief setting', 'starting torque', 'duty cycle'],
  prereq: ['hydraulic-motor-principle', 'motor-selection-method', 'hydraulics:displacement-flow'],
  related: ['radial-piston-motors', 'orbital-motors', 'axial-piston-motors', 'hydraulic-power-unit', 'gearboxes', 'motors-conveyors-hoists', 'hydraulic-heat-noise'],
  body: `
A hydraulic drive is sized backwards, from the load to the power source. Each step uses the two motor relations — torque from pressure, speed from flow — and each adds a loss.

### 1. The load
Find the torque and speed the load needs, not just in steady running but when starting, accelerating and holding. For a winch the drum torque is the rope pull times the drum radius and the drum speed is the line speed divided by the drum circumference; add the torque to accelerate the drum and load (see [[inertia-reflected]]) and the friction of bearings and sheaves. Note the duty: a winch that lifts for 20 s in every minute can use intermittent ratings; a conveyor running all shift cannot.

### 2. Direct drive or gearbox
The same drum can be driven by a large low-speed motor or by a small fast motor through a gearbox:

| | Low-speed motor, direct | High-speed motor + gearbox |
|---|---|---|
| Motor | [[radial-piston-motors|Radial-piston]] or [[orbital-motors|orbital]] | [[axial-piston-motors|Axial-piston]] or [[gear-motors-hyd|gear]] |
| Parts | one | motor, gearbox, coupling |
| Efficiency | 90–95 % (orbital 75–85 %) | motor 90–95 % × gearbox 93–97 % |
| Low-speed smoothness | excellent | good (the motor turns fast) |
| Backlash | none | the gearbox's |
| Cost and size | larger motor | smaller motor, compact planetary box |

### 3. The working pressure
Leave margins. The **relief valve** limits the pump pressure; the motor gets that minus the pressure losses in the valves and hoses (often 10–30 bar), minus the back-pressure in its return line, minus a margin for acceleration and for the relief valve's own pressure rise before it opens fully. Choose the working pressure difference so that the continuous rating of the motor is not exceeded and the relief setting sits roughly 10–20 % above the highest working pressure.

### 4. Displacement, then speed
The displacement follows from the torque, $V_g = 2\\pi T/(\\Delta p\\,\\eta_{hm})$. Take the next **standard size up** and recalculate the pressure it will really need. Check the **starting torque** with the lower starting efficiency. Then the flow is $Q = V_g\\,n/\\eta_v$; check that the speed lies between the motor's minimum smooth speed and its maximum.

### 5. Pump and electric motor
The pump must deliver that flow: its displacement is $Q/(n_{pump}\\,\\eta_v)$, typically at 1450–1500 rpm on a 50 Hz four-pole motor (1750–1800 at 60 Hz). Its pressure is the motor's plus the losses. The electric motor's power is $P = p\\,Q/\\eta_t$ with the pump's overall efficiency (85–90 % for a piston pump, 80–88 % for a gear pump), rounded up to a standard size (see [[efficiency-classes]]). Whatever the motor, pump, valves and pipes lose becomes heat for the [[hydraulic-heat-noise|cooler]].

### An example: a 15 kN winch
A drum of 300 mm (to the rope centre) pulls 15 kN at 20 m/min: 2250 N·m at 21.2 rpm, 5 kW at the rope. With a 210 bar relief, 15 bar of line and valve losses and 5 bar of back-pressure, 170 bar is available across the motor.

- **Direct:** a radial-piston motor needs $2\\pi \\times 2250/(170\\times10^5 \\times 0.94) = 885$ cm³/rev; the next size is 1000 cm³/rev, which needs only 150 bar and 22.1 L/min.
- **Geared:** through a 30:1 planetary gearbox (95 %) the motor sees 79 N·m at 637 rpm; an axial-piston motor of 31.4 cm³/rev fits, so 32 cm³/rev, needing 167 bar and 21.2 L/min.

Either way the pump delivers about 22 L/min at 170–190 bar: roughly 6.3–7 kW of hydraulic power and a 7.5 kW electric motor. The simulation does this sizing live: change the pull, the drum, the speed and the drive, and follow the power from the electric motor to the rope.

> [!warn] Size the brake and the load-holding valves with the motor: the motor alone cannot hold a suspended load (it leaks), and a winch must hold its load with the pump stopped. Lifting equipment is regulated — follow the machinery and lifting-equipment rules of your country and a competent person's review.

> [!key] Load → torque and speed → pressure with margins → displacement (next size up) → flow → pump → electric motor → heat. Check starting torque, speed limits and holding at each step.
`,
  ideas: [
    'Size from the load backwards: torque and speed first, the power source last.',
    'Choose the working pressure with margins below the relief setting for losses, back-pressure and acceleration.',
    'Displacement from torque, flow from speed; choose the next standard size up and recalculate.',
    'Check the starting torque and the motor\'s speed limits, then size the pump and the electric motor.',
    'Every loss becomes heat that the power unit must remove.'
  ],
  pitfalls: [
    'Size the motor for the relief-valve pressure — The motor sees the relief pressure minus line losses and back-pressure, and it needs a margin to accelerate; sized at the relief setting it stalls on the first heavy start.',
    'A bigger motor is always safer — A motor far too large runs at low pressure and low speed, where its efficiency is poor, and needs more flow for the same speed: a bigger pump and electric motor.'
  ],
  formulas: [
    {
      name: 'Displacement needed for a torque',
      expr: 'Vg = 2*pi*T/(dp*etahm)', tex: 'V_g = \\dfrac{2\\pi\\,T}{\\Delta p\\,\\eta_{hm}}',
      vars: {
        Vg: { name: 'displacement needed', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        T: { name: 'torque at the motor shaft', q: 'torque', unit: 'N·m', value: 2250 },
        dp: { name: 'working pressure difference', q: 'pressure', unit: 'bar', value: 170, tex: '\\Delta p' },
        etahm: { name: 'hydromechanical efficiency', q: 'ratio', unit: '%', value: 94, tex: '\\eta_{hm}' }
      },
      stories: { Vg: 'A drum needs {T}; {dp} is available across the motor ({etahm}). What displacement is needed?' }
    },
    {
      name: 'Flow needed for a speed',
      expr: 'Q = Vg*n/etav', tex: 'Q = \\dfrac{V_g\\,n}{\\eta_v}',
      vars: {
        Q: { name: 'flow to the motor', q: 'flowrate', unit: 'L/min' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 1000, tex: 'V_g' },
        n: { name: 'motor speed', q: 'frequency', unit: 'rpm', value: 21.2 },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 96, tex: '\\eta_v' }
      },
      stories: { Q: 'A {Vg} motor must turn at {n} ({etav}). What flow must the pump deliver?' }
    },
    {
      name: 'Motor torque through a gearbox (winch)',
      expr: 'T = F*D/(2*ig*etag)', tex: 'T = \\dfrac{F\\,D}{2\\,i\\,\\eta_g}',
      vars: {
        T: { name: 'torque at the motor shaft', q: 'torque', unit: 'N·m' },
        F: { name: 'rope pull', q: 'force', unit: 'kN', value: 15 },
        D: { name: 'drum diameter to the rope centre', q: 'length', unit: 'mm', value: 300 },
        ig: { name: 'gearbox ratio', value: 30, tex: 'i' },
        etag: { name: 'gearbox efficiency', q: 'ratio', unit: '%', value: 95, tex: '\\eta_g' }
      },
      note: 'For lifting; when lowering, the gearbox efficiency multiplies instead of divides.',
      stories: { T: 'A winch pulls {F} on a {D} drum through a {ig}:1 gearbox ({etag}). What torque must the motor give?', ig: 'What gearbox ratio lets a motor giving {T} pull {F} on a {D} drum ({etag})?' }
    },
    {
      name: 'Electric motor power for the pump',
      expr: 'P = p*Q/eta', tex: 'P = \\dfrac{p\\,Q}{\\eta_t}',
      vars: {
        P: { name: 'power at the pump shaft', q: 'power', unit: 'kW' },
        p: { name: 'pump pressure', q: 'pressure', unit: 'bar', value: 170 },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22.1 },
        eta: { name: 'pump overall efficiency', q: 'ratio', unit: '%', value: 87, tex: '\\eta_t' }
      },
      stories: { P: 'A pump delivers {Q} at {p} with an overall efficiency of {eta}. What power must its electric motor give?' }
    }
  ],
  examples: [
    {
      title: 'A winch, direct or geared',
      q: 'A winch pulls 15 kN on a 300 mm drum at 20 m/min, with 170 bar across the motor. Size a direct radial-piston motor (η_hm 94 %, η_v 96 %) and an axial-piston motor (η_hm 93 %, η_v 96 %) through a 30:1 gearbox (95 %).',
      steps: [
        'Drum: $T = 15\\,000 \\times 0.15 = 2250$ N·m; $n = 20/(\\pi \\times 0.3) = 21.2$ rpm; power $15 \\times 20/60 = 5$ kW.',
        'Direct: $V_g = 2\\pi \\times 2250/(170\\times10^{5} \\times 0.94) = 885$ cm³/rev → 1000 cm³/rev, needing $\\Delta p = 150$ bar and $Q = 1000 \\times 21.2/0.96 = 22.1$ L/min.',
        'Geared: motor torque $2250/(30 \\times 0.95) = 79$ N·m at $21.2 \\times 30 = 637$ rpm; $V_g = 2\\pi \\times 79/(170\\times10^{5} \\times 0.93) = 31.4$ → 32 cm³/rev, 167 bar, $Q = 32 \\times 637/0.96 = 21.2$ L/min.'
      ],
      a: 'Direct: 1000 cm³/rev at 150 bar and 22 L/min. Geared: 32 cm³/rev at 167 bar and 21 L/min.'
    },
    {
      title: 'The pump and the electric motor',
      q: 'The direct winch needs 22.1 L/min at 150 bar at the motor; the lines lose 15 bar and the return holds 5 bar. The pump runs at 1450 rpm (η_v 93 %, overall 87 %). Size the pump and the electric motor.',
      steps: [
        'Pump pressure: $150 + 15 + 5 = 170$ bar.',
        'Pump displacement: $22\\,100/(1450 \\times 0.93) = 16.4$ cm³/rev → a 16 or 19 cm³/rev pump (16 gives 21.6 L/min, a line speed of 19.5 m/min).',
        'Power: $170 \\times 22.1/600/0.87 = 7.2$ kW → a 7.5 kW four-pole motor.'
      ],
      a: 'A pump of about 16–19 cm³/rev at 170 bar, driven by a 7.5 kW motor.'
    }
  ],
  quiz: [
    { q: 'The relief valve is set at 210 bar. The lines lose 20 bar and the return holds 10 bar. What pressure difference is left across the motor at most?', answer: 180, unit: 'bar', why: '210 − 20 − 10 = 180 bar — and a margin for acceleration should come off that too.' },
    { q: 'You calculated 885 cm³/rev and the catalogue offers 800 and 1000. Which do you choose?', choices: ['1000, then recalculate the pressure it needs', '800, it is closer', 'Either; the relief valve will sort it out', '800 with a higher relief setting'], a: 0, why: 'The smaller motor cannot give the torque at the available pressure; the larger one needs less pressure, leaving margin.' },
    { q: 'Doubling the gearbox ratio in front of the motor (same drum and line speed)…', choices: ['halves the motor torque and doubles its speed; the flow stays about the same', 'halves the flow needed', 'doubles the power needed', 'halves both torque and speed'], a: 0, why: 'The gearbox trades torque for speed; the power, and hence roughly the flow at a given pressure, is set by the load.' },
    { q: 'True or false: a hydraulic winch motor sized with ample torque can hold a suspended load without a brake.', a: false, why: 'Internal leakage lets the load creep down; winches need a brake and load-holding valves.' }
  ],
  problems: [
    { q: 'A conveyor drum needs 1200 N·m at 45 rpm. With 150 bar across a motor of η_hm 88 %, what displacement is needed?', answer: 571, unit: 'cm³/rev', tol: 0.01, steps: ['$V_g = 2\\pi T/(\\Delta p\\,\\eta_{hm}) = 2\\pi \\times 1200/(150\\times10^{5} \\times 0.88)$', '$= 5.71\\times10^{-4}$ m³ = 571 cm³/rev.'] },
    { q: 'A pump delivers 60 L/min at 200 bar with an overall efficiency of 85 %. What power must its electric motor supply?', answer: 23.5, unit: 'kW', tol: 0.01, steps: ['Hydraulic power $200 \\times 60/600 = 20$ kW.', 'Shaft power $20/0.85 = 23.5$ kW → a 30 kW motor, or check whether the full pressure and flow occur together.'] }
  ],
  choose: {
    good: [
      'A low-speed motor directly on the load when smoothness, few parts and no backlash matter.',
      'A fast piston motor with a planetary gearbox when size, weight and cost of the motor matter most.',
      'Pressure-compensated or load-sensing pumps where the flow and pressure vary widely over the cycle.'
    ],
    avoid: [
      'Sizing at the relief pressure with no margin for losses, back-pressure and acceleration.',
      'An oversized motor running at a fraction of its pressure, with poor efficiency.',
      'Ignoring the holding case: the motor leaks; the brake holds.'
    ],
    check: [
      'Starting torque with the starting efficiency.',
      'Minimum and maximum speed of the chosen motor at the flow you will supply.',
      'Pump displacement and electric motor size at the real pump speed.',
      'The heat left over and the cooler and tank that must remove it.'
    ]
  },
  applications: [
    'Winches, capstans and hoists; conveyor and drum drives; wheel and track drives.',
    'Size a hoist\'s electric alternative in [the hoist calculator](#/tools/sizing/hoist), or compare the families in [the selection guide](#/tools/sizing/choose).'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — hydraulic motor performance and system sizing.',
    'ISO 4413, *Hydraulic fluid power — General rules and safety requirements for systems and their components*.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.'
  ],
  sim: ['hy-sizing', 'hy-motor-bench']
},

{
  id: 'hydraulic-power-unit', parent: 'hydraulic-motor-circuits', title: 'The hydraulic power unit', level: 2,
  short: 'Everything that makes and conditions the flow for a hydraulic motor: the reservoir, the electric motor and pump, the suction strainer, relief and check valves, gauges, filters, cooler, breather and accumulator. Each element has a job and typical sizes — and most failures of hydraulic motors start here.',
  keywords: ['hydraulic power unit', 'HPU', 'power pack', 'reservoir', 'tank sizing', 'breather', 'suction strainer', 'return filter', 'pressure filter', 'bypass', 'clogging indicator', 'relief valve', 'accumulator', 'precharge', 'cooler', 'pressure gauge', 'bell housing'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:hydraulic-system', 'hydraulics:reservoirs'],
  related: ['motor-control-valves', 'hydraulic-fluids-filtration', 'hydraulic-heat-noise', 'hydraulic-motor-sizing', 'dol-starting', 'soft-starters', 'hydraulics:accumulators', 'hydraulics:accumulator-sizing', 'hydraulics:relief-valve', 'hydraulics:filtration'],
  body: `
A hydraulic motor needs a steady supply of clean, cool oil at the right pressure. The **hydraulic power unit** (HPU, power pack) makes it. On the diagram it is drawn inside a dash-dot boundary with [[hydraulics:iso-1219|ISO 1219 symbols]]; on the floor it is a steel tank with a motor and pump on its lid.

| Element | Its job | Typical choices |
|---|---|---|
| Reservoir | Holds the oil, lets air and dirt settle, sheds some heat | 3–5 × pump flow per minute (industrial); 1–2 × on mobile machines |
| Breather (air filter) | Lets air in and out as the level changes, without dirt | 3–10 µm; desiccant type in humid places |
| Suction strainer | Stops coarse debris reaching the pump | 100–150 µm, generously sized; or none, with a flooded inlet |
| Electric motor + pump | Turn electrical power into flow | 4-pole motor at 1450–1500 rpm (quieter than 2-pole); coupling in a bell housing |
| Check valve | Stops back-flow into the pump; keeps an accumulator charged | Low cracking pressure, 0.5–1 bar |
| Relief valve | Limits the maximum pressure — the last line of defence | Set about 10–20 % above the highest working pressure |
| Pressure gauge | Shows what the load demands | With a snubber or isolating valve; range about 1.5 × working |
| Pressure filter | Protects proportional and servo valves | 3–10 µm, high collapse rating |
| Return filter | Cleans everything coming back | 10–25 µm, bypass at 1.5–3.5 bar, clogging indicator |
| Cooler | Removes the heat of the losses | Air–oil or water–oil, with a thermostat; see [[hydraulic-heat-noise]] |
| Accumulator | Stores oil under gas pressure for peaks, emergencies and damping | Nitrogen precharge about 90 % of the lowest working pressure (energy storage) |

### The reservoir is a component, not a box
The return oil enters **below the oil level** through a diffuser, on the far side of a **baffle** from the suction, so it has time — a few minutes — to release air and drop its dirt before the pump takes it again. The bottom slopes to a drain; a clean-out cover gives access; a sight glass shows level and temperature. The air space above the oil (10–15 %) absorbs the changing volume: every litre an accumulator or a cylinder takes out of the tank is drawn in as air through the breather. A 40 L/min unit therefore has a tank of 120–200 L; a mobile machine, pressed for space, often 40–80 L, which makes filtration, de-aeration and cooling harder.

### Pump, motor and pressure
Hydraulic power is $p\\,Q$ — **kW = bar × L/min / 600** — and the electric motor supplies it divided by the pump's efficiency. A 40 L/min pump at 200 bar needs a 15–18.5 kW motor. Start it unloaded where possible (an unloading valve, or an open-centre valve) so the motor starts light; large units use [[star-delta-starting|star–delta]] or a [[soft-starters|soft starter]]. With a fixed pump and no demand, the flow must go somewhere: over the relief valve (all its power becomes heat), or to the tank at low pressure through an open or tandem centre, or the pump must be a variable pump that destrokes.

### The accumulator
A gas-charged accumulator supplies short peaks bigger than the pump, keeps pressure during a power failure, and damps pulsation. Its usable volume follows Boyle's law with **absolute** pressures: $\\Delta V = V_0\\,p_0\\,(1/p_1 - 1/p_2)$ (isothermal; slower cycles). In the simulation, turn the accumulator on and watch a small pump keep up with a big intermittent demand: the accumulator fills between strokes and empties during them — and the tank level moves the other way.

### Filters that stay filters
A clogging return filter raises its pressure drop until the **bypass** opens — then dirty oil goes round it and the indicator is the only warning. Change elements on the indicator, not on a calendar, and treat a bypass that opened as a contamination event.

> [!warn] An accumulator stays charged after the pump stops. Before work, isolate it and open its bleed valve to the tank, and check with a gauge that the pressure is zero. Precharge only with dry nitrogen — never oxygen or air. Lock out the electric motor, release all pressure, lower or block every load, and let hot oil and surfaces cool. Oil from a pinhole leak can be injected through the skin — seek emergency medical care at once for any injection injury.

> [!key] A power unit gives the motor clean, cool oil at a limited pressure: tank, breather, strainer, pump and motor, check and relief valves, gauges, filters with bypass indicators, cooler and accumulator each do one job — and each has a size.
`,
  ideas: [
    'The reservoir settles air and dirt and absorbs volume changes; industrial tanks hold 3–5 minutes of pump flow.',
    'The relief valve limits the pressure; a fixed pump with no demand either blows over it (heat) or unloads to the tank.',
    'Return filters have a bypass and a clogging indicator; a bypass that opened means dirty oil went round the filter.',
    'Accumulators store oil under nitrogen for peaks and emergencies; their usable volume follows Boyle\'s law in absolute pressure.',
    'Electric motor power = pump pressure × flow / pump efficiency (kW = bar × L/min / 600 / η).'
  ],
  pitfalls: [
    'The tank only has to hold the oil — It must also let air escape and dirt settle, absorb the volume of accumulators and cylinders, and shed heat; a small tank makes all of these worse.',
    'A filter with a bypass protects the system whatever happens — Once clogged, the bypass passes unfiltered oil; the clogging indicator must be watched and acted on.',
    'Accumulator pressures can be used as gauge pressures in Boyle\'s law — The gas law needs absolute pressures: add about 1 bar to each gauge reading.'
  ],
  formulas: [
    {
      name: 'Reservoir size by the rule of thumb',
      expr: 'V = k*Q', tex: 'V = k\\,Q',
      vars: {
        V: { name: 'reservoir volume', q: 'volume', unit: 'L' },
        k: { name: 'minutes of pump flow held (3–5 industrial, 1–2 mobile)', q: 'time', unit: 'min', value: 3 },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 40 }
      },
      stories: { V: 'An industrial power unit has a {Q} pump. How large a tank does a rule of {k} of flow give?' }
    },
    {
      name: 'Pump flow',
      expr: 'Q = Vg*n*etav', tex: 'Q = V_g\\,n\\,\\eta_v',
      vars: {
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min' },
        Vg: { name: 'pump displacement', q: 'displacement', unit: 'cm³/rev', value: 28, tex: 'V_g' },
        n: { name: 'pump speed', q: 'frequency', unit: 'rpm', value: 1450 },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 95, tex: '\\eta_v' }
      },
      stories: { Q: 'A {Vg} pump turns at {n} with a volumetric efficiency of {etav}. What does it deliver?', Vg: 'What pump displacement delivers {Q} at {n} ({etav})?' }
    },
    {
      name: 'Electric motor power',
      expr: 'P = p*Q/eta', tex: 'P = \\dfrac{p\\,Q}{\\eta_t}',
      vars: {
        P: { name: 'power at the pump shaft', q: 'power', unit: 'kW' },
        p: { name: 'pump pressure', q: 'pressure', unit: 'bar', value: 200 },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 40 },
        eta: { name: 'pump overall efficiency', q: 'ratio', unit: '%', value: 85, tex: '\\eta_t' }
      },
      stories: { P: 'A power unit delivers {Q} at {p}; the pump is {eta} efficient. What must the electric motor supply?' }
    },
    {
      name: 'Usable volume of an accumulator (isothermal)',
      expr: 'dV = V0*p0*(1/p1 - 1/p2)', tex: '\\Delta V = V_0\\,p_0\\left(\\dfrac{1}{p_1} - \\dfrac{1}{p_2}\\right)',
      vars: {
        dV: { name: 'oil delivered between p2 and p1', q: 'volume', unit: 'L', tex: '\\Delta V' },
        V0: { name: 'accumulator gas volume', q: 'volume', unit: 'L', value: 10, tex: 'V_0' },
        p0: { name: 'precharge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        p1: { name: 'lowest working pressure (absolute)', q: 'pressure', unit: 'bar', value: 101, tex: 'p_1' },
        p2: { name: 'highest working pressure (absolute)', q: 'pressure', unit: 'bar', value: 201, tex: 'p_2' }
      },
      note: 'Absolute pressures (gauge + about 1 bar). Fast discharges are closer to adiabatic and give less.',
      stories: { dV: 'A {V0} accumulator precharged to {p0} works between {p1} and {p2} (all absolute). How much oil can it deliver?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a small power unit',
      q: 'A motor circuit needs up to 38 L/min at 200 bar. Choose the pump, the electric motor and the tank (industrial, 3 minutes of flow).',
      steps: [
        'A 28 cm³/rev pump at 1450 rpm with η_v 95 % gives $28 \\times 1450 \\times 0.95 = 38.6$ L/min.',
        'Power: $200 \\times 38.6/600/0.85 = 15.1$ kW → an 18.5 kW motor, or 15 kW if full pressure and full flow rarely coincide.',
        'Tank: $3 \\times 38.6 \\approx 120$ L of oil, plus 10–15 % air space.'
      ],
      a: 'A 28 cm³/rev pump, an 18.5 kW (or 15 kW) four-pole motor, and a tank of about 130–140 L.'
    },
    {
      title: 'What an accumulator gives',
      q: 'A 10 L accumulator is precharged to 90 bar (gauge) and works between 100 and 200 bar (gauge). How much oil does it deliver if the gas stays at constant temperature?',
      steps: [
        'Absolute: $p_0 = 91$, $p_1 = 101$, $p_2 = 201$ bar.',
        '$\\Delta V = 10 \\times 91 \\times (1/101 - 1/201) = 910 \\times 0.004\\,926 = 4.48$ L.'
      ],
      a: 'About 4.5 L — less if it discharges quickly (adiabatic).'
    }
  ],
  quiz: [
    { q: 'Why does the return line end below the oil level, on the far side of a baffle from the suction?', choices: ['So returning oil does not foam and has time to release air and drop dirt before the pump draws it', 'To cool the pump', 'To keep the tank pressurised', 'To measure the flow'], a: 0, why: 'A return pouring onto the surface entrains air; the baffle lengthens the path so air and dirt separate.' },
    { q: 'A return filter\'s clogging indicator shows red. What is happening?', choices: ['Its pressure drop is near the bypass setting; soon dirty oil will bypass it', 'The oil is too cold only', 'The filter is working perfectly', 'The pump is cavitating'], a: 0, why: 'Indicators trip at about 75 % of the bypass pressure; change the element before the bypass opens.' },
    { q: 'A pump gives 50 L/min at 150 bar with an overall efficiency of 85 %. What shaft power does it need?', answer: 14.7, unit: 'kW', why: '150 × 50/600 = 12.5 kW hydraulic; ÷ 0.85 = 14.7 kW.' },
    { q: 'True or false: an accumulator is safe to open as soon as the pump is switched off.', a: false, why: 'It keeps its charge; isolate it, bleed it to the tank and check the gauge reads zero first.' }
  ],
  problems: [
    { q: 'A 20 L accumulator is precharged to 100 bar absolute and works between 120 and 220 bar absolute (isothermal). How much oil does it deliver?', answer: 7.58, unit: 'L', tol: 0.01, steps: ['$\\Delta V = V_0\\,p_0\\,(1/p_1 - 1/p_2) = 20 \\times 100 \\times (1/120 - 1/220)$', '$= 2000 \\times 0.003\\,788 = 7.58$ L.'] }
  ],
  choose: {
    good: [
      'A central power unit feeding several motors and cylinders of one machine.',
      'An accumulator where short peaks of flow are much larger than the average (a small pump and a big accumulator).',
      'A variable (pressure-compensated) pump where the demand varies — far less heat than a fixed pump over a relief valve.'
    ],
    avoid: [
      'A fixed pump blowing over its relief valve most of the time: all that power becomes heat.',
      'Suction strainers so fine or small that the pump cavitates when the oil is cold.',
      'A tank so small that the oil never settles, foams and runs hot.'
    ],
    check: [
      'Pump flow and pressure against the circuit\'s peaks and averages; electric motor size and starting method.',
      'Tank volume, baffle, return below the level, breather rating and air space.',
      'Filter ratings, bypass settings and indicators; cleanliness required by the motors and valves.',
      'Heat balance and cooler; accumulator precharge and its safety block (isolating and bleed valves).'
    ]
  },
  applications: [
    'Machine-tool, press and test-rig power units; the power pack of a hydraulic winch or crane.',
    'Mobile machines, where the diesel engine drives the pumps and the tank shares space with the fuel.',
    'Try the electric side of a pump drive in [the motor lab](#/tools/motorlab/hydraulic).'
  ],
  sources: [
    'ISO 4413, *Hydraulic fluid power — General rules and safety requirements for systems and their components*.',
    'ISO 1219-1, *Fluid power systems and components — Graphical symbols and circuit diagrams — Part 1: Graphical symbols*; ISO 1219-2 (circuit diagrams).',
    'Esposito, *Fluid Power with Applications* — reservoirs, filters, accumulators and hydraulic conductors.'
  ],
  sim: ['hy-power-unit']
},

{
  id: 'motor-control-valves', parent: 'hydraulic-motor-circuits', title: 'Valves that control a hydraulic motor', level: 2,
  short: 'A directional valve starts, stops and reverses the motor, and its centre position decides whether the motor coasts or is locked; flow-control and proportional valves set its speed; crossport reliefs and make-up checks protect it when it stops. Every throttle turns pressure drop times flow into heat.',
  keywords: ['directional control valve', '4/3 valve', 'float centre', 'motor spool', 'tandem centre', 'closed centre', 'flow control valve', 'pressure compensated', 'throttle', 'meter-in', 'meter-out', 'bleed-off', 'proportional valve', 'ramps', 'crossport relief', 'anti-cavitation valve', 'solenoid', 'ISO 4401'],
  prereq: ['hydraulic-motor-principle', 'hydraulics:directional-valves', 'hydraulics:flow-control'],
  related: ['counterbalance-brake-valves', 'hydraulic-power-unit', 'hydraulic-heat-noise', 'hydrostatic-transmissions', 'hydraulics:centre-conditions', 'hydraulics:pressure-compensation', 'hydraulics:proportional-valves', 'hydraulics:servo-valves', 'hydraulics:load-sensing', 'hydraulics:braking-circuits'],
  body: `
Between the power unit and the motor sit the valves that tell the motor what to do: **which way** (directional valves), **how fast** (flow-control and proportional valves), and **how hard it may push or brake** (pressure valves).

### Direction — and what happens in the centre
A 4/3 directional valve connects P to A and B to T for one direction, P to B and A to T for the other. Its **centre** decides what the motor does when it stops:

| Centre | Ports in the centre | The motor… | Use |
|---|---|---|---|
| Float ("motor spool") | A, B → T; P blocked | coasts to a stop; brake and counterbalance pilots vent | Winches with brakes and counterbalance valves; loads with inertia |
| Tandem | P → T; A, B blocked | is locked; pump unloads at low pressure | Simple drives with little inertia; saves energy |
| Closed | all blocked | is locked | Several valves on one pressure line |
| Open | all connected | coasts; pump unloads | Simple mobile open-centre circuits |

A motor with a heavy load or flywheel **cannot be locked instantly**. With its ports blocked it becomes a pump driven by the inertia: the outlet pressure shoots up — easily past 500 bar — while the other line is sucked towards vacuum and cavitates. So motor circuits carry **crossport (shock) relief valves**, which let the trapped oil pass from the high to the low side at a set pressure and turn the stop into a controlled braking torque $V_g\\,p/2\\pi$, and **make-up (anti-cavitation) check valves** that let oil from the tank into the low side. In the simulation, stop a spinning flywheel with and without them.

### Speed — flow control
- A **throttle** (needle valve) passes a flow that depends on the pressure drop across it, $Q = C_d A\\sqrt{2\\Delta p/\\rho}$ ([[?square-root]]): when the load pressure rises the drop falls and the motor slows — by 42 % when the drop falls to a third.
- A **pressure-compensated flow-control valve** adds a compensator spool that holds the drop across its orifice at about 5–10 bar, so the flow — and the speed — stays within a few per cent whatever the load.
- **Meter-in** controls the oil going into the motor; **meter-out** controls the oil leaving it, which also restrains an overrunning load; **bleed-off** diverts part of the pump flow to the tank — efficient but load-sensitive.

### Speed — proportional valves
A **proportional directional valve** moves its spool in proportion to the current in its solenoid, so one valve sets direction *and* speed. Its amplifier (a card or the valve's on-board electronics) takes a command of 0–10 V, ±10 V or 4–20 mA and adds **ramps** — adjustable acceleration and deceleration times, just like a VFD's — plus dead-band compensation and a dither signal that keeps the spool free. With a pressure compensator or a load-sensing pump the flow becomes proportional to the command whatever the load. For closed-loop speed or position control, servo or high-response valves and a speed sensor on the motor take over (see [[servo-principle]]).

### The electrical side
On/off valves are mostly 24 V DC solenoids of about 20–40 W, with plug connectors that should carry a suppression diode or varistor (switching an inductive coil makes a voltage spike). Subplate valves follow the ISO 4401 mounting patterns: size 03 (often called NG6) carries roughly 40–80 L/min, size 05 (NG10) roughly 100–160 L/min.

### The price of throttling
Every throttle turns its pressure drop times its flow into heat. A fixed pump of 40 L/min at 200 bar feeding a motor that needs 20 L/min at 80 bar through a flow-control valve delivers 2.7 kW of useful power out of 13.3 kW: 4 kW heat the throttle and 6.7 kW go over the relief valve. A variable pump that delivers only the flow needed, at only the pressure needed (load sensing), cuts the loss to a fraction — see [[hydraulic-heat-noise]].

> [!warn] Stopping a motor with inertia on a blocked valve creates pressure peaks that can burst hoses and split fittings. Fit crossport reliefs and make-up checks, set them above working pressure but below the ratings of the motor and hoses, and never disable them.

> [!key] The directional valve and its centre decide how the motor starts and stops; flow and proportional valves set its speed; crossport reliefs and make-up checks protect it; every throttle is a heater.
`,
  ideas: [
    'A float (motor) centre lets the motor coast and vents brake and counterbalance pilots; blocked centres lock it.',
    'Blocking a motor with inertia turns it into a pump: crossport reliefs limit the pressure peak, make-up checks prevent cavitation.',
    'A plain throttle\'s flow varies with the square root of its pressure drop, so the speed varies with the load; a pressure-compensated valve holds it.',
    'Proportional valves set direction and speed from an electrical command, with ramps, like a VFD for oil.',
    'Throttling power Δp·Q becomes heat; variable and load-sensing pumps avoid most of it.'
  ],
  pitfalls: [
    'A closed-centre valve is the safest way to stop a motor — It stops it abruptly: the inertia drives the motor as a pump and makes a pressure spike and cavitation. Motors need crossport reliefs, and loads with brakes need a float centre.',
    'A needle valve holds the motor\'s speed constant — Only if the load is constant; its flow follows the pressure drop across it. Use a pressure-compensated valve for a steady speed.'
  ],
  formulas: [
    {
      name: 'Flow through an orifice',
      expr: 'Q = Cd*A*sqrt(2*dp/rho)', tex: 'Q = C_d\\,A\\,\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min' },
        Cd: { name: 'discharge coefficient (about 0.6–0.7)', value: 0.62, tex: 'C_d' },
        A: { name: 'opening area', q: 'area', unit: 'mm²', value: 10 },
        dp: { name: 'pressure drop across the orifice', q: 'pressure', unit: 'bar', value: 10, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      stories: { Q: 'A valve opening of {A} (Cd = {Cd}) has {dp} across it. What oil flow passes?', A: 'What opening area passes {Q} of oil at a drop of {dp} (Cd = {Cd})?' }
    },
    {
      name: 'Flow of a plain throttle at a new pressure drop',
      expr: 'Q2 = Q1*sqrt(dp2/dp1)', tex: 'Q_2 = Q_1\\sqrt{\\dfrac{\\Delta p_2}{\\Delta p_1}}',
      vars: {
        Q2: { name: 'new flow', q: 'flowrate', unit: 'L/min', tex: 'Q_2' },
        Q1: { name: 'flow at the first drop', q: 'flowrate', unit: 'L/min', value: 20, tex: 'Q_1' },
        dp2: { name: 'new pressure drop', q: 'pressure', unit: 'bar', value: 40, tex: '\\Delta p_2' },
        dp1: { name: 'first pressure drop', q: 'pressure', unit: 'bar', value: 120, tex: '\\Delta p_1' }
      },
      stories: { Q2: 'A throttle passes {Q1} at a drop of {dp1}. The load rises and the drop falls to {dp2}. What flow passes now?' }
    },
    {
      name: 'Heat made by throttling',
      expr: 'P = dp*Q', tex: 'P = \\Delta p\\,Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW' },
        dp: { name: 'pressure drop across the valve', q: 'pressure', unit: 'bar', value: 120, tex: '\\Delta p' },
        Q: { name: 'flow through it', q: 'flowrate', unit: 'L/min', value: 20 }
      },
      stories: { P: 'A flow-control valve passes {Q} with {dp} across it. How much heat does it make?' }
    }
  ],
  examples: [
    {
      title: 'Throttle or compensated valve?',
      q: 'A motor is fed through a throttle from a 200 bar supply. At light load the motor needs 80 bar and the throttle, dropping 120 bar, passes 20 L/min (200 rpm on a 100 cm³/rev motor). The load rises and the motor needs 160 bar. What happens with a plain throttle, and with a pressure-compensated valve?',
      steps: [
        'Throttle: the drop falls to 40 bar, so $Q_2 = 20\\sqrt{40/120} = 11.5$ L/min — the motor slows to 115 rpm, 42 % slower.',
        'Compensated: the compensator keeps its own orifice at a constant drop, so the flow stays 20 L/min (within a few per cent) and the speed stays about 200 rpm, as long as at least 5–10 bar remain for it.'
      ],
      a: 'The throttle lets the speed fall from 200 to 115 rpm; the compensated valve holds about 200 rpm.'
    },
    {
      title: 'Where the power goes',
      q: 'A fixed pump gives 40 L/min with the relief at 200 bar. A flow-control valve feeds 20 L/min to a motor that needs 80 bar. Find the useful power, the losses and the efficiency. What would a load-sensing pump (load + 20 bar) do?',
      steps: [
        'Input: $200 \\times 40/600 = 13.3$ kW. Useful: $80 \\times 20/600 = 2.7$ kW.',
        'Throttle: $(200 - 80) \\times 20/600 = 4.0$ kW; relief valve: $200 \\times 20/600 = 6.7$ kW. Efficiency 20 %.',
        'Load sensing: the pump gives 20 L/min at 100 bar, 3.3 kW; the valve loses $20 \\times 20/600 = 0.7$ kW; efficiency 80 %.'
      ],
      a: '2.7 kW useful out of 13.3 kW (20 %) with a fixed pump; about 80 % with load sensing.'
    }
  ],
  quiz: [
    { q: 'Which valve centre suits a winch motor with a counterbalance valve and a spring-applied brake?', choices: ['Float (A and B to tank)', 'Closed (all ports blocked)', 'Tandem (P to T, A and B blocked)', 'It makes no difference'], a: 0, why: 'Venting A and B lets the brake-release and counterbalance pilot pressures fall to zero, so the brake applies and the valve closes.' },
    { q: 'A spinning motor with a heavy flywheel is stopped by centring a closed-centre valve with no crossport reliefs. What happens?', choices: ['The outlet pressure spikes far above the relief setting and the inlet cavitates', 'The motor stops gently', 'The pump relief valve protects the motor', 'Nothing: the oil is incompressible'], a: 0, why: 'The motor pumps into a blocked line; only the oil\'s compressibility and the hoses give — the pump\'s relief valve is cut off by the valve.' },
    { q: 'A plain throttle passes 30 L/min at a 90 bar drop. What does it pass at a 10 bar drop?', answer: 10, unit: 'L/min', why: 'Q ∝ √Δp: 30 × √(10/90) = 30/3 = 10 L/min.' },
    { q: 'True or false: a pressure-compensated flow-control valve wastes no energy.', a: false, why: 'It still throttles: the pressure it drops times the flow becomes heat. It only makes the speed independent of the load.' }
  ],
  problems: [
    { q: 'A valve drops 60 bar at 45 L/min. How much heat does it make?', answer: 4.5, unit: 'kW', tol: 0.01, steps: ['$P = \\Delta p\\,Q = 60 \\times 45/600$', '$= 4.5$ kW.'] },
    { q: 'What flow passes a 6 mm² opening (Cd = 0.65) with 20 bar across it, in oil of 870 kg/m³?', answer: 15.8, unit: 'L/min', tol: 0.02, steps: ['$Q = 0.65 \\times 6\\times10^{-6} \\times \\sqrt{2 \\times 20\\times10^{5}/870}$', '$= 3.9\\times10^{-6} \\times 67.8 = 2.64\\times10^{-4}$ m³/s = 15.8 L/min.'] }
  ],
  choose: {
    good: [
      'A 4/3 valve with a float centre, crossport reliefs and make-up checks for motors with inertia or overrunning loads.',
      'Pressure-compensated flow control where the speed must not change with the load.',
      'Proportional valves with ramps where the motor must start and stop smoothly or change speed on command.'
    ],
    avoid: [
      'Blocked-centre valves on motors with heavy inertia and no crossport protection.',
      'Plain needle valves for speed control under changing loads.',
      'Throttling a large flow from a fixed pump for long periods: the heat must be removed.'
    ],
    check: [
      'Valve size (ISO 4401 size) against the flow, and the pressure drop at that flow.',
      'The centre condition against the brake, counterbalance and pump-unloading needs.',
      'Crossport relief setting against the motor, hose and fitting ratings.',
      'Coil voltage, power and connector; the amplifier\'s command signal and ramp settings.'
    ]
  },
  applications: [
    'Conveyor and mixer drives with pressure-compensated speed control.',
    'Crane slew and winch drives with proportional valves, ramps, crossport reliefs and brakes.',
    'Mobile machines with load-sensing proportional valve banks feeding many motors and cylinders.'
  ],
  sources: [
    'ISO 1219-1, *Fluid power systems and components — Graphical symbols and circuit diagrams — Part 1: Graphical symbols*.',
    'ISO 4401, *Hydraulic fluid power — Four-port directional control valves — Mounting surfaces*.',
    'Esposito, *Fluid Power with Applications* — directional, pressure and flow-control valves; hydraulic motor circuits.',
    'Merritt, *Hydraulic Control Systems* — valve flow equations and valve-controlled motors.'
  ],
  sim: ['hy-motor-valves']
},

{
  id: 'counterbalance-brake-valves', parent: 'hydraulic-motor-circuits', title: 'Counterbalance valves and brakes', level: 3,
  short: 'A load that can drive the motor — a hanging load, a slewing crane, a machine on a slope — must be restrained while it moves and held when it stops. Counterbalance (overcentre) and brake valves meter the oil leaving the motor; a spring-applied, pressure-released brake holds it, because the motor itself leaks.',
  keywords: ['counterbalance valve', 'overcentre valve', 'over-centre', 'brake valve', 'pilot ratio', 'load holding', 'overrunning load', 'runaway', 'pilot-operated check valve', 'spring-applied brake', 'SAHR brake', 'multi-disc brake', 'brake release', 'shuttle valve', 'hose-burst protection', 'creep'],
  prereq: ['motor-control-valves', 'hydraulics:counterbalance-valve', 'hydraulics:load-holding'],
  related: ['hydraulic-motor-sizing', 'radial-piston-motors', 'motor-brakes', 'motors-conveyors-hoists', 'hydraulics:pilot-check', 'hydraulics:braking-circuits', 'hydraulics:lifts-cranes'],
  body: `
Most motor loads resist motion: a conveyor, a mixer, a pump. Some **drive** the motor: a winch lowering its hook, a crane's slew coming to a stop, a machine rolling down a slope. Then the motor turns into a pump, the load tries to run away, and the oil on the motor's inlet side is sucked into a vacuum. Such **overrunning** loads need a valve that restrains the oil leaving the motor, and a brake that holds the load when it stops.

### Why a pilot-operated check is not enough
A pilot-operated check valve blocks the load-holding line until pilot pressure opens it — fully. On a hanging load it opens, the load accelerates and overruns the pump, the pilot pressure collapses, the valve slams shut, the load stops dead, pressure rebuilds, the valve opens again: the load descends in jerks. Pilot checks suit loads that do not overrun.

### The counterbalance (overcentre) valve
A counterbalance valve is a relief valve in the load-holding line, with a check valve beside it for free flow when lifting. It is set **above** the pressure the load makes — typically about 1.3 times the highest load-induced pressure — so the load alone can never open it. It is opened by the load pressure **plus a pilot pressure from the opposite (lowering) line multiplied by the pilot ratio** $R$ (typically 3:1 to 10:1):

$$p_L + R\\,p_p \\ge p_{set}$$

For a motor, the pressure at the valve during lowering is the load's holding pressure plus the inlet pressure (the pump pushes too), so the pump needs only
$$p_p = \\frac{p_{set} - p_{L}}{1 + R}$$
With a 150 bar load, a 195 bar setting and $R = 3$: about 11 bar. If the load tries to run ahead of the pump, the inlet pressure falls, the valve closes a little and brakes it: the motor turns only as fast as the pump fills it. The load's energy — and the pump's — becomes **heat in the valve**, several kilowatts on a big winch.

**Pilot ratio**: a low ratio (about 3:1) is more stable with unstable, springy loads (long booms, cranes) but costs more pilot pressure and heat; a high ratio (8:1 or 10:1) wastes less but can oscillate. **Brake valves** for motors are counterbalance valves with damping built in; **dual** counterbalance valves on both lines serve slew drives and travel motors that overrun in both directions. Mount the valve **directly on the motor**, so a burst hose cannot drop the load.

### The brake holds — the motor leaks
Even with every valve closed, oil slips through the motor's clearances and the load **creeps**: 0.5 L/min of leakage turns a 1000 cm³/rev winch motor 0.5 rpm. So winches, slew drives and travel drives carry a **spring-applied, hydraulically released (SAHR)** multi-disc brake. Springs clamp it; pressure frees it (fully released at a pressure of the order of 10–30 bar, depending on the brake). It is fail-safe: lose pressure, and the brake applies. The release is taken from the lowering/lifting line through a **shuttle valve**, often with a restrictor and check so it releases slowly (after torque has built) and applies quickly. The directional valve's **float centre** (A and B to the tank) vents both the brake and the counterbalance pilot when the lever is released.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Load descends in jerks | Pilot check or too high a pilot ratio; no damping | Counterbalance valve with a lower ratio or damping |
| Load drifts down with the lever released | Brake not applying (trapped pilot pressure, closed-centre valve); worn brake | Float-centre valve; check brake release and discs |
| Cannot lower, or lowers only at high pump pressure | Counterbalance set too high; back-pressure on its spring chamber | Reset to about 1.3 × load pressure; vented valve |
| Hot oil when lowering | Normal: the load energy becomes heat | Size the cooler for lowering duty |

The simulation shows a winch with no valve, a pilot-operated check and a counterbalance valve, with and without a brake: lower, hold, and watch the pressures and the creep.

> [!warn] Never adjust a counterbalance valve or loosen its fittings with a load suspended: lower the load to the ground or block it first, apply the brake and release all pressure. Lifting equipment is regulated — load-holding valves, brakes and their tests follow the lifting-equipment rules of your country and ISO 4413.

> [!key] The counterbalance valve controls a load while it moves; the brake holds it when it stops. A hydraulic motor can do neither alone.
`,
  ideas: [
    'Overrunning loads drive the motor as a pump; without restraint they run away and the inlet cavitates.',
    'A counterbalance valve is set about 1.3 × the load pressure and opens by load pressure plus pilot pressure × pilot ratio.',
    'During lowering the pump supplies only the small pilot pressure; the load energy becomes heat in the valve.',
    'The motor leaks, so the load creeps: a spring-applied, pressure-released brake holds it.',
    'A float-centre directional valve vents brake and pilot so both act when the lever is released.'
  ],
  pitfalls: [
    'A pilot-operated check valve is a counterbalance valve — It opens fully on a small pilot pressure and gives jerky, uncontrolled lowering of an overrunning load.',
    'With a counterbalance valve the load is held safely without a brake — The valve holds the oil, but the motor leaks internally and the load creeps down.',
    'A higher pilot ratio is always better because it saves energy — High ratios make the circuit prone to oscillation with springy loads; choose the ratio for the load\'s stability.'
  ],
  formulas: [
    {
      name: 'Pressure a load makes on the holding side',
      expr: 'pL = 2*pi*T/Vg', tex: 'p_L = \\dfrac{2\\pi\\,T}{V_g}',
      vars: {
        pL: { name: 'load-induced pressure', q: 'pressure', unit: 'bar', tex: 'p_L' },
        T: { name: 'load torque at the motor shaft', q: 'torque', unit: 'N·m', value: 300 },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_g' }
      },
      note: 'Ideal (friction helps hold, so the real pressure is a little lower when holding).',
      stories: { pL: 'A load puts {T} on a {Vg} motor. What pressure does it make in the holding line?' }
    },
    {
      name: 'Pilot pressure to lower through a counterbalance valve',
      expr: 'pp = (ps - pL)/(1 + R)', tex: 'p_p = \\dfrac{p_{set} - p_L}{1 + R}',
      vars: {
        pp: { name: 'pump (pilot) pressure while lowering', q: 'pressure', unit: 'bar', tex: 'p_p' },
        ps: { name: 'counterbalance setting', q: 'pressure', unit: 'bar', value: 245, tex: 'p_{set}' },
        pL: { name: 'load-induced pressure', q: 'pressure', unit: 'bar', value: 188.5, tex: 'p_L' },
        R: { name: 'pilot ratio', value: 3 }
      },
      note: 'For a motor, whose load-port pressure while lowering is the load pressure plus the inlet pressure; friction ignored.',
      stories: { pp: 'A counterbalance valve set at {ps} holds a load making {pL}; its pilot ratio is {R}:1. What pump pressure lowers it?', R: 'Which pilot ratio lets a load of {pL} be lowered through a valve set at {ps} with only {pp} of pump pressure?' }
    },
    {
      name: 'Creep through the motor\'s leakage',
      expr: 'n = QL/Vg', tex: 'n = \\dfrac{Q_L}{V_g}',
      vars: {
        n: { name: 'creep speed of the shaft', q: 'frequency', unit: 'rpm' },
        QL: { name: 'motor leakage at the holding pressure', q: 'flowrate', unit: 'L/min', value: 0.5, tex: 'Q_L' },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_g' }
      },
      stories: { n: 'A {Vg} winch motor leaks {QL} at its holding pressure. How fast does the load creep with no brake?' }
    }
  ],
  examples: [
    {
      title: 'Setting a counterbalance valve',
      q: 'A winch puts 300 N·m on a 100 cm³/rev motor. Choose the counterbalance setting (1.3 × load pressure) and find the pump pressure needed to lower with a 3:1 and with an 8:1 pilot ratio.',
      steps: [
        'Load pressure: $p_L = 2\\pi \\times 300/(100\\times10^{-6}) = 18.8$ MPa = 188.5 bar.',
        'Setting: $1.3 \\times 188.5 = 245$ bar.',
        '3:1: $p_p = (245 - 188.5)/4 = 14.1$ bar. 8:1: $p_p = 56.5/9 = 6.3$ bar.'
      ],
      a: 'Set at 245 bar; lowering needs about 14 bar at 3:1 or 6 bar at 8:1.'
    },
    {
      title: 'Heat while lowering',
      q: 'The winch lowers at 30 L/min. With the 3:1 valve, the pressure at the valve is the load pressure plus the pilot pressure. How much heat does the valve make?',
      steps: [
        'Pressure at the valve: $188.5 + 14.1 = 203$ bar.',
        'Heat: $203 \\times 30/600 = 10$ kW — the load\'s potential energy plus the pump\'s input.'
      ],
      a: 'About 10 kW of heat in the valve while lowering.'
    },
    {
      title: 'Why a brake',
      q: 'A 1000 cm³/rev winch motor on a 300 mm drum leaks 0.5 L/min at its holding pressure. How fast does the rope creep without a brake?',
      steps: [
        '$n = Q_L/V_g = 500/1000 = 0.5$ rpm.',
        'Rope speed $0.5 \\times \\pi \\times 0.3 = 0.47$ m/min — about half a metre a minute.'
      ],
      a: 'About 0.5 m/min: a suspended load needs a brake.'
    }
  ],
  quiz: [
    { q: 'What opens a counterbalance valve?', choices: ['Load pressure plus pilot pressure × pilot ratio exceeding its setting', 'Load pressure alone exceeding its setting', 'The pump flow', 'An electric signal'], a: 0, why: 'It is set above the load pressure, so it opens only when the pump supplies pilot pressure from the other line.' },
    { q: 'Why is the counterbalance valve mounted directly on the motor?', choices: ['So a burst hose cannot let the load run away', 'To reduce its heat', 'To shorten the pilot line', 'Because it is part of the motor'], a: 0, why: 'Any hose between the valve and the motor is a hose whose failure drops the load.' },
    { q: 'A load makes 150 bar; the valve is set at 195 bar with a 4:1 pilot ratio. What pump pressure lowers it (motor, friction ignored)?', answer: 9, unit: 'bar', why: '(195 − 150)/(1 + 4) = 9 bar.' },
    { q: 'True or false: a spring-applied, hydraulically released brake applies if the hydraulic supply fails.', a: true, why: 'The springs clamp it; only pressure frees it — it fails safe.' },
    { q: 'The load drifts down while the lever is in neutral with a closed-centre valve. The likely cause?', choices: ['Pressure trapped by the closed centre keeps the brake released or the valve open', 'The pilot ratio is too low', 'The oil is too cold', 'The pump is too small'], a: 0, why: 'A float centre vents A and B so the brake applies and the pilot falls to zero.' }
  ],
  problems: [
    { q: 'A 250 cm³/rev motor holds a load of 600 N·m. What is the load-induced pressure, and the counterbalance setting at 1.3 times it?', answer: 196, unit: 'bar', tol: 0.02, hint: 'Give the setting.', steps: ['$p_L = 2\\pi \\times 600/(250\\times10^{-6}) = 15.1$ MPa = 150.8 bar.', 'Setting $1.3 \\times 150.8 = 196$ bar.'] }
  ],
  choose: {
    good: [
      'Counterbalance or brake valves, mounted on the motor, for every overrunning load: winches, slews, travel drives on slopes.',
      'A spring-applied, pressure-released brake wherever a load must be held with the pump stopped.',
      'Low pilot ratios for springy, unstable loads; high ratios for stable loads and less heat.'
    ],
    avoid: [
      'Pilot-operated check valves on overrunning motor loads (jerky lowering).',
      'Relying on valves alone to hold a suspended load (the motor leaks).',
      'Closed-centre directional valves with SAHR brakes and counterbalance valves.'
    ],
    check: [
      'Setting (about 1.3 × maximum load pressure) and the valve\'s flow rating.',
      'Pilot ratio against load stability; whether the valve is vented (back-pressure on its spring).',
      'Brake holding torque, release pressure range and maximum allowed pressure.',
      'Heat produced while lowering; hose-burst protection and the lifting rules that apply.'
    ]
  },
  applications: [
    'Winches and hoists on cranes, ships and recovery vehicles.',
    'Slew drives of cranes and excavators (dual counterbalance or brake valves).',
    'Travel drives of mobile machines descending slopes (brake valves in the motor).'
  ],
  sources: [
    'ISO 4413, *Hydraulic fluid power — General rules and safety requirements for systems and their components* — load holding and protection against hose failure.',
    'Esposito, *Fluid Power with Applications* — counterbalance and brake valves in motor circuits.',
    'ISO 1219-1, *Fluid power systems and components — Graphical symbols and circuit diagrams — Part 1: Graphical symbols*.'
  ],
  sim: ['hy-counterbalance']
},

{
  id: 'hydrostatic-transmissions', parent: 'hydraulic-motor-circuits', title: 'Hydrostatic transmissions', level: 3,
  short: 'A pump and a motor joined by two hoses make a gearbox with no steps: the speed ratio is set by their displacements. In the closed loop a variable, reversible pump drives the motor forwards, backwards and brakes it, with a charge pump, check and relief valves and a flushing valve around the loop.',
  keywords: ['hydrostatic transmission', 'HST', 'hydrostatic drive', 'closed loop', 'open loop', 'charge pump', 'charge pressure', 'flushing valve', 'loop flushing', 'over-centre pump', 'variable pump', 'variable motor', 'dynamic braking', 'anti-stall', 'power limiting', 'corner power', 'travel drive'],
  prereq: ['axial-piston-motors', 'motor-control-valves', 'hydraulics:hydrostatic-transmission'],
  related: ['hydraulic-power-unit', 'counterbalance-brake-valves', 'hydraulic-heat-noise', 'motors-vehicles', 'gearboxes', 'vfd-principle', 'hydraulics:mobile-hydraulics'],
  body: `
Couple a pump directly to a motor with two lines and you have a **hydrostatic transmission** (HST): the engine turns the pump, the pump's flow turns the motor, and the speed ratio is the ratio of their displacements, $n_m = n_p V_p\\,\\eta_v/V_m$. Make the pump variable and the ratio changes smoothly from zero to its maximum — a gearbox with no steps, no clutch and full torque at standstill, which is why tractors, loaders, harvesters, rollers, forklifts and mowers use one. It does for oil what a [[vfd-principle|variable-frequency drive]] does for an induction motor.

### Open loop and closed loop
- **Open loop**: the pump draws from the tank; a directional valve sends the flow to the motor and the return to the tank. Simple, one pump for several consumers, easy to cool — but speed and direction are made by throttling valves, and braking needs [[counterbalance-brake-valves|brake valves]].
- **Closed loop**: the motor's return goes straight back to the pump's inlet. The pump is **variable and reversible** (its swash plate swings through zero), so it sets speed and direction by itself; there is no directional valve. When the vehicle overruns, the motor pumps and drives the pump, which drives the engine: **dynamic braking** comes free. The tank is small because only leakage returns to it.

### The parts of a closed loop
| Element | Job | Typical values |
|---|---|---|
| Main pump, variable, over-centre | Sets flow and direction | 28–250 cm³/rev, 420–450 bar peak |
| Charge pump (on the same shaft) | Replaces the leakage, feeds the servo, cools | about a fifth of the main pump's displacement |
| Charge relief valve | Holds the low side at charge pressure | 20–30 bar |
| Two make-up check valves | Feed charge oil into whichever line is low | often combined with the high-pressure reliefs |
| Two high-pressure (crossport) reliefs | Limit the loop pressure in both directions | 400–450 bar |
| Flushing (shuttle) valve | Takes some hot oil from the low side to the case and cooler | a few L/min, with its own low relief |
| Case drains, cooler and filter | Return leakage and flushing oil to the tank | charge or return filtration 10 µm |

### Controls
The pump is stroked by a servo piston — from a lever, a hydraulic joystick, a proportional solenoid, or an **automotive** control that strokes with engine speed so the vehicle drives like one with an automatic gearbox. **Anti-stall (power limiting)** destrokes the pump when the load would pull the engine down. The motor may be fixed, **two-speed**, or **variable** with a pressure-dependent control that swings it back out on a slope. With pump and motor both variable, a small pump covers a wide speed range at constant power.

### Force, speed and corner power
Low speed and high force come from full motor displacement at the relief pressure; top speed from full pump flow into minimum motor displacement. The product of maximum pressure and maximum flow — the **corner power** — is usually two to four times the engine power, because the machine never needs both at once; anti-stall keeps the engine alive in between. Overall efficiencies are typically 75–85 % at the best point, less at the extremes: an HST is convenient and controllable rather than frugal, and its losses must be cooled.

In the simulation, drive a machine up and down a slope: push the joystick, swap the motor to high range, and watch the high-pressure side swap to the other line when the machine overruns downhill.

> [!warn] Towing a machine with a closed-loop drive can overheat or destroy the motor unless the maker's towing (bypass) procedure is followed; and a machine on a slope is held by its parking brake, not by the transmission. Before work, lower attachments, apply the brake, chock the wheels, stop the engine and release the loop pressure.

> [!key] A hydrostatic transmission is a stepless gearbox made of a pump and a motor: displacement ratio sets speed, pressure sets force, the closed loop reverses and brakes without valves, and a charge pump keeps the loop full and cool.
`,
  ideas: [
    'The speed ratio of a hydrostatic transmission is the ratio of pump to motor displacement, times the volumetric efficiencies.',
    'In a closed loop the reversible pump sets speed and direction; overrunning loads are braked through the pump and engine.',
    'A charge pump, charge relief, make-up checks, crossport reliefs and a flushing valve keep the loop full, safe and cool.',
    'Variable motors and anti-stall controls give a wide speed range at constant power without stalling the engine.',
    'Corner power (maximum pressure × maximum flow) is usually several times the engine power.'
  ],
  pitfalls: [
    'A closed loop needs no tank or cooler — Leakage, flushing oil and charge flow return to a tank, and 15–25 % of the power becomes heat that must be cooled.',
    'The transmission holds the machine on a slope when stopped — Leakage lets it roll; a spring-applied parking brake holds it.'
  ],
  formulas: [
    {
      name: 'Output speed of a hydrostatic transmission',
      expr: 'nm = np*Vp*etav/Vm', tex: 'n_m = \\dfrac{n_p\\,V_p\\,\\eta_v}{V_m}',
      vars: {
        nm: { name: 'motor speed', q: 'frequency', unit: 'rpm', tex: 'n_m' },
        np: { name: 'pump (engine) speed', q: 'frequency', unit: 'rpm', value: 2400, tex: 'n_p' },
        Vp: { name: 'pump displacement (as set)', q: 'displacement', unit: 'cm³/rev', value: 45, tex: 'V_p' },
        etav: { name: 'volumetric efficiency of pump and motor together', q: 'ratio', unit: '%', value: 90, tex: '\\eta_v' },
        Vm: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 80, tex: 'V_m' }
      },
      stories: { nm: 'An engine at {np} drives a pump set to {Vp}; the motor is {Vm} and the transmission\'s volumetric efficiency {etav}. How fast does the motor turn?', Vp: 'To what displacement must the pump stroke so that a {Vm} motor turns at {nm} with the engine at {np} ({etav})?' }
    },
    {
      name: 'Output torque',
      expr: 'T = Vm*dp*etahm/(2*pi)', tex: 'T = \\dfrac{V_m\\,\\Delta p\\,\\eta_{hm}}{2\\pi}',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        Vm: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 80, tex: 'V_m' },
        dp: { name: 'loop pressure difference', q: 'pressure', unit: 'bar', value: 350, tex: '\\Delta p' },
        etahm: { name: 'motor hydromechanical efficiency', q: 'ratio', unit: '%', value: 92, tex: '\\eta_{hm}' }
      },
      stories: { T: 'A {Vm} motor works at a loop pressure difference of {dp} ({etahm}). What torque does it give?' }
    },
    {
      name: 'Vehicle speed',
      expr: 'v = pi*Dw*nm/ig', tex: 'v = \\dfrac{\\pi\\,D_w\\,n_m}{i}',
      vars: {
        v: { name: 'vehicle speed', q: 'speed', unit: 'km/h' },
        Dw: { name: 'wheel rolling diameter', q: 'length', unit: 'm', value: 1.0, tex: 'D_w' },
        nm: { name: 'motor speed', q: 'frequency', unit: 'rpm', value: 1215, tex: 'n_m' },
        ig: { name: 'final-drive ratio', value: 20, tex: 'i' }
      },
      stories: { v: 'A motor turning at {nm} drives {Dw} wheels through a {ig}:1 final drive. How fast does the machine go?' }
    },
    {
      name: 'Corner power',
      expr: 'Pc = dp*Q', tex: 'P_c = \\Delta p_{\\max}\\,Q_{\\max}',
      vars: {
        Pc: { name: 'corner power', q: 'power', unit: 'kW', tex: 'P_c' },
        dp: { name: 'maximum loop pressure', q: 'pressure', unit: 'bar', value: 420, tex: '\\Delta p_{\\max}' },
        Q: { name: 'maximum pump flow', q: 'flowrate', unit: 'L/min', value: 108, tex: 'Q_{\\max}' }
      },
      stories: { Pc: 'A transmission reaches {dp} and {Q} (never together). What is its corner power?' }
    }
  ],
  examples: [
    {
      title: 'A compact loader\'s drive',
      q: 'An engine at 2400 rpm drives a 45 cm³/rev pump; an 80 cm³/rev motor drives 1.0 m wheels through a 20:1 final drive (95 %). Volumetric efficiency of the loop 90 %, motor η_hm 92 %, loop relief 420 bar with 25 bar charge pressure. Find the top speed and the largest tractive force.',
      steps: [
        'Motor speed: $2400 \\times 45 \\times 0.9/80 = 1215$ rpm; vehicle $\\pi \\times 1.0 \\times 1215/20 = 191$ m/min = 11.5 km/h.',
        'Largest pressure difference $420 - 25 = 395$ bar: $T = 80\\times10^{-6} \\times 395\\times10^{5} \\times 0.92/(2\\pi) = 463$ N·m.',
        'Wheel torque $463 \\times 20 \\times 0.95 = 8790$ N·m; force $8790/0.5 = 17.6$ kN.'
      ],
      a: 'About 11.5 km/h and 17.6 kN — but not together: that would be 56 kW, more than a small engine gives, so anti-stall limits it.'
    },
    {
      title: 'High range',
      q: 'The same machine with a two-speed motor switched to 40 cm³/rev. What are the top speed and the largest force now?',
      steps: [
        'Half the motor displacement doubles the speed: 23 km/h.',
        'It halves the torque: 8.8 kN.'
      ],
      a: 'About 23 km/h and 8.8 kN: a road gear.'
    }
  ],
  quiz: [
    { q: 'How is a closed-loop hydrostatic drive reversed?', choices: ['The pump\'s swash plate is swung through zero to the other side', 'A 4/3 directional valve changes over', 'The engine turns backwards', 'The motor is swapped'], a: 0, why: 'An over-centre pump reverses its flow direction; no directional valve is needed.' },
    { q: 'What is the charge pump for?', choices: ['It replaces leakage, keeps the low side pressurised and feeds the controls and cooling flow', 'It drives the motor at high speed', 'It raises the relief pressure', 'It brakes the vehicle'], a: 0, why: 'The loop loses oil through case leakage and flushing; charge oil at 20–30 bar replaces it and prevents cavitation.' },
    { q: 'A machine rolls downhill faster than the pump setting. Where is the high pressure?', choices: ['In the line from the motor back to the pump — the motor is pumping', 'In the line from the pump to the motor, as usual', 'In the case drain', 'Nowhere: pressure is zero when coasting'], a: 0, why: 'Overrunning, the motor drives oil into the pump, which motors the engine — dynamic braking.' },
    { q: 'An engine at 2000 rpm drives a 60 cm³/rev pump at full stroke into a 120 cm³/rev motor; loop volumetric efficiency 90 %. What is the motor speed?', answer: 900, unit: 'rpm', why: '2000 × 60 × 0.9/120 = 900 rpm.' }
  ],
  problems: [
    { q: 'A 110 cm³/rev motor works at 380 bar with η_hm = 93 %. What torque does it give?', answer: 619, unit: 'N·m', tol: 0.01, steps: ['$T = 110\\times10^{-6} \\times 380\\times10^{5} \\times 0.93/(2\\pi)$', '$= 619$ N·m.'] }
  ],
  choose: {
    good: [
      'Mobile machines that shuttle forwards and backwards at variable speed: loaders, forklifts, rollers, mowers, harvesters.',
      'Full torque from standstill, stepless speed and inching control without a clutch.',
      'Drives where dynamic braking through the engine is wanted.'
    ],
    avoid: [
      'Long runs at steady high speed, where a mechanical gearbox is more efficient.',
      'Very low-cost machines where a simple open-loop valve drive will do.',
      'Towing without the maker\'s bypass procedure.'
    ],
    check: [
      'Corner power against engine power, and anti-stall control.',
      'Charge pump size, charge and relief settings, flushing and cooling.',
      'Maximum motor speed at minimum displacement and the final-drive ratio.',
      'Parking brake and behaviour on slopes; filtration for piston units.'
    ]
  },
  applications: [
    'Travel drives of wheel loaders, telehandlers, harvesters, road rollers and sprayers.',
    'Winch and slew drives with closed-loop control; drum drives of concrete mixer trucks.',
    'Industrial drives needing reversing, stepless speed and braking, such as test rigs.'
  ],
  sources: [
    'Esposito, *Fluid Power with Applications* — hydrostatic transmissions, open and closed circuits.',
    'Merritt, *Hydraulic Control Systems* — pump-controlled motors and their dynamics.',
    'ISO 4409, *Hydraulic fluid power — Positive-displacement pumps, motors and integral transmissions — Methods of testing and presenting basic steady-state performance*.'
  ],
  sim: ['hy-hydrostatic']
},

{
  id: 'hydraulic-fluids-filtration', parent: 'hydraulic-motor-circuits', title: 'Hydraulic fluids and filtration', level: 2,
  short: 'The oil transmits power, lubricates, seals the clearances and carries away heat and dirt. Its viscosity must stay in the motor\'s window over the temperature range, and its cleanliness — counted by the ISO 4406 code — decides how long pumps, motors and valves last. Water and air are contaminants too.',
  keywords: ['hydraulic oil', 'ISO VG', 'viscosity', 'viscosity index', 'HM', 'HV', 'fire-resistant fluid', 'biodegradable fluid', 'ISO 4406', 'cleanliness code', 'particle count', 'beta ratio', 'filter rating', 'water in oil', 'ppm', 'aeration', 'oil analysis', 'breather', 'kidney loop'],
  prereq: ['hydraulic-power-unit', 'hydraulics:hydraulic-oils', 'hydraulics:iso-4406'],
  related: ['hydraulic-heat-noise', 'axial-piston-motors', 'vane-motors-hyd', 'maintenance-diagnostics', 'hydraulics:filtration', 'hydraulics:contamination', 'hydraulics:viscosity-temperature', 'hydraulics:air-in-oil', 'hydraulics:fire-resistant-fluids', 'hydraulics:fluid-selection'],
  body: `
The oil in a hydraulic system has five jobs: carry the power, lubricate every sliding part, **seal** the clearances inside pumps and motors (a few micrometres), carry heat to the tank and cooler, and carry dirt to the filters. Most failures of hydraulic motors are failures of the oil.

### Kinds of fluid
Most systems use **mineral hydraulic oils** with anti-wear additives (HM oils in the ISO 6743-4 classification) or with viscosity-index improvers for outdoor machines (HV). Where fire is a danger — steelworks, mines, die casting — **fire-resistant fluids** replace them: water–glycols (HFC) and synthetic esters (HFD), which need compatible seals and often derated pumps and motors. Near water and soil, **environmentally acceptable fluids** (synthetic esters, polyglycols and polyalphaolefins, classified in ISO 15380) are used. Never mix fluid types without the maker's approval.

### Viscosity: the window
The ISO VG grade is the viscosity at 40 °C in mm²/s (cSt): VG 32, 46 and 68 are the common ones. Viscosity falls steeply with temperature ([[?exponential|roughly exponentially]]): a VG 46 oil of viscosity index 100 has about 570 mm²/s at 0 °C, 46 at 40 °C and 11 at 80 °C. Pumps and motors want it in a window — typical data for piston units:

| Viscosity | Meaning | VG 46 reaches it at about |
|---|---|---|
| 1000 mm²/s | Upper limit for a cold start (short) | −6 °C |
| 16–36 mm²/s | Best efficiency and life | 46–65 °C |
| 10 mm²/s | Lower limit (brief, at the hottest point) | 83 °C |

Too thick: the pump cavitates at start, the motor's friction and pressure losses rise. Too thin: leakage rises (the motor slows and heats), the lubricating film breaks and wear starts. Choose the grade so that the **working temperature** puts the oil in the window: VG 32 for cool or cold-climate machines, VG 46 for most industrial units, VG 68 for hot ones.

### Cleanliness: ISO 4406
The code counts particles per millilitre larger than **4, 6 and 14 µm(c)** and gives each count a scale number; each step up **doubles** the count ([[?logarithm|a base-2 logarithmic scale]]). Code 16 means 320–640 particles per mL, code 13 means 40–80. So **18/16/13** is roughly 1300–2500 particles ≥ 4 µm, 320–640 ≥ 6 µm and 40–80 ≥ 14 µm per mL. Typical targets: servo valves 16/14/11 or better; proportional valves 17/15/12; piston pumps and motors 18/16/13; gear and vane units 19/17/14 — follow the component maker. **New oil** from a drum is often dirtier than that: fill through a filter.

Filters are rated by their **beta ratio** $\\beta_x(c)$ from the multi-pass test (ISO 16889): particles of size $x$ upstream divided by those downstream. $\\beta = 200$ removes 99.5 % per pass, $\\beta = 1000$ 99.9 %. Dirt keeps entering — through breathers, cylinder rod seals, open tanks during service — and is generated by wear; the filters and the flow through them set the level at which ingress and removal balance. In the simulation, change the filter, the flow and the dirt coming in, and watch the code settle.

### Water and air
**Water** dissolves in oil up to a saturation level of a few hundred ppm (more when warm); beyond it the oil turns milky. Water corrodes, washes out additives, speeds oxidation and shortens bearing life; keep it well below saturation (a common target is below half of it) with sealed tanks, desiccant breathers, water-absorbing elements or vacuum dehydrators. **Air** dissolves too — about 8–9 % by volume at atmospheric pressure — harmlessly until it comes out of solution; **entrained** bubbles make the drive spongy and noisy, lower the oil's stiffness and cause micro-dieseling that darkens the oil (see [[hydraulic-heat-noise]]).

> [!tip] Take an oil sample from a live, turbulent line at operating temperature, into a clean bottle, and trend the results: particle code, water (ppm), viscosity, acid number and wear metals. A rising code or wear metal tells you a component is failing before it stops.

> [!warn] Sampling and filter changes are done on running or pressurised systems only through the fittings designed for it; otherwise stop, lock out and depressurise first. Hot oil burns; oil under pressure can be injected through the skin — seek emergency medical care at once.

> [!key] Keep the oil in its viscosity window, keep it clean to the ISO 4406 code the components need, and keep water and air out: the motor's life depends on it.
`,
  ideas: [
    'The oil transmits power, lubricates, seals clearances, and carries heat and dirt away.',
    'The ISO VG number is the viscosity at 40 °C; the working temperature must put the oil in the motor\'s viscosity window.',
    'ISO 4406 codes count particles ≥ 4, 6 and 14 µm per mL; each code step doubles the count.',
    'A filter\'s beta ratio is upstream over downstream count; β = 200 removes 99.5 % per pass.',
    'Water and entrained air are contaminants: they cause corrosion, wear, spongy control and noise.'
  ],
  pitfalls: [
    'New oil is clean — Oil from drums or bulk tanks is often dirtier than a piston motor tolerates; fill through a filter.',
    'The thicker the oil, the better it protects — Too thick causes cavitation at start and high losses; the oil must be in its window at the working temperature.',
    'A clean filter element means clean oil — It may be bypassing, or the filter may be too coarse; only a particle count tells the cleanliness.'
  ],
  formulas: [
    {
      name: 'Beta ratio of a filter',
      expr: 'beta = Nu/Nd', tex: '\\beta_x = \\dfrac{N_u}{N_d}',
      vars: {
        beta: { name: 'beta ratio at size x', tex: '\\beta_x' },
        Nu: { name: 'particles ≥ x upstream', q: false, unit: 'per mL', value: 20000, tex: 'N_u' },
        Nd: { name: 'particles ≥ x downstream', q: false, unit: 'per mL', value: 20, tex: 'N_d' }
      },
      stories: { beta: 'A filter test counts {Nu} upstream and {Nd} downstream. What is its beta ratio?' }
    },
    {
      name: 'Capture efficiency',
      expr: 'E = 1 - 1/beta', tex: 'E = 1 - \\dfrac{1}{\\beta_x}',
      vars: {
        E: { name: 'fraction captured per pass', q: 'ratio', unit: '%' },
        beta: { name: 'beta ratio', value: 200, tex: '\\beta_x' }
      },
      stories: { E: 'A filter has β = {beta}. What fraction of the particles does it capture in one pass?', beta: 'What beta ratio captures {E} per pass?' }
    },
    {
      name: 'Particle count where ingress and filtration balance',
      expr: 'N = G/(Q*E)', tex: 'N = \\dfrac{G}{Q\\,E}',
      vars: {
        N: { name: 'steady particle count', q: false, unit: 'per mL' },
        G: { name: 'particles entering the system', q: false, unit: 'per min', value: 2e7 },
        Q: { name: 'flow through the filter', q: false, unit: 'mL/min', value: 40000 },
        E: { name: 'capture efficiency of the filter', q: 'ratio', unit: '%', value: 99.5 }
      },
      note: 'A well-mixed tank with one filter; each size class separately.',
      stories: { N: 'Dirt enters at {G} and {Q} passes a filter that captures {E}. What particle count does the oil settle at?', Q: 'How much flow must pass a filter capturing {E} to hold the count at {N} with {G} entering?' }
    }
  ],
  examples: [
    {
      title: 'Reading a code',
      q: 'An oil sample reads 17/15/12. About how many particles per mL are there larger than 4, 6 and 14 µm? Is it clean enough for a piston motor asking for 18/16/13?',
      steps: [
        'Code 13 is 40–80 per mL, so code 12 is 20–40, 15 is 160–320 and 17 is 640–1300.',
        'Each number is one step (half the count) below 18/16/13, so the oil is about twice as clean as required.'
      ],
      a: 'About 640–1300, 160–320 and 20–40 per mL: yes, cleaner than required.'
    },
    {
      title: 'Choosing a filter and a flow',
      q: '2 × 10⁷ particles ≥ 6 µm enter a system each minute. With 40 L/min through a return filter capturing 99.5 % of them, where does the count settle? What if the filter captured only 90 %?',
      steps: [
        '$N = G/(Q E) = 2\\times10^{7}/(40\\,000 \\times 0.995) = 502$ per mL — code 16.',
        'At 90 %: $2\\times10^{7}/(40\\,000 \\times 0.9) = 556$ per mL — still code 16: at this size a coarser filter still captures most.',
        'Halving the ingress (better breather, rod wipers) halves the count: 251 per mL, code 15.'
      ],
      a: 'About 500 per mL (code 16); ingress matters as much as the filter.'
    }
  ],
  quiz: [
    { q: 'An ISO 4406 code rises from 18/16/13 to 20/18/15. The particle counts have…', choices: ['roughly quadrupled', 'risen by about 10 %', 'doubled', 'risen twentyfold'], a: 0, why: 'Each code step doubles the count; two steps are four times.' },
    { q: 'A filter captures 99.9 % of 10 µm particles in one pass. What is its β₁₀?', answer: 1000, why: 'E = 1 − 1/β, so β = 1/(1 − 0.999) = 1000.' },
    { q: 'An outdoor machine works from −15 °C to 70 °C oil temperature. What helps most to keep the viscosity in the window?', choices: ['A high-viscosity-index (HV) oil', 'A thicker grade', 'A finer filter', 'A larger tank'], a: 0, why: 'A high viscosity index flattens the viscosity–temperature curve, keeping the oil pumpable cold and thick enough hot.' },
    { q: 'True or false: milky oil usually means water or air in the oil.', a: true, why: 'Fine water droplets or air bubbles scatter light; find the source and treat it.' }
  ],
  problems: [
    { q: 'A filter test counts 15 000 particles ≥ 10 µm per mL upstream and 75 downstream. What is β₁₀, and what fraction does it capture?', answer: 99.5, unit: '%', tol: 0.001, hint: 'Give the capture efficiency.', steps: ['$\\beta_{10} = 15\\,000/75 = 200$.', '$E = 1 - 1/200 = 0.995$ = 99.5 %.'] }
  ],
  choose: {
    good: [
      'Anti-wear mineral oil (HM) of the grade that puts the working temperature in the viscosity window.',
      'HV oils for machines working outdoors over a wide temperature range.',
      'Fine return or pressure filtration (β ≥ 200 at 10 µm or finer) and good breathers for piston motors and proportional valves.'
    ],
    avoid: [
      'Mixing fluid types, or fire-resistant fluids with seals and components not rated for them.',
      'Filling with unfiltered new oil.',
      'Running with bypassing filters, open tanks or missing breather filters.'
    ],
    check: [
      'The viscosity window and cleanliness code the motors, pumps and valves require.',
      'Fluid type needed for fire safety or the environment, and seal compatibility.',
      'Filter ratings, positions, bypass settings and indicators.',
      'Water content and an oil-analysis plan.'
    ]
  },
  applications: [
    'Condition monitoring by oil analysis on mobile fleets, presses and wind turbines.',
    'Offline (kidney-loop) filtration and dehydrators on large industrial units.',
    'Environmentally acceptable fluids on forestry, marine and dredging machines.'
  ],
  sources: [
    'ISO 4406, *Hydraulic fluid power — Fluids — Method for coding the level of contamination by solid particles*.',
    'ISO 16889, *Hydraulic fluid power — Filters — Multi-pass method for evaluating filtration performance of a filter element*.',
    'ISO 6743-4, *Lubricants, industrial oils and related products (class L) — Classification — Part 4: Family H (hydraulic systems)*; ISO 15380 (environmentally acceptable hydraulic fluids).',
    'Esposito, *Fluid Power with Applications* — hydraulic fluids, viscosity and contamination control.'
  ],
  sim: ['hy-cleanliness', 'hy-heat']
},

{
  id: 'hydraulic-heat-noise', parent: 'hydraulic-motor-circuits', title: 'Heat and noise in hydraulic systems', level: 2,
  short: 'Every loss in a hydraulic drive — in pump, motor, valves, relief and pipes — ends as heat in the oil, and the tank sheds only a little of it: above about a kilowatt a cooler is needed. Pumps, valves, cavitation and air make the noise. Both are symptoms to be designed out and listened to.',
  keywords: ['heat balance', 'oil temperature', 'cooler sizing', 'air-blast cooler', 'water cooler', 'reservoir heat dissipation', 'warm-up', 'oxidation', 'noise', 'sound level', 'cavitation', 'aeration', 'micro-dieseling', 'suction pressure', 'pressure ripple', 'dB(A)'],
  prereq: ['hydraulic-power-unit', 'hydraulics:heat-coolers', 'hydraulics:cavitation'],
  related: ['hydraulic-fluids-filtration', 'motor-control-valves', 'motor-noise', 'motor-heating', 'hydraulics:energy-losses-heat', 'hydraulics:air-in-oil', 'hydraulics:npsh', 'physics:specific-heat', 'physics:newtons-law-of-cooling'],
  body: `
### Every loss is heat
Whatever power goes into the pump and does not come out of the motor's shaft ends up in the oil: the pump's and the motor's own losses (5–15 % each), the pressure drop of every valve and hose ($\\Delta p\\,Q$), the flow over the relief valve at its full setting, and — on a winch or a crane — the whole energy of every load lowered through a counterbalance valve. A valve-controlled circuit with a fixed pump commonly turns 30–60 % of its input into heat at part load; a load-sensing or variable-pump circuit 15–30 %.

### Where the heat goes
The oil warms until what leaves equals what comes in. The **tank** sheds heat by convection from its wetted walls, roughly $P = k\\,A\\,\\Delta T$ with $k \\approx 10$–15 W/(m²·K) in still air: a 250 L tank with 2.2 m² of surface, 30 K above the air, sheds only about 0.8 kW. Pipes add a little. Above about a kilowatt of losses a **cooler** is needed — an air–oil cooler with a fan (electric, or a hydraulic motor whose speed follows the temperature) or a water–oil plate or shell-and-tube cooler. It is sized by its **specific capacity** in kW per kelvin of difference between the oil entering and the air (or water) entering: to remove 8 kW with oil at 60 °C and air at 35 °C needs 0.32 kW/K. Put it in the return or in a separate low-pressure loop, protect it from return-line pressure peaks with a bypass check, and give it a thermostat so the oil warms quickly.

### How hot is too hot
Keep the bulk oil at about **40–60 °C**. Above 60 °C mineral oil oxidises faster — a long-standing rule of thumb is that its life halves for every 10 °C more — varnish forms, nitrile seals harden above about 90–100 °C, and the viscosity falls out of the window, so leakage and wear rise and the motors slow. Warm-up time follows from the oil's heat capacity (about 1.9 kJ/(kg·K) for mineral oil, [[physics:specific-heat|specific heat]]): 217 kg of oil gaining 30 K from 8 kW of losses takes about 26 minutes, more with the steel of the tank. In cold climates heaters, a thinner or HV oil and an unloaded warm-up protect the pump. The simulation shows the temperature climbing to its balance and the viscosity sliding through the window.

### Noise
A power unit of a few kilowatts typically makes 65–85 dB(A) at 1 m. The sources:

| Source | Sound | Cure |
|---|---|---|
| Pump pressure ripple (piston or tooth frequency) | Whine, tonal | 4-pole (1500 rpm) motor; quieter pump types (internal gear, screw); pulsation damper |
| Cavitation at the pump inlet | Rattle like gravel, rising with speed | Larger, shorter suction line; flooded inlet; warmer oil; no fine suction strainer |
| Aeration (air drawn in) | Whine and irregular noise, foam, spongy control | Tight suction joints and shaft seals; returns below the oil level; oil level; tank dwell time |
| Throttling valves, relief valves | Hiss, squeal | Smaller pressure drops; pump unloading; relief set clear of the working pressure |
| Pipes and structure | Hum carried to panels and floors | Hose sections, clamps with rubber, isolating mounts, damped bell housings |

### Cavitation and aeration
**Cavitation** is the formation of vapour and gas bubbles where the pressure falls too low — at a starved pump inlet or in the jet of a valve with a large pressure drop. The bubbles collapse violently when the pressure rises again, eroding metal and making the gravel noise. Keep the pump inlet above the maker's limit (often about 0.8 bar absolute) and the suction velocity near 0.5–1.2 m/s; cold, thick oil in a narrow suction line is the classic trap at start-up. **Aeration** is air drawn in from outside — through a loose suction joint, a low oil level, a vortex at the suction or a return pouring onto the surface. Compressed quickly, air bubbles heat enough to burn the oil around them (**micro-dieseling**), darkening it.

> [!warn] Oil above 60 °C burns skin, and hydraulic components and coolers can be hotter still. Let the system cool, lock it out and release the pressure before touching coolers, hoses or fittings; wear hearing protection near loud power units.

> [!key] Losses become heat; a tank sheds only about a kilowatt, so coolers do the rest. Noise tells the story: whine is the pump, gravel is cavitation, foam is air — each has a cause you can fix.
`,
  ideas: [
    'All losses — pump, motor, valves, relief, pipes, lowered loads — become heat in the oil.',
    'A tank sheds roughly k·A·ΔT with k ≈ 10–15 W/(m²·K): about a kilowatt; beyond that a cooler is needed.',
    'Coolers are sized in kW per kelvin of difference between entering oil and entering air or water.',
    'Keep oil at about 40–60 °C: hotter oil oxidises faster and leaves the viscosity window.',
    'Pump ripple whines, cavitation rattles, aeration foams: each points to a cause.'
  ],
  pitfalls: [
    'A bigger tank is the cure for hot oil — Its surface grows slowly with its volume; a 1000 L tank sheds only a few kilowatts. Reduce the losses first, then fit a cooler.',
    'Cavitation and aeration are the same thing — Cavitation is bubbles forming from the oil at low pressure; aeration is air drawn in from outside. Both are noisy, but the cures differ.'
  ],
  formulas: [
    {
      name: 'Heat made by the losses',
      expr: 'Ph = P*(1 - eta)', tex: 'P_h = P\\,(1 - \\eta)',
      vars: {
        Ph: { name: 'heat into the oil', q: 'power', unit: 'kW', tex: 'P_h' },
        P: { name: 'power into the pump', q: 'power', unit: 'kW', value: 30 },
        eta: { name: 'efficiency of the whole drive', q: 'ratio', unit: '%', value: 70, tex: '\\eta' }
      },
      stories: { Ph: 'A {P} drive is {eta} efficient overall. How much heat goes into the oil?' }
    },
    {
      name: 'Heat shed by the tank',
      expr: 'Pt = k*A*dT', tex: 'P_t = k\\,A\\,\\Delta T',
      vars: {
        Pt: { name: 'heat shed by the tank', q: 'power', unit: 'W', tex: 'P_t' },
        k: { name: 'heat transfer coefficient (still air ≈ 10–15)', q: 'heattransfer', unit: 'W/(m²·K)', value: 12 },
        A: { name: 'wetted surface of the tank', q: 'area', unit: 'm²', value: 2.4 },
        dT: { name: 'oil temperature above the air', q: 'dtemp', unit: 'K', value: 30, tex: '\\Delta T' }
      },
      stories: { Pt: 'A tank of {A} runs {dT} above the air (k = {k}). How much heat does it shed?', dT: 'How far above the air must a tank of {A} (k = {k}) run to shed {Pt}?' }
    },
    {
      name: 'Warm-up time',
      expr: 't = m*c*dT/P', tex: 't = \\dfrac{m\\,c\\,\\Delta T}{P}',
      vars: {
        t: { name: 'time to warm up', q: 'time', unit: 'min' },
        m: { name: 'mass of oil', q: 'mass', unit: 'kg', value: 217.5 },
        c: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.9 },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 30, tex: '\\Delta T' },
        P: { name: 'heating power (losses)', q: 'power', unit: 'kW', value: 8 }
      },
      note: 'Ignores the heat shed on the way and the steel of the tank, which slow it down.',
      stories: { t: '{m} of oil receives {P} of losses. How long until it is {dT} warmer?' }
    },
    {
      name: 'Cooler duty from its specific capacity',
      expr: 'Pc = P1*dT', tex: 'P_c = P_1\\,\\Delta T_{in}',
      vars: {
        Pc: { name: 'heat removed by the cooler', q: 'power', unit: 'kW', tex: 'P_c' },
        P1: { name: 'specific cooling capacity', unit: 'W/K', value: 320, tex: 'P_1' },
        dT: { name: 'oil inlet minus air (or water) inlet temperature', q: 'dtemp', unit: 'K', value: 25, tex: '\\Delta T_{in}' }
      },
      stories: { P1: 'A cooler must remove {Pc} with oil entering {dT} above the cooling air. What specific capacity does it need?', Pc: 'A cooler of {P1} works with a {dT} difference. How much heat does it remove?' }
    }
  ],
  examples: [
    {
      title: 'Does it need a cooler?',
      q: 'A 30 kW drive is 70 % efficient. Its 250 L tank has 2.4 m² of wetted surface (k = 12 W/(m²·K)). The air is at 35 °C and the oil should not exceed 60 °C. Size the cooler.',
      steps: [
        'Heat: $30 \\times (1 - 0.70) = 9$ kW.',
        'Tank at 25 K above the air: $12 \\times 2.4 \\times 25 = 720$ W.',
        'Cooler: $9 - 0.72 = 8.3$ kW at $60 - 35 = 25$ K → $8.3/25 = 0.33$ kW/K.'
      ],
      a: 'An air–oil cooler of about 0.33 kW/K (330 W/K) with a margin for dirt on its fins.'
    },
    {
      title: 'Warm-up',
      q: 'The same 250 L of oil (870 kg/m³, 1.9 kJ/(kg·K)) starts at 25 °C with 8 kW of losses. Roughly how long until it reaches 55 °C?',
      steps: [
        'Mass $0.25 \\times 870 = 217.5$ kg.',
        '$t = 217.5 \\times 1.9 \\times 30/8 = 1550$ s ≈ 26 min (longer in practice: the tank\'s steel warms too and heat leaks away).'
      ],
      a: 'Roughly half an hour.'
    }
  ],
  quiz: [
    { q: 'A relief valve passes 20 L/min at 200 bar continuously. How much heat does it make?', answer: 6.67, unit: 'kW', why: '200 × 20/600 = 6.67 kW — all of it heat.' },
    { q: 'A pump makes a noise like gravel that gets worse when the oil is cold. The likely cause?', choices: ['Cavitation from a restricted suction', 'A worn electric motor bearing', 'Too large a tank', 'The relief valve set too low'], a: 0, why: 'Cold, thick oil in the suction line lowers the inlet pressure below the limit, forming bubbles that collapse noisily.' },
    { q: 'Why is a four-pole (1500 rpm) motor often chosen for a power unit instead of a two-pole (3000 rpm) one?', choices: ['The pump runs slower and quieter, with better suction', 'It is always cheaper', 'It gives more flow per displacement', 'It needs no coupling'], a: 0, why: 'Noise and cavitation risk rise with pump speed; a larger pump at 1500 rpm is quieter.' },
    { q: 'True or false: doubling a tank\'s volume doubles the heat it can shed.', a: false, why: 'Heat shed depends on surface area, which grows only as the volume to the power 2/3 (about 1.6 times).' }
  ],
  problems: [
    { q: 'A cooler must remove 12 kW; oil enters at 55 °C and cooling air at 30 °C. What specific capacity does it need?', answer: 480, unit: 'W/K', tol: 0.01, steps: ['$\\Delta T_{in} = 55 - 30 = 25$ K.', '$P_1 = 12\\,000/25 = 480$ W/K.'] }
  ],
  choose: {
    good: [
      'Variable or load-sensing pumps and unloading circuits: less heat to remove in the first place.',
      'Air–oil coolers with thermostatic fans on mobile machines; water–oil coolers where cooling water is available.',
      'Four-pole motors, low-noise pumps, hose sections and isolating mounts where people work nearby.'
    ],
    avoid: [
      'Fixed pumps blowing over the relief valve during long idle periods.',
      'Fine suction strainers and long, narrow suction lines (cold-start cavitation).',
      'Return lines ending above the oil level (foam and aeration).'
    ],
    check: [
      'The heat balance over the real duty cycle, including lowering loads.',
      'Cooler capacity at the hottest ambient, fouling margin and pressure rating.',
      'Inlet pressure at the pump at the coldest start.',
      'Sound level against the workplace noise limits of your country.'
    ]
  },
  applications: [
    'Cooling packages of mobile machines, combining engine, charge-air and hydraulic oil coolers.',
    'Quiet power units for machine tools and test benches.',
    'Diagnosing pumps by sound, temperature and oil condition during maintenance.'
  ],
  sources: [
    'ISO 4413, *Hydraulic fluid power — General rules and safety requirements for systems and their components* — temperature, noise and the power unit.',
    'Esposito, *Fluid Power with Applications* — heat generation, heat exchangers and pump cavitation.',
    'ISO 4406, *Hydraulic fluid power — Fluids — Method for coding the level of contamination by solid particles*.'
  ],
  sim: ['hy-heat']
}

);
