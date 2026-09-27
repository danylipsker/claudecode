/* HYPER-PHARMACEUTICS · content/dispersions.js
 * Particles, surfaces and flow (interfaces-flow), liquid dosage forms (liquids-topic) and
 * skin and other routes (topical-topic). Simulations in sims/dispersions.js (prefix disp-).
 * All drugs and numbers in examples are hypothetical teaching values. */
Hyper.add(

/* ================================================================ PARTICLES, SURFACES AND FLOW */
{
  id: 'particle-size', parent: 'interfaces-flow', title: 'Particle size and surface area', level: 1,
  short: 'How big the particles of a drug are decides how much surface they expose, how fast they dissolve, how evenly a small dose spreads through a tablet, how a powder flows and where an inhaled particle lands. For spheres the surface per gram is 6/(ρd): halve the size, double the area.',
  keywords: ['particle size', 'specific surface area', 'micronisation', 'milling', 'D50', 'D90', 'span', 'laser diffraction', 'dynamic light scattering', 'equivalent diameter', 'content uniformity', 'nanocrystals', 'particle size distribution'],
  prereq: ['solid-state', 'physics:density', 'math:surface-area'],
  related: ['dissolution-rate', 'suspensions', 'inhalation', 'powder-flow', 'nanomedicine', 'colloids', 'tablet-testing'],
  body: `
Grind a sugar cube to powder and it vanishes into tea in seconds instead of a minute: the mass is the same, but far more of it touches the liquid. Particle size is one of the few properties a formulator can change without touching the molecule, and it decides how fast a drug dissolves, how evenly a tiny dose spreads through a tablet, how a powder flows, how fast a suspension settles, whether an injection passes a needle and where an inhaled particle lands in the lungs.

### Smaller particles, more surface
For spheres of diameter $d$ and density $\\rho$ the surface area per gram — the **specific surface area** — is

$$S_w = \\frac{\\pi d^2}{\\rho\\,\\pi d^3/6} = \\frac{6}{\\rho\\,d}$$

Halving the diameter doubles the area. One gram of a drug of density 1.3 g/cm³ has 0.046 m² of surface as 100 µm particles; micronised to 2 µm it has 2.3 m², and by the Noyes–Whitney equation ([[dissolution-rate]]) it dissolves about fifty times faster. Nanocrystals of 200 nm reach over 20 m²/g — and because very small crystals are also slightly *more* soluble (the Ostwald–Freundlich effect), they dissolve faster still.

### Counting particles: content uniformity
The number of particles in a mass $m$ is $N = 6m/(\\pi\\rho d^3)$: it grows with the *cube* of the size reduction. That matters for low-dose tablets. A 50 µg dose made of 50 µm particles is only about 590 particles, so by chance alone (Poisson statistics, relative spread $1/\\sqrt{N}$) tablets differ by about 4 %; at 10 µm the same dose is 73 000 particles and the spread falls to 0.4 %. Potent drugs are milled fine for exactly this reason ([[tablet-testing]]).

### Describing a real powder
Real particles are neither spheres nor all one size, so a size is always an **equivalent diameter**: of the sphere with the same volume (what laser diffraction reports), the same projected area (microscopy), the same settling speed (the Stokes diameter, [[suspensions]]) or the same aerodynamic behaviour ([[inhalation]]). A distribution is summarised by $D_{10}$, $D_{50}$ and $D_{90}$ — the sizes below which 10, 50 and 90 % of the *volume* lies — and its width by the span $(D_{90} - D_{10})/D_{50}$.

Weighting changes everything. A powder can be 99 % fine particles *by number* and still carry most of its *mass* in a few large ones, because one 20 µm particle holds as much drug as a thousand 2 µm particles. Always ask whether a size is by number, by surface or by volume.

| Method | Typical range | What it measures |
|---|---|---|
| Sieving | above about 40 µm | passes a given aperture |
| Microscopy and image analysis | about 1 µm upward | projected-area diameter and shape |
| Laser diffraction | about 0.1 µm to 3 mm | volume-equivalent sphere |
| Dynamic light scattering | about 1 nm to a few µm | hydrodynamic diameter, from Brownian motion |
| Cascade impactor | 0.5–10 µm | aerodynamic diameter |

### The right size for the job
| Product | Typical size | Why |
|---|---|---|
| Inhaled powder or aerosol | 1–5 µm (aerodynamic) | reaches the airways, not the throat |
| Eye suspension | mostly below 10 µm | comfort; pharmacopoeias cap larger particles |
| Oral suspension | 1–50 µm | settles slowly, not gritty |
| Tablet granules | 100–1000 µm | flow into the die |
| Nanocrystal suspension | 100–400 nm | fast dissolution of very insoluble drugs |

Finer is not always better. Micronised powders are cohesive and flow badly ([[powder-flow]]), pick up static charge, can form amorphous patches on milling that later recrystallise ([[solid-state]]), and a drug that degrades at its surface degrades faster when there is more surface.

> [!key] Specific surface area is $6/(\\rho d)$: every halving of the particle size doubles the surface that dissolves and multiplies the number of particles eightfold.
`,
  ideas: [
    'For spheres the specific surface area is 6/(ρd): halve the size and the surface per gram doubles.',
    'The number of particles in a given mass grows as 1/d³, so low-dose drugs need fine particles for tablets of uniform content.',
    'Every size is an equivalent diameter — volume, projected area, Stokes or aerodynamic — and every distribution has a weighting: number, surface or volume.',
    'D10, D50 and D90 (usually by volume) and the span (D90 − D10)/D50 summarise a distribution.',
    'The right size depends on the product: 1–5 µm for inhalation, below 10 µm for eye suspensions, 100–1000 µm granules for tablets.'
  ],
  pitfalls: [
    'A D50 of 5 µm means half of the particles are smaller than 5 µm — The D50 quoted by laser diffraction is by volume: half of the mass is in particles below 5 µm. Counted by number, far more than half the particles are smaller.',
    'Smaller particles have less surface — That is true of one particle; for a fixed mass the number of particles rises as 1/d³, so the total surface rises as 1/d.',
    'Milling always improves a product — Finer powders dissolve faster but flow worse, cake, charge, can turn partly amorphous and degrade faster; the aim is the right size, not the smallest.'
  ],
  formulas: [
    {
      name: 'Specific surface area of spheres',
      expr: 'Sw = 6/(rho*d)', tex: 'S_w = \\dfrac{6}{\\rho\\, d}',
      vars: {
        Sw: { name: 'specific surface area', q: false, unit: 'm²/g', tex: 'S_w' },
        rho: { name: 'true density of the solid', q: false, unit: 'g/cm³', value: 1.3 },
        d: { name: 'particle diameter', q: false, unit: 'µm', value: 10 }
      },
      note: 'With density in g/cm³ and diameter in µm the 6 gives m²/g directly. Irregular particles have 1.5–3 times more surface than spheres of the same volume.',
      stories: {
        Sw: 'A drug of density {rho} is milled to particles of {d}. What is its specific surface area?',
        d: 'A powder of density {rho} has a measured specific surface area of {Sw}. What is its equivalent sphere diameter?'
      }
    },
    {
      name: 'Number of particles in a mass',
      expr: 'N = 6*m/(pi*rho*d^3)', tex: 'N = \\dfrac{6\\,m}{\\pi \\rho\\, d^3}',
      vars: {
        N: { name: 'number of particles' },
        m: { name: 'mass of drug', q: 'mass', unit: 'mg', value: 1 },
        rho: { name: 'true density', q: 'density', unit: 'g/cm³', value: 1.3 },
        d: { name: 'particle diameter', q: 'length', unit: 'µm', value: 10 }
      },
      note: 'Equal spheres. Randomly mixed, the count in one tablet varies by about 1/√N (Poisson), which sets a floor on content uniformity.',
      practice: { unknowns: ['N', 'd'] },
      stories: {
        N: 'How many particles of {d} are there in {m} of a drug of density {rho}?',
        d: 'A low-dose tablet must contain at least {N} particles in its {m} of drug (density {rho}). What is the largest particle size allowed?'
      }
    },
    {
      name: 'Span of a size distribution',
      expr: 'span = (D90 - D10)/D50', tex: '\\mathrm{span} = \\dfrac{D_{90} - D_{10}}{D_{50}}',
      vars: {
        span: { name: 'span', tex: '\\mathrm{span}' },
        D90: { name: 'D90 (90 % of the volume below)', q: 'length', unit: 'µm', value: 20, tex: 'D_{90}' },
        D10: { name: 'D10 (10 % of the volume below)', q: 'length', unit: 'µm', value: 2, tex: 'D_{10}' },
        D50: { name: 'D50, the volume median diameter', q: 'length', unit: 'µm', value: 8, tex: 'D_{50}' }
      },
      note: 'A span near 1 is a narrow distribution; 2–3 is typical of milled powders.',
      stories: { span: 'Laser diffraction gives D10 = {D10}, D50 = {D50} and D90 = {D90}. What is the span?' }
    }
  ],
  examples: [
    {
      title: 'What micronisation buys',
      q: 'A poorly soluble drug (density 1.3 g/cm³) is jet-milled from 60 µm to 3 µm. By how much does its specific surface area rise, and what does that mean for the initial dissolution rate?',
      steps: [
        'Before: $S_w = 6/(1.3 \\times 60) = 0.077$ m²/g.',
        'After: $S_w = 6/(1.3 \\times 3) = 1.54$ m²/g — twenty times more.',
        'By Noyes–Whitney the initial rate is proportional to the area, so it rises at least twentyfold; the thinner diffusion layer around small particles adds more.'
      ],
      a: 'The surface rises from 0.077 to 1.54 m²/g, twenty times, and the initial dissolution rate by at least as much.'
    },
    {
      title: 'Particle size and a 50 µg tablet',
      q: 'A hypothetical drug is given as 50 µg in a 100 mg tablet. Its density is 1.3 g/cm³. Compare 50 µm and 10 µm particles: how many particles are in a tablet, and how much will tablets vary by chance alone?',
      steps: [
        'One 50 µm particle: $\\frac{\\pi}{6}(50\\times10^{-4}\\,\\text{cm})^3 \\times 1.3$ g/cm³ $= 8.5\\times10^{-8}$ g = 85 ng.',
        '$N = 50\\,000/85 \\approx 590$ particles; Poisson spread $1/\\sqrt{590} = 4.1$ %.',
        'At 10 µm each particle is 125 times lighter (0.68 ng): $N \\approx 73\\,000$ and the spread is $1/\\sqrt{73\\,000} = 0.37$ %.'
      ],
      a: 'About 590 particles and a 4 % chance spread at 50 µm, against 73 000 particles and 0.4 % at 10 µm.'
    }
  ],
  quiz: [
    { q: 'A powder is milled so that its particle diameter halves. Its specific surface area…', choices: ['halves', 'doubles', 'rises four times', 'rises eight times'], a: 1, why: 'S = 6/(ρd): area per gram is inversely proportional to diameter. Each particle has a quarter of the area, but there are eight times as many.' },
    { q: 'What is the specific surface area (m²/g) of 5 µm spheres of density 1.2 g/cm³?', answer: 1.0, unit: 'm²/g', why: '6/(1.2 × 5) = 1.0 m²/g.' },
    { q: 'A powder with a number median of 2 µm must have most of its mass in particles smaller than 2 µm.', a: false, why: 'Mass goes as d³: a few large particles can carry most of the mass even when the great majority by number are small.' },
    { q: 'Which technique sizes nanoparticles by timing their Brownian motion?', choices: ['sieving', 'laser diffraction', 'dynamic light scattering', 'cascade impaction'], a: 2, why: 'Dynamic light scattering measures how fast the scattered light fluctuates, which gives the diffusion coefficient and, through Stokes–Einstein, the hydrodynamic diameter.' },
    { q: 'Why are very potent, low-dose drugs milled finely before tableting?', choices: ['to make the tablet harder', 'so each tablet holds enough particles for a uniform dose', 'to slow their dissolution', 'to improve powder flow'], a: 1, why: 'With few, large particles the number per tablet varies by chance by about 1/√N; fine particles make N large and the dose uniform. Fine powders actually flow worse.' }
  ],
  problems: [
    { q: 'How many 20 µm spherical particles are there in 1 mg of a drug of density 1.4 g/cm³?', answer: 170500, tol: 0.02, steps: ['Volume of one particle: $\\frac{\\pi}{6}(20\\times10^{-6})^3 = 4.19\\times10^{-15}$ m³.', 'Mass: $4.19\\times10^{-15} \\times 1400 = 5.86\\times10^{-12}$ kg $= 5.86\\times10^{-6}$ mg.', '$N = 1/5.86\\times10^{-6} \\approx 1.71\\times10^5$ particles.'] },
    { q: 'A powder has D10 = 4 µm, D50 = 15 µm and D90 = 40 µm. What is its span?', answer: 2.4, tol: 0.02, steps: ['span = (40 − 4)/15 = 2.4.'] }
  ],
  applications: [
    'Micronising poorly soluble drugs so they dissolve fast enough to be absorbed.',
    'Keeping low-dose tablets uniform, and inhaled powders in the 1–5 µm window that reaches the lungs.',
    'Nanocrystal suspensions for oral and long-acting injectable products.',
    'Specifying particle size for suspensions, eye drops and injections, where large particles irritate or block needles.'
  ],
  history: 'Micronisation entered medicine in the late 1950s and 1960s; a classic early success was the antifungal griseofulvin, whose micronised form gave the same blood levels at roughly half the dose. Laser diffraction instruments spread from the 1970s, and the first medicine based on drug nanocrystals was approved in the United States in 2000.',
  sim: 'disp-psd'
},

{
  id: 'diffusion-fick', parent: 'interfaces-flow', title: 'Diffusion and Fick\'s law', level: 2,
  short: 'Molecules wander at random, so matter flows from high concentration to low. Fick\'s law makes the flux proportional to the gradient — across a membrane J = DKΔC/h — and the time to diffuse a distance grows with its square.',
  keywords: ['diffusion', 'Fick\'s first law', 'Fick\'s second law', 'flux', 'diffusion coefficient', 'partition coefficient', 'permeability coefficient', 'membrane', 'lag time', 'Stokes–Einstein', 'Brownian motion'],
  prereq: ['biology:diffusion-osmosis', 'chemistry:effusion-diffusion', 'partition-logp'],
  related: ['dissolution-rate', 'transdermal', 'membrane-transport-pharm', 'release-kinetics', 'math:heat-equation', 'medicine:membrane-transport', 'colloids'],
  body: `
Put a drop of dye in still water and it spreads on its own, slowly and evenly, with no stirring. Each molecule wanders at random, jostled by the water around it; nothing pushes it anywhere. But where there are more molecules, more of them wander away than wander in, so on balance matter flows from high concentration to low. That net flow is **diffusion**, and almost every step of a medicine's journey depends on it: a particle dissolving, a drug leaving a matrix tablet or a patch, crossing the gut wall or the skin, moving from a capillary into a cell.

### Fick's first law
Adolf Fick (1855) proposed that the flux — the amount crossing unit area in unit time — is proportional to the concentration gradient:

$$J = -D\\,\\frac{dC}{dx}$$

The minus sign says the flow runs downhill. The **diffusion coefficient** $D$ measures how mobile the molecule is: about $5$–$10\\times10^{-10}$ m²/s for a small drug in water, $6\\times10^{-11}$ m²/s for albumin, and far less inside solids — $10^{-12}$ to $10^{-15}$ m²/s in polymers and in the lipids of the skin's outer layer.

### Across a membrane
To cross a membrane a drug must first dissolve in it — the **partition coefficient** $K$ is the ratio of its concentration just inside the membrane to that in the solution — and then diffuse across the thickness $h$. Once the gradient inside is steady and straight:

$$J = \\frac{D\\,K\\,\\Delta C}{h} = P\\,\\Delta C$$

where $P = DK/h$ is the **permeability coefficient**, in cm/s or cm/h. The flux doubles if the membrane is half as thick or if the drug partitions twice as well into it — which is why lipophilicity matters so much ([[partition-logp]]) and why the skin, thin but made of lipids, lets through mainly small, moderately lipophilic molecules ([[transdermal]]). A drug that is too lipophilic dissolves in the membrane but will not leave it for the watery side, so absorption usually peaks at an intermediate log P.

### Fick's second law: time goes as distance squared
How the concentration changes with time follows from conservation of mass:

$$\\frac{\\partial C}{\\partial t} = D\\,\\frac{\\partial^2 C}{\\partial x^2}$$

the same equation as heat conduction ([[math:heat-equation|the heat equation]]). Its most useful consequence is that the time to diffuse a distance $x$ grows with the *square* of the distance, $t \\approx x^2/2D$:

| Distance | Time for a small molecule in water ($D = 5\\times10^{-10}$ m²/s) |
|---|---|
| 1 µm (a bacterium) | 1 ms |
| 10 µm (across a cell) | 0.1 s |
| 100 µm (a diffusion layer, a thin tissue) | 10 s |
| 1 mm | about 17 min |
| 1 cm | about 28 h |

Diffusion is quick over the size of a cell and hopeless over centimetres, which is why the body needs a circulation — and why, when a drug starts to cross a membrane, there is a **lag time** of $h^2/6D$ before the flux reaches its steady value.

### What sets D: the Stokes–Einstein equation
For a molecule or particle of radius $r$ in a liquid of viscosity $\\eta$,

$$D = \\frac{k_B T}{6\\pi\\eta r}$$

Bigger molecules and more viscous liquids diffuse more slowly, warmer ones faster. An antibody ($r \\approx 5.5$ nm) diffuses about ten times more slowly than a small drug ($r \\approx 0.5$ nm). A viscous syrup slows everything; in a gel, by contrast, small molecules move through the water between the polymer chains almost as fast as in water, while large ones are held back. The same equation turns the Brownian motion of nanoparticles into their size ([[colloids]]).

> [!key] Flux is proportional to the gradient — across a membrane $J = DK\\Delta C/h$ — and diffusion time grows with the square of the distance, $t \\approx x^2/2D$.
`,
  ideas: [
    'Diffusion is the net flow produced by random molecular motion, always from high to low concentration.',
    'Fick\'s first law: flux = −D × gradient; across a membrane at steady state J = DKΔC/h = PΔC.',
    'The time to diffuse a distance grows with its square: milliseconds across a bacterium, a day across a centimetre.',
    'A membrane shows a lag time h²/6D before steady flux is reached.',
    'Stokes–Einstein: D = kT/(6πηr) — larger molecules and more viscous liquids diffuse more slowly.'
  ],
  pitfalls: [
    'Molecules diffuse because they are pushed from high to low concentration — Each molecule moves at random; the net flow is statistical, because more molecules leave a crowded region than enter it.',
    'The more lipophilic a drug, the faster it crosses a membrane — Partitioning into the membrane helps only up to a point; very lipophilic drugs stay in the membrane or are held up by the watery layers on either side.',
    'Double the distance, double the time — Diffusion time grows with the square of the distance: twice as far takes four times as long.'
  ],
  formulas: [
    {
      name: 'Steady-state flux across a membrane',
      expr: 'J = D*K*dC/h', tex: 'J = \\dfrac{D\\,K\\,\\Delta C}{h}',
      vars: {
        J: { name: 'flux', q: false, unit: 'µg/(cm²·h)' },
        D: { name: 'diffusion coefficient in the membrane', q: false, unit: 'cm²/h', value: 0.0018 },
        K: { name: 'partition coefficient, membrane/solution', value: 0.5 },
        dC: { name: 'concentration difference across the membrane', q: false, unit: 'µg/mL', value: 2000, tex: '\\Delta C' },
        h: { name: 'membrane thickness', q: false, unit: 'cm', value: 0.01 }
      },
      note: 'Consistent units: 1 µg/mL is 1 µg/cm³, so D in cm²/h and h in cm give µg/(cm²·h). 10⁻⁶ cm²/s = 0.0036 cm²/h; 100 µm = 0.01 cm. Valid once the lag time has passed and while the receiving side stays a sink.',
      practice: { unknowns: ['J', 'h', 'K'] },
      stories: {
        J: 'A drug at {dC} diffuses through a membrane {h} thick into a sink, with D = {D} and K = {K}. What is the steady flux?',
        K: 'A flux of {J} is measured through a membrane {h} thick with D = {D} and a donor at {dC}. What is the partition coefficient?',
        h: 'What membrane thickness gives a flux of {J} for a donor at {dC}, with D = {D} and K = {K}?'
      }
    },
    {
      name: 'Time to diffuse a distance',
      expr: 't = x^2/(2*D)', tex: 't \\approx \\dfrac{x^2}{2D}',
      vars: {
        t: { name: 'time', q: 'time', unit: 's' },
        x: { name: 'distance', q: 'length', unit: 'µm', value: 100 },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 5e-10 }
      },
      note: 'The root-mean-square distance travelled in one direction after time t is √(2Dt); use it as an order of magnitude.',
      stories: {
        t: 'About how long does a molecule with D = {D} take to diffuse {x}?',
        x: 'How far does a molecule with D = {D} typically diffuse in {t}?'
      }
    },
    {
      name: 'Stokes–Einstein equation',
      expr: 'D = kB*T/(6*pi*eta*r)', tex: 'D = \\dfrac{k_B T}{6\\pi \\eta\\, r}',
      vars: {
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        eta: { name: 'viscosity of the liquid', q: 'viscosity', unit: 'mPa·s', value: 0.69 },
        r: { name: 'hydrodynamic radius', q: 'length', unit: 'nm', value: 0.5 }
      },
      note: 'For spheres much larger than the solvent molecules. Water is 0.89 mPa·s at 25 °C and 0.69 mPa·s at 37 °C.',
      practice: { unknowns: ['D', 'r'] },
      stories: {
        D: 'A molecule of hydrodynamic radius {r} is in a liquid of viscosity {eta} at {T}. What is its diffusion coefficient?',
        r: 'Dynamic light scattering measures D = {D} for particles in water ({eta}, {T}). What is their hydrodynamic radius?'
      }
    }
  ],
  examples: [
    {
      title: 'A drug through a membrane',
      q: 'A hypothetical drug diffuses from a saturated 2 mg/mL solution through a 100 µm silicone membrane into a sink. In the membrane $D = 5\\times10^{-7}$ cm²/s and $K = 0.5$. What is the steady flux, the lag time, and how much crosses 5 cm² in 8 hours?',
      steps: [
        '$D = 5\\times10^{-7} \\times 3600 = 1.8\\times10^{-3}$ cm²/h; $h = 0.01$ cm; $\\Delta C = 2000$ µg/mL.',
        '$J = 1.8\\times10^{-3} \\times 0.5 \\times 2000/0.01 = 180$ µg/(cm²·h).',
        'Lag time $h^2/6D = 10^{-4}/(6 \\times 1.8\\times10^{-3}) = 0.0093$ h — about half a minute, negligible here.',
        'Amount: $180 \\times 5 \\times 8 = 7200$ µg, provided the donor stays saturated.'
      ],
      a: '180 µg/(cm²·h), a lag of about 30 s, and 7.2 mg through 5 cm² in 8 h.'
    },
    {
      title: 'A small drug and an antibody',
      q: 'Compare a small drug (hydrodynamic radius 0.5 nm) with an antibody (5.5 nm) in water at 37 °C (0.69 mPa·s): their diffusion coefficients and the time each needs to diffuse 100 µm.',
      steps: [
        '$k_BT = 1.381\\times10^{-23} \\times 310.15 = 4.28\\times10^{-21}$ J.',
        'Small drug: $D = 4.28\\times10^{-21}/(6\\pi \\times 0.69\\times10^{-3} \\times 0.5\\times10^{-9}) = 6.6\\times10^{-10}$ m²/s; $t = (10^{-4})^2/(2D) = 7.6$ s.',
        'Antibody: eleven times larger, so $D = 6.0\\times10^{-11}$ m²/s and $t = 84$ s.'
      ],
      a: 'About 6.6 × 10⁻¹⁰ against 6.0 × 10⁻¹¹ m²/s: 8 s against 84 s to cross 100 µm.'
    }
  ],
  quiz: [
    { q: 'A membrane is made twice as thick. At steady state the flux of a drug across it…', choices: ['doubles', 'halves', 'falls to a quarter', 'is unchanged'], a: 1, why: 'J = DKΔC/h: flux is inversely proportional to thickness. (The lag time, h²/6D, becomes four times longer.)' },
    { q: 'A molecule takes 1 s to diffuse 30 µm. About how long does it take to diffuse 300 µm?', choices: ['10 s', '30 s', '100 s', '1000 s'], a: 2, why: 'Time grows with the square of distance: ten times farther takes a hundred times longer.' },
    { q: 'About how many seconds does a molecule with D = 1 × 10⁻⁹ m²/s need to diffuse 50 µm (t ≈ x²/2D)?', answer: 1.25, unit: 's', why: '(50 × 10⁻⁶)²/(2 × 10⁻⁹) = 2.5 × 10⁻⁹/2 × 10⁻⁹ = 1.25 s.' },
    { q: 'The more lipophilic a drug, the faster it always crosses a membrane.', a: false, why: 'Partitioning in helps, but a very lipophilic drug does not leave the membrane for the aqueous side; permeation typically peaks at an intermediate log P.' },
    { q: 'Which change doubles the diffusion coefficient of a particle in a liquid?', choices: ['halving its radius', 'doubling its radius', 'doubling the viscosity', 'halving the absolute temperature'], a: 0, why: 'D = kT/(6πηr): D is inversely proportional to radius and viscosity, and proportional to absolute temperature.' }
  ],
  problems: [
    { q: 'A drug has D = 1 × 10⁻⁶ cm²/s and K = 3 in a membrane 50 µm thick. What is its permeability coefficient P = DK/h, in cm/h?', answer: 2.16, unit: 'cm/h', tol: 0.02, steps: ['$h = 50$ µm $= 5\\times10^{-3}$ cm.', '$P = 10^{-6} \\times 3/(5\\times10^{-3}) = 6\\times10^{-4}$ cm/s.', '× 3600 s/h = 2.16 cm/h.'] }
  ],
  applications: [
    'Designing the rate-controlling membranes of patches, implants and coated pellets.',
    'Predicting how fast drugs cross the gut wall, the skin and the cornea.',
    'Sizing nanoparticles and proteins by dynamic light scattering, which measures D and converts it with Stokes–Einstein.',
    'Franz diffusion cells: measuring permeation through skin and membranes in the laboratory.'
  ],
  history: 'Adolf Fick, a German physiologist, published his laws in 1855, borrowing the mathematics of heat conduction from Fourier. In 1905 Albert Einstein and, independently, William Sutherland related diffusion to viscosity and particle size, explaining Brownian motion. The time-lag method for measuring diffusion through membranes goes back to Daynes (1920) and Barrer (1939).',
  sim: 'disp-skin'
},

{
  id: 'dissolution-rate', parent: 'interfaces-flow', title: 'Dissolution and the Noyes–Whitney equation', level: 2,
  short: 'A drug must dissolve before it can be absorbed. The Noyes–Whitney equation, dm/dt = DA(Cs − C)/h, says the rate grows with surface area and solubility, falls with the diffusion-layer thickness, and stops when the medium saturates.',
  keywords: ['dissolution', 'Noyes–Whitney', 'dissolution rate', 'diffusion layer', 'sink conditions', 'Hixson–Crowell', 'cube-root law', 'intrinsic dissolution', 'surface area', 'solubility', 'wetting', 'rate-limiting step'],
  prereq: ['solubility-pharm', 'diffusion-fick', 'particle-size'],
  related: ['dissolution-testing', 'bcs', 'solid-state', 'ph-solubility', 'surfactants', 'f2-similarity', 'release-kinetics', 'bioavailability'],
  body: `
A tablet's drug cannot be absorbed until it has dissolved, and for many modern drugs — large, flat, greasy molecules that water barely wets — dissolving is the slowest step of all. When it is, anything that speeds dissolution raises the amount absorbed and the speed of onset, and anything that slows it (a harder tablet, a different crystal form, a new supplier's powder) can make a medicine fail ([[bcs]]).

### The Noyes–Whitney equation
Around every dissolving particle clings a thin, nearly stagnant **diffusion layer**. At the solid surface the liquid is saturated, at the solubility $C_s$; across the layer, of thickness $h$, the concentration falls to the bulk value $C$. Fick's law across that layer gives the rate at which mass dissolves:

$$\\frac{dm}{dt} = \\frac{D\\,A\\,(C_s - C)}{h}$$

Every term is a lever for the formulator:

| Term | Raises the rate when… | How it is used |
|---|---|---|
| $A$, surface area | particles are smaller and well wetted | milling ([[particle-size]]), disintegrants, wetting agents ([[surfactants]]) |
| $C_s$, solubility | a salt, an amorphous form, a complex or a better pH is used | salt selection ([[ph-solubility]]), [[solid-state]] forms, [[complexation]] |
| $D$, diffusion coefficient | the medium is less viscous or warmer | little room to change it |
| $h$, layer thickness | the liquid moves faster past the surface | fixed in a test by the paddle speed, in the gut by its motility |
| $C$, bulk concentration | the drug is removed as it dissolves | sink conditions, absorption |

For a drug with $D = 7\\times10^{-10}$ m²/s and a solubility of 0.5 mg/mL, 250 mg of 40 µm particles (about 290 cm² of surface) behind a 30 µm layer start dissolving at about 20 mg per minute.

### Sink conditions
While the bulk concentration stays far below saturation, the bracket is simply $C_s$ and the rate stays high: the medium is a **sink**. In a test vessel that needs a volume able to dissolve several times the dose — a common rule is volume × solubility of at least three times the dose. In the gut, a permeable drug is absorbed as fast as it dissolves, so the gut wall itself acts as the sink. Without sink conditions dissolution slows as the medium fills, and stops at saturation however long you wait.

### Shrinking particles
As particles dissolve their surface shrinks and the rate falls. For a powder of equal spheres with a constant layer thickness, the cube root of the undissolved mass falls in a straight line — the **Hixson–Crowell cube-root law** (1931):

$$W_0^{1/3} - W^{1/3} = \\kappa\\,t$$

Very fine particles, below about 30 µm, have diffusion layers roughly as thick as their radius, which speeds them up further; that is why micronised and nanocrystal forms dissolve even faster than their surface area alone predicts.

### Beyond the equation
Real dosage forms add steps before and around it. A tablet must disintegrate before its particles meet the fluid; a hydrophobic powder floats and clumps unless wetted; a salt dissolves into a microenvironment at its own pH and may reprecipitate as the free acid or base; an amorphous form can overshoot to supersaturation and then crash out. Bile salts and food raise the solubility of lipophilic drugs in the intestine. A laboratory [[dissolution-testing|dissolution test]] measures the net result, and [[f2-similarity|f2]] compares two products' profiles.

> [!key] Dissolution rate is proportional to surface area and to the distance from saturation: $dm/dt = DA(C_s - C)/h$. Smaller particles, higher solubility and sink conditions speed it; a saturated medium stops it.
`,
  ideas: [
    'Noyes–Whitney: dm/dt = DA(Cs − C)/h — dissolution is diffusion across a thin layer next to the solid.',
    'Surface area and solubility are the main levers: milling, salts, amorphous forms, complexes and wetting agents.',
    'Under sink conditions (volume × solubility ≥ 3 × dose) the rate does not slow as drug accumulates.',
    'For equal spheres the cube root of the mass left falls linearly with time (Hixson–Crowell).',
    'For poorly soluble drugs dissolution is often the rate-limiting step of absorption.'
  ],
  pitfalls: [
    'A drug that is soluble enough to dissolve will dissolve fast enough — Solubility sets how much can dissolve; the rate also depends on surface, wetting and diffusion layer, and a soluble drug in a hard, slowly disintegrating tablet can still release slowly.',
    'Adding more medium always speeds dissolution — Under sink conditions the volume hardly matters; it matters only when the medium is approaching saturation.',
    'Dissolution rate is a property of the drug alone — It depends just as much on the particles, the formulation and the hydrodynamics, which is why tests fix the apparatus, volume and stirring speed.'
  ],
  formulas: [
    {
      name: 'Noyes–Whitney equation',
      expr: 'mdot = D*A*(Cs - C)/h', tex: '\\dot{m} = \\dfrac{D\\,A\\,(C_s - C)}{h}',
      vars: {
        mdot: { name: 'dissolution rate', q: 'massflow', unit: 'g/min', tex: '\\dot{m}' },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 7e-10 },
        A: { name: 'surface area of the solid', q: 'area', unit: 'cm²', value: 290 },
        Cs: { name: 'solubility (g/L = mg/mL)', q: 'density', unit: 'g/L', value: 0.5, tex: 'C_s' },
        C: { name: 'concentration in the bulk (g/L = mg/mL)', q: 'density', unit: 'g/L', value: 0.05 },
        h: { name: 'diffusion-layer thickness', q: 'length', unit: 'µm', value: 30 }
      },
      note: 'Concentrations as mass per volume (1 g/L = 1 mg/mL). 0.018 g/min is 18 mg/min. Initial rate: the area shrinks as the particles dissolve.',
      practice: { unknowns: ['mdot', 'A', 'h'] },
      stories: {
        mdot: 'Particles with {A} of surface dissolve in a medium at {C}; the solubility is {Cs}, D = {D} and the diffusion layer is {h}. What is the dissolution rate?',
        A: 'A dissolution rate of {mdot} is wanted from a drug of solubility {Cs} (bulk {C}, D = {D}, layer {h}). How much surface is needed?',
        h: 'Particles with {A} dissolve at {mdot} (solubility {Cs}, bulk {C}, D = {D}). How thick is the diffusion layer?'
      }
    },
    {
      name: 'Hixson–Crowell cube-root law',
      expr: 'cbrt(W0) - cbrt(W) = kappa*t', tex: 'W_0^{1/3} - W^{1/3} = \\kappa\\, t',
      vars: {
        W: { name: 'mass undissolved', q: false, unit: 'mg' },
        W0: { name: 'initial mass', q: false, unit: 'mg', value: 100, tex: 'W_0' },
        kappa: { name: 'cube-root rate constant', q: false, unit: 'mg^(1/3)/min', value: 0.1 },
        t: { name: 'time', q: false, unit: 'min', value: 20 }
      },
      solveFor: 'W',
      note: 'Equal spheres dissolving under sink conditions with a constant diffusion layer. Work in mg and min throughout.',
      stories: {
        W: 'A powder of {W0} dissolves with a cube-root constant of {kappa}. How much is left after {t}?',
        t: 'With κ = {kappa}, how long until {W0} of powder has shrunk to {W}?',
        kappa: 'Of {W0} of powder, {W} remains after {t}. What is the cube-root rate constant?'
      }
    },
    {
      name: 'Sink factor',
      expr: 'S = V*Cs/Dose', tex: 'S = \\dfrac{V\\,C_s}{\\mathrm{Dose}}',
      vars: {
        S: { name: 'sink factor' },
        V: { name: 'volume of medium', q: false, unit: 'mL', value: 900 },
        Cs: { name: 'solubility in the medium', q: false, unit: 'mg/mL', value: 0.5, tex: 'C_s' },
        Dose: { name: 'dose', q: false, unit: 'mg', value: 250, tex: '\\mathrm{Dose}' }
      },
      note: 'S ≥ 3 is the usual meaning of sink conditions; below 1 the dose cannot all dissolve.',
      stories: {
        S: 'A {Dose} tablet is tested in {V} of a medium in which the drug\'s solubility is {Cs}. What is the sink factor?',
        V: 'What volume gives a sink factor of {S} for a {Dose} dose with a solubility of {Cs}?'
      }
    }
  ],
  examples: [
    {
      title: 'Is the test under sink conditions?',
      q: 'A 250 mg tablet of a hypothetical drug with a solubility of 0.1 mg/mL is tested in 900 mL. What is the sink factor, how much can dissolve, and what solubility or volume would give sink conditions?',
      steps: [
        '$S = 900 \\times 0.1/250 = 0.36$: the medium can hold only 90 mg, 36 % of the dose.',
        'For $S = 3$ the solubility must reach $3 \\times 250/900 = 0.83$ mg/mL, or the volume $3 \\times 250/0.1 = 7500$ mL.',
        'Laboratories usually add a surfactant (for example 0.5–1 % sodium lauryl sulfate) to raise the solubility instead, and must justify it.'
      ],
      a: 'S = 0.36 — at most 36 % can dissolve; sink conditions need about 0.83 mg/mL or 7.5 L.'
    },
    {
      title: 'The cube-root law',
      q: 'A powder of 200 mg is 50 % dissolved after 10 min. If it follows the Hixson–Crowell law, when will 90 % have dissolved?',
      steps: [
        '$\\kappa = (200^{1/3} - 100^{1/3})/10 = (5.848 - 4.642)/10 = 0.1206$ mg$^{1/3}$/min.',
        '90 % dissolved leaves 20 mg: $t = (5.848 - 2.714)/0.1206 = 26.0$ min.',
        'The second 40 % takes longer than the first 50 %, because the particles — and their surface — have shrunk.'
      ],
      a: 'About 26 minutes.'
    }
  ],
  quiz: [
    { q: 'Which change doubles the initial dissolution rate of a powder under sink conditions?', choices: ['halving the particle diameter', 'doubling the volume of medium', 'doubling the diffusion-layer thickness', 'switching to a less soluble salt'], a: 0, why: 'Halving the diameter doubles the surface per gram. Under sink conditions extra volume changes little; a thicker layer halves the rate; a less soluble salt slows it.' },
    { q: 'A 100 mg dose is tested in 900 mL where its solubility is 0.2 mg/mL. What is the sink factor V·Cs/dose?', answer: 1.8, why: '900 × 0.2/100 = 1.8 — below 3, so the rate will slow as the medium fills.' },
    { q: 'Under sink conditions the dissolution rate hardly depends on the concentration already in the bulk.', a: true, why: 'When C ≪ Cs, the bracket (Cs − C) is almost Cs, so the drug already dissolved barely slows the rest.' },
    { q: 'Why does a dissolution test fix the paddle speed?', choices: ['to keep the temperature constant', 'because stirring sets the diffusion-layer thickness h', 'to prevent the tablet from floating', 'because the solubility depends on stirring'], a: 1, why: 'Faster flow thins the diffusion layer and speeds dissolution, so results are comparable only at a fixed speed. Solubility itself does not depend on stirring.' },
    { q: 'For equal spheres dissolving under sink conditions, which quantity falls linearly with time?', choices: ['the mass remaining', 'the square root of the mass remaining', 'the cube root of the mass remaining', 'the logarithm of the mass remaining'], a: 2, why: 'The Hixson–Crowell law: surface ∝ mass^(2/3), which makes mass^(1/3) fall linearly.' }
  ],
  problems: [
    { q: 'A drug with D = 8 × 10⁻¹⁰ m²/s and a solubility of 2 mg/mL dissolves from 100 cm² of surface into a sink through a 20 µm diffusion layer. What is the initial dissolution rate in mg/min?', answer: 48, unit: 'mg/min', tol: 0.02, steps: ['In SI: $A = 0.01$ m², $C_s = 2$ kg/m³, $h = 2\\times10^{-5}$ m.', '$dm/dt = 8\\times10^{-10} \\times 0.01 \\times 2/(2\\times10^{-5}) = 8\\times10^{-7}$ kg/s $= 0.8$ mg/s.', '× 60 = 48 mg/min.'] }
  ],
  applications: [
    'Change particle size, solubility and volume and watch a powder dissolve in [the dissolution calculator](#/tools/formulation/dissolution).',
    'Choosing salts, crystal forms, particle sizes and wetting agents for poorly soluble drugs.',
    'Designing dissolution tests with sink conditions, and discriminating tests that catch a bad batch.',
    'Explaining why a change of supplier, granulation or compression force can change how a tablet works.',
    'Nanocrystal and amorphous solid-dispersion products for drugs of very low solubility.'
  ],
  history: 'Arthur Noyes and Willis Whitney measured benzoic acid and lead chloride dissolving from rotating cylinders in 1897. Walther Nernst and Erich Brunner explained their constant in 1904 as D/h, with the diffusion layer. Hixson and Crowell derived the cube-root law in 1931. Dissolution became a pharmacopoeial test in 1970, when the United States Pharmacopeia adopted the rotating basket after reports in the 1960s of tablets of the same drug giving very different blood levels.',
  sim: 'ref-dissolution'
},

{
  id: 'surfactants', parent: 'interfaces-flow', title: 'Surfactants, micelles and HLB', level: 2,
  short: 'Surfactants have a water-loving head and an oil-loving tail, so they gather at interfaces and lower surface tension. Above the critical micelle concentration they form micelles that dissolve lipophilic drugs; the HLB number says whether a surfactant suits water-in-oil, oil-in-water or solubilising jobs.',
  keywords: ['surfactant', 'surface-active agent', 'micelle', 'critical micelle concentration', 'CMC', 'HLB', 'hydrophile–lipophile balance', 'surface tension', 'solubilisation', 'polysorbate', 'sorbitan ester', 'sodium lauryl sulfate', 'Gibbs adsorption', 'wetting agent'],
  prereq: ['chemistry:intermolecular-forces', 'chemistry:surface-tension-viscosity', 'partition-logp'],
  related: ['emulsions', 'colloids', 'dissolution-rate', 'suspensions', 'preservatives', 'biology:lipids', 'physics:surface-tension'],
  body: `
A surfactant molecule has two ends that want opposite things: a water-loving (hydrophilic) **head** — an ionic group or a chain of oxyethylene units — and a water-hating (hydrophobic) **tail**, usually a hydrocarbon chain of 8 to 18 carbons. In water the tails are squeezed out of the hydrogen-bonded network, so surfactant molecules crowd to every interface — water–air, water–oil, water–solid — heads in the water, tails out. That is how they lower surface and interfacial tension, wet powders, hold emulsions and foams together and dissolve greasy drugs.

### Four families
| Type | Head | Pharmaceutical examples |
|---|---|---|
| Anionic | negative: sulfate, carboxylate | sodium lauryl sulfate, docusate sodium, soaps, bile salts |
| Cationic | positive: quaternary ammonium | benzalkonium chloride, cetrimide — mostly as preservatives and antiseptics |
| Non-ionic | polyoxyethylene chain or sugar ester | polysorbates, sorbitan esters, poloxamers, macrogol ethers |
| Zwitterionic | both charges | lecithins (phospholipids) |

Non-ionics dominate medicines taken internally: they irritate less, care little about pH and salts, and are compatible with most drugs.

### Surface tension and the critical micelle concentration
Pure water at 25 °C has a surface tension of 72 mN/m. Adding a surfactant lowers it steeply as the surface fills with molecules — until the surface is full. Beyond a sharp threshold, the **critical micelle concentration (CMC)**, extra molecules stay in the bulk and assemble into **micelles**: clusters of about 50–100 molecules, tails in a greasy core and heads outside. Above the CMC the surface tension stays flat while the number of micelles grows.

| Surfactant | CMC (water, 25 °C) | Surface tension at the CMC |
|---|---|---|
| sodium lauryl sulfate | about 8 mM (0.23 %) | about 38 mN/m |
| cetrimonium bromide | about 0.9 mM | about 36 mN/m |
| polysorbate 80 | about 0.012 mM (0.0015 %) | about 42 mN/m |

Ionic surfactants have high CMCs because their charged heads repel one another; salt screens the charge and lowers the CMC several-fold. Non-ionics, with no such repulsion, form micelles at far lower concentrations. Below the CMC, the **Gibbs adsorption equation** links the slope of surface tension against log concentration to how densely the surface is packed.

### Solubilisation
The core of a micelle is a tiny drop of oil. A lipophilic drug dissolves in it, so above the CMC the total solubility rises in a straight line with surfactant concentration. **Micellar solubilisation** carries poorly soluble drugs in oral solutions, injections and eye drops — and bile-salt micelles do the same for fats and lipophilic drugs in the gut ([[medicine:digestion-absorption|digestion and absorption]]). It is also why dissolution media for insoluble drugs often contain a surfactant ([[dissolution-rate]]).

### HLB: matching a surfactant to its job
Griffin's **hydrophile–lipophile balance** (1949) scores non-ionic surfactants from about 1 (very oil-loving) to 20 (very water-loving); on Davies' extended scale sodium lauryl sulfate reaches 40. The number predicts the job:

| HLB | Typical use |
|---|---|
| 1–3 | antifoams |
| 3–6 | water-in-oil emulsifiers |
| 7–9 | wetting and spreading agents |
| 8–18 | oil-in-water emulsifiers |
| 13–15 | detergents |
| 15–18 | solubilisers |

HLB values mix linearly by weight, so two surfactants — say sorbitan monooleate (HLB 4.3) and polysorbate 80 (15.0) — can be blended to any value in between to match an oil ([[emulsions]]).

> [!key] Surfactants gather at interfaces and lower their tension until the surface is full; above the CMC they form micelles that can dissolve lipophilic drugs. The HLB says what a surfactant is good for: low for water-in-oil, high for oil-in-water and solubilising.
`,
  ideas: [
    'A surfactant has a hydrophilic head and a hydrophobic tail, so it adsorbs at interfaces and lowers their tension.',
    'Above the critical micelle concentration the surface is full: surface tension levels off and micelles form in the bulk.',
    'Micelles solubilise lipophilic drugs in their core; solubility rises linearly with surfactant above the CMC.',
    'Ionic surfactants have high CMCs that salt lowers; non-ionics have low CMCs and dominate internal medicines.',
    'HLB (1–20 for non-ionics) predicts the job, and blends mix linearly by weight.'
  ],
  pitfalls: [
    'Adding more surfactant above the CMC keeps lowering the surface tension — Once the surface is saturated the monomer concentration stays near the CMC; extra surfactant makes micelles, not a lower tension.',
    'A high HLB means a better emulsifier — The HLB must match the job and the oil: a solubiliser of HLB 16 makes a poor water-in-oil emulsion, and the best oil-in-water blend is the one that matches the oil\'s required HLB.',
    'Micelles are permanent particles — They are dynamic: surfactant molecules exchange in microseconds, and micelles fall apart when diluted below the CMC, which can make a solubilised drug precipitate on dilution in the gut or the blood.'
  ],
  formulas: [
    {
      name: 'HLB of a surfactant blend',
      expr: 'HLB = fA*HA + (1 - fA)*HB', tex: '\\mathrm{HLB} = f_A\\,\\mathrm{HLB}_A + (1 - f_A)\\,\\mathrm{HLB}_B',
      vars: {
        HLB: { name: 'HLB of the blend', tex: '\\mathrm{HLB}' },
        fA: { name: 'weight fraction of surfactant A', q: 'ratio', unit: '%', value: 58, min: 0, max: 100, tex: 'f_A' },
        HA: { name: 'HLB of surfactant A (the more hydrophilic)', value: 15.0, tex: '\\mathrm{HLB}_A' },
        HB: { name: 'HLB of surfactant B (the more lipophilic)', value: 4.3, tex: '\\mathrm{HLB}_B' }
      },
      note: 'Weight-averaging works well for non-ionic blends. Solve for the fraction to hit an oil\'s required HLB.',
      practice: { unknowns: ['HLB', 'fA'] },
      stories: {
        HLB: 'A blend is {fA} polysorbate 80 (HLB {HA}) and the rest sorbitan monooleate (HLB {HB}). What is its HLB?',
        fA: 'An oil needs HLB {HLB}. What weight fraction of a surfactant of HLB {HA} must be blended with one of HLB {HB}?'
      }
    },
    {
      name: 'Griffin\'s HLB of a non-ionic surfactant',
      expr: 'HLB = 20*MH/M', tex: '\\mathrm{HLB} = 20\\,\\dfrac{M_H}{M}',
      vars: {
        HLB: { name: 'HLB', tex: '\\mathrm{HLB}' },
        MH: { name: 'molar mass of the hydrophilic part', q: 'molarmass', unit: 'g/mol', value: 880, tex: 'M_H' },
        M: { name: 'molar mass of the whole molecule', q: 'molarmass', unit: 'g/mol', value: 1150 }
      },
      note: 'For polyoxyethylene surfactants this is the weight per cent of oxyethylene divided by 5.',
      stories: { HLB: 'A polyoxyethylene ether of {M} has a hydrophilic part of {MH}. What is its HLB?' }
    },
    {
      name: 'Davies\' group-number HLB',
      expr: 'HLB = 7 + H - 0.475*n', tex: '\\mathrm{HLB} = 7 + H - 0.475\\,n',
      vars: {
        HLB: { name: 'HLB', tex: '\\mathrm{HLB}' },
        H: { name: 'sum of the hydrophilic group numbers', value: 38.7 },
        n: { name: 'number of –CH₂– and –CH₃ groups in the tail', value: 12, int: true }
      },
      note: 'Group numbers: sulfate (–SO₄⁻Na⁺) 38.7, carboxylate sodium salt 19.1, free –COOH 2.1, –OH 1.9, ester 2.4, –(CH₂CH₂O)– 0.33.',
      practice: { unknowns: ['HLB'] },
      stories: { HLB: 'A surfactant has hydrophilic groups adding up to {H} and a tail of {n} carbon groups. What is its Davies HLB?' }
    },
    {
      name: 'Micellar solubilisation',
      expr: 'Stot = Sw + MSR*(Csurf - CMC)', tex: 'S_{tot} = S_w + \\mathrm{MSR}\\,(C_{surf} - \\mathrm{CMC})',
      vars: {
        Stot: { name: 'total solubility of the drug', q: 'concentration', unit: 'mM', tex: 'S_{tot}' },
        Sw: { name: 'solubility in water alone', q: 'concentration', unit: 'mM', value: 0.01, tex: 'S_w' },
        MSR: { name: 'molar solubilisation ratio (drug per micellised surfactant)', value: 0.05, tex: '\\mathrm{MSR}' },
        Csurf: { name: 'surfactant concentration', q: 'concentration', unit: 'mM', value: 7.6, tex: 'C_{surf}' },
        CMC: { name: 'critical micelle concentration', q: 'concentration', unit: 'mM', value: 0.012, tex: '\\mathrm{CMC}' }
      },
      note: 'Above the CMC only. 1 % w/v polysorbate 80 (about 1310 g/mol) is 7.6 mM.',
      practice: { unknowns: ['Stot', 'Csurf'] },
      stories: {
        Stot: 'A drug with water solubility {Sw} is dissolved in {Csurf} of a surfactant (CMC {CMC}); its molar solubilisation ratio is {MSR}. What is its total solubility?',
        Csurf: 'How much surfactant (CMC {CMC}, MSR {MSR}) raises a drug\'s solubility from {Sw} to {Stot}?'
      }
    }
  ],
  examples: [
    {
      title: 'Blending emulsifiers for liquid paraffin',
      q: 'Light liquid paraffin needs an HLB of about 10.5 for an oil-in-water emulsion. How much polysorbate 80 (HLB 15.0) and sorbitan monooleate (HLB 4.3) make 5 g of emulsifier blend?',
      steps: [
        '$10.5 = f \\times 15.0 + (1 - f) \\times 4.3$, so $f = (10.5 - 4.3)/(15.0 - 4.3) = 6.2/10.7 = 0.579$.',
        'Polysorbate 80: $0.579 \\times 5 = 2.9$ g; sorbitan monooleate: 2.1 g.',
        'In practice a formulator tries blends either side of the calculated value and keeps the most stable emulsion.'
      ],
      a: '2.9 g polysorbate 80 with 2.1 g sorbitan monooleate (58 : 42).'
    },
    {
      title: 'Solubilising a poorly soluble drug',
      q: 'A hypothetical drug (300 g/mol) dissolves in water to 0.01 mM. In 1 % polysorbate 80 (7.6 mM; CMC 0.012 mM) its molar solubilisation ratio is 0.05. What is its solubility in mg/mL?',
      steps: [
        '$S = 0.01 + 0.05 \\times (7.6 - 0.012) = 0.01 + 0.379 = 0.389$ mM.',
        'In mass: $0.389 \\times 300 = 117$ mg/L $= 0.117$ mg/mL, against 0.003 mg/mL in water.',
        'Nearly forty times more — but if the solution is diluted below the CMC, as in the blood, the drug may precipitate.'
      ],
      a: 'About 0.12 mg/mL, some 39 times the water solubility.'
    }
  ],
  quiz: [
    { q: 'Above the CMC, adding more surfactant to water…', choices: ['keeps lowering the surface tension in proportion', 'leaves the surface tension nearly constant and forms more micelles', 'raises the surface tension', 'makes the micelles grow without limit'], a: 1, why: 'The surface is already full; the extra molecules assemble into more micelles, and the free monomer concentration stays near the CMC.' },
    { q: 'Which HLB suits an oil-in-water emulsifier?', choices: ['2', '4.5', '12', '40'], a: 2, why: 'Oil-in-water emulsifiers lie around 8–18. 2 is an antifoam, 4.5 a water-in-oil emulsifier, and 40 (sodium lauryl sulfate) a detergent and solubiliser.' },
    { q: 'What is the HLB of a blend of 30 % sorbitan monooleate (4.3) and 70 % polysorbate 80 (15.0)?', answer: 11.8, why: '0.3 × 4.3 + 0.7 × 15.0 = 1.29 + 10.5 = 11.8.' },
    { q: 'Adding sodium chloride raises the CMC of an ionic surfactant.', a: false, why: 'Salt screens the repulsion between the charged heads, so micelles form more easily: the CMC falls, often several-fold.' },
    { q: 'Why are non-ionic surfactants preferred in most oral and injectable medicines?', choices: ['they have the highest CMCs', 'they are less irritant and less sensitive to pH and electrolytes', 'they are all antimicrobial', 'they never form micelles'], a: 1, why: 'Non-ionics carry no charge, so they are less irritant and less affected by pH, salts and charged drugs; they form micelles at very low concentrations.' }
  ],
  problems: [
    { q: 'An oil phase needs an HLB of 12. What weight percentage of polysorbate 60 (HLB 14.9) must be blended with sorbitan monostearate (HLB 4.7)?', answer: 71.6, unit: '%', tol: 0.02, steps: ['$f = (12 - 4.7)/(14.9 - 4.7) = 7.3/10.2 = 0.716$.', 'So 71.6 % polysorbate 60 and 28.4 % sorbitan monostearate.'] }
  ],
  applications: [
    'Blend two surfactants to a required HLB in [the HLB calculator](#/tools/formulation/emulsion).',
    'Emulsifying creams and oral emulsions; wetting hydrophobic powders in suspensions and tablets.',
    'Solubilising poorly soluble drugs in oral liquids, injections and eye drops.',
    'Adding surfactant to dissolution media so a test of an insoluble drug has sink conditions.',
    'Cationic surfactants such as benzalkonium chloride as preservatives and antiseptics.'
  ],
  history: 'Josiah Willard Gibbs derived his adsorption equation in 1878. James McBain proposed micelles in 1913 to explain the strange conductivity of soap solutions. William Griffin introduced the HLB scale in 1949, and J. T. Davies gave the group-number method in 1957.',
  sim: ['disp-cmc', 'disp-hlb']
},

{
  id: 'colloids', parent: 'interfaces-flow', title: 'Colloids and dispersions', level: 2,
  short: 'Particles between about 1 nm and 1 µm — proteins, nanoparticles, micelles, emulsion droplets — are colloids: dominated by their surface and kept in suspension by Brownian motion. Charge (the double layer and zeta potential) or a polymer coat keeps them apart; salt lets van der Waals attraction win.',
  keywords: ['colloid', 'dispersion', 'lyophilic', 'lyophobic', 'association colloid', 'Brownian motion', 'Tyndall effect', 'DLVO', 'double layer', 'Debye length', 'zeta potential', 'flocculation', 'coagulation', 'steric stabilisation', 'Schulze–Hardy'],
  prereq: ['chemistry:intermolecular-forces', 'diffusion-fick', 'particle-size'],
  related: ['suspensions', 'emulsions', 'surfactants', 'nanomedicine', 'lipid-nanoparticles', 'rheology', 'biologics-formulation'],
  body: `
A colloid is matter divided into pieces so small — from about 1 nm to 1 µm — that they no longer settle like a separate phase, yet are far bigger than ordinary molecules. Milk, fog, plasma proteins, gelatin, a nanoparticle injection and the lipid nanoparticles of mRNA vaccines are all colloids. At that size surface dominates: a gram of 100 nm particles has tens of square metres of interface, and everything about the system — its stability, how it flows, how the body handles it — is decided at the surface.

### Kinds of colloids
- **Lyophilic** ("solvent-loving") colloids dissolve spontaneously: macromolecules such as gelatin, acacia, cellulose ethers and proteins. They are thermodynamically stable.
- **Lyophobic** colloids — insoluble particles such as metal sols, drug nanocrystals and emulsion droplets — must be made by dispersing or precipitating, and are only *kinetically* stable: left alone they aggregate, because less total surface means lower energy.
- **Association colloids** form on their own above a threshold concentration: surfactant micelles ([[surfactants]]).

Colloids scatter light (the **Tyndall effect**, the visible beam in a dusty room), pass ordinary filters but not dialysis membranes, and jiggle with **Brownian motion**, the random kicks of molecular collisions. A 100 nm particle in water wanders about 3 µm in a second — enough to keep it from settling — while a 10 µm particle settles far faster than it diffuses ([[suspensions]]).

### What keeps particles apart: DLVO theory
Two particles in water feel a van der Waals attraction that grows very strong at short range. What stops them from sticking is the **electrical double layer**: most particles carry a surface charge, which gathers a diffuse cloud of counter-ions around it, and when two clouds overlap they repel. The Derjaguin–Landau–Verwey–Overbeek (DLVO) theory adds attraction and repulsion:

- At high charge and low salt the total energy has a **barrier** of many $k_BT$: colliding particles bounce apart and the dispersion is stable.
- Salt compresses the double layer. Its thickness, the **Debye length**, is about $0.304/\\sqrt{I}$ nm in water at 25 °C (ionic strength $I$ in mol/L): 9.6 nm at 1 mM, under 1 nm in blood. As it shrinks the barrier falls, and particles drop into the deep **primary minimum** and coagulate irreversibly.
- Between the two, a shallow **secondary minimum** a few nanometres out can hold particles in loose flocs that shaking breaks up — the controlled flocculation used in suspensions.

Ions of higher charge are far more effective (the **Schulze–Hardy rule**): trivalent counter-ions coagulate a sol at hundreds of times lower concentration than monovalent ones.

### Zeta potential
The surface charge cannot be measured directly, but the **zeta potential** — the potential where the liquid carried with the particle shears away — can, from how fast the particles move in an electric field (electrophoresis):

$$\\zeta = \\frac{\\eta\\,\\mu_e}{\\varepsilon_r\\varepsilon_0}$$

As a rule of thumb, dispersions with $|\\zeta|$ above about 30 mV are electrostatically stable, and below about 10 mV they aggregate quickly unless something else holds the particles apart.

### Steric stabilisation
Polymers or non-ionic surfactants on the surface — polyethylene glycol chains, poloxamers, polysorbates — hold particles apart physically, even in salty blood where the double layer has collapsed. The same PEG layer slows the capture of nanoparticles by the immune system and lengthens their time in the circulation ([[nanomedicine]], [[lipid-nanoparticles]]).

> [!key] Lyophobic colloids are only kinetically stable. Charge (the double layer, measured as zeta potential) or a polymer layer provides the energy barrier; salt, especially multivalent ions, collapses the double layer and lets van der Waals attraction win.
`,
  ideas: [
    'Colloids are 1 nm–1 µm: big enough to scatter light, small enough for Brownian motion to keep them suspended.',
    'Lyophilic colloids dissolve spontaneously; lyophobic ones are only kinetically stable; micelles are association colloids.',
    'DLVO: van der Waals attraction plus double-layer repulsion gives an energy barrier, a deep primary and a shallow secondary minimum.',
    'Salt shrinks the Debye length (0.304/√I nm) and lowers the barrier; multivalent ions do it hundreds of times more strongly.',
    'Zeta potentials beyond about ±30 mV usually mean electrostatic stability; polymers give steric stability even in saline.'
  ],
  pitfalls: [
    'A stable colloid is one whose particles never touch — Particles collide constantly by Brownian motion; stability means the energy barrier makes them bounce apart instead of sticking.',
    'Adding salt makes a charged dispersion more stable because it adds charge — Added ions screen the particle charge and thin the double layer, which lowers the barrier and causes aggregation.',
    'Flocculation and coagulation are the same thing — In pharmacy, flocculation usually means loose, reversible aggregates in the secondary minimum (or bridged by polymer) that shaking breaks up; coagulation is the irreversible collapse into the primary minimum.'
  ],
  formulas: [
    {
      name: 'Debye length in water at 25 °C',
      expr: 'lD = 0.304/sqrt(I)', tex: '\\lambda_D = \\dfrac{0.304}{\\sqrt{I}}',
      vars: {
        lD: { name: 'Debye length (double-layer thickness)', q: false, unit: 'nm', tex: '\\lambda_D' },
        I: { name: 'ionic strength (mol/L)', q: false, unit: 'mol/L', value: 0.01 }
      },
      note: 'Aqueous solution at 25 °C. For a 1:1 salt such as NaCl the ionic strength equals its molar concentration; blood is about 0.15 mol/L.',
      stories: {
        lD: 'What is the Debye length in a solution of ionic strength {I}?',
        I: 'At what ionic strength does the double layer shrink to {lD}?'
      }
    },
    {
      name: 'Zeta potential from electrophoretic mobility (Smoluchowski)',
      expr: 'zeta = eta*mu/(epsr*eps0)', tex: '\\zeta = \\dfrac{\\eta\\,\\mu_e}{\\varepsilon_r \\varepsilon_0}',
      vars: {
        zeta: { name: 'zeta potential', q: 'voltage', unit: 'mV', signed: true },
        eta: { name: 'viscosity of the medium', q: 'viscosity', unit: 'mPa·s', value: 0.89 },
        mu: { name: 'electrophoretic mobility', unit: 'm²/(V·s)', value: -2.5e-8, signed: true, tex: '\\mu_e' },
        epsr: { name: 'relative permittivity of the medium', value: 78.5, tex: '\\varepsilon_r' },
        eps0: { const: 'eps0' }
      },
      note: 'For particles much larger than the Debye length. Mobility is often quoted in µm·cm/(V·s): 1 µm·cm/(V·s) = 10⁻⁸ m²/(V·s). Water at 25 °C: 0.89 mPa·s, εr = 78.5.',
      practice: { unknowns: ['zeta', 'mu'] },
      stories: {
        zeta: 'Particles in water ({eta}, εr = {epsr}) move with an electrophoretic mobility of {mu}. What is their zeta potential?',
        mu: 'What electrophoretic mobility corresponds to a zeta potential of {zeta} in water ({eta}, εr = {epsr})?'
      }
    },
    {
      name: 'Viscosity of a dilute dispersion (Einstein)',
      expr: 'eta = eta0*(1 + 2.5*phi)', tex: '\\eta = \\eta_0\\,(1 + 2.5\\,\\phi)',
      vars: {
        eta: { name: 'viscosity of the dispersion', q: 'viscosity', unit: 'mPa·s' },
        eta0: { name: 'viscosity of the continuous phase', q: 'viscosity', unit: 'mPa·s', value: 0.89, tex: '\\eta_0' },
        phi: { name: 'volume fraction of particles', q: 'ratio', unit: '%', value: 3, min: 0, max: 10 }
      },
      note: 'Rigid, non-interacting spheres up to a few per cent by volume. Higher fractions, flocculation or swollen particles raise the viscosity much more.',
      stories: {
        eta: 'Rigid spheres make up {phi} of a dispersion in water of {eta0}. What is its viscosity?',
        phi: 'A dilute dispersion in a medium of {eta0} has a viscosity of {eta}. What volume fraction of particles does that imply?'
      }
    }
  ],
  examples: [
    {
      title: 'Why a nanosuspension clumps in saline',
      q: 'A charge-stabilised nanosuspension is stable in 1 mM buffer. What happens to its double layer when it is diluted into 0.9 % sodium chloride (0.154 mol/L)?',
      steps: [
        'In 1 mM: $\\lambda_D = 0.304/\\sqrt{0.001} = 9.6$ nm — a thick cushion of repulsion.',
        'In saline: $\\lambda_D = 0.304/\\sqrt{0.154} = 0.77$ nm — twelve times thinner, well inside the range of van der Waals attraction.',
        'The barrier collapses and the particles aggregate, which is why nanosuspensions meant for injection are stabilised sterically, with polymers or non-ionic surfactants.'
      ],
      a: 'The Debye length falls from 9.6 nm to 0.77 nm; charge alone can no longer keep the particles apart.'
    },
    {
      title: 'Reading a zeta potential',
      q: 'Particles in water at 25 °C move at −3.0 µm·cm/(V·s). What is their zeta potential, and are they likely to be stable?',
      steps: [
        '$\\mu_e = -3.0\\times10^{-8}$ m²/(V·s).',
        '$\\zeta = 0.89\\times10^{-3} \\times (-3.0\\times10^{-8})/(78.5 \\times 8.854\\times10^{-12}) = -0.0384$ V.',
        'At −38 mV, beyond the ±30 mV rule of thumb, the dispersion should be electrostatically stable in low-salt media.'
      ],
      a: 'About −38 mV: likely stable.'
    }
  ],
  quiz: [
    { q: 'Roughly what size range defines colloids?', choices: ['0.01–0.1 nm', '1 nm to 1 µm', '10–100 µm', '0.1–1 mm'], a: 1, why: 'Below about 1 nm is a true solution; above about 1 µm particles settle and are called coarse dispersions.' },
    { q: 'Sodium chloride is added to a charge-stabilised dispersion. What happens?', choices: ['the double layer thickens and stability rises', 'the double layer thins, the energy barrier falls and particles may aggregate', 'the zeta potential rises', 'nothing — salt does not interact with particles'], a: 1, why: 'Ions screen the surface charge: the Debye length falls as 1/√I, so the repulsive barrier shrinks.' },
    { q: 'What is the Debye length (nm) in water at 25 °C at an ionic strength of 0.01 mol/L?', answer: 3.04, unit: 'nm', why: '0.304/√0.01 = 0.304/0.1 = 3.04 nm.' },
    { q: 'A lyophobic sol, such as a drug nanocrystal suspension, is thermodynamically stable.', a: false, why: 'Lyophobic colloids have excess surface energy; they are only kinetically stable, held apart by an energy barrier.' },
    { q: 'Which salt, at the same molar concentration, coagulates a negatively charged sol most strongly?', choices: ['sodium chloride', 'sodium sulfate', 'aluminium chloride', 'glucose (not a salt)'], a: 2, why: 'The counter-ions to a negative sol are cations; by the Schulze–Hardy rule the trivalent Al³⁺ is hundreds of times more effective than Na⁺. Sulfate is a co-ion here.' }
  ],
  problems: [
    { q: 'Rigid particles make up 4 % by volume of a dispersion in a vehicle of 2.0 mPa·s. What is its viscosity by Einstein\'s equation (mPa·s)?', answer: 2.2, unit: 'mPa·s', tol: 0.02, steps: ['$\\eta = 2.0 \\times (1 + 2.5 \\times 0.04) = 2.0 \\times 1.10 = 2.2$ mPa·s.'] }
  ],
  applications: [
    'Stabilising nanosuspensions, liposomes and lipid nanoparticles for injection.',
    'Controlled flocculation of suspensions so they settle loosely and redisperse on shaking.',
    'Measuring zeta potential and size (dynamic light scattering) in quality control of colloidal products.',
    'Understanding why proteins aggregate at their isoelectric point or when salted out.'
  ],
  history: 'Thomas Graham coined "colloid" (from the Greek for glue) in 1861 for substances that would not pass a parchment membrane. Robert Brown saw tiny particles from pollen grains jiggle in 1827; Einstein\'s theory (1905) and Jean Perrin\'s measurements (1908) made Brownian motion the proof of molecules. Smoluchowski related zeta potential to mobility in 1903, and DLVO theory came from Derjaguin and Landau (1941) and, independently, Verwey and Overbeek (1948).',
  sim: 'disp-dlvo'
},

{
  id: 'rheology', parent: 'interfaces-flow', title: 'Rheology of pharmaceutical systems', level: 2,
  short: 'How liquids and semisolids flow under force. Newtonian liquids have one viscosity; plastic systems need a yield stress, pseudoplastic ones thin and dilatant ones thicken with shear, and thixotropic ones thin with time and recover at rest — properties designed into suspensions, creams, gels and injections.',
  keywords: ['rheology', 'viscosity', 'shear stress', 'shear rate', 'Newtonian', 'non-Newtonian', 'plastic flow', 'Bingham', 'yield value', 'pseudoplastic', 'shear-thinning', 'dilatant', 'thixotropy', 'hysteresis loop', 'power law', 'rheogram', 'viscometer'],
  prereq: ['physics:viscosity', 'chemistry:surface-tension-viscosity', 'colloids'],
  related: ['suspensions', 'ointments-creams', 'emulsions', 'hydraulics:non-newtonian', 'injectable-formulation', 'ophthalmic', 'oral-solutions'],
  body: `
Squeeze a tube of toothpaste and it flows; stop squeezing and it sits on the brush without dripping. Shake a bottle of antacid suspension and it pours; leave it and it sets. Rub a cream and it spreads thin. These are **rheological** properties — how materials deform and flow under force — and pharmaceutical products are designed around them: a suspension must pour yet keep its particles from settling, a cream must stay in the jar and spread on skin, an injection must pass a fine needle, and an eye gel should thin as the eyelid blinks.

### Viscosity and the Newtonian liquid
Shear a liquid between two plates: the **shear stress** $\\tau$ (force per area) makes it flow with a **shear rate** $\\dot{\\gamma}$ (the velocity gradient, in 1/s). For water, oils, simple syrups and glycerol the ratio is a constant, the **viscosity**:

$$\\tau = \\eta\\,\\dot{\\gamma}$$

| Liquid (about 20–25 °C) | Viscosity |
|---|---|
| water | about 1 mPa·s (0.89 at 25 °C, 0.69 at 37 °C) |
| olive oil | about 80 mPa·s |
| simple syrup (sucrose 85 % w/v) | about 100–200 mPa·s |
| glycerol | about 1000 mPa·s |
| honey | several thousand mPa·s |

Viscosity falls steeply with temperature — about 2 % per degree for water, faster for syrups and oils — so every measurement states its temperature ([[physics:viscosity|viscosity]]).

### Non-Newtonian behaviour
Most semisolids, suspensions and polymer solutions are **non-Newtonian**: their viscosity depends on how fast they are sheared. A plot of shear stress against shear rate, a **rheogram**, shows the type. (Many pharmacy texts put shear rate on the vertical axis; the shapes are the same, mirrored.)

- **Plastic (Bingham) flow**: nothing moves until a **yield stress** $\\tau_0$ is exceeded, then it flows like a thick liquid: $\\tau = \\tau_0 + \\eta_p\\dot{\\gamma}$. Ointments, pastes, concentrated flocculated suspensions. The yield stress holds particles up and keeps a cream in the jar.
- **Pseudoplastic (shear-thinning)**: the viscosity falls as shear rises, because long polymer chains align and their tangles release. Cellulose ether solutions, carbomer gels, xanthan, alginates — and blood. The power law $\\tau = K\\dot{\\gamma}^n$ describes it with $n < 1$.
- **Dilatant (shear-thickening)**, $n > 1$: very concentrated deflocculated suspensions (above about 50 % solids) stiffen when stirred fast, because the particles lose their lubricating layers of liquid. A nuisance in mixing and milling.
- **Thixotropic**: time-dependent thinning. A structure — a floc network, a clay or gel lattice — breaks down under shear and rebuilds slowly at rest. The down-curve of the rheogram lies below the up-curve, enclosing a **hysteresis loop** whose area measures the structure broken. It is the ideal for a suspension: thin when shaken and poured, set in the bottle.

### Why the shear rate matters
Each use has its own shear rate, and a non-Newtonian product has a different viscosity at each:

| Situation | Typical shear rate |
|---|---|
| particles settling in a suspension at rest | below 0.01 1/s |
| pouring from a bottle | 10–100 1/s |
| rubbing a cream onto skin | $10^3$–$10^5$ 1/s |
| injecting through a fine needle | $10^4$–$10^5$ 1/s |

A shear-thinning vehicle is ideal: very viscous at rest, so particles barely settle ([[suspensions]]), and thin when poured, spread or injected. A single-point viscometer reading misses all this; a rotational rheometer sweeps the shear rate and records the loop. Engineers meet the same materials in pumps and pipes ([[hydraulics:non-newtonian|non-Newtonian liquids]]).

> [!key] Newtonian liquids have one viscosity. Plastic systems need a yield stress to flow, pseudoplastic ones thin and dilatant ones thicken as the shear rate rises, and thixotropic ones thin with time under shear and recover at rest — the loop in the rheogram.
`,
  ideas: [
    'Viscosity is shear stress divided by shear rate; for Newtonian liquids it is a constant at a given temperature.',
    'Plastic (Bingham) systems have a yield stress below which they do not flow.',
    'Pseudoplastic systems thin with shear (power law n < 1); dilatant ones thicken (n > 1).',
    'Thixotropic systems break down under shear and rebuild at rest; the rheogram shows a hysteresis loop.',
    'Each use has its own shear rate: settling below 0.01 1/s, pouring 10–100 1/s, spreading and injecting 10³–10⁵ 1/s.'
  ],
  pitfalls: [
    'A product has "a viscosity" — Only Newtonian liquids do. A shear-thinning gel can be a thousand times more viscous at rest than when rubbed, so a viscosity means nothing without its shear rate (and temperature).',
    'Thixotropy and pseudoplasticity are the same — Pseudoplastic thinning is instant and depends only on the shear rate; thixotropic thinning takes time under shear and recovery takes time at rest.',
    'A thicker vehicle is always better for a suspension — A high Newtonian viscosity slows settling but also makes the product hard to pour and redisperse; a shear-thinning or thixotropic vehicle with a yield stress gets both.'
  ],
  formulas: [
    {
      name: 'Newtonian flow',
      expr: 'tau = eta*gd', tex: '\\tau = \\eta\\,\\dot{\\gamma}',
      vars: {
        tau: { name: 'shear stress', q: 'stress', unit: 'Pa' },
        eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 150 },
        gd: { name: 'shear rate', q: 'rate', unit: '1/s', value: 50, tex: '\\dot{\\gamma}' }
      },
      stories: {
        tau: 'A syrup of {eta} is sheared at {gd}. What shear stress does it take?',
        eta: 'A rheometer needs {tau} to shear a liquid at {gd}. What is its viscosity?'
      }
    },
    {
      name: 'Plastic (Bingham) flow',
      expr: 'tau = tau0 + etap*gd', tex: '\\tau = \\tau_0 + \\eta_p\\,\\dot{\\gamma}',
      vars: {
        tau: { name: 'shear stress', q: 'stress', unit: 'Pa' },
        tau0: { name: 'yield stress (yield value)', q: 'stress', unit: 'Pa', value: 20, tex: '\\tau_0' },
        etap: { name: 'plastic viscosity', q: 'viscosity', unit: 'Pa·s', value: 0.5, tex: '\\eta_p' },
        gd: { name: 'shear rate', q: 'rate', unit: '1/s', value: 50, tex: '\\dot{\\gamma}' }
      },
      note: 'Valid only above the yield stress; below it the material does not flow.',
      practice: { unknowns: ['tau', 'gd', 'tau0'] },
      stories: {
        tau: 'An ointment has a yield value of {tau0} and a plastic viscosity of {etap}. What stress shears it at {gd}?',
        gd: 'An ointment (yield value {tau0}, plastic viscosity {etap}) is spread with a stress of {tau}. What shear rate results?'
      }
    },
    {
      name: 'Power law (Ostwald–de Waele)',
      expr: 'tau = K*gd^n', tex: '\\tau = K\\,\\dot{\\gamma}^{\\,n}',
      vars: {
        tau: { name: 'shear stress', q: false, unit: 'Pa' },
        K: { name: 'consistency index', q: false, unit: 'Pa·sⁿ', value: 10 },
        gd: { name: 'shear rate', q: false, unit: '1/s', value: 100, tex: '\\dot{\\gamma}' },
        n: { name: 'flow behaviour index (< 1 thinning, > 1 thickening)', value: 0.5, min: 0.05, max: 3 }
      },
      solveFor: 'tau',
      note: 'n = 1 is Newtonian with viscosity K. Fit over the range of shear rates that matters; the law fails at very low and very high rates.',
      practice: { unknowns: ['tau', 'K'] },
      stories: { tau: 'A gel has K = {K} and n = {n}. What stress shears it at {gd}?', K: 'A shear-thinning gel (n = {n}) needs {tau} at {gd}. What is its consistency index?' }
    },
    {
      name: 'Apparent viscosity of a power-law fluid',
      expr: 'etaa = K*gd^(n - 1)', tex: '\\eta_{app} = K\\,\\dot{\\gamma}^{\\,n-1}',
      vars: {
        etaa: { name: 'apparent viscosity', q: false, unit: 'Pa·s', tex: '\\eta_{app}' },
        K: { name: 'consistency index', q: false, unit: 'Pa·sⁿ', value: 5 },
        gd: { name: 'shear rate', q: false, unit: '1/s', value: 0.01, tex: '\\dot{\\gamma}' },
        n: { name: 'flow behaviour index', value: 0.4, min: 0.05, max: 3 }
      },
      solveFor: 'etaa',
      practice: { unknowns: ['etaa', 'gd'] },
      stories: { etaa: 'A suspending vehicle has K = {K} and n = {n}. What is its apparent viscosity at {gd}?' }
    }
  ],
  examples: [
    {
      title: 'A shear-thinning suspending vehicle',
      q: 'A cellulose-ether vehicle follows the power law with K = 5 Pa·sⁿ and n = 0.4. What is its apparent viscosity at rest (0.01 1/s, the rate at which particles settle) and when poured (50 1/s)?',
      steps: [
        'At 0.01 1/s: $\\eta = 5 \\times 0.01^{-0.6} = 5 \\times 15.8 = 79$ Pa·s — about 80 000 times water.',
        'At 50 1/s: $\\eta = 5 \\times 50^{-0.6} = 5 \\times 0.0956 = 0.48$ Pa·s — like a light syrup.',
        'The same vehicle is 165 times thicker at rest than in the pour: particles settle very slowly, yet the dose flows off the spoon.'
      ],
      a: 'About 79 Pa·s at rest against 0.48 Pa·s when poured.'
    },
    {
      title: 'Reading a plastic rheogram',
      q: 'An ointment needs 30 Pa to shear at 20 1/s and 50 Pa at 60 1/s, and flows in a straight line between. What are its plastic viscosity and yield value?',
      steps: [
        'Slope: $\\eta_p = (50 - 30)/(60 - 20) = 0.5$ Pa·s.',
        'Intercept: $\\tau_0 = 30 - 0.5 \\times 20 = 20$ Pa.',
        'Below 20 Pa — a thin layer resting on skin under its own weight — the ointment does not flow.'
      ],
      a: 'Plastic viscosity 0.5 Pa·s, yield value 20 Pa.'
    }
  ],
  quiz: [
    { q: 'Which system shows a yield value?', choices: ['water', 'glycerol', 'a stiff ointment', 'a dilute polymer solution'], a: 2, why: 'Plastic (Bingham) systems such as ointments and pastes do not flow until a yield stress is exceeded. The others flow under any stress.' },
    { q: 'In the rheogram of a thixotropic cream…', choices: ['the up- and down-curves coincide', 'the down-curve lies below the up-curve, enclosing a loop', 'the stress falls to zero at high shear', 'the curve is a straight line through the origin'], a: 1, why: 'Structure broken on the way up has not rebuilt on the way down, so at each shear rate the stress is lower coming down: a hysteresis loop.' },
    { q: 'A Newtonian liquid of 0.2 Pa·s is sheared at 50 1/s. What is the shear stress, in Pa?', answer: 10, unit: 'Pa', why: 'τ = ηγ̇ = 0.2 × 50 = 10 Pa.' },
    { q: 'A shear-thinning vehicle suits suspensions because it is thick at rest, slowing settling, and thin when shaken or poured.', a: true, why: 'Settling happens at tiny shear rates where the apparent viscosity is high; pouring and shaking are at high rates where it is low.' },
    { q: 'Dilatant (shear-thickening) flow is most typical of…', choices: ['dilute polymer solutions', 'concentrated deflocculated suspensions', 'simple syrups', 'water'], a: 1, why: 'Above about 50 % solids, closely packed particles lose their lubricating liquid when sheared fast, so the suspension stiffens.' }
  ],
  problems: [
    { q: 'A gel follows the power law with K = 20 Pa·sⁿ and n = 0.3. What is its apparent viscosity (Pa·s) at a shear rate of 1000 1/s, as when rubbed onto skin?', answer: 0.1590, unit: 'Pa·s', tol: 0.02, steps: ['$\\eta = K\\dot{\\gamma}^{n-1} = 20 \\times 1000^{-0.7}$.', '$1000^{-0.7} = 10^{-2.1} = 0.00794$, so $\\eta = 0.159$ Pa·s.'] }
  ],
  applications: [
    'Designing suspensions that pour but do not cake, and creams that stay in the jar but spread easily.',
    'Choosing viscosity-enhancing polymers for eye drops, oral liquids and nasal sprays.',
    'Checking that an injection can pass a fine needle (injectability), especially concentrated antibody solutions.',
    'Controlling mixing, pumping and filling in manufacture, where shear rates are high.'
  ],
  history: 'Eugene Bingham, who described the plastic flow of paints in 1916, coined the word "rheology" in 1920 with Markus Reiner, taking the motto "everything flows". Armand de Waele (1923) and Wolfgang Ostwald (1925) proposed the power law; the word thixotropy was coined in 1927, and Herbert Freundlich made it a subject of study.',
  sim: 'disp-rheogram'
},

{
  id: 'osmolarity-tonicity', parent: 'interfaces-flow', title: 'Osmolarity and tonicity', level: 2,
  short: 'Osmolarity counts all dissolved particles per litre; tonicity counts only those that cannot enter cells, and so decides whether cells swell, shrink or stay the same. Body fluids are about 290 mOsm/kg and freeze at −0.52 °C; 0.9 % sodium chloride and 5 % glucose are isotonic.',
  keywords: ['osmolarity', 'osmolality', 'tonicity', 'isotonic', 'hypotonic', 'hypertonic', 'isosmotic', 'haemolysis', 'red blood cell', 'freezing-point depression', 'mOsm', 'sodium chloride 0.9 %', 'glucose 5 %', 'osmotic coefficient'],
  prereq: ['chemistry:colligative-properties', 'biology:diffusion-osmosis', 'chemistry:osmotic-pressure'],
  related: ['isotonic-calculations', 'ophthalmic', 'injectable-formulation', 'parenteral-routes', 'medicine:body-fluids', 'medicine:electrolytes', 'nasal-otic'],
  body: `
Put a red blood cell in pure water and it swells and bursts within seconds; put it in strong salt water and it shrivels. The cell membrane lets water through freely but holds back most solutes, so water moves towards the side with more dissolved particles until the two sides balance ([[biology:diffusion-osmosis|osmosis]]). Every injection, infusion, eye drop and nasal spray meets living cells, so its concentration of dissolved particles matters as much as its drug.

### Counting particles: osmolarity
Osmotic effects depend on the number of dissolved particles, not their size or kind ([[chemistry:colligative-properties|colligative properties]]). **Osmolarity** counts them per litre of solution (mOsm/L); **osmolality** counts them per kilogram of water (mOsm/kg), which is what laboratories measure, usually from the depression of the freezing point. Ideally

$$\\text{osmolarity} = \\frac{c}{M}\\times n\\times 1000$$

with $c$ in g/L, $M$ the molar mass and $n$ the number of particles each molecule gives (1 for glucose, 2 for NaCl, 3 for CaCl₂). Real ions do not act fully independently: sodium chloride behaves as about 1.86 particles rather than 2, an osmotic coefficient of about 0.93.

| Solution | Ideal osmolarity | Measured osmolality |
|---|---|---|
| plasma | — | about 275–295 mOsm/kg (ranges vary by laboratory) |
| sodium chloride 0.9 % | 308 mOsm/L | about 286 mOsm/kg |
| glucose 5 % (anhydrous) | 278 mOsm/L (252 if made from glucose monohydrate) | — |
| glucose 10 % (anhydrous) | 555 mOsm/L | — |
| mannitol 20 % | 1098 mOsm/L | — |

Body fluids are about 290 mOsm/kg and freeze at about −0.52 °C, so any solution that freezes at −0.52 °C is iso-osmotic with them. That is the basis of the freezing-point and sodium-chloride-equivalent methods of adjusting preparations ([[isotonic-calculations]]).

### Tonicity is what the cell feels
**Tonicity** describes the effect of a solution on cell volume, and it counts only solutes that *cannot* cross the membrane. Urea, glycerol and ethanol enter red cells: they add to the osmolarity but not to the tonicity. A 1.8 % urea solution is iso-osmotic with plasma (300 mOsm/L), yet urea enters the cells, water follows, and they burst: it is **isosmotic but hypotonic**. Boric acid 1.9 % behaves the same way towards red cells, although the eye tolerates it.

| Tonicity | Effect on red cells | Examples |
|---|---|---|
| hypotonic | swell; lysis begins below about 0.5 % NaCl | water for injections, 0.45 % NaCl |
| isotonic | unchanged | 0.9 % NaCl, 5 % glucose |
| hypertonic | shrink and crenate | 3 % NaCl, 10 % glucose, 20 % mannitol |

A swelling red cell behaves like a perfect osmometer for its water: its volume follows $V/V_0 = b + (1-b)\\,\\text{Osm}_0/\\text{Osm}$, where $b$ (about 0.4) is the part of the cell that is not water. A 5 % glucose infusion is isotonic in the bag, but the body burns the glucose and leaves free water, so physiologically it acts like water ([[medicine:body-fluids|body fluids]]).

### How much does it matter?
- **Injections** into a vein are quickly diluted by the blood, so moderately hypertonic solutions are tolerated if given slowly into a large vein; very hypertonic ones (above about 900 mOsm/L) damage small peripheral veins, which is why concentrated parenteral nutrition goes into a central vein. Water for injections alone is never given into a vein. Injections into muscle, under the skin or into the spine should be close to isotonic ([[injectable-formulation]]).
- **Eye drops** are comfortable roughly between 0.6 % and 1.8 % NaCl-equivalent; outside that range they sting, and the tears they provoke wash the drug away ([[ophthalmic]]).
- **Nasal sprays** and **oral liquids** tolerate a wider range, although strongly hypertonic oral liquids draw water into the gut and can cause diarrhoea.

> [!key] Osmolarity counts all dissolved particles; tonicity counts only those that cannot enter the cells. Body fluids are about 290 mOsm/kg (freezing point −0.52 °C); 0.9 % NaCl and 5 % glucose are isotonic.
`,
  ideas: [
    'Osmotic effects depend on the number of dissolved particles: osmolarity = (g/L ÷ M) × particles per molecule × 1000 mOsm/L.',
    'Osmolality (per kg of water) is what is measured, usually by freezing point: 290 mOsm/kg freezes at about −0.52 °C.',
    'Tonicity counts only solutes that cannot cross the cell membrane; urea and boric acid can be isosmotic yet hypotonic.',
    'Red cells swell and burst in hypotonic solutions (lysis begins below about 0.5 % NaCl) and crenate in hypertonic ones.',
    'Injections into tissues and the eye should be near-isotonic; veins tolerate hypertonic solutions if given slowly into a large vessel.'
  ],
  pitfalls: [
    'Isosmotic and isotonic mean the same — Isosmotic compares particle counts; isotonic compares effects on cells. A solute that enters the cells, like urea, can be isosmotic yet hypotonic.',
    '0.9 % NaCl has exactly the osmolality of plasma because 9/58.44 × 2 × 1000 = 308 — That is the ideal osmolarity; ions interact, so the measured osmolality is about 286 mOsm/kg, close to plasma.',
    'A 5 % glucose infusion is a way to give "isotonic" fluid to the tissues — It is isotonic only in the bag; once the glucose is metabolised it delivers free water, which enters cells.'
  ],
  formulas: [
    {
      name: 'Ideal osmolarity of a solution',
      expr: 'Osm = c/M*n*1000', tex: '\\mathrm{Osm} = \\dfrac{c}{M}\\, n \\times 1000',
      vars: {
        Osm: { name: 'osmolarity', q: false, unit: 'mOsm/L', tex: '\\mathrm{Osm}' },
        c: { name: 'concentration', q: false, unit: 'g/L', value: 9 },
        M: { name: 'molar mass', q: false, unit: 'g/mol', value: 58.44 },
        n: { name: 'particles per formula unit', value: 2, int: true }
      },
      note: 'Ideal: real electrolytes give somewhat less (NaCl behaves as about 1.86 particles). 1 % w/v = 10 g/L. For mixtures, add the osmolarities of the solutes.',
      practice: { unknowns: ['Osm', 'c'] },
      stories: {
        Osm: 'What is the ideal osmolarity of a solution of {c} of a solute of molar mass {M} that gives {n} particles per formula unit?',
        c: 'How many grams per litre of a solute of molar mass {M} ({n} particles each) give {Osm}?'
      }
    },
    {
      name: 'Freezing-point depression of an aqueous solution',
      expr: 'dTf = Kf*Osm/1000', tex: '\\Delta T_f = K_f\\,\\dfrac{\\mathrm{Osm}}{1000}',
      vars: {
        dTf: { name: 'depression of the freezing point', q: false, unit: '°C', tex: '\\Delta T_f' },
        Kf: { name: 'cryoscopic constant of water', q: false, unit: 'K·kg/mol', value: 1.86, fixed: true, tex: 'K_f' },
        Osm: { name: 'osmolality', q: false, unit: 'mOsm/kg', value: 290, tex: '\\mathrm{Osm}' }
      },
      note: 'Dilute aqueous solutions. Body fluids (about 280–290 mOsm/kg) freeze at about −0.52 °C, the target of the freezing-point method.',
      stories: {
        dTf: 'By how much does a solution of {Osm} depress the freezing point of water?',
        Osm: 'A preparation freezes {dTf} below pure water. What is its osmolality?'
      }
    },
    {
      name: 'Red-cell volume in a solution (Boyle–van \'t Hoff)',
      expr: 'Vr = b + (1 - b)*Osm0/Osm', tex: 'V_r = b + (1 - b)\\,\\dfrac{\\mathrm{Osm}_0}{\\mathrm{Osm}}',
      vars: {
        Vr: { name: 'cell volume relative to normal, V/V₀', tex: 'V_r' },
        b: { name: 'osmotically inactive fraction of the cell', value: 0.4, min: 0, max: 0.9 },
        Osm0: { name: 'normal (isotonic) osmolarity', q: false, unit: 'mOsm/L', value: 290, tex: '\\mathrm{Osm}_0' },
        Osm: { name: 'effective osmolarity outside (impermeant solutes only)', q: false, unit: 'mOsm/L', value: 154, tex: '\\mathrm{Osm}' }
      },
      solveFor: 'Vr',
      note: 'The cell\'s water behaves as an ideal osmometer. Red cells can swell to about 1.5–1.7 times their volume, when they become spheres, before they burst.',
      practice: { unknowns: ['Vr', 'Osm'] },
      stories: {
        Vr: 'Red cells (inactive fraction {b}, normal at {Osm0}) are put into a solution of effective osmolarity {Osm}. By what factor does their volume change?',
        Osm: 'A red cell (inactive fraction {b}) bursts when it reaches {Vr} times its volume. Below what effective osmolarity does that happen, if normal is {Osm0}?'
      }
    }
  ],
  examples: [
    {
      title: 'Half-strength saline with glucose',
      q: 'An infusion contains 0.45 % sodium chloride and 2.5 % anhydrous glucose. What is its ideal osmolarity, and how does it behave once infused?',
      steps: [
        'NaCl: $4.5/58.44 \\times 2 \\times 1000 = 154$ mOsm/L.',
        'Glucose: $25/180.16 \\times 1000 = 139$ mOsm/L.',
        'Total 293 mOsm/L: isotonic in the bag, safe to infuse into a vein.',
        'The glucose is metabolised, leaving 154 mOsm/L of NaCl: in the body it behaves as a hypotonic fluid, giving some free water.'
      ],
      a: 'About 293 mOsm/L in the bag; physiologically hypotonic once the glucose is used.'
    },
    {
      title: 'Adjusting eye drops by freezing point',
      q: 'A hypothetical eye-drop solution freezes at −0.30 °C. A 1 % solution of sodium chloride depresses the freezing point by 0.576 °C. How much NaCl must be added to make it iso-osmotic with tears?',
      steps: [
        'Target depression 0.52 °C; the solution already gives 0.30 °C.',
        'Extra NaCl: $(0.52 - 0.30)/0.576 = 0.38$ % w/v, i.e. 0.38 g per 100 mL.',
        'Its osmolality rises from about $0.30/1.86 \\times 1000 = 161$ to about 280 mOsm/kg.'
      ],
      a: 'About 0.38 g of sodium chloride per 100 mL.'
    }
  ],
  quiz: [
    { q: 'What is the ideal osmolarity (mOsm/L) of 0.45 % sodium chloride (58.44 g/mol)?', answer: 154, unit: 'mOsm/L', why: '4.5 g/L ÷ 58.44 × 2 × 1000 = 154 mOsm/L.' },
    { q: 'Which solution is isosmotic with plasma but hypotonic to red cells?', choices: ['0.9 % sodium chloride', '5 % glucose', '1.8 % urea', '3 % sodium chloride'], a: 2, why: 'Urea at 1.8 % is about 300 mOsm/L, but it crosses the red-cell membrane, so it exerts no lasting osmotic pull: water follows it in and the cells lyse.' },
    { q: '5 % glucose is isotonic in the bag but acts like free water once it has been infused.', a: true, why: 'The glucose is taken up and metabolised, leaving water that distributes into all the body\'s compartments.' },
    { q: 'Red blood cells placed in 3 % sodium chloride will…', choices: ['swell and burst', 'stay the same', 'shrink and crenate', 'take up the sodium chloride and stay the same'], a: 2, why: '3 % NaCl is about 1030 mOsm/L of impermeant solute: water leaves the cells, which shrink and develop spikes (crenation).' },
    { q: 'At about what temperature does a solution iso-osmotic with blood freeze?', choices: ['0 °C', '−0.052 °C', '−0.52 °C', '−5.2 °C'], a: 2, why: 'About 290 mOsm/kg × 1.86 K·kg/mol ÷ 1000 ≈ 0.52–0.54 °C of depression.' }
  ],
  problems: [
    { q: 'What is the ideal osmolarity of 1 % w/v calcium chloride dihydrate (147.02 g/mol), which gives three ions?', answer: 204, unit: 'mOsm/L', tol: 0.02, steps: ['10 g/L ÷ 147.02 g/mol = 0.0680 mol/L.', '× 3 particles × 1000 = 204 mOsm/L.'] },
    { q: 'Red cells with an osmotically inactive fraction of 0.4 are put into a solution of 200 mOsm/L of impermeant solute (normal 290). By what factor does their volume change?', answer: 1.27, tol: 0.02, steps: ['$V/V_0 = 0.4 + 0.6 \\times 290/200 = 0.4 + 0.87 = 1.27$.'] }
  ],
  applications: [
    'Formulating injections, infusions, eye drops and nasal sprays that do not damage tissues.',
    'Choosing intravenous fluids: isotonic saline, balanced solutions, glucose and their effects on body water.',
    'Osmotic diuretics and hypertonic saline, which work because they are hypertonic.',
    'Testing red-cell osmotic fragility in the laboratory.'
  ],
  history: 'Jacobus van \'t Hoff showed in 1887 that osmotic pressure follows a law like the gas law, earning the first Nobel Prize in Chemistry in 1901. Hugo de Vries ranked solutions by their effect on plant cells, and Hartog Hamburger did the same with red blood cells in the 1880s, finding the concentration of salt at which they begin to burst.',
  sim: 'disp-tonicity'
},

/* ================================================================ LIQUID DOSAGE FORMS */
{
  id: 'oral-solutions', parent: 'liquids-topic', title: 'Solutions, syrups and elixirs', level: 1,
  short: 'Oral solutions deliver an already-dissolved drug that is easy to swallow and dose in fractions of a millilitre. Syrups, elixirs and cosolvent systems get the drug into solution and make it palatable; the costs are stability, taste, excipients unsuitable for young children, and measuring errors.',
  keywords: ['oral solution', 'syrup', 'simple syrup', 'elixir', 'linctus', 'oral drops', 'cosolvent', 'log-linear model', 'ethanol', 'propylene glycol', 'sugar-free', 'reconstitution', 'paediatric formulation', 'palatability'],
  prereq: ['solubility-pharm', 'ph-solubility', 'percent-strength'],
  related: ['suspensions', 'preservatives', 'paediatric-geriatric', 'shelf-life', 'surfactants', 'complexation', 'dose-calculations'],
  body: `
A solution is the simplest dosage form: the drug is already dissolved, so it needs no disintegration or dissolution before absorption, the dose can be measured in fractions of a millilitre, and anyone who can swallow can take it. That makes oral liquids the natural choice for babies and young children, for many older people and for patients fed by tube ([[paediatric-geriatric]]). The price is paid in stability, taste and dosing accuracy.

### The family
| Form | What it is |
|---|---|
| oral solution | drug dissolved in water or a water-miscible vehicle |
| syrup | a concentrated sugar (or sugar-free polyol) solution: sweet and viscous |
| elixir | a clear, sweetened solution with ethanol as a cosolvent |
| linctus | a viscous, sweet liquid for coughs, sipped slowly to coat the throat |
| oral drops | concentrated solutions measured in drops or with a dropper |
| powder or granules for oral solution | a dry product the pharmacist or patient reconstitutes |

**Simple syrup** is 85 % w/v sucrose — 850 g in each litre, about 65 % w/w — close to saturation. At that strength it largely preserves itself, because so little free water is left that microbes cannot grow. Diluted syrups lose that protection and need a preservative ([[preservatives]]). Sugar-free syrups replace sucrose with sorbitol, maltitol or glycerol and intense sweeteners, which matters for children's teeth and for people with diabetes — although large amounts of polyols can cause diarrhoea.

### Getting the drug into solution
Many drugs are not soluble enough in water at the dose needed. The formulator's tools:
- **pH and salts**: a weak acid dissolves better above its pKa, a weak base below it ([[ph-solubility]]); a buffer holds the pH.
- **Cosolvents**: ethanol, propylene glycol, glycerol and macrogols make the vehicle less polar. Solubility rises roughly exponentially with the fraction of cosolvent — the log-linear model, $\\log S_{mix} = \\log S_w + \\sigma f$ — so a drug with $\\sigma = 3$ is 8 times more soluble in 30 % cosolvent and a thousand times more soluble in pure cosolvent.
- **Surfactants and complexing agents**: micelles ([[surfactants]]) and cyclodextrins ([[complexation]]).

Dilution can undo all of these: a cosolvent solution diluted by gastric fluid may precipitate its drug, usually as fine particles that redissolve — but not always.

### Stability and taste
A dissolved drug degrades faster than a solid one, since hydrolysis and oxidation happen in solution ([[degradation-pathways]]). Liquids therefore often have shorter shelf lives and need buffers, antioxidants, chelating agents and protection from light, or are supplied as powders for reconstitution with a short in-use life ([[shelf-life]]). Many drugs taste bitter; flavours, sweeteners, higher viscosity and cooling agents help, and some drugs are made as suspensions of an insoluble form precisely because what does not dissolve cannot be tasted ([[suspensions]]).

### Excipients and children
Excipients that are harmless for adults may not be for newborns: ethanol, propylene glycol and benzyl alcohol accumulate because the enzymes that clear them mature over the first months of life. European labelling guidance (EMA, revised from 2017, at the time of writing) requires warnings when a dose contains more than set amounts of such excipients. Liquid medicines are measured with the oral syringe or cup supplied, not a household spoon, whose volume varies widely ([[medication-errors]]).

> [!warn] The examples here are for learning. Doses of oral liquids are measured with the device supplied and follow the product information and a prescriber's or pharmacist's instructions. Confusing strengths — mg/mL against mg/5 mL, or two strengths of the same medicine — is a common cause of serious dosing errors in children.
`,
  ideas: [
    'Solutions need no dissolution step and allow flexible, easily swallowed doses — ideal for children, older people and tube feeding.',
    'Simple syrup (85 % w/v sucrose) is nearly self-preserving; diluted and sugar-free syrups need preservatives.',
    'Cosolvents raise solubility roughly exponentially (log S = log Sw + σf), but dilution in the gut can reverse it.',
    'Drugs degrade faster in solution, so liquids have shorter shelf lives or are reconstituted before use.',
    'Excipients such as ethanol, propylene glycol and benzyl alcohol need special care in young children.'
  ],
  pitfalls: [
    'A drug in solution will stay dissolved in the stomach — Cosolvent and pH-adjusted solutions can precipitate when diluted by gastric fluid or neutralised in the intestine.',
    'Syrups need no preservative because they contain sugar — Only concentrated syrups with little free water resist microbes; diluted and many sugar-free syrups need preservatives.',
    'A 5 mL dose is a teaspoon — Household spoons hold anything from about 2.5 to 7 mL; oral liquids are measured with a syringe or cup marked in millilitres.'
  ],
  formulas: [
    {
      name: 'Cosolvent solubility (log-linear model)',
      expr: 'log(Smix) = log(Sw) + sigma*f', tex: '\\log S_{mix} = \\log S_w + \\sigma f',
      vars: {
        Smix: { name: 'solubility in the mixture', q: false, unit: 'mg/mL', tex: 'S_{mix}' },
        Sw: { name: 'solubility in water', q: false, unit: 'mg/mL', value: 0.01, tex: 'S_w' },
        sigma: { name: 'solubilising power of the cosolvent', value: 3 },
        f: { name: 'volume fraction of cosolvent (0–1)', value: 0.3, min: 0, max: 1 }
      },
      solveFor: 'Smix',
      note: 'An approximation (Yalkowsky): σ grows with the drug\'s lipophilicity and depends on the cosolvent. Use the same solubility units on both sides.',
      stories: {
        Smix: 'A drug dissolves in water to {Sw}. With a cosolvent of σ = {sigma} at a volume fraction of {f}, what is its solubility?',
        f: 'A drug dissolves in water to {Sw}; a cosolvent has σ = {sigma}. What fraction of cosolvent gives {Smix}?'
      }
    },
    {
      name: 'Per cent w/w from per cent w/v',
      expr: 'pw = pv/rho', tex: 'c_{\\mathrm{w/w}} = \\dfrac{c_{\\mathrm{w/v}}}{\\rho}',
      vars: {
        pw: { name: 'strength weight in weight', q: false, unit: '% w/w', tex: 'c_{\\mathrm{w/w}}' },
        pv: { name: 'strength weight in volume', q: false, unit: '% w/v', value: 85, tex: 'c_{\\mathrm{w/v}}' },
        rho: { name: 'density of the liquid', q: false, unit: 'g/mL', value: 1.313 }
      },
      note: 'g per 100 mL divided by g per mL of liquid gives g per 100 g. Simple syrup has a density of about 1.31 g/mL.',
      stories: { pw: 'A syrup contains {pv} of sucrose and has a density of {rho}. What is its strength in w/w?' }
    },
    {
      name: 'Volume of an oral liquid for a dose',
      expr: 'V = 5*D/S', tex: 'V = \\dfrac{5\\,D}{S}',
      vars: {
        V: { name: 'volume to measure', q: false, unit: 'mL' },
        D: { name: 'dose (hypothetical)', q: false, unit: 'mg', value: 90 },
        S: { name: 'strength of the liquid', q: false, unit: 'mg/5 mL', value: 125 }
      },
      note: 'Strengths of oral liquids are often labelled per 5 mL. Illustration only: real doses follow the product information and an independent check.',
      stories: {
        V: 'A hypothetical dose of {D} is to be given from a liquid labelled {S}. What volume is measured?',
        D: 'A child is given {V} of a liquid labelled {S}. What dose is that?'
      }
    }
  ],
  examples: [
    {
      title: 'How much cosolvent?',
      q: 'A hypothetical drug dissolves in water to 0.02 mg/mL; propylene glycol has σ = 2.5 for it. What fraction of propylene glycol would dissolve 1 mg/mL?',
      steps: [
        '$\\log 1 = \\log 0.02 + 2.5 f$, so $f = (0 + 1.699)/2.5 = 0.68$.',
        'That is 68 % propylene glycol — far too much for a children\'s medicine, and the drug would precipitate on dilution in the stomach.',
        'The formulator would look instead at a salt or pH adjustment, a cyclodextrin, or a suspension.'
      ],
      a: 'About 68 % propylene glycol — impractical, so another approach is needed.'
    },
    {
      title: 'mg per 5 mL',
      q: 'A prescription is for a hypothetical dose of 150 mg; the liquid is labelled 250 mg/5 mL. What volume is measured, and what happens if someone reads the label as 250 mg per mL?',
      steps: [
        '$V = 5 \\times 150/250 = 3.0$ mL.',
        'Misread as 250 mg/mL, they would measure $150/250 = 0.6$ mL — one fifth of the dose.',
        'Reading the strength aloud with its units, and checking with a second person, is how such errors are caught.'
      ],
      a: '3.0 mL; a misread label would give 0.6 mL, a fivefold underdose.'
    }
  ],
  quiz: [
    { q: 'Why does concentrated simple syrup resist microbial growth?', choices: ['sucrose is an antibiotic', 'so little free water is left that microbes cannot grow', 'it is acidic', 'it contains ethanol'], a: 1, why: 'At 85 % w/v sucrose the water activity is too low for most microbes; diluted syrups lose this protection.' },
    { q: 'Simple syrup is 85 % w/v sucrose with a density of 1.313 g/mL. What is its strength in % w/w?', answer: 64.7, unit: '% w/w', why: '85 g per 100 mL weighs 131.3 g, so 85/1.313 = 64.7 % w/w.' },
    { q: 'A drug dissolved with a cosolvent always stays in solution after it is swallowed.', a: false, why: 'Dilution with gastric fluid lowers the cosolvent fraction, and solubility falls exponentially with it: the drug may precipitate.' },
    { q: 'What distinguishes an elixir from a syrup?', choices: ['an elixir is always a suspension', 'an elixir contains ethanol as a cosolvent', 'an elixir is sugar-free', 'an elixir is for external use'], a: 1, why: 'Elixirs are clear, sweetened hydro-alcoholic solutions; syrups are concentrated sugar or polyol solutions.' },
    { q: 'Which is an advantage of an oral solution over a tablet of the same drug?', choices: ['longer shelf life', 'no dissolution step before absorption and flexible dosing', 'better taste masking', 'more accurate dosing by patients'], a: 1, why: 'A dissolved drug is ready to be absorbed and the dose can be adjusted by volume. Solutions usually have shorter shelf lives, taste worse and are more prone to measuring errors.' }
  ],
  problems: [
    { q: 'A hypothetical oral liquid is labelled 125 mg/5 mL. What volume contains 90 mg?', answer: 3.6, unit: 'mL', tol: 0.02, steps: ['$V = 5 \\times 90/125 = 3.6$ mL.'] }
  ],
  applications: [
    'Medicines for babies, children, people who cannot swallow tablets and patients with feeding tubes.',
    'Antibiotic powders reconstituted by the pharmacist with a short in-use shelf life.',
    'Sugar-free formulations for long-term use in children and people with diabetes.',
    'Oral syringes and clear labelling to prevent measuring errors.'
  ],
  history: 'Syrups entered European pharmacy from medieval Arabic medicine — the word comes from the Arabic sharāb, a drink — and elixirs (from al-iksīr) were popular vehicles in the nineteenth century. In 1937 an "elixir" of sulfanilamide dissolved in diethylene glycol killed more than 100 people in the United States; the tragedy led to the 1938 Federal Food, Drug, and Cosmetic Act, which first required proof of safety before a medicine could be sold.'
},

{
  id: 'suspensions', parent: 'liquids-topic', title: 'Suspensions', level: 2,
  short: 'A suspension carries undissolved drug particles in a liquid — the answer for insoluble, unstable or bitter drugs. Stokes\' law says how fast they settle; small particles, a dense, shear-thinning vehicle and controlled flocculation keep the dose uniform and let what settles be shaken back up.',
  keywords: ['suspension', 'Stokes\' law', 'sedimentation', 'settling velocity', 'flocculation', 'deflocculation', 'caking', 'sedimentation volume', 'degree of flocculation', 'suspending agent', 'structured vehicle', 'redispersibility', 'Ostwald ripening', 'zeta potential'],
  prereq: ['particle-size', 'colloids', 'physics:drag-force'],
  related: ['rheology', 'emulsions', 'oral-solutions', 'shelf-life', 'surfactants', 'depot-implants', 'ophthalmic'],
  body: `
A suspension is a solid drug dispersed, not dissolved, in a liquid — usually water. It is the answer when a drug is too insoluble to dissolve at the dose, too unstable in solution, or too bitter to take dissolved: what does not dissolve the tongue cannot taste, and water attacks only the small dissolved fraction. Oral antibiotic mixtures, antacids, many children's medicines, steroid eye drops and long-acting injections are suspensions. Their enemy is gravity.

### Stokes' law
A particle denser than its vehicle sinks, speeding up until the drag balances its weight. For a small sphere the terminal velocity is

$$v = \\frac{d^2\\,(\\rho_p - \\rho_f)\\,g}{18\\,\\eta}$$

(George Stokes, 1851). Every term is a lever: the velocity grows with the *square* of the diameter, in proportion to the density difference, and falls in proportion to the viscosity.

| Particle and vehicle | Settling velocity | Time to fall 10 cm |
|---|---|---|
| 10 µm, Δρ = 0.3 g/cm³, water (1 mPa·s) | 16 µm/s (5.9 cm/h) | 1.7 h |
| 5 µm, same | 4.1 µm/s | 7 h |
| 10 µm, vehicle of 100 mPa·s | 0.16 µm/s | 7 days |
| 10 µm, Δρ = 0.1 g/cm³, 100 mPa·s | 0.05 µm/s | 3 weeks |

So formulators keep particles small ([[particle-size]]), raise the density of the vehicle (sorbitol, sucrose, glycerol) and, above all, raise its viscosity with shear-thinning polymers — cellulose ethers, xanthan gum, carbomers, microcrystalline cellulose with carmellose — which are thick at rest and thin when shaken ([[rheology]]). Stokes' law holds exactly only for dilute, separate spheres: in concentrated suspensions the particles hinder one another and settle more slowly, and below about 1 µm Brownian motion competes with gravity ([[colloids]]).

### Flocculated or deflocculated?
Slowing sedimentation is only half the task: when particles do settle, they must come back up with gentle shaking. Here there is a genuine trade-off.

- In a **deflocculated** suspension the particles repel one another and settle one by one. It looks elegant — the liquid stays evenly cloudy for a long time — but the particles slide past each other into a dense, close-packed sediment that, pressed by the weight above, can bond into a hard **cake** no amount of shaking will break. A caked suspension delivers the wrong dose.
- In a **flocculated** suspension the particles cling loosely together in flocs, held in the shallow secondary energy minimum or bridged by polymer. Flocs are big and settle quickly, with a sharp boundary and clear liquid above, but they trap liquid and form a loose, voluminous sediment that one shake redisperses.

The measure is the **sedimentation volume** $F = V_u/V_0$, the final volume of the sediment over the original volume of the suspension. Deflocculated suspensions reach low values; well-flocculated ones 0.5 to 1 — the best stay at $F = 1$, their flocs forming a loose network that fills the whole bottle. The **degree of flocculation** $\\beta = F/F_\\infty$ compares a flocculated suspension with the same one deflocculated.

### Controlled flocculation
The usual answer combines both ideas: a wetting agent to disperse the hydrophobic powder ([[surfactants]]); an electrolyte, surfactant or polymer to form loose flocs; and a shear-thinning polymer to hold them up. Electrolytes act through the zeta potential: ions of opposite charge reduce it towards zero, and near a small value the particles flocculate; too much reverses the charge and deflocculates them again.

### Keeping the dose right
Every suspension is labelled "shake well", because each dose is drawn from whatever is uniform at that moment. Quality tests check redispersibility, sedimentation volume, viscosity, the uniformity of withdrawn doses and particle growth by **Ostwald ripening**, in which small crystals dissolve and large ones grow. Chemically, suspensions often degrade by an apparent zero-order reaction, because only the small dissolved fraction reacts ([[shelf-life]]).

> [!key] Stokes' law: $v = d^2\\Delta\\rho\\,g/18\\eta$. Small particles, a matched density and a shear-thinning vehicle slow settling; controlled flocculation makes whatever settles loose enough to redisperse with one shake.
`,
  ideas: [
    'Suspensions suit insoluble, unstable or bitter drugs; their problem is settling.',
    'Stokes\' law: settling velocity grows with the square of the particle diameter and the density difference, and falls with viscosity.',
    'Deflocculated suspensions settle slowly but can form a hard cake; flocculated ones settle fast into a loose, easily redispersed sediment.',
    'Sedimentation volume F = Vu/V0 (ideally close to 1) and the degree of flocculation β = F/F∞ measure the result.',
    'Controlled flocculation in a shear-thinning structured vehicle combines slow settling with easy redispersion.'
  ],
  pitfalls: [
    'The suspension that stays cloudy longest is the best — A deflocculated suspension settles slowly but can cake irreversibly; a flocculated one clears quickly yet redisperses with one shake and gives the right dose.',
    'Halving the particle size halves the settling rate — Velocity depends on the square of the diameter: halving the size makes particles settle four times more slowly.',
    'More electrolyte always means more flocculation — Near zero zeta potential particles flocculate; excess ions of opposite charge reverse the zeta potential and deflocculate them again.'
  ],
  formulas: [
    {
      name: 'Stokes\' law',
      expr: 'v = d^2*(rhop - rhof)*g/(18*eta)', tex: 'v = \\dfrac{d^2\\,(\\rho_p - \\rho_f)\\,g}{18\\,\\eta}',
      vars: {
        v: { name: 'settling velocity', q: 'speed', unit: 'µm/s' },
        d: { name: 'particle diameter', q: 'length', unit: 'µm', value: 10 },
        rhop: { name: 'density of the particles', q: 'density', unit: 'g/cm³', value: 1.3, tex: '\\rho_p' },
        rhof: { name: 'density of the vehicle', q: 'density', unit: 'g/cm³', value: 1.0, tex: '\\rho_f' },
        g: { const: 'g' },
        eta: { name: 'viscosity of the vehicle', q: 'viscosity', unit: 'mPa·s', value: 1 }
      },
      note: 'Dilute, separate spheres at low Reynolds number. For a shear-thinning vehicle use its viscosity at very low shear rates.',
      practice: { unknowns: ['v', 'd', 'eta'] },
      stories: {
        v: 'Particles of {d} and density {rhop} settle in a vehicle of density {rhof} and viscosity {eta}. How fast do they fall?',
        d: 'Particles of density {rhop} must settle no faster than {v} in a vehicle of density {rhof} and viscosity {eta}. What is the largest particle size allowed?',
        eta: 'What vehicle viscosity keeps {d} particles (density {rhop}, vehicle {rhof}) settling at only {v}?'
      }
    },
    {
      name: 'Sedimentation volume',
      expr: 'F = Vu/V0', tex: 'F = \\dfrac{V_u}{V_0}',
      vars: {
        F: { name: 'sedimentation volume' },
        Vu: { name: 'final volume of the sediment', q: 'volume', unit: 'mL', value: 60, tex: 'V_u' },
        V0: { name: 'original volume of the suspension', q: 'volume', unit: 'mL', value: 100, tex: 'V_0' }
      },
      note: 'Measured in a graduated cylinder after the suspension has settled. F = 1 means no visible sediment boundary.',
      stories: { F: 'A {V0} suspension settles to a sediment of {Vu}. What is its sedimentation volume?' }
    },
    {
      name: 'Degree of flocculation',
      expr: 'beta = F/Finf', tex: '\\beta = \\dfrac{F}{F_\\infty}',
      vars: {
        beta: { name: 'degree of flocculation' },
        F: { name: 'sedimentation volume of the flocculated suspension', value: 0.6 },
        Finf: { name: 'sedimentation volume of the same suspension deflocculated', value: 0.12, tex: 'F_\\infty' }
      },
      stories: { beta: 'A suspension settles to F = {F} when flocculated and F = {Finf} when deflocculated. What is its degree of flocculation?' }
    }
  ],
  examples: [
    {
      title: 'Slowing a suspension down',
      q: 'A hypothetical drug powder (20 µm, density 1.4 g/cm³) settles in water (1.0 g/cm³, 1 mPa·s). How fast? The formulator mills it to 5 µm and uses a vehicle of density 1.3 g/cm³ and low-shear viscosity 50 mPa·s. How fast now?',
      steps: [
        'In water: $v = (20\\times10^{-6})^2 \\times 400 \\times 9.81/(18 \\times 10^{-3}) = 8.7\\times10^{-5}$ m/s = 87 µm/s, about 31 cm per hour.',
        'Milling to 5 µm divides it by 16, the density match (Δρ from 0.4 to 0.1 g/cm³) by 4, and the viscosity by 50: in all by 3200.',
        'New velocity: 0.027 µm/s — it would take about 43 days to fall 10 cm.'
      ],
      a: 'From 87 µm/s to about 0.027 µm/s, a 3200-fold slowdown.'
    },
    {
      title: 'Measuring flocculation',
      q: 'In 100 mL cylinders a deflocculated suspension settles to 12 mL of sediment; the same suspension with an added electrolyte settles to 60 mL. Compare them.',
      steps: [
        '$F_\\infty = 12/100 = 0.12$; $F = 60/100 = 0.60$.',
        '$\\beta = 0.60/0.12 = 5$: the flocculated sediment holds five times the volume.',
        'The dense 12 mL sediment risks caking; the loose 60 mL sediment redisperses on shaking.'
      ],
      a: 'F = 0.12 against 0.60, degree of flocculation 5.'
    }
  ],
  quiz: [
    { q: 'Halving the particle diameter changes the Stokes settling velocity by a factor of…', choices: ['1/2', '1/4', '1/8', '2'], a: 1, why: 'v ∝ d²: half the diameter, a quarter of the velocity.' },
    { q: 'Which describes a flocculated suspension?', choices: ['slow settling, cloudy supernatant, hard cake', 'rapid settling, clear supernatant, loose sediment that redisperses easily', 'no settling at all, ever', 'particles dissolve and recrystallise'], a: 1, why: 'Flocs are large, so they settle quickly with a sharp boundary, but they trap liquid and form a voluminous, easily redispersed sediment.' },
    { q: 'What is the Stokes velocity (µm/s) of a 4 µm particle with a density difference of 0.5 g/cm³ in water (1 mPa·s)?', answer: 4.36, unit: 'µm/s', why: '(4 × 10⁻⁶)² × 500 × 9.81/(18 × 10⁻³) = 4.36 × 10⁻⁶ m/s.' },
    { q: 'The suspension that stays uniformly cloudy longest is always the better product.', a: false, why: 'Deflocculated suspensions stay cloudy longest but may form a cake that will not redisperse, so the doses become wrong.' },
    { q: 'Why is a shear-thinning suspending agent better than simply a very viscous Newtonian liquid?', choices: ['it is cheaper', 'it is thick at the tiny shear rates of settling but thin when shaken and poured', 'it makes particles smaller', 'it raises the density of the vehicle'], a: 1, why: 'Settling happens at shear rates below 0.01 1/s, where the apparent viscosity is high; pouring and shaking are at 10–100 1/s, where it is low.' }
  ],
  problems: [
    { q: 'A 250 mL suspension settles to a 200 mL sediment. What is its sedimentation volume F?', answer: 0.8, tol: 0.02, steps: ['$F = 200/250 = 0.8$.'] },
    { q: 'What vehicle viscosity (mPa·s) keeps 10 µm particles with a density difference of 0.2 g/cm³ settling at 0.1 µm/s?', answer: 109, unit: 'mPa·s', tol: 0.02, steps: ['$\\eta = d^2\\Delta\\rho g/(18 v) = (10^{-5})^2 \\times 200 \\times 9.81/(18 \\times 10^{-7})$.', '$= 1.962\\times10^{-7}/1.8\\times10^{-6} = 0.109$ Pa·s = 109 mPa·s.'] }
  ],
  applications: [
    'See how particle size and viscosity set the settling speed in [the Stokes calculator](#/tools/formulation/emulsion).',
    'Oral antibiotic and antacid mixtures, and children\'s medicines of insoluble or bitter drugs.',
    'Steroid eye drops and ear drops that must be shaken before each dose.',
    'Long-acting injectable suspensions that release drug for weeks to months.',
    'Dry powders for suspension, reconstituted before dispensing to avoid degradation in water.'
  ],
  history: 'George Gabriel Stokes derived the drag on a slowly moving sphere in 1851, in a paper on the motion of pendulums. Controlled flocculation of pharmaceutical suspensions was worked out from the 1950s onward; studies such as Haines and Martin\'s (1961) linked caking to the zeta potential and showed how electrolytes could prevent it.',
  sim: 'disp-stokes'
},

{
  id: 'emulsions', parent: 'liquids-topic', title: 'Emulsions', level: 2,
  short: 'An emulsion disperses one liquid in another — oil in water or water in oil — held together by an emulsifier. Bancroft\'s rule and the HLB decide the type, the oil\'s required HLB sets the emulsifier blend, and small droplets in a viscous continuous phase slow creaming; coalescence and cracking cannot be undone.',
  keywords: ['emulsion', 'oil-in-water', 'water-in-oil', 'emulsifier', 'Bancroft\'s rule', 'required HLB', 'creaming', 'coalescence', 'cracking', 'phase inversion', 'Ostwald ripening', 'Pickering emulsion', 'microemulsion', 'homogenisation', 'Laplace pressure', 'lipid emulsion'],
  prereq: ['surfactants', 'colloids', 'suspensions'],
  related: ['ointments-creams', 'rheology', 'preservatives', 'parenteral-routes', 'nanomedicine', 'lipid-nanoparticles', 'oral-solutions'],
  body: `
Oil and water do not mix: shaken together they form droplets that run back into two layers within minutes, because every square metre of oil–water interface costs energy — about 50 mN/m for a pure hydrocarbon against water. An **emulsion** is a dispersion of one liquid in another made to last by an **emulsifier**, which lowers that interfacial tension and builds a protective film around each droplet. Pharmacy uses emulsions to give oily drugs and nutrients by mouth or into a vein, and as creams and lotions for the skin ([[ointments-creams]]).

### Oil-in-water or water-in-oil?
- **Oil-in-water (o/w)**: oil droplets in water. Feels light, washes off, dilutes with water and conducts electricity. Oral emulsions, intravenous lipid emulsions, most lotions and "vanishing" creams.
- **Water-in-oil (w/o)**: water droplets in oil. Greasy, occlusive, not washable, dilutes with oil. Cold creams and many emollient and barrier creams.
- **Multiple emulsions** (w/o/w, o/w/o) and **microemulsions** — clear, thermodynamically stable dispersions with droplets below about 100 nm, made with a lot of surfactant — serve special delivery problems.

The emulsifier decides the type. **Bancroft's rule**: the phase in which the emulsifier is more soluble becomes the continuous phase, so water-soluble, high-HLB surfactants give o/w and oil-soluble, low-HLB ones give w/o ([[surfactants]]). Simple tests tell them apart: an o/w emulsion mixes with water, takes up a water-soluble dye evenly and conducts current.

### Choosing the emulsifier: required HLB
Each oil has a **required HLB** — the HLB of the emulsifier blend that gives the most stable emulsion with it. Typical values for o/w emulsions:

| Oil phase | Required HLB (o/w), about |
|---|---|
| lanolin (anhydrous) | 10 |
| light liquid paraffin | 10.5 |
| isopropyl myristate | 11.5 |
| beeswax | 12 |
| castor oil | 14 |
| cetyl alcohol | 15 |

For w/o emulsions the required values are about 4–6. A mixed oil phase needs the weighted average, and the blend of emulsifiers is calculated the same way. A pair of surfactants — one lipophilic, one hydrophilic — usually beats a single surfactant of the same HLB, because the two pack together into a denser interfacial film.

### Three ways to protect droplets
- **Surfactant films** lower the interfacial tension and, if ionic, charge the droplets ([[colloids]]).
- **Hydrophilic colloids** — acacia, gelatin, cellulose ethers — form strong multilayer films and thicken the continuous phase.
- **Finely divided solids** wetted by both phases, such as bentonite or colloidal silica, sit at the interface as an armour (**Pickering emulsions**).

### How emulsions fail
| Process | What happens | Reversible? |
|---|---|---|
| creaming (or sedimentation) | droplets rise — oil is lighter — and crowd into a layer | yes, by shaking |
| flocculation | droplets cluster without merging | usually |
| coalescence | droplets merge into bigger ones | no |
| breaking (cracking) | a separate layer of oil appears | no |
| phase inversion | o/w turns into w/o, or back | depends |
| Ostwald ripening | small droplets dissolve and large ones grow | no |

Creaming follows Stokes' law with the density difference reversed, so small droplets and a viscous continuous phase slow it ([[suspensions]]). Making small droplets takes energy because of the **Laplace pressure** inside a droplet, $\\Delta P = 2\\gamma/r$, which grows as droplets shrink: high-pressure homogenisers force the liquid through narrow gaps to beat it. Intravenous lipid emulsions have droplets of about 0.2–0.5 µm, and pharmacopoeias limit the fraction of large ones, because fat globules above about 5 µm can lodge in the lungs' capillaries.

> [!key] Oil-in-water or water-in-oil is decided by the emulsifier (Bancroft's rule, HLB). Match the blend to the oil's required HLB, keep droplets small and the continuous phase viscous; creaming can be shaken back, coalescence and cracking cannot.
`,
  ideas: [
    'Emulsions are kinetically stabilised dispersions of one liquid in another: oil-in-water or water-in-oil.',
    'Bancroft\'s rule: the phase in which the emulsifier dissolves better becomes continuous — high HLB gives o/w, low HLB w/o.',
    'Each oil has a required HLB; the emulsifier blend is weighted to match it.',
    'Creaming (reversible) follows Stokes\' law; coalescence and cracking are irreversible.',
    'Small droplets need energy against the Laplace pressure 2γ/r — hence homogenisers.'
  ],
  pitfalls: [
    'Creaming means the emulsion has broken — Creamed droplets are still separate and redisperse on shaking; breaking (cracking) is the irreversible merging into an oil layer.',
    'The continuous phase is whichever liquid there is more of — The emulsifier decides: a w/o emulsion can contain more water than oil, as many cold creams do.',
    'Any surfactant with the right HLB will do — HLB is a starting point; the chemical type, the pairing of surfactants, the phase volume and the process all matter, so blends are tested around the calculated value.'
  ],
  formulas: [
    {
      name: 'Required HLB of a mixed oil phase',
      expr: 'HLBreq = x1*H1 + (1 - x1)*H2', tex: '\\mathrm{HLB}_{req} = x_1 H_1 + (1 - x_1)\\,H_2',
      vars: {
        HLBreq: { name: 'required HLB of the oil phase', tex: '\\mathrm{HLB}_{req}' },
        x1: { name: 'weight fraction of oil 1 in the oil phase', q: 'ratio', unit: '%', value: 75, min: 0, max: 100, tex: 'x_1' },
        H1: { name: 'required HLB of oil 1', value: 10.5, tex: 'H_1' },
        H2: { name: 'required HLB of oil 2', value: 15, tex: 'H_2' }
      },
      practice: { unknowns: ['HLBreq', 'x1'] },
      stories: {
        HLBreq: 'The oil phase is {x1} of an oil needing HLB {H1} and the rest of one needing HLB {H2}. What HLB does the blend require?',
        x1: 'What proportion of an oil needing HLB {H1}, mixed with one needing {H2}, gives an oil phase requiring HLB {HLBreq}?'
      }
    },
    {
      name: 'Creaming velocity of oil droplets',
      expr: 'v = d^2*(rhoc - rhod)*g/(18*eta)', tex: 'v = \\dfrac{d^2\\,(\\rho_c - \\rho_d)\\,g}{18\\,\\eta}',
      vars: {
        v: { name: 'rising (creaming) velocity', q: 'speed', unit: 'µm/s' },
        d: { name: 'droplet diameter', q: 'length', unit: 'µm', value: 5 },
        rhoc: { name: 'density of the continuous phase (water)', q: 'density', unit: 'g/cm³', value: 1.0, tex: '\\rho_c' },
        rhod: { name: 'density of the oil droplets', q: 'density', unit: 'g/cm³', value: 0.9, tex: '\\rho_d' },
        g: { const: 'g' },
        eta: { name: 'viscosity of the continuous phase', q: 'viscosity', unit: 'mPa·s', value: 1 }
      },
      note: 'Stokes\' law for droplets lighter than the continuous phase; dilute emulsions only.',
      practice: { unknowns: ['v', 'd'] },
      stories: {
        v: 'Oil droplets of {d} (density {rhod}) cream in water ({rhoc}, {eta}). How fast do they rise?',
        d: 'To keep creaming below {v} in water ({rhoc}, {eta}) with oil of density {rhod}, how small must the droplets be?'
      }
    },
    {
      name: 'Laplace pressure inside a droplet',
      expr: 'dP = 2*gamma/r', tex: '\\Delta P = \\dfrac{2\\gamma}{r}',
      vars: {
        dP: { name: 'pressure excess inside the droplet', q: 'pressure', unit: 'kPa', tex: '\\Delta P' },
        gamma: { name: 'interfacial tension', q: 'surfacetension', unit: 'mN/m', value: 5 },
        r: { name: 'droplet radius', q: 'length', unit: 'µm', value: 0.25 }
      },
      stories: {
        dP: 'What is the Laplace pressure in a droplet of radius {r} with an interfacial tension of {gamma}?',
        r: 'With an interfacial tension of {gamma}, a homogeniser can overcome {dP}. What is the smallest droplet radius it can make?'
      }
    }
  ],
  examples: [
    {
      title: 'Designing an emulsifier blend',
      q: 'An o/w cream has an oil phase of 15 g light liquid paraffin (required HLB 10.5) and 5 g cetyl alcohol (15). How should 3 g of emulsifier be split between polysorbate 80 (HLB 15.0) and sorbitan monostearate (4.7)?',
      steps: [
        'Required HLB: $0.75 \\times 10.5 + 0.25 \\times 15 = 11.6$.',
        'Fraction of polysorbate 80: $(11.6 - 4.7)/(15.0 - 4.7) = 0.67$.',
        'Polysorbate 80: $0.67 \\times 3 = 2.0$ g; sorbitan monostearate: 1.0 g — a starting point to test with blends a unit or two either side.'
      ],
      a: 'About 2.0 g polysorbate 80 and 1.0 g sorbitan monostearate (HLB 11.6).'
    },
    {
      title: 'What homogenising buys',
      q: 'Oil droplets (0.9 g/cm³) cream in water (1.0 g/cm³, 1 mPa·s). Compare 5 µm droplets with 0.5 µm droplets after homogenising.',
      steps: [
        '5 µm: $v = (5\\times10^{-6})^2 \\times 100 \\times 9.81/(18\\times10^{-3}) = 1.36\\times10^{-6}$ m/s — about 12 cm a day.',
        '0.5 µm: a hundred times slower, $1.4\\times10^{-8}$ m/s — about 1.2 mm a day.',
        'Thickening the water phase tenfold would slow both another ten times.'
      ],
      a: 'About 12 cm per day against 1.2 mm per day: a hundredfold slower creaming.'
    }
  ],
  quiz: [
    { q: 'By Bancroft\'s rule, an emulsifier that dissolves better in water gives…', choices: ['a water-in-oil emulsion', 'an oil-in-water emulsion', 'a multiple emulsion', 'no emulsion'], a: 1, why: 'The phase in which the emulsifier is more soluble becomes the continuous phase: water-soluble (high-HLB) emulsifiers give o/w.' },
    { q: 'Which change cannot be reversed by shaking?', choices: ['creaming', 'loose flocculation', 'coalescence', 'sedimentation of droplets'], a: 2, why: 'Coalesced droplets have merged; only re-homogenising can split them again. Creaming and loose flocs redisperse.' },
    { q: 'An oil phase is 60 % isopropyl myristate (required HLB 11.5) and 40 % castor oil (14). What HLB does it require?', answer: 12.5, why: '0.6 × 11.5 + 0.4 × 14 = 6.9 + 5.6 = 12.5.' },
    { q: 'Creaming means the emulsion has broken irreversibly.', a: false, why: 'Creamed droplets are concentrated but still separate; gentle shaking redistributes them. Breaking is the merging into a separate oil layer.' },
    { q: 'Which observation shows an emulsion is oil-in-water?', choices: ['it mixes readily with oil', 'it conducts electricity', 'a water-soluble dye stays in droplets', 'it feels greasy and resists washing'], a: 1, why: 'Water as the continuous phase conducts current and takes a water-soluble dye throughout; w/o emulsions do not.' }
  ],
  problems: [
    { q: 'What is the Laplace pressure (kPa) inside a droplet of radius 0.1 µm with an interfacial tension of 10 mN/m?', answer: 200, unit: 'kPa', tol: 0.02, steps: ['$\\Delta P = 2 \\times 0.010/(0.1\\times10^{-6}) = 2\\times10^5$ Pa = 200 kPa.'] }
  ],
  applications: [
    'Blend emulsifiers to the HLB an oil needs, and see how fast droplets cream, in [the HLB and Stokes calculator](#/tools/formulation/emulsion).',
    'Oral emulsions of oily drugs and vitamins, and liquid paraffin as a laxative.',
    'Intravenous lipid emulsions for parenteral nutrition and as carriers for lipophilic drugs such as the anaesthetic propofol.',
    'Creams and lotions: o/w for washable, cooling products; w/o for emollients.',
    'Self-emulsifying drug delivery systems that form fine emulsions in the gut.'
  ],
  history: 'Spencer Pickering described emulsions stabilised by fine solid particles in 1907, after Walter Ramsden in 1903, and Wilder Bancroft stated his rule in 1913. Intravenous lipid emulsions of soybean oil and egg phospholipids, developed in Sweden by Arvid Wretlind and colleagues, came into use in the early 1960s and made complete intravenous nutrition possible.',
  sim: 'disp-hlb'
},

{
  id: 'preservatives', parent: 'liquids-topic', title: 'Preservation of liquid medicines', level: 2,
  short: 'Multi-dose aqueous medicines — syrups, creams, eye drops — are contaminated each time they are opened, so they contain preservatives. Weak-acid preservatives work only un-ionised, at low pH; oils, surfactants and plastics steal them; a pharmacopoeial challenge test proves that what remains kills enough microbes, fast enough.',
  keywords: ['preservative', 'antimicrobial preservative', 'parabens', 'benzoic acid', 'sorbic acid', 'benzalkonium chloride', 'chlorocresol', 'benzyl alcohol', 'phenoxyethanol', 'preservative efficacy test', 'challenge test', 'log reduction', 'water activity', 'multi-dose', 'in-use shelf life'],
  prereq: ['ionisation-pka', 'partition-logp', 'biology:bacterial-growth'],
  related: ['oral-solutions', 'emulsions', 'ophthalmic', 'ointments-creams', 'gmp', 'antimicrobials', 'sterility-assurance'],
  body: `
Water, sugar and a warm bathroom shelf are what bacteria and moulds like best. A multi-dose bottle of syrup, a jar of cream or a bottle of eye drops is opened again and again, each time with a spoon, a finger or a dropper tip that can bring microbes in. Unless the product itself stops them, it can be contaminated within days — spoiled, degraded, or dangerous: contaminated eye drops and creams have caused serious infections. Preservatives protect the patient against contamination introduced *during use*; they are no substitute for clean manufacture ([[gmp]]).

### What needs preserving
- **Needs a preservative**: multi-dose aqueous products — oral liquids, creams and gels containing water, eye and nasal drops, multi-dose injections.
- **Usually needs none**: dry forms (tablets, powders), water-free ointments, and single-dose sterile products (ampoules, unit-dose eye drops). Injections into the spine, the eye or in large volumes are preservative-free, because the preservatives themselves can harm there.

### The main preservatives
| Preservative | Typical concentration | Notes |
|---|---|---|
| benzoic acid, sodium benzoate | 0.1–0.2 % | active only as the un-ionised acid, so below about pH 5 |
| sorbic acid, potassium sorbate | 0.05–0.2 % | also acid-dependent; good against moulds |
| parabens (methyl, propyl) | 0.01–0.3 %, often as a pair | wide pH range; bind to non-ionic surfactants and partition into oils |
| benzalkonium chloride | 0.004–0.02 % | the usual eye-drop preservative; can damage the eye surface with long use |
| chlorhexidine, cetrimide | about 0.01 % | cationic, also antiseptic |
| phenoxyethanol, benzyl alcohol, chlorocresol | 0.5–1 %, 0.9 %, 0.1 % | creams, injections; benzyl alcohol is avoided in newborns |
| ethanol, propylene glycol | above about 15–20 % | preserve only at high concentration |

(Typical ranges; each product's choice is justified by testing.)

### The pH trap
Weak-acid preservatives work only as the un-ionised acid, which crosses the microbe's membrane. The un-ionised fraction is

$$f_{un} = \\frac{1}{1 + 10^{\\,\\mathrm{pH} - \\mathrm{p}K_a}}$$

For benzoic acid ($\\mathrm{p}K_a$ 4.2) that is 61 % at pH 4, 6 % at pH 5.4 and under 2 % at pH 6 ([[ionisation-pka]]). A syrup buffered at pH 6.5 with sodium benzoate may look preserved on paper and not be.

### Where the preservative goes
Only preservative free in the water phase acts. In an emulsion a lipophilic preservative partitions into the oil: with an oil-to-water volume ratio $\\phi$ and an oil/water partition coefficient $K$, the free aqueous concentration is $C_w = C(1+\\phi)/(1+K\\phi)$. Non-ionic surfactants bind parabens in their micelles, plastic containers and rubber closures absorb them, and some drugs and excipients inactivate them. The formulator must measure what is left, not what was added.

### Proving it works
The pharmacopoeias require a **preservative efficacy (challenge) test** (Ph. Eur. 5.1.3; USP <51>): the product is inoculated with about $10^5$–$10^6$ organisms per millilitre or gram of standard bacteria, a yeast and a mould, and the counts are followed for 28 days. It passes if the counts fall by set **log reductions** by set times — for eye drops and injections under the European criteria, for example, bacteria by 2 logs (99 %) within 6 hours and 3 logs within 24 hours, with no recovery afterwards. Oral liquids have gentler criteria.

> [!warn] Contaminated medicines can cause serious infections, especially in the eye. Use multi-dose products only within the in-use period on the label, do not let dropper tips touch the eye or skin, and never share eye drops. A painful red eye while using drops needs prompt medical advice.
`,
  ideas: [
    'Preservatives protect multi-dose aqueous products against contamination during use; they do not replace clean manufacture.',
    'Weak-acid preservatives (benzoic, sorbic) act only un-ionised, so they need a low pH.',
    'Oils, micelles, plastics and some ingredients take up preservatives; only the free aqueous fraction counts.',
    'A pharmacopoeial challenge test measures log reductions of inoculated microbes over 28 days.',
    'Single-dose sterile products, and injections into the spine or eye, are preservative-free.'
  ],
  pitfalls: [
    'A preservative makes up for poor hygiene in manufacture — Products must be made clean under GMP; preservatives only cope with the modest contamination of repeated use.',
    'Sodium benzoate preserves at any pH — Only the un-ionised benzoic acid acts; above about pH 5 little of it remains.',
    'The amount of preservative added is the amount that works — Partitioning into oil, binding to micelles and uptake by containers can leave only a fraction free in the water phase.'
  ],
  formulas: [
    {
      name: 'Un-ionised fraction of a weak-acid preservative',
      expr: 'fu = 1/(1 + 10^(pH - pKa))', tex: 'f_{un} = \\dfrac{1}{1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}}',
      vars: {
        fu: { name: 'fraction un-ionised (active)', q: 'ratio', unit: '%', tex: 'f_{un}' },
        pH: { name: 'pH of the product', value: 5, min: 0, max: 14, tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the preservative acid', value: 4.2, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'Benzoic acid pKa 4.2, sorbic acid 4.8. The activity of the preservative follows the un-ionised concentration.',
      practice: { unknowns: ['fu', 'pH'] },
      stories: {
        fu: 'A syrup at pH {pH} is preserved with a weak acid of pKa {pKa}. What fraction is un-ionised?',
        pH: 'At what pH is a preservative acid of pKa {pKa} {fu} un-ionised?'
      }
    },
    {
      name: 'Free preservative in the water of an emulsion',
      expr: 'Cw = C*(1 + phi)/(1 + K*phi)', tex: 'C_w = C\\,\\dfrac{1 + \\phi}{1 + K\\phi}',
      vars: {
        Cw: { name: 'concentration in the water phase', q: 'massconc', unit: 'mg/mL', tex: 'C_w' },
        C: { name: 'total concentration (on the whole emulsion)', q: 'massconc', unit: 'mg/mL', value: 1 },
        phi: { name: 'oil-to-water volume ratio', value: 0.5 },
        K: { name: 'oil/water partition coefficient of the preservative', value: 7 }
      },
      note: 'Assumes equilibrium partitioning and no binding to emulsifier micelles, which lowers the free fraction further.',
      practice: { unknowns: ['Cw', 'C'] },
      stories: {
        Cw: 'An emulsion (oil:water {phi}) contains {C} of a preservative with an oil/water partition coefficient of {K}. What is left in the water?',
        C: 'The water phase of an emulsion (oil:water {phi}) needs {Cw} of a preservative with K = {K}. What total concentration must be added?'
      }
    },
    {
      name: 'Log reduction in a challenge test',
      expr: 'LR = log(N0/N)', tex: '\\mathrm{LR} = \\log_{10}\\dfrac{N_0}{N}',
      vars: {
        LR: { name: 'log reduction', tex: '\\mathrm{LR}' },
        N0: { name: 'count at the start', q: 'numberdensity', unit: '1/mL', value: 1e6, tex: 'N_0' },
        N: { name: 'count at the sampling time', q: 'numberdensity', unit: '1/mL', value: 1000 }
      },
      note: 'Each log is a tenfold fall: 2 logs = 99 % killed, 3 logs = 99.9 %.',
      practice: { unknowns: ['LR', 'N'] },
      stories: {
        LR: 'A product inoculated with {N0} has {N} left at the sampling time. What is the log reduction?',
        N: 'A product starting at {N0} must achieve a log reduction of {LR}. What is the highest count allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'The pH trap',
      q: 'A syrup contains 0.2 % sodium benzoate. How much benzoic acid is active (un-ionised) at pH 5.5, and at pH 4.0?',
      steps: [
        'pH 5.5: $f = 1/(1 + 10^{1.3}) = 0.048$ — about 0.0095 % active acid.',
        'pH 4.0: $f = 1/(1 + 10^{-0.2}) = 0.61$ — about 0.12 % active acid, thirteen times more.',
        'The same label claim can be a strong or a failing preservative system depending on the pH; the challenge test would show which.'
      ],
      a: 'About 5 % active at pH 5.5 against 61 % at pH 4.0.'
    },
    {
      title: 'Preservative lost into the oil',
      q: 'An o/w cream (oil:water 1:2, so φ = 0.5) contains 0.1 % of a paraben-type preservative with an oil/water partition coefficient of 7. How much is free in the water, and what total is needed for 0.1 % in the water?',
      steps: [
        '$C_w = 0.1 \\times (1 + 0.5)/(1 + 7 \\times 0.5) = 0.1 \\times 1.5/4.5 = 0.033$ %.',
        'For 0.1 % in the water: $C = 0.1 \\times 4.5/1.5 = 0.3$ % total.',
        'Micelles of a non-ionic emulsifier would bind more still, so the free level is measured, not assumed.'
      ],
      a: 'Only 0.033 % stays in the water; about 0.3 % must be added.'
    },
    {
      title: 'Reading a challenge test',
      q: 'Eye drops inoculated with $1\\times10^6$ bacteria per mL show $5\\times10^3$ per mL at 6 hours and 400 per mL at 24 hours. Do they meet reductions of 2 logs at 6 h and 3 logs at 24 h?',
      steps: [
        '6 h: $\\log_{10}(10^6/5000) = \\log_{10} 200 = 2.3$ — meets 2.',
        '24 h: $\\log_{10}(10^6/400) = \\log_{10} 2500 = 3.4$ — meets 3.',
        'The product must also show no recovery at 28 days, and meet the fungal criteria.'
      ],
      a: 'Yes for the bacterial times given: 2.3 logs at 6 h and 3.4 logs at 24 h.'
    }
  ],
  quiz: [
    { q: 'Benzoic acid (pKa 4.2) is the most effective preservative at…', choices: ['pH 3.5–4.5', 'pH 6.5', 'pH 7.4', 'pH 9'], a: 0, why: 'Only the un-ionised acid acts; below its pKa most of it is un-ionised.' },
    { q: 'What percentage of benzoic acid (pKa 4.2) is un-ionised at pH 5.2?', answer: 9.09, unit: '%', why: '1/(1 + 10^(5.2 − 4.2)) = 1/11 = 9.1 %.' },
    { q: 'A generous amount of preservative can make up for poor hygiene during manufacture.', a: false, why: 'Products must be made clean under GMP. Preservatives are designed only for the limited contamination introduced during use.' },
    { q: 'A cream preserved with a paraben and emulsified with polysorbate fails its challenge test. The likeliest reason is…', choices: ['parabens are inactive against bacteria', 'the paraben is bound in polysorbate micelles and partitions into the oil, leaving too little free in the water', 'polysorbate is itself a nutrient', 'the pH is too low'], a: 1, why: 'Non-ionic micelles and the oil phase take up lipophilic preservatives; only the free aqueous fraction acts.' },
    { q: 'A 3-log reduction means that the fraction of organisms killed is…', choices: ['3 %', '30 %', '99.9 %', '99.999 %'], a: 2, why: 'Each log is a factor of ten: 10³ fewer survivors, so 99.9 % killed.' }
  ],
  problems: [
    { q: 'A challenge test starts at 2.0 × 10⁵ organisms per mL; after 14 days 150 per mL remain. What is the log reduction?', answer: 3.12, tol: 0.02, steps: ['$\\log_{10}(2.0\\times10^5/150) = \\log_{10} 1333 = 3.12$.'] }
  ],
  applications: [
    'Choosing preservative systems for syrups, creams, eye drops and multi-dose injections.',
    'Setting pH, oil content and emulsifier to keep enough preservative free and active.',
    'Setting in-use shelf lives for opened products ("discard 28 days after opening").',
    'Preservative-free unit-dose and filtered multi-dose eye-drop containers for patients who use drops long term.'
  ],
  history: 'Parabens came into use as preservatives in the 1920s. Outbreaks traced to contaminated eye drops, creams and oral liquids in the 1950s and 1960s led the pharmacopoeias to require proof that preservatives work, and challenge tests entered the United States and European pharmacopoeias from around 1970.'
},

/* ================================================================ SKIN AND OTHER ROUTES */
{
  id: 'ointments-creams', parent: 'topical-topic', title: 'Ointments, creams and gels', level: 2,
  short: 'Semisolids carry drugs onto and into the skin. The base — greasy ointment, water-in-oil or oil-in-water cream, water-soluble base, gel or paste — sets occlusion, hydration, release and acceptability; release from a suspension-type base follows Higuchi\'s square-root law, and good rheology keeps it in the jar yet spreading easily.',
  keywords: ['ointment', 'cream', 'gel', 'paste', 'semisolid', 'topical', 'base', 'occlusion', 'emollient', 'oil-in-water cream', 'water-in-oil cream', 'macrogol', 'carbomer', 'Higuchi equation', 'fingertip unit', 'release test'],
  prereq: ['emulsions', 'rheology', 'diffusion-fick'],
  related: ['transdermal', 'preservatives', 'surfactants', 'release-kinetics', 'compounding', 'medicine:burns', 'suppositories'],
  body: `
Semisolids — ointments, creams, gels and pastes — are spread onto skin or mucous membranes, usually to act there (on eczema, an infection, dry skin), sometimes to carry a drug through the skin into the body ([[transdermal]]). The base is not an inert carrier: it hydrates or dries the skin, holds the drug dissolved or suspended, controls how fast it is released, and decides whether the patient will actually use the product — a greasy ointment on a hairy arm is rarely applied twice.

### The bases
| Type | What it is | Properties | Typical uses |
|---|---|---|---|
| hydrocarbon (oleaginous) ointment | soft and liquid paraffin, waxes | very occlusive, emollient, water-free, greasy, not washable | dry, scaly skin; protective barriers |
| absorption base | hydrocarbon plus a w/o emulsifier (wool fat, cholesterol) | takes up water to form a w/o cream | emollients |
| water-in-oil cream | water droplets in oil | occlusive and emollient, less greasy than ointments | dry eczema, cold creams |
| oil-in-water cream | oil droplets in water | non-greasy, washable, cooling; needs a preservative | most medicated creams, moist lesions |
| water-soluble base | macrogols (polyethylene glycols) | washable, water-free, not occlusive | wounds, drugs unstable in water |
| gel (hydrogel) | water thickened by carbomer or cellulose ethers | clear, cooling, non-greasy | hairy areas, the face, acne |
| paste | ointment with 20–50 % powder | stiff, stays in place, absorbs exudate | barrier and protective uses |

**Occlusion** matters. A greasy film stops water evaporating from the skin and hydrates its outer layer; hydrated skin is more permeable, so the same drug is usually more potent in an ointment than in a cream — one reason topical corticosteroids are ranked by potency together with their base.

### How the drug gets out
A drug suspended in an ointment is released as dissolved drug diffuses to the skin and the particles nearest the surface dissolve to replace it. A depletion zone grows into the base, and the amount released per unit area follows **Higuchi's square-root law** (1961):

$$Q = \\sqrt{D\\,t\\,(2A - C_s)\\,C_s}$$

where $A$ is the total drug concentration and $C_s$ its solubility in the base. Release grows with $\\sqrt{t}$: four times as long releases only twice as much. A drug very soluble in the base partitions poorly into the skin; one barely soluble releases little. Formulators balance the two — sometimes with a solvent such as propylene glycol that also acts as a penetration enhancer. Laboratories compare products with in-vitro release tests in diffusion cells.

### Rheology: stay put, spread easily
A cream must hold its shape in the jar and on the skin yet spread smoothly under a finger. Semisolids are **plastic** and often **thixotropic** ([[rheology]]): a yield stress keeps them in place, and they thin when rubbed at shear rates of thousands per second. Temperature matters too: an ointment stiff in winter can run in summer heat.

### Making and using them
Creams are made by heating the oil and water phases to about 70 °C, mixing them with the emulsifier and cooling while stirring; as fatty alcohols and emulsifiers crystallise, they build a gel network around the droplets that gives the cream its body. Anything containing water needs a preservative ([[preservatives]]), and tubes protect better than jars. The **fingertip unit** — a line squeezed from a standard 5 mm nozzle along the last segment of an adult's index finger, about 0.5 g — covers roughly the area of two adult hands, which helps patients apply enough, but not too much.

> [!warn] Topical medicines are still medicines. Potent corticosteroids and other drugs can be absorbed and cause harm when used on large areas, broken skin, under occlusion (including nappies) or for long periods, especially in babies. Use them as directed by the product information, a doctor or a pharmacist.
`,
  ideas: [
    'The base is chosen for the skin condition and the patient: greasy ointments occlude, o/w creams wash off and cool, gels suit hairy skin.',
    'Occlusion hydrates the outer skin and raises drug penetration.',
    'Release from a suspension-type ointment follows Higuchi: Q = √(Dt(2A − Cs)Cs), proportional to √t.',
    'Semisolids are plastic and often thixotropic: they stay put at rest and thin when rubbed.',
    'Aqueous bases need preservatives; the fingertip unit (about 0.5 g) guides how much to apply.'
  ],
  pitfalls: [
    'The base is just a vehicle and does not affect how well the drug works — Occlusion, drug solubility in the base and penetration enhancers can change the effect of the same drug severalfold.',
    'Release from an ointment is steady, like a patch — From a simple suspension-type base it falls with time, the amount released growing with √t as a depleted layer spreads into the base.',
    'Creams and ointments are interchangeable — A cream contains water and a preservative and can sting broken skin; an ointment is greasier but occlusive and usually preservative-free. They suit different skin conditions.'
  ],
  formulas: [
    {
      name: 'Higuchi release from an ointment',
      expr: 'Q = sqrt(D*t*(2*A - Cs)*Cs)', tex: 'Q = \\sqrt{D\\,t\\,(2A - C_s)\\,C_s}',
      vars: {
        Q: { name: 'amount released per unit area', q: false, unit: 'mg/cm²' },
        D: { name: 'diffusion coefficient in the base', q: false, unit: 'cm²/h', value: 0.0036 },
        t: { name: 'time', q: false, unit: 'h', value: 4 },
        A: { name: 'total drug concentration in the base', q: false, unit: 'mg/cm³', value: 10 },
        Cs: { name: 'solubility of the drug in the base', q: false, unit: 'mg/cm³', value: 1, min: 0, max: 10, tex: 'C_s' }
      },
      solveFor: 'Q',
      note: 'Drug suspended in a thick layer of base, A well above Cs, perfect sink at the surface. 10⁻⁶ cm²/s = 0.0036 cm²/h; 1 % w/w in a base of density about 1 g/cm³ is 10 mg/cm³.',
      practice: { unknowns: ['Q', 't', 'A'] },
      stories: {
        Q: 'A drug at {A} is suspended in an ointment in which it dissolves to {Cs} and diffuses with D = {D}. How much is released per cm² in {t}?',
        t: 'How long does an ointment ({A} of drug, solubility {Cs}, D = {D}) take to release {Q}?'
      }
    },
    {
      name: 'Strength after diluting with base',
      expr: 'C2 = C1*m1/(m1 + mb)', tex: 'C_2 = \\dfrac{C_1\\, m_1}{m_1 + m_b}',
      vars: {
        C2: { name: 'strength of the diluted product', q: false, unit: '% w/w', tex: 'C_2' },
        C1: { name: 'strength of the original', q: false, unit: '% w/w', value: 0.1, tex: 'C_1' },
        m1: { name: 'mass of the original', q: false, unit: 'g', value: 25, tex: 'm_1' },
        mb: { name: 'mass of base added', q: false, unit: 'g', value: 75, tex: 'm_b' }
      },
      note: 'Hypothetical example. Diluting creams can upset their stability and preservation; it is done only on a prescriber\'s instruction, with a compatible base, following local procedures.',
      practice: { unknowns: ['C2', 'mb'] },
      stories: {
        C2: 'A {C1} cream ({m1}) is mixed with {mb} of compatible base. What is the new strength?',
        mb: 'How much base must be added to {m1} of a {C1} cream to reach {C2}?'
      }
    }
  ],
  examples: [
    {
      title: 'Release in a diffusion cell',
      q: 'In an in-vitro release test, a 1 % suspension ointment ($A$ = 10 mg/cm³) has a drug solubility in the base of 0.5 mg/cm³ and $D = 2\\times10^{-7}$ cm²/s. How much is released per cm² in 1 hour and in 4 hours?',
      steps: [
        '$D = 2\\times10^{-7} \\times 3600 = 7.2\\times10^{-4}$ cm²/h.',
        '1 h: $Q = \\sqrt{7.2\\times10^{-4} \\times 1 \\times 19.5 \\times 0.5} = \\sqrt{7.0\\times10^{-3}} = 0.084$ mg/cm².',
        '4 h: $Q = 0.168$ mg/cm² — twice as much in four times as long.'
      ],
      a: 'About 0.084 mg/cm² in 1 h and 0.17 mg/cm² in 4 h.'
    },
    {
      title: 'Diluting a cream',
      q: 'A prescriber asks for a hypothetical 0.1 % w/w cream to be diluted "one in four" with a compatible base, as 25 g of cream with 75 g of base. What is the final strength?',
      steps: [
        '$C_2 = 0.1 \\times 25/(25 + 75) = 0.025$ % w/w.',
        'The result has a quarter of the strength — but also a quarter of the original preservative, so its shelf life is short and set locally.'
      ],
      a: '0.025 % w/w.'
    }
  ],
  quiz: [
    { q: 'Which base is the most occlusive?', choices: ['an oil-in-water cream', 'a hydrocarbon (paraffin) ointment', 'a carbomer gel', 'a macrogol base'], a: 1, why: 'A water-free film of paraffins almost stops water loss from the skin. Macrogols are water-soluble and draw water out.' },
    { q: 'By the Higuchi equation, if a release test runs four times as long, the amount released per cm²…', choices: ['is the same', 'doubles', 'quadruples', 'rises sixteenfold'], a: 1, why: 'Q ∝ √t: √4 = 2.' },
    { q: 'An ointment has D = 0.0036 cm²/h, A = 20 mg/cm³ and Cs = 2 mg/cm³. How much (mg/cm²) is released in 9 h?', answer: 1.57, unit: 'mg/cm²', why: '√(0.0036 × 9 × (40 − 2) × 2) = √2.462 = 1.57 mg/cm².' },
    { q: 'An oil-in-water cream washes off with water and needs an antimicrobial preservative.', a: true, why: 'Water is the continuous phase, so it rinses away — and water supports microbial growth, so it must be preserved.' },
    { q: 'Why are gels often chosen for hairy or oily areas of skin?', choices: ['they are the most occlusive', 'they are non-greasy, spread easily and leave little residue', 'they contain no water', 'they never need preservatives'], a: 1, why: 'Gels are clear, light and non-greasy; water-based gels still need preservatives.' }
  ],
  problems: [
    { q: 'How much base (g) must be added to 20 g of a hypothetical 0.05 % w/w cream to make it 0.01 % w/w?', answer: 80, unit: 'g', tol: 0.02, steps: ['$0.01 = 0.05 \\times 20/(20 + m_b)$, so $20 + m_b = 100$ g.', '$m_b = 80$ g.'] }
  ],
  applications: [
    'Emollients for dry skin and eczema; barrier pastes for nappy areas.',
    'Topical corticosteroids, antifungals, antibiotics and anti-acne gels.',
    'In-vitro release tests to compare generic and reference semisolids.',
    'Patient counselling with fingertip units for the right amount.'
  ],
  history: 'Ointments are among the oldest medicines; Egyptian papyri describe fat-based salves. Galen\'s cold cream of beeswax, olive oil and rose water (about AD 150) was an early water-in-oil emulsion. Soft paraffin (petrolatum) became a standard base in the 1870s, and Takeru Higuchi\'s square-root law of 1961 gave drug release from ointments its first quantitative theory.',
  sim: 'disp-rheogram'
},

{
  id: 'transdermal', parent: 'topical-topic', title: 'Transdermal delivery', level: 2,
  short: 'A patch delivers a drug through the skin into the blood at a steady rate for one to seven days, avoiding the liver\'s first pass. The stratum corneum lets through only small, moderately lipophilic, very potent drugs: flux follows Fick\'s law, J = KpCv, after a lag time h²/6D.',
  keywords: ['transdermal', 'patch', 'stratum corneum', 'skin permeation', 'permeability coefficient', 'Kp', 'flux', 'lag time', 'Potts–Guy', 'rule of 500', 'reservoir patch', 'matrix patch', 'drug-in-adhesive', 'penetration enhancer', 'microneedles', 'iontophoresis'],
  prereq: ['diffusion-fick', 'partition-logp', 'ointments-creams'],
  related: ['routes', 'first-pass', 'modified-release', 'depot-implants', 'analgesics', 'medicine:pain-relief', 'medicine:poisoning-overdose'],
  body: `
Skin is built to keep things out. Its outer layer, the **stratum corneum**, is only 10–20 µm thick — a fifth of a sheet of paper — but it is a wall of flattened dead cells (the bricks) set in layers of lipid (the mortar), and a molecule must wind its way through the lipids to get in. Most drugs cannot cross it fast enough to matter. A few can, and for them a **transdermal patch** offers what no tablet can: steady delivery for one to seven days, no first-pass metabolism in the liver ([[first-pass]]), no peaks and troughs, and a dose that stops when the patch comes off — almost.

### Fick's law through the skin
At steady state the flux through the stratum corneum follows Fick's first law ([[diffusion-fick]]):

$$J_{ss} = \\frac{D\\,K\\,C_v}{h} = K_p\\,C_v$$

where $C_v$ is the drug's concentration in the vehicle, $K$ its partition coefficient between the stratum corneum and the vehicle, $D$ its diffusion coefficient in the stratum corneum and $h$ the thickness. $K_p = DK/h$ is the **permeability coefficient**, typically $10^{-5}$ to $10^{-1}$ cm/h. Two consequences follow.

- Before steady state there is a **lag time**, $t_L = h^2/6D$, while the drug fills the membrane: for a stratum corneum of 15 µm and $D \\approx 10^{-10}$ cm²/s, about an hour — and many hours for slower drugs. Patches take time to reach effective blood levels, and the drug stored in the skin keeps flowing after removal.
- The flux is greatest when the drug is **saturated** in the vehicle, whatever the vehicle, because the real driving force is its thermodynamic activity. Supersaturated vehicles push harder still, until the drug crystallises.

### Which drugs can go through?
Drugs that work transdermally share a profile, sometimes summed up as a **rule of 500**: a molar mass below about 500 g/mol; a log P of about 1–3, lipophilic enough to enter the lipids but not so much that it stays there; a low melting point, which helps it dissolve; and, above all, **potency** — a daily dose of a few milligrams at most, because a patch of 10–40 cm² can deliver only so much. The **Potts–Guy equation** (1992) captures the first two:

$$\\log K_p = -2.7 + 0.71\\log P - 0.0061\\,M \\qquad (K_p \\text{ in cm/h})$$

| Transdermal drugs | Why they fit |
|---|---|
| glyceryl trinitrate, nicotine, hyoscine (scopolamine) | small, potent, moderately lipophilic |
| fentanyl, buprenorphine | very potent opioids, delivered in micrograms per hour |
| estradiol, testosterone, norelgestromin | hormones effective at low doses |
| rivastigmine, rotigotine, clonidine | steady levels avoid the peaks that cause side effects |

### How patches are built
- **Reservoir patches** hold the drug in a liquid or gel behind a **rate-controlling membrane**, giving nearly zero-order release.
- **Matrix patches** hold it dissolved or dispersed in a polymer; in **drug-in-adhesive** designs, now the most common, the adhesive layer itself carries the drug, and the skin controls much of the rate.

The delivery rate is simply flux × area: a 10 cm² patch with a flux of 2.5 µg/(cm²·h) delivers 25 µg/h. Patches contain much more drug than they deliver, to keep the vehicle near saturation to the end, so a used patch still holds a large residue.

### Getting more through
Chemical **penetration enhancers** (ethanol, propylene glycol, fatty acids, terpenes) disorder the lipids or improve partitioning. Physical methods — iontophoresis with a small electric current, microneedles that pierce the stratum corneum, ultrasound — open the route to larger molecules, including peptides and vaccines.

> [!warn] Heat (heating pads, hot baths, fever, strong sun) can greatly increase absorption from a patch, and a used patch can still contain enough drug to harm a child or a pet. Apply, remove and dispose of patches exactly as the product information says — used patches folded sticky sides together — and keep them away from children. Signs of overdose, for example from an opioid patch (extreme drowsiness, slow or shallow breathing), are an emergency: remove the patch and call your local emergency number or poison centre.
`,
  ideas: [
    'The stratum corneum, 10–20 µm of cells in lipid, is the main barrier to drugs entering through skin.',
    'Steady flux J = KpCv = DKCv/h, reached after a lag time h²/6D; it is greatest from a saturated vehicle.',
    'Good transdermal drugs are small (under about 500 g/mol), moderately lipophilic (log P 1–3) and very potent.',
    'Reservoir patches use a rate-controlling membrane; drug-in-adhesive matrix patches are now the commonest.',
    'Patches avoid first-pass metabolism and give steady levels, but heat raises delivery and used patches remain dangerous.'
  ],
  pitfalls: [
    'Putting more drug in a patch always increases delivery — Once the vehicle is saturated, extra drug does not raise the driving force; the excess mainly keeps the patch saturated to the end.',
    'A patch starts working as soon as it is applied — Drug must first fill the skin (the lag time) and then build up in the blood; levels rise over hours.',
    'Removing a patch stops the drug at once — Drug already dissolved in the skin keeps diffusing into the blood for hours after removal.'
  ],
  formulas: [
    {
      name: 'Steady-state flux through the skin',
      expr: 'J = Kp*Cv', tex: 'J_{ss} = K_p\\,C_v',
      vars: {
        J: { name: 'steady-state flux', q: false, unit: 'µg/(cm²·h)', tex: 'J_{ss}' },
        Kp: { name: 'permeability coefficient', q: false, unit: 'cm/h', value: 0.0005, tex: 'K_p' },
        Cv: { name: 'drug concentration in the vehicle', q: false, unit: 'µg/mL', value: 5000, tex: 'C_v' }
      },
      note: 'Kp = DK/h. 1 µg/mL = 1 µg/cm³, so cm/h × µg/mL gives µg/(cm²·h). Assumes a sink below the skin and a vehicle that stays at the same concentration.',
      stories: {
        J: 'A drug with a skin permeability coefficient of {Kp} is held at {Cv} in a patch. What is the steady flux?',
        Cv: 'What vehicle concentration gives a flux of {J} for a drug with Kp = {Kp}?'
      }
    },
    {
      name: 'Lag time across a membrane',
      expr: 'tL = h^2/(6*D)', tex: 't_L = \\dfrac{h^2}{6D}',
      vars: {
        tL: { name: 'lag time', q: 'time', unit: 'h', tex: 't_L' },
        h: { name: 'membrane (stratum corneum) thickness', q: 'length', unit: 'µm', value: 15 },
        D: { name: 'diffusion coefficient in the membrane', q: 'kinvisc', unit: 'm²/s', value: 1e-14 }
      },
      note: '10⁻¹⁴ m²/s = 10⁻¹⁰ cm²/s. The intercept on the time axis of the straight part of the cumulative amount against time.',
      stories: {
        tL: 'A drug diffuses with D = {D} through a stratum corneum {h} thick. What is the lag time?',
        D: 'A permeation study shows a lag time of {tL} through a membrane {h} thick. What is the diffusion coefficient?'
      }
    },
    {
      name: 'Delivery rate of a patch',
      expr: 'R = J*A', tex: 'R = J\\,A',
      vars: {
        R: { name: 'delivery rate', q: false, unit: 'µg/h' },
        J: { name: 'flux through the skin', q: false, unit: 'µg/(cm²·h)', value: 2.5 },
        A: { name: 'patch area', q: false, unit: 'cm²', value: 10 }
      },
      stories: {
        R: 'A patch of {A} gives a flux of {J}. What is its delivery rate?',
        A: 'A hypothetical drug crosses skin at {J}. What patch area delivers {R}?'
      }
    },
    {
      name: 'Skin permeability from size and lipophilicity (Potts–Guy)',
      expr: 'logKp = -2.7 + 0.71*logP - 0.0061*M', tex: '{\\mathrm{log}\\,K}_p = -2.7 + 0.71\\,{\\mathrm{log}\\,P}_{ow} - 0.0061\\,M',
      vars: {
        logKp: { name: 'log of the permeability coefficient (Kp in cm/h)', signed: true, tex: '{\\mathrm{log}\\,K}_p' },
        logP: { name: 'log P (octanol/water)', value: 3, signed: true, tex: '{\\mathrm{log}\\,P}_{ow}' },
        M: { name: 'molar mass', q: false, unit: 'g/mol', value: 400 }
      },
      note: 'An empirical fit to aqueous permeability data for human skin (1992); good to about a factor of ten, less reliable at extremes of log P.',
      practice: { unknowns: ['logKp', 'M'] },
      stories: {
        logKp: 'Estimate log Kp for a drug of molar mass {M} with log P = {logP}.',
        M: 'For a drug with log P = {logP}, what molar mass would give log Kp = {logKp}?'
      }
    }
  ],
  examples: [
    {
      title: 'Is a patch feasible?',
      q: 'A hypothetical drug has a molar mass of 400 g/mol, log P = 3, and dissolves to 2 mg/mL in a patch vehicle. It needs to be delivered at 25 µg/h. Estimate the patch area.',
      steps: [
        'Potts–Guy: $\\log K_p = -2.7 + 0.71 \\times 3 - 0.0061 \\times 400 = -3.01$, so $K_p = 9.8\\times10^{-4}$ cm/h.',
        'Flux from a saturated vehicle: $J = 9.8\\times10^{-4} \\times 2000 = 1.95$ µg/(cm²·h).',
        'Area: $25/1.95 = 12.8$ cm² — a practical patch. A drug needing 1 mg/h would need 500 cm²: not feasible.'
      ],
      a: 'About 13 cm² — feasible, because the drug is potent.'
    },
    {
      title: 'How long before steady state?',
      q: 'A drug diffuses through a 15 µm stratum corneum with $D = 5\\times10^{-11}$ cm²/s. What is its lag time?',
      steps: [
        '$h = 15\\times10^{-4}$ cm, so $h^2 = 2.25\\times10^{-6}$ cm².',
        '$t_L = 2.25\\times10^{-6}/(6 \\times 5\\times10^{-11}) = 7500$ s ≈ 2.1 h.',
        'Blood levels then rise further as the body accumulates drug towards its own steady state — which is why many patches take 12–24 h to reach full effect.'
      ],
      a: 'About 2 hours.'
    }
  ],
  quiz: [
    { q: 'Why does a transdermal patch avoid first-pass metabolism?', choices: ['the skin destroys the liver enzymes', 'drug absorbed through the skin enters the systemic circulation without passing through the liver first', 'patches contain enzyme inhibitors', 'the drug is inhaled from the patch'], a: 1, why: 'Skin capillaries drain into the systemic veins, not the portal vein, so the liver sees the drug only after it has circulated.' },
    { q: 'Which property matters most for a drug to be given by patch?', choices: ['high water solubility', 'high potency — a small daily dose', 'a large molar mass', 'a very high log P (above 6)'], a: 1, why: 'Skin flux is small, so only drugs needing milligrams or less a day are practical. Large, very water-soluble or very lipophilic molecules cross poorly.' },
    { q: 'A 15 cm² patch gives a flux of 1.2 µg/(cm²·h). What is its delivery rate in µg/h?', answer: 18, unit: 'µg/h', why: 'R = JA = 1.2 × 15 = 18 µg/h.' },
    { q: 'Doubling the drug loading of a patch whose vehicle is already saturated doubles the flux.', a: false, why: 'The flux depends on the drug\'s activity — its concentration up to saturation. Extra undissolved drug keeps the vehicle saturated for longer but does not raise the flux.' },
    { q: 'If the stratum corneum were twice as thick, the lag time would…', choices: ['halve', 'double', 'quadruple', 'stay the same'], a: 2, why: 't_L = h²/6D: twice the thickness gives four times the lag (and half the steady flux).' }
  ],
  problems: [
    { q: 'Estimate the skin permeability coefficient Kp (cm/h) of a drug of molar mass 150 g/mol with log P = 1.5, using Potts–Guy.', answer: 0.00282, unit: 'cm/h', tol: 0.03, steps: ['$\\log K_p = -2.7 + 0.71 \\times 1.5 - 0.0061 \\times 150 = -2.7 + 1.065 - 0.915 = -2.55$.', '$K_p = 10^{-2.55} = 2.8\\times10^{-3}$ cm/h.'] }
  ],
  applications: [
    'Patches for chronic pain, angina, smoking cessation, travel sickness, hormone therapy, Parkinson\'s and Alzheimer\'s diseases.',
    'Choosing candidate drugs by potency, size and lipophilicity before development.',
    'Franz diffusion cell studies of permeation, lag time and the effect of enhancers.',
    'Microneedle patches for vaccines and peptides.'
  ],
  history: 'The first transdermal patch, delivering hyoscine (scopolamine) for travel sickness, was approved in the United States in 1979; glyceryl trinitrate patches followed in 1981 and nicotine patches in the early 1990s. Robert Scheuplein and Irvin Blank laid out skin permeation as a diffusion problem around 1970, and Richard Potts and Richard Guy published their permeability equation in 1992.',
  sim: 'disp-skin'
},

{
  id: 'suppositories', parent: 'topical-topic', title: 'Suppositories and pessaries', level: 2,
  short: 'Suppositories melt or dissolve in the rectum (pessaries in the vagina) to act locally or to be absorbed — useful when a patient cannot swallow, is vomiting or is seizing. Fatty or water-soluble bases set the release, and the displacement value lets a fixed-volume mould hold the right dose.',
  keywords: ['suppository', 'pessary', 'rectal', 'vaginal', 'cocoa butter', 'theobroma oil', 'hard fat', 'macrogol', 'glycerol–gelatin', 'displacement value', 'mould calibration', 'polymorphism', 'rectal absorption', 'first-pass'],
  prereq: ['routes', 'first-pass', 'solid-state'],
  related: ['ointments-creams', 'compounding', 'bioavailability', 'paediatric-geriatric', 'analgesics', 'medicine:epilepsy', 'dose-calculations'],
  body: `
A suppository is a solid dosage form shaped for insertion into the rectum — a **pessary** (vaginal suppository) into the vagina — where it melts at body temperature or dissolves in the little fluid present and releases its drug. Rectal medicines are routine in some countries and unusual in others, but they are invaluable when a patient cannot swallow, is vomiting, is unconscious or seizing, or is a young child who refuses medicine by mouth.

### Local and systemic action
- **Local**: laxatives (glycerol, bisacodyl), haemorrhoid preparations, anti-inflammatories for proctitis, and vaginal antifungals and hormones.
- **Systemic**: pain relievers and antipyretics (paracetamol, NSAIDs), anti-emetics, and anticonvulsants — rectal diazepam solution in tubes for prolonged seizures when a vein cannot be used ([[medicine:epilepsy|epilepsy]]).

The rectum has a small surface (about 200–400 cm², without villi) and only 1–3 mL of fluid, so absorption is often slower and more variable than by mouth. Drug absorbed from the lower rectum drains through the middle and inferior rectal veins directly towards the vena cava, partly **bypassing the liver** ([[first-pass]]); drug that spreads higher drains into the portal system. How much escapes first-pass metabolism depends on where the suppository sits — one reason rectal bioavailability varies.

### Bases
| Base | How it releases | Features |
|---|---|---|
| cocoa butter (theobroma oil) | melts just below body temperature (about 34 °C) | pleasant, but polymorphic: overheating in manufacture gives unstable forms that melt at 18–25 °C and do not set; needs cool storage |
| hard fat (semi-synthetic glycerides) | melts at about 33–37 °C | today's standard: little polymorphism, chosen melting ranges |
| macrogols (polyethylene glycols) | dissolve in the rectal fluid | stable at room temperature; can irritate by drawing water |
| glycerol–gelatin | dissolves slowly | mainly pessaries and laxatives; absorbs moisture, needs a preservative |

A fatty base melts and spreads, and a water-soluble drug then partitions out into the rectal fluid; a drug very soluble in the fat stays in the melted base and is released slowly. So formulators pair lipophilic drugs with water-soluble bases and hydrophilic drugs with fatty bases.

### Making them: the displacement value
Suppositories are made by pouring the melted mass into moulds of fixed volume, calibrated with the pure base — a "2 g mould" holds 2 g of base. A drug takes up space and is usually denser than the base, so it does not replace the base gram for gram. The **displacement value** $f$ is the number of grams of drug that displace one gram of base, roughly the ratio of their densities: about 1–2 for most organic drugs, 5 or more for zinc oxide and some heavy bismuth salts. For $N$ suppositories each containing $d$ grams of drug, in a mould holding $E$ grams of base,

$$B = N\\left(E - \\frac{d}{f}\\right)$$

grams of base are needed. In practice the calculation is made for a couple of extra suppositories to allow for losses when pouring ([[compounding]]).

### Quality and use
Suppositories are tested for uniformity of mass and content, disintegration or melting time, softening and hardness, and drug release. Storage matters: fat-based suppositories soften in a warm room or a pocket. Patients need clear instructions — unwrap, moisten the tip with water if the leaflet says so, insert past the sphincter, lie still for a few minutes — and pessaries often come with an applicator.

> [!warn] Emergency rectal medicines, such as those for prolonged seizures, are given according to an individual care plan and the product information. If a seizure does not stop, or breathing is affected, call your local emergency number.
`,
  ideas: [
    'Suppositories and pessaries melt or dissolve in the body cavity to act locally or be absorbed.',
    'The rectal route helps when patients cannot swallow, vomit or are seizing; absorption is slower and more variable than oral.',
    'The lower rectum drains partly past the liver, so some first-pass metabolism is avoided — how much depends on position.',
    'Fatty bases melt (cocoa butter, hard fat); water-soluble bases dissolve (macrogols, glycerol–gelatin); pair the drug with a base it does not favour.',
    'The displacement value corrects the base needed for the space the drug takes: B = N(E − d/f).'
  ],
  pitfalls: [
    'Rectal drugs completely bypass the liver — Only drug absorbed low in the rectum drains to the vena cava; drug higher up enters the portal system, so first-pass avoidance is partial and variable.',
    'One gram of drug replaces one gram of base in the mould — Moulds are fixed in volume; denser drugs displace less base than their weight, so the displacement value must be used.',
    'Overheating cocoa butter just makes pouring easier — It converts the fat to unstable low-melting polymorphs, so the suppositories may not set or may melt in the pack.'
  ],
  formulas: [
    {
      name: 'Mass of base for suppositories (displacement value)',
      expr: 'B = N*(E - d/f)', tex: 'B = N\\left(E - \\dfrac{d}{f}\\right)',
      vars: {
        B: { name: 'mass of base needed', q: false, unit: 'g' },
        N: { name: 'number of suppositories made', value: 12, int: true },
        E: { name: 'mould capacity with pure base', q: false, unit: 'g', value: 2 },
        d: { name: 'drug per suppository (hypothetical)', q: false, unit: 'g', value: 0.25 },
        f: { name: 'displacement value of the drug', value: 1.5 }
      },
      note: 'f is the mass of drug that displaces 1 g of base. Make a couple more than needed to allow for losses.',
      practice: { unknowns: ['B', 'N'] },
      stories: {
        B: 'You make {N} suppositories of {d} of a drug (displacement value {f}) in moulds holding {E} of base. How much base is needed?',
        f: 'Making {N} suppositories of {d} each in {E} moulds took {B} of base. What is the drug\'s displacement value?'
      }
    },
    {
      name: 'Measuring a displacement value',
      expr: 'f = x/(E - M + x)', tex: 'f = \\dfrac{x}{E - M + x}',
      vars: {
        f: { name: 'displacement value' },
        x: { name: 'drug in one medicated suppository', q: false, unit: 'g', value: 0.3 },
        E: { name: 'mass of an unmedicated suppository', q: false, unit: 'g', value: 2 },
        M: { name: 'mass of a medicated suppository', q: false, unit: 'g', value: 2.1 }
      },
      note: 'The base displaced by x grams of drug is E − (M − x).',
      practice: { unknowns: ['f', 'M'] },
      stories: {
        f: 'Plain suppositories weigh {E}; medicated ones weigh {M} and contain {x} of drug. What is the displacement value?',
        M: 'A drug with displacement value {f} is put {x} per suppository into moulds that give {E} plain suppositories. What will a medicated one weigh?'
      }
    }
  ],
  examples: [
    {
      title: 'How much base?',
      q: 'Ten suppositories, each with 250 mg of a hypothetical drug (displacement value 1.5), are to be made in a 2 g mould; the pharmacist calculates for 12. How much drug and base are weighed?',
      steps: [
        'Drug: $12 \\times 0.25 = 3.0$ g.',
        'Base: $B = 12 \\times (2.0 - 0.25/1.5) = 12 \\times 1.833 = 22.0$ g.',
        'Without the displacement value one would use $12 \\times 1.75 = 21.0$ g — and each suppository would come out light.'
      ],
      a: '3.0 g of drug and 22.0 g of base.'
    },
    {
      title: 'Measuring a displacement value',
      q: 'Plain suppositories from a mould weigh 2.00 g. Medicated ones containing 0.40 g of drug each weigh 2.12 g. What is the displacement value?',
      steps: [
        'Base in a medicated suppository: $2.12 - 0.40 = 1.72$ g, so 0.28 g of base was displaced.',
        '$f = 0.40/0.28 = 1.43$: 1.43 g of drug takes the place of 1 g of base.'
      ],
      a: 'About 1.4.'
    }
  ],
  quiz: [
    { q: 'Why does rectal administration avoid part of first-pass metabolism?', choices: ['the rectum has no blood supply', 'veins of the lower rectum drain towards the vena cava rather than the portal vein', 'rectal fluid destroys liver enzymes', 'suppositories are absorbed into the lymph only'], a: 1, why: 'The middle and inferior rectal veins join the systemic circulation; the superior rectal vein drains to the portal system, so avoidance is only partial.' },
    { q: 'A batch of cocoa butter suppositories will not set after the base was overheated. Why?', choices: ['the drug decomposed', 'cocoa butter formed unstable low-melting polymorphs', 'water evaporated', 'the mould was too cold'], a: 1, why: 'Cocoa butter is polymorphic; melting it well above about 36 °C destroys the stable crystal nuclei and it sets into forms melting at 18–25 °C.' },
    { q: 'How much base (g) is needed for 6 suppositories of 0.1 g drug each (displacement value 2) in a 1 g mould?', answer: 5.7, unit: 'g', why: 'B = 6 × (1 − 0.1/2) = 6 × 0.95 = 5.7 g.' },
    { q: 'A lipophilic drug is released fastest from a fatty base.', a: false, why: 'A drug that dissolves well in the melted fat prefers to stay there; lipophilic drugs are released better from water-soluble bases.' },
    { q: 'Which situation most favours the rectal route?', choices: ['a patient who swallows tablets easily', 'a vomiting child with a fever', 'a drug that must act within seconds', 'a drug needing precise, reproducible absorption'], a: 1, why: 'Rectal dosing helps when oral dosing fails; it is slower and more variable than oral or intravenous routes.' }
  ],
  problems: [
    { q: 'Plain suppositories weigh 2.00 g; medicated ones with 0.50 g of drug weigh 2.20 g. What is the displacement value?', answer: 1.67, tol: 0.02, steps: ['Base displaced: $2.00 - (2.20 - 0.50) = 0.30$ g.', '$f = 0.50/0.30 = 1.67$.'] }
  ],
  applications: [
    'Fever and pain relief in children who cannot take medicines by mouth.',
    'Anti-emetics for vomiting patients; rectal anticonvulsants for prolonged seizures.',
    'Laxatives, haemorrhoid treatments and vaginal antifungals.',
    'Extemporaneous compounding of special suppositories in hospital pharmacies.'
  ],
  history: 'Rectal medicines appear in Egyptian papyri and in Hippocratic writings. Cocoa butter became the classic suppository base in the nineteenth century, when pharmacists also worked out displacement values for their moulds; semi-synthetic hard fats with controlled melting ranges took over industrial production in the second half of the twentieth century.'
},

{
  id: 'nasal-otic', parent: 'topical-topic', title: 'Nasal, ear and mouth products', level: 1,
  short: 'The nose, ear and mouth each have their own anatomy, clearance and formulation rules. Nasal sprays act locally or reach the blood fast; ear drops treat the outer canal; sublingual and buccal products are absorbed straight into the circulation, bypassing the liver.',
  keywords: ['nasal spray', 'intranasal', 'mucociliary clearance', 'nasal drops', 'ear drops', 'otic', 'wax softener', 'sublingual', 'buccal', 'mouthwash', 'lozenge', 'metered-dose pump', 'naloxone', 'glyceryl trinitrate', 'mucoadhesive'],
  prereq: ['routes', 'first-pass', 'osmolarity-tonicity'],
  related: ['ophthalmic', 'inhalation', 'preservatives', 'rheology', 'vaccine-formulation', 'medicine:allergy', 'medicine:hearing-balance'],
  body: `
Some medicines are aimed at small, specialised places: the nose, the ear, the mouth and throat. Each has its own anatomy, its own way of clearing things away and its own formulation rules — and some of these routes also reach the blood, or even the brain, quickly.

### The nose
The nasal cavity has about 150 cm² of mucosa with a rich blood supply behind a narrow entrance. Most nasal products act locally — decongestants, corticosteroids and antihistamines for rhinitis ([[medicine:allergy|allergy]]), saline for rinsing — but the mucosa also absorbs small molecules fast and without first-pass metabolism: nasal sprays deliver naloxone for opioid overdose, triptans for migraine ([[medicine:headache-migraine|migraine]]), fentanyl for breakthrough pain, desmopressin, and a live attenuated influenza vaccine.

Three facts shape nasal formulations:
- **Mucociliary clearance** sweeps the mucus layer towards the throat at a few millimetres per minute; material is cleared with a half-life of roughly 15–20 minutes. Sprays deposited towards the front of the nose stay longer, and mucoadhesive polymers and gels extend contact.
- **Volume** is small: about 100–150 µL per nostril per spray; more runs out or down the throat.
- **Comfort and cilia**: close to isotonic ([[osmolarity-tonicity]]), pH about 4.5–6.5, and care with preservatives such as benzalkonium chloride, which can harm cilia with long use — hence preservative-free pumps.

Metered-dose pumps deliver a fixed volume per actuation, so the dose is concentration × volume. Droplets are mostly larger than 10 µm, so they stay in the nose instead of reaching the lungs ([[inhalation]]); spray pattern and droplet size are tested.

### The ear
Ear drops treat the outer ear canal: infection (otitis externa), wax, inflammation. The canal holds only about 1 mL, and drops need contact time — the patient lies with the ear up for a few minutes. Vehicles include water, glycerol, propylene glycol and oils; glycerol and propylene glycol are viscous and hygroscopic, which helps them stay put. Wax softeners are oils or solutions of sodium bicarbonate or urea hydrogen peroxide. Some drugs, notably aminoglycoside antibiotics, can damage hearing if they reach the middle ear through a perforated eardrum, so drops are chosen with the eardrum in mind ([[medicine:hearing-balance|hearing and balance]]).

### The mouth and throat
- **Sublingual and buccal** products — tablets, films and sprays under the tongue or against the cheek — are absorbed through the thin, well-supplied lining straight into the systemic circulation, bypassing the liver. Sublingual glyceryl trinitrate relieves angina within a couple of minutes; buccal midazolam is used for prolonged seizures. Only small, potent, moderately lipophilic drugs suit these routes, and swallowed saliva carries part of the dose to the gut.
- **Local** products: mouthwashes (chlorhexidine), gels and pastes for ulcers, lozenges and pastilles that dissolve slowly, and antifungal suspensions held in the mouth before swallowing. Contact time is short, because saliva — roughly a litre a day — washes everything away.

> [!warn] Nasal naloxone is an emergency treatment for suspected opioid overdose: after giving it, call your local emergency number, because its effect can wear off before the opioid's. Use nose, ear and mouth medicines as the product information directs, and do not use ear drops when the eardrum may be perforated unless a doctor advises it.
`,
  ideas: [
    'Nasal sprays act locally or give fast systemic absorption without first-pass metabolism; volumes are about 100 µL per spray.',
    'Mucociliary clearance removes nasal doses with a half-life of roughly 15–20 minutes; mucoadhesives extend contact.',
    'Ear drops treat the outer canal; the state of the eardrum decides which drugs are safe.',
    'Sublingual and buccal absorption bypasses the liver and acts within minutes, but suits only small, potent drugs.',
    'Saliva and short contact times limit local mouth treatments; lozenges and gels prolong them.'
  ],
  pitfalls: [
    'A bigger nasal spray volume delivers more drug — Beyond about 150 µL per nostril the excess runs out or is swallowed; more concentrated, not larger, doses are needed.',
    'Sublingual tablets work the same if swallowed — Swallowed drug meets first-pass metabolism; sublingual glyceryl trinitrate, for example, is largely destroyed by the liver if swallowed.',
    'Ear drops are harmless whatever the state of the ear — Some drugs and vehicles damage the middle and inner ear if the eardrum is perforated.'
  ],
  formulas: [
    {
      name: 'Dose per spray',
      expr: 'Dose = C*V', tex: '\\mathrm{Dose} = C\\,V',
      vars: {
        Dose: { name: 'dose per actuation', q: false, unit: 'µg', tex: '\\mathrm{Dose}' },
        C: { name: 'concentration of the solution', q: false, unit: 'mg/mL', value: 0.5 },
        V: { name: 'volume per actuation', q: false, unit: 'µL', value: 100 }
      },
      note: 'mg/mL × µL = µg. 0.05 % w/v = 0.5 mg/mL. Hypothetical products only.',
      stories: {
        Dose: 'A nasal pump delivers {V} of a {C} solution per spray. What dose is that?',
        C: 'What concentration is needed to deliver {Dose} in a {V} spray?'
      }
    },
    {
      name: 'Number of sprays in a bottle',
      expr: 'n = (Vf - Vr)/Vs', tex: 'n = \\dfrac{V_f - V_r}{V_s}',
      vars: {
        n: { name: 'number of full sprays' },
        Vf: { name: 'fill volume', q: false, unit: 'mL', value: 10, tex: 'V_f' },
        Vr: { name: 'volume used for priming and left in the bottle', q: false, unit: 'mL', value: 1, tex: 'V_r' },
        Vs: { name: 'volume per spray', q: false, unit: 'mL', value: 0.1, tex: 'V_s' }
      },
      stories: { n: 'A spray bottle holds {Vf}; {Vr} goes on priming and residue, and each spray is {Vs}. How many sprays does it give?' }
    },
    {
      name: 'Fraction remaining after mucociliary clearance',
      expr: 'f = 2^(-t/th)', tex: 'f = 2^{-t/t_{1/2}}',
      vars: {
        f: { name: 'fraction of the dose still in the nose', q: 'ratio', unit: '%' },
        t: { name: 'time after the spray', q: 'time', unit: 'min', value: 30 },
        th: { name: 'clearance half-life', q: 'time', unit: 'min', value: 20, tex: 't_{1/2}' }
      },
      note: 'A first-order approximation; real clearance depends on where the spray lands and on the formulation.',
      practice: { unknowns: ['f', 't'] },
      stories: {
        f: 'Nasal clearance has a half-life of {th}. What fraction of a spray remains after {t}?',
        t: 'With a clearance half-life of {th}, when is only {f} of a nasal dose left?'
      }
    }
  ],
  examples: [
    {
      title: 'A nasal spray dose',
      q: 'A hypothetical corticosteroid spray is 0.05 % w/v and each actuation delivers 100 µL. What is the dose per spray, and per day at two sprays in each nostril once daily?',
      steps: [
        '0.05 % w/v = 0.05 g per 100 mL = 0.5 mg/mL.',
        'Per spray: $0.5$ mg/mL × 100 µL = 50 µg.',
        'Four sprays: 200 µg a day.'
      ],
      a: '50 µg per spray, 200 µg per day.'
    },
    {
      title: 'Why nasal gels',
      q: 'Material sprayed into the nose is cleared with a half-life of about 20 minutes. What fraction is still in the nose after one hour, and what can a formulator do about it?',
      steps: [
        '$f = 2^{-60/20} = 2^{-3} = 12.5$ %.',
        'For a drug absorbed slowly across the mucosa, most of the dose is swept to the throat and swallowed before it can be absorbed.',
        'Mucoadhesive polymers (such as cellulose ethers or chitosan) and in-situ gels slow clearance and raise nasal absorption.'
      ],
      a: 'About 12.5 % after an hour; mucoadhesives extend residence.'
    }
  ],
  quiz: [
    { q: 'Why do nasal naloxone and nasal triptans act quickly?', choices: ['they are inhaled into the lungs', 'the nasal mucosa is richly supplied with blood and absorption avoids first-pass metabolism', 'they are swallowed and absorbed in the stomach', 'they act only locally'], a: 1, why: 'Small drugs cross the thin, vascular nasal mucosa directly into the systemic circulation.' },
    { q: 'About what volume does one nasal spray actuation typically deliver?', choices: ['10 µL', '100 µL', '1 mL', '5 mL'], a: 1, why: 'Pumps deliver about 50–150 µL; much more runs out of the nose or down the throat.' },
    { q: 'A spray is 1 mg/mL and delivers 50 µL per actuation. What is the dose per spray, in µg?', answer: 50, unit: 'µg', why: '1 mg/mL × 50 µL = 50 µg.' },
    { q: 'Sublingual glyceryl trinitrate works just as well if the tablet is swallowed.', a: false, why: 'Swallowed, it passes through the liver first, where most of it is destroyed; under the tongue it enters the systemic circulation directly.' },
    { q: 'Why do some ear drops carry a warning about a perforated eardrum?', choices: ['they cannot be absorbed by an intact eardrum', 'drugs such as aminoglycosides reaching the middle ear can damage hearing', 'drops evaporate faster', 'a perforated eardrum makes drops sting less'], a: 1, why: 'With a hole in the eardrum, drops reach the middle ear and can harm the inner ear; the choice of drops depends on the eardrum.' }
  ],
  problems: [
    { q: 'Nasal clearance has a half-life of 15 minutes. What percentage of a dose remains after 45 minutes?', answer: 12.5, unit: '%', tol: 0.02, steps: ['$f = 2^{-45/15} = 2^{-3} = 0.125$, i.e. 12.5 %.'] }
  ],
  applications: [
    'Nasal corticosteroid and antihistamine sprays for allergic rhinitis.',
    'Emergency nasal naloxone and buccal midazolam given by families and first responders.',
    'Sublingual glyceryl trinitrate for angina; buccal and sublingual films.',
    'Ear drops for otitis externa and wax; mouthwashes and gels for oral conditions.'
  ],
  history: 'Sublingual glyceryl trinitrate for angina was introduced by William Murrell in 1879. Snuffs and nasal remedies are ancient, but deliberate systemic delivery through the nose became mainstream from the 1980s, with peptide sprays such as desmopressin, and later triptans, naloxone and a nasal influenza vaccine.'
}

);
