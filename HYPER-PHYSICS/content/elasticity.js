/* HYPER-PHYSICS · content/elasticity.js — how solids respond to load: Hooke's law,
 * stress, strain and Young's modulus, and the shear and bulk moduli. */
Hyper.add(

{
  id: 'hookes-law', parent: 'elasticity', title: 'Hooke\'s law', level: 1,
  short: 'Stretch a spring and it pulls back in proportion to the stretch: F = kx. It holds for springs and for most solids — until they are pushed past their elastic limit.',
  keywords: ['Hooke\'s law', 'spring constant', 'stiffness', 'extension', 'elastic limit', 'limit of proportionality', 'springs in series', 'springs in parallel', 'N/m', 'spring balance'],
  prereq: ['force', 'math:linear-functions'],
  related: ['elastic-potential-energy', 'mass-spring-system', 'stress-strain'],
  body: `
Hang a weight on a spring and it stretches; hang twice the weight and it stretches twice as far. Robert Hooke found this in 1660 and published it as a Latin anagram — *ut tensio, sic vis*, "as the extension, so the force":
$$F = kx$$
$x$ is the extension (or compression) from the spring's natural length and $k$ is the **spring constant**, or stiffness, in N/m: the force needed per metre of stretch. The spring itself pulls back the other way, so the force it exerts on whatever stretches it is $F = -kx$, a **restoring** force — the origin of the oscillation of a [[mass-spring-system|mass on a spring]].

### How stiff?
| Spring | k |
|---|---|
| Slinky toy | about 1 N/m |
| Bungee cord (short section) | 50–100 N/m |
| Ballpoint pen spring | a few hundred N/m |
| Car suspension spring | 20–50 kN/m |
| Steel wire 2 m long, 1 mm thick | about 80 kN/m |

### Limits
The straight-line law holds only up to the **limit of proportionality**. A little beyond it lies the **elastic limit**: stretched past this, a spring no longer returns to its original length but stays permanently deformed, as anyone who has overstretched a Slinky knows. What happens inside the material is the subject of [[stress-strain|stress and strain]].

### Combining springs
- **Side by side (parallel)**: each spring stretches by the same $x$ and the forces add, so $k = k_1 + k_2$. Two identical springs are twice as stiff.
- **End to end (series)**: each carries the same force and the stretches add, so
$$\\frac1k = \\frac1{k_1} + \\frac1{k_2}$$
Two identical springs in a chain are half as stiff. By the same token, cutting a spring in half **doubles** the stiffness of each half.

### Solids are springs too
A wire or rod pulled along its length obeys Hooke's law with
$$k = \\frac{EA}{L}$$
where $A$ is its cross-section, $L$ its length and $E$ the material's [[stress-strain|Young's modulus]]. Longer rods are softer; thicker ones stiffer. Bridges, bones and buildings all flex like very stiff springs.

### Energy
Stretching a spring takes work, stored as [[elastic-potential-energy|elastic potential energy]]. Since the force grows steadily from 0 to $kx$, the average is $\\tfrac12 kx$ and the work is
$$E = \\tfrac12 kx^2$$

> [!tip] A spring balance is Hooke's law turned into an instrument: the extension is proportional to the force, so a linear scale reads newtons (or, on Earth, kilograms).
`,
  ideas: [
    'A spring\'s force is proportional to its extension: F = kx, with k in N/m.',
    'The force the spring exerts is a restoring force, F = −kx.',
    'Parallel springs add their stiffnesses; series springs add their reciprocals.',
    'Beyond the elastic limit a material is permanently deformed and Hooke\'s law fails.',
    'A rod or wire acts as a spring with k = EA/L.'
  ],
  pitfalls: [
    'x is the length of the spring — It is the change in length from the natural (unloaded) length.',
    'Two springs joined end to end are twice as stiff — They are half as stiff: the same force stretches each one, and the stretches add.',
    'Hooke\'s law holds for any stretch — Only up to the limit of proportionality; rubber bands, for instance, are far from linear.'
  ],
  formulas: [
    {
      name: 'Hooke\'s law',
      expr: 'F = k*x', tex: 'F = k x',
      vars: {
        F: { name: 'force', q: 'force', unit: 'N' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 200 },
        x: { name: 'extension', q: 'length', unit: 'cm', value: 5 }
      },
      stories: {
        F: 'A spring with k = {k} is stretched by {x}. What force does it take?',
        k: 'A force of {F} stretches a spring by {x}. What is its spring constant?',
        x: 'How far does a spring with k = {k} stretch under a load of {F}?'
      }
    },
    {
      name: 'Two springs in series',
      expr: 'k = k1*k2/(k1 + k2)', tex: 'k = \\frac{k_1 k_2}{k_1 + k_2}',
      vars: {
        k: { name: 'combined spring constant', q: 'stiffness', unit: 'N/m' },
        k1: { name: 'first spring', q: 'stiffness', unit: 'N/m', value: 200 },
        k2: { name: 'second spring', q: 'stiffness', unit: 'N/m', value: 300 }
      },
      stories: { k: 'Springs of {k1} and {k2} are hooked end to end. What is the stiffness of the pair?', k2: 'A spring of {k1} is joined end to end with a second one; together they have k = {k}. How stiff is the second spring?' }
    },
    {
      name: 'Two springs in parallel',
      expr: 'k = k1 + k2', tex: 'k = k_1 + k_2',
      vars: {
        k: { name: 'combined spring constant', q: 'stiffness', unit: 'N/m' },
        k1: { name: 'first spring', q: 'stiffness', unit: 'N/m', value: 200 },
        k2: { name: 'second spring', q: 'stiffness', unit: 'N/m', value: 300 }
      },
      stories: { k: 'A load hangs from springs of {k1} and {k2} side by side. What is their combined stiffness?' }
    },
    {
      name: 'Stiffness of a rod or wire',
      expr: 'k = E*A/L', tex: 'k = \\frac{E A}{L}',
      vars: {
        k: { name: 'spring constant', q: 'stiffness', unit: 'kN/m' },
        E: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 200 },
        A: { name: 'cross-sectional area', q: 'area', unit: 'mm²', value: 0.785 },
        L: { name: 'length', q: 'length', unit: 'm', value: 2 }
      },
      stories: { k: 'A wire of length {L}, cross-section {A} and Young\'s modulus {E} is pulled along its length. What is its spring constant?' }
    }
  ],
  examples: [
    {
      title: 'A spring balance',
      q: 'A spring balance stretches 4.0 cm when a 1.0 kg bag of sugar hangs from it. What is its spring constant, and how far does it stretch for 2.5 kg?',
      steps: [
        '$k = F/x = (1.0 \\times 9.81)/0.040 = 245\\ \\mathrm{N/m}$.',
        'For 2.5 kg: $x = (2.5 \\times 9.81)/245 = 0.10\\ \\mathrm{m}$ — 2.5 times as far, as long as the spring stays in its linear range.'
      ],
      a: '245 N/m; 10 cm.'
    },
    {
      title: 'Series and parallel',
      q: 'A 3.0 kg mass hangs from two springs of 200 N/m and 300 N/m. How far does it sink when they are side by side, and when they are hooked end to end?',
      steps: [
        'Weight $= 29.4\\ \\mathrm{N}$.',
        'Parallel: $k = 500\\ \\mathrm{N/m}$, $x = 29.4/500 = 5.9\\ \\mathrm{cm}$.',
        'Series: $k = \\dfrac{200 \\times 300}{500} = 120\\ \\mathrm{N/m}$, $x = 29.4/120 = 24.5\\ \\mathrm{cm}$ — the 200 N/m spring stretches 14.7 cm and the 300 N/m spring 9.8 cm.'
      ],
      a: '5.9 cm in parallel; 24.5 cm in series.'
    }
  ],
  quiz: [
    { q: 'A spring stretches 3 cm under a 6 N load. Under 10 N (still within its elastic range) it stretches…', choices: ['3 cm', '5 cm', '10 cm', '6 cm'], a: 1, why: 'k = 6/0.03 = 200 N/m, so 10 N gives 0.05 m. Or simply: extension ∝ force.' },
    { q: 'Two identical springs are hooked end to end. The pair is…', choices: ['twice as stiff', 'equally stiff', 'half as stiff', 'four times as stiff'], a: 2, why: 'Each carries the full load and stretches the usual amount; the stretches add, so the total stretch doubles for the same force.' },
    { q: 'A spring is cut into two equal halves. Each half has a spring constant…', choices: ['half the original', 'equal to the original', 'twice the original', 'four times the original'], a: 2, why: 'Each half stretches half as much under the same force, so k doubles.' },
    { q: 'Once a steel spring has been stretched past its elastic limit, it returns to its original length when unloaded.', a: false,
      why: 'Past the elastic limit the deformation is partly permanent (plastic); the spring stays longer.' }
  ],
  applications: ['Spring balances, force gauges and bathroom scales.', 'Vehicle suspensions, mattresses and shock mounts.', 'Estimating how much structures and cables stretch under load (k = EA/L).']
},

{
  id: 'stress-strain', parent: 'elasticity', title: 'Stress, strain and Young\'s modulus', level: 2,
  short: 'Stress is force per area, strain is fractional stretch, and their ratio — Young\'s modulus — measures how stiff a material is, independent of its shape.',
  keywords: ['stress', 'strain', 'Young\'s modulus', 'elastic modulus', 'tensile strength', 'yield strength', 'ultimate tensile strength', 'ductile', 'brittle', 'stress-strain curve', 'elastic limit', 'plastic deformation'],
  prereq: ['hookes-law', 'pressure'],
  related: ['shear-bulk-modulus', 'thermal-expansion', 'static-equilibrium', 'crystal-structure'],
  body: `
A thick steel cable and a thin steel wire stretch by very different amounts under the same load, yet they are made of the same material. To describe the **material** rather than the object, divide out its size.

### Stress and strain
**Stress** is the force per unit cross-sectional area,
$$\\sigma = \\frac{F}{A}$$
in pascals (usually MPa or GPa) — like [[pressure]], but it can pull (tension) as well as push (compression). **Strain** is the fractional change of length,
$$\\varepsilon = \\frac{\\Delta L}{L}$$
a pure number, often quoted in per cent or in microstrain (µε = 10⁻⁶).

### Young's modulus
In the linear, elastic range stress is proportional to strain, and the constant is the **Young's modulus** $E$:
$$E = \\frac{\\sigma}{\\varepsilon} \\qquad\\Longrightarrow\\qquad \\Delta L = \\frac{F L}{A E}$$
This is [[hookes-law|Hooke's law]] for materials. A 2 m steel wire 1 mm across holding 10 kg is under 125 MPa of stress and stretches just 1.25 mm.

| Material | Young's modulus E | Tensile strength |
|---|---|---|
| Rubber | 0.01–0.1 GPa | 15–30 MPa |
| Wood (along the grain) | about 10 GPa | about 100 MPa |
| Bone | 15–20 GPa | about 130 MPa |
| Glass | 70 GPa | 30–100 MPa (flaw-limited) |
| Aluminium alloys | 70 GPa | 100–600 MPa |
| Structural steel | 200 GPa | 400–550 MPa |
| Carbon fibre | about 230 GPa | about 3500 MPa |
| Diamond | about 1050 GPa | — |

### The stress–strain curve
Pull a steel bar in a testing machine and plot stress against strain:
1. A straight line: elastic, Hooke's law, fully reversible.
2. The **yield point**: the metal starts to flow plastically; unloading now leaves a permanent stretch.
3. **Work hardening**: stress rises again, more slowly, as the crystal defects tangle.
4. The **ultimate tensile strength** (UTS), the peak stress; then the bar **necks** — thins at one place — and breaks.

**Ductile** materials such as copper, mild steel and gold stretch a lot before breaking, which gives warning and absorbs energy. **Brittle** ones — glass, cast iron, concrete in tension — break suddenly near the end of the straight line. Concrete is strong in compression but weak in tension, so it is reinforced with steel bars where it will be stretched.

> [!warn] Stiff is not the same as strong. Glass is as stiff as aluminium (same E) but snaps at a fraction of the stress. $E$ tells you how much something bends; the strength tells you when it breaks.

### Energy and a hanging cable
The elastic energy stored per unit volume is $u = \\tfrac12\\sigma\\varepsilon = \\sigma^2/2E$ — which is why springs are made of high-strength steel. And a cable hanging under its own weight breaks when its length reaches $\\sigma_\\text{max}/\\rho g$: about 6.5 km for steel with a UTS of 500 MPa, whatever its thickness. A space elevator would need a material hundreds of times better.
`,
  ideas: [
    'Stress σ = F/A (force per area) and strain ε = ΔL/L (fractional stretch) describe the material, not the object.',
    'In the elastic range σ = Eε, so ΔL = FL/(AE); Young\'s modulus E measures stiffness.',
    'Past the yield point deformation becomes permanent; the peak stress is the ultimate tensile strength.',
    'Ductile materials stretch before breaking; brittle ones snap. Stiffness and strength are different properties.'
  ],
  pitfalls: [
    'A thicker wire has a larger Young\'s modulus — E belongs to the material. A thicker wire has a lower stress for the same force, so it stretches less.',
    'A stiff material is a strong material — Glass has the stiffness of aluminium but breaks at far lower stress; rubber is weak in stiffness but can stretch hugely.',
    'Stress and pressure are identical — Both are force per area, but stress can be tensile (pulling) and also acts inside solids along any cut; pressure in a fluid only pushes.'
  ],
  formulas: [
    {
      name: 'Stress',
      expr: 'sigma = F/A', tex: '\\sigma = \\frac{F}{A}',
      vars: {
        sigma: { name: 'stress', q: 'stress', unit: 'MPa' },
        F: { name: 'force', q: 'force', unit: 'N', value: 98.1 },
        A: { name: 'cross-sectional area', q: 'area', unit: 'mm²', value: 0.785 }
      },
      stories: { sigma: 'A wire of cross-section {A} holds a load of {F}. What is the stress in it?', A: 'A rod must carry {F} at a stress of no more than {sigma}. What cross-section does it need?' }
    },
    {
      name: 'Extension of a wire or rod (Young\'s modulus)',
      expr: 'dL = F*L/(A*E)', tex: '\\Delta L = \\frac{F L}{A E}',
      vars: {
        dL: { name: 'extension', q: 'length', unit: 'mm', tex: '\\Delta L' },
        F: { name: 'force', q: 'force', unit: 'N', value: 98.1 },
        L: { name: 'original length', q: 'length', unit: 'm', value: 2 },
        A: { name: 'cross-sectional area', q: 'area', unit: 'mm²', value: 0.785 },
        E: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 200 }
      },
      stories: {
        dL: 'A steel wire (E = {E}) {L} long with cross-section {A} carries {F}. How much does it stretch?',
        E: 'A wire {L} long with cross-section {A} stretches {dL} under {F}. What is its Young\'s modulus?'
      }
    },
    {
      name: 'Elastic energy stored per unit volume',
      expr: 'u = sigma^2/(2*E)', tex: 'u = \\frac{\\sigma^2}{2E}',
      vars: {
        u: { name: 'energy per unit volume', q: 'energydensity', unit: 'kJ/m³' },
        sigma: { name: 'stress', q: 'stress', unit: 'MPa', value: 125 },
        E: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 200 }
      },
      stories: { u: 'How much elastic energy does each cubic metre of steel (E = {E}) store at a stress of {sigma}?' }
    },
    {
      name: 'Longest cable that can hang under its own weight',
      expr: 'Lmax = smax/(rho*g)', tex: 'L_{\\max} = \\frac{\\sigma_{\\max}}{\\rho g}',
      vars: {
        Lmax: { name: 'breaking length', q: 'length', unit: 'km', tex: 'L_{\\max}' },
        smax: { name: 'tensile strength', q: 'stress', unit: 'MPa', value: 500, tex: '\\sigma_{\\max}' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 7850 },
        g: { const: 'g' }
      },
      stories: { Lmax: 'A cable is made of a material with tensile strength {smax} and density {rho}. How long can it hang before it breaks under its own weight?' }
    }
  ],
  examples: [
    {
      title: 'A steel wire under load',
      q: 'A steel wire (E = 200 GPa) 2.0 m long and 1.0 mm in diameter supports a 10 kg mass. Find the stress, the strain and the extension.',
      steps: [
        'Area $A = \\pi (0.50\\times10^{-3})^2 = 7.85\\times10^{-7}\\ \\mathrm{m^2}$; force $F = 98.1\\ \\mathrm{N}$.',
        'Stress $\\sigma = F/A = 1.25\\times10^{8}\\ \\mathrm{Pa} = 125\\ \\mathrm{MPa}$ — safely below steel\'s yield strength of about 250 MPa.',
        'Strain $\\varepsilon = \\sigma/E = 1.25\\times10^{8}/2.0\\times10^{11} = 6.2\\times10^{-4}$.',
        'Extension $\\Delta L = \\varepsilon L = 6.2\\times10^{-4} \\times 2.0 = 1.25\\ \\mathrm{mm}$.'
      ],
      a: '125 MPa; strain 0.062 %; 1.25 mm.'
    },
    {
      title: 'How safe is a thigh bone?',
      q: 'While running, a femur carries about 2500 N in compression over a bone cross-section of about 3.3 cm². Bone breaks in compression at about 170 MPa. What is the safety factor?',
      steps: [
        '$\\sigma = F/A = 2500/3.3\\times10^{-4} = 7.6\\times10^{6}\\ \\mathrm{Pa} = 7.6\\ \\mathrm{MPa}$.',
        'Safety factor $= 170/7.6 \\approx 22$ — though a sideways blow, which bends the bone, can break it far more easily.'
      ],
      a: 'About 7.6 MPa: a safety factor of about 20.'
    }
  ],
  quiz: [
    { q: 'Two wires of the same steel and length carry the same load; one has twice the diameter. Its extension is…', choices: ['half as much', 'a quarter as much', 'the same', 'twice as much'], a: 1, why: 'Twice the diameter is four times the area, so a quarter of the stress and a quarter of the strain.' },
    { q: 'A rod is replaced by one of the same material and thickness but twice as long. Under the same force it stretches…', choices: ['half as much', 'the same', 'twice as much', 'four times as much'], a: 2, why: 'Same stress, same strain; the extension is strain × length.' },
    { q: 'Glass and aluminium have about the same Young\'s modulus. That means…', choices: ['they break at the same stress', 'they stretch equally under the same stress (while elastic)', 'they have the same density', 'they are equally ductile'], a: 1,
      why: 'E describes stiffness only. Glass breaks at far lower stress and without yielding.' },
    { q: 'Past the yield point a metal still returns to its original length when the load is removed.', a: false,
      why: 'Beyond the yield point part of the strain is plastic, a permanent set; only the elastic part springs back.' }
  ],
  applications: ['Structural and mechanical design: sizing beams, cables, bolts and shafts with a safety factor.', 'Materials testing with tensile machines; choosing materials for stiffness or strength.', 'Strain gauges that measure tiny strains in bridges, aircraft and load cells.']
},

{
  id: 'shear-bulk-modulus', parent: 'elasticity', title: 'Shear and bulk modulus', level: 2,
  short: 'Besides stretching, solids can be sheared out of shape or squeezed in volume. The shear modulus and bulk modulus measure how hard they resist each.',
  keywords: ['shear modulus', 'bulk modulus', 'modulus of rigidity', 'shear stress', 'shear strain', 'compressibility', 'Poisson\'s ratio', 'volume change', 'speed of sound', 'S waves'],
  prereq: ['stress-strain', 'pressure'],
  related: ['speed-of-sound', 'viscosity', 'hydrostatic-pressure', 'hookes-law'],
  body: `
Young's modulus describes pulling along one direction. A solid can be deformed in two other basic ways, each with its own modulus.

### Shear: changing shape
Push the top of a thick book sideways while its bottom is held: the pages slide, and the block leans into a parallelogram without changing volume. That is **shear**. The **shear stress** is the sideways force per area of the face it acts on, $\\tau = F/A$; the **shear strain** is how far the top moves relative to the height, $\\gamma = \\Delta x/h$ (the lean angle, in radians, for small deformations). Their ratio is the **shear modulus**:
$$G = \\frac{\\tau}{\\gamma} = \\frac{F/A}{\\Delta x/h}$$
Steel has $G \\approx 80$ GPa; aluminium 26 GPa; rubber about 1 MPa — which is why rubber blocks make good vibration mounts: they shear easily but carry weight well. Twisting a rod or a shaft is shear too: torsion springs, drive shafts and the balance springs of watches all rely on $G$.

**Fluids have no shear modulus.** Apply a shear stress and a liquid does not settle at a new shape — it flows, and keeps flowing, resisted only by its [[viscosity]]. That is almost the definition of a fluid.

### Bulk: changing volume
Squeeze a body equally from all sides by raising the [[pressure]] around it, and its volume shrinks. The **bulk modulus** is
$$B = -\\frac{\\Delta p}{\\Delta V/V}$$
(the minus sign makes $B$ positive, since more pressure means less volume). Its reciprocal is the **compressibility**.

| Material | Bulk modulus B |
|---|---|
| Air (slow, isothermal squeeze) | 0.1 MPa (equal to its pressure) |
| Water | 2.2 GPa |
| Aluminium | 76 GPa |
| Steel | 160 GPa |
| Diamond | 440 GPa |

Water is "incompressible" only in comparison with air: at the bottom of the Mariana Trench, under 110 MPa, it is squeezed by about 5 %. Averaged over the oceans, compression makes sea level about 30 m lower than it would be if water could not be squeezed at all.

### Sound and earthquakes
The moduli set the speed of mechanical waves. In a fluid, sound travels at $v = \\sqrt{B/\\rho}$ — 1480 m/s in water. In solids, compressional waves depend on $B$ and $G$ together, while **shear waves** travel at $\\sqrt{G/\\rho}$. Earthquake shear waves (S waves) cannot cross the Earth's outer core: a region with no shear stiffness must be liquid, and that is how seismologists discovered it.

### Poisson's ratio
Stretch a rubber band and it gets thinner. The ratio of sideways contraction to lengthwise stretch is **Poisson's ratio** $\\nu$: about 0.3 for metals, nearly 0.5 for rubber (whose volume barely changes), and close to 0 for cork — which is why a cork can be pushed into a bottle without bulging out at the sides. For an isotropic material the moduli are linked:
$$E = 2G(1 + \\nu) = 3B(1 - 2\\nu)$$
so steel, with $E = 200$ GPa and $\\nu = 0.29$, has $G \\approx 78$ GPa and $B \\approx 160$ GPa.
`,
  ideas: [
    'Shear changes shape at constant volume: G = (F/A)/(Δx/h).',
    'Bulk compression changes volume: B = −Δp/(ΔV/V); its reciprocal is the compressibility.',
    'Fluids have no shear modulus — under shear they flow — but they do have a bulk modulus.',
    'The moduli set wave speeds: √(B/ρ) for sound in a fluid, √(G/ρ) for shear waves in a solid.',
    'For isotropic materials E = 2G(1 + ν), with Poisson\'s ratio ν about 0.3 for metals.'
  ],
  pitfalls: [
    'Liquids are perfectly incompressible — Water compresses about 0.05 % per MPa: small, but it matters in the deep sea, in hydraulics at high pressure, and for the speed of sound.',
    'In shear the area is the cross-section perpendicular to the force, as in tension — For shear it is the area of the face the force lies along (the face being dragged sideways).',
    'Stretching a bar leaves its thickness unchanged — It gets thinner in proportion, by Poisson\'s ratio times the strain.'
  ],
  formulas: [
    {
      name: 'Shear deformation',
      expr: 'dx = F*h/(G*A)', tex: '\\Delta x = \\frac{F h}{G A}',
      vars: {
        dx: { name: 'sideways displacement of the top face', q: 'length', unit: 'mm', tex: '\\Delta x' },
        F: { name: 'shear force', q: 'force', unit: 'N', value: 1000 },
        h: { name: 'height (thickness) of the block', q: 'length', unit: 'cm', value: 2 },
        G: { name: 'shear modulus', q: 'stress', unit: 'MPa', value: 1 },
        A: { name: 'area of the sheared face', q: 'area', unit: 'cm²', value: 100 }
      },
      stories: { dx: 'A rubber mount (G = {G}) {h} thick with a face of {A} carries a sideways force of {F}. How far does its top shift?', G: 'A block {h} thick with a face of {A} shifts {dx} under a sideways {F}. What is its shear modulus?' }
    },
    {
      name: 'Volume change under pressure',
      expr: 'dV = -V*dp/B', tex: '\\Delta V = -\\frac{V\\,\\Delta p}{B}',
      vars: {
        dV: { name: 'change of volume', q: 'volume', unit: 'L', signed: true, tex: '\\Delta V' },
        V: { name: 'original volume', q: 'volume', unit: 'L', value: 1000 },
        dp: { name: 'increase of pressure', q: 'pressure', unit: 'MPa', value: 110, signed: true, tex: '\\Delta p' },
        B: { name: 'bulk modulus', q: 'stress', unit: 'GPa', value: 2.2 }
      },
      stories: { dV: 'By how much does {V} of water (B = {B}) shrink when taken to a depth where the pressure is {dp} higher?', B: 'A {V} sample shrinks by {dV} when the pressure rises by {dp}. What is its bulk modulus?' }
    },
    {
      name: 'Young\'s and shear moduli (isotropic material)',
      expr: 'E = 2*G*(1 + nu)', tex: 'E = 2G(1 + \\nu)',
      vars: {
        E: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa' },
        G: { name: 'shear modulus', q: 'stress', unit: 'GPa', value: 78 },
        nu: { name: 'Poisson\'s ratio', value: 0.29, min: 0, max: 0.5 }
      },
      stories: { G: 'A metal has Young\'s modulus {E} and Poisson\'s ratio {nu}. What is its shear modulus?', nu: 'A material has E = {E} and G = {G}. What is its Poisson\'s ratio?' }
    },
    {
      name: 'Speed of sound in a fluid',
      expr: 'v = sqrt(B/rho)', tex: 'v = \\sqrt{\\frac{B}{\\rho}}',
      vars: {
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        B: { name: 'bulk modulus', q: 'stress', unit: 'GPa', value: 2.2 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000 }
      },
      stories: { v: 'What is the speed of sound in a liquid with bulk modulus {B} and density {rho}?', B: 'Sound travels at {v} in a liquid of density {rho}. What is its bulk modulus?' }
    }
  ],
  examples: [
    {
      title: 'A rubber mount',
      q: 'A machine rests on rubber blocks 2.0 cm thick with a top face of 100 cm² each (G ≈ 1.0 MPa). A sideways force of 1000 N acts on one block. How far does its top shift?',
      steps: [
        'Shear stress $\\tau = F/A = 1000/0.010 = 1.0\\times10^{5}\\ \\mathrm{Pa}$.',
        'Shear strain $\\gamma = \\tau/G = 0.10$ — the block leans by about 6°.',
        '$\\Delta x = \\gamma h = 0.10 \\times 2.0\\ \\mathrm{cm} = 2.0\\ \\mathrm{mm}$.'
      ],
      a: 'About 2 mm.'
    },
    {
      title: 'Water in the deepest trench',
      q: 'At the bottom of the Mariana Trench the pressure is about 110 MPa above atmospheric. By what fraction is sea water compressed there (B ≈ 2.2 GPa)?',
      steps: [
        '$\\Delta V/V = -\\Delta p/B = -110\\times10^{6}/2.2\\times10^{9} = -0.050$.',
        'About 5 % (a little less in reality, because B itself rises with pressure). A litre of surface water would occupy about 950 mL down there.'
      ],
      a: 'About 5 %.'
    }
  ],
  quiz: [
    { q: 'Which kind of deformation does a liquid at rest not resist at all?', choices: ['Compression', 'Shear', 'Neither — liquids resist everything', 'Both'], a: 1,
      why: 'A liquid has no shear modulus: under a sideways stress it flows. It does resist compression (bulk modulus 2.2 GPa for water).' },
    { q: 'Earthquake S waves (shear waves) do not pass through the Earth\'s outer core. This shows that the outer core is…', choices: ['solid iron', 'liquid', 'a vacuum', 'hotter than the inner core'], a: 1, why: 'Shear waves need a shear modulus. A region with G = 0 is fluid.' },
    { q: 'Rubber has a Poisson\'s ratio of about 0.5. When a rubber band is stretched, its volume…', choices: ['increases a lot', 'stays almost the same', 'decreases a lot', 'doubles'], a: 1, why: 'ν = 0.5 is the value for a material whose volume does not change: it thins exactly enough to compensate.' },
    { q: 'Water is so incompressible that its bulk modulus is effectively infinite.', a: false,
      why: 'Its bulk modulus is finite, 2.2 GPa: large compared with air, but enough for deep-sea water to be compressed by a few per cent and for sound to travel at a finite 1480 m/s.' }
  ],
  applications: ['Rubber vibration mounts and bearings (low shear modulus).', 'Torsion bars, springs and drive shafts (shear under twisting).', 'Seismology, sonar and ultrasound, where the moduli set the wave speeds.']
}

);
