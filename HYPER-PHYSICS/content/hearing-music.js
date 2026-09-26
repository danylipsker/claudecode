/* HYPER-PHYSICS · content/hearing-music.js — how the ear hears, what loudness and
 * pitch are, where timbre comes from, how scales are built and how instruments
 * make their notes. */
Hyper.add(

{
  id: 'the-ear', parent: 'hearing-music', title: 'The ear', level: 1,
  short: 'The ear turns tiny pressure waves into nerve signals in three stages: the outer ear collects and funnels sound, the middle ear passes it into the fluid of the inner ear, and the cochlea sorts it by frequency.',
  keywords: ['ear', 'hearing', 'eardrum', 'tympanic membrane', 'ossicles', 'hammer anvil stirrup', 'malleus incus stapes', 'cochlea', 'basilar membrane', 'hair cells', 'hearing range', 'hearing loss', 'impedance matching', 'oval window', 'presbycusis', 'noise exposure', 'tinnitus'],
  prereq: ['sound-intensity', 'pressure', 'wave-reflection'],
  related: ['loudness-pitch', 'air-columns', 'the-eye', 'ultrasound', 'harmonics-timbre'],
  body: `
A young, healthy ear hears from about 20 Hz to 20 kHz and over a range of intensities of $10^{12}$ ([[sound-intensity]]). At the threshold of hearing the eardrum moves by about $10^{-11}$ m — a tenth of the diameter of an atom. Three stages make this possible.

### The outer ear: collector and resonator
The folds of the **pinna** reflect sound into the ear canal in a way that depends on the direction it comes from, which helps us tell front from back and up from down. The **ear canal**, about 2.5 cm long and closed at its inner end by the eardrum, is a pipe closed at one end ([[air-columns]]). Its quarter-wave resonance, $f = v/4L \\approx 3.4$ kHz, boosts sounds between about 2 and 5 kHz by 10–15 dB — the range of many consonants, and where we hear best.

### The middle ear: an impedance matcher
The inner ear is filled with fluid, and sound in air hitting a fluid is almost entirely reflected: only about 0.1% of the power would get in ([[wave-reflection]]). The middle ear solves this. The **eardrum** (an effective area of about 55 mm²) collects the force of the sound and passes it through three tiny bones — the **malleus, incus and stapes** (hammer, anvil and stirrup) — to the **oval window** of the inner ear, only about 3.2 mm² in area. The same force on a much smaller area means a larger pressure, and the bones add a lever advantage of about 1.3:

$$G = \\frac{A_\\text{drum}}{A_\\text{oval}} \\times 1.3 \\approx \\frac{55}{3.2} \\times 1.3 \\approx 22$$

— a pressure gain of about 27 dB, recovering most of the 30 dB an air–fluid boundary would lose. Two small muscles stiffen the chain of bones in response to loud sounds (the acoustic reflex), but they react too slowly to protect against a sudden bang. The Eustachian tube lets air into the middle ear to balance the pressure on both sides of the eardrum — the "pop" on a descending aircraft.

### The inner ear: a frequency analyser
The **cochlea** is a fluid-filled tube about 35 mm long, coiled two and a half times like a snail shell. Along it runs the **basilar membrane**: narrow and stiff near the base, by the oval window, and wide and floppy at the far end, the apex. A tone launches a travelling wave along the membrane that grows, peaks and dies away at a place that depends on its frequency — high frequencies near the base, low frequencies near the apex. Each place is thus tuned to a frequency, and a complex sound is spread out along the membrane into its component frequencies, much as a [[math:fourier-series|Fourier series]] would split it ([[harmonics-timbre]]).

About 3500 **inner hair cells** turn the motion into nerve signals. About 12 000 **outer hair cells** act as tiny motors that amplify faint vibrations and sharpen the tuning — so actively that a healthy cochlea emits faint sounds of its own, which are recorded to screen newborn babies' hearing.

### Damage
Hair cells do not grow back. Loud sound kills them gradually: a common workplace limit is 85 dB for 8 hours a day, with the allowed time halving for every 3 dB more. With age the highest frequencies go first (presbycusis): many adults over fifty hear little above 12–14 kHz.
`,
  ideas: [
    'The outer ear collects sound; the ear canal resonates near 3 kHz, where we hear best.',
    'The middle ear\'s eardrum and three small bones act as an impedance matcher, raising the pressure about twentyfold so sound can enter the fluid of the inner ear.',
    'In the cochlea each frequency makes the basilar membrane vibrate most at its own place: high near the base, low near the apex.',
    'Hair cells turn motion into nerve signals and do not grow back once destroyed by noise or age.'
  ],
  pitfalls: [
    'The middle-ear bones amplify the energy of sound — They add no energy. They trade force over a large area for the same force on a small area, raising the pressure so that the energy enters the fluid instead of being reflected.',
    'Only very loud, sudden sounds damage hearing — Long exposure to moderately loud sound (a noisy workplace, earphones turned up) does the same damage more slowly.'
  ],
  formulas: [
    {
      name: 'Pressure gain of the middle ear',
      expr: 'G = A1/A2*r', tex: 'G = \\frac{A_1}{A_2}\\, r',
      vars: {
        G: { name: 'pressure gain' },
        A1: { name: 'effective area of the eardrum', q: 'area', unit: 'mm²', value: 55 },
        A2: { name: 'area of the oval window', q: 'area', unit: 'mm²', value: 3.2 },
        r: { name: 'lever ratio of the ossicles', value: 1.3 }
      },
      note: 'In decibels the gain is $20\\log_{10} G$: about 27 dB for $G = 22$.',
      stories: { G: 'An eardrum of effective area {A1} drives an oval window of {A2} through bones with a lever ratio of {r}. By what factor is the pressure raised?' }
    },
    {
      name: 'Resonance of the ear canal',
      expr: 'f = v/(4*L)', tex: 'f = \\frac{v}{4L}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'Hz' },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 },
        L: { name: 'length of the ear canal', q: 'length', unit: 'cm', value: 2.5 }
      },
      practice: { unknowns: ['f', 'L'] },
      note: 'A tube closed at one end (by the eardrum): a quarter-wave resonator.',
      stories: { f: 'An ear canal is {L} long. Treating it as a tube closed at one end, at what frequency does it resonate (sound at {v})?' }
    },
    {
      name: 'Safe daily exposure time (85 dB, 3 dB rule)',
      expr: 't = t0*2^((L0 - L)/3)', tex: 't = t_0 \\cdot 2^{(L_0 - L)/3}',
      vars: {
        t: { name: 'allowed exposure per day', q: 'time', unit: 'h' },
        t0: { name: 'allowed time at the reference level', q: 'time', unit: 'h', value: 8, min: 1, max: 8 },
        L0: { name: 'reference level', q: 'soundlevel', unit: 'dB', value: 85, min: 80, max: 90 },
        L: { name: 'sound level', q: 'soundlevel', unit: 'dB', value: 94, min: 60, max: 140 }
      },
      note: 'The widely recommended 85 dB(A) for 8 hours with a 3 dB exchange rate: every extra 3 dB doubles the sound energy received, so the time halves. Some regulations use 90 dB with a 5 dB rate instead.',
      practice: { unknowns: ['t', 'L'] },
      stories: { t: 'Under a rule allowing {t0} at {L0}, with the time halving for every 3 dB more, how long a day can a worker safely spend in {L}?', L: 'A worker is exposed for {t} a day. Under a rule allowing {t0} at {L0}, with the time halving for every 3 dB more, what is the highest level allowed?' }
    }
  ],
  examples: [
    {
      title: 'The middle ear\'s gain in decibels',
      q: 'The eardrum\'s effective area is 55 mm², the oval window\'s 3.2 mm², and the ossicles add a lever ratio of 1.3. What pressure gain does the middle ear give, in decibels?',
      steps: [
        '$G = (55/3.2) \\times 1.3 = 17.2 \\times 1.3 = 22.3$.',
        'Pressure is an amplitude, so in decibels: $20\\log_{10} 22.3 = 27$ dB.',
        'A bare air–water boundary loses about 30 dB ([[wave-reflection]]); the middle ear wins most of it back.'
      ],
      a: 'A factor of about 22, or 27 dB.'
    },
    {
      title: 'How long at a concert?',
      q: 'Near the stage a concert reaches 100 dB. Under the 85 dB / 8 h rule with a 3 dB exchange rate, how long is safe? What if earplugs cut the level by 20 dB?',
      steps: [
        '100 dB is 15 dB above 85 dB: five halvings. $t = 8\\ \\mathrm{h} / 2^5 = 0.25$ h, just 15 minutes.',
        'With earplugs, 80 dB is 5 dB below the reference: $t = 8 \\times 2^{5/3} = 25$ h — no limit for one evening.'
      ],
      a: '15 minutes without protection; effectively unlimited with 20 dB earplugs.'
    }
  ],
  quiz: [
    { q: 'Without the middle ear, sound would have to pass straight from air into the fluid of the inner ear. Roughly what fraction of its energy would get in?', choices: ['About 99%', 'About 50%', 'About 0.1%', 'None at all'], a: 2,
      why: 'Air and water differ in acoustic impedance by a factor of about 3600, so only about 0.1% of the power crosses the boundary.' },
    { q: 'Where on the basilar membrane do high-pitched sounds make the largest vibration?', choices: ['Near the base, by the oval window', 'Near the apex, at the far end', 'Evenly along its length', 'In the ear canal'], a: 0,
      why: 'The membrane is narrow and stiff near the base, which tunes that end to high frequencies.' },
    { q: 'We are especially sensitive to sounds around 3 kHz partly because…', choices: ['the eardrum is tuned to 3 kHz', 'the ear canal resonates like a pipe closed at one end', 'the cochlea is 3 cm long', 'speech is always at 3 kHz'], a: 1,
      why: 'A 2.5 cm canal closed by the eardrum has its quarter-wave resonance near 3.4 kHz.' },
    { q: 'A worker is exposed to 91 dB. Under the 85 dB / 8 h rule with a 3 dB exchange rate, the safe daily time is…', choices: ['8 h', '4 h', '2 h', '1 h'], a: 2,
      why: '91 dB is 6 dB over the reference: two halvings of 8 h.' }
  ],
  applications: [
    'Hearing aids, and cochlear implants that stimulate the auditory nerve directly with electrodes placed along the cochlea.',
    'Newborn hearing screening by recording the faint sounds a healthy cochlea emits.',
    'Workplace noise limits and the design of hearing protection.'
  ],
  history: 'Georg von Békésy showed, by watching the basilar membranes of cochleas from cadavers under a microscope, that each frequency peaks at its own place along the membrane. He received the Nobel Prize in Physiology or Medicine in 1961.'
},

{
  id: 'loudness-pitch', parent: 'hearing-music', title: 'Loudness and pitch', level: 2,
  short: 'Loudness and pitch are what we perceive; intensity and frequency are what we measure. They are linked, but not simply: the ear works on logarithmic scales and is far more sensitive at some frequencies than at others.',
  keywords: ['loudness', 'pitch', 'phon', 'sone', 'equal-loudness contours', 'A-weighting', 'dB(A)', 'octave', 'just noticeable difference', 'missing fundamental', 'psychoacoustics', 'frequency range', 'sound localisation'],
  prereq: ['the-ear', 'sound-intensity', 'wave-properties'],
  related: ['harmonics-timbre', 'musical-scales', 'beats', 'math:logarithmic-scales'],
  body: `
A sound level meter measures intensity in decibels and a frequency counter measures hertz. Your brain reports something else: **loudness** and **pitch**. The study of how the two sides relate is psychoacoustics.

### Loudness
The ear's sensitivity depends strongly on frequency. At a moderate level a 100 Hz tone needs about 25 dB more intensity than a 1 kHz tone to sound equally loud, and a 50 Hz tone nearly 40 dB more, while tones around 3–4 kHz need slightly less (the ear-canal resonance helps — [[the-ear]]). Curves joining equally loud tones across the frequency range are **equal-loudness contours**, and they are labelled in **phons**: a sound has a loudness level of $P$ phons if it is as loud as a 1 kHz tone of $P$ dB. The contours flatten at high levels, so music played quietly sounds thin in the bass — the reason for the "loudness" button on old amplifiers.

How much louder does a sound *seem*? Listening tests give a simple rule above about 40 phons: every 10 phons more sounds **twice as loud**. On the **sone** scale, where 40 phons is 1 sone,

$$S = 2^{(P - 40)/10}$$

Since 10 dB is ten times the intensity, ten violins sound only about twice as loud as one. The smallest change of level most people notice is about 1 dB.

Sound level meters imitate the ear's weak bass with **A-weighting**, giving levels in dB(A); noise regulations are written that way.

### Pitch
Pitch follows frequency — but **logarithmically**: equal *ratios* of frequency sound like equal steps. Doubling the frequency always sounds like the same step, an **octave**, whether from 110 to 220 Hz or from 1760 to 3520 Hz. Human hearing, 20 Hz to 20 kHz, spans about ten octaves. Under good conditions we can tell apart two tones about 0.3% apart in frequency — some 3 Hz at 1 kHz.

The pitch of a musical note is the pitch of its **fundamental** — even when the fundamental is not there. Play harmonics at 400, 600, 800 and 1000 Hz and you hear a pitch of 200 Hz: the brain infers the fundamental from the spacing of the harmonics and from the rate at which the waveform repeats. This **missing fundamental** is why a telephone, which passes only about 300–3400 Hz, still conveys the pitch of a voice whose fundamental is near 110 Hz, and why small loudspeakers seem to play bass notes they cannot actually produce. Try it in the simulation.

### Where a sound comes from
With two ears we locate sounds by comparing them. A sound from one side reaches the far ear up to about 0.65 ms later (the interaural time difference), and for high frequencies the head casts an acoustic shadow that makes it quieter there. The brain resolves time differences of around ten microseconds — enough to place a source to within a degree or two straight ahead.
`,
  ideas: [
    'Pitch follows frequency on a logarithmic scale: each doubling of frequency is heard as the same step, an octave.',
    'Loudness follows intensity roughly logarithmically: about +10 dB sounds twice as loud.',
    'The ear is most sensitive between about 2 and 5 kHz and much less sensitive to low bass, especially at low levels.',
    'The pitch of a musical tone is set by its fundamental, which the brain infers from the harmonics even when it is missing.'
  ],
  pitfalls: [
    'Twice the intensity sounds twice as loud — Doubling the intensity adds only 3 dB, a small but clear step; it takes about ten times the intensity (+10 dB) to sound twice as loud.',
    'Equal decibels mean equal loudness at every frequency — A 60 Hz hum at 40 dB is barely audible, while a 3 kHz tone at 40 dB is plainly heard.',
    'Pitch and frequency are the same thing — Frequency is a measurement; pitch is a perception. For simple tones they track closely, but the missing fundamental shows they can differ.'
  ],
  formulas: [
    {
      name: 'Loudness in sones from loudness level in phons',
      expr: 'S = 2^((P - 40)/10)', tex: 'S = 2^{(P - 40)/10}',
      vars: {
        S: { name: 'loudness', unit: 'sone' },
        P: { name: 'loudness level', unit: 'phon', value: 60 }
      },
      note: 'A good approximation above about 40 phons. For a 1 kHz tone the phon value equals the level in dB.',
      stories: { S: 'A sound has a loudness level of {P}. How loud is it in sones — how many times louder than a 40 phon sound?', P: 'A sound seems {S} — that many times as loud as a 40 phon reference. What is its loudness level?' }
    },
    {
      name: 'Octaves between two frequencies',
      expr: 'N = log2(f2/f1)', tex: 'N = \\log_2\\frac{f_2}{f_1}',
      vars: {
        N: { name: 'number of octaves' },
        f2: { name: 'upper frequency', q: 'frequency', unit: 'Hz', value: 20000 },
        f1: { name: 'lower frequency', q: 'frequency', unit: 'Hz', value: 20 }
      },
      practice: { unknowns: ['N', 'f2'] },
      stories: { N: 'How many octaves are there from {f1} to {f2}?', f2: 'What frequency lies {N} octaves above {f1}?' }
    },
    {
      name: 'Arrival-time difference between the two ears',
      expr: 'dt = d*sin(theta)/v', tex: '\\Delta t = \\frac{d\\sin\\theta}{v}',
      vars: {
        dt: { name: 'interaural time difference', q: 'time', unit: 'µs', tex: '\\Delta t' },
        d: { name: 'distance between the ears', q: 'length', unit: 'cm', value: 18 },
        theta: { name: 'direction of the source from straight ahead', q: 'angle', unit: '°', value: 30, min: 0, max: 90 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 }
      },
      practice: { unknowns: ['dt', 'theta'] },
      note: 'The simplest model, treating the ears as two points in open air. Sound bending round the head makes real differences a little larger, up to about 0.65 ms.',
      stories: { dt: 'A sound comes from {theta} to one side of straight ahead. With ears {d} apart and sound at {v}, how much earlier does it reach the nearer ear?', theta: 'A sound reaches one ear {dt} before the other. With ears {d} apart and sound at {v}, how far to the side is its source?' }
    }
  ],
  examples: [
    {
      title: 'Ten violins',
      q: 'One violin produces a loudness level of 70 phons at a listener. Roughly how loud do ten equal violins sound, compared with one?',
      steps: [
        'Ten violins give ten times the intensity: +10 dB, so about 80 phons.',
        'In sones: one violin $2^{(70-40)/10} = 8$ sones; ten violins $2^{(80-40)/10} = 16$ sones.',
        'Ten times the players, twice the loudness.'
      ],
      a: 'About twice as loud (16 sones against 8).'
    },
    {
      title: 'A voice on the telephone',
      q: 'A man speaks with a fundamental of 110 Hz. A telephone line passes only about 300–3400 Hz. Which harmonics get through, and what pitch does the listener hear?',
      steps: [
        'Harmonics sit at $n \\times 110$ Hz. Those within the band are $n = 3$ (330 Hz) up to $n = 30$ (3300 Hz).',
        'The fundamental and the second harmonic are gone.',
        'The remaining harmonics are spaced 110 Hz apart and the waveform still repeats 110 times a second, so the brain hears a pitch of 110 Hz: the missing fundamental.'
      ],
      a: 'Harmonics 3 to 30 pass; the pitch heard is still 110 Hz.'
    }
  ],
  quiz: [
    { q: 'An amplifier\'s output is doubled from 50 W to 100 W. The music sounds…', choices: ['twice as loud', 'slightly louder (+3 dB)', 'ten times as loud', 'no different'], a: 1,
      why: 'Twice the power is +3 dB — a noticeable but modest step. Twice as loud needs about +10 dB, ten times the power.' },
    { q: 'Human hearing, from 20 Hz to 20 kHz, spans roughly how many octaves?', choices: ['3', '6', '10', '20'], a: 2,
      why: '20 000/20 = 1000 ≈ 2¹⁰.' },
    { q: 'Harmonics at 400, 600, 800 and 1000 Hz are played together, with nothing at 200 Hz. The pitch heard is closest to…', choices: ['200 Hz', '400 Hz', '600 Hz', '1000 Hz'], a: 0,
      why: 'They are harmonics 2 to 5 of 200 Hz, and the combined wave repeats 200 times a second: the missing fundamental.' },
    { q: 'Two tones at the same sound level, 30 dB, one at 60 Hz and one at 3 kHz, sound equally loud.', a: false,
      why: 'The ear is far less sensitive at 60 Hz: 30 dB there is close to inaudible, while 30 dB at 3 kHz is clearly heard.' }
  ],
  applications: [
    'Loudness-compensated volume controls boost the bass at low volume to make up for the ear\'s weak bass sensitivity.',
    'Noise limits use A-weighted decibels, dB(A), to follow the ear.',
    'Audio compression (MP3, AAC) throws away components the ear cannot perceive next to louder ones.',
    'Small speakers and telephones rely on the missing fundamental to convey bass notes and voice pitch.'
  ],
  sim: { id: 'sound-fourier', params: { preset: 'missing' } }
},

{
  id: 'harmonics-timbre', parent: 'hearing-music', title: 'Harmonics and timbre', level: 2,
  short: 'A note from an instrument is a blend of a fundamental and its harmonics. The recipe — how strong each harmonic is, and how the sound starts and dies away — is what makes a flute and a violin sound different on the same pitch.',
  keywords: ['harmonics', 'overtones', 'partials', 'timbre', 'tone colour', 'Fourier', 'Fourier series', 'spectrum', 'fundamental', 'square wave', 'sawtooth', 'waveform', 'envelope', 'attack', 'inharmonicity', 'formant'],
  prereq: ['standing-waves', 'loudness-pitch', 'math:fourier-series'],
  related: ['air-columns', 'musical-instruments', 'superposition', 'the-ear'],
  body: `
A flute, an oboe and a violin play the same A (440 Hz) equally loudly, and you can still tell them apart with your eyes closed. What differs is their **timbre**, or tone colour.

### Harmonics
A plucked string or a blown pipe does not vibrate in just one of its [[standing-waves|normal modes]]; it vibrates in many at once. Along with the fundamental $f_1$ come the **harmonics** $2f_1, 3f_1, 4f_1, \\dots$ (the modes above the fundamental are also called overtones). Whatever the mixture, the combined wave repeats every $1/f_1$, so the pitch stays that of the fundamental ([[loudness-pitch]]); the mixture sets the shape of the wave and the colour of the sound.

### Fourier's theorem
Any periodic wave, however jagged, is a sum of sine waves at its fundamental frequency and whole-number multiples of it:

$$y(t) = \\sum_{n=1}^{\\infty} A_n \\sin(2\\pi n f_1 t + \\varphi_n)$$

The list of amplitudes $A_n$ is the sound's **spectrum** ([[math:fourier-series|Fourier series]]). The cochlea performs this breakdown mechanically, each place on the basilar membrane responding to one frequency ([[the-ear]]). The ear is largely deaf to the phases $\\varphi_n$: shift the harmonics against each other and the waveform changes shape a great deal, while the sound hardly changes.

| Waveform | Harmonics present | Their amplitudes | Sound |
|---|---|---|---|
| Sine | 1st only | — | pure, dull, like a whistle |
| Square | odd only | 1/n | hollow, like a clarinet |
| Sawtooth | all | 1/n | bright, buzzy, like a bowed string or brass |
| Triangle | odd only | 1/n² | soft, like a flute |

### Where the recipe comes from
- **How the vibration is started.** A string plucked at its midpoint cannot vibrate in the even modes, which all have a node there: its sound lacks harmonics 2, 4, 6 and is hollow. Plucked near the bridge it is bright, full of high harmonics. A hard pick or hammer excites more high harmonics than a soft thumb or a felt.
- **The shape of the resonator.** A pipe closed at one end has only odd harmonics ([[air-columns]]).
- **Resonances of the body.** A violin's wooden body or a singer's vocal tract boosts whichever harmonics fall in certain frequency bands, called **formants**, whatever the note. Formants are why an "ah" is recognisable whether sung high or low.

### Beyond the spectrum
How a sound begins and ends matters as much as its steady spectrum. Cut the first fraction of a second from a recorded piano note and it becomes hard to identify; play it backwards and it sounds like a harmonium. Some instruments also have overtones that are **not** whole-number multiples — bells, drums, and to a small degree stiff piano strings, whose overtones run slightly sharp ([[musical-instruments]]).
`,
  ideas: [
    'A musical note is a fundamental plus harmonics at whole-number multiples of it.',
    'By Fourier\'s theorem, any periodic wave is a sum of sine waves at the fundamental and its harmonics.',
    'The pitch is set by the fundamental (the repetition rate); the timbre by the relative strengths of the harmonics and by how the sound starts and decays.',
    'How an instrument is excited and shaped — where a string is plucked, whether a pipe is closed — decides which harmonics are strong.'
  ],
  pitfalls: [
    'Adding harmonics raises the pitch — The wave still repeats at the fundamental\'s rate, so the pitch stays; only the tone colour changes.',
    'Harmonic number and overtone number are the same — For a string or open pipe the first overtone is the second harmonic. For a closed pipe the first overtone is the third harmonic.',
    'Two instruments with the same spectrum sound the same — The attack and decay matter as much: a piano note played backwards no longer sounds like a piano.'
  ],
  formulas: [
    {
      name: 'Frequency of the nth harmonic',
      expr: 'fn = n*f1', tex: 'f_n = n f_1',
      vars: {
        fn: { name: 'frequency of the nth harmonic', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 3 },
        f1: { name: 'fundamental frequency', q: 'frequency', unit: 'Hz', value: 220 }
      },
      stories: { fn: 'What is the frequency of harmonic {n} of a note whose fundamental is {f1}?', n: 'A note has its fundamental at {f1}. Which harmonic lies at {fn}?' }
    },
    {
      name: 'Harmonics of a sawtooth wave',
      expr: 'An = 2*A/(n*pi)', tex: 'A_n = \\frac{2A}{n\\pi}',
      vars: {
        An: { name: 'amplitude of the nth harmonic', tex: 'A_n' },
        A: { name: 'peak value of the sawtooth', value: 1 },
        n: { name: 'harmonic number', int: true, value: 3 }
      },
      note: 'A sawtooth ramping between $-A$ and $+A$ contains every harmonic, with amplitudes falling as $1/n$ (and alternating in sign). A square wave has only the odd ones, with amplitudes $4A/(n\\pi)$.',
      practice: { unknowns: ['An'] },
      stories: { An: 'A sawtooth wave ramps between −{A} and +{A}. What is the amplitude of its harmonic number {n}?' }
    }
  ],
  examples: [
    {
      title: 'Plucking a string in the middle',
      q: 'A guitar string with a fundamental of 110 Hz is plucked exactly at its midpoint. Which of its first eight harmonics are missing from the sound?',
      steps: [
        'Harmonic $n$ has nodes at $L/n, 2L/n, \\dots$. Every even harmonic has a node at $L/2$.',
        'A mode with a node where the string is plucked cannot be set moving by that pluck.',
        'So 220, 440, 660 and 880 Hz are missing; 110, 330, 550 and 770 Hz remain.'
      ],
      a: 'All the even harmonics (220, 440, 660, 880 Hz): the tone is hollow.'
    },
    {
      title: 'Building a square wave',
      q: 'What are the amplitudes of the first four odd harmonics of a square wave swinging between +1 and −1?',
      steps: [
        '$A_n = 4/(n\\pi)$: $A_1 = 1.273$, $A_3 = 0.424$, $A_5 = 0.255$, $A_7 = 0.182$.',
        'They fall slowly, as $1/n$, so a square wave has plenty of high harmonics — hence its buzzy, hollow sound.',
        'Build it in the simulation and watch the sum sharpen with each harmonic added.'
      ],
      a: '1.27, 0.42, 0.25, 0.18'
    }
  ],
  quiz: [
    { q: 'A clarinet and a flute play the same note equally loudly. What differs?', choices: ['The fundamental frequency', 'The relative strengths of the harmonics (and the attack)', 'The speed of the sound', 'The wavelength of the fundamental'], a: 1,
      why: 'Same note means the same fundamental and so the same wavelength in air; the timbre lies in the harmonic mix and the way the sound starts.' },
    { q: 'A string with a fundamental of 150 Hz is plucked exactly at its midpoint. Which frequency is absent from the sound?', choices: ['150 Hz', '300 Hz', '450 Hz', '750 Hz'], a: 1,
      why: '300 Hz is the second harmonic, which has a node at the midpoint.' },
    { q: 'A 200 Hz sawtooth wave contains energy at…', choices: ['200 Hz only', '200, 400, 600, 800 Hz, …', 'only 200, 600, 1000 Hz, …', '100, 200, 300 Hz, …'], a: 1,
      why: 'A sawtooth contains every harmonic, with amplitudes falling as 1/n.' },
    { q: 'Removing the fundamental from a note rich in harmonics drops its pitch by an octave.', a: false,
      why: 'The wave still repeats at the fundamental\'s rate and the pitch heard stays the same — the missing fundamental.' }
  ],
  applications: [
    'Synthesisers build sounds by adding harmonics (additive synthesis) or by filtering harmonic-rich waves (subtractive synthesis).',
    'Tuner apps and spectrum analysers find the harmonics of a sound with the fast Fourier transform.',
    'Speech recognition identifies vowels from the formants that shape the harmonic spectrum.'
  ],
  history: 'Joseph Fourier developed his series around 1807 to solve problems of heat flow, publishing them fully in 1822. Hermann von Helmholtz\'s "On the Sensations of Tone" (1863) used tuned resonators to pick out the harmonics of real instruments and showed that timbre comes from their mixture.',
  sim: 'sound-fourier'
},

{
  id: 'musical-scales', parent: 'hearing-music', title: 'Musical scales', level: 2,
  short: 'Notes that sound good together have simple frequency ratios — 2:1 for an octave, 3:2 for a fifth. Twelve equal semitones of ratio ¹²√2 divide the octave in the tuning almost all modern music uses.',
  keywords: ['musical scale', 'octave', 'fifth', 'interval', 'semitone', 'equal temperament', 'just intonation', 'Pythagorean tuning', 'cents', 'consonance', 'dissonance', 'A440', 'concert pitch', 'twelfth root of two', 'MIDI', 'Pythagorean comma'],
  prereq: ['harmonics-timbre', 'beats', 'math:logarithms'],
  related: ['musical-instruments', 'loudness-pitch', 'math:exponential-functions'],
  body: `
Why do some pairs of notes sound smooth together and others clash? The answer lies in their [[harmonics-timbre|harmonics]]. Two notes an **octave** apart, with frequencies in the ratio 2 : 1, share harmonics: every harmonic of the upper note is also a harmonic of the lower one, and the two blend. Two notes a **fifth** apart, ratio 3 : 2, share every second harmonic of the upper with every third of the lower. The simpler the ratio, the more harmonics coincide exactly. Harmonics that *nearly* coincide produce [[beats]] and roughness, which the ear hears as dissonance.

### Intervals
| Interval | Pure ratio | Semitones | Equal-tempered ratio | Cents, pure / equal |
|---|---|---|---|---|
| Minor third | 6 : 5 | 3 | 1.189 | 315.6 / 300 |
| Major third | 5 : 4 | 4 | 1.260 | 386.3 / 400 |
| Perfect fourth | 4 : 3 | 5 | 1.335 | 498.0 / 500 |
| Perfect fifth | 3 : 2 | 7 | 1.498 | 702.0 / 700 |
| Major sixth | 5 : 3 | 9 | 1.682 | 884.4 / 900 |
| Octave | 2 : 1 | 12 | 2.000 | 1200 / 1200 |

Since the ear hears ratios, intervals are measured on a logarithmic scale. An interval of ratio $r$ spans $1200\\log_2 r$ **cents**; an octave is 1200 cents and an equal-tempered semitone 100. A trained ear notices about 5 cents.

### The problem with pure intervals
Stack pure fifths — C, G, D, A, … — and after twelve of them you should be back on C, seven octaves up. You are not quite: $(3/2)^{12} = 129.75$, while $2^7 = 128$. The overshoot of 1.4% (23.5 cents) is the **Pythagorean comma**. No keyboard with twelve notes per octave can have every fifth, third and octave pure at once; some intervals must be bent.

### Equal temperament
The modern answer is to divide the octave into twelve equal ratios. Each semitone multiplies the frequency by

$$r = 2^{1/12} = 1.059\\,463$$

so every key is equally usable. With concert pitch A4 = 440 Hz, the note $n$ semitones above A4 (negative below) is

$$f = 440\\ \\mathrm{Hz} \\times 2^{n/12}$$

Middle C (C4) is 9 semitones below A4: $440 \\times 2^{-9/12} = 261.63$ Hz. The price: equal-tempered fifths are 2 cents narrow (barely noticeable) and major thirds almost 14 cents wide, which you can hear as a gentle beating in sustained chords.

### Counting beats
Piano tuners use those beats. In the equal-tempered third C4–E4, the fifth harmonic of C4 ($5 \\times 261.63 = 1308.1$ Hz) and the fourth harmonic of E4 ($4 \\times 329.63 = 1318.5$ Hz) nearly coincide and beat about 10 times a second. A pure third, with E at exactly $1.25 \\times 261.63 = 327.0$ Hz, would not beat at all. For the fifth C4–G4 the beating is under once a second.

Equal temperament is one choice among many. Choirs and string quartets drift towards pure intervals in held chords, and Arabic, Indian, Persian and Indonesian music use scales with intervals that fall between the piano's keys.
`,
  ideas: [
    'Intervals are frequency ratios; the ear hears equal ratios as equal steps.',
    'Consonant intervals have simple ratios, so many harmonics of the two notes coincide instead of beating.',
    'Pure fifths cannot close a twelve-note scale: twelve fifths overshoot seven octaves by the Pythagorean comma.',
    'Equal temperament uses twelve equal semitones of ratio 2^(1/12) ≈ 1.0595: f = 440 Hz × 2^(n/12).',
    'An interval of ratio r spans 1200 log₂ r cents; an equal-tempered semitone is 100 cents.'
  ],
  pitfalls: [
    'The notes of a scale are equally spaced in frequency — They are equally spaced in ratio: each semitone multiplies the frequency by 1.0595, so higher semitones span more hertz.',
    'Equal temperament is perfectly in tune — Only its octaves are pure. Its fifths are 2 cents narrow and its major thirds nearly 14 cents wide, which is why tempered thirds beat.'
  ],
  formulas: [
    {
      name: 'Equal-tempered pitch',
      expr: 'f = fA*2^(n/12)', tex: 'f = f_A \\cdot 2^{n/12}',
      vars: {
        f: { name: 'frequency of the note', q: 'frequency', unit: 'Hz' },
        fA: { name: 'reference pitch A4', q: 'frequency', unit: 'Hz', value: 440, min: 415, max: 466, tex: 'f_A' },
        n: { name: 'semitones above A4 (negative below)', int: true, signed: true, value: 3 }
      },
      note: 'Middle C is $n = -9$ (261.63 Hz) and the C above it $n = 3$ (523.25 Hz). Concert pitch is A4 = 440 Hz; some orchestras tune to 442 or 443 Hz, and baroque ensembles often to 415 Hz.',
      practice: { unknowns: ['f'] },
      stories: {
        f: 'In equal temperament with A4 tuned to {fA}, what is the frequency of the note n = {n}, counting semitones up from A4?',
        n: 'A note sounds at {f}. How many equal-tempered semitones above A4 = {fA} is it?'
      }
    },
    {
      name: 'Interval in cents',
      expr: 'c = 1200*log2(f2/f1)', tex: 'c = 1200\\log_2\\frac{f_2}{f_1}',
      vars: {
        c: { name: 'interval (negative when going down)', unit: 'cents', signed: true },
        f2: { name: 'second frequency', q: 'frequency', unit: 'Hz', value: 330 },
        f1: { name: 'first frequency', q: 'frequency', unit: 'Hz', value: 220 }
      },
      note: '100 cents is one equal-tempered semitone; 1200 cents an octave.',
      practice: { unknowns: ['c', 'f2'] },
      stories: { c: 'How many cents is the interval from {f1} to {f2}?', f2: 'Which frequency lies an interval of {c} from {f1} (negative meaning lower)?' }
    }
  ],
  examples: [
    {
      title: 'Where middle C comes from',
      q: 'Find the equal-tempered frequency of middle C (C4), 9 semitones below A4 = 440 Hz, and of the C an octave above it.',
      steps: [
        '$f = 440 \\times 2^{-9/12} = 440 \\times 0.5946 = 261.63$ Hz.',
        'C5 is three semitones above A4: $440 \\times 2^{3/12} = 523.25$ Hz — exactly twice 261.63 Hz, as an octave must be.'
      ],
      a: 'C4 = 261.63 Hz, C5 = 523.25 Hz'
    },
    {
      title: 'Why tempered thirds beat',
      q: 'In equal temperament C4 = 261.63 Hz and E4 = 329.63 Hz. Which harmonics nearly coincide, and how fast do they beat? What would a pure major third give?',
      steps: [
        'The ratio is close to 5 : 4, so compare the 5th harmonic of C4 with the 4th of E4: $5 \\times 261.63 = 1308.1$ Hz and $4 \\times 329.63 = 1318.5$ Hz.',
        'They beat at $1318.5 - 1308.1 = 10.4$ times a second — a clear shimmer in a held chord.',
        'A pure third puts E at $1.25 \\times 261.63 = 327.03$ Hz, whose 4th harmonic is 1308.1 Hz exactly: no beats.',
        'The tempered E is 13.7 cents sharp of pure: $1200\\log_2(329.63/327.03) = 13.7$.'
      ],
      a: 'About 10 beats per second; none for a pure third.'
    }
  ],
  quiz: [
    { q: 'The frequency ratio of an equal-tempered semitone is…', choices: ['1/12', '1.0595', '1.0833', '1.5'], a: 1,
      why: 'Twelve equal ratios make an octave: r¹² = 2, so r = 2^(1/12) = 1.0595. (1.0833 would be 1 + 1/12, which assumes equal steps in hertz.)' },
    { q: 'A4 is 440 Hz. A5, one octave higher, is…', choices: ['452 Hz', '660 Hz', '880 Hz', '1320 Hz'], a: 2,
      why: 'An octave doubles the frequency.' },
    { q: 'Why does a pure fifth (3 : 2) sound smooth?', choices: ['Its notes are loud', 'Every second harmonic of the upper note coincides with every third harmonic of the lower, so few harmonics beat', 'The ear cannot hear the upper note', 'Its frequencies differ by exactly 1 Hz'], a: 1,
      why: 'Simple ratios make many harmonics coincide exactly. Near misses would beat and sound rough.' },
    { q: 'How many cents is the interval from 440 Hz to 660 Hz?', choices: ['220', '500', '702', '1200'], a: 2,
      why: '1200 log₂(1.5) = 702 cents: a pure fifth, 2 cents wider than the tempered one.' },
    { q: 'In equal temperament every interval except the octave differs slightly from its simple-ratio (pure) form.', a: true,
      why: 'Powers of 2^(1/12) are irrational except when they are whole powers of 2, so only octaves come out as exact simple ratios.' }
  ],
  applications: [
    'Electronic tuners and MIDI instruments compute notes from f = 440 × 2^(n/12) (MIDI note 69 is A4).',
    'Piano tuners set the temperament by counting beats between the harmonics of fifths and thirds.',
    'Choirs and string quartets adjust pitch by a few cents to make held chords pure.'
  ],
  history: 'The Pythagoreans linked consonance to simple ratios of string lengths around 500 BC. Equal temperament was worked out precisely in the late sixteenth century, independently by Zhu Zaiyu in China and Simon Stevin in the Netherlands, and became the standard keyboard tuning in the nineteenth century. A4 = 440 Hz was agreed as standard concert pitch in 1939.'
},

{
  id: 'musical-instruments', parent: 'hearing-music', title: 'Musical instruments', level: 2,
  short: 'Every instrument has three parts: something that vibrates with a set of natural frequencies, a way to keep it vibrating, and a body or bell that passes the sound efficiently to the air.',
  keywords: ['musical instrument', 'string instrument', 'wind instrument', 'brass', 'woodwind', 'percussion', 'frets', 'soundboard', 'reed', 'bow', 'stick-slip', 'drum modes', 'piano', 'voice', 'formants', 'Mersenne\'s laws', 'overblowing'],
  prereq: ['standing-waves', 'air-columns', 'harmonics-timbre'],
  related: ['musical-scales', 'waves-on-strings', 'driven-oscillations', 'loudness-pitch'],
  body: `
However different a violin, a trumpet and a xylophone look, each is built from the same three parts:
1. An **oscillator** with a set of natural frequencies — a string, an air column, a membrane, a bar, the vocal folds. It fixes the pitch and the available harmonics.
2. An **exciter** that feeds it energy — a single pluck or strike, or a steady drive: a bow, a reed, the player's lips, an air jet.
3. A **radiator** that hands the vibration on to the air. A bare string is so thin that it moves almost no air; it drives a soundboard or a hollow body that does. Brass instruments end in a flared bell.

### Strings
A string's frequencies follow $f_n = \\frac{n}{2L}\\sqrt{T/\\mu}$ ([[standing-waves]]) — Mersenne's laws: shorter, tighter or lighter strings sound higher. Frets shorten the string by the same *ratio* for every semitone, $2^{-1/12}$ ([[musical-scales]]), so the $n$th fret sits a distance $L(1 - 2^{-n/12})$ from the nut: the 12th fret halfway along, and the frets crowding together up the neck. On a 648 mm scale the first fret is 36.4 mm from the nut.

A bow keeps a string going by **stick–slip** friction: the rosined hair drags the string along, the string snaps back, and it sticks again once per cycle. The string settles into a sharp kink that races round it (Helmholtz motion), giving a sawtooth-like, harmonic-rich tone.

A piano's hammers strike some 230 steel strings whose combined tension is about 20 tonnes-force, held by a cast-iron frame. The strings are stiff enough for their overtones to run slightly sharp, so tuners "stretch" the octaves to match.

### Wind instruments
The oscillator is an [[air-columns|air column]]; the exciter is a valve that the air column itself controls. In a **flute** an air jet flips in and out of the embouchure hole; the tube is open at both ends, has all harmonics and overblows an octave. In a **clarinet** a reed opens and closes the end of a nearly cylindrical tube, which behaves as a pipe closed at one end: odd harmonics, a hollow tone, overblowing a twelfth. Oboes, bassoons and saxophones have **conical** bores, which behave like open pipes and overblow an octave. Opening tone holes shortens the effective tube.

In **brass** instruments the player's lips buzz like a reed. The mouthpiece and the flaring bell reshape the tube's resonances into a nearly harmonic series, and the player picks among them by lip tension. Valves add extra lengths of tubing: about 6% for a semitone lower, 12% for a whole tone, 19% for a minor third.

### Percussion
Membranes and bars have natural frequencies that are **not** harmonic. An ideal drumhead's modes stand in ratios of about 1 : 1.59 : 2.14 : 2.30, which is why most drums have no clear pitch. Timpani are the exception: the air in the kettle and around the head shifts the main modes close to the ratios 2 : 3 : 4, which the ear hears as a note. A free bar's modes are 1 : 2.76 : 5.40; marimba makers carve away wood under the middle of each bar to pull the second mode down to four times the fundamental, and xylophone makers to three times.

### The voice
The vocal folds buzz at a fundamental of roughly 85–180 Hz in men and 165–255 Hz in women, producing a harmonic-rich sound. The vocal tract, about 17 cm long, acts like a tube closed at the folds and open at the lips, with resonances near 500, 1500 and 2500 Hz. Moving the tongue, jaw and lips shifts these resonances — the **formants** — and that is how we make different vowels on the same note ([[harmonics-timbre]]).
`,
  ideas: [
    'An instrument = an oscillator (sets pitch and harmonics) + an exciter (supplies energy) + a radiator (couples to the air).',
    'Strings follow Mersenne\'s laws: frequency rises with tension and falls with length and mass per length.',
    'Wind instruments are resonating air columns; whether they act as open or closed pipes decides their harmonics and how they overblow.',
    'Drums and bars have inharmonic modes; makers shape them to bring some modes into harmonic ratios.',
    'The voice is a harmonic-rich buzz shaped by the resonances (formants) of the vocal tract.'
  ],
  pitfalls: [
    'The sound of a guitar comes straight from its strings — A bare string moves very little air; nearly all the sound comes from the body and soundboard that the strings drive.',
    'Frets are equally spaced — Each fret shortens the remaining length by the same ratio, so the spacing shrinks up the neck.',
    'Drums have no pitch — Most drums have inharmonic overtones, but timpani, tabla and tuned toms are built so that their main modes nearly fit a harmonic series and give a clear note.'
  ],
  formulas: [
    {
      name: 'Position of a fret',
      expr: 'd = L*(1 - 2^(-n/12))', tex: 'd = L\\left(1 - 2^{-n/12}\\right)',
      vars: {
        d: { name: 'distance of the fret from the nut', q: 'length', unit: 'mm' },
        L: { name: 'scale length (nut to bridge)', q: 'length', unit: 'mm', value: 648 },
        n: { name: 'fret number', int: true, value: 12 }
      },
      stories: { d: 'On a guitar with a scale length of {L}, how far from the nut is fret number {n}?', n: 'A fret sits {d} from the nut on a scale of {L}. Which fret is it?' }
    },
    {
      name: 'Frequency of a plain string from its diameter',
      expr: 'f = 1/(L*d)*sqrt(T/(pi*rho))', tex: 'f = \\frac{1}{L d}\\sqrt{\\frac{T}{\\pi\\rho}}',
      vars: {
        f: { name: 'fundamental frequency', q: 'frequency', unit: 'Hz' },
        L: { name: 'vibrating length', q: 'length', unit: 'm', value: 0.648 },
        d: { name: 'string diameter', q: 'length', unit: 'mm', value: 0.254 },
        T: { name: 'tension', q: 'force', unit: 'N', value: 72.6 },
        rho: { name: 'density of the string material', q: 'density', unit: 'kg/m³', value: 7850 }
      },
      note: 'From $f_1 = \\frac{1}{2L}\\sqrt{T/\\mu}$ with $\\mu = \\rho\\pi d^2/4$. For plain (unwound) strings; wound strings are heavier than their diameter suggests.',
      practice: { unknowns: ['f', 'T'] },
      stories: { T: 'A plain string of density {rho} and diameter {d} is stretched over {L}. What tension tunes it to {f}?', f: 'A plain string of density {rho} and diameter {d}, {L} long, is under a tension of {T}. What frequency does it sound?' }
    }
  ],
  examples: [
    {
      title: 'Placing frets',
      q: 'On a 648 mm scale, how far from the nut are frets 1, 2, 11 and 12? How far apart are frets 1 and 2, and frets 11 and 12?',
      steps: [
        '$d_n = 648\\,(1 - 2^{-n/12})$ mm.',
        'Fret 1: 36.4 mm. Fret 2: 70.7 mm. Spacing 34.3 mm.',
        'Fret 11: 304.7 mm. Fret 12: 324.0 mm (half the scale: an octave). Spacing 19.3 mm.',
        'Each spacing is 5.6% smaller than the one before, since every fret removes the same fraction of what is left.'
      ],
      a: '36.4, 70.7, 304.7, 324.0 mm; spacings 34.3 mm and 19.3 mm.'
    },
    {
      title: 'Why a clarinet plays lower than a flute',
      q: 'A flute behaves as a tube about 0.66 m long open at both ends; a clarinet as a tube about 0.60 m long closed at one end. Estimate their lowest notes (v = 343 m/s).',
      steps: [
        'Flute: $f_1 = v/2L = 343/1.32 = 260$ Hz — close to middle C, the flute\'s lowest note.',
        'Clarinet: $f_1 = v/4L = 343/2.40 = 143$ Hz — near D3, the lowest note of a B♭ clarinet.',
        'Similar lengths, but closing one end drops the clarinet nearly an octave below the flute.'
      ],
      a: 'Flute about 260 Hz; clarinet about 143 Hz, nearly an octave lower.'
    }
  ],
  quiz: [
    { q: 'To raise a string\'s pitch by an octave without changing its length or the string itself, the tension must be…', choices: ['doubled', 'quadrupled', 'increased by 41%', 'halved'], a: 1,
      why: 'f is proportional to √T: twice the frequency needs four times the tension.' },
    { q: 'Why are guitar frets closer together near the body?', choices: ['The strings are thinner there', 'Each fret shortens the string by the same ratio, so the steps in length shrink as the length does', 'The neck is tapered', 'To make chords easier to reach'], a: 1,
      why: 'Every semitone multiplies the vibrating length by 2^(−1/12) ≈ 0.944, a fixed fraction of an ever shorter length.' },
    { q: 'A bowed violin string keeps sounding because…', choices: ['the bow gives it a single push', 'stick–slip friction feeds in energy once per cycle, in step with the string', 'the body resonates for ever', 'the string is under tension'], a: 1,
      why: 'The bow catches and releases the string once per vibration, topping up the energy lost to sound and friction.' },
    { q: 'A clarinet and a flute are about the same length. The clarinet\'s lowest note is roughly…', choices: ['the same', 'an octave higher', 'an octave lower', 'two octaves lower'], a: 2,
      why: 'A pipe closed at one end has a fundamental of v/4L, half that of an open pipe of the same length.' }
  ],
  applications: [
    'Instrument making: string gauges, bore shapes and bar profiles are chosen to put the resonances on the notes of the scale.',
    'Electric guitars pick up the string motion magnetically, so a solid body works; acoustic guitars need a light, springy soundboard to radiate.',
    'Singing teachers and speech therapists study formants on spectrograms of the voice.'
  ],
  sim: { id: 'sound-pipes', params: { type: 'closed' } }
}

);
