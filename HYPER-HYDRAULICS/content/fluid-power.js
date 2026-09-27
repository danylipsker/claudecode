/* HYPER-HYDRAULICS · content/fluid-power.js — the introduction to oil hydraulics and its applications:
 *   fluid-power-intro   fluid power, the anatomy of a system, pressure-flow-power, force multiplication,
 *                       losses and heat, hydraulic versus pneumatic and electric
 *   symbols-diagrams    ISO 1219 symbols, reading a circuit diagram, ports and designations
 *   applications        excavators and tractors, presses and machine tools, aircraft, brakes and steering,
 *                       lifts, jacks and cranes
 * Simulations in sims/fluid-power.js (ids fp-…). */
Hyper.add(

/* ======================================================================== WHAT HYDRAULIC POWER IS */
{
  id: 'fluid-power', parent: 'fluid-power-intro', title: 'Fluid power', level: 1,
  short: 'Sending power down a pipe: a pump turns rotation into a stream of oil under pressure, valves steer and meter it, and cylinders and motors turn it back into force and motion. At 100–400 bar it packs enormous, controllable force into small actuators.',
  keywords: ['fluid power', 'oil hydraulics', 'hydrostatic', 'hydrodynamic', 'hydraulic power', 'power density', 'actuator', 'prime mover', 'pump', 'cylinder', 'hydraulic motor', 'Bramah', 'Armstrong'],
  prereq: ['pascals-law', 'pressure-definition', 'physics:power'],
  related: ['hydraulic-system', 'pressure-flow-power', 'force-multiplication', 'hydraulics-vs-alternatives', 'hydraulic-cylinder', 'positive-displacement', 'hydraulic-motors', 'hydraulic-safety'],
  body: `
**Fluid power** is the art of sending energy down a pipe. A pump turns the rotation of an electric motor or a diesel engine into a stream of liquid under pressure; valves decide where that stream goes, how fast and how hard; and at the far end a **cylinder** or a **hydraulic motor** turns it back into force and motion. With oil at 100–400 bar this is **oil hydraulics**; with compressed air at about 6 bar it is [[pneumatics:pneumatic-cylinder|pneumatics]]. These pages are about liquids.

### Pressure carries the power, not speed
A liquid can carry energy in two ways. A turbine or a car's torque converter uses the liquid's *speed* — its kinetic energy — and is called **hydrodynamic**. Fluid power is **hydrostatic**: the oil moves slowly, a few metres per second, but under great pressure, and the pressure does the work. The numbers settle it. Oil ($\\rho \\approx 870$ kg/m³) at 5 m/s carries $\\tfrac12\\rho v^2 \\approx 11$ kJ/m³ as kinetic energy; the same cubic metre at 250 bar carries 25 MJ/m³ as pressure energy (1 Pa = 1 J/m³) — over two thousand times more. So the whole subject reduces to two quantities, pressure and flow, and their product is the power ([[pressure-flow-power]]).

### From shaft to shaft
Every system is the same chain ([[hydraulic-system]]):
1. a **prime mover** — electric motor or engine — turns the pump;
2. the **pump** pushes out a fixed volume per revolution: it makes *flow*, and the load makes the *pressure* ([[positive-displacement]]);
3. **valves** set the direction, cap the pressure and meter the flow;
4. **actuators** — cylinders and motors — do the work;
5. the oil returns to a **reservoir**, where it cools and settles.

### Why a liquid?
Oil hardly compresses and passes pressure on in every direction ([[pascals-law]]), so a modest pressure on a piston makes a large force in a small space:

| At 250 bar | Force or torque | Roughly |
|---|---|---|
| Cylinder, 50 mm bore | 49 kN | 5 tonnes |
| Cylinder, 100 mm bore | 196 kN | 20 tonnes |
| Cylinder, 200 mm bore | 785 kN | 80 tonnes |
| Motor, 45 cm³/rev | 179 N·m | from standstill to 3000 rpm |

A bent-axis piston motor of 45 cm³/rev weighs about 15 kg and, at 3000 rpm and 330 bar, delivers some 75 kW; an industrial electric motor of that power weighs several hundred kilograms. Add **stepless control** of speed and force, **overload protection** (a relief valve caps the pressure and a stalled cylinder simply stops), **load holding** with the valves closed, **stiffness** from oil's bulk modulus of about 1.5 GPa, and power carried by hoses round the joints of a moving arm. The price is leaks and fire risk, sensitivity to dirt, noise, heat from throttling ([[energy-losses-heat]]) and the hazard of stored energy — [[hydraulics-vs-alternatives]] weighs them.

### Where it works
| Field | Typical working pressure |
|---|---|
| Machine tools, industrial power units | 70–250 bar |
| Excavators, cranes, loaders | 250–350 bar, some to 420 |
| Airliners | 207 bar (3000 psi) or 345 bar (5000 psi) |
| Car brakes | up to about 150 bar in an emergency stop |
| Presses | 200–400 bar |
| Pneumatics, for comparison | 6–7 bar |

> [!warn] Hydraulic systems store energy in pressurised oil, accumulators and raised loads. Before any work, lower or support the load, stop the pump, release the pressure and lock out the machine. Never feel for a leak with a hand: oil from a pinhole at high pressure can be injected through the skin — the wound looks small but is a surgical emergency; seek emergency medical care at once.
`,
  ideas: [
    'Fluid power moves energy with a liquid under pressure: pump → valves → actuator → back to the tank.',
    'Hydrostatic drives carry power as pressure, not as the speed of the oil; the oil itself moves slowly.',
    'The pump makes flow; the load makes pressure; the relief valve caps it.',
    'High pressure on a small piston gives very large forces and torques in a small, light actuator.',
    'Stepless control, overload protection and load holding come almost free; leaks, heat and stored energy are the price.'
  ],
  pitfalls: [
    'A hydraulic pump makes pressure — It makes flow. Pressure rises only as far as the load and the losses in the lines require, up to the relief setting.',
    'Fluid power works by squirting oil fast, like a jet — In hydrostatic systems the oil moves at a few metres per second; the energy is in its pressure, over a thousand times more than in its motion.',
    'Hydraulics multiplies energy, since a small pump lifts a huge load — It multiplies force, and pays for it in distance and time: power out never exceeds power in.'
  ],
  formulas: [
    {
      name: 'Force of a piston',
      expr: 'F = p*pi*D^2/4', tex: 'F = p\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'piston force', q: 'force', unit: 'kN' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 250 },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Gauge pressure on the full piston area, no back-pressure or seal friction (take 2–5 % off for friction).',
      practice: { unknowns: ['F', 'D', 'p'] },
      stories: {
        F: 'A cylinder with a bore of {D} is fed with oil at {p}. What force does it push with?',
        D: 'A cylinder working at {p} must push {F}. What bore does it need?',
        p: 'A cylinder with a bore of {D} must push {F}. What pressure does that take?'
      }
    },
    {
      name: 'Torque of a hydraulic motor (ideal)',
      expr: 'T = Vg*dp/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p}{2\\pi}',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 45, tex: 'V_g' },
        dp: { name: 'pressure difference across the motor', q: 'pressure', unit: 'bar', value: 330, tex: '\\Delta p' }
      },
      note: 'The ideal torque; a real motor gives 90–95 % of it (its hydro-mechanical efficiency). The torque does not depend on the speed.',
      stories: {
        T: 'A hydraulic motor of {Vg} works with {dp} across it. What torque does it give, ignoring losses?',
        Vg: 'A winch needs {T} at a pressure difference of {dp}. What motor displacement is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'A coffee tin that lifts 20 tonnes',
      q: 'A cylinder has a 100 mm bore, about the size of a coffee tin, and is fed at 250 bar. What can it push?',
      steps: [
        'Piston area: $A = \\pi D^2/4 = \\pi \\times 0.1^2/4 = 7.85\\times10^{-3}$ m².',
        'Force: $F = pA = 2.5\\times10^{7} \\times 7.85\\times10^{-3} = 1.96\\times10^{5}$ N.',
        'In tonnes: $196\\,000/9.81 = 20\\,000$ kg — about the weight of a loaded lorry.'
      ],
      a: 'About 196 kN, the weight of 20 tonnes.'
    },
    {
      title: 'Where the energy is',
      q: 'Oil ($\\rho = 870$ kg/m³) flows in a pressure line at 4 m/s and 200 bar. Compare the kinetic energy and the pressure energy in each cubic metre.',
      steps: [
        'Kinetic energy per volume: $\\tfrac12\\rho v^2 = 0.5 \\times 870 \\times 16 = 6960$ J/m³, about 7 kJ/m³.',
        'Pressure energy per volume: $p = 2\\times10^7$ Pa $= 2\\times10^7$ J/m³ = 20 MJ/m³.',
        'Ratio: $2\\times10^7/6960 \\approx 2900$. Stopping the flow entirely would change the pressure by only a few hundred bar at most through the Joukowsky surge ([[joukowsky-surge]]); the steady power is carried by pressure.'
      ],
      a: 'About 7 kJ/m³ kinetic against 20 MJ/m³ pressure — nearly 3000 times more in the pressure.'
    }
  ],
  quiz: [
    { q: 'What does a positive-displacement hydraulic pump actually produce?', choices: ['pressure', 'flow', 'force', 'torque'], a: 1,
      why: 'It pushes out a fixed volume per revolution — a flow. The pressure is whatever the load and the line losses demand, up to the relief-valve setting.' },
    { q: 'In a hydrostatic system, most of the energy the oil carries is…', choices: ['the kinetic energy of the moving oil', 'pressure energy', 'heat', 'potential energy of height'], a: 1,
      why: 'At a few m/s the kinetic energy is a few kJ/m³, while 200 bar is 20 MJ/m³ of pressure energy.' },
    { q: 'What force does a 50 mm bore cylinder produce at 200 bar (ignore friction)?', answer: 39.3, unit: 'kN', tol: 0.02,
      why: '$A = \\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m²; $F = 2\\times10^7 \\times 1.963\\times10^{-3} = 39.3$ kN.' },
    { q: 'The torque converter in a car\'s automatic gearbox is an example of hydrostatic fluid power.', a: false,
      why: 'A torque converter transmits power through the speed of the oil thrown between its impeller and turbine — it is hydrodynamic. Hydrostatic systems carry power as pressure.' },
    { q: 'Why can a hydraulic cylinder be stalled against a solid stop without damage?', choices: ['oil is compressible enough to absorb any force', 'the relief valve caps the pressure, so the force cannot exceed p × A', 'the pump stops automatically', 'the hoses stretch'], a: 1,
      why: 'The force is pressure times area, and the relief valve limits the pressure. The pump flow goes over the relief valve (as heat) while the cylinder stands still.' }
  ],
  problems: [
    { q: 'A hydraulic motor of 80 cm³/rev works with a pressure difference of 250 bar. What torque does it give, ignoring losses?', answer: 318.3, unit: 'N·m', tol: 0.02,
      steps: ['$T = V_g\\,\\Delta p/(2\\pi) = 80\\times10^{-6} \\times 2.5\\times10^{7}/(2\\pi)$.', '$T = 2000/6.283 = 318$ N·m.'] },
    { q: 'A 20-tonne load (196 kN) must be pushed by a cylinder at 200 bar. What is the smallest bore, ignoring friction?', answer: 111.7, unit: 'mm', tol: 0.02,
      steps: ['$A = F/p = 196\\,000/2\\times10^7 = 9.8\\times10^{-3}$ m².', '$D = \\sqrt{4A/\\pi} = 0.1117$ m = 112 mm; the next standard bore is 125 mm.'] }
  ],
  applications: [
    'Excavators, loaders, cranes and tractors — almost every heavy mobile machine moves on hydraulics.',
    'Presses, injection-moulding machines and machine-tool clamps, where large controlled forces are needed.',
    'Aircraft flight controls, landing gear and brakes, where power per kilogram matters most.',
    'Car brakes and power steering, ship steering gear, stage machinery, theme-park rides.'
  ],
  history: 'Blaise Pascal stated the principle in the 1650s; Joseph Bramah built the first practical hydraulic press in 1795. William Armstrong\'s hydraulic cranes (1840s) and his weighted accumulator made water power practical in docks, and the London Hydraulic Power Company pumped water at about 50 bar through nearly 300 km of street mains from 1883 until 1977 — Tower Bridge was opened by it. Oil took over in the twentieth century: the Williams–Janney axial piston pump (1905) turned warship gun turrets, and Harry Vickers\' balanced vane pump and pilot-operated relief valve (1920s) founded industrial oil hydraulics.',
  sim: 'fp-jack'
},

{
  id: 'hydraulic-system', parent: 'fluid-power-intro', title: 'Anatomy of a hydraulic system', level: 1,
  short: 'Reservoir, pump and prime mover, relief valve, directional and control valves, actuators, filters, cooler, accumulator and gauges — what each part of a hydraulic system does as the oil goes round, and how open and closed circuits differ.',
  keywords: ['hydraulic system', 'power unit', 'power pack', 'reservoir', 'tank', 'pump', 'relief valve', 'directional valve', 'actuator', 'filter', 'cooler', 'accumulator', 'open circuit', 'closed circuit', 'suction line', 'return line', 'manifold'],
  prereq: ['fluid-power', 'pressure-flow-power', 'flow-rate'],
  related: ['reservoirs', 'positive-displacement', 'relief-valve', 'directional-valves', 'hydraulic-cylinder', 'filtration', 'heat-coolers', 'accumulators', 'line-sizing', 'hydrostatic-transmission', 'basic-circuit', 'reading-circuit-diagrams'],
  body: `
Open the side of a machine tool or look under the cab of a tractor and you meet the same family of parts, however different the machines. Follow the oil round the circuit and each part has a job.

### The journey of the oil
1. **Reservoir (tank).** Holds the oil, lets air bubbles rise and dirt settle, and sheds some heat. Industrial tanks hold about 3–5 minutes of pump flow; mobile machines, short of space, often 1–2 minutes or less ([[reservoirs]]).
2. **Suction line.** The pump inlet must stay full: a short, wide line, the tank above the pump if possible, oil at under about 1 m/s. A starved pump cavitates and is destroyed ([[cavitation]]).
3. **Pump and prime mover.** A positive-displacement pump delivers $Q = V_g\\,n\\,\\eta_v$ almost regardless of pressure ([[displacement-flow]]). An electric motor drives it through a coupling and bell housing, or an engine through a gearbox.
4. **Pressure-relief valve.** The first component after the pump. It caps the pressure and so protects the pump, the hoses and the machine ([[relief-valve]]).
5. **Directional control valves**, usually on a manifold block, send the oil to the actuators; **pressure** and **flow** valves shape it ([[directional-valves]], [[flow-control]]).
6. **Actuators**: cylinders for straight-line motion, motors for rotation ([[hydraulic-cylinder]], [[hydraulic-motors]]).
7. **Return line, filter and cooler.** Returning oil is filtered, typically to 10 µm, and cooled before it falls back into the tank ([[filtration]], [[heat-coolers]]).

Around them sit **accumulators** that store oil under pressure ([[accumulators]]), **gauges and test points** to measure pressure, **pressure switches and transducers**, a **level and temperature gauge** on the tank, a **breather** that filters the air the tank inhales, and the **hoses, tubes and fittings** that join everything ([[hoses-fittings]]). Pump, motor, tank, relief valve, filter and cooler are often built as one **power unit**.

### Open and closed circuits
In an **open circuit** the pump draws from the tank and the actuators return to it: nearly every cylinder circuit is open. In a **closed circuit** the pump's outlet feeds a motor whose outlet goes straight back to the pump's inlet, and a small **charge pump** makes up the leakage; the direction and speed are set by tilting the pump. Closed circuits drive wheels, winches and drums ([[hydrostatic-transmission]]).

### Sizing at a glance
| Line | Oil velocity | Reason |
|---|---|---|
| Suction | 0.5–1.2 m/s | keep the inlet pressure up |
| Return | 2–4 m/s | low back-pressure on the actuators |
| Pressure | 3–6 m/s (to 8 at high pressure) | pressure loss against pipe size and weight |

The velocity is the flow over the bore area, $v = 4Q/\\pi d^2$ ([[line-sizing]]). A differential cylinder returns more oil than the pump delivers while it retracts, so return lines are sized for that larger flow ([[area-ratio]]).

> [!warn] Every one of these parts can hold pressure after the pump stops — accumulators especially. Before opening any part of a system, stop and lock out the drive, lower or support loads, discharge accumulators and prove the pressure is zero on a gauge.
`,
  ideas: [
    'Every system has the same chain: tank → pump → relief valve → control valves → actuators → filter and cooler → tank.',
    'The relief valve sits right after the pump and sets the highest pressure anywhere in the system.',
    'The tank does more than store oil: it settles air and dirt and sheds heat.',
    'Open circuits return to the tank; closed circuits loop pump and motor with a charge pump for leakage.',
    'Lines are sized by oil velocity: slow in suction, moderate in return, faster in pressure lines.'
  ],
  pitfalls: [
    'The suction line can be as thin as the pressure line — The pump inlet can only use the atmosphere\'s push; a thin or long suction line drops the inlet pressure until the oil releases air and cavitates.',
    'The tank only stores oil — It also lets air rise out, dirt settle and heat escape; a tank too small for the flow gives foamy, hot, dirty oil.',
    'Stopping the pump makes the system safe — Accumulators, trapped oil behind closed valves and raised loads keep their pressure; it must be released and proved zero.'
  ],
  formulas: [
    {
      name: 'Pump flow',
      expr: 'Q = Vg*n*etav', tex: 'Q = V_g\\,n\\,\\eta_v',
      vars: {
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 28, tex: 'V_g' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1450 },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 95, min: 1, max: 100, tex: '\\eta_v' }
      },
      note: 'The volumetric efficiency accounts for internal leakage, which grows with pressure and falls with viscosity (typically 90–98 %).',
      stories: {
        Q: 'A pump of {Vg} turns at {n} with a volumetric efficiency of {etav}. What flow does it deliver?',
        Vg: 'A power unit must deliver {Q} with its motor at {n} and a volumetric efficiency of {etav}. What pump displacement is needed?'
      }
    },
    {
      name: 'Oil velocity in a line',
      expr: 'v = 4*Q/(pi*d^2)', tex: 'v = \\dfrac{4Q}{\\pi d^2}',
      vars: {
        v: { name: 'mean oil velocity', q: 'speed', unit: 'm/s' },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 38.6 },
        d: { name: 'inside diameter of the line', q: 'length', unit: 'mm', value: 13 }
      },
      practice: { unknowns: ['v', 'd'] },
      stories: {
        v: 'A flow of {Q} runs through a hose of {d} bore. How fast is the oil moving?',
        d: 'A line carrying {Q} should run at {v}. What bore does it need?'
      }
    },
    {
      name: 'Reservoir size rule of thumb',
      expr: 'Vt = td*Q', tex: 'V_t = t_d\\,Q',
      vars: {
        Vt: { name: 'oil volume in the tank', q: 'volume', unit: 'L', tex: 'V_t' },
        td: { name: 'dwell time (3–5 min industrial, 1–2 min mobile)', q: 'time', unit: 'min', value: 3, tex: 't_d' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 44 }
      },
      note: 'A rule of thumb: the oil should stay a few minutes in the tank to settle air and dirt and to cool. Heat balance and the volume the cylinders swallow can call for more.',
      stories: { Vt: 'A power unit pumps {Q} and the oil should rest {td} in the tank. How much oil should the tank hold?' }
    }
  ],
  examples: [
    {
      title: 'Sketching a power unit',
      q: 'A machine needs about 40 L/min at up to 160 bar. The motor runs at 1450 rpm. Choose the pump, the motor power, the tank and the line bores.',
      steps: [
        'Pump: $V_g = Q/(n\\,\\eta_v) = 40/(1450 \\times 0.95)$ L = 29 cm³/rev; the next size up, 32 cm³/rev, gives $32 \\times 1450 \\times 0.95 = 44.1$ L/min.',
        'Hydraulic power: $160 \\times 44.1/600 = 11.8$ kW; with an overall pump efficiency of 0.87 the shaft needs 13.5 kW, so a 15 kW motor.',
        'Tank: three minutes of flow, $3 \\times 44 = 132$ L — a 150 L tank.',
        'Pressure line at 5 m/s: $d = \\sqrt{4Q/\\pi v} = \\sqrt{4 \\times 7.35\\times10^{-4}/(\\pi \\times 5)} = 13.7$ mm, so a 16 mm bore. Suction at 1 m/s: 30.6 mm, so 32 mm. Return at 3 m/s: 17.7 mm, so 19 mm (more if a differential cylinder returns extra flow).'
      ],
      a: '32 cm³/rev pump, 15 kW motor, about 150 L tank; lines of roughly 32 (suction), 16 (pressure) and 19 mm (return).'
    }
  ],
  quiz: [
    { q: 'Which component normally sits first after the pump, to protect everything downstream?', choices: ['the directional valve', 'the pressure-relief valve', 'the return filter', 'the cooler'], a: 1,
      why: 'The relief valve must see the pump outlet directly, so that no closed valve can ever cut the pump off from it.' },
    { q: 'In a closed circuit, the oil leaving the motor goes back to the tank before the pump draws it again.', a: false,
      why: 'In a closed circuit the motor outlet goes straight to the pump inlet; only a charge pump draws make-up oil from the tank to replace leakage.' },
    { q: 'A 32 cm³/rev pump turns at 1450 rpm with a volumetric efficiency of 95 %. What flow does it deliver?', answer: 44.1, unit: 'L/min', tol: 0.02,
      why: '$Q = 32 \\times 1450 \\times 0.95 = 44\\,080$ cm³/min = 44.1 L/min.' },
    { q: 'Why is the suction line usually the widest line in the system?', choices: ['it carries the largest flow', 'to keep the velocity and pressure drop low, so the pump inlet does not cavitate', 'to hold more oil', 'because suction lines run hotter'], a: 1,
      why: 'The same flow passes every line, but the inlet has only atmospheric pressure to push the oil in. Low velocity means a small drop and no cavitation.' }
  ],
  problems: [
    { q: 'A pressure line carries 60 L/min and should run at no more than 4 m/s. What is the smallest bore?', answer: 17.8, unit: 'mm', tol: 0.02,
      steps: ['$Q = 60/60\\,000 = 1\\times10^{-3}$ m³/s.', '$d = \\sqrt{4Q/(\\pi v)} = \\sqrt{4\\times10^{-3}/(4\\pi)} = 0.0178$ m = 17.8 mm; a 19 mm (¾ in) hose is chosen.'] }
  ],
  applications: [
    'Industrial power units beside presses, machine tools and injection-moulding machines.',
    'Tractors and excavators, whose engine drives the pumps and whose frame carries tank, coolers and valve blocks.',
    'Hydrostatic drives of wheel loaders, harvesters and winches (closed circuits).'
  ],
  sim: 'fp-trace'
},

{
  id: 'pressure-flow-power', parent: 'fluid-power-intro', title: 'Pressure, flow and power', level: 1,
  short: 'Pressure becomes force, flow becomes speed, and their product is power: P = p·Q, or kW = bar × L/min ÷ 600. The pump sets the flow, the load sets the pressure, the relief valve caps it.',
  keywords: ['hydraulic power', 'pressure', 'flow', 'p times Q', 'bar L/min 600', 'kW', 'horsepower', 'psi gpm 1714', 'efficiency', 'pump torque', 'drive power', 'electrical analogy'],
  prereq: ['fluid-power', 'pressure-definition', 'flow-rate', 'physics:power'],
  related: ['hydraulic-cylinder', 'energy-losses-heat', 'pump-efficiencies', 'motor-torque-speed', 'displacement-flow', 'relief-valve', 'orifice-equation', 'force-multiplication'],
  body: `
Every question about a hydraulic machine comes down to two quantities. **Pressure** $p$ is how hard the oil pushes; on a piston it becomes **force**, in a motor **torque**. **Flow** $Q$ is how much oil moves each minute; it becomes **speed**. Their product is the power the oil carries:

$$P = p\\,Q$$

The units check themselves: pressure is energy per volume (1 Pa = 1 J/m³), flow is volume per time, so $pQ$ is energy per time. In workshop units this is the most used rule in fluid power,

$$P\\,[\\mathrm{kW}] = \\frac{p\\,[\\mathrm{bar}] \\times Q\\,[\\mathrm{L/min}]}{600}$$

since $1\\ \\mathrm{bar} \\times 1\\ \\mathrm{L/min} = 10^5 \\times \\tfrac{1}{60\\,000} = 1.667$ W. American practice writes $P\\,[\\mathrm{hp}] = p\\,[\\mathrm{psi}]\\times Q\\,[\\mathrm{gpm}]/1714$.

### Who decides what
- The **pump** decides the flow: it pushes out its displacement every revolution.
- The **load** decides the pressure: the oil rises in pressure only as far as it must to move what is in its way, plus the losses on the way there.
- The **relief valve** decides how high the pressure may ever go.
- The **valves** decide how the flow is shared.

So a pump "rated 250 bar" spends most of its life well below that, and a bigger pump makes a machine faster, not stronger.

### Typical powers
| Machine | Pressure | Flow | Power |
|---|---|---|---|
| Log splitter | 200 bar | 20 L/min | 6.7 kW |
| Tractor remote valve | 190 bar | 80 L/min | 25 kW |
| Airliner engine-driven pump | 207 bar | 140 L/min | 48 kW |
| Injection-moulding machine | 200 bar | 300 L/min | 100 kW |
| 20-tonne excavator, both pumps | up to 350 bar | up to 2 × 220 L/min | about 100 kW, limited by the engine |

The excavator row shows a real constraint: its pumps could deliver far more than the engine can drive, so a regulator trades flow against pressure along a curve of constant power ([[mobile-hydraulics]]).

### Input, output and efficiency
The pump takes shaft power $T\\omega$ and gives hydraulic power $pQ$; a cylinder turns $pQ$ back into $Fv$, a motor into $T\\omega$. No step is perfect. A piston pump reaches an overall efficiency $\\eta_t$ of 0.88–0.93 at its best, a gear pump 0.80–0.90, so the drive must supply $pQ/\\eta_t$ ([[pump-efficiencies]]). The shaft torque follows from the displacement, $T = V_g\\,\\Delta p/(2\\pi\\,\\eta_{hm})$: a 32 cm³/rev pump at 200 bar needs about 110 N·m, whatever its speed — which is why a pump that starts against full pressure stalls a small motor.

### The electrical analogy
Pressure behaves like voltage, flow like current, and $P = pQ$ like $P = VI$. A restriction plays a resistor — a non-linear one whose drop grows with the square of the flow ([[orifice-equation]]); an accumulator stores oil as a capacitor stores charge; the inertia of a long oil column acts like an inductance ([[water-hammer]]). The analogy is useful; the square law and one-way components such as check valves are where it stops.

> [!key] Pressure × flow = power. Pressure comes from the load, flow from the pump; the relief valve caps the pressure; and every pressure drop at a flow is power turned into heat ([[energy-losses-heat]]).
`,
  ideas: [
    'Hydraulic power is pressure times flow: P = pQ, and kW = bar × L/min ÷ 600.',
    'Pressure becomes force or torque; flow becomes speed.',
    'The pump sets the flow, the load sets the pressure, the relief valve caps it.',
    'The drive must supply pQ/η_t; the pump shaft torque is V_g Δp/(2π η_hm), independent of speed.',
    'Every pressure drop Δp at a flow Q turns Δp·Q into heat.'
  ],
  pitfalls: [
    'A pump rated at 250 bar always runs at 250 bar — The rating is the most it may see. It runs at whatever pressure the load and losses need at that moment.',
    'Doubling the flow doubles the force — Flow sets speed; force comes from pressure and area. Doubling the flow doubles the speed and the power, not the force.',
    'Power can be judged by pressure alone — A 700 bar hand pump delivers a trickle and a fraction of a kilowatt; power needs pressure and flow together.'
  ],
  formulas: [
    {
      name: 'Hydraulic power',
      expr: 'P = p*Q', tex: 'P = p\\,Q',
      vars: {
        P: { name: 'hydraulic power', q: 'power', unit: 'kW' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 190 },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 80 }
      },
      note: 'Workshop form: P (kW) = p (bar) × Q (L/min) / 600. Across a component, use its pressure drop instead of p to find the power it absorbs.',
      practice: { unknowns: ['P', 'Q', 'p'] },
      stories: {
        P: 'A tractor\'s remote valve delivers {Q} at {p}. How much power can it hand to an implement?',
        Q: 'A {P} power pack works at {p}. What flow can it deliver?',
        p: 'An implement needs {P} and receives {Q}. At what pressure must it work?'
      }
    },
    {
      name: 'Fluid power in US units',
      expr: 'P = p*Q/1714', tex: 'P = \\dfrac{p\\,Q}{1714}',
      vars: {
        P: { name: 'power', q: false, unit: 'hp' },
        p: { name: 'pressure (gauge)', q: false, unit: 'psi', value: 3000 },
        Q: { name: 'flow', q: false, unit: 'gpm', value: 10 }
      },
      note: 'The American rule of thumb, with horsepower, psi and US gallons per minute (1 hp = 745.7 W).',
      stories: { P: 'A system runs at {p} with {Q} of oil. How much power does it carry?', Q: 'A {P} pump drive works at {p}. What flow can it supply?' }
    },
    {
      name: 'Pump drive power',
      expr: 'Pin = p*Q/eta_t', tex: 'P_{in} = \\dfrac{p\\,Q}{\\eta_t}',
      vars: {
        Pin: { name: 'shaft power the pump needs', q: 'power', unit: 'kW', tex: 'P_{in}' },
        p: { name: 'pump pressure (gauge)', q: 'pressure', unit: 'bar', value: 200 },
        Q: { name: 'pump flow delivered', q: 'flowrate', unit: 'L/min', value: 50 },
        eta_t: { name: 'overall pump efficiency', q: 'ratio', unit: '%', value: 87, min: 1, max: 100, tex: '\\eta_t' }
      },
      stories: {
        Pin: 'A pump delivers {Q} at {p} with an overall efficiency of {eta_t}. What power must its motor supply?',
        Q: 'A {Pin} motor drives a pump with an overall efficiency of {eta_t} at {p}. What flow can it deliver?'
      }
    },
    {
      name: 'Pump shaft torque',
      expr: 'T = Vg*dp/(2*pi*eta_hm)', tex: 'T = \\dfrac{V_g\\,\\Delta p}{2\\pi\\,\\eta_{hm}}',
      vars: {
        T: { name: 'torque at the pump shaft', q: 'torque', unit: 'N·m' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 32, tex: 'V_g' },
        dp: { name: 'pressure rise across the pump', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        eta_hm: { name: 'hydro-mechanical efficiency', q: 'ratio', unit: '%', value: 93, min: 1, max: 100, tex: '\\eta_{hm}' }
      },
      stories: { T: 'A {Vg} pump works against {dp} with a hydro-mechanical efficiency of {eta_hm}. What torque does its shaft need?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a motor',
      q: 'A power unit must supply 45 L/min at up to 180 bar. Its pump has an overall efficiency of 0.88. What electric motor does it need?',
      steps: [
        'Hydraulic power: $P = pQ = 180 \\times 45/600 = 13.5$ kW.',
        'Shaft power: $13.5/0.88 = 15.3$ kW.',
        'Standard motor sizes run 11, 15, 18.5, 22 kW: the 15 kW motor would be slightly overloaded at full pressure, so choose 18.5 kW — or limit the pump with a power regulator.'
      ],
      a: 'About 15.3 kW at the shaft: an 18.5 kW motor.'
    },
    {
      title: 'Two sets of units, one answer',
      q: 'An American data sheet gives 3000 psi and 10 gpm. What power is that, in hp and in kW?',
      steps: [
        'US rule: $P = 3000 \\times 10/1714 = 17.5$ hp $= 17.5 \\times 0.7457 = 13.1$ kW.',
        'Check in SI: 3000 psi = 206.8 bar and 10 gpm = 37.85 L/min, so $P = 206.8 \\times 37.85/600 = 13.0$ kW.'
      ],
      a: '17.5 hp, or 13.1 kW.'
    }
  ],
  quiz: [
    { q: 'The pump speed is doubled while the load stays the same. What happens to the hydraulic power delivered?', choices: ['it stays the same', 'it doubles, because the flow doubles at the same pressure', 'it quadruples', 'it halves'], a: 1,
      why: 'A positive-displacement pump\'s flow is proportional to its speed. The load still sets the same pressure, so P = pQ doubles — and the actuator moves twice as fast.' },
    { q: 'What power is carried by 60 L/min at 250 bar?', answer: 25, unit: 'kW', tol: 0.02,
      why: '$P = 250 \\times 60/600 = 25$ kW.' },
    { q: 'What sets the pressure in a working hydraulic circuit (below the relief setting)?', choices: ['the pump\'s rated pressure', 'the load and the losses in the lines and valves', 'the size of the tank', 'the motor power'], a: 1,
      why: 'Oil only rises in pressure as far as it must to move the load and push through the losses on the way. The relief valve caps it.' },
    { q: 'In the electrical analogy, which component behaves like a capacitor?', choices: ['a relief valve', 'an accumulator', 'a check valve', 'a long hose\'s inertia'], a: 1,
      why: 'An accumulator stores oil volume under pressure, as a capacitor stores charge under voltage. The inertia of a long line is the inductance.' },
    { q: 'A pump starting against full pressure needs the same shaft torque at 100 rpm as at 1500 rpm.', a: true,
      why: '$T = V_g\\,\\Delta p/(2\\pi\\,\\eta_{hm})$ contains no speed. That is why motors are started with the pump unloaded.' }
  ],
  problems: [
    { q: 'A 7.5 kW motor drives a pump whose overall efficiency is 0.85. At 150 bar, what is the most flow it can deliver?', answer: 25.5, unit: 'L/min', tol: 0.02,
      steps: ['Hydraulic power available: $7.5 \\times 0.85 = 6.375$ kW.', '$Q = 600\\,P/p = 600 \\times 6.375/150 = 25.5$ L/min.'] },
    { q: 'What torque does a 45 cm³/rev pump need at 250 bar with a hydro-mechanical efficiency of 0.92?', answer: 194.6, unit: 'N·m', tol: 0.02,
      steps: ['$T = V_g\\,\\Delta p/(2\\pi\\,\\eta_{hm}) = 45\\times10^{-6} \\times 2.5\\times10^7/(2\\pi \\times 0.92)$.', '$T = 1125/5.781 = 195$ N·m.'] }
  ],
  applications: [
    'Sizing the electric motor or engine of any hydraulic power unit.',
    'Reading a pump data sheet: displacement, speed, pressure and the efficiencies give flow, torque and power.',
    'Estimating the heat a relief valve or throttle makes: its pressure drop times its flow.'
  ],
  sim: 'fp-sankey'
},

{
  id: 'force-multiplication', parent: 'fluid-power-intro', title: 'Force multiplication', level: 1,
  short: 'Two pistons joined by oil feel the same pressure, so the force grows with the area: F₂/F₁ = A₂/A₁. The big piston moves less by the same ratio, so work is conserved. Levers, jacks, brakes and intensifiers chain these ratios.',
  keywords: ['force multiplication', 'mechanical advantage', 'area ratio', 'hydraulic lever', 'jack', 'Pascal', 'intensifier', 'pressure multiplier', 'work conservation', 'lever ratio'],
  prereq: ['pascals-law', 'hydraulic-press', 'physics:work'],
  related: ['hydraulic-press', 'intensifiers', 'lifts-cranes', 'vehicle-brakes', 'hydraulic-cylinder', 'fluid-power', 'area-ratio'],
  body: `
Push on a small piston and the oil passes your pressure, undiminished, to a large piston connected to it ([[pascals-law]]). The pressure is the same on both; the force is pressure times area; so the larger piston pushes harder in proportion to its area:

$$\\frac{F_2}{F_1} = \\frac{A_2}{A_1} = \\left(\\frac{D_2}{D_1}\\right)^2$$

Double the diameter of the output piston and the force goes up four times. A 12 mm plunger driving a 40 mm ram multiplies by $(40/12)^2 = 11.1$.

### Paying with distance
Nothing is free. The oil pushed out by the small piston, $A_1 x_1$, is the oil that fills behind the large one, $A_2 x_2$, so the large piston moves only $x_2 = x_1 A_1/A_2$. Multiply the two results and the ratios cancel:

$$F_2\\,x_2 = F_1\\,x_1$$

— the work out equals the work in, less friction. A hydraulic lever is a lever: it trades distance for force, exactly as a crowbar or a gearbox does ([[physics:work|work]]). That is why a jack takes dozens of strokes to raise a car a few centimetres.

### Chains of multipliers
Real devices stack a mechanical lever in front of the hydraulic one. A bottle jack:

| Stage | Ratio | Force after it |
|---|---|---|
| Hand on the lever | — | 300 N |
| Lever, 400 mm handle on a 40 mm crank | 10 | 3 kN |
| Plunger 12 mm → ram 40 mm | 11.1 | 33 kN |
| Seal and pivot friction, about 85 % | 0.85 | 28 kN — nearly 3 tonnes |

A car's brakes chain three: the pedal lever (about 3.5–4), the vacuum booster (4–6) and the area of the caliper pistons against the master cylinder (around 6), so a 150 N push clamps each front disc with some 15 kN ([[vehicle-brakes]]).

### Multiplying pressure instead
Put two pistons of different size on **one rod** and the forces balance instead of the pressures: $p_1 A_1 = p_2 A_2$. Oil at 100 bar on a 100 mm piston holds 625 bar on a 40 mm one. This **intensifier** multiplies pressure and divides the flow by the same ratio — power is again conserved ([[intensifiers]]). The same thing can happen by accident in a differential cylinder whose rod-end port is blocked ([[hydraulic-cylinder]]).

### Why hydraulic?
Gears and screws multiply force too. The hydraulic version wins when the force must be **sent somewhere** (along a hose, round a corner, to four wheels at once), when it must be **divided** among several outputs at the same pressure, or when the **size** of the output is fixed by the load but the input must be light: 20 tonnes lifted by a tube you can carry.

> [!warn] A jack is for lifting, not for holding. A seal or a release valve can let a load down without warning: before going under a raised vehicle or load, support it on stands or blocks rated for the load.
`,
  ideas: [
    'Pistons joined by oil share one pressure, so force scales with area: F₂/F₁ = (D₂/D₁)².',
    'The output piston moves less by the same ratio: work out equals work in, less friction.',
    'Levers, boosters and area ratios multiply together in jacks and brakes.',
    'Two pistons on one rod multiply pressure instead of force: p₂ = p₁ A₁/A₂, with the flow divided by the same ratio.'
  ],
  pitfalls: [
    'A hydraulic press creates energy, since a small push lifts a huge load — The load rises far less than the plunger moves; force × distance is the same on both sides, minus friction.',
    'Doubling the output piston\'s diameter doubles the force — Force grows with area, which is diameter squared: doubling the diameter quadruples the force (and quarters the travel).',
    'An intensifier gives more power at the high-pressure side — It gives more pressure at less flow; pressure × flow can only fall, by the friction.'
  ],
  formulas: [
    {
      name: 'Force ratio of two pistons',
      expr: 'F2 = F1*(D2/D1)^2', tex: 'F_2 = F_1 \\left(\\dfrac{D_2}{D_1}\\right)^2',
      vars: {
        F2: { name: 'output (large-piston) force', q: 'force', unit: 'kN', tex: 'F_2' },
        F1: { name: 'input (small-piston) force', q: 'force', unit: 'N', value: 3000, tex: 'F_1' },
        D2: { name: 'large piston diameter', q: 'length', unit: 'mm', value: 40, tex: 'D_2' },
        D1: { name: 'small piston diameter', q: 'length', unit: 'mm', value: 12, tex: 'D_1' }
      },
      note: 'Ideal: no friction, both pistons at the same level (a height difference adds ρgh, negligible at hydraulic pressures).',
      practice: { unknowns: ['F2', 'D2', 'F1'] },
      stories: {
        F2: 'A plunger of {D1} is pushed with {F1} and drives a ram of {D2}. What force does the ram give?',
        D2: 'A plunger of {D1} pushed with {F1} must make a ram lift {F2}. What ram diameter is needed?',
        F1: 'A ram of {D2} must push {F2} and is driven by a plunger of {D1}. What force must push the plunger?'
      }
    },
    {
      name: 'Travel ratio of two pistons',
      expr: 'x2 = x1*(D1/D2)^2', tex: 'x_2 = x_1 \\left(\\dfrac{D_1}{D_2}\\right)^2',
      vars: {
        x2: { name: 'large piston travel', q: 'length', unit: 'mm', tex: 'x_2' },
        x1: { name: 'small piston travel', q: 'length', unit: 'mm', value: 25, tex: 'x_1' },
        D1: { name: 'small piston diameter', q: 'length', unit: 'mm', value: 12, tex: 'D_1' },
        D2: { name: 'large piston diameter', q: 'length', unit: 'mm', value: 40, tex: 'D_2' }
      },
      note: 'The volume pushed out by one piston fills behind the other (oil is nearly incompressible).',
      stories: { x2: 'A plunger of {D1} moves {x1} per stroke and feeds a ram of {D2}. How far does the ram rise per stroke?' }
    },
    {
      name: 'Hand-operated jack',
      expr: 'F = Fh*(a/b)*(D/d)^2*eta', tex: 'F = F_h\\,\\dfrac{a}{b}\\left(\\dfrac{D}{d}\\right)^2 \\eta',
      vars: {
        F: { name: 'lifting force', q: 'force', unit: 'kN' },
        Fh: { name: 'hand force on the lever', q: 'force', unit: 'N', value: 300, tex: 'F_h' },
        a: { name: 'lever length, pivot to hand', q: 'length', unit: 'mm', value: 400 },
        b: { name: 'lever length, pivot to plunger', q: 'length', unit: 'mm', value: 40 },
        D: { name: 'ram diameter', q: 'length', unit: 'mm', value: 40 },
        d: { name: 'plunger diameter', q: 'length', unit: 'mm', value: 12 },
        eta: { name: 'efficiency (seal and pivot friction)', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta' }
      },
      practice: { unknowns: ['F', 'Fh', 'D'] },
      stories: {
        F: 'A jack has a lever ratio of {a} to {b}, a {d} plunger and a {D} ram, with an efficiency of {eta}. What does a hand force of {Fh} lift?',
        Fh: 'A jack with a {a}/{b} lever, a {d} plunger and a {D} ram ({eta} efficient) must lift {F}. What hand force does it take?'
      }
    },
    {
      name: 'Pressure intensifier',
      expr: 'p2 = p1*(D1/D2)^2', tex: 'p_2 = p_1 \\left(\\dfrac{D_1}{D_2}\\right)^2',
      vars: {
        p2: { name: 'high-pressure side (gauge)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        p1: { name: 'low-pressure side (gauge)', q: 'pressure', unit: 'bar', value: 100, tex: 'p_1' },
        D1: { name: 'large (low-pressure) piston', q: 'length', unit: 'mm', value: 100, tex: 'D_1' },
        D2: { name: 'small (high-pressure) piston', q: 'length', unit: 'mm', value: 40, tex: 'D_2' }
      },
      note: 'Two pistons on one rod: the forces balance, so the pressures are in the inverse ratio of the areas. Ignores friction and any pressure on the rod side of the large piston.',
      stories: { p2: 'An intensifier has a {D1} piston fed at {p1}, joined to a {D2} plunger. What pressure can the plunger hold?' }
    }
  ],
  examples: [
    {
      title: 'Strokes to lift a car',
      q: 'A bottle jack has a 12 mm plunger with a 25 mm stroke and a 40 mm ram. How far does the ram rise per stroke, and how many strokes lift a car 100 mm?',
      steps: [
        'Area ratio: $(40/12)^2 = 11.1$.',
        'Ram rise per stroke: $25/11.1 = 2.25$ mm.',
        'Strokes for 100 mm: $100/2.25 = 44.4$, so 45 strokes.',
        'Check the work: 3 kN × 25 mm on the plunger = 75 J; 33 kN × 2.25 mm on the ram = 75 J — the same, before friction.'
      ],
      a: 'About 2.25 mm per stroke; 45 strokes for 100 mm.'
    },
    {
      title: 'An intensifier for a test rig',
      q: 'A workshop has 160 bar available and needs 700 bar to pressure-test a hose. What ratio of piston diameters does an intensifier need, and what flow does it give if fed 8 L/min?',
      steps: [
        'Pressure ratio: $700/160 = 4.375$, so area ratio 4.375 and diameter ratio $\\sqrt{4.375} = 2.09$ — for example 84 mm on 40 mm.',
        'Flow is divided by the area ratio: $8/4.375 = 1.8$ L/min at 700 bar.',
        'Power check: $160 \\times 8/600 = 2.13$ kW in, $700 \\times 1.83/600 = 2.13$ kW out.'
      ],
      a: 'A diameter ratio of about 2.1; about 1.8 L/min at 700 bar.'
    }
  ],
  quiz: [
    { q: 'A small piston of 1 cm² is pushed with 100 N; it is connected to a large piston of 50 cm². What force does the large piston give?', choices: ['100 N', '2 N', '5000 N', '50 N'], a: 2,
      why: 'Same pressure, 100 N/cm² = 1 MPa; on 50 cm² that gives 5000 N. The large piston moves 1/50 as far.' },
    { q: 'You double the diameter of the output piston and keep everything else. The output force…', choices: ['doubles', 'quadruples', 'halves', 'stays the same'], a: 1,
      why: 'Force is pressure times area, and area goes with the diameter squared.' },
    { q: 'A hydraulic jack lets a person lift a car with less energy than the car gains in height.', a: false,
      why: 'The hand does at least as much work as the car gains in potential energy: many long strokes for a small rise. The jack multiplies force, not energy.' },
    { q: 'An intensifier turns 150 bar into 600 bar. If 12 L/min enters the low-pressure side, what flow leaves the high-pressure side?', answer: 3, unit: 'L/min', tol: 0.02,
      why: 'Area (and pressure) ratio 4, so the flow is divided by 4: 3 L/min. Power in, $150 \\times 12/600 = 3$ kW, equals power out, $600 \\times 3/600 = 3$ kW.' }
  ],
  problems: [
    { q: 'A 16 mm plunger is pushed with 2 kN and drives a 63 mm ram. What force does the ram give, ignoring friction?', answer: 31.0, unit: 'kN', tol: 0.02,
      steps: ['$(63/16)^2 = 15.50$.', '$F_2 = 2 \\times 15.50 = 31.0$ kN.'] },
    { q: 'A jack has a lever ratio of 12, an 11 mm plunger and a 35 mm ram, and is 80 % efficient. What hand force lifts 2 tonnes (19.6 kN)?', answer: 201.8, unit: 'N', tol: 0.02,
      steps: ['Overall ratio: $12 \\times (35/11)^2 \\times 0.8 = 12 \\times 10.12 \\times 0.8 = 97.2$.', '$F_h = 19\\,620/97.2 = 202$ N — the weight of about 20 kg.'] }
  ],
  applications: [
    'Bottle and trolley jacks, workshop presses and hydraulic pullers.',
    'Car and motorcycle brakes, where a light pedal clamps four discs.',
    'Intensifiers for bolt tensioners, test rigs, waterjet cutters and clamping.',
    'Rescue tools (spreaders and cutters) driven from a small portable pump at 700 bar.'
  ],
  sim: 'fp-jack'
},

{
  id: 'energy-losses-heat', parent: 'fluid-power-intro', title: 'Losses and heat', level: 2,
  short: 'Every pressure drop at a flow turns Δp·Q into heat, and every watt lost ends up warming the oil. The efficiency chain from motor to cylinder, where losses hide (pump, valves, lines, throttles, relief valve), and what they do to oil temperature.',
  keywords: ['energy losses', 'heat generation', 'efficiency chain', 'throttling loss', 'relief valve heat', 'oil temperature rise', 'heat balance', 'overall efficiency', 'pump losses', 'load sensing efficiency', 'variable speed pump'],
  prereq: ['pressure-flow-power', 'physics:efficiency', 'physics:specific-heat'],
  related: ['heat-coolers', 'pump-efficiencies', 'relief-valve', 'meter-in-out', 'load-sensing', 'open-closed-centre', 'viscosity-temperature', 'hydraulic-oils', 'hi-lo-circuit', 'darcy-weisbach'],
  body: `
Energy cannot disappear, so every watt a hydraulic system fails to deliver to the load turns up as **heat**, and nearly all of it goes into the oil. Where it is lost, and how much, decides the size of the cooler, the life of the oil and the running cost of the machine.

### The one rule
Oil flowing at $Q$ through anything that drops its pressure by $\\Delta p$ — a valve, a hose, a filter, a throttle — gives up the power

$$P_{loss} = \\Delta p\\,Q$$

and the oil leaving is warmer. With no heat escaping on the way, the temperature rise is $\\Delta T = \\Delta p/(\\rho c)$. For mineral oil $\\rho c \\approx 870 \\times 1900 = 1.65$ MJ/(m³·K), so **every 10 bar of drop warms the oil by about 0.6 K**: oil blowing through a relief valve at 200 bar leaves 12 K hotter.

### Where it goes
| Stage | Typical efficiency | What is lost |
|---|---|---|
| Electric motor | 0.93–0.96 | copper and iron losses (heats the air, not the oil) |
| Pump | 0.85–0.92 | internal leakage and friction |
| Directional valves and lines | 0.80–0.95 | 3–10 bar per valve path, friction in hoses ([[darcy-weisbach]]) |
| Speed-control throttle | 0.3–0.9 | the drop across the metering edge |
| Relief valve (fixed pump) | anything | all surplus flow at full pressure |
| Cylinder or motor | 0.90–0.97 | seal friction, leakage |

The efficiencies multiply. A typical valve-controlled machine — $0.94 \\times 0.88 \\times 0.85 \\times 0.70 \\times 0.95$ — delivers only 47 % of the electrical power to the load.

### How the circuit decides
- A **fixed pump with a relief valve** pumps its full flow at full pressure all the time; whatever the actuators do not use crosses the relief valve. Idling, all of it is heat ([[relief-valve]]).
- A **tandem or open centre** lets the pump idle at a few bar: 40 L/min at 5 bar is 0.3 kW instead of 10.7 kW at 160 bar ([[open-closed-centre]]).
- A **pressure-compensated pump** makes only the flow that is used ([[pressure-compensated-pump]]).
- **Load sensing** keeps the pump a margin of 15–30 bar above the highest load; the loss is that margin times the flow, plus the throttling of lighter loads ([[load-sensing]]).
- A **variable-speed pump drive** makes just the flow at just the pressure: the leanest of all, and quiet.

### Heat, temperature and oil life
Heat made must equal heat removed, by the tank walls, pipes and above all the cooler ([[heat-coolers]]). Most systems aim for 40–60 °C in the tank. Hotter oil thins — an ISO VG 46 oil drops from 46 mm²/s at 40 °C to about 11 at 80 °C ([[viscosity-temperature]]) — so pumps leak more, making still more heat; seals harden; and above about 60 °C each further 10 °C roughly **halves the oil's life** by oxidation.

> [!warn] Hydraulic oil at 70–90 °C burns skin, and the pipes, valves and tank reach the same temperature. Let a system cool before work, and treat an unexpectedly hot line as a sign that oil is blowing through a relief valve or a worn component.
`,
  ideas: [
    'Any pressure drop Δp at flow Q turns Δp·Q into heat, and it warms the oil by Δp/(ρc) ≈ 0.6 K per 10 bar.',
    'Efficiencies multiply: motor × pump × valves and lines × throttle × actuator — often below 50 %.',
    'A fixed pump over a relief valve is the worst case: all surplus flow at full pressure becomes heat.',
    'Unloading, pressure compensation, load sensing and variable-speed drives cut the losses at their source.',
    'Hot oil thins, leaks more and ages fast: roughly half the life for each 10 °C above about 60 °C.'
  ],
  pitfalls: [
    'A bigger cooler reduces the losses — It removes the heat the losses make; the power is wasted either way. Cut the losses first, then size the cooler.',
    'A stalled or idle system uses no power — With a fixed pump and a closed centre, pump flow crosses the relief valve at full pressure: the full hydraulic power becomes heat.',
    'Throttling for speed control is free because no work is done at the valve — The work is done on the oil: the whole drop times the flow becomes heat.'
  ],
  formulas: [
    {
      name: 'Power lost in a pressure drop',
      expr: 'Ploss = dp*Q', tex: 'P_{loss} = \\Delta p\\,Q',
      vars: {
        Ploss: { name: 'power turned into heat', q: 'power', unit: 'kW', tex: 'P_{loss}' },
        dp: { name: 'pressure drop across the component', q: 'pressure', unit: 'bar', value: 150, tex: '\\Delta p' },
        Q: { name: 'flow through it', q: 'flowrate', unit: 'L/min', value: 30 }
      },
      stories: {
        Ploss: '{Q} passes a relief valve with a drop of {dp}. How much heat does it make?',
        Q: 'A throttle with a drop of {dp} makes {Ploss} of heat. What flow passes it?'
      }
    },
    {
      name: 'Temperature rise across a restriction',
      expr: 'dT = dp/(rho*c)', tex: '\\Delta T = \\dfrac{\\Delta p}{\\rho\\,c}',
      vars: {
        dT: { name: 'temperature rise of the oil', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', value: 100, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        c: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.9 }
      },
      note: 'Adiabatic: all the lost energy stays in the oil passing the restriction. Mineral oils have ρc ≈ 1.6–1.7 MJ/(m³·K).',
      stories: { dT: 'Oil ({rho}, {c}) drops {dp} across a valve. How much warmer does it leave?', dp: 'Oil ({rho}, {c}) leaves a valve {dT} warmer than it entered. What pressure drop did it cross?' }
    },
    {
      name: 'Efficiency chain',
      expr: 'eta = eta_m*eta_p*eta_v*eta_th*eta_a', tex: '\\eta = \\eta_m\\,\\eta_p\\,\\eta_v\\,\\eta_{th}\\,\\eta_a',
      vars: {
        eta: { name: 'overall efficiency, wire to work', q: 'ratio', unit: '%', tex: '\\eta' },
        eta_m: { name: 'electric motor', q: 'ratio', unit: '%', value: 94, min: 1, max: 100, tex: '\\eta_m' },
        eta_p: { name: 'pump (overall)', q: 'ratio', unit: '%', value: 88, min: 1, max: 100, tex: '\\eta_p' },
        eta_v: { name: 'valves and lines', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta_v' },
        eta_th: { name: 'speed-control throttling', q: 'ratio', unit: '%', value: 70, min: 1, max: 100, tex: '\\eta_{th}' },
        eta_a: { name: 'actuator', q: 'ratio', unit: '%', value: 95, min: 1, max: 100, tex: '\\eta_a' }
      },
      note: 'Each stage passes on a fraction of what it receives, so the fractions multiply.',
      stories: { eta: 'A motor ({eta_m}) drives a pump ({eta_p}); valves and lines pass {eta_v}, speed control {eta_th} and the cylinder {eta_a}. What fraction of the electrical power does useful work?' }
    },
    {
      name: 'Warm-up with no cooling',
      expr: 'dT = P*t/(m*c)', tex: '\\Delta T = \\dfrac{P\\,t}{m\\,c}',
      vars: {
        dT: { name: 'oil temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        P: { name: 'heat going into the oil', q: 'power', unit: 'kW', value: 10 },
        t: { name: 'running time', q: 'time', unit: 'min', value: 15 },
        m: { name: 'mass of oil', q: 'mass', unit: 'kg', value: 174 },
        c: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.9 }
      },
      note: 'An upper bound: the steel of the tank and machine soaks up heat too, and the tank sheds some — real warm-up is slower.',
      stories: { dT: '{P} of losses heat {m} of oil ({c}) for {t} with no cooling. How much does it warm?', t: 'How long does {P} take to warm {m} of oil ({c}) by {dT}, with no cooling?' }
    }
  ],
  examples: [
    {
      title: 'Idling against the relief valve',
      q: 'A fixed pump delivers 40 L/min; the valve is in its closed centre and the relief is set to 160 bar. What heat is made, and how hot does the relief flow get? What if a tandem centre let the pump idle at 5 bar?',
      steps: [
        'Heat at the relief valve: $P = 160 \\times 40/600 = 10.7$ kW — continuously, while the machine does nothing.',
        'Temperature rise of the oil passing it: $\\Delta T = 1.6\\times10^7/(870 \\times 1900) = 9.7$ K.',
        'Tandem centre: $5 \\times 40/600 = 0.33$ kW — thirty times less.'
      ],
      a: '10.7 kW of heat and nearly 10 K rise at the relief valve; 0.33 kW when unloaded at 5 bar.'
    },
    {
      title: 'Meter-in against load sensing',
      q: 'A cylinder needs 25 L/min at 90 bar. (a) A fixed 40 L/min pump with its relief at 180 bar feeds it through a meter-in throttle. (b) A load-sensing pump keeps 20 bar above the load. Compare the hydraulic efficiencies.',
      steps: [
        'Useful: $90 \\times 25/600 = 3.75$ kW in both cases.',
        '(a) The pump delivers $180 \\times 40/600 = 12$ kW. Relief loss $180 \\times 15/600 = 4.5$ kW; throttle loss $(180 - 90) \\times 25/600 = 3.75$ kW. Efficiency $3.75/12 = 31$ %.',
        '(b) The pump delivers 25 L/min at 110 bar: $110 \\times 25/600 = 4.58$ kW; loss 0.83 kW. Efficiency $3.75/4.58 = 82$ %.'
      ],
      a: 'About 31 % with a fixed pump and meter-in throttle, about 82 % with load sensing.'
    }
  ],
  quiz: [
    { q: 'Where does nearly all the power lost in a hydraulic system end up?', choices: ['in the motor windings', 'as heat in the oil', 'as noise', 'stored as pressure'], a: 1,
      why: 'Leakage, friction and throttling all turn into heat in the oil. Only the electric motor\'s own losses mainly warm the air.' },
    { q: 'By how much does oil warm when it crosses a 60 bar pressure drop (ρc = 1.65 MJ/(m³·K))?', answer: 3.64, unit: 'K', tol: 0.03,
      why: '$\\Delta T = 6\\times10^6/1.65\\times10^6 = 3.6$ K.' },
    { q: 'Which arrangement wastes the most power while the machine waits with no actuator moving?', choices: ['fixed pump, closed-centre valve, flow over the relief valve', 'fixed pump, tandem-centre valve', 'pressure-compensated variable pump', 'variable-speed pump drive'], a: 0,
      why: 'All the pump flow crosses the relief valve at its full setting. The others idle at low pressure or low flow.' },
    { q: 'Fitting a larger oil cooler makes a hydraulic system more efficient.', a: false,
      why: 'A cooler only carries the heat away; the losses that made it are unchanged. It does keep the oil in the right viscosity range, which helps pumps leak less.' }
  ],
  problems: [
    { q: 'A throttle meters 30 L/min with a 70 bar drop. How much heat does it make?', answer: 3.5, unit: 'kW', tol: 0.02,
      steps: ['$P = \\Delta p\\,Q = 70 \\times 30/600 = 3.5$ kW.'] },
    { q: 'With no cooling, how many minutes does 6 kW of losses take to warm 150 kg of oil (c = 1.9 kJ/(kg·K)) from 30 °C to 60 °C?', answer: 23.75, unit: 'min', tol: 0.02,
      steps: ['Heat needed: $150 \\times 1900 \\times 30 = 8.55$ MJ.', 'Time: $8.55\\times10^6/6000 = 1425$ s = 23.8 min.'] }
  ],
  applications: [
    'Sizing coolers and tanks from a heat balance of the losses.',
    'Choosing between fixed pumps, load sensing and variable-speed drives by their running cost.',
    'Troubleshooting: a line that is hotter than its neighbours points to oil blowing through a relief valve or worn seals.'
  ],
  sim: 'fp-sankey'
},

{
  id: 'hydraulics-vs-alternatives', parent: 'fluid-power-intro', title: 'Hydraulic, pneumatic or electric?', level: 1,
  short: 'How oil hydraulics compares with compressed air and electric drives for force, speed, precision, stiffness, efficiency, cleanliness and cost — and where each one wins.',
  keywords: ['hydraulic vs pneumatic', 'hydraulic vs electric', 'electromechanical actuator', 'ball screw', 'comparison', 'power density', 'stiffness', 'energy efficiency', 'electro-hydrostatic actuator', 'EHA', 'actuator selection'],
  prereq: ['fluid-power', 'pressure-flow-power', 'energy-losses-heat'],
  related: ['pneumatics:pneumatic-vs-electric', 'pneumatics:cost-of-compressed-air', 'hydraulic-stiffness', 'electrohydraulic-control', 'mobile-hydraulics', 'aircraft-hydraulics', 'bulk-modulus'],
  body: `
A machine designer who needs something moved has three main choices: **oil hydraulics**, **compressed air** and an **electric drive** (a motor with a ball screw, belt or gearbox). Each wins somewhere.

### The comparison
| | Hydraulic | Pneumatic | Electric (motor + screw) |
|---|---|---|---|
| Working pressure | 100–350 bar | 6–7 bar | — |
| Force | tens of kN to many MN | up to about 30–50 kN | up to a few hundred kN, at a price |
| Force in a small space | excellent | poor | moderate |
| Speed | moderate (to about 0.5–1 m/s) | fast (1–2 m/s), poor at slow creep | anything the motor allows |
| Positioning | very good with servo valves | end stop to end stop, unless servo | excellent and simplest |
| Stiffness | high: oil bulk modulus ~1.5 GPa | low: air is a spring | high |
| Holding a load | valves closed, no power | needs air; drifts on leaks | brake or self-locking screw |
| Overload | relief valve: safe stall | soft by nature | needs current or torque limits |
| Efficiency, wire to work | 30–60 % valve-controlled, to ~70 % pump-controlled | around 10–20 % | 70–85 % |
| Cleanliness | leaks and oil mist possible | clean; exhaust noise | clean |
| Purchase cost | medium; low per kN | lowest | highest for large forces |
| Hazards | injection, fire, hot oil, stored energy | noise, whipping hoses, stored air | electrical, crushing |

### Force and stiffness
At 6 bar a 100 mm pneumatic cylinder pushes 4.7 kN; at 250 bar a hydraulic cylinder of the same bore pushes 196 kN — 42 times more. And air at 7 bar absolute has a bulk modulus of only about 0.7 MPa (isothermal), some two thousand times softer than oil: a pneumatic cylinder bounces on its air like a car on its springs, which is why pneumatics is ideal for fast end-to-end moves and poor at holding a position under a varying load ([[hydraulic-stiffness]]).

### Energy
Compressing air wastes most of the energy as heat at the compressor, and leaks waste more; only about a tenth to a fifth of the electrical energy reaches the piston ([[pneumatics:cost-of-compressed-air|the cost of compressed air]]). An electric screw drive converts 70–85 %. Hydraulics sits between, and the circuit decides where: throttling valves and relief flow halve it ([[energy-losses-heat]]).

### Where each wins
- **Hydraulics**: large forces in small spaces, shock loads, mobile machines where an engine drives pumps and hoses carry the power to moving arms, presses, anything that must hold a heavy load or survive a stall.
- **Pneumatics**: light, fast, cheap, clean, many repeated motions — pick-and-place, clamping, packaging; forces below a few kilonewtons ([[pneumatics:pneumatic-vs-electric|pneumatic or electric?]]).
- **Electric**: precise positioning, flexible motion profiles, efficiency and cleanliness — food, pharmaceuticals, electronics assembly, and increasingly presses and injection moulding.

### Blurred lines
The **electro-hydrostatic actuator** (EHA) puts a servo motor, a small pump and a cylinder into one sealed unit: electric wiring and control, hydraulic force and overload protection, no central pump or pipes. Airliners use them as back-ups for flight controls ([[aircraft-hydraulics]]); industry uses them on presses and valves. Variable-speed pump drives and battery-electric excavators keep the hydraulics but feed them electrically.
`,
  ideas: [
    'Hydraulics wins on force density, stiffness, shock resistance and safe stalling.',
    'Pneumatics is cheap, clean and fast but soft, weak and the least efficient (about 10–20 % wire to work).',
    'Electric drives are the most efficient and precise but costly for large forces and need care against overload.',
    'Electro-hydrostatic actuators and variable-speed pumps combine electric control with hydraulic force.'
  ],
  pitfalls: [
    'Compressed air is free, so pneumatics is the cheapest to run — Air is the most expensive energy in a factory: only a tenth to a fifth of the electrical energy reaches the work.',
    'An electric actuator is protected against a jam as simply as a hydraulic cylinder — A stalled screw drive delivers its motor\'s full torque into the mechanism unless current or torque is limited; a relief valve simply caps the hydraulic force.',
    'Hydraulics is always inefficient — Valve-controlled circuits often are; pump-controlled and variable-speed systems reach 60–75 %, close to electric drives at high forces.'
  ],
  formulas: [
    {
      name: 'Bore needed for a force',
      expr: 'D = sqrt(4*F/(pi*p))', tex: 'D = \\sqrt{\\dfrac{4F}{\\pi p}}',
      vars: {
        D: { name: 'bore', q: 'length', unit: 'mm' },
        F: { name: 'force needed', q: 'force', unit: 'kN', value: 20 },
        p: { name: 'working pressure (gauge)', q: 'pressure', unit: 'bar', value: 6 }
      },
      note: 'Ideal, with no friction or back-pressure. Try 6 bar (pneumatic) against 200 bar (hydraulic).',
      practice: { unknowns: ['D', 'F'] },
      stories: { D: 'A clamp must push {F} at {p}. What bore does it need?', F: 'What does a {D} bore cylinder push at {p}?' }
    },
    {
      name: 'Motor torque for a ball screw',
      expr: 'T = F*L/(2*pi*eta)', tex: 'T = \\dfrac{F\\,L}{2\\pi\\,\\eta}',
      vars: {
        T: { name: 'motor torque at the screw', q: 'torque', unit: 'N·m' },
        F: { name: 'axial force', q: 'force', unit: 'kN', value: 20 },
        L: { name: 'screw lead (travel per turn)', q: 'length', unit: 'mm', value: 10 },
        eta: { name: 'screw efficiency', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'A ball screw turns 85–95 % of the motor\'s work into push; a plain lead screw 20–50 % (and may self-lock).',
      stories: { T: 'An electric actuator with a {L} lead ball screw ({eta} efficient) must push {F}. What torque must the motor give?' }
    },
    {
      name: 'Energy drawn per stroke',
      expr: 'E = F*s/eta', tex: 'E = \\dfrac{F\\,s}{\\eta}',
      vars: {
        E: { name: 'energy drawn from the supply', q: 'energy', unit: 'kJ' },
        F: { name: 'force', q: 'force', unit: 'kN', value: 10 },
        s: { name: 'stroke', q: 'length', unit: 'm', value: 0.3 },
        eta: { name: 'efficiency, wire to work', q: 'ratio', unit: '%', value: 15, min: 0.1, max: 100, tex: '\\eta' }
      },
      stories: { E: 'An actuator pushes {F} over {s} with a wire-to-work efficiency of {eta}. How much energy does each stroke draw?' }
    }
  ],
  examples: [
    {
      title: 'A 20 kN clamp, three ways',
      q: 'A fixture must clamp with 20 kN. Size a pneumatic cylinder at 6 bar, a hydraulic one at 200 bar, and an electric drive with a 10 mm-lead ball screw (90 % efficient).',
      steps: [
        'Pneumatic: $D = \\sqrt{4 \\times 20\\,000/(\\pi \\times 6\\times10^5)} = 0.206$ m — a 200 mm bore at least (a 250 mm standard size with friction).',
        'Hydraulic: $D = \\sqrt{4 \\times 20\\,000/(\\pi \\times 2\\times10^7)} = 35.7$ mm — a 40 mm bore.',
        'Electric: $T = F L/(2\\pi\\eta) = 20\\,000 \\times 0.01/(2\\pi \\times 0.9) = 35.4$ N·m at the screw — a servo motor with a gearbox, and a brake to hold the clamp without power.'
      ],
      a: 'About 206 mm pneumatic, 36 mm hydraulic, or 35 N·m of motor torque on a 10 mm-lead screw.'
    }
  ],
  quiz: [
    { q: 'Which drive is the stiffest against a changing load, for a given size?', choices: ['pneumatic', 'hydraulic', 'they are all equally stiff', 'none; stiffness depends only on the controller'], a: 1,
      why: 'Oil\'s bulk modulus is about 1.5 GPa; air at 7 bar is roughly 0.7 MPa. A column of oil is thousands of times stiffer than the same column of air.' },
    { q: 'Which drive typically turns the smallest fraction of its electrical input into work?', choices: ['electric ball-screw drive', 'pump-controlled hydraulics', 'valve-controlled hydraulics', 'pneumatics'], a: 3,
      why: 'Compression heat and leaks leave only about 10–20 % of the energy for the pneumatic piston.' },
    { q: 'What force does a 63 mm pneumatic cylinder give at 6 bar (ignore friction)?', answer: 1.87, unit: 'kN', tol: 0.03,
      why: '$A = \\pi \\times 0.063^2/4 = 3.117\\times10^{-3}$ m²; $F = 6\\times10^5 \\times 3.117\\times10^{-3} = 1.87$ kN.' },
    { q: 'An electro-hydrostatic actuator needs a central hydraulic pump and a network of pipes.', a: false,
      why: 'An EHA carries its own motor, pump and small reservoir: only electric power and signals reach it.' }
  ],
  applications: [
    'Choosing drives for a new machine: presses and heavy handling (hydraulic), packaging lines (pneumatic), precision assembly (electric).',
    'Retrofitting machines with variable-speed pump drives to cut energy and noise.',
    'Aircraft back-up flight controls with electro-hydrostatic actuators.'
  ]
},

/* ======================================================================== SYMBOLS AND DIAGRAMS */
{
  id: 'iso-1219', parent: 'symbols-diagrams', title: 'ISO 1219 symbols', level: 1,
  short: 'The graphic language of fluid power (ISO 1219-1:2012): circles convert energy, squares are valve positions, diamonds condition the fluid, triangles show which way energy flows and whether it is liquid or gas, and dashed lines carry signals.',
  keywords: ['ISO 1219', 'ISO 1219-1', 'hydraulic symbols', 'fluid power symbols', 'graphic symbols', 'valve symbol', 'pump symbol', 'circuit diagram', 'schematic', 'pilot line', 'drain line', 'envelope', 'ANSI Y32.10'],
  prereq: ['hydraulic-system', 'fluid-power'],
  related: ['reading-circuit-diagrams', 'port-designations', 'directional-valves', 'spool-positions', 'valve-actuation', 'relief-valve', 'reducing-valve', 'check-valves', 'accumulators', 'pneumatics:iso-1219-pneu'],
  body: `
Fluid-power circuits are drawn in a compact graphic language standardised as **ISO 1219-1:2012** (the symbols) and **ISO 1219-2:2012** (how circuit diagrams are laid out). A symbol shows what a component **does** — which ports connect, in which positions, what moves it — not how it is built: a spool valve and a poppet valve with the same function share a symbol. Learn a dozen building blocks and their grammar and you can read almost any symbol, even one you have never met. The full chart is under [ISO 1219 symbols](#/tools/iso).

### The building blocks
| Shape | Meaning |
|---|---|
| Solid line | working line: pressure, return, suction |
| Long dashes | pilot (control) line |
| Short dashes | drain or leakage line |
| Dot where lines meet | a connection; lines that cross without a dot are not joined |
| Arc between two ports | flexible hose |
| Dash-dot outline | several components built as one assembly |
| Large circle | pump, motor or compressor: energy conversion |
| Small circle | measuring instrument, check-valve ball, roller |
| Square | one switching position of a valve |
| Diamond | conditioning: filter, cooler, heater, water separator |
| Rectangle with piston and rod | cylinder |
| Open-topped rectangle | tank at atmospheric pressure |
| Capsule | accumulator |

### Circles: energy conversion
A triangle on the circle shows which way energy flows: pointing **out** for a pump (energy leaves with the fluid), pointing **in** for a motor. **Filled** triangles mean a liquid, **hollow** ones a gas — the rule that tells a hydraulic drawing from a pneumatic one at a glance. Two triangles mean both flow directions; a diagonal arrow across the circle means variable displacement; two short parallel lines are the shaft. An electric motor is a circle with an M.

### Squares: directional valves
- One square per **position**: "4/3" means four ports and three squares ([[spool-positions]]).
- Arrows inside a square are the **flow paths** in that position; a ⊥ is a blocked port.
- The external lines meet only the square of the **normal position** — the spring position, often the middle one. To see what a shifted valve does, slide the neighbouring square under the ports in your mind.
- What shifts the valve is drawn at the ends: a zig-zag spring, a box with a diagonal for a solenoid, a lever, a push button, a roller, a filled triangle for hydraulic pilot pressure ([[valve-actuation]]). The device on one side brings the square next to it to the ports.

### Pressure and flow valves
A single square with an arrow offset from the ports — **normally closed** for a relief or sequence valve, **normally open** for a reducing valve — is held by a spring (an arrow through it means adjustable) and pushed by a dashed pilot line from the pressure it controls: the **inlet** for a relief valve, the **outlet** for a reducing valve ([[relief-valve]], [[reducing-valve]]). A **check valve** is a ball on a V-shaped seat ([[check-valves]]). A **throttle** is a waist between two arcs; with a check valve beside it, a one-way flow control ([[flow-control]]).

### Hydraulic or pneumatic?
The grammar is shared. Besides hollow triangles, pneumatic diagrams number their ports (1, 2, 4, 3, 5) instead of lettering them, show exhausts as small open triangles and service units where a hydraulic drawing shows a power unit ([[port-designations]], [[pneumatics:iso-1219-pneu|ISO 1219 in pneumatics]]). The 2012 edition replaced those of 1991 and 2006; older American drawings follow the similar ANSI Y32.10 symbols.

> [!tip] Decode rather than memorise: circle = conversion, square = position, diamond = conditioning, triangle = which way the energy goes and whether it is liquid or gas, dashes = signals and leakage.
`,
  ideas: [
    'Symbols show function, not construction: which ports connect in each position and what moves the valve.',
    'Circles convert energy, squares are valve positions, diamonds condition the fluid, rectangles are cylinders.',
    'Filled triangles mean hydraulic, hollow ones pneumatic; pointing out is a pump, pointing in a motor.',
    'External lines attach to the normal-position square; the actuator on one end brings the square beside it into play.',
    'Solid lines work, long dashes pilot, short dashes drain; a dot joins lines, a crossing without one does not.'
  ],
  pitfalls: [
    'A symbol shows how the valve is built inside — It shows only the function; a spool valve and a poppet valve doing the same job are drawn the same way.',
    'The lines connect to whichever square is drawn in the middle — They connect to the square of the normal (rest) position, which for a two-position spring-return valve is usually the one beside the spring.',
    'Filled and hollow triangles are a matter of drawing style — They carry meaning: filled for hydraulic (liquid), hollow for pneumatic (gas).'
  ],
  quiz: [
    { q: 'A circle with a filled triangle pointing outward and a diagonal arrow across it is…', choices: ['a fixed-displacement hydraulic motor', 'a variable-displacement hydraulic pump', 'a pneumatic compressor', 'a pressure gauge'], a: 1,
      why: 'Circle: energy conversion. Filled triangle: liquid. Pointing out: energy leaves with the fluid, so a pump. Diagonal arrow: variable.' },
    { q: 'In a hydraulic diagram, a line drawn with long dashes is…', choices: ['a flexible hose', 'a drain line', 'a pilot (control) line', 'a line not yet installed'], a: 2,
      why: 'Long dashes carry control signals (pilot pressure); short dashes are drains carrying leakage to the tank.' },
    { q: 'How many squares does the symbol of a 5/2 valve have?', choices: ['5', '2', '7', '3'], a: 1,
      why: 'The second number counts positions, and each position is one square. The first counts ports.' },
    { q: 'The dashed pilot line of a pressure-relief valve symbol comes from its…', choices: ['outlet', 'inlet', 'spring chamber', 'drain'], a: 1,
      why: 'A relief valve limits its inlet pressure, so it senses the inlet. A reducing valve controls its outlet, so it senses the outlet.' },
    { q: 'Two lines that cross on a circuit diagram without a dot are connected.', a: false,
      why: 'A dot marks a junction. Lines that simply cross are separate pipes passing each other on the paper.' }
  ],
  applications: [
    'Reading machine manuals and service diagrams from any manufacturer, in any language.',
    'Designing circuits in CAD and simulation software, which use the same symbols.',
    'Communicating between designers, maintenance technicians and suppliers.'
  ],
  history: 'Early hydraulic drawings were pictures of parts in section. Symbolic circuit diagrams grew up with industrial oil hydraulics in the 1930s–50s; in the US the JIC and later ANSI Y32.10 symbols of the 1960s set a common style, and the international ISO 1219 (first edition 1976) became the reference worldwide. The revisions of 2006 and 2012 build every symbol from basic elements on a common grid, which suits CAD.',
  sim: 'fp-symbols'
},

{
  id: 'reading-circuit-diagrams', parent: 'symbols-diagrams', title: 'Reading a circuit diagram', level: 2,
  short: 'A circuit diagram shows the system at rest with every valve in its normal position. Read it by finding the power source and pressure limit, the actuators, each valve\'s rest state and actuation — then shift the valves one at a time and trace the oil from P to the actuator and back to T.',
  keywords: ['circuit diagram', 'hydraulic schematic', 'reading schematics', 'ISO 1219-2', 'component designation', '1A1', '1V1', 'tracing flow', 'normal position', 'rest state', 'line colours', 'troubleshooting'],
  prereq: ['iso-1219', 'hydraulic-system', 'directional-valves'],
  related: ['port-designations', 'basic-circuit', 'meter-in-out', 'pilot-check', 'relief-valve', 'troubleshooting', 'hydraulic-safety', 'pneumatics:displacement-step-diagram'],
  body: `
A circuit diagram is not a picture of the machine; it is a map of what the oil can do. Parts that sit metres apart may be drawn side by side, and one valve block may appear as six symbols. Read it as a story: where the power comes from, where it can go, and what decides the route.

### What the drawing shows
- **The rest state.** Following ISO 1219-2:2012, the circuit is drawn with the pump stopped, solenoids unpowered and every valve in its **normal position** — the square held by the springs. Actuators are shown at their starting position.
- **Layout.** Power supply at the bottom, control valves in the middle, actuators at the top, so the signal flows up the page. Lines run horizontally and vertically with few crossings.
- **Codes.** Each component carries a code: in the scheme used by ISO 1219-2 and most training material, the circuit number (0 for the power supply), a letter for the kind of component — **P** pump, **M** prime mover, **A** actuator, **V** valve, **S** sensor, **Z** anything else — and a running number. So 0P1 is the pump, 1A1 the first cylinder, 1V2 a valve in its circuit; solenoids are often 1Y1, 1Y2. Larger plants add installation numbers, and companies adapt the scheme, so read the legend.
- **Data** beside the symbols: pump displacement, relief setting, cylinder bore/rod × stroke, filter rating, hose sizes, pre-charge pressures of accumulators.

### A method
1. **Find the power.** The pump and its drive, the relief valve and its setting: this bounds every pressure in the drawing.
2. **Find the work.** The actuators and what they must do — lift, clamp, rotate, hold.
3. **Read each valve at rest.** Which ports connect in the normal square? What shifts it — solenoid, pilot, lever, spring?
4. **Shift one valve at a time.** Slide the neighbouring square under the ports and trace the oil: from P through the new paths to the actuator, and from the actuator's other side back to T. Note every restriction it passes.
5. **Follow the pilot lines.** Dashed lines are signals: find which pressure opens which valve — a pilot-operated check opened by the opposite line, a sequence valve waiting for a clamp pressure ([[pilot-check]], [[sequence-valve]]).
6. **Ask what happens if the power fails** or a hose bursts: which loads are held, which fall, where pressure stays trapped.

### Line states
Training diagrams and simulations colour the lines: **red** for pump pressure, **blue** for return, **yellow** for metered or throttled oil, **orange** for pilot pressure, **green** for suction. Two effects surprise beginners. In a closed-centre valve with a fixed pump, the pressure line is at the *relief setting* while nothing moves. And in a meter-out circuit the line between the cylinder and the throttle can be at a *higher* pressure than the pump: the annulus is smaller than the piston, so the back-pressure is intensified by the area ratio ([[meter-in-out]]).

> [!warn] The diagram tells you where energy can be stored: accumulators, oil trapped behind pilot-operated check and counterbalance valves, raised loads. Before loosening any fitting, lower or support the loads, discharge accumulators, lock out the drive and prove zero pressure at the test points.
`,
  ideas: [
    'Diagrams show the rest state: pump off, solenoids off, valves in their spring (normal) positions.',
    'Power supply at the bottom, valves in the middle, actuators at the top.',
    'Component codes give circuit number, kind (P, M, A, V, S, Z) and a running number: 1A1, 1V2, 0P1.',
    'Trace by shifting one valve at a time: P → working square → actuator → other side → T.',
    'Pilot lines are the logic; ask what happens on power failure and where pressure stays trapped.'
  ],
  pitfalls: [
    'Valves are drawn in whatever position they happen to be during work — They are drawn at rest, in their normal (spring) positions; a shifted state must be imagined by sliding the squares.',
    'A diagram shows where components are on the machine — It shows functions and connections only; one symbol block may be a single valve body, and neighbours on paper may be far apart.',
    'The return side of a cylinder is always at low pressure — With a meter-out throttle or a counterbalance valve, the outlet side can be at a higher pressure than the pump.'
  ],
  examples: [
    {
      title: 'Tracing an extend stroke',
      q: 'In the circuit of the simulation below, solenoid 1Y1 is energised. Trace the oil and say what holds the load when the valve returns to its centre.',
      steps: [
        'The pump 0P1 pushes oil through the check valve 0V2 to port P of the 4/3 valve 1V1; the relief valve 0V1 guards this line.',
        '1Y1 brings the left square to the ports: P → A and B → T.',
        'From A the oil passes the pilot-operated check 1V2 in its free direction and fills the cap end of 1A1: the rod extends.',
        'The rod end pushes its oil back through the flow control 1V3, whose check is closed in this direction — the oil must squeeze through the throttle (meter-out) — then B → T, the filter and the cooler to the tank.',
        'Centre position: all four ports blocked. The pilot-operated check seals the cap end, so the load cannot creep back; the pump flow goes over the relief valve.'
      ],
      a: 'P → A → pilot-operated check → cap end; rod end → throttle → B → T → filter → cooler → tank. In the centre the pilot-operated check holds the load.'
    },
    {
      title: 'Pressure where you would not expect it',
      q: 'A 63/36 mm cylinder extends against no load in a meter-out circuit; the relief valve is set at 160 bar and the pump pressure sits there because the throttle is nearly shut. What pressure is in the line between the rod end and the throttle?',
      steps: [
        'Areas: $A_1 = \\pi \\times 63^2/4 = 3117$ mm², $A_2 = 3117 - \\pi \\times 36^2/4 = 2099$ mm².',
        'With no load and friction neglected, the piston is in balance: $p_1 A_1 = p_2 A_2$.',
        '$p_2 = 160 \\times 3117/2099 = 238$ bar — half as much again as the pump pressure.'
      ],
      a: 'About 238 bar: the line and the throttle must be rated for it.'
    }
  ],
  quiz: [
    { q: 'In what state are the valves drawn in a hydraulic circuit diagram?', choices: ['in the position they take during the main working stroke', 'in their normal (rest) position, solenoids off', 'always in the middle position', 'in whatever position the designer chooses'], a: 1,
      why: 'Diagrams show the rest state; the squares of the other positions are there for you to slide under the ports in your mind.' },
    { q: 'In the usual coding scheme, what is component 1V3?', choices: ['the first actuator of circuit 3', 'the third valve of circuit 1', 'a pump in the power supply', 'the third solenoid'], a: 1,
      why: 'Circuit number 1, letter V for valve, running number 3.' },
    { q: 'A fixed pump feeds a closed-centre 4/3 valve that is centred, and nothing moves. What pressure does the gauge on the pump line show?', choices: ['zero', 'a few bar', 'the relief-valve setting', 'the pressure needed by the load'], a: 2,
      why: 'The pump keeps delivering but every path is blocked, so the pressure rises until the relief valve opens and takes the whole flow.' },
    { q: 'In a meter-out circuit extending a differential cylinder with no load, the rod-end line can exceed the pump pressure.', a: true,
      why: 'The piston balances $p_1 A_1 = p_2 A_2$ with $A_2 < A_1$, so $p_2 = p_1 A_1/A_2$ — intensified by the area ratio.' }
  ],
  applications: [
    'Troubleshooting a machine: predicting which gauge should read what in each valve state.',
    'Checking a new design for trapped pressure, load holding and failure behaviour before it is built.',
    'Planning safe maintenance: finding every accumulator, trapped volume and raised load.'
  ],
  sim: { id: 'fp-trace', params: { mode: 'lines' } }
},

{
  id: 'port-designations', parent: 'symbols-diagrams', title: 'Ports and designations', level: 1,
  short: 'Hydraulic ports are lettered — P pressure, T tank, A and B to the actuator, X and Y pilots, L drain, M measuring (ISO 9461) — pneumatic ports numbered 1, 2, 4, 3, 5 with pilots 12 and 14 (ISO 5599-3). Mounting patterns and threads have standards too.',
  keywords: ['port designation', 'P T A B', 'X Y L', 'ports', 'ISO 9461', 'ISO 5599-3', 'port numbering', '1 2 3 4 5', '12 14', 'solenoid a b', 'ISO 4401', 'NG6', 'CETOP', 'subplate', 'ISO 6149', 'BSPP', 'SAE flange'],
  prereq: ['iso-1219', 'directional-valves'],
  related: ['reading-circuit-diagrams', 'hoses-fittings', 'valve-actuation', 'cartridge-valves', 'pneumatics:port-numbering', 'pneumatics:way-valves'],
  body: `
Every port of a hydraulic component is marked, on the part and on the diagram, so that the right hose goes to the right place. Swap A and B on a cylinder and a joystick that should lift will lower; swap P and T on a valve and the pump dead-heads against a blocked port. The markings are standardised: for hydraulic valves by **ISO 9461:1992**, for pneumatic valves by **ISO 5599-3**.

### Hydraulic letters
| Port | Meaning |
|---|---|
| **P** | pressure: from the pump |
| **T** | tank: return (older drawings: R) |
| **A**, **B** | working ports to the actuator |
| **X** | external pilot supply |
| **Y** | external pilot drain |
| **L** | leakage drain (a pump or motor case, a valve's spring chamber) |
| **M** | measuring port for a gauge or test coupling |

Pumps are usually marked **S** (suction, inlet) and **P** or **B** (outlet), motors **A** and **B** for their two main ports with **L** or **T** for the case drain. On cylinders, diagrams conventionally put A on the cap end and B on the rod end. **Solenoids** are lettered **a** and **b**: energising one brings the valve square drawn next to it to the ports, and which connection that makes depends on the spool — read the symbol, not the letter ([[valve-actuation]]).

### Pneumatic numbers
Pneumatics numbers its ports so that the number says the function: **1** supply, **2** and **4** outputs, **3** and **5** exhausts. A pilot port carries a two-digit number that names the connection its signal makes: **14** connects 1 to 4, **12** connects 1 to 2, and **10** shuts off the supply. Older pneumatic drawings used P, A, B, R, S and X, Y, Z ([[pneumatics:port-numbering|port numbering]]).

| Function | Hydraulic | Pneumatic |
|---|---|---|
| Supply | P | 1 |
| Outputs | A, B | 2, 4 |
| Return, exhaust | T | 3, 5 |
| Pilot signals | X (and Y drain) | 12, 14, 10 |

### Mounting patterns and connections
Industrial directional valves bolt to **subplates** or manifolds with a standard hole pattern (**ISO 4401:2005**), so valves from different makers interchange. The sizes are known by their nominal bore or the older European names: NG6 (CETOP 3, roughly up to 60–80 L/min), NG10 (CETOP 5, up to about 120–160 L/min), NG16, NG25 and NG32 for several hundred litres a minute. Screw-in **cartridge valves** fit standard cavities in a block ([[cartridge-valves]]). Ports themselves are threaded to one of several standards — metric threads with an O-ring (ISO 6149), BSPP with a bonded seal (ISO 1179), UNF with an O-ring boss (SAE J1926) — or, for big lines, four-bolt **SAE/ISO 6162 flanges**. Threads that look alike may not seal alike: a wrong fitting may hold at first and blow out under pressure ([[hoses-fittings]]).

> [!warn] Before disconnecting any line, release the pressure and lock out the machine, then label both ends so they go back where they came from. Cap open ports at once: dirt entering during a repair is a common cause of later failures.
`,
  ideas: [
    'Hydraulic ports: P pressure, T tank, A and B work, X pilot, Y pilot drain, L leakage, M gauge.',
    'Pneumatic ports: 1 supply, 2 and 4 outputs, 3 and 5 exhausts; pilot 14 connects 1 to 4, 12 connects 1 to 2.',
    'Solenoid a or b brings the square beside it to the ports; the spool decides what connects.',
    'Subplate patterns (ISO 4401: NG6, NG10…) and port threads are standardised, but similar-looking threads may not be interchangeable.'
  ],
  pitfalls: [
    'Solenoid "a" always connects P to A — It brings the square next to it to the ports; which ports connect in that square depends on the spool type, so read the symbol.',
    'L and T are the same, so a drain can join any return line — A case drain must reach the tank with almost no back-pressure; teeing it into a busy return line can blow shaft seals.',
    'Any fitting that screws in will do — BSPP, metric, NPT and UNF threads can look alike; mismatched threads or seals may hold at first and fail under pressure.'
  ],
  quiz: [
    { q: 'On a hydraulic valve, what is port T?', choices: ['a test point', 'the return to the tank', 'a pilot supply', 'the torque motor connection'], a: 1,
      why: 'T is the tank (return) port. M is the measuring port; X the pilot supply.' },
    { q: 'On a pneumatic 5/2 valve, what does pilot port 14 do?', choices: ['exhausts port 4', 'connects supply 1 to output 4', 'connects output 1 to exhaust 4', 'it is a drain'], a: 1,
      why: 'The two digits name the connection the signal makes: 1 to 4.' },
    { q: 'Which letter marks the case-drain line of a hydraulic motor?', choices: ['P', 'X', 'L', 'M'], a: 2,
      why: 'L is the leakage drain. X is an external pilot supply, M a measuring port.' },
    { q: 'Valves with the same ISO 4401 size (for example NG6) from different makers fit the same subplate.', a: true,
      why: 'That is the purpose of the standard mounting pattern: the valves interchange, although their internal details and flow ratings differ.' }
  ],
  applications: [
    'Replacing a valve or hose on a machine without swapping functions.',
    'Specifying valve blocks and subplates that accept valves from several suppliers.',
    'Reading pneumatic and hydraulic drawings side by side on the same machine.'
  ],
  sim: { id: 'fp-symbols', params: { pick: 'v43c' } }
},

/* ======================================================================== APPLICATIONS */
{
  id: 'mobile-hydraulics', parent: 'applications', title: 'Mobile hydraulics: excavators and tractors', level: 2,
  short: 'Hydraulics on engine-driven machines: a 20-tonne excavator\'s two power-limited pumps at about 350 bar, open-centre and load-sensing valve systems, flow sharing, and the tractor\'s hitch, remote valves and hydrostatic steering.',
  keywords: ['mobile hydraulics', 'excavator', 'backhoe', 'tractor', 'open centre', 'load sensing', 'LS', 'flow sharing', 'LUDV', 'power limiting', 'constant power', 'three-point hitch', 'orbital steering', 'priority valve', 'hose-burst valve', 'main control valve'],
  prereq: ['pressure-flow-power', 'hydraulic-cylinder', 'variable-displacement'],
  related: ['load-sensing', 'open-closed-centre', 'hydrostatic-transmission', 'pressure-compensation', 'counterbalance-valve', 'energy-losses-heat', 'hydraulics-vs-alternatives', 'math:law-of-cosines', 'physics:torque'],
  body: `
Mobile hydraulics works where an industrial power unit never has to: the pump is driven by a diesel engine whose speed and power vary, weight and space are scarce, several functions move at once under one operator's hands, and the machine lives in mud, frost and heat. It is also where hydraulics is most at home — nothing else moves a 20-tonne excavator's arm with the same strength, toughness and finesse.

### A 20-tonne excavator
- An **engine** of about 110 kW drives **two variable-displacement piston pumps** in tandem, each giving up to about 220 L/min, and a small **pilot pump** at 30–40 bar for the joysticks.
- A **main control valve** has a section for each function: boom, arm, bucket, swing, left and right travel and an auxiliary for attachments.
- **Cylinders**: two for the boom (about 120 mm bore), one for the arm (about 140 mm), one for the bucket; a **swing motor** with a reduction gear and brake; two-speed **travel motors** in the tracks.
- **Pressure**: main relief about 343 bar (35 MPa), briefly more with "power boost"; **port relief valves** protect each cylinder from shocks from outside.
- **Load holding**: hose-burst valves on the boom and arm cylinders, required when the machine lifts loads on slings.

The engine, not the pumps, is the limit. At 300 bar the 100 kW or so the engine can spare for the pumps supports only about 175 L/min in total; at 150 bar, twice that. A **power regulator** destrokes the pumps as the pressure rises, keeping $pQ$ just under what the engine can give — a hyperbola of constant power ([[variable-displacement]]).

### Open centre
In an **open-centre** valve bank the pump flow passes straight through the neutral centres of every section to the tank. Moving a lever gradually closes this bypass and opens the path to the cylinder, so the pressure rises until the load moves. The operator feels the load through the lever — the heavier it is, the further the lever goes before anything moves. Excavators refine it with **negative** or **positive flow control**: a signal from the end of the centre gallery, or from the joysticks, tells the pumps how much flow is wanted ([[open-closed-centre]]).

### Load sensing
In a **closed-centre load-sensing** system the pump pressure follows the highest load pressure plus a **margin** of 15–30 bar, picked up through a chain of shuttle valves. A **pressure compensator** in each section holds a constant drop across its metering edge, so the flow follows the lever whatever the load. If the operator asks for more flow than the pump has, **flow sharing** (post-compensated valves, known by the German initials LUDV) slows every function in proportion instead of stalling the heaviest. The losses are the margin times the total flow plus the throttling of every function lighter than the heaviest ([[load-sensing]], [[pressure-compensation]]).

### Tractors and other machines
A tractor's load-sensing pump (100–200 L/min at about 200 bar) feeds the **three-point hitch** — its lift arms under electronic draft control, which holds a plough's pull steady — **remote valves** at the back for implements, the trailer brakes, and, through a **priority valve**, the steering first. **Hydrostatic steering** meters oil from an orbital unit on the steering column to the steering cylinder with no mechanical link to the wheels. Loaders, telehandlers, harvesters, forestry machines and refuse trucks are built from the same blocks.

> [!warn] Raised booms, buckets and implements are stored energy. Lower them to the ground before leaving the seat or starting work on the machine; if they must stay up, use the machine's mechanical supports. Pressure stays trapped in cylinder lines after the engine stops — relieve it as the manual describes before loosening any fitting.
`,
  ideas: [
    'Mobile machines are engine-driven: a regulator keeps the pumps\' p·Q within the engine\'s power.',
    'A 20-tonne excavator works at about 343 bar with two variable piston pumps of about 220 L/min each.',
    'Open centre bypasses the pump flow to tank in neutral and gives the operator a feel of the load.',
    'Load sensing keeps the pump a margin above the highest load; compensators make flow follow the lever.',
    'Flow sharing slows all functions in proportion when the pump cannot supply them all.'
  ],
  pitfalls: [
    'An excavator\'s pumps always give their full flow — Only at low pressure; above about 150 bar the power regulator trades flow for pressure to keep within the engine\'s power.',
    'Load sensing removes throttling losses — It removes the relief and standby losses, but every function lighter than the heaviest is still throttled down to its own pressure.',
    'A closed spool valve holds a raised boom indefinitely — Spools leak; long-term holding and hose-burst protection need poppet-type load-holding valves on the cylinder.'
  ],
  formulas: [
    {
      name: 'Pump flow under a power limit',
      expr: 'Q = eta*P/p', tex: 'Q = \\dfrac{\\eta\\,P}{p}',
      vars: {
        Q: { name: 'largest pump flow', q: 'flowrate', unit: 'L/min' },
        eta: { name: 'overall pump efficiency', q: 'ratio', unit: '%', value: 88, min: 1, max: 100, tex: '\\eta' },
        P: { name: 'engine power given to the pump', q: 'power', unit: 'kW', value: 50 },
        p: { name: 'working pressure (gauge)', q: 'pressure', unit: 'bar', value: 300 }
      },
      note: 'The constant-power hyperbola: halve the pressure and the regulator allows twice the flow, up to the pump\'s maximum displacement.',
      stories: { Q: 'An excavator pump receives {P} from the engine and is {eta} efficient. What flow can it give at {p}?', p: 'A pump receiving {P} ({eta} efficient) gives {Q}. Up to what pressure can it keep that flow?' }
    },
    {
      name: 'Load-sensing losses with two functions',
      expr: 'Ploss = (p1 - p2)*Q2 + dpm*(Q1 + Q2)', tex: 'P_{loss} = (p_1 - p_2)\\,Q_2 + \\Delta p_m\\,(Q_1 + Q_2)',
      vars: {
        Ploss: { name: 'throttling losses', q: 'power', unit: 'kW', tex: 'P_{loss}' },
        p1: { name: 'heavier load pressure (gauge)', q: 'pressure', unit: 'bar', value: 250, tex: 'p_1' },
        p2: { name: 'lighter load pressure (gauge)', q: 'pressure', unit: 'bar', value: 100, tex: 'p_2' },
        Q1: { name: 'flow to the heavier function', q: 'flowrate', unit: 'L/min', value: 60, tex: 'Q_1' },
        Q2: { name: 'flow to the lighter function', q: 'flowrate', unit: 'L/min', value: 80, tex: 'Q_2' },
        dpm: { name: 'load-sensing margin', q: 'pressure', unit: 'bar', value: 20, tex: '\\Delta p_m' }
      },
      note: 'The pump runs at p₁ + Δp_m. The heavier function loses only the margin; the lighter one also loses the difference between the two load pressures in its compensator.',
      stories: { Ploss: 'A load-sensing machine runs a boom at {p1} with {Q1} and a bucket at {p2} with {Q2}, with a margin of {dpm}. How much power is throttled into heat?' }
    }
  ],
  examples: [
    {
      title: 'The engine sets the flow',
      q: 'An excavator engine can give 100 kW to its pumps, which are 88 % efficient and can deliver 440 L/min in total at most. What total flow is available at 300 bar and at 150 bar?',
      steps: [
        'Hydraulic power available: $0.88 \\times 100 = 88$ kW.',
        'At 300 bar: $Q = 600 \\times 88/300 = 176$ L/min — the pumps are well destroked.',
        'At 150 bar: $Q = 600 \\times 88/150 = 352$ L/min, still below the 440 L/min the pumps could give.',
        'This is why a heavy dig slows the machine down, and why the regulator sums both pumps\' pressures to share the engine between them.'
      ],
      a: 'About 176 L/min at 300 bar and 352 L/min at 150 bar.'
    },
    {
      title: 'Two functions on one load-sensing pump',
      q: 'The boom lifts at 250 bar with 60 L/min while the bucket curls at 100 bar with 80 L/min; the load-sensing margin is 20 bar. Find the pump power, the useful power and the losses.',
      steps: [
        'Pump pressure: $250 + 20 = 270$ bar; pump power $270 \\times 140/600 = 63$ kW.',
        'Useful power: $250 \\times 60/600 + 100 \\times 80/600 = 25 + 13.3 = 38.3$ kW.',
        'Losses: $(250 - 100) \\times 80/600 + 20 \\times 140/600 = 20 + 4.7 = 24.7$ kW — mostly the bucket\'s compensator throttling 150 bar.',
        'Hydraulic efficiency $38.3/63 = 61$ %. Running functions at similar pressures, or with separate pumps, saves most of the loss.'
      ],
      a: 'Pump 63 kW, useful 38.3 kW, losses 24.7 kW (61 %).'
    }
  ],
  quiz: [
    { q: 'Why does an excavator\'s pump regulator reduce the flow as the pressure rises?', choices: ['to protect the hoses from high velocity', 'to keep p·Q within the engine\'s power so it does not stall', 'because the relief valve is opening', 'because oil thickens at high pressure'], a: 1,
      why: 'The pumps could absorb far more power than the engine has. The regulator follows a constant-power curve: more pressure, less flow.' },
    { q: 'In a load-sensing system with a 20 bar margin, the heaviest function needs 200 bar. What is the pump pressure?', answer: 220, unit: 'bar', tol: 0.02,
      why: 'The pump follows the highest load pressure plus the margin: 200 + 20 = 220 bar.' },
    { q: 'In an open-centre system with all levers in neutral, the pump flow returns to tank through the valve centres at low pressure.', a: true,
      why: 'That is what "open centre" means: a straight path through every section\'s neutral position. Moving a lever closes it progressively.' },
    { q: 'With flow sharing (LUDV), what happens when the operator demands more flow than the pump can deliver?', choices: ['the heaviest function stops', 'the lightest function takes all the flow', 'all functions slow down in proportion', 'the relief valve opens'], a: 2,
      why: 'Post-compensated valves divide the available flow in the ratio of the lever openings, so the machine keeps moving as the operator intended, only slower.' }
  ],
  problems: [
    { q: 'A pump receives 60 kW of hydraulic power (after its losses). What is the largest flow it can deliver at 250 bar?', answer: 144, unit: 'L/min', tol: 0.02,
      steps: ['$Q = 600\\,P/p = 600 \\times 60/250 = 144$ L/min.'] },
    { q: 'What force does a 140 mm bore arm cylinder push with at 343 bar?', answer: 528, unit: 'kN', tol: 0.02,
      steps: ['$A = \\pi \\times 0.14^2/4 = 0.01539$ m².', '$F = 3.43\\times10^7 \\times 0.01539 = 528$ kN — over 50 tonnes.'] }
  ],
  applications: [
    'Excavators, backhoe loaders and mini-excavators.',
    'Tractors: hitch, remote valves, front loaders, steering and trailer brakes.',
    'Wheel loaders, telehandlers, harvesters, forestry machines, refuse trucks and aerial platforms.'
  ],
  history: 'Hydraulic excavators replaced the rope-operated shovels from the 1950s and 1960s, once reliable high-pressure pumps and hoses allowed the boom, arm and bucket to be driven by cylinders. Load-sensing systems spread through agricultural and construction machinery in the 1970s–80s, flow-sharing valves in the 1990s, and electronic pump control followed.',
  sim: 'fp-excavator'
},

{
  id: 'industrial-presses', parent: 'applications', title: 'Presses and machine tools', level: 2,
  short: 'Hydraulic presses turn pressure into hundreds or thousands of tonnes of force. Their cycle — rapid approach with a prefill valve, pressing, dwell, controlled decompression, return — and the pumps, clamps, moulding machines and safety rules around them.',
  keywords: ['hydraulic press', 'tonnage', 'press cycle', 'prefill valve', 'decompression', 'compressibility', 'bulk modulus', 'hi-lo', 'servo pump', 'injection moulding', 'die casting', 'clamping', 'press brake', 'ISO 16092-3'],
  prereq: ['hydraulic-press', 'hydraulic-cylinder', 'bulk-modulus'],
  related: ['hi-lo-circuit', 'accumulator-circuits', 'reducing-valve', 'synchronizing', 'energy-losses-heat', 'force-multiplication', 'hydraulic-safety', 'regenerative-circuit'],
  body: `
A hydraulic press is fluid power at its purest: a large cylinder in a stiff frame, turning pressure into force. A 250 mm bore at 300 bar pushes 1.47 MN — 150 tonnes — and the force can be set, held and repeated at any point of the stroke. Workshop presses give 10–50 tonnes; production presses for sheet metal, composites and powder compaction 100–2000 tonnes; the great forging presses built in the 1950s under the US Heavy Press Program about 45 000 tonnes.

### The press cycle
1. **Rapid approach.** The ram falls under its own weight or is driven by small fast cylinders, while a **prefill valve** — a large pilot-operated check — lets the main cylinder suck oil from a tank above it: thousands of litres a minute at almost no pressure ([[regenerative-circuit]] is another way to go fast).
2. **Pressing.** The prefill valve closes and the pump builds pressure. Before force appears the pump must **compress the oil** and **stretch the frame**: oil shrinks by about 1 % per 150–180 bar, $\\Delta V = V\\,\\Delta p/K$ with $K \\approx 1.5$–1.8 GPa ([[bulk-modulus]]).
3. **Dwell.** The pressure is held while the part forms, cures or bonds.
4. **Decompression.** Compressed oil and stretched steel hold elastic energy — for the oil alone $E = V\\Delta p^2/2K$. Opened at once to the tank it escapes in milliseconds with a bang: shock in the lines, burst hoses, a leaping ram. So the pressure is first bled down through a small valve or a proportional ramp, and only then does the main return open.
5. **Return.** The ram rises on its small annulus or on pull-back cylinders, quickly, since little force is needed.

### Pumps for presses
The cycle wants great flow at low pressure and little flow at high pressure. **Hi-lo** circuits pair a big low-pressure pump with a small high-pressure one and unload the big one as the pressure rises ([[hi-lo-circuit]]); variable pumps with pressure and flow control do the same in one unit. Increasingly a **variable-speed servo motor** turns a fixed pump only as fast as each moment needs and almost stops during dwell, saving typically 30–70 % of the energy and much of the noise ([[energy-losses-heat]]).

### Machine tools and moulding
- **Clamping**: a pressure-reducing valve sets the clamp force, a pressure switch confirms it before machining starts ([[reducing-valve]]).
- **Injection moulding**: the clamp holds the mould shut against hundreds of tonnes; the injection cylinder pushes the screw, raising the melt to 1000–2000 bar, often helped by **accumulators** for a fast shot ([[accumulator-circuits]]).
- **Die casting**: an accumulator-driven shot cylinder fills the die in tens of milliseconds, then an intensifier raises the pressure as the metal freezes ([[intensifiers]]).
- **Press brakes**: two cylinders kept parallel by proportional valves and linear scales ([[synchronizing]]).

### Safety
Presses are among the most dangerous machines. Hydraulic presses follow **ISO 16092-3:2017** alongside **ISO 4413:2010**: fixed guards and light curtains, two-hand controls, **redundant, monitored valves** that stop and hold the ram even if one sticks, and mechanical blocks for work in the tool.

> [!warn] Never reach into a press tool on hydraulic holding alone. Lock out, lower the ram onto blocks or insert the safety prop, and relieve all pressure — accumulators included — before any tool change or maintenance.
`,
  ideas: [
    'Press force is pressure times piston area: a 250 mm bore at 300 bar gives about 150 tonnes.',
    'The cycle is rapid approach (prefill), pressing, dwell, decompression, return.',
    'Oil compresses about 1 % per 150–180 bar; compressing it and stretching the frame take pump time and store energy.',
    'Decompress gradually before opening to tank, or the stored energy is released as a shock.',
    'Hi-lo pumps and variable-speed servo drives match flow and pressure to each phase and save energy.'
  ],
  pitfalls: [
    'Oil is incompressible, so pressure appears the instant the tool touches the work — Tens of litres of oil shrink by 1–2 % at press pressures; the pump needs seconds to build the force, and that volume is stored energy.',
    'The return valve can be opened as soon as pressing ends — Without decompression the compressed oil and stretched frame release their energy in milliseconds as a damaging shock.',
    'A press ram standing still at the top of its stroke is safe to reach under — Hydraulic holding can fail; only mechanical blocks, safety props and lock-out make the tool area safe.'
  ],
  formulas: [
    {
      name: 'Press force',
      expr: 'F = n*p*pi*D^2/4', tex: 'F = n\\,p\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'press force', q: 'force', unit: 'kN' },
        n: { name: 'number of main cylinders', q: 'count', value: 2, int: true, min: 1 },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 280 },
        D: { name: 'bore of each cylinder', q: 'length', unit: 'mm', value: 200 }
      },
      note: 'Ignores the ram\'s weight (which adds on a down-stroking press) and seal friction.',
      practice: { unknowns: ['F', 'D', 'p'] },
      stories: {
        F: 'A press has {n} cylinders of {D} bore at {p}. What force does it press with?',
        D: 'A press with {n} cylinders must reach {F} at {p}. What bore does each need?',
        p: 'A press with {n} cylinders of {D} must press {F}. What pressure does it need?'
      }
    },
    {
      name: 'Oil compressed by a pressure rise',
      expr: 'dV = V*dp/K', tex: '\\Delta V = \\dfrac{V\\,\\Delta p}{K}',
      vars: {
        dV: { name: 'extra oil to pump in', q: 'volume', unit: 'L', tex: '\\Delta V' },
        V: { name: 'oil volume under pressure', q: 'volume', unit: 'L', value: 60 },
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', value: 300, tex: '\\Delta p' },
        K: { name: 'effective bulk modulus of the oil', q: 'pressure', unit: 'GPa', value: 1.6 }
      },
      note: 'Hoses and entrained air lower the effective bulk modulus, sometimes to well under 1 GPa; the frame\'s stretch adds more volume.',
      stories: { dV: 'A press cylinder and its lines hold {V} of oil (bulk modulus {K}). How much more oil must the pump deliver to raise it by {dp}?' }
    },
    {
      name: 'Energy stored in compressed oil',
      expr: 'E = V*dp^2/(2*K)', tex: 'E = \\dfrac{V\\,\\Delta p^2}{2K}',
      vars: {
        E: { name: 'stored elastic energy', q: 'energy', unit: 'kJ' },
        V: { name: 'oil volume under pressure', q: 'volume', unit: 'L', value: 60 },
        dp: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 300, tex: '\\Delta p' },
        K: { name: 'effective bulk modulus', q: 'pressure', unit: 'GPa', value: 1.6 }
      },
      note: 'The oil alone; the stretched frame and tooling usually store as much again or more.',
      stories: { E: 'A press holds {V} of oil at {dp} (bulk modulus {K}). How much energy must decompression release?' }
    },
    {
      name: 'Time to build pressure',
      expr: 't = V*dp/(K*Q)', tex: 't = \\dfrac{V\\,\\Delta p}{K\\,Q}',
      vars: {
        t: { name: 'time to compress the oil', q: 'time', unit: 's' },
        V: { name: 'oil volume under pressure', q: 'volume', unit: 'L', value: 60 },
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', value: 300, tex: '\\Delta p' },
        K: { name: 'effective bulk modulus', q: 'pressure', unit: 'GPa', value: 1.6 },
        Q: { name: 'high-pressure pump flow', q: 'flowrate', unit: 'L/min', value: 10 }
      },
      note: 'A lower bound: frame stretch and the workpiece\'s own give add to the volume.',
      stories: { t: 'A high-pressure pump of {Q} must raise {V} of oil (bulk modulus {K}) by {dp}. How long does it take at least?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a 400-tonne press',
      q: 'A press must give 400 tonnes-force with one cylinder at 250 bar. What bore does it need?',
      steps: [
        'Force: $400\\,000 \\times 9.81 = 3.92$ MN.',
        'Area: $A = F/p = 3.92\\times10^6/2.5\\times10^7 = 0.157$ m².',
        'Bore: $D = \\sqrt{4A/\\pi} = 0.447$ m — a 450 mm cylinder.'
      ],
      a: 'About 447 mm; a 450 mm bore.'
    },
    {
      title: 'What decompression has to release',
      q: 'That 450 mm cylinder has 300 mm of oil column under the piston, plus 20 L in the prefill valve and lines; the effective bulk modulus is 1.6 GPa. How much oil does the pump push in to reach 250 bar, how long does a 20 L/min high-pressure pump take, and what energy is stored?',
      steps: [
        'Volume under pressure: $0.159 \\times 0.3 = 0.0477$ m³ plus 0.020 m³ = 67.7 L.',
        'Compression: $\\Delta V = V\\Delta p/K = 0.0677 \\times 2.5\\times10^7/1.6\\times10^9 = 1.06$ L.',
        'Time: $1.06/20$ min = 3.2 s before any force appears beyond what the frame\'s stretch also soaks up.',
        'Energy: $E = V\\Delta p^2/2K = 0.0677 \\times (2.5\\times10^7)^2/3.2\\times10^9 = 13.2$ kJ — about the kinetic energy of a one-tonne car at 18 km/h, to be let out gently.'
      ],
      a: 'About 1.06 L, 3.2 s, and 13 kJ stored in the oil alone.'
    }
  ],
  quiz: [
    { q: 'What does the prefill valve of a large press do?', choices: ['limits the maximum pressure', 'lets the main cylinder fill from an overhead tank during the fast approach', 'holds the ram at the top of the stroke', 'cools the oil'], a: 1,
      why: 'During the rapid approach the cylinder swallows far more oil than the pump gives; the big pilot-operated check lets it suck from a tank above, then closes for pressing.' },
    { q: 'Why must a press decompress before the return stroke begins?', choices: ['to save oil', 'to release the elastic energy of the compressed oil and stretched frame gently instead of as a shock', 'to let the oil cool', 'to let the ram fall'], a: 1,
      why: 'Opening the full cylinder to tank at once releases the stored energy in milliseconds, with pressure shocks that damage hoses, valves and the frame.' },
    { q: 'How much extra oil must be pumped into 50 L of oil to raise it to 300 bar (K = 1.6 GPa)?', answer: 0.9375, unit: 'L', tol: 0.03,
      why: '$\\Delta V = V\\Delta p/K = 50 \\times 3\\times10^7/1.6\\times10^9 = 0.94$ L.' },
    { q: 'A servo-pump press drive can almost stop its motor during dwell while still holding the pressure.', a: true,
      why: 'It only needs to replace the leakage, so the motor turns slowly — which is where much of the energy saving comes from.' }
  ],
  problems: [
    { q: 'A press has four cylinders of 160 mm bore working at 250 bar. What is its force?', answer: 2011, unit: 'kN', tol: 0.02,
      steps: ['$A = 4 \\times \\pi \\times 0.16^2/4 = 0.0804$ m².', '$F = 2.5\\times10^7 \\times 0.0804 = 2.01\\times10^6$ N = 2010 kN — about 205 tonnes-force.'] }
  ],
  applications: [
    'Forging, extrusion and deep-drawing presses; powder compaction and composite moulding.',
    'Injection-moulding and die-casting machines.',
    'Press brakes, clamping fixtures and workholding on machine tools.',
    'Workshop presses for bearings, bushes and straightening.'
  ],
  history: 'Bramah\'s press of 1795 was the first. Water-hydraulic forging presses of thousands of tonnes, fed from accumulators, shaped armour plate and guns in the late nineteenth century. After the Second World War the US Heavy Press Program built forging and extrusion presses of up to 50 000 short tons (about 45 000 tonnes) for aircraft structures; some still work today.',
  sim: 'fp-press'
},

{
  id: 'aircraft-hydraulics', parent: 'applications', title: 'Aircraft hydraulics', level: 2,
  short: 'Airliners move flight controls, landing gear, brakes and reversers with three independent hydraulic systems at 3000 psi (207 bar) — 5000 psi (345 bar) on the A380 and 787 — powered by engine pumps, electric pumps, a ram-air turbine and power transfer units, filled with fire-resistant phosphate-ester fluid.',
  keywords: ['aircraft hydraulics', '3000 psi', '5000 psi', 'redundancy', 'three systems', 'green blue yellow', 'engine-driven pump', 'EDP', 'ram air turbine', 'RAT', 'power transfer unit', 'PTU', 'phosphate ester', 'Skydrol', 'AS1241', 'flight controls', 'EHA', 'more electric aircraft'],
  prereq: ['pressure-flow-power', 'hydraulic-system', 'hydraulic-cylinder'],
  related: ['servo-valves', 'servo-loop', 'hydraulic-stiffness', 'fire-resistant-fluids', 'accumulators', 'hydraulics-vs-alternatives', 'aerodynamics:control-surfaces', 'hydraulic-safety'],
  body: `
An airliner's controls must move surfaces against tonnes of air load, quickly, precisely and without fail, in an airframe where every kilogram costs fuel for decades. Hydraulics does it: a small piston actuator at 200 bar and more has an unmatched power-to-weight ratio, and a column of oil holds a control surface stiffly enough to keep flutter away ([[hydraulic-stiffness]]).

### What it drives
Primary flight controls — ailerons, elevators, rudder ([[aerodynamics:control-surfaces|control surfaces]]) — spoilers and speed brakes, flaps and slats (often through hydraulic motors turning long torque shafts), landing-gear retraction and extension, nose-wheel steering, wheel brakes with anti-skid, thrust reversers and cargo doors.

### 3000 and 5000 psi
Transport aircraft settled on **3000 psi (207 bar)** in the 1950s, after lower pressures of about 1000–1500 psi in the 1940s; Concorde used 4000 psi. The **Airbus A380** and **Boeing 787** moved to **5000 psi (345 bar)**. At the same force every actuator's area shrinks by 40 %, the same power needs 40 % less flow, and there is 40 % less fluid in the pipes; the savings on a large airliner were reported to be of the order of a tonne. The tubes need thicker walls for the pressure, $t = pD/2\\sigma$, but their bores shrink.

### Redundancy
A single hydraulic failure must never cost control, so airliners carry **three independent systems** — Airbus names them Green, Blue and Yellow, Boeing's wide-bodies Left, Centre and Right, and the 737 has A, B and a standby — each with its own reservoir, pumps, filters and accumulators, and no fluid shared. Each primary surface is moved by actuators on two or three systems, so the aircraft stays controllable with two systems lost.

| Power source | Role |
|---|---|
| Engine-driven pump | the main source, one or two per engine |
| Electric motor pump | back-up, and ground power with the engines off |
| Ram-air turbine | swings into the airstream if engines or electrics fail, powering the essential controls |
| Power transfer unit | a motor driving a pump: one system powers another without mixing their fluids |
| Accumulators | brakes (including the parking brake) and emergency functions |

The power transfer unit is the source of the dog-like barking heard in some twin jets taxiing on one engine.

### The fluid
Transport aircraft use **phosphate-ester** fluids (SAE AS1241 Type IV and V), chosen because they resist fire far better than mineral oil. They are aggressive: they strip paint, attack ordinary nitrile rubber (the systems use ethylene-propylene seals) and irritate eyes and skin, so technicians wear gloves and eye protection. Military and light aircraft often use red hydrocarbon fluids (MIL-PRF-83282, MIL-PRF-5606) with nitrile seals. The families must never be mixed: a wrong top-up means draining, flushing and resealing ([[fire-resistant-fluids]]).

### More electric
The A380 and A350 replaced one hydraulic system with **electrical back-up actuators** — electro-hydrostatic units, each with its own motor and pump, powered by wire. The 787 brakes electrically. Pumps move closer to the actuators; the oil stays where the force is needed ([[hydraulics-vs-alternatives]]).

> [!warn] Aircraft systems are maintained only under the approved maintenance manual. Accumulators and pressurised reservoirs hold energy after shutdown, and control surfaces can move without warning when a system is pressurised: keep clear, and depressurise before work.
`,
  ideas: [
    'Airliners use three independent hydraulic systems; every primary surface is driven from at least two.',
    '3000 psi (207 bar) is the classic pressure; 5000 psi (345 bar) on the A380 and 787 shrinks actuators and fluid volume by 40 %.',
    'Engine pumps, electric pumps, a ram-air turbine, power transfer units and accumulators give layers of back-up.',
    'Phosphate-ester fluids resist fire but attack paint, nitrile seals and skin; fluid families must never be mixed.',
    'More-electric aircraft replace one hydraulic system with electro-hydrostatic actuators.'
  ],
  pitfalls: [
    'Going to 5000 psi saves weight mainly through lighter tubes — For the same power and oil velocity the metal in a thin tube wall stays about the same; the savings come from smaller actuators, components and far less fluid.',
    'A power transfer unit pumps fluid from one system into the other — It transfers power, not fluid: a hydraulic motor on one system turns a pump on the other, keeping the systems separate.',
    'Any hydraulic fluid will do for an emergency top-up — Phosphate-ester and hydrocarbon fluids are incompatible with each other\'s seals; mixing them means draining, flushing and resealing the system.'
  ],
  formulas: [
    {
      name: 'Actuator area for a hinge moment',
      expr: 'A = M/(r*p)', tex: 'A = \\dfrac{M}{r\\,p}',
      vars: {
        A: { name: 'piston area needed', q: 'area', unit: 'cm²' },
        M: { name: 'hinge moment of the control surface', q: 'torque', unit: 'kN·m', value: 20 },
        r: { name: 'lever arm of the actuator (horn)', q: 'length', unit: 'm', value: 0.2 },
        p: { name: 'pressure difference across the piston', q: 'pressure', unit: 'psi', value: 3000 }
      },
      note: 'Actuator perpendicular to the horn, no friction or back-pressure; real designs keep a margin and use the pressure left after line losses.',
      stories: { A: 'A control surface needs {M} of hinge moment; its actuator acts on a {r} horn at {p}. What piston area does it need?' }
    },
    {
      name: 'Wall thickness of a thin tube (Barlow)',
      expr: 't = p*D/(2*sig)', tex: 't = \\dfrac{p\\,D}{2\\sigma}',
      vars: {
        t: { name: 'wall thickness', q: 'length', unit: 'mm' },
        p: { name: 'design pressure (gauge)', q: 'pressure', unit: 'psi', value: 5000 },
        D: { name: 'tube diameter', q: 'length', unit: 'mm', value: 12.7 },
        sig: { name: 'allowable hoop stress (including the safety factor)', q: 'stress', unit: 'MPa', value: 250, tex: '\\sigma' }
      },
      note: 'Thin-wall hoop stress; aircraft tubing is also sized for pressure pulses, handling damage and fatigue, which set minimum gauges.',
      stories: { t: 'A {D} titanium tube carries {p}; the allowable hoop stress is {sig}. What wall thickness does it need?' }
    }
  ],
  examples: [
    {
      title: 'An actuator at 3000 and 5000 psi',
      q: 'A control-surface actuator must push 100 kN and move at 0.1 m/s. Compare the piston area, bore and flow at 3000 psi and 5000 psi.',
      steps: [
        '3000 psi = 206.8 bar: $A = 10^5/2.068\\times10^7 = 48.4$ cm², a 78.5 mm bore; flow $A v = 4.84\\times10^{-4}$ m³/s = 29.0 L/min.',
        '5000 psi = 344.7 bar: $A = 10^5/3.447\\times10^7 = 29.0$ cm², a 60.8 mm bore; flow 17.4 L/min.',
        'Area, flow and the fluid needed all fall by 40 %; the actuator, its valve and its lines shrink with them.'
      ],
      a: '48.4 cm² (78.5 mm, 29 L/min) at 3000 psi; 29.0 cm² (60.8 mm, 17.4 L/min) at 5000 psi.'
    },
    {
      title: 'Why the tubes do not get lighter',
      q: 'A line carries the same power at the same oil velocity at 3000 and at 5000 psi. How do its bore, wall thickness and metal per metre compare?',
      steps: [
        'Same power at higher pressure: flow and bore area fall by 3/5, so the bore falls by $\\sqrt{0.6} = 0.775$.',
        'Wall: $t \\propto pD$, so $t_2/t_1 = (5/3) \\times 0.775 = 1.29$.',
        'Metal per metre $\\propto D\\,t$: $0.775 \\times 1.29 = 1.00$ — unchanged. Fluid inside $\\propto D^2$: 0.6 of before.'
      ],
      a: 'Bore 0.775×, wall 1.29×, metal the same, fluid 40 % less.'
    }
  ],
  quiz: [
    { q: 'Why do airliners have three independent hydraulic systems?', choices: ['to triple the available power', 'so that the failure of any one (or two) still leaves the aircraft controllable', 'because each engine needs its own', 'to use three different fluids'], a: 1,
      why: 'Each primary control surface has actuators on two or three systems, with no fluid shared, so single and even double failures leave control.' },
    { q: 'What does a power transfer unit do?', choices: ['moves fluid from a full reservoir to an empty one', 'lets one system drive a pump on another without the fluids mixing', 'converts hydraulic power into electricity', 'transfers pressure to the brakes'], a: 1,
      why: 'It is a hydraulic motor on one system coupled to a pump on the other: power crosses, fluid does not.' },
    { q: 'Express 5000 psi in bar.', answer: 344.7, unit: 'bar', tol: 0.01,
      why: '1 psi = 6894.76 Pa, so 5000 psi = 3.447×10⁷ Pa = 344.7 bar.' },
    { q: 'A phosphate-ester system may be topped up with mineral hydraulic oil if nothing else is available.', a: false,
      why: 'The fluids and their seals are incompatible; contamination means draining, flushing and resealing the system.' },
    { q: 'When does the ram-air turbine deploy?', choices: ['on every landing', 'when engine or electrical power is lost', 'during take-off', 'when the brakes overheat'], a: 1,
      why: 'It is the last-resort power source: driven by the airstream, it keeps essential hydraulic and electrical services alive.' }
  ],
  problems: [
    { q: 'An actuator acts on a 0.15 m horn to give a 12 kN·m hinge moment at 3000 psi. What piston area does it need?', answer: 38.7, unit: 'cm²', tol: 0.02,
      steps: ['Force: $12\\,000/0.15 = 80$ kN.', '$A = 8\\times10^4/2.068\\times10^7 = 3.87\\times10^{-3}$ m² = 38.7 cm².'] }
  ],
  applications: [
    'Flight-control actuators, landing gear, brakes, steering and thrust reversers of transport aircraft.',
    'Helicopter main and tail rotor controls, with dual hydraulic boosters.',
    'Military aircraft and spacecraft launch systems (thrust-vector control).'
  ],
  history: 'Hydraulic boosters appeared in the 1930s–40s as aircraft outgrew the pilot\'s muscles; the Boeing B-52 and the first jet transports made fully powered, irreversible flight controls normal in the 1950s. Phosphate-ester fluids followed a series of fires fed by mineral hydraulic oil. The Airbus A320 (1988) moved the pilot\'s commands to wires and computers, but the power at the surfaces stayed hydraulic.'
},

{
  id: 'vehicle-brakes', parent: 'applications', title: 'Hydraulic brakes and power steering', level: 2,
  short: 'A car\'s brakes chain a pedal lever, a booster and a master cylinder to caliper pistons that clamp the discs with tonnes of force, in two independent circuits; ABS modulates the pressure to keep the wheels turning. Brake fluid types, and hydraulic power steering.',
  keywords: ['hydraulic brakes', 'master cylinder', 'tandem master cylinder', 'brake booster', 'vacuum servo', 'pedal ratio', 'caliper', 'brake fluid', 'DOT 3', 'DOT 4', 'DOT 5.1', 'ABS', 'anti-lock', 'EBD', 'dual circuit', 'power steering', 'vapour lock'],
  prereq: ['force-multiplication', 'pascals-law', 'physics:friction'],
  related: ['fluid-power', 'hydraulic-press', 'vapour-pressure', 'bulk-modulus', 'accumulators', 'lifts-cranes', 'physics:torque', 'physics:kinetic-energy'],
  body: `
Press a car's brake pedal with the weight of a bag of shopping and four discs are clamped with tonnes of force. The hydraulics in between is simple, sealed and — because lives depend on it — built in duplicate.

### From foot to tyre
1. **Pedal**: a lever, ratio about 3–5.
2. **Booster**: a vacuum (or electric) servo adds 3–7 times the driver's push up to its limit, the **run-out point**; beyond it only the driver's extra effort counts.
3. **Tandem master cylinder**: two pistons in one bore of 19–26 mm, each feeding its own circuit, with a reservoir above.
4. **Lines**: steel tubes along the body, flexible hoses to the wheels.
5. **Calipers**: pistons of 38–60 mm, one to six per caliper, press pads against the disc from both sides.
6. **Friction**: pads with $\\mu \\approx 0.35$–0.45 at an effective radius of 0.1–0.15 m make a torque; divided by the tyre radius it is the braking force on the road.

$$p = \\frac{4F_p\\,i\\,k}{\\pi d_{mc}^2}, \\qquad F_b = 2\\mu\\,F_c\\,\\frac{r}{R}$$

A firm 150 N push, a pedal ratio of 3.5 and a booster of 5 put 2.6 kN on a 23.8 mm master cylinder: 59 bar. On a 57 mm caliper piston that is 15 kN of clamp; with $\\mu = 0.4$, a 0.11 m effective radius and a 0.31 m tyre, 4.3 kN of braking force at each front wheel. Emergency stops reach 80–150 bar. The master cylinder moves only a few cubic centimetres: the pads rest almost against the disc and the fluid hardly compresses, so a larger master cylinder gives a firmer, shorter pedal but less pressure for the same push ([[force-multiplication]]).

### Two circuits and brake balance
Two independent circuits are required (for cars in Europe by UN Regulation 13-H), split front/rear or diagonally, so a burst hose leaves roughly half the braking. Braking moves weight forward, so the front brakes do 60–75 % of the work, and the rear wheels must never lock first or the car spins. Pressure-limiting valves once reduced the rear pressure; today **electronic brake-force distribution** does it through the ABS valves.

### ABS in words
Sensors watch each wheel's speed. When a wheel slows much faster than the car — a skid starting — the ABS unit **closes an inlet valve** to hold that wheel's pressure, **opens an outlet valve** to let fluid escape to a small accumulator, and a pump returns it before the pressure is **reapplied**. The cycle repeats several times a second, keeping the tyre near the slip of about 10–20 % where it grips best and, above all, keeping it turning so that the **car can still be steered**. Stability control uses the same valves to brake single wheels by itself.

### Brake fluid
Brake fluid is not oil. The usual grades are **glycol-ether** based and **hygroscopic**: they absorb water, which lowers the boiling point. Fluid boiling in a hot caliper makes vapour that compresses, and the pedal sinks (vapour lock, [[vapour-pressure]]). US standard FMVSS 116 sets minimum boiling points:

| Grade | Base | Dry | Wet (about 3.7 % water) |
|---|---|---|---|
| DOT 3 | glycol ether | 205 °C | 140 °C |
| DOT 4 | glycol ether, borate esters | 230 °C | 155 °C |
| DOT 5.1 | glycol ether, borate esters | 260 °C | 180 °C |
| DOT 5 | silicone (not hygroscopic, not mixable) | 260 °C | 180 °C |

Hence the usual advice to renew it about every two years. Mineral oil must never enter a car's brakes: it swells the seals designed for glycol fluid.

### Power steering
**Hydraulic power steering** uses an engine-driven vane pump (80–120 bar) and a rotary valve on the steering shaft: a torsion bar twists slightly under the driver's effort and opens metering edges that send oil to one side of a cylinder in the steering rack. Most cars now steer electrically, saving the pump's constant losses; trucks keep hydraulic assistance, and tractors and loaders use fully hydrostatic steering ([[mobile-hydraulics]]).

> [!warn] Brakes are safety-critical: work on them follows the vehicle maker's procedures. Never work under a car held only by a jack — use axle stands on firm ground. Brake fluid is toxic and strips paint; keep it off skin and out of eyes.
`,
  ideas: [
    'Pedal ratio × booster × area ratio multiply a light push into tonnes of clamp force at the discs.',
    'Line pressure p = 4F_p i k/(π d²); a normal stop needs tens of bar, an emergency stop 80–150 bar.',
    'Two independent circuits keep half the braking if one fails; the rear wheels must never lock first.',
    'ABS holds, releases and reapplies each wheel\'s pressure several times a second, so the car stays steerable.',
    'Glycol brake fluids absorb water, which lowers their boiling point: they are renewed every couple of years.'
  ],
  pitfalls: [
    'A bigger master cylinder gives more braking — For the same pedal force it gives less pressure; it only shortens the pedal travel. Clamp force comes from pressure times caliper area.',
    'ABS makes the car stop shorter on every surface — Its main purpose is to keep the wheels turning so the car can be steered; on gravel or fresh snow a locked wheel can stop shorter.',
    'Any hydraulic oil can top up the brake reservoir — Car brakes use glycol fluids; mineral oil destroys their seals, and silicone DOT 5 must not be mixed with the others.'
  ],
  formulas: [
    {
      name: 'Brake line pressure',
      expr: 'p = 4*Fp*i*k/(pi*dmc^2)', tex: 'p = \\dfrac{4F_p\\,i\\,k}{\\pi d_{mc}^2}',
      vars: {
        p: { name: 'line pressure (gauge)', q: 'pressure', unit: 'bar' },
        Fp: { name: 'pedal force', q: 'force', unit: 'N', value: 150, tex: 'F_p' },
        i: { name: 'pedal ratio', value: 3.5 },
        k: { name: 'booster ratio (1 without booster)', value: 5 },
        dmc: { name: 'master-cylinder bore', q: 'length', unit: 'mm', value: 23.81, tex: 'd_{mc}' }
      },
      note: 'Below the booster\'s run-out point; return-spring forces and seal friction take a little off.',
      practice: { unknowns: ['p', 'Fp', 'dmc'] },
      stories: {
        p: 'A driver presses the pedal with {Fp}; the pedal ratio is {i}, the booster multiplies by {k}, and the master cylinder has a {dmc} bore. What is the line pressure?',
        Fp: 'A car has a pedal ratio of {i}, a booster ratio of {k} and a {dmc} master cylinder. What pedal force gives {p}?'
      }
    },
    {
      name: 'Caliper clamp force',
      expr: 'Fc = p*pi*Dc^2/4', tex: 'F_c = p\\,\\dfrac{\\pi D_c^2}{4}',
      vars: {
        Fc: { name: 'clamp force on each pad', q: 'force', unit: 'kN', tex: 'F_c' },
        p: { name: 'line pressure (gauge)', q: 'pressure', unit: 'bar', value: 59 },
        Dc: { name: 'caliper piston diameter (total area as one piston)', q: 'length', unit: 'mm', value: 57, tex: 'D_c' }
      },
      note: 'For a floating caliper the one piston pushes one pad and the reaction pulls the other; for opposed pistons use the area on one side.',
      stories: { Fc: 'A {Dc} caliper piston sees {p}. What clamp force does it give?' }
    },
    {
      name: 'Braking force at the tyre',
      expr: 'Fb = 2*mu*Fc*r/R', tex: 'F_b = 2\\mu\\,F_c\\,\\dfrac{r}{R}',
      vars: {
        Fb: { name: 'braking force at the road', q: 'force', unit: 'kN', tex: 'F_b' },
        mu: { name: 'pad friction coefficient', value: 0.4, tex: '\\mu' },
        Fc: { name: 'clamp force', q: 'force', unit: 'kN', value: 15, tex: 'F_c' },
        r: { name: 'effective radius of the pads', q: 'length', unit: 'm', value: 0.11 },
        R: { name: 'rolling radius of the tyre', q: 'length', unit: 'm', value: 0.31 }
      },
      note: 'Two friction faces per disc. The tyre can only pass on what the road allows: at most about μ_road × the wheel\'s load.',
      stories: { Fb: 'Pads with a friction coefficient of {mu} clamp a disc with {Fc} at an effective radius of {r}; the tyre radius is {R}. What braking force reaches the road?' }
    }
  ],
  examples: [
    {
      title: 'Pedal to deceleration',
      q: 'With the numbers above (150 N, pedal 3.5, booster 5, 23.8 mm master cylinder, 57 mm front calipers), each rear brake gives 1.7 kN. What deceleration does a 1500 kg car reach, if the tyres can grip?',
      steps: [
        'Line pressure $p = 4 \\times 150 \\times 3.5 \\times 5/(\\pi \\times 0.02381^2) = 5.9\\times10^6$ Pa = 59 bar.',
        'Front clamp $F_c = 5.9\\times10^6 \\times \\pi \\times 0.057^2/4 = 15.0$ kN; braking force $2 \\times 0.4 \\times 15.0 \\times 0.11/0.31 = 4.27$ kN per front wheel.',
        'Total: $2 \\times 4.27 + 2 \\times 1.7 = 11.9$ kN.',
        'Deceleration: $a = F/m = 11\\,900/1500 = 7.96$ m/s² — about 0.8 g, a firm stop.'
      ],
      a: 'About 8 m/s² (0.8 g).'
    }
  ],
  quiz: [
    { q: 'Why do cars have two independent brake circuits?', choices: ['to double the braking force', 'so a leak in one still leaves about half the braking', 'one for ABS and one for the handbrake', 'to cool the fluid'], a: 1,
      why: 'A tandem master cylinder feeds two separate circuits; a burst hose empties only one of them.' },
    { q: 'A driver pushes 200 N on a pedal with a ratio of 4 and no booster; the master cylinder is 22.2 mm. What is the line pressure?', answer: 20.7, unit: 'bar', tol: 0.02,
      why: '$A = \\pi \\times 0.0222^2/4 = 3.87\\times10^{-4}$ m²; $p = 800/3.87\\times10^{-4} = 2.07\\times10^6$ Pa = 20.7 bar.' },
    { q: 'A larger master-cylinder bore gives a higher line pressure for the same pedal force.', a: false,
      why: 'Pressure is force over area: a larger bore gives less pressure, though a shorter, firmer pedal.' },
    { q: 'What is the main benefit of ABS?', choices: ['shorter stops on every surface', 'the wheels keep turning, so the car can still be steered while braking hard', 'the brakes never overheat', 'the pedal is lighter'], a: 1,
      why: 'A locked front wheel cannot steer. ABS keeps each tyre near its peak grip and still rolling.' },
    { q: 'Why is glycol brake fluid renewed every couple of years?', choices: ['it evaporates', 'it absorbs water, which lowers its boiling point', 'it thickens with age', 'it loses its colour'], a: 1,
      why: 'Water lowers the boiling point from about 230 °C to 155 °C for DOT 4; boiling fluid in a hot caliper gives vapour lock.' }
  ],
  problems: [
    { q: 'What clamp force does a 60 mm caliper piston give at 80 bar?', answer: 22.6, unit: 'kN', tol: 0.02,
      steps: ['$A = \\pi \\times 0.06^2/4 = 2.827\\times10^{-3}$ m².', '$F = 8\\times10^6 \\times 2.827\\times10^{-3} = 22.6$ kN.'] }
  ],
  applications: [
    'Cars, motorcycles and bicycles with hydraulic disc brakes.',
    'Trucks and trailers, where air brakes often actuate hydraulic or mechanical brakes.',
    'Hydraulic power steering in trucks; hydrostatic steering in tractors and loaders.'
  ],
  history: 'Malcolm Loughead (later Lockheed) patented four-wheel hydraulic brakes in 1917; the Duesenberg Model A of 1921 was the first production car to have them, and they became universal by the 1930s–40s. Disc brakes came from aircraft and racing in the 1950s, and electronic anti-lock brakes reached production cars in 1978.',
  sim: 'fp-brakes'
},

{
  id: 'lifts-cranes', parent: 'applications', title: 'Lifts, jacks and cranes', level: 1,
  short: 'Jacks, vehicle lifts, hydraulic passenger lifts and cranes lift with cylinders — and must never drop what they lift: check, counterbalance, rupture and hose-burst valves hold the load, and nobody works under a load held only by oil.',
  keywords: ['hydraulic jack', 'bottle jack', 'trolley jack', 'vehicle lift', 'hydraulic elevator', 'hydraulic lift', 'roped 2:1', 'rupture valve', 'crane', 'luffing cylinder', 'loader crane', 'outrigger', 'counterbalance valve', 'load moment limiter', 'rated capacity limiter', 'load holding'],
  prereq: ['force-multiplication', 'hydraulic-cylinder', 'physics:torque'],
  related: ['counterbalance-valve', 'pilot-check', 'load-holding', 'hydraulic-press', 'mobile-hydraulics', 'hydraulic-safety', 'physics:static-equilibrium', 'physics:gravitational-potential-energy'],
  body: `
Lifting shows hydraulics at its most useful and its most unforgiving: great forces from a small pump, and a load that falls if the oil escapes.

### Jacks
A **bottle jack** is a complete hydraulic system you can hold in one hand. A lever drives a small **plunger pump**; an **inlet check valve** lets oil in from the reservoir around the ram as the plunger rises, and an **outlet check valve** lets it out to the **ram** as the plunger falls. A **release valve**, a screw-down needle, lets the ram down by returning oil to the reservoir. With a 10:1 lever and a 12 mm plunger under a 40 mm ram, a 300 N push lifts about 3 tonnes, about 2 mm a stroke ([[force-multiplication]]). Trolley jacks put the same pump under a lifting linkage; air-hydraulic jacks replace the hand with a small air motor.

### Vehicle lifts and hydraulic elevators
Two-post workshop lifts raise a car on cylinders or screws; **mechanical latches** click into place every few centimetres, and the car is lowered onto them before anyone works beneath. **Hydraulic passenger lifts** raise the car on a ram — directly underneath, or **roped 2:1**, where a rope over a pulley on the ram top lifts the car twice as far and twice as fast as the ram. A pump of 10–30 kW works only on the way **up**; going down, gravity pushes the oil back through a control valve and the potential energy becomes heat in the oil. They suit low rises of up to about six floors, at 20–60 bar. A **rupture valve** at the cylinder shuts if the pipe bursts and the car begins to fall (EN 81-20:2014 and EN 81-50:2014 in Europe).

### Cranes
Mobile cranes, truck-mounted **loader cranes**, forestry cranes and aerial platforms use cylinders to **luff** (raise the boom), **telescope** and **fold**, a hydraulic motor on the winch, and **outrigger** cylinders to widen the base. The luffing cylinder carries enormous forces because it acts close to the pivot: a 2-tonne load 8 m out on a 3-tonne boom, with the cylinder 0.8 m from the pivot, puts 343 kN — 35 tonnes — into it ([[physics:static-equilibrium|moment balance]]).

### Holding the load
Holding is designed in, never left to a spool valve, which always leaks a little:
- **Counterbalance valves** screwed straight into the cylinder ports hold the load and lower it under control only when pilot pressure from the other line asks for it ([[counterbalance-valve]]).
- **Pilot-operated check valves** lock outriggers ([[pilot-check]]).
- **Hose-burst valves** close when the flow out of a cylinder exceeds a set rate.
- A **rated capacity limiter** reads the luffing-cylinder pressure with the boom's angle and length, computes the load moment and stops any motion that would exceed the load chart.

> [!warn] Never go under a load held only by hydraulics — a jack, a lift, a raised boom or a tipper body. Support it mechanically first with stands, props or the safety latches. Never adjust or bypass counterbalance, rupture or hose-burst valves: they are all that stands between a burst hose and a falling load.
`,
  ideas: [
    'A bottle jack is a lever, a plunger pump, two check valves, a ram and a release valve.',
    'Hydraulic lifts use power only going up; coming down, the load\'s potential energy becomes heat in the oil.',
    'Luffing cylinders act close to the pivot, so they carry many times the load: F = g(mR + m_b R_b)/r.',
    'Load holding relies on counterbalance, pilot-operated check, rupture and hose-burst valves mounted on the cylinder.',
    'Never work under a load held only by hydraulics: support it mechanically.'
  ],
  pitfalls: [
    'A jack is safe to work under once it is raised — Seals can leak and release valves can be knocked; a jack lifts, stands hold.',
    'The directional valve\'s blocked centre holds a crane boom — Spool valves leak; only poppet-type load-holding valves on the cylinder hold a load without creeping, and protect against a burst hose.',
    'A luffing cylinder carries about the weight of the load — It acts on a short lever arm near the pivot, so its force is the load moment divided by that arm: often ten times the load or more.'
  ],
  formulas: [
    {
      name: 'Pressure in a lift ram',
      expr: 'p = 4*m*g/(pi*D^2)', tex: 'p = \\dfrac{4\\,m\\,g}{\\pi D^2}',
      vars: {
        p: { name: 'ram pressure (gauge)', q: 'pressure', unit: 'bar' },
        m: { name: 'mass carried by the ram (car, load, ram)', q: 'mass', unit: 'kg', value: 2500 },
        g: { const: 'g' },
        D: { name: 'ram diameter', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A direct-acting ram, static; for a roped 2:1 lift the ram carries twice the car\'s weight (plus its own).',
      stories: { p: 'A direct-acting lift ram of {D} carries {m}. What pressure holds it up?', D: 'A lift ram must carry {m} at no more than {p}. What diameter does it need?' }
    },
    {
      name: 'Luffing-cylinder force',
      expr: 'F = g*(m*R + mb*Rb)/r', tex: 'F = \\dfrac{g\\,(m R + m_b R_b)}{r}',
      vars: {
        F: { name: 'luffing-cylinder force', q: 'force', unit: 'kN' },
        g: { const: 'g' },
        m: { name: 'load (with hook)', q: 'mass', unit: 'kg', value: 2000 },
        R: { name: 'load radius from the boom pivot', q: 'length', unit: 'm', value: 8 },
        mb: { name: 'boom mass', q: 'mass', unit: 'kg', value: 3000, tex: 'm_b' },
        Rb: { name: 'horizontal distance to the boom\'s centre of mass', q: 'length', unit: 'm', value: 4, tex: 'R_b' },
        r: { name: 'lever arm of the cylinder about the pivot', q: 'length', unit: 'm', value: 0.8 }
      },
      note: 'Moment balance about the boom pivot, static, the lever arm measured perpendicular to the cylinder\'s line. Dynamic loads (starting, stopping, wind) add to it.',
      practice: { unknowns: ['F', 'm'] },
      stories: {
        F: 'A crane boom of {mb} (centre of mass {Rb} out) holds {m} at a radius of {R}; the luffing cylinder acts {r} from the pivot. What force does the cylinder carry?',
        m: 'A luffing cylinder acting {r} from the pivot can carry {F}. The boom weighs {mb} with its centre of mass {Rb} out. What load can hang at {R}?'
      }
    },
    {
      name: 'Pump strokes to raise a jack',
      expr: 'N = h*(D/d)^2/s', tex: 'N = \\dfrac{h}{s}\\left(\\dfrac{D}{d}\\right)^2',
      vars: {
        N: { name: 'number of pump strokes' },
        h: { name: 'height to lift', q: 'length', unit: 'mm', value: 100 },
        D: { name: 'ram diameter', q: 'length', unit: 'mm', value: 40 },
        d: { name: 'plunger diameter', q: 'length', unit: 'mm', value: 12 },
        s: { name: 'plunger stroke', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'Ideal: every stroke\'s oil reaches the ram (check valves seal, no leakage).',
      stories: { N: 'A jack\'s {d} plunger has a {s} stroke and feeds a {D} ram. How many strokes lift the load {h}?' }
    }
  ],
  examples: [
    {
      title: 'A 2-tonne bottle jack',
      q: 'A jack has a 32 mm ram, a 12 mm plunger with a 20 mm stroke and a 10:1 lever. It lifts 2 tonnes. Find the pressure, the hand force (ignoring friction) and the strokes for 100 mm.',
      steps: [
        'Ram area: $\\pi \\times 0.032^2/4 = 8.04\\times10^{-4}$ m²; pressure $p = 2000 \\times 9.81/8.04\\times10^{-4} = 2.44\\times10^7$ Pa = 244 bar.',
        'Plunger force: $2.44\\times10^7 \\times \\pi \\times 0.012^2/4 = 2.76$ kN; hand force $2.76/10 = 276$ N.',
        'Rise per stroke: $20 \\times (12/32)^2 = 2.81$ mm, so $100/2.81 = 36$ strokes.'
      ],
      a: '244 bar, about 276 N at the handle, 36 strokes for 100 mm.'
    },
    {
      title: 'Sizing a luffing cylinder',
      q: 'The crane above (2 t at 8 m, 3 t boom at 4 m, cylinder lever arm 0.8 m) works at 250 bar. What bore does the luffing cylinder need?',
      steps: [
        'Force: $F = 9.81 \\times (2000 \\times 8 + 3000 \\times 4)/0.8 = 343$ kN.',
        'Area: $A = 3.43\\times10^5/2.5\\times10^7 = 137$ cm².',
        'Bore: $D = \\sqrt{4A/\\pi} = 132$ mm, so a 140 mm cylinder — before allowing for dynamic loads, which the design standards add.'
      ],
      a: 'At least 132 mm; a 140 mm cylinder.'
    }
  ],
  quiz: [
    { q: 'In a bottle jack, what lowers the ram?', choices: ['pumping the handle backwards', 'opening the release valve so oil returns to the reservoir', 'the inlet check valve', 'removing the load'], a: 1,
      why: 'The two check valves only let oil go one way, into the ram. The screw-down release valve opens a path back to the reservoir.' },
    { q: 'A hydraulic passenger lift uses its pump to drive the car down as well as up.', a: false,
      why: 'Going down, gravity pushes the oil out through a control valve; the pump runs only for the up travel, and the descent\'s energy becomes heat.' },
    { q: 'What pressure holds 3000 kg on a 120 mm direct-acting lift ram?', answer: 26.0, unit: 'bar', tol: 0.02,
      why: '$A = \\pi \\times 0.12^2/4 = 0.01131$ m²; $p = 3000 \\times 9.81/0.01131 = 2.60\\times10^6$ Pa = 26 bar.' },
    { q: 'Why are counterbalance and hose-burst valves mounted directly on the cylinder?', choices: ['to save hose length', 'so that a burst hose between valve and cylinder cannot let the load fall', 'to cool them', 'so they are easy to adjust'], a: 1,
      why: 'Any hose between the load-holding valve and the cylinder would be a weak point; mounted on the port, the valve protects against every hose.' }
  ],
  problems: [
    { q: 'A luffing cylinder acts 0.6 m from the pivot. It must hold a 1.5 t load at 6 m on a 1.2 t boom whose centre of mass is 3 m out. What force does it carry?', answer: 205.9, unit: 'kN', tol: 0.02,
      steps: ['Moment: $9.81 \\times (1500 \\times 6 + 1200 \\times 3) = 9.81 \\times 12\\,600 = 123.6$ kN·m.', '$F = 123.6/0.6 = 206$ kN.'] }
  ],
  applications: [
    'Bottle, trolley and air-hydraulic jacks; workshop and tyre-shop lifts.',
    'Hydraulic passenger and goods lifts in low-rise buildings; stage and orchestra-pit lifts.',
    'Mobile, loader, forestry and marine cranes; scissor lifts and aerial work platforms; tipper bodies.'
  ],
  history: 'William Armstrong\'s water-hydraulic cranes on the Newcastle quayside (1846) began the hydraulic lifting industry; hydraulic passenger lifts ran on city water mains in the late nineteenth century, until electric traction lifts took over tall buildings. Oil-hydraulic lifts returned for low buildings in the twentieth century, and the loader crane on a lorry became a universal tool from the 1950s.',
  sim: ['fp-jack', 'fp-excavator']
}

);
