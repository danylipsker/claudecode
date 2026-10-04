/* HYPER-OPTICS · content/diffraction.js — the topic "Diffraction" (waves-and-interference).
 *   what-diffraction-is · single-slit-diffraction · the-airy-disk · resolution-limits ·
 *   the-grating-equation · grating-types-and-blaze · grating-spectrometers-and-resolving-power ·
 *   fresnel-diffraction-and-zone-plates · fourier-optics · spatial-filtering · holography · diffraction-in-everyday-life
 * Simulations: sims/diffraction.js (ids df-…).
 */
Hyper.add(

/* ================================================================ what diffraction is */
{
  id: 'what-diffraction-is', parent: 'diffraction', title: 'What diffraction is', level: 1,
  short: 'Light spreads out when it passes an edge or an opening: a beam squeezed into a width D fans out by an angle of about λ/D. Close to the opening the shadow is almost sharp; far away the pattern is the one every later page builds on. Diffraction is why no lens can focus light to a point and why a grating can split colours.',
  keywords: ['diffraction', 'spreading of light', 'bending round corners', 'Fresnel number', 'near field', 'far field', 'Fraunhofer', 'Fresnel diffraction', 'knife edge', 'edge diffraction', 'Huygens', 'wavelet', 'shadow edge', 'Grimaldi'],
  prereq: ['light-as-a-wave', 'huygens-construction', 'wavelength-frequency-and-colour'],
  related: ['single-slit-diffraction', 'the-airy-disk', 'fresnel-diffraction-and-zone-plates', 'fourier-optics', 'shadows-and-the-pinhole', 'coherence', 'physics:huygens-principle', 'physics:single-slit-diffraction'],
  body: `
Shine a laser pointer through a gap between two razor blades and narrow the gap. The spot on the wall does not shrink to a thin line; beyond a point it *widens*, and breaks into a row of bright and dark bars. Light has not stopped travelling in straight lines. It is that a wave cannot be squeezed into a narrow band of space and stay perfectly straight. Squeeze it into a width $D$ and it fans out by an angle of about

$$\\theta \\approx \\frac{\\lambda}{D}$$

That spreading at edges and openings is **diffraction**.

### Why a wave spreads
Every point on a wavefront can be pictured as the source of a small wavelet ([[huygens-construction|Huygens' picture]]). In open space the wavelets add up to a wavefront that carries on unchanged. Put an obstacle in the way and the wavelets that would have come from behind it are missing; what is left no longer cancels sideways, and some light heads off to the side. Put the other way round: a beam of width $D$ is a bundle of directions, and the narrower the beam the wider the bundle. [[fourier-optics]] makes that exact.

| Opening $D$ | Spread $\\lambda/D$ at 550 nm | What you see |
|---|---|---|
| 5 µm | 6.3° | a slit that floods a whole wall |
| 50 µm | 0.63° | a pattern 22 mm wide on a screen 1 m away |
| 0.5 mm | 3.8 arcmin | a small spot that grows only slowly |
| 5 mm | 23 arcsec | a thin pencil of light |
| 50 mm | 2.3 arcsec | the sharpest image a telescope of that size can make |

Every opening diffracts, a 50 mm lens as much as a 5 µm slit; only the angle differs. Shadows of everyday objects look sharp because $\\lambda$ is tiny compared with them.

### Near field and far field
What you see depends on how far behind the opening you look. The yardstick is the **Fresnel number**

$$N_F = \\frac{a^2}{\\lambda L}$$

where $a$ is the half-width (the radius) of the opening and $L$ the distance to the screen.
- $N_F \\gg 1$, close in: the shadow is almost geometric, fringed by fine ripples. This is **Fresnel** (near-field) diffraction.
- $N_F \\approx 1$: the pattern changes shape from one distance to the next.
- $N_F \\ll 1$, far away: the shape stops changing and only grows in proportion to $L$. This is **Fraunhofer** (far-field) diffraction; its angles are the $\\lambda/D$ above.

A 1 mm slit ($a$ = 0.5 mm) in green light reaches $N_F = 1$ at $L = a^2/\\lambda = 0.45$ m. A lens makes "very far away" cheap: its focal plane shows the far-field pattern of whatever stands in front of it, however close.

### The edge of a shadow
Even a single straight edge diffracts. Behind a razor blade the border of the shadow is not a step: at the geometric edge the intensity is a quarter of the undisturbed value, it dies away smoothly into the shadow, and on the lit side it overshoots to 1.37 times the plain beam before ripples settle to 1. At 1 m in green light the first bright ripple lies 0.64 mm inside the lit region, and the ripple spacing is of the order of $\\sqrt{\\lambda L/2} = 0.5$ mm.

### What diffraction is not
It is not a force that bends light round corners and it is not reserved for tiny holes. Nor is it different physics from interference: both add waves from many points. By habit "interference" names the case of a few sources ([[youngs-double-slit]]), "diffraction" that of a continuous opening.

> [!key] Squeezing a beam to a width $D$ spreads it by about $\\lambda/D$. Close to the opening ($N_F \\gg 1$) the shadow is nearly geometric; far from it ($N_F \\ll 1$) the pattern is the far-field one that slits, round holes, gratings and lenses all share.
`,
  ideas: [
    'Every opening or edge spreads light; the spread angle is of order λ/D, so small openings spread it more.',
    'Diffraction is the adding up of wavelets from every point of the unblocked wavefront, the same physics as interference.',
    'The Fresnel number N_F = a²/(λL) tells near field (N_F ≫ 1) from far field (N_F ≪ 1).',
    'In the far field the pattern keeps its shape and grows in proportion to the distance; a lens brings the far field to its focal plane.',
    'Even a straight edge has a pattern: one quarter of the intensity at the geometric edge and a 37 % overshoot on the lit side.'
  ],
  pitfalls: [
    'Diffraction only happens at holes about as small as the wavelength — Every opening and edge diffracts, whatever its size. Only the angle changes: λ/D is 0.003° for a 10 mm aperture and 6° for a 5 µm slit.',
    'Light is bent round corners by the edge pulling on it — No force is involved. The wavefront is cut off at the edge and the remaining wavelets no longer cancel sideways; the result follows from adding waves.',
    'Behind a straight edge there is a sharp step from light to dark — There is a smooth transition about √(λL/2) wide, with ripples on the bright side. The step is the limit when the wavelength is negligible.',
    'Diffraction and interference are separate effects — They are one effect named by how many sources you count: two slits make interference fringes, one slit makes a diffraction pattern, and the single-slit pattern is itself an interference of many wavelets.'
  ],
  terms: [
    { term: 'Diffraction', def: 'The spreading of a wave at an edge or an opening, and the pattern of bright and dark bands it produces. It follows from adding the wavelets from every point of the part of the wavefront that gets through.' },
    { term: 'Huygens–Fresnel principle', also: ['Huygens\' wavelets', 'wavelet picture'], def: 'Every point of a wavefront acts as a source of a spherical wavelet; the field beyond is the sum of all the wavelets, with their phases. Fresnel added the interference between them to Huygens\' construction.' },
    { term: 'Fraunhofer diffraction', also: ['far-field diffraction', 'far field'], def: 'Diffraction observed so far from the opening, or in the focal plane of a lens, that the pattern keeps its shape and only scales with distance. Its angles are fixed by λ/D.' },
    { term: 'Fresnel diffraction', also: ['near-field diffraction', 'near field'], def: 'Diffraction observed close enough to the opening that the shadow is still roughly geometric and the pattern changes with distance, with fringes and ripples near the edges.' },
    { term: 'Fresnel number', also: ['N_F'], def: 'N_F = a²/(λL) for an opening of radius a viewed at distance L. Large means near field, small means far field, about 1 the transition. It is also the number of Fresnel zones the opening exposes.' }
  ],
  formulas: [
    {
      name: 'First dark direction of a slit',
      expr: 'sin(t) = lambda/a', tex: '\\sin\\theta = \\frac{\\lambda}{a}',
      vars: {
        t: { name: 'angle to the first dark band', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        a: { name: 'slit width', q: 'length', unit: 'µm', value: 50 }
      },
      note: 'For a slit; a round hole has 1.22 λ/D instead. If λ > a there is no dark band: the light spreads to all angles.',
      stories: { t: 'Light of wavelength {lambda} goes through a slit {a} wide. At what angle from the straight-on direction is the first dark band?', a: 'The first dark band of {lambda} light lies {t} from the centre. How wide is the slit?' }
    },
    {
      name: 'Fresnel number',
      expr: 'NF = a^2/(lambda*L)', tex: 'N_F = \\frac{a^2}{\\lambda L}',
      vars: {
        NF: { name: 'Fresnel number', tex: 'N_F' },
        a: { name: 'radius (half-width) of the opening', q: 'length', unit: 'mm', value: 0.5 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        L: { name: 'distance to the screen', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Above about 1 the pattern is Fresnel (near field); well below 1 it is Fraunhofer (far field).',
      stories: { NF: 'A circular hole of radius {a} is lit by {lambda} light and viewed on a screen {L} behind it. What is the Fresnel number?', L: 'At what distance from a hole of radius {a} does the Fresnel number of {lambda} light equal {NF}?' }
    },
    {
      name: 'Ripple spacing behind an edge',
      expr: 's = sqrt(lambda*L/2)', tex: 's = \\sqrt{\\frac{\\lambda L}{2}}',
      vars: {
        s: { name: 'scale of the edge ripples', q: 'length', unit: 'mm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        L: { name: 'distance behind the edge', q: 'length', unit: 'm', value: 1 }
      },
      note: 'The first bright ripple lies 1.22 s inside the lit region; the ripples crowd together farther out.'
    }
  ],
  examples: [
    {
      title: 'Where does the far field begin?',
      q: 'A slit 1 mm wide is lit with 550 nm light. How far behind it must the screen be for the Fresnel number to fall to 0.1?',
      steps: [
        'The half-width is $a = 0.5$ mm. Solve $N_F = a^2/(\\lambda L)$ for $L$:',
        { text: 'The distance is', tex: 'L = \\frac{a^2}{N_F\\,\\lambda} = \\frac{(0.5\\times10^{-3})^2}{0.1 \\times 550\\times10^{-9}} = 4.5\\ \\mathrm{m}' }
      ],
      a: 'About 4.5 m. A tabletop screen at 1 m is in the transition region, which is why the pattern from a slit that wide looks neither like a shadow nor like a clean far-field pattern.'
    },
    {
      title: 'A laser through a narrow slit',
      q: 'A helium–neon beam (632.8 nm) passes a slit 50 µm wide. How wide is the bright central band on a wall 2 m away?',
      steps: [
        'The first dark band is at $\\sin\\theta = \\lambda/a = 632.8\\ \\mathrm{nm}/50\\ \\mu\\mathrm{m} = 0.01266$, so $\\theta = 0.725°$.',
        'On the wall that is $2\\ \\mathrm{m} \\times 0.01266 = 25.3$ mm either side of the centre. The Fresnel number is only $(25\\ \\mu\\mathrm{m})^2/(632.8\\ \\mathrm{nm} \\times 2\\ \\mathrm{m}) = 5\\times10^{-4}$: far field, so the formula applies.'
      ],
      a: 'The central band is about 51 mm wide, a thousand times the slit.'
    }
  ],
  quiz: [
    { q: 'A slit is made narrower. What happens to the diffraction pattern far behind it?', choices: ['It gets wider', 'It gets narrower', 'It stays the same width but gets dimmer', 'It vanishes'], a: 0, why: 'The spread angle goes as $\\lambda/a$: a narrower slit sends the light into a wider range of directions. Overall the pattern also gets dimmer, because less light passes, but the width is what changes.' },
    { q: 'Diffraction happens only when the opening is about as small as the wavelength.', a: false, why: 'Every opening diffracts. A 50 mm telescope aperture spreads light by $\\lambda/D$ of about 2 arcseconds: tiny, but it is what limits the picture.' },
    { q: 'A circular opening of radius 1 mm is lit by 500 nm light. What is the Fresnel number on a screen 2 m behind it?', answer: 1, why: '$N_F = a^2/(\\lambda L) = (10^{-3})^2/(500\\times10^{-9} \\times 2) = 1$. The pattern is in the transition region between near and far field.' },
    { q: 'In which situation is the far-field (Fraunhofer) pattern seen without looking far away?', choices: ['In the focal plane of a lens', 'Behind a very small hole in thick metal', 'With a very bright source', 'With a very short wavelength'], a: 0, why: 'A lens sends each direction of light to its own point of the focal plane, so that plane shows the far-field pattern of whatever is in front of the lens, however near.' },
    { q: 'At the exact geometric edge of a straight opaque edge lit by a plane wave, the intensity is…', choices: ['one quarter of the unobstructed value', 'one half', 'zero', 'equal to the unobstructed value'], a: 0, why: 'The amplitude there is half the free-space amplitude, so the intensity is a quarter. It rises to 1.37 on the lit side and falls smoothly through the shadow.' }
  ],
  applications: [
    'Choosing a viewing distance: whether a lens, pinhole or slit setup is in the near field or the far field decides which formula applies.',
    'Laser beam delivery: a beam leaving an aperture of diameter D spreads by about λ/D, which is why long-range beams start wide.',
    'Edge-spread measurement and knife-edge tests: the Fresnel edge pattern is used to check how sharp an edge, or a beam, really is.',
    'Microwave and radio design: the same Fresnel zones decide how much clearance a radio link needs over a hill.',
    'Diffraction-limited imaging: it sets the smallest spot any lens of a given aperture can make.'
  ],
  history: 'The effect was described by Francesco Maria Grimaldi, whose book of 1665 (published the year after his death) reported bands of light inside a shadow and named the effect *diffractio*. Newton, preferring particles of light, explained it badly; Thomas Young (1801–03) and above all Augustin Fresnel (1815–19) showed that it follows from adding waves. Joseph von Fraunhofer, who made the first precise gratings in the 1810s, gave his name to the far-field case.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 (Diffraction) — Fresnel and Fraunhofer diffraction, Fresnel zones and the straight edge.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 (Elements of the theory of diffraction).',
    'J. W. Goodman, *Introduction to Fourier Optics*, ch. 4 (Fresnel and Fraunhofer diffraction) — the Fresnel number and the regimes.'
  ],
  sim: 'df-spreading'
},

/* ================================================================ the single slit */
{
  id: 'single-slit-diffraction', parent: 'diffraction', title: 'The single slit', level: 2,
  short: 'Light through one narrow slit makes a broad bright band with weaker bands either side, divided by dark lines where a·sin θ = mλ. The narrower the slit, the wider the pattern. It is the simplest diffraction pattern and the key to all the others.',
  keywords: ['single slit', 'slit diffraction', 'sinc', 'sinc squared', 'central maximum', 'secondary maxima', 'side lobes', 'minima', 'a sin theta', 'Babinet', 'hair measurement', 'diffraction pattern', 'dark fringes'],
  prereq: ['what-diffraction-is', 'superposition-and-phase', 'constructive-and-destructive-interference'],
  related: ['the-airy-disk', 'the-grating-equation', 'youngs-double-slit', 'fourier-optics', 'physics:single-slit-diffraction', 'physics:double-slit'],
  body: `
Light that has passed one narrow slit and landed on a distant screen forms a wide bright band in the middle with fainter bands on both sides, separated by dark lines. Make the slit narrower and the pattern grows *wider*.

### Why there are dark lines
Cut the slit, of width $a$, into two halves and look in a direction $\\theta$ away from straight on. A point in the upper half and its partner in the lower half are $a/2$ apart, so their light differs in path by $\\tfrac{a}{2}\\sin\\theta$. When that is half a wavelength the two arrive in opposite step and cancel. The same is true of every such pair, so the whole slit goes dark:

$$a\\sin\\theta = m\\lambda \\qquad (m = \\pm 1, \\pm 2, \\dots)$$

Cut the slit into four quarters and the argument gives $m = 2$; into six, $m = 3$; and so on. The equation has the same look as [[the-grating-equation|the grating equation]] but means the opposite: there it marks bright directions, here dark ones.

### The pattern
Adding up all the wavelets gives, relative to the straight-ahead intensity $I_0$,

$$\\frac{I}{I_0} = \\left(\\frac{\\sin\\beta}{\\beta}\\right)^2, \\qquad \\beta = \\frac{\\pi a\\sin\\theta}{\\lambda}$$

the **sinc squared** curve. The central maximum extends from $-\\lambda/a$ to $+\\lambda/a$ in $\\sin\\theta$, twice as wide as the others, and holds 90 % of the light. Between the dark lines lie weak secondary maxima, at 4.7 %, 1.6 % and 0.8 % of the central peak.

| Slit width $a$ | first dark band at 550 nm | central band on a screen 1 m away |
|---|---|---|
| 10 µm | 3.2° | 110 mm |
| 50 µm | 0.63° | 22 mm |
| 0.2 mm | 0.16° | 5.5 mm |
| 1 mm | 0.032° | 1.1 mm |

A slit narrower than the wavelength never reaches $a\\sin\\theta = \\lambda$: there is no dark line and the light spreads through the whole half-space.

### Measuring with it
Babinet's principle says an obstacle makes the same pattern as an opening of the same shape (apart from the undisturbed beam in the centre). So a laser pointer shone at a hair gives the pattern of a slit as wide as the hair, and the spacing $x$ of the dark lines on a wall at distance $L$ gives its width, $a = \\lambda L/x$. The same trick measures wires, fibres and the gap of a micrometer-controlled slit to a fraction of a micrometre.

### Where the idea leads
The width of the pattern is inversely proportional to the width of the opening. That reciprocity is the first example of the Fourier relation of [[fourier-optics]]. Put two slits in the opening and fringes appear inside this envelope; put thousands, and the fringes narrow into the grating's sharp orders; replace the slit by a round hole and the pattern becomes the [[the-airy-disk|Airy disc]].

> [!warn] Use only a Class 1 or Class 2 pointer (under 1 mW) for slit experiments and never look into the beam or its reflection from glass or metal. See [[laser-safety-classes]].

> [!key] A slit of width $a$ sends light into dark lines at $a\\sin\\theta = m\\lambda$ and into a central band about $2\\lambda/a$ wide. Narrower slit, wider pattern.
`,
  ideas: [
    'Dark lines occur where a·sin θ = mλ (m = ±1, ±2, …): every point of the slit then has a partner that cancels it.',
    'The intensity is I₀ (sin β/β)² with β = πa sin θ/λ.',
    'The central maximum is twice as wide as the others and holds about 90 % of the light; the secondary maxima are 4.7 %, 1.6 %, 0.8 % of the peak.',
    'Pattern width ∝ 1/slit width: halving the slit doubles the pattern.',
    'A hair or wire makes the same pattern as a slit of its width (Babinet), which gives a simple way to measure it.'
  ],
  pitfalls: [
    'The bright lines are where a·sin θ = mλ — For a single slit that equation locates the dark lines. For a grating, d·sin θ = mλ locates the bright ones; the two look alike and are easy to swap.',
    'A wider slit gives a wider pattern — The reverse: the central band is about 2λ/a across, so a wider slit gives a narrower pattern, tending to the sharp geometric image.',
    'All the bright bands are equally bright, as in a grating — They are not: the central one carries about 90 % of the light and the first side band is only 4.7 % of the central peak.',
    'The slit "bends" the light into the side bands — The side bands come from the same wavelets that make the central one; no extra light is created. Their brightness is fixed by the sinc² shape.'
  ],
  terms: [
    { term: 'Central maximum', also: ['central band', 'zero order'], def: 'The broad bright band straight behind a slit, bounded by the first dark lines at sin θ = ±λ/a. It holds about 90 % of the transmitted light.' },
    { term: 'Diffraction minimum', also: ['dark fringe', 'null'], def: 'A direction in which the wavelets from the whole opening cancel completely. For a slit these are at a·sin θ = mλ with m = ±1, ±2, …' },
    { term: 'Secondary maximum', also: ['side lobe', 'side band'], def: 'One of the weak bright bands between the minima. For a slit the first is 4.7 % of the central peak, the second 1.6 %.' },
    { term: 'Sinc function', also: ['sinc²', 'sin x / x'], def: 'The function sin x / x. Its square, with x = πa sin θ/λ, is the intensity pattern of a single slit.' },
    { term: 'Babinet\'s principle', def: 'An obstacle and an opening of the same shape diffract light into the same pattern, except for the undisturbed central beam. It lets a hair stand in for a slit.' }
  ],
  formulas: [
    {
      name: 'Dark lines of a single slit',
      expr: 'a*sin(t) = m*lambda', tex: 'a\\sin\\theta = m\\lambda',
      vars: {
        a: { name: 'slit width', q: 'length', unit: 'µm', value: 50 },
        t: { name: 'angle of the dark line', q: 'angle', unit: '°', value: 0.63, min: 0, max: 90, tex: '\\theta' },
        m: { name: 'order of the dark line', value: 1, int: true, min: 1, max: 20 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 't',
      note: 'Dark lines only, m = 1, 2, 3 … ; the order m = 0 is the bright centre.',
      stories: { t: 'Light of {lambda} goes through a slit {a} wide. At what angle is dark line number {m}?', a: 'Dark line number {m} of {lambda} light lies at {t}. How wide is the slit?' }
    },
    {
      name: 'Width of the central band on the screen',
      expr: 'w = 2*lambda*L/a', tex: 'w = \\frac{2\\lambda L}{a}',
      vars: {
        w: { name: 'width of the central band', q: 'length', unit: 'mm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        L: { name: 'distance to the screen', q: 'length', unit: 'm', value: 3 },
        a: { name: 'slit width', q: 'length', unit: 'µm', value: 79 }
      },
      note: 'Far field and small angles. Solved for a, it is the hair-measurement formula a = 2λL/w with w the distance between the first dark lines.',
      stories: { w: 'A {lambda} laser shines through a slit {a} wide onto a wall {L} away. How wide is the bright central band?', a: 'A hair is placed in a {lambda} laser beam. On a wall {L} away the central band is {w} wide. How thick is the hair?' }
    }
  ],
  examples: [
    {
      title: 'Measuring a hair',
      q: 'A helium–neon laser (632.8 nm) shines on a hair. On a wall 3.0 m away, the bright central band is 48 mm wide, measured between the first dark lines on each side. How thick is the hair?',
      steps: [
        'The central band is $2\\lambda L/a$ wide, so $a = 2\\lambda L/w$.',
        { text: 'Substituting:', tex: 'a = \\frac{2 \\times 632.8\\times10^{-9} \\times 3.0}{0.048} = 79\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 79 µm, typical of a human hair (50–100 µm). A micrometre screw would have to be read very carefully to match this.'
    },
    {
      title: 'How bright is the first side band?',
      q: 'The central maximum of a slit pattern reads 100 on a light meter. What does the meter read at the middle of the first side band?',
      steps: [
        'The first side band peaks near $\\beta = 1.43\\pi$ (not exactly halfway between the minima).',
        { text: 'There the intensity relative to the centre is', tex: '\\left(\\frac{\\sin(1.43\\pi)}{1.43\\pi}\\right)^2 = \\left(\\frac{-0.975}{4.49}\\right)^2 = 0.047' }
      ],
      a: 'About 4.7, and the second side band reads about 1.6. The pattern looks like one bright band with faint stripes, not a row of equal ones.'
    }
  ],
  quiz: [
    { q: 'A slit 0.1 mm wide gives a central band 12 mm wide on a screen. The slit is replaced by one 0.2 mm wide. The central band is now…', choices: ['6 mm', '12 mm', '24 mm', '3 mm'], a: 0, why: 'The width is $2\\lambda L/a$, inversely proportional to $a$: doubling the slit halves the band.' },
    { q: 'In which direction does a slit of width $a$ in 600 nm light give its first dark line, if $a = 6\\ \\mu\\mathrm{m}$?', answer: 5.74, unit: '°', why: '$\\sin\\theta = \\lambda/a = 0.1$, so $\\theta = 5.74°$.' },
    { q: 'The central maximum of a single-slit pattern is twice as wide as the secondary ones.', a: true, why: 'It runs from $-\\lambda/a$ to $+\\lambda/a$ in $\\sin\\theta$ — two units — while each side band runs between neighbouring minima, one unit.' },
    { q: 'A slit is narrower than the wavelength ($a < \\lambda$). What does the screen show?', choices: ['No dark lines: the light spreads over the whole half-space', 'Dark lines very close together', 'A sharp image of the slit', 'Nothing: no light gets through'], a: 0, why: 'Dark lines need $a\\sin\\theta = m\\lambda$ with $\\sin\\theta \\le 1$, which requires $a \\ge \\lambda$. With a narrower slit there is no solution, and the light fans out smoothly.' },
    { q: 'A 25 µm wire in a 550 nm beam makes diffraction bands. They are the same as those of…', choices: ['a slit 25 µm wide, except in the exact centre', 'a slit 50 µm wide', 'a double slit', 'nothing: wires do not diffract'], a: 0, why: 'This is Babinet\'s principle: the complement of an opening diffracts the same way, apart from the undisturbed beam at the centre.' }
  ],
  applications: [
    'Measuring the diameter of fibres, wires and hairs, and the thickness of thin foils, from the spacing of dark lines.',
    'Adjustable slits in spectrometers and monochromators: the slit width sets the instrument\'s resolution and, at its narrowest, adds its own diffraction.',
    'Laser line generation and profile checks: a knife edge or slit scanned across a beam gives its width.',
    'Aperture design: any rectangular opening, such as the gap in a light barrier or a rectangular camera stop, diffracts into this pattern along each side.'
  ],
  history: 'The pattern was observed by Grimaldi and explained quantitatively in 1818–19 by Fresnel, whose memoir on diffraction won the French Academy\'s prize. Young had reasoned with the wave idea earlier, from light passing the edges of a narrow strip.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 (Diffraction), the sections on Fraunhofer diffraction by a single slit.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, the chapter on Fraunhofer diffraction — single slit and Babinet\'s principle.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 — Fraunhofer diffraction by a slit and by a rectangular aperture.'
  ],
  sim: 'df-single-slit'
},

/* ================================================================ the Airy disc */
{
  id: 'the-airy-disk', parent: 'diffraction', title: 'The Airy disc', level: 2,
  short: 'A perfect lens does not focus a point of light to a point but to a bright disc ringed by faint rings: the Airy pattern. Its first dark ring has radius 1.22 λN, so the disc is 2.44 λN across — 2.7 µm at f/2, 21 µm at f/16 in green light — and holds 84 % of the light.',
  keywords: ['Airy disc', 'Airy disk', 'Airy pattern', 'diffraction-limited spot', '1.22', '2.44 lambda N', 'Bessel function', 'encircled energy', 'first dark ring', 'diffraction blur', 'point spread function', 'circular aperture', 'diffraction limit pixel'],
  prereq: ['single-slit-diffraction', 'the-f-number', 'the-point-spread-function'],
  related: ['resolution-limits', 'diffraction-limited-mtf', 'strehl-ratio-and-diffraction-limited', 'numerical-aperture', 'sensor-formats-and-pixel-size', 'the-pupil', 'fourier-optics'],
  body: `
A star, a distant street lamp and a pinhole in a test chart are all points of light, and a perfect lens cannot focus any of them to a point. The light passes the lens's round opening, the opening diffracts it as a slit does but in a circle, and the image of the point is a bright disc ringed by faint rings: the **Airy disc**, named for George Airy, who worked out its profile in 1835.

### The pattern
In terms of the [[the-f-number|f-number]] $N$, the intensity at a distance $r$ from the centre of the image of a point is

$$\\frac{I}{I_0} = \\left[\\frac{2J_1(x)}{x}\\right]^2, \\qquad x = \\frac{\\pi r}{\\lambda N}$$

where $J_1$ is a Bessel function. The first zero is at $x = 3.832$, which fixes the radius of the first dark ring and the diameter of the disc:

$$r_1 = 1.22\\,\\lambda N \\qquad d = 2.44\\,\\lambda N$$

| f-number | 1.4 | 2 | 2.8 | 4 | 5.6 | 8 | 11 | 16 | 22 |
|---|---|---|---|---|---|---|---|---|---|
| disc diameter, blue 450 nm (µm) | 1.5 | 2.2 | 3.1 | 4.4 | 6.1 | 8.8 | 12.1 | 17.6 | 24.1 |
| green 550 nm (µm) | 1.9 | 2.7 | 3.8 | 5.4 | 7.5 | 10.7 | 14.8 | 21.5 | 29.5 |
| red 650 nm (µm) | 2.2 | 3.2 | 4.4 | 6.3 | 8.9 | 12.7 | 17.4 | 25.4 | 34.9 |

Red light makes a disc 44 % wider than blue. Each stop down multiplies the disc by $\\sqrt 2$.

### Where the light goes
- **The disc** (inside the first dark ring) holds **83.8 %** of the light.
- **The first bright ring** peaks at only 1.75 % of the central intensity and carries about 7 % of the light; the second ring peaks at 0.42 % and carries about 3 %. The disc and the first two rings together hold 94 %.
- The half-intensity width of the core is $1.03\\,\\lambda N$, about 42 % of the disc diameter, so a "sharp" image of a point is smaller than the quoted disc.

The disc is not a hard-edged circle: the intensity falls smoothly from the centre, and the rings are so faint that photographs of stars show them only when the centre is deliberately overexposed.

### What the disc means
- **It is the best a lens can do.** If a lens's own faults blur the point by less than the Airy disc, the lens is called **diffraction-limited**: the disc is all that is left ([[strehl-ratio-and-diffraction-limited]]).
- **It is the point-spread function** of the ideal lens: every image is the true image smeared by this pattern ([[the-point-spread-function]]), and the Fourier transform of the pattern is the lens's [[diffraction-limited-mtf|diffraction MTF]].
- **It meets the pixel.** At f/8 the disc is 10.7 µm across: 5 pixels of a 2.2 µm sensor, 2.5 of a 4.3 µm one. If the disc is smaller than a pixel the sensor is the limit, if larger the lens is.
- **It is in the eye.** A 3 mm pupil on a 17 mm eye gives a disc about 7.6 µm across on the retina, spanning two to three of the foveal cones.

### When the aperture is not a clean circle
Block the centre, as a telescope's secondary mirror does, and the disc shrinks a little while more light moves into the rings. A polygon makes spikes ([[diffraction-in-everyday-life]]). Aberrations of the lens broaden the core and raise the rings.

> [!key] A perfect lens images a point as a disc $2.44\\,\\lambda N$ across holding 84 % of the light, ringed by faint rings. It grows with wavelength and f-number, and sets the finest detail any image can have.
`,
  ideas: [
    'A round aperture images a point as the Airy pattern [2J₁(x)/x]², with x = πr/(λN).',
    'The first dark ring has radius 1.22 λN, so the disc diameter is 2.44 λN: it grows with the f-number and the wavelength.',
    'The disc holds 83.8 % of the light; the first and second bright rings add 7.2 % and 2.8 %, and the rest is in the far tail.',
    'A lens whose aberrations blur less than the Airy disc is diffraction-limited.',
    'Compare the disc with the pixel: below one pixel the sensor limits detail, above it the lens does.'
  ],
  pitfalls: [
    'Stopping down always makes the picture sharper — The Airy disc grows as λN. Past the aperture where the lens\'s aberrations are small, closing the stop only enlarges the diffraction blur.',
    'The Airy disc is the size of the lens opening — It is a few micrometres across, set by wavelength and f-number, not by the diameter: a 25 mm and a 100 mm lens at f/4 make the same disc.',
    'The rings are bright side images of the point — They are very faint (1.75 % of the peak at most) and, with the far tail, carry only the 16 % of the light that lies outside the disc; they matter for faint companions of bright stars.',
    'A smaller Airy disc always means better resolution — Only if the lens and the sensor can use it. Aberrations, pixel size and motion often dominate; see [[system-mtf]].'
  ],
  terms: [
    { term: 'Airy disc', also: ['Airy disk', 'Airy pattern'], def: 'The central bright disc of the diffraction pattern of a round aperture, out to the first dark ring, and the whole pattern with its faint rings. It is the image of a point formed by a perfect lens.' },
    { term: 'Airy radius', also: ['first dark ring', '1.22 λN'], def: 'The radius of the first dark ring in the image plane, 1.22 λN for a lens of f-number N (1.22 λ/D as an angle). The diameter is 2.44 λN.' },
    { term: 'Encircled energy', also: ['EE', 'ensquared energy'], def: 'The fraction of a point\'s light that falls inside a circle of given radius around the centre. For the Airy pattern it is 84 % at the first dark ring, 91 % at the second, 94 % at the third.' },
    { term: 'Diffraction-limited', def: 'Describing a lens or system whose aberrations are so small that its image of a point is the Airy pattern. It cannot be improved without making the aperture larger or the wavelength shorter.' },
    { term: 'Bessel function', also: ['J₁', 'jinc'], def: 'The function J₁ whose ratio 2J₁(x)/x gives the amplitude of the Airy pattern, the circular counterpart of the sinc function of a slit.' }
  ],
  formulas: [
    {
      name: 'Diameter of the Airy disc',
      expr: 'd = 2.44*lambda*N', tex: 'd = 2.44\\,\\lambda\\,N',
      vars: {
        d: { name: 'diameter to the first dark ring', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 5.6, min: 0.5, max: 64 }
      },
      stories: { d: 'How wide is the Airy disc of {lambda} light from a perfect lens at f/{N}?', N: 'A sensor has 3.45 µm pixels. At what f-number is the Airy disc of {lambda} light {d} across?' }
    },
    {
      name: 'Angular radius of the Airy disc',
      expr: 'th = 1.22*lambda/D', tex: '\\theta = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        th: { name: 'angular radius of the first dark ring', q: 'angle', unit: '″', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'aperture diameter', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The same pattern seen as an angle: a 100 mm telescope puts the first dark ring 1.4″ from the centre.',
      stories: { th: 'A telescope with a {D} aperture images a star in {lambda} light. At what angle is the first dark ring?', D: 'What aperture puts the first dark ring of {lambda} light at {th}?' }
    },
    {
      name: 'Pixels across the Airy disc',
      expr: 'k = 2.44*lambda*N/p', tex: 'k = \\frac{2.44\\,\\lambda N}{p}',
      vars: {
        k: { name: 'pixels across the disc' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 }
      },
      note: 'Above about 2 the lens, not the sensor, limits the detail.'
    }
  ],
  examples: [
    {
      title: 'A phone lens',
      q: 'A phone camera has a lens at f/1.8 and pixels 1.0 µm wide. How large is the Airy disc in green light, and how many pixels does it cover?',
      steps: [
        { text: 'The diameter is', tex: 'd = 2.44\\,\\lambda N = 2.44 \\times 0.55\\ \\mu\\mathrm{m} \\times 1.8 = 2.4\\ \\mu\\mathrm{m}' },
        'That is 2.4 pixels across. Even a perfect lens at f/1.8 spreads each point over about six pixels, which is why very small pixels add little detail and phones combine them in groups.'
      ],
      a: '2.4 µm, about 2.4 pixels across: the lens, not the sensor, limits the finest detail.'
    },
    {
      title: 'Choosing the stop',
      q: 'A scientific camera has 6.5 µm pixels. At what f-number does the Airy disc of 550 nm light just cover two pixels?',
      steps: [
        { text: 'Two pixels are 13 µm. Solve $d = 2.44\\lambda N$ for $N$:', tex: 'N = \\frac{13\\ \\mu\\mathrm{m}}{2.44 \\times 0.55\\ \\mu\\mathrm{m}} = 9.7' }
      ],
      a: 'About f/9.7. Stopped down past f/10, the picture is blurred by diffraction before the sensor can show it.'
    }
  ],
  quiz: [
    { q: 'A perfect lens at f/8 images a point in 550 nm light. What is the diameter of the Airy disc?', answer: 10.7, unit: 'µm', why: '$d = 2.44\\lambda N = 2.44 \\times 0.55\\ \\mu\\mathrm{m} \\times 8 = 10.7\\ \\mu\\mathrm{m}$.' },
    { q: 'What fraction of the light of a point falls inside the first dark ring?', choices: ['About 84 %', 'About 50 %', 'About 99 %', 'Exactly 100 %'], a: 0, why: 'The disc holds 83.8 % and the rings together the rest of the light; the first ring alone carries about 7 %.' },
    { q: 'Two lenses, one with a 25 mm opening and one with a 100 mm opening, are both set to f/4. Their Airy discs are…', choices: ['equal in size', 'four times larger for the smaller lens', 'four times larger for the larger lens', 'different in shape'], a: 0, why: 'The disc diameter is $2.44\\lambda N$ and depends only on the f-number and wavelength. The larger lens collects more light but forms the same size of disc.' },
    { q: 'Switching from red (650 nm) to blue (450 nm) light, the Airy disc becomes smaller.', a: true, why: 'The disc scales with the wavelength: $450/650 = 0.69$, so it is 31 % smaller. This is why microscopists use blue light for the finest detail.' },
    { q: 'A lens is "diffraction-limited" when…', choices: ['its aberrations are smaller than the diffraction blur', 'it has no glass elements', 'it is stopped down to f/22', 'its Airy disc is zero'], a: 0, why: 'Then the Airy pattern is the whole blur of a point. The condition is about the aberrations, not about the stop, though lenses are most often diffraction-limited when stopped down.' }
  ],
  applications: [
    'Choosing the working aperture of a camera or machine-vision lens so that diffraction does not exceed the pixel size.',
    'Estimating the smallest spot a laser can be focused to with a lens of a given f-number.',
    'Judging a telescope: a star image is an Airy disc with rings, and its steadiness and roundness tell of the optics and of the air.',
    'Eye optics: the disc on the retina is why vision does not improve with a pupil smaller than about 2 mm.',
    'Specifying lithography and microscope objectives, whose resolution is the Airy radius scaled by the numerical aperture.'
  ],
  history: 'George Biddell Airy, then Plumian professor at Cambridge and later Astronomer Royal, published the formula for the diffraction pattern of a circular aperture in 1835, in a paper on the diffraction of an object-glass with circular aperture. Telescope makers had already seen the disc and rings around stars and wondered whether they were faults.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 (Diffraction), the section on Fraunhofer diffraction by a circular aperture.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 — the Airy pattern and the table of encircled energy.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 11 (Image evaluation) — the diffraction pattern and its use as the standard of image quality.'
  ],
  sim: 'df-airy'
},

/* ================================================================ resolution */
{
  id: 'resolution-limits', parent: 'diffraction', title: 'The limits of resolution', level: 2,
  short: 'Diffraction fixes the smallest detail any instrument can show. Two points are "just resolved" when their Airy discs are 1.22 λ/D apart (Rayleigh), a microscope shows periods down to λ/(2 NA) (Abbe), and astronomers\' rule of thumb is 116/D arcseconds (Dawes). Only a larger aperture, a shorter wavelength or a trick changes the limit.',
  keywords: ['resolution', 'Rayleigh criterion', 'Sparrow criterion', 'Dawes limit', 'Abbe limit', 'diffraction limit', 'resolving power', 'angular resolution', 'double star', 'two points', 'numerical aperture', 'super-resolution', 'STED', 'lateral resolution'],
  prereq: ['the-airy-disk', 'numerical-aperture', 'resolution-and-contrast'],
  related: ['diffraction-limited-mtf', 'strehl-ratio-and-diffraction-limited', 'the-compound-microscope', 'refracting-telescopes', 'the-fovea-and-visual-acuity', 'the-resolution-budget', 'physics:resolution'],
  body: `
Two stars so close that their Airy discs overlap look like one. How close can they be and still be seen as two? The answer depends on a convention for "seen", and several conventions are in use, but all give a limit of the same size, set by the wavelength and the aperture.

### The Rayleigh criterion
Lord Rayleigh proposed: two equal point sources are resolved when the centre of one disc falls on the first dark ring of the other. The angle is

$$\\theta_R = 1.22\\,\\frac{\\lambda}{D}$$

In a lens that is a separation $1.22\\,\\lambda N$ in the image. The summed pattern then dips to **73.5 %** of the peak between the two maxima: a modest but clear notch.

### Other rules
- **Sparrow:** the points are resolved when the dip just disappears and the sum is flat-topped: $0.947\\,\\lambda/D$, about 22 % closer than Rayleigh. It is the practical limit for a good detector.
- **Dawes:** for double stars with a telescope of $D$ mm, an observer with good eyes splits equal stars at $116/D$ arcseconds, a purely empirical rule close to Sparrow.
- **Abbe:** a microscope forms an image of a periodic object only if it captures the first diffracted order as well as the direct light; the smallest period it can show is $d = \\lambda/(2\\,\\mathrm{NA})$ for oblique illumination. In terms of two points it is close to $0.61\\,\\lambda/\\mathrm{NA}$, the Rayleigh limit again.

| Instrument | Aperture or NA | Smallest detail (550 nm) |
|---|---|---|
| Human eye, bright light | pupil 3 mm | 0.77′ (46″); the eye's acuity limit is about 1′ |
| Binoculars 10×50 | 50 mm | 2.8″ |
| Amateur telescope | 100 mm | 1.4″ (Dawes 1.2″) |
| Large amateur telescope | 250 mm | 0.55″ |
| Space telescope | 2.4 m | 0.058″ |
| Camera lens at f/8 | NA 0.06 | 5.4 µm in the image |
| Dry microscope objective | NA 0.95 | 353 nm (Abbe period 289 nm) |
| Oil-immersion objective | NA 1.4 | 240 nm (Abbe period 196 nm) |

### Why a bigger aperture, a shorter wavelength
The limit is $\\lambda/D$: to see finer detail, collect light over a wider aperture (a telescope mirror, an objective with higher NA) or use a shorter wavelength (blue light, ultraviolet, electrons, X-rays). Neither magnification nor better pixels helps: magnification beyond about 500 × NA only enlarges the blur, called empty magnification.

### Locating is not resolving
A star's position can be found to a small fraction of its Airy disc by fitting the pattern, when the picture is bright and noise is low; that is **localization**. It does not tell whether two stars are present. Methods such as STED and single-molecule localization microscopy (Nobel Prize in Chemistry, 2014) beat the Abbe limit in a different way: they make only a few molecules glow at a time, or shrink the glowing spot with a second beam.

> [!key] Resolution is limited by diffraction to about $1.22\\,\\lambda/D$ (Rayleigh): the discs of two points must be about a disc-radius apart to look like two. The cure is a bigger aperture or a shorter wavelength, never more magnification.
`,
  ideas: [
    'Rayleigh: two points are just resolved when one Airy disc sits on the first dark ring of the other, θ = 1.22 λ/D; the sum dips to 73.5 %.',
    'Sparrow (0.947 λ/D) is the point where the dip vanishes; Dawes (116/D arcseconds with D in mm) is the double-star rule of thumb.',
    'Abbe: a microscope resolves periods down to λ/(2 NA); an oil objective of NA 1.4 in green light reaches about 200 nm.',
    'Only a larger aperture, a higher NA or a shorter wavelength lowers the limit; magnification and pixels cannot.',
    'Finding where a single point is (localization) can be far more precise than resolving two.'
  ],
  pitfalls: [
    'More magnification shows more detail — Magnification enlarges the image, including its blur. Beyond about 500 × NA no more detail appears: the magnification is empty.',
    'Two stars closer than the Rayleigh angle can never be told apart — Rayleigh is a convention, not a wall. At Sparrow\'s separation a good detector still sees an elongated image, and with models of the shape closer pairs can be measured.',
    'Resolution is the same as sharpness — Sharpness is contrast at moderate detail; resolution is the finest detail that survives at all. A lens can be sharp at coarse detail and diffraction-limited at fine.',
    'The Abbe limit is a property of the objective lens alone — It depends on the wavelength and on the whole illumination: oblique illumination (a condenser of high NA) reaches λ/(2 NA), axial illumination only λ/NA.'
  ],
  terms: [
    { term: 'Rayleigh criterion', also: ['Rayleigh limit', 'Rayleigh resolution'], def: 'Two equal point sources are just resolved when the central maximum of one image falls on the first dark ring of the other: 1.22 λ/D as an angle, 1.22 λN in an image. The summed pattern then dips to 73.5 % between the peaks.' },
    { term: 'Sparrow criterion', also: ['Sparrow limit'], def: 'The separation, 0.947 λ/D, at which the dip between the two images just disappears. It is closer than the Rayleigh limit and is the practical limit for a good detector.' },
    { term: 'Dawes\' limit', also: ['Dawes limit'], def: 'The empirical resolution of a telescope for equal double stars, 116/D arcseconds with D in millimetres. It is slightly finer than Rayleigh\'s.' },
    { term: 'Abbe diffraction limit', also: ['Abbe limit', 'diffraction limit', 'λ/(2 NA)'], def: 'The smallest period, λ/(2 NA), that a microscope with numerical aperture NA can resolve, because it must collect at least two diffracted orders to form the image of a periodic structure.' },
    { term: 'Super-resolution', def: 'Any method that gets finer detail than the diffraction limit by methods other than a larger aperture, such as making molecules glow one at a time or shrinking the illumination spot.' },
    { term: 'Empty magnification', def: 'Magnification beyond what the instrument\'s resolution can use, which only enlarges the diffraction blur. For a microscope it starts above about 500 to 1000 times the numerical aperture.' }
  ],
  formulas: [
    {
      name: 'Rayleigh angular resolution',
      expr: 'th = 1.22*lambda/D', tex: '\\theta_R = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        th: { name: 'smallest resolvable angle', q: 'angle', unit: '″', tex: '\\theta_R' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'aperture diameter', q: 'length', unit: 'mm', value: 100 }
      },
      stories: { th: 'What is the Rayleigh limit of a telescope with a {D} aperture in {lambda} light?', D: 'What aperture is needed to resolve {th} in {lambda} light?' }
    },
    {
      name: 'Dawes\' limit for double stars',
      expr: 'th = 116/D', tex: '\\theta_D = \\frac{116}{D}',
      vars: {
        th: { name: 'smallest double star split (arcseconds)', q: false, unit: '″', tex: '\\theta_D' },
        D: { name: 'aperture diameter (in mm)', q: false, unit: 'mm', value: 100 }
      },
      note: 'An empirical rule for equal stars of moderate brightness, D in millimetres, result in arcseconds.',
      practice: { unknowns: ['th'] }
    },
    {
      name: 'Abbe limit of a microscope',
      expr: 'd = lambda/(2*NA)', tex: 'd = \\frac{\\lambda}{2\\,\\mathrm{NA}}',
      vars: {
        d: { name: 'smallest period resolved', q: 'length', unit: 'nm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      note: 'Oblique illumination; with illumination along the axis the period is λ/NA. The Rayleigh distance between two points is 0.61 λ/NA.',
      stories: { d: 'An objective of numerical aperture {NA} images with {lambda} light. What is the smallest period it can resolve?', NA: 'What numerical aperture is needed to resolve {d} periods in {lambda} light?' }
    }
  ],
  examples: [
    {
      title: 'Can a 100 mm telescope split a double star?',
      q: 'A double star has components 1.6″ apart. Can a 100 mm telescope, in green light, show them as two?',
      steps: [
        { text: 'The Rayleigh limit is', tex: '\\theta_R = 1.22\\,\\frac{550\\times10^{-9}}{0.1} = 6.7\\times10^{-6}\\ \\mathrm{rad} = 1.38″' },
        'The pair is 1.6″ apart, more than Rayleigh\'s 1.38″ (and Dawes\' 1.16″), so the discs are separated by a clear dip, to about half of the peak value, between them.'
      ],
      a: 'Yes, but only just: the pair is 1.16 times the Rayleigh limit. Steady air is needed; the atmosphere often blurs to 1–2″.'
    },
    {
      title: 'The limit of a light microscope',
      q: 'What is the smallest period a microscope can resolve with a 100×/1.4 oil objective in blue light of 450 nm?',
      steps: [
        { text: 'Abbe\'s formula gives', tex: 'd = \\frac{\\lambda}{2\\,\\mathrm{NA}} = \\frac{450\\ \\mathrm{nm}}{2.8} = 161\\ \\mathrm{nm}' },
        'In green light it would be 196 nm. In both cases the finest bacterial or cell-membrane structures (tens of nanometres) are unresolved.'
      ],
      a: 'About 160 nm: the practical floor for conventional light microscopy, which is why electron microscopes and super-resolution methods exist.'
    }
  ],
  quiz: [
    { q: 'Two equal stars are separated by exactly the Rayleigh angle. The brightness midway between them, compared with each peak, is about…', choices: ['74 %', '50 %', '100 %', '25 %'], a: 0, why: 'At the Rayleigh separation the peak of one star falls on the first zero of the other, and the sum of the two patterns at the midpoint is 73.5 % of the peak: a shallow but visible dip.' },
    { q: 'A telescope\'s aperture is doubled. Its diffraction-limited resolution…', choices: ['improves by a factor of 2', 'improves by a factor of 4', 'stays the same', 'gets worse'], a: 0, why: 'The limit is $1.22\\lambda/D$: twice the diameter, half the angle. Four times the light is collected as well, which helps with faint stars.' },
    { q: 'What numerical aperture resolves a period of 250 nm in 500 nm light, by the Abbe formula?', answer: 1, why: '$d = \\lambda/(2\\,\\mathrm{NA})$ gives $\\mathrm{NA} = 500/(2 \\times 250) = 1.0$. A dry objective cannot reach this; an immersion objective can.' },
    { q: 'Increasing the magnification of a microscope past a certain point always reveals finer detail.', a: false, why: 'Detail finer than the Abbe limit never enters the image. Beyond about 500 × NA, more magnification only enlarges the blur: empty magnification.' },
    { q: 'Which change would improve the diffraction-limited resolution of a camera lens at fixed focal length?', choices: ['A smaller f-number (a wider stop)', 'A larger f-number', 'More pixels on the same sensor', 'A longer exposure'], a: 0, why: 'The limit in the image is $1.22\\lambda N$. A wider stop lowers $N$. More pixels change the sampling, not the lens; the exposure time has no effect.' }
  ],
  applications: [
    'Astronomy: telescope apertures are chosen to reach a required angular resolution, and adaptive optics and interferometry are used to remove the atmosphere\'s share.',
    'Microscopy: objectives are specified by numerical aperture because it fixes the resolution; immersion oil raises it by raising the refractive index.',
    'Photolithography: the smallest printed line is about k₁ λ/NA, which is why chip makers moved to 193 nm light, immersion, and 13.5 nm extreme ultraviolet.',
    'Optical disc drives: the spot on the disc shrank from the CD (780 nm, NA 0.45) to the Blu-ray (405 nm, NA 0.85), raising the capacity more than thirty-fold.',
    'Eye care: the eye\'s own limit sets the 20/20 standard of one arcminute, close to the diffraction limit of a 3 mm pupil.'
  ],
  history: 'Lord Rayleigh stated his criterion in 1879 in a paper on the resolving power of spectroscopes and telescopes. Ernst Abbe worked out the theory of microscope imaging in 1873 and, with Carl Zeiss, used it to design objectives that reached the limit; his work made microscope design a science. William Rutter Dawes, a double-star observer, published his empirical limit in the 1860s. The 2014 Nobel Prize in Chemistry went to Eric Betzig, Stefan Hell and William Moerner for super-resolved fluorescence microscopy.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 (Diffraction), the section on resolution of imaging systems.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 — resolving power of optical instruments (Rayleigh and Sparrow criteria).',
    'W. J. Smith, *Modern Optical Engineering*, ch. 11 — diffraction-limited resolution.',
    'J. W. Goodman, *Introduction to Fourier Optics*, ch. 6 (Frequency analysis of optical imaging systems), for the cutoff frequency that underlies the Abbe limit.'
  ],
  sim: 'df-resolution'
},

/* ================================================================ the grating equation */
{
  id: 'the-grating-equation', parent: 'diffraction', title: 'Diffraction gratings and the grating equation', level: 2,
  short: 'A diffraction grating has hundreds to thousands of equally spaced slits or grooves per millimetre. Light leaves it only in a few sharp directions given by d(sin θm − sin θi) = mλ, each wavelength at its own angle, so white light is fanned into spectra. It is the basis of nearly every spectrometer.',
  keywords: ['diffraction grating', 'grating equation', 'grating', 'lines per millimetre', 'groove density', 'grating pitch', 'order', 'zeroth order', 'first order', 'spectrum', 'white light', 'd sin theta = m lambda', 'principal maxima', 'transmission grating', 'reflection grating', 'overlapping orders'],
  prereq: ['single-slit-diffraction', 'youngs-double-slit', 'constructive-and-destructive-interference'],
  related: ['grating-types-and-blaze', 'grating-spectrometers-and-resolving-power', 'dispersion-and-the-spectrum', 'prism-deviation', 'spectrometers-and-monochromators', 'diffraction-in-everyday-life', 'physics:diffraction-grating'],
  body: `
A **diffraction grating** is a surface carrying a great many equally spaced parallel slits or grooves, from a few hundred to several thousand to the millimetre. Light passing through it, or reflected from it, leaves in only a few sharp directions, and each colour takes its own. Send white light in and it fans out into spectra, which makes the grating the working part of almost every spectrometer.

### The equation
Let neighbouring slits be a distance $d$ apart (the **pitch**), the light arrive at an angle $\\theta_i$ from the normal and leave at $\\theta_m$. The path difference between light from neighbouring slits is $d(\\sin\\theta_m - \\sin\\theta_i)$. All the slits reinforce each other, and a bright line appears, only when that is a whole number of wavelengths:

$$d\\,(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda \\qquad m = 0, \\pm1, \\pm2, \\dots$$

At normal incidence this is $d\\sin\\theta_m = m\\lambda$. The integer $m$ is the **order**. The zero order ($m = 0$) goes straight on, undeviated and white; the first orders $\\pm1$ lie either side, then $\\pm2$, and so on until $|\\sin\\theta_m|$ would exceed 1. For a reflection grating the same equation holds with the diffracted angle counted on the incidence side of the normal; catalogues then write $d(\\sin\\alpha + \\sin\\beta) = m\\lambda$, which is the same law with a different sign convention.

Gratings are sold by **groove density** $g$ in lines per millimetre, and $d = 1/g$: 600 lines/mm is a pitch of 1.67 µm, 1200 lines/mm is 0.83 µm.

### Reading the equation
| Lines/mm | Pitch | 400 nm | 550 nm | 700 nm |
|---|---|---|---|---|
| 300 | 3.33 µm | 6.9° | 9.5° | 12.1° |
| 600 | 1.67 µm | 13.9° | 19.3° | 24.8° |
| 1200 | 0.83 µm | 28.7° | 41.3° | 57.1° |
| 1800 | 0.56 µm | 46.1° | 81.9° | none |

(First order, normal incidence; "none" means no first order exists for that colour.)
- **Red is deviated most.** The angle grows with the wavelength, the opposite of a prism, where blue is bent more ([[dispersion-and-the-spectrum]]). A grating spectrum is also nearly linear in wavelength.
- **Finer grating, larger angles.** Halving the pitch doubles $\\sin\\theta$.
- **How many orders.** At normal incidence about $2d/\\lambda$ orders exist: a 300 lines/mm grating in 633 nm light gives eleven (orders −5 to +5), a 1800 lines/mm one in green light only the zero order and the two first.
- **Overlap.** Order $m$ at wavelength $\\lambda$ falls where order $m+1$ would put $\\lambda\\,m/(m+1)$. In the visible, 400–700 nm, the first order is clean, but the third-order blue lies inside the second-order spectrum.

### Why the lines are sharp
With $N$ slits lit, the bright directions stay where the equation puts them, but each narrows to an angular half-width of about $\\lambda/(N d\\cos\\theta)$ and its peak intensity rises as $N^2$. Between neighbouring bright orders there are $N - 2$ faint secondary maxima, too weak to see. Two slits make the broad fringes of Young; a thousand make lines a thousand times sharper, and that sharpness is what lets a grating separate close wavelengths ([[grating-spectrometers-and-resolving-power]]). Each slit's own [[single-slit-diffraction|single-slit pattern]] forms an envelope that sets how the orders' brightness fades with angle.

A grating splits the light among several orders, and only one is wanted; a **blazed** grating concentrates it there ([[grating-types-and-blaze]]).

> [!key] $d(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$: every wavelength has its own direction in every order, red farther out than blue. Many slits make the orders sharp; finer pitch makes them farther apart.
`,
  ideas: [
    'Bright orders occur where d(sin θm − sin θi) = mλ: the path difference between neighbouring slits is a whole number of wavelengths.',
    'Groove density g (lines/mm) and pitch d = 1/g: 600 lines/mm is 1.67 µm; the finer the grating the larger the angles.',
    'The zero order is undeviated and white; each higher order is a spectrum with red farthest from the centre.',
    'Orders overlap: wavelength λ in order m coincides with λ/2 in order 2m, so the visible first order is clean but higher orders overlap.',
    'With N slits lit each order is N times narrower than with one slit (width ≈ λ/(N d cos θ)) and N² brighter.'
  ],
  pitfalls: [
    'A grating spectrum bends blue most, like a prism — The reverse: in a grating the angle grows with wavelength, so red is deviated most. A prism bends blue most.',
    'The first order is the zero order, since m = 1 means the first spectrum — The zero order (m = 0) is the undeviated, white beam; the first order is the first spectrum on either side.',
    'More lines per millimetre always gives a better spectrum — Finer pitch spreads the colours more, but a very fine grating has no orders at all for long wavelengths (λ must be less than about 2d), and its efficiency drops.',
    'The grating equation tells how bright each order is — It gives only directions. How the light divides among the orders depends on the groove shape and the single-slit envelope; see [[grating-types-and-blaze]].'
  ],
  terms: [
    { term: 'Diffraction grating', also: ['grating'], def: 'A surface with a large number of equally spaced parallel slits or grooves that diffracts light into a few sharp orders, each wavelength at its own angle.' },
    { term: 'Grating equation', also: ['d sin θ = mλ'], def: 'd(sin θm − sin θi) = mλ: the condition for the light from neighbouring grooves, spaced d apart, to arrive in step. θi and θm are measured from the normal, m is an integer.' },
    { term: 'Groove density', also: ['lines per millimetre', 'lines/mm', 'g/mm', 'ruling density'], def: 'The number of grooves or slits per millimetre of a grating. The pitch is its inverse: 600 lines/mm is 1.67 µm.' },
    { term: 'Diffraction order', also: ['order', 'spectral order'], def: 'The integer m of the grating equation. Order 0 is the undeviated beam; orders ±1, ±2 … are the spectra on either side, each farther from the centre.' },
    { term: 'Grating pitch', also: ['grating period', 'groove spacing', 'd'], def: 'The distance d between neighbouring slits or grooves; the reciprocal of the groove density.' },
    { term: 'Order overlap', def: 'The coincidence of different wavelengths in different orders at the same angle (λ in order m and λ/2 in order 2m). It limits the useful wavelength range of a grating to about one octave per order.' }
  ],
  formulas: [
    {
      name: 'The grating equation',
      expr: 'd*(sin(tm) - sin(ti)) = m*lambda', tex: 'd\\,(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda',
      vars: {
        d: { name: 'grating pitch', q: 'length', unit: 'µm', value: 1.667 },
        tm: { name: 'angle of the diffracted order', q: 'angle', unit: '°', signed: true, value: 19.3, min: -90, max: 90, tex: '\\theta_m' },
        ti: { name: 'angle of incidence', q: 'angle', unit: '°', signed: true, value: 0, min: -90, max: 90, tex: '\\theta_i' },
        m: { name: 'order', value: 1, int: true, signed: true, min: -10, max: 10 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'tm',
      note: 'Angles from the normal, on the same side. If the solution does not exist, that order is absent: |sin θm| cannot exceed 1.',
      stories: { tm: 'Light of {lambda} meets a grating of pitch {d} at {ti} from the normal. At what angle does order {m} leave?', lambda: 'A grating of pitch {d} shows a spectral line in order {m} at {tm}, the light arriving at {ti}. What is its wavelength?', d: 'Light of {lambda} in order {m} leaves at {tm} when it arrives at {ti}. What is the grating pitch?' }
    },
    {
      name: 'Pitch from the groove density',
      expr: 'd = 1/g', tex: 'd = \\frac{1}{g}',
      vars: {
        d: { name: 'grating pitch', q: 'length', unit: 'µm' },
        g: { name: 'groove density', q: 'wavenumber', unit: 'lines/mm', value: 600 }
      },
      stories: { d: 'A grating has {g}. What is its pitch?', g: 'A grating has a pitch of {d}. How many lines per millimetre does it have?' }
    },
    {
      name: 'Angular half-width of an order',
      expr: 'dth = lambda/(N*d*cos(tm))', tex: '\\Delta\\theta = \\frac{\\lambda}{N\\,d\\cos\\theta_m}',
      vars: {
        dth: { name: 'angle from the peak to the first zero', q: 'angle', unit: 'mrad', tex: '\\Delta\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'number of lines lit', value: 1000, int: true, min: 1, max: 1000000 },
        d: { name: 'grating pitch', q: 'length', unit: 'µm', value: 1.667 },
        tm: { name: 'angle of the order', q: 'angle', unit: '°', value: 19.3, min: 0, max: 85, tex: '\\theta_m' }
      },
      note: 'The more lines are lit, the sharper each line: this is where the resolving power comes from.',
      stories: { dth: 'A grating of pitch {d} has {N} lines lit by {lambda} light, observed at {tm}. How far is the first zero from the peak of the line?' }
    }
  ],
  examples: [
    {
      title: 'A green pointer and a grating slide',
      q: 'A 532 nm laser pointer shines through a grating of 600 lines/mm at normal incidence. Where do the first-order spots fall on a wall 2.0 m away?',
      steps: [
        'The pitch is $d = 1/600$ mm $= 1.667$ µm. The first order is at $\\sin\\theta = \\lambda/d = 0.532/1.667 = 0.319$, so $\\theta = 18.6°$.',
        { text: 'On the wall, measured from the central spot,', tex: 'x = L\\tan\\theta = 2.0 \\times 0.3367 = 0.67\\ \\mathrm{m}' },
        'The second order has $\\sin\\theta = 0.638$, $\\theta = 39.6°$: 1.66 m from the centre.'
      ],
      a: 'Spots at ±0.67 m (first order) and ±1.66 m (second), with the bright zero-order spot in the middle.'
    },
    {
      title: 'Reading a wavelength',
      q: 'With a 600 lines/mm grating a spectral line is seen in first order at 19.3° from the central image, light arriving at normal incidence. What is its wavelength?',
      steps: [
        { text: 'Solve the grating equation for the wavelength:', tex: '\\lambda = d\\sin\\theta = 1.667\\ \\mu\\mathrm{m} \\times \\sin 19.3° = 1.667 \\times 0.3305' },
        'That is 0.551 µm.'
      ],
      a: '551 nm, a green line (mercury\'s strongest visible line, for instance, is at 546 nm).'
    }
  ],
  quiz: [
    { q: 'In first order, which colour of a white-light spectrum is deviated most by a grating?', choices: ['Red', 'Violet', 'Green', 'All equally'], a: 0, why: '$\\sin\\theta = \\lambda/d$ grows with the wavelength. Red is deviated most, the opposite of a prism.' },
    { q: 'A grating has 500 lines/mm and is lit at normal incidence by 500 nm light. At what angle is the second order?', answer: 30, unit: '°', why: '$d = 2$ µm. $\\sin\\theta = 2\\lambda/d = 2 \\times 0.5/2 = 0.5$, so $\\theta = 30°$.' },
    { q: 'A grating of 3000 lines/mm is lit by 700 nm light at normal incidence. How many diffracted orders besides the zero order exist?', choices: ['None', 'Two (±1)', 'Four', 'Six'], a: 0, why: '$d = 0.333$ µm, $\\lambda/d = 2.1 > 1$: no first order exists. Only the undeviated beam emerges.' },
    { q: 'Doubling the number of lit slits of a grating, at the same pitch, moves the principal bright directions.', a: false, why: 'The directions follow $d(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$ and do not depend on $N$. More slits only narrow each order (by $1/N$) and brighten it (by $N^2$).' },
    { q: 'At the same angle, light of 700 nm in order 1 coincides with light of what wavelength in order 2?', answer: 350, unit: 'nm', why: 'At a fixed angle $m\\lambda = d(\\sin\\theta_m - \\sin\\theta_i)$ is fixed: $1 \\times 700 = 2 \\times 350$. This is order overlap, and the reason spectrometers use order-sorting filters.' }
  ],
  applications: [
    'Spectrometers and monochromators of every kind, from the student spectroscope to the Raman and astronomical instrument: the grating turns wavelength into angle.',
    'Laser beam combining and wavelength-division multiplexing in optical fibre networks, where gratings sort or merge colours.',
    'Pulse compression in ultrafast lasers, where a pair of gratings undoes the stretching of a short pulse.',
    'Position encoders and optical rulers: a fine grating moved past a second one makes moiré fringes that are counted to give position to a fraction of the pitch.',
    'Anything with a regular fine structure that shows colours: a compact disc, a dragonfly\'s wing, a vinyl record or a piece of fabric.'
  ],
  history: 'David Rittenhouse in Philadelphia made a coarse grating of fine wires as early as 1785. Joseph von Fraunhofer built finer ones from 1821 and used them to measure the wavelengths of the dark lines in sunlight. Henry Rowland at Johns Hopkins built ruling engines in the 1880s that made gratings of unprecedented size and accuracy and replaced the prism in spectroscopy.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 (Diffraction), the sections on multiple-slit diffraction and the diffraction grating.',
    'C. Palmer, *Diffraction Grating Handbook* (the handbook of a leading maker, freely available) — the grating equation and its sign conventions.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, the chapter on diffraction gratings — orders, dispersion and resolving power.',
    'E. G. Loewen and E. Popov, *Diffraction Gratings and Applications* — the standard monograph on grating types and efficiency.'
  ],
  sim: ['df-grating', 'df-nslits']
},

/* ================================================================ grating types and blaze */
{
  id: 'grating-types-and-blaze', parent: 'diffraction', title: 'Grating types and blaze', level: 3,
  short: 'Gratings are ruled or holographic, transmitting or reflecting, flat or curved, coarse or fine. A blazed grating tilts each groove so that the light goes into one chosen order instead of being shared among many: the blaze wavelength is where it is brightest, 2d sin θB = mλB in the Littrow arrangement.',
  keywords: ['blaze', 'blazed grating', 'blaze angle', 'blaze wavelength', 'Littrow', 'echelle', 'ruled grating', 'holographic grating', 'VPH', 'volume phase', 'replica grating', 'grating efficiency', 'ghost', 'sawtooth', 'groove profile', 'transmission grating', 'reflection grating', 'grism'],
  prereq: ['the-grating-equation', 'single-slit-diffraction', 'law-of-reflection'],
  related: ['grating-spectrometers-and-resolving-power', 'diffractive-optical-elements', 'holographic-optical-elements', 'polarization-states', 'metal-mirror-coatings', 'holography', 'spectrometers-and-monochromators'],
  body: `
A grating of plain slits sends much of its light into the useless zero order and splits the rest among many orders. The engineer pushes the light into the one order and colour range wanted by shaping the groove.

### Blaze: tilting the groove
Cut the grooves as a row of tiny sawteeth. Each facet is a small mirror, tilted by the **blaze angle** $\\theta_B$ to the grating surface. The light leaving each facet goes mainly in the direction of its own mirror reflection, and the grating equation fixes the orders. Where the facets' mirror direction lies on an order, that order takes nearly all the light. In the Littrow arrangement the light returns along the path it came in on, and the condition is

$$m\\lambda_B = 2\\,d\\,\\sin\\theta_B$$

where $\\lambda_B$ is the **blaze wavelength**. A catalogue entry "600 lines/mm, 500 nm blaze" has $\\theta_B = \\arcsin(500\\,\\mathrm{nm}/(2 \\times 1667\\,\\mathrm{nm})) = 8.6°$; a 1200 lines/mm one with the same blaze is at 17.5°. Efficiency peaks at $\\lambda_B$ and falls off on either side: in a simple scalar estimate to about half the peak near $0.7\\,\\lambda_B$ and $1.7\\,\\lambda_B$ in the first order. Real curves are narrower and differ between polarizations.

### Types of grating
| Type | How it is made | Character |
|---|---|---|
| **Ruled** | a diamond cuts grooves in a metal film on glass | blazed sawtooth grooves; 70–90 % efficient at the blaze; some ghosts and stray light |
| **Holographic** | laser fringes exposed in photoresist, developed, metal-coated | sinusoidal (or ion-etched blazed) grooves; little stray light, no ghosts; over 3000 lines/mm; curved surfaces possible |
| **Replica** | an epoxy copy of a master | nearly all catalogue gratings; as good as the master |
| **Volume phase (VPH)** | index modulation inside gelatin between glass plates | over 80 % at the Bragg angle in a chosen band; astronomical spectrographs |
| **Echelle** | coarse steep grooves (31–79 lines/mm, facets 63°–76°), orders 10–100 or more | very high resolving power; orders overlap |

Reflection gratings are the commonest, being easy to blaze. Transmission gratings suit in-line layouts, as in a **grism** (a grating on a prism that passes one wavelength straight on); concave gratings focus as well as disperse.

### Which groove density for which band
| Lines/mm | Pitch | Typical use |
|---|---|---|
| 31–79 (echelle) | 32–13 µm | very high resolution; orders 40–100 at 550 nm |
| 150–300 | 6.7–3.3 µm | infrared, 1–5 µm; wide wavelength range |
| 600 | 1.67 µm | all-round visible and near infrared |
| 1200 | 0.83 µm | visible; higher dispersion |
| 1800–2400 | 0.56–0.42 µm | blue and near ultraviolet, high resolution |
| 3600 | 0.28 µm | ultraviolet; no order above about 550 nm |

### Details that decide a purchase
- **Efficiency** is quoted as *absolute* (of the light incident on the grating) or *relative* (to a mirror with the same coating): never compare one kind with the other.
- **Polarization.** When the pitch approaches the wavelength the two polarizations diffract differently, with sharp changes (Wood's anomalies) where an order grazes the surface.
- **Ghosts** are false weak lines from periodic ruling errors; **stray light** comes from random groove errors. Holographic gratings have little of either.
- **Order overlap** limits a blazed grating to about an octave; filters block the other orders ([[grating-spectrometers-and-resolving-power]]).

> [!key] A blazed grating tilts each groove so that its mirror direction falls on the wanted order; $m\\lambda_B = 2d\\sin\\theta_B$ in the Littrow arrangement. Ruled and holographic gratings differ in groove shape, stray light and cost, but follow the same grating equation.
`,
  ideas: [
    'A blazed grating has sawtooth grooves whose tilt θB sends the mirror reflection from each facet into one chosen order.',
    'Littrow: the diffracted light returns along the incoming beam, and mλB = 2d sin θB.',
    'Efficiency peaks at the blaze wavelength; a first-order blaze works well from about 0.7 λB to 1.7 λB, in a scalar estimate.',
    'Ruled gratings have blazed grooves and some ghosts; holographic gratings are made from laser fringes and have little stray light; replicas copy a master; VPH gratings work by index modulation at the Bragg angle.',
    'An echelle is a coarse, steep grating used at high order (tens to hundreds) for very high resolving power, with a second dispersing element to separate the overlapping orders.'
  ],
  pitfalls: [
    'The blaze wavelength is the only colour the grating works at — The blaze wavelength is just where the efficiency peaks. A grating blazed at 500 nm still works usefully from about 350 to 850 nm in first order.',
    'A grating with higher groove density always has a higher efficiency — Efficiency depends on the groove shape and on how well the blaze matches the wavelength and the geometry, not on the density.',
    'Ruled and holographic gratings differ in what colours they diffract — They obey the same grating equation. They differ in groove profile and quality: ghosts, stray light, and the shapes they can be made on.',
    'Transmission gratings are the commonest — Reflection gratings are, because they are easy to blaze and to make efficient from the ultraviolet to the infrared.'
  ],
  terms: [
    { term: 'Blazed grating', def: 'A grating whose grooves are small tilted mirror facets, so that most of the light goes into one chosen order instead of being spread among several.' },
    { term: 'Blaze angle', also: ['θB', 'facet angle'], def: 'The angle between the groove facet and the plane of the grating. It sets, with the pitch, the blaze wavelength.' },
    { term: 'Blaze wavelength', also: ['λB', 'peak efficiency wavelength'], def: 'The wavelength at which a blazed grating is most efficient in the stated order, usually quoted for the Littrow arrangement.' },
    { term: 'Littrow configuration', also: ['Littrow mount', 'Littrow angle', 'autocollimation'], def: 'An arrangement in which the diffracted order returns along the incident beam; then mλ = 2d sin θ. Used for blaze specifications and in tunable laser cavities.' },
    { term: 'Echelle grating', also: ['echelle'], def: 'A coarse grating (typically 31–79 lines/mm) with steep facets, used at orders of tens to hundreds for very high resolving power. Its overlapping orders are separated by a second dispersing element.' },
    { term: 'Holographic grating', def: 'A grating made by recording laser interference fringes in photoresist, which are then developed and coated. It has little stray light and no ghosts, and can be made on curved surfaces.' },
    { term: 'VPH grating', also: ['volume phase holographic grating', 'volume Bragg grating'], def: 'A grating in which the refractive index varies periodically inside a thin layer, usually dichromated gelatin between glass plates. It is efficient at the Bragg angle in a chosen wavelength band.' }
  ],
  formulas: [
    {
      name: 'Blaze condition (Littrow)',
      expr: 'm*lB = 2*d*sin(tB)', tex: 'm\\,\\lambda_B = 2\\,d\\,\\sin\\theta_B',
      vars: {
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 },
        lB: { name: 'blaze wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda_B' },
        d: { name: 'grating pitch', q: 'length', unit: 'µm', value: 1.667 },
        tB: { name: 'blaze angle', q: 'angle', unit: '°', value: 8.63, min: 0, max: 85, tex: '\\theta_B' }
      },
      solveFor: 'tB',
      note: 'The ideal Littrow case; blaze angles of ruled gratings are given in degrees (8.6° for 600 lines/mm at 500 nm).',
      stories: { tB: 'A grating of pitch {d} is to be blazed at {lB} in order {m}. What blaze angle does it need?', lB: 'A grating of pitch {d} has a blaze angle of {tB}. At what wavelength is it blazed in order {m}?' }
    },
    {
      name: 'Blaze angle from lines per millimetre',
      expr: 'sin(tB) = m*lB*g/2', tex: '\\sin\\theta_B = \\frac{m\\,\\lambda_B\\,g}{2}',
      vars: {
        tB: { name: 'blaze angle', q: 'angle', unit: '°', min: 0, max: 85, tex: '\\theta_B' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 },
        lB: { name: 'blaze wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda_B' },
        g: { name: 'groove density', q: 'wavenumber', unit: 'lines/mm', value: 1200 }
      },
      stories: { tB: 'A {g} grating is to be blazed for {lB} in order {m}. What facet angle does the ruling need?' }
    },
    {
      name: 'Longest wavelength usable in Littrow',
      expr: 'lmax = 2*d/m', tex: '\\lambda_{\\max} = \\frac{2d}{m}',
      vars: {
        lmax: { name: 'longest wavelength with a Littrow order', q: 'length', unit: 'nm', tex: '\\lambda_{\\max}' },
        d: { name: 'grating pitch', q: 'length', unit: 'µm', value: 0.278 },
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 }
      },
      note: 'Beyond it sin θB would exceed 1: a 3600 lines/mm grating cannot return light longer than 556 nm in first order.'
    }
  ],
  examples: [
    {
      title: 'Specifying a blaze',
      q: 'A spectrometer maker wants a grating of 1200 lines/mm blazed at 500 nm in first order. What groove angle must the ruling have?',
      steps: [
        'The pitch is $d = 1/1200$ mm $= 833$ nm.',
        { text: 'The blaze condition gives', tex: '\\sin\\theta_B = \\frac{m\\lambda_B}{2d} = \\frac{500}{2 \\times 833} = 0.300 \\quad\\Rightarrow\\quad \\theta_B = 17.5°' }
      ],
      a: '17.5° (17°28′). Each facet is a small mirror tilted 17.5° to the surface.'
    },
    {
      title: 'An echelle at work',
      q: 'An echelle of 79 lines/mm has a blaze angle of 63.4°. At what order does it work for 550 nm light in the Littrow arrangement, and what is the pitch?',
      steps: [
        'The pitch is $d = 1/79$ mm $= 12.66$ µm.',
        { text: 'The order is', tex: 'm = \\frac{2d\\sin\\theta_B}{\\lambda} = \\frac{2 \\times 12.66 \\times 0.8945}{0.55} = 41.2' }
      ],
      a: 'Order 41 (and its neighbours 40, 42, … in neighbouring bands). A single order spans only about λ/m = 13 nm, so a cross-disperser must spread the overlapping orders sideways.'
    }
  ],
  quiz: [
    { q: 'Why is a blazed grating brighter in one order than a plain slit grating?', choices: ['Its tilted facets reflect light mainly in the direction of the wanted order', 'It has more grooves per millimetre', 'It absorbs the unwanted orders', 'It uses a different wavelength'], a: 0, why: 'Each facet is a tiny mirror; the light it reflects goes mostly into the order that lies nearest to its mirror direction. The grating equation is unchanged, the distribution of light among the orders is not.' },
    { q: 'What blaze angle does a 600 lines/mm grating need to peak at 500 nm in first order (Littrow)?', answer: 8.63, unit: '°', why: '$d = 1667$ nm; $\\sin\\theta_B = 500/(2 \\times 1667) = 0.15$, so $\\theta_B = 8.63°$ (8°38′).' },
    { q: 'Holographic gratings are made by ruling grooves with a diamond.', a: false, why: 'Holographic gratings are made from the interference pattern of two laser beams, recorded in photoresist, not by cutting. That is why they have no periodic ruling errors, and so no ghosts.' },
    { q: 'An echelle grating works in very high order. Compared with an ordinary grating of the same size it has…', choices: ['much higher resolving power but heavily overlapping orders', 'lower resolving power but no overlap', 'the same resolving power', 'no orders'], a: 0, why: 'Resolving power is $mN$; with $m$ in the tens or hundreds, $R$ is huge. The price is a free spectral range $\\lambda/m$ of only a few nanometres, so orders overlap and must be separated by a cross-disperser.' },
    { q: 'A grating blazed for 500 nm in first order is used at 1000 nm in the same order. Compared with its peak, the efficiency is…', choices: ['markedly lower, about a third to a half', 'unchanged', 'zero', 'doubled'], a: 0, why: 'Efficiency peaks at the blaze wavelength and falls on both sides. At twice the blaze wavelength the scalar estimate is about 0.37 of the peak; real gratings vary but are lower, not higher, there.' }
  ],
  applications: [
    'Spectrometers and monochromators: a reflection grating blazed for the middle of the working band, often with a second or third grating for other bands on a turret.',
    'Astronomical spectrographs: VPH gratings and echelles, because telescope light is precious and a high efficiency is worth a lot.',
    'Tunable lasers: a Littrow grating at one end of a diode-laser cavity selects the wavelength.',
    'Pulse compression gratings in ultrafast lasers, with high efficiency to survive repeated passes.',
    'Optical-fibre networks: transmission and reflection gratings combine and separate wavelength channels.'
  ],
  history: 'Rowland\'s ruling engines at Johns Hopkins (1880s) made large, accurate gratings with good shape control; he also invented the concave grating. R. W. Wood, around 1910, learned to rule grooves with a chosen tilt (his *echelette* gratings) to throw light into a single order. The echelle, a coarse, steep grating at high order, was devised by G. R. Harrison at MIT in 1949, and holographic gratings followed with the laser in the 1960s.',
  sources: [
    'C. Palmer, *Diffraction Grating Handbook* — blaze, efficiency, polarization, ghosts and the types of grating, from a leading maker.',
    'E. G. Loewen and E. Popov, *Diffraction Gratings and Applications* — ruled and holographic gratings, efficiency theory.',
    'J. M. Lerner and A. Thevenon, *The Optics of Spectroscopy* — a tutorial on groove shapes, blaze and efficiency.'
  ],
  sim: 'df-blaze'
},

/* ================================================================ spectrometers */
{
  id: 'grating-spectrometers-and-resolving-power', parent: 'diffraction', title: 'Gratings in spectrometers: dispersion and resolving power', level: 3,
  short: 'A grating spectrometer turns wavelength into position. The angular dispersion m/(d cos θ) says how far apart colours land; the resolving power R = λ/Δλ = mN says how close two lines may be and still be told apart. The free spectral range λ/m says how wide a band one order can hold before orders overlap.',
  keywords: ['resolving power', 'angular dispersion', 'linear dispersion', 'reciprocal linear dispersion', 'free spectral range', 'order sorting filter', 'sodium doublet', 'D lines', 'spectral resolution', 'bandpass', 'spectrometer', 'monochromator', 'Czerny-Turner', 'slit width', 'R = mN', 'lambda over delta lambda'],
  prereq: ['the-grating-equation', 'grating-types-and-blaze', 'resolution-limits'],
  related: ['spectrometers-and-monochromators', 'spectrophotometers', 'spectroscopy-in-industry', 'dispersion-and-the-spectrum', 'fabry-perot-interferometer', 'chemistry:atomic-spectra', 'physics:diffraction-grating'],
  body: `
A grating spectrometer shines light on a slit, makes it parallel with a mirror or lens, sends it onto a grating, and focuses each colour onto its own place of a detector. Two numbers say how good it is: how far apart it puts two colours (dispersion) and how close two spectral lines can be before they merge (resolving power).

### Dispersion
Differentiating the grating equation gives the **angular dispersion**, the change of angle with wavelength:

$$\\frac{d\\theta}{d\\lambda} = \\frac{m}{d\\,\\cos\\theta_m}$$

A 1200 lines/mm grating at 550 nm, first order, normal incidence ($\\theta = 41.3°$) has $d\\theta/d\\lambda = 1.6\\times10^{-3}$ rad/nm. A camera mirror of focal length $f$ turns that into a **linear dispersion** $dx/d\\lambda = f\\,d\\theta/d\\lambda$: with $f = 300$ mm, 0.48 mm of detector per nanometre. Spectroscopists quote its inverse, the **reciprocal linear dispersion**, here 2.1 nm/mm; a 10 µm entrance slit then passes a band 0.02 nm wide, and a 100 µm one 0.2 nm. Dispersion alone is not resolution: it says how far apart colours land, not how sharp each line is.

### Resolving power
The width of a line from a grating with $N$ lit lines is set by diffraction: its first zero lies at $\\Delta\\theta = \\lambda/(N d\\cos\\theta)$. By the Rayleigh idea, two lines are resolved when one's peak falls on the other's first zero, so the smallest wavelength difference is

$$\\Delta\\lambda = \\frac{\\lambda}{mN} \\qquad R = \\frac{\\lambda}{\\Delta\\lambda} = mN$$

The **resolving power** $R$ is the order times the number of lit lines, and it depends on nothing else: not the groove density alone (a coarse grating with the same $N$, in the same order, is no worse) but the total number of grooves the beam covers. $R$ is also at most $2W/\\lambda$ for a lit width $W$.

| Spectrometer | Typical $R$ | $\\Delta\\lambda$ at 550 nm |
|---|---|---|
| Compact array spectrometer | 500–2000 | 0.3–1 nm |
| Student spectroscope | 200–1000 | about 1 nm |
| Laboratory monochromator, 0.3 m | 5000–20000 | 0.03–0.1 nm |
| 1200 lines/mm, 50 mm lit, first order | 60000 | 9 pm |
| Echelle spectrograph | $10^5$ and more | under 5 pm |

### The sodium doublet
The yellow light of a sodium flame is two lines, 588.995 and 589.592 nm, 0.597 nm apart. The resolving power needed is $589.3/0.597 = 987$, about 1000. A 1200 lines/mm grating in first order does it with $N = 987$, only **0.82 mm** of its width lit; a 600 lines/mm one needs 1.6 mm. The pair is the classic test of a spectrometer: a slit that is too wide merges it first.

### Free spectral range and order sorting
Because orders overlap, a grating used in order $m$ can hold a band of only $\\lambda/m$ wide before the next order's light falls on top of it. This is the **free spectral range**. Scanning a spectrometer from 800 to 1600 nm in first order, the second order of 400–800 nm arrives at the same angles; an **order-sorting filter**, a long-pass filter with its edge near 750 nm, removes it. Likewise a scan of 400–800 nm must be shielded from the second order of the ultraviolet at 200–400 nm by a filter with its edge near 380 nm.

### What really limits the instrument
The ideal $R = mN$ is rarely reached: the entrance slit adds its own image width, mirror aberrations blur the lines and the detector's pixels sample them. A good design makes these about equal.

> [!key] A grating spreads colours by $d\\theta/d\\lambda = m/(d\\cos\\theta)$ and separates lines down to $\\Delta\\lambda = \\lambda/(mN)$. The sodium doublet needs $R \\approx 1000$; a free spectral range of $\\lambda/m$ limits the band per order.
`,
  ideas: [
    'Angular dispersion dθ/dλ = m/(d cos θ): a finer pitch or a higher order spreads colours more.',
    'The resolving power R = λ/Δλ = mN depends on the order and on the number of grooves lit, not on the pitch alone.',
    'Two lines are resolved when one falls on the first zero of the other: Δλ = λ/(mN).',
    'The free spectral range λ/m is the widest band one order can hold; an order-sorting filter removes the overlapping order.',
    'A real spectrometer is limited by its slit, its optics and its detector as much as by R = mN.'
  ],
  pitfalls: [
    'A finer grating has a larger resolving power — R = mN counts lit grooves times order. A finer pitch spreads colours more (dispersion) but gives the same R if N·m is the same; a wide beam on a coarse grating can beat a narrow one on a fine grating.',
    'Dispersion and resolution are the same thing — Dispersion is how far apart two colours land; resolution is whether the lines are sharp enough to be told apart. A big spectrograph with a wide slit has high dispersion and poor resolution.',
    'A wider entrance slit gives a brighter, equally sharp spectrum — The slit image adds to the line width: beyond a certain width the resolution falls in proportion to the slit width, in exchange for light.',
    'A grating spectrometer measures all wavelengths without ambiguity — Because orders overlap, light of λ in order 1 and λ/2 in order 2 land together. An order-sorting filter is needed.'
  ],
  terms: [
    { term: 'Angular dispersion', also: ['dθ/dλ'], def: 'The rate at which the diffraction angle changes with wavelength, dθ/dλ = m/(d cos θ), in radians (or degrees) per nanometre.' },
    { term: 'Linear dispersion', also: ['reciprocal linear dispersion', 'plate factor'], def: 'The distance on the detector per unit wavelength, f·dθ/dλ (mm/nm). Its inverse, in nm/mm, is the reciprocal linear dispersion quoted on spectrometer data sheets.' },
    { term: 'Resolving power', also: ['R', 'spectral resolving power', 'λ/Δλ'], def: 'The ratio λ/Δλ of a wavelength to the smallest difference that can just be resolved. For a grating it is mN, the order times the number of lines lit.' },
    { term: 'Free spectral range', also: ['FSR'], def: 'The width of the band, about λ/m, that can be used in order m before the neighbouring order overlaps it.' },
    { term: 'Order-sorting filter', also: ['blocking filter', 'long-pass order sorter'], def: 'A filter that removes the wavelengths whose higher orders would land on top of the wanted ones, such as UV light overlapping visible light in second order.' },
    { term: 'Spectral bandpass', also: ['spectral bandwidth', 'resolution bandwidth'], def: 'The width of wavelengths passed by a monochromator\'s exit slit: the slit width times the reciprocal linear dispersion.' },
    { term: 'Czerny–Turner', def: 'The most common spectrometer layout: an entrance slit at the focus of one concave mirror, a plane grating, and a second concave mirror that focuses the spectrum onto the detector or exit slit.' }
  ],
  formulas: [
    {
      name: 'Resolving power of a grating',
      expr: 'R = m*N', tex: 'R = m\\,N',
      vars: {
        R: { name: 'resolving power' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 },
        N: { name: 'number of lines lit', value: 987, int: true, min: 1, max: 10000000 }
      },
      stories: { R: 'A beam covers {N} lines of a grating used in order {m}. What is its resolving power?', N: 'A spectrometer in order {m} needs a resolving power of {R}. How many lines must be lit?' }
    },
    {
      name: 'Smallest resolvable wavelength difference',
      expr: 'dlam = lambda/(m*N)', tex: '\\Delta\\lambda = \\frac{\\lambda}{m\\,N}',
      vars: {
        dlam: { name: 'smallest resolvable difference', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 589.3, tex: '\\lambda' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 },
        N: { name: 'number of lines lit', value: 1000, int: true, min: 1, max: 10000000 }
      },
      stories: { dlam: 'A grating spectrometer lights {N} lines in order {m}. At {lambda}, what is the smallest difference it can resolve?', N: 'To resolve {dlam} at {lambda} in order {m}, how many lines must be lit?' }
    },
    {
      name: 'Separation of two lines on the detector',
      expr: 'dx = f*m*dlam/(d*cos(tm))', tex: '\\Delta x = \\frac{f\\,m\\,\\Delta\\lambda}{d\\cos\\theta_m}',
      vars: {
        dx: { name: 'distance between the lines', q: 'length', unit: 'mm', tex: '\\Delta x' },
        f: { name: 'focal length of the camera mirror', q: 'length', unit: 'mm', value: 300 },
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 },
        dlam: { name: 'wavelength difference', q: 'length', unit: 'nm', value: 0.597, tex: '\\Delta\\lambda' },
        d: { name: 'grating pitch', q: 'length', unit: 'µm', value: 0.833 },
        tm: { name: 'angle of the diffracted order', q: 'angle', unit: '°', value: 41.3, min: 0, max: 85, tex: '\\theta_m' }
      },
      note: 'Linear dispersion times the wavelength difference. Divide by the pixel size to get pixels apart.',
      stories: { dx: 'A spectrograph has a {f} camera and a grating of pitch {d} used in order {m} at {tm}. How far apart on the detector are two lines {dlam} apart?' }
    },
    {
      name: 'Free spectral range',
      expr: 'FSR = lambda/m', tex: '\\mathrm{FSR} = \\frac{\\lambda}{m}',
      vars: {
        FSR: { name: 'free spectral range', q: 'length', unit: 'nm', tex: '\\mathrm{FSR}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 200 }
      },
      note: 'λ is the short end of the band: the band from λ to λ(1 + 1/m) is free of overlap.',
      stories: { FSR: 'A grating is used in order {m} at {lambda}. How wide a band can one order hold before the next order overlaps it?' }
    }
  ],
  examples: [
    {
      title: 'Splitting the sodium doublet',
      q: 'What groove density and lit width does a grating need, in first order, to resolve the sodium D lines (588.995 nm and 589.592 nm)?',
      steps: [
        'The difference is $\\Delta\\lambda = 0.597$ nm at a mean of 589.29 nm, so $R = 589.29/0.597 = 987$.',
        { text: 'In first order $N = R = 987$ lines. With 600 lines/mm that is', tex: 'W = \\frac{987}{600\\ \\mathrm{mm}^{-1}} = 1.6\\ \\mathrm{mm}' },
        'A beam only 1.6 mm wide on the grating suffices; a 1200 lines/mm grating needs only 0.82 mm. In practice the slit and the pixel size, not the grating, decide whether the lines are seen separately.'
      ],
      a: 'Any grating that covers about a thousand lines in first order will do: 0.8 mm at 1200 lines/mm.'
    },
    {
      title: 'Bandpass from a slit',
      q: 'A monochromator with a 300 mm camera mirror uses a 1200 lines/mm grating in first order at 550 nm ($\\theta = 41.3°$). What bandpass does a 50 µm exit slit give?',
      steps: [
        { text: 'Angular dispersion:', tex: '\\frac{d\\theta}{d\\lambda} = \\frac{1}{0.833\\ \\mu\\mathrm{m}\\times\\cos 41.3°} = 1.6\\times10^{-3}\\ \\mathrm{rad/nm}' },
        'Linear dispersion: $300$ mm $\\times\\ 1.6\\times10^{-3} = 0.48$ mm/nm, so the reciprocal is 2.08 nm/mm.',
        { text: 'The bandpass is the slit width times that:', tex: '\\Delta\\lambda = 0.050\\ \\mathrm{mm} \\times 2.08\\ \\mathrm{nm/mm} = 0.10\\ \\mathrm{nm}' }
      ],
      a: 'About 0.1 nm: the narrowest line that can be isolated with that slit, equal to a resolving power of 5500 at 550 nm.'
    }
  ],
  quiz: [
    { q: 'A grating with 2000 lit lines is used in second order. What is its resolving power?', answer: 4000, why: '$R = mN = 2 \\times 2000 = 4000$.' },
    { q: 'At 600 nm in second order, which wavelength difference does a grating with 5000 lit lines just resolve?', answer: 0.06, unit: 'nm', why: '$\\Delta\\lambda = \\lambda/(mN) = 600/(2 \\times 5000) = 0.06$ nm.' },
    { q: 'Doubling the width of the beam on a grating (same pitch, same order)…', choices: ['doubles the resolving power', 'doubles the dispersion', 'halves the free spectral range', 'does nothing'], a: 0, why: '$N$ doubles, so $R = mN$ doubles. The angular dispersion $m/(d\\cos\\theta)$ depends only on the pitch, the order and the angle, not on the width.' },
    { q: 'A spectrometer shows 400–800 nm in first order. Light below 400 nm falls on the same detector in second order.', a: true, why: 'Second-order light of wavelength $\\lambda/2$ lands where first-order $\\lambda$ does. An order-sorting filter that blocks below about 400 nm is needed when scanning to 800 nm.' },
    { q: 'Why is the sodium D doublet a classic test of a spectrometer?', choices: ['The lines are 0.6 nm apart, needing R of about 1000', 'The lines are very faint', 'They are exactly 1 nm apart', 'Only echelle gratings can resolve them'], a: 0, why: 'At 589 nm a separation of 0.597 nm needs a resolving power of about 987: easy for a laboratory grating, impossible for the cheapest instruments or a wide slit.' }
  ],
  applications: [
    'Laboratory spectrophotometers and monochromators, whose slit width is chosen by the bandpass needed.',
    'Astronomical spectrographs: resolving powers of 10⁴ to 10⁵ and more to measure stellar motion, composition and the Doppler wobble of planets\' host stars.',
    'Raman and fluorescence spectroscopy, where pixel-level dispersion decides the shift resolution.',
    'Industrial inspection of lamps, lasers and displays, with compact array spectrometers of R about 1000.',
    'Atomic spectroscopy: resolving the fine and hyperfine structure of spectral lines; hydrogen and deuterium Balmer-α lines (656.28 and 656.10 nm) need R of about 3600.'
  ],
  history: 'The sodium D lines have been the standard test since Kirchhoff and Bunsen\'s spectroscope of 1859–60, when a spectrum first identified a chemical element by its lines. Rowland\'s gratings, produced from the 1880s, raised the resolving power from the prism\'s few hundred to tens of thousands.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 — dispersion and resolving power of a grating.',
    'C. Palmer, *Diffraction Grating Handbook* — dispersion, resolving power, free spectral range and order sorting.',
    'J. M. Lerner and A. Thevenon, *The Optics of Spectroscopy* — slits, bandpass and resolution in practice.',
    'Handbook of Optics, vol. 2, the chapter on diffraction gratings — formulas for dispersion and resolving power.'
  ],
  sim: 'df-spectrometer'
},

/* ================================================================ Fresnel zones and zone plates */
{
  id: 'fresnel-diffraction-and-zone-plates', parent: 'diffraction', title: 'Fresnel diffraction and zone plates', level: 3,
  short: 'Divide a wavefront into rings whose edges are half a wavelength farther from the observer: Fresnel zones. Neighbouring zones cancel, so a hole that shows one zone is four times brighter than no obstacle and a disc has a bright spot at its centre. Block every second zone and you have a lens with no glass: the zone plate.',
  keywords: ['Fresnel zones', 'zone plate', 'Fresnel zone plate', 'Arago spot', 'Poisson spot', 'half-period zones', 'diffractive lens', 'chromatic', 'focal length proportional to 1/lambda', 'Fresnel number', 'near field', 'phase zone plate', 'X-ray lens', 'Fresnel diffraction', 'circular aperture on axis'],
  prereq: ['what-diffraction-is', 'huygens-construction', 'optical-path-length'],
  related: ['fresnel-lenses', 'diffractive-optical-elements', 'holography', 'the-airy-disk', 'metalenses-and-flat-optics', 'single-slit-diffraction', 'physics:huygens-principle'],
  body: `
Take a point on the axis behind a round hole and divide the part of the wavefront in the hole into rings: the first reaches out to where the path to the point is half a wavelength longer than the straight path, the second to where it is a whole wavelength longer, and so on. These are **Fresnel zones**. Light from neighbouring zones arrives half a wavelength out of step and nearly equal in strength, so successive zones cancel in pairs.

### Holes, discs and the bright spot
Let the hole have radius $a$ and the point be at distance $z$. The number of zones it exposes is the Fresnel number $N_F = a^2/(\\lambda z)$ ([[what-diffraction-is]]), and the intensity on the axis, relative to the undisturbed beam, is

$$\\frac{I}{I_0} = 4\\sin^2\\!\\left(\\frac{\\pi N_F}{2}\\right)$$

One zone open: $4\\times$ brighter than with no obstacle at all. Two open: dark. Three: bright again.

Now put in a *disc*. The zones outside it still contribute, and by the same argument, the on-axis intensity is exactly $I_0$ everywhere behind it, as if the disc were not there. This **Poisson (Arago) spot** was pointed out by Poisson in 1818–19 as an absurd consequence of Fresnel's wave theory, and promptly found by Arago in the experiment, a striking confirmation. With a small bright source and a disc with a smooth round edge it is easily seen.

### The zone plate
Block every second zone, or give it half a wave extra delay, and all the light that reaches a chosen point now arrives in step. That point is a focus. The radii of the zones for a focus at distance $f$ are

$$r_k = \\sqrt{k\\lambda f}\\quad(\\text{more exactly } \\sqrt{k\\lambda f + k^2\\lambda^2/4})$$

so for $f = 100$ mm and green light the first zone has radius 235 µm, the tenth 742 µm, the twentieth 1.05 mm: ever thinner rings, whose width at the edge is $\\lambda f/(2r_N)$. A plate with $K$ zones makes an intensity $K^2$ times the undisturbed value at its focus.

| Property | Zone plate | Glass lens |
|---|---|---|
| Focal length | $r_1^2/\\lambda$, so $f \\propto 1/\\lambda$ | nearly independent of $\\lambda$ |
| Colour error | strong: $f$ is 44 % longer in blue (450 nm) than in red (650 nm) | weak, in the other direction |
| Other foci | at $f/3$, $f/5$, … and a virtual one at $-f$ | none |
| Light in the main focus | 10 % (binary amplitude), 40 % (binary phase), up to 100 % (blazed) | about 95 % |

### Chromatism with the opposite sign
The zone plate's focal length falls as the wavelength rises, while a glass lens's rises: a diffractive element has an Abbe-style number of $-3.45$, a glass of $+25$ to $+95$. A thin diffractive layer next to a glass lens can therefore cancel its colour error with few elements, which some camera and optical-disc lenses exploit.

### Do not confuse it with a Fresnel lens
A **Fresnel lens**, like a lighthouse's, collapses a thick lens into thin refracting rings; each ring is many wavelengths deep and *refracts*, so it works over the whole spectrum ([[fresnel-lenses]]). A zone plate has rings that *diffract*. They share the name and the zone-like look, not the physics. Zone plates with outermost zones 10–30 nm wide are the lenses of X-ray microscopes, where nothing refracts light usefully ([[diffractive-optical-elements]]).

> [!key] Fresnel zones alternate in phase: open one, and the centre is $4\\times$ bright; open two, dark; a disc leaves the centre as bright as without it. Block alternate zones at radii $\\sqrt{k\\lambda f}$ and you have a lens whose focus moves with the wavelength as $1/\\lambda$.
`,
  ideas: [
    'Fresnel zones are rings whose edges are half a wavelength farther from the observation point; neighbouring zones cancel.',
    'On the axis behind a round hole the intensity is 4 sin²(πN_F/2): bright for an odd number of zones, dark for an even number.',
    'The Poisson (Arago) spot: behind an opaque disc the axis intensity equals that without the disc.',
    'A zone plate blocks alternate zones, at radii √(kλf), so that every open zone adds in step at the focus.',
    'Its focal length is f ∝ 1/λ, a strong colour error of the opposite sign to glass; it also has weaker foci at f/3, f/5 …'
  ],
  pitfalls: [
    'A zone plate and a Fresnel lens are the same thing — A Fresnel lens refracts through thin ring-shaped prisms; a zone plate diffracts. The first works across the spectrum, the second has a focal length proportional to 1/λ.',
    'Blocking light makes a pattern darker everywhere — Blocking alternate zones makes the focus K² times brighter than without the plate: removing the out-of-step light removes what was cancelling the rest.',
    'A disc must leave a dark shadow at its centre — On the axis the shadow is bright (Poisson spot), exactly as bright as with no disc, because the zones just outside the disc add to the full beam.',
    'A zone plate has one focus — It has many, at f, f/3, f/5 … (and a virtual one at −f); the first is by far the brightest, but the others carry light too.'
  ],
  terms: [
    { term: 'Fresnel zone', also: ['half-period zone', 'Fresnel half-period zone'], def: 'One of the rings into which a wavefront is divided for an observation point, each ring\'s edge half a wavelength farther from the point than the last. Neighbouring zones contribute in opposite phase.' },
    { term: 'Zone plate', also: ['Fresnel zone plate'], def: 'A flat plate with concentric zones of radii √(kλf), alternately opaque and clear (or alternately delayed by half a wave), which focuses light at distance f by diffraction.' },
    { term: 'Poisson spot', also: ['Arago spot', 'spot of Arago'], def: 'The bright spot at the centre of the shadow of a round opaque disc, as bright as the undisturbed beam. Its observation in 1819 supported the wave theory of light.' },
    { term: 'Phase zone plate', def: 'A zone plate whose alternate zones delay the light by half a wavelength instead of blocking it, so that all the light is used; its first-order efficiency is about 40 %.' },
    { term: 'Diffractive lens', also: ['diffractive optical element', 'DOE lens', 'kinoform lens'], def: 'A lens that focuses by diffraction at rings or steps rather than by refraction. Its focal length varies inversely with wavelength, opposite in sign to a glass lens.' }
  ],
  formulas: [
    {
      name: 'Radius of the k-th zone',
      expr: 'r = sqrt(k*lambda*f)', tex: 'r_k = \\sqrt{k\\,\\lambda\\,f}',
      vars: {
        r: { name: 'radius of zone k', q: 'length', unit: 'mm', tex: 'r_k' },
        k: { name: 'zone number', value: 10, int: true, min: 1, max: 1000 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The approximate form, good while kλ ≪ f. The edge of zone k is where the path to the focus is kλ/2 longer than the axial path.',
      stories: { r: 'A zone plate is made for {lambda} light with a focal length of {f}. What is the radius of zone number {k}?', f: 'In a zone plate for {lambda} light, zone {k} has radius {r}. What is its focal length?' }
    },
    {
      name: 'Focal length of a zone plate',
      expr: 'f = r1^2/lambda', tex: 'f = \\frac{r_1^2}{\\lambda}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        r1: { name: 'radius of the first zone', q: 'length', unit: 'µm', value: 234.5, tex: 'r_1' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      stories: { f: 'The first zone of a zone plate has radius {r1}. What is its focal length for {lambda} light?' }
    },
    {
      name: 'Focal length at another wavelength',
      expr: 'f = f0*lambda0/lambda', tex: 'f = f_0\\,\\frac{\\lambda_0}{\\lambda}',
      vars: {
        f: { name: 'focal length at λ', q: 'length', unit: 'mm' },
        f0: { name: 'design focal length', q: 'length', unit: 'mm', value: 200, tex: 'f_0' },
        lambda0: { name: 'design wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda_0' },
        lambda: { name: 'wavelength used', q: 'length', unit: 'nm', value: 405, tex: '\\lambda' }
      },
      note: 'The strong chromatism of a diffractive lens: shorter wavelengths focus farther away.',
      stories: { f: 'A zone plate made to focus {lambda0} light at {f0} is used with {lambda} light. Where is the focus?' }
    },
    {
      name: 'Width of the outermost zone',
      expr: 'dr = lambda*f/(2*rN)', tex: '\\Delta r_N = \\frac{\\lambda f}{2\\,r_N}',
      vars: {
        dr: { name: 'width of the outermost zone', q: 'length', unit: 'µm', tex: '\\Delta r_N' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        rN: { name: 'outer radius', q: 'length', unit: 'mm', value: 2.35, tex: 'r_N' }
      },
      note: 'It is the smallest feature to be made, and it sets the resolution, about 1.22 Δr.',
      stories: { dr: 'A {f} zone plate for {lambda} light has an outer radius of {rN}. How wide is its outermost zone?' }
    }
  ],
  examples: [
    {
      title: 'Designing a zone plate',
      q: 'A zone plate is to focus 633 nm light 200 mm away. What are the radii of the first and the fiftieth zones, and how wide is the 50th?',
      steps: [
        { text: 'The first zone:', tex: 'r_1 = \\sqrt{\\lambda f} = \\sqrt{633\\times10^{-9} \\times 0.2} = 356\\ \\mu\\mathrm{m}' },
        { text: 'The fiftieth is $\\sqrt{50}$ times larger:', tex: 'r_{50} = 356 \\times 7.07 = 2.52\\ \\mathrm{mm}' },
        { text: 'Its width, from $\\Delta r = \\lambda f/(2 r_N)$:', tex: '\\Delta r_{50} = \\frac{633\\times10^{-9} \\times 0.2}{2 \\times 2.52\\times10^{-3}} = 25\\ \\mu\\mathrm{m}' }
      ],
      a: 'Radii 0.356 mm and 2.52 mm; the outermost zone is 25 µm wide, within reach of a good printer or lithography. With all 50 zones the intensity at the focus is $50^2 = 2500$ times that of a plain beam.'
    },
    {
      title: 'The wrong colour',
      q: 'The 633 nm zone plate of the example (f = 200 mm) is used with a 405 nm violet diode laser. Where does it focus?',
      steps: [
        { text: 'The focal length scales as $1/\\lambda$:', tex: 'f = 200 \\times \\frac{633}{405} = 313\\ \\mathrm{mm}' }
      ],
      a: '313 mm, 113 mm farther. A glass lens would shift by only a millimetre or two; that is the chromatic strength of a diffractive lens.'
    }
  ],
  quiz: [
    { q: 'On the axis behind a round hole that exposes exactly two Fresnel zones, the intensity is…', choices: ['close to zero', 'four times the unobstructed value', 'equal to the unobstructed value', 'twice the unobstructed value'], a: 0, why: 'The two zones contribute in opposite phase and cancel: $4\\sin^2(\\pi N_F/2)$ with $N_F = 2$ is zero. One or three zones give four times the unobstructed intensity.' },
    { q: 'What is at the centre of the shadow of a small round disc lit by a point source?', choices: ['A bright spot as bright as without the disc', 'Darkness', 'A ring', 'A spot half as bright'], a: 0, why: 'This is the Poisson (Arago) spot: the zones just outside the disc add up to the full unobstructed field on the axis.' },
    { q: 'A zone plate with focal length 100 mm for green light (550 nm) is used with blue light of 440 nm. Its focal length becomes…', answer: 125, unit: 'mm', why: '$f \\propto 1/\\lambda$: $100 \\times 550/440 = 125$ mm. Shorter wavelengths focus farther away: the opposite of a glass lens.' },
    { q: 'A zone plate that blocks every other zone sends more light to its focus than the same plate with no zones blocked (a clear window).', a: true, why: 'The window gives the unobstructed intensity; the zone plate gives $K^2$ times that at the focus, because it removes only the light that was cancelling the rest.' },
    { q: 'A lighthouse Fresnel lens and a zone plate both look like concentric rings. How do they focus?', choices: ['The lighthouse lens refracts, the zone plate diffracts', 'Both diffract', 'Both refract', 'The zone plate refracts, the lighthouse lens diffracts'], a: 0, why: 'A Fresnel lens is a thin version of a thick refracting lens, made of ring-shaped prisms many wavelengths deep. A zone plate has rings at half-wavelength spacing that diffract light into its focus.' }
  ],
  applications: [
    'Soft X-ray microscopy and synchrotron beamlines, where zone plates with outermost zones of tens of nanometres focus X-rays that glass cannot.',
    'Hybrid refractive-diffractive lenses, where a diffractive surface cancels the colour error of a glass lens with fewer elements.',
    'Radio and microwave links: the "first Fresnel zone" between two antennas is the region that must stay clear of obstacles for full signal.',
    'Optical-disc pickups and compact, flat focusing elements for sensors.',
    'Demonstrations: the Poisson spot behind a ball bearing or coin lit by a laser is a classic test of a clean, coherent beam.'
  ],
  history: 'Augustin Fresnel introduced the zones in his memoir for the French Academy\'s diffraction prize (submitted in 1818, awarded in 1819). Siméon-Denis Poisson, one of the judges, noted that the theory predicted a bright spot at the centre of a disc\'s shadow, which he thought absurd; François Arago, another, performed the experiment and saw it. Jacques-Louis Soret of Geneva made the first zone plates in 1875; R. W. Wood later made them far brighter by delaying the light in alternate zones instead of blocking it.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 — Fresnel zones, the zone plate and the Fresnel diffraction of circular apertures and obstacles.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 — Fresnel zones and diffraction by a circular aperture or a disc.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, the chapter on Fresnel diffraction — zone plate and on-axis intensity.',
    'D. Attwood and A. Sakdinawat, *X-Rays and Extreme Ultraviolet Radiation*, the chapter on zone plates — X-ray zone plates.'
  ],
  sim: 'df-zones'
},

/* ================================================================ Fourier optics */
{
  id: 'fourier-optics', parent: 'diffraction', title: 'Fourier optics: a lens as a transformer', level: 3,
  short: 'The far-field diffraction pattern of an object is its Fourier transform, and a lens puts that pattern in its focal plane: a spatial frequency ν lands at x = λfν. A picture is a sum of sinusoidal patterns, each of which is a direction of light; the lens sorts the directions into positions.',
  keywords: ['Fourier optics', 'Fourier transform', 'spatial frequency', 'Fourier plane', 'transform plane', '4f system', 'focal plane', 'pupil function', 'coherent imaging', 'transfer function', 'cutoff frequency', 'diffraction pattern', 'optical computing', 'x = lambda f nu'],
  prereq: ['single-slit-diffraction', 'the-airy-disk', 'spatial-frequency-and-line-pairs'],
  related: ['spatial-filtering', 'the-modulation-transfer-function', 'diffraction-limited-mtf', 'resolution-limits', 'holography', 'diffractive-optical-elements', 'math:fourier-series', 'physics:single-slit-diffraction'],
  body: `
Slits, round holes and gratings each have a diffraction pattern with its own formula, and one idea ties them all together: **the far-field pattern of an object is its Fourier transform.** A lens brings the far field to its focal plane. So a lens is a computer that turns a picture, at the speed of light, into the list of the spatial frequencies it is made of.

### Spatial frequencies are directions
A pattern whose brightness varies sinusoidally with period $p$ has a **spatial frequency** $\\nu = 1/p$, in cycles (line pairs) per millimetre. Plane light through it splits into three beams: one straight on and two at $\\sin\\theta = \\pm\\lambda\\nu$ (the grating equation at its simplest). A coarse pattern sends light at small angles, a fine one at large angles. Any picture can be written as a sum of sinusoidal patterns (Fourier's theorem), so an object sends out a spread of beams, each direction carrying one spatial frequency and its brightness giving the strength of that frequency.

### What the lens does
A thin lens of focal length $f$ sends a parallel beam arriving at angle $\\theta$ to the point $x = f\\tan\\theta \\approx f\\sin\\theta$ in its back focal plane. A spatial frequency $\\nu$ in an object a focal length in front of the lens therefore lands at

$$x = \\lambda f\\,\\nu$$

A ruling of 10 lines/mm in 633 nm light with $f = 200$ mm gives spots at $x = \\pm 1.27$ mm. What a camera or an eye placed there records is the squared size of the transform.

| Object | Pattern in the Fourier plane |
|---|---|
| a slit of width $a$ | sinc², of width $\\propto 1/a$ |
| a round hole | the Airy pattern |
| a sinusoidal grating | three spots |
| a wire mesh | a lattice of spots |
| two small holes | cosine fringes |
| a Gaussian beam | a Gaussian: the one shape that stays itself |

Narrow in one plane means wide in the other: the single-slit rule is a general law. And **moving the object sideways does not move its transform's intensity**; it changes only a phase. That is why a lens always shows a star's Airy pattern in the same place whatever part of the aperture is lit.

### The 4f arrangement
Place an object a focal length in front of lens 1; the plane a focal length behind lens 1 (the **Fourier plane**) is also a focal length in front of lens 2; the image forms a focal length behind lens 2. The total length is $4f$. With nothing in the Fourier plane, lens 2 transforms again and the image is the original, turned upside down. Whatever is placed in the Fourier plane decides what the image keeps; that is the subject of [[spatial-filtering]].

### The lens itself limits the frequencies
A lens of aperture $D$ passes only the frequencies that land inside its pupil, $\\lambda f\\nu \\le D/2$. This gives a cutoff at $\\nu = 1/(2\\lambda N)$ for coherent light, and twice that, $1/(\\lambda N)$, for the incoherent light of ordinary scenes: 227 lp/mm for f/8 in green light, where the diffraction [[the-modulation-transfer-function|MTF]] reaches zero. The Abbe limit of [[resolution-limits]] is this cutoff stated for a microscope, and the Airy pattern is the transform of the round pupil.

> [!key] A lens turns direction into position: a spatial frequency $\\nu$ lands at $x = \\lambda f\\nu$ in the focal plane, which holds the Fourier transform of the object. Narrow objects have wide transforms, and the lens's aperture sets the highest frequency it can pass.
`,
  ideas: [
    'A fine pattern diffracts light to large angles and a coarse one to small angles: a spatial frequency is a direction.',
    'A lens sends each direction to its own point of the focal plane, x = λfν, so that plane shows the Fourier transform of the object.',
    'Narrow in one plane means wide in the other: the single-slit and Airy patterns are special cases.',
    'In a 4f system object, Fourier plane and image are a focal length apart in turn, and the image is inverted unless the Fourier plane is altered.',
    'The lens aperture cuts the spatial frequencies off at 1/(λN) for incoherent imaging (half that for coherent light): this is the diffraction limit.'
  ],
  pitfalls: [
    'The Fourier plane is where the image forms — The image forms in a different plane. The Fourier plane shows the spatial frequencies and looks like a diffraction pattern; the image is back in the 4f system\'s last plane.',
    'The pattern in the Fourier plane moves when the object moves — Only its phase changes; the intensity pattern stays where it is. That is why a star\'s Airy disc is the same wherever the star sits in the field of view.',
    'Fourier optics is something added by mathematicians — It is what the lens does physically. The mathematics describes how the wavelets arrive in step at each point of the focal plane.',
    'Lenses pass all spatial frequencies — A lens passes only those inside its aperture. Anything finer than the cutoff is lost for ever, however large the magnification.'
  ],
  terms: [
    { term: 'Spatial frequency', also: ['ν', 'lp/mm', 'cycles per millimetre'], def: 'The number of cycles of a repeating pattern per unit length, the reciprocal of its period. A fine pattern has a high spatial frequency; it diffracts light to a large angle, sin θ = λν.' },
    { term: 'Fourier transform', def: 'The mathematical operation that breaks a function (here, the light amplitude across an object) into the sinusoidal components of its spatial frequencies. A lens produces the optical Fourier transform in its focal plane.' },
    { term: 'Fourier plane', also: ['transform plane', 'back focal plane', 'spectrum plane'], def: 'The focal plane of a lens in which an object placed in the front focal plane shows its spatial-frequency spectrum, each frequency at its own position x = λfν.' },
    { term: '4f system', also: ['4-f correlator', 'double Fourier transform'], def: 'Two lenses of focal length f separated by 2f, with the object a focal length before the first and the image a focal length behind the second: object, Fourier plane and image planes are spaced f, f, f, f apart.' },
    { term: 'Pupil function', also: ['aperture function'], def: 'The transmission (and phase) of the lens aperture across the Fourier plane. Its transform is the amplitude point-spread function; for a round hole it gives the Airy pattern.' },
    { term: 'Cutoff frequency', also: ['spatial-frequency cutoff'], def: 'The highest spatial frequency a lens can pass: 1/(λN) for incoherent light, half of that for coherent light. Finer detail does not reach the image.' }
  ],
  formulas: [
    {
      name: 'Position in the Fourier plane',
      expr: 'x = lambda*f*nu', tex: 'x = \\lambda\\,f\\,\\nu',
      vars: {
        x: { name: 'position in the focal plane', q: 'length', unit: 'mm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 200 },
        nu: { name: 'spatial frequency of the object', q: 'spatialfreq', unit: 'lp/mm', value: 10, tex: '\\nu' }
      },
      note: 'Small angles. The position is measured from the axis: the straight-through light sits at x = 0.',
      stories: { x: 'A transparency with a ruling of {nu} is lit by {lambda} light and sits in front of a lens of {f} focal length. How far from the axis is the first diffracted spot in the focal plane?', nu: 'Spots appear {x} from the axis in the focal plane of a {f} lens lit by {lambda} light. What spatial frequency of the object do they come from?' }
    },
    {
      name: 'Diffraction angle of a spatial frequency',
      expr: 'sin(t) = lambda*nu', tex: '\\sin\\theta = \\lambda\\,\\nu',
      vars: {
        t: { name: 'angle of the diffracted beam', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        nu: { name: 'spatial frequency', q: 'spatialfreq', unit: 'lp/mm', value: 100, tex: '\\nu' }
      },
      note: 'The grating equation for normal incidence, first order, written with the frequency instead of the pitch.'
    },
    {
      name: 'Cutoff frequency of a perfect lens',
      expr: 'nuc = 1/(lambda*N)', tex: '\\nu_c = \\frac{1}{\\lambda N}',
      vars: {
        nuc: { name: 'cutoff frequency (incoherent light)', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      note: 'For coherent (laser) light the cutoff is half this, 1/(2λN).',
      stories: { nuc: 'A perfect lens at f/{N} images in {lambda} light. At what spatial frequency does its diffraction-limited contrast reach zero?', N: 'A sensor needs a lens that passes {nuc}. At what f-number does a perfect lens cut off at that frequency in {lambda} light?' }
    }
  ],
  examples: [
    {
      title: 'Where do the spots fall?',
      q: 'A transparency carries a ruling of 20 lines/mm. Lit by a 633 nm laser beam, it stands one focal length (300 mm) in front of a lens. Where, in the back focal plane, are the first-order spots?',
      steps: [
        { text: 'The spatial frequency is $\\nu = 20$ lp/mm, so', tex: 'x = \\lambda f\\nu = 633\\times10^{-6}\\ \\mathrm{mm} \\times 300\\ \\mathrm{mm} \\times 20\\ \\mathrm{mm}^{-1} = 3.8\\ \\mathrm{mm}' },
        'The direction is $\\sin\\theta = \\lambda\\nu = 0.0127$, $\\theta = 0.73°$ — and $300 \\tan 0.73° = 3.8$ mm agrees.'
      ],
      a: 'Two spots 3.8 mm either side of the bright central one. Doubling the ruling would double the distance.'
    },
    {
      title: 'The limit of a camera lens',
      q: 'A perfect lens works at f/4 in 550 nm light. What spatial frequencies can it pass, with incoherent illumination and with a laser?',
      steps: [
        { text: 'Incoherent cutoff:', tex: '\\nu_c = \\frac{1}{\\lambda N} = \\frac{1}{0.00055\\ \\mathrm{mm} \\times 4} = 455\\ \\mathrm{lp/mm}' },
        'With coherent light the cutoff is half: 227 lp/mm.'
      ],
      a: '455 lp/mm for ordinary light, 227 lp/mm for a laser. Everything finer is absent from the image, whatever the sensor.'
    }
  ],
  quiz: [
    { q: 'A grating of 50 lines/mm is lit by 500 nm light a focal length (400 mm) in front of a lens. How far from the axis is the first spot?', answer: 10, unit: 'mm', why: '$x = \\lambda f\\nu = 0.0005\\ \\mathrm{mm} \\times 400\\ \\mathrm{mm} \\times 50\\ \\mathrm{mm}^{-1} = 10$ mm.' },
    { q: 'The slit of an object is made narrower. Its Fourier-plane pattern gets…', choices: ['wider', 'narrower', 'brighter at the centre', 'no change'], a: 0, why: 'A narrow object contains high spatial frequencies, which land far from the axis: narrow in one plane, wide in the other.' },
    { q: 'An object is moved sideways by 1 mm in front of the lens. Its Fourier-plane intensity pattern moves with it.', a: false, why: 'A shift of the object only multiplies its transform by a phase factor. The intensity pattern stays where it is.' },
    { q: 'In a 4f system with nothing in the Fourier plane, the image is…', choices: ['the object upside down', 'the object upright', 'a diffraction pattern', 'blank'], a: 0, why: 'The second lens performs a second transform, which returns the object inverted (rotated through 180°).' },
    { q: 'Light of 633 nm at normal incidence on a finely ruled object is diffracted to 30°. What is its spatial frequency in lp/mm?', answer: 790, why: '$\\nu = \\sin\\theta/\\lambda = 0.5/0.633\\ \\mu\\mathrm{m} = 0.79\\ \\mu\\mathrm{m}^{-1} = 790$ lp/mm.' }
  ],
  applications: [
    'Optical spatial filtering and phase-contrast microscopy, where masks in the Fourier plane shape the image ([[spatial-filtering]]).',
    'Optical correlators for pattern recognition (Vander Lugt, 1964): a filter in the Fourier plane makes a bright spot where a target appears.',
    'Beam shaping and pattern projection: a diffractive element, or a hologram, in front of a lens makes any far-field pattern; the lens does the transform.',
    'X-ray, electron and neutron diffraction: the diffraction pattern of a crystal is the Fourier transform of its structure.',
    'Understanding image quality: the modulation transfer function of a lens is the autocorrelation of its pupil.'
  ],
  history: 'Ernst Abbe\'s 1873 theory of the microscope was the first Fourier view of imaging. Pierre-Michel Duffieux gave the mathematics in his 1946 book on the Fourier integral in optics, and in the 1950s André Maréchal and Paul Croce filtered images in the Fourier plane. A. Vander Lugt\'s optical correlator of 1964 and J. W. Goodman\'s textbook of 1968 made the subject a branch of engineering.',
  sources: [
    'J. W. Goodman, *Introduction to Fourier Optics*, ch. 5 (Wave-optics analysis of coherent optical systems) and ch. 6 (Frequency analysis of optical imaging systems).',
    'E. Hecht, *Optics*, ch. 11 (Fourier Optics) — the Fourier transform of apertures and the 4f system.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 and ch. 9 — Fraunhofer diffraction and the diffraction theory of imaging.'
  ],
  sim: { id: 'df-4f', params: { mask: 'none', object: 'grating' } }
},

/* ================================================================ spatial filtering */
{
  id: 'spatial-filtering', parent: 'diffraction', title: 'Spatial filtering', level: 3,
  short: 'A mask in the Fourier plane decides which spatial frequencies reach the image. Block the centre and only edges remain; block everything but the centre and the picture blurs and the noise goes; block the spots of a mesh and the mesh vanishes. The same idea explains the microscope (Abbe) and cleans up a laser beam with a pinhole.',
  keywords: ['spatial filter', 'spatial filtering', 'low-pass filter', 'high-pass filter', 'dark field', 'phase contrast', 'Zernike', 'Abbe theory', 'pinhole filter', 'beam cleaning', 'notch filter', 'halftone removal', 'schlieren', 'Fourier plane mask', 'diffraction orders microscope'],
  prereq: ['fourier-optics', 'resolution-limits', 'the-grating-equation'],
  related: ['cleaning-a-beam-with-a-pinhole', 'apertures-irises-and-pinholes', 'microscope-illumination-and-contrast', 'the-compound-microscope', 'optical-metrology', 'spatial-light-modulators', 'physics:diffraction-grating'],
  body: `
If the focal plane of a lens holds the spatial frequencies of an object, then a mask there decides which frequencies reach the image. Block the right ones and the image changes in a way you can predict. That is **spatial filtering**, and it explains how a microscope forms its image as well as how to clean a laser beam.

### Abbe's theory of the microscope
In 1873 Ernst Abbe saw that a microscope makes its image in two steps. The object diffracts light into orders; the objective gathers some of them and lets them interfere to form the image. A fine ruling shows how this works:
- With only the zero order the image is a uniform patch: no stripes at all.
- With the zero order and one first order, sinusoidal stripes appear, with the right period.
- With more orders the stripes sharpen towards the true square profile.

The stripes of period $p$ send light to $\\sin\\theta = \\lambda/p$, so an objective can show them only if its aperture takes in that angle: $p \\ge \\lambda/\\mathrm{NA}$ (or $\\lambda/(2\\,\\mathrm{NA})$ with oblique light), the Abbe limit. Everything the aperture blocks is lost for ever. In 1906 A. B. Porter showed this with a wire mesh: block all but the central spots and the image shows only the mesh's lines in one direction, as predicted.

### A catalogue of filters
| Mask in the Fourier plane | Image |
|---|---|
| **Low-pass**: a pinhole at the centre | blurred; noise, dots and mesh gone |
| **High-pass**: a small opaque disc at the centre | only edges and fine detail, on dark |
| **Directional**: a slit through the centre | only lines at right angles to the slit survive |
| **Notch**: small blockers on the spots of a pattern | a regular pattern (halftone, mesh, scan lines) removed |
| **Dark field**: block the zero order | transparent objects show bright edges on a dark ground |
| **Phase contrast**: shift the zero order by a quarter wave | transparent specimens show light and dark detail |
| **Schlieren**: a knife edge cutting half the plane | refractive-index gradients (heat, flow) show as shades |

Zernike's phase-contrast method (1930s; Nobel Prize in Physics 1953) turns the invisible phase delays of a cell or a glass plate into brightness differences by delaying the undiffracted light by a quarter of a wavelength with a phase ring.

### Cleaning a laser beam
A laser beam from a cheap source carries dust rings, ripples and speckle: all high spatial frequencies. Focus the beam with a lens (or a microscope objective), put a **pinhole** at the focus and recollimate what passes. The smooth core of the beam goes through the hole; the noise lands outside and is blocked. The pinhole's diameter is about 1.5 to 2 times the focused spot's, whose $1/e^2$ diameter is $4\\lambda f/(\\pi D)$: a 0.8 mm helium–neon beam focused by a 16 mm objective makes a 16 µm spot, so a 25 µm pinhole. Smaller cleans better but loses more power and is harder to align ([[cleaning-a-beam-with-a-pinhole]]).

### What filtering cannot do
A filter removes information; it never adds any. A notch that deletes a mesh also deletes the picture's own detail at the same frequencies, and every blocker with a sharp edge sends its own ripples into the image.

> [!key] A mask in the Fourier plane keeps or removes spatial frequencies: pinhole for smoothing, central dot for edges, notches for patterns. Abbe's theory is the same thing seen in the microscope: the image is the interference of the orders the objective collects.
`,
  ideas: [
    'The Fourier plane holds the spatial frequencies of the object, so a mask there selects what the image keeps.',
    'Low-pass (a pinhole) smooths and removes noise and regular patterns; high-pass (a central dot) leaves edges; a notch removes a periodic pattern.',
    'Abbe: a microscope image is the interference of the diffracted orders the objective collects; a grating image needs at least the zero order and one first order.',
    'Dark field blocks the zero order, phase contrast shifts it by a quarter wave: both make transparent specimens visible.',
    'A pinhole at the focus of a lens removes the high-frequency noise of a laser beam and leaves a smooth Gaussian.'
  ],
  pitfalls: [
    'Spatial filtering sharpens by adding detail — It can only remove frequencies. A high-pass mask looks sharper because it keeps edges and drops the smooth parts; no new detail appears.',
    'A pinhole filter works at any hole size — If the hole is smaller than the focused spot it cuts the beam itself and creates ripples; if much larger it passes the noise. About 1.5 to 2 times the spot is the compromise.',
    'Block the zero order and the picture disappears — It does not: the image of edges and fine detail remains on a dark ground. That is dark-field imaging.',
    'Abbe\'s theory is about lenses being imperfect — It holds for perfect lenses: what the aperture cannot capture of the diffracted light is not in the image at all.'
  ],
  terms: [
    { term: 'Spatial filter', also: ['Fourier-plane filter', 'spatial filtering'], def: 'A mask, stop or phase plate in the Fourier plane of a lens that changes which spatial frequencies pass on to the image.' },
    { term: 'Low-pass and high-pass filter', also: ['low-pass', 'high-pass', 'band-pass'], def: 'A low-pass filter passes only low spatial frequencies (smooth parts, a central hole); a high-pass filter blocks them and passes edges and fine detail (a central opaque disc).' },
    { term: 'Dark-field imaging', also: ['dark field'], def: 'Imaging with the undiffracted (zero-order) light blocked, so that only light scattered or diffracted by the object reaches the image: edges bright on a dark background.' },
    { term: 'Phase contrast', also: ['Zernike phase contrast'], def: 'A method that delays the undiffracted light by a quarter wave in the Fourier plane, turning invisible phase differences of a transparent specimen into brightness differences.' },
    { term: 'Abbe theory of image formation', also: ['Abbe imaging theory', 'Abbe\'s theory'], def: 'The description of a microscope image as the interference of the diffraction orders collected by the objective: detail whose orders are not collected cannot appear.' },
    { term: 'Pinhole spatial filter', also: ['spatial filter assembly', 'beam cleaner'], def: 'A lens or objective focusing a laser beam onto a small pinhole, which passes the smooth core and blocks the high-frequency noise; the beam is then recollimated.' }
  ],
  formulas: [
    {
      name: 'Focused spot of a Gaussian beam',
      expr: 'ds = 4*lambda*f/(pi*Db)', tex: 'd_s = \\frac{4\\,\\lambda\\,f}{\\pi\\,D_b}',
      vars: {
        ds: { name: 'diameter of the focused spot (1/e²)', q: 'length', unit: 'µm', tex: 'd_s' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 16 },
        Db: { name: 'beam diameter at the lens (1/e²)', q: 'length', unit: 'mm', value: 0.8, tex: 'D_b' }
      },
      note: 'A pinhole of 1.5 to 2 times this diameter passes the beam and blocks the noise.',
      stories: { ds: 'A {Db} wide {lambda} beam is focused by a lens of {f} focal length. How large is the focused spot?', Db: 'A lens of {f} focal length focuses {lambda} light to a spot {ds} across. What was the diameter of the beam at the lens?' }
    },
    {
      name: 'Highest frequency passed by a pinhole',
      expr: 'nu = dp/(2*lambda*f)', tex: '\\nu_{\\max} = \\frac{d_p}{2\\,\\lambda\\,f}',
      vars: {
        nu: { name: 'highest spatial frequency passed', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_{\\max}' },
        dp: { name: 'pinhole diameter', q: 'length', unit: 'mm', value: 0.6, tex: 'd_p' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        f: { name: 'focal length of the transform lens', q: 'length', unit: 'mm', value: 250 }
      },
      note: 'A frequency ν lands at x = λfν, so a hole of radius d_p/2 passes up to ν = d_p/(2λf). Finer detail than 1/ν is removed.',
      stories: { nu: 'A pinhole of diameter {dp} stands at the centre of the Fourier plane of a {f} lens lit by {lambda} light. What is the highest spatial frequency of the object that gets through?' }
    }
  ],
  examples: [
    {
      title: 'Removing a halftone screen',
      q: 'A printed photograph has a halftone screen of 6 lines/mm. It is placed in the front focal plane of a 250 mm lens in a 633 nm beam. What pinhole in the Fourier plane removes the screen and keeps the picture?',
      steps: [
        { text: 'The screen\'s first spots lie at', tex: 'x = \\lambda f\\nu = 633\\times10^{-6} \\times 250 \\times 6 = 0.95\\ \\mathrm{mm}' },
        'The picture itself, with detail up to about 2 lp/mm, lies within $\\lambda f \\times 2 = 0.32$ mm of the axis.',
        'A pinhole of radius 0.3 mm (diameter 0.6 mm) passes frequencies up to $0.3/(0.633\\times10^{-3} \\times 250) = 1.9$ lp/mm: the picture without the screen.'
      ],
      a: 'A pinhole about 0.6 mm in diameter. The image is slightly softer, since details between 2 and 6 lp/mm went with the screen.'
    },
    {
      title: 'A pinhole for a helium–neon laser',
      q: 'A 0.8 mm (1/e²) helium–neon beam is focused by a microscope objective of 16 mm focal length. What pinhole cleans it?',
      steps: [
        { text: 'The focused spot is', tex: 'd_s = \\frac{4\\lambda f}{\\pi D_b} = \\frac{4 \\times 633\\times10^{-9} \\times 0.016}{\\pi \\times 0.8\\times10^{-3}} = 16\\ \\mu\\mathrm{m}' },
        'Taking 1.5 times the spot gives 24 µm: a 25 µm pinhole is the common standard size.'
      ],
      a: 'A 25 µm pinhole at the focus, then a second lens to make the beam parallel again.'
    }
  ],
  quiz: [
    { q: 'A small opaque disc is placed exactly on the axis of the Fourier plane (a high-pass filter). The image shows…', choices: ['edges and fine detail on a dark background', 'a blurred picture', 'the original picture', 'nothing'], a: 0, why: 'The disc blocks the zero order and the lowest frequencies, which carry the broad areas of brightness. What passes is the edges and fine detail: dark-field imaging.' },
    { q: 'A pinhole at the centre of the Fourier plane removes the screen of dots from a printed photograph. This is a…', choices: ['low-pass filter', 'high-pass filter', 'phase filter', 'dark-field filter'], a: 0, why: 'The pinhole passes the low frequencies that make the picture and blocks the high frequency of the screen.' },
    { q: 'A pinhole filter in a laser beam works best if it is smaller than the focused spot of the beam.', a: false, why: 'A hole smaller than the spot cuts the beam itself, losing power and adding diffraction ripples. About 1.5 to 2 times the focused spot is the usual compromise.' },
    { q: 'What is the 1/e² diameter of the focus of a 1.0 mm beam of 532 nm light with a lens of 100 mm focal length?', answer: 67.7, unit: 'µm', why: '$d_s = 4\\lambda f/(\\pi D_b) = 4 \\times 532\\times10^{-9} \\times 0.1/(\\pi \\times 10^{-3}) = 67.7\\ \\mu\\mathrm{m}$.' },
    { q: 'According to Abbe, a microscope image of a fine grating needs which orders?', choices: ['The zero order and at least one first order', 'The zero order alone', 'The first orders alone, with the zero order blocked', 'All orders'], a: 0, why: 'The stripes are the interference of the undiffracted light and a diffracted beam. With the zero order alone the image is uniform; with it and one first order the stripes appear with the correct period.' }
  ],
  applications: [
    'Laser beam cleaning in holography, interferometry and microscopy: a lens and a pinhole in an assembly.',
    'Dark-field and phase-contrast microscopy, which show unstained cells, bacteria and the structure of fibres.',
    'Schlieren photography and shadowgraphs of air flow and heat convection.',
    'Removing periodic patterns (scan lines, halftone, a mesh in front of a window) in imaging, optically or digitally in the Fourier domain.',
    'Optical image processing: edge enhancement and correlation, before digital processors took over.'
  ],
  history: 'Abbe demonstrated his theory (1873) with gratings and masks, and A. B. Porter repeated it in 1906 with a wire gauze. Frits Zernike invented phase contrast in the 1930s while studying the defects of diffraction gratings, and received the Nobel Prize in Physics in 1953. The pinhole spatial filter for lasers became standard in the 1960s, with holography and interferometry.',
  sources: [
    'J. W. Goodman, *Introduction to Fourier Optics*, ch. 8 (Analog optical information processing) — spatial filtering, phase contrast and the 4f system.',
    'E. Hecht, *Optics*, ch. 11 (Fourier Optics) — Abbe\'s theory, spatial filtering and the 4f system.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 and 10 — the Abbe theory and the phase-contrast method.',
    'Handbook of Optics, volume 1 — the chapter on Fourier optics and spatial filtering.'
  ],
  sim: { id: 'df-4f', params: { object: 'meshscene', mask: 'notch' } }
},

/* ================================================================ holography */
{
  id: 'holography', parent: 'diffraction', title: 'Holography', level: 3,
  short: 'A photograph records how bright the light was; a hologram records its phase as well, by adding a reference beam so that the two interfere. The fringes on the film act as a grating of varying pitch that, lit by the reference beam, rebuilds the original wave: the object appears behind the plate, in three dimensions.',
  keywords: ['holography', 'hologram', 'reference beam', 'object beam', 'reconstruction', 'twin image', 'conjugate image', 'Gabor', 'Leith Upatnieks', 'Denisyuk', 'reflection hologram', 'rainbow hologram', 'coherence', 'interference recording', 'digital holography', 'volume hologram'],
  prereq: ['fresnel-diffraction-and-zone-plates', 'the-grating-equation', 'coherence'],
  related: ['holographic-optical-elements', 'holograms-and-what-they-show', 'fourier-optics', 'spatial-light-modulators', 'testing-optics-with-fringes', 'grating-types-and-blaze', 'speckle'],
  body: `
A photograph records how bright the light was at each point. It loses the phase — where each wave stood in its cycle — and with it the depth. **Holography** records both, by adding a second wave, a reference. The film then holds a fine pattern of fringes, and lighting it with the reference alone brings back the original wave, so that the scene appears behind the plate as if it were still there.

### Recording
Light from a laser is split into two beams. One, the **reference beam**, is a clean plane or spherical wave sent straight at the film. The other lights the object and scatters from it, the **object wave** $O$. At the film they interfere, and the film records the intensity

$$I = |R + O|^2 = |R|^2 + |O|^2 + R^*O + RO^*$$

The last two terms carry the object wave's amplitude and phase, as the contrast and position of fringes. Where $R$ and $O$ are in step, the film is exposed; where they are out of step, it is not.

### Playback
Develop the film and light it with the reference beam. It acts as a grating whose pitch changes from place to place, and diffracts the light into three parts:
- the reference beam, straight through (zero order);
- a copy of the original object wave, which you see as a **virtual image** behind the plate, in three dimensions, with parallax as you move your head;
- its conjugate, a **real image** in front of the plate with the depth reversed (the *twin image*).

A hologram of a single point source is a zone plate ([[fresnel-diffraction-and-zone-plates]]): the fringes between a plane wave and a spherical one are the Fresnel zones. A hologram of a scene is a sum of such patterns, one per point. Cut a hologram in two and each half still shows the whole scene, through a smaller window.

### The numbers
Two plane waves at an angle $\\theta$ make fringes with spacing $\\Lambda = \\lambda/(2\\sin(\\theta/2))$.

| Arrangement | Fringe spacing at 633 nm | Lines/mm |
|---|---|---|
| beams 30° apart | 1.22 µm | 820 |
| beams 90° apart | 0.45 µm | 2200 |
| reflection hologram (beams from opposite sides, in gelatin $n = 1.5$) | 0.21 µm | 4700 |

Ordinary photographic film resolves 100 to 300 lines/mm, so holography needs special plates: very fine-grained silver halide emulsions, dichromated gelatin or photopolymer, which resolve 3000 lines/mm and more.

### Why a laser, and a steady table
Fringes form only if the two beams are in step: the path difference must be less than the **coherence length** $\\lambda^2/\\Delta\\lambda$. A multimode helium–neon laser has about 20 cm, a single-frequency laser metres to tens of metres, a red LED about 20 µm, daylight about 1 µm. And any movement of $\\lambda/2$, 0.3 µm, during the exposure washes out the fringes, which is why holograms are made on vibration-isolated tables, or with a pulsed laser of 20 ns that freezes even a living face.

### Kinds of hologram
Transmission holograms (Leith and Upatnieks, 1962) need laser light to view. **Reflection holograms** (Denisyuk, 1962) record fringes in the depth of a thick emulsion, a Bragg mirror that works in white light. **Rainbow holograms** (Benton, 1968) give up vertical parallax to be viewed in white light: the embossed holograms on banknotes and cards. In **digital holography** a sensor records the fringes and a computer reconstructs the wave.

> [!key] A hologram records the interference of an object wave with a reference wave, so it holds amplitude and phase. Lit by the reference, its fringes, a grating of varying pitch, reconstruct the original wave. It needs coherent light and a steady setup.
`,
  ideas: [
    'A hologram records the interference pattern of the object wave and a reference wave, so it keeps the phase as well as the brightness.',
    'Lit with the reference beam, the developed fringes diffract light into the zero order, a virtual image (the original wave) and a real, conjugate image.',
    'A hologram is a grating of continuously varying pitch; that of a single point is a zone plate.',
    'The fringe spacing is Λ = λ/(2 sin(θ/2)): between 0.2 µm and 1.5 µm, which needs plates resolving thousands of lines per millimetre.',
    'Coherence length must exceed the path differences in the setup, and nothing may move by more than a fraction of a wavelength during exposure.'
  ],
  pitfalls: [
    'A hologram is a photograph with a clever trick — It records the phase of the light as fringe positions; a photograph does not. The pattern on a hologram is not an image of anything: it looks like a smudge or a pattern of lines.',
    'A hologram is a picture that you can only view from the angle it was taken at — It is a window: moving your head shows the scene from other angles, with parallax, within the size of the plate.',
    'A hologram can be viewed in any light — A transmission hologram needs light that is coherent and from the right direction; only reflection and rainbow holograms are viewed in white light, and those lose some colour or parallax.',
    'Cutting a hologram destroys the picture — Every part of the plate holds information about the whole object; a fragment shows the whole scene from a smaller window, with less depth of view and more speckle.'
  ],
  terms: [
    { term: 'Hologram', def: 'A recording of the interference pattern between an object wave and a reference wave, from which the original wave can be reconstructed by lighting it with the reference.' },
    { term: 'Reference beam', def: 'The clean, known wave (usually plane or spherical) that interferes with the object wave during recording and is used again to illuminate the hologram during playback.' },
    { term: 'Object beam', also: ['object wave'], def: 'The light scattered from the object toward the recording plate. Its amplitude and phase are what the hologram stores.' },
    { term: 'Reconstruction', also: ['playback', 'replay'], def: 'Lighting a developed hologram with the reference beam so that it diffracts light into a copy of the original object wave.' },
    { term: 'Twin image', also: ['conjugate image', 'real image'], def: 'The second diffracted order of a hologram, a real image with reversed depth, formed alongside the virtual image on playback.' },
    { term: 'Reflection hologram', also: ['Denisyuk hologram', 'volume hologram'], def: 'A hologram recorded with the beams entering from opposite sides of a thick emulsion, so that its fringes are layers that reflect one colour in white light.' },
    { term: 'Rainbow hologram', also: ['Benton hologram'], def: 'A transmission hologram that gives up vertical parallax so that it can be viewed in white light, each height showing a different colour. The embossed hologram of a bank card.' }
  ],
  formulas: [
    {
      name: 'Fringe spacing of two plane waves',
      expr: 'Lf = lambda/(2*sin(th/2))', tex: '\\Lambda = \\frac{\\lambda}{2\\sin(\\theta/2)}',
      vars: {
        Lf: { name: 'fringe spacing', q: 'length', unit: 'µm', tex: '\\Lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        th: { name: 'angle between the beams', q: 'angle', unit: '°', value: 30, min: 1, max: 180, tex: '\\theta' }
      },
      note: 'The lines per millimetre the recording material must resolve are 1/Λ.',
      stories: { Lf: 'A {lambda} reference beam and an object beam meet at {th} on a plate. What is the fringe spacing?', th: 'A plate can only resolve fringes {Lf} apart. What is the largest angle between a {lambda} object beam and reference beam?' }
    },
    {
      name: 'Coherence length',
      expr: 'Lc = lambda^2/dlam', tex: 'L_c = \\frac{\\lambda^2}{\\Delta\\lambda}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'cm', tex: 'L_c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        dlam: { name: 'spectral width of the source', q: 'length', unit: 'nm', value: 0.002, tex: '\\Delta\\lambda' }
      },
      note: 'The path difference between the object and reference beams must stay well below this.',
      stories: { Lc: 'A {lambda} source has a spectral width of {dlam}. What is its coherence length?', dlam: 'A hologram needs a coherence length of {Lc} at {lambda}. What spectral width may the source have at most?' }
    },
    {
      name: 'Bragg spacing of a reflection hologram',
      expr: 'Lb = lambda/(2*n)', tex: '\\Lambda_B = \\frac{\\lambda}{2n}',
      vars: {
        Lb: { name: 'spacing of the fringe planes', q: 'length', unit: 'nm', tex: '\\Lambda_B' },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        n: { name: 'refractive index of the emulsion', value: 1.5, min: 1, max: 2.5 }
      },
      note: 'Beams entering from opposite sides give planes half a wavelength (in the emulsion) apart, parallel to the plate.'
    }
  ],
  examples: [
    {
      title: 'What plate does a hologram need?',
      q: 'A transmission hologram is recorded with a 633 nm laser, the reference beam making 30° with the object beam. What fringe spacing must the plate resolve?',
      steps: [
        { text: 'The spacing is', tex: '\\Lambda = \\frac{\\lambda}{2\\sin(\\theta/2)} = \\frac{0.633\\ \\mu\\mathrm{m}}{2\\sin 15°} = 1.22\\ \\mu\\mathrm{m}' },
        'That is $1/1.22\\ \\mu\\mathrm{m} = 820$ lines/mm. A plate must resolve at least that: more than ordinary film but within reach of fine-grain emulsions.'
      ],
      a: '1.22 µm, 820 lines/mm. At 90° between the beams it would be 2200 lines/mm.'
    },
    {
      title: 'Why a red LED will not do',
      q: 'A red LED at 630 nm has a spectral width of 20 nm. What is its coherence length, and can it expose a hologram whose beams differ in path by a few millimetres across the plate?',
      steps: [
        { text: 'The coherence length is', tex: 'L_c = \\frac{\\lambda^2}{\\Delta\\lambda} = \\frac{(630\\ \\mathrm{nm})^2}{20\\ \\mathrm{nm}} = 19.8\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 20 µm: far less than a few millimetres, so the fringes would have no contrast at most of the plate. A helium–neon laser with 20 cm does the job.'
    }
  ],
  quiz: [
    { q: 'What does a hologram record that a photograph does not?', choices: ['The phase of the light', 'The colour of the light', 'The brightness of the light', 'The polarization only'], a: 0, why: 'The interference with a reference beam turns phase differences into fringe positions, which are recorded as brightness. A photograph records only intensity.' },
    { q: 'What is the fringe spacing between two beams of 532 nm light that meet at 90°?', answer: 0.376, unit: 'µm', why: '$\\Lambda = \\lambda/(2\\sin 45°) = 0.532/1.414 = 0.376$ µm, which is 2660 lines/mm.' },
    { q: 'A hologram is cut in half. What does each half show?', choices: ['The whole scene, through a smaller window', 'Half the scene', 'Nothing', 'The same scene but inverted'], a: 0, why: 'Each point of the plate receives light from every point of the object, so each part holds the whole scene, seen from a smaller range of positions.' },
    { q: 'A white-light lamp can be used instead of a laser to record a hologram if the exposure is long enough.', a: false, why: 'The problem is coherence, not brightness: white light has a coherence length of about a micrometre, so fringes would be visible only where the two path lengths agree to that precision.' },
    { q: 'On playback with the reference beam, a transmission hologram forms…', choices: ['a virtual image of the original object, and a conjugate real image', 'only a real image', 'only a virtual image', 'a copy of the reference beam only'], a: 0, why: 'The +1 and −1 diffracted orders are the original object wave (virtual image) and its conjugate (real, depth-reversed image), besides the zero-order beam.' }
  ],
  applications: [
    'Security: embossed rainbow holograms on banknotes, cards and packaging, hard to copy without the original master.',
    'Holographic optical elements: gratings, lenses, notch filters and head-up display combiners recorded as holograms ([[holographic-optical-elements]]).',
    'Holographic interferometry: two exposures of a part, before and after stress or heating, show displacements of a fraction of a wavelength.',
    'Digital holographic microscopy: a sensor records the fringes and a computer refocuses and measures phase, for cells and surfaces.',
    'Art and museum records of objects that cannot be handled, and data storage in the depth of a crystal.'
  ],
  history: 'Dennis Gabor invented holography in 1947 while trying to improve the electron microscope, and published it in 1948; he received the Nobel Prize in Physics in 1971. Without a coherent source it gave poor images until the laser. In 1962 Emmett Leith and Juris Upatnieks at the University of Michigan made off-axis laser holograms with striking depth, and Yuri Denisyuk in the Soviet Union recorded reflection holograms viewable in white light. Stephen Benton\'s rainbow hologram of 1968 made mass production of holograms possible.',
  sources: [
    'P. Hariharan, *Basics of Holography* (Cambridge University Press) — recording, playback, hologram types and materials.',
    'J. W. Goodman, *Introduction to Fourier Optics*, ch. 9 (Holography).',
    'E. Hecht, *Optics*, ch. 13 (Modern optics: lasers and other topics), the section on holography.',
    'D. Gabor, Nobel lecture, 1971, "Holography, 1948–1971" — the invention in its author\'s words.'
  ],
  sim: 'df-hologram'
},

/* ================================================================ everyday diffraction */
{
  id: 'diffraction-in-everyday-life', parent: 'diffraction', title: 'Diffraction you can see', level: 1,
  short: 'The rainbow on a compact disc, the spikes round a street lamp in a photograph, the coloured rings round the Moon in thin cloud, the streaks when you squint at a light, and the reason phone pixels cannot keep shrinking are all diffraction: light meeting something fine or something with edges.',
  keywords: ['CD rainbow', 'DVD', 'Blu-ray', 'track pitch', 'diffraction spikes', 'starburst', 'spider vanes', 'aperture blades', 'corona', 'Moon corona', 'squinting', 'eyelashes', 'feather', 'pixel size limit', 'iridescence', 'sunstar'],
  prereq: ['the-grating-equation', 'the-airy-disk', 'what-diffraction-is'],
  related: ['halos-glories-and-coronas', 'iridescence-and-structural-colour', 'camera-artefacts-as-illusions', 'optical-disc-pickups', 'sensor-formats-and-pixel-size', 'reflecting-telescopes', 'apertures-irises-and-pinholes', 'moire-patterns'],
  body: `
Diffraction hides in plain sight wherever light meets something fine or something with edges. Here are the places to look.

### A compact disc is a grating
The data on a compact disc lie in a spiral track with a pitch of 1.6 µm: 625 tracks per millimetre, a reflection grating. Tilt a disc in the light and rainbows sweep across it. At normal incidence the first order of green light (550 nm) leaves at $\\arcsin(0.55/1.6) = 20°$.

| Disc | Track pitch | Tracks per mm | First-order angle for 550 nm |
|---|---|---|---|
| CD | 1.6 µm | 625 | 20° |
| DVD | 0.74 µm | 1350 | 48° |
| Blu-ray | 0.32 µm | 3125 | none: $\\lambda/d > 1$ |

A DVD fans out more widely than a CD, and a Blu-ray shows almost no rainbow at ordinary angles, because its pitch is shorter than the wavelength of visible light. (Lit very obliquely, it does diffract.) The shorter pitch is what lets a Blu-ray hold much more: it is read with a violet laser (405 nm) whose spot is smaller ([[optical-disc-pickups]]).

### Starbursts and spikes
In a night photograph, a street lamp often has spikes. The blades of the lens's iris make a polygon; each straight edge diffracts light in the direction perpendicular to itself, giving a streak per edge. With an even number of blades $N$, opposite edges are parallel and their streaks coincide: $N$ spikes. With an odd number, each streak points both ways: $2N$ spikes. Seven blades give 14 spikes, eight give eight. Round blades give few. Reflecting telescopes show spikes from the thin **spider** vanes holding the secondary mirror: four vanes give four spikes, three give six. Hubble pictures show four spikes round bright stars, the James Webb telescope eight (six from its hexagonal mirror segments, two from a support strut).

### Coronas round the Moon
Thin cloud of droplets of nearly equal size makes coloured rings round the Moon or Sun, blue inside and red outside: a **corona**. Each droplet diffracts like a disc, and the first ring is at roughly $1.22\\,\\lambda/d$: for droplets 20 µm across, about 2° for green light, for 40 µm droplets 1°. Smaller droplets, larger corona. It is not the 22° **halo**, which is refraction in ice crystals ([[halos-glories-and-coronas]]).

### Squinting and feathers
Look at a street lamp through half-closed eyes: the narrow slit between the lids spreads the light at right angles to the slit, so a horizontal slit gives vertical streaks. The eyelashes are a coarse grating that adds coloured streaks. A fine fabric, an umbrella or a bird's feather held up to a point source shows a coloured cross of spots, the diffraction pattern of its two-dimensional weave. The colours of many birds' and insects' feathers and wings arise from structures of a similar scale ([[iridescence-and-structural-colour]]).

### Why pixels cannot shrink for ever
A lens at f/1.8 makes an Airy disc 2.4 µm across in green light; at f/2.8 it is 3.8 µm. Phone sensors have pixels of 0.6 to 1.2 µm, smaller than the disc: the lens cannot put different detail on neighbouring pixels. Makers combine groups of four or sixteen pixels into one, which restores sensitivity if not detail. For a camera with 4.3 µm pixels, diffraction begins to soften the picture at about f/8, where the disc is 10.7 µm ([[the-airy-disk]]).

> [!key] Fine regular structures act as gratings (a disc's tracks, a feather's barbs), straight edges make spikes perpendicular to themselves (iris blades, spider vanes), and small round apertures or droplets make rings: all of them are the diffraction patterns of the earlier pages.
`,
  ideas: [
    'A CD has a track pitch of 1.6 µm, a DVD 0.74 µm: reflection gratings that send each colour to its own angle.',
    'A Blu-ray disc (pitch 0.32 µm) is shorter than the wavelength of visible light and has almost no rainbow at ordinary angles.',
    'A polygonal aperture makes one spike per edge direction: N spikes for even N, 2N for odd N; spider vanes make the same.',
    'Thin cloud makes a corona, with blue inside and red outside, from droplets that diffract like discs: about 1.22 λ/d.',
    'Pixels smaller than the Airy disc of the lens add no resolution: they can only be binned.'
  ],
  pitfalls: [
    'The rainbow on a CD is a thin-film effect, like a soap bubble — It is diffraction from the track structure: the colours follow the grating equation and change with the viewing angle, as they do for any grating.',
    'The spikes round stars in a photograph are in the stars — They are in the aperture of the lens or telescope: the same star photographed with a round aperture has none. Opposite edges give the same spike.',
    'A corona and a halo are the same thing — A corona (diffraction by droplets, radius a few degrees, blue inside) is different from a halo (refraction in ice, radius 22°, red inside).',
    'More megapixels always give a sharper picture — Past the point where the Airy disc spans more than a pixel or two, extra pixels only oversample the same blur.'
  ],
  terms: [
    { term: 'Diffraction spike', also: ['starburst', 'sunstar', 'star effect'], def: 'A streak of light running out from a bright point at right angles to each straight edge of the aperture. A polygon of N edges gives N spikes for even N and 2N for odd N.' },
    { term: 'Spider', also: ['spider vanes', 'secondary support'], def: 'The thin vanes that hold the secondary mirror of a reflecting telescope. Their straight edges produce diffraction spikes on bright stars.' },
    { term: 'Corona', also: ['aureole'], def: 'Coloured rings round the Moon or Sun seen through thin cloud, caused by diffraction by droplets of nearly equal size; blue inside, red outside.' },
    { term: 'Track pitch', def: 'The distance between neighbouring turns of the spiral data track of an optical disc: 1.6 µm for a CD, 0.74 µm for a DVD, 0.32 µm for a Blu-ray disc. It is the period of the disc as a grating.' }
  ],
  formulas: [
    {
      name: 'First-order direction from a disc',
      expr: 'p*sin(t) = lambda', tex: 'p\\,\\sin\\theta = \\lambda',
      vars: {
        p: { name: 'track pitch', q: 'length', unit: 'µm', value: 1.6 },
        t: { name: 'first-order angle', q: 'angle', unit: '°', value: 20, min: 0, max: 90, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Normal incidence; no solution when the pitch is shorter than the wavelength.',
      stories: { t: 'Light of {lambda} meets a disc with a track pitch of {p} head-on. At what angle does the first order leave?', lambda: 'The first-order light from a disc of {p} pitch leaves at {t} from the normal. What is its wavelength?' }
    },
    {
      name: 'Radius of a corona',
      expr: 'th = 1.22*lambda/d', tex: '\\theta = 1.22\\,\\frac{\\lambda}{d}',
      vars: {
        th: { name: 'angular radius of the first ring', q: 'angle', unit: '°', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        d: { name: 'droplet diameter', q: 'length', unit: 'µm', value: 20 }
      },
      note: 'A rough rule; the bright rings lie slightly farther out. Smaller droplets give a larger corona.',
      stories: { th: 'Cloud droplets {d} across diffract {lambda} light. At what angle from the Moon is the first dark ring of the corona?', d: 'A corona of {lambda} light has its first ring at {th}. How large are the droplets?' }
    },
    {
      name: 'Where diffraction exceeds the pixel',
      expr: 'N = p/(2.44*lambda)', tex: 'N = \\frac{p}{2.44\\,\\lambda}',
      vars: {
        N: { name: 'f-number at which the Airy disc equals one pixel' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 4.3 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Stopped down to two or three times this f-number, a lens is clearly diffraction-limited on that sensor. For pixels under about 1.3 µm the result is below f/1: no real lens can make a disc that small.',
      stories: { N: 'A sensor has pixels {p} wide. At what f-number is the Airy disc of {lambda} light as wide as one pixel?' }
    }
  ],
  examples: [
    {
      title: 'The rainbow of a CD',
      q: 'White light, 420 nm to 650 nm, falls head-on on a CD (track pitch 1.6 µm). Over what range of angles does the first-order spectrum spread?',
      steps: [
        { text: 'Violet: $\\sin\\theta = 0.42/1.6 = 0.2625$, so $\\theta = 15.2°$. Red:', tex: '\\sin\\theta = \\frac{0.65}{1.6} = 0.406 \\quad\\Rightarrow\\quad \\theta = 24.0°' }
      ],
      a: 'From 15.2° (violet) to 24.0° (red), a fan 8.8° wide. On a DVD (0.74 µm) it would run from 34.6° to 61.4°.'
    },
    {
      title: 'A corona round the Moon',
      q: 'The Moon is surrounded by a corona whose red ring (650 nm) lies 2.0° from the centre. How big are the droplets?',
      steps: [
        { text: 'From $\\theta = 1.22\\lambda/d$,', tex: 'd = \\frac{1.22\\lambda}{\\theta} = \\frac{1.22 \\times 0.65\\ \\mu\\mathrm{m}}{0.0349} = 23\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 23 µm, typical of cloud droplets (10–30 µm).'
    }
  ],
  quiz: [
    { q: 'A lens has an aperture with seven straight blades. How many diffraction spikes does a bright point of light show?', answer: 14, why: 'For an odd number of edges $N$, no two edges are parallel, so each edge produces a streak in both directions: $2N = 14$ spikes. An eight-bladed iris gives only eight.' },
    { q: 'At normal incidence, 550 nm light meets a Blu-ray disc (track pitch 0.32 µm). The first order…', choices: ['does not exist: the pitch is shorter than the wavelength', 'leaves at 20°', 'leaves at 48°', 'leaves at 90°'], a: 0, why: '$\\sin\\theta = \\lambda/d = 0.55/0.32 = 1.7 > 1$: no first order. The disc looks silvery except at very oblique angles.' },
    { q: 'A corona has blue light inside and red outside.', a: true, why: 'The ring radius is $1.22\\lambda/d$, larger for the longer wavelength. A halo, by contrast, has its red edge inside.' },
    { q: 'A DVD has a track pitch of 0.74 µm. At what angle does it send 600 nm light, first order, for normal incidence? Give the angle in degrees.', answer: 54.2, unit: '°', why: '$\\sin\\theta = 0.6/0.74 = 0.811$, so $\\theta = 54.2°$.' },
    { q: 'A phone camera with a lens at f/1.8 and 0.7 µm pixels is used in green light. What is the relation of the Airy disc to the pixel?', choices: ['The disc (2.4 µm) is over three pixels wide', 'The disc is smaller than a pixel', 'They are equal', 'The disc has no size'], a: 0, why: '$2.44\\lambda N = 2.44 \\times 0.55 \\times 1.8 = 2.4$ µm, 3.4 pixels of 0.7 µm. Neighbouring pixels cannot show independent detail.' }
  ],
  applications: [
    'Reading optical discs: the pitch sets the laser wavelength and lens aperture; the first-order light diffracted by the track gives the tracking signal.',
    'Photography: choosing the aperture and the iris shape for pleasant sunstars (an odd number of straight blades, a small aperture) or for none.',
    'Astronomy: telescope designs with curved or very thin vanes to reduce spikes, and image processing to remove them.',
    'Weather watching: the size of a corona gives the size of cloud droplets; a changing corona shows the droplets growing or shrinking.',
    'Everyday checks: a laser pointer through a hair, a fine mesh or a CD gives the dimensions of fine structures in the classroom.'
  ],
  history: 'Thomas Young explained the corona by diffraction in the early 1800s, and used the rings made by a thin cloud of fine particles to build an instrument, the eriometer, for measuring the thickness of wool fibres. Marcel Minnaert\'s *Light and Colour in the Open Air*, first published in Dutch in the late 1930s, made these everyday effects a classic of popular optics. The spikes of reflecting telescopes were a nuisance to astronomers long before they became a feature of photographs.',
  sources: [
    'M. Minnaert, *Light and Colour in the Open Air* — coronas, glories and diffraction effects in the sky.',
    'D. K. Lynch and W. Livingston, *Color and Light in Nature* (Cambridge University Press) — coronas, iridescent clouds and diffraction in nature.',
    'E. Hecht, *Optics*, ch. 10 — diffraction by apertures and by obstacles; the diffraction grating.',
    'ECMA-130 (equivalent to ISO/IEC 10149), the standard for read-only 120 mm optical discs (CD-ROM) — it fixes the 1.6 µm track pitch of the compact disc.'
  ],
  sim: ['df-disc', 'df-spikes']
}

);
