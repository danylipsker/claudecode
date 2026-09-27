/* HYPER-HYDRAULICS · content/properties.js — branch "Fluid Properties":
 *   topic liquid-properties: density-specific-weight, viscosity, viscosity-temperature, bulk-modulus,
 *                            vapour-pressure, surface-tension, non-newtonian
 *   topic hydraulic-fluids:  hydraulic-oils, fire-resistant-fluids, fluid-selection, air-in-oil
 * Simulations in sims/properties.js (prefix prop-). */
Hyper.add(

/* ================================================================ DENSITY */
{
  id: 'density-specific-weight', parent: 'liquid-properties', title: 'Density and specific weight', level: 1,
  short: 'Density is mass per unit volume, ρ = m/V; specific weight is weight per unit volume, γ = ρg. Water is about 1000 kg/m³, mineral hydraulic oil about 870 — and both change a little with temperature and pressure.',
  keywords: ['density', 'specific weight', 'unit weight', 'specific gravity', 'relative density', 'kg/m³', 'N/m³', 'thermal expansion', 'expansion coefficient', 'API gravity', 'hydrometer', 'oil density', 'water density'],
  prereq: ['physics:density', 'physics:weight-mass', 'physics:thermal-expansion'],
  related: ['pressure-with-depth', 'buoyancy-archimedes', 'bulk-modulus', 'hydraulic-oils', 'fire-resistant-fluids', 'manometers', 'reservoirs'],
  body: `
A litre of water has a mass of almost exactly one kilogram — that is how the kilogram was first defined. Nearly every hydraulic calculation starts from a number of that kind: how much mass sits in a given volume of the liquid. The **density** is

$$\\rho = \\frac{m}{V}$$

in kg/m³. Its partner is the **specific weight**, the weight of a unit volume,

$$\\gamma = \\rho\\,g$$

in N/m³. Civil engineers like $\\gamma$ because the pressure at a depth $h$ in a liquid at rest is simply $p = \\gamma h$: fresh water, with $\\gamma \\approx 9.79$ kN/m³, adds very nearly 0.1 bar for every metre (see [[pressure-with-depth]]). The **relative density** or **specific gravity**, $\\mathrm{SG} = \\rho/\\rho_w$, compares a liquid with water at 4 °C (1000 kg/m³). It has no units, so an oil of SG 0.87 has a density of 870 kg/m³ whatever system of units the rest of the calculation uses.

### Typical values
| Liquid (15–20 °C) | ρ (kg/m³) | γ (kN/m³) | SG |
|---|---|---|---|
| Fresh water, 4 °C | 1000 | 9.81 | 1.000 |
| Fresh water, 20 °C | 998 | 9.79 | 0.998 |
| Sea water | 1025 | 10.05 | 1.025 |
| Mineral hydraulic oil (HM/HLP) | 860–890 | 8.4–8.7 | ≈ 0.87 |
| Synthetic ester (HEES) | 910–930 | ≈ 9.0 | ≈ 0.92 |
| Water-glycol (HFC) | 1050–1090 | ≈ 10.5 | ≈ 1.07 |
| Phosphate ester (HFDR) | 1120–1150 | ≈ 11.1 | ≈ 1.13 |
| Diesel fuel | 820–845 | ≈ 8.2 | ≈ 0.83 |
| Mercury | 13 546 | 132.8 | 13.55 |

Density enters a hydraulic system in more places than the tank weight. It sets the static head in a suction line, and so the pressure at a pump inlet; the momentum of liquid columns that must be stopped ([[water-hammer]]); the pressure drop through orifices and valves, which grows as $\\rho v^2$ ([[orifice-equation]]); and the speed of sound in the lines. A heavy fire-resistant fluid needs its pump mounted lower, closer to the tank, than a mineral oil would.

### Temperature and pressure
Liquids expand when heated. Mineral oil grows by about 0.07 % per kelvin — an expansion coefficient $\\beta \\approx 7\\times10^{-4}$ K⁻¹, three times that of water at room temperature — so its density falls as

$$\\rho(T) = \\frac{\\rho_{15}}{1 + \\beta\\,(T - T_{15})}$$

where $\\rho_{15}$ is the density at the reference temperature $T_{15}$ = 15 °C at which suppliers quote it. An oil of 870 kg/m³ at 15 °C has only 843 kg/m³ at 60 °C, and a 250-litre charge grows by almost 8 litres: room the reservoir must leave above its working level. If the oil cannot expand — trapped in a closed cylinder or a pipe between two shut valves — its pressure climbs instead, by roughly 10 bar per kelvin ([[bulk-modulus]]). Water is unusual: it is densest at 4 °C and expands again when cooled below that, which is why lakes freeze from the top down.

Pressure squeezes liquids too, but far less: 100 bar compresses mineral oil by only about 0.6 %. For hydrostatics and pipe flow the density is treated as constant — the liquid is **incompressible** — and only transients and stiffness need the correction.

> [!tip] Oil datasheets give the density at 15 °C in kg/m³ or g/mL. American data often use **API gravity**, $°\\mathrm{API} = 141.5/\\mathrm{SG} - 131.5$, on which a lighter oil has a *higher* number. A hydrometer — a weighted float that sinks until it displaces its own weight — reads SG directly (see [[buoyancy-archimedes]]).
`,
  ideas: [
    'Density ρ = m/V is mass per volume; specific weight γ = ρg is weight per volume, and the pressure at depth h is γh.',
    'Specific gravity compares a liquid with water at 4 °C: mineral oil about 0.87, water-glycol about 1.07, phosphate ester 1.13, mercury 13.6.',
    'Liquids expand when heated — mineral oil about 0.07 % per kelvin — so reservoirs need headroom and a density is quoted with its temperature.',
    'Liquids are nearly incompressible: 100 bar changes the density of oil by only about 0.6 %.'
  ],
  pitfalls: [
    'Specific weight and specific gravity are the same thing — Specific weight γ = ρg has units (N/m³); specific gravity is a pure ratio to water. An oil of SG 0.87 has γ ≈ 8.5 kN/m³.',
    'A litre of hydraulic oil has a mass of a kilogram, like water — Mineral oil is about 13 % lighter (0.87 kg per litre) and fire-resistant fluids are heavier than water; the difference matters for tank loads, suction heads and pressure drops.',
    'Density is a fixed property of a liquid — It falls as the liquid warms (by several per cent between a cold start and running temperature for oil) and rises slightly with pressure, so it is always quoted at a temperature, usually 15 °C for oils.'
  ],
  formulas: [
    {
      name: 'Density',
      expr: 'rho = m/V', tex: '\\rho = \\dfrac{m}{V}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        m: { name: 'mass of liquid', q: 'mass', unit: 'kg', value: 217.5 },
        V: { name: 'volume of liquid', q: 'volume', unit: 'L', value: 250 }
      },
      stories: { rho: 'A drum holds {V} of oil with a mass of {m}. What is the density of the oil?', m: 'What is the mass of {V} of a liquid of density {rho}?' }
    },
    {
      name: 'Specific weight',
      expr: 'gamma = rho*g', tex: '\\gamma = \\rho\\,g',
      vars: {
        gamma: { name: 'specific weight (N/m³)', tex: '\\gamma' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: 'The weight of one cubic metre. The pressure at depth h in the liquid at rest is γh.',
      stories: { gamma: 'What is the specific weight of an oil of density {rho}?' }
    },
    {
      name: 'Specific gravity (relative density)',
      expr: 'SG = rho/rhoW', tex: '\\mathrm{SG} = \\dfrac{\\rho}{\\rho_w}',
      vars: {
        SG: { name: 'specific gravity', tex: '\\mathrm{SG}' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        rhoW: { const: 'rhoW' }
      },
      stories: { SG: 'What is the specific gravity of a liquid of density {rho}?', rho: 'An oil has a specific gravity of {SG}. What is its density?' }
    },
    {
      name: 'Density at another temperature',
      expr: 'rho = rho15/(1 + beta*(T - T15))', tex: '\\rho = \\dfrac{\\rho_{15}}{1 + \\beta\\,(T - T_{15})}',
      vars: {
        rho: { name: 'density at temperature T', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        rho15: { name: 'density at 15 °C (datasheet)', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho_{15}' },
        beta: { name: 'volume expansion coefficient', q: 'expansion', unit: '1/K', value: 0.0007, tex: '\\beta' },
        T: { name: 'oil temperature', q: 'temperature', unit: '°C', value: 60, signed: true },
        T15: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 15, fixed: true, tex: 'T_{15}' }
      },
      note: 'Linear expansion, good for mineral oils over the working range. β ≈ 6.5–7.5 × 10⁻⁴ K⁻¹ for mineral oils; about 2 × 10⁻⁴ K⁻¹ for water near 20 °C (and not constant — water is densest at 4 °C).',
      practice: { unknowns: ['rho', 'T'] },
      stories: { rho: 'An oil has a density of {rho15} at 15 °C and expands by {beta}. What is its density at {T}?', T: 'An oil with {rho15} at 15 °C and an expansion coefficient of {beta} is measured at {rho}. How warm is it?' }
    }
  ],
  examples: [
    {
      title: 'A reservoir of oil',
      q: 'A reservoir holds 250 L of mineral oil of density 870 kg/m³. What is the mass of the oil, its weight, and the pressure it puts on the bottom of the tank, 0.9 m below the surface?',
      steps: [
        'Mass: $m = \\rho V = 870 \\times 0.250 = 217.5$ kg.',
        'Weight: $mg = 217.5 \\times 9.81 = 2130$ N $= 2.13$ kN.',
        'Specific weight: $\\gamma = \\rho g = 870 \\times 9.81 = 8535$ N/m³.',
        'Pressure at the bottom: $p = \\gamma h = 8535 \\times 0.9 = 7680$ Pa $= 7.7$ kPa, or 0.077 bar gauge — 13 % less than the same depth of water.'
      ],
      a: '217.5 kg, 2.13 kN, and 7.7 kPa (0.077 bar) gauge on the bottom.'
    },
    {
      title: 'Warming up',
      q: 'The same oil ($\\beta = 7.0\\times10^{-4}$ K⁻¹, 870 kg/m³ at 15 °C) warms from 15 °C to its running temperature of 60 °C. What is its density then, and by how much has the 250 L charge grown?',
      steps: [
        '$\\rho = 870/(1 + 7.0\\times10^{-4} \\times 45) = 870/1.0315 = 843$ kg/m³.',
        'The mass is unchanged, so the volume grows by the same factor: $250 \\times 1.0315 = 257.9$ L, an increase of 7.9 L.',
        'The reservoir must have room above the level for this, and a breather: the air above the oil is pushed out as the oil expands and drawn back in as it cools.'
      ],
      a: '843 kg/m³; the volume grows by about 7.9 L (3.2 %).'
    }
  ],
  quiz: [
    { q: 'A gauge at the bottom of a 2 m deep tank of oil (SG 0.87) reads, compared with the same tank full of water…', choices: ['the same', 'about 13 % less', 'about 13 % more', 'half as much'], a: 1,
      why: 'p = ρgh: at the same depth the pressure is proportional to the density, so 0.87 times that of water.' },
    { q: 'What is the specific gravity of an oil whose density is 850 kg/m³?', answer: 0.85, why: 'SG = ρ/ρw = 850/1000 = 0.85 — a pure number.' },
    { q: 'Heating oil in a sealed, completely full container is harmless, because liquids hardly change volume.', a: false,
      why: 'The oil tries to expand about 0.07 % per kelvin. Prevented from doing so, its pressure rises by roughly 10 bar per kelvin — enough to burst a line or a cylinder. Thermal relief valves protect such volumes.' },
    { q: 'Which of these would sink below water if poured into it without mixing?', choices: ['mineral hydraulic oil', 'synthetic ester (HEES)', 'phosphate ester (HFDR)', 'diesel fuel'], a: 2,
      why: 'Only the phosphate ester is denser than water (SG ≈ 1.13). That is also why water collects at the bottom of a mineral-oil reservoir, where the drain is, but floats on a phosphate ester.' },
    { q: 'What is the specific weight of sea water (1025 kg/m³), in N/m³?', answer: 10052, why: 'γ = ρg = 1025 × 9.807 = 10 052 N/m³ ≈ 10.05 kN/m³.' }
  ],
  problems: [
    { q: 'An oil drum holds 208 L of oil of specific gravity 0.88. What is the mass of the oil?', answer: 183, unit: 'kg', tol: 0.02,
      steps: ['$\\rho = 0.88 \\times 1000 = 880$ kg/m³.', '$m = \\rho V = 880 \\times 0.208 = 183$ kg.'] },
    { q: 'An oil has a density of 875 kg/m³ at 15 °C and an expansion coefficient of $6.8\\times10^{-4}$ K⁻¹. What is its density at 80 °C?', answer: 838, unit: 'kg/m³', tol: 0.01,
      steps: ['$1 + \\beta\\Delta T = 1 + 6.8\\times10^{-4} \\times 65 = 1.0442$.', '$\\rho = 875/1.0442 = 838$ kg/m³.'] }
  ],
  applications: [
    'Sizing tanks and their supports, and handling full drums and totes.',
    'Converting a pressure reading into a liquid level: level transmitters and bubbler gauges.',
    'Finding water in oil: water sinks to the bottom of a mineral-oil reservoir, where the drain is.',
    'Deciding where to mount a pump for a dense fire-resistant fluid ([[fire-resistant-fluids]]).'
  ],
  history: 'The metric law of 1795 defined the gram as the mass of a cubic centimetre of water at the melting point of ice; the platinum kilogram of 1799 was made to match a cubic decimetre of water at its densest, about 4 °C. The kilogram has since been redefined through the Planck constant, but a litre of cool water still has a mass within a fraction of a gram of it.'
},

/* ================================================================ VISCOSITY */
{
  id: 'viscosity', parent: 'liquid-properties', title: 'Viscosity', level: 1,
  short: 'A liquid\'s resistance to being sheared. Dynamic viscosity μ (Pa·s, mPa·s = cP) links shear stress to shear rate, τ = μ du/dy; kinematic viscosity ν = μ/ρ (mm²/s = cSt) is the number oil grades quote.',
  keywords: ['viscosity', 'dynamic viscosity', 'absolute viscosity', 'kinematic viscosity', 'centistokes', 'cSt', 'centipoise', 'cP', 'Pa·s', 'mm²/s', 'Newton\'s law of viscosity', 'shear stress', 'shear rate', 'Couette flow', 'viscometer', 'leakage', 'clearance', 'Saybolt', 'SUS'],
  prereq: ['physics:viscosity', 'density-specific-weight', 'math:derivative'],
  related: ['viscosity-temperature', 'non-newtonian', 'laminar-turbulent', 'reynolds-number-pipes', 'laminar-pipe-flow', 'hydraulic-oils', 'seals', 'pump-efficiencies', 'aerodynamics:air-viscosity', 'aerodynamics:no-slip'],
  body: `
Stir honey and then water with the same spoon and you feel the difference at once: honey resists being sheared. That resistance is **viscosity**, and in hydraulics it decides almost everything that happens in a narrow gap — how much oil leaks past a spool, how thick the lubricating film under a piston is, how much pressure a long hose eats, and how much heat all of that makes.

### Newton's law of viscosity
Put a layer of liquid of thickness $h$ between a fixed plate and a plate sliding at speed $U$. The liquid sticks to both walls (the **no-slip** condition), so its velocity climbs steadily from zero at the bottom to $U$ at the top — a straight-line profile called **Couette flow**. Keeping the top plate moving takes a shear stress

$$\\tau = \\mu\\,\\frac{du}{dy} = \\mu\\,\\frac{U}{h}$$

where $du/dy$ is the **shear rate** (in 1/s) and $\\mu$ the **dynamic viscosity**, in Pa·s. Liquids whose $\\mu$ does not depend on the shear rate — water, mineral oils, fuels, most simple liquids — are **Newtonian**; paints, pastes, blood and concrete are not ([[non-newtonian]]). The force on a plate of area $A$ is $F = \\tau A = \\mu A U/h$: halve the film and the drag doubles.

### Dynamic and kinematic viscosity
Many flow problems involve viscosity divided by density, because viscous forces compete with the liquid's inertia. That ratio is the **kinematic viscosity**

$$\\nu = \\frac{\\mu}{\\rho}$$

in m²/s. It is the number in every oil specification, because the standard viscometer — a glass capillary through which the oil drains under its own weight — measures $\\nu$ directly: the drain time multiplied by the tube's constant. The weight that drives the oil is proportional to its density, the resistance to its viscosity, so the time measures their ratio.

| Quantity | SI unit | Practical unit | Conversion |
|---|---|---|---|
| Dynamic viscosity μ | Pa·s | mPa·s = cP (centipoise) | 1 mPa·s = 1 cP = 0.001 Pa·s |
| Kinematic viscosity ν | m²/s | mm²/s = cSt (centistokes) | 1 cSt = 1 mm²/s = 10⁻⁶ m²/s |

So $\\nu$ in cSt equals $\\mu$ in mPa·s divided by $\\rho$ in g/cm³: an oil of 46 cSt and 0.86 g/cm³ has $\\mu \\approx 40$ mPa·s. Older American data give Saybolt Universal Seconds; for thicker oils SUS ≈ 4.63 × cSt.

| Fluid (20 °C unless stated) | μ (mPa·s) | ν (cSt) |
|---|---|---|
| Air | 0.018 | 15.1 |
| Water | 1.00 | 1.00 |
| Water, 80 °C | 0.35 | 0.36 |
| ISO VG 46 oil, 40 °C | ≈ 40 | 46 |
| ISO VG 46 oil, 20 °C | ≈ 115 | ≈ 133 |
| Glycerol | 1410 | 1120 |
| Honey | 2000–10 000 | 1500–7000 |

Notice that air has a *larger* kinematic viscosity than water: its viscosity is small, but its density is smaller still.

### Why hydraulics cares
Oil leaking through a narrow gap of height $h$, width $b$ and length $L$ flows in laminar layers and obeys

$$Q = \\frac{b\\,h^3\\,\\Delta p}{12\\,\\mu\\,L}$$

— inversely proportional to the viscosity and proportional to the *cube* of the gap. Thin oil (hot, or the wrong grade) leaks more past pistons, spools and gear faces, so volumetric efficiency falls and the lubricating films get thinner; thick oil (cold) costs pressure in every line, starves pump inlets and makes controls sluggish. Viscosity is also half of the [[reynolds-number-pipes|Reynolds number]], $Re = vD/\\nu$, which decides whether the flow in a pipe is laminar or turbulent. Keeping it inside the right window is the first rule of choosing an oil ([[viscosity-temperature]], [[fluid-selection]]).
`,
  ideas: [
    'Newton\'s law: shear stress = viscosity × shear rate, τ = μ du/dy; for a thin film τ = μU/h.',
    'Dynamic viscosity μ (Pa·s; mPa·s = cP) is the resistance to shear; kinematic viscosity ν = μ/ρ (mm²/s = cSt) is what oil grades quote.',
    'Leakage through a clearance goes as h³/μ: double the gap and it rises eightfold, halve the viscosity and it doubles.',
    'Newtonian liquids (water, oils) have one viscosity at every shear rate; paints and pastes do not.',
    'Viscosity trades leakage and film thickness against pressure loss and sluggishness — it must sit in a window.'
  ],
  pitfalls: [
    'Viscous liquids are heavy liquids — Viscosity and density are unrelated: mercury is 13.5 times denser than water with a similar viscosity (1.5 mPa·s), and a VG 220 gear oil is lighter than water but some 300 times more viscous at 40 °C.',
    'cSt and cP are the same unit — Centistokes measure kinematic viscosity ν, centipoise dynamic viscosity μ; they differ by the density, cP = cSt × ρ (g/cm³). For water they happen to be almost equal; for oil they differ by about 13 %.',
    'Air is less viscous than water in every sense — Its dynamic viscosity is 55 times smaller, but its kinematic viscosity is 15 times larger, so at the same speed and size an airflow has a Reynolds number 15 times lower than a water flow.'
  ],
  formulas: [
    {
      name: 'Newton\'s law of viscosity (a sheared film)',
      expr: 'tau = mu*U/h', tex: '\\tau = \\mu\\,\\dfrac{U}{h}',
      vars: {
        tau: { name: 'shear stress', q: 'pressure', unit: 'Pa', tex: '\\tau' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 40, tex: '\\mu' },
        U: { name: 'speed of the moving wall', q: 'speed', unit: 'm/s', value: 2 },
        h: { name: 'film thickness', q: 'length', unit: 'mm', value: 0.05 }
      },
      note: 'Laminar flow between parallel walls, no pressure gradient along the film. The force on a wall of area A is τA.',
      stories: {
        tau: 'A rod slides at {U} through a bush with an oil film {h} thick. The oil has a viscosity of {mu}. What shear stress does the film put on the rod?',
        mu: 'A plate sliding at {U} on a liquid film {h} thick feels a shear stress of {tau}. What is the viscosity of the liquid?'
      }
    },
    {
      name: 'Kinematic viscosity',
      expr: 'nu = mu/rho', tex: '\\nu = \\dfrac{\\mu}{\\rho}',
      vars: {
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'cSt', tex: '\\nu' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 39.6, tex: '\\mu' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 860, tex: '\\rho' }
      },
      note: 'Take the density at the same temperature as the viscosity.',
      stories: { nu: 'An oil has a dynamic viscosity of {mu} and a density of {rho}. What is its kinematic viscosity?', mu: 'An oil of {nu} has a density of {rho}. What is its dynamic viscosity?' }
    },
    {
      name: 'Leakage through a clearance',
      expr: 'Q = b*h^3*dp/(12*mu*L)', tex: 'Q = \\dfrac{b\\,h^3\\,\\Delta p}{12\\,\\mu\\,L}',
      vars: {
        Q: { name: 'leakage flow', q: 'flowrate', unit: 'cm³/min' },
        b: { name: 'width of the gap (for a spool: its circumference)', q: 'length', unit: 'mm', value: 31.4 },
        h: { name: 'gap height (radial clearance)', q: 'length', unit: 'µm', value: 10 },
        dp: { name: 'pressure difference across the gap', q: 'pressure', unit: 'bar', value: 100, tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 30, tex: '\\mu' },
        L: { name: 'length of the gap (sealing land)', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'Laminar flow between parallel walls, valid while the gap is much thinner than it is long. For a centred spool b = πd; a spool pushed against one side of its bore leaks up to 2.5 times more.',
      practice: { unknowns: ['Q', 'h'] },
      stories: {
        Q: 'A spool with a circumference of {b} has a radial clearance of {h} and a sealing land {L} long, with {dp} across it. How much does it leak with oil of {mu}?',
        h: 'A spool ({b} round, land {L}) leaks {Q} with {dp} across it and oil of {mu}. What is its radial clearance?'
      }
    }
  ],
  examples: [
    {
      title: 'Oil film under a slide',
      q: 'A machine-tool slide with 0.2 m² of bearing area glides at 0.5 m/s on an oil film 0.1 mm thick. The oil has ν = 68 cSt and ρ = 880 kg/m³. What force does the film resist with?',
      steps: [
        'Dynamic viscosity: $\\mu = \\rho\\nu = 880 \\times 68\\times10^{-6} = 0.0598$ Pa·s.',
        'Shear stress: $\\tau = \\mu U/h = 0.0598 \\times 0.5/10^{-4} = 299$ Pa.',
        'Force: $F = \\tau A = 299 \\times 0.2 = 60$ N — and a power of $F U = 30$ W turned into heat in the film.'
      ],
      a: 'About 60 N.'
    },
    {
      title: 'Spool leakage, cold and hot',
      q: 'A 10 mm spool (circumference 31.4 mm) has a radial clearance of 8 µm and a 6 mm sealing land, with 150 bar across it. How much does it leak with oil of 40 mPa·s, and with the same oil hot, at 12 mPa·s?',
      steps: [
        '$Q = b h^3 \\Delta p/(12\\mu L) = 0.0314 \\times (8\\times10^{-6})^3 \\times 1.5\\times10^7 / (12 \\times 0.040 \\times 0.006)$.',
        '$= 2.41\\times10^{-10}/2.88\\times10^{-3} = 8.4\\times10^{-8}$ m³/s $= 5.0$ cm³/min.',
        'Hot oil: the leakage rises in proportion to $1/\\mu$: $5.0 \\times 40/12 = 16.7$ cm³/min.',
        'If the clearance wears to 16 µm the leakage rises another $2^3 = 8$ times. One spool leaks little, but a valve bank and a worn pump add up to litres per minute — all of it turned into heat at full pressure.'
      ],
      a: '5.0 cm³/min with the cool oil, 16.7 cm³/min hot.'
    }
  ],
  quiz: [
    { q: 'The liquid film between two plates is made half as thick while the top plate keeps the same speed. The force needed to slide the plate…', choices: ['halves', 'stays the same', 'doubles', 'quadruples'], a: 2,
      why: 'τ = μU/h: halving h doubles the shear rate, and with it the stress and the force.' },
    { q: 'The radial clearance of a spool wears from 5 µm to 10 µm. By what factor does its leakage rise (same oil and pressure)?', answer: 8,
      why: 'Laminar gap leakage is proportional to h³: 2³ = 8.' },
    { q: 'An oil has a kinematic viscosity of 32 cSt and a density of 870 kg/m³. What is its dynamic viscosity?', answer: 27.8, unit: 'mPa·s',
      why: 'μ = ρν = 870 × 32×10⁻⁶ = 0.0278 Pa·s = 27.8 mPa·s.' },
    { q: 'At 20 °C the kinematic viscosity of air is larger than that of water.', a: true,
      why: 'Air: μ = 1.8×10⁻⁵ Pa·s, ρ = 1.2 kg/m³, ν = 15 cSt. Water: ν = 1.0 cSt. Air is much less viscous but far less dense.' },
    { q: 'Which measurement gives the kinematic viscosity directly?', choices: ['the time for oil to drain through a glass capillary under its own weight', 'the torque on a spindle turning in the oil', 'the force to pull a plate across an oil film', 'the pressure drop of a pump-driven flow through a tube'], a: 0,
      why: 'In a gravity capillary the driving pressure ρgh is proportional to density and the resistance to μ, so the drain time measures μ/ρ = ν. The others measure μ.' }
  ],
  problems: [
    { q: 'A 50 mm shaft turns in a bearing 60 mm long with a radial clearance of 0.05 mm, filled with oil of 30 mPa·s. The shaft surface moves at 5 m/s. What friction force does the oil film exert on the shaft?', answer: 28.3, unit: 'N', tol: 0.02,
      steps: ['$\\tau = \\mu U/h = 0.030 \\times 5/5\\times10^{-5} = 3000$ Pa.', 'Film area: $A = \\pi d L = \\pi \\times 0.05 \\times 0.06 = 9.42\\times10^{-3}$ m².', '$F = \\tau A = 28.3$ N (Petroff\'s estimate for a lightly loaded bearing).'] },
    { q: 'An oil has a dynamic viscosity of 150 mPa·s and a density of 0.90 g/cm³. What is its kinematic viscosity?', answer: 166.7, unit: 'cSt', tol: 0.02,
      steps: ['$\\nu = \\mu/\\rho = 0.150/900 = 1.667\\times10^{-4}$ m²/s = 166.7 cSt.'] }
  ],
  applications: [
    'Setting the clearances of pumps, motors and valves: small enough to seal, large enough not to seize.',
    'Journal bearings and slideways, where the viscous film carries the load.',
    'Viscous dampers and couplings that turn relative motion into heat.',
    'Oil condition monitoring: a viscosity more than about 10 % from new usually means contamination, shear loss or the wrong oil topped up.'
  ],
  history: 'Newton proposed in the *Principia* (1687) that the resistance between fluid layers is proportional to the speed with which they slide past each other. The French physician Jean Poiseuille, studying blood flow in the 1830s and 1840s, measured water flowing through fine glass tubes and found the laws of laminar flow; the unit poise (0.1 Pa·s) carries his name, and the stokes (1 cm²/s) that of George Stokes, who put viscous flow on a mathematical footing in 1845.',
  sim: 'prop-couette'
},

/* ================================================================ VISCOSITY AND TEMPERATURE */
{
  id: 'viscosity-temperature', parent: 'liquid-properties', title: 'Viscosity, temperature and viscosity index', level: 2,
  short: 'Oil thins dramatically as it warms — a VG 46 oil has about 570 cSt at 0 °C, 46 at 40 °C and 11 at 80 °C. The Walther equation turns the curve into a straight line; the viscosity index says how flat it is.',
  keywords: ['viscosity index', 'VI', 'Walther equation', 'ASTM D341', 'viscosity-temperature chart', 'ISO 2909', 'ASTM D2270', 'VI improver', 'multigrade', 'HV oil', 'pour point', 'cold start', 'pressure-viscosity', 'Barus', 'shear stability'],
  prereq: ['viscosity', 'physics:temperature', 'math:logarithms'],
  related: ['hydraulic-oils', 'fluid-selection', 'heat-coolers', 'energy-losses-heat', 'pump-efficiencies', 'non-newtonian', 'chemistry:surface-tension-viscosity'],
  body: `
Warm a liquid and its molecules jostle harder and slip past each other more easily: its viscosity falls. For water the change is moderate — 1.79 mPa·s at 0 °C, 1.00 at 20 °C, 0.28 at 100 °C. For oils it is dramatic, and after the grade itself it is the most important fact about a hydraulic fluid:

| ISO VG 46 mineral oil (VI ≈ 100) | −10 °C | 0 °C | 20 °C | 40 °C | 60 °C | 80 °C | 100 °C |
|---|---|---|---|---|---|---|---|
| ν (cSt) | ≈ 1450 | ≈ 570 | ≈ 133 | 46 | ≈ 21 | ≈ 11 | 6.8 |

A factor of two hundred between a frosty morning and a hot afternoon. Cold, the oil can hardly be drawn into the pump; hot, it leaks past every clearance and its lubricating films thin out.

### The Walther equation
Plotted plainly, $\\nu(T)$ is a steep, bending curve. In 1931 Carl Walther found that a double logarithm straightens it: for mineral oils

$$\\log\\log(\\nu + 0.7) = A - B\\log T$$

with $\\nu$ in cSt and $T$ in kelvin, is very nearly a straight line. The standard viscosity–temperature chart (ASTM D341) is ruled this way, so the two points on every datasheet — the viscosities at 40 °C and 100 °C — fix the whole line, and it can be read with confidence from well below zero to above 100 °C. Written through those two points, the calculator below finds the viscosity at any temperature, or the temperature at which the oil reaches a chosen viscosity. The line fails only near the **pour point**, where wax crystals begin to form.

### The viscosity index
The **viscosity index** (VI) puts one number on how flat the line is. In 1929 Dean and Davis compared an oil with two families of reference oils having the same viscosity at 100 °C (in today's form): a Pennsylvanian crude that thinned little, given VI = 100, and a Gulf Coast crude that thinned a lot, VI = 0. If $L$ and $H$ are their viscosities at 40 °C and $U$ that of the oil,

$$VI = 100\\,\\frac{L - U}{L - H}$$

The tables of $L$ and $H$ are in ISO 2909 and ASTM D2270; above 100 a logarithmic formula takes over, so that very flat oils still get sensible numbers.

| Fluid | Typical VI |
|---|---|
| Naphthenic mineral oil | 20–70 |
| Paraffinic mineral oil, HM/HLP | 95–110 |
| HV/HVLP oil with VI improver | 140–200 |
| Synthetic ester, polyalphaolefin | 140–190 |
| Rapeseed oil (HETG) | ≈ 210 |

High-VI oils get their flat line either from their base oil (synthetics, severely hydrocracked mineral oils) or from **VI improvers**: long polymer molecules that stay coiled in cold oil and uncoil and thicken it when hot. In the intense shear of pumps and valves those molecules are stretched and slowly broken, so an HV oil loses part of its viscosity in service; its **shear stability** is part of choosing it ([[non-newtonian]]).

### Pressure thickens oil too
Viscosity also rises with pressure, roughly as $\\mu = \\mu_0\\,e^{\\alpha p}$ (Barus, 1893), with $\\alpha \\approx 2\\times10^{-8}$ Pa⁻¹ for mineral oils: at 350 bar the viscosity has about doubled. It matters in the heavily loaded contacts of gear teeth and rolling bearings, where pressures reach thousands of bar and the oil becomes almost solid for an instant, and a little in high-pressure leakage.

> [!key] Choose a grade by the temperatures the oil will really see: fluid enough at a cold start to reach the pump, thick enough when hot to keep its films. A high VI widens the window; a cooler or a tank heater moves the temperatures into it.
`,
  ideas: [
    'Oil viscosity falls steeply with temperature: a VG 46 oil has about 570 cSt at 0 °C, 46 at 40 °C and 11 at 80 °C.',
    'The Walther equation, log log(ν + 0.7) = A − B log T, makes the curve a straight line fixed by two points (40 °C and 100 °C).',
    'The viscosity index measures how flat the line is: about 100 for ordinary mineral oils, 140–200 for HV and synthetic fluids.',
    'VI improvers are polymers that shear can break, so an HV oil can lose viscosity in service.',
    'Viscosity also rises with pressure — roughly doubling by 350 bar for mineral oil.'
  ],
  pitfalls: [
    'The ISO VG number is the oil\'s viscosity — It is the viscosity at 40 °C only. The same VG 46 oil has over 500 cSt on a cold morning and about 11 cSt at 80 °C.',
    'A higher VI means a thicker oil — VI says how little the viscosity changes with temperature, not how large it is: a VG 32 oil with VI 200 is thinner at 40 °C than a VG 46 with VI 100.',
    'Between the datasheet points the viscosity can be interpolated linearly — The relation is strongly curved. Linear interpolation between 46 cSt at 40 °C and 6.8 cSt at 100 °C gives 33 cSt at 60 °C; the real value is about 21. Interpolate on the Walther (double-log) scale, as the formula and the ASTM chart do.'
  ],
  formulas: [
    {
      name: 'Viscosity at any temperature from two datasheet points (Walther, ASTM D341)',
      expr: 'log(log(nu + 0.7)) = log(log(nu40 + 0.7)) + (log(log(nu100 + 0.7)) - log(log(nu40 + 0.7)))*(log(T) - log(T40))/(log(T100) - log(T40))',
      tex: '\\log\\log(\\nu + 0.7) = \\log\\log(\\nu_{40} + 0.7) + \\left[\\log\\log(\\nu_{100} + 0.7) - \\log\\log(\\nu_{40} + 0.7)\\right]\\dfrac{\\log T - \\log T_{40}}{\\log T_{100} - \\log T_{40}}',
      vars: {
        nu: { name: 'kinematic viscosity at T', q: false, unit: 'cSt', tex: '\\nu' },
        nu40: { name: 'viscosity at 40 °C (datasheet)', q: false, unit: 'cSt', value: 46, tex: '\\nu_{40}' },
        nu100: { name: 'viscosity at 100 °C (datasheet)', q: false, unit: 'cSt', value: 6.83, tex: '\\nu_{100}' },
        T: { name: 'oil temperature', q: 'temperature', unit: '°C', value: 0, signed: true },
        T40: { name: 'first datasheet temperature', q: 'temperature', unit: '°C', value: 40, fixed: true, tex: 'T_{40}' },
        T100: { name: 'second datasheet temperature', q: 'temperature', unit: '°C', value: 100, fixed: true, tex: 'T_{100}' }
      },
      solveFor: 'nu',
      note: 'Logarithms to base 10, viscosities in cSt, temperatures absolute (the calculator converts °C). For mineral and most synthetic oils above their pour point.',
      practice: { unknowns: ['nu', 'T'] },
      stories: {
        nu: 'An oil has {nu40} at 40 °C and {nu100} at 100 °C. What is its viscosity at {T}?',
        T: 'An oil has {nu40} at 40 °C and {nu100} at 100 °C. At what temperature does its viscosity reach {nu}?'
      }
    },
    {
      name: 'Viscosity index (up to 100)',
      expr: 'VI = 100*(L - U)/(L - H)', tex: '\\mathrm{VI} = 100\\,\\dfrac{L - U}{L - H}',
      vars: {
        VI: { name: 'viscosity index', tex: '\\mathrm{VI}' },
        L: { name: '40 °C viscosity of the VI 0 reference oil (table)', q: false, unit: 'cSt', value: 78 },
        U: { name: '40 °C viscosity of the oil', q: false, unit: 'cSt', value: 55 },
        H: { name: '40 °C viscosity of the VI 100 reference oil (table)', q: false, unit: 'cSt', value: 48.6 }
      },
      note: 'L and H are read from the tables of ISO 2909 or ASTM D2270 for the oil\'s own viscosity at 100 °C (the defaults are for 7.0 cSt). For oils with VI above 100 the standards use a logarithmic formula instead.',
      stories: { VI: 'An oil has {U} at 40 °C. For its 100 °C viscosity the tables give L = {L} and H = {H}. What is its viscosity index?' }
    },
    {
      name: 'Viscosity rising with pressure (Barus)',
      expr: 'mu = mu0*exp(alpha*p)', tex: '\\mu = \\mu_0\\,e^{\\alpha p}',
      vars: {
        mu: { name: 'dynamic viscosity at pressure p', q: 'viscosity', unit: 'mPa·s', tex: '\\mu' },
        mu0: { name: 'viscosity at atmospheric pressure', q: 'viscosity', unit: 'mPa·s', value: 40, tex: '\\mu_0' },
        alpha: { name: 'pressure–viscosity coefficient (1/Pa)', unit: '1/Pa', value: 2e-8, tex: '\\alpha' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 350 }
      },
      note: 'α ≈ 1.5–2.5 × 10⁻⁸ Pa⁻¹ for mineral oils, less for water-based fluids. Over-predicts at very high pressures.',
      stories: { mu: 'An oil has {mu0} at atmospheric pressure. With a pressure–viscosity coefficient of {alpha}, what is its viscosity at {p}?' }
    }
  ],
  examples: [
    {
      title: 'A cold morning',
      q: 'A machine uses a VG 46 oil with 46 cSt at 40 °C and 6.83 cSt at 100 °C. What is its viscosity at 0 °C?',
      steps: [
        'Double logarithms of the datasheet points: $\\log\\log(46.7) = 0.2225$ and $\\log\\log(7.53) = -0.0571$.',
        'Temperatures in kelvin, as logarithms: $\\log 273.15 = 2.4364$, $\\log 313.15 = 2.4958$, $\\log 373.15 = 2.5719$; the fraction along the line is $(2.4364 - 2.4958)/(2.5719 - 2.4958) = -0.780$ — outside the two points, on the cold side.',
        '$\\log\\log(\\nu + 0.7) = 0.2225 + (-0.0571 - 0.2225)(-0.780) = 0.4406$.',
        'Undo the logarithms: $\\log(\\nu + 0.7) = 10^{0.4406} = 2.757$, so $\\nu + 0.7 = 10^{2.757} = 572$ and $\\nu \\approx 571$ cSt.'
      ],
      a: 'About 570 cSt — twelve times its viscosity at 40 °C.'
    },
    {
      title: 'A viscosity index',
      q: 'A naphthenic oil has 55 cSt at 40 °C and 7.0 cSt at 100 °C. For 7.0 cSt the ASTM D2270 table gives L = 78.0 cSt and H = 48.6 cSt. What is its VI?',
      steps: [
        '$VI = 100 (L - U)/(L - H) = 100 \\times (78.0 - 55)/(78.0 - 48.6)$.',
        '$= 100 \\times 23/29.4 = 78$.',
        'The oil thins more with temperature than a VI 100 oil with the same 100 °C viscosity (which would have 48.6 cSt at 40 °C, not 55).'
      ],
      a: 'VI ≈ 78.'
    }
  ],
  quiz: [
    { q: 'A VG 46 oil (VI 100) has 46 cSt at 40 °C. At 80 °C it has roughly…', choices: ['23 cSt — half', '11 cSt', '40 cSt', '2 cSt'], a: 1,
      why: 'Oil viscosity falls much faster than in proportion to temperature: about 21 cSt at 60 °C and 11 cSt at 80 °C.' },
    { q: 'Two VG 46 oils: A has VI 100, B has VI 160. At a cold start at −10 °C, which is thicker?', choices: ['A', 'B', 'both the same, since both are VG 46', 'it depends on their densities'], a: 0,
      why: 'They agree only at 40 °C. The flatter line of B means it thickens less in the cold: about 760 cSt against 1450 cSt for A.' },
    { q: 'An oil with a high viscosity index is always thicker than one with a low index.', a: false,
      why: 'VI describes how the viscosity changes with temperature, not its size. The grade (viscosity at 40 °C) says how thick it is.' },
    { q: 'With the Barus relation and α = 2×10⁻⁸ Pa⁻¹, by what factor does the viscosity of a mineral oil rise at 500 bar?', answer: 2.718,
      why: 'αp = 2×10⁻⁸ × 5×10⁷ = 1, and e¹ = 2.72.' },
    { q: 'Why is the ASTM viscosity–temperature chart ruled as log log(ν + 0.7) against log T?', choices: ['it turns the curve of a mineral oil into a straight line, so two points fix it', 'ISO 3448 requires it', 'it keeps the viscosity from going negative', 'it is the only scale on which water fits'], a: 0,
      why: 'Walther\'s double logarithm makes the curve nearly straight, so the 40 °C and 100 °C values define the viscosity at any other temperature.' }
  ],
  problems: [
    { q: 'An HV oil has 46 cSt at 40 °C and 8.2 cSt at 100 °C. What is its viscosity at −10 °C?', answer: 836, unit: 'cSt', tol: 0.03,
      hint: 'Use the Walther formula with T = 263.15 K.',
      steps: ['$\\log\\log(46.7) = 0.2225$; $\\log\\log(8.9) = -0.0226$.', 'Fraction along the line: $(\\log 263.15 - \\log 313.15)/(\\log 373.15 - \\log 313.15) = -0.992$.', '$\\log\\log(\\nu + 0.7) = 0.2225 + (-0.2451)(-0.992) = 0.4658$, so $\\log(\\nu + 0.7) = 2.923$ and $\\nu \\approx 836$ cSt — against about 1450 cSt for a VI 100 oil of the same grade.'] },
    { q: 'A VG 32 oil has 32 cSt at 40 °C and 5.43 cSt at 100 °C. At what temperature does it thin to 16 cSt?', answer: 58.5, unit: '°C', tol: 0.02,
      steps: ['Set ν = 16 cSt in the Walther formula and solve for T.', '$T \\approx 331.6$ K $= 58.5$ °C.'] }
  ],
  applications: [
    'Choosing the grade and VI for a machine that starts cold and runs hot ([[fluid-selection]]).',
    'Sizing coolers and tank heaters to keep the oil inside its viscosity window ([[heat-coolers]]).',
    'Aircraft and arctic machines, whose very high-VI fluids work from −40 °C to above 100 °C.',
    'Engine oils: a multigrade such as 10W-40 is a high-VI oil built with VI improvers.'
  ],
  history: 'E. W. Dean and G. H. B. Davis introduced the viscosity index in 1929, when refiners wanted to show that oils from some crudes held their viscosity better than others. Carl Walther published his double-logarithmic equation in 1931; the ASTM charts built on it are still how oil viscosities are carried from the datasheet to the temperatures a machine actually sees.',
  sim: 'prop-visc-temp'
},

/* ================================================================ BULK MODULUS */
{
  id: 'bulk-modulus', parent: 'liquid-properties', title: 'Bulk modulus and compressibility', level: 2,
  short: 'How hard a liquid resists being squeezed: K = −V dp/dV. Mineral oil has K ≈ 1.4–1.8 GPa, so it shrinks about 0.6 % per 100 bar — enough to make actuators springy, to cost pump volume before a press builds force, and to store energy that must be released with care.',
  keywords: ['bulk modulus', 'compressibility', 'effective bulk modulus', 'secant', 'tangent', 'isothermal', 'isentropic', 'adiabatic', 'hydraulic stiffness', 'oil spring', 'compression volume', 'decompression shock', 'speed of sound', 'trapped oil', 'thermal relief valve'],
  prereq: ['physics:shear-bulk-modulus', 'density-specific-weight', 'pressure-definition'],
  related: ['air-in-oil', 'hydraulic-stiffness', 'wave-speed', 'water-hammer', 'accumulators', 'industrial-presses', 'servo-loop', 'physics:speed-of-sound'],
  body: `
Liquids are called incompressible, and for flow in pipes they may as well be. But squeeze oil to 300 bar and it shrinks by nearly 2 %, and that small change governs how stiff a hydraulic actuator is, how quickly pressure can build in a press, how much energy a pressurised line holds, and how fast pressure waves run along a pipe.

### The definition
The **bulk modulus** $K$ is the pressure change needed per unit fractional change of volume:

$$K = -V\\,\\frac{dp}{dV} \\qquad\\Rightarrow\\qquad \\Delta V \\approx \\frac{V\\,\\Delta p}{K}$$

The minus sign makes $K$ positive, since the volume shrinks as the pressure rises; its inverse $1/K$ is the **compressibility**. $K$ has the units of pressure and is quoted in GPa ([[physics:shear-bulk-modulus|bulk modulus]] of solids is the same idea).

| Material | K (GPa) | Volume change per 100 bar |
|---|---|---|
| Mineral hydraulic oil | 1.4–1.8 | 0.55–0.7 % |
| Water, 20 °C | 2.2 | 0.45 % |
| Glycerol | ≈ 4.5 | 0.22 % |
| Mercury | ≈ 25 | 0.04 % |
| Steel | ≈ 160 | 0.006 % |
| Air at 10 bar absolute (slow) | 0.001 | — |

A few distinctions matter when reading data. The **isothermal** modulus applies to slow changes, when heat has time to leave; the **isentropic** (adiabatic) one, some 15 % higher for oil, to fast ones such as pressure waves. The **secant** modulus, from atmospheric pressure to $p$, is used for compression volumes; the **tangent** modulus, the local slope, for stiffness. All of them rise with pressure (a few per cent per 100 bar) and fall with temperature (by roughly a fifth between 20 and 80 °C).

### The effective bulk modulus
In a real circuit the oil is not the only thing that gives. Hoses swell, tubes and cylinder barrels stretch, and bubbles of undissolved air compress far more than the oil. Their compliances add, like springs in series:

$$\\frac{1}{K_e} = \\frac{1}{K_{\\text{oil}}} + \\frac{1}{K_c} + \\frac{x_a}{n\\,p}$$

Here $K_c$ describes the container, $x_a$ is the volume fraction of free air at the absolute pressure $p$, and $n$ runs from 1 (slow) to 1.4 (fast). A steel tube is stiff — a thin wall of thickness $e$ gives $K_c = eE/D$, about 25 GPa for a 16 mm bore with a 2 mm wall — a hose much softer, and a tenth of a per cent of air at 50 bar costs about as much again. Designers of servo systems therefore take $K_e$ of about 0.7–1.2 GPa rather than the handbook value; and air matters most at *low* pressure, where its bubbles are big ([[air-in-oil]]).

### What it does
- **Stiffness.** Oil trapped in a cylinder is a spring of stiffness $k = K A^2/V$: a large area and a short oil column make a stiff actuator. With a load mass it has a natural frequency $\\omega = \\sqrt{k/m}$ that limits how fast a position loop can be ([[hydraulic-stiffness]]).
- **Compression volume.** Before a press can build force the pump must first squeeze its oil: 20 L taken to 300 bar needs 0.38 L more — at 10 L/min, over two seconds of pumping with nothing moving.
- **Stored energy.** Compressed oil holds $E = V\\,\\Delta p^2/(2K)$, some 5.6 kJ for those 20 L at 300 bar. Released suddenly by opening a large valve, it causes the bang and pipe shake of **decompression shock**, which is why big presses decompress through a small valve first.
- **Waves.** Sound travels through the liquid at $c = \\sqrt{K/\\rho}$ — about 1350 m/s in oil and 1480 m/s in water, and less in a pipe that stretches ([[wave-speed]], [[water-hammer]]).

> [!warn] Oil trapped in a closed volume and heated cannot expand, so its pressure rises by about $K\\beta \\approx$ 10 bar per kelvin: a cylinder with both ports blocked standing in the sun, or a pipe between two closed valves, can reach bursting pressure. Such volumes are protected by thermal relief valves. Compressed oil and pressurised lines store energy — release the pressure and lock out the machine before opening anything, and never feel for a leak with your hand: oil from a pinhole can be injected through the skin, an injury that looks small but needs emergency surgery. Seek emergency medical care at once.
`,
  ideas: [
    'Bulk modulus K = −V dp/dV: mineral oil\'s 1.4–1.8 GPa means about 0.6 % less volume per 100 bar.',
    'The effective bulk modulus of a real circuit — oil, pipes, hoses and entrained air in series — is typically 0.7–1.2 GPa.',
    'Compressed oil is a spring, k = KA²/V, which sets an actuator\'s stiffness and natural frequency.',
    'Compressing oil costs pump volume, and releasing it releases stored energy — decompression shock.',
    'Trapped oil that is heated gains roughly 10 bar per kelvin; thermal relief valves guard closed volumes.'
  ],
  pitfalls: [
    'Oil is incompressible, so a hydraulic actuator is perfectly rigid — Oil shrinks about 0.6 % per 100 bar, and hoses and air add more; a long cylinder has a measurable springiness that limits positioning accuracy and response.',
    'Air makes no difference at high pressure, so a little air is harmless — At high pressure the bubbles are tiny, but at low pressure — the start of every stroke — they dominate: 1 % of free air (measured at atmospheric pressure) more than halves the effective modulus at 10 bar.',
    'The handbook bulk modulus is the one to design with — It is the value for pure, air-free oil in a rigid container. Circuits are designed with an effective value that includes pipes, hoses and air, often half as large.'
  ],
  formulas: [
    {
      name: 'Volume lost to compression',
      expr: 'dV = V*dp/K', tex: '\\Delta V = \\dfrac{V\\,\\Delta p}{K}',
      vars: {
        dV: { name: 'reduction in volume (extra oil to pump in)', q: 'volume', unit: 'L', tex: '\\Delta V' },
        V: { name: 'volume of oil under pressure', q: 'volume', unit: 'L', value: 20 },
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', value: 300, tex: '\\Delta p' },
        K: { name: 'bulk modulus (secant)', q: 'pressure', unit: 'GPa', value: 1.6 }
      },
      note: 'Valid while ΔV is small compared with V. Use the secant modulus over the pressure range — or the effective modulus of the whole circuit.',
      stories: {
        dV: 'A press holds {V} of oil between the pump and the ram. How much extra oil must the pump deliver to raise its pressure by {dp}, if the bulk modulus is {K}?',
        K: 'Raising {V} of oil by {dp} takes {dV} of extra oil. What is the effective bulk modulus?'
      }
    },
    {
      name: 'Effective bulk modulus: oil, container and air',
      expr: 'Ke = 1/(1/Koil + 1/Kc + xa/(n*p))', tex: 'K_e = \\dfrac{1}{\\dfrac{1}{K_{\\text{oil}}} + \\dfrac{1}{K_c} + \\dfrac{x_a}{n\\,p}}',
      vars: {
        Ke: { name: 'effective bulk modulus', q: 'pressure', unit: 'GPa', tex: 'K_e' },
        Koil: { name: 'bulk modulus of the oil', q: 'pressure', unit: 'GPa', value: 1.6, tex: 'K_{\\text{oil}}' },
        Kc: { name: 'modulus of the container (tubes, hoses, barrel)', q: 'pressure', unit: 'GPa', value: 5, tex: 'K_c' },
        xa: { name: 'free air, fraction of the volume at pressure p', q: 'ratio', unit: '%', value: 0.1, tex: 'x_a' },
        n: { name: 'polytropic exponent of the air (1 slow, 1.4 fast)', value: 1.4 },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 51 }
      },
      note: 'Compliances in series. A thin steel tube gives K_c = eE/D; hoses are far softer and their makers give their volume expansion instead.',
      practice: { unknowns: ['Ke', 'xa'] },
      stories: { Ke: 'Oil with K = {Koil} fills lines whose own modulus is {Kc}. It carries {xa} of free air at {p}, compressed with n = {n}. What is the effective bulk modulus?' }
    },
    {
      name: 'Hydraulic spring: stiffness of a trapped oil column',
      expr: 'k = K*A^2/V', tex: 'k = \\dfrac{K A^2}{V}',
      vars: {
        k: { name: 'stiffness', q: 'stiffness', unit: 'N/mm' },
        K: { name: 'effective bulk modulus', q: 'pressure', unit: 'GPa', value: 1.0 },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2 },
        V: { name: 'oil volume under the piston, with its line', q: 'volume', unit: 'L', value: 0.94 }
      },
      note: 'One trapped chamber. A double-acting cylinder with both chambers closed has k = K(A₁²/V₁ + A₂²/V₂). With a moving mass m the natural frequency is ω = √(k/m).',
      stories: { k: 'A cylinder with a piston area of {A} has {V} of oil trapped under it; the effective bulk modulus is {K}. How stiff is the oil column?', V: 'A cylinder of area {A} must be at least {k} stiff with oil of {K}. How much oil may be trapped under the piston?' }
    },
    {
      name: 'Pressure rise of heated trapped oil',
      expr: 'dp = K*beta*dT', tex: '\\Delta p = K\\,\\beta\\,\\Delta T',
      vars: {
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        K: { name: 'bulk modulus', q: 'pressure', unit: 'GPa', value: 1.6 },
        beta: { name: 'volume expansion coefficient of the oil', q: 'expansion', unit: '1/K', value: 0.0007, tex: '\\beta' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }
      },
      note: 'A rigid container. A steel pipe stretches and expands a little itself, lowering the rise by some 10 %; hoses lower it more — but it stays dangerous.',
      stories: { dp: 'A blocked pipe full of oil ({K}, expansion {beta}) warms by {dT}. How far does its pressure rise?', dT: 'How much warming would raise the pressure of trapped oil ({K}, expansion {beta}) by {dp}?' }
    }
  ],
  examples: [
    {
      title: 'Filling a press before it presses',
      q: 'A press holds 20 L of oil between its pump and ram. The pressure must rise from zero to 300 bar before full force is reached; $K$ = 1.6 GPa and the pump delivers 10 L/min. How much oil does compression take, how long, and how much energy is then stored?',
      steps: [
        '$\\Delta V = V\\Delta p/K = 0.020 \\times 3\\times10^7/1.6\\times10^9 = 3.75\\times10^{-4}$ m³ = 0.375 L.',
        'At 10 L/min: $0.375/10 \\times 60 = 2.25$ s of pumping during which the ram hardly moves.',
        'Stored energy: $E = V\\Delta p^2/(2K) = 0.020 \\times (3\\times10^7)^2/(3.2\\times10^9) = 5600$ J.',
        'Released in a few milliseconds through a big valve, 5.6 kJ is a violent shock; the press decompresses through a small valve first.'
      ],
      a: '0.375 L, about 2.3 s, and 5.6 kJ stored.'
    },
    {
      title: 'How springy is a cylinder?',
      q: 'A 63 mm cylinder ($A$ = 31.2 cm²) holds a 2000 kg load with 0.94 L of oil (barrel plus hose) trapped under the piston. Take $K_e$ = 1.0 GPa. What is the oil stiffness, the natural frequency, and the deflection if the load changes by 5 kN?',
      steps: [
        '$k = K A^2/V = 10^9 \\times (3.12\\times10^{-3})^2/9.4\\times10^{-4} = 1.04\\times10^7$ N/m = 10 400 N/mm.',
        '$\\omega = \\sqrt{k/m} = \\sqrt{1.04\\times10^7/2000} = 72$ rad/s, so $f = \\omega/2\\pi = 11.5$ Hz.',
        'Deflection: $5000/1.04\\times10^7 = 0.48$ mm.',
        'A position loop around this cylinder can respond only to a fraction of 11.5 Hz; halving the trapped volume or removing air raises the frequency by √2.'
      ],
      a: 'About 10 400 N/mm, 11.5 Hz, and 0.5 mm of give for 5 kN.'
    }
  ],
  quiz: [
    { q: 'A system holds 50 L of oil with K = 1.5 GPa. About how much oil must the pump add to raise all of it from 0 to 200 bar?', answer: 0.667, unit: 'L',
      why: 'ΔV = VΔp/K = 0.050 × 2×10⁷/1.5×10⁹ = 6.7×10⁻⁴ m³ = 0.67 L.' },
    { q: 'Why does a little entrained air hurt stiffness most at low pressure?', choices: ['at low pressure the bubbles are large and their compressibility (1/p) is high', 'air dissolves completely at low pressure', 'oil is softer than air at low pressure', 'air only enters the oil at low pressure'], a: 0,
      why: 'Free air of volume fraction x adds x/(np) to the compressibility; at low p both x (bigger bubbles) and 1/p are large.' },
    { q: 'The oil column under a piston is made twice as long (same bore). Its stiffness…', choices: ['doubles', 'halves', 'quadruples', 'falls to a quarter'], a: 1,
      why: 'k = KA²/V: doubling the volume halves the stiffness.' },
    { q: 'A pressure wave travels through oil at about the speed of sound in air.', a: false,
      why: 'c = √(K/ρ) = √(1.6×10⁹/870) ≈ 1360 m/s in oil, four times the 343 m/s in air.' },
    { q: 'A cylinder\'s bore is doubled while the oil volume under the piston stays the same. Its hydraulic stiffness…', choices: ['doubles', 'quadruples', 'rises sixteen-fold', 'halves'], a: 2,
      why: 'The area rises four times, and k grows with A²: sixteen times.' }
  ],
  problems: [
    { q: 'What is the speed of sound in an oil with K = 1.6 GPa and ρ = 870 kg/m³?', answer: 1356, unit: 'm/s', tol: 0.02,
      steps: ['$c = \\sqrt{K/\\rho} = \\sqrt{1.6\\times10^9/870} = 1356$ m/s.'] },
    { q: 'A 50 mm bore piston ($A$ = 19.6 cm²) has 0.5 L of oil trapped under it, with $K_e$ = 1.2 GPa. What is the stiffness of the oil column in N/mm?', answer: 9250, unit: 'N/mm', tol: 0.02,
      steps: ['$k = K A^2/V = 1.2\\times10^9 \\times (1.963\\times10^{-3})^2/5\\times10^{-4}$.', '$= 9.25\\times10^6$ N/m = 9250 N/mm.'] }
  ],
  applications: [
    'Servo and proportional positioning, where the oil spring sets the natural frequency and so the achievable response ([[servo-loop]]).',
    'Presses and injection moulding: compression volume, decompression valves and pre-compression.',
    'Pipelines and water mains, where the bulk modulus sets the pressure-wave speed and the Joukowsky surge ([[joukowsky-surge]]).',
    'Common-rail diesel injection and water-jet cutting, where fuel or water at 2000–4000 bar is compressed by roughly 10 %.'
  ],
  history: 'In the 1660s the Florentine Accademia del Cimento tried to squeeze water inside a silver sphere; the water sweated through the metal and they concluded that it could not be compressed. John Canton showed in 1762, with a glass bulb and a fine stem like a thermometer\'s, that water does shrink under pressure — by some 45 millionths of its volume per atmosphere, close to the modern value.',
  sim: 'prop-compress'
},

/* ================================================================ VAPOUR PRESSURE */
{
  id: 'vapour-pressure', parent: 'liquid-properties', title: 'Vapour pressure and boiling', level: 1,
  short: 'Every liquid evaporates until its vapour reaches a pressure that depends only on the temperature. When the pressure on the liquid falls to that vapour pressure it boils — at 100 °C at sea level, at 90 °C at 3000 m, and at room temperature in a starved pump inlet.',
  keywords: ['vapour pressure', 'vapor pressure', 'saturation pressure', 'boiling point', 'altitude', 'Antoine equation', 'Clausius-Clapeyron', 'pressure cooker', 'suction lift', 'cavitation', 'NPSH', 'evaporation', 'steam tables', 'IAPWS'],
  prereq: ['gauge-absolute', 'physics:latent-heat', 'chemistry:vapor-pressure'],
  related: ['cavitation', 'npsh', 'priming-suction', 'siphons', 'column-separation', 'air-in-oil', 'fire-resistant-fluids', 'chemistry:clausius-clapeyron', 'aerodynamics:standard-atmosphere'],
  body: `
Leave a glass of water in a closed box and some of it evaporates: the fastest molecules escape through the surface until the vapour above is dense enough that as many return as leave. The pressure of that vapour is the liquid's **vapour pressure** $p_v$ (or saturation pressure). It depends on the liquid and its temperature and on nothing else, and it rises steeply as the liquid warms:

| Water at | 0 °C | 20 °C | 40 °C | 60 °C | 80 °C | 100 °C | 120 °C | 150 °C |
|---|---|---|---|---|---|---|---|---|
| $p_v$ (kPa, absolute) | 0.61 | 2.34 | 7.38 | 19.9 | 47.4 | 101.4 | 198.7 | 476 |

A liquid **boils** when its vapour pressure equals the pressure on it: bubbles of vapour can then grow inside the liquid, not only evaporate from its surface. At sea level, under 101.3 kPa, water boils at 100 °C. Carry the pot up a mountain, where the air pressure is lower, and it boils cooler; seal it in a pressure cooker at about 1 bar gauge and it reaches 120 °C before it boils — which is why food cooks faster.

| Altitude (standard atmosphere) | 0 m | 1000 m | 2000 m | 3000 m | 5000 m | 8849 m |
|---|---|---|---|---|---|---|
| Air pressure (kPa) | 101.3 | 89.9 | 79.5 | 70.1 | 54.0 | 31.4 |
| Water boils at | 100 °C | 96.6 °C | 93.3 °C | 90.0 °C | 83.3 °C | ≈ 70 °C |

### Describing the curve
Thermodynamics gives the slope of the curve, the **Clausius–Clapeyron** relation, $\\ln(p_2/p_1) = (L/R)(1/T_1 - 1/T_2)$, with $L$ the molar latent heat of evaporation (40.7 kJ/mol for water at 100 °C) and temperatures in kelvin ([[chemistry:clausius-clapeyron]]). For numbers, engineers use fitted equations such as **Antoine's**,

$$\\log_{10} p_v = A - \\frac{B}{C + T}$$

which for water, with $p_v$ in kPa and $T$ in °C, has $A = 7.1962$, $B = 1730.63$ and $C = 233.426$, good to about half a per cent from 1 to 100 °C. Steam tables — today the IAPWS-IF97 formulation — cover the whole range up to the critical point, 374 °C and 221 bar.

### Why hydraulic engineers care
The pressure in a flowing liquid can fall far below atmospheric: in a pump's inlet, on the back of an impeller or propeller blade, at the top of a siphon, in the throat of a valve. If it falls to the vapour pressure the liquid boils *cold*: vapour cavities form and then collapse violently when they reach higher pressure. That is **cavitation**, with its noise, lost performance and pitted metal ([[cavitation]]). Every pump-inlet calculation is a comparison with $p_v$ ([[npsh]]), and it sets a hard limit on suction: even a perfect vacuum can lift water only $(p_{atm} - p_v)/\\rho g$ — 10.1 m at 20 °C at sea level, less for hot water, less at altitude ([[priming-suction]]).

Mineral hydraulic oils have tiny vapour pressures — far below 0.01 bar even when hot — so in oil systems the first bubbles to appear at low pressure are usually dissolved *air* coming out of solution ([[air-in-oil]]). Water-based fire-resistant fluids, though, have nearly the vapour pressure of water, and their pumps need generously fed inlets ([[fire-resistant-fluids]]).

> [!note] Vapour pressure is an **absolute** pressure. Compare it only with absolute pressures: a pump-inlet gauge reading −0.8 bar under an atmosphere of 1.013 bar means about 21 kPa absolute — above the vapour pressure of water at 20 °C, but equal to it at about 61 °C.
`,
  ideas: [
    'Vapour pressure is the pressure of a liquid\'s own vapour in equilibrium with it; it depends only on temperature and rises steeply with it.',
    'A liquid boils when the pressure on it falls to its vapour pressure: 100 °C at sea level, 90 °C at 3000 m, 120 °C in a pressure cooker.',
    'Where the pressure in a flowing liquid drops to the vapour pressure it boils cold — cavitation.',
    'Vapour pressure is absolute: compare it with absolute pressures, never with gauge readings.',
    'Suction lift is limited to (p_atm − p_v)/ρg — about 10 m for cold water at sea level, less when hot or high up.'
  ],
  pitfalls: [
    'Water always boils at 100 °C — Only under 101.3 kPa. The boiling point is the temperature at which the vapour pressure equals the pressure on the water; it falls by about 3.3 K per 1000 m of altitude near sea level and rises under pressure.',
    'Boiling needs heating, so a pump cannot make water boil — Lowering the pressure to p_v is enough: the liquid then boils at its own temperature, taking the latent heat from itself. Cavitation in a pump inlet is exactly this.',
    'A strong enough pump can suck water up from any depth — Suction only removes pressure; it is the atmosphere that pushes the water up, and it can push at most (p_atm − p_v)/ρg ≈ 10 m of cold water. Deeper wells need pumps at the bottom.'
  ],
  formulas: [
    {
      name: 'Vapour pressure of water (Antoine)',
      expr: 'log(pv) = A - B/(C + T)', tex: '\\log_{10} p_v = A - \\dfrac{B}{C + T}',
      vars: {
        pv: { name: 'vapour pressure (absolute)', q: false, unit: 'kPa', tex: 'p_v' },
        T: { name: 'water temperature', q: false, unit: '°C', value: 20, signed: true },
        A: { name: 'Antoine constant A (water; kPa, °C)', value: 7.1962, fixed: true },
        B: { name: 'Antoine constant B (water)', q: false, unit: '°C', value: 1730.63, fixed: true },
        C: { name: 'Antoine constant C (water)', q: false, unit: '°C', value: 233.426, fixed: true }
      },
      solveFor: 'pv',
      note: 'For water from 1 to 100 °C, within about 0.5 %. Other liquids have their own constants; above 100 °C use steam tables.',
      practice: { unknowns: ['pv', 'T'] },
      stories: { pv: 'What is the vapour pressure of water at {T}?', T: 'At what temperature does water boil when the pressure on it is {pv} absolute?' }
    },
    {
      name: 'Boiling point at another pressure (Clausius–Clapeyron)',
      expr: 'ln(p2/p1) = L/R*(1/T1 - 1/T2)', tex: '\\ln\\dfrac{p_2}{p_1} = \\dfrac{L}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)',
      vars: {
        p2: { name: 'second pressure (absolute)', q: 'pressure', unit: 'kPa', value: 70.1, tex: 'p_2' },
        p1: { name: 'first pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_1' },
        L: { name: 'molar latent heat of evaporation', q: 'molarenergy', unit: 'kJ/mol', value: 40.7 },
        R: { const: 'R' },
        T1: { name: 'boiling point at p₁', q: 'temperature', unit: '°C', value: 100, tex: 'T_1' },
        T2: { name: 'boiling point at p₂', q: 'temperature', unit: '°C', tex: 'T_2' }
      },
      solveFor: 'T2',
      note: 'Assumes a constant latent heat and an ideal vapour — good over a few tens of kelvin. For water L = 40.7 kJ/mol at 100 °C, 43.9 kJ/mol at 25 °C.',
      practice: { unknowns: ['T2', 'p2'] },
      stories: {
        T2: 'Water boils at {T1} under {p1}. On a mountain the pressure is {p2}. Taking the latent heat as {L}, at what temperature does water boil there?',
        p2: 'Water boils at {T1} under {p1}. What pressure makes it boil at {T2}? (Latent heat {L}.)'
      }
    },
    {
      name: 'Highest possible suction lift',
      expr: 'h = (patm - pv)/(rho*g)', tex: 'h_{\\mathrm{max}} = \\dfrac{p_{\\mathrm{atm}} - p_v}{\\rho g}',
      vars: {
        h: { name: 'theoretical maximum suction lift', q: 'length', unit: 'm', tex: 'h_{\\mathrm{max}}' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_{\\mathrm{atm}}' },
        pv: { name: 'vapour pressure (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: 'A perfect vacuum at the pump and no losses. Real pumps manage perhaps 6–7 m with cold water, because of inlet losses and the pressure margin the pump itself needs (NPSH).',
      stories: { h: 'The atmosphere is at {patm} and the water\'s vapour pressure is {pv} (density {rho}). What is the highest a pump could possibly lift it by suction?' }
    }
  ],
  examples: [
    {
      title: 'Tea at altitude',
      q: 'A trekker boils water at 3500 m, where the standard-atmosphere pressure is 65.8 kPa. At what temperature does it boil?',
      steps: [
        'Antoine solved for $T$: $T = B/(A - \\log_{10} p_v) - C$.',
        '$\\log_{10} 65.8 = 1.818$; $A - 1.818 = 5.378$.',
        '$T = 1730.63/5.378 - 233.426 = 321.8 - 233.4 = 88.4$ °C.',
        'Tea brewed at 88 °C is weaker, and eggs and pasta take markedly longer — hence pressure cookers in high towns.'
      ],
      a: 'About 88 °C.'
    },
    {
      title: 'A pump drawing hot water',
      q: 'A pump draws water at 60 °C. Its inlet gauge reads −0.75 bar and the atmosphere is at 1.01 bar. How close is the water to boiling?',
      steps: [
        'Absolute inlet pressure: $1.01 - 0.75 = 0.26$ bar = 26 kPa.',
        'Vapour pressure at 60 °C (Antoine): $\\log_{10} p_v = 7.1962 - 1730.63/293.43 = 1.298$, so $p_v = 19.9$ kPa.',
        'Margin: $26 - 19.9 = 6.1$ kPa, only $6100/(983 \\times 9.81) = 0.63$ m of water.',
        'The pressure falls further as the water accelerates into the impeller, so this pump will cavitate. Lower the pump, shorten the inlet line, or cool the water.'
      ],
      a: 'Only about 6 kPa (0.6 m) above boiling: it will cavitate.'
    }
  ],
  quiz: [
    { q: 'Water in an open pan at 2000 m altitude boils at about…', choices: ['100 °C', '93 °C', '80 °C', '107 °C'], a: 1,
      why: 'The standard pressure at 2000 m is 79.5 kPa, and water\'s vapour pressure reaches that at 93.3 °C.' },
    { q: 'A pump\'s inlet gauge reads −0.9 bar under an atmosphere of 1.0 bar, and the water is at 40 °C (p_v = 7.4 kPa). Is vapour cavitation likely?', choices: ['no — the pressure is far above the vapour pressure', 'yes — 10 kPa absolute is barely above 7.4 kPa, and the pressure falls further inside the pump', 'no — a negative gauge pressure has no effect on boiling', 'only if the water is salty'], a: 1,
      why: 'Convert to absolute: 1.0 − 0.9 = 0.1 bar = 10 kPa, only 2.6 kPa above p_v. Local pressures in the impeller eye are lower still.' },
    { q: 'A pressure cooker raises the boiling point because the higher pressure must be matched by a higher vapour pressure, which needs a higher temperature.', a: true,
      why: 'At about 2 bar absolute water\'s vapour pressure is reached only at about 120 °C.' },
    { q: 'With Antoine\'s constants for water (A = 7.1962, B = 1730.63, C = 233.426; kPa and °C), what is the vapour pressure at 30 °C?', answer: 4.23, unit: 'kPa',
      why: 'log₁₀ p_v = 7.1962 − 1730.63/263.426 = 0.6265, so p_v = 4.23 kPa.' },
    { q: 'Why is vapour cavitation rarer in mineral-oil hydraulics than in water pumps?', choices: ['oil has a tiny vapour pressure; the first bubbles at low pressure are usually released air', 'oil pumps run more slowly', 'oil is incompressible', 'oil systems have no low-pressure regions'], a: 0,
      why: 'Mineral oil would need an almost perfect vacuum to boil; long before that, dissolved air comes out of solution (gaseous cavitation).' }
  ],
  problems: [
    { q: 'What is the theoretical maximum suction lift of water at 80 °C (p_v = 47.4 kPa, ρ = 972 kg/m³) at sea level (101.3 kPa)?', answer: 5.65, unit: 'm', tol: 0.02,
      steps: ['$h = (101\\,300 - 47\\,400)/(972 \\times 9.807) = 53\\,900/9532 = 5.65$ m — little more than half the cold-water figure.'] },
    { q: 'Using Clausius–Clapeyron with L = 40.7 kJ/mol, at what temperature does water boil under 50 kPa absolute (it boils at 100 °C under 101.3 kPa)?', answer: 80.9, unit: '°C', tol: 0.02,
      steps: ['$1/T_2 = 1/373.15 - (8.314/40\\,700)\\ln(50/101.3) = 0.0026799 + 1.442\\times10^{-4} = 0.0028241$ K⁻¹.', '$T_2 = 354.1$ K = 80.9 °C (steam tables: 81.3 °C — the latent heat is a little larger at lower temperatures).'] }
  ],
  applications: [
    'Pump inlet design and NPSH: keeping the pressure everywhere above p_v ([[npsh]]).',
    'Cooking and sterilising: pressure cookers and autoclaves (121 °C at about 1 bar gauge).',
    'Boiler feed and hot-water circuits, where the water must reach the pump with pressure to spare.',
    'Siphons and high points in pipelines, where the pressure can fall to p_v and the column breaks ([[column-separation]]).'
  ],
  history: 'Galileo recorded the puzzle of Florence\'s well-diggers: their suction pumps could not raise water more than about eighteen braccia, some ten metres. His pupil Torricelli explained it in 1644 with the mercury barometer — the air pushes the water up, and can push no higher. In 1679 Denis Papin showed the Royal Society his "digester", a pressure cooker that softened bones by raising the boiling point; the fitted equation of Louis Charles Antoine followed in 1888.',
  sim: 'prop-vapour'
},

/* ================================================================ SURFACE TENSION */
{
  id: 'surface-tension', parent: 'liquid-properties', title: 'Surface tension and capillarity', level: 1,
  short: 'A liquid surface pulls like a stretched skin, with a force per unit length σ — 73 mN/m for water, about 30 for oil. It makes drops round, raises the pressure inside bubbles, and lifts liquids up narrow tubes by h = 4σ cos θ/(ρgd).',
  keywords: ['surface tension', 'capillarity', 'capillary rise', 'capillary action', 'meniscus', 'contact angle', 'wetting', 'Jurin\'s law', 'Young-Laplace', 'bubble pressure', 'droplet', 'manometer error', 'foam', 'wicking', 'mN/m'],
  prereq: ['physics:surface-tension', 'pressure-with-depth', 'density-specific-weight'],
  related: ['manometers', 'air-in-oil', 'groundwater-darcy', 'weirs-flumes', 'chemistry:surface-tension-viscosity', 'chemistry:intermolecular-forces'],
  body: `
A molecule deep inside a liquid is pulled equally in every direction by its neighbours; one at the surface is pulled only inwards and sideways. The surface therefore tries to shrink, and behaves like an elastic skin under tension. The **surface tension** $\\sigma$ is that pull per unit length of any line drawn on the surface — equally, the energy needed to make a square metre of new surface — in N/m, usually quoted in mN/m.

| Liquid, 20 °C, against air | σ (mN/m) |
|---|---|
| Water | 72.8 (58.9 at 100 °C) |
| Water with a little detergent | 25–35 |
| Mineral hydraulic oil | ≈ 30 |
| Ethanol | 22.3 |
| Glycerol | 63 |
| Mercury | 485 |

By everyday standards it is weak — a 10 cm line on a water surface pulls with only 7 mN, the weight of three-quarters of a gram — but at small scales it beats gravity: it makes droplets round, lets insects stand on a pond and holds a drop hanging from a tap.

### Pressure inside drops and bubbles
A curved surface pulls inwards, so the pressure inside a drop, or a bubble in a liquid, is higher than outside by

$$\\Delta p = \\frac{2\\sigma}{r}$$

(the Young–Laplace equation for a sphere; a soap bubble, with two surfaces, has $4\\sigma/r$). For an air bubble 0.1 mm across in oil the excess is only about 1.2 kPa; for one of 1 µm it is over 1 bar. That is why the smallest bubbles in oil dissolve fastest, and why a liquid needs "seeds" — tiny gas pockets — to start boiling or cavitating.

### Capillary rise
Where a liquid meets a solid, the balance of attractions sets a **contact angle** $\\theta$. Water on clean glass wets it ($\\theta \\approx 0$) and curves up into a hollow meniscus; mercury does not ($\\theta \\approx 140°$) and bulges down. In a narrow tube the surface's pull around the wetted rim lifts (or depresses) the liquid until the weight of the column balances it, $\\sigma\\cos\\theta\\,\\pi d = \\rho g h\\,\\pi d^2/4$, so

$$h = \\frac{4\\,\\sigma\\cos\\theta}{\\rho\\,g\\,d}$$

— Jurin's law. The narrower the tube, the higher the rise:

| Tube bore | 0.1 mm | 0.5 mm | 1 mm | 3 mm | 6 mm | 10 mm |
|---|---|---|---|---|---|---|
| Water rise (clean glass, 20 °C) | 298 mm | 60 mm | 30 mm | 9.9 mm | 5.0 mm | 3.0 mm |

Mercury in a 1 mm glass tube is pushed down by about 11 mm instead.

### In hydraulic practice
- **Manometers and sight glasses** read wrongly if their tubes are narrow: bores of 6–10 mm or more keep the capillary error to a few millimetres, and water is read at the bottom of its meniscus, mercury at the top ([[manometers]]).
- **Small models** of weirs and spillways misbehave when the heads are only a few centimetres, because surface tension, negligible on the real structure, is not scaled down with the model: the water clings to the crest ([[weirs-flumes]]).
- **Soils** hold water by capillarity — fine silts and clays can draw it a metre or more above the water table ([[groundwater-darcy]]).
- **Foam and air release** in hydraulic oil depend on surface tension: antifoam additives weaken the films between bubbles at the surface so they burst, while some contaminants make foam stubborn ([[air-in-oil]]).
`,
  ideas: [
    'Surface tension σ is a force per unit length (or energy per unit area) of a liquid surface: water 73 mN/m, oil about 30, mercury 485.',
    'A curved surface carries a pressure jump Δp = 2σ/r: the smaller the bubble, the higher the pressure inside it.',
    'The contact angle decides whether a liquid wets a solid and climbs a tube (water on glass) or is pushed down (mercury).',
    'Capillary rise h = 4σ cos θ/(ρgd) is inversely proportional to the bore: 30 mm for water in a 1 mm tube.',
    'Capillarity matters at small scales — manometer tubes, soils, models — and in the behaviour of foam.'
  ],
  pitfalls: [
    'A taller tube lifts the water higher — The rise depends only on the bore at the meniscus, the liquid (σ, ρ) and the contact angle; a tube taller than the rise simply stays partly empty.',
    'A liquid always climbs a narrow tube — Only if it wets the wall (θ below 90°). Mercury in glass, or water in a greasy or waxy tube, has θ above 90° and is pushed down.',
    'Surface tension is a fixed property of the liquid alone — It depends on what lies on the other side of the surface and is very sensitive to contamination: a trace of detergent more than halves the surface tension of water.'
  ],
  formulas: [
    {
      name: 'Capillary rise (Jurin\'s law)',
      expr: 'h = 4*sigma*cos(theta)/(rho*g*d)', tex: 'h = \\dfrac{4\\,\\sigma\\cos\\theta}{\\rho\\,g\\,d}',
      vars: {
        h: { name: 'capillary rise (negative: depression)', q: 'length', unit: 'mm', signed: true },
        sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.8, tex: '\\sigma' },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 0, min: 0, max: 180, tex: '\\theta' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        d: { name: 'tube bore', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'For narrow tubes, where the meniscus is close to a spherical cap. In tubes wider than about 10 mm the rise is smaller than this.',
      practice: { unknowns: ['h', 'd'] },
      stories: {
        h: 'A glass tube with a bore of {d} dips into a liquid with surface tension {sigma}, density {rho} and contact angle {theta}. How far does the liquid rise in it?',
        d: 'A water-filled tube (surface tension {sigma}, density {rho}, contact angle {theta}) must show less than {h} of capillary rise. What bore does it need?'
      }
    },
    {
      name: 'Pressure inside a drop or bubble (Young–Laplace)',
      expr: 'dp = 2*sigma/r', tex: '\\Delta p = \\dfrac{2\\sigma}{r}',
      vars: {
        dp: { name: 'excess pressure inside', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 30, tex: '\\sigma' },
        r: { name: 'radius of the drop or bubble', q: 'length', unit: 'µm', value: 50 }
      },
      note: 'One surface: a drop, or a gas bubble inside a liquid. A soap bubble has two surfaces and 4σ/r.',
      stories: { dp: 'A bubble of radius {r} sits in oil with a surface tension of {sigma}. How much higher is the pressure inside it?', r: 'How small must a bubble in a liquid of surface tension {sigma} be for the pressure inside to exceed the outside by {dp}?' }
    }
  ],
  examples: [
    {
      title: 'How wide must a manometer tube be?',
      q: 'A single water-filled piezometer tube should read with a capillary error under 3 mm. What bore does it need? (σ = 72.8 mN/m, θ = 0, ρ = 998 kg/m³)',
      steps: [
        'Jurin solved for the bore: $d = 4\\sigma\\cos\\theta/(\\rho g h)$.',
        '$d = 4 \\times 0.0728/(998 \\times 9.81 \\times 0.003) = 0.2912/29.4 = 9.9\\times10^{-3}$ m.',
        'In a U-tube both legs rise alike and the errors cancel — if both have the same bore and equally clean walls.'
      ],
      a: 'About 10 mm.'
    },
    {
      title: 'A small bubble in the pump inlet',
      q: 'An air bubble 20 µm across sits in oil (σ = 30 mN/m) where the local pressure is 0.80 bar absolute. What is the pressure of the air inside it?',
      steps: [
        '$r = 10$ µm: $\\Delta p = 2\\sigma/r = 2 \\times 0.030/10^{-5} = 6000$ Pa = 0.06 bar.',
        'Inside: $0.80 + 0.06 = 0.86$ bar absolute.',
        'The surface tension squeezes small bubbles, pushing their air back into solution — one reason tiny bubbles vanish while larger ones rise and grow.'
      ],
      a: '0.86 bar absolute.'
    }
  ],
  quiz: [
    { q: 'Water rises 30 mm in a clean 1 mm glass tube. How high does it rise in a 0.5 mm tube?', choices: ['15 mm', '30 mm', '60 mm', '120 mm'], a: 2,
      why: 'h ∝ 1/d: half the bore, twice the rise.' },
    { q: 'Mercury in a narrow glass tube dipped into a dish of mercury…', choices: ['rises above the level outside', 'is pushed below the level outside', 'stays level', 'rises only in wide tubes'], a: 1,
      why: 'Mercury does not wet glass (θ ≈ 140°, cos θ < 0), so the capillary "rise" is negative.' },
    { q: 'How far does ethanol (σ = 22.3 mN/m, ρ = 789 kg/m³, θ = 0) rise in a 1 mm tube?', answer: 11.5, unit: 'mm',
      why: 'h = 4σ/(ρgd) = 4 × 0.0223/(789 × 9.81 × 0.001) = 0.0115 m.' },
    { q: 'The pressure inside a small bubble is higher than inside a large one in the same liquid.', a: true,
      why: 'Δp = 2σ/r grows as the radius shrinks.' },
    { q: 'A drop of detergent is added to the water around a capillary tube. The water in the tube…', choices: ['rises', 'falls', 'stays where it was', 'starts to oscillate'], a: 1,
      why: 'The detergent lowers σ, and the rise is proportional to σ (the water still wets the glass).' }
  ],
  problems: [
    { q: 'What bore of glass tube lifts water (σ = 72.8 mN/m, θ = 0, ρ = 998 kg/m³) by 100 mm?', answer: 0.298, unit: 'mm', tol: 0.02,
      steps: ['$d = 4\\sigma/(\\rho g h) = 0.2912/(998 \\times 9.81 \\times 0.1) = 2.98\\times10^{-4}$ m = 0.298 mm.'] }
  ],
  applications: [
    'Choosing the bores of manometers, sight glasses and piezometer tubes ([[manometers]]).',
    'Wicking in soils, masonry and filter media; rising damp in walls.',
    'Sprays and injectors, inkjet printing, where surface tension shapes the drops.',
    'The foaming and air-release behaviour of hydraulic oils ([[air-in-oil]]).'
  ],
  history: 'James Jurin reported to the Royal Society in 1718 that the height of water in a capillary tube is inversely proportional to its bore. Thomas Young (1805) and Pierre-Simon Laplace (1806) explained capillarity through the tension of the surface and its curvature, giving the pressure jump that bears both their names.',
  sim: 'prop-capillary'
},

/* ================================================================ NON-NEWTONIAN */
{
  id: 'non-newtonian', parent: 'liquid-properties', title: 'Non-Newtonian liquids', level: 2,
  short: 'Liquids whose viscosity changes with how fast they are sheared, or that need a minimum stress before they flow at all: shear-thinning paints and polymer solutions, shear-thickening starch suspensions, and Bingham plastics such as toothpaste, drilling mud and fresh concrete.',
  keywords: ['non-Newtonian', 'rheology', 'rheogram', 'shear-thinning', 'pseudoplastic', 'shear-thickening', 'dilatant', 'Bingham plastic', 'yield stress', 'power law', 'Herschel-Bulkley', 'apparent viscosity', 'thixotropy', 'viscoelastic', 'plug flow', 'concrete pumping', 'drilling mud', 'ketchup'],
  prereq: ['viscosity', 'laminar-pipe-flow', 'physics:stress-strain'],
  related: ['viscosity-temperature', 'hydraulic-oils', 'laminar-turbulent', 'pipe-sizing', 'math:power-functions'],
  body: `
For water and oil, doubling the rate of shear doubles the stress: one number, the viscosity, describes the liquid. Many liquids that engineers pump are not so simple. Ketchup refuses to leave the bottle and then rushes out; paint is thick in the tin and thin under the brush; toothpaste sits on the brush like a solid yet flows out of the tube; a suspension of corn starch runs like cream when stirred gently and turns rigid when struck. Their **rheogram** — shear stress $\\tau$ plotted against shear rate $\\dot\\gamma$ — is not a straight line through the origin.

### The main families
| Behaviour | What happens | Examples |
|---|---|---|
| Newtonian | $\\tau = \\mu\\dot\\gamma$, a straight line through zero | water, mineral oil, air |
| Shear-thinning (pseudoplastic) | thinner the faster it is sheared | paints, ketchup, blood, polymer solutions |
| Shear-thickening (dilatant) | thicker the faster it is sheared | concentrated corn starch, some slurries |
| Bingham plastic | no flow below a yield stress $\\tau_y$, then roughly linear | toothpaste, drilling mud, sewage sludge, fresh concrete |
| Herschel–Bulkley | a yield stress, then shear-thinning | mayonnaise, many food pastes, cement grouts |

Two simple models cover most engineering work. The **power law**

$$\\tau = K\\,\\dot\\gamma^{\\,n}$$

has a consistency $K$ (Pa·sⁿ) and a flow index $n$: $n < 1$ is shear-thinning, $n = 1$ Newtonian, $n > 1$ shear-thickening. Its **apparent viscosity** $\\mu_a = \\tau/\\dot\\gamma = K\\dot\\gamma^{\\,n-1}$ falls with shear rate when $n < 1$: in this picture a paint with $n \\approx 0.45$ is over a hundred times thinner under a brush stroke (thousands of 1/s) than when it hangs on a wall (below 1/s) — thin enough to spread, thick enough not to run. The **Bingham** model

$$\\tau = \\tau_y + \\mu_p\\,\\dot\\gamma \\qquad (\\tau > \\tau_y)$$

adds a **yield stress** $\\tau_y$ and a plastic viscosity $\\mu_p$; below $\\tau_y$ the material does not flow at all.

### Flow in pipes
Non-Newtonian behaviour reshapes the velocity profile. A Newtonian liquid in laminar pipe flow has a parabola ([[laminar-pipe-flow]]); a shear-thinning one a blunter profile, flat across the middle where the shear rate is low; a Bingham plastic moves as a solid **plug** in the core, where the shear stress is below $\\tau_y$, sliding on a sheared layer near the wall. The stress at the wall is $\\tau_w = \\Delta p\\,D/(4L)$, so such a material does not move at all until

$$\\Delta p = \\frac{4\\,\\tau_y\\,L}{D}$$

A pipeline of fresh concrete, drilling mud or sludge must first overcome the yield stress along its whole length: with $\\tau_y$ of a few hundred pascals in a 125 mm line 60 m long, that is several bar before anything moves — one reason concrete pumps are powerful hydraulic machines in their own right.

### Time and memory
Some fluids also change with time. **Thixotropic** ones (drilling mud, yoghurt, some paints) thin while they are worked and slowly rebuild their structure at rest; **viscoelastic** ones (polymer melts, egg white) have an elastic memory, and climb up a spinning rod instead of being flung outwards.

### In hydraulic oils
Plain mineral oils are Newtonian. **HV oils** thickened with polymer VI improvers are mildly shear-thinning: in the very high shear of a pump gap or a spool land the long molecules align and the oil is temporarily thinner than its catalogue viscosity, and prolonged shearing breaks them for good. That is why shear stability is part of choosing an HV oil ([[hydraulic-oils]], [[viscosity-temperature]]).
`,
  ideas: [
    'A non-Newtonian liquid\'s rheogram (τ against shear rate) is not a straight line through the origin.',
    'Power law τ = Kγ̇ⁿ: n < 1 shear-thinning (paints, polymer solutions), n > 1 shear-thickening (starch suspensions).',
    'A Bingham plastic has a yield stress: below it the material stands like a solid, above it it flows — toothpaste, mud, fresh concrete.',
    'In a pipe a yield-stress fluid moves as a plug and needs Δp = 4τ_yL/D just to start.',
    'Polymer-thickened HV oils thin in the high shear of pumps and valves and can lose viscosity permanently.'
  ],
  pitfalls: [
    'One viscosity figure describes any liquid — Only a Newtonian one. For others the "viscosity" depends on the shear rate at which it was measured; a single number without that shear rate means little.',
    'A material that does not flow under its own weight is a solid — A Bingham plastic such as toothpaste holds its shape below its yield stress but flows readily above it; whether it flows depends on the stress applied.',
    'Shear-thinning and thixotropy are the same thing — Shear-thinning is an instant response to the shear rate; thixotropy is a slow, time-dependent loss and recovery of structure. Many fluids show both.'
  ],
  formulas: [
    {
      name: 'Power-law fluid',
      expr: 'tau = Kp*gd^n', tex: '\\tau = K\\,\\dot\\gamma^{\\,n}',
      vars: {
        tau: { name: 'shear stress', q: 'pressure', unit: 'Pa', tex: '\\tau' },
        Kp: { name: 'consistency index (Pa·sⁿ)', unit: 'Pa·sⁿ', value: 10, tex: 'K' },
        gd: { name: 'shear rate', q: 'rate', unit: '1/s', value: 100, tex: '\\dot\\gamma' },
        n: { name: 'flow behaviour index (1 = Newtonian)', value: 0.4 }
      },
      note: 'n < 1 shear-thinning, n > 1 shear-thickening. Fitted over a limited range of shear rates.',
      practice: { unknowns: ['tau', 'gd'] },
      stories: { tau: 'A polymer solution follows a power law with K = {Kp} and n = {n}. What shear stress does it carry at a shear rate of {gd}?', gd: 'A power-law fluid (K = {Kp}, n = {n}) is sheared with a stress of {tau}. What is the shear rate?' }
    },
    {
      name: 'Apparent viscosity of a power-law fluid',
      expr: 'mua = Kp*gd^(n - 1)', tex: '\\mu_a = K\\,\\dot\\gamma^{\\,n-1}',
      vars: {
        mua: { name: 'apparent viscosity', q: 'viscosity', unit: 'Pa·s', tex: '\\mu_a' },
        Kp: { name: 'consistency index (Pa·sⁿ)', unit: 'Pa·sⁿ', value: 10, tex: 'K' },
        gd: { name: 'shear rate', q: 'rate', unit: '1/s', value: 100, tex: '\\dot\\gamma' },
        n: { name: 'flow behaviour index', value: 0.4 }
      },
      note: 'The ratio τ/γ̇ at one shear rate — what a simple viscometer running at that rate would report.',
      stories: { mua: 'A paint follows a power law with K = {Kp} and n = {n}. What is its apparent viscosity at a shear rate of {gd}?' }
    },
    {
      name: 'Bingham plastic',
      expr: 'tau = tauy + mup*gd', tex: '\\tau = \\tau_y + \\mu_p\\,\\dot\\gamma',
      vars: {
        tau: { name: 'shear stress (above the yield stress)', q: 'pressure', unit: 'Pa', tex: '\\tau' },
        tauy: { name: 'yield stress', q: 'pressure', unit: 'Pa', value: 150, tex: '\\tau_y' },
        mup: { name: 'plastic viscosity', q: 'viscosity', unit: 'Pa·s', value: 2, tex: '\\mu_p' },
        gd: { name: 'shear rate', q: 'rate', unit: '1/s', value: 20, tex: '\\dot\\gamma' }
      },
      note: 'Only while τ exceeds τ_y; below it there is no flow (γ̇ = 0).',
      stories: { tau: 'A paste has a yield stress of {tauy} and a plastic viscosity of {mup}. What stress shears it at {gd}?', gd: 'A paste ({tauy} yield stress, {mup} plastic viscosity) is loaded with a shear stress of {tau}. At what rate does it shear?' }
    },
    {
      name: 'Pressure to start a yield-stress fluid moving in a pipe',
      expr: 'dp = 4*tauy*L/D', tex: '\\Delta p = \\dfrac{4\\,\\tau_y L}{D}',
      vars: {
        dp: { name: 'pressure difference to start flow', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        tauy: { name: 'yield stress', q: 'pressure', unit: 'Pa', value: 500, tex: '\\tau_y' },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 50 },
        D: { name: 'pipe bore', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A force balance on the whole plug: the pressure on its end area must beat the yield stress on the pipe wall. Real lines add wall slip, lubricating layers and fittings.',
      stories: { dp: 'Fresh concrete with a yield stress of {tauy} fills {L} of pipe with a bore of {D}. What pressure does the pump need just to start it moving?', L: 'A pump can give {dp} to start a sludge with a yield stress of {tauy} in a {D} line. How long can the line be?' }
    }
  ],
  examples: [
    {
      title: 'Paint on the wall and under the brush',
      q: 'A paint follows $\\tau = K\\dot\\gamma^{\\,n}$ with $K$ = 8 Pa·sⁿ and $n$ = 0.45. Compare its apparent viscosity while it hangs on a wall ($\\dot\\gamma \\approx$ 0.5 1/s) and under a brush ($\\dot\\gamma \\approx$ 5000 1/s).',
      steps: [
        '$\\mu_a = K\\dot\\gamma^{\\,n-1}$, with $n - 1 = -0.55$.',
        'On the wall: $8 \\times 0.5^{-0.55} = 8 \\times 1.464 = 11.7$ Pa·s — like thick honey, so it does not run.',
        'Under the brush: $8 \\times 5000^{-0.55} = 8 \\times 0.00924 = 0.074$ Pa·s — like a light oil, so it spreads.',
        'Ratio: about 160 times.'
      ],
      a: 'About 11.7 Pa·s on the wall and 0.074 Pa·s under the brush.'
    },
    {
      title: 'Starting a concrete line',
      q: 'Fresh concrete with a yield stress of 400 Pa fills a 125 mm line 60 m long. What pressure does the pump need to start it moving? Once it runs at 15 bar, how wide is the plug in the middle?',
      steps: [
        'Start: $\\Delta p = 4\\tau_y L/D = 4 \\times 400 \\times 60/0.125 = 7.7\\times10^5$ Pa = 7.7 bar.',
        'Running at 15 bar the wall stress is $\\tau_w = \\Delta p D/(4L) = 1.5\\times10^6 \\times 0.125/240 = 781$ Pa.',
        'The stress grows linearly from zero on the axis to $\\tau_w$ at the wall, so it is below 400 Pa out to $r = R\\,\\tau_y/\\tau_w = 62.5 \\times 400/781 = 32$ mm.',
        'The plug is about 64 mm across — half the bore moves as a solid core.'
      ],
      a: 'About 7.7 bar to start; a plug about 64 mm wide at 15 bar.'
    }
  ],
  quiz: [
    { q: 'In the power law τ = Kγ̇ⁿ, a flow index n = 0.3 describes a fluid that…', choices: ['thickens when sheared faster', 'thins when sheared faster', 'has a yield stress', 'is Newtonian'], a: 1,
      why: 'μ_a = Kγ̇ⁿ⁻¹ = Kγ̇^−0.7 falls as the shear rate rises: shear-thinning.' },
    { q: 'Toothpaste stays on the brush but flows out of the tube when squeezed. It is best described as…', choices: ['shear-thickening', 'a Bingham plastic with a yield stress', 'a very viscous Newtonian liquid', 'viscoelastic'], a: 1,
      why: 'On the brush the stress from its own weight is below the yield stress; squeezing the tube exceeds it.' },
    { q: 'What pressure difference is needed just to start a drilling mud with τ_y = 10 Pa moving through 1000 m of 100 mm pipe?', answer: 4, unit: 'bar',
      why: 'Δp = 4τ_yL/D = 4 × 10 × 1000/0.1 = 4×10⁵ Pa = 4 bar.' },
    { q: 'In laminar pipe flow a Bingham plastic moves as a solid plug in the centre of the pipe.', a: true,
      why: 'The shear stress is zero on the axis and grows towards the wall; where it is below τ_y the material does not shear.' },
    { q: 'A power-law fluid has n = 0.5. Its shear rate rises from 10 to 1000 1/s. Its apparent viscosity…', choices: ['rises ten times', 'falls to a tenth', 'falls to a hundredth', 'does not change'], a: 1,
      why: 'μ_a ∝ γ̇^(n−1) = γ̇^−0.5: a hundredfold rise in shear rate gives 100^−0.5 = 0.1.' }
  ],
  problems: [
    { q: 'A shear-thickening suspension follows τ = 2γ̇^1.5 (τ in Pa, γ̇ in 1/s). What is its apparent viscosity at 100 1/s?', answer: 20, unit: 'Pa·s', tol: 0.02,
      steps: ['$\\mu_a = K\\dot\\gamma^{\\,n-1} = 2 \\times 100^{0.5} = 20$ Pa·s — ten times its value at 1 1/s.'] }
  ],
  applications: [
    'Concrete, mortar and grout pumping: the yield stress sets the pressure to start, and the plug carries the aggregate.',
    'Drilling muds, made to hold rock cuttings in suspension when the pumps stop (a yield stress) yet flow easily when pumped.',
    'Paints, inks, foods and cosmetics, formulated for the shear rates of filling, spreading and standing.',
    'Polymer-thickened hydraulic and engine oils, and their shear stability ([[hydraulic-oils]]).'
  ],
  history: 'Eugene Bingham described the flow of paints and clays with a yield stress in 1916, and in 1920 coined the word rheology — the science of flow — for the study of such materials; its motto, "everything flows", is borrowed from Heraclitus. Winslow Herschel and Ronald Bulkley added the shear-thinning yield-stress model in 1926.',
  sim: [{ id: 'prop-couette', params: { fluid: 'paint' }, title: 'Shearing a non-Newtonian liquid' }, 'prop-pipe-rheology']
},

/* ================================================================ HYDRAULIC OILS */
{
  id: 'hydraulic-oils', parent: 'hydraulic-fluids', title: 'Hydraulic oils and ISO VG grades', level: 1,
  short: 'Most hydraulic systems run on refined mineral oil with additives. The grade (ISO VG 32, 46, 68 …) is its viscosity at 40 °C in cSt; the type (HL, HM/HLP, HV/HVLP) says what the additives do — resist ageing and rust, prevent wear, flatten the viscosity curve.',
  keywords: ['hydraulic oil', 'ISO VG', 'ISO 3448', 'viscosity grade', 'HL', 'HM', 'HLP', 'HV', 'HVLP', 'HG', 'DIN 51524', 'ISO 6743-4', 'ISO 11158', 'anti-wear', 'zinc dithiophosphate', 'additives', 'base oil', 'oxidation', 'acid number', 'oil analysis', 'oil life', 'blending'],
  prereq: ['viscosity', 'viscosity-temperature', 'fluid-power'],
  related: ['fire-resistant-fluids', 'fluid-selection', 'air-in-oil', 'contamination', 'iso-4406', 'filtration', 'heat-coolers', 'reservoirs', 'pump-efficiencies', 'density-specific-weight'],
  body: `
A hydraulic fluid does four jobs at once. It **transmits power**, so it must be nearly incompressible and flow easily. It **lubricates** the pumps, motors and valves whose parts slide past each other a few micrometres apart. It **seals** those clearances by its viscosity. And it **carries away heat and dirt** to the cooler, the reservoir and the filters. Refined mineral oil does all four well and cheaply, which is why the great majority of hydraulic systems use it.

### What is in the can
A hydraulic oil is 95–99 % **base oil** — petroleum refined by solvent extraction or, more and more, by hydrocracking, which gives purer, more stable, higher-VI stocks — and 1–5 % additives:

| Additive | Its job |
|---|---|
| Antioxidants | slow the oxidation that makes acids, varnish and sludge |
| Rust and corrosion inhibitors | protect steel and copper alloys from water |
| Anti-wear agents (zinc dithiophosphate or ashless types) | form protective films where metal rubs under high load |
| VI improvers (polymers) | flatten the viscosity–temperature curve |
| Pour-point depressants | keep the oil fluid in the cold |
| Antifoam agents, demulsifiers | break foam; let water separate and settle |
| Detergents and dispersants (HLPD oils) | keep dirt and water finely dispersed |

### Types
The international classification, ISO 6743-4:2015, sorts mineral hydraulic oils by their additives; the German DIN 51524 names are used worldwide too:

| ISO 6743-4 | DIN 51524 | Contents | Typical use |
|---|---|---|---|
| HH | — | base oil only | hardly used today |
| HL | HL (part 1) | + antioxidant, anti-rust | low-pressure systems |
| HM | HLP (part 2) | + anti-wear | the standard industrial and mobile oil |
| HV | HVLP (part 3) | HM + VI improver | outdoor machines, wide temperature ranges |
| HG | — | HM + anti-stick-slip | combined hydraulics and machine-tool slideways |

Performance is set by tests — oxidation life, rust, foam, air release, water separation, filterability, wear in a gear rig and in vane and piston pumps — collected in specifications such as ISO 11158 and DIN 51524. They are minimums; a pump maker may ask for more.

### Viscosity grades
ISO 3448:1992 defines 20 **viscosity grades**, ISO VG 2 to VG 3200. The number is the mid-point kinematic viscosity at 40 °C in cSt, and an oil must lie within ±10 % of it; successive grades step up by about 50 %, so the bands never overlap. Hydraulic systems mostly use:

| Grade | ν at 40 °C (cSt) | ν at 0 °C | ν at 100 °C | Typical use |
|---|---|---|---|---|
| VG 15 | 13.5–16.5 | ≈ 100 | 3.4 | arctic machines, aviation-type fluids |
| VG 22 | 19.8–24.2 | ≈ 190 | 4.3 | cold climates, precision machine tools |
| VG 32 | 28.8–35.2 | ≈ 330 | 5.4 | indoor industrial systems |
| VG 46 | 41.4–50.6 | ≈ 570 | 6.8 | the commonest grade, industrial and mobile |
| VG 68 | 61.2–74.8 | ≈ 1000 | 8.8 | hot climates, heavily loaded mobile machines |
| VG 100 | 90–110 | ≈ 1700 | 11.4 | very hot running |

(Values at 0 °C and 100 °C for VI ≈ 100; the [[viscosity-temperature]] page shows how to find them.)

### Keeping oil healthy
Oil ages by **oxidation**, which heat, water, air and metal particles (copper and iron act as catalysts) all speed up. A long-standing rule says its life halves for every 10 K above about 60 °C, so a reservoir kept at 50 °C rather than 70 °C can make the oil last four times as long. The signs of ageing are a darkening colour, a sharp smell, a rising acid number, a viscosity more than 10 % from new, and water or particles in the oil ([[contamination]], [[iso-4406]]). Regular oil analysis — viscosity, water, acid number, particle count, additive elements — tells when to filter, dry or change it, instead of the calendar.

> [!warn] Hydraulic oil at working temperature can burn, and oil escaping under pressure from a pinhole can be injected through the skin — an injury that looks small but is a surgical emergency: seek emergency medical care at once. Before draining or changing oil, stop the machine, lower or support any load, discharge accumulators, release the pressure and lock out the power. Collect spilled oil (it makes floors treacherous) and dispose of it as local rules require.
`,
  ideas: [
    'A hydraulic fluid transmits power, lubricates, seals clearances and carries heat and dirt away.',
    'Mineral hydraulic oil is 95–99 % base oil plus antioxidants, rust inhibitors, anti-wear agents, VI improvers and antifoam.',
    'ISO VG = the viscosity at 40 °C in cSt, within ±10 %; VG 32, 46 and 68 cover most hydraulic systems.',
    'HL, HM (HLP) and HV (HVLP) differ in their additives: HM adds anti-wear, HV adds a VI improver.',
    'Oil life roughly halves for every 10 K of extra temperature: cool oil lasts.'
  ],
  pitfalls: [
    'Any oil of the right viscosity will do — Engine, gear and hydraulic oils carry different additives: engine-oil detergents hold water in suspension, which hurts fine filters and pumps, and some gear-oil additives attack copper alloys. Use the type the machine maker specifies.',
    'The oil is fine as long as the level is right — Oil degrades by oxidation, water, air and dirt long before it runs low; its condition is judged by analysis, not by the dipstick.',
    'Two hydraulic oils of the same grade can always be mixed — Different additive packages (zinc and ashless anti-wear, for example) can react, forming deposits and blocking filters; mix only when both makers confirm compatibility.'
  ],
  formulas: [
    {
      name: 'Oil life and temperature (the 10 K rule)',
      expr: 'tL = tL0*2^((T0 - T)/dT)', tex: 't_L = t_{L,0}\\cdot 2^{(T_0 - T)/\\Delta T}',
      vars: {
        tL: { name: 'expected oil life', q: 'time', unit: 'h', tex: 't_L' },
        tL0: { name: 'life at the reference temperature', q: 'time', unit: 'h', value: 8000, tex: 't_{L,0}' },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 60, tex: 'T_0' },
        T: { name: 'bulk oil temperature', q: 'temperature', unit: '°C', value: 70 },
        dT: { name: 'temperature rise that halves the life', q: 'dtemp', unit: 'K', value: 10, fixed: true, tex: '\\Delta T' }
      },
      note: 'A rule of thumb from the chemistry of oxidation; real life depends on the oil, water, air, metals and cleanliness. Use it to compare temperatures, not to schedule an oil change.',
      practice: { unknowns: ['tL', 'T'] },
      stories: {
        tL: 'An oil lasts about {tL0} at {T0}. Roughly how long will it last if the reservoir runs at {T}?',
        T: 'An oil lasts {tL0} at {T0}. At what bulk temperature would it last only {tL}?'
      }
    },
    {
      name: 'Viscosity of a blend of two oils',
      expr: 'log(log(nu + 0.7)) = x*log(log(nuA + 0.7)) + (1 - x)*log(log(nuB + 0.7))',
      tex: '\\log\\log(\\nu + 0.7) = x\\,\\log\\log(\\nu_A + 0.7) + (1 - x)\\log\\log(\\nu_B + 0.7)',
      vars: {
        nu: { name: 'viscosity of the blend', q: false, unit: 'cSt', tex: '\\nu' },
        x: { name: 'mass fraction of oil A', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        nuA: { name: 'viscosity of oil A (same temperature)', q: false, unit: 'cSt', value: 32, tex: '\\nu_A' },
        nuB: { name: 'viscosity of oil B (same temperature)', q: false, unit: 'cSt', value: 68, tex: '\\nu_B' }
      },
      note: 'The double-logarithmic mixing rule for similar mineral oils, on the same scale as the Walther equation. Volume fractions are close to mass fractions when the densities are alike. Blending is for oils known to be compatible.',
      practice: { unknowns: ['nu', 'x'] },
      stories: {
        nu: 'Oil A has {nuA} and oil B {nuB} at the same temperature. What is the viscosity of a blend with {x} of oil A?',
        x: 'Oils of {nuA} and {nuB} are to be blended to {nu}. What fraction of the first is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a datasheet',
      q: 'An HLP 46 datasheet gives: density 872 kg/m³ at 15 °C, 46 cSt at 40 °C, 6.9 cSt at 100 °C, VI 102, pour point −24 °C, flash point 225 °C. Is it within its grade, and what is its dynamic viscosity at 40 °C? (Expansion coefficient $7\\times10^{-4}$ K⁻¹.)',
      steps: [
        'VG 46 allows 41.4–50.6 cSt at 40 °C: 46 cSt is right in the middle.',
        'Density at 40 °C: $872/(1 + 7\\times10^{-4} \\times 25) = 857$ kg/m³.',
        'Dynamic viscosity: $\\mu = \\rho\\nu = 857 \\times 46\\times10^{-6} = 0.0394$ Pa·s = 39.4 mPa·s.',
        'The pour point says the oil still flows at −24 °C — but by then it is far too thick for a pump; the useful cold limit comes from the viscosity ([[fluid-selection]]).'
      ],
      a: 'Within VG 46; about 39 mPa·s at 40 °C.'
    },
    {
      title: 'Cooler oil lasts longer',
      q: 'An oil is expected to last about 8000 h with its reservoir at 60 °C. Using the 10 K rule, how long at 70 °C and at 50 °C?',
      steps: [
        'At 70 °C: $8000 \\times 2^{(60 - 70)/10} = 8000/2 = 4000$ h.',
        'At 50 °C: $8000 \\times 2^{(60 - 50)/10} = 16\\,000$ h.',
        'Running at 50 °C rather than 70 °C quadruples the life — often reason enough for a larger cooler.'
      ],
      a: 'About 4000 h at 70 °C and 16 000 h at 50 °C.'
    },
    {
      title: 'Blending two grades',
      q: 'Equal masses of a VG 32 and a VG 68 oil (same type, known to be compatible) are mixed. What grade results?',
      steps: [
        '$\\log\\log(32.7) = 0.1803$ and $\\log\\log(68.7) = 0.2641$.',
        'Blend: $0.5 \\times 0.1803 + 0.5 \\times 0.2641 = 0.2222$.',
        '$\\nu + 0.7 = 10^{10^{0.2222}} = 10^{1.668} = 46.6$, so $\\nu = 45.9$ cSt at 40 °C.'
      ],
      a: 'About 46 cSt — a VG 46.'
    }
  ],
  quiz: [
    { q: 'ISO VG 68 means…', choices: ['68 cSt at 40 °C, within ±10 %', '68 cSt at 100 °C', '68 mPa·s at 20 °C', 'a viscosity index of 68'], a: 0,
      why: 'ISO 3448 grades are the mid-point kinematic viscosity at 40 °C in cSt.' },
    { q: 'Which oil type contains a VI improver?', choices: ['HL', 'HM (HLP)', 'HV (HVLP)', 'HH'], a: 2,
      why: 'HV is HM plus a VI improver, for machines working over a wide temperature range.' },
    { q: 'An oil lasts 12 000 h at 55 °C. Using the 10 K rule, about how long will it last at 75 °C?', answer: 3000, unit: 'h',
      why: '20 K hotter is two halvings: 12 000/4 = 3000 h.' },
    { q: 'An oil measuring 44 cSt at 40 °C can be sold as ISO VG 46.', a: true,
      why: 'VG 46 allows 41.4 to 50.6 cSt.' },
    { q: 'Why is an engine oil a poor substitute for a hydraulic oil of the same viscosity?', choices: ['its detergents keep water emulsified, which can clog fine filters and harm pumps', 'it is much denser', 'its viscosity index is too low', 'it is not compatible with steel'], a: 0,
      why: 'Hydraulic oils are made to shed water and air quickly; engine oils are made to hold combustion products and water in suspension.' }
  ],
  problems: [
    { q: 'An HLP 32 oil has 32 cSt at 40 °C and a density of 861 kg/m³ at that temperature. What is its dynamic viscosity?', answer: 27.6, unit: 'mPa·s', tol: 0.02,
      steps: ['$\\mu = \\rho\\nu = 861 \\times 32\\times10^{-6} = 0.0276$ Pa·s = 27.6 mPa·s.'] }
  ],
  applications: [
    'Industrial power units, presses and machine tools, mostly on HM/HLP 32–68.',
    'Mobile machines — excavators, loaders, cranes — often on HV oils for year-round use ([[mobile-hydraulics]]).',
    'Oil-analysis programmes that change oil by condition rather than by the calendar.',
    'Wind turbines, ship steering gear and lifts, each with its own oil specification.'
  ],
  history: 'The first great hydraulic networks ran on water: London\'s Hydraulic Power Company piped water at about 50 bar under the streets from 1883 until 1977, working lifts, cranes, dock gates and even theatre stages. Mineral oil took over machine hydraulics in the 1920s and 1930s, when it allowed tight-clearance pumps and valves to lubricate themselves. ISO first standardised the viscosity grades in 1975.',
  sim: { id: 'prop-visc-temp', params: { grade: 46, vi: 100, tcold: 0, trun: 50, thot: 70 }, title: 'ISO VG grades against temperature' }
},

/* ================================================================ FIRE-RESISTANT AND BIODEGRADABLE */
{
  id: 'fire-resistant-fluids', parent: 'hydraulic-fluids', title: 'Fire-resistant and biodegradable fluids', level: 2,
  short: 'Where a burst hose must not start a fire — steel mills, mines, die casting, aircraft — water-based (HFA, HFB, HFC) or synthetic (HFDR, HFDU) fluids replace mineral oil; where a leak must not harm soil or water, biodegradable HETG, HEES, HEPG or HEPR fluids do. Each has a price in lubrication, temperature range, seals and care.',
  keywords: ['fire-resistant fluid', 'HFA', 'HFAE', 'HFAS', 'HFB', 'HFC', 'water glycol', 'HFD', 'HFDR', 'phosphate ester', 'HFDU', 'polyol ester', 'biodegradable', 'environmentally acceptable', 'HETG', 'HEES', 'HEPG', 'HEPR', 'ISO 12922', 'ISO 15380', 'ISO 7745', 'seal compatibility', 'derating'],
  prereq: ['hydraulic-oils', 'vapour-pressure', 'density-specific-weight'],
  related: ['fluid-selection', 'seals', 'cavitation', 'npsh', 'hydraulic-safety', 'mobile-hydraulics', 'aircraft-hydraulics', 'industrial-presses', 'bulk-modulus'],
  body: `
Mineral oil burns. Its flash point is around 200–230 °C and it can ignite on its own on surfaces not much above 300 °C. When a hose fails at 200 bar the oil comes out as a fine mist that a furnace wall, a ladle of molten metal or a spark can light — and a spray fire in a steel mill, beside a die-casting machine or underground in a mine is a catastrophe. In such places the fluid itself must resist burning.

### Fire-resistant fluids (ISO 6743-4, ISO 12922)
They resist fire either through **water**, which smothers a flame as it turns to steam, or through **chemistry** that is hard to ignite and does not keep burning:

| Type | What it is | Water | Density (g/mL) | Typical bulk temperature | Notes |
|---|---|---|---|---|---|
| HFAE | oil-in-water emulsion | over 80 %, often 95 % | ≈ 1.0 | 5–50 °C | viscosity of water; mine roof supports, large presses |
| HFAS | synthetic solution in water | over 80 % | ≈ 1.0 | 5–50 °C | as HFAE, clear, no oil |
| HFB | water-in-oil emulsion | ≈ 40 % | ≈ 0.94 | 5–50 °C | now rare |
| HFC | water–polyglycol solution | 35–50 % | ≈ 1.07 | −20 to 50 °C | the most used: steel mills, die casting, foundries |
| HFDR | phosphate ester | none | ≈ 1.13 | −20 to 90 °C | good lubricity; attacks many seals and paints |
| HFDU | other synthetics (polyol esters and others) | none | ≈ 0.92 | −20 to 90 °C | often also biodegradable |

The water-based fluids pay for their safety. The water's **vapour pressure** makes them cavitate easily, so pumps need flooded inlets, lower speeds and often lower pressures — makers derate their pumps for HFC and HFA, sometimes by half ([[vapour-pressure]], [[npsh]]). Water is a poor lubricant, so bearing lives fall. The water evaporates, so the bulk temperature is held below about 50 °C and the water content of HFC is checked regularly: as it falls, the viscosity climbs. And they freeze. HFA, with the viscosity of water — about 1 mPa·s against an oil's 30 — leaks some 30 times more through the same clearance ([[viscosity]]), so HFA components seal with seats and poppets rather than with spool clearances.

Phosphate esters (HFDR) resist fire without water and lubricate well, but they are dense (a pump inlet needs more head), they attack the standard nitrile (NBR) seals and many paints — fluorocarbon (FKM), butyl or EPDM seals are chosen to suit — and they react slowly with water into acids that special filters must remove.

No hydraulic fluid is fireproof. "Fire-resistant" means hard to ignite and slow to spread a flame in standard spray, wick and hot-surface tests; ISO 7745:2010 gives the requirements and guidance for their use.

### Biodegradable fluids (ISO 15380)
Where a leak would reach soil or water — forestry, farming, dredging, ships, locks and dam gates, snow groomers — **environmentally acceptable** fluids are used, often because rules or contracts demand them. They must be readily biodegradable (typically at least 60 % broken down by microbes within 28 days in a standard OECD test) and of low toxicity:

| Type | Base | Strengths | Weaknesses |
|---|---|---|---|
| HETG | vegetable oils (rapeseed and others) | cheap, VI ≈ 200 | ages quickly above about 60 °C; poor in the cold |
| HEPG | polyglycols | good ageing | water-soluble; does not mix with mineral oil; attacks some paints |
| HEES | synthetic esters | the best all-rounder, long life | sensitive to water (hydrolysis); costly |
| HEPR | polyalphaolefins and related hydrocarbons | very stable | often less readily biodegradable |

Converting a machine means flushing out mineral oil — commonly to a residue below about 2 % — checking seals, hoses and paint, and keeping water out: esters, like phosphate esters, break down with it.

> [!warn] Fire-resistant does not mean safe to spray: every fluid under pressure is an injection hazard, and some (phosphate esters, degraded fluids) irritate skin or give off harmful fumes when hot. Follow the safety data sheet; release the pressure and lock out the machine before work; seek emergency medical care at once for any injection injury.
`,
  ideas: [
    'Mineral-oil mist ignites easily; near hot metal, flames or underground, fire-resistant fluids are used.',
    'HFA (about 95 % water), HFB (water in oil) and HFC (water–glycol) resist fire through water; HFDR (phosphate ester) and HFDU through their chemistry.',
    'Water-based fluids cavitate easily, lubricate less, must stay below about 50 °C and need their water content checked; pumps are derated for them.',
    'Biodegradable fluids — HETG vegetable, HEES ester, HEPG polyglycol, HEPR hydrocarbon — protect soil and water; the esters must be kept dry.',
    'Changing fluid type means checking seals, paints, metals, filters and the permissible residue of the old fluid.'
  ],
  pitfalls: [
    'Fire-resistant fluids cannot burn — They are hard to ignite and do not sustain a flame in standard tests, but most will burn with enough heat, and a water-based fluid that has lost its water leaves a flammable residue.',
    'A water-based fluid can simply be poured into a mineral-oil machine — Pumps must be derated and fed with a flooded inlet; seals, paints and some metals (zinc and cadmium coatings with HFC) must be checked; many components are not rated for it at all.',
    'Biodegradable means harmless to spill — It means microbes break it down within weeks; a spill still harms and must still be contained, cleaned up and, where rules require, reported.'
  ],
  formulas: [
    {
      name: 'Absolute pressure at a pump inlet',
      expr: 'p = patm + rho*g*h - dpl', tex: 'p_{\\text{in}} = p_{\\text{atm}} + \\rho g h - \\Delta p_l',
      vars: {
        p: { name: 'pressure at the pump inlet (absolute)', q: 'pressure', unit: 'kPa', tex: 'p_{\\text{in}}' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_{\\text{atm}}' },
        rho: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1070, tex: '\\rho' },
        g: { const: 'g' },
        h: { name: 'fluid level above the pump inlet (negative if below it)', q: 'length', unit: 'm', value: 0.5, signed: true },
        dpl: { name: 'loss in the inlet line and strainer', q: 'pressure', unit: 'kPa', value: 10, tex: '\\Delta p_l' }
      },
      note: 'Compare the result with the minimum inlet pressure the pump maker allows for this fluid — for water-based fluids often close to or above atmospheric — and with the fluid\'s vapour pressure.',
      practice: { unknowns: ['p', 'h'] },
      stories: {
        p: 'A pump draws a fluid of density {rho}; the fluid level is {h} above its inlet, the inlet line loses {dpl} and the atmosphere is at {patm}. What is the absolute pressure at the inlet?',
        h: 'A pump needs {p} absolute at its inlet. With a fluid of {rho}, an inlet loss of {dpl} and an atmosphere of {patm}, how high above the inlet must the fluid level be?'
      }
    },
    {
      name: 'Leakage when the viscosity changes',
      expr: 'Q2 = Q1*mu1/mu2', tex: 'Q_2 = Q_1\\,\\dfrac{\\mu_1}{\\mu_2}',
      vars: {
        Q2: { name: 'leakage with the new fluid', q: 'flowrate', unit: 'L/min', tex: 'Q_2' },
        Q1: { name: 'leakage with the original fluid', q: 'flowrate', unit: 'L/min', value: 0.5, tex: 'Q_1' },
        mu1: { name: 'viscosity of the original fluid', q: 'viscosity', unit: 'mPa·s', value: 30, tex: '\\mu_1' },
        mu2: { name: 'viscosity of the new fluid', q: 'viscosity', unit: 'mPa·s', value: 1, tex: '\\mu_2' }
      },
      note: 'Laminar leakage through the same clearance at the same pressure (Q ∝ h³Δp/μ). With very thin fluids the gap flow can become partly turbulent and leak somewhat less than this.',
      stories: { Q2: 'A valve leaks {Q1} with oil of {mu1}. About how much would it leak through the same clearance with a fluid of {mu2}?' }
    }
  ],
  examples: [
    {
      title: 'Feeding a pump with HFC',
      q: 'A pump draws water–glycol (ρ = 1070 kg/m³). It sits 0.6 m above the fluid level; the inlet line and strainer lose 12 kPa; the atmosphere is at 101 kPa. What is the absolute inlet pressure — and what if the pump is moved to 0.5 m below the level?',
      steps: [
        'Pump above the level, $h = -0.6$ m: $p = 101 - 1070 \\times 9.81 \\times 0.6/1000 - 12 = 101 - 6.3 - 12 = 82.7$ kPa.',
        'Pump below the level, $h = +0.5$ m: $p = 101 + 5.2 - 12 = 94.2$ kPa.',
        'Many makers ask for a flooded inlet and close to atmospheric pressure with water-based fluids; the second layout is far safer against cavitation, and a larger, shorter inlet line would help further.'
      ],
      a: '82.7 kPa absolute above the tank; 94.2 kPa with a flooded inlet.'
    },
    {
      title: 'From oil to HFA',
      q: 'A valve leaks 0.4 L/min at working pressure with oil of 32 mPa·s. Roughly how much would it leak with an HFA emulsion of about 1 mPa·s?',
      steps: [
        'Laminar leakage scales as $1/\\mu$: $Q_2 = 0.4 \\times 32/1 = 12.8$ L/min.',
        'That is why HFA systems use seated valves, and why a machine converted without new components can lose much of its pump flow to leakage.'
      ],
      a: 'In the order of 13 L/min — some thirty times more.'
    }
  ],
  quiz: [
    { q: 'Which type is a solution of polyglycol in about 40 % water?', choices: ['HFAE', 'HFC', 'HFDR', 'HEES'], a: 1,
      why: 'HFC fluids are water–glycol solutions with 35–50 % water and a polymer thickener.' },
    { q: 'Why do pumps running on water-based fluids need flooded inlets and often lower speeds?', choices: ['the water\'s vapour pressure makes the fluid cavitate at inlet pressures oil would tolerate', 'water-based fluids are more viscous', 'they are more compressible', 'to keep them cool'], a: 0,
      why: 'At 50 °C water\'s vapour pressure is about 12 kPa, and a water-based fluid boils in a starved inlet long before an oil would release its air.' },
    { q: 'Phosphate-ester fluids work with the standard nitrile (NBR) seals of mineral-oil systems.', a: false,
      why: 'Phosphate esters swell and destroy nitrile; fluorocarbon, butyl or EPDM seals are used, matched to the fluid.' },
    { q: 'A biodegradable fluid for a forestry machine that must last long and work from −20 to +80 °C would most likely be…', choices: ['HETG (rapeseed oil)', 'HEES (synthetic ester)', 'HFAE', 'HM mineral oil'], a: 1,
      why: 'Synthetic esters age well, flow in the cold and are readily biodegradable; vegetable oils age quickly when hot and thicken in the cold.' },
    { q: 'A valve leaks 0.2 L/min with oil of 40 mPa·s. Roughly how much would it leak through the same clearance with an HFA of 1 mPa·s?', answer: 8, unit: 'L/min',
      why: 'Laminar leakage ∝ 1/μ: 0.2 × 40 = 8 L/min.' }
  ],
  problems: [
    { q: 'A pump sits 0.4 m below the level of a phosphate-ester tank (ρ = 1130 kg/m³). The inlet loses 8 kPa and the atmosphere is at 100 kPa. What is the absolute inlet pressure?', answer: 96.4, unit: 'kPa', tol: 0.01,
      steps: ['$p = 100 + 1130 \\times 9.81 \\times 0.4/1000 - 8 = 100 + 4.4 - 8 = 96.4$ kPa.'] }
  ],
  applications: [
    'Steel mills, foundries and die-casting machines, mostly on HFC and HFDU.',
    'Underground mining, where longwall roof supports run on HFA emulsions.',
    'Power-station turbine controls and aircraft, on phosphate esters ([[aircraft-hydraulics]]).',
    'Forestry, farm, marine and dam-gate hydraulics on biodegradable esters ([[mobile-hydraulics]]).'
  ],
  history: 'Water was the first hydraulic fluid, and it came back for safety. Phosphate-ester fluids were introduced for airliners in the late 1940s to cut the risk of hydraulic fires, and in the decades after the Second World War fire-resistant emulsions became standard in underground mining. Biodegradable fluids spread from the 1980s, first in Europe\'s forests and waterways.'
},

/* ================================================================ FLUID SELECTION */
{
  id: 'fluid-selection', parent: 'hydraulic-fluids', title: 'Choosing a hydraulic fluid', level: 2,
  short: 'Choose the fluid type from the risks (fire, environment, food) and the component makers\' approvals; then the viscosity grade and VI so that the oil stays in the components\' window — typically 16–36 cSt in normal running, not below about 10 cSt at the hottest and not above about 1000 cSt at a cold start.',
  keywords: ['fluid selection', 'choosing hydraulic oil', 'viscosity window', 'optimum viscosity', 'cold start', 'start-up viscosity', 'minimum viscosity', 'operating temperature', 'VG selection', 'HV oil', 'seal compatibility', 'food grade', 'H1', 'suction line loss', 'case drain temperature'],
  prereq: ['hydraulic-oils', 'viscosity-temperature', 'fire-resistant-fluids'],
  related: ['positive-displacement', 'pump-efficiencies', 'heat-coolers', 'filtration', 'seals', 'air-in-oil', 'laminar-pipe-flow', 'line-sizing', 'reservoirs', 'cavitation'],
  body: `
Choosing a hydraulic fluid takes two steps: first the **type**, from the risks and the rules; then the **viscosity**, from the temperatures the machine will really see and the limits of its most demanding component.

### Step 1: the type
- **Fire risk** near hot metal, open flames or underground: a fire-resistant fluid — HFC, HFDU, HFA or HFDR ([[fire-resistant-fluids]]).
- **Environmental risk** where leaks can reach soil or water: a biodegradable HEES, HETG, HEPG or HEPR fluid, as rules or contracts require.
- **Food, drink and medicines**: lubricants registered for incidental food contact (the "H1" category).
- Otherwise a **mineral oil**: HM (HLP) for most systems, HV (HVLP) where the temperature range is wide ([[hydraulic-oils]]).
- Always what the **component makers** approve: pumps, motors and valves are rated for particular fluids, with pressure and speed limits that change with the fluid.

### Step 2: the viscosity window
Every pump and motor has viscosity limits. Typical figures (the maker's data always rule):

| Condition | Typical kinematic viscosity | Why |
|---|---|---|
| Optimum, continuous running | 16–36 cSt | best efficiency and life |
| Minimum, short periods at the hottest | ≈ 10 cSt (some piston pumps 7) | thinner, the films break down: wear and leakage |
| Maximum, cold start at low speed and pressure | ≈ 1000 cSt (less for vane pumps, more for some gear pumps) | thicker, the pump cannot fill: cavitation |

The oil's viscosity–temperature line ([[viscosity-temperature]]) turns these limits into temperatures. For oils of VI 100:

| Grade | 1000 cSt (cold-start limit) at | Optimum 36 → 16 cSt between | 10 cSt at |
|---|---|---|---|
| VG 22 | −19 °C | 28–49 °C | 64 °C |
| VG 32 | −12 °C | 37–59 °C | 74 °C |
| VG 46 | −6 °C | 46–68 °C | 84 °C |
| VG 68 | 0 °C | 54–78 °C | 95 °C |

So: choose the grade whose optimum band contains the **normal running temperature** of the bulk oil, then check both ends — the coldest start, and the hottest place in the circuit (the leakage oil in a pump or motor case runs several kelvin hotter than the tank). If one grade cannot cover both, use an **HV oil** — a VI of 150 widens the window by about 6 K at each end, a VI of 200 by 12–14 K — or change the temperatures: a tank heater or a warm-up routine at low speed and pressure for cold starts, a larger cooler for hot running ([[heat-coolers]]).

### Cold oil and the suction line
The cold limit is really about the pump's *inlet*. The suction line runs laminar when the oil is cold, and its pressure loss is proportional to the viscosity ([[laminar-pipe-flow]]):

$$\\Delta p = \\frac{128\\,\\mu\\,L\\,Q}{\\pi D^4}$$

A short suction line that loses less than 0.01 bar at running temperature can lose 0.3 bar at 1000 cSt — and with the inlet of a typical piston pump allowed to fall only to about 0.8 bar absolute, the pump begins to starve, release air and cavitate ([[cavitation]], [[air-in-oil]]).

### Other checks
Seals, hoses, paints and metals must suit the fluid; the filters must pass it at a cold start without their bypass valves opening (which sends unfiltered oil round the circuit); the fluid must release air and separate water well; an HV oil must be shear-stable; and it should be obtainable wherever the machine will be serviced.
`,
  ideas: [
    'First choose the fluid type from the risks (fire, environment, food) and the component makers\' approvals.',
    'Then the viscosity: typically 16–36 cSt in normal running, not below about 10 cSt at the hottest, not above about 1000 cSt at a cold start.',
    'The viscosity–temperature line turns that window into temperatures; pick the grade whose optimum contains the normal bulk temperature.',
    'If one grade cannot span the cold start and the hottest running, use a high-VI oil, a heater or a larger cooler.',
    'Cold, thick oil starves the pump through the laminar suction-line loss, which grows in proportion to the viscosity.'
  ],
  pitfalls: [
    'Thicker oil is always safer — It seals and lubricates better when hot, but at a cold start it may not reach the pump at all; cavitation and dry running at start-up destroy many pumps.',
    'The grade that suits the tank temperature suits the whole system — Case drains, motors and valves run hotter than the tank; check the viscosity at the hottest place, not only in the reservoir.',
    'A higher VI only helps in the cold — It also keeps the oil thicker when hot: a VI 150 oil gains several kelvin of margin at both ends of the window.'
  ],
  formulas: [
    {
      name: 'Temperature at which an oil reaches a given viscosity (Walther, ASTM D341)',
      expr: 'log(log(nu + 0.7)) = log(log(nu40 + 0.7)) + (log(log(nu100 + 0.7)) - log(log(nu40 + 0.7)))*(log(T) - log(T40))/(log(T100) - log(T40))',
      tex: '\\log\\log(\\nu + 0.7) = \\log\\log(\\nu_{40} + 0.7) + \\left[\\log\\log(\\nu_{100} + 0.7) - \\log\\log(\\nu_{40} + 0.7)\\right]\\dfrac{\\log T - \\log T_{40}}{\\log T_{100} - \\log T_{40}}',
      vars: {
        nu: { name: 'viscosity limit', q: false, unit: 'cSt', value: 1000, tex: '\\nu' },
        nu40: { name: 'viscosity at 40 °C (datasheet)', q: false, unit: 'cSt', value: 46, tex: '\\nu_{40}' },
        nu100: { name: 'viscosity at 100 °C (datasheet)', q: false, unit: 'cSt', value: 6.83, tex: '\\nu_{100}' },
        T: { name: 'temperature at which the oil has that viscosity', q: 'temperature', unit: '°C', signed: true },
        T40: { name: 'first datasheet temperature', q: 'temperature', unit: '°C', value: 40, fixed: true, tex: 'T_{40}' },
        T100: { name: 'second datasheet temperature', q: 'temperature', unit: '°C', value: 100, fixed: true, tex: 'T_{100}' }
      },
      solveFor: 'T',
      note: 'Put in the pump\'s limits — 1000 cSt for the coldest start, 36 and 16 cSt for the optimum band, 10 cSt for the hottest — to get the temperature window of an oil.',
      practice: { unknowns: ['T', 'nu'] },
      stories: {
        T: 'An oil has {nu40} at 40 °C and {nu100} at 100 °C. At what temperature does it reach {nu}?',
        nu: 'An oil has {nu40} at 40 °C and {nu100} at 100 °C. What is its viscosity at {T}?'
      }
    },
    {
      name: 'Pressure loss in a laminar suction line',
      expr: 'dp = 128*mu*L*Q/(pi*D^4)', tex: '\\Delta p = \\dfrac{128\\,\\mu\\,L\\,Q}{\\pi D^4}',
      vars: {
        dp: { name: 'pressure loss', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity of the oil', q: 'viscosity', unit: 'mPa·s', value: 890, tex: '\\mu' },
        L: { name: 'line length', q: 'length', unit: 'm', value: 1 },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 100 },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 38 }
      },
      note: 'Hagen–Poiseuille, for laminar flow (Re below about 2300), which cold oil in a suction line nearly always is. Add the strainer and fittings, and the lift from the oil level to the pump.',
      practice: { unknowns: ['dp', 'D'] },
      stories: {
        dp: 'Cold oil of {mu} flows at {Q} through a suction line {L} long with a bore of {D}. What pressure does the line lose?',
        D: 'A suction line {L} long must carry {Q} of oil at {mu} while losing no more than {dp}. What bore does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'An excavator for a cold climate',
      q: 'An excavator starts on winter mornings at −10 °C and its bulk oil reaches 80 °C on summer afternoons. Its pumps allow 1000 cSt at a cold start and 10 cSt at the hottest. Would a VG 46 (VI 100), a VG 32 (VI 100) or an HV 46 (46 cSt at 40 °C, 8.2 at 100 °C, VI ≈ 150) do?',
      steps: [
        'VG 46, VI 100: about 1450 cSt at −10 °C — too thick to start without warming; 11 cSt at 80 °C — just acceptable.',
        'VG 32, VI 100: about 790 cSt at −10 °C — fine; but 8.6 cSt at 80 °C — too thin.',
        'HV 46: about 840 cSt at −10 °C and 12.9 cSt at 80 °C — inside both limits; its optimum band (36 → 16 cSt) lies between about 46 and 72 °C, where the machine mostly runs.'
      ],
      a: 'The HV 46 — or the VG 46 with a warm-up routine below about −6 °C.'
    },
    {
      title: 'Why cold oil starves the pump',
      q: 'A pump draws 100 L/min through 1 m of 38 mm suction line. Compare the line loss with oil at 1000 cSt (μ ≈ 890 mPa·s) and at 30 cSt (μ ≈ 26 mPa·s).',
      steps: [
        '$Q = 1.667\\times10^{-3}$ m³/s; $\\pi D^4 = \\pi \\times 0.038^4 = 6.55\\times10^{-6}$ m⁴.',
        'Cold: $\\Delta p = 128 \\times 0.89 \\times 1 \\times 1.667\\times10^{-3}/6.55\\times10^{-6} = 29\\,000$ Pa = 0.29 bar.',
        'Warm: in proportion to μ, $0.29 \\times 26/890 = 0.0085$ bar.',
        'Check the flow is laminar: $v = Q/A = 1.47$ m/s, $Re = vD/\\nu = 1.47 \\times 0.038/10^{-3} = 56$ cold (and about 1900 warm).',
        'From a tank at atmospheric pressure the cold inlet sits near 0.7 bar absolute before the strainer is counted — below what a typical piston pump allows.'
      ],
      a: '0.29 bar cold against under 0.01 bar warm.'
    }
  ],
  quiz: [
    { q: 'A machine\'s bulk oil runs at 60 °C. Which VI-100 grade puts it in the optimum 16–36 cSt band?', choices: ['VG 22', 'VG 32', 'VG 46', 'VG 100'], a: 2,
      why: 'At 60 °C: VG 22 ≈ 11 cSt, VG 32 ≈ 15 cSt (slightly thin), VG 46 ≈ 21 cSt (inside), VG 100 ≈ 40 cSt (thick).' },
    { q: 'At a cold start the suction-line loss can be thirty times its running value because…', choices: ['the flow is laminar and the loss is proportional to viscosity, which is about thirty times higher', 'cold oil is much denser', 'the flow turns turbulent', 'the pump runs faster when cold'], a: 0,
      why: 'Hagen–Poiseuille: Δp = 128μLQ/(πD⁴), directly proportional to μ.' },
    { q: 'The leakage oil in a piston pump\'s case is usually cooler than the oil in the tank.', a: false,
      why: 'Leakage flows from high to low pressure and the lost energy heats it; case-drain oil typically runs several kelvin hotter than the tank.' },
    { q: 'Compared with a VI-100 oil of the same grade, an HV oil with VI 150 is…', choices: ['thinner at 40 °C', 'thinner in the cold and thicker when hot', 'thicker in the cold and thinner when hot', 'the same at every temperature'], a: 1,
      why: 'Both have the same viscosity at 40 °C; the flatter line of the HV oil lies below at low temperatures and above at high ones.' },
    { q: 'Oil at 500 mPa·s flows at 60 L/min through 2 m of 32 mm suction line. What is the laminar pressure loss?', answer: 0.389, unit: 'bar',
      why: 'Δp = 128 × 0.5 × 2 × 10⁻³/(π × 0.032⁴) = 0.128/3.29×10⁻⁶ = 38 900 Pa.' }
  ],
  problems: [
    { q: 'An HV oil has 46 cSt at 40 °C and 8.2 cSt at 100 °C. At what temperature does it thin to 10 cSt?', answer: 90.7, unit: '°C', tol: 0.02,
      steps: ['Set ν = 10 cSt in the Walther formula and solve for T.', '$T \\approx 363.9$ K $= 90.7$ °C — about 7 K more margin than a VI-100 VG 46 (84 °C).'] }
  ],
  applications: [
    'Specifying the fluid for a new machine and the climate it will work in.',
    'Choosing summer and winter grades, or one all-season HV oil, for mobile fleets ([[mobile-hydraulics]]).',
    'Deciding between a bigger cooler, a tank heater and a higher-VI fluid ([[heat-coolers]]).',
    'Approving a change to a biodegradable or fire-resistant fluid for an existing machine.'
  ],
  sim: { id: 'prop-visc-temp', params: { grade: 46, vi: 100, tcold: -10, trun: 55, thot: 80 }, title: 'Fitting an oil to its temperature window' }
},

/* ================================================================ AIR IN OIL */
{
  id: 'air-in-oil', parent: 'hydraulic-fluids', title: 'Air in oil: aeration and foaming', level: 2,
  short: 'Mineral oil dissolves about 9 % of its volume of air at atmospheric pressure, and more in proportion to the pressure (Henry\'s law). Where the pressure falls the air comes out as bubbles; entrained bubbles make the oil spongy, noisy and hot, and wear out pumps.',
  keywords: ['air in oil', 'aeration', 'entrained air', 'dissolved air', 'Henry\'s law', 'Bunsen coefficient', 'foam', 'foaming', 'air release', 'gaseous cavitation', 'micro-dieseling', 'dieseling', 'spongy', 'pump noise', 'bleeding', 'deaeration', 'ISO 9120', 'ISO 6247'],
  prereq: ['bulk-modulus', 'gauge-absolute', 'hydraulic-oils', 'chemistry:henrys-law'],
  related: ['cavitation', 'reservoirs', 'troubleshooting', 'hydraulic-stiffness', 'vapour-pressure', 'surface-tension', 'pump-efficiencies', 'fluid-selection'],
  body: `
Air gets into every hydraulic system. What decides whether it is harmless or ruinous is the form it takes.

### Three forms
- **Dissolved air** sits between the oil molecules, invisible, and changes the oil's properties very little. Mineral oil at atmospheric pressure holds about 9 % of its own volume of air this way (counted as free air at 1 bar); water holds only about 2 %.
- **Entrained air** is bubbles, from a few micrometres to a millimetre across, carried along with the oil. The oil looks milky or cloudy. This is the harmful form.
- **Foam** is bubbles gathered at the surface of the reservoir, held by thin films of oil.

How much air can dissolve follows **Henry's law** ([[chemistry:henrys-law]]): it is proportional to the absolute pressure,

$$V_a = \\alpha\\,V_o\\,\\frac{p}{p_0}$$

with the **Bunsen coefficient** $\\alpha \\approx$ 0.08–0.09 for mineral oils. At 100 bar oil could hold about nine times its own volume of free air — given time. Dissolving is slow, taking minutes to hours; coming out of solution when the pressure drops is fast.

### Where the bubbles come from
Dissolved air comes out wherever the pressure falls below the pressure at which the oil was saturated: in a **pump inlet** (often 0.7–0.9 bar absolute), downstream of throttles and relief valves, and in a cylinder chamber that a running-away load enlarges faster than oil can fill it. This **air release**, or gaseous cavitation, starts far above the oil's vapour pressure ([[vapour-pressure]]). Air also comes in from outside: through a leaking suction fitting or pump shaft seal (the pressure there is below atmospheric, so a leak draws air in instead of letting oil out), from return lines that end above the oil level and splash, from a vortex when the level is too low, and from air trapped in cylinders and at high points after maintenance.

### What entrained air does
- It makes the oil **spongy**. Bubbles are thousands of times more compressible than oil: just 1 % of free air, measured at atmospheric pressure, cuts the effective bulk modulus to less than half at 10 bar ([[bulk-modulus]]). Actuators judder and creep; position loops lose stiffness and stability ([[hydraulic-stiffness]]).
- In the pump, bubbles fill the chambers instead of oil (lost flow), then **collapse** as each chamber meets outlet pressure: a gravelly rattle quite unlike a healthy whine, vibration and erosion ([[cavitation]]).
- A bubble squeezed quickly heats like the air in a diesel engine — from 0.8 to 250 bar it could approach 1400 °C — so the oil around it chars and darkens and seals burn: **micro-dieseling**.
- Air speeds oxidation, adds heat, reduces cooling, and foam can overflow the reservoir through its breather.

### Keeping it out
Tight suction lines and shaft seals; return lines ending well below the lowest oil level and pointing away from the pump inlet; a reservoir large enough for the oil to rest (commonly three to five minutes of pump flow in industrial units), with baffles and sometimes an inclined fine screen on which bubbles gather and rise ([[reservoirs]]); bleed points at high spots, and cylinders stroked slowly at low pressure after work on them; and an oil with good **air release** (ISO 9120:1997) and **foam** behaviour (ISO 6247:1998). Too much antifoam additive actually slows air release, so additives are never topped up casually.

> [!warn] Bleeding air means opening a system that may be under pressure. Follow the machine's procedure: loads lowered or supported, pressure released, and only the designated bleed points opened, at low pressure. Keep hands and face away from the bleed point — oil under pressure can be injected through the skin, an injury that needs emergency surgery. Seek emergency medical care at once.
`,
  ideas: [
    'Air in oil is dissolved (nearly harmless), entrained as bubbles (harmful) or gathered at the surface as foam.',
    'Henry\'s law: the air a liquid can dissolve is proportional to the absolute pressure — about 9 % of its volume at 1 bar for mineral oil.',
    'Where the pressure falls — pump inlets, after throttles — dissolved air comes out as bubbles long before the oil could boil.',
    'Entrained air collapses the effective bulk modulus at low pressure, makes pumps rattle and burns the oil by micro-dieseling.',
    'Keep air out with tight suction lines, submerged returns, a resting reservoir, bleeding, and oils with good air release.'
  ],
  pitfalls: [
    'The 9 % of dissolved air makes all oil spongy — Dissolved air barely changes the bulk modulus; only free bubbles do. The danger comes when dissolved air leaves solution.',
    'A loose fitting in the suction line would drip, so it would be noticed — The pressure there is below atmospheric, so a leak draws air in instead; it shows as milky oil, foam and a noisy pump, not as a drip.',
    'Foam on the tank is only cosmetic — It shows that air is entrained throughout the system, and foam drawn into the pump inlet starves it; find the source.'
  ],
  formulas: [
    {
      name: 'Air that can dissolve in oil (Henry\'s law)',
      expr: 'Va = alpha*Vo*p/p0', tex: 'V_a = \\alpha\\,V_o\\,\\dfrac{p}{p_0}',
      vars: {
        Va: { name: 'air that can dissolve (counted as free air at p₀)', q: 'volume', unit: 'L', tex: 'V_a' },
        alpha: { name: 'Bunsen coefficient of the oil', value: 0.09, tex: '\\alpha' },
        Vo: { name: 'oil volume', q: 'volume', unit: 'L', value: 100, tex: 'V_o' },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        p0: { name: 'reference pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_0' }
      },
      note: 'At equilibrium, which takes time. α ≈ 0.08–0.09 for mineral oils, about 0.02 for water; it varies a little with temperature.',
      practice: { unknowns: ['Va', 'p'] },
      stories: {
        Va: 'How much air, counted at atmospheric pressure, can {Vo} of oil (Bunsen coefficient {alpha}) hold in solution at {p}?',
        p: 'At what absolute pressure can {Vo} of oil (Bunsen coefficient {alpha}) hold {Va} of air in solution?'
      }
    },
    {
      name: 'Bubble volume at another pressure (Boyle)',
      expr: 'V2 = V1*p1/p2', tex: 'V_2 = V_1\\,\\dfrac{p_1}{p_2}',
      vars: {
        V2: { name: 'bubble volume at p₂', q: 'volume', unit: 'mm³', tex: 'V_2' },
        V1: { name: 'bubble volume at p₁', q: 'volume', unit: 'mm³', value: 1, tex: 'V_1' },
        p1: { name: 'first pressure (absolute)', q: 'pressure', unit: 'bar', value: 0.8, tex: 'p_1' },
        p2: { name: 'second pressure (absolute)', q: 'pressure', unit: 'bar', value: 201, tex: 'p_2' }
      },
      note: 'Slow (isothermal) compression, and no air dissolving meanwhile. Compressed quickly, the air heats and at first shrinks less: V₂ = V₁(p₁/p₂)^(1/1.4).',
      stories: { V2: 'A bubble of {V1} at the pump inlet ({p1}) is carried to the outlet at {p2}. What is its volume there?' }
    },
    {
      name: 'Effective bulk modulus of oil with entrained air',
      expr: 'Ke = 1/(1/Koil + x0*p0/p^2)', tex: 'K_e = \\dfrac{1}{\\dfrac{1}{K_{\\text{oil}}} + \\dfrac{x_0\\,p_0}{p^2}}',
      vars: {
        Ke: { name: 'effective bulk modulus', q: 'pressure', unit: 'GPa', tex: 'K_e' },
        Koil: { name: 'bulk modulus of air-free oil', q: 'pressure', unit: 'GPa', value: 1.6, tex: 'K_{\\text{oil}}' },
        x0: { name: 'free air, fraction of the oil volume at p₀', q: 'ratio', unit: '%', value: 1, tex: 'x_0' },
        p0: { name: 'pressure at which x₀ is counted (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_0' },
        p: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 11 }
      },
      note: 'Slow (isothermal) compression, bubbles not dissolving: at pressure p the free air fills x₀p₀/p of the volume and its compressibility is 1/p. Add 1/K_c for pipes and hoses as on the bulk-modulus page.',
      practice: { unknowns: ['Ke', 'p'] },
      stories: {
        Ke: 'Oil with K = {Koil} carries {x0} of free air (counted at {p0}). What is its effective bulk modulus at {p}?',
        p: 'Oil with K = {Koil} carries {x0} of free air (counted at {p0}). Above what absolute pressure is its effective bulk modulus at least {Ke}?'
      }
    }
  ],
  examples: [
    {
      title: 'Air released at the pump inlet',
      q: 'Reservoir oil (α = 0.09) is saturated with air at 1.0 bar absolute. The pump inlet runs at 0.75 bar absolute. If equilibrium were reached, how much air would leave solution per 100 L of oil, and what volume would it fill at the inlet?',
      steps: [
        'Saturation at 1.0 bar: $0.09 \\times 100 \\times 1.0 = 9.0$ L (counted at 1 bar). At 0.75 bar: $6.75$ L.',
        'Excess: $9.0 - 6.75 = 2.25$ L, counted at 1 bar.',
        'At 0.75 bar that air fills $2.25 \\times 1.0/0.75 = 3.0$ L — 3 % of the oil passing the inlet.',
        'In practice only part of it comes out in the fraction of a second the oil spends in the inlet — but even 1 % of bubbles can be heard.'
      ],
      a: 'Up to 2.25 L (at 1 bar), filling about 3 L at the inlet pressure.'
    },
    {
      title: 'Spongy at low pressure',
      q: 'Oil ($K$ = 1.6 GPa) carries 1 % free air counted at 1.013 bar. What is its effective bulk modulus at 10 bar gauge (11 bar absolute) and at 100 bar gauge?',
      steps: [
        'At 11 bar: $x_0 p_0/p^2 = 0.01 \\times 1.013\\times10^5/(1.1\\times10^6)^2 = 8.4\\times10^{-10}$ Pa⁻¹; $1/K_{oil} = 6.25\\times10^{-10}$ Pa⁻¹.',
        '$K_e = 1/(14.6\\times10^{-10}) = 0.68$ GPa — less than half of the oil\'s own value.',
        'At 101 bar: $x_0 p_0/p^2 = 9.9\\times10^{-12}$ Pa⁻¹, so $K_e = 1.57$ GPa — almost unaffected.',
        'The same oil is more than twice as soft at the start of a stroke as at full pressure.'
      ],
      a: 'About 0.68 GPa at 10 bar and 1.57 GPa at 100 bar.'
    }
  ],
  quiz: [
    { q: 'Oil saturated with air at 1 bar absolute is drawn into a pump inlet at 0.7 bar absolute. The dissolved air…', choices: ['stays dissolved, because the oil is far above its vapour pressure', 'tends to come out of solution as bubbles', 'dissolves further', 'turns into foam in the reservoir'], a: 1,
      why: 'At 0.7 bar the oil can hold only 70 % as much air; the excess comes out — air release, long before any boiling.' },
    { q: 'With a Bunsen coefficient of 0.09, how much air (counted at 1.013 bar) can 50 L of oil hold in solution at 5 bar absolute?', answer: 22.2, unit: 'L',
      why: 'V_a = 0.09 × 50 × 5/1.013 = 22.2 L.' },
    { q: 'A loose fitting on a pump\'s suction line usually shows itself as an oil drip.', a: false,
      why: 'The suction line is below atmospheric pressure, so it draws air in: milky oil, foam and noise, not a drip.' },
    { q: 'Which of these makes air entrainment worse?', choices: ['a return line ending above the oil level', 'a larger reservoir with baffles', 'bleeding cylinders after maintenance', 'raising the pump inlet pressure'], a: 0,
      why: 'Oil falling onto the surface drags air into it; returns should end well below the lowest level.' },
    { q: 'Why does 1 % of free air soften the oil far more at 10 bar than at 200 bar?', choices: ['at high pressure the bubbles are squeezed small and are themselves stiffer (compressibility 1/p)', 'at 200 bar the air turns liquid', 'at 10 bar the oil itself is more compressible', 'at 200 bar the air dissolves instantly'], a: 0,
      why: 'The air term in the compressibility is x₀p₀/p²: twenty times the pressure makes it four hundred times smaller.' }
  ],
  problems: [
    { q: 'A 2 mm³ bubble at 0.8 bar absolute is carried to 250 bar gauge (251 bar absolute). What is its volume there (isothermal)?', answer: 0.00637, unit: 'mm³', tol: 0.02,
      steps: ['$V_2 = V_1 p_1/p_2 = 2 \\times 0.8/251 = 0.0064$ mm³ — three hundred times smaller, and very hot if squeezed fast.'] }
  ],
  applications: [
    'Diagnosing noisy pumps and spongy or jerky actuators ([[troubleshooting]]).',
    'Reservoir design: return-line placement, baffles, dwell time and deaeration screens ([[reservoirs]]).',
    'Bleeding procedures after maintenance, and the commissioning of servo systems.',
    'Choosing oils with good air release for fast pumps and stiff servo drives ([[fluid-selection]]).'
  ],
  history: 'William Henry published his law of gas solubility in 1803, after measuring how much carbon dioxide and other gases water absorbs under pressure. Robert Bunsen, in his studies of gas analysis in the 1850s, defined the absorption coefficient that still bears his name.',
  sim: ['prop-air-release', { id: 'prop-compress', params: { air: 2 }, title: 'Squeezing aerated oil' }]
}

);
