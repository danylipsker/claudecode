/* HYPER-AERODYNAMICS · content/flow.js — "How Air Flows": describing flow (streamlines, continuity,
 * Bernoulli, the momentum equation, Navier–Stokes, vorticity and circulation) and measuring airspeed
 * (stagnation, the pitot-static tube, the four airspeeds); and "Wind on structures" (wind loads,
 * flutter, galloping and Tacoma Narrows). Simulations in sims/flow.js. */
Hyper.add(

/* ================================================================ DESCRIBING FLOW */
{
  id: 'streamlines', parent: 'flow-description', title: 'Streamlines, pathlines and streaklines', level: 1,
  short: 'Three ways to draw a flow: a streamline follows the velocity at one instant, a pathline follows one particle over time, and a streakline joins every particle that has passed one point — the line smoke shows. In steady flow all three are the same line; in unsteady flow they can look nothing alike.',
  keywords: ['streamline', 'pathline', 'streakline', 'timeline', 'stream tube', 'flow visualisation', 'smoke', 'dye', 'steady flow', 'unsteady flow', 'velocity field', 'stream function'],
  prereq: ['what-is-a-fluid', 'math:vectors'],
  related: ['continuity', 'bernoulli', 'flow-visualisation', 'vortex-shedding', 'potential-flow-basics', 'wind-tunnel', 'stagnation-point'],
  body: `
A flow is a **velocity field**: at every point and every instant the air has a speed and a direction, $\\vec V(x, y, z, t)$. A field of arrows in three dimensions is impossible to read, so we draw lines instead — and there are three quite different lines one can draw.

### Three lines
- A **streamline** is everywhere tangent to the velocity *at one instant*. Freeze the flow, start at a point, and keep stepping the way the arrow points. In two dimensions its slope is $dy/dx = v/u$.
- A **pathline** is the track of one particular particle over time — a single speck of dust in a long-exposure photograph.
- A **streakline** joins every particle that has passed through one fixed point. It is what you see when smoke or dye comes out of a nozzle: a chimney plume, the smoke wands of a [[wind-tunnel]], dye in a water channel.

A fourth, the **timeline**, is a row of neighbouring particles marked at the same moment — a line of hydrogen bubbles from a pulsed wire — watched as the flow stretches and bends it.

### Steady flow: one line
If the velocity at each point never changes — a wing in a smooth tunnel stream — a particle simply runs along the streamline it is on, and every later particle released from the same point does the same. **Streamlines, pathlines and streaklines coincide.** That is why smoke photographs of steady flow are pictures of the streamlines, and why aerodynamicists go to such lengths to make tunnel flow steady.

### Unsteady flow: three different pictures
When the flow changes with time they part company. Take a stream that swings from side to side, like a gusty wind or the air behind a flapping flag. At any instant the streamlines are nearly straight, tilted in the current direction. A particle, though, weaves from side to side as the direction changes — its pathline is a wave, fixed once it has been drawn. And the smoke from a fixed nozzle is also a wave, but one that the stream carries away bodily, like water from a hose swung from side to side; its wavelength is the stream speed times the period of the swing, $\\lambda = UT$. Smoke pictures of unsteady flows, such as the [[vortex-shedding|vortex street]] behind a cylinder, show streaklines, and they can look quite unlike the instantaneous streamlines.

> [!note] Steadiness depends on the observer. Seen from the ground, a wing flying through still air makes an unsteady flow; seen from the wing the same flow is steady. Wind tunnels exploit this: holding the model still makes the flow steady, so the smoke shows streamlines.

### What streamlines tell you
- In steady flow no air crosses a streamline, so a bundle of them forms a **stream tube** that behaves like a pipe with invisible walls — the basis of [[continuity]].
- In two-dimensional incompressible flow the same volume flows between two neighbouring streamlines all along them, so **crowded streamlines mean fast air** and spread ones slow air: $V_1 h_1 = V_2 h_2$. Over the top of a wing they squeeze together; at the nose they fan apart round the [[stagnation-point|stagnation point]].
- Faster air along a streamline has lower pressure ([[bernoulli|Bernoulli]]), so a streamline picture read the right way is also a pressure map.
- Streamlines never cross, except where the velocity is zero (a stagnation point) or undefined (the idealised centre of a vortex).

| | Defined by | Steady flow | Unsteady flow | You see it as |
|---|---|---|---|---|
| Streamline | the velocity at one instant | the common line | changes at every instant | computed; smoke only if steady |
| Pathline | one particle over time | the common line | a track, fixed once drawn | long exposure of one tracer |
| Streakline | all particles through one point | the common line | a pattern the stream carries away | smoke, dye, plumes |

In two-dimensional incompressible flow the streamlines are the contours of the **stream function** $\\psi$; the difference in $\\psi$ between two streamlines is the volume flow between them per metre of span. It is one of the tools of [[potential-flow-basics|potential flow]].
`,
  ideas: [
    'A streamline is tangent to the velocity at one instant; a pathline is the track of one particle; a streakline joins every particle that has passed one point.',
    'In steady flow the three coincide; in unsteady flow they differ, sometimes completely.',
    'Smoke and dye show streaklines, which are streamlines only when the flow is steady.',
    'In steady flow air does not cross streamlines, so crowded streamlines mean fast air — and, by Bernoulli, low pressure.',
    'Whether a flow is steady depends on the frame: the flow round a wing is steady when seen from the wing.'
  ],
  pitfalls: [
    'Smoke in a wind tunnel always shows streamlines — It shows streaklines. They are streamlines only if the flow is steady; in a vortex street or a gusty flow the smoke pattern can look quite unlike the instantaneous streamlines.',
    'A particle follows the streamline it starts on — Only in steady flow. If the flow changes, the streamline moves while the particle is on it, and the particle traces its own pathline.',
    'Gaps between the drawn streamlines are regions of still air — A streamline passes through every point of the flow; the drawn ones are a sample. Their spacing carries the information: closer lines, faster air (in two-dimensional incompressible flow).'
  ],
  formulas: [
    {
      name: 'Direction of a streamline',
      expr: 'theta = atan(v/u)', tex: '\\theta = \\arctan\\frac{v}{u}',
      vars: {
        theta: { name: 'angle of the streamline to the x-axis', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\theta' },
        v: { name: 'velocity component along y', q: 'speed', unit: 'm/s', value: 3, signed: true },
        u: { name: 'velocity component along x', q: 'speed', unit: 'm/s', value: 20 }
      },
      note: 'The streamline slope dy/dx = v/u written as an angle (for u > 0). At an instant of an unsteady flow it gives the streamline of that instant only.',
      stories: { theta: 'Air moves at {u} along x and {v} along y. At what angle to the x-axis does the streamline through this point run?', v: 'A streamline runs at {theta} to the x-axis where the x-component of velocity is {u}. What is the y-component?' }
    },
    {
      name: 'Streamline spacing and speed',
      expr: 'V2 = V1*h1/h2', tex: 'V_2 = V_1\\,\\frac{h_1}{h_2}',
      vars: {
        V2: { name: 'speed where the streamlines are h₂ apart', q: 'speed', unit: 'm/s' },
        V1: { name: 'speed where they are h₁ apart', q: 'speed', unit: 'm/s', value: 10 },
        h1: { name: 'spacing of two streamlines at point 1', q: 'length', unit: 'mm', value: 20 },
        h2: { name: 'spacing of the same streamlines at point 2', q: 'length', unit: 'mm', value: 12 }
      },
      note: 'Steady, two-dimensional, incompressible flow: the volume flow per metre of span between two streamlines, V·h, is the same all along them.',
      stories: { V2: 'Two streamlines are {h1} apart where the air moves at {V1}, and {h2} apart above a model. How fast is the air there?', h2: 'Air at {V1} between streamlines {h1} apart speeds up to {V2}. How far apart are the streamlines now?' }
    },
    {
      name: 'Wavelength of a pattern laid down in a stream',
      expr: 'lambda = U*T', tex: '\\lambda = U\\,T',
      vars: {
        lambda: { name: 'wavelength of the streakline pattern', q: 'length', unit: 'm', tex: '\\lambda' },
        U: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 0.6 },
        T: { name: 'period of the unsteadiness', q: 'time', unit: 's', value: 4 }
      },
      note: 'A source that changes with period T — a swinging nozzle, a flapping flag, vortex shedding — leaves a wave in the streakline, which the stream carries away at U.',
      stories: { lambda: 'A dye nozzle in a {U} stream swings from side to side once every {T}. What is the wavelength of the dye wave?', T: 'Smoke from a flapping flag in a {U} wind forms waves {lambda} long. What is the period of the flapping?' }
    }
  ],
  examples: [
    {
      title: 'Reading speed from streamline spacing',
      q: 'In a photograph of steady two-dimensional flow round a model, two streamlines are 20 mm apart far upstream, where the air moves at 10 m/s, and 12 mm apart just above the model. How fast is the air there, and what does Bernoulli say about its pressure (sea-level air)?',
      steps: [
        'The same volume flows between the two streamlines: $V_1 h_1 = V_2 h_2$.',
        '$V_2 = 10 \\times 20/12 = 16.7$ m/s.',
        'Pressure change along the streamline: $\\Delta p = \\tfrac12 \\rho (V_1^2 - V_2^2) = 0.6125 \\times (100 - 278) = -109$ Pa.'
      ],
      a: '16.7 m/s, with the pressure about 109 Pa below its upstream value.'
    },
    {
      title: 'A swinging stream',
      q: 'A stream of 0.6 m/s swings ±20° from side to side with a period of 4 s, as in the simulation. What is the wavelength of the dye wave, and roughly how far does one particle weave from side to side (far from the cylinder)?',
      steps: [
        'The nozzle lays down one wave per period and the stream carries it away at $U$: $\\lambda = UT = 0.6 \\times 4 = 2.4$ m.',
        'The sideways velocity is about $v = U\\sin 20° \\sin\\omega t = 0.205\\sin\\omega t$ m/s, with $\\omega = 2\\pi/4 = 1.571$ rad/s.',
        'Integrating, the particle swings through $2 \\times 0.205/1.571 = 0.26$ m from one side to the other.',
        'Meanwhile the streamlines of each instant are straight lines tilted by at most 20° — none of them looks like the wavy track.'
      ],
      a: 'λ = 2.4 m; each particle weaves about 0.26 m from side to side.'
    }
  ],
  quiz: [
    { q: 'Smoke released from a fixed wand into a gusty, changing flow shows…', choices: ['streamlines', 'pathlines', 'streaklines', 'timelines'], a: 2,
      why: 'Smoke from a fixed point marks every particle that has passed that point: a streakline. It equals the streamline only in steady flow.' },
    { q: 'In steady flow, the streamline, the pathline and the streakline through the same point are the same line.', a: true,
      why: 'If nothing changes with time, every particle through the point follows the same track, which is tangent to the (unchanging) velocity everywhere.' },
    { q: 'In a steady two-dimensional flow two streamlines 30 mm apart, where the air moves at 12 m/s, close to 20 mm apart. What is the speed there?', answer: 18, unit: 'm/s',
      why: 'V₂ = V₁h₁/h₂ = 12 × 30/20 = 18 m/s — the same volume squeezed through a narrower gap.' },
    { q: 'An aircraft flies through still air past a smoke generator on the ground. Seen from the ground the flow near the aircraft is…', choices: ['steady, so the smoke shows streamlines', 'unsteady, so smoke, particle tracks and streamlines differ', 'steady only above the wing', 'steady because the aircraft moves at constant speed'], a: 1,
      why: 'From the ground the air at each fixed point changes as the aircraft passes: unsteady. From the aircraft the same flow is steady — the reason tunnels hold the model still.' },
    { q: 'Two streamlines can meet or cross…', choices: ['wherever the flow is fast', 'only where the velocity is zero or undefined, such as a stagnation point', 'at the edge of a boundary layer', 'nowhere, not even at a stagnation point'], a: 1,
      why: 'At a crossing the velocity would have two directions at once. Only where it has no direction — zero speed at a stagnation point, or the singular centre of an ideal vortex — can streamlines meet or branch.' }
  ],
  applications: [
    'Smoke and dye visualisation in wind and water tunnels, read correctly for steady and unsteady flow.',
    'Particle image velocimetry (PIV), which photographs short pathline segments of seeded particles to measure the velocity field.',
    'Weather maps: streamlines of the wind at one time, pathlines of balloons, streaklines of smoke and volcanic-ash plumes.',
    'CFD post-processing, where engineers choose streamlines, pathlines or streaklines depending on the question.'
  ],
  history: 'Étienne-Jules Marey built smoke tunnels around 1900 and photographed smoke filaments flowing past shapes; Ludwig Prandtl\'s water channel of the early 1900s made separation and vortex shedding visible with particles on the surface. As experimenters photographed wakes, they learned that beautiful smoke pictures of unsteady flow are streaklines, not snapshots of the streamlines.',
  sim: 'flow-lines'
},

{
  id: 'continuity', parent: 'flow-description', title: 'Conservation of mass', level: 1,
  short: 'Air is neither made nor destroyed: whatever mass flows into a region must flow out or pile up inside. In a steady duct flow the mass flow ṁ = ρAV is the same at every section — so a narrowing duct speeds the air up.',
  keywords: ['continuity equation', 'mass flow rate', 'conservation of mass', 'rho A V', 'volume flow rate', 'contraction ratio', 'wind tunnel contraction', 'incompressible', 'divergence', 'stream tube'],
  prereq: ['streamlines', 'air-density', 'physics:continuity-equation'],
  related: ['bernoulli', 'momentum-equation', 'navier-stokes', 'nozzles', 'wind-tunnel', 'compressibility', 'de-laval-nozzle', 'momentum-theory'],
  body: `
Mass is conserved. Draw any closed region in a flow — a **control volume** — and the rate at which the mass inside it grows equals the rate at which mass flows in minus the rate at which it flows out. In steady flow nothing accumulates, so what goes in must come out.

### Along a duct or a stream tube
Air crossing a section of area $A$ at speed $V$ (square to the section) carries a **mass flow rate**
$$\\dot{m} = \\rho A V \\quad (\\mathrm{kg/s})$$
In steady flow along a duct, or along a [[streamlines|stream tube]] whose sides no air crosses, $\\dot{m}$ is the same at every section:
$$\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2$$
At the speeds of bicycles, cars, buildings and light aircraft the density hardly changes (see [[compressibility]]), and continuity becomes a statement about volume: $A_1 V_1 = A_2 V_2$. **Halve the area and the air goes twice as fast.** For a round pipe the area goes with the diameter squared, so halving the diameter makes the flow four times faster.

### Contractions, nozzles and wind tunnels
A low-speed [[wind-tunnel]] draws slow, calm air from a large settling chamber through a contraction into the test section. A contraction ratio of 9 — typical — turns 5 m/s into 45 m/s, and because the fluctuations do not grow with the mean speed, it also makes the flow smoother in proportion. An engine intake, a hose nozzle and the throat of a venturi all do the same bookkeeping.

| | Section 1 | Section 2 | Speed-up |
|---|---|---|---|
| Wind-tunnel contraction | 3 m × 3 m at 5 m/s | 1 m × 1 m | ×9 → 45 m/s |
| Venturi, throat half the area | 15 m/s | half the area | ×2 → 30 m/s |
| Garden hose, 16 mm to a 5 mm nozzle | 1.5 m/s | area ÷ 10.2 | ×10.2 → 15.4 m/s |
| River narrowing at constant depth | 40 m wide at 1 m/s | 10 m wide | ×4 → 4 m/s |

### When the density changes
Above about Mach 0.3 the density falls noticeably where the air speeds up, and the full form with $\\rho$ is needed. In a nozzle accelerating air from 60 m/s to Mach 0.45 the density drops by 8 %, so the exit speed is 8 % higher than $A_1V_1/A_2$ predicts. At Mach 1 something remarkable happens: the mass flow per unit area $\\rho V$ reaches its maximum, a narrowing duct can no longer speed the flow up, and to go supersonic the duct must widen again — the [[de-laval-nozzle|de Laval nozzle]].

### The general form
For a tiny cube of air, conservation of mass reads
$$\\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho\\vec V) = 0$$
and for incompressible flow simply $\\nabla\\cdot\\vec V = 0$: the velocity field has no [[math:divergence|divergence]] — as much flows into each tiny volume as flows out. It is the first equation every CFD program solves, alongside the [[momentum-equation]] and the [[navier-stokes|Navier–Stokes equations]].

> [!key] Continuity tells you how fast; it says nothing about pressure. Bernoulli (energy) and the momentum equation (force) add that. Continuity plus Bernoulli explain the venturi, the pitot tube and much of the pressure field round a wing.

> [!tip] Engines care about mass flow, not volume. A large turbofan at takeoff swallows several hundred kilograms of air a second; at cruise, in air a third as dense, the same volume carries a third of the mass — one reason thrust falls with altitude.
`,
  ideas: [
    'The mass flow ṁ = ρAV is the same at every section of a steady duct or stream tube.',
    'Below about Mach 0.3 the density is nearly constant and A₁V₁ = A₂V₂: halve the area, double the speed.',
    'A contraction speeds air up and smooths it — the heart of a wind tunnel.',
    'At higher Mach numbers the density falls where the air accelerates, and ρ must be kept in the equation.',
    'In differential form, incompressible continuity is ∇·V = 0: no divergence.'
  ],
  pitfalls: [
    'Air slows down in a narrowing duct because it is squeezed — Subsonic air speeds up: the same mass per second must pass through a smaller area. Only supersonic flow slows down in a converging duct.',
    'Continuity gives the pressure too — It gives only the speed. Whether the pressure rises or falls comes from Bernoulli or the momentum equation.',
    'Volume flow is conserved in every flow — Mass flow is. Volume flow is conserved only while the density stays constant; in a jet engine or a high-speed nozzle it changes a great deal.'
  ],
  formulas: [
    {
      name: 'Mass flow rate',
      expr: 'mdot = rho*A*V', tex: '\\dot{m} = \\rho A V',
      vars: {
        mdot: { name: 'mass flow rate', q: 'massflow', unit: 'kg/s', tex: '\\dot{m}' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        A: { name: 'flow area (square to the flow)', q: 'area', unit: 'm²', value: 2.35 },
        V: { name: 'average speed through the area', q: 'speed', unit: 'm/s', value: 140 }
      },
      note: 'For a section square to the flow with a uniform (or average) speed. The defaults are roughly a large turbofan\'s fan face at takeoff.',
      stories: { mdot: 'An engine intake of {A} takes in air of density {rho} at {V}. What mass of air does it swallow each second?', V: 'A duct of {A} carries {mdot} of air of density {rho}. What is the average speed?' }
    },
    {
      name: 'Continuity for incompressible flow',
      expr: 'V2 = V1*A1/A2', tex: 'V_2 = V_1\\,\\frac{A_1}{A_2}',
      vars: {
        V2: { name: 'speed at section 2', q: 'speed', unit: 'm/s' },
        V1: { name: 'speed at section 1', q: 'speed', unit: 'm/s', value: 5 },
        A1: { name: 'area of section 1', q: 'area', unit: 'm²', value: 9 },
        A2: { name: 'area of section 2', q: 'area', unit: 'm²', value: 1 }
      },
      note: 'A₁V₁ = A₂V₂: steady flow with constant density (air below about Mach 0.3, or any liquid).',
      stories: { V2: 'A wind-tunnel contraction narrows from {A1} to {A2}. The air enters at {V1}. How fast is it in the test section?', A2: 'Air at {V1} in a duct of {A1} must be sped up to {V2}. What area should the throat have?' }
    },
    {
      name: 'Speed in a round pipe of changing diameter',
      expr: 'V2 = V1*(D1/D2)^2', tex: 'V_2 = V_1 \\left(\\frac{D_1}{D_2}\\right)^2',
      vars: {
        V2: { name: 'speed in the narrow part', q: 'speed', unit: 'm/s' },
        V1: { name: 'speed in the wide part', q: 'speed', unit: 'm/s', value: 1.5 },
        D1: { name: 'diameter of the wide part', q: 'length', unit: 'mm', value: 16 },
        D2: { name: 'diameter of the narrow part', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'Area goes with the diameter squared: halving the diameter quadruples the speed. Incompressible flow.',
      stories: { V2: 'Water flows at {V1} in a hose {D1} across, which ends in a nozzle {D2} across. How fast does the jet leave?', D2: 'Water at {V1} in a {D1} hose must leave a nozzle at {V2}. What nozzle diameter is needed?' }
    },
    {
      name: 'Continuity with changing density',
      expr: 'rho1*A1*V1 = rho2*A2*V2', tex: '\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2',
      vars: {
        rho1: { name: 'density at section 1', q: 'density', unit: 'kg/m³', value: 1.206, tex: '\\rho_1' },
        A1: { name: 'area of section 1', q: 'area', unit: 'cm²', value: 200 },
        V1: { name: 'speed at section 1', q: 'speed', unit: 'm/s', value: 60 },
        rho2: { name: 'density at section 2', q: 'density', unit: 'kg/m³', value: 1.109, tex: '\\rho_2' },
        A2: { name: 'area of section 2', q: 'area', unit: 'cm²', value: 87 },
        V2: { name: 'speed at section 2', q: 'speed', unit: 'm/s' }
      },
      solveFor: 'V2',
      note: 'The general steady form: mass flow is conserved even when the density changes (compressible flow above about Mach 0.3).',
      stories: { V2: 'Air of density {rho1} flows at {V1} through {A1} and leaves a nozzle of {A2} with density {rho2}. What is its exit speed?' }
    }
  ],
  examples: [
    {
      title: 'A wind-tunnel contraction',
      q: 'A tunnel\'s settling chamber is 3 m × 3 m and its test section 1 m × 1 m. The test section runs at 45 m/s in sea-level air. How fast is the air in the settling chamber, and what mass flow does the fan move?',
      steps: [
        'Areas 9 m² and 1 m²: a contraction ratio of 9.',
        'Continuity: $V_1 = V_2 A_2/A_1 = 45/9 = 5$ m/s.',
        'Mass flow: $\\dot{m} = \\rho A V = 1.225 \\times 1 \\times 45 = 55.1$ kg/s — and the same in the settling chamber, $1.225 \\times 9 \\times 5 = 55.1$ kg/s.'
      ],
      a: '5 m/s in the settling chamber; the fan moves about 55 kg of air every second.'
    },
    {
      title: 'A garden-hose nozzle',
      q: 'Water flows at 1.5 m/s in a hose of 16 mm bore that ends in a 5 mm nozzle. Find the jet speed and the volume flow.',
      steps: [
        '$V_2 = V_1 (D_1/D_2)^2 = 1.5 \\times (16/5)^2 = 1.5 \\times 10.24 = 15.4$ m/s.',
        '$Q = A_1V_1 = \\tfrac{\\pi}{4}(0.016)^2 \\times 1.5 = 3.02 \\times 10^{-4}$ m³/s $= 18.1$ L/min.'
      ],
      a: 'About 15 m/s, carrying 18 litres a minute.'
    },
    {
      title: 'When the density matters',
      q: 'Air accelerates through a nozzle from 60 m/s in a section of 200 cm² (ρ = 1.206 kg/m³) to an exit of 87 cm², where ρ = 1.109 kg/m³. Find the exit speed, and the error made by ignoring the density change.',
      steps: [
        'Mass flow: $\\dot{m} = 1.206 \\times 0.0200 \\times 60 = 1.447$ kg/s.',
        'Exit speed: $V_2 = \\dot{m}/(\\rho_2 A_2) = 1.447/(1.109 \\times 0.0087) = 150$ m/s — about Mach 0.45.',
        'Incompressible estimate: $60 \\times 200/87 = 138$ m/s, 8 % too low: the density dropped by 8 %.'
      ],
      a: '150 m/s; ignoring the density drop would give 138 m/s.'
    }
  ],
  quiz: [
    { q: 'Air at 20 m/s enters a duct that narrows to a quarter of its area (low speed). In the narrow part it flows at…', choices: ['5 m/s', '40 m/s', '80 m/s', '20 m/s — the fan sets the speed'], a: 2,
      why: 'A₁V₁ = A₂V₂: a quarter of the area needs four times the speed, 80 m/s (about Mach 0.24, so still nearly incompressible).' },
    { q: 'What mass of air per second passes through a 2 m² intake at 100 m/s in air of density 0.9 kg/m³?', answer: 180, unit: 'kg/s',
      why: 'ṁ = ρAV = 0.9 × 2 × 100 = 180 kg/s.' },
    { q: 'In any steady flow the volume flow rate (m³/s) is the same at every section of a duct.', a: false,
      why: 'Mass flow is. Volume flow is constant only while the density is; at high speed the density changes and so does the volume flow.' },
    { q: 'Subsonic air enters a converging duct. Its speed…', choices: ['rises', 'falls', 'stays the same', 'rises and then falls'], a: 0,
      why: 'The same mass through a smaller area must go faster. (Supersonic flow does the opposite, because its density falls faster than its speed rises.)' },
    { q: 'The diameter of a water pipe is halved. By what factor does the speed of the water multiply?', answer: 4,
      why: 'Area goes with diameter squared: half the diameter, a quarter of the area, four times the speed.' }
  ],
  problems: [
    { q: 'A ventilation duct 400 mm × 300 mm carries air at 6 m/s. It feeds a round duct of 250 mm diameter. What is the speed in the round duct?', answer: 14.67, unit: 'm/s', tol: 0.02,
      steps: ['Flow: $Q = 0.4 \\times 0.3 \\times 6 = 0.72$ m³/s.', 'Round duct area: $\\tfrac{\\pi}{4} \\times 0.25^2 = 0.04909$ m².', '$V = 0.72/0.04909 = 14.7$ m/s.'] }
  ],
  applications: [
    'Sizing wind-tunnel contractions, engine intakes, ducts and nozzles.',
    'Flow measurement: volume flow = area × average speed, in ducts, pipes and rivers.',
    'Engine thrust against altitude, which follows the mass flow of air.',
    'The mass-conservation equation in every cell of a CFD model.'
  ],
  history: 'Leonardo da Vinci noted around 1500 that a river runs faster where it is narrow; Benedetto Castelli stated the rule for rivers in 1628 — the product of cross-section and speed stays the same — and Leonhard Euler wrote the general equation of continuity for a compressible fluid in the 1750s.',
  sim: 'flow-venturi'
},

{
  id: 'bernoulli', parent: 'flow-description', title: 'Bernoulli\'s equation', level: 1,
  short: 'Along a streamline in steady, frictionless, incompressible flow, p + ½ρV² + ρgz stays constant: where air speeds up its pressure falls. It is energy conservation — Newton\'s second law — for a moving fluid, and it holds only under those conditions.',
  keywords: ['Bernoulli', 'total pressure', 'static pressure', 'dynamic pressure', 'p + ½ρV²', 'venturi', 'venturi meter', 'energy equation', 'pressure and speed', 'manometer', 'compressibility correction', 'Euler equation', 'head'],
  prereq: ['continuity', 'air-pressure', 'physics:bernoullis-equation', 'physics:work-energy'],
  related: ['dynamic-pressure', 'stagnation-point', 'pitot-tube', 'pressure-coefficient', 'how-lift-works', 'momentum-equation', 'isentropic-flow', 'compressibility', 'vorticity-circulation', 'potential-flow-basics', 'boundary-layer'],
  body: `
Where air speeds up, its pressure falls; where it slows, its pressure rises. **Bernoulli's equation** puts a number on that trade:

$$p + \\tfrac12 \\rho V^2 + \\rho g z = \\text{constant along a streamline}$$

Each term is an energy per cubic metre (J/m³ is the same unit as Pa): $p$ is the work the pressure can do, $\\tfrac12\\rho V^2$ the kinetic energy, $\\rho g z$ the potential energy. A parcel of air accelerating along a streamline is pushed by a higher pressure behind it than in front, and the work of that push is exactly the kinetic energy it gains. Nothing more mysterious than Newton's second law, integrated along the path — see the derivation below.

### The names of the pressures
- $p$ — the **static pressure**: what a barometer or a hole flush in a wall measures, the pressure the air exerts on a surface it slides along.
- $q = \\tfrac12\\rho V^2$ — the **[[dynamic-pressure|dynamic pressure]]**: the extra pressure the air would exert if brought to rest.
- $p_0 = p + \\tfrac12\\rho V^2$ — the **total** or **[[stagnation-point|stagnation]] pressure**: what a tube facing into the flow measures. Bernoulli says $p_0$ stays the same all along a streamline.

In air the height term hardly matters: a 10 m climb changes $\\rho g z$ by 120 Pa — the dynamic pressure of a 14 m/s breeze — and it only reproduces the slow fall of [[air-pressure]] with height. For flow round wings and bodies $p + \\tfrac12\\rho V^2 = p_0$ is the working form.

### The conditions — check them every time
This form of the equation needs **all** of the following:
1. **Steady flow.** In unsteady flow an extra term ($\\rho\\,\\partial\\phi/\\partial t$) appears.
2. **No friction.** True outside [[boundary-layer|boundary layers]] and wakes. Inside them viscosity turns mechanical energy into heat and $p_0$ falls — the total pressure in a wake is below the free stream's, which is how a wake rake measures drag.
3. **Incompressible flow.** Density constant: good to about Mach 0.3 (see below).
4. **One streamline** — unless the flow is irrotational (free of [[vorticity-circulation|vorticity]]), when the constant is the same everywhere. Air approaching a wing from still air is irrotational, so every streamline outside the boundary layer shares one $p_0$: the pressure anywhere on the wing follows from the local speed alone.
5. **No energy added or removed.** A fan, propeller or turbine changes the total pressure. Apply Bernoulli on each side, never across it.

### A worked picture: the venturi
Air at 15 m/s in a duct passes a throat of half the area. [[continuity|Continuity]] doubles its speed to 30 m/s, and Bernoulli gives the fall in pressure:
$$p_1 - p_2 = \\tfrac12\\rho (V_2^2 - V_1^2) = 0.6125 \\times (900 - 225) = 413\\ \\mathrm{Pa}$$
— 42 mm on a water manometer. Turned round, a measured drop gives the speed: the **venturi meter**. In an ideal duct the pressure recovers fully as the air slows again; a real diffuser gives back 80–90 % of it.

| Speed | Dynamic pressure ½ρV² (sea level) | As a column of water |
|---|---|---|
| 10 m/s (breeze) | 61 Pa | 6 mm |
| 30 m/s (motorway) | 551 Pa | 56 mm |
| 60 m/s (light aircraft) | 2.2 kPa | 225 mm |
| 100 m/s | 6.1 kPa | 0.62 m |

### Compressibility: where constant density breaks
Air is compressible. Slowing towards a stagnation point it is squeezed a little, and the pressure rises a little more than $\\tfrac12\\rho V^2$. For isentropic flow of a perfect gas the exact relation is
$$\\frac{p_0}{p} = \\left(1 + \\frac{\\gamma - 1}{2} M^2\\right)^{\\gamma/(\\gamma-1)}$$
and expanding it for small Mach number $M$ gives
$$p_0 - p = \\tfrac12\\rho V^2\\left(1 + \\frac{M^2}{4} + \\frac{M^4}{40} + \\cdots\\right)$$
The bracket is the error of incompressible Bernoulli: 0.25 % at Mach 0.1, 2.3 % at Mach 0.3, 6.4 % at Mach 0.5 and 17 % at Mach 0.8. That is where the "Mach 0.3" rule comes from, and why airspeed indicators for fast aircraft are calibrated with the compressible formula ([[pitot-tube]], [[airspeeds]]). Above Mach 1 a shock stands in front of a pitot tube and a different relation — Rayleigh's — applies.

### What Bernoulli does not say
It does not say *why* the air speeds up over a wing: that comes from the shape, continuity and the momentum equation. See [[how-lift-works]] for the full story — and for the popular "equal transit time" argument, which is wrong. Nor does it say that moving air always has low pressure: it compares pressures along one streamline of one steady flow. A jet leaving a nozzle into a room is at room pressure however fast it goes; the air that blows two sheets of paper together was accelerated from still air at room pressure, which is why it is below room pressure between them.

> [!key] Speed and pressure trade places along a streamline: $p + \\tfrac12\\rho V^2 = p_0$. Measure $p_0$ and $p$ and you know the speed (the pitot tube); know the speeds round a body and you know its pressures — and so its lift.
`,
  derivation: {
    title: 'Bernoulli from Newton\'s second law',
    steps: [
      { text: 'Follow a small parcel of air, of cross-section $dA$ and length $ds$, along a streamline of a steady flow. Along its length the pressure changes by $dp$ and the height by $dz$.' },
      { text: 'Forces along the streamline — pressure difference and the component of weight (no friction):', tex: 'dF = -dp\\,dA - \\rho g\\,dA\\,dz' },
      { text: 'In steady flow the parcel\'s acceleration along the streamline is $V\\,dV/ds$. Mass times acceleration:', tex: '\\rho\\,dA\\,ds\\;V\\frac{dV}{ds} = -dp\\,dA - \\rho g\\,dA\\,dz' },
      { text: 'Divide by $dA$: Euler\'s equation along a streamline.', tex: 'dp + \\rho V\\,dV + \\rho g\\,dz = 0' },
      { text: 'With $\\rho$ constant, integrate from point 1 to point 2:', tex: 'p_1 + \\tfrac12\\rho V_1^2 + \\rho g z_1 = p_2 + \\tfrac12\\rho V_2^2 + \\rho g z_2' },
      { text: 'For a gas compressed isentropically, $p/\\rho^{\\gamma}$ is constant; integrating $dp/\\rho$ instead gives $\\frac{\\gamma}{\\gamma-1}\\frac{p}{\\rho} + \\frac{V^2}{2} = \\text{constant}$, which leads to the compressible stagnation pressure above.' }
    ]
  },
  ideas: [
    'Along a streamline of steady, frictionless, incompressible flow: p + ½ρV² + ρgz is constant.',
    'Static pressure + dynamic pressure = total pressure, which stays the same until friction or a fan changes it.',
    'Bernoulli is Newton\'s second law (energy conservation) for a fluid parcel, not a separate law.',
    'It fails inside boundary layers and wakes, across fans and propellers, in unsteady flow, and — by 2 % at Mach 0.3 and 17 % at Mach 0.8 — when compressibility matters.',
    'Fast air has low pressure only compared with the same air elsewhere on its streamline; a free jet is at room pressure however fast it moves.'
  ],
  pitfalls: [
    'Fast-moving air always has low pressure — Only compared with where the same air was slower, along one streamline. A jet leaving a nozzle into a room is at room pressure; so is the air inside a moving train.',
    'Bernoulli explains lift because the air over the top must catch up with the air underneath — There is no equal-transit rule; the air over the top reaches the trailing edge well before the air underneath. Bernoulli correctly turns the speeds into pressures, but the speeds come from the wing turning the flow.',
    'Bernoulli holds across a propeller or fan — The fan adds energy and the total pressure jumps across it. Apply Bernoulli upstream and downstream separately and bridge the disc with the momentum equation, as actuator-disc theory does.'
  ],
  formulas: [
    {
      name: 'Bernoulli between two points of a streamline (level flow)',
      expr: 'p1 + 0.5*rho*V1^2 = p2 + 0.5*rho*V2^2', tex: 'p_1 + \\tfrac12\\rho V_1^2 = p_2 + \\tfrac12\\rho V_2^2',
      vars: {
        p1: { name: 'static pressure at point 1', q: 'pressure', unit: 'hPa', value: 1013.25 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V1: { name: 'speed at point 1', q: 'speed', unit: 'm/s', value: 15 },
        p2: { name: 'static pressure at point 2', q: 'pressure', unit: 'hPa' },
        V2: { name: 'speed at point 2', q: 'speed', unit: 'm/s', value: 30 }
      },
      solveFor: 'p2',
      note: 'Steady, frictionless, incompressible (below about Mach 0.3), along one streamline, with no fan or turbine between the points. Use absolute or gauge pressures, but the same kind on both sides.',
      practice: { unknowns: ['p2', 'V2', 'V1'] },
      stories: {
        p2: 'Air at {p1} moving at {V1} speeds up to {V2} along a streamline (density {rho}). What is its pressure now?',
        V2: 'Air at {p1} and {V1} flows along a streamline to a point where the pressure is {p2}. How fast is it moving there (density {rho})?'
      }
    },
    {
      name: 'Bernoulli with height (liquids, tall flows)',
      expr: 'p1 + 0.5*rho*V1^2 + rho*g*z1 = p2 + 0.5*rho*V2^2 + rho*g*z2', tex: 'p_1 + \\tfrac12\\rho V_1^2 + \\rho g z_1 = p_2 + \\tfrac12\\rho V_2^2 + \\rho g z_2',
      vars: {
        p1: { name: 'pressure at point 1 (gauge)', q: 'pressure', unit: 'kPa', value: 200, signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        V1: { name: 'speed at point 1', q: 'speed', unit: 'm/s', value: 2 },
        g: { const: 'g' },
        z1: { name: 'height of point 1', q: 'length', unit: 'm', value: 0, signed: true },
        p2: { name: 'pressure at point 2 (gauge)', q: 'pressure', unit: 'kPa', signed: true },
        V2: { name: 'speed at point 2', q: 'speed', unit: 'm/s', value: 6 },
        z2: { name: 'height of point 2', q: 'length', unit: 'm', value: 5, signed: true }
      },
      solveFor: 'p2',
      note: 'The full form. For air the height terms are usually negligible; for water they are not (the defaults are a water pipe that narrows and rises 5 m).',
      stories: { p2: 'Water at {p1} gauge flows at {V1} at a height of {z1}; further along the pipe it flows at {V2} at a height of {z2}. What is the gauge pressure there?' }
    },
    {
      name: 'Venturi meter',
      expr: 'V1 = sqrt(2*dp/(rho*((A1/A2)^2 - 1)))', tex: 'V_1 = \\sqrt{\\dfrac{2\\,\\Delta p}{\\rho\\left[(A_1/A_2)^2 - 1\\right]}}',
      vars: {
        V1: { name: 'speed at the inlet', q: 'speed', unit: 'm/s' },
        dp: { name: 'pressure drop from inlet to throat', q: 'pressure', unit: 'Pa', value: 413, tex: '\\Delta p' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        A1: { name: 'inlet area', q: 'area', unit: 'cm²', value: 78.54 },
        A2: { name: 'throat area', q: 'area', unit: 'cm²', value: 39.27 }
      },
      note: 'Continuity plus Bernoulli between the inlet and the throat. Real meters multiply by a discharge coefficient of about 0.98. The drop is unaffected by losses in the diffuser downstream.',
      stories: { V1: 'A venturi of inlet area {A1} and throat area {A2} shows a pressure drop of {dp} in air of density {rho}. What is the inlet speed?', dp: 'Air of density {rho} enters a venturi at {V1}; inlet area {A1}, throat {A2}. What pressure drop will the manometer show?' }
    },
    {
      name: 'Manometer: pressure from a liquid column',
      expr: 'dp = rhoL*g*h', tex: '\\Delta p = \\rho_L\\, g\\, h',
      vars: {
        dp: { name: 'pressure difference', q: 'pressure', unit: 'Pa', tex: '\\Delta p' },
        rhoL: { name: 'density of the manometer liquid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_L' },
        g: { const: 'g' },
        h: { name: 'difference in liquid levels', q: 'length', unit: 'mm', value: 42.1 }
      },
      note: 'Water (1000 kg/m³) gives 9.81 Pa per millimetre; alcohol or paraffin (about 800) more millimetres per pascal; inclining the tube spreads the reading further.',
      stories: { dp: 'A water manometer shows a difference of {h}. What pressure difference is that?', h: 'What height difference will a pressure difference of {dp} show on a manometer filled with liquid of density {rhoL}?' }
    }
  ],
  examples: [
    {
      title: 'The venturi of the simulation',
      q: 'Air (ρ = 1.225 kg/m³) flows at 15 m/s into a venturi whose throat has half the inlet area. What is the pressure drop to the throat, in pascals and in millimetres of water?',
      steps: [
        'Continuity: $V_2 = 15 \\times 2 = 30$ m/s.',
        'Bernoulli: $p_1 - p_2 = \\tfrac12 \\times 1.225 \\times (30^2 - 15^2) = 0.6125 \\times 675 = 413$ Pa.',
        'On a water manometer: $h = \\Delta p/(\\rho_w g) = 413/(1000 \\times 9.81) = 0.042$ m.'
      ],
      a: '413 Pa, which lifts a water column 42 mm.'
    },
    {
      title: 'Suction over a wing',
      q: 'A light aircraft flies at 60 m/s at sea level. At a point on the upper surface the air moves at 78 m/s. Find the pressure there relative to the free stream, and the pressure coefficient.',
      steps: [
        'Both points lie on streamlines that came from the same undisturbed air, so they share one total pressure.',
        '$p - p_\\infty = \\tfrac12\\rho(V_\\infty^2 - V^2) = 0.6125 \\times (3600 - 6084) = -1521$ Pa.',
        'Pressure coefficient: $C_p = (p - p_\\infty)/(\\tfrac12\\rho V_\\infty^2) = -1521/2205 = -0.69$, the same as $1 - (V/V_\\infty)^2 = 1 - 1.69$.'
      ],
      a: 'About 1.5 kPa of suction; C_p = −0.69.'
    },
    {
      title: 'How wrong is incompressible Bernoulli at 100 m/s?',
      q: 'Sea-level air (p = 101 325 Pa, a = 340.3 m/s) at 100 m/s is brought to rest in a pitot tube. Compare ½ρV² with the exact isentropic pressure rise.',
      steps: [
        'Mach number: $M = 100/340.3 = 0.294$.',
        'Incompressible: $\\tfrac12 \\times 1.225 \\times 100^2 = 6125$ Pa.',
        'Isentropic: $p_0 - p = p[(1 + 0.2M^2)^{3.5} - 1] = 101\\,325 \\times [(1.01727)^{3.5} - 1] = 6258$ Pa.',
        'The incompressible value is 2.2 % low — the $M^2/4$ term: $0.294^2/4 = 0.022$.'
      ],
      a: '6258 Pa against 6125 Pa: incompressible Bernoulli is 2 % low at about Mach 0.3.'
    }
  ],
  quiz: [
    { q: 'Air at 20 m/s speeds up to 40 m/s along a streamline in low-speed flow (ρ = 1.225 kg/m³). By how much does its static pressure fall?', answer: 735, unit: 'Pa',
      why: 'Δp = ½ρ(V₂² − V₁²) = 0.6125 × (1600 − 400) = 735 Pa.' },
    { q: 'Which pair of points can be joined by p + ½ρV² = constant?', choices: ['just upstream and just downstream of a running fan', 'the free stream and a point just outside the boundary layer of a wing', 'the free stream and a point in the wake behind a car', 'the still air of a room and a point in a jet blowing into it'], a: 1,
      why: 'Outside the boundary layer the flow round a wing is steady, nearly frictionless and irrotational, with the free-stream total pressure. The fan adds energy, the wake has lost total pressure, and the jet\'s air came from a higher-pressure source.' },
    { q: 'Doubling the speed of the air doubles its dynamic pressure.', a: false,
      why: 'q = ½ρV²: twice the speed, four times the dynamic pressure.' },
    { q: 'At Mach 0.5, incompressible Bernoulli underestimates the rise to stagnation pressure by about…', choices: ['0.25 %', '2 %', '6 %', '25 %'], a: 2,
      why: 'The error factor is 1 + M²/4 + M⁴/40 = 1 + 0.0625 + 0.0016 ≈ 1.064: about 6 %.' },
    { q: 'The total pressure measured in the wake behind a cylinder is ___ the free-stream total pressure.', choices: ['higher than', 'equal to', 'lower than', 'unrelated to'], a: 2,
      why: 'Friction and mixing in the separated wake turn mechanical energy into heat, lowering p₀. The missing total pressure (and momentum) in the wake is the drag.' }
  ],
  problems: [
    { q: 'A water manometer across a venturi in an air duct (inlet 100 mm, throat 70 mm diameter) reads 30 mm. The air density is 1.2 kg/m³. What is the inlet speed?', answer: 12.45, unit: 'm/s', tol: 0.02,
      hint: 'Pressure from the manometer, area ratio from the diameters, then the venturi formula.',
      steps: ['$\\Delta p = 1000 \\times 9.807 \\times 0.030 = 294.2$ Pa.', '$A_1/A_2 = (100/70)^2 = 2.041$, so $(A_1/A_2)^2 - 1 = 3.165$.', '$V_1 = \\sqrt{2 \\times 294.2/(1.2 \\times 3.165)} = \\sqrt{154.9} = 12.45$ m/s.'] },
    { q: 'How fast must sea-level air flow for its dynamic pressure to be 1 % of standard atmospheric pressure?', answer: 40.7, unit: 'm/s', tol: 0.02,
      steps: ['$q = 1013$ Pa.', '$V = \\sqrt{2q/\\rho} = \\sqrt{2 \\times 1013/1.225} = 40.7$ m/s — about 146 km/h.'] }
  ],
  applications: [
    'Airspeed measurement with pitot-static tubes.',
    'Venturi and orifice flowmeters in ducts, pipes and carburettors.',
    'Pressures on wings, cars and buildings from the local air speed (the pressure coefficient).',
    'Setting wind-tunnel speed from the pressure drop across the contraction.'
  ],
  history: 'Daniel Bernoulli published the idea in Hydrodynamica (1738), for water flowing from tanks; Leonhard Euler derived the equation in its modern form from his equations of fluid motion in the 1750s. Giovanni Battista Venturi studied flow through narrowing pipes in 1797, and Clemens Herschel turned the effect into the venturi meter in 1887.',
  sim: 'flow-venturi'
},

{
  id: 'momentum-equation', parent: 'flow-description', title: 'The momentum equation', level: 2,
  short: 'Newton\'s second law for a flowing fluid: the net force on the fluid inside a control volume equals the momentum per second flowing out minus the momentum per second flowing in. It gives the thrust of engines, the force of jets on vanes and drag from wake surveys — without knowing the details inside.',
  keywords: ['control volume', 'momentum flux', 'Newton\'s second law', 'jet force', 'thrust', 'reaction force', 'Reynolds transport theorem', 'wake survey', 'nozzle force', 'vane', 'Pelton wheel', 'pressure thrust'],
  prereq: ['continuity', 'physics:newtons-second-law', 'physics:momentum', 'air-pressure'],
  related: ['bernoulli', 'thrust', 'momentum-theory', 'navier-stokes', 'drag-equation', 'force-balance', 'rocket-propulsion', 'how-lift-works', 'propulsive-efficiency', 'physics:newtons-third-law'],
  body: `
Newton's second law says that force equals the rate of change of momentum. For a solid body that is $F = ma$. For air streaming through an engine or round a vane, different air is inside at every moment, so we apply the law to a **control volume**: a fixed region of space, bounded by a surface we choose, that the fluid flows through.

### The steady-flow momentum equation
In steady flow the momentum stored inside the control volume does not change, so the net force on the fluid within it must supply exactly the difference between the momentum leaving and the momentum arriving each second:
$$\\sum \\vec F = \\sum_{\\text{out}} \\dot{m}\\,\\vec V - \\sum_{\\text{in}} \\dot{m}\\,\\vec V$$
$\\dot{m}\\vec V$ is the **momentum flux** (kg/s × m/s = N): the momentum a stream carries across the surface every second. The forces on the fluid are of three kinds:
- **pressure** where the surface cuts through the fluid — $pA$ on each inlet and outlet (gauge pressure, if the atmosphere acts all round the outside);
- forces from **solid parts** inside or cut by the surface — the vane, the engine, the nozzle wall, the pipe support: usually the unknown;
- **body forces** such as weight — usually negligible for air.

It is a vector equation, applied along each direction separately. Its power is that it needs only what happens on the boundary: turbulence, shocks and whirling compressor blades inside do not matter.

### A jet turned by a vane
A water jet of mass flow $\\dot{m}$ and speed $V$ strikes a vane that turns it through an angle $\\theta$ and lets it go at speed $V_2$. Along the jet's first direction the fluid brings in a momentum flux $\\dot{m} V$ and takes out $\\dot{m} V_2\\cos\\theta$. The jet is surrounded by the atmosphere, so the pressure terms cancel, and the force of the vane on the water is $\\dot{m}(V_2 \\cos\\theta - V)$. The water pushes on the vane with the opposite force:
$$F_x = \\dot{m}\\,(V - V_2\\cos\\theta) = \\rho A V^2 (1 - \\cos\\theta) \\quad \\text{when } V_2 = V$$

| Vane | θ | Force along the jet (× ρAV²) |
|---|---|---|
| Nothing: the jet goes straight on | 0° | 0 |
| Flat plate square to the jet | 90° | 1 |
| Cone deflector | 135° | 1.71 |
| Hemispherical cup | 180° | 2 |

A 12 mm water jet at 12 m/s carries 1.36 kg/s and pushes a flat plate with 16.3 N and a cup with 32.6 N. That doubling is why **Pelton-wheel** buckets turn the water almost straight back. In practice the water leaves a little slower than it arrived, because of friction on the vane, and a measured cup force is a few per cent below the ideal.

### Engines and propellers
Put a control volume round a jet engine, with its front far upstream and its back across the nozzle exit. Air enters at the flight speed $V_0$ and leaves at the jet speed $V_e$ (the fuel adds a few per cent to the mass, often neglected). If the exit pressure $p_e$ differs from the ambient $p_a$ — as in a choked convergent nozzle — the pressure on the exit plane adds a term:
$$T = \\dot{m}\\,(V_e - V_0) + (p_e - p_a)\\,A_e$$
Applied to an idealised propeller disc, the same equation gives [[momentum-theory|momentum theory]]: thrust equals mass flow times the speed added. It also shows the price: making thrust by accelerating a little air a lot wastes more kinetic energy in the jet than accelerating a lot of air a little — the root of [[propulsive-efficiency]].

### Drag from a wake
Wind-tunnel engineers find the drag of a two-dimensional wing section by measuring the speed deficit in its wake with a rake of pitot tubes. With the control volume closed far enough downstream that the pressure has returned to its free-stream value, the drag per metre of span is the momentum missing from the wake:
$$D' = \\rho \\int u\\,(U - u)\\,dy$$
Lift has a momentum reading too: a wing gives air a downward momentum every second, and the reaction is lift (see [[how-lift-works]]).

> [!tip] Choose the control volume to make life easy: cut through the fluid where the velocity and pressure are known (a free jet at atmospheric pressure, the undisturbed stream far upstream), and cut through a solid where you want the force.

### The general form
For unsteady flow the change of momentum stored inside is added. The **Reynolds transport theorem** turns the law for a fixed lump of matter into one for a control volume:
$$\\sum \\vec F = \\frac{d}{dt}\\int_{CV} \\rho \\vec V\\, d\\mathcal{V} + \\oint_{CS} \\rho \\vec V\\,(\\vec V\\cdot \\hat{n})\\, dA$$
Shrunk to an infinitesimal box, with the viscous stresses written out, it becomes the [[navier-stokes|Navier–Stokes equations]].

> [!key] The momentum equation needs only the flows of momentum across the boundary and the pressures there — which makes it the natural tool for thrust, jet forces and drag.
`,
  ideas: [
    'Net force on the fluid in a control volume = momentum flux out − momentum flux in (steady flow).',
    'Momentum flux ṁV has the units of force; the equation applies separately along each direction.',
    'Pressure forces on the cut surfaces count; round a free jet at atmospheric pressure they cancel.',
    'A jet turned through θ pushes with ρAV²(1 − cos θ): a flat plate ρAV², a cup twice as much.',
    'Thrust = ṁ(Vₑ − V₀) + (pₑ − pₐ)Aₑ; drag = the momentum missing from the wake.'
  ],
  pitfalls: [
    'A jet turned straight back (θ = 180°) pushes no harder than one stopped by a plate, because the water leaves at the same speed — Momentum is a vector: reversing the velocity changes the momentum by 2ṁV, so the force doubles.',
    'The force of a jet on a plate depends on how the plate is mounted — In steady flow it depends only on the momentum fluxes arriving and leaving: ρAV²(1 − cos θ) for a smooth vane, whatever holds it.',
    'Thrust comes from the exhaust pushing on the air behind the aircraft — It comes from the forces between the engine and the air flowing through it; an exhaust pushes just as well into a vacuum, as a rocket\'s does. The air behind matters only through the exit-pressure term.'
  ],
  formulas: [
    {
      name: 'Steady momentum balance, one inlet and one outlet',
      expr: 'F = mdot*(V2 - V1)', tex: 'F = \\dot{m}\\,(V_2 - V_1)',
      vars: {
        F: { name: 'net force on the fluid (along the line)', q: 'force', unit: 'N', signed: true },
        mdot: { name: 'mass flow rate', q: 'massflow', unit: 'kg/s', value: 200, tex: '\\dot{m}' },
        V2: { name: 'velocity leaving', q: 'speed', unit: 'm/s', value: 60, signed: true },
        V1: { name: 'velocity arriving', q: 'speed', unit: 'm/s', value: 50, signed: true }
      },
      note: 'Components along one direction. F includes every force on the fluid in the control volume: pressures on the cut surfaces and the push of any solid parts.',
      stories: { F: 'A propeller moves {mdot} of air, speeding it from {V1} far ahead to {V2} far behind. What force acts on the air (and so, reversed, on the propeller)?', V2: 'A fan must make a force of {F} on {mdot} of air arriving at {V1}. At what speed must the air leave?' }
    },
    {
      name: 'Force of a jet turned through an angle',
      expr: 'F = rho*A*V^2*(1 - cos(theta))', tex: 'F = \\rho A V^2 (1 - \\cos\\theta)',
      vars: {
        F: { name: 'force on the vane along the jet', q: 'force', unit: 'N' },
        rho: { name: 'density of the jet', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        A: { name: 'jet area', q: 'area', unit: 'mm²', value: 113.1 },
        V: { name: 'jet speed', q: 'speed', unit: 'm/s', value: 12 },
        theta: { name: 'turning angle', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'A stationary, frictionless vane: the jet leaves at its arrival speed. 90° is a flat plate, 180° a cup that returns the jet.',
      stories: { F: 'A water jet of {A} at {V} is turned through {theta} by a vane. What force does it exert along its original direction?', theta: 'A jet of {A} at {V} (density {rho}) pushes a vane with {F}. Through what angle does the vane turn it?', V: 'A cup turning a jet of {A} through {theta} must feel {F}. How fast must the water be?' }
    },
    {
      name: 'Thrust of a jet engine',
      expr: 'T = mdot*(Ve - V0) + (pe - pa)*Ae', tex: 'T = \\dot{m}\\,(V_e - V_0) + (p_e - p_a)\\,A_e',
      vars: {
        T: { name: 'thrust', q: 'force', unit: 'kN', signed: true },
        mdot: { name: 'mass flow of air', q: 'massflow', unit: 'kg/s', value: 50, tex: '\\dot{m}' },
        Ve: { name: 'jet speed at the nozzle exit', q: 'speed', unit: 'm/s', value: 550 },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 70 },
        pe: { name: 'static pressure at the nozzle exit (absolute)', q: 'pressure', unit: 'kPa', value: 180 },
        pa: { name: 'ambient pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325 },
        Ae: { name: 'nozzle exit area', q: 'area', unit: 'm²', value: 0.2 }
      },
      note: 'Fuel mass neglected. A convergent nozzle that is choked leaves its jet above ambient pressure, and the pressure term adds thrust; a fully expanded nozzle has pₑ = pₐ.',
      stories: { T: 'A turbojet swallows {mdot} at {V0} and exhausts it at {Ve}; its exit of {Ae} is at {pe} while the ambient pressure is {pa}. What is its thrust?' }
    }
  ],
  examples: [
    {
      title: 'A jet on a plate and on a cup',
      q: 'A 12 mm water jet leaves a nozzle at 12 m/s. Find the force on a flat plate square to it, and on a cup that turns it back through 180°.',
      steps: [
        'Area: $A = \\tfrac{\\pi}{4}(0.012)^2 = 1.131 \\times 10^{-4}$ m²; mass flow $\\dot{m} = \\rho A V = 1000 \\times 1.131 \\times 10^{-4} \\times 12 = 1.357$ kg/s.',
        'Plate (θ = 90°): the water leaves sideways with no momentum along the jet, so $F = \\dot{m} V = 1.357 \\times 12 = 16.3$ N.',
        'Cup (θ = 180°): the water leaves backwards at 12 m/s, $F = \\dot{m}(V + V) = 32.6$ N.'
      ],
      a: '16.3 N on the plate, 32.6 N on the cup (about the weight of 1.7 and 3.3 kg).'
    },
    {
      title: 'The pull on a fire-hose nozzle',
      q: 'Water at 600 L/min (0.01 m³/s) flows from a 65 mm hose through a nozzle into a 25 mm jet at atmospheric pressure. What force does the water exert on the nozzle, and so on its coupling? Ignore friction and weight.',
      steps: [
        'Speeds: $V_1 = 0.01/(\\tfrac{\\pi}{4}0.065^2) = 3.01$ m/s in the hose; $V_2 = 0.01/(\\tfrac{\\pi}{4}0.025^2) = 20.4$ m/s in the jet.',
        'Bernoulli gives the gauge pressure at the coupling: $p_1 = \\tfrac12 \\times 1000 \\times (20.4^2 - 3.01^2) = 203$ kPa.',
        'Control volume round the nozzle, along the flow: $p_1 A_1 + F_{\\text{nozzle on water}} = \\dot{m}(V_2 - V_1)$.',
        '$F_{\\text{nozzle on water}} = 10 \\times (20.4 - 3.0) - 203\\,000 \\times 0.00332 = 174 - 674 = -500$ N.',
        'So the water pushes the nozzle forward, off the hose, with about 500 N — the coupling must hold it. The jet itself carries $\\dot{m}V_2 \\approx 204$ N of momentum per second, the reaction that makes a hose line push back.'
      ],
      a: 'About 500 N trying to pull the nozzle off the hose.'
    },
    {
      title: 'Drag from a wake rake',
      q: 'Behind a wing section of 0.3 m chord in a 30 m/s tunnel (ρ = 1.225 kg/m³), a rake finds a wake 60 mm wide in which the speed dips linearly to 27 m/s at the centre and recovers to 30 m/s at the edges. What are the drag per metre of span and the drag coefficient?',
      steps: [
        'Deficit $U - u$ falls from $\\Delta U = 3$ m/s at the centre to 0 at $w = 0.03$ m either side.',
        'For this triangular wake $\\int u(U - u)\\,dy = U\\,\\Delta U\\,w - \\tfrac23 \\Delta U^2 w = 30 \\times 3 \\times 0.03 - \\tfrac23 \\times 9 \\times 0.03 = 2.52$ m³/s².',
        '$D\' = \\rho \\times 2.52 = 3.09$ N per metre of span.',
        '$c_d = D\'/(\\tfrac12\\rho U^2 c) = 3.09/(551 \\times 0.3) = 0.019$.'
      ],
      a: 'About 3.1 N per metre of span; c_d ≈ 0.019.'
    }
  ],
  quiz: [
    { q: 'A 20 mm water jet at 10 m/s strikes a flat plate square to it. What force does it exert?', answer: 31.4, unit: 'N',
      why: 'F = ρAV² = 1000 × 3.14 × 10⁻⁴ × 100 = 31.4 N.' },
    { q: 'The same jet is turned straight back by a smooth cup. The force becomes…', choices: ['half as large', 'the same', 'twice as large', 'four times as large'], a: 2,
      why: 'The momentum changes from +ṁV to −ṁV, a change of 2ṁV per second: twice the plate\'s force.' },
    { q: 'A jet engine on a test stand takes in 80 kg/s of air and exhausts it at 500 m/s, with the nozzle exit at ambient pressure. What is its thrust?', answer: 40, unit: 'kN',
      why: 'T = ṁ(Vₑ − V₀) = 80 × (500 − 0) = 40 000 N; the pressure term is zero.' },
    { q: 'To use the momentum equation on a jet engine you need the pressure and velocity everywhere inside it.', a: false,
      why: 'Only the momentum fluxes and pressures on the control surface are needed. That is the equation\'s great strength.' },
    { q: 'The speed of a jet from the same nozzle is doubled. Its force on a plate…', choices: ['doubles', 'quadruples', 'rises eight times', 'rises by √2'], a: 1,
      why: 'Both the mass flow and the momentum per kilogram double: F = ρAV² goes up four times.' }
  ],
  problems: [
    { q: 'A propeller on a static test stand moves 30 kg/s of air from rest to 25 m/s in its slipstream. What thrust does it make?', answer: 750, unit: 'N', tol: 0.02,
      steps: ['$T = \\dot{m}(V_e - V_0) = 30 \\times (25 - 0) = 750$ N.'] },
    { q: 'A turbojet flying at 250 m/s takes in 60 kg/s and exhausts it at 650 m/s. The nozzle exit of 0.25 m² is at 40 kPa while the ambient pressure is 26.5 kPa. Find the thrust.', answer: 27.4, unit: 'kN', tol: 0.02,
      steps: ['Momentum thrust: $60 \\times (650 - 250) = 24\\,000$ N.', 'Pressure thrust: $(40\\,000 - 26\\,500) \\times 0.25 = 3375$ N.', 'Total: 27 375 N ≈ 27.4 kN.'] }
  ],
  applications: [
    'Thrust of jet engines, rockets, propellers and rotors.',
    'Forces on pipe bends, nozzles and hose couplings, which must be anchored.',
    'Pelton turbines and other jet-driven machines.',
    'Drag of wing sections from wake-rake surveys in wind tunnels.',
    'The momentum view of lift and downwash.'
  ],
  history: 'Newton\'s second law (1687) is the root. Euler applied it to fluids in the 1750s; W. J. M. Rankine (1865) and R. E. Froude (1889) put a control volume round an idealised propeller and founded momentum theory, and Lester Pelton\'s split bucket, patented in 1880, turned the 180° jet into the most efficient water turbine for high heads. The general control-volume form is called the Reynolds transport theorem, after Osborne Reynolds.',
  sim: 'flow-jet'
},

{
  id: 'navier-stokes', parent: 'flow-description', title: 'The Navier–Stokes equations', level: 3,
  short: 'The equations of motion of a viscous fluid: Newton\'s second law for every small parcel of air, with pressure, viscous stress and gravity as the forces. With continuity they govern every flow in this app — and in general they can only be solved numerically.',
  keywords: ['Navier-Stokes', 'Euler equations', 'viscous stress', 'convective acceleration', 'material derivative', 'nonlinear', 'CFD', 'DNS', 'RANS', 'LES', 'Kolmogorov scale', 'Millennium Prize', 'Couette flow', 'Poiseuille flow', 'Stokes flow'],
  prereq: ['momentum-equation', 'air-viscosity', 'math:partial-derivatives', 'math:vector-calculus'],
  related: ['continuity', 'reynolds-number', 'boundary-layer', 'no-slip', 'turbulence', 'cfd', 'turbulence-models', 'potential-flow-basics', 'vorticity-circulation', 'dalembert-paradox'],
  body: `
Apply Newton's second law to a small parcel of air; include the forces from pressure, from gravity and from **viscosity** — the friction between layers sliding over each other — and you have the Navier–Stokes equations. For a fluid of constant density and viscosity:
$$\\rho\\left(\\frac{\\partial \\vec V}{\\partial t} + (\\vec V\\cdot\\nabla)\\vec V\\right) = -\\nabla p + \\mu\\nabla^2\\vec V + \\rho\\vec g$$
together with continuity, $\\nabla\\cdot\\vec V = 0$. Four equations (three components of momentum, one of mass) for four unknowns — three velocity components and the pressure — at every point and every instant.

### Reading the terms
| Term | What it is |
|---|---|
| $\\rho\\,\\partial\\vec V/\\partial t$ | the flow at a fixed point changing with time (zero in steady flow) |
| $\\rho(\\vec V\\cdot\\nabla)\\vec V$ | **convective acceleration**: a parcel speeding up or turning because it moves to where the flow is different — present even in steady flow |
| $-\\nabla p$ | the push from high pressure towards low |
| $\\mu\\nabla^2\\vec V$ | viscous stress: momentum diffusing from faster layers to slower ones |
| $\\rho\\vec g$ | weight — usually negligible in aerodynamics, except in buoyant flows |

The left side is mass times the acceleration of the parcel, the **material derivative** $D\\vec V/Dt$. The convective term makes the equations **nonlinear** — the velocity multiplies its own gradient — and that single fact is behind turbulence, the lack of general solutions and the cost of computing flows. For compressible flow the density varies, the viscous term gains a part for expansion, and an energy equation and the gas law $p = \\rho R T$ join the set.

### Which terms matter: the Reynolds number
Compare the convective term, of order $\\rho V^2/L$, with the viscous one, of order $\\mu V/L^2$. Their ratio is the [[reynolds-number|Reynolds number]], $\\mathrm{Re} = \\rho V L/\\mu$. Round a light aircraft's wing it is about five million, and viscosity is negligible — except in a thin layer at the surface, where the air must come to rest ([[no-slip]]) and the gradients are so steep that the viscous term matters however large Re is. Prandtl's insight of 1904 was to split the flow: a thin **[[boundary-layer|boundary layer]]** where the full equations apply, and an outer flow where viscosity can be dropped. On the light aircraft's 1.5 m chord that layer is only about 25 mm thick at the trailing edge.

### Simplified forms
- **Euler equations** ($\\mu = 0$): inviscid flow — good outside boundary layers, and the basis of shock calculations.
- **Potential flow** (inviscid and irrotational): the velocity is the gradient of a potential that obeys [[math:laplace-equation|Laplace's equation]] — the panel methods of the [[potential-flow-basics|potential-flow]] pages and the airfoil lab.
- **Boundary-layer equations**: the thin-layer approximation, solved along a surface.
- **Stokes (creeping) flow**, for Re well below 1: the convective term dropped — fog droplets, pollen and bacteria, whose drag is proportional to speed.
- **Exact solutions** exist for a few simple geometries: **Couette** flow between a fixed and a sliding plate (a straight-line profile, shear stress $\\tau = \\mu U/h$), **Poiseuille** flow in a pipe (a parabola), the flow into a stagnation point, the suddenly started plate.

### Solving them for real flows
Real aerodynamic flows are turbulent, with eddies from the size of the body down to the **Kolmogorov scale** $\\eta \\approx L\\,\\mathrm{Re}^{-3/4}$, where viscosity finally turns their motion into heat. Resolving every eddy — **direct numerical simulation (DNS)** — needs about $\\mathrm{Re}^{9/4}$ grid points in three dimensions: for a wing at Re = 5 million about $10^{15}$ points, far beyond any computer for a whole aircraft. Engineering [[cfd|CFD]] therefore averages the equations in time (**RANS**) and models what the turbulence does to the mean flow ([[turbulence-models]]), or resolves only the large eddies (**LES**).

> [!fact] Whether smooth solutions of the three-dimensional Navier–Stokes equations always exist, or can blow up, has never been proved. It is one of the seven Millennium Prize Problems announced by the Clay Mathematics Institute in 2000, with a prize of one million US dollars.

> [!key] Every flow in aerodynamics obeys Navier–Stokes plus continuity. Most of the subject is the art of knowing which terms can be dropped, and where.
`,
  ideas: [
    'Navier–Stokes is Newton\'s second law for each fluid parcel, with pressure, viscous and body forces.',
    'The convective acceleration (V·∇)V makes the equations nonlinear — the source of turbulence and of their difficulty.',
    'The Reynolds number compares inertia with viscosity; at high Re viscosity matters only in thin boundary layers and wakes.',
    'Dropping viscosity gives the Euler equations; dropping vorticity too gives potential flow.',
    'Resolving every eddy costs about Re^(9/4) grid points, so engineering CFD models turbulence instead.'
  ],
  pitfalls: [
    'At high Reynolds number viscosity can be ignored everywhere — Not at a wall. No-slip makes the velocity gradient so steep in the boundary layer that viscous stress matches inertia there, however large Re is. Ignoring it gives d\'Alembert\'s paradox of zero drag.',
    'CFD has solved the Navier–Stokes equations — CFD finds approximate numerical solutions for particular cases, and most engineering CFD solves averaged equations with a turbulence model that is itself an approximation. No general analytical solution exists.',
    'In steady flow nothing accelerates — The flow at each point is unchanging, but each parcel accelerates as it moves into regions of different velocity. Air sweeping round the nose of a wing accelerates at thousands of g.'
  ],
  formulas: [
    {
      name: 'Reynolds number: inertia against viscosity',
      expr: 'Re = rho*V*L/mu', tex: '\\mathrm{Re} = \\frac{\\rho V L}{\\mu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 50 },
        L: { name: 'length (e.g. the chord)', q: 'length', unit: 'm', value: 1.5 },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'Pa·s', value: 1.79e-5, tex: '\\mu' }
      },
      note: 'The ratio of the convective (inertia) term to the viscous term of the Navier–Stokes equations. Air at 15 °C: μ = 1.79 × 10⁻⁵ Pa·s.',
      stories: { Re: 'A wing of chord {L} flies at {V} in air of density {rho} and viscosity {mu}. What is its Reynolds number?', V: 'A model of length {L} must reach a Reynolds number of {Re} in air of density {rho} and viscosity {mu}. How fast must the tunnel run?' }
    },
    {
      name: 'Kolmogorov scale: the smallest eddies',
      expr: 'eta = L*Re^(-3/4)', tex: '\\eta = L\\,\\mathrm{Re}^{-3/4}',
      vars: {
        eta: { name: 'size of the smallest eddies', q: 'length', unit: 'µm', tex: '\\eta' },
        L: { name: 'size of the largest eddies (the body)', q: 'length', unit: 'm', value: 1.5 },
        Re: { name: 'Reynolds number', value: 5e6, tex: '\\mathrm{Re}' }
      },
      note: 'An order-of-magnitude estimate: the scale at which viscosity dissipates the turbulence.',
      stories: { eta: 'In a turbulent flow round a body of {L} at a Reynolds number of {Re}, how small are the smallest eddies?' }
    },
    {
      name: 'Grid points for direct numerical simulation',
      expr: 'N = Re^(9/4)', tex: 'N \\approx \\mathrm{Re}^{9/4}',
      vars: {
        N: { name: 'number of grid points (order of magnitude)' },
        Re: { name: 'Reynolds number', value: 5e6, tex: '\\mathrm{Re}' }
      },
      note: 'The ratio L/η cubed, for a three-dimensional turbulent flow. The time steps add roughly another factor of Re^(3/4) to the cost.',
      stories: { N: 'About how many grid points would a direct simulation of turbulence need at a Reynolds number of {Re}?', Re: 'A computer can hold {N} grid points. Up to what Reynolds number could it simulate turbulence directly?' }
    },
    {
      name: 'Couette flow: shear stress between sliding plates',
      expr: 'tau = mu*U/h', tex: '\\tau = \\mu\\,\\frac{U}{h}',
      vars: {
        tau: { name: 'shear stress on each plate', q: 'stress', unit: 'Pa', tex: '\\tau' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'Pa·s', value: 1.79e-5, tex: '\\mu' },
        U: { name: 'speed of the moving plate', q: 'speed', unit: 'm/s', value: 10 },
        h: { name: 'gap between the plates', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'An exact solution of Navier–Stokes: a straight-line velocity profile across the gap. The basis of lubrication and of viscometers.',
      stories: { tau: 'A plate slides at {U} over another {h} away, with fluid of viscosity {mu} between them. What shear stress does the fluid exert?', mu: 'A plate sliding at {U} over a gap of {h} feels a shear stress of {tau}. What is the viscosity of the fluid?' }
    }
  ],
  examples: [
    {
      title: 'Where viscosity matters on a wing',
      q: 'A light aircraft\'s wing of 1.5 m chord flies at 50 m/s at sea level (ρ = 1.225 kg/m³, μ = 1.79 × 10⁻⁵ Pa·s). Find the Reynolds number and estimate the thickness of the turbulent boundary layer at the trailing edge, $\\delta \\approx 0.37\\,x\\,\\mathrm{Re}_x^{-1/5}$.',
      steps: [
        '$\\mathrm{Re} = 1.225 \\times 50 \\times 1.5/1.79 \\times 10^{-5} = 5.1 \\times 10^6$.',
        '$\\mathrm{Re}^{1/5} = 22.0$, so $\\delta \\approx 0.37 \\times 1.5/22.0 = 0.025$ m.',
        'Viscosity matters in a layer 25 mm thick on a 1500 mm chord — under 2 % of it. Everywhere else the Euler equations (or potential flow) do.'
      ],
      a: 'Re ≈ 5 × 10⁶; the viscous layer is about 25 mm thick at the trailing edge.'
    },
    {
      title: 'The cost of computing every eddy',
      q: 'For the same wing (Re = 5 × 10⁶, L = 1.5 m), estimate the Kolmogorov scale and the number of grid points a direct numerical simulation would need.',
      steps: [
        '$\\eta \\approx L\\,\\mathrm{Re}^{-3/4} = 1.5 \\times (5 \\times 10^6)^{-0.75} = 1.5 \\times 9.5 \\times 10^{-6} = 1.4 \\times 10^{-5}$ m, about 14 µm.',
        '$N \\approx \\mathrm{Re}^{9/4} = (5 \\times 10^6)^{2.25} \\approx 1.2 \\times 10^{15}$ points.',
        'At a few hundred bytes per point that is hundreds of petabytes of memory for one wing section — which is why engineers model turbulence (RANS, LES) instead.'
      ],
      a: 'Eddies down to about 14 µm, and some 10¹⁵ grid points.'
    },
    {
      title: 'Couette flow in air and in oil',
      q: 'A plate slides at 10 m/s over another. Find the shear stress with (a) air (μ = 1.79 × 10⁻⁵ Pa·s) in a 1 mm gap, (b) oil (μ = 0.05 Pa·s) in a 0.05 mm gap, as in a bearing.',
      steps: [
        '(a) $\\tau = \\mu U/h = 1.79 \\times 10^{-5} \\times 10/0.001 = 0.18$ Pa.',
        '(b) $\\tau = 0.05 \\times 10/0.000\\,05 = 10\\,000$ Pa.',
        'The oil film is 55 000 times more "sticky": viscosity 2800 times larger and a gap 20 times thinner.'
      ],
      a: '0.18 Pa in air, 10 kPa in the oil film.'
    }
  ],
  quiz: [
    { q: 'Which term makes the Navier–Stokes equations nonlinear?', choices: ['the pressure gradient −∇p', 'the viscous term μ∇²V', 'the convective acceleration ρ(V·∇)V', 'the weight ρg'], a: 2,
      why: 'In (V·∇)V the velocity multiplies its own gradient. The other terms are linear in V.' },
    { q: 'Setting the viscosity to zero in the Navier–Stokes equations gives…', choices: ['the Euler equations', 'Laplace\'s equation', 'the boundary-layer equations', 'Stokes flow'], a: 0,
      why: 'Inviscid flow obeys the Euler equations. Laplace\'s equation needs irrotational flow as well; Stokes flow drops the other term, inertia.' },
    { q: 'In a steady flow no parcel of air accelerates.', a: false,
      why: 'Steady means the flow at each fixed point does not change. A parcel moving from a slow region to a fast one still accelerates — the convective term.' },
    { q: 'What is the Reynolds number of air (ρ = 1.2 kg/m³, μ = 1.8 × 10⁻⁵ Pa·s) flowing at 20 m/s past a cylinder 0.1 m across?', answer: 133333,
      why: 'Re = ρVD/μ = 1.2 × 20 × 0.1/1.8 × 10⁻⁵ = 1.33 × 10⁵.' },
    { q: 'Roughly how many grid points would a direct numerical simulation need at Re = 10⁶?', choices: ['10⁶', '10⁹', '10¹³·⁵', '10²⁴'], a: 2,
      why: 'N ≈ Re^(9/4) = (10⁶)^2.25 = 10^13.5, about 3 × 10¹³.' }
  ],
  applications: [
    'CFD of aircraft, cars, buildings and turbomachinery (RANS, LES, and DNS for research).',
    'Weather and climate models, which add rotation, buoyancy and moisture.',
    'Lubrication, blood flow and microfluidics, where exact or low-Reynolds-number solutions apply.',
    'Deciding which approximation — inviscid, potential, boundary layer — is safe in each region of a flow.'
  ],
  history: 'Claude-Louis Navier wrote the equations in 1822 from a molecular model; Barré de Saint-Venant (1843) and George Gabriel Stokes (1845) derived them from the idea that stress is proportional to the rate of strain, the form used today. Euler\'s inviscid equations were nearly seventy years older (1757). Prandtl\'s boundary-layer paper of 1904 made them useful for aerodynamics, and computers began to solve them for whole flows in the 1960s and 1970s.'
},

{
  id: 'vorticity-circulation', parent: 'flow-description', title: 'Vorticity and circulation', level: 2,
  short: 'Vorticity measures how fast a small blob of air is spinning (twice its rate of rotation); circulation is the total swirl round a closed loop, ∮V·ds. Stokes\' theorem links them, Kelvin\'s theorem conserves circulation, and the Kutta–Joukowski theorem turns a wing\'s circulation into lift.',
  keywords: ['vorticity', 'circulation', 'curl', 'irrotational', 'free vortex', 'forced vortex', 'solid-body rotation', 'Rankine vortex', 'Stokes theorem', 'Kelvin circulation theorem', 'Helmholtz vortex theorems', 'starting vortex', 'bound vortex', 'tornado', 'wake vortex'],
  prereq: ['streamlines', 'math:curl', 'math:line-integrals'],
  related: ['kutta-joukowski', 'sources-vortices', 'wingtip-vortices', 'kutta-condition', 'how-lift-works', 'navier-stokes', 'turbulence', 'vortex-shedding', 'magnus-effect', 'potential-flow-basics', 'math:stokes-theorem', 'lifting-line'],
  body: `
Two quantities describe the swirl in a flow: one local, one global.

### Vorticity: spin at a point
Drop a tiny paddle wheel into the flow. If it turns, the air there is rotating; the **vorticity** is twice its rate of turning:
$$\\vec\\omega = \\nabla\\times\\vec V, \\qquad \\omega_z = \\frac{\\partial v}{\\partial x} - \\frac{\\partial u}{\\partial y}\\ \\text{in two dimensions}$$
It is the [[math:curl|curl]] of the velocity, measured in 1/s. A flow with no vorticity is **irrotational** — and here is the surprise: air can go round in circles without rotating.
- **Solid-body (forced) vortex**, $v_\\theta = \\Omega r$: coffee stirred until it turns as a whole. Every blob rotates at $\\Omega$, and the vorticity is $2\\Omega$ everywhere.
- **Free (irrotational) vortex**, $v_\\theta = \\Gamma/(2\\pi r)$: faster towards the centre. A blob is carried round, but its inner side moves faster than its outer side by just enough that it does not turn: a paddle wheel keeps its heading as it orbits. The vorticity is zero everywhere except at the centre.
- **Rankine vortex**: a solid-body core inside a free vortex — the simple model of a tornado, a bathtub drain or a [[wingtip-vortices|wingtip vortex]]. The wind is fastest at the edge of the core.

Air moving in straight lines can have vorticity, too: in a [[boundary-layer]] the layers slide over each other, and a paddle wheel there turns. Wings, bodies and walls are where vorticity is born.

### Circulation: swirl round a loop
Add up the component of the velocity along a closed loop, all the way round:
$$\\Gamma = \\oint \\vec V\\cdot d\\vec s \\quad (\\mathrm{m^2/s})$$
By **[[math:stokes-theorem|Stokes' theorem]]** the circulation round any loop equals the vorticity passing through it: $\\Gamma = \\int_A \\omega\\, dA$. So:
- every loop round the core of a free vortex has the same circulation Γ, whatever its size or shape — $v_\\theta$ falls as $1/r$ while the loop's length grows as $r$;
- a loop that does not enclose the core has **zero** circulation, even though the air along it moves fast;
- in solid-body rotation the circulation grows with the area enclosed: $\\Gamma = 2\\Omega \\times \\pi r^2$.

| Flow | Vorticity | Circulation round a centred circle of radius r |
|---|---|---|
| Solid-body rotation | 2Ω everywhere | 2πΩr² |
| Free vortex | 0 (except at the centre) | Γ for every r |
| Rankine vortex, core radius a | 2Ω inside the core, 0 outside | grows as r² up to a, then constant |
| Uniform stream | 0 | 0 |

### Circulation means lift
A lifting wing carries circulation: air runs faster over the top and slower underneath, so the loop integral round the wing is not zero. The **[[kutta-joukowski|Kutta–Joukowski theorem]]** says the lift per metre of span is $L' = \\rho V \\Gamma$. A light aircraft of 1100 kg with an 11 m span, flying at 50 m/s at sea level, carries about 16 m²/s round its wing — on a 1.5 m chord, air over the top averaging roughly 11 m/s faster than underneath.

### Where vorticity comes from, and where it goes
**Kelvin's circulation theorem** (1869): in inviscid flow whose density depends only on pressure, the circulation round a loop that moves with the fluid never changes. Air coming from still air has none, so the flow outside boundary layers and wakes is irrotational — the foundation of [[potential-flow-basics|potential flow]]. Vorticity is created by viscosity at solid surfaces and shed into wakes. When a wing starts moving it sheds a **starting vortex** carrying circulation equal and opposite to the **bound vortex** it keeps, so the total stays zero. **Helmholtz's theorems** (1858) add that a vortex line cannot end in the fluid: the bound vortex turns at the wingtips and trails behind as the two tip vortices, closing the loop with the starting vortex far behind — the picture behind [[lifting-line|lifting-line theory]].

> [!warn] The trailing vortices of a large aircraft can be strong enough to roll a small one that flies into them. Separation behind heavy aircraft is set by air-traffic control and the rules of the air — see [[wingtip-vortices]].

> [!key] Vorticity is spin; circulation is the net swirl round a loop; the vorticity inside a loop equals the circulation round it. Wings lift by carrying circulation, and pay for it with the vortices they leave behind.
`,
  ideas: [
    'Vorticity ω = ∇×V is twice the local rate of rotation; circulation Γ = ∮V·ds is the swirl round a loop.',
    'Stokes\' theorem: the circulation round a loop equals the vorticity passing through it.',
    'Air can go round in circles without rotating: a free vortex is irrotational except at its centre.',
    'Kelvin: in inviscid flow the circulation of a loop moving with the fluid is constant; vorticity is made by viscosity at surfaces.',
    'Lift per metre of span is ρVΓ; a starting wing sheds a starting vortex and trails tip vortices.'
  ],
  pitfalls: [
    'Air going round in circles must be rotating — In a free vortex it orbits without spinning: a paddle wheel carried round keeps its heading. Vorticity measures spin, not curved paths.',
    'Air moving in straight lines cannot have vorticity — A shear flow such as a boundary layer moves in straight lines yet is full of vorticity: the faster layer on top turns a paddle wheel.',
    'A bigger loop round a vortex has a bigger circulation — Outside the core of a free vortex every loop enclosing it has the same circulation: the speed falls as 1/r exactly as the loop length grows as r.'
  ],
  formulas: [
    {
      name: 'Speed round a free vortex',
      expr: 'vt = Gamma/(2*pi*r)', tex: 'v_\\theta = \\frac{\\Gamma}{2\\pi r}',
      vars: {
        vt: { name: 'speed round the centre', q: 'speed', unit: 'm/s', tex: 'v_\\theta' },
        Gamma: { name: 'circulation', q: false, unit: 'm²/s', value: 300, tex: '\\Gamma' },
        r: { name: 'distance from the centre', q: 'length', unit: 'm', value: 3 }
      },
      note: 'Outside the core of a vortex. The defaults are roughly a large airliner\'s wake vortex on approach.',
      stories: { vt: 'A wake vortex has a circulation of {Gamma}. How fast does the air swirl {r} from its centre?', Gamma: 'Air swirls at {vt} at {r} from the centre of a free vortex. What is its circulation?' }
    },
    {
      name: 'Circulation from vorticity (Stokes\' theorem, uniform vorticity)',
      expr: 'Gamma = omega*A', tex: '\\Gamma = \\omega A',
      vars: {
        Gamma: { name: 'circulation round the loop', q: false, unit: 'm²/s', tex: '\\Gamma' },
        omega: { name: 'vorticity (uniform inside the loop)', q: 'rate', unit: '1/s', value: 2, tex: '\\omega' },
        A: { name: 'area enclosed by the loop', q: 'area', unit: 'm²', value: 0.283 }
      },
      note: 'In general Γ is the integral of vorticity over the area. For solid-body rotation ω = 2Ω.',
      stories: { Gamma: 'Air rotating as a solid body has a vorticity of {omega}. What is the circulation round a loop enclosing {A}?' }
    },
    {
      name: 'Lift from circulation (Kutta–Joukowski)',
      expr: 'L = rho*V*Gamma*b', tex: 'L = \\rho V \\Gamma\\, b',
      vars: {
        L: { name: 'lift', q: 'force', unit: 'kN' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 50 },
        Gamma: { name: 'circulation round the wing (span average)', q: false, unit: 'm²/s', value: 16, tex: '\\Gamma' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11 }
      },
      note: 'Lift per metre of span is ρVΓ; with the average circulation over the span it gives the whole wing\'s lift.',
      stories: { Gamma: 'An aircraft of {b} span must make {L} of lift at {V} in air of density {rho}. What average circulation must its wing carry?', L: 'A wing of {b} span carries a circulation of {Gamma} at {V} (density {rho}). How much lift does it make?' }
    }
  ],
  examples: [
    {
      title: 'The circulation round a light aircraft\'s wing',
      q: 'A 1100 kg aircraft with an 11 m span and a 1.5 m chord flies level at 50 m/s at sea level. What circulation does its wing carry, and what does that say about the speeds above and below it?',
      steps: [
        'Lift = weight: $L = 1100 \\times 9.81 = 10\\,790$ N, or $981$ N per metre of span.',
        'Kutta–Joukowski: $\\Gamma = L\'/(\\rho V) = 981/(1.225 \\times 50) = 16.0$ m²/s.',
        'Round a loop hugging the wing, $\\Gamma \\approx (\\bar V_{\\text{upper}} - \\bar V_{\\text{lower}})\\,c$, so the air over the top averages about $16/1.5 = 11$ m/s faster than underneath — roughly 55 m/s above and 44 m/s below.'
      ],
      a: 'About 16 m²/s of circulation, from air some 11 m/s faster over the top than underneath.'
    },
    {
      title: 'An airliner\'s wake vortex',
      q: 'A 70 t airliner with a 34 m span approaches at 70 m/s. For an elliptic loading the trailing vortices are πb/4 apart and carry $\\Gamma_0 = W/(\\rho V b_0)$. Find Γ₀ and the swirl speed 3 m and 10 m from a vortex centre.',
      steps: [
        'Vortex spacing: $b_0 = \\pi \\times 34/4 = 26.7$ m.',
        '$\\Gamma_0 = 70\\,000 \\times 9.81/(1.225 \\times 70 \\times 26.7) = 300$ m²/s.',
        'At 3 m: $v_\\theta = 300/(2\\pi \\times 3) = 15.9$ m/s; at 10 m: 4.8 m/s.'
      ],
      a: 'Γ₀ ≈ 300 m²/s: about 16 m/s of swirl 3 m from the core — enough to roll a small aircraft.'
    },
    {
      title: 'A stirred cup',
      q: 'Tea in a cup turns as a solid body at 2 rad/s. What is its vorticity, and the circulation round the 4 cm radius of the cup?',
      steps: [
        'Vorticity: $\\omega = 2\\Omega = 4$ 1/s.',
        'Circulation: $\\Gamma = \\omega \\pi r^2 = 4 \\times \\pi \\times 0.04^2 = 0.020$ m²/s — equal to $2\\pi r \\times \\Omega r$.'
      ],
      a: 'ω = 4 1/s; Γ = 0.020 m²/s.'
    }
  ],
  quiz: [
    { q: 'A small paddle wheel is carried round a free (irrotational) vortex, outside its core. It…', choices: ['turns once per orbit, like the Moon', 'keeps pointing the same way', 'turns backwards', 'turns twice per orbit'], a: 1,
      why: 'The vorticity outside the core is zero, so the wheel does not rotate; it just translates round the centre. In solid-body rotation it would turn once per orbit.' },
    { q: 'A loop that does not enclose the core of a Rankine vortex has zero circulation, even though the air along the loop is moving.', a: true,
      why: 'By Stokes\' theorem the circulation equals the vorticity inside the loop — none, if the core is outside it. The contributions along the loop cancel.' },
    { q: 'A wing carries a circulation of 20 m²/s at 60 m/s in sea-level air. What is its lift per metre of span, in newtons per metre?', answer: 1470,
      why: 'L\' = ρVΓ = 1.225 × 60 × 20 = 1470 N per metre.' },
    { q: 'Air in solid-body rotation at Ω = 3 rad/s has a vorticity of…', choices: ['0', '1.5 1/s', '3 1/s', '6 1/s'], a: 3,
      why: 'Vorticity is twice the rotation rate: 2Ω = 6 1/s.' },
    { q: 'When a wing starts moving from rest, Kelvin\'s theorem requires that…', choices: ['no lift can ever develop', 'a starting vortex of opposite circulation is shed into the wake', 'the engine supplies the circulation', 'the circulation appears only once the wing stops'], a: 1,
      why: 'The total circulation of the fluid started at zero and must stay zero: the bound circulation round the wing is balanced by the starting vortex left behind.' }
  ],
  applications: [
    'Lift theory: bound, trailing and starting vortices of wings (lifting-line and vortex-lattice methods).',
    'Wake-turbulence separation between aircraft.',
    'Tornadoes, dust devils and bathtub drains, modelled as Rankine-like vortices.',
    'Vortex generators and delta wings, which put vortices to work.',
    'Turbulence, which is a tangle of vorticity at every scale.'
  ],
  history: 'Hermann von Helmholtz set out the laws of vortex motion in 1858; William Thomson (Lord Kelvin) proved the circulation theorem in 1869 and even imagined atoms as knotted vortex rings. Martin Kutta (1902) and Nikolai Joukowski (1906) showed that lift is ρVΓ, and Ludwig Prandtl photographed the starting vortex shed by an airfoil in his water tunnel, confirming the whole picture.',
  sim: 'flow-vortex'
},

/* ================================================================ MEASURING AIRSPEED */
{
  id: 'stagnation-point', parent: 'measuring-airspeed', title: 'Stagnation and total pressure', level: 1,
  short: 'Where the air meets a body head-on it is brought to rest. At this stagnation point the pressure is the highest anywhere on the body: the total pressure, p₀ = p + ½ρV² at low speed. At high speed the air is also compressed and heated to the stagnation temperature.',
  keywords: ['stagnation point', 'total pressure', 'stagnation pressure', 'ram pressure', 'ram rise', 'stagnation temperature', 'total temperature', 'pressure coefficient', 'impact pressure', 'pressure recovery', 'dividing streamline'],
  prereq: ['bernoulli', 'streamlines', 'air-pressure'],
  related: ['pitot-tube', 'dynamic-pressure', 'stagnation-properties', 'pressure-coefficient', 'isentropic-flow', 'hypersonic-flight', 'airspeeds', 'pressure-distribution', 'cylinder-flow', 'wind-loads'],
  body: `
Watch the streamlines approach a car, a building or a wing. They split — some pass over, some under — and one of them, the dividing streamline, runs straight into the body and stops. The point where the air comes to rest is the **stagnation point**.

### The highest pressure on the body
With $V = 0$ there, [[bernoulli|Bernoulli's equation]] gives the pressure at the stagnation point:
$$p_0 = p + \\tfrac12\\rho V^2$$
the static pressure of the oncoming air plus its full [[dynamic-pressure|dynamic pressure]]. This is the **stagnation** or **total pressure** — the highest pressure anywhere on a body in subsonic flow, because nowhere else is the air slowed as much. In terms of the [[pressure-coefficient|pressure coefficient]] $C_p = (p - p_\\infty)/q_\\infty$, a stagnation point always has $C_p = 1$.

| Speed | ½ρV² at sea level | For comparison |
|---|---|---|
| 10 m/s (36 km/h) | 61 Pa | a hand out of a car window in town |
| 30 m/s (108 km/h) | 551 Pa | 56 kg-force on each square metre of a car's front |
| 60 m/s (117 kt) | 2.2 kPa | a light aircraft's cruise |
| Mach 0.8 at 35 000 ft | 12.5 kPa (compressible) | an airliner's pitot tube |

### Where it sits
On a symmetric body pointing into the flow the stagnation point is at the nose. Tilt a wing up and it moves back under the leading edge, so that air from beneath the nose must flow forward and round it to reach the upper side — one reason the suction peak near the leading edge grows with angle of attack ([[pressure-distribution]]). A cylinder in ideal flow has two stagnation points, front and back ([[cylinder-flow]]); in real flow the rear one is lost in the separated wake, where the pressure stays low.

### Total pressure as a label
Every streamline carries its own total pressure. Friction in [[boundary-layer|boundary layers]], mixing in wakes and shock waves all lower it; a fan or compressor raises it. So engineers use $p_0$ as the measure of a stream's useful energy: the pressure recovery of an engine intake, the loss across a filter or a shock, the drag measured in a wake are all total-pressure measurements. A tube facing into the flow reads it — the [[pitot-tube|pitot tube]].

### Fast air: compressed and heated
At high speed the air arriving at the stagnation point is compressed as it slows, and the pressure rises by more than $\\tfrac12\\rho V^2$. For isentropic compression of air ($\\gamma = 1.4$)
$$p_0 = p\\,(1 + 0.2\\,M^2)^{3.5}$$
and its kinetic energy becomes heat, raising the temperature to the **stagnation (total) temperature**
$$T_0 = T + \\frac{V^2}{2c_p} = T\\,(1 + 0.2\\,M^2)$$
with $c_p = 1005\\ \\mathrm{J/(kg\\,K)}$. At 100 m/s the rise is only 5 K. An airliner at Mach 0.8 in air at −54 °C sees about 28 K more on its nose — and on its outside-air-temperature probe, which is why that reading must be corrected. Concorde at Mach 2 in air at −56 °C had nearly 120 °C at its nose. Spacecraft re-entering at 25 times the speed of sound face stagnation temperatures of thousands of degrees ([[hypersonic-flight]]).

> [!key] Stagnation point: V = 0, C_p = 1, p = p₀. Total pressure and total temperature are what a stream would have if brought to rest without loss — at low speed, $p_0 = p + \\tfrac12\\rho V^2$.
`,
  ideas: [
    'At a stagnation point the air is at rest and the pressure is the total pressure, p₀ = p + ½ρV² at low speed; C_p = 1.',
    'It is the highest pressure on a body in subsonic flow.',
    'Every streamline carries a total pressure: losses lower it, fans raise it — a measure of a stream\'s useful energy.',
    'At high speed compression makes p₀ larger than p + ½ρV², and the stagnation temperature T₀ = T + V²/(2c_p) rises markedly.',
    'The stagnation point moves back under the leading edge as a wing\'s angle of attack increases.'
  ],
  pitfalls: [
    'Stagnant air must be at atmospheric pressure — The stagnation pressure is the static pressure plus the dynamic pressure given up in stopping: above atmospheric by ½ρV².',
    'The stagnation temperature is the temperature of the air flowing past — The passing air is at the static temperature T; T₀ is what it reaches when brought to rest on a probe or a nose. An aircraft\'s outside-air-temperature probe reads close to T₀ and must be corrected.',
    'The stagnation point is always at the very tip of the nose — Only on a symmetric body pointing into the flow. On a lifting wing it sits under the leading edge, further back as the angle of attack grows.'
  ],
  formulas: [
    {
      name: 'Total (stagnation) pressure at low speed',
      expr: 'p0 = p + 0.5*rho*V^2', tex: 'p_0 = p + \\tfrac12\\rho V^2',
      vars: {
        p0: { name: 'total (stagnation) pressure', q: 'pressure', unit: 'hPa', tex: 'p_0' },
        p: { name: 'static pressure of the oncoming air', q: 'pressure', unit: 'hPa', value: 1013.25 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed of the oncoming air', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'Incompressible flow (below about Mach 0.3) with no losses on the way to the stagnation point.',
      stories: { p0: 'Air at {p} and density {rho} flows at {V} onto a body. What is the pressure at its stagnation point?', V: 'A probe facing into the wind reads {p0} while the static pressure is {p} (density {rho}). How fast is the wind?' }
    },
    {
      name: 'Stagnation pressure with compression (isentropic)',
      expr: 'p0 = p*(1 + 0.2*M^2)^3.5', tex: 'p_0 = p\\,(1 + 0.2\\,M^2)^{3.5}',
      vars: {
        p0: { name: 'total (stagnation) pressure', q: 'pressure', unit: 'hPa', tex: 'p_0' },
        p: { name: 'static pressure', q: 'pressure', unit: 'hPa', value: 238.4 },
        M: { name: 'Mach number', value: 0.8, min: 0, max: 5 }
      },
      note: 'Air (γ = 1.4) brought to rest without loss. Defaults: an airliner at Mach 0.8 at 35 000 ft. Above Mach 1 a real probe sits behind a shock and reads less (see the pitot tube).',
      stories: { p0: 'Air at a static pressure of {p} flows at Mach {M}. What is its isentropic stagnation pressure?', M: 'The stagnation pressure is {p0} where the static pressure is {p}. What is the Mach number?' }
    },
    {
      name: 'Stagnation temperature',
      expr: 'T0 = T + V^2/(2*cp)', tex: 'T_0 = T + \\frac{V^2}{2c_p}',
      vars: {
        T0: { name: 'stagnation (total) temperature', q: 'temperature', unit: '°C', tex: 'T_0' },
        T: { name: 'static (outside) temperature', q: 'temperature', unit: '°C', value: -54.3 },
        V: { name: 'airspeed (true)', q: 'speed', unit: 'm/s', value: 237 },
        cp: { name: 'specific heat of air at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' }
      },
      note: 'Energy conservation for air brought to rest adiabatically; equal to T(1 + 0.2M²). A real probe recovers most, not all, of the rise.',
      stories: { T0: 'An aircraft flies at {V} through air at {T}. What temperature does air reach where it stops on the nose?', V: 'A total-temperature probe reads {T0} while the outside air is at {T}. How fast is the aircraft flying?' }
    }
  ],
  examples: [
    {
      title: 'The front of a car',
      q: 'A car drives at 30 m/s (108 km/h) through still sea-level air. How much above atmospheric is the pressure at its stagnation point, and what fraction of atmospheric pressure is that?',
      steps: [
        '$p_0 - p = \\tfrac12\\rho V^2 = 0.6125 \\times 900 = 551$ Pa.',
        'As a fraction: $551/101\\,325 = 0.54$ % — small, but enough to drive cooling air through the radiator grille.'
      ],
      a: '551 Pa, about half a per cent of atmospheric pressure.'
    },
    {
      title: 'An airliner\'s nose at 35 000 ft',
      q: 'At 35 000 ft (ISA: p = 238.4 hPa, T = −54.3 °C, ρ = 0.380 kg/m³) an airliner flies at Mach 0.8, 237 m/s. Find the stagnation pressure and temperature, and compare with the incompressible estimate.',
      steps: [
        '$p_0 = 238.4 \\times (1 + 0.2 \\times 0.64)^{3.5} = 238.4 \\times 1.524 = 363.4$ hPa, so the impact pressure is 125.0 hPa.',
        'Incompressible: $\\tfrac12\\rho V^2 = 0.5 \\times 0.380 \\times 237^2 = 10\\,680$ Pa = 106.8 hPa — 15 % short of 125.0 hPa.',
        '$T_0 = -54.3 + 237^2/(2 \\times 1005) = -54.3 + 27.9 = -26.4$ °C.'
      ],
      a: 'p₀ ≈ 363 hPa (the incompressible estimate misses 15 % of the rise); T₀ ≈ −26 °C.'
    },
    {
      title: 'Concorde\'s hot nose',
      q: 'Concorde cruised at Mach 2.0 in the stratosphere, where the standard temperature is −56.5 °C (216.65 K). Estimate the stagnation temperature.',
      steps: [
        '$T_0 = T(1 + 0.2M^2) = 216.65 \\times (1 + 0.8) = 390$ K.',
        'That is 117 °C — hot enough that the airframe was designed round it, and it grew measurably longer in flight.'
      ],
      a: 'About 390 K, 117 °C.'
    }
  ],
  quiz: [
    { q: 'By how much does the pressure at the stagnation point of a car moving at 20 m/s in sea-level air exceed the static pressure?', answer: 245, unit: 'Pa',
      why: '½ρV² = 0.6125 × 400 = 245 Pa.' },
    { q: 'The pressure coefficient at a stagnation point in low-speed flow is…', choices: ['0', '0.5', '1', '−1'], a: 2,
      why: 'C_p = (p₀ − p∞)/(½ρV²) = (½ρV²)/(½ρV²) = 1.' },
    { q: 'At Mach 0.8, ½ρV² gives the pressure rise at a stagnation point to within 1 %.', a: false,
      why: 'Compression adds about M²/4 + M⁴/40 = 17 %: ½ρV² is about 15 % short of the true rise.' },
    { q: 'An airliner\'s outside-air-temperature probe at Mach 0.8 reads about 28 K above the true outside temperature. Why?', choices: ['heat from the engines', 'friction in the probe wiring', 'the air is brought nearly to rest on the probe, turning kinetic energy into heat', 'sunshine on the probe'], a: 2,
      why: 'The ram rise V²/(2c_p): at 237 m/s that is about 28 K, and the air-data computer subtracts it.' },
    { q: 'As a wing\'s angle of attack increases, its stagnation point…', choices: ['moves up over the leading edge', 'moves back under the leading edge', 'stays exactly at the nose', 'moves to the trailing edge'], a: 1,
      why: 'At higher angle more air must go over the top; the dividing streamline meets the wing further back underneath.' }
  ],
  applications: [
    'Pitot tubes and total-pressure probes for airspeed and engine instrumentation.',
    'Ram-air intakes for cooling, cabin ventilation and ram-air turbines.',
    'Total-air-temperature probes and the correction for ram rise.',
    'Heat shields and leading edges of fast aircraft, where stagnation heating is greatest.'
  ],
  history: 'Henri Pitot measured the stagnation pressure of the Seine with a bent glass tube in 1732. The idea of total pressure as the measure of a stream\'s useful energy — and of its loss — grew with the steam turbines, fans and wind tunnels of the early twentieth century.',
  sim: 'flow-venturi'
},

{
  id: 'pitot-tube', parent: 'measuring-airspeed', title: 'The pitot-static tube', level: 2,
  short: 'A tube facing into the airflow measures total pressure; holes on the side measure static pressure; the difference is the impact pressure, which gives the airspeed. Nearly every aircraft measures its speed this way — and when ice, insects or tape block the tubes, the instruments go wrong in characteristic ways.',
  keywords: ['pitot tube', 'pitot-static', 'static port', 'Prandtl tube', 'airspeed indicator', 'impact pressure', 'qc', 'pitot heat', 'blocked pitot', 'alternate static', 'altimeter', 'vertical speed indicator', 'Mach meter', 'Rayleigh pitot formula', 'position error', 'Saint-Venant'],
  prereq: ['stagnation-point', 'bernoulli', 'mach-number'],
  related: ['airspeeds', 'pressure-altitude', 'icing', 'wind-tunnel', 'force-balance', 'flight-testing', 'normal-shock', 'isentropic-flow', 'dynamic-pressure'],
  body: `
### How it works
A **pitot tube** is an open tube pointing straight into the airflow. The air piles up at its mouth — a [[stagnation-point|stagnation point]] — and the pressure inside is the total pressure $p_0$. A hole flush with a surface parallel to the flow feels only the **static pressure** $p$. The difference, measured by a diaphragm or a manometer, is the **impact pressure**
$$q_c = p_0 - p$$
which at low speed is the dynamic pressure $\\tfrac12\\rho V^2$, so that
$$V = \\sqrt{\\frac{2\\,(p_0 - p)}{\\rho}}$$
A **pitot-static tube** (Prandtl tube) combines both: a total-pressure hole at the tip and a ring of static holes a few diameters back, where the disturbance of the nose has died away. It is the standard speed probe of wind tunnels, good to about 1 % when aligned within some 10° of the flow.

### On an aircraft
Aircraft carry a pitot probe on the nose or under a wing, clear of the fuselage's influence, and **static ports** flush on the sides of the fuselage where the local pressure is close to the free-stream static pressure. Tubes carry the two pressures to the instruments:
- the **airspeed indicator** — a capsule fed with $p_0$ inside and $p$ outside — measures $q_c$ and shows it as a speed;
- the **altimeter** reads the static pressure as a height ([[pressure-altitude]]);
- the **vertical-speed indicator** senses how fast the static pressure changes.

No static port is perfect: the air round the fuselage is speeded up or slowed a little, so the sensed static pressure is slightly off. This **position error** varies with speed and flap setting, and the flight manual tabulates it as the difference between indicated and calibrated airspeed ([[airspeeds]]). Probes are electrically heated against [[icing]], and the pitot has a small **drain hole** to let water out.

### Compressibility: the formula instruments use
Above about Mach 0.3 the air is compressed in front of the probe and $q_c$ exceeds $\\tfrac12\\rho V^2$. For subsonic flight the isentropic relation gives
$$q_c = p\\left[(1 + 0.2\\,M^2)^{3.5} - 1\\right]$$
and, solved for the speed (Saint-Venant's formula),
$$V = \\sqrt{\\frac{7p}{\\rho}\\left[\\left(\\frac{q_c}{p} + 1\\right)^{2/7} - 1\\right]}$$
Airspeed indicators are built to this formula with the sea-level standard pressure and density, which is exactly what makes their reading a *calibrated* airspeed rather than a true one. A **Mach meter** uses the ratio $q_c/p$ alone, which gives the Mach number without any temperature. Above Mach 1 a normal shock stands in front of the tube, and the tube reads the total pressure *behind the shock*, given by **Rayleigh's pitot formula** (below); the subsonic formula would read far too low.

### When it goes wrong
The system is simple and robust, and its failures are well understood — try each in the simulation.

| Fault | Airspeed indicator | Altimeter | Vertical speed |
|---|---|---|---|
| Pitot iced, drain open | falls to zero | normal | normal |
| Pitot and drain blocked | behaves like an altimeter: high in a climb, low in a descent | normal | normal |
| Static port blocked | low in a climb, high in a descent | frozen | zero |
| Alternate static in an unpressurised cabin | slightly high | slightly high | brief jump |
| Static-line leak into a pressurised cabin | low | low | wrong |

Accidents have followed from blocked probes combined with confusing indications: a Boeing 757 in February 1996 (Birgenair 301, a pitot tube probably blocked by an insect nest), another 757 in October 1996 (Aeroperú 603, static ports left taped over after cleaning) and an Airbus A330 in June 2009 (Air France 447, pitot tubes temporarily blocked by ice crystals at high altitude). Each led to changes in probes, procedures and training for unreliable airspeed.

> [!warn] This page explains the physics. Pre-flight checks of probes and covers, the use of pitot heat and alternate static, and the handling of unreliable airspeed follow the aircraft's approved manuals, the operator's procedures and training — not these pages.
`,
  ideas: [
    'Pitot tube: total pressure p₀; static port: static pressure p; the difference q_c gives the speed.',
    'At low speed q_c = ½ρV²; above about Mach 0.3 the compressible formula is needed, and above Mach 1 Rayleigh\'s.',
    'The airspeed indicator uses sea-level standard values in the formula, so it shows calibrated, not true, airspeed.',
    'A Mach meter needs only q_c/p.',
    'Blockages give characteristic errors: an iced pitot reads zero, a blocked pitot and drain acts like an altimeter, a blocked static port freezes the altimeter.'
  ],
  pitfalls: [
    'The pitot tube measures the speed directly — It measures a pressure difference. Turning it into a speed needs the density (low speed) or the static pressure and density (compressible), and the instrument assumes sea-level values.',
    'A blocked pitot always makes the airspeed read zero — Only if the drain lets the trapped pressure escape. With pitot and drain blocked the trapped pressure stays, and the indicator reads higher as the aircraft climbs and the static pressure falls.',
    'The static port measures the pressure of still air — It measures the static pressure of the moving air at the fuselage surface, which is close to, but not exactly, the free-stream static pressure — hence position error.'
  ],
  formulas: [
    {
      name: 'Speed from a pitot-static tube (low speed)',
      expr: 'V = sqrt(2*dp/rho)', tex: 'V = \\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        V: { name: 'airspeed', q: 'speed', unit: 'm/s' },
        dp: { name: 'pitot minus static pressure', q: 'pressure', unit: 'Pa', value: 1500, tex: '\\Delta p' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' }
      },
      note: 'Incompressible flow, below about Mach 0.3. With the true local density it gives the true airspeed.',
      stories: { V: 'A pitot-static tube reads a difference of {dp} in air of density {rho}. How fast is the air moving?', dp: 'What pressure difference will a pitot-static tube show in air of density {rho} moving at {V}?' }
    },
    {
      name: 'Impact pressure in subsonic flow',
      expr: 'qc = p*((1 + 0.2*M^2)^3.5 - 1)', tex: 'q_c = p\\left[(1 + 0.2\\,M^2)^{3.5} - 1\\right]',
      vars: {
        qc: { name: 'impact pressure p₀ − p', q: 'pressure', unit: 'kPa', tex: 'q_c' },
        p: { name: 'static pressure', q: 'pressure', unit: 'kPa', value: 23.84 },
        M: { name: 'Mach number (subsonic)', value: 0.8, min: 0, max: 1 }
      },
      note: 'Air, γ = 1.4, isentropic compression into the tube. The defaults are Mach 0.8 at 35 000 ft. A Mach meter solves this for M from q_c/p.',
      stories: { qc: 'An aircraft flies at Mach {M} where the static pressure is {p}. What impact pressure does its pitot-static system sense?', M: 'A Mach meter senses an impact pressure of {qc} with a static pressure of {p}. What Mach number does it show?' }
    },
    {
      name: 'True airspeed from impact pressure (Saint-Venant)',
      expr: 'V = sqrt(7*p/rho*((qc/p + 1)^(2/7) - 1))', tex: 'V = \\sqrt{\\dfrac{7p}{\\rho}\\left[\\left(\\dfrac{q_c}{p} + 1\\right)^{2/7} - 1\\right]}',
      vars: {
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s' },
        p: { name: 'static pressure', q: 'pressure', unit: 'kPa', value: 23.84 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 0.3796, tex: '\\rho' },
        qc: { name: 'impact pressure p₀ − p', q: 'pressure', unit: 'kPa', value: 12.5, tex: 'q_c' }
      },
      note: 'Subsonic, γ = 1.4 (the 7 is 2γ/(γ − 1), the 2/7 is (γ − 1)/γ). With sea-level standard p and ρ in place of the local ones it gives the calibrated airspeed instead.',
      stories: { V: 'At a static pressure of {p} and density {rho}, the pitot-static system senses {qc}. What is the true airspeed?' }
    },
    {
      name: 'Pitot pressure in supersonic flow (Rayleigh)',
      expr: 'p02 = p*(1.2*M^2)^3.5*(2.4/(2.8*M^2 - 0.4))^2.5', tex: 'p_{02} = p\\,(1.2\\,M^2)^{3.5}\\left(\\dfrac{2.4}{2.8\\,M^2 - 0.4}\\right)^{2.5}',
      vars: {
        p02: { name: 'pressure in the pitot tube (behind the shock)', q: 'pressure', unit: 'kPa', tex: 'p_{02}' },
        p: { name: 'static pressure ahead of the shock', q: 'pressure', unit: 'kPa', value: 10 },
        M: { name: 'Mach number (supersonic)', value: 2, min: 1, max: 5 }
      },
      note: 'Air, γ = 1.4: a normal shock stands in front of the tube and the air is then brought to rest isentropically. At M = 1 it joins the subsonic formula.',
      stories: { p02: 'A pitot tube flies at Mach {M} where the static pressure is {p}. What pressure does it read?', M: 'A pitot tube reads {p02} where the static pressure is {p}, in supersonic flight. What is the Mach number?' }
    }
  ],
  examples: [
    {
      title: 'A wind-tunnel pitot-static tube',
      q: 'A pitot-static tube in a tunnel is connected to a water manometer that shows 25 mm. The air density is 1.20 kg/m³. How fast is the tunnel running?',
      steps: [
        '$\\Delta p = \\rho_w g h = 1000 \\times 9.81 \\times 0.025 = 245$ Pa.',
        '$V = \\sqrt{2 \\times 245/1.20} = \\sqrt{409} = 20.2$ m/s.'
      ],
      a: 'About 20 m/s.'
    },
    {
      title: 'Why compressibility matters at Mach 0.8',
      q: 'At 35 000 ft (p = 23.84 kPa, ρ = 0.3796 kg/m³) an airliner\'s pitot-static system senses q_c = 12.50 kPa. Find the true airspeed, and the error of the low-speed formula.',
      steps: [
        '$q_c/p + 1 = 1.5243$; $(1.5243)^{2/7} = 1.1280$.',
        '$V = \\sqrt{7 \\times 23\\,840/0.3796 \\times 0.1280} = \\sqrt{56\\,280} = 237$ m/s (Mach 0.80).',
        'Low-speed formula: $V = \\sqrt{2 \\times 12\\,500/0.3796} = 257$ m/s — 8 % too high.'
      ],
      a: '237 m/s; ignoring compressibility would claim 257 m/s.'
    },
    {
      title: 'The subsonic formula in supersonic flight',
      q: 'An aircraft flies at Mach 2 where the static pressure is 10 kPa. What does its pitot tube read, and what Mach number would the subsonic formula wrongly give?',
      steps: [
        'Rayleigh: $p_{02} = 10 \\times (4.8)^{3.5} \\times (2.4/10.8)^{2.5} = 56.4$ kPa.',
        'Subsonic formula with $p_0/p = 5.64$: $M = \\sqrt{5[(5.64)^{2/7} - 1]} = 1.79$.',
        'The shock in front of the tube destroys total pressure, so the tube reads low: the error is 11 %.'
      ],
      a: 'The tube reads 56.4 kPa; the subsonic formula would say Mach 1.79 instead of 2.0.'
    }
  ],
  quiz: [
    { q: 'A pitot-static tube in sea-level air (ρ = 1.225 kg/m³) reads a difference of 600 Pa. How fast is the air moving?', answer: 31.3, unit: 'm/s',
      why: 'V = √(2Δp/ρ) = √(1200/1.225) = √980 = 31.3 m/s.' },
    { q: 'Ice blocks the pitot inlet but the drain hole stays open. The airspeed indicator…', choices: ['freezes at its last reading', 'drops towards zero', 'behaves like an altimeter', 'reads high'], a: 1,
      why: 'The trapped total pressure leaks away through the drain to static pressure, so p₀ − p → 0 and the indicator falls to zero.' },
    { q: 'The static port is blocked and the aircraft descends. The airspeed indicator reads…', choices: ['correctly', 'too high', 'too low', 'zero'], a: 1,
      why: 'The trapped static pressure is that of the higher altitude, lower than the real one; the pitot pressure rises in the descent, so p₀ − p_trapped is too large.' },
    { q: 'A Mach meter needs the outside air temperature to find the Mach number.', a: false,
      why: 'Subsonic: q_c/p = (1 + 0.2M²)^3.5 − 1 involves only pressures. Temperature is needed for true airspeed, not for Mach.' },
    { q: 'At Mach 0.8, using V = √(2q_c/ρ) instead of the compressible formula would overestimate the true airspeed by about…', choices: ['1 %', '8 %', '25 %', 'nothing — the formulas agree'], a: 1,
      why: 'q_c exceeds ½ρV² by about 17 % at Mach 0.8; the square root halves that to about 8 %.' }
  ],
  problems: [
    { q: 'A Mach meter senses an impact pressure of 20 kPa where the static pressure is 30 kPa. What Mach number does it show (subsonic)?', answer: 0.886, tol: 0.01,
      steps: ['$q_c/p + 1 = 1.667$; $(1.667)^{2/7} = 1.1571$.', '$M = \\sqrt{5 \\times 0.1571} = 0.886$.'] },
    { q: 'A pitot-static tube in air of density 1.18 kg/m³ is connected to an alcohol manometer (790 kg/m³) that reads 42 mm. What is the air speed?', answer: 23.5, unit: 'm/s', tol: 0.02,
      steps: ['$\\Delta p = 790 \\times 9.81 \\times 0.042 = 325$ Pa.', '$V = \\sqrt{2 \\times 325/1.18} = 23.5$ m/s.'] }
  ],
  applications: [
    'Airspeed, altitude and vertical speed on nearly every aircraft; air-data computers on large ones.',
    'Wind-tunnel speed setting and wake surveys with pitot-static tubes and rakes.',
    'Duct-flow traverses in ventilation and industrial plant.',
    'Racing cars, wind-energy masts and weather stations that log pitot and static pressures.'
  ],
  history: 'Henri Pitot described his tube in 1732 after measuring the speed of the Seine; Henry Darcy improved it in 1858, and Ludwig Prandtl combined total and static holes in one streamlined probe in the early twentieth century. Lord Rayleigh gave the supersonic pitot formula in 1910.',
  sim: 'flow-pitot'
},

{
  id: 'airspeeds', parent: 'measuring-airspeed', title: 'IAS, CAS, EAS and TAS', level: 2,
  short: 'An aircraft has four airspeeds. IAS is what the dial shows; CAS removes instrument and position error; EAS removes the compressibility of the air at that height; TAS — the real speed through the air — is EAS scaled by √(ρ_SL/ρ). The wing feels EAS, navigation needs TAS, and the pilot flies IAS.',
  keywords: ['indicated airspeed', 'calibrated airspeed', 'equivalent airspeed', 'true airspeed', 'IAS', 'CAS', 'EAS', 'TAS', 'KIAS', 'Mach number', 'ground speed', 'position error', 'compressibility correction', 'density ratio', 'sigma', 'crossover altitude'],
  prereq: ['pitot-tube', 'isa', 'dynamic-pressure'],
  related: ['lift-equation', 'stall', 'density-altitude', 'pressure-altitude', 'mach-number', 'level-flight', 'range-endurance', 'critical-mach', 'v-n-diagram', 'air-density', 'takeoff-landing'],
  body: `
Ask a pilot "how fast?" and the honest answer is "which speed?". The airspeed indicator does not measure speed. It measures the [[pitot-tube|impact pressure]] $q_c$ and shows it on a dial marked in knots, through a formula that is exactly right only at sea level on a standard day. Everything else follows.

### The chain of corrections
- **IAS — indicated airspeed** is what the instrument shows.
- **CAS — calibrated airspeed** is IAS corrected for **instrument error** (the mechanism) and **position error** (the static ports do not sense quite the free-stream pressure, differently at each speed and flap setting). The flight manual gives the correction, usually a few knots, largest at low speed with flaps down.
- **EAS — equivalent airspeed** is CAS corrected for **compressibility**. CAS is the speed that would produce the measured $q_c$ at sea level; at altitude the static pressure is lower, and the same $q_c$ goes with a smaller dynamic pressure $\\tfrac12\\rho V^2$. EAS is defined by that dynamic pressure:
$$\\tfrac12\\rho_{SL}V_E^2 = \\tfrac12\\rho V^2 \\quad\\Rightarrow\\quad V_E = V\\sqrt{\\rho/\\rho_{SL}} = V\\sqrt{\\sigma}$$
The correction is negligible below about 200 kt and 10 000 ft, and reaches 10–20 kt for airliners at cruise.
- **TAS — true airspeed** is the real speed of the aircraft relative to the air: $V = V_E/\\sqrt{\\sigma}$, with the density ratio $\\sigma = \\rho/\\rho_{SL}$ from the pressure altitude and the outside temperature. Add the wind and you have the **ground speed**.

Alongside them sits the **Mach number** $M = V/a$, which the air-data computer finds from $q_c/p$ alone.

### Which speed matters for what
- **The wing and the structure feel EAS.** Lift, drag and loads all go with $\\tfrac12\\rho V^2 = \\tfrac12\\rho_{SL}V_E^2$, so the stall happens at about the same EAS — and, away from compressibility, the same IAS — at any altitude; so do flap and gear limit speeds. That is why takeoff, approach and landing are flown at indicated speeds: the numbers stay the same at a sea-level airfield and at one 5000 ft up, although the true speed and the ground roll do not ([[density-altitude]]).
- **Navigation needs TAS** and ground speed. A light aircraft indicating 120 kt at 8000 ft moves through the air at about 137 kt.
- **High-speed limits are Mach numbers.** An airliner climbing at constant CAS gains TAS and Mach. At the **crossover altitude** — typically 26 000 to 32 000 ft — it reaches its cruise Mach, and above that it holds the Mach number while its CAS falls.

### A worked chain at 35 000 ft
The standard atmosphere at 35 000 ft (10 668 m): $p = 238.4$ hPa, $T = -54.3$ °C, $\\rho = 0.380$ kg/m³, $a = 296.5$ m/s, $\\sigma = 0.310$. An airliner flies at CAS 270 kt (138.9 m/s):
1. Impact pressure from CAS, with sea-level values: $q_c = p_{SL}\\left[(1 + 0.2(V_C/a_{SL})^2)^{3.5} - 1\\right] = 12.32$ kPa.
2. Mach number from $q_c/p = 0.517$: $M = \\sqrt{5[(1.517)^{2/7} - 1]} = 0.795$.
3. TAS: $V = Ma = 0.795 \\times 296.5 = 235.7$ m/s = **458 kt**.
4. EAS: $V_E = V\\sqrt{\\sigma} = 458 \\times 0.557 =$ **255 kt**, 15 kt below CAS.

A constant CAS of 250 kt through the standard atmosphere:

| Pressure altitude | EAS | TAS | Mach |
|---|---|---|---|
| Sea level | 250 kt | 250 kt | 0.38 |
| 10 000 ft | 248 kt | 289 kt | 0.45 |
| 20 000 ft | 245 kt | 336 kt | 0.55 |
| 30 000 ft | 241 kt | 394 kt | 0.67 |
| 35 000 ft | 238 kt | 427 kt | 0.74 |
| 41 000 ft | 233 kt | 482 kt | 0.84 |

### Temperature and rules of thumb
TAS grows about **2 % per 1000 ft** above IAS in the lower atmosphere: the density falls about 3 % per 1000 ft, and TAS goes as $1/\\sqrt\\sigma$. On a hot day the air is thinner, so the same CAS means a higher TAS — roughly 1 % more for each 5 °C above standard — while the Mach number hardly changes, because the speed of sound rises with the temperature too. The [airspeed calculator](#/tools/flight/airspeed) runs the whole chain for any numbers.

> [!warn] The figures here are typical examples. The speeds an aircraft is actually flown at, and the corrections applied to them, come from its approved flight manual and the rules of the air.
`,
  ideas: [
    'IAS → (instrument and position error) → CAS → (compressibility) → EAS → (density, ×√(ρ_SL/ρ)) → TAS.',
    'The airspeed indicator measures impact pressure; its dial is exact only at sea level in the standard atmosphere.',
    'Aerodynamic forces go with EAS, so a wing stalls at about the same indicated speed at any altitude.',
    'TAS is about 2 % per 1000 ft above IAS; add the wind to get ground speed.',
    'Airliners climb at constant CAS until the Mach number reaches its cruise value (the crossover altitude), then hold Mach.'
  ],
  pitfalls: [
    'The airspeed indicator shows how fast the aircraft moves through the air — It shows calibrated airspeed plus small errors. At 35 000 ft an indicated 270 kt is a true 458 kt.',
    'EAS and CAS are the same — They agree at sea level and at low speed. At altitude and high speed CAS exceeds EAS by the compressibility correction, 15 kt or more for an airliner at cruise.',
    'At a high-altitude airfield the aircraft needs more lift because its true airspeed is higher — It needs the same lift, reached at the same equivalent (and roughly indicated) airspeed. The higher true speed means a longer ground roll and a faster touchdown over the ground.'
  ],
  formulas: [
    {
      name: 'Equivalent airspeed from true airspeed',
      expr: 'Ve = V*sqrt(rho/rhoSL)', tex: 'V_E = V\\sqrt{\\rho/\\rho_{SL}}',
      vars: {
        Ve: { name: 'equivalent airspeed', q: 'speed', unit: 'kt', tex: 'V_E' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 458 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 0.3796, tex: '\\rho' },
        rhoSL: { name: 'sea-level standard density', q: 'density', unit: 'kg/m³', value: 1.225, fixed: true, tex: '\\rho_{SL}' }
      },
      note: 'EAS gives the same dynamic pressure at sea-level density as TAS does at the actual density. √(ρ/ρ_SL) = √σ.',
      practice: { unknowns: ['Ve', 'V', 'rho'] },
      stories: { Ve: 'An aircraft flies at a true airspeed of {V} in air of density {rho}. What is its equivalent airspeed?', V: 'An aircraft holds an equivalent airspeed of {Ve} where the density is {rho}. What is its true airspeed?' }
    },
    {
      name: 'Calibrated airspeed from impact pressure',
      expr: 'Vc = aSL*sqrt(5*((qc/pSL + 1)^(2/7) - 1))', tex: 'V_C = a_{SL}\\sqrt{5\\left[\\left(\\dfrac{q_c}{p_{SL}} + 1\\right)^{2/7} - 1\\right]}',
      vars: {
        Vc: { name: 'calibrated airspeed', q: 'speed', unit: 'kt', tex: 'V_C' },
        aSL: { name: 'speed of sound at sea level (ISA)', q: 'speed', unit: 'm/s', value: 340.29, fixed: true, tex: 'a_{SL}' },
        qc: { name: 'impact pressure p₀ − p', q: 'pressure', unit: 'kPa', value: 12.32, tex: 'q_c' },
        pSL: { name: 'sea-level standard pressure', q: 'pressure', unit: 'hPa', value: 1013.25, fixed: true, tex: 'p_{SL}' }
      },
      note: 'What an airspeed indicator computes: Saint-Venant\'s formula with sea-level standard pressure and density. Valid below a CAS of 661 kt (a_SL).',
      stories: { Vc: 'The pitot-static system senses an impact pressure of {qc}. What calibrated airspeed does the indicator show?', qc: 'What impact pressure corresponds to a calibrated airspeed of {Vc}?' }
    },
    {
      name: 'True airspeed from Mach number',
      expr: 'V = M*sqrt(1.4*Rair*T)', tex: 'V = M\\sqrt{1.4\\,R_\\text{air}\\,T}',
      vars: {
        V: { name: 'true airspeed', q: 'speed', unit: 'kt' },
        M: { name: 'Mach number', value: 0.8, min: 0, max: 5 },
        Rair: { const: 'Rair' },
        T: { name: 'outside (static) air temperature', q: 'temperature', unit: '°C', value: -54.3 }
      },
      note: 'The speed of sound in air is √(γRT) with γ = 1.4; it depends on temperature only.',
      stories: { V: 'An airliner flies at Mach {M} where the outside air is at {T}. What is its true airspeed?', M: 'An aircraft flies at a true airspeed of {V} in air at {T}. What is its Mach number?' }
    },
    {
      name: 'Rule of thumb: true from indicated airspeed',
      expr: 'Vt = Vi*(1 + 0.02*Hk)', tex: 'V_T \\approx V_I\\,(1 + 0.02\\,H_k)',
      vars: {
        Vt: { name: 'true airspeed (estimate)', q: 'speed', unit: 'kt', tex: 'V_T' },
        Vi: { name: 'indicated airspeed', q: 'speed', unit: 'kt', value: 120, tex: 'V_I' },
        Hk: { name: 'pressure altitude in thousands of feet', value: 8, min: 0, max: 25, tex: 'H_k' }
      },
      note: 'A pilot\'s estimate for the lower atmosphere on a standard day, usually within a few per cent below 20 000 ft; it ignores temperature, instrument errors and compressibility.',
      stories: { Vt: 'Estimate the true airspeed for {Vi} indicated at a pressure altitude of {Hk} thousand feet.' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft at 8000 ft',
      q: 'A light aircraft indicates 120 kt at 8000 ft pressure altitude on a standard day. Its flight manual gives CAS = 122 kt at this IAS. Find EAS and TAS, and compare with the rule of thumb. ISA at 8000 ft: p = 752.6 hPa, T = −0.8 °C, ρ = 0.9629 kg/m³, a = 330.8 m/s.',
      steps: [
        'Impact pressure from CAS 122 kt (62.8 m/s): $q_c = 101\\,325\\,[(1 + 0.2 \\times (62.8/340.3)^2)^{3.5} - 1] = 2433$ Pa.',
        'Mach number: $q_c/p = 0.03233$, $M = \\sqrt{5[(1.03233)^{2/7} - 1]} = 0.2137$.',
        'TAS: $0.2137 \\times 330.8 = 70.7$ m/s = 137.4 kt. EAS: $137.4 \\times \\sqrt{0.786} = 121.8$ kt — compressibility is only 0.2 kt here.',
        'Rule of thumb: $120 \\times (1 + 0.02 \\times 8) = 139$ kt, 1.3 % high.'
      ],
      a: 'CAS 122 kt, EAS 122 kt, TAS 137 kt.'
    },
    {
      title: 'The crossover altitude',
      q: 'An airliner climbs at 290 kt CAS and then holds Mach 0.78. At what pressure altitude does 290 kt CAS become Mach 0.78, and what is the TAS there?',
      steps: [
        'Impact pressure of 290 kt CAS: $q_c = 101\\,325\\,[(1 + 0.2 \\times (149.2/340.3)^2)^{3.5} - 1] = 14.30$ kPa. It stays the same all the way up while CAS is held.',
        'At Mach 0.78: $q_c/p = (1 + 0.2 \\times 0.78^2)^{3.5} - 1 = 0.4947$, so $p = 14.30/0.4947 = 28.9$ kPa.',
        'In the standard atmosphere 28.9 kPa is found at 9410 m, about 30 900 ft, where $T = -46$ °C and $a = 302$ m/s.',
        'TAS $= 0.78 \\times 302 = 235.6$ m/s = 458 kt.'
      ],
      a: 'About 30 900 ft, at a TAS of about 458 kt; above it the aircraft holds Mach 0.78 and its CAS falls.'
    },
    {
      title: 'A hot day',
      q: 'An aircraft flies at 100 kt CAS at 5000 ft pressure altitude. Compare its TAS on a standard day (T = 5.1 °C) and on a day 20 °C warmer.',
      steps: [
        'The pressure (843 hPa) and so $q_c$ and the Mach number are the same both days: $M = 0.1656$.',
        'Standard day: $a = 334.4$ m/s, TAS $= 0.1656 \\times 334.4 = 55.4$ m/s = 107.7 kt.',
        'Hot day (25.1 °C): $a = \\sqrt{1.4 \\times 287.06 \\times 298.2} = 346.2$ m/s, TAS = 111.5 kt.'
      ],
      a: '107.7 kt on a standard day, 111.5 kt when 20 °C hotter — 3.5 % faster for the same indicated speed.'
    }
  ],
  quiz: [
    { q: 'Which airspeed does a wing\'s lift depend on directly, for a given C_L and wing area?', choices: ['IAS', 'CAS', 'EAS', 'ground speed'], a: 2,
      why: 'Lift = ½ρV²SC_L = ½ρ_SL V_E² S C_L: equivalent airspeed carries the dynamic pressure. IAS and CAS approximate it at low speed.' },
    { q: 'An aircraft holds 250 kt CAS while climbing from 10 000 to 30 000 ft. Its true airspeed…', choices: ['stays at 250 kt', 'falls', 'rises', 'rises and then falls'], a: 2,
      why: 'The air thins, so the same impact pressure needs more true speed: from about 289 kt to 394 kt.' },
    { q: 'At 20 000 ft the density ratio σ is 0.533. What TAS corresponds to an EAS of 245 kt?', answer: 336, unit: 'kt',
      why: 'V = V_E/√σ = 245/0.730 = 336 kt.' },
    { q: 'On a hot day, the same calibrated airspeed at the same pressure altitude means a higher true airspeed.', a: true,
      why: 'The hot air is thinner, so the same dynamic pressure needs more true speed — about 1 % more for every 5 °C.' },
    { q: 'With the 2 %-per-1000-ft rule, estimate the TAS for 150 kt IAS at 6000 ft.', answer: 168, unit: 'kt',
      why: '150 × (1 + 0.02 × 6) = 168 kt. (The full chain gives about 164 kt on a standard day.)' }
  ],
  problems: [
    { q: 'At 10 000 ft in the standard atmosphere (σ = 0.738), an aircraft\'s EAS is 248 kt. What is its TAS?', answer: 288.7, unit: 'kt', tol: 0.01,
      steps: ['$V = V_E/\\sqrt{\\sigma} = 248/\\sqrt{0.7385} = 248/0.8593 = 288.6$ kt.'] },
    { q: 'At 30 000 ft (ISA, T = −44.4 °C) an airliner cruises at Mach 0.78. What is its TAS in knots?', answer: 459.7, unit: 'kt', tol: 0.01,
      steps: ['$a = \\sqrt{1.4 \\times 287.06 \\times 228.7} = 303.2$ m/s.', '$V = 0.78 \\times 303.2 = 236.5$ m/s = 459.7 kt.'] }
  ],
  applications: [
    'Flight planning: TAS and the wind give ground speed and time en route.',
    'Takeoff and approach flown at indicated speeds that work at every airfield altitude.',
    'Structural and flutter limits written as equivalent airspeeds and Mach numbers.',
    'Air-data computers that turn pitot and static pressures and temperature into every speed and Mach.'
  ],
  sim: ['flow-airspeeds', 'flow-pitot']
},

/* ================================================================ WIND ON STRUCTURES */
{
  id: 'wind-loads', parent: 'wind-structures', title: 'Wind loads on buildings', level: 2,
  short: 'Wind pushes on a building\'s windward face and sucks on its sides, roof and back. Engineers take the dynamic pressure of the wind at each height, raise it for gusts, and multiply by pressure coefficients; codes such as the Eurocode and ASCE 7 lay out how.',
  keywords: ['wind load', 'wind pressure', 'pressure coefficient', 'peak velocity pressure', 'gust factor', 'turbulence intensity', 'terrain roughness', 'roughness length', 'log law', 'power law', 'Eurocode EN 1991-1-4', 'ASCE 7', 'basic wind speed', 'roof uplift', 'internal pressure', 'across-wind response'],
  prereq: ['dynamic-pressure', 'bernoulli', 'wind-gradient', 'force-coefficients'],
  related: ['bluff-bodies', 'pressure-coefficient', 'vortex-shedding', 'galloping-bridges', 'atmospheric-turbulence', 'flow-separation', 'wind-tunnel', 'similarity-testing', 'drag-equation', 'stagnation-point', 'strouhal-froude'],
  body: `
A building is a [[bluff-bodies|bluff body]] standing at the bottom of the atmosphere's boundary layer. The wind reaching it is slower near the ground and faster higher up, gusty at every height, and it separates from every sharp corner. Designing for it is aerodynamics with a safety factor.

### Pressure = coefficient × dynamic pressure
Everything starts from the [[dynamic-pressure|dynamic pressure]] of the wind, $q = \\tfrac12\\rho V^2$ (codes usually take $\\rho = 1.25\\ \\mathrm{kg/m^3}$). A 30 m/s wind — a severe gale — carries 560 Pa, 57 kg-force on every square metre. The pressure on each part of the surface is that times a **pressure coefficient**:
$$w = c_p\\, q$$
- the **windward** wall is a [[stagnation-point|stagnation]] region: $c_p \\approx +0.7$ to $+0.8$;
- the **side walls** are in suction where the flow separates at the front corners: about $-1.2$ close behind the corners, $-0.5$ further back;
- the **leeward** wall is in the wake: $-0.3$ to $-0.7$, more for tall, slender buildings;
- the **roof** is mostly in suction, strongest along the windward edge and at the corners — $-1.8$ or more at a sharp eave, and higher still over small areas such as a single tile or panel.

The **internal pressure** adds to all of these. With openings spread round the walls it is small (typically $+0.2$ or $-0.3$, whichever is worse), but a large open door or broken window on the windward side can raise it towards $+0.7$, pushing the roof up from inside while the wind sucks it from outside. Storm damage usually starts at roof corners and edges for exactly this reason.

### The wind profile and the gusts
The mean wind grows with height in a logarithmic profile set by the roughness of the ground (see [[wind-gradient]]):
$$v_m(z) = k_r \\ln\\frac{z}{z_0}\\, v_b$$
where $v_b$ is the site's **basic wind speed** — in the Eurocode, the 10-minute mean at 10 m over open country with a 2 % chance of being exceeded in any year (a 50-year return period) — and $k_r$ and the roughness length $z_0$ describe the terrain: millimetres over the sea, 0.05 m over open country, 0.3 m over suburbs, 1 m over city centres. Rough ground slows the wind near the ground and makes it gustier.

Structures respond to gusts, not to 10-minute means. The Eurocode (EN 1991-1-4, 2005) brings them in through the **turbulence intensity** $I_v = 1/\\ln(z/z_0)$ and the **peak velocity pressure**
$$q_p(z) = \\left[1 + 7 I_v(z)\\right]\\tfrac12\\rho\\,v_m^2(z)$$
With a basic wind speed of 25 m/s, at 50 m above ground:

| Terrain | $z_0$ | Mean speed at 50 m | Turbulence $I_v$ | Peak velocity pressure $q_p$ |
|---|---|---|---|---|
| Sea and coast | 0.003 m | 37.9 m/s | 0.10 | 1.55 kPa |
| Open country | 0.05 m | 32.8 m/s | 0.14 | 1.36 kPa |
| Suburbs | 0.3 m | 27.5 m/s | 0.20 | 1.12 kPa |
| City centre | 1.0 m | 22.9 m/s | 0.26 | 0.92 kPa |

Gusts roughly double the mean dynamic pressure over suburbs, and nearly triple it in a city. The American standard ASCE 7 (2022 edition) starts instead from a **3-second gust** at 33 ft over open terrain, mapped for return periods of about 300 to 3000 years depending on how critical the building is, and a velocity pressure of $0.00256\\,K_z K_{zt} K_e V^2$ lb/ft² with $V$ in mph — the same $\\tfrac12\\rho V^2$ in US units, with factors for height and exposure, hills and ground elevation.

### Forces, motion and the wind tunnel
Adding up the pressures gives the force on each wall and the overturning moment at the base; for a whole structure a force coefficient does it in one step, $F = c_f\\, q_p A$, about 1.3 for a square tower and less for a round one. Tall, slender and light structures also move: gusts excite their lowest natural frequency (a building's is roughly $46/h$ Hz for a height $h$ in metres), and the wake sheds vortices at the [[strouhal-froude|Strouhal]] frequency, which can drive **across-wind** swaying larger than the along-wind response (see [[vortex-shedding]] and [[galloping-bridges]]). People on the top floors notice accelerations of a few thousandths of $g$ long before the structure is at risk, so comfort often governs. Unusual or very tall buildings are tested as scale models in a **boundary-layer wind tunnel**, which reproduces the profile and turbulence of the natural wind ([[similarity-testing]]).

> [!note] Codes change: EN 1991-1-4 dates from 2005 (a second generation is in preparation) and ASCE 7 is revised about every six years. The numbers here illustrate the method; a real design follows the current code and its national annex.
`,
  ideas: [
    'Wind pressure = pressure coefficient × dynamic pressure: a push on the windward face, suction on the sides, roof and leeward face.',
    'The mean wind grows logarithmically with height; rough ground slows it and makes it gustier.',
    'Codes design for gusts: the Eurocode\'s peak velocity pressure is (1 + 7I_v) times the mean dynamic pressure.',
    'Roof edges and corners see the strongest suction, made worse by internal pressure through a windward opening.',
    'Tall, slender structures must also be checked for dynamic response: gust resonance and across-wind vortex shedding.'
  ],
  pitfalls: [
    'Wind only pushes on the side it blows against — Most of a building\'s surface is in suction: sides, roof and leeward wall. Roofs are lifted off far more often than walls are pushed in.',
    'A wind twice as strong doubles the load — Pressure goes with the square of the speed: twice the wind, four times the load.',
    'The wind at the top of a tower is the forecast wind — Forecasts are for about 10 m. At 200 m the mean wind is typically 40–100 % faster than at 10 m on the same site, more over rough ground, and the design uses the speed at each height.'
  ],
  formulas: [
    {
      name: 'Wind pressure on a surface',
      expr: 'w = cp*0.5*rho*V^2', tex: 'w = c_p\\,\\tfrac12\\rho V^2',
      vars: {
        w: { name: 'pressure on the surface (+ push, − suction)', q: 'pressure', unit: 'Pa', signed: true },
        cp: { name: 'pressure coefficient', value: 0.8, min: -3, max: 1, signed: true, tex: 'c_p' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.25, tex: '\\rho' },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 30 }
      },
      note: 'Typical c_p: windward wall +0.8, leeward −0.5, side walls −0.5 to −1.2, roof edges −1.8 or more.',
      stories: { w: 'A {V} wind (density {rho}) blows on a wall with a pressure coefficient of {cp}. What pressure acts on it?', V: 'A roof edge with c_p = {cp} can take a suction of {w}. At what wind speed is that reached (density {rho})?' }
    },
    {
      name: 'Mean wind speed against height (log law, Eurocode form)',
      expr: 'vm = kr*ln(z/z0)*vb', tex: 'v_m = k_r \\ln\\frac{z}{z_0}\\; v_b',
      vars: {
        vm: { name: 'mean (10-minute) wind speed at height z', q: 'speed', unit: 'm/s', tex: 'v_m' },
        kr: { name: 'terrain factor', value: 0.215, tex: 'k_r' },
        z: { name: 'height above ground', q: 'length', unit: 'm', value: 50 },
        z0: { name: 'roughness length', q: 'length', unit: 'm', value: 0.3, tex: 'z_0' },
        vb: { name: 'basic wind speed (10 m, open country)', q: 'speed', unit: 'm/s', value: 25, tex: 'v_b' }
      },
      note: 'Above a minimum height (2 m in open country to 10 m in city centres). k_r = 0.19 (z₀/0.05 m)^0.07: 0.156 over the sea, 0.19 in open country, 0.215 in suburbs, 0.234 in cities.',
      stories: { vm: 'In suburbs (z₀ = {z0}, k_r = {kr}) the basic wind speed is {vb}. What is the mean wind at {z}?', z: 'At what height does the mean wind reach {vm} over terrain with z₀ = {z0} and k_r = {kr}, for a basic wind speed of {vb}?' }
    },
    {
      name: 'Peak velocity pressure (Eurocode form)',
      expr: 'qp = (1 + 7/ln(z/z0))*0.5*rho*vm^2', tex: 'q_p = \\left(1 + \\frac{7}{\\ln(z/z_0)}\\right)\\tfrac12\\rho\\, v_m^2',
      vars: {
        qp: { name: 'peak velocity pressure', q: 'pressure', unit: 'kPa', tex: 'q_p' },
        z: { name: 'height above ground', q: 'length', unit: 'm', value: 50 },
        z0: { name: 'roughness length', q: 'length', unit: 'm', value: 0.3, tex: 'z_0' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.25, tex: '\\rho' },
        vm: { name: 'mean wind speed at that height', q: 'speed', unit: 'm/s', value: 27.5, tex: 'v_m' }
      },
      note: 'The turbulence intensity is I_v = 1/ln(z/z₀); the factor 1 + 7I_v turns the mean dynamic pressure into a peak (gust) value.',
      stories: { qp: 'The mean wind at {z} over terrain with z₀ = {z0} is {vm}. What peak velocity pressure should a designer use (density {rho})?' }
    },
    {
      name: 'Wind force on a structure',
      expr: 'F = cf*qp*A', tex: 'F = c_f\\, q_p\\, A',
      vars: {
        F: { name: 'wind force', q: 'force', unit: 'MN' },
        cf: { name: 'force coefficient', value: 1.3, tex: 'c_f' },
        qp: { name: 'peak velocity pressure', q: 'pressure', unit: 'kPa', value: 1.12, tex: 'q_p' },
        A: { name: 'reference area facing the wind', q: 'area', unit: 'm²', value: 1500 }
      },
      note: 'c_f ≈ 1.3 for a square tower, 1.8 for a flat sign, about 0.7 for a circular chimney at high Reynolds number. Codes add structural factors for size and dynamic response.',
      stories: { F: 'A building face of {A} with a force coefficient of {cf} sees a peak velocity pressure of {qp}. What is the wind force?' }
    }
  ],
  examples: [
    {
      title: 'Pressures on a 50 m building in the suburbs',
      q: 'A 50 m building stands in suburbs (z₀ = 0.3 m, k_r = 0.215) where the basic wind speed is 25 m/s. Find the mean wind and peak velocity pressure at the top, and the pressures on the windward (c_p = +0.8) and leeward (−0.5) faces there.',
      steps: [
        'Mean wind: $v_m = 0.215 \\times \\ln(50/0.3) \\times 25 = 0.215 \\times 5.12 \\times 25 = 27.5$ m/s.',
        'Turbulence: $I_v = 1/5.12 = 0.196$; peak pressure $q_p = (1 + 7 \\times 0.196) \\times 0.625 \\times 27.5^2 = 2.37 \\times 473 = 1120$ Pa.',
        'Windward: $+0.8 \\times 1120 = +900$ Pa; leeward: $-0.5 \\times 1120 = -560$ Pa.',
        'Together they push the building downwind with 1460 Pa near the top — about 149 kg-force on each square metre of its front.'
      ],
      a: 'v_m ≈ 27.5 m/s, q_p ≈ 1.12 kPa: +0.90 kPa on the windward face and −0.56 kPa on the leeward face.'
    },
    {
      title: 'A roadside sign',
      q: 'A flat sign 3 m × 1.5 m has its centre 10 m above open country (z₀ = 0.05 m, k_r = 0.19); the basic wind speed is 27 m/s. With c_f = 1.8, what force must its posts resist, and what moment at their base?',
      steps: [
        '$v_m = 0.19 \\times \\ln(200) \\times 27 = 27.2$ m/s; $I_v = 1/\\ln 200 = 0.189$.',
        '$q_p = (1 + 7 \\times 0.189) \\times 0.625 \\times 27.2^2 = 2.32 \\times 462 = 1072$ Pa.',
        '$F = 1.8 \\times 1072 \\times 4.5 = 8.7$ kN — the weight of nearly 900 kg.',
        'Base moment: $8.7 \\times 10 = 87$ kN·m.'
      ],
      a: 'About 8.7 kN, and 87 kN·m at the base of the posts.'
    },
    {
      title: 'Uplift at a roof corner',
      q: 'A house roof at 8 m in suburbs (basic wind 25 m/s) has a corner zone with c_pe = −1.8. The peak velocity pressure there is 612 Pa. Find the net uplift with internal pressure c_pi = +0.2, and with a large windward door open (c_pi ≈ +0.7).',
      steps: [
        'Net coefficient, openings spread round: $-1.8 - 0.2 = -2.0$, so $w = -2.0 \\times 612 = -1220$ Pa: about 125 kg-force per square metre upward.',
        'Windward door open: $-1.8 - 0.7 = -2.5$, $w = -1530$ Pa — a quarter more.',
        'A 2 m × 1 m roof panel at the corner needs fixings for about 3 kN, before any safety factor.'
      ],
      a: 'About 1.2 kPa of uplift, rising to 1.5 kPa with a windward opening.'
    }
  ],
  quiz: [
    { q: 'What is the dynamic pressure of a 40 m/s wind (ρ = 1.25 kg/m³)?', answer: 1000, unit: 'Pa',
      why: 'q = ½ρV² = 0.625 × 1600 = 1000 Pa.' },
    { q: 'Which part of a low-rise building usually sees the strongest wind suction?', choices: ['the middle of the windward wall', 'the middle of the leeward wall', 'the windward edges and corners of the roof', 'the ground floor'], a: 2,
      why: 'The flow separates at the eaves and roof corners, where conical vortices form and the suction peaks — where storm damage begins.' },
    { q: 'A large open door on the windward side increases the uplift on the roof.', a: true,
      why: 'The windward opening lets stagnation-like pressure into the building, pushing up on the roof from inside while the outside is in suction.' },
    { q: 'Compared with open sea, the mean wind at 20 m over a city centre is ___ and its turbulence ___.', choices: ['lower; higher', 'higher; lower', 'lower; lower', 'the same; higher'], a: 0,
      why: 'Rough ground slows the wind near the surface and stirs it: lower mean speed, higher turbulence intensity.' },
    { q: 'The basic wind speed of a site is twice that of another. The design wind pressures are…', choices: ['twice as large', 'four times as large', '√2 times as large', 'unchanged if the building is rigid'], a: 1,
      why: 'Pressure goes with the square of the wind speed.' }
  ],
  applications: [
    'Structural design of buildings, towers, bridges, signs, solar arrays and cladding.',
    'Boundary-layer wind-tunnel tests of tall and unusual buildings.',
    'Pedestrian wind-comfort studies round tall buildings.',
    'Windstorm risk models for insurers and planners.'
  ],
  history: 'After the Tay Bridge fell in a gale in December 1879, the inquiry found that no proper allowance had been made for wind, and British engineers adopted a design pressure of 56 lb/ft² (about 2.7 kPa) — used for the Forth Bridge. Modern wind engineering began with the boundary-layer wind tunnel (Martin Jensen\'s rule of modelling the ground roughness, 1958) and Alan Davenport\'s statistical gust-factor method (1961); the collapse of three cooling towers at Ferrybridge, England, in 1965 showed how neighbouring structures change the wind.'
},

{
  id: 'flutter', parent: 'wind-structures', title: 'Flutter and aeroelasticity', level: 3,
  short: 'Flutter is a self-excited vibration: above a critical speed, air forces that lag the bending and twisting of a flexible wing or control surface feed energy into the motion faster than the structure can dissipate it, and the amplitude grows until something breaks. It is not resonance with any gust — it needs no outside rhythm at all.',
  keywords: ['flutter', 'aeroelasticity', 'bending-torsion flutter', 'divergence', 'control reversal', 'mass balance', 'elastic axis', 'flexural axis', 'self-excited vibration', 'negative damping', 'frequency coalescence', 'reduced frequency', 'Theodorsen', 'flight flutter testing', 'whirl flutter', 'buzz', 'Collar triangle'],
  prereq: ['lift-equation', 'pitching-moment', 'physics:damped-oscillations'],
  related: ['galloping-bridges', 'wing-planform', 'sweep', 'control-surfaces', 'flight-testing', 'v-n-diagram', 'airspeeds', 'center-of-pressure', 'physics:driven-oscillations', 'math:damped-oscillator-ode'],
  body: `
**Aeroelasticity** is what happens when air forces and a flexible structure act on each other: the air bends the wing, the bent wing changes the air forces, and so on. Arthur Collar drew it as a triangle of aerodynamic, elastic and inertia forces. Its sides give the static problems (aerodynamic plus elastic forces); the whole triangle, with inertia, gives flutter.

### Static aeroelasticity: divergence and reversal
If a wing's lift acts ahead of its **elastic (flexural) axis** — the line about which it twists — the lift twists the nose up, which adds lift, which twists it further. The structure resists in proportion to the twist, but the aerodynamic moment grows with the dynamic pressure. Above the **divergence speed** the air wins and the twist runs away:
$$V_D = \\sqrt{\\frac{2K}{\\rho\\, S\\, e\\, a}}$$
with $K$ the torsional stiffness, $S$ the area, $e$ the distance of the aerodynamic centre ahead of the elastic axis and $a$ the lift-curve slope. Forward-swept wings are especially prone — the X-29 research aircraft of the 1980s needed carbon-fibre skins laid up to resist the twist. Its cousin, **control reversal**: an aileron deflected down twists a flexible wing nose-down, and above the reversal speed the roll goes the wrong way.

### Flutter: energy from the airstream
Flutter is dynamic. A wing section can vibrate in (at least) two ways — **bending**, up and down, and **torsion**, twisting — each with its own natural frequency, typically a few hertz for bending and more for torsion. In still air both are lightly damped. In flight the air forces depend on the motion: twisting changes the angle of attack and so the lift, which pushes the wing up or down; and the lift arrives with a delay, because the wake remembers the recent motion. If the lift acts in step with the up-and-down *velocity* rather than the displacement, it does work on the wing every cycle: **negative aerodynamic damping**.

As the speed rises the aerodynamic stiffness pulls the two frequencies together, the vibration becomes a coupled bend-and-twist with the twist leading the bending by roughly a quarter of a cycle, and at the **flutter speed** the damping of one mode passes through zero. Above it any disturbance — a gust, a control input, engine vibration — grows exponentially, often doubling in a few cycles. The simulation shows this for a typical section (1.5 m chord, 45 kg per metre of span, bending 3.2 Hz, torsion 8 Hz): flutter at about 84 m/s (163 kt), where the two modes have merged near 5 Hz.

> [!key] Flutter is **self-excited**: the forces that drive it are made by the motion itself. It is not resonance with the wind or with gusts — there is no outside frequency to match — so it cannot be avoided by "detuning". The only defence is to keep the flutter speed well above any speed the aircraft can reach.

### What raises the flutter speed
- **Centre of mass ahead of the elastic axis.** Inertia then twists the section so as to reduce lift as it moves up, damping the motion instead of feeding it. Control surfaces carry **mass balances** ahead of their hinge lines for this reason; an unbalanced aileron or elevator can flutter violently.
- **Torsional stiffness**: a higher torsion frequency, well separated from bending.
- **Care with added masses.** Underwing stores, engines on pylons and tip tanks shift mass and frequencies, and each new combination must be cleared. Propellers add **whirl flutter** of their mountings; transonic shock motion adds **buzz** of control surfaces.
- **Altitude** raises the true airspeed at which flutter occurs, but not in simple proportion to the thinner air: the ratio of structural mass to the mass of air it moves (the mass ratio $\\mu$) changes too.

The lag of the air forces behind the motion is set by the **reduced frequency** $k = \\omega b/V$, with $b$ the half-chord. At small $k$ the flow is nearly steady; at $k \\approx 0.1$ to 1 the wake's memory matters. Theodorsen's 1935 theory of a vibrating thin airfoil gives these unsteady forces and is still the textbook starting point.

### Proving an aircraft free of flutter
Flutter is predicted with structural finite-element models and unsteady aerodynamics, checked against ground vibration tests of the real airframe, and then explored in **flight flutter testing**: the aircraft is flown at steps of increasing speed, excited by control pulses or vanes, and the damping of each mode is measured before the next step. The rules for transport aircraft (FAR/CS 25.629) ask for freedom from flutter out to the design dive speed enlarged by 15 % in equivalent airspeed.

> [!warn] Flutter can destroy an aircraft within seconds. Speed limits, control-surface balance checks and repairs follow the aircraft's approved manuals and maintenance data — never these pages.
`,
  ideas: [
    'Aeroelasticity couples air forces and structural flexibility: divergence and control reversal are static, flutter is dynamic.',
    'Flutter is self-excited: motion-dependent air forces feed energy into a vibration, making its damping negative above the flutter speed.',
    'Classical wing flutter couples bending and torsion, whose frequencies approach each other as the speed rises.',
    'A centre of mass ahead of the elastic axis, high torsional stiffness and well-separated frequencies raise the flutter speed; control surfaces are mass-balanced.',
    'Aircraft are proved free of flutter by analysis, ground vibration tests and step-by-step flight flutter testing, with a margin beyond the dive speed.'
  ],
  pitfalls: [
    'Flutter is resonance between the wing and gusts or vortices in the wind — It needs no outside rhythm: the vibration makes its own forcing. Gusts only start it; above the flutter speed any disturbance grows.',
    'A stiffer wing is always safer — Stiffness helps, but what matters is the balance of frequencies, mass distribution and aerodynamics. Stiffening bending alone can bring its frequency closer to torsion and lower the flutter speed.',
    'Flutter builds up slowly, so a pilot can slow down in time — Above the flutter speed the amplitude can double in a few cycles at 5–20 Hz, well under a second. The margins are built in because there is no time to react.'
  ],
  formulas: [
    {
      name: 'Divergence speed of a wing section',
      expr: 'VD = sqrt(2*K/(rho*S*xe*a))', tex: 'V_D = \\sqrt{\\dfrac{2K}{\\rho\\, S\\, e\\, a}}',
      vars: {
        VD: { name: 'divergence speed', q: 'speed', unit: 'm/s', tex: 'V_D' },
        K: { name: 'torsional stiffness (per radian of twist)', q: 'torque', unit: 'N·m', value: 15350 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'area of the section', q: 'area', unit: 'm²', value: 1.5 },
        xe: { name: 'distance of the aerodynamic centre ahead of the elastic axis', q: 'length', unit: 'm', value: 0.225, tex: 'e' },
        a: { name: 'lift-curve slope (per radian)', value: 6.283 }
      },
      note: 'A typical section: the aerodynamic moment qSea·θ equals the elastic moment Kθ at q_D = K/(Sea). Defaults: one metre of the simulation\'s section (chord 1.5 m, elastic axis at 40 % chord).',
      stories: { VD: 'A wing strip of {S} with a torsional stiffness of {K} has its aerodynamic centre {xe} ahead of the elastic axis; its lift slope is {a} per radian. At what speed would it diverge in air of density {rho}?', K: 'What torsional stiffness keeps the divergence speed of a {S} section (offset {xe}, lift slope {a}) at {VD} in air of density {rho}?' }
    },
    {
      name: 'Reduced frequency',
      expr: 'k = pi*f*c/V', tex: 'k = \\frac{\\omega b}{V} = \\frac{\\pi f c}{V}',
      vars: {
        k: { name: 'reduced frequency' },
        f: { name: 'vibration frequency', q: 'frequency', unit: 'Hz', value: 5 },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 84 }
      },
      note: 'ω b/V with ω = 2πf and b = c/2: how many radians the wing vibrates while the air moves half a chord. Below about 0.05 the flow is quasi-steady.',
      stories: { k: 'A wing of chord {c} vibrates at {f} at an airspeed of {V}. What is the reduced frequency?' }
    },
    {
      name: 'Natural frequency of a torsion spring and inertia',
      expr: 'f = sqrt(K/I)/(2*pi)', tex: 'f = \\frac{1}{2\\pi}\\sqrt{\\frac{K}{I}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz' },
        K: { name: 'torsional stiffness (per radian)', q: 'torque', unit: 'N·m', value: 15350 },
        I: { name: 'moment of inertia about the elastic axis', q: 'inertia', unit: 'kg·m²', value: 6.075 }
      },
      note: 'The uncoupled torsion frequency in still air; the same form f = √(k/m)/2π gives the bending frequency.',
      stories: { f: 'A wing section with a moment of inertia of {I} is held by a torsional stiffness of {K}. At what frequency does it twist?', K: 'What torsional stiffness gives a section of inertia {I} a torsion frequency of {f}?' }
    },
    {
      name: 'Mass ratio of a wing section',
      expr: 'mu = m/(pi*rho*b^2)', tex: '\\mu = \\frac{m}{\\pi \\rho b^2}',
      vars: {
        mu: { name: 'mass ratio', tex: '\\mu' },
        m: { name: 'mass per metre of span', q: 'lindensity', unit: 'kg/m', value: 45 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        b: { name: 'half-chord', q: 'length', unit: 'm', value: 0.75 }
      },
      note: 'The section\'s mass compared with the air in a cylinder round its chord. Typically 10–50 for wings; it rises with altitude as the air thins.',
      stories: { mu: 'A wing section of half-chord {b} has {m} of mass per metre of span. What is its mass ratio in air of density {rho}?' }
    }
  ],
  examples: [
    {
      title: 'Flutter of the typical section',
      q: 'The simulation\'s section (chord 1.5 m, 45 kg/m, bending 3.2 Hz and torsion 8 Hz in still air, sea level) flutters at about 84 m/s, oscillating at about 5.1 Hz. Find its mass ratio and its reduced frequency at flutter.',
      steps: [
        'Mass ratio: $\\mu = 45/(\\pi \\times 1.225 \\times 0.75^2) = 20.8$.',
        'Reduced frequency: $k = \\pi f c/V = \\pi \\times 5.1 \\times 1.5/84 = 0.29$ — deep in the range where the lag of the air forces matters.',
        'The two modes, 3.2 Hz and 8 Hz apart in still air, have been drawn together to about 5 Hz by the aerodynamic stiffness.'
      ],
      a: 'μ ≈ 21 and k ≈ 0.29.'
    },
    {
      title: 'Divergence of the same section',
      q: 'The same section has a torsional stiffness of 15 350 N·m per radian per metre of span and its elastic axis at 40 % chord. With a lift slope of 2π per radian, at what speed would it diverge at sea level?',
      steps: [
        'Aerodynamic centre at 25 % chord: $e = (0.40 - 0.25) \\times 1.5 = 0.225$ m; area per metre $S = 1.5$ m².',
        '$V_D = \\sqrt{2 \\times 15\\,350/(1.225 \\times 1.5 \\times 0.225 \\times 6.283)} = \\sqrt{11\\,820} = 108.7$ m/s.',
        'Here divergence (109 m/s) lies above flutter (84 m/s). Moving the elastic axis back, or sweeping the wing forward, brings it down.'
      ],
      a: 'About 109 m/s (211 kt).'
    },
    {
      title: 'Mass-balancing an aileron',
      q: 'An aileron of 5 kg has its centre of mass 60 mm behind its hinge line. What balance mass, placed 150 mm ahead of the hinge, brings the centre of mass onto the hinge?',
      steps: [
        'Moments about the hinge must cancel: $m_b \\times 150 = 5 \\times 60$.',
        '$m_b = 300/150 = 2$ kg — and the aileron now weighs 7 kg.',
        'Real designs often aim to put the centre of mass slightly ahead of the hinge, and specify the balance in the maintenance data, to be checked after every repair or repaint.'
      ],
      a: '2 kg, 150 mm ahead of the hinge.'
    }
  ],
  quiz: [
    { q: 'Flutter is best described as…', choices: ['resonance of the wing with gusts', 'a self-excited vibration fed by motion-dependent air forces', 'a steady twisting of the wing', 'vibration from the engines'], a: 1,
      why: 'The air forces are created by the vibration itself and, above the flutter speed, do net work on it each cycle. No outside frequency is involved.' },
    { q: 'Moving a control surface\'s centre of mass forward to its hinge line (mass balancing)…', choices: ['lowers its flutter speed', 'raises its flutter speed, or removes flutter', 'has no aerodynamic effect', 'causes divergence'], a: 1,
      why: 'With the centre of mass on or ahead of the hinge, inertia no longer couples the wing\'s motion into the surface\'s rotation in the destabilising sense.' },
    { q: 'Above its divergence speed, a wing whose lift acts ahead of its elastic axis twists further and further until it fails.', a: true,
      why: 'The aerodynamic twisting moment grows with dynamic pressure faster than the fixed structural stiffness can resist.' },
    { q: 'A control surface of 0.4 m chord vibrates at 12 Hz on an aircraft flying at 100 m/s. What is the reduced frequency k = πfc/V?', answer: 0.151,
      why: 'k = π × 12 × 0.4/100 = 0.151.' },
    { q: 'In classical bending–torsion flutter, as the airspeed rises towards the flutter speed the two mode frequencies usually…', choices: ['move apart', 'approach each other', 'both fall to zero', 'stay fixed'], a: 1,
      why: 'The aerodynamic stiffness lowers the torsion frequency and couples the modes; flutter occurs near where their frequencies meet.' }
  ],
  applications: [
    'Flutter clearance of new aircraft and of every change of stores, engines or control surfaces.',
    'Mass balancing and stiffness requirements for control surfaces and tabs.',
    'Wind-turbine blades, helicopter rotors and turbomachinery blades, which can flutter too.',
    'Aeroelastic tailoring of composite wings to control how they twist.'
  ],
  history: 'Tail flutter of Handley Page O/400 bombers in 1916 led to the first flutter analysis, by Frederick Lanchester, who recommended joining the two elevators with a stiff torque tube. Mass balancing of control surfaces became standard in the 1920s and 1930s after a series of accidents; Theodore Theodorsen of the NACA published the unsteady aerodynamics of a vibrating airfoil in 1935, and flight flutter testing with in-flight excitation developed from the mid-1930s.',
  sim: 'flow-flutter'
},

{
  id: 'galloping-bridges', parent: 'wind-structures', title: 'Bridges, galloping and Tacoma Narrows', level: 2,
  short: 'Wind shakes slender structures in three ways: vortex shedding that locks on near one wind speed (bounded — a true resonance), galloping of shapes whose cross-wind force feeds their motion, and torsional flutter of bluff bridge decks. The Tacoma Narrows Bridge (1940) failed by the last — not by resonance with the wind.',
  keywords: ['Tacoma Narrows', 'galloping', 'vortex-induced vibration', 'VIV', 'lock-in', 'Den Hartog criterion', 'Strouhal number', 'Scruton number', 'torsional flutter', 'bridge deck', 'aeroelastic', 'iced power lines', 'strakes', 'tuned mass damper', 'box girder', 'Galloping Gertie'],
  prereq: ['vortex-shedding', 'flutter', 'physics:driven-oscillations'],
  related: ['wind-loads', 'strouhal-froude', 'bluff-bodies', 'flow-separation', 'similarity-testing', 'wind-tunnel', 'physics:damped-oscillations', 'drag-crisis'],
  body: `
Long bridges, chimneys, lamp posts, stay cables and power lines are light, flexible and lightly damped — ideal victims for the wind. Engineers separate three mechanisms, because they behave, and are cured, differently.

### 1. Vortex-induced vibration: a true resonance
A bluff section sheds vortices alternately from its two sides at the Strouhal frequency
$$f_s = \\mathrm{St}\\,\\frac{V}{D}$$
with St about 0.2 for a circular cylinder and 0.1–0.15 for square and deck-like shapes ([[vortex-shedding]]). Each vortex pushes the body sideways, so it feels an alternating cross-wind force. When $f_s$ nears a natural frequency $f_n$ — at the **critical speed** $V_{cr} = f_n D/\\mathrm{St}$ — the motion grows, and then the motion takes control of the shedding: over a band of speeds the vortices **lock in** to the structure's frequency. The amplitude is limited, typically a fraction of the diameter; it happens only in that band; and it is smaller the heavier and better damped the structure, measured by the **Scruton number** $\\mathrm{Sc} = 4\\pi\\zeta m/(\\rho D^2)$. Steel chimneys get helical **strakes** to scramble the shedding; bridges get guide vanes or tuned mass dampers. Denmark's Great Belt East Bridge (vertical oscillations before it opened in 1998, cured with guide vanes) and the Volgograd Bridge in Russia (2010, calmed with dampers) are recent examples.

### 2. Galloping: self-excited, and growing with speed
Some shapes — a square, a D-section, ice on a power line — have the unlucky property that a small cross-wind velocity of the body produces a force pushing the same way. A body moving down at speed $\\dot y$ in a wind $U$ feels the wind coming slightly from below, at an angle $\\dot y/U$. For a circle, the drag, tilted with that relative wind, opposes the motion. For a square, the change of lift with angle overwhelms the drag. **Den Hartog's criterion** (1932) says galloping is possible when
$$\\frac{dC_L}{d\\alpha} + C_D < 0$$
The aerodynamic damping is then negative and grows with $U$, and it overcomes the structural damping above
$$U_g = \\frac{8\\pi\\, m\\,\\zeta\\, f_n}{\\rho D\\, a_G}, \\qquad a_G = -\\left(\\frac{dC_L}{d\\alpha} + C_D\\right)$$
Beyond that speed the amplitude grows to many diameters and keeps growing as the wind strengthens. Iced transmission lines gallop in loops metres high at a fraction of a hertz, clashing conductors and breaking fittings.

### 3. Torsional flutter of a deck: Tacoma Narrows
The Tacoma Narrows Bridge in Washington State, opened on 1 July 1940, was a suspension bridge with an 853 m main span and a deck only 11.9 m wide, stiffened by solid plate girders 2.4 m deep: an H-shaped, extremely slender and flexible section. From the start it moved up and down in moderate winds — "Galloping Gertie" — in vertical modes of a fraction of a hertz; those motions were bounded and largely vortex-induced. On 7 November 1940, in a steady wind of about 19 m/s (42 mph), the motion changed to **twisting**: a torsional mode with a node at mid-span, at about 0.2 Hz, the deck tilting by more than 20° either way. After about an hour of violent torsion, hangers broke and the main span fell into the Narrows. No person died; a dog left in a car was lost.

The final twisting was **torsional flutter**, a single-degree-of-freedom aeroelastic instability. Flow separating at the bluff leading edge of the H-section formed vortices that travelled across the deck in step with the twisting, and the resulting moment acted in phase with the *rate* of rotation — negative aerodynamic damping in torsion, the rotational cousin of galloping. It was not resonance with the wind or with ordinary vortex shedding: a steady wind has no period, and the Strouhal shedding frequency at 19 m/s from a 2.4 m-deep section is near 1 Hz, four to five times the 0.2 Hz of the twisting. The popular "resonance" story, still found in some textbooks, is wrong; K. Yusuf Billah and Robert Scanlan set the record straight for physics teachers in 1991.

### The cure
The investigation by Othmar Ammann, Theodore von Kármán and Glenn Woodruff (1941), and the long programme of model tests that followed, turned bridge aerodynamics into a discipline. Every long-span design is now checked with **section models on springs** in a wind tunnel — the set-up of the simulation — and often a full aeroelastic model. Decks are made **streamlined** (the aerofoil-like steel box of the Severn Bridge, 1966) or **open** (deep trusses, slotted twin boxes), and given damping. The replacement Tacoma Narrows Bridge of 1950 has a deep open truss.

> [!key] Three mechanisms, three signatures. Vortex resonance is bounded and confined to a band of wind speeds; galloping and flutter are self-excited and, once started, grow at every higher speed. Only the first is "resonance".
`,
  ideas: [
    'Vortex-induced vibration: shedding at St·V/D locks on to a natural frequency — bounded, within a band of speeds, a true resonance.',
    'Galloping: for shapes with dC_L/dα + C_D < 0 the cross-wind force feeds the motion; above a critical speed the amplitude grows with the wind.',
    'Torsional flutter: a bluff deck\'s twisting creates a moment in phase with the twisting rate — negative torsional damping.',
    'Tacoma Narrows (1940) failed by torsional flutter at about 0.2 Hz in a steady 19 m/s wind, not by resonance.',
    'Cures: mass and damping (the Scruton number), strakes and vanes against shedding, streamlined or open decks against flutter, and wind-tunnel section-model tests.'
  ],
  pitfalls: [
    'Tacoma Narrows collapsed because the wind\'s frequency matched the bridge\'s natural frequency — A steady wind has no frequency, and the vortex-shedding frequency was far above the 0.2 Hz twisting. The bridge fluttered: its own motion made the forces that drove it.',
    'All wind-induced vibration grows without limit — Vortex-induced vibration is bounded and confined to a band of speeds. It is galloping and flutter that grow at every higher speed.',
    'A round section cannot vibrate in the wind — It cannot gallop, but it sheds vortices and can lock in; chimneys and cables need strakes or damping for exactly this reason.'
  ],
  formulas: [
    {
      name: 'Vortex-shedding frequency',
      expr: 'fs = St*V/D', tex: 'f_s = \\mathrm{St}\\,\\frac{V}{D}',
      vars: {
        fs: { name: 'shedding frequency', q: 'frequency', unit: 'Hz', tex: 'f_s' },
        St: { name: 'Strouhal number', value: 0.2, tex: '\\mathrm{St}' },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 10 },
        D: { name: 'across-wind size of the section', q: 'length', unit: 'm', value: 1.5 }
      },
      note: 'St ≈ 0.2 for a circle (0.18 in the Eurocode), about 0.12 for a square. Vortex resonance begins where f_s reaches a natural frequency: V_cr = f_n D/St.',
      stories: { fs: 'A chimney {D} across stands in a {V} wind. At what frequency does it shed vortices (St = {St})?', V: 'A chimney {D} across has a natural frequency of {fs}. At what wind speed will it shed vortices at that frequency (St = {St})?' }
    },
    {
      name: 'Galloping onset speed (Den Hartog, quasi-steady)',
      expr: 'Ug = 8*pi*m*zeta*fn/(rho*D*aG)', tex: 'U_g = \\frac{8\\pi\\, m\\, \\zeta\\, f_n}{\\rho D\\, a_G}',
      vars: {
        Ug: { name: 'wind speed at which galloping starts', q: 'speed', unit: 'm/s', tex: 'U_g' },
        m: { name: 'mass per metre of length', q: 'lindensity', unit: 'kg/m', value: 1.8 },
        zeta: { name: 'structural damping ratio', q: 'ratio', unit: '%', value: 1, tex: '\\zeta' },
        fn: { name: 'natural frequency (across the wind)', q: 'frequency', unit: 'Hz', value: 0.25, tex: 'f_n' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        D: { name: 'across-wind size of the section', q: 'length', unit: 'm', value: 0.05 },
        aG: { name: 'galloping factor −(dC_L/dα + C_D)', value: 0.3, tex: 'a_G' }
      },
      note: 'Positive a_G means galloping is possible (Den Hartog). Aerodynamic damping −ρUDa_G/2 per unit length cancels the structural 4πmζf_n at U_g. Defaults: an iced power-line conductor.',
      stories: { Ug: 'An iced conductor of {m} and {D} across hangs with a natural frequency of {fn} and damping {zeta}; its galloping factor is {aG}. Above what wind speed can it gallop (air {rho})?', zeta: 'What damping ratio would keep the galloping speed of a {m}, {D} section ({fn}, factor {aG}) at {Ug} in air of density {rho}?' }
    },
    {
      name: 'Scruton number (mass–damping parameter)',
      expr: 'Sc = 4*pi*zeta*m/(rho*D^2)', tex: '\\mathrm{Sc} = \\frac{4\\pi\\, \\zeta\\, m}{\\rho D^2}',
      vars: {
        Sc: { name: 'Scruton number', tex: '\\mathrm{Sc}' },
        zeta: { name: 'structural damping ratio', q: 'ratio', unit: '%', value: 1, tex: '\\zeta' },
        m: { name: 'mass per metre of length', q: 'lindensity', unit: 'kg/m', value: 1.8 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        D: { name: 'across-wind size', q: 'length', unit: 'm', value: 0.05 }
      },
      note: 'Also written 2δm/(ρD²) with δ = 2πζ the logarithmic decrement. High Sc means small vortex-induced amplitudes and a high galloping speed.',
      stories: { Sc: 'A cable of {m} and {D} across has a damping ratio of {zeta}. What is its Scruton number in air of density {rho}?' }
    }
  ],
  examples: [
    {
      title: 'Why Tacoma was not vortex resonance',
      q: 'Tacoma Narrows twisted at about 0.2 Hz in a 19 m/s wind. Its deck girders were 2.44 m deep; take St ≈ 0.11 for the H-section. Compare the shedding frequency with 0.2 Hz, and find the wind speed at which shedding would have matched it.',
      steps: [
        'Shedding at 19 m/s: $f_s = 0.11 \\times 19/2.44 = 0.86$ Hz — four times the twisting frequency.',
        'A match needs $V = f D/\\mathrm{St} = 0.2 \\times 2.44/0.11 = 4.4$ m/s: a light breeze, not the steady 19 m/s gale of that morning.',
        'The collapse therefore needs another explanation: a self-excited torsional flutter, whose driving moment follows the deck\'s own motion.'
      ],
      a: 'About 0.86 Hz against 0.2 Hz; resonance with shedding would have needed only about 4.4 m/s.'
    },
    {
      title: 'A steel chimney in a light wind',
      q: 'A steel chimney 1.2 m across has its first natural frequency at 0.8 Hz. Taking St = 0.18, at what wind speed does vortex shedding lock on?',
      steps: [
        '$V_{cr} = f_n D/\\mathrm{St} = 0.8 \\times 1.2/0.18 = 5.3$ m/s.',
        'A gentle wind that blows for many hours a year: welded steel chimneys, lightly damped, often need helical strakes or dampers.'
      ],
      a: 'About 5.3 m/s.'
    },
    {
      title: 'Galloping of an iced conductor',
      q: 'Ice turns a conductor into a D-like section 50 mm across with a galloping factor a_G ≈ 0.3. It weighs 1.8 kg/m, has a natural frequency of 0.25 Hz and a damping ratio of 1 %. Above what wind can it gallop, and what is its Scruton number?',
      steps: [
        '$U_g = 8\\pi \\times 1.8 \\times 0.01 \\times 0.25/(1.225 \\times 0.05 \\times 0.3) = 0.113/0.0184 = 6.2$ m/s.',
        '$\\mathrm{Sc} = 4\\pi \\times 0.01 \\times 1.8/(1.225 \\times 0.05^2) = 74$.',
        'Despite the high Scruton number the galloping speed is a moderate breeze: the low frequency and the light, slender section work against it. Detuning pendulums and interphase spacers are fitted on lines prone to ice.'
      ],
      a: 'About 6 m/s; Sc ≈ 74.'
    }
  ],
  quiz: [
    { q: 'Which wind-induced vibration is limited to a band of wind speeds and has a bounded amplitude?', choices: ['galloping', 'vortex-induced vibration (lock-in)', 'torsional flutter', 'divergence'], a: 1,
      why: 'Lock-in happens only while the shedding frequency is near a natural frequency, and the vortex forces saturate. Galloping and flutter grow at every higher speed.' },
    { q: 'The Tacoma Narrows Bridge collapsed because gusts of wind arrived at the bridge\'s natural frequency.', a: false,
      why: 'The wind was steady, about 19 m/s. The deck fluttered in torsion: a self-excited motion whose aerodynamic moment was produced by the twisting itself.' },
    { q: 'A lamp post 0.3 m across (St = 0.2) has its first natural frequency at 2 Hz. At what wind speed do vortices shed at that frequency?', answer: 3, unit: 'm/s',
      why: 'V = f D/St = 2 × 0.3/0.2 = 3 m/s.' },
    { q: 'Den Hartog\'s criterion for galloping is…', choices: ['C_L > C_D', 'dC_L/dα + C_D < 0', 'St > 0.2', 'Re > 3.5 × 10⁵'], a: 1,
      why: 'When the lift slope is negative enough to outweigh the drag, the cross-wind force pushes the same way as the cross-wind velocity: negative damping.' },
    { q: 'Doubling the structural damping of a cable prone to galloping…', choices: ['halves its galloping speed', 'doubles its galloping speed', 'has no effect', 'stops vortex shedding'], a: 1,
      why: 'U_g is proportional to mζ: twice the damping needs twice the aerodynamic (negative) damping, which grows linearly with wind speed.' }
  ],
  applications: [
    'Wind-tunnel section-model and full aeroelastic tests of long-span bridges.',
    'Helical strakes on chimneys, and tuned mass dampers on towers and footbridges.',
    'Anti-galloping devices and spacers on overhead power lines.',
    'Stay cables with surface patterns and dampers against wind- and rain-induced vibration.'
  ],
  history: 'Theodore von Kármán explained the alternating vortex street in 1911, and Jacob Pieter Den Hartog explained the galloping of ice-coated power lines in 1932. The fall of the Tacoma Narrows Bridge on 7 November 1940 was filmed from the shore and studied by Frederick Burt Farquharson of the University of Washington, whose model tests guided the replacement opened in 1950; Robert Scanlan\'s flutter derivatives (1971) became the standard way to measure a deck\'s aeroelastic behaviour.',
  sim: ['flow-gallop', 'flow-flutter']
}

);
