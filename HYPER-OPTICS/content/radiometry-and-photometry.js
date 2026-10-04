/* HYPER-OPTICS · content/radiometry-and-photometry.js — the topic "Measuring light" (simulation prefix rp-)
 *   radiometric-quantities, photometric-quantities, the-luminosity-function, lumens-candelas-lux-and-nits,
 *   inverse-square-and-cosine-laws, lambertian-surfaces, radiance-and-its-conservation, etendue,
 *   the-integrating-sphere, measuring-light, illuminance-levels-in-practice
 */
Hyper.add(

/* ================================================================ radiometric quantities */
{
  id: 'radiometric-quantities', parent: 'radiometry-and-photometry', title: 'Radiometric quantities: flux, intensity, irradiance, radiance', level: 1,
  short: 'Radiometry counts light as energy. Four quantities answer four different questions: radiant flux is the total power, radiant intensity is that power per steradian, irradiance is the power landing on each square metre, and radiance is the power per square metre per steradian along one ray. Every light budget starts by deciding which of them it is about.',
  keywords: ['radiometry', 'radiant flux', 'radiant power', 'radiant intensity', 'irradiance', 'radiant exitance', 'radiance', 'watt', 'steradian', 'solid angle', 'W/sr', 'W/m2', 'W/(m2 sr)', 'spectral irradiance', 'radiant energy', 'flux density'],
  prereq: ['what-is-light', 'the-optical-spectrum', 'light-sources-and-beams'],
  related: ['photometric-quantities', 'radiance-and-its-conservation', 'inverse-square-and-cosine-laws', 'etendue', 'lambertian-surfaces', 'physics:light-intensity', 'physics:em-spectrum'],
  body: `
Light carries energy, and much of optics is bookkeeping: where does that energy go, and how much of it arrives? A torch, a laser pointer and a patch of sky can each radiate a few watts, yet one floods a room, one is a pin and one fills a hemisphere. **Radiometry** tells them apart with four quantities, each a power divided by something.

### From energy to radiance
Start with the **radiant flux** $\\Phi$, the power in watts: all the light leaving a source or crossing a surface. Then divide it, once or twice, by an area or a solid angle:

| Quantity | Symbol | What the flux is divided by | Unit | The question it answers |
|---|---|---|---|---|
| Radiant flux | $\\Phi$ | nothing: the total | W | How much light is there in all? |
| Radiant intensity | $I$ | solid angle | W/sr | How strongly does the source shine this way? |
| Irradiance | $E$ | area receiving it | W/m² | How much lands here? |
| Radiant exitance | $M$ | area emitting it | W/m² | How much does this surface give off? |
| Radiance | $L$ | area and solid angle | W/(m²·sr) | How bright is that source, seen from here? |

### The steradian
A **solid angle** measures a cone of directions as a plane angle measures a wedge. One steradian (sr) is the cone that cuts an area $r^2$ from a sphere of radius $r$, so $\\Omega = A/r^2$. A whole sphere is $4\\pi$ sr, a hemisphere $2\\pi$ sr, and a cone of half-angle $\\theta$ is

$$\\Omega = 2\\pi\\,(1 - \\cos\\theta)$$

The Sun, 0.53° across, fills only $6.8\\times10^{-5}$ sr; a torch beam of 10° half-angle fills 0.095 sr.

### Intensity: power per steradian
Take a source small enough to count as a point and ask how its flux divides among directions. A 5 W infrared illuminator whose light fills a cone of 30° half-angle spreads over 0.84 sr, so on average $I = 5/0.84 = 5.9$ W/sr. Intensity belongs to the *source*; it says nothing about how far away you stand.

### Irradiance: power per square metre
Hold a card in that beam and ask how much flux each square metre of it receives. At 10 m the illuminator gives $E = I/d^2 = 59$ mW/m². Irradiance does depend on distance ([[inverse-square-and-cosine-laws]]) and on the tilt of the card. Sunshine above the atmosphere brings 1361 W/m²; about 1000 W/m² reaches the ground at noon under a clear sky.

### Radiance: what the eye and a camera compare
Intensity and irradiance both change as you walk away. **Radiance** does not, along a ray in clear air. It divides the flux by the area of the source *as seen from the viewing direction* and by the solid angle the light is collected in:

$$L = \\frac{\\mathrm{d}^2\\Phi}{\\mathrm{d}A\\,\\cos\\theta\\,\\mathrm{d}\\Omega}$$

with $\\theta$ the angle between the viewing direction and the surface normal. Step back from a wall: less light reaches your eye, but the wall also looks smaller, and the two changes cancel. Radiance is the brightness of a source or of an image, and no passive lens can raise it ([[radiance-and-its-conservation]]). The Sun's radiance is its irradiance at the Earth divided by the solid angle of its disc: $1361/6.8\\times10^{-5} = 2\\times10^{7}$ W/(m²·sr).

### Per nanometre
Every quantity also has a **spectral** form, per unit of wavelength, such as spectral irradiance in W/(m²·nm). A laser's milliwatt sits inside a fraction of a nanometre; the Sun's light is spread over more than a thousand. The totals above are the spectral values added up over all wavelengths.

> [!note] Radiometry works at every wavelength, visible or not. Weighted by what the eye sees, the same quantities become [[photometric-quantities|photometric]]: lumens, candelas, lux and nits.

> [!key] Flux is the total; intensity is flux per steradian; irradiance is flux per square metre arriving; radiance is flux per square metre per steradian along a ray. Of the four, only radiance is unchanged by distance.
`,
  ideas: [
    'Radiant flux is the total power in watts; intensity, irradiance and radiance divide it by solid angle, by area, or by both.',
    'A cone of half-angle θ spans Ω = 2π(1 − cos θ) steradians; a whole sphere is 4π sr.',
    'Intensity describes a source, irradiance describes a surface that receives light, radiance describes a ray.',
    'Irradiance falls with distance, intensity does not, and radiance stays the same along a ray in clear air.',
    'Every quantity has a spectral version per nanometre; the totals are those added up over wavelength.'
  ],
  pitfalls: [
    'Intensity means how bright something is — In radiometry intensity is one specific quantity, flux per steradian (W/sr). The brightness the eye compares follows radiance. Everyday writing, and some physics texts, use "intensity" for W/m², which radiometry calls irradiance.',
    'More watts always means more light on the target — Flux is only the total. A 5 W spotlight can put far more irradiance on a card than a 50 W floodlight, because it sends its power into a narrower cone.',
    'A distant source has less radiance — Radiance does not change along a ray in clear air. A distant lamp delivers less irradiance because it fills a smaller solid angle of your view, not because each part of it is dimmer.',
    'Radiometric quantities describe visible light — They cover every wavelength, ultraviolet and infrared included. Only the photometric versions weight the light by the eye.'
  ],
  terms: [
    { term: 'Radiant flux', also: ['radiant power'], def: 'The power carried by light, in watts: the total leaving a source or crossing a surface, whatever the directions and whatever the wavelengths.' },
    { term: 'Radiant intensity', def: 'The radiant flux a source sends into one direction per unit of solid angle, in W/sr. It is defined for a source small enough to be treated as a point.' },
    { term: 'Irradiance', also: ['flux density'], def: 'The radiant flux arriving on a surface per unit of its area, in W/m². It depends on the distance from the source and on the tilt of the surface.' },
    { term: 'Radiant exitance', also: ['radiosity'], def: 'The radiant flux leaving a surface per unit of its area, in W/m², emitted or reflected. Irradiance is the same quantity for light going in.' },
    { term: 'Radiance', def: 'The radiant flux per unit of projected source area per unit of solid angle, in W/(m²·sr). It describes the brightness of a source or an image along one direction and does not change with distance.' },
    { term: 'Solid angle', also: ['steradian', 'sr'], def: 'The measure of a cone of directions: the area it cuts from a sphere divided by the square of the sphere\'s radius. A whole sphere is 4π sr, a hemisphere 2π sr.' },
    { term: 'Projected area', def: 'The area of a surface as seen from a given direction: A cos θ for a flat surface of area A viewed at an angle θ from its normal. Radiance is defined per unit of projected area.' }
  ],
  formulas: [
    {
      name: 'Solid angle of a cone',
      expr: 'Om = 2*pi*(1 - cos(th))', tex: '\\Omega = 2\\pi\\,(1 - \\cos\\theta)',
      vars: {
        Om: { name: 'solid angle', q: 'solidangle', unit: 'sr', tex: '\\Omega' },
        th: { name: 'half-angle of the cone', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'A half-angle of 90° is a hemisphere (2π sr), 180° the whole sphere (4π sr).',
      stories: { Om: 'A beam fills a cone of {th} half-angle. How many steradians is that?', th: 'A beam fills {Om}. What is the half-angle of its cone?' }
    },
    {
      name: 'Radiant intensity of a source',
      expr: 'I = Phi/Om', tex: 'I = \\frac{\\Phi}{\\Omega}',
      vars: {
        I: { name: 'radiant intensity', q: 'radintensity', unit: 'W/sr' },
        Phi: { name: 'radiant flux', q: 'power', unit: 'W', value: 5, tex: '\\Phi' },
        Om: { name: 'solid angle it is spread over', q: 'solidangle', unit: 'sr', value: 0.84, tex: '\\Omega' }
      },
      note: 'The average over the cone; the light is assumed to fill it evenly.',
      stories: { I: 'A source radiates {Phi} evenly into {Om}. What is its radiant intensity?' }
    },
    {
      name: 'Irradiance on the axis of a point source',
      expr: 'E = I/d^2', tex: 'E = \\frac{I}{d^2}',
      vars: {
        E: { name: 'irradiance', q: 'intensity', unit: 'W/m²' },
        I: { name: 'radiant intensity', q: 'radintensity', unit: 'W/sr', value: 5.9 },
        d: { name: 'distance from the source', q: 'length', unit: 'm', value: 10 }
      },
      note: 'For a card held square to the beam. Tilt it and the cosine law applies (see the inverse-square and cosine laws).',
      stories: { E: 'A source of {I} lights a card {d} away, held square to the beam. What is the irradiance?' }
    },
    {
      name: 'Radiance of a source',
      expr: 'L = Phi/(A*Om*cos(th))', tex: 'L = \\frac{\\Phi}{A\\,\\Omega\\cos\\theta}',
      vars: {
        L: { name: 'radiance', q: 'radiance', unit: 'W/(m²·sr)' },
        Phi: { name: 'radiant flux', q: 'power', unit: 'W', value: 1, tex: '\\Phi' },
        A: { name: 'area of the source', q: 'area', unit: 'cm²', value: 10 },
        Om: { name: 'solid angle of the light', q: 'solidangle', unit: 'sr', value: 0.5, tex: '\\Omega' },
        th: { name: 'angle between viewing direction and surface normal', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'For a small piece of a source, or a source whose light is even over the solid angle. Viewed along the normal θ = 0.',
      stories: { L: 'A flat source of {A} sends {Phi} into {Om}, seen at {th} from its normal. What is its radiance?' }
    }
  ],
  examples: [
    {
      title: 'An infrared illuminator for a security camera',
      q: 'A camera illuminator radiates 5 W of infrared evenly into a cone of 30° half-angle. What are its radiant intensity and the irradiance on a wall 10 m away, square to the beam?',
      steps: [
        { text: 'The solid angle of the cone:', tex: '\\Omega = 2\\pi\\,(1 - \\cos 30°) = 2\\pi \\times 0.134 = 0.842\\ \\mathrm{sr}' },
        { text: 'The intensity is the flux divided by it:', tex: 'I = \\frac{5\\ \\mathrm{W}}{0.842\\ \\mathrm{sr}} = 5.94\\ \\mathrm{W/sr}' },
        { text: 'At 10 m, on the axis:', tex: 'E = \\frac{I}{d^2} = \\frac{5.94}{100} = 0.0594\\ \\mathrm{W/m^2}' }
      ],
      a: 'I = 5.9 W/sr, E = 59 mW/m². Move the wall to 5 m and the irradiance rises fourfold to 0.24 W/m².'
    },
    {
      title: 'The radiance of the Sun',
      q: 'The Sun gives 1361 W/m² above the atmosphere and its disc is 0.53° across. What is its radiance?',
      steps: [
        { text: 'Half the angular diameter is 0.2665° = 4.65 mrad. For a small cone $\\Omega \\approx \\pi\\theta^2$:', tex: '\\Omega = \\pi\\,(4.65\\times10^{-3})^2 = 6.8\\times10^{-5}\\ \\mathrm{sr}' },
        { text: 'The irradiance is the radiance times the solid angle of the source (the disc faces us), so', tex: 'L = \\frac{E}{\\Omega} = \\frac{1361}{6.8\\times10^{-5}} = 2.0\\times10^{7}\\ \\mathrm{W/(m^2\\,sr)}' }
      ],
      a: 'About 2 × 10⁷ W/(m²·sr), the same wherever you measure it from, from Mercury or from Neptune. Only the solid angle of the disc, and so the irradiance, changes with distance.'
    }
  ],
  quiz: [
    { q: 'A small lamp is moved from 1 m to 2 m from a wall. Which quantity of the lamp-and-wall pair falls to one quarter?', choices: ['The radiant flux of the lamp', 'The radiant intensity of the lamp', 'The irradiance on the wall', 'The radiance of the lamp'], a: 2, why: 'The lamp still radiates the same total (flux) and, in each direction, the same power per steradian (intensity), and its radiance is unchanged. The same flux now falls on four times the area of wall, so the irradiance drops to a quarter.' },
    { q: 'A 2 W beam lights a spot of area 4 cm² on a card. What is the irradiance, in W/m²?', answer: 5000, unit: 'W/m²', why: '$E = \\Phi/A = 2\\ \\mathrm{W}/(4\\times10^{-4}\\ \\mathrm{m^2}) = 5000$ W/m², five times the irradiance of noon sunshine.' },
    { q: 'The radiance of a wall seen from 1 m is 16 times its radiance seen from 4 m.', a: false, why: 'Radiance is unchanged by distance in clear air. From 4 m the light reaching the eye is 16 times less, but the wall also fills a 16 times smaller solid angle, and the ratio is the same.' },
    { q: 'A lamp sends 8 W evenly into a hemisphere (2π sr). What is its radiant intensity, in W/sr?', answer: 1.273, unit: 'W/sr', why: '$I = \\Phi/\\Omega = 8/(2\\pi) = 1.27$ W/sr. A hemisphere is 2π sr, not π.' },
    { q: 'Which is the unit of radiance?', choices: ['W/m²', 'W/sr', 'W/(m²·sr)', 'W·sr/m²'], a: 2, why: 'Radiance divides the flux by both an area and a solid angle. W/m² is irradiance or exitance, and W/sr is intensity.' }
  ],
  applications: [
    'Solar energy: a pyranometer reads irradiance in W/m², and panels are rated at a standard 1000 W/m².',
    'Laser safety limits are written as irradiance and as radiant exposure (J/m²), because what the retina or skin receives per unit area is what injures it.',
    'Thermal cameras and remote sensing: a satellite or an infrared camera measures the radiance of the scene, in W/(m²·sr) per micrometre, and infers temperature from it.',
    'Infrared and ultraviolet lighting, from security illuminators to curing lamps, is specified radiometrically because the eye cannot judge it.'
  ],
  history: 'The measurement of light as an amount began with Pierre Bouguer\'s *Essai d\'optique sur la gradation de la lumière* (1729) and Johann Heinrich Lambert\'s *Photometria* (1760). The modern names, with radiance as the central quantity, were fixed in the twentieth century by the international lighting vocabulary.',
  sources: [
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — the quantities and their definitions.',
    'J. M. Palmer and B. G. Grant, *The Art of Radiometry* (SPIE Press, 2009).',
    'CIE S 017/E:2020, *ILV: International Lighting Vocabulary* — the official names, symbols and units.'
  ],
  sim: { id: 'rp-quantities', params: { view: 'radiometric' } }
},

/* ================================================================ photometric quantities */
{
  id: 'photometric-quantities', parent: 'radiometry-and-photometry', title: 'Photometric quantities', level: 1,
  short: 'Photometry is radiometry weighted by the eye. Each radiometric quantity has a photometric twin that counts only as much of every wavelength as a standard observer sees: radiant flux (W) becomes luminous flux (lm), radiant intensity becomes luminous intensity (cd), irradiance becomes illuminance (lx) and radiance becomes luminance (cd/m², the nit).',
  keywords: ['photometry', 'luminous flux', 'lumen', 'luminous intensity', 'candela', 'illuminance', 'lux', 'luminance', 'nit', 'cd/m2', 'luminous exitance', 'foot-candle', 'foot-lambert', 'photopic', '683 lm/W', 'brightness'],
  prereq: ['radiometric-quantities', 'the-optical-spectrum'],
  related: ['the-luminosity-function', 'lumens-candelas-lux-and-nits', 'cie-colour-matching-and-xyz', 'lamp-efficacy-and-lifetime', 'physics:light-intensity'],
  body: `
A 1 W infrared lamp and a 1 W green lamp radiate the same power, yet one lights a room and the other leaves it dark. Radiometry counts watts; the eye does not. **Photometry** is radiometry for the human eye: the same quantities, but every wavelength counts only as much as a standard observer sees it.

### The twin of every quantity
| Radiometric | Unit | Photometric | Unit |
|---|---|---|---|
| Radiant flux $\\Phi_e$ | W | **Luminous flux** $\\Phi_v$ | lumen, lm |
| Radiant intensity $I_e$ | W/sr | **Luminous intensity** $I_v$ | candela, cd = lm/sr |
| Irradiance $E_e$ | W/m² | **Illuminance** $E_v$ | lux, lx = lm/m² |
| Radiant exitance $M_e$ | W/m² | Luminous exitance $M_v$ | lm/m² |
| Radiance $L_e$ | W/(m²·sr) | **Luminance** $L_v$ | cd/m², the "nit" |

The subscripts $e$ (energy) and $v$ (visual) keep the two families apart when both appear in one equation, and are dropped when it is clear which is meant. The lumen is a candela times a steradian, and the lux is a lumen per square metre, just as the watt per steradian and the watt per square metre are built.

### From watts to lumens
For light of a single wavelength the conversion is one multiplication:

$$\\Phi_v = K_m\\,V(\\lambda)\\,\\Phi_e, \\qquad K_m = 683\\ \\mathrm{lm/W}$$

$V(\\lambda)$ is the [[the-luminosity-function|luminosity function]]: the sensitivity of the eye relative to its peak, which is 1 at 555 nm. One watt of green light at 555 nm is 683 lm. One watt of blue at 450 nm is 26 lm, one watt of red at 650 nm is 73 lm, and a watt of infrared or ultraviolet is 0 lm, because the eye cannot see it.

For a mixture of wavelengths, add up the lumens of each colour. There is therefore no single factor from watts to lumens for light in general: a lamp's lumens per watt depends on its spectrum.

### Why the candela is the base unit
Of the photometric units only the **candela** is an SI base unit. Since 2019 it is fixed by declaring that light of 540 THz, a wavelength of about 555 nm, has a luminous efficacy of exactly 683 lm/W. The lumen and the lux follow from it.

### Units you will meet
American practice still uses the **foot-candle** for illuminance (1 fc = 10.76 lx) and the **foot-lambert** for luminance (1 fL = 3.43 cd/m²). Cinema screens are set to 14 fL, which is 48 cd/m². Displays are rated in nits: a phone in sunlight needs 1000 or more, a reference monitor is run at 80 to 120.

### Day, night, and things that are not the eye
Unless a document says otherwise, "lumen" means the **photopic** lumen, weighted for the cone vision of bright light. A night-vision (scotopic) version exists with its own curve and 1700 lm/W at its peak, and is rarely used outside vision research. Other sensors have their own weightings in the same spirit: plants are measured in photons between 400 and 700 nm, skin in ultraviolet weighted by its power to redden it. The eye's weighting is only right for the eye.

> [!key] Photometry is radiometry weighted by $V(\\lambda)$: watts become lumens, W/sr become candelas, W/m² become lux, W/(m²·sr) become nits. The rate of 683 lm/W holds at 555 nm only.
`,
  ideas: [
    'Each radiometric quantity has a photometric twin: W → lm, W/sr → cd, W/m² → lx, W/(m²·sr) → cd/m².',
    'Weighting is by the luminosity function V(λ): 683 lm per watt at 555 nm, much less in blue and red, nothing in the infrared or ultraviolet.',
    'For a mixed spectrum the lumens of each colour add; there is no single lumens-per-watt factor.',
    'The candela is the SI base unit; lumen (cd·sr) and lux (lm/m²) are derived from it.',
    'Unless stated otherwise, photometric units are photopic, for the bright-light eye.'
  ],
  pitfalls: [
    'A lumen is just a watt of visible light — A watt of light is 683 lumens only at 555 nm. A watt of deep red is a few lumens, a watt of infrared none. Lumens measure how much the eye sees.',
    'Two lamps with the same lumens give the same light on the desk — Lumens are the total. A lamp that sends them into a narrow beam gives far more lux on a small area than one that spreads them evenly. The intensity (candelas) shows the difference.',
    'Lux, candela and nit are interchangeable "brightness" units — They answer different questions: lux is light arriving on a surface, candela is the strength of a source in one direction, and the nit is how bright a surface or screen looks.',
    'Photometric units apply to any light — They are defined for human vision. For a camera, a plant or a detector that is not tuned to the eye, use radiometric units, or weight with that sensor\'s own response.'
  ],
  terms: [
    { term: 'Luminous flux', also: ['luminous power'], def: 'The radiant flux weighted by the luminosity function: the total light output measured as the eye sees it. Its unit is the lumen.' },
    { term: 'Luminous intensity', def: 'The luminous flux a source sends into one direction per unit of solid angle: 1 cd = 1 lm/sr. The candela is the SI base unit of photometry.' },
    { term: 'Illuminance', also: ['foot-candle'], def: 'The luminous flux arriving on a surface per unit of its area: 1 lx = 1 lm/m². One foot-candle is 10.76 lx.' },
    { term: 'Luminance', also: ['foot-lambert'], def: 'The luminous intensity per unit of projected source area in a given direction, in cd/m². It is the photometric radiance and how bright a surface or a screen looks.' },
    { term: 'Luminous efficacy', also: ['lm/W', 'efficacy'], def: 'Lumens per watt. For light of one wavelength it is 683 × V(λ) lm/W; for a lamp it is the lumens produced per watt of radiation or per watt of electricity, which are different numbers.' },
    { term: 'Photopic', also: ['bright-light vision', 'cone vision'], def: 'Vision at high luminance, above a few cd/m², served by the cones. Unless stated otherwise, photometric units are photopic.' }
  ],
  formulas: [
    {
      name: 'Luminous flux of monochromatic light',
      expr: 'Fv = Km*V*Fe', tex: '\\Phi_v = K_m\\,V\\,\\Phi_e',
      vars: {
        Fv: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi_v' },
        Km: { const: 'Km' },
        V: { name: 'luminosity function V(λ) at the wavelength', value: 0.107, min: 0, max: 1 },
        Fe: { name: 'radiant flux', q: 'power', unit: 'W', value: 1, tex: '\\Phi_e' }
      },
      note: 'One wavelength only. V is 1 at 555 nm, 0.107 at 650 nm and 0.038 at 450 nm.',
      stories: { Fv: 'A red LED radiates {Fe} at a wavelength where the eye\'s sensitivity is {V}. How many lumens is that?', Fe: 'How much radiant power does a light of {Fv} need if it is at a wavelength where the sensitivity is {V}?' }
    },
    {
      name: 'Illuminance from flux on an area',
      expr: 'Ev = Fv/A', tex: 'E_v = \\frac{\\Phi_v}{A}',
      vars: {
        Ev: { name: 'illuminance', q: 'illuminance', unit: 'lx', tex: 'E_v' },
        Fv: { name: 'luminous flux landing on the surface', q: 'luminousflux', unit: 'lm', value: 800, tex: '\\Phi_v' },
        A: { name: 'area of the surface', q: 'area', unit: 'm²', value: 4 }
      },
      note: 'The average over the area; the light must actually arrive on it.',
      stories: { Ev: '{Fv} falls evenly on a surface of {A}. What is the illuminance?' }
    },
    {
      name: 'Luminance of a source seen at an angle',
      expr: 'Lv = Iv/(A*cos(th))', tex: 'L_v = \\frac{I_v}{A\\cos\\theta}',
      vars: {
        Lv: { name: 'luminance', q: 'luminance', unit: 'cd/m²', tex: 'L_v' },
        Iv: { name: 'luminous intensity in the viewing direction', q: 'luminousint', unit: 'cd', value: 20, tex: 'I_v' },
        A: { name: 'area of the emitting surface', q: 'area', unit: 'cm²', value: 670 },
        th: { name: 'viewing angle from the surface normal', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'The projected area is A cos θ. The default is a 15-inch laptop screen seen head-on.',
      stories: { Lv: 'A surface of {A} sends {Iv} towards a viewer who sees it {th} off its normal. What is its luminance?' }
    }
  ],
  examples: [
    {
      title: 'Equal watts, unequal lumens',
      q: 'A blue LED chip radiates 1 W at 450 nm and a green one radiates 1 W at 555 nm. How many lumens does each give?',
      steps: [
        'At 555 nm $V = 1$, so $\\Phi_v = 683 \\times 1 \\times 1\\ \\mathrm{W} = 683$ lm.',
        'At 450 nm $V = 0.038$, so $\\Phi_v = 683 \\times 0.038 \\times 1\\ \\mathrm{W} = 26$ lm.'
      ],
      a: '683 lm and 26 lm: 26 times as many lumens from the same power. This is why white LEDs pair a blue chip with a phosphor: the blue alone would waste its watts on a colour the eye hardly counts.'
    },
    {
      title: 'From lumens back to watts',
      q: 'A lamp is rated 800 lm. How much optical power does it radiate if its light is white with an efficacy of radiation of 300 lm/W (a white LED), or 14 lm/W (a 2700 K filament)?',
      steps: [
        { text: 'The radiated power is the lumens divided by the efficacy:', tex: '\\Phi_e = \\frac{\\Phi_v}{K}' },
        'White LED: $800/300 = 2.7$ W of light. Filament: $800/14 = 57$ W of radiation, most of it infrared heat.'
      ],
      a: '2.7 W from the LED, 57 W from the filament. The same lumens need twenty times the radiated power from a source whose spectrum wastes most of it outside the visible.'
    }
  ],
  quiz: [
    { q: 'Which photometric unit is the twin of irradiance?', choices: ['lumen', 'candela', 'lux', 'nit'], a: 2, why: 'Irradiance is flux arriving per unit area; its photometric twin, luminous flux arriving per unit area, is illuminance in lux (lm/m²). The lumen is flux, the candela intensity and the nit luminance.' },
    { q: 'Light of 555 nm and 1 W of power is how many lumens?', answer: 683, unit: 'lm', why: 'At 555 nm the luminosity function is 1, so the flux is the full 683 lm per watt.' },
    { q: 'One watt of infrared light at 940 nm is about 0 lm, yet it can light a scene for an infrared camera.', a: true, why: 'Lumens count what the eye sees, and the eye does not see 940 nm. A silicon camera does, which is why night-vision illuminators are rated in watts, not lumens.' },
    { q: 'A lamp gives 1200 lm. Which statement is certainly true?', choices: ['It puts 1200 lx on every desk', 'It sends out 1200 lm in total, in every direction', 'Its luminous intensity is 1200 cd', 'It radiates 1200 W of light'], a: 1, why: 'Lumens measure the total. The lux on a desk depends on distance and on how the light is spread, the candelas on the solid angle, and the watts on the spectrum.' },
    { q: 'A reference monitor is run at 100 cd/m². In nits that is:', answer: 100, unit: 'nit', why: 'The nit is another name for the candela per square metre.' }
  ],
  applications: [
    'Lamp packaging and catalogues state lumens (the total output), not watts, because watts only say how much electricity the lamp draws.',
    'Lighting design and the standards for workplaces, roads and sports grounds are written in lux and in cd/m², the quantities the eye responds to.',
    'Displays, from phones to cinema screens, are specified in nits, and HDR formats set their targets in thousands of nits.',
    'Car headlamp and signal regulations limit candelas in particular directions, to give the driver light without dazzling others.'
  ],
  history: 'The candela began as a candle: in the nineteenth century lamps were compared with the flame of a standard candle or lamp. In 1948 the "new candle" was defined through a black body at the freezing point of platinum, in 1979 through 683 lm/W at 540 THz, and in 2019 through the same number as a fixed constant of the SI.',
  sources: [
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — the photometric quantities and their relation to the radiometric ones.',
    'CIE S 017/E:2020, *ILV: International Lighting Vocabulary* — the definitions of luminous flux, intensity, illuminance and luminance.',
    'BIPM, *The International System of Units (SI Brochure)*, 9th edition (2019) — the definition of the candela.'
  ],
  sim: { id: 'rp-quantities', params: { view: 'photometric' } }
},

/* ================================================================ the luminosity function */
{
  id: 'the-luminosity-function', parent: 'radiometry-and-photometry', title: 'The luminosity function V(λ)', level: 2,
  short: 'The eye is not a power meter: green light looks far brighter than red light of the same power. The luminosity function V(λ) records how much each wavelength counts, peaking at 555 nm where one watt is 683 lumens. It turns watts into lumens, and it is why a green laser pointer looks so much brighter than a red one.',
  keywords: ['luminosity function', 'V(lambda)', 'photopic', 'scotopic', 'V prime', 'luminous efficiency function', '555 nm', '683 lm/W', 'luminous efficacy of radiation', 'LER', 'Purkinje shift', 'mesopic', 'CIE 1924', 'spectral sensitivity of the eye', 'green laser'],
  prereq: ['photometric-quantities', 'wavelength-frequency-and-colour', 'the-retina-rods-and-cones'],
  related: ['light-and-dark-adaptation', 'cie-colour-matching-and-xyz', 'lamp-efficacy-and-lifetime', 'trichromatic-colour-vision', 'quantum-efficiency-and-spectral-response', 'laser-eye-hazards-and-eyewear', 'physics:color-vision'],
  body: `
Give a person a green light and a red light of equal power and ask which is brighter: the green, by a wide margin. The eye is not a power meter. Its sensitivity depends on colour, and photometry builds that dependence into a single curve, the **luminosity function** $V(\\lambda)$.

### The curve
$V(\\lambda)$ is the sensitivity of a standard observer to light of each wavelength, scaled to 1 at its peak. The standard in use is the one the CIE adopted in 1924, found with bright light and the eye's cones (**photopic** vision) by asking observers to match the brightness of lights of different colours. It peaks at 555 nm, falls to one half near 510 nm and 610 nm, and to one per cent near 430 nm and 690 nm.

Multiplying by 683 lm/W gives the **luminous efficacy** at each wavelength:

| Wavelength | Colour | $V(\\lambda)$ | lumens per watt |
|---|---|---|---|
| 450 nm | blue | 0.038 | 26 |
| 500 nm | blue-green | 0.323 | 221 |
| 532 nm | green laser pointer | 0.885 | 604 |
| 555 nm | yellow-green | 1.000 | 683 |
| 589 nm | sodium lamp, yellow | 0.769 | 525 |
| 610 nm | orange | 0.503 | 343 |
| 650 nm | red | 0.107 | 73 |
| 700 nm | deep red | 0.004 | 2.8 |

### Weighting a whole spectrum
A lamp radiates many wavelengths at once. Its luminous flux is the sum, wavelength by wavelength, of the power times the sensitivity:

$$\\Phi_v = K_m \\int \\Phi_{e,\\lambda}(\\lambda)\\,V(\\lambda)\\,\\mathrm{d}\\lambda$$

Divide by the total radiated power and you have the **luminous efficacy of radiation**, in lumens per watt of light, which depends only on the spectrum. A single line at 555 nm reaches the ceiling of 683. Low-pressure sodium, almost one yellow line, gives about 520. A white LED spectrum gives 300 to 350, sunlight about 95, and a 2700 K filament only 12 to 15, because most of what it radiates is infrared. Do not confuse this with the efficacy of a *lamp*, lumens per watt of electricity, which also counts losses ([[lamp-efficacy-and-lifetime]]).

### Why a green pointer looks brighter
Two laser pointers of 5 mW each, one at 532 nm and one at 650 nm, give $683 \\times 0.885 \\times 5\\ \\mathrm{mW} = 3.0$ lm and $683 \\times 0.107 \\times 5\\ \\mathrm{mW} = 0.37$ lm. The green one is more than eight times brighter for the same power, and that is simply the ratio of $V$.

> [!warn] $V(\\lambda)$ says how bright light *looks*, not how harmful it is. A 1064 nm beam is 0 lm, entirely invisible, and can still burn the retina; a bright red beam can injure as surely as a dim green one. Never judge a laser by its brightness: see [[laser-safety-classes]].

### The night curve
In dim light the rods take over and the sensitivity shifts to the **scotopic** curve $V'(\\lambda)$, which peaks at 507 nm and has its own ceiling of 1700 lm/W. At dusk red things darken first while blue-green ones hold their brightness (the Purkinje shift): at 650 nm the night sensitivity is more than a thousand times lower than at its peak, at 450 nm it is nearly half. Between roughly 0.005 and 5 cd/m² the **mesopic** eye mixes the two, which is where street lighting lives.

### A standard, not a law
$V(\\lambda)$ is an agreed average, measured in a small central field. Individuals differ by tens of per cent, the lens yellows with age, and the 1924 curve is known to be low in the blue. Its value is that two laboratories, or two lamps, can be compared on the same footing.

> [!key] $V(\\lambda)$ weights each wavelength by how much the eye sees it: 1 at 555 nm, one half at 510 and 610 nm, near zero beyond 700 and below 400. Multiply watts by $V$ and by 683 lm/W to get lumens; at night the curve shifts to 507 nm.
`,
  ideas: [
    'V(λ) is the standard sensitivity of the bright-light eye to each wavelength: 1 at 555 nm, 0.5 near 510 and 610 nm.',
    'At one wavelength, lumens = 683 × V(λ) × watts; for a spectrum, weight the power at every wavelength and add.',
    'The luminous efficacy of radiation of a spectrum runs from a few lm/W (a filament) to 683 (one green line).',
    'In dim light the scotopic curve V′(λ), peaking at 507 nm, applies; red darkens first at dusk (the Purkinje shift).',
    'V(λ) says how bright light looks, not how dangerous it is.'
  ],
  pitfalls: [
    'The eye is equally sensitive to all visible colours — Its sensitivity falls to a tenth in the red at 650 nm and to under a twentieth in the blue at 450 nm, relative to the green peak. Equal power does not look equally bright.',
    'The peak of the eye is in the blue-green, like the Sun\'s spectrum — It is at 555 nm, yellow-green. The Sun\'s power peaks near 500 nm per unit wavelength, and its visible light has an efficacy of about 95 lm/W, not 683, because it also radiates widely outside the band.',
    'A brighter-looking laser is a more dangerous one — Danger depends on the power and wavelength reaching the retina, not on V(λ). Invisible infrared beams of the same power are the more insidious because the blink reflex does not respond.',
    'V(λ) is the same by day and by night — At night the rods dominate and the peak moves to 507 nm. A red and a blue of equal daytime brightness look quite different at dusk.'
  ],
  terms: [
    { term: 'Luminosity function', also: ['V(λ)', 'photopic luminous efficiency function', 'spectral luminous efficiency'], def: 'The standard relative sensitivity of the bright-light eye to light of each wavelength, equal to 1 at 555 nm. It weights radiometric quantities to give photometric ones.' },
    { term: 'Scotopic luminosity function', also: ['V′(λ)', 'night vision curve'], def: 'The relative sensitivity of the dark-adapted eye, served by the rods. It peaks at 507 nm, where the efficacy is 1700 lm/W.' },
    { term: 'Luminous efficacy of radiation', also: ['LER', 'luminous efficacy of a spectrum'], def: 'The lumens a spectrum gives per watt of radiated power: the spectrum weighted by V(λ), divided by its total power. It ignores any loss before the radiation is produced.' },
    { term: 'Mesopic vision', also: ['dusk vision'], def: 'Vision at intermediate luminances, roughly 0.005 to 5 cd/m², where rods and cones both contribute and the sensitivity lies between the two curves.' },
    { term: 'Purkinje shift', also: ['Purkinje effect'], def: 'The change in apparent brightness of colours as light fades: reds darken faster than blues and greens because the peak sensitivity moves from 555 to 507 nm.' }
  ],
  formulas: [
    {
      name: 'Luminous efficacy at one wavelength',
      expr: 'K = Km*V', tex: 'K = K_m\\,V',
      vars: {
        K: { name: 'luminous efficacy', q: 'efficacy', unit: 'lm/W' },
        Km: { const: 'Km' },
        V: { name: 'luminosity function V(λ)', value: 0.885, min: 0, max: 1 }
      },
      note: 'Photopic. At 555 nm V = 1 and K is its maximum, 683 lm/W.',
      stories: { K: 'At a wavelength where the eye\'s sensitivity is {V}, how many lumens does each watt of light give?' }
    },
    {
      name: 'How much brighter one colour looks than another of equal power',
      expr: 'R = V1/V2', tex: 'R = \\frac{V_1}{V_2}',
      vars: {
        R: { name: 'ratio of apparent brightness' },
        V1: { name: 'sensitivity at the first wavelength', value: 0.885, min: 0, max: 1, tex: 'V_1' },
        V2: { name: 'sensitivity at the second wavelength', value: 0.107, min: 0.00001, max: 1, tex: 'V_2' }
      },
      note: 'Equal radiant power in each, photopic: the green pointer (V = 0.885) against the red (V = 0.107).',
      stories: { R: 'Two lights of equal power have sensitivities {V1} and {V2}. How many times brighter does the first look?' }
    },
    {
      name: 'Lumens from a lamp\'s radiated power',
      expr: 'Fv = K*Fe', tex: '\\Phi_v = K\\,\\Phi_e',
      vars: {
        Fv: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi_v' },
        K: { name: 'luminous efficacy of radiation of the spectrum', q: 'efficacy', unit: 'lm/W', value: 300 },
        Fe: { name: 'radiated optical power', q: 'power', unit: 'W', value: 3, tex: '\\Phi_e' }
      },
      note: 'About 300 for a white LED, 95 for sunlight, 14 for a 2700 K filament. Counts the radiated light, not the electricity used.',
      stories: { Fv: 'A white light source radiates {Fe} with an efficacy of radiation of {K}. How many lumens?' }
    },
    {
      name: 'Night-vision (scotopic) lumens',
      expr: 'Fs = Kms*Vs*Fe', tex: '\\Phi_s = K_s\\,V_s\\,\\Phi_e',
      vars: {
        Fs: { name: 'scotopic luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi_s' },
        Kms: { name: 'maximum scotopic efficacy, at 507 nm', q: 'efficacy', unit: 'lm/W', value: 1700, fixed: true, tex: 'K_s' },
        Vs: { name: 'scotopic sensitivity V′(λ) at the wavelength', value: 0.455, min: 0, max: 1, tex: 'V_s' },
        Fe: { name: 'radiant flux', q: 'power', unit: 'W', value: 1, tex: '\\Phi_e' }
      },
      note: 'For dark-adapted vision. V′ is 0.455 at 450 nm, 1 at 507 nm and 0.0007 at 650 nm.',
      stories: { Fs: 'A light of {Fe} lies where the night-vision sensitivity is {Vs}. How many scotopic lumens is that?' }
    }
  ],
  examples: [
    {
      title: 'Green and red pointers',
      q: 'Two laser pointers each emit 5 mW, one at 532 nm ($V = 0.885$) and one at 650 nm ($V = 0.107$). How many lumens does each give, and how many times brighter does the green one look?',
      steps: [
        { text: 'Green:', tex: '\\Phi_v = 683 \\times 0.885 \\times 0.005 = 3.0\\ \\mathrm{lm}' },
        { text: 'Red:', tex: '\\Phi_v = 683 \\times 0.107 \\times 0.005 = 0.37\\ \\mathrm{lm}' },
        'The ratio is $0.885/0.107 = 8.3$.'
      ],
      a: '3.0 lm and 0.37 lm; the green looks about 8 times brighter. Both are the same radiometric power, and the same hazard to a retina: the difference is only in what the eye reports.'
    },
    {
      title: 'Blue and red at dusk',
      q: 'A red light (650 nm) and a blue light (450 nm) have equal power. By day, which looks brighter and by how much? At night, with only the rods working?',
      steps: [
        'By day: $V(650)/V(450) = 0.107/0.038 = 2.8$, so the red looks nearly three times brighter.',
        'At night the sensitivities are $V\'(450) = 0.455$ and $V\'(650) = 0.0007$: the blue is more than six hundred times brighter.'
      ],
      a: 'By day the red wins by a factor of about 3; at night the blue wins by several hundred. The pair that are equally bright at noon swap order as the light fades, which is why red flowers look black at dusk and the leaves around them still look grey.'
    }
  ],
  quiz: [
    { q: 'At which wavelength is the photopic luminous efficacy greatest, and what is it?', choices: ['507 nm, 1700 lm/W', '555 nm, 683 lm/W', '500 nm, 683 lm/W', '700 nm, 683 lm/W'], a: 1, why: 'The bright-light peak is at 555 nm with 683 lm/W. The 507 nm and 1700 lm/W pair belongs to the night (scotopic) curve.' },
    { q: 'A 650 nm red laser and a 532 nm green laser of equal power are compared. Roughly how much brighter does the green one look?', answer: 8.3, why: 'The ratio of the sensitivities is $V(532)/V(650) = 0.885/0.107 = 8.3$.' },
    { q: 'A source radiates 10 W at 1064 nm, in the infrared. How many photopic lumens is that?', choices: ['6830 lm', '683 lm', '10 lm', '0 lm'], a: 3, why: 'The eye has no sensitivity at 1064 nm, so $V = 0$ and the flux is zero lumens, however much power it carries and however much harm it can do.' },
    { q: 'At dusk a red rose and its green leaves looked equally bright at midday. What do you expect now?', choices: ['The rose looks darker than the leaves', 'The rose looks brighter than the leaves', 'Both look the same', 'Both turn grey but keep their relative brightness'], a: 0, why: 'In dim light the peak of the eye shifts towards the blue, from 555 to 507 nm (the Purkinje shift). The rose\'s red lies where the night sensitivity is tiny, the leaves\' green where it is still high.' },
    { q: 'A white LED spectrum has an efficacy of radiation of about 300 lm/W. A filament has about 14. This means the LED is 20 times more efficient at turning electricity into light.', a: false, why: 'Efficacy of radiation counts only how the radiated light is spread over wavelengths. How much electricity becomes radiation in the first place is a separate loss, and the filament radiates almost all of its input, while an LED sheds a good part as heat.' }
  ],
  applications: [
    'Every lumen rating, lux reading and luminance figure is a measurement weighted by V(λ), by the filter in the meter or by the calculation behind it.',
    'Choosing lamp spectra: low-pressure sodium street lamps were the most efficient of their day because their yellow line sits near the peak; white LEDs trade some of this for colour.',
    'Eyewear and signals: red and blue warning lights need far more power than green or yellow to look equally bright.',
    'Night driving and dark-adapted work: red torches preserve night vision because rods hardly see them.',
    'Calibrating cameras and light meters, whose sensors respond differently from the eye and must be corrected to V(λ).'
  ],
  history: 'The CIE adopted the photopic function in 1924 from brightness-matching experiments done in the early 1920s by several laboratories, and the scotopic one in 1951. Both were later refined: the short-wavelength end of the 1924 curve is known to be low, and corrections proposed by Judd (1951) and Vos (1978) are used in colour work.',
  sources: [
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae* — luminous efficiency functions and photometry.',
    'CIE S 010/E:2004 (ISO 23539:2005), *Photometry — The CIE System of Physical Photometry* — the photopic and scotopic functions and the constants 683 and 1700 lm/W.',
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House).'
  ],
  sim: 'rp-luminosity'
},

/* ================================================================ lumens, candelas, lux and nits */
{
  id: 'lumens-candelas-lux-and-nits', parent: 'radiometry-and-photometry', title: 'Lumens, candelas, lux and nits', level: 1,
  short: 'Four units, four questions. The lumen says how much light a source makes in all, the candela how strongly it shines one way, the lux how much lands on a surface, and the nit how bright a surface looks. Each follows from the one before it: spread the lumens over a solid angle for candelas, divide by distance squared for lux, divide by the emitting area for nits.',
  keywords: ['lumen', 'candela', 'lux', 'nit', 'cd/m2', 'lumens vs lux', 'candela vs lumen', 'how bright is a lamp', 'torch range', 'beam distance', 'ANSI lumens', 'foot-candle', 'screen brightness', 'luminous flux', 'illuminance', 'luminance'],
  prereq: ['radiometric-quantities', 'photometric-quantities'],
  related: ['inverse-square-and-cosine-laws', 'lambertian-surfaces', 'illuminance-levels-in-practice', 'flashlights-and-headlamps', 'room-lighting-and-luminaires', 'light-emitting-diodes', 'physics:light-intensity'],
  body: `
One lamp can be described by four numbers, and they are not interchangeable. Each answers a different question, and confusing them is the commonest mistake in lighting.

### Four questions, four units
| Question | Quantity | Unit | It describes |
|---|---|---|---|
| How much light does it make, in all? | luminous flux | lumen (lm) | the source |
| How strongly does it shine this way? | luminous intensity | candela (cd = lm/sr) | the source |
| How much light lands on this surface? | illuminance | lux (lx = lm/m²) | the surface |
| How bright does it look? | luminance | cd/m², the nit | a source or surface, seen from a direction |

The chain runs one way. Lumens spread over a solid angle give **candelas**: $I = \\Phi/\\Omega$. Candelas divided by the distance squared give **lux** on a surface square to the light: $E = I/d^2$. Candelas divided by the projected area of the emitting surface give **nits**: $L = I/A$. The word *nit* comes from the Latin *nitere*, to shine.

### One lamp, four numbers
| Source | Lumens | Spread | Candelas | Lux | Nits |
|---|---|---|---|---|---|
| A candle | 12.6 | all round, 4π sr | 1 | 4 at 0.5 m | |
| A bulb of 800 lm, frosted, 60 mm | 800 | all round | 64 | 16 at 2 m | 22 500 |
| A torch of 300 lm | 300 | 10° half-angle, 0.095 sr | 3 140 | 126 at 5 m | |
| A desk lamp of 500 lm | 500 | 45° half-angle, 1.84 sr | 272 | 1 090 at 0.5 m | |
| A 15-inch laptop screen | 63 | Lambertian, one side | 20 | 75 at 0.5 m | 300 |

Compare the bulb and the torch. The torch makes fewer lumens, but it puts them into 0.095 sr instead of 12.6 sr, so on its axis it is 50 times the candelas. Gather the bulb's 800 lm into the same 10° cone with a reflector and a spot 2 m away goes from 16 lx to 2 100 lx, about 130 times more. The lumens did not change; where they went did.

### Which unit for which job
- **Lumens** compare light *sources*: the number on a lamp box, the output of a projector, the total of a street light.
- **Candelas** matter whenever light is aimed: a spotlight, a headlamp, a torch, a lighthouse. A torch standard rates range by the distance at which the beam gives 0.25 lx, so $d = \\sqrt{I/0.25} = 2\\sqrt{I}$: a torch of 10 000 cd reaches 200 m.
- **Lux** is what lighting standards ask for on a desk, a road or an operating table ([[illuminance-levels-in-practice]]).
- **Nits** are what screens and glare are measured in: a phone at 500 nit, a bulb filament at ten million.

### Lumens are not lux
One lumen on one square metre is one lux; the same lumen on one square centimetre is 10 000 lux. A 1000 lm projector gives 500 lx on a 2 m² screen but 50 lx on a 20 m² one. And lux belongs to the *place*: move the lamp and the lux changes, while the lamp's lumens and candelas do not.

> [!key] Lumens are the total, candelas the concentration, lux what lands, nits how bright it looks. Lumens ÷ steradians = candelas; candelas ÷ distance² = lux; candelas ÷ area = nits.
`,
  ideas: [
    'Lumen = total light from a source; candela = lumens per steradian; lux = lumens per square metre of surface; nit = candelas per square metre of source.',
    'The same lumens in a narrower beam give more candelas and more lux in the beam: concentration, not total, decides how bright the spot is.',
    'Lux depends on distance and geometry; lumens and candelas belong to the source and do not.',
    'The range of a torch is set by its candelas: d = 2√I for the 0.25 lx convention.',
    'Screens and glare are judged in nits, because what matters is how bright the surface looks.'
  ],
  pitfalls: [
    'More lumens always means a brighter light — Lumens are the total. A 300 lm torch beats an 800 lm bulb for lighting a spot 50 m away, because its candelas are fifty times higher.',
    'Lux is a property of the lamp — It is what lands on a surface and changes with distance and angle. A lamp has lumens and candelas; a place has lux.',
    'Lumen, lux and nit are one unit at different sizes — They are different quantities. A lux is a lumen per square metre of the receiving surface; a nit is a candela per square metre of the emitting one. A 300 nit screen delivers only some tens of lux to your face.',
    'A candela is the light of a candle — It began that way, but it is now a fixed unit of intensity (lumens per steradian). A candle gives roughly 1 cd, a car headlamp beam many thousands, a lighthouse millions.'
  ],
  terms: [
    { term: 'Lumen', also: ['lm'], def: 'The unit of luminous flux. A source of one candela that radiates equally in all directions gives 4π, or 12.57 lumens.' },
    { term: 'Candela', also: ['cd'], def: 'The unit of luminous intensity: one lumen per steradian. It is the SI base unit of photometry.' },
    { term: 'Lux', also: ['lx'], def: 'The unit of illuminance: one lumen per square metre of the surface that receives it.' },
    { term: 'Nit', also: ['cd/m²'], def: 'The common name of the candela per square metre, the unit of luminance: how bright a surface or a screen looks from a given direction.' },
    { term: 'Half-angle', also: ['beam angle', 'half-intensity angle'], def: 'The angle from the axis to the edge of a beam. Manufacturers often give a full beam angle at half of peak intensity, which is not quite the geometric edge.' }
  ],
  formulas: [
    {
      name: 'Intensity of an even beam',
      expr: 'I = Fv/(2*pi*(1 - cos(th)))', tex: 'I = \\frac{\\Phi_v}{2\\pi\\,(1 - \\cos\\theta)}',
      vars: {
        I: { name: 'luminous intensity', q: 'luminousint', unit: 'cd' },
        Fv: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', value: 300, tex: '\\Phi_v' },
        th: { name: 'half-angle of the beam', q: 'angle', unit: '°', value: 10, min: 0.5, max: 180, tex: '\\theta' }
      },
      note: 'The average over the cone, assuming an even beam. A half-angle of 180° is a source radiating all round.',
      stories: { I: 'A torch puts {Fv} into a beam of {th} half-angle. What is its peak intensity?', Fv: 'A beam of {th} half-angle has an intensity of {I}. How many lumens does it carry?' }
    },
    {
      name: 'Illuminance on the axis of an even beam',
      expr: 'E = Fv/(2*pi*(1 - cos(th))*d^2)', tex: 'E = \\frac{\\Phi_v}{2\\pi\\,(1 - \\cos\\theta)\\,d^2}',
      vars: {
        E: { name: 'illuminance', q: 'illuminance', unit: 'lx' },
        Fv: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', value: 300, tex: '\\Phi_v' },
        th: { name: 'half-angle of the beam', q: 'angle', unit: '°', value: 10, min: 0.5, max: 180, tex: '\\theta' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 5 }
      },
      note: 'Lumens to lux in one step: spread the flux over the cone, then over the distance squared.',
      stories: { E: 'A beam of {Fv} in {th} half-angle lights a wall {d} away, square on. How many lux?', d: 'A beam of {Fv} in {th} half-angle must give {E} on a target. How far away can the target be?' }
    },
    {
      name: 'Flux of a Lambertian screen',
      expr: 'Fv = pi*L*A', tex: '\\Phi_v = \\pi\\,L\\,A',
      vars: {
        Fv: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi_v' },
        L: { name: 'luminance', q: 'luminance', unit: 'cd/m²', value: 300 },
        A: { name: 'area of the screen', q: 'area', unit: 'm²', value: 0.067 }
      },
      note: 'For a surface of even luminance seen the same from every direction, into one hemisphere (see Lambertian surfaces).',
      stories: { Fv: 'A screen of {A} has a luminance of {L}. What light does it give out in all?' }
    },
    {
      name: 'Average illuminance on a work plane',
      expr: 'E = Fv*UF/A', tex: 'E = \\frac{\\Phi_v\\,U}{A}',
      vars: {
        E: { name: 'average illuminance', q: 'illuminance', unit: 'lx' },
        Fv: { name: 'total luminous flux of the lamps', q: 'luminousflux', unit: 'lm', value: 3000, tex: '\\Phi_v' },
        UF: { name: 'utilisation factor: the share of the lumens that reach the plane', value: 0.6, min: 0.01, max: 1, tex: 'U' },
        A: { name: 'area of the plane', q: 'area', unit: 'm²', value: 10 }
      },
      note: 'The lumen method for a room (see room lighting): the lumens that arrive, spread over the area.',
      stories: { E: 'Lamps give {Fv} in a room where {UF} of it reaches a desk-level area of {A}. What is the average illuminance?' }
    }
  ],
  examples: [
    {
      title: 'A torch and its range',
      q: 'A torch emits 300 lm in an even beam of 10° half-angle. What are its peak intensity, the illuminance 5 m away, and its beam distance on the 0.25 lx convention?',
      steps: [
        { text: 'The solid angle of the beam is', tex: '\\Omega = 2\\pi\\,(1 - \\cos 10°) = 0.0955\\ \\mathrm{sr}' },
        { text: 'The intensity:', tex: 'I = \\frac{300\\ \\mathrm{lm}}{0.0955\\ \\mathrm{sr}} = 3140\\ \\mathrm{cd}' },
        { text: 'At 5 m:', tex: 'E = \\frac{3140}{25} = 126\\ \\mathrm{lx}' },
        { text: 'Beam distance, where $E = 0.25$ lx:', tex: 'd = \\sqrt{\\frac{I}{0.25}} = \\sqrt{12\\,570} = 112\\ \\mathrm{m}' }
      ],
      a: '3140 cd, 126 lx at 5 m (a bright pool, like a sunny window), and a beam distance of about 112 m.'
    },
    {
      title: 'How much light is a screen?',
      q: 'A 15-inch laptop screen has an area of 0.067 m² and a luminance of 300 nit, the same in all directions. How many lumens does it emit, what is its intensity head-on, and what illuminance does it give at 0.5 m?',
      steps: [
        { text: 'A Lambertian surface sends out $\\pi L$ lumens per square metre:', tex: '\\Phi_v = \\pi \\times 300 \\times 0.067 = 63\\ \\mathrm{lm}' },
        { text: 'Head-on the intensity is luminance times area:', tex: 'I_0 = L\\,A = 300 \\times 0.067 = 20\\ \\mathrm{cd}' },
        'At 0.5 m the inverse-square law gives $20/0.25 = 80$ lx; the screen is nearly as wide as that distance, so the exact value for a disc of this size is a little lower, 74 lx.'
      ],
      a: '63 lm, 20 cd and about 75 lx. A screen that looks very bright is a weak light source: its 63 lm is less than a tenth of a 800 lm bulb.'
    }
  ],
  quiz: [
    { q: 'A 1000 lm spotlight and a 1000 lm floodlight are aimed at a wall. On the spot straight ahead, the spotlight gives:', choices: ['more lux, because its candelas are higher', 'the same lux, because the lumens are the same', 'less lux, because it is narrower', 'the same nits'], a: 0, why: 'The lumens are the total; the spotlight puts them into a smaller solid angle, so its intensity in candelas, and the lux on the spot, are higher.' },
    { q: 'A lamp radiates 100 lm equally in all directions. What is its luminous intensity, in candelas?', answer: 7.96, unit: 'cd', why: '$I = \\Phi/4\\pi = 100/12.57 = 7.96$ cd.' },
    { q: 'Doubling the distance from a small lamp doubles the lumens that reach a meter.', a: false, why: 'The lamp\'s lumens do not change with distance; the lux at the meter falls to a quarter. Lumens belong to the source, lux to the place.' },
    { q: 'A torch is specified at a peak intensity of 6400 cd. What is its beam distance on the 0.25 lx convention, in metres?', answer: 160, unit: 'm', why: '$d = \\sqrt{6400/0.25} = \\sqrt{25\\,600} = 160$ m.' },
    { q: 'Which unit would you use to say how bright a television screen looks?', choices: ['lumen', 'lux', 'candela per square metre (nit)', 'watt per square metre'], a: 2, why: 'How bright a surface looks is its luminance, in cd/m². Lumens are the total from a source and lux the light arriving on a surface.' }
  ],
  applications: [
    'Lamp boxes give lumens; spot lamps and headlamps add candelas and a beam angle; the shop floor and the office are designed in lux.',
    'Projectors are rated in lumens (ANSI lumens are measured at nine points of the screen), and the picture on the screen is then lux, set by the screen size.',
    'Torch and headlamp standards report lumens, peak intensity in candelas and beam distance in metres.',
    'Phones, monitors and televisions are specified in nits, and HDR standards in hundreds to thousands of nits.',
    'Road and vehicle lighting regulations limit candelas in directions where drivers or pedestrians would be dazzled.'
  ],
  history: 'The unit began as a candle. By the 1860s the "standard candle" was a spermaceti wax candle burning at a set rate. The candela proper dates from 1948, defined through the glow of a black body at the freezing point of platinum (60 cd per square centimetre); since 1979 it has been tied to 683 lm/W at 540 THz.',
  sources: [
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — the photometric units and the conversions between them.',
    'ANSI/PLATO FL1, *Flashlight Basic Performance Standard* — the definitions of output in lumens, beam intensity and beam distance.',
    'IES, *The Lighting Handbook*, 10th edition — lumen method and illuminance calculations.'
  ],
  sim: 'rp-units'
},

/* ================================================================ inverse-square and cosine laws */
{
  id: 'inverse-square-and-cosine-laws', parent: 'radiometry-and-photometry', title: 'The inverse-square and cosine laws', level: 1,
  short: 'Two geometric laws decide how much light a small source puts on a surface. The inverse-square law: the illuminance falls as the square of the distance. The cosine law: it also falls as the cosine of the angle by which the surface is turned away. Together, E = I cos θ / d².',
  keywords: ['inverse square law', 'cosine law', 'Lambert cosine law', 'illuminance', 'distance', 'point source', 'cos cubed', 'angle of incidence', 'photometric distance law', 'light falls off with distance', 'five times rule', 'solar constant'],
  prereq: ['lumens-candelas-lux-and-nits', 'rays-and-wavefronts'],
  related: ['lambertian-surfaces', 'relative-illumination-and-shading', 'vignetting', 'flash-and-strobe', 'room-lighting-and-luminaires', 'physics:light-intensity'],
  body: `
Stand twice as far from a bonfire and it warms you a quarter as much. Tilt a page away from a lamp and it darkens. Two plain geometric laws govern how much light a small source puts on a surface.

### The inverse-square law
Light from a point source spreads over a sphere. At distance $d$ the sphere has an area of $4\\pi d^2$, so the same flux covers four times the area at twice the distance and nine times at three times. The illuminance on a surface square to the light is

$$E = \\frac{I}{d^2}$$

A source of 100 cd gives 100 lx at 1 m, 25 lx at 2 m and 11 lx at 3 m. The law holds for irradiance too: sunlight is 1361 W/m² at the Earth, 586 W/m² at Mars (1.52 times as far) and 1.5 W/m² at Neptune (30 times as far).

### When it does not hold
The law is for a *point* source. A real lamp has size, and the law is right to 1 % only when the distance is at least five times the largest dimension of the source. For a round, evenly bright source on its axis:

| Distance ÷ diameter | 1 | 2 | 3 | 5 | 10 |
|---|---|---|---|---|---|
| True illuminance below the inverse-square value by | 20 % | 5.9 % | 2.7 % | 1.0 % | 0.25 % |

Other shapes break it differently. A long tube, close up, gives an illuminance that falls as $1/d$; a large uniform sheet, like a luminous ceiling, gives almost none at all near it; and a collimated beam such as a laser's keeps its irradiance for a long way. Inside a room the light reflected from the walls adds to the direct light, and the law describes only the direct part.

### The cosine law
Tilt the surface by an angle $\\theta$ from square-on (θ is measured from the surface normal). The same beam now spreads over a patch $1/\\cos\\theta$ times larger, so the illuminance is smaller by $\\cos\\theta$:

$$E = \\frac{I\\cos\\theta}{d^2}$$

At 60° it is half, at 80° only 17 %. This is why winter is cold: with the Sun 30° above the horizon, the angle from the vertical is 60° and each square metre of ground receives half the radiation it would with the Sun overhead.

### A lamp over a floor
A lamp of intensity $I$ hangs at height $h$. The floor point at angle $\\theta$ from the vertical is at distance $d = h/\\cos\\theta$ and the light meets the floor at that same angle, so both laws act:

$$E = \\frac{I\\cos^3\\theta}{h^2}$$

At 45° the floor gets 35 % of the illuminance directly below; at 60°, 12.5 %. A single downlight therefore makes a bright pool with dim surroundings, and luminaires must be spaced in a limited ratio to their height to even the floor out ([[room-lighting-and-luminaires]]). The camera's loss of light towards the corners of the picture follows a similar law, with a fourth power ([[relative-illumination-and-shading]]).

> [!note] The name *Lambert's cosine law* is also given to a different statement, that the intensity of a matt surface falls as the cosine of the viewing angle. That is the law of emission in [[lambertian-surfaces]]; this page is about light that is received.

> [!key] A small source gives $E = I\\cos\\theta/d^2$: down as the square of the distance, down as the cosine of the tilt. Under a lamp of height $h$ the floor goes as $\\cos^3\\theta$.
`,
  ideas: [
    'For a point source the illuminance on a surface square to the light is E = I/d²: double the distance, a quarter of the light.',
    'The law is accurate when the distance is at least five times the size of the source; closer in, it overestimates.',
    'Tilting the surface by θ from the square-on position multiplies the illuminance by cos θ.',
    'The two laws combine to E = I cos θ / d²; on a floor below a lamp this becomes E = I cos³θ / h².',
    'Lines, planes and collimated beams do not follow the inverse-square law.'
  ],
  pitfalls: [
    'Light falls off in proportion to the distance — For a point source it falls as the square of the distance. Only a line source, such as a long tube seen from close by, follows 1/d.',
    'A laser pointer\'s spot follows the inverse-square law — A laser beam is nearly parallel: its spot grows only slowly, by the beam divergence, so its irradiance is almost constant over many metres.',
    'The inverse-square law holds at any distance from any lamp — It holds for a point source. For a round lamp it is within 1 % only beyond five times its diameter; at the same distance as its diameter, it is 20 % too high.',
    'The cosine law says a tilted surface receives less light because the lamp is dimmer in that direction — The lamp can be the same in both directions. It is the receiving surface that presents a smaller area, cos θ times its true size, to the beam.'
  ],
  terms: [
    { term: 'Inverse-square law', also: ['photometric distance law', '1/d² law'], def: 'The illuminance or irradiance from a point source falls as the square of the distance from it, because the light spreads over the surface of a growing sphere.' },
    { term: 'Cosine law', also: ['Lambert\'s cosine law of illumination', 'cosine law of incidence'], def: 'A surface turned by an angle θ from square-on to the light receives cos θ times the illuminance, because the beam covers a larger area.' },
    { term: 'Five-times rule', also: ['point-source condition'], def: 'The rule of thumb that a lamp may be treated as a point source, so that the inverse-square law holds to about 1 %, when the distance is at least five times its largest dimension.' },
    { term: 'Solar constant', also: ['total solar irradiance'], def: 'The sunlight arriving above the atmosphere at the mean Earth–Sun distance, about 1361 W/m², on a surface square to the Sun.' }
  ],
  formulas: [
    {
      name: 'Illuminance from a point source',
      expr: 'E = I*cos(th)/d^2', tex: 'E = \\frac{I\\cos\\theta}{d^2}',
      vars: {
        E: { name: 'illuminance', q: 'illuminance', unit: 'lx' },
        I: { name: 'luminous intensity towards the surface', q: 'luminousint', unit: 'cd', value: 100 },
        d: { name: 'distance from the source', q: 'length', unit: 'm', value: 2 },
        th: { name: 'angle between the surface normal and the direction of the source', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'For a source small compared with the distance. θ = 0 is a surface square to the light.',
      stories: { E: 'A source of {I} lights a surface {d} away, whose normal is {th} from the direction of the source. What is the illuminance?', d: 'A source of {I} must give {E} on a surface turned {th} from square-on. How far away can it be?' }
    },
    {
      name: 'Moving the receiver',
      expr: 'E2 = E1*(d1/d2)^2', tex: 'E_2 = E_1\\left(\\frac{d_1}{d_2}\\right)^{2}',
      vars: {
        E2: { name: 'illuminance at the new distance', q: 'illuminance', unit: 'lx', tex: 'E_2' },
        E1: { name: 'illuminance at the first distance', q: 'illuminance', unit: 'lx', value: 400, tex: 'E_1' },
        d1: { name: 'first distance', q: 'length', unit: 'm', value: 1, tex: 'd_1' },
        d2: { name: 'new distance', q: 'length', unit: 'm', value: 4, tex: 'd_2' }
      },
      note: 'The same source, the same orientation. Works for irradiance as well.',
      stories: { E2: 'A meter reads {E1} at {d1} from a small lamp. What does it read at {d2}?' }
    },
    {
      name: 'Floor below a lamp (the cosine-cubed law)',
      expr: 'E = I*cos(th)^3/h^2', tex: 'E = \\frac{I\\cos^3\\theta}{h^2}',
      vars: {
        E: { name: 'illuminance on a horizontal floor', q: 'illuminance', unit: 'lx' },
        I: { name: 'luminous intensity towards the point', q: 'luminousint', unit: 'cd', value: 2000 },
        h: { name: 'height of the lamp above the floor', q: 'length', unit: 'm', value: 6 },
        th: { name: 'angle from the vertical', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'The intensity is taken as the same in every direction here; real luminaires are not, and their data sheets give I(θ).',
      stories: { E: 'A lamp of {I} hangs {h} above a floor. What illuminance does it give at a point {th} from the vertical?' }
    },
    {
      name: 'Sunlight at another distance',
      expr: 'Es = S/r^2', tex: 'E_s = \\frac{S}{r^2}',
      vars: {
        Es: { name: 'solar irradiance on a surface square to the Sun', q: 'intensity', unit: 'W/m²', tex: 'E_s' },
        S: { name: 'solar constant at 1 AU', q: 'intensity', unit: 'W/m²', value: 1361, fixed: true },
        r: { name: 'distance from the Sun, in astronomical units (1 AU = Earth–Sun)', value: 1.524, min: 0.1, max: 50 }
      },
      note: 'Mars is at 1.524 AU, Venus at 0.723, Jupiter at 5.2.',
      stories: { Es: 'A spacecraft is {r} astronomical units from the Sun. What irradiance does sunlight give a panel facing it?' }
    }
  ],
  examples: [
    {
      title: 'A lamp over a car park',
      q: 'A lamp of 2000 cd (taken as equal in all directions) hangs 6 m above the ground. What are the illuminances directly below it and at a point 6 m to the side?',
      steps: [
        { text: 'Directly below, $\\theta = 0$:', tex: 'E = \\frac{2000}{6^2} = 55.6\\ \\mathrm{lx}' },
        { text: '6 m to the side the light arrives at $\\theta = 45°$, and', tex: 'E = \\frac{2000\\,\\cos^3 45°}{6^2} = \\frac{2000 \\times 0.354}{36} = 19.6\\ \\mathrm{lx}' }
      ],
      a: '55.6 lx below, 19.6 lx at the side: 35 % as much. The pool of light has a bright centre and dims to a third in a distance equal to the lamp\'s height.'
    },
    {
      title: 'Sunlight on Mars',
      q: 'Mars orbits at 1.524 AU. How does the sunlight on a panel square to the Sun compare with that on the Earth?',
      steps: [
        { text: 'The inverse-square law:', tex: 'E = \\frac{1361}{1.524^2} = 586\\ \\mathrm{W/m^2}' },
        { text: 'Relative to the Earth:', tex: '\\frac{1}{1.524^2} = 0.43' }
      ],
      a: '586 W/m², 43 % of Earth\'s. A solar panel on Mars starts with less than half the sunshine, before dust and the tilt of the surface are counted.'
    }
  ],
  quiz: [
    { q: 'A small lamp gives 400 lx on a meter 1 m away. What does it give at 4 m, in lux?', answer: 25, unit: 'lx', why: '$E \\propto 1/d^2$: four times the distance, one sixteenth of the light. 400/16 = 25 lx.' },
    { q: 'A lamp of 1000 cd hangs 2 m above a floor. What illuminance does it give at a floor point 60° from the vertical, in lux?', answer: 31.25, unit: 'lx', why: '$E = I\\cos^3\\theta/h^2 = 1000 \\times 0.125/4 = 31.25$ lx: the distance is 4 m, so the inverse-square gives 1000/16, and the cosine of 60° halves it again.' },
    { q: 'The spot of a laser pointer on a wall follows the inverse-square law with distance.', a: false, why: 'A laser beam is nearly parallel, so its irradiance changes only as the spot grows by the small divergence of the beam, not as the sphere of a point source does.' },
    { q: 'The Sun is 30° above the horizon. Compared with the Sun overhead, the radiation on a horizontal patch of ground is:', choices: ['the same', 'a half', 'a quarter', '0.87 of it'], a: 1, why: 'The Sun is 60° from the vertical, so the cosine law gives cos 60° = 0.5. The Sun is not weaker; the ground presents half its area to the beam.' },
    { q: 'A 20 cm wide round panel light is measured on its axis. At which distance is the inverse-square law right to within about 1 %?', choices: ['10 cm', '20 cm', '50 cm', '1 m'], a: 3, why: 'The distance must be about five times the diameter: 5 × 20 cm = 1 m. At 20 cm the error is as much as 20 %.' }
  ],
  applications: [
    'Lighting design: the lux on a desk from a spot or a downlight, and the spacing of luminaires so that the floor is even.',
    'Photography: flash exposure falls as the square of the distance, which is why the guide number divides by distance.',
    'Solar power and climate: panel tilt, the seasons and the energy available at other planets all follow the two laws.',
    'Light meters and photometry benches: a meter is held at several distances to test a lamp\'s intensity, with the five-times rule as a guide.',
    'Reading a luminaire data sheet: its intensity table, candelas against angle, is used with these laws to compute the lux at any point.'
  ],
  history: 'Johannes Kepler argued in 1604 that the light of a source thins out as the square of the distance, from the geometry of the spreading cone. Pierre Bouguer and Johann Lambert built the first photometers on it in the eighteenth century. In the shadow photometer of Count Rumford (1794) two lamps cast two shadows of one rod, and one lamp was moved until the shadows were equally dark: the ratio of the distances squared was the ratio of the intensities.',
  sources: [
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — point sources and the photometric distance law.',
    'J. M. Palmer and B. G. Grant, *The Art of Radiometry* (SPIE Press, 2009) — the limits of the inverse-square law for extended sources.',
    'J. H. Lambert, *Photometria* (1760) — the cosine law and the first treatment of photometry.'
  ],
  sim: 'rp-inverse-square'
},

/* ================================================================ Lambertian surfaces */
{
  id: 'lambertian-surfaces', parent: 'radiometry-and-photometry', title: 'Lambertian surfaces', level: 2,
  short: 'A Lambertian surface looks equally bright from every direction: its luminance is the same however you view it, while its intensity falls as the cosine of the viewing angle. It gives off M = πL lumens per square metre, and a matt surface lit with illuminance E and reflectance ρ has luminance ρE/π.',
  keywords: ['Lambertian', 'ideal diffuser', 'matt surface', 'diffuse reflection', 'cosine emitter', 'M = pi L', 'luminous exitance', 'reflectance', 'albedo', 'BRDF', 'white card', 'Lambert\'s cosine law', 'luminance of a surface', 'LED emission pattern'],
  prereq: ['inverse-square-and-cosine-laws', 'specular-and-diffuse-reflection', 'photometric-quantities'],
  related: ['diffusers-and-ground-glass', 'radiance-and-its-conservation', 'the-integrating-sphere', 'metering-and-exposure-value', 'light-emitting-diodes', 'measuring-light'],
  body: `
Look at a sheet of matt white paper under a lamp. Tilt it, walk round it: it keeps the same brightness. That is the idea of a **Lambertian** surface, named for Johann Heinrich Lambert, who set out the law in 1760: the luminance, or radiance, is the same in every direction.

### Equal brightness, falling intensity
A Lambertian patch of area $A$, viewed at an angle $\\theta$ from its normal, presents a projected area $A\\cos\\theta$ and radiates an intensity

$$I(\\theta) = I_0\\cos\\theta$$

Both fall as the cosine, so the luminance $L = I/(A\\cos\\theta) = I_0/A$ is the same from every side. Seen at 60° the patch sends out half the candelas of the head-on view, but it also looks half as big, and it looks just as bright. Plotted in polar form the intensity is a circle resting on the surface.

### The factor π
Add up everything leaving the surface, with each direction weighted by $\\cos\\theta$ because oblique rays cross less area:

$$M = \\int_0^{2\\pi}\\!\\!\\int_0^{\\pi/2} L\\cos\\theta\\,\\sin\\theta\\,\\mathrm{d}\\theta\\,\\mathrm{d}\\varphi = \\pi L$$

So a surface of luminance $L$ gives off $M = \\pi L$ lumens per square metre: not $2\\pi L$, although a hemisphere is $2\\pi$ sr, because oblique directions count for less. A Lambertian emitter of area $A$ has flux $\\Phi = \\pi L A = \\pi I_0$. A bare LED chip giving 100 lm, for example, has an axial intensity of 100/π = 32 cd, and half of it at 60°, which is why data sheets quote a "120° viewing angle".

### Matt reflectors
A diffuse surface of reflectance $\\rho$ lit with illuminance $E$ sends out $M = \\rho E$, so its luminance is

$$L = \\frac{\\rho E}{\\pi}$$

White paper ($\\rho \\approx 0.8$) at 500 lx has $L = 127$ cd/m². A grey card ($\\rho = 0.18$) under the same light, 29 cd/m². Fresh snow ($\\rho \\approx 0.85$) in full sun, 100 000 lx, has about 27 000 cd/m². In the language of reflection, the ideal diffuse surface has a **BRDF** of $\\rho/\\pi$ per steradian for every direction of light and of view.

| Typical matt surface | Reflectance $\\rho$ |
|---|---|
| Sintered PTFE, a reference white | 0.98 to 0.99 |
| Barium sulfate coating | 0.97 to 0.98 |
| White paper | 0.80 to 0.90 |
| Fresh snow | about 0.85 |
| Concrete | 0.25 to 0.40 |
| Standard grey card | 0.18 |
| Worn asphalt | 0.05 to 0.15 |
| Black velvet | a few per cent or less |

### Who is, and who is not
Nearly Lambertian: plaster, matt paper, snow, chalk, a frosted lamp bulb. Among emitters, a bare LED chip, the Sun's disc (apart from some darkening at its edge), a glowing filament. Not Lambertian: mirrors, glossy paper, brushed metal, a wet road, a retroreflecting road sign, and a liquid-crystal screen seen far off axis. The full Moon is a famous case: a Lambertian ball lit from behind the observer would be brightest at the centre of its disc and darker towards the edge, but the Moon shows an evenly bright disc, because its dust scatters light strongly back towards the source. Real surfaces mix a diffuse part with a gloss lobe, and a measured BRDF records the mixture.

> [!key] A Lambertian surface has the same luminance in every direction, an intensity $I_0\\cos\\theta$, an exitance $M = \\pi L$ and, when lit with illuminance $E$, a luminance $\\rho E/\\pi$.
`,
  ideas: [
    'A Lambertian surface has the same luminance from every direction; its intensity falls as cos θ and the projected area does too.',
    'Its exitance is M = πL, and its flux Φ = πL·A = π·I₀.',
    'A matt surface of reflectance ρ lit with illuminance E has luminance L = ρE/π.',
    'The ideal diffuse BRDF is ρ/π per steradian in every direction.',
    'Real surfaces mix a diffuse part with a gloss lobe, and some, like the Moon, are far from Lambertian.'
  ],
  pitfalls: [
    'The same brightness in every direction means the same intensity — Brightness (luminance) is the same, but the candelas fall as cos θ. The surface also looks smaller at an angle, and the two exactly cancel.',
    'The flux of a Lambertian emitter is I₀ times 2π, the hemisphere — It is π times I₀. The solid angle of a hemisphere is 2π, but each direction is weighted by cos θ, which averages to a half.',
    'A white wall looks as bright as the lamp that lights it — A wall of reflectance ρ under illuminance E has luminance ρE/π, a small fraction of the luminance of the lamp, whose filament or chip is an intense source seen directly.',
    'A shiny surface is a Lambertian one with high reflectance — A glossy surface reflects the light of a lamp into a narrow lobe: it looks very bright at one angle and dark at others, while a Lambertian one looks the same from all.'
  ],
  terms: [
    { term: 'Lambertian surface', also: ['ideal diffuser', 'perfect diffuser', 'cosine emitter'], def: 'A surface whose luminance or radiance is the same in every direction, so that its intensity falls as the cosine of the angle from its normal.' },
    { term: 'Lambert\'s cosine law', also: ['cosine law of emission'], def: 'The intensity of a Lambertian surface in a direction at angle θ to its normal is I₀ cos θ, where I₀ is the intensity along the normal.' },
    { term: 'Diffuse reflectance', also: ['albedo', 'reflectance factor'], def: 'The fraction of the incident light that a matt surface sends back, spread over the hemisphere. A perfectly white diffuse surface would have ρ = 1.' },
    { term: 'BRDF', also: ['bidirectional reflectance distribution function'], def: 'The ratio of the radiance leaving a surface in one direction to the irradiance arriving from another, in sr⁻¹. For an ideal diffuse surface it is ρ/π.' },
    { term: 'Luminous exitance', def: 'The luminous (or radiant) flux leaving a surface per unit area. For a Lambertian surface of luminance L it is πL.' }
  ],
  formulas: [
    {
      name: 'Exitance of a Lambertian surface',
      expr: 'M = pi*L', tex: 'M = \\pi\\,L',
      vars: {
        M: { name: 'radiant exitance', q: 'intensity', unit: 'W/m²' },
        L: { name: 'radiance', q: 'radiance', unit: 'W/(m²·sr)', value: 100 }
      },
      note: 'The same relation holds for the photometric twins: lm/m² from cd/m².',
      stories: { M: 'A Lambertian surface has a radiance of {L}. How much power does it emit per square metre?' }
    },
    {
      name: 'Luminance of a matt surface',
      expr: 'L = rho*E/pi', tex: 'L = \\frac{\\rho\\,E}{\\pi}',
      vars: {
        L: { name: 'luminance', q: 'luminance', unit: 'cd/m²' },
        rho: { name: 'diffuse reflectance', value: 0.8, min: 0, max: 1, tex: '\\rho' },
        E: { name: 'illuminance on the surface', q: 'illuminance', unit: 'lx', value: 500 }
      },
      note: 'For a Lambertian reflector, whatever the direction of the light or of the view.',
      stories: { L: 'A matt surface of reflectance {rho} is lit with {E}. What is its luminance?', E: 'What illuminance gives a matt surface of reflectance {rho} a luminance of {L}?' }
    },
    {
      name: 'Intensity of a Lambertian emitter',
      expr: 'I = I0*cos(th)', tex: 'I = I_0\\cos\\theta',
      vars: {
        I: { name: 'luminous intensity at the angle', q: 'luminousint', unit: 'cd' },
        I0: { name: 'intensity along the normal', q: 'luminousint', unit: 'cd', value: 32, tex: 'I_0' },
        th: { name: 'angle from the normal', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'At 60° the intensity is half of that on the normal: the "120° viewing angle" of a bare LED.',
      stories: { I: 'A Lambertian emitter shines {I0} along its normal. How much does it shine at {th} from the normal?' }
    },
    {
      name: 'Flux of a Lambertian emitter',
      expr: 'Fv = pi*I0', tex: '\\Phi_v = \\pi\\,I_0',
      vars: {
        Fv: { name: 'luminous flux into the hemisphere', q: 'luminousflux', unit: 'lm', tex: '\\Phi_v' },
        I0: { name: 'intensity along the normal', q: 'luminousint', unit: 'cd', value: 32, tex: 'I_0' }
      },
      note: 'Not 2π: the cosine weighting averages to a half.',
      stories: { Fv: 'A bare LED chip shines {I0} along its axis with a cosine pattern. How many lumens does it give?', I0: 'A bare LED chip gives {Fv} with a cosine pattern. What is its intensity on the axis?' }
    }
  ],
  examples: [
    {
      title: 'Why a screen washes out in the sun',
      q: 'A screen has a luminance of 300 cd/m². What illuminance on a sheet of white paper ($\\rho = 0.85$) makes the paper exactly as bright as the screen?',
      steps: [
        { text: 'Solve $L = \\rho E/\\pi$ for $E$:', tex: 'E = \\frac{\\pi L}{\\rho} = \\frac{\\pi \\times 300}{0.85} = 1109\\ \\mathrm{lx}' }
      ],
      a: 'About 1100 lx, only twice a typical office. In daylight in the shade, 10 000 lx, the page is nine times as bright as the screen and the picture looks faded. Screens made for outdoor use are rated in thousands of nits.'
    },
    {
      title: 'A bare LED chip',
      q: 'A bare LED chip of area 1 mm² emits 100 lm with a Lambertian pattern. What are its axial intensity, its intensity at 60°, and its luminance?',
      steps: [
        { text: 'For a Lambertian emitter $\\Phi = \\pi I_0$:', tex: 'I_0 = \\frac{100}{\\pi} = 31.8\\ \\mathrm{cd}' },
        'At 60°, $I = I_0\\cos 60° = 15.9$ cd, half of the peak.',
        { text: 'The luminance is the same in every direction:', tex: 'L = \\frac{I_0}{A} = \\frac{31.8}{10^{-6}} = 3.2\\times10^{7}\\ \\mathrm{cd/m^2}' }
      ],
      a: '31.8 cd on the axis, 15.9 cd at 60° and a luminance of 3 × 10⁷ cd/m². The chip is thousands of times brighter than a clear sky, which is why one never looks into a power LED.'
    }
  ],
  quiz: [
    { q: 'A Lambertian disc is viewed at 60° from its normal instead of head-on. Compared with the head-on view:', choices: ['intensity halves; luminance is unchanged', 'intensity halves; luminance halves', 'intensity is unchanged; luminance halves', 'both are unchanged'], a: 0, why: 'The intensity is I₀ cos θ, half at 60°. But the disc also looks half as big, and luminance is the intensity per unit projected area, so it does not change.' },
    { q: 'White paper of reflectance 0.9 lies under an illuminance of 1000 lx. What is its luminance, in cd/m²?', answer: 286.5, unit: 'cd/m²', why: '$L = \\rho E/\\pi = 0.9 \\times 1000/\\pi = 286.5$ cd/m².' },
    { q: 'A Lambertian emitter of axial intensity I₀ has a total flux of 2π I₀.', a: false, why: 'The flux is π I₀: each direction is weighted by cos θ, and the hemisphere\'s 2π steradians average to π.' },
    { q: 'A surface of luminance 100 cd/m² is Lambertian. How many lumens does it give off per square metre?', answer: 314.2, unit: 'lm/m²', why: '$M = \\pi L = 314$ lm/m².' },
    { q: 'Which of these is furthest from a Lambertian surface?', choices: ['matt white paper', 'a bare LED chip', 'a plane mirror', 'fresh snow'], a: 2, why: 'A plane mirror reflects light into a single direction, so it is brilliant at one angle and dark at all others. The other three are close to ideal diffusers.' }
  ],
  applications: [
    'Camera metering: a grey card of 18 % reflectance, or a white card, is Lambertian, so its luminance depends only on the illuminance and gives a repeatable reading.',
    'Reference white surfaces and calibration targets: sintered PTFE and barium sulfate panels set the scale for spectrophotometers and cameras.',
    'LED optics: a bare chip is Lambertian, and reflectors and lenses are designed to reshape its cosine pattern into a beam.',
    'Diffusers, projection screens and light boxes aim to give an even luminance from every direction.',
    'Computer graphics: the diffuse part of a surface shader is the Lambertian cosine law, with the BRDF ρ/π.'
  ],
  history: 'Johann Heinrich Lambert set out the law of the cosine in his *Photometria* of 1760, observing that a uniformly diffusing surface looks as bright from every direction. The term Lambertian came into use for such surfaces, and for the ideal against which real reflectors are measured.',
  sources: [
    'J. H. Lambert, *Photometria sive de mensura et gradibus luminis, colorum et umbrae* (1760) — the cosine law of emission.',
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — Lambertian sources and reflectors, exitance and radiance.',
    'J. M. Palmer and B. G. Grant, *The Art of Radiometry* (SPIE Press, 2009).'
  ],
  sim: 'rp-lambert'
},

/* ================================================================ radiance and its conservation */
{
  id: 'radiance-and-its-conservation', parent: 'radiometry-and-photometry', title: 'Radiance: the brightness that optics cannot increase', level: 3,
  short: 'Radiance, the power per unit of projected area per unit of solid angle, is the brightness of a source, and no passive optical system can raise it. Lenses and mirrors only trade area for solid angle, and their losses lower it. That is why sunlight can never be focused to a spot hotter than the Sun, and why a telescope cannot make the Moon brighter than the eye sees it.',
  keywords: ['radiance', 'conservation of radiance', 'brightness theorem', 'radiance theorem', 'basic radiance', 'luminance', 'image brightness', 'concentration of sunlight', 'burning glass', 'second law', 'image illuminance', 'troland', 'L/n^2'],
  prereq: ['radiometric-quantities', 'lambertian-surfaces', 'the-f-number'],
  related: ['etendue', 'the-optical-invariant', 'concentrating-light', 'projector-illumination', 'refracting-telescopes', 'the-pupil', 'laser-eye-hazards-and-eyewear'],
  body: `
A lens in front of a lamp makes a bright patch on the wall, and a reflector behind it strengthens the beam. Can an optical system make a source *brighter*? In one precise sense it cannot, and that limit rules over projectors, solar furnaces, fibre couplers and telescopes.

### The statement
The brightness in question is the **radiance** $L$ (in photometry, the luminance): the power per unit of projected area per unit of solid angle ([[radiometric-quantities]]). The rule, the radiance theorem, has two parts.

- Along a ray in a lossless medium, $L/n^2$ is constant, with $n$ the refractive index. In air, radiance does not change along the ray, however far it goes.
- Through lenses, mirrors and apertures, the radiance of the image is that of the object times the transmittance: $L' = T\\,L$ with $T \\le 1$, when the media at both ends have the same index.

The image may be smaller or larger, nearer or farther. Its radiance can at best equal the source's.

### Why: area against solid angle
A lens that shrinks an image concentrates the light, but the light then arrives from a wider cone. Let a source patch of area $A$ send light into a cone of half-angle $\\theta$; the product $A\\sin^2\\theta$ (the [[etendue]], up to a factor $\\pi$) is the same at the image, $A'\\sin^2\\theta'$. With $A' = m^2 A$ the cone widens, $\\sin\\theta' = \\sin\\theta/m$. The flux is unchanged apart from losses, the area smaller and the cone wider by the same factor, so the flux per area per solid angle is unchanged.

### What a lens can do
It can **collect more flux**, catching a wide cone from the source. It can **raise the irradiance by shrinking the image**: the irradiance of an image formed by a cone of half-angle $\\theta'$ is $E' = \\pi L'\\sin^2\\theta'$, so a smaller image, lit from a wider cone, is more strongly lit, up to the ceiling $E' = \\pi L'$ at 90°. And it can **reshape** the light into a beam, a spot or a line. It cannot make $L'$ larger than $L$.

### Numbers
The Sun's disc has a luminance of 1.6 × 10⁹ cd/m², a tungsten filament or an LED chip about 10⁷, a fluorescent tube 10⁴ ([[illuminance-levels-in-practice]]). The Sun's radiance is $2\\times10^7$ W/(m²·sr), so no lens can give more than $\\pi L = 6.3\\times10^{7}$ W/m², 46 000 times the 1361 W/m² of direct sunlight: the ultimate limit of every solar concentrator, set only by the Sun's angular size, $1/\\sin^2(0.267°) = 46\\,000$. A 50 mm magnifying glass of 100 mm focal length forms a 0.93 mm image of the Sun, gathers about 2 W and so reaches about 2.9 MW/m², 2900 times direct sunlight: enough to ignite paper, far short of the limit.

### The camera and the eye
For a distant scene of luminance $L$, a lens at f-number $N$ puts on its sensor
$$E' = \\frac{\\pi\\,L\\,T}{4N^2}$$
so the image brightness depends on $L$ and $N$ and not on the focal length or the size of the lens. That is why exposures are tabulated in f-numbers ([[the-f-number]]). A telescope makes the Moon larger, not brighter: the illuminance of the retinal image of an extended object cannot exceed what the naked eye gets, and it is lower after the losses in the glass. Only point-like objects, the stars, gain from a larger aperture. The retina's own unit follows the same rule: the **troland** is the luminance in cd/m² times the pupil area in mm².

### The second law, in optics
If a lens could raise radiance, light from a cool source could heat something hotter than the source, passing heat from cold to hot without work. Radiance conservation is the optical face of the second law. A laser is no counterexample: its radiance is far above any thermal source's, so it *can* be focused to an irradiance no lamp could give. An image intensifier or a camera's gain amplifies the signal; they are active, not passive.

> [!warn] A lens can set paper and wood alight in seconds. Focus sunlight only on a non-flammable surface; never look at the Sun through any lens, telescope or binocular without a certified solar filter over the front.

> [!key] Along a ray $L/n^2$ is constant; a passive system delivers $L' = TL \\le L$. Lenses trade area for angle: they can raise the irradiance of an image to at most $\\pi L$, never its radiance.
`,
  ideas: [
    'Radiance (luminance) is the brightness of a source; along a ray in a lossless medium L/n² stays constant.',
    'Any passive system delivers an image of radiance L′ = T·L, never more than the source.',
    'A lens trades area for solid angle: a smaller image is lit from a wider cone, so its irradiance rises, but its radiance does not.',
    'The most irradiance any lens can give from a source of radiance L is πL; for the Sun that is 46 000 times direct sunlight.',
    'An image of an extended scene on a sensor has E′ = πLT/(4N²): set by the f-number, not by the lens size.'
  ],
  pitfalls: [
    'A lens makes its image brighter than the source — It can make the *irradiance* of the image higher than that of the source by shrinking it, but the radiance, the brightness per unit area and solid angle, cannot exceed the source\'s. A projected image is never more brilliant than the lamp.',
    'A bigger lens gives a brighter image of a scene — Of an extended scene, a bigger lens of the same f-number puts the same illuminance on the sensor. It collects more light, and spreads it over a proportionally larger image.',
    'Binoculars or a telescope brighten a dim, broad object — They magnify it. Its surface brightness on the retina at best equals the naked eye\'s, and it is lower once the lenses absorb some. Only points of light gain.',
    'With a big enough mirror, sunlight can be concentrated without limit — The limit is about 46 000 times, set by the Sun\'s angular size, however large the mirror is.'
  ],
  terms: [
    { term: 'Radiance theorem', also: ['conservation of radiance', 'brightness theorem'], def: 'The statement that the radiance of a beam is unchanged along a ray in a lossless medium and cannot be increased by passive optics, whatever the lenses and mirrors in its path.' },
    { term: 'Basic radiance', also: ['L/n²', 'reduced radiance'], def: 'The radiance divided by the square of the refractive index. It is the quantity that stays constant along a ray when the ray passes from one medium into another.' },
    { term: 'Concentration limit', also: ['maximum concentration'], def: 'The most a lens or mirror can raise the irradiance of light from a distant source: 1/sin²θ in air for a source of half-angle θ, about 46 000 for the Sun.' },
    { term: 'Troland', also: ['Td'], def: 'The unit of retinal illuminance: the luminance in cd/m² times the area of the pupil in mm². It gives the light the retina receives from a scene whatever the size of the pupil.' },
    { term: 'Surface brightness', def: 'In astronomy, the brightness of an extended object per unit of solid angle on the sky: the equivalent of radiance or luminance. It does not change with the distance of the object, and a telescope cannot raise it.' }
  ],
  formulas: [
    {
      name: 'Illuminance on the sensor from an extended scene',
      expr: 'E = pi*L*T/(4*N^2*(1 + m)^2)', tex: 'E = \\frac{\\pi\\,L\\,T}{4N^2\\,(1 + m)^2}',
      vars: {
        E: { name: 'illuminance on the sensor, at the centre of the image', q: 'illuminance', unit: 'lx' },
        L: { name: 'luminance of the scene', q: 'luminance', unit: 'cd/m²', value: 300 },
        T: { name: 'transmittance of the lens', q: 'ratio', unit: '%', value: 90, min: 1, max: 100 },
        N: { name: 'f-number', value: 2, min: 0.5, max: 64 },
        m: { name: 'magnification (size of image ÷ size of object)', value: 0, min: 0, max: 20 }
      },
      note: 'For a distant scene m is about 0. In close-up the working f-number N(1 + m) applies. Off axis the light falls as cos⁴ of the field angle.',
      stories: { E: 'A scene of {L} is photographed at f/{N} through a lens of transmittance {T}, at magnification {m}. What illuminance reaches the sensor?' }
    },
    {
      name: 'Irradiance of an image formed from a cone',
      expr: 'E = pi*L*sin(th)^2', tex: 'E = \\pi\\,L\\,\\sin^2\\theta',
      vars: {
        E: { name: 'irradiance of the image', q: 'intensity', unit: 'W/m²' },
        L: { name: 'radiance of the image (at best that of the source)', q: 'radiance', unit: 'W/(m²·sr)', value: 2.0e7 },
        th: { name: 'half-angle of the cone of light converging on the image', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The ceiling is πL at a half-angle of 90°. Default radiance: the Sun.',
      stories: { E: 'Light of radiance {L} converges on an image in a cone of {th} half-angle. What irradiance does it give?' }
    },
    {
      name: 'Basic radiance across an index change',
      expr: 'L2 = L1*(n2/n1)^2', tex: 'L_2 = L_1\\left(\\frac{n_2}{n_1}\\right)^{2}',
      vars: {
        L2: { name: 'radiance in the second medium', q: 'luminance', unit: 'cd/m²', tex: 'L_2' },
        L1: { name: 'radiance in the first medium', q: 'luminance', unit: 'cd/m²', value: 1000, tex: 'L_1' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.5, min: 1, max: 4, tex: 'n_2' }
      },
      note: 'Lossless refraction (the Fresnel losses come on top). Inside glass the radiance is n² times as great; it returns to its old value when the ray leaves.',
      stories: { L2: 'A beam of {L1} in a medium of index {n1} passes into one of index {n2}, with no losses. What is its radiance there?' }
    },
    {
      name: 'Ultimate concentration of a distant source',
      expr: 'C = 1/sin(th)^2', tex: 'C = \\frac{1}{\\sin^2\\theta}',
      vars: {
        C: { name: 'highest concentration ratio, in air' },
        th: { name: 'half-angle of the source seen from the concentrator', q: 'angle', unit: '°', value: 0.2665, min: 0.01, max: 90, tex: '\\theta' }
      },
      note: 'Three-dimensional concentration; the Sun has a half-angle of 0.2665°, giving 46 000.',
      stories: { C: 'A source subtends a half-angle of {th}. What is the most any lens or mirror can concentrate its light?' }
    }
  ],
  examples: [
    {
      title: 'A burning glass',
      q: 'A magnifying glass 50 mm across has a focal length of 100 mm. The Sun is 0.53° (9.3 mrad) across and gives 1000 W/m². Estimate the width and the irradiance of the Sun\'s image, and compare with the limit.',
      steps: [
        { text: 'The image of the Sun is a disc of diameter', tex: 'd = f\\,\\theta_{\\mathrm{Sun}} = 100\\ \\mathrm{mm} \\times 0.0093 = 0.93\\ \\mathrm{mm}' },
        { text: 'The lens collects the sunlight over its area:', tex: '\\Phi = 1000 \\times \\pi\\,(0.025)^2 = 1.96\\ \\mathrm{W}' },
        { text: 'The image area is $\\pi\\,(0.465\\times10^{-3})^2 = 6.8\\times10^{-7}$ m², so', tex: 'E = \\frac{1.96}{6.8\\times10^{-7}} = 2.9\\times10^{6}\\ \\mathrm{W/m^2}' }
      ],
      a: 'A 0.93 mm image at about 2.9 MW/m², that is 2900 suns. The same figure follows from $E = \\pi L\\sin^2\\theta$ with $\\sin\\theta = 0.24$ for the lens\'s cone. The ceiling is 46 000 suns, which needs a cone of half-angle 90° onto the image: a lens at f/2 comes nowhere near it.'
    },
    {
      title: 'Photographing a monitor',
      q: 'A monitor of luminance 300 cd/m² is photographed from some distance through a lens of transmittance 0.9. What illuminance falls on the sensor at f/2, and at f/8?',
      steps: [
        { text: 'For a distant extended scene the illuminance is $E = \\pi L T/(4N^2)$. At f/2:', tex: 'E = \\frac{\\pi \\times 300 \\times 0.9}{4 \\times 4} = 53\\ \\mathrm{lx}' },
        { text: 'At f/8, sixteen times less:', tex: 'E = \\frac{\\pi \\times 300 \\times 0.9}{4 \\times 64} = 3.3\\ \\mathrm{lx}' }
      ],
      a: '53 lx at f/2 and 3.3 lx at f/8, whatever the focal length of the lens or its diameter. Four stops is a factor of 16.'
    }
  ],
  quiz: [
    { q: 'A lens forms a real image of a frosted lamp on a screen. Compared with the radiance of the lamp, the radiance of the image is:', choices: ['higher if the image is smaller', 'higher if the lens is bigger', 'at most equal', 'always much lower'], a: 2, why: 'Radiance is conserved by passive optics, lowered only by losses. A smaller image is lit more strongly (higher irradiance) but not at a higher radiance.' },
    { q: 'What is the greatest factor by which a lens or mirror in air can raise the irradiance of sunlight (the Sun\'s half-angle is 0.2665°)?', answer: 46200, why: '$C_{max} = 1/\\sin^2\\theta = 1/(4.65\\times10^{-3})^2 = 46\\,200$. The limit follows from the radiance of the Sun, not from the size of the mirror.' },
    { q: 'Looking at the Moon through a telescope with a large exit pupil makes each part of its surface appear brighter than to the naked eye.', a: false, why: 'The telescope makes the Moon larger, and the retinal illuminance per unit area of its image at best equals that of the naked eye, and is reduced by absorption and reflection in the lenses.' },
    { q: 'A scene of luminance 1000 cd/m² is photographed at f/4 through a lens that loses no light, with the object far away. What illuminance reaches the sensor, in lux?', answer: 49.1, unit: 'lx', why: '$E = \\pi L T/(4N^2) = \\pi \\times 1000/(4 \\times 16) = 49.1$ lx.' },
    { q: 'Why can a laser be focused to a spot hotter than the surface of the Sun?', choices: ['Its radiance is far higher than the Sun\'s', 'Lenses can raise radiance if they are good enough', 'Its light has a shorter wavelength', 'It uses more power'], a: 0, why: 'The limit on a focus is set by the radiance of the source. A laser beam has a radiance many orders above that of the Sun, so the same lens can give it a far higher irradiance.' }
  ],
  applications: [
    'Solar concentrators, troughs and furnaces are designed against the ceiling of 46 000 suns; the large solar furnaces reach temperatures above 3000 °C.',
    'Camera exposure: the f-number alone fixes the illuminance on the sensor, which is why one exposure table serves every lens.',
    'Projectors and headlamps: the picture or the beam can only be as bright (in cd/m²) as the lamp or LED chip behind it; the lamp\'s radiance, not the optics, sets the limit.',
    'Telescopes and binoculars: the "twilight factor" and exit-pupil rules come from the retinal brightness of an extended image, not from any gain of radiance.',
    'Laser safety: the retinal image of a distant laser is a tiny, intensely bright spot, because lasers have a radiance beyond any lamp.'
  ],
  history: 'In the 1860s Rudolf Clausius argued from the second law of thermodynamics that no arrangement of lenses and mirrors can make a body hotter than the source of its light. The geometrical-optics form of the argument, the constancy of radiance (and of L/n² across refractions), followed in the late nineteenth century and is still the central theorem of non-imaging optics.',
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — the invariance of radiance, étendue and the limits of concentration.',
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — the radiance theorem and its consequences.',
    'J. M. Palmer and B. G. Grant, *The Art of Radiometry* (SPIE Press, 2009).'
  ],
  sim: 'rp-radiance'
},

/* ================================================================ étendue */
{
  id: 'etendue', parent: 'radiometry-and-photometry', title: 'Étendue', level: 3,
  short: 'Étendue is the area of a beam multiplied by the solid angle it fills, weighted by the cosine: how much room the light takes up in space and in direction together. A passive optical system cannot reduce it, so a source can be coupled efficiently only into a system whose own étendue is at least as large. It is the budget behind projectors, fibre coupling and solar concentrators.',
  keywords: ['etendue', 'étendue', 'throughput', 'geometric extent', 'AΩ product', 'optical invariant', 'phase space', 'coupling efficiency', 'acceptance', 'Liouville', 'LED into fibre', 'projector lamp', 'conservation of etendue', 'beam parameter', 'number of modes'],
  prereq: ['radiance-and-its-conservation', 'the-optical-invariant', 'numerical-aperture'],
  related: ['concentrating-light', 'projector-illumination', 'collecting-and-shaping-light', 'coupling-light-into-fibre', 'light-pipes-and-homogenizers', 'beam-quality-m-squared', 'fibre-numerical-aperture'],
  body: `
A beam of light takes up room twice over: it has a width, and its rays fan out over a range of directions. **Étendue**, French for "extent", measures both at once. It is the thing a lens cannot squeeze, and the reason a bright LED cannot be funnelled into a thin fibre.

### Definition
For light crossing an area $A$ in a cone of directions of solid angle $\\Omega$, the étendue is $G = \\int\\!\\!\\int \\cos\\theta\\,\\mathrm{d}A\\,\\mathrm{d}\\Omega$. For a flat patch emitting evenly into a cone of half-angle $\\theta$ in a medium of index $n$:

$$G = \\pi\\,A\\,n^2\\sin^2\\theta$$

Its unit is m²·sr, usually written in mm²·sr (the steradian is a pure number, so étendue has the dimensions of an area). It is the square of the [[the-optical-invariant|optical invariant]], up to a constant. A Lambertian emitter, whose half-angle is 90°, has $G = \\pi A$.

### It does not decrease
Through a lossless passive system the étendue of a bundle of rays is **conserved**: a lens can shrink the image to a fraction $m$ of the size, and the cone then opens up by $1/m$, and $A\\,\\sin^2\\theta$ is unchanged. It can be *reduced* only by throwing light away, with stops and apertures. It is a statement in geometric optics of Liouville's theorem, and it is the same law as the conservation of radiance ([[radiance-and-its-conservation]]), seen from the other side: for even light, **flux = radiance × étendue**, $\\Phi = L\\,G$.

### The budget
A system, whether a fibre, a panel behind a projection lens, a sensor behind an objective or a light guide, accepts light only if it falls on its area and within its acceptance cone: it has its own étendue $G_t$. Of a source of étendue $G_s$, the most that can be delivered is

$$\\eta_{\\max} = \\min\\!\\left(1,\\ \\frac{G_t}{G_s}\\right)$$

| System | Area (mm²) | Half-angle (sin θ) | G (mm²·sr) |
|---|---|---|---|
| Single-mode laser beam, 532 nm | | | 3 × 10⁻⁷ (about λ²) |
| Fibre, 50 µm core, NA 0.22 | 0.002 | 0.22 | 3.0 × 10⁻⁴ |
| Fibre, 200 µm core, NA 0.22 | 0.031 | 0.22 | 4.8 × 10⁻³ |
| Plastic fibre, 1 mm core, NA 0.5 | 0.79 | 0.5 | 0.62 |
| LED chip 1 mm², Lambertian | 1 | 1 | 3.1 |
| Liquid light guide, 3 mm, NA 0.55 | 7.1 | 0.55 | 6.7 |
| Projector panel 0.7", f/2.4 | 135 | 0.21 | 18 |
| Camera sensor 1", f/2 | 123 | 0.25 | 24 |

A 1 mm² LED chip against a 50 µm fibre: $3.0\\times10^{-4}/3.1 = 10^{-4}$. No lens or reflector, however perfect, can couple more than 0.01 % of its light. The same chip into a 3 mm light guide, with $G_t = 6.7$, can in principle be coupled completely. A laser, whose étendue is a few times $\\lambda^2$, goes into the thin fibre with ease.

### Matching with magnification
To get the light in, the image of the source must fit within the target's area and arrive inside its acceptance angle. Magnification $m$ makes the image $m^2$ times as large and narrows the cone by $1/m$: too small a magnification overfills the angle, too large overfills the area. If $G_t \\ge G_s$ some magnification satisfies both; if not, the best a lens can do is $G_t/G_s$.

### Counting modes
One spatial mode of light in one polarization occupies an étendue of about $\\lambda^2$, so $N \\approx 2G/\\lambda^2$ counts the modes of a beam. The 50 µm fibre above carries about 2000, which matches fibre theory. Beam quality is the same idea: the étendue is about $M^4\\lambda^2$.

### Étendue at work
- **Projectors**: the lamp or LED must not exceed the étendue of the panel and lens ($G = 18$ mm²·sr above), or light is lost. A Lambertian LED of at most $18/\\pi \\approx 5.9$ mm² can be used completely. A brighter picture needs higher radiance, not a bigger source.
- **Solar concentrators**: the Sun's small étendue lets a mirror focus it down by 46 000.
- **Cameras**: lens and sensor together have $G \\approx \\pi A/(4N^2)$: more light from a larger sensor or a smaller f-number.
- **Reformatting**: étendue can be re-shaped, not reduced: a round beam can be sliced into a thin line for a spectrograph slit.

> [!key] $G = \\pi A n^2\\sin^2\\theta$ cannot be reduced by passive optics. A source of étendue $G_s$ can be coupled into a system of étendue $G_t$ with an efficiency of at most $G_t/G_s$.
`,
  ideas: [
    'Étendue G = πA n² sin²θ is the area times the solid angle (cosine-weighted): the space a beam occupies in position and direction together.',
    'Passive optics cannot reduce it; it falls only by discarding light.',
    'Flux equals radiance times étendue: the more étendue a system accepts, the more light it can pass from a source of given radiance.',
    'A source can be coupled into a target with an efficiency of at most G_target / G_source, whatever the lenses.',
    'One mode of light has an étendue of about λ²; a laser has very little, an LED a great deal.'
  ],
  pitfalls: [
    'A perfect lens can focus all the light of an LED into a thin fibre — Not if the LED\'s étendue exceeds the fibre\'s. A lens trades size for angle and cannot reduce their product; a 1 mm LED chip into a 50 µm fibre can give at most about 0.01 %.',
    'Étendue is just the area of the source — It is the area times the solid angle. A tiny source emitting into a wide cone can have a larger étendue than a large source in a narrow beam.',
    'A reflector or condenser can reduce the étendue of a lamp — It can reshape the beam, collimate it or focus it, but the product of area and angle stays the same. Only an aperture reduces étendue, by throwing light away.',
    'Étendue matters only for LEDs — It applies to every source and every system, from a camera and its sensor to a telescope and a solar mirror.'
  ],
  terms: [
    { term: 'Étendue', also: ['etendue', 'throughput', 'geometric extent', 'AΩ product'], def: 'The product of the area of a beam and the solid angle of its directions, weighted by the cosine of the angle to the normal; for even light G = πA n² sin²θ. Passive optics cannot reduce it.' },
    { term: 'Acceptance', also: ['acceptance étendue'], def: 'The étendue a system can take in: its area times the solid angle it accepts. Light outside either its area or its angle is lost.' },
    { term: 'Spatial mode', def: 'One of the independent patterns of light a beam can carry. A mode of one polarization has an étendue of about λ²; the number of modes is the étendue divided by λ², doubled for two polarizations.' },
    { term: 'Liouville\'s theorem', def: 'The theorem that the volume a set of rays occupies in the space of position and direction is conserved by the motion of light in a lossless system. Conservation of étendue is its optical form.' }
  ],
  formulas: [
    {
      name: 'Étendue of an even source',
      expr: 'G = pi*A*n^2*sin(th)^2', tex: 'G = \\pi\\,A\\,n^2\\sin^2\\theta',
      vars: {
        G: { name: 'étendue (mm²·sr; the steradian is dimensionless)', q: 'area', unit: 'mm²' },
        A: { name: 'area of the source or aperture', q: 'area', unit: 'mm²', value: 1 },
        n: { name: 'refractive index of the medium', value: 1, min: 1, max: 4 },
        th: { name: 'half-angle of the cone of light', q: 'angle', unit: '°', value: 90, min: 0.01, max: 90, tex: '\\theta' }
      },
      note: 'A Lambertian emitter has θ = 90°. For a fibre, n sin θ is its numerical aperture.',
      stories: { G: 'A source of {A} emits evenly into a cone of {th} half-angle in a medium of index {n}. What is its étendue?' }
    },
    {
      name: 'Greatest coupling efficiency',
      expr: 'eta = Gt/Gs', tex: '\\eta_{\\max} = \\frac{G_t}{G_s}',
      vars: {
        eta: { name: 'highest possible coupling efficiency (when the target is the smaller)', q: 'ratio', unit: '%', tex: '\\eta_{\\max}' },
        Gt: { name: 'étendue of the target (mm²·sr)', q: 'area', unit: 'mm²', value: 0.0003, tex: 'G_t' },
        Gs: { name: 'étendue of the source (mm²·sr)', q: 'area', unit: 'mm²', value: 3.14, tex: 'G_s' }
      },
      note: 'Valid when the target\'s étendue is smaller than the source\'s; otherwise the efficiency can reach 100 %. Default: a 1 mm² LED into a 50 µm fibre.',
      stories: { eta: 'A source of étendue {Gs} is to be coupled into a target of étendue {Gt}. What is the best possible efficiency?' }
    },
    {
      name: 'Number of modes in a beam',
      expr: 'N = 2*G/lambda^2', tex: 'N \\approx \\frac{2\\,G}{\\lambda^2}',
      vars: {
        N: { name: 'number of modes (both polarizations)' },
        G: { name: 'étendue (mm²·sr)', q: 'area', unit: 'mm²', value: 0.0003 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Default: the 50 µm, NA 0.22 fibre, which carries about two thousand modes.',
      stories: { N: 'A fibre or beam has an étendue of {G} at {lambda}. About how many modes does it carry?' }
    },
    {
      name: 'Étendue of a lens and its sensor',
      expr: 'G = pi*A/(4*N^2)', tex: 'G = \\frac{\\pi\\,A}{4N^2}',
      vars: {
        G: { name: 'étendue (mm²·sr)', q: 'area', unit: 'mm²' },
        A: { name: 'area of the sensor or panel', q: 'area', unit: 'mm²', value: 123 },
        N: { name: 'f-number of the lens', value: 2, min: 0.5, max: 64 }
      },
      note: 'The approximation sin θ = 1/(2N), good for N above about 1.5. Default: a 1" sensor at f/2.',
      stories: { G: 'A sensor of {A} sits behind a lens at f/{N}. What is the étendue of the system?' }
    }
  ],
  examples: [
    {
      title: 'An LED and a thin fibre',
      q: 'A 1 mm × 1 mm LED chip emits like a Lambertian source. A multimode fibre has a 50 µm core and a numerical aperture of 0.22. What is the most of the chip\'s light that any lens could launch into the fibre?',
      steps: [
        { text: 'The chip: $\\theta = 90°$, so', tex: 'G_s = \\pi \\times 1\\ \\mathrm{mm^2} \\times 1 = 3.14\\ \\mathrm{mm^2\\,sr}' },
        { text: 'The fibre: core area $\\pi\\,(0.025)^2 = 1.96\\times10^{-3}$ mm², and $n\\sin\\theta$ is the NA, 0.22:', tex: 'G_t = \\pi \\times 1.96\\times10^{-3} \\times 0.22^2 = 3.0\\times10^{-4}\\ \\mathrm{mm^2\\,sr}' },
        { text: 'The ratio is the ceiling:', tex: '\\eta_{\\max} = \\frac{3.0\\times10^{-4}}{3.14} = 9.5\\times10^{-5}' }
      ],
      a: 'About 0.01 %. The fibre is the bottleneck in both area and angle, and nothing placed between them can change that. Use a laser, or a much larger-core fibre, or a light guide.'
    },
    {
      title: 'How big an LED can a projector use?',
      q: 'A projector has a 0.7-inch panel of 135 mm² and a lens at f/2.4. What is the largest Lambertian LED chip whose light it can use completely?',
      steps: [
        { text: 'The étendue of the panel and its lens:', tex: 'G = \\frac{\\pi A}{4N^2} = \\frac{\\pi \\times 135}{4 \\times 5.76} = 18.4\\ \\mathrm{mm^2\\,sr}' },
        { text: 'A Lambertian chip has $G = \\pi A_{\\mathrm{chip}}$, so', tex: 'A_{\\mathrm{chip}} \\le \\frac{18.4}{\\pi} = 5.9\\ \\mathrm{mm^2}' }
      ],
      a: 'About 5.9 mm², roughly 2.4 mm square. A larger chip wastes light at the aperture; to get a brighter picture one needs a chip of higher radiance, not a bigger one.'
    }
  ],
  quiz: [
    { q: 'What is the étendue of a Lambertian LED chip of 2 mm², in mm²·sr?', answer: 6.283, unit: 'mm²', why: '$G = \\pi A n^2\\sin^2\\theta = \\pi \\times 2 \\times 1 \\times 1 = 6.28$ mm²·sr, since a Lambertian emitter fills the whole hemisphere (θ = 90°).' },
    { q: 'A lens is placed between a lamp and a fibre. Which is true of the étendue of the light entering the fibre?', choices: ['The lens can reduce it below the lamp\'s', 'It is at least as large as the lamp\'s, even when some light is lost', 'It equals the lens\'s focal length', 'It is always the fibre\'s'], a: 1, why: 'A passive lens cannot reduce the étendue; only apertures that throw light away can. So the étendue of the light in the fibre is that of the source, or less if some was lost.' },
    { q: 'A laser can be focused into a thin fibre far more easily than an LED because its étendue is far smaller.', a: true, why: 'A single-mode laser has an étendue of about λ², some ten million times less than an LED chip, so it fits easily into the area and acceptance of a thin fibre.' },
    { q: 'A fibre has a core 100 µm across and an NA of 0.22. What is its étendue, in mm²·sr?', answer: 0.001194, unit: 'mm²', why: 'The core area is $\\pi\\,(0.05)^2 = 7.85\\times10^{-3}$ mm², and $G = \\pi \\times 7.85\\times10^{-3} \\times 0.22^2 = 1.19\\times10^{-3}$ mm²·sr.' },
    { q: 'A source has four times the étendue of the system that receives its light. At best what share of its light can be coupled in?', choices: ['100 %', '50 %', '25 %', '6 %'], a: 2, why: 'The ceiling is the ratio of the étendues, 1/4: the receiver can hold only a quarter of the source\'s phase space.' }
  ],
  applications: [
    'Choosing an LED or lamp for a projector, a headlamp or a microscope illuminator: the source étendue must not exceed what the optics can accept.',
    'Launching light into a fibre or light guide: laser diodes couple at tens of per cent into single-mode fibre, LEDs into large-core multimode fibre and light guides only.',
    'Solar concentrators and non-imaging optics, designed to approach the étendue limit, as compound parabolic concentrators do.',
    'Spectrographs and astronomical instruments, where image slicers and fibre bundles re-shape a round image into a thin slit without losing light.',
    'Estimating how much light a camera or telescope can collect, from its aperture and the area of its sensor.'
  ],
  history: 'The word comes from the French for "extent". The conservation law is an optical form of Joseph Liouville\'s theorem of 1838 on the volume of ray bundles in phase space, and of the second-law argument of Clausius a generation later; it became the foundation of non-imaging optics in the 1970s.',
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — étendue, its conservation and the limits of concentration.',
    'J. Chaves, *Introduction to Nonimaging Optics* (CRC Press) — étendue and the design of concentrators.',
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — throughput and the AΩ product.'
  ],
  sim: 'rp-etendue'
},

/* ================================================================ the integrating sphere */
{
  id: 'the-integrating-sphere', parent: 'radiometry-and-photometry', title: 'The integrating sphere', level: 2,
  short: 'An integrating sphere is a hollow ball coated inside with a highly diffuse white reflector. Light inside it is scattered again and again until every part of the wall is equally lit, so a lamp in the sphere gives a wall illuminance proportional to its total flux, whatever its pattern. That is how lamp lumens are measured; used the other way round, it makes a perfectly even source.',
  keywords: ['integrating sphere', 'Ulbricht sphere', 'sphere multiplier', 'total luminous flux', 'diffuse reflectance', 'uniform source', 'baffle', 'port fraction', 'PTFE', 'barium sulfate', 'goniophotometer', 'spectrophotometer sphere', 'laser power meter', 'flat field'],
  prereq: ['lambertian-surfaces', 'radiometric-quantities'],
  related: ['measuring-light', 'spectrophotometers', 'diffusers-and-ground-glass', 'laser-power-and-energy-measures', 'lamp-efficacy-and-lifetime', 'illuminance-levels-in-practice'],
  body: `
How do you measure *all* the light a lamp gives off, when it sends different amounts in different directions? You could walk a detector round it and add up the readings, which is what a goniophotometer does. Or you could put the lamp inside a ball whose wall scatters the light so thoroughly that one small detector sees the total. That is the **integrating sphere**, described by Richard Ulbricht around 1900.

### How it works
The inside is coated with a white, nearly Lambertian material ([[lambertian-surfaces]]) of reflectance $\\rho$ between 0.95 and 0.99. Each time light strikes the wall it is scattered into all directions by the cosine law. A special property of the sphere then does the rest: a Lambertian patch irradiates every other point of the wall *equally*, wherever the patch is. After the first strike the scattered light is spread evenly over the whole wall, and the illuminance it gives is proportional to the total flux and to nothing else about the lamp. A **baffle** in front of the detector port hides it from the lamp, so that only scattered light is seen.

### The sphere multiplier
Each strike loses $1-\\rho$ to absorption, and a fraction $f$ of the sphere's area is ports (holes), through which light escapes. Adding up the light after each bounce, the wall's irradiance from scattered light is

$$E = \\frac{\\Phi}{4\\pi R^2}\\,M, \\qquad M = \\frac{\\rho}{1 - \\rho\\,(1 - f)}$$

for a sphere of radius $R$ and a lamp of flux $\\Phi$. $M$ is the **sphere multiplier**: how many times the wall is brighter than it would be if the first strike were all. A photon strikes the wall $1/(1-\\rho(1-f))$ times on average.

| Wall reflectance $\\rho$ | Ports $f$ | Multiplier $M$ | Average strikes |
|---|---|---|---|
| 0.99 | 1 % | 50 | 50 |
| 0.98 | 2 % | 25 | 25 |
| 0.95 | 2 % | 14 | 14.5 |
| 0.90 | 5 % | 6.2 | 6.9 |

The multiplier is startlingly sensitive to the coating. A fall in reflectance from 0.98 to 0.95, through dust or a fingerprint, nearly halves it. That is why ports are kept below about 5 % of the area, and why the white coating (sintered PTFE, barium sulfate) is kept clean.

### Measuring a lamp's total flux
The lamp is hung at the centre of the sphere (so-called 4π geometry) or fixed on a port (2π geometry, used for LEDs). A detector with a $V(\\lambda)$ filter looks at the wall behind the baffle. Its reading is proportional to the total flux, so the lamp is compared with a standard lamp of known lumens in the same sphere: $\\Phi = \\Phi_{\\mathrm{std}} \\times (\\mathrm{reading}/\\mathrm{reading}_{\\mathrm{std}})$. The lamp and its holder absorb some light, which is corrected with an auxiliary lamp. The method is set out in CIE publications for lamps and for LEDs.

### The sphere as a source
Run it backwards: shine a lamp in at one port, and the exit port is an almost perfectly uniform, Lambertian source. With the wall seen from the port lit only by scattered light, its luminance is $L = \\rho E/\\pi$. Uniform-source spheres calibrate cameras (flat-field correction), radiance standards and display testers.

### Other uses, and limits
- **Reflectance and haze**: a spectrophotometer with a sphere gathers the light a sample scatters in all directions, not just the mirror one.
- **Laser power**: a sphere in front of a detector averages the beam, so the reading does not depend on where, at what angle, or in what polarization it arrives.
- **Time**: the light lingers for some nanoseconds, so fast pulses are smeared.
- **Spectrum**: the coating's reflectance varies with wavelength: barium sulfate falls in the ultraviolet, PTFE stays high from the ultraviolet to the near infrared, and gold-coated spheres serve the infrared.

> [!key] A sphere with a diffuse white wall spreads the light evenly over its inside: $E = \\Phi M/(4\\pi R^2)$ with $M = \\rho/(1 - \\rho(1-f))$. The wall reading measures total flux, whatever the lamp's directions, provided the wall is clean and the ports small.
`,
  ideas: [
    'A diffuse white sphere scatters light until every point of the wall is equally irradiated, so one detector reads the total flux.',
    'The wall irradiance is E = Φ·M/(4πR²), with the sphere multiplier M = ρ/(1 − ρ(1 − f)).',
    'A baffle hides the detector from the lamp, so the reading does not depend on the lamp\'s direction pattern.',
    'The multiplier is very sensitive to the reflectance: 0.98 to 0.95 nearly halves it; ports should be under about 5 % of the area.',
    'Used backwards, a sphere is a uniform Lambertian source for calibrating cameras and displays.'
  ],
  pitfalls: [
    'The sphere only works if the lamp is at the middle — Any position works, because each point of the wall irradiates all the others equally. What matters is the baffle, which stops the detector seeing the lamp, and the small ports.',
    'A sphere makes the light brighter, as a lens does — The wall is brighter than the lamp would make it with one strike, by the multiplier, but only because the same light is counted again and again. A sphere cannot raise the radiance of the lamp itself, and the sphere has absorbed much of the flux.',
    'Any white paint will do — The reflectance must be high, 0.95 or more, and diffuse. A paint of 0.85 gives a multiplier of only about 5, and its aging changes the calibration.',
    'The bigger the ports the better, to let more light out — Ports are holes: each reduces the multiplier and the evenness. They are kept to a few per cent of the surface.'
  ],
  terms: [
    { term: 'Integrating sphere', also: ['Ulbricht sphere', 'photometric sphere'], def: 'A hollow sphere with a diffuse white inner coating and small ports, in which light is scattered until the wall is evenly irradiated. It measures total flux and makes uniform sources.' },
    { term: 'Sphere multiplier', also: ['sphere multiplication factor'], def: 'The factor by which multiple scattering raises the wall irradiance, M = ρ/(1 − ρ(1 − f)), for wall reflectance ρ and port fraction f.' },
    { term: 'Port fraction', def: 'The fraction of the sphere\'s inner surface occupied by openings (entrance, exit and detector ports), through which light is lost.' },
    { term: 'Baffle', def: 'A small diffusely coated screen inside the sphere that blocks the direct view between the lamp and the detector, so that the detector sees only scattered light.' },
    { term: 'Goniophotometer', def: 'An instrument that measures a lamp\'s or luminaire\'s intensity in many directions by moving a detector or the lamp, and so builds the intensity distribution and the total flux.' }
  ],
  formulas: [
    {
      name: 'Sphere multiplier',
      expr: 'M = rho/(1 - rho*(1 - f))', tex: 'M = \\frac{\\rho}{1 - \\rho\\,(1 - f)}',
      vars: {
        M: { name: 'sphere multiplier' },
        rho: { name: 'reflectance of the wall', value: 0.98, min: 0, max: 0.9999, tex: '\\rho' },
        f: { name: 'fraction of the sphere\'s area taken by ports', value: 0.02, min: 0.0001, max: 0.5 }
      },
      note: 'Valid for a diffuse wall with the ports and baffle small. Default: PTFE-like wall and 2 % ports.',
      stories: { M: 'A sphere with a wall of reflectance {rho} and a port fraction of {f}: what is its multiplier?' }
    },
    {
      name: 'Wall irradiance from the scattered light',
      expr: 'E = Fv*M/(4*pi*R^2)', tex: 'E = \\frac{\\Phi_v\\,M}{4\\pi R^2}',
      vars: {
        E: { name: 'illuminance of the wall', q: 'illuminance', unit: 'lx' },
        Fv: { name: 'luminous flux of the lamp', q: 'luminousflux', unit: 'lm', value: 100, tex: '\\Phi_v' },
        M: { name: 'sphere multiplier', value: 24.7 },
        R: { name: 'radius of the sphere', q: 'length', unit: 'cm', value: 15 }
      },
      note: 'Light that has been scattered at least once; the wall seen by a baffled detector.',
      stories: { E: 'A lamp of {Fv} burns in a sphere of radius {R} and multiplier {M}. What is the wall illuminance?' }
    },
    {
      name: 'Average number of wall strikes',
      expr: 'n = 1/(1 - rho*(1 - f))', tex: 'n = \\frac{1}{1 - \\rho\\,(1 - f)}',
      vars: {
        n: { name: 'average number of strikes before a photon is absorbed or escapes' },
        rho: { name: 'reflectance of the wall', value: 0.98, min: 0, max: 0.9999, tex: '\\rho' },
        f: { name: 'fraction of the sphere\'s area taken by ports', value: 0.02, min: 0.0001, max: 0.5 }
      },
      note: 'Also the number of times a photon crosses the sphere: a sphere of 30 cm gives the light a path of metres.',
      stories: { n: 'In a sphere of wall reflectance {rho} and port fraction {f}, how many wall strikes does a photon make on average?' }
    },
    {
      name: 'Luminance of the wall seen from a port',
      expr: 'L = rho*Fv*M/(4*pi^2*R^2)', tex: 'L = \\frac{\\rho\\,\\Phi_v\\,M}{4\\pi^2 R^2}',
      vars: {
        L: { name: 'luminance of the baffled wall', q: 'luminance', unit: 'cd/m²' },
        rho: { name: 'reflectance of the wall', value: 0.98, min: 0, max: 1, tex: '\\rho' },
        Fv: { name: 'luminous flux of the lamp', q: 'luminousflux', unit: 'lm', value: 100, tex: '\\Phi_v' },
        M: { name: 'sphere multiplier', value: 24.7 },
        R: { name: 'radius of the sphere', q: 'length', unit: 'cm', value: 15 }
      },
      note: 'A matt wall lit with E has L = ρE/π. This is the luminance of a uniform source made from the sphere.',
      stories: { L: 'A lamp of {Fv} shines in a sphere of radius {R}, multiplier {M} and wall reflectance {rho}. What is the luminance of the wall?' }
    }
  ],
  examples: [
    {
      title: 'A 30 cm sphere with a 100 lm lamp',
      q: 'A sphere of diameter 30 cm has a wall reflectance of 0.98 and ports that take 2 % of its area. A 100 lm lamp burns inside, with a baffle in front of the detector. What are the multiplier, the wall illuminance and the wall luminance?',
      steps: [
        { text: 'The multiplier:', tex: 'M = \\frac{0.98}{1 - 0.98 \\times 0.98} = \\frac{0.98}{0.0396} = 24.7' },
        { text: 'With $R = 0.15$ m the wall area is $4\\pi R^2 = 0.283$ m², so', tex: 'E = \\frac{100 \\times 24.7}{0.283} = 8700\\ \\mathrm{lx}' },
        { text: 'A matt wall of reflectance 0.98 lit with that has the luminance', tex: 'L = \\frac{\\rho E}{\\pi} = \\frac{0.98 \\times 8700}{\\pi} = 2700\\ \\mathrm{cd/m^2}' }
      ],
      a: 'M = 24.7, a wall illuminance of 8700 lx and a luminance of 2700 cd/m². The 100 lm lamp has made a wall lit like bright daylight: the light has been counted about 25 times.'
    },
    {
      title: 'A dirty coating',
      q: 'The wall of the sphere above has been dirtied and its reflectance has fallen from 0.98 to 0.95. What happens to the multiplier, and so to the reading for the same lamp?',
      steps: [
        { text: 'Recompute with $\\rho = 0.95$:', tex: 'M = \\frac{0.95}{1 - 0.95 \\times 0.98} = \\frac{0.95}{0.069} = 13.8' },
        'Compare with 24.7: the multiplier, and so the reading for a given lamp, has fallen to 56 %.'
      ],
      a: 'The multiplier falls from 24.7 to 13.8. A 3 % loss of reflectance cost 44 % of the signal, which is why the sphere is calibrated often and kept clean.'
    }
  ],
  quiz: [
    { q: 'A sphere has a wall reflectance of 0.98 and ports taking 2 % of its area. What is its multiplier?', answer: 24.7, why: '$M = \\rho/(1 - \\rho(1 - f)) = 0.98/(1 - 0.98 \\times 0.98) = 0.98/0.0396 = 24.7$.' },
    { q: 'What is the baffle in an integrating sphere for?', choices: ['to hide the detector from the lamp, so that it sees only scattered light', 'to make the wall brighter', 'to absorb stray light', 'to hold the lamp'], a: 0, why: 'Light going straight from the lamp to the detector would depend on the lamp\'s direction pattern. With the baffle the detector sees only scattered light, which is proportional to the total flux.' },
    { q: 'A lamp that sends most of its light upwards gives a different reading from the same lamp turned downwards, in an integrating sphere with baffle.', a: false, why: 'The scattering evens out the direction pattern: the wall irradiance depends on the total flux, not on where the lamp sends it. That is the purpose of the sphere.' },
    { q: 'If the reflectance of the wall falls from 0.98 to 0.95 (ports 2 %), the multiplier changes by a factor of about:', choices: ['0.97', '0.8', '0.56', '0.1'], a: 2, why: 'M falls from 24.7 to 13.8, a factor of 0.56. A small loss of reflectance is magnified, because the light bounces some twenty-five times.' },
    { q: 'A lamp of 200 lm burns in a sphere of 20 cm radius and multiplier 30. What is the wall illuminance, in lux?', answer: 11937, unit: 'lx', why: '$E = \\Phi M/(4\\pi R^2) = 200 \\times 30/(4\\pi \\times 0.04) = 6000/0.5027 = 11\\,900$ lx.' }
  ],
  applications: [
    'Measuring the total luminous flux of lamps and luminaires, as CIE publications describe, and of LED packages and modules.',
    'Spectrophotometers with a sphere attachment, to measure diffuse reflectance, transmittance and haze of paper, plastics and coatings.',
    'Uniform light sources for flat-field calibration of cameras and sensors, and radiance standards.',
    'Laser and LED power meters, in which the sphere removes the sensitivity to beam position, angle and polarization.',
    'Display and light-source testing, and photosynthetic or photobiological chambers, where an even field of light is wanted.'
  ],
  history: 'The sphere is named for the German engineer Richard Ulbricht, who proposed it as a photometer of the total light of a lamp about 1900. It remained the standard of lamp measurement for more than a century, and spheres several metres across are still used for luminaires.',
  sources: [
    'CIE 84:1989, *The Measurement of Luminous Flux* — total-flux measurement with a sphere and with a goniophotometer.',
    'CIE 127:2007, *Measurement of LEDs* — sphere geometries for LED packages and modules.',
    'J. M. Palmer and B. G. Grant, *The Art of Radiometry* (SPIE Press, 2009) — the sphere multiplier and its uses.'
  ],
  sim: 'rp-sphere'
},

/* ================================================================ measuring light */
{
  id: 'measuring-light', parent: 'radiometry-and-photometry', title: 'Light meters and spectroradiometers', level: 2,
  short: 'Each quantity of light has its own instrument: a lux meter for illuminance, a luminance meter for brightness, a spectroradiometer for the whole spectrum and everything computed from it, a power meter for laser watts. A good one corrects the detector so that it responds as the eye does to colour (V(λ)) and to direction (the cosine law), and is calibrated against a standard lamp.',
  keywords: ['lux meter', 'illuminance meter', 'luminance meter', 'spot meter', 'spectroradiometer', 'photometer', 'radiometer', 'laser power meter', 'thermopile', 'pyranometer', 'cosine correction', 'V(lambda) filter', 'spectral mismatch', 'f1 prime', 'calibration', 'standard lamp', 'goniophotometer'],
  prereq: ['photometric-quantities', 'the-luminosity-function', 'the-integrating-sphere'],
  related: ['illuminance-levels-in-practice', 'spectrophotometers', 'laser-power-and-energy-measures', 'metering-and-exposure-value', 'quantum-efficiency-and-spectral-response', 'colour-temperature-and-colour-rendering', 'electronics:photodiodes'],
  body: `
To measure light, a detector must answer one particular question, and different questions need different instruments. The sensor that tells you a desk is dim is not the one that tells you what a lamp emits, and neither is the one that tells you how bright a screen looks.

### The instruments
| Instrument | Measures | How it works | Typical use |
|---|---|---|---|
| Illuminance meter ("lux meter") | illuminance, lx | photodiode behind a $V(\\lambda)$ filter and a diffuser | rooms, desks, roads, sports fields |
| Luminance meter ("spot meter") | luminance, cd/m² | a lens images a small patch of the scene onto a detector | screens, signs, road surfaces |
| Spectroradiometer | spectral irradiance or radiance | grating and array detector | LEDs and lamps: spectrum, lm, colour temperature, colour rendering |
| Sphere with photometer | luminous flux, lm | [[the-integrating-sphere]] | lamps, LED packages |
| Goniophotometer | intensity in every direction, cd | a detector moved around the lamp | luminaires, headlamps |
| Power meter | optical power, W | a thermopile (any wavelength) or a photodiode | lasers, UV curing, infrared sources |
| Pyranometer | solar irradiance, W/m² | a thermopile under glass domes, 0.3 to 3 µm | weather stations, solar plants |

### The lux meter and its two corrections
Its heart is a silicon photodiode, and two things must be put right. First, a bare silicon cell is nothing like the eye: it peaks in the near infrared, sees blue poorly and responds to infrared the eye cannot see. A glass filter shapes its response to $V(\\lambda)$ ([[the-luminosity-function]]); the leftover error under different lamps is its **spectral mismatch**, $f_1'$ in the standard. Second, the reading must obey the cosine law: light from 60° off the axis must count half. A flat window loses more at glancing angles, through Fresnel reflection, so the meter has a diffuser dome that corrects its directional response; the error is $f_2$. Standards such as ISO/CIE 19476 grade meters by these errors. The simulation shows both, with a schematic response curve for the bare cell.

### The luminance meter
A lens and a field aperture fix a measurement angle of 1°, 1/3° or less. The meter reports the luminance averaged over the patch it sees, so the patch must lie inside a uniform area. A 1° field at 3 m covers a disc 52 mm across, at 10 m 175 mm; to read the lit stroke of a letter 20 mm wide at 3 m a 1/3° field (17 mm) is needed.

### The spectroradiometer
A grating or prism spreads the light over an array detector, giving the spectrum at 1 to 5 nm resolution. Everything else is computed from it: lumens by weighting with $V(\\lambda)$, chromaticity, colour temperature, colour rendering. It is calibrated against a standard lamp of known spectral irradiance, traceable to a national laboratory. Its enemies are stray light and drift.

### Power meters for lasers and infrared
A **thermopile** absorbs the beam as heat: it reads any wavelength, from milliwatts to kilowatts, but takes seconds. A **photodiode** is fast and sensitive (nanowatts) but is calibrated per wavelength and saturates. A **pyroelectric** detector measures the energy of pulses ([[laser-power-and-energy-measures]]).

### A trick with a white card
Where there is no room for a lux meter, a luminance meter on a white reference card (reflectance $\\rho$) gives the illuminance: $E = \\pi L/\\rho$.

### Good practice
- Measure in the plane that matters (the desk, a vertical plane facing the face, the road) with the sensor face parallel to it, and keep your shadow out of its field.
- Meters average flicker; a fast pulsing needs a flicker meter.
- A phone app uses a sensor that is not corrected like a meter's: good for rough comparisons, not for checking a standard.
- Recalibrate regularly: filters and diffusers age.

> [!key] Choose the instrument by the quantity: lux meter for illuminance, luminance meter for brightness, spectroradiometer for spectrum and colour, sphere for flux, power meter for watts. A detector measures lux only when corrected to $V(\\lambda)$ and to the cosine law.
`,
  ideas: [
    'Each quantity has its instrument: lux meter, luminance meter, spectroradiometer, sphere, goniophotometer, power meter.',
    'A lux meter is a silicon photodiode corrected to V(λ) by a filter and to the cosine law by a diffuser.',
    'A bare silicon detector calibrated under one lamp reads wrongly under another, because its response differs from the eye\'s.',
    'A luminance meter averages over a small field angle; the measured patch must be uniform and larger than the spot.',
    'A spectroradiometer measures the spectrum, from which lumens, chromaticity, colour temperature and colour rendering are computed.'
  ],
  pitfalls: [
    'Any photodiode measures lux — A bare silicon cell responds to infrared the eye cannot see and under-responds to blue. Without a V(λ) correction it reads wrongly by large factors under different lamps.',
    'A phone light-sensor app is as good as a lux meter — The sensor is not corrected for the cosine law or V(λ) as a meter is. It is useful for comparing places, not for compliance with a standard.',
    'A luminance meter reads whatever is in front of it — It reads the average over its field. If the field includes the dark surround of a small bright object, the reading is too low.',
    'Pointing the sensor at the lamp measures the lux on the desk — Illuminance is measured in the plane of the surface in question. Facing the sensor at the lamp reads the light on a plane square to the lamp, which is higher.'
  ],
  terms: [
    { term: 'Illuminance meter', also: ['lux meter', 'photometer head'], def: 'An instrument measuring illuminance in lux: a photodiode behind a V(λ)-correcting filter and a cosine-correcting diffuser.' },
    { term: 'Luminance meter', also: ['spot meter', 'spot photometer'], def: 'An instrument measuring luminance in cd/m² over a small field angle, with a lens that images a patch of the scene on its detector.' },
    { term: 'Spectroradiometer', def: 'An instrument that measures the spectral power distribution of light, as irradiance or radiance per nanometre. Photometric and colorimetric quantities are computed from it.' },
    { term: 'Spectral mismatch error', also: ['f1′', 'V(λ) mismatch'], def: 'The error caused by a photometer\'s spectral response differing from V(λ); it shows up as a different reading for lamps of different spectra.' },
    { term: 'Cosine error', also: ['f2', 'directional response error'], def: 'The deviation of an illuminance meter\'s response to light from an oblique direction from the ideal cosine law.' },
    { term: 'Standard lamp', also: ['calibration lamp'], def: 'A lamp of known and traceable output, burning at a set current, against which photometers and spectroradiometers are calibrated.' }
  ],
  formulas: [
    {
      name: 'Illuminance from a white card',
      expr: 'E = pi*L/rho', tex: 'E = \\frac{\\pi\\,L}{\\rho}',
      vars: {
        E: { name: 'illuminance on the card', q: 'illuminance', unit: 'lx' },
        L: { name: 'luminance of the card, read by the luminance meter', q: 'luminance', unit: 'cd/m²', value: 95 },
        rho: { name: 'reflectance of the white card', value: 0.9, min: 0.01, max: 1, tex: '\\rho' }
      },
      note: 'For a matt card in the plane where the illuminance is wanted.',
      stories: { E: 'A luminance meter reads {L} on a white card of reflectance {rho}. What is the illuminance on the card?' }
    },
    {
      name: 'Size of the spot a luminance meter reads',
      expr: 'd = 2*D*tan(al/2)', tex: 'd = 2\\,D\\,\\tan\\frac{\\alpha}{2}',
      vars: {
        d: { name: 'diameter of the measured spot', q: 'length', unit: 'mm' },
        D: { name: 'distance from the meter to the surface', q: 'length', unit: 'm', value: 3 },
        al: { name: 'measurement field angle of the meter', q: 'angle', unit: '°', value: 1, min: 0.01, max: 90, tex: '\\alpha' }
      },
      note: 'The patch being measured must be at least this large and uniform.',
      stories: { d: 'A meter with a field angle of {al} looks at a surface {D} away. How wide is the spot it averages over?' }
    },
    {
      name: 'Mean irradiance of a laser beam on a detector',
      expr: 'E = 4*P/(pi*d^2)', tex: 'E = \\frac{4P}{\\pi d^2}',
      vars: {
        E: { name: 'mean irradiance over the beam', q: 'intensity', unit: 'W/cm²' },
        P: { name: 'optical power', q: 'power', unit: 'mW', value: 5 },
        d: { name: 'beam diameter', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'For a beam of even irradiance. A Gaussian beam peaks at twice the mean of its 1/e² circle.',
      stories: { E: 'A beam of {P} and diameter {d} falls on a detector. What is its mean irradiance?' }
    },
    {
      name: 'Photocurrent of a photodiode',
      expr: 'I = R*P', tex: 'I = R\\,P',
      vars: {
        I: { name: 'photocurrent', q: 'current', unit: 'µA' },
        R: { name: 'responsivity at the wavelength', q: 'responsivity', unit: 'A/W', value: 0.42 },
        P: { name: 'optical power on the diode', q: 'power', unit: 'mW', value: 1 }
      },
      note: 'Silicon gives about 0.4 A/W in the red and 0.6 A/W near 900 nm, and nothing beyond 1100 nm.',
      stories: { I: 'A photodiode with a responsivity of {R} receives {P}. What current does it give?' }
    }
  ],
  examples: [
    {
      title: 'Lux from a white card',
      q: 'A luminance meter reads 95 cd/m² on a white card of reflectance 0.9 lying on a desk. What is the illuminance on the desk?',
      steps: [
        { text: 'The card is a matt reflector, so $L = \\rho E/\\pi$. Solving for $E$:', tex: 'E = \\frac{\\pi L}{\\rho} = \\frac{\\pi \\times 95}{0.9} = 332\\ \\mathrm{lx}' }
      ],
      a: 'About 330 lx. A lux meter on the same spot would give the same answer, if it is good, and neither includes the light that does not reach that plane.'
    },
    {
      title: 'Will the spot meter see the letters?',
      q: 'The lit strokes of a sign are 20 mm wide. A luminance meter has a 1° field. Can it read a stroke from 3 m? What about a meter with a 1/3° field?',
      steps: [
        { text: 'The 1° spot at 3 m:', tex: 'd = 2 \\times 3 \\times \\tan(0.5°) = 0.052\\ \\mathrm{m} = 52\\ \\mathrm{mm}' },
        { text: 'The 1/3° spot:', tex: 'd = 2 \\times 3 \\times \\tan(0.167°) = 0.0175\\ \\mathrm{m} = 17.5\\ \\mathrm{mm}' }
      ],
      a: 'The 1° meter averages over 52 mm, mostly dark background, and reads far too low. The 1/3° meter\'s 17.5 mm spot fits inside the 20 mm stroke, but only just; a short distance helps.'
    }
  ],
  quiz: [
    { q: 'Why does a good lux meter have a white diffuser dome over its photodiode?', choices: ['To give it a cosine response to light from different directions', 'To keep dust off', 'To make it read V(λ)', 'To reduce flicker'], a: 0, why: 'Light arriving at 60° from the axis must count half as much as light on the axis. The shape of the diffuser corrects the angular response of the bare window, which falls off too fast at glancing angles.' },
    { q: 'A luminance meter has a 1° field. How wide is the spot it reads at 10 m, in millimetres?', answer: 174.5, unit: 'mm', why: '$d = 2 D\\tan(\\alpha/2) = 2 \\times 10 \\times \\tan 0.5° = 0.1745$ m.' },
    { q: 'A bare silicon photodiode, calibrated under a tungsten lamp, will read the correct lux under any other lamp.', a: false, why: 'Its response is not V(λ), and a tungsten lamp is rich in the infrared to which silicon responds. Under an LED or daylight it reads wrongly by a large factor, which is why photometers carry a V(λ) filter.' },
    { q: 'A luminance meter reads 60 cd/m² on a white card of reflectance 0.9. What is the illuminance on the card, in lux?', answer: 209.4, unit: 'lx', why: '$E = \\pi L/\\rho = \\pi \\times 60/0.9 = 209$ lx.' },
    { q: 'Which instrument gives the correlated colour temperature of a lamp?', choices: ['a lux meter', 'a luminance meter', 'a spectroradiometer', 'a thermopile power meter'], a: 2, why: 'Colour temperature is computed from the spectrum. A spectroradiometer measures it; a lux meter has just one reading, and a thermopile only the total power.' }
  ],
  applications: [
    'Checking lighting installations against the lux required by a standard, in offices, schools, roads and sports grounds.',
    'Testing displays and signs: luminance, uniformity and contrast measured with luminance meters or imaging luminance cameras.',
    'Characterizing LEDs and lamps: lumens, efficacy, colour temperature and colour rendering from a spectroradiometer and a sphere.',
    'Laser and UV-curing work, where power meters and irradiance probes set the dose.',
    'Solar resource assessment with pyranometers, and photography with incident-light exposure meters.'
  ],
  history: 'For a century the detector of photometry was the eye: Bunsen\'s grease-spot photometer (1843) and the Lummer–Brodhun cube (1889) let an observer judge when two patches matched. In the 1930s selenium and then silicon photocells took over, and the work of the standards laboratories became making their response match the eye\'s.',
  sources: [
    'ISO/CIE 19476:2014, *Characterization of the performance of illuminance meters and luminance meters* — the error classes, including the V(λ) mismatch and the cosine response.',
    'J. M. Palmer and B. G. Grant, *The Art of Radiometry* (SPIE Press, 2009) — detectors, calibration and uncertainty.',
    'W. R. McCluney, *Introduction to Radiometry and Photometry* (Artech House) — photometers and their corrections.'
  ],
  sim: 'rp-meters'
},

/* ================================================================ light levels in practice */
{
  id: 'illuminance-levels-in-practice', parent: 'radiometry-and-photometry', title: 'Light levels in practice', level: 1,
  short: 'Natural light spans eight orders of magnitude from starlight to direct sunshine, and the eye copes with it by adaptation rather than by its pupil. A table of typical illuminances and luminances, from 0.001 lx under the stars to 100 000 lx in the sun, with what standards ask for in offices and corridors, and what each level means for a camera.',
  keywords: ['illuminance levels', 'lux levels', 'typical lux', 'office lighting 500 lux', 'sunlight lux', 'moonlight lux', 'luminance of the sun', 'EN 12464-1', 'lighting standards', 'stops of light', 'EV', 'photopic', 'mesopic', 'scotopic', 'twilight', 'emergency lighting'],
  prereq: ['lumens-candelas-lux-and-nits', 'the-luminosity-function', 'measuring-light'],
  related: ['room-lighting-and-luminaires', 'daylight-and-skylight', 'glare-and-uniformity', 'metering-and-exposure-value', 'light-and-dark-adaptation', 'the-pupil', 'ergonomics:lighting-levels'],
  body: `
Direct sunlight is a hundred million times more illuminating than starlight, and a person walks from one to the other in a day. Having a feel for the numbers, how many lux a room, a street or a sunny beach carries, is the first thing that makes lux and nits useful.

### Illuminance
| Situation | Illuminance (lx) | Exposure value, ISO 100 |
|---|---|---|
| Direct sunlight | 100 000 | 15.3 |
| Daylight in the open, no direct Sun | 20 000 | 13.0 |
| Operating-theatre field (the surgical light) | 50 000 | 14.3 |
| Overcast day | 5 000 | 11.0 |
| Detailed assembly, inspection | 1 000 | 8.6 |
| Office | 500 | 7.6 |
| Corridor, living room | 100 | 5.3 |
| Street lighting | 10 | 2.0 |
| Twilight | 1 | −1.3 |
| Full Moon | 0.25 | −3.3 |
| Starlight | 0.001 | −11.3 |

Each step to the next row is a few stops; between direct sunlight and a lit office the difference is $\\log_2(100\\,000/500) = 7.6$ stops, between the office and the full Moon 11 stops. The values are typical; real ones vary by a factor of two or more with the sky, the season and the room.

### What standards ask for
Workplace lighting standards (EN 12464-1 in Europe, and similar in other regions) give *maintained* illuminances by task: about 100 lx for corridors and circulation areas, 500 lx for offices, reading and screen work, 750 lx for technical drawing, 1000 lx and more for detailed assembly and inspection. Older eyes need more, because the pupil is smaller and the lens transmits less. Emergency escape routes need at least 1 lx on the floor. A figure is meaningful only with its plane: horizontal at desk height, or vertical at eye level for faces.

### Luminance
| Source or surface | Luminance (cd/m²) |
|---|---|
| The Sun's disc | $1.6\\times10^{9}$ |
| Tungsten filament, LED chip | $10^{7}$ |
| Fluorescent tube | $10^{4}$ |
| Clear blue sky | 5 000 |
| The full Moon's disc | 2 500 |
| Phone or monitor screen | 300 |
| White paper in an office | 120 |
| Night sky | 0.001 |

A matt surface of reflectance $\\rho$ in illuminance $E$ has $L = \\rho E/\\pi$: a white page at 500 lx, 127 cd/m², a grey card, 29. Sources above about $10^4$ cd/m² in the field of view dazzle, which is why tubes are shielded and bare LED chips are never exposed.

### How the eye copes
The pupil changes between roughly 2 and 8 mm, a factor of only 16 in light. The real work is done by **adaptation** in the retina ([[light-and-dark-adaptation]]), which takes minutes for the cones and about half an hour for full dark adaptation. Above a few cd/m² the cones serve (**photopic**), below about 0.005 cd/m² the rods (**scotopic**), and between them the eye is **mesopic**. White paper in full Moon, 0.25 lx, has $L = 0.06$ cd/m² and is mesopic: colours fade. A road at 10 lx, with a surface reflectance of 0.1, has about 0.3 cd/m². At one moment the eye can use a range of luminances of only a few hundred to one.

### And a camera
One stop is a factor of 2 in light. A flat meter calibrated to ISO 2720 gives the exposure value $\\mathrm{EV} = \\log_2(E\\,S/250)$ for sensitivity $S$ (ISO). At ISO 100, 100 000 lx is EV 15 and an office EV 7.6: the sunny-16 rule and the camera menu are the same law as the table.

> [!key] Light levels run from 0.001 lx (stars) through 0.25 (full Moon), 100 (corridor), 500 (office) and 100 000 (direct sun). Each factor of 2 is a stop; the eye copes with the range by adaptation, the pupil's factor 16 being only a small part of it.
`,
  ideas: [
    'Natural illuminance runs from about 0.001 lx under the stars to 100 000 lx in direct sunlight.',
    'Typical standards ask for 100 lx in corridors, 500 lx in offices and 1000 lx or more for fine work, on a stated plane.',
    'A matt surface lit to E has luminance ρE/π; the Sun\'s disc is 1.6 × 10⁹ cd/m², a screen about 300.',
    'The eye adapts over many decades; the pupil changes the light by only a factor of about 16.',
    'Each stop is a factor of 2; exposure value EV = log₂(E·S/250) relates lux to camera settings.'
  ],
  pitfalls: [
    'A room at 1000 lx looks twice as bright as one at 500 lx — The sense of brightness grows much more slowly than the light: doubling the illuminance looks only a little brighter, perhaps a quarter more. A change of a factor of two is a small step for the eye, though a whole stop for a camera.',
    'Outdoor daylight is about as bright as a lit office — It only looks so, because the eye and the camera adapt. Direct sunlight is 200 times the illuminance of an office (100 000 against 500 lx), nearly eight stops more.',
    'The pupil adjusts the eye to the light — It changes the light reaching the retina by about a factor of 16, while natural illuminance spans eight orders of magnitude. The retina\'s adaptation does the rest.',
    'A lux figure fully describes the light — It is for a plane, in a place. Uniformity, glare, direction, colour and flicker are separate, and lux alone says nothing about them.'
  ],
  terms: [
    { term: 'Maintained illuminance', also: ['service illuminance'], def: 'The average illuminance below which a lit area must not fall during the life of an installation, as dirt and ageing reduce the light. It is the figure that lighting standards specify.' },
    { term: 'Working plane', also: ['task plane'], def: 'The plane in which a task is done and an illuminance requirement applies: usually horizontal, at desk height (about 0.75 m above the floor), or the floor itself for circulation areas.' },
    { term: 'Horizontal and vertical illuminance', def: 'The illuminance on a horizontal plane (a desk, the floor) and on a vertical one (a wall, a face, a shelf front). The same room can be well lit in one and poorly in the other.' },
    { term: 'Adaptation', also: ['light adaptation', 'dark adaptation'], def: 'The change in the sensitivity of the visual system with the prevailing light level. It acts through the retina and takes seconds to minutes in the light and up to half an hour in the dark.' }
  ],
  formulas: [
    {
      name: 'Stops between two light levels',
      expr: 'S = log2(E1/E2)', tex: 'S = \\log_2\\frac{E_1}{E_2}',
      vars: {
        S: { name: 'difference in stops', signed: true },
        E1: { name: 'the higher illuminance', q: 'illuminance', unit: 'lx', value: 100000, tex: 'E_1' },
        E2: { name: 'the lower illuminance', q: 'illuminance', unit: 'lx', value: 500, tex: 'E_2' }
      },
      note: 'Each stop is a factor of 2 in light. Default: direct sunlight against an office.',
      stories: { S: 'How many stops of light separate an illuminance of {E1} from one of {E2}?' }
    },
    {
      name: 'Exposure value from the illuminance',
      expr: 'EV = log2(E*iso/C)', tex: '\\mathrm{EV} = \\log_2\\frac{E\\,S}{C}',
      vars: {
        EV: { name: 'exposure value', signed: true, tex: '\\mathrm{EV}' },
        E: { name: 'illuminance on a flat meter', q: 'illuminance', unit: 'lx', value: 500 },
        iso: { name: 'sensitivity, ISO', value: 100, min: 6, max: 1000000, tex: 'S' },
        C: { name: 'calibration constant of a flat incident meter (ISO 2720)', value: 250, fixed: true }
      },
      note: 'For incident-light metering with a flat receiver. A hemispherical receiver uses a constant of about 340.',
      stories: { EV: 'A flat meter reads {E} and the film speed is ISO {iso}. What exposure value is that?' }
    },
    {
      name: 'Luminance of a matt surface',
      expr: 'L = rho*E/pi', tex: 'L = \\frac{\\rho\\,E}{\\pi}',
      vars: {
        L: { name: 'luminance', q: 'luminance', unit: 'cd/m²' },
        rho: { name: 'reflectance of the surface', value: 0.8, min: 0, max: 1, tex: '\\rho' },
        E: { name: 'illuminance', q: 'illuminance', unit: 'lx', value: 500 }
      },
      note: 'For a Lambertian surface. A grey card is 0.18, white paper about 0.8.',
      stories: { L: 'A matt surface of reflectance {rho} lies in an illuminance of {E}. What is its luminance?' }
    },
    {
      name: 'Exposure time at a given exposure value',
      expr: 't = N^2/2^EV', tex: 't = \\frac{N^2}{2^{\\mathrm{EV}}}',
      vars: {
        t: { name: 'exposure time', q: 'time', unit: 's' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 },
        EV: { name: 'exposure value (at the film speed in use)', signed: true, value: 12, tex: '\\mathrm{EV}' }
      },
      note: 'At EV 12 and f/8 the time is 1/64 s.',
      stories: { t: 'At an exposure value of {EV}, what exposure time does f/{N} need?' }
    }
  ],
  examples: [
    {
      title: 'From the office to the full Moon',
      q: 'An office is lit to 500 lx and a landscape by the full Moon to 0.25 lx. How many stops apart are they, and what is the luminance of white paper (ρ = 0.8) in each?',
      steps: [
        { text: 'The ratio of the illuminances is $500/0.25 = 2000$, so', tex: 'S = \\log_2 2000 = 11\\ \\text{stops}' },
        { text: 'The paper: $L = \\rho E/\\pi$. In the office:', tex: 'L = \\frac{0.8 \\times 500}{\\pi} = 127\\ \\mathrm{cd/m^2}' },
        { text: 'In moonlight:', tex: 'L = \\frac{0.8 \\times 0.25}{\\pi} = 0.064\\ \\mathrm{cd/m^2}' }
      ],
      a: '11 stops; 127 against 0.064 cd/m². The moonlit paper is in the mesopic range, where colour vision is poor.'
    },
    {
      title: 'An exposure under a bright overcast sky',
      q: 'A flat meter reads 10 000 lx under a bright overcast sky. At ISO 100 and f/8, what exposure time is needed?',
      steps: [
        { text: 'The exposure value:', tex: '\\mathrm{EV} = \\log_2\\frac{10\\,000 \\times 100}{250} = \\log_2 4000 = 11.97' },
        { text: 'The time:', tex: 't = \\frac{N^2}{2^{\\mathrm{EV}}} = \\frac{64}{4000} = \\frac{1}{62}\\ \\mathrm{s}' }
      ],
      a: 'EV 12, about 1/60 s at f/8: the sunny-16 rule for an overcast sky, with the lux shown as stops.'
    }
  ],
  quiz: [
    { q: 'How many stops of light separate direct sunlight (100 000 lx) from a lit office (500 lx)?', answer: 7.64, why: '$\\log_2(100\\,000/500) = \\log_2 200 = 7.64$ stops.' },
    { q: 'White paper with reflectance 0.8 lies under 500 lx. What is its luminance, in cd/m²?', answer: 127.3, unit: 'cd/m²', why: '$L = \\rho E/\\pi = 0.8 \\times 500/\\pi = 127$ cd/m².' },
    { q: 'A full Moon gives about the same illuminance as street lighting.', a: false, why: 'A full Moon gives roughly 0.25 lx and a lit street 10 lx or more, forty times as much.' },
    { q: 'By how much can the pupil change the light reaching the retina, between 2 mm and 8 mm?', choices: ['about 4 times', 'about 16 times', 'about 1000 times', 'about 100 000 times'], a: 1, why: 'The area goes as the diameter squared: (8/2)² = 16. Adaptation in the retina provides the other seven or eight orders of magnitude.' },
    { q: 'A flat meter reads 10 000 lx; ISO 100, f/8. Which exposure time is closest?', choices: ['1/8 s', '1/60 s', '1/500 s', '1/4000 s'], a: 1, why: 'EV = log₂(10 000 × 100/250) ≈ 12, and $t = N^2/2^{EV} = 64/4096 ≈ 1/64$ s.' }
  ],
  applications: [
    'Lighting design and inspection: matching the lux on the work plane to the task, and checking it with a meter.',
    'Safety lighting: emergency escape routes, stairs and car parks have minimum illuminances, written in lux.',
    'Photography and film: the exposure value of a scene, in stops, follows from its illuminance and the film speed.',
    'Display design: the screen\'s nits must compete with the luminance of the room and of the surroundings, from a dark cinema to a sunlit street.',
    'Astronomy and wildlife: the darkness of the night sky, at about 0.001 cd/m², is protected against light pollution.'
  ],
  sources: [
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places* — maintained illuminances by task.',
    'IES, *The Lighting Handbook*, 10th edition — typical illuminances and luminances and the photometric ranges.',
    'ISO 2720, *General purpose photographic exposure meters (photoelectric type) — Guide to product specification* — the calibration constants of exposure meters.'
  ],
  sim: 'rp-levels'
}

);
