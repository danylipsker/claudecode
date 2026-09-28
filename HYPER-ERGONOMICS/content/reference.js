/* HYPER-ERGONOMICS · content/reference.js — the reference concept for Hyper Ergonomics authors:
 * its depth, tone, ranges, numbers, tables, warnings, formulas and practical advice are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'design-for-range', parent: 'ergo-basics', title: 'Designing for a range of people', level: 1,
  short: 'People differ by 30 cm in height and by a factor of two in weight, so ergonomics never designs for "the average person". It picks the users who limit the design — the tall for clearance, the small for reach — and gives a range, or an adjustment, that fits most of them. The percentile is the tool; the range is the answer.',
  keywords: ['design for a range', 'percentile', '5th percentile', '95th percentile', 'average person fallacy', 'accommodation', 'adjustability', 'clearance', 'reach', 'anthropometry', 'normal distribution', 'design limits', 'mixed population'],
  prereq: ['ergonomics-defined'],
  related: ['percentiles', 'combining-percentiles', 'anthropometry-basics', 'sex-differences', 'population-differences', 'clothing-ppe-allowances', 'office-chair', 'doors-corridors', 'storage-heights', 'reach-zones', 'accessible-design', 'digital-human-models'],
  body: `
Stand a hundred adults in a line and the shortest woman is about 1.48 m tall, the tallest man about 1.93 m. Their weights run from under 50 kg to over 120 kg; their hands, reaches and sitting heights vary just as widely. A chair, a door, a workbench or a machine is fixed in size — so **whoever designs it decides who it fits**. Ergonomics makes that decision on purpose.

### There is no average person
In 1950 the US Air Force measured 4063 pilots on the ten body dimensions that mattered most for a cockpit. Gilbert Daniels then asked how many were close to the average — within the middle 30 % — on all ten. The answer was **none**. Someone average in height is rarely average in arm length, hip breadth and sitting height at the same time. A cockpit built around the average pilot fitted nobody well; adjustable seats, pedals and harnesses followed, and so did the whole practice of designing for a range.

### Percentiles
Most body dimensions within one sex are close to a **normal distribution** with a mean $\\mu$ and a standard deviation $\\sigma$. The $p$-th percentile is the size that $p$ % of people are smaller than:

$$x_p = \\mu + z_p\\,\\sigma$$

| Percentile | 1st | 5th | 10th | 50th | 90th | 95th | 99th |
|---|---|---|---|---|---|---|---|
| $z_p$ | −2.33 | −1.64 | −1.28 | 0 | +1.28 | +1.64 | +2.33 |

With a representative stature of 1755 ± 70 mm for men and 1625 ± 64 mm for women (see [[anthropometry-basics]] for where such numbers come from), the 5th-percentile woman is 1520 mm tall and the 95th-percentile man 1870 mm. Designing from the **5th-percentile woman to the 95th-percentile man** fits about 95 % of a population of equal numbers of men and women on that one dimension — the classic design range.

### Which end limits the design?
Every dimension of a design is limited by one end of the population, and the first question is always *which*:

| Design case | The limiting user | Typical choice | Examples |
|---|---|---|---|
| **Clearance** — nobody must be too big | the largest | 95th–99th percentile man, plus clothing | door height, knee room, headroom, seat width, escape hatches |
| **Reach** — nobody must be too small | the smallest | 5th percentile woman (1st for safety) | top shelf, controls, emergency stop, pedal distance |
| **Adjustable** — fit everyone within a range | both ends | 5th percentile woman to 95th percentile man | chair height, desk height, steering column, monitor arm |
| **Neither end critical** | the middle | about the 50th percentile | door-handle height, counter height when the range is small |
| **Safety distance** — nobody must reach a hazard | the largest reach, the smallest openings | beyond the 99th percentile, fixed by standard | guard openings, distances to moving parts (ISO 13857) |

Two rules follow. **Average is only right when neither end matters.** And **safety cases go further into the tail** than comfort cases: a tall person hitting their head on a door is a bruise, a hand reaching a blade through a guard is an amputation.

### Ranges, adjustment and their limits
Where one fixed size cannot fit, the answer is **adjustment**. A fixed 450 mm seat suits only about half of a mixed population within ±25 mm of their ideal height; an office chair adjustable from 400 to 510 mm (the range in EN 1335-1) fits about nine in ten. Adjustment has costs — price, weight, mechanisms that wear, and users who never adjust — so ergonomics offers a hierarchy:

1. **Fixed, one size for all** when the clearance or reach can simply be made generous (a wide corridor, a low light switch).
2. **Several sizes** when adjustment is impractical: clothing, gloves, helmets, school chairs in size marks.
3. **Adjustable** when the dimension is critical and the users change: office chairs, sit–stand desks, vehicle seats.
4. **Adapt the task** — platforms, step stools, tools with long handles — for the users the product still misses.

### Every design range has limitations
- **Several dimensions at once fit fewer people.** Accommodating 90 % on each of five independent dimensions fits only $0.9^5$ = 59 % on all five; real dimensions are correlated, so the loss is smaller, but it is always there (see [[combining-percentiles]]). Digital manikins and user trials check the combination.
- **The data must match the users.** Populations differ by nation, age, generation and occupation: a design for Dutch adults, Vietnamese adults, soldiers or schoolchildren needs their data (see [[population-differences]]).
- **Clothing and equipment add size.** Shoes add about 25–35 mm to heights, winter clothing and body armour add centimetres to breadths, gloves and helmets change reach and clearance (see [[clothing-ppe-allowances]]).
- **Posture changes everything.** Anthropometric tables are measured upright and still; people slump, lean and move. Add a posture allowance.
- **Excluding 5 % is still people.** In a city of a million, the 5 % outside a range is fifty thousand people. Where a design must fit everyone — exits, handrails, public toilets, controls for emergencies — design further into the tails, or add a second route (see [[accessible-design]]).

### The virtues of designing for a range
A design that fits its range has fewer injuries, less fatigue and fewer errors, and the people using it work faster and longer. Machinery built from ergonomic ranges is safer to operate and to maintain, easier to sell into different countries, and cheaper over its life than one that forces its operators to stoop, stretch and improvise. Nothing is lost by it except the illusion of the average user.

### Different settings, different ranges
- **Civil and domestic:** the widest population — children, the elderly, the disabled, the very tall. Codes set minimums (door widths, stair rises, handrail heights), and good design adds adjustment.
- **Workshop and industry:** a working-age population, but with safety shoes, gloves and hearing protection; long exposures turn small misfits into injuries. Adjustable benches and platforms pay for themselves.
- **Military:** selected, fitter people but carrying heavy, bulky equipment; crew stations, hatches and weapons must fit the 5th to 95th (often 1st to 99th) percentile *with* body armour, helmets and packs.
- **Field work:** construction, agriculture and utilities add weather, uneven ground, heavy PPE and portable tools; ranges must allow for gloved hands and restricted movement.

> [!warn] The body data in this app are representative, rounded values for adults, meant for learning and first estimates. For a real product or workplace use a survey of the actual user population, the relevant standard and a trial with real users.

> [!key] Name the limiting user for every dimension: clearance from the largest, reach from the smallest, adjustment across both. Design for a range — never for the average.
`,
  ideas: [
    'No one is average on every body dimension; a design around the average fits almost nobody well.',
    'A percentile is the size a given share of people are smaller than: x = μ + zσ.',
    'Clearances are set by the largest users, reaches by the smallest, adjustments span both.',
    'The classic range is the 5th-percentile woman to the 95th-percentile man, about 95 % of a mixed population.',
    'Fitting several dimensions at once fits fewer people; clothing, posture and the actual population change the numbers.'
  ],
  pitfalls: [
    'Design for the 50th percentile and most people are close enough — Half of the users are bigger than any 50th-percentile clearance and half are smaller than any 50th-percentile reach.',
    'Adding the 95th percentile of every body part gives the 95th-percentile person — Percentiles do not add: a manikin built from 95th-percentile parts represents almost nobody.',
    'A range from the 5th to the 95th percentile excludes 10 % of people — For a mixed population and the usual limits (5th woman to 95th man) it excludes about 5 %; for several dimensions at once it can exclude much more.',
    'Anthropometric tables apply everywhere — They describe the population that was measured, unclothed and upright; use the right population and add allowances.'
  ],
  formulas: [
    {
      name: 'A percentile of a body dimension',
      expr: 'x = mu + z*s', tex: 'x_p = \\mu + z_p\\,\\sigma',
      vars: {
        x: { name: 'dimension at percentile p', q: 'length', unit: 'mm', tex: 'x_p' },
        mu: { name: 'mean', q: 'length', unit: 'mm', value: 1755, tex: '\\mu' },
        z: { name: 'standard normal value for p (1.645 for the 95th)', q: 'none', value: 1.645, tex: 'z_p' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 70, tex: '\\sigma' }
      },
      note: 'For a normally distributed dimension of one sex. z is −1.645 for the 5th percentile, 0 for the 50th, +2.326 for the 99th.',
      stories: { x: 'Men\'s stature has a mean of {mu} and a standard deviation of {s}. What is the stature at z = {z}?', z: 'With a mean of {mu} and a standard deviation of {s}, how many standard deviations above the mean is {x}?' }
    },
    {
      name: 'A clearance height',
      expr: 'Hc = S + sh + c', tex: 'H_c = S + a_s + a_c',
      vars: {
        Hc: { name: 'clearance height', q: 'length', unit: 'mm', tex: 'H_c' },
        S: { name: 'stature of the largest user accommodated (e.g. 99th-percentile man)', q: 'length', unit: 'mm', value: 1918 },
        sh: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        c: { name: 'clearance for walking, a hat, a margin', q: 'length', unit: 'mm', value: 75, tex: 'a_c' }
      },
      note: 'The same pattern — the high-percentile dimension plus clothing plus a functional clearance — sets knee room, headroom and hatch sizes.',
      stories: { Hc: 'The tallest users to be accommodated are {S} tall, shoes add {sh} and a walking margin {c}. How high must the opening be?' }
    },
    {
      name: 'The share of one group a range accommodates',
      expr: 'F = (erf((b - mu)/(s*sqrt(2))) - erf((a - mu)/(s*sqrt(2))))/2', tex: 'F = \\Phi\\!\\left(\\dfrac{b - \\mu}{\\sigma}\\right) - \\Phi\\!\\left(\\dfrac{a - \\mu}{\\sigma}\\right)',
      vars: {
        F: { name: 'share accommodated', q: 'ratio', unit: '%' },
        a: { name: 'lower limit of the design range', q: 'length', unit: 'mm', value: 375 },
        b: { name: 'upper limit of the design range', q: 'length', unit: 'mm', value: 485 },
        mu: { name: 'mean of the dimension', q: 'length', unit: 'mm', value: 445, tex: '\\mu' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 28, tex: '\\sigma' }
      },
      note: 'Φ is the normal cumulative distribution, Φ(z) = ½[1 + erf(z/√2)]. For a mixed population add the shares of each group weighted by their numbers.',
      stories: { F: 'A dimension has a mean of {mu} and a standard deviation of {s}. What share of people lies between {a} and {b}?' }
    }
  ],
  examples: [
    {
      title: 'The range of an office chair',
      q: 'Popliteal height (floor to the underside of the thigh) is 405 ± 26 mm for women and 445 ± 28 mm for men. Shoes add 25 mm. What range of seat heights fits the 5th-percentile woman to the 95th-percentile man?',
      steps: [
        '5th-percentile woman: $405 - 1.645 \\times 26 = 362$ mm; with shoes 387 mm.',
        '95th-percentile man: $445 + 1.645 \\times 28 = 491$ mm; with shoes 516 mm.',
        'EN 1335-1 asks office chairs to adjust over at least 400–510 mm — very nearly the same range, shifted slightly for the compressed cushion.'
      ],
      a: 'About 387–516 mm; standard office chairs adjust over 400–510 mm.'
    },
    {
      title: 'How high must a door be?',
      q: 'Men\'s stature is 1755 ± 70 mm. Choose a door height that clears the 99th-percentile man with shoes and a 75 mm walking margin.',
      steps: [
        '99th-percentile man: $1755 + 2.326 \\times 70 = 1918$ mm.',
        'Add 25 mm of shoe and 75 mm for the bob of walking, a hat and a margin: 2018 mm.',
        'Standard door leaves are 2032 mm (6 ft 8 in) in North America and 2040 mm in much of Europe: they are set by exactly this reasoning.'
      ],
      a: 'About 2020 mm — close to the standard 2030–2040 mm door.'
    },
    {
      title: 'The highest shelf everyone can use',
      q: 'Vertical grip reach (standing, arm up, grasping) is 1910 ± 85 mm for women. How high can a shelf be that the 5th-percentile woman can still reach?',
      steps: [
        '5th-percentile woman: $1910 - 1.645 \\times 85 = 1770$ mm barefoot, about 1795 mm in shoes.',
        'That is at full stretch, standing flat-footed, with nothing in front of the shelf. For items used often, stay below shoulder height (about 1330 mm for the median woman) — reaching overhead repeatedly strains the shoulder.',
        'Above 1770 mm, provide a step or keep only rarely used, light items there.'
      ],
      a: 'About 1.77 m at the most for occasional reach; below about 1.3–1.4 m for frequent use.'
    }
  ],
  quiz: [
    { q: 'For the knee room under a desk, which user limits the design?', choices: ['The largest (a high percentile man)', 'The smallest (a low percentile woman)', 'The average person', 'Nobody — knee room is a matter of taste'], a: 0, why: 'Knee room is a clearance: if the largest user fits, everyone smaller fits too.' },
    { q: 'For the height of an emergency-stop button, which user limits the design?', choices: ['The smallest (a low percentile), in the worst posture', 'The largest', 'The average', 'The operator who installs it'], a: 0, why: 'A control must be reachable: if the smallest user can reach it, larger users can too.' },
    { q: 'The 95th percentile of a dimension is…', choices: ['the size 95 % of people are smaller than', 'the size of 95 % of people', 'the mean plus 95 %', 'the largest size measured'], a: 0, why: 'A percentile ranks a value: 95 % of the population lies below the 95th percentile.' },
    { q: 'A design accommodates 90 % of people on each of four independent dimensions. Roughly how many fit on all four?', choices: ['About 66 %', 'About 90 %', 'About 99 %', 'About 36 %'], a: 0, why: '0.9⁴ ≈ 0.66: every extra dimension excludes a few more people (correlation between dimensions softens this).' },
    { q: 'When is designing for the 50th percentile reasonable?', choices: ['When neither end of the population is critical, like a door-handle height', 'Always — it is the fairest choice', 'For clearances', 'For safety distances'], a: 0, why: 'Average values suit only dimensions where being a little high or low harms nobody.' }
  ],
  problems: [
    { q: 'Women\'s stature is 1625 ± 64 mm. What is the stature of the 5th-percentile woman (z = −1.645)?', answer: 1520, unit: 'mm', tol: 0.005, steps: ['$x = \\mu + z\\sigma = 1625 - 1.645 \\times 64 = 1520$ mm.'] },
    { q: 'Men\'s hip breadth sitting is 370 ± 27 mm and women\'s 395 ± 34 mm. A seat must be wide enough for the 95th-percentile woman plus 50 mm for clothing and movement. How wide?', answer: 501, unit: 'mm', tol: 0.01, steps: ['Women have the wider hips here, so they limit the design.', '95th-percentile woman: $395 + 1.645 \\times 34 = 451$ mm.', 'Add 50 mm: 501 mm — seat widths of about 480–520 mm follow.'] }
  ],
  ranges: [
    { dim: 'Office chair seat height (adjustment range)', range: [400, 510], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: popliteal height plus about 25 mm of shoe', why: 'Feet flat on the floor and thighs level, with no pressure from the seat edge under the thighs.', limits: 'At a fixed desk small users who raise the seat to the desk need a footrest; very tall users may need a taller gas lift.', setting: 'office', src: 'EN 1335-1' },
    { dim: 'Door leaf height', range: [2000, 2100], unit: 'mm', who: '99th-percentile man with shoes, plus about 75 mm for walking and a hat', why: 'Nobody ducks; helmets, hats and a walking stride fit through.', limits: 'Tall populations, helmets and carried loads need more; building codes set the legal minimum where you build.', setting: ['civil', 'workshop'] },
    { dim: 'Highest shelf for occasional use', range: [null, 1770], unit: 'mm', who: '5th-percentile woman\'s vertical grip reach, standing flat-footed', why: 'Almost everyone can reach it without a step.', limits: 'Full stretch only: frequent picks belong below about 1400 mm, and heavy items between knuckle and shoulder height.', setting: ['civil', 'workshop'] }
  ],
  applications: [
    'Office chairs, desks and sit–stand workstations adjustable over the 5th-woman to 95th-man range: see [the workstation fitter](#/tools/workstation).',
    'Aircraft cockpits, driver seats and truck cabs with adjustable seats, pedals and steering columns.',
    'Doors, corridors, stairs and handrails set by building codes from high and low percentiles.',
    'Personal protective equipment — helmets, gloves, respirators, body armour — made in sizes to cover the range.',
    'Seeing how many people a range fits for any dimension in [the body-size explorer](#/tools/bodysize).'
  ],
  history: 'Adolphe Quetelet described the normal spread of human measurements in the 1830s and 1840s. Large anthropometric surveys of soldiers and airmen after the Second World War — and Gilbert Daniels\'s 1952 report *The "Average Man"?* — showed that no one is average on many dimensions at once, and pushed designers towards adjustability and percentiles. Henry Dreyfuss\'s *The Measure of Man* (1960) brought percentile charts to industrial designers; ISO 7250 standardised the measurements and ISO 15535 the way surveys are made.',
  sources: [
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1: Body measurement definitions and landmarks*.',
    'ISO 15535, *General requirements for establishing anthropometric databases*.',
    'EN 1335-1, *Office furniture — Office work chair — Part 1: Dimensions*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace: Anthropometry, Ergonomics and the Design of Work*, the standard textbook on designing for a range.',
    'G. S. Daniels, *The "Average Man"?*, US Air Force technical note, 1952.'
  ],
  sim: ['ref-percentiles', 'ref-seat-fit']
}

);
