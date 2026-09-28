/* HYPER-ERGONOMICS · content/anthropometry.js — the Anthropometry branch: body dimensions (measuring the body,
 * percentiles, standing and sitting dimensions, hands, feet and heads, reach, mass and strength) and human variation
 * (men and women, populations and the secular trend, children and older people, disability, clothing and PPE,
 * combining percentiles). Simulations in sims/anthropometry.js (an-…). */
Hyper.add(

{
  id: 'anthropometry-basics', parent: 'body-dimensions', title: 'Measuring the body', level: 1,
  short: 'Anthropometry measures the body in standard ways: ISO 7250-1 fixes the landmarks, the posture and the instrument for each dimension so that surveys can be compared. Static dimensions are measured still and upright; functional ones while reaching, moving or working — and every table needs allowances for posture, clothing and the real users.',
  keywords: ['anthropometry', 'ISO 7250', 'ISO 7250-1', 'landmarks', 'Frankfurt plane', 'anthropometer', 'calliper', 'static dimension', 'structural dimension', 'functional dimension', 'dynamic dimension', 'body scanner', 'ANSUR II', 'CAESAR', 'ISO 15535', 'survey', 'sample size', 'measurement error', 'diurnal variation', 'body measurements'],
  prereq: ['ergonomics-defined', 'design-for-range'],
  related: ['percentiles', 'standing-dimensions', 'sitting-dimensions', 'hand-foot-head', 'functional-reach', 'population-differences', 'clothing-ppe-allowances', 'user-trials-mockups', 'digital-human-models'],
  body: `
Anthropometry — from the Greek for *human* and *measure* — is the measurement of the body's sizes, shapes, masses and strengths. A designer who wants a chair, a cab or a control panel to fit people needs numbers, and the numbers are only useful if everyone measures the same thing in the same way. This page is about how that is done; [[percentiles]] explains how the results are summarised and used.

### Landmarks, postures and instruments
**ISO 7250-1** defines the basic body measurements for technological design. For each dimension it names the bony **landmarks** the measurement runs between, the **posture** of the person and the **instrument**. The subject wears minimal clothing and no shoes, and either stands erect with the weight on both feet, or sits erect on a flat, horizontal seat with the thighs horizontal, the knees bent at about a right angle and the feet flat on an adjustable platform. The head is held in the **Frankfurt plane**: the line from the top of the ear opening to the lowest point of the eye socket is horizontal. Landmarks — the *vertex* (top of the head), the *acromion* (the bony tip of the shoulder), the *olecranon* (the point of the elbow), the back of the knee — are found by touch and marked on the skin before measuring.

| Instrument | What it measures | Examples |
|---|---|---|
| Anthropometer — a graduated rod with a sliding arm | heights and long breadths | stature, eye, shoulder and sitting height |
| Sliding and spreading callipers | short lengths, breadths and depths | hand breadth, head length, chest depth |
| Tape | circumferences and arcs | head, chest and hand circumference |
| Sitting platform with an adjustable footrest | seated heights and lengths | popliteal height, knee height, buttock–knee length |
| Scales | body mass | weight |
| 3-D body scanner | the whole surface, measured afterwards | modern surveys (landmarks are still needed) |

In the simulation, pick a dimension and see where it runs on the standing and the seated figure, how it is measured and which design it governs.

### Static and functional dimensions
**Static** (structural) dimensions are taken in the standard, still postures: stature, sitting height, popliteal height, hip breadth. They are repeatable and are what the tables list. **Functional** (dynamic) dimensions are taken while doing something: how far a person reaches when leaning, the space a walking person sweeps, the room needed to kneel under a machine. A functional value can exceed the static one — a 20° forward lean of the trunk adds roughly 150 mm to a seated reach — or fall short of it: bulky clothing, a seat belt or a load in the hand all shorten reach ([[functional-reach]]). Design starts from static data, corrects for the task and checks the result in a fitting trial ([[user-trials-mockups]]).

Each measurement governs a family of designs and has a limiting user — stature sets headroom (the largest), popliteal height seat height (both ends), buttock–popliteal length seat depth (the smallest): see [[standing-dimensions]], [[sitting-dimensions]] and [[hand-foot-head]].

### Surveys and their precision
A survey measures a *sample* and reports, for each sex, the [[?mean|mean]], the [[?standard-deviation|standard deviation]] and a set of percentiles. **ISO 15535** sets the rules for building such a database — sampling, training the measurers, checking errors, reporting — and **ISO/TR 7250-2** gathers national summary statistics. Well-known surveys include **ANSUR II** (US Army, 2012, more than 6,000 soldiers measured directly and scanned in 3-D) and **CAESAR** (3-D scans of civilians in North America, the Netherlands and Italy, around 2000). The precision of a result grows only with the square root of the number of people: halving the error needs four times the sample, and a 5th or 95th percentile needs about 2.35 times as many people as a mean of the same precision (the formula below).

### A measurement moves with the person
The spinal discs compress while we are upright, so people are about 1 % (15–20 mm) shorter in the evening than in the morning. People stand relaxed and sit slumped, a few centimetres below the erect table values; they wear shoes and clothes ([[clothing-ppe-allowances]]); and the data describe only the people measured, when they were measured ([[population-differences]], [[age-children-elderly]]).

### Different settings, different data
Homes and public spaces serve everybody, from children to wheelchair users, and need civilian data with the widest spread; offices need the seated dimensions of working-age adults; workshops need standing heights in safety footwear and reaches in gloves; the military and vehicle makers survey their own populations (such as ANSUR II), also in equipment; field work adds bulky clothing and PPE to every dimension.

> [!warn] The data in this app are representative, rounded values for adults, good for learning and first estimates. For a real design use a survey of the actual users, the relevant standard, allowances for clothing and posture, and a trial with real people.

> [!key] A number means nothing without its definition: which landmarks, which posture, which population, clothed or not. Check all four before designing with a table — and measure a dozen real users on the critical dimensions to see whether the table fits them.
`,
  ideas: [
    'ISO 7250-1 defines each body dimension by its landmarks, posture and instrument, so that surveys can be compared.',
    'Static dimensions are measured still and erect; functional dimensions while reaching, moving or working.',
    'Tables are nude, barefoot, erect and for one population: the designer adds allowances for shoes, clothing, posture and the real users.',
    'A survey\'s precision grows with the square root of its size; tails such as the 95th percentile need more people than the mean.',
    'People are about 1 % shorter in the evening than in the morning, and a few centimetres lower when relaxed.'
  ],
  pitfalls: [
    'A body dimension is a fixed number for each person — It changes through the day, with posture, with age and with what the person wears; the table gives one standardised version of it.',
    'Any table of "body sizes" will do — Tables differ in definition, posture, clothing and population; mixing them, or using another country\'s or another decade\'s data, gives errors of several centimetres.',
    'Measuring a few colleagues is as good as a survey — A handful of people checks a table; it cannot give reliable 5th or 95th percentiles, which need hundreds to thousands of people.'
  ],
  formulas: [
    {
      name: 'People to measure for a percentile of given precision',
      expr: 'n = (zc*s*sqrt(1 + zp^2/2)/d)^2', tex: 'n = \\left(\\dfrac{z_c\\,\\sigma\\sqrt{1 + z_p^2/2}}{\\delta}\\right)^2',
      vars: {
        n: { name: 'people to measure (of one sex)', q: 'count' },
        zc: { name: 'confidence factor (1.96 for 95 % confidence)', q: 'none', value: 1.96, tex: 'z_c' },
        s: { name: 'standard deviation of the dimension', q: 'length', unit: 'mm', value: 70, tex: '\\sigma' },
        zp: { name: 'z of the percentile wanted (0 for the mean, 1.645 for the 5th or 95th)', q: 'none', value: 1.645, tex: 'z_p' },
        d: { name: 'precision wanted (plus or minus)', q: 'length', unit: 'mm', value: 5, tex: '\\delta' }
      },
      note: 'For a normally distributed dimension: the standard error of a percentile is σ√(1 + z²/2)/√n. With zp = 0 it is the familiar σ/√n of a mean.',
      stories: { n: 'Men\'s stature has a standard deviation of {s}. How many men must be measured to know the percentile with z = {zp} within {d}, with a confidence factor of {zc}?', d: 'A survey of {n} people, standard deviation {s}: how precise is the percentile with z = {zp} (confidence factor {zc})?' }
    },
    {
      name: 'A dimension estimated from stature',
      expr: 'x = k*S', tex: 'x = k\\,S',
      vars: {
        x: { name: 'estimated dimension', q: 'length', unit: 'mm' },
        k: { name: 'ratio of the dimension to stature (0.936 eye height, 0.818 shoulder, 0.630 elbow, 0.530 hip joint)', q: 'none', value: 0.936 },
        S: { name: 'stature', q: 'length', unit: 'mm', value: 1755 }
      },
      note: 'Proportions after Drillis and Contini (1966), for sketches and manikins only: individuals and populations differ in proportions, so use measured data for the critical dimensions.',
      stories: { x: 'A person is {S} tall. Estimate the dimension whose ratio to stature is {k}.', S: 'A dimension of {x} has a ratio of {k} to stature. Estimate the stature.' }
    }
  ],
  examples: [
    {
      title: 'How many people must a survey measure?',
      q: 'Stature has a standard deviation of 70 mm among men. How many men must be measured to know (a) the mean and (b) the 95th percentile within ±5 mm, with 95 % confidence?',
      steps: [
        'Mean ($z_p = 0$): $n = (1.96 \\times 70 / 5)^2 = 27.4^2 = 753$ men.',
        '95th percentile ($z_p = 1.645$): the factor $1 + 1.645^2/2 = 2.35$ multiplies the sample: $n = 753 \\times 2.35 = 1772$ men.',
        'The same again for women. This is why serious surveys measure thousands of people — ANSUR II measured more than 6,000 soldiers.'
      ],
      a: 'About 750 men for the mean and about 1,770 for the 95th percentile, and as many women again.'
    },
    {
      title: 'Estimating a missing dimension',
      q: 'A sketch needs the eye height of the 95th-percentile man (stature 1870 mm), but only stature is known. Estimate it and compare it with the table (1752 mm).',
      steps: [
        'Eye height is about 0.936 of stature: $0.936 \\times 1870 = 1750$ mm.',
        'The table gives 1752 mm — within a few millimetres, because eye height and stature are almost perfectly correlated.',
        'For less closely linked dimensions (hip breadth, body mass, reach) proportional estimates can be several centimetres off: use measured data.'
      ],
      a: 'About 1750 mm — fine for a sketch; use the table for the design.'
    }
  ],
  quiz: [
    { q: 'Which of these is a functional (dynamic) measurement?', choices: ['How far a worker can reach across a bench while leaning to grasp a part', 'Popliteal height', 'Stature', 'Head circumference'], a: 0, why: 'A functional dimension is measured while doing a task; the others are static dimensions taken in a standard still posture.' },
    { q: 'Why do surveys measure people without shoes, in minimal clothing and in fixed erect postures?', choices: ['So that results are repeatable and comparable; the designer adds allowances for real footwear, clothing and posture', 'Because that is how people work', 'Because shoes and clothing make no difference', 'To make the numbers larger and safer'], a: 0, why: 'Standard conditions make data comparable between people and surveys. Real users wear shoes and clothes and slump, so the designer adds allowances.' },
    { q: 'People are tallest in the evening, after a day on their feet.', a: false, why: 'The other way round: the discs of the spine lose height while upright, so people are about 1 % shorter in the evening and recover overnight.' },
    { q: 'A survey of 100 women (stature σ = 64 mm) gives a 95th percentile of 1735 mm. Roughly how precise is it at 95 % confidence?', choices: ['About ±19 mm', 'About ±1 mm', 'About ±64 mm', 'Exact: it is measured'], a: 0, why: '$1.96 \\times 64 \\times \\sqrt{1 + 1.645^2/2} / \\sqrt{100} = 1.96 \\times 64 \\times 1.534 / 10 \\approx 19$ mm.' },
    { q: 'The Frankfurt plane is…', choices: ['a standard orientation of the head: the line from the ear opening to the lowest point of the eye socket held horizontal', 'the floor on which the subject stands', 'the plane through both shoulders', 'the seat surface of the sitting platform'], a: 0, why: 'Holding the head in the Frankfurt plane makes head, eye and stature measurements repeatable.' }
  ],
  problems: [
    { q: 'Sitting height has a standard deviation of 36 mm. How many people of one sex must be measured to know its mean within ±3 mm with 95 % confidence?', answer: 553, unit: 'people', tol: 0.02, steps: ['$n = (1.96 \\times 36 / 3)^2 = 23.52^2 \\approx 553$.'] },
    { q: 'Estimate the shoulder height of a man 1800 mm tall from the proportion 0.818.', answer: 1472, unit: 'mm', tol: 0.01, steps: ['$0.818 \\times 1800 = 1472$ mm.'] }
  ],
  ranges: [
    { dim: 'Posture allowance on standing heights (relaxed, not erect)', range: 'subtract about 10–40 mm', who: 'every standing height of a table: stature, eye, shoulder and elbow height', why: 'People stand relaxed: sightlines and reaches drawn from erect data are slightly optimistic.', limits: 'For clearances keep the erect (larger) values; the size of the slump varies from person to person.', setting: 'all', src: 'Kroemer and Grandjean, *Fitting the Task to the Human*' },
    { dim: 'Posture allowance on seated heights (slumped, not erect)', range: 'subtract about 30–60 mm', who: 'sitting height and seated eye and shoulder heights', why: 'Relaxed sitting lowers the eyes and shoulders: screens and sightlines set from erect eye height end up too high.', limits: 'Headroom above a seat still needs the erect sitting height, plus seat and vehicle motion.', setting: ['office', 'vehicle'], src: 'Kroemer and Grandjean, *Fitting the Task to the Human*' },
    { dim: 'Change of stature through the day', range: 'about 1 % (15–20 mm)', who: 'everyone: morning tallest, evening shortest', why: 'Explains small differences between surveys and between a user trial in the morning and use in the evening.', limits: 'Small next to shoes and posture; it matters for precise fitting such as seats and helmets.', setting: 'all', src: 'Studies of diurnal stature change; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'People to measure per sex for a 5th or 95th percentile of stature within ±5 mm', range: [1480, 1770], unit: 'people', who: 'one sex, stature σ = 64–70 mm, 95 % confidence', why: 'Tails rest on few people: percentiles need about 2.35 times the sample of a mean.', limits: 'For a 1st or 99th percentile, or for a skewed dimension such as body mass, more still.', setting: 'all', src: 'Standard sampling statistics; ISO 15535' }
  ],
  applications: [
    'National and military anthropometric surveys (ANSUR II, CAESAR) that feed standards and digital manikins.',
    'Sizing clothing, footwear, helmets and respirators from measured populations.',
    'Setting the dimensions of seats, desks, cabs and machines from standard body measurements: see [the body-size explorer](#/tools/bodysize/explorer).',
    'Measuring a sample of a company\'s own workforce before redesigning its workstations.'
  ],
  history: 'Adolphe Quetelet measured soldiers and conscripts in the 1830s and 1840s and showed that body sizes follow the normal curve. In the 1880s the Paris police adopted Alphonse Bertillon\'s system of identifying repeat offenders by a set of body measurements, until fingerprints replaced it early in the twentieth century. Large military surveys after the Second World War — and later ANSUR (1988) and ANSUR II (2012) — produced the data designers still use; ISO 7250 (first published in 1996) standardised the measurements and ISO 15535 the way surveys are run.',
  sources: [
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1: Body measurement definitions and landmarks*.',
    'ISO/TR 7250-2, *Basic human body measurements for technological design — Part 2: Statistical summaries of body measurements from national populations*.',
    'ISO 15535, *General requirements for establishing anthropometric databases*.',
    'C. C. Gordon et al., *2012 Anthropometric Survey of U.S. Army Personnel: Methods and Summary Statistics* (ANSUR II), US Army Natick.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace: Anthropometry, Ergonomics and the Design of Work* — the principles and methods of anthropometry.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human* — body sizes and design allowances.'
  ],
  sim: 'an-landmarks'
},

{
  id: 'percentiles', parent: 'body-dimensions', title: 'Percentiles', level: 1,
  short: 'A percentile is the size a given share of people are smaller than: the 95th-percentile man\'s stature is exceeded by only 5 % of men. For a normally distributed dimension it is the mean plus z standard deviations; for a mixed population, for skewed data such as body mass and in the far tails, it needs more care.',
  keywords: ['percentile', '5th percentile', '95th percentile', '50th percentile', 'z-score', 'normal distribution', 'standard deviation', 'mean', 'coefficient of variation', 'mixed population', 'bimodal', 'skewed distribution', 'log-normal', 'design limits', 'percentile rank'],
  prereq: ['anthropometry-basics', 'design-for-range', 'math:normal-distribution'],
  related: ['combining-percentiles', 'sex-differences', 'population-differences', 'mass-strength-data', 'standing-dimensions', 'math:standard-deviation', 'math:descriptive-statistics'],
  body: `
A percentile answers one question: *what share of people are smaller than this?* The 5th-percentile woman's stature is the height that 5 % of women are below and 95 % above. Percentiles let a designer say exactly whom a dimension fits — and whom it leaves out.

### The normal curve
Most body lengths within one sex follow the bell-shaped [[?gaussian|normal distribution]] closely enough for design. It is fixed by two numbers, the [[?mean|mean]] $\\mu$ and the [[?standard-deviation|standard deviation]] $\\sigma$: about 68 % of people lie within $\\pm 1\\sigma$ of the mean, 95 % within $\\pm 1.96\\sigma$. A percentile is

$$x_p = \\mu + z_p\\,\\sigma$$

with $z_p$ from the standard normal distribution: ±1.645 for the 5th and 95th, ±2.326 for the 1st and 99th. The other way round, a value $x$ sits at the percentile $p = \\Phi(z)$, where $z = (x-\\mu)/\\sigma$. With this app's representative data a man 1800 mm tall is at the 74th percentile of men — and at the 99.7th of women.

| Dimension (representative) | Men μ ± σ | Women μ ± σ | 5th woman | 50th man | 95th man | CV |
|---|---|---|---|---|---|---|
| Stature (mm) | 1755 ± 70 | 1625 ± 64 | 1520 | 1755 | 1870 | 4 % |
| Elbow height standing (mm) | 1100 ± 50 | 1015 ± 46 | 939 | 1100 | 1182 | 4.5 % |
| Popliteal height (mm) | 445 ± 28 | 405 ± 26 | 362 | 445 | 491 | 6–6.5 % |
| Hip breadth sitting (mm) | 370 ± 27 | 395 ± 34 | 339 | 370 | 414 | 7–9 % |
| Forward grip reach (mm) | 800 ± 38 | 730 ± 36 | 671 | 800 | 863 | 5 % |
| Body mass (kg) | 85 ± 14 | 68 ± 13 | 47 | 85 | 108 | 16–19 % |

The **coefficient of variation** $\\mathrm{CV} = \\sigma/\\mu$ compares spreads: lengths vary by 3–6 %, breadths by 5–10 %, body mass by 15–20 % and strength by 20 % or more. The larger the CV, the wider the range a design must span.

### Mixed populations
A workforce of men and women is not one bell but two, added in proportion to their numbers. Its percentiles are **not** the averages of the men's and the women's. For equal numbers the 95th percentile of stature is about 1845 mm, not (1870 + 1730)/2 = 1800 mm; the 5th is about 1543 mm, not 1580. Designing from the 5th-percentile woman to the 95th-percentile man covers about 95 % of an equal mix on one dimension. In the simulation, change the share of men and watch the mixed curve, and its percentiles, move.

### When the bell does not fit
- **Skewed dimensions.** Body mass, strength and some breadths have a long tail of large values. A normal model then underestimates the heaviest and strongest users; use the survey's own percentiles or a log-normal model ([[mass-strength-data]]).
- **The tails are uncertain.** The 1st and 99th percentiles rest on few people and vary from survey to survey ([[anthropometry-basics]]).
- **One dimension at a time.** The 95th percentile of stature is not the 95th of arm length or hip breadth for the same person ([[combining-percentiles]]).

In the simulation, draw a sample of people and compare its 95th percentile with the true one: with 50 people it wanders by a few centimetres, with 5,000 by a few millimetres.

### Choosing the percentile
| Design case | Typical limits | Examples | Settings |
|---|---|---|---|
| Comfort and convenience | 5th–95th percentile | seat, desk and shelf heights | office, home, workshop |
| Exclusion is costly | 1st–99th or wider, plus an alternative | exits, handrails, emergency controls | public buildings, health care, transport |
| Protection from injury | beyond the 99th, fixed by standard | reach through guard openings ([[safety-distances]]) | industry |
| A selected population | 5th–95th or 1st–99th of that population, in equipment | crew stations, cockpits | military, aviation |
| Neither end matters | about the 50th | door handle, a typical view | everywhere |

**Virtues.** Percentiles make the choice of whom to accommodate explicit and measurable, and let a design be compared with the population it serves. **Limits.** They describe one dimension of one population, measured nude and erect; they cannot tell whether a whole body fits, and the 5 % outside "5th to 95th" are real people who need another way in.

> [!warn] The share left out adds up: 5 % on each of several independent dimensions excludes far more than 5 % overall — check the combination with a manikin or a trial.

> [!key] $x_p = \\mu + z_p\\sigma$ for one sex; for a mixed population combine the two distributions, not their percentiles.
`,
  ideas: [
    'The p-th percentile is the value p % of people are smaller than; for a normal dimension x = μ + zσ.',
    'z is ±1.645 for the 5th and 95th percentiles and ±2.326 for the 1st and 99th.',
    'Percentiles of a mixed population come from the combined distribution, not from averaging the men\'s and women\'s percentiles.',
    'The coefficient of variation compares spreads: about 4 % for stature, 15–20 % for body mass, 20 % or more for strength.',
    'Skewed dimensions, far tails and several dimensions at once all need more than the normal model.'
  ],
  pitfalls: [
    'The 95th percentile of a mixed group is the average of the men\'s and women\'s 95th percentiles — The mixed distribution is dominated at the top by men: for equal numbers its 95th percentile of stature is about 1845 mm, not 1800 mm.',
    'The 50th percentile is "the average person" and suits most people — Half the users are above it and half below; it suits only dimensions where being a little off harms nobody.',
    'Any body dimension is normally distributed — Body mass and strength are skewed to the right: the normal model underestimates the heaviest and strongest users.'
  ],
  formulas: [
    {
      name: 'The percentile of a given value',
      expr: 'p = ncdf((x - mu)/s)', tex: 'p = \\Phi\\!\\left(\\dfrac{x - \\mu}{\\sigma}\\right)',
      vars: {
        p: { name: 'percentile (share of the group below x)', q: 'ratio', unit: '%' },
        x: { name: 'the value', q: 'length', unit: 'mm', value: 1800 },
        mu: { name: 'mean of the group', q: 'length', unit: 'mm', value: 1755, tex: '\\mu' },
        s: { name: 'standard deviation of the group', q: 'length', unit: 'mm', value: 70, tex: '\\sigma' }
      },
      note: 'Φ is the standard normal cumulative distribution. For one sex and a normally distributed dimension.',
      stories: { p: 'Men\'s stature is {mu} with a standard deviation of {s}. At what percentile is a man {x} tall?', x: 'Men\'s stature is {mu} with a standard deviation of {s}. What stature is the percentile {p}?' }
    },
    {
      name: 'The percentile of a value in a mixed population',
      expr: 'P = w*ncdf((x - mum)/sm) + (1 - w)*ncdf((x - muf)/sf)', tex: 'P = w\\,\\Phi\\!\\left(\\dfrac{x - \\mu_m}{\\sigma_m}\\right) + (1 - w)\\,\\Phi\\!\\left(\\dfrac{x - \\mu_f}{\\sigma_f}\\right)',
      vars: {
        P: { name: 'share of the mixed population below x', q: 'ratio', unit: '%' },
        w: { name: 'share of men', q: 'ratio', unit: '%', value: 50 },
        x: { name: 'the value', q: 'length', unit: 'mm', value: 1845 },
        mum: { name: 'mean of the men', q: 'length', unit: 'mm', value: 1755, tex: '\\mu_m' },
        sm: { name: 'standard deviation of the men', q: 'length', unit: 'mm', value: 70, tex: '\\sigma_m' },
        muf: { name: 'mean of the women', q: 'length', unit: 'mm', value: 1625, tex: '\\mu_f' },
        sf: { name: 'standard deviation of the women', q: 'length', unit: 'mm', value: 64, tex: '\\sigma_f' }
      },
      note: 'Solve for x to find a percentile of the mixed population (1845 mm is the 95th of stature for equal numbers).',
      stories: { P: 'In a workforce with {w} men, what share is shorter than {x}?', x: 'In a workforce with {w} men, what stature is exceeded by only 100 % − {P} of the people?' }
    },
    {
      name: 'Coefficient of variation',
      expr: 'CV = s/mu', tex: '\\mathrm{CV} = \\dfrac{\\sigma}{\\mu}',
      vars: {
        CV: { name: 'coefficient of variation', q: 'ratio', unit: '%', tex: '\\mathrm{CV}' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 28, tex: '\\sigma' },
        mu: { name: 'mean', q: 'length', unit: 'mm', value: 445, tex: '\\mu' }
      },
      note: 'Compares the relative spread of dimensions of different size: popliteal height (6.3 %) varies more than stature (4 %).',
      stories: { CV: 'A dimension has a mean of {mu} and a standard deviation of {s}. What is its coefficient of variation?' }
    }
  ],
  examples: [
    {
      title: 'The 95th percentile of a mixed workforce',
      q: 'Half the users are men (stature 1755 ± 70 mm), half women (1625 ± 64 mm). Show that 1845 mm, not 1800 mm, is the 95th percentile of the whole group.',
      steps: [
        'Men below 1845 mm: $z = (1845 - 1755)/70 = 1.29$, $\\Phi = 90.1$ %.',
        'Women below 1845 mm: $z = (1845 - 1625)/64 = 3.44$, $\\Phi = 99.97$ %.',
        'Together: $0.5 \\times 90.1 + 0.5 \\times 99.97 = 95.0$ %.',
        'At 1800 mm only $0.5 \\times 74.0 + 0.5 \\times 99.7 = 86.8$ % are below — averaging the two 95th percentiles would leave 13 % of the group taller than the "95th percentile".'
      ],
      a: 'About 1845 mm; the average of 1870 and 1730 mm is only the 87th percentile.'
    },
    {
      title: 'Where does a person sit in the table?',
      q: 'A woman is 1600 mm tall. Where is she among women (1625 ± 64 mm) and among men (1755 ± 70 mm)?',
      steps: [
        'Among women: $z = (1600 - 1625)/64 = -0.39$, the 35th percentile.',
        'Among men: $z = (1600 - 1755)/70 = -2.21$, about the 1st percentile.',
        'A design set for the 5th-percentile man (1640 mm) would already be too big for her and for nearly half of all women.'
      ],
      a: 'The 35th percentile of women, but only about the 1st of men.'
    }
  ],
  quiz: [
    { q: 'Women\'s stature is 1625 ± 64 mm. About what share of women are between 1561 and 1689 mm?', choices: ['About 68 %', 'About 95 %', 'About 50 %', 'About 90 %'], a: 0, why: 'The range is the mean ± one standard deviation, which holds about 68 % of a normal distribution.' },
    { q: 'For an equal mix of men and women, the 95th percentile of stature is…', choices: ['about 1845 mm — above the average of the two 95th percentiles', 'exactly 1800 mm, the average of 1870 and 1730 mm', '1870 mm, the men\'s 95th percentile', '1730 mm, the women\'s 95th percentile'], a: 0, why: 'The top of the mixed distribution is mostly men, so its 95th percentile is close to the men\'s 90th — about 1845 mm.' },
    { q: 'A normal model of body mass gives good estimates of the heaviest 1 % of users.', a: false, why: 'Body mass is skewed to the right: the real heavy tail is longer than the normal curve predicts, so seats, beds and platforms need the survey\'s own high percentiles.' },
    { q: 'If a dimension\'s standard deviation doubled at the same mean, its 95th percentile would…', choices: ['move twice as far above the mean', 'double', 'stay the same', 'move to the 99th percentile'], a: 0, why: '$x_{95} = \\mu + 1.645\\sigma$: doubling σ doubles the distance above the mean, not the value itself.' },
    { q: 'What is $z$ for the 99th percentile?', answer: 2.326, why: 'Φ(2.326) = 0.99: the 99th percentile lies 2.33 standard deviations above the mean.' }
  ],
  problems: [
    { q: 'Men\'s forward grip reach is 800 ± 38 mm. What is the reach of the 5th-percentile man?', answer: 737.5, unit: 'mm', tol: 0.005, steps: ['$x = 800 - 1.645 \\times 38 = 737.5$ mm.'] },
    { q: 'A shelf needs a vertical grip reach of 1850 mm. Women\'s grip reach is 1910 ± 85 mm. What share of women can reach it?', answer: 76, unit: '%', tol: 0.02, steps: ['$z = (1850 - 1910)/85 = -0.71$.', 'Share above: $1 - \\Phi(-0.71) = \\Phi(0.71) = 0.76$, about 76 %.'] }
  ],
  ranges: [
    { dim: 'Design limits for comfort and convenience', range: '5th–95th percentile', who: 'the 5th-percentile woman to the 95th-percentile man', why: 'Fits about 95 % of an equal mix of men and women on one dimension, at a modest cost in adjustment.', limits: 'On several dimensions at once fewer people fit; the few per cent outside need an alternative (a step, a footrest, another size).', setting: ['office', 'civil', 'workshop'], src: 'Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Design limits where exclusion is costly', range: '1st–99th percentile or wider', who: 'the whole public: very small and very large people, children, older and disabled people', why: 'Exits, handrails, public toilets and emergency controls must work for almost everyone.', limits: 'The far tails are poorly known; add alternatives (a second handrail, a lower counter) rather than one extreme size.', setting: ['civil', 'health', 'vehicle'], src: 'Pheasant and Haslegrave, *Bodyspace*; ISO 21542' },
    { dim: 'Safety distances at guards', range: 'beyond the 99th percentile', who: 'the longest reaches and the smallest fingers and hands, as fixed in the standard', why: 'A single failure is an injury, so nearly nobody may reach the hazard.', limits: 'Use the standard\'s values, not your own percentiles.', setting: 'workshop', src: 'ISO 13857' },
    { dim: 'Crew stations and equipment for a service population', range: '5th–95th percentile at least, of that population, equipped', who: 'the actual (selected) personnel, in their clothing and equipment', why: 'Everybody who may be assigned to the post can operate it safely.', limits: 'Selected populations change over time; women and new recruits may lie outside older data.', setting: 'military', src: 'MIL-STD-1472; DEF STAN 00-250' },
    { dim: 'Dimensions where neither end is critical', range: 'about the 50th percentile', who: 'the middle of the population', why: 'Being a little high or low costs nobody much: a door handle, a typical view height.', limits: 'Never for clearances, reaches or safety.', setting: 'all', src: 'Pheasant and Haslegrave, *Bodyspace*' }
  ],
  applications: [
    'Setting adjustment ranges for chairs, desks and vehicle seats from the 5th and 95th percentiles.',
    'Checking what share of a mixed workforce a fixed design fits: see [the body-size explorer](#/tools/bodysize/explorer).',
    'Sizing ranges of clothing, gloves and helmets from the percentiles of the user population.',
    'Specifying accommodation in procurement: "5th-percentile woman to 95th-percentile man, in winter clothing".'
  ],
  history: 'Adolphe Quetelet showed in the 1830s and 1840s that measurements of soldiers follow the normal curve, and Francis Galton ranked human measurements by percentiles in his anthropometric work of the 1880s. Percentile charts entered industrial design with Henry Dreyfuss\'s *The Measure of Man* (1960).',
  sources: [
    'ISO 15535, *General requirements for establishing anthropometric databases* — how percentiles are computed and reported.',
    'ISO/TR 7250-2, *Statistical summaries of body measurements from national populations*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — the statistics of anthropometry and the choice of percentiles.',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design* — applied anthropometry.',
    'H. Dreyfuss, *The Measure of Man: Human Factors in Design*.'
  ],
  sim: ['an-normal', 'ref-percentiles']
},

{
  id: 'standing-dimensions', parent: 'body-dimensions', title: 'Dimensions standing', level: 1,
  short: 'The heights of a standing person — stature, eye, shoulder, elbow and knuckle height, and the highest grip reach — set headroom, sightlines, work-surface heights, the zone for frequent handling and the highest shelf. Each is limited by one end of the population, and a mixed workforce spans about 240 mm at the elbow.',
  keywords: ['standing dimensions', 'stature', 'eye height', 'shoulder height', 'elbow height', 'knuckle height', 'vertical grip reach', 'shoulder breadth', 'headroom', 'work surface height', 'frequent handling zone', 'sightline', 'partition height', 'walkway width', 'line of sight'],
  prereq: ['anthropometry-basics', 'percentiles'],
  related: ['standing-work-heights', 'workbench-design', 'storage-heights', 'doors-corridors', 'functional-reach', 'clothing-ppe-allowances', 'displays-design', 'counters-reception', 'niosh-lifting-equation'],
  body: `
A standing person is a stack of landmarks: the eyes at about 94 % of stature, the shoulders at 82 %, the elbows at 63 %, the knuckles of the hanging hand at about 44 %, and the grip of the raised hand at about 117 %. Each landmark sets a family of design heights, and each family is limited by one end of the population.

| Standing dimension (barefoot) | 5th woman | 50th woman | 50th man | 95th man | Sets |
|---|---|---|---|---|---|
| Stature | 1520 | 1625 | 1755 | 1870 | headroom, doors, overhead obstructions |
| Eye height | 1413 | 1515 | 1640 | 1752 | sightlines, signs, displays, partitions |
| Shoulder height | 1235 | 1330 | 1440 | 1545 | top of the frequent reach zone |
| Elbow height | 939 | 1015 | 1100 | 1182 | work-surface heights |
| Knuckle height | 667 | 725 | 765 | 828 | bottom of the frequent zone, handles of carried loads |
| Vertical grip reach | 1770 | 1910 | 2060 | 2208 | highest shelf or control |
| Shoulder breadth | 374 | 415 | 480 | 526 | passage widths, spacing of people |

(Millimetres, this app's representative adults; add 25–45 mm of shoes to every height — see [[clothing-ppe-allowances]].)

The simulation lines up people of different sex and percentile at true scale. Drag the design line — a bench, a shelf, a partition, an overhead beam or a handle — and see for whom it works, and what share of a mixed population it suits.

### Headroom: the tallest decide
Anything people walk under must clear the tallest users with shoes, a helmet if they wear one, and the rise and fall of the head in walking. The 99th-percentile man is 1918 mm tall; with 25–40 mm of footwear and 30–50 mm of helmet he needs 2000 mm before any margin. Walkways and working platforms at machinery therefore keep at least **2100 mm** of clear height (ISO 14122-2), and doors are rarely lower than 2000 mm.

### Sightlines: the shortest see over, the tallest see under
At rest the line of sight falls some 10–15° below the horizontal, so displays and signs read often should sit at or a little below eye height. A partition that everyone standing must see over has to stay below the **5th-percentile woman's eye height** (about 1440 mm in shoes); one that must screen standing people completely has to rise above the **95th-percentile man's** (about 1780 mm). Between the two, some see over and some do not — sometimes exactly what an open-plan office wants.

### The frequent handling zone
Frequent lifts, picks and controls belong between the **knuckle height of the tallest** users (about 850 mm in shoes) and the **shoulder height of the smallest** (about 1260 mm): nobody then stoops below the knuckles or lifts above the shoulder. The revised NIOSH equation ([[niosh-lifting-equation]]) penalises lifts that start near the floor or end high for the same reason. The zone is narrow: keep it for the heaviest and most frequent items, and put light, rarely used things above and below it.

### Work surfaces: the elbow decides
Work-surface heights follow elbow height (Grandjean's rules, see [[standing-work-heights]]): about 50–100 mm **above** the elbow for precise, visually demanding work, 100–150 mm **below** for light work, 150–400 mm below for heavy work that uses body weight. The catch is the spread: in shoes, elbow height runs from about 965 mm (5th-percentile woman) to 1205 mm (95th-percentile man) — 240 mm. A fixed bench suits a narrow slice of users; an adjustable bench, platforms for the small or a choice of benches serves the rest.

### Reach up and passage widths
The highest shelf everyone can use at full stretch is the **5th-percentile woman's grip reach**, about 1770 mm; frequent use belongs below the shoulder ([[storage-heights]], [[functional-reach]]). Widths follow the **largest shoulder breadth** plus clothing and sway: 526 mm for the 95th-percentile man, so walkways at machinery are at least 600 mm clear and wider where people pass or carry things.

### Different settings
| Setting | Who stands there | What they add | Consequence |
|---|---|---|---|
| Home and public | everyone, including children and older people | ordinary shoes, bags | lower reach limits, handrails and counters at two heights |
| Shops and offices | working-age adults, standing briefly | shoes, heels | counters near elbow height, displays at eye height |
| Workshop and industry | workers standing for hours | safety boots, helmets, gloves | adjustable benches, anti-fatigue mats, headroom 2100 mm |
| Military | selected personnel, equipped | boots, helmets, body armour, packs | clearances with equipment, reaches in gloves |
| Field work | outdoor workers | boots, winter clothing, harnesses | uneven ground: heights vary with footing |

> [!warn] All the heights above are erect and barefoot. Shoes raise them by 25–45 mm; relaxed standing lowers them by 10–40 mm; a helmet adds 30–50 mm to stature. Put the allowances in before comparing with a design.

> [!key] Headroom from the tallest, reach and sightlines over from the shortest, work surfaces from the elbow — and a mixed workforce spans about 240 mm at the elbow, so fixed standing heights fit few people well.
`,
  ideas: [
    'Standing heights stack in proportion to stature: eyes about 94 %, shoulders 82 %, elbows 63 %, knuckles 44 %, grip reach 117 %.',
    'Headroom is set by the tallest users with shoes and helmets; walkways at machinery keep 2100 mm clear.',
    'Frequent handling belongs between the tallest users\' knuckle height and the smallest users\' shoulder height.',
    'Standing work surfaces follow elbow height, which spans about 240 mm from the 5th-percentile woman to the 95th-percentile man.',
    'Partitions to see over are set by the shortest eyes; partitions that screen are set by the tallest.'
  ],
  pitfalls: [
    'A standard 900 mm bench suits everyone for standing work — It suits light work for people of about median height; tall users stoop and small users raise their shoulders, and precise work needs a surface above the elbow.',
    'If the tallest can reach it, everyone can — Reach is limited by the smallest users; the tallest limit clearances.',
    'Anthropometric heights can be used as they are — Tables are barefoot and erect: shoes, helmets and relaxed posture shift every height by several centimetres.'
  ],
  formulas: [
    {
      name: 'A standing work-surface height from elbow height',
      expr: 'h = Eh + a - dE', tex: 'h = h_E + a_s - d_E',
      vars: {
        h: { name: 'work-surface height', q: 'length', unit: 'mm' },
        Eh: { name: 'elbow height, standing (barefoot)', q: 'length', unit: 'mm', value: 1100, tex: 'h_E' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        dE: { name: 'distance below the elbow (negative: above it, for precision work)', q: 'length', unit: 'mm', value: 125, signed: true, tex: 'd_E' }
      },
      note: 'Grandjean\'s rules: d from −100 to −50 mm (above the elbow) for precision work, 100–150 mm for light work, 150–400 mm for heavy work.',
      stories: { h: 'A worker\'s elbow height is {Eh}, the shoes add {a}, and the work should be {dE} below the elbow. How high should the bench be?', dE: 'A bench is {h} high; the worker\'s elbow height is {Eh} and the shoes add {a}. How far below the elbow is the work?' }
    },
    {
      name: 'Angle of view to a display below eye height',
      expr: 'theta = atan((ye - yd)/D)', tex: '\\theta = \\arctan\\dfrac{y_e - y_d}{D}',
      vars: {
        theta: { name: 'angle of the sightline below the horizontal', q: 'angle', unit: '°', signed: true, tex: '\\theta' },
        ye: { name: 'eye height (with shoes)', q: 'length', unit: 'mm', value: 1665, tex: 'y_e' },
        yd: { name: 'height of the display or sign', q: 'length', unit: 'mm', value: 1500, tex: 'y_d' },
        D: { name: 'horizontal viewing distance', q: 'length', unit: 'mm', value: 2000 }
      },
      note: 'Negative angles mean the display is above the eyes. The resting line of sight is some 10–15° below the horizontal.',
      stories: { theta: 'Eyes at {ye} look at a sign at {yd}, {D} away. How far below the horizontal is the sightline?', yd: 'A viewer with eyes at {ye} should look down {theta} at a display {D} away. How high should it be?' }
    }
  ],
  examples: [
    {
      title: 'One bench for a mixed workforce?',
      q: 'Light assembly should be 100–150 mm below the elbow. Elbow heights are 939 mm (5th-percentile woman) and 1182 mm (95th-percentile man); shoes add 25 mm. Can one fixed bench height suit both?',
      steps: [
        '5th-percentile woman: $939 + 25 - 150 = 814$ to $939 + 25 - 100 = 864$ mm.',
        '95th-percentile man: $1182 + 25 - 150 = 1057$ to $1182 + 25 - 100 = 1107$ mm.',
        'The two bands do not overlap: a 950 mm bench is almost 90 mm too high for her and more than 100 mm too low for him.',
        'An adjustable bench covering about 815–1105 mm fits both; a fixed bench near 1050 mm with platforms for smaller users is the next best choice for a mostly male workforce.'
      ],
      a: 'No: the ideal heights run from about 815 to 1105 mm, so the bench must adjust (or platforms must make up the difference).'
    },
    {
      title: 'A sign read from 2 m',
      q: 'A sign\'s centre is 1500 mm above the floor, 2 m from the viewers. At what angle do the 5th-percentile woman (eyes 1438 mm in shoes) and the 95th-percentile man (1777 mm) look at it?',
      steps: [
        'Woman: $\\theta = \\arctan\\big((1438 - 1500)/2000\\big) = -1.8°$ — just above her eye line.',
        'Man: $\\theta = \\arctan\\big((1777 - 1500)/2000\\big) = 7.9°$ below the horizontal.',
        'Both are within a comfortable band around the resting line of sight; a sign at 1800 mm would make the shorter viewers look up by almost 10°.'
      ],
      a: 'About 2° above the horizontal for her and 8° below for him — a good compromise height.'
    }
  ],
  quiz: [
    { q: 'Which body dimension sets the height of a standing workbench?', choices: ['Elbow height', 'Stature', 'Knuckle height', 'Eye height'], a: 0, why: 'Work heights are given relative to the elbow: above it for precise work, below it for light and heavy work.' },
    { q: 'Which user limits the top of the zone for frequently handled items?', choices: ['The smallest users — their shoulder height', 'The tallest users — their shoulder height', 'The average user — elbow height', 'The tallest users — their grip reach'], a: 0, why: 'Frequent reaches above the shoulder strain the shoulder; the smallest users meet that limit first.' },
    { q: 'A partition 1500 mm high lets every standing adult see over it.', a: false, why: 'The 5th-percentile woman\'s eyes are about 1413 mm barefoot, 1440 mm in shoes — below 1500 mm.' },
    { q: 'In shoes, about how far apart are the elbow heights of the 5th-percentile woman and the 95th-percentile man?', choices: ['About 240 mm', 'About 50 mm', 'About 500 mm', 'About 100 mm'], a: 0, why: '1182 − 939 = 243 mm: why fixed standing work heights fit few people.' },
    { q: 'Which is the right order of standing heights, from low to high?', choices: ['knuckle, elbow, shoulder, eye, stature, grip reach', 'elbow, knuckle, shoulder, eye, grip reach, stature', 'knuckle, elbow, eye, shoulder, stature, grip reach', 'knuckle, shoulder, elbow, eye, stature, grip reach'], a: 0, why: 'About 44, 63, 82, 94, 100 and 117 % of stature.' }
  ],
  problems: [
    { q: 'Precision work should be about 75 mm above the elbow. What bench height suits the 5th-percentile woman (elbow height 939 mm) in 25 mm shoes?', answer: 1039, unit: 'mm', tol: 0.01, steps: ['$h = 939 + 25 + 75 = 1039$ mm — above the height of most fixed benches.'] },
    { q: 'Eyes at 1665 mm look at a display 1400 mm high, 1500 mm away. How far below the horizontal is the sightline?', answer: 10, unit: '°', tol: 0.02, steps: ['$\\theta = \\arctan(265/1500) = 10.0°$.'] }
  ],
  ranges: [
    { dim: 'Clear height over walkways and working platforms', range: [2100, null], unit: 'mm', who: '99th-percentile man (1918 mm) with safety footwear and a helmet, plus the bob of walking', why: 'Nobody ducks or strikes a beam, pipe or duct while walking or carrying.', limits: 'Door leaves may be a little lower because people pass through quickly; very tall populations and raised platforms need more.', setting: ['workshop', 'civil'], src: 'ISO 14122-2; building codes' },
    { dim: 'Frequent handling zone (shelves, controls, pick locations)', range: [850, 1260], unit: 'mm', who: 'from the 95th-percentile man\'s knuckle height to the 5th-percentile woman\'s shoulder height, in 25 mm shoes', why: 'No stooping below the knuckles and no reaching above the shoulder for repeated tasks.', limits: 'A narrow band: keep it for heavy and frequent items; light, rarely used items can go above or below.', setting: ['workshop', 'office', 'civil'], src: 'Derived from representative data; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Elbow height standing, in shoes (the reference for standing work surfaces)', range: [965, 1205], unit: 'mm', who: '5th-percentile woman to 95th-percentile man', why: 'Work surfaces are set relative to it: above for precision, 100–150 mm below for light work, 150–400 mm below for heavy work.', limits: 'The 240 mm spread means adjustable or several heights; see [[standing-work-heights]].', setting: ['workshop', 'civil'], src: 'Representative data; Kroemer and Grandjean' },
    { dim: 'Top of a partition every standing adult can see over', range: [null, 1400], unit: 'mm', who: '5th-percentile woman\'s eye height (1413 mm barefoot, about 1440 mm in shoes)', why: 'Standing people keep visual contact across an office or a counter.', limits: 'Children and wheelchair users see much lower: seated eye heights are 1100–1350 mm.', setting: ['office', 'civil'], src: 'Derived from representative data' },
    { dim: 'Partition that screens standing people completely', range: [1800, null], unit: 'mm', who: '95th-percentile man\'s eye height in shoes (about 1780 mm)', why: 'Privacy and fewer visual distractions for everyone behind it.', limits: 'Taller users and raised floors see over; high partitions darken spaces and block air.', setting: ['office', 'health'], src: 'Derived from representative data' },
    { dim: 'Clear width of a walkway at machinery', range: [600, null], unit: 'mm', who: '95th-percentile man\'s shoulder breadth (526 mm) plus clothing and sway', why: 'One person walks without brushing machines or guards.', limits: 'Wider where people pass, carry loads or wear bulky PPE, and for escape routes (national codes).', setting: 'workshop', src: 'ISO 14122-2' }
  ],
  applications: [
    'Headroom under ducts, pipes and mezzanines in plants and workshops.',
    'Heights of standing workbenches, counters and assembly lines; see [the workstation fitter](#/tools/workstation/standing).',
    'Warehouse and kitchen storage: the frequent zone for heavy and often used items.',
    'Heights of signs, displays and partitions in offices, stations and shops.'
  ],
  history: 'Etienne Grandjean\'s rules for standing work heights — above the elbow for precision, below it for light and heavy work — came from his work physiology studies in Zurich and were spread by his textbook, later revised with Karl Kroemer as *Fitting the Task to the Human*.',
  sources: [
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1: Body measurement definitions and landmarks*.',
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'ISO 14122-2, *Safety of machinery — Permanent means of access to machinery — Part 2: Working platforms and walkways*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human* — working heights standing.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — standing dimensions and their use.'
  ],
  sim: ['an-lineup', 'an-landmarks']
},

{
  id: 'sitting-dimensions', parent: 'body-dimensions', title: 'Dimensions sitting', level: 1,
  short: 'Sitting folds the body at the hips and knees, and a handful of seated dimensions set a seat and the space around it: popliteal height the seat height, buttock–popliteal length the depth, hip breadth the width, knee height and thigh thickness the room under a table, buttock–knee length the spacing of rows, sitting height the headroom.',
  keywords: ['sitting dimensions', 'sitting height', 'eye height sitting', 'shoulder height sitting', 'elbow rest height', 'thigh clearance', 'knee height', 'popliteal height', 'buttock-knee length', 'buttock-popliteal length', 'hip breadth', 'seat depth', 'seat width', 'seat height', 'seat pitch', 'knee room', 'legroom', 'headroom sitting'],
  prereq: ['anthropometry-basics', 'percentiles'],
  related: ['office-chair', 'desk-height', 'dining-tables-chairs', 'vehicle-seating', 'public-transport', 'crew-stations', 'sofas-lounge', 'meeting-classroom', 'school-furniture'],
  body: `
A seated person is folded at the hips and knees, and the seat, the surface in front, the room for the knees and the space above the head all follow from a few seated dimensions. The first three are the seat itself; the rest are the space around it.

| Seated dimension | 5th woman | 95th woman | 5th man | 95th man | Sets |
|---|---|---|---|---|---|
| Popliteal height | 362 | 448 | 399 | 491 | seat height |
| Buttock–popliteal length | 439 | 531 | 454 | 546 | seat depth |
| Hip breadth | 339 | 451 | 326 | 414 | seat width |
| Elbow rest height | 189 | 281 | 196 | 294 | armrests, desk height above the seat |
| Thigh clearance | 129 | 181 | 140 | 190 | seat to underside of a desk |
| Knee height | 467 | 553 | 507 | 603 | underside of tables |
| Buttock–knee length | 532 | 628 | 561 | 659 | knee room, spacing of rows |
| Shoulder height | 509 | 611 | 547 | 653 | backrest height, reach |
| Eye height | 686 | 794 | 737 | 853 | screen and sightline heights |
| Sitting height | 799 | 911 | 856 | 974 | headroom above the seat |

(Millimetres, representative adults, barefoot and sitting erect; seated heights are measured from the seat surface.)

### The seat
- **Height** from popliteal height — the underside of the thigh just behind the knee — plus about 25 mm of shoe. Higher, and the seat front presses under the thighs of short users whose feet no longer rest on the floor; lower, and the knees rise, the thighs lose support and weight moves onto the buttocks. The range from the 5th-percentile woman to the 95th-percentile man, about 390–515 mm with shoes, is why office chairs adjust over 400–510 mm ([[office-chair]]).
- **Depth** from buttock–popliteal length, limited by the **smallest** users: a seat deeper than their thighs presses into the calves, or makes them sit forward, away from the backrest. Leave about 50 mm behind the knee: roughly 390 mm for the 5th-percentile woman.
- **Width** from hip breadth, limited by the **largest** users — and here they are women: the 95th-percentile woman's hips (451 mm) are wider than the 95th-percentile man's (414 mm). Add clothing and room to move: about 500 mm between armrests.

### The space around the seat
- **Under a table**: the underside must clear the knees of the tallest users — 95th-percentile man's knee height 603 mm plus shoes — so about 650 mm or more; and there must be room for the thighs above the seat (190 mm for the 95th-percentile man) plus a little.
- **Ahead of the knees**: buttock–knee length (659 mm for the 95th-percentile man) plus clearance sets the knee room between rows of seats, from theatres to aircraft. Economy aircraft seats at a pitch of 710–810 mm (28–32 in) leave the tallest passengers with their knees against the seat in front.
- **Above the head**: erect sitting height (999 mm for the 99th-percentile man) plus a helmet, seat compression and vehicle motion sets the headroom in cabs, cockpits and bunks.

In the simulation a person of any sex and percentile sits on a seat with a desk, a seat in front and a roof: change the seat and the space around it and read, for each dimension, how much room there is and what share of a mixed population fits.

### Seated sightlines
Seated eye height above the floor is the seat height plus the seated eye height: from about 1050 mm (a small woman on a low seat) to 1350 mm (a tall man on a high seat). Screens should have their top at or a little below the eyes ([[monitor-placement]]); in lecture rooms and theatres each row must see over the heads in front ([[meeting-classroom]]).

### Different settings
| Setting | Seat | Special demands |
|---|---|---|
| Office | adjustable chair, 400–510 mm | long hours: adjustment, lumbar support, knee room under the desk |
| Home | fixed dining chairs (about 430–460 mm) and sofas | everybody from children to older people; rising from low, soft seats is hard |
| Schools | size-graded chairs and tables | growing children: several sizes ([[school-furniture]]) |
| Vehicles | seats with a reference point and adjustment tracks | pedals, steering and headroom at once ([[vehicle-seating]]) |
| Public transport, theatres | rows at a fixed pitch | knee room and hip width for large passengers |
| Military crew stations | seats for people in helmets, armour and cold-weather clothing | headroom and knee room with equipment ([[crew-stations]]) |

> [!warn] Seated tables are for erect sitting on a hard seat. A soft cushion sinks 20–50 mm, slumping lowers the eyes by a few centimetres, and winter clothing adds to hip breadth and thigh thickness.

> [!key] Seat height from the popliteal height of both ends (adjust), seat depth from the smallest thighs, seat width from the widest hips, knee room and headroom from the largest.
`,
  ideas: [
    'Seat height follows popliteal height plus shoes; the mixed-population range of about 390–515 mm is why office chairs adjust.',
    'Seat depth is limited by the smallest users\' buttock–popliteal length, less about 50 mm behind the knee.',
    'Seat width is limited by the widest hips — women\'s at the 95th percentile.',
    'Knee room, thigh room and headroom are clearances set by the largest users, with shoes, clothing and motion.',
    'Seated eye height above the floor depends on the seat as much as on the body.'
  ],
  pitfalls: [
    'A deeper seat is always more comfortable — Beyond the thigh length of small users it presses into their calves or pushes them away from the backrest.',
    'Seat widths should be set from the largest men — At the hips, the 95th-percentile woman is wider than the 95th-percentile man.',
    'The seat height that suits the desk suits the person — A seat raised to a fixed desk leaves the feet of small users hanging: they need a footrest, or the desk must adjust.'
  ],
  formulas: [
    {
      name: 'Seat pitch for knee clearance between rows',
      expr: 'p = L + t + c', tex: 'p = L_{BK} + t + c',
      vars: {
        p: { name: 'seat pitch (row spacing)', q: 'length', unit: 'mm' },
        L: { name: 'buttock–knee length of the largest user accommodated', q: 'length', unit: 'mm', value: 659, tex: 'L_{BK}' },
        t: { name: 'thickness of the seat back in front, at knee height', q: 'length', unit: 'mm', value: 60 },
        c: { name: 'clearance for clothing and movement', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'An estimate for upright seats in rows (theatres, buses, aircraft); reclining seats in front take more.',
      stories: { p: 'The largest passengers have a buttock–knee length of {L}; the seat back in front is {t} thick and {c} is left for clothing. What seat pitch is needed?', L: 'Seats are at a pitch of {p} with backs {t} thick and a clearance of {c}. What is the longest buttock–knee length that fits?' }
    },
    {
      name: 'Clear height under a table at the knees',
      expr: 'Hk = K + a + c', tex: 'H_k = K + a_s + c',
      vars: {
        Hk: { name: 'clear height under the table', q: 'length', unit: 'mm', tex: 'H_k' },
        K: { name: 'knee height sitting of the largest user', q: 'length', unit: 'mm', value: 603 },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        c: { name: 'clearance to move the legs', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'For a seat at the user\'s own popliteal height; a seat raised above it raises the knees too.',
      stories: { Hk: 'The largest user\'s knee height is {K}, shoes add {a} and {c} is left to move. How high must the underside of the table be?' }
    },
    {
      name: 'The deepest seat the smallest users can use',
      expr: 'D = Bp - g', tex: 'D_{max} = L_{BP} - g',
      vars: {
        D: { name: 'maximum seat depth', q: 'length', unit: 'mm', tex: 'D_{max}' },
        Bp: { name: 'buttock–popliteal length of the smallest user', q: 'length', unit: 'mm', value: 439, tex: 'L_{BP}' },
        g: { name: 'gap left behind the knee', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'With the back against the backrest the seat front then stays clear of the calves.',
      stories: { D: 'The smallest user\'s buttock–popliteal length is {Bp}. With a gap of {g} behind the knee, how deep may the seat be?' }
    }
  ],
  examples: [
    {
      title: 'How much seat pitch does a tall passenger need?',
      q: 'The 95th-percentile man\'s buttock–knee length is 659 mm. The seat back in front is 60 mm thick at knee height and 25 mm is left for clothing. What pitch does he need, and what happens at 28 in (711 mm)?',
      steps: [
        '$p = 659 + 60 + 25 = 744$ mm, about 29.3 in.',
        'At 711 mm he is 33 mm short: his knees touch the seat in front, and more so when it reclines.',
        'At 31 in (787 mm) he has about 40 mm to spare; the 99th-percentile man (680 mm) needs about 765 mm.'
      ],
      a: 'About 745 mm (29–30 in); at 28 in the tallest passengers\' knees touch.'
    },
    {
      title: 'A canteen chair for everyone',
      q: 'Choose the depth and width of a fixed canteen chair from the table: 5th-percentile woman\'s buttock–popliteal length 439 mm, 95th-percentile woman\'s hip breadth 451 mm.',
      steps: [
        'Depth: $439 - 50 = 389$ mm, so about 380–390 mm.',
        'Width: $451 + 50 = 501$ mm between armrests, or a little less for an armless chair used briefly.',
        'The 95th-percentile man\'s thigh (546 mm) then overhangs the seat by about 160 mm — acceptable for short sitting; a deeper seat would hurt the small users instead.'
      ],
      a: 'About 390 mm deep and 500 mm wide.'
    }
  ],
  quiz: [
    { q: 'Which dimension sets the maximum depth of a fixed seat?', choices: ['The buttock–popliteal length of the smallest users', 'The buttock–knee length of the largest users', 'Popliteal height', 'Hip breadth'], a: 0, why: 'A seat deeper than the thighs of small users presses into their calves or keeps them off the backrest.' },
    { q: 'Whose hips set the width of a seat for a mixed population?', choices: ['The 95th-percentile woman\'s', 'The 95th-percentile man\'s', 'The 50th-percentile man\'s', 'The 5th-percentile woman\'s'], a: 0, why: 'Women are on average wider at the hips when seated: 451 mm at the 95th percentile against 414 mm for men.' },
    { q: 'What limits the height of the underside of a table?', choices: ['The knee height of the tallest users, with shoes', 'The popliteal height of the shortest users', 'The elbow rest height', 'The eye height sitting'], a: 0, why: 'It is a clearance: if the tallest knees fit, everybody\'s do.' },
    { q: 'At a given chair height, every adult\'s eyes are at about the same height above the floor.', a: false, why: 'Seated eye height varies by more than 150 mm between the 5th-percentile woman and the 95th-percentile man.' },
    { q: 'The 95th-percentile man\'s buttock–knee length is 659 mm. Add 50 mm of clearance: what knee room is needed?', answer: 709, unit: 'mm', why: '659 + 50 = 709 mm from the backrest to the nearest obstruction at knee height.' }
  ],
  problems: [
    { q: 'The smallest users of a chair have a buttock–popliteal length of 439 mm. With 50 mm left behind the knee, how deep may the seat be?', answer: 389, unit: 'mm', tol: 0.01, steps: ['$D = 439 - 50 = 389$ mm.'] },
    { q: 'The 95th-percentile man\'s knee height is 603 mm. With 25 mm of shoe and 20 mm to move, how high must the underside of a table be?', answer: 648, unit: 'mm', tol: 0.01, steps: ['$H_k = 603 + 25 + 20 = 648$ mm.'] }
  ],
  ranges: [
    { dim: 'Fixed seat height (no adjustment)', range: [400, 450], unit: 'mm', who: 'from the 5th-percentile woman\'s popliteal height with shoes (387 mm) to about the median man\'s (470 mm)', why: 'Short users\' feet reach the floor without the seat front pressing under their thighs.', limits: 'Tall users sit with their knees a little high; dining chairs of 430–460 mm suit 720–760 mm tables but leave small users\' feet hanging.', setting: ['civil', 'office'], src: 'Derived from representative data; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Seat depth of a fixed seat', range: [null, 390], unit: 'mm', who: '5th-percentile woman: buttock–popliteal length 439 mm less a 50 mm gap behind the knee', why: 'Small users reach the backrest without the front edge pressing their calves.', limits: 'Tall users get less thigh support; a sliding seat pan extends the depth for them.', setting: ['office', 'civil', 'school'], src: 'Derived from representative data; compare EN 1335-1' },
    { dim: 'Seat width between armrests', range: [500, null], unit: 'mm', who: '95th-percentile woman\'s hip breadth sitting (451 mm) plus about 50 mm for clothing and movement', why: 'The widest hips fit without pressure from the armrests.', limits: 'Economy aircraft seats are narrower (about 430–460 mm between armrests); large users and winter clothing need more.', setting: ['office', 'civil', 'vehicle'], src: 'Derived from representative data' },
    { dim: 'Clear height under a table or desk at the knees', range: [650, null], unit: 'mm', who: '95th-percentile man\'s knee height (603 mm) plus 25 mm of shoe and room to move', why: 'The tallest users can sit close without striking the knees.', limits: 'Wheelchair users need at least 685 mm; a seat raised above popliteal height raises the knees too.', setting: ['office', 'civil'], src: 'Derived from representative data; 2010 ADA Standards for wheelchair users' },
    { dim: 'Room for the thighs between the seat and the underside of a desk', range: [210, null], unit: 'mm', who: '95th-percentile man\'s thigh clearance (190 mm) plus 20 mm', why: 'The thighs are not pressed by the desk when the seat is at the right height.', limits: 'Thick desk tops and drawers eat into it; low elbow heights leave little room between thighs and desk.', setting: 'office', src: 'Derived from representative data' },
    { dim: 'Knee room ahead of the seat (backrest to the nearest obstruction at knee height)', range: [710, null], unit: 'mm', who: '95th-percentile man\'s buttock–knee length (659 mm) plus about 50 mm', why: 'Tall people sit upright without jamming their knees.', limits: 'Reclining seats in front take more; the 99th-percentile man needs about 730 mm.', setting: ['vehicle', 'civil'], src: 'Derived from representative data' },
    { dim: 'Headroom above a seat (seat surface to the roof or the bunk above)', range: [1050, null], unit: 'mm', who: '99th-percentile man\'s erect sitting height (999 mm) plus a margin', why: 'The head clears the roof when sitting upright.', limits: 'Add a helmet (30–50 mm), seat suspension travel and the head\'s motion in a moving vehicle.', setting: ['vehicle', 'military'], src: 'Derived from representative data' }
  ],
  applications: [
    'Office chairs and desks: see [the workstation fitter](#/tools/workstation/sitting).',
    'Row spacing and seat widths in theatres, lecture halls, buses, trains and aircraft.',
    'Cab and crew-station headroom and knee room, with helmets and clothing.',
    'Dining, café and canteen furniture that must suit everyone without adjustment.'
  ],
  history: 'Bengt Åkerblom\'s 1948 study of standing and sitting posture, and J. J. Keegan\'s X-ray studies of how the lumbar curve flattens on sitting (1953), laid the foundations of modern seat design; seated anthropometry then turned them into the dimensions of chairs, desks and vehicle seats.',
  sources: [
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1: Body measurement definitions and landmarks*.',
    'EN 1335-1, *Office furniture — Office work chair — Part 1: Dimensions*.',
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — seating and seated dimensions.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space* — seating and clearances.'
  ],
  sim: ['an-seated', 'ref-seat-fit']
},

{
  id: 'hand-foot-head', parent: 'body-dimensions', title: 'Hands, feet and heads', level: 2,
  short: 'Small dimensions with large consequences: hand length and breadth set handles, triggers and glove sizes; foot length and breadth set footwear, pedals and treads; head circumference sets helmets, hats and headsets. Each is covered by a range of sizes, and a workforce of men and women needs more sizes than one designed around men.',
  keywords: ['hand length', 'hand breadth', 'hand circumference', 'handle diameter', 'power grip', 'precision grip', 'glove size', 'EN ISO 21420', 'foot length', 'foot breadth', 'shoe size', 'Mondopoint', 'Paris point', 'EU shoe size', 'safety footwear', 'head circumference', 'helmet size', 'hat size', 'respirator fit', 'PPE sizing'],
  prereq: ['anthropometry-basics', 'percentiles'],
  related: ['hand-tools', 'controls-design', 'personal-equipment-fit', 'ppe-ergonomics', 'access-openings', 'clothing-ppe-allowances', 'sex-differences', 'stairs-ergonomics', 'strength-and-force'],
  body: `
Hands, feet and heads are small, but they touch almost everything we design: handles, triggers, keyboards, pedals, steps, gloves, boots, helmets, headsets and masks. A few millimetres decide whether a grip is secure, a glove lets the fingers work, or a helmet stays in place.

| Dimension (mm) | 5th woman | 50th woman | 50th man | 95th man | Sets |
|---|---|---|---|---|---|
| Hand length (wrist crease to fingertip) | 161 | 176 | 192 | 208 | trigger and control spacing, glove length |
| Hand breadth (across the knuckles) | 71 | 78 | 88 | 96 | handle length, hand openings, glove size |
| Foot length | 225 | 243 | 268 | 289 | shoe size, pedal and tread depth |
| Foot breadth | 83 | 91 | 101 | 109 | shoe width, pedal width |
| Head circumference | 525 | 550 | 575 | 600 | helmet, hat, headset and headband size |

### Hands and handles
In a **power grip** the fingers wrap round the handle and the thumb closes over them — hammers, drills, grab rails. The grip is strongest and most secure when the fingers reach most of the way round: cylindrical handles of about **30–50 mm** diameter, near 40 mm for many adult hands, a little less for small hands and in thick gloves. In a **precision grip** the object is held between the fingertips and thumb — pens, screwdrivers for fine work, knobs — and about **8–16 mm** works best. A handle must be longer than the widest palm: the 95th-percentile man's hand breadth is 96 mm, so a handle for the whole hand needs about **120 mm**, more in gloves. Trigger spans, finger spacing and grip spans suited to men's hands are often too large for women's, whose hands are some 8–10 % shorter and 10–12 % narrower on average ([[hand-tools]], [[sex-differences]]).

### Gloves
Gloves are sized by the **hand circumference** round the palm at the knuckles and by hand length. EN ISO 21420 numbers glove sizes 6 to 11, a size number being roughly the circumference in inches: a size 8 fits a hand about 203 mm round. Circumference is roughly 2.3–2.5 times hand breadth, so women mostly need sizes 6–8 and men 8–10. A store that stocks only 9 to 11 gives most women gloves that are too long and too wide: the fingertips are empty, dexterity and grip fall, and loose material can be caught by moving parts. Gloves also add to every hand dimension — see [[clothing-ppe-allowances]].

### Feet and footwear
Shoe sizes come in several systems: **Mondopoint** (ISO 9407) gives the foot's length and breadth in millimetres (270/100) and is used for ski boots and many military boots; the European **Paris point** counts the length of the last in steps of two-thirds of a centimetre; UK and US sizes count thirds of an inch from different zero points. The last is 10–20 mm longer than the foot to leave room for the toes, and safety boots (ISO 20345) add a toe cap. Feet also set the depth of stair treads ([[stairs-ergonomics]]), the size of pedals and foot switches, and the toe space under counters and machines.

### Heads and helmets
Head circumference runs from about 525 mm (5th-percentile woman) to 610 mm (99th-percentile man). Helmets come in shell sizes by circumference in centimetres, or as one shell with an adjustable harness — industrial helmets (EN 397) typically adjust over roughly 52–64 cm. A helmet that is too big rocks, slides over the eyes and protects less; one too small presses and gets taken off. Headsets, hearing protectors and visors depend also on head breadth and ear position; tight-fitting respirators depend on the shape of the **face**, which varies in ways circumference does not show — which is why they must be fit-tested on each wearer (for example under OSHA 29 CFR 1910.134 in the United States).

The simulation shows how a population spreads across glove, shoe and helmet sizes, which sizes a store must stock to cover its workforce, and the chosen person's hand, foot or head drawn to scale with their sizes.

### Different settings
| Setting | Typical items | What matters |
|---|---|---|
| Home and public | door handles, taps, utensils, grab rails | weak or painful hands: lever handles, large knobs, 30–40 mm rails |
| Office | mice, pens, keyboards | hand length and breadth: mouse size, key spacing |
| Workshop and industry | tool handles, gloves, safety boots | power grips, glove sizes for everyone, toe caps |
| Military | gloves, boots, helmets, respirators | sizes and fit tests for every soldier, controls usable in gloves |
| Field work | winter gloves, boots, hard hats | bulky gloves change handle sizes and triggers |

> [!warn] One size of PPE does not fit all. Stock the sizes your whole workforce needs — including small sizes for women and large ones for the biggest men — and fit-test respirators on each wearer.

> [!key] Handles from the hand (30–50 mm for power, 8–16 mm for precision, at least 120 mm long), gloves and helmets in enough sizes for the whole range, feet with toe room and boots in mind.
`,
  ideas: [
    'Power grips work best on handles of about 30–50 mm diameter; precision grips on about 8–16 mm.',
    'A handle must be longer than the widest palm: about 120 mm for the 95th-percentile man, more in gloves.',
    'Glove sizes 6–11 follow hand circumference in inches; women mostly need 6–8, men 8–10.',
    'Mondopoint gives shoe sizes as foot length and breadth in millimetres; the last is 10–20 mm longer than the foot.',
    'Helmets are sized by head circumference (about 525–610 mm for most adults); respirators need a fit test on each face.'
  ],
  pitfalls: [
    'A thicker handle is always easier to grip — Beyond about 50 mm the fingers cannot close round it and grip strength falls, especially for small hands.',
    'Stocking men\'s glove sizes covers everyone — Most women need sizes 6–8; gloves that are too big cost dexterity and can be caught in machinery.',
    'If a respirator is the right size, it fits — Facial shape varies; tight-fitting respirators must be fit-tested on each wearer.'
  ],
  formulas: [
    {
      name: 'European (Paris point) shoe size',
      expr: 'N = (Lf + a)/pp', tex: 'N = \\dfrac{L_f + a}{p_P}',
      vars: {
        N: { name: 'EU shoe size', q: 'none' },
        Lf: { name: 'foot length', q: 'length', unit: 'mm', value: 268, tex: 'L_f' },
        a: { name: 'toe allowance (last longer than the foot)', q: 'length', unit: 'mm', value: 15 },
        pp: { name: 'Paris point (two-thirds of a centimetre)', q: 'length', unit: 'mm', value: 6.667, fixed: true, tex: 'p_P' }
      },
      note: 'A rule of thumb: makers\' lasts and allowances differ, so sizes differ by half a size or more between brands. Mondopoint uses the foot length itself.',
      stories: { N: 'A foot is {Lf} long and the last is {a} longer. What is the EU size?', Lf: 'An EU size {N} shoe has a last {a} longer than the foot. How long is the foot?' }
    },
    {
      name: 'US hat size from head circumference',
      expr: 's = C/(pi*d)', tex: 's = \\dfrac{C}{\\pi\\,d_{in}}',
      vars: {
        s: { name: 'US hat size', q: 'none' },
        C: { name: 'head circumference', q: 'length', unit: 'mm', value: 575 },
        d: { name: 'one inch', q: 'length', unit: 'mm', value: 25.4, fixed: true, tex: 'd_{in}' }
      },
      note: 'A US hat size is the diameter, in inches, of a circle with the head\'s circumference; helmets are usually sized directly by circumference in centimetres.',
      stories: { s: 'A head is {C} round. What is its US hat size?', C: 'What head circumference fits a US hat size {s}?' }
    },
    {
      name: 'Glove size estimated from hand breadth',
      expr: 'g = k*b/d', tex: 'g = \\dfrac{k\\,b}{d_{in}}',
      vars: {
        g: { name: 'glove size (hand circumference in inches)', q: 'none' },
        k: { name: 'ratio of hand circumference to hand breadth (about 2.3–2.5)', q: 'none', value: 2.4 },
        b: { name: 'hand breadth across the knuckles', q: 'length', unit: 'mm', value: 88 },
        d: { name: 'one inch', q: 'length', unit: 'mm', value: 25.4, fixed: true, tex: 'd_{in}' }
      },
      note: 'An estimate: measure the circumference itself (and the hand length) for real sizing to EN ISO 21420.',
      stories: { g: 'A hand is {b} across the knuckles. Estimate the glove size, taking the circumference as {k} times the breadth.' }
    }
  ],
  examples: [
    {
      title: 'Helmet sizes for a mixed crew',
      q: 'Head circumference is 575 ± 15 mm for men and 550 ± 15 mm for women. What range must helmets cover from the 5th-percentile woman to the 99th-percentile man, and what US hat sizes are those?',
      steps: [
        '5th-percentile woman: $550 - 1.645 \\times 15 = 525$ mm; 99th-percentile man: $575 + 2.326 \\times 15 = 610$ mm.',
        'Hat sizes: $525/(25.4\\pi) = 6.58$, about 6⅝; $610/(25.4\\pi) = 7.64$, about 7⅝.',
        'An adjustable harness covering about 52–64 cm fits nearly everyone in one shell; fixed-size helmets need four or five sizes.'
      ],
      a: 'About 525–610 mm (hat sizes 6⅝ to 7⅝).'
    },
    {
      title: 'Boots for the extremes',
      q: 'Foot length is 225 mm for the 5th-percentile woman and 289 mm for the 95th-percentile man. With a 15 mm toe allowance, what EU sizes are they?',
      steps: [
        'Woman: $(225 + 15)/6.667 = 36.0$ — EU 36.',
        'Man: $(289 + 15)/6.667 = 45.6$ — EU 45–46.',
        'A boot range from 36 to 46 (Mondopoint about 225–290) covers most of a mixed workforce; the 1st and 99th percentiles need 35 and 47.'
      ],
      a: 'About EU 36 to 46.'
    }
  ],
  quiz: [
    { q: 'About what diameter suits a power-grip handle for most adult hands?', choices: ['About 40 mm (30–50 mm)', 'About 10 mm', 'About 80 mm', 'As thick as possible'], a: 0, why: 'The fingers should wrap most of the way round: roughly 30–50 mm, near 40 mm for many hands.' },
    { q: 'Which system gives a shoe size as the foot\'s length and breadth in millimetres?', choices: ['Mondopoint', 'Paris point (EU)', 'UK sizes', 'US sizes'], a: 0, why: 'Mondopoint (ISO 9407) uses the foot itself, e.g. 270/100.' },
    { q: 'A company stocks work gloves in sizes 9, 10 and 11 only. What is the likely result?', choices: ['Most women and some small men wear gloves too big: less dexterity and grip, and a risk of catching', 'Everyone is covered because gloves stretch', 'Only the largest men are left out', 'Nothing: glove size does not matter'], a: 0, why: 'Women mostly need sizes 6–8; oversized gloves cost dexterity and can be caught by moving parts.' },
    { q: 'A respirator of the right size for the head will seal on the face.', a: false, why: 'The seal depends on the shape of the face; tight-fitting respirators must be fit-tested on each wearer.' },
    { q: 'What is a glove size number, roughly?', choices: ['The hand\'s circumference in inches', 'The hand\'s length in centimetres', 'The hand\'s breadth in centimetres', 'An arbitrary code'], a: 0, why: 'Size 8 fits a hand about 8 in (203 mm) round.' }
  ],
  problems: [
    { q: 'A foot is 243 mm long and the last is 15 mm longer. What is the EU size, to one decimal?', answer: 38.7, unit: '', tol: 0.01, steps: ['$N = (243 + 15)/6.667 = 38.7$, between EU 38 and 39.'] },
    { q: 'What US hat size fits a head 560 mm round?', answer: 7.02, unit: '', tol: 0.01, steps: ['$s = 560/(25.4\\pi) = 7.02$ — size 7.'] }
  ],
  ranges: [
    { dim: 'Handle diameter for a power grip', range: [30, 50], unit: 'mm', who: 'most adult hands; near 40 mm for many, the lower end for small hands and thick gloves', why: 'The fingers close most of the way round: a strong, secure grip with little effort.', limits: 'Very small or arthritic hands and heavy gloves need testing; oval sections resist turning better.', setting: ['workshop', 'civil', 'field'], src: 'Pheasant and Haslegrave, *Bodyspace*; Kroemer and Grandjean' },
    { dim: 'Diameter for a precision grip', range: [8, 16], unit: 'mm', who: 'fingertip and thumb grips of most adults', why: 'Fine control of small tools, pens and knobs.', limits: 'Where force is also needed, larger diameters and textured surfaces help.', setting: ['workshop', 'office'], src: 'Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Handle length for a whole-hand grip', range: [120, null], unit: 'mm', who: '95th-percentile man\'s hand breadth (96 mm) plus room at the ends', why: 'The whole palm bears on the handle; no edge digs into the hand.', limits: 'More with gloves; handles for two hands or for mittens much more.', setting: ['workshop', 'field', 'civil'], src: 'Derived from representative data' },
    { dim: 'Head circumferences a helmet range must fit', range: [525, 610], unit: 'mm', who: '5th-percentile woman to 99th-percentile man', why: 'Everyone gets a helmet that sits level and stays on.', limits: 'Head shape (length to breadth) varies too; pads and harnesses tune the fit; add hair, hoods and balaclavas.', setting: ['workshop', 'military', 'field'], src: 'Derived from representative data; EN 397' },
    { dim: 'Glove sizes to stock for a mixed workforce', range: 'sizes 6 to 10 or 11', who: 'women mostly 6–8, men mostly 8–10', why: 'Everyone gets gloves that fit: dexterity, grip and less risk of catching.', limits: 'Check with the workforce itself; special gloves (chemical, cut-resistant, cold) often come in fewer sizes.', setting: ['workshop', 'field', 'health'], src: 'EN ISO 21420' },
    { dim: 'Foot lengths a footwear range must cover', range: [225, 300], unit: 'mm', who: '5th-percentile woman to 99th-percentile man', why: 'Boots in the right size prevent blisters, falls and toe injuries.', limits: 'Widths vary too: stock wide fittings; safety toe caps must not press on the toes.', setting: ['workshop', 'military', 'field'], src: 'Derived from representative data; ISO 9407; ISO 20345' }
  ],
  applications: [
    'Tool handles, grab rails, door handles and knobs sized for power or precision grips.',
    'PPE procurement: glove, boot and helmet sizes matched to the workforce, including women.',
    'Pedals, foot switches and stair treads sized for booted feet.',
    'Headsets, hearing protectors and helmets that fit together.'
  ],
  sources: [
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1* (hand, foot and head dimensions).',
    'EN ISO 21420, *Protective gloves — General requirements and test methods* (glove sizes).',
    'ISO 9407, *Shoe sizes — Mondopoint system of sizing and marking*.',
    'ISO 20345, *Personal protective equipment — Safety footwear*.',
    'EN 397, *Industrial safety helmets*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — hands, handles and hand tools.'
  ],
  sim: 'an-sizes'
},

{
  id: 'functional-reach', parent: 'body-dimensions', title: 'Reach and reach envelopes', level: 2,
  short: 'How far a hand can reach from where a person sits or stands: a roughly spherical envelope around each shoulder, largest at shoulder height and shrinking above, below and to the side. Frequent items belong in the forearm\'s normal area, occasional ones in the arm\'s maximum area; leaning extends reach, clothing and restraints shorten it, and the smallest users set every reach limit.',
  keywords: ['reach', 'reach envelope', 'functional reach', 'forward grip reach', 'normal working area', 'maximum working area', 'reach zones', 'arm reach', 'fingertip reach', 'trunk lean', 'restrained reach', 'upper arm elevation', 'ISO 11226', 'Barnes', 'Squires', 'control location'],
  prereq: ['standing-dimensions', 'sitting-dimensions', 'percentiles'],
  related: ['reach-zones', 'controls-design', 'joint-ranges', 'posture-assessment', 'storage-heights', 'disability-inclusive', 'driver-workspace', 'safety-distances', 'operator-positions'],
  body: `
Reach decides where things can go: controls, tools, parts, switches, shelves. A person reaches from a shoulder that can move, a trunk that can lean and feet that can step — so reach is a *functional* dimension, and its limits are always set by the **smallest** users in their real posture, clothing and restraint.

### The reach envelope
The arm pivots at the shoulder, so the hand's reach from a fixed body position is roughly a sphere around each shoulder joint, cut away by the body, the seat and the work surface. The static measure is **forward grip reach** (ISO 7250-1): from the back, against a wall, to the axis of a grasped rod with the arm horizontal — 671 mm for the 5th-percentile woman, 863 mm for the 95th-percentile man. Reach to a fingertip is about half a hand (80–100 mm) further; reach to grasp a handle is less than to touch a button.

Because the envelope is a sphere, reach is **greatest at shoulder height** and shrinks above and below it:

$$d = \\sqrt{a^2 - (y - y_s)^2}$$

where $a$ is the arm's reach from the shoulder joint, $y_s$ the height of the joint and $y$ the height of the target. A 5th-percentile woman standing in shoes reaches about 530 mm forward at 1000 mm height but only about 430 mm at 1600 mm (worked below). In the simulation, drag the target around the envelope of any person, standing or sitting, and see the reach shrink with height.

### Normal and maximum working areas
On a work surface, reach has two zones (seen from above in the simulation):
- the **normal area**, swept by the forearm with the upper arm hanging at the side — a radius of about 0.2 × stature from the elbow (roughly 300 mm for a small woman, 370 mm for a large man). Frequent items and the main task go here;
- the **maximum area**, swept by the whole arm from the shoulder without leaning — for a 5th-percentile woman at desk height about 500 mm from the shoulder. Occasional items go here; anything further needs the trunk to lean or the person to get up.

Barnes drew both areas as arcs in the 1930s; Squires (1956) showed that the normal area is really a curve, because the elbow moves outwards as the forearm sweeps ([[reach-zones]]).

### What extends reach, and what shrinks it
| Factor | Effect on reach | Where it matters |
|---|---|---|
| Leaning the trunk forward 20° (seated) | about +130–170 mm | occasional reaches at a desk |
| Moving the shoulder forward (protraction) | several centimetres | reaching "with the shoulder" |
| Standing up, stepping, turning | large | shelves, benches, control panels |
| Bulky clothing, body armour | shorter, and less shoulder movement | cold stores, military, field |
| Seat belt or harness | shorter: the shoulder cannot move forward | vehicles, cockpits, crew stations |
| A load or tool in the hand | shorter and slower; the load adds a moment at the shoulder | assembly, handling |
| Age, joint disease, pregnancy | shorter; overhead reach often limited most | homes, public spaces, older workforces |

The trunk lean adds $h \\sin\\theta$, where $h$ is the height of the shoulder above the hip joint: about 380 mm for a small seated woman, so 20° adds some 130 mm. Leaning is fine for an occasional reach; held or repeated, it loads the back — ISO 11226 treats trunk inclinations above 20° as acceptable only for limited holding times and above 60° as not acceptable, with similar limits for raising the upper arm ([[neutral-postures]], [[posture-assessment]]).

### Designing with reach
- **Controls and emergency stops** within the reach of the smallest intended users, in their working posture, clothing and restraint — the 5th-percentile woman at least, the 1st where it is critical.
- **Frequent items** in the normal area, **occasional** in the maximum area; nothing frequent above the shoulder or behind the body.
- **Vehicles and cockpits**: controls within the restrained reach of the smallest driver or pilot ([[driver-workspace]]).
- **Guards**: the opposite case. Safety distances ([[safety-distances]]) use the *largest* reach, so that nobody can touch the hazard.

> [!warn] Reaching far, high or behind the body with a load multiplies the moment at the shoulder and the lower back. Move the item, not the person.

> [!key] Reach limits come from the smallest users, measured functionally: in their posture, clothing and restraint, with the grip the task needs. Keep frequent reaches short and at about elbow to shoulder height.
`,
  ideas: [
    'The reach envelope is roughly a sphere around each shoulder: reach is greatest at shoulder height and shrinks above and below.',
    'The normal working area is swept by the forearm with the elbow at the side; the maximum area by the whole arm.',
    'Reach limits are set by the smallest users, in their real posture, clothing and restraint.',
    'Leaning the trunk adds h·sin θ to reach but loads the back; ISO 11226 limits holding such postures.',
    'Safety distances are the opposite case: they use the largest reach.'
  ],
  pitfalls: [
    'Forward reach from a table can be used anywhere around the body — Reach falls off above and below shoulder height, and sideways and behind much more.',
    'Leaning is a free extension of reach — It works for an occasional reach; held or repeated it loads the back and shoulders.',
    'Reach is measured to the fingertips — Grasping needs the grip axis, about half a hand shorter; a gloved grasp shorter still.'
  ],
  formulas: [
    {
      name: 'Horizontal reach at a given height',
      expr: 'd = sqrt(a^2 - (y - ys)^2)', tex: 'd = \\sqrt{a^2 - (y - y_s)^2}',
      vars: {
        d: { name: 'horizontal reach from the shoulder joint', q: 'length', unit: 'mm' },
        a: { name: 'arm reach from the shoulder joint to the grip', q: 'length', unit: 'mm', value: 572 },
        y: { name: 'height of the target', q: 'length', unit: 'mm', value: 1000, min: 0, max: 2500 },
        ys: { name: 'height of the shoulder joint', q: 'length', unit: 'mm', value: 1220, min: 900, max: 1700, tex: 'y_s' }
      },
      note: 'A sphere around the shoulder: the default is a 5th-percentile woman standing in shoes. The shoulder joint sits about 100 mm in front of the back.',
      stories: { d: 'A person\'s shoulder joint is at {ys} and the arm reaches {a}. How far forward can the hand grip at a height of {y}?', y: 'A person\'s shoulder joint is at {ys} and the arm reaches {a}. At what heights can they grip {d} forward?' }
    },
    {
      name: 'Reach gained by leaning the trunk',
      expr: 'R = R0 + h*sin(theta)', tex: 'R = R_0 + h\\sin\\theta',
      vars: {
        R: { name: 'reach when leaning', q: 'length', unit: 'mm' },
        R0: { name: 'reach sitting upright', q: 'length', unit: 'mm', value: 671, tex: 'R_0' },
        h: { name: 'height of the shoulder above the hip joint', q: 'length', unit: 'mm', value: 380 },
        theta: { name: 'forward lean of the trunk', q: 'angle', unit: '°', value: 20, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The shoulder also drops by h(1 − cos θ). Leans above 20° should be brief (ISO 11226).',
      stories: { R: 'A seated person reaches {R0} upright; the shoulder is {h} above the hip joint. How far do they reach leaning {theta}?', theta: 'A seated person reaches {R0} upright, with the shoulder {h} above the hip joint. How far must they lean to reach {R}?' }
    }
  ],
  examples: [
    {
      title: 'How reach shrinks with height',
      q: 'A 5th-percentile woman standing in shoes has her shoulder joint at about 1220 mm and reaches 572 mm from it to the grip. How far forward can she grip at 1000 mm and at 1600 mm?',
      steps: [
        'At 1000 mm: $d = \\sqrt{572^2 - 220^2} = \\sqrt{278\\,784} = 528$ mm.',
        'At 1600 mm: $d = \\sqrt{572^2 - 380^2} = \\sqrt{182\\,784} = 428$ mm.',
        'Straight up she reaches $1220 + 572 = 1792$ mm — close to her measured grip reach with shoes (1795 mm). A shelf 500 mm deep at 1600 mm is beyond her.'
      ],
      a: 'About 530 mm at 1000 mm but only about 430 mm at 1600 mm.'
    },
    {
      title: 'Leaning for an occasional reach',
      q: 'A small seated woman reaches 671 mm upright; her shoulder is 380 mm above the hip joint. How far does she reach leaning 20°, and 40°?',
      steps: [
        '20°: $R = 671 + 380 \\sin 20° = 671 + 130 = 801$ mm.',
        '40°: $R = 671 + 380 \\sin 40° = 671 + 244 = 915$ mm, but the trunk is then well beyond 20° and the lower back carries the upper body\'s weight at a long lever.',
        'Put occasional items within the 20° reach and nothing frequent beyond the upright reach.'
      ],
      a: 'About 800 mm at 20° and 915 mm at 40° — the second only rarely.'
    }
  ],
  quiz: [
    { q: 'Whose reach sets the position of an emergency-stop button?', choices: ['The smallest intended user, in the working posture and clothing', 'The largest user', 'The average user', 'The designer\'s own'], a: 0, why: 'A control must be reachable by everyone: if the smallest users can reach it, everyone can.' },
    { q: 'The normal working area on a bench is swept by…', choices: ['the forearm, with the upper arm hanging at the side', 'the whole arm from the shoulder', 'the arm plus a trunk lean of 20°', 'the fingertips of a standing person'], a: 0, why: 'Frequent items belong where the forearm reaches without lifting the upper arm.' },
    { q: 'A standing person\'s horizontal reach is greatest at head height.', a: false, why: 'The envelope is a sphere around the shoulder: horizontal reach is greatest at shoulder height.' },
    { q: 'Which of these shortens reach most in a vehicle?', choices: ['A tightened shoulder belt, which keeps the shoulder back', 'Short sleeves', 'Sitting upright', 'A lighter steering wheel'], a: 0, why: 'Restrained reach excludes the shoulder and trunk movement that normally adds to reach.' },
    { q: 'Safety distances at guards are set by…', choices: ['the largest reaches', 'the smallest reaches', 'the average reach', 'the reach of the operator only'], a: 0, why: 'A guard must keep everyone away from the hazard, so the longest reaches decide.' }
  ],
  problems: [
    { q: 'A seated person reaches 671 mm upright; the shoulder is 380 mm above the hip joint. How far do they reach when leaning forward 20°?', answer: 801, unit: 'mm', tol: 0.01, steps: ['$R = 671 + 380 \\sin 20° = 671 + 130 = 801$ mm.'] },
    { q: 'A shoulder joint is at 1220 mm and the arm reaches 572 mm. How far forward can the hand grip at 1000 mm?', answer: 528, unit: 'mm', tol: 0.01, steps: ['$d = \\sqrt{572^2 - (1000 - 1220)^2} = 528$ mm.'] }
  ],
  ranges: [
    { dim: 'Frequent reach on a work surface — normal area, radius from the elbow', range: [null, 300], unit: 'mm', who: '5th-percentile woman: elbow-to-grip length about 0.2 × stature', why: 'Frequent items and the main task are reached with the upper arm relaxed at the side.', limits: 'Larger users reach further; the area is a curve, not a circle, because the elbow moves as the forearm sweeps.', setting: ['office', 'workshop'], src: 'Derived from representative data; after Barnes and Squires' },
    { dim: 'Occasional reach on a work surface — maximum area, radius from the shoulder', range: [null, 500], unit: 'mm', who: '5th-percentile woman: about 570 mm from the shoulder joint to the grip, with the desk about 280 mm below the joint', why: 'Occasional items are reached without leaning or lifting out of the chair.', limits: 'Gloves, restraint, bulky clothing and a load in the hand shorten it; beyond it the trunk must lean.', setting: ['office', 'workshop', 'vehicle'], src: 'Derived from representative data' },
    { dim: 'Forward lean of the trunk for occasional reaches', range: [0, 20], unit: '°', who: 'everyone; the limit is the back, not the reach', why: 'Small leans hold the upper body\'s weight close to the hips.', limits: 'Leans of 20–60° are acceptable only briefly or with support; above 60° not acceptable.', setting: 'all', src: 'ISO 11226' },
    { dim: 'Elevation of the upper arm for frequent or held reaches', range: [0, 20], unit: '°', who: 'everyone; the limit is the shoulder', why: 'The shoulder muscles tire quickly when the arm is held raised.', limits: 'Brief reaches may go higher; above 60° is not acceptable for held postures.', setting: 'all', src: 'ISO 11226' }
  ],
  applications: [
    'Placing controls, emergency stops and displays on machines and panels.',
    'Laying out desks, benches, checkouts and assembly stations in zones: see [the workstation fitter](#/tools/workstation).',
    'Shelving and storage within the reach of the smallest users.',
    'Vehicle and cockpit controls within restrained reach.'
  ],
  history: 'Ralph Barnes\'s motion-study textbooks of the 1930s drew normal and maximum working areas on a bench as arcs about the elbow and the shoulder. P. C. Squires (1956) showed the normal area is a curve, because the elbow moves as the forearm sweeps; three-dimensional reach envelopes for seated operators followed in aviation and vehicle design.',
  sources: [
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1* (forward grip reach and related functional dimensions).',
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — reach and the workspace envelope.',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design* — work-space design and arm reach.'
  ],
  sim: 'an-reach'
},

{
  id: 'mass-strength-data', parent: 'body-dimensions', title: 'Body mass and strength', level: 2,
  short: 'Body mass sets the loads on seats, beds, ladders, platforms and stretchers, and segment masses the loads on joints; strength sets the forces controls, tools, doors and trolleys may demand. Both vary far more than body lengths — strength by 20–30 % between people of one sex — so designs take forces from the weak end and loads from the heavy end.',
  keywords: ['body mass', 'body weight', 'segment mass', 'Dempster', 'strength', 'grip strength', 'hand dynamometer', 'push force', 'pull force', 'friction limit', 'maximum voluntary contraction', 'static effort', 'Rohmert', 'design force', 'EN 1005-3', 'rated load', 'bariatric', 'skewed distribution'],
  prereq: ['percentiles', 'anthropometry-basics'],
  related: ['strength-and-force', 'pushing-pulling', 'static-muscle-work', 'controls-design', 'sex-differences', 'age-children-elderly', 'spinal-loading', 'lifting-principles', 'medicine:obesity', 'medicine:energy-balance', 'physics:friction'],
  body: `
Lengths tell a designer where things go; mass and strength tell how strong the design must be and how hard it may be to use. Both vary much more than lengths do, and both have changed over the decades.

### Body mass
The representative adults of this app weigh 85 ± 14 kg (men) and 68 ± 13 kg (women), but body mass is **skewed**: a long tail of heavy people stretches to the right. A normal model puts the 99th-percentile man at 118 kg; a skewed (log-normal) model with the same mean and spread puts him at 123 kg, and real surveys often show more. Body mass has also risen for decades — the WHO reports that worldwide obesity has nearly tripled since 1975 — so load ratings taken from old data are too low ([[medicine:obesity|obesity]]).

What mass sets:
- **Structures that carry people**: seats, beds, ladders, platforms, stretchers, hoists, lifts. Portable ladders to EN 131 are rated for a user of up to 150 kg with what they carry; bariatric beds, chairs and hoists are rated much higher, often 250 kg or more.
- **Space**: body mass goes with breadths and depths — seat widths, aisle widths, turning spaces.
- **Loads on the body itself**: the segments the muscles must hold up.

| Segment (share of body mass, after Dempster) | Share | For an 85 kg man |
|---|---|---|
| Head and neck | 8.1 % | 6.9 kg |
| Trunk | 49.7 % | 42.2 kg |
| Upper arm, forearm, hand (one arm) | 2.8 + 1.6 + 0.6 = 5.0 % | 4.3 kg |
| Thigh, shank, foot (one leg) | 10.0 + 4.65 + 1.45 = 16.1 % | 13.7 kg |

An outstretched arm is more than 4 kg held at arm's length: why working with raised arms tires the shoulders within minutes ([[static-muscle-work]]).

### Strength: wide, overlapping and posture-bound
Strength is measured as the force a person exerts in a defined posture, grip and duration — a hand dynamometer for grip, a force gauge for pushing a handle. Representative grip strength of working-age adults (dominant hand, rounded from normative studies such as Dodds et al., 2014) is about **450 ± 90 N** for men (46 kgf) and **275 ± 60 N** for women (28 kgf). Two features dominate design:
- **The spread is wide**: the coefficient of variation of strength is 20–30 %, against 4 % for stature. The 5th-percentile woman grips with about 175 N, the 95th-percentile man with about 600 N — more than three times as much.
- **Strength belongs to a posture.** It changes with joint angle, grip span, speed, duration, gloves, fatigue, age and training; a table value applies only to the posture in which it was measured ([[strength-and-force]]).

On average women's strength is about half to two-thirds of men's in the upper body and about two-thirds in the legs — averages with a wide overlap ([[sex-differences]]); strength peaks in the thirties and falls by roughly a third by the age of 80 ([[age-children-elderly]]).

### Designing forces
| Design case | Who limits it | Rule |
|---|---|---|
| A force everybody must be able to exert once (a door, a valve, a release) | the weakest intended users | below the 5th percentile of women or older users, in the real posture |
| A force exerted repeatedly or held | the same users, over time | a fraction of their maximum: held efforts above about 15 % cannot be kept up (Rohmert) |
| A load the body carries | the heaviest users | rate structures from the high tail of body mass, with a margin |
| A force limited by footing | body weight and friction | a push can never exceed $\\mu\\,m\\,g$ |

Pushing and pulling show the last rule clearly: the feet push back on the floor through friction, so a 68 kg person on a floor with a friction coefficient of 0.4 can push horizontally with at most $0.4 \\times 68 \\times 9.81 = 267$ N, and on a wet floor with 0.2 only 133 N — however strong they are ([[physics:friction|friction]], [[pushing-pulling]]). UK guidance on manual handling uses about 200 N (men) and 150 N (women) as the force to start or stop a load, and 100 N and 70 N to keep it moving, as the level below which a task needs no detailed assessment.

For machinery, EN 1005-3 derives force limits from the strength of a low percentile of the adult population and reduces them for speed, frequency and duration. The simulation shows the spread of grip strength for men and women, the share able to exert a required force for a single effort or as a held fraction, the friction limit on pushing, and the skewed spread of body mass against a load rating.

> [!warn] A strong operator does not make a heavy task safe. Forces near a person's maximum, repeated or held, injure the strong too — design the force down.

> [!key] Loads from the heavy end, forces from the weak end — and for anything repeated or held, only a fraction of the weak end's maximum.
`,
  ideas: [
    'Body mass is skewed to the right and has risen for decades: rate structures from recent data and the high tail.',
    'Segment masses (head 8 %, trunk 50 %, each arm 5 %, each leg 16 %) are the loads muscles hold up.',
    'Strength varies by 20–30 % within one sex and depends on posture, grip, speed, duration and age.',
    'Forces are designed from the weakest intended users; held efforts should stay below about 15 % of their maximum.',
    'A horizontal push can never exceed μmg: footing, not muscle, often sets the limit.'
  ],
  pitfalls: [
    'A strong workforce makes high forces acceptable — Forces near anyone\'s maximum, repeated or held, cause injuries; and the workforce changes.',
    'Body mass is normally distributed like stature — It has a long heavy tail: normal-model percentiles underrate the heaviest users.',
    'A pushing force is limited only by the person\'s strength — The feet must push on the floor: friction and body mass set a ceiling of μmg.'
  ],
  formulas: [
    {
      name: 'The friction limit on a horizontal push',
      expr: 'F = mu*m*g', tex: 'F_{max} = \\mu\\,m\\,g',
      vars: {
        F: { name: 'largest horizontal push or pull', q: 'force', unit: 'N', tex: 'F_{max}' },
        mu: { name: 'coefficient of friction between shoes and floor', q: 'none', value: 0.4, tex: '\\mu' },
        m: { name: 'body mass (plus anything carried)', q: 'mass', unit: 'kg', value: 68 },
        g: { const: 'g' }
      },
      note: 'Leaning into the push does not raise the limit: only more weight on the feet, a better floor or bracing the feet against something does.',
      stories: { F: 'A person of {m} pushes on a floor with a friction coefficient of {mu}. What is the largest horizontal force they can apply?', mu: 'A person of {m} must push with {F}. What friction coefficient does the floor need?' }
    },
    {
      name: 'A design force from the weak end of the population',
      expr: 'F = k*(mu - z*s)', tex: 'F_d = k\\,(\\mu - z\\,\\sigma)',
      vars: {
        F: { name: 'design force', q: 'force', unit: 'N', tex: 'F_d' },
        k: { name: 'fraction of the maximum the task may use (about 15 % if held)', q: 'ratio', unit: '%', value: 15 },
        mu: { name: 'mean maximum force of the weaker group', q: 'force', unit: 'N', value: 275, tex: '\\mu' },
        z: { name: 'z of the percentile designed for (1.645 for the 5th)', q: 'none', value: 1.645 },
        s: { name: 'standard deviation of the maximum force', q: 'force', unit: 'N', value: 60, tex: '\\sigma' }
      },
      note: 'Default: women\'s grip strength (representative 275 ± 60 N), 5th percentile, held at 15 %.',
      stories: { F: 'Women\'s grip strength is {mu} ± {s}. What force may a held trigger need if it must suit the percentile with z = {z} at {k} of their maximum?' }
    },
    {
      name: 'Mass of a body segment',
      expr: 'ms = r*M', tex: 'm_s = r\\,M',
      vars: {
        ms: { name: 'segment mass', q: 'mass', unit: 'kg', tex: 'm_s' },
        r: { name: 'segment\'s share of body mass (whole arm 5.0 %, leg 16.1 %, head and neck 8.1 %)', q: 'ratio', unit: '%', value: 5.0 },
        M: { name: 'body mass', q: 'mass', unit: 'kg', value: 85 }
      },
      note: 'Average proportions (Dempster, 1955, as tabulated by Winter); individuals differ.',
      stories: { ms: 'A person weighs {M}. What does a segment making up {r} of body mass weigh?' }
    }
  ],
  examples: [
    {
      title: 'A trigger held all day',
      q: 'A hand tool\'s trigger is held down for most of each cycle, by men and women. Women\'s grip strength is 275 ± 60 N. What trigger force suits the 5th-percentile woman at 15 % of her maximum?',
      steps: [
        '5th-percentile woman: $275 - 1.645 \\times 60 = 176$ N.',
        'Held effort at 15 %: $0.15 \\times 176 = 26$ N.',
        'A 50 N trigger would ask her for 28 % of her maximum grip, all day: a recipe for fatigue and forearm complaints. Choose a lighter trigger or a lock-on with a safety release.'
      ],
      a: 'About 25 N at most.'
    },
    {
      title: 'The floor decides',
      q: 'Starting a loaded trolley needs 200 N. Can a 68 kg worker start it on a wet floor with a friction coefficient of 0.2? On a dry floor with 0.4?',
      steps: [
        'Wet: $F_{max} = 0.2 \\times 68 \\times 9.81 = 133$ N — less than 200 N: the feet slip before the trolley moves.',
        'Dry: $0.4 \\times 68 \\times 9.81 = 267$ N — possible, but 200 N is above the 150 N guideline for women.',
        'Fix the trolley (bigger wheels, better bearings, a smoother floor) rather than the worker.'
      ],
      a: 'Not on the wet floor (133 N at most); on the dry floor yes, but it is still too hard a push.'
    }
  ],
  quiz: [
    { q: 'Roughly how large is the coefficient of variation of strength, compared with stature\'s 4 %?', choices: ['About 20–30 %', 'About 4 %', 'About 1 %', 'About 100 %'], a: 0, why: 'Strength varies far more than lengths: the strongest are three or more times as strong as the weakest.' },
    { q: 'Whose strength should set the force needed to open an emergency door?', choices: ['The weakest intended users — a low percentile of women and older people', 'The average user', 'The strongest user', 'A trained firefighter'], a: 0, why: 'Everybody must be able to open it, so the weak end limits the design.' },
    { q: 'A stronger worker can always push a trolley harder.', a: false, why: 'The push is limited by friction at the feet: $F \\le \\mu m g$. On a slippery floor even a strong person slips first.' },
    { q: 'An 80 kg person pushes on a floor with a friction coefficient of 0.5. What is the largest horizontal force, in newtons?', answer: 392, unit: 'N', why: '$0.5 \\times 80 \\times 9.81 = 392$ N.' },
    { q: 'Why is the normal model poor for the heaviest users?', choices: ['Body mass is skewed: its heavy tail is longer than the normal curve predicts', 'Heavy people are rare', 'Body mass is measured inaccurately', 'The normal model overestimates the heaviest users'], a: 0, why: 'A long right tail means real high percentiles exceed the normal model\'s.' }
  ],
  problems: [
    { q: 'What is the largest horizontal push a 68 kg person can apply on a floor with a friction coefficient of 0.4?', answer: 267, unit: 'N', tol: 0.01, steps: ['$F = 0.4 \\times 68 \\times 9.81 = 267$ N.'] },
    { q: 'Women\'s grip strength is 275 ± 60 N. What held force is 15 % of the 5th-percentile woman\'s maximum?', answer: 26.4, unit: 'N', tol: 0.02, steps: ['$0.15 \\times (275 - 1.645 \\times 60) = 0.15 \\times 176.3 = 26.4$ N.'] }
  ],
  ranges: [
    { dim: 'Rated user mass for ladders and general access equipment', range: [150, null], unit: 'kg', who: 'the heaviest ordinary users with their tools and clothing', why: 'Equipment does not fail or tip under heavy users.', limits: 'Bariatric users need equipment rated for 250 kg or more; check each product standard.', setting: ['civil', 'workshop'], src: 'EN 131' },
    { dim: 'Grip force for a trigger or lever held continuously', range: [null, 25], unit: 'N', who: '15 % of the 5th-percentile woman\'s maximum grip (about 175 N)', why: 'Held efforts above about 15 % of maximum tire the muscles and cannot be kept up.', limits: 'Gloves, bent wrists, cold and older users lower the capacity further; test with users.', setting: ['workshop', 'field', 'civil'], src: 'Rohmert (1960); derived from representative data' },
    { dim: 'Force to start or stop a wheeled load (guideline, workforce including women)', range: [null, 150], unit: 'N', who: 'women; about 200 N for men', why: 'Below this, pushing and pulling rarely needs a detailed assessment.', limits: 'Lower for poor floors, long distances, frequent pushes and awkward handles; see [[pushing-pulling]].', setting: ['workshop', 'health', 'civil'], src: 'UK HSE guidance on the Manual Handling Operations Regulations (L23)' },
    { dim: 'Force to keep a wheeled load moving (guideline, workforce including women)', range: [null, 70], unit: 'N', who: 'women; about 100 N for men', why: 'Sustained forces fatigue more than brief ones.', limits: 'Lower still over long distances and on slopes.', setting: ['workshop', 'health', 'civil'], src: 'UK HSE guidance on the Manual Handling Operations Regulations (L23)' }
  ],
  applications: [
    'Rating seats, beds, ladders, stretchers and platforms for heavy users.',
    'Setting operating forces for triggers, levers, valves, doors and emergency releases.',
    'Trolley and floor design for pushing and pulling: see [the lifting and carrying tools](#/tools/lifting/carry).',
    'Segment masses in biomechanical models and digital manikins.'
  ],
  history: 'Wilfrid Dempster\'s 1955 report for the US Air Force, *Space Requirements of the Seated Operator*, gave the segment masses and link lengths still used in biomechanics. Walter Rohmert\'s 1960 study of how long static contractions can be held showed that endurance collapses above about 15 % of maximum strength.',
  sources: [
    'W. T. Dempster, *Space Requirements of the Seated Operator*, WADC Technical Report 55-159, 1955 — segment masses.',
    'D. A. Winter, *Biomechanics and Motor Control of Human Movement* — tables of segment parameters.',
    'R. M. Dodds et al., "Grip strength across the life course: normative data from twelve British studies", *PLoS ONE*, 2014.',
    'W. Rohmert, "Ermittlung von Erholungspausen für statische Arbeit des Menschen", *Internationale Zeitschrift für angewandte Physiologie*, 1960.',
    'EN 1005-3, *Safety of machinery — Human physical performance — Part 3: Recommended force limits for machinery operation*.',
    'UK Health and Safety Executive, *Manual Handling Operations Regulations 1992: Guidance on Regulations* (L23).',
    'EN 131, *Ladders* (parts 1 and 2: dimensions, requirements and tests).'
  ],
  sim: 'an-strength'
},

{
  id: 'sex-differences', parent: 'human-variation', title: 'Men and women', level: 1,
  short: 'On average men are taller, broader at the shoulders, heavier and stronger, and women broader at the hips — but the distributions overlap widely: about one woman in twelve is taller than a randomly chosen man. Designs built only around men\'s data have left women with PPE, tools, cockpits and car seats that fit badly; good design covers both.',
  keywords: ['sex differences', 'gender differences', 'men and women', 'female anthropometry', 'overlap', 'effect size', 'Cohen\'s d', 'overlap coefficient', 'hip breadth', 'strength differences', 'PPE for women', 'crash test dummy', 'inclusive design', 'mixed population', 'pregnancy'],
  prereq: ['percentiles', 'anthropometry-basics'],
  related: ['population-differences', 'combining-percentiles', 'hand-foot-head', 'mass-strength-data', 'clothing-ppe-allowances', 'personal-equipment-fit', 'ppe-ergonomics', 'vehicle-seating', 'crew-stations', 'medicine:pregnancy'],
  body: `
Men and women differ in size, shape and strength **on average** — and overlap so widely that the difference between two people of the same sex is often larger than the difference between the averages. Both facts matter for design: the averages explain why a design built around men fits many women badly, and the overlap explains why "a design for women" and "a design for men" is rarely the answer.

### Averages and overlap
| Dimension (representative) | Men | Women | Women / men | A random woman exceeds a random man |
|---|---|---|---|---|
| Stature | 1755 ± 70 mm | 1625 ± 64 mm | 0.93 | 8.5 % of the time |
| Sitting height | 915 ± 36 mm | 855 ± 34 mm | 0.93 | 11 % |
| Popliteal height | 445 ± 28 mm | 405 ± 26 mm | 0.91 | 15 % |
| Forward grip reach | 800 ± 38 mm | 730 ± 36 mm | 0.91 | 9 % |
| Shoulder breadth | 480 ± 28 mm | 415 ± 25 mm | 0.86 | 4 % |
| Hand breadth | 88 ± 5 mm | 78 ± 4 mm | 0.89 | 6 % |
| Hip breadth sitting | 370 ± 27 mm | 395 ± 34 mm | 1.07 | **72 %** |
| Body mass | 85 ± 14 kg | 68 ± 13 kg | 0.80 | 19 % |
| Grip strength | 450 ± 90 N | 275 ± 60 N | 0.61 | 5 % |

The last column is the [[?probability|probability]] that a woman picked at random is larger than a man picked at random: $P = \\Phi\\big((\\mu_f - \\mu_m)/\\sqrt{\\sigma_f^2 + \\sigma_m^2}\\big)$. Statisticians also measure the gap by the effect size $d$ — the difference of the means in pooled [[?standard-deviation|standard deviations]] — and the **overlap** of the two curves: for stature $d \\approx 1.9$ and a third of the area under the two curves is shared; for body mass $d \\approx 1.3$ and more than half is shared. In the simulation, choose a dimension and read the overlap, the effect size and the ratio of the means; the bars below compare every dimension at once.

### Shape, not only size
Women are not scaled-down men. Relative to stature they have broader hips, narrower shoulders, slightly shorter legs, smaller hands and feet, and a different chest shape; pregnancy changes abdominal depth, reach, balance and the space needed at a bench or a steering wheel ([[medicine:pregnancy|pregnancy]]). This is why women's body armour, harnesses, seat belts, respirators and gloves need their own patterns, not the smallest men's sizes.

### Strength
On average women's strength is about half to two-thirds of men's in the upper body and about two-thirds in the legs; grip is about 60 % in the representative data. The spread within each sex is so wide that many women are stronger than many men — but a force set for the average man excludes most women. Forces are therefore set from the weak end of the whole workforce ([[mass-strength-data]]).

### When designs were made for men
- **PPE** has often been designed from male data and offered to women in small men's sizes; trade-union and safety-body surveys have repeatedly found women working in gloves, boots, harnesses and coveralls that do not fit.
- **Cars** were long developed with crash-test dummies built around the 50th-percentile man; the small female dummy is essentially a scaled-down male. A 2011 study of real crashes (Bose and colleagues) found that belted women drivers had markedly higher odds of serious injury than belted men in comparable crashes.
- **Cockpits and crew stations** sized for male personnel have forced small women to sit too close to controls or not to reach pedals; tools sized for men's grip spans demand more of women's hands.

### Designing for both
1. Use data for the **actual mix** of the users — and for the dimensions where women are larger (hips, some chest depths), their percentiles.
2. Set ranges from the **5th-percentile woman to the 95th-percentile man** on each dimension; for PPE and clothing, provide women's own size ranges.
3. Include women in **digital manikins** and **fitting trials** ([[digital-human-models]], [[user-trials-mockups]]).
4. Set forces from the weak end; check strength-related tasks for both sexes.

| Setting | Where the difference bites |
|---|---|
| Office and home | seat width (hips), desk and seat heights (legs), reach to shelves |
| Workshop and industry | tool grip spans, glove and boot sizes, forces |
| Military | body armour and load carriage fitting, cockpits and crew stations ([[personal-equipment-fit]]) |
| Vehicles | seat position close to the wheel and airbag, belt routing, pedal reach |
| Health care | a largely female workforce moving heavy patients ([[patient-handling]]) |

> [!warn] Sex differences are averages with wide overlap. Never assign tasks or sizes by sex alone: fit each person, and design so that people at both ends of the whole range are served.

> [!key] Design for the whole mixed range: the 5th-percentile woman limits reach, force and small sizes; the 95th-percentile man limits clearance — and women limit hip width.
`,
  ideas: [
    'Men are larger on average in most dimensions, women at the hips; the distributions overlap widely.',
    'About one woman in twelve is taller than a randomly chosen man (representative data).',
    'Women are not scaled-down men: shape, chest, hands and pregnancy need their own patterns and sizes.',
    'Women\'s strength averages about half to two-thirds of men\'s in the upper body; forces are set from the weak end of the whole workforce.',
    'Designs from male data — PPE, crash dummies, cockpits, tools — have fitted women badly; design and test with both.'
  ],
  pitfalls: [
    'Designing for the 95th-percentile man covers all women — It covers clearances, but reaches, forces, small sizes and hip width are limited by women.',
    'Women\'s PPE is just the smallest men\'s sizes — Proportions differ: small men\'s sizes are too long, too narrow at the hips or wrong at the chest.',
    'Sex differences justify assigning tasks by sex — The overlap is wide; fit tasks and equipment to individuals and design for the whole range.'
  ],
  formulas: [
    {
      name: 'Chance that a random woman exceeds a random man',
      expr: 'P = ncdf((muf - mum)/sqrt(sf^2 + sm^2))', tex: 'P = \\Phi\\!\\left(\\dfrac{\\mu_f - \\mu_m}{\\sqrt{\\sigma_f^2 + \\sigma_m^2}}\\right)',
      vars: {
        P: { name: 'probability that the woman is larger', q: 'ratio', unit: '%' },
        muf: { name: 'women\'s mean', q: 'length', unit: 'mm', value: 1625, tex: '\\mu_f' },
        mum: { name: 'men\'s mean', q: 'length', unit: 'mm', value: 1755, tex: '\\mu_m' },
        sf: { name: 'women\'s standard deviation', q: 'length', unit: 'mm', value: 64, tex: '\\sigma_f' },
        sm: { name: 'men\'s standard deviation', q: 'length', unit: 'mm', value: 70, tex: '\\sigma_m' }
      },
      note: 'The difference of two independent normal variables is normal, with the variances added.',
      stories: { P: 'Women\'s stature is {muf} ± {sf}, men\'s {mum} ± {sm}. How often is a random woman taller than a random man?' }
    },
    {
      name: 'Effect size of a sex difference',
      expr: 'd = (mum - muf)/sqrt((sm^2 + sf^2)/2)', tex: 'd = \\dfrac{\\mu_m - \\mu_f}{\\sqrt{(\\sigma_m^2 + \\sigma_f^2)/2}}',
      vars: {
        d: { name: 'effect size (difference in pooled standard deviations)', q: 'none', signed: true },
        mum: { name: 'men\'s mean', q: 'length', unit: 'mm', value: 1755, tex: '\\mu_m' },
        muf: { name: 'women\'s mean', q: 'length', unit: 'mm', value: 1625, tex: '\\mu_f' },
        sm: { name: 'men\'s standard deviation', q: 'length', unit: 'mm', value: 70, tex: '\\sigma_m' },
        sf: { name: 'women\'s standard deviation', q: 'length', unit: 'mm', value: 64, tex: '\\sigma_f' }
      },
      note: 'Negative when women are larger (hip breadth sitting: about −0.8).',
      stories: { d: 'Men\'s mean is {mum} ± {sm} and women\'s {muf} ± {sf}. How many pooled standard deviations apart are the means?' }
    },
    {
      name: 'Overlap of two equal-spread normal curves',
      expr: 'OVL = 2*ncdf(-d/2)', tex: '\\mathrm{OVL} = 2\\,\\Phi\\!\\left(-\\dfrac{d}{2}\\right)',
      vars: {
        OVL: { name: 'shared area of the two curves', q: 'ratio', unit: '%', tex: '\\mathrm{OVL}' },
        d: { name: 'effect size (use its size)', q: 'none', value: 1.94 }
      },
      note: 'Exact for equal standard deviations, a good estimate when they are close.',
      stories: { OVL: 'Two groups differ by an effect size of {d}. What share of the area under their curves is shared?', d: 'Two curves share {OVL} of their area. What effect size separates them?' }
    }
  ],
  examples: [
    {
      title: 'How often is a woman taller?',
      q: 'Men\'s stature is 1755 ± 70 mm and women\'s 1625 ± 64 mm. Pick a man and a woman at random: how often is she the taller? How much of the two curves overlap?',
      steps: [
        'The difference woman − man has mean $-130$ mm and standard deviation $\\sqrt{64^2 + 70^2} = 94.8$ mm.',
        '$P = \\Phi(-130/94.8) = \\Phi(-1.37) = 8.5$ %.',
        'Effect size $d = 130/\\sqrt{(70^2 + 64^2)/2} = 1.94$; overlap $2\\Phi(-0.97) = 33$ %.'
      ],
      a: 'About one pair in twelve; a third of the area under the curves is shared.'
    },
    {
      title: 'Where women are larger',
      q: 'Hip breadth sitting is 370 ± 27 mm for men and 395 ± 34 mm for women. How often is a random woman wider than a random man, and who sets a seat width?',
      steps: [
        '$P = \\Phi\\big(25/\\sqrt{34^2 + 27^2}\\big) = \\Phi(0.58) = 72$ %.',
        '95th percentiles: women $395 + 1.645 \\times 34 = 451$ mm, men $370 + 1.645 \\times 27 = 414$ mm.',
        'Seat widths are set by women\'s hips: about 500 mm with clothing.'
      ],
      a: 'About 72 % of the time; women\'s hips set seat width.'
    }
  ],
  quiz: [
    { q: 'With representative data, about how often is a randomly chosen woman taller than a randomly chosen man?', choices: ['About 8–9 % of the time', 'Never', 'About 50 % of the time', 'About 1 % of the time'], a: 0, why: '$\\Phi(-130/94.8) \\approx 0.085$: the averages differ, but the curves overlap.' },
    { q: 'In which of these dimensions are women larger on average?', choices: ['Hip breadth sitting', 'Shoulder breadth', 'Hand breadth', 'Sitting height'], a: 0, why: '395 mm against 370 mm: seat widths are set by women\'s hips.' },
    { q: 'A design that fits the 95th-percentile man fits every woman.', a: false, why: 'Clearances yes — but reaches, forces, small sizes and hip width are limited by women.' },
    { q: 'On average, women\'s upper-body strength is about what share of men\'s?', choices: ['About half to two-thirds', 'About 95 %', 'About a quarter', 'About the same'], a: 0, why: 'Upper-body strength differs most (roughly 50–65 %), leg strength less (about two-thirds), with wide overlap.' },
    { q: 'For stature the effect size $d$ is about 1.9. What does it say?', choices: ['The means are about two pooled standard deviations apart, yet a third of the curves overlap', 'Men are 1.9 times as tall', 'Only 1.9 % of women are taller than men', 'The difference is 1.9 mm'], a: 0, why: '$d$ counts standard deviations between the means; the overlap is $2\\Phi(-d/2) \\approx 33$ %.' }
  ],
  problems: [
    { q: 'Forward grip reach is 800 ± 38 mm for men and 730 ± 36 mm for women. How often does a random woman out-reach a random man?', answer: 9.1, unit: '%', tol: 0.03, steps: ['$z = -70/\\sqrt{38^2 + 36^2} = -70/52.3 = -1.34$.', '$P = \\Phi(-1.34) = 9.1$ %.'] },
    { q: 'Popliteal height is 445 ± 28 mm for men and 405 ± 26 mm for women. What is the effect size $d$?', answer: 1.48, unit: '', tol: 0.02, steps: ['$d = 40/\\sqrt{(28^2 + 26^2)/2} = 40/27.0 = 1.48$.'] }
  ],
  ranges: [
    { dim: 'Stature range for a mixed workforce', range: [1520, 1870], unit: 'mm', who: '5th-percentile woman to 95th-percentile man', why: 'About 95 % of an equal mix of men and women on one dimension.', limits: 'Add shoes and helmets; other dimensions and the combination need checking.', setting: 'all', src: 'Representative data; ISO/TR 7250-2' },
    { dim: 'Grip force for occasional operation by a mixed workforce', range: [null, 175], unit: 'N', who: 'the 5th-percentile woman\'s maximum grip (representative 275 ± 60 N)', why: 'Nearly everyone can exert it once.', limits: 'It is her maximum: repeated or held use needs a fraction (about 15 %); older users and gloves need less.', setting: ['workshop', 'civil', 'field'], src: 'Derived from representative data' },
    { dim: 'PPE, uniforms and harnesses for women', range: 'women\'s own patterns and sizes', who: 'women across their whole range, including the smallest', why: 'Fit at the hips, chest, hands and feet; protection that stays in place.', limits: 'Small men\'s sizes are the wrong shape; fit-test respirators on each wearer.', setting: ['workshop', 'military', 'field', 'health'], src: 'Sex-specific anthropometric data (ANSUR II; ISO/TR 7250-2)' }
  ],
  applications: [
    'Specifying workstation adjustment ranges from the 5th-percentile woman to the 95th-percentile man.',
    'Procuring PPE and uniforms in women\'s patterns and sizes.',
    'Using female as well as male manikins and crash-test dummies in design and testing.',
    'Comparing any dimension for men and women: see [the body-size explorer](#/tools/bodysize/explorer).'
  ],
  history: 'Early military surveys measured mostly men; large surveys since the 1980s, such as ANSUR (1988) and ANSUR II (2012), measured women in their own right, and women\'s growing roles in industry, aviation and the armed forces have pushed designers to use both sets of data.',
  sources: [
    'C. C. Gordon et al., *2012 Anthropometric Survey of U.S. Army Personnel: Methods and Summary Statistics* (ANSUR II) — men\'s and women\'s data.',
    'ISO/TR 7250-2, *Statistical summaries of body measurements from national populations*.',
    'A. E. J. Miller et al., "Gender differences in strength and muscle fiber characteristics", *European Journal of Applied Physiology*, 1993.',
    'D. Bose, M. Segui-Gomez and J. R. Crandall, "Vulnerability of female drivers involved in motor vehicle crashes", *American Journal of Public Health*, 2011.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — sex differences in anthropometry and strength.'
  ],
  sim: 'an-overlap'
},

{
  id: 'population-differences', parent: 'human-variation', title: 'Populations and the secular trend', level: 2,
  short: 'National average statures differ by more than 20 cm, body proportions differ too, and most populations grew taller through the twentieth century while body mass keeps rising. Data from another country or another decade can misjudge a design by several centimetres — use data for the actual users, now.',
  keywords: ['population differences', 'national anthropometry', 'secular trend', 'height trends', 'NCD-RisC', 'body proportions', 'sitting height ratio', 'export design', 'global product', 'user population', 'occupational population', 'obesity trend', 'data age', 'ISO/TR 7250-2'],
  prereq: ['percentiles', 'sex-differences', 'anthropometry-basics'],
  related: ['design-for-range', 'age-children-elderly', 'combining-percentiles', 'ergo-standards', 'machine-ergonomics-principles', 'biology:polygenic-traits', 'medicine:obesity', 'medicine:child-growth'],
  body: `
A body-size table describes the people who were measured — their nation, their generation, their occupation. Move the design to another country or another decade and the users change.

### Nations differ
A pooled analysis of height measurements from population-based studies in 200 countries (the NCD Risk Factor Collaboration, 2016) compared adults born in 1996:

| Population (born 1996) | Mean stature |
|---|---|
| Tallest men: the Netherlands | about 1825 mm |
| Tallest women: Latvia | about 1700 mm |
| Shortest men: Timor-Leste | about 1600 mm |
| Shortest women: Guatemala | about 1490 mm |
| This app's representative adults | men 1755 mm, women 1625 mm |

The tallest and shortest national averages differ by more than 20 cm — three standard deviations of stature within one population. A design that fits the 5th to 95th percentile of one nation can leave a quarter of another nation's men too tall for it, or its women unable to reach.

### Proportions differ too
Populations differ in shape as well as size. The ratio of sitting height to stature — trunk against legs — varies between populations by a few per cent, and so do breadths and body mass at the same stature. Scaling one population's data by the ratio of statures is therefore only an estimate: seat heights, knee room and reach depend on leg and arm length, not on stature alone. ISO/TR 7250-2 collects national summary statistics measured to the same definitions; ISO 15535 describes how to build new ones.

### Groups within a nation
A nation's table averages many groups: regions, ethnic origins, occupations, ages. Occupational populations are often **selected**: soldiers pass fitness standards, pilots and some crews stature limits, heavy manual workers self-select for strength. The population that actually uses a product — its market, its workforce, including migrant workers and multinational crews — is the one to design for.

### The secular trend
Through the twentieth century most populations grew taller from one generation to the next, mainly because of better nutrition and health in childhood. European men gained about 11 cm between those born in the 1870s and those born around 1980; over the century of birth cohorts from 1896 to 1996, South Korean women gained about 20 cm and Iranian men about 16.5 cm. In several high-income countries the rise has slowed or stopped for recent generations, and in some low-income countries it has reversed slightly. Body mass has risen almost everywhere — the WHO reports that worldwide obesity has nearly tripled since 1975 — so a survey of body mass or breadths more than a decade or two old underrates today's users.

$$x = x_0 + r\\,n$$

projects a dimension $n$ decades ahead at a trend of $r$ per decade: up to about 10 mm per decade in stature where growth continues, zero where it has stopped.

In the simulation, take a design made for this app's population — a door, a chair, a top shelf, a knee space — and give it to a taller or shorter population, or to users a few decades later: watch the share it accommodates change.

### What it means for design
- **Use data for the real users**, as recent as possible; state which population and survey a design rests on.
- **Exports**: check the design against the target market's data; adjust ranges or offer market variants. EN 614-1 asks machinery designers to consider the characteristics of the intended users.
- **Worldwide products**: span the 5th-percentile woman of the shortest markets to the 95th-percentile man of the tallest — or make the design adjustable over that span.
- **Long-lived designs** (buildings, vehicles, aircraft, ships in service for decades): allow for the trend in stature and, especially, in body mass.

| Setting | Population issue |
|---|---|
| Home and public | the whole resident population, all ages; national codes |
| Office and workshop | the workforce, including migrant workers |
| Vehicles and aircraft | global platforms sold into markets from the shortest to the tallest |
| Military | selected personnel; multinational forces sharing equipment |
| Field | local workforces in many countries; imported machinery |

> [!warn] A body-size table is valid for its population and its time. Using an old or foreign survey without checking can misplace clearances, reaches and seat heights by several centimetres and ratings for body mass by many kilograms.

> [!key] Design for the users you actually have, measured recently: nation, generation, occupation and sex mix all shift the numbers.
`,
  ideas: [
    'National mean statures differ by more than 20 cm between the tallest and shortest populations.',
    'Body proportions differ between populations, so scaling data by stature is only an estimate.',
    'Most populations grew taller through the twentieth century; the rise has slowed or stopped in some rich countries.',
    'Body mass is still rising in most of the world: old data underrate today\'s users.',
    'Occupational populations are selected: soldiers, pilots and manual workers differ from the general public.'
  ],
  pitfalls: [
    'Body-size data are universal — They describe one population at one time; another nation or decade can differ by several centimetres.',
    'Scaling a population\'s data by its average stature gives another population\'s data — Proportions differ: legs, trunks, breadths and mass do not scale together.',
    'The secular trend means everyone keeps getting taller — In several countries growth has stopped; body mass, not stature, is now the faster-changing dimension.'
  ],
  formulas: [
    {
      name: 'A dimension projected with a secular trend',
      expr: 'x = x0 + r*n', tex: 'x = x_0 + r\\,n',
      vars: {
        x: { name: 'projected mean', q: 'length', unit: 'mm' },
        x0: { name: 'mean when the data were measured', q: 'length', unit: 'mm', value: 1755, tex: 'x_0' },
        r: { name: 'change per decade', q: 'length', unit: 'mm', value: 10, signed: true },
        n: { name: 'number of decades', q: 'none', value: 3 }
      },
      note: 'A straight-line projection; trends slow, stop or reverse, so use it only a few decades ahead.',
      stories: { x: 'A survey found a mean stature of {x0}. At {r} per decade, what is it after {n} decades?', n: 'How many decades at {r} per decade take a mean of {x0} to {x}?' }
    },
    {
      name: 'Share exceeding a design limit after a shift of the mean',
      expr: 'F = 1 - ncdf((L - mu - dm)/s)', tex: 'F = 1 - \\Phi\\!\\left(\\dfrac{L - \\mu - \\Delta\\mu}{\\sigma}\\right)',
      vars: {
        F: { name: 'share of users above the limit', q: 'ratio', unit: '%' },
        L: { name: 'design limit (a clearance)', q: 'length', unit: 'mm', value: 1870 },
        mu: { name: 'mean of the design data', q: 'length', unit: 'mm', value: 1755, tex: '\\mu' },
        dm: { name: 'shift of the users\' mean', q: 'length', unit: 'mm', value: 70, signed: true, tex: '\\Delta\\mu' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 70, tex: '\\sigma' }
      },
      note: 'Assumes the users have the same spread as the design data.',
      stories: { F: 'A clearance of {L} was set from data with a mean of {mu} and a standard deviation of {s}. The users are {dm} taller on average. What share of them exceed it?' }
    },
    {
      name: 'Scaling a dimension by stature (an estimate)',
      expr: 'x2 = x1*S2/S1', tex: 'x_2 = x_1\\,\\dfrac{S_2}{S_1}',
      vars: {
        x2: { name: 'estimated dimension in the new population', q: 'length', unit: 'mm', tex: 'x_2' },
        x1: { name: 'dimension in the known population', q: 'length', unit: 'mm', value: 445, tex: 'x_1' },
        S2: { name: 'mean stature of the new population', q: 'length', unit: 'mm', value: 1825, tex: 'S_2' },
        S1: { name: 'mean stature of the known population', q: 'length', unit: 'mm', value: 1755, tex: 'S_1' }
      },
      note: 'Assumes the same proportions — often wrong by a few per cent; prefer measured data.',
      stories: { x2: 'A dimension is {x1} in a population of mean stature {S1}. Estimate it for a population of mean stature {S2}.' }
    }
  ],
  examples: [
    {
      title: 'Exporting to a taller population',
      q: 'A cab\'s headroom accommodates men up to 1870 mm (the 95th percentile of men 1755 ± 70 mm). What share of men is too tall in a population whose men average 1825 mm with the same spread?',
      steps: [
        '$z = (1870 - 1825)/70 = 0.64$, so $\\Phi(0.64) = 74$ % are shorter.',
        'About 26 % of the new population\'s men are too tall, against 5 % in the original.',
        'The fix: design to the 95th percentile of the tallest market (about 1940 mm) or offer a raised-roof variant.'
      ],
      a: 'About a quarter of the men, instead of one in twenty.'
    },
    {
      title: 'An old survey',
      q: 'A company uses a survey measured 45 years ago, when men averaged 1735 mm; the population has since grown by about 10 mm per decade. Estimate today\'s mean.',
      steps: [
        '$n = 4.5$ decades: $x = 1735 + 10 \\times 4.5 = 1780$ mm.',
        'A 45 mm shift moves a 95th-percentile clearance to about the 88th percentile of today\'s men.',
        'Body mass will have changed even more: find recent data.'
      ],
      a: 'About 1780 mm — the old data are some 45 mm short.'
    }
  ],
  quiz: [
    { q: 'By about how much do the tallest and shortest national mean statures differ?', choices: ['More than 20 cm', 'About 2 cm', 'About 5 cm', 'About 60 cm'], a: 0, why: 'For people born in 1996, men averaged about 182.5 cm in the Netherlands and about 160 cm in Timor-Leste.' },
    { q: 'Scaling one population\'s body data by the ratio of mean statures gives the other population\'s data exactly.', a: false, why: 'Proportions — legs, trunks, breadths, mass — differ between populations; scaling is only an estimate.' },
    { q: 'What mainly drove the twentieth-century rise in stature?', choices: ['Better nutrition and health in childhood', 'Changes in genes over a few generations', 'Measuring people in shoes', 'People standing straighter'], a: 0, why: 'A few generations are too short for genetic change; childhood nutrition, disease and living conditions changed a great deal.' },
    { q: 'A machine designed with one nation\'s data will be exported. What should the designer do?', choices: ['Check it against data for the target users and adjust ranges or offer variants', 'Nothing: people are the same everywhere', 'Scale everything by 10 %', 'Use the average of the two nations'], a: 0, why: 'Design for the actual users; EN 614-1 asks designers to consider the intended user population.' },
    { q: 'Which body measure is rising fastest in most populations today?', choices: ['Body mass', 'Stature', 'Hand length', 'Head circumference'], a: 0, why: 'Stature has plateaued in many countries while body mass continues to rise.' }
  ],
  problems: [
    { q: 'A survey measured a mean stature of 1755 mm. At a trend of 10 mm per decade, what is the mean after 3 decades?', answer: 1785, unit: 'mm', tol: 0.005, steps: ['$x = 1755 + 10 \\times 3 = 1785$ mm.'] },
    { q: 'A clearance fits men up to 1870 mm (data 1755 ± 70 mm). What share of a population whose men are 70 mm taller on average exceeds it?', answer: 26, unit: '%', tol: 0.03, steps: ['$z = (1870 - 1755 - 70)/70 = 0.64$.', '$1 - \\Phi(0.64) = 0.26$.'] }
  ],
  ranges: [
    { dim: 'Stature range for a product sold worldwide', range: [1385, 1940], unit: 'mm', who: '5th-percentile woman of the shortest national populations (mean about 1490 mm) to the 95th-percentile man of the tallest (about 1825 mm), assuming spreads like this app\'s data', why: 'One design, or one adjustment range, serves every market.', limits: 'Adjustment that wide is costly; regional variants may be better. Proportions differ between the markets too.', setting: ['vehicle', 'workshop', 'civil'], src: 'NCD Risk Factor Collaboration, 2016; derived' },
    { dim: 'Seat height adjustment for a worldwide market', range: [370, 520], unit: 'mm', who: 'popliteal heights scaled from the statures above, plus 25 mm of shoe', why: 'Feet reach the floor and thighs are supported in every market.', limits: 'An estimate by stature scaling: check with each market\'s own data.', setting: ['office', 'vehicle'], src: 'Derived from representative data' },
    { dim: 'Allowance for the secular trend in stature', range: [0, 10], unit: 'mm per decade', who: 'populations where heights still rise (about 10 mm per decade in twentieth-century Europe); zero where growth has stopped', why: 'Long-lived designs still fit the users of the coming decades.', limits: 'Trends slow and stop; body mass and breadths may need a larger allowance than stature.', setting: 'all', src: 'Hatton (2014); NCD Risk Factor Collaboration (2016)' }
  ],
  applications: [
    'Choosing and checking anthropometric data for export markets and multinational workforces.',
    'Global vehicle and aircraft platforms with adjustment ranges for every market.',
    'Re-checking old designs and standards against today\'s larger and heavier users.',
    'Seeing how many people a range fits in another population: see [the body-size explorer](#/tools/bodysize/explorer).'
  ],
  history: 'Economic historians have used the recorded heights of soldiers and conscripts as a measure of living standards since the 1970s, tracing how nutrition and health raised stature across generations. In 2016 the NCD Risk Factor Collaboration pooled population studies from 200 countries to chart a century of change in adult height.',
  sources: [
    'NCD Risk Factor Collaboration (NCD-RisC), "A century of trends in adult human height", *eLife*, 2016.',
    'T. J. Hatton, "How have Europeans grown so tall?", *Oxford Economic Papers*, 2014.',
    'ISO/TR 7250-2, *Statistical summaries of body measurements from national populations*.',
    'ISO 15535, *General requirements for establishing anthropometric databases*.',
    'EN 614-1, *Safety of machinery — Ergonomic design principles — Part 1: Terminology and general principles*.',
    'World Health Organization, *Obesity and overweight* (fact sheet).'
  ],
  sim: 'an-population'
},

{
  id: 'age-children-elderly', parent: 'human-variation', title: 'Children and older people', level: 2,
  short: 'Buildings and products serve everyone from toddlers to the very old. Children are small and differently proportioned, growing by 5–6 cm a year, and need protection from gaps and heights; older people lose stature, strength, mobility, balance and sharp senses. Designs that suit both ends — reachable switches, graspable rails, firm seats — suit everyone.',
  keywords: ['children', 'child anthropometry', 'growth', 'WHO growth reference', 'older people', 'elderly', 'ageing', 'stature loss', 'grip strength decline', 'falls', 'school furniture', 'cot bars', 'guard openings', 'light switch height', 'seat height for older people', 'universal design', 'life course'],
  prereq: ['percentiles', 'standing-dimensions', 'mass-strength-data'],
  related: ['school-furniture', 'children-furniture', 'ageing-workforce', 'accessible-design', 'disability-inclusive', 'stairs-ergonomics', 'lighting-levels', 'population-differences', 'medicine:child-growth', 'medicine:ageing', 'medicine:bone-calcium'],
  body: `
Most adult body-size tables stop at working age. Homes, schools, shops, stations and hospitals serve everyone, from children who can barely reach a door handle to people in their nineties who can no longer lift their arms above the shoulder.

### Children: small, growing, differently shaped
Children grow fast — about 5–6 cm a year through primary school and faster in the pubertal spurt — and their shape changes as they grow: the head is a large share of a young child's height, and the legs grow fastest before puberty.

| Age (years) | 5 | 8 | 11 | 14 | 17 |
|---|---|---|---|---|---|
| Boys, median stature (mm) | 1100 | 1275 | 1430 | 1630 | 1750 |
| Girls, median stature (mm) | 1095 | 1265 | 1450 | 1600 | 1630 |

(Approximate medians of the WHO 2007 growth reference; within one age the spread is several centimetres either side.) Children of the same age differ as much as a whole school year of growth, and a class spans one to two sizes of furniture. That is why school furniture comes in size marks chosen by stature, not by age (EN 1729-1, [[school-furniture]]), and why children's furniture is not scaled-down adult furniture ([[children-furniture]]).

**Protecting children** is its own set of dimensions: openings in guards and balustrades small enough that a child cannot fall or slip through (building codes use a 100 mm sphere), cot bars spaced so a baby's head cannot pass (EN 716 sets 45–65 mm), no parts small enough to swallow on toys for the under-threes (EN 71-1), and guarding at heights that children can climb.

### Older people: shorter, weaker, stiffer — and very varied
- **Stature** falls as the spinal discs thin and posture stoops: in a long-running American study, men lost about 3 cm between the ages of 30 and 70 and women about 5 cm; by 80 the losses were about 5 and 8 cm (Sorkin and colleagues, 1999). Reach heights fall by the same amounts. Today's older people are also shorter because they were born into shorter generations ([[population-differences]]).
- **Strength** peaks in the thirties and falls by roughly a third by the age of 80 (grip strength, Dodds and colleagues, 2014), and the ability to exert force quickly falls faster.
- **Mobility**: raising the arms overhead, turning the neck, bending to the floor and rising from low seats all get harder.
- **Balance**: about one in three people over 65 falls each year; steps, slippery floors, poor lighting and low furniture add to the risk.
- **Senses and thinking**: close focus fades from the mid-forties, and older eyes need more light and suffer more from glare ([[lighting-levels]]); high-frequency hearing declines; reactions and decisions take longer.

The spread among older people is wider than among young adults: some run marathons at 75, others need help to stand. Design for the frailer end without patronising the fitter.

The simulation grows a person from 3 to 85 beside a kitchen worktop, a chair, a door handle, a light switch and a wall shelf: watch what a child cannot reach, what fits a young adult, and what an 80-year-old loses.

### What helps both ends
| Design feature | Helps children | Helps older people |
|---|---|---|
| Switches and sockets 450–1200 mm above the floor | reachable | no bending low or reaching high |
| Lever door handles, large rocker switches | small, weak hands | weak or painful hands |
| Handrails on both sides of stairs, a lower second rail | small hands and short arms | balance, pulling up |
| Firm seats about 430–480 mm high with armrests | — | rising and sitting down |
| Step-free entrances, level thresholds | buggies and small legs | walking aids, fewer trips |
| Good, even light and strong contrast | — | ageing eyes and falls |

### Settings
- **Homes and public buildings**: every age at once — national accessibility codes (see [[accessible-design]]).
- **Schools**: growing children in size-graded furniture.
- **Health and care homes**: older, often frail users and the staff who help them.
- **Workplaces**: an older workforce with more experience and less strength and mobility ([[ageing-workforce]]).

> [!warn] Falls, pain and loss of strength in older people can have medical causes. This page explains design; changes in health belong with a doctor or physiotherapist.

> [!key] Extend the design range at both ends of life: smaller, weaker and lower for children, lower reaches, less force, firmer seats, better light and support for older people — and protect children from gaps and heights.
`,
  ideas: [
    'Children grow about 5–6 cm a year and change shape; furniture is sized by stature, not age.',
    'Child-safety dimensions — guard openings, cot bars, small parts — protect the youngest users.',
    'Older people lose about 5–8 cm of stature by 80 and roughly a third of their grip strength.',
    'About one in three people over 65 falls each year: steps, floors, light and support matter.',
    'Features that help both ends — reachable switches, lever handles, handrails, firm seats — help everyone.'
  ],
  pitfalls: [
    'Children\'s furniture is adult furniture scaled down — Children\'s proportions differ (large heads, short legs) and change with growth; size marks follow stature.',
    'Adult data cover older adults — Older people are shorter, weaker and stiffer, and differ more among themselves than young adults do.',
    'Older people are shorter only because they shrink — They also belong to generations that were shorter to begin with.'
  ],
  formulas: [
    {
      name: 'A child\'s seat height from stature (an estimate)',
      expr: 'H = k*S + a', tex: 'H_s = k\\,S + a_s',
      vars: {
        H: { name: 'seat height', q: 'length', unit: 'mm', tex: 'H_s' },
        k: { name: 'popliteal height as a share of stature (about 0.24–0.25)', q: 'none', value: 0.25 },
        S: { name: 'stature', q: 'length', unit: 'mm', value: 1325 },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 20, tex: 'a_s' }
      },
      note: 'A rough proportion; young children\'s legs are relatively shorter. School furniture uses measured size marks (EN 1729-1).',
      stories: { H: 'A child is {S} tall. Estimate a suitable seat height, taking popliteal height as {k} of stature and {a} of shoe.', S: 'A chair seat is {H} high. For what stature does it suit ({k} of stature plus {a})?' }
    },
    {
      name: 'Share of a group that reaches a height',
      expr: 'F = ncdf((R - y)/s)', tex: 'F = \\Phi\\!\\left(\\dfrac{R - y}{\\sigma}\\right)',
      vars: {
        F: { name: 'share who can reach', q: 'ratio', unit: '%' },
        R: { name: 'mean vertical grip reach of the group', q: 'length', unit: 'mm', value: 1830 },
        y: { name: 'height to reach', q: 'length', unit: 'mm', value: 1770 },
        s: { name: 'standard deviation of the reach', q: 'length', unit: 'mm', value: 85, tex: '\\sigma' }
      },
      note: 'Default: women around 80, whose mean reach is about 80 mm below young women\'s 1910 mm.',
      stories: { F: 'A group\'s mean grip reach is {R} with a standard deviation of {s}. What share can reach {y}?', y: 'A group\'s mean grip reach is {R} ± {s}. How high may a shelf be for {F} of them to reach it?' }
    }
  ],
  examples: [
    {
      title: 'A child at the family table',
      q: 'A 9-year-old is about 1325 mm tall. Estimate the seat height that suits her, and compare it with a 450 mm dining chair.',
      steps: [
        '$H_s = 0.25 \\times 1325 + 20 = 351$ mm.',
        'The dining chair is about 100 mm too high: her feet hang and the seat front presses under her thighs.',
        'A footrest (or a chair with a foot bar) fixes the legs; a cushion only raises her further from the floor.'
      ],
      a: 'About 350 mm — a 450 mm chair needs a footrest.'
    },
    {
      title: 'A shelf for older women',
      q: 'Young women\'s vertical grip reach is 1910 ± 85 mm. At 80 about 80 mm of stature has been lost. What share of young and of older women reach a shelf at 1770 mm?',
      steps: [
        'Young women: $\\Phi\\big((1910 - 1770)/85\\big) = \\Phi(1.65) = 95$ %.',
        'Older women (mean 1830 mm): $\\Phi\\big((1830 - 1770)/85\\big) = \\Phi(0.71) = 76$ %.',
        'Stiffer shoulders reduce overhead reach further, so keep things older people use below about 1600 mm.'
      ],
      a: 'About 95 % of young women but only about three-quarters of women around 80.'
    }
  ],
  quiz: [
    { q: 'About how much stature had women lost between 30 and 80 in the Baltimore longitudinal study?', choices: ['About 8 cm', 'About 1 cm', 'About 20 cm', 'None'], a: 0, why: 'About 5 cm by 70 and 8 cm by 80 for women; about 3 and 5 cm for men.' },
    { q: 'Why is children\'s furniture not simply adult furniture scaled down?', choices: ['Children\'s proportions differ and change as they grow', 'Children prefer bright colours', 'Scaling is too expensive', 'Children never sit still'], a: 0, why: 'Young children have large heads and short legs; seat height and depth must follow their own dimensions.' },
    { q: 'Older people are shorter partly because they were born into generations that were shorter to begin with.', a: true, why: 'Cross-sectional tables mix the secular trend with shrinkage in old age.' },
    { q: 'By the age of 80, grip strength is typically about…', choices: ['two-thirds of its peak', 'the same as at 30', 'a tenth of its peak', 'higher than at 30'], a: 0, why: 'Normative data show a fall of roughly a third from the peak in the thirties.' },
    { q: 'Why do firm seats of about 430–480 mm with armrests suit older people?', choices: ['Rising is easier from a higher, firm seat with something to push on', 'They are cheaper', 'They are softer', 'They make people sit up straight'], a: 0, why: 'Standing up from low, soft seats needs strength and balance many older people lack.' }
  ],
  problems: [
    { q: 'Estimate the seat height for a child 1200 mm tall (popliteal height 0.25 of stature, 20 mm of shoe).', answer: 320, unit: 'mm', tol: 0.01, steps: ['$H_s = 0.25 \\times 1200 + 20 = 320$ mm.'] },
    { q: 'Older women\'s mean grip reach is 1830 ± 85 mm. What share can reach 1770 mm?', answer: 76, unit: '%', tol: 0.02, steps: ['$\\Phi((1830 - 1770)/85) = \\Phi(0.71) = 0.76$.'] }
  ],
  ranges: [
    { dim: 'Openings in guards and balustrades where young children may be', range: [null, 100], unit: 'mm', who: 'young children, whose heads and bodies must not pass', why: 'No child falls or slips through, or is trapped by the head.', limits: 'Codes differ (US codes use a 4 in sphere); horizontal rails that children can climb are a separate hazard.', setting: ['civil', 'school'], src: 'Building codes, e.g. UK Approved Document K' },
    { dim: 'Spacing of cot (crib) bars', range: [45, 65], unit: 'mm', who: 'babies: their heads must not pass, and limbs must not jam', why: 'Prevents entrapment and strangulation.', limits: 'Other cot dimensions (depth, mattress gaps) matter too; follow the product standard.', setting: ['civil', 'health'], src: 'EN 716-1' },
    { dim: 'Height of switches and socket outlets', range: [450, 1200], unit: 'mm', who: 'children, wheelchair users, and older people who cannot bend low or reach high', why: 'Almost everyone reaches them without bending or stretching.', limits: 'National codes differ a little; check the local rule.', setting: 'civil', src: 'UK Approved Document M' },
    { dim: 'Seat height for older people (firm seat with armrests)', range: [430, 480], unit: 'mm', who: 'popliteal height plus shoes of most older adults, up to about 50 mm higher to ease rising', why: 'Standing up and sitting down need less strength and balance.', limits: 'Small older women\'s feet may not reach the floor at the top of the range; armrests should reach the seat front.', setting: ['civil', 'health'], src: 'Derived from representative data' },
    { dim: 'Highest shelf for occasional use by older women', range: [null, 1690], unit: 'mm', who: '5th-percentile woman\'s grip reach (1770 mm) less about 80 mm of age-related stature loss', why: 'Most older women reach it without a step.', limits: 'Stiff shoulders reduce overhead reach further: keep daily items below about 1600 mm.', setting: ['civil', 'health'], src: 'Derived from representative data and Sorkin et al. (1999)' }
  ],
  applications: [
    'School and nursery furniture in size marks by stature.',
    'Homes for life: switches, handles, rails and seats that suit children and older people.',
    'Care homes and hospitals designed for frail, older users.',
    'Workplaces adapted to an ageing workforce.'
  ],
  history: 'Growth charts go back to the nineteenth century. The WHO published growth standards for children under five in 2006 and a growth reference for ages 5 to 19 in 2007. Long-running studies such as the Baltimore Longitudinal Study of Aging measured the same people for decades and separated shrinkage with age from the difference between generations.',
  sources: [
    'M. de Onis et al., "Development of a WHO growth reference for school-aged children and adolescents", *Bulletin of the World Health Organization*, 2007.',
    'J. D. Sorkin, D. C. Muller and R. Andres, "Longitudinal change in height of men and women: implications for interpretation of the body mass index", *American Journal of Epidemiology*, 1999.',
    'R. M. Dodds et al., "Grip strength across the life course: normative data from twelve British studies", *PLoS ONE*, 2014.',
    'EN 1729-1, *Furniture — Chairs and tables for educational institutions — Part 1: Functional dimensions*.',
    'EN 716-1, *Furniture — Children\'s cots and folding cots for domestic use — Part 1: Safety requirements*.',
    'HM Government, *The Building Regulations 2010 — Approved Document M: Access to and use of buildings*.'
  ],
  sim: 'an-lifespan'
},

{
  id: 'disability-inclusive', parent: 'human-variation', title: 'Disability and inclusive design', level: 2,
  short: 'About one person in six lives with a significant disability, and many more are temporarily or situationally limited. Disability arises where an impairment meets a design that excludes; inclusive design widens the range — wheelchair space and reach, low forces, contrast, clear information — and usually makes things better for everyone.',
  keywords: ['disability', 'inclusive design', 'universal design', 'accessibility', 'wheelchair', 'wheelchair reach', 'clear floor space', 'turning circle', 'door clear width', 'knee clearance', 'ADA', 'ISO 21542', 'reasonable adjustment', 'social model', 'low vision', 'hearing loss', 'dexterity', 'restricted growth', 'seven principles'],
  prereq: ['functional-reach', 'sitting-dimensions', 'design-for-range'],
  related: ['accessible-design', 'ramps-accessibility', 'doors-corridors', 'counters-reception', 'bathroom-ergonomics', 'age-children-elderly', 'human-centred-design', 'usability', 'medicine:vision', 'medicine:hearing-balance', 'medicine:stroke'],
  body: `
The WHO estimates that about 1.3 billion people — some 16 % of the world's population, one in six — live with a significant disability (2022). Many more are limited for a while or in a situation: a broken wrist, a pushchair, heavy luggage, a noisy platform, a language they cannot read. Designing for them is not a special case of design; it is designing for the real range of people.

### Where disability arises
The WHO's classification of functioning and disability (ICF, 2001) treats disability as the result of a health condition *interacting* with the environment. A wheelchair user is disabled by a step, not by the wheelchair; a person with low vision by grey text on a grey sign. This is why ergonomics can remove so much disability: change the step, the sign, the handle.

**The seven principles of universal design** (the Center for Universal Design at North Carolina State University, 1997): equitable use; flexibility in use; simple and intuitive use; perceptible information; tolerance for error; low physical effort; size and space for approach and use.

### Wheelchair users: space and reach
A person in a wheelchair sits with the seat about 450–500 mm above the floor, the eyes some 1150–1350 mm up, and the footplates keeping the chest roughly half a metre back from a wall in front. Reach is poor straight ahead, much better to the side, and much reduced over an obstruction; many users extend it by leaning, but not all can. The US 2010 ADA Standards put numbers on this (ISO 21542 and national codes give similar ones):

| Need | US 2010 ADA Standards |
|---|---|
| Clear floor space for one wheelchair | 760 × 1220 mm (30 × 48 in) |
| Space to turn | a 1525 mm (60 in) circle or a T-shaped space (ISO 21542: 1500 mm) |
| Door clear width | at least 815 mm (32 in) |
| Unobstructed reach, forward or to the side | 380–1220 mm above the floor (15–48 in) |
| Forward reach over an obstruction 510–635 mm deep | at most 1120 mm (44 in) |
| Side reach over an obstruction 255–610 mm deep | at most 1170 mm (46 in) |
| Knee clearance under tables and counters | at least 685 mm high (27 in) |
| Work surfaces | 710–865 mm high (28–34 in) |
| Operable parts | at most 22.2 N (5 lbf), one hand, no tight grasping, pinching or twisting of the wrist |

The simulation puts a wheelchair user of any size beside a standing person at a counter, a shelf or a wall of switches: change the height and the depth of the obstruction, approach from the front or the side, and compare the reach with the ADA limits.

### Beyond wheelchairs
| Limitation | Design that includes |
|---|---|
| Walking with aids, low stamina | level routes, handrails on both sides, rest seats, short distances |
| Reach, grip and dexterity (arthritis, stroke, tremor) | lever handles, large buttons, low forces, no twisting |
| Low vision and blindness | strong contrast, large type, tactile and audible information, even light |
| Hearing loss | visual alarms, hearing loops, captions, quiet rooms |
| Cognitive and learning disabilities, dementia | simple consistent layouts, clear signs, forgiving controls |
| Restricted growth | reach and seat heights well below the 1st percentile of adults |
| Large bodies | wider seats, stronger furniture, space to turn |

Health conditions behind these — [[medicine:vision|vision loss]], [[medicine:hearing-balance|hearing loss]], [[medicine:stroke|stroke]] — are explained in Hyper Medicine.

### At work
Employment law in many countries requires employers to make **reasonable adjustments** (UK Equality Act 2010) or **reasonable accommodation** (US Americans with Disabilities Act): an adjustable desk, a different input device, a lower control, a quieter room, changed hours. Machines and workplaces designed with wide ranges and adjustability need fewer adjustments later. People with disabilities belong in user trials, not only in the specification.

### The virtue of designing for the edges
Features first made for disabled people — kerb cuts, lever handles, step-free entrances, captions, automatic doors — turned out to help parents with pushchairs, travellers with luggage, delivery workers, older people and anyone with full hands. Inclusive design rarely costs much when planned from the start, and costs a great deal when added later.

> [!warn] The dimensions in the table are US rules; other countries set their own, and codes are minimums. Check the local building code and ISO 21542 — and test with the people who will use the building or product.

> [!key] Disability happens where a design meets an impairment. Design for the widest range — space, reach, force, perception and understanding — and provide a second way where one design cannot serve everyone.
`,
  ideas: [
    'About one person in six lives with a significant disability; many more are limited temporarily or by circumstance.',
    'Disability arises from the interaction of an impairment with the environment — so design can remove it.',
    'Wheelchair users need space to turn, doors at least 815 mm clear, controls 380–1220 mm high and knee room under surfaces.',
    'Low forces, lever handles, contrast and clear information include people with limited dexterity, sight, hearing or understanding.',
    'Features designed for disabled people usually help everyone.'
  ],
  pitfalls: [
    'Accessibility means a ramp and a wide toilet — It covers reach, force, vision, hearing, cognition and body size as well as mobility.',
    'Inclusive features benefit only a few people — Kerb cuts, lever handles and step-free entrances help parents, older people, travellers and workers every day.',
    'Meeting the code guarantees access — Codes are minimums from one country; users with other needs, and the details of use, need testing.'
  ],
  formulas: [
    {
      name: 'Highest point reached at a horizontal distance',
      expr: 'y = ys + sqrt(a^2 - x^2)', tex: 'y = y_s + \\sqrt{a^2 - x^2}',
      vars: {
        y: { name: 'highest point the hand can grip', q: 'length', unit: 'mm' },
        ys: { name: 'height of the shoulder joint (in the wheelchair)', q: 'length', unit: 'mm', value: 950, tex: 'y_s' },
        a: { name: 'arm reach from the shoulder joint to the grip', q: 'length', unit: 'mm', value: 572 },
        x: { name: 'horizontal distance from the shoulder to the target', q: 'length', unit: 'mm', value: 450 }
      },
      note: 'Without leaning; default: a small woman in a wheelchair with the seat at 480 mm. The footplates set how close the shoulder can get.',
      stories: { y: 'A wheelchair user\'s shoulder joint is at {ys} and the arm reaches {a}. How high can they grip {x} in front of the shoulder?', x: 'A wheelchair user\'s shoulder joint is at {ys} and the arm reaches {a}. How far forward can they grip at {y}?' }
    },
    {
      name: 'Eye height of a seated wheelchair user',
      expr: 'ye = hs + es', tex: 'y_e = h_s + e_s',
      vars: {
        ye: { name: 'eye height above the floor', q: 'length', unit: 'mm', tex: 'y_e' },
        hs: { name: 'wheelchair seat height (with cushion)', q: 'length', unit: 'mm', value: 480, tex: 'h_s' },
        es: { name: 'seated eye height', q: 'length', unit: 'mm', value: 740, tex: 'e_s' }
      },
      note: 'Sets the heights of windows, mirrors, signs, peepholes and screens seen from a wheelchair.',
      stories: { ye: 'A wheelchair seat is {hs} high and the user\'s seated eye height is {es}. How high are the eyes?' }
    }
  ],
  examples: [
    {
      title: 'A reception counter for everyone',
      q: 'A counter is 1050 mm high and 600 mm deep. A wheelchair user sits at 480 mm, with seated eye heights of 686–853 mm and seated shoulder heights of 509–653 mm (5th-percentile woman to 95th-percentile man). What must change?',
      steps: [
        'Eyes: $480 + 686 = 1166$ to $480 + 853 = 1333$ mm — everyone can see over 1050 mm.',
        'Shoulders: $480 + 509 = 989$ to $480 + 653 = 1133$ mm — the counter top is at or above shoulder height: writing and handing over papers is hard.',
        'Reach: over a 600 mm deep obstruction the ADA allows at most 1120 mm, and the top is only reachable with knee space below.',
        'Add a lowered section 710–865 mm high with at least 685 mm of knee clearance beneath it.'
      ],
      a: 'Provide a lowered, open-knee section of the counter (710–865 mm high, 685 mm knee clearance).'
    },
    {
      title: 'How high can she reach over a counter?',
      q: 'A small woman in a wheelchair has her shoulder joint at 950 mm and reaches 572 mm from it. Pulled up to a table with knee space, the target is 450 mm in front of her shoulder. How high can she grip, without leaning?',
      steps: [
        '$y = 950 + \\sqrt{572^2 - 450^2} = 950 + \\sqrt{124\\,684} = 950 + 353 = 1303$ mm.',
        'Without knee space the footplates keep her about 500 mm further back — the target moves out of reach altogether.',
        'Further back on a deep counter she must lean to reach anything; keep items that must be reached near the front edge, or offer a side approach.'
      ],
      a: 'About 1300 mm with knee space; nothing at that depth without it.'
    }
  ],
  quiz: [
    { q: 'About what share of the world\'s population lives with a significant disability (WHO, 2022)?', choices: ['About one in six (16 %)', 'About one in a hundred', 'About half', 'About one in a thousand'], a: 0, why: 'The WHO estimates about 1.3 billion people, some 16 %.' },
    { q: 'Within what height range does the 2010 ADA Standards place unobstructed reach?', choices: ['380–1220 mm (15–48 in)', '0–2000 mm', '900–1500 mm', '600–900 mm'], a: 0, why: 'Operable parts reached without an obstruction must lie between 15 and 48 in above the floor.' },
    { q: 'Inclusive design features benefit only disabled people.', a: false, why: 'Kerb cuts, lever handles, step-free entrances and captions help parents, older people, travellers and workers too.' },
    { q: 'In the WHO\'s view, disability arises from…', choices: ['the interaction between a health condition and the environment', 'the health condition alone', 'the person\'s attitude', 'old age'], a: 0, why: 'The ICF treats disability as the outcome of that interaction — which design can change.' },
    { q: 'Which door hardware suits people with weak or painful hands?', choices: ['A lever handle operable with a closed fist', 'A small round knob', 'A thumb latch needing 40 N', 'A key that must be twisted hard'], a: 0, why: 'Operable parts should work with one hand, without tight grasping, pinching or twisting of the wrist, and with at most 22.2 N.' }
  ],
  problems: [
    { q: 'A wheelchair seat is 480 mm high and the user\'s seated eye height is 740 mm. How high are the eyes above the floor?', answer: 1220, unit: 'mm', tol: 0.01, steps: ['$y_e = 480 + 740 = 1220$ mm.'] },
    { q: 'A wheelchair user\'s shoulder joint is at 950 mm and the arm reaches 572 mm. How high can the hand grip 450 mm in front of the shoulder?', answer: 1303, unit: 'mm', tol: 0.01, steps: ['$y = 950 + \\sqrt{572^2 - 450^2} = 950 + 353 = 1303$ mm.'] }
  ],
  ranges: [
    { dim: 'Height of controls, switches and handles everyone must use (unobstructed reach)', range: [380, 1220], unit: 'mm', who: 'wheelchair users reaching forward or to the side; also children and people who cannot bend or stretch', why: 'Almost everyone can reach them from a seat or standing.', limits: 'Over an obstruction the upper limit falls; national codes differ.', setting: ['civil', 'office', 'health'], src: '2010 ADA Standards, 308' },
    { dim: 'Highest forward reach over an obstruction 510–635 mm deep', range: [null, 1120], unit: 'mm', who: 'wheelchair users, with knee space under the obstruction', why: 'Items on the far side of a counter or worktop stay reachable.', limits: 'Without knee space the footplates keep the user further back.', setting: ['civil', 'office'], src: '2010 ADA Standards, 308.2.2' },
    { dim: 'Clear width of a doorway', range: [815, null], unit: 'mm', who: 'wheelchair users (a manual wheelchair plus hand room)', why: 'A wheelchair passes without scraping hands or frames.', limits: 'Wider for powered chairs, turns in corridors and heavy traffic; codes differ between countries.', setting: ['civil', 'office', 'health'], src: '2010 ADA Standards, 404.2.3' },
    { dim: 'Knee clearance under accessible tables, desks and counters', range: [685, null], unit: 'mm', who: 'wheelchair users\' knees and armrests', why: 'The user can pull in close to work, write or eat.', limits: 'Needs depth as well as height, and no aprons or drawers in the way.', setting: ['civil', 'office', 'school'], src: '2010 ADA Standards, 306' },
    { dim: 'Height of accessible work surfaces', range: [710, 865], unit: 'mm', who: 'wheelchair users working at a table or counter', why: 'The surface is below the shoulders with knee room beneath.', limits: 'An adjustable surface fits more users, seated and standing.', setting: ['civil', 'office', 'school'], src: '2010 ADA Standards, 902.3' },
    { dim: 'Force to operate controls everyone must use', range: [null, 22.2], unit: 'N', who: 'people with weak, painful or unsteady hands', why: 'Operable with one hand, without tight grasping, pinching or twisting.', limits: 'Doors have their own force limits; many older and disabled users need less still.', setting: ['civil', 'health', 'office'], src: '2010 ADA Standards, 309.4' },
    { dim: 'Turning space for a wheelchair', range: [1500, 1525], unit: 'mm', who: 'manual wheelchair users turning through 180°', why: 'Users can turn round in toilets, lifts, corridors and at dead ends.', limits: 'Powered chairs and scooters need more; ISO 21542 uses 1500 mm, the ADA 1525 mm or a T-shaped space.', setting: ['civil', 'health'], src: 'ISO 21542; 2010 ADA Standards, 304' }
  ],
  applications: [
    'Accessible buildings, counters, toilets and transport ([[accessible-design]], [[ramps-accessibility]]).',
    'Reasonable adjustments at work: adjustable desks, alternative controls, accessible machines.',
    'Products with low operating forces, clear feedback and large, high-contrast controls.',
    'Including disabled people in user trials and design reviews.'
  ],
  history: 'The US architect Ronald Mace, himself a wheelchair user, coined the term universal design in the 1980s; his centre at North Carolina State University published its seven principles in 1997. The Americans with Disabilities Act (1990), the UK Disability Discrimination Act (1995, later the Equality Act 2010) and the UN Convention on the Rights of Persons with Disabilities (2006) made access a right; the 2010 ADA Standards and ISO 21542 turned it into dimensions.',
  sources: [
    'US Department of Justice, *2010 ADA Standards for Accessible Design*.',
    'ISO 21542, *Building construction — Accessibility and usability of the built environment*.',
    'World Health Organization, *Global report on health equity for persons with disabilities*, 2022.',
    'World Health Organization, *International Classification of Functioning, Disability and Health* (ICF), 2001.',
    'Center for Universal Design, North Carolina State University, *The Principles of Universal Design*, 1997.',
    'S. Goldsmith, *Designing for the Disabled* — the classic architectural reference.'
  ],
  sim: 'an-wheelchair'
},

{
  id: 'clothing-ppe-allowances', parent: 'human-variation', title: 'Clothing, shoes and PPE allowances', level: 2,
  short: 'Body-size tables are nude and barefoot; real users wear shoes, clothes, helmets, gloves, armour and packs. Add allowances — shoes 25–45 mm to heights, a helmet 30–50 mm, cold-weather clothing some 40–100 mm to breadths — and remember what equipment takes away: reach, movement, dexterity, strength, sight and the ability to lose heat.',
  keywords: ['clothing allowance', 'shoe allowance', 'footwear', 'PPE', 'personal protective equipment', 'helmet allowance', 'cold-weather clothing', 'winter clothing', 'body armour', 'load carriage', 'gloves', 'dexterity', 'grip strength with gloves', 'encumbered anthropometry', 'equipped soldier', 'access openings', 'breathing apparatus'],
  prereq: ['anthropometry-basics', 'standing-dimensions', 'hand-foot-head'],
  related: ['ppe-ergonomics', 'personal-equipment-fit', 'cold-stress', 'heat-stress', 'access-openings', 'hearing-protection', 'load-carriage', 'crew-stations', 'confined-spaces', 'combining-percentiles', 'design-for-range'],
  body: `
Anthropometric tables describe people in minimal clothing and bare feet, standing and sitting erect. Nobody uses a machine, a hatch or a crew station like that. The designer adds **allowances** for what people wear and carry — and subtracts what that equipment takes away from their movement and strength.

### Allowances on size
| Item | Adds about | To | Notes |
|---|---|---|---|
| Everyday shoes | 25 mm (men), 45 mm (women's shoes with a heel) | every standing height | Pheasant's usual allowances; high heels add more |
| Work and safety boots | a few centimetres (measure them) | standing heights, foot length and breadth | toe caps lengthen the foot; thick winter soles more |
| Light indoor clothing | a few millimetres per side | breadths, depths, seat widths | usually small |
| Cold-weather clothing | 20–50 mm per side: 40–100 mm | shoulder, chest and hip breadths, body depths, thigh thickness | also shortens reach and stiffens joints |
| Helmet | 30–50 mm | stature, sitting height, head breadth and length | measure the actual helmet; visors and lamps add more |
| Body armour | 50–100 mm | chest depth (front and back plates with carrier) | restricts bending and shoulder movement |
| Pack or breathing apparatus | its own depth, often 150 mm or more | body depth behind the back | changes posture and balance |
| Gloves | twice the glove thickness: 5–25 mm | hand breadth and thickness, finger openings | cuts dexterity and grip strength |
| Hearing protectors (earmuffs) | several centimetres each side | head breadth | clash with helmets and eyewear if not designed together |

The breadth rule is simple geometry: every layer adds its thickness on **both** sides,

$$B_c = B + 2t$$

so a 40 mm-thick parka turns the 95th-percentile man's 526 mm shoulders into 606 mm. In the simulation, dress a person layer by layer — boots, cold-weather clothing, armour, helmet, gloves — and walk them through a door or hatch: watch the width, height and share of people who still fit.

### Allowances on function
Equipment also takes things away:
- **Reach and movement.** Bulky clothing and armour shorten reach, limit shoulder and trunk movement, and make kneeling, crawling and climbing harder; a seated person in armour needs more room between seat and controls ([[functional-reach]]).
- **Dexterity and strength.** Gloves reduce fine finger control and grip strength — studies report reductions from under 10 % for thin gloves to 30 % or more for thick or stiff ones — so controls, fasteners and triggers must be usable in the gloves actually worn ([[hand-foot-head]]).
- **Senses.** Helmets, visors, goggles and respirators narrow the field of view; hoods and hearing protectors change what people hear ([[hearing-protection]]).
- **Heat.** Protective clothing traps heat and sweat, lowering the work a person can sustain in warm conditions ([[heat-stress]]).
- **Openings and escape.** Hatches, manholes and escape routes must pass the equipped person — standards for access openings (ISO 15534) build clothing and equipment into their dimensions ([[access-openings]], [[confined-spaces]]).

### Clearances with equipment
Headroom for a soldier or a firefighter is not stature: the 99th-percentile man (1918 mm) in 40 mm boots and a 40 mm helmet stands 1998 mm, and with a 75 mm margin for walking needs about 2075 mm — more than a 2000 mm door. The 95th-percentile man's hips sitting (414 mm) grow to about 490 mm in cold-weather clothing; a seat that was comfortable in summer pinches in winter.

### Settings
| Setting | Typical equipment | Allowances that dominate |
|---|---|---|
| Office and home | shoes, ordinary clothing | shoes on heights; coats on seat widths in public seating |
| Workshop and industry | safety boots, helmets, gloves, hearing protection, high-visibility clothing | boots and helmets on heights; gloves on handles and openings |
| Cold stores and outdoor winter work | insulated suits, boots, gloves, hoods | breadths, depths, reach, dexterity |
| Health care | gowns, gloves, respirators, visors | dexterity, fit of respirators, heat |
| Military | helmet, armour, load-bearing equipment, packs, cold-weather and protective suits | every dimension at once ([[personal-equipment-fit]], [[crew-stations]]) |
| Field work | boots, harnesses, winter clothing, tool belts | clearances, reach and climbing |

Military human-engineering standards such as MIL-STD-1472 and DEF STAN 00-250 require crew stations, hatches and equipment to be designed around the person **as equipped**, not as measured in a survey.

> [!warn] Allowances here are typical estimates. Measure the actual footwear, clothing and equipment your users wear — and try the design with people fully dressed for the job, in the worst season.

> [!key] Dress the manikin before you design: add shoes, clothing and equipment to the body, and take off what they cost in reach, dexterity and movement.
`,
  ideas: [
    'Tables are nude and barefoot: shoes add 25–45 mm to heights, a helmet 30–50 mm to stature.',
    'Every clothing layer adds its thickness on both sides: B + 2t.',
    'Cold-weather clothing, armour and packs add centimetres to breadths and depths and shorten reach.',
    'Gloves reduce dexterity and grip strength; controls must work in the gloves actually worn.',
    'Military standards require design around the person as equipped.'
  ],
  pitfalls: [
    'Clearances from body-size tables are enough — The users wear shoes, clothes and equipment: add allowances before comparing.',
    'Gloves only make the hand a little bigger — They also cut dexterity and grip strength, and change handle sizes and triggers.',
    'Summer trials prove the design — Winter clothing, PPE and packs change breadths, reach and movement: trial in the worst case.'
  ],
  formulas: [
    {
      name: 'A breadth with clothing',
      expr: 'Bc = B + 2*t', tex: 'B_c = B + 2t',
      vars: {
        Bc: { name: 'clothed breadth', q: 'length', unit: 'mm', tex: 'B_c' },
        B: { name: 'nude breadth (e.g. 95th-percentile man\'s shoulder breadth)', q: 'length', unit: 'mm', value: 526 },
        t: { name: 'total thickness of the clothing on one side', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'Clothing compresses where it is squeezed; use the uncompressed thickness for clearances.',
      stories: { Bc: 'Shoulders {B} wide are covered by {t} of clothing on each side. How wide are they clothed?', t: 'A hatch lets through a clothed breadth of {Bc}; the nude breadth is {B}. How thick may the clothing be on each side?' }
    },
    {
      name: 'Equipped stature',
      expr: 'H = S + as + ah', tex: 'H = S + a_s + a_h',
      vars: {
        H: { name: 'equipped stature', q: 'length', unit: 'mm' },
        S: { name: 'stature (e.g. 99th-percentile man)', q: 'length', unit: 'mm', value: 1918 },
        as: { name: 'footwear allowance', q: 'length', unit: 'mm', value: 40, tex: 'a_s' },
        ah: { name: 'helmet allowance', q: 'length', unit: 'mm', value: 40, tex: 'a_h' }
      },
      note: 'Add a margin for walking (about 75 mm) to get a headroom.',
      stories: { H: 'A person {S} tall wears boots adding {as} and a helmet adding {ah}. How tall are they equipped?' }
    },
    {
      name: 'Grip strength in gloves',
      expr: 'Fg = F*(1 - r)', tex: 'F_g = F\\,(1 - r)',
      vars: {
        Fg: { name: 'grip strength in gloves', q: 'force', unit: 'N', tex: 'F_g' },
        F: { name: 'bare-hand grip strength', q: 'force', unit: 'N', value: 275 },
        r: { name: 'reduction due to the gloves (under 10 % thin, 30 % or more thick)', q: 'ratio', unit: '%', value: 20 }
      },
      note: 'The reduction depends on the glove\'s thickness, stiffness, fit and friction; measure it for critical tasks.',
      stories: { Fg: 'A bare-hand grip of {F} is reduced by {r} in gloves. How strong is the gloved grip?', r: 'A grip of {F} falls to {Fg} in gloves. By how much?' }
    }
  ],
  examples: [
    {
      title: 'Headroom for an equipped soldier',
      q: 'The 99th-percentile man is 1918 mm tall. Boots add 40 mm, a helmet 40 mm, and walking needs a 75 mm margin. Does a 2000 mm doorway do?',
      steps: [
        'Equipped stature: $1918 + 40 + 40 = 1998$ mm.',
        'With the walking margin: $1998 + 75 = 2073$ mm.',
        'A 2000 mm doorway makes the tallest soldiers duck; about 2100 mm clears them.'
      ],
      a: 'No: about 2075 mm is needed.'
    },
    {
      title: 'A walkway in a cold store',
      q: 'Workers in a cold store wear insulated suits about 40 mm thick. The 95th-percentile man\'s shoulders are 526 mm wide. How wide are they dressed, and what clear width suits one person walking?',
      steps: [
        'Clothed: $B_c = 526 + 2 \\times 40 = 606$ mm.',
        'Add room for the arms to swing and for sway — about 100 mm: some 700 mm.',
        'The 600 mm minimum for walkways at machinery is too narrow here; allow at least 700–800 mm, more where people pass.'
      ],
      a: 'About 606 mm dressed; allow at least 700–800 mm of clear width.'
    }
  ],
  quiz: [
    { q: 'Which dimensions grow most with heavy cold-weather clothing?', choices: ['Breadths and depths of the body', 'Stature', 'Hand length', 'Eye height'], a: 0, why: 'Insulation adds its thickness on both sides of the trunk, hips and limbs.' },
    { q: 'Gloves only make the hand a little larger.', a: false, why: 'They also reduce dexterity and grip strength — by up to a third or more for thick or stiff gloves.' },
    { q: 'What shoe allowances does Pheasant suggest adding to barefoot standing heights?', choices: ['About 25 mm for men and 45 mm for women\'s shoes with a heel', 'None', 'About 100 mm for everyone', 'About 5 mm'], a: 0, why: 'Everyday footwear raises every standing height; work boots and high heels more.' },
    { q: 'About how much does a helmet add to stature?', choices: ['30–50 mm', '2–5 mm', '150–200 mm', 'Nothing'], a: 0, why: 'The shell stands off the head on its harness or pads; visors and lamps add more.' },
    { q: 'Military human-engineering standards require crew stations to fit people…', choices: ['as equipped, with their clothing and equipment', 'as measured nude in surveys', 'of average size only', 'without helmets'], a: 0, why: 'MIL-STD-1472 and DEF STAN 00-250 design around the equipped person.' }
  ],
  problems: [
    { q: 'Shoulders 526 mm wide are covered by 40 mm of clothing on each side. How wide are they clothed?', answer: 606, unit: 'mm', tol: 0.005, steps: ['$B_c = 526 + 2 \\times 40 = 606$ mm.'] },
    { q: 'A bare-hand grip of 275 N is reduced by 20 % in gloves. What is the gloved grip?', answer: 220, unit: 'N', tol: 0.01, steps: ['$F_g = 275 \\times (1 - 0.20) = 220$ N.'] }
  ],
  ranges: [
    { dim: 'Shoe allowance on standing heights', range: [25, 45], unit: 'mm', who: 'about 25 mm for men\'s shoes, about 45 mm for women\'s shoes with a heel', why: 'Barefoot table values become the heights people actually stand at.', limits: 'Work boots, thick winter soles and high heels add more; measure the actual footwear.', setting: 'all', src: 'Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Helmet allowance on stature and sitting height', range: [30, 50], unit: 'mm', who: 'industrial and military helmets on their harness or pads', why: 'Headroom, hatches and crew stations clear the helmeted head.', limits: 'Typical values: measure the actual helmet with its visor, lamp or night-vision mount.', setting: ['workshop', 'military', 'field', 'vehicle'], src: 'Typical of industrial and military helmets' },
    { dim: 'Cold-weather clothing on body breadths and depths', range: [40, 100], unit: 'mm', who: 'twice the thickness of the layers, about 20–50 mm per side', why: 'Seats, aisles, hatches and cabs fit people dressed for winter.', limits: 'Also shortens reach and joint movement; measure the actual clothing.', setting: ['field', 'military', 'workshop', 'vehicle'], src: 'Derived from layer thickness; MIL-STD-1472 (design for the clothed person)' },
    { dim: 'Body armour on chest depth', range: [50, 100], unit: 'mm', who: 'front and back plates with their carrier', why: 'Seats, belts, hatches and controls fit the armoured crew member.', limits: 'Pouches, packs and load-bearing equipment add much more; armour restricts bending and shoulder movement.', setting: 'military', src: 'Derived from plate and carrier thickness; DEF STAN 00-250' },
    { dim: 'Glove allowance on hand breadth and finger openings', range: [5, 25], unit: 'mm', who: 'twice the glove thickness: thin work gloves to insulated winter gloves', why: 'Handles, triggers, buttons and openings work in gloves.', limits: 'Gloves also cut dexterity and grip strength; test controls in the gloves actually worn.', setting: ['workshop', 'field', 'military', 'health'], src: 'Derived from glove thickness' }
  ],
  applications: [
    'Headroom, hatches and walkways for workers in boots, helmets and winter clothing.',
    'Crew stations and vehicle seats for soldiers in armour and load-bearing equipment.',
    'Controls, fasteners and tools usable in gloves.',
    'Seating and aisles in public places where people wear coats half the year.'
  ],
  sources: [
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — clothing and footwear allowances.',
    'ISO 15534-1, *Ergonomic design for the safety of machinery — Part 1: Principles for determining the dimensions required for openings for whole-body access into machinery*.',
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'MIL-STD-1472, *Department of Defense Design Criteria Standard: Human Engineering*.',
    'DEF STAN 00-250, *Human Factors for Designers of Systems* (UK Ministry of Defence).'
  ],
  sim: 'an-dressed'
},

{
  id: 'combining-percentiles', parent: 'human-variation', title: 'Why there is no "95th percentile person"', level: 2,
  short: 'Percentiles belong to one dimension. A manikin built from 95th-percentile parts is taller than 97 % of people, and a design that fits the 5th to 95th percentile on each of five dimensions fits only 60–80 % of people on all five. Multivariate accommodation sets a target for all critical dimensions together and tests it with boundary cases or virtual populations.',
  keywords: ['95th percentile person', 'average man', 'combining percentiles', 'multivariate accommodation', 'correlation', 'boundary manikins', 'boundary cases', 'principal component analysis', 'digital human model', 'accommodation envelope', 'ellipse', 'box', 'percentiles do not add', 'Daniels'],
  prereq: ['percentiles', 'design-for-range', 'sex-differences'],
  related: ['digital-human-models', 'user-trials-mockups', 'crew-stations', 'cockpit-ergonomics', 'vehicle-seating', 'anthropometry-basics', 'math:linear-regression', 'math:normal-distribution'],
  body: `
Specifications often ask for a design that fits "the 5th-percentile woman to the 95th-percentile man" as if these were two people. They are not: a percentile ranks **one** dimension. Someone at the 95th percentile of stature may be at the 60th of arm length and the 30th of hip breadth. There is no 95th-percentile person — as Daniels found in 1952, there is hardly anyone average on ten dimensions at once ([[design-for-range]]).

### Percentiles do not add
Stature is sitting height plus leg length (stature minus sitting height). If a designer stacks the 95th-percentile sitting height on the 95th-percentile leg, is the result the 95th-percentile stature? Only if the two parts were perfectly correlated. The spread of a sum is

$$\\sigma_{1+2} = \\sqrt{\\sigma_1^2 + \\sigma_2^2 + 2r\\,\\sigma_1\\sigma_2}$$

which is less than $\\sigma_1 + \\sigma_2$ whenever the correlation $r$ is below 1. With men's sitting height 915 ± 36 mm and a correlation between stature and sitting height of about 0.75, the leg is 840 ± 49 mm and the two parts correlate at only about 0.34. The stacked 95th-percentile parts give 974 + 921 = **1895 mm** — the 97.7th percentile of stature, not the 95th (1870 mm). A manikin assembled from 95th-percentile segments is a giant; one from 5th-percentile segments a dwarf.

### Several dimensions at once
A design must fit several dimensions together: seat height, knee room, reach and eye height in a cab. Accommodating the 5th to 95th percentile — 90 % — on each fits fewer people on all of them:

| Dimensions | Independent ($r$ = 0) | $r$ = 0.3 | $r$ = 0.5 | $r$ = 0.7 | $r$ = 0.9 |
|---|---|---|---|---|---|
| 1 | 90 % | 90 % | 90 % | 90 % | 90 % |
| 2 | 81 % | 82 % | 83 % | 84 % | 86 % |
| 3 | 73 % | 74 % | 76 % | 80 % | 84 % |
| 5 | 59 % | 62 % | 67 % | 73 % | 81 % |
| 10 | 35 % | 42 % | 51 % | 63 % | 77 % |

(Share within the 5th–95th percentile on every dimension, all dimensions equally correlated, from the multivariate normal distribution.) Independent dimensions multiply: $0.9^5 = 59$ %. Correlation softens the loss because people large on one dimension tend to be large on others — lengths correlate strongly with stature (roughly 0.7–0.9 and more), breadths and body mass much less (stature with body mass about 0.4–0.5) — but it never removes it.

In the simulation, a cloud of people is scattered over two dimensions. The **box** of 5th–95th percentiles on both holds fewer than 90 %, and its corners hold combinations that almost nobody has; the tilted [[?ellipse|ellipse]] that really holds 90 % of people follows the correlation. Below, see how the share on all dimensions falls as dimensions are added, for any correlation.

### Multivariate accommodation
Serious designs state the target for **all critical dimensions together** — "90 % of the user population, men and women, in winter clothing" — and test it:
1. **Boundary cases**: a small family of test manikins on the edge of the multivariate distribution (found, for example, by principal component analysis of the survey data): short and heavy, tall and slim, long legs and a short trunk…
2. **Virtual populations**: thousands of people drawn from the survey with their real correlations, each fitted to the design in a digital human model; the share that fits is counted ([[digital-human-models]]).
3. **Fitting trials** with real people chosen to cover the extremes ([[user-trials-mockups]]).
Adjustments help because each covers a combination: a seat track fits leg length and preferred posture together; an adjustable steering column and pedals fit arm and leg reach in the same cab.

### Where it matters
| Setting | Why several dimensions interact |
|---|---|
| Cockpits and crew stations | reach, leg length, sitting height, eye position and ejection or escape clearances at once ([[crew-stations]], [[cockpit-ergonomics]]) |
| Vehicle cabs | pedals, wheel, headroom, view out ([[vehicle-seating]]) |
| Clothing and PPE sizing | coveralls by stature and chest girth; respirator test panels span face length and width |
| Workstations | chair, desk and screen each adjust, so single-dimension ranges work better — but the combination still needs checking |

> [!warn] "Designed for the 5th to 95th percentile" on each dimension can leave a quarter or more of the users unfit on the combination. Ask which dimensions, which population, and what share fits on all of them together.

> [!key] Percentiles belong to one dimension. Set an accommodation target on the combination of critical dimensions, and test it with boundary cases, a virtual population or real people.
`,
  ideas: [
    'A percentile ranks one dimension; nobody is at the 95th percentile of everything.',
    'The spread of a sum is less than the sum of spreads unless the parts are perfectly correlated: stacked 95th-percentile parts overshoot.',
    'Fitting 90 % on each of five independent dimensions fits only 59 % on all five; correlation softens but never removes the loss.',
    'The region holding 90 % of people on two dimensions is a tilted ellipse, not the 5th–95th box.',
    'Multivariate accommodation targets the combination and tests it with boundary cases, virtual populations and trials.'
  ],
  pitfalls: [
    'A 95th-percentile manikin is the 95th-percentile person — Built from 95th-percentile parts, it is larger than about 97–98 % of people in stature and represents almost nobody.',
    '5th to 95th on every dimension fits 90 % of users — It fits 90 % on each; on several dimensions together far fewer.',
    'Correlation between dimensions solves the problem — It softens the loss; breadths and mass correlate weakly with lengths, and some pairs hardly at all.'
  ],
  formulas: [
    {
      name: 'Standard deviation of a sum of two dimensions',
      expr: 's = sqrt(s1^2 + s2^2 + 2*r*s1*s2)', tex: '\\sigma = \\sqrt{\\sigma_1^2 + \\sigma_2^2 + 2r\\,\\sigma_1\\sigma_2}',
      vars: {
        s: { name: 'standard deviation of the sum', q: 'length', unit: 'mm', tex: '\\sigma' },
        s1: { name: 'standard deviation of the first part', q: 'length', unit: 'mm', value: 36, tex: '\\sigma_1' },
        s2: { name: 'standard deviation of the second part', q: 'length', unit: 'mm', value: 49, tex: '\\sigma_2' },
        r: { name: 'correlation between the parts', q: 'none', value: 0.34, min: -1, max: 1, signed: true }
      },
      note: 'Default: men\'s sitting height and leg length (stature minus sitting height): the sum, stature, has σ ≈ 70 mm.',
      stories: { s: 'Two parts of a body have standard deviations {s1} and {s2} and correlate at {r}. What is the standard deviation of their sum?', r: 'Parts with standard deviations {s1} and {s2} add up to a dimension with standard deviation {s}. How strongly do they correlate?' }
    },
    {
      name: 'Share accommodated on all of several independent dimensions',
      expr: 'F = p^k', tex: 'F = p^{\\,k}',
      vars: {
        F: { name: 'share accommodated on all dimensions', q: 'ratio', unit: '%' },
        p: { name: 'share accommodated on each dimension', q: 'ratio', unit: '%', value: 90 },
        k: { name: 'number of independent dimensions', q: 'none', value: 5 }
      },
      note: 'For independent dimensions; correlated dimensions do better (see the table), but never better than the worst single dimension.',
      stories: { F: 'A design fits {p} of people on each of {k} independent dimensions. What share fits on all of them?', p: 'To fit {F} of people on all {k} independent dimensions, what share must each dimension accommodate?' }
    },
    {
      name: 'Percentile of a manikin stacked from percentile parts',
      expr: 'ze = z*(s1 + s2)/sqrt(s1^2 + s2^2 + 2*r*s1*s2)', tex: 'z_e = z\\,\\dfrac{\\sigma_1 + \\sigma_2}{\\sqrt{\\sigma_1^2 + \\sigma_2^2 + 2r\\,\\sigma_1\\sigma_2}}',
      vars: {
        ze: { name: 'z of the stacked sum', q: 'none', tex: 'z_e' },
        z: { name: 'z of each part (1.645 for the 95th)', q: 'none', value: 1.645 },
        s1: { name: 'standard deviation of the first part', q: 'length', unit: 'mm', value: 36, min: 10, max: 45, tex: '\\sigma_1' },
        s2: { name: 'standard deviation of the second part', q: 'length', unit: 'mm', value: 49, min: 40, max: 150, tex: '\\sigma_2' },
        r: { name: 'correlation between the parts', q: 'none', value: 0.34, min: -1, max: 1, signed: true }
      },
      note: 'ze = 2.00 is the 97.7th percentile: 95th-percentile sitting height on a 95th-percentile leg overshoots the 95th-percentile stature.',
      stories: { ze: 'Parts with standard deviations {s1} and {s2}, correlated at {r}, are each taken at z = {z}. At what z does their sum lie?' }
    }
  ],
  examples: [
    {
      title: 'The 95th-percentile manikin',
      q: 'Men\'s sitting height is 915 ± 36 mm and leg length (stature minus sitting height) 840 ± 49 mm, correlated at 0.34. Stack the 95th percentile of each. Where is the result among men\'s statures (1755 ± 70 mm)?',
      steps: [
        'Parts: $915 + 1.645 \\times 36 = 974$ mm and $840 + 1.645 \\times 49 = 921$ mm; together 1895 mm.',
        'Spread of the sum: $\\sqrt{36^2 + 49^2 + 2 \\times 0.34 \\times 36 \\times 49} = 70$ mm — stature\'s own spread, as it must be.',
        '$z = (1895 - 1755)/70 = 2.00$: the 97.7th percentile. The 95th-percentile stature is 1870 mm.'
      ],
      a: 'About 1895 mm — the 97.7th percentile, not the 95th.'
    },
    {
      title: 'Five dimensions in a cab',
      q: 'A cab accommodates 90 % of drivers on each of five critical dimensions. What share fits on all five if they were independent, and if they correlated at 0.5?',
      steps: [
        'Independent: $0.9^5 = 0.59$ — 59 %.',
        'Equally correlated at 0.5: about 67 % (from the multivariate normal, as in the table).',
        'To reach 90 % on all five, each must accommodate about $0.9^{1/5} = 97.9$ % if independent — or the design must be tested against the combination with boundary cases.'
      ],
      a: 'About 59 % (independent) to 67 % (r = 0.5) — far below 90 %.'
    }
  ],
  quiz: [
    { q: 'A manikin assembled from 95th-percentile body segments is…', choices: ['larger than the 95th-percentile person in stature — nearer the 98th percentile', 'exactly the 95th-percentile person', 'smaller than the 95th-percentile person', 'the average person'], a: 0, why: 'Parts are not perfectly correlated, so the spread of their sum is less than the sum of their spreads: stacked 95th percentiles overshoot.' },
    { q: 'A design fits 90 % of people on each of three independent dimensions. About what share fits on all three?', choices: ['About 73 %', 'About 90 %', 'About 97 %', 'About 30 %'], a: 0, why: '$0.9^3 = 0.729$.' },
    { q: 'Positive correlation between dimensions raises the share accommodated on all of them together.', a: true, why: 'People large on one dimension tend to be large on the others, so fewer are caught out by one limit only.' },
    { q: 'What are boundary manikins?', choices: ['Test cases on the edge of the multivariate distribution of the users', 'Manikins of the 5th and 95th percentile on every dimension', 'Manikins of average size', 'Dummies used only in crash tests'], a: 0, why: 'They represent real combinations at the edge of the population — the cases a design must fit.' },
    { q: 'On two correlated dimensions, which region holds 90 % of people?', choices: ['A tilted ellipse following the correlation', 'The box of the 5th–95th percentiles on both', 'A circle centred on the means', 'A straight band along one axis'], a: 0, why: 'The joint normal distribution has elliptical contours; the box misses some people and includes empty corners.' }
  ],
  problems: [
    { q: 'A design fits 90 % of people on each of four independent dimensions. What share fits on all four?', answer: 65.6, unit: '%', tol: 0.01, steps: ['$0.9^4 = 0.656$.'] },
    { q: 'Two parts have standard deviations of 36 and 49 mm and correlate at 0.34. What is the standard deviation of their sum?', answer: 70, unit: 'mm', tol: 0.01, steps: ['$\\sqrt{36^2 + 49^2 + 2 \\times 0.34 \\times 36 \\times 49} = \\sqrt{4896} = 70$ mm.'] }
  ],
  ranges: [
    { dim: 'Accommodation target for crew stations, cockpits and cabs', range: '90–95 % of users on all critical dimensions together', who: 'the whole user population (men and women), in their clothing and equipment', why: 'States whom the design fits on the combination, not dimension by dimension.', limits: 'Needs survey data with correlations, boundary cases or a virtual population, and a trial.', setting: ['vehicle', 'military'], src: 'Multivariate accommodation practice; Salvendy (ed.), *Handbook of Human Factors and Ergonomics*' },
    { dim: 'Accommodation needed on each of k independent dimensions for 90 % on all', range: 'about 96.5 % (3 dimensions) to 98 % (5 dimensions) each', who: 'every critical dimension of the design', why: 'The product of the shares reaches the overall target.', limits: 'Correlated dimensions need less; the tails beyond the 98th percentile are poorly known.', setting: 'all', src: 'Probability of independent events' }
  ],
  applications: [
    'Cockpit, cab and crew-station design with boundary manikins and virtual populations.',
    'Two-dimensional size charts for clothing, PPE and respirator test panels.',
    'Checking claims such as "fits the 5th to 95th percentile" in procurement.',
    'Digital human modelling with realistic, correlated body sizes ([[digital-human-models]]).'
  ],
  history: 'Gilbert Daniels\'s 1952 report for the US Air Force showed that none of 4063 airmen was close to the average on all ten dimensions studied. Over the following decades aircraft and vehicle designers replaced percentile manikins with multivariate methods — correlation-based accommodation estimates, boundary cases from principal component analysis and, with computers, whole virtual populations.',
  sources: [
    'G. S. Daniels, *The "Average Man"?*, US Air Force technical note, 1952.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — combining percentiles and the statistics of several dimensions.',
    'J. A. Roebuck, K. H. E. Kroemer and W. G. Thomson, *Engineering Anthropometry Methods* — multivariate anthropometry.',
    'G. Salvendy (ed.), *Handbook of Human Factors and Ergonomics* — anthropometry and digital human modelling.',
    'C. C. Gordon et al., *2012 Anthropometric Survey of U.S. Army Personnel* (ANSUR II) — correlated body data.'
  ],
  sim: 'an-box'
}

);
