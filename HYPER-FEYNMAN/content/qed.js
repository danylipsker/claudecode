/* HYPER-FEYNMAN · content/qed.js — QED: The Strange Theory of Light and Matter.
 * Topics qed-light (photons and arrows) and qed-matter (electrons and their interactions); sims in sims/qed.js. */
Hyper.add(

/* ================================================================ PHOTONS AND ARROWS */
{
  id: 'photons-as-particles', parent: 'qed-light', title: 'Light comes in clicks', level: 1,
  short: 'Detected with a sensitive enough instrument, light always arrives in whole, identical lumps — photons. Dim the light and the clicks become rarer, never smaller. Where each photon goes can only be predicted as a probability: from a glass surface, about 4 in every 100 bounce back.',
  keywords: ['photon', 'photomultiplier', 'particles of light', 'clicks', 'single photon', 'partial reflection', '4 percent', 'photon counting', 'E = hf', 'quantum of light', 'counting statistics', 'Newton'],
  prereq: ['physics:photon', 'physics:photoelectric-effect', 'probability-feyn'],
  related: ['arrow-rule', 'partial-reflection', 'bullets-waves-electrons', 'wave-and-particle', 'quantum-reality', 'physics:compton-scattering', 'bosons-and-lasers'],
  body: `
Feynman opened his public lectures on quantum electrodynamics with a fact that still surprises people: light is made of particles. Not merely like particles in some respects: whenever light is detected, it arrives in whole, identical lumps. We call them **photons**.

### Hearing light arrive
The instrument that makes this obvious is the **photomultiplier**. A photon striking its thin metal photocathode can knock out a single electron. That electron is pulled onto a second electrode and knocks out several more; those are pulled onto a third, and so on down a chain of ten or so electrodes, until one electron has become a pulse of about a million — enough to drive a loudspeaker. Point the tube at a lamp and it crackles. Now turn the lamp down. The clicks do **not** get quieter; they get **rarer**. Every click is the same size, because every click is one whole photon. Nobody has ever detected a third of a photon.

What the colour changes is the energy each photon carries, which is fixed by its frequency $f$ or wavelength $\\lambda$:

$$E = hf = \\frac{hc}{\\lambda}$$

A red photon (650 nm) carries 1.9 eV, a green one (530 nm) 2.3 eV, a blue one (450 nm) 2.8 eV. The numbers of photons in everyday light are enormous — written in [[?scientific-notation]] because nothing else fits:

| Light | Power | Photons per second | What a photomultiplier does |
|---|---|---|---|
| red laser pointer | 1 mW | $3\\times10^{15}$ | overloaded |
| green light, very faint | $10^{-12}$ W | $2.7\\times10^{6}$ | a continuous hiss |
| green light, fainter still | $10^{-17}$ W | about 27 | separate clicks, one at a time |

So the graininess of light is invisible in daily life, just as the graininess of sand is invisible in a dune seen from a plane.

### Four per cent
Now the puzzle that runs through the whole of QED. Light falling on a block of glass is partly reflected: about 4 % of it bounces off the surface and 96 % goes in. Put photomultiplier **A** above the glass to catch the reflected light and **B** inside the glass to catch the rest, and dim the source until photons come one at a time. Each photon makes either A click or B click — never both, never half of each. On average 4 photons in every 100 go to A.

Which ones? Nobody can say. Nothing we know distinguishes the photon that will bounce from the photon that will enter. All that physics can offer is a [[?probability]]: 4 %. Counted over many photons, the number reflected scatters around the average like the count of heads in coin tosses: with $N$ photons, each reflected with probability $p$, the count is $Np$ give or take one [[?standard-deviation]] $\\sigma = \\sqrt{Np(1-p)}$. With 10 000 photons: 400 ± 20, that is 4.0 % ± 0.2 %. Watch this in the simulation: the measured fraction wanders at first, then settles onto 4 %, and the band of likely values narrows as $1/\\sqrt N$.

### Holes and spots do not work
The obvious explanation — the surface is dotted with spots that reflect photons and holes that let them through — fails as soon as there is a second surface. A thin sheet of glass reflects anywhere from 0 to 16 % of the light, depending on its thickness ([[partial-reflection]]). A photon arriving at the front surface would somehow have to know how thick the glass is behind it. Newton, who believed light was made of corpuscles and measured the coloured rings of thin films with great care, proposed that light rays alternate between "fits" of easy reflection and easy transmission — a description, not an explanation.

> [!key] Light arrives in whole photons, each click the same. Where a given photon will go cannot be predicted; only the probability can — and QED computes it, with astonishing precision, by the rule of the arrows ([[arrow-rule]]).

Feynman was blunt about what this costs: for a single photon at a single surface, no one can say what will happen, only how often each outcome occurs in the long run. What physics gets in return is a rule that gets every one of those frequencies right.
`,
  ideas: [
    'Light is detected in whole, identical lumps — photons; a dimmer light gives fewer clicks, not smaller ones.',
    'A photon of wavelength λ carries energy E = hc/λ: about 2 eV for visible light.',
    'Everyday light contains so many photons (10¹⁵ a second from a laser pointer) that the lumps go unnoticed.',
    'About 4 % of photons are reflected from a glass surface, at random: only the probability can be predicted.',
    'Counts fluctuate by about √(Np(1 − p)), so a measured fraction becomes sharp only after many photons.'
  ],
  pitfalls: [
    'A dimmer light makes each photon weaker — Dimming reduces the number of photons per second; each photon of a given colour carries the same energy hc/λ.',
    'With 4 % reflection, each photon splits into a small reflected part and a large transmitted part — Every photon is found whole, either at A or at B; the 4 % is a probability.',
    'The surface must have reflecting spots and transparent holes — Then a second surface behind the first could not change the reflection, yet a thin sheet reflects from 0 to 16 % depending on its thickness.'
  ],
  formulas: [
    {
      name: 'Energy of one photon',
      expr: 'E = h*c/lambda', tex: 'E = \\dfrac{hc}{\\lambda}',
      vars: {
        E: { name: 'energy of the photon', q: 'energy', unit: 'eV' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 530, tex: '\\lambda' }
      },
      note: 'A handy form: E in eV = 1240 / (λ in nm).',
      stories: { E: 'What energy does one photon of {lambda} light carry?', lambda: 'A photon carries {E}. What is its wavelength?' }
    },
    {
      name: 'How many photons a beam carries',
      expr: 'N = P*lambda/(h*c)', tex: '\\dot{N} = \\dfrac{P\\lambda}{hc}',
      vars: {
        N: { name: 'photons per second', q: 'rate', unit: '1/s', tex: '\\dot{N}' },
        P: { name: 'power of the beam', q: 'power', unit: 'mW', value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 650, tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      note: 'The power divided by the energy of one photon.',
      stories: { N: 'A laser pointer emits {P} of {lambda} light. How many photons leave it each second?', P: 'A detector counts {N} photons of {lambda}. What power is that?' }
    },
    {
      name: 'Scatter of a photon count',
      expr: 'sigma = sqrt(N*p*(1 - p))', tex: '\\sigma = \\sqrt{Np(1-p)}',
      vars: {
        sigma: { name: 'standard deviation of the count', q: 'count', tex: '\\sigma' },
        N: { name: 'photons sent', q: 'count', value: 10000, int: true },
        p: { name: 'probability for each photon', q: 'ratio', unit: '%', value: 4, min: 0, max: 100 }
      },
      note: 'The binomial distribution: the count is Np ± σ about two times in three. Relative to the mean, the scatter shrinks as 1/√N.',
      stories: { sigma: '{N} photons fall on glass, each reflected with probability {p}. By how much does the reflected count typically scatter?', N: 'How many photons must be sent for the reflected count, with probability {p}, to scatter by only {sigma}?' }
    }
  ],
  examples: [
    {
      title: 'Photons from a laser pointer',
      q: 'A red laser pointer emits 1 mW at 650 nm. How many photons does it emit each second?',
      steps: [
        'Energy of one photon: $E = hc/\\lambda = (6.626\\times10^{-34})(2.998\\times10^{8})/(650\\times10^{-9}) = 3.06\\times10^{-19}$ J, or 1.91 eV.',
        'Photons per second: $\\dot N = P/E = 10^{-3}/3.06\\times10^{-19} = 3.3\\times10^{15}$.'
      ],
      a: 'About 3 × 10¹⁵ photons a second — far too many to notice them one by one.'
    },
    {
      title: 'Is it really 4 %?',
      q: 'You send 2000 photons at a glass surface and count 92 reflected. Is that consistent with a probability of 4 %?',
      steps: [
        'Expected count: $Np = 2000 \\times 0.04 = 80$.',
        'Scatter: $\\sigma = \\sqrt{2000 \\times 0.04 \\times 0.96} = \\sqrt{76.8} = 8.8$.',
        '92 is $(92 - 80)/8.8 = 1.4$ standard deviations above the mean — an ordinary fluctuation: about one run in six lands at least this far from 80, one way or the other.'
      ],
      a: 'Yes: 92 ± 9 is consistent with 80. Many more photons are needed to pin the probability down.'
    }
  ],
  quiz: [
    { q: 'You dim a lamp to a tenth of its power. A photomultiplier pointed at it now gives…', choices: ['clicks of the same size, ten times less often', 'clicks a tenth as loud, as often as before', 'clicks a tenth as loud, a tenth as often', 'no clicks at all'], a: 0, why: 'Each click is one whole photon; dimming reduces the number of photons, not their size.' },
    { q: 'A red and a blue lamp deliver the same power. Compared with the red one, the blue lamp sends…', choices: ['fewer photons per second, each carrying more energy', 'more photons per second, each carrying less energy', 'the same number of photons per second', 'photons that are only partly detected'], a: 0, why: 'E = hc/λ is larger for blue light, so the same power needs fewer photons.' },
    { q: 'When light falls on glass and 4 % is reflected, each photon splits into a reflected 4 % and a transmitted 96 %.', a: false, why: 'Detectors always find whole photons: each one is either reflected or transmitted, with probabilities 4 % and 96 %.' },
    { q: 'How many photons per second are there in 1 pW (10⁻¹² W) of 530 nm light?', answer: 2.67e6, why: 'One photon carries hc/λ = 3.75 × 10⁻¹⁹ J; 10⁻¹² W / 3.75 × 10⁻¹⁹ J = 2.7 × 10⁶ per second.' },
    { q: 'You send 100 photons at glass and 7 are reflected (4 % expected). What should you conclude?', choices: ['nothing unusual: the expected 4 has a scatter of about 2', 'the glass must reflect 7 %', 'some photons were split', 'the detector is broken'], a: 0, why: 'σ = √(100 × 0.04 × 0.96) ≈ 2, so 7 is only 1.5 σ above the mean.' }
  ],
  problems: [
    { q: 'What is the energy of a photon of wavelength 1240 nm (near infrared)?', answer: 1.0, unit: 'eV', tol: 0.02, hint: 'E in eV ≈ 1240 / λ in nm.',
      steps: ['$E = hc/\\lambda = (6.626\\times10^{-34} \\times 2.998\\times10^{8})/(1.24\\times10^{-6}) = 1.60\\times10^{-19}$ J.', 'Divide by $1.602\\times10^{-19}$ J/eV: 1.00 eV.'] },
    { q: 'A photon counter detects 25 % of the green photons (530 nm) reaching it and clicks 500 times a second. What light power is reaching it?', answer: 7.5e-16, unit: 'W', tol: 0.03, hint: 'First find how many photons arrive, then multiply by the energy of each.',
      steps: ['Photons arriving: $500/0.25 = 2000$ per second.', 'Energy of each: $hc/\\lambda = 3.75\\times10^{-19}$ J.', 'Power: $2000 \\times 3.75\\times10^{-19} = 7.5\\times10^{-16}$ W — less than a femtowatt.'] }
  ],
  applications: [
    'Photon counting: astronomers, lidar systems and medical PET scanners register light one photon at a time.',
    'Quantum key distribution sends secret keys encoded on single photons.',
    'The pixels of a camera sensor collect photons; in dim light the image becomes grainy because the counts fluctuate as √N.'
  ],
  history: 'Newton argued for corpuscles of light and, in his *Opticks* (1704), explained the coloured rings of thin films by "fits" of easy reflection and transmission. The wave theory won in the nineteenth century (Young, Fresnel, Maxwell). Planck (1900) found that radiation is emitted in quanta hf; Einstein (1905) proposed that light itself travels in such quanta, explaining the photoelectric effect; Compton (1923) showed X-ray quanta bouncing off electrons like billiard balls; and Gilbert Lewis coined the word *photon* in 1926. A clean demonstration that a single photon is never detected on both sides of a beam splitter came in 1986 (Philippe Grangier, Gérard Roger and Alain Aspect).',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 1 (Introduction) — light is made of particles; the photomultiplier that clicks; the puzzle of 4 % reflection from glass and of the thin sheet.',
    '*The Feynman Lectures on Physics*, Vol. III, ch. 1 (Quantum Behavior) — why light and electrons, which arrive in lumps, still interfere.',
    '*The Character of Physical Law*, lecture 6 (Probability and Uncertainty — the Quantum Mechanical View of Nature) — nature can only be predicted in probabilities.'
  ],
  sim: 'qed-clicks'
},

{
  id: 'arrow-rule', parent: 'qed-light', title: 'The rule of the arrows', level: 1,
  short: 'QED\'s whole computing rule: for every way an event can happen, a stopwatch turns while the photon travels and gives an arrow. Arrows for alternative ways add head to tail; arrows for successive steps multiply (shrink and turn). The probability is the square of the final arrow\'s length.',
  keywords: ['arrow', 'stopwatch', 'probability amplitude', 'adding arrows', 'head to tail', 'shrink and turn', 'phase', 'complex number', 'final arrow', 'square of the length', 'QED rule'],
  prereq: ['photons-as-particles', 'math:complex-numbers', 'math:vector-addition'],
  related: ['probability-amplitudes', 'partial-reflection', 'every-path-counts', 'bullets-waves-electrons', 'path-integral', 'algebra-complex-numbers', 'math:polar-form', 'math:eulers-formula'],
  body: `
In his lectures for the public Feynman put the entire computing machinery of quantum electrodynamics into a picture a child could draw: little arrows on paper. Physicists call them [[?amplitude|probability amplitudes]] and write them as [[?complex-number|complex numbers]], but nothing is lost by drawing them.

### A stopwatch for every way
Take an event: a photon leaves a lamp and makes a detector click. List **every way** it could happen — every path the light could take. For each way, imagine a stopwatch that starts when the photon sets off and stops when it arrives. Its single hand turns at a steady rate: for light of one colour, once for every wavelength travelled. That is the light's frequency, $f = c/\\lambda$ — about $5\\times10^{14}$ turns a second for orange light of 600 nm, or 16 700 turns for every centimetre of path. When the photon arrives, draw an **arrow** in the direction the hand points. A [[?rotating-arrow]] frozen at the moment of arrival is exactly what a complex number $e^{i\\theta}$ is.

The **length** of the arrow is set by what happens along the way; for a reflection from glass, for instance, it is about 0.2.

### Rule 1: alternative ways add
If the event can happen in several ways that nobody distinguishes, **add** their arrows: place them head to tail, and draw the final arrow from the tail of the first to the head of the last. Then

$$P = (\\text{length of the final arrow})^2$$

This is ordinary [[?vector]] addition, and the squared length is the [[?absolute-square]] $|z|^2$ of the complex sum. For two arrows of lengths $a_1$ and $a_2$ at an angle $\\varphi$ to each other, the law of cosines gives

$$P = a_1^2 + a_2^2 + 2a_1a_2\\cos\\varphi$$

| Two arrows of length 0.2 | Final arrow | Probability |
|---|---|---|
| pointing the same way ($\\varphi = 0$) | 0.4 | 16 % |
| at right angles ($\\varphi = 90°$) | 0.28 | 8 % |
| at $120°$ | 0.2 | 4 % |
| pointing opposite ways ($\\varphi = 180°$) | 0 | 0 % |

Adding probabilities would always give 8 %. Adding arrows gives anything from 0 to 16 % — and that is what light does.

### Rule 2: successive steps multiply
If an event happens in **steps** — the light is reflected, then passes through something, then is detected — the arrow for the whole event is the *product* of the arrows for the steps. Multiplying arrows means: **shrink and turn**. Start with an arrow of length 1; the first step shrinks it to its own length and turns it by its own angle; the next step shrinks and turns the result again. Lengths multiply, angles add. In complex numbers, $a_1e^{i\\theta_1}\\cdot a_2e^{i\\theta_2} = a_1a_2\\,e^{i(\\theta_1+\\theta_2)}$ — [[?euler-formula|Euler's formula]] at work.

### Only differences matter
Turning every arrow by the same angle turns the final arrow too, but does not change its length. So the absolute reading of the stopwatches never matters — only the **differences** in time between the ways, which is to say the differences in path length measured in wavelengths. Two paths that differ by half a wavelength give opposite arrows; by a whole wavelength, parallel ones. The [[?phase]] of an arrow is just its angle.

> [!key] For each way: an arrow, turned by the travel time. Alternatives: add the arrows. Steps in sequence: multiply them (shrink and turn). The probability is the square of the final arrow's length.

Why nature computes like this, nobody knows, and Feynman did not pretend otherwise. He asked his listeners to judge the rule as physicists do — by whether its predictions come true, which they always have — rather than by whether it seems reasonable. In the simulation, drag the paths and send a photon: the stopwatches ride along, each leaves its arrow at the detector, and the arrows are added in the order they arrive.
`,
  ideas: [
    'Each way an event can happen gets an arrow; its direction is set by a stopwatch that turns once per wavelength travelled.',
    'Arrows for alternative ways are added head to tail; the probability is the square of the final arrow\'s length.',
    'Arrows for successive steps are multiplied: lengths multiply and angles add — the arrow shrinks and turns.',
    'Only the angles between arrows matter, that is, the differences in path length measured in wavelengths.',
    'Arrows are complex numbers: addition is vector addition, multiplication is a rotation with a scaling.'
  ],
  pitfalls: [
    'The probabilities of the different ways add — It is the arrows that add; their squares do not. Two equal ways can give four times one way, or nothing.',
    'The stopwatch hand shows a physical rotation of the photon — It is a bookkeeping device for the phase of the amplitude; only the angles between arrows have physical consequences.',
    'The arrows for successive steps are added too — Steps in sequence multiply: the arrow shrinks and turns at each step.'
  ],
  formulas: [
    {
      name: 'How fast the stopwatch turns',
      expr: 'f = c/lambda', tex: 'f = \\dfrac{c}{\\lambda}',
      vars: {
        f: { name: 'turns per second (the frequency of the light)', q: 'frequency', unit: 'THz' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' }
      },
      stories: { f: 'How many times a second does the stopwatch hand turn for light of {lambda}?', lambda: 'The hand turns {f}. What colour (wavelength) of light is that?' }
    },
    {
      name: 'Turns along a path',
      expr: 'N = L/lambda', tex: 'N = \\dfrac{L}{\\lambda}',
      vars: {
        N: { name: 'turns of the hand', q: 'none' },
        L: { name: 'length of the path', q: 'length', unit: 'cm', value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' }
      },
      note: 'Only the fraction left over after whole turns decides the arrow\'s direction; a difference of half a turn between two paths makes their arrows opposite.',
      stories: { N: 'How many turns does the hand make while light of {lambda} travels {L}?' }
    },
    {
      name: 'Adding two arrows',
      expr: 'P = a1^2 + a2^2 + 2*a1*a2*cos(phi)', tex: 'P = a_1^2 + a_2^2 + 2a_1a_2\\cos\\varphi',
      vars: {
        P: { name: 'probability (square of the final arrow)', q: 'none' },
        a1: { name: 'length of the first arrow', q: 'none', value: 0.2, tex: 'a_1' },
        a2: { name: 'length of the second arrow', q: 'none', value: 0.2, tex: 'a_2' },
        phi: { name: 'angle between the arrows', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\varphi' }
      },
      note: 'The law of cosines for the head-to-tail sum. Between (a₁ − a₂)² and (a₁ + a₂)².',
      stories: { P: 'Two arrows of lengths {a1} and {a2} make an angle of {phi}. What is the probability?', phi: 'Arrows of {a1} and {a2} give a probability of {P}. What angle is between them?' }
    }
  ],
  examples: [
    {
      title: 'Half a wavelength apart',
      q: 'Orange light (600 nm) can reach a detector by two equally likely paths whose lengths differ by 1.5 µm. What is the probability compared with one path alone?',
      steps: [
        'The difference is $1.5\\ \\mu\\text{m}/0.6\\ \\mu\\text{m} = 2.5$ wavelengths: the second hand makes two and a half turns more.',
        'Whole turns do not matter; half a turn does. The two arrows point opposite ways.',
        'Equal arrows pointing opposite ways add to nothing.'
      ],
      a: 'Zero: the two ways cancel. At a difference of 3.0 µm they would line up and give four times one path.'
    },
    {
      title: 'Shrink and turn',
      q: 'Light reflects from glass (arrow 0.2 long, turned half a turn) and then passes a grey filter whose arrow is 0.5 long and not turned. What is the probability of the whole event?',
      steps: [
        'Successive steps multiply: length $0.2 \\times 0.5 = 0.1$, angle $180° + 0° = 180°$.',
        'Probability: $0.1^2 = 0.01$, i.e. 1 % — the product of 4 % and 25 %.'
      ],
      a: '1 %. For steps in sequence, the probabilities multiply too — because the arrow lengths do.'
    }
  ],
  quiz: [
    { q: 'Turning every arrow by the same angle changes the probability.', a: false, why: 'The whole head-to-tail chain turns rigidly, so the final arrow keeps its length.' },
    { q: 'Two ways have arrows of length 0.3 and 0.1. The probability of the event can lie anywhere between…', choices: ['0.04 and 0.16', '0.08 and 0.10', '0 and 0.16', '0.09 and 0.10'], a: 0, why: 'The final arrow lies between 0.3 − 0.1 = 0.2 and 0.3 + 0.1 = 0.4; squared, 0.04 to 0.16.' },
    { q: 'Two ways have equal arrows of length $a$ at right angles. Write the probability in terms of $a$.', answer: '2*a^2', vars: ['a'], why: 'At 90° the cosine is zero: P = a² + a² = 2a² — here, as for probabilities, the two just add.' },
    { q: 'An arrow 0.5 long at 30° is multiplied by an arrow 0.4 long at 100°. The result is…', choices: ['0.2 long at 130°', '0.9 long at 130°', '0.2 long at 70°', '0.9 long at 65°'], a: 0, why: 'Multiplying: lengths multiply (0.5 × 0.4) and angles add (30° + 100°).' },
    { q: 'What decides the angle between the arrows of two paths from a lamp to a detector?', choices: ['the difference in their lengths, in wavelengths', 'the brightness of the lamp', 'which path the photon really took', 'the total length of both paths'], a: 0, why: 'Each hand turns once per wavelength, so the angle between the arrows is 360° times the path difference in wavelengths.' }
  ],
  problems: [
    { q: 'With light of 500 nm, what is the smallest difference in path length that makes the arrows of two paths point in opposite directions?', answer: 250, unit: 'nm', tol: 0.01, hint: 'Opposite means half a turn.',
      steps: ['Half a turn of the hand is half a wavelength of travel.', '$500/2 = 250$ nm.'] },
    { q: 'Two ways have arrows of length 0.2 and 0.2 at 120° to each other. What is the probability, in per cent?', answer: 4, unit: '%', tol: 0.02,
      steps: ['$P = 0.04 + 0.04 + 2(0.2)(0.2)\\cos 120° = 0.08 - 0.04 = 0.04$.', 'The three arrows of an equilateral triangle: the final arrow is as long as each one, 4 %.'] }
  ],
  applications: [
    'Interferometers — from the LIGO gravitational-wave detectors to optical gyroscopes in aircraft — read tiny path differences as changes in the angle between two arrows.',
    'Every calculation of quantum electrodynamics, however elaborate, is this rule applied to more and more ways.',
    'Draw your own arrows for mirrors and glass in [the QED arrows lab](#/tools/arrows).'
  ],
  history: 'The rule that alternative amplitudes add and successive ones multiply was built into quantum mechanics in the 1920s (Born\'s probability rule, 1926; Dirac\'s transformation theory). Feynman\'s own formulation of quantum mechanics as a sum over all paths (1948) makes the picture of one arrow per way exact. He presented it with stopwatches and arrows to general audiences — in the Douglas Robb Memorial Lectures at the University of Auckland (1979), which were filmed, and in the book *QED* (1985).',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 1 (Introduction) — the stopwatch, the arrows added head to tail, and the square of the final arrow.',
    '*QED*, ch. 2 (Photons: Particles of Light) — the same rule applied to all the ways light can go, and the combination of arrows for events that happen in steps.',
    '*The Feynman Lectures on Physics*, Vol. III, ch. 3 (Probability Amplitudes) — the same rules in the language of amplitudes: alternatives add, steps in sequence multiply.'
  ],
  sim: 'qed-stopwatch'
},

{
  id: 'partial-reflection', parent: 'qed-light', title: 'Partial reflection by glass', level: 2,
  short: 'One glass surface reflects 4 % of the light, but a thin sheet reflects anything from 0 to 16 %, depending on its thickness. Two arrows — one from the front surface, reversed, and one from the back — explain it; adding every internal bounce gives the exact thin-film result.',
  keywords: ['partial reflection', 'thin film', 'glass sheet', 'two surfaces', '16 percent', 'soap bubble', 'anti-reflection coating', 'Fresnel', 'interference', 'Newton\'s rings', 'quarter wave'],
  prereq: ['arrow-rule', 'photons-as-particles', 'physics:thin-film-interference'],
  related: ['origin-of-refractive-index', 'interference-feyn', 'every-path-counts', 'math:geometric-series', 'physics:reflection'],
  body: `
From a single glass surface — the top of a thick block — about 4 % of the light is reflected, whatever the block's thickness. Now make the glass a thin sheet, so that there are two surfaces close together. The reflection from the sheet is then anything from **0 to 16 %**, and it swings smoothly back and forth as the sheet gets thicker. For orange light of 600 nm and glass of refractive index 1.5, the cycle repeats every 200 nm of thickness: nothing at 0, 200 and 400 nm, the most at 100, 300 and 500 nm. No property of a single surface can do this.

### Two arrows
QED's arrows explain it at once. A photon can reach a detector above the sheet in two ways: reflected by the front surface, or by the back surface. Each way gets an arrow:
- **Front surface.** The stopwatch stops when the photon comes back from the front. The arrow's length is 0.2 (and $0.2^2 = 0.04$, the 4 % of one surface). A special rule applies to reflection from the outside of a denser material: the arrow is **reversed**, pointing opposite to the hand.
- **Back surface.** The stopwatch runs a little longer, because the photon crosses the sheet twice. Length 0.2, not reversed.

Inside glass the wavelength is $\\lambda/n$, so over the extra distance $2d$ the hand turns $2d\\,n/\\lambda$ times. The [[?phase]] difference between the two arrows, apart from the reversal, is therefore

$$\\delta = \\frac{4\\pi n d}{\\lambda}$$

Adding the reversed front arrow and the back arrow gives

$$P = \\left|-r + r\\,e^{i\\delta}\\right|^2 = 4R_1\\sin^2\\!\\left(\\frac{2\\pi n d}{\\lambda}\\right)$$

with $R_1 = r^2 = 4\\,\\%$ ([[?sine-cosine|sin²]] swings between 0 and 1). For a sheet much thinner than a wavelength the back arrow has hardly turned, the reversed front arrow cancels it, and **nothing is reflected** — which is why a soap film turns black just before it bursts. When the extra path is half a wavelength ($d = \\lambda/4n$ = 100 nm here) the back arrow has turned half a turn, both arrows point the same way, and the final arrow of length 0.4 gives 16 %.

| Thickness (600 nm light, $n = 1.5$) | Angle between arrows | Two arrows | Exact |
|---|---|---|---|
| 0 nm | opposite | 0 % | 0 % |
| 50 nm | 90° | 8.0 % | 8.0 % |
| 100 nm | in line | 16.0 % | 14.8 % |
| 150 nm | 90° | 8.0 % | 8.0 % |
| 200 nm | opposite | 0 % | 0 % |

### The exact answer
The two-arrow picture is a simplification, and a good one. The light that enters the glass is not quite at full strength (its arrow is shrunk to about 0.98), and some of it bounces back and forth inside several times before coming out, each round trip adding another, much smaller arrow. Adding **all** these arrows — a [[?sum]] with infinitely many terms that forms a [[math:geometric-series|geometric series]] — gives the exact thin-film result

$$P = \\frac{2R_1\\,(1-\\cos\\delta)}{1 + R_1^2 - 2R_1\\cos\\delta}$$

It follows the same rhythm but peaks at 14.8 % instead of 16 % for $n = 1.5$, and the reflected and transmitted probabilities now add to exactly 1. In the simulation these arrows are drawn in green on top of QED's two: the first bounce arrow is a little shorter than QED's back arrow, and the rest are tiny, curling in towards the exact answer.

### Where does the 4 % come from?
For light falling straight on, one surface reflects an arrow of length $r = (n-1)/(n+1)$: 0.2 for glass, 0.14 for water, 0.42 for diamond. Feynman also stressed that talk of a reflecting surface is itself a shorthand: the reflection really comes from the electrons all through the glass, each scattering a little light, and the sum of all their arrows behaves as if it came from the two surfaces ([[origin-of-refractive-index]]).

### Thin films everywhere
The colours of soap bubbles and oil slicks come from this rhythm: at a given thickness some wavelengths are reflected strongly and others not at all. Camera and spectacle lenses are coated with a layer of magnesium fluoride ($n = 1.38$) about 100 nm thick: both its reflections are reversed, so a quarter-wave layer makes them cancel, and a lens surface that reflected 4 % of green light reflects about 1.4 %.

> [!key] Two surfaces, two arrows: the front one reversed, the back one turned by the extra round trip through the glass. Their sum makes the reflection cycle between 0 and 16 % as the thickness grows.
`,
  ideas: [
    'One surface reflects an arrow of length 0.2 (4 %); a thin sheet has two such arrows, one from each surface.',
    'The front-surface arrow is reversed; the back-surface arrow is turned by the extra round trip, δ = 4πnd/λ.',
    'The sheet reflects 4R₁ sin²(2πnd/λ): from 0 (very thin, or whole half-wavelengths) to 16 % (quarter-wave thickness).',
    'Adding all the internal bounces gives the exact thin-film formula, peaking at 14.8 % for n = 1.5.',
    'Soap bubbles, oil slicks and anti-reflection coatings all follow the same rhythm.'
  ],
  pitfalls: [
    'A thin sheet reflects 8 %, twice one surface — It reflects anything from 0 to 16 %: the arrows add, not the probabilities. Only on average over thicknesses (or colours) is it about 8 %.',
    'A very thin film reflects like a single surface — As the thickness goes to zero the two arrows become exactly opposite and the reflection vanishes: a soap film goes black just before it bursts.',
    'The front surface "decides" whether to reflect a photon — The probability depends on the thickness behind it; only the arrows of both surfaces together give the answer.'
  ],
  formulas: [
    {
      name: 'Reflection from one surface (light falling straight on)',
      expr: 'R1 = ((n - 1)/(n + 1))^2', tex: 'R_1 = \\left(\\dfrac{n-1}{n+1}\\right)^2',
      vars: {
        R1: { name: 'fraction reflected by one surface', q: 'ratio', unit: '%', tex: 'R_1' },
        n: { name: 'refractive index', q: 'none', value: 1.5, min: 1, max: 5 }
      },
      note: 'The arrow for one surface has length r = (n − 1)/(n + 1): 0.2 for glass, 0.14 for water, 0.42 for diamond.',
      stories: { R1: 'What fraction of light is reflected from a single surface of a material of refractive index {n}?', n: 'A polished surface reflects {R1} of light falling straight on it. What is its refractive index?' }
    },
    {
      name: 'A thin sheet with QED\'s two arrows',
      expr: 'P = 4*R1*sin(2*pi*n*d/lambda)^2', tex: 'P = 4R_1\\sin^2\\!\\left(\\dfrac{2\\pi n d}{\\lambda}\\right)',
      vars: {
        P: { name: 'fraction reflected by the sheet', q: 'ratio', unit: '%' },
        R1: { name: 'fraction reflected by one surface', q: 'ratio', unit: '%', value: 4, tex: 'R_1' },
        n: { name: 'refractive index', q: 'none', value: 1.5 },
        d: { name: 'thickness of the sheet', q: 'length', unit: 'nm', value: 60, min: 0, max: 1000 },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' }
      },
      note: 'The reversed front arrow plus the back arrow turned by δ = 4πnd/λ. Maximum 4R₁ (16 % for glass) when d = λ/4n, 3λ/4n …',
      stories: { P: 'A glass sheet ({n}) is {d} thick and single surfaces reflect {R1}. What fraction of {lambda} light does it reflect, by QED\'s two arrows?', d: 'Which thicknesses of glass ({n}) reflect {P} of {lambda} light, if one surface reflects {R1}?' }
    },
    {
      name: 'A thin sheet, exactly (all the bounces)',
      expr: 'P = 2*R1*(1 - cos(4*pi*n*d/lambda))/(1 + R1^2 - 2*R1*cos(4*pi*n*d/lambda))',
      tex: 'P = \\dfrac{2R_1\\left(1-\\cos\\frac{4\\pi n d}{\\lambda}\\right)}{1 + R_1^2 - 2R_1\\cos\\frac{4\\pi n d}{\\lambda}}',
      vars: {
        P: { name: 'fraction reflected by the sheet', q: 'ratio', unit: '%' },
        R1: { name: 'fraction reflected by one surface', q: 'ratio', unit: '%', value: 4, min: 0, max: 50, tex: 'R_1' },
        n: { name: 'refractive index', q: 'none', value: 1.5, min: 1, max: 4 },
        d: { name: 'thickness of the sheet', q: 'length', unit: 'nm', value: 60, min: 0, max: 1000 },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 600, min: 300, max: 1000, tex: '\\lambda' }
      },
      note: 'Airy\'s formula for a sheet in air, light falling straight on: the sum of the front arrow and every arrow that comes out after 1, 2, 3 … round trips inside.',
      stories: { P: 'Exactly, with every bounce: what fraction of {lambda} light does a {d} sheet of index {n} reflect, if one surface reflects {R1}?' }
    },
    {
      name: 'The thinnest sheet that reflects most',
      expr: 'd = lambda/(4*n)', tex: 'd = \\dfrac{\\lambda}{4n}',
      vars: {
        d: { name: 'quarter-wave thickness', q: 'length', unit: 'nm' },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' },
        n: { name: 'refractive index of the layer', q: 'none', value: 1.5 }
      },
      note: 'For a free sheet this makes the two arrows line up (maximum reflection). For a coating on glass, whose two reflections are both reversed, the same thickness makes them cancel.',
      stories: { d: 'How thick must a layer of index {n} be to be a quarter-wave layer for {lambda} light?' }
    }
  ],
  examples: [
    {
      title: 'Why a soap film turns black',
      q: 'A soap film (n = 1.33) has thinned to 10 nm. What fraction of green light (550 nm) does it reflect, compared with 2 % from a single water surface?',
      steps: [
        'One surface: $R_1 = (0.33/2.33)^2 = 0.020$.',
        'Angle term: $2\\pi n d/\\lambda = 2\\pi \\times 1.33 \\times 10/550 = 0.152$ rad, so $\\sin^2 = 0.023$.',
        '$P = 4 \\times 0.020 \\times 0.023 = 0.0018$, i.e. 0.18 %.'
      ],
      a: 'About 0.2 % — ten times less than one surface. The reversed front arrow almost cancels the back arrow, and the film looks black.'
    },
    {
      title: 'The colour of an oil film',
      q: 'A film of index 1.5 and thickness 300 nm floats in air. Which visible wavelengths does it reflect most strongly, and which not at all?',
      steps: [
        'Strongest when $2\\pi n d/\\lambda$ is an odd multiple of $\\pi/2$: $\\lambda = 4nd/(2k+1) = 1800/(2k+1)$ nm, giving 1800, 600, 360 nm.',
        'Zero when $2\\pi n d/\\lambda$ is a multiple of $\\pi$: $\\lambda = 2nd/k = 900/k$ nm, giving 900, 450, 300 nm.',
        'In the visible: orange (600 nm) strongest, blue (450 nm) missing.'
      ],
      a: 'It looks orange-yellow: 600 nm is reflected at the full 16 % (two arrows), 450 nm not at all.'
    }
  ],
  quiz: [
    { q: 'A sheet of glass only 5 nm thick reflects about…', choices: ['almost nothing', '4 %', '8 %', '16 %'], a: 0, why: 'The back arrow has hardly turned, so it almost exactly cancels the reversed front arrow.' },
    { q: 'With 600 nm light and n = 1.5, a sheet reflects 10 %. Making it 200 nm thicker makes the reflection…', choices: ['the same, 10 %', 'larger', 'smaller', 'zero'], a: 0, why: 'The extra round trip 2nd grows by 600 nm = one wavelength: the back arrow makes a whole extra turn and ends where it was.' },
    { q: 'If the front-surface arrow were not reversed, a very thin sheet would reflect 16 %.', a: true, why: 'Then both arrows would point the same way at zero thickness, adding to 0.4. The reversal is what makes thin films dark.' },
    { q: 'What is the largest reflection of a glass sheet (n = 1.5) by QED\'s two-arrow picture, in per cent?', answer: 16, unit: '%', why: 'Two arrows of length 0.2 in line make 0.4; squared, 0.16.' },
    { q: 'Why does the exact thin-film result peak at 14.8 % rather than 16 %?', choices: ['light bouncing back and forth inside adds more arrows, and the transmitted light is slightly weakened', 'the two-arrow picture uses the wrong wavelength', 'photons are absorbed in the glass', 'the front surface reflects less than 4 %'], a: 0, why: 'The two-arrow picture ignores the multiple internal reflections and the loss at entry; adding them all gives Airy\'s formula.' }
  ],
  problems: [
    { q: 'An anti-reflection coating of magnesium fluoride (n = 1.38) is designed for 550 nm. How thick is the thinnest such layer?', answer: 99.6, unit: 'nm', tol: 0.01, hint: 'Both of its reflections are reversed, so the round trip must add half a wavelength.',
      steps: ['The round trip inside, $2nd$, must be $\\lambda/2$: $d = \\lambda/4n$.', '$d = 550/(4 \\times 1.38) = 99.6$ nm.'] },
    { q: 'By QED\'s two arrows, what fraction of 600 nm light does a 50 nm glass sheet (n = 1.5) reflect? Answer in per cent.', answer: 8, unit: '%', tol: 0.01,
      steps: ['$2\\pi n d/\\lambda = 2\\pi \\times 1.5 \\times 50/600 = \\pi/4$, so $\\sin^2 = 0.5$.', '$P = 4 \\times 0.04 \\times 0.5 = 0.08$: the arrows are at right angles.'] }
  ],
  applications: [
    'Anti-reflection coatings on camera lenses, spectacles and solar cells; stacks of many layers make near-perfect mirrors for lasers.',
    'Measuring the thickness of thin films in chip manufacturing from the colours they reflect.',
    'Soap bubbles, oil slicks and the tarnish on metals: colours from thickness alone.',
    'Explore the two arrows against thickness in [the QED arrows lab](#/tools/arrows/glass).'
  ],
  history: 'Robert Hooke (1665) and Newton (whose *Opticks* appeared in 1704) studied the colours of thin films and Newton\'s rings in detail; Thomas Young explained them by interference around 1802. Anti-reflection coatings were developed in the 1930s, notably at Carl Zeiss by Alexander Smakula (1935). Feynman used the thin sheet of glass as the opening puzzle of *QED* because the two-arrow answer is so simple and the particle picture alone is so helpless.',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 1 (Introduction) — partial reflection by one and by two surfaces, the reflection cycling from 0 to 16 % with thickness, and the two arrows that explain it.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 33 (Reflection from Surfaces) — how much light a surface reflects, from Maxwell\'s equations.',
    'Vol. I, ch. 31 (The Origin of the Refractive Index) — the light scattered by the electrons of the glass adds up to the refracted and reflected waves.'
  ],
  sim: 'qed-glass'
},

{
  id: 'every-path-counts', parent: 'qed-light', title: 'Every path counts: mirrors and gratings', level: 2,
  short: 'Light reflects from every part of a mirror, not only where the angles are equal. The arrows from the middle point the same way and add up; those from the ends curl round and cancel. Scrape away the right strips and the ends reflect too — a grating, which sends each colour to its own angle.',
  keywords: ['mirror', 'every path', 'angle of reflection', 'Cornu spiral', 'Fresnel zone', 'diffraction grating', 'colours', 'CD', 'grating equation', 'stationary time', 'sum over paths'],
  prereq: ['arrow-rule', 'physics:reflection', 'least-time'],
  related: ['lens-and-least-time', 'why-least-action', 'path-integral', 'diffraction-feyn', 'physics:diffraction-grating', 'physics:huygens-principle', 'partial-reflection'],
  body: `
Where does light from a lamp S bounce off a mirror to reach an eye D? Everyone points to the spot where the angle of incidence equals the angle of reflection. QED says something stranger: light reflects from **every** part of the mirror. Divide the mirror into narrow strips; for each strip there is a path S → strip → D, and each path gets an arrow, its direction set by the time the path takes. Then add them all.

### The valley of times
Plot the time of each path against where it touches the mirror. The curve is a valley whose lowest point is exactly the equal-angle point — the path of least time. Near the bottom the curve is flat (the time is [[?stationary]]): neighbouring strips have almost the same times, so their arrows point almost the same way and **add up**. Far from the bottom the curve is steep: the times of neighbouring strips differ by a good fraction of a period, their arrows point in quite different directions, and they **curl round** in tight circles that add up to almost nothing.

Laid head to tail, the arrows of the whole mirror make a double spiral — the Cornu spiral. The final arrow runs from the eye of one coil to the eye of the other, and nearly all of its length comes from the straight stretch in the middle. So the ends of the mirror *do* reflect; it is just that their contributions cancel among themselves.

### How much of the mirror matters?
The strips that count are those whose path is within about half a wavelength of the shortest — the first **Fresnel zone**. For a lamp and an eye at distances $a$ and $b$ from the mirror, its half-width is about

$$w \\approx \\sqrt{\\frac{\\lambda\\,ab}{a+b}}$$

With $a = b = 1$ m and $\\lambda = 500$ nm, $w \\approx 0.5$ mm. Of a whole bathroom mirror, a patch about a millimetre across supplies most of the final arrow for your eye; the arrows from everywhere else mostly cancel among themselves. (How much a sharp-edged patch gives on its own depends on exactly where its edges fall on the spiral — try keeping only the middle strips in the simulation.)

### Scrape the mirror: a grating
The arrows of the ends cancel because, strip after strip, they point one way, then the opposite way, then back. Suppose we scrape away the strips whose arrows point, say, to the left, and keep those pointing to the right. The survivors no longer cancel, and a large final arrow appears — **the ends now reflect**, towards an angle where an ordinary mirror sends nothing. What is left is a set of evenly spaced shiny lines: a **diffraction grating**.

For lines a distance $d$ apart, the arrows from neighbouring lines line up whenever their paths differ by a whole number $m$ of wavelengths. For light arriving at angle $\\theta_i$ and leaving at $\\theta_m$ (both from the perpendicular):

$$d\\,(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$$

Because the angle depends on $\\lambda$, a grating spreads white light into a spectrum. The tracks of a CD are 1.6 µm apart; with light falling straight on, the first-order colours leave at

| Colour | Wavelength | Angle, CD (1.6 µm) | Angle, DVD (0.74 µm) |
|---|---|---|---|
| blue | 450 nm | 16.3° | 37.5° |
| green | 530 nm | 19.3° | 45.7° |
| red | 650 nm | 24.0° | 61.5° |

Nature uses the same trick: the shimmering blues of some butterflies and beetles come from regular microscopic ridges, not from pigment.

### The lesson
The law that the angles are equal is not something light obeys. It is what is left after all the arrows are added: the paths near the least-time path agree with their neighbours and survive; all the others cancel. This is Feynman's answer to the old puzzle of how light "knows" the path of least time ([[least-time]], [[why-least-action]]) — it does not know; it tries every path. The simulation lets you scrape any strip away with a click; the second one sends white light onto a grating.
`,
  ideas: [
    'Every part of a mirror reflects: each strip gives a path and an arrow.',
    'Near the equal-angle (least-time) point the times are stationary, so the arrows line up; towards the ends they curl round and cancel.',
    'Only a small central patch — the first Fresnel zone, about √(λab/(a + b)) wide — contributes most of the reflection.',
    'Scraping away the strips whose arrows point one way leaves a grating that reflects at other angles: d(sin θₘ − sin θᵢ) = mλ.',
    'The equal-angle law is what survives when all the arrows are added.'
  ],
  pitfalls: [
    'Light only reflects at the point where the angles are equal — Every part reflects; the arrows from the rest simply cancel. Scraping the mirror into a grating proves it.',
    'Light from the ends of a mirror never reaches the eye — It does, and its arrows are as long as any others; they simply curl round and largely cancel among themselves.',
    'A grating adds something to the light to make colours — It only removes strips of mirror; the colours are there because each wavelength\'s arrows line up at its own angle.'
  ],
  formulas: [
    {
      name: 'The grating equation',
      expr: 'd*(sin(th) - sin(thi)) = m*lambda', tex: 'd\\,(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda',
      vars: {
        th: { name: 'angle of the outgoing light', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\theta_m' },
        d: { name: 'spacing of the lines', q: 'length', unit: 'µm', value: 1.6 },
        thi: { name: 'angle of the incoming light', q: 'angle', unit: '°', value: 20, min: -90, max: 90, signed: true, tex: '\\theta_i' },
        m: { name: 'order (whole number of wavelengths)', q: 'none', value: 1, int: true, signed: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 530, tex: '\\lambda' }
      },
      solveFor: 'th',
      note: 'Angles measured from the perpendicular to the grating; m = 0 is ordinary mirror reflection.',
      stories: { th: 'Light of {lambda} falls at {thi} on a grating with lines {d} apart. At what angle does order {m} leave?', d: 'Order {m} of {lambda} light arriving at {thi} leaves at {th}. How far apart are the lines?' }
    },
    {
      name: 'How much of the mirror matters (the first Fresnel zone)',
      expr: 'w = sqrt(lambda*a*b/(a + b))', tex: 'w = \\sqrt{\\dfrac{\\lambda\\,ab}{a+b}}',
      vars: {
        w: { name: 'half-width of the patch that reflects', q: 'length', unit: 'mm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        a: { name: 'distance from the source to the mirror', q: 'length', unit: 'm', value: 1 },
        b: { name: 'distance from the mirror to the eye', q: 'length', unit: 'm', value: 1 }
      },
      note: 'For light falling nearly straight on: the strip over which the path is within half a wavelength of the shortest.',
      stories: { w: 'A lamp {a} from a mirror is seen by an eye {b} from it, in {lambda} light. How wide is the patch of mirror that does the reflecting?' }
    }
  ],
  examples: [
    {
      title: 'The part of a bathroom mirror that you use',
      q: 'Your eye is 0.5 m from a mirror and a lamp is 1.5 m from it. For green light (550 nm), how wide is the patch of mirror that reflects the lamp into your eye?',
      steps: [
        '$w = \\sqrt{\\lambda ab/(a+b)} = \\sqrt{550\\times10^{-9} \\times 1.5 \\times 0.5/2.0}$.',
        '$= \\sqrt{2.06\\times10^{-7}} = 4.5\\times10^{-4}$ m.'
      ],
      a: 'A half-width of about 0.45 mm — a patch roughly a millimetre across.'
    },
    {
      title: 'The rainbow of a CD',
      q: 'White light falls straight onto a CD (tracks 1.6 µm apart). At what angles do blue (450 nm) and red (650 nm) leave in first order?',
      steps: [
        'With $\\theta_i = 0$ and $m = 1$: $\\sin\\theta_1 = \\lambda/d$.',
        'Blue: $\\sin\\theta = 0.45/1.6 = 0.281$, $\\theta = 16.3°$. Red: $\\sin\\theta = 0.65/1.6 = 0.406$, $\\theta = 24.0°$.'
      ],
      a: 'Blue at 16°, red at 24°: the colours fan out over about 8°, and second order follows at larger angles.'
    }
  ],
  quiz: [
    { q: 'Most of the length of the final arrow for a mirror comes from…', choices: ['a small region around the equal-angle point', 'the two ends of the mirror', 'every strip equally', 'the single equal-angle point and nothing else'], a: 0, why: 'Near the least-time point the arrows of neighbouring strips point the same way; further out they curl round and mostly cancel.' },
    { q: 'Why do the arrows from strips near the ends of the mirror cancel?', choices: ['their times change quickly from strip to strip, so neighbouring arrows point in very different directions', 'the ends are further away, so their arrows are much shorter', 'light cannot reach the ends of a mirror', 'the ends reflect at the wrong angle'], a: 0, why: 'Away from the least-time point the time curve is steep; the arrows turn rapidly and curl into small circles.' },
    { q: 'At an angle where a plain mirror sends no light, a mirror scraped into a grating can send a lot.', a: true, why: 'Removing the strips whose arrows pointed the "wrong" way leaves arrows that add up at that angle.' },
    { q: 'Light of 500 nm falls straight onto a grating with lines 1.0 µm apart. At what angle (in degrees) is the first order?', answer: 30, unit: '°', why: 'sin θ = λ/d = 0.5, so θ = 30°.' },
    { q: 'Compared with a CD, a DVD (lines closer together) spreads the colours…', choices: ['to larger angles', 'to smaller angles', 'to the same angles', 'not at all'], a: 0, why: 'sin θ = mλ/d: a smaller d gives larger angles (45.7° for green on a DVD against 19.3° on a CD).' }
  ],
  problems: [
    { q: 'What line spacing sends red light (650 nm) to 40° in first order when it falls straight on the grating? Answer in micrometres.', answer: 1.011, unit: 'µm', tol: 0.01,
      steps: ['$d = m\\lambda/\\sin\\theta = 650/\\sin 40° = 650/0.643 = 1011$ nm.', 'About 1.01 µm — roughly 1000 lines per millimetre.'] }
  ],
  applications: [
    'Spectrometers split light with gratings to find what stars, flames and chemical samples are made of.',
    'The colours of CDs, DVDs and holographic foils; the structural colours of butterflies and beetles.',
    'Tunable lasers and telecom demultiplexers select wavelengths with gratings.',
    'Scrape a mirror yourself in [the QED arrows lab](#/tools/arrows/mirror).'
  ],
  history: 'Augustin Fresnel divided wavefronts into zones in 1818 to explain diffraction, and Marie Alfred Cornu drew the spiral that bears his name in 1874. Joseph von Fraunhofer made wire gratings around 1821 and used them to measure the wavelengths of the dark lines in sunlight; Henry Rowland\'s ruling engines at Johns Hopkins in the 1880s made gratings precise enough to map the solar spectrum. Feynman turned this classical wave optics into a story about photons and arrows in the second of his QED lectures.',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 2 (Photons: Particles of Light) — light reflecting from every part of a mirror, the arrows of the ends cancelling, and a mirror scraped into a grating that sends colours to different angles.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 26 (Optics: The Principle of Least Time) — reflection from a mirror as the path of least time.',
    'Vol. I, ch. 30 (Diffraction) — the diffraction grating and the sum of many equal oscillators with steadily changing phase.'
  ],
  sim: ['qed-mirror', 'qed-grating']
},

{
  id: 'lens-and-least-time', parent: 'qed-light', title: 'Lenses, least time and the arrows', level: 2,
  short: 'Light seems to take the path of least time because only near that path do the arrows of neighbouring paths agree. A lens is glass shaped so that every path from a point to its image takes the same time: all the arrows line up there, and nowhere else.',
  keywords: ['lens', 'focus', 'least time', 'Fermat', 'refraction', 'Snell\'s law', 'lifeguard', 'equal times', 'focal length', 'lensmaker', 'Airy disc', 'resolution'],
  prereq: ['every-path-counts', 'least-time', 'physics:thin-lenses'],
  related: ['geometrical-optics-feyn', 'why-least-action', 'classical-limit', 'path-integral', 'physics:refraction', 'diffraction-feyn', 'mechanisms-of-seeing'],
  body: `
### Least time, and how light "knows"
Light travelling between two points through different materials follows the path that takes the least time — Fermat's principle (1662). Going from air into water it bends so as to spend less of its journey in the slower water, like a lifeguard who runs further along the beach to swim less. The result is Snell's law of refraction:

$$n_1\\sin\\theta_1 = n_2\\sin\\theta_2$$

But how can light know which path is quickest before it sets off? QED's answer is the one we met at the mirror ([[every-path-counts]]): it does not know. It takes every path. Near the path of least time the time is [[?stationary]] — a small change of path hardly changes it — so the arrows of neighbouring paths point the same way and add up. Away from it the times change quickly, the arrows curl round and cancel. What survives is a narrow bundle of paths around the one of least time, and that is what we call a ray of light.

### A lens makes all the times equal
Now a lens. From a point S to a point F on the far side, the straight path through the middle of the lens is the shortest; paths through the edge are longer and, in air, take longer. Glass slows light down: in glass of index $n$, a thickness $w$ costs an extra time

$$\\Delta t = \\frac{(n-1)\\,w}{c}$$

A converging lens is thick in the middle and thin at the edge — shaped so that the central path is delayed by exactly as much as the outer paths lose by being longer. **Every path from S to F then takes the same time.** All their arrows point the same way, and they add up to a final arrow as long as it can possibly be: that is a focus.

At any other point P the times are no longer equal: the arrows turn steadily from one side of the lens to the other and curl up, and little light arrives. A focus is not a place light is "sent"; it is the one place where the arrows of all the paths agree. Drag the detector in the simulation off the focus and watch the straight line of arrows coil into a small circle.

| Glass, $n = 1.5$ | Extra delay | Turns of the stopwatch at 600 nm |
|---|---|---|
| 1 µm | 1.7 fs | 0.83 |
| 0.1 mm | 0.17 ps | 83 |
| 1 mm | 1.7 ps | 833 |
| 1 cm | 17 ps | 8 300 |

Because a millimetre of glass is worth hundreds of turns, a lens surface must be shaped to a small fraction of a wavelength — good optics are polished to about 50 nm.

### The lens equation from equal times
For paths that cross the lens a height $y$ from its axis, a [[?small-approximation]] of the path lengths and of the glass thickness turns "equal times" into the familiar formulas for a thin lens with surface radii $R_1$, $R_2$ and an object and image at distances $s_1$ and $s_2$ (see the derivation):

$$\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1}+\\frac{1}{R_2}\\right), \\qquad \\frac{1}{s_1}+\\frac{1}{s_2} = \\frac{1}{f}$$

### How small can a focus be?
The arrows line up exactly only at F. Move a little sideways, and the paths through the two edges of the lens change in opposite directions; once the difference across the lens reaches about a wavelength, the arrows span a full circle and cancel. So a focus has a width of roughly $\\lambda\\,f/D$ for a lens of diameter $D$ (Airy's more careful result puts the first dark ring at $1.22\\,\\lambda f/D$): about 1.3 µm for a camera lens at $f/D = 2$ in green light. A **bigger** lens has paths from a wider range of directions, which fall out of step sooner, and so makes a **smaller** spot — the reason astronomers build large telescopes. And if you shrink the lens to a narrow slit, the arrows no longer cancel away from F, and the light spreads out: diffraction.

> [!key] Light takes every path; only those near the path of stationary (least) time add up. A lens makes the times of all paths to one point equal, so there all the arrows line up.
`,
  ideas: [
    'The path of least time is where the time is stationary: neighbouring paths have nearly equal times, so their arrows add.',
    'Refraction and Snell\'s law follow from least time, and QED explains least time by the cancelling of all other arrows.',
    'A lens is thick in the middle to delay the short central paths: every path from S to its focus takes the same time.',
    'At the focus all the arrows line up; elsewhere they curl up and cancel.',
    'The focus has a size of about λf/D: a larger lens makes a smaller spot.'
  ],
  pitfalls: [
    'Light chooses the fastest path because it somehow knows the way — It tries every path; only near the path of least time do the arrows agree and survive.',
    'A lens bends light at its surfaces by pushing on photons — The delays of the paths through different thicknesses of glass are what matter; they make all the arrows to the focus point the same way.',
    'A perfect lens focuses light to a mathematical point — The arrows of paths through a lens of diameter D fall out of step within about λf/D of the focus, so the spot always has a size.'
  ],
  derivation: {
    title: 'The lens formula from equal times',
    steps: [
      { text: 'A path from S (distance $s_1$ before the lens) to F (distance $s_2$ after it) crossing the lens at height $y$ has length $\\sqrt{s_1^2 + y^2} + \\sqrt{s_2^2+y^2}$. For $y \\ll s$ use $\\sqrt{s^2+y^2} \\approx s + y^2/2s$:', tex: 'L(y) \\approx s_1 + s_2 + \\frac{y^2}{2}\\left(\\frac{1}{s_1}+\\frac{1}{s_2}\\right)' },
      { text: 'A spherical surface of radius $R$ is lower at height $y$ than at the axis by $y^2/2R$ (the same approximation). So a lens with radii $R_1$ and $R_2$ is thinner at $y$ by', tex: 'w(y) \\approx w_0 - \\frac{y^2}{2}\\left(\\frac{1}{R_1}+\\frac{1}{R_2}\\right)' },
      { text: 'Glass adds $(n-1)w$ to the effective length (the time multiplied by $c$). The total is', tex: 'c\\,t(y) = s_1 + s_2 + (n-1)w_0 + \\frac{y^2}{2}\\left[\\frac{1}{s_1}+\\frac{1}{s_2} - (n-1)\\left(\\frac{1}{R_1}+\\frac{1}{R_2}\\right)\\right]' },
      { text: 'For every path to take the same time, whatever $y$ is, the bracket must vanish. Calling the lens term $1/f$ gives both formulas at once:', tex: '\\frac{1}{s_1}+\\frac{1}{s_2} = (n-1)\\left(\\frac{1}{R_1}+\\frac{1}{R_2}\\right) = \\frac{1}{f}' }
    ]
  },
  formulas: [
    {
      name: 'Refraction (Snell\'s law, the path of least time)',
      expr: 'n1*sin(th1) = n2*sin(th2)', tex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2',
      vars: {
        th2: { name: 'angle in the second medium', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' },
        n1: { name: 'refractive index of the first medium', q: 'none', value: 1.0, tex: 'n_1' },
        th1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\theta_1' },
        n2: { name: 'refractive index of the second medium', q: 'none', value: 1.33, tex: 'n_2' }
      },
      solveFor: 'th2',
      note: 'Angles from the perpendicular to the surface. It is the condition for the time to be stationary.',
      stories: { th2: 'Light passes from a medium of index {n1} at {th1} into one of index {n2}. At what angle does it travel on?' }
    },
    {
      name: 'Extra delay in glass',
      expr: 'dt = (n - 1)*w/c', tex: '\\Delta t = \\dfrac{(n-1)\\,w}{c}',
      vars: {
        dt: { name: 'extra time compared with the same distance in air', q: 'time', unit: 'ps', tex: '\\Delta t' },
        n: { name: 'refractive index', q: 'none', value: 1.5 },
        w: { name: 'thickness of glass', q: 'length', unit: 'mm', value: 2 },
        c: { const: 'c' }
      },
      stories: { dt: 'How much longer does light take through {w} of glass of index {n} than through the same distance of air?', w: 'What thickness of glass of index {n} delays light by {dt}?' }
    },
    {
      name: 'The lensmaker\'s formula (thin lens)',
      expr: '1/f = (n - 1)*(1/R1 + 1/R2)', tex: '\\dfrac{1}{f} = (n-1)\\left(\\dfrac{1}{R_1}+\\dfrac{1}{R_2}\\right)',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'm' },
        n: { name: 'refractive index of the glass', q: 'none', value: 1.5 },
        R1: { name: 'radius of the first surface', q: 'length', unit: 'm', value: 0.1, tex: 'R_1' },
        R2: { name: 'radius of the second surface', q: 'length', unit: 'm', value: 0.1, tex: 'R_2' }
      },
      solveFor: 'f',
      note: 'Both radii positive for a lens bulging on both sides; it follows from making all path times equal.',
      stories: { f: 'A lens of glass {n} has surfaces of radius {R1} and {R2}. What is its focal length?' }
    },
    {
      name: 'Object and image (thin lens)',
      expr: '1/s1 + 1/s2 = 1/f', tex: '\\dfrac{1}{s_1}+\\dfrac{1}{s_2} = \\dfrac{1}{f}',
      vars: {
        s2: { name: 'distance of the image', q: 'length', unit: 'm', tex: 's_2' },
        s1: { name: 'distance of the object', q: 'length', unit: 'm', value: 0.3, tex: 's_1' },
        f: { name: 'focal length', q: 'length', unit: 'm', value: 0.1 }
      },
      solveFor: 's2',
      note: 'The two points between which every path through the lens takes the same time.',
      stories: { s2: 'An object is {s1} from a lens of focal length {f}. Where is its image?', f: 'A lens forms an image {s2} behind it of an object {s1} in front. What is its focal length?' }
    }
  ],
  examples: [
    {
      title: 'The lifeguard\'s law',
      q: 'Light in air meets water (n = 1.33) at 40° from the perpendicular. At what angle does it continue in the water?',
      steps: [
        '$\\sin\\theta_2 = (n_1/n_2)\\sin\\theta_1 = \\sin 40°/1.33 = 0.643/1.33 = 0.483$.',
        '$\\theta_2 = 28.9°$ — bent towards the perpendicular, so less of the path lies in the slow water.'
      ],
      a: '28.9°.'
    },
    {
      title: 'Where the arrows line up',
      q: 'A lens with both surfaces of radius 10 cm is made of glass with n = 1.5. Where is the image of a lamp 30 cm in front of it?',
      steps: [
        '$1/f = 0.5 \\times (1/0.1 + 1/0.1) = 10$ per metre, so $f = 10$ cm.',
        '$1/s_2 = 1/f - 1/s_1 = 10 - 3.33 = 6.67$ per metre, so $s_2 = 15$ cm.',
        'At 15 cm behind the lens every path from the lamp takes the same time.'
      ],
      a: '15 cm behind the lens.'
    }
  ],
  quiz: [
    { q: 'Why is a converging lens thicker in the middle than at the edge?', choices: ['to delay the short central paths so that all paths to the focus take the same time', 'to bend the rays at the edge more strongly', 'to absorb the light that would go astray', 'to make the lens stronger mechanically'], a: 0, why: 'Glass delays light by (n − 1)w/c; more glass in the middle makes up for the longer paths through the edge.' },
    { q: 'A detector is placed a little to the side of the focus. The arrows of the paths through the lens there…', choices: ['turn steadily across the lens and curl up, so little light arrives', 'all line up, as at the focus', 'all become shorter', 'point randomly, giving a quarter of the light'], a: 0, why: 'Off the focus the times differ smoothly from one edge to the other; the arrows form a curl.' },
    { q: 'Light follows the path of least time because it calculates the quickest route before leaving.', a: false, why: 'Every path contributes; only near the path of stationary time do neighbouring arrows agree and add up.' },
    { q: 'How many picoseconds of extra delay does 2 mm of glass (n = 1.5) add?', answer: 3.34, unit: 'ps', why: 'Δt = (n − 1)w/c = 0.5 × 0.002/(3.0 × 10⁸) = 3.3 × 10⁻¹² s.' },
    { q: 'You double the diameter of a lens but keep its focal length. The focused spot becomes…', choices: ['about half as wide', 'about twice as wide', 'the same size', 'four times as bright but the same size'], a: 0, why: 'The spot size is about λf/D: paths from a wider lens fall out of step twice as quickly off the focus.' }
  ],
  problems: [
    { q: 'An object stands 0.3 m in front of a lens of focal length 0.1 m. How far behind the lens is the image?', answer: 0.15, unit: 'm', tol: 0.01,
      steps: ['$1/s_2 = 1/0.1 - 1/0.3 = 6.67$ per metre.', '$s_2 = 0.15$ m.'] },
    { q: 'How many turns does the stopwatch hand make in the extra delay of 1 mm of glass (n = 1.5), for 600 nm light?', answer: 833, tol: 0.01, hint: 'The extra turns are the extra optical path (n − 1)w divided by the wavelength.',
      steps: ['Extra optical path: $(n-1)w = 0.5$ mm.', 'Turns: $0.5\\times10^{-3}/600\\times10^{-9} = 833$.'] }
  ],
  applications: [
    'Every camera, microscope, telescope and eye focuses by equalising the travel times of the paths to each image point.',
    'Graded-index optical fibres and lenses slow the central rays with a denser core, so pulses along different paths arrive together.',
    'The resolution limit λf/D sets how fine a detail a microscope can see and how small a spot a DVD laser can burn.'
  ],
  history: 'Hero of Alexandria noticed in the first century that a reflected ray takes the shortest path; Willebrord Snell found the law of refraction (1621), published by Descartes (1637); Pierre de Fermat derived it from the principle of least time (1662). George Airy calculated the smallest spot a lens can make in 1835. Feynman\'s explanation of least time by adding the arrows of all paths grew out of his path-integral formulation of quantum mechanics (1948).',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 2 (Photons: Particles of Light) — least time explained by the arrows of neighbouring paths, and a lens as a piece of glass that makes the times of all paths to the focus equal.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 26 (Optics: The Principle of Least Time) — Fermat\'s principle, the lifeguard and refraction, and focusing by equal times.',
    'Vol. I, ch. 27 (Geometrical Optics) — the focal length of a lens and the lens formula.'
  ],
  sim: 'qed-lens'
},

/* ================================================================ ELECTRONS AND THEIR INTERACTIONS */
{
  id: 'three-basic-actions', parent: 'qed-matter', title: 'Electrons and photons: three basic actions', level: 2,
  short: 'All that light and electrons do comes from three basic actions: a photon goes from place to place, an electron goes from place to place, and an electron emits or absorbs a photon. Each gets an arrow; drawn in space-time, combinations of them are Feynman\'s pictures of everything from scattering to positrons.',
  keywords: ['three basic actions', 'junction', 'coupling', 'space-time diagram', 'photon propagator', 'electron propagator', 'emission', 'absorption', 'fine-structure constant', '1/137', 'positron', 'backwards in time', 'light cone'],
  prereq: ['arrow-rule', 'spacetime-geometry', 'photons-as-particles'],
  related: ['feynman-diagrams', 'matter-antimatter', 'path-integral', 'electromagnetic-mass', 'identical-particles', 'physics:antimatter', 'physics:compton-scattering', 'four-vectors-feyn'],
  body: `
Once light is understood as photons with arrows, Feynman added electrons. The astonishing claim of QED is that everything light and electrons do — the colours of things, reflection and refraction, electricity, the laser, the whole of chemistry, every phenomenon in which atomic nuclei simply sit there as heavy charges — comes from just **three basic actions**:

1. **A photon goes from place to place** — from a point A at one time to a point B at another. Its arrow is called $P(A \\to B)$.
2. **An electron goes from place to place** — its arrow is $E(A \\to B)$.
3. **An electron emits or absorbs a photon.** Its arrow is a fixed number, the **junction number** $j$: in QED's rough picture, an arrow about 0.1 long, pointing backwards.

### Pictures in space-time
To keep track, draw time going **up** the page and one direction of space **across**. A point on the page is an **event**: a place at a time. A particle's history is a line — for a photon a wavy line, for an electron a straight one — and an emission or absorption is a point where a wavy line meets a straight line. With time measured in the distance light travels (one metre of time is 3.34 ns), light moves along 45° lines; anything slower, like an electron, runs more steeply. Events that light can join lie on the **light cone**, where the [[?invariant|space-time interval]]

$$I = (c\\,\\Delta t)^2 - \\Delta x^2$$

is zero. The photon's arrow $P(A\\to B)$ is largest there. Feynman stressed a surprising detail: there is also an arrow for a photon to go a little faster or slower than $c$. Over long distances these arrows cancel, which is why light seems to travel exactly at $c$; over atomic distances they matter.

### The electron's stopwatch
The electron's arrow is more complicated (it has mass and spin), but its stopwatch turns at a rate set by its rest energy, $f = mc^2/h = 1.24\\times10^{20}$ turns a second — two hundred thousand times faster than the hand for green light.

### Building everything else
Every process is a combination. The arrow for one particular way is the **product** of the arrows of its pieces — each junction shrinks the arrow by about a tenth — and since a junction could have happened at any place and time, the arrows for all those possibilities are **added** (a [[?sum]] over every point of space-time, in the continuum an [[?integral]]).
- **Two electrons exchange a photon.** Electron 1 goes from A to C, emits a photon there; the photon goes from C to D; electron 2 absorbs it at D. The arrow is $E(A\\to C)\\cdot j\\cdot P(C\\to D)\\cdot j\\cdot E(D\\to\\ldots)$, added over all C and D. This is how electrons repel: the next page, [[feynman-diagrams]].
- **An electron scatters light.** It absorbs a photon and then emits one — or, equally allowed, emits first and absorbs afterwards. Both orders are ways, and both arrows count.
- **Positrons.** An electron line may run **backwards in time**. Seen by us, moving forward in time, such a stretch is a *positron*, the electron's antiparticle: a zigzag line is a pair created at one event and annihilated at another.

| Process | Junctions | Arrow shrunk by about |
|---|---|---|
| a photon or electron simply travels | 0 | 1 |
| an electron emits one photon | 1 | $j \\approx 0.1$ |
| two electrons exchange a photon | 2 | $j^2 \\approx 0.01$ |
| an electron scatters light | 2 | $j^2$ |
| two electrons exchange two photons | 4 | $j^4 \\approx 10^{-4}$ |

### The number 1/137
The junction number is the electron's charge in disguise. Measured in any units, the combination that matters is the **fine-structure constant**

$$\\alpha = \\frac{e^2}{4\\pi\\varepsilon_0\\hbar c} = \\frac{1}{137.036}$$

a pure number, the same whatever units are used; the observed coupling whose square is $\\alpha$ is about 0.085 (the "0.1" of the rough picture). Every extra pair of junctions makes an arrow smaller by a factor of about $1/137$ — which is why QED can be calculated as a series of smaller and smaller corrections.

> [!key] Three actions — photon goes, electron goes, electron emits or absorbs — each with an arrow. Multiply the arrows of the pieces of one way; add the arrows of all the ways, including every place and time where the junctions could be.

In the simulation, choose a story and watch it happen along a moving line of "now"; drag the junction to another place or time — every position is one more way, with its own arrow, to be added to the rest.
`,
  ideas: [
    'Three basic actions: a photon goes from place to place, an electron goes from place to place, an electron emits or absorbs a photon.',
    'Space-time diagrams show them with time upwards: photons at 45°, electrons steeper, junctions where lines meet.',
    'The arrow for one way is the product of the arrows of its pieces; the arrows of all ways (all junction positions) are added.',
    'Each junction shrinks the arrow by about a tenth; the square of the coupling is α = 1/137.036.',
    'An electron line running backwards in time is a positron.'
  ],
  pitfalls: [
    'A Feynman diagram shows the paths the particles really took — It stands for a whole family of ways, summed over every place and time the junctions could be; the particles have no single path.',
    'Photons always travel at exactly c — In QED there are arrows for slightly faster and slower motion; they cancel over long distances, leaving light at c.',
    'The order of absorption and emission is fixed by cause and effect — When an electron scatters light, the way in which it emits the new photon before absorbing the old one also counts.'
  ],
  formulas: [
    {
      name: 'The fine-structure constant',
      expr: 'alpha = qe^2/(4*pi*eps0*hbar*c)', tex: '\\alpha = \\dfrac{e^2}{4\\pi\\varepsilon_0\\hbar c}',
      vars: {
        alpha: { name: 'fine-structure constant (the square of the coupling)', q: 'none', tex: '\\alpha' },
        qe: { const: 'qe' },
        eps0: { const: 'eps0' },
        hbar: { const: 'hbar' },
        c: { const: 'c' }
      },
      note: 'A pure number: 0.0072974 = 1/137.036. Its square root, about 0.085, is the size of the observed junction arrow.'
    },
    {
      name: 'The space-time interval between two events',
      expr: 'I = (c*t)^2 - x^2', tex: 'I = (c\\,\\Delta t)^2 - \\Delta x^2',
      vars: {
        I: { name: 'interval', q: 'area', unit: 'm²', signed: true },
        c: { const: 'c' },
        t: { name: 'time between the events', q: 'time', unit: 'ns', value: 10, tex: '\\Delta t' },
        x: { name: 'distance between the events', q: 'length', unit: 'm', value: 2, tex: '\\Delta x' }
      },
      note: 'Zero on the light cone, where the photon\'s arrow is largest; positive when a slower particle could go from one event to the other; negative when not even light could.',
      stories: { I: 'Two events are {x} and {t} apart. What is the interval between them?', x: 'Two events {t} apart have an interval of {I}. How far apart are they?' }
    },
    {
      name: 'How fast a particle\'s stopwatch turns',
      expr: 'f = m*c^2/h', tex: 'f = \\dfrac{mc^2}{h}',
      vars: {
        f: { name: 'turns per second, at rest', q: 'frequency', unit: 'Hz' },
        m: { name: 'mass of the particle', q: 'mass', unit: 'kg', value: 9.109e-31 },
        c: { const: 'c' },
        h: { const: 'h' }
      },
      note: 'The rest energy divided by Planck\'s constant (the Compton frequency).',
      stories: { f: 'How many times a second does the stopwatch of a particle of mass {m} turn when it is at rest?' }
    }
  ],
  examples: [
    {
      title: 'Computing 1/137',
      q: 'Evaluate $\\alpha = e^2/(4\\pi\\varepsilon_0\\hbar c)$.',
      steps: [
        '$e^2 = (1.602\\times10^{-19})^2 = 2.567\\times10^{-38}$ C².',
        '$4\\pi\\varepsilon_0\\hbar c = 4\\pi \\times 8.854\\times10^{-12} \\times 1.0546\\times10^{-34} \\times 2.998\\times10^{8} = 3.518\\times10^{-36}$ C².',
        '$\\alpha = 2.567\\times10^{-38}/3.518\\times10^{-36} = 7.297\\times10^{-3}$.'
      ],
      a: 'α = 0.007297 = 1/137.04. The units cancel: it is a pure number.'
    },
    {
      title: 'Which events can a photon join?',
      q: 'Event A is at the origin. Which of these events can be reached by light from A: B₁ 3.0 m away and 10.0 ns later; B₂ 1.0 m away and 10.0 ns later; B₃ 5.0 m away and 10.0 ns later?',
      steps: [
        'In 10.0 ns light travels $c\\Delta t = 3.00$ m, so $(c\\Delta t)^2 = 8.99$ m².',
        'B₁: $I = 8.99 - 9.0 \\approx 0$ — on the light cone: the photon\'s arrow is large.',
        'B₂: $I = 8.99 - 1 = 8.0$ m² — inside the cone: an electron at a third of $c$ could make it.',
        'B₃: $I = 8.99 - 25 = -16$ m² — outside the cone: a photon would have to go faster than light; its arrow is tiny.'
      ],
      a: 'Only B₁ is on the light cone; B₂ is reachable by slower particles; B₃ by nothing classical.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT one of QED\'s three basic actions?', choices: ['a photon splits into two photons', 'a photon goes from place to place', 'an electron goes from place to place', 'an electron emits or absorbs a photon'], a: 0, why: 'In QED photons never couple directly to photons; everything is built from the three actions.' },
    { q: 'In a space-time diagram with time measured in light-metres, a photon\'s line makes an angle with the time axis of…', choices: ['45°', '0°', '90°', 'any angle, depending on its energy'], a: 0, why: 'Light covers one metre of space per metre of time.' },
    { q: 'In Feynman\'s picture a positron can be described as an electron going backwards in time.', a: true, why: 'An electron line running down the page, seen by us moving forward in time, behaves exactly like a positron.' },
    { q: 'What is 1/α, to the nearest whole number?', answer: 137, why: 'α = e²/(4πε₀ħc) = 0.0072974 = 1/137.036.' },
    { q: 'An electron scatters a photon. Which orderings of absorbing the old photon and emitting the new one count?', choices: ['both: absorb then emit, and emit then absorb', 'only absorb then emit', 'only emit then absorb', 'neither: scattering is a separate basic action'], a: 0, why: 'Each ordering is a way the event can happen; their arrows are added.' }
  ],
  problems: [
    { q: 'At what rate does the stopwatch of an electron at rest turn? (f = mc²/h)', answer: 1.236e20, unit: 'Hz', tol: 0.01,
      steps: ['$mc^2 = 9.109\\times10^{-31} \\times (2.998\\times10^{8})^2 = 8.187\\times10^{-14}$ J.', '$f = 8.187\\times10^{-14}/6.626\\times10^{-34} = 1.24\\times10^{20}$ Hz.'] },
    { q: 'Two events are 10 ns and 2 m apart. What is the interval (c Δt)² − Δx², in m²?', answer: 4.99, unit: 'm²', tol: 0.01,
      steps: ['$c\\Delta t = 2.998$ m, squared 8.99 m².', '$I = 8.99 - 4 = 4.99$ m²: inside the light cone.'] }
  ],
  applications: [
    'Electron–positron annihilation into two photons is the signal a PET scanner detects.',
    'The same three actions, with other particles and other couplings, are the template for the whole Standard Model ([[beyond-qed]]).',
    'Chemistry: the forces that hold molecules together are photon exchanges between electrons and nuclei, summed to enormous precision.'
  ],
  history: 'Ernst Stückelberg (1941) and Feynman (1949) described the positron as an electron running backwards in time. In his Nobel lecture (1965) Feynman recalled John Wheeler suggesting to him, half in jest, that all electrons might be one and the same electron zigzagging back and forth in time. Feynman\'s space-time approach and his diagrams were published in 1949 ("The Theory of Positrons" and "Space-Time Approach to Quantum Electrodynamics", both in *Physical Review*); Freeman Dyson showed the same year that they agree with the theories of Julian Schwinger and Sin-Itiro Tomonaga.',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 3 (Electrons and Their Interactions) — the three basic actions, space-time pictures, the junction number, photons with arrows for going faster or slower than light, and positrons as electrons going backwards in time.',
    'R. P. Feynman, "The Theory of Positrons" and "Space-Time Approach to Quantum Electrodynamics", *Physical Review* 76 (1949) — the original papers with the diagrams.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 17 (Space-Time) — events, world lines and the interval.'
  ],
  sim: 'qed-actions'
},

{
  id: 'feynman-diagrams', parent: 'qed-matter', title: 'Feynman diagrams', level: 2,
  short: 'A Feynman diagram lists one family of ways a process can happen, built from the three basic actions. For two electrons scattering, the simplest way is one exchanged photon; two photons, loops and pairs give smaller arrows, each extra photon about 1/137 as big. Adding the diagrams order by order is how QED calculates.',
  keywords: ['Feynman diagram', 'electron–electron scattering', 'Møller scattering', 'photon exchange', 'ladder diagram', 'crossed diagram', 'vertex correction', 'vacuum polarization', 'loop', 'perturbation series', 'order', 'alpha', 'Coulomb\'s law'],
  prereq: ['three-basic-actions', 'arrow-rule', 'math:power-series'],
  related: ['magnetic-moment-g2', 'renormalization-idea', 'identical-particles', 'exclusion-principle', 'gravity-vs-electricity', 'beyond-qed', 'path-integral', 'feynman-life'],
  body: `
### Bookkeeping for arrows
To find the arrow for "two electrons come in, two electrons go out", QED needs every way it can happen. A **Feynman diagram** is a way of listing those ways without getting lost. Each diagram is drawn with the three basic actions — straight lines for electrons, wavy lines for photons, junctions where they meet — and stands for a whole family of ways: its junctions may sit at every possible place and time, and all those arrows are added. The final arrow is the [[?sum]] of the arrows of all the diagrams. Diagrams are sorted by their number of junctions, because each junction shrinks the arrow by about a tenth.

### Electron–electron scattering, order by order
- **One photon exchanged** (2 junctions). One diagram, and by far the biggest arrow. It already contains Coulomb's law: summed over all the places and times of the two junctions, it describes a repulsion between the electrons of

$$F = \\frac{\\alpha\\hbar c}{r^2} = \\frac{e^2}{4\\pi\\varepsilon_0 r^2}$$

- **Two photons** (4 junctions). The *ladder*, where the photons are absorbed in the order they were emitted, and the *crossed ladder*, where they swap. At the same order, an electron can emit and reabsorb its own photon around the exchange (a *vertex correction*), and the exchanged photon can briefly become an electron–positron pair (*vacuum polarization*, a closed loop). Each of these arrows is smaller than the first by a factor of about $\\alpha = 1/137$.
- **Three photons** (6 junctions): $3! = 6$ ways to order the exchanges (a [[?factorial]]), and many more diagrams with loops — each about $\\alpha^2 \\approx 1/19\\,000$ of the first.

| Photons exchanged | Junctions | Arrow compared with one photon | Orderings of the exchanges alone |
|---|---|---|---|
| 1 | 2 | 1 | 1 |
| 2 | 4 | about $\\alpha \\approx 7\\times10^{-3}$ | 2 |
| 3 | 6 | about $\\alpha^2 \\approx 5\\times10^{-5}$ | 6 |
| 4 | 8 | about $\\alpha^3 \\approx 4\\times10^{-7}$ | 24 |

### Identical electrons
The two electrons are identical: if one detector catches an electron at X and the other at Y, nobody can say which incoming electron went where. So each diagram has a twin, with the two outgoing electrons swapped. For electrons, fermions, the twin's arrow is **subtracted** instead of added ([[identical-particles]]) — the same rule that gives the exclusion principle.

### A series in powers of α
Every QED prediction therefore comes out as a series,

$$A = A_1\\left(1 + c_1\\,\\alpha + c_2\\,\\alpha^2 + c_3\\,\\alpha^3 + \\cdots\\right)$$

where each coefficient $c_n$, a number of order one (sometimes ten), is the sum of all the diagrams of that order. Because $\\alpha$ is small, a few terms go a long way — this is a [[?taylor-series|power series]] in $\\alpha$, like expanding a function in powers of a small quantity. The price is the number of diagrams: for the electron's magnetic moment the successive orders need 1, 7, 72, 891 and 12 672 diagrams ([[magnetic-moment-g2]]). Freeman Dyson argued in 1952 that the series cannot converge in the strict mathematical sense; but its terms keep shrinking until roughly the 137th order, far beyond anything anyone will compute, so in practice it behaves as a superb approximation.

Diagrams with closed loops contain a sum over every possible momentum of the particles in the loop, and at first these sums come out infinite; how that is dealt with is [[renormalization-idea]].

> [!key] Each diagram is a family of ways built from the three basic actions. Add the diagrams order by order: every extra exchanged photon costs two junctions and makes the arrow about 1/137 as long.

In the simulation, choose the order and see all the diagrams of electron–electron scattering at that order, with their swapped twins; click one to watch it unfold along the moving line of "now".
`,
  ideas: [
    'A Feynman diagram stands for a family of ways (all positions of its junctions); the arrows of all diagrams are added.',
    'For two electrons, one exchanged photon gives the main arrow — and Coulomb\'s law.',
    'Two exchanged photons (ladder, crossed), vertex corrections and vacuum polarization are smaller by about α = 1/137.',
    'Identical electrons: every diagram has a twin with the outgoing electrons swapped, subtracted for fermions.',
    'QED predictions are power series in α; the number of diagrams grows very fast with the order.'
  ],
  pitfalls: [
    'A diagram shows the trajectories the electrons followed — It is a label for a sum over all places and times of its junctions; nothing in it is a path in space.',
    'Virtual photons in a diagram are real photons that could be detected — They connect two junctions inside the process; their arrows may even correspond to going faster than light or backwards in time.',
    'Higher-order diagrams are always negligible — They are small, but experiments are now so precise that five orders are needed for the electron\'s magnetic moment.'
  ],
  formulas: [
    {
      name: 'Coulomb\'s law from one exchanged photon',
      expr: 'F = alpha*hbar*c/r^2', tex: 'F = \\dfrac{\\alpha\\hbar c}{r^2}',
      vars: {
        F: { name: 'force between two electrons', q: 'force', unit: 'N' },
        alpha: { const: 'alpha' },
        hbar: { const: 'hbar' },
        c: { const: 'c' },
        r: { name: 'distance between them', q: 'length', unit: 'nm', value: 1 }
      },
      note: 'αħc = e²/4πε₀ = 2.307 × 10⁻²⁸ J·m: the same as Coulomb\'s law, written with the fine-structure constant.',
      stories: { F: 'Two electrons are {r} apart. What force does each exert on the other?', r: 'At what distance do two electrons repel each other with {F}?' }
    },
    {
      name: 'How much each extra photon costs',
      expr: 'ratio = alpha^k', tex: '\\text{ratio} = \\alpha^k',
      vars: {
        ratio: { name: 'arrow of a diagram with k extra exchanged photons, compared with one photon', q: 'none', tex: '\\text{ratio}' },
        alpha: { const: 'alpha' },
        k: { name: 'extra photons exchanged', q: 'none', value: 2, int: true }
      },
      note: 'An order-of-magnitude rule: each extra photon brings two junctions. Real coefficients add factors of order one (for the magnetic moment the natural step is α/π).',
      stories: { ratio: 'Roughly how large is the arrow of a diagram with {k} extra exchanged photons, compared with the one-photon diagram?' }
    },
    {
      name: 'Electricity against gravity for two electrons',
      expr: 'ratio = alpha*hbar*c/(G*m^2)', tex: '\\text{ratio} = \\dfrac{\\alpha\\hbar c}{G m^2}',
      vars: {
        ratio: { name: 'electric force ÷ gravitational force', q: 'none', tex: '\\text{ratio}' },
        alpha: { const: 'alpha' },
        hbar: { const: 'hbar' },
        c: { const: 'c' },
        G: { const: 'G' },
        m: { name: 'mass of each particle', q: 'mass', unit: 'kg', value: 9.109e-31 }
      },
      note: 'Independent of the distance, since both forces fall as 1/r²: 4.2 × 10⁴² for two electrons.',
      stories: { ratio: 'Two particles of mass {m} and the charge of an electron: how many times stronger is their electric repulsion than their gravitational attraction?' }
    }
  ],
  examples: [
    {
      title: 'The force of the first diagram',
      q: 'What force does one-photon exchange give between two electrons 1 nm apart, and how does it compare with their gravitational attraction?',
      steps: [
        '$\\alpha\\hbar c = 7.297\\times10^{-3} \\times 1.0546\\times10^{-34} \\times 2.998\\times10^{8} = 2.307\\times10^{-28}$ J·m.',
        '$F = 2.307\\times10^{-28}/(10^{-9})^2 = 2.31\\times10^{-10}$ N.',
        'Gravity: $G m^2/r^2 = 6.674\\times10^{-11} \\times (9.109\\times10^{-31})^2/10^{-18} = 5.5\\times10^{-53}$ N — smaller by $4.2\\times10^{42}$.'
      ],
      a: '0.23 nN of repulsion; gravity is 10⁴² times weaker.'
    },
    {
      title: 'How the orders shrink',
      q: 'Roughly how large are the arrows of the two-photon and three-photon diagrams compared with the one-photon diagram?',
      steps: [
        'Two photons: two more junctions, a factor $\\alpha \\approx 1/137 = 0.0073$.',
        'Three photons: four more junctions, $\\alpha^2 \\approx 5.3\\times10^{-5}$.',
        'A measurement good to 1 % sees the two-photon diagrams; one good to 0.001 % needs the three-photon ones.'
      ],
      a: 'About 0.7 % and 0.005 % of the leading arrow.'
    }
  ],
  quiz: [
    { q: 'In how many different orders can three exchanged photons be absorbed by the second electron (counting only exchanges, no loops)?', choices: ['6', '3', '9', '1'], a: 0, why: 'The absorptions can come in any order of the three photons: 3! = 6.' },
    { q: 'Each additional exchanged photon makes a diagram\'s arrow smaller by roughly…', choices: ['a factor of 137', 'a factor of 2', 'a factor of 10¹⁰', 'nothing — all diagrams are equal'], a: 0, why: 'Two more junctions, each about 0.085: together about α = 1/137.' },
    { q: 'For two electrons, the arrow of the diagram with the outgoing electrons swapped is subtracted, not added.', a: true, why: 'Electrons are fermions: exchanging two identical fermions reverses the arrow.' },
    { q: 'What does a closed electron loop on the exchanged photon line represent?', choices: ['the photon briefly turning into an electron–positron pair', 'an electron orbiting a nucleus', 'a photon going round in a circle', 'a mistake in the drawing'], a: 0, why: 'A loop is a pair created and annihilated: vacuum polarization.' },
    { q: 'What force, in newtons, does one-photon exchange give between two electrons 1 nm apart?', answer: 2.31e-10, unit: 'N', why: 'F = αħc/r² = 2.31 × 10⁻²⁸ J·m / 10⁻¹⁸ m² = 2.3 × 10⁻¹⁰ N.' }
  ],
  problems: [
    { q: 'By the rule that each extra exchanged photon costs a factor α, how large (relative to one photon) is a diagram with four exchanged photons?', answer: 3.886e-7, tol: 0.02,
      steps: ['Three extra photons: $\\alpha^3 = (7.297\\times10^{-3})^3$.', '$= 3.9\\times10^{-7}$.'] },
    { q: 'At what distance, in nanometres, do two electrons repel each other with a force of 1 pN (10⁻¹² N)?', answer: 15.2, unit: 'nm', tol: 0.02,
      steps: ['$r = \\sqrt{\\alpha\\hbar c/F} = \\sqrt{2.307\\times10^{-28}/10^{-12}}$.', '$= 1.52\\times10^{-8}$ m = 15.2 nm.'] }
  ],
  applications: [
    'Every precision test of QED — the Lamb shift, the magnetic moments of the electron and muon, the energy levels of positronium — is a sum of diagrams.',
    'Particle-physics experiments at colliders are designed and interpreted with diagrams of the same kind, for quarks, gluons, W and Z.',
    'The same bookkeeping, with other lines and junctions, is used in condensed-matter physics for electrons in solids.'
  ],
  history: 'Feynman developed the diagrams in 1947–48 and published them in 1949. Freeman Dyson showed in 1949 that Feynman\'s pictures and the more formal methods of Julian Schwinger and Sin-Itiro Tomonaga are the same theory, and explained how to use the diagrams systematically; that is how most physicists learned them. Feynman, Schwinger and Tomonaga shared the 1965 Nobel Prize in Physics for quantum electrodynamics. Dyson\'s argument that the series in α is only asymptotic appeared in 1952.',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 3 (Electrons and Their Interactions) — two electrons exchanging one photon, then two, and why the diagrams with more junctions contribute smaller arrows.',
    '*The Feynman Lectures on Physics*, Vol. III, ch. 4 (Identical Particles) — why the arrows for swapped identical fermions are subtracted.',
    'R. P. Feynman, "Space-Time Approach to Quantum Electrodynamics", *Physical Review* 76 (1949), and his Nobel lecture, "The Development of the Space-Time View of Quantum Electrodynamics" (1965).'
  ],
  sim: 'qed-diagrams'
},

{
  id: 'magnetic-moment-g2', parent: 'qed-matter', title: 'The electron\'s magnetic moment', level: 3,
  short: 'Dirac\'s theory says the electron is a magnet of strength g = 2 in natural units. QED adds the arrows of the electron emitting and reabsorbing photons: g/2 = 1.001 159 652 18…, and experiment agrees to about twelve significant figures — the most precise test of any theory.',
  keywords: ['magnetic moment', 'g-factor', 'g − 2', 'anomalous magnetic moment', 'Schwinger', 'alpha over 2 pi', 'Penning trap', 'Bohr magneton', 'precision test', 'fine-structure constant', 'muon g−2'],
  prereq: ['feynman-diagrams', 'spin-half', 'physics:electron-spin'],
  related: ['renormalization-idea', 'magnetism-of-matter', 'paramagnetism-nmr', 'hyperfine-21cm', 'three-basic-actions', 'seeking-new-laws'],
  body: `
### A spinning magnet
An electron has spin and charge, so it is a tiny magnet. Its strength, the **magnetic moment**, is written

$$\\mu = \\frac{g}{2}\\,\\mu_B, \\qquad \\mu_B = \\frac{e\\hbar}{2m} = 9.274\\times10^{-24}\\ \\text{J/T}$$

where the Bohr magneton $\\mu_B$ sets the scale and the pure number $g$, the **g-factor**, says how strong a magnet the electron is for its spin. Dirac's relativistic equation for the electron (1928) predicted exactly $g = 2$ — a triumph, since a classical spinning charge would give 1.

### The electron is never alone
In QED the electron interacting with a magnetic field can, on the way, emit a photon and absorb it again. That diagram has two extra junctions, and its arrow changes the answer by a factor $1 + \\alpha/2\\pi$: $g/2 = 1.00116$. Julian Schwinger calculated it in 1947–48, just as Polykarp Kusch and Henry Foley measured a deviation of about that size in atomic spectra. Then come the next orders, with more and more diagrams:

| Term | Diagrams | Contribution to $g/2$ | Running total |
|---|---|---|---|
| Dirac | — | 1 | 1 |
| $\\tfrac12(\\alpha/\\pi)$ | 1 | +0.001 161 409 73 | 1.001 161 409 73 |
| $(\\alpha/\\pi)^2$ | 7 | −0.000 001 772 31 | 1.001 159 637 43 |
| $(\\alpha/\\pi)^3$ | 72 | +0.000 000 014 804 | 1.001 159 652 231 |
| $(\\alpha/\\pi)^4$ | 891 | −0.000 000 000 055 67 | 1.001 159 652 175 3 |
| $(\\alpha/\\pi)^5$ | 12 672 | +0.000 000 000 000 46 | 1.001 159 652 175 8 |
| muon and tau loops, quarks, weak force | many | +0.000 000 000 004 47 | **1.001 159 652 180 25** |
| experiment (2023) | | | **1.001 159 652 180 59** ± 0.000 000 000 000 13 |

(The theory column uses $1/\\alpha = 137.035\\,999\\,206$, measured in 2020 with rubidium atoms.) The terms alternate in sign and shrink by a factor of several hundred each time — a [[?taylor-series|power series]] in the small number $\\alpha/\\pi = 0.00232$. The fifth-order coefficient, about 6.7, required the numerical evaluation of 12 672 diagrams on supercomputers, and its last digits were still being cross-checked in the 2020s. Notice that even this fifth-order term (4.6 × 10⁻¹³) is larger than the experimental uncertainty (1.3 × 10⁻¹³): the experiment really does test it.

### How the magnet is measured
A single electron is held for months in a Penning trap — a vacuum can at a fraction of a kelvin with a strong magnetic field $B$. The electron circles at the cyclotron frequency $f_c = eB/2\\pi m$ (150 GHz at 5.36 T) while its spin turns at $g/2$ times that. If $g$ were exactly 2, spin and orbit would keep step for ever; instead the spin gains on the orbit at the **anomaly frequency** $f_a = a\\,f_c$, with $a = (g-2)/2 = 0.00116$: one extra turn every $1/a \\approx 862$ orbits. Measuring $f_a$ and $f_c$ gives $a$ directly — which is why the quantity quoted is $g - 2$. The simulation shows the spin drifting ahead of the orbit, with the anomaly magnified.

### What the agreement means
When Feynman wrote *QED* in the mid-1980s, theory and experiment for this number already agreed to about ten significant figures, and he used it to show just how well the theory works. Today they agree to about twelve, and the comparison has turned round: the calculation is now limited by how well we know $\\alpha$ itself. Two measurements of $\\alpha$ with atom interferometers (caesium, 2018; rubidium, 2020) disagree with each other by more than their stated errors, and $g - 2$ sits closer to one of them — a puzzle not yet resolved. Any undiscovered particle that couples to electrons would add its own tiny loop, so the agreement also limits what new physics can exist.

> [!key] The simplest correction to Dirac's magnet is one diagram, α/2π. Adding five orders of diagrams and the other particles gives g/2 = 1.001 159 652 180…, matching experiment to about one part in 10¹².

The muon, 207 times heavier, has its own $g - 2$, more sensitive to heavy particles; a long-running tension between its measured and predicted values was largely resolved in 2025, when the final Fermilab measurement and an updated prediction (using lattice calculations for the quark loops) agreed.
`,
  ideas: [
    'The electron is a magnet of moment (g/2)μ_B; Dirac\'s theory gives g = 2.',
    'The electron emitting and reabsorbing a photon changes g/2 by α/2π = 0.00116 (Schwinger).',
    'Higher orders need 7, 72, 891 and 12 672 diagrams; the series in α/π shrinks fast.',
    'A single trapped electron\'s spin gains one turn on its orbit every 1/a ≈ 862 orbits; that measures a = (g − 2)/2.',
    'Theory and experiment agree to about 1 part in 10¹²; the calculation is now limited by our knowledge of α.'
  ],
  pitfalls: [
    'The electron\'s magnetism comes from charge literally spinning like a ball — A classical spinning charge would give g = 1; g ≈ 2 comes from Dirac\'s relativistic quantum theory, and the rest from QED\'s diagrams.',
    'The small corrections are fitted to the experiment — They are calculated from the theory, with only α (measured elsewhere) put in.',
    'Once the first correction is known, the others hardly matter — The experiment is precise to 1.3 × 10⁻¹³, smaller than the fifth-order term.'
  ],
  formulas: [
    {
      name: 'Schwinger\'s correction',
      expr: 'a = alpha/(2*pi)', tex: 'a = \\dfrac{\\alpha}{2\\pi}',
      vars: {
        a: { name: 'anomaly (g − 2)/2, first order', q: 'none' },
        alpha: { name: 'fine-structure constant', q: 'none', value: 0.0072973525693, tex: '\\alpha' }
      },
      note: 'The one-loop diagram: 0.001 161 41. The full series brings it to 0.001 159 652 18.',
      stories: { a: 'With α = {alpha}, what is the first-order anomaly α/2π?', alpha: 'If the first-order anomaly were {a}, what would α be?' }
    },
    {
      name: 'The electron\'s magnetic moment',
      expr: 'mu = g*muB/2', tex: '\\mu = \\dfrac{g}{2}\\,\\mu_B',
      vars: {
        mu: { name: 'magnetic moment', q: 'mdipole', unit: 'J/T', tex: '\\mu' },
        g: { name: 'g-factor', q: 'none', value: 2.00231930436 },
        muB: { const: 'muB' }
      },
      stories: { mu: 'What is the magnetic moment of an electron with g = {g}?', g: 'A particle of spin ½ with the Bohr magneton as its unit has a moment of {mu}. What is its g-factor?' }
    },
    {
      name: 'The anomaly frequency in a Penning trap',
      expr: 'fa = a*qe*B/(2*pi*me)', tex: 'f_a = a\\,\\dfrac{eB}{2\\pi m_e}',
      vars: {
        fa: { name: 'anomaly frequency', q: 'frequency', unit: 'MHz', tex: 'f_a' },
        a: { name: 'anomaly (g − 2)/2', q: 'none', value: 0.00115965218 },
        qe: { const: 'qe' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 5.36 },
        me: { const: 'me' }
      },
      note: 'eB/2πm is the cyclotron frequency (150 GHz at 5.36 T); the spin gains on the orbit at a times it.',
      stories: { fa: 'In a Penning trap with {B}, at what frequency does an electron\'s spin gain on its orbit?', a: 'In {B} the anomaly frequency is measured as {fa}. What is (g − 2)/2?' }
    }
  ],
  examples: [
    {
      title: 'Schwinger\'s number',
      q: 'Compute the first QED correction α/2π and compare g/2 = 1 + α/2π with the measured 1.001 159 652.',
      steps: [
        '$\\alpha/2\\pi = 0.0072973526/6.2831853 = 0.0011614097$.',
        '$1 + \\alpha/2\\pi = 1.0011614$, larger than experiment by $1.76\\times10^{-6}$.',
        'The second-order term, $-0.328\\,(\\alpha/\\pi)^2 = -1.77\\times10^{-6}$, removes almost exactly that difference.'
      ],
      a: 'One diagram gets the first three significant figures of the anomaly; seven more fix the next three.'
    },
    {
      title: 'Watching the spin gain on the orbit',
      q: 'In a 5.36 T trap, find the cyclotron frequency, the anomaly frequency and the number of orbits per extra turn of the spin.',
      steps: [
        '$f_c = eB/2\\pi m = 1.602\\times10^{-19} \\times 5.36/(2\\pi \\times 9.109\\times10^{-31}) = 1.50\\times10^{11}$ Hz.',
        '$f_a = a f_c = 0.00115965 \\times 1.50\\times10^{11} = 1.74\\times10^{8}$ Hz = 174 MHz.',
        'Orbits per extra turn: $f_c/f_a = 1/a = 862$.'
      ],
      a: '150 GHz, 174 MHz, and one extra spin turn every 862 orbits.'
    }
  ],
  quiz: [
    { q: 'What value of g did Dirac\'s theory of the electron predict?', choices: ['exactly 2', 'exactly 1', '2.00232', '1/137'], a: 0, why: 'Dirac\'s equation gives g = 2; QED corrections raise it to 2.00232.' },
    { q: 'What produces the first correction α/2π?', choices: ['the electron emitting and reabsorbing a photon while it interacts with the field', 'the proton\'s magnetic field', 'the electron\'s orbit around the nucleus', 'gravity'], a: 0, why: 'It is the one-loop vertex diagram: an extra photon, two extra junctions.' },
    { q: 'The fifth-order term, (α/π)⁵ × 6.7 ≈ 4.6 × 10⁻¹³, is smaller than the uncertainty of the best measurement.', a: false, why: 'The 2023 measurement is uncertain by 1.3 × 10⁻¹³ in g/2, less than the fifth-order term, so the experiment tests it.' },
    { q: 'About how many orbits does a trapped electron make while its spin gains one full turn on the orbit? (1/a)', answer: 862, why: '1/a = 1/0.00116 ≈ 862.' },
    { q: 'Today the theoretical value of g − 2 is limited mainly by…', choices: ['how precisely α is known', 'the number of diagrams at first order', 'the mass of the electron', 'the speed of light'], a: 0, why: 'The diagrams are computed to more than the needed precision; the input α carries the largest uncertainty, and two measurements of it disagree.' }
  ],
  problems: [
    { q: 'What is the electron\'s magnetic moment in J/T, with g/2 = 1.00115965?', answer: 9.2848e-24, unit: 'J/T', tol: 0.001,
      steps: ['$\\mu = (g/2)\\mu_B = 1.00115965 \\times 9.27401\\times10^{-24}$.', '$= 9.2848\\times10^{-24}$ J/T.'] },
    { q: 'In a 1 T field, what is the anomaly frequency f_a = a eB/2πm, in MHz (a = 0.00115965)?', answer: 32.46, unit: 'MHz', tol: 0.01,
      steps: ['$f_c = eB/2\\pi m = 27.99$ GHz at 1 T.', '$f_a = 0.00115965 \\times 27.99$ GHz $= 32.5$ MHz.'] }
  ],
  applications: [
    'The value of the fine-structure constant: the electron\'s g − 2 combined with QED gives α about as precisely as the best atom-interferometer measurements.',
    'Searches for new particles: any unknown particle coupling to electrons or muons would shift g − 2.',
    'Electron spin resonance and magnetic resonance imaging use the g-factor to find the frequency at which spins flip.'
  ],
  history: 'Kusch and Foley found the electron\'s moment about 0.1 % larger than Dirac\'s value in 1947–48, and Schwinger\'s α/2π (1948) was the first great success of the new QED; Kusch shared the 1955 Nobel Prize with Willis Lamb. The second-order coefficient was settled in 1957 (Charles Sommerfield; André Petermann), the third analytically by Stefano Laporta and Ettore Remiddi in 1996, the fourth to more than a thousand digits by Laporta in 2017, and the fifth numerically by Tatsumi Aoyama, Masashi Hayakawa, Toichiro Kinoshita and Makiko Nio (2012, revised since). Hans Dehmelt\'s single-electron traps (Nobel Prize 1989) began the modern measurements; Gerald Gabrielse\'s group reached 0.28 parts per trillion in 2008 and 0.13 in 2023.',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 1 (Introduction) — the electron\'s magnetic moment as the showpiece of agreement between theory and experiment.',
    '*QED*, ch. 3 (Electrons and Their Interactions) — the diagrams in which the electron emits and absorbs extra photons while interacting with a magnet.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 34 (The Magnetism of Matter) — magnetic moments, angular momentum and the g-factor.'
  ],
  sim: 'qed-g2'
},

{
  id: 'renormalization-idea', parent: 'qed-matter', title: 'Renormalization: taming the infinities', level: 3,
  short: 'Diagrams with loops add arrows for every possible momentum, and the sums come out infinite. The cure: the mass and charge we measure already include the loops, so cut the sums off, express every prediction in the measured values, and the cut-off drops out. Left over is a real effect — the charge of the electron grows as you probe it more closely.',
  keywords: ['renormalization', 'infinities', 'divergence', 'cut-off', 'bare charge', 'bare mass', 'screening', 'vacuum polarization', 'running coupling', 'Landau pole', 'effective theory', 'Wilson'],
  prereq: ['feynman-diagrams', 'magnetic-moment-g2', 'math:logarithms'],
  related: ['electromagnetic-mass', 'beyond-qed', 'three-basic-actions', 'seeking-new-laws', 'feynman-life', 'physics:standard-model'],
  body: `
### Infinite answers
The diagrams with loops brought a crisis. In a loop — an electron emitting and reabsorbing its own photon, or a photon briefly becoming an electron–positron pair — the particles inside can carry any momentum at all, and the arrows for all of them must be added. Those sums grow without limit as the momenta go to [[?infinity]]. The first calculations, in the 1930s, gave infinite corrections to the mass and the charge of the electron. Classical physics had suffered from the same disease: the energy in the field of a point charge is infinite ([[electromagnetic-mass]]).

### We never see a bare electron
The way out, found in 1947–49 by Schwinger, Tomonaga, Feynman and Dyson, building on ideas of Hendrik Kramers and a quick calculation of the Lamb shift by Hans Bethe, rests on a plain observation. The mass and the charge we **measure** are those of an electron that always carries its cloud of loops with it. The "bare" numbers that appear in the equations — the electron's mass and junction number without any loops — are never observed. So:

1. **Cut the sums off** at some very large momentum or energy $\\Lambda$ — equivalently, ignore distances shorter than $\\hbar c/\\Lambda$.
2. **Calculate** the measured mass and charge from the bare ones: both come out depending on $\\Lambda$.
3. **Rewrite** every prediction in terms of the measured mass and charge instead of the bare ones.

In QED, after step 3, $\\Lambda$ **drops out** of every prediction as it is made larger and larger. What is left is finite and agrees with experiment — the Lamb shift, the magnetic moment ([[magnetic-moment-g2]]) and everything else. In the simulation, slide the cut-off over two hundred powers of ten: the bare charge swings wildly, while the predicted strength at any energy you can reach does not move.

### A cloud that screens
The loops leave a real, measurable effect. The vacuum round an electron teems with short-lived pairs; their positive members are drawn slightly towards the electron and their negative ones pushed away, so the cloud partly **screens** its charge, as the molecules of water screen an ion. Probe the electron more closely — with higher energies $Q$ — and you see more of the charge. The coupling therefore **runs** with energy. With electron loops alone, to a first approximation,

$$\\frac{1}{\\alpha(Q)} = \\frac{1}{\\alpha} - \\frac{2}{3\\pi}\\ln\\frac{Q}{m_ec^2}$$

The [[?logarithm]] makes the change slow:

| Energy $Q$ | $1/\\alpha(Q)$, electron loops only |
|---|---|
| below 1 MeV | 137.04 |
| 1 GeV | 135.4 |
| 91 GeV (the Z boson) | 134.5 |
| 1 TeV | 134.0 |
| $1.2\\times10^{19}$ GeV (the Planck energy) | 126.1 |

With the loops of all the other charged particles (muon, tau, quarks) the value at 91 GeV is about 1/128 — as measured at the LEP collider at CERN in the 1990s.

### The Landau pole, and the modern view
Run the formula the other way and ask what bare charge is needed at a cut-off $\\Lambda$ to give the charge we see. The higher $\\Lambda$, the larger it must be, and at $\\Lambda = m_ec^2\\,e^{3\\pi/2\\alpha} \\approx 10^{277}$ GeV it would have to be infinite — the "Landau pole", noticed in the 1950s. That energy is absurdly beyond the Planck energy ($10^{19}$ GeV), where gravity must enter anyway; so QED is best seen as a theory valid up to some enormous energy. Kenneth Wilson in the early 1970s turned this into a principle: physics at low energies is insensitive to the details at very short distances, and a renormalizable theory is one whose predictions need only a few measured numbers. Gerard 't Hooft and Martinus Veltman proved in 1971–72 that the electroweak theory has this property too.

### Feynman's unease
Feynman shared a Nobel Prize for making renormalization work, and yet he never felt comfortable with it. In the last chapter of *QED* he told his audience frankly that the procedure had not been shown to be mathematically sound, and that the theory's success rested on a step nobody could fully justify. Wilson's work later gave it a firmer footing, but the unease was honest: finding a prescription that works is not the same as understanding why.

> [!key] The infinities come from loops at arbitrarily short distances. Measured mass and charge already contain them; write predictions in terms of the measured values, and the cut-off disappears. The screening cloud makes the charge grow slowly at short distances.
`,
  ideas: [
    'Loop diagrams sum arrows over every momentum, and the sums diverge.',
    'The measured mass and charge already include the loops; the bare values are never seen.',
    'Cut the sums off at Λ, express predictions in the measured values, and Λ drops out.',
    'Vacuum polarization screens the charge: α grows slowly with energy (1/137 at low energy, about 1/128 at 91 GeV).',
    'Feynman accepted renormalization because it works, but doubted that it was mathematically sound.'
  ],
  pitfalls: [
    'Renormalization just throws the infinities away — It moves them into quantities we never observe (the bare mass and charge); every observable prediction is finite and independent of the cut-off.',
    'The fine-structure constant is the same at every energy — It runs: the screening cloud makes the effective charge larger at shorter distances.',
    'Because it was once infinite, QED is unreliable — Its predictions, written in measured quantities, agree with experiment to about one part in 10¹².'
  ],
  formulas: [
    {
      name: 'The running of α (electron loops only)',
      expr: '1/aQ = 1/a0 - (2/(3*pi))*ln(Q/Ee)', tex: '\\dfrac{1}{\\alpha_Q} = \\dfrac{1}{\\alpha_0} - \\dfrac{2}{3\\pi}\\ln\\dfrac{Q}{E_e}',
      vars: {
        aQ: { name: 'effective coupling at energy Q', q: 'none', tex: '\\alpha_Q' },
        a0: { name: 'fine-structure constant at low energy', q: 'none', value: 0.0072973525693, tex: '\\alpha_0' },
        Q: { name: 'energy of the probe', q: 'energy', unit: 'GeV', value: 91.19 },
        Ee: { name: 'rest energy of the electron', q: 'energy', unit: 'MeV', value: 0.51099895, tex: 'E_e' }
      },
      solveFor: 'aQ',
      note: 'Leading logarithms, for Q much larger than the electron\'s rest energy. The loops of other charged particles add similar terms above their own rest energies.',
      stories: { aQ: 'With electron loops only, how strong is the electromagnetic coupling when probed at {Q}?', Q: 'At what energy has the coupling grown to {aQ}, with electron loops only?' }
    },
    {
      name: 'Where the bare charge would become infinite (the Landau pole)',
      expr: 'L = Ee*exp(3*pi/(2*a0))', tex: '\\Lambda_L = E_e\\,e^{3\\pi/2\\alpha_0}',
      vars: {
        L: { name: 'Landau energy', q: 'energy', unit: 'GeV', tex: '\\Lambda_L' },
        Ee: { name: 'rest energy of the electron', q: 'energy', unit: 'MeV', value: 0.51099895, tex: 'E_e' },
        a0: { name: 'fine-structure constant at low energy', q: 'none', value: 0.0072973525693, tex: '\\alpha_0' }
      },
      note: 'About 10²⁷⁷ GeV — far beyond the Planck energy of 1.2 × 10¹⁹ GeV.',
      stories: { L: 'With electron loops only, at what cut-off energy would the bare charge have to be infinite?' }
    }
  ],
  examples: [
    {
      title: 'The charge at the Z boson',
      q: 'Using electron loops only, find 1/α at Q = 91.19 GeV.',
      steps: [
        '$\\ln(Q/m_ec^2) = \\ln(91\\,190/0.511) = \\ln(178\\,450) = 12.09$.',
        '$\\frac{2}{3\\pi} \\times 12.09 = 0.2122 \\times 12.09 = 2.57$.',
        '$1/\\alpha(Q) = 137.04 - 2.57 = 134.47$.'
      ],
      a: 'About 1/134.5 with electron loops alone; the muon, tau and quark loops bring the measured value to about 1/128.'
    },
    {
      title: 'How far away is the Landau pole?',
      q: 'Evaluate $\\Lambda_L = m_ec^2\\,e^{3\\pi/2\\alpha}$.',
      steps: [
        '$3\\pi/2\\alpha = 3\\pi \\times 137.036/2 = 645.8$.',
        '$e^{645.8} = 10^{645.8/2.3026} = 10^{280.4}$.',
        'Times $0.511$ MeV $= 5.11\\times10^{-4}$ GeV: $\\Lambda_L \\approx 1.4\\times10^{277}$ GeV.'
      ],
      a: 'About 10²⁷⁷ GeV — 10²⁵⁸ times the Planck energy. Long before that, QED must merge into something else.'
    }
  ],
  quiz: [
    { q: 'Why did the first loop calculations give infinite answers?', choices: ['the arrows for every momentum of the particles in the loop were added, and the sum diverges', 'the electron is infinitely heavy', 'photons travel infinitely far', 'there are infinitely many electrons in the universe'], a: 0, why: 'A loop allows any momentum; the sum over all of them grows without limit.' },
    { q: 'What does renormalization do?', choices: ['writes every prediction in terms of the measured mass and charge, so the cut-off drops out', 'sets all infinite diagrams to zero', 'changes the value of α until the answer fits', 'replaces the electron by a small sphere'], a: 0, why: 'The bare values are never seen; predictions in terms of measured values are finite and independent of Λ.' },
    { q: 'The electron\'s charge appears larger when probed at shorter distances (higher energies).', a: true, why: 'Less of the screening cloud lies between the probe and the electron: α rises from 1/137 to about 1/128 at 91 GeV.' },
    { q: 'With electron loops only, what is 1/α at 91.19 GeV (to one decimal place)?', answer: 134.5, why: '137.04 − (2/3π) ln(91 190/0.511) = 137.04 − 2.57 = 134.47.' },
    { q: 'How did Feynman regard renormalization?', choices: ['as a procedure that works but whose mathematical soundness had not been shown', 'as a complete and rigorous mathematical theory', 'as a mistake that made QED useless', 'as unnecessary, because QED has no infinities'], a: 0, why: 'In *QED* he said frankly that he was uneasy about it, even though its predictions agree superbly with experiment.' }
  ],
  problems: [
    { q: 'Using electron loops only, what is 1/α at Q = 1 TeV (1000 GeV)?', answer: 133.96, tol: 0.002,
      steps: ['$\\ln(10^{6}\\ \\text{MeV}/0.511\\ \\text{MeV}) = 14.49$.', '$137.036 - 0.2122 \\times 14.49 = 133.96$.'] },
    { q: 'At what probe energy, in MeV, does 1/α fall from 137.036 to 136.0 with electron loops only?', answer: 67.4, unit: 'MeV', tol: 0.02,
      steps: ['$\\ln(Q/0.511) = (137.036 - 136.0)/0.2122 = 4.882$.', '$Q = 0.511 \\times e^{4.882} = 0.511 \\times 131.9 = 67.4$ MeV.'] }
  ],
  applications: [
    'The running of the couplings, measured at colliders, is one of the strongest tests of the Standard Model.',
    'Renormalization-group ideas explain the universal behaviour of materials near critical points (Wilson\'s Nobel Prize, 1982).',
    'Effective field theories — describing physics at one scale without knowing the next — are built on the modern view of renormalization.'
  ],
  history: 'J. Robert Oppenheimer found the infinite self-energy of the electron in 1930; Victor Weisskopf showed in 1934–39 that in QED it grows only logarithmically. After the Shelter Island conference (1947), where the Lamb shift was reported, Bethe estimated it with a cut-off, and Schwinger, Tomonaga and Feynman built complete renormalized QED; Dyson argued in 1949 that the infinities can be removed in the same way at every order. Lev Landau and colleagues found the pole in the running coupling in the mid-1950s. Kenneth Wilson\'s renormalization group (early 1970s; Nobel 1982) and the proof by \'t Hooft and Veltman that the electroweak theory is renormalizable (1971–72; Nobel 1999) put the method on a new footing.',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 4 (Loose Ends) — the infinities of the loop diagrams, how the observed charge and mass absorb them, and Feynman\'s frank reservations about renormalization.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 28 (Electromagnetic Mass) — the infinite energy of a point charge in classical electrodynamics, a difficulty that carries over to the quantum theory.',
    'Feynman\'s Nobel lecture, "The Development of the Space-Time View of Quantum Electrodynamics" (1965) — his own account of how the theory was put together.'
  ],
  sim: 'qed-renorm'
},

{
  id: 'beyond-qed', parent: 'qed-matter', title: 'Beyond QED: quarks, gluons and the weak force', level: 2,
  short: 'QED became the template for all of particle physics. Quarks exchange gluons that carry colour and interact with each other, so the strong force grows with distance and confines quarks; W and Z bosons, heavy and short-ranged, carry the weak force that changes one particle into another. What Feynman listed as unknown in 1985 — and what has been learned since.',
  keywords: ['quarks', 'gluons', 'colour', 'QCD', 'strong force', 'confinement', 'asymptotic freedom', 'weak force', 'W boson', 'Z boson', 'beta decay', 'Standard Model', 'Higgs', 'top quark', 'unification', 'running couplings'],
  prereq: ['three-basic-actions', 'feynman-diagrams', 'physics:standard-model'],
  related: ['renormalization-idea', 'parton-model', 'weak-interaction-v-a', 'parity-violation', 'matter-antimatter', 'seeking-new-laws', 'physics:quarks', 'physics:fundamental-forces', 'physics:strong-force'],
  body: `
QED turned out to be the model for the rest of particle physics. Change the particles and the junctions, keep the arrows, and the same scheme — something goes from place to place, something emits or absorbs something else — describes the strong and the weak forces. By the time Feynman gave his QED lectures, this scheme, now called the **Standard Model**, was essentially complete.

### Quarks and gluons
Protons and neutrons are made of **quarks**: the proton of two *up* quarks and a *down* (uud), the neutron of udd, with electric charges $+\\tfrac23$ and $-\\tfrac13$. Quarks also carry a new kind of charge called **colour** (three kinds, whimsically named red, green and blue), and they exchange **gluons** as electrons exchange photons. Two differences change everything:
- gluons carry colour themselves, so gluons emit and absorb gluons — there are junctions with three and four gluons;
- as a result the coupling $\\alpha_s$ behaves the opposite way to $\\alpha$: it is **weak at short distances** and **strong at long ones**. At 91 GeV $\\alpha_s \\approx 0.118$; near 2 GeV it is about 0.3; below 1 GeV the series in powers of $\\alpha_s$ stops making sense.

To first approximation, with $n_f$ kinds of quark light enough to appear in loops,

$$\\alpha_s(Q) = \\frac{12\\pi}{(33 - 2n_f)\\,\\ln(Q^2/\\Lambda^2)}$$

— a [[?logarithm]] again, but now in the denominator, so $\\alpha_s$ falls as the energy rises (**asymptotic freedom**, found in 1973 by David Gross, Frank Wilczek and David Politzer). Pull two quarks apart and the energy in the gluon field between them grows until it makes new quark pairs: quarks are never seen alone (**confinement**). In high-energy collisions, though, quarks and gluons behave almost like free particles — Feynman's partons ([[parton-model]]).

### The weak force
The weak force changes one kind of particle into another. In beta decay a down quark turns into an up quark by emitting a $W^-$, which becomes an electron and an antineutrino: a neutron becomes a proton. Its carriers, the $W^\\pm$ (80.4 GeV) and the $Z$ (91.2 GeV), are heavy, so they can only be "borrowed" over a range

$$R \\approx \\frac{\\hbar c}{Mc^2} \\approx 2.5\\times10^{-18}\\ \\text{m}$$

— about a three-hundredth of a proton's radius, which is why the force looks feeble at low energies. It also distinguishes left from right ([[parity-violation]], [[weak-interaction-v-a]]). Sheldon Glashow, Steven Weinberg and Abdus Salam combined it with electromagnetism (Nobel Prize 1979); the W and Z were found at CERN in 1983.

### What was unknown in 1985 — and since
Feynman ended *QED* with a frank survey of loose ends. He stressed that nobody could explain the numbers the theory needs — the masses of the particles, and the strengths of the couplings, 1/137 among them — and that calculations with quarks and gluons were still much too hard to test that theory as sharply as QED had been tested. Here is what has changed since, and what has not:

| Open in 1985 | Since then |
|---|---|
| a sixth quark was expected but not found | the top quark, found at Fermilab in 1995 (about 173 GeV) |
| how many families of particles? | three light neutrinos, from the width of the Z (LEP and SLC, 1989) |
| can the quark theory be calculated at low energies? | lattice QCD computes the masses of the proton and its relatives to within a few per cent (2008), and better since |
| do neutrinos have mass? | yes: neutrino oscillations (Super-Kamiokande 1998, SNO 2001) |
| the Higgs particle, needed to give W, Z and fermions mass | found at CERN in 2012 (125 GeV) |
| why 1/137? why these masses? why three families? | still unknown |
| a quantum theory of gravity; what dark matter is | still unknown |

The graph in the simulation shows the three couplings of the Standard Model running with energy: the strong one falls, the others creep together, and all three nearly — but not exactly — meet somewhere between $10^{13}$ and $10^{17}$ GeV, a hint that some think points to a deeper unification.

> [!key] The strong and weak forces follow QED's pattern: particles, junctions, arrows. What the pattern does not supply are its own numbers — the masses and couplings — which are still measured, not explained.
`,
  ideas: [
    'Quarks carry colour and exchange gluons; gluons carry colour too and couple to each other.',
    'The strong coupling falls at high energy (asymptotic freedom) and grows at low energy, confining quarks.',
    'The weak force changes particles (d → u + W⁻ in beta decay); its heavy carriers give it a range of about 10⁻¹⁸ m.',
    'Since 1985: the top quark, three families, lattice QCD, neutrino masses and the Higgs boson.',
    'Still unexplained: the values of the masses and couplings, and how gravity fits in.'
  ],
  pitfalls: [
    'Gluons are just heavy photons for quarks — Gluons are massless like photons, but they carry colour and interact with one another, which makes the strong force behave in the opposite way to electromagnetism.',
    'The weak force is weak because its coupling is small — Its coupling is actually larger than electromagnetism\'s; it looks weak at low energy because the W and Z are so heavy.',
    'The Standard Model explains the masses of the particles — It accommodates them through the Higgs field, but each mass is still a number put in from experiment.'
  ],
  formulas: [
    {
      name: 'The strong coupling runs (one loop)',
      expr: 'as = 12*pi/((33 - 2*nf)*ln(Q^2/L^2))', tex: '\\alpha_s = \\dfrac{12\\pi}{(33 - 2n_f)\\ln(Q^2/\\Lambda^2)}',
      vars: {
        as: { name: 'strong coupling', q: 'none', tex: '\\alpha_s' },
        nf: { name: 'kinds of quark active in loops', q: 'none', value: 5, int: true, tex: 'n_f' },
        Q: { name: 'energy of the probe', q: 'energy', unit: 'GeV', value: 91.19 },
        L: { name: 'QCD scale (one loop, five flavours)', q: 'energy', unit: 'GeV', value: 0.088, tex: '\\Lambda' }
      },
      solveFor: 'as',
      note: 'Valid well above Λ. With Λ = 0.088 GeV it gives the measured α_s = 0.118 at the Z mass.',
      stories: { as: 'With {nf} active quarks and Λ = {L}, what is the strong coupling at {Q}?', Q: 'At what energy has the strong coupling fallen to {as} (with {nf} quarks and Λ = {L})?' }
    },
    {
      name: 'Range of a force carried by a heavy particle',
      expr: 'R = hbar*c/E', tex: 'R = \\dfrac{\\hbar c}{E}',
      vars: {
        R: { name: 'range', q: 'length', unit: 'fm' },
        hbar: { const: 'hbar' },
        c: { const: 'c' },
        E: { name: 'rest energy of the carrier, Mc²', q: 'energy', unit: 'GeV', value: 80.37 }
      },
      note: 'ħc = 197.3 MeV·fm. For the W, 0.0025 fm; for a pion (0.14 GeV), 1.4 fm — the range of the nuclear force.',
      stories: { R: 'A force is carried by a particle of rest energy {E}. Roughly how far does it reach?', E: 'A force reaches about {R}. What is the rest energy of its carrier?' }
    }
  ],
  examples: [
    {
      title: 'The strong coupling at 10 GeV',
      q: 'With $n_f = 5$ and $\\Lambda = 0.088$ GeV, find $\\alpha_s$ at 91.19 GeV and at 10 GeV.',
      steps: [
        'At 91.19 GeV: $\\ln(91.19^2/0.088^2) = 2\\ln 1036 = 13.89$; $\\alpha_s = 37.70/(23 \\times 13.89) = 0.118$.',
        'At 10 GeV: $2\\ln(10/0.088) = 2 \\times 4.733 = 9.466$; $\\alpha_s = 37.70/(23 \\times 9.466) = 0.173$.'
      ],
      a: '0.118 and 0.173 (measured: about 0.18 at 10 GeV) — the strong force weakens as the energy rises.'
    },
    {
      title: 'How short is the weak force?',
      q: 'Estimate the range of the force carried by the W boson (80.4 GeV) and compare it with the proton\'s radius, 0.84 fm.',
      steps: [
        '$R = \\hbar c/Mc^2 = 197.3\\ \\text{MeV·fm}/80\\,400\\ \\text{MeV} = 0.00245$ fm $= 2.5\\times10^{-18}$ m.',
        'Ratio: $0.84/0.00245 \\approx 340$.'
      ],
      a: 'About 2.5 × 10⁻¹⁸ m — some 340 times smaller than a proton.'
    }
  ],
  quiz: [
    { q: 'What makes gluons behave so differently from photons?', choices: ['they carry colour charge, so they emit and absorb each other', 'they are much heavier than photons', 'they travel slower than light', 'they only exist inside nuclei'], a: 0, why: 'Photons carry no electric charge; gluons carry colour, so there are junctions with three and four gluons.' },
    { q: 'Which coupling gets weaker as the energy of the probe rises?', choices: ['the strong coupling α_s', 'the electromagnetic α', 'both', 'neither'], a: 0, why: 'Asymptotic freedom: α_s falls with energy, while α grows slowly because of screening.' },
    { q: 'In beta decay a down quark becomes an up quark by emitting a W⁻ boson.', a: true, why: 'The W⁻ then becomes an electron and an antineutrino; the neutron (udd) becomes a proton (uud).' },
    { q: 'Roughly what is the range of the force carried by the Z boson (91.19 GeV), in metres?', answer: 2.16e-18, unit: 'm', why: 'ħc/Mc² = 197.3 MeV·fm / 91 190 MeV = 0.00216 fm.' },
    { q: 'Which of these was still missing in 1985 and has been found since?', choices: ['the top quark', 'the electron', 'the photon', 'the neutron'], a: 0, why: 'The sixth quark was found at Fermilab in 1995; the Higgs boson followed in 2012.' }
  ],
  problems: [
    { q: 'With n_f = 5 and Λ = 0.088 GeV, what is α_s at 10 GeV (one loop)?', answer: 0.173, tol: 0.02,
      steps: ['$\\ln(Q^2/\\Lambda^2) = 2\\ln(113.6) = 9.466$.', '$\\alpha_s = 12\\pi/(23 \\times 9.466) = 0.173$.'] },
    { q: 'The nuclear force between protons and neutrons is carried mainly by pions (rest energy 0.14 GeV). Estimate its range in femtometres.', answer: 1.41, unit: 'fm', tol: 0.03,
      steps: ['$R = \\hbar c/E = 197.3\\ \\text{MeV·fm}/140\\ \\text{MeV}$.', '$= 1.41$ fm — about the size of a nucleon, as Yukawa predicted in 1935.'] }
  ],
  applications: [
    'Beta decay and the fusion reactions that power the Sun run on the weak force.',
    'Most of the mass of ordinary matter is the energy of quarks and gluons confined inside protons and neutrons, computed today with lattice QCD.',
    'Collider experiments search for particles beyond the Standard Model by the loops and diagrams they would add.'
  ],
  history: 'Murray Gell-Mann and George Zweig proposed quarks in 1964; electron-scattering experiments at SLAC (1968) found point-like constituents inside the proton, which Feynman called partons (1969). Colour and quantum chromodynamics took shape in 1972–73 with asymptotic freedom (Nobel 2004); gluons were seen in three-jet events at DESY in 1979. Glashow, Weinberg and Salam\'s electroweak theory (Nobel 1979) was confirmed by the discovery of neutral currents (CERN, 1973) and of the W and Z (CERN, 1983; Nobel 1984 for Carlo Rubbia and Simon van der Meer). The top quark followed in 1995 and the Higgs boson in 2012 (Nobel 2013 for François Englert and Peter Higgs).',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 4 (Loose Ends) — other particles, quarks and gluons, the weak interaction with its W and Z, and what remained unexplained in the mid-1980s.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 2 (Basic Physics) — the particles and forces as they were known in 1961, a snapshot to compare with today.',
    'R. P. Feynman, "Very High-Energy Collisions of Hadrons", *Physical Review Letters* 23 (1969) — the parton picture of the proton.'
  ],
  sim: 'qed-beyond'
}

);
