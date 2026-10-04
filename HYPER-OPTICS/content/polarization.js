/* HYPER-OPTICS · content/polarization.js — the topic "Polarization".
 *   polarization-states                        linear, circular, elliptical, unpolarized; the degree of polarization
 *   polarizers-and-malus-law                   dichroic, wire-grid and crystal polarizers; I = I0 cos²θ; the third polarizer
 *   polarization-by-reflection-and-scattering  Brewster's angle, glare, the polarized sky
 *   birefringence                              ordinary and extraordinary rays; calcite and quartz; walk-off
 *   wave-plates                                quarter- and half-wave plates, fast axis, zero order and multi-order
 *   jones-calculus                             Jones vectors and matrices
 *   stokes-parameters-and-mueller-matrices     Stokes vectors, partial polarization, the Poincaré sphere
 *   optical-activity-and-faraday-rotation      sugar, quartz, polarimeters, Faraday rotators
 *   liquid-crystals-and-displays               the twisted-nematic cell
 *   polarization-in-practice                   sunglasses, camera filters, 3-D cinema, screens, stress viewing
 *   photoelasticity-and-stress                 isochromatic fringes, the stress-optic coefficient, tempered glass
 * Convention throughout: right-circular light turns clockwise as seen looking towards the source.
 */
Hyper.add(

/* ================================================================ polarization states */
{
  id: 'polarization-states', parent: 'polarization', title: 'Polarization states: linear, circular, elliptical', level: 1,
  short: 'Light is a transverse wave, so its electric field points across the beam — and the way it does so is its polarization. The field can vibrate along a line (linear), turn in a circle (circular), trace an ellipse (the general case) or wander at random (unpolarized). One number, the degree of polarization, says how much of the light is in a definite state.',
  keywords: ['polarization', 'polarisation', 'linear polarization', 'plane polarized', 'circular polarization', 'elliptical polarization', 'unpolarized light', 'natural light', 'degree of polarization', 'DOP', 'handedness', 'right circular', 'left circular', 'RCP', 'LCP', 'electric field vector', 'transverse wave', 'azimuth', 'ellipticity'],
  prereq: ['light-as-a-wave', 'superposition-and-phase', 'what-is-light'],
  related: ['polarizers-and-malus-law', 'wave-plates', 'jones-calculus', 'stokes-parameters-and-mueller-matrices', 'polarization-in-practice', 'physics:polarization', 'physics:electromagnetic-waves', 'feynman:polarization-feyn'],
  body: `
Light is a transverse wave: the electric field of the wave points across the direction in which the light travels. Across a beam there are many directions to choose from, and **polarization** is the name for which one the field chooses — and how that choice changes from moment to moment. Lenses and mirrors care very little about it; sunglasses, liquid-crystal screens, stress gauges and optical isolators depend on it entirely.

### Linear: a line
In **linearly polarized** light the field always points along one line, growing, shrinking, reversing and growing again as the wave goes by. The line is fixed by one angle, measured from a reference direction: horizontal (H), vertical (V), +45° (D, diagonal) or −45° (A, anti-diagonal). The light of an LCD screen, of a helium–neon laser with Brewster windows, and of the sky 90° from the Sun is linearly polarized, or very nearly.

### Circular and elliptical: a circle, an ellipse
Add two linear waves of the same frequency whose fields are at right angles. If they are in step the sum is linear again (at 45° if they are equal). If one lags the other by a quarter of a period and they have equal amplitude, the tip of the field goes round a circle once per period: **circular polarization**. Every other mix of amplitudes and delay gives an ellipse — **elliptical polarization**, the general state of fully polarized light, of which linear and circular are the two limits. An ellipse needs two numbers: the angle of its long axis, the *azimuth* $\\psi$, and how fat it is, the *ellipticity angle* $\\chi$, where $\\tan\\chi$ is the short axis divided by the long axis ($\\chi = 0$ is linear, $\\pm 45°$ is circular).

The circle can be run two ways. In this app, as in most optics texts, **right-circular** light turns *clockwise as seen by an observer looking towards the source*, and in space its field traces a right-handed corkscrew. Engineering and radio texts (the IEEE convention) call the same light left-handed. Always check which convention a datasheet uses.

### Unpolarized: no steady choice
A lamp, a flame or the Sun is the sum of the light of countless atoms radiating independently. The direction of its field changes at random within a few femtoseconds, a handful of oscillations, and no instrument follows that: it averages to **unpolarized** light, which has no preferred direction at all. It is equivalent to equal, unrelated amounts of any two opposite states: horizontal and vertical, or right and left circular.

### In between: the degree of polarization
Most real light is partly polarized: a fraction in a definite state and the rest unpolarized. The **degree of polarization** is the polarized share of the total power, $p = I_{\\mathrm{pol}}/(I_{\\mathrm{pol}} + I_{\\mathrm{unpol}})$: 1 for a laser, 0 for the Sun, typically 0.6–0.8 for the clearest patch of blue sky. Turn a polarizer in the beam and $p = (I_{\\max} - I_{\\min})/(I_{\\max} + I_{\\min})$ for linearly partially polarized light.

| State | Jones vector | Stokes vector (S₀ S₁ S₂ S₃) | The field's tip |
|---|---|---|---|
| Horizontal | (1, 0) | (1, 1, 0, 0) | back and forth along x |
| Vertical | (0, 1) | (1, −1, 0, 0) | along y |
| Linear +45° | (1, 1)/√2 | (1, 0, 1, 0) | along the diagonal |
| Right circular | (1, −i)/√2 | (1, 0, 0, 1) | clockwise circle |
| Left circular | (1, i)/√2 | (1, 0, 0, −1) | counter-clockwise circle |
| Unpolarized | — (no single vector) | (1, 0, 0, 0) | random |

The [[jones-calculus|Jones vector]] and the [[stokes-parameters-and-mueller-matrices|Stokes vector]] are the two ways of writing a state down; the next pages use them.

> [!key] Polarization is the shape the tip of the electric field draws across the beam: a line, a circle, an ellipse, or no steady shape at all. The degree of polarization says how much of the light has a steady shape.
`,
  ideas: [
    'The electric field of light points across the beam; polarization is the pattern it traces there.',
    'Linear, circular and elliptical light are all fully polarized: two linear waves at right angles, with any ratio of amplitudes and any delay.',
    'A quarter-period delay and equal amplitudes give a circle; right-circular is clockwise looking towards the source (optics convention).',
    'Unpolarized light is a rapid random mix; it equals equal, unrelated amounts of any two opposite states.',
    'The degree of polarization p, from 0 to 1, is the polarized share of the power.'
  ],
  pitfalls: [
    'Unpolarized light has no polarization, as if it were a different kind of wave — Every instant it has a definite field direction; the direction just changes at random within a few femtoseconds, so it is the average that shows none.',
    'In circular light the beam or the ray spirals around — The ray is straight. Only the tip of the electric field turns, once per period, while the whole wave moves forward: in space the field traces a helix of one wavelength pitch.',
    '"Right-handed" means the same everywhere — Optics textbooks (clockwise looking towards the source) and the IEEE convention (the opposite) disagree, and some astronomers use a third. A state is unambiguous only once the convention is named.',
    'The eye can tell polarized from unpolarized light — Almost not at all. A faint yellowish figure, Haidinger\'s brush, can be seen in strongly polarized light by some people, but ordinary vision is blind to it. Bees, ants, cuttlefish and mantis shrimps are not.'
  ],
  terms: [
    { term: 'Polarization', also: ['polarisation'], def: 'The direction, or the pattern of directions, in which the electric field of a light wave vibrates across its direction of travel.' },
    { term: 'Linear polarization', also: ['plane polarization', 'plane-polarized light'], def: 'A state in which the electric field vibrates along one fixed line. The line, given by an angle, is the plane of polarization together with the direction of travel.' },
    { term: 'Circular polarization', also: ['RCP', 'LCP', 'right circular', 'left circular'], def: 'A state in which the electric field has constant strength and turns once per period. Right-circular turns clockwise as seen looking towards the source (optics convention); left-circular, counter-clockwise.' },
    { term: 'Elliptical polarization', def: 'The general fully polarized state: the tip of the electric field traces an ellipse, described by its azimuth ψ and ellipticity angle χ. Linear and circular are special cases.' },
    { term: 'Unpolarized light', also: ['natural light', 'randomly polarized light'], def: 'Light whose field direction changes at random so quickly that no polarization can be measured: sunlight, lamp light. A polarizer passes half of it in any orientation.' },
    { term: 'Degree of polarization', also: ['DOP', 'p'], def: 'The fraction of the light\'s power that is in a definite polarization state: 1 for fully polarized light, 0 for unpolarized, in between for partially polarized light.' },
    { term: 'Handedness', also: ['helicity', 'sense of rotation'], def: 'Whether the field of circular or elliptical light turns clockwise (right) or counter-clockwise (left) as seen looking towards the source. Conventions differ between optics and engineering.' }
  ],
  formulas: [
    {
      name: 'Degree of polarization from the powers',
      expr: 'p = Ip/(Ip + Iu)', tex: 'p = \\frac{I_{\\mathrm{pol}}}{I_{\\mathrm{pol}} + I_{\\mathrm{unpol}}}',
      vars: {
        p: { name: 'degree of polarization', min: 0, max: 1 },
        Ip: { name: 'power in the polarized part', q: 'power', unit: 'mW', value: 3, tex: 'I_{\\mathrm{pol}}' },
        Iu: { name: 'power in the unpolarized part', q: 'power', unit: 'mW', value: 1, tex: 'I_{\\mathrm{unpol}}' }
      },
      solveFor: 'p',
      note: 'A polarized beam with some unpolarized light mixed in: scattered light in a fibre, laser light with fluorescence.',
      stories: { p: 'A laser beam carries {Ip} in its polarized mode and {Iu} of unpolarized light. What is its degree of polarization?' }
    },
    {
      name: 'Degree of polarization from the Stokes parameters',
      expr: 'p = sqrt(S1^2 + S2^2 + S3^2)/S0', tex: 'p = \\frac{\\sqrt{S_1^2 + S_2^2 + S_3^2}}{S_0}',
      vars: {
        p: { name: 'degree of polarization', min: 0, max: 1 },
        S0: { name: 'total intensity', value: 10 },
        S1: { name: 'horizontal minus vertical', value: 4, signed: true },
        S2: { name: '+45° minus −45°', value: 3, signed: true },
        S3: { name: 'right minus left circular', value: 5, signed: true }
      },
      solveFor: 'p',
      note: 'S₀ is the total intensity; S₁, S₂, S₃ are the differences between pairs of opposite states.',
      practice: { unknowns: ['p'] }
    },
    {
      name: 'Ellipticity of the polarization ellipse',
      expr: 'chi = atan(b/a)', tex: '\\chi = \\arctan\\frac{b}{a}',
      vars: {
        chi: { name: 'ellipticity angle', q: 'angle', unit: '°', min: 0, max: 45, tex: '\\chi' },
        a: { name: 'long semi-axis', value: 1 },
        b: { name: 'short semi-axis', value: 0.5 }
      },
      solveFor: 'chi',
      note: 'χ = 0° is linear light, 45° is circular; the sign of χ (not shown) tells the handedness.'
    }
  ],
  examples: [
    {
      title: 'Reading a Stokes vector',
      q: 'A beam has Stokes parameters $(S_0, S_1, S_2, S_3) = (10, 6, 0, 8)$ W/m². Is it polarized, and how?',
      steps: [
        { text: 'The degree of polarization is', tex: 'p = \\frac{\\sqrt{6^2 + 0^2 + 8^2}}{10} = \\frac{10}{10} = 1' },
        'So the beam is fully polarized: a single ellipse. Because $S_3 > 0$ it is right-handed.',
        { text: 'The ellipticity follows from $S_3/S_0 = \\sin 2\\chi$:', tex: '\\sin 2\\chi = 0.8 \\Rightarrow 2\\chi = 53.1°,\\ \\chi = 26.6°,\\ \\frac{b}{a} = \\tan\\chi = 0.5' },
        'With $S_2 = 0$ and $S_1 > 0$ the long axis is horizontal.'
      ],
      a: 'Fully polarized, right-handed elliptical light with a horizontal long axis and an axis ratio of 1 : 2.'
    },
    {
      title: 'A laser with an unpolarized halo',
      q: 'A beam of 3 mW polarized laser light also carries 1 mW of unpolarized light. What is its degree of polarization, and how much light gets through a polarizer as it is turned?',
      steps: [
        { text: 'The degree of polarization:', tex: 'p = \\frac{3}{3 + 1} = 0.75' },
        'A polarizer passes half of the unpolarized part in any position, 0.5 mW. It passes all of the polarized part (3 mW) when aligned with it and none when crossed.',
        { text: 'So the transmitted power swings between 0.5 mW and 3.5 mW; indeed', tex: '\\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min}} = \\frac{3.5 - 0.5}{3.5 + 0.5} = 0.75' }
      ],
      a: 'p = 0.75; the transmitted power varies between 0.5 mW and 3.5 mW, a ratio of 7 : 1.'
    }
  ],
  quiz: [
    { q: 'Equal-amplitude horizontal and vertical components, the vertical one lagging by a quarter of a period, make which state?', choices: ['Linear at 45°', 'Circular', 'Linear, vertical', 'Unpolarized'], a: 1, why: 'A quarter-period lag between equal components sends the tip of the field round a circle. With no lag the sum is linear at 45°; with a half-period lag it is linear at −45°.' },
    { q: 'Unpolarized light can be described as equal amounts of horizontally and vertically polarized light that are not in step with each other.', a: true, why: 'Equal, unrelated amounts of any two opposite states (H and V, +45° and −45°, right and left circular) add up to unpolarized light.' },
    { q: 'A beam has $(S_0, S_1, S_2, S_3) = (10, 4, 3, 5)$. What is its degree of polarization?', answer: 0.707, why: '$p = \\sqrt{16 + 9 + 25}/10 = \\sqrt{50}/10 = 0.707$: partially polarized, with 71 % of the power in one ellipse.' },
    { q: 'Which light has a degree of polarization of exactly 1?', choices: ['Sunlight', 'Light from a fluorescent tube', 'Circularly polarized laser light', 'Light scattered by the clear sky'], a: 2, why: 'Fully polarized light includes linear, circular and elliptical states. Sunlight and lamp light are unpolarized (p near 0) and the sky at best reaches 0.6–0.8.' },
    { q: 'The eye can easily tell polarized light from unpolarized light.', a: false, why: 'Human vision is almost insensitive to polarization (Haidinger\'s brush is a faint exception). That is why polarizing filters and cameras are needed to see what the light is doing.' }
  ],
  applications: [
    'Polarizing sunglasses and camera filters work on the polarization of glare and of the blue sky.',
    'Liquid-crystal displays emit linearly polarized light, which is why they go dark through sunglasses at some angles.',
    'Lasers and fibre-optic components are specified by their polarization state and by the polarization extinction ratio.',
    'Honeybees and desert ants read the polarization pattern of the sky as a compass; mantis shrimps see linear and circular polarization.',
    'Remote sensing and radar use the polarization of the returned light or radio wave to tell surfaces, clouds and rain apart.'
  ],
  history: 'Christiaan Huygens noticed in 1690 that the two images made by Iceland spar behave differently when a second crystal is turned in front of them, and could not explain it with longitudinal waves. Étienne-Louis Malus, looking at the Luxembourg Palace windows through calcite in 1808, found that reflection also polarizes light, and gave the phenomenon its name. Thomas Young suggested in 1817 and Augustin Fresnel showed in 1821 that light waves are transverse. George Stokes described partially polarized light with four numbers in 1852.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — states of polarization, the ellipse, natural light.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 6 (Polarization and Crystal Optics) — polarization of light as a vector wave.',
    'D. H. Goldstein, *Polarized Light* (CRC Press) — a full treatment of polarization states, with Stokes and Mueller methods.'
  ],
  sim: 'po-field-vector'
},

/* ================================================================ polarizers and Malus's law */
{
  id: 'polarizers-and-malus-law', parent: 'polarization', title: 'Polarizers and Malus\'s law', level: 1,
  short: 'A polarizer passes light polarized along its axis and blocks light at right angles. Light already polarized at an angle θ to the axis comes through with the fraction cos²θ (Malus\'s law); unpolarized light loses half. Real polarizers differ in how dark "crossed" is, their extinction ratio, and a third polarizer inserted between two crossed ones lets light through.',
  keywords: ['polarizer', 'polariser', 'analyzer', 'Malus', "Malus's law", 'cos squared', 'dichroic', 'Polaroid', 'wire grid', 'Glan-Thompson', 'Glan-Taylor', 'Nicol', 'extinction ratio', 'crossed polarizers', 'transmission axis', 'ER'],
  prereq: ['polarization-states', 'light-as-a-wave'],
  related: ['polarizing-beam-splitters', 'polarization-by-reflection-and-scattering', 'birefringence', 'jones-calculus', 'polarization-in-practice', 'physics:polarization'],
  body: `
A **polarizer** is a filter for polarization. It has a **transmission axis**: light whose field is along that axis passes, light whose field is across it is stopped. Light at an angle in between is split: only the part of the field along the axis gets through.

### Malus's law
Let linearly polarized light of intensity $I_0$ meet a polarizer whose axis makes an angle $\\theta$ with the light's polarization. The field splits into a component $E\\cos\\theta$ along the axis, which passes, and $E\\sin\\theta$ across it, which does not. Intensity goes as the square of the field, so

$$I = I_0 \\cos^2\\theta$$

This is **Malus's law** (1809). Unpolarized light has all angles at once; the average of $\\cos^2\\theta$ over all angles is ½, so an ideal polarizer passes half of it, whatever its orientation, and what comes out is linearly polarized along the axis.

| θ | 0° | 15° | 30° | 45° | 60° | 75° | 90° |
|---|---|---|---|---|---|---|---|
| cos²θ | 1 | 0.93 | 0.75 | 0.50 | 0.25 | 0.07 | 0 |

### Kinds of polarizer
| Type | How it works | Extinction ratio (typical) | Single-piece transmission | Notes |
|---|---|---|---|---|
| Dichroic sheet | Stretched plastic (polyvinyl alcohol) dyed with iodine: the aligned molecules absorb the field along them | 100:1 (cheap film) to 10 000:1 | 40 – 45 % for unpolarized light | Cheap, large, thin; the sunglass and display polarizer |
| Wire grid | Fine metal lines, spacing well below the wavelength (about 100 – 150 nm for visible light): the field along the wires is reflected | 100:1 to over 10 000:1 | 40 – 50 % | Works from the ultraviolet to the infrared; passes the field *across* the wires |
| Crystal (Glan–Taylor, Glan–Thompson) | Two calcite prisms: one polarization is totally reflected at the gap, the other goes straight on | about 100 000:1 and better | 90 – 99 % of the wanted polarization | Excellent, but small, costly, narrow field |
| Beam-splitting cube or plate | A coating reflects one polarization and transmits the other | 100:1 to 1000:1 | high | Gives both beams: see [[polarizing-beam-splitters]] |

The wire-grid line deserves a second look: it **transmits the field perpendicular to the wires**, because charges in the metal are free to move along the wires and re-radiate a reflected wave, while across the wires they cannot.

### The extinction ratio
No polarizer is perfect. Its **extinction ratio** is the transmission with the axes aligned divided by the transmission with them crossed, $\\mathrm{ER} = T_\\parallel / T_\\perp$. A 1000:1 pair lets 0.1 % through when crossed; at that level a crossed pair has an optical density of 3. Sheet polarizers keep their extinction only in the band they were made for (iodine sheets turn transparent in the near infrared); crystal and wire-grid polarizers stay good over a much wider range.

### The third polarizer
Put two ideal polarizers at 0° and 90° in a beam: nothing passes. Now slide a third one between them, axis at 45°. Light comes through: $I_0/2$ leaves the first, $I_0/2 \\cdot \\cos^2 45° = I_0/4$ leaves the middle one, and $I_0/4 \\cdot \\cos^2 45° = I_0/8$ leaves the last. A polarizer does not merely subtract: it *re-sets* the polarization along its own axis, so a new polarizer can bring back light the old one had stopped. With $N$ polarizers turning in equal steps from 0° to 90° the transmission of polarized light is $\\cos^{2N}(90°/N)$ and it climbs towards 1: 25 % for one middle polarizer, 78 % for nine, 98 % for ninety-nine.

> [!key] $I = I_0\\cos^2\\theta$ for polarized light, $I_0/2$ for unpolarized. The transmission axis of a wire grid is *across* its wires. A polarizer between crossed polarizers lets light through because it re-sets the polarization.
`,
  ideas: [
    'Malus\'s law: polarized light meeting an ideal polarizer at angle θ to its axis comes out with I = I₀ cos²θ.',
    'An ideal polarizer passes half of unpolarized light, in any orientation.',
    'The extinction ratio T∥/T⊥ measures how dark crossed polarizers are: 100:1 for cheap film, 10⁵:1 for a calcite prism.',
    'A wire-grid polarizer transmits the field across the wires, a dichroic sheet the field across its stretched molecules.',
    'A third polarizer at 45° between crossed ones passes 1/8 of unpolarized light: polarizers re-set polarization, they do not just filter.'
  ],
  pitfalls: [
    'A polarizer works like a picket fence that passes light vibrating along the slots — The picture is right for a dichroic sheet in outline, but a wire grid passes the field *across* the wires. And the fence picture gets the third polarizer wrong: it would never let light through two crossed fences.',
    'Two polarizers can only remove light, so adding a third cannot help — It can. Each polarizer sets the polarization along its own axis, so a polarizer at 45° turns what the first one passed into something the last one can partly pass.',
    'Crossed polarizers block all the light — Only ideal ones. Real pairs leak 1/ER of the aligned transmission, 1 % for cheap film; with strongly curved or stressed things in between, or with light that comes in at a slant, the leak is much larger.',
    'A polarizer passes half of the light, so it halves polarized light too — That is only true on average for unpolarized light. Polarized light is passed in full or not at all, or anywhere between, by cos²θ.'
  ],
  terms: [
    { term: 'Polarizer', also: ['polariser', 'linear polarizer'], def: 'An optical element that passes light polarized along its transmission axis and blocks light polarized at right angles; the part that makes light polarized or measures its polarization.' },
    { term: 'Analyzer', def: 'A polarizer used to examine the polarization of light that has passed through something else. Physically the same part as a polarizer; the name says what it is for.' },
    { term: 'Transmission axis', def: 'The direction of the electric field that a polarizer passes. Marked by a line, a notch or an arrow on the mount.' },
    { term: 'Malus\'s law', also: ['cos² law'], def: 'The transmitted intensity I = I₀ cos²θ of linearly polarized light meeting an ideal polarizer whose axis is at angle θ to the polarization.' },
    { term: 'Extinction ratio', also: ['ER', 'polarization extinction ratio', 'PER'], def: 'The ratio of the largest to the smallest transmission as a polarizer is turned, T∥/T⊥, often written 1000:1. For a laser or fibre, the same name is used for the ratio of power in the wanted polarization to that in the orthogonal one.' },
    { term: 'Dichroic polarizer', also: ['sheet polarizer', 'Polaroid-type polarizer'], def: 'A polarizer made of a material that absorbs one polarization much more strongly than the other, such as stretched, iodine-dyed plastic film.' },
    { term: 'Wire-grid polarizer', def: 'A polarizer made of parallel metal lines spaced closer than the wavelength. It reflects the field along the wires and transmits the field across them.' }
  ],
  formulas: [
    {
      name: 'Malus\'s law',
      expr: 'I = I0*cos(theta)^2', tex: 'I = I_0 \\cos^2\\theta',
      vars: {
        I: { name: 'transmitted intensity', q: 'intensity', unit: 'W/m²' },
        I0: { name: 'incident polarized intensity', q: 'intensity', unit: 'W/m²', value: 100, tex: 'I_0' },
        theta: { name: 'angle between the light\'s polarization and the axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      solveFor: 'I',
      note: 'For unpolarized light, replace I₀ by I₀/2 and drop the cosine: an ideal polarizer passes half.',
      stories: { I: 'Linearly polarized light of {I0} meets a polarizer whose axis is {theta} from its polarization. How much comes through?', theta: 'Polarized light of {I0} comes out of a polarizer at {I}. At what angle was the axis?' }
    },
    {
      name: 'Extinction ratio',
      expr: 'ER = Tpar/Tcross', tex: '\\mathrm{ER} = \\frac{T_\\parallel}{T_\\perp}',
      vars: {
        ER: { name: 'extinction ratio', tex: '\\mathrm{ER}' },
        Tpar: { name: 'transmission, axes parallel', q: 'ratio', unit: '%', value: 36, tex: 'T_\\parallel' },
        Tcross: { name: 'transmission, axes crossed', q: 'ratio', unit: '%', value: 0.036, tex: 'T_\\perp' }
      },
      solveFor: 'ER',
      note: 'Quoted as ER : 1, for a pair of identical polarizers or for one polarizer against an ideal one.',
      stories: { ER: 'A pair of polarizers passes {Tpar} with their axes parallel and {Tcross} when crossed. What is the extinction ratio?' }
    },
    {
      name: 'N polarizers turning in equal steps',
      expr: 'T = cos(pi/(2*N))^(2*N)', tex: 'T = \\cos^{2N}\\!\\left(\\frac{\\pi}{2N}\\right)',
      vars: {
        T: { name: 'transmission of polarized light', min: 0, max: 1 },
        N: { name: 'number of steps (the first polarizer, plus N − 1 more, turning 90° in all)', value: 2, int: true, min: 1, max: 1000 }
      },
      solveFor: 'T',
      note: 'N = 1 is a crossed pair (T = 0), N = 2 is the 45° polarizer between crossed ones (T = 0.25).',
      practice: { unknowns: ['T'] }
    }
  ],
  examples: [
    {
      title: 'Sunlight through two sheets',
      q: 'Unpolarized sunlight of 800 W/m² falls on an ideal polarizer; behind it a second ideal polarizer is turned 30° from the first. What intensity emerges?',
      steps: [
        'The first polarizer passes half: $800/2 = 400$ W/m², now polarized along its axis.',
        { text: 'Malus\'s law for the second:', tex: 'I = 400\\cos^2 30° = 400 \\times 0.75 = 300\\ \\mathrm{W/m^2}' }
      ],
      a: '300 W/m². Turning the second sheet to 90° would give zero, and to 0° would give 400 W/m².'
    },
    {
      title: 'Is 45° the best middle angle?',
      q: 'Two ideal polarizers are crossed (0° and 90°). A third is put between them, first at 45°, then at 30°. What fraction of an unpolarized beam gets through in each case?',
      steps: [
        { text: 'At 45°:', tex: '\\frac{1}{2}\\cos^2 45°\\cos^2 45° = \\frac{1}{2} \\times 0.5 \\times 0.5 = 0.125' },
        { text: 'At 30° (the last step is then 60°):', tex: '\\frac{1}{2}\\cos^2 30°\\cos^2 60° = \\frac{1}{2} \\times 0.75 \\times 0.25 = 0.094' }
      ],
      a: '12.5 % at 45°, 9.4 % at 30°: the two steps of 45° give the largest product, so 45° is the best middle angle.'
    }
  ],
  quiz: [
    { q: 'Linearly polarized light of 100 mW meets an ideal polarizer whose axis is 60° from the polarization. What power comes out?', choices: ['86.6 mW', '50 mW', '25 mW', '0 mW'], a: 2, why: '$\\cos^2 60° = 0.25$. 50 mW would be the answer at 45°, and 86.6 mW is $\\cos 30°$ (forgetting that intensity goes as the square of the field).' },
    { q: 'An unpolarized beam passes through one ideal polarizer. What fraction of the power comes out?', choices: ['All of it', 'Half', 'A quarter', 'It depends on the angle of the polarizer'], a: 1, why: 'Unpolarized light has no preferred direction, so the average of $\\cos^2\\theta$ over all directions, ½, applies in every orientation.' },
    { q: 'A wire-grid polarizer transmits the light whose electric field is parallel to the wires.', a: false, why: 'The field along the wires drives currents in the metal and is reflected. The field across the wires cannot, and passes.' },
    { q: 'Three ideal polarizers at 0°, 45° and 90° are placed in a row in an unpolarized beam. What fraction of the beam gets through? (Give a decimal.)', answer: 0.125, why: '$\\tfrac{1}{2} \\times \\cos^2 45° \\times \\cos^2 45° = 1/8$.' },
    { q: 'Two polarizers pass 36 % of unpolarized light with their axes parallel and 0.036 % when crossed. What is their extinction ratio?', answer: 1000, why: '$\\mathrm{ER} = T_\\parallel / T_\\perp = 36/0.036 = 1000$, written 1000:1. A crossed pair of this quality has an optical density of 3 relative to the aligned pair.' }
  ],
  applications: [
    'Polarizing filters on cameras and sunglasses cut reflected glare: see [[polarization-in-practice]].',
    'Liquid-crystal displays put a polarizer on each side of every cell and use the cell to turn the polarization — see [[liquid-crystals-and-displays]].',
    'Polarimetry and ellipsometry: a rotating analyzer measures how a sample changes polarization.',
    'Laser systems use calcite polarizers and polarizing beam splitters to combine, split and isolate beams.',
    'Microscopes use a polarizer and an analyzer, crossed, to make birefringent specimens (minerals, fibres, crystals) glow against a dark field.'
  ],
  history: 'Étienne-Louis Malus, a French army engineer, looked at the setting Sun reflected in a window of the Luxembourg Palace through a calcite crystal in 1808 and saw one of the two images vanish as he turned the crystal. He worked out the cos² law the next year. The first practical polarizer was the Nicol prism of 1828. Edwin Land made the first large plastic sheet polarizer in the 1930s by aligning crystals of iodoquinine sulphate in a plastic, and improved it in 1938 with stretched, iodine-dyed polyvinyl alcohol.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — Malus\'s law, dichroism, wire grids, the crystal polarizers.',
    'J. M. Bennett, "Polarizers", in the *Handbook of Optics* — the types, extinction ratios and fields of view.',
    'D. H. Goldstein, *Polarized Light* (CRC Press) — the Mueller matrix of an imperfect polarizer.'
  ],
  sim: 'po-malus'
},

/* ================================================================ polarization by reflection and scattering */
{
  id: 'polarization-by-reflection-and-scattering', parent: 'polarization', title: 'Polarization by reflection and by scattering', level: 2,
  short: 'Light reflected from a surface is partly polarized, and completely so at Brewster\'s angle, arctan n. Light scattered by small particles at 90° is polarized too. That is why glare off water and roads is polarized, why the sky 90° from the Sun is polarized, and why polarizing filters can cut the one and darken the other.',
  keywords: ['Brewster angle', 'Brewster', 'polarization by reflection', 'glare', 'polarized sunglasses', 'Rayleigh scattering', 'polarized sky', 'skylight polarization', 's polarization', 'p polarization', 'plane of incidence', 'Arago point', 'neutral point', 'pile of plates', 'Brewster window', 'polarizing filter sky'],
  prereq: ['polarization-states', 'fresnel-reflection', 'brewster-angle'],
  related: ['polarizers-and-malus-law', 'polarization-in-practice', 'why-the-sky-is-blue', 'specular-and-diffuse-reflection', 'physics:brewsters-angle', 'feynman:partial-reflection'],
  body: `
Neither reflection nor scattering is aware of polarization, yet both produce polarized light from unpolarized light. The reason is the same: the electrons in the surface or the particle are shaken by the field of the light, then radiate, and the radiation of a shaken charge is not the same in all directions.

### Reflection
Split the field of the incident light into two components: **s** (from the German *senkrecht*), across the plane of incidence — parallel to the surface — and **p**, in that plane. [[fresnel-reflection|Fresnel's equations]] give a different reflectance for each. At normal incidence they are equal (4.2 % for glass of index 1.517). As the angle grows, $R_s$ rises steadily towards 100 % at grazing incidence, while $R_p$ falls to **zero** at **Brewster's angle**,

$$\\tan\\theta_B = \\frac{n_2}{n_1}$$

and only then climbs back. At that angle the reflected light is purely s-polarized, and the reflected and refracted rays are exactly 90° apart: the electrons shaken in the second medium by the p-field vibrate along the line the reflected ray would take, and a vibrating charge sends nothing along its own axis. See [[brewster-angle]] for the derivation.

| Surface | n | Brewster angle | Rs there |
|---|---|---|---|
| Water | 1.333 | 53.1° | 7.8 % |
| Acrylic | 1.492 | 56.2° | 14.4 % |
| Crown glass | 1.517 | 56.6° | 15.5 % |
| Diamond | 2.417 | 67.5° | 50 % |
| Silicon (infrared) | 3.5 | 74.1° | 72 % |

Two consequences. **Glare** off a lake, a road or a car bonnet is mostly s-polarized, which for a horizontal surface means horizontally polarized: a polarizer with a vertical axis removes it (see [[polarization-in-practice]]). And the *transmitted* light is only slightly polarized by one surface (8 % for glass at Brewster's angle), but a stack of ten glass plates tilted to Brewster's angle removes so much s-light that the transmitted beam is 93 % polarized. Gas lasers use the same trick: the tube windows are set at Brewster's angle, so p-polarized light loses nothing and the laser output is linearly polarized.

### Scattering
Sunlight scattered by air molecules is the second source. A molecule is shaken along the field of the incoming light, which is across the incoming beam. Seen from the side, at a **scattering angle** $\\Theta = 90°$ from the Sun's direction, the only motion visible is the component across the line of sight: the scattered light is *linearly polarized perpendicular to the plane Sun – molecule – observer*. At other angles the in-plane component adds a share $\\cos^2\\Theta$ and the degree of polarization for single Rayleigh scattering is

$$p = \\frac{1 - \\cos^2\\Theta}{1 + \\cos^2\\Theta}$$

zero towards and away from the Sun, 0.33 at 45°, 0.60 at 60° and 100 % at 90°. The real clear sky reaches 60 – 80 % because of multiple scattering and light from the ground. The pattern is a set of circles around the Sun; the pattern has points of zero polarization (the Arago, Babinet and Brewster points, each about 20° from the Sun or the antisolar point). Honeybees and desert ants use it as a compass. A polarizing filter turned to the right angle darkens the sky at 90° from the Sun most — and wide lenses show the effect as an uneven band.

> [!key] Reflection polarizes fully at Brewster\'s angle, arctan n, with the field parallel to the surface; scattering polarizes fully at 90° from the incoming beam. In both, the missing component is the one that would have to radiate along its own axis.
`,
  ideas: [
    'Reflected light is partly s-polarized (field parallel to the surface); the p-component vanishes at Brewster\'s angle, tan θB = n₂/n₁.',
    'At Brewster\'s angle the reflected and refracted rays are at 90°.',
    'Glare off horizontal surfaces is horizontally polarized, so a vertical-axis polarizer cuts it.',
    'Scattering by small particles polarizes light at 90° from the incoming beam: p = (1 − cos²Θ)/(1 + cos²Θ).',
    'The clear sky is polarized in circles about the Sun, up to 60–80 % at 90° from it.'
  ],
  pitfalls: [
    'Reflected light is polarized only at one special angle — It is partially polarized at every angle between 0° and 90°, and the polarization becomes complete only at Brewster\'s angle (the reflected light is then 100 % s, though weak).',
    'Polarized sunglasses darken the sky everywhere equally — They darken the sky most where it is most polarized, 90° from the Sun, and hardly at all towards or away from it. That uneven darkening is why the sky shows bands in wide photographs.',
    'The sky is blue because it is polarized — The two have the same cause (scattering by molecules) but are different effects: the colour comes from the 1/λ⁴ dependence of the scattering, the polarization from its angle dependence.',
    'Brewster\'s angle depends on the wavelength strongly — Only through the refractive index, which changes by a few per cent across the visible. The angle moves by a fraction of a degree between red and blue light.'
  ],
  terms: [
    { term: 'Plane of incidence', def: 'The plane containing the incident ray and the normal to the surface. The reflected and refracted rays lie in it too.' },
    { term: 's-polarization', also: ['TE', 'transverse electric', 'perpendicular polarization'], def: 'Light whose electric field is perpendicular to the plane of incidence, hence parallel to the surface. The component that is always reflected most strongly.' },
    { term: 'p-polarization', also: ['TM', 'transverse magnetic', 'parallel polarization'], def: 'Light whose electric field lies in the plane of incidence. Its reflectance falls to zero at Brewster\'s angle.' },
    { term: 'Brewster\'s angle', also: ['polarizing angle', 'θB'], def: 'The angle of incidence, arctan(n₂/n₁), at which p-polarized light is not reflected at all and the reflected light is purely s-polarized.' },
    { term: 'Brewster window', def: 'A window tilted at Brewster\'s angle so that p-polarized light passes it with no reflection loss; used on gas lasers, which makes their output linearly polarized.' },
    { term: 'Scattering angle', also: ['Θ'], def: 'The angle between the direction the light was travelling and the direction in which it is scattered. 0° is forward scattering, 180° backscattering.' },
    { term: 'Neutral point', also: ['Arago point', 'Babinet point', 'Brewster point'], def: 'A direction in the sky, near the Sun or the antisolar point, where the skylight is unpolarized because multiple scattering cancels the single-scattering polarization.' }
  ],
  formulas: [
    {
      name: 'Brewster\'s angle',
      expr: 'thetaB = atan(n2/n1)', tex: '\\theta_B = \\arctan\\frac{n_2}{n_1}',
      vars: {
        thetaB: { name: 'Brewster\'s angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_B' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 4 },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 4 }
      },
      solveFor: 'thetaB',
      note: 'Measured from the normal, going from medium 1 into medium 2. Glass to air: arctan(1/1.517) = 33.4°.',
      stories: { thetaB: 'Light in air meets a surface of index {n2}. At what angle of incidence is the reflected light completely polarized?', n2: 'A surface polarizes reflected light completely at {thetaB}. What is its refractive index?' }
    },
    {
      name: 'Reflectance at normal incidence',
      expr: 'R = ((n2 - n1)/(n2 + n1))^2', tex: 'R = \\left(\\frac{n_2 - n_1}{n_2 + n_1}\\right)^2',
      vars: {
        R: { name: 'reflectance', q: 'ratio', unit: '%' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 4 },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 4 }
      },
      solveFor: 'R',
      note: 'The same for s and p at normal incidence. For crown glass in air: 4.2 %.'
    },
    {
      name: 'Degree of polarization of Rayleigh-scattered light',
      expr: 'p = (1 - cos(Th)^2)/(1 + cos(Th)^2)', tex: 'p = \\frac{1 - \\cos^2\\Theta}{1 + \\cos^2\\Theta}',
      vars: {
        p: { name: 'degree of polarization', min: 0, max: 1 },
        Th: { name: 'scattering angle from the Sun', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\Theta' }
      },
      solveFor: 'p',
      note: 'Single scattering by molecules, no haze. The real sky gives about 60–80 % of this value at its peak.',
      stories: { p: 'You look at a point of clear sky {Th} away from the Sun. How polarized is its light, in the single-scattering picture?' }
    }
  ],
  examples: [
    {
      title: 'Glare on a lake',
      q: 'The low Sun is reflected in a lake (n = 1.333). At what angle of incidence is the glare fully polarized, and what does a polarizer with a vertical axis do to it?',
      steps: [
        { text: 'Brewster\'s angle for water:', tex: '\\theta_B = \\arctan 1.333 = 53.1°' },
        'At this angle only the s-component is reflected (7.8 % of it), and for a flat horizontal surface s means *horizontal* polarization.',
        'A polarizer with a vertical transmission axis is crossed to it and blocks the glare almost completely. It also takes half of the unpolarized light from the lake bottom, but that scene is not polarized, so the contrast improves a lot.'
      ],
      a: '53.1° (the Sun about 37° above the horizon). A vertical-axis polarizer removes almost all of the glare — the idea of polarized sunglasses.'
    },
    {
      title: 'Where to point the filter',
      q: 'The Sun is high. You photograph the sky with a polarizing filter. How polarized is the sky 45° and 60° from the Sun, and where is the filter most effective?',
      steps: [
        { text: 'At 45°:', tex: 'p = \\frac{1 - 0.5}{1 + 0.5} = 0.33' },
        { text: 'At 60° ($\\cos^2 = 0.25$):', tex: 'p = \\frac{0.75}{1.25} = 0.60' },
        'The degree of polarization peaks at 90° from the Sun, where $p = 1$ in theory and 0.6 – 0.8 in practice. A filter turned to cross the sky\'s polarization darkens that band most; towards or away from the Sun it does nothing.'
      ],
      a: '0.33 at 45°, 0.60 at 60°; the filter works best at about 90° from the Sun (a band across the sky at right angles to the Sun direction).'
    }
  ],
  quiz: [
    { q: 'Glare from a calm lake is strongest in which polarization?', choices: ['Vertical', 'Horizontal, parallel to the water', 'Circular', 'It is unpolarized'], a: 1, why: 'The s-component, with its field parallel to the surface, is reflected more strongly than the p-component at every angle, so glare is mostly horizontally polarized. Sunglasses have a vertical transmission axis for that reason.' },
    { q: 'What is Brewster\'s angle for light going from air into glass of index 1.5? (degrees)', answer: 56.3, unit: '°', why: '$\\theta_B = \\arctan(1.5/1) = 56.3°$.' },
    { q: 'Light scattered by the clear sky at 90° from the Sun is unpolarized.', a: false, why: 'It is the most polarized: at 90° only the component across the line of sight is visible. It is unpolarized only towards and away from the Sun.' },
    { q: 'At Brewster\'s angle, the reflected ray and the refracted ray make an angle of…', choices: ['0°', '45°', '90°', '180°'], a: 2, why: 'The refracted ray and the reflected ray are perpendicular; this is the geometric reason the p-component cannot be reflected.' },
    { q: 'A helium–neon laser tube has windows tilted at Brewster\'s angle. What does that give?', choices: ['A smaller beam', 'A linearly polarized output with no reflection loss for that polarization', 'Circularly polarized output', 'A brighter beam at all polarizations'], a: 1, why: 'p-polarized light loses nothing at the windows while s-polarized light is partly reflected out of the cavity; over many round trips only p survives.' }
  ],
  applications: [
    'Polarized sunglasses and photographic filters remove glare from water, wet roads and glass.',
    'Brewster windows on gas lasers and in laser cavities; Brewster-angle prisms.',
    'Polarizing filters darken the blue sky in landscape photography, most at 90° from the Sun.',
    'Navigation by the sky\'s polarization pattern: bees, desert ants and some beetles, and experimental sun compasses.',
    'Ellipsometry measures the change of polarization on reflection to find the thickness and index of thin films on silicon chips.'
  ],
  history: 'Malus found polarization by reflection in 1808. David Brewster measured the angle of complete polarization for many substances in 1815 and found that the tangent of the angle is the refractive index, which Fresnel explained with his equations in 1823. John William Strutt, later Lord Rayleigh, derived the scattering law in 1871 and 1899; François Arago found the first neutral point of the sky in 1809 and Jacques Babinet another in 1840, David Brewster the third in 1842.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) and ch. 4 — Brewster\'s angle, scattering and the Fresnel equations.',
    'G. P. Können, *Polarized Light in Nature* (Cambridge University Press, 1985) — the sky and other natural polarization.',
    'C. F. Bohren and D. R. Huffman, *Absorption and Scattering of Light by Small Particles* — the polarization of light scattered by small particles.'
  ],
  sim: ['po-reflection', 'po-sky']
},

/* ================================================================ birefringence */
{
  id: 'birefringence', parent: 'polarization', title: 'Birefringence', level: 2,
  short: 'In a crystal with a special axis, light has two refractive indices: one for light polarized along the axis and another for light polarized across it. A beam entering splits into an ordinary ray and an extraordinary ray with perpendicular polarizations — in calcite, a word seen through the crystal appears twice.',
  keywords: ['birefringence', 'double refraction', 'calcite', 'Iceland spar', 'ordinary ray', 'extraordinary ray', 'optic axis', 'uniaxial', 'biaxial', 'walk-off', 'quartz', 'Δn', 'n_o', 'n_e', 'positive and negative crystals', 'principal section'],
  prereq: ['polarization-states', 'refractive-index', 'snells-law'],
  related: ['wave-plates', 'optical-crystals', 'polarizing-beam-splitters', 'photoelasticity-and-stress', 'liquid-crystals-and-displays', 'optical-plastics', 'physics:polarization'],
  body: `
Glass is the same in every direction, so a ray of light chooses a speed — an index $n$ — without regard to its polarization. A crystal is not. The atoms of calcite, quartz or sapphire are arranged with a special direction, the **optic axis**, and light whose field vibrates *along* it meets a different bond strength than light whose field vibrates *across* it. The two polarizations travel at different speeds: the crystal is **birefringent** ("doubly refracting").

### Two indices
In a **uniaxial** crystal, light polarized across the optic axis sees the **ordinary index** $n_o$; light polarized along it sees the **extraordinary index** $n_e$. The birefringence is $\\Delta n = n_e - n_o$: positive crystals have $n_e > n_o$, negative ones the reverse.

| Crystal | $n_o$ | $n_e$ | $\\Delta n$ | Sign |
|---|---|---|---|---|
| Calcite | 1.658 | 1.486 | −0.172 | negative |
| Crystal quartz | 1.544 | 1.553 | +0.009 | positive |
| Sapphire | 1.768 | 1.760 | −0.008 | negative |
| Magnesium fluoride | 1.378 | 1.390 | +0.012 | positive |
| Rutile (TiO₂) | about 2.61 | about 2.90 | about +0.29 | positive |

(At 589 nm; handbook values for the last three.) Mica, topaz and many other crystals have two optic axes and three indices — they are *biaxial*.

### Ordinary and extraordinary rays
Let unpolarized light fall straight on a calcite plate. It splits in two:
- the **ordinary ray** is polarized *across* the principal section (the plane containing the beam and the optic axis); it obeys Snell\'s law and goes straight on;
- the **extraordinary ray** is polarized *in* the principal section; it obeys a different law, and even at normal incidence it can travel at an angle: it **walks off**.

The walk-off comes from the direction of energy flow. If the wave\'s normal makes an angle $\\theta$ with the optic axis, the ray (the direction in which the energy goes) makes an angle $\\theta'$ with $\\tan\\theta' = (n_o/n_e)^2\\tan\\theta$. In calcite the difference is largest, 6.2°, near $\\theta = 45°$: through 10 mm of calcite the two images are 1.1 mm apart. A word read through a calcite rhomb appears twice; turn the crystal and the extraordinary image circles the ordinary one; look through a polarizer and each image can be put out separately.

### Along the axis and across it
Light travelling *along* the optic axis has its field always across it: both polarizations see $n_o$, and there is no splitting. Light travelling *across* the axis has its two polarizations separated into pure ordinary and pure extraordinary — they follow the same path but at different speeds and come out with a delay between them. That is not a nuisance but the basis of the [[wave-plates|wave plate]]: a plate cut parallel to the axis of thickness $d$ delays one polarization behind the other by $\\Delta n\\, d/\\lambda$ wavelengths. A 1 mm plate of quartz gives 16.5 wavelengths of delay at 550 nm.

### Where it appears
Calcite and quartz crystals; stretched and moulded plastics, whose chains align (the reason cellophane and clear tape glow between polarizers); glass and plastic under stress ([[photoelasticity-and-stress]]); liquid crystals ([[liquid-crystals-and-displays]]), which have $\\Delta n$ of 0.1 – 0.2; muscle, collagen and other biological fibres. Optical designers meet it as a flaw: moulded plastic lenses and stressed windows have a small, unwanted birefringence that spoils polarization-sensitive systems.

> [!key] A birefringent crystal has two indices, $n_o$ and $n_e$, for two perpendicular polarizations. Unpolarized light entering splits into an ordinary ray (straight) and an extraordinary ray (walking off). Where the two rays share a path, their delay is the stuff of wave plates.
`,
  ideas: [
    'A uniaxial crystal has an optic axis; light polarized across it sees nₒ and along it sees nₑ.',
    'Unpolarized light entering splits into an ordinary ray (obeys Snell\'s law) and an extraordinary ray (walks off), polarized at right angles to each other.',
    'Calcite: nₒ = 1.658, nₑ = 1.486, Δn = −0.172, a walk-off up to 6.2°; quartz: Δn = +0.009.',
    'Along the optic axis there is no birefringence; across it the two polarizations travel together at different speeds.',
    'Retardance in waves is Δn·d/λ; stretched plastic, stressed glass and liquid crystals are birefringent too.'
  ],
  pitfalls: [
    'Both rays obey Snell\'s law — Only the ordinary ray does. The extraordinary ray\'s index depends on its direction relative to the optic axis, and its energy does not travel along the wave normal.',
    'Birefringence means the crystal has two refractive indices for all light — Each ray sees one index; which one depends on the polarization and on the direction. For light travelling along the optic axis there is just one.',
    'Birefringence is a rare property of exotic crystals — It is everywhere light meets anisotropy: a plastic spoon, a CD case, a bent strip of tape, a windscreen, the screen of a phone.',
    'The two images of calcite are two different pictures, one brighter — They are two copies of the same picture, each in light of one polarization; with unpolarized light they are equally bright.'
  ],
  terms: [
    { term: 'Birefringence', also: ['double refraction'], def: 'The property of a material that has different refractive indices for different polarizations. The difference of the two indices, Δn = nₑ − nₒ, measures it.' },
    { term: 'Optic axis', def: 'The special direction in a birefringent crystal along which light of any polarization sees the same index. Uniaxial crystals have one, biaxial crystals two.' },
    { term: 'Ordinary ray', also: ['o-ray'], def: 'The ray whose polarization is perpendicular to the plane of the optic axis and the beam. It sees the index nₒ and obeys Snell\'s law.' },
    { term: 'Extraordinary ray', also: ['e-ray'], def: 'The ray polarized in the plane of the optic axis and the beam. Its index depends on its direction, and its energy may travel at an angle to its wave normal.' },
    { term: 'Principal section', def: 'The plane containing the optic axis and the normal to the crystal face where the light enters. The extraordinary ray lies in it.' },
    { term: 'Walk-off', also: ['walk-off angle', 'beam displacement'], def: 'The sideways drift of the extraordinary ray inside a birefringent crystal, caused by the energy flowing at an angle to the wave normal. Up to 6.2° in calcite.' },
    { term: 'Uniaxial crystal', also: ['positive crystal', 'negative crystal'], def: 'A crystal with one optic axis and two principal indices nₒ and nₑ. Positive if nₑ > nₒ (quartz), negative if nₑ < nₒ (calcite).' }
  ],
  formulas: [
    {
      name: 'Birefringence',
      expr: 'dn = ne - no', tex: '\\Delta n = n_e - n_o',
      vars: {
        dn: { name: 'birefringence', signed: true, tex: '\\Delta n' },
        ne: { name: 'extraordinary index', value: 1.486, tex: 'n_e' },
        no: { name: 'ordinary index', value: 1.658, tex: 'n_o' }
      },
      solveFor: 'dn',
      note: 'Calcite at 589 nm: −0.172, a negative crystal. Quartz: +0.009.'
    },
    {
      name: 'Walk-off angle of the extraordinary ray',
      expr: 'rho = atan((no/ne)^2*tan(th)) - th', tex: '\\rho = \\arctan\\!\\left[\\left(\\frac{n_o}{n_e}\\right)^2\\tan\\theta\\right] - \\theta',
      vars: {
        rho: { name: 'walk-off angle', q: 'angle', unit: '°', signed: true, tex: '\\rho' },
        no: { name: 'ordinary index', value: 1.658, tex: 'n_o' },
        ne: { name: 'extraordinary index', value: 1.486, tex: 'n_e' },
        th: { name: 'angle between the optic axis and the wave normal', q: 'angle', unit: '°', value: 45, min: 1, max: 89, tex: '\\theta' }
      },
      solveFor: 'rho',
      note: 'For normal incidence on a plate, θ is the tilt of the axis from the surface normal. Positive: the ray leans away from the axis (calcite).',
      stories: { rho: 'A calcite plate has its optic axis tilted {th} from the beam. By what angle does the extraordinary ray leave the direction of the beam?' }
    },
    {
      name: 'Retardance in waves',
      expr: 'Nw = Dn*d/lambda', tex: 'N_w = \\frac{\\Delta n\\; d}{\\lambda}',
      vars: {
        Nw: { name: 'delay between the two polarizations, in wavelengths', tex: 'N_w' },
        Dn: { name: 'size of the birefringence |Δn|', value: 0.0091, tex: '\\Delta n' },
        d: { name: 'thickness of the plate', q: 'length', unit: 'mm', value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'Nw',
      note: 'A plate cut parallel to the optic axis, light at normal incidence. Quartz 1 mm at 550 nm: 16.5 waves.',
      stories: { Nw: 'A quartz plate is {d} thick (Δn = {Dn}). How many wavelengths of {lambda} light does it delay one polarization behind the other?', d: 'How thick must a plate with Δn = {Dn} be to give {Nw} waves of retardance at {lambda}?' }
    }
  ],
  examples: [
    {
      title: 'Two images in calcite',
      q: 'A calcite plate 15 mm thick is cut so that its optic axis makes 45° with the surface normal. How far apart are the two images of a dot seen at normal incidence?',
      steps: [
        { text: 'The ray inside makes this angle with the axis:', tex: '\\tan\\theta\' = \\left(\\frac{1.658}{1.486}\\right)^2 \\tan 45° = 1.245 \\Rightarrow \\theta\' = 51.2°' },
        'The walk-off angle is $51.2° - 45° = 6.2°$ from the beam direction.',
        { text: 'The separation after 15 mm:', tex: 's = 15\\ \\mathrm{mm} \\times \\tan 6.2° = 1.6\\ \\mathrm{mm}' }
      ],
      a: 'About 1.6 mm: the extraordinary image is displaced from the ordinary one by roughly a tenth of the thickness. Quartz would give a hundred times less.'
    },
    {
      title: 'How many waves in a quartz plate?',
      q: 'A quartz plate is 0.50 mm thick, cut with its axis in the plate. How many wavelengths of retardance at 633 nm? Take $\\Delta n = 0.0091$.',
      steps: [
        { text: 'Delay in wavelengths:', tex: 'N_w = \\frac{\\Delta n\\, d}{\\lambda} = \\frac{0.0091 \\times 0.50\\ \\mathrm{mm}}{633\\ \\mathrm{nm}} = \\frac{4.55\\ \\mu\\mathrm{m}}{0.633\\ \\mu\\mathrm{m}} = 7.19' }
      ],
      a: '7.19 waves: seven whole waves (which do nothing visible) plus 0.19 of a wave. A plate that thick is a multi-order wave plate.'
    }
  ],
  quiz: [
    { q: 'A light beam travels along the optic axis of a calcite crystal. What happens?', choices: ['It splits into two rays, widely separated', 'It travels as in glass: no splitting', 'It is totally reflected', 'It becomes circularly polarized'], a: 1, why: 'Along the optic axis the field is always across it, so every polarization sees $n_o$ and there is no double refraction.' },
    { q: 'The extraordinary ray in a birefringent crystal always obeys Snell\'s law.', a: false, why: 'Only the ordinary ray does. The extraordinary ray sees an index that depends on the angle between its wave normal and the axis, and its energy may travel at an angle to the normal.' },
    { q: 'Unpolarized light enters a calcite rhomb at normal incidence. The two emerging rays are polarized…', choices: ['the same way', 'at right angles to each other', 'circularly, in opposite senses', 'not at all'], a: 1, why: 'The ordinary ray is polarized across the principal section and the extraordinary ray in it: perpendicular linear polarizations.' },
    { q: 'How many wavelengths of retardance does a 1 mm quartz plate ($\\Delta n = 0.0091$) give at 550 nm?', answer: 16.5, why: '$N_w = \\Delta n\\,d/\\lambda = 0.0091 \\times 10^{-3}/550 \\times 10^{-9} = 16.5$.' },
    { q: 'Which of these crystals is a negative uniaxial crystal ($n_e < n_o$)?', choices: ['Crystal quartz', 'Calcite', 'Magnesium fluoride', 'Rutile'], a: 1, why: 'Calcite has $n_o = 1.658 > n_e = 1.486$. Quartz, MgF₂ and rutile are positive.' }
  ],
  applications: [
    'Calcite and yttrium orthovanadate beam displacers and Glan prisms, used to split or purify polarizations.',
    'Wave plates of quartz, magnesium fluoride and mica: see [[wave-plates]].',
    'Polarizing microscopy: minerals, crystals, starch and amyloid, and biological fibres are identified by their birefringence.',
    'Stress analysis of glass and plastics: [[photoelasticity-and-stress]].',
    'Liquid-crystal displays, where the birefringence of the cell is switched by a voltage.'
  ],
  history: 'The Danish physician Rasmus Bartholin described in 1669 the double image made by Iceland spar from the Eskifjörður region. Huygens explained it in 1690 with an ellipsoidal wavelet for the second ray, and found the "strange" polarization of the two beams. Malus and Brewster extended the study to other crystals; Brewster found biaxial crystals in 1818; Fresnel gave the complete wave theory in 1821 – 1822.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — birefringence, calcite, the Huygens construction in crystals.',
    'M. Born and E. Wolf, *Principles of Optics*, the chapter on the optics of crystals — the wave-normal and ray surfaces in uniaxial and biaxial crystals.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 6 — the index ellipsoid and the extraordinary ray.'
  ],
  sim: 'po-birefringence'
},

/* ================================================================ wave plates */
{
  id: 'wave-plates', parent: 'polarization', title: 'Wave plates: quarter and half wave', level: 2,
  short: 'A wave plate is a slice of birefringent crystal cut so that it delays one polarization behind the other by a set fraction of a wavelength. A quarter-wave plate turns linear light into circular and back; a half-wave plate turns the plane of linear light, by twice the angle between the light and the plate\'s fast axis.',
  keywords: ['wave plate', 'waveplate', 'retarder', 'quarter-wave plate', 'half-wave plate', 'QWP', 'HWP', 'λ/4', 'λ/2', 'fast axis', 'slow axis', 'retardance', 'zero-order', 'multi-order', 'achromatic wave plate', 'Fresnel rhomb', 'circular polarizer', 'phase retarder'],
  prereq: ['birefringence', 'polarization-states', 'polarizers-and-malus-law'],
  related: ['jones-calculus', 'stokes-parameters-and-mueller-matrices', 'polarization-in-practice', 'optical-isolators-and-modulators', 'polarizing-beam-splitters', 'photoelasticity-and-stress', 'physics:polarization'],
  body: `
Cut a [[birefringence|birefringent]] crystal parallel to its optic axis, so that light entering straight on has its two polarizations — along the axis and across it — travel together at different speeds. Out of a plate of thickness $d$ they come with a delay between them of $\\Delta n\\,d$, the **retardation**, or in angle the **retardance**

$$\\Gamma = \\frac{2\\pi\\,\\Delta n\\,d}{\\lambda}$$

The polarization with the lower index travels faster and emerges ahead: that direction is the plate\'s **fast axis**, the other the **slow axis**. Wave plates are engraved or marked with the fast axis (for positive crystals such as quartz it is perpendicular to the optic axis; for calcite it is along it).

### The two that matter
| Plate | Retardance | Turns linear light at angle θ to the fast axis into… | Also |
|---|---|---|---|
| Quarter-wave, λ/4 | 90° | elliptical light; **circular** at θ = 45° | circular back to linear |
| Half-wave, λ/2 | 180° | linear light at **−θ**: the plane is turned by 2θ | flips right and left circular |
| Full-wave, λ | 360° | unchanged (at the design wavelength) | the "sensitive tint" plate of microscopy |

A quarter-wave plate whose axis is at 45° to a linear polarizer gives a **circular polarizer**: linear in, circular out. A half-wave plate is the neat way to turn the polarization of a laser by any angle without moving anything: set its fast axis at half the angle you want. Turn the plate by 10° and the polarization turns by 20°.

### Order, and why it matters
A plate that delays by exactly λ/4 plus any whole number of wavelengths acts as a quarter-wave plate. Quartz has $\\Delta n = 0.0091$, so a quarter-wave at 550 nm needs only $0.25 \\times 550/0.0091 = 15.1$ µm — thinner than a hair and impossible to handle. So there are two kinds:
- A **multi-order** plate is thick enough to hold (0.3 – 1.5 mm of quartz: 5 to 25 waves) and has retardance of $N + \\tfrac14$ waves. It is cheap and strong, but exact at one wavelength and one temperature: a 10 nm shift of wavelength changes the retardance of a 20-wave plate by 0.36 wave, so it is no longer a quarter-wave plate.
- A **zero-order** plate has the quarter wave and nothing more. Made as two plates cemented with their axes crossed, thick and each many waves, but differing by exactly a quarter-wave, or as a polymer film, it holds its retardance over a wavelength range tens of times wider and varies far less with temperature and angle.

Stacking quartz with magnesium fluoride (whose birefringence changes with wavelength differently) gives **achromatic** plates good across 400 – 700 nm or wider. A **Fresnel rhomb**, a glass prism in which two total internal reflections each add a retardance of 45°, gives an almost wavelength-independent quarter-wave and has no thickness to tune. The $\\Delta n$ of calcite is so large (0.17) that a calcite quarter-wave plate would be 0.8 µm thick: calcite is never used for plates, only for prisms.

### Reflections that turn back
Right-circular light reflected from a mirror at normal incidence comes back left-circular (the sense of rotation about the direction of travel is reversed). Pass it back through the same quarter-wave plate and it is linear again — but turned by 90° from where it started. That is the **circular-polarizer trick** that removes reflections from instrument panels and OLED screens, and the principle of a simple optical isolator for light reflected from surfaces: see [[polarization-in-practice]].

> [!key] A wave plate delays one polarization by a fraction of a wavelength: λ/4 makes linear light circular (at 45° to the axis), λ/2 turns the plane of linear light by twice the angle to the fast axis. Zero-order plates tolerate wavelength and temperature far better than multi-order ones.
`,
  ideas: [
    'A wave plate is a birefringent slice that delays one polarization behind the other by a retardance Γ = 2πΔn d/λ.',
    'The polarization on the faster path is the fast axis; the other is the slow axis.',
    'A λ/4 plate at 45° turns linear into circular light and the reverse; a λ/2 plate turns linear light by twice the angle to the fast axis.',
    'Multi-order plates (many whole waves plus a quarter) are cheap and thick; zero-order, achromatic and Fresnel-rhomb retarders hold their retardance over a wider range.',
    'A quarter-wave plate in front of a mirror, passed twice, turns the polarization by 90°: the basis of anti-reflection circular filters.'
  ],
  pitfalls: [
    'A wave plate changes the intensity of the light — An ideal wave plate changes only the polarization: every bit of light that goes in comes out. Only a polarizer (or an absorbing plate) removes light.',
    'A half-wave plate turns the polarization by its own angle — The polarization turns by twice the angle between the light and the fast axis. A 22.5° plate turns horizontal light to 45°.',
    'A quarter-wave plate always makes circular light — Only when the incoming linear polarization is at 45° to its axes. At other angles the result is elliptical, and at 0° or 90° there is no change at all.',
    'A quarter-wave plate for 550 nm works for any colour — The retardance changes with the wavelength (in proportion to 1/λ, more for multi-order plates), so the plate is a good quarter-wave only near its design wavelength.'
  ],
  terms: [
    { term: 'Wave plate', also: ['waveplate', 'retarder', 'phase retarder', 'retardation plate'], def: 'A birefringent plate cut parallel to its optic axis that delays one polarization behind the other by a defined fraction of a wavelength.' },
    { term: 'Retardance', also: ['retardation', 'phase delay', 'Γ'], def: 'The phase difference Γ = 2πΔn d/λ that a plate puts between its two polarizations: 90° for a quarter-wave plate, 180° for a half-wave plate. Retardation, in length, is Δn·d.' },
    { term: 'Fast axis', also: ['slow axis'], def: 'The direction of polarization that sees the lower refractive index in a wave plate, so that its light emerges ahead. The perpendicular direction is the slow axis.' },
    { term: 'Quarter-wave plate', also: ['QWP', 'λ/4 plate'], def: 'A plate with a retardance of a quarter of a wavelength: it converts linear light at 45° to its axes into circular light, and the reverse.' },
    { term: 'Half-wave plate', also: ['HWP', 'λ/2 plate'], def: 'A plate with a retardance of half a wavelength: it turns the plane of linear polarization by twice the angle between the light and its fast axis, and flips circular handedness.' },
    { term: 'Zero-order wave plate', also: ['multi-order wave plate'], def: 'A plate (single, compound or film) whose retardance is just the quarter or half wave, with no whole waves added. A multi-order plate adds whole waves and is far more sensitive to wavelength and temperature.' },
    { term: 'Achromatic wave plate', def: 'A retarder made of two materials, or a Fresnel rhomb, whose retardance is nearly the same over a wide band of wavelengths.' }
  ],
  formulas: [
    {
      name: 'Thickness of a wave plate',
      expr: 'd = Nw*lambda/Dn', tex: 'd = \\frac{N_w\\,\\lambda}{\\Delta n}',
      vars: {
        d: { name: 'thickness', q: 'length', unit: 'µm' },
        Nw: { name: 'retardance in waves (0.25 quarter, 0.5 half)', value: 0.25, tex: 'N_w' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        Dn: { name: 'size of the birefringence |Δn|', value: 0.0091, tex: '\\Delta n' }
      },
      solveFor: 'd',
      note: 'Quartz (Δn = 0.0091) for 550 nm: 15.1 µm for a zero-order quarter-wave plate; add whole waves for multi-order.',
      stories: { d: 'How thick is a zero-order plate of retardance {Nw} waves at {lambda} made of a crystal with |Δn| = {Dn}?' }
    },
    {
      name: 'Output angle of a half-wave plate',
      expr: 'psiout = 2*thf - psiin', tex: '\\psi_{\\mathrm{out}} = 2\\,\\theta_f - \\psi_{\\mathrm{in}}',
      vars: {
        psiout: { name: 'polarization angle out', q: 'angle', unit: '°', signed: true, tex: '\\psi_{\\mathrm{out}}' },
        thf: { name: 'angle of the fast axis', q: 'angle', unit: '°', value: 22.5, signed: true, tex: '\\theta_f' },
        psiin: { name: 'polarization angle in', q: 'angle', unit: '°', value: 0, signed: true, tex: '\\psi_{\\mathrm{in}}' }
      },
      solveFor: 'psiout',
      note: 'All angles from the same reference direction. The plane is reflected in the fast axis.',
      stories: { psiout: 'Linear light polarized at {psiin} meets a half-wave plate with its fast axis at {thf}. At what angle is the light polarized when it comes out?', thf: 'Vertical light (90°) must be turned to {psiout}. At what angle must the fast axis of a half-wave plate be set?' }
    },
    {
      name: 'Retardance error of a multi-order plate',
      expr: 'dN = Nw*dlam/lambda', tex: '\\Delta N = N_w\\,\\frac{\\delta\\lambda}{\\lambda}',
      vars: {
        dN: { name: 'change of the retardance, in waves', tex: '\\Delta N' },
        Nw: { name: 'retardance of the plate in waves', value: 20.25, tex: 'N_w' },
        dlam: { name: 'change of wavelength', q: 'length', unit: 'nm', value: 10, tex: '\\delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'dN',
      note: 'To first order, and ignoring the change of Δn with wavelength. A quarter-wave plate needs ΔN well under 0.02.',
      stories: { dN: 'A plate gives {Nw} waves of retardance at {lambda}. By how much does the retardance change if the wavelength shifts by {dlam}?' }
    }
  ],
  examples: [
    {
      title: 'A quarter-wave plate for a helium–neon laser',
      q: 'A quartz zero-order quarter-wave plate is to be made for 633 nm. How thick is it, and how thick is the multi-order plate with 20 whole waves added?',
      steps: [
        { text: 'Zero order:', tex: 'd = \\frac{0.25 \\times 633\\ \\mathrm{nm}}{0.0091} = 17.4\\ \\mu\\mathrm{m}' },
        { text: 'With 20 waves added:', tex: 'd = \\frac{20.25 \\times 633\\ \\mathrm{nm}}{0.0091} = 1.41\\ \\mathrm{mm}' }
      ],
      a: '17.4 µm for the zero-order plate (made as a compound plate or on a substrate in practice); 1.41 mm for the multi-order one.'
    },
    {
      title: 'Turning a laser\'s polarization',
      q: 'A laser beam is vertically polarized (90° from horizontal). Where should the fast axis of a half-wave plate be set to turn the polarization to 30°?',
      steps: [
        { text: 'Use the output angle $\\psi_{out} = 2\\theta_f - \\psi_{in}$ and solve for the axis:', tex: '\\theta_f = \\frac{\\psi_{out} + \\psi_{in}}{2} = \\frac{30° + 90°}{2} = 60°' },
        'The axis therefore lies half-way between the incoming and outgoing polarizations (or 90° further round, at 150°).'
      ],
      a: 'At 60° (or 150°): the plate reflects the plane of polarization in its fast axis.'
    }
  ],
  quiz: [
    { q: 'Light polarized at +30° meets a half-wave plate with its fast axis horizontal (0°). It comes out polarized at…', choices: ['+30°', '−30°', '+60°', '0°'], a: 1, why: 'A half-wave plate reflects the plane of polarization in its fast axis: $\\psi_{out} = 2\\theta_f - \\psi_{in} = -30°$. A rotation of the plane by the angle of the axis would give +60°; neither is +30°.' },
    { q: 'Linear light polarized at 45° to its axes meets an ideal quarter-wave plate. The light that comes out is…', choices: ['linear at 45°', 'linear at 90°', 'circularly polarized', 'unpolarized'], a: 2, why: 'The quarter-wave delay between two equal components makes the tip of the field go round a circle.' },
    { q: 'A multi-order quarter-wave plate holds its quarter-wave retardance over a wider range of wavelengths than a zero-order one.', a: false, why: 'The retardance changes by N δλ/λ waves, in proportion to the number of whole waves N in the plate. A zero-order plate has none to spare, so it is much more tolerant.' },
    { q: 'How thick is a zero-order quartz quarter-wave plate for 550 nm ($\\Delta n = 0.0091$)? (micrometres)', answer: 15.1, unit: 'µm', why: '$d = \\lambda/(4\\Delta n) = 550\\ \\mathrm{nm}/(4 \\times 0.0091) = 15.1\\ \\mu\\mathrm{m}$.' },
    { q: 'Right-circular light reflects from a flat mirror at normal incidence. The reflected light is…', choices: ['right circular', 'left circular', 'linear', 'unpolarized'], a: 1, why: 'The direction of travel is reversed but the electric field is not, so the sense of rotation about the direction of travel flips: circular polarizers use this to trap reflections.' }
  ],
  applications: [
    'Circular polarizers: linear polarizer plus quarter-wave plate, for camera filters that suit autofocus and metering, and for anti-glare filters on displays and instrument panels.',
    'Polarization control of lasers: a half-wave plate sets the angle, a quarter-wave plate sets the ellipticity.',
    'Optical isolators and circulators, and the modulation of light in disc pick-ups (a quarter-wave plate in front of a polarizing beam splitter).',
    'Microscopy and mineralogy: full-wave and quarter-wave compensator plates shift the interference colours of crystals to measure their retardation.',
    'Ellipsometry and polarimetry: a rotating retarder before an analyzer measures all four Stokes parameters.'
  ],
  history: 'Fresnel invented the rhomb in 1817 – 1823 after working out how total internal reflection changes the polarization, and used it to make the first circularly polarized light; it was the first retarder. Plates of cleaved mica, which has a convenient birefringence of about 0.04, were the standard retarders of the 19th century, and quartz and polymer film replaced them in the 20th.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — retarders, circular polarizers, the Fresnel rhomb.',
    'D. H. Goldstein, *Polarized Light* (CRC Press) — retarders, compound and achromatic plates, their Jones and Mueller matrices.',
    'J. M. Bennett, "Polarization", in the *Handbook of Optics* — properties and tolerances of wave plates.'
  ],
  sim: 'po-waveplate'
},

/* ================================================================ Jones calculus */
{
  id: 'jones-calculus', parent: 'polarization', title: 'The Jones calculus', level: 3,
  short: 'Fully polarized light is two complex numbers, the Jones vector (Ex, Ey), and every polarizer, wave plate and rotator is a 2 × 2 matrix. The light after a train of elements is found by multiplying the vector by the matrices in order: the whole of polarization optics reduced to arithmetic with small matrices.',
  keywords: ['Jones calculus', 'Jones vector', 'Jones matrix', 'R. Clark Jones', 'polarization matrix', 'complex amplitude', 'eigenpolarization', 'rotation of an element', '2×2 matrix', 'polarizer matrix', 'retarder matrix', 'coherent polarization'],
  prereq: ['polarization-states', 'polarizers-and-malus-law', 'wave-plates'],
  related: ['stokes-parameters-and-mueller-matrices', 'optical-activity-and-faraday-rotation', 'physics:polarization', 'math:matrix-multiplication', 'math:complex-numbers', 'feynman:polarization-feyn'],
  body: `
A light wave travelling along $z$ has an electric field $\\mathrm{Re}[\\,\\mathbf{E}\\,e^{i(kz-\\omega t)}]$, and $\\mathbf{E}$ has two components across the beam, each with an amplitude and a phase: $E_x = a_x e^{i\\phi_x}$, $E_y = a_y e^{i\\phi_y}$. The **Jones vector** is these two complex numbers written as a column,

$$\\mathbf{J} = \\begin{pmatrix} E_x \\\\ E_y \\end{pmatrix}$$

The intensity is $|E_x|^2 + |E_y|^2$. Only the *relative* phase of the components matters, so a common factor $e^{i\\phi}$ is thrown away. The states of [[polarization-states]] become:

| State | Jones vector |
|---|---|
| Horizontal | $(1, 0)$ |
| Vertical | $(0, 1)$ |
| +45° | $(1, 1)/\\sqrt2$ |
| Right circular | $(1, -i)/\\sqrt2$ |
| Left circular | $(1, i)/\\sqrt2$ |

Right circular is *y lagging x by a quarter period*, the factor $-i$. The phase lag $\\delta$ and the amplitude split $\\tan\\alpha = a_y/a_x$ give the ellipse: $\\sin 2\\chi = \\sin 2\\alpha\\,\\sin\\delta$.

### Elements are matrices
A device that changes the polarization linearly is a **Jones matrix**: $\\mathbf{J}_{out} = \\mathbf{M}\\,\\mathbf{J}_{in}$. In a frame where the element\'s axis is horizontal:

| Element | Matrix |
|---|---|
| Horizontal linear polarizer | $\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$ |
| Retarder, fast axis horizontal, retardance $\\Gamma$ | $\\begin{pmatrix}1&0\\\\0&e^{i\\Gamma}\\end{pmatrix}$ (up to a common phase) |
| Quarter-wave plate | $\\begin{pmatrix}1&0\\\\0&i\\end{pmatrix}$ |
| Half-wave plate | $\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$ |
| Rotator (turns the plane by $\\theta$) | $\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\ \\sin\\theta&\\cos\\theta\\end{pmatrix}$ |

An element turned by an angle $\\theta$ has the matrix $\\mathbf{R}(\\theta)\\,\\mathbf{M}\\,\\mathbf{R}(-\\theta)$, where $\\mathbf{R}$ is the rotator matrix: rotate into the element\'s frame, act, rotate back. A polarizer at $\\theta$ is $\\begin{pmatrix}\\cos^2\\theta & \\cos\\theta\\sin\\theta\\\\ \\cos\\theta\\sin\\theta & \\sin^2\\theta\\end{pmatrix}$, which reproduces [[polarizers-and-malus-law|Malus\'s law]]: horizontal light through it has the intensity $\\cos^2\\theta$.

### A train of elements
Light meets element 1, then 2, then 3. The Jones vector after all three is $\\mathbf{M}_3\\mathbf{M}_2\\mathbf{M}_1\\mathbf{J}_{in}$: the matrices are multiplied in the **reverse** of the order the light meets them, and matrix products do not commute — a quarter-wave plate then a polarizer is a different device from the polarizer then the plate. The product is one matrix for the whole train, which can be tested on any input.

- *Circular analyzer.* A quarter-wave plate with its axis horizontal, then a polarizer at 45°: right-circular light $(1,-i)/\\sqrt2$ becomes $(1, 1)/\\sqrt2$ after the plate and passes in full; left-circular becomes $(1,-1)/\\sqrt2$ and is stopped.
- *Two plates make a bigger plate.* Two quarter-wave plates with the same axis multiply to $\\mathrm{diag}(1, i^2) = \\mathrm{diag}(1, -1)$, a half-wave plate.

### What the Jones calculus cannot do
It describes fully polarized, coherent light. Unpolarized and partially polarized light, and elements that depolarize (scatterers, diffusers), need the intensity-based [[stokes-parameters-and-mueller-matrices|Stokes and Mueller]] description. A Jones matrix also tracks the phase of the light, which the Mueller matrix does not: interferometers, polarization-maintaining fibres and polarization-dependent phase shifts are Jones problems.

> [!key] Fully polarized light is a 2-component complex vector; each element is a 2 × 2 matrix; the light after a train is $\\mathbf{M}_N\\cdots\\mathbf{M}_2\\mathbf{M}_1\\mathbf{J}$, last element leftmost. Rotate an element by sandwiching it between rotations.
`,
  ideas: [
    'A Jones vector (Ex, Ey) holds the amplitude and phase of both field components; a common phase does not matter.',
    'Polarizers, retarders and rotators are 2 × 2 complex matrices; the light out is the matrix times the vector in.',
    'For a train of elements the matrices are multiplied in reverse order of meeting the light: M₃M₂M₁.',
    'A turned element is R(θ) M R(−θ), the matrix in its own frame sandwiched between rotations.',
    'Jones calculus covers only fully polarized, coherent light; partial polarization needs Stokes and Mueller.'
  ],
  pitfalls: [
    'The elements can be multiplied in any order — Matrix products depend on order. For a train meeting elements 1, 2, 3 the total matrix is M₃M₂M₁, and swapping two elements gives a different device.',
    'The phase of a Jones vector carries physical information, so (1, i) and i·(1, i) differ — Only the relative phase of Ex and Ey matters for the polarization state. A common factor changes nothing, though it matters in an interferometer, where light is combined with other light.',
    'Jones matrices work for any light — They work for fully polarized light. For partial polarization the Stokes vectors and Mueller matrices are needed.',
    'The Jones matrix of a wave plate is fixed — It is fixed in the plate\'s own frame; rotating the plate by θ changes the matrix to R(θ) M R(−θ), and with it the output.'
  ],
  terms: [
    { term: 'Jones vector', def: 'The column (Eₓ, E_y) of the two complex amplitudes of the electric field across a beam. It describes any fully polarized state; its length squared is the intensity.' },
    { term: 'Jones matrix', def: 'A 2 × 2 complex matrix describing how a polarizing element changes a Jones vector: J_out = M J_in.' },
    { term: 'Jones calculus', also: ['Jones matrix method'], def: 'The method, due to R. Clark Jones (1941), of finding the polarization after a train of elements by multiplying the input Jones vector by the elements\' matrices.' },
    { term: 'Eigenpolarization', also: ['eigenstate', 'normal mode'], def: 'A polarization state that an element leaves unchanged except for a factor: the fast and slow axis states of a wave plate, or the two circular states for a rotator.' },
    { term: 'Rotation matrix', also: ['R(θ)'], def: 'The matrix that turns a Jones vector by an angle θ. Sandwiched as R(θ) M R(−θ) it turns an element by θ.' }
  ],
  formulas: [
    {
      name: 'Ellipticity from the Jones components',
      expr: 'sin(2*chi) = sin(2*alpha)*sin(delta)', tex: '\\sin 2\\chi = \\sin 2\\alpha\\,\\sin\\delta',
      vars: {
        chi: { name: 'ellipticity angle', q: 'angle', unit: '°', signed: true, min: -45, max: 45, tex: '\\chi' },
        alpha: { name: 'amplitude angle, tan α = |Ey| ÷ |Ex|', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\alpha' },
        delta: { name: 'phase lag of y behind x', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\delta' }
      },
      solveFor: 'chi',
      note: 'Positive χ is right-handed in this app\'s convention. δ = 90° with α = 45° is circular (χ = 45°); δ = 0 is linear (χ = 0).',
      stories: { chi: 'A Jones vector has Ey/Ex of amplitude angle {alpha} and y lags x by {delta}. What is the ellipticity angle?' }
    }
  ],
  examples: [
    {
      title: 'Linear into circular',
      q: 'Light polarized at 45°, $(1, 1)/\\sqrt2$, goes through a quarter-wave plate with its fast axis horizontal. Find the Jones vector out and say what it is.',
      steps: [
        { text: 'Multiply by the quarter-wave matrix:', tex: '\\begin{pmatrix}1&0\\\\0&i\\end{pmatrix}\\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\1\\end{pmatrix} = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ i\\end{pmatrix}' },
        'The two components have equal size and $E_y$ is a quarter turn *ahead* of $E_x$: left-circular light. The intensity is unchanged, $\\tfrac12 + \\tfrac12 = 1$.'
      ],
      a: '(1, i)/√2: left-circular light, with all of the intensity.'
    },
    {
      title: 'The third polarizer, by matrices',
      q: 'Horizontal light $(1, 0)$ goes through a polarizer at 45° and then one at 90°. What intensity comes out?',
      steps: [
        { text: 'The 45° polarizer is $\\tfrac12\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$, so after it:', tex: '\\frac12\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}\\begin{pmatrix}1\\\\0\\end{pmatrix} = \\frac12\\begin{pmatrix}1\\\\1\\end{pmatrix}' },
        { text: 'The vertical polarizer keeps only the y component:', tex: '\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}\\frac12\\begin{pmatrix}1\\\\1\\end{pmatrix} = \\begin{pmatrix}0\\\\ \\tfrac12\\end{pmatrix}' },
        { text: 'The intensity is the squared length:', tex: 'I = 0 + \\left(\\tfrac12\\right)^2 = \\tfrac14' }
      ],
      a: 'A quarter of the incident light: with the polarizer left out the answer would be zero.'
    }
  ],
  quiz: [
    { q: 'In this app\'s convention, which Jones vector is right-circular light?', choices: ['(1, i)/√2', '(1, −i)/√2', '(1, 1)/√2', '(1, 0)'], a: 1, why: 'Right circular is $y$ lagging $x$ by a quarter period: $E_y = -iE_x$. $(1, i)/\\sqrt2$ is its mirror image, left-circular.' },
    { q: 'Light meets elements A, then B, then C. The total Jones matrix is…', choices: ['A B C', 'C B A', 'A + B + C', 'it does not matter'], a: 1, why: 'The vector is multiplied first by A, then the result by B, then C: $\\mathbf{J}_{out} = \\mathbf{C}(\\mathbf{B}(\\mathbf{A}\\mathbf{J}))$, so the total matrix is CBA. Matrix multiplication does not commute.' },
    { q: 'Multiplying a Jones vector by a common phase factor such as $e^{i\\pi/3}$ changes the polarization state.', a: false, why: 'Only the relative phase and amplitude of the two components define the state. A common phase is unobservable for one beam (it matters when two beams interfere).' },
    { q: 'Horizontal light goes through polarizers at 45° and 90°. What fraction of the intensity is left?', answer: 0.25, why: 'After the first polarizer $(1,1)/2$; after the second $(0, 1/2)$; intensity $1/4$.' },
    { q: 'Which light can the Jones calculus **not** describe?', choices: ['Right-circular light', 'Elliptically polarized laser light', 'Partially polarized light from a lamp', 'Linear light at 17°'], a: 2, why: 'A Jones vector is a single, perfectly coherent state. Partially polarized light is a mix of states and needs Stokes vectors.' }
  ],
  applications: [
    'Designing polarization optics: isolators, circulators, liquid-crystal cells, polarization controllers.',
    'Fibre-optic communications: polarization-mode dispersion and polarization controllers are described with Jones matrices.',
    'Ellipsometry and the modelling of anisotropic thin films and metamaterials.',
    'Computing how a stack of retarders (an achromatic wave plate, a Lyot filter) behaves over a band of wavelengths.',
    'Ray-tracing software that carries polarization along each ray uses 2 × 2 or 3 × 3 Jones matrices at every surface.'
  ],
  history: 'The method was published from 1941 by R. Clark Jones in a series of papers in the Journal of the Optical Society of America, under the title "A new calculus for the treatment of optical systems". It put the whole of polarization optics in one notation and showed, among other things, that any train of retarders and polarizers is equivalent to one retarder followed by one polarizer.',
  sources: [
    'R. C. Jones, "A new calculus for the treatment of optical systems", *J. Opt. Soc. Am.* 31 (1941) — the original series of papers.',
    'E. Hecht, *Optics*, ch. 8 (Polarization) — the Jones vectors and matrices of the common elements.',
    'D. H. Goldstein, *Polarized Light* (CRC Press) — Jones and Mueller methods compared.'
  ],
  sim: 'po-bench'
},

/* ================================================================ Stokes and Mueller */
{
  id: 'stokes-parameters-and-mueller-matrices', parent: 'polarization', title: 'Stokes parameters and Mueller matrices', level: 3,
  short: 'Four measurable intensities — the Stokes parameters — describe any light, polarized, partly polarized or not at all. The 4 × 4 Mueller matrix of an element acts on them the way a Jones matrix acts on a Jones vector, but it can also describe depolarization. The Poincaré sphere is the picture of the three polarization parameters.',
  keywords: ['Stokes parameters', 'Stokes vector', 'Mueller matrix', 'Mueller calculus', 'Poincaré sphere', 'partially polarized', 'degree of polarization', 'depolarizer', 'polarimeter', 'S0 S1 S2 S3', 'degree of linear polarization', 'DoLP', 'polarimetry', 'division of focal plane'],
  prereq: ['polarization-states', 'jones-calculus', 'polarizers-and-malus-law'],
  related: ['wave-plates', 'polarization-by-reflection-and-scattering', 'ellipsometry', 'physics:polarization'],
  body: `
Jones vectors need fully polarized light. But what a detector measures are *intensities*, and sunlight, skylight and glare are partly polarized. George Stokes found in 1852 that four intensities, each measured through a simple filter, describe any beam completely:

| Parameter | Measured as | Meaning |
|---|---|---|
| $S_0$ | $I_H + I_V$ | total intensity |
| $S_1$ | $I_H - I_V$ | horizontal against vertical |
| $S_2$ | $I_{+45°} - I_{-45°}$ | diagonal against anti-diagonal |
| $S_3$ | $I_R - I_L$ | right against left circular |

Each of the last three is an intensity difference through a pair of opposite analyzers, the circular ones made with a quarter-wave plate in front of a polarizer. The **Stokes vector** $\\mathbf{S} = (S_0, S_1, S_2, S_3)$ obeys $S_0^2 \\ge S_1^2 + S_2^2 + S_3^2$, with equality for fully polarized light, and the **degree of polarization** is

$$p = \\frac{\\sqrt{S_1^2 + S_2^2 + S_3^2}}{S_0}$$

Unpolarized light is $(1, 0, 0, 0)$; horizontal light $(1, 1, 0, 0)$; right-circular $(1, 0, 0, 1)$; a patch of sky 90° from a low Sun, vibrating vertically with $p = 0.7$, about $(1, -0.7, 0, 0)$. The *linear* part has its own degree, $\\sqrt{S_1^2+S_2^2}/S_0$, and an azimuth $\\psi = \\tfrac12\\arctan(S_2/S_1)$; $S_3/S_0$ is the circular part.

### Mueller matrices
Just as a Jones matrix turns a Jones vector into another, a **Mueller matrix** is a 4 × 4 real matrix that turns one Stokes vector into another: $\\mathbf{S}_{out} = \\mathbf{M}\\,\\mathbf{S}_{in}$. Because it works on intensities, it handles a polarizer or retarder acting on partially polarized light, and elements that **depolarize**, which no Jones matrix can describe.

| Element | Mueller matrix |
|---|---|
| Horizontal polarizer | $\\tfrac12\\begin{pmatrix}1&1&0&0\\\\1&1&0&0\\\\0&0&0&0\\\\0&0&0&0\\end{pmatrix}$ |
| Quarter-wave plate, fast axis horizontal | $\\begin{pmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&0&1\\\\0&0&-1&0\\end{pmatrix}$ |
| Depolarizer keeping a fraction $f$ | $\\mathrm{diag}(1, f, f, f)$ |

A train is again a product, last element on the left. Unpolarized light through a horizontal polarizer is $(0.5, 0.5, 0, 0)$: half the intensity, now fully polarized; if a quarter-wave plate at 45° follows, the light comes out as $(0.5, 0, 0, 0.5)$ — circular, with half the original power. That is a circular polarizer.

### The Poincaré sphere
Divide $S_1, S_2, S_3$ by $S_0$ and plot them as a point in space. Fully polarized states lie on a sphere of radius 1, the **Poincaré sphere** (Henri Poincaré, 1892): the equator is linear light, H and V at the ends of the $S_1$ axis and ±45° on $S_2$; the poles are circular, right at the top and left at the bottom; everything between is elliptical. A point *inside* the sphere is partially polarized, its distance from the centre being $p$; the centre is unpolarized light. A **retarder** rotates the sphere about an axis through the equator by its retardance, a **polarizer** pulls a point to the nearest point of the equator axis, a **depolarizer** shrinks it towards the centre. A quarter-wave plate carries a point from the equator to a pole in a quarter of a turn: linear into circular.

### Measuring Stokes parameters
A **polarimeter** measures at least four intensities with different analyzers: a rotating analyzer behind a fixed or rotating quarter-wave plate, or four polarizers at 0°, 45°, 90° and 135° with a circular one. Polarization cameras do this on the chip itself: each 2 × 2 block of pixels carries wire-grid polarizers at four angles, and a single exposure gives the linear Stokes parameters at every point of the picture.

> [!key] The Stokes vector (S₀ S₁ S₂ S₃) describes any light by four intensity differences; the Mueller matrix, 4 × 4, acts on it and can include depolarization. On the Poincaré sphere, fully polarized states lie on the surface, partly polarized ones inside, and elements move the point.
`,
  ideas: [
    'The four Stokes parameters are intensities: total, H − V, +45° − −45°, and R − L.',
    'S₀² ≥ S₁² + S₂² + S₃²: equality means fully polarized; the degree of polarization is p = √(S₁² + S₂² + S₃²)/S₀.',
    'A Mueller matrix (4 × 4, real) acts on a Stokes vector and can describe depolarization, which a Jones matrix cannot.',
    'On the Poincaré sphere linear states form the equator, circular states the poles, partial polarization the inside.',
    'Retarders rotate the sphere about an equatorial axis, polarizers project onto the equator axis, depolarizers shrink the point.'
  ],
  pitfalls: [
    'Stokes parameters are fields or amplitudes, like Jones vectors — They are intensities (or differences of intensities) and have the units of intensity. That is why they add for incoherent light and why they can describe partially polarized light.',
    'The Poincaré sphere is a picture of the light\'s direction in space — It is an abstract space of polarization states. Its axes (S₁, S₂, S₃) are three kinds of polarization contrast, not x, y and z; H and V lie at opposite poles of the S₁ axis though they are 90° apart in space.',
    'Mueller matrices are the same as Jones matrices with more rows — They are real and act on intensities, and every Jones matrix has a Mueller matrix but most Mueller matrices (depolarizers, scatterers) have no Jones matrix at all.',
    'Unpolarized light is "no polarization" so it has a zero Stokes vector — S₀ is the intensity, and it is non-zero. Only S₁, S₂, S₃ are zero.'
  ],
  terms: [
    { term: 'Stokes parameters', also: ['Stokes vector', 'S₀ S₁ S₂ S₃'], def: 'Four intensity measurements — total, horizontal minus vertical, +45° minus −45°, right minus left circular — that describe any state of light, polarized or not.' },
    { term: 'Mueller matrix', also: ['Mueller calculus'], def: 'A 4 × 4 real matrix that turns the Stokes vector of the light entering an element into that of the light leaving it. It can include depolarization.' },
    { term: 'Poincaré sphere', def: 'The sphere on which the normalized Stokes parameters (S₁, S₂, S₃)/S₀ of fully polarized light lie: linear states on the equator, circular states at the poles.' },
    { term: 'Depolarizer', def: 'An element that reduces the degree of polarization of the light passing through it, such as a scattering diffuser or a wedge of birefringent crystal. It has a Mueller matrix but no Jones matrix.' },
    { term: 'Polarimeter', also: ['Stokes polarimeter'], def: 'An instrument that measures the polarization state of light, usually by measuring four or more intensities through different analyzers.' },
    { term: 'Degree of linear polarization', also: ['DoLP'], def: 'The fraction of the light that is linearly polarized, √(S₁² + S₂²)/S₀. The corresponding circular share is S₃/S₀.' }
  ],
  formulas: [
    {
      name: 'Degree of linear polarization',
      expr: 'DoLP = sqrt(S1^2 + S2^2)/S0', tex: '\\mathrm{DoLP} = \\frac{\\sqrt{S_1^2 + S_2^2}}{S_0}',
      vars: {
        DoLP: { name: 'degree of linear polarization', min: 0, max: 1, tex: '\\mathrm{DoLP}' },
        S0: { name: 'total intensity', value: 1.2 },
        S1: { name: 'horizontal minus vertical', value: 0.6, signed: true },
        S2: { name: '+45° minus −45°', value: 0.4, signed: true }
      },
      solveFor: 'DoLP',
      note: 'The share of the light that is linearly polarized; polarization cameras and sky and haze measurements quote it.'
    },
    {
      name: 'Azimuth of the linear polarization',
      expr: 'psi = atan2(S2, S1)/2', tex: '\\psi = \\tfrac12\\arctan\\frac{S_2}{S_1}',
      vars: {
        psi: { name: 'azimuth of the long axis', q: 'angle', unit: '°', signed: true, tex: '\\psi' },
        S1: { name: 'horizontal minus vertical', value: 0.6, signed: true },
        S2: { name: '+45° minus −45°', value: 0.4, signed: true }
      },
      solveFor: 'psi',
      note: 'From −90° to +90°; the angle is measured from the horizontal, as the S₁ axis is. The quadrant is fixed by the signs of S₁ and S₂.'
    },
    {
      name: 'Ellipticity from the Stokes parameters',
      expr: 'chi = asin(S3/(p*S0))/2', tex: '\\chi = \\tfrac12\\arcsin\\frac{S_3}{p\\,S_0}',
      vars: {
        chi: { name: 'ellipticity angle', q: 'angle', unit: '°', signed: true, tex: '\\chi' },
        S3: { name: 'right minus left circular', value: 0.2, signed: true },
        p: { name: 'degree of polarization', value: 0.62, min: 0.01, max: 1 },
        S0: { name: 'total intensity', value: 1.2 }
      },
      solveFor: 'chi',
      note: 'The ellipticity of the polarized part of the light. Positive for right-handed light.'
    }
  ],
  examples: [
    {
      title: 'Four measurements',
      q: 'Behind analyzers a beam gives $I_H = 0.9$, $I_V = 0.3$, $I_{45} = 0.8$, $I_{135} = 0.4$, $I_R = 0.7$, $I_L = 0.5$ (in mW). Find the Stokes vector, the degree of polarization and the azimuth of the linear part.',
      steps: [
        { text: 'The Stokes parameters:', tex: 'S_0 = 0.9 + 0.3 = 1.2,\\quad S_1 = 0.9 - 0.3 = 0.6,\\quad S_2 = 0.8 - 0.4 = 0.4,\\quad S_3 = 0.7 - 0.5 = 0.2' },
        { text: 'Degree of polarization:', tex: 'p = \\frac{\\sqrt{0.6^2 + 0.4^2 + 0.2^2}}{1.2} = \\frac{0.748}{1.2} = 0.62' },
        { text: 'Azimuth of the linear part:', tex: '\\psi = \\tfrac12\\arctan\\frac{0.4}{0.6} = 16.8°' }
      ],
      a: 'S = (1.2, 0.6, 0.4, 0.2) mW; p = 0.62, mostly linear at 17° with a little right-circular content.'
    },
    {
      title: 'A circular polarizer, by Mueller matrices',
      q: 'One watt of unpolarized light goes through a horizontal polarizer and then a quarter-wave plate with its fast axis at 45°. What comes out?',
      steps: [
        'Start: $\\mathbf{S} = (1, 0, 0, 0)$. The horizontal polarizer gives $(0.5, 0.5, 0, 0)$.',
        'The quarter-wave plate at 45° moves a point on the $S_1$ axis (horizontal) a quarter turn about the $S_2$ axis, to the $S_3$ pole.',
        { text: 'The result:', tex: '\\mathbf{S}_{out} = (0.5,\\ 0,\\ 0,\\ 0.5)' }
      ],
      a: 'Right-circular light, fully polarized (p = 1), carrying 0.5 W: half the original power.'
    }
  ],
  quiz: [
    { q: 'Which Stokes vector describes unpolarized light of unit intensity?', choices: ['(0, 0, 0, 0)', '(1, 0, 0, 0)', '(1, 1, 0, 0)', '(1, 1, 1, 1)'], a: 1, why: '$S_0$ is the intensity, and the other three — the polarized contrasts — are zero. $(1, 1, 0, 0)$ is horizontal light; $(0,0,0,0)$ is darkness.' },
    { q: 'Points inside the Poincaré sphere represent partially polarized light; points on its surface fully polarized light.', a: true, why: 'The distance of the point from the centre is the degree of polarization $p$; the centre is unpolarized light.' },
    { q: 'A beam has $(S_0, S_1, S_2, S_3) = (4, 1, 2, 2)$. What is its degree of polarization?', answer: 0.75, why: '$p = \\sqrt{1 + 4 + 4}/4 = 3/4 = 0.75$.' },
    { q: 'On the Poincaré sphere, what does a depolarizer do to the point that represents the light?', choices: ['Rotates it about the polar axis', 'Moves it towards the centre', 'Moves it to the nearest pole', 'Nothing: depolarizers do not exist'], a: 1, why: 'A depolarizer shrinks $S_1, S_2, S_3$ relative to $S_0$: the point sinks towards the centre, which is unpolarized light. Retarders only move the point round the surface.' },
    { q: 'Why can a Jones matrix not describe a diffuser that scrambles the polarization?', choices: ['It cannot handle intensity', 'It describes only fully polarized, coherent light and keeps it fully polarized', 'Diffusers are not linear', 'Jones matrices are real'], a: 1, why: 'A Jones matrix maps a fully polarized state to a fully polarized state. A depolarizer turns it into partially polarized light, which only the Mueller matrix can express.' }
  ],
  applications: [
    'Polarization cameras that give the degree and angle of linear polarization at every pixel, for glare removal, surface inspection and stress imaging.',
    'Remote sensing of clouds, aerosols and ocean surfaces from satellites by the polarization of scattered sunlight.',
    'Ellipsometry and Mueller-matrix imaging of thin films, biological tissue and cancer margins.',
    'Specifying fibre and laser components by their degree of polarization and polarization extinction ratio.',
    'Astronomy: the polarization of starlight, dust and the cosmic microwave background gives magnetic fields and early-universe physics.'
  ],
  history: 'George Gabriel Stokes introduced the four parameters in 1852, in a paper on "the composition and resolution of streams of polarized light from different sources", largely overlooked until the 1940s, when the parameters became the standard tool of polarimetry. Henri Poincaré described the sphere in 1892. Hans Mueller, at MIT, formulated the 4 × 4 matrices in the early 1940s, at the same time as R. Clark Jones his 2 × 2 ones.',
  sources: [
    'G. G. Stokes, "On the composition and resolution of streams of polarized light from different sources", *Trans. Cambridge Phil. Soc.* 9 (1852).',
    'D. H. Goldstein, *Polarized Light* (CRC Press) — Stokes parameters, Mueller matrices and the Poincaré sphere in full.',
    'R. A. Chipman, "Polarimetry", in the *Handbook of Optics* — the standard reference for Mueller matrices and polarimeters.'
  ],
  sim: 'po-poincare'
},

/* ================================================================ optical activity and Faraday rotation */
{
  id: 'optical-activity-and-faraday-rotation', parent: 'polarization', title: 'Optical activity and Faraday rotation', level: 2,
  short: 'Some media turn the plane of linearly polarized light as it passes: sugar solutions and quartz because their structure is handed, a glass or crystal in a magnetic field because the field forces the electrons round. The two look alike but differ in a crucial way: optical activity undoes itself on the way back, Faraday rotation adds.',
  keywords: ['optical activity', 'optical rotation', 'specific rotation', 'polarimeter', 'saccharimeter', 'dextrorotatory', 'laevorotatory', 'chiral', 'enantiomer', 'Faraday rotation', 'Faraday effect', 'Verdet constant', 'magneto-optic', 'non-reciprocal', 'optical isolator', 'Faraday rotator', 'circular birefringence', 'invert sugar', 'Biot'],
  prereq: ['polarization-states', 'birefringence', 'polarizers-and-malus-law'],
  related: ['optical-isolators-and-modulators', 'wave-plates', 'jones-calculus', 'refractometers', 'physics:polarization'],
  body: `
Send linearly polarized light through a tube of sugar solution, and look through an analyzer: the light does not vanish where the crossed analyzer would have blocked it. The plane of polarization has been turned. The same happens in a plate of quartz, and in a block of glass inside a strong magnet. The turning has two different causes.

### Optical activity: a handed medium
A **chiral** structure — a molecule or a crystal that differs from its mirror image, like a left and right hand — treats right- and left-circular light differently: their refractive indices differ slightly, $n_R \\ne n_L$. A beam of linear light is the sum of the two circular ones; after a thickness $d$ one has run ahead of the other and the sum is linear again, but turned through

$$\\alpha = \\frac{\\pi\\,(n_L - n_R)\\,d}{\\lambda}$$

Sugars, amino acids and most molecules of life exist in one hand only, and turn the plane to the right (**dextrorotatory**, +, clockwise as seen looking towards the source) or the left (**laevorotatory**, −). For a solution, Biot\'s law gives the rotation from the **specific rotation** $[\\alpha]$,

$$\\alpha = [\\alpha]\\;l\\;c$$

with the tube length $l$ in decimetres and the concentration $c$ in g/mL. At 20 °C and the sodium D line (589 nm):

| Substance | Specific rotation [α] (° mL g⁻¹ dm⁻¹) |
|---|---|
| Sucrose (table sugar) | +66.5 |
| Glucose (dextrose) | +52.7 |
| Fructose (levulose) | about −92 |
| Invert sugar (sucrose split into glucose and fructose) | about −20 |

Splitting sucrose turns a right-handed solution into a left-handed one — hence "invert" sugar. For solids: quartz, in its right- and left-handed crystal forms, rotates by 21.7° per millimetre at 589 nm. The rotation grows fast towards the blue — roughly as $1/\\lambda^2$: quartz turns 25.5° per mm at 546 nm and 41.5° per mm at 436 nm. White light through quartz between crossed polarizers shows a succession of colours for that reason.

A **polarimeter** (polarizer, sample tube, analyzer) measures $\\alpha$ by turning the analyzer to darkness; half-shadow plates and photodetectors sharpen the reading to 0.01° or better. It measures sugar content in the food industry (the "normal" 26 g of sucrose in 100 mL in a 200 mm tube turns the plane by about 34.6°), the purity and handedness of drugs, and the concentration of any chiral substance.

### Faraday rotation: a magnetic field
Place a transparent medium in a magnetic field $B$ along the beam and the plane turns by

$$\\beta = V\\,B\\,L$$

with the **Verdet constant** $V$ (rad per tesla per metre) and the path length $L$. The field makes the electrons circulate, so the two circular polarizations again see different indices. $V$ is about 3.8 rad/(T·m) for water at 589 nm, 3 – 4 for fused silica at 633 nm, and about 40 for terbium gallium garnet (TGG) at 1064 nm (and about 134 at 633 nm). It also falls with the wavelength, roughly as $1/\\lambda^2$.

### Reciprocal against non-reciprocal
This is the difference that matters. Optical activity is tied to the *direction of travel*: the sense of the rotation, seen along the beam, is fixed by the handedness of the medium. Send the light back through the same sugar with a mirror and it unwinds: after the round trip the polarization is exactly as it began. The Faraday rotation is tied to the *direction of the field*: it turns the same way in space whichever way the light goes, so on the return trip it turns *further*. After the round trip the plane has turned by $2\\beta$.

That is the basis of the **Faraday isolator**: a polarizer, a Faraday rotator set to 45° (for TGG at 1064 nm and 1 T, $L = (\\pi/4)/(V B)$ = 20 mm), and a second polarizer at 45°. Light goes through; reflected light comes back turned a further 45°, 90° in all, crossed to the first polarizer, and is stopped (typically by 30 – 40 dB for one stage). It protects lasers from their own reflections.

> [!key] Optical activity ($\\alpha = [\\alpha] l c$) comes from handed structure and is reciprocal: it cancels on a round trip. Faraday rotation ($\\beta = VBL$) comes from a magnetic field and is not: it doubles — which is what makes optical isolators work.
`,
  ideas: [
    'Chiral media (sugar solutions, quartz) turn the plane of linear light because left and right circular light travel at slightly different speeds.',
    'Biot\'s law: α = [α] l c; sucrose has +66.5° mL g⁻¹ dm⁻¹ at 589 nm; the rotation rises rapidly towards blue.',
    'A polarimeter turns an analyzer to darkness to read the rotation; it measures sugar and the handedness of drugs.',
    'Faraday rotation is β = V B L, set by a magnetic field along the beam and the Verdet constant.',
    'Optical activity cancels on a round trip; Faraday rotation doubles. That non-reciprocity makes isolators.'
  ],
  pitfalls: [
    'Optical activity is the same as birefringence — Both involve two indices, but optical activity is *circular* birefringence (the two circular polarizations differ) and turns the plane of linear light without changing its shape; ordinary birefringence is linear birefringence and makes ellipses.',
    'A mirror turns a Faraday rotation back, like optical activity — Optical activity unwinds on the return. A Faraday rotation does not: it adds, so the polarization is turned by 2β after the round trip. A stack of rotators in a magnet cannot be undone by reflection.',
    'Dextrorotatory means the molecule is "D" — The signs (+) and (−) of the rotation are measured, and the labels D and L of the molecule\'s structure are conventions that do not predict them: D-fructose is laevorotatory.',
    'The rotation of a sugar solution is the same for every colour — It increases roughly as 1/λ², so blue is turned much more than red; polarimeters use a defined line, usually sodium D (589 nm).'
  ],
  terms: [
    { term: 'Optical activity', also: ['optical rotation', 'circular birefringence'], def: 'The turning of the plane of linearly polarized light as it passes through a handed (chiral) medium, because right and left circular light have different refractive indices.' },
    { term: 'Specific rotation', also: ['[α]'], def: 'The rotation of the plane of polarization per unit path length and per unit concentration: [α] = α/(l c), with l in decimetres and c in g/mL, at a stated wavelength and temperature.' },
    { term: 'Dextrorotatory', also: ['laevorotatory', 'levorotatory', '(+) and (−)'], def: 'A substance that turns the plane to the right (clockwise as seen looking towards the source) is dextrorotatory, marked (+); one that turns it to the left is laevorotatory, marked (−).' },
    { term: 'Polarimeter', also: ['saccharimeter'], def: 'An instrument with a polarizer, a sample cell and an analyzer that measures the rotation of the plane of polarization; with a sugar scale it is a saccharimeter.' },
    { term: 'Faraday rotation', also: ['Faraday effect', 'magneto-optic rotation'], def: 'The turning of the plane of polarization of light travelling along a magnetic field in a transparent medium, by an angle β = V B L.' },
    { term: 'Verdet constant', also: ['V'], def: 'The rotation per unit field and unit length of a Faraday medium, in rad/(T·m). It depends on the wavelength and the material (water about 3.8, TGG about 40 at 1064 nm).' },
    { term: 'Non-reciprocal', also: ['non-reciprocity'], def: 'Behaviour that is not undone when the light goes back the way it came. A Faraday rotation is non-reciprocal; ordinary optical activity is reciprocal.' }
  ],
  formulas: [
    {
      name: 'Rotation by a solution (Biot\'s law)',
      expr: 'alpha = a*l*c', tex: '\\alpha = \\alpha_{\\lambda}\\,l\\,c',
      vars: {
        alpha: { name: 'observed rotation (+ clockwise, looking at the source)', q: false, unit: '°', signed: true, tex: '\\alpha' },
        a: { name: 'specific rotation (° mL g⁻¹ dm⁻¹)', q: false, unit: '° mL/(g dm)', value: 66.5, signed: true, tex: '\\alpha_{\\lambda}' },
        l: { name: 'tube length', q: false, unit: 'dm', value: 2 },
        c: { name: 'concentration', q: false, unit: 'g/mL', value: 0.26 }
      },
      solveFor: 'alpha',
      note: 'Sucrose at 589 nm, 20 °C. The reading of a saccharimeter, 100 on its scale, is 26 g of sucrose in 100 mL in 200 mm: about 34.6°.',
      stories: { alpha: 'A {l} tube holds sucrose at {c}. By how much does it turn the plane of polarization?', c: 'A {l} tube of sucrose solution turns the plane by {alpha}. What is the concentration in g/mL?' }
    },
    {
      name: 'Rotation by a quartz plate',
      expr: 'alpha = rho*d', tex: '\\alpha = \\rho\\,d',
      vars: {
        alpha: { name: 'rotation', q: false, unit: '°', signed: true, tex: '\\alpha' },
        rho: { name: 'rotatory power of quartz (° per mm)', q: false, unit: '°/mm', value: 21.7, tex: '\\rho' },
        d: { name: 'thickness (along the axis)', q: false, unit: 'mm', value: 1 }
      },
      solveFor: 'alpha',
      note: 'Light along the optic axis. 21.7°/mm at 589 nm, 25.5 at 546 nm, 41.5 at 436 nm.'
    },
    {
      name: 'Faraday rotation',
      expr: 'beta = V*B*L', tex: '\\beta = V\\,B\\,L',
      vars: {
        beta: { name: 'rotation', q: 'angle', unit: '°', tex: '\\beta' },
        V: { name: 'Verdet constant (rad per T per m)', unit: 'rad/(T·m)', value: 40 },
        B: { name: 'magnetic field along the beam', q: 'bfield', unit: 'T', value: 1 },
        L: { name: 'length in the field', q: 'length', unit: 'mm', value: 10 }
      },
      solveFor: 'beta',
      note: 'TGG at 1064 nm: V ≈ 40 rad/(T·m). The sign of the rotation follows the direction of the field, not of the light.',
      stories: { beta: 'A TGG rod {L} long sits in a field of {B} along the beam, with V = {V}. By what angle is the polarization turned?', L: 'How long must a rod be to turn the polarization by {beta} in {B} with V = {V}?' }
    }
  ],
  examples: [
    {
      title: 'Sugar in a drink',
      q: 'A polarimeter with a 2 dm tube measures a rotation of +17.3° for a clear sucrose solution at 589 nm. What is the concentration?',
      steps: [
        { text: 'Biot\'s law solved for $c$:', tex: 'c = \\frac{\\alpha}{[\\alpha]\\,l} = \\frac{17.3}{66.5 \\times 2} = 0.130\\ \\mathrm{g/mL}' }
      ],
      a: '0.130 g/mL, that is 13 g of sucrose per 100 mL (about 12 % by mass), a sweet fizzy drink.'
    },
    {
      title: 'The length of an isolator\'s rotator',
      q: 'A Faraday isolator for 1064 nm uses a TGG rod in an average field of 1.0 T ($V = 40$ rad/(T·m)). How long must the rod be to turn the polarization by 45°?',
      steps: [
        { text: '45° is $\\pi/4$ rad:', tex: 'L = \\frac{\\beta}{V B} = \\frac{0.785}{40 \\times 1.0}\\ \\mathrm{m} = 19.6\\ \\mathrm{mm}' },
        'The reflected light is turned by another 45° on the way back, 90° in all, which a polarizer crossed to the first one stops.'
      ],
      a: 'About 20 mm of TGG. A stronger magnet shortens the rod in proportion.'
    }
  ],
  quiz: [
    { q: 'Linearly polarized light passes through a tube of sugar solution, is reflected by a mirror and passes back through the tube. Compared with its original polarization, the returning light is…', choices: ['turned by twice the one-way rotation', 'the same as at the start', 'turned by 90°', 'unpolarized'], a: 1, why: 'Optical activity is reciprocal: the rotation, seen in the direction of travel, is undone on the return. After a round trip the polarization is back where it began.' },
    { q: 'The same experiment with a Faraday rotator in a magnetic field turns the light by twice β.', a: true, why: 'The Faraday rotation has a fixed sense relative to the magnetic field, whichever way the light travels, so the second pass adds to the first. This non-reciprocity is what an optical isolator uses.' },
    { q: 'What rotation does a 2 dm tube of sucrose solution at 0.13 g/mL give? ($[\\alpha] = +66.5$) (degrees)', answer: 17.3, unit: '°', why: '$\\alpha = [\\alpha]\\,l\\,c = 66.5 \\times 2 \\times 0.13 = 17.3°$.' },
    { q: 'Quartz rotates blue light (436 nm) more than yellow light (589 nm).', a: true, why: 'The rotation per millimetre rises roughly as $1/\\lambda^2$: 41.5° against 21.7°. White light through quartz between crossed polarizers is therefore coloured.' },
    { q: 'Why is invert sugar called "invert"?', choices: ['Its molecules are upside down', 'Splitting sucrose changes a right-turning solution into a left-turning one', 'It melts at a lower temperature', 'It rotates light on the way back only'], a: 1, why: 'Sucrose turns the plane +66.5°; the glucose and fructose it splits into turn it +52.7° and −92°, giving a net left-turning mixture — the sign of the rotation is inverted.' }
  ],
  applications: [
    'Saccharimetry: sugar content of juices, syrups and sugar beet, and the purity of sucrose by the 26 g scale.',
    'Pharmaceutical and chemical analysis: the optical rotation identifies the handedness of a chiral drug and its purity.',
    'Faraday isolators on laser systems, and circulators in fibre optics.',
    'Fibre-optic current sensors: the magnetic field of a conductor turns the polarization in a coil of fibre.',
    'Radio astronomy: Faraday rotation of the polarization of distant sources measures magnetic fields in space.'
  ],
  history: 'François Arago found in 1811 that quartz turns the plane of polarized light; Jean-Baptiste Biot studied it in quartz crystals in 1812 – 1815, showed that liquids such as turpentine and sugar solutions do it too, and found that it belongs to the molecules. Louis Pasteur separated left- and right-handed crystals of tartrate by hand in 1848, the first resolution of mirror-image molecules. Michael Faraday discovered the rotation of the plane of polarization by a magnetic field in September 1845, the first evidence that light and magnetism are related.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — optical activity and Faraday rotation.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 6 (Polarization and Crystal Optics) — optical activity and magneto-optics.',
    'R. Paschotta, *Encyclopedia of Laser Physics and Technology* (RP Photonics), entries on Faraday isolators and Faraday rotators — Verdet constants and isolator design.'
  ],
  sim: 'po-rotation'
},

/* ================================================================ liquid crystals and displays */
{
  id: 'liquid-crystals-and-displays', parent: 'polarization', title: 'Liquid crystals and displays', level: 2,
  short: 'A liquid crystal is a fluid whose rod-shaped molecules keep a common direction, so it is birefringent — and a few volts across a thin layer tilts the molecules and switches the birefringence off. Between two polarizers a cell of twisted liquid crystal passes light with no voltage and blocks it with a voltage: one pixel of a screen.',
  keywords: ['liquid crystal', 'LCD', 'twisted nematic', 'TN cell', 'Gooch-Tarry', 'nematic', 'director', 'IPS', 'VA', 'in-plane switching', 'vertical alignment', 'Fréedericksz transition', 'alignment layer', 'rubbing', 'backlight', 'polarizer', 'liquid crystal on silicon', 'LCoS', 'birefringence switch'],
  prereq: ['birefringence', 'polarizers-and-malus-law', 'wave-plates'],
  related: ['flat-panel-displays', 'spatial-light-modulators', 'jones-calculus', 'optical-activity-and-faraday-rotation', 'polarization-in-practice', 'ergonomics:displays-design', 'physics:polarization'],
  body: `
Between a solid, whose molecules sit in a lattice, and a liquid, whose molecules tumble at random, there is a state in which the molecules flow freely but point the same way on average. Rod-shaped organic molecules 2 – 3 nm long form such a **liquid crystal**. In the **nematic** phase used in displays the average direction, the **director**, is the optic axis of a [[birefringence|birefringent]] fluid with $\\Delta n$ of 0.08 – 0.15, and — the point of it all — an electric field can turn the director, because the molecules are more polarizable along their length.

### The cell
A liquid-crystal cell is two glass plates 3 – 5 µm apart, kept so by spacers, with a transparent electrode (indium tin oxide) on each inner face and over it a thin polymer layer that has been **rubbed** with cloth in one direction; the molecules touching it lie along the rubbing. The gap is filled with the fluid. A polarizer is glued to the outside of each plate. Electrically the cell is a capacitor: it draws a field, not a current.

### The twisted-nematic cell
Rub the two plates at 90° to each other and the molecules between them twist, like the steps of a spiral staircase, through a quarter turn. Light polarized along the first rubbing direction meets a medium whose axis turns slowly with depth. If the layer is thick enough, the polarization **follows** the axis and arrives turned by 90° (the "waveguiding" or Mauguin regime). With the second polarizer crossed to the first, this light passes: the cell is **bright**.

Apply a voltage. Below a **threshold** of about 1 – 2 V nothing changes; above it, the molecules in the middle of the layer tilt upright, along the beam, where their birefringence no longer matters for light travelling along them. The twist is lost, the polarization is no longer turned, and the second polarizer stops it: **dark**. The tilt, and with it the brightness, follows the voltage smoothly: grey levels. The threshold (the Fréedericksz transition) is $V_{th} = \\pi\\sqrt{K/(\\varepsilon_0\\Delta\\varepsilon)}$, about 1 V for an elastic constant $K = 10$ pN and a dielectric anisotropy $\\Delta\\varepsilon = 10$.

The Jones calculus fixes the best thickness: the cell passes all of the light at 0 V when $\\Delta n\\,d = (\\sqrt3/2)\\lambda$, the first **Gooch–Tarry minimum**. For $\\Delta n = 0.10$ and green light, $d = 4.8$ µm. The condition is exact for one wavelength only, so the states are slightly coloured in white light and a little light always leaks in the dark state (a contrast of a few hundred to one in a plain TN panel).

### The family
| Type | The idea | Strength | Weakness |
|---|---|---|---|
| TN (twisted nematic) | 90° twist, voltage tilts the molecules | fast, cheap | narrow viewing angle, colour shifts and grey inversion off axis |
| STN | 180° – 270° twist | passive-matrix drive, simple | slow, low contrast |
| IPS / FFS | field *along* the plate turns molecules *in the plane* of the screen | wide, steady colour from any angle | slightly lower transmission |
| VA (vertical alignment) | molecules upright at rest (dark), tilt when driven | the deepest blacks | needs several domains for wide angles |

### From a cell to a screen
An LCD panel is a mat of millions of such cells, each with a thin-film transistor that sets and holds its voltage and a red, green or blue colour filter, three to a pixel. Behind sits a backlight (white LEDs, a light guide, a diffuser) and films, one of them a reflective polarizer that sends light of the wrong polarization back for another try, since the first polarizer would otherwise absorb half of the backlight. The voltage is alternated, because a steady field would drive the ions in the fluid to the plates. Everything that leaves the screen is **linearly polarized**: that is why a screen can go dark behind polarizing sunglasses ([[polarization-in-practice]]).

The same material makes variable retarders, tunable filters, shutters, and the liquid-crystal-on-silicon chips of projectors and [[spatial-light-modulators]], where a voltage per pixel sets the phase or polarization of the reflected light.

> [!key] A liquid crystal is a switchable birefringent fluid. In a twisted-nematic cell it guides the polarization round a 90° twist so crossed polarizers pass the light; a voltage untwists it and blocks the light. A screen is millions of such cells, with a backlight, colour filters and transistors.
`,
  ideas: [
    'Liquid-crystal molecules are rods that flow like a liquid but share a direction (the director); the fluid is birefringent, Δn ≈ 0.1.',
    'A field tilts the molecules, switching the birefringence and the twist off, so a voltage of a few volts changes the light.',
    'In a twisted-nematic cell between crossed polarizers the 90° twist turns the polarization: bright at 0 V, dark at about 5 V.',
    'The gap is chosen so that Δn·d = 0.87 λ (the first Gooch–Tarry minimum), about 5 µm.',
    'IPS and VA cells fix the viewing-angle and black-level weaknesses of TN; every LCD emits polarized light.'
  ],
  pitfalls: [
    'The liquid crystal itself emits or filters the light — It does neither. It only changes the polarization of the light from the backlight; the two polarizers turn that change into a change of brightness.',
    'The voltage makes the molecules rotate in the plane of the screen — In a TN cell the field tilts them out of the plane, upright along the beam. Only in IPS cells do they rotate in the plane.',
    'The black of an LCD is the absence of light — Backlight always leaks: no cell guides the light perfectly at every wavelength and angle. That is why an LCD looks grey in a dark room, and why VA panels (the best blacks) are preferred for film.',
    'A liquid crystal is a liquid that crystallizes under a field — It is a phase of its own, between liquid and crystal, formed by temperature (and concentration). The field does not make it; it only turns the director.'
  ],
  terms: [
    { term: 'Liquid crystal', also: ['LC'], def: 'A fluid phase whose rod-shaped molecules flow freely but keep a common average direction, giving it the birefringence of a crystal.' },
    { term: 'Nematic', also: ['director'], def: 'The liquid-crystal phase used in displays, in which the molecules are aligned along a common direction, the director, but not arranged in layers.' },
    { term: 'Twisted nematic cell', also: ['TN cell', 'TN display'], def: 'A liquid-crystal cell whose director twists by 90° between the plates; light follows the twist and its polarization turns by 90°, until a voltage untwists the layer.' },
    { term: 'Alignment layer', also: ['rubbed polyimide'], def: 'A polymer layer on the inside of each plate, rubbed in one direction, that makes the liquid-crystal molecules next to it lie along that direction.' },
    { term: 'Fréedericksz threshold', also: ['threshold voltage'], def: 'The voltage, about 1 – 2 V for a TN cell, below which the field cannot overcome the elastic forces that hold the molecules in place and nothing happens.' },
    { term: 'Gooch–Tarry minimum', def: 'The choice of cell gap d for which a twisted-nematic cell passes the light fully: Δn·d = (√3/2) λ for the first minimum. It fixes the thickness at about 5 µm.' },
    { term: 'In-plane switching', also: ['IPS', 'FFS'], def: 'An LCD design in which the field acts along the plates and turns the molecules in the plane of the screen, giving wide viewing angles.' }
  ],
  formulas: [
    {
      name: 'First Gooch–Tarry optimum of a 90° TN cell',
      expr: 'd = sqrt(3)/2*lambda/Dn', tex: 'd = \\frac{\\sqrt3}{2}\\,\\frac{\\lambda}{\\Delta n}',
      vars: {
        d: { name: 'cell gap', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        Dn: { name: 'birefringence of the liquid crystal', value: 0.1, tex: '\\Delta n' }
      },
      solveFor: 'd',
      note: 'The gap for which a 90° twisted-nematic cell between crossed polarizers passes all the light at 0 V.',
      stories: { d: 'A liquid crystal has Δn = {Dn}. What cell gap is best for {lambda} light?' }
    },
    {
      name: 'Threshold voltage (Fréedericksz)',
      expr: 'Vth = pi*sqrt(K*10^(-12)/(eps0*Deps))', tex: 'V_{th} = \\pi\\sqrt{\\frac{K}{\\varepsilon_0\\,\\Delta\\varepsilon}}',
      vars: {
        Vth: { name: 'threshold voltage', q: 'voltage', unit: 'V', tex: 'V_{th}' },
        K: { name: 'elastic constant (pN)', q: false, unit: 'pN', value: 10 },
        eps0: { const: 'eps0', tex: '\\varepsilon_0' },
        Deps: { name: 'dielectric anisotropy Δε', value: 10, tex: '\\Delta\\varepsilon' }
      },
      solveFor: 'Vth',
      note: 'For splay deformation in a thin layer; the threshold does not depend on the thickness. Typical TN values: 1 – 2 V.',
      stories: { Vth: 'A nematic has K = {K} and Δε = {Deps}. At what voltage does a cell begin to switch?' }
    }
  ],
  examples: [
    {
      title: 'The gap for a modern liquid crystal',
      q: 'A liquid-crystal mixture has $\\Delta n = 0.12$. What gap should a TN cell for green light (550 nm) have?',
      steps: [
        { text: 'The first Gooch–Tarry optimum:', tex: 'd = \\frac{\\sqrt3}{2}\\frac{\\lambda}{\\Delta n} = 0.866 \\times \\frac{0.55\\ \\mu\\mathrm{m}}{0.12} = 3.97\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 4.0 µm. A higher-birefringence mixture allows a thinner, and therefore faster, cell: switching time grows roughly as $d^2$.'
    },
    {
      title: 'Switching on',
      q: 'A mixture has a splay elastic constant $K = 12$ pN and a dielectric anisotropy $\\Delta\\varepsilon = 8$. At what voltage does a cell start to switch?',
      steps: [
        { text: 'Evaluate $V_{th} = \\pi\\sqrt{K/(\\varepsilon_0\\,\\Delta\\varepsilon)}$:', tex: 'V_{th} = \\pi\\sqrt{\\frac{12\\times10^{-12}}{8.854\\times10^{-12}\\times 8}} = \\pi \\times 0.412 = 1.29\\ \\mathrm{V}' }
      ],
      a: 'About 1.3 V. The threshold depends on the material, not on the thickness of the cell.'
    }
  ],
  quiz: [
    { q: 'In a normally white TN cell between crossed polarizers, why is the pixel bright with no voltage?', choices: ['The liquid crystal emits light', 'The 90° twist turns the polarization so that it passes the second polarizer', 'The polarizers are not crossed at 0 V', 'The molecules block the backlight until a voltage clears them'], a: 1, why: 'The polarization follows the twist of the director and leaves turned by 90°, which is exactly the axis of the crossed second polarizer.' },
    { q: 'In a TN cell, the voltage makes the molecules rotate within the plane of the screen.', a: false, why: 'It tilts them upright, along the beam. In-plane rotation is the idea of IPS cells.' },
    { q: 'Why does an LCD often look black through polarizing sunglasses at one angle of the glasses?', choices: ['The glasses block blue', 'The screen\'s light is linearly polarized and the lenses are crossed to it', 'The screen flickers', 'The backlight is infrared'], a: 1, why: 'The last polarizer of the panel leaves the light linearly polarized; a polarizer crossed to it passes none (Malus\'s law).' },
    { q: 'What is the first Gooch–Tarry gap for $\\Delta n = 0.10$ at 550 nm? (micrometres)', answer: 4.76, unit: 'µm', why: '$d = (\\sqrt3/2)\\lambda/\\Delta n = 0.866 \\times 0.55/0.10 = 4.76\\ \\mu\\mathrm{m}$.' },
    { q: 'What do IPS panels offer over TN panels?', choices: ['A faster response in every case', 'Steady colour and contrast from wide viewing angles', 'No need for polarizers', 'Lower cost'], a: 1, why: 'In IPS cells the molecules rotate in the plane of the screen, so the light meets the same birefringence from every direction.' }
  ],
  applications: [
    'Every LCD screen: televisions, monitors, phones, instrument panels, watches.',
    'Liquid-crystal shutters: automatic welding helmets, switchable privacy glass and glasses for active 3-D.',
    'Liquid-crystal-on-silicon projectors and spatial light modulators that shape laser beams.',
    'Tunable optical filters and polarization controllers made of variable liquid-crystal retarders.',
    'Thermometers and sensors that use the colour or twist of cholesteric liquid crystals.'
  ],
  history: 'Friedrich Reinitzer in Prague noticed in 1888 that cholesteryl benzoate has two melting points, and sent his sample to the German physicist Otto Lehmann, who recognized a new state of matter and called it liquid crystalline. For eighty years it was a curiosity. The twisted-nematic cell was invented by Martin Schadt and Wolfgang Helfrich at Hoffmann–La Roche in Basel in 1970 – 1971 (James Fergason in the United States independently), and George Gray in Hull made in 1973 the cyanobiphenyls, the first stable room-temperature liquid crystals. Digital watches and calculators followed in the 1970s; the active-matrix colour screens of laptops in the late 1980s.',
  sources: [
    'P. J. Collings and M. Hird, *Introduction to Liquid Crystals: Chemistry and Physics* (Taylor & Francis) — phases, the cell, the Fréedericksz transition.',
    'D. K. Yang and S.-T. Wu, *Fundamentals of Liquid Crystal Devices* (Wiley) — twisted-nematic, IPS and VA cells and their optics by Jones calculus.',
    'E. Hecht, *Optics*, ch. 8 (Polarization) — liquid crystals and their use as modulators.'
  ],
  sim: 'po-twisted-nematic'
},

/* ================================================================ polarization in practice */
{
  id: 'polarization-in-practice', parent: 'polarization', title: 'Polarization at work', level: 1,
  short: 'Polarizers earn their living in sunglasses and camera filters that cut glare and darken the sky, in screens that are polarized to begin with, in 3-D cinema where the two eyes get opposite polarizations, in the polarizing microscope, and wherever stress has to be seen. The same few ideas — Malus\'s law, Brewster\'s angle, quarter-wave plates — explain each of them.',
  keywords: ['polarized sunglasses', 'polarizing filter', 'circular polarizer', 'CPL', 'camera filter', 'glare', '3-D cinema', 'passive 3D', 'crosstalk', 'ghosting', 'LCD sunglasses', 'polarizing microscope', 'thin section', 'stress viewer', 'reflection removal', 'autofocus', 'windscreen', 'quench marks'],
  prereq: ['polarizers-and-malus-law', 'polarization-by-reflection-and-scattering', 'wave-plates'],
  related: ['photochromic-tinted-and-polarized-lenses', 'polarizing-beam-splitters', 'liquid-crystals-and-displays', 'photoelasticity-and-stress', 'stereoscopic-3d-displays', 'microscope-illumination-and-contrast', 'machine-vision-lighting', 'glare-and-uniformity'],
  body: `
### Sunglasses and glare
The glare off a lake, a wet road or a car bonnet is mostly light reflected at a large angle, and so mostly polarized parallel to the surface — horizontally, for horizontal surfaces ([[polarization-by-reflection-and-scattering]]). **Polarized sunglasses** have a vertical transmission axis, so they stop that glare and pass the unpolarized light from the lake bottom, the road marking or the fish. At Brewster's angle (53° on water) the glare is removed almost entirely; at a very oblique angle there is too much of it, and the glasses reduce it only a little. An ideal polarizer halves unpolarized light, as a grey tint of density 0.3 would, but it chooses what to remove.

### Camera filters
A **polarizing filter** on a lens does the same for a photograph: it cuts reflections on water, glass and wet leaves (foliage looks richer in colour), and darkens the blue sky most at 90° from the Sun. Turn the ring and watch the viewfinder. The cost is 1 – 2 stops of light.

Photographic filters come as *linear* or *circular*. A **circular polarizer** (CPL) is a linear polarizer facing the scene with a quarter-wave plate behind it, axes at 45°: it acts on the scene like a linear polarizer, but the light that leaves it is circularly polarized. The reason is in the camera. The autofocus sensors and meters of many cameras look at the light after a semi-transparent mirror or beam splitter that reflects the two polarizations unequally, so linearly polarized light can confuse them. Circularly polarized light has no preferred axis, and the camera behaves as it would with unpolarized light. Fitted the wrong way round, the filter no longer darkens the sky.

### Screens
Every liquid-crystal screen emits linearly polarized light ([[liquid-crystals-and-displays]]); the direction differs from model to model (vertical, horizontal or 45°, and it may change when a phone is turned). Through polarized sunglasses the screen brightness follows $\\cos^2$ of the angle between its axis and that of the lenses, and it goes black when they are crossed. Many OLED screens carry a polarizer and a quarter-wave plate to cut reflections of room light: their light is nearly circular and does not black out.

### 3-D cinema
In **passive 3-D** the projector puts opposite polarizations on the pictures for the two eyes, and the glasses have a different analyzer in each lens. With *linear* systems the pictures are polarized at 45° and 135°, and the lenses are polarizers at the same angles; tilt your head by $\\tau$ and the other eye's picture leaks in with a fraction $\\sin^2\\tau$ — 12 % at 20°. With *circular* systems the pictures are right and left circular and each lens is a quarter-wave plate and a polarizer; circular states do not depend on the rotation of the head, so there is no ghosting from tilt. The screen must be metal-coated: a white one scrambles the polarization.

### Seeing stress, seeing crystals
Put a plastic ruler or a transparent plastic box between two crossed polarizers and it lights up in colours where it is stressed ([[photoelasticity-and-stress]]). The same trick shows the quench marks of tempered glass (the dark patches of a car's rear window through polarized sunglasses) and the stresses in lenses, bottles and mouldings. In the **polarizing microscope** the specimen is between crossed polarizers: isotropic things stay black, birefringent minerals, crystals, starch and fibres glow in interference colours. A standard rock thin section is 30 µm thick, so quartz ($\\Delta n = 0.009$) has a retardation of 270 nm, first-order grey-white, a fact geologists use to identify minerals ([[microscope-illumination-and-contrast]]).

### Other places
Machine vision crosses a polarizer on the light with one on the camera to remove glare from shiny parts ([[machine-vision-lighting]]); [[polarizing-beam-splitters]] split and combine beams in projectors and lasers; welding helmets use a liquid-crystal shutter between polarizers that darkens in a fraction of a millisecond.

> [!key] Polarizers keep or remove light according to its polarization: glare is polarized so a vertical axis removes it; screens are polarized so crossed lenses black them out; a quarter-wave plate makes a filter safe for autofocus and 3-D glasses immune to head tilt; between crossed polarizers stress and crystals shine.
`,
  ideas: [
    'Glare from horizontal surfaces is horizontally polarized: sunglasses and camera filters pass the vertical polarization.',
    'A polarizing filter darkens the sky most 90° from the Sun, and costs 1 – 2 stops.',
    'Circular polarizing filters are linear polarizers followed by a quarter-wave plate, so that autofocus and metering see light with no preferred direction.',
    'LCD screens emit linearly polarized light, so they can go black behind polarized lenses; linear 3-D glasses ghost as sin² of head tilt, circular ones do not.',
    'Between crossed polarizers, stressed transparent material and birefringent crystals show colours.'
  ],
  pitfalls: [
    'Polarized sunglasses simply tint the light darker — A tint dims everything equally; a polarizer dims light according to polarization, so it removes polarized glare while a clear view of things lit by unpolarized light remains.',
    'The circular polarizer does something different from a linear one on the scene — To the scene the two do the same. The quarter-wave plate behind the polarizer only turns the transmitted light circular, to keep the camera\'s autofocus and meter happy.',
    'Circular 3-D glasses work because they rotate the picture — They work because the circular states of the two pictures are opposite and independent of the rotation of the glasses. The quarter-wave plate in each lens turns the circular light back to linear for the polarizer behind it.',
    'A polarizing filter gives the same sky wherever you point it — The effect is strongest at 90° from the Sun, and zero towards and away from it. On wide-angle lenses part of the picture is darkened and part is not.'
  ],
  terms: [
    { term: 'Polarized sunglasses', also: ['polarized lenses'], def: 'Lenses made with a polarizing film whose transmission axis is vertical when worn, so that they stop the horizontally polarized glare of horizontal surfaces.' },
    { term: 'Circular polarizing filter', also: ['circular polarizer', 'CPL'], def: 'A camera filter made of a linear polarizer facing the scene and a quarter-wave plate behind it: it filters polarization like a linear polarizer but delivers circularly polarized light, which autofocus and metering systems tolerate.' },
    { term: 'Crosstalk', also: ['ghosting', 'leakage'], def: 'In 3-D displays, the unwanted visibility of one eye\'s picture to the other eye. For linear polarization it grows as sin² of the tilt of the head.' },
    { term: 'Passive 3-D', def: 'A 3-D system in which the two eyes\' pictures are separated by polarization (or by colour) in cheap glasses with no electronics, as distinct from active shutter glasses.' },
    { term: 'Polarizing microscope', also: ['petrographic microscope'], def: 'A microscope with a polarizer below and an analyzer above the specimen, used crossed to show birefringent materials in interference colours.' },
    { term: 'Thin section', def: 'A slice of rock or other material ground to a standard 30 µm so that light passes through it, for examination in a polarizing microscope.' }
  ],
  formulas: [
    {
      name: 'Light lost to a filter, in stops',
      expr: 'S = log2(1/T)', tex: 'S = \\log_2\\frac{1}{T}',
      vars: {
        S: { name: 'light lost, in stops (exposure steps)' },
        T: { name: 'transmission of the filter', q: 'ratio', unit: '%', value: 35, min: 1, max: 100 }
      },
      solveFor: 'S',
      note: 'One stop is a factor 2: T = 50 % loses 1 stop, 25 % 2 stops. A circular polarizer has T of about 25 – 45 %.',
      stories: { S: 'A polarizing filter transmits {T} of the light. How many stops of exposure does it cost?' }
    },
    {
      name: 'Ghosting of linear 3-D glasses',
      expr: 'X = sin(tau)^2', tex: 'X = \\sin^2\\tau',
      vars: {
        X: { name: 'fraction of the other eye\'s picture seen', min: 0, max: 1 },
        tau: { name: 'tilt of the head', q: 'angle', unit: '°', value: 20, min: 0, max: 90, tex: '\\tau' }
      },
      solveFor: 'X',
      note: 'Ideal polarizers and a perfect screen; real systems add a few per cent. Circular systems have no tilt term.',
      stories: { X: 'A viewer in a linear-polarization 3-D cinema tilts the head by {tau}. What fraction of the other eye\'s picture leaks in?', tau: 'How far can a viewer tilt the head before ghosting reaches {X}?' }
    },
    {
      name: 'Retardation of a thin section',
      expr: 'Gam = Dn*d', tex: '\\Gamma = \\Delta n\\;d',
      vars: {
        Gam: { name: 'retardation', q: 'length', unit: 'nm', tex: '\\Gamma' },
        Dn: { name: 'birefringence', value: 0.009, tex: '\\Delta n' },
        d: { name: 'thickness of the section', q: 'length', unit: 'µm', value: 30 }
      },
      solveFor: 'Gam',
      note: 'Quartz in a standard 30 µm thin section: 270 nm, first-order grey-white between crossed polarizers; calcite (Δn 0.17) would give 5100 nm, a high-order pastel white.'
    }
  ],
  examples: [
    {
      title: 'What a filter costs',
      q: 'A circular polarizer transmits 35 % of unpolarized light. A photograph needs 1/250 s without the filter. What exposure time, other things equal?',
      steps: [
        { text: 'Stops lost:', tex: 'S = \\log_2\\frac{1}{0.35} = 1.51' },
        { text: 'The time grows by the factor $1/0.35 = 2.86$:', tex: 't = \\frac{1}{250}\\times 2.86 = \\frac{1}{87}\\ \\mathrm{s}' }
      ],
      a: 'About 1½ stops: 1/90 s, or open the aperture by 1½ stops. With a hand-held lens, raise the ISO instead.'
    },
    {
      title: 'Crosstalk in a linear 3-D cinema',
      q: 'A viewer tilts the head by 15° and, a minute later, by 30°. How much of the other eye\'s picture leaks into each eye?',
      steps: [
        { text: 'At 15°:', tex: 'X = \\sin^2 15° = 0.067' },
        { text: 'At 30°:', tex: 'X = \\sin^2 30° = 0.25' }
      ],
      a: '6.7 % at 15° (a faint ghost on high-contrast edges) and 25 % at 30° (clearly double). Circular glasses would give zero at either tilt.'
    }
  ],
  quiz: [
    { q: 'Polarized sunglasses are made with the transmission axis…', choices: ['vertical', 'horizontal', 'at 45°', 'it makes no difference'], a: 0, why: 'Glare from horizontal surfaces is mostly horizontally polarized (the s-component), so a vertical axis crosses it.' },
    { q: 'Why do camera makers recommend circular rather than linear polarizing filters for many cameras?', choices: ['Circular filters darken the sky more', 'Autofocus and metering optics are polarization-sensitive, and circular light has no preferred direction', 'Circular filters are cheaper', 'Linear filters do not work on digital sensors'], a: 1, why: 'A quarter-wave plate behind the polarizer makes the light leaving the filter circular, so the semi-transparent mirrors and sensors behind it behave as for unpolarized light.' },
    { q: 'Tilting your head wrecks the 3-D picture with circular-polarization glasses.', a: false, why: 'The circular polarization states do not depend on rotation, so ideal circular glasses are immune to tilt. It is the linear systems that ghost as sin² of the tilt.' },
    { q: 'A linear-polarization 3-D system is watched with the head tilted by 20°. What fraction of the other eye\'s picture leaks in? (Give a decimal.)', answer: 0.117, why: '$\\sin^2 20° = 0.342^2 = 0.117$: about 12 %.' },
    { q: 'In a circular polarizing filter, which element faces the scene?', choices: ['The quarter-wave plate', 'The linear polarizer', 'Either: the order does not matter', 'A neutral-density plate'], a: 1, why: 'The linear polarizer acts on the scene\'s light; the quarter-wave plate behind it converts the result to circular light. Reversed, the sky effect is lost.' }
  ],
  applications: [
    'Photography and film: filters that remove reflections from water, glass and foliage and deepen the sky.',
    'Sunglasses for driving, fishing and boating, cutting glare while keeping the view through water.',
    'Passive 3-D cinema and 3-D televisions with polarized glasses.',
    'Polarizing microscopy in geology, mineralogy, pharmacology (crystal forms) and biology (fibres, starch, amyloid).',
    'Industrial inspection: stress in bottles, lenses and moulded parts; glare removal on shiny parts in machine vision.'
  ],
  history: 'Edwin Land\'s polarizing sheet of the 1930s made all of this cheap: polarized sunglasses, a proposal for glare-free car headlamps and windscreens (which foundered because every car would have had to be converted), and the first 3-D films in polarized light, shown at the New York World\'s Fair of 1939. The 3-D "golden age" of the early 1950s used the same linear glasses; the circular systems of today, which tolerate head tilt, came in the 2000s.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — polarizers and retarders in use, circular polarizers.',
    'G. P. Können, *Polarized Light in Nature* (Cambridge University Press, 1985) — glare, sky and the polarization seen in everyday scenes.',
    'W. D. Nesse, *Introduction to Optical Mineralogy* (Oxford University Press) — interference colours and the thin section in the polarizing microscope.'
  ],
  sim: 'po-practice'
},

/* ================================================================ photoelasticity */
{
  id: 'photoelasticity-and-stress', parent: 'polarization', title: 'Photoelasticity: seeing stress', level: 3,
  short: 'Stress makes a transparent material birefringent in proportion to the difference of the two principal stresses. Between crossed polarizers a stressed plastic or glass part shows coloured bands, the isochromatic fringes, whose number at each point reads the stress there: a map of stress made by light.',
  keywords: ['photoelasticity', 'photoelastic', 'stress birefringence', 'stress-optic coefficient', 'Brewster unit', 'isochromatic fringes', 'isoclinic lines', 'polariscope', 'fringe order', 'tempered glass', 'residual stress', 'stress concentration', 'tint of passage', 'strain viewer', 'stress analysis'],
  prereq: ['birefringence', 'polarizers-and-malus-law', 'wave-plates'],
  related: ['glass-quality-and-defects', 'optical-plastics', 'optical-glass', 'polarization-in-practice', 'liquid-crystals-and-displays', 'physics:polarization'],
  body: `
Glass and plastic are isotropic when they are free of stress. Pull or squeeze them and the bonds in the direction of the stress change: the material gets a different refractive index along the two **principal stress** directions, and becomes birefringent. The **stress-optic law** (Neumann, Maxwell) says the difference of the two indices is proportional to the difference of the principal stresses,

$$n_1 - n_2 = C\\,(\\sigma_1 - \\sigma_2)$$

where $C$ is the **stress-optic coefficient**, measured in brewsters, 1 B = $10^{-12}$ Pa⁻¹ = 1 TPa⁻¹.

| Material | $C$ (about) |
|---|---|
| Polycarbonate | 70 – 80 B |
| Photoelastic epoxy resins | 40 – 60 B |
| Acrylic (PMMA) | −4 to −5 B |
| Soda-lime and borosilicate glass | 2.5 – 3 B |
| Fused silica | 3.5 B |

### From stress to colour
A plate of thickness $t$ delays one polarization behind the other by $C\\,t\\,(\\sigma_1 - \\sigma_2)$ metres, which is, in wavelengths,

$$N = \\frac{C\\,t\\,(\\sigma_1 - \\sigma_2)}{\\lambda}$$

called the **fringe order**. Between crossed polarizers, light vanishes where $N$ is a whole number and is brightest at half-integers, so the part is covered with dark bands in monochromatic light, and in white light with coloured bands as each colour in turn is quenched: **isochromatic fringes**, bands of equal stress difference, like contour lines on a map. The colours follow the sequence of the [[wave-plates|interference colours]]: black, grey, white, yellow, orange, red, then a sharp change to violet and blue — the "tint of passage" that marks a whole fringe — and so on, fading to pastel pink and green above order 3 or 4.

The black bands that cross the pattern and move when the polarizers are turned are **isoclinics**, where the principal stress directions lie along the polarizer axes. A **circular polariscope**, with a quarter-wave plate on each side, removes them and leaves only the isochromatics.

Numbers. The stress per fringe is $\\lambda/(C\\,t)$: for a 6 mm sheet of polycarbonate it is 1.2 MPa, so a few MPa give a rainbow; for 6 mm of glass it is 34 MPa, because glass is about 28 times less sensitive. Squeeze a disc of diameter $D$ and force $F$ and the centre shows $N = 8CF/(\\pi D\\lambda)$ fringes whatever the thickness: the thicker disc gets more retardation per unit stress, but the same force is spread over more section, and the two cancel.

### Reading a part
- Closely packed fringes mean a steep stress change: corners, notches, holes and contact points show up as fringe clusters. A round hole in a plate under tension concentrates the stress threefold.
- At a **free edge** one principal stress is zero, so the fringe order there gives the edge stress directly, $\\sigma = N\\lambda/(C\\,t)$ — usually the largest stress and the one where cracks begin.
- The fringes show the size of the stress difference, not its sign. A compensator or the loading history tells tension from compression.

### Glass and tempering
Tempered glass is cooled quickly from about 600 °C so that the surface sets first. When the core cools it shrinks and pulls the surface into compression, with the core in tension — a parabolic profile with the surface compression twice the core tension. Fully tempered glass has a surface compression of about 100 MPa or more (an architectural standard asks for at least about 70 MPa), several times its untempered strength; if it breaks, the stored energy shatters it into small blunt pieces. Look at a car's rear window through polarized sunglasses, or at the edge of a glass sheet through a polarizer, and the pattern of the cooling jets or the stripes of the profile appear. The same method checks annealing in lenses and bottles, residual stress in injection mouldings and display glass, and the compressive layer of chemically strengthened glass.

> [!key] Stress makes clear materials birefringent: Δn = C Δσ. Between crossed polarizers a part shows N = C t Δσ/λ wavelengths of delay as coloured isochromatic fringes, with black isoclinics added in plane light. Count the fringes and read the stress.
`,
  ideas: [
    'Stress makes isotropic transparent materials birefringent: n₁ − n₂ = C (σ₁ − σ₂), with C in brewsters (10⁻¹² Pa⁻¹).',
    'The fringe order N = C t Δσ/λ counts wavelengths of delay; isochromatic fringes are contours of equal stress difference.',
    'Plane polariscopes also show isoclinics; circular ones show the isochromatics alone.',
    'Polycarbonate (70–80 B) is about 28 times more sensitive than glass (2.5–3 B): 1.2 MPa per fringe against 34 MPa in 6 mm.',
    'At a free edge one principal stress vanishes, so the edge fringe order reads the stress directly; tempered glass has compression at its surface and tension in its core.'
  ],
  pitfalls: [
    'Dark bands show where there is no stress — In white light the black band of order zero does, but the black bands of a plane polariscope also mark the isoclinics, where the stress directions match the polarizers, whatever the stress. Turning the polarizers tells the two apart: isoclinics move.',
    'The colours of the fringes show the temperature or the kind of material — They show the retardation, a number: the colour sequence is the same for any material, and only the stress needed for each colour changes.',
    'More fringes mean a thicker part — For the same stress, a thicker part gives more fringes (N ∝ t); but for the same load the stress falls as the thickness grows, so the fringes at a point of a loaded part can remain unchanged.',
    'A fringe pattern shows tension and compression apart — It shows only the size of the difference of the principal stresses. The sign needs extra information.'
  ],
  terms: [
    { term: 'Photoelasticity', also: ['stress birefringence', 'photoelastic effect'], def: 'The birefringence that stress produces in a transparent material, used to show and measure the stress by polarized light.' },
    { term: 'Stress-optic coefficient', also: ['C', 'brewster', 'B', 'photoelastic constant'], def: 'The constant C in n₁ − n₂ = C (σ₁ − σ₂). Measured in brewsters, 10⁻¹² Pa⁻¹: about 75 for polycarbonate, 2.7 for common glass.' },
    { term: 'Isochromatic fringes', also: ['isochromatics'], def: 'The coloured (or, in monochromatic light, dark) bands in a polariscope along which the difference of the principal stresses, and so the fringe order, is constant.' },
    { term: 'Isoclinic lines', also: ['isoclinics'], def: 'The black bands in a plane polariscope along which the principal stress directions are parallel to the polarizer axes; they move when the polarizers are turned.' },
    { term: 'Fringe order', also: ['N'], def: 'The number of wavelengths by which a stressed part delays one polarization behind the other: N = C t (σ₁ − σ₂)/λ. Whole numbers give dark fringes in monochromatic light.' },
    { term: 'Polariscope', also: ['strain viewer'], def: 'An instrument with a polarizer and an analyzer (and, in the circular type, two quarter-wave plates) for viewing a transparent part between them.' },
    { term: 'Tempered glass', also: ['toughened glass', 'safety glass'], def: 'Glass quenched from high temperature so that its surface is in compression and its core in tension; strong, and breaking into small blunt pieces.' }
  ],
  formulas: [
    {
      name: 'Fringe order',
      expr: 'N = C*10^(-12)*t*Ds/lambda', tex: 'N = \\frac{C\\,t\\,\\Delta\\sigma}{\\lambda}',
      vars: {
        N: { name: 'fringe order' },
        C: { name: 'stress-optic coefficient (brewsters)', q: false, unit: 'B', value: 75 },
        t: { name: 'thickness of the part', q: 'length', unit: 'mm', value: 6 },
        Ds: { name: 'difference of the principal stresses', q: 'stress', unit: 'MPa', value: 3, tex: '\\Delta\\sigma' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'N',
      note: 'C in brewsters (1 B = 10⁻¹² Pa⁻¹; the factor is built into the calculator). Polycarbonate, 6 mm, 3 MPa: 2.5 fringes.',
      stories: { N: 'A {t} polycarbonate sheet (C = {C} B) carries a stress difference of {Ds}. What fringe order does it show at {lambda}?', Ds: 'A polycarbonate part {t} thick shows fringe order {N} at {lambda}. What stress difference is that?' }
    },
    {
      name: 'Stress per fringe',
      expr: 'Dsf = lambda/(C*10^(-12)*t)', tex: '\\Delta\\sigma_f = \\frac{\\lambda}{C\\,t}',
      vars: {
        Dsf: { name: 'stress difference per fringe', q: 'stress', unit: 'MPa', tex: '\\Delta\\sigma_f' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        C: { name: 'stress-optic coefficient (brewsters)', q: false, unit: 'B', value: 2.7 },
        t: { name: 'thickness', q: 'length', unit: 'mm', value: 6 }
      },
      solveFor: 'Dsf',
      note: 'Glass of 6 mm: 34 MPa per fringe. A fringe of order 3 at the surface of tempered glass seen along 6 mm is 100 MPa.',
      stories: { Dsf: 'Glass with C = {C} B and a light path of {t} is viewed at {lambda}. How much stress does one fringe represent?' }
    },
    {
      name: 'Centre of a disc under diametral load',
      expr: 'N = 8*C*10^(-12)*F/(pi*D*lambda)', tex: 'N = \\frac{8\\,C\\,F}{\\pi\\,D\\,\\lambda}',
      vars: {
        N: { name: 'fringe order at the centre' },
        C: { name: 'stress-optic coefficient (brewsters)', q: false, unit: 'B', value: 75 },
        F: { name: 'force across the diameter', q: 'force', unit: 'N', value: 300 },
        D: { name: 'diameter of the disc', q: 'length', unit: 'mm', value: 30 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'N',
      note: 'From σ₁ − σ₂ = 8F/(π D t) at the centre of a disc of thickness t; the thickness cancels. Polycarbonate, 30 mm, 300 N: 3.5 fringes.',
      stories: { N: 'A {D} polycarbonate disc is squeezed across its diameter by {F}. How many fringes appear at its centre in {lambda} light?', F: 'What force across a {D} disc makes {N} fringes at the centre?' }
    }
  ],
  examples: [
    {
      title: 'Reading a plastic part',
      q: 'A polycarbonate part 6 mm thick ($C = 75$ B) shows a fringe of order 4 at a free edge, in green light (550 nm). What is the stress there?',
      steps: [
        { text: 'The stress per fringe is $\\lambda/(Ct)$:', tex: '\\frac{550\\times10^{-9}}{75\\times10^{-12}\\times 6\\times10^{-3}} = 1.22\\ \\mathrm{MPa}' },
        'At a free edge one principal stress is zero, so $\\sigma = N\\,\\lambda/(Ct) = 4 \\times 1.22$ MPa.'
      ],
      a: 'About 4.9 MPa at the edge — the stress concentration to check against the material\'s strength.'
    },
    {
      title: 'Tempered glass seen from the edge',
      q: 'You look along 10 mm of the edge of a plate of tempered glass whose surface compression is 100 MPa. What is the fringe order at the surface?',
      steps: [
        'Near the surface the stress parallel to the plate is about 100 MPa and the stress through the thickness is about zero, so $\\sigma_1 - \\sigma_2 \\approx 100$ MPa along the light path of 10 mm.',
        { text: 'With $C = 2.7$ B at 550 nm:', tex: 'N = \\frac{2.7\\times10^{-12}\\times 0.010\\times 100\\times10^{6}}{550\\times10^{-9}} = 4.9' }
      ],
      a: 'About 5 fringes at each surface, running down to black at the two planes where the stress changes sign — about 0.58 of the half-thickness from the middle.'
    }
  ],
  quiz: [
    { q: 'Why does a stressed piece of clear plastic show colours between crossed polarizers?', choices: ['Stress makes it birefringent, delaying one polarization behind the other', 'Stress makes it fluorescent', 'Stress makes it absorb some colours', 'Stress rotates its plane of polarization'], a: 0, why: 'The stress makes the refractive index differ along the two principal stress directions; the delay between the two polarizations depends on wavelength, so each colour is quenched at a different stress.' },
    { q: 'A circular polariscope shows the isochromatic fringes but not the isoclinic lines.', a: true, why: 'The quarter-wave plates make the pattern independent of the orientation of the polarizers, which removes the black isoclinic bands and leaves only the fringes.' },
    { q: 'How much stress does one fringe represent in a 6 mm sheet of polycarbonate ($C = 75$ B, 550 nm)? (MPa)', answer: 1.22, unit: 'MPa', why: '$\\lambda/(C\\,t) = 550\\times10^{-9}/(75\\times10^{-12}\\times 6\\times10^{-3}) = 1.22$ MPa.' },
    { q: 'Compared with polycarbonate of the same thickness, how much stress does one fringe represent in glass?', choices: ['About the same', 'About 28 times more', 'About 28 times less', 'Glass shows no fringes'], a: 1, why: 'Glass has $C \\approx 2.7$ B against 75 B for polycarbonate, a factor of 28 smaller, so 28 times more stress is needed for one fringe.' },
    { q: 'At the free edge of a loaded part, the fringe order gives the stress there directly.', a: true, why: 'At a free boundary one principal stress (the one across the edge) is zero, so $\\sigma_1 - \\sigma_2$ is the other principal stress, the one along the edge.' }
  ],
  applications: [
    'Photoelastic models of mechanical parts and structures, in epoxy or polycarbonate, loaded to find stress concentrations.',
    'Quality checks of glass: annealing of lenses, prisms and bottles, and the stress pattern of tempered glass.',
    'Residual stress in injection-moulded plastic parts, optical discs and display glass.',
    'Reflection photoelasticity: a birefringent coating bonded to a real part shows the strain on its surface.',
    'Stress of the cover glass of phones, and measurement of the compressive layer in strengthened glass.'
  ],
  history: 'Thomas Seebeck found in 1813 that glass cooled quickly shows colours in polarized light, and David Brewster explained and extended the effect in 1815 – 1816 to glass and gelatine under load; the unit of the stress-optic coefficient is named after him. Franz Neumann (1841) and James Clerk Maxwell (1850) gave the stress-optic law. Photoelasticity became an engineering method with E. G. Coker and L. N. G. Filon, whose *Treatise on Photo-Elasticity* of 1931 set out the models, the polariscope and the analysis; for several decades before computers it was the way to find the stresses in an odd shape.',
  sources: [
    'J. W. Dally and W. F. Riley, *Experimental Stress Analysis* (McGraw-Hill) — photoelasticity: the stress-optic law, polariscopes, fringe interpretation.',
    'H. Aben and C. Guillemet, *Photoelasticity of Glass* (Springer, 1993) — the stress-optic coefficients and stress in glass.',
    'ASTM C1048, *Standard Specification for Heat-Treated Flat Glass* — the definitions of heat-strengthened and fully tempered glass.'
  ],
  sim: 'po-photoelastic'
}
);
