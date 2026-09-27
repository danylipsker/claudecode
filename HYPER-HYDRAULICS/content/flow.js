/* HYPER-HYDRAULICS · content/flow.js — Liquids in Motion
 *   flow-basics:       flow-rate, continuity-equation, laminar-turbulent, reynolds-number-pipes, energy-equation, hgl-egl
 *   momentum-forces:   momentum-principle, jet-forces, pipe-bend-forces, torricelli
 *   flow-measurement:  venturi-meter, orifice-plate, pitot-static-water, flowmeters
 * Simulations in sims/flow.js (ids flow-…). */
Hyper.add(

/* ================================================================ DESCRIBING FLOW */
{
  id: 'flow-rate', parent: 'flow-basics', title: 'Flow rate and velocity', level: 1,
  short: 'How much liquid passes a section each second — the volume flow rate Q — and how fast it moves on average: Q = A·V. Mass flow is ρQ. The same flow runs slowly in a big pipe and fast in a small one.',
  keywords: ['flow rate', 'discharge', 'volume flow', 'mass flow', 'mean velocity', 'Q = AV', 'L/min', 'm³/h', 'litres per second', 'pipe velocity', 'design velocity', 'units of flow'],
  prereq: ['density-specific-weight', 'physics:speed-velocity', 'math:area'],
  related: ['continuity-equation', 'laminar-turbulent', 'pipe-sizing', 'line-sizing', 'flowmeters', 'hydraulic-cylinder', 'cylinder-speed'],
  body: `
Stand beside a river, or under a tap, and ask two questions: how much water goes past, and how fast is it moving? The first is the **flow rate**, also called the **discharge**: the volume crossing a section per unit of time, written $Q$. The second is the **velocity**. The size of the opening ties them together:

$$Q = A\\,V$$

where $A$ is the cross-section area and $V$ the **mean velocity** across it. For a round pipe running full, $A = \\pi D^2/4$.

### The mean velocity is an average
Liquid does not move at one speed across a pipe. It sticks to the wall — the velocity there is zero, the *no-slip* condition — and runs fastest on the centreline. $V = Q/A$ is the uniform speed that would carry the same flow. In laminar flow the centreline runs at twice the mean; in turbulent flow the profile is much flatter and the centre runs only about 20 % faster (see [[laminar-turbulent]]). "The velocity in the pipe", in any design calculation, means $V$.

### Units in use
SI says m³/s, but practice uses whatever suits the size of the job:

| Unit | In m³/s | Where it is used |
|---|---|---|
| m³/s | 1 | rivers, dams, turbines |
| m³/h | $2.78\\times10^{-4}$ | pumps, water supply, process plant |
| L/s | $10^{-3}$ | water mains, drainage, fire fighting |
| L/min | $1.67\\times10^{-5}$ | taps, oil hydraulics, fuel |
| US gal/min | $6.31\\times10^{-5}$ | American pump data |

Handy pairs: 1 m³/h = 16.7 L/min = 0.278 L/s, and 1 L/s = 60 L/min = 3.6 m³/h.

The **mass flow** $\\dot m = \\rho Q$ counts kilograms instead of cubic metres; for water 1 L/s is almost exactly 1 kg/s. It matters when the density changes — hot and cold water, fuels bought by mass — and it is what a [[flowmeters|Coriolis meter]] measures directly.

### Typical flows and velocities
| Situation | Flow | Mean velocity |
|---|---|---|
| Kitchen tap | 6–12 L/min | about 1 m/s in a 15 mm pipe |
| Garden hose, 16 mm bore | 15–25 L/min | 1.2–2 m/s |
| DN300 water main | 70–100 L/s | 1–1.5 m/s |
| Excavator main pump | 200–300 L/min | 3–6 m/s in the pressure hoses |
| Large hydro turbine | 100–1000 m³/s | 3–7 m/s in the penstock |

Design velocities are a compromise. Too slow, and the pipe is bigger and dearer than it needs to be and sediment settles in it. Too fast, and friction losses (which grow roughly as $V^2$), noise, erosion and the surge when a valve shuts (see [[joukowsky-surge]]) all climb. Water mains are usually sized for 0.5–2 m/s and pump suction lines for about 1–1.5 m/s. Oil-hydraulic lines follow the same logic with their own numbers: about 0.6–1.2 m/s in suction lines, 2–4 m/s in return lines and 3–6 m/s in pressure lines (see [[line-sizing]]).

> [!key] At a fixed flow, $V \\propto 1/D^2$. Halving the bore quadruples the velocity — and multiplies the friction loss about thirty times, since the loss per metre grows as $V^2/D$.
`,
  ideas: [
    'Flow rate is volume per time: Q = A·V, with V the mean velocity over the section.',
    'The velocity varies across a pipe — zero at the wall, fastest on the centreline — and V is its average.',
    'At a fixed flow the velocity goes as 1/D²: small pipes mean fast flow and large losses.',
    'Mass flow ρQ is what is conserved; for water, 1 L/s is about 1 kg/s.',
    'Design velocities trade pipe cost against friction, noise, erosion and surge.'
  ],
  pitfalls: [
    'The velocity in a pipe is the speed on its centreline — The design velocity is the mean, Q/A. The centreline is faster: twice the mean in laminar flow, about 1.2 times in turbulent flow.',
    'Doubling the pipe size halves the velocity — At the same flow the velocity falls with the area, so doubling the bore cuts it to a quarter.',
    'L/min and m³/h are interchangeable at a glance — 1 m³/h is 16.7 L/min; mixing them up gives errors of more than an order of magnitude.'
  ],
  formulas: [
    {
      name: 'Flow in a full round pipe',
      expr: 'Q = V*pi*D^2/4', tex: 'Q = V\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        Q: { name: 'volume flow rate', q: 'flowrate', unit: 'L/s' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.27 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'V is the mean over the section (Q/A), not the centreline speed. For a pipe running part full or a channel, use the wetted area.',
      practice: { unknowns: ['Q', 'V', 'D'] },
      stories: {
        Q: 'Water moves at a mean velocity of {V} along a pipe of {D} bore. What is the flow?',
        V: 'A pipe of {D} bore carries {Q}. What is the mean velocity?',
        D: 'A line must carry {Q} at a mean velocity of no more than {V}. What bore does it need?'
      }
    },
    {
      name: 'Mass flow',
      expr: 'mdot = rho*Q', tex: '\\dot m = \\rho\\,Q',
      vars: {
        mdot: { name: 'mass flow rate', q: 'massflow', unit: 'kg/s', tex: '\\dot m' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        Q: { name: 'volume flow rate', q: 'flowrate', unit: 'L/s', value: 10 }
      },
      note: 'Water at 20 °C: 998 kg/m³; sea water about 1025 kg/m³; mineral hydraulic oil about 870 kg/m³.',
      stories: { mdot: 'A pipe carries {Q} of a liquid of density {rho}. What is the mass flow?', Q: 'A meter shows a mass flow of {mdot} of a liquid of density {rho}. What is the volume flow?' }
    },
    {
      name: 'Time to deliver a volume',
      expr: 't = Vt/Q', tex: 't = \\dfrac{V_t}{Q}',
      vars: {
        t: { name: 'time', q: 'time', unit: 'h' },
        Vt: { name: 'volume to deliver', q: 'volume', unit: 'm³', value: 375, tex: 'V_t' },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'L/min', value: 25 }
      },
      stories: { t: 'How long does a hose delivering {Q} take to fill a pool of {Vt}?', Q: 'A tank of {Vt} must be filled in {t}. What flow does that need?' }
    }
  ],
  examples: [
    {
      title: 'Velocity in a water main',
      q: 'A 100 mm bore main carries 10 L/s of water at 20 °C. What are the mean velocity, the flow in m³/h and the mass flow?',
      steps: [
        'Area: $A = \\pi \\times 0.1^2/4 = 7.854\\times10^{-3}$ m².',
        'Velocity: $V = Q/A = 0.010/7.854\\times10^{-3} = 1.27$ m/s — a normal figure for a distribution main.',
        'In m³/h: $0.010 \\times 3600 = 36$ m³/h.',
        'Mass flow: $\\dot m = 998 \\times 0.010 = 9.98$ kg/s.'
      ],
      a: '1.27 m/s, 36 m³/h and about 10 kg/s.'
    },
    {
      title: 'Sizing an oil line',
      q: 'A hydraulic pressure line must carry 60 L/min with a velocity of no more than 4.5 m/s. What bore is needed, and which of the tubes 20 × 2 (16 mm bore) and 22 × 2 (18 mm bore) will do?',
      steps: [
        '$Q = 60/60\\,000 = 1.0\\times10^{-3}$ m³/s.',
        'Smallest area: $A = Q/V = 10^{-3}/4.5 = 2.22\\times10^{-4}$ m², so $D = \\sqrt{4A/\\pi} = 16.8$ mm.',
        'The 16 mm bore gives $V = 10^{-3}/(\\pi \\times 0.016^2/4) = 4.97$ m/s — too fast.',
        'The 18 mm bore gives 3.93 m/s — acceptable.'
      ],
      a: 'At least 16.8 mm of bore: the 22 × 2 tube (18 mm, 3.9 m/s).'
    }
  ],
  quiz: [
    { q: 'A pipe is replaced by one of twice the bore, carrying the same flow. The mean velocity…', choices: ['doubles', 'halves', 'falls to a quarter', 'stays the same'], a: 2,
      why: 'V = Q/A and the area grows with the square of the diameter, so twice the bore means a quarter of the velocity.' },
    { q: 'How many litres per second is 36 m³/h?', answer: 10, unit: 'L/s', why: '36 m³/h = 36 000 L / 3600 s = 10 L/s.' },
    { q: 'On the centreline of a pipe the liquid moves at the mean velocity V.', a: false,
      why: 'The centreline is the fastest point: twice the mean in laminar flow and roughly 1.2 times it in turbulent flow. Near the wall the liquid is slower than the mean.' },
    { q: 'The flow through a pipe doubles. Roughly how does the friction loss change in turbulent flow?', choices: ['it doubles', 'it about quadruples', 'it rises eight times', 'it does not change'], a: 1,
      why: 'The velocity doubles, and the turbulent friction loss grows with about the square of the velocity (a little less in smooth pipes). See the Darcy–Weisbach equation.' },
    { q: 'Which flow is the largest?', choices: ['100 L/min', '5 m³/h', '1.5 L/s', '0.001 m³/s'], a: 0,
      why: 'Put them all in L/s: 100 L/min = 1.67 L/s; 5 m³/h = 1.39 L/s; 1.5 L/s; 0.001 m³/s = 1 L/s. The 100 L/min is the largest.' }
  ],
  problems: [
    { q: 'A shower draws 12 L/min through a pipe of 13 mm bore. What is the mean velocity in the pipe?', answer: 1.51, unit: 'm/s', tol: 0.02,
      steps: ['$Q = 12/60\\,000 = 2.0\\times10^{-4}$ m³/s; $A = \\pi \\times 0.013^2/4 = 1.327\\times10^{-4}$ m².', '$V = Q/A = 1.51$ m/s.'] },
    { q: 'How many hours does a hose delivering 25 L/min take to fill a 375 m³ swimming pool?', answer: 250, unit: 'h', tol: 0.02,
      steps: ['$375$ m³ $= 375\\,000$ L.', '$t = 375\\,000/25 = 15\\,000$ min $= 250$ h — more than ten days. A fire-brigade standpipe at 10 L/s would take about ten hours.'] }
  ],
  applications: ['Sizing water mains, hoses and hydraulic lines for sensible velocities.', 'Setting the speed of a hydraulic cylinder: its speed is the flow divided by the piston area.', 'Billing water and fuel, and dosing chemicals in water treatment.', 'Checking a pump against its duty point on a flow–head chart.'],
  sim: 'flow-continuity'
},

{
  id: 'continuity-equation', parent: 'flow-basics', title: 'Continuity', level: 1,
  short: 'What flows in must flow out. A liquid hardly compresses, so the flow rate is the same at every section of a pipe — A₁V₁ = A₂V₂ — and the liquid speeds up where the pipe narrows. At a junction the flows add; in a tank the difference fills or empties it.',
  keywords: ['continuity', 'conservation of mass', 'A1V1 = A2V2', 'incompressible', 'mass balance', 'junction', 'nozzle', 'contraction', 'tank level', 'rate of rise'],
  prereq: ['flow-rate', 'bulk-modulus', 'physics:continuity-equation'],
  related: ['energy-equation', 'venturi-meter', 'pipe-networks', 'torricelli', 'hydraulic-cylinder', 'area-ratio', 'aerodynamics:continuity'],
  body: `
### Mass cannot pile up
Between two sections of a pipe, mass is neither made nor destroyed. If the flow is steady, the mass that enters each second must leave each second:

$$\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2$$

Liquids barely compress — water shrinks by only about 0.05 % for every 10 bar (its bulk modulus is 2.2 GPa, see [[bulk-modulus]]) — so the densities cancel and the **volume** flow is the same at every section:

$$Q = A_1 V_1 = A_2 V_2 \\qquad\\Rightarrow\\qquad \\frac{V_2}{V_1} = \\frac{A_1}{A_2} = \\left(\\frac{D_1}{D_2}\\right)^2$$

Velocity goes as the inverse square of the diameter. Fit a 6 mm nozzle to a 16 mm hose and the water leaves $(16/6)^2 = 7.1$ times faster than it runs in the hose. The pressure pays for that speed, as the [[energy-equation]] shows: continuity says *how much* faster, energy says what it costs.

### Junctions, tanks and cylinders
Continuity is book-keeping, and it applies to any region you draw a boundary round:

- **A junction.** The flows in equal the flows out, $\\sum Q_\\text{in} = \\sum Q_\\text{out}$. This is the first of the two rules that solve every [[pipe-networks|pipe network]]; the second is that the head losses round any closed loop add up to zero.
- **A tank.** If more comes in than goes out, the level rises. For a tank of plan area $A_t$,
$$A_t\\,\\frac{dh}{dt} = Q_\\text{in} - Q_\\text{out}$$
A 3 m² tank filled at 20 m³/h and drained at 8 m³/h rises 4 m an hour. Draining through a hole, this becomes [[torricelli|Torricelli's]] equation.
- **A cylinder.** The oil entering the cap end must sweep the piston area, so the rod moves at $v = Q/A_1$ — and the oil leaving the rod end is $Q\\,A_2/A_1$, not $Q$ (see [[hydraulic-cylinder]]). The pump flow is not the return flow.

### When continuity needs care
- **Compression in a surge.** In a water-hammer wave the liquid *does* compress, just enough to store the arriving flow; that tiny density change is the whole story of [[water-hammer]].
- **Air and vapour.** Air pockets and cavitation bubbles occupy volume that is not liquid; a meter downstream of a cavitating valve can read wrongly.
- **Leakage.** In oil hydraulics some flow always escapes past seals and clearances. Continuity still holds; the leak is one more outflow.
- **Velocity profiles.** $V$ is the mean over the section; continuity says nothing about the shape of the profile.

> [!tip] Continuity is the cheapest equation in hydraulics and the one most often forgotten. Before trusting any network, circuit or tank calculation, check that the flows balance at every junction.

For a gas the density changes with pressure and temperature, so it is the *mass* flow $\\rho A V$ that stays constant along a duct, not the volume flow — the reason compressed-air flows are counted as free air (see [[aerodynamics:continuity]]).
`,
  ideas: [
    'Mass is conserved: in steady flow the mass flow ρAV is the same at every section.',
    'For a liquid the density hardly changes, so the volume flow Q = AV is the same everywhere.',
    'Velocity scales with 1/A: a nozzle of a third of the diameter makes the liquid nine times faster.',
    'At a junction the flows add up; in a tank the difference between inflow and outflow moves the level.',
    'Continuity says how fast; the energy equation says what the speed costs in pressure.'
  ],
  pitfalls: [
    'More water flows through the narrow part because it moves faster — The flow rate is the same everywhere in a pipe; the narrow part carries it at a higher speed, not in larger amount.',
    'A cylinder returns the same flow to the tank as the pump delivers — The two chambers have different areas, so the returning flow is the pump flow times the area ratio.',
    'Velocity scales with the diameter ratio — It scales with the area ratio, the square of the diameter ratio.'
  ],
  formulas: [
    {
      name: 'Continuity between two sections',
      expr: 'V1*D1^2 = V2*D2^2', tex: 'V_1 D_1^2 = V_2 D_2^2',
      vars: {
        V1: { name: 'velocity at section 1', q: 'speed', unit: 'm/s', value: 1.5 },
        D1: { name: 'bore at section 1', q: 'length', unit: 'mm', value: 100 },
        V2: { name: 'velocity at section 2', q: 'speed', unit: 'm/s' },
        D2: { name: 'bore at section 2', q: 'length', unit: 'mm', value: 60 }
      },
      solveFor: 'V2',
      note: 'Round pipes running full, with an incompressible liquid. For other shapes use the areas: A₁V₁ = A₂V₂.',
      practice: { unknowns: ['V2', 'D2', 'V1'] },
      stories: {
        V2: 'Water at {V1} in a pipe of {D1} bore passes into a section of {D2}. How fast does it move there?',
        D2: 'Water at {V1} in a {D1} pipe must be speeded up to {V2}. What bore does the narrow section need?'
      }
    },
    {
      name: 'Rate of change of a tank level',
      expr: 'hdot = (Qin - Qout)/At', tex: '\\dot h = \\dfrac{Q_\\text{in} - Q_\\text{out}}{A_t}',
      vars: {
        hdot: { name: 'rate of rise of the level', q: 'speed', unit: 'mm/s', signed: true, tex: '\\dot h' },
        Qin: { name: 'inflow', q: 'flowrate', unit: 'm³/h', value: 20, tex: 'Q_\\text{in}' },
        Qout: { name: 'outflow', q: 'flowrate', unit: 'm³/h', value: 8, tex: 'Q_\\text{out}' },
        At: { name: 'plan area of the tank', q: 'area', unit: 'm²', value: 3, tex: 'A_t' }
      },
      note: 'For a tank with vertical walls. A negative rate means the level is falling.',
      stories: {
        hdot: 'A tank of plan area {At} receives {Qin} and delivers {Qout}. How fast does its level change?',
        Qout: 'A tank of {At} is filled at {Qin} and its level rises at {hdot}. What is being drawn off?'
      }
    }
  ],
  examples: [
    {
      title: 'A nozzle on a hose',
      q: 'A garden hose of 16 mm bore carries 18 L/min and ends in a 6 mm nozzle. What are the velocities in the hose and in the jet, and how high could the jet rise if pointed straight up (ignoring air resistance)?',
      steps: [
        '$Q = 18/60\\,000 = 3.0\\times10^{-4}$ m³/s; hose area $2.01\\times10^{-4}$ m², so $V_1 = 1.49$ m/s.',
        'Continuity: $V_2 = V_1 (16/6)^2 = 1.49 \\times 7.11 = 10.6$ m/s.',
        'A jet at 10.6 m/s rises $V^2/2g = 10.6^2/19.62 = 5.7$ m.'
      ],
      a: '1.5 m/s in the hose, 10.6 m/s at the nozzle, a jet about 5.7 m high.'
    },
    {
      title: 'A junction',
      q: 'A 150 mm main at 1.2 m/s splits into a 100 mm branch running at 1.5 m/s and an 80 mm branch. What flows and velocity does the 80 mm branch carry?',
      steps: [
        'Main: $Q_1 = 1.2 \\times \\pi \\times 0.15^2/4 = 21.2$ L/s.',
        'First branch: $Q_2 = 1.5 \\times \\pi \\times 0.1^2/4 = 11.8$ L/s.',
        'Continuity at the junction: $Q_3 = 21.2 - 11.8 = 9.4$ L/s.',
        'Velocity: $V_3 = 9.42\\times10^{-3}/(\\pi \\times 0.08^2/4) = 1.88$ m/s.'
      ],
      a: '9.4 L/s at 1.88 m/s.'
    }
  ],
  quiz: [
    { q: 'A pipe narrows from 150 mm to 50 mm. The velocity in the narrow part is…', choices: ['3 times higher', '9 times higher', 'a ninth as high', 'the same'], a: 1,
      why: 'Velocity goes inversely with the area, and the area goes with the diameter squared: (150/50)² = 9.' },
    { q: 'Because water speeds up in a contraction, more litres per second pass through the narrow part.', a: false,
      why: 'The flow rate is the same at every section of a pipe; the narrow part carries it faster, through a smaller area.' },
    { q: 'A cylinder with a 50 cm² piston and a 25 cm² annulus extends with 30 L/min entering the cap end. What flow leaves the rod end?', answer: 15, unit: 'L/min',
      why: 'The piston moves at Q/A₁; the rod end sweeps A₂ at that speed, so it returns Q·A₂/A₁ = 30 × 25/50 = 15 L/min.' },
    { q: 'A tank of 2 m² plan area receives 30 L/min and loses 45 L/min. Its level…', choices: ['rises 7.5 mm/min', 'falls 7.5 mm/min', 'falls 22.5 mm/min', 'falls 0.125 mm/min'], a: 1,
      why: 'Net outflow 15 L/min = 0.015 m³/min; divided by 2 m² gives 7.5 mm/min, downwards.' },
    { q: 'Water flows at 1 m/s in a 200 mm pipe that reduces to 100 mm. What is the velocity in the 100 mm pipe?', answer: 4, unit: 'm/s',
      why: 'V₂ = V₁ (D₁/D₂)² = 1 × 2² = 4 m/s.' }
  ],
  problems: [
    { q: 'Water flows at 2 m/s in a 50 mm pipe and leaves through a 20 mm nozzle. What is the velocity of the jet?', answer: 12.5, unit: 'm/s', tol: 0.02,
      steps: ['$V_2 = V_1 (D_1/D_2)^2 = 2 \\times (50/20)^2 = 12.5$ m/s.'] },
    { q: 'A reservoir with a surface of 5000 m² receives 1.2 m³/s and releases 0.8 m³/s. By how many millimetres does its level rise in one hour?', answer: 288, unit: 'mm', tol: 0.02,
      steps: ['Net inflow: 0.4 m³/s, or 1440 m³ in an hour.', 'Rise: $1440/5000 = 0.288$ m $= 288$ mm.'] }
  ],
  applications: ['Nozzles, jets and fire-hose tips that trade area for speed.', 'Balancing flows at every junction of a water-supply network.', 'Tank and reservoir level control: inflow minus outflow sets the rate of rise.', 'Cylinder circuits, where return flows differ from pump flow by the area ratio.'],
  sim: 'flow-continuity'
},

{
  id: 'laminar-turbulent', parent: 'flow-basics', title: 'Laminar and turbulent flow', level: 1,
  short: 'Slow, viscous flow slides in smooth layers (laminar); faster flow breaks into eddies that stir it across the pipe (turbulent). The two regimes have different velocity profiles, different friction laws and different uses.',
  keywords: ['laminar', 'turbulent', 'transition', 'eddies', 'Reynolds experiment', 'dye streak', 'velocity profile', 'parabolic profile', 'power-law profile', 'viscous sublayer', 'mixing', 'kinetic-energy correction', 'puffs'],
  prereq: ['viscosity', 'flow-rate', 'physics:viscosity'],
  related: ['reynolds-number-pipes', 'laminar-pipe-flow', 'friction-factor', 'darcy-weisbach', 'energy-equation', 'aerodynamics:turbulence', 'aerodynamics:transition', 'aerodynamics:boundary-layer'],
  body: `
Open a tap a little and a clear, glassy rope of water falls from it; open it wide and the stream turns rough and cloudy. In a pipe the same change happens out of sight, and it changes almost everything about how the pipe behaves.

### Two ways to flow
In **laminar** flow the liquid moves in smooth layers (laminae) that slide over one another. A thread of dye injected on the centreline stays a thin, straight line all the way down the pipe; the only mixing between layers is molecular diffusion, which is very slow. Viscosity is in charge: each layer drags on its neighbours, and the velocity profile across a round pipe is a **parabola**, zero at the wall and twice the mean velocity on the centreline.

In **turbulent** flow the layers break up into eddies of every size, from the pipe diameter down to fractions of a millimetre. The dye thread is shredded within a few diameters and the whole section turns evenly coloured. The eddies carry fast liquid towards the wall and slow liquid towards the centre, so the time-averaged profile is much **flatter** — the centre runs only 15–25 % faster than the mean — with a steep drop close to the wall. Right against the wall a very thin **viscous sublayer** stays nearly laminar; whether the wall's roughness pokes through it decides whether the pipe behaves as smooth or rough (see [[friction-factor]]).

| | Laminar | Turbulent |
|---|---|---|
| Dye streak | stays a thin line | breaks up and fills the pipe |
| Profile | parabola, $u_\\max = 2V$ | flat, $u_\\max \\approx 1.2V$ |
| Friction loss grows as | $V$ | $V^{1.75}$ to $V^2$ |
| Depends on wall roughness | no | yes, at high Re |
| Mixing and heat transfer | slow | fast |
| Kinetic-energy factor α | 2 | 1.03–1.10 |
| Examples | oil in small cold lines, blood in capillaries, groundwater, honey | water mains, rivers, a garden hose |

### What decides it
Osborne Reynolds showed in 1883 that a single dimensionless number predicts the regime: $Re = VD/\\nu$, the ratio of inertia to viscous forces (see [[reynolds-number-pipes]]). In a round pipe the flow is laminar below about 2300 and turbulent above about 4000; in between it is **transitional**, switching on and off in turbulent "puffs" that travel down an otherwise laminar pipe. Water, with a kinematic viscosity of 1 mm²/s, is laminar in a 100 mm pipe only below about 2 cm/s — water mains are always turbulent. Hydraulic oil, 20–50 times more viscous at working temperature and hundreds of times when cold, is often laminar in small lines.

### Profiles in numbers
Laminar (Hagen–Poiseuille, see [[laminar-pipe-flow]]):
$$u(r) = u_\\max\\left(1 - \\frac{r^2}{R^2}\\right), \\qquad u_\\max = 2V$$

Turbulent (the empirical power law): $u(r) = u_\\max (1 - r/R)^{1/n}$, with $n \\approx 6$ at Re = 4000, about 7 near $10^5$ and 9–10 above $10^6$. Its mean is $V = u_\\max\\,2n^2/\\big((n+1)(2n+1)\\big)$: 0.82 $u_\\max$ for $n = 7$.

The shape matters for the energy equation: the true flux of kinetic energy is $\\alpha\\,\\rho Q V^2/2$, with **α = 2** for the laminar parabola and 1.03–1.08 for turbulent profiles — the reason α appears in the [[energy-equation]].

> [!note] Turbulent does not mean "fast". Honey poured quickly is still laminar; the slow seep of groundwater through sand is laminar; the gentle flow in a garden hose, at a Reynolds number around 25 000, is turbulent. Speed, size and viscosity count only in the combination $VD/\\nu$.
`,
  ideas: [
    'Laminar flow moves in smooth layers with a parabolic profile; turbulent flow is full of eddies and has a flat profile.',
    'In a round pipe the flow is laminar below Re ≈ 2300 and turbulent above about 4000.',
    'Laminar friction grows in proportion to the velocity; turbulent friction nearly with its square, and depends on roughness.',
    'Turbulence mixes: dye, heat and momentum spread across the pipe within a few diameters.',
    'The profile shape sets the kinetic-energy factor α: 2 for laminar flow, about 1.05 for turbulent.'
  ],
  pitfalls: [
    'Turbulent simply means fast — The regime depends on V·D/ν. A thick oil can flow fast and stay laminar; water in a wide pipe is turbulent at a walking pace.',
    'Above Re = 2300 a pipe flow is always turbulent — 2300 is where disturbances stop dying out. Between 2300 and 4000 the flow is intermittent, and a very smooth, quiet inlet can keep it laminar far higher.',
    'Turbulent flow is chaos, so it cannot be calculated — Its details are random, but its averages — profile, friction factor, mixing rates — are reproducible and well correlated.'
  ],
  formulas: [
    {
      name: 'Laminar velocity profile',
      expr: 'u = umax*(1 - (r/R)^2)', tex: 'u = u_{\\max}\\left(1 - \\dfrac{r^2}{R^2}\\right)',
      vars: {
        u: { name: 'velocity at radius r', q: 'speed', unit: 'm/s' },
        umax: { name: 'centreline velocity (twice the mean)', q: 'speed', unit: 'm/s', value: 0.4, tex: 'u_{\\max}' },
        r: { name: 'distance from the centreline', q: 'length', unit: 'mm', value: 5, min: 0 },
        R: { name: 'pipe radius', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Fully developed laminar flow in a round pipe (Hagen–Poiseuille). The mean velocity is half the centreline velocity.',
      practice: { unknowns: ['u', 'r'] },
      stories: { u: 'In laminar flow the centreline velocity is {umax} in a pipe of radius {R}. How fast does the liquid move {r} from the centre?', r: 'Laminar flow in a pipe of radius {R} has a centreline velocity of {umax}. How far from the centre does the liquid move at {u}?' }
    },
    {
      name: 'Mean velocity of the turbulent power-law profile',
      expr: 'V = umax*2*n^2/((n + 1)*(2*n + 1))', tex: 'V = u_{\\max}\\,\\dfrac{2n^2}{(n+1)(2n+1)}',
      vars: {
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s' },
        umax: { name: 'centreline velocity', q: 'speed', unit: 'm/s', value: 2.0, tex: 'u_{\\max}' },
        n: { name: 'power-law exponent (about 7 at Re = 10⁵)', value: 7, min: 4, max: 12 }
      },
      note: 'For u = u_max (1 − r/R)^(1/n). n grows slowly with Re: about 6 at 4000, 7 near 10⁵, 9–10 above 10⁶.',
      stories: { V: 'A pitot tube reads {umax} on the centreline of a turbulent flow whose profile exponent is {n}. What is the mean velocity?', umax: 'Turbulent flow with a profile exponent of {n} has a mean velocity of {V}. What is the centreline velocity?' }
    },
    {
      name: 'Kinetic-energy correction factor of the power-law profile',
      expr: 'alpha = (n + 1)^3*(2*n + 1)^3/(4*n^4*(n + 3)*(2*n + 3))', tex: '\\alpha = \\dfrac{(n+1)^3(2n+1)^3}{4n^4(n+3)(2n+3)}',
      vars: {
        alpha: { name: 'kinetic-energy correction factor', tex: '\\alpha' },
        n: { name: 'power-law exponent', value: 7, min: 4, max: 12 }
      },
      note: 'The ratio of the true kinetic-energy flux to ρQV²/2. It is 2 for laminar flow; this formula gives 1.06 for n = 7.',
      practice: false
    }
  ],
  examples: [
    {
      title: 'Laminar or turbulent?',
      q: 'Which regime do these flows fall in: (a) 20 L/min of water at 20 °C in a 16 mm garden hose; (b) 30 L/min of ISO VG 46 hydraulic oil at 40 °C (46 mm²/s) in a 12 mm line?',
      steps: [
        '(a) $V = 3.33\\times10^{-4}/(\\pi \\times 0.016^2/4) = 1.66$ m/s; $Re = 1.66 \\times 0.016/1.0\\times10^{-6} = 26\\,500$ — turbulent.',
        '(b) $V = 5.0\\times10^{-4}/(\\pi \\times 0.012^2/4) = 4.42$ m/s; $Re = 4.42 \\times 0.012/46\\times10^{-6} = 1150$ — laminar, although the oil is moving almost three times faster.'
      ],
      a: 'The slow water is turbulent; the fast oil is laminar.'
    },
    {
      title: 'Centreline speeds',
      q: 'Using the flows of the last example, how fast does the liquid move on the centreline in each?',
      steps: [
        'Laminar oil: $u_\\max = 2V = 2 \\times 4.42 = 8.8$ m/s.',
        'Turbulent water with $n = 7$: $V/u_\\max = 2 \\times 49/(8 \\times 15) = 0.817$, so $u_\\max = 1.66/0.817 = 2.0$ m/s.'
      ],
      a: '8.8 m/s for the oil (twice its mean) and 2.0 m/s for the water (1.22 times its mean).'
    }
  ],
  quiz: [
    { q: 'A thin thread of dye injected on the centreline of a pipe stays a straight line for the whole length. The flow is…', choices: ['laminar', 'turbulent', 'transitional', 'impossible to tell'], a: 0,
      why: 'Only laminar flow keeps the layers apart; any turbulence tears the dye thread apart within a few diameters.' },
    { q: 'In laminar flow in a round pipe, the centreline velocity is how many times the mean?', choices: ['1.2', '1.5', '2', '4'], a: 2,
      why: 'The parabolic profile has its maximum at twice the mean. A turbulent profile is flatter, with a maximum about 1.2 times the mean.' },
    { q: 'A thick oil flowing fast through a hose must be turbulent.', a: false,
      why: 'The regime depends on VD/ν. With a high viscosity the Reynolds number can stay well below 2300 at high speed.' },
    { q: 'In laminar flow, doubling the velocity multiplies the friction loss by…', choices: ['2', '4', '√2', '8'], a: 0,
      why: 'In laminar flow the loss is proportional to the velocity (Hagen–Poiseuille). In turbulent flow it would be nearly 4.' },
    { q: 'Why is the turbulent velocity profile flatter than the laminar one?', choices: ['turbulence lowers the viscosity', 'eddies carry fast fluid outwards and slow fluid inwards, evening out the speeds', 'the wall is rougher in turbulent flow', 'turbulent flow has a higher mean velocity'], a: 1,
      why: 'Turbulent mixing transports momentum across the pipe far faster than viscosity can, so the core is nearly uniform and the change of speed is squeezed into a thin layer at the wall.' }
  ],
  applications: ['Hydraulic oil lines on cold starts, where laminar flow and high viscosity multiply the losses.', 'Heat exchangers, which are designed for turbulent flow because it transfers heat far better.', 'Mixing and dosing chemicals in water treatment, which relies on turbulence.', 'Microfluidic devices and blood capillaries, where flow is always laminar.'],
  history: 'Osborne Reynolds, at Owens College in Manchester, published his dye experiments in 1883: water drawn from a tank through a glass tube with a flared entrance, and a thread of dye that stayed straight until the flow reached a critical speed, then burst into eddies. With a very still tank he held laminar flow up to a Reynolds number of about 13 000. Hagen (1839) and Poiseuille (1840s) had already measured the laminar pressure-drop law.',
  sim: 'flow-laminar'
},

{
  id: 'reynolds-number-pipes', parent: 'flow-basics', title: 'The Reynolds number in pipes', level: 2,
  short: 'Re = VD/ν, the ratio of inertial to viscous effects in a pipe. Below about 2300 the flow is laminar, above about 4000 turbulent. It sets the friction factor and lets a model — or a different liquid — stand in for the real thing.',
  keywords: ['Reynolds number', 'Re', 'kinematic viscosity', 'dynamic viscosity', 'critical Reynolds number', '2300', '4000', 'transition', 'similarity', 'hydraulic diameter', 'viscosity of water', 'oil viscosity', 'centistokes'],
  prereq: ['laminar-turbulent', 'viscosity', 'flow-rate'],
  related: ['friction-factor', 'darcy-weisbach', 'laminar-pipe-flow', 'viscosity-temperature', 'non-circular-ducts', 'hydraulic-oils', 'aerodynamics:reynolds-number', 'aerodynamics:dimensional-analysis'],
  body: `
### One number for the regime
Whether a pipe flow is laminar or turbulent depends on the velocity $V$, the bore $D$ and the liquid's density $\\rho$ and viscosity $\\mu$ — but only through one combination:

$$Re = \\frac{\\rho V D}{\\mu} = \\frac{V D}{\\nu}$$

where $\\nu = \\mu/\\rho$ is the **kinematic viscosity** (m²/s, usually quoted in mm²/s, which are centistokes). The numerator measures the momentum the flow carries, the denominator how strongly viscosity damps disturbances. At low Re viscosity wins and disturbances die out; at high Re they grow into turbulence.

| $Re$ in a round pipe | Regime |
|---|---|
| below 2300 | laminar: disturbances die away |
| 2300–4000 | transitional: intermittent turbulent puffs; friction uncertain |
| above 4000 | turbulent |

The 2300 is not a law of nature but the value below which laminar flow survives *any* disturbance. Reynolds kept laminar flow to about 13 000 with an undisturbed tank, and careful experiments since have reached 100 000; in real pipework, with bends, valves and pumps upstream, the flow is turbulent soon after 2300.

### Viscosity decides a great deal
| Liquid | ν (mm²/s) |
|---|---|
| Water at 0 / 20 / 60 / 90 °C | 1.79 / 1.00 / 0.47 / 0.33 |
| Petrol / diesel fuel at 20 °C | about 0.6 / about 4 |
| Hydraulic oil ISO VG 46 at 0 / 40 / 80 °C | about 570 / 46 / 11 |
| Glycerine at 20 °C | about 1100 |

A water main at 1 m/s in a 100 mm pipe has $Re = 1 \\times 0.1/10^{-6} = 100\\,000$ — deeply turbulent. To be laminar at the same speed, the pipe would have to be 2.3 mm across. Hydraulic oil is the opposite case: VG 46 at 40 °C running at 4.4 m/s in a 12 mm line gives $Re \\approx 1150$, laminar — and at a frosty start (about 570 mm²/s) only about 90. Because the laminar friction factor is $64/Re$, the cold oil loses twelve times more pressure in the same line: sluggish machines and pump-inlet cavitation on cold mornings come straight from this (see [[viscosity-temperature]]).

### What Re is used for
1. **Choosing the friction law.** $f = 64/Re$ for laminar flow; for turbulent flow the Colebrook equation or the Moody chart, where Re and the relative roughness together set $f$ (see [[friction-factor]], [[colebrook]]).
2. **Similarity.** Geometrically similar flows at the same Re behave alike. A model valve tested with water predicts a full-size valve's losses in oil if the Reynolds numbers match (see [[aerodynamics:dimensional-analysis]]).
3. **Non-round passages.** For ducts, annuli and channels, use the **hydraulic diameter** $D_h = 4A/P$ — four times the area over the wetted perimeter — in place of $D$; for a full round pipe $D_h = D$ (see [[non-circular-ducts]]).

> [!tip] In terms of the flow, $Re = 4Q/(\\pi D \\nu)$: for a *given flow*, a bigger pipe has a *lower* Reynolds number. The largest Reynolds numbers in a system are in its smallest passages.
`,
  ideas: [
    'Re = VD/ν compares the momentum of the flow with the viscous forces that damp disturbances.',
    'Round pipes: laminar below about 2300, transitional to 4000, turbulent above.',
    'Kinematic viscosity changes enormously with temperature, especially for oils, and moves Re with it.',
    'Re selects the friction law and makes model tests and different fluids comparable.',
    'For non-circular passages the hydraulic diameter 4A/P replaces D.'
  ],
  pitfalls: [
    'Re = 2300 is a sharp switch — It is the lower limit of transition. Between 2300 and 4000 the flow flickers between laminar and turbulent, and quiet inlets can keep it laminar much longer.',
    'A bigger pipe raises the Reynolds number — At the same velocity, yes; at the same flow the velocity falls as 1/D², so Re = 4Q/(πDν) falls.',
    'Water and oil at the same speed in the same pipe behave alike — Their kinematic viscosities differ by a factor of 20 to 500, and so do their Reynolds numbers.'
  ],
  formulas: [
    {
      name: 'Reynolds number',
      expr: 'Re = V*D/nu', tex: '\\mathrm{Re} = \\dfrac{V D}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1 },
        D: { name: 'pipe bore (or hydraulic diameter)', q: 'length', unit: 'mm', value: 100 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 1.0, tex: '\\nu' }
      },
      note: 'Water at 20 °C: ν = 1.0 mm²/s. ISO VG 46 oil: 46 mm²/s at 40 °C. Laminar below about 2300, turbulent above about 4000.',
      practice: { unknowns: ['Re', 'V', 'nu'] },
      stories: {
        Re: 'A liquid of kinematic viscosity {nu} flows at {V} in a pipe of {D} bore. What is the Reynolds number?',
        V: 'In a pipe of {D} bore, a liquid of kinematic viscosity {nu} reaches a Reynolds number of {Re}. How fast is it flowing?'
      }
    },
    {
      name: 'Reynolds number from density and dynamic viscosity',
      expr: 'Re = rho*V*D/mu', tex: '\\mathrm{Re} = \\dfrac{\\rho V D}{\\mu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 100 },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\mu' }
      },
      note: 'Water at 20 °C: μ = 1.0 mPa·s (1 cP). Mineral hydraulic oil VG 46 at 40 °C: about 40 mPa·s.',
      stories: { Re: 'A liquid of density {rho} and viscosity {mu} flows at {V} in a {D} pipe. What is the Reynolds number?' }
    },
    {
      name: 'Reynolds number from the flow rate',
      expr: 'Re = 4*Q/(pi*D*nu)', tex: '\\mathrm{Re} = \\dfrac{4Q}{\\pi D \\nu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'L/min', value: 30 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 12 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 46, tex: '\\nu' }
      },
      note: 'The same Re written with the flow: at a fixed flow, a larger bore gives a smaller Reynolds number.',
      practice: { unknowns: ['Re', 'Q', 'D'] },
      stories: {
        Re: 'Oil of kinematic viscosity {nu} flows at {Q} through a line of {D} bore. What is the Reynolds number?',
        Q: 'Above what flow does oil of viscosity {nu} in a {D} line reach a Reynolds number of {Re}?'
      }
    }
  ],
  examples: [
    {
      title: 'A water main and an oil line',
      q: 'Find the Reynolds numbers of (a) water at 20 °C, 1 m/s, in a 100 mm main and (b) VG 46 oil flowing at 30 L/min in a 12 mm line at 40 °C and at 0 °C.',
      steps: [
        '(a) $Re = 1 \\times 0.1/1.0\\times10^{-6} = 1.0\\times10^5$: turbulent.',
        '(b) $V = 5\\times10^{-4}/1.131\\times10^{-4} = 4.42$ m/s. At 40 °C: $Re = 4.42 \\times 0.012/46\\times10^{-6} = 1150$, laminar.',
        'At 0 °C the viscosity is about 570 mm²/s: $Re \\approx 93$. The laminar friction factor $64/Re$ is 12 times larger, and so is the pressure lost in the line.'
      ],
      a: 'About 100 000 for the water; 1150 for the warm oil and about 90 for the cold oil.'
    },
    {
      title: 'When does the oil go turbulent?',
      q: 'ISO VG 32 oil at 50 °C has a kinematic viscosity of about 21.5 mm²/s. Between which flows is it transitional in a 25 mm return line?',
      steps: [
        'From $Re = 4Q/(\\pi D \\nu)$: $Q = Re\\,\\pi D \\nu/4$.',
        'At $Re = 2300$: $Q = 2300 \\times \\pi \\times 0.025 \\times 21.5\\times10^{-6}/4 = 9.7\\times10^{-4}$ m³/s $= 58$ L/min.',
        'At $Re = 4000$: $Q = 1.69\\times10^{-3}$ m³/s $= 101$ L/min.'
      ],
      a: 'Laminar below about 58 L/min, turbulent above about 100 L/min.'
    }
  ],
  quiz: [
    { q: 'A pipe carries a fixed flow. It is replaced by one of twice the bore. The Reynolds number…', choices: ['doubles', 'halves', 'falls to a quarter', 'is unchanged'], a: 1,
      why: 'Re = 4Q/(πDν): at a fixed flow it varies as 1/D. The velocity falls by four, the diameter doubles.' },
    { q: 'Water at 20 °C (ν = 1.0 mm²/s) flows at 0.5 m/s in a 50 mm pipe. What is the Reynolds number?', answer: 25000,
      why: 'Re = 0.5 × 0.05/1.0×10⁻⁶ = 25 000: turbulent.' },
    { q: 'Hydraulic oil warms from 20 °C (133 mm²/s) to 60 °C (21 mm²/s) in the same line at the same flow. The Reynolds number…', choices: ['falls by about 6', 'rises about 6 times', 'rises about 2 times', 'does not change'], a: 1,
      why: 'Re is inversely proportional to ν: 133/21 ≈ 6.3.' },
    { q: 'Above Re = 2300 a pipe flow is always turbulent.', a: false,
      why: 'Between 2300 and about 4000 the flow is intermittent; with a very smooth, undisturbed inlet it can stay laminar far higher.' },
    { q: 'What is the hydraulic diameter 4A/P of a square duct of side $a$ running full?', answer: 'a', vars: ['a'], positive: true,
      why: 'A = a², P = 4a, so 4A/P = 4a²/(4a) = a.' }
  ],
  problems: [
    { q: 'VG 46 oil at 40 °C (46 mm²/s) flows at 60 L/min in a hose of 16 mm bore. What is the Reynolds number?', answer: 1730, tol: 0.02,
      steps: ['$V = 10^{-3}/(\\pi \\times 0.016^2/4) = 4.97$ m/s.', '$Re = 4.97 \\times 0.016/46\\times10^{-6} = 1730$: laminar.'] },
    { q: 'Up to what mean velocity does water at 20 °C stay laminar (Re = 2300) in a 10 mm tube?', answer: 0.23, unit: 'm/s', tol: 0.02,
      steps: ['$V = Re\\,\\nu/D = 2300 \\times 10^{-6}/0.01 = 0.23$ m/s.'] }
  ],
  applications: ['Choosing between 64/Re and the Colebrook equation for every pipe-friction calculation.', 'Scale-model tests of spillways, valves and pumps.', 'Specifying oil viscosity grades so that lines behave on cold starts and at full temperature.', 'Designing heat exchangers and mixers to run turbulent.'],
  history: 'Osborne Reynolds (1842–1912) introduced the ratio in his 1883 paper on the transition in pipes; the name "Reynolds number" was given by Arnold Sommerfeld in 1908.',
  sim: 'flow-laminar'
},

{
  id: 'energy-equation', parent: 'flow-basics', title: 'Bernoulli and the energy equation', level: 2,
  short: 'Along a pipe, the energy of each newton of liquid — pressure head, velocity head and elevation — stays constant, except where a pump adds head and friction and fittings take it away. Bernoulli\'s equation is the lossless case; the energy equation is the engineer\'s working tool.',
  keywords: ['Bernoulli', 'energy equation', 'head', 'pressure head', 'velocity head', 'elevation head', 'total head', 'pump head', 'head loss', 'kinetic-energy correction factor', 'alpha', 'piezometric head', 'hydraulic power', 'rho g Q H'],
  prereq: ['continuity-equation', 'pressure-with-depth', 'physics:bernoullis-equation', 'physics:conservation-of-energy'],
  related: ['hgl-egl', 'darcy-weisbach', 'minor-losses', 'pump-head-power', 'venturi-meter', 'torricelli', 'siphons', 'npsh', 'laminar-turbulent', 'aerodynamics:bernoulli'],
  body: `
### Energy per newton: head
Follow a kilogram of water along a pipe. It carries energy in three forms: the work its pressure can do ($p/\\rho$ per kilogram), kinetic energy ($V^2/2$) and potential energy ($gz$). Hydraulic engineers divide everything by $g$, which turns energy per kilogram into energy per **newton** — and a joule per newton is a metre. Each term becomes a **head**, a height of liquid:

$$H = \\underbrace{\\frac{p}{\\rho g}}_{\\text{pressure head}} + \\underbrace{\\frac{V^2}{2g}}_{\\text{velocity head}} + \\underbrace{z}_{\\text{elevation}}$$

Heads are easy to picture. 100 kPa (1 bar) of water pressure is a pressure head of 10.2 m — the height to which water would rise in an open tube. A velocity of 3 m/s is a velocity head of 0.46 m — the height a jet at that speed could climb. Pump makers rate centrifugal pumps in metres of head for the same reason: the head a pump gives hardly depends on the liquid, while the pressure it makes grows with the density.

### Bernoulli: nothing lost, nothing added
For steady flow of an incompressible liquid along a streamline, without friction and without machines, the total head is constant:

$$\\frac{p_1}{\\rho g} + \\frac{V_1^2}{2g} + z_1 = \\frac{p_2}{\\rho g} + \\frac{V_2^2}{2g} + z_2$$

Where a pipe narrows, continuity forces $V$ up and $p$ must fall — the principle of the [[venturi-meter]]. Where a jet leaves a tank, pressure head becomes velocity head — [[torricelli]]. Where a pipe climbs a hill, height is bought with pressure, down to below atmospheric in a [[siphons|siphon]].

### The energy equation: pumps, turbines and losses
Real pipes have friction and real systems have machines. Between an upstream section 1 and a downstream section 2, per newton of liquid:

$$\\frac{p_1}{\\rho g} + \\alpha_1\\frac{V_1^2}{2g} + z_1 + h_p = \\frac{p_2}{\\rho g} + \\alpha_2\\frac{V_2^2}{2g} + z_2 + h_t + h_L$$

- $h_p$, the **pump head**: the energy a pump gives each newton (see [[pump-head-power]]);
- $h_t$, the **turbine head**: the energy a turbine takes out;
- $h_L$, the **head loss**: energy turned into heat by pipe friction ([[darcy-weisbach]]) and by fittings, valves, entrances and exits ([[minor-losses]]); always positive in the direction of flow;
- $\\alpha$, the **kinetic-energy correction factor**. $V$ is the mean velocity, but the kinetic energy of a non-uniform profile is larger than $V^2/2$ per kilogram, because the fast core carries more of the flow. $\\alpha = 2$ for laminar flow and 1.03–1.10 for turbulent flow; in turbulent water systems it is usually taken as 1, the velocity heads being small anyway (see [[laminar-turbulent]]).

The power a pump gives the liquid is $P = \\rho g Q h_p$; its shaft needs $P/\\eta$.

| Term | Typical size in a water main |
|---|---|
| Pressure head | 20–80 m (200–800 kPa) |
| Velocity head at 1.5 m/s | 0.11 m |
| Friction loss | 1–5 m per kilometre |
| Elevation change | whatever the terrain gives |

### Using it without mistakes
1. **Choose the two sections well**, where most is known: a reservoir surface ($p = 0$ gauge, $V \\approx 0$), a free jet ($p = 0$ gauge), a gauge reading.
2. **Use one kind of pressure** on both sides — gauge on both or absolute on both. Gauge is usual; absolute is needed to check for boiling (see [[npsh]] and [[vapour-pressure]]).
3. **Pick one datum** for $z$ and keep it.
4. **Losses appear only downstream**: the total head can only fall in the direction of flow, except at a pump (see [[hgl-egl]]).
5. **Check the assumptions**: steady flow, one inlet and one outlet, an incompressible liquid, no heat added. A slamming valve breaks the first, and [[water-hammer]] analysis takes over.

> [!note] Bernoulli does not say that fast liquid is always at low pressure — only that, *along one flow path without losses*, a gain in speed is paid for by a fall in pressure or height. A jet leaving a hose is fast and at atmospheric pressure: its pressure was spent accelerating it.
`,
  ideas: [
    'Head is energy per newton of liquid, measured in metres: pressure head p/ρg, velocity head V²/2g and elevation z.',
    'Bernoulli: without losses or machines the total head is constant along a streamline.',
    'The energy equation adds the pump head, the turbine head and the head losses between two sections.',
    'α corrects the kinetic energy for the velocity profile: 2 in laminar flow, about 1.05 in turbulent flow.',
    'Hydraulic power is ρgQH: a flow multiplied by the head given to it.'
  ],
  pitfalls: [
    'Fast-moving liquid is always at low pressure — Bernoulli relates points along one lossless path. A free jet is fast and at atmospheric pressure; a pump outlet is fast and at high pressure.',
    'Gauge and absolute pressures can be mixed if the same unit is used — They differ by one atmosphere (10.3 m of water); both sides of the equation must use the same reference.',
    'Head loss can be recovered further down the pipe — Losses become heat; only a pump can raise the total head again.'
  ],
  formulas: [
    {
      name: 'Bernoulli\'s equation in heads',
      expr: 'p1/(rho*g) + V1^2/(2*g) + z1 = p2/(rho*g) + V2^2/(2*g) + z2',
      tex: '\\dfrac{p_1}{\\rho g} + \\dfrac{V_1^2}{2g} + z_1 = \\dfrac{p_2}{\\rho g} + \\dfrac{V_2^2}{2g} + z_2',
      vars: {
        p1: { name: 'pressure at point 1 (gauge)', q: 'pressure', unit: 'kPa', value: 400, signed: true },
        V1: { name: 'velocity at point 1', q: 'speed', unit: 'm/s', value: 1.5 },
        z1: { name: 'elevation of point 1', q: 'length', unit: 'm', value: 0, signed: true },
        p2: { name: 'pressure at point 2 (gauge)', q: 'pressure', unit: 'kPa', signed: true },
        V2: { name: 'velocity at point 2', q: 'speed', unit: 'm/s', value: 2.67 },
        z2: { name: 'elevation of point 2', q: 'length', unit: 'm', value: 25, signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' }
      },
      solveFor: 'p2',
      note: 'Steady, incompressible and lossless flow along one path. Use gauge pressures on both sides, or absolute on both.',
      practice: { unknowns: ['p2', 'V2', 'z2'] },
      stories: {
        p2: 'Water at {p1} and {V1} at an elevation of {z1} flows, without losses, to a point at {z2} where its speed is {V2}. What is the pressure there?',
        z2: 'Water at {p1} moving at {V1} (elevation {z1}) flows without losses uphill until the pressure is {p2} at {V2}. How high is that point?'
      }
    },
    {
      name: 'The energy equation',
      expr: 'p1/(rho*g) + alpha1*V1^2/(2*g) + z1 + hp = p2/(rho*g) + alpha2*V2^2/(2*g) + z2 + hL',
      tex: '\\dfrac{p_1}{\\rho g} + \\alpha_1\\dfrac{V_1^2}{2g} + z_1 + h_p = \\dfrac{p_2}{\\rho g} + \\alpha_2\\dfrac{V_2^2}{2g} + z_2 + h_L',
      vars: {
        p1: { name: 'pressure at section 1 (gauge)', q: 'pressure', unit: 'kPa', value: 150, signed: true },
        alpha1: { name: 'kinetic-energy factor at 1', value: 1, min: 1, max: 2, tex: '\\alpha_1' },
        V1: { name: 'mean velocity at 1', q: 'speed', unit: 'm/s', value: 1.5 },
        z1: { name: 'elevation of section 1', q: 'length', unit: 'm', value: 0, signed: true },
        hp: { name: 'pump head added between 1 and 2', q: 'length', unit: 'm', value: 30 },
        p2: { name: 'pressure at section 2 (gauge)', q: 'pressure', unit: 'kPa', signed: true },
        alpha2: { name: 'kinetic-energy factor at 2', value: 1, min: 1, max: 2, tex: '\\alpha_2' },
        V2: { name: 'mean velocity at 2', q: 'speed', unit: 'm/s', value: 2.67 },
        z2: { name: 'elevation of section 2', q: 'length', unit: 'm', value: 20, signed: true },
        hL: { name: 'head loss between 1 and 2', q: 'length', unit: 'm', value: 4.5, tex: 'h_L' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' }
      },
      solveFor: 'p2',
      note: 'α = 1 for turbulent water flow, 2 for laminar flow. A turbine\'s head goes on the right-hand side, with the losses. With no pump set h_p = 0.',
      practice: { unknowns: ['p2', 'hp', 'hL'] },
      stories: {
        p2: 'Water leaves section 1 at {p1} and {V1}, elevation {z1}, gains {hp} from a pump and loses {hL} in friction on its way to section 2 at {z2}, where it moves at {V2}. What is the pressure at section 2?',
        hp: 'Water at {p1} and {V1} (elevation {z1}) must arrive at {z2} with {p2} and {V2}, losing {hL} on the way. What head must the pump add?'
      }
    },
    {
      name: 'Pressure as a head',
      expr: 'h = p/(rho*g)', tex: 'h = \\dfrac{p}{\\rho g}',
      vars: {
        h: { name: 'pressure head', q: 'length', unit: 'm', signed: true },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'kPa', value: 100, signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: '1 bar of water pressure is 10.2 m of head; 1 m of water is 9.81 kPa. For oil (870 kg/m³) the same pressure is 15 % more head.',
      stories: { h: 'What head of a liquid of density {rho} corresponds to a pressure of {p}?', p: 'What pressure does a column of {h} of liquid of density {rho} exert at its foot?' }
    },
    {
      name: 'Pump shaft power',
      expr: 'Ps = rho*g*Q*H/eta', tex: 'P_s = \\dfrac{\\rho g Q H}{\\eta}',
      vars: {
        Ps: { name: 'shaft power', q: 'power', unit: 'kW', tex: 'P_s' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/s', value: 20 },
        H: { name: 'pump head', q: 'length', unit: 'm', value: 34.5 },
        eta: { name: 'pump efficiency', q: 'ratio', unit: '%', value: 75, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'ρgQH is the hydraulic power the liquid receives; dividing by the efficiency gives the power the motor must deliver to the shaft.',
      practice: { unknowns: ['Ps', 'Q', 'H'] },
      stories: {
        Ps: 'A pump of efficiency {eta} lifts {Q} of liquid of density {rho} through a head of {H}. What shaft power does it need?',
        Q: 'A pump of efficiency {eta} with {Ps} on its shaft works against {H}. What flow can it deliver of liquid of density {rho}?'
      }
    }
  ],
  examples: [
    {
      title: 'Pressure up a hill',
      q: 'A water main carries water at 1.5 m/s in a 200 mm pipe, at 400 kPa (gauge). It climbs 25 m and narrows to 150 mm, losing 3 m of head on the way. What is the pressure at the top? (Take α = 1, g = 9.81 m/s².)',
      steps: [
        'Continuity: $V_2 = 1.5 \\times (200/150)^2 = 2.67$ m/s.',
        'Heads at 1: $400\\,000/9810 = 40.78$ m of pressure, $1.5^2/19.62 = 0.11$ m of velocity, 0 m of elevation: $H_1 = 40.89$ m.',
        'At 2: $H_2 = H_1 - h_L = 37.89$ m, of which $z_2 = 25$ m and $V_2^2/2g = 0.36$ m.',
        'Pressure head: $37.89 - 25 - 0.36 = 12.53$ m, so $p_2 = 12.53 \\times 9810 = 122.9$ kPa.'
      ],
      a: 'About 123 kPa (gauge): most of the pressure went into lifting the water.'
    },
    {
      title: 'Pumping to a tank',
      q: 'A pump lifts 20 L/s from a reservoir to a tank whose surface is 30 m higher. Friction and fittings cost 4.5 m of head at this flow. What head must the pump give, and what shaft power does it need at 75 % efficiency?',
      steps: [
        'Take section 1 on the reservoir surface and section 2 on the tank surface: both at atmospheric pressure, velocities negligible.',
        'Energy equation: $0 + 0 + 0 + h_p = 0 + 0 + 30 + 4.5$, so $h_p = 34.5$ m.',
        'Hydraulic power: $\\rho g Q h_p = 1000 \\times 9.81 \\times 0.020 \\times 34.5 = 6.77$ kW.',
        'Shaft power: $6.77/0.75 = 9.0$ kW.'
      ],
      a: 'A pump head of 34.5 m and about 9 kW at the shaft.'
    }
  ],
  quiz: [
    { q: 'Water flows horizontally at 2 m/s in a 100 mm pipe into a 50 mm section. Ignoring losses, by how much does the pressure fall?', answer: 30, unit: 'kPa', tol: 0.03,
      why: 'V₂ = 2 × 4 = 8 m/s. Δp = ½ρ(V₂² − V₁²) = 500 × (64 − 4) = 30 000 Pa.' },
    { q: 'Without a pump, which of these can increase in the direction of flow?', choices: ['the total head', 'the pressure head', 'both', 'neither'], a: 1,
      why: 'Pressure rises in a widening pipe or going downhill, as velocity or elevation are traded for it. The total head can only fall, because losses are always positive.' },
    { q: 'What head of water corresponds to a gauge pressure of 3 bar?', answer: 30.6, unit: 'm', tol: 0.02,
      why: 'h = p/ρg = 300 000/(1000 × 9.81) = 30.6 m.' },
    { q: 'In laminar flow, using α = 1 underestimates the kinetic energy carried by the flow by half.', a: true,
      why: 'For the parabolic profile α = 2: the true kinetic-energy flux is twice ρQV²/2, so taking α = 1 gives only half of it.' },
    { q: 'A pump gives 40 m of head to 50 L/s of water. What is the hydraulic power?', choices: ['2 kW', '19.6 kW', '196 kW', '2 MW'], a: 1,
      why: 'P = ρgQH = 1000 × 9.81 × 0.05 × 40 = 19 600 W.' }
  ],
  problems: [
    { q: 'A fire main has 350 kPa (gauge) at street level. Ignoring losses and the velocity head, how high above the street can it lift water in a building?', answer: 35.7, unit: 'm', tol: 0.02,
      steps: ['$h = p/\\rho g = 350\\,000/9810 = 35.7$ m — about eleven storeys, before any friction.'] },
    { q: 'Water at 3 m/s and 250 kPa (gauge) in a 150 mm pipe flows into a 100 mm pipe 2 m higher, losing 0.5 m of head. What is the gauge pressure there, in kPa?', answer: 207, unit: 'kPa', tol: 0.02,
      steps: ['$V_2 = 3 \\times (150/100)^2 = 6.75$ m/s.', 'Heads: $25.48 + 0.46 + 0 = p_2/\\rho g + 2.32 + 2 + 0.5$.', '$p_2/\\rho g = 21.12$ m, so $p_2 = 207$ kPa.'] }
  ],
  applications: ['Sizing pumps: the pump head is the lift plus the losses plus any pressure wanted at the outlet.', 'Checking that no point in a pipeline falls below the vapour pressure.', 'Venturi and orifice meters, pitot tubes and carburettor-like ejectors.', 'Hydropower: the head available to a turbine is the gross head less the penstock losses.'],
  history: 'Daniel Bernoulli set out the trade between pressure and speed in *Hydrodynamica* (1738); Leonhard Euler gave the equation its modern form in the 1750s. The energy equation with losses grew out of the nineteenth-century pipe experiments of Darcy, Weisbach and others, and the idea of "head" is older still, from millwrights measuring the fall of water.',
  sim: ['flow-hgl', 'flow-continuity']
},

{
  id: 'hgl-egl', parent: 'flow-basics', title: 'Hydraulic and energy grade lines', level: 2,
  short: 'Plot the total head along a pipeline and you get the energy grade line (EGL); drop it by the velocity head and you get the hydraulic grade line (HGL), the level water would reach in standpipes. Where the pipe rises above the HGL, the pressure inside is below atmospheric.',
  keywords: ['hydraulic grade line', 'energy grade line', 'HGL', 'EGL', 'piezometric head', 'piezometer', 'total head line', 'friction slope', 'negative pressure', 'siphon', 'pipeline profile', 'air valve', 'break-pressure tank'],
  prereq: ['energy-equation', 'darcy-weisbach', 'pressure-with-depth'],
  related: ['siphons', 'minor-losses', 'pump-head-power', 'system-curve', 'column-separation', 'cavitation', 'vapour-pressure', 'water-supply'],
  body: `
The [[energy-equation]] is easiest to use as a picture. Draw the pipeline in elevation, and above it two lines:

- the **energy grade line (EGL)**, at the height $p/\\rho g + \\alpha V^2/2g + z$: the total head;
- the **hydraulic grade line (HGL)**, at $p/\\rho g + z$: the **piezometric head**, the level to which water would rise in a small open tube — a piezometer — tapped into the pipe.

The gap between them is the velocity head $\\alpha V^2/2g$; the gap between the HGL and the pipe is the pressure head.

### Rules for drawing them
1. At a **reservoir surface** both lines lie on the water surface ($p = 0$ gauge, $V \\approx 0$).
2. Along a pipe of constant bore both fall in straight, parallel lines with the **friction slope** $S_f = h_f/L = f V^2/(2gD)$.
3. At an **entrance, fitting or valve** the EGL drops suddenly by the minor loss $K V^2/2g$.
4. At a **change of bore** the EGL carries on (less any loss) but the HGL jumps: up where the pipe widens, as velocity head turns back into pressure; down where it narrows.
5. At a **pump** the EGL jumps up by the pump head; at a **turbine** it drops by the turbine head.
6. At a **free outlet** the HGL passes through the outlet (pressure zero). At an outlet **into a reservoir** the velocity head is lost (an exit loss, $K = 1$) and the EGL meets the reservoir surface.
7. **The EGL never rises in the direction of flow**, except at a pump.

### What the picture tells you
Wherever the **pipe lies below the HGL**, the pressure is above atmospheric, by $\\rho g$ times the vertical gap: a pipe 40 m below its HGL is at about 390 kPa. The pipe's pressure class is chosen from the largest gap — and that usually occurs with **no flow**, when the HGL rises to the level of the upstream reservoir — plus an allowance for [[water-hammer]].

Wherever the **pipe rises above the HGL**, the pressure inside is **below atmospheric**. A few metres is tolerable — a [[siphons|siphon]] works this way — but dissolved air comes out of solution and gathers at high points, choking the flow, so **air valves** are fitted there. About 10 m above the HGL the absolute pressure falls to the vapour pressure of water (2.3 kPa at 20 °C): the water boils cold, the column separates and the flow can collapse, with violent surges when the column rejoins (see [[column-separation]] and [[vapour-pressure]]). Designers keep a pipeline below its HGL at every flow, or add a pump or a break-pressure tank.

| Pressure head (HGL minus pipe) | Pressure (gauge, water) | Meaning |
|---|---|---|
| +60 m | +590 kPa | a typical urban main |
| +20 m | +200 kPa | a common minimum service pressure at a tap |
| 0 m | 0 | atmospheric: a free surface would form |
| −5 m | −49 kPa | siphon section: air comes out of solution |
| about −10 m | about −98 kPa (2–3 kPa absolute) | vapour pressure: the column separates |

A steep HGL means a pipe too small for its flow — the energy is going into friction. A pump raises the lines from its own position onwards, so where it stands matters: placed ahead of a high point it can lift the HGL clear of the pipe there.

> [!tip] Think of the HGL as the "standpipe line": imagine glass tubes on the pipe every hundred metres; the water in them would stand at the HGL. A water tower is a way of holding the HGL high enough above a town.
`,
  ideas: [
    'The EGL is the total head along the pipe; the HGL lies a velocity head below it.',
    'Both fall at the friction slope along a uniform pipe, drop at fittings and jump up at a pump.',
    'The pressure at any point is ρg times the height of the HGL above the pipe there.',
    'A pipe above its HGL is under vacuum; about 10 m above it, water boils and the column separates.',
    'The highest pressures often occur with no flow, when the HGL rises to the upstream reservoir level.'
  ],
  pitfalls: [
    'The HGL is the pipe\'s elevation profile — It is the level water would reach in standpipes: pressure head plus elevation. The pipe can lie far below it or, dangerously, above it.',
    'The EGL can rise where the pipe widens — Only the HGL rises there, because velocity head is converted to pressure. The EGL falls everywhere except at a pump.',
    'A pipeline is safe if the pressure is positive while flowing — The static case (no flow) raises the HGL and the pressure; surges add more. Both must be checked.'
  ],
  formulas: [
    {
      name: 'Hydraulic grade line (piezometric head)',
      expr: 'HGL = p/(rho*g) + z', tex: '\\mathrm{HGL} = \\dfrac{p}{\\rho g} + z',
      vars: {
        HGL: { name: 'height of the hydraulic grade line', q: 'length', unit: 'm', signed: true, tex: '\\mathrm{HGL}' },
        p: { name: 'pressure in the pipe (gauge)', q: 'pressure', unit: 'kPa', value: 120, signed: true },
        z: { name: 'elevation of the pipe', q: 'length', unit: 'm', value: 30, signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: 'Solve for p to find the pressure anywhere along a line whose HGL you know. Elevations from one datum.',
      practice: { unknowns: ['HGL', 'p'] },
      stories: {
        HGL: 'A gauge on a pipe at elevation {z} reads {p}. Where does the hydraulic grade line lie?',
        p: 'The hydraulic grade line of a water main stands at {HGL} where the pipe is at {z}. What does a pressure gauge there read?'
      }
    },
    {
      name: 'Energy grade line (total head)',
      expr: 'EGL = p/(rho*g) + alpha*V^2/(2*g) + z', tex: '\\mathrm{EGL} = \\dfrac{p}{\\rho g} + \\alpha\\dfrac{V^2}{2g} + z',
      vars: {
        EGL: { name: 'height of the energy grade line', q: 'length', unit: 'm', signed: true, tex: '\\mathrm{EGL}' },
        p: { name: 'pressure in the pipe (gauge)', q: 'pressure', unit: 'kPa', value: 120, signed: true },
        alpha: { name: 'kinetic-energy factor', value: 1, min: 1, max: 2, tex: '\\alpha' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 },
        z: { name: 'elevation of the pipe', q: 'length', unit: 'm', value: 30, signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' }
      },
      stories: { EGL: 'Water at {p} flows at {V} in a pipe at elevation {z}. Where is the energy grade line?' }
    },
    {
      name: 'Friction slope of the grade lines',
      expr: 'Sf = f*V^2/(2*g*D)', tex: 'S_f = \\dfrac{f\\,V^2}{2 g D}',
      vars: {
        Sf: { name: 'friction slope (head lost per length)', q: 'ratio', unit: '‰', tex: 'S_f' },
        f: { name: 'Darcy friction factor', value: 0.02, min: 0.005, max: 0.1 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 300 },
        g: { const: 'g' }
      },
      note: 'Head lost per unit length of pipe; ‰ is metres per kilometre. It is the Darcy–Weisbach equation divided by the length.',
      practice: { unknowns: ['Sf', 'V'] },
      stories: {
        Sf: 'Water at {V} flows in a {D} pipe with a friction factor of {f}. How steeply do the grade lines fall?',
        V: 'A {D} main with a friction factor of {f} may lose no more than {Sf} of head. What is the highest velocity allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'A pipeline over a hill',
      q: 'A 300 mm pipe, 2000 m long ($f$ = 0.02), runs from a reservoir with its surface at 100 m to one at 60 m. Take an entrance loss of $0.5\\,V^2/2g$ and an exit loss of $V^2/2g$. At 1200 m along, the pipe crosses a hill at 80 m. Find the flow and the pressure at the crest.',
      steps: [
        'Energy from surface to surface: $100 - 60 = (0.5 + 1 + fL/D)\\,V^2/2g = (1.5 + 133.3)\\,V^2/2g$.',
        '$V^2/2g = 40/134.8 = 0.297$ m, so $V = 2.41$ m/s and $Q = 2.41 \\times 0.0707 = 0.171$ m³/s.',
        'EGL at the crest: $100 - 0.5 \\times 0.297 - 0.02 \\times (1200/0.3) \\times 0.297 = 76.1$ m; the HGL is 0.3 m lower, at 75.8 m.',
        'The pipe is 4.2 m **above** the HGL: the pressure is $-4.2 \\times 9.81 = -41$ kPa (gauge).'
      ],
      a: '171 L/s, with about −41 kPa at the crest: a siphon section that needs an air valve. A crest near 86 m would bring the water to its vapour pressure.'
    },
    {
      title: 'The static case',
      q: 'In the same pipeline, a low point 400 m along lies at elevation 20 m. What pressure does the pipe there see while flowing, and what must it withstand when the downstream valve is shut and the flow stops?',
      steps: [
        'Flowing: EGL $= 100 - 0.15 - 0.02 \\times (400/0.3) \\times 0.297 = 91.9$ m; HGL $= 91.9 - 0.3 = 91.6$ m.',
        'Pressure head $91.6 - 20 = 71.6$ m, about 703 kPa.',
        'With no flow there are no losses: the HGL is level with the upstream reservoir, at 100 m.',
        'Pressure head $100 - 20 = 80$ m, so $p = 80 \\times 9.81 = 785$ kPa — before any surge from closing the valve.'
      ],
      a: 'About 785 kPa static, more than while flowing; the pipe class must cover it plus the surge.'
    }
  ],
  quiz: [
    { q: 'Along a uniform pipe without pumps, the energy grade line…', choices: ['rises', 'falls', 'stays level', 'can do either'], a: 1,
      why: 'Friction turns energy into heat along every metre of pipe, so the total head falls in the direction of flow.' },
    { q: 'The HGL at a point is 12 m above the centreline of a water pipe. What is the gauge pressure there?', answer: 117.7, unit: 'kPa', tol: 0.02,
      why: 'p = ρg × 12 m = 1000 × 9.81 × 12 = 117.7 kPa.' },
    { q: 'Where a pipeline rises above its hydraulic grade line, the pressure inside is…', choices: ['above atmospheric', 'exactly atmospheric', 'below atmospheric', 'equal to the vapour pressure'], a: 2,
      why: 'The pressure head is the height of the HGL above the pipe; if the pipe is higher, that height is negative.' },
    { q: 'At a sudden enlargement the HGL can rise even though the EGL falls.', a: true,
      why: 'Velocity head is converted to pressure head. The EGL falls by the (small) enlargement loss, but the HGL rises by the drop in velocity head minus that loss.' },
    { q: 'What is the vertical distance between the EGL and the HGL?', choices: ['the pressure head', 'the velocity head αV²/2g', 'the head loss so far', 'the elevation of the pipe'], a: 1,
      why: 'EGL − HGL = αV²/2g. In water mains it is typically only 0.05–0.3 m.' }
  ],
  applications: ['Laying out water-supply and irrigation pipelines over hilly ground.', 'Placing air valves, washouts and break-pressure tanks.', 'Choosing pipe pressure classes from the highest static and surge grade lines.', 'Deciding where along a pipeline a booster pump should stand.'],
  sim: 'flow-hgl'
},

/* ================================================================ MOMENTUM AND FORCES */
{
  id: 'momentum-principle', parent: 'momentum-forces', title: 'The momentum principle', level: 2,
  short: 'Newton\'s second law for a flowing liquid: the net force on the liquid inside a control volume equals the momentum leaving it per second minus the momentum entering. It gives the forces on nozzles, bends, vanes and jets without knowing the details inside.',
  keywords: ['momentum equation', 'momentum principle', 'control volume', 'momentum flux', 'rho Q V', 'reaction force', 'nozzle reaction', 'thrust', 'momentum correction factor', 'beta', 'Newton\'s second law', 'fire hose', 'jet boat'],
  prereq: ['continuity-equation', 'energy-equation', 'physics:newtons-second-law', 'physics:momentum'],
  related: ['jet-forces', 'pipe-bend-forces', 'pelton-wheel', 'hydraulic-jump', 'hoses-fittings', 'physics:newtons-third-law', 'physics:impulse', 'aerodynamics:momentum-equation', 'aerodynamics:momentum-theory'],
  body: `
### Newton's law for something that flows
For a solid body you write $F = m\\,a$. A liquid keeps changing which particles are in the pipe, so instead we draw a fixed boundary — a **control volume** — and count the momentum crossing it. In steady flow the momentum inside does not change, so the net force on the liquid inside equals the rate at which momentum leaves minus the rate at which it enters:

$$\\sum \\vec F = \\sum_\\text{out} \\beta\\,\\dot m\\,\\vec V - \\sum_\\text{in} \\beta\\,\\dot m\\,\\vec V, \\qquad \\dot m = \\rho Q$$

With one inlet and one outlet this is simply $\\sum \\vec F = \\rho Q\\,(\\vec V_2 - \\vec V_1)$. The product $\\rho Q V$ is the **momentum flux**: a jet of 10 L/s at 20 m/s carries 200 N of it, and whatever stops the jet feels 200 N.

It is a **vector** equation: write it separately for the $x$ and $y$ directions, with signs. A velocity that reverses — a jet turned back on itself — doubles the change and the force.

### What the forces are
$\\sum \\vec F$ collects every force acting on the liquid inside the control volume:
- **pressure forces** $pA$ on the inlet and outlet faces, pointing *into* the control volume (gauge pressures, when the outside of the pipe is at atmosphere);
- the **weight** of the liquid inside, if the flow has a vertical component;
- the **force from the walls** — pipe, nozzle, vane or bend — usually the unknown. The liquid pushes back on the wall with an equal and opposite force (Newton's third law), and that is what bolts, anchors and thrust blocks must carry.

### A recipe
1. Draw the control volume round the liquid, cutting the pipe square at the inlet and the outlet.
2. Mark the velocities, pressures and areas on the cut faces, using continuity for the velocities.
3. Draw every force on the liquid; call the unknown wall force $R_x$, $R_y$.
4. Write $\\sum F_x = \\rho Q\\,(V_{2x} - V_{1x})$, and the same for $y$; solve.
5. Reverse the sign to get the force of the liquid on the structure.

### The correction factor β
The true momentum flux of a non-uniform profile, $\\int \\rho u^2\\,dA$, exceeds $\\rho Q V$ by the factor **β**: 4/3 for laminar flow and 1.01–1.04 for turbulent flow. For water it is almost always set to 1.

### Where it matters
- **Nozzles and hoses.** A fire crew holds a reaction equal to the jet's momentum flux, $\\rho Q V_j$ — about 360 N for 800 L/min from a 25 mm tip, which is why large hoses need two people or a ground monitor. The coupling that holds the nozzle on carries far more, because of the pressure inside (see the example).
- **Jets on vanes and plates**, and so the Pelton wheel ([[jet-forces]]).
- **Bends, reducers and tees**, which try to move and must be anchored ([[pipe-bend-forces]]).
- **Propulsion**: jet boats, water jets and the [[aerodynamics:momentum-theory|actuator disc]] of a propeller.
- **The hydraulic jump** in a channel, where momentum is conserved though energy is not ([[hydraulic-jump]]).

> [!warn] A hose or pipe that breaks free is driven by these same pressure and momentum forces: a whipping high-pressure hose can kill. Fit whip restraints where required, never stand in line with a pressurised hose end, and release the pressure — and lock out the pump — before disconnecting anything.
`,
  ideas: [
    'For a control volume in steady flow, the net force on the liquid equals the momentum flux out minus the momentum flux in.',
    'Momentum flux is ρQV; a jet of 10 L/s at 20 m/s carries 200 N of it.',
    'The equation is a vector equation: forces and velocity changes are resolved by direction, with signs.',
    'Pressure forces on the cut faces belong in the balance; in pipes they are usually the largest forces.',
    'The force on the structure is equal and opposite to the wall force acting on the liquid.'
  ],
  pitfalls: [
    'Only moving water exerts forces on a pipe — The pressure forces on the cut faces act with or without flow, and they usually dominate.',
    'The force on a nozzle\'s coupling equals the jet reaction felt by the person holding the hose — The coupling also carries the pressure force on the nozzle\'s inlet area, and is usually loaded far more heavily.',
    'Speed changes need force, direction changes do not — Momentum is a vector; turning a flow at constant speed needs a force just as speeding it up does.'
  ],
  formulas: [
    {
      name: 'Momentum equation (one inlet, one outlet, one direction)',
      expr: 'F = rho*Q*(V2 - V1)', tex: 'F = \\rho Q\\,(V_2 - V_1)',
      vars: {
        F: { name: 'net force on the liquid in that direction', q: 'force', unit: 'N', signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/s', value: 10 },
        V2: { name: 'outlet velocity component', q: 'speed', unit: 'm/s', value: 20, signed: true },
        V1: { name: 'inlet velocity component', q: 'speed', unit: 'm/s', value: 2, signed: true }
      },
      note: 'F is the sum of all forces on the liquid (pressures on the faces, weight, and the wall force). Resolve each direction separately, with signs.',
      practice: { unknowns: ['F', 'V2'] },
      stories: {
        F: 'A flow of {Q} of density {rho} enters a nozzle at {V1} and leaves at {V2}. What net force acts on the liquid inside?',
        V2: 'A net force of {F} acts on {Q} of liquid (density {rho}) that enters at {V1}. How fast does it leave?'
      }
    },
    {
      name: 'Reaction of a free jet',
      expr: 'R = 4*rho*Q^2/(pi*d^2)', tex: 'R = \\dfrac{4\\rho Q^2}{\\pi d^2}',
      vars: {
        R: { name: 'jet reaction (momentum flux ρQV_j)', q: 'force', unit: 'N' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 800 },
        d: { name: 'jet (nozzle tip) diameter', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'The force needed to hold a nozzle fed by a flexible hose, or the force a jet puts on a wall square to it: ρQV_j with V_j = Q/(πd²/4).',
      stories: {
        R: 'A fire nozzle with a {d} tip delivers {Q}. What reaction must the crew hold?',
        d: 'A crew can safely hold a reaction of {R}. What is the smallest tip that can deliver {Q}?'
      }
    },
    {
      name: 'Nozzle reaction from the nozzle pressure',
      expr: 'R = 2*p*pi*d^2/4', tex: 'R = 2\\,p\\,\\dfrac{\\pi d^2}{4}',
      vars: {
        R: { name: 'jet reaction', q: 'force', unit: 'N' },
        p: { name: 'pressure at the nozzle inlet (gauge)', q: 'pressure', unit: 'bar', value: 3.7 },
        d: { name: 'tip diameter', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'For a smooth nozzle fed from a much larger hose: the jet speed is √(2p/ρ), so ρQV_j = 2pA. Fire services use it in this form.',
      stories: { R: 'A smooth-bore nozzle with a {d} tip works at {p}. What is the reaction?', p: 'What nozzle pressure gives a reaction of {R} from a {d} tip?' }
    }
  ],
  examples: [
    {
      title: 'A fire nozzle and its coupling',
      q: 'A 65 mm hose delivers 800 L/min through a smooth 25 mm nozzle into the open air. Find the jet speed, the reaction the crew must hold, and the force on the coupling that joins the nozzle to the hose.',
      steps: [
        '$Q = 0.01333$ m³/s. Tip: $V_j = Q/(\\pi \\times 0.025^2/4) = 27.2$ m/s. Hose: $V_1 = Q/(\\pi \\times 0.065^2/4) = 4.02$ m/s.',
        'Reaction held by the crew (hose flexible, water leaving at $V_j$): $R = \\rho Q V_j = 1000 \\times 0.01333 \\times 27.2 = 362$ N.',
        'Pressure at the nozzle inlet (Bernoulli, jet at atmospheric): $p_1 = \\tfrac12\\rho(V_j^2 - V_1^2) = 361$ kPa.',
        'Control volume round the water in the nozzle, $x$ along the flow: $p_1A_1 + R_x = \\rho Q(V_j - V_1)$, so $R_x = 309 - 361\\,000 \\times 3.32\\times10^{-3} = 309 - 1197 = -889$ N.',
        'The nozzle pushes the water back with 889 N, so the water pushes the nozzle forward with 889 N: the coupling is in tension.'
      ],
      a: 'Jet 27 m/s; the crew holds about 360 N; the coupling carries about 890 N, pulling the nozzle off the hose.'
    },
    {
      title: 'A jet boat',
      q: 'A jet boat moving at 10 m/s takes in 0.5 m³/s of water through its hull and ejects it astern at 25 m/s relative to the boat. What thrust does it make?',
      steps: [
        'In the boat\'s frame, water enters at 10 m/s and leaves at 25 m/s, both along the boat\'s axis.',
        '$F = \\rho Q\\,(V_2 - V_1) = 1000 \\times 0.5 \\times (25 - 10) = 7500$ N.'
      ],
      a: '7.5 kN. Accelerating a lot of water a little is more efficient than a little water a lot — the principle of propellers and turbofans.'
    }
  ],
  quiz: [
    { q: 'A jet of 5 L/s at 12 m/s hits a wall square on and spreads out sideways. What force does it put on the wall?', answer: 60, unit: 'N', tol: 0.02,
      why: 'All its momentum along the jet is destroyed: F = ρQV = 1000 × 0.005 × 12 = 60 N.' },
    { q: 'If the same jet were turned right round, back towards the nozzle, by a cup, the force would…', choices: ['stay the same', 'double', 'halve', 'fall to zero'], a: 1,
      why: 'The velocity changes from +V to −V, a change of 2V, so the force is 2ρQV.' },
    { q: 'In the momentum balance on a pipe fitting, the pressure forces on the inlet and outlet faces must be included.', a: true,
      why: 'They act on the liquid in the control volume; in water mains they are usually far larger than the momentum terms.' },
    { q: 'The momentum correction factor β for fully developed laminar pipe flow is…', choices: ['1', '1.02', '4/3', '2'], a: 2,
      why: 'For the parabolic profile ∫u²dA = (4/3)AV². (The kinetic-energy factor α is 2.)' },
    { q: 'Why does a nozzle coupling carry more force than the crew holding the hose feels?', choices: ['the crew stands at an angle', 'the coupling also resists the pressure acting on the nozzle\'s inlet area', 'friction in the nozzle adds to it', 'the jet speeds up after leaving the nozzle'], a: 1,
      why: 'The water inside the nozzle is pushed forward by the hose pressure on the large inlet area; the nozzle must hold it back while it accelerates. The crew only feels the net reaction of the whole hose-and-nozzle system.' }
  ],
  problems: [
    { q: 'A 20 mm jet carries 8 L/s. What reaction does the nozzle produce?', answer: 204, unit: 'N', tol: 0.02,
      steps: ['$V_j = 0.008/(\\pi \\times 0.02^2/4) = 25.5$ m/s.', '$R = \\rho Q V_j = 1000 \\times 0.008 \\times 25.5 = 204$ N.'] }
  ],
  applications: ['Designing nozzle couplings, hose restraints and monitors for fire fighting and water blasting.', 'Anchoring bends, tees and reducers in water mains.', 'Jet propulsion of boats and the thrust of propellers and turbines.', 'Impulse turbines, from Pelton wheels to lawn sprinklers.'],
  history: 'The idea is Newton\'s (1687). Euler applied it to the reaction of flowing water in his work on turbines in the 1750s, and Rankine and William Froude built the momentum theory of propellers on it in the 1860s–1880s.',
  sim: ['flow-jet', 'flow-bend']
},

{
  id: 'jet-forces', parent: 'momentum-forces', title: 'Forces of jets on plates and vanes', level: 2,
  short: 'A jet pushes on whatever turns it: ρQV(1 − cos θ) along the jet for a deflection θ. A flat plate square to the jet takes ρQV; a cup that turns it right round takes twice that. On moving vanes the relative velocity counts, and a wheel of buckets takes the most power at half the jet speed.',
  keywords: ['jet impact', 'flat plate', 'inclined plate', 'curved vane', 'deflection angle', 'moving vane', 'relative velocity', 'velocity triangle', 'Pelton wheel', 'bucket', 'jet power', 'efficiency', 'half jet speed', 'impulse turbine'],
  prereq: ['momentum-principle', 'torricelli', 'physics:kinetic-energy'],
  related: ['pelton-wheel', 'hydropower', 'pipe-bend-forces', 'physics:power', 'aerodynamics:momentum-equation'],
  body: `
### A fixed vane
A free jet is at atmospheric pressure all round, so as it slides over a smooth vane the only force on it is the vane's push, and its speed relative to the vane stays nearly constant. Turn a jet of flow $Q$ and speed $V$ through an angle θ and the momentum equation gives, along the jet's original direction,

$$F_x = \\rho Q V\\,(1 - \\cos\\theta)$$

and across it $F_y = \\rho Q V \\sin\\theta$ — which cancels when the jet is split into two equal halves turned opposite ways, as on a flat plate or a Pelton bucket.

| Deflection θ | Force along the jet | Example |
|---|---|---|
| 0° | 0 | jet grazing a surface |
| 90° | $\\rho Q V$ | flat plate square to the jet |
| 120° | $1.5\\,\\rho Q V$ | curved vane |
| 165° | $1.97\\,\\rho Q V$ | Pelton bucket |
| 180° | $2\\,\\rho Q V$ | ideal cup: jet sent straight back |

A 50 mm jet at 30 m/s (59 L/s) pushes a flat plate with $1000 \\times 0.0589 \\times 30 = 1.77$ kN, and a Pelton-shaped bucket with 3.47 kN.

A frictionless **inclined flat plate**, at an angle φ to the jet, can only push at right angles to itself: $F_n = \\rho Q V \\sin\\phi$, and the jet divides unequally, $Q(1 + \\cos\\phi)/2$ one way and $Q(1 - \\cos\\phi)/2$ the other.

### Moving vanes: relative velocity
If the vane moves away from the nozzle at speed $u$, the water reaches it with the **relative velocity** $w = V - u$, is turned through θ relative to the vane, and leaves with an absolute velocity that is the vector sum of $u$ and the relative exit velocity — the **velocity triangle**. How much water takes part depends on the arrangement:

- A **single vane** running away from the nozzle: the jet lengthens as it chases the vane, so only $\\rho A (V - u)$ kg/s reaches it. $F = \\rho A (V-u)^2(1 - \\cos\\theta)$, and the power $F u$ peaks at $u = V/3$, at no more than 16/27 (59 %) of the jet's power.
- A **series of vanes** on a wheel: a fresh bucket always takes the jet, so *all* the flow is used. $F = \\rho Q (V - u)(1 - \\cos\\theta)$ and

$$P = F u = \\rho Q\\,u\\,(V - u)(1 - \\cos\\theta)$$

which peaks at $u = V/2$. With θ = 180° the water then leaves the bucket with **zero absolute velocity** — it simply drops away — and the whole jet power $\\rho Q V^2/2$ has been taken: an ideal efficiency of 100 %. Real Pelton buckets turn the jet through about 165°, so that the water clears the next bucket; friction slows it on the bucket surface; and the best runners reach 90–92 % with a speed ratio $u/V$ near 0.46 (see [[pelton-wheel]]).

### The jet itself
The jet speed comes from the head behind the nozzle, $V = C_v\\sqrt{2gH}$ with $C_v \\approx 0.97$–0.99 (see [[torricelli]]): 500 m of head gives about 97 m/s. The jet's power, $\\rho g Q H$ less the small nozzle loss, is what a wheel can harvest (see [[hydropower]]).

> [!warn] High-speed water jets injure. A pressure washer at 150 bar makes a jet of about 170 m/s that can drive water and dirt through the skin — treat any such wound as an injection injury and seek emergency medical care at once. Never put any part of the body in front of a nozzle, and isolate and depressurise the supply before working on it.
`,
  ideas: [
    'A jet turned through θ pushes the vane with ρQV(1 − cos θ) along its original direction.',
    'A flat plate square on takes ρQV; a 180° cup takes 2ρQV.',
    'On a moving vane, only the relative velocity V − u counts.',
    'A wheel of vanes uses all the flow and takes the most power at u = V/2; a single vane only at u = V/3.',
    'At the best speed, water leaves an ideal 180° bucket with no absolute velocity: all its energy has been taken.'
  ],
  pitfalls: [
    'A jet pushes hardest on a flat plate — A cup that turns the jet back pushes twice as hard, because the momentum is reversed rather than destroyed.',
    'A turbine bucket should move as fast as the jet — Then the water never catches it and no force is exerted; the power peaks at half the jet speed.',
    'A single vane and a wheel of vanes behave alike — On a single receding vane the jet must chase it, so less water arrives per second; a wheel always presents a bucket to the whole flow.'
  ],
  formulas: [
    {
      name: 'Force of a jet on a fixed vane',
      expr: 'F = rho*Q*V*(1 - cos(theta))', tex: 'F = \\rho Q V\\,(1 - \\cos\\theta)',
      vars: {
        F: { name: 'force along the jet', q: 'force', unit: 'kN' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        Q: { name: 'jet flow', q: 'flowrate', unit: 'L/s', value: 58.9 },
        V: { name: 'jet velocity', q: 'speed', unit: 'm/s', value: 30 },
        theta: { name: 'deflection of the jet', q: 'angle', unit: '°', value: 165, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'θ = 90° is a flat plate square to the jet; θ = 180° sends the jet straight back. Friction on the vane reduces the force a little.',
      practice: { unknowns: ['F', 'theta', 'V'] },
      stories: {
        F: 'A jet of {Q} at {V} is turned through {theta} by a fixed vane. What force does it put on the vane?',
        theta: 'A jet of {Q} at {V} pushes a fixed vane with {F}. Through what angle is it deflected?'
      }
    },
    {
      name: 'Force on a wheel of moving vanes',
      expr: 'F = rho*Q*(V - u)*(1 - cos(theta))', tex: 'F = \\rho Q\\,(V - u)(1 - \\cos\\theta)',
      vars: {
        F: { name: 'force on the buckets', q: 'force', unit: 'kN' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        Q: { name: 'jet flow', q: 'flowrate', unit: 'L/s', value: 58.9 },
        V: { name: 'jet velocity', q: 'speed', unit: 'm/s', value: 30 },
        u: { name: 'bucket speed', q: 'speed', unit: 'm/s', value: 15 },
        theta: { name: 'deflection relative to the bucket', q: 'angle', unit: '°', value: 165, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'A series of vanes (a wheel), so that all the flow is used; frictionless buckets.',
      stories: { F: 'A jet of {Q} at {V} drives buckets moving at {u} that turn it through {theta}. What force acts on the buckets?' }
    },
    {
      name: 'Power delivered to a wheel of vanes',
      expr: 'P = rho*Q*u*(V - u)*(1 - cos(theta))', tex: 'P = \\rho Q\\,u\\,(V - u)(1 - \\cos\\theta)',
      vars: {
        P: { name: 'power to the wheel', q: 'power', unit: 'kW' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        Q: { name: 'jet flow', q: 'flowrate', unit: 'L/s', value: 58.9 },
        u: { name: 'bucket speed', q: 'speed', unit: 'm/s', value: 15 },
        V: { name: 'jet velocity', q: 'speed', unit: 'm/s', value: 30 },
        theta: { name: 'deflection relative to the bucket', q: 'angle', unit: '°', value: 165, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Largest at u = V/2. Two bucket speeds give the same power below the maximum, one either side of V/2.',
      practice: { unknowns: ['P', 'Q'] },
      stories: { P: 'A jet of {Q} at {V} drives a wheel whose buckets move at {u} and turn the jet through {theta}. What power reaches the wheel?', Q: 'A wheel with buckets at {u} turning the jet through {theta} must take {P} from a jet at {V}. What flow is needed?' }
    },
    {
      name: 'Efficiency of a wheel of vanes',
      expr: 'eta = 2*u*(V - u)*(1 - cos(theta))/V^2', tex: '\\eta = \\dfrac{2u\\,(V - u)(1 - \\cos\\theta)}{V^2}',
      vars: {
        eta: { name: 'fraction of the jet power taken', q: 'ratio', unit: '%', tex: '\\eta' },
        u: { name: 'bucket speed', q: 'speed', unit: 'm/s', value: 15 },
        V: { name: 'jet velocity', q: 'speed', unit: 'm/s', value: 30 },
        theta: { name: 'deflection relative to the bucket', q: 'angle', unit: '°', value: 165, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'The ideal (frictionless) efficiency, P ÷ ½ρQV². It is 100 % for θ = 180° and u = V/2.',
      practice: { unknowns: ['eta'] },
      stories: { eta: 'Buckets moving at {u} turn a jet at {V} through {theta}. What fraction of the jet\'s power do they take, ideally?' }
    }
  ],
  examples: [
    {
      title: 'A plate and a bucket',
      q: 'A 50 mm jet leaves a nozzle at 30 m/s. What force does it put on (a) a fixed flat plate square to it; (b) a fixed bucket that turns it through 165°?',
      steps: [
        '$A = \\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m², $Q = 30A = 0.0589$ m³/s.',
        '(a) $F = \\rho Q V = 1000 \\times 0.0589 \\times 30 = 1767$ N.',
        '(b) $F = \\rho Q V (1 - \\cos 165^\\circ) = 1767 \\times 1.966 = 3474$ N.'
      ],
      a: '1.77 kN on the plate, 3.47 kN on the bucket.'
    },
    {
      title: 'The best bucket speed',
      q: 'The same jet drives a wheel of 165° buckets. Find the force, power and ideal efficiency at bucket speeds of 10 m/s and 15 m/s.',
      steps: [
        'Jet power: $\\tfrac12 \\rho Q V^2 = 0.5 \\times 1000 \\times 0.0589 \\times 900 = 26.5$ kW.',
        '$u = 10$: $F = 1000 \\times 0.0589 \\times 20 \\times 1.966 = 2.32$ kN; $P = F u = 23.2$ kW; $\\eta = 87$ %.',
        '$u = 15$: $F = 1.74$ kN; $P = 26.1$ kW; $\\eta = 98.3$ % — the maximum, $(1 - \\cos 165^\\circ)/2$.'
      ],
      a: 'At half the jet speed the wheel takes 26.1 kW, 98 % of the jet power (ideally); at a third of it only 87 %.'
    }
  ],
  quiz: [
    { q: 'A jet hits a flat plate square on. The plate is replaced by a cup that turns the jet straight back. The force…', choices: ['stays the same', 'doubles', 'halves', 'rises four times'], a: 1,
      why: 'The flat plate destroys the jet\'s momentum along its axis (1 − cos 90° = 1); the cup reverses it (1 − cos 180° = 2).' },
    { q: 'The buckets of an ideal impulse wheel take the most power when they move at what fraction of the jet speed?', choices: ['one third', 'one half', 'two thirds', 'the full jet speed'], a: 1,
      why: 'P ∝ u(V − u), which peaks at u = V/2. (For a single receding vane it is V/3.)' },
    { q: 'A single vane running away from a nozzle takes as much power as a wheel of vanes at the same speed.', a: false,
      why: 'Less water reaches a receding single vane each second, because the jet has to catch it; a wheel always presents a bucket to the whole flow.' },
    { q: 'A 20 mm jet at 25 m/s strikes a fixed flat plate square on. What is the force?', answer: 196, unit: 'N', tol: 0.02,
      why: 'Q = 25 × π × 0.02²/4 = 7.85×10⁻³ m³/s; F = ρQV = 1000 × 7.85×10⁻³ × 25 = 196 N.' },
    { q: 'Why do Pelton buckets turn the jet through about 165° rather than a full 180°?', choices: ['to reduce the force on the bucket', 'so the leaving water clears the back of the next bucket', 'because 165° gives more power than 180°', 'to keep the jet speed constant'], a: 1,
      why: 'Sent straight back, the water would strike the following bucket. Losing about 1.7 % of the ideal efficiency is the price of letting it get away.' }
  ],
  problems: [
    { q: 'A wheel of buckets that turn the jet through 170° is driven by a jet of 30 L/s at 60 m/s. What power does it receive (ideally) at a bucket speed of 28 m/s?', answer: 53.4, unit: 'kW', tol: 0.02,
      steps: ['$1 - \\cos 170^\\circ = 1.985$.', '$P = \\rho Q u (V - u)(1 - \\cos\\theta) = 1000 \\times 0.03 \\times 28 \\times 32 \\times 1.985 = 53.4$ kW, out of a jet power of 54 kW.'] }
  ],
  applications: ['Pelton and Turgo impulse turbines for high-head hydropower.', 'Loads on structures struck by jets from spillways, fire monitors or burst pipes.', 'Water-jet cutting and cleaning, where the jet\'s momentum does the work.', 'Deflector plates and jet-splitters in fountains and spray systems.'],
  history: 'Lester Pelton, a millwright in the Californian gold fields, noticed that a jet striking the edge of a cup did more work than one striking its middle; his split double bucket, patented in 1880, sent the water out sideways and backwards and gave the impulse turbine its modern form.',
  sim: 'flow-jet'
},

{
  id: 'pipe-bend-forces', parent: 'momentum-forces', title: 'Forces on bends and reducers', level: 2,
  short: 'Pressure and momentum both push on a bend, a reducer or a closed end. In a water main the pressure term dominates: a 600 mm bend at 10 bar pushes outward with about 40 tonnes, which a thrust block or restrained joints must hold.',
  keywords: ['thrust block', 'anchor block', 'bend thrust', 'elbow force', 'reducer', 'tee', 'dead end', 'hydrostatic thrust', 'restrained joints', 'pressure test', 'soil bearing', 'pipe anchoring', 'gravity block'],
  prereq: ['momentum-principle', 'pressure-definition', 'continuity-equation'],
  related: ['water-hammer', 'water-supply', 'hoses-fittings', 'force-on-plane-surface', 'jet-forces'],
  body: `
### Where the force comes from
Draw a control volume round the water in a bend that turns the flow through an angle θ, with the same bore at both ends. On the inlet face the upstream water pushes in with $p_1A$; on the outlet face the downstream water pushes back with $p_2A$; and the flow changes direction, which takes a force $\\rho Q(\\vec V_2 - \\vec V_1)$. The bend supplies the difference. For equal pressures and areas, the force of the water **on the bend** is

$$R = 2\\,(pA + \\rho Q V)\\sin\\frac{\\theta}{2}$$

directed outwards along the bisector of the bend: the bend tries to straighten itself and move towards the outside of the curve.

The two terms are very unequal in a water main. For a 600 mm main at 10 bar and 1.5 m/s:

| Term | Value |
|---|---|
| Pressure force $pA$ | $10^6 \\times 0.283 = 283$ kN |
| Momentum flux $\\rho Q V$ | $1000 \\times 0.424 \\times 1.5 = 0.64$ kN |
| Resultant on a 90° bend | $2 \\times 283.4 \\times \\sin 45^\\circ = 401$ kN — about 41 tonnes |

The momentum term is a fifth of a per cent; it matters only in fast lines, nozzles and jets. The pressure term is there even with **no flow at all**, and it is greatest during the pressure test — often 1.5 times the working pressure — and during surges.

### Other fittings
- **A closed end, a shut valve, a blank flange, or the branch of a tee**: $F = pA$ along the axis.
- **A reducer**: the axial force is $p_1A_1 - p_2A_2$ plus a small momentum term $\\rho Q(V_1 - V_2)$; it pushes towards the smaller end.
- **Vertical bends**: an upward thrust at a crest must be held down by the weight of a **gravity block**; a downward thrust at a sag bears on the ground below.

### Holding it
Push-fit joints — spigot and socket sealed by a rubber ring — resist almost no pull, so an unrestrained bend is pushed out of line until a joint opens. Two remedies:

1. A **thrust block**: concrete cast between the fitting and undisturbed ground, with a bearing area $A_b = R/\\sigma_\\text{soil}$. Allowable bearing pressures run from around 50 kPa in soft clay to 300 kPa or more in dense gravel, and much more in rock; the site's geotechnical data decide. The 401 kN bend above needs about 2.7 m² against 150 kPa ground — and 4 m² for a 15 bar test.
2. **Restrained joints** — welded steel, flanges, or mechanically restrained ductile-iron and polyethylene joints — over a calculated length each side, so that friction between the pipe and the soil carries the thrust.

> [!warn] Never pressure-test a main before its thrust blocks have cured or its restraints are complete, and never dig beside a live bend, tee or dead end: the ground may be all that holds it. A fitting that moves under pressure releases the water all at once and can throw pipe and soil. Isolate and depressurise a line — allowing for pressure trapped between closed valves — before any work on it.

In oil hydraulics the same forces act on hoses and fittings: a 1-inch (25 mm bore) hose at 350 bar carries an end force of about 17 kN, which the crimped fitting must hold; a fitting that blows off lets the hose whip violently and sprays oil that can be injected through the skin (see [[hoses-fittings]]).
`,
  ideas: [
    'A bend is pushed outwards along its bisector with R = 2(pA + ρQV) sin(θ/2).',
    'In water mains the pressure term pA is hundreds of times larger than the momentum term.',
    'The thrust exists with no flow and is largest during pressure tests and surges.',
    'Closed ends, tees and reducers are pushed along the axis by the unbalanced pressure force.',
    'Thrust blocks spread the force onto undisturbed ground; restrained joints hand it to the soil along the pipe.'
  ],
  pitfalls: [
    'No flow, no force — The pressure forces on a bend or closed end act whenever the line is under pressure; flow adds only a little.',
    'The force on a bend acts along the incoming pipe — It acts along the bisector of the bend, outwards, and grows with sin(θ/2).',
    'Rubber-ring joints hold pipes together — They seal but barely resist pull; without blocks or restraint the fittings move.'
  ],
  formulas: [
    {
      name: 'Resultant force on a bend (equal bores)',
      expr: 'R = 2*(p + rho*V^2)*pi*D^2/4*sin(theta/2)', tex: 'R = 2\\,(p + \\rho V^2)\\,\\dfrac{\\pi D^2}{4}\\,\\sin\\dfrac{\\theta}{2}',
      vars: {
        R: { name: 'resultant force on the bend', q: 'force', unit: 'kN' },
        p: { name: 'pressure in the pipe (gauge)', q: 'pressure', unit: 'bar', value: 10 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 600 },
        theta: { name: 'deflection of the bend', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'pA + ρQV = (p + ρV²)A. Horizontal bend, same bore and (nearly) the same pressure at both ends; the force points outwards along the bisector. Use the test or surge pressure for design.',
      practice: { unknowns: ['R', 'p', 'theta'] },
      stories: {
        R: 'A {D} main at {p} carrying water at {V} turns through {theta}. What force does the water put on the bend?',
        p: 'The thrust block of a {theta} bend on a {D} main can hold {R}. Up to what pressure may the line be tested (water at {V})?'
      }
    },
    {
      name: 'Thrust on a closed end or tee',
      expr: 'F = p*pi*D^2/4', tex: 'F = p\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'axial thrust', q: 'force', unit: 'kN' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 10 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 600 }
      },
      note: 'A blank flange, a closed valve at the end of a line, the branch of a tee, or the end fitting of a hose.',
      stories: { F: 'A {D} line at {p} ends in a closed valve. What thrust acts on the valve?', D: 'An anchor can take {F}. What is the largest bore that can be dead-ended against it at {p}?' }
    },
    {
      name: 'Axial force on a reducer',
      expr: 'F = p1*pi*D1^2/4 - p2*pi*D2^2/4 + rho*Q^2*4/pi*(1/D1^2 - 1/D2^2)',
      tex: 'F = p_1\\dfrac{\\pi D_1^2}{4} - p_2\\dfrac{\\pi D_2^2}{4} + \\dfrac{4\\rho Q^2}{\\pi}\\left(\\dfrac{1}{D_1^2} - \\dfrac{1}{D_2^2}\\right)',
      vars: {
        F: { name: 'force of the water on the reducer (towards the small end)', q: 'force', unit: 'kN', signed: true },
        p1: { name: 'pressure at the large end (gauge)', q: 'pressure', unit: 'bar', value: 10 },
        D1: { name: 'large bore', q: 'length', unit: 'mm', value: 400 },
        p2: { name: 'pressure at the small end (gauge)', q: 'pressure', unit: 'bar', value: 9.9 },
        D2: { name: 'small bore', q: 'length', unit: 'mm', value: 300 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/s', value: 200 }
      },
      note: 'From the momentum equation with V = 4Q/(πD²). The last term is ρQ(V₁ − V₂), negative for a contraction.',
      practice: { unknowns: ['F'] },
      stories: { F: 'A reducer from {D1} to {D2} carries {Q} with {p1} at the large end and {p2} at the small end. What axial force does the water exert on it?' }
    },
    {
      name: 'Bearing area of a thrust block',
      expr: 'Ab = R/sb', tex: 'A_b = \\dfrac{R}{\\sigma_s}',
      vars: {
        Ab: { name: 'bearing area against the ground', q: 'area', unit: 'm²', tex: 'A_b' },
        R: { name: 'thrust to resist', q: 'force', unit: 'kN', value: 401 },
        sb: { name: 'allowable bearing pressure of the ground', q: 'pressure', unit: 'kPa', value: 150, tex: '\\sigma_s' }
      },
      note: 'The allowable bearing pressure comes from the site\'s geotechnical data; codes add safety factors and limit the block\'s position against undisturbed ground.',
      stories: { Ab: 'A bend pushes with {R} against ground that can safely carry {sb}. What bearing area must the thrust block have?' }
    }
  ],
  examples: [
    {
      title: 'A 90° bend on a large main',
      q: 'A 600 mm water main works at 10 bar with 1.5 m/s and is tested at 15 bar. What force acts on a 90° bend, and what bearing area does its block need against 150 kPa ground?',
      steps: [
        '$A = \\pi \\times 0.6^2/4 = 0.283$ m². Working: $pA = 283$ kN; $\\rho Q V = \\rho A V^2 = 0.64$ kN.',
        '$R = 2 \\times 283.4 \\times \\sin 45^\\circ = 401$ kN.',
        'Test (no flow): $R = 2 \\times 1.5\\times10^6 \\times 0.283 \\times \\sin 45^\\circ = 600$ kN.',
        'Block: $A_b = 600/150 = 4.0$ m² — for example 2.0 m × 2.0 m of bearing face.'
      ],
      a: 'About 400 kN in service and 600 kN on test; the block needs about 4 m² of bearing.'
    },
    {
      title: 'A 45° bend on a fire main',
      q: 'A 150 mm fire main runs at 12 bar with water at 3 m/s. What is the force on a 45° bend?',
      steps: [
        '$A = 0.01767$ m²; $pA = 21.2$ kN; $\\rho A V^2 = 0.16$ kN.',
        '$R = 2 \\times 21.37 \\times \\sin 22.5^\\circ = 16.4$ kN.'
      ],
      a: 'About 16 kN — more than a tonne and a half, outwards along the bisector.'
    }
  ],
  quiz: [
    { q: 'The pressure in a main is doubled, the flow unchanged. The force on a bend…', choices: ['stays nearly the same', 'nearly doubles', 'quadruples', 'halves'], a: 1,
      why: 'R = 2(pA + ρQV) sin(θ/2), and pA dominates in water mains.' },
    { q: 'For a 600 mm bend at 10 bar with water at 1.5 m/s, the momentum part of the force is about…', choices: ['0.2 %', '2 %', '20 %', '50 %'], a: 0,
      why: 'ρQV = 0.64 kN against pA = 283 kN: about 0.2 %.' },
    { q: 'A bend at the end of a line whose valve is shut carries no thrust, because the water is not moving.', a: false,
      why: 'The pressure forces act with or without flow; the static thrust is almost the whole of it.' },
    { q: 'In which direction does the water push on a horizontal bend?', choices: ['along the incoming pipe', 'along the outgoing pipe', 'outwards, along the bisector of the bend', 'inwards, towards the centre of the curve'], a: 2,
      why: 'The two face forces and the momentum change add to a resultant along the bisector, towards the outside of the curve.' },
    { q: 'What thrust acts on a closed 200 mm valve at the end of a line at 16 bar?', answer: 50.3, unit: 'kN', tol: 0.02,
      why: 'F = pA = 1.6×10⁶ × π × 0.2²/4 = 50.3 kN — about five tonnes.' }
  ],
  applications: ['Thrust blocks and restrained joints at bends, tees, reducers and dead ends of water and fire mains.', 'Anchor blocks on penstocks, where steep pipes also carry their weight downhill.', 'Pipe supports in plant and on ships, sized for pressure thrust.', 'Hose end fittings and whip restraints in hydraulic and high-pressure water systems.'],
  sim: 'flow-bend'
},

{
  id: 'torricelli', parent: 'momentum-forces', title: 'Torricelli: draining a tank', level: 2,
  short: 'Liquid leaves a hole at the speed it would gain falling from the free surface: V = √(2gh). With the discharge coefficient of a real orifice (about 0.61 for a sharp edge) the same law tells how long a tank takes to empty — and why the last part takes longest.',
  keywords: ['Torricelli', 'efflux', 'orifice', 'discharge coefficient', 'Cd', 'vena contracta', 'coefficient of contraction', 'coefficient of velocity', 'draining time', 'emptying a tank', 'water clock', 'clepsydra', 'jet trajectory'],
  prereq: ['energy-equation', 'continuity-equation', 'physics:free-fall'],
  related: ['orifice-equation', 'orifice-plate', 'jet-forces', 'weirs-flumes', 'siphons', 'math:separable-equations', 'math:differential-equations'],
  body: `
### The speed of the jet
Apply the [[energy-equation]] from the free surface of a large open tank — atmospheric pressure, negligible velocity, a height $h$ above the hole — to the jet just outside the hole, also at atmospheric pressure. Everything cancels except

$$V = \\sqrt{2 g h}$$

— the speed of a stone dropped from the free surface. Torricelli found it by experiment in the 1640s, long before energy was a concept. A hole 5 m below the surface squirts at 9.9 m/s, whatever the liquid.

### Real openings: $C_c$, $C_v$ and $C_d$
Two corrections turn the ideal into the real:
- **Contraction.** Liquid approaching a sharp-edged hole from all sides cannot turn the corner at once, so the jet goes on narrowing for about half a diameter beyond the hole. Its narrowest section, the **vena contracta**, has only $C_c \\approx 0.61$–0.64 of the hole's area.
- **Friction.** The jet is slightly slower than ideal: $V = C_v\\sqrt{2gh}$ with $C_v \\approx 0.97$–0.99.

Together, $Q = C_d\\,a\\sqrt{2gh}$ with the **discharge coefficient** $C_d = C_c C_v$:

| Opening | $C_d$ (typical) |
|---|---|
| Sharp-edged orifice in a thin wall | 0.60–0.62 |
| Short external tube, 2–3 diameters long | about 0.82 |
| Re-entrant (Borda) tube, running free | about 0.5 |
| Well-rounded, bell-mouthed entry | 0.95–0.99 |

A tank under gas pressure behaves as though its head were larger by $p/\\rho g$ — and in that form the law is the [[orifice-equation]] of every hydraulic valve.

### Draining a tank
As the tank empties, $h$ falls and so does the outflow. [[continuity-equation|Continuity]] for a tank of plan area $A_t$ gives a differential equation,

$$A_t\\,\\frac{dh}{dt} = -\\,C_d\\,a\\,\\sqrt{2gh}$$

which separates and integrates (see [[math:separable-equations]]) to a strikingly simple result: **$\\sqrt{h}$ falls linearly with time**. The time to fall from $h_1$ to $h_2$ is

$$t = \\frac{A_t}{C_d\\,a}\\sqrt{\\frac{2}{g}}\\left(\\sqrt{h_1} - \\sqrt{h_2}\\right)$$

and to empty completely from a depth $h$,

$$t = \\frac{A_t}{C_d\\,a}\\sqrt{\\frac{2h}{g}}$$

This is exactly **twice** the time the same volume would take at the initial rate of outflow: the last part drains slowly because little head is left to drive it. A 2 m diameter tank holding 3 m of water, emptied through a 50 mm sharp-edged hole, takes 34 minutes — and the first half of its water leaves in only 10 of them.

For tanks whose plan area changes with depth — cones, spheres, horizontal cylinders — $A_t(h)$ goes inside the integral. The ancient water clock turned the problem round: a vessel whose radius grows as $h^{1/4}$ drains with its level falling at a steady rate.

### The jet's path
A horizontal jet from a hole a height $y$ above the floor lands a distance $x = 2C_v\\sqrt{h\\,y}$ away. From a tall tank standing on the floor, a hole half-way up throws farthest, and holes equally far above and below the middle land at the same spot.

> [!warn] Draining a closed tank with a blocked vent can crush it: the pressure inside falls as the liquid leaves. Open tanks, pits and sumps being drained are drowning and confined-space hazards — never enter one without a permit, a tested atmosphere and a standby person.
`,
  ideas: [
    'A jet leaves a hole at V = √(2gh), the free-fall speed from the surface.',
    'A sharp-edged hole passes only about 61 % of the ideal flow, mostly because the jet contracts.',
    'Draining through a hole, √h falls linearly with time.',
    'Emptying takes twice as long as it would at the initial outflow rate; the last part is the slowest.',
    'The same law, with pressure as head, is the orifice equation of every valve and restrictor.'
  ],
  pitfalls: [
    'Doubling the depth doubles the outflow — The outflow grows with √h: four times the depth doubles it.',
    'A hole passes its full area at the ideal speed — The jet contracts to about 61–64 % of a sharp-edged hole\'s area; C_d ≈ 0.61 accounts for it.',
    'A tank drains at a steady rate — The rate falls with the square root of the depth; the second half of the depth takes 2.4 times as long as the first.'
  ],
  formulas: [
    {
      name: 'Torricelli\'s jet speed',
      expr: 'V = Cv*sqrt(2*g*h)', tex: 'V = C_v\\sqrt{2 g h}',
      vars: {
        V: { name: 'jet speed', q: 'speed', unit: 'm/s' },
        Cv: { name: 'velocity coefficient', value: 0.98, min: 0.5, max: 1, tex: 'C_v' },
        g: { const: 'g' },
        h: { name: 'depth of the hole below the surface', q: 'length', unit: 'm', value: 5 }
      },
      note: 'C_v ≈ 0.97–0.99 for a sharp-edged or rounded hole; 1 for the ideal. For a pressurised tank add p/ρg to h.',
      stories: { V: 'How fast does water leave a hole {h} below the surface of a tank ({Cv})?', h: 'A jet leaves a tank at {V}. How far below the surface is the hole?' }
    },
    {
      name: 'Flow from an orifice under a head',
      expr: 'Q = Cd*pi*d^2/4*sqrt(2*g*h)', tex: 'Q = C_d\\,\\dfrac{\\pi d^2}{4}\\,\\sqrt{2 g h}',
      vars: {
        Q: { name: 'outflow', q: 'flowrate', unit: 'L/s' },
        Cd: { name: 'discharge coefficient', value: 0.61, min: 0.3, max: 1, tex: 'C_d' },
        d: { name: 'hole diameter', q: 'length', unit: 'mm', value: 50 },
        g: { const: 'g' },
        h: { name: 'head over the hole', q: 'length', unit: 'm', value: 3 }
      },
      note: 'C_d ≈ 0.61 sharp-edged, 0.82 short tube, 0.97 well rounded.',
      practice: { unknowns: ['Q', 'd', 'h'] },
      stories: {
        Q: 'Water drains through a {d} hole ({Cd}) under a head of {h}. What is the flow?',
        d: 'What diameter of hole ({Cd}) passes {Q} under a head of {h}?'
      }
    },
    {
      name: 'Time for the level to fall from h₁ to h₂',
      expr: 't = 4*At/(Cd*pi*d^2)*sqrt(2/g)*(sqrt(h1) - sqrt(h2))',
      tex: 't = \\dfrac{4A_t}{C_d\\,\\pi d^2}\\sqrt{\\dfrac{2}{g}}\\left(\\sqrt{h_1} - \\sqrt{h_2}\\right)',
      vars: {
        t: { name: 'time', q: 'time', unit: 'min' },
        At: { name: 'plan area of the tank', q: 'area', unit: 'm²', value: 3.14, tex: 'A_t' },
        Cd: { name: 'discharge coefficient', value: 0.61, min: 0.3, max: 1, tex: 'C_d' },
        d: { name: 'hole diameter', q: 'length', unit: 'mm', value: 50 },
        g: { const: 'g' },
        h1: { name: 'starting depth over the hole', q: 'length', unit: 'm', value: 3, tex: 'h_1' },
        h2: { name: 'final depth over the hole', q: 'length', unit: 'm', value: 1, tex: 'h_2' }
      },
      note: 'A tank with vertical sides and no inflow. With h₂ = 0 it gives the time to empty.',
      practice: { unknowns: ['t', 'h2'] },
      stories: {
        t: 'A tank of plan area {At} drains through a {d} hole ({Cd}). How long does its level take to fall from {h1} to {h2}?',
        h2: 'A tank of {At}, draining through a {d} hole ({Cd}), starts {h1} deep. What depth is left after {t}?'
      }
    },
    {
      name: 'Time to empty a tank',
      expr: 't = 4*At/(Cd*pi*d^2)*sqrt(2*h/g)', tex: 't = \\dfrac{4A_t}{C_d\\,\\pi d^2}\\sqrt{\\dfrac{2h}{g}}',
      vars: {
        t: { name: 'time to empty', q: 'time', unit: 'min' },
        At: { name: 'plan area of the tank', q: 'area', unit: 'm²', value: 3.14, tex: 'A_t' },
        Cd: { name: 'discharge coefficient', value: 0.61, min: 0.3, max: 1, tex: 'C_d' },
        d: { name: 'hole diameter', q: 'length', unit: 'mm', value: 50 },
        g: { const: 'g' },
        h: { name: 'starting depth over the hole', q: 'length', unit: 'm', value: 3 }
      },
      note: 'Twice the time the same volume would take at the initial outflow.',
      practice: { unknowns: ['t', 'd'] },
      stories: {
        t: 'A tank of plan area {At} holds {h} of water above a {d} outlet ({Cd}). How long does it take to empty?',
        d: 'A tank of {At}, filled to {h}, must empty in {t} through an outlet with {Cd}. What diameter does the outlet need?'
      }
    }
  ],
  examples: [
    {
      title: 'Emptying a tank',
      q: 'A tank 2 m in diameter holds 3 m of water above a 50 mm sharp-edged hole ($C_d = 0.61$). Find the initial outflow, the time to empty and the time to lose half the water.',
      steps: [
        '$A_t = \\pi \\times 2^2/4 = 3.14$ m²; $a = \\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m².',
        'Initial outflow: $Q = 0.61 \\times 1.963\\times10^{-3} \\times \\sqrt{2 \\times 9.81 \\times 3} = 9.19$ L/s.',
        'Time to empty: $t = \\dfrac{3.14}{0.61 \\times 1.963\\times10^{-3}}\\sqrt{2 \\times 3/9.81} = 2623 \\times 0.782 = 2051$ s $= 34.2$ min.',
        'At a steady 9.19 L/s the 9.42 m³ would take 1025 s: exactly half as long.',
        'Half the water is gone when $h = 1.5$ m: $t = 2623\\sqrt{2/9.81}\\,(\\sqrt3 - \\sqrt{1.5}) = 600$ s $= 10$ min.'
      ],
      a: '9.2 L/s at first; 34 minutes to empty, of which the first half of the water takes only 10.'
    },
    {
      title: 'Sizing an outlet',
      q: 'A 20 m³ storm tank, 10 m² in plan and 2 m deep, must empty in 30 minutes through a well-rounded outlet ($C_d = 0.95$). What outlet diameter is needed?',
      steps: [
        'Rearrange: $a = \\dfrac{A_t}{C_d\\,t}\\sqrt{\\dfrac{2h}{g}} = \\dfrac{10}{0.95 \\times 1800}\\sqrt{\\dfrac{4}{9.81}} = 3.73\\times10^{-3}$ m².',
        '$d = \\sqrt{4a/\\pi} = 0.069$ m.'
      ],
      a: 'About 69 mm; a 75 mm outlet gives a margin.'
    }
  ],
  quiz: [
    { q: 'The depth of water over an orifice is quadrupled. The outflow…', choices: ['quadruples', 'doubles', 'rises √2 times', 'is unchanged'], a: 1,
      why: 'Q ∝ √h: four times the head, twice the flow.' },
    { q: 'Draining the lower half of a tank\'s depth takes as long as draining the upper half.', a: false,
      why: 'Time ∝ √h₁ − √h₂: from h to h/2 takes 0.29 of the total, from h/2 to 0 takes 0.71 — about 2.4 times longer.' },
    { q: 'How fast does water leave a hole 2 m below the free surface (ideal)?', answer: 6.26, unit: 'm/s', tol: 0.02,
      why: 'V = √(2gh) = √(2 × 9.81 × 2) = 6.26 m/s.' },
    { q: 'Why is the discharge coefficient of a sharp-edged orifice only about 0.61?', choices: ['friction slows the jet to 61 % of its ideal speed', 'the jet contracts to about 61–64 % of the hole\'s area', 'air is drawn into the jet', 'the pressure in the jet is below atmospheric'], a: 1,
      why: 'C_v is about 0.98, so almost all of the loss is contraction: the vena contracta has only about 0.62 of the hole\'s area.' },
    { q: 'A tank\'s plan area is doubled; the hole and the starting depth are unchanged. The time to empty…', choices: ['halves', 'is unchanged', 'doubles', 'rises √2 times'], a: 2,
      why: 't ∝ A_t: twice the water at every depth, the same outflow.' }
  ],
  problems: [
    { q: 'A water barrel 0.6 m in diameter holds 0.9 m of water above a 20 mm sharp-edged tap hole ($C_d = 0.62$). How many minutes does it take to empty?', answer: 10.4, unit: 'min', tol: 0.03,
      steps: ['$A_t = 0.2827$ m², $a = 3.14\\times10^{-4}$ m².', '$t = \\dfrac{0.2827}{0.62 \\times 3.14\\times10^{-4}}\\sqrt{2 \\times 0.9/9.81} = 1452 \\times 0.428 = 622$ s $= 10.4$ min.'] }
  ],
  applications: ['Emptying times of tanks, ponds, locks and swimming pools.', 'Sizing outlets of stormwater detention tanks.', 'Leak rates from holes in pressurised tanks and pipes.', 'The orifice equation behind every hydraulic throttle, jet and restrictor.'],
  history: 'Evangelista Torricelli, a pupil of Galileo, published the law in 1644 in his work on the motion of heavy bodies, reasoning that a jet turned upwards would rise to the level of the water in the tank. Water clocks that worked by draining vessels had been used in Egypt, Greece and China for thousands of years.',
  sim: 'flow-tank'
},

/* ================================================================ MEASURING FLOW */
{
  id: 'venturi-meter', parent: 'flow-measurement', title: 'The venturi meter', level: 2,
  short: 'A smooth contraction and a gentle re-expansion in a pipe: the pressure drop into the throat, read on a manometer or a transmitter, gives the flow through continuity and Bernoulli. Accurate (C_d ≈ 0.98–0.995) and sparing of energy, at the price of length and cost.',
  keywords: ['venturi meter', 'venturi tube', 'throat', 'beta ratio', 'diameter ratio', 'differential pressure', 'discharge coefficient', 'manometer', 'U-tube', 'ISO 5167', 'permanent pressure loss', 'diffuser', 'velocity of approach', 'Herschel'],
  prereq: ['energy-equation', 'continuity-equation', 'manometers'],
  related: ['orifice-plate', 'pitot-static-water', 'flowmeters', 'cavitation', 'minor-losses', 'aerodynamics:bernoulli'],
  body: `
### How it works
A venturi tube has three parts: a **convergent cone** (about 21° included angle) that speeds the flow up; a short cylindrical **throat** of diameter $d$; and a long **divergent cone** (7–15°) that slows it down again and recovers most of the pressure. The pressure is tapped in the upstream pipe and in the throat, usually through several holes feeding an annular chamber so that irregularities average out.

Between the inlet (1) and the throat (2), continuity gives $V_2 = V_1/\\beta^2$ with the **diameter ratio** $\\beta = d/D$, and Bernoulli gives $p_1 - p_2 = \\tfrac12\\rho(V_2^2 - V_1^2)$. Solved for the flow:

$$Q = C_d\\,\\frac{\\pi d^2}{4}\\sqrt{\\frac{2\\,\\Delta p}{\\rho\\,(1 - \\beta^4)}}$$

The factor $1/\\sqrt{1-\\beta^4}$, the **velocity-of-approach factor**, allows for the speed the liquid already has in the pipe. $C_d$ takes up the small friction loss and the non-uniform profile: for a well-made classical venturi tube it is 0.98–0.995, known to about ±1 % without calibrating the individual meter. ISO 5167-4 (first published in 2003) fixes the geometry, the coefficients and their uncertainty, and the straight pipe needed upstream.

### Reading it with a manometer
Connect the two tappings to a U-tube partly filled with a heavier liquid of density $\\rho_m$ that does not mix with water. The difference in its levels, $\\Delta h$, gives

$$\\Delta p = (\\rho_m - \\rho)\\,g\\,\\Delta h$$

The connecting tubes are full of the flowing liquid, so its weight is subtracted (see [[manometers]]). With mercury under water ($\\rho_m - \\rho = 12\\,550$ kg/m³) each millimetre of reading is 123 Pa; a lighter manometer liquid gives a longer, more readable column for the same flow. Modern installations use a differential-pressure transmitter instead, but the principle — and the square root — are the same.

### The square root, and the pressure loss
Flow goes as $\\sqrt{\\Delta p}$: at a tenth of full-scale flow the differential is a hundredth of full scale. One transmitter therefore covers a flow range of only about 3 or 4 to 1 with good accuracy.

What makes the venturi worth its length is its small **permanent pressure loss**. The divergent cone recovers most of the drop into the throat; only about 5–20 % of $\\Delta p$ is lost for good (less with a gentler cone), against 40–90 % for an [[orifice-plate]]. On a large main running all year, the pumping energy saved pays for the meter.

| | Venturi tube | Orifice plate | Flow nozzle |
|---|---|---|---|
| Discharge coefficient | 0.98–0.995 | about 0.60–0.62 | 0.93–0.99 |
| Permanent loss, fraction of $\\Delta p$ | 5–20 % | 40–90 % | 30–80 % |
| Length and cost | long, expensive | a thin plate, cheap | short, moderate |
| Dirty liquids and slurries | good | poor: deposits and wear | fair |

> [!note] The throat is the point of lowest pressure. If its absolute pressure falls towards the vapour pressure the liquid cavitates, the reading is wrong and the meter is damaged: choose the throat so that it cannot (see [[cavitation]]).
`,
  ideas: [
    'A venturi converts pressure into speed in its throat; the pressure drop measures the flow.',
    'Q = C_d A₂ √(2Δp / (ρ(1 − β⁴))), with C_d ≈ 0.98–0.995 for a classical venturi tube.',
    'A U-tube manometer reads Δp = (ρ_m − ρ) g Δh.',
    'Flow varies as √Δp, so a single differential range covers only about 3–4 : 1 in flow.',
    'The diffuser recovers most of the pressure: only 5–20 % of Δp is lost for good.'
  ],
  pitfalls: [
    'The pressure lost to the system equals the throat reading — Most of the throat drop is recovered in the diffuser; the permanent loss is only a fraction of it.',
    'Twice the reading means twice the flow — The flow goes as the square root of the differential: twice the reading is only 1.41 times the flow.',
    'The manometer reads Δp = ρ_m g Δh — The tubes above the manometer liquid are full of the flowing liquid, so its density must be subtracted: (ρ_m − ρ) g Δh.'
  ],
  formulas: [
    {
      name: 'Flow through a venturi meter',
      expr: 'Q = Cd*pi*d^2/4*sqrt(2*dp/(rho*(1 - (d/D)^4)))',
      tex: 'Q = C_d\\,\\dfrac{\\pi d^2}{4}\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho\\left(1 - (d/D)^4\\right)}}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'L/s' },
        Cd: { name: 'discharge coefficient', value: 0.98, min: 0.9, max: 1, tex: 'C_d' },
        d: { name: 'throat diameter', q: 'length', unit: 'mm', value: 150 },
        D: { name: 'pipe diameter', q: 'length', unit: 'mm', value: 300 },
        dp: { name: 'differential pressure p₁ − p₂', q: 'pressure', unit: 'kPa', value: 14.8, tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' }
      },
      note: 'd/D = β, typically 0.3–0.75. Classical venturi tubes: C_d ≈ 0.98–0.995 at pipe Reynolds numbers above about 2×10⁵.',
      practice: { unknowns: ['Q', 'dp'] },
      stories: {
        Q: 'A venturi meter with a {d} throat in a {D} pipe ({Cd}) shows a differential of {dp} on a liquid of density {rho}. What is the flow?',
        dp: 'A venturi meter with a {d} throat in a {D} pipe ({Cd}) carries {Q} of a liquid of density {rho}. What differential does it show?'
      }
    },
    {
      name: 'Differential U-tube manometer',
      expr: 'dp = (rhom - rho)*g*dh', tex: '\\Delta p = (\\rho_m - \\rho)\\,g\\,\\Delta h',
      vars: {
        dp: { name: 'differential pressure', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        rhom: { name: 'density of the manometer liquid', q: 'density', unit: 'kg/m³', value: 13546, tex: '\\rho_m' },
        rho: { name: 'density of the flowing liquid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        dh: { name: 'difference in manometer levels', q: 'length', unit: 'mm', value: 120, tex: '\\Delta h' }
      },
      note: 'Mercury: 13 546 kg/m³ at 20 °C. The tubes between pipe and manometer must be full of the flowing liquid, with no air.',
      stories: {
        dp: 'A U-tube holding a liquid of density {rhom} under water ({rho}) reads {dh}. What is the differential pressure?',
        dh: 'A differential of {dp} is read on a U-tube of liquid of density {rhom} under a liquid of density {rho}. How far apart are its levels?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a venturi',
      q: 'A venturi meter with a 150 mm throat sits in a 300 mm water main ($C_d$ = 0.98). Its mercury manometer reads 120 mm. What is the flow?',
      steps: [
        '$\\Delta p = (13\\,546 - 1000) \\times 9.81 \\times 0.120 = 14.8$ kPa.',
        '$\\beta = 0.5$, $1 - \\beta^4 = 0.9375$; throat area $0.01767$ m².',
        '$Q = 0.98 \\times 0.01767 \\times \\sqrt{2 \\times 14\\,770/(1000 \\times 0.9375)} = 0.01732 \\times 5.61 = 0.0972$ m³/s.',
        'Throat velocity 5.5 m/s; pipe velocity 1.4 m/s. With a 15° diffuser about 12 % of Δp, 1.8 kPa, is lost for good.'
      ],
      a: 'About 97 L/s (350 m³/h).'
    },
    {
      title: 'Choosing the manometer',
      q: 'The same meter must read up to 200 L/s. How long must the mercury manometer be, and what would it read at 50 L/s?',
      steps: [
        'Throat speed at full flow: $Q/(C_d A_2) = 0.2/(0.98 \\times 0.01767) = 11.55$ m/s.',
        '$\\Delta p = \\tfrac12\\rho(1 - \\beta^4)(11.55)^2 = 62.5$ kPa, so $\\Delta h = 62\\,500/(12\\,546 \\times 9.81) = 0.508$ m.',
        'At a quarter of the flow the reading is a sixteenth: 32 mm — hard to read accurately, the square-root problem.'
      ],
      a: 'A manometer at least 0.51 m tall; at 50 L/s it reads only about 32 mm.'
    }
  ],
  quiz: [
    { q: 'The flow through a venturi meter doubles. Its differential pressure…', choices: ['doubles', 'rises four times', 'rises √2 times', 'stays the same'], a: 1,
      why: 'Δp ∝ Q²: the throat velocity doubles, and the pressure drop goes with its square.' },
    { q: 'A venturi meter\'s permanent pressure loss equals the difference between its inlet and throat pressures.', a: false,
      why: 'The diffuser recovers most of that drop. Only 5–20 % of it is lost for good.' },
    { q: 'A mercury manometer under water reads 50 mm. What is the differential pressure?', answer: 6.15, unit: 'kPa', tol: 0.02,
      why: 'Δp = (13 546 − 1000) × 9.81 × 0.05 = 6150 Pa.' },
    { q: 'What does the factor 1 − β⁴ in the venturi equation account for?', choices: ['friction in the throat', 'the velocity the liquid already has in the upstream pipe', 'the manometer liquid', 'compressibility'], a: 1,
      why: 'Bernoulli gives Δp = ½ρ(V₂² − V₁²) = ½ρV₂²(1 − β⁴): the upstream velocity is not zero.' },
    { q: 'Which differential meter has a discharge coefficient closest to 1?', choices: ['an orifice plate', 'a venturi tube', 'a sharp-edged hole in a tank wall', 'a Borda mouthpiece'], a: 1,
      why: 'Its smooth convergent makes no vena contracta; C_d is about 0.98–0.995. The orifice plate and the sharp-edged hole are near 0.61.' }
  ],
  problems: [
    { q: 'A venturi with a 100 mm throat in a 200 mm water pipe ($C_d$ = 0.985) shows a differential of 20 kPa. What is the flow in L/s?', answer: 50.5, unit: 'L/s', tol: 0.02,
      steps: ['$A_2 = 7.854\\times10^{-3}$ m², $1 - \\beta^4 = 0.9375$.', '$Q = 0.985 \\times 7.854\\times10^{-3}\\sqrt{2 \\times 20\\,000/(1000 \\times 0.9375)} = 7.736\\times10^{-3} \\times 6.53 = 0.0505$ m³/s $= 50.5$ L/s.'] }
  ],
  applications: ['Metering large water and wastewater mains, where the low permanent loss saves energy.', 'Slurries and dirty water, which foul orifice plates.', 'Carburettors, ejectors, jet pumps and venturi scrubbers, which use the throat suction on purpose.', 'Measuring air flow into engines and ventilation ducts.'],
  history: 'Giovanni Battista Venturi described the fall of pressure in a contracting tube and its recovery in 1797. Clemens Herschel, an American water engineer, turned it into a meter in the late 1880s and named it after Venturi; his long tubes measured the water supplies of American cities.',
  sim: 'flow-venturi'
},

{
  id: 'orifice-plate', parent: 'flow-measurement', title: 'Orifice plates and nozzles', level: 2,
  short: 'A thin plate with a sharp-edged hole, clamped between flanges: the cheapest and most standardised flowmeter. The jet contracts to a vena contracta, so its coefficient is about 0.6, and most of the pressure drop is never recovered. Flow nozzles sit between the orifice and the venturi.',
  keywords: ['orifice plate', 'orifice meter', 'flange tappings', 'corner tappings', 'D and D/2 tappings', 'beta ratio', 'discharge coefficient', 'vena contracta', 'Reader-Harris/Gallagher', 'flow nozzle', 'ISA 1932 nozzle', 'permanent pressure loss', 'turndown', 'restriction orifice', 'ISO 5167'],
  prereq: ['venturi-meter', 'torricelli', 'reynolds-number-pipes'],
  related: ['orifice-equation', 'flow-control', 'flowmeters', 'pitot-static-water', 'minor-losses', 'cavitation'],
  body: `
### A hole in a plate
An orifice meter is a stainless-steel plate a few millimetres thick with a precisely machined, square-edged, concentric hole of diameter $d$, clamped between two flanges. The liquid funnels through the hole and, unable to turn the sharp corner, goes on contracting to a **vena contracta** about half a pipe diameter downstream before re-expanding turbulently to fill the pipe. The pressure is tapped just upstream and downstream, in one of three standard arrangements: **corner tappings** at the plate faces, **flange tappings** 25.4 mm either side, or **D and D/2 tappings**.

The flow equation has the venturi's form,

$$Q = C\\,\\frac{\\pi d^2}{4}\\sqrt{\\frac{2\\,\\Delta p}{\\rho\\,(1 - \\beta^4)}}, \\qquad \\beta = \\frac{d}{D}$$

but the coefficient is much smaller — **C ≈ 0.60–0.62** — mostly because of the contraction. It depends a little on β, the Reynolds number and the tapping positions. ISO 5167-2 (first published in 2003) gives it through the Reader-Harris/Gallagher equation, with an uncertainty of about 0.5 % for a plate made and installed to the standard: a cheap, replaceable part whose behaviour is known from its dimensions alone, without calibration. That is the orifice plate's great strength. Diameter ratios between 0.2 and 0.75 are usual.

### The price: permanent pressure loss
Most of the kinetic energy of the jet is destroyed in the eddies beyond the vena contracta. The fraction of the measured differential lost for good is, from ISO 5167-2,

$$\\frac{\\Delta p_\\text{loss}}{\\Delta p} = \\frac{\\sqrt{1 - \\beta^4(1 - C^2)} - C\\beta^2}{\\sqrt{1 - \\beta^4(1 - C^2)} + C\\beta^2} \\approx 1 - \\beta^{1.9}$$

— 73 % at β = 0.5 and 63 % at β = 0.6. A meter reading 25 kPa on 190 m³/h of water throws away about 16 kPa: some 0.8 kW, every hour of the year, around 7000 kWh a year. On large lines that run continuously, this is why venturis or meters with no obstruction win (see [[flowmeters]]).

### Using it well
- **Straight pipe.** Swirl and distorted profiles from bends and valves upstream shift the coefficient. The standard asks for straight runs of roughly 10 to more than 40 diameters upstream, depending on the fitting and on β, or a flow conditioner.
- **A sharp edge.** Wear, a rounded or damaged edge, or deposits change the reading by several per cent; plates are inspected and replaced.
- **The right way round.** The square edge faces upstream; a plate fitted backwards reads badly wrong.
- **Turndown.** Like every differential meter, $Q \\propto \\sqrt{\\Delta p}$, so about 3–4 : 1 per transmitter.
- **Gases** need an expansibility factor, because their density changes through the hole.

**Flow nozzles** — the ISA 1932 and long-radius nozzles — have a smooth, curved inlet, so the jet does not contract: their coefficient is 0.93–0.99. They stand up to high velocities and temperatures better than plates (power-station feedwater and steam) and lose less pressure, though more than a venturi.

> [!tip] The same physics used on purpose is a **restriction orifice**: a plate sized to limit a flow or to drop a pressure — and, in oil hydraulics, the fixed orifice that sets a cylinder's speed or damps a gauge (see [[orifice-equation]] and [[flow-control]]).

> [!note] Just beyond the plate the pressure is lowest. If the downstream pressure is low, the liquid can cavitate there: noise, erosion of the plate and pipe, and a spoilt reading (see [[cavitation]]).
`,
  ideas: [
    'An orifice plate uses the venturi equation with a coefficient of about 0.61, because the jet contracts.',
    'Its coefficient is known from the standard\'s equations, so a plate made to the standard needs no calibration.',
    'Most of the pressure drop is lost for good: about 1 − β^1.9 of it.',
    'Accuracy depends on straight pipe upstream, a sharp edge and correct installation.',
    'Flow nozzles, with rounded inlets, have coefficients near 1 and lose less pressure.'
  ],
  pitfalls: [
    'An orifice plate and a venturi with the same β give the same reading at the same flow — The orifice\'s jet contracts, so for the same flow it shows about (0.98/0.61)² ≈ 2.6 times the differential.',
    'The orifice\'s pressure drop is recovered downstream — Most of it (about 60–75 % at usual β) is dissipated in turbulence and lost for good.',
    'A plate works the same whichever way it faces — The square edge must face upstream; a bevelled edge facing the flow changes the coefficient badly.'
  ],
  formulas: [
    {
      name: 'Flow through an orifice plate',
      expr: 'Q = C*pi*d^2/4*sqrt(2*dp/(rho*(1 - (d/D)^4)))',
      tex: 'Q = C\\,\\dfrac{\\pi d^2}{4}\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho\\left(1 - (d/D)^4\\right)}}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h' },
        C: { name: 'discharge coefficient', value: 0.61, min: 0.55, max: 1 },
        d: { name: 'orifice diameter', q: 'length', unit: 'mm', value: 120 },
        D: { name: 'pipe diameter', q: 'length', unit: 'mm', value: 200 },
        dp: { name: 'measured differential', q: 'pressure', unit: 'kPa', value: 25, tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' }
      },
      note: 'Square-edged plate: C ≈ 0.60–0.62 (ISO 5167-2 gives it from β, Re and the tappings). Nozzles: 0.93–0.99.',
      practice: { unknowns: ['Q', 'dp', 'd'] },
      stories: {
        Q: 'An orifice plate with a {d} hole in a {D} pipe ({C}) shows {dp} on a liquid of density {rho}. What is the flow?',
        d: 'An orifice plate ({C}) in a {D} pipe must give {dp} at {Q} of a liquid of density {rho}. What hole diameter does it need?'
      }
    },
    {
      name: 'Permanent pressure loss of an orifice plate (ISO 5167-2)',
      expr: 'r = (sqrt(1 - beta^4*(1 - C^2)) - C*beta^2)/(sqrt(1 - beta^4*(1 - C^2)) + C*beta^2)',
      tex: 'r = \\dfrac{\\sqrt{1 - \\beta^4(1 - C^2)} - C\\beta^2}{\\sqrt{1 - \\beta^4(1 - C^2)} + C\\beta^2}',
      vars: {
        r: { name: 'fraction of the differential lost for good', q: 'ratio', unit: '%' },
        beta: { name: 'diameter ratio d/D', value: 0.6, min: 0.1, max: 0.9, tex: '\\beta' },
        C: { name: 'discharge coefficient', value: 0.61, min: 0.55, max: 1 }
      },
      note: 'Roughly 1 − β^1.9. Multiply by Δp and by the flow to get the power wasted.',
      practice: { unknowns: ['r'] },
      stories: { r: 'What fraction of its measured differential does an orifice plate with β = {beta} and C = {C} lose permanently?' }
    },
    {
      name: 'Square-root law of differential meters',
      expr: 'Q2 = Q1*sqrt(dp2/dp1)', tex: 'Q_2 = Q_1\\sqrt{\\dfrac{\\Delta p_2}{\\Delta p_1}}',
      vars: {
        Q2: { name: 'flow at the second reading', q: 'flowrate', unit: 'm³/h', tex: 'Q_2' },
        Q1: { name: 'flow at the first reading', q: 'flowrate', unit: 'm³/h', value: 188, tex: 'Q_1' },
        dp2: { name: 'second differential', q: 'pressure', unit: 'kPa', value: 2.5, tex: '\\Delta p_2' },
        dp1: { name: 'first differential', q: 'pressure', unit: 'kPa', value: 25, tex: '\\Delta p_1' }
      },
      note: 'For the same meter and liquid (constant coefficient). A tenth of the differential is still 32 % of the flow — the reason for the limited turndown.',
      stories: { Q2: 'A meter shows {dp1} at {Q1}. What flow does a reading of {dp2} mean?', dp2: 'A meter shows {dp1} at {Q1}. What will it read at {Q2}?' }
    }
  ],
  examples: [
    {
      title: 'Flow and energy lost',
      q: 'An orifice plate with a 120 mm hole ($C$ = 0.61) in a 200 mm water line reads 25 kPa. Find the flow, the permanent pressure loss and the energy it wastes in a year of continuous running.',
      steps: [
        '$\\beta = 0.6$, $1 - \\beta^4 = 0.870$; hole area $0.01131$ m².',
        '$Q = 0.61 \\times 0.01131 \\times \\sqrt{2 \\times 25\\,000/(1000 \\times 0.870)} = 0.0523$ m³/s $= 188$ m³/h.',
        'Loss fraction: $\\sqrt{1 - 0.1296 \\times 0.628} = 0.958$; $(0.958 - 0.220)/(0.958 + 0.220) = 0.627$, so 15.7 kPa is lost.',
        'Power: $15\\,700 \\times 0.0523 = 820$ W; over 8760 hours about 7200 kWh.'
      ],
      a: '188 m³/h; 15.7 kPa lost; about 7200 kWh a year of pumping energy.'
    },
    {
      title: 'Sizing a plate',
      q: 'A plate ($C$ = 0.605) must give 50 kPa at 100 m³/h of water in a 150 mm line. What hole diameter?',
      steps: [
        '$Q = 0.02778$ m³/s. First ignore the approach factor: $a = Q/(C\\sqrt{2\\Delta p/\\rho}) = 0.02778/(0.605 \\times 10) = 4.59\\times10^{-3}$ m², $d = 76.5$ mm.',
        'Then $\\beta = 0.51$ and $\\sqrt{1 - \\beta^4} = 0.967$: multiply the area by 0.967 and repeat.',
        'After two or three rounds: $d = 75.2$ mm, $\\beta = 0.50$.'
      ],
      a: 'A 75.2 mm hole (β = 0.50).'
    }
  ],
  quiz: [
    { q: 'Why is the coefficient of an orifice plate about 0.6, while a venturi\'s is about 0.98?', choices: ['the plate is rougher', 'the jet through the plate contracts to a vena contracta smaller than the hole', 'the plate has more friction', 'the plate\'s tappings are in the wrong place'], a: 1,
      why: 'The flow cannot follow the sharp edge; the jet narrows to about 60 % of the hole\'s area. The equation uses the hole\'s area, so C absorbs the contraction.' },
    { q: 'The differential across an orifice plate falls to a quarter. The flow is now…', choices: ['a quarter', 'half', 'a sixteenth', 'unchanged'], a: 1,
      why: 'Q ∝ √Δp: √(1/4) = 1/2.' },
    { q: 'An orifice plate fitted backwards reads correctly as long as the hole diameter is right.', a: false,
      why: 'The sharp, square edge must face the flow. Backwards, the flow meets a bevel and contracts less, so the coefficient and the reading change by several per cent or more.' },
    { q: 'About what fraction of its differential does an orifice plate with β = 0.5 lose permanently?', choices: ['about 10 %', 'about 30 %', 'about 73 %', 'about 100 %'], a: 2,
      why: '1 − β^1.9 = 1 − 0.27 = 0.73; the ISO 5167-2 formula gives the same.' },
    { q: 'A plate reads 40 kPa at 150 m³/h. What flow does a reading of 10 kPa mean?', answer: 75, unit: 'm³/h', tol: 0.02,
      why: 'Q₂ = 150 × √(10/40) = 75 m³/h.' }
  ],
  problems: [
    { q: 'An orifice plate ($C$ = 0.61) with an 80 mm hole in a 160 mm water pipe reads 30 kPa. What is the flow in m³/h?', answer: 88.3, unit: 'm³/h', tol: 0.02,
      steps: ['$\\beta = 0.5$, $1 - \\beta^4 = 0.9375$; hole area $5.027\\times10^{-3}$ m².', '$\\sqrt{2 \\times 30\\,000/(1000 \\times 0.9375)} = \\sqrt{64} = 8.0$ m/s.', '$Q = 0.61 \\times 5.027\\times10^{-3} \\times 8.0 = 0.0245$ m³/s $= 88.3$ m³/h.'] }
  ],
  applications: ['Process plant, oil and gas metering, where standardised plates need no calibration.', 'Restriction orifices that limit flows or drop pressures in cooling, fire and fuel systems.', 'Fixed orifices in oil hydraulics that set speeds and damp gauges.', 'Temporary checks of flow with a plate slipped between flanges.'],
  history: 'Orifice meters were used for water in the nineteenth century and for natural gas from the early twentieth; joint American and European test programmes gave standard coefficients from the 1930s, and a large international set of tests in the 1980s and 1990s produced the Reader-Harris/Gallagher equation used by ISO 5167-2.',
  sim: { id: 'flow-venturi', params: { meter: 'orifice' } }
},

{
  id: 'pitot-static-water', parent: 'flow-measurement', title: 'Pitot tubes in water', level: 2,
  short: 'A tube facing into the flow feels the stagnation pressure p + ½ρV²; a hole in its side feels the static pressure p. Their difference gives the local velocity, V = √(2Δp/ρ). In water the differentials are easy to read — but one point is not the mean.',
  keywords: ['pitot tube', 'pitot-static tube', 'Prandtl tube', 'stagnation pressure', 'dynamic pressure', 'static pressure', 'point velocity', 'velocity traverse', 'averaging pitot', 'ship log', 'river velocity', 'insertion meter'],
  prereq: ['energy-equation', 'manometers', 'flow-rate'],
  related: ['venturi-meter', 'flowmeters', 'laminar-turbulent', 'open-channel-basics', 'aerodynamics:pitot-tube', 'aerodynamics:stagnation-point', 'aerodynamics:dynamic-pressure'],
  body: `
### The idea
Point a small open tube upstream into a flow. The liquid that meets its mouth is brought to rest, and by Bernoulli its pressure rises to the **stagnation pressure**

$$p_0 = p + \\tfrac12\\rho V^2$$

Henri Pitot put a bent glass tube into the Seine in 1732 and saw the water in it stand above the river's surface by $V^2/2g$ — the velocity head made visible. For a tube in an open stream,

$$V = \\sqrt{2 g\\,\\Delta h}$$

so a rise of 80 mm means 1.25 m/s.

In a closed pipe the static pressure is unknown, so it is measured too, through small holes in the side of the probe past which the flow runs parallel. The **pitot-static** (Prandtl) tube combines both in one probe — an inner tube open at the nose, an outer jacket with side holes — and a differential gauge between them reads the **dynamic pressure** $\\tfrac12\\rho V^2$ directly:

$$V = C\\sqrt{\\frac{2\\,(p_0 - p)}{\\rho}}$$

with a probe coefficient $C$ within about 1 % of 1 for a standard head facing squarely into the flow.

### Water is not air
A pitot tube is the airspeed indicator of every aircraft (see [[aerodynamics:pitot-tube]]). Water is about 800 times denser than air, so at the same *velocity* the differential is 800 times larger: 1 m/s of water gives 500 Pa, 51 mm of water column — easy to read. The practical problems are others:
- **Low velocities** give tiny differentials: 0.2 m/s gives only 20 Pa, 2 mm of water.
- **Air in the lines** between probe and gauge gives false readings; the lines must be vented and kept full of water.
- **Debris, weed and fouling** block the small holes in rivers and raw water, and change the static holes.
- **Misalignment** of more than about 10–15° starts to make it read low.

| Water velocity | Dynamic pressure | Water column | Mercury manometer (under water) |
|---|---|---|---|
| 0.2 m/s | 20 Pa | 2 mm | 0.16 mm |
| 1 m/s | 500 Pa | 51 mm | 4 mm |
| 3 m/s | 4.5 kPa | 459 mm | 37 mm |
| 10 m/s | 50 kPa | 5.1 m | 406 mm |

### One point is not the flow
A pitot tube measures the velocity at its nose. In turbulent pipe flow the mean velocity is only 0.8–0.87 of the centreline value, depending on the Reynolds number and the roughness (see [[laminar-turbulent]]), so a single centreline reading gives the flow to a few per cent at best. For accuracy the probe is **traversed** across the pipe, with readings at standard positions on two diameters (by the equal-area or log-linear rules) and the velocities averaged over the area. **Averaging pitot tubes** have a row of holes spanning the pipe to do this in one reading. Hydrologists gauging rivers more often use propeller current meters or acoustic Doppler profilers, but the principle — velocity times area — is the same (see [[flowmeters]]).

> [!warn] Inserting or withdrawing a probe through a hot-tap fitting on a live main is a pressure-system task: the probe is pushed out by the pipe pressure, so it must be restrained, the isolating valve operated as the procedure requires, and the work done only by trained people.
`,
  ideas: [
    'A tube facing the flow reads the stagnation pressure p + ½ρV²; side holes read the static pressure p.',
    'Their difference, the dynamic pressure, gives the local velocity V = √(2Δp/ρ).',
    'In an open stream the water in a pitot tube stands V²/2g above the surface.',
    'Water gives about 800 times the differential of air at the same speed, but air in the lines, debris and low speeds cause trouble.',
    'A pitot measures one point; the flow needs a traverse or an averaging probe.'
  ],
  pitfalls: [
    'A pitot reading at the pipe centre gives the mean velocity — The centreline is the fastest point; the mean is about 0.8–0.87 of it in turbulent flow.',
    'Four times the reading means four times the velocity — V goes as √Δp: four times the differential is twice the velocity.',
    'The static holes can be anywhere on the probe — They must see flow running parallel to the surface, away from the nose and the stem, or they read wrongly.'
  ],
  formulas: [
    {
      name: 'Velocity from a pitot-static tube',
      expr: 'V = C*sqrt(2*dp/rho)', tex: 'V = C\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        V: { name: 'local velocity', q: 'speed', unit: 'm/s' },
        C: { name: 'probe coefficient', value: 1.0, min: 0.9, max: 1.1 },
        dp: { name: 'dynamic pressure p₀ − p', q: 'pressure', unit: 'kPa', value: 1.2, tex: '\\Delta p' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' }
      },
      note: 'Incompressible flow (water, or air well below Mach 0.3). The probe must face the flow within a few degrees.',
      practice: { unknowns: ['V', 'dp'] },
      stories: { V: 'A pitot-static tube in a liquid of density {rho} shows a differential of {dp} ({C}). What is the velocity there?', dp: 'What differential does a pitot-static tube ({C}) show in a liquid of density {rho} moving at {V}?' }
    },
    {
      name: 'Pitot tube in an open stream',
      expr: 'V = sqrt(2*g*dh)', tex: 'V = \\sqrt{2 g\\,\\Delta h}',
      vars: {
        V: { name: 'stream velocity', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        dh: { name: 'rise of the water in the tube above the surface', q: 'length', unit: 'mm', value: 80, tex: '\\Delta h' }
      },
      stories: { V: 'The water in a pitot tube held in a stream stands {dh} above the surface. How fast is the stream?', dh: 'How far above the surface does water rise in a pitot tube in a stream flowing at {V}?' }
    },
    {
      name: 'Flow from a centreline velocity',
      expr: 'Q = k*Vc*pi*D^2/4', tex: 'Q = k\\,V_c\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'L/s' },
        k: { name: 'ratio of mean to centreline velocity', value: 0.84, min: 0.5, max: 1 },
        Vc: { name: 'centreline velocity', q: 'speed', unit: 'm/s', value: 1.55, tex: 'V_c' },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 400 }
      },
      note: 'k ≈ 0.82–0.87 in fully developed turbulent flow (0.5 in laminar flow). Only an estimate: a traverse is needed for accuracy.',
      stories: { Q: 'A pitot tube reads {Vc} on the axis of a {D} main. Taking the mean as {k} of the centreline value, what is the flow?' }
    }
  ],
  examples: [
    {
      title: 'A reading on a water main',
      q: 'A pitot-static tube on the axis of a 400 mm water main shows 1.2 kPa. Estimate the flow.',
      steps: [
        '$V_c = \\sqrt{2 \\times 1200/1000} = 1.55$ m/s.',
        'Turbulent flow: mean about 0.84 of the centreline value, $V \\approx 1.30$ m/s.',
        '$Q = 1.30 \\times \\pi \\times 0.4^2/4 = 0.164$ m³/s — about 590 m³/h, good to a few per cent without a traverse.'
      ],
      a: 'About 0.16 m³/s.'
    },
    {
      title: 'Pitot\'s own experiment',
      q: 'A bent glass tube held facing into a river shows water standing 80 mm above the surface. How fast is the river flowing there?',
      steps: ['$V = \\sqrt{2 g \\Delta h} = \\sqrt{2 \\times 9.81 \\times 0.08} = 1.25$ m/s.'],
      a: '1.25 m/s at the depth of the tube\'s mouth.'
    }
  ],
  quiz: [
    { q: 'The differential shown by a pitot-static tube quadruples. The velocity…', choices: ['quadruples', 'doubles', 'rises 16 times', 'is unchanged'], a: 1,
      why: 'V ∝ √Δp.' },
    { q: 'At the same velocity, a pitot tube in water gives a much larger differential than in air.', a: true,
      why: 'The dynamic pressure ½ρV² is proportional to density; water is about 800 times denser than air.' },
    { q: 'A pitot-static tube in water shows 2 kPa. What is the velocity?', answer: 2, unit: 'm/s', tol: 0.02,
      why: 'V = √(2 × 2000/1000) = 2 m/s.' },
    { q: 'A single reading on the axis of a turbulent pipe flow…', choices: ['gives the mean velocity exactly', 'overestimates the mean velocity by roughly 15–25 %', 'underestimates the mean velocity', 'gives the maximum only in laminar flow'], a: 1,
      why: 'The centreline is the fastest point; the mean is about 0.8–0.87 of it, so the axis reading is some 15–25 % high.' },
    { q: 'What does the outer jacket of a pitot-static tube, with its side holes, measure?', choices: ['the stagnation pressure', 'the static pressure', 'the dynamic pressure', 'the velocity directly'], a: 1,
      why: 'The side holes see the flow running past parallel to them, so they feel the static pressure; the nose feels the stagnation pressure, and the gauge between them reads the dynamic pressure.' }
  ],
  applications: ['Checking the flow in mains and pump discharges without cutting the pipe (through hot-tap fittings).', 'Velocity traverses in hydraulic laboratories and cooling-water culverts.', 'Speed logs on ships and racing boats.', 'Averaging pitot tubes as permanent meters in large pipes and ducts.'],
  history: 'Henri Pitot described his tube to the French Academy in 1732, after measuring the Seine in Paris and finding — against the belief of the time — that the velocity grew towards the surface. Henry Darcy redesigned it in 1858 into a practical instrument with a valve to hold the reading, and the combined pitot-static head of Ludwig Prandtl followed in the early twentieth century.'
},

{
  id: 'flowmeters', parent: 'flow-measurement', title: 'Magnetic, ultrasonic, turbine and Coriolis meters', level: 2,
  short: 'Meters with no restriction to read: electromagnetic (a voltage from a conducting liquid moving in a magnetic field), ultrasonic (sound timed with and against the flow), turbine (a rotor\'s speed), Coriolis (the twist of a vibrating tube, giving mass flow) and vortex meters. The liquid, the accuracy and the price decide.',
  keywords: ['electromagnetic flowmeter', 'magmeter', 'ultrasonic flowmeter', 'transit time', 'Doppler flowmeter', 'clamp-on', 'turbine meter', 'K-factor', 'Coriolis meter', 'mass flow', 'vortex meter', 'Strouhal', 'positive displacement meter', 'oval gear', 'water meter', 'custody transfer', 'turndown'],
  prereq: ['flow-rate', 'venturi-meter', 'physics:faradays-law'],
  related: ['orifice-plate', 'pitot-static-water', 'reynolds-number-pipes', 'electrohydraulic-control', 'electronics:sensors', 'physics:doppler-effect', 'physics:speed-of-sound'],
  body: `
Differential-pressure meters need no electronics, but they cost pressure and read over a narrow range. Modern practice relies on other principles.

### Electromagnetic meters
A conducting liquid moving through a magnetic field is a conductor moving in a field: by [[physics:faradays-law|Faraday's law]] a voltage appears across it, at right angles to both the flow and the field. Coils outside a lined, non-magnetic tube make the field $B$, and two electrodes flush with the lining pick up

$$U = k\\,B\\,D\\,\\bar V$$

proportional to the mean velocity ($k \\approx 1$ for an axisymmetric profile). The signal is small — about a millivolt at 5 mT, 100 mm and 2 m/s — so the field is switched and the voltage sampled in step with it to reject drift. Nothing obstructs the flow: **no pressure loss**, no moving parts, no trouble with solids, pulp or sewage, and ±0.2–0.5 % of reading over 100 : 1 or more. The limits: the liquid must **conduct** (above about 5 µS/cm — most water does; demineralised water, fuels and hydraulic oil do not) and the pipe must run **full**. They dominate water supply and wastewater.

### Ultrasonic meters
Two transducers send pulses diagonally across the pipe, alternately with and against the flow. Downstream, sound travels at $c + V\\cos\\theta$; upstream at $c - V\\cos\\theta$. Over a path of length $L$ at an angle θ to the axis the transit times differ by

$$\\Delta t \\approx \\frac{2 L V \\cos\\theta}{c^2}$$

For water ($c \\approx 1480$ m/s) in a 150 mm pipe at 1.5 m/s that is only about 0.2 µs, so the electronics time pulses to a fraction of a nanosecond. **Transit-time** meters need a fairly clean liquid; **Doppler** meters bounce sound off particles and bubbles, suiting dirty flows at lower accuracy. **Clamp-on** transducers strapped to an existing pipe measure without cutting it (±1–3 %); multi-path meters, with several chords across the section, reach ±0.1–0.3 %.

### Turbine and positive-displacement meters
A free-running bladed rotor turns at a speed proportional to the velocity; a pickup counts the blades and gives pulses at $f = K Q$, where the **K-factor** (pulses per litre) comes from calibration. They give ±0.25–0.5 % over about 10 : 1 with fast response — fuel dispensing, aircraft fuel systems, hydraulic test benches — but need clean liquid and straight pipe, and a recalibration when the viscosity changes much.

**Positive-displacement** meters (oval-gear, rotary-piston, nutating-disc) trap and count fixed volumes, like a pump run backwards. They thrive on viscous oils where turbines struggle; many domestic water meters work this way. On oil-hydraulic test stands, gear-type meters measure pump delivery and leakage.

### Coriolis meters
The liquid flows through one or two tubes vibrated at their natural frequency. Moving along a vibrating tube, it is accelerated sideways, and the resulting Coriolis forces twist the tube: its inlet and outlet halves swing slightly out of step, by a time shift proportional to the **mass flow**. The natural frequency itself gives the **density**. No other meter measures mass flow directly, independent of the liquid's properties, to ±0.1 % or better — hence its use for dosing chemicals, food and custody transfer of fuels. The price is cost, and a pressure loss that grows in the larger sizes.

### Vortex meters
A bluff bar across the pipe sheds vortices alternately from each side at a frequency $f = St\\,V/d$, with a Strouhal number that stays nearly constant (about 0.2–0.25) over a wide range of Reynolds numbers. A sensor counts the vortices; there are no moving parts, but shedding stops below a minimum velocity.

| Meter | Measures | Accuracy (typical) | Turndown | Pressure loss | Main limits |
|---|---|---|---|---|---|
| Orifice / venturi | Δp, hence volume flow | 0.5–2 % | 3–4 : 1 | high / low | straight pipe, square root |
| Electromagnetic | mean velocity | 0.2–0.5 % | 100 : 1 | none | conducting liquid, full pipe |
| Ultrasonic | velocity along paths | 0.1–3 % | 50 : 1 or more | none | clean liquid, profile |
| Turbine | velocity | 0.25–0.5 % | 10 : 1 | moderate | clean liquid, viscosity |
| Positive displacement | volume | 0.1–0.5 % | 10–100 : 1 | moderate | clean liquid; can jam |
| Coriolis | mass flow and density | 0.05–0.2 % | 20–100 : 1 | moderate to high | cost, size |
| Vortex | velocity | 0.7–1 % | 10–20 : 1 | low | minimum velocity |

> [!tip] Choose by the liquid first — conducting or not, clean or dirty, thin or viscous — then by the accuracy and range needed, and only then by the price.
`,
  ideas: [
    'Electromagnetic meters measure the voltage induced in a conducting liquid moving through a magnetic field; they have no pressure loss.',
    'Ultrasonic transit-time meters measure the tiny difference in the time sound takes with and against the flow.',
    'Turbine meters count rotor pulses (f = KQ); positive-displacement meters count trapped volumes.',
    'Coriolis meters measure mass flow and density directly from the twist of a vibrating tube.',
    'Each principle has a liquid it cannot measure: choose by the liquid first.'
  ],
  pitfalls: [
    'A magnetic flowmeter works on any liquid — It needs an electrically conducting liquid; it cannot measure hydraulic oil, fuels or demineralised water.',
    'A turbine meter\'s K-factor is a fixed constant — It shifts with viscosity, wear and installation; turbines are calibrated on the liquid and at the viscosity they will see.',
    'Every flowmeter measures volume — Coriolis meters measure mass directly; differential and velocity meters need the density to convert.'
  ],
  formulas: [
    {
      name: 'Signal of an electromagnetic meter',
      expr: 'U = B*D*V', tex: 'U = B\\,D\\,V',
      vars: {
        U: { name: 'electrode voltage', q: 'voltage', unit: 'mV' },
        B: { name: 'magnetic flux density', q: 'bfield', unit: 'mT', value: 5 },
        D: { name: 'pipe bore (electrode spacing)', q: 'length', unit: 'mm', value: 100 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 2 }
      },
      note: 'Ideal meter (k = 1). The conductivity does not enter, provided it is above the meter\'s minimum.',
      stories: { U: 'An electromagnetic meter of {D} bore has a field of {B}. What voltage appears at the electrodes at {V}?', V: 'An electromagnetic meter of {D} with a field of {B} reads {U}. What is the mean velocity?' }
    },
    {
      name: 'Transit-time difference of an ultrasonic meter',
      expr: 'dt = 2*L*V*cos(theta)/c^2', tex: '\\Delta t = \\dfrac{2 L V \\cos\\theta}{c^2}',
      vars: {
        dt: { name: 'difference in transit times', q: 'time', unit: 'ns', tex: '\\Delta t' },
        L: { name: 'acoustic path length', q: 'length', unit: 'mm', value: 212 },
        V: { name: 'mean velocity along the path', q: 'speed', unit: 'm/s', value: 1.5 },
        theta: { name: 'angle between path and pipe axis', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\theta' },
        c: { name: 'speed of sound in the liquid', q: 'speed', unit: 'm/s', value: 1482 }
      },
      note: 'Valid for V ≪ c. Water at 20 °C: c ≈ 1482 m/s; mineral oil about 1400 m/s.',
      practice: { unknowns: ['dt', 'V'] },
      stories: { dt: 'An ultrasonic path of {L} crosses a pipe at {theta} to its axis; the water ({c}) moves at {V}. What is the difference in transit times?', V: 'An ultrasonic meter with a {L} path at {theta} measures a transit-time difference of {dt} in water ({c}). What is the velocity?' }
    },
    {
      name: 'Pulse rate of a turbine meter',
      expr: 'f = K*Q/60', tex: 'f = \\dfrac{K\\,Q}{60}',
      vars: {
        f: { name: 'pulse frequency', q: false, unit: 'Hz' },
        K: { name: 'K-factor', q: false, unit: 'pulses/L', value: 120 },
        Q: { name: 'flow', q: false, unit: 'L/min', value: 60 }
      },
      note: 'The K-factor comes from calibration on the liquid of use; 60 converts litres per minute to litres per second.',
      stories: { f: 'A turbine meter with a K-factor of {K} carries {Q}. What frequency does it give?', Q: 'A turbine meter with a K-factor of {K} is pulsing at {f}. What is the flow?' }
    },
    {
      name: 'Vortex shedding frequency',
      expr: 'f = St*V/d', tex: 'f = \\dfrac{\\mathrm{St}\\,V}{d}',
      vars: {
        f: { name: 'shedding frequency', q: 'frequency', unit: 'Hz' },
        St: { name: 'Strouhal number', value: 0.22, min: 0.1, max: 0.4, tex: '\\mathrm{St}' },
        V: { name: 'velocity past the bar', q: 'speed', unit: 'm/s', value: 2 },
        d: { name: 'width of the bluff bar', q: 'length', unit: 'mm', value: 28 }
      },
      note: 'St stays nearly constant over a wide range of Reynolds numbers, which is what makes the meter linear.',
      stories: { f: 'Water at {V} passes a {d} bluff bar (Strouhal number {St}). How often are vortices shed?', V: 'A vortex meter with a {d} bar (St = {St}) counts {f}. What is the velocity?' }
    }
  ],
  examples: [
    {
      title: 'How small the signals are',
      q: 'An electromagnetic meter of 100 mm bore has a field of 5 mT. What does it give at 2 m/s, and at 1 % of that? And what transit-time difference does an ultrasonic meter see on a 212 mm path at 45° in water at 1.5 m/s?',
      steps: [
        'Magnetic: $U = BDV = 0.005 \\times 0.1 \\times 2 = 1.0$ mV; at 0.02 m/s only 10 µV — why the field is switched and the electrodes carefully earthed.',
        'Ultrasonic: $\\Delta t = 2 \\times 0.212 \\times 1.5 \\times \\cos 45^\\circ/1482^2 = 2.05\\times10^{-7}$ s $= 205$ ns.',
        'To resolve 0.5 % of that at a fifth of the speed, the timing must be good to about 0.2 ns.'
      ],
      a: '1 mV and 10 µV; 205 ns, to be timed to a fraction of a nanosecond.'
    }
  ],
  quiz: [
    { q: 'Which meter cannot measure the flow of hydraulic oil?', choices: ['a Coriolis meter', 'an oval-gear meter', 'an electromagnetic meter', 'a turbine meter'], a: 2,
      why: 'Oil is an electrical insulator, so no measurable voltage is induced. The others work on oil (the turbine with a calibration at its viscosity).' },
    { q: 'Which meter measures mass flow directly?', choices: ['electromagnetic', 'Coriolis', 'vortex', 'venturi'], a: 1,
      why: 'The Coriolis twist is proportional to mass flow, whatever the density; it measures the density too.' },
    { q: 'A turbine meter\'s K-factor is independent of the liquid\'s viscosity.', a: false,
      why: 'Viscous drag on the rotor and blades changes how much it slips, so K shifts with viscosity, especially at low flows.' },
    { q: 'In a transit-time ultrasonic meter, the difference between the upstream and downstream times is…', choices: ['proportional to V and inversely proportional to c²', 'proportional to c', 'independent of the path length', 'proportional to V²'], a: 0,
      why: 'Δt ≈ 2LV cos θ / c²: small, because c is large.' },
    { q: 'A turbine meter with K = 250 pulses/L is pulsing at 500 Hz. What is the flow in L/min?', answer: 120, unit: 'L/min', tol: 0.02,
      why: 'Q = f/K = 500/250 = 2 L/s = 120 L/min.' }
  ],
  applications: ['Electromagnetic meters on water-supply mains, sewage works and slurry lines.', 'Clamp-on ultrasonic meters for surveys and temporary checks without cutting pipes.', 'Coriolis meters for dosing, blending and custody transfer of fuels and chemicals.', 'Turbine and gear meters on hydraulic test benches and in fuel systems.'],
  history: 'Michael Faraday tried in 1832 to measure the flow of the Thames at Waterloo Bridge from the voltage induced by the Earth\'s magnetic field, but his electrodes were swamped by other effects. Electromagnetic meters became practical in the mid-twentieth century, first for measuring blood flow; ultrasonic and Coriolis meters followed with modern electronics, the Coriolis type becoming commercial in the late 1970s.'
}

);
