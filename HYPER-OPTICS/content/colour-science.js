/* HYPER-OPTICS · content/colour-science.js — the topic "Colour" (colour-science), 13 concepts
 *   trichromatic-colour-vision · opponent-colours · cie-colour-matching-and-xyz · the-chromaticity-diagram · colour-spaces-and-gamuts ·
 *   the-munsell-colour-system · colour-wheels-and-harmony · additive-and-subtractive-mixing · metamerism · colour-difference-and-tolerance ·
 *   white-balance-and-chromatic-adaptation · colour-appearance-and-constancy · where-colours-come-from
 * Simulations: sims/colour-science.js (prefix cs-).
 */
Hyper.add(

/* ================================================================ three cones */
{
  id: 'trichromatic-colour-vision', parent: 'colour-science', title: 'Three cones: trichromatic vision', level: 1,
  short: 'The retina catches daylight with three kinds of cone, sensitive mainly to long, medium and short wavelengths. Each kind reports a single number for whatever light reaches it, so the whole spectrum from one point of a scene is reduced to three numbers, and three lights can therefore match almost any colour.',
  keywords: ['cones', 'L cone', 'M cone', 'S cone', 'trichromacy', 'trichromatic theory', 'Young–Helmholtz', 'three primaries', 'photoreceptor', 'colour vision', 'univariance', 'spectral sensitivity', 'red green blue cones', 'long medium short wavelength'],
  prereq: ['the-retina-rods-and-cones', 'wavelength-frequency-and-colour'],
  related: ['opponent-colours', 'cie-colour-matching-and-xyz', 'the-luminosity-function', 'colour-vision-deficiency', 'light-and-dark-adaptation', 'metamerism', 'physics:color-vision', 'feynman:color-vision-feyn'],
  body: `
Look at a ripe tomato beside a green leaf. Light of a hundred wavelengths comes from each, yet the eye ends up with just **three signals** from every point of the scene. The reason lies in the retina: in daylight it sees with **cones**, and there are three kinds.

### The three cone types
Each cone holds one of three light-sensitive pigments. Measured on the pigments themselves, the absorption peaks lie near 420 nm (**S**, short wavelengths), 534 nm (**M**, medium) and 564 nm (**L**, long). The names "blue", "green" and "red" cones are common but misleading: the L cone peaks in a yellowish green, and no cone sees a single colour. Light reaching the retina has also crossed the lens and the macular pigment, which absorb at the short end, so measured at the cornea the sensitivities peak near 445, 543 and 566 nm, as drawn in the simulation. An eye has about six million cones, mostly L and M; S cones are a small share, a few per cent up to about a tenth, and are missing from the very centre of the fovea. The ratio of L to M cones differs widely between people with normal colour vision.

| Light | L cones | M cones | S cones |
|---|---|---|---|
| 450 nm (violet-blue) | 2 % | 6 % | 99 % |
| 500 nm (blue-green) | 26 % | 40 % | 15 % |
| 550 nm (green) | 95 % | 99 % | 0.5 % |
| 580 nm (yellow) | 97 % | 65 % | 0 % |
| 600 nm (orange) | 80 % | 31 % | 0 % |
| 650 nm (red) | 16 % | 1 % | 0 % |

Each entry is the response to equal-energy light as a share of that cone type's own peak, from the cone curves of the simulation.

### Three numbers, whatever the spectrum
A cone cannot tell *which* wavelength it caught: an absorbed photon of 500 nm and an absorbed photon of 600 nm give the same signal, and wavelength only changes the chance of absorption. This is the **principle of univariance**. Each cone type therefore adds up, over all wavelengths, the light weighted by its own curve:

$$L = \\int S(\\lambda)\\,\\ell(\\lambda)\\,d\\lambda,\\qquad M = \\int S(\\lambda)\\,m(\\lambda)\\,d\\lambda,\\qquad S_{\\mathrm{c}} = \\int S(\\lambda)\\,s(\\lambda)\\,d\\lambda$$

Two lights with different spectra but the same three integrals are **the same colour** to the eye. A yellow of 580 nm can be matched by 0.62 parts of 540 nm green and 2.6 parts of red at 650 nm, because that mixture pushes the L and M cones exactly as the yellow does. This is why a screen needs only three kinds of emitter and a camera only three filters.

### What it does not say
The cone signals are not sent to the brain as they are: the next stage forms differences ([[opponent-colours]]). Three numbers are also all that is kept, so the spectrum cannot be recovered and many different spectra look alike ([[metamerism]]). L and M together give the eye's brightness response, which is the [[the-luminosity-function|luminosity function]] with its peak at 555 nm. At night the cones fall silent and the rods, with a single pigment, give no colour at all ([[light-and-dark-adaptation]]).

> [!note] Not every animal has three cone types. Most mammals have two; many birds, fish and reptiles have four or more, and some of them see into the ultraviolet.

> [!key] The eye turns every spectrum into three numbers, one per cone type. Lights that give the same three numbers look identical, which is why three primaries can match any colour.
`,
  ideas: [
    'Daylight vision uses three cone types, most sensitive to long (L), medium (M) and short (S) wavelengths; about 6 million cones per eye.',
    'A cone reports only how much light it caught, not at which wavelength (univariance); so each type gives one number.',
    'Every spectrum is reduced to three numbers; lights with equal numbers are the same colour.',
    'The L and M curves overlap strongly; S is separate and the least numerous.',
    'Three primary lights can match nearly any colour because three numbers are all the eye keeps.'
  ],
  pitfalls: [
    'The cones are red, green and blue detectors — They are tuned to long, medium and short wavelengths. The L cone peaks in yellowish green, and the colour red appears when L is driven far more than M.',
    'Colour is a property of a wavelength — A wavelength is physical; a colour is what three cone signals make of a whole spectrum. Very different spectra can look the same.',
    'Red, green and blue are special primaries chosen by nature — Any three lights, none a mixture of the other two, can serve. Red, green and blue are chosen because together they reach a large range of colours.',
    'Everyone sees the same colours — The proportion of L to M cones, the yellowing of the lens and the exact pigments vary from person to person.'
  ],
  terms: [
    { term: 'L, M and S cones', also: ['long-, medium- and short-wavelength cones', 'red, green and blue cones'], def: 'The three cone types, whose pigments absorb most near 564, 534 and 420 nm. Each reports one number per point of the image.' },
    { term: 'Trichromacy', also: ['trichromatic vision', 'Young–Helmholtz theory'], def: 'Colour vision based on three independent signals. It is why three primary lights are enough to match any colour.' },
    { term: 'Principle of univariance', def: 'A photoreceptor’s signal depends only on how many photons it absorbs, not on their wavelength; wavelength matters only through the chance of absorption.' },
    { term: 'Spectral sensitivity', also: ['sensitivity curve'], def: 'How strongly a detector responds to light of each wavelength, drawn as a curve. The three cone curves are broad and overlap.' }
  ],
  formulas: [
    {
      name: 'Luminous flux of a single wavelength',
      expr: 'Phiv = Km*V*Phie', tex: '\\Phi_v = K_m\\,V(\\lambda)\\,\\Phi_e',
      vars: {
        Phiv: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi_v' },
        Km: { const: 'Km', tex: 'K_m' },
        V: { name: 'luminous efficiency of the eye at that wavelength (peak 1)', value: 0.107, min: 0, max: 1 },
        Phie: { name: 'radiant power', q: 'power', unit: 'W', value: 1, tex: '\\Phi_e' }
      },
      note: 'Only L + M count for brightness: V(λ) is 1.000 at 555 nm and 0.107 at 650 nm.',
      stories: { Phiv: 'A red laser of {Phie} at 650 nm, where the eye’s efficiency is {V}, is switched on. How many lumens does it give?', Phie: 'A lamp of one wavelength, where V = {V}, is to give {Phiv}. What radiant power does it need?' }
    }
  ],
  examples: [
    {
      title: 'Matching a yellow with a red and a green',
      q: 'The cone curves give, as shares of each cone\'s own peak, L = 0.965 and M = 0.650 for a 580 nm light; L = 0.883 and M = 0.996 for 540 nm; L = 0.160 and M = 0.012 for 650 nm. How much 540 nm and 650 nm light, in units of the 580 nm light, reproduces the L and M signals of the yellow?',
      steps: [
        'Let $a$ be the amount of 540 nm light and $b$ the amount of 650 nm light. The L and M signals must both match:',
        { text: 'Two equations in two unknowns:', tex: '0.883\\,a + 0.160\\,b = 0.965 \\qquad 0.996\\,a + 0.012\\,b = 0.650' },
        'From the second, $a = (0.650 - 0.012\\,b)/0.996$. Putting that into the first gives $0.1494\\,b = 0.3887$, so $b = 2.60$ and then $a = 0.62$.',
        'At these wavelengths the S cones respond hardly at all (0.011 and 0 on the same scale), so nothing is left to tell the mixture from the yellow.'
      ],
      a: '0.62 parts of 540 nm and 2.6 parts of 650 nm: a mixture that looks exactly like the 580 nm yellow, though it contains no 580 nm light.'
    },
    {
      title: 'Two lasers of equal power',
      q: 'A 555 nm green laser and a 650 nm red laser each emit 1 W. Compare the luminous fluxes.',
      steps: [
        { text: 'Green, where $V = 1.000$:', tex: '\\Phi_v = 683 \\times 1.000 \\times 1\\ \\mathrm{W} = 683\\ \\mathrm{lm}' },
        { text: 'Red, where $V = 0.107$:', tex: '\\Phi_v = 683 \\times 0.107 \\times 1\\ \\mathrm{W} = 73\\ \\mathrm{lm}' }
      ],
      a: '683 lm against 73 lm: the green looks about nine times brighter, because it excites L and M together far more strongly than the red does.'
    }
  ],
  quiz: [
    { q: 'A 600 nm light and a mixture of 540 nm and 650 nm light give an observer exactly the same L, M and S signals. What will the observer see?', choices: ['The same colour in both', 'Two different colours, because the wavelengths differ', 'The mixture slightly redder', 'It depends on the brightness only'], a: 0, why: 'The brain receives only the three cone signals. If they are equal, the lights are indistinguishable, whatever their spectra.' },
    { q: 'A single cone type can tell which wavelength it has absorbed.', a: false, why: 'Univariance: the signal depends only on the number of photons absorbed. A dim light at the peak wavelength and a bright one at the edge of the curve can give the same signal, which is why one cone type alone gives no colour.' },
    { q: 'Light of 450 nm excites mainly which cone type?', choices: ['S', 'M', 'L', 'All three about equally'], a: 0, why: 'At 450 nm the S curve is at its peak (99 % in the table) while L and M respond with a few per cent.' },
    { q: 'How many lumens does 1 W of green light at 555 nm give?', answer: 683, unit: 'lm', why: 'At 555 nm the luminous efficiency is 1, and the conversion factor is 683 lm/W.' },
    { q: 'Why can you see no colour on a moonless night, though your eyes are open?', choices: ['The cones are too insensitive and the rods, with one pigment, take over', 'The pupil closes', 'Colour is only a property of the light source', 'The S cones fail first and the others follow'], a: 0, why: 'Cones need a fair amount of light. At night only the rods respond, and one pigment gives only one number: brightness without colour.' }
  ],
  applications: [
    'Displays and projectors: three kinds of emitter (red, green and blue) are enough because the eye keeps only three numbers.',
    'Cameras and scanners: each pixel sits behind one of three filters, so that the recorded triple resembles what the cones would have reported.',
    'Colour-vision tests and genetics: finding which cone type is missing or shifted explains the common deficiencies ([[colour-vision-deficiency]]).',
    'Lighting design: a lamp made of three narrow bands can look white to the eye yet render coloured objects poorly ([[colour-temperature-and-colour-rendering]]).',
    'Animal vision and imaging: bees, birds and many insects see the ultraviolet, and cameras sensitive to it show patterns on flowers that people cannot see.'
  ],
  history: 'Thomas Young suggested in 1802 that the eye needs only three kinds of receptor, each most sensitive to one part of the spectrum. Hermann von Helmholtz revived and measured the idea in the 1850s and James Clerk Maxwell tested it with colour-matching experiments: from them came the first colour photograph in 1861. Not until 1964 did two groups measure the absorption of single human cones and find the three pigments directly.',
  sources: [
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae*, 2nd ed. — the cone fundamentals and the colour-matching experiments.',
    'A. Stockman and L. T. Sharpe, "The spectral sensitivities of the middle- and long-wavelength-sensitive cones derived from measurements in observers of known genotype", *Vision Research* 40 (2000) 1711–1737.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the retina, the photoreceptors and the ocular media.'
  ],
  sim: [{ id: 'cs-cones', params: { mode: 'cones' } }]
},

/* ================================================================ opponent colours */
{
  id: 'opponent-colours', parent: 'colour-science', title: 'Opponent colours', level: 2,
  short: 'After the cones the visual system does not keep three separate signals but their differences: a red–green channel, a blue–yellow channel and a light–dark channel. Each can swing only one way at a time, which is why there is no reddish green and no yellowish blue, and why a tired patch of retina leaves a complementary afterimage.',
  keywords: ['opponent process', 'Hering', 'red-green', 'blue-yellow', 'unique hues', 'afterimage', 'complementary', 'L minus M', 'chromatic channels', 'colour opponency', 'reddish green', 'cone opponency', 'luminance channel'],
  prereq: ['trichromatic-colour-vision', 'the-retina-rods-and-cones'],
  related: ['cie-colour-matching-and-xyz', 'colour-wheels-and-harmony', 'colour-illusions-and-afterimages', 'colour-vision-deficiency', 'colour-appearance-and-constancy', 'colour-spaces-and-gamuts', 'physics:color-vision'],
  body: `
Try to imagine a reddish green, or a yellowish blue. You cannot, though a bluish green (turquoise) and a reddish yellow (orange) come easily. Colour names behave as if there were two axes, each with two ends that exclude each other. Ewald Hering proposed this in 1878, and the signals that carry it out have since been found in the retina.

### Differences of cone signals
The three cone signals overlap a great deal (the L and M curves are largely the same), so sending them separately would waste capacity. Cells of the retina combine them into three channels:

| Channel | Built roughly as | One end | Other end |
|---|---|---|---|
| red–green | $L - M$ | red | green |
| blue–yellow | $S - (L + M)/2$ | blue | yellow |
| light–dark | $L + M$ | light | dark |

A channel is silent when its two ends cancel. In the simple model of the simulation (each cone signal scaled so that daylight gives 1) the red–green signal of an equal-energy spectral light changes sign at 567 nm and the blue–yellow signal at 497 nm. People asked to set a "pure" colour choose a pure yellow near 570 to 580 nm, a pure blue near 470 to 480 nm and a pure green anywhere from about 500 to 540 nm, with large differences between individuals. A pure red is not found in the spectrum: its long-wavelength end always looks slightly yellowish, and the purest reds contain a little short-wavelength light.

### Why there is no reddish green
Mix a 650 nm red and a 530 nm green. In the model the red–green signal is cancelled exactly when the green provides 31 % of the light; the sum looks yellow, carried by the other channels. A 470 nm blue and a 580 nm yellow cancel in the blue–yellow channel when the yellow provides 56 % of the light, and the sum looks nearly white. The members of each pair are **opponent**: a channel pushed one way cannot be pushed the other.

### What this explains
- The four **unique hues**, red, yellow, green and blue, each of which can be described without naming another. Orange is a yellowish red, turquoise a bluish green.
- **Afterimages**: stare at a red patch and the cells that signal red tire; on a grey wall the opposite signal wins and a cyan-green ghost appears ([[colour-illusions-and-afterimages]]).
- The shape of **colour spaces**: the a* and b* axes of CIELAB are red–green and yellow–blue ([[colour-spaces-and-gamuts]]), and video and image files carry one brightness signal and two colour-difference signals, the same economy the retina found.
- The **colour-vision deficiencies**: the common ones lose the red–green difference ([[colour-vision-deficiency]]).

### Two stages, not two theories
For decades the three-cone theory of Young and Helmholtz and the opponent theory of Hering were rivals. Both are right, at different levels: the cones are trichromatic, and the circuits behind them are opponent.

> [!key] The brain works with differences, not with the three cone signals themselves: red against green, blue against yellow, light against dark. A channel cannot signal both ends at once, so there is no reddish green.
`,
  ideas: [
    'The cone signals are recombined into a red–green channel (L − M), a blue–yellow channel (S − (L + M)/2) and a light–dark channel (L + M).',
    'A channel can lean to one end or the other, not both: there is no reddish green or yellowish blue.',
    'Mixing two opponent lights in the right proportion cancels a channel: red and green leave yellow, blue and yellow leave white.',
    'Afterimages, unique hues and the axes of colour spaces all follow from the opponent stage.',
    'Trichromacy at the cones and opponency after them are two stages of one system, not rival theories.'
  ],
  pitfalls: [
    'The opponent theory replaced the three-cone theory — Both are true: the cones are three, and the next stage forms differences. The three cone types explain colour matching, the opponent channels explain colour appearance.',
    'Red and green light cannot be mixed — They can: the sum is a yellow. What cannot happen is a colour that looks both red and green at once.',
    'Complementary colours are an invention of painters — They follow from the opponent channels and are measurable: two lights are complementary if their sum looks neutral.',
    'The red–green channel needs red and green cones — It is built from L and M, whose curves are close neighbours; that closeness is why the common deficiencies of L or M make red and green hard to tell apart.'
  ],
  terms: [
    { term: 'Opponent colours', also: ['opponent process', 'colour opponency'], def: 'Pairs of colours that cannot be seen together in one patch because the visual system signals them on one channel with opposite signs: red–green and blue–yellow.' },
    { term: 'Red–green channel', def: 'The difference of the L and M cone signals. Positive means a reddish look, negative a greenish look, zero neither.' },
    { term: 'Blue–yellow channel', def: 'The S cone signal against the sum of L and M. Positive means bluish, negative yellowish.' },
    { term: 'Unique hue', def: 'A colour that looks pure, with no trace of its neighbours: unique red, yellow, green and blue. Unique red is not a spectral colour.' },
    { term: 'Afterimage', def: 'A coloured ghost seen after staring at a coloured patch, in the opponent colour, produced by the tired cells of that channel.' }
  ],
  formulas: [
    {
      name: 'Red–green signal',
      expr: 'rg = L - M', tex: '\\mathrm{RG} = L - M',
      vars: {
        rg: { name: 'red–green signal', signed: true, tex: '\\mathrm{RG}' },
        L: { name: 'L-cone signal, relative to the signal for white', value: 1.2 },
        M: { name: 'M-cone signal, relative to the signal for white', value: 0.9 }
      },
      note: 'Positive: reddish; negative: greenish; zero: neither. White gives L = M and so 0.',
      stories: { rg: 'A patch drives the L cones at {L} and the M cones at {M} of their white level. What is the red–green signal?' }
    },
    {
      name: 'Blue–yellow signal',
      expr: 'by = S - (L + M)/2', tex: '\\mathrm{BY} = S - \\frac{L + M}{2}',
      vars: {
        by: { name: 'blue–yellow signal', signed: true, tex: '\\mathrm{BY}' },
        S: { name: 'S-cone signal, relative to white', value: 0.1 },
        L: { name: 'L-cone signal, relative to white', value: 1.2 },
        M: { name: 'M-cone signal, relative to white', value: 0.9 }
      },
      note: 'Positive: bluish; negative: yellowish. White gives S = L = M and so 0.'
    }
  ],
  examples: [
    {
      title: 'What colour is a patch with L = 1.2, M = 0.9, S = 0.1?',
      q: 'All signals are given relative to their value for white, which is 1 for each cone type. Classify the patch with the two opponent formulas.',
      steps: [
        { text: 'Red–green:', tex: 'RG = L - M = 1.2 - 0.9 = +0.3' },
        { text: 'Blue–yellow:', tex: 'BY = S - \\frac{L + M}{2} = 0.1 - 1.05 = -0.95' },
        'The red–green channel leans a little towards red, and the blue–yellow channel leans strongly towards yellow.'
      ],
      a: 'A strong yellow with a hint of red: an orange-yellow, and bright, since $L + M$ is large.'
    },
    {
      title: 'Cancelling red against green',
      q: 'In the model, the red–green signal of a 650 nm light is +0.142 and that of a 530 nm light is −0.318 (equal energy for both). What share of the light must be 530 nm for the red–green signal to vanish?',
      steps: [
        { text: 'Let $s$ be the share of green. The signal of a mixture is the weighted sum:', tex: '(1 - s)\\,(+0.142) + s\\,(-0.318) = 0' },
        { text: 'Solving:', tex: 's = \\frac{0.142}{0.142 + 0.318} = 0.31' }
      ],
      a: '31 % green and 69 % red, by energy. The mixture has no red–green signal and so looks yellow, neither reddish nor greenish.'
    }
  ],
  quiz: [
    { q: 'Which of these colour descriptions has no counterpart in normal colour vision?', choices: ['Reddish green', 'Reddish yellow', 'Bluish green', 'Yellowish green'], a: 0, why: 'Red and green are the two ends of one channel and cannot both be signalled. The other three combine colours from different channels or neighbours on the same side.' },
    { q: 'The opponent theory contradicts the trichromatic theory, so only one of them can be right.', a: false, why: 'The cones are three types (trichromacy) and the signals are then recombined into opponent channels. Each theory describes a different stage.' },
    { q: 'After staring at a yellow patch you look at a white wall. The afterimage is:', choices: ['bluish', 'yellow again', 'red', 'black'], a: 0, why: 'The cells signalling yellow have tired, so the blue–yellow channel tips towards its other end.' },
    { q: 'Which channel is built from $L + M$?', choices: ['Light–dark', 'Red–green', 'Blue–yellow', 'None of them'], a: 0, why: 'The sum of L and M follows the luminosity function and carries brightness; the differences carry colour.' },
    { q: 'A patch has L = 1.3 and M = 0.7 (relative to white). What is its red–green signal?', answer: 0.6, why: '$RG = L - M = 1.3 - 0.7 = 0.6$: clearly reddish.' }
  ],
  applications: [
    'Video and image compression: one brightness signal (luma) and two colour-difference signals, with the colour signals stored at lower resolution because the eye is less sensitive to them.',
    'Colour spaces such as CIELAB, whose axes are red–green (a*) and yellow–blue (b*) ([[colour-spaces-and-gamuts]]).',
    'Colour-safe design: signals and charts that rely on red against green alone fail for a person with a red–green deficiency; adding a difference in lightness fixes it ([[colour-vision-deficiency]]).',
    'Photography and film: colour grading often works on the opponent axes, pushing shadows towards blue-green and skin towards orange.'
  ],
  history: 'Ewald Hering published the opponent theory in 1878, arguing from how colours look: yellow does not look like a mixture of red and green, and no colour looks both red and green. It was neglected for decades beside the trichromatic theory. Dorothea Jameson and Leo Hurvich made it quantitative in 1957 by measuring how much green light cancels the red in a spectral light, and in the 1960s Russell De Valois found cells in the monkey brain that behaved exactly as the theory predicted.',
  sources: [
    'L. M. Hurvich and D. Jameson, "An opponent-process theory of color vision", *Psychological Review* 64 (1957) 384–404.',
    'G. Buchsbaum and A. Gottschalk, "Trichromacy, opponent colours coding and optimum colour information transmission in the retina", *Proceedings of the Royal Society B* 220 (1983) 89–113.',
    'G. Wyszecki and W. S. Stiles, *Color Science*, 2nd ed. — the chapters on colour appearance and on theories of colour vision.'
  ],
  sim: [{ id: 'cs-cones', params: { mode: 'opponent' } }]
},

/* ================================================================ CIE matching and XYZ */
{
  id: 'cie-colour-matching-and-xyz', parent: 'colour-science', title: 'CIE colour matching and XYZ', level: 2,
  short: 'The CIE standard observer turns a spectrum into three numbers, X, Y and Z, by weighting it with three agreed curves. They come from the colour-matching experiments of the 1920s, recast so that all three curves are positive and Y is the luminance. Two lights with equal XYZ match for the standard observer, whatever their spectra.',
  keywords: ['CIE 1931', 'XYZ', 'tristimulus values', 'colour-matching functions', 'standard observer', '2 degree observer', '10 degree observer', 'x bar y bar z bar', 'Wright', 'Guild', 'primaries', 'imaginary primaries', 'luminance Y', 'Grassmann', 'colorimetry'],
  prereq: ['trichromatic-colour-vision', 'the-luminosity-function'],
  related: ['the-chromaticity-diagram', 'colour-spaces-and-gamuts', 'metamerism', 'additive-and-subtractive-mixing', 'spectrophotometers', 'physics:color-mixing', 'math:matrix-multiplication'],
  body: `
How do you write down a colour so that someone else can reproduce it? The answer, agreed in 1931, is to ask which three lights would match it for a typical observer, and to count those lights in a standard way.

### The matching experiment
An observer looks at a divided disc about 2° across. One half shows a test light, a single wavelength. On the other half three **primary lights**, here 700, 546.1 and 435.8 nm, are adjusted until the halves look the same. Repeat for every wavelength and you have three curves, the **colour-matching functions**. William Wright (ten observers) and John Guild (seven) did this around 1930 with results that agreed closely; the CIE averaged them. Matching is **linear** (Grassmann's laws, 1853): doubling the test light doubles the amounts, and the amounts for a mixture are the sums.

### Negative amounts, and the move to X, Y, Z
For many test lights no positive amount of the primaries will do. A 500 nm light is more saturated than any mixture of the three, so the red primary has to be *added to the test half* instead; counted as a negative amount, the red needed for 500 nm is about −0.84 times the green, with the blue at 0.56 times the green (in units where equal-energy white needs equal amounts of the three). Negative numbers were awkward for calculating by hand, so the CIE replaced the primaries by three **imaginary** ones, X, Y and Z, chosen so that

1. the new curves $\\bar x$, $\\bar y$, $\\bar z$ are never negative,
2. $\\bar y$ is the eye's luminous efficiency, so **Y is the luminance**,
3. an equal-energy spectrum gives $X = Y = Z$.

"Imaginary" means that no real light has those primaries; they lie outside the range of real colours. That costs nothing, since only the numbers are used.

### Tristimulus values
For light with spectrum $S(\\lambda)$ the **tristimulus values** are

$$X = k\\!\\int S(\\lambda)\\,\\bar x(\\lambda)\\,d\\lambda,\\quad Y = k\\!\\int S(\\lambda)\\,\\bar y(\\lambda)\\,d\\lambda,\\quad Z = k\\!\\int S(\\lambda)\\,\\bar z(\\lambda)\\,d\\lambda$$

with $k$ a constant, set for reflecting surfaces so that a perfect white has $Y = 100$ (or 1). A 500 nm light has $(\\bar x, \\bar y, \\bar z) = (0.005, 0.323, 0.272)$; at 555 nm $\\bar y$ is 1.000, the peak, worth 683 lumens per watt; at 450 nm the triple is $(0.336, 0.038, 1.772)$, nearly all Z. Daylight "D65" has $(0.9505, 1.0000, 1.0888)$.

Two lights with equal X, Y and Z **match for the standard observer**, however different their spectra ([[metamerism]]). The ratios $x = X/(X+Y+Z)$ and $y = Y/(X+Y+Z)$ give a colour's chromaticity, the subject of [[the-chromaticity-diagram]].

### The observers
The curves of 1931 are for a **2° observer**, a small field that falls on the fovea. Larger fields (the 10° observer of 1964) give somewhat different curves, and match better for large samples such as walls or a screen seen from close by. Neither is *your* eye: individual differences are real, and with narrow-band light sources they can be noticeable.

> [!key] X, Y and Z weight a spectrum by three agreed, everywhere-positive curves, and Y is the luminance. Equal XYZ means a match for the standard observer, whatever the spectra.
`,
  ideas: [
    'Colour matching is linear: the amounts of three primaries that match a mixture are the sums of the amounts that match its parts.',
    'Matching spectral colours needs negative amounts of a primary; the CIE avoided them with the imaginary primaries X, Y, Z.',
    'X, Y, Z are weighted integrals of the spectrum; Y is the luminance, and equal-energy light gives X = Y = Z.',
    'Equal XYZ means a match for the standard observer, not equal spectra.',
    'The standard observer exists for a 2° field (1931) and a 10° field (1964).'
  ],
  pitfalls: [
    'XYZ are the amounts of red, green and blue light in a colour — They are not amounts of real lights at all; X, Y and Z are imaginary primaries chosen to keep the curves positive. RGB values belong to a particular display.',
    'A negative amount of a primary is impossible, so those colours cannot be seen — They are seen perfectly well; the negative amount only says that the three real primaries cannot reach them.',
    'Equal XYZ means equal spectra — It means equal colour for the standard observer; the spectra may differ completely (metamerism).',
    'The standard observer is the average of everyone — It is the average of a few dozen young observers looking at a small field. Real observers differ, and so does a large field from a small one.'
  ],
  terms: [
    { term: 'Colour-matching functions', also: ['CMFs', 'x̄ ȳ z̄', 'standard observer curves'], def: 'The three curves that give, for each wavelength, the amounts of the three primaries that match a unit of light of that wavelength.' },
    { term: 'Tristimulus values', also: ['X, Y, Z', 'XYZ'], def: 'The three numbers that describe a colour for the standard observer: the spectrum weighted by x̄, ȳ and z̄ and summed.' },
    { term: 'Primaries', also: ['primary lights'], def: 'Three lights, none a mixture of the other two, whose adjusted amounts can match other colours. The CIE experiments used 700, 546.1 and 435.8 nm.' },
    { term: 'Standard observer', also: ['2° observer', '10° observer', 'CIE 1931', 'CIE 1964'], def: 'The agreed average set of colour-matching functions: 1931 for a field 2° wide, 1964 for 10°.' }
  ],
  formulas: [
    {
      name: 'Chromaticity coordinate x',
      expr: 'x = X/(X + Y + Z)', tex: 'x = \\frac{X}{X + Y + Z}',
      vars: {
        x: { name: 'chromaticity x' },
        X: { name: 'tristimulus value X', value: 0.9505 },
        Y: { name: 'tristimulus value Y (luminance)', value: 1 },
        Z: { name: 'tristimulus value Z', value: 1.0888 }
      },
      note: 'The default values are those of daylight D65.',
      stories: { x: 'A light has X = {X}, Y = {Y} and Z = {Z}. What is its chromaticity x?' }
    },
    {
      name: 'Chromaticity coordinate y',
      expr: 'y = Y/(X + Y + Z)', tex: 'y = \\frac{Y}{X + Y + Z}',
      vars: {
        y: { name: 'chromaticity y' },
        X: { name: 'tristimulus value X', value: 0.9505 },
        Y: { name: 'tristimulus value Y (luminance)', value: 1 },
        Z: { name: 'tristimulus value Z', value: 1.0888 }
      }
    },
    {
      name: 'X from chromaticity and luminance',
      expr: 'X = x*Y/y', tex: 'X = \\frac{x\\,Y}{y}',
      vars: {
        X: { name: 'tristimulus value X' },
        x: { name: 'chromaticity x', value: 0.3127, min: 0.001, max: 0.8 },
        y: { name: 'chromaticity y', value: 0.329, min: 0.001, max: 0.9 },
        Y: { name: 'luminance Y', value: 1 }
      }
    },
    {
      name: 'Z from chromaticity and luminance',
      expr: 'Z = (1 - x - y)*Y/y', tex: 'Z = \\frac{(1 - x - y)\\,Y}{y}',
      vars: {
        Z: { name: 'tristimulus value Z' },
        x: { name: 'chromaticity x', value: 0.3127, min: 0.001, max: 0.8 },
        y: { name: 'chromaticity y', value: 0.329, min: 0.001, max: 0.9 },
        Y: { name: 'luminance Y', value: 1 }
      },
      note: 'Together with the previous formula this turns (x, y, Y) back into (X, Y, Z).'
    },
    {
      name: 'Luminous efficacy of a single wavelength',
      expr: 'K = Km*yb', tex: 'K = K_m\\,\\bar y(\\lambda)',
      vars: {
        K: { name: 'luminous efficacy', q: 'efficacy', unit: 'lm/W' },
        Km: { const: 'Km', tex: 'K_m' },
        yb: { name: 'value of ȳ at that wavelength', value: 0.323, tex: '\\bar y' }
      },
      note: 'ȳ is both the Y curve of XYZ and the eye’s luminous efficiency.'
    }
  ],
  examples: [
    {
      title: 'The chromaticity of daylight',
      q: 'Daylight D65 has X = 0.9505, Y = 1.0000 and Z = 1.0888. Find its chromaticity.',
      steps: [
        { text: 'The sum is $0.9505 + 1.0000 + 1.0888 = 3.0393$. Then', tex: 'x = \\frac{0.9505}{3.0393} = 0.3127 \\qquad y = \\frac{1.0000}{3.0393} = 0.3290' }
      ],
      a: 'x = 0.3127, y = 0.3290. This point is the white of sRGB and of most screens.'
    },
    {
      title: 'From chromaticity back to XYZ',
      q: 'The green primary of the sRGB display has chromaticity x = 0.30, y = 0.60. A patch of it has luminance Y = 0.5. Find X and Z.',
      steps: [
        { text: 'From the definitions of x and y:', tex: 'X = \\frac{x\\,Y}{y} = \\frac{0.30 \\times 0.5}{0.60} = 0.25 \\qquad Z = \\frac{(1 - x - y)\\,Y}{y} = \\frac{0.10 \\times 0.5}{0.60} = 0.083' }
      ],
      a: 'X = 0.25, Y = 0.5, Z = 0.083: almost no Z, as for any strong green.'
    }
  ],
  quiz: [
    { q: 'In the matching experiment a 500 nm test light needs a negative amount of the red primary. What does that mean?', choices: ['The red primary must be added to the test half of the field instead', 'The observer cannot see 500 nm light', 'The red lamp is faulty', 'The match cannot be made by anyone'], a: 0, why: 'The test colour is more saturated than any mixture of the three primaries. Adding red to the test half desaturates it until the remaining primaries can match it.' },
    { q: 'Which of the tristimulus values is the luminance?', choices: ['Y', 'X', 'Z', 'None: luminance needs all three'], a: 0, why: 'The CIE chose the Y curve to be the luminous efficiency of the eye, so Y alone measures luminance.' },
    { q: 'Two lights with the same X, Y and Z must have the same spectrum.', a: false, why: 'They match for the standard observer. Different spectra can give identical XYZ; this is metamerism.' },
    { q: 'At 500 nm the Y curve has the value 0.323. How many lumens does 1 W of 500 nm light give?', answer: 220.6, unit: 'lm', why: '$K = 683\\times 0.323 = 220.6$ lm/W, so 1 W gives about 221 lm.' },
    { q: 'Why did the CIE introduce the imaginary primaries X, Y and Z?', choices: ['So that all three curves are positive and Y is the luminance', 'Because real lights could not be made', 'To make colours brighter', 'Because the eye has X, Y and Z cones'], a: 0, why: 'Negative values were a nuisance for calculation by hand and the new primaries put the luminance into one coordinate. They are a mathematical convenience, not a physical set of lights or cones.' }
  ],
  applications: [
    'Colorimeters and spectrophotometers reduce a measurement to XYZ or to Lab, which are computed from XYZ ([[spectrophotometers]]).',
    'Display calibration and colour management: the profile connection space of ICC profiles is based on XYZ or on Lab, so that any device can be converted to any other.',
    'Camera design: how closely a camera’s three filter curves can be combined into x̄, ȳ and z̄ decides how well it sees colour as people do.',
    'Lighting: the chromaticity of LEDs and lamps, and their colour temperature, are computed from XYZ ([[colour-temperature-and-colour-rendering]]).'
  ],
  history: 'William Wright (Imperial College, London) and John Guild (National Physical Laboratory) measured colour matches with ten and seven observers in 1928–1931. The Commission Internationale de l’Éclairage adopted the averaged results, recast into X, Y, Z, at its 1931 meeting in Cambridge. A 10° observer followed in 1964, and a standard based on directly measured cone sensitivities was published in 2006, yet the 1931 curves remain the working standard of colorimetry.',
  sources: [
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae*, 2nd ed.',
    'CIE 15, *Colorimetry* — the standard observers, illuminants and the calculation of tristimulus values.',
    'J. Guild, "The colorimetric properties of the spectrum", *Philosophical Transactions of the Royal Society A* 230 (1931) 149–187.',
    'W. D. Wright, "A re-determination of the trichromatic coefficients of the spectral colours", *Transactions of the Optical Society* 30 (1928–29) 141–164.'
  ],
  sim: 'cs-matching'
},

/* ================================================================ the chromaticity diagram */
{
  id: 'the-chromaticity-diagram', parent: 'colour-science', title: 'The chromaticity diagram', level: 2,
  short: 'Divide X, Y and Z by their sum and two numbers remain, x and y: a colour\'s chromaticity, its hue and saturation without its brightness. Every colour a person can see lies inside a horseshoe on the (x, y) plane, a mixture of two lights lies on the straight line between them, and white sits near the middle.',
  keywords: ['chromaticity diagram', 'CIE xy', 'spectral locus', 'line of purples', 'horseshoe', 'white point', 'D65', 'Planckian locus', 'black-body locus', 'dominant wavelength', 'excitation purity', 'correlated colour temperature', 'CCT', 'MacAdam ellipse', 'mixture line', 'complementary wavelength'],
  prereq: ['cie-colour-matching-and-xyz', 'trichromatic-colour-vision'],
  related: ['colour-spaces-and-gamuts', 'colour-temperature-and-colour-rendering', 'additive-and-subtractive-mixing', 'colour-difference-and-tolerance', 'white-leds', 'wavelength-frequency-and-colour', 'physics:color-mixing'],
  body: `
A colour has three numbers but a page has two dimensions. Drop the brightness and two remain: divide X, Y and Z by their sum,

$$x = \\frac{X}{X+Y+Z},\\qquad y = \\frac{Y}{X+Y+Z},\\qquad z = 1 - x - y$$

and a colour becomes a point (x, y). This is its **chromaticity**: what is left when brightness is taken away. A dim red and a bright red share one point.

### The map
Plotted for every visible colour, the points fill a horseshoe.

- The curved edge, the **spectral locus**, holds the pure wavelengths: 700 nm red at the lower right (x = 0.735, y = 0.265), 520 nm green at the top (0.074, 0.834), 460 nm blue near the lower left. Nothing lies outside it: no light is more saturated than a single wavelength.
- The straight edge closing the loop is the **line of purples**, joining the two ends of the spectrum. Magenta and purple lie there and inside it; they need red and blue light together, and no single wavelength makes them.
- **White** sits near the middle. Daylight "D65" is at (0.3127, 0.3290), equal-energy white at (⅓, ⅓), the incandescent "illuminant A" at (0.4476, 0.4075).
- The **Planckian locus** is the curve a glowing black body follows as it heats up: orange at 1500 K, a warm white at 3000 K, daylight white near 6500 K, bluish at 10 000 K.

### Mixtures lie on straight lines
Add two lights and the chromaticity of the sum lies **on the straight line** between theirs. How far along depends on how much of each is added, weighted by $X+Y+Z$ of each light, which is $Y/y$:

$$x_{\\mathrm{m}} = \\frac{m_1 x_1 + m_2 x_2}{m_1 + m_2},\\qquad m_i = \\frac{Y_i}{y_i}$$

and the same for $y$. Three things follow. A mixture of two lights is never more saturated than the more saturated of them. Two lights on opposite sides of white, with a line through the white point, add to white in the right proportion: they are **complementary**. And with three lights a display can reach only the **triangle** they span ([[colour-spaces-and-gamuts]]).

### Reading a point
Draw a line from the white point through a colour. It meets the locus at the **dominant wavelength**, the spectral colour that colour most resembles; the distance from white as a share of the distance to the locus is the **excitation purity**. For a purple the line meets the line of purples instead, and the colour is described by its *complementary* wavelength. For a white, the diagram gives a **correlated colour temperature**, for example by McCamy's formula:

$$n = \\frac{x - 0.3320}{0.1858 - y},\\qquad T = 449\\,n^3 + 3525\\,n^2 + 6823.3\\,n + 5520.33\\ \\mathrm{K}$$

It gives 6505 K for D65 and 2856 K for illuminant A, but holds only near the Planckian locus ([[colour-temperature-and-colour-rendering]]).

### What the diagram does not do
Equal distances do not look equal: the ellipses of colours that look the same (MacAdam's ellipses) are much larger in the green region than in the blue. And with the brightness removed, brown and orange are one point. For both reasons other spaces are used for colour *differences* ([[colour-difference-and-tolerance]]).

> [!key] x and y are a colour's chromaticity, brightness removed. Every real colour lies inside the spectral locus, mixtures lie on straight lines, and white sits in the middle.
`,
  ideas: [
    'Chromaticity (x, y) is a colour without its brightness; X, Y, Z divided by their sum.',
    'The spectral locus bounds all real colours; the line of purples closes it; white lies inside.',
    'A mixture of two lights lies on the straight line between them, nearer the light that contributes more X + Y + Z.',
    'Dominant wavelength and purity describe a point by its direction and distance from white; purples use the complementary wavelength.',
    'The xy diagram is not perceptually uniform: equal distances are not equal differences.'
  ],
  pitfalls: [
    'The diagram shows all colours — It shows chromaticities. Brightness is gone: brown, a dark orange, and orange are one point, and a point has no darkness or lightness.',
    'The colours drawn on a printed or screen diagram are the real colours at those points — A screen cannot show a saturated spectral colour. The picture is the nearest colour the screen can make and only the *position* is exact.',
    'A mixture sits halfway when the amounts are equal — It sits on the line, but weighted by X + Y + Z of each light. A dim blue added in equal luminance to a bright green barely moves the point from green.',
    'Colour temperature can be given to any light — The correlated colour temperature means something only for lights near the Planckian locus. A green LED or a sodium lamp has a number, but it says little.'
  ],
  terms: [
    { term: 'Chromaticity', also: ['chromaticity coordinates', 'x, y'], def: 'The two numbers x and y that fix a colour\'s hue and saturation but not its brightness: X, Y and Z each divided by their sum.' },
    { term: 'Spectral locus', also: ['spectrum locus'], def: 'The curved boundary of the chromaticity diagram, made of the chromaticities of single wavelengths. Nothing real lies outside it.' },
    { term: 'Line of purples', also: ['purple line'], def: 'The straight boundary joining the ends of the spectral locus. It holds the most saturated purples, which need red and blue light together.' },
    { term: 'Dominant wavelength', also: ['complementary wavelength'], def: 'The wavelength whose spectral colour, mixed with white, matches the colour. For a purple the complementary wavelength, on the opposite side, is used.' },
    { term: 'Excitation purity', also: ['colorimetric purity', 'saturation'], def: 'How far a colour lies from the white point towards the locus, as a share of the whole distance: 0 for white, 1 for a spectral colour.' },
    { term: 'Planckian locus', also: ['black-body locus'], def: 'The curve of chromaticities of a glowing black body at temperatures from low to high. White lights near it have a correlated colour temperature.' },
  ],
  formulas: [
    {
      name: 'Chromaticity of a mixture of two lights',
      expr: 'xm = (Y1/y1*x1 + Y2/y2*x2)/(Y1/y1 + Y2/y2)',
      tex: 'x_{\\mathrm{m}} = \\frac{\\frac{Y_1}{y_1}x_1 + \\frac{Y_2}{y_2}x_2}{\\frac{Y_1}{y_1} + \\frac{Y_2}{y_2}}',
      vars: {
        xm: { name: 'x of the mixture', tex: 'x_{\\mathrm{m}}' },
        Y1: { name: 'luminance of light 1', value: 1, min: 0.001, max: 100, tex: 'Y_1' },
        y1: { name: 'y of light 1', value: 0.6, min: 0.01, max: 0.9, tex: 'y_1' },
        x1: { name: 'x of light 1', value: 0.3, min: 0, max: 0.8, tex: 'x_1' },
        Y2: { name: 'luminance of light 2', value: 0.1, min: 0.001, max: 100, tex: 'Y_2' },
        y2: { name: 'y of light 2', value: 0.06, min: 0.01, max: 0.9, tex: 'y_2' },
        x2: { name: 'x of light 2', value: 0.15, min: 0, max: 0.8, tex: 'x_2' }
      },
      note: 'The same formula with y in place of x gives the y of the mixture. Each light counts by its X + Y + Z, which is Y/y.',
      stories: { xm: 'A green light (x = {x1}, y = {y1}) of luminance {Y1} is mixed with a blue light (x = {x2}, y = {y2}) of luminance {Y2}. What is the x of the mixture?' }
    },
    {
      name: 'Correlated colour temperature (McCamy)',
      expr: 'T = 449*((x - 0.3320)/(0.1858 - y))^3 + 3525*((x - 0.3320)/(0.1858 - y))^2 + 6823.3*((x - 0.3320)/(0.1858 - y)) + 5520.33',
      tex: 'T = 449\\,n^3 + 3525\\,n^2 + 6823.3\\,n + 5520.33,\\quad n = \\frac{x - 0.3320}{0.1858 - y}',
      vars: {
        T: { name: 'correlated colour temperature', q: 'temperature', unit: 'K' },
        x: { name: 'chromaticity x', value: 0.3127, min: 0.25, max: 0.5 },
        y: { name: 'chromaticity y', value: 0.329, min: 0.25, max: 0.44 }
      },
      note: 'Good from about 2000 to 12 500 K, for chromaticities near the Planckian locus.',
      stories: { T: 'A lamp has the chromaticity x = {x}, y = {y}. What is its correlated colour temperature?' }
    }
  ],
  examples: [
    {
      title: 'A bright green and a faint blue',
      q: 'Light 1 is the sRGB green (x = 0.30, y = 0.60) with luminance 1. Light 2 is the sRGB blue (x = 0.15, y = 0.06) with luminance 0.1. Where is their mixture?',
      steps: [
        { text: 'The weights are $m_i = Y_i/y_i$:', tex: 'm_1 = \\frac{1}{0.60} = 1.667 \\qquad m_2 = \\frac{0.1}{0.06} = 1.667' },
        'The weights are equal, so the mixture is halfway between the two points:',
        { tex: 'x_{\\mathrm{m}} = \\frac{0.30 + 0.15}{2} = 0.225 \\qquad y_{\\mathrm{m}} = \\frac{0.60 + 0.06}{2} = 0.330' }
      ],
      a: '(0.225, 0.330): a turquoise halfway along the line. The blue has only a tenth of the luminance, yet it counts as much as the green, because blue light has so little Y per unit of X + Y + Z.'
    },
    {
      title: 'The temperature of a lamp',
      q: 'A tungsten lamp has chromaticity x = 0.4476, y = 0.4074. Estimate its correlated colour temperature.',
      steps: [
        { text: 'First $n$:', tex: 'n = \\frac{0.4476 - 0.3320}{0.1858 - 0.4074} = \\frac{0.1156}{-0.2216} = -0.5217' },
        { text: 'Then the polynomial:', tex: 'T = 449(-0.1420) + 3525(0.2722) + 6823.3(-0.5217) + 5520.33 \\approx 2856\\ \\mathrm{K}' }
      ],
      a: 'About 2856 K: the temperature of CIE illuminant A, which stands for tungsten light.'
    }
  ],
  quiz: [
    { q: 'Two lights have chromaticities A and B. The chromaticity of their sum lies:', choices: ['on the straight line between A and B', 'on a curve bulging towards the spectral locus', 'anywhere inside the triangle with white', 'at the midpoint of A and B, always'], a: 0, why: 'Chromaticities of mixtures lie on the straight line between the parts; where depends on the amounts, weighted by X + Y + Z, and is not the midpoint unless the weights are equal.' },
    { q: 'Which part of the boundary of the diagram has no single wavelength?', choices: ['The line of purples', 'The green top of the locus', 'The red end of the locus', 'The blue end of the locus'], a: 0, why: 'Purples need red and blue light together. They are described by the complementary wavelength instead.' },
    { q: 'A dim red and a bright red of the same hue have different chromaticities.', a: false, why: 'Chromaticity leaves out brightness, so they are at the same point. They differ in Y.' },
    { q: 'Light of equal energy at all wavelengths has X = Y = Z. What is its chromaticity x?', answer: 0.3333, why: '$x = X/(X+Y+Z) = 1/3$. Equal-energy white sits at (1/3, 1/3), a little off D65.' },
    { q: 'Two lights lie on opposite sides of the white point, with the white point on the line joining them. In the right proportion their sum is:', choices: ['white', 'the spectral colour between them', 'a purple', 'black'], a: 0, why: 'The line from one through white ends at the other: they are complementary, and the mixture lands on the white point.' }
  ],
  applications: [
    'Lighting and LED manufacture: white LEDs are sorted ("binned") by their (x, y) into small regions, and a lamp family is specified by a tolerance in steps of a MacAdam ellipse ([[white-leds]]).',
    'Display design: the primaries and white point of a screen are specified as chromaticities, and the gamut is the triangle they span ([[colour-spaces-and-gamuts]]).',
    'Signal lights: the colours of traffic, rail and aviation signals are specified as regions of the xy diagram so that red, yellow and green cannot be mistaken for one another.',
    'Colour measurement and quality control: a spectrophotometer reports chromaticity and luminance, and a tolerance can be drawn as a region on the map.'
  ],
  history: 'The diagram came with the CIE 1931 system itself. David MacAdam showed in 1942 that colours which look identical scatter into ellipses of very different sizes on it, which led the CIE to propose more uniform diagrams, the u,v diagram in 1960 and u\',v\' in 1976. The black-body curve is older: it follows from Planck\'s law of 1900.',
  sources: [
    'R. W. G. Hunt and M. R. Pointer, *Measuring Colour*, 4th ed. — chromaticity diagrams, dominant wavelength and purity.',
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae*, 2nd ed.',
    'C. S. McCamy, "Correlated color temperature as an explicit function of chromaticity coordinates", *Color Research and Application* 17 (1992) 142–144.',
    'CIE 15, *Colorimetry* — chromaticity coordinates and the standard illuminants.'
  ],
  sim: [{ id: 'cs-chromaticity', params: { mode: 'mix' } }]
},

/* ================================================================ colour spaces and gamuts */
{
  id: 'colour-spaces-and-gamuts', parent: 'colour-science', title: 'Colour spaces and gamuts', level: 2,
  short: 'A colour space is a way of giving three numbers to a colour. Device spaces such as sRGB say how to drive a display; the CIE spaces XYZ and CIELAB describe the colour itself. A display\'s gamut is the triangle of chromaticities its three primaries can reach, and every real display covers only part of what the eye can see.',
  keywords: ['colour space', 'sRGB', 'gamut', 'Display P3', 'Adobe RGB', 'Rec. 2020', 'Rec. 709', 'CIELAB', 'Lab', 'L*a*b*', 'HSV', 'device dependent', 'ICC profile', 'wide gamut', 'out of gamut', 'primaries', 'white point', 'gamma', 'colour management'],
  prereq: ['the-chromaticity-diagram', 'cie-colour-matching-and-xyz'],
  related: ['additive-and-subtractive-mixing', 'colour-difference-and-tolerance', 'the-munsell-colour-system', 'white-balance-and-chromatic-adaptation', 'flat-panel-displays', 'laser-projection-and-displays', 'opponent-colours'],
  body: `
The same three numbers, (255, 128, 0), draw different oranges on different screens unless someone says what they mean. A **colour space** fixes the meaning: it states the primaries, the white and how the numbers relate to light.

### Device spaces and colour spaces
- A **device-dependent** space such as RGB or CMYK describes how to drive one kind of device. Its numbers mean a colour only together with a **profile**: the colours of the primaries and the white.
- A **device-independent** space such as XYZ or CIELAB describes the colour a standard observer sees, whatever device makes it ([[cie-colour-matching-and-xyz]]).
- **HSV** and **HSL**, the hue–saturation pickers of drawing programs, are only a rearrangement of RGB. They are not perceptual.

### sRGB and its larger relatives
sRGB, proposed for the web and for most screens and standardized in 1999, has primaries at chromaticities (0.640, 0.330), (0.300, 0.600) and (0.150, 0.060), the white D65 and a transfer curve close to a power law of 2.2: the stored number is roughly the light raised to the power 1/2.2, which spends the 256 steps where the eye is most sensitive. Because of that curve the channels do not add light directly. Luminance is a weighted sum of the *linear* values, $Y = 0.2126\\,R + 0.7152\\,G + 0.0722\\,B$.

| Space | Red | Green | Blue | Share of the diagram |
|---|---|---|---|---|
| sRGB (Rec. 709) | 0.640, 0.330 | 0.300, 0.600 | 0.150, 0.060 | 34 % |
| Display P3 | 0.680, 0.320 | 0.265, 0.690 | 0.150, 0.060 | 45 % |
| Adobe RGB (1998) | 0.640, 0.330 | 0.210, 0.710 | 0.150, 0.060 | 45 % |
| Rec. 2020 | 0.708, 0.292 | 0.170, 0.797 | 0.131, 0.046 | 63 % |

White is D65 for all four. The last column is the area of the triangle as a share of the area of the horseshoe on the xy diagram; xy is not uniform, so it is a rough guide. The primaries of Rec. 2020 lie almost on the spectral locus, at 630, 532 and 467 nm, so only laser or narrow-band LED light can reach them.

### The gamut
The **gamut** of a device is the set of colours it can make. For three primaries it is the triangle they span on the chromaticity diagram, and no choice of three real lights covers the whole horseshoe. A colour outside the gamut is **out of gamut** and must be replaced by a nearby one: *clipped* to the edge, or the whole picture compressed. Print has a differently shaped gamut: some cyans and deep blue-greens that ink makes lie outside sRGB, while the most vivid greens, blues and oranges of a screen lie outside what ink can make.

### CIELAB
CIELAB (1976) is computed from XYZ and a reference white so that distances come closer to perceived differences. Its axes are lightness $L^*$ (0 to 100), $a^*$ (green to red) and $b^*$ (blue to yellow); chroma is $C^* = \\sqrt{a^{*2} + b^{*2}}$ and hue is the angle of the point. A mid grey that reflects 18 % of the white has $L^* = 49.5$, close to 50. In CIELAB the sRGB gamut is not a triangle but a lumpy solid, widest around mid lightness (at $L^* = 60$ the chroma reaches 115, towards magenta) and shrinking to a point at black and at white, as the lightness slice in the simulation shows.

> [!key] A colour space gives numbers a meaning. RGB spaces describe devices, XYZ and CIELAB describe colours; a display's gamut is the triangle of its primaries and covers only part of what the eye can see.
`,
  ideas: [
    'RGB numbers mean a colour only together with a profile: the primaries, the white and the transfer curve.',
    'XYZ and CIELAB describe the colour itself, independent of any device.',
    'A three-primary display\'s gamut is a triangle on the xy diagram; none covers the whole horseshoe.',
    'Wider gamuts (Display P3, Adobe RGB, Rec. 2020) have primaries nearer the spectral locus.',
    'In CIELAB the gamut is a solid, widest at mid lightness; distances approximate perceived differences.'
  ],
  pitfalls: [
    'RGB (255, 0, 0) is one definite red — It is the reddest red *of that device*. On an sRGB, a Display P3 or a Rec. 2020 screen it is three different colours.',
    'A wide-gamut screen makes everything more colourful — Content made for sRGB looks oversaturated on it unless it is converted by the colour management; the wide gamut only helps pictures that use it.',
    'HSV and HSL are colour appearance spaces — They are RGB rearranged. Two colours of equal HSV value can differ greatly in lightness.',
    'An out-of-gamut colour does not exist — It exists, and can be seen, but the display cannot make it. Photographs of vivid cyans and greens on a screen are often clipped.'
  ],
  terms: [
    { term: 'Colour space', also: ['colour model'], def: 'A scheme that assigns three numbers to every colour, with a definition of what the numbers mean in terms of light.' },
    { term: 'Gamut', also: ['colour gamut', 'out of gamut'], def: 'The set of colours that a device can show or print. For three additive primaries it is the triangle they span on the chromaticity diagram.' },
    { term: 'sRGB', also: ['Rec. 709 primaries'], def: 'The standard RGB space of the web and most screens: primaries at (0.640, 0.330), (0.300, 0.600), (0.150, 0.060), white D65 and a gamma of about 2.2.' },
    { term: 'Wide gamut', also: ['Display P3', 'Adobe RGB', 'Rec. 2020'], def: 'A space whose primaries are further apart than sRGB\'s, so that it holds more saturated colours.' },
    { term: 'CIELAB', also: ['CIE L*a*b*', 'Lab'], def: 'A device-independent space with lightness L* and two colour axes a* (green–red) and b* (blue–yellow), computed from XYZ; distances roughly follow perceived differences.' },
    { term: 'ICC profile', also: ['colour profile'], def: 'A file that tells software how the numbers of one device relate to a device-independent space, so that colours can be converted between devices.' }
  ],
  formulas: [
    {
      name: 'Relative luminance from linear RGB',
      expr: 'Y = 0.2126*R + 0.7152*G + 0.0722*B', tex: 'Y = 0.2126\\,R + 0.7152\\,G + 0.0722\\,B',
      vars: {
        Y: { name: 'relative luminance (white = 1)' },
        R: { name: 'linear red', value: 1, min: 0, max: 1 },
        G: { name: 'linear green', value: 0.5, min: 0, max: 1 },
        B: { name: 'linear blue', value: 0, min: 0, max: 1 }
      },
      note: 'R, G and B are the linear light values, not the numbers stored in the file. The weights are those of sRGB and Rec. 709.',
      stories: { Y: 'An orange has linear red {R}, green {G} and blue {B}. What fraction of the white\'s luminance does it have?' }
    },
    {
      name: 'CIELAB lightness',
      expr: 'L = 116*(Y/Yn)^(1/3) - 16', tex: 'L^* = 116\\left(\\frac{Y}{Y_n}\\right)^{1/3} - 16',
      vars: {
        L: { name: 'lightness L*', tex: 'L^*' },
        Y: { name: 'luminance of the colour', value: 0.18, min: 0.01, max: 1 },
        Yn: { name: 'luminance of the reference white', value: 1, min: 0.01, max: 1000, tex: 'Y_n' }
      },
      note: 'For Y/Yn above 0.008856; below that CIELAB uses a straight line. 18 % grey gives L* = 49.5.',
      stories: { L: 'A surface has a luminance of {Y} against a white of {Yn}. What is its CIELAB lightness?' }
    },
    {
      name: 'Chroma in CIELAB',
      expr: 'C = sqrt(a^2 + b^2)', tex: 'C^* = \\sqrt{(a^*)^2 + (b^*)^2}',
      vars: {
        C: { name: 'chroma C*', tex: 'C^*' },
        a: { name: 'a* (green–red)', value: 40, signed: true, tex: 'a^*' },
        b: { name: 'b* (blue–yellow)', value: -30, signed: true, tex: 'b^*' }
      },
      note: 'The hue is the angle of the point (a*, b*) from the +a* axis.'
    }
  ],
  examples: [
    {
      title: 'The luminance of an orange',
      q: 'An orange has linear RGB values (1.0, 0.5, 0.0) in sRGB. Find its luminance relative to white.',
      steps: [
        { tex: 'Y = 0.2126 \\times 1.0 + 0.7152 \\times 0.5 + 0.0722 \\times 0 = 0.2126 + 0.3576 = 0.570' },
        'The stored (gamma-encoded) values would be $255$, $188$ and $0$: the linear 0.5 is stored as about 0.735 of full scale. Luminance must always be computed from the linear values.'
      ],
      a: 'Y = 0.57: the orange gives 57 % of the luminance of the white, most of it from the green.'
    },
    {
      title: 'Where is a grey card in CIELAB?',
      q: 'A photographer\'s grey card reflects 18 % of the light that a perfect white does. What is its lightness $L^*$?',
      steps: [
        { tex: 'L^* = 116\\,(0.18)^{1/3} - 16 = 116 \\times 0.5646 - 16 = 49.5' }
      ],
      a: 'L* = 49.5, about half-way up the perceptual scale: dark in luminance terms (18 %) but half as light to the eye.'
    }
  ],
  quiz: [
    { q: 'Why does the number (255, 0, 0) not define one colour?', choices: ['Its meaning depends on the primaries, white and transfer curve of the space', 'Because red cannot be written with numbers', 'Because the numbers change with brightness', 'Because it needs a fourth number'], a: 0, why: 'RGB numbers are drive values for a device. The same triple is a different red in sRGB, Display P3 and Rec. 2020; a profile says which.' },
    { q: 'Which of these spaces has the largest gamut?', choices: ['Rec. 2020', 'sRGB', 'Display P3', 'Adobe RGB (1998)'], a: 0, why: 'Its primaries, at 630, 532 and 467 nm, lie almost on the spectral locus: 63 % of the diagram against 34 % for sRGB.' },
    { q: 'HSV is a perceptually uniform space, in which equal steps look equal.', a: false, why: 'HSV is RGB reorganized into hue, saturation and value for convenience. Equal steps of V give very different lightness for different hues.' },
    { q: 'A surface reflects half as much light as the white ($Y/Y_n = 0.5$). What is its CIELAB lightness $L^*$?', answer: 76.07, why: '$L^* = 116\\times 0.5^{1/3} - 16 = 116 \\times 0.7937 - 16 = 76.1$. Half the luminance is about three quarters of the way up the lightness scale.' },
    { q: 'A vivid cyan photographed by a wide-gamut camera is shown on an sRGB display. What happens to it?', choices: ['It is out of gamut and is clipped or compressed to a nearby sRGB colour', 'It is displayed exactly', 'It turns black', 'It is shown as a different hue by design'], a: 0, why: 'The display can only make colours inside its triangle. Colour management replaces the others by nearby ones.' }
  ],
  applications: [
    'Photography and print: converting between a camera\'s space, a screen\'s and a printer\'s with profiles, and checking in a soft proof which colours will be out of gamut.',
    'Television and video: Rec. 709 for HD, Rec. 2020 for ultra-high-definition and HDR, whose primaries need laser or narrow-band LED light ([[laser-projection-and-displays]]).',
    'Web and app design: sRGB as the common denominator, with wide-gamut displays reached through profiles.',
    'Product colour: brand colours kept as CIELAB or XYZ values, because a pixel value does not travel from screen to packaging ([[flat-panel-displays]]).'
  ],
  history: 'The CIE introduced CIELAB in 1976 as a simple formula that approximated the spacing of the Munsell system. sRGB was proposed by two computer companies in 1996 to give screens and printers a common default and standardized in 1999; Rec. 709 for high-definition television dates from 1990, and Rec. 2020 for ultra-high-definition from 2012.',
  sources: [
    'IEC 61966-2-1, *Multimedia systems and equipment — Colour measurement and management — Default RGB colour space — sRGB*.',
    'ITU-R Recommendations BT.709 and BT.2020 — the primaries, white and transfer functions of HDTV and UHDTV.',
    'CIE 15, *Colorimetry* — the CIE 1976 L*a*b* space.',
    'R. W. G. Hunt, *The Reproduction of Colour* — colour spaces, gamuts and their use in imaging.'
  ],
  sim: [{ id: 'cs-chromaticity', params: { mode: 'gamut' } }]
},

/* ================================================================ Munsell */
{
  id: 'the-munsell-colour-system', parent: 'colour-science', title: 'The Munsell colour system', level: 2,
  short: 'Munsell described every surface colour by three scales meant to be equally spaced to the eye: hue (ten hues of ten steps), value (lightness, 0 to 10) and chroma (colourfulness). A strong red is written 5R 4/14. Its chips, arranged in the Munsell tree, were the first colour atlas based on appearance rather than on mixing.',
  keywords: ['Munsell', 'hue value chroma', 'colour tree', 'colour atlas', '5R 4/14', 'Munsell notation', 'renotation', 'colour order system', 'soil colour', 'perceptual colour space', 'colour solid', 'ASTM D1535', 'colour wheel Munsell'],
  prereq: ['colour-spaces-and-gamuts', 'opponent-colours'],
  related: ['colour-wheels-and-harmony', 'colour-difference-and-tolerance', 'the-chromaticity-diagram', 'colour-appearance-and-constancy', 'physics:color-mixing'],
  body: `
Before colorimeters there were colour *atlases*: books of painted chips arranged so that a colour could be named by finding its neighbours. The best known is the **Munsell system**, devised by the American painter and teacher Albert H. Munsell from 1905, still used for soil, rock and archaeology and still the yardstick against which colour spaces are tested. See it in the [Munsell wheel of the colour lab](#/tools/colour/munsell).

### Three scales
Every colour sits on three scales, each meant to have **equal perceived steps**:

- **Hue.** The circle holds ten hues, five principal (**R**ed, **Y**ellow, **G**reen, **B**lue, **P**urple) and five between (YR, GY, BG, PB, RP), each divided into ten steps with 5 in the middle: 5R is the typical red, 10R the border with YR. In all, 100 steps round the circle.
- **Value.** Lightness from 0 (ideal black) to 10 (ideal white). It is tied to the luminance by a fixed polynomial, so a mid grey N 5 reflects not half but about 19 % of the light.
- **Chroma.** The distance from the grey of the same value, in steps of 2 on the chips (2, 4, 6...). It has no fixed upper limit, only the practical one set by what pigments can do, and each hue reaches its own maximum.

A colour is written **hue value/chroma**: 5R 4/14 is hue 5R, value 4, chroma 14, a strong, dark red. A grey is **N 5/** (neutral, value 5).

| Value | 1 | 3 | 5 | 7 | 9 |
|---|---|---|---|---|---|
| Luminance Y, % of white | 1.2 | 6.4 | 19.3 | 42.0 | 76.7 |

### The tree, and why it is lopsided
Hue as angle, value as height and chroma as radius make a solid, the **Munsell tree**. Munsell hoped for a sphere and found none: the hues do not all reach their maximum chroma at the same value. Yellow is a light colour and its strongest chips are at high value, blue-purple is dark and its strongest chips are at low value, so the tree has uneven limbs. The Optical Society of America smoothed the atlas in its *renotation* of 1943, based on a great many judgements by observers, and that table is how the system is defined in CIE terms today.

### Drawing Munsell colours here
The simulation draws chips by a computed approximation: the value from the standard polynomial, the hue and chroma mapped through CIELAB (about 5 units of $C^*$ per chroma step), then shown in sRGB. The colours are therefore approximate; real work uses the published renotation data and physical chips, and a screen cannot show chips beyond its gamut at all. At value 5, the largest chroma that sRGB reaches in this rendering is 17 for 5R, 11.5 for 5Y, 9 for 5G and 6 for 5B; at value 8, 5Y reaches 16 while 5R reaches only 5.5. This uneven reach is the screen's limit and the tree's shape together.

> [!key] Hue, value and chroma are three scales of equal appearance steps, written 5R 4/14. The tree they make is lopsided, because every hue has its own maximum chroma at its own value.
`,
  ideas: [
    'Munsell colours have three coordinates: hue (100 steps round a circle), value (0 to 10), chroma (0 outward).',
    'Notation: hue value/chroma, for example 5R 4/14; greys are N 5/.',
    'The scales aim at equal perceived steps, checked by observers and refined in the 1943 renotation.',
    'The colour solid is a lopsided tree: each hue has a different maximum chroma at a different value.',
    'Value is a fixed function of luminance: N5 is about 19 % of white, not 50 %.'
  ],
  pitfalls: [
    'Value 5 means half as bright as white — It means half-way in *appearance*. The luminance of N5 is about 19 % of white; N9 is already 77 %.',
    'Chroma is a percentage, so it ends at 100 — It is an open scale in steps of colourfulness; different hues top out at different chromas, set by what pigments can make.',
    'The colours shown on a screen are the Munsell colours — They are approximations, limited by the screen\'s gamut. Only the physical chips and the published data define the system.',
    'Munsell hues are the same as the hues of a painter\'s wheel — The ten Munsell hues are spaced by appearance, and opposite hues balance to grey; the painter\'s wheel is spaced by a tradition of mixing paint.'
  ],
  terms: [
    { term: 'Hue (Munsell)', def: 'The position round the hue circle, in ten hues (R, YR, Y, GY, G, BG, B, PB, P, RP) of ten steps each; 5R is the middle of red.' },
    { term: 'Value', also: ['Munsell value', 'lightness'], def: 'The lightness scale from 0 (black) to 10 (white), tied to luminance by a fixed polynomial.' },
    { term: 'Chroma', also: ['Munsell chroma', 'colourfulness'], def: 'How far a colour is from the grey of equal value, in steps of 2 on the chips; no fixed upper limit.' },
    { term: 'Munsell notation', also: ['5R 4/14'], def: 'The way a colour is written: hue, then value, a slash, and chroma. A neutral grey is N followed by the value.' },
    { term: 'Munsell tree', also: ['colour solid'], def: 'The three-dimensional arrangement of all Munsell colours, with hue as angle, value as height and chroma as radius. It is lopsided.' },
    { term: 'Renotation', def: 'The 1943 revision by the Optical Society of America that put the Munsell atlas on a CIE basis and smoothed its spacing.' }
  ],
  formulas: [
    {
      name: 'Luminance factor from Munsell value',
      expr: 'Y = 1.1914*V - 0.22533*V^2 + 0.23352*V^3 - 0.020484*V^4 + 0.00081939*V^5',
      tex: 'Y = 1.1914\\,V - 0.22533\\,V^2 + 0.23352\\,V^3 - 0.020484\\,V^4 + 0.00081939\\,V^5',
      vars: {
        Y: { name: 'luminance factor (percent of white)', unit: '%' },
        V: { name: 'Munsell value', value: 5, min: 0, max: 10 }
      },
      note: 'The polynomial that ASTM D1535 gives; V = 5 gives 19.3 %, V = 9 gives 76.7 %. Solve for V to find the value of a measured grey.',
      stories: { Y: 'A grey chip has Munsell value {V}. What percentage of the light of a white does it reflect?', V: 'A grey surface reflects {Y} of the light that a white does. What is its Munsell value?' }
    }
  ],
  examples: [
    {
      title: 'Reading 5R 4/14',
      q: 'Read the notation 5R 4/14, and give the luminance of the chip and its chroma in CIELAB (in this approximation, about 5 units of $C^*$ per chroma step).',
      steps: [
        'Hue 5R: the middle of the red segment. Value 4: darker than mid, with $Y = 11.7\\,\\%$ of the white. Chroma 14: a strong colour.',
        { text: 'In CIELAB terms the chroma is about', tex: 'C^* \\approx 5 \\times 14 = 70' },
        'In this rendering the chip comes out at L* = 40.7, a* = 63.9, b* = 28.5, which is #BF1036 on an sRGB screen and lies inside its gamut.'
      ],
      a: 'A dark, strong red: luminance 11.7 % of white, $C^* \\approx 70$.'
    },
    {
      title: 'A grey from its reflectance',
      q: 'A grey card reflects 19.3 % of the light of a white. What is its Munsell value, and what would N 9 reflect?',
      steps: [
        'Put $Y = 19.3$ into the polynomial and solve for $V$: the value comes out at 5.0, so the card is N 5/.',
        { text: 'For $V = 9$:', tex: 'Y = 1.1914(9) - 0.22533(81) + 0.23352(729) - 0.020484(6561) + 0.00081939(59049) = 76.7\\,\\%' }
      ],
      a: 'The card is N 5/. N 9 reflects 76.7 %: even a fairly light grey is far from a perfect white.'
    }
  ],
  quiz: [
    { q: 'What does 5R 4/14 mean?', choices: ['Hue 5R (middle red), value 4, chroma 14', 'Red 5 %, grey 4 %, white 14 %', 'Hue 5, value 4, saturation 14 %', 'Five red chips of value 4 and chroma 14'], a: 0, why: 'Munsell notation is hue, value and chroma: hue first, then value and chroma separated by a slash.' },
    { q: 'The Munsell colour solid is a perfect sphere.', a: false, why: 'Each hue reaches its maximum chroma at a different value, so the solid has uneven limbs: the tree. Munsell expected a sphere and had to accept the shape the pigments gave.' },
    { q: 'A neutral grey chip of value 5 reflects about:', choices: ['19 % of the light of a white', '50 % of it', '5 % of it', '95 % of it'], a: 0, why: 'Value is a lightness scale, mapped to luminance by a polynomial: N5 is 19.3 % and N9 is 76.7 %.' },
    { q: 'What percentage of the light of a white does a chip of value 7 reflect?', answer: 42, unit: '%', why: 'The polynomial gives $Y(7) = 42.0\\,\\%$.' },
    { q: 'Why is a screen rendering of a Munsell chip only approximate?', choices: ['The rendering goes through an approximate mapping and some chips lie outside the screen\'s gamut', 'Because Munsell colours change in time', 'Because screens cannot show greys', 'Because the notation is not exact'], a: 0, why: 'Computed chips use CIELAB as an approximation of the true renotation, and the most colourful chips cannot be displayed. Real chips and the published tables are the reference.' }
  ],
  applications: [
    'Soil survey, archaeology and geology: the Munsell soil colour charts and the geological rock-colour chart name colours by hue, value and chroma so that field notes agree between workers.',
    'Colour education: the three scales separate what is mixed up in everyday words, since "bright" can mean light, strong or both.',
    'Testing colour spaces: CIELAB and its successors are judged by how well their distances reproduce Munsell\'s equal steps.',
    'Colour vision tests and artificial scenes: chips of constant value and chroma at different hues are the basis of tests of colour discrimination ([[colour-vision-tests]]).'
  ],
  history: 'Albert Henry Munsell (1858–1918), a Boston painter and teacher, wanted a way to describe colour that artists and students could use without names. He published *A Color Notation* in 1905 and the *Atlas of the Munsell Color System* in 1915; the company he founded went on publishing books of chips. In the 1930s and 1940s a committee of the Optical Society of America measured the chips, found that the spacing was not even, and issued the renotation of 1943, which is the basis of the standard practice ASTM D1535.',
  sources: [
    'A. H. Munsell, *A Color Notation* (1905) and later editions.',
    'S. M. Newhall, D. Nickerson and D. B. Judd, "Final report of the O.S.A. subcommittee on the spacing of the Munsell colors", *Journal of the Optical Society of America* 33 (1943) 385–418.',
    'ASTM D1535, *Standard Practice for Specifying Color by the Munsell System*.',
    'R. G. Kuehni, *Color Space and Its Divisions* — colour order systems and their histories.'
  ],
  sim: 'cs-munsell'
},

/* ================================================================ colour wheels */
{
  id: 'colour-wheels-and-harmony', parent: 'colour-science', title: 'Colour wheels', level: 1,
  short: 'Colour wheels arrange hues in a circle so that neighbours are similar and opposites contrast. There is more than one: the painter\'s red–yellow–blue wheel, the wheel of light and print with red, green, blue and cyan, magenta, yellow, and Munsell\'s circle of five principal hues. Each puts a different colour opposite red, and only some of their "complementary" pairs really cancel.',
  keywords: ['colour wheel', 'colour circle', 'complementary colours', 'harmony', 'analogous', 'triadic', 'RYB', 'RGB', 'CMY', 'primary secondary tertiary', 'Itten', 'Newton colour circle', 'split complementary', 'hue circle', 'colour scheme'],
  prereq: ['opponent-colours', 'the-munsell-colour-system'],
  related: ['additive-and-subtractive-mixing', 'the-chromaticity-diagram', 'colour-appearance-and-constancy', 'colour-illusions-and-afterimages', 'physics:color-mixing', 'ergonomics:glare-colour'],
  body: `
Put the spectrum in a line and red lies at one end, violet at the other; yet violet looks closer to red than to green, because purples are made of both. Bending the line into a circle closes it. That is the **colour circle**, drawn by Newton in 1704 with the white of daylight at its centre and redrawn many times since.

### Three wheels, three answers
| Wheel | Primaries | Opposite of red | Spaced by | Used for |
|---|---|---|---|---|
| Painter's wheel (RYB) | red, yellow, blue | green | the tradition of mixing paint | painting, teaching design |
| Wheel of light and print | red, green, blue (lights); cyan, magenta, yellow (inks) | cyan | how lights and filters mix | screens, printing, lighting |
| Munsell's circle | R, Y, G, B, P | blue-green | equal perceived steps | specifying colour |

- On the **painter's wheel** the primaries are red, yellow and blue, the secondaries (orange, green, violet) lie between them and the tertiaries between those: twelve hues, yellow at the top by custom. Opposites are called complementary: red–green, orange–blue, yellow–violet.
- On the **wheel of light** the primaries are those of a display, red, green and blue; the secondaries cyan, magenta and yellow are the primaries of print. Opposites are red–cyan, green–magenta, yellow–blue.
- **Munsell's circle** has five principal hues and five between; opposites balance, giving R–BG, YR–B, Y–PB, GY–P and G–RP.

### What "complementary" should mean
In colour measurement two colours are **complementary** if mixing them, as lights or on a spinning disc that averages them, gives a neutral grey or white. By that test the wheels differ. The simulation averages each pair in linear light and measures the result in CIELAB:

- *Wheel of light.* Red with cyan, green with magenta and yellow with blue average to a **neutral** (chroma 0). Orange with azure leaves a chroma of 40: only the primaries and secondaries are exactly complementary.
- *Painter's wheel.* Red with green averages to a clear colour of chroma about 41, and the two hues lie 111° apart on the CIELAB hue circle, not 180°. All twelve pairs leave a chroma of 23 or more.
- *Munsell*, at value 5 and chroma 6: all ten pairs average to a chroma of 7 or less.

The painter's wheel is not a mistake. It describes what happens when pigments are *mixed*, and red and green paint do make a muddy brown. It is simply a different wheel from the wheel of light.

### Harmony
A **colour scheme** picks hues by their places on a wheel: **analogous** (neighbours, calm), **complementary** (opposites, lively), **triadic** (three evenly spaced), **split-complementary** (a hue and the two neighbours of its opposite). These are rules of thumb that designers have found pleasant, not laws: how colours look together also depends on lightness, area and surround ([[colour-appearance-and-constancy]]). A useful test of any scheme is to look at it in grey: if the lightness contrast is poor, hue alone will not save it.

> [!key] A colour wheel arranges hues in a circle, but the wheels disagree about which colour is opposite which. Only where a pair averages to a neutral are the two truly complementary.
`,
  ideas: [
    'A colour wheel closes the spectrum into a circle; neighbours are similar, opposites contrast.',
    'The painter\'s wheel (RYB), the wheel of light and print (RGB / CMY) and Munsell\'s circle put different colours opposite one another.',
    'Colours are complementary in the strict sense when their mixture is neutral: red and cyan are, red and green (as lights) are not.',
    'The painter\'s wheel is a guide to mixing paint; the RGB wheel to mixing light.',
    'Harmony schemes (analogous, complementary, triadic, split-complementary) are guidelines, not laws.'
  ],
  pitfalls: [
    'Red and green are complementary — On the painter\'s wheel yes; as lights they are not: they add to yellow. The complement of red light is cyan.',
    'The primaries are red, yellow and blue — For mixing paint, cyan, magenta and yellow reach far more colours; red–yellow–blue is a teaching tradition. For light the primaries are red, green, blue.',
    'A colour wheel holds all colours — It holds hues only, at one lightness and strength. Colours also vary in lightness and chroma, which takes at least a three-dimensional space ([[the-munsell-colour-system]]).',
    'Complementary pairs always look good together — They contrast strongly in hue, which makes them lively and sometimes vibrating; a pleasing result depends on area, lightness and the rest of the picture.'
  ],
  terms: [
    { term: 'Colour wheel', also: ['colour circle', 'hue circle'], def: 'An arrangement of hues round a circle so that neighbours are similar and opposites contrast.' },
    { term: 'Complementary colours', also: ['complements'], def: 'Two colours opposite each other on a wheel. Strictly, two colours whose mixture, as lights or averaged on a spinning disc, is neutral.' },
    { term: 'Primary, secondary and tertiary colours', def: 'Primaries are the colours from which others are mixed, secondaries mixtures of two primaries, tertiaries mixtures of a primary and a neighbouring secondary.' },
    { term: 'Analogous colours', def: 'Hues that are neighbours on the wheel, usually within about a third of a turn of each other.' },
    { term: 'Triad', also: ['triadic harmony', 'split complement'], def: 'Three hues spaced evenly round the wheel (a triad), or a hue with the two neighbours of its complement (a split complement).' }
  ],
  formulas: [],
  examples: [
    {
      title: 'Is red light complementary to cyan light?',
      q: 'Red (255, 0, 0) and cyan (0, 255, 255) lights of the same strength are mixed in equal parts on a white screen. What is the sum?',
      steps: [
        'Equal parts means averaging in **linear** light, channel by channel: red gets $(1 + 0)/2 = 0.5$, green $(0 + 1)/2 = 0.5$, blue $(0 + 1)/2 = 0.5$.',
        { text: 'A linear 0.5 is stored in sRGB as', tex: '1.055\\times 0.5^{1/2.4} - 0.055 = 0.735 \\;\\Rightarrow\\; 188' },
        'The result is (188, 188, 188): a neutral grey, chroma 0.'
      ],
      a: 'A neutral grey: red and cyan are strictly complementary on the wheel of light.'
    },
    {
      title: 'The opposite of a hue on the twelve-step wheel of light',
      q: 'On the wheel of light the twelve hues are 30° apart, with red at 0°. Which colour is opposite orange (30°)?',
      steps: [
        { text: 'The opposite of a hue is half a turn away:', tex: '30^\\circ + 180^\\circ = 210^\\circ' },
        'The colour at 210° is azure, a blue with a little green.'
      ],
      a: 'Azure. But the two do not cancel: their average keeps a chroma of 40, so orange and azure are opposite on the wheel and only roughly complementary.'
    }
  ],
  quiz: [
    { q: 'Which colour is opposite red on the wheel of light and print?', choices: ['Cyan', 'Green', 'Blue', 'Yellow'], a: 0, why: 'Red, green and blue lights make white together; red and cyan (green plus blue) are the pair that adds up to white.' },
    { q: 'Complementary pairs on every colour wheel add up to a neutral grey.', a: false, why: 'It depends on the wheel. On the painter\'s wheel red and green average to a clear colour (chroma 41 in the simulation), and on the RGB wheel orange and azure leave a chroma of 40.' },
    { q: 'Which scheme uses a hue and the two hues on either side of its complement?', choices: ['Split-complementary', 'Analogous', 'Triadic', 'Monochromatic'], a: 0, why: 'A split complement replaces the single opposite by its two neighbours, which gives contrast with less tension.' },
    { q: 'On the twelve-step wheel of light, hues are 30° apart and blue is at 240°. At what angle is its opposite?', answer: 60, unit: '°', why: '$240° - 180° = 60°$, which is yellow: blue and yellow average to a neutral on this wheel.' },
    { q: 'Why is the painter\'s wheel not simply wrong?', choices: ['It describes how pigments mix, which differs from how lights mix', 'Because painters are not scientists', 'Because green paint is really magenta', 'It is wrong but traditional'], a: 0, why: 'Mixing paints is subtractive and involves scattering; the red–yellow–blue wheel is a handy guide for it, though cyan, magenta and yellow would reach more colours.' }
  ],
  applications: [
    'Graphic design and branding: picking palettes for contrast and calm, usually checked for lightness contrast as well.',
    'Film and photographic grading: moving shadows towards blue-green and skin towards orange sets two near-opposite hues against each other.',
    'Stage and shop lighting: coloured gels are chosen in pairs that add to a neutral wash on a white wall.',
    'Charts and maps: diverging palettes put two opposite hues at the ends and a light neutral in the middle ([[colour-vision-deficiency]] limits the choice).'
  ],
  history: 'Newton drew the first colour circle in the *Opticks* of 1704, with the spectral colours placed round it and white at the centre. Moses Harris published an eighteen-hue wheel of red, yellow and blue in 1766, Goethe a symmetrical one in 1810, and Chevreul a circle of seventy-two hues in 1839 for the Gobelins tapestry works. Johannes Itten\'s twelve-hue wheel, taught at the Bauhaus, is the one most printed today.',
  sources: [
    'I. Newton, *Opticks* (1704), Book I, Part II — the colour circle.',
    'J. Itten, *The Art of Color* — the twelve-hue wheel and the colour schemes.',
    'J. Albers, *Interaction of Color* — how a colour changes with its neighbours.',
    'R. G. Kuehni, *Color Space and Its Divisions* — a history of colour circles, spheres and trees.'
  ],
  sim: 'cs-wheels'
},

/* ================================================================ additive and subtractive mixing */
{
  id: 'additive-and-subtractive-mixing', parent: 'colour-science', title: 'Additive and subtractive mixing', level: 1,
  short: 'Lights add: more lamps, more light, and red, green and blue together make white. Filters and inks multiply: each takes away part of the light, and cyan, magenta and yellow together make black. Both are exact rules about spectra, and they explain why screens use RGB, printers CMY, and why mixing paints is harder than either.',
  keywords: ['additive mixing', 'subtractive mixing', 'RGB', 'CMY', 'CMYK', 'primaries', 'secondaries', 'filters multiply', 'optical density adds', 'pigment mixing', 'Kubelka–Munk', 'halftone', 'partitive mixing', 'colour printing', 'Maxwell disc', 'colour mixing'],
  prereq: ['trichromatic-colour-vision', 'cie-colour-matching-and-xyz'],
  related: ['colour-wheels-and-harmony', 'neutral-density-and-optical-density', 'coloured-glass-filters', 'the-chromaticity-diagram', 'colour-spaces-and-gamuts', 'physics:color-mixing', 'dichroic-filters-and-mirrors'],
  body: `
Mixing colours means two different things, depending on whether you add light or take it away.

### Lights add
Shine a red lamp and a green lamp on one white screen and the light from the screen is the *sum* of the two spectra; the eye then reads that sum with its three cones. This is **additive** mixing. Red, green and blue lights in adjustable strengths reach a large range of colours, and all three at full strength make white:

| Lamps on | The sum looks |
|---|---|
| red + green | yellow |
| green + blue | cyan |
| red + blue | magenta |
| red + green + blue | white |

The simulation uses narrow-band lamps at 630, 525 and 465 nm, balanced so that all three together give daylight white. The yellow made by red and green has **no yellow in its spectrum**: two narrow bands that the L and M cones add up as they would a single yellow ([[trichromatic-colour-vision]]). Because light adds, sums are done in *linear* light, and luminance is $Y = 0.2126\\,R + 0.7152\\,G + 0.0722\\,B$, which is why a green looks so much brighter than a blue of the same power. Screens, projectors and stage lights mix additively, and so does the eye whenever small dots of colour lie closer than it can resolve: a printed halftone, the subpixels of a display, a painting made of dots.

### Filters multiply
A filter, a dye or an ink transmits a fraction $T(\\lambda)$ of the light at each wavelength. Put two in a beam and the fractions *multiply*; the colour is what neither removes. This is **subtractive** mixing. Its primaries are cyan, magenta and yellow, because each removes one third of the spectrum (red, green, blue) and passes the other two:

| Filters in the beam | What is left |
|---|---|
| cyan + yellow | green |
| yellow + magenta | red |
| magenta + cyan | blue |
| cyan + magenta + yellow | almost nothing: dark |

In the simulation, cyan and yellow dyes at density 1 leave only the band that both pass, a green. Because transmittances multiply, **optical densities add**: with $\\mathrm{OD} = -\\log_{10} T$, a filter of density 0.30 and one of 0.40 together have density 0.70 and pass 20 % ([[neutral-density-and-optical-density]]). A printer uses cyan, magenta and yellow inks and adds black (K): the three inks together make a muddy brown, and a black ink is cheaper and darker.

### Paint is harder
Mixing paints is neither of the two. Pigment grains scatter light as well as absorb it, and the result depends on how much of each happens at each wavelength: the Kubelka–Munk theory of 1931 describes it. Blue and yellow paint make green much as the two filters do, because the mixture reflects the band that both absorb least; but the scattering makes the result less predictable than either rule.

> [!key] Lights add: red, green and blue make white. Filters multiply: cyan, magenta and yellow make black. In both cases the colour follows from the spectrum, wavelength by wavelength.
`,
  ideas: [
    'Additive mixing sums spectra: red + green + blue lights make white, and more lamps mean more light.',
    'Subtractive mixing multiplies transmittances: cyan + magenta + yellow make black, and more filters mean less light.',
    'Red and green lights make yellow with no yellow in the spectrum; only the three cone signals match.',
    'Optical densities of stacked filters add, transmittances multiply.',
    'Paint and ink mixing also involves scattering and is less predictable than either rule.'
  ],
  pitfalls: [
    'Yellow light is made of red and green light — A yellow *looks* the same as a red + green mixture, but the mixture contains no yellow wavelength. The eye cannot tell, a prism or spectrometer can.',
    'Red, yellow and blue are the true primaries — For light they are red, green, blue; for filters and inks cyan, magenta, yellow. Red–yellow–blue is the painter\'s tradition and cannot reach vivid cyans and magentas.',
    'Mixing more colours always makes brighter colours — That is true for lights and false for filters and paints. More filters pass less light.',
    'Optical densities multiply — Transmittances multiply; densities, the logarithms, add.'
  ],
  terms: [
    { term: 'Additive mixing', def: 'Mixing by adding light: the spectra sum. Primaries red, green and blue; secondaries cyan, magenta, yellow; all three make white.' },
    { term: 'Subtractive mixing', def: 'Mixing by taking light away with filters, dyes or inks: transmittances multiply. Primaries cyan, magenta, yellow; all three make a dark, near-black colour.' },
    { term: 'CMYK', also: ['CMY', 'process colours'], def: 'The four inks of colour printing: cyan, magenta, yellow and key (black). Black is added because the three coloured inks alone give a brownish dark.' },
    { term: 'Partitive mixing', also: ['optical mixing'], def: 'Mixing in the eye of small dots or fast-alternating colours that it cannot resolve; the sum is additive.' },
  ],
  formulas: [
    {
      name: 'Transmittance of two filters in series',
      expr: 'T = T1*T2', tex: 'T = T_1\\,T_2',
      vars: {
        T: { name: 'transmittance of the pair', q: 'ratio', unit: '%' },
        T1: { name: 'transmittance of filter 1', q: 'ratio', unit: '%', value: 50, min: 0.001, max: 100, tex: 'T_1' },
        T2: { name: 'transmittance of filter 2', q: 'ratio', unit: '%', value: 40, min: 0.001, max: 100, tex: 'T_2' }
      },
      note: 'At one wavelength, ignoring the small reflections between the filters.',
      stories: { T: 'A filter passes {T1} of the light of one colour and a second passes {T2}. How much passes through both?' }
    },
    {
      name: 'Optical density of a filter',
      expr: 'OD = -log(T)', tex: '\\mathrm{OD} = -\\log_{10} T',
      vars: {
        OD: { name: 'optical density', tex: '\\mathrm{OD}' },
        T: { name: 'transmittance', q: 'ratio', unit: '%', value: 20, min: 0.0001, max: 100 }
      },
      note: 'Densities of filters in series add: OD = OD₁ + OD₂ + …',
      stories: { OD: 'A filter lets through {T} of the light. What is its optical density?', T: 'A filter has optical density {OD}. What fraction of the light does it transmit?' }
    }
  ],
  examples: [
    {
      title: 'Two filters in series',
      q: 'At 550 nm a filter transmits 50 % and another 40 %. What does the pair transmit, and how do the optical densities combine?',
      steps: [
        { text: 'Transmittances multiply:', tex: 'T = 0.50 \\times 0.40 = 0.20' },
        { text: 'The densities of the two filters are', tex: '\\mathrm{OD}_1 = -\\log_{10} 0.50 = 0.301 \\qquad \\mathrm{OD}_2 = -\\log_{10} 0.40 = 0.398' },
        { text: 'and they add:', tex: '\\mathrm{OD} = 0.301 + 0.398 = 0.699 \\;\\Rightarrow\\; T = 10^{-0.699} = 0.20' }
      ],
      a: '20 %, which is a density of 0.70. Multiplying the transmittances and adding the densities are the same statement.'
    },
    {
      title: 'The luminance of the three lamps',
      q: 'On a display, equal linear amounts of red, green and blue make white. What share of the white\'s luminance does the red lamp alone give, and the blue lamp alone?',
      steps: [
        'With the weights of sRGB, $Y = 0.2126\\,R + 0.7152\\,G + 0.0722\\,B$, a full lamp of one colour contributes its own weight.',
        'Red: 21 %. Green: 72 %. Blue: 7 %.'
      ],
      a: 'Red gives 21 % of the white\'s luminance and blue only 7 %: the blue of a screen is the least bright of the three, which is why dark blue text is hard to read on black.'
    }
  ],
  quiz: [
    { q: 'A screen shows yellow by lighting its red and green elements. What is in the spectrum of that light?', choices: ['Two narrow bands, red and green, and no yellow wavelength', 'A band of yellow wavelengths', 'Light of every wavelength', 'Only green light'], a: 0, why: 'The eye adds the L and M cone signals as it would for a spectral yellow, but the spectrum itself has no yellow in it.' },
    { q: 'A cyan filter and a magenta filter are put one behind the other in a beam of white light. What colour reaches the eye?', choices: ['Blue', 'Green', 'Red', 'White'], a: 0, why: 'Cyan removes red and magenta removes green: only blue passes both.' },
    { q: 'The optical densities of two filters in series multiply.', a: false, why: 'Transmittances multiply; densities, the logarithms of the inverse, add.' },
    { q: 'Two filters of optical density 0.3 and 0.5 are stacked. What percentage of the light passes?', answer: 15.8, unit: '%', why: 'The densities add to 0.8 and $T = 10^{-0.8} = 0.158$, that is 15.8 %.' },
    { q: 'Why do colour printers add a black ink to cyan, magenta and yellow?', choices: ['Three coloured inks together make only a muddy brown and a black ink is darker and cheaper', 'Black is a primary colour of subtractive mixing', 'To make the paper whiter', 'Because magenta alone is not available'], a: 0, why: 'Real inks absorb imperfectly, so C + M + Y gives a dark brown. A black ink gives a true black and saves coloured ink.' }
  ],
  applications: [
    'Displays and projectors: three kinds of additive emitter; a stage light with red, green and blue LEDs makes any colour from the three.',
    'Printing and inkjet: cyan, magenta, yellow and black inks, with small dots (halftones) that the eye mixes additively at a distance.',
    'Photography and theatre: coloured filters and gels, whose effect on a light can be computed by multiplying their curves.',
    'Painting and coatings: understanding why mixing many paints gives a duller colour, since every pigment absorbs more.'
  ],
  history: 'James Clerk Maxwell proposed that a colour picture could be made by photographing a scene through three coloured filters, and in 1861 had the photographer Thomas Sutton make the first example, a tartan ribbon, projected additively through the same filters. Louis Ducos du Hauron published the subtractive three-colour process in 1869; the Lumière brothers\' Autochrome of 1907, a mosaic of dyed starch grains, was an additive process that became the first widely used colour photography.',
  sources: [
    'R. W. G. Hunt, *The Reproduction of Colour* — additive and subtractive systems, halftones and inks.',
    'R. S. Berns, *Billmeyer and Saltzman\'s Principles of Color Technology* — pigments, dyes and their mixing.',
    'P. Kubelka and F. Munk, "Ein Beitrag zur Optik der Farbanstriche", *Zeitschrift für technische Physik* 12 (1931) 593–601.'
  ],
  sim: 'cs-mixing'
},

/* ================================================================ metamerism */
{
  id: 'metamerism', parent: 'colour-science', title: 'Metamerism', level: 2,
  short: 'Two surfaces can reflect quite different spectra and still match in one light, because the eye reads only three numbers. Change the light and the three numbers change differently: the match fails. This is metamerism, the reason a car bumper and a door, or a jacket and its trousers, can match in the shop and part in the street.',
  keywords: ['metamerism', 'metamers', 'metameric pair', 'illuminant metamerism', 'observer metamerism', 'isomeric', 'metameric black', 'colour match', 'light booth', 'matching under different illuminants', 'special metamerism index', 'colour mismatch'],
  prereq: ['cie-colour-matching-and-xyz', 'trichromatic-colour-vision'],
  related: ['colour-temperature-and-colour-rendering', 'colour-difference-and-tolerance', 'white-leds', 'spectrophotometers', 'colour-appearance-and-constancy', 'additive-and-subtractive-mixing', 'fluorescent-lamps'],
  body: `
Two paint chips match perfectly in a shop window. Carried outside, one looks greener than the other. Nothing has changed in either chip: what changed is the light that falls on them.

### Same numbers, different spectra
The three numbers of a colour are weighted sums of the spectrum that reaches the eye. For a surface that spectrum is the product of the light's spectrum $S(\\lambda)$ and the surface's reflectance $R(\\lambda)$:

$$X = k\\sum S(\\lambda)\\,R(\\lambda)\\,\\bar x(\\lambda)\\,\\Delta\\lambda,$$

and likewise for Y and Z. A reflectance curve has dozens of independent values, one per 10 nm across the visible range, but only three numbers survive the sums. So many different curves give identical X, Y and Z under one light: they are **metamers**. The difference between two metamers, a *metameric black*, is a curve whose three weighted sums are all zero: the eye cannot see it under that light.

Change the light and the weights change. The metameric black is no longer invisible, its three sums are no longer zero, and the pair parts. That is **illuminant metamerism**, usually just *metamerism*. Two surfaces with identical spectra match under every light and for every observer: such a match is **isomeric**.

### How big can it get?
In the simulation the two samples are built to match exactly in daylight (ΔE*ab = 0.00) and are then seen under other lights. For the green pair ΔE*ab rises to 10.4 under an incandescent lamp, 7.2 under a fluorescent tube and 8.0 under a low-pressure sodium lamp; for the brown pair to 10.1, 8.3 and 9.2. A neutral white LED parts the two pairs by 2.8 and 6.1. (A difference of about 1 is the smallest step a careful observer notices and 5 is plainly a different shade; see [[colour-difference-and-tolerance]].) Under the sodium lamp, a single narrow yellow line, every surface can only reflect more or less of it, so the pair differs in lightness alone. The more irregular a lamp's spectrum, the more room it leaves for a pair to part.

### Other kinds
- **Observer metamerism**: two *people* with slightly different cones disagree about a pair that matches for the standard observer. It shows most on displays with narrow primaries.
- **Field-size metamerism**: a match made on a small patch fails over a large area.
- **Geometric metamerism**: gloss and texture change the match with the angle of view.

### Practical rules
Judge a match under the lights it will meet: a **viewing booth** with daylight D65, a warm incandescent light (illuminant A) and a fluorescent source. Specify tolerances under more than one. If a match must hold under *every* light, match the reflectance curve, which usually means using the same pigments. The CIE defines a *special metamerism index*: the colour difference of a pair that matches under a reference light, when viewed under a test light.

> [!key] Different spectra can give the same three numbers, and then the colours match; another light weights the spectra differently and the match fails. A match that holds in every light needs the same spectrum.
`,
  ideas: [
    'Many different reflectance curves give the same X, Y, Z under one light; such a pair is metameric.',
    'A change of light weights the spectra differently, so a metameric pair parts: illuminant metamerism.',
    'Identical spectra match in every light (an isomeric match); metameric matches hold in one light only.',
    'The more irregular the lamp\'s spectrum, the larger the mismatch can be; a monochromatic lamp leaves only lightness differences.',
    'Check colour matches under the lights they will meet, in a viewing booth.'
  ],
  pitfalls: [
    'A perfect colour match is a perfect match — It is a match *for one light and one observer*. Another light, another viewer or a larger field can break it.',
    'The mismatch means one of the samples has changed colour — Neither has changed; the light has. Under daylight they match again.',
    'Metamerism is a fault of cheap colour — It is a consequence of three-number vision. Even the best colorimetry cannot give a match that holds in every light unless the spectra are the same.',
    'A colorimeter reading under one light tells you whether two samples will match anywhere — It tells you whether they match under *that* light. To predict others you need the full reflectance spectra, from a spectrophotometer.'
  ],
  terms: [
    { term: 'Metamerism', also: ['metameric match', 'illuminant metamerism'], def: 'The property of two surfaces with different spectra to match under one light and not under another.' },
    { term: 'Metamers', also: ['metameric pair', 'metameric colours'], def: 'Lights or surfaces that look the same but have different spectra.' },
    { term: 'Metameric black', def: 'A spectral curve that gives zero X, Y and Z under a given light: invisible there, but not under another light.' },
    { term: 'Isomeric match', also: ['spectral match'], def: 'A match between surfaces with the same reflectance curve, which holds under every light and for every observer.' },
    { term: 'Observer metamerism', def: 'A mismatch that appears because different observers have slightly different cone sensitivities.' },
    { term: 'Viewing booth', also: ['light booth', 'colour matching cabinet'], def: 'A cabinet with standard sources (daylight D65, tungsten A, fluorescent) in which colour matches are judged.' }
  ],
  formulas: [],
  examples: [
    {
      title: 'A pair that parts under a lamp',
      q: 'In daylight both samples of the green pair have CIELAB values (74.8, −36.4, 36.6). Under an incandescent lamp, adapted to its own white, sample 1 reads (73.0, −30.6, 27.5) and sample 2 reads (72.9, −20.3, 25.6). How large is the mismatch?',
      steps: [
        { text: 'The differences are', tex: '\\Delta L^* = -0.1,\\quad \\Delta a^* = +10.3,\\quad \\Delta b^* = -1.9' },
        { text: 'and the colour difference is', tex: '\\Delta E^*_{ab} = \\sqrt{0.01 + 106.1 + 3.6} \\approx 10.5' }
      ],
      a: 'About 10 (10.4 from the unrounded values): a clear mismatch, almost all in the red–green direction, from two samples that were identical in daylight.'
    },
    {
      title: 'Under a sodium lamp only the brightness shows',
      q: 'The low-pressure sodium lamp radiates almost only 589 nm. At that wavelength sample 1 reflects 0.43 and sample 2 reflects 0.33. What lightness does each have, relative to the lamp\'s own white?',
      steps: [
        'Under a single wavelength every surface gives the lamp\'s own chromaticity scaled by its reflectance; after adapting to the lamp the colour is a neutral and $Y = R$.',
        { tex: 'L_1^* = 116\\,(0.43)^{1/3} - 16 \\approx 72 \\qquad L_2^* = 116\\,(0.33)^{1/3} - 16 \\approx 64' }
      ],
      a: 'L* of 72 and 64, a difference of 8 and no difference in colour: the two samples are one grey lighter than the other, as in the simulation (ΔE*ab = 8.0).'
    }
  ],
  quiz: [
    { q: 'Two surfaces match in daylight but not under a fluorescent tube. This is called:', choices: ['Illuminant metamerism', 'An isomeric match', 'Colour constancy', 'Simultaneous contrast'], a: 0, why: 'A match that holds under one illuminant and fails under another is illuminant metamerism.' },
    { q: 'Surfaces with identical reflectance spectra can show metamerism.', a: false, why: 'Identical spectra give identical colour under every light and for every observer: an isomeric match, the opposite of metamerism.' },
    { q: 'Under a low-pressure sodium lamp two surfaces that match in daylight differ mainly in:', choices: ['lightness', 'hue', 'saturation', 'nothing at all'], a: 0, why: 'The lamp emits essentially one wavelength, so each surface can only reflect more or less of it: the pair differs in lightness alone.' },
    { q: 'A pair has reflectances 0.45 and 0.30 at a lamp\'s single wavelength. What is the difference in $L^*$ (1976 CIELAB, round to the nearest unit)?', answer: 11.2, why: '$L^* = 116 R^{1/3} - 16$ gives 72.9 for 0.45 and 61.7 for 0.30: a difference of 11.2.' },
    { q: 'Why can a colorimeter reading not predict whether two samples will match under other lights?', choices: ['It records only three numbers for one light, not the full spectra', 'Colorimeters are inaccurate', 'It cannot measure white', 'Matches depend on the temperature of the sample'], a: 0, why: 'To predict a match under another light you need the reflectance spectra, then compute the three numbers for that light.' }
  ],
  applications: [
    'Textiles, plastics and coatings: a part and its mating part, made from different pigments, are checked under daylight, tungsten and fluorescent sources.',
    'Cars: the bumper (plastic) and the body (metallic paint) often use different pigments and must match under every light the owner will meet.',
    'Printing and proofs: a proof matched in a viewing booth can differ under shop lighting; standard viewing conditions are specified for that reason.',
    'Retail and cosmetics: a product chosen under shop lamps and used in daylight; LED shop lighting with a high rendering index reduces the shift ([[colour-temperature-and-colour-rendering]]).'
  ],
  history: 'That different spectra can look the same followed from the first colour-matching experiments of Maxwell and Helmholtz in the 1850s, and was made quantitative by the CIE system of 1931, in which a match is simply equal X, Y and Z. Measures of how badly a pair fails under a change of light, the metamerism indices, were developed later and are described in the CIE\'s colorimetry publication.',
  sources: [
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae*, 2nd ed. — metamers and metameric blacks.',
    'CIE 15, *Colorimetry* — the special metamerism index.',
    'R. S. Berns, *Billmeyer and Saltzman\'s Principles of Color Technology* — metamerism in industrial colour matching.',
    'M. D. Fairchild, *Color Appearance Models* — observer and illuminant differences.'
  ],
  sim: 'cs-metamer'
},

/* ================================================================ colour difference */
{
  id: 'colour-difference-and-tolerance', parent: 'colour-science', title: 'Colour difference and tolerance', level: 2,
  short: 'ΔE is a single number for how far apart two colours are. In CIELAB the simplest, ΔE*ab, is the straight-line distance between two points; about 1 is the smallest difference a careful observer sees, and industries set tolerances of a few units. Because CIELAB is not perfectly uniform, newer formulas such as CIEDE2000 correct it.',
  keywords: ['delta E', 'ΔE', 'colour difference', 'tolerance', 'CIELAB', 'CIEDE2000', 'just noticeable difference', 'JND', 'colour tolerance', 'ΔE00', 'CMC', 'CIE94', 'acceptability', 'perceptibility', 'colour matching quality'],
  prereq: ['colour-spaces-and-gamuts', 'the-chromaticity-diagram'],
  related: ['metamerism', 'the-munsell-colour-system', 'colour-appearance-and-constancy', 'optical-sorting-and-colour-measurement', 'spectrophotometers', 'white-leds'],
  body: `
How different are two colours? "A little" will not do for a factory that has to accept or reject paint, textiles and printed packaging. A colour-difference formula turns the question into a number, **ΔE** (delta E, the E standing for the German *Empfindung*, sensation).

### ΔE*ab
CIELAB was designed so that equal distances look about equally different. The simplest formula, from 1976, is just the distance between the two points $(L^*, a^*, b^*)$:

$$\\Delta E^*_{ab} = \\sqrt{(\\Delta L^*)^2 + (\\Delta a^*)^2 + (\\Delta b^*)^2}$$

Rules of thumb that are widely quoted, and that depend on the viewing conditions, are:

| ΔE*ab | What most observers see |
|---|---|
| under 1 | nothing: not perceptible |
| 1 to 2 | perceptible only on a close, side-by-side look |
| 2 to 10 | perceptible at a glance |
| over 10 | the colours are plainly different |

A pair is **just noticeable** (a JND) near 1 only in good conditions: the two samples touching, large, evenly lit and on a neutral surround. Put a gap between them, or judge from memory, and the same difference goes unseen; the simulation shows this when you tick *leave a gap*.

### The trouble with ΔE*ab
CIELAB is only roughly uniform: the same distance looks different in different parts of the space. ΔE*ab = 3 is easy to see between two greys and harder between two saturated colours. Newer formulas keep the CIELAB coordinates and weight the three parts of the difference. The best known, **CIEDE2000** (ΔE00, published in 2001), divides the lightness, chroma and hue differences by weights that depend on lightness, chroma and hue, and adds a rotation term in the blue region. For a neutral grey it gives much the same number as ΔE*ab: a step of 2.0 in $b^*$ gives 1.9. For a strong red the weights discount colour differences: a step of 3.0 in $a^*$ gives only about 1.0, while 3.0 in lightness still gives 2.9. ΔE00 is the safer choice for new tolerances; ΔE*ab is still common in older specifications and instruments.

### Setting a tolerance
A **tolerance** is a limit on ΔE that a buyer and a supplier agree. It depends on what is judged: a demanding single-colour match, such as a brand colour on neighbouring packages, is held to a few units at most, and printing standards allow several units on solid inks. The direction matters too, so tolerances can be set separately for lightness, chroma and hue; a lighter or darker sample is generally easier to notice than a slightly more saturated one. And a tolerance should be tested under more than one light ([[metamerism]]).

> [!key] ΔE is the distance between two colours in a space built to be roughly uniform. About 1 is the smallest visible step in the best conditions; CIEDE2000 corrects what is left of CIELAB's unevenness.
`,
  ideas: [
    'ΔE*ab is the straight-line distance between two colours in CIELAB.',
    'About 1 is the smallest difference seen under ideal conditions (touching samples); about 2 to 10 is visible at a glance.',
    'CIELAB is only roughly uniform, so equal ΔE*ab do not always look equal.',
    'CIEDE2000 corrects the lightness, chroma and hue differences with weights and a blue-region term.',
    'A tolerance is an agreed limit of ΔE, checked under the lights and viewing conditions of use.'
  ],
  pitfalls: [
    'A ΔE of 1 is invisible to everyone, always — It is the smallest step for a trained observer in ideal side-by-side conditions. With a gap, a different surround or from memory it is hidden, and in some parts of colour space even 2 or 3 is hard to see.',
    'ΔE*ab and ΔE00 give the same number — They agree for pale and neutral colours and diverge for saturated ones, by factors of two or more. A tolerance quoted as "ΔE" must say which formula.',
    'A small ΔE means the colours match under every light — ΔE is computed for one light and one observer. A metameric pair can have ΔE of 0 in one light and 10 in another.',
    'ΔE can be computed from the RGB values of the two pixels — Only after converting them to CIELAB through the colour profile of the screen or camera.'
  ],
  terms: [
    { term: 'ΔE', also: ['delta E', 'colour difference'], def: 'A number measuring how far apart two colours are, in a colour space built so that equal distances look about equally different.' },
    { term: 'ΔE*ab', also: ['CIE 1976 colour difference'], def: 'The distance between two points in CIELAB: the square root of the sum of the squares of the differences in L*, a* and b*.' },
    { term: 'CIEDE2000', also: ['ΔE00', 'ΔE2000'], def: 'The CIE colour-difference formula of 2001, which weights the lightness, chroma and hue differences and adds a rotation term for the blue region.' },
    { term: 'Just noticeable difference', also: ['JND', 'threshold'], def: 'The smallest colour difference an observer can see; about 1 ΔE*ab for touching samples in good conditions.' },
    { term: 'Colour tolerance', also: ['tolerance', 'acceptability'], def: 'An agreed limit on the colour difference between a sample and its standard.' }
  ],
  formulas: [
    {
      name: 'Colour difference in CIELAB (ΔE*ab)',
      expr: 'dE = sqrt(dL^2 + da^2 + db^2)', tex: '\\Delta E^* = \\sqrt{(\\Delta L^*)^2 + (\\Delta a^*)^2 + (\\Delta b^*)^2}',
      vars: {
        dE: { name: 'colour difference ΔE*ab', tex: '\\Delta E^*' },
        dL: { name: 'difference in lightness', signed: true, value: 2, tex: '\\Delta L^*' },
        da: { name: 'difference in a*', signed: true, value: 2, tex: '\\Delta a^*' },
        db: { name: 'difference in b*', signed: true, value: -3, tex: '\\Delta b^*' }
      },
      note: 'The 1976 formula; CIEDE2000 replaces it where accuracy matters.',
      stories: { dE: 'Two colours differ by {dL} in L*, {da} in a* and {db} in b*. What is ΔE*ab?' }
    }
  ],
  examples: [
    {
      title: 'Is this batch within tolerance?',
      q: 'A standard has CIELAB values (50, 20, 30). A new batch measures (52, 22, 27). Find ΔE*ab and say what an observer would see.',
      steps: [
        { text: 'The differences are $\\Delta L^* = 2$, $\\Delta a^* = 2$, $\\Delta b^* = -3$, so', tex: '\\Delta E^*_{ab} = \\sqrt{2^2 + 2^2 + 3^2} = \\sqrt{17} = 4.12' },
        'That lies between 2 and 10: visible at a glance when the two are side by side, and outside a tolerance of 2 or 3.'
      ],
      a: 'ΔE*ab = 4.1: a visible difference. (CIEDE2000 gives 3.3 for this pair.)'
    },
    {
      title: 'Two formulas, one pair of blues',
      q: 'Two blues have CIELAB values (50, 2.68, −79.78) and (50, 0, −82.75). Compare ΔE*ab with CIEDE2000.',
      steps: [
        { text: 'The lightness is the same; the differences are $\\Delta a^* = -2.68$ and $\\Delta b^* = -2.97$:', tex: '\\Delta E^*_{ab} = \\sqrt{2.68^2 + 2.97^2} = 4.00' },
        'CIEDE2000 divides the chroma and hue parts by weights that grow with chroma (here C* is about 80) and corrects the blue region, which gives 2.04.'
      ],
      a: '4.00 against 2.04: for a very saturated blue, the older formula overstates the difference by a factor of two.'
    }
  ],
  quiz: [
    { q: 'A just noticeable difference in the best viewing conditions is about:', choices: ['ΔE*ab of 1', 'ΔE*ab of 10', 'ΔE*ab of 0.01', 'ΔE*ab of 50'], a: 0, why: 'About 1 for touching samples, evenly lit on a neutral surround. In everyday viewing it is larger.' },
    { q: 'Equal ΔE*ab always look equally different, whatever the colours.', a: false, why: 'CIELAB is only roughly uniform. The same distance looks smaller for saturated colours than for greys; that is why CIEDE2000 weights the three parts of the difference.' },
    { q: 'Which formula corrects CIELAB\'s unevenness with lightness, chroma and hue weights and a blue-region term?', choices: ['CIEDE2000', 'ΔE*ab', 'The chromaticity distance in xy', 'The Euclidean distance in RGB'], a: 0, why: 'CIEDE2000, published in 2001. The distance in RGB is not perceptual at all.' },
    { q: 'Two colours are (60, 10, 10) and (62, 13, 6). Find ΔE*ab.', answer: 5.385, why: '$\\sqrt{2^2 + 3^2 + 4^2} = \\sqrt{29} = 5.39$.' },
    { q: 'Why is a difference easier to see when the two samples touch?', choices: ['The eye compares edges far better than separate patches, so the contrast is exaggerated', 'Touching samples are brighter', 'The colours mix', 'Because ΔE is smaller'], a: 0, why: 'Vision is built to detect edges and ratios; a boundary between two nearly equal colours is seen where two separate patches would not be.' }
  ],
  applications: [
    'Printing and packaging: checking that a brand colour stays within a ΔE tolerance from reel to reel and across suppliers.',
    'Paint, plastics and textiles: batch release against a standard, with separate tolerances for lightness, chroma and hue.',
    'Display and camera calibration: the accuracy of a calibrated screen is quoted as the mean ΔE of a set of test colours.',
    'Sorting by colour: fruit, grain and recycled plastic are accepted or rejected by a ΔE from a reference ([[optical-sorting-and-colour-measurement]]).'
  ],
  history: 'The CIE recommended CIELAB and ΔE*ab in 1976. Textile dyers developed the CMC formula in the 1980s from a large body of acceptability judgements; the CIE issued CIE94 in 1994 and CIEDE2000 in 2001, after a long collaboration of laboratories that tested candidate formulas against visual data. David MacAdam\'s ellipses of 1942, which showed how unevenly the xy diagram is spaced, were the first sign that a single distance would never be enough.',
  sources: [
    'CIE 15, *Colorimetry* — CIELAB and the 1976 colour-difference formula.',
    'M. R. Luo, G. Cui and B. Rigg, "The development of the CIE 2000 colour-difference formula: CIEDE2000", *Color Research and Application* 26 (2001) 340–350.',
    'G. Sharma, W. Wu and E. N. Dalal, "The CIEDE2000 color-difference formula: implementation notes, supplementary test data, and mathematical observations", *Color Research and Application* 30 (2005) 21–30.',
    'ISO/CIE 11664-6, *Colorimetry — Part 6: CIEDE2000 colour-difference formula*.'
  ],
  sim: 'cs-deltae'
},

/* ================================================================ white balance */
{
  id: 'white-balance-and-chromatic-adaptation', parent: 'colour-science', title: 'White balance and chromatic adaptation', level: 2,
  short: 'A white sheet looks white in candlelight and in daylight though the light reaching the eye differs hugely. The eye does this by adapting; a camera does it by white balance, scaling its channels so that a known white comes out neutral. Both rescale the three signals independently, which is exact for the white and only approximate for the other colours.',
  keywords: ['white balance', 'chromatic adaptation', 'von Kries', 'colour temperature', 'mired', 'grey card', 'auto white balance', 'colour cast', 'Bradford', 'illuminant', 'tungsten', 'daylight', 'colour correction filter', 'grey world', 'gains'],
  prereq: ['colour-temperature-and-colour-rendering', 'the-chromaticity-diagram', 'trichromatic-colour-vision'],
  related: ['colour-appearance-and-constancy', 'colour-spaces-and-gamuts', 'metamerism', 'white-leds', 'colour-filter-arrays-and-demosaicing', 'opponent-colours'],
  body: `
A sheet of paper looks white at noon and still white by candlelight, though the candle's light is far redder and the paper really does send more red to the eye in the evening. A camera set for daylight and used indoors under a tungsten lamp returns a picture that is orange all over. **White balance** is how cameras and software do what the eye does without being asked.

### How different the lights are
| Light | Correlated colour temperature | Chromaticity (x, y) | Mired |
|---|---|---|---|
| Candle | 1850 K | 0.543, 0.410 | 540 |
| Tungsten lamp | 2700 K | 0.460, 0.411 | 370 |
| Daylight D65 | 6500 K | 0.313, 0.329 | 154 |
| Black body at 10 000 K | 10 000 K | 0.281, 0.288 | 100 |

The **mired** (micro reciprocal degree) is $10^6/T$. Equal steps in mired look like equal steps in colour, which kelvins do not: from 2700 to 3200 K is a bigger change than from 6500 to 7000 K. A filter's effect is therefore quoted in mired: a blue filter that converts 3200 K light to 5500 K shifts by $10^6/5500 - 10^6/3200 = -131$ mired.

### The camera's method
A camera records three numbers per pixel. To balance them it needs to know which colour is white: from the user (a preset such as "tungsten", a number of kelvins, or a click on a grey card) or by guessing (**auto white balance**: assume that the scene averages to grey, or that the brightest pixels are white, or use a trained model). It then multiplies the red, green and blue channels by **gains** that turn that white into equal values. In the simulation a black body of 3000 K needs gains of about 0.64 : 1.00 : 2.23 (red : green : blue): the blue is more than doubled and the red cut by a third, and with the blue go its noise and its clipping.

### The eye's method
The eye adapts too, over seconds to minutes, and the oldest model still fits best. Johannes von Kries suggested in 1902 that each cone type rescales its own signal by a gain that depends on the light, so that a white gives the same L, M, S signals under every illuminant. Modern **chromatic adaptation transforms** (Bradford, CAT02) do the same in a *sharpened* cone-like space, and colour management uses one to convert between white points, for example from D65 to the D50 of the ICC profile connection space.

### How well does it work?
For the white and the greys: perfectly, by construction. For other colours: roughly, because the lamp's spectrum is not a scaled daylight spectrum ([[metamerism]]). In the simulation, a 3000 K light leaves the 24-patch chart an average of about 7 units of ΔE*ab from its daylight appearance after balancing (before: about 40); 2000 K leaves about 15 and 10 000 K about 2. With camera gains, a fluorescent tube leaves an average of 5, with the worst patch 23 off, and a warm LED an average of 11, with the worst patch 50 off. With a strongly coloured light, balancing helps little.

> [!tip] Mixed lighting, a window and a tungsten lamp in one room, has no single right balance: whatever is correct for one source is tinted under the other.

> [!key] White balance scales the three channels so that a known white comes out neutral, as the eye's adaptation scales the three cone signals. It fixes the white, and the other colours only approximately.
`,
  ideas: [
    'The eye and cameras compensate for the colour of the light by scaling the three channels independently.',
    'White balance chooses the gains by making a known white (a grey card, or a guessed white) neutral.',
    'Mired (10⁶ / T) is the scale on which colour-temperature changes are uniform; filters are quoted in mired shift.',
    'The von Kries model scales the cone signals; modern transforms do it in a sharpened cone-like space.',
    'Balancing fixes whites and greys exactly and other colours only roughly; the leftover depends on the lamp\'s spectrum.'
  ],
  pitfalls: [
    'A colour temperature in kelvins says everything about a light — It says where the light lies along the Planckian curve. Two lights of equal temperature can differ in greenish or pinkish cast, which a white-balance setting in kelvins alone cannot correct.',
    'White balance restores the true colours of a scene — It makes one chosen white neutral. The other colours move by an amount that depends on the lamp\'s spectrum.',
    'Auto white balance always finds the white — It guesses. A scene dominated by one colour, such as a red wall or a green lawn, fools the grey-world assumption.',
    'The eye does not adapt at all, a camera must — The eye adapts continuously, and so strongly that people rarely notice the colour of room lighting until they go outside.'
  ],
  terms: [
    { term: 'White balance', also: ['WB', 'colour balance'], def: 'Scaling the red, green and blue channels of an image so that a chosen white (or grey) is neutral, removing the colour cast of the light.' },
    { term: 'Chromatic adaptation', also: ['colour adaptation'], def: 'The adjustment of the visual system to the colour of the illumination, which makes a white surface look white under different lights.' },
    { term: 'Von Kries adaptation', also: ['von Kries transform'], def: 'The model in which each cone type rescales its signal by its own gain, set by the illuminant.' },
    { term: 'Grey card', also: ['white reference'], def: 'A neutral surface of known reflectance (often 18 % grey), photographed to set the white balance and the exposure.' }
  ],
  formulas: [
    {
      name: 'Mired value of a colour temperature',
      expr: 'M = 10^6/T', tex: 'M = \\frac{10^6}{T}',
      vars: {
        M: { name: 'mired value' },
        T: { name: 'colour temperature', q: 'temperature', unit: 'K', value: 6500, min: 1000, max: 40000 }
      },
      note: 'A shift in mired is the difference of two such values.',
      stories: { M: 'Daylight has a colour temperature of {T}. What is it in mired?' }
    },
    {
      name: 'Mired shift of a conversion filter',
      expr: 'dM = 10^6/T2 - 10^6/T1', tex: '\\Delta M = \\frac{10^6}{T_2} - \\frac{10^6}{T_1}',
      vars: {
        dM: { name: 'mired shift', signed: true, tex: '\\Delta M' },
        T1: { name: 'colour temperature of the light', q: 'temperature', unit: 'K', value: 3200, min: 1000, max: 40000, tex: 'T_1' },
        T2: { name: 'colour temperature wanted', q: 'temperature', unit: 'K', value: 5500, min: 1000, max: 40000, tex: 'T_2' }
      },
      note: 'Negative: a bluish filter (towards a higher temperature). Positive: an orange filter.',
      stories: { dM: 'A filter is to make light of {T1} look like light of {T2}. What mired shift does it need?' }
    },
    {
      name: 'White-balance gain of one channel',
      expr: 'g = Rt/Rm', tex: 'g = \\frac{R_t}{R_m}',
      vars: {
        g: { name: 'gain for this channel' },
        Rt: { name: 'value the white should have in this channel', value: 0.5, min: 0.0001, max: 10, tex: 'R_t' },
        Rm: { name: 'value measured on the white patch in this channel', value: 0.25, min: 0.0001, max: 10, tex: 'R_m' }
      },
      note: 'Linear values. The gain of the green channel is usually taken as 1.',
      stories: { g: 'A grey card should read {Rt} in the blue channel but reads {Rm}. What gain must the blue channel get?' }
    }
  ],
  examples: [
    {
      title: 'A filter for tungsten film',
      q: 'What mired shift converts tungsten light of 3200 K to daylight of 5500 K, and what for 2700 K to 6500 K?',
      steps: [
        { text: 'Mired values: $10^6/3200 = 312.5$ and $10^6/5500 = 181.8$:', tex: '\\Delta M = 181.8 - 312.5 = -130.7' },
        { text: 'And $10^6/2700 = 370.4$, $10^6/6500 = 153.8$:', tex: '\\Delta M = 153.8 - 370.4 = -216.6' }
      ],
      a: 'A bluish filter of about −131 mired for the first, and −217 mired for the second: the further apart the lights, the stronger the filter.'
    },
    {
      title: 'Gains from a grey card',
      q: 'Under a tungsten lamp a grey card is recorded with linear values R = 0.80, G = 0.52, B = 0.25. What gains make it neutral, keeping the green channel as it is?',
      steps: [
        { text: 'Target value 0.52 in every channel:', tex: 'g_R = \\frac{0.52}{0.80} = 0.65 \\qquad g_G = \\frac{0.52}{0.52} = 1.00 \\qquad g_B = \\frac{0.52}{0.25} = 2.08' }
      ],
      a: 'Gains 0.65 : 1.00 : 2.08. The blue channel is doubled, which also doubles its noise: a tungsten photograph balanced to daylight is noisiest in the blue.'
    }
  ],
  quiz: [
    { q: 'What is the mired value of daylight at 6500 K, to the nearest unit?', answer: 154, why: '$10^6/6500 = 153.8$, so 154 mired.' },
    { q: 'A scene filled with one large red wall is balanced by an "average of the scene is grey" automatic white balance. What goes wrong?', choices: ['The picture is pushed towards the opposite colour, because the red wall is taken for a cast', 'Nothing: the method is exact', 'The red wall turns black', 'The camera cannot expose'], a: 0, why: 'The grey-world assumption treats the red average as the colour of the light and removes it, tinting the whole picture cyan-ish.' },
    { q: 'After white balancing on a grey card all the colours in the picture are exactly right.', a: false, why: 'The grey card is exactly neutral by construction; the other colours are corrected only approximately, because the lamp\'s spectrum is not a scaled daylight spectrum.' },
    { q: 'A filter converts 6500 K light to 3200 K. What is its mired shift (to one decimal)?', answer: 158.7, why: '$\\Delta M = 10^6/3200 - 10^6/6500 = 312.5 - 153.8 = +158.7$: an orange filter.' },
    { q: 'Which model of the eye\'s adaptation scales each cone type separately?', choices: ['Von Kries', 'Hering', 'Munsell', 'Newton'], a: 0, why: 'The von Kries model of 1902: each cone type multiplies its signal by a gain that depends on the illuminant.' }
  ],
  applications: [
    'Photography and film: balance presets, a grey card or a colour chart in the first frame, and colour-correction filters or gels (orange and blue) in front of lamps.',
    'Display setup: the white point of a monitor is set to D65 for video and the web, D50 for print proofing, and a shop or a car interior may be set differently.',
    'Machine vision: a white reference tile is imaged at start-up and the gains stored, so that colour readings do not drift with the lamp ([[the-machine-vision-system]]).',
    'Colour management: chromatic adaptation transforms convert colours between a source and a destination white point.'
  ],
  history: 'Johannes von Kries proposed the cone-scaling model of adaptation in 1902, as part of a general theory of vision. The Bradford transform, a sharpened version, was derived at the University of Bradford in the 1980s from textile colour-matching data and is used in ICC colour management; the CIE reviewed the competing transforms in 2004 and proposed CAT02 for its colour appearance model. Colour-temperature conversion filters were a staple of photographers long before digital cameras had automatic white balance.',
  sources: [
    'M. D. Fairchild, *Color Appearance Models* — the chapters on chromatic adaptation and on colour constancy.',
    'CIE 160, *A review of chromatic adaptation transforms* (2004).',
    'R. W. G. Hunt, *The Reproduction of Colour* — white balance, colour temperature and mired in photography.'
  ],
  sim: 'cs-whitebalance'
},

/* ================================================================ colour appearance and constancy */
{
  id: 'colour-appearance-and-constancy', parent: 'colour-science', title: 'Colour appearance and constancy', level: 2,
  short: 'A colour as measured and a colour as seen are not the same: the appearance of a patch depends on its surroundings, on the light, and on what the eye has adapted to. Vision gives surfaces roughly the same colour under different lights (colour constancy) and makes identical patches look different on different backgrounds (simultaneous contrast).',
  keywords: ['colour appearance', 'colour constancy', 'simultaneous contrast', 'chromatic induction', 'lightness constancy', 'retinex', 'Land', 'surround', 'adapting luminance', 'CIECAM02', 'CAM16', 'brightness', 'lightness', 'colourfulness', 'chroma', 'saturation', 'Hunt effect', 'Stevens effect', 'the dress'],
  prereq: ['white-balance-and-chromatic-adaptation', 'opponent-colours'],
  related: ['colour-illusions-and-afterimages', 'brightness-and-contrast-illusions', 'colour-difference-and-tolerance', 'metamerism', 'light-and-dark-adaptation', 'colour-wheels-and-harmony'],
  body: `
A piece of coal in sunlight sends more light to the eye than white paper in a lit room: about 1270 cd/m² against 143 cd/m². Yet the coal looks black and the paper white. What we see is not the light from a patch but a judgement about the *surface*, made by comparing the patch with its surroundings and allowing for the lamp.

### Constancy
**Lightness constancy** and **colour constancy** name that judgement. A tomato looks red at noon and at dusk though the light it sends differs a great deal; a white shirt is white indoors and out. The visual system does it by comparing: the *ratios* of the light from neighbouring patches change little when the lamp changes, because a lamp multiplies all patches alike. Edwin Land's experiments with the *retinex* theory in the 1960s and 1970s put this on a firm footing: a patch in a picture of many coloured patches keeps its colour even when the lamps are changed so that the patch sends the eye what a different patch sent before. Constancy is **partial**, though: good for familiar surfaces under ordinary lights, poor under strongly coloured or narrow-spectrum lamps, and easily fooled. The "dress" photograph of 2015 divided viewers into those who assumed a bluish daylight (white and gold) and those who assumed a warm one (blue and black).

### Contrast
The same logic runs the other way when the surround differs. A grey patch on a dark surround looks lighter than the same patch on a light one: **simultaneous contrast**. On a coloured surround the patch takes on the *opponent* colour, so a grey on red looks faintly green ([[opponent-colours]]). The effect is strongest where the patch touches the surround and disappears when the two patches are brought together, as in the simulation. Chevreul described it in 1839 as the law of the simultaneous contrast of colours, and Albers taught it as *Interaction of Color*.

### The vocabulary of appearance
Colour appearance science separates the attributes that everyday words mix up:

| Attribute | Meaning |
|---|---|
| Hue | red, yellow, green, blue and their blends |
| Brightness | how much light the patch appears to give |
| Lightness | brightness judged relative to the white of the scene |
| Colourfulness | how much hue the patch seems to have |
| Chroma | colourfulness relative to the white of the scene |
| Saturation | colourfulness relative to the patch's own brightness |

### Effects of the viewing conditions
Colourfulness grows with luminance (the **Hunt effect**), and so does contrast (the **Stevens effect**): a picture seen bright looks more colourful and more contrasty than the same picture dim. A dark surround, as in a cinema, needs more contrast in the picture than a bright one. **Colour appearance models** (CIECAM02 of 2002 and its successor CAM16) take the measured tristimulus values together with the white, the surround and the adapting luminance and predict these attributes; they are the tools of image reproduction.

> [!key] The eye reports surfaces, not light: patches are judged against their surroundings and corrected for the lamp. That gives constancy, and illusions where the surround misleads.
`,
  ideas: [
    'We see surfaces, not the light from them: a patch is judged against its surround and corrected for the illumination.',
    'Colour and lightness constancy keep surfaces looking the same under different lamps; they are partial.',
    'Simultaneous contrast: a patch looks lighter on a dark surround and takes the opponent hue of a coloured surround.',
    'Appearance has separate attributes: hue, brightness, lightness, colourfulness, chroma and saturation.',
    'Viewing conditions matter: luminance (Hunt, Stevens effects), surround and adaptation; appearance models predict them.'
  ],
  pitfalls: [
    'Two patches that send the same light to the eye look the same — Their appearance depends on their surroundings. Identical greys on dark and light surrounds look different; two different greys can look equal.',
    'Colour constancy means colours never change with the light — It is partial. Under a strongly coloured lamp or a narrow-spectrum light constancy fails, and a colour measured in one light is not the colour seen in another.',
    'Brightness, lightness and saturation are all words for the same thing — They are different attributes: brightness is absolute, lightness is relative to white, saturation is colourfulness relative to the patch\'s own brightness.',
    'Optical illusions show that the eye is faulty — The same mechanism that gives simultaneous contrast gives constancy in everyday scenes; the "illusion" appears when the surround is not what the visual system assumes.'
  ],
  terms: [
    { term: 'Colour constancy', also: ['lightness constancy'], def: 'The tendency of surfaces to keep their apparent colour (or lightness) when the illumination changes.' },
    { term: 'Simultaneous contrast', also: ['chromatic induction'], def: 'The change in a patch\'s appearance caused by its surround: lighter on a dark ground, tinted with the opponent hue of a coloured ground.' },
    { term: 'Lightness', also: ['relative brightness'], def: 'The brightness of a surface judged relative to the brightness of a white surface in the same scene.' },
    { term: 'Colourfulness and chroma', also: ['saturation'], def: 'Colourfulness is the amount of hue a patch seems to have; chroma is that relative to the white of the scene; saturation is relative to the patch\'s own brightness.' },
    { term: 'Colour appearance model', also: ['CIECAM02', 'CAM16'], def: 'A calculation that predicts the appearance attributes of a colour from its tristimulus values and the viewing conditions: white, surround, adapting luminance.' }
  ],
  formulas: [
    {
      name: 'Luminance of a diffuse surface',
      expr: 'L = rho*E/pi', tex: 'L = \\frac{\\rho\\,E}{\\pi}',
      vars: {
        L: { name: 'luminance', q: 'luminance', unit: 'cd/m²' },
        rho: { name: 'reflectance of the surface', q: 'ratio', unit: '%', value: 90, min: 0.1, max: 100, tex: '\\rho' },
        E: { name: 'illuminance on it', q: 'illuminance', unit: 'lx', value: 500 }
      },
      note: 'A perfectly diffuse (Lambertian) surface. White paper is about 90 %, coal 4 %.',
      stories: { L: 'A surface of reflectance {rho} is lit by {E}. What is its luminance?' }
    }
  ],
  examples: [
    {
      title: 'Coal in the sun and paper indoors',
      q: 'Coal reflects 4 % and is lit by full sunlight of 100 000 lx. White paper reflects 90 % and is lit in a room at 500 lx. Compare the luminances.',
      steps: [
        { text: 'Coal:', tex: 'L = \\frac{0.04 \\times 100\\,000}{\\pi} = 1273\\ \\mathrm{cd/m^2}' },
        { text: 'Paper:', tex: 'L = \\frac{0.90 \\times 500}{\\pi} = 143\\ \\mathrm{cd/m^2}' }
      ],
      a: 'The coal sends nine times more light to the eye, yet looks black: the visual system compares each surface with the white of its own scene.'
    },
    {
      title: 'A ratio that does not change',
      q: 'A patch of reflectance 0.2 lies next to a surround of 0.6. Compare the luminances at 100 lx and at 10 000 lx.',
      steps: [
        { text: 'At 100 lx:', tex: 'L_{\\mathrm{patch}} = \\frac{0.2 \\times 100}{\\pi} = 6.4 \\qquad L_{\\mathrm{surround}} = \\frac{0.6 \\times 100}{\\pi} = 19.1' },
        { text: 'At 10 000 lx both are a hundred times larger, 637 and 1910 cd/m², but the ratio stays', tex: '\\frac{L_{\\mathrm{patch}}}{L_{\\mathrm{surround}}} = \\frac{0.2}{0.6} = \\frac13' }
      ],
      a: 'The luminances change a hundredfold; the ratio stays 1 : 3. Vision reads the ratio, which is a property of the surfaces, and so the patch keeps its apparent lightness.'
    }
  ],
  quiz: [
    { q: 'Why does coal in sunlight look black although it sends more light to the eye than white paper in a room?', choices: ['Vision judges each surface relative to its surroundings and to the white of its scene', 'Coal absorbs all light so it cannot send any', 'Sunlight is not visible to the eye', 'The pupil closes in the sun'], a: 0, why: 'The luminance of the coal is nine times that of the paper in the example, but relative to the bright white surfaces around it, it is the darkest thing in the scene.' },
    { q: 'Colour constancy is perfect: a surface looks exactly the same colour under any lamp.', a: false, why: 'Constancy is partial. It works well for familiar surfaces under ordinary lamps and fails under strongly coloured or narrow-spectrum light.' },
    { q: 'A neutral grey patch on a green surround looks:', choices: ['faintly pinkish', 'faintly green', 'exactly grey', 'darker green'], a: 0, why: 'Chromatic induction takes the opponent colour of the surround: red-ish against green.' },
    { q: 'White paper (reflectance 0.9) is lit by 300 lx. What is its luminance in cd/m²?', answer: 85.9, unit: 'cd/m²', why: '$L = \\rho E/\\pi = 0.9\\times 300/\\pi = 85.9$ cd/m².' },
    { q: 'The effect by which colourfulness grows with luminance is called:', choices: ['The Hunt effect', 'The Stevens effect', 'Weber\'s law', 'The Purkinje shift'], a: 0, why: 'Hunt effect: colours look more colourful at higher luminance. The Stevens effect is the increase of contrast.' }
  ],
  applications: [
    'Image reproduction: a film or video graded for a dark cinema is mapped for a bright living room using an appearance model, because the same picture looks different in the two.',
    'Display design: brightness and contrast adaptation to ambient light, and the standard dim surround for studio monitors.',
    'Interior and product design: how a colour looks next to other colours and under the actual lighting, not as a chip in the hand.',
    'Painting and design teaching: exercises with identical colours on different grounds that show how appearance follows context.'
  ],
  history: 'Michel-Eugène Chevreul, a chemist directing the dye works of the Gobelins tapestry factory, published his law of simultaneous contrast in 1839 after tracing the complaints about dull colours to the neighbours of those colours. Edwin Land (the founder of instant photography) began his retinex experiments in the 1960s, and described them in *Scientific American* in 1977. The CIE published the colour appearance model CIECAM02 in 2004 as a technical report.',
  sources: [
    'M. D. Fairchild, *Color Appearance Models* — the attributes of appearance, viewing conditions and the models.',
    'E. H. Land, "The retinex theory of color vision", *Scientific American* 237 (6), December 1977, 108–128.',
    'CIE 159:2004, *A colour appearance model for colour management systems: CIECAM02*.',
    'J. Albers, *Interaction of Color*.'
  ],
  sim: 'cs-appearance'
},

/* ================================================================ where colours come from */
{
  id: 'where-colours-come-from', parent: 'colour-science', title: 'Where colours come from', level: 1,
  short: 'A colour is a spectrum, and a spectrum can be shaped in a handful of ways: absorption by pigments and dyes, scattering by small particles, interference and diffraction in fine structures, emission by hot or excited matter, and fluorescence. Each has its own signature: pigments fade, structural colours shift with the angle, hot bodies follow a temperature.',
  keywords: ['why things have colour', 'pigment', 'dye', 'absorption', 'scattering', 'structural colour', 'interference', 'iridescence', 'incandescence', 'fluorescence', 'emission', 'causes of colour', 'Nassau', 'thin film', 'soap film', 'chlorophyll', 'butterfly wings', 'metal colour'],
  prereq: ['wavelength-frequency-and-colour', 'additive-and-subtractive-mixing'],
  related: ['thin-film-interference', 'iridescence-and-structural-colour', 'why-the-sky-is-blue', 'how-light-is-made', 'fluorescent-lamps', 'transmission-and-absorption', 'metal-mirror-coatings', 'specular-and-diffuse-reflection'],
  body: `
Why is a leaf green, a flame orange, a soap film streaked with colours, a gold ring yellow? In each case something shapes the spectrum that reaches the eye, and there are only a few ways to do it. Kurt Nassau's survey of the causes of colour lists fifteen mechanisms; most everyday colours come from five families.

### Absorption: pigments and dyes
A molecule or crystal absorbs photons whose energy matches a jump between its energy levels, so it takes a band of wavelengths out of white light; what is left is the colour. Chlorophyll absorbs red (near 662 nm) and blue (near 430 nm) and reflects green; carotenoids absorb blue and look yellow to red. The colour of a pigment is roughly *opposite* to the band it takes: a band at 560 nm removes yellow-green and leaves purple. A wider band dulls the colour and a stronger one deepens it.

### Metals
A metal reflects by its free electrons, and its colour comes from where its reflectance falls off. Silver reflects 97 to 99 % across the visible range and looks neutral, aluminium about 92 %. Gold is yellow because its reflectance drops from about 0.9 at 600 nm to 0.47 at 500 nm and 0.41 at 450 nm; copper reflects about 0.55 at 450 nm and 0.92 at 650 nm (round figures).

### Scattering
Particles much smaller than the wavelength scatter blue far more than red (Rayleigh scattering, in proportion to $1/\\lambda^4$): the blue sky and the red sunset ([[why-the-sky-is-blue]]). Particles larger than the wavelength scatter all colours alike: clouds, fog, milk, foam and paper are white.

### Interference and diffraction: structural colour
A film a few hundred nanometres thick, a butterfly wing, a peacock feather, a CD, an opal reflect some wavelengths and cancel others with no pigment at all. These **structural colours** change with the angle of view ([[iridescence-and-structural-colour]], [[thin-film-interference]]). For a soap film in air, of index $n$ and thickness $d$, light of wavelength $\\lambda = 4nd/(2m+1)$ is reinforced at normal incidence: with $n = 1.33$ and $d = 300$ nm the only visible one is 532 nm, a green. The simulation computes the colour against thickness:

| Soap film thickness | Colour by reflection in daylight |
|---|---|
| 0 | none |
| 100 nm | silvery white |
| 150 nm | yellowish brown |
| 200 nm | purple |
| 250 nm | blue |
| 300 nm | green |
| 350 nm | orange |
| 400 nm | magenta |

Beyond about a micrometre the colours wash out into pale pinks and greens, because many wavelengths are reinforced at once.

### Emission
A hot body glows with a spectrum that depends only on its temperature ([[how-light-is-made]]): orange at 1500 K, white at 6500 K, bluish at 10 000 K. Excited gases and semiconductors emit lines or narrow bands fixed by their energy levels: the yellow of a sodium lamp at 589 nm, the red of a neon sign.

### Fluorescence
A fluorescent dye absorbs a short wavelength and gives back a longer one. Each photon returns with less energy: a 400 nm photon (3.10 eV) re-emitted at 530 nm (2.34 eV) loses 25 % of its energy as heat. Fluorescent paints and highlighter pens can look brighter than white because they *add* light to what they reflect ([[fluorescent-lamps]]).

> [!key] Colour is a shaped spectrum: absorbed by pigments, scattered by small particles, reinforced by thin structures, radiated by hot or excited matter, or converted by fluorescence. Absorption fades, structure shifts with the angle, and a hot body follows its temperature.
`,
  ideas: [
    'Pigments and dyes absorb a band of wavelengths; the colour seen is roughly opposite to the band.',
    'Metals take their colour from where their reflectance falls: gold absorbs blue, silver reflects nearly everything.',
    'Small particles scatter blue more than red (the sky); large ones scatter all colours alike (clouds, milk).',
    'Structural colours come from interference and diffraction in structures near the wavelength, and change with the viewing angle.',
    'Hot bodies glow at a colour set by temperature; excited atoms emit lines; fluorescent dyes absorb short and emit longer wavelengths.'
  ],
  pitfalls: [
    'A red object is red because it makes red light — It reflects (or scatters) the red part of white light and absorbs the rest. In a green light it looks black.',
    'The colours of a soap film or a butterfly wing come from pigments — There is no pigment: they come from interference in the thin structure, and change when the angle of view changes.',
    'A cloud is white because its droplets absorb all colours equally — They scatter all colours equally; none is absorbed.',
    'Fluorescence is just reflection — The emitted light has a longer wavelength than the absorbed one; the dye adds light, which a reflecting surface cannot do.'
  ],
  terms: [
    { term: 'Pigment', also: ['dye'], def: 'A substance that gives colour by absorbing part of the spectrum. A pigment is a powder of insoluble grains, a dye dissolves in its medium.' },
    { term: 'Structural colour', also: ['iridescence'], def: 'Colour made by interference, diffraction or scattering from structures about the size of the wavelength, rather than by absorption. It changes with the angle of view.' },
    { term: 'Scattering', also: ['Rayleigh scattering', 'Mie scattering'], def: 'The redirection of light by particles. Small ones scatter short wavelengths more strongly (Rayleigh), large ones all wavelengths alike.' },
    { term: 'Fluorescence', def: 'The absorption of light of one wavelength and its re-emission at a longer wavelength, within nanoseconds.' },
  ],
  formulas: [
    {
      name: 'Reinforced wavelength in a soap film',
      expr: 'lambda = 4*n*d/(2*m + 1)', tex: '\\lambda = \\frac{4\\,n\\,d}{2m + 1}',
      vars: {
        lambda: { name: 'wavelength reflected most', q: 'length', unit: 'nm', tex: '\\lambda' },
        n: { name: 'refractive index of the film', value: 1.33, min: 1, max: 4 },
        d: { name: 'thickness of the film', q: 'length', unit: 'nm', value: 300 },
        m: { name: 'order', int: true, value: 1, min: 0, max: 20 }
      },
      note: 'A film in air at normal incidence, with one reflection that turns the wave over. Only wavelengths between 380 and 780 nm are seen.',
      stories: { lambda: 'A soap film of index {n} is {d} thick. Which wavelength of order {m} does it reflect most strongly?' }
    },
    {
      name: 'Photon energy',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{h\\,c}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 530, tex: '\\lambda' }
      },
      note: 'A handy form: E in eV = 1239.8 divided by λ in nm.',
      stories: { E: 'Light of wavelength {lambda} falls on a dye. What is the energy of one photon?' }
    }
  ],
  examples: [
    {
      title: 'The colour of a 300 nm soap film',
      q: 'A soap film in air has index 1.33 and thickness 300 nm. Which visible wavelengths does it reflect most strongly at normal incidence?',
      steps: [
        { text: 'With $4nd = 4 \\times 1.33 \\times 300 = 1596$ nm:', tex: '\\lambda_m = \\frac{1596\\ \\mathrm{nm}}{2m + 1}: \\quad 1596\\ (m=0),\\ 532\\ (m=1),\\ 319\\ (m=2)' },
        'Only $m = 1$ falls inside 380–780 nm.'
      ],
      a: '532 nm, a green: that is the colour of the film seen by reflection, as in the table. The transmitted light is the complementary magenta.'
    },
    {
      title: 'Energy lost in fluorescence',
      q: 'A dye absorbs at 400 nm and emits at 530 nm. What energy does each photon lose?',
      steps: [
        { text: 'With $E = 1239.8\\ \\mathrm{eV\\,nm}/\\lambda$:', tex: 'E_{\\mathrm{in}} = \\frac{1239.8}{400} = 3.10\\ \\mathrm{eV} \\qquad E_{\\mathrm{out}} = \\frac{1239.8}{530} = 2.34\\ \\mathrm{eV}' },
        { text: 'The loss is the difference as a share of what came in:', tex: '\\frac{3.10 - 2.34}{3.10} = 0.245' }
      ],
      a: '0.76 eV per photon, about 25 %, becomes heat in the dye (the Stokes loss).'
    }
  ],
  quiz: [
    { q: 'A pigment absorbs strongly around 600 nm (orange) and little elsewhere. What colour will it look in white light?', choices: ['A blue to cyan', 'Orange', 'Yellow', 'Black'], a: 0, why: 'It takes out the orange and leaves the blue-green part of the spectrum: the colour is roughly opposite to the absorbed band.' },
    { q: 'A cloud is white because its droplets absorb all colours equally.', a: false, why: 'Droplets much larger than the wavelength *scatter* all colours alike; they do not absorb. If they absorbed, the cloud would be grey or dark.' },
    { q: 'The colours of a butterfly wing change as you tilt it. What does that show?', choices: ['They are structural: interference in a fine structure, with an angle-dependent path difference', 'They come from a pigment that moves', 'Light from the wing is polarized', 'The wing is fluorescent'], a: 0, why: 'In interference the reinforced wavelength depends on the path difference, which changes with the angle. A pigment colour does not.' },
    { q: 'What is the energy, in eV, of a photon of 620 nm light?', answer: 2.0, unit: 'eV', why: '$E = 1239.8/620 = 2.0$ eV.' },
    { q: 'A film in air with $n = 1.33$ is 150 nm thick. Which wavelength does it reinforce for $m = 0$?', answer: 798, unit: 'nm', why: '$\\lambda = 4nd/(2m+1) = 4\\times 1.33\\times 150 = 798$ nm: just beyond the red end of the visible range.' }
  ],
  applications: [
    'Paint, dyes and food colouring: choosing pigments for their absorption bands, lightfastness and cost.',
    'Interference pigments, holograms on banknotes and cards, and iridescent car paints: colours that change with the angle and are hard to copy.',
    'Phosphors and fluorescent markers: white LEDs, fluorescent lamps, security inks and the dyes of fluorescence microscopy ([[fluorescence-and-confocal-microscopy]]).',
    'Temper colours on steel: a thin oxide film grows with temperature, so pale straw appears near 230 °C and blue near 300 °C, by thin-film interference.',
    'Metals and coatings: the colour of gold, copper and brass, and the choice of silver, aluminium or gold for mirrors ([[metal-mirror-coatings]]).'
  ],
  history: 'Robert Hooke described the colours of thin plates of mica and the peacock\'s feather in his *Micrographia* of 1665, and Newton measured the colours of thin films in his *Opticks* (1704), assigning each colour a thickness. Thomas Young explained them by interference in 1801. Kurt Nassau classified fifteen causes of colour in his book of 1983, grouping them into five families from molecular vibrations to geometrical and physical optics.',
  sources: [
    'K. Nassau, *The Physics and Chemistry of Color: The Fifteen Causes of Color*, 2nd ed.',
    'S. Kinoshita, *Structural Colors in the Realm of Nature*.',
    'E. Hecht, *Optics* — interference in thin films and scattering.'
  ],
  sim: 'cs-origins'
}

);
