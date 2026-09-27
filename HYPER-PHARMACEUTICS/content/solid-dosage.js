/* HYPER-PHARMACEUTICS · content/solid-dosage.js — Solid dosage forms: powders and tablets (powder flow, granulation,
 * compression and compaction, excipients, coating, quality tests) and capsules and modified release (hard and soft
 * capsules, modified-release principles, release kinetics, osmotic and gastro-retentive systems, orally disintegrating
 * and chewable forms). Simulations in sims/solid-dosage.js (solid-*).
 * All drugs in examples are hypothetical or well-known teaching examples; nothing here is dosing guidance. */
Hyper.add(

{
  id: 'powder-flow', parent: 'powders-tablets', title: 'Powder flow', level: 2,
  short: 'Tablet presses and capsule fillers measure powder by volume, so a powder that does not pour evenly gives tablets of uneven weight and dose. Flow is measured by the angle of repose, the Carr index and Hausner ratio from bulk and tapped density, and the rate through an orifice. Larger, rounder particles, glidants and good hopper design all improve it.',
  keywords: ['powder flow', 'flowability', 'angle of repose', 'Carr index', 'compressibility index', 'Hausner ratio', 'bulk density', 'tapped density', 'cohesion', 'glidant', 'colloidal silicon dioxide', 'hopper', 'mass flow', 'funnel flow', 'rat-holing', 'arching', 'Beverloo equation', 'Janssen effect', 'USP <1174>', 'shear cell', 'segregation'],
  prereq: ['particle-size', 'physics:friction', 'physics:density'],
  related: ['granulation', 'compaction', 'excipients', 'tablet-testing', 'capsules', 'physics:pressure', 'chemistry:intermolecular-forces'],
  body: `
A rotary tablet press with 50 stations turning at 60 rpm makes 3000 tablets a minute. Each die passes under the feed frame for a few hundredths of a second, and in that time it must fill with exactly the same volume of powder. The press meters **volume**, and the dose in a tablet is volume × bulk density × drug fraction. So a powder that flows in fits and starts gives tablets that vary in weight, and therefore in dose. Flow matters just as much in capsule and sachet filling, and in every hopper and chute on the way.

### Why powders stick
A powder flows when gravity on each particle beats the forces holding the particles together: van der Waals attraction, liquid bridges from absorbed moisture, and electrostatic charge. Cohesive forces grow roughly with particle diameter, but weight grows with its cube, so the balance tips sharply as particles get smaller. Granules of 200–500 µm pour like sand, a 20 µm powder behaves like flour, and a micronised drug of 3 µm clumps and bridges. Shape matters too, because needles and plates interlock while spheres roll. So does humidity: above about 60–70 % relative humidity many powders gain liquid bridges and start to cake.

### Measuring flow
The pharmacopoeias (USP <1174>, Ph. Eur. 2.9.36) harmonise four methods: the **angle of repose** of a heap, the **compressibility** from bulk and tapped density, flow through an orifice, and shear cells, which measure the powder's actual strength for hopper design. The first two are quick and used everywhere:

$$\\mathrm{CI} = 100\\left(1 - \\frac{\\rho_B}{\\rho_T}\\right) \\qquad H_R = \\frac{\\rho_T}{\\rho_B} = \\frac{100}{100 - \\mathrm{CI}}$$

If a powder packs down a lot when it is tapped, cohesion was propping its particles apart. So a high Carr index means poor flow:

| Flow | Carr index (%) | Hausner ratio | Angle of repose |
|---|---|---|---|
| Excellent | ≤ 10 | 1.00–1.11 | 25–30° |
| Good | 11–15 | 1.12–1.18 | 31–35° |
| Fair | 16–20 | 1.19–1.25 | 36–40° |
| Passable | 21–25 | 1.26–1.34 | 41–45° |
| Poor | 26–31 | 1.35–1.45 | 46–55° |
| Very poor | 32–37 | 1.46–1.59 | 56–65° |
| Very, very poor | > 38 | > 1.60 | > 66° |

This is the scale of USP <1174>. You can try your own densities and angles in [the powder calculator](#/tools/formulation/powder).

### Hoppers: mass flow and funnel flow
In a steep, smooth hopper the whole contents move down together. This is **mass flow**: first in, first out. In a shallow or rough hopper only a central channel moves, while powder near the walls stays put. This is **funnel flow**: first in, last out. It lets fine and coarse particles separate, leaves stale powder in dead zones and, with a cohesive powder, can leave a stable empty **rat-hole**. A cohesive powder can also **arch** over the outlet and stop altogether. Andrew Jenike's design method (1960s) turns shear-cell data into the wall angle and outlet size that guarantee mass flow.

Water drains more slowly as a tank empties, but a powder does not: the walls carry most of its weight (the Janssen effect), so the rate through the outlet hardly depends on how full the hopper is. The Beverloo equation gives that rate from the outlet diameter $D_0$ and the particle size $d$:

$$W = C\\,\\rho_B\\sqrt{g}\\,(D_0 - k\\,d)^{5/2}$$

Here $C \\approx 0.58$ and $k \\approx 1.4$ for a round outlet. The power of 5/2 means that doubling the outlet gives almost six times the flow.

### Making powders flow
- **Granulate** ([[granulation]]) to get bigger, rounder particles and fewer fines.
- **Add a glidant.** Colloidal silicon dioxide at 0.1–0.5 % coats the particles with nanoparticles that hold them apart. Beyond an optimum, extra glidant makes flow worse again.
- **Control moisture**, and choose free-flowing excipient grades such as spray-dried lactose or granular mannitol ([[excipients]]).
- **Design the equipment**: steeper and smoother hopper walls, larger outlets, and force feeders on fast presses.

> [!key] Presses and capsule machines fill by volume, so poor flow becomes variable weight, and variable weight becomes variable dose. A Carr index under about 15 % (Hausner ratio under 1.18) usually flows well; above about 25 % the powder needs help.
`,
  ideas: [
    'Tablet presses and capsule fillers meter volume, so poor flow means variable weight and variable dose.',
    'Cohesion (van der Waals forces, moisture bridges, charge) beats gravity as particles get smaller, so fine powders flow poorly.',
    'Carr index = 100(1 − ρB/ρT) and Hausner ratio = ρT/ρB: the more a powder packs down on tapping, the worse it flows.',
    'Mass flow (first in, first out) needs steep, smooth hopper walls. Funnel flow brings segregation, dead zones and rat-holes.',
    'The discharge rate through an outlet is nearly independent of fill height and grows as the outlet diameter to the power 2.5 (Beverloo).'
  ],
  pitfalls: [
    'A powder drains from a hopper like water, more slowly as it empties — The walls carry most of the weight (the Janssen effect), so the rate through the outlet stays nearly constant until the hopper is almost empty.',
    'A low angle of repose in a lab test guarantees good flow in production — The angle depends on how the heap is made. A powder that pours well from a small funnel can still arch or rat-hole in a large hopper under its own weight, which is why hoppers are designed from shear-cell data.',
    'More glidant always means better flow — Colloidal silica works best at around 0.1–0.5 %. Beyond an optimum, the extra fines make the powder more cohesive again.'
  ],
  formulas: [
    {
      name: 'Carr (compressibility) index',
      expr: 'CI = 1 - rhoB/rhoT', tex: '\\mathrm{CI} = 1 - \\dfrac{\\rho_B}{\\rho_T}',
      vars: {
        CI: { name: 'Carr index', q: 'ratio', unit: '%', tex: '\\mathrm{CI}' },
        rhoB: { name: 'bulk (poured) density', q: 'density', unit: 'g/mL', value: 0.50, tex: '\\rho_B' },
        rhoT: { name: 'tapped density', q: 'density', unit: 'g/mL', value: 0.64, tex: '\\rho_T' }
      },
      note: 'Expressed as a percentage. For the same mass of powder it equals 1 − V_tapped/V_bulk. Under about 15 % usually flows well; over 25 % poorly (USP <1174>).',
      stories: {
        CI: 'A blend has a bulk density of {rhoB} and a tapped density of {rhoT}. What is its Carr index?',
        rhoT: 'A powder with a bulk density of {rhoB} has a Carr index of {CI}. What is its tapped density?'
      }
    },
    {
      name: 'Hausner ratio',
      expr: 'HR = rhoT/rhoB', tex: 'H_R = \\dfrac{\\rho_T}{\\rho_B}',
      vars: {
        HR: { name: 'Hausner ratio', tex: 'H_R' },
        rhoT: { name: 'tapped density', q: 'density', unit: 'g/mL', value: 0.64, tex: '\\rho_T' },
        rhoB: { name: 'bulk (poured) density', q: 'density', unit: 'g/mL', value: 0.50, tex: '\\rho_B' }
      },
      note: 'H_R = 100/(100 − CI). Up to about 1.18 is good flow; above about 1.34 poor.',
      stories: { HR: 'Granules have a bulk density of {rhoB} and a tapped density of {rhoT}. What is their Hausner ratio?' }
    },
    {
      name: 'Angle of repose of a heap',
      expr: 'tan(alpha) = 2*h/D', tex: '\\tan\\alpha = \\dfrac{2h}{D}',
      vars: {
        alpha: { name: 'angle of repose', q: 'angle', unit: '°', min: 0, max: 89.9, tex: '\\alpha' },
        h: { name: 'height of the heap', q: 'length', unit: 'cm', value: 3.0 },
        D: { name: 'diameter of the base', q: 'length', unit: 'cm', value: 10 }
      },
      solveFor: 'alpha',
      note: 'Powder poured through a funnel onto a flat disc of fixed diameter until the heap stops growing. 25–30° is excellent flow, over 45° poor.',
      stories: {
        alpha: 'A powder poured onto a disc {D} across builds a heap {h} high. What is its angle of repose?',
        h: 'How high will a heap of powder with an angle of repose of {alpha} stand on a disc {D} across?'
      }
    },
    {
      name: 'Discharge through an outlet (Beverloo)',
      expr: 'W = C*rhoB*sqrt(g)*(D0 - k*d)^2.5', tex: 'W = C\\,\\rho_B\\sqrt{g}\\,(D_0 - k\\,d)^{5/2}',
      vars: {
        W: { name: 'mass flow rate', q: 'massflow', unit: 'g/s' },
        C: { name: 'discharge coefficient', value: 0.58, fixed: true },
        rhoB: { name: 'bulk density', q: 'density', unit: 'g/mL', value: 0.50, tex: '\\rho_B' },
        g: { const: 'g' },
        D0: { name: 'outlet diameter', q: 'length', unit: 'mm', value: 10, tex: 'D_0' },
        k: { name: 'particle-size correction', value: 1.4, fixed: true },
        d: { name: 'particle size', q: 'length', unit: 'µm', value: 200 }
      },
      note: 'For free-flowing particles through a round outlet at least about six particles wide. The rate hardly depends on the height of powder above the outlet. Cohesive powders flow less than this, or not at all.',
      practice: { unknowns: ['W', 'D0'] },
      stories: {
        W: 'Granules with a bulk density of {rhoB} and a particle size of {d} run out of a round outlet {D0} across. What is the mass flow rate?',
        D0: 'A press needs {W} of granules (bulk density {rhoB}, particle size {d}). What outlet diameter delivers that?'
      }
    }
  ],
  examples: [
    {
      title: 'Before and after granulation',
      q: '50 g of a direct-compression blend fills 100 mL of a graduated cylinder when poured and 78 mL after 1250 taps. After wet granulation, 50 g fills 91 mL and taps down to 81 mL. Classify the flow of each.',
      steps: [
        'Blend: $\\rho_B = 50/100 = 0.500$ g/mL and $\\rho_T = 50/78 = 0.641$ g/mL.',
        'For the same mass the density ratio is the inverse volume ratio: $\\mathrm{CI} = 100(1 - 78/100) = 22$ %, and $H_R = 100/78 = 1.28$ — "passable".',
        'Granules: $\\rho_B = 0.549$ and $\\rho_T = 0.617$ g/mL, so $\\mathrm{CI} = 100(1 - 81/91) = 11.0$ % and $H_R = 91/81 = 1.12$ — "good".'
      ],
      a: 'The blend has a Carr index of 22 % (passable); the granules 11 % (good). Granulation moved it two flow classes.'
    },
    {
      title: 'Is the outlet big enough?',
      q: 'A press makes 3000 tablets of 400 mg a minute from granules with a bulk density of 0.50 g/mL and a mean size of 200 µm, fed from a hopper through a round outlet. Is a 10 mm outlet enough? What is the smallest that would do?',
      steps: [
        'The press needs $3000 \\times 0.400\\,\\mathrm{g}/60\\,\\mathrm{s} = 20$ g/s.',
        'Beverloo at 10 mm: $W = 0.58 \\times 500 \\times \\sqrt{9.81} \\times (0.0100 - 1.4 \\times 0.0002)^{2.5} = 908 \\times 9.3\\times10^{-6} = 0.0085$ kg/s $= 8.5$ g/s. That is not enough.',
        'For 20 g/s: $(D_0 - kd)^{2.5} = 0.020/908 = 2.20\\times10^{-5}$, so $D_0 - kd = 0.0137$ m and $D_0 = 13.7 + 0.28 = 14.0$ mm.',
        'A 20 mm outlet gives $908 \\times 0.0197^{2.5} = 0.050$ kg/s, about 50 g/s, a comfortable margin for surges in demand.'
      ],
      a: 'No: 10 mm gives about 8.5 g/s against the 20 g/s needed. About 14 mm is the minimum; a 20 mm outlet (about 50 g/s) leaves a safe margin.'
    }
  ],
  quiz: [
    { q: 'A powder has a bulk density of 0.45 g/mL and a tapped density of 0.60 g/mL. What is its Carr index (in %)?', answer: 25, why: '100 × (1 − 0.45/0.60) = 25 %, "passable" on the USP scale. Its Hausner ratio is 0.60/0.45 = 1.33.' },
    { q: 'Why does a micronised drug (3 µm) flow far worse than the same drug as 300 µm crystals?', choices: ['smaller particles are denser', 'cohesive forces scale roughly with diameter but weight with its cube, so cohesion dominates small particles', 'small particles hold more water of crystallisation', 'small particles always have a lower angle of repose'], a: 1, why: 'A hundredfold smaller particle has a million times less weight but only about a hundred times less cohesive force, so it sticks instead of rolling. Small particles form steeper heaps, not flatter ones.' },
    { q: 'In a funnel-flow hopper, which powder tends to leave first?', choices: ['the powder loaded first, at the bottom near the walls', 'the powder in the central channel, including powder loaded last that caves in from the top', 'all the powder evenly, layer by layer', 'only the finest particles'], a: 1, why: 'Only a central channel moves. The top surface caves into it, so powder loaded last comes out early, while powder near the walls stays until the end: first in, last out.' },
    { q: 'Powder runs out of a hopper faster when the hopper is full than when it is nearly empty, just as water does.', a: false, why: 'The walls carry most of the weight of a stored powder (the Janssen effect), so the pressure near the outlet stops growing with depth, and the discharge rate stays nearly constant as the hopper empties.' },
    { q: 'Doubling the outlet diameter of a hopper (for particles much smaller than the outlet) multiplies the discharge rate by about…', choices: ['2', '4', '5.7', '8'], a: 2, why: 'By Beverloo, W ∝ D₀^2.5, and 2^2.5 = 5.66.' }
  ],
  problems: [
    { q: 'A powder has a Carr index of 18 %. What is its Hausner ratio?', answer: 1.22, tol: 0.01, steps: ['$H_R = 100/(100 - \\mathrm{CI}) = 100/82 = 1.22$, which is "fair" flow.'] },
    { q: 'Powder poured onto a 10 cm disc forms a heap 4.2 cm high. What is its angle of repose, in degrees?', answer: 40.0, unit: '°', tol: 0.02, steps: ['$\\tan\\alpha = 2h/D = 8.4/10 = 0.84$.', '$\\alpha = \\arctan 0.84 = 40.0°$: fair flow, on the border of passable.'] }
  ],
  applications: [
    'Choosing hopper angles, outlet sizes and feeders for tablet presses and capsule fillers.',
    'Deciding between direct compression and granulation for a new formulation.',
    'Troubleshooting weight variation, segregation and under-filled dies on fast presses.',
    'Bulk solids beyond pharmacy: grain silos, cement, flour and detergent powders.'
  ],
  history: 'H. A. Janssen explained in 1895 why grain presses on a silo floor with a pressure that stops growing with depth. W. A. Beverloo and colleagues published their discharge law for grains in 1961, the same year Andrew Jenike issued the first of his hopper-design bulletins. Ralph Carr proposed his compressibility index in 1965 and Henry Hausner his ratio, for metal powders, in 1967.',
  sim: 'solid-hopper'
},

{
  id: 'granulation', parent: 'powders-tablets', title: 'Granulation', level: 2,
  short: 'Granulation sticks fine particles together into free-flowing granules of about 0.2–1 mm, with a liquid binder (wet granulation) or by pressure (dry granulation). The result flows, does not segregate, compresses well and gives every tablet the same dose.',
  keywords: ['granulation', 'wet granulation', 'dry granulation', 'roller compaction', 'slugging', 'high-shear granulator', 'fluid-bed granulation', 'binder', 'povidone', 'liquid saturation', 'liquid bridges', 'pendular', 'funicular', 'capillary state', 'granulation end point', 'loss on drying', 'twin-screw granulation', 'melt granulation', 'direct compression', 'segregation'],
  prereq: ['powder-flow', 'particle-size', 'physics:surface-tension'],
  related: ['compaction', 'excipients', 'solid-state', 'degradation-pathways', 'tablet-testing', 'qbd', 'chemistry:intermolecular-forces'],
  body: `
### Why granulate
A tablet blend is a mixture of powders with different sizes and densities. When it is poured, shaken and fed, it can **segregate**: fine drug particles sift down through coarse filler, and tablets made at the end of a batch contain a different dose from those made at the start. Granulation locks drug and excipients together inside each granule, so a mixture that was uniform stays uniform. It also turns a cohesive, dusty powder into granules that flow ([[powder-flow]]), packs more mass into each die, and often helps the tablet bond ([[compaction]]).

### Wet granulation
This is the classic route. The dry powders are mixed, and a binder solution (povidone, hydroxypropyl cellulose, hypromellose or starch paste, in water or ethanol) is added while the impeller and chopper of a high-shear mixer work the mass. The wet granules are sieved, dried (usually in a fluid bed) to a target **loss on drying**, often 1–3 %, and milled to size. Granules form in three overlapping steps:
1. **Wetting and nucleation**: droplets gather particles into nuclei.
2. **Consolidation and growth**: collisions squeeze granules denser and make them stick together.
3. **Breakage** by the impeller and chopper, which limits their size.

What holds a wet granule together is liquid. Bridges between particles pull them together by surface tension and capillary suction. The **liquid saturation** $S$, the fraction of the pore space that is filled with liquid, decides how the mass behaves:

| Saturation | State | Behaviour |
|---|---|---|
| below about 25 % | pendular | separate liquid bridges; weak, dusty granules |
| about 25–80 % | funicular | bridges join up; granules grow |
| about 80–100 % | capillary | pores full; strongest wet granules, the usual end point |
| over 100 % | droplet | liquid on the surface; a paste |

$$S = \\frac{H\\,(1-\\varepsilon)\\,\\rho_s}{\\varepsilon\\,\\rho_l}$$

Here $H$ is the mass of liquid per mass of dry powder, $\\varepsilon$ the granule porosity, and $\\rho_s$ and $\\rho_l$ the densities of the solid and the liquid. Massing squeezes granules denser, so $\\varepsilon$ falls and $S$ rises even when no more liquid is added. This is why massing for too long turns a good granulation into a paste.

Rumpf's estimate of the strength of a wet granule shows why fine primary particles make strong granules:

$$\\sigma \\approx S\\,C\\,\\frac{1-\\varepsilon}{\\varepsilon}\\,\\frac{\\gamma\\cos\\theta}{d}$$

The strength is inversely proportional to the particle size $d$. In practice the **end point** is judged from the power or torque drawn by the impeller. It climbs as liquid bridges form and levels off in the capillary state.

### Dry granulation
Some drugs hydrolyse, change crystal form in water ([[solid-state]]) or cannot stand the heat of drying. These are granulated **dry**: a roller compactor squeezes the blend into a ribbon between two counter-rotating rolls, and the ribbon is milled into granules. The older method, "slugging", pressed large crude tablets and broke them up. Dry granulation has a price: powder that has been compressed once bonds less well the second time, so the final tablets are weaker.

### Other routes
**Direct compression** skips granulation altogether, using free-flowing, compressible excipient grades. It is the cheapest option, with the fewest steps, and works when the dose is small or the drug itself flows and bonds well. **Melt granulation** uses a molten binder such as a polyethylene glycol. **Twin-screw granulation** performs wet granulation continuously in an extruder, part of the move to continuous manufacturing described in the ICH Q13 guideline (2022).

> [!tip] A rule of thumb: use direct compression if you can, dry granulation if water or heat is a problem, and wet granulation when the powder will not flow or bond any other way, or when a low-dose drug must stay uniform.
`,
  ideas: [
    'Granules lock drug and excipients together, which prevents segregation and keeps the dose uniform.',
    'Wet granules are held by liquid bridges. The liquid saturation S = H(1 − ε)ρs/(ερl) sets the state, from pendular to capillary to paste.',
    'Massing makes granules denser, which raises the saturation without any extra liquid.',
    'Finer primary particles give stronger granules (Rumpf: strength ∝ 1/d).',
    'Dry granulation (roller compaction) avoids water and heat, at the cost of some compressibility.'
  ],
  pitfalls: [
    'The granulation end point is a fixed amount of liquid — The same liquid gives a higher saturation as granules consolidate, and batches of excipient differ in how much water they absorb. End points are judged from impeller power or torque and from the granules themselves, not from a volume alone.',
    'Drier granules are always better — Overdried granules can compress poorly and give weak or capped tablets; a little residual moisture helps particles bond. The target loss on drying is a range, not "as low as possible".',
    'Dry granulation is just wet granulation without water — Compressing a powder twice uses up part of its ability to bond, so tablets from roller-compacted granules are usually weaker at the same pressure.'
  ],
  formulas: [
    {
      name: 'Liquid saturation of a wet granule',
      expr: 'S = H*(1 - eps)*rhos/(eps*rhol)', tex: 'S = \\dfrac{H\\,(1-\\varepsilon)\\,\\rho_s}{\\varepsilon\\,\\rho_l}',
      vars: {
        S: { name: 'liquid saturation of the pores', q: 'ratio', unit: '%' },
        H: { name: 'liquid-to-solid mass ratio', q: 'ratio', unit: '%', value: 12 },
        eps: { name: 'granule porosity', q: 'ratio', unit: '%', value: 35, min: 1, max: 99, tex: '\\varepsilon' },
        rhos: { name: 'true density of the solids', q: 'density', unit: 'g/mL', value: 1.5, tex: '\\rho_s' },
        rhol: { name: 'density of the liquid', q: 'density', unit: 'g/mL', value: 1.0, tex: '\\rho_l' }
      },
      note: 'Pendular below about 25 %, funicular to about 80 %, capillary near 80–100 %, and a paste above 100 %.',
      practice: { unknowns: ['S', 'H', 'eps'] },
      stories: {
        S: 'Powder is granulated with liquid equal to {H} of its mass. The granules have a porosity of {eps}, the solids a density of {rhos} and the liquid {rhol}. What fraction of the pore space is filled?',
        H: 'How much liquid, as a fraction of the powder mass, fills {S} of the pores of granules with a porosity of {eps} (solids {rhos}, liquid {rhol})?'
      }
    },
    {
      name: 'Strength of a wet granule (Rumpf)',
      expr: 'sigma = S*C*(1 - eps)/eps*gamma*cos(theta)/d', tex: '\\sigma = S\\,C\\,\\dfrac{1-\\varepsilon}{\\varepsilon}\\,\\dfrac{\\gamma\\cos\\theta}{d}',
      vars: {
        sigma: { name: 'tensile strength of the wet granule', q: 'stress', unit: 'kPa', tex: '\\sigma' },
        S: { name: 'liquid saturation', q: 'ratio', unit: '%', value: 50 },
        C: { name: 'packing constant', value: 6, fixed: true },
        eps: { name: 'granule porosity', q: 'ratio', unit: '%', value: 35, min: 1, max: 99, tex: '\\varepsilon' },
        gamma: { name: 'surface tension of the liquid', q: 'surfacetension', unit: 'mN/m', value: 72, tex: '\\gamma' },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 30, min: 0, max: 89.9, tex: '\\theta' },
        d: { name: 'primary particle size', q: 'length', unit: 'µm', value: 20 }
      },
      note: 'Rumpf\'s estimate for liquid bridges (C ≈ 6 for many packings). Real granules under shear are also held by the viscosity of the binder.',
      practice: { unknowns: ['sigma', 'd'] },
      stories: { sigma: 'Granules of {d} particles with a porosity of {eps} are {S} saturated with a liquid of surface tension {gamma} (contact angle {theta}). How strong are they?' }
    },
    {
      name: 'Loss on drying',
      expr: 'LOD = (mw - md)/mw', tex: '\\mathrm{LOD} = \\dfrac{m_w - m_d}{m_w}',
      vars: {
        LOD: { name: 'loss on drying', q: 'ratio', unit: '%', tex: '\\mathrm{LOD}' },
        mw: { name: 'mass before drying', q: 'mass', unit: 'g', value: 5.000, tex: 'm_w' },
        md: { name: 'mass after drying', q: 'mass', unit: 'g', value: 4.880, tex: 'm_d' }
      },
      note: 'A sample is weighed before and after drying (in an oven at 105 °C, or in an infrared moisture balance). Granules are often dried to about 1–3 %.',
      stories: { LOD: 'A {mw} sample of granules weighs {md} after drying. What is its loss on drying?' }
    }
  ],
  examples: [
    {
      title: 'How wet is the granulation?',
      q: 'A 10 kg blend (true density 1.5 g/mL) is granulated with 1.2 kg of aqueous binder solution. Early in massing the granules have a porosity of 35 %; after five minutes it has fallen to 25 %. What is the liquid saturation at each stage?',
      steps: [
        'Treating the whole solution as liquid: $H = 1.2/10 = 0.12$.',
        'At $\\varepsilon = 0.35$: $S = 0.12 \\times 0.65 \\times 1.5/(0.35 \\times 1.0) = 0.33$, which is funicular.',
        'At $\\varepsilon = 0.25$: $S = 0.12 \\times 0.75 \\times 1.5/0.25 = 0.54$.',
        'The same liquid fills more of a denser granule, so further massing pushes the granulation towards the capillary state and eventually past it.'
      ],
      a: '33 % at first and 54 % after massing: consolidation alone raised the saturation by more than half.'
    },
    {
      title: 'Drying to a target',
      q: '12.0 kg of wet granules have a loss on drying of 20 %. They are dried to 2.0 %. How much water does the dryer remove?',
      steps: [
        'Loss on drying is the fraction of the wet mass that is water, so the dry solids are $12.0 \\times 0.80 = 9.60$ kg.',
        'At 2.0 % the dried granules weigh $9.60/0.98 = 9.80$ kg.',
        'Water removed: $12.0 - 9.80 = 2.20$ kg.'
      ],
      a: 'About 2.2 kg of water.'
    }
  ],
  quiz: [
    { q: 'A drug hydrolyses readily and changes crystal form when wet. Which route suits it best?', choices: ['wet granulation with water', 'dry granulation by roller compaction, or direct compression', 'wet granulation with a longer drying time', 'melt granulation above the melting point of the drug'], a: 1, why: 'Dry granulation and direct compression avoid water and heat altogether. A longer drying time only adds heat, and melting the drug would destroy its crystal form.' },
    { q: 'Continuing to mass a wet granulation without adding liquid raises its liquid saturation.', a: true, why: 'Massing consolidates the granules: their porosity falls, so the same liquid fills a larger fraction of the pores (S grows as (1 − ε)/ε).' },
    { q: 'By Rumpf\'s estimate, granules made from 5 µm primary particles, compared with 20 µm particles at the same saturation and porosity, are…', choices: ['a quarter as strong', 'equally strong', 'twice as strong', 'four times as strong'], a: 3, why: 'Strength ∝ 1/d: a quarter of the size gives four times the strength, because there are more liquid bridges per unit area.' },
    { q: 'Why does granulation improve the content uniformity of a low-dose tablet?', choices: ['it breaks up drug particles that are too big', 'it locks drug and excipients together in each granule, so they cannot separate by size or density during handling', 'drying evaporates any excess drug', 'it makes every granule exactly the same size'], a: 1, why: 'Segregation needs particles that can move independently. Once drug is bound inside granules, sieving and vibration during transfer cannot separate it from the excipients.' },
    { q: 'A 5.00 g sample of granules weighs 4.91 g after drying. What is its loss on drying (in %)?', answer: 1.8, why: '(5.00 − 4.91)/5.00 = 0.018, or 1.8 %.' }
  ],
  problems: [
    { q: 'What liquid-to-solid mass ratio (in %) gives a saturation of 90 % in granules with a porosity of 30 % (solids 1.5 g/mL, water 1.0 g/mL)?', answer: 25.7, tol: 0.02, steps: ['$H = S\\,\\varepsilon\\,\\rho_l/((1-\\varepsilon)\\,\\rho_s) = 0.9 \\times 0.30 \\times 1.0/(0.70 \\times 1.5)$.', '$H = 0.27/1.05 = 0.257$, or 25.7 % of the powder mass.'] }
  ],
  applications: [
    'Keeping low-dose tablets uniform, and making high-dose tablets compressible.',
    'Roller compaction for moisture- and heat-sensitive drugs.',
    'Continuous twin-screw granulation lines with in-line monitoring.',
    'Fertilisers, detergents and food powders are granulated for the same reasons.'
  ],
  history: 'Wet granulation began with the hand methods of nineteenth-century pharmacy: a damp mass forced through a sieve and dried on trays. High-shear granulators, common from the 1970s, cut the process to minutes. Work by Iveson, Litster, Hapgood and Ennis, reviewed in 2001, turned granulation from an art into engineering, with regime maps for nucleation, growth and breakage.',
  sim: 'solid-granulator'
},

{
  id: 'compaction', parent: 'powders-tablets', title: 'Tablet compression and compaction', level: 2,
  short: 'A tablet press squeezes powder in a die at about 50–300 MPa for a few milliseconds. The particles rearrange, deform plastically or fragment, and bond. The Heckel equation reads the kind of deformation from how porosity falls with pressure, and elastic recovery on release is what makes tablets cap and laminate.',
  keywords: ['compression', 'compaction', 'tablet press', 'rotary press', 'punch', 'die', 'dwell time', 'pre-compression', 'Heckel equation', 'mean yield pressure', 'relative density', 'porosity', 'plastic deformation', 'brittle fracture', 'elastic recovery', 'capping', 'lamination', 'sticking', 'tabletability', 'Ryshkewitch–Duckworth', 'strain-rate sensitivity', 'tensile strength'],
  prereq: ['powder-flow', 'granulation', 'physics:pressure', 'physics:stress-strain'],
  related: ['excipients', 'tablet-testing', 'tablet-coating', 'solid-state', 'odt', 'printing-medicines', 'physics:elasticity'],
  body: `
### The press cycle
A single-punch press, and every station of a rotary press, goes through the same cycle:
1. **Fill**: the lower punch drops and powder flows from the feed frame into the die. The fill depth sets the tablet weight.
2. **Pre-compression**: a small roller presses the punches together at a fraction of the final force. This pushes out air and starts the rearrangement.
3. **Main compression**: the punch heads pass under the main rollers. Forces of 5–30 kN on a 10 mm punch give pressures of about 60–380 MPa. The flat part of each punch head holds the force at its peak for the **dwell time**, a few milliseconds on a fast press.
4. **Decompression and ejection**: the upper punch lifts, the tablet expands slightly, and the lower punch pushes it out of the die to be swept off.

A 36-station press at 60 rpm makes 2160 tablets a minute. Its punches travel at about 1.3 m/s and cross a 10 mm flat in about 8 ms.

### What the powder does
First the particles **rearrange** into the gaps between them. Then they deform, in one or more of three ways:
- **Elastic** deformation is recoverable, like a spring. The stored energy comes back when the pressure is released and pushes the tablet apart.
- **Plastic** deformation is permanent flow, which creates large areas of contact. Microcrystalline cellulose, starch and many polymers behave this way, and plastic flow takes time.
- **Brittle fracture** breaks particles into fragments with fresh, clean surfaces. Lactose and dibasic calcium phosphate behave this way, largely regardless of speed.

Bonds form where surfaces meet: van der Waals forces and hydrogen bonds over the contact area, mechanical interlocking, and sometimes solid bridges where local heating briefly melts the surface roughness.

### Porosity and the Heckel equation
The relative density $D$ of a compact is its apparent density divided by the true density of the solid, and its porosity is $\\varepsilon = 1 - D$. Heckel (1961) treated densification like a first-order reaction, with pressure in place of time: the rate at which pores disappear is proportional to the pores that are left. So

$$\\ln\\frac{1}{1 - D} = \\frac{P}{P_y} + A$$

The **mean yield pressure** $P_y$ (the inverse of the slope $K$) ranks materials. It is roughly below 100 MPa for plastic materials such as microcrystalline cellulose, about 150–250 MPa for lactose, and several hundred MPa for dibasic calcium phosphate. A low $P_y$ means the material densifies easily. A real Heckel plot curves at low pressure, where rearrangement dominates, and its slope depends on speed and on whether $D$ is measured in the die or after ejection. $P_y$ is a way to compare materials, not a material constant.

### Strength
A tablet's strength is judged by its **tensile strength** ([[tablet-testing]]). It rises with compaction pressure (the "tabletability" curve) and falls roughly exponentially with porosity (the Ryshkewitch–Duckworth relation, $\\sigma = \\sigma_0 e^{-b\\varepsilon}$). About 1–2 MPa is usually enough for a tablet to survive coating and packing. Past a certain pressure, extra force adds little strength but stores more elastic energy, and so more risk of capping.

### When tablets fail
| Defect | What you see | Usual causes |
|---|---|---|
| Capping | the top comes off as a cap | elastic recovery, trapped air, high speed, too many fines, worn tooling |
| Lamination | the tablet splits into layers | the same causes as capping; too much pressure |
| Sticking and picking | powder stuck to punch faces or their lettering | moisture, too little lubricant, low-melting ingredients |
| Weight variation | tablets differ in weight | poor flow, too high a speed |

Plastic materials are **strain-rate sensitive**: with a shorter dwell time they have less time to flow and bond. A formulation that works at 20 rpm may therefore cap at 80 rpm. The remedies are pre-compression, a slower speed, a more plastic filler or binder, and granulation.

> [!key] Compaction turns loose powder into a solid by squeezing out pores and making bonds. Plastic flow helps bonding, elastic recovery undoes it on release, and speed shortens the time that plastic materials have to flow.
`,
  ideas: [
    'The press cycle is fill, pre-compression, main compression with a millisecond dwell, decompression and ejection.',
    'Particles rearrange, then deform elastically, plastically or by brittle fracture. Plastic flow and fresh fracture surfaces make bonds.',
    'Heckel: ln[1/(1 − D)] = P/Py + A. A low mean yield pressure Py means a plastic, easily densified material.',
    'Tensile strength rises with pressure and falls exponentially with porosity (σ = σ0 e^(−bε)).',
    'Elastic recovery, trapped air and high speed cause capping and lamination. Plastic materials are the most sensitive to speed.'
  ],
  pitfalls: [
    'More force always makes a better tablet — Strength levels off as porosity approaches its minimum, while stored elastic energy keeps growing. Over-compressed tablets cap, laminate and disintegrate slowly.',
    'A formulation that runs on the development press will run on the production press — A production press may shorten the dwell time several-fold. Plastic, strain-rate-sensitive materials then bond less, and tablets can cap at full speed.',
    'The Heckel yield pressure is a fixed property of a material — It changes with punch speed, particle size and whether density is measured in the die or after ejection. It is useful for comparing materials under the same conditions.'
  ],
  formulas: [
    {
      name: 'Compaction pressure on a round punch',
      expr: 'P = 4*F/(pi*d^2)', tex: 'P = \\dfrac{4F}{\\pi d^2}',
      vars: {
        P: { name: 'compaction pressure', q: 'pressure', unit: 'MPa' },
        F: { name: 'punch force', q: 'force', unit: 'kN', value: 10 },
        d: { name: 'punch (tablet) diameter', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'For a flat-faced round punch. Presses display force; pressure is what matters to the powder, so the same force gives four times the pressure on a punch of half the diameter.',
      stories: {
        P: 'A {d} punch presses a tablet with a force of {F}. What is the compaction pressure?',
        F: 'A tablet of diameter {d} needs a compaction pressure of {P}. What force must the press apply?'
      }
    },
    {
      name: 'Relative density of a flat tablet',
      expr: 'D = 4*m/(pi*d^2*h*rhot)', tex: 'D = \\dfrac{4m}{\\pi d^2 h\\,\\rho_t}',
      vars: {
        D: { name: 'relative density (1 − porosity)', q: 'ratio', unit: '%' },
        m: { name: 'tablet mass', q: 'mass', unit: 'mg', value: 400 },
        d: { name: 'tablet diameter', q: 'length', unit: 'mm', value: 10 },
        h: { name: 'tablet thickness', q: 'length', unit: 'mm', value: 4.0 },
        rhot: { name: 'true density of the powder', q: 'density', unit: 'g/mL', value: 1.5, tex: '\\rho_t' }
      },
      note: 'For a flat-faced cylindrical tablet. The porosity is ε = 1 − D.',
      practice: { unknowns: ['D', 'h'] },
      stories: {
        D: 'A flat tablet of {m} is {d} across and {h} thick; the powder has a true density of {rhot}. What is its relative density?',
        h: 'How thick is a {m} flat tablet, {d} across, compressed to a relative density of {D} (true density {rhot})?'
      }
    },
    {
      name: 'Heckel equation',
      expr: 'ln(1/(1 - D)) = P/Py + A', tex: '\\ln\\dfrac{1}{1 - D} = \\dfrac{P}{P_y} + A',
      vars: {
        D: { name: 'relative density', q: 'ratio', unit: '%', min: 0, max: 99.999 },
        P: { name: 'compaction pressure', q: 'pressure', unit: 'MPa', value: 150 },
        Py: { name: 'mean yield pressure', q: 'pressure', unit: 'MPa', value: 100, tex: 'P_y' },
        A: { name: 'intercept (die filling and rearrangement)', value: 0.4 }
      },
      solveFor: 'D',
      note: 'Fitted to the straight middle part of a plot of ln[1/(1 − D)] against P. Py below about 100 MPa suggests plastic deformation; several hundred MPa, brittle or hard material.',
      practice: { unknowns: ['D', 'Py'] },
      stories: {
        D: 'A powder with a mean yield pressure of {Py} and a Heckel intercept of {A} is compressed at {P}. What relative density does it reach?',
        Py: 'Compressed at {P}, a powder reaches a relative density of {D}; the Heckel intercept is {A}. What is its mean yield pressure?'
      }
    },
    {
      name: 'Strength and porosity (Ryshkewitch–Duckworth)',
      expr: 'sigma = sigma0*exp(-b*eps)', tex: '\\sigma = \\sigma_0\\,e^{-b\\varepsilon}',
      vars: {
        sigma: { name: 'tensile strength', q: 'stress', unit: 'MPa', tex: '\\sigma' },
        sigma0: { name: 'tensile strength at zero porosity', q: 'stress', unit: 'MPa', value: 12, tex: '\\sigma_0' },
        b: { name: 'bonding constant', value: 10 },
        eps: { name: 'porosity', q: 'ratio', unit: '%', value: 15, tex: '\\varepsilon' }
      },
      note: 'An empirical fit from ceramics. σ0 and b are found by plotting ln σ against porosity for tablets made at several pressures.',
      practice: { unknowns: ['sigma', 'eps'] },
      stories: {
        sigma: 'For a blend with σ0 = {sigma0} and b = {b}, what is the tensile strength of tablets with a porosity of {eps}?',
        eps: 'Tablets of a blend with σ0 = {sigma0} and b = {b} must reach a tensile strength of {sigma}. What is the highest porosity allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'From force to Heckel yield pressure',
      q: 'A 10 mm flat-faced punch applies 12 kN. At peak pressure the 400 mg compact is 4.0 mm thick in the die, and the powder\'s true density is 1.5 g/mL. The Heckel intercept for this powder is 0.35. What are the pressure, the relative density and the mean yield pressure?',
      steps: [
        '$P = 4 \\times 12\\,000/(\\pi \\times 0.010^2) = 1.53\\times10^{8}$ Pa $= 153$ MPa.',
        'In centimetres and grams: $D = 4 \\times 0.400/(\\pi \\times 1.00^2 \\times 0.400 \\times 1.5) = 1.60/1.885 = 0.849$, a porosity of 15.1 %.',
        '$\\ln(1/0.151) = 1.89$, so $P/P_y = 1.89 - 0.35 = 1.54$ and $P_y = 153/1.54 = 99$ MPa.',
        'A yield pressure near 100 MPa points to a mainly plastic material, such as microcrystalline cellulose.'
      ],
      a: 'About 153 MPa, a relative density of 0.85 (porosity 15 %) and a mean yield pressure of about 99 MPa.'
    },
    {
      title: 'Is more pressure worth it?',
      q: 'For the same powder (Py = 99 MPa, A = 0.35, and σ = 12 MPa × e^(−10ε)), compare the porosity and tensile strength at 153 MPa and at 200 MPa.',
      steps: [
        'At 200 MPa: $\\ln[1/(1-D)] = 200/99 + 0.35 = 2.37$, so $1 - D = e^{-2.37} = 0.094$, a porosity of 9.4 %.',
        'Strength at 15.1 %: $12\\,e^{-1.51} = 2.65$ MPa. At 9.4 %: $12\\,e^{-0.94} = 4.69$ MPa.',
        'So 31 % more pressure gives about 77 % more strength, as long as the extra elastic energy does not make the tablets cap. That has to be checked on the press, at production speed.'
      ],
      a: 'Porosity falls from 15 % to 9 % and strength rises from about 2.6 to 4.7 MPa.'
    }
  ],
  quiz: [
    { q: 'Which kind of material is most affected by running the press faster?', choices: ['brittle materials such as dibasic calcium phosphate', 'plastic materials such as microcrystalline cellulose', 'all materials equally', 'none, because dwell time does not matter'], a: 1, why: 'Plastic flow takes time. With a shorter dwell time, plastic materials deform and bond less (strain-rate sensitivity). Brittle fragmentation is nearly instantaneous, so brittle materials barely notice the speed.' },
    { q: 'A 10 mm flat-faced punch applies 15 kN. What is the compaction pressure, in MPa?', answer: 191, unit: 'MPa', why: 'P = 4F/(πd²) = 60 000/(π × 10⁻⁴) = 1.91 × 10⁸ Pa = 191 MPa.' },
    { q: 'In a Heckel analysis, a lower mean yield pressure Py means the material…', choices: ['is harder and densifies only at high pressure', 'deforms plastically at lower pressure and densifies easily', 'is more elastic', 'must be brittle'], a: 1, why: 'Py is the inverse of the slope K. A steep slope (small Py) means porosity falls quickly with pressure, which is typical of plastic materials.' },
    { q: 'Doubling the compression force always doubles the tablet strength.', a: false, why: 'Strength follows porosity, which approaches a minimum. Beyond that point more force adds little strength but stores more elastic energy, which can cause capping.' },
    { q: 'Tablets start to cap when a batch is moved to a fast production press. Which change is most likely to help?', choices: ['switch off pre-compression', 'use pre-compression and a slower turret speed', 'replace the filler with a more elastic one', 'mill the granules to a fine powder'], a: 1, why: 'Pre-compression removes air, and a slower turret gives a longer dwell time for plastic flow and bonding. A more elastic filler or more fines would make capping worse.' }
  ],
  problems: [
    { q: 'Tablets of a blend with σ0 = 10 MPa and b = 8 have a porosity of 12 %. What is their tensile strength, in MPa?', answer: 3.83, unit: 'MPa', tol: 0.02, steps: ['$\\sigma = 10\\,e^{-8 \\times 0.12} = 10\\,e^{-0.96}$.', '$\\sigma = 10 \\times 0.383 = 3.83$ MPa.'] },
    { q: 'A 12 mm flat punch is to apply 150 MPa. What force is needed, in kN?', answer: 17.0, unit: 'kN', tol: 0.02, steps: ['$F = P\\,\\pi d^2/4 = 1.5\\times10^{8} \\times \\pi \\times 0.012^2/4$.', '$F = 1.5\\times10^{8} \\times 1.131\\times10^{-4} = 16\\,960$ N, about 17.0 kN.'] }
  ],
  applications: [
    'Choosing fillers and binders: plastic ones for bonding, brittle ones for insensitivity to speed, often mixed.',
    'Scaling up from a slow development press to a fast production press, using compaction simulators that mimic the speed.',
    'Troubleshooting capping, lamination and sticking.',
    'The same physics compacts metal and ceramic powders in powder metallurgy.'
  ],
  history: 'William Brockedon patented a hand-operated punch and die for compressing powders into pills in 1843, and rotary presses followed from the 1870s. R. W. Heckel published his analysis of powder compaction in 1961, borrowing from powder metallurgy; the porosity–strength relation of Ryshkewitch and Duckworth (1953) came from ceramics.',
  sim: 'solid-press'
},

{
  id: 'excipients', parent: 'powders-tablets', title: 'Excipients and their jobs', level: 1,
  short: 'Most of a tablet is not drug. Fillers give it size, binders hold it together, disintegrants break it apart in the stomach, and glidants and lubricants let it flow and leave the die. Coatings, colours and flavours finish it. Each excipient has a job, and none is truly inert.',
  keywords: ['excipient', 'filler', 'diluent', 'binder', 'disintegrant', 'superdisintegrant', 'croscarmellose sodium', 'sodium starch glycolate', 'crospovidone', 'glidant', 'lubricant', 'magnesium stearate', 'lactose', 'microcrystalline cellulose', 'mannitol', 'povidone', 'excipients with known effect', 'Maillard reaction', 'over-lubrication', 'functionality-related characteristics', 'direct compression'],
  prereq: ['what-is-a-drug', 'powder-flow', 'granulation'],
  related: ['compaction', 'excipient-compatibility', 'tablet-coating', 'odt', 'capsules', 'degradation-pathways', 'gmp', 'surfactants'],
  body: `
A tablet containing 5 mg of drug may weigh 150 mg, so 97 % of it is **excipients**. They make a potent drug big enough to handle and dose accurately, carry it through a tablet press at thousands a minute, and make sure it falls apart and dissolves when swallowed, or deliberately does not.

### The jobs
| Job | What it does | Examples (typical level) |
|---|---|---|
| Filler (diluent) | bulk and compressibility | lactose, microcrystalline cellulose, mannitol, dibasic calcium phosphate, starch |
| Binder | holds the particles together | povidone, hydroxypropyl cellulose, hypromellose, pregelatinised starch (2–5 %) |
| Disintegrant | breaks the tablet apart in water | croscarmellose sodium, sodium starch glycolate, crospovidone (2–5 %); starch (5–15 %) |
| Glidant | improves flow | colloidal silicon dioxide (0.1–0.5 %), talc |
| Lubricant | lets the tablet leave the die | magnesium stearate (0.25–1 %), sodium stearyl fumarate |
| Wetting agent | helps water into a hydrophobic drug | sodium lauryl sulfate, polysorbate 80 |
| Coating and colour | protection, identity, release control | hypromellose, polyvinyl alcohol, methacrylate copolymers, iron oxides |
| Sweeteners, flavours | taste | sucralose, aspartame, mannitol, flavours |

Fillers are chosen partly for how they compress ([[compaction]]). Microcrystalline cellulose deforms plastically and bonds strongly; lactose and dibasic calcium phosphate fragment. Many formulations mix the two. Special grades such as spray-dried lactose, granular mannitol and co-processed excipients are made for direct compression, where the blend must flow and bond without being granulated.

### How disintegrants work
The "superdisintegrants" are cross-linked polymers that cannot dissolve. Water wicks into the tablet along its pores, and the disintegrant particles swell several-fold and push the bonds apart; some also spring back from the shape they were squeezed into. That is how a tablet can fall apart within seconds or minutes ([[odt]]). Effervescent tablets use a different trick: an acid and a carbonate that release carbon dioxide in water.

### Not inert
- **Magnesium stearate** is water-repellent. Mixed for too long, it coats the particles in a film that weakens tablets and slows dissolution ("over-lubrication").
- **Lactose** is a reducing sugar. With drugs that carry primary or secondary amine groups it can undergo the **Maillard reaction** and turn brown ([[excipient-compatibility]]).
- **Povidone and polysorbates** can carry traces of peroxides that oxidise sensitive drugs, and **microcrystalline cellulose and starch** hold water that can drive hydrolysis ([[degradation-pathways]]).
- Batches and suppliers differ in particle size, moisture and viscosity grade, which can change how a product behaves. Pharmacopoeias list **functionality-related characteristics** to control.

### Excipients and patients
Some excipients matter to some people: lactose (in lactose intolerance, usually only in larger amounts), aspartame (a source of phenylalanine, important in phenylketonuria), sodium (in effervescent tablets, relevant to a salt-restricted diet), gelatin of animal origin, some colourants, and ethanol or propylene glycol in liquids for infants. In the European Union, "excipients with known effect" must be named on the label and in the leaflet.

> [!warn] Excipients have caused some of pharmacy's worst disasters. Diethylene glycol, used as a solvent or contaminating one, killed more than 100 people in the United States in 1937 and hundreds of children in several countries since, most recently in 2022–2023. That is why excipients are tested and made under good manufacturing practice ([[gmp]]). If you are worried about an ingredient in a medicine, ask a pharmacist.
`,
  ideas: [
    'Excipients usually make up most of a tablet, and each has a job: filler, binder, disintegrant, glidant, lubricant, coating.',
    'Superdisintegrants are insoluble, cross-linked polymers that draw in water and swell, bursting the tablet apart.',
    'Magnesium stearate is needed at under 1 %, and over-mixing it weakens tablets and slows dissolution.',
    'Excipients can react with drugs (lactose with amines, peroxides with oxidisable drugs) and can matter to patients (lactose, aspartame, sodium).',
    'Low-dose tablets are mostly filler, so their uniformity depends on mixing, not just on weight.'
  ],
  pitfalls: [
    'Excipients are inert fillers — They change how a tablet flows, bonds, disintegrates and dissolves, they can react with the drug, and a few matter to particular patients.',
    'Two products with the same drug and dose behave the same — A different filler, lubricant level or disintegrant can change dissolution and, occasionally, absorption. That is why generics must show bioequivalence ([[bioequivalence]]).',
    'The more lubricant, the easier the tableting — Beyond about 1 % magnesium stearate, or with long mixing, tablets get weaker and dissolve more slowly. Only enough to eject cleanly is used.'
  ],
  formulas: [
    {
      name: 'Drug loading',
      expr: 'w = dose/m', tex: 'w = \\dfrac{m_{\\mathrm{drug}}}{m_{\\mathrm{tab}}}',
      vars: {
        w: { name: 'drug loading', q: 'ratio', unit: '%' },
        dose: { name: 'drug per tablet', q: 'mass', unit: 'mg', value: 10, tex: 'm_{\\mathrm{drug}}' },
        m: { name: 'tablet mass', q: 'mass', unit: 'mg', value: 200, tex: 'm_{\\mathrm{tab}}' }
      },
      note: 'Under about 25 mg or 25 % of the tablet, the pharmacopoeias ask for content uniformity to be shown by assaying single tablets, not by weighing them.',
      stories: {
        w: 'A {m} tablet contains {dose} of drug. What is the drug loading?',
        m: 'A tablet must contain {dose} of drug at a loading of {w}. How heavy is it?'
      }
    },
    {
      name: 'Filler needed to make up the weight',
      expr: 'mf = m*(1 - fx) - dose', tex: 'm_f = m_{\\mathrm{tab}}\\,(1 - f_x) - m_{\\mathrm{drug}}',
      vars: {
        mf: { name: 'filler per tablet', q: 'mass', unit: 'mg', tex: 'm_f' },
        m: { name: 'tablet mass', q: 'mass', unit: 'mg', value: 200, tex: 'm_{\\mathrm{tab}}' },
        fx: { name: 'fraction taken by the other excipients', q: 'ratio', unit: '%', value: 7.8, tex: 'f_x' },
        dose: { name: 'drug per tablet', q: 'mass', unit: 'mg', value: 10, tex: 'm_{\\mathrm{drug}}' }
      },
      note: 'f_x adds up the binder, disintegrant, glidant and lubricant, each given as a fraction of the tablet mass.',
      stories: { mf: 'A {m} tablet holds {dose} of drug, and the other excipients make up {fx} of it. How much filler is needed?' }
    }
  ],
  examples: [
    {
      title: 'Making up a tablet',
      q: 'A hypothetical 10 mg drug is to be made into 200 mg tablets with 4 % povidone, 3 % croscarmellose sodium, 0.5 % magnesium stearate and 0.3 % colloidal silicon dioxide, the rest filler. How much filler goes into each tablet?',
      steps: [
        'The other excipients take $4 + 3 + 0.5 + 0.3 = 7.8$ % of 200 mg, which is 15.6 mg.',
        'Filler: $200 \\times (1 - 0.078) - 10 = 184.4 - 10 = 174.4$ mg, or 87 % of the tablet.',
        'The drug loading is $10/200 = 5$ %. Because it is under 25 mg and 25 %, uniformity must be shown by assaying single tablets.'
      ],
      a: '174.4 mg of filler; the drug is 5 % of the tablet.'
    },
    {
      title: 'Choosing a filler for an amine drug',
      q: 'A hypothetical drug has a primary amine group, and a trial formulation with lactose turns yellow-brown after a month at 40 °C/75 % RH. What is happening, and what could replace the lactose?',
      steps: [
        'Lactose is a reducing sugar. Its open-chain aldehyde reacts with primary and secondary amines (the Maillard reaction), faster when warm and moist.',
        'Non-reducing fillers avoid the reaction: mannitol, microcrystalline cellulose or dibasic calcium phosphate.',
        'The replacement is confirmed with compatibility studies and then a formal stability study.'
      ],
      a: 'A Maillard reaction between lactose and the amine. A non-reducing filler such as mannitol or microcrystalline cellulose avoids it.'
    }
  ],
  quiz: [
    { q: 'A blend is mixed for 30 minutes after magnesium stearate is added, instead of the usual 3 minutes. What is most likely?', choices: ['stronger tablets that dissolve faster', 'weaker tablets that dissolve more slowly', 'no change at all', 'heavier tablets'], a: 1, why: 'Long mixing smears the water-repellent stearate over the particles. This weakens bonding and keeps water out, so the tablets are weaker and dissolve more slowly.' },
    { q: 'Tablets of a drug with a primary amine group turn brown at 40 °C/75 % RH. Which filler is the likely culprit?', choices: ['microcrystalline cellulose', 'lactose', 'dibasic calcium phosphate', 'colloidal silicon dioxide'], a: 1, why: 'Lactose is a reducing sugar and takes part in the Maillard reaction with amines. The others are not reducing sugars.' },
    { q: 'How do superdisintegrants such as croscarmellose sodium mainly work?', choices: ['they dissolve instantly and carry the drug with them', 'they draw water in and swell, pushing particle bonds apart', 'they react with stomach acid to release gas', 'they lower the pH around the tablet'], a: 1, why: 'They are insoluble, cross-linked polymers that wick water in and swell. Gas release is how effervescent tablets work, which is a different mechanism.' },
    { q: 'Excipients cannot affect how well a medicine works, only how it looks.', a: false, why: 'They change disintegration, dissolution and stability, and so can change exposure. That is why a change of formulation or a generic product must be shown to be equivalent.' },
    { q: 'A 250 mg tablet contains 2 mg of drug. What is its drug loading (in %)?', answer: 0.8, why: '2/250 = 0.008, or 0.8 %. At such a low loading, blend uniformity is the critical quality attribute.' }
  ],
  problems: [
    { q: 'A 300 mg tablet contains 25 mg of drug, and the binder, disintegrant and lubricant together make up 9 % of the tablet. How much filler does each tablet contain, in mg?', answer: 248, unit: 'mg', tol: 0.01, steps: ['$m_f = 300 \\times (1 - 0.09) - 25 = 273 - 25 = 248$ mg.'] }
  ],
  applications: [
    'Designing a formulation: choosing a filler, binder and disintegrant that suit the drug and the process.',
    'Explaining dissolution failures caused by over-lubrication or a change of excipient supplier.',
    'Finding lactose-free, sugar-free, gelatin-free or low-sodium alternatives for particular patients, with a pharmacist.',
    'Controlling excipient quality and the supply chain under GMP.'
  ],
  history: 'In 1937 a liquid "elixir" of sulfanilamide, made with diethylene glycol as the solvent, killed more than 100 people in the United States. The public outcry led to the 1938 Federal Food, Drug, and Cosmetic Act, which for the first time required proof of safety before a medicine could be sold. Microcrystalline cellulose, introduced in the 1960s, made direct compression of tablets practical.'
},

{
  id: 'tablet-coating', parent: 'powders-tablets', title: 'Tablet coating', level: 2,
  short: 'A thin polymer film, sprayed on in a rotating pan, masks taste, protects the drug from light and moisture, and makes tablets easy to swallow and identify. With the right polymer it can also stop release in the stomach or slow it for hours. The process is a balance between spraying and drying.',
  keywords: ['film coating', 'sugar coating', 'pan coater', 'perforated pan', 'spray rate', 'weight gain', 'coating thickness', 'enteric coating', 'gastro-resistant', 'methacrylic acid copolymer', 'hypromellose', 'ethylcellulose', 'plasticiser', 'orange peel', 'twinning', 'picking', 'spray drying', 'Wurster', 'fluid-bed coating', 'coating uniformity', 'exhaust temperature'],
  prereq: ['compaction', 'excipients', 'physics:latent-heat'],
  related: ['modified-release', 'tablet-testing', 'photostability', 'release-kinetics', 'odt', 'ionisation-pka', 'chemistry:polymers'],
  body: `
### Why coat
- **Taste and swallowing**: a smooth film hides a bitter taste and helps a tablet slide down.
- **Protection**: opaque films with titanium dioxide or iron oxides shield light-sensitive drugs, and some polymers slow the uptake of moisture ([[photostability]]).
- **Identity**: colour and printing help patients and pharmacists tell medicines apart.
- **Function**: an **enteric** (gastro-resistant) coat stays intact in stomach acid and dissolves in the intestine. An **extended-release** coat of insoluble polymer controls how fast drug diffuses out ([[modified-release]]).

### Sugar coating and film coating
Sugar coating, layer upon layer of syrup, powder and polish applied over days, once gave tablets their glossy look, but it added 50–100 % to their weight. It has been largely replaced by **film coating**: a polymer film 20–100 µm thick that adds only 2–4 % to the weight and goes on in an hour or two. A typical film-coating suspension is 10–20 % solids in water. It contains a film former (hypromellose or polyvinyl alcohol), a plasticiser to make the film flexible (polyethylene glycol, triethyl citrate) and pigments.

### Functional polymers
| Polymer family | Dissolves | Used for |
|---|---|---|
| hypromellose, polyvinyl alcohol | at any pH | immediate-release "cosmetic" films |
| methacrylic acid copolymers, hypromellose acetate succinate, cellulose acetate phthalate | above about pH 5.5–7, depending on grade | enteric (gastro-resistant) and colonic release |
| amino methacrylate copolymer | below about pH 5 | taste masking: dissolves in the stomach, not in the mouth |
| ethylcellulose, ammonio methacrylate copolymers | not at all (insoluble) | extended release: drug diffuses through the film or its pores |

Enteric polymers carry carboxylic acid groups. At stomach pH they are un-ionised and the polymer is insoluble. Above its threshold pH they ionise and the polymer dissolves, the same Henderson–Hasselbalch logic that governs drugs ([[ionisation-pka]]).

### The process: spraying against drying
In a **perforated pan coater** the tablets tumble in a rotating drum while spray guns atomise the coating onto the moving bed and hot air, often 50–70 °C at the inlet, is drawn through it. Each droplet must land, spread and dry before the tablet comes round again. Water evaporating from the spray cools the air, so in a balanced process the exhaust runs at about 40–45 °C.
- **Too wet** (spraying faster than the air can dry): tablets stick to each other (**twinning**) or to the pan, the film is torn off (**picking**), logos fill in (**bridging**), and water may soak into the core.
- **Too dry**: droplets dry before they land (**spray drying**), less of the coating ends up on the tablets, and the surface is rough (**orange peel**).

Pellets and small particles are coated in a fluid bed instead, in the **Wurster** process, where the particles are carried up past a spray nozzle in a stream of air.

### Uniformity
Each tablet passes through the spray zone at random. The coat a tablet collects is the sum of many small random portions, so the tablet-to-tablet variation falls as one over the square root of the number of passes. Coat for twice as long at half the spray rate, and the spread shrinks by a factor of √2. Faster pans, more guns and longer runs all give more even coats, which matters most when the coat controls release.

> [!warn] Tablets whose coat controls release, whether enteric or extended release, must not be crushed, chewed or split unless the product information says they can be. Breaking the coat can release the whole dose at once or expose the drug to stomach acid. Ask a pharmacist before altering any tablet.
`,
  ideas: [
    'Film coats of 20–100 µm (2–4 % weight gain) mask taste, protect, identify and can control release.',
    'Enteric polymers are weak acids: insoluble in stomach acid, soluble above their threshold pH.',
    'Coating balances spray rate against drying: too wet causes twinning and picking; too dry causes spray drying and orange peel.',
    'Tablet-to-tablet variation of the coat falls as 1/√(number of passes through the spray).',
    'Coat thickness, not weight gain alone, decides function: small tablets need a higher weight gain for the same thickness.'
  ],
  pitfalls: [
    'A coating is only cosmetic — Functional coats decide where and how fast the drug is released. Breaking one can dump the whole dose or destroy an acid-sensitive drug.',
    'A higher spray rate simply finishes the job sooner — Beyond the drying capacity of the air, the extra water makes tablets stick, twin and pick, and can start to dissolve the core.',
    'The same percentage weight gain gives the same coat on any tablet — Small tablets have more surface per milligram, so the same weight gain gives a thinner film. Functional coats are specified by thickness or mg/cm².'
  ],
  formulas: [
    {
      name: 'Coating weight gain',
      expr: 'WG = (mc - m0)/m0', tex: '\\mathrm{WG} = \\dfrac{m_c - m_0}{m_0}',
      vars: {
        WG: { name: 'weight gain', q: 'ratio', unit: '%', tex: '\\mathrm{WG}' },
        mc: { name: 'mass of the coated tablet', q: 'mass', unit: 'mg', value: 412, tex: 'm_c' },
        m0: { name: 'mass of the uncoated core', q: 'mass', unit: 'mg', value: 400, tex: 'm_0' }
      },
      note: 'Usually measured on the average of a sample of tablets weighed before and after coating.',
      stories: { WG: 'Cores of {m0} weigh {mc} after coating. What is the weight gain?', mc: 'Cores of {m0} are coated to a weight gain of {WG}. What do they weigh?' }
    },
    {
      name: 'Film thickness from weight gain',
      expr: 'hf = m0*WG/(rhof*A)', tex: 'h_f = \\dfrac{m_0\\,\\mathrm{WG}}{\\rho_f\\,A}',
      vars: {
        hf: { name: 'film thickness', q: 'length', unit: 'µm', tex: 'h_f' },
        m0: { name: 'core mass', q: 'mass', unit: 'mg', value: 400, tex: 'm_0' },
        WG: { name: 'weight gain', q: 'ratio', unit: '%', value: 3, tex: '\\mathrm{WG}' },
        rhof: { name: 'density of the dry film', q: 'density', unit: 'g/mL', value: 1.3, tex: '\\rho_f' },
        A: { name: 'surface area of the tablet', q: 'area', unit: 'cm²', value: 2.9 }
      },
      note: 'An average: films are usually thinner on edges and in engraved logos than on the faces. A 10 mm round tablet has about 2.5–3 cm² of surface.',
      practice: { unknowns: ['hf', 'WG'] },
      stories: {
        hf: 'A {m0} tablet with a surface area of {A} is coated to a weight gain of {WG}; the film density is {rhof}. How thick is the film?',
        WG: 'An enteric coat must be {hf} thick on a {m0} tablet with a surface area of {A} (film density {rhof}). What weight gain is needed?'
      }
    },
    {
      name: 'Time to spray the coat',
      expr: 't = WG*M/(fs*eta*Q)', tex: 't = \\dfrac{\\mathrm{WG}\\,M}{f_s\\,\\eta\\,Q}',
      vars: {
        t: { name: 'spraying time', q: 'time', unit: 'min' },
        WG: { name: 'target weight gain', q: 'ratio', unit: '%', value: 3, tex: '\\mathrm{WG}' },
        M: { name: 'batch mass of cores', q: 'mass', unit: 'kg', value: 150 },
        fs: { name: 'solids content of the suspension', q: 'ratio', unit: '%', value: 12, tex: 'f_s' },
        eta: { name: 'coating efficiency', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta' },
        Q: { name: 'spray rate of suspension', q: 'massflow', unit: 'g/min', value: 400 }
      },
      note: 'The efficiency is the share of the sprayed solids that ends up on the tablets; the rest is lost as spray-dried dust or on the pan.',
      practice: { unknowns: ['t', 'Q'] },
      stories: {
        t: 'A {M} batch is coated to {WG} with a suspension of {fs} solids, sprayed at {Q} with an efficiency of {eta}. How long does the spraying take?',
        Q: 'A {M} batch must reach {WG} in {t} with a {fs}-solids suspension and {eta} efficiency. What spray rate is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Planning a coating run',
      q: 'A 150 kg batch of 400 mg tablets is to gain 3 % from a 12 %-solids suspension sprayed at 400 g/min, with a coating efficiency of 90 %. How much suspension is needed, and how long will it take?',
      steps: [
        'Coat on the tablets: $0.03 \\times 150 = 4.5$ kg of solids.',
        'At 90 % efficiency, $4.5/0.90 = 5.0$ kg of solids must be sprayed, in $5.0/0.12 = 41.7$ kg of suspension.',
        'At 0.400 kg/min: $41.7/0.400 = 104$ minutes of spraying, plus time to warm up and to dry at the end.'
      ],
      a: 'About 42 kg of suspension and 1 h 45 min of spraying.'
    },
    {
      title: 'Same weight gain, thinner film',
      q: 'A 3 % film (density 1.3 g/mL) is applied to 400 mg tablets with 2.9 cm² of surface and to 100 mg tablets with 1.1 cm² of surface. How thick is each film?',
      steps: [
        'Large tablet: $12$ mg of film, so $h = 0.012/(1.3 \\times 2.9) = 0.0032$ cm $= 32$ µm.',
        'Small tablet: $3$ mg of film, so $h = 0.003/(1.3 \\times 1.1) = 0.0021$ cm $= 21$ µm.',
        'The small tablet has more surface per milligram, so the same percentage spreads thinner. A functional coat therefore needs a higher weight gain on small tablets and pellets.'
      ],
      a: 'About 32 µm on the large tablet and 21 µm on the small one.'
    }
  ],
  quiz: [
    { q: 'What weight gain does a typical film coat add?', choices: ['0.1–0.5 %', '2–4 %', '50–100 %', 'about 200 %'], a: 1, why: 'Film coats are thin (20–100 µm) and add a few per cent. 50–100 % is typical of the old sugar coating.' },
    { q: 'Tablets stick together in pairs during coating. Which change most likely helps?', choices: ['increase the spray rate', 'lower the inlet air temperature', 'lower the spray rate or dry harder (warmer or more air)', 'stop the pan for a while'], a: 2, why: 'Twinning means the bed is too wet: water arrives faster than the air removes it. Less spray or more drying restores the balance; stopping the pan lets wet tablets fuse.' },
    { q: 'Why does an enteric polymer with carboxylic acid groups stay intact in the stomach?', choices: ['it is too thick for acid to get through', 'at low pH its acid groups are un-ionised, so it is insoluble; above its threshold pH they ionise and it dissolves', 'pepsin cannot digest it', 'stomach acid cross-links it permanently'], a: 1, why: 'It is a polymeric weak acid, and its solubility follows ionisation, just as for a drug that is a weak acid.' },
    { q: 'Coating for twice as long at half the spray rate gives a more even coat from tablet to tablet.', a: true, why: 'Each tablet then passes through the spray about twice as many times, and the relative spread falls as 1/√(passes), by about 30 %.' },
    { q: 'A 3 % coat (film density 1.3 g/mL) is applied to 100 mg tablets with 1.1 cm² of surface. How thick is the film, in µm?', answer: 21, unit: 'µm', why: '3 mg/(1.3 mg/mm³ × 110 mm²) = 0.021 mm = 21 µm.' }
  ],
  problems: [
    { q: 'A 60 kg batch must gain 4 % from a 15 %-solids suspension sprayed at 250 g/min with 85 % efficiency. How long does the spraying take, in minutes?', answer: 75.3, unit: 'min', tol: 0.02, steps: ['Solids to spray: $0.04 \\times 60/0.85 = 2.82$ kg, in $2.82/0.15 = 18.8$ kg of suspension.', 'Time: $18.8/0.250 = 75.3$ min.'] }
  ],
  applications: [
    'Enteric coats for acid-labile drugs such as proton-pump inhibitors, and for drugs that irritate the stomach.',
    'Colours and printed codes that help prevent dispensing errors.',
    'Extended-release pellets coated with insoluble polymers and filled into capsules.',
    'Taste-masked particles for orally disintegrating tablets and children\'s medicines.'
  ],
  history: 'Pharmacists coated pills with silver, gold and sugar for centuries; the sugar-coated dragée was perfected in nineteenth-century France. Paul Unna proposed keratin-coated pills that would pass through the stomach in 1884, an early enteric coat. Film coating spread from the 1950s, and Dale Wurster\'s air-suspension coater of the late 1950s made coating of small particles possible.',
  sim: 'solid-coating'
},

{
  id: 'tablet-testing', parent: 'powders-tablets', title: 'Tablet quality tests', level: 2,
  short: 'Before a batch is released, samples are tested against pharmacopoeial standards: content and uniformity of dose, disintegration and dissolution, breaking force and friability, impurities and more. The content uniformity test turns ten single-tablet assays into one acceptance value, which must not exceed 15.',
  keywords: ['uniformity of dosage units', 'content uniformity', 'weight variation', 'acceptance value', 'USP <905>', 'Ph. Eur. 2.9.40', 'disintegration test', 'USP <701>', 'friability', 'USP <1216>', 'breaking force', 'hardness', 'tensile strength', 'diametral compression', 'dissolution', 'USP <711>', 'assay', 'related substances', 'batch release', 'real-time release testing'],
  prereq: ['compaction', 'excipients', 'pharmacopoeias', 'math:standard-deviation'],
  related: ['dissolution-testing', 'quality-control', 'analytical-methods', 'powder-flow', 'granulation', 'odt', 'gmp', 'qbd'],
  body: `
A batch of a million tablets is judged from a few dozen. The tests are written in the pharmacopoeias, largely harmonised between the United States (USP), Europe (Ph. Eur.) and Japan (JP), and in the product's own specification ([[pharmacopoeias]]). They ask four questions. Is the right drug there, in the right amount? Is every tablet alike? Will it release its drug? Will it survive handling?

### The tests
| Test | What is done | Typical requirement |
|---|---|---|
| Assay | drug content of a pooled sample, usually by HPLC | often 95.0–105.0 % of label |
| Uniformity of dosage units (USP <905>, Ph. Eur. 2.9.40) | 10 tablets assayed one by one (or weighed) | acceptance value ≤ 15.0 |
| Dissolution (USP <711>, Ph. Eur. 2.9.3) | 6 tablets in stirred vessels at 37 °C | for example Q = 80 % dissolved in 30 min |
| Disintegration (USP <701>, Ph. Eur. 2.9.1) | 6 tablets in a basket moved up and down in water at 37 °C | uncoated ≤ 15 min, film-coated ≤ 30 min (Ph. Eur.) |
| Friability (USP <1216>, Ph. Eur. 2.9.7) | about 6.5 g of tablets tumbled for 100 turns of a drum | mass loss usually ≤ 1.0 % |
| Breaking force (USP <1217>, Ph. Eur. 2.9.8) | tablets crushed across a diameter | set for each product |
| Impurities, water, microbial quality | chromatography, Karl Fischer titration, microbial counts | limits in the specification |

These are the common general requirements at the time of writing; each product's own specification is what binds. Dissolution has its own page, [[dissolution-testing]].

### Uniformity of dose: the acceptance value
Weighing proves uniformity only when the drug is a large part of the tablet; the pharmacopoeias draw the line at 25 mg and 25 %. Below that, 10 tablets are assayed individually, each as a percentage of the label claim, and the results are combined into an **acceptance value**:

$$\\mathrm{AV} = \\left|M - \\bar{X}\\right| + k\\,s$$

Here $\\bar{X}$ is the mean, $s$ the standard deviation, and $k = 2.4$ for 10 tablets. The reference value $M$ is $\\bar{X}$ itself if it lies between 98.5 and 101.5 %, and otherwise the nearer of those two limits. The batch passes if AV ≤ 15.0. If it does not, 20 more tablets are tested; for all 30 ($k = 2.0$), AV must be ≤ 15.0 and no tablet may lie outside 75–125 % of $M$.

The test rewards both accuracy (a mean near 100 %) and precision (a small spread). With a perfect mean, the standard deviation can be up to about 6.2 %; with a mean of 96 %, only about 5.2 %.

### Strength and friability
The **breaking force** of a tablet (often called "hardness", in newtons; the older kilopond is 9.81 N) depends on its size, so it is converted to a **tensile strength**. For a flat round tablet broken across its diameter:

$$\\sigma = \\frac{2F}{\\pi D t}$$

About 1–2 MPa is usually enough for a tablet to survive coating, packing and transport; try your own values in [the powder calculator](#/tools/formulation/powder). The **friability** test tumbles tablets in a drum with a curved baffle, dropping them 100 times. A loss of more than 1 % of their mass, or any broken tablet, warns of edges that will chip in the bottle.

### Testing smarter
Testing a sample can only catch problems that are common in the batch. Modern plants also measure during manufacture: near-infrared spectroscopy of tablets, and weight and thickness control on the press. With enough process data a regulator can accept **real-time release testing** in place of some end-product tests (described in ICH Q8(R2), 2009; see [[qbd]]). Large-sample versions of the uniformity test, such as Ph. Eur. 2.9.47, use hundreds of tablets.
`,
  ideas: [
    'Batch release rests on pharmacopoeial tests: assay, uniformity of dosage units, dissolution, disintegration, friability, breaking force and impurities.',
    'Content uniformity: AV = |M − X̄| + k s with k = 2.4 for 10 tablets; pass if AV ≤ 15.0, otherwise test 20 more.',
    'Weight variation can stand in for content uniformity only when the drug is at least 25 mg and 25 % of the tablet.',
    'Breaking force depends on size; tensile strength σ = 2F/(πDt) compares tablets fairly, and 1–2 MPa is usually enough.',
    'Friability loss above about 1 % means the edges will chip in handling.'
  ],
  pitfalls: [
    'If the average content is right, the batch is fine — A mean of exactly 100 % with a wide spread fails the acceptance value. Patients take single tablets, not averages.',
    'A higher breaking force always means a stronger tablet — Bigger or thicker tablets need more force to break even if the compact is no stronger. Tensile strength corrects for size.',
    'Passing the tests on 10 tablets proves every tablet is good — Small samples catch only common problems. Quality is built in by design and process control, which is why GMP and process monitoring matter as much as the final tests.'
  ],
  formulas: [
    {
      name: 'Acceptance value for content uniformity',
      expr: 'AV = abs(M - X) + k*s', tex: '\\mathrm{AV} = \\left|M - \\bar{X}\\right| + k\\,s',
      vars: {
        AV: { name: 'acceptance value', tex: '\\mathrm{AV}' },
        M: { name: 'reference value (% of label)', value: 98.5 },
        X: { name: 'mean content (% of label)', value: 96.0, tex: '\\bar{X}' },
        k: { name: 'acceptability constant (2.4 for 10 tablets)', value: 2.4, fixed: true },
        s: { name: 'standard deviation (% of label)', value: 4.0 }
      },
      note: 'For a target of 100 %: M = X̄ when 98.5 ≤ X̄ ≤ 101.5 (the first term is then zero), M = 98.5 below that range and M = 101.5 above it. Stage 1 passes if AV ≤ 15.0; with 30 tablets, k = 2.0.',
      practice: { unknowns: ['AV', 's'] },
      stories: {
        AV: 'Ten tablets have a mean content of {X} of label and a standard deviation of {s}; the reference value is {M}. What is the acceptance value?',
        s: 'With a mean of {X} (reference value {M}), what standard deviation gives an acceptance value of exactly {AV}?'
      }
    },
    {
      name: 'Tensile strength of a round tablet',
      expr: 'sigma = 2*F/(pi*D*t)', tex: '\\sigma = \\dfrac{2F}{\\pi D t}',
      vars: {
        sigma: { name: 'tensile strength', q: 'stress', unit: 'MPa', tex: '\\sigma' },
        F: { name: 'breaking force', q: 'force', unit: 'N', value: 120 },
        D: { name: 'tablet diameter', q: 'length', unit: 'mm', value: 10 },
        t: { name: 'tablet thickness', q: 'length', unit: 'mm', value: 4.0 }
      },
      note: 'For flat-faced round tablets broken across a diameter (diametral compression). Convex tablets need a corrected formula.',
      practice: { unknowns: ['sigma', 'F'] },
      stories: {
        sigma: 'A flat tablet {D} across and {t} thick breaks at {F}. What is its tensile strength?',
        F: 'What breaking force corresponds to a tensile strength of {sigma} for a tablet {D} across and {t} thick?'
      }
    },
    {
      name: 'Friability',
      expr: 'loss = (m1 - m2)/m1', tex: '\\mathrm{loss} = \\dfrac{m_1 - m_2}{m_1}',
      vars: {
        loss: { name: 'friability (mass loss)', q: 'ratio', unit: '%', tex: '\\mathrm{loss}' },
        m1: { name: 'mass of the dedusted tablets before', q: 'mass', unit: 'g', value: 6.512, tex: 'm_1' },
        m2: { name: 'mass after 100 drum rotations', q: 'mass', unit: 'g', value: 6.471, tex: 'm_2' }
      },
      note: 'A maximum loss of 1.0 % is the usual expectation for tablets, and no tablet may break.',
      stories: { loss: 'Tablets weighing {m1} weigh {m2} after 100 turns of the friability drum. What is the loss?' }
    }
  ],
  examples: [
    {
      title: 'Ten tablets, one acceptance value',
      q: 'Ten tablets assay at 97.2, 99.5, 101.3, 98.8, 96.4, 100.2, 102.1, 99.0, 98.1 and 97.9 % of label. Does the batch pass the first stage of the uniformity test?',
      steps: [
        'Mean: $\\bar{X} = 990.5/10 = 99.05$ %. This lies between 98.5 and 101.5 %, so $M = \\bar{X}$ and the first term is zero.',
        'Standard deviation: the squared deviations add up to 28.63, so $s = \\sqrt{28.63/9} = 1.78$ %.',
        '$\\mathrm{AV} = 0 + 2.4 \\times 1.78 = 4.3$, well below 15.0.'
      ],
      a: 'AV ≈ 4.3: the batch passes at the first stage.'
    },
    {
      title: 'Accurate but scattered, or tight but low?',
      q: 'Batch A has a mean of 100.0 % and a standard deviation of 6.5 %. Batch B has a mean of 95.0 % and a standard deviation of 2.0 %. Which passes the first stage?',
      steps: [
        'A: $M = \\bar{X}$, so $\\mathrm{AV} = 2.4 \\times 6.5 = 15.6$, which fails the first stage, and 20 more tablets must be tested.',
        'B: the mean is below 98.5 %, so $M = 98.5$ and $\\mathrm{AV} = 3.5 + 2.4 \\times 2.0 = 8.3$, a pass.',
        'The acceptance value weighs spread heavily. A tight batch that is slightly low passes, while a centred batch with a wide spread fails. The low assay of batch B would still be judged against the assay limits.'
      ],
      a: 'Batch B passes (AV 8.3); batch A fails the first stage (AV 15.6).'
    }
  ],
  quiz: [
    { q: 'Ten tablets have a mean content of 99.0 % of label and a standard deviation of 2.0 %. What is the acceptance value?', answer: 4.8, why: 'The mean lies within 98.5–101.5 %, so M = X̄ and AV = 2.4 × 2.0 = 4.8.' },
    { q: 'Why can weight variation not stand in for content uniformity for a 1 mg dose in a 100 mg tablet?', choices: ['weighing is less precise than an assay', 'the drug may be unevenly spread through the blend, so equal weights need not mean equal doses', 'the pharmacopoeias forbid weighing tablets', 'small tablets cannot be weighed'], a: 1, why: 'Weight tells you how much blend a tablet holds, not how much drug that blend holds. At 1 % loading, mixing and segregation decide the dose.' },
    { q: 'A flat tablet 12 mm across and 5 mm thick breaks at 150 N. What is its tensile strength, in MPa?', answer: 1.59, unit: 'MPa', why: 'σ = 2F/(πDt) = 300 N/(π × 12 mm × 5 mm) = 1.59 N/mm² = 1.59 MPa.' },
    { q: 'A tablet that needs a higher breaking force is always made of a stronger compact.', a: false, why: 'Breaking force grows with diameter and thickness. Tensile strength, 2F/(πDt), removes the effect of size.' },
    { q: 'Tablets weighing 6.50 g lose 0.10 g in the friability drum, and none break. What is the result?', choices: ['a pass, because 0.10 g is small', 'a fail: the loss is 1.5 %, above the usual 1.0 % limit', 'a pass, because only broken tablets count', 'cannot tell without the breaking force'], a: 1, why: '0.10/6.50 = 1.5 %, above the usual maximum of 1.0 %.' }
  ],
  problems: [
    { q: 'Dedusted tablets weigh 6.528 g before and 6.483 g after 100 turns of the friability drum. What is the loss, in %?', answer: 0.69, tol: 0.02, steps: ['$(6.528 - 6.483)/6.528 = 0.045/6.528 = 0.0069$, or 0.69 %: a pass.'] },
    { q: 'Ten tablets have a mean of 102.5 % of label and a standard deviation of 3.0 %. What is the acceptance value?', answer: 8.2, tol: 0.02, steps: ['The mean is above 101.5 %, so $M = 101.5$.', '$\\mathrm{AV} = |101.5 - 102.5| + 2.4 \\times 3.0 = 1.0 + 7.2 = 8.2$.'] }
  ],
  applications: [
    'Releasing each batch of tablets for sale.',
    'Stability studies, which repeat the same tests over the shelf life.',
    'Diagnosing manufacturing problems: weak tablets, poor mixing, slow disintegration.',
    'Checking suspect or falsified medicines against their specification.'
  ],
  history: 'Around 1970, problems with low-dose tablets such as digoxin, where tablets of the same strength differed widely in content and in how fast they dissolved, helped make single-tablet uniformity and dissolution tests routine. The acceptance-value form of the uniformity test was harmonised between the US, European and Japanese pharmacopoeias in the 2000s.',
  sim: 'solid-uniformity'
},

{
  id: 'capsules', parent: 'capsules-mr', title: 'Hard and soft capsules', level: 1,
  short: 'A capsule is a shell of gelatin or hypromellose around a dose of powder, pellets or liquid. Hard two-piece capsules are filled with solids. Soft one-piece capsules are sealed around a liquid or paste, which suits oily and poorly soluble drugs and very small doses.',
  keywords: ['capsule', 'hard capsule', 'soft capsule', 'softgel', 'gelatin', 'hypromellose', 'HPMC capsule', 'pullulan', 'capsule size', 'fill weight', 'dosator', 'tamping', 'rotary die', 'cross-linking', 'pellicle', 'lipid formulation', 'self-emulsifying', 'band sealing', 'over-encapsulation', 'brittleness'],
  prereq: ['what-is-a-drug', 'excipients', 'powder-flow'],
  related: ['modified-release', 'tablet-testing', 'dissolution-testing', 'solubility-pharm', 'surfactants', 'odt', 'emulsions', 'drug-development'],
  body: `
### Hard capsules
A hard capsule is two telescoping halves: a longer **body** and a shorter **cap** that locks onto it. Most shells are **gelatin**, made from bovine or porcine collagen and containing about 13–16 % water. **Hypromellose** (HPMC) shells hold much less water (about 4–6 %), are vegetarian and stay tough when dry; pullulan is another plant-derived option. Sizes run from 000, the largest, to 5:

| Size | 000 | 00 | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|---|
| Volume (mL, approx.) | 1.37 | 0.95 | 0.68 | 0.50 | 0.37 | 0.30 | 0.21 | 0.13 |

The fill can be powder or granules, coated pellets (a common route to [[modified-release|modified release]]), mini-tablets, or even liquids and semisolids in sealed or banded shells. Machines fill tens of thousands an hour. A **dosator** tube plunges into a bed of powder and ejects a lightly compressed plug; a **dosing disc** builds the plug with tamping pins. As with tablets, filling is by volume, so fill weight depends on flow and density ([[powder-flow]]).

Capsules suit powders that will not compress. They mask taste and smell, need few excipients, and are quick to make in early development. Clinical trials often hide a comparator tablet inside a larger capsule ("over-encapsulation"), so that nobody can tell the treatments apart.

### Soft capsules
A soft capsule, or softgel, is a single sealed shell of gelatin plasticised with glycerol or sorbitol. It is formed around its fill by the **rotary-die** process: two warm ribbons of gelatin meet between rotating dies while the liquid is pumped in between them. The fill is an oil, a polyethylene glycol, or a self-emulsifying mixture of oil and surfactants that breaks into fine droplets in the gut ([[surfactants]]). Softgels are good for:
- poorly water-soluble, fat-soluble drugs, which arrive already dissolved ([[solubility-pharm]]);
- very small doses, because a liquid can be metered more precisely than a powder can be mixed;
- oily vitamins, and drugs that are liquid at room temperature.

The fill must not attack the shell. Too much water, or a fill that is too acidic or alkaline, softens gelatin, and water migrates between fill and shell until the two reach equilibrium.

### Things that go wrong
- **Moisture**: gelatin shells turn brittle when too dry (below about 10 % water) and soft and sticky when too humid, so capsules are stored at moderate humidity. A hygroscopic fill can dry out its own shell.
- **Cross-linking**: traces of aldehydes, from excipients or packaging, cross-link gelatin into a rubbery skin (a **pellicle**) that dissolves slowly. Dissolution tests may add digestive enzymes to tell this apart from a real failure.
- **Temperature**: gelatin dissolves readily at 37 °C but only swells in cold water, and some HPMC shells open more slowly than gelatin.

> [!tip] Capsule shells are often made from animal gelatin. People who avoid pork or beef, or all animal products, can ask a pharmacist whether a medicine is available in an HPMC or other alternative shell.
`,
  ideas: [
    'Hard capsules are two-piece shells filled with powder, granules, pellets or mini-tablets; sizes run from 000 (1.37 mL) to 5 (0.13 mL).',
    'Filling is by volume: dose = capsule volume × fill density × drug fraction.',
    'Soft capsules seal a liquid or paste in a plasticised gelatin shell, which suits oily, poorly soluble and very low-dose drugs.',
    'Gelatin shells are sensitive to moisture and to cross-linking by aldehydes, which slows dissolution.',
    'HPMC and pullulan shells are plant-based alternatives with less water.'
  ],
  pitfalls: [
    'Capsules always release their drug faster than tablets — The shell dissolves in minutes, but then the plug must wet and break up, and a tightly packed, water-repellent plug can release more slowly than a well-made tablet. Modified-release capsules are designed to release slowly.',
    'A bigger capsule always holds a bigger dose — The dose depends on the fill density and the drug fraction as well. Granulating to a higher density can fit the same dose into a smaller capsule.',
    'Opening a capsule and sprinkling its contents is harmless — For modified-release or enteric pellets it may be allowed with some foods, but for others it can destroy the release control or expose the drug to acid. Only the product information or a pharmacist can say.'
  ],
  formulas: [
    {
      name: 'Dose held by a capsule',
      expr: 'Dc = V*rho*w', tex: 'D_c = V\\,\\rho\\,w',
      vars: {
        Dc: { name: 'drug per capsule', q: 'mass', unit: 'mg', tex: 'D_c' },
        V: { name: 'fill volume of the capsule', q: 'volume', unit: 'mL', value: 0.68 },
        rho: { name: 'density of the fill (plug)', q: 'density', unit: 'g/mL', value: 0.60, tex: '\\rho' },
        w: { name: 'drug fraction of the blend', q: 'ratio', unit: '%', value: 80 }
      },
      note: 'Dosator and tamping machines compress the powder slightly, so the plug density lies near or above the tapped density. Size 0 holds about 0.68 mL, size 1 about 0.50 mL.',
      stories: {
        Dc: 'A capsule holds {V} of a blend with a plug density of {rho} containing {w} drug. How much drug does it hold?',
        V: 'A dose of {Dc} is to be filled as a blend containing {w} drug, with a plug density of {rho}. What capsule volume is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Choosing a capsule size',
      q: 'A hypothetical 250 mg dose is filled as a blend containing 80 % drug with a plug density of 0.60 g/mL. Which is the smallest capsule size that holds it? Would granulating the blend to 0.75 g/mL change the answer?',
      steps: [
        'Blend per capsule: $250/0.80 = 312.5$ mg.',
        'Volume: $0.3125\\,\\mathrm{g}/0.60\\,\\mathrm{g/mL} = 0.52$ mL. Size 1 (0.50 mL) is just too small, so size 0 (0.68 mL) is needed.',
        'At 0.75 g/mL: $0.3125/0.75 = 0.42$ mL, which fits a size 1, a capsule that is easier to swallow.'
      ],
      a: 'Size 0 as it stands; size 1 if the blend is granulated to 0.75 g/mL.'
    },
    {
      title: 'A very low dose',
      q: 'A hypothetical drug is given as 0.25 mg. Compare a hard capsule holding 100 mg of powder blend with a soft capsule holding the drug dissolved in 100 mg of oil.',
      steps: [
        'As a powder, the drug is 0.25 % of the blend. Each capsule\'s dose depends on how well a quarter of a per cent of drug is mixed, and on whether it separates during filling.',
        'In a softgel the drug is dissolved, so every milligram of fill has the same concentration. The dose then depends only on how precisely the pump meters the liquid, typically within 1–3 %.',
        'That is one reason softgels are chosen for very low doses and for poorly soluble drugs that can be dissolved in an oil or a self-emulsifying fill.'
      ],
      a: 'The softgel keeps each dose uniform more easily; the powder capsule depends on excellent mixing.'
    }
  ],
  quiz: [
    { q: 'Which capsule shell suits a patient who avoids all animal products?', choices: ['bovine gelatin', 'porcine gelatin', 'hypromellose (HPMC)', 'any shell, since capsule shells contain no animal products'], a: 2, why: 'Gelatin comes from animal collagen. HPMC (and pullulan) shells are plant-derived. A pharmacist can check what a particular product uses.' },
    { q: 'Why are soft capsules well suited to very low-dose drugs?', choices: ['soft shells dissolve faster', 'a drug dissolved in a liquid fill is metered precisely, with no powder mixing to go wrong', 'soft capsules are larger', 'gelatin makes drugs more potent'], a: 1, why: 'A solution is uniform by nature, so each capsule\'s dose depends only on the fill volume.' },
    { q: 'After a year with an aldehyde-forming excipient, gelatin capsules dissolve much more slowly. The likely cause is…', choices: ['a change of crystal form in the drug', 'cross-linking of the gelatin shell (a pellicle)', 'the capsules have grown larger', 'the drug has evaporated'], a: 1, why: 'Aldehydes cross-link gelatin into an insoluble skin. Enzymes added to the dissolution medium can digest it, which is how the test distinguishes this from a formulation failure.' },
    { q: 'A size-1 capsule (0.50 mL) is filled with a blend of plug density 0.55 g/mL containing 90 % drug. How much drug does it hold, in mg?', answer: 248, unit: 'mg', why: '0.50 mL × 550 mg/mL × 0.90 = 247.5 mg.' },
    { q: 'Capsules always release their drug faster than tablets.', a: false, why: 'The shell opens quickly, but a dense, water-repellent plug can release slowly, and modified-release capsules are designed to release over many hours.' }
  ],
  problems: [
    { q: 'A blend containing 60 % drug with a plug density of 0.70 g/mL fills a size-2 capsule (0.37 mL). How much drug does each capsule hold, in mg?', answer: 155, unit: 'mg', tol: 0.02, steps: ['$D_c = 0.37 \\times 700 \\times 0.60 = 155$ mg (0.37 mL × 700 mg/mL × 0.60).'] }
  ],
  applications: [
    'Early clinical trials, where capsules are quick to make and easy to blind.',
    'Multiparticulate modified-release products: coated pellets in a hard capsule.',
    'Lipid-filled softgels for poorly soluble drugs, vitamins and oils.',
    'Capsules of powder pierced inside some dry-powder inhalers.'
  ],
  history: 'The gelatin capsule was patented in Paris in 1834 by Mothes and Dublanc, to hide the taste of unpleasant medicines. James Murdoch patented a two-piece telescoping capsule in London in 1847, and Robert Pauli Scherer invented the rotary-die machine for soft capsules in 1933.'
},

{
  id: 'modified-release', parent: 'capsules-mr', title: 'Modified-release principles', level: 2,
  short: 'A modified-release product changes when or how fast its drug comes out. Extended release spreads a dose over 12–24 hours, for fewer doses and smoother levels; delayed (enteric) release holds it back until after the stomach. It only works for suitable drugs, and the unit must never break open and dump its dose.',
  keywords: ['modified release', 'extended release', 'prolonged release', 'sustained release', 'controlled release', 'delayed release', 'gastro-resistant', 'enteric', 'colonic delivery', 'pulsatile release', 'once daily', 'peak–trough fluctuation', 'swing', 'dose dumping', 'alcohol-induced dose dumping', 'multiparticulates', 'matrix tablet', 'reservoir system', 'adherence', 'gastrointestinal transit'],
  prereq: ['half-life', 'multiple-dosing', 'gi-absorption', 'tablet-coating'],
  related: ['release-kinetics', 'osmotic-pumps', 'capsules', 'therapeutic-index', 'clearance', 'ivivc', 'dissolution-testing', 'food-effects', 'depot-implants', 'transdermal'],
  body: `
Most tablets release their whole dose within minutes. For a drug with a half-life of a few hours, that means dosing three or four times a day, with blood levels that rise to a peak after each dose and sink to a trough before the next. **Modified-release** (MR) products change the timing:

| Type | Pharmacopoeial names | What it does |
|---|---|---|
| Extended release | prolonged-release (Ph. Eur.), extended-release (USP); also "sustained" or "controlled" | releases over about 8–24 h |
| Delayed release | gastro-resistant (Ph. Eur.), delayed-release (USP) | nothing in the stomach, then release in the intestine |
| Targeted or pulsatile | colonic, pulsatile, chronotherapeutic | release at a site or a time: the colon, or a pulse before waking |

### Why modify release
- **Fewer doses**: once or twice a day instead of three or four. Adherence falls as the number of daily doses rises.
- **Smoother levels**: with a quickly absorbed dose every $\\tau$ hours, the peak-to-trough ratio at steady state is about $2^{\\tau/t_{1/2}}$. A constant release rate gives a nearly flat level. Lower peaks can mean fewer peak-related side effects, and higher troughs less loss of effect at the end of each interval ([[therapeutic-index]]).
- **Protect the drug** from acid (proton-pump inhibitors, for example, are destroyed in the stomach), or **protect the stomach** from the drug.
- **Target a site**: in inflammatory bowel disease, mesalazine can be released in the ileum and colon, where it acts.

To hold an average concentration $C_{ss}$, the dosage form must supply drug as fast as the body clears it, $R_0 = C_{ss}\\,CL/F$ ([[clearance]]). Over a 12-hour interval that rate sets the dose, and an immediate-release portion can bring the level up at the start.

### Which drugs suit extended release
- **A half-life of roughly 2–8 h.** Much shorter, and the dose needed to cover a day becomes too large; much longer, and the drug is already smooth when given once a day.
- **Absorption along the whole gut**, including the colon, because a 24-hour tablet spends most of its time there. A drug absorbed only in the upper small intestine has an **absorption window** and needs a gastro-retentive design ([[osmotic-pumps]]).
- **A dose that fits** in a tablet that people can swallow.

The gut sets the clock. A tablet that does not disintegrate leaves a fasting stomach within about 0.5–2 hours, swept out by the migrating motor complex, but can stay 4 hours or more after a meal. Transit through the small intestine is steadier, about 3–4 hours. The colon takes 10–40 hours and has little water to dissolve drug.

### How it is done
- **Matrix tablets**: drug dispersed in a polymer that swells into a gel (hypromellose) or in an insoluble porous matrix. Release slows with time as the path out gets longer ($\\sqrt{t}$, see [[release-kinetics]]).
- **Reservoir systems**: a drug core or pellets coated with a rate-controlling membrane, often ethylcellulose ([[tablet-coating]]).
- **Osmotic pumps**: water drawn in through a membrane pushes drug out of a laser-drilled hole at a constant rate ([[osmotic-pumps]]).
- **Multiparticulates**: hundreds of coated pellets in a capsule spread out along the gut and leave the stomach more steadily than a single large tablet, and one failing pellet releases only a tiny share of the dose.

### Dose dumping
An extended-release unit holds several ordinary doses. If its control fails, for example because the tablet is crushed or chewed, a coat is damaged, or a matrix dissolves in alcohol, the whole content can be released at once. Regulators now ask for dissolution tests in alcohol–water mixtures for such products. This followed the withdrawal in the United States in 2005 of a once-daily opioid capsule that released far too fast when taken with alcohol.

> [!warn] Modified-release tablets and capsules must be taken exactly as the product information says. Crushing, chewing or splitting them (unless the leaflet allows it) can release a dangerous amount of drug at once, and MR and immediate-release versions of a drug are not interchangeable milligram for milligram. Ask a pharmacist before changing how any medicine is taken. If someone has taken a crushed or chewed extended-release medicine and feels unwell, call your local emergency number or poison centre.
`,
  ideas: [
    'Extended release spreads a dose over 8–24 h; delayed (enteric) release waits until after the stomach; targeted release aims at a site or a time.',
    'Immediate-release swing at steady state is about 2^(τ/t½); zero-order release flattens it.',
    'To hold an average level Css, the form must release R0 = Css·CL/F.',
    'Good candidates have half-lives of about 2–8 h, absorption along the whole gut and a modest dose.',
    'Dose dumping, from crushing, a damaged coat or alcohol, is the central safety risk of extended release.'
  ],
  pitfalls: [
    'A drug with any half-life can be made once daily by slowing its release — Very short half-lives need impractically large doses, and a tablet cannot release usefully beyond the time it spends in the gut, much of it in the colon, where absorption is often poor.',
    'Extended-release and immediate-release products of the same drug are interchangeable mg for mg — Their peaks, troughs and sometimes bioavailability differ. Switching between them is a prescriber\'s and pharmacist\'s decision.',
    'Enteric coats slow release down over the day — An enteric coat only delays release until the pH rises in the intestine; after that the drug comes out as quickly as from an ordinary tablet.'
  ],
  formulas: [
    {
      name: 'Peak-to-trough swing of repeated doses',
      expr: 'S = 2^(tau/th)', tex: 'S = \\dfrac{C_{\\max}}{C_{\\min}} = 2^{\\tau/t_{1/2}}',
      vars: {
        S: { name: 'peak-to-trough ratio at steady state' },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 12, tex: '\\tau' },
        th: { name: 'elimination half-life', q: 'time', unit: 'h', value: 4, tex: 't_{1/2}' }
      },
      note: 'For quickly absorbed immediate-release doses (a one-compartment model at steady state). Slower absorption flattens it a little; zero-order release almost completely.',
      stories: {
        S: 'A hypothetical drug with a half-life of {th} is given as an immediate-release tablet every {tau}. What is the peak-to-trough ratio at steady state?',
        tau: 'For a drug with a half-life of {th}, what dosing interval keeps the peak-to-trough ratio down to {S}?'
      }
    },
    {
      name: 'Release rate needed for a steady level',
      expr: 'R0 = Css*CL/F', tex: 'R_0 = \\dfrac{C_{ss}\\,\\text{CL}}{F}',
      vars: {
        R0: { name: 'release rate from the dosage form', q: false, unit: 'mg/h', tex: 'R_0' },
        Css: { name: 'target average concentration', q: false, unit: 'mg/L', value: 2, tex: 'C_{ss}' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 5, tex: '\\text{CL}' },
        F: { name: 'bioavailability (fraction)', value: 0.8, min: 0.01, max: 1 }
      },
      note: 'Zero-order input balances elimination at steady state. Worked in mg, L and h throughout; the numbers are hypothetical.',
      stories: {
        R0: 'A hypothetical drug has a clearance of {CL} and a bioavailability of {F}. At what rate must a tablet release it to hold an average of {Css}?',
        Css: 'A tablet releases a hypothetical drug at {R0}; its clearance is {CL} and its bioavailability {F}. What average level results?'
      }
    },
    {
      name: 'Total dose of an extended-release unit',
      expr: 'W = Di + R0*T', tex: 'W = D_i + R_0\\,T',
      vars: {
        W: { name: 'total drug in the unit', q: false, unit: 'mg' },
        Di: { name: 'immediate-release (loading) portion', q: false, unit: 'mg', value: 100, tex: 'D_i' },
        R0: { name: 'release rate of the extended portion', q: false, unit: 'mg/h', value: 12.5, tex: 'R_0' },
        T: { name: 'duration of release', q: false, unit: 'h', value: 12 }
      },
      note: 'A first design estimate. In practice the loading portion is reduced, because the extended portion also contributes from the start, and the design is refined by simulation and studies in people.',
      stories: { W: 'An extended-release design has an immediate portion of {Di} and then releases {R0} for {T}. How much drug does the unit contain?' }
    }
  ],
  examples: [
    {
      title: 'How much smoother?',
      q: 'A hypothetical drug has a half-life of 4 h. Compare the steady-state peak-to-trough ratio of an immediate-release tablet taken every 6 h, every 12 h and once a day with that of an ideal zero-order tablet.',
      steps: [
        'Every 6 h: $2^{6/4} = 2.8$.',
        'Every 12 h: $2^{12/4} = 8$. Once a day: $2^{24/4} = 64$, useless for most drugs.',
        'An ideal zero-order release holds a flat level, a ratio near 1. Real extended-release products give perhaps 1.3–2, because release is not perfectly constant and absorption falls in the colon.'
      ],
      a: 'About 2.8, 8 and 64 for immediate release; close to 1 (in practice 1.3–2) for a good extended-release form.'
    },
    {
      title: 'Designing a 12-hour tablet',
      q: 'A hypothetical drug has a clearance of 5 L/h, a volume of distribution of 40 L and a bioavailability of 0.8. A 12-hour tablet should hold an average of 2 mg/L. Estimate its release rate and total content.',
      steps: [
        'Release rate: $R_0 = 2 \\times 5/0.8 = 12.5$ mg/h, so the extended part must deliver $12.5 \\times 12 = 150$ mg.',
        'To reach 2 mg/L quickly, an immediate portion of $C\\,V_d/F = 2 \\times 40/0.8 = 100$ mg.',
        'Total: $W = 100 + 150 = 250$ mg, a first estimate to refine by simulation. Real products are designed and tested this way, never by hand calculation alone.'
      ],
      a: 'About 12.5 mg/h and roughly 250 mg in the tablet (a design estimate for a hypothetical drug).'
    }
  ],
  quiz: [
    { q: 'A hypothetical drug has a half-life of 3 h. Given as an immediate-release tablet every 12 h, what is its steady-state peak-to-trough ratio?', answer: 16, why: '2^(12/3) = 2⁴ = 16: a sixteen-fold swing, which is why such a drug is a candidate for extended release.' },
    { q: 'Which drug is the poorest candidate for a once-daily extended-release tablet?', choices: ['half-life 4 h, absorbed throughout the gut', 'half-life 6 h, dose 20 mg', 'half-life 1 h, absorbed only in the upper small intestine, dose 500 mg', 'half-life 3 h, well absorbed in the colon'], a: 2, why: 'A very short half-life needs a huge dose to cover 24 h, and an absorption window in the upper small intestine means drug released later is wasted.' },
    { q: 'Crushing an extended-release tablet can make it behave like an immediate-release tablet containing the whole day\'s dose.', a: true, why: 'Crushing destroys the matrix or membrane that controls release, so all the drug is free to dissolve at once: dose dumping.' },
    { q: 'Why do multiparticulate (pellet) MR products vary less than single-unit MR tablets?', choices: ['pellets are coated more thickly', 'hundreds of pellets leave the stomach gradually and spread along the gut, so no single event decides the whole dose', 'pellets dissolve faster', 'pellets are absorbed in the mouth'], a: 1, why: 'A single tablet leaves the stomach all at once, at an unpredictable moment, and if it fails the whole dose is released. Pellets average out both effects.' },
    { q: 'A delayed-release (enteric) tablet is designed to…', choices: ['release slowly over 24 hours', 'release nothing in the stomach, then release in the small intestine', 'dissolve in the mouth', 'float in the stomach'], a: 1, why: 'Its coat is insoluble at stomach pH and dissolves above about pH 5.5–7. After that, release is usually fast.' }
  ],
  problems: [
    { q: 'A hypothetical drug (clearance 6 L/h, bioavailability 0.75) is to be held at an average of 1.5 mg/L by a 24-hour tablet with no immediate-release portion. How much drug must the tablet release, in mg?', answer: 288, unit: 'mg', tol: 0.01, steps: ['$R_0 = 1.5 \\times 6/0.75 = 12$ mg/h.', 'Over 24 h: $12 \\times 24 = 288$ mg.'] }
  ],
  applications: [
    'Once-daily medicines for long-term conditions such as high blood pressure, epilepsy and Parkinson\'s disease.',
    'Enteric-coated proton-pump inhibitors and pancreatic enzymes that must survive the stomach.',
    'Colonic release for inflammatory bowel disease.',
    'Release timed to early-morning symptoms (chronotherapy).'
  ],
  history: 'The first widely marketed sustained-release products, capsules of pellets coated to different thicknesses, appeared in the early 1950s. Takeru Higuchi\'s equations for release from matrices (1961 and 1963) and Felix Theeuwes\' elementary osmotic pump (1975) put release on a quantitative footing.',
  sim: 'solid-gi-release'
},

{
  id: 'release-kinetics', parent: 'capsules-mr', title: 'Release kinetics: zero order, Higuchi, Korsmeyer', level: 3,
  short: 'Release profiles follow a few characteristic shapes: a constant rate (zero order), a rate proportional to what is left (first order), release growing with the square root of time from a matrix (Higuchi), or a power law whose exponent points to the mechanism (Korsmeyer–Peppas). Fitting them helps show how a dosage form works.',
  keywords: ['release kinetics', 'drug release', 'zero order', 'first order', 'Higuchi equation', 'square root of time', 'Korsmeyer–Peppas', 'power law', 'release exponent', 'Fickian diffusion', 'case II transport', 'anomalous transport', 'Hixson–Crowell', 'cube-root law', 'Weibull', 'matrix tablet', 'swelling front', 'erosion', 'model fitting', 'burst release', 'lag time'],
  prereq: ['modified-release', 'diffusion-fick', 'dissolution-rate', 'math:power-functions'],
  related: ['osmotic-pumps', 'f2-similarity', 'ivivc', 'dissolution-testing', 'tablet-coating', 'depot-implants', 'transdermal', 'math:exponential-models', 'chemistry:integrated-rate-laws'],
  body: `
A release profile, the percentage of the dose released against time, is a fingerprint of the mechanism inside the dosage form. A handful of models, each built on a simple physical picture, describe most of them.

### Zero order: a constant rate
$$Q = k_0\\,t$$

The same amount comes out every hour until the drug runs out. This is the ideal for extended release, because a constant input gives a constant blood level. It arises whenever the driving force stays constant: a reservoir with a saturated core behind a membrane, an osmotic pump ([[osmotic-pumps]]), a matrix eroding at a constant surface area, or a transdermal patch.

### First order: a rate proportional to what is left
$$Q = 1 - e^{-k_1 t}$$

Here $Q$ is the fraction released. The rate falls as the drug is used up, as in a reservoir whose core is no longer saturated, many immediate-release tablets, and the tail of most systems. A plot of $\\ln(1 - Q)$ against $t$ is a straight line.

### Higuchi: the square root of time
Takeru Higuchi (1961) pictured drug dispersed in an ointment or an insoluble matrix at a loading $C_0$ well above its solubility $C_s$. Drug dissolves and diffuses out from a depleted zone that grows inward, so the path gets longer and the rate falls. Per unit area:

$$Q_A = \\sqrt{D\\,(2C_0 - C_s)\\,C_s\\,t}$$

The amount released grows as $\\sqrt{t}$, so doubling the time releases only 1.41 times as much. For a porous matrix, $D$ is replaced by $D\\varepsilon/\\tau$ (the porosity divided by the tortuosity of the pores). Most matrix tablets follow $Q = k_H\\sqrt{t}$ for roughly their first 60 %.

### Korsmeyer–Peppas: the exponent points to the mechanism
For swellable polymers, Korsmeyer, Peppas and colleagues (1983) fitted the first 60 % of release to a power law:

$$\\frac{M_t}{M_\\infty} = k\\,t^n$$

The exponent $n$ depends on both the mechanism and the shape:

| Shape | Fickian diffusion | Anomalous (diffusion and relaxation) | Case II (swelling or erosion) |
|---|---|---|---|
| thin film | n = 0.5 | 0.5 < n < 1.0 | n = 1.0 |
| cylinder (tablet) | n = 0.45 | 0.45 < n < 0.89 | n = 0.89 |
| sphere | n = 0.43 | 0.43 < n < 0.85 | n = 0.85 |

A hypromellose matrix tablet swells into a gel. Water moves in at a **swelling front**, drug dissolves and diffuses out through the gel from a **diffusion front**, and the outer gel wears away at an **erosion front**. When swelling and erosion keep the gel layer at a constant thickness, release approaches zero order, with $n$ near 0.89 for a tablet.

### Other models
- **Hixson–Crowell** (1931) describes a single particle or eroding tablet whose surface shrinks as it dissolves: $W_0^{1/3} - W^{1/3} = \\kappa t$.
- **Weibull** is an empirical S-shaped curve, $Q = 1 - \\exp(-t^b/a)$. It is good for describing a profile, not for explaining it.
- **Burst and lag**: drug at the surface gives an initial burst, and a coat that must hydrate first gives a lag. Many models add a lag time $t_0$ or a burst term.

### Fitting with care
Linearise and look: $Q$ against $t$ (zero order), $\\ln(1 - Q)$ against $t$ (first order), $Q$ against $\\sqrt{t}$ (Higuchi), $\\log Q$ against $\\log t$ (Korsmeyer–Peppas). A high R² alone proves little, because most smooth curves fit several models well over part of their range. Choose the model whose physics matches the system, fit the power law only to the first 60 %, and compare products with model-independent measures such as f2 ([[f2-similarity]]). You can paste a profile into [the release-model calculator](#/tools/formulation/release) to fit all the classic models at once.

> [!key] A constant driving force gives zero order, a depleting reservoir first order, and a lengthening diffusion path √t. The Korsmeyer exponent separates diffusion (n ≈ 0.45 for tablets) from swelling and erosion (n ≈ 0.89).
`,
  ideas: [
    'Zero order (Q = k0 t) needs a constant driving force: a saturated reservoir, an osmotic pump, erosion at a constant area.',
    'First order (Q = 1 − e^(−kt)) means the rate is proportional to the drug left: ln(1 − Q) falls linearly with time.',
    'Higuchi: diffusion from a matrix through a growing depleted layer gives release proportional to √t.',
    'Korsmeyer–Peppas: Mt/M∞ = k tⁿ over the first 60 %; for tablets n ≈ 0.45 means diffusion and n ≈ 0.89 swelling or erosion control.',
    'Goodness of fit alone does not prove a mechanism; the model must match the physics of the system.'
  ],
  pitfalls: [
    'The model with the highest R² reveals the mechanism — Several models fit most smooth profiles well over part of their range. The mechanism comes from the design and from experiments (changing geometry, loading or stirring), not from R² alone.',
    'The Higuchi equation holds until all the drug is released — It assumes drug in excess of its solubility and a flat, semi-infinite matrix. It fails once the loading falls towards the solubility, usually after about 60 % release.',
    'Korsmeyer exponents can be read without knowing the shape — The limits for pure diffusion are 0.5 for a film, 0.45 for a cylinder and 0.43 for a sphere, so the same n can mean different things. Particle-size distributions also lower n.'
  ],
  formulas: [
    {
      name: 'Zero-order release',
      expr: 'Q = k0*t', tex: 'Q = k_0\\,t',
      vars: {
        Q: { name: 'drug released', q: false, unit: '%' },
        k0: { name: 'zero-order release rate', q: false, unit: '%/h', value: 8, tex: 'k_0' },
        t: { name: 'time', q: false, unit: 'h', value: 6 }
      },
      note: 'Holds until the constant driving force runs out (for an osmotic pump, when the solid drug in the core has dissolved).',
      stories: { Q: 'A tablet releases {k0} at a constant rate. How much has it released after {t}?', t: 'At {k0}, how long does a zero-order tablet take to release {Q}?' }
    },
    {
      name: 'First-order release',
      expr: 'Q = 100*(1 - exp(-k1*t))', tex: 'Q = 100\\,(1 - e^{-k_1 t})',
      vars: {
        Q: { name: 'drug released', q: false, unit: '%' },
        k1: { name: 'first-order release constant', q: false, unit: '1/h', value: 0.25, tex: 'k_1' },
        t: { name: 'time', q: false, unit: 'h', value: 4 }
      },
      note: 'The half-time of release is ln 2/k₁. Plot ln(1 − Q/100) against t to test it.',
      practice: { unknowns: ['Q', 't', 'k1'] },
      stories: {
        Q: 'Release follows first-order kinetics with k = {k1}. What percentage is released after {t}?',
        k1: 'A reservoir system releases {Q} in {t} by first-order kinetics. What is its rate constant?'
      }
    },
    {
      name: 'Higuchi equation for a planar matrix',
      expr: 'QA = sqrt(D*(2*C0 - Cs)*Cs*t)', tex: 'Q_A = \\sqrt{D\\,(2C_0 - C_s)\\,C_s\\,t}',
      vars: {
        QA: { name: 'amount released per unit area', q: false, unit: 'mg/cm²', tex: 'Q_A' },
        D: { name: 'diffusion coefficient in the matrix', q: false, unit: 'cm²/h', value: 0.0036 },
        C0: { name: 'drug loading', q: false, unit: 'mg/cm³', value: 100, tex: 'C_0' },
        Cs: { name: 'drug solubility in the matrix', q: false, unit: 'mg/cm³', value: 1.0, tex: 'C_s' },
        t: { name: 'time', q: false, unit: 'h', value: 8 }
      },
      note: 'Valid while C₀ is well above Cs and the depleted zone is thin compared with the matrix. 0.0036 cm²/h is 1 × 10⁻⁶ cm²/s. For porous matrices use D·ε/τ.',
      practice: { unknowns: ['QA', 't', 'C0'] },
      stories: {
        QA: 'An ointment holds {C0} of drug with a solubility of {Cs} in the base and a diffusion coefficient of {D}. How much is released per square centimetre in {t}?',
        t: 'How long does an ointment ({C0} loading, solubility {Cs}, D = {D}) take to release {QA}?'
      }
    },
    {
      name: 'Korsmeyer–Peppas power law',
      expr: 'Q = k*t^n', tex: 'Q = k\\,t^n',
      vars: {
        Q: { name: 'drug released (up to about 60 %)', q: false, unit: '%' },
        k: { name: 'release constant', q: false, unit: '%/hⁿ', value: 20 },
        t: { name: 'time', q: false, unit: 'h', value: 4 },
        n: { name: 'release exponent', value: 0.6, min: 0.1, max: 1.5 }
      },
      note: 'Fit only the first 60 % of release. For a tablet (cylinder): n ≈ 0.45 Fickian diffusion, 0.45–0.89 anomalous, ≈ 0.89 case II (swelling or erosion).',
      practice: { unknowns: ['Q', 't', 'n'] },
      stories: {
        Q: 'A matrix tablet follows Q = k tⁿ with k = {k} and n = {n}. What is released after {t}?',
        n: 'A tablet with k = {k} has released {Q} after {t}. What is its release exponent?'
      }
    }
  ],
  examples: [
    {
      title: 'Which model?',
      q: 'A matrix tablet releases 15 % at 1 h, 30 % at 4 h, 45 % at 9 h and 60 % at 16 h. Which model fits, and what is its constant?',
      steps: [
        'Zero order? $Q/t$ = 15, 7.5, 5.0, 3.75 %/h. Not constant.',
        'First order? $-\\ln(1 - Q)/t$ = 0.16, 0.089, 0.066, 0.057 per hour. Not constant either.',
        'Higuchi? $Q/\\sqrt{t}$ = 15/1, 30/2, 45/3, 60/4 = 15 %/√h every time. A perfect square-root law, with $k_H = 15$ %/√h.',
        'Extrapolating to 100 % would give $(100/15)^2 = 44$ h, but the √t law fails beyond about 60 %: release slows further as the matrix runs out of undissolved drug.'
      ],
      a: 'Higuchi, Q = 15 %·√(t/h), a diffusion-controlled matrix.'
    },
    {
      title: 'Reading the exponent',
      q: 'A hypromellose tablet releases 12 % at 1 h and 40 % at 4 h. Fit the Korsmeyer–Peppas law and interpret it.',
      steps: [
        '$n = \\log(40/12)/\\log 4 = 0.523/0.602 = 0.87$, and $k = 12$ %/hⁿ (the release at 1 h).',
        'Check at 2 h: $12 \\times 2^{0.87} = 21.9$ %, which can be compared with a measured point.',
        'For a cylinder, n = 0.87 is close to 0.89, case II: release controlled by swelling and erosion of the gel, nearly zero order.'
      ],
      a: 'n ≈ 0.87: close to case II, so release is nearly zero order and controlled by swelling and erosion.'
    },
    {
      title: 'Higuchi from first principles',
      q: 'An ointment contains 100 mg/cm³ of a drug whose solubility in the base is 1.0 mg/cm³; D = 1 × 10⁻⁶ cm²/s. How much drug does 1 cm² release in 8 h, and in 32 h?',
      steps: [
        '$D = 10^{-6} \\times 3600 = 0.0036$ cm²/h.',
        '8 h: $Q_A = \\sqrt{0.0036 \\times (200 - 1) \\times 1.0 \\times 8} = \\sqrt{5.73} = 2.39$ mg/cm².',
        '32 h is four times as long, so twice as much: 4.79 mg/cm², still a small part of the loading, so the equation holds.'
      ],
      a: 'About 2.4 mg/cm² in 8 h and 4.8 mg/cm² in 32 h.'
    }
  ],
  quiz: [
    { q: 'A plot of % released against √t is a straight line up to 60 %. The most likely mechanism is…', choices: ['erosion at a constant surface area', 'diffusion through a matrix along a lengthening path (Higuchi)', 'an osmotic pump', 'first-order dissolution of a fine powder'], a: 1, why: 'The √t law comes from a depleted zone that grows inward, lengthening the diffusion path. Erosion at a constant area and osmotic pumps give zero order.' },
    { q: 'For a cylindrical tablet, a Korsmeyer–Peppas exponent of n = 0.45 suggests…', choices: ['Fickian diffusion', 'case II transport (swelling or erosion)', 'zero-order release', 'a burst release'], a: 0, why: 'For a cylinder, 0.45 is the limit for pure diffusion; 0.89 marks case II.' },
    { q: 'A matrix that follows the Higuchi law releases 30 % in 4 h. What percentage has it released at 9 h?', answer: 45, why: 'Q ∝ √t: 30 × √(9/4) = 30 × 1.5 = 45 %.' },
    { q: 'For first-order release with constant k, write the fraction of the drug still in the dosage form at time t.', answer: 'exp(-k*t)', vars: ['k', 't'], why: 'The released fraction is 1 − e^(−kt), so what remains is e^(−kt).' },
    { q: 'If the Higuchi model gives the highest R², release must be diffusion controlled.', a: false, why: 'Several models can fit the same smooth curve almost equally well. The mechanism must be checked with physics and experiments, not R² alone.' }
  ],
  problems: [
    { q: 'An osmotic tablet starts releasing after a 1 h lag and then releases 6.25 % of its dose per hour. When has it released 80 %, in hours after swallowing?', answer: 13.8, unit: 'h', tol: 0.02, steps: ['Zero order after the lag: $80/6.25 = 12.8$ h of release.', 'Adding the lag: $1 + 12.8 = 13.8$ h.'] },
    { q: 'A matrix releases 20 % in the first hour with a release exponent n = 0.5. When will it reach 60 %, in hours?', answer: 9, unit: 'h', tol: 0.02, steps: ['$60 = 20\\,t^{0.5}$, so $\\sqrt{t} = 3$.', '$t = 9$ h.'] }
  ],
  applications: [
    'Diagnosing how a new extended-release formulation works, and why a batch behaves differently.',
    'Setting dissolution specifications and building in vitro–in vivo correlations.',
    'Choosing tablet geometry and polymer grade to push a matrix towards zero order.',
    'Drug-eluting stents, implants and patches, where the same models apply.'
  ],
  history: 'Hixson and Crowell derived their cube-root law for dissolving particles in 1931. Takeru Higuchi published his square-root law for ointments in 1961 and extended it to granular matrices in 1963. Richard Korsmeyer, Nikolaos Peppas and colleagues introduced the power law for swellable polymers in 1983, and Ritger and Peppas gave its exponents for other shapes in 1987.',
  sim: { id: 'solid-osmotic', params: { view: 'sqrt' } }
},

{
  id: 'osmotic-pumps', parent: 'capsules-mr', title: 'Osmotic and gastro-retentive systems', level: 3,
  short: 'An osmotic pump tablet draws water through a semipermeable membrane and pushes a saturated drug solution out of a laser-drilled hole at a constant rate, largely regardless of pH, food or gut movement. Gastro-retentive systems instead hold a tablet in the stomach, by floating, swelling or sticking, for drugs absorbed only high in the gut.',
  keywords: ['osmotic pump', 'elementary osmotic pump', 'push–pull', 'semipermeable membrane', 'cellulose acetate', 'laser-drilled orifice', 'osmotic pressure', 'osmotic agent', 'zero-order release', 'Theeuwes', 'controlled-porosity osmotic pump', 'ghost tablet', 'gastro-retentive', 'floating tablet', 'swelling tablet', 'expandable', 'mucoadhesive', 'absorption window', 'gastric emptying', 'migrating motor complex'],
  prereq: ['modified-release', 'release-kinetics', 'osmolarity-tonicity', 'chemistry:osmotic-pressure'],
  related: ['gi-absorption', 'food-effects', 'tablet-coating', 'ivivc', 'depot-implants', 'biology:diffusion-osmosis', 'medicine:digestive-system', 'physics:density'],
  body: `
### The elementary osmotic pump
The elementary osmotic pump of Felix Theeuwes (1975) is a tablet with no moving parts. A core of drug, usually mixed with an **osmotic agent** such as sodium chloride, is coated with a **semipermeable membrane**, typically cellulose acetate, that lets water in but not drug out. A laser drills one small hole, a few tenths of a millimetre across, through the coat. In the gut:
1. Water is drawn through the membrane by the difference in osmotic pressure between the saturated core and the gut fluid.
2. The core fills with a saturated solution of drug, but the rigid coat cannot expand.
3. So the same volume of solution is pushed out through the hole.

The membrane sets the water inflow:

$$\\frac{dV}{dt} = \\frac{A\\,L_p}{h}\\,(\\Delta\\pi - \\Delta P)$$

Here $A$ is the membrane area, $h$ its thickness, $L_p$ its permeability to water and $\\Delta\\pi$ the osmotic pressure difference. The hole is sized so that the back-pressure $\\Delta P$ stays small: large enough that pressure does not build up and burst the coat, small enough that drug does not simply diffuse out. The drug delivered is the volume pushed out times its concentration, $R = (dV/dt)\\,C_s$. While solid drug remains in the core, the solution stays saturated, so both $\\Delta\\pi$ and $C_s$ are constant, and so is the rate: **zero order**. The fraction of the drug delivered at this constant rate is $1 - C_s/\\rho$, where $\\rho$ is the density of the drug in the core. The rest comes out in a falling tail once the solid has dissolved.

Osmotic pressures are large. Saturated solutions give roughly 350 atm for sodium chloride, 245 atm for potassium chloride, 150 atm for sucrose and 38 atm for mannitol, while gut fluids give only about 7–8 atm (about 290 mOsm/kg at 37 °C; see [[osmolarity-tonicity]]). So the rate hardly depends on what is in the gut.

### Variations
- **Push–pull** (two-layer) tablets add a layer of swelling polymer, a polyethylene oxide with salt, that pushes a drug suspension out. This suits poorly soluble drugs, which cannot pump themselves.
- **Controlled-porosity** pumps have no drilled hole: a pore-former in the membrane dissolves and leaves many tiny pores.
- **Implantable** osmotic pumps deliver drugs or hormones for weeks to a year ([[depot-implants]]).

Release depends on the membrane and the osmotic agent, not on pH or gut movement, so osmotic tablets often show little food effect and a good in vitro–in vivo correlation ([[ivivc]]). The empty shell passes out intact, and patients may notice it in their stool, which is expected. Because the tablet does not deform, it is used with caution in people with a narrowed gut.

### Gastro-retentive systems
Some drugs are absorbed mainly in the stomach or the upper small intestine, a so-called **absorption window**, and some act in the stomach itself. An ordinary extended-release tablet passes the window within a few hours and wastes the rest of its dose. Gastro-retentive designs hold the tablet in the stomach instead:
- **Floating**: a tablet less dense than gastric fluid (about 1.004 g/mL) floats. Low-density polymers, or sodium bicarbonate that releases carbon dioxide in acid, keep it light. The net upward force is $F = (\\rho_f - \\rho_t)\\,g\\,V$.
- **Swelling or expanding**: a tablet that swells or unfolds to more than the pylorus lets through cannot leave until it softens or erodes.
- **Mucoadhesive**: the tablet sticks to the stomach lining, which is less reliable.

Retention works best after a meal. In the fasting stomach, strong "housekeeper" waves (phase III of the migrating motor complex, roughly every 1.5–2 hours) sweep out anything left, which is why such tablets are usually taken with food ([[food-effects]]).

> [!warn] Osmotic and gastro-retentive tablets must be swallowed whole. Cutting or crushing breaks the membrane or the floating structure and can release the dose at once. Ask a pharmacist before changing how any medicine is taken.
`,
  ideas: [
    'An elementary osmotic pump draws water through a semipermeable coat and pushes saturated drug solution out of a laser-drilled hole.',
    'Water inflow dV/dt = (A Lp/h)(Δπ − ΔP); delivery R = (dV/dt) Cs. Both are constant while solid drug remains, so release is zero order.',
    'The share of the dose delivered at zero order is 1 − Cs/ρ; soluble drugs need an osmotic agent or a push layer.',
    'Osmotic release barely depends on pH, food or motility, because core osmotic pressures (38–350 atm) dwarf those of gut fluids (about 7 atm).',
    'Gastro-retentive tablets float, swell or stick to stay in the stomach for drugs with an absorption window; they work best after a meal.'
  ],
  pitfalls: [
    'The size of the laser-drilled hole sets the release rate — Within its working range the hole hardly matters: the membrane (area, thickness, permeability) and the osmotic pressure set the water inflow, and the hole only lets the solution out.',
    'An osmotic tablet releases all its drug at a constant rate — Only while solid drug keeps the core saturated. The last Cs/ρ of the dose comes out in a declining tail.',
    'A floating tablet works whatever the stomach is doing — On an empty stomach the fasting housekeeper waves can sweep it out within a couple of hours; gastro-retentive systems depend on the fed state.'
  ],
  formulas: [
    {
      name: 'Water inflow through the membrane',
      expr: 'Q = A*Lp*dpi/h', tex: 'Q = \\dfrac{A\\,L_p\\,\\Delta\\pi}{h}',
      vars: {
        Q: { name: 'water inflow (= volume pumped out)', q: 'flowrate', unit: 'mL/h' },
        A: { name: 'membrane area', q: 'area', unit: 'cm²', value: 2.0 },
        Lp: { name: 'water permeability of the membrane', unit: 'm²/(Pa·s)', value: 2.2e-19, tex: 'L_p' },
        dpi: { name: 'osmotic pressure difference', q: 'pressure', unit: 'atm', value: 240, tex: '\\Delta\\pi' },
        h: { name: 'membrane thickness', q: 'length', unit: 'µm', value: 200 }
      },
      note: 'The back-pressure at the hole is neglected. Lp here is a hypothetical value of the right order for a thin cellulose acetate coat; real membranes are measured.',
      practice: { unknowns: ['Q', 'h', 'dpi'] },
      stories: {
        Q: 'An osmotic tablet has {A} of membrane, {h} thick, with Lp = {Lp}; the osmotic pressure difference is {dpi}. How fast does water flow in?',
        h: 'What membrane thickness gives a water inflow of {Q} through {A} of membrane (Lp = {Lp}) with an osmotic pressure difference of {dpi}?'
      }
    },
    {
      name: 'Delivery rate of an osmotic pump',
      expr: 'R = Q*Cs', tex: 'R = Q\\,C_s',
      vars: {
        R: { name: 'drug delivery rate', q: false, unit: 'mg/h' },
        Q: { name: 'volume pumped out', q: false, unit: 'mL/h', value: 0.020 },
        Cs: { name: 'drug concentration pumped (its solubility)', q: false, unit: 'mg/mL', value: 300, tex: 'C_s' }
      },
      note: 'Constant while solid drug keeps the core saturated.',
      stories: { R: 'An osmotic tablet pumps out {Q} of saturated drug solution, and the drug\'s solubility is {Cs}. What is the delivery rate?', Q: 'A drug with a solubility of {Cs} must be delivered at {R}. What pumping rate is needed?' }
    },
    {
      name: 'Share of the dose delivered at zero order',
      expr: 'Fz = 1 - Cs/rho', tex: 'F_z = 1 - \\dfrac{C_s}{\\rho}',
      vars: {
        Fz: { name: 'fraction delivered at a constant rate', q: 'ratio', unit: '%', tex: 'F_z' },
        Cs: { name: 'solubility of the drug in the core', q: 'massconc', unit: 'mg/mL', value: 300, tex: 'C_s' },
        rho: { name: 'density of the drug in the core', q: 'massconc', unit: 'mg/mL', value: 1200, tex: '\\rho' }
      },
      note: 'A core density of 1.2 g/cm³ is 1200 mg/mL. Very soluble drugs would lose most of their zero-order phase, so an osmotic agent or a push layer is added.',
      stories: { Fz: 'A drug has a solubility of {Cs} and a core density of {rho}. What share of it does an elementary osmotic pump deliver at a constant rate?' }
    },
    {
      name: 'Net upward force on a floating tablet',
      expr: 'F = (rhof - rhot)*g*V', tex: 'F = (\\rho_f - \\rho_t)\\,g\\,V',
      vars: {
        F: { name: 'net upward force (negative: it sinks)', q: 'force', unit: 'mN', signed: true },
        rhof: { name: 'density of gastric fluid', q: 'density', unit: 'g/mL', value: 1.004, tex: '\\rho_f' },
        rhot: { name: 'density of the tablet', q: 'density', unit: 'g/mL', value: 0.90, tex: '\\rho_t' },
        g: { const: 'g' },
        V: { name: 'tablet volume', q: 'volume', unit: 'mL', value: 0.8 }
      },
      solveFor: 'F',
      note: 'Buoyancy minus weight. A floating tablet must keep a positive force as it takes up water.',
      stories: { F: 'A {V} tablet with a density of {rhot} sits in gastric fluid of density {rhof}. What is the net upward force on it?' }
    }
  ],
  examples: [
    {
      title: 'How fast, and for how long?',
      q: 'An osmotic tablet has 2.0 cm² of membrane, 200 µm thick, with a (hypothetical) water permeability Lp = 2.2 × 10⁻¹⁹ m²/(Pa·s), and a potassium chloride core giving an osmotic pressure difference of 240 atm. It contains 120 mg of a hypothetical drug with a solubility of 300 mg/mL and a core density of 1.2 g/mL. Estimate the delivery rate and how long it lasts.',
      steps: [
        '$\\Delta\\pi = 240 \\times 101\\,325 = 2.43\\times10^{7}$ Pa. $Q = 2.0\\times10^{-4} \\times 2.2\\times10^{-19} \\times 2.43\\times10^{7}/2.0\\times10^{-4} = 5.35\\times10^{-12}$ m³/s $= 0.0193$ mL/h.',
        '$R = 0.0193 \\times 300 = 5.8$ mg/h.',
        'Zero-order share: $1 - 300/1200 = 75$ %, which is 90 mg, delivered in $90/5.8 = 15.6$ h. The last 30 mg come out in a declining tail.',
        'With a 300 µm membrane the rate falls by a third, to 3.9 mg/h, and the zero-order phase stretches to about 23 h.'
      ],
      a: 'About 5.8 mg/h for roughly 16 hours, then a declining tail.'
    },
    {
      title: 'Will it float?',
      q: 'A gastro-retentive tablet has a volume of 0.80 mL and a density of 0.90 g/mL in gastric fluid of 1.004 g/mL. What is the net force on it? What happens if it soaks up water and its density rises to 1.05 g/mL?',
      steps: [
        '$F = (1004 - 900)\\,\\mathrm{kg/m^3} \\times 9.81 \\times 0.80\\times10^{-6}\\,\\mathrm{m^3} = 8.2\\times10^{-4}$ N, 0.82 mN upward. It floats.',
        'At 1.05 g/mL: $F = (1004 - 1050) \\times 9.81 \\times 0.80\\times10^{-6} = -3.6\\times10^{-4}$ N. It sinks.',
        'Floating tablets therefore generate gas or use very light polymers, so that they stay buoyant as they hydrate.'
      ],
      a: '0.82 mN upward; after soaking to 1.05 g/mL, 0.36 mN downward, and it sinks.'
    }
  ],
  quiz: [
    { q: 'Why does an elementary osmotic pump deliver at a constant rate?', choices: ['the hole slowly widens', 'while solid drug remains, the core solution stays saturated, so the osmotic driving force and the concentration pushed out both stay constant', 'the gut squeezes it at a steady rate', 'the membrane dissolves at a constant rate'], a: 1, why: 'Saturation fixes both Δπ (and so the water inflow) and the concentration of what comes out, so their product, the delivery rate, is constant.' },
    { q: 'Doubling the membrane thickness of an osmotic pump, with everything else unchanged…', choices: ['doubles the rate', 'halves the rate', 'does not change the rate', 'stops release altogether'], a: 1, why: 'Water inflow is proportional to A/h, so twice the thickness halves the inflow and the delivery rate.' },
    { q: 'A drug has a solubility of 200 mg/mL and a core density of 1250 mg/mL. What percentage of it does an elementary osmotic pump deliver at zero order?', answer: 84, why: '1 − 200/1250 = 0.84, or 84 %.' },
    { q: 'Why are gastro-retentive tablets usually taken with a meal?', choices: ['food dissolves the tablet', 'in the fasting stomach, strong housekeeper waves sweep undigested solids out every 1.5–2 h, and eating suppresses them', 'food makes the tablet heavier', 'the drug needs fat to dissolve'], a: 1, why: 'The fed stomach grinds and empties slowly, so a large or floating unit can stay for hours. Fasting phase III waves empty it.' },
    { q: 'The release rate of an elementary osmotic pump depends strongly on the pH of the gut.', a: false, why: 'Release is set by the membrane and the core\'s osmotic pressure. As long as the coat is insoluble, gut pH hardly matters, which is one of the strengths of the design.' }
  ],
  problems: [
    { q: 'An osmotic pump draws in 0.025 mL/h of water, and its drug has a solubility of 150 mg/mL. What is the delivery rate, in mg/h?', answer: 3.75, unit: 'mg/h', tol: 0.02, steps: ['$R = Q\\,C_s = 0.025 \\times 150 = 3.75$ mg/h.'] },
    { q: 'A 1.2 mL tablet with a density of 0.95 g/mL floats in gastric fluid of 1.004 g/mL. What is the net upward force, in mN?', answer: 0.64, unit: 'mN', tol: 0.03, steps: ['$F = (1004 - 950) \\times 9.81 \\times 1.2\\times10^{-6}$ N.', '$F = 6.4\\times10^{-4}$ N $= 0.64$ mN.'] }
  ],
  applications: [
    'Once-daily tablets that release at a steady rate, for example in high blood pressure, diabetes and attention-deficit hyperactivity disorder.',
    'Implantable osmotic pumps for research animals and for long-term hormone delivery.',
    'Floating and expanding tablets for drugs with an absorption window in the upper gut.',
    'Local treatment in the stomach.'
  ],
  history: 'Rose and Nelson described an osmotic pump for animal experiments in 1955. Felix Theeuwes and colleagues designed the elementary osmotic pump tablet in 1975, and the push–pull system for poorly soluble drugs followed in the 1980s.',
  sim: 'solid-osmotic'
},

{
  id: 'odt', parent: 'capsules-mr', title: 'Orally disintegrating and chewable forms', level: 1,
  short: 'Orally disintegrating tablets fall apart on the tongue within seconds to three minutes and are swallowed with saliva, which helps children, older people and anyone who finds tablets hard to swallow. Chewable, dispersible and effervescent tablets and oral films solve the same problem in other ways. Masking the taste is the hard part.',
  keywords: ['orally disintegrating tablet', 'orodispersible tablet', 'ODT', 'freeze-dried wafer', 'lyophilised tablet', 'superdisintegrant', 'wicking', 'Washburn equation', 'taste masking', 'mouthfeel', 'chewable tablet', 'dispersible tablet', 'effervescent tablet', 'oral film', 'dysphagia', 'swallowing difficulty', 'mannitol', 'sodium content', 'phenylketonuria', 'aspartame'],
  prereq: ['excipients', 'compaction', 'tablet-testing', 'physics:surface-tension'],
  related: ['paediatric-geriatric', 'tablet-coating', 'lyophilisation', 'printing-medicines', 'capsules', 'first-pass', 'medicine:ageing', 'physics:viscosity'],
  body: `
Many people find tablets hard to swallow: young children, older people, people after a stroke or living with Parkinson's disease, and anyone who feels sick. Some skip their medicines, or crush tablets that should not be crushed. Forms that dissolve or disperse in the mouth, or are chewed, remove the problem.

### Orally disintegrating tablets
An **orally disintegrating** (orodispersible) tablet is placed on the tongue, falls apart in saliva and is swallowed. The European Pharmacopoeia requires orodispersible tablets to disintegrate within 3 minutes in its standard test, and FDA guidance (2008) expects about 30 seconds or less in vitro, for tablets up to about 500 mg. Several technologies achieve this:
- **Freeze-dried wafers**: a solution or suspension is freeze-dried in the blister pocket itself ([[lyophilisation]]). The result is a highly porous foam that dissolves in a few seconds but is fragile and takes up moisture, so it is peeled out of a special blister rather than pushed through foil.
- **Compressed ODTs** are made on ordinary presses, with sugar alcohols such as mannitol (sweet, cooling, not gritty), plenty of superdisintegrant, and a low compaction force so that the tablet stays porous ([[compaction]]). The price is a softer, more friable tablet.
- **Others**: moulded tablets, candy-floss matrices, effervescent mixtures and 3-D printing. The first 3-D-printed medicine to be approved (2015) was a highly porous tablet designed to disperse in a sip of water ([[printing-medicines]]).

Most of the drug from an ODT is still swallowed and absorbed in the gut, so blood levels are usually much like those from an ordinary tablet. A few drugs are partly absorbed through the lining of the mouth and escape some first-pass metabolism ([[first-pass]]), which can change how much reaches the blood.

### Why water gets in so fast
Disintegration starts when water enters the pores by capillary action. The Washburn equation gives the depth $L$ reached in time $t$ through pores of radius $r$:

$$L^2 = \\frac{r\\,\\gamma\\cos\\theta}{2\\eta}\\,t$$

A liquid with a high surface tension $\\gamma$ and a low viscosity $\\eta$, which wets the solid well (a small contact angle $\\theta$), gets in fast. The time to reach a given depth is inversely proportional to the pore radius. That is why ODTs are highly porous, made with water-loving sugars and compressed gently. Once the water arrives, disintegrant particles swell and push the tablet apart.

### Taste and mouthfeel
A tablet that dissolves in the mouth exposes the tongue to the drug. Bitter drugs are **taste-masked** with coated particles (often a polymer that dissolves only at stomach pH), ion-exchange resins that hold the drug until they meet the ions of the stomach, cyclodextrin complexes, sweeteners and flavours. Particles are kept below about 200 µm, so that the dispersed tablet does not feel gritty.

### Other forms that avoid swallowing a whole tablet
| Form | How it is taken | Typical requirement |
|---|---|---|
| Orodispersible tablet | disperses on the tongue | disintegrates within 3 min (Ph. Eur.) |
| Dispersible tablet | dispersed in water first | disintegrates within 3 min in water at 15–25 °C (Ph. Eur.) |
| Effervescent tablet | dissolved in water, releasing carbon dioxide | dissolves or disperses within 5 min (Ph. Eur.) |
| Chewable tablet | chewed, then swallowed | dissolution tested on the whole tablet, in case it is swallowed unchewed (FDA guidance, 2016) |
| Orodispersible film | a thin strip placed on the tongue | disperses within seconds |

Effervescent tablets rely on an acid, usually citric acid, reacting with sodium hydrogen carbonate. One tablet can carry a few hundred milligrams of sodium.

> [!warn] Some ODTs and chewable tablets contain aspartame, a source of phenylalanine that matters for people with phenylketonuria, and effervescent tablets can contain a lot of sodium. These "excipients with known effect" are listed in the leaflet, and a pharmacist can suggest alternatives. Never crush or disperse a modified-release medicine to make it easier to swallow unless the leaflet says you may.
`,
  ideas: [
    'Orally disintegrating tablets fall apart on the tongue (within 3 min by Ph. Eur., about 30 s in FDA guidance) and are swallowed with saliva.',
    'Most drug from an ODT is still absorbed in the gut; only a few drugs are absorbed partly through the mouth.',
    'Washburn: L² = rγ cos θ t/(2η). High porosity, wettable sugars and gentle compression let water in quickly.',
    'Taste masking (coated particles, resins, sweeteners) and small particles are essential for anything that dissolves in the mouth.',
    'Chewable, dispersible, effervescent tablets and oral films are other answers to swallowing difficulty, each with its own trade-offs.'
  ],
  pitfalls: [
    'An orally disintegrating tablet always acts faster — Most ODTs give blood levels much like ordinary tablets, because the drug is swallowed and absorbed in the gut. Faster disintegration is about convenience, not speed of effect.',
    'An ODT is absorbed through the tongue, like a sublingual tablet — Only a few drugs are absorbed in the mouth to a useful extent. Sublingual products are designed and tested for that; ODTs usually are not.',
    'Any tablet can be crushed and stirred into food instead — Crushing modified-release, enteric or some coated tablets destroys their design, and some drugs are unpleasant or hazardous to handle. Ask a pharmacist, who may suggest a suitable form.'
  ],
  formulas: [
    {
      name: 'Washburn equation for wicking into pores',
      expr: 'L^2 = r*gamma*cos(theta)*t/(2*eta)', tex: 'L^2 = \\dfrac{r\\,\\gamma\\cos\\theta}{2\\eta}\\,t',
      vars: {
        L: { name: 'depth reached by the water', q: 'length', unit: 'mm' },
        r: { name: 'pore radius', q: 'length', unit: 'µm', value: 0.2 },
        gamma: { name: 'surface tension of the liquid', q: 'surfacetension', unit: 'mN/m', value: 72, tex: '\\gamma' },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 80, min: 0, max: 89.9, tex: '\\theta' },
        t: { name: 'time', q: 'time', unit: 's', value: 2.0 },
        eta: { name: 'viscosity of the liquid', q: 'viscosity', unit: 'mPa·s', value: 0.70, tex: '\\eta' }
      },
      solveFor: 'L',
      note: 'Straight cylindrical pores; in a real tablet the pores are tortuous and swelling changes them, so the numbers are estimates. Water at 37 °C has a viscosity of about 0.70 mPa·s.',
      practice: { unknowns: ['L', 't', 'r'] },
      stories: {
        L: 'Water (surface tension {gamma}, viscosity {eta}) enters pores of radius {r} in a tablet it wets with a contact angle of {theta}. How deep does it get in {t}?',
        t: 'How long does water (surface tension {gamma}, viscosity {eta}, contact angle {theta}) take to reach {L} into pores of radius {r}?'
      }
    },
    {
      name: 'Sodium hydrogen carbonate for an effervescent couple',
      expr: 'mb = 3*Mb*ma/Ma', tex: 'm_b = \\dfrac{3\\,M_b\\,m_a}{M_a}',
      vars: {
        mb: { name: 'sodium hydrogen carbonate', q: 'mass', unit: 'mg', tex: 'm_b' },
        Mb: { name: 'molar mass of NaHCO₃', q: 'molarmass', unit: 'g/mol', value: 84.01, fixed: true, tex: 'M_b' },
        ma: { name: 'citric acid (anhydrous)', q: 'mass', unit: 'mg', value: 400, tex: 'm_a' },
        Ma: { name: 'molar mass of citric acid', q: 'molarmass', unit: 'g/mol', value: 192.12, fixed: true, tex: 'M_a' }
      },
      note: 'From $\\ce{C6H8O7 + 3NaHCO3 -> Na3C6H5O7 + 3CO2 + 3H2O}$: each citric acid molecule, with three acid groups, neutralises three hydrogen carbonates.',
      stories: { mb: 'An effervescent tablet contains {ma} of anhydrous citric acid. How much sodium hydrogen carbonate neutralises it exactly?', ma: 'How much anhydrous citric acid exactly neutralises {mb} of sodium hydrogen carbonate?' }
    },
    {
      name: 'Sodium carried by sodium hydrogen carbonate',
      expr: 'mNa = mb*MNa/Mb', tex: 'm_{\\mathrm{Na}} = m_b\\,\\dfrac{M_{\\mathrm{Na}}}{M_b}',
      vars: {
        mNa: { name: 'sodium', q: 'mass', unit: 'mg', tex: 'm_{\\mathrm{Na}}' },
        mb: { name: 'sodium hydrogen carbonate', q: 'mass', unit: 'mg', value: 525, tex: 'm_b' },
        MNa: { name: 'molar mass of sodium', q: 'molarmass', unit: 'g/mol', value: 22.99, fixed: true, tex: 'M_{\\mathrm{Na}}' },
        Mb: { name: 'molar mass of NaHCO₃', q: 'molarmass', unit: 'g/mol', value: 84.01, fixed: true, tex: 'M_b' }
      },
      note: 'Sodium is 27.4 % of sodium hydrogen carbonate by mass. A drug given as its sodium salt adds more.',
      stories: { mNa: 'An effervescent tablet contains {mb} of sodium hydrogen carbonate. How much sodium does it provide?' }
    }
  ],
  examples: [
    {
      title: 'How fast does water get in?',
      q: 'Water at 37 °C (72 mN/m, 0.70 mPa·s) wets a tablet with a contact angle of 80°. How long does it take to reach the middle of a 4 mm tablet (2 mm from each face) through pores of radius 0.2 µm? And through 0.05 µm pores in a harder-pressed tablet, or with a water-repellent surface (89°)?',
      steps: [
        '$t = 2\\eta L^2/(r\\gamma\\cos\\theta) = 2 \\times 0.70\\times10^{-3} \\times (2\\times10^{-3})^2/(0.2\\times10^{-6} \\times 0.072 \\times 0.174) = 2.2$ s.',
        'Pores of 0.05 µm, a quarter of the radius: four times as long, about 9 s.',
        'At 89°, $\\cos\\theta$ falls from 0.174 to 0.017, ten times smaller: about 22 s, even with the original pores. A little magnesium stearate over-mixed into an ODT can do exactly this.'
      ],
      a: 'About 2 s; about 9 s with smaller pores; about 22 s if the pores are water-repellent.'
    },
    {
      title: 'Sodium in an effervescent tablet',
      q: 'An effervescent tablet contains 400 mg of anhydrous citric acid, exactly neutralised by sodium hydrogen carbonate. How much sodium does one tablet provide? For comparison, WHO (2012) recommends that adults take less than 2 g of sodium a day.',
      steps: [
        'Sodium hydrogen carbonate: $3 \\times 84.01 \\times 400/192.12 = 525$ mg.',
        'Sodium: $525 \\times 22.99/84.01 = 144$ mg.',
        'Three tablets a day provide about 430 mg of sodium, more than a fifth of the WHO limit, before any food. This is why the sodium content of effervescent medicines is declared.'
      ],
      a: 'About 144 mg of sodium per tablet.'
    }
  ],
  quiz: [
    { q: 'In its standard test, the European Pharmacopoeia requires orodispersible tablets to disintegrate within…', choices: ['15 seconds', '3 minutes', '15 minutes', '30 minutes'], a: 1, why: 'The Ph. Eur. limit is 3 minutes, the same as for dispersible tablets. FDA guidance asks for about 30 seconds or less.' },
    { q: 'Where is most of the drug from a typical ODT absorbed?', choices: ['through the tongue', 'in the gut, after being swallowed with saliva', 'in the nose', 'through the lips'], a: 1, why: 'The tablet disperses in the mouth, but the drug is swallowed and absorbed like that from an ordinary tablet, except for the few drugs designed for buccal absorption.' },
    { q: 'By the Washburn equation, halving the pore radius makes water take ___ as long to reach the centre of a tablet.', choices: ['half', 'the same time', 'twice', 'four times'], a: 2, why: 't = 2ηL²/(rγ cos θ): the time is inversely proportional to r, so half the radius doubles it.' },
    { q: 'An orally disintegrating version of a medicine always acts faster than the ordinary tablet.', a: false, why: 'Usually both are absorbed in the gut at a similar rate. The benefit is that no water or swallowing of a whole tablet is needed.' },
    { q: 'How many mg of sodium hydrogen carbonate (84.01 g/mol) exactly neutralise 192 mg of anhydrous citric acid (192.12 g/mol)?', answer: 252, unit: 'mg', why: '192 mg is 0.999 mmol of citric acid, which neutralises three times as much NaHCO₃: 3 × 0.999 × 84.01 = 252 mg.' }
  ],
  problems: [
    { q: 'How much sodium, in mg, is in 1000 mg of sodium hydrogen carbonate?', answer: 274, unit: 'mg', tol: 0.01, steps: ['$1000 \\times 22.99/84.01 = 274$ mg.'] }
  ],
  applications: [
    'Medicines for children and for older people with swallowing difficulties.',
    'Medicines for nausea or migraine, which can be taken without water.',
    'Dispersible tablets for children where liquid medicines are hard to store and transport.',
    'Situations where no water is at hand.'
  ],
  history: 'Chewable and effervescent tablets are old; effervescent salts were popular in the nineteenth century. Freeze-dried wafers that dissolve on the tongue reached the market in the late 1980s, the FDA published guidance on orally disintegrating tablets in 2008, and the first 3-D-printed tablet approved by the FDA, in 2015, was designed to disperse in a mouthful of water.',
  sim: 'solid-disintegration'
}

);
