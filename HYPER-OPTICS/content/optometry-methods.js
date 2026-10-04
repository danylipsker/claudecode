/* HYPER-OPTICS · content/optometry-methods.js — the topic "The optometrist's methods": what happens in an eye examination and why.
 * Every page explains how a test works, what it measures and what the result looks like. None of them is a way to check one's own
 * eyes or to choose a treatment; those belong with an optometrist or an ophthalmologist.
 */
Hyper.add(

/* ================================================================ the examination */
{
  id: 'the-eye-examination', parent: 'optometry-methods', title: 'The eye examination', level: 1,
  short: 'A routine eye examination is a fixed sequence of questions, each answered by an instrument: why the person has come, how well each eye sees, what lens would sharpen the picture, whether the two eyes work together, and whether the front and the back of each eye are healthy. This page maps the sequence; the pages after it open each instrument.',
  keywords: ['eye test', 'eye exam', 'sight test', 'optometrist', 'ophthalmologist', 'optician', 'refraction', 'case history', 'dilation', 'visual acuity', 'eye health check', 'examination routine'],
  prereq: ['the-eye-as-a-camera', 'emmetropia-and-refractive-error'],
  related: ['visual-acuity-charts', 'retinoscopy', 'autorefractors-and-aberrometers', 'the-phoropter-and-subjective-refraction', 'the-slit-lamp', 'tonometry', 'ophthalmoscopy-and-fundus-imaging', 'perimetry', 'reading-a-prescription', 'physics:the-eye', 'medicine:vision'],
  body: `
An eye examination looks like a string of unrelated gadgets: a chart, a chin rest, a dial that clicks, a bright microscope, a puff of air. It is easier to follow as **seven questions asked in a fixed order**, each one using what the one before found.

### The seven stages
| # | The question | Typical instruments | Recorded as |
|---|---|---|---|
| 1 | Why has the person come, and what could affect their eyes? | questions | words |
| 2 | How well does each eye see, with and without glasses? | [[visual-acuity-charts|letter chart]] | Snellen fraction or logMAR |
| 3 | What does the optics of each eye need, measured objectively? | [[autorefractors-and-aberrometers|autorefractor]], [[retinoscopy|retinoscope]], [[keratometry-and-corneal-topography|keratometer]] | sphere, cylinder × axis, K values |
| 4 | Which lens does the person find clearest? | [[the-phoropter-and-subjective-refraction|phoropter]] | the prescription, with its acuity |
| 5 | Do the two eyes aim and focus together? | [[cover-test-and-binocular-balance|cover test]], prisms, near-point rule | prism dioptres, centimetres |
| 6 | Are the front of the eye and its pressure healthy? | [[the-slit-lamp|slit lamp]], [[tonometry|tonometer]] | descriptions, mmHg |
| 7 | Are the optic nerve and the retina healthy? | [[ophthalmoscopy-and-fundus-imaging|ophthalmoscope]], [[oct-in-eye-care|OCT]], [[perimetry|visual field]] | descriptions, images, dB |

### Why this order
The **acuity** comes first because it is a baseline taken before anything is changed. The **objective** refraction (stage 3) needs no answers from the person: it gives a starting point in seconds, so that the **subjective** stage (4) only has to refine it, in steps of 0.25 D. The binocular tests (5) come after the lenses because an uncorrected eye can make the eyes strain for reasons the lenses will remove. The health checks (6 and 7) are separate in kind: an eye can read 6/6 and still be unwell, and a healthy eye can read 6/60 for want of the right lens. **Optics and health are two different questions**, and both are asked every time.

### Measured, and chosen
Some stages produce a measurement (a corneal curvature of 43.25 D, a pressure of 14 mmHg); others ask the person to choose between two views. The final prescription is built on both and adjusted for comfort and use: a decision, not a printout.

### Drops and dilation
For the back of the eye a wide view is easier through a wide pupil, so drops may be used to dilate it; near vision then stays blurred and bright light uncomfortable for some hours. In young children a different drop relaxes the focusing muscle (**cycloplegia**) so that the eye's full error shows, because a child's eye can hide a good deal of long-sightedness by focusing.

### Who does what
Roles differ from country to country. In general an **optometrist** examines the eyes, measures refractive error, prescribes lenses and recognises disease; an **ophthalmologist** is a medical doctor who treats eye disease and operates; a **dispensing optician** fits and supplies the lenses.

> [!note] This page and those that follow explain how each test works and what it measures. They are not a way to check one's own eyes: only an examination by a practitioner can do that.

> [!key] An examination is seven questions in a fixed order, from history and acuity through objective and subjective refraction to the health of the front and the back of the eye. Optics and health are separate questions.
`,
  ideas: [
    'A routine examination is seven questions in order: history, acuity, objective refraction, subjective refraction, binocular function, health of the front, health of the back.',
    'Objective methods give a starting point in seconds; the subjective stage refines it with the person\'s answers in 0.25 D steps.',
    'Measuring the optics and checking the health are separate jobs: 6/6 does not prove health, and a healthy eye can need a lens.',
    'The prescription is a judgement built on measurements, adjusted for comfort and use.'
  ],
  pitfalls: [
    'If I read the 6/6 line my eyes are healthy — Acuity tests the optics and the central retina only. Glaucoma, early macular disease and retinal tears can leave acuity normal for a long time, which is why pressure, nerve and retina are examined separately.',
    'The machine\'s printout is the prescription — An autorefractor reading is a starting point. The subjective and binocular stages refine it, and in children the machine can be misled by focusing.',
    'Optometrist, ophthalmologist and optician are the same job — They differ in training and in what they may do, and the division varies by country: examining and prescribing lenses, treating disease and operating, and fitting and supplying lenses.',
    'Dilating drops are part of every eye test — They are used when the back of the eye needs a wide view, and the examiner decides; the effects wear off over hours.'
  ],
  terms: [
    { term: 'Optometrist', also: ['optometry'], def: 'A practitioner trained to examine the eyes, measure refractive error, prescribe spectacles and contact lenses and recognise eye disease. The legal scope varies by country.' },
    { term: 'Ophthalmologist', def: 'A medical doctor who specialises in diseases of the eye and its surgery, including the treatment of conditions that optometrists refer on.' },
    { term: 'Dispensing optician', def: 'A professional who fits and supplies spectacles from a prescription: choosing the frame, measuring the position of the lenses, adjusting the fit.' },
    { term: 'Refraction', also: ['objective refraction', 'subjective refraction'], def: 'Finding the lens power (sphere, cylinder, axis) that gives the clearest picture. Objective refraction uses an instrument; subjective refraction uses the person\'s answers.' },
    { term: 'Case history', also: ['anamnesis'], def: 'The questions that begin an examination: the reason for the visit, symptoms, general health, medicines, family history, work and visual habits.' },
    { term: 'Cycloplegia', also: ['mydriasis (dilation)'], def: 'Temporary paralysis of the focusing muscle by drops, so that the eye\'s full refractive error shows. Mydriasis, the widening of the pupil, is a separate effect of other drops.' }
  ],
  examples: [
    {
      title: 'Printout and prescription',
      q: 'An autorefractor reads the right eye as −1.25 −0.50 × 178. After the subjective stage the prescription is −1.25 −0.50 × 180. How different are they?',
      steps: [
        'Compare the spherical equivalent, $M = S + C/2$, which is the mean power of the lens: the printout gives $-1.25 + (-0.50)/2 = -1.50$ D.',
        'The prescription gives $-1.25 + (-0.50)/2 = -1.50$ D: the same.',
        'The cylinder axes differ by 2°, less than either method can resolve for a 0.50 D cylinder.'
      ],
      a: 'No difference in spherical equivalent and 2° in axis: the machine was a good starting point.'
    },
    {
      title: 'Why drops are used in a child',
      q: 'A child\'s autorefractor reading without drops is +1.00 D; with the focusing muscle relaxed by drops it is +3.00 D. How much of the long-sightedness was being hidden?',
      steps: [
        'Without drops the eye focused by itself, adding positive power to compensate.',
        'The difference between the two readings is the power the child was using unconsciously: $3.00 - 1.00 = 2.00$ D.'
      ],
      a: '2.00 D of the error was hidden by focusing; the relaxed reading shows all of it.'
    }
  ],
  quiz: [
    { q: 'A person reads the 6/6 line with each eye. Which conclusion is safe?', choices: ['The eyes are healthy', 'The optics and central retina work normally; the health checks are still needed', 'No glasses will ever be needed', 'The eye pressure is normal'], a: 1, why: 'Acuity tests the central optics and retina. It says nothing about pressure, the optic nerve or the peripheral retina, which are checked separately.' },
    { q: 'Objective refraction needs the person to say which of two lenses looks clearer.', a: false, why: 'That is subjective refraction. Objective methods (autorefractor, retinoscope) measure the eye without asking, so they work on infants and on people who cannot answer.' },
    { q: 'Which instrument measures the pressure inside the eye?', choices: ['Phoropter', 'Keratometer', 'Tonometer', 'Cover paddle'], a: 2, why: 'A tonometer measures the force needed to flatten a small area of the cornea, from which the pressure follows. The keratometer measures curvature; the phoropter holds trial lenses.' },
    { q: 'Without drops a child\'s autorefractor reading is +0.75 D; with the focusing muscle relaxed it is +2.25 D. How many dioptres of error did focusing hide?', answer: 1.5, unit: 'D', why: 'The difference between the readings is the hidden amount: 2.25 − 0.75 = 1.50 D.' },
    { q: 'Why does the subjective stage follow the objective one?', choices: ['The patient\'s answers are not needed', 'The objective result gives a close starting point, so only small refinements remain', 'Instruments are always more accurate than people', 'To save time on the health checks'], a: 1, why: 'Starting from a measured value, the subjective stage needs only to adjust in 0.25 D steps. It is still needed, because the clearest and most comfortable lens is a judgement the instrument cannot make.' }
  ],
  applications: [
    'School and workplace vision screening: a shortened version of stages 2 to 5, designed to find people who need a full examination.',
    'Driving licence checks, which use acuity and often the visual field, with legal limits that differ from place to place.',
    'Contact lens aftercare visits, which repeat the acuity and refraction and add checks of the front of the eye.',
    'Diabetic eye screening programmes, which are stage 7 done by photograph at intervals.',
    'Assessment before cataract or refractive surgery, which adds corneal topography and biometry (axial length) to the sequence.'
  ],
  history: 'The sequence grew with the instruments. Donders\'s book of 1864 put refraction on a measured footing; Helmholtz\'s ophthalmoscope (1851) opened the back of the eye; Snellen\'s chart (1862) gave the first number; Gullstrand\'s slit lamp (1911) and Goldmann\'s applanation tonometer (1950s) made the front of the eye and its pressure routine; OCT (1991) added cross-sections of the retina.',
  sources: [
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — the routine examination, stage by stage.',
    'W. J. Benjamin (ed.), *Borish\'s Clinical Refraction* — objective and subjective refraction.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the optics behind the measurements.'
  ],
  sim: 'op-exam'
},

/* ================================================================ acuity charts */
{
  id: 'visual-acuity-charts', parent: 'optometry-methods', title: 'Visual acuity charts: Snellen and logMAR', level: 1,
  short: 'A chart finds the smallest detail an eye can resolve. Letters are built on a 5 × 5 grid so that the whole letter spans 5 arc-minutes and each stroke 1; the line that can still be read is written as a Snellen fraction (6/6, 20/20), a decimal (1.0) or a logMAR number (0.00), three ways of saying the same thing.',
  keywords: ['visual acuity', 'Snellen', 'logMAR', 'ETDRS', 'letter chart', '6/6', '20/20', 'decimal acuity', 'minimum angle of resolution', 'MAR', 'optotype', 'Sloan letters', 'Landolt C', 'eye chart'],
  prereq: ['the-fovea-and-visual-acuity', 'the-eye-examination'],
  related: ['resolution-limits', 'the-airy-disk', 'myopia', 'contrast-sensitivity', 'reading-a-prescription', 'low-vision-and-magnification'],
  body: `
A chart answers one question: what is the smallest detail this eye can resolve? The answer is not a size in millimetres, which would depend on where the chart stands, but an **angle**: the finest detail the eye can pick out, measured from the eye.

### The unit: the minute of arc
A healthy eye can just separate two details that subtend about **1 arc-minute** (1/60 of a degree) — about the spacing of the cones in the fovea. Charts therefore draw each letter on a **5 × 5 grid**: the letter is 5 arc-minutes tall, and every stroke and every gap is 1 arc-minute. At 6 m (20 ft) a 5-arc-minute letter is $6\\,\\mathrm{m}\\times\\tan 5' = 8.73$ mm tall, its strokes 1.75 mm. A line twice as large is a line of "twice as poor" acuity, and so on.

### Four ways to write the same line
| Snellen (m) | Snellen (ft) | decimal | logMAR | letter height at 6 m |
|---|---|---|---|---|
| 6/6 | 20/20 | 1.0 | 0.00 | 8.7 mm |
| 6/9 | 20/30 | 0.67 | 0.18 | 13.1 mm |
| 6/12 | 20/40 | 0.5 | 0.30 | 17.5 mm |
| 6/24 | 20/80 | 0.25 | 0.60 | 34.9 mm |
| 6/60 | 20/200 | 0.1 | 1.00 | 87.3 mm |

A **Snellen fraction** reads: the testing distance over the distance at which an eye of standard acuity would see the same letter at 5 arc-minutes. 6/12 means "this eye at 6 m sees what a standard eye sees from 12 m". The **logMAR** is the logarithm of the minimum angle of resolution in arc-minutes: 6/12 resolves 2′, $\\log_{10}2 = 0.30$. Smaller is better; below 0 is better than 6/6. Because it is logarithmic, equal steps are equal proportions — every 0.1 is a line 26 % larger — so averages and changes mean something.

### Charts that are fair
The old **Snellen** chart has one letter on the top line and many on the bottom, uneven spacing and a coarse range. The **ETDRS** (Bailey–Lovie) layout fixes this: five letters on every line, a constant ratio of 1.26 (0.1 logMAR) between lines, spacing proportional to letter size, and ten **Sloan** letters (C D H K N O R S V Z) chosen to be equally legible. Each letter is worth 0.02 logMAR; read at 4 m, the acuity is $1.1 - 0.02\\times$ the number of letters read correctly.

### Defocus and the chart
Blur removes fine detail first. For a pupil of 4 mm the usual rule of thumb is 0.5 D of uncorrected defocus ≈ 20/45, 1 D ≈ 20/80, 2 D ≈ 20/180 and 3 D ≈ 20/320, which is why a chart is such a sensitive test for lens power. A **pinhole** shrinks the blur disc: acuity that improves through it points to an optical cause; acuity that does not points elsewhere.

### Beyond the chart
If the largest letter cannot be read, the examiner brings the chart closer, then counts fingers, detects hand movement, or notes whether light is seen at all.

> [!note] A chart measures one thing — the resolution of fine black detail at high contrast, in the centre of the field. It is a first number and not a verdict on the eye.

> [!key] Acuity is an angle: 5 arc-minutes per letter, 1 per stroke. Snellen fractions, decimals and logMAR are three notations for it; logMAR is the one whose steps are equal.
`,
  ideas: [
    'Acuity is the smallest resolvable detail expressed as an angle; 1 arc-minute is the standard.',
    'A letter is 5 arc-minutes tall, strokes and gaps 1 arc-minute; at 6 m that is 8.73 mm.',
    '6/6 = 20/20 = 1.0 decimal = logMAR 0.00; 6/12 = 20/40 = 0.5 = 0.30; 6/60 = 20/200 = 0.1 = 1.00.',
    'logMAR steps are equal in proportion (×1.26 per 0.1) and ETDRS charts keep five letters per line.',
    'Defocus blurs fine detail first: about 1 D uncorrected gives roughly 20/80 for a 4 mm pupil.'
  ],
  pitfalls: [
    'A person who reads 6/6 has perfect vision — 6/6 is the standard for resolving high-contrast detail at the centre. Many people read better, and acuity says nothing about contrast, field, colour or depth.',
    'The Snellen denominator is a distance to the chart — The chart is read at 6 m (or 20 ft); the denominator is the distance at which a standard eye would see that line. 6/12 does not mean "twice as far away".',
    'Higher logMAR means better sight — It is the opposite: logMAR is an angle, so 0.0 is 6/6, 0.3 is 6/12 and 1.0 is 6/60. Negative values are better than 6/6.',
    'Acuity depends only on the lens — It also depends on contrast, lighting, pupil size, the retina and the nerve; that is why a lens that clears the blur does not always give 6/6.'
  ],
  terms: [
    { term: 'Visual acuity', also: ['VA'], def: 'The smallest detail an eye can resolve, usually found as the smallest line of letters that can be read at a standard distance.' },
    { term: 'Snellen fraction', also: ['6/6', '20/20'], def: 'Testing distance over the distance at which a standard eye sees the same letters at 5 arc-minutes: 6/12 (metric) or 20/40 (feet) means a letter twice the standard size is the smallest read.' },
    { term: 'logMAR', also: ['log of the minimum angle of resolution'], def: 'The base-10 logarithm of the smallest resolvable detail in arc-minutes. 0.00 is 6/6; each 0.1 is a line 26 % larger; negative is better than 6/6.' },
    { term: 'Minimum angle of resolution', also: ['MAR'], def: 'The angle, in arc-minutes, of the finest detail that can just be resolved. Decimal acuity is 1/MAR.' },
    { term: 'Optotype', also: ['Sloan letters', 'Landolt C'], def: 'A standard test symbol with a defined structure, such as the Sloan letters or the Landolt ring (a ring whose gap is 1/5 of its diameter).' },
    { term: 'ETDRS chart', also: ['Bailey–Lovie chart'], def: 'A logMAR chart with five letters on every line, a ratio of 1.26 between lines and spacing proportional to the letters, used in research and in careful clinical work.' }
  ],
  formulas: [
    {
      name: 'logMAR from the Snellen denominator', expr: 'L = log10(d/20)', tex: 'L = \\log_{10}\\frac{d}{20}',
      vars: {
        L: { name: 'logMAR', signed: true, tex: 'L' },
        d: { name: 'Snellen denominator (20/d; for 6/x use d = x/0.3)', value: 40, min: 5, max: 2000, tex: 'd' }
      },
      solveFor: 'L', note: '20/20 gives 0.00, 20/40 gives 0.30, 20/200 gives 1.00.',
      stories: { L: 'A person\'s smallest line is 20/{d} in Snellen notation. What is the logMAR?', d: 'A person\'s acuity is logMAR {L}. What is the Snellen denominator, in 20/d?' }
    },
    {
      name: 'Height of a letter', expr: 'h = D*tan(5/60*pi/180*d/20)', tex: 'h = D\\,\\tan\\!\\left(\\frac{5}{60}\\,\\frac{d}{20}\\,\\frac{\\pi}{180}\\right)',
      vars: {
        h: { name: 'letter height', q: 'length', unit: 'mm', tex: 'h' },
        D: { name: 'testing distance', q: 'length', unit: 'm', value: 6, tex: 'D' },
        d: { name: 'Snellen denominator', value: 20, min: 5, max: 2000, tex: 'd' }
      },
      solveFor: 'h', note: 'The letter subtends 5 arc-minutes for 20/20, and d/20 times that for 20/d.',
      stories: { h: 'How tall must the 20/{d} letters of a chart be, to be read at {D}?', D: 'The 20/{d} letters on a chart are {h} tall. At what distance do they subtend the proper angle?' }
    },
    {
      name: 'Decimal acuity', expr: 'V = 1/m', tex: 'V = \\frac{1}{m}',
      vars: {
        V: { name: 'decimal acuity', tex: 'V' },
        m: { name: 'minimum angle of resolution', q: false, unit: '′', value: 1, min: 0.2, max: 60, tex: 'm' }
      },
      solveFor: 'V', note: 'An eye that resolves 2′ has a decimal acuity of 0.5 (6/12, 20/40).'
    }
  ],
  examples: [
    {
      title: 'Letters for a 4 m chart',
      q: 'An ETDRS chart used at 4 m has a line equivalent to 20/40. How tall are its letters?',
      steps: [
        'Each letter of the 20/40 line subtends $5' + "'" + ' \\times 40/20 = 10\'$ at the eye.',
        { text: 'Its height at 4 m is', tex: 'h = 4\\,\\mathrm{m}\\times\\tan 10\' = 4\\times 0.002909\\,\\mathrm{m}' },
        'That is 11.64 mm; the same letter at 6 m would have to be 17.45 mm.'
      ],
      a: '11.6 mm: the letter height scales with the testing distance, the angle stays 10′.'
    },
    {
      title: 'Three notations',
      q: 'A person reads the 6/9 line. Give the decimal acuity and the logMAR.',
      steps: [
        'Decimal: $6/9 = 0.67$.',
        { text: 'logMAR: the minimum angle of resolution is 9/6 = 1.5 arc-minutes:', tex: '\\log_{10}1.5 = 0.176' },
        'In feet the same line is 20/30.'
      ],
      a: 'Decimal 0.67, logMAR 0.18, Snellen 20/30.'
    }
  ],
  quiz: [
    { q: 'Which acuity is best?', choices: ['6/12', '6/9', '6/6', '6/24'], a: 2, why: 'The smaller the denominator, the finer the detail that can be read: 6/6 resolves 1 arc-minute, 6/9 resolves 1.5, 6/12 resolves 2 and 6/24 resolves 4.' },
    { q: 'What is the logMAR of a person who reads the 6/24 line?', answer: 0.6, why: 'The minimum angle is 24/6 = 4 arc-minutes, and log10(4) = 0.60.' },
    { q: 'An acuity of logMAR 0.30 means the smallest letters read are twice as large as the 6/6 letters.', a: true, why: '10^0.30 = 2.0: logMAR 0.30 corresponds to a minimum angle of 2 arc-minutes, 6/12 or 20/40.' },
    { q: 'Why is a chart usually read at 6 m (20 ft)?', choices: ['Letters are easier to print at that size', 'Light from 6 m is nearly parallel, so the eye needs almost no focusing (about 0.17 D)', 'The eye\'s resolution is best at that distance', 'It is the length of most consulting rooms only'], a: 1, why: 'At 6 m the vergence is 1/6 = 0.17 D, small enough that accommodation is not needed and the chart tests the eye at rest. The distance is a convention, though many rooms use mirrors or shorter distances with scaled charts.' },
    { q: 'A person with 1 D of uncorrected short-sightedness (4 mm pupil) reads about which line, by the usual rule of thumb?', choices: ['20/20', '20/30', '20/80', '20/400'], a: 2, why: 'The rule of thumb gives 0.5 D ≈ 20/45, 1 D ≈ 20/80, 2 D ≈ 20/180. The blur disc of 1 D on a 4 mm pupil is about 14 arc-minutes across.' }
  ],
  applications: [
    'Driving and occupational standards, which set a minimum acuity (often near 6/12 or 20/40 with both eyes, but it varies by place).',
    'Clinical trials and research, where ETDRS charts and logMAR scoring give a fine, unbiased number.',
    'Following the effect of a lens, a treatment or a disease over time: a change of three lines is a recognised threshold.',
    'Screening children, with picture or single-letter charts matched to their age.',
    'Low-vision assessment, where the chart is brought close and the magnification needed is read from the acuity ratio.'
  ],
  history: 'Herman Snellen of Utrecht published his chart of letters in 1862. Edmund Landolt introduced the ring with a gap in 1888 as a symbol free of any alphabet; Louise Sloan designed her ten-letter set in the 1950s; Bailey and Lovie\'s logarithmic layout (1976) and the ETDRS chart (1982) made acuity a number suitable for statistics.',
  sources: [
    'I. L. Bailey and J. E. Lovie, "New design principles for visual acuity letter charts", *American Journal of Optometry and Physiological Optics* 53 (1976) — the logarithmic chart layout.',
    'F. L. Ferris et al., "New visual acuity charts for clinical research", *American Journal of Ophthalmology* 94 (1982) — the ETDRS chart.',
    'ISO 8596, *Ophthalmic optics — Visual acuity testing — Standard and clinical optotypes and their presentation* — the Landolt ring as the reference optotype.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — acuity testing in practice.'
  ],
  sim: 'op-acuity'
},

/* ================================================================ retinoscopy */
{
  id: 'retinoscopy', parent: 'optometry-methods', title: 'Retinoscopy', level: 2,
  short: 'The examiner sweeps a streak of light across the pupil and watches the red reflex from the retina. Whether it moves with the streak, against it, or fills the pupil at once says where the eye\'s far point lies; adding lenses until it is neutral, then subtracting the working-distance lens, gives the refraction without asking the person anything.',
  keywords: ['retinoscopy', 'skiascopy', 'shadow test', 'retinoscope', 'reflex', 'with movement', 'against movement', 'neutralisation', 'working distance', 'far point', 'streak', 'gross', 'scissors reflex'],
  prereq: ['emmetropia-and-refractive-error', 'focal-length-and-optical-power', 'real-and-virtual-images'],
  related: ['autorefractors-and-aberrometers', 'the-phoropter-and-subjective-refraction', 'astigmatism-of-the-eye', 'keratoconus-and-corneal-shape', 'myopia', 'hyperopia'],
  body: `
Look at the pupils in a flash photograph and they glow red: light entered the eye, scattered from the retina, and came back out. Retinoscopy turns that glow into a measurement. The examiner shines a **streak of light** into the eye and sweeps it across the pupil, and watches how the red reflex moves.

### What the reflex is
The streak makes a bright patch on the retina. Light from that patch leaves through the pupil, and the eye's own optics turn it into a beam. For a **short-sighted** eye the beam converges, crosses at the eye's **far point** and then spreads; for a **long-sighted** eye it spreads as if from a point behind the eye; for an eye in focus for distance it leaves parallel. The examiner looks through a small peephole at distance $d$ and sees the pupil filled with whatever part of that beam enters the hole.

### With, against, neutral
- **With**: the far point is beyond the examiner (or behind the eye). The reflex moves in the same direction as the streak. This is long-sightedness, emmetropia, or short-sightedness *smaller* than $1/d$.
- **Against**: the far point is between the eye and the examiner, and the beam has already crossed: the image is inverted and the reflex runs the other way. This is short-sightedness *greater* than $1/d$.
- **Neutral**: the far point is at the peephole. All the light enters at once and the whole pupil goes bright or dark together, with no direction.

Near neutrality the reflex becomes **fast, bright and broad**; far from it, slow, dim and narrow. Plus lenses are added to a *with* reflex and minus lenses to an *against* one, until it is neutral.

### The working-distance lens
At neutrality the eye plus the trial lens has its far point at the examiner, a distance $d$ away; it is as short-sighted as $1/d$ dioptres, and the lens has made up the difference. So the true refraction is

$$\\text{net} = \\text{gross} - \\frac{1}{d}$$

with **1.50 D** subtracted at 67 cm, 2.00 D at 50 cm, 2.50 D at 40 cm and 1.00 D at 1 m. An eye neutralised by −1.00 D at 67 cm needs −2.50 D.

### Astigmatism
An astigmatic eye has a different far point in each principal meridian. The examiner reads **break** (the reflex in the pupil does not line up with the streak outside), **width** (it is wider or narrower than the streak), **intensity** and **skew** (it slants when the streak is not along a principal axis), and neutralises the two meridians separately: two powers and an axis. An irregular cornea gives a **scissors reflex**, two bands that open and close.

### Where it is used
Retinoscopy needs no answers, so it serves infants, young children (often with drops that relax focusing, see [[the-eye-examination]]) and people who cannot respond. It also checks an autorefractor, and works when a hazy lens or cornea defeats machines.

> [!note] This page describes a method used by practitioners. It cannot be done well from a description, and it is not a way to assess one's own eyes.

> [!key] The reflex moves with the streak when the examiner is before the eye's far point, against it beyond, and neutral at it. The refraction is the neutralising lens minus 1/d for the working distance.
`,
  ideas: [
    'The returning light converges to the eye\'s far point (myopia) or seems to diverge from a point behind the eye (hyperopia).',
    'With movement: far point beyond the examiner; against: between eye and examiner; neutral: at the examiner.',
    'Near neutrality the reflex is fast, bright and broad; far from it, slow, dim and narrow.',
    'The refraction is the gross neutralising lens minus 1/d: 1.50 D at 67 cm, 2.00 D at 50 cm.',
    'Astigmatism is neutralised meridian by meridian, using break, width, intensity and skew.'
  ],
  pitfalls: [
    'A reflex that moves against the streak means the eye is long-sighted — Against movement means short-sightedness greater than 1/d: the far point lies between the eye and the examiner. A *with* reflex is the one for long-sightedness (and for small myopia).',
    'The lens that neutralises is the prescription — It is the gross value. The working-distance lens, 1/d, must be subtracted, because at neutrality the eye was made short-sighted by 1/d on purpose.',
    'The examiner sees the retina — The retina is the source of the light only. What is watched is the reflex of the beam in the pupil, which carries the eye\'s focal state.',
    'Retinoscopy is a replacement for subjective testing — It gives an objective starting point; the lens the person finds clearest is found in the next stage.'
  ],
  terms: [
    { term: 'Retinoscopy', also: ['skiascopy', 'shadow test'], def: 'An objective method of finding refractive error: a streak of light is swept across the pupil and lenses are added until the red reflex is neutral.' },
    { term: 'Far point', also: ['punctum remotum'], def: 'The farthest point on which the relaxed eye is in focus. At infinity for an eye in focus for distance, at 1/|K| metres for a short-sighted eye of K dioptres.' },
    { term: 'With and against movement', def: 'The direction of the red reflex relative to the streak: with when the far point is beyond the examiner, against when it lies between the eye and the examiner.' },
    { term: 'Neutralisation', also: ['neutrality'], def: 'The state in which the reflex fills the pupil at once with no movement: the eye (with the trial lens) has its far point at the examiner.' },
    { term: 'Working-distance lens', also: ['working distance correction'], def: 'The power 1/d, in dioptres, subtracted from the gross neutralising lens to give the refraction: 1.50 D at 67 cm.' },
    { term: 'Scissors reflex', def: 'Two bands of reflex that move towards and away from each other like scissors blades, a sign of irregular corneal shape.' }
  ],
  formulas: [
    {
      name: 'Refraction from the gross neutralising lens', expr: 'N = G - 1/d', tex: 'N = G - \\frac{1}{d}',
      vars: {
        N: { name: 'net refraction', q: 'optpower', unit: 'D', signed: true, tex: 'N' },
        G: { name: 'gross neutralising lens', q: 'optpower', unit: 'D', signed: true, value: -1, tex: 'G' },
        d: { name: 'working distance', q: 'length', unit: 'cm', value: 0.667, tex: 'd' }
      },
      solveFor: 'N', note: 'At 66.7 cm the working-distance lens is 1.50 D; at 50 cm 2.00 D.',
      stories: { N: 'An eye is neutralised at {d} with a lens of {G}. What is its refraction?', G: 'An eye needs a refraction of {N}. At a working distance of {d}, what gross lens will neutralise it?' }
    },
    {
      name: 'Far point of the eye', expr: 'f = -1/K', tex: 'f = -\\frac{1}{K}',
      vars: {
        f: { name: 'far point (distance in front of the eye)', q: 'length', unit: 'm', tex: 'f' },
        K: { name: 'refraction (the lens the eye needs)', q: 'optpower', unit: 'D', signed: true, value: -2, tex: 'K' }
      },
      solveFor: 'f', note: 'Valid for short-sight (K < 0): a −2 D eye sees sharply to 0.5 m.'
    }
  ],
  examples: [
    {
      title: 'A short-sighted eye',
      q: 'At 66.7 cm the reflex of an eye is neutral with a −1.00 D lens in front. What does the eye need, and where is its far point?',
      steps: [
        { text: 'The working-distance lens at 66.7 cm is 1/0.667 = 1.50 D, so', tex: 'N = -1.00 - 1.50 = -2.50\\,\\mathrm{D}' },
        { text: 'The far point of the eye alone is at', tex: 'f = \\frac{1}{2.50} = 0.40\\,\\mathrm{m}' }
      ],
      a: 'The eye needs −2.50 D; without a lens it sees sharply only to 40 cm.'
    },
    {
      title: 'A long-sighted eye at a short distance',
      q: 'An examiner at 50 cm needs a +2.75 D lens to neutralise the reflex. What is the refraction?',
      steps: [
        { text: 'The working-distance lens at 50 cm is 2.00 D:', tex: 'N = +2.75 - 2.00 = +0.75\\,\\mathrm{D}' }
      ],
      a: '+0.75 D. Had the examiner forgotten the 2.00 D, the answer would be wrong by two dioptres.'
    }
  ],
  quiz: [
    { q: 'The reflex moves **with** the streak. The examiner will next add…', choices: ['plus lenses', 'minus lenses', 'no lens; it is neutral', 'a prism'], a: 0, why: 'A with reflex means the far point is beyond the examiner: the eye needs more positive power for the far point to come back to the peephole. Plus lenses are added until it is neutral.' },
    { q: 'At neutrality the eye\'s far point (with the trial lens) lies at the examiner\'s eye.', a: true, why: 'That is the definition: all the returning light reaches the peephole at once because the beam has been brought to a point there.' },
    { q: 'At a working distance of 50 cm the gross neutralising lens is +0.50 D. What is the refraction?', choices: ['+0.50 D', '−1.50 D', '+2.50 D', '−2.50 D'], a: 1, why: 'Subtract the working-distance lens, 1/0.5 = 2.00 D: 0.50 − 2.00 = −1.50 D.' },
    { q: 'What does an examiner at 67 cm see when the eye needs −1.50 D and has no lens in front?', choices: ['A reflex moving with the streak', 'A reflex moving against the streak', 'A neutral reflex', 'No reflex at all'], a: 2, why: 'The far point of a −1.50 D eye is 1/1.5 = 0.67 m: exactly where the examiner sits. That is why 1.50 D is the working-distance lens at 67 cm.' },
    { q: 'Why can retinoscopy be used on an infant?', choices: ['The infant\'s eyes are larger', 'It needs no answers from the person', 'Infants have no refractive error', 'The light is dimmer'], a: 1, why: 'The measurement is made by watching the reflex, so the person need only look in the right general direction.' }
  ],
  applications: [
    'Refracting infants and young children, usually with drops that relax focusing so that the full error shows.',
    'Refracting people who cannot give reliable answers.',
    'Checking an autorefractor reading, or measuring through a hazy lens or cornea when machines fail.',
    'Spotting irregular corneal shape from the scissors reflex.',
    'Veterinary eye care, which uses the same method on animals.'
  ],
  history: 'The shadow test was described in the 1870s (Cuignet in France, 1873) and developed by many hands under the names keratoscopy and skiascopy. Copeland\'s streak retinoscope of the 1920s, which swept a line instead of a spot, made the method precise enough to be routine.',
  sources: [
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — retinoscopy, step by step.',
    'W. J. Benjamin (ed.), *Borish\'s Clinical Refraction* — the optics of the reflex and the working-distance lens.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the far point and the optics of the returning beam.'
  ],
  sim: 'op-retinoscopy'
}

,

/* ================================================================ autorefractors and aberrometers */
{
  id: 'autorefractors-and-aberrometers', parent: 'optometry-methods', title: 'Autorefractors and aberrometers', level: 2,
  short: 'An autorefractor sends invisible near-infrared light into the eye and reads what comes back: where two Scheiner beams meet, or how a ring of light is deformed. An aberrometer goes further and measures the whole wavefront leaving the eye with an array of tiny lenses (Shack–Hartmann), giving sphere, cylinder and axis and also the higher-order errors no spectacle lens can correct.',
  keywords: ['autorefractor', 'aberrometer', 'Scheiner', 'Shack-Hartmann', 'wavefront', 'Zernike', 'objective refraction', 'infrared', 'fogging', 'instrument myopia', 'ring image', 'photoscreener', 'higher-order aberrations'],
  prereq: ['retinoscopy', 'aberrations-of-the-eye', 'wavefront-sensors'],
  related: ['wavefront-error-and-zernike-polynomials', 'the-phoropter-and-subjective-refraction', 'accommodation', 'keratometry-and-corneal-topography', 'astigmatism-of-the-eye', 'the-pupil'],
  body: `
Retinoscopy needs a trained examiner. An **autorefractor** does the same job with an infrared beam, detectors and a computer, and in a second or two. An **aberrometer** measures more: not only the sphere and cylinder a lens can correct, but the finer distortions of the wavefront as well.

### How a machine reads the eye
The instrument shines near-infrared light (about 800–900 nm, invisible) onto the retina and analyses the light that comes back out of the pupil. Three ideas are used, alone or together:
- **Scheiner**: two small apertures in the pupil plane pick out two narrow beams. If the retina is conjugate to the source both beams land on the same spot; if the eye is out of focus they land apart, by $P\\,s\\,L$ for a defocus $P$, aperture spacing $s$ and nodal-to-retina distance $L$ = 17 mm. For 1 D and apertures 2 mm apart the spots are 34 µm apart. The instrument moves a lens until the spots merge; the lens setting is the refraction.
- **Retinoscopic**: a streak sweeps across the pupil and detectors time the reflex, as an examiner would.
- **Ring images**: a ring of light is imaged on the retina and the returning ring is analysed: a circle of changed size means sphere, an ellipse means cylinder, and its axis gives the axis.

### Spots and wavefronts
A **Shack–Hartmann** sensor puts an array of tiny lenses in the pupil plane, each forming a spot on a camera. Where the wavefront is tilted, the spot shifts by the local slope times the lenslet's focal length. For a power error $P$ the slope at radius $r$ is $P\\,r$: 6 mrad for 2 D at 3 mm. With lenslets of $f$ = 20 mm the spot moves 120 µm. From all the shifts the instrument fits a smooth surface: the quadratic part is the sphere, cylinder and axis, the rest is the **higher-order aberrations** (coma, spherical aberration, trefoil), often reported as a root-mean-square error in micrometres over a stated pupil. For normal eyes it is a few tenths of a micrometre over a 6 mm pupil.

A sensor has a **dynamic range**: a spot must stay under its own lenslet, so the slope must stay below pitch/(2f). With a pitch of 0.3 mm and f = 20 mm this is 7.5 mrad, about 2.5 D at 3 mm radius; instruments extend it with a movable lens.

### Fogging and instrument myopia
A person who stares at a near target focuses on it (accommodation) and the machine reads too much short-sightedness. Instruments therefore **fog** the target, blurring it by adding plus power, so that the eye relaxes, and the better ones let the person look through into the distance (open field). The reading is repeated, typically several times, and averaged; its scatter says how reliable it is.

### What the printout is
The printout gives sphere, cylinder and axis for each eye. It is a **starting point**. It depends on the pupil (spherical aberration changes the best sphere with pupil size), it can be thrown by a small pupil, a hazy lens or an unsteady fixation, and it agrees with the subjective result within a quarter to half a dioptre for most adults, less well for children and in the presence of large higher-order errors.

> [!note] An autorefractor reading is not a prescription and not a diagnosis; the person measured, the instrument and the interpretation all matter.

> [!key] An autorefractor finds the lens setting at which a beam meets itself; an aberrometer measures the slope of the wavefront at many points, so that sphere, cylinder and higher orders all come from one picture. Both give a starting point for the subjective refraction.
`,
  ideas: [
    'Scheiner principle: two apertures give two beams that meet on the retina only if the eye is in focus; the spots are P·s·L apart otherwise.',
    'A Shack–Hartmann sensor shifts each spot by the local wavefront slope times the lenslet focal length.',
    'Sphere, cylinder and axis are the quadratic part of the wavefront; coma and spherical aberration are the higher orders.',
    'A sensor\'s dynamic range is limited: the spot must stay under its lenslet, so strong errors need a pre-compensating lens.',
    'Instruments fog the target to relax accommodation; the printout is a starting point for the subjective stage.'
  ],
  pitfalls: [
    'The machine measures the prescription — It measures the optical state of the eye under its conditions: pupil, fixation, accommodation. The prescription is chosen afterwards from that and from the person\'s answers.',
    'An aberrometer finds the lens a person should wear — Only the second-order part (sphere, cylinder, axis) can be corrected by a spectacle lens. The higher orders are reported for planning surgery or special lenses.',
    'The infrared light is bright and dangerous — The beam is of low power, kept within eye-safety limits; it is invisible so that the pupil is not driven closed.',
    'Spots shift by the same amount whatever the lenslet — The shift is f times the local slope, so it grows with the focal length and with the power error; it is the *slope* the sensor measures, not the height of the wavefront.'
  ],
  terms: [
    { term: 'Autorefractor', also: ['auto-refractor', 'objective refractor'], def: 'An instrument that measures refractive error automatically from the light returned by the retina, giving sphere, cylinder and axis as a starting point for subjective refraction.' },
    { term: 'Scheiner principle', def: 'Two apertures in the pupil plane select two beams that meet on the retina only if the eye is in focus; the separation of the two spots measures the defocus.' },
    { term: 'Shack–Hartmann sensor', also: ['Hartmann–Shack sensor'], def: 'An array of small lenses, each forming a spot on a camera; the shift of each spot gives the local slope of the wavefront.' },
    { term: 'Aberrometer', def: 'An instrument that measures the wavefront leaving the eye and expresses it as sphere, cylinder, axis and higher-order aberrations (Zernike terms).' },
    { term: 'Higher-order aberrations', also: ['HOA'], def: 'Wavefront errors beyond sphere and cylinder (third and higher Zernike orders: coma, trefoil, spherical aberration), reported as an RMS in micrometres for a stated pupil.' },
    { term: 'Fogging', def: 'Blurring the target with extra plus power so that the person stops accommodating and the eye is measured at rest.' },
    { term: 'Instrument myopia', def: 'A reading that is too short-sighted because the person focused on a close target inside the instrument.' }
  ],
  formulas: [
    {
      name: 'Separation of the two Scheiner spots', expr: 'x = P*s*L', tex: 'x = P\\,s\\,L',
      vars: {
        x: { name: 'separation of the spots on the retina', q: 'length', unit: 'µm', tex: 'x' },
        P: { name: 'defocus of the eye', q: 'optpower', unit: 'D', value: 1, min: 0, max: 8, tex: 'P' },
        s: { name: 'spacing of the two apertures in the pupil', q: 'length', unit: 'mm', value: 2, tex: 's' },
        L: { name: 'nodal point to retina', q: 'length', unit: 'mm', value: 17, tex: 'L' }
      },
      solveFor: 'x', note: 'The angular separation is P·s; multiplied by the 17 mm from the nodal point to the retina it is a distance on the retina.',
      stories: { x: 'An eye is {P} out of focus; the Scheiner apertures are {s} apart. How far apart are the two spots on the retina?', P: 'The two Scheiner spots are {x} apart with apertures {s} apart. What is the eye\'s defocus?' }
    },
    {
      name: 'Shift of a Shack–Hartmann spot', expr: 'u = f*a', tex: 'u = f\\,a',
      vars: {
        u: { name: 'shift of the spot on the sensor', q: 'length', unit: 'µm', tex: 'u' },
        f: { name: 'focal length of a lenslet', q: 'length', unit: 'mm', value: 20, tex: 'f' },
        a: { name: 'local slope of the wavefront', q: 'angle', unit: 'mrad', value: 6, tex: 'a' }
      },
      solveFor: 'u', note: 'For a power error P the slope at radius r is P·r: 2 D at 3 mm gives 6 mrad.'
    },
    {
      name: 'Slope of the wavefront for a power error', expr: 'a = P*r', tex: 'a = P\\,r',
      vars: {
        a: { name: 'slope of the wavefront', q: 'angle', unit: 'mrad', tex: 'a' },
        P: { name: 'power error', q: 'optpower', unit: 'D', value: 2, min: 0, max: 8, tex: 'P' },
        r: { name: 'distance from the centre of the pupil', q: 'length', unit: 'mm', value: 3, tex: 'r' }
      },
      solveFor: 'a', note: 'A spherical wavefront of vergence P tilts by P·r at a height r from the axis.'
    }
  ],
  examples: [
    {
      title: 'Two Scheiner spots',
      q: 'An eye is 1.5 D out of focus. The apertures are 2.5 mm apart. How far apart do the beams land on the retina?',
      steps: [
        { text: 'The two beams cross by an angle $P\\,s = 1.5\\times 2.5\\ \\mathrm{mrad}$ = 3.75 mrad. On the retina, 17 mm from the nodal point:', tex: 'x = 3.75\\times10^{-3}\\times 17\\ \\mathrm{mm} = 64\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 64 µm: a few tens of cones apart, easily detected by the instrument.'
    },
    {
      title: 'A lenslet spot and the range of the sensor',
      q: 'A Shack–Hartmann sensor has lenslets of f = 20 mm and pitch 0.3 mm. How far does a spot move at the edge of a 6 mm pupil for 2 D? And for 3 D? Which is within range?',
      steps: [
        { text: 'The slope at $r$ = 3 mm is $P\\,r$ = 6 mrad for 2 D and 9 mrad for 3 D. The shifts are', tex: 'u = 20\\ \\mathrm{mm}\\times 6\\ \\mathrm{mrad} = 120\\ \\mu\\mathrm{m},\\qquad 20\\times 9 = 180\\ \\mu\\mathrm{m}' },
        'The spot must stay within half the pitch, 150 µm, of its reference.'
      ],
      a: '120 µm is within range; 180 µm is not, so 3 D at the edge of the pupil needs a pre-compensating lens.'
    }
  ],
  quiz: [
    { q: 'In the Scheiner principle, the two spots coincide when…', choices: ['the pupil is small', 'the retina is conjugate to the source: the eye is in focus for it', 'the apertures are wide apart', 'the light is infrared'], a: 1, why: 'Two beams from a point that the eye focuses on the retina meet there. If the eye is out of focus they cross before or beyond it and land apart.' },
    { q: 'An aberrometer\'s output includes higher-order aberrations that spectacle lenses can correct.', a: false, why: 'Spectacle lenses correct sphere and cylinder, the quadratic part of the wavefront. Coma, spherical aberration and the other higher orders are beyond them.' },
    { q: 'A Shack–Hartmann sensor with lenslets of f = 20 mm sees a spot move 90 µm. What is the local wavefront slope, in mrad?', answer: 4.5, unit: 'mrad', why: 'Slope = shift ÷ focal length = 90 µm ÷ 20 mm = 4.5 mrad.' },
    { q: 'Which change gives a Shack–Hartmann sensor a larger dynamic range?', choices: ['A longer lenslet focal length', 'A larger lenslet pitch with the same focal length', 'A smaller pupil only', 'A brighter beam'], a: 1, why: 'The spot must stay under its lenslet: the limit is the slope pitch/(2f). A larger pitch or a shorter focal length allows a bigger slope, at the cost of sensitivity or of fewer samples.' },
    { q: 'Why does an autorefractor fog its target?', choices: ['To make the reading brighter', 'To relax accommodation so the eye is measured at rest', 'To measure the cornea', 'Because infrared light is invisible'], a: 1, why: 'A person who looks at a close, sharp target accommodates and the reading comes out too short-sighted (instrument myopia). Blurring the target with plus power lets the eye relax.' }
  ],
  applications: [
    'The objective starting point of nearly every refraction in an eye clinic.',
    'Screening young children with photoscreeners, which use the same retinal reflex from a distance.',
    'Planning wavefront-guided laser vision correction, which uses the full wavefront map.',
    'Research on the eye\'s aberrations and on adaptive optics that correct them for retinal imaging.',
    'Following how the optics change after surgery or with age.'
  ],
  history: 'Christoph Scheiner described his two-pinhole experiment in 1619. Johannes Hartmann devised his test with a perforated screen in 1900; Roland Shack and Ben Platt replaced the holes with lenslets around 1971. Commercial autorefractors appeared in the 1970s, and Liang, Grimm, Goelz and Bille measured the eye\'s wave aberration with a Hartmann–Shack sensor in 1994.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the aberrations of the eye and their measurement.',
    'B. C. Platt and R. Shack, "History and principles of Shack–Hartmann wavefront sensing", *Journal of Refractive Surgery* 17 (2001).',
    'J. Liang, B. Grimm, S. Goelz and J. F. Bille, "Objective measurement of wave aberrations of the human eye with the use of a Hartmann–Shack wave-front sensor", *Journal of the Optical Society of America A* 11 (1994).',
    'L. N. Thibos et al., "Statistical variation of aberration structure and image quality in a normal population of healthy eyes", *Journal of the Optical Society of America A* 19 (2002).'
  ],
  sim: 'op-hartmann'
}

,

/* ================================================================ the phoropter and subjective refraction */
{
  id: 'the-phoropter-and-subjective-refraction', parent: 'optometry-methods', title: 'The phoropter and subjective refraction', level: 2,
  short: 'The objective stage gives a number; the subjective stage asks the person which lens looks clearer. A phoropter holds wheels of lenses that change in steps of 0.25 D. The examiner fogs the chart, reduces plus step by step to the most plus that gives the best acuity, refines the cylinder, checks with red and green, balances the two eyes and, for near, adds a reading power.',
  keywords: ['phoropter', 'refractor', 'subjective refraction', 'trial frame', 'trial lenses', 'fogging', 'maximum plus', 'best sphere', 'binocular balance', 'reading addition', 'refraction sequence', 'endpoint', 'prescription'],
  prereq: ['retinoscopy', 'reading-a-prescription', 'accommodation'],
  related: ['cross-cylinder-and-duochrome', 'cylinder-axis-and-transposition', 'vertex-distance-and-effective-power', 'presbyopia', 'visual-acuity-charts', 'cover-test-and-binocular-balance', 'myopia', 'hyperopia'],
  body: `
Objective refraction gives a number. The **subjective** stage asks the person: *which is clearer, one or two?* The instrument is a **phoropter** (a refractor): a mask held before the eyes that contains wheels of spheres and cylinders, so that any combination in steps of 0.25 D is a click away. A **trial frame**, into which loose lenses are dropped, does the same job when a child, a very strong lens or an awkward posture makes the machine unsuitable.

### What is inside
Sphere wheels (roughly ±16 to ±19 D, by a coarse and a fine dial), cylinder wheels with an axis ring, rotary (Risley) prisms, **cross cylinders**, occluders, a pinhole, a Maddox rod, red, green and polarizing filters. The unit is set to the person's pupil distance and sits about 12–14 mm in front of the cornea, so the numbers are for a lens at about that **vertex distance** ([[vertex-distance-and-effective-power]]).

### The sequence
| Step | Aim | How |
|---|---|---|
| 1 | a starting point | autorefractor or [[retinoscopy]] result, or the old glasses |
| 2 | sphere, one eye at a time | fog, then reduce plus until acuity is best |
| 3 | cylinder | axis, then power, with the [[cross-cylinder-and-duochrome|cross cylinder]] |
| 4 | sphere again | the red–green test |
| 5 | both eyes together | balance by prism dissociation |
| 6 | near | a reading addition from a card at the working distance |

### Fogging and "the most plus"
Acuity is almost symmetric about the best sphere: a lens 0.50 D too weak and one 0.50 D too strong blur the chart about equally. But an eye can *accommodate* away the excess of minus and still read 6/6, with effort; it cannot remove excess plus. So the aim is the **maximum plus (or least minus) that gives the best acuity**, and the examiner starts with a **fog**: about +1.00 to +1.50 D beyond the expected power, which blurs the chart to roughly 20/80–20/125 and cannot be cleared by focusing. Plus is then taken off in 0.25 D steps and the chart sharpens at each step. By the rule of thumb for a 4 mm pupil: 1.00 D of residual defocus ≈ 20/80, 0.75 D ≈ 20/60, 0.50 D ≈ 20/45, 0.25 D ≈ 20/30, nothing ≈ 20/20.

### Balancing the two eyes
Each eye is refracted alone; then they must be equally clear *together*. Two small prisms of a few prism dioptres, one base-up and one base-down, split the view vertically so that each eye sees its own chart at the same moment; the examiner adds plus to the clearer one until the two look alike.

### Near
For the near addition the person reads a card at their own reading distance. Typical starting values rise with age: **+0.75 D at 40, +1.25 D at 45, +1.75 D at 50, +2.25 D at 55 and about +2.50 D from 60**; the amplitude of accommodation and the working distance decide the final value ([[presbyopia]]).

### A judgement, not a measurement
Steps below 0.25 D are hardly perceptible. The strict result is sometimes adjusted for comfort, for how the lenses will be used, or for a person who has never worn a cylinder; the prescription is the examiner's decision, taken with the person's answers.

> [!note] This page describes how practitioners reach a prescription. It is not a recipe for choosing glasses.

> [!key] Subjective refraction starts from the objective result and refines it with the person's answers: the most plus for the best acuity, the cylinder by the cross cylinder, the sphere by red–green, then both eyes in balance and the near addition.
`,
  ideas: [
    'A phoropter holds wheels of lenses in 0.25 D steps; a trial frame does the same with loose lenses.',
    'The aim for the sphere is the most plus (or least minus) that gives the best acuity, because accommodation can hide excess minus.',
    'Fogging blurs the chart to about 20/80 so that focusing cannot help; plus is then removed in 0.25 D steps.',
    'The sequence runs: sphere, cylinder axis and power, sphere again, binocular balance, near addition.',
    'The prescription is a judgement taken from the measurements and the person\'s answers.'
  ],
  pitfalls: [
    'A lens that makes the chart as sharp as possible is the right lens — Both too much plus and too much minus can blur, but an eye can hide too much minus by focusing harder. The right lens is the most plus that gives the best acuity.',
    'Each lens change of 0.25 D is a big, obvious step — A step of 0.25 D changes a defocused chart by about one line at most and may be hard to judge; that is why the examiner asks several times and uses other cues.',
    'The phoropter reads the prescription off the eye — It only holds lenses; every number is the result of the person\'s choices and the examiner\'s decisions.',
    'The reading addition is the same for everyone of a given age — Age gives a typical starting point; the actual value depends on the amplitude of accommodation and the working distance.'
  ],
  terms: [
    { term: 'Phoropter', also: ['refractor', 'refracting unit'], def: 'An instrument holding wheels of sphere and cylinder lenses, prisms and filters, set before the eyes so that combinations can be changed in 0.25 D steps.' },
    { term: 'Subjective refraction', def: 'Finding the lens the person finds clearest by asking them to choose between alternatives, starting from an objective result.' },
    { term: 'Fogging', def: 'Adding plus power to blur the chart on purpose so that accommodation cannot clear it; plus is then reduced stepwise to the best acuity.' },
    { term: 'Maximum plus to best visual acuity', also: ['MPMVA'], def: 'The sphere endpoint: the most positive (least negative) sphere that gives the best acuity, which avoids over-minusing an eye that can accommodate.' },
    { term: 'Binocular balance', def: 'Making the two eyes equally clear together, often by splitting the view with prisms so that each eye sees its own chart.' },
    { term: 'Reading addition', also: ['add'], def: 'The extra plus power for near work, in dioptres, added to the distance prescription for people with presbyopia.' },
    { term: 'Vertex distance', def: 'The distance from the back of a lens to the front of the cornea; a prescription is specified for a lens at a stated vertex distance.' }
  ],
  formulas: [
    {
      name: 'Spherical equivalent', expr: 'M = S + C/2', tex: 'M = S + \\frac{C}{2}',
      vars: {
        M: { name: 'spherical equivalent', q: 'optpower', unit: 'D', signed: true, tex: 'M' },
        S: { name: 'sphere', q: 'optpower', unit: 'D', signed: true, value: -2.25, tex: 'S' },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', signed: true, value: -0.75, tex: 'C' }
      },
      solveFor: 'M', note: 'The mean power of a sphero-cylindrical lens: the sphere that blurs the chart as little as possible.'
    },
    {
      name: 'Power along a meridian', expr: 'P = S + C*sin(t - A)^2', tex: 'P = S + C\\sin^2(\\theta - A)',
      vars: {
        P: { name: 'power along the meridian', q: 'optpower', unit: 'D', signed: true, tex: 'P' },
        S: { name: 'sphere', q: 'optpower', unit: 'D', signed: true, value: -2.25, tex: 'S' },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', signed: true, value: -0.75, tex: 'C' },
        t: { name: 'meridian measured', q: 'angle', unit: '°', value: 120, min: 0, max: 180, tex: '\\theta' },
        A: { name: 'axis of the cylinder', q: 'angle', unit: '°', value: 170, min: 0, max: 180, tex: 'A' }
      },
      solveFor: 'P', note: 'Along the axis the lens has only its sphere; across it the full sphere plus cylinder.'
    }
  ],
  examples: [
    {
      title: 'Powers of a prescription',
      q: 'A prescription reads −2.25 −0.75 × 180. What is the power along the horizontal, the vertical and the 45° meridians, and the spherical equivalent?',
      steps: [
        'The axis is 180°, the horizontal meridian, so along it only the sphere acts: −2.25 D.',
        { text: 'Across the axis (vertical, 90° from it) the cylinder adds fully: $-2.25 - 0.75 = -3.00$ D. At 45° to the axis:', tex: 'P = -2.25 - 0.75\\sin^2 45^\\circ = -2.625\\ \\mathrm{D}' },
        { text: 'The spherical equivalent is the same as the power at 45°:', tex: 'M = -2.25 + \\tfrac{-0.75}{2} = -2.625\\ \\mathrm{D}' }
      ],
      a: '−2.25 D horizontally, −3.00 D vertically, −2.625 D at 45° and as the spherical equivalent.'
    },
    {
      title: 'Taking off the fog',
      q: 'A person needs −2.25 D. The examiner starts with −1.25 D (fog 1.00 D) and adds minus in 0.25 D steps. What acuity does the rule of thumb predict at each step?',
      steps: [
        'The residual defocus is 1.00, 0.75, 0.50, 0.25 and 0 D.',
        'By the rule for a 4 mm pupil the acuities are about 20/80, 20/60, 20/45, 20/30 and 20/20.'
      ],
      a: 'Each 0.25 D step moves the chart about one line, which is why the last two steps need care.'
    }
  ],
  quiz: [
    { q: 'Which error can a young person hide by focusing harder?', choices: ['A lens with too much plus', 'A lens with too much minus', 'Neither', 'Both equally'], a: 1, why: 'Too much minus makes the image focus behind the retina, which accommodation (adding plus) can pull back. Too much plus puts the focus in front of the retina and focusing cannot remove it.' },
    { q: 'The aim of the sphere endpoint is the…', choices: ['most minus giving best acuity', 'most plus giving best acuity', 'strongest lens the person tolerates', 'lens that matches the old glasses'], a: 1, why: 'Because over-minus can be hidden by accommodation, the safe endpoint is the maximum plus (least minus) that still gives the best acuity.' },
    { q: 'A prescription is −1.00 −2.00 × 90. How many dioptres of minus power does it have along the horizontal (180°) meridian?', answer: 3, unit: 'D', why: 'The axis is vertical (90°), so the cylinder acts across it, along the horizontal meridian: −1.00 − 2.00 = −3.00 D.' },
    { q: 'During fogging the chart should look sharp.', a: false, why: 'The point of the fog is a deliberate blur (about 20/80) that accommodation cannot clear; it is cleared step by step by reducing plus.' },
    { q: 'Why do the two eyes see separate charts during balance with prisms?', choices: ['The prisms are tinted', 'Base-up on one eye and base-down on the other displace the two images vertically', 'Each eye is covered in turn', 'The chart is printed twice'], a: 1, why: 'Prisms of a few dioptres in opposite directions shift the two retinal images apart, so the images cannot fuse and each eye can be compared at the same moment.' }
  ],
  applications: [
    'The prescription for spectacles, written as sphere, cylinder × axis and addition for each eye.',
    'The over-refraction on top of a trial contact lens.',
    'Assessing how much acuity can be restored in a person with low vision.',
    'The cycloplegic refraction of children, where the same steps are done with the focusing muscle relaxed.',
    'Research trials, which define their endpoints by a standard refraction protocol.'
  ],
  history: 'Franciscus Donders\'s book of 1864 gave the language of refractive error (myopia, hyperopia, astigmatism, presbyopia) and a systematic way to find it with trial lenses. Combined refracting units with rotating lens discs became common in the first half of the twentieth century and replaced the trial case for most work.',
  sources: [
    'W. J. Benjamin (ed.), *Borish\'s Clinical Refraction* — the sequence, fogging and the sphere endpoint.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — subjective refraction and binocular balance.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — defocus, depth of focus and the effect of pupil size.',
    'F. C. Donders, *On the Anomalies of Accommodation and Refraction of the Eye* (New Sydenham Society, 1864).'
  ],
  sim: 'op-refraction'
}

,

/* ================================================================ cross cylinder and duochrome */
{
  id: 'cross-cylinder-and-duochrome', parent: 'optometry-methods', title: 'The cross cylinder and the duochrome test', level: 3,
  short: 'Two quick comparisons refine a refraction. The Jackson cross cylinder, a ±0.25 D lens flipped before the eye, tells which way to turn the cylinder axis and whether to change its power. The red–green test uses the eye\'s own chromatic aberration, about 0.6 D between green and red, to tell whether the sphere is too minus or too plus.',
  keywords: ['Jackson cross cylinder', 'cross cylinder', 'duochrome', 'bichrome', 'red-green test', 'chromatic aberration', 'axis refinement', 'cylinder power', 'blur strength', 'power vector', 'one or two', 'astigmatism refinement'],
  prereq: ['the-phoropter-and-subjective-refraction', 'astigmatism-of-the-eye', 'axial-chromatic-aberration'],
  related: ['cylinder-axis-and-transposition', 'dispersion-and-the-spectrum', 'aberrations-of-the-eye', 'colour-vision-deficiency', 'cylindrical-and-toric-lenses', 'reading-a-prescription'],
  body: `
Once the sphere is close and a cylinder has been found, two quick comparisons do the fine work. Both ask the same question — *which is clearer?* — but each is built so that the answer carries a direction.

### The Jackson cross cylinder
A **cross cylinder** is a lens with $+0.25$ D along one meridian and $-0.25$ D along the meridian at right angles: a **±0.25 D** lens, optically a sphere of 0.25 D with a cylinder of 0.50 D of the other sign, and with a spherical equivalent of zero. On its handle it is **flipped**, which swaps the two meridians. Marks show the minus axis (red) and the plus axis (white). It is used in two ways.
- **For the axis**, its axes are placed at 45° to the trial cylinder axis. If the trial axis is right, the flip adds an error in one direction and removes the same error in the other, and both positions look alike. If the axis is wrong, one position leaves a smaller residual than the other. By convention (for a minus cylinder) the examiner turns the axis toward the minus axis of the preferred position, in smaller steps as the answers draw together.
- **For the power**, its axes lie along the trial cylinder axis. One position adds 0.50 D of cylinder effect and the other removes it. If the position that adds minus is preferred, the cylinder is increased by 0.25 D; if the other, decreased. To keep the spherical equivalent, the sphere moves by half the change in cylinder.

### Why one position is clearer: blur strength
An astigmatic residual is not a single number but a **vector**: a mean error $M$ (the spherical equivalent) and a cylinder $C$ whose length $|C|/2$ points at twice its axis. Its overall effect on sharpness is the **blur strength**

$$B = \\sqrt{M^2 + \\left(\\frac{C}{2}\\right)^2}$$

A cross cylinder of ±0.25 D adds a vector of length 0.25 D to the residual in one flip and subtracts it in the other. The flip that makes the resulting vector shorter gives the smaller $B$ and the clearer chart. In the simulation, a cylinder axis 20° out gives $B$ = 0.50 D in one position and 0.09 D in the other; at 180° the two are equal.

### Red and green: the eye's own chromatic aberration
The eye does not focus all colours together: short wavelengths focus nearer the lens. Over the visible spectrum the difference is about 2 D; in the schematic eye the power is 61.2 D at 450 nm and 59.4 D at 700 nm, and between green (532 nm) and red (620 nm) it is **0.58 D**. A chart with the same letters on a green half and a red half therefore shows one half in focus a little in front of the other.

If the sphere is right, the retina lies between the two focal positions, each about 0.3 D away, and the halves look **equally blurred**. If the eye is relatively too short-sighted for the lens (focus in front of the retina) the red focus is the nearer to the retina and **red is clearer**; if the focus is behind the retina **green is clearer**. By convention red clearer calls for more minus (or less plus), green clearer for less minus (or more plus). The judgement is of sharpness, not hue, so the test is often still possible for people with a colour-vision deficiency.

> [!note] These are the conventions a trained examiner applies; they are explained here, not offered as a way to refine glasses.

> [!key] A cross cylinder adds and removes the same small vector of blur, so the flip that shortens the residual wins; the red–green test uses the eye's 0.6 D of chromatic aberration so that the clearer half says which way the sphere is wrong.
`,
  ideas: [
    'A Jackson cross cylinder is ±0.25 D: a sphere of 0.25 D with a cylinder of 0.50 D of the other sign, spherical equivalent zero.',
    'For the axis it is placed 45° off the cylinder axis; for the power, along it.',
    'Blur strength B = √(M² + (C/2)²) combines the sphere and cylinder errors; the clearer position has the smaller B.',
    'The eye\'s chromatic aberration is about 2 D across the visible and 0.6 D between green and red.',
    'In the red–green test, red clearer means the focus is in front of the retina; green clearer, behind it.'
  ],
  pitfalls: [
    'The cross cylinder changes the average power of the lens — Its spherical equivalent is zero: it only redistributes power between two meridians, adding the same amount of blur in a direction in one flip and the opposite in the other.',
    'When the two positions look alike, the answer is not known — Equal clarity at 45° to the axis means the axis is right; equal clarity along the axis means the cylinder power is right. It is the aim, not a failure.',
    'Red and green only work for people who see colours normally — The test compares sharpness, which a person with a colour-vision deficiency can judge, though red and green may look different to them.',
    'The red–green test measures the person\'s own chromatic aberration — It uses the average chromatic aberration of the eye, which varies little between people; it is not measured separately.'
  ],
  terms: [
    { term: 'Jackson cross cylinder', also: ['cross cylinder', 'crossed cylinder', 'JCC'], def: 'A ±0.25 D (sometimes ±0.50 D) lens on a flipping handle: +0.25 D along one meridian and −0.25 D along the meridian at right angles, with a mean power of zero.' },
    { term: 'Blur strength', def: 'The overall effect on sharpness of a residual error: the square root of M² + (C/2)², with M the spherical equivalent and C the cylinder of the residual.' },
    { term: 'Duochrome test', also: ['bichrome test', 'red–green test'], def: 'A chart with letters on a red half and a green half, used to find whether the sphere is too minus or too plus from which half is clearer.' },
    { term: 'Longitudinal chromatic aberration of the eye', also: ['LCA', 'ocular chromatic aberration'], def: 'The difference in focus between wavelengths in the eye: about 2 D across the visible and 0.6 D between green and red.' },
    { term: 'Power vector', also: ['M, J0, J45'], def: 'A way of writing sphere, cylinder and axis as three numbers (spherical equivalent M and two cross-cylinder components J0 and J45) so that they can be added and averaged.' }
  ],
  formulas: [
    {
      name: 'Blur strength of a residual error', expr: 'B = sqrt(M^2 + (C/2)^2)', tex: 'B = \\sqrt{M^2 + \\left(\\frac{C}{2}\\right)^2}',
      vars: {
        B: { name: 'blur strength', q: 'optpower', unit: 'D', tex: 'B' },
        M: { name: 'spherical equivalent of the residual', q: 'optpower', unit: 'D', signed: true, value: -0.25, tex: 'M' },
        C: { name: 'cylinder of the residual', q: 'optpower', unit: 'D', signed: true, value: -0.5, tex: 'C' }
      },
      solveFor: 'B', note: 'Zero when the lens is exactly right; the same for a residual sphere of +0.5 D as for −0.5 D.'
    },
    {
      name: 'Blur disc on the retina', expr: 'b = P*p', tex: 'b = P\\,p',
      vars: {
        b: { name: 'angular diameter of the blur disc', q: 'angle', unit: '′', tex: 'b' },
        P: { name: 'defocus', q: 'optpower', unit: 'D', value: 0.5, min: 0, max: 6, tex: 'P' },
        p: { name: 'pupil diameter', q: 'length', unit: 'mm', value: 4, tex: 'p' }
      },
      solveFor: 'b', note: 'For a round pupil the blur disc is the image of the pupil: its angle is the defocus times the pupil diameter.'
    }
  ],
  examples: [
    {
      title: 'Blur strength of a cylinder error',
      q: 'The residual after a refraction is a cylinder of −0.50 D with the sphere exactly balanced so that the sphere is zero. What is the blur strength?',
      steps: [
        { text: 'The spherical equivalent of the residual is $M = 0 + (-0.50)/2 = -0.25$ D.', tex: 'B = \\sqrt{(-0.25)^2 + (-0.25)^2} = 0.354\\ \\mathrm{D}' }
      ],
      a: '0.35 D: as blurring as a pure sphere error of 0.35 D, although no part of the lens is off by more than 0.5 D.'
    },
    {
      title: 'Red and green with a sphere that is too weak',
      q: 'A person needs −2.25 D but has −1.75 D in front of the eye, so the residual is −0.50 D. Taking half the green–red chromatic difference as 0.29 D, which half of the chart is clearer, and what are the blur discs for a 4 mm pupil?',
      steps: [
        'For green light the eye is 0.29 D more short-sighted: the residual is $-0.50 - 0.29 = -0.79$ D. For red it is $-0.50 + 0.29 = -0.21$ D.',
        { text: 'The blur discs for a 4 mm pupil, $b = P\\,p$:', tex: 'b_{\\mathrm{green}} = 0.79\\times 4\\ \\mathrm{mrad} = 3.2\\ \\mathrm{mrad} = 10.9\',\\qquad b_{\\mathrm{red}} = 0.21\\times 4\\ \\mathrm{mrad} = 2.9\'' }
      ],
      a: 'Red is clearer (2.9′ against 10.9′), as expected when the focus lies in front of the retina.'
    }
  ],
  quiz: [
    { q: 'With the cross cylinder\'s axes at 45° to the trial cylinder axis the two positions look alike. This means…', choices: ['the axis is right', 'the power is right', 'the sphere is right', 'the test cannot be done'], a: 0, why: 'At 45° the flip alters only the axis-related part of the residual. If the axis is right both flips add and remove equal amounts and look alike.' },
    { q: 'In the red–green test the red half is clearer. The focus lies…', choices: ['in front of the retina', 'behind the retina', 'on the retina', 'nowhere: the test is invalid'], a: 0, why: 'Red focuses farthest from the lens. With the focus in front of the retina the red focal point is the one closest to the retina, so red is the sharper half.' },
    { q: 'The residual after a refraction is a cylinder of −1.00 D with zero sphere. Find the blur strength, in dioptres.', answer: 0.71, unit: 'D', why: 'M = −0.50 and C/2 = −0.50: B = √(0.25 + 0.25) = 0.707 D.' },
    { q: 'Flipping a ±0.25 D cross cylinder changes the average power (spherical equivalent) of the lens.', a: false, why: 'The two meridians have +0.25 D and −0.25 D: the mean is zero in both positions. Only the distribution of power between meridians changes.' },
    { q: 'Why does the duochrome test work at all?', choices: ['Red and green filters change the pupil size', 'The eye focuses green light about 0.6 D nearer the lens than red', 'Colours are processed in different parts of the brain', 'Red light is brighter than green'], a: 1, why: 'Longitudinal chromatic aberration separates the red and green focal points by about 0.6 D, so which half is sharper depends on where the retina lies relative to them.' }
  ],
  applications: [
    'Refining the axis and the power of a cylinder in an astigmatic prescription.',
    'Checking a sphere from the red–green view before the final prescription.',
    'Detecting over-minus in young people who accommodate, because green looks clearer.',
    'Over-refraction with trial contact lenses.',
    'Research on blur: the power-vector way of writing a refraction (M, J0, J45) comes from the same geometry.'
  ],
  history: 'The crossed cylinder was introduced by Edward Jackson of Philadelphia in 1887 and has been the standard refinement of a cylinder since. The red–green test grew out of the nineteenth-century study of chromatic aberration in the eye and became routine in the first half of the twentieth century.',
  sources: [
    'W. J. Benjamin (ed.), *Borish\'s Clinical Refraction* — the cross cylinder and the red–green test.',
    'L. N. Thibos, W. Wheeler and D. Horner, "Power vectors: an application of Fourier analysis to the description and statistical analysis of refractive error", *Optometry and Vision Science* 74 (1997).',
    'L. N. Thibos, M. Ye, X. Zhang and A. Bradley, "The chromatic eye: a new reduced-eye model of ocular chromatic aberration in humans", *Applied Optics* 31 (1992).',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — refinement of the cylinder.'
  ],
  sim: [
    { id: 'op-refraction', title: 'The cross cylinder: which flip is clearer?', params: { mode: 'cross', pat: 0, sph: -2.25, cyl: -0.75, axis: 160 } },
    { id: 'op-refraction', title: 'Red and green: which half is clearer?', params: { mode: 'duo', pat: 0, sph: -1.75, cyl: -0.75, axis: 180 } }
  ]
}

,

/* ================================================================ keratometry and topography */
{
  id: 'keratometry-and-corneal-topography', parent: 'optometry-methods', title: 'Keratometry and corneal topography', level: 2,
  short: 'The front of the cornea is a small convex mirror, radius about 7.8 mm, and the image of a lit target reflected in it is smaller the steeper the surface. A keratometer reads the size of that image along two meridians and reports the curvature as a power, K = (1.3375 − 1)/R, about 43 D; a topographer reads rings or slit sections over the whole surface and draws a map.',
  keywords: ['keratometry', 'keratometer', 'ophthalmometer', 'corneal topography', 'Placido', 'mire', 'K reading', 'steep meridian', 'flat meridian', 'corneal astigmatism', 'Scheimpflug', 'tomography', 'keratometric index', 'corneal map'],
  prereq: ['curved-mirrors', 'the-mirror-equation', 'the-eye-as-a-camera'],
  related: ['keratoconus-and-corneal-shape', 'astigmatism-of-the-eye', 'contact-lenses', 'intraocular-lenses-and-refractive-surgery', 'refraction-at-a-curved-surface', 'specular-and-diffuse-reflection'],
  body: `
Hold a shiny spoon up and a window is reflected in it, small and upright. The cornea is the same kind of mirror: a **convex mirror** of radius about 7.8 mm. The image of a lit target in it is a **virtual** image just behind the surface, and its size depends on the radius: the steeper the cornea, the smaller the image. Measuring the image measures the cornea.

### The mirror and the number
For a convex mirror of radius $R$ the focal length is $R/2$, and a target at distance $d$ has an image of lateral magnification

$$m = \\frac{R/2}{d + R/2}$$

For $R$ = 7.8 mm and a target 75 mm away $m$ = 0.049: a ring 60 mm across has an image 2.97 mm across, 3.7 mm behind the surface. A **keratometer** measures that image size (its two meridians, usually with the image doubled so that eye movements do not matter), solves for $R$, and reports it as a power with a conventional **keratometric index** of 1.3375:

$$K = \\frac{1.3375 - 1}{R} = \\frac{337.5}{R\\,[\\mathrm{mm}]}$$

| R (mm) | 7.2 | 7.5 | 7.8 | 8.1 | 8.4 |
|---|---|---|---|---|---|
| K (D) | 46.9 | 45.0 | 43.3 | 41.7 | 40.2 |

The index is a compromise. The real front surface has a power of about 48.5 D, the back of the cornea −6.1 D, and the pair (with the cornea's thickness) about 42.4 D; the fictitious index lets the front radius alone give a number close to the true total.

### Two meridians
The cornea is rarely a sphere. A keratometer reports **K1** (the flattest meridian, with its axis) and **K2** (the steepest, 90° from it for a regular cornea). Their difference is the **corneal astigmatism**: K1 = 42.50 D at 180° and K2 = 44.25 D at 90° is 1.75 D, steep vertically, "with the rule". Young eyes are mostly with the rule; against the rule becomes more common with age. The measurement is taken on a ring about 3 mm across and says nothing about the rest.

### Topography: the whole surface
A **Placido** disc is a set of concentric bright rings, drawn on a cone or a bowl in front of the eye. A camera records their reflection on the cornea; where the surface is steeper the ring images crowd together, where it is flatter they spread. Software turns thousands of ring points into a **map**, usually drawn with warm colours for steep and cool for flat. A regular astigmatism gives a *bow tie*; a local steepening shows as an island of warm colour. **Scheimpflug** systems photograph a rotating slit through the cornea, so that they see the back surface and the thickness too (a typical central thickness is 0.54 mm) and give elevation maps. The ring pattern also tells about the tear film: a smooth surface gives clean rings.

### What the numbers are used for
Fitting contact lenses, choosing the power of an intraocular lens (K is an input to the formulas), planning and checking refractive surgery, and following diseases in which the shape changes ([[keratoconus-and-corneal-shape]]).

> [!note] A curvature map shows shape. What it means for a particular eye is a clinical judgement, which this page does not offer.

> [!key] The cornea is a convex mirror, so the image of a target in it shrinks as the surface steepens: R = 2dm/(1 − m), K = 337.5/R. A keratometer reads two meridians on a ring about 3 mm across; a topographer maps the whole surface.
`,
  ideas: [
    'The front of the cornea is a convex mirror of R ≈ 7.8 mm; a target\'s virtual image is smaller the steeper the cornea.',
    'Keratometric power K = 337.5/R (mm) uses the index 1.3375: 7.8 mm is 43.3 D.',
    'K1 and K2 are the flattest and steepest meridians; their difference is the corneal astigmatism.',
    'A Placido disc shows ring images that crowd together where the surface is steeper; software draws the map.',
    'Scheimpflug and OCT systems also see the back surface and the thickness.'
  ],
  pitfalls: [
    'K is the whole power of the cornea — K uses a fictitious index (1.3375) to give a close estimate from the front surface alone. The front surface is about 48.5 D and the back about −6.1 D; the total is near 42 D.',
    'A keratometer measures the whole cornea — It measures a ring about 3 mm across on two meridians. The centre, the periphery and irregular shape need topography.',
    'Steep means high refractive error — K is the corneal curvature. Whether the eye is short- or long-sighted depends on its length and lens too; a steep cornea can sit on a short eye.',
    'The colours on a map are absolute — Colour scales differ between instruments and settings, so the same cornea can look different; the numbers matter, not the colours.'
  ],
  terms: [
    { term: 'Keratometry', also: ['ophthalmometry', 'K reading'], def: 'Measuring the curvature of the central cornea from the size of the image of a target reflected in it, reported as radius (mm) or keratometric power (D).' },
    { term: 'Keratometric index', also: ['1.3375'], def: 'A conventional refractive index (1.3375) that turns the front-surface radius into a power, K = (n − 1)/R, which is close to the cornea\'s true total power.' },
    { term: 'K1 and K2', also: ['flat K', 'steep K'], def: 'The keratometric power of the flattest and the steepest meridian, with their axes. K2 − K1 is the corneal astigmatism.' },
    { term: 'Mire', def: 'The lit target (rings, a cross or a pair of squares) whose reflection in the cornea a keratometer or topographer measures.' },
    { term: 'Placido disc', also: ['keratoscope'], def: 'A target of concentric bright and dark rings, used to see the shape of the cornea from the distortion of its reflection.' },
    { term: 'Corneal topography', also: ['videokeratography'], def: 'A map of corneal curvature or elevation over the whole surface, computed from reflected rings or from slit sections.' },
    { term: 'With the rule', also: ['against the rule'], def: 'Corneal astigmatism whose steepest meridian is near vertical (with the rule) or near horizontal (against the rule).' }
  ],
  formulas: [
    {
      name: 'Keratometric power', expr: 'K = (nk - 1)/R', tex: 'K = \\frac{n_k - 1}{R}',
      vars: {
        K: { name: 'keratometric power', q: 'optpower', unit: 'D', tex: 'K' },
        nk: { name: 'keratometric index', value: 1.3375, min: 1.3, max: 1.4, tex: 'n_k' },
        R: { name: 'radius of curvature of the front surface', q: 'length', unit: 'mm', value: 7.8, tex: 'R' }
      },
      solveFor: 'K', note: 'With the conventional index, K in dioptres is 337.5 divided by R in millimetres.',
      stories: { K: 'The front of a cornea has a radius of {R}. What is its keratometric power, with an index of {nk}?', R: 'A keratometer reads {K}. What is the radius of the front surface?' }
    },
    {
      name: 'Magnification of the reflected mire', expr: 'm = (R/2)/(d + R/2)', tex: 'm = \\frac{R/2}{d + R/2}',
      vars: {
        m: { name: 'magnification of the virtual image', tex: 'm' },
        R: { name: 'radius of the cornea', q: 'length', unit: 'mm', value: 7.8, tex: 'R' },
        d: { name: 'distance of the mire from the cornea', q: 'length', unit: 'mm', value: 75, tex: 'd' }
      },
      solveFor: 'm', note: 'For a distant mire this tends to R/(2d). Solving for R gives R = 2dm/(1 − m), the keratometer\'s principle.'
    },
    {
      name: 'Corneal astigmatism', expr: 'A = K2 - K1', tex: 'A = K_2 - K_1',
      vars: {
        A: { name: 'corneal astigmatism', q: 'optpower', unit: 'D', tex: 'A' },
        K2: { name: 'steep meridian', q: 'optpower', unit: 'D', value: 44.25, tex: 'K_2' },
        K1: { name: 'flat meridian', q: 'optpower', unit: 'D', value: 42.5, tex: 'K_1' }
      },
      solveFor: 'A', note: 'The steep meridian near 90° is "with the rule"; near 180°, "against the rule".'
    }
  ],
  examples: [
    {
      title: 'From radius to power',
      q: 'The front of a cornea has a radius of 7.80 mm. What is its keratometric power? How big is the image of a 60 mm ring seen from 75 mm?',
      steps: [
        { text: 'Power:', tex: 'K = \\frac{337.5}{7.80} = 43.27\\ \\mathrm{D}' },
        { text: 'Magnification of the mirror image:', tex: 'm = \\frac{3.90}{75 + 3.90} = 0.0494,\\qquad 60\\ \\mathrm{mm}\\times 0.0494 = 2.97\\ \\mathrm{mm}' }
      ],
      a: '43.3 D, and an image of 2.97 mm: a keratometer that measures it to 0.01 mm resolves the radius to about 0.03 mm.'
    },
    {
      title: 'A keratometer reading',
      q: 'A keratometer reports K1 = 42.50 D at 180° and K2 = 44.25 D at 90°. What are the corneal astigmatism, its type, and the two radii?',
      steps: [
        'Astigmatism: $44.25 - 42.50 = 1.75$ D.',
        'The steep meridian is vertical (90°): with the rule.',
        { text: 'Radii:', tex: 'R_1 = \\frac{337.5}{42.50} = 7.94\\ \\mathrm{mm},\\qquad R_2 = \\frac{337.5}{44.25} = 7.63\\ \\mathrm{mm}' }
      ],
      a: '1.75 D with the rule; radii 7.94 mm (flat, horizontal) and 7.63 mm (steep, vertical).'
    }
  ],
  quiz: [
    { q: 'The image of a target in the cornea is…', choices: ['real and inverted', 'virtual, upright and smaller than the target', 'real and magnified', 'virtual and magnified'], a: 1, why: 'A convex mirror always gives an upright virtual image that is smaller than the object, formed behind the surface; the keratometer measures its size.' },
    { q: 'What is the keratometric power of a cornea with radius 8.0 mm, in dioptres?', answer: 42.2, unit: 'D', why: 'K = 337.5/8.0 = 42.19 D.' },
    { q: 'A steeper cornea gives a larger image of the mire.', a: false, why: 'The image is magnified by (R/2)/(d + R/2), which shrinks as R falls. A steeper (smaller R) cornea gives a smaller image and a higher K.' },
    { q: 'K1 = 41.00 D at 90° and K2 = 43.50 D at 180°. The corneal astigmatism is…', choices: ['2.50 D with the rule', '2.50 D against the rule', '1.25 D with the rule', '42.25 D'], a: 1, why: 'The steep meridian (43.50 D) is at 180°, horizontal: against the rule. The astigmatism is 43.50 − 41.00 = 2.50 D.' },
    { q: 'Why can a keratometer miss a corneal irregularity that a topographer finds?', choices: ['It uses infrared light', 'It measures only two meridians on a ring about 3 mm across', 'It cannot see the cornea', 'It measures the back surface'], a: 1, why: 'A keratometer\'s two numbers describe a regular toric surface. A local steepening or an irregular shape outside the measured ring needs the many points of topography.' }
  ],
  applications: [
    'Fitting contact lenses: the base curve of a lens is chosen from the corneal radius.',
    'Choosing the power of an intraocular lens at cataract surgery, where the corneal power is one input to the calculation.',
    'Planning and checking laser vision correction, which reshapes the cornea.',
    'Following keratoconus and other shape changes over time.',
    'Judging the smoothness of the tear film from the quality of the ring images.'
  ],
  history: 'Helmholtz built his ophthalmometer in the 1850s; Javal and Schiøtz made the clinical keratometer in 1881. Antonio Placido\'s disc of rings dates from 1880, and photographing it (Gullstrand, 1896) led, after a century, to computer-driven topography. Scheimpflug imaging of the anterior segment became clinical in the 1990s and 2000s.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the cornea, its surfaces and the keratometric index.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — keratometry and topography in practice.',
    'ISO 10343, *Ophthalmic instruments — Ophthalmometers* and ISO 19980, *Ophthalmic instruments — Corneal topographers*.'
  ],
  sim: 'op-keratometry'
}

,

/* ================================================================ the slit lamp */
{
  id: 'the-slit-lamp', parent: 'optometry-methods', title: 'The slit lamp', level: 2,
  short: 'A slit lamp is a stereo microscope and a lamp on a common pivot. The lamp throws a thin sheet of light into the eye at an angle; the microscope, looking straight ahead, sees the part of the eye lit by the sheet as a bright slab, its layers displaced sideways by their depth. That is an optical section of the cornea, the aqueous and the lens.',
  keywords: ['slit lamp', 'biomicroscope', 'optical section', 'parallelepiped', 'Tyndall effect', 'retroillumination', 'sclerotic scatter', 'specular reflection', 'anterior segment', 'Gullstrand', 'fluorescein', 'cobalt blue filter', 'stereo microscope'],
  prereq: ['anatomy-of-the-eye', 'the-compound-microscope', 'refraction-at-a-flat-surface'],
  related: ['tonometry', 'keratometry-and-corneal-topography', 'contact-lenses', 'cataract', 'microscope-illumination-and-contrast', 'ophthalmoscopy-and-fundus-imaging'],
  body: `
Most of the front of the eye is transparent: a clear window (the cornea), a clear fluid (the aqueous), a lens that should be clear. Looked at head-on with a torch, transparent things show little. A **slit lamp** makes them visible by lighting a *thin slice* and looking at it from another direction.

### Two halves on one pivot
The **microscope** is binocular, so that the examiner sees depth, with a magnification changed in steps of 6×, 10×, 16×, 25× and 40× (an eyepiece of 10× with an objective changer of 0.6 to 4×). Its field of view is about 220 mm divided by the magnification: 22 mm at 10×, 5.5 mm at 40×. The **lamp** projects the image of an adjustable slit: from a hairline to several millimetres wide, of adjustable height, and swivelling about the same vertical axis as the microscope, so that the beam is always focused where the microscope looks. The angle between them is usually 30–45°.

### Why an angled sheet gives a section
Light enters from one side as a sheet. Seen from the front, each depth along the sheet is displaced sideways by the depth times the tangent of the beam's angle inside the tissue. In the cornea, of thickness 0.55 mm and index 1.377, a lamp at 35° from the microscope sends the beam on at 24.6° ($\\sin 35^\\circ/1.377$), and the cornea's section appears

$$w = t\\,\\tan\\!\\left(\\arcsin\\frac{\\sin\\alpha}{n}\\right) = 0.55\\times 0.458 = 0.25\\ \\mathrm{mm}$$

wide, a bright band with two brighter edges, the surface layers. At 10° it is 0.07 mm, at 20° 0.14 mm, at 45° 0.33 mm and at 60° 0.45 mm. Clear aqueous scatters almost nothing, so behind the cornea the beam is nearly dark; at the lens it appears again as bright capsules with fainter bands between, the layers of the lens.

### Ways of lighting
| Technique | Beam | What it shows |
|---|---|---|
| diffuse | wide, low magnification | a first look at lids, conjunctiva, cornea |
| direct focal | narrow slit (0.1–0.2 mm: optical section) or about 1 mm (parallelepiped) | the layers and the depth of anything seen |
| retroillumination | light bounced from the iris or retina behind | opacities in the cornea or lens as silhouettes |
| specular reflection | mirror-like glint from a surface | the cell mosaic of the back of the cornea |
| sclerotic scatter | light into the edge of the cornea, guided inside by total reflection | the whole cornea glows; opacities scatter it |

A **cobalt-blue filter** with a fluorescein drop shows surface staining; a **red-free** (green) filter increases the contrast of blood vessels.

### The beam in the aqueous: the Tyndall effect
A beam in a perfectly clear fluid cannot be seen from the side; dust or cells scatter it and reveal it, as a sunbeam shows in a dusty room. An examiner looks at the aqueous in a dark room for that glow.

### Accessories
A Goldmann [[tonometry|tonometer]] mounts on the slit lamp; a hand-held condensing lens (+78 or +90 D) lets the lamp serve as an indirect [[ophthalmoscopy-and-fundus-imaging|ophthalmoscope]]; contact lenses with mirrors view the drainage angle; laser delivery heads use the same mount.

> [!note] A slit lamp shows what a trained eye can interpret. This page explains the light path, not how to judge what is seen.

> [!key] The slit lamp lights a thin sheet from the side and looks from the front; depth becomes sideways displacement, w = t·tan(angle inside the tissue), so a flat view becomes a section of cornea, aqueous and lens.
`,
  ideas: [
    'The microscope and the lamp share a pivot, so the beam is always focused where the microscope looks.',
    'Magnification is eyepiece × objective changer (6×, 10×, 16×, 25×, 40×); the field is about 220 mm ÷ magnification.',
    'A slit beam at an angle shows depth as sideways displacement: apparent width = thickness × tan(angle in the tissue).',
    'A narrow slit gives an optical section; a wider one a parallelepiped; a wide, dim beam gives diffuse light.',
    'The clear aqueous scatters almost nothing; particles in it make the beam visible (Tyndall effect).'
  ],
  pitfalls: [
    'The slit lamp is a lamp for looking at the retina — It looks at the front of the eye (lids, cornea, aqueous, lens, iris); the retina is reached only with an added lens.',
    'The section is a drawing of the cornea\'s thickness — The apparent width is the thickness times the tangent of the angle inside the tissue, so it changes with the lamp angle and is not the true thickness (0.55 mm).',
    'A clear liquid scatters nothing, so a bright beam in the aqueous is normal — In a healthy eye the beam between the cornea and the lens is nearly invisible; a visible glow means particles are present.',
    'Higher magnification always shows more — It shows a smaller field and a shallower depth; the examiner uses low magnification to survey and high to look closely.'
  ],
  terms: [
    { term: 'Slit lamp', also: ['biomicroscope', 'slit-lamp biomicroscope'], def: 'A stereo microscope with a lamp that projects an adjustable slit of light, both on a common pivot, used to examine the front of the eye.' },
    { term: 'Optical section', def: 'The thin slice of tissue lit by a narrow slit beam and viewed from another direction, which shows the depth of structures as sideways displacement.' },
    { term: 'Parallelepiped', def: 'The slab of tissue lit by a slit about 1 mm wide, wider than an optical section and seen as a bright block with a front, a back and sides.' },
    { term: 'Tyndall effect', def: 'The scattering of a beam by small particles in a transparent medium, which makes the beam visible from the side.' },
    { term: 'Retroillumination', def: 'Lighting a structure by light reflected from a surface behind it, so that it shows as a silhouette.' },
    { term: 'Fluorescein', def: 'A yellow-green fluorescent dye that stains surface defects and the tear film; it glows under cobalt-blue light.' }
  ],
  formulas: [
    {
      name: 'Apparent width of the cornea in the section', expr: 'w = t*tan(asin(sin(a)/n))', tex: 'w = t\\,\\tan\\!\\left(\\arcsin\\frac{\\sin a}{n}\\right)',
      vars: {
        w: { name: 'apparent width of the band', q: 'length', unit: 'mm', tex: 'w' },
        t: { name: 'true thickness of the layer', q: 'length', unit: 'mm', value: 0.55, tex: 't' },
        a: { name: 'angle between lamp and microscope', q: 'angle', unit: '°', value: 35, min: 0, max: 80, tex: 'a' },
        n: { name: 'refractive index of the layer', value: 1.377, min: 1, max: 2, tex: 'n' }
      },
      solveFor: 'w', note: 'Refraction at the front surface bends the beam towards the normal, so the band is narrower than t·tan a.',
      stories: { w: 'A slit lamp is set at {a} between lamp and microscope. A layer {t} thick of index {n} appears how wide?', a: 'A cornea {t} thick (index {n}) appears {w} wide in the section. What is the angle between lamp and microscope?' }
    },
    {
      name: 'Magnification of the slit lamp', expr: 'M = Me*Mo', tex: 'M = M_e\\,M_o',
      vars: {
        M: { name: 'total magnification', tex: 'M' },
        Me: { name: 'eyepiece magnification', value: 10, tex: 'M_e' },
        Mo: { name: 'factor of the objective changer', value: 1.6, tex: 'M_o' }
      },
      solveFor: 'M', note: 'Changer factors of 0.6, 1, 1.6, 2.5 and 4 with 10× eyepieces give 6×, 10×, 16×, 25× and 40×.'
    }
  ],
  examples: [
    {
      title: 'A cornea in section',
      q: 'The lamp is set 45° from the microscope. How wide does the cornea (0.55 mm, n = 1.377) appear in the optical section?',
      steps: [
        { text: 'The angle inside is', tex: '\\arcsin\\frac{\\sin 45^\\circ}{1.377} = \\arcsin 0.5135 = 30.9^\\circ' },
        { text: 'The apparent width is', tex: 'w = 0.55\\times\\tan 30.9^\\circ = 0.55\\times 0.598 = 0.33\\ \\mathrm{mm}' }
      ],
      a: '0.33 mm: the apparent band is 60 % of the true thickness at 45°, and 13 % at 10°.'
    },
    {
      title: 'The field at 25×',
      q: 'An examiner uses 10× eyepieces with a changer set to 2.5. What is the magnification and the field of view?',
      steps: [
        '$M = 10\\times 2.5 = 25$.',
        'The field is about $220/25 = 8.8$ mm.'
      ],
      a: '25×, with a field about 9 mm across. A cornea is about 11.7 mm wide, so the whole of it fits at 16× (a field of 14 mm) but only part of it at 25×.'
    }
  ],
  quiz: [
    { q: 'Why does the cornea appear as a band in the slit-lamp view when the beam is angled?', choices: ['The cornea is curved', 'Deeper parts of the sheet appear displaced sideways in proportion to their depth', 'The beam is spread by the lens', 'The cornea fluoresces'], a: 1, why: 'The sheet of light passes through the cornea at an angle, so the lit slice at the back is displaced sideways from the front one: the band\'s width is the thickness times the tangent of the angle inside.' },
    { q: 'In a healthy eye the beam crossing the aqueous (between cornea and lens) is…', choices: ['very bright', 'nearly invisible', 'coloured', 'broken into stripes'], a: 1, why: 'A clear fluid scatters little. A visible beam would mean particles in the fluid, as a sunbeam shows dust (the Tyndall effect).' },
    { q: 'An eyepiece of 12.5× and an objective factor of 2 give what magnification?', answer: 25, why: 'M = Me × Mo = 12.5 × 2 = 25.' },
    { q: 'What gives the narrowest apparent cornea band for a fixed true thickness?', choices: ['A large angle between lamp and microscope', 'A small angle between lamp and microscope', 'A wider slit', 'A higher magnification'], a: 1, why: 'Apparent width = t·tan(angle inside): it falls as the angle falls. At 10° it is 0.07 mm, at 60° 0.45 mm.' },
    { q: 'The field of view of a slit lamp is about 5.5 mm. Which magnification is likely?', choices: ['10×', '16×', '25×', '40×'], a: 3, why: 'The field is about 220 mm divided by the magnification: 220/40 = 5.5 mm.' }
  ],
  applications: [
    'Examining the cornea, conjunctiva, anterior chamber, iris and lens in routine and special examinations.',
    'Checking the fit of contact lenses and the surface of the eye they sit on.',
    'Measuring the pressure with a Goldmann tonometer mounted on the instrument.',
    'Viewing the retina and the optic nerve through a hand-held +78 or +90 D lens.',
    'Delivering laser treatments through the same optics.'
  ],
  history: 'Allvar Gullstrand designed the slit lamp in 1911 (made by Zeiss), and Alfred Vogt\'s use of it in the following years showed what the section could reveal. The binocular microscope on a common pivot became the standard form in the following decades, and the cobalt-blue and red-free filters were added later.',
  sources: [
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — slit-lamp techniques.',
    'M. Millodot, *Dictionary of Optometry and Visual Science* — the terms of the examination.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the indices and thicknesses of the cornea, aqueous and lens.'
  ],
  sim: 'op-slitlamp'
}

,

/* ================================================================ ophthalmoscopy and fundus imaging */
{
  id: 'ophthalmoscopy-and-fundus-imaging', parent: 'optometry-methods', title: 'Ophthalmoscopy and fundus imaging', level: 2,
  short: 'To see the retina one must look through the pupil along the path the light leaves by. A direct ophthalmoscope shows a small upright image magnified about 15 times; an indirect one, with a +20 D lens held before the eye, shows a wide field upside down at about 3 times; a fundus camera and a scanning laser ophthalmoscope record it.',
  keywords: ['ophthalmoscope', 'direct ophthalmoscopy', 'indirect ophthalmoscopy', 'fundus', 'fundus camera', 'condensing lens', '20 D lens', 'optic disc', 'macula', 'retinal photograph', 'scanning laser ophthalmoscope', 'red-free', 'dilation', 'field of view'],
  prereq: ['the-magnifier', 'real-and-virtual-images', 'anatomy-of-the-eye'],
  related: ['oct-in-eye-care', 'the-slit-lamp', 'perimetry', 'glaucoma-and-the-visual-field', 'macular-degeneration-and-retinal-disease', 'angular-magnification', 'periscopes-and-endoscopes'],
  body: `
The retina lines the inside of a dark sphere with a hole in the front. To look at it one must look *through the hole*, along the path the light takes when it leaves the eye — and the examiner's own head is in the way of the light that is needed to see anything. Every ophthalmoscope is a way round that problem. The part seen is the **fundus**: the retina with its blood vessels, the **optic disc** where the nerve leaves, and the **macula** at the centre.

### The direct ophthalmoscope
A beam is sent into the eye through a mirror or prism; the examiner looks through the same aperture, a few centimetres from the person. A person whose eye is in focus for distance sends the light from each retinal point out as a parallel beam, and the examiner's relaxed eye sees a **virtual, upright** image at infinity: the eye behaves as a magnifier. Compared with a reading distance of 250 mm its magnification is

$$M = \\frac{F_{\\mathrm{eye}}}{4} = \\frac{60}{4} = 15\\times$$

The view is a keyhole: through a pupil of 3–4 mm the field is only about 5–10°, 1.5 to 3 mm of retina, one or two disc diameters. A wheel of lenses lets the examiner cancel the refractive errors of both eyes.

### The indirect ophthalmoscope
A bright head-mounted light and a condensing lens of +20 D (or +28 D, +30 D) held at its focal length (5 cm for 20 D) in front of the person's eye. The lens collects the light leaving the pupil and forms a **real, inverted** image of the retina in the air between the lens and the examiner, who views it from arm's length with both eyes, getting depth. The magnification is now the eye's power over the lens power:

$$M = \\frac{F_{\\mathrm{eye}}}{F_{\\mathrm{lens}}} = \\frac{60}{20} = 3\\times\\quad(2.1\\times\\text{ for }+28\\ \\mathrm{D})$$

The lens aperture (about 50 mm) subtends a wide angle at the pupil, so the field is some 45° and more, more than eight disc diameters across, at the price of an upside-down, left–right-reversed picture and a smaller one.

### Cameras and scanners
A **fundus camera** lights the retina with a flash through the outer ring of the pupil and images it through the centre, so that reflections from the cornea stay out of the picture; fields of 30–50° are typical. A **scanning laser ophthalmoscope** sweeps a laser spot over the retina and records the reflected light point by point, with a confocal pinhole; some give images of 200° of the retina without dilation, and adaptive optics added to the system resolve single cones. Green (red-free) light raises the contrast of vessels and nerve fibres.

### Reading the scale
One degree at the retina is about $17\\ \\mathrm{mm}\\times\\pi/180 = 0.30$ mm. The optic disc is about 1.5 mm, 5°; the macula's centre, the fovea, lies some 15° (4.5 mm) from the disc towards the temple. The retina itself is nearly transparent: its red colour is the choroid and the pigment epithelium behind it. Arteries are thinner and brighter than veins.

> [!warn] A sudden shower of floaters, flashes of light, or a dark curtain spreading across the view can be signs that the retina is coming away. In that case seek urgent eye care.

> [!note] This page explains how the instruments work. Judging a fundus needs training and the full examination.

> [!key] The ophthalmoscope solves a keyhole problem. Direct: upright, 15×, a field of a few degrees. Indirect: inverted, 3× with +20 D, a field of tens of degrees. Cameras and scanners record it.
`,
  ideas: [
    'The direct ophthalmoscope shows a virtual upright image of the retina, magnified F/4 = 15×, through a small field of 5–10°.',
    'The indirect ophthalmoscope uses a +20 D condensing lens to form a real inverted image at 3×, with a field of some 45°.',
    'Magnification is the eye\'s power divided by the lens power; a stronger condensing lens gives a smaller image and a wider field.',
    'A fundus camera uses an annular illumination so that corneal reflections stay out of the image; scanners use a confocal laser spot.',
    'One degree at the retina is about 0.3 mm; the optic disc (1.5 mm) is about 5°.'
  ],
  pitfalls: [
    'The indirect ophthalmoscope magnifies more because it is "indirect" — It magnifies *less* (3×, against 15×); what it gains is the field of view, depth perception and the view through hazy media.',
    'The retina is red — It is nearly transparent. The colour of the fundus is the blood-rich choroid and the pigment behind it.',
    'The examiner sees the retina just as it is — The image is a virtual one made by the eye\'s own optics (direct) or an inverted real one (indirect): a refractive error or a clouded lens changes it.',
    'A bigger field always reveals more — A wide field reveals the periphery but at a small scale; fine detail needs the direct view, a camera or a scan.'
  ],
  terms: [
    { term: 'Fundus', also: ['ocular fundus', 'retinal fundus'], def: 'The inside back of the eye as seen through the pupil: retina, optic disc, macula and blood vessels.' },
    { term: 'Direct ophthalmoscope', def: 'A hand-held instrument that gives a virtual, upright image of the retina, magnified about 15 times, through a small field of a few degrees.' },
    { term: 'Indirect ophthalmoscope', def: 'A head-mounted light with a condensing lens held before the eye, forming a real inverted image of the retina with a wide field and a magnification F_eye/F_lens.' },
    { term: 'Condensing lens', also: ['+20 D lens', '+28 D lens'], def: 'The strong positive lens, of 20 to 30 dioptres, held in front of the eye in indirect ophthalmoscopy; its focal length (5 cm for 20 D) sets the working distance.' },
    { term: 'Fundus camera', def: 'A camera that photographs the retina through the pupil, with flash illumination through the pupil\'s rim and imaging through its centre.' },
    { term: 'Scanning laser ophthalmoscope', also: ['SLO'], def: 'An instrument that scans a laser spot over the retina and records the reflected light, usually with a confocal pinhole, to give high-contrast and very wide images.' },
    { term: 'Optic disc', also: ['optic nerve head'], def: 'The place where the nerve fibres leave the eye and the vessels enter, about 1.5 mm across (5°), with no light-sensitive cells: the blind spot.' }
  ],
  formulas: [
    {
      name: 'Magnification of the direct ophthalmoscope', expr: 'M = Fe*0.25', tex: 'M = \\frac{F_e}{4\\ \\mathrm{D}}',
      vars: {
        M: { name: 'magnification', tex: 'M' },
        Fe: { name: 'refracting power of the eye', q: 'optpower', unit: 'D', value: 60, min: 40, max: 80, tex: 'F_e' }
      },
      solveFor: 'M', note: 'The eye acts as a magnifier of power F_e viewed against a 250 mm reference distance: 60 D gives 15×.'
    },
    {
      name: 'Magnification of the indirect ophthalmoscope', expr: 'M = Fe/Fl', tex: 'M = \\frac{F_e}{F_l}',
      vars: {
        M: { name: 'magnification', tex: 'M' },
        Fe: { name: 'refracting power of the eye', q: 'optpower', unit: 'D', value: 60, tex: 'F_e' },
        Fl: { name: 'power of the condensing lens', q: 'optpower', unit: 'D', value: 20, min: 10, max: 40, tex: 'F_l' }
      },
      solveFor: 'M', note: 'A +20 D lens gives 3×; +28 D about 2.1×, with a wider field.'
    },
    {
      name: 'Size on the retina of an angle', expr: 's = th*L', tex: 's = \\theta\\,L',
      vars: {
        s: { name: 'size on the retina', q: 'length', unit: 'mm', tex: 's' },
        th: { name: 'angle subtended at the nodal point', q: 'angle', unit: '°', value: 5, tex: '\\theta' },
        L: { name: 'nodal point to retina', q: 'length', unit: 'mm', value: 17, tex: 'L' }
      },
      solveFor: 's', note: 'One degree is 0.30 mm; the optic disc, 1.5 mm, is about 5°.'
    }
  ],
  examples: [
    {
      title: 'Field and disc diameters',
      q: 'An indirect ophthalmoscope shows a field of 45°. How many millimetres of retina is that, and how many optic-disc diameters (1.5 mm)?',
      steps: [
        { text: 'Size of the field on the retina (17 mm from the nodal point):', tex: 's = 45^\\circ\\times\\frac{\\pi}{180}\\times 17\\ \\mathrm{mm} = 13.4\\ \\mathrm{mm}' },
        'Disc diameters: $13.4/1.5 = 8.9$.'
      ],
      a: 'About 13 mm, nearly nine disc diameters (using a flat retina: a curved one spans somewhat more).'
    },
    {
      title: 'Choosing the lens',
      q: 'An examiner changes from a +20 D to a +28 D condensing lens. What happens to the magnification and the working distance?',
      steps: [
        { text: 'Magnification:', tex: 'M = \\frac{60}{28} = 2.14\\times\\quad\\text{(from } 3.0\\times\\text{)}' },
        'The focal length is $1/28 = 36$ mm instead of 50 mm, so the lens is held closer to the eye.'
      ],
      a: 'The image shrinks from 3× to 2.1×, the field grows, and the lens sits 36 mm from the eye instead of 50 mm.'
    }
  ],
  quiz: [
    { q: 'A direct ophthalmoscope used on an eye of 60 D gives a magnification of…', choices: ['3×', '6×', '15×', '60×'], a: 2, why: 'M = F/4 = 60/4 = 15 (the eye acts as a magnifier referred to the 250 mm reading distance).' },
    { q: 'The image in indirect ophthalmoscopy is…', choices: ['virtual and upright', 'real and inverted', 'real and upright', 'virtual and inverted'], a: 1, why: 'The condensing lens forms a real image of the retina in the air in front of the examiner, and it is upside down and reversed.' },
    { q: 'What is the magnification with a +30 D condensing lens on a 60 D eye?', answer: 2, why: 'M = F_eye/F_lens = 60/30 = 2.' },
    { q: 'Which gives the widest field?', choices: ['The direct ophthalmoscope', 'The indirect ophthalmoscope with a +20 D lens', 'A magnifier', 'A reading lens'], a: 1, why: 'The indirect method shows some 45° and more; the direct one only a few degrees through the same pupil.' },
    { q: 'The retina looks red mainly because the retina itself is red.', a: false, why: 'The retina is nearly transparent. The red is from the blood-filled choroid and the pigment epithelium behind it.' }
  ],
  applications: [
    'Looking at the optic disc and the macula in every comprehensive examination.',
    'Diabetic eye screening, which uses fundus photographs read at intervals.',
    'Photographs of the optic disc kept to compare over the years.',
    'Showing signs of general conditions in the retinal vessels, the only blood vessels that can be looked at directly.',
    'Teleophthalmology, where a fundus camera in one place is read in another.'
  ],
  history: 'Charles Babbage designed an ophthalmoscope in 1847 but never published it. Hermann von Helmholtz announced his in 1851 and gave the optics of the direct view; Christian Ruete introduced the indirect method in 1852, and Charles Schepens put it on the examiner\'s head with binocular optics in the 1940s. The scanning laser ophthalmoscope came from the work of Webb and colleagues in the 1980s.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the retina and the optics of looking into the eye.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — ophthalmoscopy, direct and indirect.',
    'R. H. Webb, G. W. Hughes and F. C. Delori, "Confocal scanning laser ophthalmoscope", *Applied Optics* 26 (1987).'
  ],
  sim: 'op-ophthalmoscope'
},

/* ================================================================ tonometry */
{
  id: 'tonometry', parent: 'optometry-methods', title: 'Tonometry: measuring eye pressure', level: 2,
  short: 'The pressure inside the eye is found from outside by pressing on the cornea. The Goldmann applanation tonometer flattens a circle 3.06 mm across and reads the force: pressure = force ÷ area (the Imbert–Fick idea), so that 1 gram of force is 10 mmHg. Air-puff and rebound instruments reach the same number without touching or with a feather touch. Typical readings are 10–21 mmHg.',
  keywords: ['tonometry', 'tonometer', 'intraocular pressure', 'IOP', 'applanation', 'Goldmann', 'Imbert-Fick', 'air puff', 'non-contact tonometer', 'rebound tonometer', 'mmHg', 'central corneal thickness', 'fluorescein', 'glaucoma pressure'],
  prereq: ['anatomy-of-the-eye', 'the-slit-lamp'],
  related: ['glaucoma-and-the-visual-field', 'perimetry', 'oct-in-eye-care', 'keratometry-and-corneal-topography', 'ophthalmoscopy-and-fundus-imaging', 'medicine:vision'],
  body: `
The eye is a small pressurised ball. The clear fluid inside, the aqueous humour, is made all the time and drains away through a fine meshwork at the edge of the cornea; the balance of the two gives the **intraocular pressure** (IOP), which keeps the eye's shape and its optics. In most people it is about 15 mmHg above the pressure outside, 2.0 kPa. A **tonometer** measures it from the outside.

### Force over area
If the cornea were a thin, dry, perfectly flexible spherical skin, flattening part of it would take a force just equal to the pressure times the flattened area (the **Imbert–Fick** law):

$$P = \\frac{F}{A}$$

The cornea is none of these. It is about 0.5 mm thick and stiff, so it resists bending; it is wet, so the tear film pulls the prism in by surface tension. At one flattened diameter these two effects cancel almost exactly: **3.06 mm**. Goldmann chose it. The area is $\\pi(1.53\\ \\mathrm{mm})^2 = 7.35\\ \\mathrm{mm}^2$, and one gram-force (9.8 mN) over it is $9.8\\ \\mathrm{mN}/7.35\\ \\mathrm{mm}^2 = 1333\\ \\mathrm{Pa} = 10.0$ mmHg. The drum of the instrument is therefore marked in grams times ten.

### The Goldmann applanation tonometer
Mounted on the [[the-slit-lamp|slit lamp]], with a drop of local anaesthetic and of fluorescein, a small transparent prism is touched against the cornea. A cobalt-blue beam makes the tear film around the flattened circle glow green as a ring, and a biprism splits the ring's image into two **semicircles, each shifted by 1.53 mm**. The examiner turns the drum until the inner edges of the two semicircles just touch: that is the diameter of 3.06 mm, and the drum reads the pressure.

### Without touching
A **non-contact tonometer** blows a puff of air that flattens the cornea; a detector notes the moment of flatness and the pressure is calculated from the puff. It needs no anaesthetic but each puff gives a slightly different number. A **rebound tonometer** bounces a very light probe off the cornea and reads the deceleration; it is held by hand and needs no drop. Older indentation instruments (Schiøtz) measured how far a weight sank into the cornea.

### The numbers and what they are not
IOP in a population averages about 15–16 mmHg with a spread of about 3 mmHg; the usual range of 10–21 mmHg is a statistical limit, not a line between health and disease. It varies by some 3–6 mmHg through the day and with posture and effort. The cornea matters: a thick cornea resists flattening and reads high, a thin one low, by a few mmHg; scarring, swelling or a high astigmatism add error, and different instruments differ by several mmHg. A single reading is therefore a data point in a series.

> [!warn] A painful red eye with haloes round lights, headache, nausea and blurred vision can be a sudden rise in pressure. In that case seek urgent eye care.

> [!note] This page explains what a tonometer measures. A pressure inside or outside a range does not by itself show health or disease.

> [!key] Pressure is force over area: flatten 3.06 mm (7.35 mm²) and 1 gram-force is 10 mmHg. Goldmann, air-puff and rebound instruments all give the same quantity, with errors from corneal thickness and stiffness.
`,
  ideas: [
    'Intraocular pressure is the balance of aqueous humour made and drained; in most people it is about 15 mmHg (2 kPa).',
    'Imbert–Fick: P = F/A for a thin flexible membrane; the cornea\'s stiffness and the tear film cancel at a flattened diameter of 3.06 mm.',
    'At 3.06 mm the area is 7.35 mm² and 1 gf corresponds to 10 mmHg.',
    'In the Goldmann view the ring of fluorescein is split into two semicircles shifted by 1.53 mm; they touch at the end point.',
    'Readings depend on corneal thickness and stiffness, differ between instruments and vary through the day.'
  ],
  pitfalls: [
    'A pressure of 21 mmHg or less means the eye is healthy — The 10–21 range is statistical. Some people with pressures inside it have damage to the optic nerve, and many with higher pressures never do; pressure is one risk factor among others.',
    'Tonometers measure the pressure directly inside the eye — They measure the force needed to flatten or the response of the cornea, and calculate the pressure from it with assumptions about the cornea.',
    'A thick cornea means a high pressure — A thick cornea makes the instrument read too high, because it is harder to flatten; the true pressure may be unchanged.',
    'One reading settles it — Pressure varies through the day and with the instrument, so decisions rest on repeated readings and on other findings.'
  ],
  terms: [
    { term: 'Intraocular pressure', also: ['IOP', 'eye pressure'], def: 'The fluid pressure inside the eye above the atmosphere, about 15 mmHg in most people, set by the balance of aqueous humour produced and drained.' },
    { term: 'Applanation', def: 'Flattening of a small area of the cornea by a flat surface; the force needed, divided by the flattened area, gives the pressure.' },
    { term: 'Imbert–Fick law', also: ['Fick\'s law of applanation'], def: 'For an ideal thin, dry, flexible, spherical membrane, the pressure inside equals the force needed to flatten an area divided by that area.' },
    { term: 'Goldmann tonometer', also: ['applanation tonometer'], def: 'A slit-lamp mounted instrument that flattens a 3.06 mm circle of the cornea with a prism; the dial gives the pressure when the two half-rings of fluorescein just touch.' },
    { term: 'Non-contact tonometer', also: ['air-puff tonometer'], def: 'An instrument that flattens the cornea with a puff of air and detects the moment of flatness, calculating the pressure from the puff.' },
    { term: 'Central corneal thickness', also: ['CCT', 'pachymetry'], def: 'The thickness of the cornea at its centre, typically about 0.54 mm; a thick cornea makes applanation tonometry read high and a thin one low.' }
  ],
  formulas: [
    {
      name: 'Imbert–Fick law', expr: 'P = F/A', tex: 'P = \\frac{F}{A}',
      vars: {
        P: { name: 'pressure', q: 'pressure', unit: 'mmHg', tex: 'P' },
        F: { name: 'force on the flattened area', q: 'force', unit: 'mN', value: 14.7, tex: 'F' },
        A: { name: 'flattened area', q: 'area', unit: 'mm²', value: 7.35, tex: 'A' }
      },
      solveFor: 'P', note: '1 gram-force is 9.81 mN; over 7.35 mm² it is 10.0 mmHg.',
      stories: { P: 'A force of {F} flattens {A} of cornea. What is the pressure?', F: 'The eye\'s pressure is {P}. What force flattens an area of {A}?' }
    },
    {
      name: 'Diameter flattened by a given force', expr: 'd = 2*sqrt(F/(pi*P))', tex: 'd = 2\\sqrt{\\frac{F}{\\pi P}}',
      vars: {
        d: { name: 'flattened diameter', q: 'length', unit: 'mm', tex: 'd' },
        F: { name: 'force', q: 'force', unit: 'mN', value: 11.8, tex: 'F' },
        P: { name: 'pressure', q: 'pressure', unit: 'mmHg', value: 15, tex: 'P' }
      },
      solveFor: 'd', note: 'A force of 11.8 mN (1.2 gf) at 15 mmHg flattens 2.7 mm: too little, the half-rings do not touch.'
    }
  ],
  examples: [
    {
      title: 'The force at the end point',
      q: 'How much force flattens the Goldmann circle (3.06 mm) at 15 mmHg?',
      steps: [
        { text: 'Convert: $15\\ \\mathrm{mmHg} = 15\\times 133.3\\ \\mathrm{Pa} = 2000\\ \\mathrm{Pa}$. The area is $7.354\\ \\mathrm{mm}^2 = 7.354\\times10^{-6}\\ \\mathrm{m}^2$.', tex: 'F = P A = 2000\\times 7.354\\times 10^{-6}\\ \\mathrm{N} = 14.7\\ \\mathrm{mN}' },
        'That is 14.7 ÷ 9.81 = 1.50 gf: the drum shows 1.5, that is 15 mmHg.'
      ],
      a: '14.7 mN, 1.50 gram-force: the drum reads pressure by ten times the force in grams.'
    },
    {
      title: 'Too little force',
      q: 'At a true pressure of 15 mmHg, the drum is set to 1.2 gf (12 mmHg). How big is the flattened circle?',
      steps: [
        { text: 'The flattened area is $A = F/P = 11.77\\ \\mathrm{mN}/2000\\ \\mathrm{Pa} = 5.88\\ \\mathrm{mm}^2$. The diameter:', tex: 'd = 2\\sqrt{A/\\pi} = 2.74\\ \\mathrm{mm}' },
        'That is less than 3.06 mm: the inner edges of the half-rings do not meet.'
      ],
      a: '2.74 mm: the half-rings are apart, which tells the examiner to turn the drum up.'
    }
  ],
  quiz: [
    { q: 'In the Goldmann view the correct end point is when…', choices: ['the two half-rings overlap by half their width', 'the inner edges of the two half-rings just touch', 'the ring disappears', 'the cornea is completely flat'], a: 1, why: 'The biprism shifts each half by 1.53 mm: they touch when the flattened diameter is exactly 3.06 mm, at which the tear-film pull and the corneal stiffness cancel.' },
    { q: 'What force flattens the Goldmann circle at 20 mmHg, in grams-force?', answer: 2, unit: 'gf', why: '1 gf corresponds to 10 mmHg for the 3.06 mm circle, so 20 mmHg needs 2.0 gf.' },
    { q: 'A thicker cornea makes applanation tonometry read…', choices: ['too low', 'too high', 'the same', 'zero'], a: 1, why: 'A thicker cornea is harder to flatten, so more force is needed and the reading is too high.' },
    { q: 'A reading of 18 mmHg is within the usual range, so the optic nerve cannot be damaged.', a: false, why: 'The usual range is statistical. Some people with pressures inside it have optic-nerve damage, and many with higher pressures never do.' },
    { q: 'If the pressure doubles and the force stays the same, the flattened area…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 1, why: 'A = F/P: with F fixed, doubling P halves the area.' }
  ],
  applications: [
    'Following the effect on pressure of a prescribed treatment, over repeated visits.',
    'Checking pressure before and after eye surgery and after some injuries.',
    'Screening in the routine examination, as one risk factor with others.',
    'Clinical trials of drugs that change the pressure.',
    'Measuring children and people who cannot sit at a slit lamp, with a rebound instrument.'
  ],
  history: 'Adolf Fick described applanation in 1888 and Hjalmar Schiøtz introduced the indentation tonometer in 1905. Hans Goldmann and Theo Schmidt published the applanation tonometer in 1957 with its 3.06 mm diameter; non-contact air-puff instruments appeared in the 1970s and rebound tonometers in the 2000s.',
  sources: [
    'H. Goldmann and T. Schmidt, "Über Applanationstonometrie", *Ophthalmologica* 134 (1957) — the instrument and the 3.06 mm diameter.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — tonometry in practice and its sources of error.',
    'J. J. Kanski and B. Bowling, *Clinical Ophthalmology: A Systematic Approach* — intraocular pressure and its measurement.'
  ],
  sim: 'op-tonometry'
}

,

/* ================================================================ perimetry */
{
  id: 'perimetry', parent: 'optometry-methods', title: 'Perimetry: mapping the visual field', level: 2,
  short: 'Perimetry maps what each eye sees away from the point it looks at. In static threshold testing small round lights appear at 54 places while the eye holds still, and a staircase of brighter and dimmer flashes finds the dimmest light seen at each, in decibels: 0 dB is the brightest spot the machine can make, and every 10 dB is ten times dimmer. The blind spot, 15° out on the temporal side, is the landmark.',
  keywords: ['perimetry', 'visual field', 'automated perimeter', 'static threshold', 'kinetic perimetry', 'Goldmann perimeter', '24-2', 'decibel', 'blind spot', 'scotoma', 'staircase', 'SITA', 'stimulus size III', 'mean deviation', 'hemianopia'],
  prereq: ['the-visual-field', 'the-retina-rods-and-cones', 'the-fovea-and-visual-acuity'],
  related: ['glaucoma-and-the-visual-field', 'the-blind-spot-and-filling-in', 'macular-degeneration-and-retinal-disease', 'tonometry', 'oct-in-eye-care', 'contrast-sensitivity', 'light-and-dark-adaptation'],
  body: `
Acuity tests the centre. The **visual field** is everything else: the 60° nasal, 100° temporal, 60° up and 75° down that one eye takes in while it looks at a fixed point. **Perimetry** measures how sensitive the eye is at places across that field, and the result is a map.

### Kinetic and static
In **kinetic** perimetry (the Goldmann bowl) an examiner moves a light of fixed size and brightness from outside the field inward along many meridians until the person says it is seen; joining the points gives lines of equal sensitivity, **isopters**. In **static** perimetry the light stays where it is and its brightness changes, which finds the **threshold** at that place.
### A static threshold test
The person looks at a central target in a bowl of uniform dim background (10 cd/m², 31.5 apostilbs). Round white lights of **size III** (0.43°, an area of 4 mm² at 300 mm) flash for 0.2 s at **54 places** on a 6° grid (the standard "24-2" pattern: 24° each side of fixation and a nasal step to 30°); the person presses a button when one is seen. The brightest spot is 3183 cd/m² (10 000 apostilbs) and is called 0 dB. Each decibel is a factor 1.26 in luminance:

$$L = L_0\\,10^{-D/10}$$

so 10 dB is ten times dimmer and 30 dB gives a spot of 3.2 cd/m² added to the 10 cd/m² background, a Weber contrast of 32 %. A normal field has 30–33 dB at the centre, falling to about 25 dB at the edge of the test area.

### The staircase
At each place the light starts at a moderate level. If seen, the next flash is 4 dB dimmer; if not, 4 dB brighter; at the first reversal the step falls to 2 dB, and the threshold is the last level seen when the second reversal comes. Faster programmes (the SITA family) use what is known from neighbouring places to finish in a few minutes.

### Reliability
A person who drifts their gaze makes the map wrong. Fixation is checked by flashing a light into the **blind spot** from time to time (it should not be seen); **false positives** (responding when nothing appeared) and **false negatives** (missing a very bright light at a place already found sensitive) are counted.
### The printout
The numbers in decibels at each place; a grey-scale picture (dark where sensitivity is low); and comparisons with normal values for age: **total deviation** and **pattern deviation**, the latter lifting out an overall depression such as a hazy lens. Two single numbers summarise it: **mean deviation** and **pattern standard deviation**. The **blind spot** is a hole at about 15° on the temporal side and 1.5° below the horizontal, roughly 5° wide and 7° tall: the optic disc, 4.5 mm from the fovea, has no light-sensitive cells.

### Reading patterns
A defect that stops at the horizontal midline follows the arching bundles of nerve fibres; one that stops at the vertical midline points to the pathway behind the eyes, where the signals of the two eyes are combined. A central hole is a central scotoma. A pattern is a clue to *where* along the pathway something has changed.

> [!warn] A sudden loss of vision, or a dark curtain or shadow spreading across part of the view, needs urgent attention. In that case seek urgent eye care.

> [!note] This page explains how the field is mapped; the maps are read with the rest of the examination.

> [!key] Static perimetry finds the dimmest light seen at each of 54 places by a staircase; sensitivity in dB is 10 log₁₀ of the luminance relative to the brightest spot. The map shows the normal blind spot and any lost areas.
`,
  ideas: [
    'The visual field of one eye is about 60° nasal, 100° temporal, 60° up and 75° down.',
    'Static threshold perimetry finds the dimmest light seen at each of 54 places, in decibels below the brightest spot.',
    '10 dB is a factor of 10 in luminance; each dB is ×1.26. 30 dB is a Weber contrast of about 32 % on a 10 cd/m² background.',
    'A 4–2 dB staircase reverses twice and stops; faster programmes use prior knowledge.',
    'Reliability indices (fixation losses, false positives and negatives) and the normal blind spot at 15° are built-in checks.'
  ],
  pitfalls: [
    'A hole in the field is seen as a dark patch — People do not see their blind spot or small scotomas as holes: the brain fills the gap. That is why the field must be measured.',
    'Higher decibels mean a brighter light — The opposite: 0 dB is the brightest light, 30 dB a spot a thousand times dimmer. A higher number is a *more sensitive* place.',
    'The blind spot is a sign of disease — It is normal: the optic disc has no photoreceptors. Perimetry marks it so that a real defect can be told from it.',
    'One field settles it — The result varies by a few decibels from test to test, so changes are judged over several tests.'
  ],
  terms: [
    { term: 'Visual field', def: 'The whole area seen by an eye while it fixates a point: about 60° nasal, 100° temporal, 60° up and 75° down.' },
    { term: 'Perimetry', also: ['visual field testing', 'automated perimetry'], def: 'Measuring the sensitivity of the eye at many places in the visual field.' },
    { term: 'Threshold', also: ['sensitivity'], def: 'The dimmest light that is seen at a place, in perimetry stated in decibels attenuation from the brightest stimulus: 0 dB is the brightest, higher is more sensitive.' },
    { term: 'Isopter', def: 'A line joining places of equal sensitivity, drawn in kinetic perimetry from the points where a moving target is first seen.' },
    { term: 'Scotoma', def: 'An area of reduced or lost sensitivity within the visual field, surrounded by better vision. The normal blind spot is a physiological scotoma.' },
    { term: 'Mean deviation', also: ['MD', 'pattern standard deviation', 'PSD'], def: 'A single number for the average difference of a field from normal for the person\'s age (MD), and another for how uneven that difference is (PSD).' },
    { term: 'Blind spot', also: ['physiological scotoma'], def: 'The part of the field with no vision because the optic nerve leaves the eye there: about 15° temporal to fixation, 1.5° below, roughly 5° by 7°.' }
  ],
  formulas: [
    {
      name: 'Luminance of the stimulus at a threshold', expr: 'L = L0*10^(-D/10)', tex: 'L = L_0\\,10^{-D/10}',
      vars: {
        L: { name: 'luminance added by the stimulus', q: 'luminance', unit: 'cd/m²', tex: 'L' },
        L0: { name: 'luminance of the brightest stimulus (0 dB)', q: 'luminance', unit: 'cd/m²', value: 3183, tex: 'L_0' },
        D: { name: 'sensitivity', q: false, unit: 'dB', value: 30, min: 0, max: 45, tex: 'D' }
      },
      solveFor: 'L', note: '10 000 apostilbs is 3183 cd/m²; 30 dB gives 3.2 cd/m² on top of the background.',
      stories: { L: 'The dimmest spot seen at one place is {D} below the brightest. What luminance does it add?', D: 'The dimmest spot seen at a place adds {L}. What is the sensitivity in dB?' }
    },
    {
      name: 'Contrast of the stimulus', expr: 'C = L/Lb', tex: 'C = \\frac{L}{L_b}',
      vars: {
        C: { name: 'Weber contrast', q: 'ratio', unit: '%', tex: 'C' },
        L: { name: 'luminance added by the stimulus', q: 'luminance', unit: 'cd/m²', value: 3.18, tex: 'L' },
        Lb: { name: 'luminance of the background', q: 'luminance', unit: 'cd/m²', value: 10, tex: 'L_b' }
      },
      solveFor: 'C', note: 'The stimulus is added to the background: 3.18 cd/m² on 10 cd/m² is 32 %.'
    },
    {
      name: 'Diameter of a stimulus', expr: 's = 2*r*tan(th/2)', tex: 's = 2r\\tan\\frac{\\theta}{2}',
      vars: {
        s: { name: 'diameter of the spot', q: 'length', unit: 'mm', tex: 's' },
        r: { name: 'distance from the eye to the bowl', q: 'length', unit: 'mm', value: 300, tex: 'r' },
        th: { name: 'angular size', q: 'angle', unit: '°', value: 0.43, tex: '\\theta' }
      },
      solveFor: 's', note: 'Size III is 0.43°: a round spot of area 4 mm² at 300 mm.'
    }
  ],
  examples: [
    {
      title: 'What a decibel value means',
      q: 'The dimmest spot seen at a place is 25 dB below the brightest (3183 cd/m²). What luminance does it add to the background, and what is the contrast against 10 cd/m²?',
      steps: [
        { text: 'The luminance:', tex: 'L = 3183\\times 10^{-2.5} = 10.07\\ \\mathrm{cd/m^2}' },
        'Against the 10 cd/m² background the Weber contrast is 10.07/10 = 100 %.'
      ],
      a: 'About 10 cd/m², a contrast of 100 %: a sensitivity of 25 dB means the eye needs the spot to double the local luminance.'
    },
    {
      title: 'A drop of 6 dB',
      q: 'A place is found at 28 dB in one test and 22 dB in another. How much brighter did the spot have to be the second time?',
      steps: [
        { text: 'The ratio of the two luminances:', tex: '10^{6/10} = 3.98' }
      ],
      a: 'About four times brighter. A change of this size is more than the usual test-to-test variation at one place and is what a clinician looks for across several tests.'
    }
  ],
  quiz: [
    { q: '30 dB sensitivity means the dimmest spot seen was…', choices: ['30 times dimmer than the brightest', '1000 times dimmer than the brightest', '300 times dimmer than the brightest', '3 times dimmer than the brightest'], a: 1, why: 'A decibel is a tenth of a log unit: 30 dB is 3 log units, a factor of 10³ = 1000.' },
    { q: 'The blind spot is found about 15° on the temporal side of fixation and is part of every normal field.', a: true, why: 'It is the place where the optic nerve leaves the eye: no photoreceptors, so no response. A real defect has to be told from it.' },
    { q: 'In the 4–2 dB staircase, after the first "seen" and then a "not seen", the step becomes…', choices: ['4 dB', '2 dB', '10 dB', '1 dB'], a: 1, why: 'The step is 4 dB until the first reversal of the answer (seen to not seen, or the other way) and then 2 dB; the second reversal ends the series.' },
    { q: 'What is the ratio of luminance between a 24 dB spot and a 30 dB spot? (How many times brighter is the 24 dB one?)', answer: 3.98, why: '6 dB is a factor 10^0.6 = 3.98.' },
    { q: 'Why can a person have a field defect and not notice it?', choices: ['The defect is too small to matter', 'The brain fills in the missing part and the two eyes overlap', 'The eyes move too fast', 'Field defects are always painful'], a: 1, why: 'The brain fills small gaps with their surroundings, as it does for the normal blind spot, and the two eyes cover for each other over the central 120°; the map measures what looking cannot.' }
  ],
  applications: [
    'Following a field over years, as one of the tests used for glaucoma care.',
    'Locating damage along the visual pathway, from eye to brain, by the shape of the defect.',
    'Assessing the central field in macular disease and in the effects of some medicines.',
    'Driving and disability assessments, which use binocular field tests.',
    'Research on vision, where thresholds in dB give a standard measure.'
  ],
  history: 'Harry Moss Traquair described the field as an "island of vision in a sea of darkness" in 1927. Hans Goldmann\'s hemispherical perimeter of 1945 fixed the size, brightness and background of the stimuli; automated static perimeters in the 1970s–80s, and the faster SITA algorithms of the 1990s (Bengtsson, Olsson, Heijl, Rootzén), made threshold fields routine.',
  sources: [
    'D. R. Anderson and V. M. Patella, *Automated Static Perimetry* (2nd ed.) — the test, the printout and the indices.',
    'B. Bengtsson, J. Olsson, A. Heijl and H. Rootzén, "A new generation of algorithms for computerized threshold perimetry, SITA", *Acta Ophthalmologica Scandinavica* 75 (1997).',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — visual field screening and threshold testing.'
  ],
  sim: 'op-perimetry'
}

,

/* ================================================================ colour-vision tests */
{
  id: 'colour-vision-tests', parent: 'optometry-methods', title: 'Colour-vision tests', level: 2,
  short: 'Colour-vision tests find out which of the three cone systems differs and by how much. Pseudo-isochromatic plates hide a number in dots whose hues a person with a red–green deficiency cannot separate; arrangement tests put coloured caps in order; the anomaloscope asks for a match between a yellow light and a red–green mixture and measures it. The plate on this page is a demonstration, not a test.',
  keywords: ['colour vision test', 'Ishihara', 'pseudo-isochromatic plates', 'Farnsworth D-15', 'Farnsworth-Munsell 100 hue', 'anomaloscope', 'Rayleigh match', 'protan', 'deutan', 'tritan', 'colour vision deficiency', 'confusion line', 'colour blindness'],
  prereq: ['trichromatic-colour-vision', 'colour-vision-deficiency', 'the-retina-rods-and-cones'],
  related: ['the-chromaticity-diagram', 'metamerism', 'colour-difference-and-tolerance', 'opponent-colours', 'the-munsell-colour-system', 'physics:color-vision'],
  body: `
Normal colour vision rests on three kinds of cone, with peak sensitivities near 420, 534 and 564 nm (the S, M and L cones). A **colour-vision deficiency** means one kind is missing (**dichromacy**: protanopia, deuteranopia, tritanopia) or its pigment is shifted (**anomalous trichromacy**: protanomaly, deuteranomaly, tritanomaly). The common forms are the red–green ones, inherited on the X chromosome: about 8 % of men and 0.5 % of women of northern European descent; the blue–yellow forms are rare (about 1 in 10 000), and a deficiency can also be acquired through disease or some medicines. Tests find out *whether*, *which kind* and *how severe*.

### Pseudo-isochromatic plates
A plate is a field of round dots of many sizes. The figure is made of dots of one hue and the ground of another, chosen on a **confusion line**: pairs of colours that a person with a particular deficiency cannot tell apart. The dots' brightness is varied at random so that lightness gives no clue. In the demonstration plate on this page, a figure of orange dots on olive green has a colour difference of $\\Delta E$ = 50 for typical colour vision, but about 7 for the deutan model and 6 for the protan model: the figure sinks into the ground. For the tritan model it stays at 55: the pair is not on a tritan confusion line.

Plates are *vanishing* (a number only typical vision reads), *hidden-digit* (the reverse) or *classification* types that separate protan from deutan. They are fast and good for screening red–green deficiency, but grade severity poorly. They need **daylight-like light** (about 6500 K) and printed pigments that have not faded; a screen is no substitute, because its colours are not calibrated.

### Arrangement tests
Coloured caps of about equal lightness must be put in order of hue. The **Farnsworth D-15** has 15 caps and takes a minute or two; the mistakes, drawn on a circle of hue, fall along lines that show the type of deficiency. The **Farnsworth–Munsell 100-hue test** has 85 caps in four boxes and gives an error score that can pick up mild or acquired losses, but takes much longer.
### The anomaloscope
The reference instrument for red–green deficiency is the **anomaloscope** (Nagel, 1907). A round field is split in two: one half is a spectral yellow of about 589 nm of adjustable brightness; the other is a mixture of a red (about 670 nm) and a green (about 546 nm) with an adjustable ratio. The person is asked to make the two halves match: the **Rayleigh match**, a [[metamerism|metameric]] pair. A person with typical colour vision accepts a narrow range of mixtures. A person with deuteranomaly needs more green than usual, one with protanomaly more red, and one with dichromacy accepts *any* mixture if the brightness is adjusted. The midpoint and width of the accepted range measure the type and the severity.

### Why it is tested
Some occupations (rail, aviation, electrical and lighting work, printing) set colour standards, and the tests grade a deficiency rather than only pass or fail it. Some acquired changes in colour vision also accompany disease.

> [!note] A plate on a screen shows how the method works; it cannot tell anyone what their colour vision is. That needs printed plates, standard light and a practitioner.

> [!key] Colour-vision tests exploit confusion lines (plates), ordering of equal-lightness hues (arrangement tests), and metameric matches (the anomaloscope). Plates screen, arrangement tests grade, and the anomaloscope measures.
`,
  ideas: [
    'Colour vision rests on three cone types (peaks near 420, 534 and 564 nm); a deficiency is one type missing or shifted.',
    'Pseudo-isochromatic plates pick dots on a confusion line and vary their lightness at random, so only hue can reveal the figure.',
    'Arrangement tests (D-15, Farnsworth–Munsell 100 hue) order caps of equal lightness by hue; the pattern of errors shows the type.',
    'The anomaloscope measures the Rayleigh match between yellow and a red–green mixture: the match range gives type and severity.',
    'Tests need standard daylight and printed plates; a screen is not calibrated for them.'
  ],
  pitfalls: [
    'A person with a colour-vision deficiency sees no colour — Most people with a deficiency see many colours; they confuse particular pairs, such as reds with greens or browns with greens, depending on the type.',
    'A colour test on a screen is as good as the printed plates — Screens differ in primaries, white point and brightness, so the colours are not those the plate was designed with. Printed plates under daylight-like light are needed.',
    'Colour-vision deficiency is a kind of poor sight — Acuity, field and depth are normal; only the discrimination of some hue pairs is reduced. The term "colour blind" is also misleading for the same reason.',
    'The test of choice is the one that is quickest — Plates screen quickly; arrangement tests grade; the anomaloscope measures. Each answers a different question.'
  ],
  terms: [
    { term: 'Colour-vision deficiency', also: ['colour blindness', 'CVD'], def: 'Reduced ability to discriminate certain colours because one or more cone pigments are missing or shifted. Protan, deutan and tritan forms are named after the L, M and S cones affected.' },
    { term: 'Pseudo-isochromatic plate', also: ['Ishihara plate'], def: 'A printed field of dots in which a figure is made of dots whose hue differs from the ground along a confusion line, with random lightness, so that only colour discrimination reveals it.' },
    { term: 'Confusion line', def: 'A line in a chromaticity diagram along which a person with a given dichromacy cannot tell colours apart; there is a family for protan, deutan and tritan vision.' },
    { term: 'Arrangement test', also: ['Farnsworth D-15', 'Farnsworth–Munsell 100-hue'], def: 'A test in which coloured caps of equal lightness are put in order of hue; the pattern of misplacements reveals the type and severity of a deficiency.' },
    { term: 'Anomaloscope', def: 'An instrument for the Rayleigh match: the person adjusts a red–green mixture to match a yellow field, and the range of mixtures accepted measures red–green colour vision.' },
    { term: 'Rayleigh match', def: 'The match of a spectral yellow (about 589 nm) with a mixture of a red (about 670 nm) and a green (about 546 nm), used to classify red–green deficiencies.' }
  ],
  formulas: [
    {
      name: 'Colour difference in CIELAB', expr: 'dE = sqrt(dL^2 + da^2 + db^2)', tex: '\\Delta E = \\sqrt{\\Delta L^2 + \\Delta a^2 + \\Delta b^2}',
      vars: {
        dE: { name: 'colour difference', tex: '\\Delta E' },
        dL: { name: 'difference of lightness', signed: true, value: -0.6, tex: '\\Delta L' },
        da: { name: 'difference in a (green–red)', signed: true, value: 49.5, tex: '\\Delta a' },
        db: { name: 'difference in b (blue–yellow)', signed: true, value: 3.8, tex: '\\Delta b' }
      },
      solveFor: 'dE', note: 'About 1–2 is just noticeable; 50 is a large difference. The default is the orange against olive of the plate for typical vision.'
    }
  ],
  examples: [
    {
      title: 'The plate through a deutan model',
      q: 'On the demonstration plate the average figure and ground colours differ by ΔL = −0.6, Δa = 49.5, Δb = 3.8 for typical vision, and by ΔL = 2.2, Δa = −0.8, Δb = 7.2 as seen with the deutan model. Compare the colour differences.',
      steps: [
        { text: 'Typical vision:', tex: '\\Delta E = \\sqrt{0.36 + 2450 + 14.4} = 49.7' },
        { text: 'Deutan model:', tex: '\\Delta E = \\sqrt{4.84 + 0.64 + 51.8} = 7.6' }
      ],
      a: '49.7 against 7.6: the contrast carried by hue (the difference in a) is nearly gone, and the lightness is random, so the figure cannot be read.'
    }
  ],
  quiz: [
    { q: 'The dots of a plate are given random lightness so that…', choices: ['the plate looks prettier', 'brightness cannot be used to find the figure: only hue can', 'the printing is cheaper', 'the figure is easier for everyone'], a: 1, why: 'If the figure dots were all lighter or darker than the ground, anyone could read it by brightness. Random lightness leaves the hue difference as the only cue.' },
    { q: 'On an anomaloscope a person with dichromacy accepts…', choices: ['only one mixture', 'a narrow range of mixtures', 'any red–green mixture if the brightness of the yellow is adjusted', 'no mixture at all'], a: 2, why: 'A dichromat has only one working cone system in the red–green range, so any mixture can match the yellow once the brightness is balanced.' },
    { q: 'About what share of men of northern European descent have a red–green colour-vision deficiency?', answer: 8, unit: '%', why: 'About 8 % of men and 0.5 % of women (the red–green forms are X-linked, so they are more common in men).' },
    { q: 'A colour test seen on a computer screen is a valid substitute for printed plates under daylight.', a: false, why: 'A screen\'s primaries, white point and brightness are not standardised for the plates, and the colour pairs chosen for confusion lines are only right for the printed pigments under the right light.' },
    { q: 'The orange and olive pair of the demonstration plate remains easy to separate in the tritan model because…', choices: ['tritan vision is better than normal', 'the pair differs along red–green, which tritan vision keeps', 'the plate is lit differently', 'orange is a primary colour'], a: 1, why: 'The pair differs mainly in the red–green direction, which a person with tritan vision (missing S cones) can still discriminate. It lies on a protan and a deutan confusion line, not a tritan one.' }
  ],
  applications: [
    'Screening children and applicants for occupations with colour standards (rail, aviation, electrical work).',
    'Grading a deficiency with arrangement tests and the anomaloscope.',
    'Looking for acquired changes in colour vision that accompany disease or the effects of some medicines.',
    'Designing charts, signals and maps that stay legible for people with a deficiency (colour plus shape, pattern or label).',
    'Research on cone pigments, which the same matches can probe.'
  ],
  history: 'John Dalton described his own deficiency in 1798. Willibald Nagel\'s anomaloscope dates from 1907 and uses the match that Lord Rayleigh had studied; Shinobu Ishihara published his plates in 1917; Farnsworth devised the 100-hue test in 1943 and the D-15 in 1947; the Hardy–Rand–Rittler plates appeared in 1954.',
  sources: [
    'J. Birch, *Diagnosis of Defective Colour Vision* (Oxford University Press, 1993) — the tests and their use.',
    'S. J. Dain, "Clinical colour vision tests", *Clinical and Experimental Optometry* 87 (2004).',
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae* — confusion lines and colour matching.'
  ],
  sim: 'op-ishihara'
}

,

/* ================================================================ cover test and binocular balance */
{
  id: 'cover-test-and-binocular-balance', parent: 'optometry-methods', title: 'The cover test and binocular balance', level: 2,
  short: 'Two eyes must point at the same thing. A tropia is a turn that is there with both eyes open; a phoria is a latent drift that shows only when fusion is broken. The cover test watches one eye while the other is covered and uncovered, the size is stated in prism dioptres (1 Δ = 1 cm at 1 m), and "balance" makes the two eyes equally clear in the refraction.',
  keywords: ['cover test', 'cover-uncover', 'alternate cover', 'phoria', 'tropia', 'strabismus', 'heterophoria', 'esotropia', 'exotropia', 'prism dioptre', 'prism bar', 'near point of convergence', 'binocular balance', 'Maddox rod', 'binocular vision'],
  prereq: ['binocular-vision-and-stereopsis', 'prism-in-spectacles'],
  related: ['amblyopia-and-strabismus', 'the-phoropter-and-subjective-refraction', 'accommodation', 'eye-movements', 'the-eye-examination'],
  body: `
Looking at one object with two eyes needs each eye to turn so that its **fovea** points at the object, and the brain to fuse the two images. When the eyes do not point together the problem is named by the *direction* of the turn and by *when* it shows.

### The words
- A **tropia** (manifest strabismus) is a deviation present with both eyes open; a **phoria** is a *latent* tendency to deviate that the brain holds in check by fusion, and that appears when fusion is broken.
- **Eso-** means turned towards the nose, **exo-** away from it, **hyper-** and **hypo-** up and down. So exophoria is a latent outward drift and esotropia an inward turn that is always there.
- A deviation is **comitant** if it is the same in all directions of gaze and **incomitant** if it changes, as when a muscle is weak.

### The prism dioptre
Deviations are measured in **prism dioptres** (Δ): 1 Δ is a shift of 1 cm at a distance of 1 m. A deviation of angle $\\theta$ is

$$\\Delta = 100\\,\\tan\\theta$$

so 1 Δ = 0.57°, 10 Δ = 5.7°, 20 Δ = 11.3°. The same unit gives the *demand* of the task: at 40 cm, eyes 64 mm apart each turn $\\arctan(32/400) = 4.6°$, a total convergence of 100 × 64/400 = **16 Δ**; at 6 m the demand is only 1.1 Δ.

### The cover tests
- **Cover–uncover.** Cover one eye and *watch the other*. If it moves to take up the target, there was a **tropia**, and the direction of the move says which way it was turned (inward movement: it was turned out). Then uncover and *watch the eye that was covered*: if it swings back to the target, it had drifted under the cover: a **phoria**.
- **Alternate cover.** The cover is moved from one eye to the other without letting both see; fusion is never allowed, so the **whole** deviation (phoria plus any tropia) appears.
- **Measuring the size.** Prisms of increasing power are placed before one eye until the movement stops: the power that neutralises the movement is the deviation in Δ.

Typical findings without symptoms are straight eyes or about 1 Δ of exo at 6 m and a few prism dioptres of exophoria at 40 cm; the near point of convergence is typically 5–10 cm.

### Binocular balance in the refraction
In the phoropter the two eyes are also made **equally clear**. Prisms of a few dioptres, one base-up and one base-down, move the two images apart vertically so that each eye sees its own chart in the same moment, and the examiner adds plus until the two look equally sharp ([[the-phoropter-and-subjective-refraction]]). It keeps one eye from being left to focus harder than the other.

### Why it is looked at
A phoria that the brain cannot hold in check can give eyestrain, headaches, blur or double vision at near. A tropia in a child, especially, can leave one eye behind in its development ([[amblyopia-and-strabismus]]); about 2–4 % of children have a strabismus, which is why the test is done early.

> [!warn] Double vision that starts suddenly, especially with a drooping eyelid or a headache, needs prompt assessment. In that case seek urgent eye care.

> [!note] The cover test is an observation by a trained examiner; it is described here to show how a deviation is told from a tendency, not to assess anyone's eyes.

> [!key] Cover and watch the other eye for a tropia; uncover and watch the covered eye for a phoria; the alternate cover shows the total. Deviations are given in prism dioptres, Δ = 100 tan θ.
`,
  ideas: [
    'A tropia shows with both eyes open; a phoria appears only when fusion is broken.',
    'Cover one eye and watch the other: movement means a tropia. Uncover and watch that eye: recovery movement means a phoria.',
    'Alternate cover prevents fusion, so it shows the whole deviation; prisms that stop the movement measure it.',
    '1 prism dioptre = 1 cm at 1 m; Δ = 100 tan θ, so 10 Δ ≈ 5.7°.',
    'At 40 cm the eyes together converge by 16 Δ; at 6 m only 1.1 Δ.'
  ],
  pitfalls: [
    'A phoria is a mild strabismus — A phoria is hidden by fusion in everyone to some degree; strabismus (tropia) is a deviation that is present with both eyes open. They are different findings.',
    'A prism dioptre is a degree — 1 Δ is 0.57°: 10 Δ is 5.7°, and the relation is Δ = 100 tan θ.',
    'The covered eye is what moves in a tropia — In the cover test the eye watched is the *uncovered* one; the covered eye is out of sight. Movement of the uncovered eye is the sign of a tropia.',
    'Balance means equal acuity — It means equal clarity and equal accommodation of the two eyes together, which can differ even when each eye alone reads the same line.'
  ],
  terms: [
    { term: 'Phoria', also: ['heterophoria'], def: 'A latent deviation of the eyes, held in check by fusion and seen only when fusion is broken, as when one eye is covered.' },
    { term: 'Tropia', also: ['heterotropia', 'strabismus'], def: 'A deviation of the eyes that is present with both eyes open and fixating. Esotropia is inward, exotropia outward.' },
    { term: 'Prism dioptre', also: ['Δ', 'pd'], def: 'A unit of prism power and of angular deviation: 1 Δ is a displacement of 1 cm at 1 m, an angle of 0.57°.' },
    { term: 'Cover test', also: ['cover–uncover test', 'alternate cover test'], def: 'Covering one eye and observing the movement of the other (cover test) or of the covered eye on uncovering, to tell a tropia from a phoria and to measure it.' },
    { term: 'Near point of convergence', also: ['NPC'], def: 'The closest point at which both eyes can fixate a target, normally 5–10 cm.' },
    { term: 'Binocular balance', def: 'The step of a refraction that makes the two eyes equally clear and equally accommodated, usually by prism dissociation.' }
  ],
  formulas: [
    {
      name: 'Prism dioptres from an angle', expr: 'D = 100*tan(a)', tex: '\\Delta = 100\\tan\\theta',
      vars: {
        D: { name: 'deviation', q: 'prism', unit: 'Δ', tex: '\\Delta' },
        a: { name: 'angle', q: 'angle', unit: '°', value: 6, min: 0, max: 45, tex: '\\theta' }
      },
      solveFor: 'D', note: '1 Δ = 0.573°, 10 Δ = 5.71°, 20 Δ = 11.31°.',
      stories: { D: 'An eye is turned {a} from its straight position. How many prism dioptres is that?', a: 'A deviation measures {D}. What angle is that?' }
    },
    {
      name: 'Convergence demand of a near target', expr: 'C = 100*pd/d', tex: 'C = 100\\,\\frac{p}{d}',
      vars: {
        C: { name: 'total convergence demand', q: 'prism', unit: 'Δ', tex: 'C' },
        pd: { name: 'distance between the eyes', q: 'length', unit: 'mm', value: 64, tex: 'p' },
        d: { name: 'distance of the target', q: 'length', unit: 'cm', value: 40, tex: 'd' }
      },
      solveFor: 'C', note: 'Both eyes together; each eye turns half. At 40 cm with a 64 mm distance: 16 Δ.'
    }
  ],
  examples: [
    {
      title: 'Convergence for reading',
      q: 'The eyes are 64 mm apart and a page is held at 40 cm. How far does each eye turn, and what is the convergence demand in prism dioptres? What is it at 6 m?',
      steps: [
        { text: 'Each eye turns $\\arctan(32/400)$:', tex: '\\theta = \\arctan 0.08 = 4.57^\\circ' },
        { text: 'The total demand is $C = 100\\times 64/400$:', tex: 'C = 16\\ \\Delta\\quad(\\text{and at } 6\\ \\mathrm{m}: 100\\times 64/6000 = 1.07\\ \\Delta)' }
      ],
      a: '4.6° per eye, 16 Δ in all at 40 cm; 1.1 Δ at 6 m: near work asks for fifteen times the convergence of distance.'
    },
    {
      title: 'A measured deviation',
      q: 'An examiner finds that a 12 Δ prism stops the movement of an eye during the alternate cover test. What is the angle of the deviation?',
      steps: [
        { text: 'From $\\Delta = 100\\tan\\theta$:', tex: '\\theta = \\arctan 0.12 = 6.84^\\circ' }
      ],
      a: '6.8°: about 7° of turn.'
    }
  ],
  quiz: [
    { q: 'You cover the right eye and the left eye, uncovered, moves outward to look at the target. This suggests…', choices: ['a latent drift (phoria) of the right eye', 'an inward turn of the left eye (esotropia)', 'normal eyes', 'a weak right eye'], a: 1, why: 'The uncovered eye had to move to take up fixation, so it was not aimed at the target: a tropia. It moved outward, so it had been turned inward (esotropia).' },
    { q: 'What is a deviation of 20 prism dioptres in degrees, approximately?', answer: 11.3, unit: '°', why: 'θ = arctan(20/100) = 11.3°.' },
    { q: 'Both eyes straight with both open, but when one is covered it drifts out and swings back on uncovering. This is…', choices: ['an exotropia', 'an exophoria', 'an esophoria', 'normal binocular vision with no latent drift at all'], a: 1, why: 'A latent outward drift that appears under the cover and recovers on uncovering is a phoria: exophoria.' },
    { q: 'The convergence demand at 25 cm for eyes 64 mm apart is about…', choices: ['6.4 Δ', '16 Δ', '25.6 Δ', '64 Δ'], a: 2, why: 'C = 100 × 64/250 = 25.6 Δ in all, 12.8 Δ per eye.' },
    { q: 'The alternate cover test shows only the tropia, not the phoria.', a: false, why: 'Alternate cover breaks fusion completely, so it shows the whole deviation: the tropia and the phoria together.' }
  ],
  applications: [
    'Screening children for strabismus, so that the weaker eye can be helped early.',
    'Finding the reason for strain, headaches or double vision at near.',
    'Measuring a deviation to prescribe a prism, or before surgery on the eye muscles.',
    'Assessing double vision that begins after head injury or illness.',
    'The balance step of every subjective refraction.'
  ],
  history: 'Albrecht von Graefe used prism dissociation in the 1860s to reveal latent deviations; Ernest Maddox\'s rod (1890s) gave a way to dissociate subjectively; Charles Prentice proposed the prism dioptre in the 1890s. The cover test in its modern form was refined through the twentieth century.',
  sources: [
    'M. Scheiman and B. Wick, *Clinical Management of Binocular Vision: Heterophoric, Accommodative, and Eye Movement Disorders* — the cover test and prism measures.',
    'G. K. von Noorden and E. C. Campos, *Binocular Vision and Ocular Motility* — tropias, phorias and their measurement.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — binocular vision tests and binocular balance.'
  ],
  sim: 'op-cover'
}

,

/* ================================================================ OCT in eye care */
{
  id: 'oct-in-eye-care', parent: 'optometry-methods', title: 'OCT in eye care', level: 3,
  short: 'Optical coherence tomography makes a cross-section of the retina from the echoes of near-infrared light, as ultrasound does with sound. The depth resolution is set by the bandwidth of the light, 0.44 λ²/Δλ: about 4.5 µm in tissue for 840 nm and 50 nm. The picture shows the retina\'s layers, the pit of the fovea, the nerve fibre layer and the pigment epithelium, in seconds and without touching the eye.',
  keywords: ['OCT', 'optical coherence tomography', 'retinal layers', 'B-scan', 'A-scan', 'macular thickness', 'RNFL', 'nerve fibre layer', 'spectral-domain', 'swept-source', 'OCT angiography', 'axial resolution', 'anterior segment OCT', 'low-coherence interferometry'],
  prereq: ['optical-coherence-tomography', 'michelson-interferometer', 'ophthalmoscopy-and-fundus-imaging'],
  related: ['coherence', 'macular-degeneration-and-retinal-disease', 'glaucoma-and-the-visual-field', 'perimetry', 'tonometry', 'the-retina-rods-and-cones', 'the-fovea-and-visual-acuity'],
  body: `
An ophthalmoscope shows the surface of the retina like a photograph of a field from a plane. **Optical coherence tomography** (OCT) shows a *slice*, as if the field were cut with a spade: the retina's layers, in cross-section, with the depth measured in micrometres.

### The method in brief
OCT is low-coherence interferometry, in the manner of the [[michelson-interferometer|Michelson interferometer]]: broadband near-infrared light is split, one part goes to a reference mirror and the other into the eye. Light reflected from a layer interferes with the reference only if the two paths match to within the **coherence length** of the source. So the depth resolution is the coherence length, set by the bandwidth:

$$\\delta z = \\frac{2\\ln 2}{\\pi}\\,\\frac{\\lambda^2}{\\Delta\\lambda}\\approx 0.44\\,\\frac{\\lambda^2}{\\Delta\\lambda}$$

For 840 nm and 50 nm of bandwidth this is 6.2 µm in air, or 4.5 µm in tissue (divide by an index of about 1.38). For 1050 nm and 100 nm it is 4.9 µm, 3.5 µm in tissue. One line of reflectivity against depth is an **A-scan**; sweeping the beam along a line gives a **B-scan** (the cross-section); a series of them is a volume. The **lateral** resolution, about 10–20 µm, depends on the eye's own optics and the spot, not on the bandwidth, so the picture is sharper in depth than across.

### Generations
**Time-domain** OCT (the first, 1991) moves a reference mirror and records a few hundred A-scans a second. **Spectral-domain** OCT records the whole spectrum at once and Fourier-transforms it: 20 000–100 000 A-scans a second. **Swept-source** OCT uses a tunable laser near 1050 nm and 100 000–400 000 A-scans a second; its light goes deeper, into the choroid.

### What the picture shows
From the clear vitreous inward to outward: the inner surface of the retina, the nerve fibre layer (bright), the ganglion cell and inner plexiform layers, the inner nuclear layer, the outer plexiform layer, the outer nuclear layer (the photoreceptor cell bodies), a thin external limiting membrane, the bright **ellipsoid zone** of the photoreceptors, and the bright pigment epithelium; below lies the choroid. At the **fovea** the inner layers part to form a pit: the retina is thinnest there, about 0.2 mm, and thickest on the rim, about 0.3–0.35 mm. Around the optic disc a circle scan of about 3.4 mm gives the thickness of the nerve fibre layer, typically about 0.1 mm on average in healthy adults and falling with age and with some diseases. Maps colour the thickness over the macula; **OCT angiography** compares repeated scans so that moving blood stands out and vessels show without a dye; **anterior-segment OCT** images the cornea and the drainage angle.

### What it cannot do
Hazy media and eye movement degrade the scan; the software that finds layer edges can err; each make of instrument has its own thickness tables. A scan shows structure; whether it matters is a clinical judgement.

> [!warn] Straight lines suddenly looking bent or wavy, a dark or blank patch in the centre of vision, or a sudden fall in vision, need prompt attention. In that case seek urgent eye care.

> [!note] OCT is explained here as a measurement of structure. The scans are read by practitioners with the other findings, not by themselves.

> [!key] OCT builds a cross-section from light echoes; depth resolution is 0.44 λ²/Δλ (4.5 µm in tissue for 840 nm, 50 nm). It shows the retinal layers, the foveal pit and the nerve fibre layer, quickly and with no contact.
`,
  ideas: [
    'OCT is low-coherence interferometry: a layer shows only where its path matches the reference to within the coherence length.',
    'Depth resolution = 0.44 λ²/Δλ: broader bandwidth gives finer slices; 840 nm and 50 nm give 4.5 µm in tissue.',
    'An A-scan is one line of reflectivity against depth; B-scans and volumes are built from many.',
    'Spectral-domain OCT does tens of thousands of A-scans a second; swept-source at 1050 nm goes deeper.',
    'The retina is thinnest at the fovea (about 0.2 mm) and thicker on its rim; the nerve fibre layer is measured around the disc.'
  ],
  pitfalls: [
    'OCT gives a photograph of the retina — It gives a cross-section built from the echoes of light at different depths; the fundus photograph is a separate image.',
    'The lateral resolution is as fine as the depth resolution — Depth is set by the bandwidth (a few µm); the lateral resolution is set by the eye\'s optics and the spot (10–20 µm), so the image is sharper in depth.',
    'The thickness numbers are the same on every instrument — Each make has its own definitions of the layers and its own normal values; numbers from different instruments cannot be compared directly.',
    'Narrowing the bandwidth makes the OCT better — A narrow band means a long coherence length: thicker slices and merged layers. Resolution improves as the bandwidth grows.'
  ],
  terms: [
    { term: 'Optical coherence tomography', also: ['OCT'], def: 'Imaging of the layered structure of tissue by low-coherence interferometry, which measures the reflection of light against depth.' },
    { term: 'A-scan', def: 'One line of reflectivity against depth along a single beam position; the building block of an OCT image.' },
    { term: 'B-scan', def: 'A cross-sectional image built from many A-scans along a line.' },
    { term: 'Axial resolution', also: ['depth resolution', 'coherence length'], def: 'The thinnest slice OCT can separate in depth, about 0.44 λ²/Δλ in air and that divided by the refractive index in tissue.' },
    { term: 'Spectral-domain OCT', also: ['SD-OCT', 'Fourier-domain OCT'], def: 'OCT in which the whole spectrum of the returned light is recorded and Fourier-transformed to give an A-scan in a single exposure.' },
    { term: 'Swept-source OCT', also: ['SS-OCT'], def: 'OCT with a laser whose wavelength is swept rapidly; typically at about 1050 nm, with a fast scan rate and deeper penetration.' },
    { term: 'OCT angiography', also: ['OCT-A'], def: 'OCT that compares repeated scans of the same place so that moving blood shows, mapping vessels without a dye.' }
  ],
  formulas: [
    {
      name: 'Axial resolution in air', expr: 'dz = 0.44*lam^2/dlam', tex: '\\delta z = 0.44\\,\\frac{\\lambda^2}{\\Delta\\lambda}',
      vars: {
        dz: { name: 'axial resolution in air', q: 'length', unit: 'µm', tex: '\\delta z' },
        lam: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 840, min: 600, max: 1400, tex: '\\lambda' },
        dlam: { name: 'bandwidth of the source (FWHM)', q: 'length', unit: 'nm', value: 50, min: 5, max: 200, tex: '\\Delta\\lambda' }
      },
      solveFor: 'dz', note: 'For a Gaussian spectrum; divide by the tissue index (about 1.38 in the retina) for the resolution in the retina.',
      stories: { dz: 'An OCT source is centred at {lam} with a bandwidth of {dlam}. What is its axial resolution in air?', dlam: 'An OCT instrument at {lam} must resolve {dz} in air. What bandwidth does it need?' }
    },
    {
      name: 'Resolution in tissue', expr: 'dt = dz/n', tex: '\\delta z_t = \\frac{\\delta z}{n}',
      vars: {
        dt: { name: 'axial resolution in tissue', q: 'length', unit: 'µm', tex: '\\delta z_t' },
        dz: { name: 'axial resolution in air', q: 'length', unit: 'µm', value: 6.2, tex: '\\delta z' },
        n: { name: 'refractive index of the tissue', value: 1.38, min: 1.3, max: 1.5, tex: 'n' }
      },
      solveFor: 'dt', note: 'Light travels more slowly in tissue, so the same coherence length spans a shorter depth.'
    },
    {
      name: 'Time to scan a volume', expr: 't = N/R', tex: 't = \\frac{N}{R}',
      vars: {
        t: { name: 'time for the volume', q: 'time', unit: 's', tex: 't' },
        N: { name: 'number of A-scans', int: true, value: 65536, min: 1, tex: 'N' },
        R: { name: 'A-scan rate', q: 'frequency', unit: 'kHz', value: 70, tex: 'R' }
      },
      solveFor: 't', note: '512 × 128 = 65 536 A-scans at 70 kHz take 0.94 s, during which the eye must stay still.'
    }
  ],
  examples: [
    {
      title: 'Resolution of two instruments',
      q: 'A spectral-domain instrument has λ = 840 nm and Δλ = 50 nm; a swept-source one 1050 nm and 100 nm. Compare their axial resolution in the retina (n = 1.38).',
      steps: [
        { text: 'Spectral-domain:', tex: '\\delta z = 0.44\\times\\frac{(840)^2}{50}\\ \\mathrm{nm} = 6.2\\ \\mu\\mathrm{m},\\quad 6.2/1.38 = 4.5\\ \\mu\\mathrm{m}' },
        { text: 'Swept-source:', tex: '\\delta z = 0.44\\times\\frac{(1050)^2}{100}\\ \\mathrm{nm} = 4.85\\ \\mu\\mathrm{m},\\quad 4.85/1.38 = 3.5\\ \\mu\\mathrm{m}' }
      ],
      a: '4.5 µm and 3.5 µm: the wider bandwidth more than makes up for the longer wavelength (resolution grows as λ²).'
    },
    {
      title: 'A volume in a second',
      q: 'A macular cube of 512 × 128 A-scans is recorded at 70 000 A-scans a second. How long does it take?',
      steps: [
        'The number of A-scans is $512\\times128 = 65\\,536$.',
        { text: 'Time:', tex: 't = \\frac{65\\,536}{70\\,000\\ \\mathrm{s^{-1}}} = 0.94\\ \\mathrm{s}' }
      ],
      a: 'Under a second: short enough to be done with a steady gaze, though blinks and eye movements still spoil some scans.'
    }
  ],
  quiz: [
    { q: 'What is the axial resolution in air for λ = 840 nm and Δλ = 50 nm, in micrometres?', answer: 6.2, unit: 'µm', why: 'δz = 0.44 × 840² / 50 nm = 6.2 µm.' },
    { q: 'Which change improves the axial resolution?', choices: ['A narrower source bandwidth', 'A broader source bandwidth', 'A brighter source', 'A larger beam spot'], a: 1, why: 'Resolution δz ∝ 1/Δλ: a broader spectrum has a shorter coherence length, so thinner slices are separated.' },
    { q: 'The depth resolution and the lateral resolution of an OCT image are set by the same thing.', a: false, why: 'Depth resolution comes from the source bandwidth; the lateral resolution from the optics of the beam and the eye. The image is typically finer in depth (a few µm) than across (10–20 µm).' },
    { q: 'An A-scan is…', choices: ['a photograph of the retina', 'one line of reflectivity against depth', 'a map of thickness', 'the whole volume'], a: 1, why: 'An A-scan is a single depth profile at one beam position; B-scans are many A-scans along a line, volumes many B-scans.' },
    { q: 'Why does swept-source OCT near 1050 nm see deeper into the choroid?', choices: ['The laser is more powerful', 'Longer wavelengths scatter less in tissue and pass pigment better', 'It has a bigger lens', 'It uses X-rays'], a: 1, why: 'Scattering falls with wavelength and the pigment absorbs less at 1050 nm than at 840 nm, so more light reaches and returns from deeper layers.' }
  ],
  applications: [
    'Measuring the thickness of the retina over the macula and following it.',
    'Measuring the nerve fibre layer around the optic disc, as one structural test beside pressure and the visual field.',
    'Looking at the macula in detail: its layers, the foveal pit, and anything that changes them.',
    'OCT angiography, to see retinal vessels without injecting a dye.',
    'Imaging the cornea and the drainage angle, and measuring the length of the eye before surgery.'
  ],
  history: 'David Huang and colleagues, in the group of James Fujimoto at MIT, published OCT in 1991 (*Science* 254) and made images of the retina in the eye in 1993, with other groups. The first commercial ophthalmic instruments appeared in the late 1990s, spectral-domain instruments around 2006, swept-source systems in the 2010s, followed by OCT angiography.',
  sources: [
    'D. Huang et al., "Optical coherence tomography", *Science* 254 (1991) — the original paper.',
    'W. Drexler and J. G. Fujimoto (eds.), *Optical Coherence Tomography: Technology and Applications* — the physics and the clinical practice.',
    'D. B. Elliott (ed.), *Clinical Procedures in Primary Eye Care* — OCT in the practice.'
  ],
  sim: 'op-oct'
}

);
