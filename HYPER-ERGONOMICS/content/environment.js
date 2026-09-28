/* HYPER-ERGONOMICS · content/environment.js
 * The physical environment: noise and vibration (decibels and A-weighting, exposure limits, hearing protection,
 * noise control, hand-arm and whole-body vibration) and climate, light and air (thermal comfort, heat stress, cold
 * stress, lighting levels, glare and colour, indoor air). Simulations in sims/environment.js (prefix en-). */
Hyper.add(

{
  id: 'noise-basics', parent: 'noise-vibration', title: 'Sound, decibels and A-weighting', level: 1,
  short: 'Sound levels are counted in decibels, a logarithmic scale: two equal machines are 3 dB louder than one, doubling the distance outdoors takes 6 dB away, and the loudest source sets the level. Levels for hearing risk are A-weighted, dB(A), to follow the ear; peaks and rumble are judged in dB(C).',
  keywords: ['decibel', 'dB(A)', 'A-weighting', 'C-weighting', 'sound pressure level', 'sound power', 'adding decibels', 'inverse square law', 'distance', 'noise level', 'low-frequency noise', 'sound level meter', 'noise emission'],
  prereq: ['physics:sound-intensity', 'physics:the-ear', 'math:logarithms'],
  related: ['noise-exposure', 'noise-control', 'hearing-protection', 'alarms-warnings', 'office-layout', 'medicine:hearing-balance', 'motors:motor-noise', 'math:logarithmic-scales'],
  body: `
Sound is a tiny, rapid ripple of air pressure. The faintest tone a young ear can detect at 1 kHz is a pressure swing of about 20 micropascals; a chipping hammer at arm's length makes about 20 pascals — a million times more — and the ear handles both. To fit that span onto a usable scale, acoustics counts in **decibels**, a [[?logarithm|logarithmic]] measure of the ratio to the threshold:

$$L_p = 20\\log_{10}\\frac{p}{p_0}, \\qquad p_0 = 20\\ \\mu\\mathrm{Pa}$$

Every 20 dB is a factor of ten in pressure and every 10 dB a factor of ten in sound energy (the [[physics:sound-intensity|intensity]]). A rise of 10 dB sounds roughly twice as loud; 3 dB doubles the energy yet is barely noticed. The inner ear's hair cells, however, respond to energy, not to loudness (see [[physics:the-ear]]).

### Typical levels
| Source (typical, rounded; real machines vary widely) | dB(A) |
|---|---|
| Quiet office, library | 35–45 |
| Conversation at 1 m | 55–65 |
| Busy open-plan office, call centre | 55–70 |
| Lathe or milling machine, at the operator | 80–90 |
| Angle grinder, circular saw, at the operator | 95–105 |
| Chainsaw, road breaker, at the operator | 100–110 |
| Compressed-air blow gun, riveting | 100–115 |
| Inside tracked military vehicles and helicopters | often above 100 |

Machinery sold in the EU must declare its noise: the A-weighted emission sound pressure at the workstation when it exceeds 70 dB(A), and the sound power when that exceeds 80 dB(A) (Machinery Directive 2006/42/EC). Those figures let a buyer compare machines before anyone is exposed.

### A-weighting: measuring like an ear
The ear is far less sensitive to low and very high frequencies than to the speech range around 1–4 kHz, especially at moderate levels. A sound-level meter mimics this with the **A-weighting** filter: it takes about 26 dB off at 63 Hz, 16 dB at 125 Hz, 9 dB at 250 Hz and 3 dB at 500 Hz, nothing at 1 kHz, and adds about 1 dB at 2–4 kHz. Because hearing damage follows the A-weighted energy closely, occupational limits are in dB(A). The **C-weighting** is almost flat (−3 dB at 31.5 Hz and 8 kHz) and is used for **peaks** — impacts, presses, gunfire — limited in dB(C).

A-weighting has a blind spot: **rumble**. Engines, fans, compressors and vehicles put much of their energy below 200 Hz, which dB(A) discounts, yet low-frequency noise is tiring, carries through walls and gets past hearing protectors. When the C-weighted level exceeds the A-weighted one by more than about 15–20 dB, there is a lot of low-frequency sound to deal with.

### Adding sources
Decibels do not add like kilograms: energies add, so levels combine through their [[?exponent|powers of ten]],

$$L = 10\\log_{10}\\left(10^{L_1/10} + 10^{L_2/10} + \\dots\\right)$$

| Difference between two levels (dB) | 0 | 1 | 2 | 3 | 4 | 6 | 10 |
|---|---|---|---|---|---|---|---|
| Add to the louder (dB) | +3.0 | +2.5 | +2.1 | +1.8 | +1.5 | +1.0 | +0.4 |

Two equal machines are 3 dB louder than one, ten equal machines 10 dB louder. A machine 10 dB quieter than its neighbour adds almost nothing, so **noise control starts with the loudest source** at the listener: quietening the others first changes nothing anyone can measure.

### Distance
Outdoors, sound from a small source spreads over a sphere and its intensity falls with the square of the distance: the level drops **6 dB for each doubling** of distance,

$$L_2 = L_1 - 20\\log_{10}\\frac{r_2}{r_1}$$

A long line of sources — a conveyor, a busy road — loses only 3 dB per doubling. Indoors, walls, floor and ceiling send the sound back, and a few metres from a machine a **reverberant field** takes over whose level hardly changes with distance ([[noise-control]] calculates it). Close to a machine the direct sound dominates: an operator at 0.5 m receives 6 dB more than a colleague at 1 m.

### A quick check: the voice
If people must **raise their voice** to talk at about 2 m for much of the day, the daily exposure is probably 80 dB(A) or more; if they must **shout** to be understood at 1 m, probably 85–90 dB(A) or more. That is the moment to measure (see [[noise-exposure]]).

### Settings
| Setting | Typical levels | What matters |
|---|---|---|
| Office, control room | 35–70 dB(A) | speech and concentration: intelligible talk disturbs far below any hearing risk |
| Workshop and industry | 75–105 dB(A) | hearing damage over years; alarms and speech masked |
| Military | vehicles, aircraft, generators 90–115 dB(A), plus impulses | hearing loss, tinnitus, crew communication |
| Field | plant, chainsaws, tractors 85–110 dB(A) | long days beside engines; no walls to absorb, but no reverberation either |

In the simulation, place machines on a workshop floor and move the listener. Watch the level map, the +3 dB of a second equal machine and the 6 dB per doubling of distance, and compare the A-weighted level of a low rumble with a high whine of the same unweighted level.

> [!key] Decibels are logarithmic: equal sources add 3 dB, doubling the distance outdoors takes away 6 dB, and the loudest source sets the level. Use dB(A) for hearing risk, dB(C) for peaks and low-frequency content.
`,
  ideas: [
    'The decibel scale compresses a million-to-one range of sound pressure: +10 dB is ten times the energy and sounds about twice as loud.',
    'Levels add by energy: two equal sources give +3 dB, ten give +10 dB, and a source 10 dB quieter adds only 0.4 dB.',
    'Outdoors a small source loses 6 dB per doubling of distance; indoors the reverberant field sets a floor.',
    'A-weighting follows the ear\'s sensitivity and predicts hearing damage; C-weighting is used for peaks and to reveal low-frequency rumble.'
  ],
  pitfalls: [
    'Two 90 dB(A) machines make 180 dB(A) — Energies add, not decibels: together they make 93 dB(A).',
    'Quietening any machine helps the operator — Only the loudest sources at the listener matter; removing one 10 dB below the rest lowers the level by 0.4 dB.',
    'A low number in dB(A) means a harmless, pleasant sound — A-weighting discounts low frequencies, so engine and fan rumble can be tiring and hard to block even at moderate dB(A).'
  ],
  formulas: [
    {
      name: 'Sound pressure level',
      expr: 'L = 20*log(p/p0)', tex: 'L_p = 20\\log_{10}\\dfrac{p}{p_0}',
      vars: {
        L: { name: 'sound pressure level', q: 'soundlevel', unit: 'dB', tex: 'L_p' },
        p: { name: 'rms sound pressure', q: 'pressure', unit: 'Pa', value: 0.2 },
        p0: { name: 'reference pressure (threshold of hearing)', q: 'pressure', unit: 'µPa', value: 20, fixed: true, tex: 'p_0' }
      },
      note: 'For A-weighted levels, p is the A-weighted pressure. 1 Pa is 94 dB, 20 Pa is 120 dB.',
      stories: { L: 'A sound has an rms pressure of {p}. What is its level?', p: 'A machine measures {L}. What rms sound pressure is that?' }
    },
    {
      name: 'Adding two sources',
      expr: 'L = 10*log(10^(L1/10) + 10^(L2/10))', tex: 'L = 10\\log_{10}\\left(10^{L_1/10} + 10^{L_2/10}\\right)',
      vars: {
        L: { name: 'combined level', q: 'soundlevel', unit: 'dB' },
        L1: { name: 'level of source 1 alone', q: 'soundlevel', unit: 'dB', value: 85, tex: 'L_1' },
        L2: { name: 'level of source 2 alone', q: 'soundlevel', unit: 'dB', value: 88, tex: 'L_2' }
      },
      note: 'Incoherent sources (different machines). Solve for L1 to find what one machine contributes when the total and the other are known.',
      stories: { L: 'At a workstation one machine alone gives {L1} and another alone {L2}. What is the level with both running?', L1: 'The level with both machines running is {L}; with only the second, {L2}. What does the first machine alone produce?' }
    },
    {
      name: 'N equal sources',
      expr: 'L = L1 + 10*log(N)', tex: 'L = L_1 + 10\\log_{10} N',
      vars: {
        L: { name: 'combined level', q: 'soundlevel', unit: 'dB' },
        L1: { name: 'level of one source', q: 'soundlevel', unit: 'dB', value: 84, tex: 'L_1' },
        N: { name: 'number of equal sources', q: 'count', value: 4, int: true, min: 1 }
      },
      stories: { L: '{N} identical machines each give {L1} at a point. What is the total?', N: 'Each machine gives {L1}. How many equal machines make {L}?' }
    },
    {
      name: 'Level and distance from a small source outdoors',
      expr: 'L2 = L1 - 20*log(r2/r1)', tex: 'L_2 = L_1 - 20\\log_{10}\\dfrac{r_2}{r_1}',
      vars: {
        L2: { name: 'level at distance r₂', q: 'soundlevel', unit: 'dB', tex: 'L_2' },
        L1: { name: 'level at distance r₁', q: 'soundlevel', unit: 'dB', value: 100, tex: 'L_1' },
        r1: { name: 'reference distance', q: 'length', unit: 'm', value: 1, tex: 'r_1' },
        r2: { name: 'new distance', q: 'length', unit: 'm', value: 4, tex: 'r_2' }
      },
      note: 'Free field (outdoors, away from reflecting surfaces): −6 dB per doubling of distance. Indoors the reverberant field makes the fall smaller.',
      stories: { L2: 'A grinder gives {L1} at {r1}. What does a helper at {r2} receive outdoors?', r2: 'A pump gives {L1} at {r1}. Outdoors, how far away does it fall to {L2}?' }
    }
  ],
  examples: [
    {
      title: 'Which machine to quieten?',
      q: 'At a workstation a press alone measures 88 dB(A) and a conveyor alone 85 dB(A). What is the level with both running, and what does quietening each one achieve?',
      steps: [
        'Both: $10\\log_{10}(10^{8.8} + 10^{8.5}) = 10\\log_{10}(6.31\\times10^{8} + 3.16\\times10^{8}) = 89.8$ dB(A).',
        'Silence the conveyor completely: 88.0 dB(A), only 1.8 dB less.',
        'Silence the press instead: 85.0 dB(A), 4.8 dB less — and every further dB taken off the press counts almost fully until it falls below the conveyor.'
      ],
      a: '89.8 dB(A). Work on the press, the louder source, first.'
    },
    {
      title: 'A helper standing back',
      q: 'An angle grinder gives 100 dB(A) at 1 m. Outdoors, what does a helper at 4 m receive?',
      steps: [
        '4 m is two doublings of 1 m: $100 - 20\\log_{10}(4/1) = 100 - 12.0 = 88.0$ dB(A).',
        'Indoors, reflections would add a reverberant field, so the helper would get more than 88 dB(A).'
      ],
      a: 'About 88 dB(A) — still above the 85 dB(A) action value if it lasts most of the day.'
    },
    {
      title: 'Rumble or whine',
      q: 'Two sounds each measure 90 dB unweighted: a fan hum concentrated at 125 Hz and a whine at 2 kHz. What does each read in dB(A)?',
      steps: [
        'The A-weighting is about −16.1 dB at 125 Hz: $90 - 16.1 \\approx 74$ dB(A).',
        'At 2 kHz it is about +1.2 dB: about 91 dB(A).',
        'The whine is the hearing hazard; the hum is the one that disturbs, carries through walls and gets past earplugs — look at its dB(C).'
      ],
      a: 'About 74 dB(A) for the hum and 91 dB(A) for the whine.'
    }
  ],
  quiz: [
    { q: 'Two identical compressors each give 90 dB(A) at a point. What is the level with both running?', choices: ['93 dB(A)', '180 dB(A)', '90 dB(A)', '96 dB(A)'], a: 0, why: 'Energies add: twice the energy is 10 log₁₀ 2 = 3 dB more.' },
    { q: 'Outdoors you move from 2 m to 8 m from a small source. By how much does the level fall?', choices: ['12 dB', '6 dB', '24 dB', '4 dB'], a: 0, why: 'Two doublings of distance, 6 dB each, in a free field.' },
    { q: 'Switching off a machine that alone gives 10 dB less than the rest of the room lowers the level by only about 0.4 dB.', a: true, why: '10 log₁₀(1 + 0.1) = 0.41 dB: the quieter source carries a tenth of the energy.' },
    { q: 'Why are hearing-damage limits written in dB(A)?', choices: ['A-weighting follows the ear\'s sensitivity, and A-weighted energy predicts hearing loss well', 'A-weighting gives the highest reading, erring on the safe side', 'dB(A) is the only unit a meter can show', 'It removes the effect of distance'], a: 0, why: 'The A filter discounts the low frequencies the ear hears poorly; it usually reads lower than dB(C), not higher.' },
    { q: 'A pure 125 Hz hum measures 80 dB unweighted. About how many dB(A) does it read?', answer: 64, unit: 'dB(A)', why: 'The A-weighting at 125 Hz is about −16 dB: 80 − 16 = 64 dB(A).' }
  ],
  problems: [
    { q: 'Four identical machines each give 84 dB(A) at a workstation. What is the level with all four running?', answer: 90.0, unit: 'dB(A)', tol: 0.005, steps: ['$L = 84 + 10\\log_{10}4 = 84 + 6.0 = 90.0$ dB(A).'] },
    { q: 'Outdoors a pump gives 94 dB(A) at 1 m. At what distance does it fall to 80 dB(A)?', answer: 5.0, unit: 'm', tol: 0.02, steps: ['$94 - 20\\log_{10} r = 80$, so $\\log_{10} r = 0.7$.', '$r = 10^{0.7} = 5.0$ m.'] }
  ],
  ranges: [
    { dim: 'Background noise in an open-plan office', range: [45, 50], unit: 'dB(A)', who: 'people doing ordinary office and telephone work for a full day', why: 'Masks distant conversations without drowning nearby speech; far below any hearing risk.', limits: 'Intelligible speech disturbs far more than its level suggests; concentration work and meetings need quieter rooms.', setting: 'office', src: 'BS 8233 (typical design ranges for offices)' },
    { dim: 'Meeting rooms and rooms for concentrated work', range: [35, 45], unit: 'dB(A)', who: 'people listening, reading and thinking; people with hearing loss, who need quiet most', why: 'Speech is understood without raised voices; attention is not pulled away.', limits: 'Too quiet a room makes every sound and every word overheard stand out; sound insulation to the rooms around matters as much.', setting: ['office', 'school'], src: 'BS 8233 (typical design ranges)' },
    { dim: 'Machine noise at the operator\'s position (design target)', range: [null, 80], unit: 'dB(A)', who: 'every operator for a full shift, with the other machines in the room running', why: 'Below the EU lower action value: no hearing-protection programme, speech and warnings heard.', limits: 'Several machines add up; one machine at 80 dB(A) beside another gives 83. Declared emission values are measured under standard conditions, not in your room.', setting: ['workshop', 'field'], src: 'Directive 2003/10/EC (action value); Machinery Directive 2006/42/EC (declared emission)' },
    { dim: 'Auditory warning signal above the ambient noise', range: [15, null], unit: 'dB', who: 'everyone in the danger area, including people wearing hearing protectors', why: 'The signal is heard and recognised at once.', limits: 'A signal far louder than needed startles and can itself harm hearing; people with hearing loss may need flashing or vibrating signals as well.', setting: 'all', src: 'ISO 7731' }
  ],
  applications: [
    'Estimating the level at a workstation from the noise emission values declared for each machine, before buying: see [the noise exposure calculator](#/tools/environment/noise).',
    'Deciding which machine to quieten first: always the loudest at the listener.',
    'Placing compressors, generators and pumps away from workstations, rest areas and sleeping quarters — every doubling of distance outdoors takes 6 dB off.',
    'Reading a sound-level meter: dB(A) for exposure, dB(C) peak for impacts, the C − A difference for rumble.'
  ],
  history: 'The bel honours Alexander Graham Bell; the decibel came from telephone engineering, when the Bell System renamed its "transmission unit" in the late 1920s. Harvey Fletcher and Wilden Munson measured how loudness depends on frequency (1933); the A-weighting roughly follows their curve for quiet sounds. Sound-level meters and their weightings are now specified in IEC 61672-1.',
  sources: [
    'IEC 61672-1, *Electroacoustics — Sound level meters — Part 1: Specifications* (the A- and C-weightings).',
    'ISO 9612, *Acoustics — Determination of occupational noise exposure — Engineering method*.',
    'Directive 2006/42/EC on machinery, Annex I (declaring noise emission in the instructions).',
    'ISO 7731, *Ergonomics — Danger signals for public and work areas — Auditory danger signals*.',
    'BS 8233, *Guidance on sound insulation and noise reduction for buildings* (design noise levels for offices).',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, the chapter on noise and vibration.'
  ],
  sim: 'en-decibels'
},

{
  id: 'noise-exposure', parent: 'noise-vibration', title: 'Noise exposure and its limits', level: 2,
  short: 'Hearing damage follows the sound energy a person receives in a day, so level and time trade against each other: with the equal-energy rule every 3 dB halves the time allowed. Europe acts from 80 dB(A) and caps 87 dB(A) at the ear; US OSHA uses 90 dB(A) with a 5 dB rule and 85 dB(A) for its hearing programme; NIOSH recommends 85 dB(A) with 3 dB.',
  keywords: ['noise exposure', 'LEX,8h', 'daily noise exposure level', 'action value', 'exposure limit value', 'OSHA PEL', 'NIOSH REL', 'exchange rate', '3 dB rule', '5 dB rule', 'noise dose', 'TWA', 'noise-induced hearing loss', 'tinnitus', 'hearing conservation', 'dosimeter', '2003/10/EC'],
  prereq: ['noise-basics', 'medicine:hearing-balance', 'ergonomic-risk-assessment'],
  related: ['hearing-protection', 'noise-control', 'power-tools-ergonomics', 'construction-ergonomics', 'agriculture-ergonomics', 'extreme-environments', 'shift-work'],
  body: `
Noise at work rarely hurts, which is exactly why it is dangerous. A day in 95 dB(A) leaves the ears dull and ringing — a **temporary threshold shift** that recovers overnight. Repeated for years, the recovery is no longer complete: the sensory hair cells of the inner ear, which do not regrow in humans, die, starting with those tuned near 4 kHz. The result is **noise-induced hearing loss**, often with **tinnitus**: permanent, painless and gradual, first noticed as trouble following conversation in a noisy room. It is among the commonest occupational diseases, and it is preventable (see [[medicine:hearing-balance]]).

### The equal-energy rule
Damage follows the sound **energy** the ear receives, level and time together. Energy doubles with every 3 dB, so under the **equal-energy (3 dB) rule** every 3 dB more halves the time allowed. The daily exposure is the level that, spread over 8 hours, would carry the same energy:

$$L_{EX,8h} = 10\\log_{10}\\left[\\frac{1}{T_0}\\sum_i T_i\\,10^{L_i/10}\\right], \\qquad T_0 = 8\\ \\mathrm{h}$$

The [[?sum]] runs over the activities of the day: one hour at 94 dB(A) carries as much energy as eight hours at 85.

### The limits
| | Europe (Directive 2003/10/EC) | US OSHA (29 CFR 1910.95) | US NIOSH (recommended, 1998) |
|---|---|---|---|
| Daily measure | $L_{EX,8h}$, 3 dB rule | 8-h TWA, **5 dB** rule | 8-h TWA, 3 dB rule |
| First action | **80 dB(A)**: information, training, protectors available, hearing checks offered | **85 dB(A)** (50 % dose): hearing conservation programme — monitoring, audiometry, protectors, training | — |
| Second action | **85 dB(A)**: protectors worn, noise-control programme, marked zones | — | — |
| Limit | **87 dB(A) at the ear**, protectors taken into account | **90 dB(A)**: engineering and administrative controls, then protectors | **85 dB(A)** |
| Peak | 135 / 137 / 140 dB(C) | 140 dB peak for impulses | 140 dB peak |

Most other countries follow the 85 dB(A), 3 dB pattern (Australia, for example, sets 85 dB(A) over 8 hours and 140 dB(C) peak). OSHA's 5 dB rule is the outlier: it allows two hours at 100 dB(A) where the 3 dB rule allows fifteen minutes.

| Level, dB(A) | 85 | 88 | 91 | 94 | 97 | 100 | 103 | 110 |
|---|---|---|---|---|---|---|---|---|
| Time allowed, 85 dB and 3 dB rule | 8 h | 4 h | 2 h | 1 h | 30 min | 15 min | 7.5 min | 1.5 min |
| Time allowed, OSHA 90 dB and 5 dB rule | 16 h | 10.6 h | 7.0 h | 4.6 h | 3.0 h | 2.0 h | 1.3 h | 30 min |

### Why 80, 85 and 87 — and not zero
Risk climbs steeply with level. NIOSH (1998) estimated that a 40-year working life at 85 dB(A) still leaves about 8 in 100 workers with a material hearing impairment they would not otherwise have, and at 90 dB(A) about 25 in 100; ISO 1999 gives the statistical relation behind such estimates. The action values balance that risk against what can be achieved. The **virtue** of the EU scheme is that it acts early (80 dB(A)) and caps what reaches the ear (87 dB(A)). Its **limitation** is that a limit "at the ear" depends on protectors being worn and fitted — see [[hearing-protection]].

### Long shifts, weekly averages, chemicals
- A 12-hour shift at 85 dB(A) is an $L_{EX,8h}$ of 86.8 dB(A): the extra hours count, and there is less quiet time to recover.
- The EU directive allows a **weekly** average where daily exposure varies markedly, provided the limit is kept and risks are minimised.
- Some solvents (toluene, styrene), carbon monoxide and some medicines are **ototoxic** and add to the damage; hand-arm vibration may add to it too.

### Measuring it
ISO 9612 offers three strategies: **task-based** (measure each task, add them with their durations), **job-based** (random samples across a job) and **full-day** (a personal dosimeter worn all shift). Each result carries an uncertainty of a few decibels — enough to move an exposure across an action value; where it is close, act on the higher figure.

### Settings
- **Office**: rarely a hearing risk, except for call-centre headsets, where limiters guard against sudden loud bursts ("acoustic shock").
- **Workshop and industry**: grinding, cutting, hammering, presses and compressed air; a couple of hours of grinding usually dominate a fitter's day.
- **Military**: vehicles, aircraft, generators and weapons training; tinnitus and hearing loss are among the commonest service-connected disabilities of US veterans. Crews need protection that still lets them talk.
- **Field**: construction plant, chainsaws, brush cutters, tractors without cabs; long days, often in heat that makes earmuffs unpleasant.

In the simulation, build a working day from activities and watch the exposure grow hour by hour against the EU, OSHA and NIOSH scales; the bars show which activity carries the energy. [The noise exposure calculator](#/tools/environment/noise) does the same with your own figures.

> [!warn] Sudden hearing loss, a new ringing that does not settle, or pain after a loud noise needs a doctor or audiologist promptly. This page explains exposure limits; it is not medical advice, and the legal limits are those of your own country.

> [!key] Level and time trade against each other: with the 3 dB rule every 3 dB halves the time allowed, so short loud tasks outweigh long quiet ones. Europe acts from 80 dB(A) and caps 87 dB(A) at the ear; OSHA uses 90 dB(A) with 5 dB and 85 dB(A) for its hearing programme; NIOSH recommends 85 dB(A) with 3 dB.
`,
  ideas: [
    'Noise-induced hearing loss is permanent, painless and gradual; it is prevented, not cured.',
    'Under the equal-energy rule every 3 dB halves the time allowed: 85 dB(A) for 8 h equals 94 dB(A) for 1 h.',
    'The daily exposure L_EX,8h adds the energy of each activity and spreads it over 8 hours; the loudest task usually dominates.',
    'EU: action at 80 and 85 dB(A), limit 87 dB(A) at the ear. OSHA: 90 dB(A) with a 5 dB rule, programme from 85. NIOSH: 85 dB(A) with 3 dB.'
  ],
  pitfalls: [
    'Below the limit is safe — About 8 in 100 people exposed at 85 dB(A) for a working life still lose hearing; the lower the better, and action starts at 80 dB(A) in Europe.',
    'Half the level is half the risk: 88 dB(A) is a little worse than 85 — 3 dB is twice the energy: 88 dB(A) for 8 hours is a double dose.',
    'An OSHA-compliant exposure meets the European rules too — OSHA\'s 5 dB rule allows far longer at high levels; a job within OSHA\'s limit can be well above the EU limit.'
  ],
  formulas: [
    {
      name: 'Daily exposure from one activity',
      expr: 'LEX = L + 10*log(T/T0)', tex: 'L_{EX,8h} = L + 10\\log_{10}\\dfrac{T}{T_0}',
      vars: {
        LEX: { name: 'daily noise exposure level', q: 'soundlevel', unit: 'dB', tex: 'L_{EX,8h}' },
        L: { name: 'A-weighted level during the activity', q: 'soundlevel', unit: 'dB', value: 95 },
        T: { name: 'duration of the activity', q: 'time', unit: 'h', value: 2 },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'The rest of the day is assumed quiet (much lower levels). Solve for T to find how long a level may last before the exposure reaches a value.',
      stories: { LEX: 'A worker spends {T} at {L} and the rest of the day in quiet. What is the daily exposure?', T: 'How long can someone work at {L} before the daily exposure reaches {LEX}?' }
    },
    {
      name: 'Daily exposure from two activities',
      expr: 'LEX = 10*log((T1*10^(L1/10) + T2*10^(L2/10))/T0)', tex: 'L_{EX,8h} = 10\\log_{10}\\left[\\dfrac{T_1 10^{L_1/10} + T_2 10^{L_2/10}}{T_0}\\right]',
      vars: {
        LEX: { name: 'daily noise exposure level', q: 'soundlevel', unit: 'dB', tex: 'L_{EX,8h}' },
        L1: { name: 'level of activity 1', q: 'soundlevel', unit: 'dB', value: 92, tex: 'L_1' },
        T1: { name: 'time on activity 1', q: 'time', unit: 'h', value: 2, tex: 'T_1' },
        L2: { name: 'level of activity 2', q: 'soundlevel', unit: 'dB', value: 85, tex: 'L_2' },
        T2: { name: 'time on activity 2', q: 'time', unit: 'h', value: 6, tex: 'T_2' },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      stories: { LEX: 'A day has {T1} at {L1} and {T2} at {L2}. What is the daily exposure?', T1: 'With {T2} at {L2}, how long at {L1} brings the daily exposure to {LEX}?' }
    },
    {
      name: 'Time allowed at a level',
      expr: 'T = T0/2^((L - Lc)/q)', tex: 'T = \\dfrac{T_0}{2^{(L - L_c)/q}}',
      vars: {
        T: { name: 'time allowed', q: 'time', unit: 'h' },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' },
        L: { name: 'A-weighted level', q: 'soundlevel', unit: 'dB', value: 94 },
        Lc: { name: 'criterion level (85 for NIOSH and the EU upper action value, 90 for the OSHA PEL)', q: 'soundlevel', unit: 'dB', value: 85, tex: 'L_c' },
        q: { name: 'exchange rate (3 dB equal energy; 5 dB OSHA)', q: 'soundlevel', unit: 'dB', value: 3 }
      },
      stories: { T: 'With a criterion of {Lc} and an exchange rate of {q}, how long is allowed at {L}?', L: 'With a criterion of {Lc} and an exchange rate of {q}, at what level is {T} allowed?' }
    },
    {
      name: 'Noise dose',
      expr: 'D = (C/T0)*2^((L - Lc)/q)', tex: 'D = \\dfrac{C}{T_0}\\,2^{(L - L_c)/q}',
      vars: {
        D: { name: 'dose (100 % = the criterion reached)', q: 'ratio', unit: '%' },
        C: { name: 'time spent at the level', q: 'time', unit: 'h', value: 4 },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' },
        L: { name: 'A-weighted level', q: 'soundlevel', unit: 'dB', value: 90 },
        Lc: { name: 'criterion level', q: 'soundlevel', unit: 'dB', value: 85, tex: 'L_c' },
        q: { name: 'exchange rate', q: 'soundlevel', unit: 'dB', value: 3 }
      },
      note: 'Doses of several activities add. A dose of 100 % means the criterion level held for 8 hours; OSHA\'s action level is 50 % of its 90 dB(A), 5 dB dose.',
      stories: { D: 'Someone spends {C} at {L}. With a criterion of {Lc} and an exchange rate of {q}, what dose is that?' }
    }
  ],
  examples: [
    {
      title: 'A fitter\'s day, three ways',
      q: 'A fitter grinds for 2 h at 98 dB(A), works at the bench for 3 h at 82 dB(A) and spends 3 h elsewhere in the workshop at 78 dB(A). Find the daily exposure and judge it under the EU, OSHA and NIOSH rules.',
      steps: [
        'Energy of each part (hours × $10^{L/10}$): $2\\times10^{9.8} = 1.26\\times10^{10}$, $3\\times10^{8.2} = 4.75\\times10^{8}$, $3\\times10^{7.8} = 1.89\\times10^{8}$.',
        'Sum $1.33\\times10^{10}$, divided by 8 h: $1.66\\times10^{9}$, so $L_{EX,8h} = 10\\log_{10}(1.66\\times10^{9}) = 92.2$ dB(A).',
        'Grinding alone gives $98 + 10\\log_{10}(2/8) = 92.0$ dB(A): it carries 95 % of the energy.',
        'EU: above both action values and above 87 dB(A) — protectors must bring the level at the ear below 87 dB(A), and a programme must reduce the grinding noise.',
        'OSHA counts levels from 80 dB(A) for its hearing programme: 2 h of the 2.64 h allowed at 98 dB(A) plus 3 h of 24.3 h at 82 dB(A) = 88 %, a TWA of 89.1 dB(A) — a hearing conservation programme is needed. For the 90 dB(A) PEL only levels from 90 count: 76 %, TWA 88.0 dB(A), within it.',
        'NIOSH (85 dB, 3 dB): 2/0.40 + 3/16 + 3/40.3 = 5.3, a dose of 530 %.'
      ],
      a: '92.2 dB(A): over the EU limit without protectors; within OSHA\'s PEL but inside its hearing programme; 530 % of the NIOSH dose. Quieter grinding is the real fix.'
    },
    {
      title: 'How long may one grind?',
      q: 'At 98 dB(A), how long does it take to reach a daily exposure of 85 dB(A), and of 80 dB(A), with the rest of the day quiet?',
      steps: [
        '$T = 8\\ \\mathrm{h}/2^{(98-85)/3} = 8/20.2 = 0.40$ h ≈ 24 min.',
        '$T = 8\\ \\mathrm{h}/2^{(98-80)/3} = 8/64 = 0.125$ h = 7.5 min.'
      ],
      a: 'About 24 minutes to 85 dB(A) and 7.5 minutes to 80 dB(A).'
    }
  ],
  quiz: [
    { q: 'Under the 3 dB rule, how long at 91 dB(A) carries the same energy as 8 hours at 85 dB(A)?', choices: ['2 hours', '4 hours', '6 hours', '1 hour'], a: 0, why: '91 is two steps of 3 dB above 85: the time halves twice, 8 → 4 → 2 h.' },
    { q: 'The EU exposure limit value of 87 dB(A) applies…', choices: ['at the ear, taking hearing protectors into account', 'in the room, without protectors', 'at 1 m from the loudest machine', 'to the peak level'], a: 0, why: 'The limit value is the level that must not reach the ear; the action values (80 and 85 dB(A)) are measured without protectors.' },
    { q: 'Under the 3 dB rule with an 85 dB(A) criterion, how many minutes are allowed at 95 dB(A)?', answer: 48, unit: 'min', why: '8 h / 2^(10/3) = 8 / 10.1 = 0.79 h ≈ 48 min. OSHA\'s 5 dB rule allows 4 hours.' },
    { q: 'A 12-hour shift at 85 dB(A) has the same L_EX,8h as an 8-hour shift at 85 dB(A).', a: false, why: 'The energy is spread over 8 hours by definition: 85 + 10 log₁₀(12/8) = 86.8 dB(A).' },
    { q: 'Why does a couple of hours of grinding usually dominate a fitter\'s daily exposure?', choices: ['Its level is 10–20 dB above the rest, and every 10 dB is ten times the energy', 'Grinding noise is high-pitched, which the dose counts double', 'Short tasks are counted as full days', 'It does not: the longest task always dominates'], a: 0, why: 'Energy grows tenfold per 10 dB, so short loud tasks outweigh long quieter ones.' }
  ],
  problems: [
    { q: 'A worker spends 4 h at 90 dB(A) and 4 h at 80 dB(A). What is the daily exposure L_EX,8h?', answer: 87.4, unit: 'dB(A)', tol: 0.005, steps: ['$L_{EX,8h} = 10\\log_{10}\\big[(4\\times10^{9} + 4\\times10^{8})/8\\big] = 10\\log_{10}(5.5\\times10^{8}) = 87.4$ dB(A).'] },
    { q: 'Under OSHA (90 dB(A), 5 dB rule), what is the dose of 3 h at 95 dB(A) and 5 h at 85 dB(A)?', answer: 106, unit: '%', tol: 0.01, steps: ['Allowed at 95 dB(A): $8/2^{1} = 4$ h; at 85 dB(A): $8/2^{-1} = 16$ h.', 'Dose $= 3/4 + 5/16 = 0.75 + 0.31 = 1.06$, i.e. 106 % — just over the permissible limit.'] }
  ],
  ranges: [
    { dim: 'Daily noise exposure needing no action (EU)', range: [null, 80], unit: 'dB(A) L_EX,8h', who: 'every worker, for a whole working life', why: 'Below the lower action value the extra risk of hearing loss is small.', limits: 'Not safe for everyone: susceptible people, ototoxic chemicals and loud leisure add to it; noise still disturbs speech and concentration.', setting: 'all', src: 'Directive 2003/10/EC' },
    { dim: 'Between the EU action values: protectors available, information, training, hearing checks offered', range: [80, 85], unit: 'dB(A) L_EX,8h', who: 'workers in moderately noisy jobs', why: 'Catches the risk early, while hearing is intact.', limits: 'Protectors are optional here, so many are not worn; engineering control is still the better answer.', setting: ['workshop', 'field', 'military'], src: 'Directive 2003/10/EC' },
    { dim: 'EU exposure limit value, at the ear with protectors', range: [null, 87], unit: 'dB(A) L_EX,8h', who: 'every worker, whatever the noise in the room', why: 'A hard ceiling on what reaches the ear.', limits: 'Relies on protectors being worn all the time and fitted well; real protection is often far below the label.', setting: 'all', src: 'Directive 2003/10/EC' },
    { dim: 'US OSHA permissible exposure limit (8-h TWA, 5 dB exchange rate)', range: [null, 90], unit: 'dB(A)', who: 'workers in the United States', why: 'Above it engineering or administrative controls are required, with protectors where they are not enough.', limits: 'The 5 dB rule allows far longer at high levels than the equal-energy rule; NIOSH judges it too lenient.', setting: 'all', src: 'OSHA 29 CFR 1910.95' },
    { dim: 'Exposure from which OSHA requires a hearing conservation programme', range: [85, null], unit: 'dB(A) 8-h TWA', who: 'US workers at 50 % of the OSHA dose or more', why: 'Baseline and yearly audiograms catch hearing changes early; protectors and training are provided.', limits: 'Audiometry detects damage after it happens; it is a check, not a control.', setting: 'all', src: 'OSHA 29 CFR 1910.95' },
    { dim: 'NIOSH recommended exposure limit (8-h TWA, 3 dB exchange rate)', range: [null, 85], unit: 'dB(A)', who: 'workers for a 40-year working life', why: 'Keeps the excess risk of material hearing impairment to about 8 in 100.', limits: 'A recommendation, not a US law; the remaining risk is not zero.', setting: 'all', src: 'NIOSH criteria document, 1998' },
    { dim: 'Peak sound pressure (C-weighted), EU limit value', range: [null, 140], unit: 'dB(C)', who: 'people near impacts, presses, explosive tools and firearms', why: 'Very short, very high peaks can damage the ear at once.', limits: 'The action values are lower (135 and 137 dB(C)); repeated impulses also add to the daily energy.', setting: ['workshop', 'military', 'field'], src: 'Directive 2003/10/EC' },
    { dim: 'Time allowed at 100 dB(A) (85 dB(A) criterion, 3 dB rule)', range: [null, 15], unit: 'min', who: 'anyone using loud tools without protectors', why: 'Fifteen minutes at 100 dB(A) already carries a full day\'s energy.', limits: 'Under OSHA\'s 5 dB rule the same level is allowed for 2 hours — the rules differ by a factor of eight.', setting: ['workshop', 'field'], src: 'NIOSH criteria document, 1998' }
  ],
  applications: [
    'Planning a workday so that loud tasks are short, shared or engineered out: see [the noise exposure calculator](#/tools/environment/noise).',
    'Specifying machinery by its declared noise emission, so that operators stay below 80 dB(A).',
    'Hearing conservation programmes: measurement to ISO 9612, audiometry, protectors, training and records.',
    'Deciding where hearing-protection zones must be marked (from the EU upper action value).'
  ],
  history: 'Burns and Robinson\'s UK study *Hearing and Noise in Industry* (1970) related years of exposure to hearing loss and supported the equal-energy principle, later built into ISO 1999. In the US the Walsh–Healey noise rule of 1969 set 90 dB(A) with a 5 dB exchange rate; OSHA adopted it in 1971 and added its hearing conservation amendment in 1983. NIOSH\'s revised criteria of 1998 recommended 85 dB(A) with 3 dB. The EU replaced its 1986 noise directive with Directive 2003/10/EC.',
  sources: [
    'Directive 2003/10/EC on the minimum health and safety requirements regarding the exposure of workers to the risks arising from physical agents (noise).',
    'US OSHA, 29 CFR 1910.95, *Occupational noise exposure*.',
    'NIOSH, *Criteria for a Recommended Standard: Occupational Noise Exposure*, revised criteria, 1998.',
    'ISO 9612, *Acoustics — Determination of occupational noise exposure — Engineering method*.',
    'ISO 1999, *Acoustics — Estimation of noise-induced hearing loss*.'
  ],
  sim: 'en-noise-day'
},

{
  id: 'hearing-protection', parent: 'noise-vibration', title: 'Hearing protection', level: 2,
  short: 'Earplugs and earmuffs are the last line of defence against noise. Their label ratings come from laboratory tests; in real use they give far less, and every minute they are off costs more protection than people expect. Choose them for the noise, the wearer and the job, aim for 70–80 dB(A) at the ear, and keep them on.',
  keywords: ['hearing protection', 'earplugs', 'earmuffs', 'SNR', 'NRR', 'HML', 'derating', 'wearing time', 'overprotection', 'fit testing', 'personal attenuation rating', 'level-dependent', 'active noise reduction', 'double protection', 'EN 352', 'EN 458'],
  prereq: ['noise-exposure', 'noise-basics', 'ppe-ergonomics'],
  related: ['noise-control', 'alarms-warnings', 'personal-equipment-fit', 'clothing-ppe-allowances', 'military-human-factors', 'construction-ergonomics', 'heat-stress'],
  body: `
Hearing protectors are the last line of defence. Law and good practice put them after removing noise at the source, blocking it on the way and limiting time — because protectors work only when they are worn, fitted and kept on, and they protect only the wearer. Yet in much of industry, the military and field work they are indispensable, and choosing them is ergonomics: they must fit the ear, the head, the helmet, the glasses, the heat and the job.

### Types
| Type | Typical label | Strengths | Weaknesses |
|---|---|---|---|
| Foam roll-down earplugs | high (SNR about 30–37) | cheap, light, cool in heat | badly inserted they give a fraction of the label; need clean hands |
| Pre-moulded and custom plugs | medium to high | reusable, quick to fit; custom plugs comfortable all day | fit varies; custom moulds cost more |
| Earmuffs (headband or on a helmet) | medium to high (SNR about 25–35) | easy to fit and to check from a distance; good for intermittent use | hot and heavy; spectacle arms and hair break the seal |
| Level-dependent ("talk-through") | medium | pass speech and surroundings, limit loud sound | batteries, care |
| Active noise reduction headsets | adds most at low frequencies | vehicle and aircraft crews, radio communication | cost; little extra at high frequencies |
| Plugs + muffs together | only about 5 dB over the better one | very high levels | the skull conducts sound past both; comfort |

### What the label says
- **SNR** (Europe, EN ISO 4869-2): subtract it from the C-weighted noise level to estimate the A-weighted level at the ear, $L_{ear} = L_C - \\mathrm{SNR}$. The **HML** values (high, medium, low frequencies) refine this for rumbling noise.
- **NRR** (US, EPA label): with an A-weighted level, subtract NRR − 7; the 7 dB covers the usual difference between C- and A-weighted levels.

Both come from laboratory tests with carefully fitted subjects. In workplaces people achieve much less — for many earplugs, field studies find half the label or worse. Hence the **derating** rules:

| Method | How | Where used |
|---|---|---|
| OSHA | $(\\mathrm{NRR} - 7)/2$ from an A-weighted level | US compliance guidance |
| NIOSH | take 25 % off the NRR for muffs, 50 % for foam plugs, 70 % for other plugs (then subtract 7 for dB(A)) | US recommendation |
| UK HSE | subtract a further 4 dB from the SNR result | UK guidance |
| Fit testing | measure each person's attenuation (a personal attenuation rating) | best practice everywhere |

### Worn all the time — or hardly at all
The energy in a few unprotected minutes outweighs hours of protection, because decibels are a [[?logarithm|logarithmic]] scale: 30 dB of attenuation lets through only a thousandth of the energy, while a lifted protector lets through all of it. A protector of attenuation $A$ worn for a fraction $f$ of the noisy time gives

$$A_{eff} = -10\\log_{10}\\left(1 - f + f\\,10^{-A/10}\\right)$$

| Worn for… of the noisy time | 100 % | 99 % | 95 % | 90 % | 50 % |
|---|---|---|---|---|---|
| a 30 dB protector gives | 30 dB | 19.6 dB | 12.9 dB | 10.0 dB | 3.0 dB |

Lifting earmuffs for five minutes every hour (92 %) turns 30 dB into about 11 dB. So comfort — weight, clamping force, heat, compatibility with glasses, helmets and respirators — is not a luxury: an uncomfortable protector is lifted, and a lifted protector does not protect.

### Not too much, either
Aim for about **70–80 dB(A) at the ear**. Below about 70 dB(A) the wearer feels cut off, cannot hear colleagues, reversing alarms or a machine running wrong, and tends to lift the protector — gaining nothing and risking an accident. For people with hearing loss, protectors can push warnings below what they can hear; auditory signals should stand about 15 dB above the ambient noise (ISO 7731), with visual signals as well where needed (see [[alarms-warnings]]).

### Choosing for the setting
- **Workshop**: plugs for continuous noise and heat; muffs for tasks in and out of noise (quick to put on, easy to check); protectors that fit under welding helmets and with safety glasses.
- **Military**: helmet-integrated muffs and communication headsets with active noise reduction for vehicle crews and aircrew; level-dependent plugs that let speech through but limit impulses. Protection that costs awareness of the surroundings gets removed.
- **Field**: heat and sweat favour plugs; muffs on hard hats for machine operators; forestry helmets combine a visor, muffs and a hard hat.
- **Office**: call-centre headsets with acoustic limiters, not protectors.

In the simulation, pick a protector and a noise, then change the fit and the time it is worn. Watch the level at the ear leave the green 70–80 dB(A) band, and the curve of effective protection collapse as wearing time falls below 100 %. [The noise exposure calculator](#/tools/environment/noise) applies OSHA's derating to a whole day.

> [!warn] Hearing protectors are the last resort, not the plan. Reduce the noise at the source and on its path first; then choose protectors for the noise, fit them, wear them the whole time in noise and check them — and remember they protect no one else nearby.

> [!key] Real protection is the label, derated for fit, then cut again for every minute not worn. Aim for 70–80 dB(A) at the ear, all shift.
`,
  ideas: [
    'Label ratings (SNR, NRR) are laboratory values; real-world protection is often half or less.',
    'Wearing time dominates: a 30 dB protector worn 95 % of the noisy time gives about 13 dB.',
    'Aim for 70–80 dB(A) at the ear: more protection isolates the wearer and gets the protector removed.',
    'Comfort, fit and compatibility with glasses, helmets and communication decide whether protectors are worn.'
  ],
  pitfalls: [
    'The highest rating is the best choice — Over-protection cuts off speech and warnings, and uncomfortable protectors are lifted; choose for 70–80 dB(A) at the ear.',
    'Plugs plus muffs add their ratings — Together they give only about 5 dB more than the better one, because sound also reaches the inner ear through the skull.',
    'Taking protectors off for a few minutes does no harm — Five unprotected minutes an hour can cut a 30 dB protector to about 11 dB.'
  ],
  formulas: [
    {
      name: 'Level at the ear with a US-rated protector (OSHA derating)',
      expr: 'Lp = L - (NRR - 7)/2', tex: 'L_{ear} = L_A - \\dfrac{\\mathrm{NRR} - 7}{2}',
      vars: {
        Lp: { name: 'estimated A-weighted level at the ear', q: 'soundlevel', unit: 'dB', tex: 'L_{ear}' },
        L: { name: 'A-weighted noise level (or TWA)', q: 'soundlevel', unit: 'dB', value: 100, tex: 'L_A' },
        NRR: { name: 'noise reduction rating on the label', q: 'soundlevel', unit: 'dB', value: 29, tex: '\\mathrm{NRR}' }
      },
      note: 'The 7 dB converts a C-weighted rating for use with A-weighted levels; the division by 2 is OSHA\'s allowance for real-world fit.',
      stories: { Lp: 'The noise is {L}. What reaches the ear through a protector labelled NRR {NRR}, derated the OSHA way?', NRR: 'The noise is {L}. What NRR is needed, with OSHA\'s derating, for {Lp} at the ear?' }
    },
    {
      name: 'Level at the ear with a European-rated protector',
      expr: 'Lp = Lc - (SNR - r)', tex: 'L_{ear} = L_C - (\\mathrm{SNR} - r)',
      vars: {
        Lp: { name: 'estimated A-weighted level at the ear', q: 'soundlevel', unit: 'dB', tex: 'L_{ear}' },
        Lc: { name: 'C-weighted noise level', q: 'soundlevel', unit: 'dB', value: 102, tex: 'L_C' },
        SNR: { name: 'single number rating on the label', q: 'soundlevel', unit: 'dB', value: 28, tex: '\\mathrm{SNR}' },
        r: { name: 'real-world allowance (4 dB in UK guidance; 0 for the bare label)', q: 'soundlevel', unit: 'dB', value: 4 }
      },
      stories: { Lp: 'The noise is {Lc} (C-weighted). With a protector of SNR {SNR} and a real-world allowance of {r}, what reaches the ear?', SNR: 'The noise is {Lc} (C-weighted). With a real-world allowance of {r}, what SNR gives {Lp} at the ear?' }
    },
    {
      name: 'Effective attenuation when worn part of the time',
      expr: 'Aeff = -10*log(1 - f + f*10^(-A/10))', tex: 'A_{eff} = -10\\log_{10}\\left(1 - f + f\\,10^{-A/10}\\right)',
      vars: {
        Aeff: { name: 'effective attenuation over the noisy time', q: 'soundlevel', unit: 'dB', tex: 'A_{eff}' },
        f: { name: 'share of the noisy time the protector is worn', q: 'ratio', unit: '%', value: 95, min: 0, max: 100 },
        A: { name: 'attenuation while worn', q: 'soundlevel', unit: 'dB', value: 30 }
      },
      note: 'Energy passing in the unprotected minutes adds to the small amount passing through the protector.',
      stories: { Aeff: 'A {A} protector is worn for {f} of the noisy time. What does it really give?', f: 'A {A} protector must give at least {Aeff} over the shift. For what share of the noisy time must it be worn?' }
    }
  ],
  examples: [
    {
      title: 'Choosing an SNR',
      q: 'A task measures 98 dB(A) and 101 dB(C). Using UK guidance (take a further 4 dB off the SNR), which SNR puts the ear in the 70–80 dB(A) band?',
      steps: [
        '$L_{ear} = L_C - (\\mathrm{SNR} - 4)$, so $\\mathrm{SNR} = L_C + 4 - L_{ear}$.',
        'For 80 dB(A) at the ear: $\\mathrm{SNR} = 101 + 4 - 80 = 25$ dB. For 70 dB(A): $\\mathrm{SNR} = 35$ dB.',
        'A muff of SNR 30 gives about 75 dB(A); a foam plug of SNR 37 gives about 68 dB(A) — over-protection, likely to be pulled out to talk.'
      ],
      a: 'An SNR between about 25 and 35 dB.'
    },
    {
      title: 'Fifteen minutes off',
      q: 'An earmuff gives 25 dB. In an 8-hour shift at 98 dB(A) it is lifted for 15 minutes in total. What does it really give, and what reaches the ear?',
      steps: [
        'Worn share $f = 7.75/8 = 0.969$.',
        '$A_{eff} = -10\\log_{10}(0.031 + 0.969\\times10^{-2.5}) = -10\\log_{10}(0.0343) = 14.6$ dB.',
        'At the ear: $98 - 14.6 = 83.4$ dB(A) instead of 73 dB(A) — above the 80 dB(A) target, before any allowance for fit.'
      ],
      a: 'About 15 dB instead of 25; about 83 dB(A) at the ear.'
    },
    {
      title: 'Double protection, US style',
      q: 'The TWA is 105 dB(A). Foam plugs are labelled NRR 33 and muffs NRR 25. Estimate the level at the ear with plugs alone and with both (OSHA derating; add 5 dB for the second protector).',
      steps: [
        'Plugs: $(33 - 7)/2 = 13$ dB, so $105 - 13 = 92$ dB(A).',
        'Both: $13 + 5 = 18$ dB, so about 87 dB(A).',
        'Still high: at such levels quieter processes, enclosures and less time in the noise are essential.'
      ],
      a: 'About 92 dB(A) with plugs, about 87 dB(A) with plugs and muffs.'
    }
  ],
  quiz: [
    { q: 'A 30 dB protector is lifted for 5 minutes in every hour of noise. About what does it really give?', choices: ['About 11 dB', 'About 27 dB', 'About 30 dB', 'About 25 dB'], a: 0, why: 'Worn 92 % of the time: −10 log₁₀(0.083 + 0.001) ≈ 11 dB. The unprotected minutes dominate.' },
    { q: 'Why should the level at the ear not be pushed far below 70 dB(A)?', choices: ['The wearer is cut off from speech and warnings and tends to remove the protector', 'Very quiet levels damage hearing', 'Protectors with high ratings are illegal', 'It makes the protector wear out faster'], a: 0, why: 'Over-protection isolates people; the practical result is a protector pulled off, and missed warnings.' },
    { q: 'Wearing earmuffs over well-fitted foam plugs doubles the protection in decibels.', a: false, why: 'The second protector adds only about 5 dB: sound reaches the inner ear through the skull as well.' },
    { q: 'The noise is 96 dB(A) and a plug is labelled NRR 29. What level at the ear does OSHA\'s derating estimate?', answer: 85, unit: 'dB(A)', why: '(29 − 7)/2 = 11 dB; 96 − 11 = 85 dB(A).' },
    { q: 'A stores worker goes in and out of a noisy packing area every few minutes. Which protector suits best?', choices: ['Earmuffs, quick to put on and off', 'Foam roll-down plugs', 'Custom-moulded plugs worn all day', 'None: short visits do not matter'], a: 0, why: 'Muffs are on and off in a second; foam plugs need clean hands and time to fit, so they get skipped for short visits.' }
  ],
  problems: [
    { q: 'A 25 dB earmuff is worn for 7.5 of 8 noisy hours. What effective attenuation does it give?', answer: 11.8, unit: 'dB', tol: 0.02, steps: ['$f = 7.5/8 = 0.9375$.', '$A_{eff} = -10\\log_{10}(0.0625 + 0.9375\\times10^{-2.5}) = -10\\log_{10}(0.0655) = 11.8$ dB.'] },
    { q: 'The noise is 104 dB(C). With UK guidance (a further 4 dB off the SNR), what SNR gives 75 dB(A) at the ear?', answer: 33, unit: 'dB', tol: 0.01, steps: ['$75 = 104 - (\\mathrm{SNR} - 4)$, so $\\mathrm{SNR} = 104 + 4 - 75 = 33$ dB.'] }
  ],
  ranges: [
    { dim: 'Target level at the ear with protectors worn', range: [70, 80], unit: 'dB(A)', who: 'every wearer, including people who must hear speech and warnings', why: 'Below the EU lower action value, yet still in touch with colleagues and alarms.', limits: 'Label-based estimates overstate protection; people with hearing loss may need less attenuation and visual warnings.', setting: 'all', src: 'EN 458; UK HSE guidance L108' },
    { dim: 'Real-world attenuation as a share of the NRR', range: '30–75 % of the label (by protector type)', unit: '', who: 'typical wearers without individual fit testing', why: 'Planning with derated values avoids false security.', limits: 'Individuals range from almost nothing to more than the label; only fit testing tells.', setting: 'all', src: 'NIOSH criteria document, 1998 (derating by type)' },
    { dim: 'Share of the noisy time the protector is worn', range: [99, 100], unit: '%', who: 'everyone in noise above the upper action value', why: 'Keeps most of the protector\'s attenuation; at 95 % a 30 dB protector gives only 13 dB.', limits: 'Needs comfortable protectors that fit with helmets, glasses and communication; quiet refuges for breaks.', setting: ['workshop', 'field', 'military'], src: 'Equal-energy calculation; Directive 2003/10/EC (upper action value)' },
    { dim: 'Noise level from which double protection (plugs + muffs) is advised', range: [100, null], unit: 'dB(A) 8-h TWA', who: 'workers in very loud jobs: chipping, blasting, some military and aviation tasks', why: 'Adds about 5 dB where one protector cannot bring the ear low enough.', limits: 'Uncomfortable; isolates the wearer; bone conduction caps the total. US MSHA requires it from 105 dB(A).', setting: ['workshop', 'military', 'field'], src: 'NIOSH (100 dB(A)); US MSHA, 30 CFR Part 62 (105 dB(A))' }
  ],
  applications: [
    'Selecting a protector for each noisy task from its level and spectrum (SNR or HML), with the wearers trying the options.',
    'Individual fit testing to confirm each person\'s attenuation, and training in fitting foam plugs.',
    'Communication headsets with active noise reduction for vehicle crews and aircrew.',
    'Applying a derated protector to a whole day in [the noise exposure calculator](#/tools/environment/noise).'
  ],
  history: 'The US Environmental Protection Agency introduced the Noise Reduction Rating label in 1979. Field studies in the following decades, NIOSH\'s among them, found real-world attenuation far below the labels, which led to derating rules and, more recently, to individual fit testing. In Europe the SNR and HML ratings of EN ISO 4869-2 and the selection guidance of EN 458 serve the same purpose.',
  sources: [
    'EN 352 series, *Hearing protectors — Safety requirements* (earmuffs, earplugs, helmet-mounted and level-dependent protectors).',
    'EN ISO 4869-2, *Acoustics — Hearing protectors — Part 2: Estimation of effective A-weighted sound pressure levels when hearing protectors are worn* (SNR and HML).',
    'EN 458, *Hearing protectors — Recommendations for selection, use, care and maintenance — Guidance document*.',
    'US EPA, 40 CFR Part 211, Subpart B (the Noise Reduction Rating label); OSHA Technical Manual, section on noise (derating).',
    'NIOSH, *Criteria for a Recommended Standard: Occupational Noise Exposure*, revised criteria, 1998.',
    'UK HSE, *Controlling noise at work* (L108), guidance on the Control of Noise at Work Regulations 2005.'
  ],
  sim: 'en-protector'
},

{
  id: 'noise-control', parent: 'noise-vibration', title: 'Controlling noise', level: 2,
  short: 'Noise is controlled in order: at the source (quieter machines, slower fans, damped impacts), on the path (enclosures, screens, absorption, distance) and at the receiver (cabins, less time, protectors last). In a room the operator stands in the direct field of the machine and the rest in the reverberant field — and each needs a different fix.',
  keywords: ['noise control', 'source path receiver', 'enclosure', 'insertion loss', 'transmission loss', 'acoustic barrier', 'absorption', 'room constant', 'reverberant field', 'direct field', 'Sabine', 'buy quiet', 'silencer', 'fan law', 'open-plan office acoustics', 'ISO 3382-3'],
  prereq: ['noise-basics', 'noise-exposure', 'machine-ergonomics-principles'],
  related: ['hearing-protection', 'office-layout', 'control-rooms', 'maintenance-ergonomics', 'construction-ergonomics', 'motors:motor-noise', 'pneumatics:noise-silencers'],
  body: `
Every noise problem has three parts: a **source** that makes the sound, a **path** that carries it and a **receiver** who hears it. Control works in that order, because what is removed at the source is removed for everyone — the operator, the colleague, the visitor, the neighbour — for good, without relying on anyone's behaviour. The EU noise directive makes the order a duty: eliminate or reduce at the source first, protectors last.

### At the source
- **Buy quiet.** Machinery must declare its noise emission; compare sound power levels and ask for the quietest suitable machine. 10 dB less is a tenth of the sound energy for the machine's whole life.
- **Slower and smoother.** Fan noise climbs steeply with speed: for a given fan roughly $\\Delta L = 50\\log_{10}(n_2/n_1)$, so halving the speed takes about 15 dB off. Larger, slower fans, lower cutting and conveying speeds and helical rather than straight-cut gears all help.
- **Impacts.** Metal falling onto metal rings: lower the drop height, line chutes and bins, and fit rubber stops so that bangs become thuds.
- **Air.** Silencers on pneumatic exhausts, low-noise blow nozzles, the lowest pressure that does the job, and no leaks (see [[pneumatics:noise-silencers]]).
- **Vibration.** Resilient mounts, balanced rotors and damped panels stop structures radiating; maintenance keeps bearings, belts and gears quiet (see [[motors:motor-noise]]).

### On the path
Indoors, sound reaches a listener by two routes: **direct**, falling 6 dB per doubling of distance ([[?proportional|proportional]] to $1/r^2$ in energy), and **reverberant**, bounced off every surface and nearly the same everywhere. For a source of sound power level $L_W$ and directivity $Q$ (1 in mid-air, 2 on a floor, 4 at a wall, 8 in a corner):

$$L_p = L_W + 10\\log_{10}\\left(\\frac{Q}{4\\pi r^2} + \\frac{4}{R}\\right), \\qquad R = \\frac{S\\bar{\\alpha}}{1-\\bar{\\alpha}}$$

$S$ is the room's surface area and $\\bar{\\alpha}$ its average absorption coefficient — about 0.05–0.1 for a bare hall of concrete, brick and steel, 0.2–0.3 with an absorbent ceiling. Near the machine the direct term wins; far away the reverberant one does. Hence:

- **Absorption** (ceiling panels, hanging baffles, wall panels) lowers the reverberant field, typically by 3–8 dB away from machines, but hardly helps an operator standing in the direct field.
- **Enclosures** give the most: 10–30 dB when well built and sealed. Every opening leaks — with a fraction $s$ of the surface open, the enclosure can never do better than $-10\\log_{10}s$: 20 dB with 1 % open, 30 dB with 0.1 %. Seals, lined labyrinths for cooling air and conveyors, and doors that are easy to close make or break an enclosure; one that hinders loading, cleaning or setting is soon left open.
- **Screens** help by 5–15 dB when close to the source or the listener and in an absorbent room; in a hard, reverberant hall the sound goes round them.
- **Distance** works in the direct field: from 1 m to 4 m saves up to 12 dB.

### At the receiver
- **Cabins and refuges**: a sealed control room or operator cabin with 20–30 dB of insertion loss lets people supervise noisy processes in comfort, and gives quiet breaks.
- **Time**: rotating people out of noisy tasks halves the energy for each halving of time — only 3 dB, but a real 3 dB.
- **Hearing protectors**, last (see [[hearing-protection]]).

### Offices
In offices the problem is not hearing damage but **speech**: intelligible talk distracts more than any other sound. Open plans combine highly absorbent ceilings, screens of about head height between desks, space, and sometimes a gentle masking sound. ISO 3382-3 measures the result — how much speech fades per doubling of distance, and the distraction distance beyond which it is no longer understood; its indicative values for good open plans are a decay of about 7 dB per doubling or more and a distraction distance of about 5 m or less. Quiet rooms for calls and concentration do the rest (see [[office-layout]]).

### Military and field
- **Vehicles and shelters**: cab insulation, isolated mounts and active noise reduction headsets; generators placed away from command posts and sleeping areas, exhausts pointing away.
- **Construction and agriculture**: machines sold for outdoor use in the EU must meet sound power limits (Directive 2000/14/EC); closed cabs, screens round compressors and generators, and quieter methods — pressing piles in instead of hammering, bursting concrete instead of breaking it — cut exposure at the root.

In the simulation, a machine stands in a workshop with its operator and a colleague. Quieten the source, build an enclosure (and leave a gap in it), add absorption and move the people: the graph separates the direct and reverberant fields and shows which measure helps whom.

> [!tip] Before paying for absorption, check who stands in the direct field. The operator at 1 m is helped by a quieter machine or an enclosure; the rest of the room by absorption and distance.

> [!key] Control at the source first, then on the path, then at the receiver. Enclosures give the most but leak through every gap; absorption helps the room, not the operator; hearing protectors come last.
`,
  ideas: [
    'Source, path, receiver — in that order: control at the source protects everyone, always.',
    'Indoors the level is a direct field (−6 dB per doubling of distance) plus a reverberant field set by the room\'s absorption.',
    'Absorption lowers the reverberant level for the room but hardly helps the operator in the direct field.',
    'An enclosure is only as good as its gaps: 1 % open area limits it to about 20 dB.'
  ],
  pitfalls: [
    'Acoustic panels will protect the machine operator — At the machine the direct sound dominates; panels lower the reverberant field for people further away.',
    'A thick enclosure with a small opening still gives most of its rating — Sound pours through openings: 1 % open caps any enclosure at about 20 dB.',
    'Hearing protectors are the cheapest solution — They need buying, fitting, training, checking and replacing for every person for ever, and protect only their wearers; engineering control often costs less over a machine\'s life.'
  ],
  formulas: [
    {
      name: 'Sound level in a room (direct plus reverberant)',
      expr: 'Lp = Lw + 10*log(Q/(4*pi*r^2) + 4/R)', tex: 'L_p = L_W + 10\\log_{10}\\left(\\dfrac{Q}{4\\pi r^2} + \\dfrac{4}{R}\\right)',
      vars: {
        Lp: { name: 'sound pressure level at the listener', q: 'soundlevel', unit: 'dB', tex: 'L_p' },
        Lw: { name: 'sound power level of the machine', q: 'soundlevel', unit: 'dB', value: 100, tex: 'L_W' },
        Q: { name: 'directivity (2 on a floor, 4 at a wall)', value: 2, min: 1, max: 8 },
        r: { name: 'distance from the machine', q: 'length', unit: 'm', value: 4 },
        R: { name: 'room constant', q: 'area', unit: 'm²', value: 200 }
      },
      note: 'A diffuse-field model: good for rooms whose dimensions are similar; long, low halls deviate from it.',
      stories: { Lp: 'A machine of sound power {Lw} stands on the floor (Q = {Q}) of a room with a room constant of {R}. What level is there at {r}?', R: 'A machine of sound power {Lw} (Q = {Q}) gives {Lp} at {r}. What room constant would that need?' }
    },
    {
      name: 'Room constant',
      expr: 'R = S*a/(1 - a)', tex: 'R = \\dfrac{S\\bar{\\alpha}}{1 - \\bar{\\alpha}}',
      vars: {
        R: { name: 'room constant', q: 'area', unit: 'm²' },
        S: { name: 'total surface area of the room', q: 'area', unit: 'm²', value: 600 },
        a: { name: 'average absorption coefficient', value: 0.25, min: 0.01, max: 0.99, tex: '\\bar{\\alpha}' }
      },
      stories: { R: 'A workshop has {S} of surfaces with an average absorption coefficient of {a}. What is its room constant?', a: 'A room of {S} surface must reach a room constant of {R}. What average absorption does it need?' }
    },
    {
      name: 'Transmission loss of a wall with an opening',
      expr: 'TL = -10*log((1 - s)*10^(-TLw/10) + s)', tex: '\\mathrm{TL} = -10\\log_{10}\\left[(1 - s)\\,10^{-\\mathrm{TL}_{w}/10} + s\\right]',
      vars: {
        TL: { name: 'transmission loss of the whole enclosure wall', q: 'soundlevel', unit: 'dB', tex: '\\mathrm{TL}' },
        s: { name: 'open share of the area (gaps, openings)', q: 'ratio', unit: '%', value: 1, min: 0, max: 100 },
        TLw: { name: 'transmission loss of the solid panel', q: 'soundlevel', unit: 'dB', value: 35, tex: '\\mathrm{TL}_{w}' }
      },
      note: 'An opening transmits all the sound that falls on it. The real insertion loss of an enclosure also depends on its internal absorption.',
      stories: { TL: 'Panels of {TLw} with {s} of the area open for cooling. What can the enclosure wall achieve?', s: 'Panels of {TLw}; the enclosure must reach {TL}. How much of its area may be open?' }
    },
    {
      name: 'Fan speed and noise (an empirical fan law)',
      expr: 'dL = 50*log(n2/n1)', tex: '\\Delta L = 50\\log_{10}\\dfrac{n_2}{n_1}',
      vars: {
        dL: { name: 'change in sound power level', q: 'soundlevel', unit: 'dB', signed: true, tex: '\\Delta L' },
        n2: { name: 'new speed', q: 'frequency', unit: 'rpm', value: 1000, tex: 'n_2' },
        n1: { name: 'original speed', q: 'frequency', unit: 'rpm', value: 1450, tex: 'n_1' }
      },
      note: 'For the same fan at the same operating point; the exponent varies somewhat between fans.',
      stories: { dL: 'A fan is slowed from {n1} to {n2}. By how much does its noise change?', n2: 'A fan runs at {n1}. To what speed must it be slowed for a change of {dL}?' }
    }
  ],
  examples: [
    {
      title: 'Absorption helps the room, not the operator',
      q: 'A machine of sound power 100 dB(A) stands on the floor (Q = 2) of a workshop with 600 m² of surfaces. Compare the level at the operator (1 m) and at a colleague (8 m) for a bare room (ᾱ = 0.1) and after adding absorbent ceiling panels (ᾱ = 0.3).',
      steps: [
        'Bare: $R = 600\\times0.1/0.9 = 66.7$ m², so $4/R = 0.060$. Treated: $R = 600\\times0.3/0.7 = 257$ m², $4/R = 0.0156$.',
        'Operator, direct term $2/(4\\pi\\cdot1^2) = 0.159$: bare $100 + 10\\log_{10}(0.219) = 93.4$ dB(A); treated $100 + 10\\log_{10}(0.175) = 92.4$ dB(A).',
        'Colleague, direct term $2/(4\\pi\\cdot64) = 0.0025$: bare $100 + 10\\log_{10}(0.0625) = 88.0$ dB(A); treated $100 + 10\\log_{10}(0.0180) = 82.6$ dB(A).'
      ],
      a: 'The colleague gains 5.4 dB, the operator only 1.0 dB: the operator needs a quieter machine or an enclosure.'
    },
    {
      title: 'The gap in the enclosure',
      q: 'Enclosure panels give 35 dB. What can the enclosure wall achieve with 1 % of its area open, and with 0.1 %?',
      steps: [
        '1 %: $-10\\log_{10}(0.99\\times10^{-3.5} + 0.01) = -10\\log_{10}(0.0103) = 19.9$ dB.',
        '0.1 %: $-10\\log_{10}(0.999\\times10^{-3.5} + 0.001) = -10\\log_{10}(0.00132) = 28.8$ dB.'
      ],
      a: 'About 20 dB with 1 % open and 29 dB with 0.1 % — the panels\' 35 dB only when sealed.'
    },
    {
      title: 'A slower fan',
      q: 'A ventilation fan is slowed from 1450 to 1000 rpm (with a larger fan to keep the airflow). About how much quieter is it?',
      steps: ['$\\Delta L = 50\\log_{10}(1000/1450) = 50\\times(-0.161) = -8.1$ dB.'],
      a: 'About 8 dB quieter.'
    }
  ],
  quiz: [
    { q: 'An operator stands 1 m from a machine in a hard, bare hall. What helps the operator most?', choices: ['A quieter machine or an enclosure', 'Absorbent panels on the ceiling', 'A screen at the far wall', 'Moving the other machines'], a: 0, why: 'At 1 m the direct sound dominates; only reducing it at the source or on the direct path helps much.' },
    { q: 'An enclosure has walls of 40 dB transmission loss but 1 % of its surface is open for cooling. Roughly what can it achieve?', choices: ['About 20 dB', 'About 40 dB', 'About 39 dB', 'About 1 dB'], a: 0, why: 'The opening passes all the sound on it: −10 log₁₀(0.01) = 20 dB is the ceiling.' },
    { q: 'By how many decibels does halving a fan\'s speed reduce its noise, by the 50 log rule?', answer: 15, unit: 'dB', why: '50 log₁₀(0.5) = −15 dB.' },
    { q: 'Adding absorption to a room lowers the level by the same amount everywhere.', a: false, why: 'It lowers the reverberant field; close to the source the direct field dominates and hardly changes.' },
    { q: 'Why does the EU noise directive require control at the source before hearing protectors?', choices: ['It protects everyone, permanently, without relying on behaviour', 'Protectors are forbidden above 85 dB(A)', 'Source control is always cheaper to install', 'Protectors damage hearing'], a: 0, why: 'Engineering control works for every person present and does not depend on protectors being worn and fitted.' }
  ],
  problems: [
    { q: 'A room has 800 m² of surfaces with an average absorption coefficient of 0.15. What is its room constant?', answer: 141, unit: 'm²', tol: 0.01, steps: ['$R = S\\bar{\\alpha}/(1 - \\bar{\\alpha}) = 800\\times0.15/0.85 = 141$ m².'] },
    { q: 'A machine of sound power 95 dB(A) stands on the floor (Q = 2) of a room with a room constant of 150 m². What is the level at 2 m?', answer: 83.2, unit: 'dB(A)', tol: 0.005, steps: ['Direct: $2/(4\\pi\\cdot4) = 0.0398$. Reverberant: $4/150 = 0.0267$.', '$L_p = 95 + 10\\log_{10}(0.0665) = 95 - 11.8 = 83.2$ dB(A).'] }
  ],
  ranges: [
    { dim: 'Insertion loss of a well-sealed machine enclosure', range: [10, 30], unit: 'dB', who: 'the operator and everyone else in the room', why: 'The largest single reduction on the path; it protects everyone without relying on behaviour.', limits: 'Every gap leaks — 1 % open caps it at about 20 dB; enclosures that hinder loading, cleaning, cooling or maintenance are left open.', setting: ['workshop', 'field'], src: 'ISO 15667 (enclosures and cabins)' },
    { dim: 'Insertion loss of an operator cabin or noise refuge', range: [20, 30], unit: 'dB', who: 'operators supervising noisy processes; people taking breaks', why: 'Comfortable, conversational levels inside while the process runs outside.', limits: 'Doors must close easily and stay closed; ventilation and cooling must not open a leak.', setting: ['workshop', 'vehicle', 'military'], src: 'ISO 15667' },
    { dim: 'Acoustic screen between a source and a listener', range: [5, 15], unit: 'dB', who: 'people close behind the screen', why: 'Blocks the direct sound where full enclosure is impractical.', limits: 'Works only near the source or listener and in an absorbent room; useless in a hard, reverberant hall.', setting: ['workshop', 'office'], src: 'ISO 17624 (acoustic screens)' },
    { dim: 'Reduction of the reverberant level by absorbent ceiling and walls', range: [3, 8], unit: 'dB', who: 'people several metres from the machines', why: 'Lowers the level everywhere away from sources; speech becomes easier and the room calmer.', limits: 'Barely helps the operator in the direct field of the machine.', setting: ['workshop', 'office', 'school'], src: 'ISO 11690-2; Sabine room acoustics' },
    { dim: 'Open-plan office: fall of speech level per doubling of distance', range: [7, null], unit: 'dB', who: 'office workers who need to concentrate near others\' conversations', why: 'Colleagues\' speech fades quickly and stops distracting.', limits: 'An indicative value; the layout, screens and masking sound all matter, and quiet rooms are still needed.', setting: 'office', src: 'ISO 3382-3 (indicative values)' },
    { dim: 'Open-plan office: distraction distance', range: [null, 5], unit: 'm', who: 'office workers', why: 'Beyond this distance speech is no longer intelligible and hardly distracts.', limits: 'Depends on the background sound level; too loud a masking sound is itself a nuisance.', setting: 'office', src: 'ISO 3382-3 (indicative values)' }
  ],
  applications: [
    'Buying machines by their declared sound power, and writing noise limits into purchase specifications.',
    'Enclosing presses, compressors, pumps and cutting machines with sealed, easily opened enclosures.',
    'Treating workshops with absorbent ceilings and baffles so that the whole room is quieter away from the machines.',
    'Designing open-plan offices with absorption, screens and quiet rooms; locating generators away from where people rest.'
  ],
  history: 'Wallace Clement Sabine founded room acoustics around 1900 by timing how long sound took to die away in Harvard\'s lecture rooms; his reverberation formula ties that time to a room\'s volume and absorption. The same absorption sets the reverberant field used in noise-control calculations today.',
  sources: [
    'ISO 11690-1 and -2, *Acoustics — Recommended practice for the design of low-noise workplaces containing machinery* (strategies and measures).',
    'ISO 15667, *Acoustics — Guidelines for noise control by enclosures and cabins*.',
    'ISO 3382-3, *Acoustics — Measurement of room acoustic parameters — Part 3: Open plan offices*.',
    'Directive 2000/14/EC on the noise emission of equipment for use outdoors; Directive 2003/10/EC (noise), on reducing noise at the source first.',
    'I. L. Vér and L. L. Beranek (eds), *Noise and Vibration Control Engineering: Principles and Applications*.'
  ],
  sim: 'en-room-noise'
},

{
  id: 'hand-arm-vibration', parent: 'noise-vibration', title: 'Hand-arm vibration', level: 2,
  short: 'Years of vibration from breakers, grinders, chainsaws and other hand-held tools damage the blood vessels, nerves and joints of the hands. The daily exposure A(8) combines the tool\'s weighted vibration with the trigger time; in Europe action starts at 2.5 m/s² and 5 m/s² must never be exceeded. Halving the vibration allows four times the time.',
  keywords: ['hand-arm vibration', 'HAVS', 'vibration white finger', 'Raynaud', 'A(8)', 'exposure action value', 'exposure limit value', 'trigger time', 'exposure points', 'ISO 5349', '2002/44/EC', 'power tools', 'anti-vibration gloves', 'low-vibration tools', 'carpal tunnel'],
  prereq: ['power-tools-ergonomics', 'repetitive-strain', 'physics:driven-oscillations'],
  related: ['whole-body-vibration', 'hand-tools', 'cold-stress', 'construction-ergonomics', 'agriculture-ergonomics', 'strength-and-force', 'motors:motor-vibration'],
  body: `
Hold a breaker, a grinder or a chainsaw for years and the vibration it pours into the hands damages the blood vessels, nerves and joints of the fingers and hands. **Hand-arm vibration syndrome** (HAVS) has three parts: **vascular** — "vibration white finger", attacks in which fingers turn white, then blue and red, usually triggered by cold; **neurological** — tingling, numbness, loss of feeling and dexterity, trouble with buttons and small parts; and **musculoskeletal** — aching and weakness of the hands and arms. Vibration also contributes to carpal tunnel syndrome. Advanced damage is permanent. Because it depends on dose, it is an engineering problem.

### Measuring vibration
Vibration entering the hand is measured as acceleration on the handle in three directions, **frequency-weighted** (ISO 5349-1) so that the frequencies most harmful to the hand — about 8–16 Hz, with less weight above — count most, and combined as a vector sum:

$$a_{hv} = \\sqrt{a_{hwx}^2 + a_{hwy}^2 + a_{hwz}^2}$$

Like noise, the dose combines magnitude and time, but on a squared (energy) basis. The **daily exposure** A(8) is the magnitude that would carry the same energy over 8 hours:

$$\\mathrm{A(8)} = \\sqrt{\\frac{1}{T_0}\\sum_i a_{hv,i}^2\\,T_i}, \\qquad T_0 = 8\\ \\mathrm{h}$$

Only **trigger time** counts — the time the tool actually vibrates in the hands, often a fraction of the time "on the job". Because the magnitude is squared (and then the [[?square-root|square root]] taken), halving the vibration allows four times the time.

### The limits (EU Directive 2002/44/EC)
| | A(8) | What follows |
|---|---|---|
| Exposure action value | **2.5 m/s²** | a programme of technical and organisational measures; health surveillance; information and training |
| Exposure limit value | **5 m/s²** | must not be exceeded; act at once |

With one tool, the action value is reached after $T = 8\\ \\mathrm{h}\\,(2.5/a)^2$ of trigger time and the limit value after $8\\ \\mathrm{h}\\,(5/a)^2$. The UK HSE turns this into **exposure points**, $2a^2T$ with $T$ in hours: 100 points a day is the action value, 400 the limit value, and points from different tools simply add.

| Tool (typical in use, rounded; any given tool may differ) | $a_{hv}$, m/s² | Trigger time to 2.5 m/s² | to 5 m/s² |
|---|---|---|---|
| Road breakers, demolition and chipping hammers | 10–20 | 8–30 min | 30 min–2 h |
| Rotary hammers, hammer drills, needle scalers | 6–15 | 13 min–1.4 h | 53 min–5.6 h |
| Angle grinders, orbital sanders, impact wrenches | 3–8 | 47 min–5.6 h | 3.1 h or more |
| Modern chainsaws, hedge trimmers, brush cutters | 3–7 | 1–5.6 h | 4.1 h or more |
| Well-designed low-vibration tools | 1–2.5 | 8 h or more | — |

Manufacturers declare vibration emission measured by standard test codes (EN 62841 and its predecessors). Real work — worn accessories, hard materials, awkward postures — can give more; use declared values to compare tools, and realistic data or measurement to assess exposure.

### How much risk?
Annex C of ISO 5349-1 gives an informative relation: the daily exposure at which about 10 % of workers may develop finger blanching after $D_y$ years,

$$D_y = 31.8\\,\\mathrm{A(8)}^{-1.06}$$

At the action value (2.5 m/s²) that is about 12 years; at the limit value (5 m/s²) about 6. The relation is uncertain and ignores the nerve effects — a reminder that the action value is where to start acting, not a safe line.

### Controlling it
1. **Change the process**: remote-controlled demolition machines, bursting or pulverising instead of breaking; diamond drilling and sawing instead of chiselling; parts designed to need no fettling or grinding.
2. **Choose low-vibration tools**: suspended or damped handles, balanced wheels, anti-vibration chainsaws; compare declared values within one tool type.
3. **Maintain**: sharp chisels and bits, balanced discs, serviced mounts.
4. **Take the weight and the push off the hands**: balancers, support arms and rigs let the operator guide rather than hold; high grip and feed forces pass more vibration into the hand.
5. **Limit trigger time**: rotate tasks and plan the day in points.
6. **Keep hands warm and dry**: cold triggers white-finger attacks; heated handles, warm gloves and warm breaks help. Anti-vibration gloves (ISO 10819) do little at the low frequencies of many tools and can increase grip force.
7. **Health surveillance**: questionnaires and checks spot early symptoms while they can still be halted.

### Settings
- **Workshop and industry**: grinders, sanders, impact wrenches, riveting, fettling in foundries; jigs and supports help most.
- **Construction and field**: breakers, compactors, cut-off saws and drills; long trigger times, and cold, wet weather that makes symptoms worse.
- **Agriculture and forestry**: chainsaws, brush cutters, hedge trimmers; handlebars of quads and motorcycles.
- **Military**: field engineering, vehicle maintenance and power tools in cold climates; handlebars and control levers of vehicles.
- **Home**: DIY and garden tools add to a worker's dose.

In the simulation, choose the tools and trigger times of a day. Watch the vibrating hand, the A(8) gauge against 2.5 and 5 m/s², the exposure points, and the curve of trigger time against vibration magnitude. [The vibration calculator](#/tools/environment/vibration) handles up to three tools.

> [!warn] White or numb fingers, tingling at night or a weakening grip in anyone who uses vibrating tools should be reported and checked by an occupational health professional or a doctor — early changes can be halted, later ones rarely reverse. This page explains exposure; it is not medical advice.

> [!key] A(8) = magnitude × √(trigger time ÷ 8 h). Halving the vibration allows four times the time. Act from 2.5 m/s², never exceed 5 m/s², and start by changing the process or the tool.
`,
  ideas: [
    'Hand-arm vibration syndrome damages blood vessels (white finger), nerves (numbness, lost dexterity) and joints; advanced damage is permanent.',
    'A(8) combines the weighted vibration magnitude with trigger time on an energy basis: halving the vibration allows four times the time.',
    'EU: action value 2.5 m/s², limit value 5 m/s² A(8); HSE points (2a²T) make the arithmetic easy: 100 and 400 points.',
    'The best controls change the process or the tool; gloves and time limits are weaker measures.'
  ],
  pitfalls: [
    'The time on the job is the exposure time — Only trigger time counts, the time the tool vibrates in the hands; overestimating it overstates the risk, underestimating it hides it.',
    'Anti-vibration gloves solve the problem — They reduce little at the low frequencies of breakers and many tools, and thick gloves raise grip force; change the tool or the process instead.',
    'The declared value on the tool is the exposure — It comes from a standard test and can be lower than real use with worn bits, hard materials and awkward postures.'
  ],
  formulas: [
    {
      name: 'Daily exposure from one tool',
      expr: 'A8 = a*sqrt(T/T0)', tex: '\\mathrm{A(8)} = a_{hv}\\sqrt{\\dfrac{T}{T_0}}',
      vars: {
        A8: { name: 'daily vibration exposure', q: 'accel', unit: 'm/s²', tex: '\\mathrm{A(8)}' },
        a: { name: 'vibration total value of the tool (weighted, three axes)', q: 'accel', unit: 'm/s²', value: 6, tex: 'a_{hv}' },
        T: { name: 'daily trigger time', q: 'time', unit: 'h', value: 1.5 },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      stories: { A8: 'A tool vibrates at {a} for {T} of trigger time a day. What is the daily exposure?', T: 'A tool vibrates at {a}. How much trigger time brings the daily exposure to {A8}?' }
    },
    {
      name: 'Daily exposure from two tools',
      expr: 'A8 = sqrt((a1^2*T1 + a2^2*T2)/T0)', tex: '\\mathrm{A(8)} = \\sqrt{\\dfrac{a_1^2 T_1 + a_2^2 T_2}{T_0}}',
      vars: {
        A8: { name: 'daily vibration exposure', q: 'accel', unit: 'm/s²', tex: '\\mathrm{A(8)}' },
        a1: { name: 'vibration of tool 1', q: 'accel', unit: 'm/s²', value: 8, tex: 'a_1' },
        T1: { name: 'trigger time with tool 1', q: 'time', unit: 'h', value: 0.5, tex: 'T_1' },
        a2: { name: 'vibration of tool 2', q: 'accel', unit: 'm/s²', value: 3, tex: 'a_2' },
        T2: { name: 'trigger time with tool 2', q: 'time', unit: 'h', value: 2, tex: 'T_2' },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      stories: { A8: 'A worker uses a tool of {a1} for {T1} and another of {a2} for {T2}. What is the daily exposure?', T2: 'After {T1} with a tool of {a1}, how long can a tool of {a2} be used before the exposure reaches {A8}?' }
    },
    {
      name: 'Trigger time to reach a value',
      expr: 'T = T0*(Av/a)^2', tex: 'T = T_0\\left(\\dfrac{A_v}{a_{hv}}\\right)^2',
      vars: {
        T: { name: 'trigger time allowed', q: 'time', unit: 'h' },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' },
        Av: { name: 'exposure value to reach (2.5 action, 5 limit)', q: 'accel', unit: 'm/s²', value: 2.5, tex: 'A_v' },
        a: { name: 'vibration total value of the tool', q: 'accel', unit: 'm/s²', value: 10, tex: 'a_{hv}' }
      },
      stories: { T: 'A breaker vibrates at {a}. How much trigger time reaches {Av}?', a: 'A job needs {T} of trigger time a day. How low must the tool\'s vibration be to stay at {Av}?' }
    },
    {
      name: 'Exposure points (UK HSE scheme)',
      expr: 'P = 2*a^2*T', tex: 'P = 2\\,a_{hv}^2\\,T',
      vars: {
        P: { name: 'exposure points (100 = action value, 400 = limit value)' },
        a: { name: 'vibration total value (in m/s²)', q: false, unit: 'm/s²', value: 5, tex: 'a_{hv}' },
        T: { name: 'trigger time (in hours)', q: false, unit: 'h', value: 2 }
      },
      note: 'Points from different tools add, which is why the scheme is popular on site.',
      stories: { P: 'A tool of {a} is used for {T} of trigger time. How many exposure points is that?', T: 'A tool vibrates at {a}. How long can it be used for {P} points?' }
    },
    {
      name: 'Years to finger blanching in 10 % of workers (ISO 5349-1, Annex C)',
      expr: 'Dy = 31.8*A^(-1.06)', tex: 'D_y = 31.8\\,\\mathrm{A(8)}^{-1.06}',
      vars: {
        Dy: { name: 'years of exposure', q: false, unit: 'years', tex: 'D_y' },
        A: { name: 'daily exposure A(8) (in m/s²)', q: false, unit: 'm/s²', value: 2.5, tex: '\\mathrm{A(8)}' }
      },
      note: 'An informative, uncertain relation for the vascular effects only.',
      stories: { Dy: 'A worker\'s daily exposure is {A} year after year. After how many years might 10 % of such workers show finger blanching?' }
    }
  ],
  examples: [
    {
      title: 'Two tools in a day',
      q: 'A fitter grinds for 2 h of trigger time with a grinder of 4 m/s² and uses an impact wrench of 7 m/s² for 30 min. Find the daily exposure and the HSE points.',
      steps: [
        '$\\mathrm{A(8)} = \\sqrt{(4^2\\times2 + 7^2\\times0.5)/8} = \\sqrt{(32 + 24.5)/8} = \\sqrt{7.06} = 2.66$ m/s².',
        'Points: $2\\times16\\times2 = 64$ for the grinder, $2\\times49\\times0.5 = 49$ for the wrench — 113 points.'
      ],
      a: '2.66 m/s² (113 points): just above the action value — a lower-vibration wrench or grinder would bring it below.'
    },
    {
      title: 'A breaker and a better breaker',
      q: 'A breaker vibrates at 15 m/s². How much trigger time reaches the action and the limit values? What if it is replaced by a low-vibration breaker of 7 m/s²?',
      steps: [
        '15 m/s²: action value after $8(2.5/15)^2 = 0.22$ h ≈ 13 min; limit value after $8(5/15)^2 = 0.89$ h ≈ 53 min.',
        '7 m/s²: action value after $8(2.5/7)^2 = 1.02$ h; limit value after $8(5/7)^2 = 4.1$ h.'
      ],
      a: 'About 13 min and 53 min for the old breaker; about 1 h and 4 h for the low-vibration one — more than four times longer.'
    }
  ],
  quiz: [
    { q: 'A tool\'s vibration is halved. How much longer can it be used for the same A(8)?', choices: ['4 times as long', '2 times as long', '√2 times as long', '8 times as long'], a: 0, why: 'A(8) grows with a√T; for the same A(8), T grows as 1/a²: half the vibration, four times the time.' },
    { q: 'Which time goes into A(8)?', choices: ['Trigger time: the time the tool vibrates in the hands', 'The whole shift', 'The time the tool is switched on, idling or not', 'The time since the last break'], a: 0, why: 'Only the time the hands are exposed to the tool\'s vibration counts.' },
    { q: 'A breaker vibrates at 10 m/s². How many minutes of trigger time reach the 2.5 m/s² action value?', answer: 30, unit: 'min', why: '8 h × (2.5/10)² = 0.5 h = 30 min.' },
    { q: 'Anti-vibration gloves reliably bring any tool below the action value.', a: false, why: 'They do little at the low frequencies of many tools and can increase grip force; change the tool or the process.' },
    { q: 'Why does cold matter for hand-arm vibration?', choices: ['Cold triggers white-finger attacks and reduces blood flow to the fingers', 'Cold air increases the tool\'s vibration', 'Cold makes A(8) larger by definition', 'It does not matter'], a: 0, why: 'The vascular damage shows as attacks brought on by cold; warm, dry hands and warm breaks are part of the controls.' }
  ],
  problems: [
    { q: 'A worker uses a sander of 5 m/s² for 3 h and a drill of 9 m/s² for 20 min (trigger times). What is A(8)?', answer: 3.57, unit: 'm/s²', tol: 0.01, steps: ['$\\mathrm{A(8)} = \\sqrt{(25\\times3 + 81\\times\\tfrac{1}{3})/8} = \\sqrt{(75 + 27)/8} = \\sqrt{12.75} = 3.57$ m/s².'] },
    { q: 'How many HSE exposure points is 1.5 h of trigger time with a tool of 6 m/s²?', answer: 108, unit: 'points', tol: 0.01, steps: ['$P = 2a^2T = 2\\times36\\times1.5 = 108$ points — just over the action value (100).'] }
  ],
  ranges: [
    { dim: 'Daily hand-arm vibration exposure A(8) below the action value', range: [null, 2.5], unit: 'm/s²', who: 'every user of vibrating tools, over a working life', why: 'Keeps the risk of HAVS low and avoids the duties of a reduction programme.', limits: 'Not risk-free: ISO 5349-1 still predicts finger blanching in some workers after about 12 years at 2.5 m/s².', setting: ['workshop', 'field', 'military'], src: 'Directive 2002/44/EC' },
    { dim: 'Hand-arm vibration exposure limit value', range: [null, 5], unit: 'm/s² A(8)', who: 'every worker, every day', why: 'A ceiling that must never be crossed.', limits: 'At 5 m/s² about 10 % may show finger blanching after 6 years; the limit is not a target.', setting: ['workshop', 'field', 'military'], src: 'Directive 2002/44/EC' },
    { dim: 'Exposure points per day (UK HSE scheme)', range: [null, 100], unit: 'points', who: 'site and workshop workers using several tools', why: 'Points add across tools; 100 equals the action value and 400 the limit value.', limits: 'Only as good as the vibration values and trigger times put in.', setting: ['workshop', 'field'], src: 'UK HSE guidance L140' },
    { dim: 'Trigger time with a 10 m/s² breaker before the action value', range: [null, 30], unit: 'min', who: 'construction and demolition workers', why: 'Shows how quickly high-vibration tools use up a day.', limits: 'Rotation only shares the dose; a low-vibration tool or a different method removes it.', setting: ['field', 'military'], src: 'Directive 2002/44/EC (action value); A(8) arithmetic' }
  ],
  applications: [
    'Planning tool use on a site in exposure points, and choosing tools by their declared vibration.',
    'Replacing breakers with remote-controlled demolition machines, bursting or diamond cutting.',
    'Tool balancers and support arms in workshops that let operators guide instead of hold.',
    'Checking a day\'s exposure with [the vibration calculator](#/tools/environment/vibration).'
  ],
  history: 'Finger blanching in users of pneumatic tools was described by Giovanni Loriga among Italian stone miners in 1911 and by Alice Hamilton among limestone cutters in Bedford, Indiana, in 1918. The Stockholm Workshop scales of the 1980s grade the vascular and sensorineural stages; the EU vibration directive of 2002 set the action and limit values used today.',
  sources: [
    'Directive 2002/44/EC on the minimum health and safety requirements regarding the exposure of workers to the risks arising from physical agents (vibration).',
    'ISO 5349-1, *Mechanical vibration — Measurement and evaluation of human exposure to hand-transmitted vibration — Part 1: General requirements* (frequency weighting, A(8), Annex C); ISO 5349-2 for measurement at the workplace.',
    'ISO 10819, *Mechanical vibration and shock — Hand-arm vibration — Measurement and evaluation of the vibration transmissibility of gloves at the palm of the hand*.',
    'UK HSE, *Hand-arm vibration* (L140), guidance on the Control of Vibration at Work Regulations 2005, with the exposure points system.',
    'M. J. Griffin, *Handbook of Human Vibration*.'
  ],
  sim: 'en-hav'
},

{
  id: 'whole-body-vibration', parent: 'noise-vibration', title: 'Whole-body vibration', level: 2,
  short: 'Vibration and shocks entering through the seat of forklifts, tractors, earth-movers, trucks and boats are linked with low-back disorders over years. The seated body resonates at about 4–6 Hz; a suspension seat tuned lower isolates it. The daily exposure A(8) uses the worst axis (horizontal × 1.4): in Europe action starts at 0.5 m/s² and 1.15 m/s² is the limit.',
  keywords: ['whole-body vibration', 'WBV', 'A(8)', 'vibration dose value', 'VDV', 'ISO 2631', 'suspension seat', 'transmissibility', 'resonance', 'SEAT', 'forklift', 'tractor', 'earth-moving machinery', 'low-back pain', 'shocks', 'ride comfort', 'motion sickness'],
  prereq: ['spinal-loading', 'vehicle-seating', 'physics:driven-oscillations'],
  related: ['hand-arm-vibration', 'mobile-machines', 'truck-bus-cabs', 'crew-stations', 'agriculture-ergonomics', 'construction-ergonomics', 'public-transport', 'physics:damped-oscillations'],
  body: `
Sit on a machine that shakes — a forklift on a rough yard, a tractor in a ploughed field, a dump truck on a haul road, a fast boat in a swell — and the vibration enters through the seat and runs up the spine. **Whole-body vibration** (WBV) over years is associated with low-back pain and disorders of the lumbar spine, usually together with the other burdens of driving work: long sitting, twisting to look behind, climbing in and out, lifting after a long drive. In the short term it brings discomfort, fatigue, blurred vision and poorer control of hands and feet; very slow motion, about 0.1–0.5 Hz, brings motion sickness.

### The body as a spring
The seated body has a strong **resonance at about 4–6 Hz**: the upper body bounces on the spine and pelvis, and vertical vibration there is amplified, not absorbed. The head and shoulders respond at higher frequencies, and vibration of the head and eyes blurs the view of displays and instruments. ISO 2631-1 therefore **frequency-weights** measurements, giving most weight to about 4–8 Hz vertically and 1–2 Hz horizontally.

### Measuring it
Acceleration is measured on the seat surface in three axes and frequency-weighted; for health, fore–aft (x) and side-to-side (y) values are multiplied by 1.4. The daily exposure uses the worst axis and, as for the hands, scales with the [[?square-root|square root]] of the time:

$$\\mathrm{A(8)} = k\\,a_w\\sqrt{\\frac{T}{T_0}}, \\qquad k = 1.4\\ (x, y),\\quad k = 1\\ (z)$$

Where the ride has **shocks** — potholes, waves, rough terrain — the rms value understates the harm, and the **vibration dose value** (VDV), built on the fourth [[?exponent|power]] of acceleration, is used; for steady vibration it can be estimated as $\\mathrm{VDV} \\approx 1.4\\,a_w\\,T^{1/4}$, with $T$ in seconds.

### The limits (EU Directive 2002/44/EC)
| | A(8) | or VDV |
|---|---|---|
| Exposure action value | **0.5 m/s²** | 9.1 m/s^1.75 |
| Exposure limit value | **1.15 m/s²** | 21 m/s^1.75 |

Member states chose between A(8) and VDV (the UK, for example, uses A(8)). ISO 2631-1 describes a health guidance caution zone that for 8 hours a day lies at roughly 0.45–0.9 m/s². With one machine the action value is reached after $T = 8\\ \\mathrm{h}\\,\\big(0.5/(k a_w)\\big)^2$.

| Machine (illustrative seat values; ground, speed, tyres, seat and driver change them widely) | $k\\,a_w$, m/s² |
|---|---|
| Cars and buses on good roads | 0.2–0.5 |
| Forklift trucks: smooth floors / rough yards | 0.3–0.7 / 0.7–1.5 |
| Excavators, wheel loaders | 0.3–1.0 |
| Tractors in the field, dump trucks, scrapers | 0.5–1.5 |
| Off-road military vehicles, fast boats | often above 1, with severe shocks |

### The seat as a filter
A **suspension seat** is a spring and damper tuned to a low natural frequency, typically about 1.5–2 Hz. Its **transmissibility** — seat vibration divided by floor vibration — follows the classic base-excited oscillator (see [[physics:driven-oscillations]]):

$$T_r = \\sqrt{\\frac{1 + (2\\zeta r)^2}{(1 - r^2)^2 + (2\\zeta r)^2}}, \\qquad r = \\frac{f}{f_n}$$

Above about 1.4 times its natural frequency the seat isolates — at the body's 4–6 Hz it can halve the vibration or better — but at its own frequency it amplifies, and on big bumps it hits its end stops, which can be worse than no suspension. Two things matter as much as the seat: it must be **matched to the machine** (ISO 7096 tests earth-moving machinery seats with the vibration of each machine class), and **adjusted to the driver's weight**, or its travel is wasted.

### Reducing it
1. **The ground**: smooth floors and yards, repaired potholes, graded haul roads — often the cheapest and largest gain.
2. **The speed**: vibration and shocks rise steeply with speed over rough ground; set and keep speed limits.
3. **The machine**: suspended cabs and axles, correct tyre pressures, suitable suspension seats, low-vibration machines when buying.
4. **The driver's posture and day**: mirrors and cameras instead of twisting round, steps and handholds instead of jumping down, breaks off the seat, no heavy lifting straight after long drives.
5. **Time**: rotate drivers where exposures are high.

### Settings
- **Vehicles and logistics**: forklifts, tugs, trucks and buses; floors and yards decide most of the exposure.
- **Field**: tractors, harvesters, earth-moving and forestry machines; long days in season.
- **Military**: tracked and wheeled vehicles off-road, fast boats slamming into waves, helicopters; shock-mitigating seats and crew rotation, with helmets and body armour loading the spine as well.
- **Public transport and offices**: health is not at issue, but ISO 2631-1 relates comfort to magnitude — below about 0.315 m/s² passengers are rarely uncomfortable, while around 0.8–1.6 m/s² most find it uncomfortable. That is the basis of ride quality in buses and trains.

In the simulation, a driver sits on a seat over a floor shaking at a chosen frequency. Compare a rigid seat, a foam cushion and a suspension seat, tune the suspension, find the body's resonance, and watch the daily exposure against 0.5 and 1.15 m/s² as the driving hours grow. [The vibration calculator](#/tools/environment/vibration) combines several machines.

> [!key] Whole-body vibration is judged by A(8) from the worst axis (horizontal × 1.4): act from 0.5 m/s², never exceed 1.15 m/s². Smooth the ground and slow down first; then choose and adjust a suspension seat tuned well below the body's 4–6 Hz resonance.
`,
  ideas: [
    'Long exposure to seat vibration and shocks is linked with low-back disorders, together with sitting, twisting and lifting.',
    'The seated body resonates at about 4–6 Hz; frequency weighting counts those frequencies most.',
    'A(8) uses the worst axis with horizontal values × 1.4; EU action value 0.5 m/s², limit 1.15 m/s² (or VDV 9.1 and 21).',
    'A suspension seat isolates above about 1.4 × its natural frequency but amplifies at it; it must suit the machine and the driver\'s weight.',
    'Smoother ground and lower speeds usually beat any seat.'
  ],
  pitfalls: [
    'Any suspension seat reduces vibration — At its own natural frequency it amplifies, and a seat not adjusted to the driver\'s weight bottoms out on bumps.',
    'Only vertical vibration matters — Fore–aft and side-to-side vibration count 1.4 times for health and often dominate on tractors and loaders.',
    'rms values capture rough rides — Shocks are underweighted by rms; the vibration dose value, using the fourth power, is meant for them.'
  ],
  formulas: [
    {
      name: 'Daily whole-body vibration exposure',
      expr: 'A8 = k*aw*sqrt(T/T0)', tex: '\\mathrm{A(8)} = k\\,a_w\\sqrt{\\dfrac{T}{T_0}}',
      vars: {
        A8: { name: 'daily exposure', q: 'accel', unit: 'm/s²', tex: '\\mathrm{A(8)}' },
        k: { name: 'axis factor (1.4 for x and y, 1 for z)', value: 1.4, min: 1, max: 1.4 },
        aw: { name: 'frequency-weighted rms acceleration on the seat', q: 'accel', unit: 'm/s²', value: 0.5, tex: 'a_w' },
        T: { name: 'daily exposure time', q: 'time', unit: 'h', value: 6 },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'Work out each axis and take the largest.',
      stories: { A8: 'A tractor seat measures {aw} fore–aft (k = {k}) for {T} a day. What is the daily exposure?', T: 'A seat measures {aw} (k = {k}). How many hours reach {A8}?' }
    },
    {
      name: 'Seat transmissibility (spring–damper on a shaking floor)',
      expr: 'Tr = sqrt((1 + (2*z*f/fn)^2)/((1 - (f/fn)^2)^2 + (2*z*f/fn)^2))', tex: 'T_r = \\sqrt{\\dfrac{1 + (2\\zeta f/f_n)^2}{\\left(1 - (f/f_n)^2\\right)^2 + (2\\zeta f/f_n)^2}}',
      vars: {
        Tr: { name: 'transmissibility (seat ÷ floor)', tex: 'T_r' },
        f: { name: 'vibration frequency', q: 'frequency', unit: 'Hz', value: 4, min: 0.1, max: 80 },
        fn: { name: 'natural frequency of the seat', q: 'frequency', unit: 'Hz', value: 1.8, min: 0.5, max: 20, tex: 'f_n' },
        z: { name: 'damping ratio', value: 0.3, min: 0.01, max: 1, tex: '\\zeta' }
      },
      note: 'Isolation (T below 1) only above f = √2 fₙ. Real seats add friction and end stops.',
      stories: { Tr: 'A suspension seat of natural frequency {fn} and damping ratio {z} sits on a floor shaking at {f}. What share of the vibration reaches the driver?' }
    },
    {
      name: 'Estimated vibration dose value',
      expr: 'VDV = 1.4*aw*T^0.25', tex: '\\mathrm{VDV} = 1.4\\,a_w\\,T^{1/4}',
      vars: {
        VDV: { name: 'estimated vibration dose value', q: false, unit: 'm/s^1.75', tex: '\\mathrm{VDV}' },
        aw: { name: 'frequency-weighted rms acceleration (in m/s²)', q: false, unit: 'm/s²', value: 0.8, tex: 'a_w' },
        T: { name: 'exposure time (in seconds)', q: false, unit: 's', value: 28800 }
      },
      note: 'For steady vibration without large shocks; with shocks, measure the VDV directly. EU action and limit values: 9.1 and 21 m/s^1.75.',
      stories: { VDV: 'A seat vibrates at {aw} for {T}. Estimate the vibration dose value.' }
    },
    {
      name: 'Time to reach an exposure value',
      expr: 'T = T0*(Av/(k*aw))^2', tex: 'T = T_0\\left(\\dfrac{A_v}{k\\,a_w}\\right)^2',
      vars: {
        T: { name: 'daily time allowed', q: 'time', unit: 'h' },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' },
        Av: { name: 'exposure value (0.5 action, 1.15 limit)', q: 'accel', unit: 'm/s²', value: 0.5, tex: 'A_v' },
        k: { name: 'axis factor', value: 1, min: 1, max: 1.4 },
        aw: { name: 'weighted rms acceleration on the seat', q: 'accel', unit: 'm/s²', value: 0.7, tex: 'a_w' }
      },
      stories: { T: 'A forklift seat measures {aw} vertically. How many hours of driving reach {Av}?' }
    }
  ],
  examples: [
    {
      title: 'A forklift on a rough yard',
      q: 'A forklift driver\'s seat measures 0.7 m/s² vertically, for 5 h of driving a day. Find A(8), and the effect of smoothing the yard so that the seat measures 0.45 m/s².',
      steps: [
        '$\\mathrm{A(8)} = 1\\times0.7\\sqrt{5/8} = 0.55$ m/s² — above the action value.',
        'After smoothing: $0.45\\sqrt{5/8} = 0.36$ m/s² — below it.',
        'Limiting time instead would allow $8(0.5/0.7)^2 = 4.1$ h of driving.'
      ],
      a: '0.55 m/s², falling to 0.36 m/s² with a smooth yard — better than cutting an hour of driving.'
    },
    {
      title: 'The worst axis',
      q: 'A tractor seat measures 0.5 m/s² fore–aft (x), 0.3 m/s² side-to-side (y) and 0.6 m/s² vertically (z), for 6 h a day. Find A(8).',
      steps: [
        'Weighted for health: x $1.4\\times0.5 = 0.70$, y $1.4\\times0.3 = 0.42$, z $0.60$ m/s². The worst is x.',
        '$\\mathrm{A(8)} = 0.70\\sqrt{6/8} = 0.61$ m/s².'
      ],
      a: '0.61 m/s², set by the fore–aft pitching, not the vertical bouncing.'
    },
    {
      title: 'Seat at resonance',
      q: 'A suspension seat has $f_n$ = 1.8 Hz and damping ratio 0.3. Find the transmissibility at 4 Hz and at 1.8 Hz.',
      steps: [
        'At 4 Hz, $r = 2.22$: $T_r = \\sqrt{(1 + 1.78)/(15.5 + 1.78)} = 0.40$.',
        'At 1.8 Hz, $r = 1$: $T_r = \\sqrt{1.36/0.36} = 1.94$.'
      ],
      a: 'It passes 40 % at 4 Hz but nearly doubles vibration at 1.8 Hz.'
    }
  ],
  quiz: [
    { q: 'Why are fore–aft and side-to-side seat accelerations multiplied by 1.4 for health?', choices: ['ISO 2631-1 counts horizontal vibration of seated people as more harmful per m/s² than vertical', 'Horizontal sensors read low', 'To convert rms to peak', 'Because there are two horizontal axes'], a: 0, why: 'The multiplying factor reflects the body\'s response to horizontal motion when seated; the worst axis then sets A(8).' },
    { q: 'A suspension seat tuned to 1.8 Hz meets floor vibration at 1.8 Hz. It…', choices: ['amplifies it', 'isolates it', 'has no effect', 'cancels it completely'], a: 0, why: 'At resonance a spring–damper amplifies; isolation starts only above about 1.4 × fₙ.' },
    { q: 'A forklift seat measures 0.8 m/s² vertically. How many hours of driving reach the 0.5 m/s² action value?', answer: 3.125, unit: 'h', why: '8 h × (0.5/0.8)² = 3.1 h.' },
    { q: 'Smoothing a rough yard can reduce a forklift driver\'s exposure more than any seat.', a: true, why: 'Removing the excitation at its source helps at every frequency; a seat only filters part of it.' },
    { q: 'At which frequencies does the seated body amplify vertical vibration most?', choices: ['About 4–6 Hz', 'About 0.1–0.5 Hz', 'About 50–100 Hz', 'About 1000 Hz'], a: 0, why: 'The upper body bounces on the spine and pelvis near 4–6 Hz; 0.1–0.5 Hz is the range of motion sickness.' }
  ],
  problems: [
    { q: 'A dumper driver sits at 0.9 m/s² (vertical) for 4 h and then at 0.3 m/s² for 2 h in another machine. What is A(8)?', answer: 0.654, unit: 'm/s²', tol: 0.01, steps: ['$\\mathrm{A(8)} = \\sqrt{(0.81\\times4 + 0.09\\times2)/8} = \\sqrt{0.4275} = 0.654$ m/s².'] },
    { q: 'Estimate the vibration dose value for a steady 0.6 m/s² over 8 hours.', answer: 10.9, unit: 'm/s^1.75', tol: 0.01, steps: ['$T = 28\\,800$ s, $T^{1/4} = 13.03$.', '$\\mathrm{VDV} \\approx 1.4\\times0.6\\times13.03 = 10.9$ m/s^1.75 — above the 9.1 action value.'] }
  ],
  ranges: [
    { dim: 'Daily whole-body vibration exposure A(8) below the action value', range: [null, 0.5], unit: 'm/s²', who: 'drivers and operators over a working life', why: 'Keeps the vibration contribution to back disorders low.', limits: 'Shocks, twisting, long sitting and lifting after driving add risks that A(8) does not capture.', setting: ['vehicle', 'field', 'military', 'workshop'], src: 'Directive 2002/44/EC' },
    { dim: 'Whole-body vibration exposure limit value', range: [null, 1.15], unit: 'm/s² A(8)', who: 'every driver and operator, every day', why: 'A ceiling that must not be crossed.', limits: 'Well above the ISO 2631-1 caution zone for 8 hours (about 0.45–0.9 m/s²).', setting: ['vehicle', 'field', 'military'], src: 'Directive 2002/44/EC' },
    { dim: 'Vibration dose value: action / limit', range: '9.1 / 21', unit: 'm/s^1.75', who: 'people exposed to rides with shocks: off-road vehicles, boats, rough yards', why: 'The fourth-power dose weights the jolts that rms averages away.', limits: 'Member states chose A(8) or VDV; very severe repeated shocks need separate assessment.', setting: ['vehicle', 'military', 'field'], src: 'Directive 2002/44/EC; ISO 2631-1' },
    { dim: 'Natural frequency of a suspension seat', range: [1.5, 2], unit: 'Hz', who: 'drivers of off-road and industrial machines', why: 'Isolates the body\'s 4–6 Hz resonance (isolation starts at about 1.4 × fₙ).', limits: 'Amplifies at its own frequency; needs enough travel and damping for the machine, and adjustment to the driver\'s weight.', setting: ['vehicle', 'field', 'military'], src: 'Typical seats; tested to ISO 7096 for earth-moving machinery' },
    { dim: 'Ride vibration for passenger comfort (weighted rms)', range: [null, 0.315], unit: 'm/s²', who: 'passengers of buses, trains and cars', why: 'Below this few people find the ride uncomfortable.', limits: 'Comfort also depends on duration, shocks, posture and expectations.', setting: ['vehicle', 'civil'], src: 'ISO 2631-1, Annex C' }
  ],
  applications: [
    'Specifying suspension seats matched to the machine (ISO 7096) and adjusted to each driver.',
    'Maintaining floors, yards and haul roads, and setting speed limits for vehicles on site.',
    'Shock-mitigating seats for fast boats and off-road vehicles; rotating crews.',
    'Checking a driver\'s day with [the vibration calculator](#/tools/environment/vibration).'
  ],
  history: 'Research on whole-body vibration grew with aviation, tractors and military vehicles after the Second World War. ISO 2631 was first published in 1974 and revised in 1997 as ISO 2631-1, with the frequency weightings and the vibration dose value used today; the EU vibration directive followed in 2002.',
  sources: [
    'Directive 2002/44/EC on the minimum health and safety requirements regarding the exposure of workers to the risks arising from physical agents (vibration).',
    'ISO 2631-1, *Mechanical vibration and shock — Evaluation of human exposure to whole-body vibration — Part 1: General requirements*.',
    'ISO 7096, *Earth-moving machinery — Laboratory evaluation of operator seat vibration*.',
    'UK HSE, *Whole-body vibration* (L141), guidance on the Control of Vibration at Work Regulations 2005.',
    'M. J. Griffin, *Handbook of Human Vibration*.'
  ],
  sim: 'en-wbv'
},

{
  id: 'thermal-comfort', parent: 'climate-light', title: 'Thermal comfort', level: 2,
  short: 'Whether a room feels right depends on six factors: air temperature, radiant temperature, air speed and humidity, and the person\'s activity and clothing. Fanger\'s PMV predicts the average vote from cold (−3) to hot (+3) and the PPD the share dissatisfied — never below 5 %. ISO 7730 puts an office at about 20–24 °C in winter clothing and 23–26 °C in summer clothing.',
  keywords: ['thermal comfort', 'PMV', 'PPD', 'Fanger', 'ISO 7730', 'operative temperature', 'mean radiant temperature', 'met', 'clo', 'clothing insulation', 'metabolic rate', 'draught', 'humidity', 'adaptive comfort', 'ASHRAE 55', 'EN 16798-1', 'office temperature'],
  prereq: ['medicine:thermoregulation', 'physics:heat-transfer', 'human-centred-design'],
  related: ['heat-stress', 'cold-stress', 'indoor-air', 'office-layout', 'control-rooms', 'clothing-ppe-allowances', 'physics:convection', 'physics:thermal-radiation'],
  body: `
Whether a room feels right depends on six things: four of the environment — **air temperature**, **mean radiant temperature** (of the surrounding surfaces), **air speed** and **humidity** — and two of the person — **activity** and **clothing**. The body makes heat all the time, about 100 W at rest and several hundred in hard work, and must lose just as much to hold its core near 37 °C (see [[medicine:thermoregulation]]). It loses it by [[physics:convection|convection]] to the air, by [[physics:thermal-radiation|radiation]] to the surfaces, by evaporation from skin and lungs, and a little by conduction. Comfort is the state in which that balance holds with little effort — no shivering, little sweating, no hot or cold spots.

### Units of the person
- **Metabolic rate** in met: 1 met = 58.2 W per m² of body surface, about 105 W for an adult of 1.8 m².
- **Clothing insulation** in clo: 1 clo = 0.155 m²·K/W, roughly a business suit.

| Activity | met | Clothing | clo |
|---|---|---|---|
| Seated, relaxed | 1.0 | Shorts and T-shirt | 0.3–0.4 |
| Office work | 1.1–1.2 | Light summer clothes | 0.5 |
| Standing, light work | 1.6 | Trousers and long-sleeved shirt | 0.6–0.7 |
| Walking, medium work | 2.0–3.0 | Business suit | 1.0 |
| Heavy work | 3.0–4.0 | Winter indoor clothes with a jumper | 1.2–1.5 |

The **operative temperature** combines air and radiant temperatures as the body feels them — at low air speeds simply their average. A room with 22 °C air and a cold window wall can feel like 20 °C at a desk beside the glass.

### PMV and PPD
P. O. Fanger turned the heat balance into a prediction of how a large group would vote on a seven-point scale, from −3 (cold) through 0 (neutral) to +3 (hot): the **predicted mean vote** (PMV). Because people differ, even at PMV = 0 about 5 % are dissatisfied, and the **predicted percentage dissatisfied** climbs steeply either side, following a bell-shaped [[?exponential]]:

$$\\mathrm{PPD} = 100 - 95\\,e^{-0.03353\\,\\mathrm{PMV}^4 - 0.2179\\,\\mathrm{PMV}^2}$$

| ISO 7730 category | PMV | PPD | Office, 1.2 met, winter clothes (1.0 clo) | Office, 1.2 met, summer clothes (0.5 clo) |
|---|---|---|---|---|
| A | −0.2 to +0.2 | < 6 % | 21–23 °C | 23.5–25.5 °C |
| B | −0.5 to +0.5 | < 10 % | 20–24 °C | 23–26 °C |
| C | −0.7 to +0.7 | < 15 % | 19–25 °C | 22–27 °C |

The model is for healthy adults in steady conditions — roughly 10–30 °C, air speeds up to 1 m/s, moderate activity and clothing. Outside that range use the methods of [[heat-stress]] and [[cold-stress]].

### Local discomfort
A room can be right on average and still uncomfortable in places. For category B, ISO 7730 asks for:
- **Draught**, the commonest complaint: in heated rooms keep the mean air speed at the occupant to about 0.15–0.2 m/s or less (its draught rating also counts air temperature and turbulence).
- **Vertical temperature difference**: the head (1.1 m) no more than 3 °C warmer than the ankles (0.1 m).
- **Floor temperature**: 19–29 °C for people in shoes.
- **Radiant asymmetry**: a warm ceiling less than 5 °C warmer, a cool wall or window less than 10 °C cooler than the rest.
- **Humidity** between about 30 and 70 % barely changes comfort; drier air irritates eyes and airways, especially at screens, and wetter air feels close and breeds mould (see [[indoor-air]]).

### People differ — give them control
Five per cent are unhappy in the best room, and groups differ: people who are older, less active, smaller or more lightly dressed tend to prefer warmer rooms. Kingma and van Marken Lichtenbelt (2015) argued that office settings based on the metabolism of a middle-aged man can leave many women too cool. The answer is **control**: layers allowed by dress codes, openable windows, desk fans, local heating, zones for different preferences. Office performance is best at about 21–23 °C and several per cent lower by 30 °C (a review by Seppänen, Fisk and Lei, 2006).

In naturally ventilated buildings people adapt with the season — clothing, windows, expectations — and accept a wider range. The **adaptive model** of EN 16798-1 sets the comfort temperature from the running mean outdoor temperature, $\\theta_c = 0.33\\,\\theta_{rm} + 18.8$ °C, with a band of about 3 °C either side for normal expectations; ASHRAE 55 has a similar model.

### Settings
| Setting | Activity and clothing | What matters |
|---|---|---|
| Office, control room | 1.1–1.3 met; 0.5–1.0 clo by season | draughts, sun through glass, personal control; night shifts in control rooms feel colder |
| Workshop, industry | 1.6–3 met; work clothes and PPE | radiant heat from machines and furnaces, draughts from doors; spot heating or cooling at the workstation |
| Health care, schools | resting patients and busy staff; active children | one room, several needs: patients cool while gowned staff are hot |
| Military | crews in vehicles and shelters with electronics, body armour, protective suits | heat from equipment and bodies in small spaces; suits that trap heat and moisture |
| Field | outdoors: see heat and cold stress | shelters, rest tents and cabs are the comfort zones to design |

In the simulation, set the room and the person — activity, clothing, air and wall temperatures, air speed and humidity — and read the PMV and PPD. The person's colour and the curve show how far the group has moved from neutral and how fast dissatisfaction climbs. [The thermal comfort calculator](#/tools/environment/thermal) does the same for your own room.

> [!key] Comfort is a heat balance of six factors. ISO 7730 predicts the average vote (PMV) and the dissatisfied (PPD, at least 5 %); design for a PMV within ±0.5, avoid draughts and cold surfaces, and give people control over the rest.
`,
  ideas: [
    'Six factors set thermal comfort: air temperature, radiant temperature, air speed, humidity, activity and clothing.',
    'PMV predicts the average vote from −3 to +3; PPD, the share dissatisfied, is at least 5 % even at PMV = 0.',
    'ISO 7730 category B: PMV within ±0.5, about 20–24 °C for winter office clothing and 23–26 °C for summer clothing.',
    'Local discomfort — draughts, cold windows, warm heads and cold feet — spoils a room that is right on average.',
    'People differ; personal control and adaptive expectations widen what is accepted.'
  ],
  pitfalls: [
    'The thermostat reading is what people feel — Radiant temperature matters as much as air temperature: a cold window or a sunny wall changes the operative temperature by several degrees.',
    'There is one right temperature for an office — It depends on clothing and activity: summer clothes need about 2–3 °C more than winter ones, and even then about 5 % remain unhappy.',
    'Humidity makes offices comfortable or not — Between about 30 and 70 % it has little effect on thermal sensation; it matters for heat stress, dryness and mould.'
  ],
  formulas: [
    {
      name: 'Predicted percentage dissatisfied from PMV',
      expr: 'PPD = 100 - 95*exp(-0.03353*PMV^4 - 0.2179*PMV^2)', tex: '\\mathrm{PPD} = 100 - 95\\,e^{-0.03353\\,\\mathrm{PMV}^4 - 0.2179\\,\\mathrm{PMV}^2}',
      vars: {
        PPD: { name: 'predicted percentage dissatisfied', q: false, unit: '%', tex: '\\mathrm{PPD}' },
        PMV: { name: 'predicted mean vote (−3 cold … +3 hot)', value: 0.5, signed: true, min: -3, max: 3, tex: '\\mathrm{PMV}' }
      },
      note: 'Symmetric: a PMV of −0.5 gives the same PPD as +0.5. Minimum 5 % at PMV = 0.',
      stories: { PPD: 'A room has a PMV of {PMV}. What share of the occupants are predicted to be dissatisfied?', PMV: 'At most {PPD} of the occupants may be dissatisfied. What PMV is that?' }
    },
    {
      name: 'Operative temperature',
      expr: 'to = A*ta + (1 - A)*tr', tex: 't_o = A\\,t_a + (1 - A)\\,t_r',
      vars: {
        to: { name: 'operative temperature', q: 'temperature', unit: '°C', tex: 't_o' },
        A: { name: 'weighting (0.5 below 0.2 m/s, 0.6 up to 0.6 m/s, 0.7 up to 1 m/s)', value: 0.5, min: 0.5, max: 0.7 },
        ta: { name: 'air temperature', q: 'temperature', unit: '°C', value: 22, tex: 't_a' },
        tr: { name: 'mean radiant temperature', q: 'temperature', unit: '°C', value: 17, tex: 't_r' }
      },
      stories: { to: 'The air is {ta} but the surfaces around a desk average {tr} (A = {A}). What operative temperature does the person feel?', ta: 'The surfaces average {tr}. What air temperature gives an operative temperature of {to} (A = {A})?' }
    },
    {
      name: 'Adaptive comfort temperature (naturally ventilated buildings)',
      expr: 'tc = 0.33*trm + 18.8', tex: '\\theta_c = 0.33\\,\\theta_{rm} + 18.8',
      vars: {
        tc: { name: 'comfort operative temperature (in °C)', q: false, unit: '°C', tex: '\\theta_c' },
        trm: { name: 'running mean outdoor temperature (in °C, valid about 10–30)', q: false, unit: '°C', value: 20, min: 10, max: 33, tex: '\\theta_{rm}' }
      },
      note: 'EN 16798-1, for buildings without mechanical cooling where occupants can open windows and adapt their clothing.',
      stories: { tc: 'The running mean outdoor temperature is {trm}. What indoor operative temperature do occupants of a naturally ventilated office find comfortable?' }
    },
    {
      name: 'Metabolic heat production',
      expr: 'H = 58.2*M*AD', tex: 'H = 58.2\\,M\\,A_D',
      vars: {
        H: { name: 'heat produced', q: 'power', unit: 'W' },
        M: { name: 'metabolic rate (met)', value: 1.2, min: 0.7, max: 8 },
        AD: { name: 'body surface area', q: 'area', unit: 'm²', value: 1.8, tex: 'A_D' }
      },
      note: '58.2 W/m² per met. An average adult has about 1.8 m² of skin.',
      stories: { H: 'A person of {AD} surface area works at {M} met. How much heat do they produce?', M: 'A person of {AD} produces {H}. What activity level in met is that?' }
    }
  ],
  examples: [
    {
      title: 'The over-cooled summer office',
      q: 'An office is held at 22 °C (air and surfaces), air speed 0.1 m/s, 50 % humidity, for office work (1.2 met). Compare occupants in winter clothes (1.0 clo) and in light summer clothes (0.5 clo).',
      steps: [
        'Winter clothes: PMV ≈ +0.1, PPD ≈ 5 % — near perfect.',
        'Summer clothes: PMV ≈ −0.8, PPD ≈ 19 % — cool, outside category B.',
        'At 0.5 clo, PMV ≈ 0 needs about 24.5 °C: raising the summer set point saves cooling energy and pleases more people.'
      ],
      a: 'The same 22 °C suits winter clothing (5 % dissatisfied) but leaves about one in five cold in summer clothing.'
    },
    {
      title: 'The desk by the window',
      q: 'The air is 22 °C but the mean radiant temperature at a desk next to a cold window is 19 °C, with still air. What operative temperature does the occupant feel?',
      steps: [
        'Below 0.2 m/s, $A = 0.5$: $t_o = 0.5\\times22 + 0.5\\times19 = 20.5$ °C.',
        'For 1.0 clo and 1.2 met the PMV falls from about +0.1 to about −0.2 — and the cold glass adds radiant asymmetry on one side.'
      ],
      a: 'About 20.5 °C: move the desk, improve the glazing or add a local radiant heater, rather than heating the whole room.'
    }
  ],
  quiz: [
    { q: 'Even in an ideal room, what share of people does the PMV model predict to be dissatisfied?', choices: ['About 5 %', '0 %', 'About 20 %', 'About 50 %'], a: 0, why: 'PPD has a minimum of 5 % at PMV = 0: people differ.' },
    { q: 'Two offices both have 22 °C air; one has a large cold window wall. Why does it feel colder?', choices: ['The radiant temperature is lower, so the operative temperature is lower', 'Cold windows make the air humid', 'Windows let noise in', 'It does not: only air temperature counts'], a: 0, why: 'The body exchanges heat by radiation with the surfaces around it as much as with the air.' },
    { q: 'What PPD corresponds to a PMV of +1?', answer: 26, unit: '%', why: '100 − 95 e^(−0.03353 − 0.2179) = 100 − 95 × 0.778 ≈ 26 %.' },
    { q: 'Relative humidity between 30 and 70 % has a large effect on thermal comfort at normal office temperatures.', a: false, why: 'In this range humidity changes the thermal sensation very little; it matters in heat and for dryness and mould.' },
    { q: 'An office is cooled to 22 °C in summer while its occupants wear light clothing (0.5 clo). What is likely?', choices: ['Many feel cool: PMV about −0.8', 'Everyone is comfortable', 'Most feel warm', 'Humidity rises too high'], a: 0, why: 'Summer clothing needs about 24–25 °C for neutrality at office activity.' }
  ],
  problems: [
    { q: 'The air is 24 °C and the mean radiant temperature near sunny glazing is 30 °C, with still air. What is the operative temperature?', answer: 27, unit: '°C', tol: 0.01, steps: ['$t_o = 0.5\\times24 + 0.5\\times30 = 27$ °C.'] },
    { q: 'How much heat does a person with 1.9 m² of body surface produce at 1.6 met?', answer: 177, unit: 'W', tol: 0.01, steps: ['$H = 58.2\\times1.6\\times1.9 = 177$ W.'] }
  ],
  ranges: [
    { dim: 'Operative temperature, office in winter (1.2 met, 1.0 clo), category B', range: [20, 24], unit: '°C', who: 'sedentary office workers in winter clothing', why: 'PMV within ±0.5: about 10 % dissatisfied at most.', limits: 'Lighter clothing, older or less active people need the warm end; draughts and cold windows spoil it locally.', setting: ['office', 'school', 'health'], src: 'ISO 7730, Annex A' },
    { dim: 'Operative temperature, office in summer (1.2 met, 0.5 clo), category B', range: [23, 26], unit: '°C', who: 'sedentary office workers in light clothing', why: 'PMV within ±0.5; avoids over-cooling and saves energy.', limits: 'Dress codes that force suits in summer shift the need down by 2–3 °C; air movement under personal control extends the upper end.', setting: ['office', 'school', 'health'], src: 'ISO 7730, Annex A' },
    { dim: 'Predicted mean vote, category B', range: [-0.5, 0.5], unit: 'PMV', who: 'a group of occupants', why: 'Keeps the predicted dissatisfied below 10 %.', limits: 'An average: individuals range widely; the model assumes steady conditions.', setting: ['office', 'school', 'health', 'civil'], src: 'ISO 7730' },
    { dim: 'Head-to-ankle air temperature difference, seated', range: [null, 3], unit: '°C', who: 'seated occupants', why: 'Avoids warm heads and cold feet.', limits: 'Stratified heating (warm air from above) and cold floors break it.', setting: ['office', 'school', 'civil'], src: 'ISO 7730 (category B)' },
    { dim: 'Floor surface temperature, people in shoes', range: [19, 29], unit: '°C', who: 'people standing or sitting with feet on the floor', why: 'Neither cold nor hot feet.', limits: 'Barefoot use (bathrooms, sports halls, homes) needs a narrower range that depends on the floor material.', setting: ['office', 'civil', 'school'], src: 'ISO 7730' },
    { dim: 'Mean air speed at the occupant in heated rooms', range: [null, 0.2], unit: 'm/s', who: 'sedentary occupants, especially at the neck and ankles', why: 'Avoids draught, the commonest thermal complaint.', limits: 'In warm conditions faster air under personal control (desk and ceiling fans) is welcome and allows warmer set points.', setting: ['office', 'school', 'health'], src: 'ISO 7730 (draught rating); ASHRAE 55 (elevated air speed)' },
    { dim: 'Relative humidity for thermal comfort', range: [30, 70], unit: '%', who: 'occupants of heated or cooled rooms', why: 'Within this band humidity barely changes the thermal sensation.', limits: 'Below about 30 % eyes and airways dry out; above about 60 % mould and dust mites thrive — see indoor air.', setting: ['office', 'civil', 'school', 'health'], src: 'Common design practice' }
  ],
  applications: [
    'Setting heating and cooling set points by season and clothing, with zones and personal control: see [the thermal comfort calculator](#/tools/environment/thermal).',
    'Placing desks away from cold windows, supply-air jets and doors; shading against sun.',
    'Spot heating and cooling at workstations in large workshops instead of conditioning the whole hall.',
    'Ventilated clothing and cooled rest areas for crews in hot vehicles and protective suits.'
  ],
  history: 'Povl Ole Fanger of the Technical University of Denmark published *Thermal Comfort* in 1970, with the PMV and PPD built on climate-chamber tests of many subjects; ISO 7730 adopted them in 1984. Field studies by Michael Humphreys, Fergus Nicol, Richard de Dear, Gail Brager and others showed that people in naturally ventilated buildings adapt to the season, which led to the adaptive models of ASHRAE 55 and the European standards.',
  sources: [
    'ISO 7730, *Ergonomics of the thermal environment — Analytical determination and interpretation of thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria*.',
    'ISO 8996 (determination of metabolic rate) and ISO 9920 (estimation of clothing insulation).',
    'EN 16798-1, *Energy performance of buildings — Ventilation for buildings — Part 1: Indoor environmental input parameters* (the adaptive model).',
    'ANSI/ASHRAE Standard 55, *Thermal Environmental Conditions for Human Occupancy*.',
    'P. O. Fanger, *Thermal Comfort: Analysis and Applications in Environmental Engineering*, 1970.',
    'B. Kingma and W. van Marken Lichtenbelt, "Energy consumption in buildings and female thermal demand", *Nature Climate Change*, 2015; O. Seppänen, W. J. Fisk and Q. H. Lei, "Effect of temperature on task performance in office environment", Lawrence Berkeley National Laboratory, 2006.'
  ],
  sim: 'en-pmv'
},

{
  id: 'heat-stress', parent: 'climate-light', title: 'Heat stress', level: 2,
  short: 'In heat the body must shed its own heat, mostly by sweating, and humidity, sun, radiant sources, heavy work and protective clothing all make that harder. The wet-bulb globe temperature (WBGT, ISO 7243) folds them into one index, compared with a reference that falls as work gets harder and is lower for people not acclimatised. Work–rest, shade, water and acclimatisation keep people safe.',
  keywords: ['heat stress', 'WBGT', 'wet bulb globe temperature', 'ISO 7243', 'heat stroke', 'heat exhaustion', 'acclimatisation', 'work–rest', 'metabolic rate', 'globe temperature', 'natural wet bulb', 'clothing adjustment', 'hydration', 'heat categories', 'flag conditions', 'TB MED 507'],
  prereq: ['thermal-comfort', 'medicine:heat-cold', 'work-rest-scheduling'],
  related: ['outdoor-heat-sun', 'extreme-environments', 'ppe-ergonomics', 'commercial-kitchens', 'cold-stress', 'fatigue-rest-breaks', 'load-carriage', 'medicine:thermoregulation'],
  body: `
In heat the body's problem is getting rid of its own heat. At rest it makes about 100 W; in hard work 400–600 W and more. When the air is hotter than the skin (about 35 °C), convection and radiation bring heat *in*, and only the evaporation of sweat takes it out — and humid air limits evaporation. Sun, furnaces and hot machinery add radiant heat; heavy or impermeable clothing and PPE block evaporation. When heat gained exceeds heat lost, the core temperature rises.

### What heat does
- **Performance first**: lapses of attention, slower decisions, more errors and accidents — well before any illness.
- **Heat rash, cramps and fainting** (heat syncope), especially in people not yet used to heat.
- **Heat exhaustion**: heavy sweating, weakness, headache, nausea; rest in the cool and drink.
- **Heat stroke**: core temperature above about 40 °C with confusion, collapse or seizures — an emergency that can kill (see [[medicine:heat-cold]]).
- **Dehydration** of more than about 2 % of body mass lowers physical and mental performance.

### The WBGT index
The **wet-bulb globe temperature** (ISO 7243) folds humidity, radiant heat and air temperature into one number, a weighted [[?mean]] of three thermometers:

$$\\mathrm{WBGT}_{in} = 0.7\\,t_{nw} + 0.3\\,t_g, \\qquad \\mathrm{WBGT}_{out} = 0.7\\,t_{nw} + 0.2\\,t_g + 0.1\\,t_a$$

$t_{nw}$ is the natural wet-bulb temperature (a wetted wick in the open air — 70 % of the weight, because evaporation is what matters), $t_g$ the temperature inside a 150 mm black globe (radiant heat), and $t_a$ the air temperature. The index was devised by Yaglou and Minard for the US Marine Corps in the 1950s after heat casualties in recruit training.

The measured WBGT is compared with a **reference value** that falls as work gets harder and is lower for people not acclimatised:

| Work rate (ISO 7243 classes; approximate reference values) | Metabolic rate | Acclimatised | Not acclimatised |
|---|---|---|---|
| Resting | up to about 117 W | 33 °C | 32 °C |
| Low: light hand and arm work, sitting or standing | 117–234 W | 30 °C | 29 °C |
| Moderate: sustained arm and leg work, walking at 3.5–5.5 km/h | 234–360 W | 28 °C | 26 °C |
| High: heavy arm and trunk work, shovelling, sawing | 360–468 W | about 25–26 °C | about 22–23 °C |
| Very high: very intense work at a fast pace | over 468 W | about 23–25 °C | about 18–20 °C |

Clothing shifts the picture. Ordinary work clothes need no correction, but ACGIH (and the 2017 edition of ISO 7243) add a **clothing adjustment** to the measured WBGT — about 3 °C for double-layer woven clothing and about 11 °C for vapour-barrier coveralls of the kind worn for chemical protection.

### Work, rest, water and acclimatisation
- **Work–rest**: when the WBGT exceeds the reference, shorten work and lengthen rests, ideally in cooler shade. ISO 7243 averages both the WBGT and the metabolic rate over an hour, so rests in the shade lower both. ACGIH and the US military publish work–rest tables built the same way; the US military grades heat into five categories by WBGT, from about 25.6 °C (78 °F) to 32.2 °C (90 °F) and above, each with its work–rest cycles and water.
- **Water**: about a cup (250 mL) every 15–20 minutes in moderate work in heat. Drinking more than about 1.4 L an hour risks dangerously diluting the blood's sodium; long shifts also need salt from food or drinks.
- **Acclimatisation**: over 7–14 days of work in heat the body sweats earlier and more, loses less salt, and the heart rate for a given job falls. NIOSH recommends that new workers spend no more than 20 % of the usual time in heat on day 1 and add no more than 20 % a day; experienced workers returning can start at 50 %. The adaptation begins to fade after about a week away.
- **Monitoring**: work in pairs, know the signs, and for high-risk work measure heart rate or core temperature (ISO 9886). A WHO group (1969) set the classic aim of keeping core temperature below 38 °C in prolonged daily work.

### Controls
1. **Engineering**: shade and roofs; shields and insulation for radiant sources — a reflective screen in front of a furnace lowers the globe temperature; ventilation and fans while the air is cooler than the skin (in hot, humid air above about 35 °C fans can add heat); spot cooling, air-conditioned cabs and cool rest areas.
2. **Organisation**: heavy work in the cool hours, work–rest cycles, more people for heavy tasks, acclimatisation plans, heat alerts, a buddy system.
3. **Personal**: light, loose, breathable clothing where PPE allows; cooling vests with ice or phase-change packs under protective suits; water always at hand.

### Settings
- **Workshop and industry**: foundries, glassworks, bakeries, laundries and commercial kitchens, where radiant heat dominates; shields and spot cooling.
- **Field**: construction, agriculture and road work in sun; WBGT measured outdoors, shade and water on site, heavy work early (see [[outdoor-heat-sun]]).
- **Military**: marches with loads, body armour and helmets, hot crew compartments, protective suits that block evaporation; work–rest by heat category, water discipline, acclimatisation before deployment (see [[extreme-environments]]).
- **Health care and emergency services**: gowns, respirators and firefighting kit turn moderate rooms into heat stress.
- **Office**: summer overheating is a comfort and performance problem rather than heat stress — but pregnancy, some medicines and heart disease make some people vulnerable.

In the simulation, set the weather or the furnace, the work and the clothing. The instruments read the three temperatures, the WBGT is compared with the reference, and the chart finds how many minutes of each hour can be worked with rest in the shade. [The heat stress calculator](#/tools/environment/heat) does the same for your site.

> [!warn] Heat stroke is an emergency: confusion, collapse, seizures or hot, dry skin in someone working in heat. Call your local emergency number and cool the person at once — immersion in cold water works best. This page explains heat stress for design and planning; it is not medical advice.

> [!key] WBGT = 0.7 × wet bulb + 0.3 × globe (with sun: 0.2 × globe + 0.1 × air) folds humidity and radiant heat into one index. Compare it with the reference for the work rate and acclimatisation, then lighten the work, add rest in the shade, water and time to acclimatise.
`,
  ideas: [
    'In heat, sweating is the main way to lose heat; humidity, sun, radiant sources and impermeable clothing all hinder it.',
    'WBGT weights the natural wet bulb 70 %, the globe 20–30 % and the air 0–10 %.',
    'Reference values fall with work rate — about 33 °C at rest to 23–25 °C for very heavy work — and are lower for people not acclimatised.',
    'Work–rest in the shade lowers both the average WBGT and the average metabolic rate; water, salt and 7–14 days of acclimatisation make heat work safer.'
  ],
  pitfalls: [
    'The air temperature tells you the heat stress — Humidity and radiant heat can make a 30 °C day far more dangerous than a dry 35 °C one; measure WBGT.',
    'Fans always help — When the air is hotter than the skin and humid, fans can add heat faster than extra sweating removes it.',
    'Fit, experienced workers are safe on the first hot day — Acclimatisation takes 7–14 days and fades after a week or so away; new and returning workers are at the highest risk.'
  ],
  formulas: [
    {
      name: 'WBGT outdoors in sun',
      expr: 'W = 0.7*tnw + 0.2*tg + 0.1*ta', tex: '\\mathrm{WBGT} = 0.7\\,t_{nw} + 0.2\\,t_g + 0.1\\,t_a',
      vars: {
        W: { name: 'wet-bulb globe temperature', q: 'temperature', unit: '°C', tex: '\\mathrm{WBGT}' },
        tnw: { name: 'natural wet-bulb temperature', q: 'temperature', unit: '°C', value: 24, tex: 't_{nw}' },
        tg: { name: 'black globe temperature', q: 'temperature', unit: '°C', value: 45, tex: 't_g' },
        ta: { name: 'air (dry-bulb) temperature', q: 'temperature', unit: '°C', value: 32, tex: 't_a' }
      },
      stories: { W: 'On a building site the natural wet bulb reads {tnw}, the globe {tg} and the air {ta}. What is the WBGT?', tnw: 'The globe reads {tg} and the air {ta}. What natural wet-bulb temperature gives a WBGT of {W}?' }
    },
    {
      name: 'WBGT indoors or without sun',
      expr: 'W = 0.7*tnw + 0.3*tg', tex: '\\mathrm{WBGT} = 0.7\\,t_{nw} + 0.3\\,t_g',
      vars: {
        W: { name: 'wet-bulb globe temperature', q: 'temperature', unit: '°C', tex: '\\mathrm{WBGT}' },
        tnw: { name: 'natural wet-bulb temperature', q: 'temperature', unit: '°C', value: 24, tex: 't_{nw}' },
        tg: { name: 'black globe temperature', q: 'temperature', unit: '°C', value: 35, tex: 't_g' }
      },
      stories: { W: 'In a bakery the natural wet bulb reads {tnw} and the globe {tg}. What is the WBGT?' }
    },
    {
      name: 'Hourly time-weighted WBGT (work and rest in different places)',
      expr: 'W = (W1*t1 + W2*t2)/(t1 + t2)', tex: '\\mathrm{WBGT}_{TWA} = \\dfrac{W_1 t_1 + W_2 t_2}{t_1 + t_2}',
      vars: {
        W: { name: 'time-weighted average WBGT', q: 'temperature', unit: '°C', tex: '\\mathrm{WBGT}_{TWA}' },
        W1: { name: 'WBGT at work', q: 'temperature', unit: '°C', value: 30, tex: 'W_1' },
        t1: { name: 'work time in the hour', q: 'time', unit: 'min', value: 45, tex: 't_1' },
        W2: { name: 'WBGT where people rest', q: 'temperature', unit: '°C', value: 25, tex: 'W_2' },
        t2: { name: 'rest time in the hour', q: 'time', unit: 'min', value: 15, tex: 't_2' }
      },
      stories: { W: 'People work {t1} at a WBGT of {W1} and rest {t2} in shade at {W2}. What is the hourly average WBGT?', t1: 'Rest is {t2} at {W2}; work is at {W1}. How many minutes of work keep the average at {W}?' }
    },
    {
      name: 'Hourly time-weighted metabolic rate',
      expr: 'M = (M1*t1 + M2*t2)/(t1 + t2)', tex: '\\bar{M} = \\dfrac{M_1 t_1 + M_2 t_2}{t_1 + t_2}',
      vars: {
        M: { name: 'average metabolic rate over the hour', q: 'power', unit: 'W', tex: '\\bar{M}' },
        M1: { name: 'metabolic rate at work', q: 'power', unit: 'W', value: 400, tex: 'M_1' },
        t1: { name: 'work time in the hour', q: 'time', unit: 'min', value: 45, tex: 't_1' },
        M2: { name: 'metabolic rate at rest', q: 'power', unit: 'W', value: 150, tex: 'M_2' },
        t2: { name: 'rest time in the hour', q: 'time', unit: 'min', value: 15, tex: 't_2' }
      },
      note: 'Compare the time-weighted WBGT with the reference value for the time-weighted metabolic rate.',
      stories: { M: 'Work at {M1} for {t1}, rest at {M2} for {t2}. What is the average metabolic rate?' }
    }
  ],
  examples: [
    {
      title: 'Road work at noon',
      q: 'On a road job at midday the natural wet bulb reads 26 °C, the globe 52 °C and the air 34 °C. The crew is acclimatised and doing moderate work. Judge the heat stress.',
      steps: [
        '$\\mathrm{WBGT} = 0.7\\times26 + 0.2\\times52 + 0.1\\times34 = 18.2 + 10.4 + 3.4 = 32.0$ °C.',
        'The reference for moderate work, acclimatised, is about 28 °C: 4 °C over — close even to the resting value of 33 °C.',
        '32.0 °C is 89.6 °F: category 4 of the five US military heat categories.'
      ],
      a: 'WBGT 32 °C, far above the reference: move heavy work to the early morning, give shade and water, and use long rest breaks now.'
    },
    {
      title: 'Work–rest in the shade',
      q: 'Work at WBGT 30 °C costs 350 W; rest in the shade at WBGT 26 °C costs 120 W. Compare 45/15 and 30/30 minutes of work/rest per hour for acclimatised workers.',
      steps: [
        '45/15: WBGT $= (30\\times45 + 26\\times15)/60 = 29.0$ °C; $\\bar{M} = (350\\times45 + 120\\times15)/60 = 293$ W — moderate class, reference 28 °C: still 1 °C over.',
        '30/30: WBGT $= 28.0$ °C; $\\bar{M} = 235$ W — at the boundary of the low and moderate classes (reference 28–30 °C): acceptable.'
      ],
      a: 'Half-hour rests in the shade bring the hour within the reference; 15-minute rests do not.'
    },
    {
      title: 'Protective coveralls',
      q: 'Workers in vapour-barrier chemical coveralls work indoors where the WBGT is 24 °C. What is the effective WBGT?',
      steps: [
        'Add the clothing adjustment of about 11 °C: $24 + 11 = 35$ °C.',
        'That exceeds every reference value, even at rest.'
      ],
      a: 'About 35 °C effective: short work periods, cooling vests and cool rest areas are essential.'
    }
  ],
  quiz: [
    { q: 'Why does the natural wet-bulb temperature carry 70 % of the WBGT?', choices: ['In heat the body loses heat mainly by evaporating sweat, which humidity limits', 'Wet-bulb thermometers are the most accurate', 'It is the highest of the three readings', 'Because air temperature does not matter'], a: 0, why: 'The natural wet bulb responds to humidity and air movement — the conditions for evaporation.' },
    { q: 'Fans always help workers in heat.', a: false, why: 'Above skin temperature (about 35 °C) in humid air, moving air can add heat faster than extra evaporation removes it.' },
    { q: 'Outdoors in sun: natural wet bulb 25 °C, globe 48 °C, air 33 °C. What is the WBGT?', answer: 30.4, unit: '°C', why: '0.7 × 25 + 0.2 × 48 + 0.1 × 33 = 17.5 + 9.6 + 3.3 = 30.4 °C.' },
    { q: 'A new worker starts a hot job. What does NIOSH recommend?', choices: ['At most 20 % of the usual time in heat on day 1, increasing by at most 20 % a day', 'A full shift from day 1 if they are fit', 'Half days for six months', 'Only night shifts'], a: 0, why: 'Acclimatisation takes 7–14 days; the first days are the most dangerous.' },
    { q: 'Which of these calls for an emergency response?', choices: ['A worker in heat who is confused and collapses', 'Heavy sweating during work', 'Thirst', 'A red face after lifting'], a: 0, why: 'Confusion or collapse in heat suggests heat stroke: call the emergency number and cool the person at once.' }
  ],
  problems: [
    { q: 'Indoors near a furnace the natural wet bulb reads 25 °C and the globe 50 °C. What is the WBGT?', answer: 32.5, unit: '°C', tol: 0.005, steps: ['$\\mathrm{WBGT} = 0.7\\times25 + 0.3\\times50 = 17.5 + 15 = 32.5$ °C.'] },
    { q: 'People work 40 minutes at a WBGT of 31 °C and rest 20 minutes in shade at 25 °C. What is the hourly time-weighted WBGT?', answer: 29, unit: '°C', tol: 0.005, steps: ['$(31\\times40 + 25\\times20)/60 = (1240 + 500)/60 = 29.0$ °C.'] }
  ],
  ranges: [
    { dim: 'WBGT reference, moderate work, acclimatised workers', range: [null, 28], unit: '°C', who: 'healthy acclimatised adults in ordinary work clothes doing sustained arm and leg work', why: 'Most such workers keep their core temperature below about 38 °C.', limits: 'Lower for people not acclimatised (26 °C), for heavier work and for impermeable clothing; individuals differ — watch each other.', setting: ['workshop', 'field', 'military'], src: 'ISO 7243 (approximate reference values)' },
    { dim: 'WBGT reference, moderate work, not acclimatised', range: [null, 26], unit: '°C', who: 'new starters, people back from leave, visitors', why: 'Allows for the smaller sweat response of people not used to heat.', limits: 'Still an average; illness, some medicines and poor fitness lower tolerance.', setting: ['workshop', 'field', 'military'], src: 'ISO 7243 (approximate reference values)' },
    { dim: 'WBGT reference, heavy work, acclimatised', range: [null, 26], unit: '°C', who: 'acclimatised workers shovelling, sawing, carrying heavy material', why: 'Heavy work makes 400 W or more of heat that must be shed.', limits: 'About 25 °C in still air; much lower with protective clothing (add its clothing adjustment).', setting: ['workshop', 'field', 'military'], src: 'ISO 7243 (approximate reference values)' },
    { dim: 'Core body temperature in prolonged daily work in heat', range: [null, 38], unit: '°C', who: 'workers in heat, day after day', why: 'Keeps a safety margin from heat exhaustion and heat stroke.', limits: 'Measured only in high-risk work (ISO 9886); rising heart rate and signs of strain call for rest before it is reached.', setting: ['workshop', 'field', 'military'], src: 'WHO scientific group, 1969' },
    { dim: 'Water in moderate work in heat', range: [0.75, 1], unit: 'L/h', who: 'people sweating in moderate work', why: 'Replaces most of the sweat lost and keeps dehydration below about 2 % of body mass.', limits: 'Not more than about 1.4 L an hour (risk of low blood sodium); long shifts need salt as well.', setting: ['workshop', 'field', 'military'], src: 'NIOSH (a cup every 15–20 min); US Army TB MED 507 (hourly maximum)' },
    { dim: 'Days of graded exposure to acclimatise to heat', range: [7, 14], unit: 'days', who: 'new and returning workers, deploying personnel', why: 'Earlier and more sweating, less salt lost, lower heart rate for the same work.', limits: 'Fades after about a week away; does not protect against dehydration or impermeable clothing.', setting: ['workshop', 'field', 'military'], src: 'NIOSH criteria for heat, 2016' },
    { dim: 'Clothing adjustment added to WBGT for vapour-barrier coveralls', range: 'about +11', unit: '°C', who: 'people in chemical-protective suits', why: 'Accounts for the blocked evaporation, so the reference values still apply.', limits: 'An approximation; fully encapsulating suits may need physiological monitoring.', setting: ['workshop', 'military', 'health'], src: 'ACGIH TLV for heat stress; ISO 7243:2017' }
  ],
  applications: [
    'Heat stress plans for construction, agriculture and military training with WBGT measured on site: see [the heat stress calculator](#/tools/environment/heat).',
    'Radiant shields, spot cooling and cooled rest areas in foundries, bakeries and kitchens.',
    'Acclimatisation schedules for new starters and people returning from leave.',
    'Cooling vests and short work periods for people in protective suits.'
  ],
  history: 'Heat casualties among US Marine Corps recruits at Parris Island led C. P. Yaglou and D. Minard to devise the wet-bulb globe temperature, published in 1957; controlling training by WBGT sharply reduced heat illness. ISO 7243 standardised the index (first in 1982, revised in 1989 and 2017).',
  sources: [
    'ISO 7243, *Ergonomics of the thermal environment — Assessment of heat stress using the WBGT (wet bulb globe temperature) index*.',
    'ISO 7933, *Ergonomics of the thermal environment — Analytical determination and interpretation of heat stress using calculation of the predicted heat strain*; ISO 9886, *Evaluation of thermal strain by physiological measurements*.',
    'NIOSH, *Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments*, 2016.',
    'US Army, TB MED 507, *Heat Stress Control and Heat Casualty Management*.',
    'C. P. Yaglou and D. Minard, "Control of heat casualties at military training centers", *AMA Archives of Industrial Health*, 1957.'
  ],
  sim: 'en-wbgt'
},

{
  id: 'cold-stress', parent: 'climate-light', title: 'Cold stress', level: 2,
  short: 'Cold cools the whole body (hypothermia below a 35 °C core) and freezes or chills the parts that stick out — fingers, toes, ears, face. Long before injury it takes away dexterity, grip and feeling. Wind chill (the 2001 North American index) says how fast exposed skin cools; ISO 11079 gives the clothing insulation needed; gloves, warm-up breaks and controls sized for gloved hands keep people working.',
  keywords: ['cold stress', 'wind chill', 'hypothermia', 'frostbite', 'non-freezing cold injury', 'trench foot', 'IREQ', 'ISO 11079', 'clothing insulation', 'clo', 'dexterity', 'gloves', 'mittens', 'cold store', 'work–warm-up', 'contact cold', 'ACGIH'],
  prereq: ['thermal-comfort', 'medicine:thermoregulation', 'clothing-ppe-allowances'],
  related: ['heat-stress', 'extreme-environments', 'hand-arm-vibration', 'personal-equipment-fit', 'ppe-ergonomics', 'controls-design', 'agriculture-ergonomics', 'construction-ergonomics', 'medicine:heat-cold'],
  body: `
Cold works on the body in two ways. **Whole-body cooling** lowers the core temperature: first shivering and clumsiness, then, below about 35 °C, **hypothermia** — confusion, drowsiness and in the end collapse. **Local cooling** attacks the parts that stick out — fingers, toes, ears, nose, cheeks — where blood flow is cut to save heat: **frostbite** when tissue freezes, and **non-freezing cold injury** ("trench foot") when feet stay cold and wet for many hours a little above freezing. Long before any injury, cold hands lose **dexterity, grip and feeling**, and bulky clothing restricts movement: in cold work the first casualty is usually the quality of the job, the second an accident.

### Wind chill: how fast exposed skin cools
Wind strips the warm layer of air from exposed skin. The **wind chill index** used in Canada and the US since 2001 gives the calm-air temperature that would cool a face as fast, from the air temperature $T_a$ (°C) and the wind speed $V$ (km/h, at 10 m), raised to the small [[?exponent|power]] 0.16 because doubling a strong wind adds less chill than doubling a light one:

$$T_{wc} = 13.12 + 0.6215\\,T_a - 11.37\\,V^{0.16} + 0.3965\\,T_a V^{0.16}$$

| Wind chill | Risk to exposed skin (Environment Canada guidance) |
|---|---|
| 0 to −9 | low |
| −10 to −27 | moderate: uncomfortable; cover up, risk of hypothermia over long exposure |
| −28 to −39 | high: skin can freeze in 10–30 minutes |
| −40 to −47 | very high: skin can freeze in 5–10 minutes |
| −48 to −54 | severe: skin can freeze in 2–5 minutes |
| −55 and below | extreme: skin can freeze in under 2 minutes |

Wind chill describes skin, not objects: a pipe or an engine cools faster in wind but never below the air temperature. Wet skin, and skin touching cold metal or fuel, freeze much sooner — fuel evaporating from skin at −30 °C can freeze it at once.

### The whole body: clothing and activity
Heat leaves through the clothing at a rate set by the difference between skin and air temperature and by the total insulation, $H = (t_{sk} - t_a)/I_T$. ISO 11079 turns this balance into the **required clothing insulation** (IREQ): the clo needed to stay in balance for an activity and a climate. Rough values from a simplified version of that balance, for a light wind:

| Air temperature | Walking or light work (about 2 met) | Standing still (about 1.2 met) |
|---|---|---|
| +10 °C | about 1.3 clo: work clothes and a jacket | about 3 clo |
| 0 °C | about 2 clo: insulated jacket and trousers | about 4.5 clo |
| −10 °C | about 3 clo: full winter clothing | about 6 clo — no practical clothing |
| −20 °C | about 4 clo: arctic clothing | not achievable: limit the time |

Activity dominates: the same clothing that is too warm on the move leaves a sentry, a flagger, a crane driver or a surveyor cold within the hour. Where clothing cannot be enough, ISO 11079 gives a **duration-limited exposure**, and the ACGIH work–warm-up schedule shortens work periods as temperature and wind fall, stopping non-emergency work in the most severe conditions. Wind pumps air through clothing, and sweat or rain can halve its insulation: layers that open and come off, a windproof shell and dry inner layers matter as much as the total clo.

### The hands
Manual dexterity starts to fall when finger skin cools below about 15 °C, and touch is largely lost below about 8 °C (Heus, Daanen and Havenith, 1995). Gloves protect but take dexterity and strength with them. ACGIH guidance, in outline:
- **Fine work with bare hands** for more than 10–20 minutes below about 16 °C: provide hand warming — warm air jets, radiant heaters, warm breaks.
- **Gloves** below about 16 °C for sedentary work, 4 °C for light work and −7 °C for moderate work; **mittens** below about −17 °C.
- **Metal handles and control bars** covered with insulating material below about −1 °C (see ISO 13732-3 on touching cold surfaces).

Design follows: controls, handles, latches and touchscreens sized and spaced for gloved or mittened hands (MIL-STD-1472 gives allowances), tools with insulated grips, and tasks that need fine work moved into warm spaces.

### Settings
- **Workshop and industry**: freezer stores near −25 °C and chilled food rooms at 0–10 °C, where people stand still for hours; unheated warehouses and draughty loading docks.
- **Field**: construction, utilities, agriculture, forestry and fishing in winter — wind, wet and work at height; warm shelters and rotation.
- **Military**: sweating on the march then chilling at rest; wet feet and non-freezing cold injury; sentries and vehicle crews sitting still; handling metal and fuel; layered clothing systems and warming tents (see [[extreme-environments]]).
- **Vehicles and offices**: heaters and cabs are the refuge; indoors, cold draughts and floors are a comfort problem ([[thermal-comfort]]).

In the simulation, set the air temperature, the wind, the activity and the clothing worn. The figure shows the wind on the person, the wind chill and how fast exposed skin could freeze, the clothing needed against the clothing worn, and the guidance for hands.

> [!warn] Shivering that stops, confusion, slurred speech or drowsiness in the cold are signs of hypothermia; white, waxy, numb patches of skin are frostbite. Call your local emergency number, get the person into shelter and warm them gently; do not rub frozen skin. This page explains cold stress for design and planning; it is not medical advice.

> [!key] Wind chill tells how fast exposed skin cools; the clothing needed depends above all on activity. Keep people moving or sheltered, their hands warm and their clothing dry, and design controls and tools for gloved hands.
`,
  ideas: [
    'Cold cools the whole body (hypothermia) and the extremities (frostbite, non-freezing cold injury), and takes away dexterity long before injury.',
    'Wind chill gives how fast exposed skin cools: below about −28 °C skin can freeze within 10–30 minutes.',
    'The clothing needed depends above all on activity: standing still needs about twice the insulation of walking.',
    'Dexterity falls when finger skin cools below about 15 °C; gloves, mittens, insulated handles and warm breaks follow.'
  ],
  pitfalls: [
    'Wind chill makes machines and water colder than the air — It describes heat loss from exposed skin; objects cool faster in wind but not below the air temperature.',
    'One clothing standard suits all cold work — The same clothing is too hot for heavy work and far too cold for someone standing still; layers and activity must match.',
    'Thick gloves solve cold hands at no cost — They reduce dexterity and grip; tasks, controls and tools must be designed for gloved hands or moved somewhere warm.'
  ],
  formulas: [
    {
      name: 'Wind chill index (North America, 2001)',
      expr: 'WC = 13.12 + 0.6215*ta - 11.37*v^0.16 + 0.3965*ta*v^0.16', tex: 'T_{wc} = 13.12 + 0.6215\\,T_a - 11.37\\,V^{0.16} + 0.3965\\,T_a V^{0.16}',
      vars: {
        WC: { name: 'wind chill (°C equivalent)', q: false, unit: '°C', signed: true, tex: 'T_{wc}' },
        ta: { name: 'air temperature (in °C, at or below about 10)', q: false, unit: '°C', value: -10, signed: true, min: -50, max: 10, tex: 'T_a' },
        v: { name: 'wind speed at 10 m (in km/h, at least 5)', q: false, unit: 'km/h', value: 30, min: 5, max: 100, tex: 'V' }
      },
      note: 'Wind speed as reported by weather services, at 10 m height; at face height it is about two-thirds of that.',
      stories: { WC: 'The air is {ta} with a wind of {v}. What is the wind chill?', v: 'The air is {ta}. What wind speed gives a wind chill of {WC}?' }
    },
    {
      name: 'Total insulation needed for a given heat loss',
      expr: 'IT = (tsk - ta)/(0.155*H)', tex: 'I_T = \\dfrac{t_{sk} - t_a}{0.155\\,H}',
      vars: {
        IT: { name: 'total insulation, clothing plus surface air layer (in clo)', q: false, unit: 'clo', tex: 'I_T' },
        tsk: { name: 'mean skin temperature (in °C; about 32–34 for comfort)', q: false, unit: '°C', value: 32, tex: 't_{sk}' },
        ta: { name: 'air temperature (in °C)', q: false, unit: '°C', value: -10, signed: true, tex: 't_a' },
        H: { name: 'dry heat loss through the clothing (in W/m²)', q: false, unit: 'W/m²', value: 80 }
      },
      note: 'The heat balance behind IREQ (ISO 11079): H is the metabolic heat less what the breath and skin moisture carry away. 1 clo = 0.155 m²·K/W.',
      stories: { IT: 'The skin is at {tsk}, the air at {ta}, and the body can spare {H} through its clothing. What total insulation is needed?', H: 'Clothing and air layer give {IT}; skin {tsk}, air {ta}. How much heat is lost per m²?' }
    }
  ],
  examples: [
    {
      title: 'Two winter days',
      q: 'Find the wind chill for −10 °C with a 30 km/h wind, and for −20 °C with a 40 km/h wind, and the risk to exposed skin.',
      steps: [
        '$30^{0.16} = 1.723$: $T_{wc} = 13.12 - 6.22 - 19.59 - 6.83 = -19.5$ °C — moderate: cover up.',
        '$40^{0.16} = 1.804$: $T_{wc} = 13.12 - 12.43 - 20.52 - 14.31 = -34.1$ °C — high: exposed skin can freeze in 10–30 minutes.'
      ],
      a: 'About −19.5 °C (moderate) and −34 °C (high risk): cover the face, watch each other for white patches, and shorten exposures.'
    },
    {
      title: 'The walker and the sentry',
      q: 'At −10 °C, a walking worker makes about 116 W/m² and can lose about 83 W/m² through the clothing with a skin temperature of 32.4 °C; a sentry standing still makes about 70 W/m² and can lose about 43 W/m² with the skin at 33.7 °C. What total insulation does each need?',
      steps: [
        'Walker: $I_T = (32.4 + 10)/(0.155\\times83) = 3.3$ clo, of which about 0.5 clo is the air layer: roughly 3 clo of clothing.',
        'Sentry: $I_T = (33.7 + 10)/(0.155\\times43) = 6.6$ clo — about 6 clo of clothing, more than any practical outfit.'
      ],
      a: 'About 3 clo for the walker and 6.6 clo for the sentry: the sentry needs a warm shelter, short shifts and rotation.'
    }
  ],
  quiz: [
    { q: 'At −20 °C with a 40 km/h wind the wind chill is about −34. What does that mean?', choices: ['Exposed skin can freeze within about 10–30 minutes', 'Water freezes faster than at −34 °C in calm air', 'Engines cool to −34 °C', 'Nothing: wind chill is only a feeling'], a: 0, why: 'Wind chill expresses the cooling of exposed skin; −28 to −39 is the high-risk band.' },
    { q: 'Wind chill can cool a parked vehicle\'s engine below the air temperature.', a: false, why: 'Objects cool faster in wind but only to the air temperature; wind chill is about heat loss from skin.' },
    { q: 'Why do sentries and crane drivers get colder than people walking in the same clothing?', choices: ['They make much less metabolic heat', 'They are exposed to more wind', 'Their clothing is thinner by definition', 'They sweat more'], a: 0, why: 'Standing still roughly halves heat production, so about twice the insulation is needed for balance.' },
    { q: 'What is the wind chill at −5 °C with a 20 km/h wind?', answer: -11.6, unit: '°C', why: '20^0.16 = 1.615: 13.12 − 3.11 − 18.36 − 3.20 = −11.6 °C.' },
    { q: 'Below about which air temperature does ACGIH advise covering metal handles and control bars with insulation?', choices: ['About −1 °C', 'About +16 °C', 'About −30 °C', 'Never'], a: 0, why: 'Bare skin on cold metal loses heat very fast and can freeze to it.' }
  ],
  problems: [
    { q: 'The skin is at 33 °C, the air at 0 °C, and the body can lose 80 W/m² through its clothing. What total insulation is needed?', answer: 2.66, unit: 'clo', tol: 0.01, steps: ['$I_T = (33 - 0)/(0.155\\times80) = 33/12.4 = 2.66$ clo.'] },
    { q: 'What is the wind chill at −15 °C with a 25 km/h wind?', answer: -25.2, unit: '°C', tol: 0.01, steps: ['$25^{0.16} = 1.674$.', '$T_{wc} = 13.12 - 9.32 - 19.03 - 9.95 = -25.2$ °C.'] }
  ],
  ranges: [
    { dim: 'Wind chill for work with the face and hands exposed', range: [-27, null], unit: '°C', who: 'outdoor workers, soldiers, fishers, anyone who cannot cover every patch of skin', why: 'Above about −27 °C exposed dry skin is at low risk of freezing.', limits: 'Below −28 °C skin can freeze within 10–30 minutes, below −40 °C within 5–10; wet skin, metal and fuel freeze it sooner.', setting: ['field', 'military', 'workshop'], src: 'Environment and Climate Change Canada wind chill guidance' },
    { dim: 'Core body temperature during cold work', range: [36, null], unit: '°C', who: 'every worker in cold', why: 'Keeps a margin from the confusion and clumsiness that precede hypothermia (below 35 °C).', limits: 'Rarely measured on site: shivering and clumsiness are the practical warning signs.', setting: ['field', 'military', 'workshop'], src: 'ACGIH TLV for cold stress' },
    { dim: 'Finger skin temperature for good manual dexterity', range: [15, null], unit: '°C', who: 'people doing manual and fine work in the cold', why: 'Dexterity starts to fall below about 15 °C; touch is largely lost below about 8 °C.', limits: 'Individuals differ; vibration and wet hands cool fingers faster; gloves that keep fingers warm cost dexterity themselves.', setting: ['field', 'military', 'workshop'], src: 'Heus, Daanen and Havenith, Applied Ergonomics, 1995' },
    { dim: 'Air temperature below which fine bare-hand work (over 10–20 min) needs hand warming', range: [null, 16], unit: '°C', who: 'people assembling, writing, repairing with bare hands', why: 'Warm hands keep their dexterity and feeling.', limits: 'Warm air jets and radiant heaters must not create draughts elsewhere.', setting: ['workshop', 'field', 'military'], src: 'ACGIH TLV for cold stress' },
    { dim: 'Gloves for light work needed below / mittens below', range: 'about 4 °C / about −17 °C', unit: '°C', who: 'people working with their hands outdoors or in cold rooms', why: 'Protect the fingers from cooling and cold injury.', limits: 'Each step costs dexterity and grip: design controls, fasteners and tools for gloved hands.', setting: ['field', 'military', 'workshop'], src: 'ACGIH TLV for cold stress' },
    { dim: 'Air temperature below which metal handles and control bars are insulated', range: [null, -1], unit: '°C', who: 'operators and tool users', why: 'Prevents rapid cooling and freezing of skin on contact.', limits: 'Insulated grips must still give a secure hold with gloves.', setting: ['workshop', 'field', 'military', 'vehicle'], src: 'ACGIH TLV for cold stress; ISO 13732-3' },
    { dim: 'Clothing insulation for light work at −10 °C (rough estimate)', range: [2.5, 3], unit: 'clo', who: 'people walking or working lightly in a light wind', why: 'Balances body heat loss without sweating.', limits: 'Standing still needs about twice as much; wind and wet reduce what clothing gives; use ISO 11079 for real assessments.', setting: ['field', 'military', 'workshop'], src: 'Simplified heat balance in the manner of ISO 11079 (IREQ)' }
  ],
  applications: [
    'Choosing layered clothing for the activity and the climate, and planning warm-up breaks: see [the cold and wind calculator](#/tools/environment/cold).',
    'Warm shelters, heated cabs and rotation for sentries, flaggers, crane drivers and cold-store staff.',
    'Controls, handles and touchscreens sized for gloved hands; insulated handles on tools used below freezing.',
    'A buddy system in wind: watching each other\'s faces for the white patches of frostbite.'
  ],
  history: 'Paul Siple and Charles Passel measured how fast water froze in plastic cylinders in the Antarctic wind and published the first wind chill index in 1945. It overstated the chill; in 2001 scientists in Canada and the US replaced it with the present formula, based on heat loss from a human face and tested on volunteers in a chilled wind tunnel.',
  sources: [
    'ISO 11079, *Ergonomics of the thermal environment — Determination and interpretation of cold stress when using required clothing insulation (IREQ) and local cooling effects*.',
    'ISO 15743, *Ergonomics of the thermal environment — Cold workplaces — Risk assessment and management*; ISO 13732-3 (contact with cold surfaces).',
    'ACGIH, TLV for cold stress (with the work–warm-up schedule).',
    'Environment and Climate Change Canada, the wind chill index (the 2001 North American formula) and its frostbite guidance.',
    'R. Heus, H. A. M. Daanen and G. Havenith, "Physiological criteria for functioning of hands in the cold", *Applied Ergonomics*, 1995.',
    'MIL-STD-1472, *Human Engineering* (allowances for gloved and mittened hands).'
  ],
  sim: 'en-cold'
},

{
  id: 'lighting-levels', parent: 'climate-light', title: 'How much light', level: 1,
  short: 'Each task needs its level of light on the work: about 100 lx for corridors, 300 lx for rough work, 500 lx for offices and bench work, 750–1500 lx for fine and precision work (EN 12464-1), with good uniformity, more for older eyes and critical tasks, and daylight and darkness at the right times for the body clock.',
  keywords: ['lighting', 'illuminance', 'lux', 'luminance', 'EN 12464-1', 'maintained illuminance', 'uniformity', 'lumen method', 'utilisation factor', 'maintenance factor', 'task lighting', 'older workers', 'daylight', 'circadian', 'melanopic', 'emergency lighting', 'inverse square law'],
  prereq: ['physics:light-intensity', 'physics:the-eye', 'visual-ergonomics'],
  related: ['glare-colour', 'standing-work-heights', 'control-rooms', 'age-children-elderly', 'laboratory-ergonomics', 'office-layout', 'shift-work', 'medicine:vision', 'medicine:sleep'],
  body: `
The eye works over a range of about a billion to one, from starlight to snow in sunshine, but it works *well* — quickly, accurately, without strain — only when there is enough light for the size and contrast of the detail. Ergonomic lighting therefore starts from the task.

### Illuminance and luminance
- **Illuminance** $E$, in lux (lumens per m²), is the light falling on a surface — what a lux meter measures and what standards specify.
- **Luminance** $L$, in cd/m², is the light coming *from* a surface towards the eye — what we see as brightness. For a matte surface $L = \\rho E/\\pi$, with $\\rho$ its reflectance (see [[glare-colour]]).

| Situation (typical, rounded) | Illuminance |
|---|---|
| Full moon | 0.1–0.3 lx |
| Street lighting | 5–30 lx |
| Living room in the evening | 50–200 lx |
| Office desk | 300–750 lx |
| Overcast day outdoors | 1 000–10 000 lx |
| Direct sunlight | about 100 000 lx |

### How much for which task
EN 12464-1 gives the **maintained illuminance** on the task area — the level still there when lamps have aged and luminaires are dirty. Typical values, rounded:

| Task area | Maintained illuminance |
|---|---|
| Corridors and circulation | 100 lx |
| Stairs, storage | 150 lx |
| Canteens, rest rooms | 200 lx |
| Rough assembly, loading bays | 300 lx |
| Reading, writing and screen work; medium bench work | 500 lx |
| Technical drawing, fine assembly | 750 lx |
| Precision assembly, inspection | 1 000 lx |
| Very fine work: electronics, watchmaking | 1 500 lx |

The **immediate surroundings** may be one step lower (300 lx around a 500 lx task), and the **uniformity** on the task — minimum over average, $U_0$ — should typically be at least 0.4–0.7, so that the eyes are not forever re-adapting. The standard also asks for light on walls and ceilings and, in its recent edition, on faces, so that rooms do not feel gloomy and people can read each other's expressions.

### Why more light helps — up to a point
Visual performance rises with light and contrast and then levels off: going from 50 to 100 lx helps a great deal, from 1 000 to 2 000 lx very little. Small details, low contrast, moving objects and short viewing times need more. So do **older eyes**: the pupil shrinks and the lens yellows and scatters with age, and at 60 the retina receives only about a third of the light it did at 20. EN 12464-1 lets the designer raise the level one step (500 → 750 lx) where the task is critical, visual capacity is below normal or errors are costly — and lower it where details are large or the task is short.

More is not always better: beyond the need it brings glare, reflections on screens, heat and energy use. A good adjustable **task light** gives the fine-work level where it is needed without flooding the room.

### Calculating it
For a room, the **lumen method** gives the average maintained illuminance from $N$ luminaires of flux $\\Phi$, a utilisation factor UF (the share of the light reaching the working plane, typically 0.4–0.7) and a maintenance factor MF (ageing and dirt, typically 0.7–0.9):

$$E = \\frac{N\\,\\Phi\\,\\mathrm{UF}\\,\\mathrm{MF}}{A}$$

For a single lamp, the inverse-square and cosine laws give the illuminance at a point a distance $d$ away, the light arriving at an angle $\\theta$ to the surface's normal: $E = I\\cos\\theta/d^2$ (see [[physics:light-intensity]]; the [[?sine-cosine|cosine]] spreads a slanting beam over more area). On a desk a height $h$ below the lamp, $E = I\\cos^3\\theta/h^2$: a task lamp giving 2 800 lx straight below it at 0.6 m gives only about 1 800 lx 30° to the side.

### Daylight, the body clock and night
Daylight is the light people prefer: views out and daylight on the work go with better well-being, and EN 17037 sets targets for daylight in buildings. Light also sets the **body clock**, through light-sensitive cells in the eye that respond mostly to blue-green light. A 2022 consensus (Brown and colleagues) recommends a melanopic equivalent daylight illuminance of at least 250 lx at the eye during the day, at most 10 lx in the three hours before sleep and at most 1 lx during sleep. Night shifts face a dilemma — bright light keeps people alert but shifts the clock (see [[shift-work]]).

Emergency escape lighting (EN 1838) must give at least 1 lx along the centre line of escape routes, 0.5 lx in open areas, and in high-risk task areas 10 % of the normal level (at least 15 lx), so that a machine can be stopped safely when the power fails.

### Settings
| Setting | Typical need | Watch for |
|---|---|---|
| Office | 500 lx on the desk, light walls and ceiling, daylight | reflections and glare on screens ([[glare-colour]]); older workers |
| Workshop | 300–1 000 lx by task; task lights at benches and machines | shadows cast by the worker and the machine; flicker that makes rotating parts look still (the stroboscopic effect) |
| Military | dimmable, night-vision-compatible lighting in vehicles, cockpits and command posts; dim red light to keep dark adaptation | display glare at night; sudden bright light destroying dark adaptation |
| Field | lighting towers, head torches, vehicle lights; EN 12464-2 for outdoor workplaces | glare for drivers and co-workers, deep shadows, low sun |
| Home, schools, health care | 300–500 lx for reading and study; more for examinations and older people | glare from bare lamps; night lighting that does not fully wake people |

In the simulation, a row of luminaires lights a room seen from the side. Change their number, height and output, the maintenance factor, the task and the age of the worker, and watch the illuminance across the working plane against the requirement — the dips between luminaires, the uniformity, and the extra light older eyes need. [The lighting calculator](#/tools/environment/light) sizes a room.

> [!key] Light the task to its need — about 100 lx for corridors, 300 for rough work, 500 for offices and bench work, 750–1 500 for fine and precision work — more for older eyes and critical tasks, always with good uniformity and without glare.
`,
  ideas: [
    'Illuminance (lux) is light falling on a surface; luminance (cd/m²) is light coming from it — what the eye sees.',
    'EN 12464-1 sets maintained illuminance by task: about 100 lx corridors, 300 rough work, 500 offices and bench work, 750–1500 fine work.',
    'Visual performance levels off with more light; small, low-contrast details and older eyes need more.',
    'The lumen method E = NΦ·UF·MF/A sizes general lighting; E = I cos θ / d² gives the light from one lamp.',
    'Light also sets the body clock: bright days, dim evenings, dark nights.'
  ],
  pitfalls: [
    'More light is always better — Beyond the task\'s need it adds glare, screen reflections, heat and energy use; quality (uniformity, glare, colour) matters as much as quantity.',
    'The lux on the day of installation is what people get — Lamps age and luminaires get dirty; standards specify maintained illuminance, which is why the maintenance factor exists.',
    'Everyone needs the same light — A 60-year-old\'s retina receives about a third of the light of a 20-year-old\'s; older workers and critical tasks need a step more.'
  ],
  formulas: [
    {
      name: 'Lumen method (average maintained illuminance)',
      expr: 'E = N*Phi*UF*MF/A', tex: 'E = \\dfrac{N\\,\\Phi\\,\\mathrm{UF}\\,\\mathrm{MF}}{A}',
      vars: {
        E: { name: 'average maintained illuminance', q: 'illuminance', unit: 'lx' },
        N: { name: 'number of luminaires', q: 'count', value: 12, int: true, min: 1 },
        Phi: { name: 'luminous flux of one luminaire', q: 'luminousflux', unit: 'lm', value: 4000, tex: '\\Phi' },
        UF: { name: 'utilisation factor (share reaching the working plane)', value: 0.6, min: 0.1, max: 1, tex: '\\mathrm{UF}' },
        MF: { name: 'maintenance factor (ageing and dirt)', value: 0.8, min: 0.3, max: 1, tex: '\\mathrm{MF}' },
        A: { name: 'area of the working plane', q: 'area', unit: 'm²', value: 48 }
      },
      stories: { E: '{N} luminaires of {Phi} light a room of {A}, with UF {UF} and MF {MF}. What average illuminance do they maintain?', N: 'A room of {A} needs {E}. How many luminaires of {Phi} (UF {UF}, MF {MF})?' }
    },
    {
      name: 'Illuminance from a lamp (inverse square and cosine)',
      expr: 'E = I*cos(theta)/d^2', tex: 'E = \\dfrac{I\\cos\\theta}{d^2}',
      vars: {
        E: { name: 'illuminance at the point', q: 'illuminance', unit: 'lx' },
        I: { name: 'luminous intensity towards the point', q: 'luminousint', unit: 'cd', value: 1000 },
        theta: { name: 'angle between the light and the surface\'s normal', q: 'angle', unit: '°', value: 30, min: 0, max: 89, tex: '\\theta' },
        d: { name: 'distance from the lamp', q: 'length', unit: 'm', value: 2 }
      },
      stories: { E: 'A lamp sends {I} towards a point {d} away; the light arrives at {theta} to the surface\'s normal. What is the illuminance?', d: 'A lamp of {I} must give {E} at {theta}. How far away can it be?' }
    },
    {
      name: 'Illuminance on a horizontal task below a lamp',
      expr: 'E = I*cos(theta)^3/h^2', tex: 'E = \\dfrac{I\\cos^3\\theta}{h^2}',
      vars: {
        E: { name: 'illuminance on the task', q: 'illuminance', unit: 'lx' },
        I: { name: 'luminous intensity towards the point', q: 'luminousint', unit: 'cd', value: 1000 },
        theta: { name: 'angle from straight below the lamp', q: 'angle', unit: '°', value: 30, min: 0, max: 85, tex: '\\theta' },
        h: { name: 'height of the lamp above the task', q: 'length', unit: 'm', value: 0.6 }
      },
      note: 'd = h / cos θ and the light arrives at θ to the vertical, so E = I cos³θ / h².',
      stories: { E: 'A task lamp of {I} hangs {h} above a bench. What illuminance falls {theta} off its axis?', h: 'A lamp of {I} must give {E} at {theta} off its axis. How high may it hang?' }
    }
  ],
  examples: [
    {
      title: 'Lighting an office',
      q: 'An office 8 m × 6 m needs 500 lx maintained. Luminaires give 4000 lm each, with UF 0.6 and MF 0.8. How many are needed, and what power at 120 lm/W?',
      steps: [
        '$N = EA/(\\Phi\\,\\mathrm{UF}\\,\\mathrm{MF}) = 500\\times48/(4000\\times0.48) = 12.5$ — round up to 13.',
        '13 luminaires maintain $13\\times1920/48 = 520$ lx.',
        'Power: $13\\times4000/120 = 433$ W, about 9 W/m².'
      ],
      a: '13 luminaires, about 520 lx and 430 W.'
    },
    {
      title: 'A task lamp',
      q: 'A task lamp of 1000 cd hangs 0.6 m above a bench. What illuminance falls directly beneath it and 30° to the side?',
      steps: [
        'Beneath: $E = 1000/0.6^2 = 2778$ lx.',
        'At 30°: $E = 1000\\cos^3 30°/0.36 = 1000\\times0.650/0.36 = 1804$ lx.'
      ],
      a: 'About 2 800 lx beneath and 1 800 lx at 30°: aim the lamp at the work.'
    }
  ],
  quiz: [
    { q: 'Illuminance is measured in…', choices: ['lux: light falling on a surface', 'cd/m²: light leaving a surface', 'lumens per watt', 'kelvin'], a: 0, why: 'Lux (lm/m²) is illuminance; cd/m² is luminance; lm/W is efficacy; kelvin is colour temperature.' },
    { q: 'Going from 1 000 to 2 000 lx greatly improves performance at an ordinary office task.', a: false, why: 'Performance levels off; beyond the need, glare and reflections can make things worse.' },
    { q: 'A room 10 m × 5 m needs 300 lx maintained, with 3000 lm luminaires, UF 0.5 and MF 0.8. How many luminaires are needed (whole number)?', answer: 13, why: 'N = 300 × 50 / (3000 × 0.4) = 12.5, rounded up to 13.' },
    { q: 'Why do older workers need more light?', choices: ['The pupil shrinks and the lens yellows and scatters, so less light reaches the retina', 'They read more', 'Their screens are older', 'They do not: light needs are the same at every age'], a: 0, why: 'At 60 the retina receives only about a third of the light it did at 20.' },
    { q: 'What does the maintenance factor account for?', choices: ['Lamps losing output and luminaires and rooms getting dirty', 'The reflectance of the walls', 'The share of light reaching the desk', 'Flicker'], a: 0, why: 'Standards specify maintained illuminance; the utilisation factor handles the share reaching the working plane.' }
  ],
  problems: [
    { q: 'A lamp of 800 cd hangs 1.5 m directly above the work. What is the illuminance on the work?', answer: 356, unit: 'lx', tol: 0.01, steps: ['$E = I/h^2 = 800/2.25 = 356$ lx.'] },
    { q: 'A store 20 m × 15 m is lit by 8 fittings of 10 000 lm with UF 0.6 and MF 0.8. What average illuminance do they maintain?', answer: 128, unit: 'lx', tol: 0.01, steps: ['$E = 8\\times10\\,000\\times0.48/300 = 128$ lx — short of 150 lx for storage; 10 fittings would give 160 lx.'] }
  ],
  ranges: [
    { dim: 'Maintained illuminance: reading, writing and screen work', range: [500, null], unit: 'lx', who: 'office workers with normal vision; a step more for older eyes', why: 'Print and handwriting are read quickly and without strain.', limits: 'Screens need less ambient light than paper, but reflections and glare matter more.', setting: ['office', 'school'], src: 'EN 12464-1' },
    { dim: 'Maintained illuminance: corridors and circulation', range: [100, null], unit: 'lx', who: 'everyone moving through buildings, including older people', why: 'Safe movement, obstacles and steps seen.', limits: 'Stairs and changes of level need more (about 150 lx) and contrasting nosings.', setting: ['civil', 'office', 'workshop', 'health'], src: 'EN 12464-1' },
    { dim: 'Maintained illuminance: rough assembly, loading bays', range: [300, null], unit: 'lx', who: 'workers handling large parts and goods', why: 'Large details and hazards seen clearly.', limits: 'Moving vehicles and mixed tasks may need more; avoid glare towards drivers.', setting: 'workshop', src: 'EN 12464-1' },
    { dim: 'Maintained illuminance: fine to very fine work (technical drawing to electronics)', range: [750, 1500], unit: 'lx', who: 'assemblers, inspectors, draughtspeople, technicians', why: 'Small, low-contrast details seen quickly and reliably.', limits: 'Best given by task lights with good glare control; magnifiers help more than extra lux for the smallest details.', setting: ['workshop', 'health'], src: 'EN 12464-1' },
    { dim: 'Uniformity on the task area (minimum ÷ average)', range: '0.4–0.7 or more', unit: '', who: 'anyone whose eyes move across the work', why: 'Avoids constant re-adaptation and dark spots.', limits: 'Required values depend on the task; general lighting spaced too widely fails it.', setting: ['office', 'workshop', 'school'], src: 'EN 12464-1' },
    { dim: 'Extra light for older workers and critical tasks', range: 'one step up (e.g. 500 → 750 lx)', unit: '', who: 'workers over about 50–60; tasks where errors are costly', why: 'Compensates for smaller pupils and yellowing lenses; lowers error rates.', limits: 'More light brings more glare risk, to which older eyes are also more sensitive.', setting: ['office', 'workshop', 'health'], src: 'EN 12464-1 (adjusting the requirement)' },
    { dim: 'Emergency lighting on the centre line of escape routes', range: [1, null], unit: 'lx', who: 'everyone leaving a building in a power failure', why: 'Routes, doors and obstacles can be seen.', limits: 'High-risk task areas need 10 % of normal, at least 15 lx, to make machines safe.', setting: ['civil', 'office', 'workshop', 'health', 'school'], src: 'EN 1838' },
    { dim: 'Melanopic equivalent daylight illuminance at the eye during the day', range: [250, null], unit: 'lx', who: 'day workers, pupils, patients, crews in windowless rooms', why: 'Supports alertness by day and sleep at night.', limits: 'At most 10 lx in the three hours before sleep and 1 lx during sleep; night-shift lighting needs a separate plan.', setting: ['office', 'school', 'health', 'military'], src: 'Brown et al., PLOS Biology, 2022 (consensus recommendation)' }
  ],
  applications: [
    'Sizing general lighting with the lumen method: see [the lighting calculator](#/tools/environment/light).',
    'Adjustable task lights at benches, inspection stations and for older workers.',
    'Night-vision-compatible, dimmable lighting in vehicles, cockpits and command posts.',
    'Emergency escape lighting to EN 1838, and flicker-free drivers near rotating machinery.'
  ],
  history: 'Gas and then electric light made factory night work possible in the 19th century. Research on visual performance — by H. C. Weston in Britain from the 1930s and H. R. Blackwell in the US after the war — showed how speed and accuracy depend on light and contrast, and recommended levels rose as light became cheaper. European values are now set by EN 12464-1, first published in 2002.',
  sources: [
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places*.',
    'EN 12464-2, *Light and lighting — Lighting of work places — Part 2: Outdoor work places*; EN 1838, *Lighting applications — Emergency lighting*; EN 17037, *Daylight in buildings*.',
    'T. M. Brown et al., "Recommendations for daytime, evening, and nighttime indoor light exposure to best support physiology, sleep, and wakefulness in healthy adults", *PLOS Biology*, 2022.',
    'P. R. Boyce, *Human Factors in Lighting*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, the chapter on lighting.'
  ],
  sim: 'en-lux'
},

{
  id: 'glare-colour', parent: 'climate-light', title: 'Glare, contrast and colour', level: 2,
  short: 'Good lighting puts the brightness on the task and not in the eyes. Disability glare veils what we see; discomfort glare tires and distracts and is rated by the UGR (at most 19 in offices); reflections wash out screens. Contrast, balanced room brightness, faithful colour rendering (Ra ≥ 80, ≥ 90 for colour work) and designs that never rely on colour alone complete the picture.',
  keywords: ['glare', 'disability glare', 'discomfort glare', 'UGR', 'unified glare rating', 'veiling reflections', 'contrast', 'contrast ratio', 'luminance', 'reflectance', 'colour rendering index', 'Ra', 'colour temperature', 'CCT', 'colour vision deficiency', 'safety colours', 'screen reflections', 'WCAG'],
  prereq: ['lighting-levels', 'physics:color-vision', 'visual-ergonomics'],
  related: ['monitor-placement', 'displays-design', 'information-design', 'alarms-warnings', 'control-rooms', 'cockpit-ergonomics', 'age-children-elderly', 'hmi-screens', 'medicine:vision'],
  body: `
Enough light is only half of good lighting. The other half is where the brightness is: on the task, not in the eyes; spread evenly, not in harsh patches; and of a colour that shows things as they are.

### Two kinds of glare
**Disability glare** reduces what can be seen. Light from a bright source near the line of sight scatters inside the eye and lays a veil of luminance over the retina, washing out contrast — oncoming headlights at night, a low sun, a bare lamp beside a monitor. The veil is roughly $L_v \\approx 10\\,E_{gl}/\\theta^2$ (Stiles and Holladay), with $E_{gl}$ the illuminance the glare source makes at the eye and $\\theta$ its angle from the line of sight in degrees: halve the angle and the veil is four times stronger. It grows with age, because older lenses scatter more.

**Discomfort glare** need not reduce vision, but it annoys, tires and distracts — bright luminaires in view, a window behind a screen. Indoors it is rated by the **unified glare rating** (UGR, CIE 117):

$$\\mathrm{UGR} = 8\\log_{10}\\left(\\frac{0.25}{L_b}\\sum\\frac{L^2\\,\\omega}{p^2}\\right)$$

summing over the luminaires in view: $L$ is a luminaire's luminance, $\\omega$ the [[?solid-angle|solid angle]] it fills, $p$ the Guth position index (large for sources far from the line of sight, which count less) and $L_b$ the background luminance. UGR moves in steps of 3, about the smallest difference people notice. Halving the luminance of every luminaire lowers it by $8\\log_{10}4 = 4.8$.

| Task (typical limits in EN 12464-1) | UGR at most |
|---|---|
| Technical drawing | 16 |
| Offices: reading, writing, screen work | 19 |
| Fine industrial work, laboratories | 19–22 |
| Rough industrial work, workshops | 25 |
| Corridors | 28 |

**Reflected glare** and **veiling reflections** come back off glossy paper, screens and polished metal: a bright window mirrored in a display, a luminaire in a glossy page. Matte surfaces, screens at right angles to windows (the sight line parallel to the window wall), luminaires to the side rather than in front of or behind the user, and low-luminance luminaires in rooms with screens prevent them; EN 12464-1 limits the luminance of luminaires that can be reflected in screens.

### Contrast and balance
Seeing depends on **contrast**, not on light alone. For dark print on a light page the contrast is $C = (L_b - L_t)/L_b$. For a screen, the contrast ratio is white over black — and any reflected light $L_r$ adds to both:

$$\\mathrm{CR} = \\frac{L_{white} + L_r}{L_{black} + L_r}$$

A screen of 250 cd/m² white and 0.5 cd/m² black has a ratio of 500:1 in the dark; reflecting a bright window (say 120 cd/m² reflected) it falls to about 3:1. Accessibility guidance asks for at least 4.5:1 between text and its background (WCAG 2), and more helps small text and older readers.

The eye also dislikes large jumps of brightness across the field of view, because it must re-adapt at each glance. Traditional guidance keeps the task no more than about 3 times brighter than its immediate surroundings and 10 times brighter than the more distant ones. The room's **reflectances** make that possible: EN 12464-1 recommends about 0.7–0.9 for ceilings, 0.5–0.8 for walls, 0.2–0.6 for work surfaces and 0.2–0.4 for floors — light ceilings and walls, and a desk that is not white. A matte surface of reflectance $\\rho$ lit to $E$ has luminance $L = \\rho E/\\pi$.

### Colour
- **Colour temperature** (CCT) describes the tint of white light: warm below about 3 300 K, intermediate 3 300–5 300 K, cool above 5 300 K. Warm light suits homes and rest areas, intermediate most workplaces; preferences vary with the light level and the climate.
- **Colour rendering**: the CIE colour rendering index $R_a$ (up to 100) says how faithfully colours look compared with a reference light. EN 12464-1 asks for $R_a$ ≥ 80 in most indoor workplaces and ≥ 90 where colour judgement matters — colour matching, printing, textiles, medical examination — and accepts lower values only in some rough industrial and outdoor areas. Poor rendering makes skin look grey, wire colours hard to tell apart and food unappetising.
- **Colour vision deficiency**: about 8 % of men and 0.5 % of women of northern European ancestry have red–green deficiency. Never let colour be the only code: add shape, position, text or pattern — especially for alarms, cables, charts and status lights (see [[information-design]]). Safety colours follow ISO 3864-1 and ISO 7010 — red for prohibition and fire equipment, yellow for warning, blue for mandatory actions, green for safe conditions — always with a symbol.

### Settings
| Setting | Main glare and colour problems | What helps |
|---|---|---|
| Office | windows and luminaires reflected in screens; bright windows behind screens | screens at right angles to windows, blinds, low-luminance luminaires, matte screens |
| Workshop | bare lamps in view at machines; reflections from polished metal; flicker making rotating parts look still | shielded luminaires, task lights from the side, grazing light for surface inspection, flicker-free drivers |
| Vehicles and military | low sun, oncoming headlights, bright displays at night; instruments read in sunlight and at night | visors, anti-reflective coatings, dimmable and night-vision-compatible displays, dim red light to keep dark adaptation |
| Field | snow and water glare; welding arcs | sunglasses or goggles (snow blindness is an ultraviolet burn of the cornea); welding filters |
| Health care, schools, homes | bare lamps seen by patients lying on their backs; glossy boards | indirect light, matte finishes, light that renders skin truly |

In the simulation, a person reads a screen with a window and a luminaire nearby. Move the window round the room, change the screen's finish and brightness, the room light and the luminaire's angle from the line of sight, and watch the text fade as reflections and veiling glare rise; the readings give the contrast ratio and the veiling luminance.

> [!key] Put the brightness on the task, not in the eyes: keep bright sources out of the line of sight and out of reflections (UGR ≤ 19 in offices), balance the room with light ceilings and walls, render colours faithfully (Ra ≥ 80, ≥ 90 for colour work), and never rely on colour alone.
`,
  ideas: [
    'Disability glare veils the retina and reduces what can be seen; discomfort glare annoys and tires and is rated by the UGR.',
    'Reflections add luminance to both the text and the background of a screen and can reduce its contrast from hundreds to one to a few to one.',
    'Balanced room brightness needs light ceilings and walls and a task no more than about 3 times brighter than its surroundings.',
    'Colour rendering (Ra ≥ 80, ≥ 90 for colour work) and colour-blind-safe coding (never colour alone) are part of ergonomic lighting.'
  ],
  pitfalls: [
    'Brighter screens and lamps cure glare — Glare comes from brightness in the wrong place; turning everything up often makes it worse.',
    'A bright window behind the screen gives the user nice daylight — It puts a large bright source in the line of sight; set screens at right angles to windows.',
    'Red and green indicators are clear to everyone — About one man in twelve has red–green colour deficiency; add shape, text or position.'
  ],
  formulas: [
    {
      name: 'Unified glare rating from one luminaire',
      expr: 'UGR = 8*log(0.25/Lb*L^2*w/p^2)', tex: '\\mathrm{UGR} = 8\\log_{10}\\left(\\dfrac{0.25}{L_b}\\,\\dfrac{L^2\\,\\omega}{p^2}\\right)',
      vars: {
        UGR: { name: 'unified glare rating', tex: '\\mathrm{UGR}' },
        Lb: { name: 'background luminance (in cd/m²)', q: false, unit: 'cd/m²', value: 40, tex: 'L_b' },
        L: { name: 'luminance of the luminaire seen by the eye (in cd/m²)', q: false, unit: 'cd/m²', value: 5000 },
        w: { name: 'solid angle of the luminaire at the eye', q: 'solidangle', unit: 'sr', value: 0.01, tex: '\\omega' },
        p: { name: 'Guth position index (1 on the line of sight, larger away from it)', value: 2, min: 1, max: 20 }
      },
      note: 'With several luminaires the terms L²ω/p² are summed inside the logarithm.',
      stories: { UGR: 'A luminaire of {L} fills {w} at the eye, with a position index of {p}, against a background of {Lb}. What is the UGR?', L: 'The UGR must not exceed {UGR}. With ω = {w}, p = {p} and a background of {Lb}, how bright may the luminaire look?' }
    },
    {
      name: 'Luminance of a matte surface',
      expr: 'L = rho*E/pi', tex: 'L = \\dfrac{\\rho\\,E}{\\pi}',
      vars: {
        L: { name: 'luminance', q: false, unit: 'cd/m²' },
        rho: { name: 'reflectance', value: 0.8, min: 0, max: 1, tex: '\\rho' },
        E: { name: 'illuminance on the surface', q: 'illuminance', unit: 'lx', value: 500 }
      },
      stories: { L: 'A white wall of reflectance {rho} receives {E}. What is its luminance?', rho: 'A surface lit to {E} has a luminance of {L}. What is its reflectance?' }
    },
    {
      name: 'Contrast ratio of a screen with reflections',
      expr: 'CR = (Lw + Lr)/(Lk + Lr)', tex: '\\mathrm{CR} = \\dfrac{L_{white} + L_r}{L_{black} + L_r}',
      vars: {
        CR: { name: 'contrast ratio (white ÷ black)', tex: '\\mathrm{CR}' },
        Lw: { name: 'luminance of white on the screen', q: false, unit: 'cd/m²', value: 250, tex: 'L_{white}' },
        Lk: { name: 'luminance of black on the screen', q: false, unit: 'cd/m²', value: 0.5, tex: 'L_{black}' },
        Lr: { name: 'luminance reflected by the screen', q: false, unit: 'cd/m²', value: 5, tex: 'L_r' }
      },
      stories: { CR: 'A screen shows white at {Lw} and black at {Lk}, and reflects {Lr} from the room. What contrast ratio does the user see?', Lr: 'A screen of white {Lw} and black {Lk} must keep a ratio of {CR}. How much reflected luminance can it tolerate?' }
    },
    {
      name: 'Veiling luminance of disability glare (Stiles–Holladay)',
      expr: 'Lv = 10*E/theta^2', tex: 'L_v = \\dfrac{10\\,E_{gl}}{\\theta^2}',
      vars: {
        Lv: { name: 'equivalent veiling luminance', q: false, unit: 'cd/m²', tex: 'L_v' },
        E: { name: 'illuminance from the glare source at the eye (in lx)', q: false, unit: 'lx', value: 1, tex: 'E_{gl}' },
        theta: { name: 'angle of the source from the line of sight (in degrees, about 1–30)', q: false, unit: '°', value: 2, min: 1, max: 30, tex: '\\theta' }
      },
      note: 'For a young eye; the veil grows with age as the lens scatters more.',
      stories: { Lv: 'Oncoming headlights give {E} at the driver\'s eye, {theta} from the line of sight. What veiling luminance do they lay over the road?' }
    }
  ],
  examples: [
    {
      title: 'A screen facing a window',
      q: 'A glossy screen shows white at 250 cd/m² and black at 0.5 cd/m². Facing away from a bright window it reflects about 120 cd/m²; turned at right angles to the window it reflects about 4 cd/m² from the walls. Compare the contrast ratios.',
      steps: [
        'Reflecting the window: $\\mathrm{CR} = (250 + 120)/(0.5 + 120) = 3.1$.',
        'At right angles: $\\mathrm{CR} = (250 + 4)/(0.5 + 4) = 56$.'
      ],
      a: 'About 3:1 against about 56:1 — turning the desk does more than any brightness setting.'
    },
    {
      title: 'Taming a glaring luminaire',
      q: 'A luminaire of luminance 5000 cd/m² fills 0.01 sr at the eye with a position index of 2, against a background of 40 cd/m². What is the UGR, and what if a diffuser halves its luminance?',
      steps: [
        '$\\mathrm{UGR} = 8\\log_{10}(0.25/40\\times5000^2\\times0.01/4) = 8\\log_{10}(391) = 20.7$ — above the office limit of 19.',
        'Halving $L$ divides $L^2$ by 4: $8\\log_{10}(97.7) = 15.9$.'
      ],
      a: 'About 21, falling to about 16 with the diffuser.'
    },
    {
      title: 'Headlights at night',
      q: 'Oncoming headlights give 1 lx at a driver\'s eye, 2° from the line of sight. What veiling luminance do they produce, compared with a lit road of about 1 cd/m²?',
      steps: ['$L_v = 10\\times1/2^2 = 2.5$ cd/m².', 'The veil is brighter than the road itself: a pedestrian\'s contrast against the road drops to a fraction of its value.'],
      a: 'About 2.5 cd/m² — enough to hide a dark-clothed pedestrian.'
    }
  ],
  quiz: [
    { q: 'Which kind of glare reduces what you can see?', choices: ['Disability glare', 'Discomfort glare', 'Colour glare', 'Uniform glare'], a: 0, why: 'Light scattered in the eye veils the retina and lowers contrast; discomfort glare annoys without necessarily reducing vision.' },
    { q: 'Where should a screen be placed relative to a window?', choices: ['At right angles, with the line of sight parallel to the window', 'Facing the window', 'With the window behind it', 'It does not matter with modern screens'], a: 0, why: 'Facing the window, the window is mirrored in the screen; with the window behind the screen, it is a bright source in the line of sight.' },
    { q: 'A screen shows white at 300 cd/m² and black at 0.3 cd/m², and reflects 10 cd/m². What contrast ratio does the user see?', answer: 30.1, why: '(300 + 10)/(0.3 + 10) = 30.1.' },
    { q: 'A red/green status light with no other cue is fine, because almost everyone sees colour normally.', a: false, why: 'About 8 % of men of northern European ancestry have red–green deficiency; add shape, position or text.' },
    { q: 'Why do glare problems grow with age?', choices: ['The ageing lens scatters more light, so the veil is stronger', 'Older people look at brighter screens', 'The pupil grows with age', 'They do not'], a: 0, why: 'Scatter in the lens and cornea increases with age, which strengthens disability glare.' }
  ],
  problems: [
    { q: 'A white wall of reflectance 0.8 receives 300 lx. What is its luminance?', answer: 76.4, unit: 'cd/m²', tol: 0.01, steps: ['$L = \\rho E/\\pi = 0.8\\times300/\\pi = 76.4$ cd/m².'] },
    { q: 'By how much does the UGR fall when the luminance of every luminaire is halved?', answer: 4.8, tol: 0.02, steps: ['Each term has $L^2$, which falls to a quarter.', '$\\Delta\\mathrm{UGR} = 8\\log_{10}4 = 4.8$.'] }
  ],
  ranges: [
    { dim: 'Unified glare rating: offices (reading, writing, screen work)', range: [null, 19], unit: 'UGR', who: 'office workers looking across the room and at screens', why: 'Luminaires in view do not tire or distract.', limits: 'UGR assumes a standard viewpoint and regular layouts; reflections in screens need separate checks.', setting: ['office', 'school'], src: 'EN 12464-1' },
    { dim: 'Unified glare rating: technical drawing', range: [null, 16], unit: 'UGR', who: 'people doing long, demanding visual work', why: 'Minimal discomfort over hours of concentrated looking.', limits: 'Needs well-shielded luminaires or indirect light.', setting: ['office', 'workshop'], src: 'EN 12464-1' },
    { dim: 'Unified glare rating: rough industrial work', range: [null, 25], unit: 'UGR', who: 'workers in workshops and warehouses', why: 'Acceptable for coarse tasks and short glances.', limits: 'Bare high-bay lamps in the line of sight of crane and forklift drivers still dazzle.', setting: 'workshop', src: 'EN 12464-1' },
    { dim: 'Colour rendering index for most indoor work', range: [80, null], unit: 'Ra', who: 'everyone at work indoors', why: 'Colours, skin and materials look natural; wire and label colours can be told apart.', limits: 'Ra averages eight test colours; saturated reds can still look wrong at Ra 80.', setting: ['office', 'workshop', 'school', 'health'], src: 'EN 12464-1; CIE 13.3' },
    { dim: 'Colour rendering where colour judgement matters', range: [90, null], unit: 'Ra', who: 'colour matchers, printers, inspectors, clinicians', why: 'Faithful judgement of colour differences and skin tones.', limits: 'Critical colour work also needs a standard illuminant and neutral surroundings.', setting: ['workshop', 'health'], src: 'EN 12464-1' },
    { dim: 'Reflectance of ceilings / walls / work surfaces', range: '0.7–0.9 / 0.5–0.8 / 0.2–0.6', unit: '', who: 'occupants of any lit room', why: 'Balanced brightness, less glare, more light from the same luminaires.', limits: 'Very light work surfaces cause reflected glare; dark floors and furniture absorb light.', setting: ['office', 'workshop', 'school', 'civil'], src: 'EN 12464-1' },
    { dim: 'Contrast ratio between text and background on screens and signs', range: [4.5, null], unit: ':1', who: 'all readers, including people with low vision and older readers', why: 'Text stays legible in real lighting.', limits: 'Reflections reduce contrast further; small text and critical displays need more.', setting: ['office', 'civil', 'workshop'], src: 'WCAG 2 (level AA)' },
    { dim: 'Luminance ratio of task to immediate surroundings', range: [null, 3], unit: ':1', who: 'people looking back and forth between task and surroundings', why: 'The eyes need not re-adapt at every glance.', limits: 'About 10:1 to the far surroundings; a little variety keeps a room from looking flat.', setting: ['office', 'workshop'], src: 'Traditional lighting guidance (e.g. Kroemer and Grandjean)' }
  ],
  applications: [
    'Placing desks at right angles to windows, with blinds and low-luminance luminaires.',
    'Choosing luminaires by glare rating, colour rendering and flicker, not only by lumens per watt: check a room with [the lighting calculator](#/tools/environment/light).',
    'Colour-safe design of alarms, cables, charts and HMI screens, with shape, text and position as well as colour.',
    'Grazing light for inspecting surface defects; dimmable, night-compatible displays in vehicles and command posts.'
  ],
  history: 'W. S. Stiles and L. L. Holladay described disability glare in the 1920s. The position index was measured by Luckiesh and Guth at General Electric (1949); the CIE drew several national discomfort-glare systems together in the unified glare rating (CIE 117, 1995). The colour rendering index dates from the 1960s (CIE 13).',
  sources: [
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places* (UGR limits, colour rendering, reflectances, luminaires reflected in screens).',
    'CIE 117, *Discomfort glare in interior lighting*, 1995.',
    'CIE 13.3, *Method of measuring and specifying colour rendering properties of light sources*.',
    'ISO 3864-1, *Graphical symbols — Safety colours and safety signs — Part 1: Design principles*; ISO 7010, *Registered safety signs*.',
    'W3C, *Web Content Accessibility Guidelines (WCAG) 2* (contrast ratio).',
    'P. R. Boyce, *Human Factors in Lighting*.'
  ],
  sim: 'en-glare'
},

{
  id: 'indoor-air', parent: 'climate-light', title: 'Indoor air and ventilation', level: 2,
  short: 'Ventilation dilutes what people, buildings and processes add to indoor air. Carbon dioxide from breath is the practical indicator: with about 7–10 L/s of outdoor air per person an office settles near 900–1150 ppm (outdoors about 420). Capture process fumes at the source, keep humidity about 30–60 %, and never burn fuel in an enclosed space.',
  keywords: ['indoor air quality', 'ventilation', 'CO2', 'carbon dioxide', 'ppm', 'outdoor air per person', 'air changes per hour', 'EN 16798-1', 'ASHRAE 62.1', 'humidity', 'local exhaust ventilation', 'LEV', 'carbon monoxide', 'confined spaces', 'oxygen', 'sick building syndrome', 'demand-controlled ventilation'],
  prereq: ['thermal-comfort', 'medicine:environmental-health', 'office-layout'],
  related: ['confined-spaces', 'meeting-classroom', 'control-rooms', 'crew-stations', 'laboratory-ergonomics', 'commercial-kitchens', 'extreme-environments', 'medicine:respiratory-system'],
  body: `
People spend most of their lives indoors, and at work they share the air with each other, with the building's materials and with the process. Ventilation dilutes and removes what they all add: carbon dioxide and moisture from breath, body odours, emissions from furniture, cleaning products and equipment, airborne infections, and the fumes, vapours and dusts of the work itself.

### Carbon dioxide as an indicator
Outdoor air now holds about 420 ppm of CO₂. A sedentary adult breathes out about 0.005 L/s of it (about 18 L an hour, more with activity), so where a steady flow $Q$ of outdoor air per person replaces the room air, the CO₂ settles at

$$C = C_0 + 10^6\\,\\frac{G}{Q}$$

At 10 L/s per person the room reaches about 420 + 500 = 920 ppm; at 5 L/s about 1 420 ppm; at 2.5 L/s about 2 420 ppm. At these levels CO₂ itself is not poisonous — the occupational exposure limit is 5 000 ppm over 8 hours — but it is a reliable **indicator of how much outdoor air each person gets**, and so of everything else people and rooms add to the air. An inexpensive CO₂ monitor in a meeting room or classroom shows at a glance whether the ventilation keeps up.

When people enter a room the level does not jump: it climbs towards its steady value with a time constant $\\tau = V/Q$ (room volume over total airflow). The climb is an [[?exponential]] approach, the solution of a simple [[?differential-equation|differential equation]] — CO₂ breathed in by the occupants minus CO₂ carried out by the air:

$$C(t) = C_0 + (C_s - C_0)\\left(1 - e^{-Qt/V}\\right)$$

A room of 80 m³ with 50 L/s of outdoor air has $\\tau$ ≈ 27 minutes, which is why a one-hour meeting ends in stale air that nobody noticed coming.

### How much outdoor air
| Guidance | Outdoor air for occupants |
|---|---|
| EN 16798-1, categories I / II / III (high / normal / moderate expectations) | 10 / 7 / 4 L/s per person, plus an allowance for emissions from the building (about 0.7 L/s per m² for a low-polluting building in category II) |
| ANSI/ASHRAE 62.1, office space (minimum) | 2.5 L/s per person plus 0.3 L/s per m² of floor |

Better ventilation pays back in people. Studies in offices and schools link more outdoor air with fewer headaches, less tiredness and fewer "sick building" symptoms, and with better performance: Wargocki and colleagues (2000) found office tasks done faster and more accurately as the outdoor air supply rose, and Allen and colleagues (2016) found higher scores in decision-making tests at lower CO₂ and pollutant levels. More ventilation also dilutes airborne infections.

### Humidity and pollutants from the work
- **Humidity**: about 30–60 % is the healthy middle. Below about 30 % (heated rooms in winter) eyes, skin and airways dry out — screen workers and contact-lens wearers notice first; above about 60 % mould, dust mites and condensation thrive.
- **Process pollutants** are controlled at the source: **local exhaust ventilation** (LEV) captures welding fume, solvent vapour and dust where they are made, which general ventilation cannot do. Capture falls away rapidly with distance, so hoods must sit close to the source — designed so the worker can still see and reach the work without putting their head in the plume.
- **Engine exhaust** indoors (forklifts, generators, vehicles in workshops and loading bays) brings carbon monoxide, nitrogen dioxide and diesel particulate: prefer electric equipment and extract exhausts at the tailpipe.

### Settings
- **Offices and meeting rooms** fill up quickly: demand-controlled ventilation by CO₂ sensors, openable windows, and meetings that do not pack small rooms.
- **Schools**: a classroom of 25–30 pupils with the windows shut often passes 1 500 ppm within a lesson; ventilate between and during lessons.
- **Workshops and industry**: process pollutants first (LEV), then general ventilation with make-up air — heated in winter, or people will block it.
- **Military**: closed-hatch vehicles, shelters, command posts and ships' compartments, sometimes over-pressurised through filters for protection; many people and much equipment in small volumes, so CO₂, heat and humidity build up fast. Heaters and generators in tents and shelters risk carbon monoxide.
- **Field**: confined spaces — tanks, pits, sewers, silos — can lack oxygen or hold toxic gas; test the air before entry, ventilate continuously and follow a permit system. Normal air has 20.9 % oxygen; US OSHA treats below 19.5 % as oxygen-deficient (see [[confined-spaces]]).
- **Vehicles**: recirculation in a car or cab with several people raises CO₂ within minutes; fresh-air mode keeps drivers alert.

In the simulation, people fill a room through a working day. Change the number of people and their activity, the room volume and the ventilation, open a window at lunch, and watch the CO₂ climb towards its steady value and fall again — the time constant is marked on the curve.

> [!warn] Carbon monoxide has no smell or colour. Never run generators, engines, barbecues or fuel heaters inside tents, shelters, vehicles, garages or other enclosed spaces, and fit CO alarms where fuel is burned indoors. Headache, dizziness or confusion in several people in such a space means: get everyone into fresh air and call your local emergency number. Never enter a confined space to rescue someone without breathing apparatus and a trained team.

> [!key] Ventilation dilutes what people and processes add to the air, and CO₂ shows how well: 7–10 L/s of outdoor air per person keeps an office at roughly 900–1 150 ppm. Capture process fumes at the source, keep humidity between about 30 and 60 %, and never burn fuel in enclosed spaces.
`,
  ideas: [
    'CO₂ from breath is an indicator of outdoor air per person: C = C₀ + G/Q.',
    '7–10 L/s of outdoor air per person keeps an office at roughly 900–1150 ppm; 5 L/s gives about 1400 ppm.',
    'CO₂ in a room approaches its steady value with a time constant V/Q — often half an hour — so meetings end in stale air.',
    'Process fumes need local exhaust ventilation at the source; general ventilation only dilutes.',
    'Fuel burned in enclosed spaces makes carbon monoxide; confined spaces can lack oxygen.'
  ],
  pitfalls: [
    'CO₂ at 1500 ppm is poisoning office workers — CO₂ itself is harmless at these levels (the workplace limit is 5000 ppm); it shows that other pollutants are not being diluted enough.',
    'A room with a fan in it is ventilated — A fan only stirs the air; ventilation means outdoor air in and room air out.',
    'General ventilation can deal with welding fume — It only dilutes after the fume has passed through the welder\'s breathing zone; capture it at the source.'
  ],
  formulas: [
    {
      name: 'Steady-state CO₂ in a ventilated room',
      expr: 'C = C0 + 1e6*G/Q', tex: 'C = C_0 + 10^6\\,\\dfrac{G}{Q}',
      vars: {
        C: { name: 'indoor CO₂ concentration', q: false, unit: 'ppm' },
        C0: { name: 'outdoor CO₂ concentration', q: false, unit: 'ppm', value: 420, tex: 'C_0' },
        G: { name: 'CO₂ breathed out per person (about 0.005 L/s sedentary)', q: 'flowrate', unit: 'L/s', value: 0.005 },
        Q: { name: 'outdoor air per person', q: 'flowrate', unit: 'L/s', value: 10 }
      },
      note: 'Per person, or for the whole room with total G and total Q. Perfect mixing assumed.',
      stories: { C: 'Each person breathes out {G} of CO₂ and gets {Q} of outdoor air at {C0}. Where does the CO₂ settle?', Q: 'Each person breathes out {G} of CO₂; outdoors is {C0}. How much outdoor air per person keeps the room at {C}?' }
    },
    {
      name: 'CO₂ build-up after people arrive',
      expr: 'C = C0 + (Cs - C0)*(1 - exp(-Q*t/V))', tex: 'C = C_0 + (C_s - C_0)\\left(1 - e^{-Qt/V}\\right)',
      vars: {
        C: { name: 'CO₂ after time t', q: false, unit: 'ppm' },
        C0: { name: 'starting (outdoor) CO₂', q: false, unit: 'ppm', value: 420, tex: 'C_0' },
        Cs: { name: 'steady-state CO₂ for these people and this airflow', q: false, unit: 'ppm', value: 1250, tex: 'C_s' },
        Q: { name: 'total outdoor airflow', q: 'flowrate', unit: 'L/s', value: 50 },
        t: { name: 'time since people arrived', q: 'time', unit: 'min', value: 30 },
        V: { name: 'room volume', q: 'volume', unit: 'm³', value: 75 }
      },
      stories: { C: 'A room of {V} with {Q} of outdoor air starts at {C0} and heads for {Cs}. What is the CO₂ after {t}?', t: 'A room of {V} with {Q} of outdoor air heads from {C0} to {Cs}. How long until it reaches {C}?' }
    },
    {
      name: 'Air change rate',
      expr: 'n = Q/V', tex: 'n = \\dfrac{Q}{V}',
      vars: {
        n: { name: 'air changes', q: 'rate', unit: '1/h' },
        Q: { name: 'outdoor airflow', q: 'flowrate', unit: 'm³/h', value: 150 },
        V: { name: 'room volume', q: 'volume', unit: 'm³', value: 75 }
      },
      stories: { n: 'A room of {V} receives {Q} of outdoor air. How many air changes an hour is that?', Q: 'A room of {V} needs {n}. What outdoor airflow is that?' }
    }
  ],
  examples: [
    {
      title: 'The one-hour meeting',
      q: 'Ten people meet in a room of 81 m³ supplied with 50 L/s of outdoor air (5 L/s each). Outdoors is 420 ppm; each breathes out 0.005 L/s of CO₂. Find the steady state, the time constant, the CO₂ after an hour, and the airflow that would hold 1000 ppm.',
      steps: [
        'Steady state: $420 + 10^6\\times0.05/50 = 420 + 1000 = 1420$ ppm.',
        'Time constant: $\\tau = V/Q = 81/0.05 = 1620$ s = 27 min.',
        'After 60 min: $420 + 1000(1 - e^{-60/27}) = 420 + 1000\\times0.89 = 1312$ ppm.',
        'To hold 1000 ppm: $Q = 0.05/(580\\times10^{-6}) = 86$ L/s, 8.6 L/s per person.'
      ],
      a: 'About 1310 ppm after an hour on the way to 1420; about 86 L/s would hold 1000 ppm.'
    },
    {
      title: 'A classroom with the windows shut',
      q: 'Thirty pupils (about 0.004 L/s of CO₂ each) sit in a classroom of 180 m³ with only 40 L/s of air leaking in. What is the CO₂ after a 45-minute lesson, and at 8 L/s per pupil?',
      steps: [
        'Total $G$ = 0.12 L/s. Steady state: $420 + 10^6\\times0.12/40 = 3420$ ppm; $\\tau = 180/0.04 = 4500$ s = 75 min.',
        'After 45 min: $420 + 3000(1 - e^{-0.6}) = 420 + 3000\\times0.45 = 1774$ ppm.',
        'At 8 L/s per pupil (240 L/s): steady state $420 + 500 = 920$ ppm.'
      ],
      a: 'About 1770 ppm by the end of the lesson; with proper ventilation it would stay near 900 ppm.'
    }
  ],
  quiz: [
    { q: 'Why is CO₂ used to judge the ventilation of occupied rooms?', choices: ['It comes from the occupants, so it shows how much outdoor air each person gets', 'It is the most dangerous indoor pollutant', 'It causes most sick-building symptoms directly', 'Because oxygen cannot be measured'], a: 0, why: 'CO₂ tracks the dilution of everything people add to the air; at office levels it is not itself toxic.' },
    { q: 'At 1500 ppm, CO₂ itself poisons office workers.', a: false, why: 'The workplace exposure limit is 5000 ppm; 1500 ppm means the ventilation is too low for the number of people.' },
    { q: 'Outdoors is 420 ppm and each person breathes out 0.005 L/s of CO₂. With 8 L/s of outdoor air per person, where does the CO₂ settle?', answer: 1045, unit: 'ppm', why: '420 + 10⁶ × 0.005/8 = 420 + 625 = 1045 ppm.' },
    { q: 'What is the best way to control welding fume at a workbench?', choices: ['Local exhaust ventilation at the source', 'A bigger fan in the ceiling', 'Opening a window at the far end of the workshop', 'Air fresheners'], a: 0, why: 'Capture at the source removes the fume before it passes the welder\'s breathing zone.' },
    { q: 'Several people in a tent with a fuel heater get headaches and feel dizzy. What comes first?', choices: ['Get everyone into fresh air and call the emergency number: suspect carbon monoxide', 'Turn the heater up', 'Give them painkillers and carry on', 'Wait to see if it passes'], a: 0, why: 'Carbon monoxide is invisible and odourless; fresh air and emergency help come first.' }
  ],
  problems: [
    { q: 'Outdoors is 420 ppm and each person breathes out 0.005 L/s of CO₂. What outdoor airflow per person keeps a room at 900 ppm?', answer: 10.4, unit: 'L/s', tol: 0.01, steps: ['$Q = G/(C - C_0) = 0.005/(480\\times10^{-6}) = 10.4$ L/s per person.'] },
    { q: 'A room of 200 m³ receives 100 L/s of outdoor air. How many air changes an hour is that?', answer: 1.8, unit: '1/h', tol: 0.01, steps: ['$Q = 0.1$ m³/s $= 360$ m³/h.', '$n = 360/200 = 1.8$ per hour.'] }
  ],
  ranges: [
    { dim: 'Outdoor air per person in offices', range: [7, 10], unit: 'L/s per person', who: 'sedentary office occupants', why: 'Normal to high expectations of air quality; CO₂ at roughly 900–1150 ppm.', limits: 'Plus an allowance for the building\'s own emissions; national codes and ASHRAE 62.1 set lower minimums (2.5 L/s per person plus 0.3 L/s per m²).', setting: ['office', 'school', 'health'], src: 'EN 16798-1 (categories II–I)' },
    { dim: 'Indoor CO₂ as a ventilation indicator', range: [null, 1000], unit: 'ppm', who: 'occupants of offices, meeting rooms and classrooms', why: 'Roughly 8 L/s or more of outdoor air per sedentary adult; fresher air, fewer symptoms, better performance.', limits: 'An indicator, not a toxic limit; low CO₂ does not prove the absence of other pollutants.', setting: ['office', 'school', 'civil', 'vehicle'], src: 'Widely used design guidance (after Pettenkofer); consistent with EN 16798-1' },
    { dim: 'CO₂ occupational exposure limit (8-hour average)', range: [null, 5000], unit: 'ppm', who: 'workers in breweries, cold stores with dry ice, submarines, closed vehicles', why: 'Avoids the headaches and breathlessness of high CO₂.', limits: 'Far above what good ventilation gives; confined spaces can reach dangerous levels quickly.', setting: ['workshop', 'military', 'field'], src: 'US OSHA 29 CFR 1910.1000; EU indicative limit value' },
    { dim: 'Relative humidity indoors', range: [30, 60], unit: '%', who: 'occupants, especially screen workers, contact-lens wearers and people with asthma', why: 'Eyes and airways stay moist; mould and dust mites stay down.', limits: 'Humidifying heated winter air costs energy and needs hygienic equipment; some processes need different values.', setting: ['office', 'civil', 'school', 'health'], src: 'Common design practice' },
    { dim: 'Oxygen for entry into confined spaces', range: [19.5, 23.5], unit: '% by volume', who: 'anyone entering tanks, pits, sewers, silos or vessels', why: 'Below 19.5 % the air is oxygen-deficient; above 23.5 % fire risk rises sharply.', limits: 'Toxic and flammable gases must be tested too; conditions change during work — monitor continuously.', setting: ['field', 'workshop', 'military'], src: 'US OSHA 29 CFR 1910.146' }
  ],
  applications: [
    'CO₂ monitors in meeting rooms and classrooms as a simple check on ventilation.',
    'Demand-controlled ventilation that raises the airflow as rooms fill.',
    'Local exhaust ventilation at welding, grinding, spraying and solvent work.',
    'Carbon monoxide alarms and ventilation rules for tents, shelters and vehicles with heaters and generators.'
  ],
  history: 'Max von Pettenkofer, in Munich in the 1850s, proposed judging room air by its carbon dioxide and suggested about 1000 ppm as the limit of good air — not because CO₂ harmed people but because it tracked the other effluents of crowded rooms. Ventilation rates in standards have since moved with energy prices: deep cuts after the oil crises of the 1970s were followed by "sick building" complaints and higher rates again.',
  sources: [
    'EN 16798-1, *Energy performance of buildings — Ventilation for buildings — Part 1: Indoor environmental input parameters for design and assessment of energy performance of buildings addressing indoor air quality, thermal environment, lighting and acoustics*.',
    'ANSI/ASHRAE Standard 62.1, *Ventilation and Acceptable Indoor Air Quality*.',
    'US OSHA, 29 CFR 1910.1000 (air contaminants) and 29 CFR 1910.146 (permit-required confined spaces).',
    'P. Wargocki et al., "The effects of outdoor air supply rate in an office on perceived air quality, sick building syndrome (SBS) symptoms and productivity", *Indoor Air*, 2000.',
    'J. G. Allen et al., "Associations of cognitive function scores with carbon dioxide, ventilation, and volatile organic compound exposures in office workers", *Environmental Health Perspectives*, 2016.',
    'UK HSE, *Controlling airborne contaminants at work: a guide to local exhaust ventilation* (HSG258).'
  ],
  sim: 'en-co2'
}

);
