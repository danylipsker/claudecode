/* HYPER-HYDRAULICS · content/hydrostatics.js — the Hydrostatics branch:
 *   pressure-basics     pressure, gauge and absolute pressure, pressure and depth, Pascal's law,
 *                       the hydraulic press and jack, manometers and gauges
 *   forces-on-surfaces  forces on plane and curved surfaces, the centre of pressure, buoyancy,
 *                       the stability of floating bodies, tanks, gates and dams
 * Simulations in sims/hydrostatics.js (ids hs-…). */
Hyper.add(

/* ======================================================================== PRESSURE AT REST */
{
  id: 'pressure-definition', parent: 'pressure-basics', title: 'Pressure', level: 1,
  short: 'Force spread over an area: p = F/A, measured in pascals, bar or metres of water. In a liquid at rest it pushes square-on to every surface and is the same in every direction at a point.',
  keywords: ['pressure', 'pascal', 'Pa', 'kPa', 'bar', 'MPa', 'psi', 'force per area', 'N/mm²', 'units of pressure', 'energy per volume', 'mH2O'],
  prereq: ['physics:pressure', 'physics:weight-mass'],
  related: ['gauge-absolute', 'pressure-with-depth', 'pascals-law', 'pressure-flow-power', 'hydraulic-cylinder', 'manometers'],
  body: `
Press a drawing pin into a board with your thumb and it goes in point first: the push your thumb barely feels is concentrated on the pin's tiny tip. **Pressure** is that concentration — the force pressing on a surface divided by the area it is spread over:

$$p = \\frac{F}{A}$$

Its SI unit is the **pascal**, one newton per square metre. A pascal is very small: a sheet of office paper lying flat on a desk presses on it with less than one pascal. Engineers therefore work in kilopascals (kPa), **bar** (100 kPa, close to one atmosphere) and megapascals (1 MPa = 1 N/mm² = 10 bar).

### A liquid pushes square-on
A liquid at rest cannot resist being sheared — push sideways on it and it simply flows. So in a still liquid the force on any surface, a tank wall, a gate, a piston, is always **perpendicular** to that surface. And at any point the pressure is the same whichever way a surface faces. Imagine a tiny wedge of liquid: the forces on its faces grow with their areas, its weight only with its volume, so as the wedge shrinks the weight becomes negligible and the faces must carry the same pressure for the wedge to balance. Pressure has no direction of its own — it is a scalar; the direction of the force comes from the surface it acts on.

### Units you will meet
| Unit | In pascals | Where it is used |
|---|---|---|
| kPa | 1 000 | water engineering, building services |
| bar | 100 000 | fluid power, gauges, tyres |
| MPa = N/mm² | 1 000 000 | high-pressure hydraulics, stresses |
| psi (lbf/in²) | 6 895 | American practice |
| metre of water (mH₂O) | 9 807 | pumps and water supply ([[pressure-with-depth|head]]) |
| mmHg | 133.3 | manometers, medicine, weather |
| atm | 101 325 | chemistry, the standard atmosphere |

### How big is big?
| Situation | Typical pressure |
|---|---|
| Atmosphere at sea level (absolute) | 1.013 bar |
| Bottom of a 3 m swimming pool (gauge) | 0.29 bar |
| Mains water in a house (gauge) | 2–5 bar |
| Car tyre (gauge) | 2.2–2.5 bar |
| Industrial hydraulics | 100–250 bar |
| Excavators and other mobile machines | 300–350 bar |
| Deepest ocean, 11 km down | about 1 100 bar |
| Water-jet cutting | 4 000–6 000 bar |

### Force from pressure
Turn the definition round, $F = pA$, and a modest pressure on a large area makes an enormous force. One bar on one square metre is 100 kN — the weight of ten tonnes. That is why the lid of a pressure cooker needs a locking rim, why a hydraulic cylinder the size of a coffee tin pushes like a lorry ([[hydraulic-cylinder]]), and why a door that will not open into a flooded room is not stuck but held.

Pressure is also **energy per unit volume**: 1 Pa = 1 N/m² = 1 J/m³. Pushing 1 m³ of liquid into a space at 1 bar takes 100 kJ. This is why pressure sits beside kinetic and potential energy in [[energy-equation|Bernoulli's equation]], and why hydraulic power is pressure times flow ([[pressure-flow-power]]).

> [!warn] Never loosen a cover, cap, plug or fitting on anything under pressure. A small gauge pressure on a large lid is a large force: at 3 bar a 500 mm manway door carries almost 6 tonnes. Release the pressure, and prove it is released, first.
`,
  ideas: [
    'Pressure is force per unit area, p = F/A; one pascal is one newton per square metre, and 1 bar = 100 kPa.',
    'A liquid at rest pushes perpendicular to every surface it touches, and at a point the pressure is the same in all directions.',
    'Pressure is a scalar; force is pressure times area, so modest pressures on large areas give very large forces.',
    'Pressure is energy per unit volume: 1 Pa = 1 J/m³, which is why pressure times flow is power.'
  ],
  pitfalls: [
    'Pressure pushes in the direction the liquid is "going" — At rest a liquid has no preferred direction: the force it exerts is always normal to the surface, whichever way that faces.',
    'A higher pressure always means a bigger force — Force is pressure times area. A needle tip at huge pressure carries a tiny force; a large lid at 1 bar carries tonnes.',
    'Bar and atmosphere are the same — Close (1 atm = 1.013 25 bar) but not equal, and neither is the same as 1 kgf/cm² (0.981 bar). At high pressures the 1–2 % differences matter.'
  ],
  formulas: [
    {
      name: 'Pressure',
      expr: 'p = F/A', tex: 'p = \\dfrac{F}{A}',
      vars: {
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'kPa' },
        F: { name: 'force normal to the surface', q: 'force', unit: 'kN', value: 0.7 },
        A: { name: 'area', q: 'area', unit: 'cm²', value: 350 }
      },
      note: 'Only the component of force perpendicular to the surface counts. A liquid at rest exerts no other.',
      stories: {
        p: 'A person weighing {F} stands on shoes with {A} of sole touching the floor. What pressure do the soles put on the floor?',
        A: 'A load of {F} must not put more than {p} on a floor. What bearing area does it need?',
        F: 'A pressure of {p} acts on a plate of {A}. What force does the plate feel?'
      }
    },
    {
      name: 'A mass resting on a piston (dead-weight tester)',
      expr: 'p = m*g/A', tex: 'p = \\dfrac{m g}{A}',
      vars: {
        p: { name: 'pressure under the piston (gauge)', q: 'pressure', unit: 'bar' },
        m: { name: 'mass of piston and weights', q: 'mass', unit: 'kg', value: 10 },
        g: { const: 'g' },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 1 }
      },
      note: 'The principle of the dead-weight tester that calibrates pressure gauges. Real testers correct for local gravity, air buoyancy on the weights and piston friction.',
      stories: {
        p: 'A dead-weight tester loads a piston of area {A} with {m}. What pressure does it generate?',
        m: 'What mass must be placed on a piston of {A} to generate {p}?'
      }
    },
    {
      name: 'Work to push a volume against a pressure',
      expr: 'W = p*V', tex: 'W = p\\,V',
      vars: {
        W: { name: 'work (energy)', q: 'energy', unit: 'kJ' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 1 },
        V: { name: 'volume pushed in', q: 'volume', unit: 'm³', value: 1 }
      },
      note: 'Pressure is energy per unit volume. Divide by time and this becomes hydraulic power, P = pQ.',
      stories: { W: 'How much work does it take to push {V} of water into a main at {p}?', V: 'A pump can deliver {W} of work to the water. How much can it push into a vessel at {p}?' }
    }
  ],
  examples: [
    {
      title: 'Feet under a press',
      q: 'A 12-tonne press stands on four steel feet, each 150 mm × 150 mm, on a concrete floor. What pressure does each foot put on the floor? What if the feet were replaced by 20 mm diameter levelling screws resting directly on the concrete?',
      steps: [
        'Force per foot: $F = 12\\,000 \\times 9.81/4 = 29.4$ kN.',
        'Foot area: $0.15 \\times 0.15 = 0.0225$ m², so $p = 29\\,400/0.0225 = 1.31$ MPa (13 bar).',
        'Screw tip area: $\\pi \\times 0.01^2 = 3.14\\times10^{-4}$ m², so $p = 29\\,400/3.14\\times10^{-4} = 93.7$ MPa.',
        'Ordinary concrete crushes at about 25–40 MPa. The feet are fine; bare screws would punch into the floor — levelling screws need steel pads.'
      ],
      a: '1.3 MPa under the feet; about 94 MPa under bare screws, enough to crush concrete.'
    },
    {
      title: 'The force on a manway door',
      q: 'A vessel has a circular manway door 500 mm in diameter. The vessel is at 3 bar gauge. What force does the door carry?',
      steps: [
        'Area: $A = \\pi \\times 0.25^2 = 0.196$ m².',
        'Gauge pressure is what counts — the atmosphere pushes on the outside of the door too: $F = pA = 3\\times10^5 \\times 0.196 = 58.9$ kN.',
        'That is the weight of 6 tonnes, held by the bolts. Opening such a door with pressure behind it can throw it open with lethal force.'
      ],
      a: 'About 59 kN — six tonnes.'
    },
    {
      title: 'Converting units',
      q: 'A pump data sheet gives 150 psi. What is that in bar and in metres of water?',
      steps: [
        '$150 \\times 6895 = 1.034\\times10^6$ Pa $= 10.34$ bar.',
        'Head: $h = p/(\\rho g) = 1.034\\times10^6/(1000 \\times 9.807) = 105.5$ m of water.'
      ],
      a: '10.3 bar, or about 105 m of water.'
    }
  ],
  quiz: [
    { q: 'Which way does still water push on the sloping wall of a tank?', choices: ['straight down, with its weight', 'horizontally', 'perpendicular to the wall', 'along the wall, downhill'], a: 2,
      why: 'A liquid at rest cannot carry a shear force, so the only force it can exert on a surface is normal to it.' },
    { q: 'What force does a pressure of 1 bar exert on an area of 1 m²?', answer: 100, unit: 'kN',
      why: '1 bar = 10⁵ Pa = 10⁵ N/m²; on 1 m² that is 10⁵ N = 100 kN, about the weight of ten tonnes.' },
    { q: 'The pressure at a point in a still liquid depends on which way the surface you measure it on is facing.', a: false,
      why: 'At a point the pressure is the same in all directions (a scalar); only the direction of the resulting force changes with the surface.' },
    { q: 'Which is the highest pressure?', choices: ['10 bar', '1 MPa', '150 psi', '100 m of water'], a: 2,
      why: '10 bar = 1 MPa = 1000 kPa; 150 psi = 1034 kPa; 100 m of water = 981 kPa.' },
    { q: 'A 4-tonne load rests on a hydraulic piston 50 mm in diameter. What is the oil pressure, in bar?', answer: 200, unit: 'bar',
      why: 'F = 4000 × 9.81 = 39.2 kN; A = π × 0.025² = 1.96×10⁻³ m²; p = 2.0×10⁷ Pa = 200 bar.' }
  ],
  problems: [
    { q: 'A dead-weight tester has a piston of 1.5 cm². What total mass on the piston generates 50 bar?', answer: 76.5, unit: 'kg', tol: 0.02,
      steps: ['$F = pA = 5\\times10^6 \\times 1.5\\times10^{-4} = 750$ N.', '$m = F/g = 750/9.807 = 76.5$ kg.'] },
    { q: 'A 20 kN load is spread evenly over a plate 0.8 m × 0.5 m. What pressure does the plate exert, in kPa?', answer: 50, unit: 'kPa', tol: 0.02,
      steps: ['$A = 0.8 \\times 0.5 = 0.4$ m².', '$p = 20\\,000/0.4 = 50\\,000$ Pa = 50 kPa.'] }
  ],
  applications: [
    'Choosing bearing pads, feet and foundations so that floors and soils are not overloaded.',
    'Sizing bolts on flanges, covers and manway doors of pressure vessels.',
    'Every hydraulic machine: the force of a cylinder is its pressure times its piston area.',
    'Calibrating gauges with dead weights on a piston of known area.'
  ],
  history: 'Pressure became a measurable quantity with Torricelli\'s mercury barometer (1643) and Pascal\'s experiments of the following years. The SI unit was named after Blaise Pascal in 1971; the bar, from the Greek *baros*, weight, came from meteorology early in the twentieth century.'
},

{
  id: 'gauge-absolute', parent: 'pressure-basics', title: 'Gauge and absolute pressure', level: 1,
  short: 'Absolute pressure is measured from a perfect vacuum, gauge pressure from the local atmosphere: p_abs = p_gauge + p_atm. Forces on walls and pistons use gauge pressure; gas laws, boiling and suction limits need absolute.',
  keywords: ['gauge pressure', 'absolute pressure', 'vacuum', 'barg', 'bara', 'psig', 'psia', 'atmospheric pressure', 'barometer', 'differential pressure', 'suction lift', 'altitude'],
  prereq: ['pressure-definition', 'aerodynamics:air-pressure'],
  related: ['pressure-with-depth', 'manometers', 'priming-suction', 'npsh', 'vapour-pressure', 'accumulator-sizing', 'aerodynamics:isa'],
  body: `
Every pressure is measured *from* something, and two zeros are in everyday use.

- **Absolute pressure** counts from a perfect vacuum, where there is nothing left to push. It can never be negative.
- **Gauge pressure** counts from the pressure of the air around the gauge — the local atmosphere. A tyre gauge, the dial on a hydraulic pump and the pressure quoted by a water company all read gauge.

$$p_\\text{abs} = p_g + p_a$$

A third kind, **differential pressure**, is simply the difference between two points — across a filter, an orifice plate or a pump — and needs no zero at all.

### The atmosphere is not a constant
Standard sea-level pressure is 101.325 kPa, but the real value wanders with the weather, from about 950 hPa in a deep depression to 1 050 hPa in a strong high, and it falls with height:

| Altitude | Atmospheric pressure (standard atmosphere) | Water column it can hold up |
|---|---|---|
| sea level | 101.3 kPa | 10.3 m |
| 1 000 m | 89.9 kPa | 9.2 m |
| 2 000 m | 79.5 kPa | 8.1 m |
| 3 000 m | 70.1 kPa | 7.1 m |
| 5 000 m | 54.0 kPa | 5.5 m |

So the same absolute pressure gives a different gauge reading in Rotterdam and in La Paz, and a gauge sealed at the factory reads slightly wrong in the mountains.

### Below the atmosphere: vacuum
A pressure below atmospheric has a **negative gauge value**, often quoted as a positive "vacuum": −0.8 bar gauge, a vacuum of 0.8 bar and 0.21 bar absolute are the same thing at sea level. There is a floor: at sea level no pump can pull below −1.013 bar gauge, because that is zero absolute. This is why a pump cannot *suck* water up more than about 10 m. In truth the atmosphere pushes the water up the pipe, and it can push no harder than its own pressure; vapour pressure, friction and dissolved air cut the practical figure to 6–7 m ([[priming-suction]], [[npsh]]).

### Which one to use
| Use absolute pressure for | Use gauge pressure for |
|---|---|
| gas laws, compressed-air volumes and accumulator precharge calculations | forces on pistons, walls, gates and dams — the atmosphere acts on both sides and cancels |
| boiling, vapour pressure, cavitation and NPSH | relief-valve settings and working pressures of hydraulic systems |
| barometric altitude and weather | tyre pressures and water-main pressures |

Write the zero into the unit when it matters: **bar(g)** and **bar(a)**, **psig** and **psia**, "kPa absolute". An accumulator precharge of "100 bar" is gauge by convention, but the gas-law calculation that sizes the accumulator must add the atmosphere ([[accumulator-sizing]], [[physics:ideal-gas-law|the gas laws]]).

> [!warn] A gauge reading zero tells you only about the point it is connected to. Pressure can stay trapped behind a check valve, in a cylinder holding a load or in an accumulator while the gauge shows nothing. Before any work, follow the machine's lock-out procedure: support raised loads, discharge accumulators and bleed every isolated section.
`,
  ideas: [
    'Absolute pressure is measured from vacuum and is never negative; gauge pressure is measured from the local atmosphere.',
    'p_abs = p_gauge + p_atm, and the atmosphere changes with altitude and weather.',
    'A vacuum is a negative gauge pressure, limited to −1 atm at sea level — which caps how high suction can lift a liquid.',
    'Forces on walls and pistons use gauge pressure; gas laws, boiling and cavitation need absolute pressure.'
  ],
  pitfalls: [
    'A gauge reading of zero means there is no pressure — It means the pressure equals the atmosphere at that point, about 1 bar absolute; and other parts of the system may still hold pressure.',
    'Pumps suck liquids up — The pump only lowers the pressure; the atmosphere pushes the liquid up, so the lift can never exceed about 10 m of water at sea level, and less in the mountains.',
    'Gas-law calculations can use the gauge readings — Boyle\'s law with gauge pressures gives nonsense: compressing air from 0 to 6 bar gauge is a ratio of 7, not infinity.'
  ],
  formulas: [
    {
      name: 'Absolute and gauge pressure',
      expr: 'pabs = pg + pa', tex: 'p_\\text{abs} = p_g + p_a',
      vars: {
        pabs: { name: 'absolute pressure', q: 'pressure', unit: 'kPa', tex: 'p_\\text{abs}' },
        pg: { name: 'gauge pressure', q: 'pressure', unit: 'kPa', value: 230, signed: true, tex: 'p_g' },
        pa: { name: 'local atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_a' }
      },
      note: 'A vacuum is a negative gauge pressure; the absolute pressure can never fall below zero.',
      stories: {
        pabs: 'A tyre gauge reads {pg} where the barometer reads {pa}. What is the absolute pressure in the tyre?',
        pg: 'A transmitter measures {pabs} (absolute) in a pipe where the air outside is at {pa}. What would a gauge on the pipe read?'
      }
    },
    {
      name: 'Atmospheric pressure with altitude (standard atmosphere, up to 11 km)',
      expr: 'pa = p0*(1 - 2.25577e-5*z)^5.25588', tex: 'p_a = p_0\\left(1 - 2.25577\\times10^{-5}\\,z\\right)^{5.25588}',
      vars: {
        pa: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', tex: 'p_a' },
        p0: { const: 'atm' },
        z: { name: 'altitude', q: 'length', unit: 'm', value: 1500, min: 0, max: 11000 }
      },
      note: 'The International Standard Atmosphere: 101.325 kPa and 15 °C at sea level, the temperature falling 6.5 K per kilometre. The number 2.25577×10⁻⁵ is per metre. Real weather moves the pressure by a few per cent either way.',
      stories: {
        pa: 'What is the standard atmospheric pressure at a pumping station {z} above sea level?',
        z: 'A barometer reads {pa} on a standard day. How high above sea level is it?'
      }
    },
    {
      name: 'Height of liquid the atmosphere can hold up',
      expr: 'h = (pa - pv)/(rho*g)', tex: 'h = \\dfrac{p_a - p_v}{\\rho g}',
      vars: {
        h: { name: 'height of the liquid column', q: 'length', unit: 'm' },
        pa: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_a' },
        pv: { name: 'vapour pressure of the liquid (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998 },
        g: { const: 'g' }
      },
      note: 'The height of a barometer column — and the limit of any pump lifting a liquid by suction, before friction and a margin against cavitation are taken off ([[npsh]]). With mercury (13 546 kg/m³, negligible vapour pressure) it gives the familiar 760 mm barometer.',
      stories: {
        h: 'At a site where the atmosphere is {pa}, water at a vapour pressure of {pv} and density {rho} is to be lifted by suction. What is the absolute limit of the lift?',
        pa: 'A column of a liquid of density {rho} and vapour pressure {pv} stands {h} tall in a sealed tube with its open end in a dish. What is the atmospheric pressure?'
      }
    }
  ],
  examples: [
    {
      title: 'A tyre goes up a mountain',
      q: 'A car tyre is set to 2.3 bar gauge at sea level (1.013 bar). It is driven to a pass at 2000 m, where the atmosphere is 0.795 bar. Ignoring temperature changes, what does the tyre gauge read at the top?',
      steps: [
        'The air in the tyre does not know about the outside; its volume barely changes, so its absolute pressure stays the same: $2.3 + 1.013 = 3.313$ bar(a).',
        'At the pass: $p_g = p_\\text{abs} - p_a = 3.313 - 0.795 = 2.52$ bar(g).',
        'The gauge reads 0.22 bar more although nothing inside has changed — the air outside is thinner.'
      ],
      a: 'About 2.52 bar gauge.'
    },
    {
      title: 'A vacuum lifting pad',
      q: 'A vacuum pad 100 mm in diameter holds a glass sheet. The pump pulls the pad to −0.75 bar gauge at sea level. What is the holding force? What is the best any pump could do, at sea level and at 2000 m?',
      steps: [
        'Area: $A = \\pi \\times 0.05^2 = 7.85\\times10^{-3}$ m².',
        'The atmosphere presses the sheet against the pad with the pressure difference: $F = 0.75\\times10^5 \\times 7.85\\times10^{-3} = 589$ N.',
        'A perfect vacuum can only remove the whole atmosphere: $101\\,325 \\times 7.85\\times10^{-3} = 796$ N at sea level, and $79\\,500 \\times 7.85\\times10^{-3} = 624$ N at 2000 m.'
      ],
      a: '589 N; at most 796 N at sea level and 624 N at 2000 m.'
    }
  ],
  quiz: [
    { q: 'A gauge on a closed tank at sea level (1.013 bar) reads −0.3 bar. What is the absolute pressure in the tank, in bar?', answer: 0.713, unit: 'bar',
      why: 'p_abs = p_g + p_a = −0.3 + 1.013 = 0.713 bar.' },
    { q: 'Which calculation needs absolute pressure?', choices: ['the force a hydraulic cylinder exerts', 'the volume that compressed air will occupy when released', 'the setting of a relief valve', 'the force of water on a dam gate'], a: 1,
      why: 'Gas laws (pV = const) work only with absolute pressures. Forces on pistons, gates and walls come from gauge pressure because the atmosphere acts on both sides.' },
    { q: 'For the same load, a hydraulic cylinder\'s pressure gauge reads the same at sea level and high in the mountains.', a: true,
      why: 'The load sets the pressure difference across the piston; the atmosphere acts on the rod and outside surfaces as well, so the gauge (atmosphere-referenced) reading does not change.' },
    { q: 'What is the lowest gauge pressure that can exist at sea level?', choices: ['about −1.013 bar', 'about −10 bar', '0 bar', 'there is no limit'], a: 0,
      why: 'Absolute pressure cannot fall below zero, so gauge pressure cannot fall below minus the atmosphere, −1.013 bar at sea level.' },
    { q: 'At 3000 m the atmosphere is about 70 kPa. Ignoring vapour pressure, what is the greatest height (in m) to which suction could lift water (1000 kg/m³)?', answer: 7.14, unit: 'm',
      why: 'h = p_a/(ρg) = 70 000/(1000 × 9.81) = 7.1 m — much less than the 10.3 m at sea level.' }
  ],
  problems: [
    { q: 'A vacuum gauge shows a vacuum of 600 mmHg where the barometer reads 750 mmHg. What is the absolute pressure, in kPa?', answer: 20.0, unit: 'kPa', tol: 0.02,
      steps: ['Absolute: $750 - 600 = 150$ mmHg.', '$150 \\times 133.3 = 20.0$ kPa.'] },
    { q: 'A compressor in a town 1500 m above sea level (standard atmosphere 84.6 kPa) delivers air at 7 bar gauge. What is its absolute pressure, in bar?', answer: 7.846, unit: 'bar', tol: 0.02,
      steps: ['$p_\\text{abs} = 7 + 0.846 = 7.85$ bar(a) — not the 8.01 bar it would be at sea level. Compressed-air calculations need this figure.'] }
  ],
  applications: [
    'Specifying pumps: suction lift, NPSH and cavitation are all worked in absolute pressure.',
    'Compressed air and accumulators: gas volumes are calculated with absolute pressures.',
    'Vacuum lifting, clamping and forming, whose force is limited by the atmosphere.',
    'Barometric altimeters and weather forecasting.'
  ],
  history: 'Evangelista Torricelli made the first vacuum in 1643 when a tube of mercury, upended in a dish, fell to about 76 cm and left empty space above it — explaining why the well-diggers of Florence could not suck water up more than about 10 m. Pascal had the experiment carried up the Puy de Dôme in 1648 and the column fell, proving that the air itself was doing the pushing.',
  sim: 'hs-depth-pressure'
},

{
  id: 'pressure-with-depth', parent: 'pressure-basics', title: 'Pressure and depth', level: 1,
  short: 'In a still liquid the pressure grows steadily with depth, p = p₀ + ρgh, whatever the shape of the container. A pressure can therefore be written as a head: 10.2 m of water per bar.',
  keywords: ['hydrostatic pressure', 'depth', 'rho g h', 'ρgh', 'head', 'pressure head', 'metres of water', 'hydrostatic paradox', 'water tower', 'communicating vessels', 'layers', 'free surface'],
  prereq: ['pressure-definition', 'density-specific-weight', 'physics:hydrostatic-pressure'],
  related: ['gauge-absolute', 'pascals-law', 'manometers', 'force-on-plane-surface', 'buoyancy-archimedes', 'energy-equation', 'water-supply', 'bulk-modulus'],
  body: `
Dive to the bottom of a swimming pool and your ears tell you: the deeper you go, the harder the water presses. The reason is simply weight. Every layer of liquid carries the weight of all the liquid above it, so the pressure must grow with depth.

### Where p = ρgh comes from
Picture a vertical column of liquid with cross-section $A$ and height $h$, reaching up to the free surface. Its weight, $\\rho g A h$, is held up by the extra pressure on its bottom face; the sides push only horizontally. Balancing the forces:

$$p = p_0 + \\rho g h$$

where $p_0$ is the pressure on the surface (the atmosphere, for an open tank) and $h$ the depth below it. As a rate, $\\mathrm{d}p/\\mathrm{d}z = -\\rho g$: pressure falls as you go up. Sideways, nothing changes — every point at the same level in one connected, still liquid has the same pressure. That is why a free surface is flat, why water finds its own level in connected vessels, and why a clear hose filled with water is a builder's level.

### Head: pressure in metres
Engineers often turn it round and express a pressure as the height of liquid that would produce it, the **head** $h = p/(\\rho g)$. For water one bar is 10.2 m; a pump "with 50 m of head" lifts water 50 m or raises its pressure by 4.9 bar. The same pressure is a different head in a different liquid:

| Liquid | ρ (kg/m³) | Head for 1 bar | Pressure per metre |
|---|---|---|---|
| Fresh water, 20 °C | 998 | 10.2 m | 9.79 kPa |
| Sea water | 1 025 | 9.95 m | 10.05 kPa |
| Hydraulic oil (ISO VG 46) | 870 | 11.7 m | 8.53 kPa |
| Petrol | 740 | 13.8 m | 7.26 kPa |
| Mercury | 13 546 | 0.753 m | 132.8 kPa |

### Shape does not matter
Pressure depends on depth alone — not on the width of the vessel or the amount of liquid in it. A thin pipe of water 10 m tall presses on its base exactly as hard as a lake 10 m deep. This **hydrostatic paradox** feels wrong because the lake holds far more water; the answer is that sloping or stepped walls carry the difference, pushing down or up on the liquid. Towns use it every day: a water tower whose level stands 40 m above a street gives about 3.9 bar at every tap on that street, however slim the tower ([[water-supply]]).

### Layers
Liquids that do not mix stack by density, and the pressure grows layer by layer, each at its own rate: $p = \\rho_1 g h_1 + \\rho_2 g h_2 + \\dots$ In a tank with oil floating on water, the pressure rises slowly through the oil and faster once the water begins.

### How good is "constant density"?
Water is hard to squeeze: its [[bulk-modulus]] is about 2.2 GPa, so even 4 km down, at 400 bar, it is only 1.8 % denser than at the surface, and ρgh is good to about one per cent. Gases are different — air is compressible, and its pressure falls roughly exponentially with height rather than linearly ([[aerodynamics:isa|the standard atmosphere]]).

In a hydraulic machine working at 200 bar, the few metres between pump and cylinder add or subtract only a fraction of a bar (870 × 9.81 × 3 m = 0.26 bar) and are usually ignored — except on a pump's suction side, where every tenth of a bar counts ([[npsh]]).

> [!key] Pressure in a still liquid depends only on the depth below the free surface and the density of what lies above; add the pressure on the surface for the absolute value.
`,
  derivation: {
    title: 'Derive p = p₀ + ρgh',
    steps: [
      { text: 'Take a thin horizontal slice of liquid of area $A$ and thickness $\\mathrm{d}z$, with $z$ measured upwards. Its weight is $\\rho g A\\,\\mathrm{d}z$.' },
      { text: 'Pressure $p$ pushes up on its bottom face and $p + \\mathrm{d}p$ down on its top. The slice is at rest, so the vertical forces balance:', tex: 'pA - (p + \\mathrm{d}p)A - \\rho g A\\,\\mathrm{d}z = 0 \\;\\Rightarrow\\; \\dv{p}{z} = -\\rho g' },
      { text: 'With constant density, integrate from the surface ($z = 0$, $p = p_0$) down to depth $h$ ($z = -h$):', tex: 'p = p_0 + \\rho g h' }
    ]
  },
  ideas: [
    'Pressure grows linearly with depth: p = p₀ + ρgh, because each layer carries the weight of the liquid above it.',
    'At the same level in one connected, still liquid the pressure is the same — so free surfaces are level.',
    'Only depth and density matter, not the shape or size of the container (the hydrostatic paradox).',
    'A pressure can be written as a head h = p/(ρg): 1 bar is 10.2 m of water, 11.7 m of oil, 0.75 m of mercury.',
    'Water is so stiff that its density hardly changes with depth; gases are not.'
  ],
  pitfalls: [
    'A wide tank presses harder on its base than a narrow one of the same depth — The pressure on the base is ρgh in both; the wide tank has more base area and so more total force, but the pressure is the same.',
    'Pressure depends on the distance from the bottom — It depends on the depth below the free surface. A sensor 1 m above the floor of a 5 m tank feels 4 m of head.',
    'Head and pressure are interchangeable numbers — Only with the density stated: 10 m of oil is 0.85 bar, 10 m of water 0.98 bar, 10 m of mercury 13.3 bar.'
  ],
  formulas: [
    {
      name: 'Gauge pressure at depth',
      expr: 'p = rho*g*h', tex: 'p = \\rho g h',
      vars: {
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'kPa' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998 },
        g: { const: 'g' },
        h: { name: 'depth below the free surface', q: 'length', unit: 'm', value: 10 }
      },
      note: 'Read backwards it gives the head of a pressure, h = p/(ρg): 10.2 m of water per bar.',
      stories: {
        p: 'What is the gauge pressure {h} below the surface of a liquid of density {rho}?',
        h: 'A pressure sensor at the bottom of a tank of liquid of density {rho} reads {p}. How deep is the liquid above it?',
        rho: 'A column of liquid {h} tall produces {p} at its base. What is the density of the liquid?'
      }
    },
    {
      name: 'Absolute pressure at depth',
      expr: 'pabs = pa + rho*g*h', tex: 'p_\\text{abs} = p_a + \\rho g h',
      vars: {
        pabs: { name: 'absolute pressure', q: 'pressure', unit: 'kPa', tex: 'p_\\text{abs}' },
        pa: { name: 'pressure on the surface (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_a' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1025 },
        g: { const: 'g' },
        h: { name: 'depth below the free surface', q: 'length', unit: 'm', value: 30 }
      },
      stories: {
        pabs: 'A diver is {h} down in sea water of density {rho}; the air above is at {pa}. At what absolute pressure must her regulator deliver air?',
        h: 'A sealed depth sensor reads {pabs} (absolute) in water of density {rho} under an atmosphere of {pa}. How deep is it?'
      }
    },
    {
      name: 'Two layers of liquid',
      expr: 'p = rho1*g*h1 + rho2*g*h2', tex: 'p = \\rho_1 g h_1 + \\rho_2 g h_2',
      vars: {
        p: { name: 'pressure at the bottom (gauge)', q: 'pressure', unit: 'kPa' },
        rho1: { name: 'density of the upper layer', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho_1' },
        g: { const: 'g' },
        h1: { name: 'thickness of the upper layer', q: 'length', unit: 'm', value: 2, tex: 'h_1' },
        rho2: { name: 'density of the lower layer', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho_2' },
        h2: { name: 'thickness of the lower layer', q: 'length', unit: 'm', value: 1.5, tex: 'h_2' }
      },
      stories: {
        p: 'A tank holds {h1} of oil of density {rho1} floating on {h2} of water of density {rho2}. What is the gauge pressure at the bottom?',
        h1: 'A separator has {h2} of water (density {rho2}) under a layer of oil (density {rho1}). The bottom pressure is {p}. How thick is the oil layer?'
      }
    }
  ],
  examples: [
    {
      title: 'Pressure from a water tower',
      q: 'The water level in a tower stands 38 m above a street. What static pressure does a tap on the street see, and a tap on a floor 24 m above the street? (ρ = 998 kg/m³)',
      steps: [
        'Street: $p = \\rho g h = 998 \\times 9.81 \\times 38 = 3.72\\times10^5$ Pa = 3.72 bar.',
        'Upper floor: the depth below the tower level is $38 - 24 = 14$ m, so $p = 998 \\times 9.81 \\times 14 = 1.37$ bar.',
        'Tall buildings need booster pumps: the top floors are too close to the tower\'s level for a useful pressure.'
      ],
      a: '3.72 bar at the street and 1.37 bar on the upper floor (static, with no flow).'
    },
    {
      title: 'Oil on water',
      q: 'A tank holds 2 m of oil (ρ = 870 kg/m³) floating on 1.5 m of water (ρ = 998 kg/m³). What is the gauge pressure at the bottom, and what depth of water alone would give the same?',
      steps: [
        'Oil layer: $870 \\times 9.81 \\times 2 = 17.1$ kPa.',
        'Water layer: $998 \\times 9.81 \\times 1.5 = 14.7$ kPa.',
        'Total: $31.7$ kPa. As a head of water: $31\\,700/(998 \\times 9.81) = 3.24$ m — less than the 3.5 m of liquid in the tank, because the oil is lighter.'
      ],
      a: '31.7 kPa gauge, equivalent to 3.24 m of water.'
    }
  ],
  quiz: [
    { q: 'Three vessels — a wide tank, a narrow tube and a funnel widening upwards — are filled with water to the same depth. Where is the pressure at the bottom greatest?', choices: ['in the wide tank', 'in the narrow tube', 'in the funnel', 'it is the same in all three'], a: 3,
      why: 'Pressure depends only on the depth below the free surface and the density — the hydrostatic paradox.' },
    { q: 'What is the gauge pressure 25 m below the surface of fresh water (1000 kg/m³), in kPa?', answer: 245, unit: 'kPa',
      why: 'p = ρgh = 1000 × 9.81 × 25 = 245 kPa, about 2.5 bar.' },
    { q: 'In a still, connected body of one liquid, all points at the same level have the same pressure.', a: true,
      why: 'There is no weight to support sideways, so no pressure change horizontally. (Across a different liquid, or through a closed valve, the rule does not apply.)' },
    { q: 'Tank A holds 1 m of oil (ρ = 850) floating on 1 m of water; tank B holds 2 m of water. Compared with B, the bottom pressure in A is…', choices: ['the same', 'lower', 'higher', 'it depends on the width of the tanks'], a: 1,
      why: 'Through the oil the pressure rises by 850·g per metre instead of 1000·g: A has 0.85 + 1.0 = 1.85 m of water head against B\'s 2 m.' },
    { q: 'How many metres of hydraulic oil (870 kg/m³) make a pressure of 5 bar?', answer: 58.6, unit: 'm',
      why: 'h = p/(ρg) = 5×10⁵/(870 × 9.81) = 58.6 m.' }
  ],
  problems: [
    { q: 'A pressure sensor at the bottom of a well reads 0.65 bar gauge. How deep is the water above it (1000 kg/m³)?', answer: 6.63, unit: 'm', tol: 0.02,
      steps: ['$h = p/(\\rho g) = 65\\,000/(1000 \\times 9.807) = 6.63$ m.'] },
    { q: 'What is the absolute pressure 50 m down in sea water (1025 kg/m³) under a standard atmosphere, in bar?', answer: 6.04, unit: 'bar', tol: 0.02,
      steps: ['$\\rho g h = 1025 \\times 9.807 \\times 50 = 5.03\\times10^5$ Pa.', 'Add the atmosphere: $5.03 + 1.013 = 6.04$ bar(a).'] }
  ],
  applications: [
    'Water towers and hilltop reservoirs that pressurise town water supplies by height alone.',
    'Level measurement: a pressure sensor at the bottom of a tank reads the depth of its contents.',
    'Submarine and diving design: every 10 m of sea water adds about one bar.',
    'Suction lines of pumps, where the static head decides whether the liquid boils.'
  ],
  history: 'Simon Stevin described the hydrostatic paradox in 1586, showing that the force on the bottom of a vessel depends only on the depth of water above it. Pascal and Boyle turned it into experiments in the seventeenth century.',
  sim: 'hs-depth-pressure'
},

{
  id: 'pascals-law', parent: 'pressure-basics', title: 'Pascal\'s law', level: 1,
  short: 'A pressure applied to a confined liquid at rest is transmitted undiminished to every part of it and to its walls. It is the principle behind hydraulic presses, jacks, brakes and all of fluid power.',
  keywords: ['Pascal', 'Pascal\'s law', 'Pascal\'s principle', 'transmission of pressure', 'confined liquid', 'force multiplication', 'brakes', 'master cylinder', 'spongy', 'bleeding', 'Pascal\'s barrel'],
  prereq: ['pressure-with-depth', 'physics:pascals-principle'],
  related: ['hydraulic-press', 'force-multiplication', 'hydraulic-cylinder', 'vehicle-brakes', 'bulk-modulus', 'air-in-oil', 'hydraulic-stiffness', 'intensifiers'],
  body: `
Squeeze a closed plastic bottle full of water and the cap, the base and every bit of the wall feel the squeeze at once. **Pascal's law** says exactly how: a change of pressure applied to a confined liquid at rest is passed on, undiminished, to every part of the liquid and to the walls that hold it. Together with the weight of the liquid itself, the pressure at any point is

$$p = p_\\text{applied} + \\rho g h$$

— whatever you push with at the top, plus the depth below it.

### Why a liquid behaves like this
Two properties make it work. A liquid at rest cannot hold a shear force, so it cannot lean harder on some parts of the container than on others; and it is nearly incompressible, so pushing on it does not use the push up in squashing it. The pressure increase therefore spreads through the whole volume. It travels at the speed of sound in the liquid — about 1 400 m/s in oil and 1 480 m/s in water — so in a 10 m hose the whole circuit knows within a hundredth of a second.

### Force multiplication
The same pressure acts on every square millimetre of every surface, so a large piston receives a large force: $F_2 = F_1\\,A_2/A_1$. A 20 mm piston pushed with 200 N makes 6.4 bar; a 100 mm piston connected to it has 25 times the area and receives 5 kN. That single idea runs through the [[hydraulic-press]], the dentist's chair, car brakes and every excavator ([[force-multiplication]]).

In a car's brakes the driver's foot, helped by the pedal lever and the servo, pushes the master-cylinder piston; the brake fluid carries the pressure to calliper pistons two to three times its diameter, which clamp the pads onto the discs with several times the force ([[vehicle-brakes]]).

### Where it stops being true
- **Flow.** Pascal's law is a law of liquids at rest. Once the liquid moves, friction in pipes, hoses and valves eats pressure ([[darcy-weisbach]], [[minor-losses]]); a gauge at the pump reads more than a gauge at the cylinder by exactly those losses.
- **Height.** The $\\rho g h$ term is always there. In oil it is 0.085 bar per metre — nothing at 250 bar, a great deal in a low-pressure water system.
- **Air.** A bubble of trapped air is squeezed before the pressure can rise, so the pedal or lever travels without effect. That is the spongy feel of brakes that need bleeding, and it makes hydraulic actuators soft and slow ([[air-in-oil]], [[hydraulic-stiffness]]).
- **Elastic walls.** Hoses swell under pressure and store a little oil — and energy.

> [!warn] Pascal's law works for escaping oil too: a pinhole leak sees the full system pressure and can drive a fine jet through skin. An injection injury looks small but is a surgical emergency — seek emergency medical care at once. Never feel for a leak with a hand; look for it with a piece of card, and depressurise the system before tightening anything.
`,
  ideas: [
    'A pressure change applied anywhere in a confined liquid at rest reaches every point undiminished.',
    'The pressure at a point is the applied pressure plus ρgh for its depth below the point of application.',
    'Equal pressure on unequal areas gives unequal forces: F₂/F₁ = A₂/A₁ — the basis of all hydraulic force multiplication.',
    'The law holds for liquids at rest; flow losses, trapped air and height differences modify it in real circuits.'
  ],
  pitfalls: [
    'A bigger piston makes a bigger pressure — The pressure is the same everywhere; the bigger piston gets a bigger force because it has more area.',
    'Pascal\'s law means the pressure is the same everywhere in a working circuit — Only when nothing flows. With flow, every pipe, hose and valve takes its pressure drop.',
    'Force multiplication gives something for nothing — The large piston moves less, by the same ratio; the work in equals the work out, less losses.'
  ],
  formulas: [
    {
      name: 'Pressure under a loaded piston',
      expr: 'p = F/A + rho*g*h', tex: 'p = \\dfrac{F}{A} + \\rho g h',
      vars: {
        p: { name: 'pressure at the point (gauge)', q: 'pressure', unit: 'bar' },
        F: { name: 'force on the piston', q: 'force', unit: 'kN', value: 5 },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 20 },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 870 },
        g: { const: 'g' },
        h: { name: 'depth of the point below the piston', q: 'length', unit: 'm', value: 2, signed: true }
      },
      note: 'Pascal\'s law plus the weight of the liquid; h is negative for a point above the piston. At hydraulic pressures the ρgh term is usually a fraction of a per cent.',
      stories: {
        p: 'A piston of {A} is loaded with {F}. What is the pressure {h} below it, in oil of density {rho}?',
        F: 'A pressure of {p} is needed at a point {h} below a piston of {A}, in oil of density {rho}. What force must push the piston?'
      }
    },
    {
      name: 'Forces on two connected pistons',
      expr: 'F2 = F1*(D2/D1)^2', tex: 'F_2 = F_1\\left(\\dfrac{D_2}{D_1}\\right)^2',
      vars: {
        F2: { name: 'force on the large piston', q: 'force', unit: 'kN', tex: 'F_2' },
        F1: { name: 'force on the small piston', q: 'force', unit: 'N', value: 200, tex: 'F_1' },
        D1: { name: 'diameter of the small piston', q: 'length', unit: 'mm', value: 20, tex: 'D_1' },
        D2: { name: 'diameter of the large piston', q: 'length', unit: 'mm', value: 100, tex: 'D_2' }
      },
      note: 'Pistons at the same level, liquid at rest, friction neglected. The areas go with the square of the diameters.',
      stories: {
        F2: 'A {D1} piston is pushed with {F1}. What force does a connected {D2} piston deliver?',
        D2: 'A {D1} piston pushed with {F1} must lift {F2}. What diameter must the large piston have?'
      }
    }
  ],
  examples: [
    {
      title: 'Brake pressure',
      q: 'A master cylinder of 22 mm bore is pushed with 1.2 kN (the driver\'s foot multiplied by the pedal and the servo). What is the brake-fluid pressure, and what force does a 54 mm calliper piston exert?',
      steps: [
        'Master area: $\\pi \\times 0.011^2 = 3.80\\times10^{-4}$ m², so $p = 1200/3.80\\times10^{-4} = 3.16$ MPa = 31.6 bar.',
        'Calliper area: $\\pi \\times 0.027^2 = 2.29\\times10^{-3}$ m².',
        'Force: $F = 3.16\\times10^6 \\times 2.29\\times10^{-3} = 7.2$ kN — six times the master force, the area ratio $(54/22)^2 = 6.0$.'
      ],
      a: '31.6 bar; about 7.2 kN on each calliper piston.'
    },
    {
      title: 'Does height matter?',
      q: 'A pump at ground level feeds a cylinder 6 m up a crane mast. At rest, the pump gauge reads 180 bar. What is the pressure at the cylinder (oil 870 kg/m³)? What would a 6 m rise do in a water system at 3 bar?',
      steps: [
        'Head of 6 m of oil: $870 \\times 9.81 \\times 6 = 51\\,200$ Pa = 0.51 bar.',
        'At the cylinder: $180 - 0.51 = 179.5$ bar — a 0.3 % difference.',
        'In water: $998 \\times 9.81 \\times 6 = 0.59$ bar, a fifth of 3 bar. Height matters in water supply, hardly at all in high-pressure hydraulics.'
      ],
      a: '179.5 bar at the cylinder; in a 3 bar water system the same rise would cost 0.59 bar.'
    }
  ],
  quiz: [
    { q: 'You push the plunger of a sealed syringe full of water. Where does the pressure rise?', choices: ['only at the plunger', 'only at the far end', 'equally everywhere in the water', 'mostly at the walls'], a: 2,
      why: 'In a confined liquid at rest the applied pressure is transmitted undiminished to every point and to the walls.' },
    { q: 'Pascal\'s law holds exactly in a long pipe while oil flows through it quickly.', a: false,
      why: 'Flowing liquid loses pressure to friction along the pipe and in fittings; Pascal\'s law describes liquids at rest.' },
    { q: 'A 20 mm piston pushes with 100 N on oil that also acts on a 200 mm piston. What force does the large piston deliver, in kN?', answer: 10, unit: 'kN',
      why: 'The area ratio is (200/20)² = 100, so the force is 100 × 100 N = 10 kN.' },
    { q: 'Why does air in the brake lines make the pedal "spongy"?', choices: ['air leaks out through the seals', 'the air must be compressed before the pressure can rise, so the pedal travels further', 'air lowers the fluid\'s boiling point', 'air bubbles block the pipes'], a: 1,
      why: 'A liquid transmits pressure because it is nearly incompressible. Air is very compressible, so pedal travel goes into squeezing it.' },
    { q: 'Pascal\'s barrel is said to have burst when a few jugs of water were poured into a tall thin tube fixed to it. Why?', choices: ['the water in the tube was very heavy', 'the pressure at the barrel depends on the height of water in the tube, not its small weight', 'the tube acted as a lever', 'the water froze'], a: 1,
      why: 'A tall column gives a large ρgh at the barrel whatever its cross-section; that pressure acts on the whole inside of the barrel.' }
  ],
  problems: [
    { q: 'A car lift has a ram 250 mm in diameter and is fed from a pump plunger 25 mm in diameter. What force on the plunger lifts a 1500 kg car (ignore friction and the platform)?', answer: 147, unit: 'N', tol: 0.02,
      steps: ['Weight: $1500 \\times 9.81 = 14\\,710$ N.', 'Area ratio: $(250/25)^2 = 100$.', '$F_1 = 14\\,710/100 = 147$ N.'] }
  ],
  applications: [
    'Hydraulic presses, jacks and car lifts.',
    'Vehicle brakes and clutches: master and slave cylinders connected by fluid.',
    'All fluid-power machines — excavators, aircraft controls, injection-moulding machines.',
    'Dead-weight testers, which make a precise pressure from a mass on a piston.'
  ],
  history: 'Blaise Pascal described the principle in his *Treatise on the Equilibrium of Liquids*, written around 1653 and published after his death in 1663, and foresaw the hydraulic press in it. He is said to have burst a barrel by pouring a few jugs of water into a tall, thin tube fixed to its lid — the story may be embellished, but the physics is sound.',
  sim: ['hs-hydraulic-jack', 'hs-depth-pressure']
},

{
  id: 'hydraulic-press', parent: 'pressure-basics', title: 'The hydraulic press and jack', level: 1,
  short: 'Two pistons connected by oil: the force grows by the area ratio, the distance shrinks by the same ratio, and the work is conserved. A jack adds a lever, a pump plunger, two check valves and a release valve.',
  keywords: ['hydraulic press', 'hydraulic jack', 'bottle jack', 'trolley jack', 'Bramah', 'mechanical advantage', 'area ratio', 'plunger', 'ram', 'check valve', 'release valve', 'pump strokes', 'lever'],
  prereq: ['pascals-law', 'physics:work'],
  related: ['force-multiplication', 'hydraulic-cylinder', 'industrial-presses', 'lifts-cranes', 'check-valves', 'intensifiers', 'positive-displacement'],
  body: `
Two pistons of different size, connected by a pipe full of oil: push the small one and the large one rises with a much larger force. It is the oldest machine of hydraulics and still the simplest way to lift a car or press out a bearing.

### Force: the area ratio
The oil is at one pressure throughout ([[pascals-law]]), so $p = F_1/A_1 = F_2/A_2$ and

$$F_2 = F_1\\,\\frac{A_2}{A_1} = F_1 \\left(\\frac{D}{d}\\right)^2$$

A ram 2.5 times the diameter of the plunger has 6.25 times its area and pushes 6.25 times as hard.

### Distance: the price
Oil is practically incompressible, so the volume the plunger pushes out is the volume the ram takes in: $s_1 A_1 = s_2 A_2$. The large piston moves less, by exactly the ratio it gained in force. Multiply the two and the work is the same at both ends, $F_1 s_1 = F_2 s_2$ — a hydraulic press is a lever made of oil. It multiplies force, never energy; friction in the seals and a little leakage past the valves mean slightly less comes out than goes in, typically 85–95 %.

### The hydraulic jack
A single plunger stroke would lift a ram only a few millimetres, so a jack pumps. Its parts:

1. A **reservoir** of oil at atmospheric pressure.
2. A **pump plunger**, worked by a long **handle** — a lever that multiplies the hand's force again.
3. An **inlet check valve**: on the upstroke the plunger draws oil from the reservoir through it.
4. An **outlet check valve**: on the downstroke it lets oil into the ram cylinder — and between strokes it holds the load.
5. The **ram**, which lifts the load.
6. A **release valve**, opened by hand to let the ram's oil back to the reservoir and lower the load, and usually an **overload valve** that stops the jack lifting more than its rating.

The total mechanical advantage is the lever ratio times the area ratio. A trolley jack with a 14 mm plunger, a 35 mm ram and a 20 : 1 handle has $20 \\times 6.25 = 125$: a 20 kN (2-tonne) load needs 160 N on the handle, or about 190 N allowing for losses. The ram pressure is 208 bar, and each 25 mm plunger stroke lifts the ram 4 mm — so 100 mm of lift takes 25 strokes. Compare the work: 160 N over 25 strokes of 0.5 m of hand travel is 2 kJ, and 20 kN lifted 0.1 m is 2 kJ.

| Plunger × ram (mm) | Area ratio | Ram pressure at 20 kN | Lift per 25 mm stroke |
|---|---|---|---|
| 14 × 35 | 6.25 | 208 bar | 4.0 mm |
| 12 × 40 | 11.1 | 159 bar | 2.25 mm |
| 16 × 50 | 9.77 | 102 bar | 2.56 mm |
| 10 × 25 | 6.25 | 407 bar | 4.0 mm |

A small ram means high pressure and quick lifting; a large ram means lower pressure, more strokes and a lighter handle.

### Presses
The same arrangement, driven by a powered pump, makes a hydraulic press: from a 20-tonne workshop press to forging presses of tens of thousands of tonnes ([[industrial-presses]]). The pressure can be raised further with an [[intensifiers|intensifier]], and the working piston becomes a [[hydraulic-cylinder]].

> [!warn] A jack lifts; it does not hold. Never work under a load supported only by a jack: set it on rated axle stands or blocks on firm, level ground, and chock the wheels. Open the release valve slowly — the load comes down under its own weight. Jacks work at hundreds of bar: never check a leaking jack by hand.
`,
  ideas: [
    'Force ratio = area ratio: F₂/F₁ = A₂/A₁ = (D/d)².',
    'Distance ratio is the inverse: the large piston moves less, s₂ = s₁ A₁/A₂.',
    'Work is conserved: F₁s₁ = F₂s₂, less friction and leakage — hydraulics multiplies force, not energy.',
    'A jack pumps: inlet and outlet check valves let many small strokes add up, and the outlet check holds the load between strokes.',
    'The overall mechanical advantage of a jack is the handle\'s lever ratio times the area ratio.'
  ],
  pitfalls: [
    'A hydraulic press creates energy — It trades distance for force. The work done on the handle is at least the work done on the load.',
    'The pressure in the jack depends on how hard you push the handle — It depends on the load: p = W/A_ram. Pushing harder only makes the ram rise once the pressure the load needs is reached.',
    'A jack can be left holding a load safely — The load hangs on check-valve seats and seals that can leak or fail; loads must be supported mechanically.'
  ],
  formulas: [
    {
      name: 'Force ratio of a hydraulic press',
      expr: 'F2 = F1*A2/A1', tex: 'F_2 = F_1\\,\\dfrac{A_2}{A_1}',
      vars: {
        F2: { name: 'force on the ram', q: 'force', unit: 'kN', tex: 'F_2' },
        F1: { name: 'force on the plunger', q: 'force', unit: 'kN', value: 3.2, tex: 'F_1' },
        A1: { name: 'plunger area', q: 'area', unit: 'cm²', value: 1.539, tex: 'A_1' },
        A2: { name: 'ram area', q: 'area', unit: 'cm²', value: 9.621, tex: 'A_2' }
      },
      stories: {
        F2: 'A press has a plunger of {A1} and a ram of {A2}. The plunger is pushed with {F1}. What force does the ram deliver?',
        A2: 'A plunger of {A1} is pushed with {F1}, and the ram must deliver {F2}. What ram area is needed?'
      }
    },
    {
      name: 'Volume balance: how far the ram moves',
      expr: 's2 = s1*A1/A2', tex: 's_2 = s_1\\,\\dfrac{A_1}{A_2}',
      vars: {
        s2: { name: 'ram travel', q: 'length', unit: 'mm', tex: 's_2' },
        s1: { name: 'plunger stroke', q: 'length', unit: 'mm', value: 25, tex: 's_1' },
        A1: { name: 'plunger area', q: 'area', unit: 'cm²', value: 1.539, tex: 'A_1' },
        A2: { name: 'ram area', q: 'area', unit: 'cm²', value: 9.621, tex: 'A_2' }
      },
      note: 'Incompressible oil and no leakage past the check valves.',
      stories: { s2: 'A plunger of {A1} makes a stroke of {s1}. How far does a ram of {A2} rise?' }
    },
    {
      name: 'Handle force of a hydraulic jack',
      expr: 'Fh = W*(d/D)^2/(i*eta)', tex: 'F_h = \\dfrac{W}{i\\,\\eta}\\left(\\dfrac{d}{D}\\right)^2',
      vars: {
        Fh: { name: 'force on the handle', q: 'force', unit: 'N', tex: 'F_h' },
        W: { name: 'load on the ram', q: 'force', unit: 'kN', value: 20 },
        d: { name: 'plunger diameter', q: 'length', unit: 'mm', value: 14 },
        D: { name: 'ram diameter', q: 'length', unit: 'mm', value: 35 },
        i: { name: 'lever ratio of the handle', value: 20 },
        eta: { name: 'mechanical efficiency', q: 'ratio', unit: '%', value: 85, min: 1, max: 100 }
      },
      note: 'The lever ratio is the handle length divided by the distance from the pivot to the plunger pin.',
      practice: { unknowns: ['Fh', 'W', 'D'] },
      stories: {
        Fh: 'A jack has a {d} plunger, a {D} ram and a handle with a lever ratio of {i}; its efficiency is {eta}. What force on the handle lifts {W}?',
        W: 'A person can push {Fh} on the handle of a jack with a {d} plunger, a {D} ram, lever ratio {i} and efficiency {eta}. What load can they lift?'
      }
    },
    {
      name: 'Number of strokes to lift the ram',
      expr: 'n = x*D^2/(s*d^2)', tex: 'n = \\dfrac{x\\,D^2}{s\\,d^2}',
      vars: {
        n: { name: 'number of pump strokes' },
        x: { name: 'required lift', q: 'length', unit: 'mm', value: 100 },
        D: { name: 'ram diameter', q: 'length', unit: 'mm', value: 35 },
        s: { name: 'plunger stroke', q: 'length', unit: 'mm', value: 25 },
        d: { name: 'plunger diameter', q: 'length', unit: 'mm', value: 14 }
      },
      stories: { n: 'A jack with a {d} plunger making {s} strokes drives a {D} ram. How many strokes lift the load by {x}?' }
    }
  ],
  examples: [
    {
      title: 'A trolley jack',
      q: 'A trolley jack has a 14 mm plunger with a 25 mm stroke, a 35 mm ram and a handle with a lever ratio of 20. It lifts one corner of a car, a load of 20 kN. Find the oil pressure, the handle force (ideal, and at 85 % efficiency), the lift per stroke and the strokes for 100 mm.',
      steps: [
        'Areas: plunger $\\pi \\times 0.007^2 = 1.54\\times10^{-4}$ m², ram $\\pi \\times 0.0175^2 = 9.62\\times10^{-4}$ m²; area ratio 6.25.',
        'Pressure: $p = 20\\,000/9.62\\times10^{-4} = 20.8$ MPa = 208 bar.',
        'Force on the plunger: $20\\,000/6.25 = 3.2$ kN; on the handle $3200/20 = 160$ N, or $160/0.85 = 188$ N with losses.',
        'Lift per stroke: $25/6.25 = 4.0$ mm; for 100 mm, $100/4 = 25$ strokes.'
      ],
      a: '208 bar; 160 N ideal, about 190 N real; 4 mm per stroke; 25 strokes.'
    },
    {
      title: 'Work in, work out',
      q: 'The same jack lifts a 1500 kg load by 300 mm. How much work does the load gain, and how much work does the operator do at 85 % efficiency? How many strokes does it take?',
      steps: [
        'Load: $W = 1500 \\times 9.81 = 14.7$ kN; work gained $14\\,700 \\times 0.3 = 4.41$ kJ.',
        'Handle force: $14\\,700/(125 \\times 0.85) = 138$ N, over $25 \\times 20 = 500$ mm of hand travel per stroke: 69 J per stroke.',
        'Each stroke lifts 4 mm, so 300 mm takes 75 strokes: $75 \\times 69 = 5.2$ kJ at the handle.',
        '$4.41/5.2 = 0.85$: the efficiency, as it must be. The force was multiplied 106 times; the work was not.'
      ],
      a: '4.41 kJ gained by the load, about 5.2 kJ done by the operator, in 75 strokes.'
    }
  ],
  quiz: [
    { q: 'A jack\'s ram has 50 times the area of its plunger. The plunger moves down 20 mm. How far does the ram rise?', choices: ['1000 mm', '20 mm', '0.4 mm', '2.5 mm'], a: 2,
      why: 'The volume is the same: s₂ = s₁ A₁/A₂ = 20/50 = 0.4 mm. Fifty times the force, one fiftieth of the distance.' },
    { q: 'A hydraulic press multiplies energy as well as force.', a: false,
      why: 'Work in = work out (less losses): the ram moves as much less as it pushes harder.' },
    { q: 'A plunger 10 mm in diameter is pushed with 200 N; the ram is 50 mm in diameter. What force does the ram exert, in kN?', answer: 5, unit: 'kN',
      why: 'Area ratio (50/10)² = 25; 25 × 200 N = 5000 N.' },
    { q: 'Between pump strokes, what stops the load from pushing the oil back into the pump?', choices: ['the inlet check valve', 'the outlet check valve', 'the release valve', 'the handle'], a: 1,
      why: 'On the upstroke the pump chamber is at low pressure; the outlet (delivery) check valve closes and the ram\'s oil is trapped.' },
    { q: 'The ram diameter of a jack is doubled; plunger, lever and load stay the same. What happens?', choices: ['handle force ×4, strokes ÷4', 'handle force ÷4, strokes ×4', 'handle force ÷2, strokes ×2', 'nothing changes'], a: 1,
      why: 'The ram area grows four times: the pressure and handle force fall to a quarter, and each stroke lifts a quarter as far.' }
  ],
  problems: [
    { q: 'A hand press has an 80 mm ram, a 12 mm plunger and a lever ratio of 10. The operator pushes the handle with 300 N. What is the ideal force on the ram, in kN?', answer: 133.3, unit: 'kN', tol: 0.02,
      steps: ['Plunger force: $300 \\times 10 = 3000$ N.', 'Area ratio: $(80/12)^2 = 44.4$.', 'Ram force: $3000 \\times 44.4 = 133$ kN — about 13.6 tonnes.'] },
    { q: 'An old air-over-oil car lift has a ram 250 mm in diameter carrying a 3000 kg car on a 500 kg platform. What oil pressure holds it up, in bar?', answer: 6.99, unit: 'bar', tol: 0.02,
      steps: ['Load: $3500 \\times 9.81 = 34\\,300$ N.', 'Area: $\\pi \\times 0.125^2 = 0.0491$ m².', '$p = 34\\,300/0.0491 = 6.99\\times10^5$ Pa = 7.0 bar — which is why such lifts could run on a workshop\'s compressed-air supply.'] }
  ],
  applications: [
    'Trolley, bottle and toe jacks for vehicles and machinery.',
    'Workshop presses for bearings, bushes and straightening.',
    'Forging and extrusion presses of thousands of tonnes.',
    'Hydraulic lifting of bridges and buildings, where many synchronised jacks share the load.'
  ],
  history: 'Joseph Bramah, a London locksmith and inventor, patented the hydraulic press in 1795; his workshop foreman Henry Maudslay is credited with the self-tightening leather collar that finally made it hold pressure. Bramah presses baled cotton, tested chain cables and in 1849–1850 raised the iron tubes of the Britannia Bridge over the Menai Strait.',
  sim: 'hs-hydraulic-jack'
},

{
  id: 'manometers', parent: 'pressure-basics', title: 'Manometers and pressure gauges', level: 2,
  short: 'Measuring pressure by balancing it against a column of liquid — piezometers, U-tube, differential and inclined manometers — and the Bourdon gauges, transducers and dead-weight testers used in practice.',
  keywords: ['manometer', 'U-tube', 'piezometer', 'differential manometer', 'inclined manometer', 'mercury', 'Bourdon tube', 'pressure gauge', 'pressure transducer', 'dead-weight tester', 'calibration', 'mmHg', 'inches of water'],
  prereq: ['pressure-with-depth', 'gauge-absolute', 'density-specific-weight'],
  related: ['venturi-meter', 'orifice-plate', 'pitot-static-water', 'pressure-definition', 'electronics:sensors', 'hydraulic-safety'],
  body: `
Before dials and electronics, pressure was measured by balancing it against a column of liquid, and the method is still the reference for low pressures: a liquid column has no spring to drift and no electronics to calibrate. Its reading is a length, turned into pressure by $p = \\rho g h$.

### Piezometer and U-tube
The simplest is a **piezometer**, a vertical tube tapped into a pipe: the liquid climbs until its weight balances the pressure, and the height *is* the pressure head. It needs a tall tube (10 m per bar of water) and cannot measure gases or suction.

A **U-tube manometer** holds a denser liquid — water or oil for draughts, mercury for higher pressures — in a bent tube. One rule solves every arrangement: **start at one end, add ρgh for every step down, subtract it for every step up, and set pressures equal at the same level only within one continuous liquid.** For a pipe of liquid of density $\\rho$ connected to a U-tube of manometer liquid $\\rho_m$, open on its far side:

$$p_A + \\rho g y = \\rho_m g h \\quad\\Rightarrow\\quad p_A = \\rho_m g h - \\rho g y$$

where $y$ is the depth of the manometer interface below the pipe centre and $h$ the difference between the two manometer levels.

### Differential manometer
Connect both legs to two points of a pipe — either side of an [[orifice-plate]] or across a [[venturi-meter]] — and the reading is the pressure *difference*. With the pipe liquid filling both legs above the manometer liquid, the columns of pipe liquid partly cancel:

$$p_1 - p_2 = (\\rho_m - \\rho)\\,g h$$

Mercury under water gives $(13\\,546 - 998) \\times 9.81 = 123$ kPa per metre, so a 100 mm reading is 12.3 kPa. Forgetting the $-\\rho$ is the classic error, and makes the answer 8 % too high. If the pipe liquid is heavier than the manometer fluid, the U-tube is turned upside down with air or a light oil at the top.

### Inclined manometer
For tiny pressures — duct draughts, filter drops, wind-tunnel work — the reading leg is laid at a shallow angle θ. The liquid must travel $L = h/\\sin\\theta$ along it to rise $h$: at 10° the scale is stretched 5.8 times, so single pascals become readable.

$$\\Delta p = \\rho_m g L \\sin\\theta$$

### Gauges and transducers
Most working instruments are mechanical or electronic, calibrated against a column or a dead weight.

- **Bourdon tube** (Eugène Bourdon, 1849): a flattened, curved tube that tries to straighten when pressurised; a linkage and gear turn the pointer. Ranges from under a bar to thousands of bar; accuracy classes from 0.1 to 4 per cent of full scale (EN 837-1:1996). Liquid-filled cases and snubbers calm pulsating pressure.
- **Diaphragm and capsule gauges** for low pressures and for corrosive or viscous media.
- **Pressure transducers**: strain gauges or a piezoresistive silicon chip on a diaphragm, giving 4–20 mA or 0–10 V to a controller ([[electronics:sensors|sensors]]). They are fast enough to catch [[water-hammer]] spikes. Absolute, gauge and sealed-gauge versions exist — check which one you have.
- **Dead-weight tester**: calibrated masses on a piston of precisely known area, $p = mg/A$ — accurate to a few hundredths of a per cent.

| Instrument | Typical range | Typical accuracy |
|---|---|---|
| Water U-tube | 0–20 kPa | ± 10 Pa (1 mm) |
| Inclined manometer | 0–2 kPa | ± 2 Pa |
| Bourdon gauge | 0.6–1 600 bar | 0.6–2.5 % of full scale |
| Transducer | 0.1–2 000 bar | 0.1–0.5 % of full scale |
| Dead-weight tester | 1–1 000 bar | 0.01–0.02 % of reading |

Choose a gauge's range so that the normal reading lies near the middle: at most three-quarters of full scale for steady pressure and two-thirds for pulsating pressure.

> [!warn] Never remove a gauge or transducer from a pressurised line: close the gauge isolator or depressurise the system first. Mercury is toxic; its use in instruments is being phased out under the Minamata Convention (2013), and a broken mercury manometer is a hazardous spill, not a mop-up.
`,
  ideas: [
    'A manometer measures pressure as the height of a liquid column: p = ρgh.',
    'Walk round the manometer: add ρgh going down, subtract going up, and equate pressures only at the same level in the same continuous liquid.',
    'A differential manometer reads p₁ − p₂ = (ρ_m − ρ)gh when the pipe liquid fills both legs.',
    'Tilting the reading leg magnifies the reading by 1/sin θ, for very small pressures.',
    'Bourdon gauges and transducers do the everyday work; columns and dead-weight testers calibrate them.'
  ],
  pitfalls: [
    'In a differential manometer p₁ − p₂ = ρ_m g h — The pipe liquid above the manometer liquid in each leg must be taken into account: the density difference (ρ_m − ρ) is what counts.',
    'Equal levels mean equal pressures anywhere in the tube — Only within one continuous liquid. Across an interface between two liquids the rule fails.',
    'A gauge should be sized so the working pressure is near full scale for best accuracy — Near full scale a Bourdon tube fatigues and pressure peaks overload it; mid-scale is the rule.'
  ],
  formulas: [
    {
      name: 'U-tube manometer on a pipe of liquid',
      expr: 'pA = rhom*g*h - rho*g*y', tex: 'p_A = \\rho_m g h - \\rho g y',
      vars: {
        pA: { name: 'pressure at the pipe centre (gauge)', q: 'pressure', unit: 'kPa', signed: true, tex: 'p_A' },
        rhom: { name: 'density of the manometer liquid', q: 'density', unit: 'kg/m³', value: 13546, tex: '\\rho_m' },
        g: { const: 'g' },
        h: { name: 'difference between the manometer levels', q: 'length', unit: 'mm', value: 250, signed: true },
        rho: { name: 'density of the liquid in the pipe', q: 'density', unit: 'kg/m³', value: 998 },
        y: { name: 'depth of the manometer interface below the pipe centre', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The far leg is open to the atmosphere, so the result is a gauge pressure. For a gas in the pipe, ρ ≈ 0 and p = ρ_m g h.',
      stories: {
        pA: 'A mercury manometer ({rhom}) on a water pipe ({rho}) shows a difference of {h}; the interface in the pipe-side leg is {y} below the pipe centre. What is the pressure in the pipe?',
        h: 'A water pipe ({rho}) at {pA} is connected to a U-tube of liquid of density {rhom}, with its interface {y} below the pipe centre. What difference in levels will it show?'
      }
    },
    {
      name: 'Differential manometer',
      expr: 'dp = (rhom - rho)*g*h', tex: '\\Delta p = (\\rho_m - \\rho)\\,g h',
      vars: {
        dp: { name: 'pressure difference p₁ − p₂', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        rhom: { name: 'density of the manometer liquid', q: 'density', unit: 'kg/m³', value: 13546, tex: '\\rho_m' },
        rho: { name: 'density of the liquid in the pipe', q: 'density', unit: 'kg/m³', value: 998 },
        g: { const: 'g' },
        h: { name: 'manometer reading (difference of levels)', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Both legs are full of the pipe liquid above the manometer liquid; the height of the pipe above the manometer does not matter.',
      stories: {
        dp: 'A mercury-under-water differential manometer ({rhom} under {rho}) across an orifice plate reads {h}. What is the pressure drop?',
        h: 'A pressure drop of {dp} is to be read on a differential manometer of liquid {rhom} under a pipe liquid of {rho}. What reading will it show?'
      }
    },
    {
      name: 'Inclined manometer',
      expr: 'dp = rhom*g*L*sin(theta)', tex: '\\Delta p = \\rho_m g L \\sin\\theta',
      vars: {
        dp: { name: 'pressure difference', q: 'pressure', unit: 'Pa', tex: '\\Delta p' },
        rhom: { name: 'density of the manometer liquid', q: 'density', unit: 'kg/m³', value: 830, tex: '\\rho_m' },
        g: { const: 'g' },
        L: { name: 'reading along the inclined tube', q: 'length', unit: 'mm', value: 120 },
        theta: { name: 'angle of the tube to the horizontal', q: 'angle', unit: '°', value: 10, min: 1, max: 90 }
      },
      note: 'For a gas, whose density is negligible beside the manometer liquid. Commercial instruments also correct for the small fall of level in the reservoir.',
      stories: {
        dp: 'An inclined manometer of oil ({rhom}) at {theta} reads {L}. What is the pressure difference?',
        L: 'A draught of {dp} is measured with an oil manometer ({rhom}) inclined at {theta}. How far along the tube does the reading move?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading an orifice plate',
      q: 'Water flows through an orifice plate. A mercury-under-water differential manometer across it reads 180 mm. What is the pressure drop? What would you get if you forgot the water in the legs?',
      steps: [
        '$\\Delta p = (\\rho_m - \\rho)\\,g h = (13\\,546 - 998) \\times 9.81 \\times 0.18 = 22.2$ kPa.',
        'As a head of water: $22\\,150/(998 \\times 9.81) = 2.26$ m.',
        'Forgetting the water: $13\\,546 \\times 9.81 \\times 0.18 = 23.9$ kPa — 8 % too high, and the flow worked out from it would be 4 % too high.'
      ],
      a: '22.2 kPa (2.26 m of water).'
    },
    {
      title: 'A draught gauge',
      q: 'An inclined manometer filled with gauge oil (830 kg/m³) is set at 15° and reads 75 mm along its tube on a ventilation duct. What is the pressure, and what would a vertical tube have shown?',
      steps: [
        '$\\Delta p = 830 \\times 9.81 \\times 0.075 \\times \\sin 15° = 158$ Pa.',
        'Vertical rise: $75 \\times \\sin 15° = 19.4$ mm. The slope magnifies the reading $1/\\sin 15° = 3.9$ times.'
      ],
      a: '158 Pa; a vertical tube would move only 19 mm.'
    }
  ],
  quiz: [
    { q: 'A mercury U-tube (13 546 kg/m³) connected to an air line shows a difference of 50 mm, the far leg open. What is the gauge pressure in the line, in kPa?', answer: 6.64, unit: 'kPa',
      why: 'The air\'s own weight is negligible: p = ρ_m g h = 13 546 × 9.81 × 0.05 = 6.64 kPa.' },
    { q: 'An inclined manometer set at 30° moves twice as far along its tube as a vertical manometer would rise for the same pressure.', a: true,
      why: 'L = h/sin θ, and sin 30° = 0.5.' },
    { q: 'A differential manometer with mercury under water reads 100 mm. The pressure difference is closest to…', choices: ['13.3 kPa', '12.3 kPa', '1.0 kPa', '9.8 kPa'], a: 1,
      why: '(13 546 − 998) × 9.81 × 0.1 = 12.3 kPa. 13.3 kPa forgets the water in the legs.' },
    { q: 'A hydraulic line works steadily at 160 bar with some pulsation. Which gauge range is the best choice?', choices: ['0–160 bar', '0–250 bar', '0–1000 bar', '0–600 bar'], a: 1,
      why: '160 bar is 64 % of 250 — within the two-thirds recommended for pulsating pressure; 0–160 would sit at full scale, and the larger ranges would read coarsely.' },
    { q: 'Why can you set pressures equal at the two interface levels of a U-tube only within the same liquid?', choices: ['because the tube is bent', 'because pressure changes with depth at a rate set by the density of whatever liquid lies between the points', 'because mercury is toxic', 'because surface tension acts at interfaces'], a: 1,
      why: 'Equal levels mean equal pressures only if the points are connected through one still liquid; through different liquids, ρgh differs.' }
  ],
  problems: [
    { q: 'A piezometer on a water main shows the water standing 4.2 m above the pipe centre. What is the gauge pressure in the main, in kPa (1000 kg/m³)?', answer: 41.2, unit: 'kPa', tol: 0.02,
      steps: ['$p = \\rho g h = 1000 \\times 9.81 \\times 4.2 = 41.2$ kPa.'] },
    { q: 'A mercury U-tube on a water pipe has its interface 0.3 m below the pipe centre and shows a level difference of 0.4 m. What is the pipe pressure, in kPa (water 1000, mercury 13 546 kg/m³)?', answer: 50.2, unit: 'kPa', tol: 0.02,
      steps: ['$p_A = \\rho_m g h - \\rho g y = 13\\,546 \\times 9.81 \\times 0.4 - 1000 \\times 9.81 \\times 0.3$.', '$= 53.1 - 2.9 = 50.2$ kPa.'] }
  ],
  applications: [
    'Differential pressure across orifice plates and venturi meters for flow measurement.',
    'Draught and filter-drop gauges in ventilation systems; wind-tunnel pressure boards.',
    'Bourdon gauges on every hydraulic power unit, and transducers feeding machine controllers.',
    'Calibration laboratories, with dead-weight testers as the pressure standard.'
  ],
  history: 'Torricelli\'s barometer (1643) was the first liquid-column pressure gauge, and open U-tube manometers followed within a few decades. Eugène Bourdon patented his tube gauge in 1849; cheap, robust and readable at a glance, it spread with the high-pressure steam boilers of the railway age.',
  sim: 'hs-manometer'
},

/* ======================================================================== FORCES ON SURFACES */
{
  id: 'force-on-plane-surface', parent: 'forces-on-surfaces', title: 'Force on a submerged plane surface', level: 2,
  short: 'The resultant water force on a flat gate, wall or window is the pressure at its centroid times its area, F = ρg·h_c·A, acting square to the surface. For a vertical wall reaching the surface it is ½ρgbH².',
  keywords: ['hydrostatic force', 'resultant force', 'plane surface', 'gate', 'sluice gate', 'centroid', 'pressure prism', 'pressure diagram', 'lock gate', 'aquarium window', 'inclined surface', 'hatch'],
  prereq: ['pressure-with-depth', 'math:integral-applications', 'physics:center-of-mass'],
  related: ['centre-of-pressure', 'curved-surfaces', 'tanks-dams-pressure', 'culverts-sluice', 'dams-spillways'],
  body: `
A sluice gate, a tank wall, an aquarium window, a ship's hatch: each is a flat surface with liquid pressing on one side. The pressure grows with depth, so the lower parts are pushed harder than the upper ones. For design what matters is the total — one **resultant force** — and where it acts ([[centre-of-pressure]]).

### Pressure at the centroid times the area
Cut the surface into thin horizontal strips. A strip of area $\\mathrm{d}A$ at depth $h$ carries $\\mathrm{d}F = \\rho g h\\,\\mathrm{d}A$, always square to the surface. Adding up all the strips,

$$F = \\rho g \\int h\\,\\mathrm{d}A = \\rho g\\,h_c A$$

because $\\int h\\,\\mathrm{d}A$ is, by the definition of the centroid, the depth of the centroid $h_c$ times the area ([[math:integral-applications|integrals]]). The rule is short enough to remember: **the resultant force equals the pressure at the centroid times the area.** It is written with gauge pressure: the atmosphere pushes on the free surface and on the dry side of the gate alike, and cancels.

### Tilted surfaces
Measure $y$ along the plane of the surface, from the line where that plane cuts the free surface. A point at slant distance $y$ is at depth $h = y\\sin\\theta$, where θ is the angle of the plane to the horizontal, so

$$F = \\rho g\\,y_c \\sin\\theta\\,A$$

Only the centroid's depth and the area count. Tilt a gate about its centroid and the force keeps its size; only its direction (always normal to the plate) and its point of action change.

### The pressure prism
For a rectangle of width $b$ it helps to draw the pressure across the surface: a triangle for a wall reaching up to the surface, a trapezium for a gate lower down. The pressure diagram times the width is a solid, the **pressure prism**, whose volume is the force and whose centroid is where it acts. A vertical wall with water to depth $H$ carries

$$F = \\tfrac{1}{2}\\rho g b H^2$$

The square matters: double the depth behind a wall and the force on it quadruples. A canal lock gate 12 m wide holding 8 m of water carries 3.8 MN — the weight of almost 400 tonnes. With water on both sides the prisms subtract: between 8 m and 3 m of water the same gate carries 3.2 MN.

| Shape | Area $A$ | Centroid below the top | $I_c$ about the centroid |
|---|---|---|---|
| Rectangle $b \\times h$ | $bh$ | $h/2$ | $bh^3/12$ |
| Circle, diameter $d$ | $\\pi d^2/4$ | $d/2$ | $\\pi d^4/64$ |
| Triangle, base $b$ at the bottom, height $h$ | $bh/2$ | $2h/3$ | $bh^3/36$ |
| Semicircle, flat side up, radius $R$ | $\\pi R^2/2$ | $4R/(3\\pi)$ | $0.1098\\,R^4$ |

The last column, the second moment of area, locates the force on the next page.

### Numbers that surprise
An aquarium window 4 m wide and 2 m tall, its top 1 m under sea water, carries $1025 \\times 9.81 \\times 2 \\times 8 = 161$ kN — sixteen tonnes on a sheet of acrylic, which is why such windows are 20–30 cm thick. A 0.8 m hatch in the bottom of a 5 m deep water tank carries 24.6 kN, the weight of a car and a half.

> [!warn] The forces that load a gate also hold people. Near intakes, sluices and outlet grilles the pressure difference can pin a person against a screen with a force no one can pull against. Keep out of the water near gates and intakes, and treat tanks and culverts as confined spaces: enter only under a permit, with the inflows locked out and the air tested.
`,
  ideas: [
    'The resultant force on a submerged plane is the pressure at its centroid times its area: F = ρg·h_c·A.',
    'It acts perpendicular to the surface, with gauge pressure (the atmosphere cancels).',
    'The tilt does not change the size of the force if the centroid stays at the same depth.',
    'For a vertical wall reaching the surface, F = ½ρgbH²: double the depth, four times the force.',
    'The pressure prism (pressure diagram × width) has the force as its volume and the line of action through its centroid.'
  ],
  pitfalls: [
    'The force equals the weight of the water above the gate — That is only true of a horizontal surface. On a wall or sloping gate the force comes from the pressure at the centroid, whatever water lies above.',
    'A larger reservoir behind a dam means a larger force on it — Only the depth at the face matters, not how far the water stretches back.',
    'Use the depth of the bottom edge, or the average of top and bottom — Use the depth of the centroid. For a rectangle that is the average; for a circle or triangle it is not.'
  ],
  formulas: [
    {
      name: 'Resultant force on a submerged plane surface',
      expr: 'F = rho*g*hc*A', tex: 'F = \\rho g\\,h_c A',
      vars: {
        F: { name: 'resultant force', q: 'force', unit: 'kN' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        hc: { name: 'depth of the centroid below the free surface', q: 'length', unit: 'm', value: 4, tex: 'h_c' },
        A: { name: 'area of the surface', q: 'area', unit: 'm²', value: 3 }
      },
      note: 'Any shape, any tilt. Gauge pressure: the atmosphere acts on both sides.',
      stories: {
        F: 'A gate of area {A} has its centroid {hc} below the surface of a liquid of density {rho}. What force does it carry?',
        hc: 'A hatch of area {A} can carry {F}. How deep may its centroid go in a liquid of density {rho}?'
      }
    },
    {
      name: 'Vertical wall with liquid up to the surface',
      expr: 'F = rho*g*b*H^2/2', tex: 'F = \\tfrac{1}{2}\\rho g b H^2',
      vars: {
        F: { name: 'resultant force', q: 'force', unit: 'kN' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        b: { name: 'width of the wall', q: 'length', unit: 'm', value: 1 },
        H: { name: 'depth of liquid', q: 'length', unit: 'm', value: 5 }
      },
      note: 'The triangular pressure prism: it acts at H/3 above the bottom.',
      stories: {
        F: 'A wall {b} wide holds back liquid of density {rho} to a depth of {H}. What force does it carry?',
        H: 'A wall {b} wide can carry {F}. How deep may the liquid of density {rho} behind it be?'
      }
    },
    {
      name: 'Inclined plane surface',
      expr: 'F = rho*g*yc*sin(theta)*A', tex: 'F = \\rho g\\,y_c \\sin\\theta\\,A',
      vars: {
        F: { name: 'resultant force', q: 'force', unit: 'kN' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        yc: { name: 'distance of the centroid along the plane from the surface line', q: 'length', unit: 'm', value: 6, tex: 'y_c' },
        theta: { name: 'angle of the plane to the horizontal', q: 'angle', unit: '°', value: 30, min: 0, max: 90 },
        A: { name: 'area of the surface', q: 'area', unit: 'm²', value: 0.5027 }
      },
      stories: {
        F: 'A hatch of {A} lies in a floor sloping at {theta}; its centroid is {yc} down the slope from the water line. What force does it carry (density {rho})?'
      }
    },
    {
      name: 'Gate with liquid on both sides',
      expr: 'F = rho*g*b*(H1^2 - H2^2)/2', tex: 'F = \\tfrac{1}{2}\\rho g b\\left(H_1^2 - H_2^2\\right)',
      vars: {
        F: { name: 'net force towards the low side', q: 'force', unit: 'kN', signed: true },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        b: { name: 'width of the gate', q: 'length', unit: 'm', value: 12 },
        H1: { name: 'depth on the high side', q: 'length', unit: 'm', value: 8, tex: 'H_1' },
        H2: { name: 'depth on the low side', q: 'length', unit: 'm', value: 3, tex: 'H_2' }
      },
      note: 'A vertical gate reaching the bottom, with liquid of the same density on both sides.',
      stories: {
        F: 'A lock gate {b} wide has {H1} of water on one side and {H2} on the other. What is the net force on it (density {rho})?',
        H2: 'A lock gate {b} wide holds {H1} of water and may carry at most {F}. How much water must there be on the other side?'
      }
    }
  ],
  examples: [
    {
      title: 'A sluice gate',
      q: 'A vertical rectangular sluice gate 1.5 m wide and 2 m high has its top edge 3 m below the water surface. What is the resultant water force?',
      steps: [
        'Centroid depth: $h_c = 3 + 2/2 = 4$ m. Area: $A = 1.5 \\times 2 = 3$ m².',
        '$F = \\rho g h_c A = 1000 \\times 9.81 \\times 4 \\times 3 = 117.7$ kN.',
        'Check with the pressure prism: the pressure runs from $1000 \\times 9.81 \\times 3 = 29.4$ kPa at the top to 49.0 kPa at the bottom; average 39.2 kPa over 3 m² gives the same 117.7 kN.'
      ],
      a: 'About 118 kN, square to the gate.'
    },
    {
      title: 'A hatch in a sloping floor',
      q: 'A circular hatch 0.8 m in diameter sits in the floor of a tank that slopes at 30° to the horizontal. Its centre is 6 m down the slope from the line where the floor meets the water surface. Find the force on it.',
      steps: [
        'Centroid depth: $h_c = 6 \\sin 30° = 3$ m.',
        'Area: $\\pi \\times 0.4^2 = 0.503$ m².',
        '$F = 1000 \\times 9.81 \\times 3 \\times 0.503 = 14.8$ kN, perpendicular to the sloping floor.'
      ],
      a: 'About 14.8 kN.'
    },
    {
      title: 'A lock gate',
      q: 'A lock gate is 12 m wide. The water is 8 m deep on the upstream side and 3 m deep on the downstream side. What is the net force?',
      steps: [
        'Upstream: $\\tfrac12 \\times 1000 \\times 9.81 \\times 12 \\times 8^2 = 3.77$ MN.',
        'Downstream: $\\tfrac12 \\times 1000 \\times 9.81 \\times 12 \\times 3^2 = 0.53$ MN.',
        'Net: $3.24$ MN towards the downstream side. (Real lock gates are two mitred leaves that lean on each other like a flat arch.)'
      ],
      a: 'About 3.2 MN.'
    }
  ],
  quiz: [
    { q: 'A vertical square plate is lowered deeper into a lake, staying vertical. The force on one face…', choices: ['stays the same', 'grows in proportion to the depth of its centroid', 'grows with the square of the depth', 'falls, because the water above spreads the load'], a: 1,
      why: 'F = ρg·h_c·A: with the area fixed, the force is proportional to the centroid depth.' },
    { q: 'Tilting a submerged plate about its centroid, which stays at the same depth, changes the size of the force on it.', a: false,
      why: 'The size depends only on the centroid depth and the area. Its direction and point of action change with the tilt.' },
    { q: 'Water stands 4 m deep against a vertical wall. What is the force per metre of wall, in kN (1000 kg/m³)?', answer: 78.5, unit: 'kN',
      why: 'F = ½ρgbH² = 0.5 × 1000 × 9.81 × 1 × 16 = 78.5 kN.' },
    { q: 'In which direction does the resultant water force on a flat inclined gate act?', choices: ['vertically downwards', 'horizontally', 'perpendicular to the gate', 'along the gate, downhill'], a: 2,
      why: 'Every elementary force from a liquid at rest is normal to the surface, so their sum is too.' },
    { q: 'The water behind a vertical wall rises from 3 m to 6 m. The force on the wall…', choices: ['doubles', 'rises four times', 'rises eight times', 'rises by 3 m of water pressure'], a: 1,
      why: 'F grows with H²: (6/3)² = 4.' }
  ],
  problems: [
    { q: 'A vertical rectangular gate 2 m wide and 1.2 m high has its top edge 2.5 m below the water surface. What force does it carry, in kN?', answer: 73.0, unit: 'kN', tol: 0.02,
      steps: ['$h_c = 2.5 + 0.6 = 3.1$ m; $A = 2.4$ m².', '$F = 1000 \\times 9.81 \\times 3.1 \\times 2.4 = 73.0$ kN.'] },
    { q: 'The glass front of a sea-water tank (1025 kg/m³) is 3 m wide and 1.8 m tall, with water to the top. What force does it carry, in kN?', answer: 48.9, unit: 'kN', tol: 0.02,
      steps: ['$F = \\tfrac12 \\rho g b H^2 = 0.5 \\times 1025 \\times 9.81 \\times 3 \\times 1.8^2 = 48.9$ kN.'] }
  ],
  applications: [
    'Sluice gates, lock gates and stop logs on canals and rivers.',
    'Tank walls, access hatches and inspection windows.',
    'Aquarium and submarine viewports.',
    'Retaining walls and basements in waterlogged ground.'
  ],
  sim: 'hs-plane-gate'
},

{
  id: 'centre-of-pressure', parent: 'forces-on-surfaces', title: 'Centre of pressure', level: 2,
  short: 'The point where the resultant water force on a submerged surface acts. It lies below the centroid, by I_c/(y_c A) along the plane, and closes on the centroid as the surface goes deeper.',
  keywords: ['centre of pressure', 'center of pressure', 'second moment of area', 'parallel axis theorem', 'hinge moment', 'gate', 'two-thirds depth', 'flap gate', 'tilting gate', 'moment'],
  prereq: ['force-on-plane-surface', 'physics:torque', 'math:integral-applications'],
  related: ['curved-surfaces', 'tanks-dams-pressure', 'physics:moment-of-inertia', 'culverts-sluice', 'dams-spillways'],
  body: `
The resultant of the water's push on a submerged plate does not act at the plate's centroid. The lower part of the plate is deeper and pushed harder than the upper part, so the balance point of the pushes — the **centre of pressure** — lies below the centroid. Gate hinges, hoists, bolts and the stability of dams all depend on where it is.

### Finding it with moments
The resultant must turn the plate about any axis exactly as the spread-out pressures do. Take moments about the line where the plate's plane cuts the free surface, with $y$ measured along the plane:

$$F\\,y_p = \\int y\\,p\\,\\mathrm{d}A = \\rho g\\sin\\theta \\int y^2\\,\\mathrm{d}A = \\rho g \\sin\\theta\\,I_O$$

$I_O$ is the second moment of the area about that surface line; the parallel-axis theorem turns it into $I_c + A y_c^2$, with $I_c$ taken about the centroid. Dividing by $F = \\rho g \\sin\\theta\\, y_c A$:

$$y_p = y_c + \\frac{I_c}{y_c A}$$

The angle has dropped out. The centre of pressure is always below the centroid (along the plane) by $I_c/(y_c A)$, and that offset **shrinks as the plate goes deeper**: far down, the pressure over the plate is nearly uniform, and the centre of pressure closes on the centroid.

| Top of a 1 m tall rectangular gate at depth | $y_c$ | Centre of pressure below the centroid |
|---|---|---|
| 0 (at the surface) | 0.5 m | 167 mm |
| 1 m | 1.5 m | 56 mm |
| 5 m | 5.5 m | 15 mm |
| 20 m | 20.5 m | 4 mm |

### Shapes worth remembering
- **Rectangle** of height $h$ along the plane: $y_p = y_c + h^2/(12 y_c)$ — the width cancels. Reaching up to the surface, the centre of pressure is at **two-thirds of the depth**, the centroid of the triangular pressure diagram.
- **Circle** of radius $R$: $y_p = y_c + R^2/(4 y_c)$.
- **Horizontal plate**: the pressure is uniform and the centre of pressure is the centroid.
- **Sideways**: for any shape symmetrical about a line down the slope, the centre of pressure lies on that line.

### Why it matters
A gate hinged along its top edge must be held shut by a moment $F\\,(y_p - y_\\text{top})$, larger than the force times half the height. A clever consequence is the **self-opening flap gate**: pivot a gate a little above one-third of its height and, while the water is low, the centre of pressure stays below the pivot and the gate rests shut against its stop; when the water rises far enough, the centre of pressure climbs above the pivot and the gate tips open on its own, with no power and no operator.

When a closed tank has gas above the liquid at a gauge pressure $p_g$, replace the gas by an extra $p_g/(\\rho g)$ of liquid — an imaginary free surface — and measure $y$ from there.

> [!tip] Picture the pressure prism: the centre of pressure is the centroid of the prism's volume, projected onto the plate.
`,
  ideas: [
    'The resultant acts at the centre of pressure, below the centroid, because pressure grows with depth.',
    'Along the plane, y_p = y_c + I_c/(y_c A), whatever the tilt.',
    'The deeper the surface, the closer the centre of pressure to the centroid.',
    'A rectangle reaching the surface has its centre of pressure at two-thirds of the depth.',
    'The centre of pressure sets the hinge moments and hoist forces of gates.'
  ],
  pitfalls: [
    'The force acts at the centroid, like a weight — The centroid is where a uniform pressure would act. Pressure grows with depth, so the resultant acts lower.',
    'y_p and y_c are vertical depths — In y_p = y_c + I_c/(y_c A) they are measured along the plane from the surface line; the vertical depth of the centre of pressure is y_p sin θ.',
    'The centre of pressure moves further below the centroid as the gate goes deeper — The opposite: the offset I_c/(y_c A) shrinks with depth.'
  ],
  formulas: [
    {
      name: 'Centre of pressure (along the plane)',
      expr: 'yp = yc + Ic/(yc*A)', tex: 'y_p = y_c + \\dfrac{I_c}{y_c A}',
      vars: {
        yp: { name: 'distance of the centre of pressure from the surface line', q: 'length', unit: 'm', tex: 'y_p' },
        yc: { name: 'distance of the centroid from the surface line', q: 'length', unit: 'm', value: 4, tex: 'y_c' },
        Ic: { name: 'second moment of area about the centroid', unit: 'm⁴', value: 1, tex: 'I_c' },
        A: { name: 'area of the surface', q: 'area', unit: 'm²', value: 3 }
      },
      note: 'Distances are measured along the plane of the surface, from the line where that plane meets the free surface. For a rectangle b × h, I_c = bh³/12; for a circle, πd⁴/64.',
      stories: {
        yp: 'A gate of area {A} with I_c = {Ic} has its centroid {yc} from the surface line, along its plane. Where does the resultant act?'
      }
    },
    {
      name: 'Rectangle: centre of pressure',
      expr: 'yp = yc + h^2/(12*yc)', tex: 'y_p = y_c + \\dfrac{h^2}{12\\,y_c}',
      vars: {
        yp: { name: 'distance of the centre of pressure from the surface line', q: 'length', unit: 'm', tex: 'y_p' },
        yc: { name: 'distance of the centroid from the surface line', q: 'length', unit: 'm', value: 4, tex: 'y_c' },
        h: { name: 'height of the rectangle (along the plane)', q: 'length', unit: 'm', value: 2 }
      },
      stories: { yp: 'A rectangular gate {h} high has its centroid {yc} from the surface line along its plane. How far from that line does the resultant act?' }
    },
    {
      name: 'Circle: centre of pressure',
      expr: 'yp = yc + R^2/(4*yc)', tex: 'y_p = y_c + \\dfrac{R^2}{4\\,y_c}',
      vars: {
        yp: { name: 'distance of the centre of pressure from the surface line', q: 'length', unit: 'm', tex: 'y_p' },
        yc: { name: 'distance of the centre from the surface line', q: 'length', unit: 'm', value: 2.5, tex: 'y_c' },
        R: { name: 'radius', q: 'length', unit: 'm', value: 0.5 }
      },
      stories: { yp: 'A circular hatch of radius {R} has its centre {yc} from the surface line along its plane. Where does the resultant act?' }
    },
    {
      name: 'Hinge moment of a vertical rectangular gate hinged at its top edge',
      expr: 'M = rho*g*b*h^2*(a/2 + h/3)', tex: 'M = \\rho g b h^2\\left(\\dfrac{a}{2} + \\dfrac{h}{3}\\right)',
      vars: {
        M: { name: 'moment of the water about the hinge', q: 'torque', unit: 'kN·m' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        b: { name: 'gate width', q: 'length', unit: 'm', value: 1.5 },
        h: { name: 'gate height', q: 'length', unit: 'm', value: 2 },
        a: { name: 'depth of the top edge (hinge)', q: 'length', unit: 'm', value: 3 }
      },
      note: 'Equal to F·(y_p − a). A hoist or latch at the bottom edge must supply M/h.',
      stories: {
        M: 'A vertical gate {b} wide and {h} high is hinged along its top edge, {a} below the surface of a liquid of density {rho}. What moment must the latch at the bottom resist?'
      }
    }
  ],
  examples: [
    {
      title: 'The sluice gate again',
      q: 'The vertical gate 1.5 m wide and 2 m high with its top 3 m below the surface carries 117.7 kN. Where does the force act? If the gate is hinged along its top edge, what force must a latch at its bottom edge supply?',
      steps: [
        '$y_c = 4$ m, $A = 3$ m², $I_c = bh^3/12 = 1.5 \\times 8/12 = 1.0$ m⁴.',
        '$y_p = 4 + 1.0/(4 \\times 3) = 4.083$ m: 83 mm below the centroid.',
        'Moment about the hinge: $117.7 \\times (4.083 - 3) = 127.5$ kN·m.',
        'Latch force: $127.5/2 = 63.7$ kN — more than half of the total force, because the push is concentrated low down.'
      ],
      a: 'At 4.08 m depth; the latch must hold about 64 kN.'
    },
    {
      title: 'A self-opening flap gate',
      q: 'A vertical rectangular flap gate 3 m tall pivots about a horizontal axis 1.1 m above its bottom edge; a stop keeps it closed while the resultant passes below the pivot. At what water depth does it tip open?',
      steps: [
        'With water just to the top ($H = 3$ m) the centre of pressure is at $H/3 = 1.0$ m above the bottom — below the pivot, so the gate stays shut.',
        'With water $H > 3$ m deep, the gate spans depths $H - 3$ to $H$: $y_c = H - 1.5$ and $y_p = y_c + 3^2/(12 y_c)$.',
        'The gate opens when the centre of pressure reaches the pivot, at depth $H - 1.1$: $(H - 1.5) + 0.75/(H - 1.5) = H - 1.1$, so $0.75/(H - 1.5) = 0.4$ and $H - 1.5 = 1.875$.',
        '$H = 3.375$ m — when the water is 0.375 m over the top of the gate.'
      ],
      a: 'At a depth of about 3.38 m, 0.38 m above the top of the gate.'
    }
  ],
  quiz: [
    { q: 'The centre of pressure on a submerged vertical plate always lies below its centroid.', a: true,
      why: 'I_c/(y_c A) is always positive: the deeper parts are pushed harder.' },
    { q: 'As a submerged vertical plate is lowered deeper, its centre of pressure…', choices: ['moves further below the centroid', 'moves closer to the centroid', 'stays the same distance below the centroid', 'moves above the centroid'], a: 1,
      why: 'The offset I_c/(y_c A) falls as y_c grows: deep down the pressure over the plate is almost uniform.' },
    { q: 'Water stands 3 m deep against a vertical wall. How far below the surface does the resultant act, in m?', answer: 2, unit: 'm',
      why: 'For a rectangle reaching the surface, y_p = 2H/3 = 2 m — the centroid of the triangular pressure diagram.' },
    { q: 'Where is the centre of pressure on a horizontal plate on the bottom of a tank?', choices: ['below the centroid', 'at the centroid', 'at the deepest edge', 'undefined'], a: 1,
      why: 'All of it is at one depth, so the pressure is uniform and the resultant acts at the centroid.' },
    { q: 'Why does a gate designer care about the centre of pressure as well as the force?', choices: ['it decides the weight of the gate', 'it decides the moments that hinges, latches and hoists must resist', 'it decides the water level', 'it does not matter for gates'], a: 1,
      why: 'Hinge and hoist loads come from moments, and the moment arm is set by where the resultant acts.' }
  ],
  problems: [
    { q: 'A circular hatch 1 m in diameter in a vertical wall has its centre 2.5 m below the water surface. How deep is its centre of pressure, in m?', answer: 2.525, unit: 'm', tol: 0.005,
      steps: ['$R = 0.5$ m; $y_p = y_c + R^2/(4 y_c) = 2.5 + 0.25/10 = 2.525$ m.'] },
    { q: 'A vertical rectangular gate 1 m wide and 2 m tall has its top edge 1 m below the surface. How deep is the centre of pressure, in m?', answer: 2.167, unit: 'm', tol: 0.005,
      steps: ['$y_c = 2$ m; $I_c = 1 \\times 2^3/12 = 0.667$ m⁴; $A = 2$ m².', '$y_p = 2 + 0.667/(2 \\times 2) = 2.167$ m.'] }
  ],
  applications: [
    'Sizing hinges, latches, hoists and actuators for gates and hatches.',
    'Self-acting flap gates and tilting weirs that open by themselves as the water rises.',
    'The line of action of water thrust on dams, used in their overturning checks.',
    'Bolt loads on flanged covers and inspection doors of tanks.'
  ],
  sim: 'hs-plane-gate'
},

{
  id: 'curved-surfaces', parent: 'forces-on-surfaces', title: 'Forces on curved surfaces', level: 2,
  short: 'Split the force into a horizontal part — the force on the vertical projection — and a vertical part — the weight of liquid above the surface, real or imaginary. On a circular arc the resultant passes through the centre, which is why radial (Tainter) gates are easy to lift.',
  keywords: ['curved surface', 'horizontal component', 'vertical component', 'projection', 'Tainter gate', 'radial gate', 'trunnion', 'drum gate', 'resultant', 'imaginary liquid', 'dome', 'quarter circle'],
  prereq: ['force-on-plane-surface', 'centre-of-pressure', 'math:right-triangle-trig'],
  related: ['buoyancy-archimedes', 'tanks-dams-pressure', 'dams-spillways', 'culverts-sluice'],
  body: `
Many surfaces that hold water back are curved: radial gates, drum gates, the domed ends of tanks, pipes, the hull of a submarine. On a curve every little patch is pushed square-on, but "square-on" points a different way at every patch, so the patches cannot simply be added as numbers. The way through is to split the resultant into a horizontal and a vertical part, each of which turns out to be easy.

### The horizontal component
Look at the liquid between the curved surface and its **vertical projection** — the flat shadow the curve would cast on a vertical plane. That block of liquid is at rest and nothing else pushes on it sideways, so the horizontal force on the curve equals the force on the projection:

$$F_H = \\rho g\\,h_c A_p$$

with $h_c$ the depth of the projection's centroid and $A_p$ its area. It acts at the projection's [[centre-of-pressure]].

### The vertical component
Now look at the liquid directly **above** the curved surface, up to the free surface. Its weight is carried by the curve, so

$$F_V = \\rho g V$$

acting through the centroid of that volume. If the liquid lies *below* the curve — the curve is a roof over it — the push is upward and equals the weight of the liquid that *would* fill the space up to the free surface: an imaginary volume, but a real force. Buoyancy is the special case of a closed surface, where the upward push on the underside outweighs the downward push on the top ([[buoyancy-archimedes]]).

### The resultant
$$F_R = \\sqrt{F_H^2 + F_V^2}, \\qquad \\tan\\varphi = \\frac{F_V}{F_H}$$

For a circular arc there is a bonus. Every elementary force is normal to the surface, and on a circle every normal passes through the centre — so **the resultant passes through the centre of the circle**.

| Surface | $F_H$ from | $F_V$ from |
|---|---|---|
| Quarter-circle corner, liquid above it | its vertical projection | the liquid above the arc, pushing down |
| Drum or cylinder, liquid on one side | its vertical projection | the imaginary liquid above the lower part minus the real liquid above the upper part: net upward |
| Radial gate, liquid on the convex side | its vertical projection | the same bookkeeping; usually a net upward push |

### The radial (Tainter) gate
That bonus is the whole idea of the **radial gate**, patented in the United States by Jeremiah Burnham Tainter in 1886 and now on spillways and canals everywhere. Its skin plate is part of a cylinder; steel arms carry the water load to trunnion pins in the piers, on the cylinder's axis. The water force passes through the pins, so it has **no moment** about them: to lift the gate, the hoist raises only the gate's own weight against the friction in the trunnions — a fraction of what a flat lift gate of the same size needs, since that must be dragged up against the whole water load on its guides. Gates 15 m wide and 10 m high are lifted by modest chains or hydraulic cylinders.

The trunnions carry the whole load, though, and their friction matters. In 1995 a spillway gate at Folsom Dam in California failed while being opened: friction at corroded trunnion pins had grown until a strut buckled, and the reservoir poured out through the opening until it was closed off.

> [!warn] Radial and sluice gates can start moving, and release large flows, under remote or automatic control. Never stand on, under or downstream of a gate, and never enter a spillway or stilling basin.
`,
  ideas: [
    'Horizontal component = force on the vertical projection of the curved surface, acting at the projection\'s centre of pressure.',
    'Vertical component = weight of the liquid above the surface up to the free surface — real (down) or imaginary (up).',
    'The resultant is √(F_H² + F_V²); on a circular arc it passes through the centre of the circle.',
    'A radial gate\'s water load passes through its trunnions, so the hoist lifts only the gate\'s weight and friction.'
  ],
  pitfalls: [
    'The vertical force on a curved surface is the weight of the liquid touching it — It is the weight of the liquid (real or imaginary) standing vertically above the surface up to the free surface.',
    'A curved surface with liquid underneath feels no vertical force — It is pushed up by the weight of the imaginary liquid that would fill the space above it to the free surface.',
    'The horizontal force depends on how the surface curves — Only on its vertical projection: a flat gate and a curved gate with the same projection carry the same horizontal force.'
  ],
  formulas: [
    {
      name: 'Horizontal component on a curved surface',
      expr: 'FH = rho*g*hc*Ap', tex: 'F_H = \\rho g\\,h_c A_p',
      vars: {
        FH: { name: 'horizontal component', q: 'force', unit: 'kN', tex: 'F_H' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        hc: { name: 'depth of the centroid of the vertical projection', q: 'length', unit: 'm', value: 1, tex: 'h_c' },
        Ap: { name: 'area of the vertical projection', q: 'area', unit: 'm²', value: 8, tex: 'A_p' }
      },
      stories: { FH: 'A curved gate has a vertical projection of {Ap} whose centroid is {hc} below the surface (density {rho}). What is the horizontal force on it?' }
    },
    {
      name: 'Vertical component on a curved surface',
      expr: 'FV = rho*g*V', tex: 'F_V = \\rho g V',
      vars: {
        FV: { name: 'vertical component', q: 'force', unit: 'kN', tex: 'F_V' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        V: { name: 'volume of liquid (real or imaginary) above the surface', q: 'volume', unit: 'm³', value: 12.57 }
      },
      note: 'Downward if the liquid is really above the surface, upward if the volume is imaginary (liquid below the surface).',
      stories: { FV: 'The volume of water standing above a curved gate, up to the free surface, is {V}. What vertical force does the gate carry (density {rho})?' }
    },
    {
      name: 'Resultant on a curved surface',
      expr: 'FR = sqrt(FH^2 + FV^2)', tex: 'F_R = \\sqrt{F_H^2 + F_V^2}',
      vars: {
        FR: { name: 'resultant force', q: 'force', unit: 'kN', tex: 'F_R' },
        FH: { name: 'horizontal component', q: 'force', unit: 'kN', value: 78.45, tex: 'F_H' },
        FV: { name: 'vertical component', q: 'force', unit: 'kN', value: 123.3, tex: 'F_V' }
      },
      stories: { FR: 'A curved gate carries {FH} horizontally and {FV} vertically. What is the resultant force its bearings must take?' }
    },
    {
      name: 'Direction of the resultant',
      expr: 'tan(phi) = FV/FH', tex: '\\tan\\varphi = \\dfrac{F_V}{F_H}',
      vars: {
        phi: { name: 'angle of the resultant to the horizontal', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\varphi' },
        FV: { name: 'vertical component', q: 'force', unit: 'kN', value: 123.3, tex: 'F_V' },
        FH: { name: 'horizontal component', q: 'force', unit: 'kN', value: 78.45, tex: 'F_H' }
      },
      solveFor: 'phi',
      stories: { phi: 'A curved gate carries {FH} horizontally and {FV} vertically. At what angle to the horizontal does the resultant act?' }
    }
  ],
  examples: [
    {
      title: 'A curved tank corner',
      q: 'The bottom corner of a tank is a quarter circle of radius 2 m, 4 m long, with its centre of curvature on the water surface, so the arc runs from the surface down to a point 2 m directly below the centre, and water fills the quarter circle above it. Find the force on the curved corner.',
      steps: [
        'Vertical projection: 2 m high × 4 m long, centroid 1 m deep: $F_H = 1000 \\times 9.81 \\times 1 \\times 8 = 78.5$ kN.',
        'Water above the arc: a quarter circle $\\pi \\times 2^2/4 = 3.14$ m² times 4 m $= 12.57$ m³: $F_V = 1000 \\times 9.81 \\times 12.57 = 123.3$ kN, downward.',
        'Resultant: $\\sqrt{78.5^2 + 123.3^2} = 146$ kN at $\\arctan(123.3/78.5) = 57.5°$ below the horizontal.',
        'Every elementary force is radial, so the resultant passes through the centre of the arc, on the water surface.'
      ],
      a: '146 kN at 57.5° below the horizontal, through the centre of curvature.'
    },
    {
      title: 'A drum holding back water',
      q: 'A long cylinder 2 m in diameter lies on the bed of a channel and holds back water up to its top on one side; the other side is dry. Find the force per metre of length.',
      steps: [
        'Horizontal: the projection is 2 m high: $F_H = \\tfrac12 \\times 1000 \\times 9.81 \\times 2^2 = 19.6$ kN.',
        'Vertical: the upper wetted quarter has real water above it (down); the lower quarter has imaginary water above it (up). The difference is the half-disc of the cylinder on the wet side: $\\pi \\times 1^2/2 = 1.571$ m², so $F_V = 1000 \\times 9.81 \\times 1.571 = 15.4$ kN upward.',
        'Resultant: $\\sqrt{19.6^2 + 15.4^2} = 24.9$ kN, through the cylinder\'s axis.'
      ],
      a: 'About 24.9 kN per metre, pointing downstream and upward through the axis.'
    }
  ],
  quiz: [
    { q: 'The horizontal water force on a curved gate equals…', choices: ['the weight of the water above it', 'the force on the gate\'s vertical projection', 'the force on the gate\'s horizontal projection', 'the pressure at the lowest point times the gate area'], a: 1,
      why: 'The water between the gate and its vertical projection is in equilibrium sideways, so the curve carries the same horizontal force as the flat projection.' },
    { q: 'The vertical water force on a curved surface with water above it equals…', choices: ['the weight of the water directly above the surface, up to the free surface', 'the weight of all the water in the tank', 'zero', 'the horizontal force times tan 45°'], a: 0,
      why: 'That column of water is supported by the surface. With the water below instead, the push is upward and equals the imaginary column\'s weight.' },
    { q: 'On a gate whose face is a circular arc, the resultant water force passes through the centre of the arc.', a: true,
      why: 'Each elementary force is normal to the surface, and every normal to a circle passes through its centre.' },
    { q: 'Why can a large radial (Tainter) gate be raised by a small hoist?', choices: ['the water lifts it', 'the water force passes through the trunnions, so it has no moment about them', 'radial gates are hollow and light', 'the hoist uses a gearbox'], a: 1,
      why: 'With no water moment about the pivot, the hoist only has to overcome the gate\'s weight and the trunnion friction.' },
    { q: 'A hemispherical bulge of radius 1 m projects downwards from the flat bottom of a tank holding 3 m of water. What vertical force does the water exert on the bulge, in kN?', answer: 113, unit: 'kN',
      why: 'Water above the bulge: a cylinder π × 1² × 3 = 9.42 m³ plus the hemisphere 2π/3 = 2.09 m³, total 11.5 m³; F = 1000 × 9.81 × 11.5 = 113 kN.' }
  ],
  problems: [
    { q: 'A quarter-circle corner of radius 1.5 m and length 3 m has water above it, with its centre of curvature on the free surface. What is the resultant force on it, in kN?', answer: 61.6, unit: 'kN', tol: 0.02,
      steps: ['$F_H = 1000 \\times 9.81 \\times 0.75 \\times (1.5 \\times 3) = 33.1$ kN.', '$F_V = 1000 \\times 9.81 \\times (\\pi \\times 1.5^2/4) \\times 3 = 52.0$ kN.', '$F_R = \\sqrt{33.1^2 + 52.0^2} = 61.6$ kN.'] }
  ],
  applications: [
    'Radial (Tainter) gates on spillways, weirs and irrigation canals.',
    'Drum and sector gates, flap gates and stop logs.',
    'Domed ends of pressure vessels and tanks; pipes and culverts under fill.',
    'Hulls of ships and submarines.'
  ],
  history: 'Jeremiah Burnham Tainter, a Wisconsin engineer, devised the radial gate for logging dams and patented it in 1886. It spread across the world\'s spillways because it turned the hydrostatics of a circular arc into a gate that could be moved with little effort.',
  sim: 'hs-curved-gate'
},

{
  id: 'buoyancy-archimedes', parent: 'forces-on-surfaces', title: 'Buoyancy and Archimedes\' principle', level: 1,
  short: 'A body in a fluid is pushed up by the weight of the fluid it displaces, F_B = ρ_f g V. It floats when it can displace its own weight before it is fully under, and it acts through the centre of buoyancy.',
  keywords: ['buoyancy', 'Archimedes', 'upthrust', 'displacement', 'floating', 'sinking', 'apparent weight', 'density', 'draught', 'Plimsoll line', 'load line', 'uplift', 'flotation', 'centre of buoyancy'],
  prereq: ['pressure-with-depth', 'physics:buoyancy', 'physics:density'],
  related: ['floating-stability', 'curved-surfaces', 'tanks-dams-pressure', 'density-specific-weight'],
  body: `
A 100 000-tonne steel ship floats; a pebble sinks. The difference is not what they are made of but how much water they push aside. **Archimedes' principle**: a body wholly or partly immersed in a fluid is pushed up by a force equal to the weight of the fluid it displaces.

$$F_B = \\rho_f\\,g\\,V_\\text{disp}$$

### Where the upthrust comes from
It is nothing but [[pressure-with-depth]]. Take a submerged box of height $h$ and horizontal area $A$: the water pushes down on its top at $p_\\text{top}$ and up on its bottom at $p_\\text{top} + \\rho g h$. The sideways pushes cancel, and the net upward force is $\\rho g h A = \\rho g V$. For any other shape, imagine the body replaced by water of the same shape: that water would float motionless, so the surrounding pressures must hold up exactly its weight — and they do not care what is inside the outline. The upthrust acts through the centroid of the displaced volume, the **centre of buoyancy** B.

### Sink, float or hover
Compare the body's average density with the fluid's:

- denser — it sinks, and weighs less by $F_B$ while immersed (its *apparent weight*);
- less dense — it rises until only enough of it is under the surface to displace its own weight, a fraction $\\rho_\\text{body}/\\rho_f$ of its volume;
- equal — it hovers, as a submarine does by flooding and blowing its ballast tanks, and a fish with its swim bladder.

| Body | Density (kg/m³) | In sea water (1 025 kg/m³) |
|---|---|---|
| Oak | 700 | floats, 68 % submerged |
| Ice | 917 | floats, 89 % submerged — the tip of the iceberg is about a tenth |
| Person, lungs full | about 985 | floats, 96 % submerged |
| Concrete | 2 400 | sinks; weighs 57 % of its dry weight |
| Steel | 7 850 | sinks; weighs 87 % of its dry weight |

A ship floats because its **average** density — steel plus all the air inside the hull — is well below that of water. Its size is given as its **displacement**: the mass of water it displaces, equal to its own mass.

### Salt, fresh and the load line
Sea water is about 2.5 % denser than fresh, so a ship floats deeper in a river port than at sea. The **load line** (Plimsoll mark) on the hull shows the deepest safe draught for fresh and salt water, summer, winter and the tropics — first made compulsory for British ships by the Merchant Shipping Act of 1876, now required by the International Convention on Load Lines (1966).

### Engineering with buoyancy
- **Weighing in water** gives density: a body that weighs $W$ in air and $W_a$ immersed has $\\rho_s = \\rho_f W/(W - W_a)$. Hydrometers turn the same idea round and read the density of the liquid.
- **Floating out.** An empty buried tank, a manhole or a pipeline in waterlogged ground feels the full upthrust of the groundwater and can rise out of the ground in a flood. They are held down by concrete collars, anchors or weight coatings. Basements and dam foundations feel the same push as **uplift** ([[tanks-dams-pressure]]).
- **Stability** — whether a floating body stays upright — depends on where B moves as it heels ([[floating-stability]]).

> [!warn] Churning, aerated water below weirs and in hydraulic jumps is less dense than still water, so people — and even boats — float lower in it, and the recirculating current below a low weir holds them there. Stay well clear of weirs and spillways, above and below.
`,
  ideas: [
    'The buoyant force equals the weight of the displaced fluid: F_B = ρ_f g V.',
    'It comes from the pressure being greater under a body than over it.',
    'It acts through the centroid of the displaced volume — the centre of buoyancy.',
    'A floating body sinks until it displaces its own weight: the submerged fraction is ρ_body/ρ_fluid.',
    'Weighing in air and in water gives a body\'s density.'
  ],
  pitfalls: [
    'Heavy materials cannot float — Average density decides: a steel hull full of air floats; a solid steel bar sinks.',
    'A submerged body feels more buoyancy the deeper it goes — For an incompressible liquid and a rigid body the upthrust is the same at any depth; only compressible bodies (a diver\'s suit, a balloon) change.',
    'Buoyancy depends on the weight of the body — It depends only on the displaced volume and the fluid\'s density; the body\'s weight decides whether it floats.'
  ],
  formulas: [
    {
      name: 'Buoyant force (Archimedes)',
      expr: 'FB = rho*g*V', tex: 'F_B = \\rho_f\\,g\\,V',
      vars: {
        FB: { name: 'buoyant force (upthrust)', q: 'force', unit: 'N', tex: 'F_B' },
        rho: { name: 'fluid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_f' },
        g: { const: 'g' },
        V: { name: 'displaced volume', q: 'volume', unit: 'L', value: 10 }
      },
      stories: {
        FB: 'A body displaces {V} of a fluid of density {rho}. What is the upthrust?',
        V: 'A float must provide {FB} of upthrust in a liquid of density {rho}. What volume must it displace?'
      }
    },
    {
      name: 'Apparent weight of an immersed body',
      expr: 'Wa = (rhos - rho)*g*V', tex: 'W_a = (\\rho_s - \\rho_f)\\,g V',
      vars: {
        Wa: { name: 'apparent weight (negative: it floats up)', q: 'force', unit: 'N', signed: true, tex: 'W_a' },
        rhos: { name: 'density of the body', q: 'density', unit: 'kg/m³', value: 2700, tex: '\\rho_s' },
        rho: { name: 'fluid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_f' },
        g: { const: 'g' },
        V: { name: 'volume of the body', q: 'volume', unit: 'L', value: 2 }
      },
      stories: {
        Wa: 'A block of density {rhos} and volume {V} hangs fully immersed in a liquid of density {rho}. What does a spring balance holding it read?',
        rhos: 'A {V} body weighs {Wa} when fully immersed in a liquid of density {rho}. What is its density?'
      }
    },
    {
      name: 'Density from weighing in air and in water',
      expr: 'rhos = rho*W/(W - Wa)', tex: '\\rho_s = \\rho_f\\,\\dfrac{W}{W - W_a}',
      vars: {
        rhos: { name: 'density of the body', q: 'density', unit: 'kg/m³', tex: '\\rho_s' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_f' },
        W: { name: 'weight in air', q: 'force', unit: 'N', value: 19.3 },
        Wa: { name: 'apparent weight fully immersed', q: 'force', unit: 'N', value: 18.3, tex: 'W_a' }
      },
      note: 'W − W_a is the upthrust, which gives the volume. Air buoyancy on the body is neglected.',
      stories: {
        rhos: 'A crown weighs {W} in air and {Wa} when hung in a liquid of density {rho}. What is its density?',
        Wa: 'A sample of density {rhos} weighs {W} in air. What will it weigh hung in a liquid of density {rho}?'
      }
    },
    {
      name: 'Draught of a box-shaped barge',
      expr: 'd = m/(rho*L*b)', tex: 'd = \\dfrac{m}{\\rho_f L b}',
      vars: {
        d: { name: 'draught (depth below the waterline)', q: 'length', unit: 'm' },
        m: { name: 'mass of barge and cargo', q: 'mass', unit: 't', value: 800 },
        rho: { name: 'water density', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho_f' },
        L: { name: 'length', q: 'length', unit: 'm', value: 50 },
        b: { name: 'breadth', q: 'length', unit: 'm', value: 10 }
      },
      stories: {
        d: 'A box-shaped barge {L} long and {b} wide has a mass of {m}. How deep does it float in water of density {rho}?',
        m: 'A barge {L} long and {b} wide may float no deeper than {d} in water of density {rho}. What total mass can it carry?'
      }
    }
  ],
  examples: [
    {
      title: 'A steel pontoon',
      q: 'A box pontoon 12 m long, 5 m wide and 1.5 m deep has a mass of 18 t. How deep does it float in fresh water? How much cargo can it take if 0.3 m of freeboard must remain? How deep does it float, empty, in sea water?',
      steps: [
        'Empty, fresh water: $d = 18\\,000/(1000 \\times 12 \\times 5) = 0.30$ m.',
        'Loaded to a draught of $1.5 - 0.3 = 1.2$ m it displaces $1000 \\times 60 \\times 1.2 = 72$ t, so the cargo may be $72 - 18 = 54$ t.',
        'Sea water: $d = 18\\,000/(1025 \\times 60) = 0.293$ m — 2.5 % less.'
      ],
      a: '0.30 m; 54 t of cargo; 0.293 m in sea water.'
    },
    {
      title: 'Is the crown gold?',
      q: 'A crown weighs 19.30 N in air and 18.10 N hung in water. Gold is 19 300 kg/m³ and silver 10 500 kg/m³. Is it pure gold?',
      steps: [
        'Upthrust: $19.30 - 18.10 = 1.20$ N, so the volume is $1.20/(1000 \\times 9.81) = 122$ cm³.',
        'Density: $\\rho_s = 1000 \\times 19.30/1.20 = 16\\,100$ kg/m³ — well below gold\'s 19 300.',
        'As a mix by volume: $x \\times 19\\,300 + (1 - x) \\times 10\\,500 = 16\\,100$ gives $x = 0.63$: about 63 % gold, 37 % silver by volume.'
      ],
      a: 'No: its density is about 16 100 kg/m³, an alloy with roughly a third silver.'
    },
    {
      title: 'A tank that wants to float',
      q: 'An empty buried tank 2.5 m in diameter and 6 m long weighs 900 kg. After heavy rain the groundwater rises above it. What hold-down force is needed, and what volume of concrete (2400 kg/m³, itself under water) would supply it?',
      steps: [
        'Volume: $\\pi \\times 1.25^2 \\times 6 = 29.5$ m³; upthrust $1000 \\times 9.81 \\times 29.5 = 289$ kN.',
        'Weight of the tank: $900 \\times 9.81 = 8.8$ kN; net uplift 280 kN.',
        'Submerged concrete weighs only $(2400 - 1000) \\times 9.81 = 13.7$ kN per m³, so $280/13.7 = 20.4$ m³ is needed.'
      ],
      a: 'About 280 kN, or some 20 m³ of submerged concrete.'
    }
  ],
  quiz: [
    { q: 'Why does a steel ship float?', choices: ['steel is lighter than water', 'the hull\'s average density, including the air inside, is less than water\'s', 'the engines hold it up', 'salt water is thicker'], a: 1,
      why: 'Buoyancy depends on the displaced volume; a hollow hull displaces its own weight of water before it is fully submerged.' },
    { q: 'Ice (917 kg/m³) floats in sea water (1025 kg/m³). What percentage of its volume is above the surface?', answer: 10.5, unit: '%',
      why: 'Submerged fraction 917/1025 = 0.895, so 10.5 % shows.' },
    { q: 'A ship sails from the sea up a river into fresh water. It floats lower.', a: true,
      why: 'Fresh water is less dense, so a larger volume must be displaced to carry the same weight.' },
    { q: 'A block hanging from a spring balance is lowered into a beaker of water standing on a kitchen scale, without touching the bottom. The scale reading…', choices: ['stays the same', 'rises by the buoyant force', 'rises by the block\'s full weight', 'falls'], a: 1,
      why: 'The water pushes up on the block, so the block pushes down on the water with an equal force (Newton\'s third law); the balance reading falls by the same amount.' },
    { q: 'A brick is lowered from 1 m to 10 m deep in a lake. The buoyant force on it…', choices: ['grows ten times', 'stays the same', 'grows a little', 'falls'], a: 1,
      why: 'Water is practically incompressible and the brick is rigid: the displaced volume, and so the upthrust, is the same at any depth.' }
  ],
  problems: [
    { q: 'A 2-litre aluminium block (2700 kg/m³) hangs fully immersed in water. What does the spring balance read, in N?', answer: 33.3, unit: 'N', tol: 0.02,
      steps: ['$W_a = (2700 - 1000) \\times 9.81 \\times 0.002 = 33.3$ N.'] },
    { q: 'A box barge 40 m long and 9 m wide floats at a draught of 1.8 m in sea water (1025 kg/m³). What is its displacement, in tonnes?', answer: 664, unit: 't', tol: 0.02,
      steps: ['$V = 40 \\times 9 \\times 1.8 = 648$ m³.', '$m = 1025 \\times 648 = 664\\,200$ kg = 664 t.'] }
  ],
  applications: [
    'Ship design: displacement, draught, load lines and cargo capacity.',
    'Submarines, diving bells and underwater vehicles with variable ballast.',
    'Anchoring pipelines, tanks and manholes against flotation; uplift on basements and dams.',
    'Hydrometers and density measurement by weighing in water.'
  ],
  history: 'Archimedes set out the principle around 250 BC in *On Floating Bodies*. The story of the king\'s crown and the cry of "Eureka!" comes from Vitruvius two centuries later; the overflow method he describes would have been too crude, but weighing the crown against gold under water, as in the example above, works well.',
  sim: ['hs-buoyancy', 'hs-floating-stability']
},

{
  id: 'floating-stability', parent: 'forces-on-surfaces', title: 'Stability of floating bodies', level: 3,
  short: 'A floating body is stable when its metacentre M lies above its centre of gravity G. The metacentric height GM = KB + BM − KG, with BM = I/V, sets the righting moment and the rolling period.',
  keywords: ['stability', 'metacentre', 'metacentric height', 'GM', 'BM', 'KB', 'KG', 'righting arm', 'GZ curve', 'heel', 'roll period', 'free surface effect', 'inclining experiment', 'angle of loll', 'capsize', 'ship stability'],
  prereq: ['buoyancy-archimedes', 'physics:center-of-mass', 'physics:torque', 'physics:simple-harmonic-motion'],
  related: ['centre-of-pressure', 'physics:physical-pendulum', 'aerodynamics:static-stability'],
  body: `
Floating is not enough: a ship must also come back upright when a wave or a gust leans it over. In 1628 the Swedish warship *Vasa* heeled in a light breeze little more than a kilometre into her maiden voyage, took water through her open gunports and sank — too much weight high up, too little ballast low down. Stability is a question of where two forces act.

### G and B
The weight acts down through the **centre of gravity G**. The buoyancy acts up through the **centre of buoyancy B**, the centroid of the underwater volume. Upright, the two lie on one vertical line and balance. Heel the hull by a small angle φ and the underwater shape changes: a wedge rises out of the water on the high side and an equal wedge is pushed in on the low side, so **B moves towards the low side**. Weight and buoyancy now form a couple. If B has moved out beyond G, the couple turns the hull back — it is **stable**; if not, it rolls further.

### The metacentre
For small angles the vertical through the shifted B cuts the hull's centreline at a fixed point, the **metacentre M**. The hull is stable when M lies above G, and the distance between them, the **metacentric height GM**, measures how stable. Heights are measured up from the keel K:

$$\\overline{GM} = \\overline{KB} + \\overline{BM} - \\overline{KG}, \\qquad \\overline{BM} = \\frac{I}{V}$$

$I$ is the second moment of the **waterplane** — the hull's footprint at the waterline — about its fore-and-aft centreline, and $V$ the displaced volume. The righting lever is $\\overline{GZ} \\approx \\overline{GM}\\sin\\varphi$ and the righting moment $W\\,\\overline{GZ}$.

For a box-shaped barge of breadth $b$ at draught $d$: $\\overline{KB} = d/2$ and $\\overline{BM} = b^2/(12 d)$. Breadth is powerful — it enters squared. Notice that **G may lie above B** and the hull still be stable: the waterplane moves B out fast enough. A fully submerged submarine has no waterplane, $\\overline{BM} = 0$, and must keep G below B.

| Draught of a barge 10 m wide, G 3 m above the keel | $\\overline{KB}$ | $\\overline{BM}$ | $\\overline{KM}$ | $\\overline{GM}$ |
|---|---|---|---|---|
| 1 m | 0.50 m | 8.33 m | 8.83 m | 5.83 m |
| 2 m | 1.00 m | 4.17 m | 5.17 m | 2.17 m |
| 3 m | 1.50 m | 2.78 m | 4.28 m | 1.28 m |
| 4 m | 2.00 m | 2.08 m | 4.08 m | 1.08 m |

### Stiff and tender
A large GM is not simply better. It makes a **stiff** ship that snaps back and rolls quickly and violently, hard on crew, cargo lashings and structure; a small GM makes a **tender** ship that rolls slowly and heels far under a steady wind. The natural roll period is about

$$T = \\frac{2\\pi k}{\\sqrt{g\\,\\overline{GM}}}$$

where $k$, the radius of gyration for rolling, is typically 0.35–0.45 of the beam. A ship 20 m wide ($k \\approx 8$ m) with GM = 1 m rolls in about 16 s; with GM = 4 m, in 8 s. Masters read a lengthening roll period as a warning that GM is shrinking.

### Large angles and the rules
GM describes only small heels. At larger angles the deck edge goes under or the bilge comes out, and the full **GZ curve** — righting lever against heel — is what counts: its peak, the angle where it vanishes, and the area under it, which is the energy needed to capsize the ship. The IMO Intact Stability Code (2008) asks, among other things, for an initial GM of at least 0.15 m, a GZ of at least 0.20 m at 30° or beyond, the maximum GZ at 25° or more, and at least 0.055 m·rad of area up to 30°. If GM is negative, a wall-sided hull does not capsize at once but lolls over to one side, to the **angle of loll** where GZ returns to zero — a warning sign, not a resting place.

### What erodes stability
- **Weight high up**: deck cargo, ice on the superstructure, people standing up in a small boat.
- **Free surfaces**: liquid sloshing in a part-filled tank runs to the low side and acts as if G had risen. Water on the open car deck capsized the ferry *Herald of Free Enterprise* in 1987 within minutes.
- **Flooding**, which adds weight low down but can destroy waterplane and buoyancy.

Stability is measured by the **inclining experiment**: move a known mass $m$ a distance $x$ across the deck of a ship of mass $M$, measure the heel φ, and $\\overline{GM} = m x/(M\\tan\\varphi)$.
`,
  derivation: {
    title: 'Why BM = I/V',
    steps: [
      { text: 'Heel the hull by a small angle φ. A strip of waterplane of area $\\mathrm{d}A$ at distance $y$ from the centreline sinks (or rises) by $y\\varphi$, so the immersed wedge gains volume $y\\varphi\\,\\mathrm{d}A$ on one side and the emerged wedge loses as much on the other.' },
      { text: 'The moment of the transferred volume about the centreline is', tex: '\\int y \\cdot y\\varphi\\,\\mathrm{d}A = \\varphi\\,I' },
      { text: 'Moving that volume shifts the centre of buoyancy of the whole displaced volume $V$ sideways by', tex: 'B_0 B_1 = \\dfrac{\\varphi\\,I}{V}' },
      { text: 'The vertical through the new centre of buoyancy meets the centreline at M; for small angles $B_0B_1 = \\mathrm{BM}\\,\\varphi$, so', tex: '\\mathrm{BM} = \\dfrac{I}{V}' }
    ]
  },
  ideas: [
    'Stability depends on the positions of G (weight) and B (buoyancy); B moves to the low side when the body heels.',
    'For small angles the body is stable if the metacentre M is above G: GM = KB + BM − KG > 0.',
    'BM = I/V: a wide waterplane makes a body stable even with G above B.',
    'Large GM gives a quick, violent roll; small GM a slow, tender roll: T ≈ 2πk/√(g·GM).',
    'High weights, free liquid surfaces and flooding reduce stability; the inclining experiment measures it.'
  ],
  pitfalls: [
    'A floating body is stable only if G is below B — Most ships have G above B. What matters is that M, not B, is above G.',
    'The larger GM, the safer the ship — Too large a GM gives violent rolling that can shift cargo and injure crew; designers aim for a moderate GM and a good GZ curve.',
    'GM tells the whole story — It covers only small angles. At large angles the GZ curve, with deck-edge immersion and the range of stability, decides.'
  ],
  formulas: [
    {
      name: 'Metacentric height',
      expr: 'GM = KB + BM - KG', tex: '\\mathrm{GM} = \\mathrm{KB} + \\mathrm{BM} - \\mathrm{KG}',
      vars: {
        GM: { name: 'metacentric height (negative: unstable upright)', q: 'length', unit: 'm', signed: true, tex: '\\mathrm{GM}' },
        KB: { name: 'height of the centre of buoyancy above the keel', q: 'length', unit: 'm', value: 1, tex: '\\mathrm{KB}' },
        BM: { name: 'metacentric radius', q: 'length', unit: 'm', value: 4.167, tex: '\\mathrm{BM}' },
        KG: { name: 'height of the centre of gravity above the keel', q: 'length', unit: 'm', value: 3, tex: '\\mathrm{KG}' }
      },
      stories: {
        GM: 'A hull has its centre of buoyancy {KB} above the keel, a metacentric radius of {BM} and its centre of gravity {KG} above the keel. What is its metacentric height?',
        KG: 'A barge with KB = {KB} and BM = {BM} must keep a metacentric height of at least {GM}. How high may its centre of gravity be?'
      }
    },
    {
      name: 'Metacentric radius',
      expr: 'BM = I/V', tex: '\\mathrm{BM} = \\dfrac{I}{V}',
      vars: {
        BM: { name: 'metacentric radius', q: 'length', unit: 'm', tex: '\\mathrm{BM}' },
        I: { name: 'second moment of the waterplane about its centreline', unit: 'm⁴', value: 4167 },
        V: { name: 'displaced volume', q: 'volume', unit: 'm³', value: 1000 }
      },
      stories: { BM: 'A hull displaces {V}; the second moment of its waterplane about the centreline is {I}. What is its metacentric radius?' }
    },
    {
      name: 'Box-shaped barge',
      expr: 'BM = b^2/(12*d)', tex: '\\mathrm{BM} = \\dfrac{b^2}{12\\,d}',
      vars: {
        BM: { name: 'metacentric radius', q: 'length', unit: 'm', tex: '\\mathrm{BM}' },
        b: { name: 'breadth at the waterline', q: 'length', unit: 'm', value: 10 },
        d: { name: 'draught', q: 'length', unit: 'm', value: 2 }
      },
      stories: {
        BM: 'A box barge {b} wide floats at a draught of {d}. What is its metacentric radius?',
        b: 'A box barge floating at {d} needs a metacentric radius of {BM}. How wide must it be?'
      }
    },
    {
      name: 'Natural roll period',
      expr: 'T = 2*pi*k/sqrt(g*GM)', tex: 'T = \\dfrac{2\\pi k}{\\sqrt{g\\,\\mathrm{GM}}}',
      vars: {
        T: { name: 'roll period', q: 'time', unit: 's' },
        k: { name: 'radius of gyration for rolling', q: 'length', unit: 'm', value: 8 },
        g: { const: 'g' },
        GM: { name: 'metacentric height', q: 'length', unit: 'm', value: 1, tex: '\\mathrm{GM}' }
      },
      note: 'Small angles, undamped; the water dragged along with the hull adds a little to the effective k. k is typically 0.35–0.45 of the beam.',
      stories: {
        T: 'A ship with a radius of gyration of {k} has a metacentric height of {GM}. What is its natural roll period?',
        GM: 'A ship with a radius of gyration of {k} is timed rolling with a period of {T}. What is its metacentric height?'
      }
    },
    {
      name: 'Inclining experiment',
      expr: 'GM = m*x/(M*tan(phi))', tex: '\\mathrm{GM} = \\dfrac{m\\,x}{M \\tan\\varphi}',
      vars: {
        GM: { name: 'metacentric height', q: 'length', unit: 'm', tex: '\\mathrm{GM}' },
        m: { name: 'mass moved across the deck', q: 'mass', unit: 't', value: 8 },
        x: { name: 'distance it is moved', q: 'length', unit: 'm', value: 10 },
        M: { name: 'displacement of the ship (including m)', q: 'mass', unit: 't', value: 4000 },
        phi: { name: 'measured heel', q: 'angle', unit: '°', value: 1.5, min: 0, max: 20, tex: '\\varphi' }
      },
      stories: {
        GM: 'In an inclining experiment, {m} is moved {x} across the deck of a ship of {M}; the ship heels {phi}. What is its metacentric height?',
        phi: 'A ship of {M} has a metacentric height of {GM}. How far will it heel when {m} is moved {x} across its deck?'
      }
    }
  ],
  examples: [
    {
      title: 'A box barge',
      q: 'A box barge 50 m long and 10 m wide has a mass of 1000 t, with its centre of gravity 3 m above the keel, in fresh water. Find its draught, GM and the righting moment at 5° of heel.',
      steps: [
        'Draught: $d = 10^6/(1000 \\times 50 \\times 10) = 2.0$ m, so $\\overline{KB} = 1.0$ m.',
        '$\\overline{BM} = b^2/(12d) = 100/24 = 4.17$ m; $\\overline{KM} = 5.17$ m.',
        '$\\overline{GM} = 5.17 - 3.0 = 2.17$ m: stable.',
        'Righting moment: $W\\,\\overline{GM}\\sin 5° = 9.81\\times10^6 \\times 2.17 \\times 0.0872 = 1.85$ MN·m.'
      ],
      a: 'Draught 2.0 m, GM = 2.17 m, righting moment about 1.85 MN·m at 5°.'
    },
    {
      title: 'Deck cargo',
      q: 'The same barge loads 200 t of cargo on deck with its centre 6 m above the keel. What is the new GM?',
      steps: [
        'New mass 1200 t: $d = 2.4$ m, $\\overline{KB} = 1.2$ m, $\\overline{BM} = 100/(12 \\times 2.4) = 3.47$ m, $\\overline{KM} = 4.67$ m.',
        'New centre of gravity: $\\overline{KG} = (1000 \\times 3 + 200 \\times 6)/1200 = 3.5$ m.',
        '$\\overline{GM} = 4.67 - 3.5 = 1.17$ m — still stable, but nearly halved: both the higher G and the smaller BM cost stability.'
      ],
      a: 'GM falls from 2.17 m to 1.17 m.'
    }
  ],
  quiz: [
    { q: 'For small angles of heel, a floating body is stable when…', choices: ['G is below B', 'M is above G', 'B is above K', 'the draught is less than the breadth'], a: 1,
      why: 'The righting moment is W·GM·sin φ; it restores the body when GM > 0, i.e. when the metacentre is above the centre of gravity.' },
    { q: 'A floating body can only be stable if its centre of gravity is below its centre of buoyancy.', a: false,
      why: 'Surface ships usually have G above B. As they heel, B moves out sideways far enough to make a righting couple, provided M is above G.' },
    { q: 'A ship with a very large GM…', choices: ['rolls slowly and gently', 'rolls quickly and violently', 'cannot roll at all', 'is always unstable'], a: 1,
      why: 'The roll period is 2πk/√(g·GM): large GM, short period — a stiff ship with violent motions.' },
    { q: 'A box barge 12 m wide floats at a draught of 3 m. What is its metacentric radius BM, in m?', answer: 4, unit: 'm',
      why: 'BM = b²/(12d) = 144/36 = 4 m.' },
    { q: 'What does a part-filled (slack) tank do to a ship\'s stability?', choices: ['nothing, the liquid stays inside the ship', 'improves it, like ballast', 'reduces the effective GM, as if G had risen', 'only changes the draught'], a: 2,
      why: 'The free surface lets the liquid run to the low side as the ship heels, shifting weight the wrong way — a virtual rise of G.' }
  ],
  problems: [
    { q: 'In an inclining experiment an 8 t weight is moved 10 m across the deck of a 4000 t ship, which heels 1.5°. What is GM, in m?', answer: 0.764, unit: 'm', tol: 0.02,
      steps: ['$\\overline{GM} = m x/(M\\tan\\varphi) = 8 \\times 10/(4000 \\times \\tan 1.5°)$.', '$= 80/(4000 \\times 0.02619) = 0.764$ m.'] },
    { q: 'A ship has a radius of gyration for rolling of 7 m and a GM of 0.8 m. What is its natural roll period, in s?', answer: 15.7, unit: 's', tol: 0.02,
      steps: ['$T = 2\\pi k/\\sqrt{g\\,\\overline{GM}} = 2\\pi \\times 7/\\sqrt{9.81 \\times 0.8} = 43.98/2.80 = 15.7$ s.'] }
  ],
  applications: [
    'Loading ships and barges within their stability booklets.',
    'Design of floating cranes, pontoons, offshore platforms and floating wind turbines.',
    'Small-craft safety: canoes, lifeboats and fishing vessels.',
    'Towing and launching large floating structures such as bridge sections and caissons.'
  ],
  history: 'Pierre Bouguer introduced the metacentre in his *Traité du navire* (1746), and Leonhard Euler worked out the same stability condition independently in the same years. The inclining experiment has been a routine part of commissioning ships since the nineteenth century.',
  sim: 'hs-floating-stability'
},

{
  id: 'tanks-dams-pressure', parent: 'forces-on-surfaces', title: 'Pressure on tanks, gates and dams', level: 2,
  short: 'Hydrostatics at full scale: the triangular pressure on walls, hoop stress σ = pD/2t in cylindrical tanks, and the thrust, uplift, overturning, sliding and middle-third checks of a gravity dam.',
  keywords: ['tank', 'hoop stress', 'dam', 'gravity dam', 'overturning', 'sliding', 'uplift', 'middle third', 'factor of safety', 'water thrust', 'reservoir', 'tank wall', 'API 650', 'drainage gallery'],
  prereq: ['force-on-plane-surface', 'centre-of-pressure', 'physics:stress-strain'],
  related: ['dams-spillways', 'buoyancy-archimedes', 'curved-surfaces', 'water-supply', 'physics:static-equilibrium', 'groundwater-darcy'],
  body: `
Tanks, reservoirs and dams are where hydrostatics grows large. The rules are those of the previous pages — pressure $\\rho g h$ on every wetted surface, forces from pressure prisms — but the numbers decide shell thicknesses in centimetres and dam bases in tens of metres.

### Tank floors and walls
The floor of a tank carries $\\rho g H$ over its whole area. Only for a tank with vertical walls is that equal to the weight of the contents; with sloping or stepped walls the difference goes into the walls ([[pressure-with-depth]]). Each metre of a vertical wall carries the triangular prism, $\\tfrac{1}{2}\\rho g H^2$, acting a third of the depth up from the floor — so the foot of a tall rectangular tank wall must resist a bending moment that grows with $H^3$.

### Hoop stress
A cylindrical tank carries its pressure differently: as tension around the circumference. Cut a ring of the wall in half; the pressure on the half-ring, $p D$ per metre of height, is resisted by the wall at the two cut edges, $2 \\sigma t$. So the **hoop stress** is

$$\\sigma = \\frac{p D}{2t} = \\frac{\\rho g h D}{2t}$$

It is zero at the top, greatest at the bottom, and grows with the diameter. A tank 20 m across holding 12 m of water has 118 kPa at its floor; with a 10 mm shell the hoop stress is 118 MPa. Welded steel tanks therefore step their shell plates down in thickness course by course, thickest at the bottom; the design rule for oil-storage tanks (API 650) uses exactly this relation, evaluated a little above the bottom of each course. Timber vats do the same with hoops, packed closer near the base.

### Gravity dams
A gravity dam holds a reservoir back by its own weight. Per metre of its length the main loads are:

- the **water thrust** $P = \\tfrac{1}{2}\\rho g H^2$ on the upstream face, acting $H/3$ above the base;
- the dam's **weight** $W$ — concrete at about 2 400 kg/m³ — through the centroid of the section;
- **uplift** $U$: water seeping under the dam presses up on its base, up to $\\rho g H$ at the heel, falling to the tailwater pressure at the toe, and cancels part of the weight;
- and, depending on the site, silt, ice, earthquakes and floods over the crest.

Three checks follow. **Overturning** about the toe: the moment of the weight must exceed the moments of thrust and uplift by a factor of about 1.5–2. **Sliding** along the base: friction $\\mu(W - U)$, plus the shear strength of the rock–concrete bond, must exceed $P$. The **middle third**: the resultant of all the forces must cross the base within its middle third, so that the whole base stays in compression and no crack opens at the heel.

For a triangular section with a vertical upstream face, base $B$ and height $H$, the overturning safety without uplift is $2(\\rho_c/\\rho)(B/H)^2$. With $\\rho_c = 2400$ kg/m³:

| B/H | Overturning, no uplift | Overturning, full uplift | Sliding (μ = 0.7), no uplift | Sliding, full uplift |
|---|---|---|---|---|
| 0.6 | 1.73 | 1.00 | 1.01 | 0.59 |
| 0.7 | 2.35 | 1.19 | 1.18 | 0.69 |
| 0.8 | 3.07 | 1.35 | 1.34 | 0.78 |
| 1.0 | 4.80 | 1.60 | 1.68 | 0.98 |

Uplift roughly halves the margins. That is why dams have **drainage galleries** and grout curtains that relieve the water pressure under the base, and why the cohesion of the rock is counted in the sliding check. Uplift in a weak foundation contributed to the failure of the St Francis Dam in California in 1928, which killed more than 400 people. Spillways, arch and embankment dams are in [[dams-spillways]].

> [!warn] The water below a dam can rise suddenly and without warning when gates open or turbines start. Never enter spillway channels, stilling basins, intakes or tailraces, and keep clear of the recirculating currents below weirs. Tanks are confined spaces: enter only under a permit, with every inflow isolated and locked out and the air tested.
`,
  ideas: [
    'A vertical tank wall carries ½ρgH² per metre, acting H/3 above the floor.',
    'In a cylindrical tank the pressure is carried as hoop stress σ = ρghD/(2t), greatest at the bottom.',
    'A gravity dam must resist overturning about its toe and sliding along its base, and keep its resultant in the middle third of the base.',
    'Uplift under the base cuts the safety margins sharply; drains and grout curtains control it.',
    'The water thrust grows with H² and its overturning moment with H³.'
  ],
  pitfalls: [
    'A dam must be thicker to hold back a larger reservoir — The loads depend on the depth at the face, not on how much water lies behind it.',
    'The weight of a dam is fully available against sliding — Uplift from seepage under the base cancels part of it; friction acts on W − U.',
    'The tank wall is equally stressed from top to bottom — Hoop stress grows linearly with depth, which is why shell plates get thicker towards the bottom.'
  ],
  formulas: [
    {
      name: 'Hoop stress in a cylindrical tank',
      expr: 'sigma = rho*g*h*D/(2*t)', tex: '\\sigma = \\dfrac{\\rho g h D}{2t}',
      vars: {
        sigma: { name: 'hoop stress in the wall', q: 'stress', unit: 'MPa' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        h: { name: 'depth below the liquid surface', q: 'length', unit: 'm', value: 12 },
        D: { name: 'tank diameter', q: 'length', unit: 'm', value: 20 },
        t: { name: 'wall thickness', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Thin-walled cylinder (t much smaller than D); gauge pressure. Welds, corrosion allowance and the design standard reduce the allowable stress.',
      stories: {
        sigma: 'A tank {D} in diameter with a {t} shell holds liquid of density {rho}. What is the hoop stress {h} below the surface?',
        t: 'A tank {D} in diameter holds liquid of density {rho}. The shell stress {h} below the surface must not exceed {sigma}. How thick must it be there?'
      }
    },
    {
      name: 'Overturning moment of the water on a dam',
      expr: 'M = rho*g*b*H^3/6', tex: 'M = \\dfrac{\\rho g b H^3}{6}',
      vars: {
        M: { name: 'overturning moment about the base', q: 'torque', unit: 'kN·m' },
        rho: { name: 'water density', q: 'density', unit: 'kg/m³', value: 1000 },
        g: { const: 'g' },
        b: { name: 'length of dam considered', q: 'length', unit: 'm', value: 1 },
        H: { name: 'depth of water at the face', q: 'length', unit: 'm', value: 50 }
      },
      note: 'The thrust ½ρgbH² times its lever arm H/3, for a vertical upstream face.',
      stories: { M: 'Water stands {H} deep against the vertical face of a dam. What overturning moment does it exert on a {b} length of the dam?' }
    },
    {
      name: 'Overturning safety of a triangular gravity dam (no uplift)',
      expr: 'FSo = 2*(rhoc/rho)*(B/H)^2', tex: '\\mathrm{FS}_o = 2\\,\\dfrac{\\rho_c}{\\rho}\\left(\\dfrac{B}{H}\\right)^2',
      vars: {
        FSo: { name: 'factor of safety against overturning', tex: '\\mathrm{FS}_o' },
        rhoc: { name: 'density of the concrete', q: 'density', unit: 'kg/m³', value: 2400, tex: '\\rho_c' },
        rho: { name: 'water density', q: 'density', unit: 'kg/m³', value: 1000 },
        B: { name: 'base width', q: 'length', unit: 'm', value: 40 },
        H: { name: 'height of dam and water', q: 'length', unit: 'm', value: 50 }
      },
      note: 'A triangle with a vertical upstream face and the water at the crest. Weight acts 2B/3 from the toe, thrust H/3 above the base.',
      stories: {
        FSo: 'A triangular concrete dam ({rhoc}) is {H} high with a base of {B}; water stands at the crest. What is its factor of safety against overturning, without uplift?',
        B: 'A triangular concrete dam ({rhoc}) {H} high must have a factor of safety of {FSo} against overturning. What base width does it need?'
      }
    },
    {
      name: 'Sliding safety of a gravity dam (friction only)',
      expr: 'FSs = mu*(W - U)/P', tex: '\\mathrm{FS}_s = \\dfrac{\\mu\\,(W - U)}{P}',
      vars: {
        FSs: { name: 'factor of safety against sliding', tex: '\\mathrm{FS}_s' },
        mu: { name: 'friction coefficient, concrete on rock', value: 0.7, tex: '\\mu' },
        W: { name: 'weight of the dam (per metre)', q: 'force', unit: 'kN', value: 23536 },
        U: { name: 'uplift on the base (per metre)', q: 'force', unit: 'kN', value: 9807 },
        P: { name: 'horizontal water thrust (per metre)', q: 'force', unit: 'kN', value: 12258 }
      },
      note: 'Friction only. Design checks usually add the cohesion of the rock–concrete joint (the shear-friction method).',
      stories: {
        FSs: 'A metre of dam weighs {W}, the uplift on its base is {U} and the water thrust is {P}. With a friction coefficient of {mu}, what is the factor of safety against sliding?',
        U: 'A metre of dam weighs {W} and carries a thrust of {P}; the friction coefficient is {mu}. How much uplift can it take before the factor of safety falls to {FSs}?'
      }
    }
  ],
  examples: [
    {
      title: 'A water-tank shell',
      q: 'A steel tank 20 m in diameter holds water 12 m deep. What is the hoop stress at the bottom of a 10 mm shell, and what thickness keeps it to 160 MPa? What is the stress 6 m down?',
      steps: [
        'Pressure at the floor: $1000 \\times 9.81 \\times 12 = 117.7$ kPa.',
        '$\\sigma = pD/(2t) = 117\\,700 \\times 20/(2 \\times 0.010) = 117.7$ MPa.',
        'For 160 MPa: $t = pD/(2\\sigma) = 117\\,700 \\times 20/(2 \\times 1.6\\times10^8) = 7.4$ mm, plus a corrosion allowance.',
        'At 6 m depth the pressure, and so the stress, is half: 58.8 MPa. The upper courses can be thinner.'
      ],
      a: '118 MPa at the bottom; about 7.4 mm (plus corrosion allowance) for 160 MPa; 59 MPa at 6 m.'
    },
    {
      title: 'Checking a gravity dam',
      q: 'A triangular concrete dam (2400 kg/m³) is 50 m high with a 40 m base and a vertical upstream face; the reservoir is full. Per metre of length, find the overturning and sliding safety (μ = 0.7), without uplift and with full uplift varying from ρgH at the heel to zero at the toe.',
      steps: [
        'Thrust: $P = \\tfrac12 \\times 1000 \\times 9.81 \\times 50^2 = 12.26$ MN, lever $50/3 = 16.7$ m: $M_O = 204.3$ MN·m.',
        'Weight: $W = \\tfrac12 \\times 2400 \\times 9.81 \\times 50 \\times 40 = 23.54$ MN, acting $2B/3 = 26.7$ m from the toe: $M_R = 627.6$ MN·m.',
        'Without uplift: overturning $627.6/204.3 = 3.07$; sliding $0.7 \\times 23.54/12.26 = 1.34$.',
        'Uplift: $U = \\tfrac12 \\times 1000 \\times 9.81 \\times 50 \\times 40 = 9.81$ MN, acting $B/3$ from the heel, 26.7 m from the toe: 261.5 MN·m more overturning.',
        'With uplift: overturning $627.6/(204.3 + 261.5) = 1.35$; sliding $0.7 \\times (23.54 - 9.81)/12.26 = 0.78$ — not enough on friction alone. Drains and the rock\'s cohesion make up the difference in a real design.'
      ],
      a: 'Without uplift 3.07 and 1.34; with full uplift 1.35 and 0.78.'
    }
  ],
  quiz: [
    { q: 'Where is the hoop stress in the wall of a full cylindrical water tank greatest?', choices: ['at the top', 'half-way down', 'at the bottom', 'it is the same everywhere'], a: 2,
      why: 'σ = ρghD/(2t) grows with the depth h.' },
    { q: 'Water stands 30 m deep against the vertical face of a dam. What is the thrust per metre of dam, in kN?', answer: 4413, unit: 'kN',
      why: 'P = ½ρgH² = 0.5 × 1000 × 9.81 × 900 = 4.41 MN.' },
    { q: 'Doubling the depth of water behind a dam doubles the overturning moment of the water.', a: false,
      why: 'The thrust grows with H² and its lever arm with H, so the moment grows with H³: eight times.' },
    { q: 'What does uplift under a dam\'s base do?', choices: ['adds to the dam\'s weight', 'reduces the effective weight and adds overturning moment', 'only matters for earth dams', 'pushes the dam upstream'], a: 1,
      why: 'Uplift acts upward on the base, cancelling part of the weight (less friction, less restoring moment) and turning the dam about its toe.' },
    { q: 'Why must the resultant force cross the base of a gravity dam within its middle third?', choices: ['so the dam looks symmetric', 'so that the whole base stays in compression and no tension opens at the heel', 'to reduce the uplift', 'so the spillway works'], a: 1,
      why: 'With the resultant inside the middle third the base pressure N/B(1 ± 6e/B) stays positive everywhere; outside it the heel would be in tension and crack.' }
  ],
  problems: [
    { q: 'An oil tank (870 kg/m³) 8 m in diameter holds oil 10 m deep. What is the hoop stress at the bottom of its 6 mm shell, in MPa?', answer: 56.9, unit: 'MPa', tol: 0.02,
      steps: ['$p = 870 \\times 9.81 \\times 10 = 85.3$ kPa.', '$\\sigma = 85\\,300 \\times 8/(2 \\times 0.006) = 56.9$ MPa.'] },
    { q: 'A triangular concrete dam (2400 kg/m³) has a base 0.75 times its height. What is its factor of safety against overturning with the reservoir full, without uplift?', answer: 2.7, tol: 0.02,
      steps: ['$\\mathrm{FS}_o = 2 \\times 2.4 \\times 0.75^2 = 2.70$.'] }
  ],
  applications: [
    'Design of steel, concrete and plastic storage tanks and water towers.',
    'Gravity, buttress and arch dams; weirs and barrages.',
    'Retaining walls, basements and flood walls.',
    'Dam-safety inspections: uplift monitoring with piezometers in the foundation.'
  ],
  history: 'Nineteenth-century French engineers such as Sazilly and Delocre first designed masonry dams by calculating their stresses, and W. J. M. Rankine set out the middle-third rule in the 1870s. The uplift under a dam was widely understood only after failures such as Bouzey in France (1895) and St Francis in California (1928).',
  sim: 'hs-dam'
}

);
