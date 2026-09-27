/* HYPER-PNEUMATICS · content/applications.js — Applications: pneumatics at work.
 * Topic applications-pneu: factory automation, pick and place, air tools, air brakes, pneumatic
 * conveying, tube systems, tyres and air suspension, medical and dental air, aircraft, soft robotics.
 * Simulations in sims/applications.js (prefix app-). */
Hyper.add(

{
  id: 'factory-automation', parent: 'applications-pneu', title: 'Factory automation', level: 1,
  short: 'Why compressed air still drives most of the simple end-to-end motions in factories — cheap, fast, robust and safe against overload — what a typical pneumatic machine is made of, and where an electric axis does better.',
  keywords: ['factory automation', 'industrial automation', 'machine building', 'assembly line', 'valve terminal', 'pneumatic vs electric', 'end-to-end motion', 'two-position', 'overload', 'energy efficiency', 'PLC'],
  prereq: ['pneumatic-cylinder', 'air-consumption', 'cost-of-compressed-air'],
  related: ['pick-and-place', 'pneumatic-vs-electric', 'valve-terminals', 'plc-control', 'sensors-pneu', 'grippers', 'soft-start', 'rodless-guided', 'hydraulics:hydraulics-vs-alternatives', 'physics:efficiency'],
  body: `
Walk along an assembly or packaging line and watch what moves: most of it only goes from one position to another. A clamp closes, a stop drops, a gripper opens, a part is pushed off a belt, a lid is pressed on. For that kind of motion compressed air has been the default for seventy years, and in most plants it still is: a typical machine carries a few dozen cylinders, grippers and suction cups, and a large plant runs tens of thousands of them from one compressor house.

### Why air wins the simple motions
- **Cost and simplicity.** A cylinder, a valve and two limit sensors cost a fraction of an electric axis with its motor, drive and cable, and need no tuning.
- **Speed.** Small cylinders stroke in a tenth of a second; solenoid valves switch in 10–20 ms.
- **Force without holding power.** A cylinder pushing against a stop holds its full force indefinitely without using air (once its chamber is full), and nothing overheats. Jam it against an obstruction and it simply stops — overload protection is built in.
- **Robustness.** Air does not mind dirt, washdown, heat, vibration or explosive atmospheres, and the actuators contain no electronics.
- **Cleanliness.** A leak puts air, not oil, into the product — one reason food and pharmaceutical lines like it.

### A typical machine
Air enters through a shut-off and **soft-start valve** ([[soft-start]]) and a service unit ([[frl-units]]), then feeds a **valve terminal** — a manifold of 8–32 solenoid valves driven over a fieldbus by the machine's PLC ([[valve-terminals]], [[plc-control]]). Tubes run from it to guided cylinders for pushing and lifting, [[grippers]], [[rotary-actuators-pneu|rotary actuators]] for turning parts over, and ejectors with suction cups for sheets and cartons. Reed switches on the cylinders tell the PLC when each end position is reached ([[sensors-pneu]]).

| | Pneumatic | Electric axis |
|---|---|---|
| Positions | 2 (end stops) | any, programmable |
| Purchase cost | low | typically 3–10 times higher |
| Speed and force | high, not precisely controlled | profile under control |
| Stalling, overload | harmless | must be detected and limited |
| Energy, socket to load | about 5–15 % | about 50–80 % |
| Holding a position | free once pressurised | current or a brake |

### When electric wins
The weak point of air is energy. Of the electricity a compressor draws, only about a tenth ends up as work at the piston: most becomes heat in compression, and the air dumped at the exhaust still holds most of its pressure energy. For a few strokes a minute that hardly matters; for long strokes cycling all day, for many intermediate positions, controlled speed profiles or precise stopping, an electric axis pays back its higher price ([[pneumatic-vs-electric]], [[cost-of-compressed-air]]). The usual modern machine mixes both: electric axes where the motion must be controlled, air everywhere else.

> [!warn] A machine's air supply stores energy even when the machine is switched off. Before reaching into a machine, shut off and exhaust the air and lock out the supply: cylinders can move when a valve is operated by hand or when the air returns, and loads held by cylinders or suction cups can fall.
`,
  ideas: [
    'Most machine motions are two-position moves, and for these air is cheap, fast, robust and harmless when stalled.',
    'A typical machine: soft-start and service unit, a valve terminal on fieldbus, cylinders with reed switches, grippers and vacuum cups.',
    'The price of air is energy: only about 5–15 % of the compressor\'s electricity reaches the load as work.',
    'Electric axes win where many positions, controlled profiles or very high duty are needed; most machines mix both.'
  ],
  pitfalls: [
    'Compressed air is cheap because air is free — The air is free; compressing it is not. Only about a tenth of the compressor\'s electricity reaches the load, which makes compressed air one of the most expensive forms of energy in a factory.',
    'Pneumatics is obsolete now that electric axes exist — For clamping, gripping and two-position moves, air remains cheaper to buy, simpler to install and tolerant of stalls and dirt; electric wins where the motion itself must be controlled.'
  ],
  formulas: [
    {
      name: 'Electricity per cycle of a cylinder',
      expr: 'E = (A1 + A2)*s*(p + patm)/patm*w', tex: 'E = (A_1 + A_2)\\,s\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}\\,w',
      vars: {
        E: { name: 'electricity per cycle', q: 'energy', unit: 'kJ' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 6.91, tex: 'A_2' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        w: { name: 'electricity per m³ of free air (specific energy)', q: 'energydensity', unit: 'kJ/m³', value: 400 }
      },
      note: 'Free air of a double-acting cylinder (both strokes) times the compressor\'s specific energy: 400 kJ/m³ is 0.11 kWh/m³, or 6.7 kW per m³/min — a good screw compressor at 7 bar. Tubes between valve and cylinder add to it.',
      practice: { unknowns: ['E', 'w'] },
      stories: { E: 'A cylinder ({A1} piston, {A2} annulus) makes strokes of {s} at {p}. The compressor needs {w}. How much electricity does one cycle cost?' }
    },
    {
      name: 'Overall efficiency of a pneumatic stroke',
      expr: 'eta = F*s/E', tex: '\\eta = \\dfrac{F\\,s}{E}',
      vars: {
        eta: { name: 'overall efficiency, socket to load', q: 'ratio', unit: '%', tex: '\\eta' },
        F: { name: 'force doing useful work', q: 'force', unit: 'N', value: 300 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        E: { name: 'electricity per cycle', q: 'energy', unit: 'kJ', value: 0.414 }
      },
      note: 'The useful work is the force that actually moves or presses the load times the distance; a cylinder that only pushes a light part against a stop does almost no useful work at all.',
      stories: { eta: 'A cylinder pushes a load with {F} over {s}; each cycle costs {E} of electricity at the compressor. What is the overall efficiency?' }
    }
  ],
  examples: [
    {
      title: 'Air or electric for a pusher?',
      q: 'A 32 mm cylinder (12 mm rod, 100 mm stroke, 6 bar) pushes parts off a conveyor 20 times a minute, 6000 hours a year. An electric axis for the same job would cost ¤600 more, draw about 150 J per cycle (motor and drive losses included) and 15 W on standby. The compressor needs 0.11 kWh per m³ of free air; electricity costs ¤0.15 per kWh. Compare the running costs.',
      steps: [
        'Free air per cycle (both strokes): $(8.04 + 6.91)\\times10^{-4} \\times 0.1 \\times 7.013/1.013 = 1.035\\times10^{-3}$ m³.',
        'Per year: $1.035\\times10^{-3} \\times 20 \\times 60 \\times 6000 = 7452$ m³, costing $7452 \\times 0.11 = 820$ kWh, or about ¤123.',
        'Electric: $150 \\times 20 \\times 60 \\times 6000 = 1.08\\times10^{9}$ J = 300 kWh, plus $15 \\times 6000 = 90$ kWh standby: 390 kWh, about ¤59.',
        'Saving: 430 kWh or ¤65 a year; payback of the extra ¤600 takes $600/65 \\approx 9$ years.'
      ],
      a: 'The cylinder costs about twice as much to run (¤123 against ¤59 a year), but the electric axis needs about nine years to pay back — the air stays the sensible choice, unless leaks, longer strokes or faster cycling change the numbers.'
    },
    {
      title: 'Where the energy goes',
      q: 'The same cylinder pushes with 300 N over its 100 mm extending stroke; its return stroke does no useful work. With 400 kJ of electricity per m³ of free air, what is its overall efficiency?',
      steps: [
        'Electricity per cycle: $1.035\\times10^{-3} \\times 400\\,000 = 414$ J.',
        'Useful work: $300 \\times 0.1 = 30$ J.',
        '$\\eta = 30/414 = 7.2$ %. The rest is heat in the compressor and pressure thrown away at the exhaust at the end of each stroke.'
      ],
      a: 'About 7 %.'
    }
  ],
  quiz: [
    { q: 'Which job suits a pneumatic cylinder best?', choices: ['Clamping a part and pushing it off a conveyor, 30 times a minute', 'Positioning a camera at 12 points along 1 m to 0.05 mm', 'A slow, smooth feed at exactly 5 mm/s', 'Holding a load motionless half-way along the stroke for hours'], a: 0,
      why: 'Two-position motion against end stops is exactly what air does cheaply and robustly. Intermediate positions, precise slow feeds and mid-stroke holding fight the springiness of air — jobs for electric or servo-pneumatic drives.' },
    { q: 'A pneumatic cylinder jammed against an obstruction keeps drawing energy and overheats, like a stalled electric motor.', a: false,
      why: 'Once the chamber is full no more air flows (apart from leaks); the cylinder simply holds its force. This built-in overload safety is one of the reasons air is used.' },
    { q: 'A cylinder uses 1.2 L of free air per cycle and does 40 J of useful work. The compressor needs 400 kJ per m³ of free air. What is the overall efficiency?', answer: 8.3, unit: '%',
      why: 'Electricity: 1.2×10⁻³ m³ × 400 kJ/m³ = 480 J; 40/480 = 8.3 %.' },
    { q: 'Why do so many machines use air for simple motions although it is inefficient?', choices: ['The parts are cheap, fast, robust and overload-safe, and for small motions the energy cost is small next to the machine\'s other costs', 'Because air is free, compressed air costs nothing', 'Pneumatic cylinders are more efficient than electric motors', 'Electric actuators cannot move quickly'], a: 0,
      why: 'Compressed air is expensive energy, and electric actuators can be very fast — but for a few strokes a minute the total cost of an air cylinder is usually lower.' }
  ],
  applications: ['Assembly: pressing, clamping, stopping and diverting parts on transfer lines.', 'Packaging: carton erecting, case packing, sealing jaws and reject gates.', 'Process plants: pneumatic actuators turning ball and butterfly valves.', 'Woodworking and printing: clamps, feeds and sheet handling with suction.'],
  history: 'Compressed air moved into factory automation with the mass-production lines of the 1950s and 1960s, when whole machines were sequenced by air logic — valves acting as AND, OR and memory elements. Programmable controllers took over the logic from the 1970s, and from the 1990s valve terminals on fieldbus replaced the bundles of single valves and wires. The actuators stayed pneumatic.'
},

{
  id: 'pick-and-place', parent: 'applications-pneu', title: 'Pick and place and packaging', level: 2,
  short: 'Handling units that take a part from one place and set it down in another: what sets their cycle time, how fast a stroke can be, and how grippers and suction cups hold the part while it accelerates.',
  keywords: ['pick and place', 'handling', 'packaging', 'cycle time', 'gripper force', 'suction cup', 'vacuum gripper', 'case packer', 'triangular profile', 'picks per minute', 'end effector'],
  prereq: ['grippers', 'suction-cups', 'holding-force', 'cylinder-speed-pneu'],
  related: ['factory-automation', 'vacuum-safety', 'kinetic-energy-limits', 'ejectors', 'valve-terminals', 'rodless-guided', 'soft-robotics', 'physics:friction', 'physics:newtons-second-law'],
  body: `
A pick-and-place unit takes a part from one place and puts it down in another, over and over: a vertical stroke down, grip, up, a horizontal stroke across, down, release, up and back. Packaging lines are built from variations of it — case packers, tray loaders, bag and carton handlers — and many are pneumatic because the motion is always the same two-point move.

### Anatomy of a cycle
The cycle time is not just the strokes. Every move starts with a valve switching (10–20 ms) and pressure building before the piston moves; gripping needs the jaws to close or the vacuum to build and be confirmed by a vacuum switch (50–150 ms); releasing needs the vacuum broken, often with a short blow-off pulse. A typical budget for a two-axis unit with a 50 mm vertical and a 300 mm horizontal stroke:

| Step | Time |
|---|---|
| Z down, grip (vacuum and confirm), Z up | 0.12 + 0.08 + 0.12 s |
| X across | 0.30 s |
| Z down, release, Z up | 0.12 + 0.05 + 0.12 s |
| X back | 0.30 s |
| 8 valve switchings | 0.12 s |
| **Total** | **1.33 s — 45 picks a minute** |

Overlapping moves — starting across as soon as the part has cleared, releasing on a timed blow-off instead of waiting for a sensor — often gains more than faster cylinders do.

### How fast can a stroke be?
The shortest time to cover a stroke $s$ with a maximum acceleration $a$ is a triangular speed profile — accelerate for half the stroke, brake for the other half:

$$t = 2\\sqrt{\\frac{s}{a}}, \\qquad v_\\text{max} = \\sqrt{s\\,a}$$

A 100 mm stroke at 20 m/s² takes 0.14 s and peaks at 1.4 m/s; doubling the acceleration saves only 29 %. A pneumatic cylinder cannot follow a planned profile: it accelerates hard, runs at a speed set by its exhaust throttle and is stopped by its cushion or a shock absorber, whose capacity limits how fast a heavy load may arrive ([[kinetic-energy-limits]]). Guided cylinders and rodless slides carry the side loads of a moving arm ([[rodless-guided]]).

### Holding the part while it accelerates
**Mechanical grippers** hold by friction or by shape. Gripping by friction, each of $n$ jaws must press with

$$F = \\frac{m\\,(g + a)\\,S}{\\mu\\,n}$$

— a 0.5 kg part lifted at 10 m/s² with μ = 0.2, two jaws and a safety factor of 2 needs 50 N per jaw ([[grippers]]). Jaws shaped to close around a step or into a groove need far less.

**Suction cups** hold because the atmosphere pushes: a cup at −0.6 bar presses with 6 N per cm² of its area, and no vacuum can give more than about 10 N/cm² ([[suction-cups]], [[holding-force]]). Cartons, sheets, glass and bags are picked this way, with ejectors mounted at the cups for a fast response. Sideways acceleration is the hard case: the cup then holds only by friction on its lip, and the safety factor must be larger.

> [!warn] A part held by vacuum or by an air gripper can drop when the air fails or an emergency stop exhausts the system. Use non-return valves or self-locking grippers where a falling part could hurt someone, and keep people out of the working area while the unit runs ([[vacuum-safety]]).
`,
  ideas: [
    'Cycle time = strokes + valve switching + pressure build-up + grip and release confirmation; the non-motion parts are often half of it.',
    'The fastest stroke for a given acceleration is a triangular profile: $t = 2\\sqrt{s/a}$.',
    'A friction gripper must press with $m(g + a)S/(\\mu n)$ per jaw; gripping by shape needs much less.',
    'A suction cup is pushed by the atmosphere: at most about 10 N per cm² of cup area, however good the vacuum.'
  ],
  pitfalls: [
    'A vacuum cup pulls the part — The atmosphere pushes it against the cup. The most any cup can get is 1 bar times its area, about 10 N per cm², however strong the vacuum generator.',
    'Cycle time is the sum of the stroke times — Valve switching, pressure build-up, vacuum confirmation and settling often take as long as the motion itself; overlapping moves is the cheapest speed-up.',
    'A bigger valve makes a pick-and-place as fast as you like — The load must still be stopped: kinetic energy grows with the square of speed, and the cushions or shock absorbers set the real limit.'
  ],
  formulas: [
    {
      name: 'Shortest stroke time (triangular speed profile)',
      expr: 't = 2*sqrt(s/a)', tex: 't = 2\\sqrt{\\dfrac{s}{a}}',
      vars: {
        t: { name: 'stroke time', q: 'time', unit: 's' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        a: { name: 'acceleration and deceleration', q: 'accel', unit: 'm/s²', value: 20 }
      },
      note: 'Accelerate for half the stroke and brake for the other half at the same rate; the peak speed is √(s·a). A real pneumatic stroke has a delay before the piston moves and a cushioned end, so it is slower.',
      stories: { t: 'An axis may accelerate and brake at {a}. What is the shortest time for a stroke of {s}?', a: 'A stroke of {s} must take no more than {t}. What acceleration does it need?' }
    },
    {
      name: 'Jaw force of a friction gripper',
      expr: 'F = m*(g + a)*S/(mu*n)', tex: 'F = \\dfrac{m\\,(g + a)\\,S}{\\mu\\, n}',
      vars: {
        F: { name: 'force per jaw', q: 'force', unit: 'N' },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 0.5 },
        g: { const: 'g' },
        a: { name: 'upward acceleration', q: 'accel', unit: 'm/s²', value: 10 },
        S: { name: 'safety factor', value: 2 },
        mu: { name: 'friction coefficient, jaw on part', value: 0.2, tex: '\\mu' },
        n: { name: 'number of jaws', int: true, value: 2 }
      },
      note: 'Vertical lift, part held only by friction. Typical μ: 0.1–0.2 for steel jaws on oily steel, 0.3–0.5 with rubber-faced jaws. Safety factor 2–4 depending on the consequences of a drop.',
      stories: { F: 'A {n}-jaw gripper lifts a {m} part with an upward acceleration of {a}, friction coefficient {mu}, safety factor {S}. What force must each jaw press with?' }
    },
    {
      name: 'Cup diameter for a vertical lift',
      expr: 'd = sqrt(4*m*(g + a)*S/(pi*n*(-pv)))', tex: 'd = \\sqrt{\\dfrac{4\\,m\\,(g + a)\\,S}{\\pi\\, n\\,(-p_v)}}',
      vars: {
        d: { name: 'effective cup diameter', q: 'length', unit: 'mm' },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 2 },
        g: { const: 'g' },
        a: { name: 'upward acceleration', q: 'accel', unit: 'm/s²', value: 5 },
        S: { name: 'safety factor', value: 2 },
        n: { name: 'number of cups', int: true, value: 2 },
        pv: { name: 'vacuum in the cups (gauge, negative)', q: 'pressure', unit: 'bar', value: -0.6, signed: true, min: -1, max: 0, tex: 'p_v' }
      },
      note: 'Cups pulling perpendicular to the surface. Sideways acceleration is held only by friction on the lip and needs a larger safety factor. Porous parts do not reach the full vacuum.',
      stories: { d: 'A {m} carton is lifted upward at {a} by {n} suction cups at a vacuum of {pv}, with a safety factor of {S}. What diameter must each cup have?' }
    }
  ],
  examples: [
    {
      title: 'Speeding up a case packer',
      q: 'The two-axis unit in the table takes 1.33 s per pick. The designer starts the horizontal stroke 0.08 s before the vertical stroke has finished rising, on both trips, and replaces the release sensor wait with the 0.05 s blow-off already counted. The valves are moved onto a terminal next to the cylinders, cutting each switching delay from 15 ms to 8 ms. What rate does the unit reach?',
      steps: [
        'Overlap: 2 × 0.08 = 0.16 s saved.',
        'Valves: 8 × (0.015 − 0.008) = 0.056 s saved.',
        'New cycle: $1.33 - 0.16 - 0.056 = 1.11$ s.',
        'Rate: $60/1.11 = 54$ picks a minute, 20 % more, without touching a cylinder.'
      ],
      a: 'About 1.11 s a cycle, 54 picks a minute.'
    },
    {
      title: 'Choosing suction cups for a carton',
      q: 'A 2 kg carton is lifted vertically with an acceleration of 5 m/s² by two cups at −0.6 bar, with a safety factor of 2. What cup diameter is needed? What safety factor do 30 mm cups give?',
      steps: [
        'Force needed with the safety factor: $2 \\times 2 \\times (9.81 + 5) = 59.2$ N, or 29.6 N per cup.',
        '$d = \\sqrt{4 \\times 29.6/(\\pi \\times 0.6\\times10^5)} = 0.0251$ m = 25 mm; choose the next size, 30 mm.',
        'Each 30 mm cup: $0.6\\times10^5 \\times \\pi \\times 0.03^2/4 = 42.4$ N; two give 84.8 N.',
        'Against the 29.6 N the carton needs while accelerating, the safety factor is $84.8/29.6 = 2.9$.'
      ],
      a: '25 mm calculated; 30 mm cups give a safety factor of about 2.9.'
    }
  ],
  quiz: [
    { q: 'A two-jaw gripper (μ = 0.25) lifts a 1.2 kg part with an upward acceleration of 5 m/s² and a safety factor of 2. What force must each jaw press with?', answer: 71.1, unit: 'N',
      why: 'F = m(g + a)S/(μn) = 1.2 × 14.81 × 2/(0.25 × 2) = 71 N.' },
    { q: 'The biggest cycle-time gain on a pneumatic pick-and-place usually comes from…', choices: ['overlapping moves and cutting waits (valve times, vacuum confirmation)', 'raising the supply pressure to 10 bar', 'fitting cylinders with a bigger bore', 'using longer strokes'], a: 0,
      why: 'Much of a cycle is not motion at all. A higher pressure or a bigger bore changes the strokes only a little and adds air consumption and impact energy.' },
    { q: 'A suction cup at −0.6 bar holds twice as much as at −0.3 bar, so at −1.5 bar it would hold five times as much.', a: false,
      why: 'The holding force is proportional to the pressure difference, but the difference cannot exceed the atmosphere: about −1 bar is a perfect vacuum.' },
    { q: 'Doubling the acceleration of a short triangular move (same stroke) changes its time by about…', choices: ['−29 %', '−50 %', 'nothing', '+41 %'], a: 0,
      why: '$t = 2\\sqrt{s/a}$, so the time falls by the factor $1/\\sqrt{2} = 0.71$.' }
  ],
  problems: [
    { q: 'What is the shortest time for a 250 mm stroke if the axis may accelerate and brake at 15 m/s²?', answer: 0.258, unit: 's', tol: 0.02,
      steps: ['$t = 2\\sqrt{0.25/15} = 2 \\times 0.129 = 0.258$ s.', 'The peak speed is $\\sqrt{0.25 \\times 15} = 1.94$ m/s.'] }
  ],
  applications: ['Case and tray packers, carton erectors and bag placers in food and consumer goods.', 'Loading machine tools and presses with blanks.', 'Sorting and orienting small parts on assembly lines.', 'Glass, sheet-metal and panel handling with vacuum frames.']
}

);
Hyper.add(

{
  id: 'air-tools', parent: 'applications-pneu', title: 'Air tools', level: 1,
  short: 'Impact wrenches, drills, grinders, sanders and nailers driven by air motors: how much free air they use at 6.3 bar, how much compressor power that takes for how little output, how to size hoses, couplings and the compressor, and how to use them safely.',
  keywords: ['air tools', 'pneumatic tools', 'impact wrench', 'air drill', 'die grinder', 'angle grinder', 'nail gun', 'sander', 'blow gun', '6.3 bar', '90 psi', 'CFM', 'hose size', 'quick coupling', 'duty cycle', 'compressor size'],
  prereq: ['air-motors', 'cost-of-compressed-air', 'pressure-drop-air', 'tubing-fittings'],
  related: ['fad-capacity', 'receivers', 'air-leaks', 'noise-silencers', 'pneumatic-safety', 'pipe-sizing-air', 'compression-work', 'physics:power', 'physics:efficiency'],
  body: `
In a car workshop, a tyre shop, a foundry or a shipyard the tools on the ends of the hoses are air tools: impact wrenches, drills, grinders, sanders, nailers, riveters, chipping hammers and spray guns. Inside are small vane or turbine air motors ([[air-motors]]) — light and powerful for their size, impossible to burn out by stalling, and safe in wet or explosive places because there is nothing electrical in them.

### What they consume
Air tools are rated at **6.3 bar (90 psi) at the tool inlet**, and their appetite is given as free air per minute while they run:

| Tool | Free air at 6.3 bar | Output |
|---|---|---|
| Drill, 10 mm | 350–450 L/min | 0.3–0.4 kW |
| Die grinder, 6 mm collet | 400–550 L/min | 0.3–0.4 kW |
| Angle grinder, 125 mm | 1000–1200 L/min | 0.9–1.0 kW |
| Impact wrench, 1/2 in drive | 400–600 L/min | 0.4–0.5 kW motor |
| Random orbital sander, 150 mm | 300–450 L/min | 0.2–0.3 kW |
| Framing nailer | 1.5–2.5 L per nail | about 100 J per nail |
| Blow gun | 150–300 L/min | — |

These are typical figures; a tool's own rating is what counts. One cubic foot per minute (CFM) is 28.3 L/min.

### The power behind the power
A compressor needs roughly 6–7 kW of electricity for each cubic metre per minute of free air it delivers — about 400 kJ per m³. A 125 mm grinder drawing 1100 L/min therefore takes about 7.3 kW at the compressor to give 0.9 kW at the spindle: an **overall efficiency around 10 %**. The losses sit in two places: compression turns most of the electricity into heat ([[compression-work]]), and an air motor exhausts its air while it is still well above atmospheric pressure, throwing away its expansion. An electric grinder of the same output draws about 1.3 kW. Air tools earn their place by weight, ruggedness and safety, not by efficiency.

To size a compressor, add up what the tools use while they run, weighted by how much of the time each one really runs (the **duty cycle** — an impact wrench runs in bursts of seconds, a sander for minutes), and add a reserve of 20–30 % for leaks and growth ([[fad-capacity]], [[receivers]]).

### Hoses and couplings
A tool gets only the pressure that arrives at its inlet, and its power falls steeply with it: a tool rated at 6.3 bar gives roughly a fifth less at 5.3 bar. The pressure drop in a hose rises with its length and with the flow to the power 1.85, and falls with the **fifth power** of the bore ([[pressure-drop-air]]):

| Hose bore | Tools up to (10 m of hose, about 0.4 bar drop) |
|---|---|
| 6 mm (1/4 in) | about 150 L/min |
| 8 mm (5/16 in) | about 300 L/min |
| 10 mm (3/8 in) | about 550 L/min |
| 13 mm (1/2 in) | about 1150 L/min |

Quick couplings, hose reels, swivels and small regulators often choke a tool more than the hose does. Measure the pressure at the tool inlet with the tool running, not at the compressor.

> [!warn] Wear eye protection — grinders, chisels and blow guns throw particles — and hearing protection: many air tools run at 85–100 dB(A). Disconnect the air before changing a bit, disc or socket, and never fit a grinding disc rated below the tool's free speed. Never point a blow gun at anyone or clean skin or clothes with it: air can be driven into the body through skin, eyes or ears. In the US, OSHA limits cleaning air to 30 psi (about 2 bar) when dead-ended, and requires a device that cuts the flow if a hose over 1/2 inch bore fails; a loose hose under pressure whips violently.
`,
  ideas: [
    'Air tools are rated at 6.3 bar (90 psi) at the inlet; their consumption is free air per minute while running.',
    'Overall efficiency, socket to spindle, is only about 10 %: compression makes heat and the motor exhausts air still under pressure.',
    'Compressor capacity = sum of tool consumptions × duty cycles, plus 20–30 % reserve.',
    'Hose pressure drop falls with the fifth power of the bore: size hoses and couplings for the flow, and measure pressure at the tool.'
  ],
  pitfalls: [
    'The compressor gauge tells you the pressure at the tool — Under load, hoses, couplings, filters and regulators drop the pressure; a tool can see 5 bar while the receiver shows 7.',
    'An air tool is cheap to run because the tool is cheap — Its electricity at the compressor is about 6–10 times its shaft power.',
    'Four tools of 400 L/min need a 1600 L/min compressor — Only if all four run at once all the time; with realistic duty cycles and a receiver to cover the peaks, far less is needed.'
  ],
  formulas: [
    {
      name: 'Compressor power to run a tool',
      expr: 'P = Q*w', tex: 'P = Q\\,w',
      vars: {
        P: { name: 'electrical power at the compressor', q: 'power', unit: 'kW' },
        Q: { name: 'free-air consumption of the tool', q: 'airflow', unit: 'L/min ANR', value: 1000 },
        w: { name: 'electricity per m³ of free air (specific energy)', q: 'energydensity', unit: 'kJ/m³', value: 400 }
      },
      note: '400 kJ/m³ = 0.11 kWh/m³ = 6.7 kW per m³/min: a good screw compressor delivering 7 bar. Small piston compressors need 8–10 kW per m³/min (480–600 kJ/m³).',
      stories: { P: 'A tool uses {Q} of free air while it runs; the compressor needs {w}. What electrical power does running the tool take?', Q: 'A compressor draws {P} and needs {w}. How much free air does it deliver?' }
    },
    {
      name: 'Overall efficiency of an air tool',
      expr: 'eta = Pout/(Q*w)', tex: '\\eta = \\dfrac{P_\\text{out}}{Q\\,w}',
      vars: {
        eta: { name: 'overall efficiency, socket to spindle', q: 'ratio', unit: '%', tex: '\\eta' },
        Pout: { name: 'shaft power of the tool', q: 'power', unit: 'kW', value: 0.7, tex: 'P_\\text{out}' },
        Q: { name: 'free-air consumption', q: 'airflow', unit: 'L/min ANR', value: 1000 },
        w: { name: 'electricity per m³ of free air', q: 'energydensity', unit: 'kJ/m³', value: 400 }
      },
      stories: { eta: 'A grinder gives {Pout} at the spindle while using {Q} of free air. The compressor needs {w}. What is the overall efficiency?' }
    },
    {
      name: 'Compressor capacity for a group of tools',
      expr: 'Qc = N*Q*u*(1 + r)', tex: 'Q_c = N\\,Q\\,u\\,(1 + r)',
      vars: {
        Qc: { name: 'free air delivery needed', q: 'airflow', unit: 'L/min ANR', tex: 'Q_c' },
        N: { name: 'number of tools', int: true, value: 4 },
        Q: { name: 'consumption of one tool while running', q: 'airflow', unit: 'L/min ANR', value: 500 },
        u: { name: 'duty cycle (share of the time each runs)', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        r: { name: 'reserve for leaks and growth', q: 'ratio', unit: '%', value: 25, min: 0, max: 200 }
      },
      note: 'For a mix of tools, add N·Q·u for each kind. A receiver covers the short peaks; the compressor must also cover the largest single tool that runs continuously.',
      stories: { Qc: 'A workshop has {N} tools, each using {Q} while running for {u} of the time. With {r} reserve, what free air delivery must the compressor have?' }
    },
    {
      name: 'Pressure drop in a hose (empirical)',
      expr: 'dp = 450*Q^1.85*L/(d^5*p)', tex: '\\Delta p = \\dfrac{450\\, Q^{1.85} L}{d^5\\, p_1}',
      vars: {
        dp: { name: 'pressure drop', q: false, unit: 'bar', tex: '\\Delta p' },
        Q: { name: 'free-air flow', q: false, unit: 'L/s', value: 16.7 },
        L: { name: 'hose length', q: false, unit: 'm', value: 10 },
        d: { name: 'hose bore', q: false, unit: 'mm', value: 12.5 },
        p: { name: 'pressure at the hose inlet (absolute)', q: false, unit: 'bar', value: 7.3, tex: 'p_1' }
      },
      note: 'A widely used empirical formula for straight, smooth pipe and hose with the units shown (Q in L/s of free air, d in mm, p absolute). Each coupling or swivel adds roughly the loss of a few metres of hose. Rough hoses lose more.',
      practice: { unknowns: ['dp', 'd'] },
      stories: { dp: 'A tool draws {Q} through {L} of hose with a bore of {d}, fed at {p}. What pressure does the hose lose?', d: 'A tool draws {Q} through {L} of hose fed at {p}; the hose may lose at most {dp}. What bore does it need?' }
    }
  ],
  examples: [
    {
      title: 'What a grinder really costs',
      q: 'A 125 mm air grinder uses 1100 L/min of free air at 6.3 bar and gives 0.9 kW at the spindle. The compressor needs 400 kJ per m³ of free air. It runs 2 hours a day, 250 days a year, and electricity costs ¤0.15 per kWh. Compare it with an electric grinder of the same output drawing 1.3 kW.',
      steps: [
        'Air: $P = (1100/60\\,000)\\,\\text{m}^3/\\text{s} \\times 400\\,000\\,\\text{J/m}^3 = 7330$ W = 7.3 kW.',
        'Efficiency: $0.9/7.33 = 12$ %.',
        'Per year: 500 h × 7.33 kW = 3670 kWh, about ¤550.',
        'Electric: 500 h × 1.3 kW = 650 kWh, about ¤98.'
      ],
      a: 'The air grinder costs about ¤550 a year in electricity against about ¤100 for the electric one — the price of a lighter, more rugged tool.'
    },
    {
      title: 'Sizing a garage compressor',
      q: 'A garage has two 1/2 in impact wrenches (500 L/min, 20 % duty), a die grinder (450 L/min, 30 %), a blow gun (250 L/min, 10 %) and an orbital sander (400 L/min, 40 %). With a 25 % reserve, what free air delivery is needed, and roughly what motor power at 6.5 kW per m³/min?',
      steps: [
        'Wrenches: $2 \\times 500 \\times 0.2 = 200$ L/min. Grinder: $450 \\times 0.3 = 135$. Blow gun: $250 \\times 0.1 = 25$. Sander: $400 \\times 0.4 = 160$.',
        'Sum: 520 L/min; with the reserve: $520 \\times 1.25 = 650$ L/min.',
        'Motor: $0.65 \\times 6.5 = 4.2$ kW — a 5.5 kW compressor with a receiver of a few hundred litres.',
        'Check: the largest continuous user, the sander at 400 L/min, is well inside 650 L/min.'
      ],
      a: 'About 650 L/min of free air — roughly a 5.5 kW compressor.'
    },
    {
      title: 'The wrong hose',
      q: 'The grinder above (1100 L/min = 18.3 L/s) is fed through 10 m of hose from a line at 7.3 bar absolute. Estimate the hose loss with an 8 mm and with a 13 mm bore.',
      steps: [
        '$Q^{1.85} = 18.3^{1.85} = 217$.',
        '8 mm: $\\Delta p = 450 \\times 217 \\times 10/(8^5 \\times 7.3) = 977\\,000/239\\,000 = 4.1$ bar — impossible in practice: the grinder starves, its speed and flow collapse.',
        '13 mm: $\\Delta p = 977\\,000/(13^5 \\times 7.3) = 977\\,000/2\\,710\\,000 = 0.36$ bar.'
      ],
      a: 'An 8 mm hose cannot feed the grinder at all; a 13 mm hose loses about 0.36 bar.'
    }
  ],
  quiz: [
    { q: 'An impact wrench uses 500 L/min of free air while running, and the compressor needs 400 kJ per m³. What electrical power does it take while it runs?', answer: 3.33, unit: 'kW',
      why: '500 L/min = 8.33×10⁻³ m³/s; × 400 kJ/m³ = 3.33 kW — for a tool whose motor gives well under half a kilowatt.' },
    { q: 'Why do air tools reach only about 10 % overall efficiency?', choices: ['Compression turns most of the electricity into heat, and the air motor exhausts its air still under pressure', 'Air tools leak most of their air', 'Friction in the hose absorbs the energy', 'Air motors have very high bearing friction'], a: 0,
      why: 'A compressor delivers roughly half its input as useful pressure energy even when well designed, and a vane motor uses only part of that before the air leaves its exhaust.' },
    { q: 'A tool rated at 6.3 bar works as well on 10 m of 6 mm hose as on 10 m of 13 mm hose, as long as the compressor gauge shows 7 bar.', a: false,
      why: 'Pressure drop scales with 1/d⁵: the 6 mm hose loses nearly 50 times as much as the 13 mm one at the same flow, and the tool\'s power falls steeply with its inlet pressure.' },
    { q: 'Four tools each use 400 L/min while running and each runs 25 % of the time. With a 25 % reserve, the compressor should deliver about…', choices: ['500 L/min', '1600 L/min', '2000 L/min', '400 L/min'], a: 0,
      why: '4 × 400 × 0.25 × 1.25 = 500 L/min. The receiver covers the moments when several tools run together.' }
  ],
  problems: [
    { q: 'A sander gives 0.25 kW at the pad while using 420 L/min of free air. The compressor needs 400 kJ per m³. What is the overall efficiency?', answer: 8.9, unit: '%', tol: 0.03,
      steps: ['Input: $(420/60\\,000) \\times 400\\,000 = 2800$ W.', '$\\eta = 250/2800 = 8.9$ %.'] }
  ],
  applications: ['Vehicle workshops and tyre fitting: impact wrenches, ratchets, tyre inflators.', 'Metalwork and shipyards: grinders, chipping hammers, needle scalers, riveters.', 'Construction and timber framing: nailers and staplers.', 'Paint shops: spray guns and sanders in areas where sparks must be avoided.'],
  history: 'Compressed air drove the rock drills of the great Alpine tunnels in the 1860s and 1870s, and by the 1890s hand-held pneumatic hammers were riveting and chipping in shipyards and boiler shops. The air-driven impact wrench spread through vehicle workshops and assembly plants in the mid-twentieth century and is still the standard tool for wheel nuts.',
  sim: 'app-air-tools'
},

{
  id: 'air-brakes', parent: 'applications-pneu', title: 'Air brakes on trucks and trains', level: 2,
  short: 'Heavy trucks and trains brake with compressed air. Brake chambers push with pressure times area; spring brakes are held off by air, so losing the air applies them; and a train\'s brake pipe applies every car\'s brakes when its pressure is reduced — fail-safe by design.',
  keywords: ['air brakes', 'truck brakes', 'train brakes', 'spring brake', 'brake chamber', 'triple valve', 'Westinghouse', 'brake pipe', 'fail-safe', 'automatic brake', 'quick-release valve', 'relay valve', 'slack adjuster', 'parking brake', 'distributor'],
  prereq: ['single-acting-cylinders', 'receivers', 'boyles-law', 'quick-exhaust'],
  related: ['tyres-air-springs', 'emergency-stop-pneu', 'compressor-regulation', 'desiccant-dryers', 'pneumatic-safety', 'hydraulics:vehicle-brakes', 'physics:pressure', 'physics:speed-of-sound', 'physics:friction'],
  body: `
Every heavy truck, bus and train in the world brakes with compressed air. Air is always available — an engine-driven compressor makes it — it needs no return line, a small leak does not empty the system at once, and a trailer or a wagon connects with a simple hose coupling. Above all, air lets the brakes be made **fail-safe**: arranged so that losing the air applies them.

### The truck circuit
An engine-driven compressor charges the reservoirs through an air dryer; a governor unloads it at the cut-out pressure (typically 8–10 bar, 120–135 psi in the US) and loads it again at the cut-in. A protection valve splits the air into separate circuits so that one failure cannot empty the others. The driver's foot valve is a graduating valve: it delivers a pressure proportional to pedal travel to the **service brake chambers** at the wheels. A chamber is a diaphragm pushing a rod, and its force is simply

$$F = p_g\\,A$$

The rod turns an S-cam through a lever, the slack adjuster, and the cam spreads the shoes against the drum (disc brakes use a similar chamber on a lever).

| Chamber type (effective area) | Area | Force at 6 bar (87 psi) |
|---|---|---|
| 16 (in²) | 103 cm² | 6.2 kN |
| 20 | 129 cm² | 7.7 kN |
| 24 | 155 cm² | 9.3 kN |
| 30 | 194 cm² | 11.6 kN |

**Relay valves** near the axles take the driver's small signal and feed the chambers straight from a nearby reservoir, and **quick-release valves** — pneumatic quick-exhaust valves ([[quick-exhaust]]) — dump chamber air right at the axle when the pedal is released, so the brakes let go without the air travelling back to the cab.

### Spring brakes: fail-safe by design
Behind the service chamber of each drive-axle brake sits a **spring brake**: a powerful coil spring that applies the brake, held off by air acting on a piston. The parking valve in the cab exhausts that air to park, and supplies it to drive off. The net push is $F = F_s - p_g A$: it is zero while the air holds the spring back and rises to the full spring force as the pressure falls. So if a line bursts or the reservoir empties, the springs apply the brakes by themselves — and a truck with no air cannot be driven away. A warning sounds when reservoir pressure falls below roughly 5.5 bar (60 psi in the US).

### The train brake pipe and the triple valve
A train is the same idea on a larger scale. A **brake pipe** runs the length of the train, charged by the locomotive to 5 bar (UIC) or 90 psi (North American freight). Each car has an auxiliary reservoir, a brake cylinder and a **triple valve** (distributor) that compares the pipe with the reservoir:
- pipe higher than reservoir → **release and charge**: the cylinder exhausts and the reservoir fills from the pipe;
- pipe **reduced** below reservoir → **apply**: reservoir air flows to the cylinder until the reservoir has fallen to the pipe pressure, then the valve **laps**.

By Boyle's law, a reduction $\\Delta p$ gives a cylinder pressure $p_c = (V_a/V_c)\\,\\Delta p$; the classic ratio of 2.5 turns a 70 psi pipe into full service with a 20 psi reduction and 50 psi in the cylinders — or, in SI, 5 bar and a reduction of about 1.4 bar. If the train breaks in two, the hoses part, the pipe vents and **both halves brake**.

### How fast the brakes travel
A reduction travels down the pipe as a pressure wave — at best a few hundred metres per second (see [[physics:speed-of-sound|the speed of sound]]), slowed by friction and by having to exhaust the whole pipe through the driver's valve. In a 1.5 km freight train the rear cars start braking several seconds after the front, and the slack between wagons runs in hard. Valves that vent a little pipe air locally when they apply (quick service) or vent it fully in an emergency speed this up; electronically controlled pneumatic brakes, with a wire along the train, apply every car at once.

> [!warn] Never work under a vehicle supported only by its air suspension or a jack: a leak or a valve operated by someone else lowers it without warning — use axle stands and chock the wheels. Chock the wheels before releasing spring brakes. Never dismantle a spring brake chamber: the caged spring holds enough energy to kill; use the manufacturer's caging tool. Drain reservoirs and exhaust lines before disconnecting anything.
`,
  ideas: [
    'A brake chamber pushes with gauge pressure times its effective area: a type 30 chamber at 6 bar gives about 11.6 kN.',
    'Spring brakes are applied by springs and held off by air: lose the air and they apply — fail-safe.',
    'A train brakes when its brake-pipe pressure is reduced; each triple valve sends auxiliary-reservoir air to its cylinder, $p_c = (V_a/V_c)\\,\\Delta p$.',
    'The brake signal travels at most at a few hundred metres per second, so long trains brake front first.',
    'Relay and quick-release valves at the axles make application and release fast.'
  ],
  pitfalls: [
    'Air brakes need air to stop, so no air means no brakes — Parking and emergency brakes on trucks and the automatic brake on trains are built the other way round: losing the air applies them.',
    'A bigger pipe reduction always gives more braking — Beyond full service the auxiliary reservoir and cylinder have equalised; a larger reduction only wastes air and delays the release.',
    'Pumping the brake pedal builds up air pressure — Every application exhausts chamber air; fanning the pedal drains the reservoirs.'
  ],
  formulas: [
    {
      name: 'Brake chamber force',
      expr: 'F = p*A', tex: 'F = p_g\\,A',
      vars: {
        F: { name: 'pushrod force', q: 'force', unit: 'N' },
        p: { name: 'chamber pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        A: { name: 'effective diaphragm area', q: 'area', unit: 'cm²', value: 194 }
      },
      note: 'A "type 30" chamber has 30 in² = 194 cm²; type 24 = 155 cm², type 20 = 129 cm². The return spring takes a few hundred newtons off the pushrod force.',
      stories: { F: 'A brake chamber of {A} receives {p}. What force does its pushrod give?', p: 'A brake chamber of {A} must push with {F}. What pressure does it need?' }
    },
    {
      name: 'Spring brake: net pushrod force',
      expr: 'F = Fs - p*A', tex: 'F = F_s - p_g\\,A',
      vars: {
        F: { name: 'net pushrod force (negative: spring held off)', q: 'force', unit: 'N', signed: true },
        Fs: { name: 'spring force at the applied position', q: 'force', unit: 'N', value: 9000, tex: 'F_s' },
        p: { name: 'air pressure in the spring chamber (gauge)', q: 'pressure', unit: 'bar', value: 2, tex: 'p_g' },
        A: { name: 'spring piston area', q: 'area', unit: 'cm²', value: 194 }
      },
      note: 'A negative result means the air more than balances the spring: the brake is released. The brake is fully applied at zero pressure — when the air is lost.',
      practice: { unknowns: ['F', 'p'] },
      stories: { F: 'A spring brake has a spring force of {Fs} and a piston of {A}. The air in it has fallen to {p}. What force does it apply?', p: 'A spring brake with {Fs} of spring force on a piston of {A} must just be released. What air pressure does that need (net force {F})?' }
    },
    {
      name: 'Train brake: cylinder pressure from a pipe reduction',
      expr: 'pc = Va/Vc*dp', tex: 'p_c = \\dfrac{V_a}{V_c}\\,\\Delta p',
      vars: {
        pc: { name: 'brake cylinder pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        Va: { name: 'auxiliary reservoir volume', q: 'volume', unit: 'L', value: 60, tex: 'V_a' },
        Vc: { name: 'brake cylinder volume (at its working stroke)', q: 'volume', unit: 'L', value: 24, tex: 'V_c' },
        dp: { name: 'brake-pipe reduction (pressure drop)', q: 'pressure', unit: 'bar', value: 1, tex: '\\Delta p' }
      },
      note: 'Boyle\'s law at constant temperature for a classic triple valve: the air the auxiliary reservoir loses (it laps when it has fallen to the pipe pressure) fills the cylinder. Valid up to full service, where the two equalise.',
      stories: { pc: 'A car\'s auxiliary reservoir holds {Va} and its brake cylinder {Vc}. The driver reduces the brake pipe by {dp}. What pressure reaches the cylinder?' }
    },
    {
      name: 'Full-service reduction',
      expr: 'dpf = p0/(1 + Va/Vc)', tex: '\\Delta p_\\text{full} = \\dfrac{p_0}{1 + V_a/V_c}',
      vars: {
        dpf: { name: 'reduction for full service', q: 'pressure', unit: 'bar', tex: '\\Delta p_\\text{full}' },
        p0: { name: 'charged brake-pipe pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_0' },
        Va: { name: 'auxiliary reservoir volume', q: 'volume', unit: 'L', value: 60, tex: 'V_a' },
        Vc: { name: 'brake cylinder volume', q: 'volume', unit: 'L', value: 24, tex: 'V_c' }
      },
      note: 'Reservoir and cylinder equalise at $p_0 - \\Delta p_\\text{full}$. With $V_a/V_c = 2.5$: 5 bar gives 1.43 bar reduction and 3.57 bar in the cylinder; 70 psi gives 20 psi and 50 psi.',
      stories: { dpf: 'A brake pipe is charged to {p0}; each car has an auxiliary reservoir of {Va} and a cylinder of {Vc}. What reduction gives full service?' }
    }
  ],
  examples: [
    {
      title: 'From pedal to brake shoes',
      q: 'A driver\'s pedal sends 5.5 bar to a type 24 chamber (155 cm²). The slack adjuster arm is 150 mm long. What pushrod force and camshaft torque result?',
      steps: [
        '$F = p_g A = 5.5\\times10^5 \\times 0.0155 = 8530$ N.',
        'Torque on the S-cam: $8530 \\times 0.15 = 1280$ N·m.',
        'The cam spreads the shoes against the drum; with the drum\'s own self-energising geometry, each wheel end turns this into a few tens of kilonewtons of braking at the tyre.'
      ],
      a: 'About 8.5 kN at the pushrod and 1.3 kN·m on the camshaft.'
    },
    {
      title: 'Service and full service on a train',
      q: 'A brake pipe is charged to 5.0 bar; each car has an auxiliary reservoir 2.5 times the volume of its brake cylinder. What cylinder pressure does a 0.5 bar reduction give? What reduction gives full service, and with what cylinder pressure?',
      steps: [
        'A 0.5 bar reduction: $p_c = 2.5 \\times 0.5 = 1.25$ bar.',
        'Full service: $\\Delta p_\\text{full} = 5.0/(1 + 2.5) = 1.43$ bar.',
        'Cylinder pressure then: $2.5 \\times 1.43 = 3.57$ bar, equal to the reservoir\'s $5.0 - 1.43 = 3.57$ bar. Reducing further adds nothing.'
      ],
      a: '1.25 bar for a 0.5 bar reduction; full service at a reduction of about 1.4 bar, giving about 3.6 bar.'
    },
    {
      title: 'A long freight train',
      q: 'A 1500 m freight train brakes in an emergency. Taking the brake application to travel along the pipe at 250 m/s, how long after the front do the rear cars start braking, and how far does the train run at 60 km/h in that time?',
      steps: [
        'Delay: $t = 1500/250 = 6$ s.',
        'Distance at 16.7 m/s: $16.7 \\times 6 = 100$ m, during which the braking front is pushed by the unbraked rear.'
      ],
      a: 'About 6 s and 100 m — the reason long trains use distributed locomotives or electronically controlled brakes.'
    }
  ],
  quiz: [
    { q: 'The air line to a truck\'s spring brakes bursts while it is parked with the engine off. What happens?', choices: ['The spring brakes stay applied: they are held off only by air', 'The truck loses all braking and can roll', 'The service brakes apply fully', 'Nothing until the driver presses the pedal'], a: 0,
      why: 'Spring brakes are applied by springs; air only releases them. Without air they apply (or stay applied) — the fail-safe principle.' },
    { q: 'In a train\'s automatic air brake, the brakes apply when the driver raises the brake-pipe pressure.', a: false,
      why: 'They apply when the pipe pressure is reduced. That is what makes the brake fail-safe: a parted hose or a burst pipe applies all the brakes.' },
    { q: 'A brake chamber of 155 cm² receives 6 bar gauge. What pushrod force does it give (ignore its return spring)?', answer: 9300, unit: 'N',
      why: '6×10⁵ Pa × 0.0155 m² = 9300 N.' },
    { q: 'A car\'s auxiliary reservoir is 2.5 times its brake cylinder volume. The pipe is reduced by 0.8 bar. What gauge pressure reaches the cylinder?', answer: 2.0, unit: 'bar',
      why: '$p_c = (V_a/V_c)\\,\\Delta p = 2.5 \\times 0.8 = 2.0$ bar (below full service, which comes at about 1.4 bar of reduction).' },
    { q: 'Why do the front cars of a long freight train brake first?', choices: ['The pressure reduction travels down the pipe at a finite speed — a few hundred metres per second at best', 'The front cars have bigger brake cylinders', 'The locomotive pulls the front cars back', 'The rear cars have less air in their reservoirs'], a: 0,
      why: 'The pipe must vent from the front; the pressure change propagates as a wave slowed by friction. Quick-service and emergency vent valves on each car, or an electric signal, shorten the delay.' }
  ],
  problems: [
    { q: 'A spring brake has a spring force of 10 kN at its applied position and a piston of 194 cm². What gauge pressure in the spring chamber just releases it?', answer: 5.15, unit: 'bar', tol: 0.02,
      steps: ['Released when $p_g A = F_s$: $p_g = 10\\,000/0.0194 = 5.15\\times10^5$ Pa = 5.15 bar.', 'Below that, the spring pushes the shoes with $F_s - p_g A$.'] }
  ],
  applications: ['Trucks, buses, tractor units and trailers (with red and yellow or blue couplings for supply and control).', 'Freight and passenger trains, trams and metro cars.', 'Air-operated doors on buses and trains, from the same compressed-air supply.', 'Mining and construction machines with spring-applied parking brakes.'],
  history: 'George Westinghouse patented a "straight" air brake in 1869: air from the locomotive applied the brakes, so a parted hose left the train with none. His automatic brake of 1872 turned the logic round: the triple valve on each car applies the brakes when the pipe pressure falls, so a train that breaks apart stops itself. The US Safety Appliance Act of 1893 made power brakes compulsory on trains in interstate service, and the same fail-safe idea was carried over to road vehicles in the spring brake.',
  sim: ['app-truck-brake', 'app-train-brake']
}

);
Hyper.add(

{
  id: 'pneumatic-conveying', parent: 'applications-pneu', title: 'Pneumatic conveying', level: 2,
  short: 'Moving powders and granules through pipes with air: dilute phase with the particles suspended at 15–30 m/s, dense phase as slow plugs; the pickup velocity below which particles settle and the pipe blocks; the solids loading ratio; and pressure against vacuum systems.',
  keywords: ['pneumatic conveying', 'dilute phase', 'dense phase', 'pickup velocity', 'saltation', 'blockage', 'solids loading ratio', 'bulk solids', 'powder', 'pellets', 'rotary valve', 'blower', 'vacuum conveying', 'dust explosion'],
  prereq: ['standard-air', 'boyles-law', 'pressure-drop-air', 'physics:drag-force'],
  related: ['pneumatic-tube-systems', 'vacuum-pumps', 'compressor-types', 'noise-silencers', 'aerodynamics:terminal-velocity', 'hydraulics:darcy-weisbach', 'physics:continuity-equation'],
  body: `
Flour, sugar, cement, plastic pellets, grain, fly ash and pharmaceutical powders move around factories and silos inside pipes, carried by air. Pneumatic conveying needs no belts or buckets, runs in any direction through a closed pipe that keeps dust in and dirt out, and can be routed around a plant like any air line. Its rules are set by one question: will the air keep the particles off the bottom of the pipe?

### Dilute and dense phase
| | Dilute phase | Dense phase |
|---|---|---|
| Particles | suspended in the air stream | slugs, plugs or dunes sliding along |
| Air velocity | 15–30 m/s | 2–10 m/s |
| Solids loading ratio | up to about 15 | 15 to over 100 |
| Air supply | blower up to about 1 bar, or vacuum | compressor, 2–6 bar |
| Wear and breakage | high | low |
| Typical use | flour, sugar, pellets, grain | abrasive or fragile products, long lines |

The **solids loading ratio** $\\varphi = \\dot m_s/\\dot m_a$ compares the mass flow of product with that of the air carrying it. Dilute systems are simple and forgiving; dense-phase systems use far less air at gentler speeds but need careful design.

### Pickup velocity and saltation
In a horizontal pipe gravity pulls the particles down, and only turbulence and lift keep them suspended. Below a critical air velocity — the **saltation velocity** — they start dropping out and forming a layer on the bottom of the pipe. The air above the layer speeds up in the smaller free section, so a thin layer can be stable ("strand flow"), but a little slower still the layer grows into dunes, the dunes into a plug, and the pipe **blocks**. The saltation velocity rises with particle size and density, with the pipe bore and with the loading ratio. Designers keep the air at the pickup — where the product is fed in — 20–50 % above it:

| Material | Typical minimum velocity at the pickup |
|---|---|
| Fine powders (flour, cement) | 12–15 m/s |
| Granules and pellets (sugar, plastic pellets, grain) | 15–20 m/s |
| Heavy or coarse materials (sand, coarse salt) | 20–25 m/s |

### The air speeds up on its way
The mass flow of air is the same all along the pipe, but its pressure falls from the feed point to the outlet, so its volume — and velocity — grows:

$$v_2 = v_1\\,\\frac{p_1 + p_\\text{atm}}{p_2 + p_\\text{atm}}$$

A line fed at 0.5 bar gauge delivers its air 50 % faster at the outlet than at the pickup. The **pickup is therefore the critical point**, and long lines are stepped up to a bigger bore part-way along to stop the velocity climbing — bend wear rises steeply with it, roughly with its cube, and so does product breakage (pellets smear into "angel hair" on the pipe wall).

### Pressure or vacuum
**Pressure systems** feed product into the line through a rotary valve working against the blower pressure, and can deliver from one source to many silos. **Vacuum systems** suck from several pickup points into one receiver with a filter; they are limited to about 0.5 bar of pressure difference, but a leak draws air in instead of blowing dust out, which suits toxic and dusty products.

> [!warn] Many fine organic and metal powders form explosive dust clouds. Conveying lines must be earthed against static electricity, receivers and filters vented or protected under the explosion-protection rules, and no line opened while under pressure. Blowers and vents are loud: fit silencers and wear hearing protection near them.
`,
  ideas: [
    'Dilute phase suspends the product in fast air (15–30 m/s); dense phase pushes it as slow plugs with far less air.',
    'Below the saltation velocity particles settle; slightly below it, the layer grows until the pipe blocks.',
    'The solids loading ratio compares product mass flow with air mass flow: up to about 15 in dilute phase.',
    'Air expands along the line, so it is slowest at the pickup — the critical point — and fastest at the outlet.',
    'Pressure systems deliver from one source to many points; vacuum systems gather from many to one and leak inward.'
  ],
  pitfalls: [
    'More air is always safer — Excess velocity multiplies bend wear and product breakage, and wastes energy; aim 20–50 % above the minimum at the pickup, and step the pipe up where the air has expanded.',
    'The pickup velocity is set at the blower — The free-air flow is the same everywhere, but its actual volume and velocity depend on the local pressure; what matters is the velocity at the feed point, where the pressure is highest.',
    'A blocked line is cleared by blowing harder — A plug packs tighter under more pressure; lines are cleared by venting and purging in stages, following the plant\'s procedure.'
  ],
  formulas: [
    {
      name: 'Air velocity in the pipe',
      expr: 'v = 4*Q*patm/(pi*D^2*(p + patm))', tex: 'v = \\dfrac{4\\,Q\\,p_\\text{atm}}{\\pi D^2\\,(p_g + p_\\text{atm})}',
      vars: {
        v: { name: 'air velocity at that point', q: 'speed', unit: 'm/s' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 12 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 100 },
        p: { name: 'local pressure (gauge)', q: 'pressure', unit: 'bar', value: 0.5, signed: true, min: -0.9, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Boyle\'s law at constant temperature: the free air is compressed to the local absolute pressure. Negative gauge pressures are vacuum systems.',
      stories: { v: 'A blower sends {Q} of free air into a pipe of {D} bore. At the feed point the pressure is {p}. What is the air velocity there?', Q: 'A pipe of {D} bore must carry air at {v} at a point where the pressure is {p}. What free-air flow is needed?' }
    },
    {
      name: 'Solids loading ratio',
      expr: 'phi = ms/(rho*Q)', tex: '\\varphi = \\dfrac{\\dot m_s}{\\rho_\\text{ANR}\\,Q}',
      vars: {
        phi: { name: 'solids loading ratio', tex: '\\varphi' },
        ms: { name: 'product mass flow', q: 'massflow', unit: 't/h', value: 6, tex: '\\dot m_s' },
        rho: { name: 'density of free air (ANR)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_\\text{ANR}' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 12 }
      },
      note: 'Dilute phase: up to about 15. Dense phase: 15 to well over 100.',
      stories: { phi: 'A line conveys {ms} of product with {Q} of free air. What is the solids loading ratio?', Q: 'A dilute-phase line should run at a loading ratio of {phi} with {ms} of product. What free-air flow does it need?' }
    },
    {
      name: 'Air speeds up along the line',
      expr: 'v2 = v1*(p1 + patm)/(p2 + patm)', tex: 'v_2 = v_1\\,\\dfrac{p_1 + p_\\text{atm}}{p_2 + p_\\text{atm}}',
      vars: {
        v2: { name: 'velocity downstream', q: 'speed', unit: 'm/s', tex: 'v_2' },
        v1: { name: 'velocity at the pickup', q: 'speed', unit: 'm/s', value: 17, tex: 'v_1' },
        p1: { name: 'pressure at the pickup (gauge)', q: 'pressure', unit: 'bar', value: 0.5, signed: true, min: -0.9, tex: 'p_1' },
        p2: { name: 'pressure downstream (gauge)', q: 'pressure', unit: 'bar', value: 0, signed: true, min: -0.9, tex: 'p_2' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Same pipe bore, same temperature. In a vacuum system both pressures are negative gauge values, and the expansion is larger.',
      practice: { unknowns: ['v2', 'v1'] },
      stories: { v2: 'Air enters a conveying line at {v1} where the pressure is {p1}. How fast is it at a point where the pressure is {p2}?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a flour line',
      q: 'A bakery conveys 5 t/h of flour in dilute phase at a loading ratio of 10. The pressure at the pickup will be about 0.4 bar gauge, and the air there should move at no less than 15 m/s. What free-air flow and pipe bore are needed, and how fast is the air at the silo?',
      steps: [
        'Air mass flow: $\\dot m_a = \\dot m_s/\\varphi = (5000/3600)/10 = 0.139$ kg/s; free air: $0.139/1.185 = 0.117$ m³/s = 7.0 m³/min ANR.',
        'Actual volume at the pickup: $0.117 \\times 1.013/1.413 = 0.0840$ m³/s.',
        'Bore for 15 m/s: $A = 0.0840/15 = 5.60\\times10^{-3}$ m², $D = \\sqrt{4A/\\pi} = 84$ mm. The next smaller standard bore, 80 mm, gives 16.7 m/s — above the minimum, so it is chosen.',
        'At the silo (atmospheric): $v_2 = 16.7 \\times 1.413/1.013 = 23$ m/s.'
      ],
      a: 'About 7 m³/min of free air in an 80 mm line: 16.7 m/s at the pickup, 23 m/s at the silo.'
    },
    {
      title: 'A vacuum line expands more',
      q: 'A vacuum system picks up plastic pellets at atmospheric pressure at 18 m/s and delivers into a receiver at −0.4 bar gauge. How fast is the air at the receiver?',
      steps: [
        '$v_2 = 18 \\times (0 + 1.013)/(-0.4 + 1.013) = 18 \\times 1.013/0.613 = 29.7$ m/s.'
      ],
      a: 'About 30 m/s — the velocity grows by 65 %, which is why long vacuum lines are also stepped up in bore.'
    }
  ],
  quiz: [
    { q: 'Where in a dilute-phase pressure conveying line is the air slowest?', choices: ['At the feed point, where the pressure is highest', 'At the outlet into the silo', 'In the middle of the line', 'The velocity is the same all along the line'], a: 0,
      why: 'The same mass of air occupies less volume where the pressure is higher. The feed point is the critical point for saltation.' },
    { q: 'If a dilute-phase line blocks, the cure is to reduce the air flow so the product settles more gently.', a: false,
      why: 'Blockage comes from too little air velocity: the particles settle and build a plug. The fix is enough velocity at the pickup — or less product per unit of air.' },
    { q: 'A line carries 3 t/h of product with 6 m³/min of free air (1.185 kg/m³). What is the solids loading ratio?', answer: 7.0, tol: 0.03,
      why: 'Air: 0.1 m³/s × 1.185 = 0.1185 kg/s; product: 0.833 kg/s; φ = 0.833/0.1185 = 7.0 — dilute phase.' },
    { q: 'Why are long conveying lines often stepped up to a larger bore part-way along?', choices: ['As the pressure falls the air expands and speeds up; a bigger bore brings the velocity down, cutting wear, breakage and energy', 'A bigger pipe is cheaper', 'To raise the pressure at the outlet', 'To make the air slower at the pickup'], a: 0,
      why: 'The velocity at the outlet of a long line can be twice that at the pickup; a larger bore downstream keeps it near the value the product needs.' }
  ],
  problems: [
    { q: 'A 100 mm conveying line receives 10 m³/min of free air. The pressure at the pickup is 0.6 bar gauge. What is the air velocity there?', answer: 13.3, unit: 'm/s', tol: 0.02,
      steps: ['Actual flow: $(10/60) \\times 1.013/1.613 = 0.1047$ m³/s.', 'Area: $\\pi \\times 0.1^2/4 = 7.85\\times10^{-3}$ m².', '$v = 0.1047/7.85\\times10^{-3} = 13.3$ m/s — too slow for pellets: the line would block.'] }
  ],
  applications: ['Unloading flour, sugar and cement from road tankers into silos.', 'Plastics plants: pellets from silos to moulding machines.', 'Power stations: fly ash from filters to storage.', 'Pharmaceutical and food plants: closed, clean transfer of powders between process steps.'],
  sim: 'app-conveying'
},

{
  id: 'pneumatic-tube-systems', parent: 'applications-pneu', title: 'Pneumatic tube systems', level: 1,
  short: 'Carriers blown through tubes: how hospitals send samples and medicines between wards and laboratories at 5–8 m/s, why a carrier needs only a few millibar to climb, and the story of the city pneumatic posts.',
  keywords: ['pneumatic tube', 'tube system', 'pneumatic post', 'hospital tube', 'carrier', 'capsule', 'blower', 'diverter', 'sample transport', 'laboratory'],
  prereq: ['absolute-gauge-pressure', 'vacuum-basics', 'physics:pressure'],
  related: ['pneumatic-conveying', 'medical-dental-air', 'vacuum-pumps', 'noise-silencers', 'physics:friction', 'hydraulics:pipe-friction'],
  body: `
Hospitals send blood samples, medicines and documents between wards, laboratories and the pharmacy in carriers that fly through a network of tubes. Banks and shops once moved cash the same way, and factories still send samples from the production line to the quality laboratory. A pneumatic tube system is a carrier acting as a loose piston in a smooth tube, pushed or pulled by a blower.

### How it works
- **Tubes** of 110 mm or 160 mm bore run through the building, with generous bends.
- A **blower** for each line blows or sucks: a few kilowatts and a pressure difference of tens of millibar.
- **Carriers** — plastic capsules with felt or brush rings that seal loosely against the tube — take up to a few kilograms.
- **Diverters** switch carriers between lines, so the hundreds of stations of a large hospital form one network, run by a controller that tracks every carrier.
- At the receiving station an air cushion, a reversed air flow or a braking flap slows the carrier so it lands gently.

Carriers travel at **5–8 m/s**: a 400 m trip across a hospital takes about a minute, against ten or twenty for a porter. Samples that dislike jolts can go in a slower mode at 2–3 m/s, and laboratories check that samples arrive in the same condition as those carried by hand.

### Very little pressure
Because the carrier is a piston, the air only has to overcome the carrier's weight on climbs, its friction and the flow resistance of the tube. Lifting a 1 kg carrier up a vertical 110 mm tube needs a pressure difference of only

$$\\Delta p = \\frac{4\\,m\\,g}{\\pi D^2} \\approx 10\\ \\text{mbar}$$

— one hundredth of an atmosphere. Most of the blower's pressure goes into pushing air through hundreds of metres of tube and past the loose seals. A line normally carries one carrier at a time, so the trip time sets its capacity and a busy hospital splits its network into many zones.

| Figure | Typical |
|---|---|
| Tube bore | 110 or 160 mm |
| Carrier speed | 5–8 m/s (2–3 m/s gentle mode) |
| Carrier load | up to 2–5 kg |
| Blower | 1–5 kW, tens to a few hundred mbar |
| Trip | 30 s to 3 min |

### A long history
One of the first working pneumatic tubes connected the London Stock Exchange with a telegraph office in 1853, carrying telegrams as paper in capsules. Paris built a city-wide pneumatic post that ran from 1866 until 1984, and Prague's kept working until floods damaged it in 2002. The office message tube disappeared with electronic mail; the hospital tube grew instead, because laboratories depend on fast, traceable transport of physical samples.

> [!tip] A carrier in a tube is a close cousin of dense-phase [[pneumatic-conveying|pneumatic conveying]]: a plug pushed along a pipe by a small pressure difference. Hands stay out of a station while a carrier is arriving.
`,
  ideas: [
    'A carrier is a loose piston: the blower creates a pressure difference of a few to tens of millibar across it.',
    'Lifting a carrier needs only its weight divided by the tube area — about 10 mbar for 1 kg in a 110 mm tube.',
    'Carriers travel at 5–8 m/s; a line carries one carrier at a time, so trip time sets capacity.',
    'Diverters and a controller turn many lines into a network with hundreds of stations.'
  ],
  pitfalls: [
    'The carrier is blown along like a leaf in the wind — It is a piston sealing loosely in the tube; it moves because of a pressure difference across it, not because of drag in a free stream.',
    'The blower must produce bars of pressure — A few tens of millibar are enough; the energy goes mainly into moving air through long tubes.'
  ],
  formulas: [
    {
      name: 'Pressure to lift a carrier',
      expr: 'dp = 4*m*g/(pi*D^2)', tex: '\\Delta p = \\dfrac{4\\,m\\,g}{\\pi D^2}',
      vars: {
        dp: { name: 'pressure difference across the carrier', q: 'pressure', unit: 'mbar', tex: '\\Delta p' },
        m: { name: 'mass of the loaded carrier', q: 'mass', unit: 'kg', value: 1 },
        g: { const: 'g' },
        D: { name: 'tube bore', q: 'length', unit: 'mm', value: 110 }
      },
      note: 'A vertical riser, ignoring friction and air leaking past the seals; the blower needs more to keep air moving through the whole line.',
      stories: { dp: 'A loaded carrier of {m} must climb a vertical tube of {D} bore. What pressure difference does it need across it?', m: 'A blower can hold {dp} across a carrier in a {D} tube. What is the heaviest carrier it can lift up a riser?' }
    },
    {
      name: 'Trip time',
      expr: 't = L/v', tex: 't = \\dfrac{L}{v}',
      vars: {
        t: { name: 'trip time', q: 'time', unit: 's' },
        L: { name: 'length of the route', q: 'length', unit: 'm', value: 400 },
        v: { name: 'carrier speed', q: 'speed', unit: 'm/s', value: 6 }
      },
      note: 'Plus a few seconds of diverter switching and slowing at the station.',
      stories: { t: 'A carrier travels {L} at {v}. How long is the trip?' }
    },
    {
      name: 'Blower power',
      expr: 'P = Q*dp/eta', tex: 'P = \\dfrac{Q\\,\\Delta p}{\\eta}',
      vars: {
        P: { name: 'blower shaft power', q: 'power', unit: 'kW' },
        Q: { name: 'air flow through the blower (near atmospheric)', q: 'flowrate', unit: 'm³/h', value: 205 },
        dp: { name: 'blower pressure difference', q: 'pressure', unit: 'mbar', value: 100, tex: '\\Delta p' },
        eta: { name: 'blower efficiency', q: 'ratio', unit: '%', value: 50, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'At pressure differences of a few hundred millibar the air hardly compresses, so flow × pressure is a good measure of the work. 205 m³/h is a 110 mm tube at 6 m/s.',
      stories: { P: 'A tube blower moves {Q} of air against {dp} with an efficiency of {eta}. What power does it need?' }
    }
  ],
  examples: [
    {
      title: 'A heavy carrier in a big tube',
      q: 'A 160 mm tube system sends carriers of up to 1.5 kg. What pressure difference lifts one up a vertical riser?',
      steps: [
        'Area: $\\pi \\times 0.16^2/4 = 0.0201$ m².',
        '$\\Delta p = 1.5 \\times 9.81/0.0201 = 732$ Pa = 7.3 mbar.'
      ],
      a: 'About 7 mbar — less than for a 1 kg carrier in a 110 mm tube, because the area grows with the square of the bore.'
    },
    {
      title: 'How many zones?',
      q: 'Trips in a hospital zone average 600 m at 6 m/s, plus 20 s of switching and handling. The busiest area sends 90 carriers an hour. How many zones (lines that each carry one carrier at a time) does it need?',
      steps: [
        'Trip: $600/6 = 100$ s; with handling 120 s per carrier.',
        'One zone: $3600/120 = 30$ carriers an hour.',
        '$90/30 = 3$ zones, with diverters to link them.'
      ],
      a: 'Three zones.'
    }
  ],
  quiz: [
    { q: 'What pressure difference lifts a 2 kg carrier up a vertical 110 mm tube?', answer: 20.6, unit: 'mbar',
      why: 'Δp = 4mg/(πD²) = 4 × 2 × 9.81/(π × 0.11²) = 2064 Pa = 20.6 mbar.' },
    { q: 'A pneumatic tube line can usually carry…', choices: ['one carrier at a time, so its capacity is set by the trip time', 'as many carriers as fit in the tube, nose to tail', 'carriers only downhill', 'only in one direction'], a: 0,
      why: 'The carrier is a piston driven by the air in the whole line, so a line serves one trip at a time; networks are divided into zones to raise capacity.' },
    { q: 'The blower of a hospital tube system must produce several bar to push carriers through the building.', a: false,
      why: 'Tens of millibar suffice: the carrier is a light, loosely sealing piston.' },
    { q: 'Why do some hospitals send blood samples in a slower mode?', choices: ['To limit the accelerations and the impact at arrival', 'Because slow air is cleaner', 'To save blower energy only', 'Because samples are heavier than documents'], a: 0,
      why: 'Some analyses are sensitive to shaking and impact; a gentle mode at 2–3 m/s and a soft landing protect them.' }
  ],
  applications: ['Hospitals: samples to the laboratory, medicines from the pharmacy, blood products.', 'Industry: samples from the process to the quality laboratory (steel, cement, chemicals).', 'Banks and supermarkets: cash from tills to the safe room.', 'Historic city pneumatic posts for telegrams and letters.'],
  history: 'Pneumatic tubes carried telegrams in London from 1853 and became city-wide postal networks in Paris (1866–1984), Berlin, Vienna and Prague, where the last public system ran until 2002. New York sent mail through tubes under its streets from 1897 to 1953. Today the largest networks are in hospitals.'
},

{
  id: 'tyres-air-springs', parent: 'applications-pneu', title: 'Tyres and air suspension', level: 2,
  short: 'The air in a tyre carries the load: the contact patch grows until inflation pressure times area balances it, and the pressure follows the temperature. Air springs with levelling valves carry buses and trucks at the same height and ride frequency whether empty or full.',
  keywords: ['tyre pressure', 'tire pressure', 'contact patch', 'inflation', 'under-inflation', 'Gay-Lussac', 'temperature', 'nitrogen', 'air spring', 'air suspension', 'levelling valve', 'ride frequency', 'kneeling bus', 'bellows'],
  prereq: ['charles-gay-lussac', 'absolute-gauge-pressure', 'bellows-muscles', 'pneumatic-spring'],
  related: ['air-brakes', 'energy-in-compressed-air', 'isothermal-adiabatic', 'physics:ideal-gas-law', 'physics:mass-spring-system', 'physics:simple-harmonic-motion', 'physics:rolling-motion'],
  body: `
A tyre is an air spring on a wheel. The rubber and cords only contain the air; the air pressure carries the load, and the tyre flattens against the road until the patch in contact is large enough for the pressure to hold the load up:

$$A \\approx \\frac{F}{p_g}$$

— roughly, because the carcass itself carries a little of the load. A car wheel carrying 4.5 kN on a tyre at 2.3 bar stands on about 200 cm², the size of a large postcard. Let half the air out and the patch nearly doubles: the tyre flexes more with every turn, heats up, rolls harder, wears its shoulders and grips less predictably.

| Tyre | Load per tyre | Pressure (gauge) | Patch ≈ F/p |
|---|---|---|---|
| Road bicycle | 0.5 kN | 6 bar | 8 cm² |
| Car | 4.5 kN | 2.3 bar | 196 cm² |
| Van | 8 kN | 4 bar | 200 cm² |
| Truck, drive axle | 28 kN | 8.5 bar | 330 cm² |
| Airliner main wheel | 250 kN | 14 bar | 1790 cm² |

### Temperature and pressure
The air in a tyre is a nearly fixed volume of gas, so its **absolute** pressure follows its absolute temperature ([[charles-gay-lussac]]):

$$p_2 = (p_1 + p_\\text{atm})\\,\\frac{T_2}{T_1} - p_\\text{atm}$$

A car tyre set to 2.3 bar at 20 °C reads 2.75 bar when a motorway run has warmed its air to 60 °C, and 1.96 bar on a −10 °C morning — about 0.1 bar for every 10 °C. That is why pressures are set **cold**, and why letting air out of a hot tyre leaves it under-inflated later. Aircraft and racing tyres are filled with dry nitrogen: it follows the same law, but carries no water vapour to add to the swing and no oxygen to feed a fire after a hot brake.

### Air suspension
An **air spring** — a rubber bellows or a rolling-lobe sleeve between axle and chassis — carries its load the same way, $F = p_g A_e$ over its effective area ([[bellows-muscles]]). What makes it special is the **levelling valve**, worked by a linkage from the axle: it adds air when the load pushes the body down and exhausts air when the body rises, with a delay so that it ignores bumps. The ride height stays the same whether a bus is empty or full.

A levelled air spring has a second gift. Its stiffness, $k \\approx n\\,(p_g + p_\\text{atm})A_e^2/V$ ([[pneumatic-spring]]), rises with the pressure — that is, with the load — so the natural frequency of the sprung mass hardly changes:

$$f = \\frac{1}{2\\pi}\\sqrt{\\frac{n\\,g\\,(p_g + p_\\text{atm})\\,A_e}{p_g\\,V}}$$

A 300 cm² spring holding 10 L at 5 bar gives about 1.1 Hz, loaded or empty. A steel spring chosen for the loaded vehicle would make the empty one bounce at 1.5–2 times the frequency. That is why buses, coaches, truck trailers and most rail vehicles ride on air — and why a bus can **kneel**, exhausting its front springs to lower the entry by several centimetres for a wheelchair or a pushchair.

> [!warn] Never work under a vehicle supported only by its air suspension or a jack: a leak, a levelling valve or someone else's hand on a control can lower it without warning. Support it on stands and chock the wheels. Inflate truck and split-rim wheels only in a safety cage with a clip-on chuck, never above the maximum pressure moulded on the sidewall, and have a tyre that has run flat inspected before it is re-inflated.
`,
  ideas: [
    'The air carries the load: contact patch area ≈ load / inflation pressure (gauge).',
    'Tyre air is a fixed volume: absolute pressure follows absolute temperature, about 0.1 bar per 10 °C for a car tyre. Set pressures cold.',
    'Under-inflation enlarges the patch and the flexing: heat, rolling resistance, wear and risk of failure.',
    'An air spring with a levelling valve keeps ride height constant, and its stiffness rises with load, so the ride frequency stays near 1 Hz.'
  ],
  pitfalls: [
    'Pressure rises in proportion to the Celsius temperature — Use absolute pressure and kelvin: warming from 20 °C to 40 °C raises the absolute pressure by 6.8 %, not 100 %.',
    'Nitrogen makes a tyre immune to temperature — Nitrogen obeys the same gas law; it only helps by being dry and by permeating rubber a little more slowly.',
    'A soft tyre grips better because its patch is larger — On a road the grip hardly grows with area, while the extra flexing heats the tyre, blurs the steering and can destroy it.'
  ],
  derivation: {
    title: 'The natural frequency of a levelled air spring',
    steps: [
      { text: 'The spring carries a mass $m = F/g = p_g A_e/g$.' },
      { text: 'Push it in by a small stroke $x$: its volume falls by $A_e x$. For a polytropic change ($pV^n$ constant) the absolute pressure $p_g + p_\\text{atm}$ rises by', tex: '\\Delta p = n\\,(p_g + p_\\text{atm})\\,\\frac{A_e x}{V}' },
      { text: 'The force rises by $A_e\\,\\Delta p$, so the stiffness is', tex: 'k = n\\,(p_g + p_\\text{atm})\\,\\frac{A_e^2}{V}' },
      { text: 'The natural frequency of the mass on this spring:', tex: 'f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}} = \\frac{1}{2\\pi}\\sqrt{\\frac{n\\,g\\,(p_g + p_\\text{atm})\\,A_e}{p_g\\,V}}' },
      { text: 'When the load doubles, the levelling valve roughly doubles $p_g$; the ratio $(p_g + p_\\text{atm})/p_g$ changes little, so neither does $f$. (Real bellows also change their effective area with height, which designers use to tune the curve.)' }
    ]
  },
  formulas: [
    {
      name: 'Contact patch area',
      expr: 'A = F/p', tex: 'A = \\dfrac{F}{p_g}',
      vars: {
        A: { name: 'contact patch area', q: 'area', unit: 'cm²' },
        F: { name: 'load on the tyre', q: 'force', unit: 'N', value: 4500 },
        p: { name: 'inflation pressure (gauge)', q: 'pressure', unit: 'bar', value: 2.3, tex: 'p_g' }
      },
      note: 'An estimate: the carcass carries some of the load, so the real patch is somewhat smaller, especially at low pressure.',
      stories: { A: 'A tyre inflated to {p} carries {F}. Roughly how large is its contact patch?', p: 'A tyre carrying {F} should stand on a patch of {A}. What inflation pressure does that suggest?' }
    },
    {
      name: 'Tyre pressure after a temperature change',
      expr: 'p2 = (p1 + patm)*T2/T1 - patm', tex: 'p_2 = (p_1 + p_\\text{atm})\\,\\dfrac{T_2}{T_1} - p_\\text{atm}',
      vars: {
        p2: { name: 'new pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        p1: { name: 'pressure set cold (gauge)', q: 'pressure', unit: 'bar', value: 2.3, tex: 'p_1' },
        T1: { name: 'temperature when set', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        T2: { name: 'new temperature of the air', q: 'temperature', unit: '°C', value: 60, tex: 'T_2' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Gay-Lussac\'s law at constant volume, with absolute pressures and temperatures (the calculator converts °C to kelvin). A tyre\'s volume grows slightly with pressure, so the real rise is a little smaller.',
      stories: { p2: 'A tyre is set to {p1} at {T1}. What does it read when its air reaches {T2}?', p1: 'A tyre should read {p2} when its air is at {T2}. What should it be set to at {T1}?' }
    },
    {
      name: 'Air spring force',
      expr: 'F = p*A', tex: 'F = p_g\\,A_e',
      vars: {
        F: { name: 'load carried', q: 'force', unit: 'kN' },
        p: { name: 'spring pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_g' },
        A: { name: 'effective area', q: 'area', unit: 'cm²', value: 300, tex: 'A_e' }
      },
      stories: { F: 'An air spring with an effective area of {A} is at {p}. What load does it carry?', p: 'An air spring of {A} must carry {F}. What pressure does the levelling valve set?' }
    },
    {
      name: 'Natural frequency of a levelled air spring',
      expr: 'f = sqrt(n*g*(p + patm)*A/(p*V))/(2*pi)', tex: 'f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{n\\,g\\,(p_g + p_\\text{atm})\\,A_e}{p_g\\,V}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz' },
        n: { name: 'polytropic index (1 slow, 1.4 fast)', value: 1.3 },
        g: { const: 'g' },
        p: { name: 'spring pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        A: { name: 'effective area', q: 'area', unit: 'cm²', value: 300, tex: 'A_e' },
        V: { name: 'air volume (bellows plus any extra reservoir)', q: 'volume', unit: 'L', value: 10 }
      },
      note: 'Constant effective area. An extra reservoir connected to the spring enlarges V and softens the ride; n is close to 1.3 for ride motions of about 1 Hz.',
      practice: { unknowns: ['f', 'V'] },
      stories: { f: 'An air spring of {A} holding {V} of air carries its load at {p}. What is its natural frequency (n = {n})?', V: 'An air spring of {A} at {p} should give {f} (n = {n}). How much air volume does it need?' }
    }
  ],
  examples: [
    {
      title: 'Cold morning, hot motorway',
      q: 'A car tyre is set to 2.3 bar gauge at 20 °C. What does it read on a −10 °C morning, and after a motorway run that heats its air to 60 °C?',
      steps: [
        'Absolute: $2.3 + 1.013 = 3.313$ bar at 293.15 K.',
        'At −10 °C (263.15 K): $3.313 \\times 263.15/293.15 = 2.974$ bar absolute, or 1.96 bar gauge.',
        'At 60 °C (333.15 K): $3.313 \\times 333.15/293.15 = 3.765$ bar absolute, or 2.75 bar gauge.',
        'A swing of 0.8 bar over 70 °C: about 0.11 bar per 10 °C.'
      ],
      a: '1.96 bar on the cold morning and 2.75 bar hot — so pressures are checked cold.'
    },
    {
      title: 'A bus, empty and full',
      q: 'A bus air spring has an effective area of 300 cm² and holds 10 L of air (n = 1.3). Empty, the levelling valve holds it at 3 bar; full, at 7 bar. What load does it carry in each case, and what is its natural frequency?',
      steps: [
        'Loads: $3\\times10^5 \\times 0.03 = 9$ kN empty; $7\\times10^5 \\times 0.03 = 21$ kN full.',
        'Empty: $f = \\frac{1}{2\\pi}\\sqrt{1.3 \\times 9.81 \\times (4.013/3) \\times 0.03/0.01} = \\frac{1}{2\\pi}\\sqrt{51.2} = 1.14$ Hz.',
        'Full: $f = \\frac{1}{2\\pi}\\sqrt{1.3 \\times 9.81 \\times (8.013/7) \\times 3} = \\frac{1}{2\\pi}\\sqrt{43.8} = 1.05$ Hz.',
        'A steel spring stiff enough for 21 kN at 1.05 Hz would give $1.05\\sqrt{21/9} = 1.60$ Hz empty.'
      ],
      a: '9 kN at 1.14 Hz empty, 21 kN at 1.05 Hz full — nearly the same ride, where a steel spring would jump to 1.6 Hz.'
    }
  ],
  quiz: [
    { q: 'A wheel carries 6 kN on a tyre inflated to 2.5 bar gauge. Roughly how large is the contact patch?', answer: 240, unit: 'cm²',
      why: 'A ≈ F/p = 6000/2.5×10⁵ = 0.024 m² = 240 cm².' },
    { q: 'You should let some air out of tyres that read high after a long drive.', a: false,
      why: 'The rise is the normal effect of temperature on a fixed volume of air. Letting air out leaves the tyres under-inflated once they cool; set pressures cold.' },
    { q: 'A tyre set to 2.0 bar gauge at 20 °C warms to 50 °C. What does it read?', answer: 2.31, unit: 'bar',
      why: '(2.0 + 1.013) × 323.15/293.15 = 3.321 bar absolute, so 2.31 bar gauge — not 2.0 × 50/20 = 5 bar.' },
    { q: 'Why does an air-suspended bus ride about the same empty or full?', choices: ['The levelling valve adds air as the load rises, so the stiffness rises with the load and the natural frequency stays near 1 Hz', 'Air springs have no stiffness', 'The shock absorbers adjust themselves to the load', 'The tyres are softer when the bus is full'], a: 0,
      why: 'Stiffness ∝ absolute pressure and load ∝ gauge pressure; with the levelling valve both grow together, so √(k/m) hardly changes.' }
  ],
  problems: [
    { q: 'An air spring with an effective area of 250 cm² is held at 6 bar gauge. What load does it carry?', answer: 15, unit: 'kN', tol: 0.02,
      steps: ['$F = p_g A_e = 6\\times10^5 \\times 0.025 = 15\\,000$ N = 15 kN.'] }
  ],
  applications: ['Cars, trucks, bicycles and aircraft: every pneumatic tyre.', 'Buses and coaches: air suspension with kneeling for accessible boarding.', 'Truck trailers and tractor units: load-independent ride height for loading docks.', 'Rail vehicles: air springs between bogie and body; machine and instrument mounts isolating vibration.'],
  history: 'Robert William Thomson patented an air-filled tyre in 1845, but it was John Boyd Dunlop\'s bicycle tyre of 1888 that caught on and, with the motor car, made the pneumatic tyre universal. Air suspension spread on buses, coaches and rail vehicles from the 1950s and on heavy trucks and trailers later in the century.',
  sim: 'app-tyre'
}

);
Hyper.add(

{
  id: 'medical-dental-air', parent: 'applications-pneu', title: 'Medical and dental air', level: 2,
  short: 'Compressed air as a medicine: how hospital air is made, purified, monitored and delivered at 4 bar for breathing and 7 bar for surgical tools, and how dentistry runs on oil-free air — including the air turbine that spins a drill at several hundred thousand rpm.',
  keywords: ['medical air', 'breathing air', 'hospital air', 'medical gas pipeline', 'dental air', 'dental turbine', 'handpiece', 'oil-free compressor', 'surgical air', 'purity', 'ventilator', 'tourniquet', 'pharmacopoeia'],
  prereq: ['iso-8573', 'desiccant-dryers', 'lubricators', 'air-motors'],
  related: ['pneumatic-tube-systems', 'pressure-dew-point', 'air-filters', 'vacuum-pumps', 'receivers', 'physics:angular-kinematics', 'physics:power', 'chemistry:partial-pressures'],
  body: `
In a hospital, compressed air is a medicine. It drives ventilators and anaesthesia machines and patients breathe it, so it is made, tested and documented like a drug; a second supply at higher pressure drives surgical tools. Dentistry runs on air too: the high-speed drill is an air turbine.

### Medical air: a medicine from a pipe
Hospital air reaches the wall outlets beside the beds at about **4 bar** (400 kPa) for breathing, and often at **7–8 bar** as surgical air for air-driven bone drills and saws. Typical pharmacopoeia limits for breathing air:

| Constituent | Typical limit |
|---|---|
| Oxygen | 20.4–21.4 % |
| Carbon dioxide | ≤ 500 ppm |
| Carbon monoxide | ≤ 5 ppm |
| Water | ≤ 67 ppm (a dew point near −46 °C at atmospheric pressure) |
| Oil | ≤ 0.1 mg/m³ |
| NO + NO₂ | ≤ 2 ppm |
| SO₂ | ≤ 1 ppm |

The plant is built for purity and for never stopping: **oil-free compressors**, so that no oil can reach a patient however a filter fails (or lubricated machines with extensive filtration); desiccant dryers ([[desiccant-dryers]]); particle, carbon and bacterial filters; two or three compressors so that any one can be serviced while the others meet the whole demand; a reserve bank of cylinders; and continuous monitoring of dew point and carbon monoxide with alarms. The intake is placed away from vehicle exhausts. Some hospitals make synthetic medical air instead, blending oxygen and nitrogen from liquid tanks.

Outlets and hoses have gas-specific connectors that cannot be plugged into the wrong gas, and colour codes — medical air is black and white in ISO practice, yellow in the US.

### Dental air
A dental surgery needs clean, dry, oil-free air at 5–7 bar. Its star user is the **air-turbine handpiece**: a rotor 7–9 mm across, spun by jets of air at about 2–3 bar, running free at typically **300 000–400 000 rpm** on some 40–60 L/min of air. Cutting slows it to around half that speed, near where its power peaks at 10–20 W, and a water spray cools the tooth. Slower air motors, up to about 20 000 rpm, drive polishers, and the air–water syringe dries and rinses. Oil in the air would spoil bonded fillings and water would corrode the handpieces — hence oil-free compressors with dryers. Suction, by contrast, comes from vacuum pumps ([[vacuum-pumps]]).

### Air everywhere in a hospital
Ventilators blend medical air with oxygen; nebulisers turn medicines into mist; pneumatic tourniquets hold a limb bloodless during surgery; alternating-pressure mattresses prevent pressure sores; inflatable leg sleeves squeeze the calves to prevent clots; and [[pneumatic-tube-systems|tube systems]] carry the samples to the laboratory.

> [!warn] Medical gas pipelines are safety-critical: after any work on them, identity and purity must be tested by qualified people before patients are connected — a wrong gas at an outlet can kill. Never connect workshop or industrial air to medical outlets or breathing equipment. Oxygen-enriched air makes materials burn fiercely: keep oil and grease away from medical gas fittings.
`,
  ideas: [
    'Medical air is a regulated medicine with limits for oxygen, CO, CO₂, water, oil, NOx and SO₂, monitored continuously.',
    'Hospitals supply breathing air at about 4 bar and surgical air at 7–8 bar, from redundant oil-free plants with dryers, filters and reserve cylinders.',
    'A dental turbine is an air motor: roughly 300 000–400 000 rpm free, half that under load, 10–20 W.',
    'Gas-specific connectors, colour codes and identity testing guard against the deadliest error: the wrong gas at an outlet.'
  ],
  pitfalls: [
    'Medical air is just clean compressed air — It is a medicine with legal purity limits, tested, documented and monitored; workshop air, however well filtered, is not a substitute.',
    'A faster dental turbine cuts with more power — At its free-running speed a turbine has no torque; its power peaks at about half that speed, which is why it slows under load.',
    'An oil-free compressor gives oil-free air by itself — The intake air can carry oil vapour and exhaust fumes; filters, careful siting of the intake and monitoring are still needed.'
  ],
  formulas: [
    {
      name: 'Tip speed of a turbine rotor',
      expr: 'v = pi*D*n', tex: 'v = \\pi D\\,n',
      vars: {
        v: { name: 'tip speed', q: 'speed', unit: 'm/s' },
        D: { name: 'rotor diameter', q: 'length', unit: 'mm', value: 8 },
        n: { name: 'rotational speed', q: 'frequency', unit: 'rpm', value: 350000 }
      },
      note: 'n in revolutions per unit time. A dental turbine\'s tip moves at about half the speed of sound.',
      stories: { v: 'A dental turbine rotor of {D} spins at {n}. How fast does its rim move?', n: 'A rotor of {D} may not exceed a rim speed of {v}. What is its highest speed?' }
    },
    {
      name: 'Power of a spinning tool',
      expr: 'P = 2*pi*n*T', tex: 'P = 2\\pi n\\,T',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'W' },
        n: { name: 'rotational speed', q: 'frequency', unit: 'rpm', value: 200000 },
        T: { name: 'torque', q: 'torque', unit: 'N·mm', value: 0.7 }
      },
      note: 'Rotational speed in revolutions per unit time, so 2πn is the angular velocity.',
      stories: { P: 'Under load a turbine turns at {n} with a torque of {T}. What power does it deliver?', T: 'A turbine delivers {P} at {n}. What torque is that?' }
    },
    {
      name: 'How long a reserve cylinder lasts',
      expr: 't = V*(p - pr)/(patm*Q)', tex: 't = \\dfrac{V\\,(p_g - p_r)}{p_\\text{atm}\\,Q}',
      vars: {
        t: { name: 'duration', q: 'time', unit: 'min' },
        V: { name: 'cylinder water volume', q: 'volume', unit: 'L', value: 10 },
        p: { name: 'cylinder pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_g' },
        pr: { name: 'residual pressure left in the cylinder (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_r' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        Q: { name: 'free-air demand', q: 'airflow', unit: 'L/min ANR', value: 20 }
      },
      note: 'Ideal gas at constant temperature. At 200 bar real air is a little less compressible than an ideal gas, so the cylinder holds about 5 % less than this.',
      stories: { t: 'A {V} cylinder of medical air at {p} supplies {Q} until {pr} is left. How long does it last?', V: 'A supply of {Q} must last {t} from cylinders at {p} emptied to {pr}. What cylinder volume is needed?' }
    }
  ],
  examples: [
    {
      title: 'Half the speed of sound in a mouth',
      q: 'A dental turbine with an 8 mm rotor runs free at 400 000 rpm. How fast does the rim of the rotor move?',
      steps: [
        '$n = 400\\,000/60 = 6667$ revolutions per second.',
        '$v = \\pi D n = \\pi \\times 0.008 \\times 6667 = 168$ m/s — about half the speed of sound.',
        'The ball bearings of such a rotor are only a few millimetres across and run at similar surface speeds; they are why handpieces need clean, dry air and careful servicing.'
      ],
      a: 'About 170 m/s.'
    },
    {
      title: 'Riding out a compressor failure',
      q: 'A ward uses 150 L/min of medical air. The reserve manifold holds four 50 L cylinders at 200 bar gauge, used down to 10 bar. How long can it supply the ward?',
      steps: [
        'Free air available: $4 \\times 50 \\times (200 - 10)/1.013 = 37\\,500$ L.',
        'Duration: $37\\,500/150 = 250$ min, or about 4 hours — a little less in practice because air at 200 bar is not quite ideal.'
      ],
      a: 'About four hours.'
    }
  ],
  quiz: [
    { q: 'Why are medical air compressors usually oil-free?', choices: ['So that no oil or its breakdown products can reach air that patients breathe, even if a filter fails', 'Because oil-free compressors are cheaper', 'Because oil would freeze in the dryer', 'Because oil makes the air too humid'], a: 0,
      why: 'The oil limit for medical air is tiny (about 0.1 mg/m³); removing the source is the safest way to meet it.' },
    { q: 'Workshop compressed air, if well filtered, can be connected to a hospital\'s medical air outlets.', a: false,
      why: 'Medical air must meet pharmacopoeia limits, come from a validated, monitored plant and be identity-tested; nothing else may be connected to medical outlets.' },
    { q: 'A dental turbine with a 7 mm rotor spins at 300 000 rpm. What is its rim speed?', answer: 110, unit: 'm/s',
      why: 'v = πDn = π × 0.007 × 5000 = 110 m/s.' },
    { q: 'A dental turbine slows from 400 000 to about 200 000 rpm when it cuts. Why is that not a flaw?', choices: ['Its torque falls as its speed rises, so its power peaks near half the free speed — where it works', 'The air pressure falls when the dentist presses', 'The bearings seize under load', 'The water spray brakes it'], a: 0,
      why: 'For an air turbine or vane motor, torque falls roughly linearly with speed; power P = Tω is highest at about half the free-running speed.' }
  ],
  problems: [
    { q: 'A turbine delivers 15 W at 180 000 rpm. What torque is that?', answer: 0.796, unit: 'N·mm', tol: 0.02,
      steps: ['$\\omega = 2\\pi \\times 180\\,000/60 = 18\\,850$ rad/s.', '$T = P/\\omega = 15/18\\,850 = 7.96\\times10^{-4}$ N·m = 0.796 N·mm.'] }
  ],
  applications: ['Ventilators, anaesthesia machines and nebulisers on hospital pipelines.', 'Air-driven surgical drills and saws for bone.', 'Dental handpieces, air–water syringes and chair pneumatics.', 'Tourniquets, compression sleeves and alternating-pressure mattresses.'],
  history: 'An air-turbine dental handpiece was patented in New Zealand by John Walsh in 1949, and from the late 1950s turbines running at a few hundred thousand rpm replaced the belt-driven drills of a few thousand rpm, making drilling far quicker and less jarring for patients. Piped medical gases spread through hospitals in the mid-twentieth century; today their design and testing follow national and international standards such as ISO 7396-1.'
},

{
  id: 'aircraft-pneumatics', parent: 'applications-pneu', title: 'Pneumatics in aircraft', level: 2,
  short: 'Air tapped from jet engines\' compressors pressurises and heats the cabin, keeps ice off wings and inlets, and starts the engines; turboprops break ice off their wings with inflatable boots. The pressure difference loads the fuselage like a pressure vessel.',
  keywords: ['bleed air', 'cabin pressurisation', 'cabin altitude', 'outflow valve', 'air conditioning pack', 'anti-ice', 'de-icing boots', 'engine start', 'air turbine starter', 'plug door', 'hoop stress', 'fuselage fatigue', 'APU'],
  prereq: ['compressor-types', 'absolute-gauge-pressure', 'energy-in-compressed-air', 'aerodynamics:standard-atmosphere'],
  related: ['aerodynamics:icing', 'aerodynamics:turbofan', 'aerodynamics:turboprop', 'aerodynamics:pressure-altitude', 'hydraulics:aircraft-hydraulics', 'pressure-equipment', 'physics:stress-strain', 'chemistry:partial-pressures'],
  body: `
An airliner is full of compressed air. Its engines' compressors are the largest compressors most people will ever sit near, and a small part of what they compress is tapped off as **bleed air** to pressurise and heat the cabin, keep ice off the wings and engine inlets, and start the engines. Smaller aircraft add pneumatic de-icing boots, air-driven instruments and gas bottles that inflate escape slides or blow the landing gear down.

### Bleed air
Bleed air is taken from an intermediate or high-pressure compressor stage of each engine (or from the auxiliary power unit in the tail), cooled in a pre-cooler by fan air and regulated to roughly **2–3 bar gauge (30–45 psi) at 150–250 °C** in the ducts. It feeds:
- the **air-conditioning packs** — air-cycle machines that cool it by expanding it through a turbine before it enters the cabin;
- **thermal anti-ice**: hot air blown through perforated "piccolo" tubes inside the wing slats and the engine inlet lips;
- **engine starting**: an air-turbine starter on each engine, fed by the auxiliary power unit, a ground cart or a running engine;
- pressurisation of hydraulic reservoirs and water tanks, and cargo heating.

Bleed air is not free: the engine did the work of compressing it, and taking it costs fuel. At least one modern airliner design has no bleed system at all and pressurises its cabin with electrically driven compressors.

### Pressurising the cabin
At a cruise altitude of 11–12.5 km the outside air is at only 0.18–0.23 bar absolute. The cabin is not kept at sea-level pressure: it is held at a **cabin altitude** of at most 2400 m (8000 ft), about 0.75 bar, by an outflow valve that lets air out as fast as the packs bring it in. The difference, typically **0.55–0.6 bar (8–8.6 psi)**, loads the whole fuselage like a pressure vessel — every square metre of skin carries 5.5–6 tonne-force.

| Altitude | ISA pressure (absolute) |
|---|---|
| Sea level | 1.013 bar |
| 2400 m (8000 ft), cabin | 0.753 bar |
| 11 000 m (36 000 ft) | 0.226 bar |
| 12 500 m (41 000 ft) | 0.179 bar |

Doors are **plugs**, larger than their frames and pressed into them by the cabin pressure, so they cannot be opened in flight. The skin carries a hoop stress $\\sigma = \\Delta p\\,r/t$ — about 70 MPa in a 1.6 mm skin on a 1.95 m radius — once every flight, which is why fuselages are inspected for fatigue and why cut-outs have rounded corners. Holding the cabin below sea-level pressure keeps these loads, and the fatigue, smaller.

### Ice: anti-icing and de-icing
Flying through supercooled cloud, an aircraft collects ice on its leading edges, which spoils the lift ([[aerodynamics:icing]]). Jets keep their leading edges hot with bleed air (**anti-icing**). Turboprops and piston twins use **pneumatic de-icing boots**: rubber sheets on the leading edges with tubes that inflate for a few seconds to roughly 1–1.3 bar gauge (15–20 psi), cracking the ice so the airflow carries it away, and are then sucked flat by vacuum. Boots remove ice after it has formed; crews operate them as the aircraft's approved manual directs.

> [!warn] Bleed ducts carry air hot enough to burn, at pressure; they are watched by overheat detection loops. On the ground a door must never be forced while the cabin is still pressurised: even 0.05 bar on a 1.9 m² door pushes with almost a tonne-force. Aircraft maintenance follows the approved manuals.
`,
  ideas: [
    'Bleed air from the engine compressors, regulated to about 2–3 bar and cooled, pressurises and heats the cabin, anti-ices and starts the engines.',
    'The cabin is held at an altitude of at most 2400 m (0.75 bar), a difference of about 0.55–0.6 bar at cruise.',
    'That difference loads the fuselage: a door carries about 11 t-force, the skin a hoop stress of about 70 MPa every flight.',
    'Anti-icing keeps surfaces hot so ice never forms; de-icing boots inflate to crack off ice that has formed.'
  ],
  pitfalls: [
    'The cabin is pressurised to sea level — It is held at a cabin altitude of 1800–2400 m (6000–8000 ft); full sea-level pressure would raise the structural loads by nearly half.',
    'Anti-icing and de-icing are the same thing — Anti-icing (hot air, heaters) stops ice forming; de-icing (boots) removes ice that has already built up.',
    'Bleed air is free because the engine is running anyway — The engine did work compressing that air; extracting it raises fuel burn.'
  ],
  formulas: [
    {
      name: 'Pressure load on a door or panel',
      expr: 'F = dp*A', tex: 'F = \\Delta p\\,A',
      vars: {
        F: { name: 'force on the door', q: 'force', unit: 'kN' },
        dp: { name: 'cabin-to-outside pressure difference', q: 'pressure', unit: 'bar', value: 0.58, tex: '\\Delta p' },
        A: { name: 'door area', q: 'area', unit: 'm²', value: 1.9 }
      },
      stories: { F: 'A cabin door of {A} holds a pressure difference of {dp}. What force presses on it?', dp: 'A door of {A} carries {F}. What is the pressure difference across it?' }
    },
    {
      name: 'Hoop stress in the fuselage skin',
      expr: 'sigma = dp*r/t', tex: '\\sigma = \\dfrac{\\Delta p\\,r}{t}',
      vars: {
        sigma: { name: 'hoop stress', q: 'stress', unit: 'MPa', tex: '\\sigma' },
        dp: { name: 'cabin-to-outside pressure difference', q: 'pressure', unit: 'bar', value: 0.58, tex: '\\Delta p' },
        r: { name: 'fuselage radius', q: 'length', unit: 'm', value: 1.95 },
        t: { name: 'skin thickness', q: 'length', unit: 'mm', value: 1.6 }
      },
      note: 'A thin-walled cylinder with the whole load in the skin; frames and stringers share it in reality, and the lengthwise stress is half the hoop stress.',
      stories: { sigma: 'A fuselage of radius {r} with a {t} skin holds {dp}. What hoop stress does the skin carry?', t: 'A fuselage of radius {r} holds {dp}, and the skin may carry {sigma}. How thick must it be?' }
    },
    {
      name: 'Oxygen partial pressure in the cabin',
      expr: 'pO2 = x*p', tex: 'p_{O_2} = x\\,p_c',
      vars: {
        pO2: { name: 'oxygen partial pressure', q: 'pressure', unit: 'bar', tex: 'p_{O_2}' },
        x: { name: 'oxygen fraction of air', q: 'ratio', unit: '%', value: 20.95, min: 0, max: 100 },
        p: { name: 'cabin pressure (absolute)', q: 'pressure', unit: 'bar', value: 0.753, tex: 'p_c' }
      },
      note: 'Dalton\'s law: what the lungs feel is the partial pressure of oxygen, not its percentage.',
      stories: { pO2: 'A cabin is held at {p}. What is the partial pressure of oxygen in it?' }
    }
  ],
  examples: [
    {
      title: 'Why doors are plugs',
      q: 'At cruise the cabin is 0.58 bar above the outside air. What force presses on a 1.9 m² passenger door?',
      steps: [
        '$F = \\Delta p\\,A = 0.58\\times10^5 \\times 1.9 = 110\\,000$ N.',
        'That is the weight of about 11 tonnes: no latch mechanism need resist it if the door is a plug, pressed into its frame from the inside.'
      ],
      a: 'About 110 kN, the weight of 11 tonnes.'
    },
    {
      title: 'A pressure vessel with wings',
      q: 'A fuselage of 1.95 m radius has a 1.6 mm aluminium-alloy skin and flies with 0.58 bar across it. What hoop stress does the skin carry?',
      steps: [
        '$\\sigma = \\Delta p\\,r/t = 0.58\\times10^5 \\times 1.95/0.0016 = 70.7\\times10^6$ Pa = 71 MPa.',
        'That is well under the alloy\'s yield strength of about 300 MPa; the margin is there because the load is applied and removed once per flight, tens of thousands of times over the aircraft\'s life, and fatigue cracks start at holes and corners.'
      ],
      a: 'About 71 MPa per flight.'
    },
    {
      title: 'Thin air in the cabin',
      q: 'The cabin is at 2400 m cabin altitude (0.753 bar absolute). What is the oxygen partial pressure, and what oxygen percentage at sea level would give the same?',
      steps: [
        '$p_{O_2} = 0.2095 \\times 0.753 = 0.158$ bar, against 0.212 bar at sea level.',
        'Same partial pressure at sea level: $0.158/1.013 = 15.6$ % oxygen.'
      ],
      a: '0.158 bar — like breathing 15.6 % oxygen at sea level, which healthy people tolerate well.'
    }
  ],
  quiz: [
    { q: 'Where does most airliners\' cabin air come from?', choices: ['Air bled from the engines\' compressors, cooled in air-conditioning packs', 'Oxygen bottles in the hold', 'Ram air scooped in at cruise', 'Recirculated air only, with no fresh supply'], a: 0,
      why: 'Bleed air (or, on a few designs, air from electric compressors) is the fresh supply; part of the cabin air is filtered and recirculated alongside it.' },
    { q: 'A 1.2 m² door holds a pressure difference of 0.55 bar. What force presses on it?', answer: 66, unit: 'kN',
      why: '0.55×10⁵ Pa × 1.2 m² = 66 000 N = 66 kN.' },
    { q: 'Pneumatic de-icing boots prevent ice from forming on the wing.', a: false,
      why: 'Boots are de-icers: they inflate to crack off ice that has already formed. Keeping ice from forming is anti-icing, done with hot bleed air or electric heaters.' },
    { q: 'Why is the cabin not kept at sea-level pressure in cruise?', choices: ['The larger pressure difference would raise the loads and fatigue on the fuselage', 'Passengers breathe better at lower pressure', 'The engines cannot supply any more air', 'The outflow valve cannot close further'], a: 0,
      why: 'At 12.5 km a sea-level cabin would need 0.83 bar across the skin instead of about 0.57 bar — 45 % more load, every flight.' }
  ],
  problems: [
    { q: 'A fuselage of 2.8 m radius with a 2.0 mm skin flies with 0.6 bar across it. What hoop stress does the skin carry?', answer: 84, unit: 'MPa', tol: 0.02,
      steps: ['$\\sigma = 0.6\\times10^5 \\times 2.8/0.002 = 84\\times10^6$ Pa = 84 MPa.'] }
  ],
  applications: ['Cabin pressurisation, air conditioning and cargo heating in airliners and business jets.', 'Wing and engine anti-icing with hot bleed air.', 'De-icing boots on turboprops and piston twins.', 'Engine starting with air-turbine starters; slides and emergency gear extension by gas bottles.'],
  history: 'Pressurised cabins entered airline service at the end of the 1930s and became universal with the jet age. The first jet airliner lost two aircraft in 1954 to fatigue cracks that grew from the corners of cut-outs in its pressurised fuselage — lessons that shaped fatigue testing and rounded windows ever since. Inflatable rubber de-icing boots date from the early 1930s and still fly on turboprops today.'
},

{
  id: 'soft-robotics', parent: 'applications-pneu', title: 'Soft robotics', level: 2,
  short: 'Robots made mostly of rubber: elastomer fingers with air chambers that stretch on one side and bend when inflated at 0.3–1 bar, grippers that pick fruit, bread and eggs without bruising them, and jamming grippers that lock around any shape.',
  keywords: ['soft robotics', 'soft actuator', 'soft gripper', 'elastomer', 'silicone', 'PneuNet', 'chambered actuator', 'strain-limiting layer', 'fibre-reinforced actuator', 'jamming gripper', 'food handling', 'McKibben'],
  prereq: ['bellows-muscles', 'grippers', 'proportional-pressure', 'physics:stress-strain'],
  related: ['pick-and-place', 'vacuum-basics', 'holding-force', 'suction-cups', 'physics:hookes-law', 'physics:friction', 'physics:torque'],
  body: `
A soft robot is made mostly of rubber. Instead of rigid links and joints turned by motors, it has elastomer bodies with air chambers inside, and it moves by inflating them. It cannot lift an engine block, but it can pick a strawberry, a croissant or an egg without bruising or crushing it, wrap around shapes no one programmed, and survive being stepped on.

### How a soft finger bends
The commonest soft actuator is a finger moulded from silicone with a row of chambers along one side and a **strain-limiting layer** — paper, fabric or a much stiffer rubber that hardly stretches — along the other. Inflate the chambers and their walls stretch: the chambered side grows longer while the limited side cannot, so the finger curls towards the limited side, like a bimetal strip heated. For small bends a linear model gives the angle

$$\\theta \\approx \\frac{L}{h}\\,\\frac{p_g}{E}$$

with $L$ the finger's length, $h$ the distance from the limiting layer to the chamber walls, and $E$ an effective stiffness of the chambered layer — fitted by experiment, because it includes the chamber geometry. An 80 mm finger with $h$ = 10 mm and $E$ = 0.4 MPa bends about 57° at 0.5 bar. At larger strains the rubber stiffens, so the angle grows more slowly than the pressure; far beyond its rating a wall balloons and bursts.

Other designs wrap a tube of rubber in fibres: wound at the right angles, the fibres stop it ballooning and make it extend, bend or twist. Braided **fluidic muscles** contract as they inflate ([[bellows-muscles]]).

### Pressures and forces
| Actuator | Pressure | Motion | Force |
|---|---|---|---|
| Chambered bending finger | 0.3–1 bar | bends 90–270° | about 1–5 N at the tip |
| Fibre-reinforced actuator | 0.5–2 bar | bends, extends, twists | 5–20 N |
| Braided fluidic muscle | 3–6 bar | contracts up to about 25 % | hundreds of N to kN |
| Granular jamming gripper | −0.5 to −0.9 bar | conforms, then locks | 10–100 N holding |

Pressed against an object, a finger stops bending and further pressure becomes force. A moment balance about the finger's root gives the blocked tip force $F \\approx p_g A_w\\,y/L$: the pressure on a chamber's end wall of area $A_w$, acting a distance $y$ from the limiting layer, divided by the finger's length.

### Grippers for food and fragile things
Soft grippers shine where parts vary in shape and must not be damaged: fruit and vegetables, bakery products, meat and fish, eggs, flowers, blister packs. Two to six fingers wrap around the part and spread the grip over a large contact area at low pressure; the fingers are cheap to cast, easy to wash down and harmless to a person they touch. Control is simple — a proportional pressure regulator ([[proportional-pressure]]) sets the grip, and a slight vacuum opens the fingers wide. The limits are low force, slow response (the chambers must fill), fatigue and puncture of the rubber, and positions that depend on the load.

A cousin, the **jamming gripper**, is a rubber bag of fine granules: pressed soft around an object, then evacuated so the granules lock into a rigid shape that holds it — a suction cup's physics ([[vacuum-basics]]) turned into a hand.

> [!warn] Soft actuators work at a fraction of normal line pressure. Feed them through a pressure regulator set to their rating, with a relief valve, never straight from a 6 bar line: an over-pressurised finger bursts with a bang and throws rubber. As with any gripper, a part it holds can drop if the air fails.
`,
  ideas: [
    'A soft finger bends because its chambered side stretches while a strain-limiting layer on the other side does not.',
    'Small bends follow $\\theta \\approx (L/h)(p_g/E)$; at large strains the rubber stiffens and the bend grows more slowly.',
    'Soft actuators run at 0.3–1 bar and give a few newtons — enough for food and fragile parts, with gentle, spread-out contact.',
    'Once a finger touches an object, extra pressure turns into grip force: $F \\approx p_g A_w y/L$.'
  ],
  pitfalls: [
    'Soft means weak and useless — Soft grippers are chosen exactly where rigid ones fail: varied, delicate products, washdown, and working next to people.',
    'More pressure always bends further — The rubber stiffens at large strains, contact turns pressure into force instead of bending, and above its rating the actuator bursts.',
    'A soft gripper can run on the plant\'s 6 bar air like a cylinder — It needs a regulated supply at its own rating, usually below 1 bar.'
  ],
  formulas: [
    {
      name: 'Bending of a chambered soft finger (small bends)',
      expr: 'theta = L*p/(h*E)', tex: '\\theta = \\dfrac{L}{h}\\,\\dfrac{p_g}{E}',
      vars: {
        theta: { name: 'bend angle of the tip', q: 'angle', unit: '°', tex: '\\theta' },
        L: { name: 'finger length', q: 'length', unit: 'mm', value: 80 },
        p: { name: 'chamber pressure (gauge)', q: 'pressure', unit: 'bar', value: 0.5, tex: 'p_g' },
        h: { name: 'distance, limiting layer to chamber walls', q: 'length', unit: 'mm', value: 10 },
        E: { name: 'effective stiffness of the chambered layer (fitted)', q: 'stress', unit: 'MPa', value: 0.4 }
      },
      note: 'A linear, constant-curvature model: the chambered side stretches by the strain $p_g/E$ and the finger curls as a bimetal strip does. Real fingers stiffen at large strains; E is fitted from a test.',
      stories: { theta: 'A soft finger {L} long, with {h} between its limiting layer and its chambers and an effective stiffness of {E}, is inflated to {p}. How far does it bend?', p: 'A finger {L} long ({h}, {E}) must bend by {theta}. What pressure does the linear model predict?' }
    },
    {
      name: 'Blocked tip force of a soft finger',
      expr: 'F = p*Aw*y/L', tex: 'F = \\dfrac{p_g\\,A_w\\,y}{L}',
      vars: {
        F: { name: 'tip force when blocked', q: 'force', unit: 'N' },
        p: { name: 'pressure above that needed to reach the object (gauge)', q: 'pressure', unit: 'bar', value: 0.5, tex: 'p_g' },
        Aw: { name: 'chamber end-wall area', q: 'area', unit: 'cm²', value: 3, tex: 'A_w' },
        y: { name: 'lever arm, limiting layer to the wall\'s centre', q: 'length', unit: 'mm', value: 8 },
        L: { name: 'finger length (root to contact)', q: 'length', unit: 'mm', value: 80 }
      },
      note: 'A moment balance about the root: the pressure on the chamber walls makes a bending moment, and the object resists it at the tip. The pressure used is the part above what was needed to bend the finger to the object.',
      stories: { F: 'A soft finger {L} long, whose chambers have end walls of {Aw} at {y} from the limiting layer, presses on an object with {p} more than it needed to reach it. What force does its tip apply?' }
    }
  ],
  examples: [
    {
      title: 'Pressure for a right angle',
      q: 'A finger is 80 mm long with h = 10 mm and an effective stiffness of 0.4 MPa. What pressure does the linear model predict for a 90° bend?',
      steps: [
        '$\\theta = 90° = \\pi/2 = 1.571$ rad.',
        '$p_g = \\theta\\,h\\,E/L = 1.571 \\times 0.01 \\times 0.4\\times10^6/0.08 = 78\\,500$ Pa = 0.79 bar.',
        'The rubber stiffens at these strains, so the real finger needs somewhat more — one reason fingers are tested and the model fitted.'
      ],
      a: 'About 0.8 bar.'
    },
    {
      title: 'Will it hold a strawberry?',
      q: 'Two such fingers (chamber end walls 3 cm², y = 8 mm) close on a 25 g strawberry. They touch it at 0.3 bar and are then taken to 0.6 bar. The friction coefficient is 0.6 and the gripper lifts at 10 m/s². Does it hold, and with what margin?',
      steps: [
        'Force per finger: $F = (0.6 - 0.3)\\times10^5 \\times 3\\times10^{-4} \\times 0.008/0.08 = 0.9$ N.',
        'Friction from two fingers: $2 \\times 0.6 \\times 0.9 = 1.08$ N.',
        'Needed while lifting: $0.025 \\times (9.81 + 10) = 0.50$ N.',
        'Safety factor: $1.08/0.50 = 2.2$, with less than a newton on the fruit.'
      ],
      a: 'Yes, with a safety factor of about 2 and under 1 N per finger.'
    }
  ],
  quiz: [
    { q: 'A chambered soft finger bends when inflated because…', choices: ['the chambered side stretches while the strain-limiting layer does not', 'the air pushes the tip sideways', 'the rubber shrinks on one side', 'a cable inside pulls it'], a: 0,
      why: 'Like a bimetal strip, unequal lengthening of two bonded layers makes it curl towards the side that stays short.' },
    { q: 'A soft finger is 100 mm long, with h = 12 mm and an effective stiffness of 0.5 MPa. What pressure bends it by 60° in the linear model?', answer: 0.628, unit: 'bar',
      why: 'p = θhE/L = 1.047 × 0.012 × 0.5×10⁶/0.1 = 62 800 Pa = 0.63 bar.' },
    { q: 'Feeding a soft gripper with 6 bar instead of 0.6 bar makes it grip ten times as hard.', a: false,
      why: 'The elastomer would balloon and burst long before; soft actuators are rated for a fraction of a bar and need a regulator.' },
    { q: 'What is the main advantage of soft grippers for food?', choices: ['They conform to irregular shapes and spread a gentle grip, so they hold without bruising and can be washed down', 'They are stronger than steel grippers', 'They need no air at all', 'They position parts to 0.01 mm'], a: 0,
      why: 'Low contact pressure over a large area and tolerance of shape variation are exactly what fruit, bread and meat need.' }
  ],
  applications: ['Food handling: fruit, vegetables, bakery products, meat and fish.', 'Packaging of fragile or irregular items: eggs, flowers, blister packs.', 'Rehabilitation and assistive devices: soft gloves and wearable actuators.', 'Research robots that crawl, swim or squeeze through gaps.'],
  history: 'Joseph McKibben developed a braided pneumatic muscle in the 1950s to power an orthosis for a person paralysed by polio. Soft robotics as a field took off around 2010, when university laboratories began casting silicone fingers with networks of chambers and showed that a balloon of granules, jammed by vacuum, could pick up almost anything.',
  sim: 'app-soft-finger'
}

);
