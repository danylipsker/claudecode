/* HYPER-PHYSICS · content/sound-waves.js — sound as a pressure wave: its speed,
 * intensity and decibels, the Doppler effect, beats, resonating air columns,
 * shock waves and ultrasound. */
Hyper.add(

{
  id: 'speed-of-sound', parent: 'sound-waves', title: 'Speed of sound', level: 1,
  short: 'Sound travels through air at about 343 m/s at room temperature — faster in warm air, much faster in water and steel. Its speed is set by how stiff the medium is against compression and how dense it is.',
  keywords: ['speed of sound', '343 m/s', 'bulk modulus', 'adiabatic', 'gamma', 'temperature', 'helium voice', 'thunder', 'lightning distance', 'speed in water', 'speed in steel', 'Mach 1'],
  prereq: ['transverse-longitudinal', 'shear-bulk-modulus', 'ideal-gas-law'],
  related: ['doppler-effect', 'shock-waves', 'kinetic-theory-gases', 'air-columns', 'wave-properties'],
  body: `
Count the seconds between a lightning flash and its thunder: every 3 s is about a kilometre. Sound in air at 20 °C travels at 343 m/s — 1235 km/h, fast by everyday standards but nearly a million times slower than light, so the flash reaches you effectively at once.

### What sets the speed
It is the same contest as on a [[waves-on-strings|string]]: a restoring stiffness against an inertia. For a fluid the stiffness is the **bulk modulus** $B$ — the pressure needed per fractional change of volume ([[shear-bulk-modulus]]) — and the inertia is the density $\\rho$:

$$v = \\sqrt{\\frac{B}{\\rho}}$$

Water is about 830 times denser than air, which on its own would make sound slower. But water is about 15 000 times stiffer, so sound crosses it at 1480 m/s, 4.3 times faster than in air. In solids the stiffness is higher still: about 5000 m/s along a steel rail.

### In a gas
The squeezes and stretches of a sound wave come and go too quickly for heat to flow between them, so the gas is compressed **adiabatically** and its stiffness is $B = \\gamma p$, where $\\gamma = c_p/c_v$ is 1.40 for air and 5/3 for helium. Using the [[ideal-gas-law|ideal gas law]] to replace $p/\\rho$ by $RT/M$,

$$v = \\sqrt{\\frac{\\gamma p}{\\rho}} = \\sqrt{\\frac{\\gamma R T}{M}}$$

Three consequences:
- **Pressure does not matter** at a given temperature: squeeze a gas and its pressure and density rise together.
- **Temperature does**, as $\\sqrt T$ (in kelvin): 331 m/s at 0 °C, 343 m/s at 20 °C, 355 m/s at 40 °C — roughly +0.6 m/s per degree. At airliner cruising height, around −56 °C, it is only 295 m/s.
- **Light gases are fast**: in helium about 1000 m/s. Breathing helium does not change the vibration of your vocal folds, but it moves the resonances of your throat and mouth up by a factor of almost three — hence the cartoon voice.

The speed of sound is about two-thirds of the root-mean-square speed of the gas molecules themselves ($\\sqrt{\\gamma/3} = 0.68$ for air) — a disturbance cannot be passed on faster than the molecules that carry it ([[kinetic-theory-gases]]).

| Medium | Speed of sound |
|---|---|
| Air, 0 °C | 331 m/s |
| Air, 20 °C | 343 m/s |
| Helium, 20 °C | 1007 m/s |
| Water, 20 °C | 1482 m/s |
| Soft tissue | about 1540 m/s |
| Steel (bulk) | about 5900 m/s |

In air all audible frequencies travel at the same speed, so a band heard from far away still sounds in time and in tune: the bass and the treble arrive together.
`,
  ideas: [
    'v = √(B/ρ): stiffer media carry sound faster, denser media slower.',
    'In a gas v = √(γRT/M): it depends on temperature and molar mass, not on pressure.',
    'In air v ≈ 331 m/s at 0 °C, rising about 0.6 m/s per degree; 343 m/s at 20 °C.',
    'Sound is about 4.3 times faster in water and about 17 times faster in steel than in air.',
    'All audible frequencies travel at the same speed in air, so music arrives in step.'
  ],
  pitfalls: [
    'Sound travels faster in denser materials — Density on its own slows sound down. Water and steel are faster because they are enormously stiffer, which more than makes up for their density.',
    'Sound is slower high up because the pressure is lower — Pressure cancels out of the speed; it is the colder air up there that slows sound down.',
    'Louder sounds travel faster — Ordinary sounds all travel at the same speed; only extreme pressure jumps such as shock waves outrun it.'
  ],
  formulas: [
    {
      name: 'Speed of sound in a fluid',
      expr: 'v = sqrt(B/rho)', tex: 'v = \\sqrt{\\frac{B}{\\rho}}',
      vars: {
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        B: { name: 'bulk modulus', q: 'stress', unit: 'GPa', value: 2.2 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000 }
      },
      note: 'Water: $B = 2.2$ GPa. For a gas use the adiabatic modulus $B = \\gamma p$ (about 0.142 MPa for air at sea level).',
      stories: { v: 'A liquid has bulk modulus {B} and density {rho}. How fast does sound travel in it?', B: 'Sound travels at {v} in a liquid of density {rho}. What is its bulk modulus?' }
    },
    {
      name: 'Speed of sound in an ideal gas',
      expr: 'v = sqrt(gam*R*T/M)', tex: 'v = \\sqrt{\\frac{\\gamma R T}{M}}',
      vars: {
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        gam: { name: 'heat-capacity ratio (1.40 for air, 1.67 for helium)', value: 1.4, min: 1, max: 1.67, tex: '\\gamma' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, min: -100, max: 500 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.97 }
      },
      practice: { unknowns: ['v', 'T'] },
      stories: {
        v: 'How fast does sound travel in a gas with γ = {gam} and molar mass {M} at {T}?',
        T: 'At what temperature does sound travel at {v} in air (γ = {gam}, M = {M})?'
      }
    },
    {
      name: 'Speed of sound in air at a temperature',
      expr: 'v = v0*sqrt(T/T0)', tex: 'v = v_0\\sqrt{\\frac{T}{T_0}}',
      vars: {
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        v0: { name: 'speed at 0 °C', q: 'speed', unit: 'm/s', value: 331.3, min: 330, max: 333 },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20, min: -60, max: 60 },
        T0: { const: 'T0' }
      },
      practice: { unknowns: ['v', 'T'] },
      note: 'Near room temperature this is close to $v \\approx 331.3 + 0.606\\,t$ m/s with $t$ in °C.',
      stories: { v: 'How fast does sound travel on a {T} day?', T: 'On a certain day sound travels at {v}. What is the air temperature?' }
    },
    {
      name: 'Distance from a sound delay',
      expr: 'd = v*t',
      vars: {
        d: { name: 'distance', q: 'length', unit: 'm' },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 },
        t: { name: 'delay', q: 'time', unit: 's', value: 3 }
      },
      practice: { unknowns: ['d', 't'] },
      stories: { d: 'Thunder arrives {t} after the flash, with sound travelling at {v}. How far away did the lightning strike?', t: 'Lightning strikes {d} away and sound travels at {v}. How long after the flash does the thunder arrive?' }
    }
  ],
  examples: [
    {
      title: 'The helium voice',
      q: 'Find the speed of sound in helium at 20 °C ($\\gamma = 5/3$, $M = 4.00$ g/mol) and compare it with air. What does this do to a voice?',
      steps: [
        '$v = \\sqrt{\\gamma R T/M} = \\sqrt{1.667 \\times 8.314 \\times 293.15 / 0.00400} = 1008\\ \\mathrm{m/s}$.',
        'In air: $\\sqrt{1.40 \\times 8.314 \\times 293.15 / 0.02897} = 343\\ \\mathrm{m/s}$. Helium is 2.9 times faster.',
        'The resonances of the vocal tract are set by its size and the speed of sound in it ([[air-columns]]), so they all move up by about 2.9. The vocal folds still buzz at the same rate, so the pitch barely changes — the timbre does.'
      ],
      a: 'About 1010 m/s, 2.9 times faster than in air: same pitch, very different tone colour.'
    },
    {
      title: 'Hearing a train through the rail',
      q: 'A train is 1.0 km away. How long does its sound take to reach you through the air, and through a steel rail (about 5000 m/s)?',
      steps: [
        'Through the air: $t = 1000/343 = 2.92\\ \\mathrm{s}$.',
        'Through the rail: $t = 1000/5000 = 0.20\\ \\mathrm{s}$.',
        'Put an ear to the rail (not advisable) and you would hear the train about 2.7 s before the sound arrives through the air.'
      ],
      a: '2.9 s through the air, 0.2 s through the rail.'
    }
  ],
  quiz: [
    { q: 'A storm arrives: the air pressure drops but the temperature stays the same. The speed of sound…', choices: ['rises', 'falls', 'stays the same', 'depends on the frequency'], a: 2,
      why: 'In an ideal gas $v = \\sqrt{\\gamma RT/M}$: pressure does not appear. Pressure and density fall together.' },
    { q: 'Why does sound travel faster in water than in air, although water is about 800 times denser?', choices: ['Water molecules are closer together, so they pass the sound on sooner', 'Water is far stiffer: its bulk modulus is about 15 000 times that of air', 'Sound in water is a transverse wave', 'It does not: sound is slower in water'], a: 1,
      why: 'v = √(B/ρ). The density slows sound down by a factor of about 29, but the stiffness speeds it up by about 120.' },
    { q: 'Breathing helium makes your voice sound higher mainly because…', choices: ['your vocal folds vibrate faster', 'the resonances of your throat and mouth move up in frequency', 'helium is lighter, so it carries high pitches better', 'the speed of sound in helium is lower'], a: 1,
      why: 'Sound is about 2.9 times faster in helium, so every resonance of the vocal tract moves up by that factor. The folds themselves vibrate at nearly the same rate.' },
    { q: 'You see lightning and hear the thunder 9 s later. The strike was about…', choices: ['300 m away', '1 km away', '3 km away', '9 km away'], a: 2,
      why: '9 s × 343 m/s ≈ 3.1 km: three seconds per kilometre.' },
    { q: 'In air, high-frequency sounds travel faster than low-frequency sounds.', a: false,
      why: 'Air is almost free of dispersion over the audible range: every frequency travels at the same speed.' }
  ],
  applications: [
    'Timing thunder to judge how far away lightning struck.',
    'Sonar and echo sounders turn echo times into distances using the speed of sound in water.',
    'Ultrasonic anemometers and flow meters measure wind or fluid speed from how the flow speeds sound up in one direction and slows it in the other.'
  ],
  history: 'By the eighteenth century, timing the flash and the bang of distant cannon had put the speed of sound in air at roughly 330–340 m/s. Newton\'s calculation had come out about 15% too low, because he assumed the air stays at constant temperature as it is squeezed; Laplace corrected this in 1816 by treating the compressions as adiabatic, which brings in the factor γ.'
},

{
  id: 'sound-intensity', parent: 'sound-waves', title: 'Sound intensity and decibels', level: 1,
  short: 'Intensity is the sound power crossing each square metre. The ear spans a range of a million million, so levels are given on a logarithmic scale in decibels: every 10 dB is ten times the intensity.',
  keywords: ['intensity', 'decibel', 'dB', 'sound level', 'sound pressure level', 'SPL', 'inverse square law', 'threshold of hearing', 'threshold of pain', 'W/m²', 'logarithmic scale', '20 micropascals', 'noise'],
  prereq: ['speed-of-sound', 'power', 'math:logarithms'],
  related: ['loudness-pitch', 'the-ear', 'light-intensity', 'math:logarithmic-scales'],
  body: `
**Intensity** is the power a wave carries through each square metre of a surface facing it, in W/m². A small source radiating a power $P$ equally in all directions spreads it over spheres of area $4\\pi r^2$:

$$I = \\frac{P}{4\\pi r^2}$$

the **inverse-square law**: twice as far, a quarter of the intensity (the same rule as for [[light-intensity|light]]).

Intensity is tied to the pressure swing of the wave. With $p_\\text{rms}$ the root-mean-square pressure fluctuation,

$$I = \\frac{p_\\text{rms}^2}{\\rho v}$$

where $\\rho v$ is the acoustic impedance of the medium ([[wave-reflection]]), 413 kg m⁻² s⁻¹ for air. The faintest sound a young ear can hear at 1 kHz has $p_\\text{rms} = 20\\ \\mu$Pa — two ten-billionths of atmospheric pressure — and moves the eardrum by less than the width of an atom.

### Decibels
The ear copes with intensities from $I_0 = 10^{-12}$ W/m² at the threshold of hearing to about 10 W/m² at the threshold of pain, thirteen powers of ten. A [[math:logarithms|logarithmic]] scale tames this. The **sound level** is

$$\\beta = 10\\log_{10}\\frac{I}{I_0}\\ \\text{dB}$$

Rules worth knowing:
- Ten times the intensity: +10 dB. A hundred times: +20 dB.
- Twice the intensity: +3 dB (since $10\\log_{10}2 = 3.01$).
- Twice the distance from a small source outdoors: −6 dB.
- Two equal, independent sources: +3 dB, not twice the decibels.
- From pressure: $\\beta = 20\\log_{10}(p_\\text{rms}/20\\ \\mu\\text{Pa})$ — a factor 20 because intensity goes as pressure squared.

| Sound | Level | Intensity |
|---|---|---|
| Threshold of hearing (1 kHz) | 0 dB | 10⁻¹² W/m² |
| Rustling leaves | 20 dB | 10⁻¹⁰ W/m² |
| Quiet library | 40 dB | 10⁻⁸ W/m² |
| Conversation at 1 m | 60 dB | 10⁻⁶ W/m² |
| Busy street | 80 dB | 10⁻⁴ W/m² |
| Underground train, lawnmower | 90–100 dB | 10⁻³–10⁻² W/m² |
| Rock concert near the stage | 110 dB | 0.1 W/m² |
| Threshold of pain | 120–130 dB | 1–10 W/m² |
| Jet engine at 30 m | 140 dB | 100 W/m² |

### Adding sources
Independent sources add **intensities**, not decibels:

$$L = 10\\log_{10}\\left(10^{L_1/10} + 10^{L_2/10}\\right)$$

Two 70 dB sources make 73 dB; an 80 dB source and a 70 dB one make 80.4 dB — the quieter one hardly counts.

> [!warn] Decibels measure intensity, not how loud something seems. Roughly, +10 dB sounds twice as loud, and the ear's sensitivity depends strongly on frequency ([[loudness-pitch]]). Sound level meters therefore often report A-weighted levels, dB(A), which mimic the ear.
`,
  ideas: [
    'Intensity is power per unit area, in W/m²; from a small source it falls as 1/r².',
    'The sound level is β = 10 log₁₀(I/I₀), with I₀ = 10⁻¹² W/m², the threshold of hearing.',
    '+10 dB is ten times the intensity, +3 dB twice; doubling the distance outdoors loses 6 dB.',
    'Independent sources add intensities, so two equal sources are 3 dB louder than one.'
  ],
  pitfalls: [
    '80 dB is twice as intense as 40 dB — It is 40 dB more: ten thousand times the intensity.',
    'Two 60 dB sources make 120 dB — They make 63 dB. Convert to intensities, add, and convert back.',
    '0 dB means silence — It is the reference intensity, roughly the faintest 1 kHz sound a young ear can hear. Quieter sounds have negative levels.'
  ],
  formulas: [
    {
      name: 'Sound intensity level',
      expr: 'beta = 10*log(I/I0)', tex: '\\beta = 10\\log_{10}\\frac{I}{I_0}',
      vars: {
        beta: { name: 'sound level', q: 'soundlevel', unit: 'dB', signed: true },
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²', value: 1e-6 },
        I0: { const: 'I0' }
      },
      stories: {
        beta: 'Conversation produces an intensity of {I} at a listener. What is the sound level?',
        I: 'A sound level meter reads {beta}. What is the intensity?'
      }
    },
    {
      name: 'Intensity from a small source (inverse-square law)',
      expr: 'I = P/(4*pi*r^2)', tex: 'I = \\frac{P}{4\\pi r^2}',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        P: { name: 'acoustic power of the source', q: 'power', unit: 'W', value: 1 },
        r: { name: 'distance', q: 'length', unit: 'm', value: 10 }
      },
      note: 'Sound spreading freely in all directions. Near the ground, or indoors with reflections, the intensity is higher.',
      stories: { I: 'A loudspeaker radiates {P} of sound evenly in all directions. What is the intensity {r} away?', r: 'How far from a source of {P} does the intensity fall to {I}?' }
    },
    {
      name: 'Level change with distance',
      expr: 'L2 = L1 - 20*log(r2/r1)', tex: 'L_2 = L_1 - 20\\log_{10}\\frac{r_2}{r_1}',
      vars: {
        L2: { name: 'level at the new distance', q: 'soundlevel', unit: 'dB' },
        L1: { name: 'level at the first distance', q: 'soundlevel', unit: 'dB', value: 90 },
        r1: { name: 'first distance', q: 'length', unit: 'm', value: 1 },
        r2: { name: 'new distance', q: 'length', unit: 'm', value: 8 }
      },
      practice: { unknowns: ['L2', 'r2'] },
      note: 'The inverse-square law in decibels: −6 dB for every doubling of distance.',
      stories: { L2: 'A generator measures {L1} at {r1}. What level would you expect at {r2}, outdoors?', r2: 'A drill gives {L1} at {r1}. At what distance, outdoors, is its level {L2}?' }
    },
    {
      name: 'Intensity from the pressure amplitude',
      expr: 'I = p^2/(rho*v)', tex: 'I = \\frac{p_{\\mathrm{rms}}^2}{\\rho v}',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        p: { name: 'rms pressure fluctuation', q: 'pressure', unit: 'Pa', value: 0.02, tex: 'p_{\\mathrm{rms}}' },
        rho: { name: 'density of air', q: 'density', unit: 'kg/m³', value: 1.204, min: 0.9, max: 1.4 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 }
      },
      practice: { unknowns: ['I', 'p'] },
      stories: { I: 'A microphone measures an rms pressure swing of {p} in air of density {rho}, where sound travels at {v}. What is the intensity?', p: 'What rms pressure swing does a sound of intensity {I} have in air of density {rho}, where sound travels at {v}?' }
    },
    {
      name: 'Adding two independent sources',
      expr: 'L = 10*log(10^(L1/10) + 10^(L2/10))', tex: 'L = 10\\log_{10}\\left(10^{L_1/10} + 10^{L_2/10}\\right)',
      vars: {
        L: { name: 'combined level', q: 'soundlevel', unit: 'dB', signed: true },
        L1: { name: 'level of the first source alone', q: 'soundlevel', unit: 'dB', value: 80, signed: true },
        L2: { name: 'level of the second source alone', q: 'soundlevel', unit: 'dB', value: 70, signed: true }
      },
      practice: { unknowns: ['L'] },
      stories: { L: 'One machine alone gives {L1} at your position, another alone {L2}. What level do you get with both running?' }
    }
  ],
  examples: [
    {
      title: 'How far to walk away?',
      q: 'A road drill gives 100 dB at 2 m. Outdoors, how far away must you be for the level to fall to 80 dB?',
      steps: [
        'A drop of 20 dB is a factor of $10^{20/10} = 100$ in intensity.',
        'Intensity goes as $1/r^2$, so the distance must grow by $\\sqrt{100} = 10$.',
        '$r = 2 \\times 10 = 20\\ \\mathrm{m}$ (ignoring absorption by the air and reflection from the ground).'
      ],
      a: 'About 20 m'
    },
    {
      title: 'A choir of ten',
      q: 'One singer produces 70 dB at your seat. What do ten singers produce, each equally loud? Twenty?',
      steps: [
        'Ten equal independent sources give ten times the intensity: $+10\\log_{10}10 = +10$ dB, so 80 dB.',
        'Twenty: $+10\\log_{10}20 = +13$ dB, so 83 dB.',
        'Doubling the choir from ten to twenty adds just 3 dB.'
      ],
      a: '80 dB for ten, 83 dB for twenty.'
    },
    {
      title: 'The pressure at the threshold of pain',
      q: 'What rms pressure swing does a 120 dB sound have in air (ρv = 413 kg m⁻² s⁻¹)?',
      steps: [
        '120 dB means $I = 10^{-12} \\times 10^{12} = 1\\ \\mathrm{W/m^2}$.',
        '$p_\\text{rms} = \\sqrt{I\\rho v} = \\sqrt{1 \\times 413} = 20\\ \\mathrm{Pa}$.',
        'That is a million times the threshold pressure of 20 µPa (120 dB = 20 log₁₀ 10⁶), yet only 0.02% of atmospheric pressure.'
      ],
      a: 'About 20 Pa'
    }
  ],
  quiz: [
    { q: 'A sound goes from 50 dB to 80 dB. Its intensity has increased by a factor of…', choices: ['30', '1.6', '1000', '3'], a: 2,
      why: '+30 dB is three factors of ten: 10 × 10 × 10 = 1000.' },
    { q: 'You move from 5 m to 10 m away from a small source outdoors. The level drops by about…', choices: ['3 dB', '6 dB', '10 dB', 'half the decibels'], a: 1,
      why: 'Twice the distance means a quarter of the intensity: 10 log₁₀(1/4) = −6 dB.' },
    { q: 'Two machines each produce 85 dB at your position. Together they produce…', choices: ['85 dB', '88 dB', '170 dB', '95 dB'], a: 1,
      why: 'Twice the intensity adds 10 log₁₀ 2 ≈ 3 dB.' },
    { q: 'A sound level of 0 dB means there is no sound at all.', a: false,
      why: '0 dB is the reference intensity 10⁻¹² W/m², about the faintest 1 kHz tone a young ear can detect. Quieter sounds have negative levels.' }
  ],
  applications: [
    'Workplace noise limits and hearing protection ratings are written in dB(A).',
    'Audio engineering: amplifier gain, signal-to-noise ratio and loudspeaker sensitivity are all given in decibels.',
    'Noise maps around airports, motorways and railways guide planning and insulation.'
  ]
},

{
  id: 'doppler-effect', parent: 'sound-waves', title: 'The Doppler effect', level: 2,
  short: 'A sound source coming towards you is heard at a higher pitch, and one going away at a lower pitch, because motion squeezes or stretches the waves — or changes how often you meet them.',
  keywords: ['Doppler effect', 'Doppler shift', 'moving source', 'moving observer', 'siren', 'pitch change', 'radar gun', 'Doppler ultrasound', 'frequency shift', 'redshift', 'blueshift'],
  prereq: ['speed-of-sound', 'wave-properties', 'relative-velocity'],
  related: ['shock-waves', 'relativistic-doppler', 'hubbles-law', 'ultrasound', 'beats'],
  body: `
An ambulance races past with its siren on: the pitch is high as it approaches and drops suddenly as it passes. Nothing about the siren changed; the motion did.

### A moving source
The source emits a crest every period $T = 1/f$. If it moves towards you at speed $v_S$, it has advanced $v_S T$ by the time it emits the next crest, so the crests ahead of it are packed closer together: $\\lambda' = (v - v_S)T$ instead of $vT$. They still travel through the air at the speed of sound $v$, so they arrive at

$$f' = \\frac{v}{\\lambda'} = f\\,\\frac{v}{v - v_S}$$

Behind the source the crests are spread out, $\\lambda' = (v + v_S)T$, and the frequency is lower. Open the simulation and watch the rings bunch up in front.

### A moving listener
If instead you move towards a still source at speed $v_L$, the waves in the air are unchanged, but you run into them faster, at $v + v_L$ relative to you: $f' = f\\,(v + v_L)/v$.

### Both at once
$$f_L = f_S\\,\\frac{v + v_L}{v - v_S}$$

with $v_L$ positive when the listener moves towards the source and $v_S$ positive when the source moves towards the listener, both measured **relative to the air**. (A steady wind with both at rest changes nothing: the number of crests arriving per second must equal the number sent.)

The two effects are not the same. A source approaching at half the speed of sound doubles the frequency; a listener approaching at that speed raises it only by half. The air is a preferred frame for sound. Light has no medium, only the relative speed matters, and the formula changes ([[relativistic-doppler]]).

### Numbers
An ambulance at 30 m/s (108 km/h) with a 700 Hz siren: approaching, $700 \\times 343/313 = 767$ Hz; receding, $700 \\times 343/373 = 644$ Hz. The drop as it passes is about three semitones.

### Echoes from moving targets
A wave bouncing off an object moving at speed $u$ is shifted twice: the object receives it as a moving listener and re-emits it as a moving source. For $u \\ll v$,

$$\\Delta f \\approx \\frac{2u\\cos\\theta}{v}\\,f$$

where $\\theta$ is the angle between the beam and the motion. Police radar uses it with radio waves; Doppler [[ultrasound]] uses it to measure blood flow: at 5 MHz, blood moving at 0.5 m/s at 60° to the beam shifts the echo by about 1.6 kHz — an audible tone, which is what the whooshing sound of a Doppler scan is. The same shift of spectral lines tells astronomers how fast stars and galaxies move ([[hubbles-law]]).

As $v_S$ approaches $v$ the crests ahead pile into a single front, and beyond it the source outruns its own sound: [[shock-waves]].
`,
  ideas: [
    'An approaching source or listener raises the observed frequency; a receding one lowers it.',
    'A moving source squeezes the waves ahead to λ\' = (v − v_S)/f; a moving listener meets unchanged waves more often.',
    'General formula: f_L = f_S (v + v_L)/(v − v_S), with speeds positive towards the other party and measured relative to the air.',
    'An echo from a target moving at u ≪ v is shifted by about 2u/v times the frequency — the principle of radar guns and Doppler ultrasound.'
  ],
  pitfalls: [
    'The pitch rises steadily as a siren approaches — For a source heading straight at you at steady speed the pitch is constant and high, then drops as it passes. The glide heard from the roadside comes from the changing angle.',
    'The shift is caused by the sound getting louder as the source comes nearer — Loudness and pitch are separate: the shift depends on velocity, not on distance.',
    'A moving source and a moving listener give the same shift — For sound they do not, because the air is a preferred frame: a source at v/2 doubles the frequency, a listener at v/2 multiplies it by 1.5.'
  ],
  formulas: [
    {
      name: 'Doppler effect for sound',
      expr: 'fL = fS*(v + vL)/(v - vS)', tex: 'f_L = f_S\\,\\frac{v + v_L}{v - v_S}',
      vars: {
        fL: { name: 'frequency the listener hears', q: 'frequency', unit: 'Hz', tex: 'f_L' },
        fS: { name: 'frequency of the source', q: 'frequency', unit: 'Hz', value: 400, tex: 'f_S' },
        v: { name: 'speed of sound in the air', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 },
        vL: { name: 'listener speed (towards the source positive)', q: 'speed', unit: 'm/s', value: 5, signed: true, min: -40, max: 40, tex: 'v_L' },
        vS: { name: 'source speed (towards the listener positive)', q: 'speed', unit: 'm/s', value: 25, signed: true, min: -150, max: 150, tex: 'v_S' }
      },
      note: 'Speeds are measured relative to the air, and taken negative when moving away. Valid while $v_S < v$.',
      practice: { unknowns: ['fL', 'fS'] },
      stories: {
        fL: 'A car sounds a {fS} horn and moves at {vS}; a cyclist moves at {vL} (each speed counted positive when heading towards the other). With sound at {v}, what frequency does the cyclist hear?',
        vS: 'A car horn has frequency {fS}; a cyclist moving at {vL} (towards the car positive) hears {fL}. With sound at {v}, what is the car\'s velocity towards the cyclist?',
        fS: 'A cyclist moving at {vL} hears a car horn at {fL} while the car moves at {vS} (each counted positive when heading towards the other). With sound at {v}, what is the horn\'s real frequency?'
      }
    },
    {
      name: 'Frequency shift of an echo from a moving target',
      expr: 'df = 2*f*u*cos(theta)/v', tex: '\\Delta f = \\frac{2 f u\\cos\\theta}{v}',
      vars: {
        df: { name: 'frequency shift of the echo', q: 'frequency', unit: 'Hz', tex: '\\Delta f' },
        f: { name: 'transmitted frequency', q: 'frequency', unit: 'MHz', value: 5 },
        u: { name: 'speed of the target', q: 'speed', unit: 'm/s', value: 0.5 },
        theta: { name: 'angle between beam and motion', q: 'angle', unit: '°', value: 60, min: 0, max: 90 },
        v: { name: 'wave speed in the medium', q: 'speed', unit: 'm/s', value: 1540 }
      },
      note: 'Valid for $u \\ll v$. The defaults are Doppler ultrasound of blood (1540 m/s in tissue); for radar use $v = c$.',
      practice: { unknowns: ['df', 'u'] },
      stories: {
        df: 'A {f} beam meets a target moving at {u}, at {theta} to the beam, in a medium where the waves travel at {v}. What is the frequency shift of the echo?',
        u: 'A {f} ultrasound echo from moving blood returns shifted by {df}. The beam makes {theta} with the flow, and the waves travel at {v}. How fast is the blood moving?'
      }
    }
  ],
  examples: [
    {
      title: 'A passing ambulance',
      q: 'An ambulance drives past you at 30 m/s with its 700 Hz siren on. What do you hear as it approaches and as it leaves? (v = 343 m/s)',
      steps: [
        'Approaching ($v_S = +30$): $f = 700 \\times \\dfrac{343}{343 - 30} = 767\\ \\mathrm{Hz}$.',
        'Receding ($v_S = -30$): $f = 700 \\times \\dfrac{343}{343 + 30} = 644\\ \\mathrm{Hz}$.',
        'Ratio $767/644 = 1.19$, about three equal-tempered semitones ($2^{3/12} = 1.19$, see [[musical-scales]]).'
      ],
      a: 'About 767 Hz approaching and 644 Hz leaving — a drop of three semitones.'
    },
    {
      title: 'Measuring blood flow',
      q: 'A 5.0 MHz Doppler ultrasound beam meets blood in an artery at 60° to the flow. The echo comes back shifted by 2.0 kHz. How fast is the blood moving? (v = 1540 m/s in tissue)',
      steps: [
        'Rearrange $\\Delta f = 2fu\\cos\\theta/v$: $u = \\dfrac{\\Delta f\\, v}{2f\\cos\\theta}$.',
        '$u = \\dfrac{2000 \\times 1540}{2 \\times 5.0\\times10^6 \\times 0.5} = 0.62\\ \\mathrm{m/s}$.',
        'The shift is in the audible range, so the scanner simply plays it through a loudspeaker.'
      ],
      a: 'About 0.6 m/s'
    }
  ],
  quiz: [
    { q: 'A car sounding a 400 Hz horn drives straight towards you at a steady 20 m/s. As it approaches, the pitch you hear…', choices: ['rises steadily', 'stays at a constant value above 400 Hz', 'is 400 Hz until it passes, then drops', 'falls steadily'], a: 1,
      why: 'The shift depends on the velocity, which is constant: $400 \\times 343/323 = 425$ Hz all the way in.' },
    { q: 'A source moves towards you at half the speed of sound. You hear its 500 Hz tone at…', choices: ['750 Hz', '1000 Hz', '500 Hz', '333 Hz'], a: 1,
      why: '$f = 500 \\times v/(v - v/2) = 1000$ Hz.' },
    { q: 'Instead, you run towards the same stationary 500 Hz source at half the speed of sound. You hear…', choices: ['750 Hz', '1000 Hz', '500 Hz', '333 Hz'], a: 0,
      why: '$f = 500 \\times (v + v/2)/v = 750$ Hz. For sound, moving source and moving listener are not equivalent.' },
    { q: 'A steady wind blows from a stationary source towards you (also stationary). The pitch you hear is…', choices: ['higher', 'lower', 'unchanged', 'higher by the wind speed squared'], a: 2,
      why: 'Relative to the air, the source moves away and you move towards it at the same speed; the factors cancel. Crests cannot pile up between two fixed points, so as many arrive per second as are sent.' },
    { q: 'Doppler ultrasound measures the speed of blood from…', choices: ['the loudness of the echo', 'the time the echo takes to return', 'the frequency shift of the echo', 'the wavelength of the ultrasound inside the probe'], a: 2,
      why: 'Moving blood shifts the echo frequency by about 2u cos θ/v times the transmitted frequency.' }
  ],
  applications: [
    'Radar and lidar speed guns, and sports radar that measures the speed of a serve or a pitch.',
    'Doppler ultrasound: blood flow through heart valves and arteries, and foetal heart monitors.',
    'Weather radar measures winds inside storms; astronomers measure the motions of stars and galaxies from shifted spectral lines.',
    'Horseshoe bats lower their call frequency in flight so that the Doppler-shifted echoes land in their most sensitive band.'
  ],
  history: 'Christian Doppler proposed the effect in 1842, hoping it explained the colours of double stars (it does not — stellar speeds are far too small for that). In 1845 Christophorus Buys Ballot tested it with sound in the Netherlands: musicians played steady notes on an open railway carriage while listeners with good pitch judged the notes as the train went by.',
  sim: 'sound-doppler'
},

{
  id: 'beats', parent: 'sound-waves', title: 'Beats', level: 1,
  short: 'Two tones of slightly different frequency drift in and out of step, so their sum swells and fades at the difference frequency. Musicians tune by listening for the beats to slow down and stop.',
  keywords: ['beats', 'beat frequency', 'tuning', 'interference in time', 'envelope', 'difference frequency', 'heterodyne', 'tuning fork', 'piano tuning', 'detuning'],
  prereq: ['superposition', 'wave-properties', 'math:sum-and-difference'],
  related: ['musical-scales', 'doppler-effect', 'loudness-pitch', 'musical-instruments'],
  body: `
Strike two tuning forks, one at 440 Hz and one at 444 Hz. You do not hear two notes: you hear one tone, at about 442 Hz, whose loudness throbs four times a second — **wah, wah, wah, wah**. These are **beats**: [[superposition|interference]] in time rather than in space.

### Why the loudness throbs
At some moment the two waves are in step: crest meets crest and the sum is large. But the 444 Hz fork gains four cycles per second on the other. A quarter of a second later it is half a cycle ahead, crest meets trough, and the sum almost vanishes. Another quarter-second and it is a whole cycle ahead — back in step, loud again.

### The mathematics
Adding two equal tones and using the [[math:sum-and-difference|sum-to-product identity]],

$$\\sin(2\\pi f_1 t) + \\sin(2\\pi f_2 t) = 2\\cos\\left(2\\pi\\,\\frac{f_1 - f_2}{2}\\,t\\right)\\sin\\left(2\\pi\\,\\frac{f_1 + f_2}{2}\\,t\\right)$$

The sine on the right is the tone you hear, at the **average** frequency. The cosine is a slowly changing amplitude, the **envelope**. The loudness peaks whenever the envelope reaches either its highest or its lowest value — twice per cycle of the cosine — so the number of beats per second is

$$f_\\text{beat} = |f_1 - f_2|$$

### Tuning by ear
Play a string against a reference: as its frequency approaches the reference, the beats slow down, and when they stop the two are in tune. Beats alone do not say which note is higher, so tuners nudge the peg a little: if the beats speed up, they went the wrong way. Piano tuners go further and set whole temperaments by counting prescribed beat rates between the harmonics of fifths and thirds ([[musical-scales]]).

### What we hear
Below about 10–15 beats per second the ear hears a single tone throbbing. Faster beats blur into a rough, harsh sound, and once the frequencies are far enough apart (a few tens of hertz for mid-range notes, more for high notes) the ear separates them into two notes — the roughness of nearly-coinciding harmonics is one reason some intervals sound dissonant.

### Beats as a tool
Beating a signal against a known one turns a tiny frequency difference into something slow and measurable. Doppler radar and Doppler [[ultrasound]] beat the echo against the transmitted wave, and the beat frequency *is* the [[doppler-effect|Doppler shift]]. Radio receivers mix the incoming signal with a local oscillator and keep the difference frequency. Pilots of propeller aircraft synchronise their engines to remove the slow throb heard in the cabin.
`,
  ideas: [
    'Two nearby frequencies add to a tone at their average frequency whose loudness rises and falls.',
    'The beat frequency is the difference, |f₁ − f₂|.',
    'When the beats vanish the two frequencies are equal — the basis of tuning by ear.',
    'Beats cannot tell which frequency is higher: change one slightly and listen whether they speed up or slow down.'
  ],
  pitfalls: [
    'The beat frequency is half the difference, because the envelope is cos(2π · Δf/2 · t) — That is the frequency of the cosine, but the loudness peaks at both its maxima and its minima, so there are |f₁ − f₂| beats per second.',
    'Beats are a third, low note being played — Nothing new is emitted: the sum of two waves simply grows and shrinks. A 4 Hz beat is not a 4 Hz sound (which would be inaudible anyway).'
  ],
  derivation: {
    title: 'Derive the beat frequency',
    steps: [
      { text: 'Add two tones of equal amplitude:', tex: 'y = A\\sin(2\\pi f_1 t) + A\\sin(2\\pi f_2 t)' },
      { text: 'Use $\\sin\\alpha + \\sin\\beta = 2\\cos\\frac{\\alpha - \\beta}{2}\\sin\\frac{\\alpha + \\beta}{2}$:', tex: 'y = \\underbrace{2A\\cos\\left(2\\pi\\,\\frac{f_1 - f_2}{2}\\,t\\right)}_{\\text{slow envelope}}\\;\\sin\\left(2\\pi\\,\\frac{f_1 + f_2}{2}\\,t\\right)' },
      { text: 'The loudness follows the size of the envelope, which peaks twice in each of its cycles (at +2A and at −2A):', tex: 'f_\\text{beat} = 2 \\times \\frac{|f_1 - f_2|}{2} = |f_1 - f_2|' }
    ]
  },
  formulas: [
    {
      name: 'Beat frequency',
      expr: 'fb = f1 - f2', tex: 'f_{\\mathrm{beat}} = f_1 - f_2',
      vars: {
        fb: { name: 'beat frequency (beats per second)', q: 'frequency', unit: 'Hz', tex: 'f_{\\mathrm{beat}}' },
        f1: { name: 'higher frequency', q: 'frequency', unit: 'Hz', value: 444 },
        f2: { name: 'lower frequency', q: 'frequency', unit: 'Hz', value: 440 }
      },
      note: 'Take $f_1$ as the higher of the two. Beats alone do not tell you which one that is.',
      stories: {
        fb: 'A guitar string at {f1} is played together with a {f2} tuning fork. How many beats per second are heard?',
        f1: 'A tuning fork of {f2} and a piano string beat {fb} times a second, and the string is known to be sharp. What is its frequency?'
      }
    },
    {
      name: 'Pitch heard',
      expr: 'f = (f1 + f2)/2', tex: 'f = \\frac{f_1 + f_2}{2}',
      vars: {
        f: { name: 'frequency heard', q: 'frequency', unit: 'Hz' },
        f1: { name: 'first frequency', q: 'frequency', unit: 'Hz', value: 444 },
        f2: { name: 'second frequency', q: 'frequency', unit: 'Hz', value: 440 }
      }
    }
  ],
  examples: [
    {
      title: 'Tuning a guitar string',
      q: 'A string beats 3 times per second against a 440 Hz fork. After the peg is tightened slightly, it beats 5 times per second. What was the string\'s frequency?',
      steps: [
        'Three beats per second means the string was at 437 Hz or 443 Hz.',
        'Tightening raises the frequency. If it had been at 437 Hz it would have moved towards 440 Hz and the beats would have slowed.',
        'The beats sped up, so it moved away from 440 Hz: it was at 443 Hz, and is now at 445 Hz. Loosen it.'
      ],
      a: '443 Hz'
    }
  ],
  quiz: [
    { q: 'Tones of 256 Hz and 260 Hz are played together. You hear…', choices: ['two separate notes', 'a 258 Hz tone swelling and fading 4 times a second', 'a 4 Hz tone', 'a 258 Hz tone swelling and fading twice a second'], a: 1,
      why: 'The heard pitch is the average, 258 Hz, and the beat rate is the difference, 4 Hz.' },
    { q: 'A piano string beats twice a second with a 262 Hz fork. After tightening the string slightly, the beats become slower. The string\'s original frequency was…', choices: ['260 Hz', '264 Hz', '262 Hz', 'impossible to tell'], a: 0,
      why: 'Tightening raises the pitch. The beats slowed, so it moved closer to 262 Hz — it started below, at 260 Hz.' },
    { q: 'Beats become faster as two tones are brought closer in frequency.', a: false,
      why: 'The beat rate is the difference in frequency, so it slows down as they approach and stops when they match.' },
    { q: 'Two flutes play 440 Hz and 441.5 Hz. How long is it between loud moments?', choices: ['0.67 s', '1.5 s', '0.33 s', '1.33 s'], a: 0,
      why: 'The beat frequency is 1.5 Hz, so the loud moments are 1/1.5 = 0.67 s apart.' }
  ],
  applications: [
    'Tuning instruments by ear, and the beat rates piano tuners count to set equal temperament.',
    'Radio receivers (superheterodyne) shift every station to one fixed intermediate frequency by beating it with a local oscillator.',
    'Doppler radar and ultrasound read out the Doppler shift as a beat between the echo and the transmitted wave.'
  ],
  sim: 'sound-beats'
},

{
  id: 'air-columns', parent: 'sound-waves', title: 'Resonance in air columns', level: 2,
  short: 'The air in a tube has natural frequencies, just like a string. A pipe open at both ends resonates at every harmonic of v/2L; a pipe closed at one end only at the odd harmonics of v/4L.',
  keywords: ['air column', 'organ pipe', 'open pipe', 'closed pipe', 'stopped pipe', 'resonance tube', 'end correction', 'odd harmonics', 'quarter-wave resonator', 'bottle', 'flute', 'clarinet', 'pressure node', 'displacement antinode'],
  prereq: ['standing-waves', 'speed-of-sound', 'wave-reflection'],
  related: ['musical-instruments', 'harmonics-timbre', 'the-ear', 'driven-oscillations'],
  body: `
Blow across the top of an empty bottle and it hoots. Sound bounces back and forth inside: from the closed bottom, and — surprisingly — from the open neck too, where the confined wave suddenly meets the open air, a large change of impedance ([[wave-reflection]]). The reflections build [[standing-waves|standing waves]], and only certain frequencies fit.

### Two kinds of end
- A **closed end** stops the air moving: a **displacement node**. The pressure swings most there: a pressure antinode.
- An **open end** holds the pressure close to atmospheric: a **pressure node**. The air sloshes in and out most freely there: a displacement antinode.

The displacement and pressure patterns are a quarter of a wavelength apart, so every displacement node is a pressure antinode and vice versa.

### Open at both ends
A displacement antinode at each end fits a whole number of half-wavelengths, exactly like a string (with nodes and antinodes swapped):

$$f_n = \\frac{n v}{2L}, \\qquad n = 1, 2, 3, \\dots$$

All harmonics are present. Flutes and open organ pipes work this way.

### Closed at one end
A node at the closed end and an antinode at the open end fit an **odd** number of quarter-wavelengths, $L = \\lambda/4, 3\\lambda/4, 5\\lambda/4, \\dots$:

$$f_n = \\frac{n v}{4L}, \\qquad n = 1, 3, 5, \\dots$$

The fundamental is an octave below that of an open pipe of the same length, and the even harmonics are missing. The clarinet, closed by the reed at one end and nearly cylindrical, is the classic example: its tone is hollow and its next resonance above the fundamental is the third harmonic, so it overblows by a twelfth (an octave and a fifth) where a flute overblows by an octave.

### Numbers
The longest organ pipes, about 10 m, sound near 17 Hz — felt as much as heard. At the other extreme, your ear canal is a tube about 2.5 cm long closed by the eardrum; its quarter-wave resonance, $343/(4 \\times 0.025) \\approx 3.4$ kHz, is one reason we hear best around 3 kHz ([[the-ear]]).

### End correction
The antinode at an open end sits slightly outside the tube, because the air just beyond the opening moves with the air inside. For an unflanged tube of radius $r$ each open end behaves as if about $0.6\\,r$ longer. Instrument makers allow for it.

### Measuring the speed of sound
Hold a tuning fork over a tube dipped in water and raise the tube: the sound booms at a set of lengths. Successive resonance lengths differ by exactly half a wavelength — and the end correction cancels in the difference — so $v = 2f(L_2 - L_1)$.

> [!tip] Wind instruments go sharp as they warm up (the speed of sound rises with temperature), while string instruments tend to go flat (their strings expand and lose tension). Orchestras tune after the instruments have warmed.
`,
  ideas: [
    'Sound reflects from both closed and open ends of a tube, so the air column has standing waves and natural frequencies.',
    'A closed end is a displacement node (pressure antinode); an open end is a displacement antinode (pressure node).',
    'Open–open pipe: fₙ = nv/2L, all harmonics. Closed–open pipe: fₙ = nv/4L, odd n only.',
    'Closing one end of a pipe drops its fundamental by an octave.',
    'Warmer air means faster sound and higher resonances: wind instruments go sharp as they warm up.'
  ],
  pitfalls: [
    'Sound escapes freely from an open end, so nothing reflects there — The sudden change from a narrow tube to open air is an impedance mismatch; most low-frequency sound is reflected back into the tube.',
    'A closed pipe has all the harmonics, like a string — Only the odd ones: 1, 3, 5, … times its fundamental.',
    'Displacement nodes are also pressure nodes — They are opposite: where the air cannot move, the pressure swings the most.'
  ],
  formulas: [
    {
      name: 'Pipe open at both ends',
      expr: 'f = n*v/(2*L)', tex: 'f_n = \\frac{n v}{2L}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number (1, 2, 3 …)', int: true, value: 1 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 0.6 }
      },
      practice: { unknowns: ['f', 'L'] },
      stories: { f: 'What is the frequency of harmonic {n} of an open organ pipe {L} long, with sound travelling at {v}?', L: 'How long must an open pipe be for harmonic {n} to sound at {f}, with sound at {v}?' }
    },
    {
      name: 'Pipe closed at one end',
      expr: 'f = (2*m - 1)*v/(4*L)', tex: 'f = \\frac{(2m - 1)\\,v}{4L}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'Hz' },
        m: { name: 'mode number (1, 2, 3 … gives harmonics 1, 3, 5 …)', int: true, value: 1 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 0.3 }
      },
      practice: { unknowns: ['f', 'L'] },
      note: 'Only odd harmonics: $2m - 1 = 1, 3, 5, \\dots$ For the ear canal, $L \\approx 2.5$ cm gives about 3.4 kHz.',
      stories: { f: 'A tube {L} long is closed at one end. With sound at {v}, what is the frequency of its mode {m}?', L: 'How long must a stopped organ pipe be to sound {f} in mode {m}, with sound at {v}?' }
    },
    {
      name: 'Speed of sound from a resonance tube',
      expr: 'v = 2*f*(L2 - L1)', tex: 'v = 2f\\,(L_2 - L_1)',
      vars: {
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', min: 300, max: 360 },
        f: { name: 'tuning-fork frequency', q: 'frequency', unit: 'Hz', value: 512 },
        L2: { name: 'second resonance length', q: 'length', unit: 'cm', value: 49.7 },
        L1: { name: 'first resonance length', q: 'length', unit: 'cm', value: 16.2 }
      },
      note: 'Successive resonances of a closed tube are half a wavelength apart; the end correction cancels in the difference.',
      stories: { v: 'Over a tube in water, a {f} tuning fork gives resonances at air-column lengths of {L1} and {L2}. What is the speed of sound?' }
    }
  ],
  examples: [
    {
      title: 'Open or closed?',
      q: 'A pipe 0.50 m long is open at both ends. What are its three lowest resonances? What if one end is closed? (v = 343 m/s)',
      steps: [
        'Open: $f_1 = v/2L = 343/1.00 = 343$ Hz, then 686 Hz and 1029 Hz.',
        'Closed: $f_1 = v/4L = 343/2.00 = 171.5$ Hz, then only odd multiples: 514.5 Hz and 857.5 Hz.',
        'Closing the end dropped the fundamental an octave and removed every even harmonic.'
      ],
      a: 'Open: 343, 686, 1029 Hz. Closed: 172, 515, 858 Hz.'
    },
    {
      title: 'The resonance tube',
      q: 'A 512 Hz fork held over a tube in water gives resonances at air-column lengths of 16.2 cm and 49.7 cm. Find the speed of sound and the end correction.',
      steps: [
        '$L_2 - L_1 = 33.5$ cm $= \\lambda/2$, so $\\lambda = 67.0$ cm.',
        '$v = f\\lambda = 512 \\times 0.670 = 343\\ \\mathrm{m/s}$.',
        'The first resonance is a quarter-wave: $L_1 + e = \\lambda/4 = 16.75$ cm, so the end correction is $e = 0.55$ cm — about 0.6 times the radius of a tube 9 mm in radius.'
      ],
      a: 'v ≈ 343 m/s; end correction ≈ 0.55 cm'
    }
  ],
  quiz: [
    { q: 'A pipe closed at one end has a fundamental of 200 Hz. Which of these is also one of its resonances?', choices: ['400 Hz', '600 Hz', '800 Hz', '300 Hz'], a: 1,
      why: 'A closed pipe has only odd harmonics: 200, 600, 1000 Hz, …' },
    { q: 'Close one end of an open organ pipe. Its fundamental…', choices: ['doubles', 'drops an octave (halves)', 'is unchanged', 'rises by a fifth'], a: 1,
      why: 'Open: v/2L. Closed: v/4L — half the frequency.' },
    { q: 'At the closed end of a pipe, the air…', choices: ['moves the most and its pressure hardly changes', 'does not move and its pressure changes the most', 'does not move and its pressure does not change', 'moves the most and its pressure changes the most'], a: 1,
      why: 'A closed end is a displacement node and a pressure antinode.' },
    { q: 'A flute tuned in a cool room is played in a hot hall. It now plays…', choices: ['flat', 'sharp', 'in tune', 'an octave higher'], a: 1,
      why: 'The speed of sound rises with temperature and every resonance f = nv/2L rises with it.' },
    { q: 'Why does a clarinet overblow to a twelfth while a flute overblows to an octave?', choices: ['The clarinet is longer', 'The clarinet acts as a pipe closed at one end, so its next resonance is the 3rd harmonic', 'The reed doubles the frequency', 'The flute has more keys'], a: 1,
      why: 'A closed pipe has no 2nd harmonic. Its next resonance is 3f₁: an octave (×2) plus a fifth (×1.5).' }
  ],
  applications: [
    'Every wind instrument, from organ pipes and flutes to clarinets and trumpets, is a resonating air column.',
    'Quarter-wave and Helmholtz resonators tune car exhausts and air intakes to cancel booming drone.',
    'The ear canal\'s quarter-wave resonance boosts our hearing around 3 kHz, where many speech sounds lie.'
  ],
  sim: 'sound-pipes'
},

{
  id: 'shock-waves', parent: 'sound-waves', title: 'Shock waves and sonic booms', level: 2,
  short: 'A source faster than sound outruns its own waves. They pile up into a cone-shaped shock front, and when that cone sweeps over you, you hear a sonic boom.',
  keywords: ['shock wave', 'sonic boom', 'Mach number', 'Mach cone', 'supersonic', 'sound barrier', 'N-wave', 'bow wave', 'whip crack', 'Concorde', 'Cherenkov radiation'],
  prereq: ['doppler-effect', 'speed-of-sound'],
  related: ['huygens-principle', 'sound-intensity', 'wave-properties'],
  body: `
As a source speeds up towards the speed of sound, the [[doppler-effect|Doppler]] formula $f\\,v/(v - v_S)$ grows without limit: the crests ahead crowd closer and closer until they merge into one steep front. Beyond that the source outruns everything it emits, and the physics changes character.

### The Mach cone
The **Mach number** is the ratio of the source's speed to the speed of sound, $M = u/v$. Consider a source that has been flying for a time $t$. It has moved $ut$; the wave it emitted at the start has spread into a sphere of radius $vt$ around the starting point, and later waves into smaller spheres around later points. For $u > v$ all these spheres fit inside a cone with its tip at the source, and they all touch its surface. From the right triangle of $vt$ and $ut$, the half-angle $\\theta$ of the cone is

$$\\sin\\theta = \\frac{v}{u} = \\frac{1}{M}$$

At Mach 1 the "cone" is a flat front ($\\theta = 90°$); at Mach 2 it is 30°; the faster the source, the narrower the cone. It is the same geometry as [[huygens-principle|Huygens' construction]]: the shock is the envelope of all the wavelets.

### The sonic boom
Across the cone the pressure jumps abruptly. An aircraft makes one cone at its nose and another at its tail, so the pressure on the ground traces an N-shape: a sudden rise, a steady fall to below normal, and a sudden return — the double "ba-boom", a fraction of a second apart. Concorde's boom was only about 100 Pa, a thousandth of atmospheric pressure, but its suddenness makes it startlingly loud.

The boom is **not** a one-off event at the moment an aircraft "breaks the sound barrier". The cone travels with the aircraft for as long as it is supersonic and sweeps a "boom carpet" along the ground beneath its path. Each person under it hears the boom once, when the cone passes. Because the cone trails behind, the boom arrives after the aircraft has flown overhead: for level flight at height $h$ the delay is

$$\\Delta t = \\frac{h\\sqrt{M^2 - 1}}{M v}$$

For Concorde at 17 km and Mach 2 that is almost a minute. (The air gets warmer lower down, so real shock fronts bend, and at modest Mach numbers some never reach the ground at all.)

### Shock waves close to home
- A **whip crack** is a small sonic boom: a loop running along the tapering whip speeds up until the tip exceeds the speed of sound.
- A supersonic **bullet** trails its own cone; you hear its crack before the report of the gun.
- **Thunder** starts as a shock wave from the explosively heated lightning channel.
- A boat's **bow wave** looks similar, but water waves have speeds that depend on wavelength, and a ship's wake has the same half-angle of about 19.5° whatever its speed.
- **Cherenkov light**: a charged particle moving through water faster than light travels *in water* (still slower than light in vacuum) emits a cone of blue light — the glow of a reactor pool.
`,
  ideas: [
    'A source moving faster than sound outruns its waves; they pile up into a cone-shaped shock front.',
    'The cone\'s half-angle obeys sin θ = v/u = 1/M: the faster the source, the narrower the cone.',
    'A sonic boom is heard whenever the cone sweeps past you, not only when the aircraft crosses Mach 1.',
    'An aircraft makes shocks at its nose and tail, so the boom is usually a double bang.'
  ],
  pitfalls: [
    'A sonic boom happens once, at the moment a plane breaks the sound barrier — It is produced continuously while the plane is supersonic, and trails along the ground behind it.',
    'You hear a supersonic plane coming — You hear nothing until the cone reaches you, by which time the plane has already passed overhead.',
    'The boom comes from the engines — Any object moving faster than sound makes one, a glider or a bullet as much as a jet; engine noise is a separate sound.'
  ],
  formulas: [
    {
      name: 'Mach number',
      expr: 'M = u/v',
      vars: {
        M: { name: 'Mach number' },
        u: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 590 },
        v: { name: 'local speed of sound', q: 'speed', unit: 'm/s', value: 295, min: 280, max: 360 }
      },
      practice: { unknowns: ['M', 'u'] },
      note: 'Use the speed of sound where the object is: about 295 m/s at airliner cruising height, 343 m/s at 20 °C near the ground.',
      stories: { M: 'An aircraft flies at {u} where the speed of sound is {v}. What is its Mach number?', u: 'How fast in m/s is Mach {M} where the speed of sound is {v}?' }
    },
    {
      name: 'Mach cone angle',
      expr: 'sin(theta) = v/u', tex: '\\sin\\theta = \\frac{v}{u}', solveFor: 'theta',
      vars: {
        theta: { name: 'half-angle of the cone', q: 'angle', unit: '°', min: 0, max: 90 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 280, max: 360 },
        u: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 686 }
      },
      practice: { unknowns: ['theta', 'u'] },
      note: 'Only for $u > v$; below the speed of sound there is no cone.',
      stories: { theta: 'A bullet flies at {u} through air where sound travels at {v}. What is the half-angle of its shock cone?', u: 'A photograph shows a shock cone of half-angle {theta} around a projectile in air where sound travels at {v}. How fast is it moving?' }
    },
    {
      name: 'Delay of the boom after the aircraft passes overhead',
      expr: 'dt = h*sqrt(M^2 - 1)/(M*v)', tex: '\\Delta t = \\frac{h\\sqrt{M^2 - 1}}{M v}',
      vars: {
        dt: { name: 'time from overhead to boom', q: 'time', unit: 's', tex: '\\Delta t' },
        h: { name: 'flight altitude', q: 'length', unit: 'km', value: 17 },
        M: { name: 'Mach number', value: 2, min: 1, max: 5 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 295, min: 280, max: 350 }
      },
      practice: { unknowns: ['dt', 'h'] },
      note: 'Level flight in air of uniform temperature. Real shocks bend as the air warms towards the ground.',
      stories: { dt: 'An aircraft flies at Mach {M} at an altitude of {h}, where sound travels at {v}. How long after it passes overhead do you hear the boom?' }
    }
  ],
  examples: [
    {
      title: 'Concorde\'s boom',
      q: 'Concorde cruised at Mach 2.0 at about 17 km, where sound travels at 295 m/s. Find the half-angle of its Mach cone and how long after it passed overhead the boom arrived (ignoring the bending of the shock).',
      steps: [
        '$\\sin\\theta = 1/M = 0.5$, so $\\theta = 30°$.',
        'Its speed was $u = Mv = 590$ m/s.',
        'The cone reaches you when the aircraft is $h/\\tan\\theta = h\\sqrt{M^2 - 1} = 17 \\times 1.73 = 29.4$ km past you.',
        '$\\Delta t = 29\\,400 / 590 = 50$ s.'
      ],
      a: 'θ = 30°; the boom arrives about 50 s after the aircraft passes overhead.'
    },
    {
      title: 'A rifle bullet',
      q: 'A rifle bullet flies at 850 m/s through air at 20 °C. What is its Mach number and the half-angle of its shock cone?',
      steps: [
        '$M = 850/343 = 2.48$.',
        '$\\theta = \\arcsin(1/2.48) = \\arcsin 0.404 = 23.8°$.'
      ],
      a: 'Mach 2.5, cone half-angle about 24°'
    }
  ],
  quiz: [
    { q: 'A jet flies at Mach 1.5. The half-angle of its Mach cone is about…', choices: ['30°', '42°', '56°', '67°'], a: 1,
      why: 'sin θ = 1/1.5 = 0.667, so θ = 41.8°.' },
    { q: 'A supersonic jet flies over you at constant speed. When do you hear its boom?', choices: ['When it first exceeded Mach 1, wherever that happened', 'The moment it is directly overhead', 'Some time after it has passed overhead, when the cone reaches you', 'Never: the boom goes upwards'], a: 2,
      why: 'The cone trails behind the aircraft, so it sweeps over you after the aircraft has passed.' },
    { q: 'As an aircraft flies faster (above Mach 1), its Mach cone becomes…', choices: ['wider', 'narrower', 'unchanged', 'a flat plane'], a: 1,
      why: 'sin θ = 1/M falls as M grows.' },
    { q: 'The crack of a whip is a small sonic boom.', a: true,
      why: 'The tip of a cracking whip moves faster than sound, about 343 m/s, and drags a tiny shock wave with it.' }
  ],
  applications: [
    'Supersonic aircraft design: shaping the nose and body to spread out the pressure jump into a quieter "thump".',
    'Cherenkov detectors identify fast particles by the angle of the cone of light they emit.',
    'Lithotripsy breaks up kidney stones with focused shock waves generated outside the body.'
  ],
  history: 'Ernst Mach and Peter Salcher photographed the shock cones around supersonic bullets in 1887, which is why speeds relative to sound bear Mach\'s name. Chuck Yeager first flew faster than sound in level flight in the Bell X-1 on 14 October 1947.',
  sim: { id: 'sound-doppler', params: { M: 1.5 } }
},

{
  id: 'ultrasound', parent: 'sound-waves', title: 'Ultrasound', level: 2,
  short: 'Sound above 20 kHz, too high for human ears. Its short wavelength lets bats hunt insects, ships map the sea floor and doctors see inside the body with echoes.',
  keywords: ['ultrasound', 'ultrasonic', 'echolocation', 'sonar', 'bats', 'dolphins', 'medical imaging', 'sonography', 'pulse-echo', 'piezoelectric', 'transducer', 'attenuation', 'non-destructive testing', 'cavitation'],
  prereq: ['speed-of-sound', 'wave-reflection', 'sound-intensity'],
  related: ['doppler-effect', 'resolution', 'the-ear', 'wave-properties'],
  body: `
Human hearing stops near 20 kHz, and lower as we age. Everything above is **ultrasound**: the same physics as audible sound, only at frequencies we cannot hear.

### Why go higher?
Wavelength. A wave reflects usefully only from objects at least comparable to its wavelength, and it can only be focused into a spot a few wavelengths wide. At 50 kHz in air the wavelength is $343/50\\,000 = 6.9$ mm — small enough for a bat to detect a moth. At 5 MHz in soft tissue, where sound travels at about 1540 m/s, it is 0.31 mm — small enough to see the valves of a beating heart.

### Pulse–echo ranging
Send a short pulse, time its echo, and the depth of the reflecting boundary is

$$d = \\frac{v t}{2}$$

— the factor 2 because the pulse goes there and back. A scanner assumes 1540 m/s in tissue, so an echo arriving 130 µs after the pulse comes from 10 cm deep. Sweeping the beam across the body and repeating the pulse thousands of times a second builds a moving image line by line.

### Depth against detail
Higher frequencies give finer detail but are absorbed faster. Soft tissue weakens ultrasound by roughly 0.5 dB per centimetre per megahertz, each way. At 3.5 MHz an echo from 15 cm deep loses about 50 dB on its round trip — fine for scanning the abdomen or a pregnancy. At 10 MHz the same depth would cost 150 dB, far too much, so high frequencies are kept for shallow structures such as tendons, the thyroid or the eye.

### Where echoes come from
Echoes arise wherever the acoustic impedance changes ([[wave-reflection]]). Between two soft tissues only about 1% of the power reflects, which is enough to outline organs; bone reflects strongly; air reflects almost everything. That is why a gel is spread between probe and skin, and why ultrasound cannot see through the lungs, through gas in the bowel, or easily through the adult skull.

### Making it
Ultrasound is made and detected by **piezoelectric** crystals, usually a ceramic such as lead zirconate titanate: a voltage makes the crystal change shape, and a squeeze makes it produce a voltage, so the same element sends the pulse and hears the echo. Medical probes contain rows of hundreds of tiny elements whose timing steers and focuses the beam.

### Nature and technology
- **Bats** call at roughly 20–120 kHz and judge range, size and, from the [[doppler-effect|Doppler shift]], the motion of their prey. **Dolphins** click at up to about 150 kHz.
- **Sonar** and echo sounders map the sea floor and find fish (often at lower frequencies, which travel farther).
- **Industry**: finding cracks in welds, rails and aircraft parts; measuring wall thickness; ultrasonic cleaning baths (around 40 kHz), where collapsing bubbles scrub surfaces; plastic welding.
- **Medicine**: imaging, Doppler measurement of blood flow, and focused ultrasound that heats and destroys small tumours.

Diagnostic ultrasound is ordinary mechanical vibration, not ionising radiation, and at imaging intensities it produces no significant heating.
`,
  ideas: [
    'Ultrasound is sound above about 20 kHz; it obeys the same wave physics as audible sound.',
    'Short wavelengths resolve small details and can be focused into narrow beams.',
    'Pulse–echo ranging gives the depth from the round-trip time: d = vt/2.',
    'Higher frequency means sharper images but stronger absorption, so depth is traded against detail.',
    'Echoes come from changes of acoustic impedance; air gaps reflect almost everything, hence the gel.'
  ],
  pitfalls: [
    'Ultrasound is a kind of radiation like X-rays — It is mechanical sound, just too high to hear; it is not ionising.',
    'A higher frequency is always better for imaging — It sharpens the picture but is absorbed faster; deep organs need lower frequencies.',
    'The echo time gives the depth as v·t — The pulse travels there and back, so the depth is half of v·t.'
  ],
  formulas: [
    {
      name: 'Depth from the echo time',
      expr: 'd = v*t/2', tex: 'd = \\frac{v t}{2}',
      vars: {
        d: { name: 'depth of the reflecting boundary', q: 'length', unit: 'cm' },
        v: { name: 'speed of sound in the medium', q: 'speed', unit: 'm/s', value: 1540, min: 1400, max: 1650 },
        t: { name: 'round-trip time of the echo', q: 'time', unit: 'µs', value: 130 }
      },
      practice: { unknowns: ['d', 't'] },
      stories: {
        d: 'An echo returns to an ultrasound probe {t} after the pulse left. Taking {v} for soft tissue, how deep is the reflecting boundary?',
        t: 'How long does an echo take to return from a boundary {d} deep in tissue where sound travels at {v}?'
      }
    },
    {
      name: 'Wavelength in the medium',
      expr: 'lambda = v/f', tex: '\\lambda = \\frac{v}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'mm' },
        v: { name: 'speed of sound in the medium', q: 'speed', unit: 'm/s', value: 1540, min: 1400, max: 1650 },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 5 }
      },
      practice: { unknowns: ['lambda', 'f'] },
      note: 'The finest detail an image can show along the beam is roughly a wavelength or two.',
      stories: { lambda: 'What is the wavelength of {f} ultrasound in tissue where sound travels at {v}?', f: 'What frequency gives a wavelength of {lambda} in tissue where sound travels at {v}?' }
    },
    {
      name: 'Round-trip loss of an echo',
      expr: 'L = 2*alpha*f*d', tex: 'L = 2\\alpha f d',
      vars: {
        L: { name: 'loss on the way there and back', q: 'soundlevel', unit: 'dB' },
        alpha: { name: 'attenuation coefficient', unit: 'dB/(cm·MHz)', value: 0.5, tex: '\\alpha' },
        f: { name: 'frequency, in MHz', value: 5 },
        d: { name: 'depth, in cm', value: 6 }
      },
      note: 'Soft tissue averages about 0.5 dB per cm per MHz, each way. Enter $f$ in MHz and $d$ in cm. Reflection losses at the boundary itself come on top.',
      stories: { L: 'A {f} MHz probe images a boundary {d} cm deep in tissue with an attenuation of {alpha}. How much weaker is the echo from absorption alone?', d: 'A scanner can tolerate a round-trip loss of {L}. At {f} MHz in tissue with {alpha}, how many centimetres deep can it see?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a probe',
      q: 'An organ lies 12 cm deep. Compare a 3.5 MHz and a 10 MHz probe: the wavelength in tissue (1540 m/s) and the round-trip absorption at 0.5 dB/(cm·MHz).',
      steps: [
        '3.5 MHz: $\\lambda = 1540/3.5\\times10^6 = 0.44$ mm; loss $= 2 \\times 0.5 \\times 3.5 \\times 12 = 42$ dB.',
        '10 MHz: $\\lambda = 0.15$ mm; loss $= 2 \\times 0.5 \\times 10 \\times 12 = 120$ dB.',
        'A factor of $10^{12}$ in power is far too much to recover from the noise: the 10 MHz probe gives sharper images, but only of shallow structures.'
      ],
      a: '3.5 MHz: 0.44 mm, 42 dB — usable. 10 MHz: 0.15 mm, 120 dB — too deep for it.'
    },
    {
      title: 'A bat and a moth',
      q: 'A bat calls at 50 kHz. What is the wavelength in air (343 m/s), and how long does the echo from a moth 3.0 m away take to return?',
      steps: [
        '$\\lambda = 343/50\\,000 = 6.9$ mm — comparable to a moth.',
        '$t = 2d/v = 2 \\times 3.0/343 = 17.5$ ms.',
        'Bats shorten their calls and call faster as they close in, so that echoes never overlap with the next call.'
      ],
      a: 'λ ≈ 7 mm; the echo takes about 17 ms.'
    }
  ],
  quiz: [
    { q: 'Why do bats use ultrasound rather than audible sound to hunt insects?', choices: ['Insects cannot hear ultrasound', 'Its short wavelength reflects well from small objects and resolves fine detail', 'Ultrasound travels faster in air', 'Ultrasound carries farther through air'], a: 1,
      why: 'Only waves not much longer than the target reflect usefully. (Ultrasound is in fact absorbed faster in air, and many moths can hear it.)' },
    { q: 'An ultrasound echo returns 65 µs after the pulse, in tissue where sound travels at 1540 m/s. The boundary is at…', choices: ['10 cm', '5.0 cm', '2.5 cm', '0.1 cm'], a: 1,
      why: 'd = vt/2 = 1540 × 65 × 10⁻⁶ / 2 = 0.050 m.' },
    { q: 'A sonographer switches from a 3 MHz probe to a 12 MHz probe. The image becomes…', choices: ['sharper and deeper', 'sharper but shallower', 'blurrier but deeper', 'no different'], a: 1,
      why: 'A quarter of the wavelength gives finer detail, but absorption, proportional to frequency, limits the depth.' },
    { q: 'Ultrasound images the lungs well because air carries sound easily.', a: false,
      why: 'The huge impedance mismatch between tissue and air reflects almost all the sound at the lung surface, so little gets through.' }
  ],
  applications: [
    'Pregnancy scans, echocardiography and Doppler measurement of blood flow.',
    'Sonar, echo sounders and fish finders.',
    'Non-destructive testing: cracks in welds, rails and aircraft parts, and the wall thickness of pipes and tanks.',
    'Ultrasonic cleaning baths, plastic welding and humidifiers.'
  ]
}

);
