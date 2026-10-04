/* HYPER-OPTICS · content/optical-phenomena.js — the topic "Phenomena and optical tricks".
 * Real optics that surprises: what the atmosphere does to light (mirages, halos, the blue sky, the green flash),
 * and what clever optics does to the eye (Pepper's ghost, 3-D displays, holograms, iridescence, camera artefacts,
 * one-way mirrors, the Moon illusion). Simulations: sims/optical-phenomena.js (ids ph-…).
 */
Hyper.add(

/* ================================================================ mirages */
{
  id: 'mirages-and-looming', parent: 'optical-phenomena', title: 'Mirages and looming', level: 2,
  short: 'Air is a refracting medium whose index depends on its temperature. Where the temperature changes fast with height, rays curve, and distant things appear below, above or twice over: the pool of "water" on a hot road, the ship floating above a cold sea, the castles of the Fata Morgana.',
  keywords: ['mirage', 'inferior mirage', 'superior mirage', 'looming', 'towering', 'stooping', 'Fata Morgana', 'Novaya Zemlya effect', 'hot road', 'heat haze', 'shimmer', 'temperature inversion', 'refraction in air', 'duct', 'horizon'],
  prereq: ['snells-law', 'critical-angle-and-total-internal-reflection', 'refractive-index'],
  related: ['atmospheric-refraction', 'the-green-flash-and-twinkling', 'fermats-principle', 'physics:refraction'],
  body: `
A mirage is not a trick of the mind. It can be photographed, and a camera sees the same upside-down tree under the real one. Nothing is wrong with the light, which obeys [[snells-law|Snell's law]] everywhere; what is unusual is the *air*.

### Air is a weak, adjustable lens
The refractive index of air at 15 °C and sea-level pressure is about 1.000277. The part above 1 is proportional to the density, so it shrinks as the air warms: at 60 °C it is 1.000240. Two neighbouring layers of air a few tens of degrees apart differ in index by only about $2\\times10^{-5}$, some twenty thousand times less than the step from air to glass. Yet a ray that runs almost horizontally for hundreds of metres has time to add that up.

A ray in air with a vertical index gradient does not travel straight. It bends **towards the higher index**, that is, towards the denser, cooler air. If the ray meets a layer at a grazing angle $\\alpha$ smaller than about

$$\\alpha_{\\max} \\approx \\sqrt{2\\,\\Delta n}$$

it is turned right round, exactly like [[critical-angle-and-total-internal-reflection|total internal reflection]] spread over a smooth gradient. For road-hot air at 60 °C over air at 30 °C, $\\Delta n = 2.4\\times10^{-5}$ and $\\alpha_{\\max}$ is 0.4°. That is why a road mirage appears only some way ahead: only far stretches of road are seen at so shallow an angle.

### Inferior mirage: the pool on the road
Hot ground warms a thin layer of thin air. Light from the sky going down towards the road curves back up and reaches the eye *from below the horizon*: the eye sees a patch of sky lying on the road, which looks like water, plus inverted images of cars and trees standing in it. Turbulence makes it shimmer. "Inferior" means the image lies below the object.

### Superior mirage: looming over cold water
Over cold sea, ice or snow the air is coldest at the surface and warmer above: an **inversion**. Now rays curve *downwards*, following the curve of the Earth, and light that would have gone off into space is delivered to the eye. Objects beyond the geometric horizon are lifted into view (**looming**), or stretched (**towering**) or squashed (**stooping**). Even ordinary air does a little of this: the distance to the horizon in kilometres is $3.57\\sqrt{h}$ for an eye $h$ metres high, and about $3.86\\sqrt{h}$ once the standard curving of rays is included, 8 % farther.

With several inversion layers the eye receives light from one object along several paths and sees stacked erect and inverted images, stretched into walls and towers: the **Fata Morgana**.

| | Inferior mirage | Superior mirage |
|---|---|---|
| Surface | hot: road, sand, runway | cold: sea, ice, snow |
| Air temperature | falls with height | rises with height (inversion) |
| Rays | curve upwards | curve downwards |
| Image | below the object, inverted | above it: erect, inverted, stretched |
| Typical range | 100–500 m | 10–100 km |

> [!warn] Heat shimmer is also what limits a long telephoto lens or a telescope used low over warm ground: no lens can correct for the air in front of it.

> [!key] A mirage is refraction in air whose temperature changes with height. Rays always curve towards the cooler, denser air: upwards over a hot surface (image below), downwards over a cold one (image above).
`,
  ideas: [
    'Air\'s index excess over 1 is proportional to its density, so hot air has a lower index than cool air.',
    'A ray in a gradient bends towards the higher index, the cooler air.',
    'A road mirage is an image of the sky, bent up by a hot layer; only rays below about half a degree from horizontal are turned.',
    'A superior mirage needs warm air over cold: it lifts objects from beyond the horizon.',
    'Several inversion layers give stacked, stretched images: the Fata Morgana.'
  ],
  pitfalls: [
    'A mirage is an illusion in the head — It is a real image formed by refraction; a camera records it, and it follows the laws of optics.',
    'The road mirage is water, or a reflection from a wet road — It is an image of the sky. Nothing wet is there, and if you walk to it, it recedes, because the angle that makes it only exists at a distance.',
    'Rays bend towards the hot air — They bend towards the higher index, which is the cool, dense air; that is why they bend up over hot ground.',
    'Only deserts have mirages — Any strong temperature change with height does it: roads, runways, the sea, polar ice, even a hot barbecue grill seen edge-on.'
  ],
  terms: [
    { term: 'Mirage', def: 'An image formed by the refraction of light in air whose temperature, and so refractive index, changes with height. It is a real optical image, not a hallucination.' },
    { term: 'Inferior mirage', def: 'A mirage in which the image appears below the object. It occurs over a hot surface and shows an inverted image, such as the sky seen as "water" on a road.' },
    { term: 'Superior mirage', def: 'A mirage in which the image appears above the object, caused by warm air over cold. It can lift objects from beyond the horizon into view.' },
    { term: 'Looming', also: ['towering', 'stooping'], def: 'The lifting of distant objects above their true position by downward-curving rays. Towering stretches the image upwards; stooping squashes it.' },
    { term: 'Temperature inversion', def: 'A layer in which the air gets warmer with height, instead of cooler. It makes rays curve down and can trap them in a duct.' },
    { term: 'Fata Morgana', def: 'A complex superior mirage with several inversion layers: objects appear in stacked erect and inverted copies, stretched into cliffs and towers.' }
  ],
  formulas: [
    {
      name: 'Index of air against temperature',
      expr: 'n = 1 + n0*T0/T', tex: 'n = 1 + n_0\\,\\frac{T_0}{T}',
      vars: {
        n: { name: 'refractive index at temperature T', tex: 'n' },
        n0: { name: 'excess of the index over 1 at T₀ (15 °C, sea level)', value: 2.77e-4, tex: 'n_0' },
        T0: { name: 'reference temperature', q: 'temperature', unit: 'K', value: 288.15, fixed: true, tex: 'T_0' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 60, tex: 'T' }
      },
      solveFor: 'n',
      note: 'At constant pressure the density, and with it n − 1, is inversely proportional to the absolute temperature.',
      stories: { n: 'Air over a road is at {T}. Given that n − 1 is {n0} at 15 °C, what is the refractive index of the road-hot air?' }
    },
    {
      name: 'Steepest ray a layer can turn back',
      expr: 'a = sqrt(2*dn)', tex: '\\alpha_{\\max} = \\sqrt{2\\,\\Delta n}',
      vars: {
        a: { name: 'greatest grazing angle that is turned back', q: 'angle', unit: '°', tex: '\\alpha_{\\max}' },
        dn: { name: 'index difference across the layer', value: 2.4e-5, tex: '\\Delta n' }
      },
      solveFor: 'a',
      note: 'For small angles; the same condition as total reflection at a boundary, cos α = n₂/n₁.',
      practice: { unknowns: ['a'] }
    },
    {
      name: 'Distance to the horizon',
      expr: 'd = sqrt(2*Re*h/(1-k))', tex: 'd = \\sqrt{\\frac{2\\,R_E\\,h}{1-k}}',
      vars: {
        d: { name: 'distance to the horizon', q: 'length', unit: 'km', tex: 'd' },
        Re: { const: 'Rearth', tex: 'R_E' },
        h: { name: 'height of the eye', q: 'length', unit: 'm', value: 1.7, tex: 'h' },
        k: { name: 'refraction coefficient (0 = none)', value: 0.14, min: 0, max: 0.9, tex: 'k' }
      },
      solveFor: 'd',
      note: 'k ≈ 0.14 is the usual value for the curving of rays in ordinary air; a superior mirage means a larger k.',
      stories: { d: 'An observer\'s eye is {h} above the sea. How far away is the horizon, when the refraction coefficient is {k}?' }
    }
  ],
  examples: [
    {
      title: 'How far is a ship hidden by the horizon?',
      q: 'A lookout stands with eyes 5 m above the sea. A ship\'s mast top is 25 m high. In ordinary air (k = 0.14), how far away can the mast top be seen?',
      steps: [
        'The eye and the mast top each have a horizon: $d = 3.86\\sqrt{h}$ km. For the eye, $3.86\\times\\sqrt{5} = 8.6$ km.',
        'For the mast top, $3.86\\times\\sqrt{25} = 19.3$ km.',
        'The mast top just shows when the two horizons meet: $8.6 + 19.3 = 27.9$ km. Without refraction the figure would be $3.57\\,(\\sqrt5+\\sqrt{25}) = 25.8$ km.'
      ],
      a: 'About 28 km in ordinary air. A superior mirage lifts the ship into view beyond that.'
    },
    {
      title: 'The index of road-hot air',
      q: 'The index of air at 15 °C is 1.000277. What is it over a road surface at 60 °C, and how much lower is it than the air at 30 °C?',
      steps: [
        'The excess over 1 scales as $1/T$: $2.77\\times10^{-4}\\times288.15/333.15 = 2.40\\times10^{-4}$, so $n = 1.000240$.',
        'At 30 °C (303.15 K): $2.77\\times10^{-4}\\times288.15/303.15 = 2.64\\times10^{-4}$.',
        'The difference is $2.4\\times10^{-5}$, giving a greatest turned grazing angle of $\\sqrt{2\\times2.4\\times10^{-5}} = 6.9\\times10^{-3}$ rad = 0.4°.'
      ],
      a: 'n = 1.000240, lower by 2.4 × 10⁻⁵ than air at 30 °C; rays within 0.4° of horizontal are turned.'
    }
  ],
  quiz: [
    { q: 'What is the "water" seen on a hot road in a mirage?', choices: ['A thin film of water or oil on the surface', 'An image of the sky, bent upwards by the hot air layer', 'Light reflected from the road at grazing incidence by the surface itself', 'A hallucination caused by heat'], a: 1, why: 'Rays from the sky heading down are curved back up by the thin hot air, so the eye sees sky below the horizon. The surface reflects nothing special, and a camera records the effect.' },
    { q: 'A ray travels through air whose temperature falls with height. It curves towards the ground.', a: false, why: 'Rays bend towards the higher index, the cooler air. If air gets cooler with height, cool air is above, so the ray bends up (the normal case near hot ground). Downward bending needs warm air over cold.' },
    { q: 'Over a cold sea you can see a ship that is geometrically below the horizon. Which temperature profile makes this possible?', choices: ['Warm air over cold air (an inversion)', 'Cold air over warm air', 'The same temperature everywhere', 'It cannot happen without clouds'], a: 0, why: 'Warmer air above has the lower index, so rays curve down, following the Earth, and objects beyond the horizon are lifted into view.' },
    { q: 'Compared with air at 15 °C, by what factor is the excess of the refractive index over 1 (n − 1) multiplied at 60 °C? (n − 1 ∝ 1/T)', answer: 0.865, why: '288.15 K / 333.15 K = 0.865, so n − 1 falls by 13.5 %.' },
    { q: 'Why does a road mirage seem to retreat as you walk towards it?', choices: ['The air gets hotter as you come near', 'Only rays within about half a degree of horizontal are turned, and that only happens for the distant road', 'The water evaporates', 'Your eyes adapt'], a: 1, why: 'Close to you the line of sight meets the road at a steeper angle than the turning limit (about 0.4°), so the effect exists only farther away, and the boundary moves ahead as you advance.' }
  ],
  applications: [
    'Surveying and geodesy: long sight lines near the ground suffer refraction errors, so levelling is done in the cool of the morning and with short sights.',
    'Radio and radar: the same gradient bends radio waves, and ducts over the sea carry VHF and radar signals far beyond the horizon.',
    'Navigation: a lighthouse or coast seen beyond its normal range, or a false island, is a looming effect. A reported Arctic land seen by an explorer in 1906 was later judged a mirage.',
    'Photography and astronomy: heat shimmer over tarmac or a warm roof blurs distant detail and limits useful magnification.'
  ],
  history: 'The mathematician Gaspard Monge, marching with the French army in Egypt in 1798, explained the lakes the soldiers saw in the desert as images of the sky refracted by the hot air near the ground. The Fata Morgana takes its name from Morgan le Fay, the fairy of Arthurian legend, to whom Sicilians attributed the castles seen over the Strait of Messina. In 1597 a Dutch expedition wintering on Novaya Zemlya saw the Sun about two weeks before it should have returned, lifted over the horizon by Arctic refraction.',
  sources: [
    'D. K. Lynch and W. Livingston, *Color and Light in Nature*, 2nd ed. (Cambridge University Press, 2001) — the sections on mirages and looming.',
    'M. Minnaert, *Light and Colour in the Open Air* (Dover reprint) — the chapters on refraction in the lower air.',
    'E. Hecht, *Optics*, ch. 4 — the ray path in a medium of varying index.'
  ],
  sim: 'ph-mirage'
},

/* ================================================================ halos, glories, coronas */
{
  id: 'halos-glories-and-coronas', parent: 'optical-phenomena', title: 'Halos, glories and coronas', level: 2,
  short: 'Rings of light around the Sun or Moon come in three kinds. A 22° halo is refraction through ice prisms in high cloud; a corona is diffraction by tiny water droplets; a glory is light thrown straight back by droplets. They look alike and have different causes, sizes and colour orders.',
  keywords: ['halo', '22 degree halo', '46 degree halo', 'sun dog', 'parhelion', 'corona', 'glory', 'Brocken spectre', 'ice crystals', 'cirrostratus', 'minimum deviation', 'circumzenithal arc', 'tangent arc', 'sun pillar', 'diffraction ring'],
  prereq: ['snells-law', 'dispersion-and-the-spectrum', 'what-diffraction-is'],
  related: ['rainbows', 'the-airy-disk', 'atmospheric-refraction', 'why-the-sky-is-blue', 'diffraction-in-everyday-life'],
  body: `
When thin high cloud drifts over the Sun or the Moon, the sky sometimes grows a ring. Three families of rings look alike and have three different causes.

### The 22° halo: a prism in the sky
Cirrus and cirrostratus clouds, 5–10 km up, are made of ice crystals, many of them small hexagonal prisms whose side faces make 60° with each other. A ray that enters one side face and leaves through another crosses a 60° prism of ice, $n \\approx 1.31$. A [[prism-types|prism]] turns light by an amount that depends on the angle of incidence, but never by less than the **minimum deviation**

$$\\delta_{\\min} = 2\\arcsin\\!\\left(n\\sin\\frac{A}{2}\\right) - A$$

For $A = 60°$ and $n = 1.31$ that is 21.8°. The crystals tumble at random, but near the minimum the deviation barely changes with the angle of incidence, so many orientations send light to nearly the same place: it piles up at 22° from the Sun. The ring has a **sharp inner edge** (no light is turned less) and a soft outer one, and the inner edge is red, since red has the lower index: 21.7° for red, 22.3° for blue.

### The 46° halo and the arcs
A ray entering a side face and leaving by an end face crosses a 90° prism: $\\delta_{\\min} = 45.7°$. This 46° halo is fainter. Crystals that fall with a preferred orientation make arcs instead: tangent arcs, the circumzenithal arc above a low Sun, sun pillars.

### Sun dogs
Flat plates fall with their faces horizontal. Light crossing their side faces meets a 60° prism with a vertical edge and is concentrated in two bright spots at the Sun's height, red on the side facing the Sun. Because the rays slant, the minimum deviation grows as the Sun climbs:

| Sun's elevation | 0° | 10° | 20° | 30° | 40° | 50° |
|---|---|---|---|---|---|---|
| Sun dog's distance from the Sun | 21.8° | 22.1° | 23.1° | 24.8° | 27.6° | 32.4° |

Above about 61° no ray gets through, and the sun dogs vanish.

### Coronas: diffraction by droplets
A **corona** is a set of rings only a few degrees across, seen through thin water cloud. Each droplet, 10–40 µm across, diffracts light like a small disc, and the first dark ring of its [[the-airy-disk|Airy pattern]] lies where

$$\\sin\\theta = 1.22\\,\\frac{\\lambda}{d}$$

For $d = 20$ µm this is 1.6° for blue (450 nm), 1.9° for green and 2.3° for red (650 nm). Different colours get their dark rings at different angles, so the rings are coloured, red *outermost*. Ring size goes inversely with droplet size: a shrinking corona means growing droplets.

### Glories
A **glory** is a set of small coloured rings around the *anti-solar point*, the shadow of your own head, seen on cloud or fog below you from a mountain or aircraft. It is light scattered almost straight back by droplets, and it needs the full wave theory of scattering. Red is outside, as in the corona.

| | 22° halo | Corona | Glory | Rainbow |
|---|---|---|---|---|
| Made by | refraction in ice prisms | diffraction by droplets | backscatter by droplets | refraction and reflection in drops |
| Angle from the centre | 22° | 1–5° | about 2–5° | 42° |
| Red is | inside | outside | outside | outside |

> [!warn] Never look at the Sun to see a halo or corona. Let a roof, a tree or your hand block the Sun, or look at the Moon, whose halos and coronas are just as fine.

> [!key] A halo is ice refracting light, with a sharp inner edge at the 22° minimum deviation and red inside. A corona is water droplets diffracting it, small and red outside. A glory is droplets throwing it straight back.
`,
  ideas: [
    'A halo\'s radius is the minimum deviation of an ice prism: 21.8° for a 60° prism and 45.7° for a 90° prism, with n = 1.31.',
    'Light piles up at the minimum deviation, giving a sharp inner edge; red is the inner colour.',
    'Sun dogs come from plate crystals and move outwards as the Sun climbs; they vanish above about 61°.',
    'A corona is diffraction by droplets: sin θ = 1.22 λ/d, red outermost, rings growing as droplets shrink.',
    'A glory is backscattering by droplets, centred on the shadow of the observer.'
  ],
  pitfalls: [
    'A halo is a rainbow round the Sun — A rainbow comes from raindrops and lies opposite the Sun at 42°. A halo comes from ice crystals, circles the Sun at 22°, is mostly pale, and has red on the inside.',
    'A corona is a small halo — A corona is made by diffraction in water droplets, a halo by refraction in ice crystals. The colour order is reversed (red outside for a corona, inside for a halo).',
    'Halos need a special kind of ice — They need only crystals with 60° or 90° faces, which are very common in high cloud; the effect is seen on many days a year in temperate climates.',
    'Droplets or crystals act like a prism for the whole ring — Each crystal sends light to only a tiny part of the ring; the ring is the sum of countless crystals at all orientations.'
  ],
  terms: [
    { term: 'Halo', also: ['22° halo', '46° halo'], def: 'A ring of light around the Sun or Moon, formed by refraction in hexagonal ice crystals. Its radius is the minimum deviation of the crystal prism: 22° or 46°.' },
    { term: 'Minimum deviation', def: 'The smallest angle through which a prism can turn a ray. Near it the deviation changes slowly with the angle of incidence, so light is concentrated there.' },
    { term: 'Sun dog', also: ['parhelion', 'mock sun'], def: 'A bright coloured patch beside the Sun at the same height, made by refraction in plate-shaped ice crystals falling with horizontal faces.' },
    { term: 'Corona', def: 'Coloured rings a few degrees across around the Sun or Moon, made by diffraction of light by cloud droplets of nearly equal size.' },
    { term: 'Glory', def: 'Coloured rings around the point opposite the Sun (the shadow of the observer\'s head), made by light scattered backwards by water droplets.' },
    { term: 'Anti-solar point', def: 'The point of the sky exactly opposite the Sun, where the shadow of your head falls. Rainbows and glories are centred on it.' }
  ],
  formulas: [
    {
      name: 'Minimum deviation of a prism',
      expr: 'd = 2*asin(n*sin(A/2)) - A', tex: '\\delta_{\\min} = 2\\arcsin\\!\\left(n\\sin\\frac{A}{2}\\right) - A',
      vars: {
        d: { name: 'minimum deviation', q: 'angle', unit: '°', tex: '\\delta_{\\min}' },
        n: { name: 'refractive index of the prism', value: 1.31, min: 1.01, max: 2.5, tex: 'n' },
        A: { name: 'apex angle of the prism', q: 'angle', unit: '°', value: 60, min: 5, max: 120, tex: 'A' }
      },
      solveFor: 'd',
      note: 'The ray passes symmetrically through the prism. Ice (n ≈ 1.31): 60° gives the 22° halo, 90° the 46° halo.',
      stories: { d: 'Light crosses an ice crystal whose two faces make {A}, and the ice has index {n}. What is the smallest angle by which the crystal can turn it?' }
    },
    {
      name: 'First dark ring of a corona',
      expr: 'sin(th) = 1.22*lam/dd', tex: '\\sin\\theta = 1.22\\,\\frac{\\lambda}{d}',
      vars: {
        th: { name: 'angle of the first dark ring', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        dd: { name: 'droplet diameter', q: 'length', unit: 'µm', value: 20, tex: 'd' }
      },
      solveFor: 'th',
      note: 'The corona of a thin water cloud. A smaller droplet makes a larger ring.',
      stories: { th: 'A thin cloud of droplets {dd} across is lit by light of {lam}. At what angle from the Sun does the first dark ring of that colour fall?' }
    }
  ],
  examples: [
    {
      title: 'The size of a halo',
      q: 'Ice has an index of about 1.31. How far from the Sun is the inner edge of the halo made by crystals with an apex angle of 60°, and by crystals with 90°?',
      steps: [
        { text: 'For 60°:', tex: '\\delta_{\\min} = 2\\arcsin(1.31\\sin 30°) - 60° = 2\\arcsin(0.655) - 60° = 81.8° - 60° = 21.8°' },
        { text: 'For 90°:', tex: '\\delta_{\\min} = 2\\arcsin(1.31\\sin 45°) - 90° = 2\\arcsin(0.926) - 90° = 135.7° - 90° = 45.7°' }
      ],
      a: '21.8° (the 22° halo) and 45.7° (the 46° halo).'
    },
    {
      title: 'Reading a corona',
      q: 'The first red ring (650 nm) of a corona is seen 2.3° from the Moon. How large are the droplets?',
      steps: [
        { text: 'Solve $\\sin\\theta = 1.22\\lambda/d$ for the diameter:', tex: 'd = \\frac{1.22\\times 650\\ \\mathrm{nm}}{\\sin 2.3°} = \\frac{793\\ \\mathrm{nm}}{0.0401} = 19.8\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 20 µm across, typical of cloud droplets.'
    }
  ],
  quiz: [
    { q: 'Which colour is on the inside edge of a 22° halo?', choices: ['Red', 'Blue', 'Green', 'None: it is always white'], a: 0, why: 'Ice has a slightly lower index for red, so red is turned least and lands at the smallest angle, the inner edge. Corona and rainbow have red outside.' },
    { q: 'Why does a 22° halo have a sharp inner edge but a soft outer one?', choices: ['No ice prism turns light by less than the minimum deviation; more is possible', 'The Sun is brighter at its centre', 'The air absorbs more at large angles', 'The ice crystals are all the same size'], a: 0, why: 'The deviation can be equal to or larger than the minimum for a 60° prism, never smaller. Light therefore stops abruptly at the inside and fades gradually outside.' },
    { q: 'A corona around the Moon grows smaller from hour to hour. What is happening to the droplets?', choices: ['They are getting larger', 'They are getting smaller', 'They are freezing into hexagons', 'Nothing: the corona shrinks as the Moon rises'], a: 0, why: 'The angle of the ring is proportional to λ/d: when d grows, the ring shrinks.' },
    { q: 'Ice with n = 1.31: a ray crosses a prism with a 90° apex angle at minimum deviation. What is the deviation in degrees?', answer: 45.7, unit: '°', why: '2 arcsin(1.31 × sin 45°) − 90° = 45.7°: the 46° halo.' },
    { q: 'The Sun is at 70° elevation. Can you see sun dogs?', choices: ['No: above about 61° no ray crosses the plate crystals', 'Yes, but 70° from the Sun', 'Yes, at 22°', 'Only at night'], a: 0, why: 'With the Sun that high the effective index of the slanted ray, √(n² − sin²e)/cos e, makes n sin 30° exceed 1 and the light is totally reflected inside the plate.' }
  ],
  applications: [
    'Weather watching: a halo means a thin veil of cirrostratus, which often comes ahead of a warm front; folklore reads it as a sign of rain within a day or two.',
    'Cloud physics: the size of a corona measures the droplet size of a cloud without any instrument, and lidar and radar systems use the same scattering physics.',
    'Aircraft and mountains: glories give a quick estimate of droplet size in the cloud below the observer.',
    'Prism design: the same minimum-deviation formula gives the refractive index of any transparent solid or liquid from the angle it turns a beam.'
  ],
  history: 'Halos have been recorded since antiquity; that they come from ice crystals was recognised in the seventeenth century, and the shapes and orientations that make the arcs were worked out in the nineteenth and twentieth. The glory was described by Pierre Bouguer during the French expedition to the Andes in the 1730s, and the full wave theory of why it forms came only in the second half of the twentieth century.',
  sources: [
    'R. Greenler, *Rainbows, Halos, and Glories* (Cambridge University Press, 1980) — the standard illustrated account of all three.',
    'D. K. Lynch and W. Livingston, *Color and Light in Nature*, 2nd ed. — halos, coronas and glories with photographs.',
    'E. Hecht, *Optics*, ch. 5 (prisms and minimum deviation) and ch. 10 (diffraction by a circular aperture).'
  ],
  sim: 'ph-halo'
},

/* ================================================================ the blue sky */
{
  id: 'why-the-sky-is-blue', parent: 'optical-phenomena', title: 'Why the sky is blue and the sunset red', level: 1,
  short: 'Air molecules scatter short wavelengths far more than long ones, as the inverse fourth power of the wavelength. Scattered sunlight is therefore blue, the sunlight that is left over at sunset is red, and clouds, whose droplets scatter all colours alike, are white.',
  keywords: ['blue sky', 'Rayleigh scattering', 'sunset', 'red sunset', 'scattering', 'air mass', 'optical depth', 'clouds', 'white', 'violet', 'twilight', 'polarization of the sky', 'Mie scattering', 'skylight'],
  prereq: ['wavelength-frequency-and-colour', 'dispersion-and-the-spectrum', 'what-is-light'],
  related: ['polarization-by-reflection-and-scattering', 'daylight-and-skylight', 'the-green-flash-and-twinkling', 'where-colours-come-from', 'physics:color-vision'],
  body: `
Sunlight is nearly white, and the sky is blue. So something in the air takes blue light out of the beam and sends it in all directions, and it has to be selective: it must act on blue far more than on red.

### Small particles scatter the short waves
Air molecules are tiny compared with the wavelength of light, 0.3 nm against 500 nm. Light shakes the electric charges in a molecule, and the molecule re-radiates in all directions. For a particle much smaller than the wavelength, this **Rayleigh scattering** goes as

$$I_{\\mathrm{scat}} \\propto \\frac{1}{\\lambda^{4}}$$

so blue light (450 nm) is scattered $(650/450)^4 = 4.4$ times as strongly as red (650 nm). Every direction you look in, you see sunlight that was scattered towards you, and it is weighted towards the blue.

### Why not violet?
Violet (400 nm) scatters even more: 9.4 times as much as 700 nm red. But the Sun gives less violet than blue, some of it is absorbed high in the atmosphere, and the eye is far less sensitive to it. The mixture the eye sums up is the pale blue of the sky.

### The sunset
Look at the Sun itself and you see what is *left* after the scattering. Scattering removes light with an exponential law, $T = e^{-\\tau m}$, where $\\tau$ is the optical depth of the air straight up and $m$ is the **air mass**, the path relative to the zenith. For the whole atmosphere, vertically, $\\tau$ is about 0.22 at 450 nm, 0.097 at 550 nm and 0.049 at 650 nm. With the Sun overhead ($m = 1$) blue keeps 80 % of its light. At the horizon the beam crosses 38 times as much air:

| Sun's elevation | Air mass $m$ | Blue (450 nm) kept | Red (650 nm) kept |
|---|---|---|---|
| 90° | 1.0 | 80 % | 95 % |
| 10° | 5.6 | 29 % | 76 % |
| 2° | 19 | 1.4 % | 38 % |
| 0° | 38 | 0.02 % | 15 % |

The Sun is white at noon, yellow-white in the morning, orange and then red as it goes down. The scattered light, taken out of the beam, makes the blue sky of other people farther west.

### Clouds are white
A cloud droplet, 10–20 µm across, is much *larger* than the wavelength. Large particles scatter all colours nearly equally, so a cloud sends back white. Haze and smog, with particles near the wavelength, sit between: they scatter as roughly $\\lambda^{-1.3}$ and make a milky, pale-blue sky.

### The sky is polarized
Light scattered at 90° from the Sun is strongly **polarized**, because the shaken charge cannot radiate along its own line of vibration. In clear air the degree reaches about 70–80 % (an ideal gas would give 100 %). A polarizing filter darkens the sky at 90° from the Sun; bees and many insects use the pattern as a compass ([[polarization-by-reflection-and-scattering]]).

> [!fact] An astronaut on the Moon, with no air, sees a black sky even at midday, and the Sun is white.

> [!key] Air scatters light as 1/λ⁴, so skylight is blue and the Sun, seen through a long path, is red; droplets are large and scatter all colours alike, so clouds are white.
`,
  ideas: [
    'Rayleigh scattering by molecules goes as 1/λ⁴: blue is scattered about 4.4 times as strongly as red.',
    'The sky is the scattered blue; the red sunset is the beam that remains after the blue has been scattered out.',
    'The vertical optical depth of the air is about 0.22 at 450 nm and 0.05 at 650 nm; the horizon path is about 38 times longer.',
    'Droplets much larger than the wavelength scatter all colours equally, so clouds are white.',
    'Light scattered at 90° from the Sun is strongly polarized.'
  ],
  pitfalls: [
    'The sky is blue because it reflects the sea — The sea is blue partly because it reflects the sky. The sky colour comes from scattering by air molecules, which happens just as well over a desert.',
    'The sky should be violet, so physics fails — Violet is scattered more, but the Sun emits less of it, the upper air absorbs some, and the eye barely sees it. Blue wins in the sum.',
    'Red sunsets are caused by pollution or dust — Clean air makes a red sunset by itself; dust and smoke deepen the colours and can darken them.',
    'Clouds are white because water is white — Water is clear. A cloud scatters every wavelength from droplets larger than the wavelength, so the mixture stays white; a thick cloud absorbs enough to look grey underneath.'
  ],
  terms: [
    { term: 'Rayleigh scattering', def: 'Scattering of light by particles much smaller than its wavelength, with strength proportional to 1/λ⁴. It colours the clear sky.' },
    { term: 'Mie scattering', def: 'Scattering by particles comparable to or larger than the wavelength, such as cloud droplets and haze. It depends only weakly on wavelength for large particles.' },
    { term: 'Air mass', def: 'The length of the path of sunlight through the atmosphere, relative to the vertical path. It is 1 with the Sun overhead and about 38 at the horizon.' },
    { term: 'Optical depth', also: ['optical thickness', 'τ'], def: 'The natural logarithm of the ratio of incident to transmitted light along a path. A beam is weakened by the factor e^(−τ).' },
    { term: 'Skylight', def: 'Sunlight scattered by the atmosphere; it is blue and partly polarized, and it lights the shadows during the day.' }
  ],
  formulas: [
    {
      name: 'Rayleigh scattering of two colours',
      expr: 'r = (lam2/lam1)^4', tex: 'r = \\left(\\frac{\\lambda_2}{\\lambda_1}\\right)^{4}',
      vars: {
        r: { name: 'scattering of λ₁ relative to λ₂' },
        lam1: { name: 'shorter wavelength', q: 'length', unit: 'nm', value: 450, tex: '\\lambda_1' },
        lam2: { name: 'longer wavelength', q: 'length', unit: 'nm', value: 650, tex: '\\lambda_2' }
      },
      solveFor: 'r',
      note: 'For particles much smaller than the wavelength: molecules of air.',
      stories: { r: 'Light of {lam1} meets air molecules. How many times more strongly is it scattered than light of {lam2}?' }
    },
    {
      name: 'Sunlight left after the path',
      expr: 'T = exp(-tau*m)', tex: 'T = e^{-\\tau m}',
      vars: {
        T: { name: 'fraction of the beam that remains', min: 0, max: 1 },
        tau: { name: 'vertical optical depth of the air', value: 0.22, tex: '\\tau' },
        m: { name: 'air mass', value: 5.6, min: 1, max: 40, tex: 'm' }
      },
      solveFor: 'T',
      note: 'Beer–Lambert for the Rayleigh scattering alone, per colour (τ ≈ 0.22 at 450 nm, 0.049 at 650 nm).',
      stories: { T: 'The air has a vertical optical depth of {tau} at this colour, and the Sun\'s light crosses an air mass of {m}. What fraction of the light is left?' }
    },
    {
      name: 'Air mass of the Sun',
      expr: 'm = 1/(sin(h) + 0.50572*(h*180/pi + 6.07995)^(-1.6364))', tex: 'm = \\frac{1}{\\sin h + 0.50572\\,(h + 6.07995°)^{-1.6364}}',
      vars: {
        m: { name: 'air mass', tex: 'm' },
        h: { name: 'elevation of the Sun above the horizon', q: 'angle', unit: '°', value: 10, min: 0, max: 90, tex: 'h' }
      },
      solveFor: 'm',
      note: 'The Kasten–Young fit: 1.0 overhead, 5.6 at 10°, 38 at the horizon.',
      practice: { unknowns: ['m'] }
    }
  ],
  examples: [
    {
      title: 'A red low Sun',
      q: 'The Sun is 10° above the horizon (air mass 5.6). By what factor is the red (650 nm) beam weakened, and the blue (450 nm)? The vertical optical depths are 0.049 and 0.22.',
      steps: [
        { text: 'Red:', tex: 'T_{650} = e^{-0.049\\times 5.6} = e^{-0.274} = 0.76' },
        { text: 'Blue:', tex: 'T_{450} = e^{-0.22\\times 5.6} = e^{-1.23} = 0.29' },
        'The ratio blue : red is 0.29 : 0.76, so the Sun has already lost most of its blue.'
      ],
      a: 'Red keeps 76 % of its light, blue only 29 %: the Sun looks yellow-orange.'
    }
  ],
  quiz: [
    { q: 'Blue light (450 nm) is scattered by air molecules how many times more strongly than red light (650 nm)?', answer: 4.35, why: '$(650/450)^4 = 4.35$ — the 1/λ⁴ law of Rayleigh scattering.' },
    { q: 'The Sun looks red at sunset mainly because…', choices: ['the light crosses more air and the blue is scattered out of the beam', 'the Sun gets cooler as it sets', 'red light is reflected by the Earth', 'the Sun emits more red in the evening'], a: 0, why: 'The beam crosses about 38 times as much air at the horizon as overhead, and blue is removed far more than red. The Sun itself does not change.' },
    { q: 'Clouds look white because their droplets scatter all wavelengths about equally.', a: true, why: 'Droplets of 10–20 µm are far larger than the wavelength, so the 1/λ⁴ law no longer applies and the mixture stays white.' },
    { q: 'An astronaut on the Moon looks at the sky at midday. What does the sky look like?', choices: ['Black', 'Deep blue', 'White', 'Red'], a: 0, why: 'There is no air to scatter the light, so no light comes from directions away from the Sun.' },
    { q: 'Where in a clear sky is the light most strongly polarized?', choices: ['At 90° from the Sun', 'Close to the Sun', 'Directly opposite the Sun', 'At the horizon in all directions'], a: 0, why: 'The scattered light at 90° comes from charges shaken across the line of sight, so only one polarization direction is radiated.' }
  ],
  applications: [
    'Photography: a polarizing filter turned for the darkest sky at 90° from the Sun gives deep blue skies; a red filter in black-and-white work does the same by removing the blue.',
    'Solar energy and meteorology: optical-depth measurements by sun photometers separate air molecules from haze and measure pollution.',
    'Navigation by animals and aircraft: bees, ants and polarized sky compasses use the polarization pattern, which stays usable under thin cloud and after sunset.',
    'Displays and design: the "blue haze" of distant mountains is Rayleigh scattering of the air between you and them, and artists use it as a distance cue.'
  ],
  history: 'In 1869 John Tyndall showed that very fine particles in a tube scatter blue and leave the transmitted beam reddish. Lord Rayleigh (John William Strutt) gave the 1/λ⁴ law in 1871 and, in 1899, showed that the scattering is by the air molecules themselves. Einstein in 1910 worked out the fluctuations in density that cause the scattering in a gas.',
  sources: [
    'C. F. Bohren and E. E. Clothiaux, *Fundamentals of Atmospheric Radiation* (Wiley-VCH, 2006) — Rayleigh scattering and the colours of the sky.',
    'A. T. Young, "On the Rayleigh-scattering optical depth of the atmosphere", *Journal of Applied Meteorology* 20 (1981).',
    'F. Kasten and A. T. Young, "Revised optical air mass tables and approximation formula", *Applied Optics* 28 (1989).'
  ],
  sim: 'ph-sky'
},

/* ================================================================ green flash and twinkling */
{
  id: 'the-green-flash-and-twinkling', parent: 'optical-phenomena', title: 'The green flash and twinkling stars', level: 2,
  short: 'Air bends light, more for blue than for red, and the air is never still. At the horizon the setting Sun is a stack of coloured images, and its last sliver can flash green; at night, turbulent air makes point-like stars flicker and change colour, while planets, which are not points, shine steadily.',
  keywords: ['green flash', 'twinkling', 'scintillation', 'seeing', 'atmospheric refraction', 'atmospheric dispersion', 'turbulence', 'star colours', 'planets do not twinkle', 'Fresnel scale', 'sunset', 'astronomical seeing', 'shadow bands'],
  prereq: ['dispersion-and-the-spectrum', 'atmospheric-refraction', 'why-the-sky-is-blue'],
  related: ['mirages-and-looming', 'astronomical-observatories-and-adaptive-optics', 'refractive-index', 'what-diffraction-is'],
  body: `
Two sights share one cause. At sunset a clear horizon sometimes ends the Sun with a flash of green; at night, stars flicker and flash red, green and blue while the planets stay calm. In both, the air is doing what a poor prism and a restless lens would do.

### Refraction at the horizon
Air is densest at the ground, so light from a star bends down as it comes in, and everything appears higher than it is. For an altitude $h$ above about 15° the bending is $R \\approx (n-1)\\cot h$ with $n - 1 = 2.77\\times10^{-4}$: 1′ at 45°, about 10′ at 5°, and at the horizon about 34′, a little more than the Sun's own 32′. When the lower edge of the Sun appears to touch the horizon, the Sun has in fact already set.

### Air is a prism
The index of air is higher for blue (n − 1 = 2.803 × 10⁻⁴ at 450 nm) than for red (2.761 × 10⁻⁴ at 650 nm), 1.5 % more. Near the horizon, where the bending is 34′, that makes blue light arrive about half an arc-minute (30″) higher than red. The Sun, 32′ = 1920″ across, is therefore a stack of coloured discs offset by 1.6 % of their diameter: a blue-green rim on top, a red rim below. It is small, but a telephoto camera shows the fringes.

### The flash
Blue and violet are scattered out of a beam that crosses 38 times the vertical air mass (see [[why-the-sky-is-blue]]), so the top rim is green. As the Sun sets, the red image goes first, then the yellow body, and the last sliver is the green rim: a flash that lasts a second or two. It needs a clear, sharp horizon (usually the sea) and clean air; a superior mirage ([[mirages-and-looming]]) that stretches the Sun vertically magnifies the rim and can hold it much longer.

> [!warn] Look at the Sun only when it is nearly gone, and never through binoculars, a viewfinder or a telescope without a certified solar filter: a gap in the haze can hurt the eye before you can look away.

### Why stars twinkle
Cells of air a few centimetres to metres across, a few kelvin apart, drift in the wind at heights of 5–15 km. Each is a weak, moving lens; some kilometres farther on, the corrugated wavefront has become a pattern of bright and dark patches on the ground, roughly $\\sqrt{\\lambda h}$ across: 7 cm for light of 550 nm and a layer at 10 km. The wind carries the pattern across your 7 mm pupil, and the star's brightness flickers (**scintillation**); the star also jitters in position, and near the horizon, where dispersion separates the colours, flashes in several colours. Image blur in a telescope from the same turbulence is called **seeing**: typically 1–2″, about 0.5″ at the best sites.

### Why planets do not
A star is a point (even Betelgeuse is about 0.05″). A planet is a disc, and every point of it throws its own pattern, shifted by the angle between the points times the height of the layer. At 10 km, shifts of $7\\ \\mathrm{cm}/10\\ \\mathrm{km}$ = 1.5″ already exceed the patch size, so the patterns average out.

| Source | Angular size | Twinkles? |
|---|---|---|
| Star | below 0.05″ | strongly |
| Mars | 3.5–25″ | rarely |
| Jupiter | 30–50″ | hardly at all |
| Venus | 10–66″ | hardly at all |

A telescope averages over its aperture: a star in a 300 mm telescope barely twinkles, though seeing still blurs it.

> [!key] Air refracts blue more than red, so the Sun at the horizon is a stack of coloured discs and its last sliver can be green. Moving turbulent cells make point sources flicker; a source wider than about 1.5″ averages the flicker away, which is why planets are steady.
`,
  ideas: [
    'Atmospheric refraction lifts everything: 34′ at the horizon, 1′ at 45° altitude.',
    'Blue is refracted about 1.5 % more than red, which is about 30″ at the horizon: a thin coloured rim on the Sun.',
    'The green flash is the last sliver of the green image, after the red has set and the blue has been scattered out.',
    'Twinkling is a moving pattern of bright patches about 7 cm across, produced by turbulence at 5–15 km.',
    'Sources wider than about 1.5″ (planets) and large apertures average the twinkling away.'
  ],
  pitfalls: [
    'Twinkling is the stars themselves flickering — Stars shine steadily; the flicker is made in the last few tens of kilometres of air, and is absent for an astronaut.',
    'Planets are too bright to twinkle — Brightness does not matter. A planet is a small disc, so many independent patterns add to a steady light; a faint star twinkles more.',
    'The green flash is an optical illusion or an afterimage — It is real and can be photographed. (An afterimage of the red Sun looks blue-green, but the flash is seen before the Sun has gone.)',
    'The flash comes from the green wavelength being refracted most — Blue and violet are refracted most; they are the colours scattered out, so green is what remains on top.'
  ],
  terms: [
    { term: 'Atmospheric refraction', def: 'The bending of light from space by the layered atmosphere. It raises the apparent altitude of everything and is about 34′ at the horizon.' },
    { term: 'Atmospheric dispersion', def: 'The slightly different refraction of different colours by air: blue is bent about 1.5 % more than red, which spreads the Sun at the horizon into a vertical spectrum.' },
    { term: 'Green flash', def: 'A brief green glimpse of the top rim of the Sun (or Moon) as it sets or rises, caused by refraction and scattering in the atmosphere.' },
    { term: 'Scintillation', also: ['twinkling'], def: 'Rapid fluctuation of the brightness of a point source seen through turbulent air, caused by a moving pattern of bright and dark patches.' },
    { term: 'Seeing', def: 'The blurring and shaking of a telescopic image by atmospheric turbulence, measured by the angular size of a star\'s image: about 1–2″ at ordinary sites.' }
  ],
  formulas: [
    {
      name: 'Refraction of the atmosphere',
      expr: 'R = dl/tan(h)', tex: 'R \\approx \\frac{\\delta}{\\tan h}',
      vars: {
        R: { name: 'refraction (angle by which the star is lifted)', q: 'angle', unit: '′', tex: 'R' },
        dl: { name: 'excess of the refractive index of air over 1 (n − 1)', value: 2.77e-4, tex: '\\delta' },
        h: { name: 'apparent altitude', q: 'angle', unit: '°', value: 30, min: 10, max: 90, tex: 'h' }
      },
      solveFor: 'R',
      note: 'Good to a few per cent above about 15° altitude; near the horizon the curving of the layers matters (34′ there).',
      stories: { R: 'A star is {h} above the horizon. By how much does atmospheric refraction lift it?' }
    },
    {
      name: 'Smallest source that steadies the twinkling',
      expr: 'th = sqrt(lam/hh)', tex: '\\theta \\approx \\sqrt{\\frac{\\lambda}{h}}',
      vars: {
        th: { name: 'angular size above which the flicker averages out', q: 'angle', unit: '″', tex: '\\theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        hh: { name: 'height of the turbulent layer', q: 'length', unit: 'km', value: 10, tex: 'h' }
      },
      solveFor: 'th',
      note: 'The Fresnel scale √(λh) divided by the height h. Layers at 5–15 km give about 1–2″.',
      stories: { th: 'Light of {lam} crosses a turbulent layer {hh} up. What is the angular size of a source that just begins to smear the twinkling out?' }
    }
  ],
  examples: [
    {
      title: 'How far apart are the Sun\'s colours?',
      q: 'At the horizon atmospheric refraction is about 34′. Blue light at 450 nm has n − 1 = 2.803 × 10⁻⁴ and red at 650 nm has 2.761 × 10⁻⁴. By how much do the two images differ in height, compared with the Sun\'s diameter of 32′?',
      steps: [
        { text: 'Refraction is proportional to $n - 1$, so the relative difference is', tex: '\\frac{2.803-2.761}{2.77} = 0.015' },
        '1.5 % of 34′ = 0.51′ = 31″.',
        'Against 32′ = 1920″, the offset is 1.6 % of the Sun\'s diameter.'
      ],
      a: 'About 30″: the blue image stands 1.6 % of a Sun diameter above the red one.'
    },
    {
      title: 'The size of the flickering patches',
      q: 'The turbulence that makes a star twinkle lies about 10 km up. For light of 550 nm, how big are the bright patches on the ground?',
      steps: [
        { text: 'The Fresnel scale:', tex: '\\sqrt{\\lambda h} = \\sqrt{550\\times10^{-9}\\ \\mathrm{m}\\times10^{4}\\ \\mathrm{m}} = 0.074\\ \\mathrm{m}' },
        'Seen from the ground, that is 1.5″ at 10 km.'
      ],
      a: 'About 7 cm, much larger than the 7 mm pupil, so the eye sees the brightness go up and down as the pattern drifts past.'
    }
  ],
  quiz: [
    { q: 'Why does the top rim of the setting Sun look green and not blue?', choices: ['Blue is refracted most but is scattered out of the long path through the air', 'Green is refracted most', 'The ocean reflects green light', 'The eye is most sensitive to green'], a: 0, why: 'Blue and violet are bent most, so they lie on top, but over 38 air masses they are mostly scattered away; green is the highest colour that survives.' },
    { q: 'A star is 45° above the horizon. About how large is atmospheric refraction there?', choices: ['1′', '10′', '34′', '1°'], a: 0, why: '$R \\approx (n-1)\\cot 45° = 2.77\\times10^{-4}$ rad, about 1 arc-minute.' },
    { q: 'Jupiter shines steadily while a fainter star twinkles. Which is the reason?', choices: ['Jupiter is a disc about 40″ across, so its flicker patterns average out', 'Jupiter is brighter', 'Jupiter is nearer, so its light passes through less air', 'Jupiter\'s light is polarized'], a: 0, why: 'Different points of the disc make patterns shifted by more than the patch size (about 1.5″ at 10 km); they add to a steady total.' },
    { q: 'A telescope with a 300 mm aperture shows a star with much less twinkling than the eye does. Why?', choices: ['It averages the brightness over many 7 cm patches at once', 'The glass filters the turbulence', 'It sees farther', 'It is above the atmosphere'], a: 0, why: 'Aperture averaging: when the aperture is larger than the patch size, light and dark patches are summed and the flicker falls.' },
    { q: 'Refraction at the horizon is about 34′ and the Sun is 32′ wide. When the Sun looks as if it is just touching the horizon, where is it in fact?', choices: ['Already below the horizon', 'Exactly on it', 'Just above it', 'It depends on the colour'], a: 0, why: 'Refraction lifts the image by slightly more than the Sun\'s own diameter, so the geometric Sun is below the horizon by about half a degree at that moment.' }
  ],
  applications: [
    'Astronomical site testing: seeing is measured in arc-seconds, and the best telescopes are placed where it is under one.',
    'Adaptive optics: deformable mirrors correct the wavefront many hundred times a second, using a guide star, to undo the turbulence ([[astronomical-observatories-and-adaptive-optics]]).',
    'Navigation and surveying: refraction corrections are built into almanacs and sextant tables, and horizon altitude readings are adjusted by them.',
    'Photography of the Sun and Moon at the horizon: dispersion fringes appear in the images, and some cameras correct them in software.'
  ],
  history: 'Jules Verne\'s novel *Le Rayon vert* (1882) made the green flash famous, though many readers doubted that it was real. It was photographed in the 1950s by the Jesuit astronomer Daniel O\'Connell, whose book on low-Sun phenomena is a classic, and since by countless amateurs. That stars twinkle because the air is in constant motion was clear to Newton, who in his *Opticks* suggested observing from the tops of the highest mountains, above the worst of the turbulence.',
  sources: [
    'D. K. Lynch and W. Livingston, *Color and Light in Nature*, 2nd ed. — the sections on atmospheric refraction, the green flash and scintillation.',
    'F. Roddier, "The effects of atmospheric turbulence in optical astronomy", *Progress in Optics* 19 (1981).',
    'J. Meeus, *Astronomical Algorithms*, 2nd ed., chapter on atmospheric refraction — the formulae for the refraction of the Sun and stars.'
  ],
  sim: 'ph-flash'
},

/* ================================================================ Pepper's ghost */
{
  id: 'peppers-ghost-and-stage-illusions', parent: 'optical-phenomena', title: 'Pepper\'s ghost and stage illusions', level: 1,
  short: 'A sheet of clear glass at 45° is both a window and a weak mirror. Light a hidden room brightly and keep the stage dim, and the audience sees a translucent ghost on the stage. The same trick is in teleprompters, head-up displays and the stage "holograms" that are not holograms.',
  keywords: ['Pepper\'s ghost', 'ghost', 'stage illusion', 'teleprompter', 'head-up display', 'hologram concert', 'beam splitter', 'partial reflection', 'combiner', 'virtual image', 'foil', 'plane mirror', 'beam-splitter glass'],
  prereq: ['plane-mirror-images', 'fresnel-reflection', 'law-of-reflection'],
  related: ['one-way-mirrors-and-invisibility-tricks', 'holograms-and-what-they-show', 'beam-splitters', 'virtual-and-augmented-reality-headsets'],
  body: `
Glass is nearly invisible when you look through it, yet at a slant it shows a faint reflection. At 45° an ordinary pane reflects about 5 % of the light from each surface. That small reflection is the whole of **Pepper's ghost**.

### The set-up
A large pane of glass is placed at 45° across the front of a stage, out of sight of the audience, with its edges hidden behind the proscenium. Below the stage floor, or off to one side, is a second room, brightly lit, in which an actor moves. The pane reflects that room towards the audience. A mirror shows an object as far behind the surface as the object is in front, so the audience sees a **virtual image** of the actor standing on the stage, at the spot that is the mirror image of the hidden room's floor. The stage is dim and the actor in the hidden room is lit hard: what reaches the audience is

$$L_{\\text{ghost}} = R\\,L_{\\text{room}} \\qquad L_{\\text{stage}} = T\\,L_{\\text{stage, real}}$$

The two add, which is why a ghost is **translucent**: the real scenery shows through it.

### The light budget
For glass of index 1.52 the reflectance of one surface at 45° is 5.3 % for unpolarized light (9.7 % for the s component, 0.9 % for p, see [[fresnel-reflection]]). Two surfaces, with the light bouncing between them, give 10.1 %, and 89.9 % is transmitted. A hidden room at 1000 cd/m² therefore shows a ghost of 101 cd/m², and the stage behind should stay at a few tens at most for the ghost to stand out. The set must also hide the pane: no audience lights reflected, a clean flat sheet, and no sign of its edges.

### The same pane, other jobs
| Job | What is reflected | Typical split |
|---|---|---|
| Stage ghost | a hidden, brightly lit room | plain glass or foil, about 10 % |
| Modern "hologram" show | a bright LED screen or projection on the floor, in a thin plastic foil stretched flat | foil, about 10 % |
| Teleprompter | a monitor, seen by the presenter; the camera looks through | beam-splitter glass of about 30 % reflection, 70 % transmission |
| Head-up display | a display, in the windscreen or a small combiner | a modest fraction, so the road stays visible |

The teleprompter's camera loses $\\log_2(1/0.7) = 0.5$ of a stop. In a head-up display the image is made to appear far ahead of the car, so the eyes need not refocus.

### Not a hologram
The "holograms" of concerts, from the 2010s on, are Pepper's ghosts: a bright image reflected in a tilted foil. A true hologram ([[holograms-and-what-they-show]]) is a recorded wavefront and needs a recording medium, which is not what is on a stage. The giveaway is the reflecting sheet at the front, and a ghost that is flat and viewable only from the front.

> [!key] A glass sheet at 45° passes about 90 % of the stage and reflects about 10 % of a bright hidden room, whose virtual image appears on the stage. The ghost is translucent because the two images add.
`,
  ideas: [
    'A pane at 45° is a window and a weak mirror at once: about 5 % reflected per surface.',
    'The reflected image is virtual, as far behind the glass as the hidden room is in front of it.',
    'Ghost brightness is the reflectance times the hidden room\'s luminance, so the hidden room must be very bright and the stage dim.',
    'The ghost is translucent because the reflected and transmitted images add.',
    'Teleprompters and head-up displays use the same pane with a different split.'
  ],
  pitfalls: [
    'A Pepper\'s ghost is a hologram — It is a reflection of a lit room or screen in a tilted sheet of glass or foil; there is no recorded wavefront, and the image is a flat picture seen from the front.',
    'The glass has to be silvered to reflect the ghost — Plain glass reflects enough (about 10 % from two surfaces) when the hidden image is bright and the stage dark.',
    'The ghost is in the hidden room — The audience sees a virtual image at the mirror image of the hidden room, on the stage; the real actor is elsewhere.',
    'A brighter stage makes a better show — Stage light passes through the ghost and washes it out; the stage should be dim where the ghost is.'
  ],
  terms: [
    { term: 'Pepper\'s ghost', def: 'A stage illusion in which a sheet of glass or foil at 45° reflects a brightly lit hidden room, so that its virtual image seems to stand on the stage.' },
    { term: 'Virtual image', def: 'An image formed where light only seems to come from, as in a plane mirror. It cannot be caught on a screen.' },
    { term: 'Beam-splitter glass', def: 'A plate coated to reflect part of the light and transmit the rest, in a chosen ratio such as 30/70, used in teleprompters and combiners.' },
    { term: 'Teleprompter', def: 'A device in which a monitor is reflected in a beam-splitter glass in front of a camera lens, so that the speaker reads text while looking at the camera.' },
    { term: 'Combiner', def: 'The partly reflecting window of a head-up display that adds the display\'s virtual image to the view of the outside.' }
  ],
  formulas: [
    {
      name: 'Reflectance of a clear pane, two surfaces',
      expr: 'R2 = 2*R1/(1+R1)', tex: 'R_2 = \\frac{2R_1}{1+R_1}',
      vars: {
        R2: { name: 'reflectance of the whole pane', q: 'ratio', unit: '%', tex: 'R_2' },
        R1: { name: 'reflectance of one surface', q: 'ratio', unit: '%', value: 5.3, tex: 'R_1' }
      },
      solveFor: 'R2',
      note: 'Including the light that bounces between the two surfaces; no absorption, no coherence effects.',
      stories: { R2: 'One surface of a pane reflects {R1} at 45°. What does the pane reflect in all?' }
    },
    {
      name: 'Ghost against stage',
      expr: 'C = R*Lh/((1-R)*Ls)', tex: 'C = \\frac{R\\,L_h}{(1-R)\\,L_s}',
      vars: {
        C: { name: 'ghost brightness ÷ stage brightness behind it' },
        R: { name: 'reflectance of the pane', q: 'ratio', unit: '%', value: 10, tex: 'R' },
        Lh: { name: 'luminance of the hidden room', q: 'luminance', unit: 'cd/m²', value: 1000, tex: 'L_h' },
        Ls: { name: 'luminance of the stage', q: 'luminance', unit: 'cd/m²', value: 20, tex: 'L_s' }
      },
      solveFor: 'C',
      note: 'With a lossless pane, the transmission is 1 − R. A ghost shows clearly above C of about 3 to 5.',
      stories: { C: 'A pane reflects {R}. The hidden room is lit to {Lh} and the stage to {Ls}. How many times brighter than the stage is the ghost?' }
    },
    {
      name: 'Light lost by a teleprompter',
      expr: 'S = -log2(T)', tex: 'S = -\\log_2 T',
      vars: {
        S: { name: 'light lost, in stops', q: 'count', tex: 'S' },
        T: { name: 'transmission of the glass', q: 'ratio', unit: '%', value: 70, tex: 'T' }
      },
      solveFor: 'S',
      note: 'One stop is a factor of 2 in light: 70 % is half a stop.',
      practice: { unknowns: ['S'] }
    }
  ],
  examples: [
    {
      title: 'The brightness of a ghost',
      q: 'A hidden room is lit to 1000 cd/m². The pane reflects 10.1 % at 45°. What is the ghost\'s luminance, and how dim must the stage be for the ghost to be 4 times brighter than the stage behind it?',
      steps: [
        'Ghost: $0.101 \\times 1000 = 101$ cd/m².',
        'Stage seen through the pane: $T L_s = 0.899\\,L_s$. For a ratio of 4: $L_s = 101/(4\\times0.899) = 28$ cd/m².'
      ],
      a: 'The ghost is 101 cd/m²; the stage must be at most about 28 cd/m², about the brightness of a dim stage.'
    }
  ],
  quiz: [
    { q: 'In a Pepper\'s ghost the audience sees…', choices: ['a virtual image of a hidden lit room, reflected in the glass', 'a real image projected on the glass', 'a hologram recorded on the glass', 'the actor through the glass'], a: 0, why: 'The glass acts as a mirror for the lit hidden room; the image is virtual, as far behind the glass as the room is in front.' },
    { q: 'A pane reflects 8 % of the light of a hidden room at 600 cd/m². What is the ghost\'s luminance, in cd/m²?', answer: 48, unit: 'cd/m²', why: '0.08 × 600 = 48 cd/m².' },
    { q: 'The ghost looks translucent because the real scenery behind it shows through. Which is the reason?', choices: ['Transmitted and reflected light add at the eye', 'The ghost is thin', 'The glass absorbs half of it', 'It is polarized'], a: 0, why: 'The eye receives the sum of the light reflected from the hidden room and that transmitted from the stage.' },
    { q: 'A teleprompter uses beam-splitter glass that transmits 70 % to the camera. How much light does the camera lose?', choices: ['About half a stop', 'One stop', 'Two stops', 'Nothing'], a: 0, why: '$\\log_2(1/0.7) = 0.51$ stops.' },
    { q: 'Why are stage "holograms" not holograms?', choices: ['They reflect a flat image in a tilted foil; nothing is recorded as a wavefront', 'They use no light', 'They use lasers', 'They are in colour'], a: 0, why: 'A hologram records and replays the wavefront of an object, with parallax; a Pepper\'s ghost shows a single flat picture.' }
  ],
  applications: [
    'Theatre and museums: ghosts, floating objects and talking portraits.',
    'Broadcast studios: teleprompters let presenters read while looking into the lens.',
    'Cars and aircraft: head-up displays put speed and navigation in the line of sight.',
    'Shop and exhibition displays: a product appears to float inside a case, with an image reflected from below.'
  ],
  history: 'The engineer Henry Dircks devised the arrangement in the late 1850s, but it needed a specially built theatre. John Henry Pepper, a lecturer at the Royal Polytechnic Institution in London, simplified it and showed it in 1862, and it has carried his name since. The head-up display came from military aircraft sights of the mid twentieth century, which also reflect a bright reticle in a glass plate.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 — reflection at a surface and the Fresnel equations that give the 5 % per surface.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — reflection from transparent plates, multiple reflections between the two surfaces.'
  ],
  sim: { id: 'ph-pane', params: { mode: 'pepper' } }
},

/* ================================================================ stereoscopic displays */
{
  id: 'stereoscopic-3d-displays', parent: 'optical-phenomena', title: 'Stereoscopic 3-D displays', level: 2,
  short: 'A stereoscopic display gives each eye its own picture, offset the way two eyes would see a real scene. Anaglyph, polarized and shutter glasses and the two screens of a headset differ in how they keep the images apart; all of them pull the eyes to one distance and focus them at another.',
  keywords: ['3D display', 'stereoscopic', 'stereo', 'anaglyph', 'polarized 3D', 'active shutter', 'parallax barrier', 'disparity', 'parallax', 'vergence accommodation conflict', 'interpupillary distance', 'headset', '3D cinema', 'crosstalk'],
  prereq: ['binocular-vision-and-stereopsis', 'accommodation', 'polarization-states'],
  related: ['autostereograms-and-lenticular-images', 'polarization-in-practice', 'virtual-and-augmented-reality-headsets', 'depth-and-perspective-illusions'],
  body: `
Our two eyes, about 63 mm apart, see a scene from slightly different places, and the brain turns the small differences, the **disparity**, into depth. A stereoscopic display fakes this: it shows each eye a flat picture, drawn as that eye would see the scene, and keeps the pictures apart.

### Where the two images go
Let the eyes be a distance $b$ apart and the screen a distance $D$ away. For a point meant to lie at a distance $Z$, the left- and right-eye images must be on the screen at a separation

$$p = b\\,\\frac{Z - D}{Z}$$

For $Z = D$ the images coincide ($p = 0$): the point is on the screen. For $Z > D$ (behind it) $p$ is positive and grows towards $b = 63$ mm for infinitely distant things; the eyes cannot be asked to diverge, so images behind the screen are never separated by more than 63 mm. For $Z < D$ the images cross over ($p < 0$) and the point seems to pop out. At $D = 2.5$ m, a point at $Z = 1.5$ m needs $p = -42$ mm.

### How the pictures are kept apart
| Method | How | Cost |
|---|---|---|
| Anaglyph | red filter on one eye, cyan on the other | colours compromised, ghosting; glasses cost pennies |
| Passive polarized | oppositely circularly polarized pictures, matching lenses; on a flat panel, alternate rows | half the vertical resolution on panels; silver screen in cinemas |
| Active shutter | liquid-crystal lenses open and close in step with the frames | at least 120 Hz display, 60 Hz per eye; dimmer; battery |
| Autostereoscopic | a barrier or lens sheet over the pixels sends columns to each eye ([[autostereograms-and-lenticular-images]]) | no glasses, but a narrow sweet spot and lower resolution |
| Headset | one small display and a lens for each eye | correct stereo and head tracking; weight; fixed focus |

### The conflict
In real life, the eyes turn to the object's distance (**vergence**) and the lenses focus there (**accommodation**). A screen puts all the light at distance $D$, so the eyes focus on the screen while converging on the virtual object. The mismatch in dioptres is $|1/Z - 1/D|$: 0.27 D in the example above, 0.03 D for a cinema screen at 15 m with an object at 10 m, and 1.5 D for a phone at 40 cm with a point at 25 cm. Studies find that discomfort and eye strain grow once the mismatch exceeds a few tenths of a dioptre, which is why a cinema is kinder than a phone or a headset with a focal distance fixed at 1–2 m. Stereographers also keep the disparity within about 1° of visual angle (the example's 1.0° is at the limit).

### What stereo does not give
The picture does not change when you move your head (no motion parallax, unless a headset tracks you), and the brain's other depth cues, occlusion and perspective, may disagree with the disparity: scenes seem to be cardboard cut-outs. A few per cent of people have little or no stereopsis ([[binocular-vision-and-stereopsis]]) and see such displays flat.

> [!key] A 3-D screen shows each eye its own image, separated on the screen by $p = b(Z-D)/Z$. Eyes then converge on the virtual point but focus on the screen, and the gap $|1/Z-1/D|$ in dioptres is what tires them.
`,
  ideas: [
    'Depth from disparity: each eye needs its own picture, offset on the screen by p = b(Z − D)/Z, with b the eye separation.',
    'Points at the screen have zero parallax; points behind it have positive parallax up to the eye separation, and points in front have negative (crossed) parallax.',
    'Anaglyph, polarized and shutter glasses differ in how they separate the pictures, and in colour, resolution and brightness.',
    'Vergence follows the virtual depth, accommodation stays at the screen: the conflict is 1/Z − 1/D in dioptres.',
    'Cinema screens are far away, so the conflict is small; phones and headsets are near, so it can be large.'
  ],
  pitfalls: [
    'The eyes focus on the 3-D object — The eyes converge on it but must focus on the screen to see sharply; that is the vergence–accommodation conflict.',
    'A wider separation on the screen always means more depth — Beyond the eye separation (about 63 mm) the eyes would have to diverge, which is uncomfortable; and a screen enlarged for a bigger room stretches every separation.',
    '3-D glasses polarize the light like sunglasses — Polarized 3-D glasses use circular polarizers of opposite hands, one for each eye, and are not the same as sunglasses; tilting the head hardly matters with circular polarizers.',
    'Everybody sees stereo 3-D — A few per cent of people have little or no stereopsis, and many more tire quickly.'
  ],
  terms: [
    { term: 'Disparity', also: ['binocular disparity', 'parallax'], def: 'The difference between the positions of an object in the images of the two eyes, which the brain turns into depth.' },
    { term: 'Screen parallax', def: 'The distance on the screen between the left- and right-eye images of one point. It is zero for points at the screen, positive behind it and negative in front of it.' },
    { term: 'Vergence', def: 'The turning of the two eyes towards each other so that both point at the same object. Its angle is 2·atan(b/2Z), with b the eye separation.' },
    { term: 'Accommodation', def: 'The change in the power of the eye\'s lens that brings objects at different distances into focus.' },
    { term: 'Anaglyph', def: 'A stereo picture made of two images in complementary colours, usually red and cyan, viewed through matching filter glasses.' },
    { term: 'Crosstalk', also: ['ghosting'], def: 'The leak of the image meant for one eye into the other eye, which looks like a faint double image.' }
  ],
  formulas: [
    {
      name: 'Screen parallax',
      expr: 'p = b*(Z - D)/Z', tex: 'p = b\\,\\frac{Z - D}{Z}',
      vars: {
        p: { name: 'separation of the two images on the screen (negative: crossed)', q: 'length', unit: 'mm', signed: true, tex: 'p' },
        b: { name: 'eye separation', q: 'length', unit: 'mm', value: 63, tex: 'b' },
        Z: { name: 'distance of the virtual point', q: 'length', unit: 'm', value: 1.5, tex: 'Z' },
        D: { name: 'distance of the screen', q: 'length', unit: 'm', value: 2.5, tex: 'D' }
      },
      solveFor: 'p',
      note: 'Positive parallax: the point is behind the screen. Negative: in front.',
      stories: { p: 'Your eyes are {b} apart, and you sit {D} from a 3-D screen. How far apart must the two images of a point be if it is to seem {Z} away?' }
    },
    {
      name: 'Vergence–accommodation mismatch',
      expr: 'dd = 1/Z - 1/D', tex: '\\Delta = \\frac{1}{Z} - \\frac{1}{D}',
      vars: {
        dd: { name: 'mismatch (negative: the point is behind the screen)', q: 'optpower', unit: 'D', signed: true, tex: '\\Delta' },
        Z: { name: 'distance of the virtual point', q: 'length', unit: 'm', value: 1.5, tex: 'Z' },
        D: { name: 'distance of the screen', q: 'length', unit: 'm', value: 2.5, tex: 'D' }
      },
      solveFor: 'dd',
      note: 'The difference in dioptres between where the eyes converge and where they focus.',
      stories: { dd: 'A 3-D screen is {D} away and a point is shown as if it were {Z} away. What is the mismatch between where the eyes converge and where they focus?' }
    },
    {
      name: 'Vergence angle',
      expr: 'v = 2*atan(b/(2*Z))', tex: 'v = 2\\arctan\\frac{b}{2Z}',
      vars: {
        v: { name: 'angle between the two lines of sight', q: 'angle', unit: '°', tex: 'v' },
        b: { name: 'eye separation', q: 'length', unit: 'mm', value: 63, tex: 'b' },
        Z: { name: 'distance of the point', q: 'length', unit: 'm', value: 1.5, tex: 'Z' }
      },
      solveFor: 'v',
      note: 'About 2.4° at 1.5 m, 9° at 40 cm and 0° at infinity.'
    }
  ],
  examples: [
    {
      title: 'A pop-out on a phone and in a cinema',
      q: 'A point is to appear 0.25 m from the eyes on a phone held at 0.40 m, and 10 m away in a cinema with the screen at 15 m. Find the screen parallax and the mismatch in each case (eye separation 63 mm).',
      steps: [
        { text: 'Phone:', tex: 'p = 63\\times\\frac{0.25-0.40}{0.25} = -37.8\\ \\mathrm{mm},\\quad \\Delta = \\frac{1}{0.25} - \\frac{1}{0.40} = 1.5\\ \\mathrm{D}' },
        { text: 'Cinema:', tex: 'p = 63\\times\\frac{10-15}{10} = -31.5\\ \\mathrm{mm},\\quad \\Delta = \\frac{1}{10} - \\frac{1}{15} = 0.033\\ \\mathrm{D}' }
      ],
      a: 'The images are about 30–40 mm apart in both, but the focusing conflict is 1.5 D on the phone and only 0.03 D in the cinema.'
    }
  ],
  quiz: [
    { q: 'A virtual point is exactly at the screen plane. What is the separation of its two images on the screen?', choices: ['Zero', 'The eye separation', 'Half the eye separation', 'It depends on the glasses'], a: 0, why: 'At Z = D the formula gives p = 0: both eyes see the point at the same place on the screen.' },
    { q: 'You sit 2.5 m from a screen and a point is shown as if 5 m away. What is the screen parallax in mm (eye separation 63 mm)?', answer: 31.5, unit: 'mm', why: '$p = 63\\times(5-2.5)/5 = 31.5$ mm: positive, because the point is behind the screen.' },
    { q: 'A point is shown at 1 m on a screen at 3 m. What is the vergence–accommodation mismatch in dioptres (absolute value)?', answer: 0.667, unit: 'D', why: '|1/1 − 1/3| = 0.667 D.' },
    { q: 'Anaglyph 3-D keeps the pictures apart by…', choices: ['colour filters, usually red and cyan', 'polarization', 'fast shutters', 'a lens sheet'], a: 0, why: 'Each lens passes one of the two colours, so each eye sees one picture; colours are compromised.' },
    { q: 'Why is a cinema usually more comfortable for 3-D than a phone?', choices: ['The screen is far away, so the mismatch 1/Z − 1/D is small', 'Cinemas use brighter light', 'Cinema glasses are better', 'The pictures are larger'], a: 0, why: 'With the screen at 15 m the dioptre difference stays at a few hundredths of a dioptre; at 0.4 m it can reach more than 1 D.' }
  ],
  applications: [
    'Cinema: passive polarized systems with a silver screen, or shutter systems, for feature films.',
    'Medical and engineering visualization: stereo microscopes and surgical displays, with the viewing distance fixed.',
    'Virtual reality headsets: two displays with correct disparity and head tracking, with the focal distance fixed.',
    'Remote work and photogrammetry: stereo pairs for mapping and measuring, shown to an operator wearing glasses.'
  ],
  history: 'Charles Wheatstone built the first stereoscope in the 1830s and published in 1838 that depth comes from the two different views. David Brewster produced a more compact lens stereoscope in the 1840s, and stereoscopic photographs became a Victorian craze. Coloured-filter anaglyphs date from the second half of the nineteenth century, and polarized stereo became practical when Edwin Land\'s polarizing sheet appeared in the 1930s.',
  sources: [
    'D. M. Hoffman, A. R. Girshick, K. Akeley and M. S. Banks, "Vergence–accommodation conflicts hinder visual performance and cause visual fatigue", *Journal of Vision* 8(3) (2008).',
    'N. S. Holliman, N. A. Dodgson, G. E. Favalora and L. Pockett, "Three-dimensional displays: a review and applications analysis", *IEEE Transactions on Broadcasting* 57 (2011).',
    'L. Lipton, *Foundations of the Stereoscopic Cinema* (Van Nostrand Reinhold, 1982).'
  ],
  sim: 'ph-stereo'
},

/* ================================================================ autostereograms and lenticular pictures */
{
  id: 'autostereograms-and-lenticular-images', parent: 'optical-phenomena', title: 'Autostereograms and lenticular pictures', level: 2,
  short: 'Two ways to see depth without glasses. A lenticular print puts thin strips of several pictures under a sheet of tiny cylindrical lenses, so that each eye is sent a different view. An autostereogram hides the depth in the spacing of a repeating random pattern, which the eyes fuse when they look through the picture.',
  keywords: ['autostereogram', 'random-dot stereogram', 'SIRDS', 'Magic Eye', 'lenticular', 'lenticular print', 'flip image', 'lenticular lens', 'lenses per inch', 'LPI', 'parallax barrier', 'integral imaging', 'parallel viewing', 'cross-eyed viewing'],
  prereq: ['binocular-vision-and-stereopsis', 'stereoscopic-3d-displays', 'refraction-at-a-curved-surface'],
  related: ['holograms-and-what-they-show', 'microlens-arrays', 'depth-and-perspective-illusions', 'moire-patterns'],
  body: `
A normal 3-D picture needs a different image for each eye and something to keep them apart: glasses ([[stereoscopic-3d-displays]]). Two older tricks do without glasses, one by optics and one by the brain.

### Depth from dots alone
In 1960 Béla Julesz, working at Bell Telephone Laboratories, showed two pictures of random dots, identical except that a patch in one was shifted sideways. Neither picture showed any shape. Fused by the eyes, one in each, the patch rose off the page. Depth comes from **disparity** alone, and the brain finds the matching dots itself.

### The autostereogram
A **single-image random-dot stereogram** puts both pictures in one. On every row the dots repeat at a distance that depends on the depth of the hidden shape there. Look *through* the picture, as if at something far behind, so that each eye lines up a different copy of the repeating dots. A point seen with the repeat distance $s$ on a screen at distance $D$ then appears at the distance

$$d = \\frac{D\\,b}{b - s}$$

where $b$ is the eye separation (63 mm). On a screen at 0.5 m, a repeat of 30 mm puts the point at 0.95 m, 24 mm at 0.81 m. **Nearer parts have a smaller repeat.** Since $s \\geq 0$, nothing can come out in front of the screen when the picture is viewed this way (*parallel viewing*). Crossing the eyes instead reverses the depth, an inside-out shape. The effect was noticed long before computers: Brewster described in 1844 how a repeating wallpaper pattern can seem to float when the eyes fuse the wrong copies.

### The lenticular sheet
A **lenticular** print is a sheet of parallel cylindrical lenses, 50 to 100 to the inch, over an image made of thin interleaved strips. Under each lens lie $N$ strips, one from each of $N$ pictures, in the lens's focal plane. A lens turns the strip under it into a beam going in one direction, with $\\tan\\theta \\approx x/f$ for a strip at distance $x$ from the lens axis. From a given direction, the eye sees the same strip under every lens, so it sees one whole picture; from another direction, another.

For a plano-convex lens with the strips on the flat back, the thickness is $t = nf$, so the full viewing angle is

$$2\\arctan\\frac{n\\,p}{2t}$$

for pitch $p$: for acrylic ($n = 1.49$) with $t = 1.75\\,p$ it is 46°, and each of 6 views covers 7.7°. Two eyes at 0.5 m are 7.2° apart, so they see *neighbouring* views: a 3-D picture. With 2–3 views the print simply **flips** or animates as you tilt it.

| | Autostereogram | Lenticular print |
|---|---|---|
| What carries the depth | spacing of repeated dots | strips under a lens sheet |
| Needs | a trained gaze | the right viewing distance |
| Shows | one shape | several views, flips, animation |
| Resolution cost | none | each view has $1/N$ of the width |

> [!key] An autostereogram hides depth in the repeat distance of the dots (smaller means nearer); a lenticular sheet sends a different strip of the picture to each direction, so the two eyes get two views.
`,
  ideas: [
    'Depth can come from disparity alone: random dots with no shape in either picture still give a shape when fused.',
    'In an autostereogram the repeat distance encodes depth; nearer means a smaller repeat, and parallel viewing puts everything behind the screen.',
    'A lenticular lens turns each strip under it into a beam in one direction: tan θ ≈ x/f.',
    'The viewing angle of a lenticular sheet is 2·atan(n·p/2t); thicker sheets view narrower.',
    'Two views give a flip or animation; many views give 3-D when the two eyes land on neighbouring views.'
  ],
  pitfalls: [
    'You must cross your eyes to see an autostereogram — Most are made for parallel viewing: relax the eyes as if looking at something far behind. Crossing the eyes reverses the depth.',
    'The picture contains a hidden image, like a watermark — Each picture is only a random pattern that repeats with varying spacing; the shape exists only after the eyes fuse it.',
    'A lenticular print holds two or more full pictures side by side — It holds interleaved strips of them; each lens throws one strip of each picture, one by one, towards one direction.',
    'More views always make a better print — With a fixed lens pitch, more views mean thinner strips and a print resolution that must be N times finer; beyond about a dozen views the gain is small.'
  ],
  terms: [
    { term: 'Autostereogram', also: ['single-image random-dot stereogram', 'SIRDS'], def: 'A picture of one repeating random pattern whose changing repeat distance encodes a hidden depth map, which appears when the eyes fuse neighbouring repeats.' },
    { term: 'Parallel viewing', also: ['wall-eyed viewing'], def: 'Looking through a stereo picture as if at something far behind it, so the lines of sight are nearly parallel. Cross-eyed viewing is the opposite and reverses depth.' },
    { term: 'Lenticular lens', def: 'A sheet of parallel cylindrical lenslets. Over an interlaced picture it sends different strips towards different directions.' },
    { term: 'Lenses per inch', also: ['LPI'], def: 'The number of lenticules in an inch of sheet: 25.4 mm divided by the pitch. Prints use about 50 to 100.' },
    { term: 'Flip image', def: 'A lenticular print with two or three pictures that change as the print is tilted, not a 3-D picture.' },
    { term: 'Parallax barrier', def: 'A mask with thin slits in front of a display that lets each eye see only some columns of pixels, the same job as a lenticular sheet but with less light.' }
  ],
  formulas: [
    {
      name: 'Where a repeating pattern appears',
      expr: 'd = D*b/(b - s)', tex: 'd = \\frac{D\\,b}{b - s}',
      vars: {
        d: { name: 'distance at which the point appears', q: 'length', unit: 'm', tex: 'd' },
        D: { name: 'distance of the picture', q: 'length', unit: 'm', value: 0.5, tex: 'D' },
        b: { name: 'eye separation', q: 'length', unit: 'mm', value: 63, tex: 'b' },
        s: { name: 'repeat distance of the dots on the picture', q: 'length', unit: 'mm', value: 30, min: 0, tex: 's' }
      },
      solveFor: 'd',
      note: 'Parallel viewing: the repeat s is smaller than b, so every point is behind the picture. Smaller s means nearer.',
      stories: { d: 'You look at an autostereogram {D} away; the dots repeat every {s}. How far away does that part of the picture seem, for eyes {b} apart?' }
    },
    {
      name: 'Viewing angle of a lenticular sheet',
      expr: 'a = 2*atan(n*p/(2*t))', tex: 'a = 2\\arctan\\frac{n\\,p}{2t}',
      vars: {
        a: { name: 'full viewing angle', q: 'angle', unit: '°', tex: 'a' },
        n: { name: 'refractive index of the sheet', value: 1.49, min: 1.3, max: 1.7, tex: 'n' },
        p: { name: 'lens pitch', q: 'length', unit: 'µm', value: 340, tex: 'p' },
        t: { name: 'thickness of the sheet', q: 'length', unit: 'µm', value: 600, tex: 't' }
      },
      solveFor: 'a',
      note: 'The strips lie in the focal plane of the lenses: t = n f.',
      stories: { a: 'A lenticular sheet of index {n} has lenses {p} apart and is {t} thick. Over what total angle can the print be viewed?' }
    },
    {
      name: 'Lenses per inch',
      expr: 'lpi = 0.0254/p', tex: '\\mathrm{LPI} = \\frac{25.4\\ \\mathrm{mm}}{p}',
      vars: {
        lpi: { name: 'lenses per inch', unit: 'lpi', tex: '\\mathrm{LPI}' },
        p: { name: 'lens pitch', q: 'length', unit: 'µm', value: 340, tex: 'p' }
      },
      solveFor: 'lpi',
      note: 'The pitch must be much finer than a quarter of the print\'s viewing distance divided by 1000 if the ridges are not to show.',
      practice: { unknowns: ['lpi'] }
    }
  ],
  examples: [
    {
      title: 'How deep is an autostereogram?',
      q: 'A picture is viewed at 0.5 m. Its background repeats every 30 mm and the nearest part of the hidden shape every 24 mm. How far apart in depth do they seem (eye separation 63 mm)?',
      steps: [
        { text: 'Background:', tex: 'd = \\frac{0.5\\times63}{63-30} = 0.955\\ \\mathrm{m}' },
        { text: 'Nearest part:', tex: 'd = \\frac{0.5\\times63}{63-24} = 0.808\\ \\mathrm{m}' }
      ],
      a: 'The shape floats about 15 cm in front of the background: 0.81 m against 0.95 m.'
    },
    {
      title: 'A lenticular print with six views',
      q: 'A sheet of acrylic (n = 1.49) has lenses 0.34 mm apart and is 0.60 mm thick. Find the viewing angle, the angle per view with 8 views, and the angle between your eyes at 0.5 m (eye separation 63 mm).',
      steps: [
        { text: 'Full angle:', tex: '2\\arctan\\frac{1.49\\times0.34}{2\\times0.60} = 2\\arctan 0.422 = 45.8°' },
        { text: 'Each of 8 views:', tex: '45.8°/8 = 5.7°' },
        { text: 'The two eyes:', tex: '2\\arctan\\frac{31.5}{500} = 7.2°' }
      ],
      a: 'The eyes are about 1.3 views apart: sometimes neighbouring views (3-D), sometimes two apart.'
    }
  ],
  quiz: [
    { q: 'In an autostereogram viewed in the usual way, nearer parts of the hidden shape have…', choices: ['a smaller repeat distance of the dots', 'a larger repeat distance', 'a different colour', 'a finer dot size'], a: 0, why: 'The repeat distance s is the separation of the left- and right-eye images; the point appears at d = Db/(b − s), so smaller s means nearer.' },
    { q: 'A lenticular print shows only two different pictures as you tilt it. Is this a 3-D picture?', choices: ['No, it is a flip', 'Yes, always', 'Yes, but only in colour', 'It depends on the lens pitch'], a: 0, why: 'With two views, the eyes usually see the same one: the print flips as a whole; 3-D needs the two eyes to see neighbouring views of one scene.' },
    { q: 'A lenticular sheet is made thicker, with the same lens pitch and index. The viewing angle…', choices: ['narrows', 'widens', 'stays the same', 'reverses'], a: 0, why: 'The viewing angle is 2·atan(n p/2t): a larger t means a smaller angle.' },
    { q: 'Lenses 0.254 mm apart: how many lenses per inch?', answer: 100, unit: 'lpi', why: '25.4 mm ÷ 0.254 mm = 100.' },
    { q: 'You cross your eyes while looking at an autostereogram made for parallel viewing. What happens to the depth?', choices: ['It is reversed: near parts look far', 'Nothing', 'It disappears', 'It doubles'], a: 0, why: 'Crossing the eyes fuses the wrong copies, which gives the opposite sign of disparity.' }
  ],
  applications: [
    'Packaging, trading cards and posters with flip and motion effects; advertising displays that change with the viewer\'s position.',
    'Autostereoscopic screens on phones, games consoles and kiosks, with lens arrays or barriers over the pixels.',
    'Perceptual research: random-dot stereograms are the standard test of stereopsis, because they contain no other depth cue.',
    'Early colour cinema: lenticular film (1920s) recorded colour on black-and-white stock through a lens sheet and striped filters.'
  ],
  history: 'Julesz\'s random-dot stereograms of 1960 showed that stereopsis needs no recognizable object. The single-image version, which Christopher Tyler and Maureen Clarke described as the autostereogram in 1990, followed from work by Tyler and others, and books of such pictures sold in millions in the early 1990s. Lenticular sheets for 3-D were studied by Lippmann, who proposed integral photography with a grid of tiny lenses in 1908, and they were used in 1920s colour film and in the novelty prints of the late twentieth century.',
  sources: [
    'B. Julesz, "Binocular depth perception of computer-generated patterns", *Bell System Technical Journal* 39 (1960).',
    'H. W. Thimbleby, S. Inglis and I. H. Witten, "Displaying 3D images: algorithms for single-image random-dot stereograms", *IEEE Computer* 27(10) (1994).',
    'T. Okoshi, *Three-Dimensional Imaging Techniques* (Academic Press, 1976) — lenticular and barrier systems.',
    'N. A. Dodgson, "Autostereoscopic 3D displays", *IEEE Computer* 38(8) (2005).'
  ],
  sim: 'ph-lenticular'
},

/* ================================================================ holograms */
{
  id: 'holograms-and-what-they-show', parent: 'optical-phenomena', title: 'What a hologram shows', level: 2,
  short: 'A photograph records how bright light is; a hologram also records its phase, by letting the light of the object interfere with a clean reference beam. Lit again, the plate gives back the wavefront of the object itself, so the scene has real depth and parallax, like looking through a window.',
  keywords: ['hologram', 'holography', 'reference beam', 'object beam', 'interference fringes', 'reflection hologram', 'transmission hologram', 'rainbow hologram', 'embossed hologram', 'Gabor', 'Denisyuk', 'Leith and Upatnieks', 'wavefront reconstruction', 'security hologram', 'parallax'],
  prereq: ['constructive-and-destructive-interference', 'coherence', 'what-diffraction-is'],
  related: ['holography', 'peppers-ghost-and-stage-illusions', 'holographic-optical-elements', 'diffractive-optical-elements', 'dielectric-mirrors'],
  body: `
A photograph of a statue is a flat map of brightness. Light from a real statue carries more: the exact phase of the wave at every point tells your eyes where each part of the statue is. A **hologram** records that phase too, and when lit, plays back the *light* of the scene rather than a picture of it.

### Recording
Light from a laser is split in two. One beam illuminates the object, which scatters it onto a photographic plate; the other, the **reference beam**, falls directly on the plate. The two beams overlap and interfere. Where they are in step the plate is exposed, where they are out of step it is not, and the result is a fine pattern of fringes. The spacing of the fringes records the *angle* between the beams, and their contrast and position record the amplitude and phase of the object's light.

For two plane beams meeting at an angle $\\theta$ the fringe spacing is

$$\\Lambda = \\frac{\\lambda}{2\\sin(\\theta/2)}$$

At 632.8 nm and $\\theta = 30°$, $\\Lambda = 1.22$ µm, which is 818 lines/mm; at 60° it is 633 nm (1580 lines/mm). For a **reflection hologram** the beams come from opposite sides and the fringes are layers parallel to the plate, $\\lambda/2n$ apart: 211 nm in gelatin with $n = 1.5$, over 4700 per millimetre. Ordinary film resolves 100–200 lines/mm, so holograms need special fine-grained emulsions, photopolymers or dichromated gelatin.

### Playback
Light the plate with the reference beam alone and the fringes diffract it, into a copy of the object's wavefront. The eye placed in that wavefront receives the same light as from the object and sees it in the same place, behind the plate: a **virtual image** with true depth. Move your head and the near parts slide past the far ones. The plate is a **window**: the picture is limited by the window's size, and a broken piece still shows the *whole* scene, from a narrower range of positions. A camera focused at different depths can bring different parts of the image sharp.

### Kinds of hologram
| Kind | Viewed with | Fringes | Notes |
|---|---|---|---|
| Transmission | laser light, from behind | across the plate | sharp, one colour |
| Reflection (Denisyuk) | a white point lamp, from the front | layers parallel to the surface | the layers act as a mirror, selecting the colour |
| Rainbow (Benton) | white light | transmission with a slit | gives up vertical parallax; colour changes with eye height |
| Embossed | white light, on foil | surface relief | mass-produced on cards and notes |

### Practicalities
Recording demands a laser whose coherence length exceeds the path difference (a helium–neon line 0.002 nm wide has 20 cm), and a table steady to a fraction of a wavelength during exposures of seconds. A hologram of a vibrating object, or of a stressed part, can show its motion in fringes (holographic interferometry).

### Not every "hologram" is one
Floating faces in films and concerts are almost always projections or [[peppers-ghost-and-stage-illusions|reflections in a tilted foil]], not holograms.

> [!key] A hologram records the fringes between an object beam and a reference beam. The plate then rebuilds the object's wavefront: a virtual image with real parallax, seen as through a window of the plate's size.
`,
  ideas: [
    'A photograph records intensity; a hologram records phase as well, through interference with a reference beam.',
    'Fringe spacing Λ = λ/(2 sin θ/2): from 0.8 to 1.6 thousand lines/mm for transmission holograms, over 4700 for reflection ones.',
    'The plate acts as a window: parallax and depth are real, and a piece of the plate still gives the whole scene.',
    'Reflection holograms work like a stack of mirrors and can be viewed in white light; embossed holograms are surface relief copied on foil.',
    'Recording needs coherent light, a steady table and an emulsion of very fine grain.'
  ],
  pitfalls: [
    'A hologram is a 3-D photograph — A photograph keeps one view. A hologram keeps the light field: move your head and you see round and behind things.',
    'Cutting a hologram in half gives half the picture — Each piece shows the whole scene but through a smaller window, so at lower resolution and from a narrower range of positions.',
    'Any light will play a hologram back — A transmission hologram needs light of the original colour and direction (a laser); reflection and embossed holograms are made for white light, and still need the right geometry.',
    'Holograms can hang images in empty air — A hologram needs the plate; anything shown in air without a screen, such as the ghost on a stage, is a reflection or a projection.'
  ],
  terms: [
    { term: 'Hologram', def: 'A recording of the interference pattern between light from an object and a reference beam, which when lit rebuilds the wavefront of the object.' },
    { term: 'Reference beam', def: 'A clean beam from the same laser that falls directly on the plate; its interference with the object light turns phase into a visible fringe pattern.' },
    { term: 'Fringe spacing', also: ['Λ'], def: 'The distance between the bright lines of the recorded pattern: λ/(2 sin(θ/2)) for two beams at an angle θ.' },
    { term: 'Reflection hologram', also: ['Denisyuk hologram', 'volume hologram'], def: 'A hologram recorded with beams from opposite sides, in a thick emulsion, whose layers reflect light of one colour and so can be viewed in white light.' },
    { term: 'Rainbow hologram', also: ['Benton hologram'], def: 'A transmission hologram recorded through a slit, viewable in white light; the colour seen changes with the height of the eye, and vertical parallax is lost.' },
    { term: 'Coherence length', def: 'The path difference over which light still interferes. For a line of width Δλ it is about λ²/Δλ.' }
  ],
  formulas: [
    {
      name: 'Fringe spacing of two plane beams',
      expr: 'L = lam/(2*sin(th/2))', tex: '\\Lambda = \\frac{\\lambda}{2\\sin(\\theta/2)}',
      vars: {
        L: { name: 'fringe spacing', q: 'length', unit: 'nm', tex: '\\Lambda' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        th: { name: 'angle between the beams', q: 'angle', unit: '°', value: 30, min: 1, max: 180, tex: '\\theta' }
      },
      solveFor: 'L',
      note: 'In air; the spacing along the surface is the same inside the emulsion. 180° is the reflection hologram in air; in gelatin divide by n.',
      stories: { L: 'Two beams of {lam} meet on a plate at {th}. How far apart are the fringes they record?' }
    },
    {
      name: 'Coherence length',
      expr: 'Lc = lam^2/dl', tex: 'L_c = \\frac{\\lambda^2}{\\Delta\\lambda}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'cm', tex: 'L_c' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        dl: { name: 'width of the spectral line', q: 'length', unit: 'pm', value: 2, tex: '\\Delta\\lambda' }
      },
      solveFor: 'Lc',
      note: 'The object and reference paths must agree to within this distance.',
      stories: { Lc: 'A laser of {lam} has a line {dl} wide. How far can the two paths of a hologram differ?' }
    }
  ],
  examples: [
    {
      title: 'The film a hologram needs',
      q: 'A transmission hologram is recorded with a helium–neon laser (632.8 nm) and beams 30° apart. How many lines per millimetre must the plate resolve? What about a reflection hologram in gelatin (n = 1.5)?',
      steps: [
        { text: 'Transmission:', tex: '\\Lambda = \\frac{632.8}{2\\sin 15°} = 1222\\ \\mathrm{nm} \\;\\Rightarrow\\; 818\\ \\mathrm{lines/mm}' },
        { text: 'Reflection:', tex: '\\Lambda = \\frac{632.8}{2\\times1.5} = 211\\ \\mathrm{nm} \\;\\Rightarrow\\; 4741\\ \\mathrm{lines/mm}' }
      ],
      a: '818 lines/mm and 4741 lines/mm. A film that resolves 150 lines/mm cannot record either.'
    }
  ],
  quiz: [
    { q: 'What does a hologram record that a photograph does not?', choices: ['The phase of the light, through interference with a reference beam', 'The colour', 'The size of the object', 'The temperature of the object'], a: 0, why: 'A photograph records intensity only. The interference fringes of the hologram carry the phase and so the depth information.' },
    { q: 'A hologram plate is dropped and a corner breaks off. The corner piece shows…', choices: ['the whole scene, through a smaller window', 'only the corner of the scene', 'nothing', 'a negative of the scene'], a: 0, why: 'Every part of the plate has recorded light from every part of the object; a smaller piece is a smaller window.' },
    { q: 'Two beams of 532 nm meet at 60° in air. What is the fringe spacing in nm?', answer: 532, unit: 'nm', why: 'Λ = λ/(2 sin 30°) = λ = 532 nm.' },
    { q: 'Which kind of hologram can you see in sunlight?', choices: ['A reflection or embossed (rainbow) hologram', 'A transmission hologram made with a laser', 'Any hologram', 'None'], a: 0, why: 'Reflection and rainbow holograms select a band of colours from white light; a plain transmission hologram needs a laser.' },
    { q: 'The "hologram" of a singer on a stage is shown on a tilted sheet of foil in front of a bright screen. Is it a true hologram?', a: false, why: 'It is a Pepper\'s ghost: a reflected flat picture. A true hologram needs a recording plate and shows parallax from all viewpoints.' }
  ],
  applications: [
    'Security: embossed holograms on banknotes, cards and passports are hard to copy without a precision master.',
    'Holographic optical elements: gratings, lenses and combiners recorded as holograms, as in head-up displays ([[holographic-optical-elements]]).',
    'Interferometry: a hologram of a part before and after loading shows its deformation as fringes.',
    'Data storage and display research: volume holograms store pages of data, and computer-generated holograms steer light in projectors.'
  ],
  history: 'Dennis Gabor invented holography in 1947 while trying to improve the electron microscope, and published it in 1948; he received the Nobel Prize in Physics in 1971. It was a curiosity until the laser (1960). In 1962–64 Emmett Leith and Juris Upatnieks at the University of Michigan recorded holograms of continuous-tone pictures and then of solid objects with a laser and an off-axis reference beam, and in 1962 Yuri Denisyuk in the Soviet Union developed the reflection hologram. Stephen Benton at Polaroid invented the white-light rainbow hologram in 1968–69.',
  sources: [
    'D. Gabor, "A new microscopic principle", *Nature* 161 (1948) 777.',
    'E. N. Leith and J. Upatnieks, "Reconstructed wavefronts and communication theory", *Journal of the Optical Society of America* 52 (1962) 1123.',
    'P. Hariharan, *Basics of Holography* (Cambridge University Press, 2002).',
    'R. J. Collier, C. B. Burckhardt and L. H. Lin, *Optical Holography* (Academic Press, 1971).'
  ],
  sim: 'ph-hologram'
},

/* ================================================================ iridescence */
{
  id: 'iridescence-and-structural-colour', parent: 'optical-phenomena', title: 'Iridescence and structural colour', level: 2,
  short: 'A pigment gives a colour by absorbing the others. Many bright natural colours have no pigment at all: soap films, oil slicks, beetles, butterflies, opals and discs are coloured by structures a fraction of a wavelength thick, which reflect some colours and not others, and the colour changes with the angle.',
  keywords: ['iridescence', 'structural colour', 'thin film', 'soap bubble', 'oil slick', 'Newton colours', 'butterfly', 'Morpho', 'beetle', 'peacock', 'opal', 'mother of pearl', 'diffraction grating', 'compact disc', 'photonic crystal', 'multilayer'],
  prereq: ['thin-film-interference', 'dispersion-and-the-spectrum', 'the-grating-equation'],
  related: ['where-colours-come-from', 'antireflection-coatings', 'dielectric-mirrors', 'interference-filters', 'why-the-sky-is-blue'],
  body: `
Mix paint and you mix pigments: each absorbs some wavelengths, and the colour is what is left. A soap bubble has no pigment. It is coloured by its thickness, and the colour moves across it as the film thins and as you move your head. That is **iridescence**: colour that changes with the viewing angle, made by structure, not chemistry.

### A thin film
Light reflects from the front of a film and from its back. The second wave has travelled an extra $2nd\\cos\\theta_t$ and, for a film in air, has not suffered the half-wave phase jump of the first. The two reflections reinforce for

$$2\\,n\\,d\\cos\\theta_t = \\left(m + \\tfrac12\\right)\\lambda$$

with $m = 0, 1, 2, \\ldots$ For a soap film ($n = 1.33$) 300 nm thick, looked at straight on, the $m = 1$ peak is at 532 nm: green. A film much thinner than a quarter wavelength reflects almost nothing, because the two waves cancel: the black film at the top of a draining bubble.

| Soap film thickness | Colour seen straight on (computed under daylight) |
|---|---|
| 80 nm | silvery white |
| 160 nm | gold-brown |
| 200 nm | purple |
| 250 nm | blue |
| 300 nm | green |
| 350 nm | orange |
| 400 nm | magenta |
| 500 nm | green again |
| above 1 000 nm | pale pastels, then none |

Higher orders turn pastel because several wavelengths are reinforced at once, and beyond a micron or so white light has too short a coherence length to interfere at all.

### The angle
At larger angles $\\cos\\theta_t$ falls, so each peak moves to a shorter wavelength:

$$\\lambda(\\theta) = \\lambda_0\\sqrt{1 - \\frac{\\sin^2\\theta}{n^2}}$$

The 565 nm peak of a 320 nm film at 0° moves to 550 nm at 20°, 495 nm at 40° and 430 nm at 60°. Everything shifts towards blue as the view tilts.

### Layers and gratings
A **stack** of alternating thin layers reflects a band strongly, as the coating of a [[dielectric-mirrors|dielectric mirror]] does. Blue butterfly wings, jewel beetles, mother-of-pearl and many fish scales are such stacks of chitin, protein or guanine with air or water between them. Eight pairs of cuticle (n = 1.56, 85 nm) and air (110 nm) reflect a band peaking at 485 nm that drifts to 410 nm at 40°. A regular array of tiny spheres (opal: silica spheres a couple of hundred nanometres across) diffracts like a three-dimensional grating. A **diffraction grating** sends each wavelength in its own direction, $\\sin\\theta = m\\lambda/p$: the tracks of a compact disc, 1.6 µm apart, spread the first-order colours from 14° to 28°. A Blu-ray disc, with tracks of 320 nm, has no visible first order.

### Colour without pigment lasts
Structural colour does not bleach. It is used in banknote inks, car paints with coated mica flakes, optical filters and the colours of the sky and of blue eyes (scattering, [[why-the-sky-is-blue]]). Because it depends on the angle, it is also a sign of a genuine structure.

> [!key] Iridescent colours come from interference in films, stacks and gratings of sub-micron structure. Each reflected band moves to shorter wavelengths as the viewing angle grows, so the colour shifts toward blue as you tilt.
`,
  ideas: [
    'Structural colours come from interference, diffraction or scattering by structures of about a wavelength, not from absorbing pigments.',
    'A thin film reflects at 2nd·cosθ = (m + ½)λ; a very thin film reflects nothing (black), and thick films give pastel colours or none.',
    'The reflected band moves to shorter wavelengths with angle, λ(θ) = λ₀ √(1 − sin²θ/n²): iridescence.',
    'A stack of layers reflects one band strongly, as a dielectric mirror does; nature uses it in wings, scales and shells.',
    'Gratings (a compact disc) send each wavelength in its own direction.'
  ],
  pitfalls: [
    'Iridescent colours are pigments that happen to reflect — They come from the structure. Grind a blue butterfly wing to a powder and the blue is gone; a pigment would stay.',
    'The colour of a soap film shows its chemistry — It shows its thickness (and the angle): the same liquid gives black, silver, gold, magenta and green in turn.',
    'Thicker films give brighter, purer colours — Beyond a micron or so the order is so high that many wavelengths overlap and the colours wash out.',
    'Oil on a puddle is coloured by the oil\'s own colour — The oil is clear; the colours come from film thickness varying from nanometres to micrometres.'
  ],
  terms: [
    { term: 'Iridescence', def: 'Colour that changes with the angle of viewing or of illumination, produced by interference or diffraction in a fine structure.' },
    { term: 'Structural colour', def: 'Colour made by the geometry of a surface or material, by interference, diffraction or scattering, and not by absorbing pigments.' },
    { term: 'Thin-film interference', def: 'The reinforcement or cancellation of the light reflected from the two faces of a film a few wavelengths thick.' },
    { term: 'Multilayer', also: ['Bragg stack'], def: 'A stack of thin alternating layers of two indices that reflects a band of wavelengths strongly; natural examples are butterfly scales and beetle cuticle.' },
    { term: 'Photonic crystal', def: 'A material with a regular structure on the scale of the wavelength, which reflects some colours and blocks them from passing: opal is a natural example.' },
    { term: 'Newton\'s colours', def: 'The sequence of colours of thin films of increasing thickness, first described by Newton in the rings between two glasses.' }
  ],
  formulas: [
    {
      name: 'Reflection peaks of a thin film in air',
      expr: 'lam = 4*n*d*cos(tt)/(2*m + 1)', tex: '\\lambda = \\frac{4\\,n\\,d\\cos\\theta_t}{2m+1}',
      vars: {
        lam: { name: 'wavelength reinforced in reflection', q: 'length', unit: 'nm', tex: '\\lambda' },
        n: { name: 'refractive index of the film', value: 1.33, min: 1, max: 3, tex: 'n' },
        d: { name: 'thickness of the film', q: 'length', unit: 'nm', value: 300, tex: 'd' },
        tt: { name: 'angle of the ray inside the film', q: 'angle', unit: '°', value: 20, min: 0, max: 89, tex: '\\theta_t' },
        m: { name: 'order', value: 1, int: true, min: 0, tex: 'm' }
      },
      solveFor: 'lam',
      note: 'For a film with air on both sides (soap) or with the same sequence of indices (oil on water). With a coating between air and a higher index (an anti-reflection layer) the condition swaps maxima and minima.',
      stories: { lam: 'A soap film of index {n} is {d} thick. At {tt} inside the film, for order {m}, which wavelength is reflected most strongly?' }
    },
    {
      name: 'Shift of a reflection band with angle',
      expr: 'lam = lam0*sqrt(1 - sin(th)^2/n^2)', tex: '\\lambda(\\theta) = \\lambda_0\\sqrt{1 - \\frac{\\sin^2\\theta}{n^2}}',
      vars: {
        lam: { name: 'peak wavelength at the angle', q: 'length', unit: 'nm', tex: '\\lambda' },
        lam0: { name: 'peak wavelength at normal incidence', q: 'length', unit: 'nm', value: 565, tex: '\\lambda_0' },
        th: { name: 'angle of viewing', q: 'angle', unit: '°', value: 40, min: 0, max: 89, tex: '\\theta' },
        n: { name: 'effective index of the structure', value: 1.33, min: 1, max: 3, tex: 'n' }
      },
      solveFor: 'lam',
      note: 'The band moves to shorter wavelengths: blue shift. The stronger the index (n larger), the less the shift.',
      stories: { lam: 'A film reflects {lam0} straight on. What does it reflect when viewed at {th} from the normal, if its effective index is {n}?' }
    },
    {
      name: 'First order of a disc',
      expr: 'sin(th) = lam/p', tex: '\\sin\\theta = \\frac{\\lambda}{p}',
      vars: {
        th: { name: 'angle of the first order, light arriving along the normal', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        p: { name: 'track pitch', q: 'length', unit: 'nm', value: 1600, tex: 'p' }
      },
      solveFor: 'th',
      note: 'CD 1600 nm, DVD 740 nm, Blu-ray 320 nm. If λ > p there is no first order.',
      stories: { th: 'Light of {lam} falls straight on a disc whose tracks are {p} apart. At what angle does the first order leave?' }
    }
  ],
  examples: [
    {
      title: 'The green of a soap film, tilted',
      q: 'A soap film (n = 1.33) is 300 nm thick. Which colour is reflected most strongly looking straight on, and at what angle in the film does it become blue-green at 465 nm?',
      steps: [
        { text: 'Straight on, order $m = 1$:', tex: '\\lambda = \\frac{4\\times1.33\\times300}{3} = 532\\ \\mathrm{nm}' },
        { text: 'For 465 nm the cosine must fall by 465/532:', tex: '\\cos\\theta_t = 0.874 \\;\\Rightarrow\\; \\theta_t = 29.0°' },
        { text: 'In air that is', tex: '\\sin\\theta = 1.33\\sin 29.0° = 0.645 \\;\\Rightarrow\\; \\theta = 40.2°' }
      ],
      a: '532 nm (green) straight on; the film looks blue-green when seen about 40° from the normal.'
    }
  ],
  quiz: [
    { q: 'A very thin soap film, much thinner than a quarter of a wavelength, looks…', choices: ['black', 'white', 'violet', 'the colour of the soap'], a: 0, why: 'The two reflections are about half a wave out of phase for zero thickness and cancel: the black film.' },
    { q: 'You tilt an iridescent beetle away from you. Its colour shifts towards…', choices: ['shorter wavelengths (blue)', 'longer wavelengths (red)', 'white', 'it does not change'], a: 0, why: 'The peak wavelength of a film or stack goes as the cosine of the angle inside the structure, so it shortens with the angle.' },
    { q: 'A compact disc has tracks 1600 nm apart. Light of 550 nm falls along the normal. At what angle in degrees is the first order?', answer: 20.1, unit: '°', why: 'sin θ = 550/1600 = 0.344, so θ = 20.1°.' },
    { q: 'Why does a Blu-ray disc show no rainbow in the first order?', choices: ['Its track pitch (320 nm) is smaller than the wavelength, so no first order exists', 'It is black', 'It is coated with a pigment', 'It is read by a blue laser'], a: 0, why: 'sin θ = λ/p would exceed 1 for visible λ > 320 nm: there is no diffracted beam.' },
    { q: 'Grinding a butterfly wing to powder destroys its blue. What does that show?', choices: ['The colour is structural', 'The colour is a pigment', 'The wing is thin', 'The powder absorbs light'], a: 0, why: 'A pigment survives grinding; a colour made by a layered structure is destroyed with it.' }
  ],
  applications: [
    'Anti-counterfeit features: optically variable inks and foils whose colour changes with the angle.',
    'Interference filters and mirrors: multilayer coatings designed on the same principle ([[interference-filters]]).',
    'Pearlescent paints and cosmetics, made of mica flakes coated with titanium dioxide.',
    'Biomimetic displays and colourants that do not bleach, and sensors that read a colour change as a film swells or a gap changes.'
  ],
  history: 'Robert Hooke described the colours of thin flakes of mica and the feathers of the peacock in *Micrographia* (1665), and Newton measured the coloured rings between a lens and a flat glass in his *Opticks* (1704). Thomas Young explained them around 1801 as interference. In 1891 Gabriel Lippmann used standing waves in a photographic emulsion to record colour as a stack of layers, an idea that led to the reflection hologram.',
  sources: [
    'S. Kinoshita, *Structural Colors in the Realm of Nature* (World Scientific, 2008).',
    'S. Kinoshita and S. Yoshioka, "Structural colors in nature: the role of regularity and irregularity in the structure", *ChemPhysChem* 6 (2005).',
    'E. Hecht, *Optics*, ch. 9 — interference in thin films and Newton\'s rings.'
  ],
  sim: 'ph-iridescence'
},

/* ================================================================ camera artefacts */
{
  id: 'camera-artefacts-as-illusions', parent: 'optical-phenomena', title: 'Camera artefacts: flare, moiré and bent propellers', level: 2,
  short: 'A camera does not copy the world: it samples it in time and in space, row by row, through glass that reflects and an iris that diffracts. The results look like real things but are not in the scene: a wheel that turns backwards, a bent propeller, spikes on a lamp, ghosts of the Sun, false patterns on a shirt.',
  keywords: ['wagon wheel effect', 'rolling shutter', 'propeller', 'jello effect', 'starburst', 'sunstar', 'diffraction spikes', 'lens flare', 'ghost', 'moiré', 'aliasing', 'banding', 'flicker bands', 'blooming', 'temporal aliasing', 'artefact'],
  prereq: ['shutter-types', 'ghosts-flare-and-stray-light', 'rolling-and-global-shutter'],
  related: ['stroboscopic-effects', 'moire-patterns', 'nyquist-sampling-and-aliasing', 'apertures-irises-and-pinholes', 'flicker-and-persistence-of-vision', 'the-airy-disk'],
  body: `
A camera has opinions. Its shutter looks at the world at certain moments, its sensor reads rows one after another, its iris has edges, its glass reflects. Each habit puts something into the picture that was not in the scene.

### Sampling in time: the wagon wheel
Film shows 24 frames a second. A wheel with $N$ identical spokes looks the same after a turn of $1/N$, so the camera can only tell the *remainder*. If the wheel turns at $f_r$ turns a second, spokes pass a fixed point at $N f_r$ per second, and the film (at $f_s$ frames a second) shows the apparent rate

$$f_a = N f_r - k f_s$$

with the whole number $k$ that brings $|f_a|$ within half the frame rate. A 12-spoke wheel at 2 turns a second passes 24 spokes a second: it stands still on film at 24 fps. At 1.9 turns a second, $f_a = -1.2$ per second, which is $-0.1$ turn a second: **backwards**, one turn in ten seconds, while the real wheel goes forward. Motion blur from a long exposure softens the effect.

### Sampling by rows: the rolling shutter
Most CMOS sensors expose and read one row after another, taking 5 to 30 ms for the whole frame. Anything that moves during the read-out is cut into slices taken at different moments: a vertical post moving at $v$ pixels per second leans by $vT$ pixels over the frame (2 000 px/s with a read-out of 16 ms gives 32 px). A propeller turning through half a revolution during the read-out becomes a set of curved blades. Lamps that flicker at 100 or 120 Hz paint dark bands across the frame, since each row catches a different phase; an exposure time that is a whole multiple of 1/100 s (or 1/120 s) removes them. A **global shutter** exposes every row at once ([[rolling-and-global-shutter]]).

### Edges of the iris: the starburst
Light going past a straight edge is spread at right angles to it ([[what-diffraction-is]]). A polygonal iris therefore draws a streak perpendicular to each edge through every bright point. With an **even** number of blades, the streaks from opposite edges lie on one line, so $N$ blades give $N$ spikes; with an **odd** number they do not, so $N$ blades give $2N$: 7 blades, 14 spikes; 8 blades, 8 spikes. The spikes are strongest at small apertures. Round blades or a wide-open iris give none.

### Glass: ghosts and flare
An uncoated surface returns about 4 % of the light, a good multilayer coating about 0.2 %. Light that bounces twice inside the lens makes a faint copy, in the shape of the iris, along the line through the image centre; two bounces at 0.2 % each are only 4 parts in a million, but the Sun is far more than a million times brighter than the shadows, so the copy shows ([[ghosts-flare-and-stray-light]]).

| Artefact | Cause | Cure |
|---|---|---|
| Wheel runs backwards | sampling in time | higher frame rate, more blur |
| Bent propeller, leaning posts | rolling shutter | global shutter, short read-out |
| Dark bands under lamps | rolling shutter and 100/120 Hz light | exposure of n/100 s or n/120 s |
| Spikes on lights | straight iris blades | round blades, wider aperture |
| Ghosts, haze | reflections inside the lens | coatings, hood, fewer glass surfaces |
| Moiré on fabrics | sampling in space ([[moire-patterns]]) | low-pass filter, change the distance |

> [!key] A camera samples: the scene is cut into frames, rows and pixels. Whatever changes faster, or is finer, than the sampling can follow comes back as a false, slower or coarser version of itself.
`,
  ideas: [
    'The wagon wheel is aliasing in time: only the spoke rate modulo the frame rate survives, fa = N·fr − k·fs.',
    'A rolling shutter reads the rows at different times, so moving things lean and propellers bend, by v·T pixels over the frame.',
    'A global shutter or a short strobe flash removes rolling-shutter distortions.',
    'A polygonal iris gives N spikes for even N and 2N for odd N, perpendicular to its edges.',
    'Ghosts and flare are light that bounced inside the lens: coatings cut each bounce to about 0.2 %.'
  ],
  pitfalls: [
    'The wheel really turns backwards on the screen, so the camera or the screen is broken — Both work correctly. The film only samples the position of the spokes, and the most likely smooth motion is the slow backwards one; no information is lost, because it was never recorded.',
    'A bent propeller means the propeller is bent — Each row saw it at a different moment; the blades are straight.',
    'The starburst is caused by dust or scratches on the lens — It is diffraction at the straight edges of the iris, and is the same for a clean lens.',
    'Faster shutter speeds cure the rolling shutter — A short exposure freezes each row but does not change when the rows are read, so the skew remains; only faster read-out, a global shutter or a flash helps.'
  ],
  terms: [
    { term: 'Wagon-wheel effect', def: 'The apparent slowing, stopping or reversal of a turning wheel on film or video, because the frames sample its position too seldom.' },
    { term: 'Rolling shutter', def: 'Exposure of an image sensor one row at a time. Moving subjects are skewed or bent, and flickering lamps give bands.' },
    { term: 'Global shutter', def: 'Exposure of all rows of a sensor at the same time, with storage of the charge in each pixel until it is read out.' },
    { term: 'Diffraction spike', also: ['starburst', 'sunstar'], def: 'A streak through a bright point, at right angles to an edge of the aperture, caused by diffraction at that edge.' },
    { term: 'Ghost', def: 'A faint copy of a bright object, made by light that has reflected an even number of times between the surfaces of a lens.' },
    { term: 'Aliasing', def: 'The appearance of false lower-frequency patterns when something is sampled at less than twice its highest frequency.' }
  ],
  formulas: [
    {
      name: 'Apparent rate of a wheel on film',
      expr: 'fa = N*fr - k*fs', tex: 'f_a = N f_r - k f_s',
      vars: {
        fa: { name: 'apparent spoke rate (negative: backwards)', q: 'frequency', unit: 'Hz', signed: true, tex: 'f_a' },
        N: { name: 'number of identical spokes', value: 12, int: true, min: 2, tex: 'N' },
        fr: { name: 'wheel turns per second', q: 'frequency', unit: 'Hz', value: 1.9, tex: 'f_r' },
        k: { name: 'whole number that puts the result within ±½ f_s', value: 1, int: true, signed: true, tex: 'k' },
        fs: { name: 'frame rate', q: 'frequency', unit: 'Hz', value: 24, tex: 'f_s' }
      },
      solveFor: 'fa',
      note: 'Divide by N to get the apparent turns per second. For |fa| < fs/2 the picture is the slowest one the eye can follow.',
      stories: { fa: 'A wheel with {N} spokes turns at {fr} and is filmed at {fs}. Using k = {k}, what is the apparent spoke rate?' }
    },
    {
      name: 'Skew from a rolling shutter',
      expr: 'sk = v*T', tex: 'S = v\\,T',
      vars: {
        sk: { name: 'sideways lean over the whole frame, in pixels', tex: 'S' },
        v: { name: 'speed of the object in the image', unit: 'px/s', value: 2000, tex: 'v' },
        T: { name: 'read-out time of the frame', q: 'time', unit: 'ms', value: 16, tex: 'T' }
      },
      solveFor: 'sk',
      note: 'The top row and the bottom row are exposed T apart. A short exposure does not reduce this.',
      stories: { sk: 'An object crosses the image at {v} and the sensor takes {T} to read a frame. By how many pixels does a vertical edge lean?' }
    }
  ],
  examples: [
    {
      title: 'A backwards wheel',
      q: 'A 12-spoke wheel turns forwards at 1.9 turns a second and is filmed at 24 frames a second. How does it look?',
      steps: [
        { text: 'Spoke rate:', tex: 'N f_r = 12\\times1.9 = 22.8\\ \\mathrm{s^{-1}}' },
        { text: 'The nearest multiple of 24 is $k = 1$:', tex: 'f_a = 22.8 - 24 = -1.2\\ \\mathrm{s^{-1}}' },
        { text: 'In turns:', tex: '-1.2/12 = -0.1\\ \\mathrm{turn/s}' }
      ],
      a: 'The film shows the wheel turning backwards, one turn in 10 seconds, though the real wheel turns forwards 19 times faster.'
    },
    {
      title: 'A leaning telegraph pole',
      q: 'A camera with a read-out of 16 ms films a pole that crosses the image at 2000 pixels per second. How far does the pole lean from top to bottom of the frame?',
      steps: [{ text: 'Skew:', tex: 'S = vT = 2000\\ \\mathrm{px/s}\\times0.016\\ \\mathrm{s} = 32\\ \\mathrm{px}' }],
      a: '32 pixels: the pole leans noticeably, although each row is exposed in a fraction of a millisecond.'
    }
  ],
  quiz: [
    { q: 'An iris has 7 straight blades. How many diffraction spikes does a bright point show?', choices: ['14', '7', '3', '21'], a: 0, why: 'With an odd number of blades the spikes of opposite edges do not overlap, so there are 2 × 7 = 14.' },
    { q: 'A 12-spoke wheel turns at 2.1 turns a second and is filmed at 24 fps. Which apparent rate, in turns per second (negative is backwards), does the film show?', answer: 0.1, unit: 'turn/s', why: '12 × 2.1 = 25.2 spokes/s; minus 24 gives +1.2 per second, which is 0.1 turn per second, forwards.' },
    { q: 'A propeller looks bent in a phone video. The best cure is…', choices: ['a global shutter or a faster sensor read-out', 'a faster shutter speed only', 'a bigger lens', 'a lower ISO'], a: 0, why: 'The bend comes from the rows being read at different times; the exposure time of each row does not change that.' },
    { q: 'Dark horizontal bands move across a video of a room lit by 50 Hz mains lamps (flicker at 100 Hz). Which exposure time prevents them?', choices: ['1/100 s or a multiple of it', '1/60 s', '1/1000 s', 'The bands cannot be removed'], a: 0, why: 'If the exposure covers a whole number of flicker periods, every row collects the same light.' },
    { q: 'The streaks on a street lamp are caused by dust on the lens.', a: false, why: 'They come from diffraction at the straight edges of the iris; a perfectly clean lens shows them.' }
  ],
  applications: [
    'Film-making: the 180° shutter angle keeps motion blur natural and softens the wagon-wheel effect; cinematographers avoid regular patterns that move.',
    'Machine vision: rolling shutters distort moving parts, so inspection systems use global shutters or short flashes ([[triggering-and-strobing]]).',
    'Photography: landscape photographers stop down to f/16 or more on purpose to give the Sun a "sunstar"; round-blade lenses are chosen to avoid it.',
    'Drones and phones: rolling-shutter distortion is corrected in software from gyroscope data.'
  ],
  history: 'Peter Mark Roget described in 1825 how the spokes of a cart wheel seen through the slits of a fence seem to bend and to turn at the wrong speed, an observation that fed into the invention of the stroboscope and cinema. The wagon-wheel effect was seen on film from the earliest days; it is the aliasing of a sampled signal that later became central in communication and image engineering.',
  sources: [
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems*, 2nd ed. (SPIE Press, 2011) — shutters, read-out and sampling.',
    'E. Hecht, *Optics*, ch. 10 — diffraction at an edge and by apertures.',
    'P. M. Roget, "Explanation of an optical deception in the appearance of the spokes of a wheel seen through vertical apertures", *Philosophical Transactions of the Royal Society* 115 (1825).'
  ],
  sim: 'ph-artefacts'
},

/* ================================================================ one-way mirrors and invisibility */
{
  id: 'one-way-mirrors-and-invisibility-tricks', parent: 'optical-phenomena', title: 'One-way mirrors and hiding with optics', level: 1,
  short: 'There is no such thing as a mirror that works one way: a half-silvered pane reflects part and transmits part from both sides. It looks like a mirror from the bright room and a window from the dark one because of the lighting. Mirror boxes, camouflage and a lens "cloak" hide things by other optical tricks.',
  keywords: ['one-way mirror', 'two-way mirror', 'half-silvered', 'mirror box', 'invisibility', 'cloak', 'Rochester cloak', 'camouflage', 'counter-shading', 'transparency', 'metamaterial cloak', 'mirror TV', 'teleprompter', 'beam splitter'],
  prereq: ['plane-mirror-images', 'fresnel-reflection', 'peppers-ghost-and-stage-illusions'],
  related: ['beam-splitters', 'dielectric-mirrors', 'metal-mirror-coatings', 'iridescence-and-structural-colour', 'two-mirrors-and-kaleidoscopes'],
  body: `
In a police drama a suspect sits in a bright room and sees a mirror; behind it, detectives in a dark room see straight in. The glass is a **half-silvered** pane, and it is symmetrical: it reflects a fraction $R$ of the light that reaches it from either side and transmits $T = 1 - R$ (when it does not absorb). Nothing makes it work one way. The lighting does.

### The lighting ratio
What the eye sees is the sum of the reflection of its own side and the transmitted light of the other side. Take $R = T = 0.5$, a bright room at 500 cd/m² and a dark one at 5 cd/m².

- From the bright room: the reflection of the room is $0.5\\times500 = 250$ cd/m²; the dark room through the glass is $0.5\\times5 = 2.5$. The reflection wins 100 to 1: a mirror.
- From the dark room: the bright room seen through the glass is 250 cd/m²; the reflection of the dark room is 2.5. The view through wins 100 to 1: a window.

Turn the lights on in the dark room and the glass becomes see-through in both directions, a window with ghostly reflections. A lighting ratio of 10 to 1 or more makes the illusion convincing. The same trick makes a **mirror TV**: with the screen off the glass is a mirror; with it on, a screen at 400 cd/m² outshines the 50 cd/m² of room reflected in it.

The coating is a metal film only a few nanometres thick, or a dielectric stack that absorbs nothing ([[beam-splitters]]). See [[peppers-ghost-and-stage-illusions]] for the version on a stage.

### Mirror boxes
A table that seems to have an empty space under it can hide a person: two mirrors at 45° between the legs reflect the *side walls* of the room. The audience takes the reflected side wall, which matches the pattern of the back wall, for the back wall itself. Mirror boxes of this kind were the basis of the "Sphinx" illusions of the 1860s.

### Camouflage
Animals use optics too. **Counter-shading** (dark on top, pale beneath) cancels the shading of sunlight on a rounded body and makes it look flat, a principle described by Abbott Thayer in 1896. **Disruptive patterns** break up an outline. Many marine animals are transparent, with tissue whose index is close to that of water (1.33–1.4) so that it neither reflects nor refracts; and the silvery sides of fish are mirrors of layered crystals ([[iridescence-and-structural-colour]]) that reflect the matching light of open water.

### An optical cloak
A cloak must send rays around a region and bring them back as if nothing were there. A **paraxial** version uses four lenses of focal lengths $f_1, f_2, f_2, f_1$ with spacings $f_1 + f_2$, $t_2$ and $f_1 + f_2$, where

$$t_2 = \\frac{2 f_2 (f_1 + f_2)}{f_1 - f_2}$$

For $f_1 = 200$ mm and $f_2 = 75$ mm: 275 mm, 330 mm and 275 mm. The ray-transfer matrix of the four lenses is then exactly that of free space over 880 mm: a ray enters and leaves as if the glass were not there, but in between it is bent away from the central region, which stays empty. It works only for rays at small angles to the axis, from limited directions, with some colour error. Cloaks of structured materials (metamaterials) hid objects from microwaves in 2006, but a broadband cloak for visible light, all angles and large objects has not been made.

> [!key] A half-silvered pane is symmetrical: what you see is its reflection of your own bright side plus the other side seen through it, and the lighting ratio decides which wins. Cloaks and camouflage use geometry or matching of the background, not magic.
`,
  ideas: [
    'A half-silvered pane reflects R and transmits T from both sides; "one-way" is a matter of lighting.',
    'The side that sees through is the dark one: through-light T·L_bright beats the reflection R·L_dark.',
    'A lighting ratio of 10:1 or more makes the mirror/window effect convincing.',
    'Mirror boxes reflect the side walls so that the viewer believes he is seeing the back wall.',
    'A four-lens paraxial cloak is equivalent to free space for off-axis rays, but only at small angles.'
  ],
  pitfalls: [
    'A one-way mirror is a special glass that passes light in only one direction — It is symmetrical, and light is transmitted both ways; the two sides differ only in how brightly they are lit.',
    'A one-way mirror works in any light — It stops working when the dark side is lit up: both sides then see through and see reflections.',
    'Invisibility cloaks of the films work by bending light round a person — Experimental cloaks only work for narrow bands, small objects or limited angles; none hides a person from all directions in visible light.',
    'Counter-shading is for hiding in the dark — It cancels the shading of overhead light, so that in daylight the animal looks flat and so less like a solid body.'
  ],
  terms: [
    { term: 'One-way mirror', also: ['two-way mirror', 'half-silvered mirror'], def: 'A pane that partly reflects and partly transmits the light on both sides; it looks like a mirror from the brighter side and like a window from the darker one.' },
    { term: 'Lighting ratio', def: 'The ratio of the luminance of the bright side to that of the dark side, which decides which image dominates on a half-silvered pane.' },
    { term: 'Mirror box', def: 'A stage device in which mirrors at 45° reflect the side walls so that the observer sees an apparently empty space.' },
    { term: 'Counter-shading', def: 'Colouring that is darker on the side that gets more light, so that shading is cancelled and the body looks flat.' },
    { term: 'Paraxial cloak', def: 'A set of lenses that makes rays at small angles leave as if they had passed through free space, leaving a region between the lenses free of rays.' }
  ],
  formulas: [
    {
      name: 'Reflection against view through',
      expr: 'C = R*La/((1-R)*Lb)', tex: 'C = \\frac{R\\,L_a}{(1-R)\\,L_b}',
      vars: {
        C: { name: 'reflection of your own side ÷ the other side seen through' },
        R: { name: 'reflectance of the pane', q: 'ratio', unit: '%', value: 50, tex: 'R' },
        La: { name: 'luminance of your own side', q: 'luminance', unit: 'cd/m²', value: 500, tex: 'L_a' },
        Lb: { name: 'luminance of the other side', q: 'luminance', unit: 'cd/m²', value: 5, tex: 'L_b' }
      },
      solveFor: 'C',
      note: 'C ≫ 1: you see a mirror. C ≪ 1: you see a window. On the dark side, swap the two luminances.',
      stories: { C: 'A pane reflects {R}. Your side is lit to {La} and the other to {Lb}. How many times brighter is the reflection than the view through the glass?' }
    },
    {
      name: 'Middle spacing of a four-lens cloak',
      expr: 't2 = 2*f2*(f1 + f2)/(f1 - f2)', tex: 't_2 = \\frac{2 f_2 (f_1 + f_2)}{f_1 - f_2}',
      vars: {
        t2: { name: 'spacing between the two middle lenses', q: 'length', unit: 'mm', tex: 't_2' },
        f1: { name: 'focal length of the outer lenses', q: 'length', unit: 'mm', value: 200, tex: 'f_1' },
        f2: { name: 'focal length of the inner lenses', q: 'length', unit: 'mm', value: 75, tex: 'f_2' }
      },
      solveFor: 't2',
      note: 'The outer spacings are f₁ + f₂. The total length is 2(f₁ + f₂) + t₂, and the four lenses together act as that length of free space.',
      stories: { t2: 'A four-lens paraxial cloak uses lenses of {f1} and {f2}. How far apart must the two middle lenses be?' }
    }
  ],
  examples: [
    {
      title: 'Which side sees what?',
      q: 'A pane reflects 40 % and transmits 60 %. The interview room is at 300 cd/m² and the observation room at 3 cd/m². What does each side see?',
      steps: [
        { text: 'Interview room: the reflection against the view through is', tex: 'C = \\frac{0.4\\times300}{0.6\\times3} = 67' },
        { text: 'Observation room: the view through (0.6 × 300 = 180) against its own reflection (0.4 × 3 = 1.2):', tex: '\\frac{180}{1.2} = 150' }
      ],
      a: 'The interview room sees a mirror (67 to 1), the observation room a window (150 to 1).'
    }
  ],
  quiz: [
    { q: 'Which side of a half-silvered pane sees through it?', choices: ['The darker side', 'The brighter side', 'Both always', 'Neither'], a: 0, why: 'From the dark side, the transmitted light of the bright room is much stronger than the reflection of the dark room.' },
    { q: 'A pane reflects 50 %. Your room is 500 cd/m², the other 5 cd/m². By what factor does the reflection outshine the view through? (R = T = 0.5)', answer: 100, why: '0.5 × 500 = 250 against 0.5 × 5 = 2.5: a factor of 100.' },
    { q: 'The lights go on in the dark room, bringing it to the same brightness as the bright one. What do the two sides see?', choices: ['Each sees the other room with equally strong reflections of its own', 'A mirror on both sides', 'A window on both sides with no reflection', 'Nothing'], a: 0, why: 'With equal luminances, reflection and view-through are equal on both sides: R·L against T·L.' },
    { q: 'For f₁ = 200 mm and f₂ = 75 mm, what is the spacing between the middle lenses of the four-lens cloak, in mm?', answer: 330, unit: 'mm', why: 't₂ = 2·75·275/125 = 330 mm.' },
    { q: 'A one-way mirror lets light through in one direction only.', a: false, why: 'It is a symmetric partial reflector; the apparent one-way effect depends only on the lighting.' }
  ],
  applications: [
    'Interview and observation rooms, retail security and focus-group studios, which all depend on keeping one side dark.',
    'Mirror TVs, bathroom mirrors with displays and car rear-view mirrors with a hidden screen or camera.',
    'Stage magic and set design: mirror boxes and ghosts.',
    'Research on cloaking, camouflage and transparency, from optical design to materials and military coatings.'
  ],
  history: 'The mirror-box "Sphinx" of the 1860s showed a talking head on an apparently empty table. Abbott Thayer described the counter-shading of animals in 1896, and warships of the First World War were painted in "dazzle" patterns that broke up their outlines. Microwave cloaks based on a theory of Pendry, Schurig and Smith were demonstrated in 2006, and a four-lens paraxial cloak was shown by John Howell and Joseph Choi at the University of Rochester in 2014.',
  sources: [
    'J. S. Choi and J. C. Howell, "Paraxial ray optics cloaking", *Optics Express* 22 (2014).',
    'J. B. Pendry, D. Schurig and D. R. Smith, "Controlling electromagnetic fields", *Science* 312 (2006) 1780.',
    'H. B. Cott, *Adaptive Coloration in Animals* (Methuen, 1940) — counter-shading and disruptive patterns.'
  ],
  sim: { id: 'ph-pane', params: { mode: 'oneway' } }
},

/* ================================================================ the Moon illusion */
{
  id: 'the-moon-illusion-and-size-constancy', parent: 'optical-phenomena', title: 'The Moon illusion', level: 1,
  short: 'The Moon looks far bigger near the horizon than high in the sky, but measured with a coin, a photograph or a camera it is the same size, and a little smaller at the horizon. The illusion lives in how the brain judges size from angle and apparent distance; it is not made by the atmosphere.',
  keywords: ['Moon illusion', 'horizon Moon', 'size constancy', 'apparent distance', 'size-distance invariance', 'Emmert\'s law', 'angular size', 'perigee', 'supermoon', 'refraction', 'Ponzo illusion'],
  prereq: ['depth-and-perspective-illusions', 'atmospheric-refraction', 'the-eye-as-a-camera'],
  related: ['size-and-length-illusions', 'perspective-and-focal-length', 'mirages-and-looming', 'what-an-optical-illusion-is'],
  body: `
Go out when the full Moon rises, and it fills the sky over the roofs. Three hours later, high up, it is a small pale coin. The Moon is the same size in both places, and you can prove it in half a minute.

### Measure it
The Moon is 3475 km across and, on average, 384 400 km away, so it subtends

$$\\theta = 2\\arctan\\frac{D}{2d} = 0.518° \\approx 31'$$

Hold a lentil or a small pea (6 mm) at arm's length (70 cm): it just covers the Moon whether the Moon is low or high. A photograph of the horizon Moon has the same disc size as one of the high Moon. The distance varies by orbit: 356 500 km at perigee (0.558°), 406 700 km at apogee (0.490°), a change of 14 % in diameter, far greater than anything between horizon and zenith, yet no "supermoon" looks as big as a horizon Moon.

### It is not the atmosphere
At the horizon the Moon is in fact *smaller*. An observer on the Earth's surface is a whole Earth radius (6371 km) closer to a Moon at the zenith than to one at the horizon; the horizon Moon is 1.7 % farther away, and 1.7 % smaller in angle. Refraction does something too: it lifts the lower limb more than the upper, so the horizon Moon is squashed vertically by about a sixth, an oval, not a larger disc. And none of this explains why the effect *disappears* if you look at the horizon Moon through a rolled-up sheet of paper.

### Size constancy
The picture on the retina of a person shrinks in proportion to distance: a 1.8 m figure subtends 10.3° at 10 m and 5.2° at 20 m. Yet the person does not seem to shrink. The visual system uses the apparent distance to correct the retinal size: perceived size = angle × apparent distance, which for small angles is

$$S' = 2\\,d'\\tan\\frac{\\theta}{2}$$

This is **size constancy**, and in the leading account of the Moon illusion it is also the cause. Over a landscape, the horizon sky carries many depth cues (trees, houses, hills) and appears far away; the zenith sky has none, and appears near, as a flattened dome. The same 0.52° at a greater apparent distance is read as a bigger object: in experiments, people judge the horizon Moon to be between roughly 1.2 and 1.7 times as large as the high one, depending on method.

### Other pieces
Comparison with the objects on the horizon (a Moon beside a distant tree looks large), the angle at which the eyes are lifted, and the way people judge the size of a sky object may all contribute. The same illusion shows for the Sun and the constellations, and it resembles the Ponzo illusion ([[depth-and-perspective-illusions]]), in which two equal bars between converging lines look different. No account is complete.

> [!key] The Moon subtends 0.52° wherever it is, and is 1.7 % smaller at the horizon. The illusion is in the brain: the same angle seen over a distant-looking landscape is judged as a larger object.
`,
  ideas: [
    'The Moon subtends 0.52°, the same at the horizon and the zenith (a little less at the horizon).',
    'A coin at arm\'s length, or a photograph, shows it directly.',
    'The horizon Moon is 1.7 % smaller, because it is about an Earth radius farther away.',
    'Refraction flattens the horizon Moon vertically but does not enlarge it.',
    'The leading account is size–distance judgement: the horizon sky appears farther, so the same angle seems a bigger object.'
  ],
  pitfalls: [
    'The atmosphere magnifies the Moon at the horizon — Refraction changes the shape slightly (flatter), not the size; photographs show the same disc.',
    'The Moon is nearer to us at the horizon — It is farther by about one Earth radius (1.7 %): the illusion is made in the brain.',
    'There is a proven single cause — The apparent-distance account is the most cited, but several factors probably combine, and researchers still disagree.',
    'You cannot do anything about it — A tube, a cut-out or a coin held at arm\'s length removes the surroundings or gives a measure, and the illusion shrinks or goes.'
  ],
  terms: [
    { term: 'Angular size', def: 'The angle an object subtends at the eye: 2·atan(D/2d). The Moon is about 0.5° across.' },
    { term: 'Size constancy', def: 'The tendency to see an object as having the same size as its distance changes, although its retinal image changes in proportion.' },
    { term: 'Size–distance invariance', also: ['Emmert\'s law'], def: 'The rule that perceived size is proportional to the angular size times the apparent distance.' },
    { term: 'Perigee', also: ['apogee'], def: 'The closest (perigee) and the farthest (apogee) point of the Moon\'s orbit, 356 500 km and 406 700 km.' },
    { term: 'Apparent distance', def: 'The distance an object seems to have, which depends on depth cues; it need not agree with the true distance.' }
  ],
  formulas: [
    {
      name: 'Angular size',
      expr: 'th = 2*atan(D/(2*L))', tex: '\\theta = 2\\arctan\\frac{D}{2L}',
      vars: {
        th: { name: 'angular size', q: 'angle', unit: '°', tex: '\\theta' },
        D: { name: 'diameter of the object', q: 'length', unit: 'km', value: 3474.8, tex: 'D' },
        L: { name: 'distance to the object', q: 'length', unit: 'km', value: 384400, tex: 'L' }
      },
      solveFor: 'th',
      note: 'The same for a Moon of 3475 km at 384 400 km and a coin of 6.4 mm at 70 cm.',
      stories: { th: 'An object {D} across is {L} away. What angle does it subtend?' }
    },
    {
      name: 'Perceived size',
      expr: 'S = 2*Lp*tan(th/2)', tex: 'S\' = 2\\,L_p\\tan\\frac{\\theta}{2}',
      vars: {
        S: { name: 'perceived size', q: 'length', unit: 'm', tex: 'S\'' },
        Lp: { name: 'apparent distance', q: 'length', unit: 'm', value: 20, tex: 'L_p' },
        th: { name: 'angular size', q: 'angle', unit: '°', value: 5.15, min: 0.01, max: 60, tex: '\\theta' }
      },
      solveFor: 'S',
      note: 'Size–distance invariance: at the same angle, a larger apparent distance gives a larger perceived size.',
      stories: { S: 'An object subtends {th} and seems to be {Lp} away. What size does it seem to have?' }
    }
  ],
  examples: [
    {
      title: 'The coin that covers the Moon',
      q: 'How big must a coin be to cover the Moon (0.518°) when held at 70 cm?',
      steps: [{ text: 'Diameter at distance $L$:', tex: 'D = 2L\\tan\\frac{\\theta}{2} = 2\\times700\\ \\mathrm{mm}\\times\\tan 0.259° = 6.3\\ \\mathrm{mm}' }],
      a: 'About 6.3 mm, a lentil or a small pea: the same for the horizon Moon and the zenith Moon.'
    },
    {
      title: 'How much farther is the horizon Moon?',
      q: 'The Moon is 384 400 km from the Earth\'s centre and the observer stands on the surface (6371 km from the centre). Compare the distance to the Moon at the zenith with that at the horizon.',
      steps: [
        'Zenith: 384 400 − 6371 = 378 029 km.',
        { text: 'Horizon (right angle at the observer):', tex: '\\sqrt{384\\,400^2 - 6371^2} = 384\\,347\\ \\mathrm{km}' },
        'The ratio is 384 347 / 378 029 = 1.017.'
      ],
      a: 'The horizon Moon is 1.7 % farther, and so 1.7 % smaller in angle: 0.518° against 0.527°.'
    }
  ],
  quiz: [
    { q: 'The Moon (3475 km across, 384 400 km away) subtends about…', choices: ['0.5°', '5°', '0.05°', '2°'], a: 0, why: '2 atan(3475/(2 × 384 400)) = 0.518°.' },
    { q: 'Compared with the Moon high in the sky, the Moon on the horizon is, in angle…', choices: ['slightly smaller', 'about 1.5 times larger', 'exactly equal always', 'twice as large'], a: 0, why: 'It is about an Earth radius farther away (1.7 %), so a little smaller; the larger look is in the perception.' },
    { q: 'A 1.8 m person walks from 10 m to 20 m. By what factor does the angle they subtend change?', answer: 0.5, why: 'The angle is nearly inversely proportional to the distance: 10.3° at 10 m and 5.2° at 20 m, a factor of 0.5.' },
    { q: 'Atmospheric refraction makes the horizon Moon look bigger.', a: false, why: 'Refraction squashes it vertically by about a sixth; it does not enlarge it, and the effect shows in the horizontal direction too.' },
    { q: 'According to the apparent-distance account, the horizon Moon looks bigger because…', choices: ['the same angle at a greater apparent distance is read as a larger object', 'it is closer', 'the air magnifies it', 'the eye focuses differently'], a: 0, why: 'Size is estimated as angle × apparent distance; the horizon sky, full of depth cues, looks farther than the empty zenith.' }
  ],
  applications: [
    'Photography: the horizon Moon looks small and disappointing in pictures, which is the real angular size; photographers use long lenses to place it beside a distant landmark.',
    'Safety and design: apparent size and distance misjudgments affect drivers and pilots (see [[illusions-in-design-and-safety]]).',
    'Vision science: the illusion is a standard test of the theory of size–distance judgement.',
    'Astronomy teaching: a way to explain angular size and the measure of the sky.'
  ],
  history: 'Aristotle and Ptolemy knew the illusion. Ptolemy blamed refraction in moist air near the horizon, which is wrong. Ibn al-Haytham (Alhazen), around the year 1030, gave the explanation in terms of apparent distance, which is still the leading account. Experiments of the twentieth century, such as those of Rock and Kaufman in the 1960s, used artificial Moons seen across terrain to test it.',
  sources: [
    'L. Kaufman and J. H. Kaufman, "Explaining the moon illusion", *Proceedings of the National Academy of Sciences* 97 (2000).',
    'H. E. Ross and C. Plug, *The Mystery of the Moon Illusion* (Oxford University Press, 2002).',
    'M. Hershenson (ed.), *The Moon Illusion* (Lawrence Erlbaum, 1989).'
  ],
  sim: 'ph-moon'
}

);
