/* HYPER-PHYSICS · content/fluids.js — density, pressure, fluids at rest (hydrostatics,
 * Pascal, Archimedes) and in motion (continuity, Bernoulli, viscosity), surface tension.
 * Simulation: mech2-venturi in sims/mechanics-2.js. */
Hyper.add(

{
  id: 'density', parent: 'fluids', title: 'Density', level: 1,
  short: 'How much mass is packed into each cubic metre of a material: ρ = m/V. It decides what floats, what sinks and how much a volume weighs.',
  keywords: ['density', 'rho', 'mass per volume', 'kg/m³', 'g/cm³', 'specific gravity', 'relative density', 'water 4 °C', 'displacement', 'Archimedes'],
  prereq: ['weight-mass', 'math:volume'],
  related: ['buoyancy', 'hydrostatic-pressure', 'ideal-gas-law'],
  body: `
A kilogram of feathers and a kilogram of lead weigh the same, but the feathers fill a sack and the lead fits in your hand. The difference is **density**, the mass in each unit of volume:
$$\\rho = \\frac{m}{V}$$
The SI unit is kg/m³; chemists often use g/cm³, and $1\\ \\mathrm{g/cm^3} = 1000\\ \\mathrm{kg/m^3}$. Density is a property of the **material**, not of the object: cut a block in half and each half has half the mass, half the volume and the same density.

| Material | Density (kg/m³) |
|---|---|
| Air (20 °C, sea level) | 1.20 |
| Cork | about 240 |
| Pine wood | about 500 |
| Ice | 917 |
| Water (4 °C) | 1000 |
| Sea water | 1025 |
| Human body (average) | about 1010 |
| Aluminium | 2700 |
| Steel | 7850 |
| Lead | 11 340 |
| Mercury | 13 546 |
| Gold | 19 300 |

Whether something floats depends on how its density compares with the fluid's — see [[buoyancy]]. The human body, close to the density of water, floats with lungs full and sinks with them empty.

### Measuring it
Weigh the object; find its volume from its dimensions or, for an irregular shape, from the water it displaces. Archimedes is said to have tested a king's crown this way. A density test is a quick check for fakes — though not a perfect one: tungsten (19 250 kg/m³) is almost exactly as dense as gold, which is why forgers fill fake gold bars with it.

### Gases, heat and water's quirk
Liquids and solids hardly change density, but gases do: squeeze a gas or cool it and its density rises in proportion. For an ideal gas $\\rho = pM/RT$ (see [[ideal-gas-law|the ideal gas law]]), giving 1.20 kg/m³ for air at 20 °C and 0.95 kg/m³ at 100 °C — which is why hot air rises. Most liquids get denser as they cool. Water is the famous exception: it is densest at 4 °C, and ice is 9 % less dense than water. So lakes freeze from the top down, the ice floats and insulates, and the water beneath stays liquid for fish.

> [!fact] Densities span an astonishing range: about $10^{-21}\\ \\mathrm{kg/m^3}$ in interstellar space, $10^{3}$ for water, $10^{9}$ in a white dwarf and $4\\times10^{17}$ in a neutron star, where a teaspoonful would weigh a billion tonnes.

**Relative density** (specific gravity) is the ratio to the density of water: 7.85 for steel, 0.92 for ice. Being a ratio, it has no unit.
`,
  ideas: [
    'Density is mass per unit volume: ρ = m/V, in kg/m³ (1 g/cm³ = 1000 kg/m³).',
    'It belongs to the material, not the size of the object.',
    'Objects denser than a fluid sink in it; less dense ones float.',
    'Gas densities depend strongly on pressure and temperature; water is densest at 4 °C.'
  ],
  pitfalls: [
    'Heavier objects are denser — A tonne of polystyrene is far heavier than a gold ring but much less dense.',
    'Cutting an object in half halves its density — Mass and volume halve together; the ratio is unchanged.',
    'Mixing up g/cm³ and kg/m³ — Water is 1 g/cm³ = 1000 kg/m³. An answer of 1 kg/m³ for a liquid is a unit slip (it is about the density of air).'
  ],
  formulas: [
    {
      name: 'Density',
      expr: 'rho = m/V', tex: '\\rho = \\frac{m}{V}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³' },
        m: { name: 'mass', q: 'mass', unit: 'g', value: 500 },
        V: { name: 'volume', q: 'volume', unit: 'mL', value: 26 }
      },
      stories: {
        rho: 'A metal bar of mass {m} displaces {V} of water. What is its density?',
        m: 'What is the mass of {V} of a material of density {rho}?',
        V: 'What volume does {m} of a material of density {rho} occupy?'
      }
    },
    {
      name: 'Density of a gas',
      expr: 'rho = p*M/(R*T)', tex: '\\rho = \\frac{p M}{R T}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³' },
        p: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 101.325 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.97 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Ideal gas. Dry air has $M = 28.97$ g/mol, helium 4.00 g/mol.',
      stories: { rho: 'What is the density of air (M = {M}) at {T} and {p}?', T: 'At what temperature does air (M = {M}) at {p} have a density of {rho}?' }
    }
  ],
  examples: [
    {
      title: 'Is it gold?',
      q: 'A small bar of mass 500 g displaces 26.0 mL of water. What is its density? Could it be gold (19 300 kg/m³)?',
      steps: [
        '$\\rho = \\dfrac{m}{V} = \\dfrac{0.500\\ \\mathrm{kg}}{26.0\\times10^{-6}\\ \\mathrm{m^3}} = 19\\,200\\ \\mathrm{kg/m^3}$.',
        'That matches gold within the accuracy of the volume reading — and rules out lead or silver.',
        'It cannot rule out gold-plated tungsten, whose density is almost the same; assayers also check sound speed or electrical conductivity.'
      ],
      a: '19 200 kg/m³: consistent with gold.'
    },
    {
      title: 'The air in a room',
      q: 'What is the mass of the air in a room 5.0 m × 4.0 m × 2.5 m at 20 °C?',
      steps: ['Volume $V = 50\\ \\mathrm{m^3}$.', '$m = \\rho V = 1.20 \\times 50 = 60\\ \\mathrm{kg}$ — about as much as an adult.'],
      a: 'About 60 kg.'
    }
  ],
  quiz: [
    { q: 'A steel block is cut into two unequal pieces. The density of the smaller piece is…', choices: ['smaller', 'larger', 'the same', 'impossible to say'], a: 2, why: 'Density is a property of the material; both mass and volume scale with the piece.' },
    { q: 'Which occupies the larger volume: 1 kg of lead or 1 kg of water?', choices: ['The lead', 'The water', 'Both the same', 'It depends on the temperature only'], a: 1,
      why: 'Same mass, and water is 11 times less dense, so it takes up 11 times the volume (1 L against about 0.09 L).' },
    { q: 'Ice floats on water because…', choices: ['it contains air bubbles', 'ice is less dense than liquid water', 'it is colder', 'surface tension holds it up'], a: 1,
      why: 'Water expands by about 9 % when it freezes, so ice (917 kg/m³) is less dense than water (1000 kg/m³). Even bubble-free ice floats.' },
    { q: 'Heating air at constant pressure from 20 °C to 100 °C lowers its density by about 21 %.', a: true,
      why: 'ρ ∝ 1/T in kelvin: 293/373 = 0.79. That density drop is what lifts a hot-air balloon.' }
  ],
  applications: ['Identifying materials and checking purity (hydrometers for battery acid, milk and wine).', 'Designing ships, submarines and balloons (see buoyancy).', 'Mineral and oil exploration using density differences in rock.']
},

{
  id: 'pressure', parent: 'fluids', title: 'Pressure', level: 1,
  short: 'Force spread over an area: p = F/A. The same push hurts from a needle and not from a palm, and the air presses on everything with about 100 000 newtons per square metre.',
  keywords: ['pressure', 'pascal', 'Pa', 'force per area', 'atmospheric pressure', 'atm', 'bar', 'psi', 'mmHg', 'gauge pressure', 'absolute pressure', 'Magdeburg'],
  prereq: ['force', 'math:area'],
  related: ['hydrostatic-pressure', 'kinetic-theory-gases', 'stress-strain'],
  body: `
Press on a drawing pin: the flat head does not hurt your thumb, while the point goes into the wood. The force is the same at both ends; what differs is the **area** it is spread over. **Pressure** measures that:
$$p = \\frac{F}{A}$$
where $F$ is the force perpendicular to the surface. The SI unit is the **pascal**, $1\\ \\mathrm{Pa} = 1\\ \\mathrm{N/m^2}$ — a small unit: a sheet of paper resting on a table presses with about 1 Pa.

### Spreading and concentrating
- **Spread the force** to lower the pressure: snowshoes, the wide tracks of a tractor, the padded feet of camels, a bed of nails (hundreds of points share the weight).
- **Concentrate it** to raise the pressure: knives, needles, nails, ice skates. A 60 kg person balancing on one stiletto heel of 1 cm² exerts about 6 MPa on the floor — sixty times more than an elephant standing on four feet (about 0.1 MPa), which is why such heels dent wooden floors.

### Pressure in fluids
In a fluid at rest pressure pushes **equally in all directions** and always perpendicular to any surface it touches. It is a scalar — it has no direction of its own; the force it exerts on a surface points along the surface's normal. In a gas it comes from countless molecules bouncing off the walls ([[kinetic-theory-gases|kinetic theory]]); in a liquid, from the weight of the liquid above (see [[hydrostatic-pressure|pressure in a fluid at rest]]).

### The atmosphere
The air above us weighs down on everything with a pressure of about
$$p_0 = 101\\,325\\ \\mathrm{Pa} = 1\\ \\mathrm{atm} = 1.013\\ \\mathrm{bar} = 760\\ \\mathrm{mmHg} = 14.7\\ \\mathrm{psi}$$
That is 10 tonnes-force on every square metre. We do not notice because it presses from all sides — under the table as well as on top, inside our bodies as well as outside. Remove the air from one side and the force is revealed: in 1654 Otto von Guericke pumped the air out of two joined copper hemispheres, and teams of horses could not pull them apart. Two hemispheres 50 cm across need almost 20 kN to separate.

### Gauge and absolute pressure
Most gauges read the pressure **above** atmospheric. A tyre at "2.2 bar" holds 2.2 bar more than the outside air — about 3.2 bar absolute. Gauge pressure can be negative (a partial vacuum); absolute pressure never is.

| Unit | In pascals |
|---|---|
| 1 hPa (= 1 mbar, weather maps) | 100 |
| 1 kPa | 1000 |
| 1 mmHg (blood pressure) | 133.3 |
| 1 psi | 6895 |
| 1 bar | 100 000 |
| 1 atm | 101 325 |
`,
  ideas: [
    'Pressure is force per unit area, p = F/A, in pascals (N/m²).',
    'The same force gives a large pressure on a small area and a small pressure on a large area.',
    'In a fluid at rest pressure acts equally in all directions and perpendicular to every surface.',
    'Atmospheric pressure is about 101 kPa; gauges usually show pressure above atmospheric.'
  ],
  pitfalls: [
    'Pressure and force are the same thing — Pressure is force per area. A large force can mean a small pressure if the area is large.',
    'Pressure pushes downwards only — In a fluid it pushes equally in every direction: sideways on a dam, upwards on the bottom of a boat.',
    'A tyre gauge shows the total pressure in the tyre — It shows gauge pressure; add about 1 bar for the absolute pressure.'
  ],
  formulas: [
    {
      name: 'Pressure',
      expr: 'p = F/A', tex: 'p = \\frac{F}{A}',
      vars: {
        p: { name: 'pressure', q: 'pressure', unit: 'kPa' },
        F: { name: 'force perpendicular to the surface', q: 'force', unit: 'N', value: 588.6 },
        A: { name: 'area', q: 'area', unit: 'cm²', value: 1 }
      },
      stories: {
        p: 'A person weighing {F} balances on a heel of area {A}. What pressure does it put on the floor?',
        F: 'The air presses at {p}. What force does it exert on an area of {A}?',
        A: 'A floor can take at most {p}. Over what area must a load of {F} be spread?'
      }
    },
    {
      name: 'Absolute and gauge pressure',
      expr: 'pabs = pg + p0', tex: 'p_{\\text{abs}} = p_g + p_0',
      vars: {
        pabs: { name: 'absolute pressure', q: 'pressure', unit: 'bar', tex: 'p_{\\text{abs}}' },
        pg: { name: 'gauge pressure', q: 'pressure', unit: 'bar', value: 2.2, signed: true, tex: 'p_g' },
        p0: { const: 'atm', name: 'atmospheric pressure' }
      },
      stories: { pabs: 'A tyre gauge reads {pg}. What is the absolute pressure in the tyre?', pg: 'A tank holds gas at an absolute pressure of {pabs}. What would a gauge read?' }
    }
  ],
  examples: [
    {
      title: 'Heel against elephant',
      q: 'Compare the pressure under a 60 kg person standing on one stiletto heel of area 1.0 cm² with that under a 5000 kg elephant standing on four feet, each 40 cm across.',
      steps: [
        'Heel: $p = \\dfrac{60 \\times 9.81}{1.0\\times10^{-4}} = 5.9\\times10^{6}\\ \\mathrm{Pa}$.',
        'Elephant: each foot has area $\\pi(0.20)^2 = 0.126\\ \\mathrm{m^2}$, four feet $0.503\\ \\mathrm{m^2}$; $p = \\dfrac{5000 \\times 9.81}{0.503} = 9.8\\times10^{4}\\ \\mathrm{Pa}$.',
        'The heel presses about 60 times harder on the floor.'
      ],
      a: 'About 5.9 MPa against 0.1 MPa.'
    },
    {
      title: 'The Magdeburg hemispheres',
      q: 'Two hemispheres of radius 25 cm are joined and the air inside is pumped out completely. What force is needed to pull them apart?',
      steps: [
        'The outside air pushes on the projected circle of area $\\pi r^2 = \\pi(0.25)^2 = 0.196\\ \\mathrm{m^2}$.',
        '$F = p_0 A = 101\\,325 \\times 0.196 = 1.99\\times10^{4}\\ \\mathrm{N}$ — the weight of two tonnes.'
      ],
      a: 'About 20 kN.'
    }
  ],
  quiz: [
    { q: 'The same force is applied through a flat thumb (1 cm²) and through a needle point (0.01 mm²). The pressure under the needle is…', choices: ['the same', '100 times larger', '10 000 times larger', '100 times smaller'], a: 2, why: '1 cm² = 100 mm², which is 10 000 times 0.01 mm². Same force, 10 000 times smaller area.' },
    { q: 'Pressure is a vector pointing downwards.', a: false,
      why: 'Pressure is a scalar. The force it produces on a surface points perpendicular to that surface, whichever way the surface faces.' },
    { q: 'Why does the atmosphere not crush a cardboard box?', choices: ['The air is too light to matter', 'Air inside the box pushes outwards just as hard as the air outside pushes in', 'Cardboard is very strong', 'Atmospheric pressure only acts on liquids'], a: 1,
      why: 'The forces from the air on both sides of each wall balance. Pump the air out of a can and it is crushed at once.' },
    { q: 'A tyre gauge reads 2.0 bar. The absolute pressure in the tyre is about…', choices: ['1.0 bar', '2.0 bar', '3.0 bar', '0.0 bar'], a: 2, why: 'Gauges read pressure above atmospheric; add about 1 bar.' }
  ],
  applications: ['Snowshoes, tank tracks and foundations spread loads; blades and needles concentrate them.', 'Weather maps (hPa), blood pressure (mmHg) and tyre pressures (bar or psi).', 'Vacuum lifting, suction cups and the vacuum packing of food.']
},

{
  id: 'hydrostatic-pressure', parent: 'fluids', title: 'Pressure in a fluid at rest', level: 1,
  short: 'Pressure in a liquid grows with depth, p = p₀ + ρgh, because of the weight of the fluid above. Only depth matters, not the shape of the container.',
  keywords: ['hydrostatic pressure', 'pressure and depth', 'rho g h', 'barometer', 'manometer', 'diving', 'dam', 'hydrostatic paradox', 'communicating vessels', 'water pressure'],
  prereq: ['pressure', 'density', 'weight-mass'],
  related: ['pascals-principle', 'buoyancy', 'bernoullis-equation'],
  body: `
Dive to the bottom of a pool and your ears hurt: the water above is pressing down. Every layer of a fluid must hold up the weight of all the fluid above it, so pressure grows steadily with depth.

### The formula
Picture a column of liquid of cross-section $A$ and height $h$. Its weight, $\\rho g h A$, rests on its base, adding $\\rho g h A / A = \\rho g h$ to the pressure. With the pressure $p_0$ at the surface (usually the atmosphere):
$$p = p_0 + \\rho g h$$
For fresh water $\\rho g$ is about 9.8 kPa per metre: **every 10 m of water adds roughly one atmosphere**. A diver at 30 m in the sea feels about 4 atm; at the bottom of the Mariana Trench (11 km) the pressure is over 1000 atm.

### Only depth matters
The pressure at a given depth does not depend on the shape or width of the container — the **hydrostatic paradox**. A narrow tube and a wide tank filled to the same height have the same pressure at the bottom. Pascal is said to have demonstrated it by bursting a barrel with a long, thin water-filled pipe: a few litres in a tall pipe did what a lake of the same depth would do. Connected vessels open to the air fill to the **same level**, whatever their shapes — the principle behind a spirit level with water tubes, and why water towers work.

### Consequences
- **Dams** are thicker at the bottom, where the pressure is greatest. The total push on a vertical wall of width $w$ holding water to depth $H$ grows as $H^2$: $F = \\tfrac12\\rho g H^2 w$.
- **Blood pressure** in your feet, while standing, is higher than in your head by $\\rho g h \\approx 1060 \\times 9.81 \\times 1.7 \\approx 18\\ \\mathrm{kPa}$, about 130 mmHg. That is why blood pressure is measured on the upper arm, level with the heart.
- **Snorkels** are kept short, about 35–40 cm: from deeper down your chest muscles would have to breathe in against the water pressure on your chest, and the stale air left in a long tube would grow.

### Barometers
Turn a tube of mercury upside down in a dish and it sinks until the column is supported by the atmosphere's pressure on the dish: $p_0 = \\rho g h$, giving $h = 760\\ \\mathrm{mm}$ (Torricelli, 1643). With water the column would be 10.3 m tall — which is why a suction pump at the top of a well can never lift water more than about 10 m. A **manometer**, a U-tube of liquid, measures a pressure difference by the difference in liquid levels.

> [!note] $p = p_0 + \\rho g h$ assumes constant density — fine for liquids. Air is compressible, so atmospheric pressure falls off roughly exponentially instead, halving about every 5.5 km of height.

Pressure differences with depth are also the origin of [[buoyancy]]; together with speed and height they appear in [[bernoullis-equation|Bernoulli's equation]].
`,
  ideas: [
    'Pressure in a fluid grows with depth: p = p₀ + ρgh.',
    'In water, each 10 m of depth adds about 1 atmosphere.',
    'At a given depth the pressure is the same everywhere in a connected fluid, whatever the container\'s shape.',
    'A barometer balances the atmosphere against a liquid column: 760 mm of mercury or 10.3 m of water.'
  ],
  pitfalls: [
    'A wide lake presses harder on a dam than a narrow reservoir of the same depth — Only the depth sets the pressure; a wide lake and a narrow one of equal depth push equally on each square metre of dam.',
    'The pressure at the bottom of a container depends on the weight of all the liquid in it — It depends only on the depth; the sloping walls of an odd-shaped container carry part of the weight.',
    'Pressure only acts on the bottom of a container — At any depth it acts equally in all directions, including sideways on the walls.'
  ],
  formulas: [
    {
      name: 'Pressure at a depth',
      expr: 'p = p0 + rho*g*h', tex: 'p = p_0 + \\rho g h',
      vars: {
        p: { name: 'absolute pressure at depth h', q: 'pressure', unit: 'kPa' },
        p0: { name: 'pressure at the surface', q: 'pressure', unit: 'kPa', value: 101.325 },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1025 },
        g: { const: 'g' },
        h: { name: 'depth', q: 'length', unit: 'm', value: 30 }
      },
      stories: {
        p: 'A diver is {h} down in sea water ({rho}) with {p0} at the surface. What is the pressure on her?',
        h: 'A submarine hull can withstand {p}. How deep can it dive in water of density {rho} (surface pressure {p0})?'
      }
    },
    {
      name: 'Height of a barometer or manometer column',
      expr: 'h = p/(rho*g)', tex: 'h = \\frac{p}{\\rho g}',
      vars: {
        h: { name: 'column height', q: 'length', unit: 'mm' },
        p: { name: 'pressure supported', q: 'pressure', unit: 'Pa', value: 101325 },
        rho: { name: 'density of the liquid (mercury at 0 °C: 13 595)', q: 'density', unit: 'kg/m³', value: 13595 },
        g: { const: 'g' }
      },
      stories: { h: 'How tall a column of liquid of density {rho} can a pressure of {p} support?', p: 'A manometer column of liquid ({rho}) stands {h} high. What pressure difference does it show?' }
    },
    {
      name: 'Total force on a vertical wall',
      expr: 'F = 0.5*rho*g*H^2*w', tex: 'F = \\tfrac12 \\rho g H^2 w',
      vars: {
        F: { name: 'total force of the water (above atmospheric)', q: 'force', unit: 'MN' },
        rho: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        H: { name: 'depth of water against the wall', q: 'length', unit: 'm', value: 10 },
        w: { name: 'width of the wall', q: 'length', unit: 'm', value: 20 }
      },
      stories: { F: 'A lock gate {w} wide holds back water {H} deep. What total force does the water exert on it?' }
    }
  ],
  examples: [
    {
      title: 'A dive to 30 m',
      q: 'What is the absolute pressure on a diver 30 m below the surface of the sea (ρ = 1025 kg/m³)? How many atmospheres is that?',
      steps: [
        '$\\rho g h = 1025 \\times 9.81 \\times 30 = 3.02\\times10^{5}\\ \\mathrm{Pa} = 302\\ \\mathrm{kPa}$.',
        '$p = 101 + 302 = 403\\ \\mathrm{kPa}$.',
        'In atmospheres: $403/101.3 = 4.0$. The air in the diver\'s lungs is compressed to a quarter of its surface volume unless she breathes pressurised air.'
      ],
      a: '403 kPa, about 4 atm.'
    },
    {
      title: 'A water barometer',
      q: 'How tall must a water barometer be to balance the standard atmosphere?',
      steps: ['$h = \\dfrac{p_0}{\\rho g} = \\dfrac{101\\,325}{1000 \\times 9.81} = 10.3\\ \\mathrm{m}$.', 'Mercury, 13.5 times denser, needs only 760 mm — the reason it was chosen.'],
      a: '10.3 m'
    }
  ],
  quiz: [
    { q: 'Three containers — a narrow tube, a wide tank and a vase flaring outwards — are filled with water to the same height. The pressure at the bottom is…', choices: ['greatest in the wide tank', 'greatest in the vase', 'the same in all three', 'greatest in the narrow tube'], a: 2,
      why: 'Hydrostatic pressure depends only on depth (and the liquid\'s density), not on the container\'s shape.' },
    { q: 'At what depth in fresh water is the absolute pressure twice atmospheric?', choices: ['1 m', 'about 10 m', 'about 100 m', '760 mm'], a: 1, why: 'ρgh = p₀ gives h = 101 325/(1000 × 9.81) ≈ 10.3 m.' },
    { q: 'Doubling the depth of water behind a dam doubles the total force on it.', a: false,
      why: 'Both the average pressure and the wetted area double, so the force F = ½ρgH²w quadruples.' },
    { q: 'Why can a suction pump at the top of a well not raise water more than about 10 m?', choices: ['The pipe would burst', 'Atmospheric pressure can only push water up about 10 m into a vacuum', 'Water becomes too heavy to suck', 'Friction in the pipe'], a: 1,
      why: 'Suction only removes air; the atmosphere pushes the water up, and 101 kPa balances at most 10.3 m of water.' }
  ],
  applications: ['Dams, water towers and the design of submarines and diving equipment.', 'Barometers for weather, altimeters for aircraft, manometers in labs and hospitals.', 'Measuring the level of liquid in a tank from the pressure at its bottom.']
},

{
  id: 'pascals-principle', parent: 'fluids', title: 'Pascal\'s principle', level: 1,
  short: 'Pressure applied to an enclosed liquid reaches every part of it undiminished. A small push on a small piston becomes a large force on a large one: the hydraulic press.',
  keywords: ['Pascal\'s principle', 'Pascal\'s law', 'hydraulics', 'hydraulic press', 'hydraulic lift', 'car jack', 'brakes', 'force multiplier', 'piston'],
  prereq: ['hydrostatic-pressure', 'pressure', 'work'],
  related: ['efficiency', 'shear-bulk-modulus'],
  body: `
Squeeze a toothpaste tube anywhere and paste comes out of the nozzle. Press on one part of an enclosed liquid and the extra pressure turns up everywhere else. Blaise Pascal stated it around 1650:

> [!key] A change in pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid and to the walls of its container.

It works because liquids are almost incompressible: they cannot "soak up" a push by squashing. (Differences due to height, $\\rho g h$, still add on top, as in [[hydrostatic-pressure|any fluid at rest]].)

### The hydraulic press
Connect a small piston of area $A_1$ and a large one of area $A_2$ with oil. Push the small one with force $F_1$: the pressure $F_1/A_1$ appears under the large piston too, which is pushed up with
$$F_2 = F_1\\,\\frac{A_2}{A_1}$$
With circular pistons the ratio of areas is the ratio of diameters **squared**: a piston ten times wider gives a hundred times the force. A garage lift with pistons of 2 cm and 25 cm diameter multiplies force by 156: a push of 94 N lifts a 1500 kg car.

### Nothing for free
The liquid's volume does not change, so what leaves the small cylinder enters the large one: $A_1 d_1 = A_2 d_2$. To raise the car by 10 cm, the small piston must travel 15.6 m in total — which is why car jacks are pumped with many short strokes and a valve. The work in, $F_1 d_1$, equals the work out, $F_2 d_2$ (less friction). Hydraulics is a lever made of liquid: it trades distance for force, never energy.

### Where it is used
- **Brakes.** The pedal pushes a small master-cylinder piston; the pressure travels along thin pipes to wider pistons at each wheel, pressing the pads with many times the force. Air bubbles in the brake fluid spoil this — gas is compressible, so the pedal goes "spongy".
- **Heavy machinery.** Excavators, aircraft control surfaces, presses that forge car panels and lifts in buildings all move with oil under pressures of 100–350 bar.
- **Pascal's barrel.** A tall thin pipe on a barrel full of water: filling the pipe raises the pressure everywhere inside the barrel by $\\rho g h$, and the barrel bursts.

> [!tip] Solids pass on **forces** (push a stick and the far end pushes); liquids pass on **pressure** (push a piston and every wall feels the same extra pressure, whatever its size or direction).
`,
  ideas: [
    'Extra pressure applied to an enclosed liquid reaches every part of it unchanged.',
    'A hydraulic press multiplies force by the ratio of piston areas: F₂ = F₁A₂/A₁.',
    'The large piston moves a smaller distance, in the inverse ratio: work out equals work in.',
    'Gas bubbles spoil hydraulics because gas is compressible.'
  ],
  pitfalls: [
    'A hydraulic press creates energy by multiplying force — It multiplies force but divides distance by the same factor; the work done is the same.',
    'The force doubles when the piston diameter doubles — The area, and so the force, grows with the diameter squared: four times.',
    'The pressure is larger under the large piston because the force there is larger — The pressure is the same (at the same height); the large piston simply has more area for it to act on.'
  ],
  formulas: [
    {
      name: 'Hydraulic press',
      expr: 'F2 = F1*A2/A1', tex: 'F_2 = F_1\\,\\frac{A_2}{A_1}',
      vars: {
        F2: { name: 'force on the large piston', q: 'force', unit: 'kN' },
        F1: { name: 'force on the small piston', q: 'force', unit: 'N', value: 100 },
        A2: { name: 'area of the large piston', q: 'area', unit: 'cm²', value: 491 },
        A1: { name: 'area of the small piston', q: 'area', unit: 'cm²', value: 3.14 }
      },
      stories: { F2: 'A force of {F1} is applied to a piston of area {A1}. What force acts on the connected piston of area {A2}?', F1: 'To lift a load of {F2} on a piston of area {A2}, what force is needed on a piston of area {A1}?' }
    },
    {
      name: 'Hydraulic press with piston diameters',
      expr: 'F2 = F1*(d2/d1)^2', tex: 'F_2 = F_1\\left(\\frac{d_2}{d_1}\\right)^2',
      vars: {
        F2: { name: 'force on the large piston', q: 'force', unit: 'N' },
        F1: { name: 'force on the small piston', q: 'force', unit: 'N', value: 94 },
        d2: { name: 'diameter of the large piston', q: 'length', unit: 'cm', value: 25 },
        d1: { name: 'diameter of the small piston', q: 'length', unit: 'cm', value: 2 }
      },
      stories: { F1: 'A car lift has pistons of {d1} and {d2} diameter. What force on the small piston holds up a load of {F2}?', d2: 'A {F1} push must hold up {F2}. If the small piston is {d1} across, how wide must the large one be?' }
    },
    {
      name: 'Distances moved by the pistons',
      expr: 'd1*A1 = d2*A2', tex: 's_1 A_1 = s_2 A_2', solveFor: 'd1',
      vars: {
        d1: { name: 'distance moved by the small piston', q: 'length', unit: 'm', tex: 's_1' },
        A1: { name: 'area of the small piston', q: 'area', unit: 'cm²', value: 3.14 },
        d2: { name: 'distance moved by the large piston', q: 'length', unit: 'cm', value: 10, tex: 's_2' },
        A2: { name: 'area of the large piston', q: 'area', unit: 'cm²', value: 491 }
      },
      stories: { d1: 'The large piston (area {A2}) of a lift must rise {d2}. How far in total must the small piston (area {A1}) be pushed?' }
    }
  ],
  examples: [
    {
      title: 'A garage lift',
      q: 'A lift has a small piston 2.0 cm and a large piston 25 cm in diameter. What force on the small piston holds a 1500 kg car? How far must the small piston move, in total, to raise the car by 10 cm?',
      steps: [
        'Area ratio $(25/2.0)^2 = 156$.',
        'Car\'s weight $1500 \\times 9.81 = 14\\,700\\ \\mathrm{N}$, so $F_1 = 14\\,700/156 = 94\\ \\mathrm{N}$ — the weight of under 10 kg.',
        'Volume moved is the same: the small piston travels $156 \\times 0.10 = 15.6\\ \\mathrm{m}$, in many strokes.',
        'Check the work: $94 \\times 15.6 = 1470\\ \\mathrm{J} = 14\\,700 \\times 0.10$. ✓'
      ],
      a: '94 N; 15.6 m of piston travel.'
    }
  ],
  quiz: [
    { q: 'In a hydraulic press the large piston has 50 times the area of the small one. If the small piston is pushed down 1 m, the large piston rises…', choices: ['50 m', '1 m', '2 cm', '1 mm'], a: 2, why: 'Volume is conserved: 1 m ÷ 50 = 0.02 m. Force ×50, distance ÷50.' },
    { q: 'The small and large pistons are at the same height. The pressure under the large piston is…', choices: ['larger', 'smaller', 'the same', 'zero'], a: 2, why: 'Pascal\'s principle: the pressure is transmitted undiminished. Only the force is larger, because the area is.' },
    { q: 'Why do brakes feel spongy when there is air in the brake fluid?', choices: ['Air makes the fluid hotter', 'Air is compressible, so pushing the pedal squashes the bubbles instead of moving the pads', 'Air is lighter than the fluid', 'Air lowers the pressure everywhere'], a: 1,
      why: 'Hydraulics relies on an incompressible liquid. A gas bubble shrinks under pressure, so the pedal travels without the pressure building.' },
    { q: 'A hydraulic jack lets you lift a car with less work than lifting it directly.', a: false, why: 'It lets you use less force, over a longer distance. The work (force × distance) is the same, or more with friction.' }
  ],
  applications: ['Car brakes, jacks and garage lifts.', 'Excavators, cranes, aircraft flight controls and industrial presses.', 'Hydraulic lifts in buildings and dentist\'s and barber\'s chairs.']
},

{
  id: 'buoyancy', parent: 'fluids', title: 'Buoyancy and Archimedes\' principle', level: 1,
  short: 'A fluid pushes up on anything immersed in it with a force equal to the weight of the fluid displaced. Whether it floats depends on its average density.',
  keywords: ['buoyancy', 'upthrust', 'Archimedes\' principle', 'floating', 'sinking', 'displacement', 'iceberg', 'ship', 'submarine', 'hot-air balloon', 'apparent weight', 'Plimsoll line'],
  prereq: ['hydrostatic-pressure', 'density', 'newtons-first-law'],
  related: ['pressure', 'free-body-diagrams', 'ideal-gas-law'],
  body: `
Lift a friend in a swimming pool and she seems to weigh almost nothing. Push a beach ball under water and it fights back. Water — any fluid — pushes up on whatever is in it. That upward push is the **buoyant force** (or upthrust).

### Where it comes from
Pressure grows with depth ([[hydrostatic-pressure|p = p₀ + ρgh]]). For a submerged block, the water presses down on its top and up on its bottom, and the bottom is deeper: the upward push wins. For a block of height $h$ and top area $A$ the difference is $\\rho_f g h A = \\rho_f g V$. The sideways pushes cancel. The result holds for any shape:

> [!key] **Archimedes' principle.** The buoyant force on a body immersed in a fluid equals the weight of the fluid it displaces: $F_b = \\rho_\\text{fluid}\\, V_\\text{displaced}\\, g$.

One way to see it: replace the body by a blob of the fluid itself with the same shape. That blob floats in equilibrium, so the surrounding fluid must push it up with exactly its weight. The body in its place gets the same push.

### Sink or float?
Compare the buoyant force with the weight $\\rho_\\text{obj} V g$ of a fully submerged body:
- $\\rho_\\text{obj} > \\rho_\\text{fluid}$: weight wins, it **sinks** (a stone);
- $\\rho_\\text{obj} < \\rho_\\text{fluid}$: buoyancy wins, it **rises** and floats at the surface;
- equal: it hovers at any depth — **neutral buoyancy**, what fish achieve with a swim bladder and divers with a buoyancy jacket.

What counts is the **average** density of the whole object, including any air inside. A steel ship floats because its hull encloses a large volume of air, bringing its average density well below that of water.

### How deep it floats
A floating body sinks until the water it displaces weighs as much as it does, $\\rho_f V_\\text{sub} = \\rho_\\text{obj} V$, so the fraction below the surface is
$$\\frac{V_\\text{sub}}{V} = \\frac{\\rho_\\text{obj}}{\\rho_\\text{fluid}}$$
Ice (917 kg/m³) in sea water (1025 kg/m³): 89 % hidden — "the tip of the iceberg". In the Dead Sea (about 1240 kg/m³) a swimmer floats high with no effort. A loaded ship sits deeper than an empty one, and deeper in fresh water than in the sea; the Plimsoll line on its hull marks the safe limits.

### Weighing things in water
A body hung in a liquid seems lighter by the buoyant force: its **apparent weight** is $W - \\rho_f V g$. Weigh it in air and in water, and the difference gives its volume — Archimedes' test of the king's crown, and today's method for measuring body fat.

### Balloons
Air is a fluid too. A hot-air balloon displaces cool air (1.20 kg/m³ at 20 °C) with hot air (0.95 kg/m³ at 100 °C): each cubic metre gives about 0.26 kg of lift, so a 2800 m³ envelope lifts about 700 kg. Helium (0.17 kg/m³) gives about 1 kg per cubic metre.
`,
  ideas: [
    'The buoyant force equals the weight of the fluid displaced: F_b = ρ_fluid V g.',
    'It arises because pressure is greater on the bottom of a body than on its top.',
    'A body sinks, floats or hovers as its average density is greater than, less than or equal to the fluid\'s.',
    'A floating body has a fraction ρ_object/ρ_fluid of its volume submerged.'
  ],
  pitfalls: [
    'Heavy objects sink and light ones float — What matters is the average density. A 100 000-tonne steel ship floats; a small pebble sinks.',
    'The buoyant force depends on the weight of the object — It depends only on the volume displaced and the fluid\'s density. A lead block and an aluminium block of the same size feel the same upthrust.',
    'A submerged object feels more buoyancy the deeper it goes — Once fully under, the displaced volume is fixed, so the upthrust stays the same (water barely compresses).'
  ],
  formulas: [
    {
      name: 'Buoyant force (Archimedes\' principle)',
      expr: 'Fb = rho*V*g', tex: 'F_b = \\rho_f V g',
      vars: {
        Fb: { name: 'buoyant force', q: 'force', unit: 'N', tex: 'F_b' },
        rho: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_f' },
        V: { name: 'volume of fluid displaced', q: 'volume', unit: 'L', value: 60 },
        g: { const: 'g' }
      },
      stories: { Fb: 'A body of volume {V} is fully submerged in a fluid of density {rho}. What upward force does the fluid exert?', V: 'An object feels an upthrust of {Fb} when fully under a liquid of density {rho}. What is its volume?' }
    },
    {
      name: 'Fraction of a floating body below the surface',
      expr: 'f = rhoo/rhof', tex: 'f_{\\text{sub}} = \\frac{\\rho_o}{\\rho_f}',
      vars: {
        f: { name: 'fraction of the volume submerged, V_sub/V', q: 'ratio', unit: '%', tex: 'f_{\\text{sub}}' },
        rhoo: { name: 'average density of the body', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho_o' },
        rhof: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho_f' }
      },
      note: 'Valid only while the body floats ($\\rho_o < \\rho_f$).',
      stories: { f: 'What fraction of an iceberg ({rhoo}) floats below the surface of sea water ({rhof})?', rhoo: 'A log floats with {f} of its volume under water ({rhof}). What is its density?' }
    },
    {
      name: 'Apparent weight when submerged',
      expr: 'W = (rhoo - rhof)*V*g', tex: 'W_{\\text{app}} = (\\rho_o - \\rho_f)\\, V g',
      vars: {
        W: { name: 'apparent weight (negative: it floats up)', q: 'force', unit: 'N', signed: true, tex: 'W_{\\text{app}}' },
        rhoo: { name: 'density of the body', q: 'density', unit: 'kg/m³', value: 2700, tex: '\\rho_o' },
        rhof: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_f' },
        V: { name: 'volume of the body', q: 'volume', unit: 'L', value: 2 },
        g: { const: 'g' }
      },
      stories: { W: 'A {V} block of density {rhoo} hangs fully submerged in a liquid of density {rhof}. What does a spring balance read?', rhoo: 'A {V} body weighs {W} when hung under a liquid of density {rhof}. What is its density?' }
    },
    {
      name: 'Lift of a balloon',
      expr: 'm = (rhoa - rhog)*V', tex: 'm = (\\rho_a - \\rho_g)\\, V',
      vars: {
        m: { name: 'mass that can be lifted (envelope, basket and load)', q: 'mass', unit: 'kg' },
        rhoa: { name: 'density of the surrounding air', q: 'density', unit: 'kg/m³', value: 1.204, tex: '\\rho_a' },
        rhog: { name: 'density of the gas inside', q: 'density', unit: 'kg/m³', value: 0.946, tex: '\\rho_g' },
        V: { name: 'volume of the envelope', q: 'volume', unit: 'm³', value: 2800 }
      },
      stories: { m: 'A {V} hot-air balloon holds air of density {rhog} in surroundings of density {rhoa}. How much mass can it lift?', V: 'What volume of helium ({rhog}) in air ({rhoa}) lifts {m}?' }
    }
  ],
  examples: [
    {
      title: 'The king\'s crown',
      q: 'A crown weighs 9.81 N in air and 9.22 N when hung completely under water. Find its volume and density. Is it pure gold (19 300 kg/m³)?',
      steps: [
        'Buoyant force $= 9.81 - 9.22 = 0.59\\ \\mathrm{N} = \\rho_w V g$, so $V = \\dfrac{0.59}{1000 \\times 9.81} = 6.0\\times10^{-5}\\ \\mathrm{m^3} = 60\\ \\mathrm{cm^3}$.',
        'Its mass is $9.81/9.81 = 1.00\\ \\mathrm{kg}$, so $\\rho = 1.00/6.0\\times10^{-5} = 16\\,600\\ \\mathrm{kg/m^3}$.',
        'Too low for gold: some lighter metal, such as silver, has been mixed in.'
      ],
      a: '60 cm³; 16 600 kg/m³ — not pure gold.'
    },
    {
      title: 'The tip of the iceberg',
      q: 'What fraction of an iceberg is below the water, in sea water and in fresh water?',
      steps: ['Sea water: $917/1025 = 0.89$ — 89 % hidden, 11 % showing.', 'Fresh water: $917/1000 = 0.92$ — only 8 % shows.'],
      a: '89 % in the sea, 92 % in fresh water.'
    }
  ],
  quiz: [
    { q: 'You sit in a boat on a small pond holding a heavy rock. You drop the rock over the side. The water level of the pond…', choices: ['rises', 'falls', 'stays the same', 'first rises, then falls'], a: 1,
      why: 'In the boat the rock displaces its weight of water (a large volume, since rock is dense). On the bottom it displaces only its own volume, which is less. So the level falls.' },
    { q: 'An ice cube floats in a glass of water filled to the brim. When it melts, the water…', choices: ['overflows', 'stays exactly at the brim', 'drops below the brim', 'overflows only if the ice was large'], a: 1,
      why: 'The floating ice displaces its own weight of water; melted, it becomes exactly that much water, filling the hole it made.' },
    { q: 'A ship sails from a river into the sea. It…', choices: ['sinks lower', 'rises a little', 'stays at the same level', 'capsizes'], a: 1,
      why: 'Sea water is denser, so less of it needs to be displaced to support the same weight: the ship floats higher.' },
    { q: 'A block of lead and a block of aluminium of the same size are both held fully under water. The lead feels the larger buoyant force.', a: false,
      why: 'Buoyancy depends only on the displaced volume and the fluid, which are the same. The lead is just heavier, so its net force is more downward.' }
  ],
  applications: ['Ships, submarines (ballast tanks) and diving buoyancy control.', 'Hot-air and helium balloons, weather balloons and airships.', 'Hydrometers, density measurement and body-fat measurement by underwater weighing.'],
  history: 'Archimedes of Syracuse (3rd century BC) is said to have discovered the principle while bathing, when asked to test whether a crown was pure gold.'
},

{
  id: 'continuity-equation', parent: 'fluids', title: 'Continuity equation', level: 1,
  short: 'A liquid flowing through a pipe cannot pile up, so the flow rate Av is the same everywhere: where the pipe narrows, the flow speeds up.',
  keywords: ['continuity equation', 'flow rate', 'volume flow rate', 'A v', 'mass flow rate', 'conservation of mass', 'incompressible flow', 'streamlines', 'nozzle', 'hose'],
  prereq: ['density', 'speed-velocity', 'math:area'],
  related: ['bernoullis-equation', 'viscosity', 'math:divergence'],
  body: `
Put your thumb over the end of a garden hose and the water shoots out much faster. A slow, wide river races through a narrow gorge. Both follow from one simple fact: a liquid cannot pile up or vanish inside a pipe.

### Flow rate
The **volume flow rate** $Q$ is the volume passing a cross-section each second. If a fluid moves at speed $v$ through an area $A$, in one second it advances a distance $v$ and fills a volume $Av$:
$$Q = Av$$
Units: m³/s, or more handily L/s and L/min. A kitchen tap delivers about 6–10 L/min; a fire hose about 500 L/min.

### Continuity
In steady flow of an incompressible fluid, whatever enters one end of a pipe section must leave the other in the same time. So $Q$ is the same at every cross-section:
$$A_1 v_1 = A_2 v_2$$
Narrow the pipe and the fluid must speed up; widen it and the fluid slows down. For circular pipes the area goes as the diameter squared, so **halving the diameter makes the flow four times faster**. A hose of 16 mm bore carrying 20 L/min flows at 1.7 m/s; squeeze the outlet to 4 mm and the jet leaves at 27 m/s.

### Streamlines
Draw the paths the fluid follows: they bunch together where the flow is fast and spread apart where it is slow, the same picture as field lines. In the simulation, watch the tracer dots speed up as they enter the narrow throat.

### Branching: add up the areas
When a pipe splits, the flow rates of the branches add up to the flow in the main pipe. What sets the speed is the **total** cross-section. Your aorta carries about 5 L of blood a minute at around 20 cm/s. The billions of capillaries are each tiny, but together their cross-section is about a thousand times the aorta's, so blood crawls through them at a third of a millimetre per second — slow enough for oxygen and nutrients to be exchanged.

### For gases
If the density changes, it is the **mass** flow rate that must be the same everywhere:
$$\\rho_1 A_1 v_1 = \\rho_2 A_2 v_2$$
For air moving well below the speed of sound, density hardly changes and the simple form works; in jet engines and rocket nozzles it does not.

> [!note] The continuity equation is conservation of mass. Its mathematical big brother, $\\nabla\\cdot(\\rho\\vec v) = -\\partial\\rho/\\partial t$, expresses the same idea at every point — see [[math:divergence|divergence]].

Faster flow in a narrow section goes with **lower** pressure there: that is [[bernoullis-equation|Bernoulli's equation]].
`,
  ideas: [
    'The volume flow rate is Q = Av: area times speed.',
    'For steady, incompressible flow, Q is the same everywhere along a pipe: A₁v₁ = A₂v₂.',
    'Halving the diameter quarters the area and so quadruples the speed.',
    'In branching flow, the total cross-section sets the speed; for gases, ρAv is conserved.'
  ],
  pitfalls: [
    'Water speeds up in a narrow section because it is squeezed by higher pressure there — The pressure in the narrow part is lower, not higher. The fluid is pushed in from the wide, higher-pressure part.',
    'Halving the diameter doubles the speed — The area goes as the diameter squared, so the speed goes up four times.',
    'Blood is fastest in the capillaries because they are the narrowest vessels — Their total cross-section is the largest, so blood is slowest there.'
  ],
  formulas: [
    {
      name: 'Volume flow rate',
      expr: 'Q = A*v', tex: 'Q = A v',
      vars: {
        Q: { name: 'volume flow rate', q: 'flowrate', unit: 'L/min' },
        A: { name: 'cross-sectional area', q: 'area', unit: 'cm²', value: 2.01 },
        v: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 1.66 }
      },
      stories: { Q: 'Water flows at {v} through a pipe of cross-section {A}. What is the flow rate?', v: 'A pipe of cross-section {A} carries {Q}. How fast does the water move?' }
    },
    {
      name: 'Speed after a change of diameter',
      expr: 'v2 = v1*(d1/d2)^2', tex: 'v_2 = v_1\\left(\\frac{d_1}{d_2}\\right)^2',
      vars: {
        v2: { name: 'speed in the second section', q: 'speed', unit: 'm/s' },
        v1: { name: 'speed in the first section', q: 'speed', unit: 'm/s', value: 1.66 },
        d1: { name: 'diameter of the first section', q: 'length', unit: 'mm', value: 16 },
        d2: { name: 'diameter of the second section', q: 'length', unit: 'mm', value: 4 }
      },
      stories: { v2: 'Water flows at {v1} in a hose of {d1} bore and leaves through a nozzle of {d2}. How fast is the jet?', d2: 'Water at {v1} in a {d1} pipe must reach {v2}. What nozzle diameter is needed?' }
    },
    {
      name: 'Mass flow rate',
      expr: 'mdot = rho*A*v', tex: '\\dot m = \\rho A v',
      vars: {
        mdot: { name: 'mass flow rate', q: 'massflow', unit: 'kg/s', tex: '\\dot m' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.2 },
        A: { name: 'cross-sectional area', q: 'area', unit: 'm²', value: 0.5 },
        v: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 3 }
      },
      stories: { mdot: 'Air ({rho}) moves at {v} through a duct of cross-section {A}. What mass of air passes each second?' }
    }
  ],
  examples: [
    {
      title: 'Thumb on the hose',
      q: 'A hose of 16 mm internal diameter delivers 20 L/min. How fast does the water move in the hose, and how fast out of a 4.0 mm nozzle?',
      steps: [
        'Flow rate: $Q = 20\\ \\mathrm{L/min} = 3.33\\times10^{-4}\\ \\mathrm{m^3/s}$.',
        'Hose area: $\\pi(0.008)^2 = 2.01\\times10^{-4}\\ \\mathrm{m^2}$, so $v_1 = Q/A = 1.66\\ \\mathrm{m/s}$.',
        'The nozzle diameter is 4 times smaller, so its area is 16 times smaller: $v_2 = 16 \\times 1.66 = 26.5\\ \\mathrm{m/s}$.'
      ],
      a: '1.7 m/s in the hose, 27 m/s out of the nozzle.'
    },
    {
      title: 'Blood in the capillaries',
      q: 'The heart pumps 5.0 L/min. The aorta has a cross-section of 4.5 cm² and all the capillaries together about 0.25 m². Find the average blood speed in each.',
      steps: [
        '$Q = 5.0\\ \\mathrm{L/min} = 8.3\\times10^{-5}\\ \\mathrm{m^3/s}$.',
        'Aorta: $v = Q/A = 8.3\\times10^{-5}/4.5\\times10^{-4} = 0.19\\ \\mathrm{m/s}$.',
        'Capillaries: $v = 8.3\\times10^{-5}/0.25 = 3.3\\times10^{-4}\\ \\mathrm{m/s}$, a third of a millimetre per second.'
      ],
      a: 'About 19 cm/s in the aorta and 0.3 mm/s in the capillaries.'
    }
  ],
  quiz: [
    { q: 'Water flows from a pipe into a section with half the diameter. Its speed…', choices: ['halves', 'doubles', 'quadruples', 'stays the same'], a: 2, why: 'Area ∝ d², so a quarter of the area, and four times the speed to keep Av constant.' },
    { q: 'A river 40 m wide and 2 m deep flows at 0.5 m/s. Where it narrows to 10 m wide and 4 m deep, it flows at…', choices: ['0.5 m/s', '1.0 m/s', '2.0 m/s', '0.25 m/s'], a: 1, why: 'A₁ = 80 m², A₂ = 40 m²: half the area, twice the speed.' },
    { q: 'In the narrow part of a pipe, the water is faster because the pressure there is higher.', a: false,
      why: 'Continuity forces the speed up; the pressure in the narrow part is lower (Bernoulli), and it is the pressure drop from the wide section that accelerates the water.' },
    { q: 'A 20 mm pipe splits into four 10 mm pipes. Compared with the main pipe, the water in each branch moves…', choices: ['4 times faster', 'at the same speed', 'twice as fast', '4 times slower'], a: 1,
      why: 'Each branch has a quarter of the main area, and four of them together have exactly the main area.' }
  ],
  applications: ['Nozzles on hoses, fire hoses and pressure washers.', 'Sizing pipes, ducts and blood-flow calculations.', 'Wind speeding up through gaps between tall buildings.'],
  sim: 'mech2-venturi'
},

{
  id: 'bernoullis-equation', parent: 'fluids', title: 'Bernoulli\'s equation', level: 2,
  short: 'Energy conservation for a flowing fluid: along a streamline, p + ½ρv² + ρgh stays constant. Where a fluid moves faster, its pressure is lower.',
  keywords: ['Bernoulli', 'Bernoulli\'s principle', 'Venturi', 'pitot tube', 'Torricelli', 'lift', 'dynamic pressure', 'stagnation pressure', 'airspeed', 'atomiser'],
  prereq: ['continuity-equation', 'hydrostatic-pressure', 'conservation-of-energy'],
  related: ['viscosity', 'work-energy-theorem', 'drag-force'],
  body: `
Hold two sheets of paper a few centimetres apart and blow between them: instead of flying apart they are pulled together. The fast-moving air between them is at a **lower** pressure than the still air outside. That surprising link between speed and pressure is Bernoulli's principle.

### The equation
For steady flow of an incompressible fluid with negligible viscosity, along a streamline,
$$p + \\tfrac12\\rho v^2 + \\rho g h = \\text{constant}$$
Each term is an energy per unit volume (J/m³ = Pa): $p$ is the work the pressure can do, $\\tfrac12\\rho v^2$ the [[kinetic-energy|kinetic energy]] per volume (the **dynamic pressure**) and $\\rho g h$ the potential energy per volume. It is [[conservation-of-energy|energy conservation]] for a fluid: where one term rises, the others must fall.

Two special cases:
- **At rest** ($v = 0$), it reduces to [[hydrostatic-pressure|$p + \\rho g h$ = constant]].
- **Level flow** ($h$ constant): faster means lower pressure. Combined with the [[continuity-equation|continuity equation]], a narrow section of pipe — where the fluid must go faster — has a lower pressure.

### The Venturi tube
A pipe with a smooth constriction is a **Venturi meter**. Measure the pressure difference $\\Delta p$ between the wide part and the throat, and the two equations give the speed and so the flow rate. The pressure drop can also be used to suck in another fluid — in carburettors, garden sprayers, laboratory water aspirators and perfume atomisers. In the simulation, narrow the throat and watch the pressure tubes.

### Torricelli: water from a tank
Water leaving a hole a depth $h$ below the surface of an open tank: at the surface $v \\approx 0$, at the hole the pressure is atmospheric again, so all of $\\rho g h$ becomes $\\tfrac12\\rho v^2$:
$$v = \\sqrt{2gh}$$
— the speed of something falling freely from the surface.

### The pitot tube
A tube facing into the flow brings the fluid in front of it to rest, and the pressure there rises by $\\tfrac12\\rho v^2$. Comparing it with the static pressure gives the speed, $v = \\sqrt{2\\Delta p/\\rho}$. Every aircraft carries pitot tubes to measure its airspeed.

### Wings and roofs
Air flows faster over the upper surface of a wing than under it, and the pressure there is lower: that pressure difference is the lift. Bernoulli connects speed and pressure, but it does not by itself explain *why* the air is faster on top — the wing's shape and angle turn the airflow downwards, and by [[newtons-third-law|Newton's third law]] the air pushes the wing up. In a storm the same effect lifts roofs: 40 m/s of wind over a roof lowers the pressure above it by about 1 kPa, enough to pull 10 tonnes on a 100 m² roof.

> [!warn] Bernoulli's equation assumes no viscosity, steady flow and constant density. It fails for thick, slow liquids in narrow pipes (see [[viscosity]]), in turbulent wakes, and for gases above about a third of the speed of sound.
`,
  ideas: [
    'Along a streamline, p + ½ρv² + ρgh is constant (steady, incompressible, frictionless flow).',
    'At the same height, faster flow means lower pressure.',
    'Torricelli: fluid leaves a hole a depth h below the surface at √(2gh).',
    'Measuring a pressure difference gives a flow speed: Venturi meters and pitot tubes.'
  ],
  pitfalls: [
    'Fast-moving fluid pushes harder on the walls — The pressure on the walls is lower where the flow is faster.',
    'Air over a wing speeds up because it must meet the air from underneath at the trailing edge — There is no such rule ("equal transit time" is a myth); the air over the top actually arrives well before the air underneath.',
    'Bernoulli\'s equation applies to any flow — It needs steady, frictionless, incompressible flow along a streamline; viscous pipe flow and turbulence break it.'
  ],
  derivation: {
    title: 'Bernoulli from the work–energy theorem',
    steps: [
      { text: 'Follow a small parcel of fluid of volume $V$ as it moves from region 1 to region 2 of a pipe. Behind it, the fluid pushes it forward with pressure $p_1$; ahead, the fluid resists with $p_2$. The net work done by pressure is', tex: 'W = (p_1 - p_2)\\,V' },
      { text: 'This work changes the parcel\'s kinetic and potential energy (mass $\\rho V$):', tex: '(p_1 - p_2)V = \\tfrac12\\rho V(v_2^2 - v_1^2) + \\rho V g(h_2 - h_1)' },
      { text: 'Divide by $V$ and collect each region\'s terms on its own side:', tex: 'p_1 + \\tfrac12\\rho v_1^2 + \\rho g h_1 = p_2 + \\tfrac12\\rho v_2^2 + \\rho g h_2' },
      { text: 'Friction would take energy away and appear as an extra pressure loss on the right; that is where viscosity comes in.' }
    ]
  },
  formulas: [
    {
      name: 'Bernoulli\'s equation',
      expr: 'p1 + 0.5*rho*v1^2 + rho*g*h1 = p2 + 0.5*rho*v2^2 + rho*g*h2', tex: 'p_1 + \\tfrac12\\rho v_1^2 + \\rho g h_1 = p_2 + \\tfrac12\\rho v_2^2 + \\rho g h_2', solveFor: 'p2',
      vars: {
        p1: { name: 'pressure at point 1', q: 'pressure', unit: 'kPa', value: 150 },
        v1: { name: 'speed at point 1', q: 'speed', unit: 'm/s', value: 1.5 },
        h1: { name: 'height of point 1', q: 'length', unit: 'm', value: 0, signed: true },
        p2: { name: 'pressure at point 2', q: 'pressure', unit: 'kPa' },
        v2: { name: 'speed at point 2', q: 'speed', unit: 'm/s', value: 6 },
        h2: { name: 'height of point 2', q: 'length', unit: 'm', value: 0, signed: true },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' }
      },
      practice: { unknowns: ['p2', 'v2'] },
      stories: { p2: 'Water ({rho}) at {p1} moves at {v1} at height {h1}. Downstream it moves at {v2} at height {h2}. What is the pressure there?', v2: 'Water ({rho}) at {p1} and {v1} flows to a point at height {h2} (from {h1}) where the pressure is {p2}. How fast is it moving?' }
    },
    {
      name: 'Torricelli\'s law',
      expr: 'v = sqrt(2*g*h)', tex: 'v = \\sqrt{2 g h}',
      vars: {
        v: { name: 'outflow speed', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        h: { name: 'depth of the hole below the surface', q: 'length', unit: 'm', value: 5 }
      },
      stories: { v: 'A water tank has a small hole {h} below its surface. How fast does the jet leave?', h: 'How far below the water surface is a hole whose jet leaves at {v}?' }
    },
    {
      name: 'Pitot tube: speed from dynamic pressure',
      expr: 'v = sqrt(2*dp/rho)', tex: 'v = \\sqrt{\\frac{2\\Delta p}{\\rho}}',
      vars: {
        v: { name: 'flow speed', q: 'speed', unit: 'm/s' },
        dp: { name: 'stagnation minus static pressure', q: 'pressure', unit: 'kPa', value: 12, tex: '\\Delta p' },
        rho: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 0.4 }
      },
      stories: { v: 'An aircraft\'s pitot tube shows a pressure difference of {dp} in air of density {rho}. What is its airspeed?', dp: 'What pressure difference does a pitot tube show at {v} in air of density {rho}?' }
    }
  ],
  examples: [
    {
      title: 'A Venturi meter',
      q: 'Water flows at 1.5 m/s in a 5.0 cm pipe that narrows to 2.5 cm. How fast is it in the throat, and how much lower is the pressure there?',
      steps: [
        'Continuity: the diameter halves, so the area quarters and $v_2 = 4 \\times 1.5 = 6.0\\ \\mathrm{m/s}$.',
        'Bernoulli (level pipe): $p_1 - p_2 = \\tfrac12\\rho(v_2^2 - v_1^2) = \\tfrac12(1000)(36 - 2.25) = 16\\,900\\ \\mathrm{Pa}$.',
        'That is a difference of 1.7 m of water in two manometer tubes — easy to read, and a direct measure of the flow.'
      ],
      a: '6.0 m/s; the pressure is about 17 kPa lower.'
    },
    {
      title: 'A storm over the roof',
      q: 'A 40 m/s gale blows across a flat roof of 100 m². Roughly what upward force does the pressure difference produce, if the air inside is still? (ρ_air = 1.2 kg/m³.)',
      steps: [
        'Pressure drop above the roof $\\approx \\tfrac12\\rho v^2 = \\tfrac12(1.2)(40)^2 = 960\\ \\mathrm{Pa}$.',
        'Force: $960 \\times 100 = 96\\,000\\ \\mathrm{N}$, the weight of about 10 tonnes — more than enough to tear off a poorly fixed roof.'
      ],
      a: 'About 100 kN upwards.'
    }
  ],
  quiz: [
    { q: 'You blow between two hanging sheets of paper. They…', choices: ['fly apart', 'move together', 'do not move', 'swing in the direction you blow only'], a: 1,
      why: 'The moving air between them has lower pressure than the still air outside, which pushes them together.' },
    { q: 'Water flows through a horizontal pipe that narrows. In the narrow section the pressure is…', choices: ['higher', 'lower', 'the same', 'zero'], a: 1, why: 'Continuity makes the water faster there, and Bernoulli (same height) then requires lower pressure.' },
    { q: 'A tank has two small holes, one 1 m and one 4 m below the surface. The deeper jet leaves…', choices: ['at the same speed', 'twice as fast', 'four times as fast', 'half as fast'], a: 1, why: 'Torricelli: v = √(2gh), so four times the depth gives twice the speed.' },
    { q: 'Air must take the same time over and under a wing, which is why it moves faster over the curved top.', a: false,
      why: 'The equal-transit-time idea is false: the upper air actually arrives at the trailing edge first. The wing deflects the flow downwards; Bernoulli links the resulting speeds to the pressures.' }
  ],
  applications: ['Venturi and orifice flow meters, carburettors and garden sprayers.', 'Pitot tubes for aircraft airspeed and in wind tunnels.', 'Lift on wings, sails and racing-car wings (which push down).'],
  history: 'Daniel Bernoulli published the relation between pressure and speed in Hydrodynamica (1738); Euler gave it its modern form in the 1750s.',
  sim: 'mech2-venturi'
},

{
  id: 'viscosity', parent: 'fluids', title: 'Viscosity and Poiseuille flow', level: 2,
  short: 'Viscosity is a fluid\'s internal friction. In a pipe it makes the flow rate depend on the fourth power of the radius — halve the radius and only a sixteenth flows.',
  keywords: ['viscosity', 'Poiseuille', 'Hagen–Poiseuille', 'laminar flow', 'turbulent flow', 'Reynolds number', 'Stokes\' law', 'terminal velocity', 'Pa·s', 'shear stress', 'blood flow'],
  prereq: ['continuity-equation', 'pressure', 'drag-force'],
  related: ['bernoullis-equation', 'surface-tension', 'kinetic-theory-gases'],
  body: `
Pour honey and water side by side: the honey oozes, the water splashes. Honey has a high **viscosity** — a large internal friction between neighbouring layers of fluid sliding past one another.

### Measuring it
Put a fluid between two plates and slide the top one along. The fluid touching each plate moves with it (the "no-slip" condition), and the layers in between shear. The force per area needed, the shear stress, is proportional to how fast the velocity changes across the gap:
$$\\tau = \\eta\\,\\frac{dv}{dy}$$
The constant $\\eta$ is the **dynamic viscosity**, in pascal-seconds (Pa·s).

| Fluid (about 20 °C) | Viscosity (Pa·s) |
|---|---|
| Air | 1.8 × 10⁻⁵ |
| Water | 1.0 × 10⁻³ |
| Blood (37 °C) | 3–4 × 10⁻³ |
| Olive oil | 0.08 |
| Glycerine | 1.4 |
| Honey | about 10 |

Liquids thin out dramatically when warmed (warm honey pours); gases, curiously, get slightly more viscous. Fluids obeying this simple law are **Newtonian**; ketchup, paint and custard are not — their viscosity changes with how hard they are stirred.

### Flow in a pipe: Poiseuille's law
With viscosity, a pressure difference $\\Delta p$ is needed just to keep fluid flowing steadily along a pipe. The fluid is fastest in the middle and still at the wall, with a parabolic speed profile, and the flow rate is
$$Q = \\frac{\\pi r^4\\,\\Delta p}{8\\eta L}$$
for a pipe of radius $r$ and length $L$. The **fourth power** is striking: halve the radius and the flow drops to 1/16 at the same pressure. An artery narrowed by plaque to 80 % of its radius carries only 41 % of the flow — or the heart must push 2.4 times harder. It is also why a thin hypodermic needle needs a firm push.

### Laminar or turbulent?
Poiseuille's law holds for smooth, layered (**laminar**) flow. Fast flow in wide pipes becomes chaotic (**turbulent**), with far larger losses. The **Reynolds number**
$$Re = \\frac{\\rho v D}{\\eta}$$
compares inertia with viscosity. In pipes, flow is laminar below about 2000 and turbulent above about 4000. Blood in the aorta sits near the boundary; water in a household pipe is usually turbulent; syrup in a straw never is.

### Small things sinking slowly
A small sphere of radius $r$ moving slowly through a viscous fluid feels a drag **Stokes' law**, $F = 6\\pi\\eta r v$. Balancing it against weight minus buoyancy gives a terminal speed
$$v_t = \\frac{2 r^2 (\\rho_s - \\rho_f) g}{9\\eta}$$
A fog droplet 10 µm in radius falls through air at only about 1 cm/s, which is why fog hangs. Millikan used this to size his oil drops when he measured the charge of the electron; it also explains why fine mud takes days to settle in a glass of water.
`,
  ideas: [
    'Viscosity is internal friction: shear stress τ = η dv/dy, with η in Pa·s.',
    'Poiseuille\'s law: Q = πr⁴Δp/(8ηL), so the flow depends on the fourth power of the radius.',
    'The Reynolds number ρvD/η predicts laminar (below ~2000) or turbulent (above ~4000) pipe flow.',
    'Small spheres fall at a terminal speed v = 2r²(ρ_s − ρ_f)g/9η (Stokes).'
  ],
  pitfalls: [
    'Halving a pipe\'s radius halves the flow — At the same pressure difference it cuts the flow to 1/16 (r⁴).',
    'Viscosity is the same as density — Honey is only about 1.4 times denser than water but 10 000 times more viscous; mercury is 13.5 times denser than water but only slightly more viscous.',
    'Poiseuille\'s law works for any pipe flow — Only for laminar flow. At high Reynolds numbers the flow is turbulent and the losses are much larger.'
  ],
  formulas: [
    {
      name: 'Poiseuille\'s law',
      expr: 'Q = pi*r^4*dp/(8*eta*L)', tex: 'Q = \\frac{\\pi r^4 \\Delta p}{8 \\eta L}',
      vars: {
        Q: { name: 'volume flow rate', q: 'flowrate', unit: 'mL/s' },
        r: { name: 'inner radius of the pipe', q: 'length', unit: 'mm', value: 0.15 },
        dp: { name: 'pressure difference along the pipe', q: 'pressure', unit: 'kPa', value: 50, tex: '\\Delta p' },
        eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1 },
        L: { name: 'length of the pipe', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'Laminar flow only (Reynolds number below about 2000).',
      stories: { Q: 'A liquid of viscosity {eta} is pushed through a needle of radius {r} and length {L} by a pressure difference of {dp}. What is the flow rate?', dp: 'What pressure difference drives {Q} of a liquid (viscosity {eta}) through a tube of radius {r} and length {L}?' }
    },
    {
      name: 'Reynolds number',
      expr: 'Re = rho*v*D/eta', tex: '\\mathit{Re} = \\frac{\\rho v D}{\\eta}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathit{Re}' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1060 },
        v: { name: 'mean flow speed', q: 'speed', unit: 'm/s', value: 0.3 },
        D: { name: 'pipe diameter', q: 'length', unit: 'cm', value: 2.5 },
        eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 3.5 }
      },
      stories: { Re: 'Blood ({rho}, viscosity {eta}) flows at {v} through a vessel {D} across. What is the Reynolds number?', v: 'Above what speed would water ({rho}, {eta}) in a {D} pipe reach Re = {Re}?' }
    },
    {
      name: 'Terminal speed of a small sphere (Stokes)',
      expr: 'v = 2*r^2*(rhos - rhof)*g/(9*eta)', tex: 'v_t = \\frac{2 r^2 (\\rho_s - \\rho_f) g}{9\\eta}',
      vars: {
        v: { name: 'terminal speed', q: 'speed', unit: 'cm/s', tex: 'v_t' },
        r: { name: 'radius of the sphere', q: 'length', unit: 'µm', value: 10 },
        rhos: { name: 'density of the sphere', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_s' },
        rhof: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho_f' },
        g: { const: 'g' },
        eta: { name: 'viscosity of the fluid', q: 'viscosity', unit: 'Pa·s', value: 1.8e-5 }
      },
      stories: { v: 'How fast does a water droplet of radius {r} settle through air (density {rhof}, viscosity {eta})?', r: 'Grains ({rhos}) settle through water ({rhof}, viscosity {eta}) at {v}. How big are they?' }
    }
  ],
  examples: [
    {
      title: 'A narrowed artery',
      q: 'Plaque narrows an artery to 80 % of its original radius. By what factor does the blood flow fall at the same blood pressure, and by what factor must the pressure difference rise to restore the flow?',
      steps: [
        'Poiseuille: $Q \\propto r^4$, so $Q_\\text{new}/Q_\\text{old} = 0.8^4 = 0.41$.',
        'To keep $Q$ the same, $\\Delta p$ must rise by $1/0.41 = 2.44$.',
        'Small narrowings have large effects — one reason why atherosclerosis strains the heart.'
      ],
      a: 'Flow falls to 41 %; the pressure difference must rise 2.4 times.'
    },
    {
      title: 'Why fog hangs',
      q: 'How fast does a water droplet of radius 10 µm settle through still air (η = 1.8 × 10⁻⁵ Pa·s)?',
      steps: [
        '$v_t = \\dfrac{2 r^2 (\\rho_s - \\rho_f) g}{9\\eta} = \\dfrac{2(10^{-5})^2(1000 - 1.2)(9.81)}{9(1.8\\times10^{-5})}$.',
        'Numerator $1.96\\times10^{-6}$, denominator $1.62\\times10^{-4}$: $v_t = 0.012\\ \\mathrm{m/s}$.',
        'About 1 cm/s: the slightest updraught keeps fog and cloud droplets aloft. (Check: $Re = \\rho v D/\\eta \\approx 0.02$, so Stokes\' law applies.)'
      ],
      a: 'About 1.2 cm/s.'
    }
  ],
  quiz: [
    { q: 'At the same pressure difference, a pipe of half the radius carries…', choices: ['half the flow', 'a quarter of the flow', 'an eighth of the flow', 'a sixteenth of the flow'], a: 3, why: 'Poiseuille: Q ∝ r⁴, and (½)⁴ = 1/16.' },
    { q: 'In laminar flow through a pipe, the fluid moves fastest…', choices: ['at the walls', 'in the centre', 'at the same speed everywhere', 'in a ring halfway out'], a: 1, why: 'The fluid sticks to the walls (no slip) and the speed rises to a maximum on the axis, in a parabolic profile.' },
    { q: 'Flow with a Reynolds number of 50 000 in a pipe is most likely…', choices: ['laminar', 'turbulent', 'stationary', 'described exactly by Poiseuille\'s law'], a: 1, why: 'Above about 4000 pipe flow is turbulent; inertia dominates viscosity.' },
    { q: 'Heating a liquid such as oil or honey makes it less viscous.', a: true, why: 'Warmer molecules slide past each other more easily. (Gases are the opposite: their viscosity rises slightly with temperature.)' }
  ],
  applications: ['Blood flow and blood pressure; the design of needles, catheters and drips.', 'Lubrication of engines and bearings, and choosing motor-oil grades.', 'Sedimentation, centrifuges and measuring particle sizes; pipeline pumping costs.']
},

{
  id: 'surface-tension', parent: 'fluids', title: 'Surface tension', level: 2,
  short: 'The surface of a liquid behaves like a stretched skin: it pulls itself as small as it can. That rounds drops, lets insects walk on water and draws water up thin tubes.',
  keywords: ['surface tension', 'surface energy', 'capillary action', 'capillarity', 'meniscus', 'contact angle', 'Laplace pressure', 'droplet', 'soap bubble', 'surfactant', 'detergent', 'water strider'],
  prereq: ['pressure', 'hydrostatic-pressure', 'force'],
  related: ['viscosity', 'work', 'density'],
  body: `
A steel paperclip laid gently on water floats, though steel is eight times denser than water. Pond skaters stride across ponds. Raindrops are round. All show that a liquid's surface acts like a stretched elastic sheet.

### Why surfaces pull
Molecules in a liquid attract their neighbours. One deep inside is pulled equally in all directions; one at the surface has neighbours only on one side and is pulled inwards. Bringing a molecule to the surface therefore costs energy, and a liquid behaves as if its surface were under tension, always trying to shrink. The **surface tension** $\\gamma$ is both
$$\\gamma = \\frac{F}{L} \\quad\\text{(force per length of edge)} \\qquad\\text{and}\\qquad \\gamma = \\frac{\\Delta E}{\\Delta A} \\quad\\text{(energy per area of new surface)}$$
in N/m = J/m². Water has an unusually high value, 0.072 N/m at room temperature; ethanol 0.022; soapy water about 0.025–0.03; mercury 0.49.

Since a sphere has the smallest surface for a given volume, small drops that nothing else disturbs are round.

### Pressure inside drops and bubbles
A curved surface squeezes what it encloses. Inside a drop of radius $r$ the pressure is higher than outside by
$$\\Delta p = \\frac{2\\gamma}{r}$$
(the **Laplace pressure**). A soap bubble has two surfaces, inner and outer, so $\\Delta p = 4\\gamma/r$. Small drops have **higher** internal pressure than big ones: a fog droplet 1 µm in radius holds an extra 1.4 atmospheres. Connect a small and a large soap bubble by a tube and the small one empties into the large one.

### Capillary rise
Where a liquid meets a solid it wets it or not, measured by the **contact angle** $\\theta$: water on clean glass has $\\theta \\approx 0$ and climbs the wall; mercury has $\\theta \\approx 140°$ and pulls away. In a narrow tube of radius $r$ the surface tension around the rim pulls a column up until its weight balances:
$$h = \\frac{2\\gamma\\cos\\theta}{\\rho g r}$$
Water climbs 3 cm in a tube of 0.5 mm radius and 30 cm in one of 0.05 mm. Mercury is pushed **down** ($\\cos\\theta < 0$). Capillarity wicks water into paper towels, soil, sponges and candle wicks, and draws ink into a fountain pen's nib — though it cannot, on its own, lift sap to the top of a 100 m tree.

### Changing it
**Surfactants** — soaps, detergents — gather at the surface and lower $\\gamma$, letting water spread into fabric and grease and making stable bubbles possible. Your lungs make their own: the tiny air sacs (alveoli), about 0.2 mm across, would need a large extra [[pressure]] to inflate against water's surface tension, and a surfactant layer lowers it enough to make breathing easy. Premature babies who cannot yet make it are given it as a treatment.
`,
  ideas: [
    'A liquid surface acts like a stretched skin because surface molecules are pulled inwards.',
    'Surface tension γ is force per length and energy per area (N/m = J/m²); water\'s is 0.072 N/m.',
    'The pressure inside a drop exceeds that outside by 2γ/r (4γ/r for a soap bubble): smaller means higher.',
    'Capillary rise h = 2γ cos θ/(ρgr): narrower tubes lift liquids higher; non-wetting liquids are depressed.'
  ],
  pitfalls: [
    'A floating paperclip is held up by buoyancy — Steel is far denser than water; the clip rests in a dimple of the surface, held up by surface tension.',
    'A bigger bubble has a higher pressure inside — The excess pressure goes as 1/r: small bubbles and drops have the higher pressure.',
    'Surface tension is a kind of viscosity — Viscosity resists flow inside a liquid; surface tension is a property of its surface.'
  ],
  formulas: [
    {
      name: 'Capillary rise',
      expr: 'h = 2*gam*cos(theta)/(rho*g*r)', tex: 'h = \\frac{2\\gamma\\cos\\theta}{\\rho g r}',
      vars: {
        h: { name: 'height of rise (negative: depression)', q: 'length', unit: 'cm', signed: true },
        gam: { name: 'surface tension', q: 'surfacetension', unit: 'N/m', value: 0.0728, tex: '\\gamma' },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 20, min: 0, max: 180 },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        r: { name: 'radius of the tube', q: 'length', unit: 'mm', value: 0.5 }
      },
      practice: { unknowns: ['h', 'r'] },
      stories: { h: 'How high does water (γ = {gam}, contact angle {theta}) climb in a glass tube of radius {r}?', r: 'Water (γ = {gam}, contact angle {theta}) should rise {h} in a capillary. What radius must it have?' }
    },
    {
      name: 'Excess pressure in a drop',
      expr: 'dp = 2*gam/r', tex: '\\Delta p = \\frac{2\\gamma}{r}',
      vars: {
        dp: { name: 'pressure inside minus outside', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        gam: { name: 'surface tension', q: 'surfacetension', unit: 'N/m', value: 0.072, tex: '\\gamma' },
        r: { name: 'radius of the drop', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'For a soap bubble, with two surfaces, use $4\\gamma/r$ — or double $\\gamma$ here.',
      stories: { dp: 'By how much does the pressure inside a water droplet of radius {r} (γ = {gam}) exceed the pressure outside?' }
    },
    {
      name: 'Surface tension from a force on an edge',
      expr: 'gam = F/L', tex: '\\gamma = \\frac{F}{L}',
      vars: {
        gam: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', tex: '\\gamma' },
        F: { name: 'force pulling along the surface', q: 'force', unit: 'mN', value: 3.6 },
        L: { name: 'length of edge (count both sides of a film)', q: 'length', unit: 'cm', value: 5 }
      },
      stories: { gam: 'A wire frame lifts a liquid film with an edge {L} long (both sides counted). The film pulls with {F}. What is the surface tension?' }
    }
  ],
  examples: [
    {
      title: 'Water in a thin tube',
      q: 'How high does water (γ = 0.0728 N/m, contact angle 0°) rise in a clean glass tube of internal radius 0.50 mm? How far is mercury (γ = 0.485 N/m, θ = 140°, ρ = 13 546 kg/m³) pushed down in the same tube?',
      steps: [
        'Water: $h = \\dfrac{2 \\times 0.0728 \\times 1}{1000 \\times 9.81 \\times 5.0\\times10^{-4}} = 0.030\\ \\mathrm{m}$, 3.0 cm up.',
        'Mercury: $\\cos 140° = -0.766$, so $h = \\dfrac{2 \\times 0.485 \\times (-0.766)}{13\\,546 \\times 9.81 \\times 5.0\\times10^{-4}} = -0.011\\ \\mathrm{m}$, 1.1 cm down.'
      ],
      a: 'Water rises 3.0 cm; mercury is depressed 1.1 cm.'
    },
    {
      title: 'Drops and bubbles',
      q: 'Compare the excess pressure inside a water droplet of radius 1.0 µm with that inside a soap bubble of radius 2.0 cm (γ = 0.025 N/m).',
      steps: [
        'Droplet: $\\Delta p = 2\\gamma/r = 2 \\times 0.072/10^{-6} = 1.4\\times10^{5}\\ \\mathrm{Pa}$ — more than an atmosphere.',
        'Bubble (two surfaces): $\\Delta p = 4\\gamma/r = 4 \\times 0.025/0.020 = 5\\ \\mathrm{Pa}$.'
      ],
      a: '144 kPa against 5 Pa.'
    }
  ],
  quiz: [
    { q: 'A small soap bubble and a large one are joined by a tube with a valve. The valve is opened. What happens?', choices: ['The large one shrinks into the small one', 'The small one shrinks into the large one', 'They become equal', 'Nothing'], a: 1,
      why: 'The excess pressure 4γ/r is greater in the smaller bubble, so air flows from it into the larger one.' },
    { q: 'A glass capillary tube is replaced by one with half the radius. Water now rises…', choices: ['half as high', 'to the same height', 'twice as high', 'four times as high'], a: 2, why: 'h ∝ 1/r.' },
    { q: 'Why does adding detergent help water clean greasy cloth?', choices: ['It raises the water\'s density', 'It lowers the surface tension, so water spreads into the fibres and around the grease', 'It makes the water hotter', 'It increases the surface tension'], a: 1,
      why: 'Surfactants lower γ, so the water wets surfaces it would otherwise bead up on.' },
    { q: 'A steel needle floats on water because it is less dense than water.', a: false,
      why: 'Steel is about 7.8 times denser. The needle sits in a dent in the surface, held up by surface tension; push it through and it sinks.' }
  ],
  applications: ['Detergents, soaps and wetting agents; inkjet and fountain-pen ink.', 'Capillary wicking in paper, fabrics, soil and heat pipes.', 'Lung surfactant and the treatment of premature babies; drop-based microfluidics.']
}

);
