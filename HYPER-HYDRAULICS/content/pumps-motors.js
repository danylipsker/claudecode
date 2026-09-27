/* HYPER-HYDRAULICS · content/pumps-motors.js — the branch "Hydraulic Pumps and Motors":
 *   hydraulic-pumps  positive-displacement, gear-pumps, vane-pumps, piston-pumps, displacement-flow,
 *                    pump-efficiencies, variable-displacement, pressure-compensated-pump
 *   motors-topic     hydraulic-motors, motor-torque-speed, lsht-motors, hydrostatic-transmission
 * Simulations in sims/pumps-motors.js (ids pm-*). Units: displacement in cm³/rev, shaft speed as a
 * frequency in rpm, flow in L/min, pressure in bar (gauge, or a difference across the machine). */
Hyper.add(

/* ================================================================ PUMPS */
{
  id: 'positive-displacement', parent: 'hydraulic-pumps', title: 'Positive-displacement pumps', level: 1,
  short: 'A pump that traps a fixed volume of oil, carries it from the inlet to the outlet and squeezes it out, so it delivers nearly the same flow whatever the pressure. It makes flow; the load makes the pressure, and a relief valve must cap it.',
  keywords: ['positive displacement', 'hydrostatic pump', 'displacement', 'fixed displacement', 'gear pump', 'vane pump', 'piston pump', 'screw pump', 'pump makes flow', 'relief valve', 'flow ripple', 'suction', 'centrifugal versus positive displacement'],
  prereq: ['pressure-flow-power', 'hydraulic-system', 'flow-rate'],
  related: ['centrifugal-pump', 'pump-curves', 'gear-pumps', 'vane-pumps', 'piston-pumps', 'displacement-flow', 'relief-valve', 'cavitation', 'hydraulic-motors', 'pneumatics:compressor-types'],
  body: `
Pumps come in two families. A **hydrodynamic** pump — the [[centrifugal-pump|centrifugal pump]] of a water main — gives the liquid speed and lets its casing turn that speed into pressure; close its outlet and it simply churns at its shut-off head. A **positive-displacement** (hydrostatic) pump works like a syringe that never stops: a chamber opens at the inlet and fills, is sealed off, is carried to the outlet and is squeezed empty. Every revolution moves a fixed volume, the **displacement** $V_g$, whatever is waiting at the outlet. Gears, vanes, pistons and screws are simply different ways of building those chambers.

### The pump makes flow; the load makes pressure
Ideally the flow is just displacement times speed,

$$Q = V_g\\,n$$

so a 16 cm³/rev pump turned at 1450 rpm pushes out 23.2 L/min — against 5 bar or against 250 bar. Real pumps leak a little back through their clearances (a few per cent at full pressure, see [[pump-efficiencies]]), so the flow sags only slightly as the pressure rises. The pressure itself is **not** a property of the pump: it rises until the oil can go somewhere — until the cylinder moves its load, the motor turns, or the relief valve opens. That is the first idea of oil hydraulics, and its first safety rule: a positive-displacement pump must never be able to work against a closed outlet without a [[relief-valve|relief valve]]. Blocked, it raises the pressure until the weakest hose, seal or casing gives way.

| | Centrifugal pump | Positive-displacement pump |
|---|---|---|
| What it fixes | roughly the head, at a given flow | the flow, at a given speed |
| Outlet blocked | runs at shut-off head and slowly warms | pressure rises until something opens or bursts |
| Flow as pressure rises | falls steeply | nearly constant, a few per cent lost to leakage |
| Usual pressures | 1–20 bar per stage | 100–450 bar |
| Thick liquids | efficiency collapses | handled well |

### Why hydraulics uses them
High pressure needs tight chambers, not fast liquid. To make 250 bar in oil a single centrifugal stage would need a tip speed of about 240 m/s; a gear pump does it at a walking pace of a few metres per second at the teeth. Displacement also makes the flow proportional to shaft speed, so actuator speeds are predictable, and the same machine can run backwards as a [[hydraulic-motors|motor]].

### The families
| Type | Displacement (cm³/rev) | Continuous pressure | Overall efficiency | Noise | Variable? |
|---|---|---|---|---|---|
| External gear | 1–250 | up to about 250 bar | 0.80–0.88 | loud | no |
| Internal gear | 3–250 | 250–300 bar | 0.85–0.90 | quiet | no |
| Vane | 5–200 | 160–210 bar (some 280) | 0.80–0.88 | quiet | the unbalanced type |
| Axial piston | 10–1000 | 350–450 bar | 0.87–0.93 | medium | yes |
| Radial piston | 0.5–100 | 500–700 bar and more | 0.85–0.92 | medium | some |
| Screw | 5–3000 | up to about 160 bar | 0.75–0.85 | very quiet | no |

These are typical ranges; individual designs go beyond them. The next pages take [[gear-pumps]], [[vane-pumps]] and [[piston-pumps]] in turn.

### Pulses and suction
Because the chambers deliver one after another, the flow carries a small **ripple** at the pumping frequency — chambers per revolution × speed — which is heard as the pump's whine. At the inlet the pump cannot pull: the atmosphere pushes the oil in. Most pumps need at least about 0.8 bar **absolute** at the inlet; below that, dissolved air comes out or the oil boils locally ([[cavitation]], [[air-in-oil]]), eroding the pump and making it rattle. So suction lines are short and wide (0.5–1.2 m/s), the pump sits low, and fine filters go anywhere but the suction line.

> [!warn] A positive-displacement pump can build pressure far beyond what its circuit is rated for. Before working on a system, stop and lock out the drive, release the pressure and discharge any accumulator. Never feel for a leak with your hand: a pinhole jet can inject oil under the skin — an injury that looks small but is a surgical emergency. Seek emergency medical care at once.
`,
  ideas: [
    'A positive-displacement pump moves a fixed volume per revolution: flow ≈ displacement × speed, almost independent of pressure.',
    'The pump makes flow; the load makes the pressure, up to the relief-valve setting.',
    'Blocked without a relief valve, the pressure rises until something fails.',
    'Gear pumps are cheap and robust, vane pumps quiet, piston pumps efficient at the highest pressures and variable.',
    'The inlet is filled by atmospheric pressure, so suction lines must be short, wide and unrestricted.'
  ],
  pitfalls: [
    'A pump produces pressure — It produces flow. Pressure is the resistance that flow meets: an unloaded pump circulating oil to the tank runs at a few bar.',
    'A pump sucks the oil in — It only makes room; the atmosphere pushes the oil into the inlet, which is why a suction line with too much resistance starves the pump.',
    'A bigger pump gives more force — More displacement gives more flow and speed. Force comes from pressure, which the relief valve limits, times area.'
  ],
  formulas: [
    {
      name: 'Ideal (geometric) flow',
      expr: 'Q = Vg*n', tex: 'Q = V_g\\,n',
      vars: {
        Q: { name: 'ideal flow', q: 'flowrate', unit: 'L/min' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 16, tex: 'V_g' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1450 }
      },
      note: 'Displacement × speed. Leakage makes the delivered flow a few per cent less (see the volumetric efficiency).',
      stories: {
        Q: 'A pump of {Vg} runs at {n}. What flow would it deliver without leakage?',
        Vg: 'A power pack needs {Q} from a motor turning at {n}. What displacement must the pump have (ignoring leakage)?',
        n: 'A pump of {Vg} must deliver {Q}. How fast must it turn?'
      }
    },
    {
      name: 'Heat when the flow has nowhere to go',
      expr: 'P = pr*Q', tex: 'P = p_r\\,Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW' },
        pr: { name: 'relief-valve setting (gauge)', q: 'pressure', unit: 'bar', value: 180, tex: 'p_r' },
        Q: { name: 'pump flow over the relief valve', q: 'flowrate', unit: 'L/min', value: 46 }
      },
      note: 'A fixed pump against a blocked outlet sends all its flow over the relief valve: pressure × flow becomes heat. P (kW) = p (bar) × Q (L/min) / 600.',
      stories: {
        P: 'A cylinder has reached its stop and the whole pump flow of {Q} passes the relief valve at {pr}. How much heat goes into the oil?',
        Q: 'A relief valve set at {pr} is dissipating {P}. How much flow is passing it?'
      }
    }
  ],
  examples: [
    {
      title: 'A loader at its stop',
      q: 'A tractor\'s 25 cm³/rev gear pump turns at 2000 rpm and has a volumetric efficiency of 0.92 at 180 bar. The loader cylinder reaches its end stop while the operator holds the lever, and the relief valve (180 bar) opens. How much heat is made, and how fast does it warm 60 L of oil (ρ = 870 kg/m³, c = 1.88 kJ/(kg·K)) with no cooling?',
      steps: [
        'Ideal flow: $Q = V_g n = 25 \\times 2000 = 50\\,000$ cm³/min $= 50$ L/min; delivered $50 \\times 0.92 = 46$ L/min.',
        'All of it crosses the relief valve: $P = p Q = 1.8\\times10^7 \\times 46/60\\,000 = 13.8$ kW.',
        'Heat capacity of the oil: $60\\times10^{-3} \\times 870 \\times 1880 = 98$ kJ/K.',
        'Warming rate: $13\\,800/98\\,000 = 0.14$ K/s, about 8 °C every minute.'
      ],
      a: 'About 13.8 kW of heat, warming the oil by roughly 8 °C per minute — which is why nobody should hold a lever against a stop.'
    },
    {
      title: 'Why the pump sits low',
      q: 'A pump is mounted 1.2 m above the oil level. With warm oil the suction line loses 0.05 bar; on a cold morning the oil is about 4.4 times as viscous and the (laminar) loss grows in proportion. With the atmosphere at 1.013 bar, what is the absolute pressure at the pump inlet in each case, compared with the 0.8 bar minimum?',
      steps: [
        'Static lift: $\\rho g h = 870 \\times 9.81 \\times 1.2 = 10\\,240$ Pa $= 0.10$ bar.',
        'Warm: $1.013 - 0.10 - 0.05 = 0.86$ bar absolute — just acceptable.',
        'Cold: the line loss becomes $4.4 \\times 0.05 = 0.22$ bar, so $1.013 - 0.10 - 0.22 = 0.69$ bar absolute — below the limit: the pump cavitates and rattles until the oil warms.'
      ],
      a: '0.86 bar absolute warm, 0.69 bar cold: the cold start is where suction problems appear. A flooded inlet (pump below the tank) avoids them.'
    }
  ],
  quiz: [
    { q: 'A gear pump at constant speed feeds a cylinder. The load on the cylinder doubles (still below what the relief setting allows). What happens?', choices: ['the flow halves', 'the pressure roughly doubles and the flow stays nearly the same', 'the pump speeds up', 'pressure and flow both double'], a: 1,
      why: 'The pump keeps pushing its displacement every revolution; the pressure rises to whatever the load needs. Only a little extra leakage reduces the flow.' },
    { q: 'A positive-displacement pump produces pressure.', a: false,
      why: 'It produces flow. The pressure is set by what resists the flow — the load, the line losses — and is capped by the relief valve.' },
    { q: 'What is the ideal flow of a 10 cm³/rev pump turning at 2900 rpm?', answer: 29, unit: 'L/min',
      why: '10 cm³ × 2900 /min = 29 000 cm³/min = 29 L/min.' },
    { q: 'Why must every circuit with a positive-displacement pump have a relief valve (or an equivalent pressure limit)?', choices: ['to keep the oil cool', 'because a blocked outlet would otherwise raise the pressure until something fails', 'to prime the pump', 'to reduce the noise'], a: 1,
      why: 'The pump keeps delivering its displacement; with nowhere for the oil to go the pressure rises without limit. The relief valve gives it a path at a safe pressure.' },
    { q: 'Where is a fine filter most harmful?', choices: ['in the return line', 'in the pressure line', 'in the pump\'s suction line', 'in a separate kidney-loop circuit'], a: 2,
      why: 'The inlet is filled only by atmospheric pressure; a restriction there, worse as it clogs or as the oil gets cold, starves the pump and makes it cavitate.' }
  ],
  problems: [
    { q: 'A 45 cm³/rev pump runs at 1800 rpm. What is its ideal flow, in L/min?', answer: 81, unit: 'L/min', tol: 0.02,
      steps: ['$Q = V_g n = 45 \\times 1800 = 81\\,000$ cm³/min = 81 L/min.'] },
    { q: 'A pump sends 30 L/min over a relief valve set at 140 bar. How much heat is produced, in kW?', answer: 7, unit: 'kW', tol: 0.02,
      steps: ['$P = pQ = 1.4\\times10^7 \\times 30/60\\,000 = 7000$ W = 7 kW (or 140 × 30 / 600).'] }
  ],
  applications: ['Every hydraulic power pack, from a 1 kW workshop press to the multi-pump drives of a 100-tonne excavator.', 'Lubrication and fuel pumps in engines and gearboxes; the radial piston pumps of common-rail diesel injection, at over 2000 bar.', 'Dosing and metering, where the fixed volume per stroke is the measurement itself.', 'Pumping thick liquids — bitumen, chocolate, concrete — that defeat centrifugal pumps.'],
  history: 'The piston force pump is ancient: Ctesibius of Alexandria built a two-cylinder pump with valves in the third century BC. Rotary pumps with meshing rotors followed in the seventeenth century. What made modern oil hydraulics possible was precision machining in the twentieth: clearances of a few micrometres let pumps hold hundreds of bar with little leakage.',
  sim: [{ id: 'pm-comp-pump', params: { mode: 'fixed' } }, 'pm-gear-pump']
},

{
  id: 'gear-pumps', parent: 'hydraulic-pumps', title: 'Gear pumps', level: 2,
  short: 'Two meshing gears carry oil round the outside in the spaces between their teeth, from the inlet to the outlet; the mesh in the middle stops it coming back. Cheap, tough, tolerant of dirt, and the commonest pump in hydraulics.',
  keywords: ['gear pump', 'external gear pump', 'internal gear pump', 'crescent pump', 'gerotor', 'module', 'teeth', 'face width', 'flow ripple', 'pumping frequency', 'pressure-loaded bushings', 'side plates', 'trapped oil', 'relief groove', 'whine'],
  prereq: ['positive-displacement', 'displacement-flow'],
  related: ['vane-pumps', 'piston-pumps', 'pump-efficiencies', 'hi-lo-circuit', 'hydrostatic-transmission', 'lsht-motors', 'contamination'],
  body: `
The external gear pump is the workhorse of hydraulics: two gears in a close-fitting case, a handful of parts, a low price and a tolerance of dirt and abuse that keeps tractors, tippers and log splitters working for decades. One gear is driven by the shaft and turns the other. Where the teeth come **out** of mesh, the spaces between them open up and oil flows in from the inlet. Each tooth space then carries its oil round the **outside**, sealed between the tooth tips and the bore of the casing, to the outlet side, where the teeth come back **into** mesh and squeeze it out. The mesh in the middle is a moving wall that stops the oil going back.

### Displacement
The oil moved per revolution depends on the tooth size — the **module** $m$, pitch diameter divided by the number of teeth — the number of teeth $z$ and the face width $b$. An energy balance on the teeth (outlet pressure pushing on the parts of the flanks beyond the contact point) gives, for two equal gears,

$$V_g \\approx 2\\pi\\,b\\,m^2\\,(z+1)$$

This is the value while the teeth touch at the pitch point; averaged over a tooth it is a few per cent less — about 6 % for 12 teeth. Gears of module 3 mm with 12 teeth, 20 mm wide, give 14.7 cm³/rev (13.9 on average), about 21 L/min at 1500 rpm. The displacement grows with the **square** of the module, which is why gear-pump teeth are few and stubby: coarse teeth carry more oil in the same package.

### Ripple and noise
As the contact point slides along the teeth, the delivered flow rises and falls once per tooth. With 12 teeth it swings by roughly 18 %; with 20 teeth in the same package, about 11 %. The **pumping frequency** is

$$f = z\\,n$$

— 300 Hz for 12 teeth at 1500 rpm — and the pressure ripple it makes, passed on to pipes and panels, is the familiar gear-pump whine. Oil trapped between two pairs of teeth in contact at once is released through **relief grooves** in the side plates; without them it would be squeezed to enormous pressures and the pump would hammer.

### Where the oil leaks
- **Across the gear faces** to the side plates — the largest path. Modern pumps use **pressure-loaded bushings**: outlet pressure pushes the side plates against the gears, so the gap closes as the pressure rises. This is what lets a gear pump reach 250–300 bar with a volumetric efficiency of 0.90–0.95.
- **Past the tooth tips** to the casing bore.
- **Through the mesh**, back towards the inlet.

The outlet pressure also pushes both gears sideways towards the inlet: for a 14 cm³/rev pump at 250 bar the load on each gear is over 10 kN, and it is the bearings, not the gears, that set the pressure rating. The gears run in against the casing on the inlet side, which is why a used housing is polished there.

### Internal gears and gerotors
| Type | How it works | Pressure | Noise | Typical uses |
|---|---|---|---|---|
| External gear | two gears side by side | up to about 250–300 bar | loud (ripple 10–20 %) | tractors, tippers, power packs |
| Internal gear (crescent) | a pinion inside a ring gear, with a crescent-shaped filler between them | up to about 300 bar | quiet | presses, injection moulding, lifts |
| Gerotor | an inner rotor with one tooth fewer than the outer ring | 30–150 bar | quiet | charge pumps, lubrication, transmissions |

A gear pump's displacement is fixed, so its flow can be changed only through its speed. Double pumps — two gear sets on one shaft — supply two circuits, or a large flow at low pressure plus a small flow at high pressure in a [[hi-lo-circuit|hi-lo circuit]].
`,
  ideas: [
    'Oil is carried round the outside of the gears, in the tooth spaces; the mesh seals the outlet from the inlet.',
    'Displacement ≈ 2π b m²(z + 1): it grows with the face width and the square of the module.',
    'The flow ripples once per tooth; the pumping frequency z·n is the pitch of the whine.',
    'Pressure-loaded side plates close the largest leakage gap as the pressure rises.',
    'The displacement is fixed: flow is changed only by speed.'
  ],
  pitfalls: [
    'The oil goes through the middle, between the gears — The mesh is the seal. The oil travels round the outside, in the spaces between the teeth and the casing.',
    'Any gear pump can be run in either direction — Most are handed: the inlet port is larger and the pressure-loaded side plates are shaped for one direction. Reversed, the shaft seal or the plates can fail.',
    'More teeth give more flow — In a given package, more (finer) teeth give a smoother but smaller displacement, because the displacement goes with the square of the module.'
  ],
  formulas: [
    {
      name: 'Gear-pump displacement (two equal gears)',
      expr: 'Vg = 2*pi*b*m^2*(z + 1)', tex: 'V_g = 2\\pi\\,b\\,m^2\\,(z+1)',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        b: { name: 'face width of the gears', q: 'length', unit: 'mm', value: 20 },
        m: { name: 'module (pitch diameter / teeth)', q: 'length', unit: 'mm', value: 3 },
        z: { name: 'number of teeth on each gear', int: true, value: 12, min: 6, max: 40 }
      },
      note: 'Upper value, with the teeth in contact at the pitch point; averaged over a tooth the displacement is a few per cent less (20° pressure angle).',
      stories: {
        Vg: 'A gear pump has two gears of module {m} with {z} teeth each, {b} wide. What is its displacement?',
        b: 'Gears of module {m} with {z} teeth must give {Vg}. How wide must they be?'
      }
    },
    {
      name: 'Pumping frequency',
      expr: 'f = z*n', tex: 'f = z\\,n',
      vars: {
        f: { name: 'pumping (ripple) frequency', q: 'frequency', unit: 'Hz' },
        z: { name: 'number of teeth on each gear', int: true, value: 12, min: 6, max: 40 },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1500 }
      },
      note: 'One pulse per tooth passing the mesh. Harmonics at 2f, 3f… are also heard.',
      stories: { f: 'A gear pump with {z} teeth turns at {n}. At what frequency does it whine?', n: 'A gear pump with {z} teeth whines at {f}. How fast is it turning?' }
    }
  ],
  examples: [
    {
      title: 'Sizing the gears',
      q: 'A designer wants 20 cm³/rev from gears of module 3 mm with 12 teeth. How wide must they be, and at what frequency will the pump whine on a 1450 rpm motor?',
      steps: [
        { text: 'Rearrange the displacement formula:', tex: 'b = \\frac{V_g}{2\\pi m^2 (z+1)} = \\frac{20\\times10^{-6}}{2\\pi \\times (3\\times10^{-3})^2 \\times 13} = 27.2\\ \\text{mm}' },
        'A standard 28 mm width gives $2\\pi \\times 0.028 \\times 9\\times10^{-6} \\times 13 = 20.6$ cm³/rev (about 19.4 averaged over a tooth).',
        'Pumping frequency: $f = z n = 12 \\times 1450/60 = 290$ Hz.'
      ],
      a: 'About 27 mm (28 mm chosen); the pump whines at 290 Hz.'
    },
    {
      title: 'Leakage at low speed',
      q: 'A 14 cm³/rev gear pump leaks 1.7 L/min at 200 bar. What is its volumetric efficiency at 2400 rpm and at 800 rpm?',
      steps: [
        'At 2400 rpm: ideal $14 \\times 2400 = 33.6$ L/min; delivered $33.6 - 1.7 = 31.9$ L/min; $\\eta_v = 0.95$.',
        'At 800 rpm: ideal 11.2 L/min; delivered 9.5 L/min; $\\eta_v = 0.85$.',
        'The leakage depends on pressure and clearances, not on speed, so it is a bigger share of a smaller flow.'
      ],
      a: '0.95 at 2400 rpm, 0.85 at 800 rpm.'
    }
  ],
  quiz: [
    { q: 'In an external gear pump, how does the oil get from the inlet to the outlet?', choices: ['through the mesh between the gears', 'round the outside, in the spaces between the teeth and the casing', 'through a hole in the shaft', 'through the side plates'], a: 1,
      why: 'Each tooth space carries its oil round the periphery; the mesh, where teeth fill each other\'s spaces, blocks the way back.' },
    { q: 'The module of a gear pump\'s gears is doubled, keeping the number of teeth and the width. The displacement…', choices: ['doubles', 'roughly quadruples', 'stays the same', 'halves'], a: 1,
      why: 'V ≈ 2π b m²(z + 1): displacement goes with the square of the module.' },
    { q: 'What is the pumping frequency of a gear pump with 10 teeth at 1800 rpm?', answer: 300, unit: 'Hz',
      why: 'f = z·n = 10 × 30 rev/s = 300 Hz.' },
    { q: 'In a pump with pressure-loaded side plates, the outlet pressure itself presses the plates against the gear faces.', a: true,
      why: 'Outlet pressure is led behind the bushings, so the higher the pressure, the tighter the face gap — which keeps the volumetric efficiency up at high pressure.' },
    { q: 'The housing of a worn external gear pump shows a polished arc where the tooth tips have rubbed. Where is it?', choices: ['on the outlet side', 'on the inlet side', 'all the way round', 'nowhere — the gears never touch the housing'], a: 1,
      why: 'Outlet pressure pushes both gears towards the low-pressure inlet side, where their tips run in against the bore.' }
  ],
  problems: [
    { q: 'Two gears of module 3 mm with 14 teeth, 24 mm wide. What is the displacement (upper value) in cm³/rev?', answer: 20.4, unit: 'cm³/rev', tol: 0.02,
      steps: ['$V_g = 2\\pi b m^2 (z+1) = 2\\pi \\times 0.024 \\times 9\\times10^{-6} \\times 15 = 2.04\\times10^{-5}$ m³ = 20.4 cm³/rev.'] }
  ],
  applications: ['Tractor and loader hydraulics, tipper trucks and snow ploughs, usually driven from the engine or a power take-off.', 'Compact power packs for tail lifts, log splitters and small presses.', 'Charge and pilot pumps inside hydrostatic transmissions (often gerotors).', 'Internal gear pumps in injection-moulding machines and presses, where low noise matters.'],
  history: 'The idea is old: rotary pumps with meshing gears were described in the early seventeenth century, and the invention is often credited to Johannes Kepler. The high-pressure gear pump is a twentieth-century achievement — pressure-loaded bushings, introduced after the Second World War, lifted gear pumps from a few tens of bar to the 250 bar of today.',
  sim: 'pm-gear-pump'
},

{
  id: 'vane-pumps', parent: 'hydraulic-pumps', title: 'Vane pumps', level: 2,
  short: 'Vanes slide in the slots of a rotor and press against a ring; the chambers between them grow at the inlet and shrink at the outlet. Quiet and smooth; the unbalanced type can vary its displacement by moving the ring, the balanced type cancels the load on its bearings.',
  keywords: ['vane pump', 'rotor', 'vanes', 'cam ring', 'eccentricity', 'balanced vane pump', 'unbalanced vane pump', 'variable vane pump', 'kidney port', 'cartridge', 'double pump', 'quiet pump'],
  prereq: ['positive-displacement', 'displacement-flow'],
  related: ['gear-pumps', 'piston-pumps', 'pressure-compensated-pump', 'variable-displacement', 'pump-efficiencies', 'pneumatics:scroll-vane-compressors', 'pneumatics:air-motors'],
  body: `
A vane pump is a slotted rotor turning inside a ring. Flat **vanes** slide in the slots and are thrown outwards — by centrifugal force, and in hydraulic pumps also by oil pressure fed under them — so that their tips follow the inside of the **cam ring**. Between two neighbouring vanes, the rotor and the ring, a chamber is trapped; side plates with kidney-shaped **ports** close it at each end. Where the gap between rotor and ring widens, the chambers grow and draw oil in; where it narrows, they shrink and push it out.

### The unbalanced (variable) vane pump
In the simplest form the ring is a circle set off-centre from the rotor by the **eccentricity** $e$. One side of the pump sucks, the other delivers, and the displacement is set by how far off-centre the ring sits:

$$V_g = 2\\pi\\,D_c\\,e\\,b$$

with $D_c$ the ring diameter and $b$ the width. (The two vanes that separate the ports carry the pressure difference; their torque, $\\Delta p\\,b\\,(\\rho_{max}^2 - \\rho_{min}^2)/2$ with $\\rho_{max,min} = D_c/2 \\pm e$, set equal to $V_g\\,\\Delta p/2\\pi$, gives the formula.) An 80 mm ring 3 mm off-centre and 25 mm wide displaces 37.7 cm³/rev. Slide the ring towards the centre and the flow falls; centre it and the flow stops. That is how the classic **pressure-compensated vane pump** works: its outlet pressure pushes the ring against a spring and centres it when the setting is reached ([[pressure-compensated-pump]]).

The price is a one-sided load. The pressure acts over half of the rotor, so the bearings carry about $\\Delta p\\,b\\,D_r$ — 17.5 kN for a 70 mm rotor 25 mm wide at 100 bar. That limits unbalanced pumps to roughly 70–160 bar.

### The balanced vane pump
Make the ring an oval with two lobes, keep the rotor centred, and each chamber fills and empties **twice** per revolution. The two suction ports face each other across the rotor, as do the two delivery ports, so the pressure forces on the rotor cancel and the bearings carry almost nothing. The displacement is fixed:

$$V_g = 2\\pi\\,b\\,(R_1^2 - R_2^2)$$

where $R_1$ and $R_2$ are the major and minor radii of the ring. A ring of 36 and 32.5 mm radius, 20 mm wide, gives 30.1 cm³/rev. Balanced pumps work at 175–210 bar, and designs with pressure-balanced or double vanes at 280 bar and more.

| | Unbalanced | Balanced |
|---|---|---|
| Ring | circle, off-centre | two-lobed oval, centred |
| Strokes per chamber per revolution | one | two |
| Displacement | variable (move the ring) | fixed |
| Load on the rotor bearings | one-sided, about $\\Delta p\\,b\\,D_r$ | cancels |
| Usual pressure | about 70–160 bar | 175–280 bar |

### Character
With ten or more chambers, vane pumps are smooth and quiet — noticeably quieter than external gear pumps. The vanes wear **in** rather than out: as the tips wear they simply move further out, so the volumetric efficiency holds up well over the pump's life. The weaknesses are the other side of the design: the vanes need speed and pressure to stay against the ring, so most will not prime below about 600 rpm or with very thick oil; dirt and thin hot oil score the ring and the vane tips; and the whole rotating group — the **cartridge** — is usually replaced as a unit. Double pumps with two cartridges on one shaft are common on machine tools and presses.
`,
  ideas: [
    'Chambers between vanes grow over the inlet port and shrink over the outlet port.',
    'Unbalanced pump: displacement = 2π D_c e b, set by the eccentricity of a circular ring — so it can be made variable.',
    'Balanced pump: an oval ring gives two strokes per revolution and opposite ports, so the bearing loads cancel.',
    'Vane pumps are quiet and wear in gracefully, but need speed to prime and clean oil.'
  ],
  pitfalls: [
    'Vane tips wear away the seal and the pump leaks more and more — Vanes are pushed out as they wear, so the tip seal renews itself; the ring and side plates are what finally wear out.',
    'A balanced vane pump can be adjusted like an unbalanced one — Its oval ring is fixed and centred; only the unbalanced (circular, eccentric) design can move its ring to change displacement.'
  ],
  formulas: [
    {
      name: 'Unbalanced vane pump displacement',
      expr: 'Vg = 2*pi*Dc*ec*b', tex: 'V_g = 2\\pi\\,D_c\\,e\\,b',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        Dc: { name: 'cam-ring diameter', q: 'length', unit: 'mm', value: 80, tex: 'D_c' },
        ec: { name: 'eccentricity of the ring', q: 'length', unit: 'mm', value: 3, tex: 'e' },
        b: { name: 'width of rotor and ring', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'The limit for many thin radial vanes. With z vanes the exact value is 2 z b e D_c sin(π/z) — 1.6 % less for ten vanes. The eccentricity must stay below the ring radius minus the rotor radius.',
      stories: {
        Vg: 'A vane pump has a {Dc} ring set {ec} off-centre, {b} wide. What is its displacement?',
        ec: 'A variable vane pump with a {Dc} ring, {b} wide, must displace {Vg}. How far off-centre must the ring be?'
      }
    },
    {
      name: 'Balanced vane pump displacement',
      expr: 'Vg = 2*pi*b*(R1^2 - R2^2)', tex: 'V_g = 2\\pi\\,b\\,(R_1^2 - R_2^2)',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        b: { name: 'width of rotor and ring', q: 'length', unit: 'mm', value: 20 },
        R1: { name: 'major radius of the ring', q: 'length', unit: 'mm', value: 36, tex: 'R_1' },
        R2: { name: 'minor radius of the ring', q: 'length', unit: 'mm', value: 32.5, tex: 'R_2' }
      },
      note: 'Two strokes per chamber per revolution; the rotor sits in the centre.',
      stories: {
        Vg: 'A balanced vane pump has a ring with radii {R1} and {R2}, {b} wide. What is its displacement?',
        R2: 'A balanced ring of major radius {R1} and width {b} must displace {Vg}. What minor radius does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'Setting a variable vane pump',
      q: 'A variable vane pump has an 80 mm ring, 25 mm wide, and runs at 1450 rpm with a volumetric efficiency of 0.92. How far off-centre must the ring be for 30 L/min?',
      steps: [
        'Displacement needed: $V_g = Q/(n\\eta_v) = 30\\,000/(1450 \\times 0.92) = 22.5$ cm³/rev.',
        { text: 'Eccentricity:', tex: 'e = \\frac{V_g}{2\\pi D_c b} = \\frac{22.5\\times10^{-6}}{2\\pi \\times 0.08 \\times 0.025} = 1.79\\ \\text{mm}' }
      ],
      a: 'About 1.8 mm off-centre.'
    },
    {
      title: 'A balanced ring',
      q: 'A balanced vane pump 25 mm wide with a 40 mm major ring radius must displace 45 cm³/rev. What minor radius does the ring need?',
      steps: [
        '$R_1^2 - R_2^2 = V_g/(2\\pi b) = 45\\times10^{-6}/(2\\pi \\times 0.025) = 2.865\\times10^{-4}$ m².',
        '$R_2 = \\sqrt{0.040^2 - 2.865\\times10^{-4}} = \\sqrt{1.314\\times10^{-3}} = 36.2$ mm.'
      ],
      a: 'About 36.2 mm — a ring whose radius rises and falls by less than 4 mm twice per turn.'
    }
  ],
  quiz: [
    { q: 'The cam ring of an unbalanced vane pump is moved towards the centre of the rotor. What happens?', choices: ['the displacement, and so the flow, falls', 'the pressure rating rises', 'the pump reverses', 'nothing: the vanes follow the ring anyway'], a: 0,
      why: 'Displacement is proportional to the eccentricity; centred, the chambers no longer change size and the pump delivers nothing.' },
    { q: 'Why does a balanced vane pump have two inlet and two outlet ports, each pair opposite each other?', choices: ['to double the pressure', 'so that the pressure forces on the rotor cancel', 'so that it can run in both directions', 'to make it variable'], a: 1,
      why: 'Pressure regions on opposite sides of the rotor push in opposite directions, so the net load on the bearings is nearly zero.' },
    { q: 'A balanced vane pump can easily be made variable-displacement.', a: false,
      why: 'Its ring is an oval fixed around a centred rotor. Only the unbalanced design, with a circular eccentric ring, can change its displacement by moving the ring.' },
    { q: 'An unbalanced vane pump has a 100 mm ring set 2.5 mm off-centre and is 30 mm wide. What is its displacement?', answer: 47.1, unit: 'cm³/rev',
      why: 'V = 2π D e b = 2π × 0.1 × 0.0025 × 0.03 = 4.71×10⁻⁵ m³ = 47.1 cm³/rev.' },
    { q: 'After a cold start at low engine speed, a vane pump will not deliver. The most likely reason?', choices: ['the ring is centred', 'the vanes are not thrown out against the ring at low speed in thick oil', 'the outlet is blocked', 'the relief valve is set too high'], a: 1,
      why: 'Vanes need centrifugal force (and later pressure behind them) to seal against the ring; at low speed with stiff oil they stay in their slots and the chambers do not seal.' }
  ],
  problems: [
    { q: 'A balanced vane pump has ring radii of 40 mm and 36 mm and is 25 mm wide. What is its displacement?', answer: 47.8, unit: 'cm³/rev', tol: 0.02,
      steps: ['$V_g = 2\\pi b (R_1^2 - R_2^2) = 2\\pi \\times 0.025 \\times (0.0016 - 0.001296) = 4.78\\times10^{-5}$ m³ = 47.8 cm³/rev.'] }
  ],
  applications: ['Machine tools and presses, where low noise and smooth flow matter.', 'Pressure-compensated variable vane pumps in small industrial power units.', 'Power steering pumps in cars and trucks (balanced designs).', 'Double and triple pumps feeding several circuits of a machine from one motor.'],
  history: 'Harry F. Vickers developed the balanced vane pump in the mid-1920s and built hydraulic power steering around it. The pressure-balanced vane, fed with outlet pressure only where it was needed, later lifted vane pumps to well over 200 bar.',
  sim: 'pm-vane-pump'
},

{
  id: 'piston-pumps', parent: 'hydraulic-pumps', title: 'Axial and radial piston pumps', level: 2,
  short: 'Pistons in a rotating cylinder block stroke in and out as they turn — driven by an inclined swash plate, a bent axis or an eccentric. They reach the highest pressures (350–450 bar and more), the best efficiencies, and their stroke can be changed on the move.',
  keywords: ['piston pump', 'axial piston pump', 'swash plate', 'bent axis', 'radial piston pump', 'cylinder block', 'valve plate', 'slipper', 'swash angle', 'stroke', 'odd number of pistons', 'case drain', 'over centre', 'high pressure pump'],
  prereq: ['positive-displacement', 'displacement-flow', 'physics:rotation'],
  related: ['variable-displacement', 'pressure-compensated-pump', 'hydrostatic-transmission', 'pump-efficiencies', 'lsht-motors', 'hydraulic-motors', 'pneumatics:reciprocating-compressors'],
  body: `
When the pressure must be high — 350 bar and more — and the efficiency good, the pump has pistons. Pistons in lapped bores leak very little even at 400 bar, and their stroke can be changed while the pump runs, which neither gears nor a balanced vane pump can do. Three arrangements dominate.

### The swash-plate axial piston pump
A **cylinder block** with an odd number of bores — usually 7, 9 or 11 — parallel to the shaft turns with the shaft. Each piston ends in a ball joint and a **slipper** that slides on a fixed, inclined **swash plate**, floating on a film of oil fed through a hole in the piston. As the block turns, each piston follows the tilted plate: for half a revolution it is drawn out of its bore and the bore fills through a kidney-shaped port in the **valve plate**; for the other half it is pushed back in and delivers through the other kidney. With $z$ pistons of diameter $d$ on a pitch circle of diameter $D$ and a swash angle $\\alpha$, each stroke is $D\\tan\\alpha$ and

$$V_g = z\\,\\frac{\\pi d^2}{4}\\,D\\tan\\alpha$$

Nine 16 mm pistons on a 60 mm pitch circle at 18° give 35.3 cm³/rev — 63.5 L/min at 1800 rpm. Tilt the plate less and the stroke shrinks; at zero angle the pistons stand still in their bores and the pump delivers nothing; tilt it the other way — **over centre** — and the ports swap. That is the basis of [[variable-displacement|variable pumps]] and closed-loop [[hydrostatic-transmission|hydrostatic transmissions]]. Swash angles are limited to about 15–21°, beyond which the slippers tend to tip and the side forces on the pistons grow too large.

### The bent-axis pump
Here the whole cylinder block is tilted, typically by 25–40°, relative to the drive shaft; the pistons are coupled by ball-ended rods to a flange on the shaft, and the stroke is $D\\sin\\alpha$:

$$V_g = z\\,\\frac{\\pi d^2}{4}\\,D\\sin\\alpha$$

The piston forces go into the drive flange rather than sideways into the bores, so bent-axis machines tolerate larger angles, run faster and are among the most efficient hydraulic machines, with overall efficiencies of 0.92–0.95 near their best point. Variable versions swing the block in a curved yoke.

### The radial piston pump
Pistons arranged like the spokes of a wheel ride on an eccentric or a cam on the shaft; the stroke is twice the eccentricity, $2e$, so $V_g = z\\,(\\pi d^2/4)\\,2e$. Radial pumps are compact and very stiff — short pistons in massive bodies — and are the usual choice above 500 bar: clamping systems, presses, test rigs, and, at over 2000 bar, the fuel pumps of common-rail diesel engines. Some variable designs move a ring around a rotating piston block, as a vane pump moves its ring.

### Why an odd number of pistons?
The delivery is the sum of the speeds of the pistons in the delivery half, and it ripples as each piston crosses from one port to the other. With an odd number the peaks of one half fall between those of the other: nine pistons give a flow ripple of about 1.5 % and eleven about 1 %, but eight nearly 8 % and ten 5 %. The ripple frequency for an odd count is $2zn$ — 540 Hz for nine pistons at 1800 rpm.

| | Swash plate | Bent axis | Radial |
|---|---|---|---|
| Nominal / peak pressure | 280–350 / 350–450 bar | 350–400 / 450 bar | 500–700 bar and more |
| Angle | up to about 21° | up to about 40° | eccentric |
| Speed (mid-size) | 1500–3000 rpm | 2000–4000 rpm | 1000–3000 rpm |
| Overall efficiency | 0.87–0.92 | 0.90–0.95 | 0.85–0.92 |
| Second pump on a through-drive | easy | awkward | possible |

### The case drain
Oil that leaks past the pistons, slippers and valve plate collects in the pump case and must go back to the tank through a separate, unrestricted **case drain** line: the case is rated for only a few bar. The drain flow is a health check — it creeps up as the pump wears. Before the first start the case must be filled with clean oil, or the slippers and bearings run dry.

> [!warn] Piston pumps work at the highest pressures in hydraulics. Before opening any line, stop and lock out the drive, release the pressure and discharge accumulators. A pinhole leak at 350 bar can inject oil through the skin: any injection injury, however small it looks, is a surgical emergency — seek emergency medical care at once.
`,
  ideas: [
    'Swash plate: stroke = D tan α, displacement = z (πd²/4) D tan α; change the angle and the flow changes.',
    'Bent axis: stroke = D sin α; larger angles, higher speed and the best efficiencies.',
    'Radial piston pumps, with a stroke of twice the eccentricity, serve the highest pressures.',
    'An odd number of pistons makes the flow ripple several times smaller than an even number.',
    'Leakage collects in the case and needs its own free drain line to tank.'
  ],
  pitfalls: [
    'A piston pump at zero swash angle still delivers a little — Apart from leakage, nothing: the pistons do not move in their bores. The drive then supplies only friction and churning losses.',
    'The case drain can join the return line — The case is rated for a few bar; pressure pulses or a clogged return filter in a shared line can blow the shaft seal. The drain goes to the tank on its own, below the oil level.',
    'Displacement is proportional to the swash angle — It is proportional to tan α (sin α for a bent axis): nearly the same at small angles, but not exactly.'
  ],
  formulas: [
    {
      name: 'Swash-plate pump displacement',
      expr: 'Vg = z*(pi*d^2/4)*D*tan(alpha)', tex: 'V_g = z\\,\\dfrac{\\pi d^2}{4}\\,D\\tan\\alpha',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        z: { name: 'number of pistons', int: true, value: 9, min: 3, max: 15 },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 16 },
        D: { name: 'pitch-circle diameter of the pistons', q: 'length', unit: 'mm', value: 60 },
        alpha: { name: 'swash-plate angle', q: 'angle', unit: '°', value: 18, min: 0, max: 25 }
      },
      stories: {
        Vg: 'A swash-plate pump has {z} pistons of {d} on a {D} pitch circle, with the plate at {alpha}. What is its displacement?',
        alpha: 'A swash-plate pump with {z} pistons of {d} on a {D} pitch circle must displace {Vg}. At what angle must the plate be?'
      }
    },
    {
      name: 'Bent-axis pump displacement',
      expr: 'Vg = z*(pi*d^2/4)*D*sin(alpha)', tex: 'V_g = z\\,\\dfrac{\\pi d^2}{4}\\,D\\sin\\alpha',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        z: { name: 'number of pistons', int: true, value: 7, min: 3, max: 15 },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 20 },
        D: { name: 'pitch-circle diameter at the drive flange', q: 'length', unit: 'mm', value: 70 },
        alpha: { name: 'angle between block and shaft', q: 'angle', unit: '°', value: 25, min: 0, max: 45 }
      },
      stories: {
        Vg: 'A bent-axis pump has {z} pistons of {d} on a {D} pitch circle, with the block at {alpha}. What is its displacement?',
        alpha: 'A bent-axis unit with {z} pistons of {d} on a {D} pitch circle must displace {Vg}. What angle does that take?'
      }
    },
    {
      name: 'Radial piston pump displacement',
      expr: 'Vg = z*(pi*d^2/4)*2*ec', tex: 'V_g = z\\,\\dfrac{\\pi d^2}{4}\\,2e',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', tex: 'V_g' },
        z: { name: 'number of pistons', int: true, value: 5, min: 1, max: 15 },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 12 },
        ec: { name: 'eccentricity of the drive', q: 'length', unit: 'mm', value: 4, tex: 'e' }
      },
      note: 'One stroke of 2e per piston per revolution (a single eccentric).',
      stories: { Vg: 'A radial piston pump has {z} pistons of {d} on an eccentric of {ec}. What is its displacement?' }
    }
  ],
  examples: [
    {
      title: 'Setting the swash angle',
      q: 'The pump of the text (nine 16 mm pistons on a 60 mm pitch circle, 35.3 cm³/rev at 18°) is to deliver 28 cm³/rev. At what angle must the plate sit, and what is the ideal flow at 1800 rpm?',
      steps: [
        '$z\\,(\\pi d^2/4)\\,D = 9 \\times 2.011\\times10^{-4} \\times 0.06 = 1.086\\times10^{-4}$ m³.',
        '$\\tan\\alpha = 28\\times10^{-6}/1.086\\times10^{-4} = 0.258$, so $\\alpha = 14.5°$.',
        'Flow: $28 \\times 1800 = 50\\,400$ cm³/min = 50.4 L/min.'
      ],
      a: 'About 14.5°, giving 50.4 L/min.'
    },
    {
      title: 'Why bent-axis units tilt so far',
      q: 'A bent-axis unit has seven 20 mm pistons on a 70 mm pitch circle. Compare its displacement at 25° and at 40°.',
      steps: [
        '$z\\,(\\pi d^2/4)\\,D = 7 \\times 3.142\\times10^{-4} \\times 0.07 = 1.539\\times10^{-4}$ m³.',
        'At 25°: $\\times \\sin 25° = 0.423$ gives 65.1 cm³/rev.',
        'At 40°: $\\times \\sin 40° = 0.643$ gives 98.9 cm³/rev — half as much again from the same pistons.'
      ],
      a: '65.1 cm³/rev at 25°, 98.9 cm³/rev at 40°: a larger angle means a smaller, lighter unit for the same displacement.'
    }
  ],
  quiz: [
    { q: 'What sets the stroke of the pistons in a swash-plate pump?', choices: ['the speed of the shaft', 'the angle of the swash plate', 'the outlet pressure', 'the number of pistons'], a: 1,
      why: 'Each piston follows the inclined plate; its stroke is the pitch-circle diameter times the tangent of the angle.' },
    { q: 'Why do axial piston pumps usually have 7, 9 or 11 pistons?', choices: ['odd numbers are easier to machine', 'an odd number gives a much smaller flow ripple', 'an odd number lets the pump run backwards', 'it balances the swash plate'], a: 1,
      why: 'With an odd count the delivery pulses of the pistons interleave; nine pistons ripple about 1.5 %, eight nearly 8 %.' },
    { q: 'A swash-plate pump has nine 20 mm pistons on a 70 mm pitch circle at 15°. What is its displacement?', answer: 53.0, unit: 'cm³/rev',
      why: 'V = 9 × π(0.02)²/4 × 0.07 × tan 15° = 9 × 3.142×10⁻⁴ × 0.07 × 0.268 = 5.30×10⁻⁵ m³.' },
    { q: 'A piston pump\'s case drain may share the main return line and its filter, as long as the filter is clean.', a: false,
      why: 'Return-line pressure peaks and a clogging filter would pressurise the case, which is rated for a few bar; the shaft seal fails. Case drains go directly to the tank.' },
    { q: 'The swash angle of a running pump is set to zero. The pump…', choices: ['delivers full flow at low pressure', 'delivers no flow; only friction and leakage losses remain', 'stalls its drive motor', 'reverses its shaft'], a: 1,
      why: 'At zero angle the pistons do not stroke, so nothing is displaced. This is how a pressure-compensated pump idles at dead-head.' }
  ],
  problems: [
    { q: 'A bent-axis motor has seven 20 mm pistons on a 70 mm pitch circle, set at 40°. What is its displacement?', answer: 98.9, unit: 'cm³/rev', tol: 0.02,
      steps: ['$V_g = 7 \\times \\pi (0.02)^2/4 \\times 0.07 \\times \\sin 40° = 9.89\\times10^{-5}$ m³ = 98.9 cm³/rev.'] }
  ],
  applications: ['Excavators, cranes and forestry machines: variable axial piston pumps with load-sensing and power control at 350–400 bar.', 'Closed-loop drives of wheel loaders, rollers and harvesters, with over-centre swash-plate pumps.', 'Presses and injection-moulding machines, often with electronic swash-angle control.', 'Radial piston pumps for clamping, tooling and test rigs at 500–1000 bar, and common-rail diesel injection.'],
  history: 'The axial piston machine grew out of naval gunnery. Around 1905 Harvey Williams and Reynold Janney in the United States built a variable-stroke swash-plate pump driving a piston motor — the "hydraulic speed gear" — to train battleship gun turrets smoothly. Hans Thoma developed the bent-axis design in Germany in the 1930s.',
  sim: 'pm-axial-piston'
},

{
  id: 'displacement-flow', parent: 'hydraulic-pumps', title: 'Displacement, speed and flow', level: 1,
  short: 'A pump\'s displacement is the volume it moves per revolution; times the shaft speed it gives the flow, less the leakage that the volumetric efficiency accounts for. Choosing a pump is choosing the speed of the machine.',
  keywords: ['displacement', 'cm3/rev', 'cc/rev', 'flow', 'pump speed', 'rpm', 'volumetric efficiency', 'leakage', 'pump sizing', 'cylinder speed', 'minimum speed', 'maximum speed'],
  prereq: ['positive-displacement', 'flow-rate'],
  related: ['pump-efficiencies', 'gear-pumps', 'piston-pumps', 'hydraulic-cylinder', 'cylinder-speed', 'motor-torque-speed', 'variable-displacement', 'troubleshooting'],
  body: `
Every positive-displacement pump and motor is rated by its **displacement** $V_g$ — the volume it moves in one revolution, in cm³/rev (often written cc/rev). It is fixed by the geometry: the tooth spaces of a gear pump, the chambers of a vane pump, piston area × stroke × number of pistons in a piston pump. Multiply by the speed and you have the flow the geometry would deliver; a real pump loses a little of it to internal leakage, which the **volumetric efficiency** $\\eta_v$ accounts for:

$$Q = V_g\\,n\\,\\eta_v$$

In workshop units, $Q$ (L/min) = $V_g$ (cm³/rev) × $n$ (rpm) × $\\eta_v$ / 1000. A 25 cm³/rev pump at 1450 rpm with $\\eta_v$ = 0.94 gives 34.1 L/min.

### Where the speed comes from
| Drive | Typical pump speed |
|---|---|
| 4-pole induction motor, 50 Hz / 60 Hz | 1450–1480 rpm / 1750–1780 rpm |
| 2-pole induction motor, 50 Hz | about 2900 rpm |
| Diesel engine of a mobile machine | 800 rpm idle to 2000–2400 rpm rated |
| Variable-speed (servo) motor | 0–3000 rpm, set by the controller |

On a mobile machine the pump flow follows the engine: a loader moves nearly three times faster at full throttle than at idle, which is why operators rev the engine to speed the hydraulics up. Variable-speed electric drives use this on purpose, changing the flow by changing the speed instead of throwing oil away over valves.

### Ideal flow at 1450 rpm
| $V_g$ (cm³/rev) | 4 | 8 | 16 | 32 | 63 | 125 |
|---|---|---|---|---|---|---|
| $Q$ ideal (L/min) | 5.8 | 11.6 | 23.2 | 46.4 | 91.4 | 181 |

### From pump to actuator
The flow sets the speed of whatever it drives. For a cylinder of area $A$,

$$v = \\frac{V_g\\,n\\,\\eta_v}{A}$$

so choosing the pump is choosing the speed of the machine, while the force is left to the pressure ([[hydraulic-cylinder]], [[cylinder-speed]]). For a hydraulic motor the same flow divided by the motor's displacement gives its speed ([[motor-torque-speed]]).

### Leakage does not care about speed
Internal leakage is driven by pressure through fixed clearances, so at a given pressure and temperature it is roughly a fixed number of litres per minute. At full speed it is a small fraction of the flow; at low speed a large one. A gear pump that loses 1.7 L/min at 200 bar has $\\eta_v$ = 0.95 at 2400 rpm but only 0.85 at 800 rpm. That is why pumps have a **minimum speed**, and why hot, thin oil makes a tired machine obviously slow. They have a **maximum speed** too: above it the chambers cannot fill in the time they are open to the inlet, and the pump cavitates. The limit is higher with a boosted (pressurised) inlet and lower when the pump sits above the oil.

### Measuring it
On a test stand the flow is measured at nearly zero pressure — close to the geometric $V_g n$ — and again at working pressure; the ratio is $\\eta_v$. In the field a flow meter with a loading valve in the pressure line does the same job, and it is one of the first checks when a machine becomes slow ([[troubleshooting]]).
`,
  ideas: [
    'Flow = displacement × speed × volumetric efficiency.',
    'On a mobile machine the pump speed, and so every actuator speed, follows the engine.',
    'Pump size sets actuator speed: v = V_g n η_v / A.',
    'Leakage depends on pressure, not speed, so the volumetric efficiency falls at low speed.',
    'A flow test at working pressure measures a pump\'s health.'
  ],
  pitfalls: [
    'A pump with twice the displacement can deliver twice the pressure — Displacement sets flow. Pressure is set by the load and limited by the relief valve and the pump\'s rating.',
    'Flow is proportional to speed right down to zero — At low speed the constant leakage takes a growing share, and below the minimum speed some pumps (vane pumps especially) stop delivering altogether.'
  ],
  formulas: [
    {
      name: 'Pump flow',
      expr: 'Q = Vg*n*eta_v', tex: 'Q = V_g\\,n\\,\\eta_v',
      vars: {
        Q: { name: 'delivered flow', q: 'flowrate', unit: 'L/min' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 25, tex: 'V_g' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1450 },
        eta_v: { name: 'volumetric efficiency', value: 0.94, min: 0, max: 1, tex: '\\eta_v' }
      },
      note: 'η_v is 0.90–0.98 at working pressure, lower at low speed and in hot oil. Q (L/min) = V_g (cm³/rev) × n (rpm) × η_v / 1000.',
      stories: {
        Q: 'A {Vg} pump runs at {n} with a volumetric efficiency of {eta_v}. What flow does it deliver?',
        Vg: 'A circuit needs {Q} from a motor turning at {n}; the pump\'s volumetric efficiency is {eta_v}. What displacement is needed?',
        eta_v: 'A {Vg} pump at {n} is measured delivering {Q} at working pressure. What is its volumetric efficiency?'
      }
    },
    {
      name: 'Cylinder speed from the pump',
      expr: 'v = Vg*n*eta_v/A', tex: 'v = \\dfrac{V_g\\,n\\,\\eta_v}{A}',
      vars: {
        v: { name: 'cylinder speed', q: 'speed', unit: 'm/s' },
        Vg: { name: 'pump displacement', q: 'displacement', unit: 'cm³/rev', value: 14, tex: 'V_g' },
        n: { name: 'pump speed', q: 'frequency', unit: 'rpm', value: 1450 },
        eta_v: { name: 'volumetric efficiency', value: 0.93, min: 0, max: 1, tex: '\\eta_v' },
        A: { name: 'area the flow acts on', q: 'area', unit: 'cm²', value: 31.2 }
      },
      note: 'The whole pump flow goes to the cylinder (no flow over the relief valve).',
      stories: {
        v: 'A {Vg} pump at {n} ({eta_v} volumetric efficiency) feeds a cylinder of {A}. How fast does the rod move?',
        Vg: 'A cylinder of {A} must move at {v}. The motor turns at {n} and the pump\'s volumetric efficiency is {eta_v}. What pump displacement is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Choosing a pump for a cylinder',
      q: 'A 63 mm bore cylinder must extend at 0.10 m/s. The motor turns at 1450 rpm and a gear pump\'s volumetric efficiency at working pressure is 0.93. What displacement is needed?',
      steps: [
        '$A = \\pi \\times 0.063^2/4 = 3.12\\times10^{-3}$ m², so $Q = vA = 3.12\\times10^{-4}$ m³/s $= 18.7$ L/min.',
        '$V_g = Q/(n\\eta_v) = 18\\,700/(1450 \\times 0.93) = 13.9$ cm³/rev.',
        'The nearest standard size, 14 cm³/rev, gives $14 \\times 1450 \\times 0.93 = 18.9$ L/min and 0.101 m/s.'
      ],
      a: 'About 13.9 cm³/rev; a 14 cm³/rev pump is chosen.'
    },
    {
      title: 'A slow excavator',
      q: 'An excavator\'s 63 cm³/rev piston pump turns at 1800 rpm. A flow test at 250 bar reads 96 L/min. Is the pump healthy?',
      steps: [
        'Ideal flow: $63 \\times 1800 = 113.4$ L/min.',
        '$\\eta_v = 96/113.4 = 0.85$.',
        'A healthy piston pump manages 0.94–0.97 at this pressure: about 13 L/min more than it should is leaking internally — worn valve plate, slippers or pistons. The case-drain flow will confirm it.'
      ],
      a: 'No: a volumetric efficiency of 0.85 points to a worn pump.'
    }
  ],
  quiz: [
    { q: 'What flow does a 28 cm³/rev pump deliver at 1500 rpm with a volumetric efficiency of 0.95?', answer: 39.9, unit: 'L/min',
      why: '28 × 1500 × 0.95 = 39 900 cm³/min = 39.9 L/min.' },
    { q: 'A tractor\'s engine is slowed from 2000 to 1000 rpm; its gear pump feeds the loader. The loader…', choices: ['stops lifting heavy loads', 'moves at about half the speed but can lift the same load', 'moves at the same speed with half the force', 'is unaffected'], a: 1,
      why: 'Flow — and so speed — follows the pump speed. The maximum force depends on the relief pressure, which has not changed.' },
    { q: 'At a fixed pressure, how does a pump\'s volumetric efficiency change as its speed falls?', choices: ['it rises', 'it falls, because the leakage stays about the same while the displaced flow shrinks', 'it stays constant', 'it falls because the pressure rises'], a: 1,
      why: 'Leakage is set by pressure, clearances and viscosity; it is a larger share of a smaller flow.' },
    { q: 'Doubling a pump\'s displacement at the same speed doubles the maximum pressure it can deliver.', a: false,
      why: 'Displacement sets flow. The pressure is decided by the load, the relief setting and the pump\'s rating.' },
    { q: 'A pump must supply 60 L/min at 1480 rpm with a volumetric efficiency of 0.95. What is the smallest displacement that will do?', answer: 42.7, unit: 'cm³/rev',
      why: 'V = Q/(n η_v) = 60 000/(1480 × 0.95) = 42.7 cm³/rev.' }
  ],
  problems: [
    { q: 'A 16 cm³/rev pump at 1450 rpm with a volumetric efficiency of 0.93 feeds a 50 mm bore cylinder. How fast does it extend?', answer: 0.183, unit: 'm/s', tol: 0.02,
      steps: ['$Q = 16 \\times 1450 \\times 0.93 = 21\\,576$ cm³/min = $3.60\\times10^{-4}$ m³/s.', '$A = \\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m², so $v = Q/A = 0.183$ m/s.'] }
  ],
  applications: ['Sizing the pump of a power pack from the cylinder speeds a machine needs.', 'Matching pump and engine speed through a power take-off ratio on mobile machines.', 'Variable-speed pump drives that set flow with an inverter instead of valves.', 'Flow testing as the first diagnostic step on a slow machine.'],
  sim: 'pm-gear-pump'
},

{
  id: 'pump-efficiencies', parent: 'hydraulic-pumps', title: 'Volumetric and mechanical efficiency', level: 2,
  short: 'A real pump delivers less flow than it displaces (volumetric efficiency, lost to leakage) and needs more torque than the ideal (hydraulic-mechanical efficiency, lost to friction and churning). Their product, the overall efficiency, is typically 0.80–0.92.',
  keywords: ['volumetric efficiency', 'hydraulic-mechanical efficiency', 'mechanical efficiency', 'overall efficiency', 'total efficiency', 'leakage', 'slip', 'friction torque', 'drive torque', 'input power', 'efficiency map', 'viscosity', 'pump losses'],
  prereq: ['displacement-flow', 'physics:efficiency', 'physics:torque', 'viscosity'],
  related: ['energy-losses-heat', 'heat-coolers', 'viscosity-temperature', 'laminar-pipe-flow', 'bulk-modulus', 'motor-torque-speed', 'troubleshooting', 'pump-head-power'],
  body: `
An ideal pump would deliver exactly its displacement every revolution, $Q = V_g n$, and need exactly the torque that the pressure exerts on its displacing parts, $T = V_g\\,\\Delta p/2\\pi$. A real one falls short on both counts, for different reasons, and the two shortfalls are measured separately.

### Volumetric efficiency: oil that leaks back
Every pump has running clearances — tooth tips, gear faces, vane tips, pistons in bores, the valve plate — from a few micrometres to a few hundredths of a millimetre wide. Pressure drives oil back through them from the outlet to the inlet or the case. Flow through a thin gap is laminar, so it grows in proportion to the pressure difference and to the cube of the gap, and falls in proportion to the viscosity ([[laminar-pipe-flow]], [[viscosity]]):

$$\\eta_v = \\frac{Q}{V_g\\,n}, \\qquad Q_{leak} \\propto \\frac{\\Delta p\\,h^3}{\\mu}$$

A little oil is also "lost" to compression: at 350 bar oil is about 2 % smaller in volume ([[bulk-modulus]]). The volumetric efficiency is therefore lowest at **high pressure**, **low speed** and **high temperature** (thin oil).

### Hydraulic-mechanical efficiency: torque that is wasted
The drive must also overcome friction in bearings, slippers and seals (which grows with the pressure), viscous drag in the thin oil films (which grows with speed and viscosity), churning of the oil in the case and flow losses in the ports (which grow with speed). So the shaft needs

$$T = \\frac{V_g\\,\\Delta p}{2\\pi\\,\\eta_{hm}}, \\qquad \\eta_{hm} = \\frac{V_g\\,\\Delta p}{2\\pi\\,T}$$

Much of this lost torque is roughly fixed in newton-metres at a given speed, so it matters most at **low pressure**, where the useful torque is small, and in **cold, thick oil**.

### Overall efficiency
Hydraulic power out divided by shaft power in is the product of the two:

$$\\eta_t = \\eta_v\\,\\eta_{hm} = \\frac{Q\\,\\Delta p}{2\\pi n T}$$

| Pump type | $\\eta_v$ | $\\eta_{hm}$ | $\\eta_t$ |
|---|---|---|---|
| External gear | 0.90–0.95 | 0.85–0.92 | 0.80–0.88 |
| Vane | 0.90–0.95 | 0.85–0.92 | 0.80–0.88 |
| Axial piston, swash plate | 0.94–0.98 | 0.90–0.95 | 0.87–0.92 |
| Axial piston, bent axis | 0.95–0.98 | 0.92–0.96 | 0.90–0.95 |

These are typical figures near the rated point. Like a car engine, every pump has an **efficiency map**, with a best region at medium-to-high pressure and medium speed and poorer corners around it. The [pump calculator](#/tools/fpower/pump) works these relations through for any pump.

### Why it matters
The input power follows from the delivered hydraulic power:

$$P_{in} = \\frac{Q\\,\\Delta p}{\\eta_t} = 2\\pi n\\,T$$

Size the electric motor or engine for the **input** power, not the hydraulic power. Everything lost becomes heat in the oil: a pump taking 30 kW at an overall efficiency of 0.89 puts over 3 kW into the tank before a single valve has throttled anything ([[energy-losses-heat]], [[heat-coolers]]). Temperature closes the loop: hotter oil is thinner, leaks more and lubricates less, so a hot, worn pump grows less efficient and hotter still.

### Reading a worn pump
Wear opens the clearances. Friction hardly changes, but leakage grows with the cube of the gap — so wear shows up as a falling **volumetric** efficiency: actuators that slow under load, a rising case-drain flow in a piston pump, more heat. A flow test at working pressure against a loading valve is the standard check.
`,
  ideas: [
    'Volumetric efficiency η_v = actual flow / (V_g n): leakage, worst at high pressure, low speed and hot oil.',
    'Hydraulic-mechanical efficiency η_hm = ideal torque / actual torque: friction and drag, worst at low pressure and in cold oil.',
    'Overall efficiency η_t = η_v η_hm, typically 0.80–0.88 for gear and vane pumps and 0.87–0.95 for piston pumps.',
    'Input power = Q Δp / η_t = 2π n T; everything lost becomes heat in the oil.',
    'Wear shows first as falling volumetric efficiency and rising case-drain flow.'
  ],
  pitfalls: [
    'A pump has one efficiency — It has a map: the same pump may reach 0.92 at its best point and 0.6 at low pressure and low speed.',
    'The motor only needs to supply the hydraulic power p·Q — It must supply p·Q divided by the overall efficiency; the difference goes into heat.',
    'Thinner oil always improves efficiency — It lowers friction but raises leakage; each pump has a viscosity range (typically 16–36 mm²/s) where it works best.'
  ],
  formulas: [
    {
      name: 'Drive torque of a pump',
      expr: 'T = Vg*dp/(2*pi*eta_hm)', tex: 'T = \\dfrac{V_g\\,\\Delta p}{2\\pi\\,\\eta_{hm}}',
      vars: {
        T: { name: 'drive torque at the shaft', q: 'torque', unit: 'N·m' },
        Vg: { name: 'displacement', q: 'displacement', unit: 'cm³/rev', value: 45, tex: 'V_g' },
        dp: { name: 'pressure rise across the pump (outlet − inlet)', q: 'pressure', unit: 'bar', value: 250, tex: '\\Delta p' },
        eta_hm: { name: 'hydraulic-mechanical efficiency', value: 0.93, min: 0, max: 1, tex: '\\eta_{hm}' }
      },
      stories: {
        T: 'A {Vg} pump works against {dp} with a hydraulic-mechanical efficiency of {eta_hm}. What torque does it take to drive?',
        eta_hm: 'A {Vg} pump at {dp} is measured taking {T} at its shaft. What is its hydraulic-mechanical efficiency?'
      }
    },
    {
      name: 'Overall efficiency',
      expr: 'eta_t = eta_v*eta_hm', tex: '\\eta_t = \\eta_v\\,\\eta_{hm}',
      vars: {
        eta_t: { name: 'overall efficiency', tex: '\\eta_t' },
        eta_v: { name: 'volumetric efficiency', value: 0.96, min: 0, max: 1, tex: '\\eta_v' },
        eta_hm: { name: 'hydraulic-mechanical efficiency', value: 0.93, min: 0, max: 1, tex: '\\eta_{hm}' }
      },
      stories: { eta_t: 'A pump has a volumetric efficiency of {eta_v} and a hydraulic-mechanical efficiency of {eta_hm}. What is its overall efficiency?' }
    },
    {
      name: 'Input power from the delivered flow',
      expr: 'P = Q*dp/eta_t', tex: 'P_{in} = \\dfrac{Q\\,\\Delta p}{\\eta_t}',
      vars: {
        P: { name: 'shaft (input) power', q: 'power', unit: 'kW', tex: 'P_{in}' },
        Q: { name: 'delivered flow', q: 'flowrate', unit: 'L/min', value: 63.9 },
        dp: { name: 'pressure rise across the pump', q: 'pressure', unit: 'bar', value: 250, tex: '\\Delta p' },
        eta_t: { name: 'overall efficiency', value: 0.893, min: 0, max: 1, tex: '\\eta_t' }
      },
      stories: {
        P: 'A pump delivers {Q} at {dp} with an overall efficiency of {eta_t}. What power must its motor supply?',
        Q: 'A {P} motor drives a pump with an overall efficiency of {eta_t} at {dp}. What flow can it deliver?'
      }
    },
    {
      name: 'Shaft power',
      expr: 'P = 2*pi*n*T', tex: 'P = 2\\pi\\,n\\,T',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1480 },
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m', value: 192.5 }
      },
      note: 'n in revolutions per unit time; 2πn is the angular speed.',
      stories: { P: 'A pump shaft turns at {n} with a torque of {T}. What power is going in?', T: 'A {P} motor turns at {n}. What torque can it supply?' }
    }
  ],
  examples: [
    {
      title: 'Sizing the motor for a piston pump',
      q: 'A 45 cm³/rev piston pump turns at 1480 rpm against 250 bar. Its volumetric efficiency there is 0.96 and its hydraulic-mechanical efficiency 0.93. Find the flow, the torque, the input power and the heat.',
      steps: [
        'Flow: $Q = V_g n \\eta_v = 45 \\times 1480 \\times 0.96 = 63.9$ L/min.',
        'Torque: $T = V_g\\Delta p/(2\\pi\\eta_{hm}) = 45\\times10^{-6} \\times 2.5\\times10^7/(2\\pi \\times 0.93) = 192.5$ N·m.',
        'Input power: $P = 2\\pi n T = 2\\pi \\times 24.67 \\times 192.5 = 29.8$ kW.',
        'Hydraulic power: $250 \\times 63.9/600 = 26.6$ kW; $\\eta_t = 0.96 \\times 0.93 = 0.893$; heat $= 29.8 - 26.6 = 3.2$ kW.'
      ],
      a: '63.9 L/min, 192.5 N·m, 29.8 kW in (a standard 30 kW motor is just enough for continuous duty), 3.2 kW of heat from the pump alone.'
    },
    {
      title: 'A gear pump on the test stand',
      q: 'A 32 cm³/rev gear pump at 1500 rpm delivers 45.1 L/min at 200 bar and takes 115 N·m. What are its three efficiencies?',
      steps: [
        'Ideal flow $32 \\times 1500 = 48$ L/min, so $\\eta_v = 45.1/48 = 0.94$.',
        'Ideal torque $32\\times10^{-6} \\times 2\\times10^7/2\\pi = 101.9$ N·m, so $\\eta_{hm} = 101.9/115 = 0.886$.',
        '$\\eta_t = 0.94 \\times 0.886 = 0.83$.'
      ],
      a: 'η_v = 0.94, η_hm = 0.89, η_t = 0.83 — a healthy gear pump.'
    }
  ],
  quiz: [
    { q: 'The oil in a system runs hot and thin. Which efficiency of the pump suffers most?', choices: ['volumetric', 'hydraulic-mechanical', 'neither', 'both equally'], a: 0,
      why: 'Leakage through the clearances is inversely proportional to viscosity; friction losses actually fall a little in thin oil.' },
    { q: 'At very low pressure, a pump\'s overall efficiency is poor mainly because…', choices: ['it leaks a lot', 'its friction torque is roughly fixed while the useful torque is small', 'the oil compresses', 'it cavitates'], a: 1,
      why: 'η_hm = ideal torque / actual torque; at low pressure the ideal torque is small compared with the drag and friction that remain.' },
    { q: 'What torque does a 100 cm³/rev pump need at 200 bar with a hydraulic-mechanical efficiency of 0.90?', answer: 353.7, unit: 'N·m',
      why: 'T = VΔp/(2π η_hm) = 10⁻⁴ × 2×10⁷/(2π × 0.9) = 354 N·m.' },
    { q: 'A pump with η_v = 0.95 and η_hm = 0.92 turns 87.4 % of its shaft power into hydraulic power.', a: true,
      why: 'η_t = 0.95 × 0.92 = 0.874.' },
    { q: 'Which sign most directly shows that a piston pump is wearing?', choices: ['a lower drive torque', 'rising case-drain flow and falling volumetric efficiency', 'a higher relief setting', 'a quieter pump'], a: 1,
      why: 'Wear opens clearances, and leakage grows with the cube of the gap; it ends up in the case and the drain line.' }
  ],
  problems: [
    { q: 'A pump delivers 80 L/min at 210 bar with an overall efficiency of 0.88. What input power does it need?', answer: 31.8, unit: 'kW', tol: 0.02,
      steps: ['Hydraulic power $= 210 \\times 80/600 = 28.0$ kW.', 'Input $= 28.0/0.88 = 31.8$ kW.'] }
  ],
  applications: ['Choosing the electric motor or engine power for a pump.', 'Estimating the heat a system makes and sizing its cooler.', 'Condition monitoring: tracking volumetric efficiency and case-drain flow over a machine\'s life.', 'Choosing a pump type and operating point that keep a machine in the best part of its efficiency map.'],
  history: 'In the 1940s W. E. Wilson proposed describing pump losses with a few coefficients: leakage proportional to pressure over viscosity, and torque losses from viscous drag, dry friction proportional to pressure and a constant. His model, refined many times, is still the starting point for pump-loss calculations — and for the efficiency map in the simulation on this page.',
  sim: 'pm-efficiency-map'
},

{
  id: 'variable-displacement', parent: 'hydraulic-pumps', title: 'Variable-displacement pumps', level: 2,
  short: 'Pumps whose displacement can be changed while they run — by tilting a swash plate, swinging a bent axis or shifting a vane pump\'s ring — so that the flow follows the demand instead of being thrown away over a relief valve.',
  keywords: ['variable displacement', 'variable pump', 'swash angle', 'control piston', 'controller', 'pressure compensator', 'load sensing', 'power limiter', 'torque limiter', 'horsepower control', 'over centre', 'stroking', 'displacement fraction'],
  prereq: ['piston-pumps', 'pump-efficiencies', 'relief-valve'],
  related: ['pressure-compensated-pump', 'load-sensing', 'hydrostatic-transmission', 'vane-pumps', 'energy-losses-heat', 'iso-4406', 'mobile-hydraulics'],
  body: `
A fixed pump delivers its full flow whenever it turns, needed or not; the surplus goes back to the tank over the relief valve and turns into heat. A **variable-displacement** pump changes its displacement while it runs, so it can deliver only what the circuit uses. Piston pumps and the unbalanced vane pump make this easy: tilt the swash plate, swing the bent axis or slide the vane ring, and the stroke changes.

### The mechanism
In a swash-plate pump the plate sits in a cradle and is held by a **control piston** on one side and a spring (or a smaller bias piston at pump pressure) on the other. A small control valve — the **controller** — meters pump pressure into the control piston or lets it out to the case, and so sets the angle. The displacement follows the tangent of the angle:

$$\\varepsilon = \\frac{V_g}{V_{g,max}} = \\frac{\\tan\\alpha}{\\tan\\alpha_{max}}, \\qquad Q = V_{g,max}\\,\\frac{\\tan\\alpha}{\\tan\\alpha_{max}}\\,n\\,\\eta_v$$

A 71 cm³/rev pump (18° maximum) at 1500 rpm needs only 7.3° for 40 L/min. Going from zero to full displacement typically takes 50–150 ms and back again 20–60 ms — fast, but not instantaneous, which is why a safety relief valve is still fitted.

### What the controller listens to
| Control | Holds constant | Characteristic | Used for |
|---|---|---|---|
| Manual, servo or electro-proportional | displacement (a flow command) | set by lever or current | fans, winches, closed loops |
| Pressure compensator | outlet pressure | flat, then cut-off at the setting | presses, clamping, machine tools |
| Load sensing | pressure a margin (15–25 bar) above the highest load | flow on demand | mobile machines |
| Power (torque) limiter | pressure × flow | hyperbola, $pQ$ = const | drives that must not stall or overload |
| Electronic | whatever a controller computes | angle sensor and proportional valve | modern industrial and mobile machines |

Controls are combined: a typical mobile pump is load-sensing with a pressure cut-off and a power limiter all at once, each able to reduce the displacement ([[pressure-compensated-pump]], [[load-sensing]]).

### Power limiting
An engine or motor of power $P$ can drive a pump only as long as $pQ/\\eta_t \\le P$. The power controller keeps the pump on the hyperbola

$$Q = \\frac{P\\,\\eta_t}{\\Delta p}$$

so the machine gets full flow at light loads and full pressure at slow speeds, but never overloads the drive. A 30 kW motor with $\\eta_t$ = 0.9 allows 64.8 L/min at 250 bar and 46.3 L/min at 350 bar; the 71 cm³/rev pump above can give its full 101 L/min only below 160 bar. Without the limiter, full flow at 350 bar would need a motor of about 66 kW — capacity that would sit idle for most of the working cycle.

### Over centre
A pump whose swash plate can tilt through zero to the other side reverses its flow without any directional valve, with its drive still turning the same way. Such pumps are the heart of closed-loop [[hydrostatic-transmission|hydrostatic transmissions]], where the swash angle is accelerator and gear lever in one.

### The cost
Variable pumps are dearer, more complicated and more sensitive to dirt than fixed ones — the controller spool has clearances of a few micrometres — and, being piston or vane pumps, they need cleaner oil than gear pumps ([[iso-4406]]). They repay it wherever demand varies: the energy saved often pays for the pump within a year or two.
`,
  ideas: [
    'A variable pump sets its displacement while running, so flow follows demand.',
    'Swash-plate displacement is proportional to tan α; a control piston, directed by a controller, sets the angle.',
    'Controllers hold a flow, a pressure, a margin above the load or a power — often several at once.',
    'A power limiter keeps p·Q under the drive\'s power, allowing a much smaller motor or engine.',
    'Over-centre pumps reverse the flow with the drive turning the same way.'
  ],
  pitfalls: [
    'A variable pump makes the relief valve unnecessary — The controller needs tens of milliseconds to destroke; a safety relief valve catches the pressure spike when flow is suddenly blocked.',
    'Halving the swash angle halves the flow — Displacement follows tan α, so halving the angle gives slightly less than half.',
    'A power-limited pump delivers its full power all the time — It delivers at most that power; at low pressure the flow limit (maximum displacement) applies first.'
  ],
  formulas: [
    {
      name: 'Flow of a swash-plate pump at a set angle',
      expr: 'Q = Vgmax*(tan(alpha)/tan(alphamax))*n*eta_v', tex: 'Q = V_{g,max}\\,\\dfrac{\\tan\\alpha}{\\tan\\alpha_{max}}\\,n\\,\\eta_v',
      vars: {
        Q: { name: 'delivered flow', q: 'flowrate', unit: 'L/min' },
        Vgmax: { name: 'maximum displacement', q: 'displacement', unit: 'cm³/rev', value: 71, tex: 'V_{g,max}' },
        alpha: { name: 'swash-plate angle', q: 'angle', unit: '°', value: 7.3, min: 0, max: 25 },
        alphamax: { name: 'maximum swash angle', q: 'angle', unit: '°', value: 18, min: 5, max: 25, tex: '\\alpha_{max}' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1500 },
        eta_v: { name: 'volumetric efficiency', value: 0.95, min: 0, max: 1, tex: '\\eta_v' }
      },
      stories: {
        Q: 'A {Vgmax} pump (maximum angle {alphamax}) turns at {n} with its plate at {alpha}; η_v = {eta_v}. What flow does it deliver?',
        alpha: 'A {Vgmax} pump with an {alphamax} maximum swash angle turns at {n} (η_v = {eta_v}). At what angle does it deliver {Q}?'
      }
    },
    {
      name: 'Power-limited flow',
      expr: 'Q = P*eta_t/dp', tex: 'Q = \\dfrac{P\\,\\eta_t}{\\Delta p}',
      vars: {
        Q: { name: 'largest flow allowed', q: 'flowrate', unit: 'L/min' },
        P: { name: 'drive power available', q: 'power', unit: 'kW', value: 30 },
        eta_t: { name: 'pump overall efficiency', value: 0.9, min: 0, max: 1, tex: '\\eta_t' },
        dp: { name: 'pump pressure (gauge)', q: 'pressure', unit: 'bar', value: 250, tex: '\\Delta p' }
      },
      note: 'The limiter keeps the pump on this hyperbola; below the corner pressure the maximum displacement limits the flow instead.',
      stories: {
        Q: 'A power-limited pump is driven by a {P} motor; its overall efficiency is {eta_t}. What is the most flow it can give at {dp}?',
        P: 'A pump with an overall efficiency of {eta_t} must deliver {Q} at {dp}. What drive power does that take?'
      }
    }
  ],
  examples: [
    {
      title: 'The angle for a flow',
      q: 'A 71 cm³/rev swash-plate pump (18° maximum) turns at 1500 rpm with η_v = 0.95. What swash angle gives 40 L/min?',
      steps: [
        'Full flow: $71 \\times 1500 \\times 0.95 = 101.2$ L/min, so $\\varepsilon = 40/101.2 = 0.395$.',
        '$\\tan\\alpha = 0.395 \\times \\tan 18° = 0.395 \\times 0.325 = 0.128$, so $\\alpha = 7.3°$.'
      ],
      a: 'About 7.3° — a little less than 40 % of 18°, because the displacement follows tan α.'
    },
    {
      title: 'A power limiter',
      q: 'The same pump is driven by a 30 kW motor; its overall efficiency is 0.9. What flow can it deliver at 250 and 350 bar, and below what pressure can it give full flow?',
      steps: [
        'At 250 bar: $Q = 30\\,000 \\times 0.9/2.5\\times10^7 = 1.08\\times10^{-3}$ m³/s = 64.8 L/min.',
        'At 350 bar: 46.3 L/min.',
        'Full flow (101.2 L/min) needs $p = P\\eta_t/Q = 27\\,000/1.687\\times10^{-3} = 1.60\\times10^7$ Pa = 160 bar.'
      ],
      a: '64.8 L/min at 250 bar, 46.3 L/min at 350 bar; full flow up to 160 bar.'
    }
  ],
  quiz: [
    { q: 'The swash angle of a pump with an 18° maximum is halved to 9°. The displacement becomes…', choices: ['exactly half', 'slightly less than half, since it follows tan α', 'a quarter', 'unchanged'], a: 1,
      why: 'tan 9°/tan 18° = 0.158/0.325 = 0.49.' },
    { q: 'A power-limited pump works against a rising load pressure. Its flow…', choices: ['stays at maximum', 'falls so that pressure × flow stays about constant', 'rises', 'drops to zero at once'], a: 1,
      why: 'The limiter keeps the pump on the hyperbola pQ = P η_t, so the drive is never overloaded.' },
    { q: 'An over-centre pump can reverse the flow in a circuit while its drive keeps turning the same way.', a: true,
      why: 'Tilting the swash plate through zero swaps which kidney port delivers and which sucks.' },
    { q: 'A 22 kW motor drives a power-limited pump with an overall efficiency of 0.88. What is the most flow it can deliver at 200 bar?', answer: 58.1, unit: 'L/min',
      why: 'Q = P η_t/p = 22 000 × 0.88/2×10⁷ = 9.68×10⁻⁴ m³/s = 58.1 L/min.' },
    { q: 'Why is a relief valve still fitted to a circuit with a pressure-compensated variable pump?', choices: ['to set the working pressure', 'because the pump needs tens of milliseconds to destroke, and the pressure can overshoot meanwhile', 'to prime the pump', 'it is not; it would waste energy'], a: 1,
      why: 'The relief valve is a safety device set above the compensator; it catches spikes the controller is too slow for.' }
  ],
  problems: [
    { q: 'A 100 cm³/rev variable pump (maximum angle 17°) turns at 1800 rpm with η_v = 0.95. At what swash angle does it deliver 90 L/min?', answer: 9.14, unit: '°', tol: 0.02,
      steps: ['$\\varepsilon = 90\\,000/(100 \\times 1800 \\times 0.95) = 0.526$.', '$\\tan\\alpha = 0.526 \\times \\tan 17° = 0.161$, so $\\alpha = 9.1°$.'] }
  ],
  applications: ['Excavators and cranes: load-sensing pumps with pressure cut-off and power limiting matched to the engine.', 'Presses and plastics machines: pressure-compensated and electronically controlled pumps.', 'Closed-loop travel drives: over-centre pumps as the vehicle\'s continuously variable transmission.', 'Hydraulic fan drives, where the displacement follows the engine temperature.'],
  sim: ['pm-axial-piston', { id: 'pm-comp-pump', params: { mode: 'power' } }]
},

{
  id: 'pressure-compensated-pump', parent: 'hydraulic-pumps', title: 'Pressure-compensated pumps', level: 2,
  short: 'A variable pump that holds a set pressure: it delivers full flow until the pressure nears the compensator setting, then destrokes to supply just the flow the circuit takes — down to its own leakage when everything is blocked.',
  keywords: ['pressure compensated pump', 'pressure compensator', 'cut-off', 'dead-head', 'destroke', 'compensator spool', 'droop', 'p-Q characteristic', 'constant pressure', 'standby', 'energy saving', 'throttling loss'],
  prereq: ['variable-displacement', 'relief-valve'],
  related: ['load-sensing', 'vane-pumps', 'piston-pumps', 'accumulators', 'pilot-relief', 'energy-losses-heat', 'open-closed-centre', 'hi-lo-circuit'],
  body: `
A pressure-compensated pump is a variable pump with a single instruction: *never let the outlet pressure exceed the setting*. Below the setting it delivers full flow, like a fixed pump. As the pressure approaches the setting it reduces its displacement until it delivers just the flow the circuit takes — and when every valve is closed, only enough to make up its own leakage, while holding full pressure.

### The p–Q characteristic
Plot flow against pressure and the curve is almost a right angle:
- a **flat top** — full flow, falling slightly with leakage — from zero up to the **cut-off** pressure;
- a nearly **vertical side**, where the displacement collapses over a few bar to zero flow at the **dead-head** pressure.

The circuit decides where on that curve the pump runs. The operating point is where the pump's characteristic crosses the load's — a valve, a cylinder, a motor. A load needing less than the cut-off pressure gets full flow; a load that stalls, or a closed valve, puts the pump on the vertical side at the setting, delivering almost nothing.

### How it knows
In a vane pump the compensator can be direct: the outlet pressure acts on the cam ring over an effective area $A_c$ and pushes it against a spring of stiffness $k$ and preload $k x_0$. The ring stays at full eccentricity until the pressure force overcomes the preload, then moves by $s$ as

$$p\\,A_c = k\\,(x_0 + s)$$

A 150 N/mm spring preloaded 25 mm against 2 cm² starts to cut off at 187.5 bar and reaches zero flow at 210 bar after 3 mm of travel — a **droop** of over 20 bar. Piston pumps use a small **compensator spool** instead: pump pressure on the spool end works against an adjustable spring, and a movement of a fraction of a millimetre opens pump pressure to the control piston that destrokes the swash plate. The spool's high gain keeps the droop to a few bar.

### Why it saves energy
| Supplying 40 L/min at 150 bar (pump 100 L/min, setting 250 bar) | Pump output | Useful | Lost |
|---|---|---|---|
| Fixed pump with a relief valve | 41.7 kW | 10.0 kW | 31.7 kW |
| Pressure-compensated pump | 16.7 kW | 10.0 kW | 6.7 kW |
| Load-sensing pump, 20 bar margin | 11.3 kW | 10.0 kW | 1.3 kW |

(Pump losses are left out.) A fixed pump throws its surplus flow over the relief valve at full pressure. The compensated pump sends no surplus, but it still holds its **setting**, so whenever the load needs less pressure the difference is throttled away in the valves:

$$P_{loss} = (p_c - p_L)\\,Q$$

That remaining loss is what [[load-sensing]] removes. Pressure compensation shines where the load mostly needs high pressure and little flow — clamping, holding, pressing, charging an [[accumulators|accumulator]], or feeding many valves at once in a machine tool ([[open-closed-centre|closed-centre systems]]).

### Details that matter
- A **relief valve** is still fitted, set typically 20–30 bar above the compensator: when a valve closes suddenly the compensator needs tens of milliseconds to react and the pressure overshoots.
- At dead-head the pump still turns and still leaks. That leakage, at full pressure, becomes heat — typically a kilowatt or two, against tens of kilowatts for a fixed pump over its relief valve. It leaves through the case drain, which must never be blocked.
- A remote-control port lets a small relief valve elsewhere lower the setting, or an unloading valve drop the pump to a low standby pressure while the machine waits ([[pilot-relief]]).

> [!warn] A pressure-compensated system at dead-head is quiet and still — the pump is barely delivering — but every line is at full pressure. Silence is not safety: stop and lock out the drive, release the pressure and discharge accumulators before loosening anything.
`,
  ideas: [
    'The characteristic is flat (full flow) up to the cut-off, then drops almost vertically to zero flow at the setting.',
    'The operating point is where the pump characteristic meets the load curve.',
    'A spring balanced against pressure on a ring or a spool sets the cut-off; the droop is its regulation band.',
    'Compared with a fixed pump over a relief valve it wastes no surplus flow, but it still throttles (p_c − p_L)·Q in the valves.',
    'A safety relief valve is still needed, set above the compensator.'
  ],
  pitfalls: [
    'At dead-head the pump uses no power — It still turns, leaks at full pressure and has friction: typically 1–2 kW of heat for a mid-size pump, far less than a fixed pump but not zero.',
    'A compensated pump runs every load at the lowest possible pressure — It runs at its setting whenever the flow is restricted; loads needing less pressure are fed through throttling valves. Load sensing is what follows the load.',
    'A quiet, idle system is depressurised — A compensated pump at dead-head holds full pressure in every line.'
  ],
  formulas: [
    {
      name: 'Direct-acting compensator',
      expr: 'p = k*(x0 + s)/Ac', tex: 'p = \\dfrac{k\\,(x_0 + s)}{A_c}',
      vars: {
        p: { name: 'outlet pressure (gauge)', q: 'pressure', unit: 'bar' },
        k: { name: 'spring stiffness', q: 'stiffness', unit: 'N/mm', value: 150 },
        x0: { name: 'spring preload compression', q: 'length', unit: 'mm', value: 25, tex: 'x_0' },
        s: { name: 'travel of the ring from full displacement', q: 'length', unit: 'mm', value: 1.5 },
        Ac: { name: 'effective area the pressure acts on', q: 'area', unit: 'cm²', value: 2, tex: 'A_c' }
      },
      note: 's = 0 gives the cut-off pressure, s = full travel the dead-head pressure; their difference is the droop.',
      stories: {
        p: 'A compensator spring of {k} is preloaded by {x0} against an area of {Ac}. At what pressure has the ring moved {s}?',
        x0: 'A compensator with a {k} spring and an area of {Ac} should hold the ring {s} from full stroke at {p}. What preload compression does the spring need?'
      }
    },
    {
      name: 'Throttling loss with a compensated pump',
      expr: 'P = (pc - pL)*Q', tex: 'P_{loss} = (p_c - p_L)\\,Q',
      vars: {
        P: { name: 'power lost in throttling', q: 'power', unit: 'kW', tex: 'P_{loss}' },
        pc: { name: 'compensator setting (gauge)', q: 'pressure', unit: 'bar', value: 250, tex: 'p_c' },
        pL: { name: 'pressure the load needs (gauge)', q: 'pressure', unit: 'bar', value: 150, tex: 'p_L' },
        Q: { name: 'flow to the load', q: 'flowrate', unit: 'L/min', value: 40 }
      },
      stories: {
        P: 'A pump compensated at {pc} feeds {Q} to a load that needs only {pL}. How much power is throttled away?',
        pL: 'A pump compensated at {pc} feeds {Q} and the valves throttle away {P}. What pressure does the load need?'
      }
    }
  ],
  examples: [
    {
      title: 'The press that waits',
      q: 'A press holds a part at 180 bar for 20 s of every 30 s cycle. Supply A is a fixed 60 L/min pump with its relief valve at 200 bar; supply B a pressure-compensated pump set at 200 bar that leaks 2 L/min at dead-head, with about 1 kW of friction. Compare the power wasted while holding.',
      steps: [
        'A: all 60 L/min crosses the relief valve: $200 \\times 60/600 = 20$ kW of heat.',
        'B: the pump destrokes to its leakage: $200 \\times 2/600 = 0.67$ kW, plus about 1 kW of friction — roughly 1.7 kW.',
        'Averaged over the cycle (holding two-thirds of the time): 13.3 kW against 1.1 kW. Over a 4000-hour year the difference is nearly 50 MWh.'
      ],
      a: 'About 20 kW against 1.7 kW while holding; the compensated pump also needs a far smaller cooler.'
    },
    {
      title: 'Where does it cut off?',
      q: 'A vane pump\'s ring is held by a 150 N/mm spring preloaded 25 mm; the pressure acts on an effective area of 2 cm² and the ring can travel 3 mm from full eccentricity to centre. Find the cut-off and dead-head pressures.',
      steps: [
        'Cut-off ($s = 0$): $p = 150\\,000 \\times 0.025/2\\times10^{-4} = 1.875\\times10^7$ Pa = 187.5 bar.',
        'Dead-head ($s = 3$ mm): $p = 150\\,000 \\times 0.028/2\\times10^{-4} = 2.10\\times10^7$ Pa = 210 bar.'
      ],
      a: 'Cut-off starts at 187.5 bar and the flow reaches zero at 210 bar: a droop of 22.5 bar.'
    }
  ],
  quiz: [
    { q: 'All the valves of a circuit close. A pressure-compensated pump then…', choices: ['sends its full flow over the relief valve', 'holds the set pressure while delivering only its leakage flow', 'stops turning', 'drops to zero pressure'], a: 1,
      why: 'It destrokes almost to zero displacement — just enough to make up its internal leakage at the set pressure.' },
    { q: 'A pump compensated at 210 bar feeds a motor that needs 90 bar at full flow. Where does the excess energy go?', choices: ['back into the electric motor', 'into heat across the valve that throttles 210 bar down to 90 bar', 'into the accumulator', 'nowhere: the pump adjusts its pressure to 90 bar'], a: 1,
      why: 'A pressure compensator holds its setting whenever it is on the cut-off part of the curve or the flow is throttled; the difference is lost as (p_c − p_L)·Q.' },
    { q: 'With a pressure-compensated pump, a relief valve is unnecessary.', a: false,
      why: 'The compensator is too slow for sudden blocking; a relief valve set above it limits the pressure spike.' },
    { q: 'A pump compensated at 210 bar feeds 40 L/min to a load needing 120 bar. How much power is throttled away?', answer: 6.0, unit: 'kW',
      why: '(210 − 120) × 40/600 = 6.0 kW.' },
    { q: 'Plotted as flow against pressure, the characteristic of a pressure-compensated pump is…', choices: ['a straight line through the origin', 'flat up to the cut-off, then dropping steeply to zero flow at the setting', 'a hyperbola', 'a parabola falling from the shut-off point'], a: 1,
      why: 'Full flow until the compensator acts, then a near-vertical drop over the droop band.' }
  ],
  problems: [
    { q: 'A compensator has a 120 N/mm spring preloaded 30 mm acting against an area of 1.8 cm². At what pressure does cut-off begin?', answer: 200, unit: 'bar', tol: 0.02,
      steps: ['$F = kx_0 = 120\\,000 \\times 0.03 = 3600$ N.', '$p = F/A_c = 3600/1.8\\times10^{-4} = 2.0\\times10^7$ Pa = 200 bar.'] }
  ],
  applications: ['Presses and clamping fixtures that hold pressure for long periods.', 'Machine tools with many valves fed from one closed-centre supply.', 'Accumulator charging and test benches that need a steady supply pressure.', 'Aircraft hydraulic systems, which use pressure-compensated piston pumps at 207 or 345 bar (3000 or 5000 psi).'],
  sim: 'pm-comp-pump'
},

/* ================================================================ MOTORS */
{
  id: 'hydraulic-motors', parent: 'motors-topic', title: 'Hydraulic motors', level: 1,
  short: 'A pump run backwards: oil under pressure pushes on gears, vanes or pistons and turns the shaft. The displacement sets the exchange rate — torque per bar, revolutions per litre.',
  keywords: ['hydraulic motor', 'gear motor', 'vane motor', 'piston motor', 'orbital motor', 'radial piston motor', 'displacement', 'torque', 'speed', 'case drain', 'starting torque', 'bidirectional', 'brake'],
  prereq: ['positive-displacement', 'displacement-flow', 'physics:torque'],
  related: ['motor-torque-speed', 'lsht-motors', 'hydrostatic-transmission', 'braking-circuits', 'counterbalance-valve', 'piston-pumps', 'pneumatics:air-motors', 'electronics:dc-motor-control'],
  body: `
Feed oil under pressure into a pump and it turns: a hydraulic **motor** is a positive-displacement machine run the other way, turning flow and pressure back into shaft speed and torque. The same families exist — gear, vane, axial and radial piston — plus a few designed only as motors, for slow, heavy work.

### Displacement is the exchange rate
With a displacement $V_g$ per revolution, an ideal motor turns at

$$n = \\frac{Q}{V_g}$$

and gives a torque that depends only on the pressure difference across it:

$$T = \\frac{V_g\\,\\Delta p}{2\\pi}$$

A handy form: $T$ (N·m) ≈ $V_g$ (cm³/rev) × $\\Delta p$ (bar) / 62.8. So 100 cm³/rev at 200 bar gives 318 N·m, and 60 L/min turns it at 600 rpm. Flow sets the speed, pressure sets the torque, and displacement trades one for the other exactly as a gear ratio does: a larger motor on the same pump turns slower and pushes harder. Leakage and friction take a little off both ([[motor-torque-speed]]).

### Motors are not just pumps backwards
- **Both directions.** Most motors must drive and brake either way, so both ports are alike and either may be the pressure port.
- **External drain.** With either port pressurised, leakage cannot simply return to the "inlet": piston and many orbital motors have a case drain to tank, which also protects the shaft seal.
- **Starting torque.** A motor must start under load from rest, where friction is highest. At breakaway a gear motor gives perhaps 75–85 % of its ideal torque, a good piston motor 90 % or more.
- **Low-speed smoothness.** Below some speed, torque pulses and stick-slip make rotation jerky: a few hundred rpm for many gear motors, tens of rpm for axial piston motors, under 1 rpm for the best radial piston motors.

| Motor | Displacement (cm³/rev) | Pressure | Speed (rpm) | Typical uses |
|---|---|---|---|---|
| External gear | 1–100 | up to about 250 bar | 500–4000 | fans, conveyors, spreaders |
| Vane | 10–300 | 150–210 bar | 100–3000 | machine tools, marine |
| Axial piston (swash plate or bent axis) | 5–1000 | 350–450 bar | 50–6000 | travel drives, winches |
| Orbital (gerotor) | 8–1000 | 100–250 bar | 10–1000 | augers, wheels, sweepers |
| Radial piston, multi-lobe | 200 to over 30 000 | 250–450 bar | 0.5–300 | winches, mills, ship drives |

The last two are the [[lsht-motors|low-speed high-torque]] motors that drive their loads directly, without a gearbox.

### Why a hydraulic motor?
Weight for weight, a hydraulic motor gives far more torque than an electric one: a 100 cm³/rev piston motor the size of a shoebox delivers over 600 N·m at 400 bar. It can stall at full torque indefinitely — the relief valve simply takes the flow — reverse in an instant, and live in the wet, dust and heat of a mobile machine. The price is the pump and the lines, and efficiency lost twice: once in the pump and once in the motor.

> [!warn] A motor holding a load by trapped oil will creep, because it leaks. Winches, cranes and slewing drives use spring-applied, pressure-released brakes and counterbalance valves ([[braking-circuits]], [[counterbalance-valve]]). Before working on a motor, lower or mechanically secure the load, stop and lock out the pump and release the pressure — valves are not a support.
`,
  ideas: [
    'A motor turns flow into speed (n = Q/V_g) and pressure into torque (T = V_g Δp/2π).',
    'Displacement works like a gear ratio: a bigger motor turns slower with more torque.',
    'Motors run both ways, need a case drain, and must start under load.',
    'Low-speed high-torque motors drive loads directly without a gearbox.',
    'A motor leaks, so it cannot hold a load by itself — brakes and counterbalance valves do that.'
  ],
  pitfalls: [
    'The pump\'s pressure rating decides a motor\'s speed — Speed depends on flow and displacement only; pressure decides torque.',
    'A motor with its ports blocked holds its load — Internal leakage lets it creep; a mechanical brake is needed to hold a load.',
    'A hydraulic motor can be swapped for a pump of the same size — Many pumps cannot run as motors (valve plates, one-way seals, no case drain for pressure on both ports); only units built for both duties can.'
  ],
  formulas: [
    {
      name: 'Ideal motor speed',
      expr: 'n = Q/Vg', tex: 'n = \\dfrac{Q}{V_g}',
      vars: {
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm' },
        Q: { name: 'flow into the motor', q: 'flowrate', unit: 'L/min', value: 60 },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_g' }
      },
      stories: { n: 'A motor of {Vg} is fed {Q}. How fast does it turn, ignoring leakage?', Vg: 'A drum must turn at {n} on a supply of {Q}. What motor displacement does that take (ideally)?' }
    },
    {
      name: 'Ideal motor torque',
      expr: 'T = Vg*dp/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p}{2\\pi}',
      vars: {
        T: { name: 'output torque', q: 'torque', unit: 'N·m' },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 100, tex: 'V_g' },
        dp: { name: 'pressure difference across the motor', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' }
      },
      note: 'T (N·m) ≈ V_g (cm³/rev) × Δp (bar) / 62.8.',
      stories: { T: 'A {Vg} motor works with {dp} across it. What torque does it give, ideally?', dp: 'A {Vg} motor must give {T}. What pressure difference does it need, ideally?' }
    }
  ],
  examples: [
    {
      title: 'A fan drive',
      q: 'An 8 cm³/rev gear motor drives a cooling fan from a 20 L/min supply. Its volumetric efficiency is 0.92 and its hydraulic-mechanical efficiency 0.85. The fan needs 15 N·m at the resulting speed. What speed and what pressure difference?',
      steps: [
        'Speed: $n = Q\\eta_v/V_g = 20\\,000 \\times 0.92/8 = 2300$ rpm.',
        'Torque per bar, ideally: $8\\times10^{-6} \\times 10^5/2\\pi = 0.127$ N·m/bar.',
        '$\\Delta p = 15/(0.127 \\times 0.85) = 139$ bar.'
      ],
      a: '2300 rpm at about 139 bar across the motor.'
    },
    {
      title: 'Same pump, two motors',
      q: 'A supply gives 60 L/min at up to 150 bar. Compare a 50 cm³/rev and a 200 cm³/rev motor on it (ideal).',
      steps: [
        '50 cm³/rev: $n = 60\\,000/50 = 1200$ rpm; $T = 50\\times10^{-6} \\times 1.5\\times10^7/2\\pi = 119$ N·m.',
        '200 cm³/rev: $n = 300$ rpm; $T = 477$ N·m.',
        'Power: $2\\pi \\times 20 \\times 119 = 2\\pi \\times 5 \\times 477 = 15.0$ kW, the same as $pQ = 150 \\times 60/600$.'
      ],
      a: 'The small motor turns four times as fast with a quarter of the torque; the power is the same 15 kW.'
    }
  ],
  quiz: [
    { q: 'The flow to a motor doubles while its load torque stays the same. What changes?', choices: ['the speed doubles; the pressure stays nearly the same', 'the torque doubles', 'the pressure doubles', 'nothing'], a: 0,
      why: 'Speed = flow/displacement; pressure is set by the load torque, which has not changed.' },
    { q: 'The load torque on a motor doubles at the same flow. What changes?', choices: ['the speed halves', 'the pressure roughly doubles; the speed stays nearly the same', 'the flow doubles', 'the displacement doubles'], a: 1,
      why: 'T = V_g Δp/2π: twice the torque needs twice the pressure difference. Speed barely changes (a little more leakage).' },
    { q: 'What torque does a 50 cm³/rev motor give, ideally, with 180 bar across it?', answer: 143.2, unit: 'N·m',
      why: 'T = 50×10⁻⁶ × 1.8×10⁷/2π = 143 N·m.' },
    { q: 'A hydraulic motor with both ports blocked will hold a suspended load indefinitely.', a: false,
      why: 'Internal leakage lets the trapped oil escape slowly, so the load creeps down. A mechanical brake holds loads.' },
    { q: 'Why do piston motors have a case-drain line?', choices: ['to cool the motor with fresh oil only', 'because either port may be pressurised, so leakage needs its own path to tank, protecting the shaft seal', 'to prime the motor', 'to measure the speed'], a: 1,
      why: 'In a pump the leakage can go to the low-pressure inlet; a motor may have pressure on either port, so the case is drained separately.' }
  ],
  problems: [
    { q: 'A mixer drum must turn at 12 rpm on a 60 L/min supply. What motor displacement does that need, ideally?', answer: 5000, unit: 'cm³/rev', tol: 0.02,
      steps: ['$V_g = Q/n = 60\\,000/12 = 5000$ cm³/rev — 5 L per revolution: a job for a low-speed high-torque motor.'] }
  ],
  applications: ['Travel drives of excavators, loaders and rollers.', 'Winches, capstans and cranes on ships and offshore platforms.', 'Concrete mixers, augers, conveyors and sweepers.', 'Cooling fans of engines, driven hydraulically so their speed follows the temperature.'],
  history: 'In the 1840s William Armstrong built water-pressure engines and hydraulic cranes on the Tyne. By the 1880s London had a public network of high-pressure water mains at about 50 bar, driving lifts, cranes, dock gates and even theatre stages; it ran until 1977.',
  sim: 'pm-lsht-motor'
},

{
  id: 'motor-torque-speed', parent: 'motors-topic', title: 'Motor torque, speed and power', level: 2,
  short: 'n = Q η_v / V_g and T = V_g Δp η_hm / 2π: flow sets the speed, pressure sets the torque, and a real motor turns a little slower and pushes a little weaker than the ideal — least of all when starting.',
  keywords: ['motor torque', 'motor speed', 'motor power', 'volumetric efficiency', 'hydraulic-mechanical efficiency', 'starting torque', 'breakaway', 'back-pressure', 'motor sizing', 'winch', 'torque-speed curve'],
  prereq: ['hydraulic-motors', 'pump-efficiencies', 'physics:power'],
  related: ['lsht-motors', 'hydrostatic-transmission', 'braking-circuits', 'counterbalance-valve', 'displacement-flow', 'electronics:dc-motor-control'],
  body: `
Real motors fall short of the ideal in the same two ways as pumps — but the losses point the other way. Leakage means some of the oil fed in slips past without turning the shaft, so the motor needs **more** flow than $V_g n$; friction means it gives **less** torque than $V_g \\Delta p/2\\pi$:

$$n = \\frac{Q\\,\\eta_v}{V_g}, \\qquad T = \\frac{V_g\\,\\Delta p\\,\\eta_{hm}}{2\\pi}$$

and the power at the shaft is

$$P = 2\\pi\\,n\\,T = Q\\,\\Delta p\\,\\eta_v\\,\\eta_{hm}$$

The pressure that counts is the **difference** across the motor, $\\Delta p = p_{in} - p_{out}$. Back-pressure at the outlet — a return filter, a counterbalance valve, a second motor in series — costs torque bar for bar. The [motor calculator](#/tools/fpower/motor) works these relations in either direction.

### A flat torque curve
Because torque depends on pressure and speed on flow, a motor fed with a constant flow through a relief valve has a strikingly simple characteristic: **full torque from zero speed**, as long as the load needs it, with the speed set by the flow and sagging only slightly with load as the leakage grows. An induction motor, by contrast, has a torque that depends on its speed, a limited starting torque and a stall point. That flat curve is why hydraulic motors drive winches, drills, mixers and wheels that must start heavily loaded.

### Starting and creeping
The efficiency at **breakaway** — the torque available to start a load from rest, as a fraction of the ideal — is lower than the running value, because static friction exceeds sliding friction and the lubricating films have not yet formed:

| Motor | Running $\\eta_{hm}$ | At breakaway |
|---|---|---|
| External gear | 0.85–0.90 | 0.75–0.85 |
| Orbital | 0.80–0.90 | 0.70–0.85 |
| Axial piston | 0.90–0.95 | 0.85–0.92 |
| Radial piston, multi-lobe | 0.93–0.96 | 0.90–0.95 |

A winch that must lift its full load from rest is sized with the **starting** efficiency. At very low speed the volumetric losses dominate instead: if a motor leaks 1 L/min and is fed 2 L/min, half the oil does no work, and the speed wanders with the temperature.

### Sizing a motor
1. From the load, find the torque $T$ and speed $n$ — for a winch drum, rope pull × drum radius and rope speed / drum circumference.
2. Pick a working pressure difference, typically 70–80 % of the motor's rating, leaving margin for starting and peaks.
3. $V_g = 2\\pi T/(\\Delta p\\,\\eta_{hm})$, with the starting efficiency if the load starts from rest.
4. Flow: $Q = V_g n/\\eta_v$. This sizes the pump and the lines.
5. If $V_g$ comes out enormous and $n$ tiny, choose a [[lsht-motors|low-speed high-torque]] motor — or a small fast motor with a gearbox.
`,
  ideas: [
    'Motor speed n = Q η_v / V_g: leakage makes it turn slower than Q/V_g.',
    'Motor torque T = V_g Δp η_hm / 2π, with Δp the difference between inlet and outlet.',
    'Shaft power = 2π n T = Q Δp η_t.',
    'Full torque is available from standstill; the starting (breakaway) efficiency is lower than the running one.',
    'Size the displacement from torque and pressure, then the flow from displacement and speed.'
  ],
  pitfalls: [
    'Only the inlet pressure matters — Torque depends on the pressure difference; back-pressure at the outlet reduces it bar for bar.',
    'A motor gives the same torque starting as running — Breakaway friction is higher; a gear motor may give 10–15 % less torque to start than to keep turning.',
    'For a motor, η_v multiplies the displacement — Leakage means the motor needs more flow: Q = V_g n / η_v, so n = Q η_v / V_g.'
  ],
  formulas: [
    {
      name: 'Motor output speed',
      expr: 'n = Q*eta_v/Vg', tex: 'n = \\dfrac{Q\\,\\eta_v}{V_g}',
      vars: {
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm' },
        Q: { name: 'flow into the motor', q: 'flowrate', unit: 'L/min', value: 80 },
        eta_v: { name: 'volumetric efficiency', value: 0.95, min: 0, max: 1, tex: '\\eta_v' },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 160, tex: 'V_g' }
      },
      stories: {
        n: 'A {Vg} motor is fed {Q}; its volumetric efficiency is {eta_v}. How fast does it turn?',
        Q: 'A {Vg} motor must turn at {n}; its volumetric efficiency is {eta_v}. What flow must it be given?'
      }
    },
    {
      name: 'Motor output torque',
      expr: 'T = Vg*dp*eta_hm/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p\\,\\eta_{hm}}{2\\pi}',
      vars: {
        T: { name: 'output torque', q: 'torque', unit: 'N·m' },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 160, tex: 'V_g' },
        dp: { name: 'pressure difference, inlet − outlet', q: 'pressure', unit: 'bar', value: 170, tex: '\\Delta p' },
        eta_hm: { name: 'hydraulic-mechanical efficiency', value: 0.92, min: 0, max: 1, tex: '\\eta_{hm}' }
      },
      stories: {
        T: 'A {Vg} motor has {dp} across it; its hydraulic-mechanical efficiency is {eta_hm}. What torque does it deliver?',
        Vg: 'A drive needs {T} with {dp} across the motor, whose hydraulic-mechanical efficiency is {eta_hm}. What displacement is needed?',
        dp: 'A {Vg} motor with a hydraulic-mechanical efficiency of {eta_hm} must deliver {T}. What pressure difference does it need?'
      }
    },
    {
      name: 'Motor output power',
      expr: 'P = 2*pi*n*T', tex: 'P = 2\\pi\\,n\\,T',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 475 },
        T: { name: 'output torque', q: 'torque', unit: 'N·m', value: 398 }
      },
      stories: { P: 'A motor turns at {n} with a torque of {T}. What power does it deliver?' }
    }
  ],
  examples: [
    {
      title: 'Speed, torque and power of a piston motor',
      q: 'A 160 cm³/rev motor is fed 80 L/min at 180 bar and returns oil at 10 bar. Its volumetric efficiency is 0.95 and its hydraulic-mechanical efficiency 0.92. Find its speed, torque, output power and overall efficiency.',
      steps: [
        'Speed: $n = Q\\eta_v/V_g = 80\\,000 \\times 0.95/160 = 475$ rpm.',
        'Torque: $\\Delta p = 170$ bar; $T = 160\\times10^{-6} \\times 1.7\\times10^7 \\times 0.92/2\\pi = 398$ N·m.',
        'Power: $P = 2\\pi \\times (475/60) \\times 398 = 19.8$ kW.',
        'Hydraulic power in: $170 \\times 80/600 = 22.7$ kW, so $\\eta_t = 19.8/22.7 = 0.874 = 0.95 \\times 0.92$.'
      ],
      a: '475 rpm, 398 N·m, 19.8 kW, overall efficiency 0.87.'
    },
    {
      title: 'A winch: direct drive or gearbox?',
      q: 'A winch drum of 400 mm diameter must pull 30 kN of rope at 0.3 m/s. Compare a direct-drive LSHT motor with a fast motor on a 60:1 planetary gearbox (efficiency 0.95). Use 200 bar, η_hm = 0.92 and η_v = 0.95 for both motors.',
      steps: [
        'Drum: $T = 30\\,000 \\times 0.2 = 6000$ N·m; $n = 0.3/(\\pi \\times 0.4) = 0.239$ rev/s = 14.3 rpm.',
        'Direct: $V_g = 2\\pi \\times 6000/(2\\times10^7 \\times 0.92) = 2.05$ L/rev; $Q = 2049 \\times 14.3/0.95 = 30.9$ L/min.',
        'Geared: motor torque $6000/(60 \\times 0.95) = 105$ N·m at 859 rpm; $V_g = 36$ cm³/rev; $Q = 36 \\times 859/0.95 = 32.5$ L/min.'
      ],
      a: 'A 2 L/rev LSHT motor on 31 L/min, or a 36 cm³/rev motor and 60:1 gearbox on 33 L/min — the same power either way, packaged differently.'
    }
  ],
  quiz: [
    { q: 'The back-pressure at a motor outlet rises from 5 to 30 bar while the inlet is limited to 200 bar. The maximum torque…', choices: ['is unchanged', 'falls by about 13 %', 'rises', 'falls to zero'], a: 1,
      why: 'Δp falls from 195 to 170 bar: 25/195 = 13 % less torque.' },
    { q: 'Which efficiency should size the motor of a winch that must start with its full load?', choices: ['the running hydraulic-mechanical efficiency', 'the starting (breakaway) efficiency', 'the volumetric efficiency', 'the overall efficiency'], a: 1,
      why: 'Starting from rest with full load is the hardest case, and friction is highest there.' },
    { q: 'A 250 cm³/rev motor receives 50 L/min; its volumetric efficiency is 0.94. How fast does it turn?', answer: 188, unit: 'rpm',
      why: 'n = Q η_v / V_g = 50 000 × 0.94/250 = 188 rpm.' },
    { q: 'Because of leakage, a hydraulic motor turns slower than Q/V_g.', a: true,
      why: 'Part of the flow slips past the displacing elements to the outlet or the case without doing work.' },
    { q: 'What torque does an 80 cm³/rev motor give with 210 bar across it and a hydraulic-mechanical efficiency of 0.90?', answer: 240.6, unit: 'N·m',
      why: 'T = 80×10⁻⁶ × 2.1×10⁷ × 0.9/2π = 241 N·m.' }
  ],
  problems: [
    { q: 'A motor turns at 1200 rpm with an output torque of 150 N·m. What power does it deliver?', answer: 18.85, unit: 'kW', tol: 0.02,
      steps: ['$P = 2\\pi n T = 2\\pi \\times 20 \\times 150 = 18\\,850$ W = 18.85 kW.'] }
  ],
  applications: ['Sizing winch, capstan and crane drives, including the starting case.', 'Choosing between a direct-drive LSHT motor and a fast motor with a gearbox.', 'Travel drives, where the motor torque sets the tractive force and its speed the vehicle speed.', 'Fan, conveyor and mixer drives running at a flow-controlled speed.'],
  sim: 'pm-lsht-motor'
},

{
  id: 'lsht-motors', parent: 'motors-topic', title: 'Low-speed high-torque motors', level: 2,
  short: 'Motors built to give large torque at a few revolutions per minute without a gearbox: multi-stroke radial piston (cam-ring) motors and orbital (gerotor) motors, with displacements from 50 cm³ to tens of litres per revolution.',
  keywords: ['LSHT', 'low speed high torque', 'radial piston motor', 'cam ring motor', 'multi-lobe', 'multi-stroke', 'orbital motor', 'gerotor', 'geroler', 'wheel motor', 'hub motor', 'two-speed motor', 'direct drive', 'winch'],
  prereq: ['hydraulic-motors', 'motor-torque-speed', 'piston-pumps'],
  related: ['hydrostatic-transmission', 'braking-circuits', 'load-holding', 'counterbalance-valve', 'mobile-hydraulics', 'lifts-cranes'],
  body: `
Many loads turn slowly and heavily: a winch drum at 15 rpm, a concrete mixer, a conveyor pulley, the wheel of a forestry machine, a ship's steering gear, a tunnel-boring cutter head. A fast motor needs a gearbox of 30:1 or more to drive them. A **low-speed high-torque** (LSHT) motor does it directly: its displacement is so large — hundreds of cubic centimetres to tens of litres per revolution — that a modest flow gives a few revolutions per minute and a modest pressure an enormous torque.

### Radial piston multi-lobe (cam-ring) motors
Pistons stand radially in a cylinder block, each pressing a roller against the inside of a **cam ring** shaped with $k$ lobes. A distributor valve turning with the block feeds high pressure to the pistons that are on a rising flank of the cam and connects those on a falling flank to the return. Pushed outwards against the slope, each loaded roller drives the block round, and every piston makes $k$ strokes per revolution:

$$V_g = z\\,k\\,\\frac{\\pi d^2}{4}\\,h$$

Ten pistons of 40 mm with a 20 mm stroke on a six-lobe ring give 1.51 L/rev: about 5.6 kN·m at 250 bar, and 39 rpm on 60 L/min. Because pistons on opposite sides work together, the radial forces on the bearings largely cancel. The numbers of pistons and lobes are chosen so that some pistons are always on a working flank, so the motor has no dead point and starts from any position. These motors run smoothly below 1 rpm, reach 90–95 % starting efficiency, and are built from a few hundred N·m to several hundred kN·m. Many **wheel motors** are built this way, with the housing turning as the wheel hub; **two-speed** versions switch half the pistons out to run twice as fast at half the torque. Crankshaft (single-stroke) radial piston motors, with five or so pistons working on an eccentric, are an older design still widely used.

### Orbital (gerotor) motors
A star-shaped inner rotor with $z$ teeth rolls inside an outer ring with $z + 1$ teeth or rollers. Each time the star turns once, its centre orbits $z$ times round the centre of the ring, and each orbit sweeps every chamber — a built-in reduction that packs a large displacement into a small, cheap motor: 8 to about 1000 cm³/rev, 100–250 bar, up to about 1000 rpm for the small sizes. A cardan shaft takes the drive from the wobbling star to the output. Orbital motors are everywhere on agricultural and small mobile machines — augers, sweeper brushes, small wheel drives — where a starting efficiency of 0.70–0.85 and some leakage are acceptable for the price.

### Choosing
| | Orbital | Radial piston, multi-lobe | Fast motor with gearbox |
|---|---|---|---|
| Torque | up to about 2–3 kN·m | 0.5–500 kN·m | any, through the ratio |
| Smooth down to | about 10 rpm | under 1 rpm | depends on the motor |
| Overall efficiency | 0.70–0.85 | 0.90–0.95 | 0.85–0.90 |
| Cost and size | cheapest, compact | heavy, costly | compact motor plus gearbox |

A direct drive has fewer parts, no gearbox backlash and no gear oil to change; a motor with a gearbox is lighter for the same torque and lets the motor run where it is most efficient.

> [!warn] LSHT motors drive winches, cranes and wheels — loads that store energy. A motor leaks and cannot hold a load on its own: use the spring-applied brake and counterbalance valve the design provides, and secure the load mechanically before any maintenance ([[load-holding]], [[braking-circuits]]).
`,
  ideas: [
    'LSHT motors have huge displacements, so modest flows give low speeds and modest pressures give huge torques.',
    'A multi-lobe radial piston motor strokes each piston k times per revolution: V_g = z k (πd²/4) h.',
    'Pistons and lobes are matched so that the motor has no dead point and its bearing loads cancel.',
    'Orbital motors get a built-in reduction from a star orbiting in a ring: cheap and compact, less efficient.',
    'Direct drive or fast motor plus gearbox: the same power, packaged differently.'
  ],
  pitfalls: [
    'LSHT motors are just big, slow versions of fast motors — Their geometry (many strokes per revolution, orbiting rotors) is what gives the large displacement in a compact size.',
    'A large displacement means a large flow — Flow = displacement × speed; at a few rpm a 2 L/rev motor needs only tens of litres per minute.'
  ],
  formulas: [
    {
      name: 'Multi-lobe radial piston motor displacement',
      expr: 'Vg = z*k*(pi*d^2/4)*h', tex: 'V_g = z\\,k\\,\\dfrac{\\pi d^2}{4}\\,h',
      vars: {
        Vg: { name: 'displacement', q: 'displacement', unit: 'L/rev', tex: 'V_g' },
        z: { name: 'number of pistons', int: true, value: 10, min: 2, max: 20 },
        k: { name: 'number of cam lobes (strokes per revolution)', int: true, value: 6, min: 1, max: 12 },
        d: { name: 'piston diameter', q: 'length', unit: 'mm', value: 40 },
        h: { name: 'piston stroke', q: 'length', unit: 'mm', value: 20 }
      },
      stories: {
        Vg: 'A cam-ring motor has {z} pistons of {d} with a stroke of {h} on a ring with {k} lobes. What is its displacement?',
        d: 'A cam-ring motor with {z} pistons, {k} lobes and a {h} stroke must displace {Vg}. What piston diameter does it need?'
      }
    },
    {
      name: 'Displacement for a direct drive',
      expr: 'Vg = 2*pi*F*r/(dp*eta_hm)', tex: 'V_g = \\dfrac{2\\pi\\,F\\,r}{\\Delta p\\,\\eta_{hm}}',
      vars: {
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'L/rev', tex: 'V_g' },
        F: { name: 'force at the wheel rim or rope', q: 'force', unit: 'kN', value: 8 },
        r: { name: 'wheel or drum radius', q: 'length', unit: 'm', value: 0.5 },
        dp: { name: 'pressure difference across the motor', q: 'pressure', unit: 'bar', value: 250, tex: '\\Delta p' },
        eta_hm: { name: 'hydraulic-mechanical efficiency', value: 0.93, min: 0, max: 1, tex: '\\eta_{hm}' }
      },
      note: 'Torque F·r supplied directly by the motor; use the starting efficiency if full force is needed from rest.',
      stories: {
        Vg: 'A wheel of radius {r} must push with {F}; the motor has {dp} across it and a hydraulic-mechanical efficiency of {eta_hm}. What displacement does the wheel motor need?',
        F: 'A {Vg} wheel motor on a wheel of radius {r} works at {dp} with a hydraulic-mechanical efficiency of {eta_hm}. What force can the wheel exert?'
      }
    }
  ],
  examples: [
    {
      title: 'A cam-ring motor',
      q: 'A motor has ten 40 mm pistons with a 20 mm stroke on a six-lobe cam ring. Find its displacement, its torque at 250 bar (η_hm = 0.94) and its speed on 60 L/min (η_v = 0.97).',
      steps: [
        '$V_g = 10 \\times 6 \\times \\pi (0.04)^2/4 \\times 0.02 = 1.508\\times10^{-3}$ m³ = 1.51 L/rev.',
        '$T = 1.508\\times10^{-3} \\times 2.5\\times10^7 \\times 0.94/2\\pi = 5640$ N·m.',
        '$n = 60 \\times 0.97/1.508 = 38.6$ rpm.'
      ],
      a: '1.51 L/rev, about 5.6 kN·m, 39 rpm — from a motor not much bigger than a car wheel.'
    },
    {
      title: 'Wheel motors for a forwarder',
      q: 'Each wheel of a forestry forwarder must push with 8 kN on a 0.5 m radius wheel, at 250 bar with η_hm = 0.93. What displacement is needed, and what flow per motor at 8 km/h (η_v = 0.96)?',
      steps: [
        '$V_g = 2\\pi \\times 8000 \\times 0.5/(2.5\\times10^7 \\times 0.93) = 1.08\\times10^{-3}$ m³ = 1.08 L/rev.',
        'Wheel speed: $(8/3.6)/(2\\pi \\times 0.5) = 0.707$ rev/s = 42.4 rpm.',
        'Flow: $1.081 \\times 42.4/0.96 = 47.8$ L/min per motor.'
      ],
      a: 'About 1.1 L/rev per wheel, needing roughly 48 L/min each at 8 km/h.'
    }
  ],
  quiz: [
    { q: 'A multi-lobe radial piston motor has 8 pistons and a 6-lobe cam ring. How many strokes does each piston make per revolution?', choices: ['1', '6', '8', '48'], a: 1,
      why: 'Each piston rides over every lobe once per revolution: 6 strokes. The whole motor makes 8 × 6 = 48 piston strokes per revolution.' },
    { q: 'What is the main reason to choose an LSHT motor over a fast motor and gearbox?', choices: ['higher speed', 'a direct drive with fewer parts, smooth at very low speed', 'it needs less flow for the same power', 'it needs no relief valve'], a: 1,
      why: 'The power is the same either way; the LSHT motor removes the gearbox and runs smoothly at a few rpm.' },
    { q: 'A cam-ring motor has 12 pistons of 32 mm, a 16 mm stroke and 8 lobes. What is its displacement?', answer: 1.235, unit: 'L/rev',
      why: 'V = 12 × 8 × π(0.032)²/4 × 0.016 = 1.235×10⁻³ m³.' },
    { q: 'If a cam-ring motor had exactly as many lobes as pistons, all pistons would be in the same phase, and at some positions it could not start.', a: true,
      why: 'With every piston at the top or bottom of a lobe at the same moment, no piston sits on a working flank and the starting torque is zero there. Different numbers avoid this.' },
    { q: 'Compared with a radial piston LSHT motor, an orbital motor is typically…', choices: ['more efficient and heavier', 'cheaper and more compact, with lower efficiency and starting torque', 'only for pumps', 'able to run at lower speeds'], a: 1,
      why: 'The orbiting-star geometry is cheap and compact, but its sliding contacts cost efficiency, especially at start.' }
  ],
  problems: [
    { q: 'A two-speed wheel motor of 1.2 L/rev can switch half its pistons out. What is its ideal speed on 40 L/min in the fast setting?', answer: 66.7, unit: 'rpm', tol: 0.02,
      steps: ['Fast setting: half the displacement, 0.6 L/rev.', '$n = 40/0.6 = 66.7$ rpm (at half the torque).'] }
  ],
  applications: ['Anchor, mooring and towing winches; cranes and slewing drives.', 'Wheel motors of forwarders, harvesters, sprayers and mining vehicles.', 'Conveyor drums, shredders, mixers and tunnel-boring cutter heads.', 'Orbital motors on augers, sweepers and small agricultural machines.'],
  history: 'The orbital motor was developed by the American engineer Lynn Charlson around 1960 and made hydraulic drives cheap enough for small agricultural machines. Radial piston cam-ring motors grew up in the same period for ship winches and cranes, and today reach torques of several hundred kilonewton-metres.',
  sim: 'pm-lsht-motor'
},

{
  id: 'hydrostatic-transmission', parent: 'motors-topic', title: 'Hydrostatic transmissions', level: 3,
  short: 'A pump driving a motor directly, forming a continuously variable transmission: the ratio of their displacements sets the output speed, from zero through full speed in either direction, with full torque available from standstill.',
  keywords: ['hydrostatic transmission', 'HST', 'hydrostatic drive', 'closed loop', 'open loop', 'charge pump', 'flushing valve', 'cross-port relief', 'speed ratio', 'constant torque', 'constant power', 'corner power', 'power split', 'CVT', 'travel drive', 'dynamic braking'],
  prereq: ['variable-displacement', 'motor-torque-speed', 'physics:power'],
  related: ['piston-pumps', 'lsht-motors', 'mobile-hydraulics', 'braking-circuits', 'heat-coolers', 'relief-valve', 'check-valves'],
  body: `
Connect a variable pump directly to a hydraulic motor and you have a gearbox with no gears: a **hydrostatic transmission** (HST). An engine turns the pump at a steady speed; the pump's displacement sets how much oil flows; the motor turns at whatever speed that flow allows. Swing the pump from zero to full displacement and the output goes smoothly from standstill to full speed — and, with an over-centre pump, into reverse — with full torque from rest and no clutch.

### Speed and torque ratios
All the oil from the pump, less leakage, goes through the motor, so

$$n_m = n_p\\,\\frac{V_p}{V_m}\\,\\eta_v$$

and the same pressure acts in both, so the torques are in the ratio of the displacements:

$$T_m = T_p\\,\\frac{V_m}{V_p}\\,\\eta_{hm}$$

where $\\eta_v$ and $\\eta_{hm}$ are the products of the pump's and the motor's efficiencies. A 90 cm³/rev pump at 2200 rpm driving a 110 cm³/rev motor, with $\\eta_v$ = 0.92 for the pair, turns the motor at 1656 rpm; reduce the motor to 45 cm³/rev and it turns at 4048 rpm. The ratio is **continuously variable**, set by two swash angles instead of a set of gear wheels.

### Open or closed loop
| | Open loop | Closed loop |
|---|---|---|
| Oil path | pump draws from the tank; the motor returns through a valve to the tank | motor outlet goes straight back to the pump inlet |
| Reversing | directional valve | pump swash plate over centre |
| Braking | counterbalance or brake valves | automatic: the motor pumps and the pump drives the engine |
| Extras | a large tank; simple | charge pump, check valves, cross-port reliefs, flushing valve |
| Typical use | winches, fans, cranes | vehicle travel drives, mixers, rollers |

In the closed loop a small **charge pump** on the same shaft (10–20 % of the main pump's displacement, at 20–30 bar) makes up the leakage through **check valves** into whichever line is at low pressure, keeping that side pressurised so the main pump cannot cavitate. **Cross-port relief valves** (typically 400–450 bar) protect the high-pressure side, and a **flushing valve** bleeds some hot oil from the low side to the tank through the cooler, to be replaced by cool charge oil.

### Constant torque, then constant power
A vehicle HST works in two stages. From standstill the motor sits at **full** displacement and the pump strokes up: the speed rises with the pump angle while the maximum tractive force — set by the relief pressure and the motor displacement — stays the same. This is the **constant-torque** region. Power is force × speed, so at some speed — the **corner** — the engine's power is used up. Beyond it the pump stays at full stroke and the **motor** destrokes: the speed rises further and the force falls along the hyperbola

$$F = \\frac{P\\,\\eta_t}{v}$$

— the **constant-power** region. An 8-tonne wheel loader with a 75 kW engine, a 90 cm³/rev pump and a 110–35 cm³/rev motor, a 40:1 axle ratio and 0.6 m wheels pushes with up to 44 kN at 420 bar, reaches its corner below 5 km/h and tops out near 29 km/h at minimum motor displacement — while an automatic power limiter destrokes the pump so the engine does not stall when the bucket hits the pile.

### Efficiency — and its cure
Each machine loses 6–12 % of the power, so a hydrostatic drive passes on about 0.75–0.85 of its input, against 0.90–0.95 for a mechanical gearbox. Tractors and large machines that work all day use **power-split** transmissions, which send most of the power through gears and only part through the hydrostatic unit, keeping the continuously variable ratio at a much better overall efficiency. Where control matters more than the last few per cent — rollers, harvesters, forestry machines, winches, and zero-turn mowers steered by two independent HSTs — the plain HST rules.

> [!warn] A closed-loop HST drives and holds a vehicle only while its engine runs and its loop is intact: with the engine off, a machine on a slope can roll. Apply the parking brake and chock the wheels before leaving a machine; before any work on the drive, secure the vehicle mechanically, stop and lock out the engine and release the loop pressure.
`,
  ideas: [
    'A pump driving a motor is a continuously variable transmission: n_m = n_p (V_p/V_m) η_v.',
    'Torques are in the ratio of the displacements: T_m = T_p (V_m/V_p) η_hm.',
    'Closed loops reverse and brake through the pump; a charge pump keeps the low side pressurised and replaces leakage.',
    'Up to the corner speed the force is limited by pressure (constant torque); beyond it by engine power (F = P η_t / v).',
    'HSTs trade efficiency (0.75–0.85) for control; power-split transmissions recover much of it.'
  ],
  pitfalls: [
    'An HST multiplies power like a gearbox multiplies torque — It converts it, with losses; torque is multiplied only at the expense of speed.',
    'The charge pump drives the vehicle — It only makes up leakage and keeps the low side pressurised; the main pump carries the power.',
    'A hydrostatic drive holds the vehicle when the engine stops — Without the engine the loop leaks down and the vehicle can roll; a parking brake is required.'
  ],
  formulas: [
    {
      name: 'HST output speed',
      expr: 'nm = np*Vp*eta_v/Vm', tex: 'n_m = n_p\\,\\dfrac{V_p}{V_m}\\,\\eta_v',
      vars: {
        nm: { name: 'motor speed', q: 'frequency', unit: 'rpm', tex: 'n_m' },
        np: { name: 'pump speed', q: 'frequency', unit: 'rpm', value: 2200, tex: 'n_p' },
        Vp: { name: 'pump displacement (as set)', q: 'displacement', unit: 'cm³/rev', value: 90, tex: 'V_p' },
        Vm: { name: 'motor displacement (as set)', q: 'displacement', unit: 'cm³/rev', value: 110, tex: 'V_m' },
        eta_v: { name: 'volumetric efficiency of pump and motor together', value: 0.92, min: 0, max: 1, tex: '\\eta_v' }
      },
      stories: {
        nm: 'A pump at {np} set to {Vp} drives a motor set to {Vm}; together they have a volumetric efficiency of {eta_v}. How fast does the motor turn?',
        Vm: 'A pump at {np} set to {Vp} must drive a motor at {nm} (combined η_v = {eta_v}). To what displacement must the motor be set?'
      }
    },
    {
      name: 'HST output torque',
      expr: 'Tm = Tp*Vm*eta_hm/Vp', tex: 'T_m = T_p\\,\\dfrac{V_m}{V_p}\\,\\eta_{hm}',
      vars: {
        Tm: { name: 'motor torque', q: 'torque', unit: 'N·m', tex: 'T_m' },
        Tp: { name: 'torque into the pump', q: 'torque', unit: 'N·m', value: 300, tex: 'T_p' },
        Vm: { name: 'motor displacement (as set)', q: 'displacement', unit: 'cm³/rev', value: 110, tex: 'V_m' },
        Vp: { name: 'pump displacement (as set)', q: 'displacement', unit: 'cm³/rev', value: 90, tex: 'V_p' },
        eta_hm: { name: 'hydraulic-mechanical efficiency of pump and motor together', value: 0.88, min: 0, max: 1, tex: '\\eta_{hm}' }
      },
      stories: { Tm: 'An engine puts {Tp} into a pump set to {Vp}, which drives a motor set to {Vm} (combined η_hm = {eta_hm}). What torque does the motor give?' }
    },
    {
      name: 'Tractive force at full power',
      expr: 'F = P*eta_t/v', tex: 'F = \\dfrac{P\\,\\eta_t}{v}',
      vars: {
        F: { name: 'tractive force', q: 'force', unit: 'kN' },
        P: { name: 'engine power', q: 'power', unit: 'kW', value: 75 },
        eta_t: { name: 'overall efficiency, engine to wheels', value: 0.77, min: 0, max: 1, tex: '\\eta_t' },
        v: { name: 'vehicle speed', q: 'speed', unit: 'km/h', value: 20 }
      },
      note: 'The constant-power region, beyond the corner speed; below it the force is limited by the relief pressure instead.',
      stories: {
        F: 'A {P} engine drives a vehicle through an HST with an overall efficiency of {eta_t}. What tractive force is available at {v}?',
        v: 'A {P} engine drives through an HST with an overall efficiency of {eta_t}. Up to what speed can it pull {F}?'
      }
    }
  ],
  examples: [
    {
      title: 'The wheel loader\'s corner',
      q: 'The loader of the text: motor 110 cm³/rev (η_hm 0.94) at 420 bar, axle ratio 40 (efficiency 0.95), wheels of 0.6 m radius, a 75 kW engine and an HST efficiency of 0.81. Find the maximum tractive force, the corner speed and the force at 20 km/h.',
      steps: [
        'Motor torque: $T = 110\\times10^{-6} \\times 4.2\\times10^7 \\times 0.94/2\\pi = 691$ N·m.',
        'Tractive force: $F = 691 \\times 40 \\times 0.95/0.6 = 43.8$ kN.',
        'Power at the wheels: $75 \\times 0.81 \\times 0.95 = 57.7$ kW; corner speed $57\\,700/43\\,800 = 1.32$ m/s = 4.7 km/h.',
        'At 20 km/h (5.56 m/s): $F = 57\\,700/5.56 = 10.4$ kN.'
      ],
      a: '43.8 kN up to about 4.7 km/h, then falling with speed — 10.4 kN at 20 km/h.'
    },
    {
      title: 'The speed range',
      q: 'The loader\'s pump (90 cm³/rev at 2200 rpm) drives the motor with a combined η_v of 0.92. What are the top speeds at motor displacements of 110 and 35 cm³/rev?',
      steps: [
        'At 110 cm³/rev: $n_m = 2200 \\times 90 \\times 0.92/110 = 1656$ rpm; wheel $1656/40 = 41.4$ rpm; $v = 41.4/60 \\times 2\\pi \\times 0.6 = 2.60$ m/s = 9.4 km/h.',
        'At 35 cm³/rev: $n_m = 5205$ rpm, $v = 29.4$ km/h.'
      ],
      a: 'About 9.4 km/h with the motor at full displacement and 29 km/h at minimum.'
    }
  ],
  quiz: [
    { q: 'In the constant-torque region of a vehicle HST, what is changed to go faster?', choices: ['the motor displacement is reduced', 'the pump displacement is increased, with the motor at full displacement', 'the relief pressure is raised', 'the charge pressure is raised'], a: 1,
      why: 'At full motor displacement the maximum torque is available; more pump displacement means more flow and so more speed.' },
    { q: 'Why does a closed-loop HST need a charge pump?', choices: ['to drive the vehicle at low speed', 'to replace leakage and keep the low-pressure side pressurised so the main pump does not cavitate', 'to raise the relief pressure', 'to power the brakes'], a: 1,
      why: 'Leakage leaves the closed loop through the cases; the charge pump replaces it through check valves and keeps the low side at 20–30 bar.' },
    { q: 'In a closed loop, reducing the pump displacement quickly while the vehicle rolls brakes it hydrostatically.', a: true,
      why: 'The motor, driven by the vehicle, is then pumping more than the pump accepts: pressure rises on the other line, the motor brakes and the pump drives the engine.' },
    { q: 'A pump of 75 cm³/rev at 2000 rpm drives a 150 cm³/rev motor; η_v of the pair is 0.9. What is the motor speed?', answer: 900, unit: 'rpm',
      why: 'n_m = 2000 × 75 × 0.9/150 = 900 rpm.' },
    { q: 'Beyond the corner speed, the tractive force of a vehicle HST…', choices: ['stays constant', 'falls in inverse proportion to speed', 'rises', 'drops to zero'], a: 1,
      why: 'The engine power is fully used, so F = P η_t / v.' }
  ],
  problems: [
    { q: 'An HST with an overall efficiency (engine to wheels) of 0.8 is driven by a 50 kW engine. What is the largest tractive force at 15 km/h, in the constant-power region?', answer: 9.6, unit: 'kN', tol: 0.02,
      steps: ['$v = 15/3.6 = 4.17$ m/s.', '$F = P\\eta_t/v = 50\\,000 \\times 0.8/4.17 = 9600$ N = 9.6 kN.'] }
  ],
  applications: ['Travel drives of wheel loaders, telehandlers, skid steers, rollers and harvesters.', 'Power-split continuously variable transmissions in modern tractors.', 'Concrete-mixer drum drives and winch drives with precise speed control.', 'Zero-turn mowers and tracked vehicles, steered by two independent HSTs.'],
  history: 'The first practical hydrostatic transmission was the Williams–Janney "hydraulic speed gear" of around 1906, a variable swash-plate pump driving a piston motor to train and elevate battleship guns. Hydrostatic travel drives spread to agricultural and construction machines from the 1960s, and power-split tractor transmissions from the 1990s.',
  sim: 'pm-hst'
}

);
