/* HYPER-ERGONOMICS · content/machinery.js
 * Machinery design: machines and operators (ergonomic principles for machinery, access openings, safety distances,
 * operator positions, maintenance, guards) and controls and displays (controls, displays, stereotypes, Fitts's law,
 * Hick's law, alarms, touchscreens and HMI panels). Simulations in sims/machinery.js (prefix mc-). */
Hyper.add(

{
  id: 'machine-ergonomics-principles', parent: 'machine-design', title: 'Ergonomic principles for machinery', level: 1,
  short: 'A machine is operated, cleaned and repaired by people for ten or twenty years. Designing it around the range of those people — their heights, reaches, strength, eyes and habits — is required by law in Europe (the Machinery Directive, EN 614-1) and always pays: fewer injuries and errors, faster operation and maintenance, guards that stay on, and a machine that sells to any workforce.',
  keywords: ['machinery ergonomics', 'EN 614-1', 'EN 614-2', 'ISO 12100', 'ISO 6385', 'Machinery Directive', 'Machinery Regulation', 'essential requirements', 'working height', 'operator', 'human-centred machine design', 'CE marking', 'adjustable machine', 'why ergonomics pays'],
  prereq: ['ergonomic-principles', 'design-for-range', 'human-centred-design'],
  related: ['operator-positions', 'access-openings', 'safety-distances', 'maintenance-ergonomics', 'guards-and-people', 'controls-design', 'displays-design', 'standing-work-heights', 'ergonomics-productivity', 'ergo-standards', 'motors:emergency-stop'],
  body: `
A machine lives for ten or twenty years, and on every shift of that life somebody stands at it, loads it, watches it, clears it when it jams, cleans it and repairs it. Whatever the designer leaves awkward — a work point too low, a control too far away, a filter behind three panels — that person pays for, thousands of times over. **Ergonomic design of machinery** means fitting the machine to the whole range of people who will operate and maintain it, from the first sketch rather than after the first complaint.

### The rule, in law and in standards
In the European Union ergonomics is an *essential health and safety requirement* for every machine placed on the market (Machinery Directive 2006/42/EC, Annex I, section 1.1.6, carried into the Machinery Regulation (EU) 2023/1230). In short: discomfort, fatigue and physical and mental stress must be reduced as far as possible, allowing for the variability of operators' size, strength and stamina, giving room to move, avoiding a work rate dictated by the machine and monitoring that needs long concentration, and fitting the interface to the operators who can be foreseen. **EN 614-1** turns this into a design procedure, **EN 614-2** ties machine design to the tasks it creates, **ISO 12100** makes ergonomic principles part of inherently safe design, and ISO 6385 states the principles for any work system. Outside Europe the same ideas appear in national rules and in handbooks such as MIL-STD-1472 for military equipment.

### The principles, applied to a machine
| Principle | At the machine | Where it is told |
|---|---|---|
| Design for the range of users | Work height, reach and view for the 5th-percentile woman to the 95th-percentile man; clearances for the 99th | ISO 14738, [[design-for-range]] |
| Neutral postures | Work between knuckle and elbow height, in front of the body, within forearm reach | EN 1005-4, ISO 11226, [[neutral-postures]] |
| Forces within capacity | Operating and handling forces set by the weaker users | EN 1005-3, [[niosh-lifting-equation]] |
| Controls and displays people understand | Expected directions, coding, grouping | ISO 9355, [[controls-design]] |
| Every phase of the machine's life | Setting, changeover, cleaning, fault finding and maintenance — not only production | ISO 12100, [[maintenance-ergonomics]] |
| Safeguards that fit the work | Guards that neither slow nor block the job | ISO 14119, [[guards-and-people]] |
| A tolerable environment | Noise, vibration, light and heat at the operator's position | [[noise-control]], [[lighting-levels]] |

### Working height: the first number to get right
For standing work the working height follows the elbow: **100–150 mm below it for light work**, **50–100 mm above it for precision work** (with the forearms supported), and **150–400 mm below it for heavy work** that uses body weight. With the representative data (standing elbow height 1015 ± 46 mm for women and 1100 ± 50 mm for men, plus 25 mm of shoe) light work suits heights from about **815 mm** for the 5th-percentile woman to **1105 mm** for the 95th-percentile man — a spread of almost 300 mm. No fixed height covers it: a height-adjustable table, an adjustable operator platform, or stations at two heights can (see [[standing-work-heights]] and [[operator-positions]]).

### Why ergonomic machinery is always preferred
- **Fewer injuries.** Stooping, reaching and over-heavy controls are the classic causes of back, shoulder and wrist disorders; a machine that removes them removes the injury at its source.
- **Fewer errors.** Controls that move the expected way and displays read at a glance prevent wrong actions — scrap, damaged tools and accidents ([[stereotypes-compatibility]]).
- **Faster work.** Shorter reaches and fewer steps shorten every cycle; [[fitts-law]] puts a number on it.
- **Quicker maintenance.** Service points that can be seen and reached, and lifting points on heavy parts, shorten repairs and raise availability.
- **Guards that stay on.** A safeguard that fits the task is not bypassed.
- **Wider markets.** A machine that adjusts from the 5th-percentile woman to the 95th-percentile man can be sold to workforces in any country, with more women and older workers; one built around its designer's body cannot.

**The limits.** Adjustment costs money, adds mechanisms and is sometimes never used, so users must be shown how; body data must match the real users; and no hardware makes a machine-paced ten-second cycle healthy — that is a question of [[job-rotation|job design]].

### How the setting changes the design
| Setting | Operators and what they wear | What changes |
|---|---|---|
| Workshop | Skilled operators, safety shoes, gloves, eye and hearing protection | Bench machines used for hours: adjustable heights, reach, visibility of the tool |
| Industry | Mixed workforce on shifts, repetitive cycles | Cycle time, repetition, changeovers, line balancing |
| Military | Selected people in armour, helmets, CBRN suits and gloves, often in the cold | 1st–99th percentile with equipment; big gloved controls; MIL-STD-1472 |
| Vehicles and mobile machines | Drivers seated for hours, vibration, limited view | Seats, pedals, sight lines, steps and handholds |
| Field | Outdoor work in mud, rain and cold, heavy gloves | Controls and service points usable with gloves; lifting and access on rough ground |

In the simulation, set the machine to *Typical fixed design* and watch the crowd below it: most people are red. Press *Ergonomic design* and most turn green; then pick the tallest man and see that even a well-fitted light task makes him bow his head — which is why precision work is raised.

> [!warn] In the EU a machine that ignores the ergonomics requirement does not meet the essential requirements and cannot lawfully carry the CE marking. Ergonomics is part of the risk assessment, not an optional extra.

> [!key] Design the machine around the range of its operators and maintainers — all their tasks, all their sizes, in their real clothing. It is cheaper to draw a better machine than to live with a worse one.
`,
  ideas: [
    'Ergonomics is a legal essential requirement for machinery in the EU (Machinery Directive, Annex I 1.1.6; EN 614-1 gives the procedure).',
    'Working height follows the elbow: light work 100–150 mm below it, precision work above it, heavy work 150–400 mm below.',
    'For light standing work the right height spreads from about 815 mm to 1105 mm across the 5th-percentile woman to the 95th-percentile man: adjust it.',
    'Every life-cycle phase counts: setting, cleaning, fault finding and maintenance as well as production.',
    'Ergonomic machines have fewer injuries and errors, faster cycles and repairs, guards that stay on, and wider markets.'
  ],
  pitfalls: [
    'A machine that fits the designer fits the operators — The designer is one body; the operators span 30 cm in height and a factor of two in strength.',
    'Ergonomics is about comfort and can wait until the prototype — Heights, reaches, access and guards are fixed early in the layout; changing them late is expensive or impossible.',
    'Only the production task matters — Most accidents at machines happen during setting, clearing jams, cleaning and maintenance.'
  ],
  formulas: [
    {
      name: 'Standing working height',
      expr: 'hw = he + sh - d', tex: 'h_w = h_e + a_s - \\Delta h',
      vars: {
        hw: { name: 'working height (top of the work)', q: 'length', unit: 'mm', tex: 'h_w' },
        he: { name: 'standing elbow height of the user (barefoot)', q: 'length', unit: 'mm', value: 1015, tex: 'h_e' },
        sh: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        d: { name: 'drop below the elbow (100–150 light, 150–400 heavy, −50 to −100 precision)', q: 'length', unit: 'mm', value: 125, signed: true, tex: '\\Delta h' }
      },
      note: 'Light work: Δh = 100–150 mm; heavy work: 150–400 mm; precision work: −50 to −100 mm (above the elbow, with forearm support).',
      stories: { hw: 'A worker\'s elbow height is {he}; shoes add {sh}. The task is light assembly, {d} below the elbow. At what height should the work be?', he: 'Work at {hw} suits light work {d} below the elbow, with {sh} of shoe. What elbow height does it suit?' }
    },
    {
      name: 'Several criteria at once (independent)',
      expr: 'F = F1*F2*F3', tex: 'F = F_1 F_2 F_3',
      vars: {
        F: { name: 'share of users who fit all three', q: 'ratio', unit: '%' },
        F1: { name: 'share who fit the working height', q: 'ratio', unit: '%', value: 90, tex: 'F_1' },
        F2: { name: 'share who fit the reach', q: 'ratio', unit: '%', value: 95, tex: 'F_2' },
        F3: { name: 'share who fit the view', q: 'ratio', unit: '%', value: 90, tex: 'F_3' }
      },
      note: 'The [[?product]] of the shares holds when the criteria are independent; for fully correlated body dimensions the share is the smallest of them. Real designs lie between — check with a manikin or a user trial.',
      stories: { F: 'A machine fits {F1} of users on height, {F2} on reach and {F3} on view. If the three are independent, what share fits all three?' }
    }
  ],
  examples: [
    {
      title: 'Who does a fixed 900 mm bench suit?',
      q: 'A machine has a fixed standing working height of 900 mm for light assembly (100–150 mm below the elbow, with 25 mm of shoe). Standing elbow height is 1015 ± 46 mm for women and 1100 ± 50 mm for men. What share of a mixed workforce (half women) is exactly right?',
      steps: [
        'Right for a user if $900 = h_e + 25 - \\Delta h$ with $\\Delta h$ from 100 to 150 mm, so if the elbow height is between 975 and 1025 mm.',
        'Women: $\\Phi\\left(\\frac{1025-1015}{46}\\right) - \\Phi\\left(\\frac{975-1015}{46}\\right) = \\Phi(0.22) - \\Phi(-0.87) = 0.586 - 0.192 = 39\\,\\%$ (the [[?gaussian]] spread of elbow height).',
        'Men: $\\Phi(-1.5) - \\Phi(-2.5) = 0.067 - 0.006 = 6\\,\\%$.',
        'Mixed: $(39 + 6)/2 \\approx 23\\,\\%$. Everyone else stoops over the work or raises the shoulders to it, all shift.'
      ],
      a: 'About 23 % — mostly shorter women. An adjustable height of about 815–1105 mm fits the 5th-percentile woman to the 95th-percentile man.'
    },
    {
      title: 'Fitting three things at once',
      q: 'A layout fits 90 % of users on working height, 95 % on reach and 90 % on the view of the tool. How many fit all three?',
      steps: [
        'If the three were independent: $0.90 \\times 0.95 \\times 0.90 = 0.77$, so 77 %.',
        'If they were perfectly correlated (the same people fail every test), the share would be that of the hardest criterion: 90 %.',
        'Body dimensions are strongly but not perfectly correlated, so the truth lies between — and people outside the range on one criterion are often the tallest or the smallest. A digital manikin or a trial with the extreme users settles it.'
      ],
      a: 'Between 77 % and 90 %; every extra criterion excludes a few more people.'
    }
  ],
  quiz: [
    { q: 'Which requirement makes ergonomics compulsory for machinery sold in the EU?', choices: ['Annex I of the Machinery Directive 2006/42/EC (and the Machinery Regulation 2023/1230)', 'Only voluntary company policies', 'The noise directive alone', 'None — ergonomics is advice only'], a: 0, why: 'Ergonomics is one of the essential health and safety requirements of Annex I (1.1.6); harmonised standards such as EN 614-1 show how to meet it.' },
    { q: 'A light-assembly bench is fixed at 900 mm. Who is it roughly right for?', choices: ['Mostly shorter women', 'Mostly tall men', 'Everyone equally', 'Nobody — 900 mm is always wrong'], a: 0, why: 'Light work sits 100–150 mm below the elbow; 900 mm suits standing elbow heights of 975–1025 mm, typical of women. Taller people stoop over it.' },
    { q: 'Which phases of a machine\'s life should the designer\'s task analysis cover?', choices: ['Transport, installation, operation, setting, cleaning, fault finding, maintenance and dismantling', 'Only normal production', 'Only maintenance', 'Only what the customer lists in the order'], a: 0, why: 'ISO 12100 asks for all life-cycle phases; many injuries occur outside normal production.' },
    { q: 'True or false: a machine designed to ergonomic recommendations usually costs more over its life.', a: false, why: 'It may cost a little more to build, but fewer injuries, errors and stoppages, faster cycles and repairs, and a wider market usually repay it many times.' },
    { q: 'For precision work at a machine, where should the work be relative to the standing elbow?', choices: ['50–100 mm above it, with forearm support', '150–400 mm below it', 'At knee height', 'At eye height'], a: 0, why: 'Raising fine work brings it closer to the eyes so the head need not bow, and supports the forearms for steady hands.' }
  ],
  problems: [
    { q: 'The 95th-percentile man\'s standing elbow height is 1182 mm. With 25 mm of shoe, what working height suits him for light work 125 mm below the elbow?', answer: 1082, unit: 'mm', tol: 0.01, steps: ['$h_w = h_e + a_s - \\Delta h = 1182 + 25 - 125 = 1082$ mm.'] },
    { q: 'Women\'s standing elbow height is 1015 ± 46 mm. What share of women have an elbow height between 975 and 1025 mm (the users a fixed 900 mm light-work bench suits)?', answer: 39.4, unit: '%', tol: 0.03, steps: ['$z_1 = (975 - 1015)/46 = -0.87$, $z_2 = (1025 - 1015)/46 = 0.22$.', '$\\Phi(0.22) - \\Phi(-0.87) = 0.586 - 0.192 = 0.394$, about 39 %.'] }
  ],
  ranges: [
    { dim: 'Working height, standing, light work (adjustment range)', range: [815, 1105], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: standing elbow height plus 25 mm of shoe, less 100–150 mm', why: 'Upper arms hang relaxed, forearms slightly down, no stooping and no raised shoulders.', limits: 'Representative data; add PPE and the real population. A fixed height suits only a narrow band of users — use adjustment, a platform or two station heights.', setting: ['workshop'], src: 'EN 614-1, ISO 14738; this app\'s representative adult body data' },
    { dim: 'Working height, standing, precision work (adjustment range)', range: [1015, 1305], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: elbow height plus shoe plus 50–100 mm', why: 'The work comes closer to the eyes, so the head stays upright; supported forearms steady the hands.', limits: 'Needs forearm or wrist supports; for long tasks consider sitting.', setting: ['workshop'], src: 'ISO 14738; Kroemer and Grandjean' },
    { dim: 'Working height, standing, heavy work (relative to the elbow)', range: '150–400 mm below standing elbow height', unit: '', who: 'Each user\'s elbow height; a fixed height near 810 mm suits heavy work from the 5th-percentile woman to the 95th-percentile man', why: 'Body weight can be used over the work and the arms push down near their strongest.', limits: 'Too low for anything that must be seen closely; tall users then stoop.', setting: ['workshop'], src: 'Kroemer and Grandjean, Fitting the Task to the Human' },
    { dim: 'Frequent reach from the shoulder (horizontal, at work height)', range: [null, 440], unit: 'mm', who: 'About three quarters of the 5th-percentile woman\'s arm reach (about 590 mm from the shoulder joint)', why: 'Repeated reaches stay in the forearm zone: no stretching, no forward lean, short movement times.', limits: 'Measured from the shoulder joint, about 100–150 mm behind the chest; with the body touching the machine that is about 300 mm beyond its front edge.', setting: ['workshop', 'office'], src: 'ISO 14738; this app\'s representative adult body data' },
    { dim: 'Occasional reach from the shoulder', range: [null, 590], unit: 'mm', who: 'The 5th-percentile woman\'s full arm reach to a grip, arm straight', why: 'Everyone can reach it without leaving the operating position.', limits: 'Full stretch only; beyond it the trunk leans (acceptable up to about 20° for short times) or the user steps in.', setting: ['workshop'], src: 'ISO 14738; ISO 11226' },
    { dim: 'Share of the user population to accommodate', range: '90–95 % (5th woman to 95th man); 99 % or more where safety or escape depends on it', unit: '', who: 'The whole intended population, in its working clothing and PPE', why: 'Covers nearly everyone with a practical design; safety cases go further into the tails.', limits: 'Several dimensions at once fit fewer people than each alone.', setting: ['all'], src: 'EN 614-1; ISO 15535' }
  ],
  applications: [
    'Machine tools, presses and packaging machines with height-adjustable work tables or operator platforms.',
    'CE marking of machinery in the EU: ergonomics in the risk assessment and the technical file.',
    'Military and field equipment designed with 1st–99th percentile users wearing gloves, armour and cold-weather clothing.',
    'Checking a layout with the [standing workstation fitter](#/tools/workstation/standing) and the [Dimension finder](#/tools/ranges).'
  ],
  history: 'Human engineering of machines grew out of the Second World War, when studies of aircraft controls showed that many "pilot errors" were design errors. In Europe the 1989 Machinery Directive (89/392/EEC) made ergonomics a legal essential requirement for machines; EN 614-1 (first published in 1995) turned it into a design procedure. The 2006 Machinery Directive and the 2023 Machinery Regulation keep and extend the requirement.',
  sources: [
    'EN 614-1, *Safety of machinery — Ergonomic design principles — Part 1: Terminology and general principles*.',
    'EN 614-2, *Safety of machinery — Ergonomic design principles — Part 2: Interactions between the design of machinery and work tasks*.',
    'ISO 12100, *Safety of machinery — General principles for design — Risk assessment and risk reduction*.',
    'Directive 2006/42/EC (the Machinery Directive), Annex I, 1.1.6 Ergonomics; Regulation (EU) 2023/1230 on machinery.',
    'ISO 6385, *Ergonomics principles in the design of work systems*; ISO 14738, anthropometric requirements for workstations at machinery.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human* — working heights and the design of workplaces.'
  ],
  sim: 'mc-machine-fit'
},

{
  id: 'access-openings', parent: 'machine-design', title: 'Access openings for the body', level: 2,
  short: 'Openings people must pass through or reach into — walk-throughs, manholes, openings for the upper body, the arms, a hand or a finger — are sized from the largest users plus clothing, PPE and room to move (ISO 15534). It is the opposite case of a guard opening, which is sized to keep the smallest body parts out.',
  keywords: ['access opening', 'ISO 15534', 'manhole', 'crawl-through', 'walk-through', 'hand access', 'arm access', 'inspection opening', 'maintenance opening', 'clearance', 'walkway width', 'EN ISO 14122', 'confined space', 'hatch', 'body armour allowance'],
  prereq: ['design-for-range', 'clothing-ppe-allowances', 'hand-foot-head'],
  related: ['safety-distances', 'maintenance-ergonomics', 'doors-corridors', 'confined-spaces', 'crew-stations', 'standing-dimensions', 'combining-percentiles'],
  body: `
Some openings in a machine are there to keep people out; others are there to let them in — to walk into an enclosure, climb into a tank, lean into a cabinet, put an arm in to reach a valve or a hand to undo a fastener. An access opening that is too small is worse than none: people squeeze, twist, take off their gloves or their breathing apparatus, and get stuck. **ISO 15534** gives the method: Part 1 for openings the whole body passes through, Part 2 for openings for parts of the body, Part 3 for the body data they use.

### The rule: largest user + allowances
An access opening is a **clearance**, so the largest users limit it:

$$A = x_{p} + a_c + a_m$$

where $x_p$ is the body dimension at a high percentile — the 95th, or the 99th where escape or rescue depends on it — $a_c$ the allowance for clothing and personal protective equipment, and $a_m$ the room needed to move, turn and see. The body dimension is the one that is widest *in the direction of passing*: shoulder breadth for a walk-through or a manhole, stature for headroom, hand breadth for a hand opening. It is not always a man: seated hip breadth is larger for women (395 ± 34 mm against 370 ± 27 mm), and a crawl-through the hips must pass is limited by the largest women.

### Openings, from the whole body to a finger
Worked from the representative data (99th-percentile man, stature 1918 mm, shoulder breadth 545 mm, hand breadth 100 mm) with typical allowances:

| Opening | Limiting dimension | Worked size (order of magnitude) |
|---|---|---|
| Walk-through, upright | stature + shoe + helmet + walking bob; shoulders + clothing + arm swing | about 2030 mm high, 650–700 mm wide |
| Walkway on a machine | shoulders + clothing, people passing | at least 600 mm, preferably 800 mm (EN ISO 14122-2) |
| Manhole, crawl-through | shoulder breadth + clothing | about 600 mm across; more with breathing apparatus or for rescue |
| Upper body leaning in | shoulders + clothing; head and shoulders | about 600 mm wide |
| Hand to the wrist (flat, gloved) | hand breadth + glove + clearance | about 120–150 mm |
| One finger (a button inside) | finger breadth + clearance | at least about 25–30 mm |

These are *worked examples of the method* on representative data, not the standard's tables: use ISO 15534-3 or a survey of your own users, and the allowances for the clothing and PPE they really wear.

### What else an opening must allow
- **Seeing.** A hand in an opening hides what it is doing: leave room for a line of sight, or a second opening, or a mirror.
- **Tools.** Add the tool and its swing: an open-ended spanner needs an arc to turn; a torque wrench needs its length; a hand holding a tool is bigger than a flat hand.
- **Posture.** Reaching into an opening at shoulder height is fine for a moment; at floor level or above the head it becomes a strain — place openings between knuckle and shoulder height where you can (see [[maintenance-ergonomics]]).
- **Rescue.** A person must come *out* too — possibly unconscious, in a harness, in protective gear. Confined-space openings are sized for rescue, not for entry alone ([[confined-spaces]]).

### Different settings
- **Workshop and industry:** work clothing, safety shoes, gloves; people enter enclosures for setting and cleaning.
- **Military:** hatches in vehicles, aircraft and ships must pass crews wearing body armour, helmets, CBRN suits and load-bearing equipment, which add several centimetres to breadth and depth; the design range often runs from the 1st to the 99th percentile ([[crew-stations]]).
- **Field:** tanks, silos, sewers and wind-turbine hubs: heavy clothing, harnesses, breathing apparatus, and help far away.
- **Vehicles:** cab doors, steps and hatches of mobile machines are access openings too (ISO 2867 for earth-moving machinery).

In the simulation, choose an opening and a person, add clothing and PPE, and watch the share of men and women who fit; then turn to *Hand opening* and put on heavy gloves.

> [!warn] Never size an opening someone may have to be rescued through from the entry alone. A casualty in a harness, a rescuer in breathing apparatus, a stretcher — each needs more than a person going in freely.

> [!key] An access opening is a clearance: largest user, in real clothing and PPE, plus room to move, see and use a tool. A guard opening is the reverse: the smallest body part, kept out.
`,
  ideas: [
    'An access opening is a clearance: the largest users limit it, at the 95th or, for escape and rescue, the 99th percentile.',
    'Opening = body dimension at that percentile + clothing and PPE allowance + room to move (ISO 15534).',
    'The limiting dimension is the widest one in the direction of passing — shoulders, hips (larger for women), stature, hand breadth.',
    'Openings must also allow sight, tools and rescue, not just entry.',
    'Guard openings are the opposite case: sized to keep the smallest body parts out (ISO 13857).'
  ],
  pitfalls: [
    'An opening that fits the 95th-percentile man fits everybody — In heavy clothing or breathing apparatus he may not fit; and hips that must pass are limited by women.',
    'If a hand fits, the job can be done — The hand must also hold a tool, turn it and be seen; the opening must allow all three.',
    'An access opening and a guard opening follow the same rule — Access is sized for the largest body; a guard opening is sized so the smallest body part cannot reach the hazard.'
  ],
  formulas: [
    {
      name: 'Size of an access opening',
      expr: 'A = mu + z*s + ac + am', tex: 'A = \\mu + z_p\\,\\sigma + a_c + a_m',
      vars: {
        A: { name: 'opening dimension', q: 'length', unit: 'mm' },
        mu: { name: 'mean of the limiting body dimension (shoulder breadth, men)', q: 'length', unit: 'mm', value: 480, tex: '\\mu' },
        z: { name: 'z for the design percentile (2.326 for the 99th)', q: 'none', value: 2.326, tex: 'z_p' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 28, tex: '\\sigma' },
        ac: { name: 'clothing and PPE allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_c' },
        am: { name: 'room to move', q: 'length', unit: 'mm', value: 100, tex: 'a_m' }
      },
      note: 'The body dimension at percentile p is μ + zσ (a [[?gaussian]] spread); the allowances are for the clothing and PPE really worn and the movement needed.',
      stories: { A: 'Shoulder breadth is {mu} ± {s}. With z = {z}, a clothing allowance of {ac} and {am} of room to move, how wide must the opening be?', am: 'An opening is {A} wide. With a mean shoulder breadth of {mu} ± {s}, z = {z} and {ac} of clothing, how much room is left to move?' }
    },
    {
      name: 'Share of users who pass an opening',
      expr: 'F = ncdf((A - a - mu)/s)', tex: 'F = \\Phi\\!\\left(\\dfrac{A - a - \\mu}{\\sigma}\\right)',
      vars: {
        F: { name: 'share who pass', q: 'ratio', unit: '%' },
        A: { name: 'opening dimension', q: 'length', unit: 'mm', value: 110 },
        a: { name: 'allowance (glove, clothing, clearance)', q: 'length', unit: 'mm', value: 12 },
        mu: { name: 'mean body dimension (hand breadth, men)', q: 'length', unit: 'mm', value: 88, tex: '\\mu' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 5, tex: '\\sigma' }
      },
      note: 'Φ is the normal distribution function. For a mixed population, weight the shares of men and women by their numbers.',
      stories: { F: 'A hand opening is {A} wide; the glove adds {a}. Hand breadth is {mu} ± {s}. What share of hands pass?', A: 'Hand breadth is {mu} ± {s} and the glove adds {a}. How wide must an opening be for a share {F} to pass?' }
    }
  ],
  examples: [
    {
      title: 'A walk-through opening in a machine enclosure',
      q: 'Size a walk-through opening for the 99th-percentile man (stature 1918 mm, shoulder breadth 545 mm) wearing safety shoes (25 mm), a safety helmet (about 35 mm) and work clothing (25 mm on the breadth). Allow 50 mm for the bob of walking and 100 mm of arm swing.',
      steps: [
        'Height: $1918 + 25 + 35 + 50 = 2028$ mm.',
        'Width: $545 + 25 + 100 = 670$ mm.',
        'Round up: about 2050 mm × 700 mm. A narrower opening (the 600 mm minimum for walkways) passes the same man, but he must keep his arms in and cannot carry much.'
      ],
      a: 'About 2030–2050 mm high and 670–700 mm wide.'
    },
    {
      title: 'A hand opening to reach a drain valve',
      q: 'Hand breadth is 88 ± 5 mm for men and 78 ± 4 mm for women. Workers wear gloves that add about 12 mm; allow 20 mm to move. How wide must the opening be for the 95th-percentile man, and what share of men pass a 110 mm opening?',
      steps: [
        '95th-percentile man: $88 + 1.645 \\times 5 = 96$ mm; with the glove and clearance $96 + 12 + 20 = 128$ mm.',
        'A 110 mm opening passes gloved hands up to 98 mm: $\\Phi\\left(\\frac{110 - 12 - 88}{5}\\right) = \\Phi(2.0) = 97.7\\,\\%$ of men — but with no room to turn the valve.',
        'Women\'s hands are smaller: almost all pass.'
      ],
      a: 'About 130 mm; a 110 mm opening admits 97.7 % of gloved men\'s hands but leaves no room to work.'
    }
  ],
  quiz: [
    { q: 'An access opening must let people in. Which users limit its size?', choices: ['The largest, in their real clothing and PPE', 'The smallest', 'The average', 'Children'], a: 0, why: 'An access opening is a clearance: if the largest users fit, everyone smaller fits too.' },
    { q: 'A crawl-through opening must pass the hips. Whose hip breadth limits it?', choices: ['Large women — seated hip breadth is larger for women', 'Large men always', 'Small women', 'Nobody — hips are narrower than shoulders for everyone'], a: 0, why: 'Hip breadth sitting is about 395 ± 34 mm for women against 370 ± 27 mm for men: the limiting user is not always a man.' },
    { q: 'What does ISO 15534 Part 3 contain?', choices: ['The anthropometric data used to size access openings', 'Safety distances to hazards', 'Rules for guard interlocks', 'Noise limits'], a: 0, why: 'Part 1 covers whole-body openings, Part 2 openings for parts of the body, Part 3 the body data.' },
    { q: 'True or false: an opening sized so a hand fits is big enough for the job.', a: false, why: 'The hand must hold and turn a tool and the worker must see what they are doing; add room for both.' },
    { q: 'Why is a confined-space opening sized for rescue rather than entry?', choices: ['A casualty in a harness, a rescuer in breathing apparatus or a stretcher need more room than a person entering freely', 'Rescue is faster through small openings', 'Entry needs more room than rescue', 'It is not — entry decides'], a: 0, why: 'The worst case is getting an unconscious person out; plan the opening for that.' }
  ],
  problems: [
    { q: 'Shoulder breadth for men is 480 ± 28 mm. A manhole must pass the 99th-percentile man (z = 2.326) with 25 mm of clothing and 30 mm of room. What diameter?', answer: 600, unit: 'mm', tol: 0.01, steps: ['$480 + 2.326 \\times 28 = 545$ mm.', '$545 + 25 + 30 = 600$ mm.'] },
    { q: 'Hand breadth for men is 88 ± 5 mm. Gloves add 12 mm. What share of men\'s gloved hands pass a 110 mm opening?', answer: 97.7, unit: '%', tol: 0.01, steps: ['$z = (110 - 12 - 88)/5 = 2.0$.', '$\\Phi(2.0) = 0.977$.'] }
  ],
  ranges: [
    { dim: 'Walk-through opening, height', range: [2000, 2100], unit: 'mm', who: '99th-percentile man with shoes and a safety helmet, plus the bob of walking', why: 'Nobody ducks or strikes the head, even in a hurry.', limits: 'Tall populations and carried loads need more; national building rules may set the minimum.', setting: ['workshop', 'field'], src: 'ISO 15534-1 (method); representative data' },
    { dim: 'Walkway and passage width on machinery', range: [600, 800], unit: 'mm', who: 'The shoulders of large users in work clothing; 800 mm and more where people pass one another or carry tools', why: 'Walking without turning sideways; room for a tool bag.', limits: '600 mm is a minimum for one person without loads; escape routes and busy routes need more.', setting: ['workshop'], src: 'EN ISO 14122-2' },
    { dim: 'Headroom over walkways and platforms', range: [2100, null], unit: 'mm', who: 'Tall users with helmets', why: 'No head strikes on beams, pipes and ducts.', limits: 'Pad or mark any unavoidable low obstruction.', setting: ['workshop'], src: 'EN ISO 14122-2' },
    { dim: 'Manhole or crawl-through opening, across', range: [600, null], unit: 'mm', who: '99th-percentile man\'s shoulder breadth (about 545 mm) plus work clothing and a little room', why: 'Entry without twisting or removing clothing.', limits: 'Breathing apparatus, harnesses and rescue with a casualty need considerably more; check the rules for confined spaces where you work.', setting: ['workshop', 'field', 'military'], src: 'ISO 15534-1 (method); representative data' },
    { dim: 'Hand access opening (flat gloved hand to the wrist)', range: [120, 150], unit: 'mm', who: '95th–99th-percentile man\'s hand breadth (96–100 mm) plus a glove and room to move', why: 'The hand reaches a fastener or valve without scraping, and can turn it.', limits: 'Add the tool and its swing; leave a line of sight.', setting: ['workshop', 'field'], src: 'ISO 15534-2 (method); representative data' },
    { dim: 'Finger access opening (pressing a button or switch inside)', range: [25, 30], unit: 'mm', who: 'A large gloved finger with a little clearance', why: 'The finger reaches the control without catching.', limits: 'A gap a finger can enter near a moving part is a hazard: see the minimum gaps of ISO 13854.', setting: ['workshop'], src: 'ISO 15534-2 (method); ISO 13854' }
  ],
  applications: [
    'Doors and walk-throughs in machine enclosures and robot cells.',
    'Manholes in tanks, vessels, silos and wind-turbine structures, sized for rescue.',
    'Hatches in military vehicles, aircraft and ships, sized for crews in armour and protective suits.',
    'Service openings for hands and tools in cabinets and machine frames; see the [body-size explorer](#/tools/bodysize/explorer).'
  ],
  sources: [
    'ISO 15534-1, *Ergonomic design for the safety of machinery — Part 1: Principles for determining the dimensions required for openings for whole-body access into machinery*.',
    'ISO 15534-2, *Part 2: Principles for determining the dimensions required for access openings*; ISO 15534-3, *Part 3: Anthropometric data*.',
    'EN ISO 14122-2, *Safety of machinery — Permanent means of access to machinery — Part 2: Working platforms and walkways*.',
    'ISO 13854, *Safety of machinery — Minimum gaps to avoid crushing of parts of the human body*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — clearances, clothing allowances and access.'
  ],
  sim: 'mc-access-openings'
},

{
  id: 'safety-distances', parent: 'machine-design', title: 'Safety distances at guards', level: 2,
  short: 'A guard works when no part of the body can reach the hazard: over it, around it, through its openings or under it. ISO 13857 sets the distances from the reach of the largest people and the openings from the smallest body parts; ISO 13854 gives the gaps that avoid crushing; ISO 13855 places light curtains and other devices by how fast a hand approaches.',
  keywords: ['safety distance', 'ISO 13857', 'ISO 13854', 'ISO 13855', 'reach over', 'reach through', 'reach around', 'guard opening', 'mesh guard', 'minimum gap', 'crushing', 'light curtain', 'approach speed', 'stopping time', 'fence height', 'hazard zone'],
  prereq: ['functional-reach', 'access-openings', 'percentiles'],
  related: ['guards-and-people', 'machine-ergonomics-principles', 'design-for-range', 'age-children-elderly', 'motors:emergency-stop', 'motors:optical-sensors', 'pneumatics:two-hand-control', 'pneumatics:safety-functions'],
  body: `
A guard does not have to enclose a machine completely. It has to make sure that **no part of anybody's body can reach the hazard** — by stretching up, leaning over the guard, reaching around its edge, pushing fingers or an arm through its openings, or sliding a foot under it. Get the distances right and a simple fence or mesh is as good as a box; get them wrong and a solid-looking guard is a trap.

### The design case: the longest reach, the smallest opening
Safety distances are the most extreme case of [[design-for-range]]. The **reach** must be beyond the longest-armed, tallest users; the **openings** must stop the smallest fingers and hands. ISO 13857 builds its values from body data for people **aged 14 and over** and adds margins, because a hand reaching a blade is an amputation, not a bruise. Where younger children can be present — public places, homes, farms — openings must be smaller still (see [[age-children-elderly]]).

### Reaching up
With nothing to lean over, a hazard is out of reach if it is high enough: ISO 13857 uses **2500 mm** where the risk is low and **2700 mm** where it is high. For comparison, the representative 99th-percentile man's vertical grip reach is about 2270 mm; his fingertips on tiptoe come to about 2400 mm — the standard's values keep a margin above that.

### Reaching over a protective structure
Leaning over a fence, a person pivots about its top edge: the lower the edge, the more of the trunk goes over and the further the fingertips get. The safe horizontal distance $c$ therefore depends on the height of the hazard $a$ and the height of the structure $b$; ISO 13857 tabulates it for low and high risk. Two rules of thumb from the standard: structures **lower than 1000 mm** are not counted as restricting the body at all, and where the risk is high, structures lower than **1400 mm** should not be used without further measures. A simple geometric model shows why (the simulation draws it): with a reach $R$ beyond the edge, a hazard at depth $b - a$ below the edge is out of reach when

$$c > \\sqrt{R^2 - (b - a)^2}$$

which is a circle drawn around the edge — the model the simulation shades. It is for insight; the standard's tables, with their margins, govern.

### Reaching through openings
An opening lets in whatever body part fits through it, as far as that part is long. A few key values from ISO 13857 (people 14 and over):

- openings up to **4 mm**: only the fingertip enters — a distance of **2 mm** is enough;
- square or round openings of **12–20 mm** (a common mesh): the fingers and part of the hand enter — the hazard must be at least **120 mm** behind;
- openings of **40–120 mm**: the arm passes to the shoulder — **850 mm**, a full arm's length.

**Slots are worse than squares** of the same width: a flat hand and forearm slide into a long slot where they could not enter a square hole. Between these key values the standard's table must be read for the exact shape and size.

### Reaching around, and under
An arm can bend around the edge of a guard: the distance needed depends on the gap, from the fingers to the whole arm. Feet and legs reach under fences and through gaps near the floor; ISO 13857 has separate values for the lower limbs. Keep gaps under fences small and check them.

### Gaps that avoid crushing
Where two parts close on each other, either keep the gap too small for a body part to enter or large enough for it not to be crushed. ISO 13854 gives minimum gaps:

| Body part | Minimum gap |
|---|---|
| Body | 500 mm |
| Head (worst position) | 300 mm |
| Leg | 180 mm |
| Foot, arm | 120 mm |
| Hand, wrist, fist | 100 mm |
| Toes | 50 mm |
| Finger | 25 mm |

### Protective devices: how fast a hand comes
A light curtain or a two-hand control does not block the body; it stops the machine. It must therefore be far enough away that the hazard has stopped before the hand arrives. ISO 13855 gives, for a hand approaching a curtain with detection capability $d \\le 40$ mm,

$$S = K\\,T + 8\\,(d - 14)$$

with $K = 2000$ mm/s, $T$ the overall stopping time (device plus machine) in seconds and $S$ in mm, at least 100 mm; if $S$ comes out above 500 mm it is recalculated with $K = 1600$ mm/s, and then at least 500 mm. The time is [[?proportional|proportional]] to the distance: a machine that takes twice as long to stop needs its curtain twice as far away — and its operator reaches further every cycle ([[guards-and-people]]).

### Settings
- **Workshop and industry:** fences, mesh guards, light curtains, interlocked doors; the tables are applied as written.
- **Civil and public:** children — escalators, gates, fitness machines and doors need the smallest openings.
- **Field:** agricultural and construction machines, often guarded by distance and with the operator far from help.
- **Military and vehicles:** the same physics; gloved hands are larger but reach is the same.

In the simulation, take a tall man, lower the fence and watch the shaded reach grow over the edge; drag the hazard until it turns safe, and read the distance the model needs.

> [!warn] The values of ISO 13857, ISO 13854 and ISO 13855 are minimums for the risk assessed. Never interpolate or round them down, never apply adult values where children can reach, and check what the body can do with a step, a box or a ladder placed against the guard.

> [!key] Distance for reach, openings for fingers: the longest reach and the smallest body parts limit a guard. A protective device is placed by the time the machine takes to stop.
`,
  ideas: [
    'A guard works if no body part can reach the hazard — up, over, around, through or under it (ISO 13857).',
    'Reach is set by the largest users (aged 14 and over), openings by the smallest body parts; margins are added because the injuries are severe.',
    'Out of reach upwards: 2500 mm at low risk, 2700 mm at high risk.',
    'Key opening values: up to 4 mm → 2 mm; 12–20 mm mesh → 120 mm; 40–120 mm → 850 mm. Slots are worse than squares.',
    'Light curtains stand at S = K·T + C from the hazard: the longer the stopping time, the further away (ISO 13855).'
  ],
  pitfalls: [
    'A tall fence is always safe — Behind a low hazard a fence of any height needs a distance; below 1000 mm it does not count as restricting reach at all.',
    'A slot is as safe as a square hole of the same width — A flat hand and forearm slide into a slot much deeper.',
    'A light curtain can be mounted anywhere in front of the hazard — Its distance follows from the stopping time; too close and the hand arrives before the machine stops.'
  ],
  formulas: [
    {
      name: 'Light curtain distance from the hazard (ISO 13855)',
      expr: 'S = K*T + 8*(d - 14)', tex: 'S = K\\,T + 8\\,(d - 14)',
      vars: {
        S: { name: 'minimum distance from the detection zone to the hazard', q: false, unit: 'mm' },
        K: { name: 'approach speed of the hand (2000, or 1600 if S > 500 mm)', q: false, unit: 'mm/s', value: 2000 },
        T: { name: 'overall stopping time: device response plus machine stopping', q: false, unit: 's', value: 0.15 },
        d: { name: 'detection capability (resolution) of the curtain, 14 to 40', q: false, unit: 'mm', value: 30 }
      },
      note: 'For a hand approaching perpendicular to the curtain, d ≤ 40 mm. S at least 100 mm; above 500 mm recalculate with K = 1600 mm/s and use at least 500 mm. Units are fixed: mm, mm/s, s.',
      stories: { S: 'A light curtain resolves {d}; the machine and curtain together stop in {T}. With K = {K}, how far from the hazard must the curtain be?', T: 'A curtain of resolution {d} can only be {S} from the hazard (K = {K}). What is the longest allowed stopping time?' }
    },
    {
      name: 'Reaching over an edge (a geometric model)',
      expr: 'c = sqrt(R^2 - (b - a)^2)', tex: 'c = \\sqrt{R^2 - (b - a)^2}',
      vars: {
        c: { name: 'horizontal distance beyond which the hazard is out of reach', q: 'length', unit: 'mm' },
        R: { name: 'reach beyond the edge (arm, plus trunk if the edge is low)', q: 'length', unit: 'mm', value: 800 },
        b: { name: 'height of the protective structure', q: 'length', unit: 'mm', value: 1400 },
        a: { name: 'height of the hazard', q: 'length', unit: 'mm', value: 1000 }
      },
      note: 'The reach is a circle of radius R around the top edge; a hazard inside it can be touched. A model for insight only — ISO 13857\'s tables, with margins, govern the design.',
      stories: { c: 'A person can reach {R} beyond the top of a {b} fence. A hazard is at {a}. Beyond what horizontal distance is it out of reach?', R: 'A hazard at {a} is just reachable at {c} behind a {b} fence. How far does the person reach beyond the edge?' }
    }
  ],
  examples: [
    {
      title: 'Placing a light curtain',
      q: 'A press stops in 0.18 s after its light curtain (response 0.02 s) is interrupted. Where must a curtain of 14 mm resolution go? And one of 30 mm resolution?',
      steps: [
        'Overall stopping time $T = 0.18 + 0.02 = 0.20$ s.',
        '14 mm: $S = 2000 \\times 0.20 + 8\\,(14 - 14) = 400$ mm (between 100 and 500 mm, so this stands).',
        '30 mm: $S = 400 + 8 \\times 16 = 528$ mm, above 500 mm, so recalculate with $K = 1600$: $S = 320 + 128 = 448$ mm, which is below 500 mm — use 500 mm.'
      ],
      a: '400 mm with the fine curtain; 500 mm with the coarse one — a finer curtain lets the operator work closer.'
    },
    {
      title: 'A mesh guard too close to a belt drive',
      q: 'A guard of 20 mm square mesh is fitted 80 mm in front of a V-belt drive. Is that enough?',
      steps: [
        'For square openings of 12–20 mm ISO 13857 requires at least 120 mm between the guard and the hazard: fingers and part of the hand can pass.',
        '80 mm is short by 40 mm.',
        'Move the guard out to at least 120 mm, or use a finer mesh and check the distance that the standard gives for it.'
      ],
      a: 'No — at least 120 mm is needed for a 20 mm mesh.'
    },
    {
      title: 'A hazard just above head height',
      q: 'A chain conveyor runs at 2400 mm above a walkway; a trapped hand would be a serious injury (high risk). Is it out of reach?',
      steps: [
        'For high risk, ISO 13857 treats hazards at 2700 mm or more as out of upward reach.',
        '2400 mm is within reach — the 99th-percentile man reaches about 2400 mm on tiptoe even before the margin.',
        'Guard the conveyor from below, or raise it to at least 2700 mm.'
      ],
      a: 'No; guard it or raise it to 2700 mm.'
    }
  ],
  quiz: [
    { q: 'Why is a slot of width 25 mm more dangerous than a square opening 25 mm wide?', choices: ['A flat hand and forearm can slide into a long slot, reaching much deeper', 'Slots are always closer to the hazard', 'Squares are stronger', 'It is not — only the width matters'], a: 0, why: 'In a slot the hand turns flat and the fingers, hand and forearm follow each other in; a square of the same width stops them sooner.' },
    { q: 'A hazard sits 2600 mm above the floor and the risk is high. Is it out of reach without a guard?', choices: ['No — the high-risk value is 2700 mm', 'Yes — anything above 2500 mm is out of reach', 'Yes — nobody is 2.6 m tall', 'Only for women'], a: 0, why: 'ISO 13857 uses 2500 mm for low risk and 2700 mm for high risk; people stretch, stand on tiptoe and hold things.' },
    { q: 'What is the minimum gap that avoids crushing a finger (ISO 13854)?', choices: ['25 mm', '10 mm', '100 mm', '4 mm'], a: 0, why: 'A 25 mm gap lets a finger sit without being crushed; hands need 100 mm, arms and feet 120 mm, the body 500 mm.' },
    { q: 'A machine\'s stopping time doubles after a brake wears. What happens to the light curtain\'s required distance?', choices: ['It roughly doubles (S = K·T + C)', 'It stays the same', 'It halves', 'Nothing — the curtain stops the machine instantly'], a: 0, why: 'The hand keeps approaching during the stopping time; the distance is proportional to T. Stopping time must be checked regularly.' },
    { q: 'Whose body sets ISO 13857\'s reach distances?', choices: ['The largest users aged 14 and over, with margins', 'The average adult', 'The smallest adults', 'Children under 3'], a: 0, why: 'Reach distances come from the longest reaches; openings from the smallest body parts; children under 14 need extra care.' }
  ],
  problems: [
    { q: 'A light curtain with 14 mm resolution protects a machine whose overall stopping time is 0.12 s. How far from the hazard must it be (ISO 13855, K = 2000 mm/s)?', answer: 240, unit: 'mm', tol: 0.01, steps: ['$S = 2000 \\times 0.12 + 8\\,(14 - 14) = 240$ mm.', 'It lies between 100 and 500 mm, so 240 mm stands.'] },
    { q: 'In the simple reach-over model a person reaches 800 mm beyond the top of a 1400 mm fence. A hazard is at 1000 mm. Beyond what horizontal distance is it out of reach?', answer: 693, unit: 'mm', tol: 0.01, steps: ['$c = \\sqrt{800^2 - (1400 - 1000)^2} = \\sqrt{640000 - 160000} = 693$ mm.', 'The standard\'s tables add margins to such geometry.'] }
  ],
  ranges: [
    { dim: 'Hazard height out of upward reach, low risk', range: [2500, null], unit: 'mm', who: 'The tallest users stretching, 14 years and over, with a margin', why: 'No guard is needed for a hazard that nobody can reach from the floor.', limits: 'Anything to stand on — a box, a rail, a ladder — changes the floor level.', setting: ['workshop', 'field'], src: 'ISO 13857' },
    { dim: 'Hazard height out of upward reach, high risk', range: [2700, null], unit: 'mm', who: 'The tallest users stretching, with a larger margin', why: 'Severe injuries call for more margin.', limits: 'As above; also check reach from platforms and walkways.', setting: ['workshop', 'field'], src: 'ISO 13857' },
    { dim: 'Protective structure height counted as restricting reach over it', range: [1000, null], unit: 'mm', who: 'The trunk of a tall person leaning over the edge', why: 'Below this the body simply bends over the barrier.', limits: 'Where the risk is high, structures below 1400 mm should not be used without further measures.', setting: ['workshop'], src: 'ISO 13857' },
    { dim: 'Distance behind a 12–20 mm square or round mesh', range: [120, null], unit: 'mm', who: 'Fingers and part of the hand of people 14 years and over', why: 'The fingertips stop short of the hazard.', limits: 'Slots of the same width need more; smaller children reach further through a given opening.', setting: ['workshop', 'civil'], src: 'ISO 13857' },
    { dim: 'Distance behind openings of 40–120 mm', range: [850, null], unit: 'mm', who: 'The whole arm to the shoulder', why: 'A full arm\'s length separates the opening from the hazard.', limits: 'Such openings are usually better closed.', setting: ['workshop'], src: 'ISO 13857' },
    { dim: 'Minimum gap to avoid crushing a finger', range: [25, null], unit: 'mm', who: 'Large fingers', why: 'A finger caught in the gap is not crushed.', limits: 'Hand, wrist and fist need 100 mm, arm and foot 120 mm, leg 180 mm, head 300 mm, body 500 mm.', setting: ['workshop', 'civil'], src: 'ISO 13854' },
    { dim: 'Minimum gap to avoid crushing the whole body', range: [500, null], unit: 'mm', who: 'Large bodies between moving parts', why: 'Someone trapped between a moving table and a wall is not crushed.', limits: 'Only for gaps a body can be in; smaller gaps must keep parts out instead.', setting: ['workshop'], src: 'ISO 13854' },
    { dim: 'Light curtain distance from the hazard', range: [100, null], unit: 'mm', who: 'A hand approaching at 2000 mm/s (1600 mm/s beyond 500 mm)', why: 'The hazard has stopped before the hand arrives.', limits: 'S = K·T + 8(d − 14) for d ≤ 40 mm; coarser curtains and slower machines need more; stopping time must be verified.', setting: ['workshop'], src: 'ISO 13855' }
  ],
  applications: [
    'Perimeter fences around robot cells and automated lines.',
    'Mesh guards over belts, chains, shafts and fans.',
    'Light curtains and two-hand controls on presses and packaging machines; see [[pneumatics:two-hand-control|two-hand control]] and [[motors:emergency-stop|emergency stop]].',
    'Public equipment — gates, escalators, fitness machines — where children\'s fingers set the openings.'
  ],
  history: 'European standards for safety distances began with EN 294 (upper limbs, 1992) and EN 811 (lower limbs, 1996), which ISO 13857 combined in 2008. EN 349 on minimum gaps became ISO 13854, and EN 999 on approach speeds became ISO 13855.',
  sources: [
    'ISO 13857, *Safety of machinery — Safety distances to prevent hazard zones being reached by upper and lower limbs*.',
    'ISO 13854, *Safety of machinery — Minimum gaps to avoid crushing of parts of the human body*.',
    'ISO 13855, *Safety of machinery — Positioning of safeguards with respect to the approach speeds of parts of the human body*.',
    'ISO 14120, *Safety of machinery — Guards — General requirements for the design and construction of fixed and movable guards*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — reach and the safety case of design for a range.'
  ],
  sim: 'mc-safety-distance'
},

{
  id: 'operator-positions', parent: 'machine-design', title: 'Operator positions at machinery', level: 2,
  short: 'Where the operator sits or stands decides everything else at a machine. ISO 14738 derives the heights, reaches, legroom and foot room of sitting, standing and sit–stand workstations from body data: clearances from the largest users, reaches from the smallest, adjustment across both.',
  keywords: ['operator position', 'ISO 14738', 'workstation at machinery', 'sitting or standing', 'sit-stand', 'perching stool', 'legroom', 'knee clearance', 'toe recess', 'foot room', 'work height', 'adjustable platform', 'foot controls', 'EN 1005-4'],
  prereq: ['machine-ergonomics-principles', 'standing-work-heights', 'sit-stand-work'],
  related: ['sitting-dimensions', 'standing-dimensions', 'reach-zones', 'standing-all-day', 'workbench-design', 'office-chair', 'crew-stations', 'driver-workspace', 'posture-assessment'],
  body: `
Before choosing a height or a reach, decide how the operator will work: **sitting, standing, or sit–stand**. Each posture has its own dimensions, its own virtues and its own costs, and a machine that forces the wrong one — standing all day at fine work, sitting where heavy forces are needed — tires and injures however well its numbers are chosen. **ISO 14738** sets out the anthropometric requirements for workstations at machinery; ISO 11226 and EN 1005-4 judge the postures they produce.

### Sit, stand or both?
| Choose | When the task… | Watch out for |
|---|---|---|
| **Sitting** | is long and precise, needs steady hands or foot controls, uses small forces, and everything lies within seated reach | legroom, a seat that adjusts, a work surface at the right height |
| **Standing** | needs large forces or body weight, reaches far or often, handles large parts, or moves between points | fatigue of legs and back from hours of standing; heights for small and tall users |
| **Sit–stand** | mixes the two, or has short cycles with walking; the operator perches on a high seat | the work height is the standing one; foot rests; a stool that does not block the way |

Standing still for hours is itself a strain: legs, feet and back ache and blood pools in the legs ([[standing-all-day]]). Let people change posture — a sit–stand position or a perching stool is often the best answer at a production machine.

### The standing position
- **Working height** from the elbow (see [[machine-ergonomics-principles]]): the light-work band runs from about 815 mm to 1105 mm across the 5th-percentile woman to the 95th-percentile man; standing elbow heights alone spread by about 245 mm.
- **Toe recess.** A plinth or cabinet that comes down to the floor keeps the feet — and so the body — back, adding reach to every movement. A recess about **100–150 mm deep** and at least about 120 mm high lets the toes in and the body come to the edge.
- **Reach.** Frequent reaches within about 440 mm of the shoulder, occasional within about 590 mm (the 5th-percentile woman's arm).
- **Floor.** Anti-fatigue matting, a level and dry floor, room to shift the feet; a platform for small users where the machine cannot adjust.
- **No repeated pedals** for a standing operator: working a pedal means standing on one leg.

### The seated position
- **Seat height** adjustable over about **400–510 mm**, like an office chair; the seat's own reach to the work surface decides the rest.
- **Work surface** near seated elbow height for light work, higher for precision work with forearm support, lower for force.
- **Knee clearance** under the surface: for the 95th-percentile man with his seat set to his legs, popliteal height 491 mm + 25 mm of shoe + thigh thickness 190 mm + 20 mm ≈ **730 mm** to the underside. A machine with drawers, a frame or a hydraulic unit there fails him.
- **Knee and foot depth:** at least about **450 mm** at knee level and about **600 mm** at foot level, so that the body — not only the arms — can come to the work.
- **Footrest** where the seat must be raised above a small user's legs to meet a fixed work height.

### The sit–stand position
A high seat or a perching stool (typically adjustable over roughly 650–850 mm) carries part of the body weight while the feet stay on the floor or a rail. The work height is the standing one, the reach is nearly the standing reach, and the operator can stand up at once. Leave space for the stool when standing.

### What the numbers rest on
Clearances (knee room, thigh room, foot room) come from the **largest** users; reaches and the heights of controls from the **smallest**; working heights span both, which is why they adjust. The body data must be for the real users, with shoes, clothing and PPE ([[clothing-ppe-allowances]]). The same method fits crew stations in vehicles, ships and aircraft ([[crew-stations]]) and the driver's workspace ([[driver-workspace]]), where the seat is fixed to the vehicle and everything is placed around it.

In the simulation (set to *Sitting*), move the knee room from 0 to 400 mm and watch the whole body come to the work, the reach shorten and the share of users who fit rise; then set the work height below the tall man's thighs.

> [!tip] At a production machine, give a height-adjustable work surface or platform, a toe recess, a perching stool and matting: four cheap items that turn a standing-all-day job into a tolerable one.

> [!key] Choose the posture from the task; then give clearance for the largest, reach for the smallest, and adjustment for everyone between.
`,
  ideas: [
    'Choose sitting, standing or sit–stand from the task: precision and duration favour sitting, force and movement favour standing, mixed work favours sit–stand.',
    'Clearances from the largest users (knee room, foot room), reaches from the smallest, working heights adjusted across both (ISO 14738).',
    'A toe recess and knee room let the body, not just the arms, come to the work.',
    'Standing elbow heights spread by about 245 mm from the 5th-percentile woman to the 95th-percentile man: work tables need about 250–300 mm of travel.',
    'Standing still all day is itself a strain; let operators change posture.'
  ],
  pitfalls: [
    'Standing is always healthier than sitting — Prolonged standing tires the legs and back just as prolonged sitting does; alternation is healthiest.',
    'A pedal is fine for a standing operator — Working a pedal repeatedly means standing on one leg; put pedals at seated stations.',
    'Knee room is a luxury — Without it the body stays back, every reach grows by 200–300 mm and the trunk leans all shift.'
  ],
  formulas: [
    {
      name: 'Height adjustment needed (5th woman to 95th man)',
      expr: 'dH = mum + z*sm - (muf - z*sf)', tex: '\\Delta H = (\\mu_m + z\\,\\sigma_m) - (\\mu_f - z\\,\\sigma_f)',
      vars: {
        dH: { name: 'spread of the body dimension to be covered', q: 'length', unit: 'mm', tex: '\\Delta H' },
        mum: { name: 'mean for men (standing elbow height)', q: 'length', unit: 'mm', value: 1100, tex: '\\mu_m' },
        sm: { name: 'standard deviation for men', q: 'length', unit: 'mm', value: 50, tex: '\\sigma_m' },
        muf: { name: 'mean for women', q: 'length', unit: 'mm', value: 1015, tex: '\\mu_f' },
        sf: { name: 'standard deviation for women', q: 'length', unit: 'mm', value: 46, tex: '\\sigma_f' },
        z: { name: 'z of the design percentiles (1.645 for 5th and 95th)', q: 'none', value: 1.645 }
      },
      note: 'Add the width of the task band (for light work 50 mm) to get the travel a work table or platform needs.',
      stories: { dH: 'Standing elbow height is {mum} ± {sm} for men and {muf} ± {sf} for women. How much do elbow heights spread from the 5th-percentile woman to the 95th-percentile man (z = {z})?' }
    },
    {
      name: 'Knee clearance under a work surface (seated)',
      expr: 'Hk = P + a + T + m', tex: 'H_k = P + a_s + T + m',
      vars: {
        Hk: { name: 'height of the underside of the work surface', q: 'length', unit: 'mm', tex: 'H_k' },
        P: { name: 'popliteal height of the largest user (95th-percentile man)', q: 'length', unit: 'mm', value: 491 },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        T: { name: 'thigh clearance (thigh thickness) of the largest user', q: 'length', unit: 'mm', value: 190 },
        m: { name: 'margin for movement', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'With the seat set to the user\'s legs (popliteal height plus shoe). If the seat must be raised to a fixed work surface, the knee clearance must rise with it.',
      stories: { Hk: 'The largest user\'s popliteal height is {P}, shoes add {a}, his thighs are {T} thick and a margin of {m} is wanted. How high must the underside of the work surface be?' }
    }
  ],
  examples: [
    {
      title: 'How much must a machine table adjust?',
      q: 'Standing elbow height is 1100 ± 50 mm for men and 1015 ± 46 mm for women. Light work wants the table 100–150 mm below the elbow (plus 25 mm of shoe). How much travel covers the 5th-percentile woman to the 95th-percentile man?',
      steps: [
        '95th-percentile man: $1100 + 1.645 \\times 50 = 1182$ mm; 5th-percentile woman: $1015 - 1.645 \\times 46 = 939$ mm.',
        'Spread of elbow heights: $1182 - 939 = 243$ mm.',
        'The task band is 50 mm wide, so the table runs from $939 + 25 - 150 = 814$ mm to $1182 + 25 - 100 = 1107$ mm: about 290 mm of travel.'
      ],
      a: 'About 815–1105 mm: some 290 mm of travel (or a fixed table with platforms for smaller users).'
    },
    {
      title: 'Knee room under a machine table',
      q: 'A seated inspection station has a fixed work surface. The 95th-percentile man has a popliteal height of 491 mm and a thigh thickness of 190 mm. How high must the underside be, and what happens to a 5th-percentile woman (popliteal height 362 mm) at the same station?',
      steps: [
        'Underside: $491 + 25 + 190 + 20 = 726$ mm, so about 730 mm.',
        'A surface 30 mm thick puts the work at about 760 mm — some 50 mm below his seated elbow (seat $491 + 25 = 516$ mm plus elbow rest height 294 mm = 810 mm): right for light work.',
        'Her seat fits her legs at $362 + 25 = 387$ mm and her elbow rest height is 189 mm, so her elbow is at 576 mm — 184 mm below the work.',
        'To bring her elbow to the work she raises the seat to $760 - 189 = 571$ mm; her feet then hang $571 - 387 = 184$ mm above the floor. Give her a footrest of about 180 mm, or make the surface adjustable.'
      ],
      a: 'About 730 mm to the underside; small users then need a large footrest or, better, an adjustable surface.'
    }
  ],
  quiz: [
    { q: 'Which task is best done seated?', choices: ['Long, precise inspection with a foot switch and small parts within reach', 'Loading 20 kg castings into a fixture', 'Walking between three machines', 'Pulling heavy cables'], a: 0, why: 'Precision, duration, small forces and foot controls all favour sitting; force and movement favour standing.' },
    { q: 'Why should standing operators not work pedals repeatedly?', choices: ['They must stand on one leg, which is unstable and tiring', 'Pedals are always too stiff', 'Standing people cannot reach pedals', 'It is fine — pedals suit standing work'], a: 0, why: 'Balancing on one leg for each press loads the supporting leg and the back and risks slips; foot controls belong at seated stations.' },
    { q: 'Which user sets the knee clearance under a work surface?', choices: ['The largest (95th-percentile man)', 'The smallest', 'The average', 'Whoever sits there first'], a: 0, why: 'Knee clearance is a clearance: if the largest fits, everyone fits.' },
    { q: 'True or false: a toe recess at the base of a machine only matters for comfort.', a: false, why: 'Without it the body stays 100 mm or more further back and every reach — and the trunk lean it causes — grows.' },
    { q: 'A sit–stand position uses…', choices: ['a high seat or perching stool at a standing work height', 'a normal chair at a normal desk', 'a kneeling stool', 'no seat at all'], a: 0, why: 'The perch carries part of the body weight while the feet stay down and the work stays at standing height.' }
  ],
  problems: [
    { q: 'Standing elbow height: men 1100 ± 50 mm, women 1015 ± 46 mm. By how much do they spread from the 5th-percentile woman to the 95th-percentile man (z = 1.645)?', answer: 243, unit: 'mm', tol: 0.01, steps: ['$\\Delta H = (1100 + 1.645 \\times 50) - (1015 - 1.645 \\times 46) = 1182.3 - 939.3 = 243$ mm.'] },
    { q: 'For the 95th-percentile man, popliteal height 491 mm, thigh clearance 190 mm, shoe 25 mm and a 20 mm margin: how high must the underside of a seated work surface be?', answer: 726, unit: 'mm', tol: 0.01, steps: ['$H_k = 491 + 25 + 190 + 20 = 726$ mm.'] }
  ],
  ranges: [
    { dim: 'Seat height at a seated machine workstation (adjustment)', range: [400, 510], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: popliteal height plus about 25 mm of shoe', why: 'Feet flat, thighs level, no pressure under the thighs.', limits: 'At a fixed work surface small users need a footrest.', setting: ['workshop', 'office'], src: 'ISO 14738; EN 1335-1' },
    { dim: 'Knee clearance: underside of a seated work surface', range: [720, null], unit: 'mm', who: '95th-percentile man: popliteal height + shoe + thigh thickness + margin', why: 'Thighs slide under the work surface; the body comes to the work.', limits: 'If the seat is raised above the user\'s legs, the clearance must rise with it.', setting: ['workshop', 'office'], src: 'ISO 14738 (method); representative data' },
    { dim: 'Knee space depth at knee level', range: [450, null], unit: 'mm', who: '95th-percentile man\'s buttock–knee length (about 660 mm) less the trunk, with clearance', why: 'The operator sits close enough to keep the arms in the forearm zone.', limits: 'Deeper at foot level (about 600 mm) so the legs can stretch.', setting: ['workshop', 'office'], src: 'ISO 14738 (method); representative data' },
    { dim: 'Knee and foot space depth at floor level', range: [600, null], unit: 'mm', who: 'Large users stretching their legs', why: 'Legs can move and stretch during long seated work.', limits: 'Machine frames, drawers and units under the work often break this.', setting: ['workshop', 'office'], src: 'ISO 14738 (method)' },
    { dim: 'Toe recess at the base of a standing workstation, depth', range: [100, 150], unit: 'mm', who: 'Toes in safety shoes of large users', why: 'The body can stand against the edge instead of 100 mm back from it.', limits: 'Needs about 120 mm of height or more for safety shoes.', setting: ['workshop'], src: 'ISO 14738 (principle); Pheasant and Haslegrave' },
    { dim: 'Travel of a height-adjustable standing work table (light work)', range: [250, 300], unit: 'mm', who: 'Standing elbow heights from the 5th-percentile woman to the 95th-percentile man (spread about 245 mm) plus the task band', why: 'Every operator can set the work 100–150 mm below the elbow.', limits: 'Precision and heavy work shift the whole range up or down.', setting: ['workshop'], src: 'ISO 14738 (method); representative data' },
    { dim: 'Standing eye height (for placing displays and sight lines)', range: [1410, 1780], unit: 'mm', who: '5th-percentile woman barefoot to 95th-percentile man in shoes', why: 'Displays and the point of operation can be seen by everyone without craning.', limits: 'Helmets, visors and safety glasses change the view; people lean.', setting: ['workshop', 'military'], src: 'This app\'s representative adult body data (Tools → Body sizes)' }
  ],
  applications: [
    'Height-adjustable assembly tables and operator platforms at presses and lines.',
    'Seated inspection and control stations with knee room, footrests and adjustable chairs.',
    'Perching stools and sit–stand positions at packaging and machine-tending jobs.',
    'Checking a layout in the [workstation fitter](#/tools/workstation/sitting).'
  ],
  sources: [
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'EN 1005-4, *Safety of machinery — Human physical performance — Part 4: Evaluation of working postures and movements in relation to machinery*.',
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'EN 1335-1, *Office furniture — Office work chair — Part 1: Dimensions*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — sitting and standing workstations.'
  ],
  sim: { id: 'mc-machine-fit', params: { posture: 'sit' }, title: 'An operator at a machine — sitting' }
},

{
  id: 'maintenance-ergonomics', parent: 'machine-design', title: 'Designing for maintenance', level: 2,
  short: 'Machines are serviced, adjusted, cleaned and repaired by people who must reach, see, lift and use tools inside them. Service points at a good height and outside danger zones, openings big enough for hands and tools, lifting points on heavy parts, good light and error-proof parts make maintenance safer, faster and more likely to be done at all.',
  keywords: ['maintenance ergonomics', 'maintainability', 'service point', 'MTTR', 'availability', 'lifting point', 'slide-out rail', 'accessibility', 'lockout', 'Machinery Directive 1.6', 'EN ISO 14122', 'guard rail', 'platform', 'fixed ladder', 'error-proofing', 'poka-yoke'],
  prereq: ['machine-ergonomics-principles', 'niosh-lifting-equation', 'access-openings'],
  related: ['handling-aids', 'lighting-levels', 'working-at-height', 'confined-spaces', 'human-error', 'guards-and-people', 'posture-assessment', 'motors:motor-brakes'],
  body: `
A machine spends most of its life running, but most of its injuries happen when it is not: during setting, cleaning, clearing jams, adjusting and repairing. Maintenance work is irregular, often urgent, done by people who meet that machine rarely, in awkward places, with parts that are heavy, hot, dirty or hidden. Whatever the designer made hard to reach will be done badly, done unsafely — or not done, until the machine breaks.

### What the law asks
The Machinery Directive (Annex I, section 1.6) asks that adjustment and maintenance points lie outside danger zones and can be used while the machine is stopped; that operating positions and servicing points can be reached safely; that every energy source can be isolated and locked; that operators need to intervene as little as possible; and that internal parts can be cleaned without entering them where that is possible. EN ISO 14122 covers the permanent means of access — platforms, walkways, stairs and ladders.

### Designing for the maintainer
| Need | Good design | Why |
|---|---|---|
| **Reach** | Service points at a good height, from the floor or a platform; openings for hands and tools ([[access-openings]]) | No climbing on the machine, no stretching into it |
| **Sight** | See the fastener, the filter, the gauge while working; lights inside cabinets | Work done by feel is done wrongly |
| **Handling** | Light parts, handles, slide-out rails, lifting eyes and hoist points on heavy parts | The reach into a machine halves what a person can lift safely |
| **Tools** | Few, standard tools; captive fasteners; quick-release panels | Fewer lost bolts, fewer trips to the store |
| **Error-proofing** | Parts that fit only the right way; colour and label coding; test points | Reassembly errors are a classic cause of failures after maintenance |
| **Isolation** | Lockable isolators for every energy source, reachable and labelled; stored energy released | Nobody works on a machine that can start |
| **Diagnosis** | Fault messages that name the part and the place | Less time searching, less opening of guards |

### Heights and reaches
Frequent service points — daily checks, filters, lubrication, adjustment — belong between about **750 mm and 1250 mm** above the standing surface: above the knuckles of the tallest users (so nobody stoops) and below the shoulders of the smallest (so nobody reaches overhead). Occasional points may go up to the 5th-percentile woman's grip reach, about 1770 mm, or down to kneeling height. Anything higher needs a platform with guard rails (at least 1100 mm high, with a toe board, in EN ISO 14122-3) — not a ladder leaned against the machine.

### Lifting parts out of a machine
The revised [[niosh-lifting-equation]] makes the problem plain: a load held 25 cm in front of the ankles at knuckle height has a recommended limit of 23 kg, but reaching 50 cm into a machine halves the horizontal multiplier, and a high or low starting point cuts it further. A **18 kg motor lifted from 140 cm, 50 cm in front of the ankles, has a lifting index of about 2** — well into the risky zone. A slide-out rail that brings it to the front at 100 cm cuts the index to about 1; a lifting eye and a hoist remove the manual lift. The Machinery Directive requires parts that cannot be moved by hand to have attachments for lifting gear.

### Why it pays: availability
Availability is the share of time a machine can run:

$$A = \\frac{\\mathrm{MTBF}}{\\mathrm{MTBF} + \\mathrm{MTTR}}$$

with MTBF the mean time between failures and MTTR the mean time to repair. Access, sight and handling are most of the MTTR: halving a 4-hour repair on a machine that fails every 400 hours raises availability from 99.0 % to 99.5 % — **half the downtime** — and good access also means preventive maintenance is actually done, which raises the MTBF.

### Settings
- **Workshop and industry:** machine tools and lines, process plant with valves and instruments at height; platforms and lifting points.
- **Military:** repair in the field, in the cold, in gloves or protective suits, often at night: large fasteners, few tools, line-replaceable units, labels readable by torchlight (MIL-STD-1472 has a whole section on maintainability).
- **Vehicles and mobile machines:** daily checks from the ground, engine covers that open wide, steps and handholds.
- **Field:** wind turbines, pumps and agricultural machines — mud, weather, heights, confined spaces and help far away ([[working-at-height]], [[confined-spaces]]).

In the simulation, lift a component out of a machine: change its depth, height and mass and watch the lifting index; then add a slide-out rail or a lifting eye.

> [!warn] Before any maintenance the machine must be isolated from all energy sources, locked and tagged out, and stored energy (springs, pressure, capacitors, raised loads) released. Design so that this is easy — it is then done.

> [!key] Design the maintainer's tasks as carefully as the operator's: reachable, visible, liftable, error-proof. Faster repairs, fewer injuries and maintenance that is actually done follow.
`,
  ideas: [
    'Many injuries at machines happen during maintenance, setting and cleaning, not production.',
    'Frequent service points belong between about 750 and 1250 mm; higher ones need a guarded platform.',
    'Reaching into a machine halves what can be lifted: heavy parts need rails, lifting eyes and hoist points.',
    'Access, sight and handling set most of the repair time: availability A = MTBF/(MTBF + MTTR).',
    'Isolation points for every energy source, error-proof parts and good diagnostics belong to ergonomic maintenance design.'
  ],
  pitfalls: [
    'Maintenance people are skilled, so they will cope — Skill does not lengthen arms or strengthen backs; awkward access leads to shortcuts, errors and skipped maintenance.',
    'A part under 23 kg can be lifted by anyone — 23 kg is the NIOSH limit for an ideal lift; reaching into a machine, high or low, cuts it to 10 kg or less.',
    'Ladders are enough for occasional access — Work from a ladder is one-handed and unstable; regular access at height needs a platform with guard rails.'
  ],
  formulas: [
    {
      name: 'Availability',
      expr: 'A = MTBF/(MTBF + MTTR)', tex: 'A = \\dfrac{\\mathrm{MTBF}}{\\mathrm{MTBF} + \\mathrm{MTTR}}',
      vars: {
        A: { name: 'availability (share of time ready to run)', q: 'ratio', unit: '%' },
        MTBF: { name: 'mean time between failures', q: 'time', unit: 'h', value: 400, tex: '\\mathrm{MTBF}' },
        MTTR: { name: 'mean time to repair', q: 'time', unit: 'h', value: 2, tex: '\\mathrm{MTTR}' }
      },
      note: 'MTTR includes getting access, finding the fault, the repair, reassembly and the test — ergonomics shortens all of them.',
      stories: { A: 'A machine fails on average every {MTBF} and a repair takes {MTTR}. What is its availability?', MTTR: 'A machine fails every {MTBF}. How short must repairs be for an availability of {A}?' }
    },
    {
      name: 'Lifting index of a part lifted out of a machine (NIOSH, occasional lift, good grip, no twist)',
      expr: 'LI = L/(23*(25/H)*(1 - 0.003*abs(V - 75))*(0.82 + 4.5/D))',
      tex: '\\mathrm{LI} = \\dfrac{L}{23 \\cdot \\frac{25}{H}\\left(1 - 0.003\\,|V - 75|\\right)\\left(0.82 + \\frac{4.5}{D}\\right)}',
      vars: {
        LI: { name: 'lifting index', q: false, unit: '', tex: '\\mathrm{LI}' },
        L: { name: 'mass of the part', q: false, unit: 'kg', value: 18 },
        H: { name: 'horizontal distance of the hands from the ankles (25–63 cm)', q: false, unit: 'cm', value: 50, min: 25, max: 63 },
        V: { name: 'height of the hands at the start (0–175 cm)', q: false, unit: 'cm', value: 140, min: 0, max: 175 },
        D: { name: 'vertical travel of the lift (25–175 cm)', q: false, unit: 'cm', value: 40, min: 25, max: 175 }
      },
      note: 'The revised NIOSH equation with the frequency, asymmetry and coupling multipliers equal to 1 (an occasional lift, no twisting, good handles). LI above 1 means a raised risk for some workers, above 2–3 for many. Units fixed: kg and cm.',
      stories: { LI: 'A {L} part is lifted from {V} with the hands {H} in front of the ankles and moved {D} vertically. What is the lifting index?', H: 'An {L} part is lifted from {V} through {D}. How far in front of the ankles may the hands be for a lifting index of {LI}?' }
    }
  ],
  examples: [
    {
      title: 'Taking a motor out of a machine',
      q: 'An 18 kg motor sits inside a machine frame. The fitter lifts it from 140 cm with the hands 50 cm in front of the ankles (reaching over the frame) and puts it on a trolley 100 cm high (D = 40 cm). Find the lifting index; then redesign with a slide-out rail that brings the motor to the front (H = 30 cm) at 100 cm, level with the trolley.',
      steps: [
        'As built: $HM = 25/50 = 0.50$, $VM = 1 - 0.003 \\times 65 = 0.805$, $DM = 0.82 + 4.5/40 = 0.93$; $RWL = 23 \\times 0.50 \\times 0.805 \\times 0.93 = 8.6$ kg; $LI = 18/8.6 = 2.1$.',
        'With the rail: $HM = 25/30 = 0.83$, $VM = 1 - 0.003 \\times 25 = 0.925$, the part slides across so $D < 25$ cm and $DM = 1$; $RWL = 23 \\times 0.83 \\times 0.925 = 17.7$ kg; $LI = 18/17.7 = 1.0$.',
        'With a lifting eye above the motor and a hoist, no manual lift at all.'
      ],
      a: 'LI ≈ 2.1 as built, ≈ 1.0 with a slide-out rail, 0 with a hoist.'
    },
    {
      title: 'What faster repairs are worth',
      q: 'A machine fails on average every 400 operating hours. Repairs take 4 h because the failing unit is buried; a redesign with a quick-release panel and a slide-out unit would take 2 h. Compare availability and downtime over 4000 hours.',
      steps: [
        'Before: $A = 400/(400 + 4) = 99.0\\,\\%$; after: $A = 400/(400 + 2) = 99.5\\,\\%$.',
        'About 10 failures in 4000 hours: 40 h of repairs before, 20 h after.',
        'The difference looks small as a percentage but it is half of all downtime — and on a line, every stopped hour stops the machines downstream too.'
      ],
      a: '99.0 % against 99.5 %: downtime halves from 40 h to 20 h.'
    }
  ],
  quiz: [
    { q: 'Where should service points that are used daily be?', choices: ['Between about 750 and 1250 mm, reachable from where the maintainer stands', 'As high as possible, out of the way', 'At floor level, where dirt collects', 'Inside the machine, behind the guards'], a: 0, why: 'Between the tallest users\' knuckles and the smallest users\' shoulders nobody stoops or reaches overhead.' },
    { q: 'An 18 kg part must be lifted from deep inside a machine. What is the best design answer?', choices: ['A slide-out rail or a lifting point for a hoist', 'Tell fitters to bend their knees', 'Two people always', 'Nothing — 18 kg is under 23 kg'], a: 0, why: 'Reaching into the machine cuts the recommended limit to below 10 kg; bring the part to the person or lift it mechanically.' },
    { q: 'Halving the mean time to repair of a machine with 99 % availability roughly…', choices: ['halves its downtime', 'doubles its availability', 'changes nothing', 'halves its failure rate'], a: 0, why: 'Availability goes from 99.0 % to 99.5 %: downtime falls from 1 % to 0.5 % of the time.' },
    { q: 'True or false: occasional access to a valve at 3 m can be done from a leaning ladder.', a: false, why: 'Regular access at height needs a platform with guard rails (EN ISO 14122); ladders are for getting up, not for working.' },
    { q: 'What must be possible before maintenance starts?', choices: ['Isolating and locking every energy source and releasing stored energy', 'Only pressing the stop button', 'Only opening the guard', 'Only switching the machine to manual'], a: 0, why: 'A stop button or an open guard does not remove energy; lockout does.' }
  ],
  problems: [
    { q: 'A machine fails every 250 h on average and each repair takes 5 h. What is its availability?', answer: 98.04, unit: '%', tol: 0.005, steps: ['$A = 250/(250 + 5) = 0.9804$, 98.0 %.'] },
    { q: 'A 12 kg filter is lifted from 60 cm with the hands 40 cm in front of the ankles and set down at 100 cm (D = 40 cm). With the other multipliers equal to 1, what is the lifting index?', answer: 0.94, unit: '', tol: 0.02, steps: ['$HM = 25/40 = 0.625$; $VM = 1 - 0.003 \\times 15 = 0.955$; $DM = 0.82 + 4.5/40 = 0.9325$.', '$RWL = 23 \\times 0.625 \\times 0.955 \\times 0.9325 = 12.8$ kg.', '$LI = 12/12.8 = 0.94$ — just under 1, acceptable for most workers.'] }
  ],
  ranges: [
    { dim: 'Height of frequently used service points', range: [750, 1250], unit: 'mm', who: 'Above the 95th-percentile man\'s knuckle height (about 850 mm in shoes) as far as practical, below the 5th-percentile woman\'s shoulder height (about 1260 mm in shoes)', why: 'Daily checks, filters and adjustments without stooping or reaching overhead.', limits: 'A compromise band: the tallest still bend a little at its bottom; heavy parts belong in its middle.', setting: ['workshop', 'vehicle', 'field'], src: 'This app\'s representative adult body data (Tools → Body sizes); EN 614-1' },
    { dim: 'Highest service point reached from the standing surface (occasional)', range: [null, 1770], unit: 'mm', who: '5th-percentile woman\'s vertical grip reach, flat-footed', why: 'Everyone reaches it without a step.', limits: 'Full stretch only, light work only; anything higher needs a platform.', setting: ['workshop', 'field'], src: 'This app\'s representative adult body data (Tools → Body sizes)' },
    { dim: 'Mass of a part lifted by hand from inside a machine', range: [null, 12], unit: 'kg', who: 'NIOSH recommended weight limit with the hands 40–50 cm in front of the ankles at a good height (about 10–12 kg)', why: 'Keeps the lifting index near 1 for most workers.', limits: 'Lower still for high or low starting points, twisting or frequent lifts; heavier parts need rails, lifting eyes and hoists.', setting: ['workshop', 'field', 'military'], src: 'Revised NIOSH lifting equation (Waters et al., 1993)' },
    { dim: 'Guard rail height on platforms and walkways', range: [1100, null], unit: 'mm', who: 'The centre of mass of tall adults', why: 'Stops a fall over the edge.', limits: 'Needs an intermediate rail and a toe board; national rules may differ.', setting: ['workshop', 'field'], src: 'EN ISO 14122-3' },
    { dim: 'Toe board height at platform edges', range: [100, null], unit: 'mm', who: 'Feet and tools near the edge', why: 'Stops feet slipping and tools falling on people below.', limits: 'Keep the gap between toe board and floor small.', setting: ['workshop', 'field'], src: 'EN ISO 14122-3' },
    { dim: 'Rung spacing of fixed ladders', range: [225, 300], unit: 'mm', who: 'Step heights comfortable for small and tall climbers', why: 'A regular, easily climbed rhythm.', limits: 'Keep it uniform; fall protection is needed above a certain height.', setting: ['workshop', 'field'], src: 'EN ISO 14122-4' },
    { dim: 'Light at a service point', range: [300, 500], unit: 'lx', who: 'Older maintainers need the upper end', why: 'Fasteners, markings and wear can be seen.', limits: 'Inside cabinets use fixed or portable task lights; avoid glare off polished parts.', setting: ['workshop'], src: 'EN 12464-1 (typical task values)' }
  ],
  applications: [
    'Slide-out drawers for pumps, motors and filters; hinged panels with gas struts.',
    'Lifting eyes and hoist beams over heavy components; see the [NIOSH lifting tool](#/tools/lifting/niosh).',
    'Lockable isolators grouped and labelled at the machine; see [[motors:emergency-stop|emergency stop and safe torque off]].',
    'Platforms with guard rails around process plant and large machines.'
  ],
  sources: [
    'Directive 2006/42/EC, Annex I, 1.1.5 (handling) and 1.6 (maintenance).',
    'EN ISO 14122-1 to -4, *Safety of machinery — Permanent means of access to machinery* (platforms, walkways, stairs, guard rails, fixed ladders).',
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine, "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics* 36 (1993); NIOSH *Applications Manual* (1994).',
    'MIL-STD-1472, *Human Engineering* — the maintainability requirements.',
    'EN 614-1, *Safety of machinery — Ergonomic design principles*.'
  ],
  sim: 'mc-maintenance'
},

{
  id: 'guards-and-people', parent: 'machine-design', title: 'Guards that people do not defeat', level: 2,
  short: 'A guard that slows the job, blocks the view or has no way to set the machine up will be bridged, propped open or removed — surveys find this for about one protective device in three. Designing guards around the task — the right type for how often people need access, modes for setting, visibility, easy handling and short waits — keeps them on.',
  keywords: ['guard defeat', 'bypassing interlocks', 'manipulation of protective devices', 'ISO 14119', 'ISO 14120', 'interlocked guard', 'guard locking', 'light curtain', 'two-hand control', 'ISO 13851', 'rundown time', 'setting mode', 'hold-to-run', 'enabling device', 'motivation to defeat'],
  prereq: ['safety-distances', 'human-error', 'machine-ergonomics-principles'],
  related: ['maintenance-ergonomics', 'operator-positions', 'psychosocial-factors', 'participatory-ergonomics', 'motors:emergency-stop', 'motors:motor-brakes', 'pneumatics:two-hand-control', 'pneumatics:safety-functions', 'hydraulics:hydraulic-safety'],
  body: `
Every experienced safety engineer has seen it: the interlock switch taped down, the spare actuator hanging on a string, the light curtain turned aside, the guard leaning against the wall. A survey by the German statutory accident insurance (HVBG, 2006) estimated that **about one protective device in three** on machines was being defeated, at least from time to time — and that the usual reason was not recklessness but the job: defeating the guard made the work quicker, easier or possible at all. A guard is a piece of equipment people must use hundreds of times a shift. **If it fights the task, the task wins.**

### Why people defeat guards
- **Access is needed often** — loading, unloading, clearing jams, measuring — and each access costs opening, waiting, closing and restarting.
- **Waiting for rundown**: a guard locked until a heavy spindle stops can cost tens of seconds each time.
- **No safe way to set up**: without a setting mode the only way to watch a slow movement is with the guard open.
- **The guard hides the work**: solid panels, dirty or scratched windows, bright mesh that dazzles.
- **Heavy or awkward guards**: lids with no counterbalance, handles in the wrong place, bolts that must come out.
- **Nuisance trips**: interlocks that stop the machine for no reason.
- **Pay and pressure**: piece rates and output targets, and managers who look away.

ISO 14119, the standard for interlocking devices, asks designers to **minimise the motivation to defeat them**, and to make defeat hard — hidden or coded actuators, switches that cannot be operated with a simple tool.

### Choose the guard for how often people need access
| Access needed | Suitable safeguard | Ergonomic points |
|---|---|---|
| Rarely (maintenance) | Fixed guard, opened only with a tool | Captive fasteners; hinges and struts; not for anything done daily |
| Often (every hour or shift) | Movable interlocked guard, with guard locking if the hazard runs down slowly | Light, counterbalanced, handle at a good height; short rundown; a clear view |
| Every cycle (loading) | Light curtain or scanner, at its ISO 13855 distance | The distance adds to every reach — keep stopping times short |
| Hands must be kept away during the stroke | Two-hand control (ISO 13851) | Both buttons within 0.5 s, at least 260 mm apart, at a comfortable height |
| Setting and fault finding | A setting mode: reduced speed, hold-to-run or an enabling device | Makes the safe way of watching a movement the easy way |

### Make the safe way the easy way
- **Short waits.** A motor brake or a lighter spindle cuts the rundown: the time to stop is $t = J\\,\\omega/T_b$ — inertia times speed over braking torque ([[motors:motor-brakes|motor brakes]]).
- **Short reaches.** A light curtain's distance grows with the stopping time ($S = K\\,T + C$, see [[safety-distances]]); a slow machine puts its curtain far away and its operator at full stretch — and the curtain gets moved closer.
- **Visibility.** Clear polycarbonate where the work must be seen; mesh painted dark so the eye looks through it.
- **Handling.** Guards that open with one hand, balanced by struts, handles between the tallest users' knuckles and the smallest users' elbows (about 850–1000 mm).
- **Involve operators.** Try the guard on the real task with the people who will use it ([[participatory-ergonomics]]); find what they do when it is inconvenient.

### Settings
- **Workshop:** lathe chuck guards, drill guards and grinder visors — often removed "just for this job".
- **Industry:** packaging and bottling lines with frequent jams; the cost of each stop drives defeat.
- **Field:** unguarded power take-off shafts on tractors remain a notorious cause of entanglement; guards that are damaged or awkward to refit are left off.
- **Civil:** gym machines, garage doors and garden machinery — users with no training at all.
- **Military and vehicles:** fan and belt guards removed for field repairs and never refitted.

In the simulation, choose how the operator gets at the work — no guard, a fixed guard, an interlocked door or a light curtain — and see what each costs per shift in time, and in reach for the smallest operator; then lengthen the stopping time and watch the curtain move out of reach.

> [!warn] A defeated safeguard is worse than an obvious hazard: people trust the machine to be safe. Never tolerate bypassed interlocks; find out why they were bypassed and redesign.

> [!key] A guard is a tool the operator uses hundreds of times a day. Design it for the task — right type for the access frequency, a setting mode, short waits, a clear view — and it stays on.
`,
  ideas: [
    'About one protective device in three has been found defeated at least temporarily; the usual motive is to make the job quicker or possible.',
    'Choose the safeguard by how often access is needed: fixed guards for rare access, interlocked guards for frequent access, protective devices for every cycle.',
    'Provide a safe setting mode (reduced speed, hold-to-run, enabling device) so nobody must watch a movement with the guard open.',
    'Waits and reaches matter: rundown time t = Jω/T and light-curtain distance S = K·T + C both grow with stopping time.',
    'Guards must be light, visible through, easy to handle and tried with the real operators (ISO 14119 asks designers to minimise the motivation to defeat).'
  ],
  pitfalls: [
    'People defeat guards because they are careless — Most defeat to make the job quicker or possible; the design gave them the reason.',
    'A stronger interlock switch solves the problem — Harder defeat without removing the motive moves the problem; remove the motive first.',
    'A light curtain is always the most convenient guard — Its distance grows with the stopping time; a slow machine puts the curtain beyond comfortable reach.'
  ],
  formulas: [
    {
      name: 'Share of the shift spent getting past the guard',
      expr: 'f = N*ta/Ts', tex: 'f = \\dfrac{N\\,t_a}{T_s}',
      vars: {
        f: { name: 'share of the shift lost', q: 'ratio', unit: '%' },
        N: { name: 'accesses per shift', q: 'count', value: 120, int: true },
        ta: { name: 'time per access (open, wait, close, restart)', q: 'time', unit: 's', value: 20, tex: 't_a' },
        Ts: { name: 'length of the shift', q: 'time', unit: 'h', value: 8, tex: 'T_s' }
      },
      note: 'The time a safeguard costs the operator: the larger it is, the stronger the pressure to defeat it.',
      stories: { f: 'An operator opens an interlocked door {N} times per shift of {Ts}; each access costs {ta}. What share of the shift is spent on the guard?', ta: 'Over a {Ts} shift with {N} accesses, how long may each access take for the guard to cost only {f} of the time?' }
    },
    {
      name: 'Rundown time of a braked machine',
      expr: 't = J*w/Tb', tex: 't = \\dfrac{J\\,\\omega}{T_b}',
      vars: {
        t: { name: 'time to stop', q: 'time', unit: 's' },
        J: { name: 'moment of inertia of the moving parts', q: 'inertia', unit: 'kg·m²', value: 0.5 },
        w: { name: 'running speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega' },
        Tb: { name: 'braking torque (brake plus friction)', q: 'torque', unit: 'N·m', value: 20, tex: 'T_b' }
      },
      note: 'Constant braking torque. The time an operator waits at a locked guard, and the time that sets a light curtain\'s distance.',
      stories: { t: 'A spindle with inertia {J} runs at {w}. A brake gives {Tb}. How long does it take to stop?', Tb: 'A spindle with inertia {J} at {w} must stop within {t}. What braking torque is needed?' }
    }
  ],
  examples: [
    {
      title: 'An interlocked door or a light curtain?',
      q: 'An operator loads a machine 120 times per 8-hour shift. With an interlocked door each access takes 20 s (open, wait for rundown, close, restart); with a light curtain about 1 s is lost in reaching further. Compare.',
      steps: [
        'Door: $f = 120 \\times 20\\,\\mathrm{s} / 28800\\,\\mathrm{s} = 8.3\\,\\%$ — 40 minutes a shift.',
        'Curtain: $f = 120 \\times 1 / 28800 = 0.4\\,\\%$ — 2 minutes a shift.',
        'The door invites propping open; the curtain suits every-cycle access, provided the stopping time is short enough to keep it within reach (at 0.2 s and 14 mm resolution it stands 400 mm from the hazard).'
      ],
      a: '40 minutes against 2 minutes per shift: for every-cycle access a well-placed light curtain is the guard that stays in use.'
    },
    {
      title: 'Waiting for a spindle',
      q: 'A spindle (0.5 kg·m²) runs at 1500 rpm. Friction alone gives 2 N·m of braking; a motor brake gives 20 N·m. How long does the operator wait at a locked guard?',
      steps: [
        '$\\omega = 1500 \\times 2\\pi/60 = 157$ rad/s.',
        'Friction only: $t = 0.5 \\times 157/2 = 39$ s. With the brake: $t = 0.5 \\times 157/20 = 3.9$ s.',
        '39 s per access, many times a shift, is exactly the wait that gets interlocks defeated.'
      ],
      a: 'About 39 s without a brake, about 4 s with it.'
    }
  ],
  quiz: [
    { q: 'Why do most operators defeat guards?', choices: ['To make the job quicker, easier or possible at all', 'Out of malice', 'Because guards are illegal', 'Because they do not know the guard is there'], a: 0, why: 'Surveys find the motive is usually the task: frequent access, waiting, poor view, no setting mode.' },
    { q: 'Access to the tooling is needed every cycle. Which safeguard suits best?', choices: ['A light curtain or other protective device at its ISO 13855 distance', 'A fixed guard held by bolts', 'No guard, with a warning sign', 'A padlocked door'], a: 0, why: 'Fixed guards are for rare access; every-cycle access needs a device that does not slow the operator.' },
    { q: 'An operator must watch a slow movement to set a machine up. What should the design provide?', choices: ['A setting mode with reduced speed and hold-to-run or an enabling device', 'A key to bypass the interlock', 'Nothing — setting is done with the guard open', 'A camera only'], a: 0, why: 'Without a safe setting mode, the only way to see is to defeat the guard.' },
    { q: 'True or false: two-hand controls can be placed side by side 100 mm apart for convenience.', a: false, why: 'ISO 13851 requires a separation (at least 260 mm) so that one hand, or a hand and an elbow, cannot operate both.' },
    { q: 'A machine\'s braking torque is halved. What happens to the operator\'s wait at a locked guard?', choices: ['It doubles (t = Jω/T)', 'It halves', 'It stays the same', 'It quadruples'], a: 0, why: 'Stopping time is inversely proportional to the braking torque.' }
  ],
  problems: [
    { q: 'An operator opens an interlocked guard 60 times per 8-hour shift and each access costs 30 s. What share of the shift is lost?', answer: 6.25, unit: '%', tol: 0.01, steps: ['$f = 60 \\times 30 / 28800 = 0.0625$, 6.25 % — 30 minutes.'] },
    { q: 'A rotor of 2 kg·m² runs at 900 rpm and is stopped by a 15 N·m brake. How long does it take to stop?', answer: 12.6, unit: 's', tol: 0.01, steps: ['$\\omega = 900 \\times 2\\pi/60 = 94.2$ rad/s.', '$t = 2 \\times 94.2/15 = 12.6$ s.'] }
  ],
  ranges: [
    { dim: 'Separation of the two buttons of a two-hand control', range: [260, null], unit: 'mm', who: 'Large hands and forearms that might span both', why: 'Both hands are needed; one hand cannot operate both buttons.', limits: 'Shrouds and larger spacing are needed against operation with an elbow or forearm.', setting: ['workshop'], src: 'ISO 13851' },
    { dim: 'Time window for pressing both buttons of a two-hand control', range: [null, 0.5], unit: 's', who: 'Operators pressing both buttons together', why: 'Stops one button being held down permanently (tied or taped).', limits: 'Both must be released and pressed again for each new cycle.', setting: ['workshop'], src: 'ISO 13851' },
    { dim: 'Handle height on guard doors and lids', range: [850, 1000], unit: 'mm', who: 'Above the 95th-percentile man\'s knuckle height and below the 5th-percentile woman\'s elbow height (in shoes)', why: 'Everyone opens the guard without stooping or lifting the arm.', limits: 'Large lids may need two handles or a strut; check opening forces with the weaker users.', setting: ['workshop'], src: 'This app\'s representative adult body data (Tools → Body sizes)' },
    { dim: 'Detection capability of a light curtain protecting hands', range: [14, 40], unit: 'mm', who: '14 mm detects a finger, up to 40 mm a hand', why: 'A finer curtain may stand closer to the hazard (smaller C in S = K·T + C).', limits: 'Coarser curtains need more distance; above 40 mm the curtain detects the body or arm, not the hand.', setting: ['workshop'], src: 'ISO 13855' },
    { dim: 'Rundown wait at a locked guard (design aim)', range: 'a few seconds; longer waits invite defeat', unit: '', who: 'Operators who need frequent access', why: 'Short waits remove the reason to prop guards open.', limits: 'Add a brake or reduce inertia; heavy rotors may need guard locking with a standstill monitor.', setting: ['workshop'], src: 'ISO 14119 (minimise motivation to defeat)' }
  ],
  applications: [
    'Interlocked, counterbalanced guard doors with windows on machine tools.',
    'Light curtains on press brakes and packaging machines, placed by stopping time; see [[motors:optical-sensors|optical sensors]].',
    'Setting modes with hold-to-run and enabling devices on robots and automated lines.',
    'Two-hand controls on presses; see [[pneumatics:two-hand-control|two-hand control]] and [[pneumatics:safety-functions|safety functions]].'
  ],
  history: 'The German accident insurers\' 2006 report on the manipulation of protective devices made the scale of the problem visible and led to requirements in ISO 14119 (2013) that designers reduce the motivation to defeat interlocks, not only its possibility.',
  sources: [
    'ISO 14119, *Safety of machinery — Interlocking devices associated with guards — Principles for design and selection* (including the motivation to defeat).',
    'ISO 14120, *Safety of machinery — Guards — General requirements for the design and construction of fixed and movable guards*.',
    'ISO 13851, *Safety of machinery — Two-hand control devices — Principles for design and selection*.',
    'ISO 13855, *Safety of machinery — Positioning of safeguards with respect to the approach speeds of parts of the human body*.',
    'HVBG (now DGUV), report on the manipulation of protective devices on machines, 2006.'
  ],
  sim: 'mc-guard-access'
},

{
  id: 'controls-design', parent: 'controls-displays', title: 'Designing controls', level: 2,
  short: 'Push buttons, switches, knobs, levers, handwheels, joysticks and pedals each suit a job. Good controls are the right type, big enough for the hand or glove that uses them, with resistance and travel people can feel, spaced and guarded against accidental use, coded so they cannot be confused, and placed where the hand expects them (ISO 9355-3, MIL-STD-1472).',
  keywords: ['controls', 'control actuators', 'ISO 9355-3', 'EN 894-3', 'push button', 'toggle switch', 'rotary knob', 'selector switch', 'lever', 'handwheel', 'joystick', 'pedal', 'emergency stop', 'ISO 13850', 'control coding', 'shape coding', 'control spacing', 'accidental activation', 'control force', 'gloves'],
  prereq: ['hand-foot-head', 'strength-and-force', 'machine-ergonomics-principles'],
  related: ['displays-design', 'stereotypes-compatibility', 'fitts-law', 'hmi-screens', 'human-error', 'accessible-design', 'crew-stations', 'driver-workspace', 'motors:emergency-stop', 'electronics:switches'],
  body: `
A control is where a person's intention becomes the machine's action — and where a slip becomes an accident. In 1947 Paul Fitts and Richard Jones analysed 460 "pilot errors" in operating aircraft controls; the largest group was simply **using the wrong control** — the flap lever for the landing-gear lever, one throttle for another — because the controls looked and felt alike and sat in different places in different aircraft. The fix was design, not training: controls shaped like what they do, standard positions, guards on critical ones. The same rules apply to every machine.

### Choose the type for the job
| Job | Control | Why |
|---|---|---|
| Start, stop, select one action | Push button | Quick, small, discrete |
| Two or three states that must be visible | Toggle or rocker switch | The position shows the state |
| Several discrete settings | Rotary selector with detents | Position readable, positive steps |
| Fine continuous setting | Knob (small for fingers, larger for the hand) | Precise, low force |
| Large travel or force, continuous | Handwheel, crank | Many turns, torque through the rim |
| Force, or position that must be seen and felt | Lever | Large force, visible position |
| Two axes at once | Joystick | Cranes, excavators, positioning |
| Force or on/off when the hands are busy | Pedal (seated operators) | Frees the hands |
| Stopping in an emergency | Emergency stop (ISO 13850) | Red mushroom on a yellow ground, latching, reachable from every operating position |

### Size, force and travel
Typical design ranges from human-engineering handbooks (rounded; check ISO 9355-3, MIL-STD-1472 or EN 1005-3 for a real design):

| Control | Size | Resistance | Travel |
|---|---|---|---|
| Push button, fingertip | about 10–25 mm across; larger for gloves, thumb or palm | about 3–11 N | about 2–6 mm |
| Spacing of push buttons | at least about 13 mm edge to edge bare-handed; about 25 mm with gloves | — | — |
| Knob, fine adjustment | about 10–25 mm, fingertip grip | low torque | as needed |
| Knob, whole hand | about 35–75 mm | torque grows with diameter | — |
| Pedal | wide enough for a boot | about 45 N at least if the foot rests on it; up to about 90 N by the ankle; several hundred newtons with the whole leg | about 13–65 mm by the ankle; more with the leg |

Resistance must not be too low either: it gives the feel of a control, steadies the hand and prevents activation by a brushing sleeve or a resting foot. Forces are set by the **weaker** users and by how often the control is used: EN 1005-3 lowers the limits for frequent operation and for the wider population. The torque on a knob is $T = F\\,d/2$: doubling the diameter halves the finger force.

### Against accidental activation
Recess or shroud the control, space it, give it resistance, a cover or a guard, require a movement in two directions (lift and turn), or a sequence. In the simulation the finger lands with a [[?gaussian]] scatter around the button it aims at: widen the gap, change the glove or add vibration, and read the [[?probability]] of pressing the neighbour.

### Coding: make confusion impossible
- **Shape** — felt without looking; aviation rules now fix knob shapes for the landing gear and the flaps (14 CFR 25.781).
- **Size** — a few clearly different sizes, not many similar ones.
- **Colour** — red for emergency stop; stop and start colours follow IEC 60204-1 and IEC 60073; never colour alone (about 8 % of men have a red–green colour-vision deficiency).
- **Location** — the same place on every machine of a family; grouped by function and sequence.
- **Label** — short, next to the control, readable from the operating position.
- **Mode of operation** — push for one thing, turn for another.

Use several codes at once (redundancy): shape plus colour plus label.

### Settings
- **Workshop and industry:** gloves, oil and dirt; big, well-spaced controls; emergency stops within reach of every position.
- **Vehicles and mobile machines:** vibration spreads the hand's aim; controls grouped by function, operable without looking; pedals and joysticks follow common patterns ([[driver-workspace]]).
- **Military:** cold-weather, CBRN and flight gloves, night use and stress: larger controls, larger spacing, shape coding, guards on critical switches ([[crew-stations]]).
- **Civil and public:** older users and people with weak grip or limited reach: operable parts within about 380–1220 mm of the floor and needing no more than about 22 N, without tight grasping or twisting of the wrist (2010 ADA Standards) ([[accessible-design]]).

> [!warn] An emergency stop must be red on a yellow background, clearly visible, reachable from every operating and maintenance position, latching when pressed and reset only by a deliberate action (ISO 13850). It supplements safeguarding; it does not replace it.

> [!key] Right type, right size for the gloved hand, felt resistance, safe spacing, redundant coding, expected place. Most "operator errors" with controls are designed in.
`,
  ideas: [
    'Match the control to the job: buttons for discrete actions, knobs for fine setting, levers and handwheels for force, pedals when the hands are busy.',
    'Size, resistance and travel have ranges: e.g. fingertip buttons about 10–25 mm, 3–11 N, 2–6 mm travel.',
    'Spacing, recesses, guards and resistance prevent accidental activation; gloves and vibration need more spacing.',
    'Code controls redundantly — shape, size, colour, location, label, mode — so they cannot be confused.',
    'The emergency stop is red on yellow, latching, and reachable from every position (ISO 13850).'
  ],
  pitfalls: [
    'Lighter controls are always better — Too little resistance gives no feel and lets controls be knocked; resistance belongs in a range.',
    'Colour is enough to tell controls apart — About 8 % of men cannot tell red from green reliably, and colour is invisible in the dark and to touch; use shape, position and labels too.',
    'Operators who press the wrong control need more training — Confusable, close or badly placed controls cause errors in the best-trained people.'
  ],
  formulas: [
    {
      name: 'Chance of pressing the neighbouring button',
      expr: 'P = 2*(1 - ncdf((W/2 + g - f/2)/s))', tex: 'P = 2\\left[1 - \\Phi\\!\\left(\\dfrac{W/2 + g - f/2}{\\sigma}\\right)\\right]',
      vars: {
        P: { name: 'probability of touching a neighbour (either side)', q: 'ratio', unit: '%' },
        W: { name: 'button width', q: 'length', unit: 'mm', value: 12 },
        g: { name: 'gap between buttons (edge to edge)', q: 'length', unit: 'mm', value: 8 },
        f: { name: 'width of the finger\'s contact (bare about 10–12 mm, gloved more)', q: 'length', unit: 'mm', value: 12 },
        s: { name: 'scatter of the aim (standard deviation)', q: 'length', unit: 'mm', value: 2.5, tex: '\\sigma' }
      },
      note: 'A simple model: the finger lands with a normal scatter σ around the centre of the button it aims at. The scatter grows with haste, gloves and vibration; representative values, not standard data.',
      stories: { P: 'Buttons {W} wide stand {g} apart. A finger contact {f} wide lands with a scatter of {s}. How often is a neighbour touched?', g: 'Buttons are {W} wide, the finger contact {f}, the scatter {s}. What gap keeps the chance of touching a neighbour to {P}?' }
    },
    {
      name: 'Torque on a knob',
      expr: 'T = F*d/2', tex: 'T = \\dfrac{F\\,d}{2}',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        F: { name: 'tangential force of the fingers', q: 'force', unit: 'N', value: 10 },
        d: { name: 'knob diameter', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'For a given torque, a larger knob needs a smaller grip force — important for older users, gloves and wet hands.',
      stories: { F: 'A valve knob needs {T} to turn and is {d} across. What force must the fingers apply at the rim?', d: 'Users can apply {F} at the rim. How large must the knob be to give {T}?' }
    }
  ],
  examples: [
    {
      title: 'Button spacing, bare-handed and gloved',
      q: 'Buttons are 12 mm wide. A bare finger has a contact about 10 mm wide and lands with a scatter of 2.5 mm; in heavy gloves the contact is about 18 mm and the scatter 3.5 mm. What edge-to-edge gap keeps the chance of touching a neighbour to 0.1 %?',
      steps: [
        'For $P = 0.1\\,\\%$ on both sides together, each side may take 0.05 %: $\\Phi(z) = 0.9995$, $z = 3.29$.',
        'Bare: $W/2 + g - f/2 = z\\sigma$ gives $g = 3.29 \\times 2.5 + 5 - 6 = 7.2$ mm.',
        'Gloved: $g = 3.29 \\times 3.5 + 9 - 6 = 14.5$ mm.',
        'Handbooks recommend about 13 mm bare and about 25 mm with gloves — the extra covers haste, vibration and poor light.'
      ],
      a: 'About 7 mm bare and 15 mm gloved in this model; design for about 13 mm and 25 mm.'
    },
    {
      title: 'A stiff valve knob',
      q: 'A needle valve needs 0.3 N·m to turn. What rim force do knobs of 20 mm and 60 mm diameter need?',
      steps: [
        '20 mm: $F = 2T/d = 2 \\times 0.3/0.020 = 30$ N — hard for a fingertip grip, impossible for many older users.',
        '60 mm: $F = 2 \\times 0.3/0.060 = 10$ N — easy.',
        'Choose the knob diameter from the torque, not from the space left on the panel.'
      ],
      a: '30 N with a 20 mm knob, 10 N with a 60 mm knob.'
    }
  ],
  quiz: [
    { q: 'Fitts and Jones (1947) analysed pilots\' errors with controls. What was the largest group?', choices: ['Using the wrong control — confusing one for another', 'Pressing too hard', 'Forgetting the checklist', 'Deliberate violations'], a: 0, why: 'Controls that looked and felt alike, in different places in different aircraft, were confused; shape coding and standard layouts followed.' },
    { q: 'A setting must be adjusted finely and continuously. Which control suits it?', choices: ['A knob', 'A push button', 'A toggle switch', 'An emergency stop'], a: 0, why: 'Knobs give fine continuous adjustment at low force; buttons and toggles are discrete.' },
    { q: 'Why should a pedal on which the foot rests have a resistance of at least about 45 N?', choices: ['So the weight of a resting foot does not operate it', 'To exercise the leg', 'To save energy', 'It should not — lighter is better'], a: 0, why: 'A resting foot presses with a good part of the leg\'s weight; the pedal must not respond to it.' },
    { q: 'True or false: coding emergency controls by colour alone is sufficient.', a: false, why: 'Colour fails in the dark, to touch, and for people with colour-vision deficiency; add shape, position and labels.' },
    { q: 'Gloves and vibration make operators miss their aim more. What should change?', choices: ['Larger controls and wider spacing', 'Smaller controls', 'Lighter resistance', 'Nothing'], a: 0, why: 'A wider contact and a larger scatter both raise the chance of hitting a neighbour; spacing and size must grow.' }
  ],
  problems: [
    { q: 'A knob 50 mm across must deliver 0.25 N·m. What tangential finger force is needed?', answer: 10, unit: 'N', tol: 0.01, steps: ['$F = 2T/d = 2 \\times 0.25/0.050 = 10$ N.'] },
    { q: 'Buttons 12 mm wide stand 8 mm apart; the finger contact is 12 mm and the scatter 2.5 mm. What is the chance of touching a neighbour?', answer: 0.137, unit: '%', tol: 0.05, steps: ['$z = (6 + 8 - 6)/2.5 = 3.2$; $1 - \\Phi(3.2) = 0.00069$.', 'Both sides: $P = 2 \\times 0.00069 = 0.0014$, about 0.14 %.'] }
  ],
  ranges: [
    { dim: 'Push button diameter, fingertip operation', range: [10, 25], unit: 'mm', who: 'Fingertips from small bare to large; larger for gloves, thumb or palm', why: 'Found and pressed quickly without slipping off.', limits: 'Gloves, vibration and emergency use need larger buttons.', setting: ['workshop', 'vehicle', 'military'], src: 'MIL-STD-1472; ISO 9355-3 (typical values)' },
    { dim: 'Push button resistance', range: [3, 11], unit: 'N', who: 'Fingertip force of the weaker users, repeated', why: 'A felt, positive press that a brushing sleeve does not trigger.', limits: 'Frequent operation needs the low end; gloves may need more feedback (a click, a light).', setting: ['workshop', 'vehicle'], src: 'MIL-STD-1472; Sanders and McCormick (typical values)' },
    { dim: 'Push button travel', range: [2, 6], unit: 'mm', who: 'Fingertip operation', why: 'Enough travel to feel the press, not so much that the finger tires.', limits: 'Palm-operated buttons and emergency stops travel further.', setting: ['workshop', 'vehicle'], src: 'MIL-STD-1472 (typical values)' },
    { dim: 'Spacing of push buttons, edge to edge', range: [13, 25], unit: 'mm', who: 'About 13 mm for bare fingers, about 25 mm for gloved hands', why: 'Keeps the chance of pressing a neighbour small.', limits: 'Vibration, haste and poor light need the upper end or more; recesses and shrouds help too.', setting: ['workshop', 'vehicle', 'military'], src: 'MIL-STD-1472; ISO 9355-3 (typical values)' },
    { dim: 'Pedal resistance (foot resting on the pedal)', range: '45–90 N by the ankle; several hundred newtons with the whole leg', unit: '', who: 'The weight of a resting foot at the low end; the weaker users\' ankle strength at the top', why: 'No accidental activation, no tiring of the ankle.', limits: 'Seated operators only; frequent pedal use needs the low end.', setting: ['workshop', 'vehicle'], src: 'MIL-STD-1472; Sanders and McCormick (typical values)' },
    { dim: 'Height of operable parts in public places', range: [380, 1220], unit: 'mm', who: 'Wheelchair users\' forward reach (15 to 48 in)', why: 'Everyone, seated or standing, reaches the control.', limits: 'Other countries\' rules differ (ISO 21542 and national codes); obstructions shorten reach.', setting: ['civil'], src: '2010 ADA Standards for Accessible Design' },
    { dim: 'Force to operate public controls', range: [null, 22], unit: 'N', who: 'People with weak grip, arthritis or limited strength (5 lbf)', why: 'Operable with a closed fist, without pinching or twisting.', limits: 'Industrial controls may need more resistance to avoid accidental use.', setting: ['civil'], src: '2010 ADA Standards for Accessible Design' }
  ],
  applications: [
    'Control panels of machine tools and presses, with emergency stops at every operating position.',
    'Cab controls of cranes, excavators and tractors: joysticks and pedals in standard patterns.',
    'Cockpit controls shaped by function (landing gear, flaps) since the late 1940s.',
    'Accessible lift buttons, door openers and ticket machines.'
  ],
  history: 'Paul Fitts and Richard Jones\'s 1947 analysis of 460 "pilot-error" experiences with aircraft controls, and Alphonse Chapanis\'s shape-coded knobs for landing gear and flaps, founded the study of controls. The practice became standard in military human-engineering documents (MIL-STD-1472 from 1968) and in civil standards such as EN 894-3 and ISO 9355-3.',
  sources: [
    'ISO 9355-3, *Ergonomic requirements for the design of displays and control actuators — Part 3: Control actuators*.',
    'EN 1005-3, *Safety of machinery — Human physical performance — Part 3: Recommended force limits for machinery operation*.',
    'ISO 13850, *Safety of machinery — Emergency stop function — Principles for design*.',
    'MIL-STD-1472, *Human Engineering* — controls: sizes, resistances, displacements and spacing.',
    'P. M. Fitts and R. E. Jones, *Analysis of factors contributing to 460 "pilot-error" experiences in operating aircraft controls*, US Army Air Forces report, 1947.',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design* — the chapter on controls.'
  ],
  sim: 'mc-control-panel'
},

{
  id: 'displays-design', parent: 'controls-displays', title: 'Designing displays', level: 2,
  short: 'A display is the machine talking to the operator. Choose the type for the question (exact value, is it normal, which way is it going), put it in the field of view — about 0 to 30° below the horizontal line of sight — and make its characters big enough for the distance: at least 16 minutes of arc, preferably 20–22 (ISO 9241-303), in good contrast, never relying on colour alone.',
  keywords: ['displays', 'ISO 9355-2', 'ISO 9241-303', 'visual angle', 'character height', 'arcminute', 'line of sight', 'viewing angle', 'viewing distance', 'analogue display', 'digital display', 'check reading', 'pointer', 'scale', 'contrast', 'colour coding', 'IEC 60073', 'legibility'],
  prereq: ['perception-attention', 'glare-colour', 'monitor-placement'],
  related: ['controls-design', 'stereotypes-compatibility', 'alarms-warnings', 'hmi-screens', 'information-design', 'visual-ergonomics', 'control-rooms', 'cockpit-ergonomics', 'physics:the-eye', 'physics:color-vision', 'medicine:vision'],
  body: `
Every display answers a question the operator asks — *what is the value? is it normal? which way is it going? what state is the machine in?* — and the right display is the one that answers that question fastest and with the fewest mistakes. Then it must be **where the eyes are**, **big enough** for the distance and **clear** in the light where it is used.

### Choose the display for the question
| Question | Best display | Why |
|---|---|---|
| Exact value (a count, a setpoint) | Digital readout | No interpolation, no parallax |
| Is it normal? (check reading) | Analogue pointer with coloured zones | Position is seen at a glance, without reading numbers |
| Which way, how fast is it changing? | Moving pointer or trend graph | Motion and slope are perceived directly |
| Setting a value by hand | Analogue scale next to its control | The control's movement and the pointer's agree |
| On/off, a state | Indicator light or symbol | Binary, quick |
| Where is the fault? | Mimic diagram of the plant or machine | Spatial layout matches the machine |
| Something is wrong now | Alarm, auditory plus visual ([[alarms-warnings]]) | Captures attention |

Digital numbers are poor for trends — a changing number is hard to read and its direction invisible — and a moving scale behind a fixed pointer confuses the direction of change. Pointers that move over a fixed scale, with the normal zone aligned (say at nine or twelve o'clock on a group of dials), let an operator check a whole panel at a glance.

### Where to put it
With the head upright and relaxed, the line of sight falls about **10–15° below the horizontal**. Displays that are watched often belong within about **15° of that line** — roughly **0 to 30° below the horizontal** — and within about 15° to either side; secondary displays may go further out (about 30–35° to the side) where the eyes and head turn briefly. Displays should face the viewer: tilt them so the line of sight meets the face nearly at right angles, which also reduces reflections. At a machine, check the whole population: for a standing display 700 mm away at 1400 mm, the 5th-percentile woman (eye height 1438 mm in shoes) looks about 3° down and the 95th-percentile man (1777 mm) about 28° down — both inside the zone.

### How big: the visual angle
What matters is not the size in millimetres but the **angle** a character subtends at the eye:

$$h = 2\\,d\\,\\tan\\frac{\\alpha}{2}$$

For text to be read quickly and without strain, ISO 9241-303 asks for at least **16 minutes of arc** and prefers **20–22′** (a letter on the 20/20 line of an eye chart subtends 5′ — reading needs three to four times the threshold). At a panel 700 mm away 20′ is 4.1 mm; on a wall display 6 m away it is 35 mm. Older eyes, poor light, vibration and safety-critical labels need the larger sizes ([[?inverse-trig|trigonometry]] turns the angle into a height; for small angles $h \\approx d\\,\\alpha$ in [[?radian|radians]]).

### Contrast, colour and light
- **Contrast** between characters and background matters as much as size; web accessibility guidance (WCAG) asks for at least 4.5 : 1 for normal text and 3 : 1 for large text and graphics.
- **Colour** carries meaning by convention — red danger or alarm, yellow abnormal, green normal, blue mandatory action (IEC 60073) — but about 8 % of men have a red–green deficiency: always pair colour with position, shape, text or flashing.
- **Light:** in sunlight (vehicles, field equipment) displays wash out — use high luminance, transflective screens and hoods; at night they must dim without losing legibility, and military displays must work with night-vision goggles.
- **Scales:** numbered major marks in steps of 1, 2 or 5 × 10ⁿ, few intermediate marks, the pointer tip close to the marks and not covering the numbers.

### Settings
| Setting | Viewing | What changes |
|---|---|---|
| Workshop and industry | 0.5–1 m at machines; several metres to a line status board | Dirt, oil, glare from lights; larger characters, robust screens |
| Control rooms | 0.5–0.8 m to consoles; several metres to wall displays | Many displays, long shifts ([[control-rooms]]) |
| Vehicles | Instruments about 0.6–0.8 m away, glanced at while driving | Sunlight, vibration, glance time of about a second ([[driver-workspace]]) |
| Military | Cockpits, vehicle crew stations, hand-held | Night vision, sunlight, vibration, stress ([[cockpit-ergonomics]]) |
| Field | Hand-held and machine-mounted screens outdoors | Sunlight, rain, gloves ([[field-computing]]) |

In the simulation, move the display and the viewer, change the character height and read the visual angle; try the 5th-percentile woman seated and the 95th-percentile man standing.

> [!tip] Design labels and displays at 20–22′ for the farthest viewing distance, then check them with the oldest users in the worst light the machine will see.

> [!key] Pick the display for the question, put it 0–30° below the horizontal in front of the operator, size its characters by visual angle, and never let colour carry a message alone.
`,
  ideas: [
    'Choose the display for the question: digital for exact values, analogue pointers for check reading and trends, lights for states, mimics for location.',
    'Primary displays lie about 0–30° below the horizontal line of sight and within about 15° to the side.',
    'Character size follows the visual angle: at least 16′, preferably 20–22′ of arc (ISO 9241-303); h = 2d tan(α/2).',
    'Contrast, glare and ambient light decide legibility as much as size.',
    'Colour conventions help (red, yellow, green, blue — IEC 60073) but never carry a message alone.'
  ],
  pitfalls: [
    'Digital displays are always better because they are exact — They are slow for check reading and hide the direction and rate of change.',
    'A character size in millimetres is either big enough or not — Legibility depends on the angle: 4 mm is ample at 0.5 m and useless at 3 m.',
    'Red and green lights tell everybody what they need — About 8 % of men confuse them; add position, shape or text.'
  ],
  formulas: [
    {
      name: 'Character height for a visual angle',
      expr: 'h = 2*d*tan(alpha/2)', tex: 'h = 2\\,d\\,\\tan\\dfrac{\\alpha}{2}',
      vars: {
        h: { name: 'character height (capital letter)', q: 'length', unit: 'mm' },
        d: { name: 'viewing distance', q: 'length', unit: 'mm', value: 700 },
        alpha: { name: 'visual angle (16′ minimum, 20–22′ preferred)', q: 'angle', unit: '′', value: 20, min: 1, max: 600, tex: '\\alpha' }
      },
      note: 'For small angles h ≈ d·α with α in radians (1′ = 0.000291 rad).',
      stories: { h: 'An operator reads a label from {d}. How tall must its characters be to subtend {alpha}?', alpha: 'Characters {h} tall are read from {d}. What visual angle do they subtend?', d: 'Characters are {h} tall. From how far do they still subtend {alpha}?' }
    },
    {
      name: 'Viewing angle below the horizontal',
      expr: 'theta = atan((He - Hd)/d)', tex: '\\theta = \\arctan\\dfrac{H_e - H_d}{d}',
      vars: {
        theta: { name: 'angle of the line of sight below the horizontal', q: 'angle', unit: '°', signed: true, tex: '\\theta' },
        He: { name: 'eye height', q: 'length', unit: 'mm', value: 1200, tex: 'H_e' },
        Hd: { name: 'height of the display centre', q: 'length', unit: 'mm', value: 1000, tex: 'H_d' },
        d: { name: 'horizontal distance to the display', q: 'length', unit: 'mm', value: 700 }
      },
      note: 'Negative when the display is above the eyes. Aim for about 0–30° below the horizontal for displays watched often.',
      stories: { theta: 'A seated operator\'s eyes are at {He}; a display centred at {Hd} stands {d} away. How far below the horizontal does the operator look?', Hd: 'Eyes at {He}, display {d} away: at what height is the display centre if the line of sight is {theta} below the horizontal?' }
    }
  ],
  examples: [
    {
      title: 'Labels on a panel and a wall display',
      q: 'How tall must characters be for 20′ at a control panel 1 m away, and on a status board 6 m away?',
      steps: [
        '20′ = 1/3°; half of it is 10′.',
        '1 m: $h = 2 \\times 1000 \\times \\tan 10\' = 5.8$ mm.',
        '6 m: $h = 2 \\times 6000 \\times \\tan 10\' = 34.9$ mm.'
      ],
      a: 'About 6 mm on the panel and 35 mm on the wall board.'
    },
    {
      title: 'One display height for everyone',
      q: 'A display 700 mm in front of standing operators is centred at 1300 mm. Eye heights in shoes run from 1438 mm (5th-percentile woman) to 1777 mm (95th-percentile man). Does it lie 0–30° below the horizontal for both? What about 1400 mm?',
      steps: [
        'At 1300 mm: woman $\\arctan(138/700) = 11°$; man $\\arctan(477/700) = 34°$ — too low for him.',
        'At 1400 mm: woman $\\arctan(38/700) = 3°$; man $\\arctan(377/700) = 28°$ — both inside.',
        'Tilt the display back a little so it faces the middle of that range.'
      ],
      a: '1300 mm is too low for tall users (34°); about 1400 mm suits both (3° and 28°).'
    }
  ],
  quiz: [
    { q: 'An operator must see at a glance whether ten pressures are normal. Which displays suit best?', choices: ['Analogue pointers with the normal zones aligned', 'Ten digital readouts', 'A printed log', 'One digital readout that cycles through them'], a: 0, why: 'Check reading is a pattern task: aligned pointers make a deviation stand out without reading any number.' },
    { q: 'Characters of 4 mm are fine at 700 mm. How tall must they be at 2.1 m for the same visual angle?', choices: ['12 mm', '4 mm', '8 mm', '36 mm'], a: 0, why: 'Height is proportional to distance for a fixed angle: three times as far, three times as tall.' },
    { q: 'Where should a display that is watched often be placed vertically?', choices: ['About 0–30° below the horizontal line of sight', 'Above eye level', 'At floor level', 'Behind the operator'], a: 0, why: 'The relaxed line of sight is 10–15° below the horizontal; the zone about it is seen without tilting the head.' },
    { q: 'True or false: a red lamp for "fault" and a green lamp for "running", side by side, are enough for everyone.', a: false, why: 'People with red–green colour-vision deficiency cannot rely on the colours; add position, labels or flashing.' },
    { q: 'What is the minimum character size ISO 9241-303 asks for text on displays?', choices: ['16′ of arc (20–22′ preferred)', '5′ of arc', '2° of arc', '1 mm at any distance'], a: 0, why: '5′ is the eye-chart threshold; comfortable reading needs three to four times that.' }
  ],
  problems: [
    { q: 'What character height subtends 22′ at 600 mm?', answer: 3.84, unit: 'mm', tol: 0.01, steps: ['$h = 2 \\times 600 \\times \\tan 11\' = 1200 \\times 0.0032 = 3.84$ mm.'] },
    { q: 'A seated operator\'s eyes are 1200 mm above the floor; a display centred at 1000 mm stands 700 mm away. How many degrees below the horizontal is it?', answer: 15.9, unit: '°', tol: 0.01, steps: ['$\\theta = \\arctan(200/700) = 15.9°$ — inside the preferred zone.'] }
  ],
  ranges: [
    { dim: 'Character height as a visual angle (text on displays)', range: '≥ 16′ of arc; 20–22′ preferred', unit: '', who: 'Readers with normal or corrected vision at the working distance', why: 'Fast, error-free reading without leaning in.', limits: 'Older users, poor light, vibration and safety-critical text need the upper end or more.', setting: ['office', 'workshop', 'vehicle'], src: 'ISO 9241-303' },
    { dim: 'Character height on a panel read from 700 mm', range: [3.3, 4.5], unit: 'mm', who: '16′ to 22′ of arc at 700 mm', why: 'Legible at a normal panel distance.', limits: 'Scale in proportion to distance: triple the distance, triple the height.', setting: ['workshop', 'office'], src: 'ISO 9241-303 (visual angle)' },
    { dim: 'Vertical position of primary displays', range: [0, 30], unit: '° below the horizontal line of sight', who: 'Operators with the head upright; check the smallest and tallest eye heights', why: 'Seen with the eyes alone, without tilting the head.', limits: 'Above eye level strains the neck; far below it bends the head forward.', setting: ['workshop', 'office', 'vehicle', 'military'], src: 'ISO 9355-2; Kroemer and Grandjean' },
    { dim: 'Horizontal position of displays', range: '±15° for primary, about ±30–35° for secondary displays', unit: '', who: 'Seated or standing operators facing their work', why: 'Primary information without turning the head.', limits: 'Wider consoles need grouping by task and priority.', setting: ['workshop', 'office', 'vehicle', 'military'], src: 'ISO 9355-2; ISO 11064 (control centres)' },
    { dim: 'Viewing distance to panel displays and screens', range: [500, 750], unit: 'mm', who: 'Operators who also reach the controls beside the display', why: 'Within reach of the controls, far enough for the eyes to focus without strain.', limits: 'Large overview displays are read from metres away: size them by visual angle.', setting: ['office', 'workshop'], src: 'ISO 9241-5; ISO 9355-2' },
    { dim: 'Luminance contrast of text on screens', range: '≥ 4.5 : 1 (≥ 3 : 1 for large text and graphics)', unit: '', who: 'Users with low vision and older users', why: 'Legible in varied light for a wide range of eyesight.', limits: 'Outdoors in sunlight much higher screen luminance is needed.', setting: ['all'], src: 'WCAG 2 (W3C accessibility guidelines)' }
  ],
  applications: [
    'Machine control panels and gauge boards arranged for check reading.',
    'Control-room consoles and wall displays sized by visual angle.',
    'Vehicle instrument clusters and head-up displays readable at a glance.',
    'Labels and nameplates on machines and in field equipment.'
  ],
  sources: [
    'ISO 9355-2, *Ergonomic requirements for the design of displays and control actuators — Part 2: Displays*.',
    'ISO 9241-303, *Ergonomics of human-system interaction — Requirements for electronic visual displays*.',
    'IEC 60073, *Basic and safety principles for man-machine interface, marking and identification — Coding principles for indicators and actuators*.',
    'ISO 11064, *Ergonomic design of control centres*.',
    'C. D. Wickens et al., *Engineering Psychology and Human Performance* — displays and perception.',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design* — visual displays.'
  ],
  sim: 'mc-display-legibility'
},

{
  id: 'stereotypes-compatibility', parent: 'controls-displays', title: 'Population stereotypes and compatibility', level: 2,
  short: 'People expect a knob turned clockwise to increase, a lever pushed up or forward to mean more, a control to sit next to what it controls. Designs that match these population stereotypes are used faster and with fewer errors, especially under stress; designs that fight them cause errors that training never fully removes.',
  keywords: ['population stereotype', 'stimulus-response compatibility', 'spatial compatibility', 'movement compatibility', 'direction of motion', 'Warrick principle', 'clockwise to increase', 'stove burner layout', 'Chapanis and Lindenbaum', 'control-display ratio', 'C/D ratio', 'light switch up or down', 'excavator control pattern', 'mapping'],
  prereq: ['controls-design', 'displays-design', 'human-error'],
  related: ['hick-law', 'fitts-law', 'hmi-screens', 'decisions-stress', 'driver-workspace', 'mobile-machines', 'usability', 'crew-stations'],
  body: `
Turn a volume knob clockwise and you expect the sound to rise; push a throttle forward and you expect more power; flip a switch next to a lamp and you expect *that* lamp to light. Nobody taught these rules formally; they are **population stereotypes** — the relations most people in a population expect between a control, a display and the machine. When a design matches them, people act fast and right without thinking; when it does not, they hesitate, and under stress they fall back on the stereotype and do the wrong thing.

### Kinds of compatibility
- **Spatial:** the layout of the controls matches the layout of what they control — the knob for the back-left burner sits at the back left.
- **Movement:** the direction of motion matches — clockwise, up, forward or right for more; a steering wheel turned right turns the vehicle right.
- **Conceptual:** symbols and colours mean what people expect — red for stop or danger, a picture of the thing controlled.
- **Modality:** spoken commands answered by voice, visual signals by hand.

### The common stereotypes
| Control | Expected "increase", "on" or "more" | Notes |
|---|---|---|
| Rotary knob | clockwise | strong for electrical settings |
| Linear lever or slider | up, forward, to the right | strongest when vertical |
| Valve handle | clockwise **closes** | conflicts with the knob stereotype: label valves |
| Light switch | **down** in the UK and much of Europe, **up** in North America | a cultural difference |
| Steering wheel | turn right, go right | a boat's tiller works the other way — a classic trap for newcomers |
| Pointer on a scale | moves right or up (clockwise) for more | |

**Warrick's principle:** a knob beside a display should move the pointer in the same direction as the side of the knob **nearest** the display. Turned clockwise, a knob's top moves right and its left side moves up. So a knob **below** a horizontal scale (near side: top, moving right) or to the **right** of a vertical scale (near side: left, moving up) satisfies both Warrick and clockwise-for-more; a knob to the *left* of a vertical scale sets the two stereotypes against each other — its near side moves down while clockwise should mean up. Place knobs to the right of vertical scales and below horizontal ones.

### The stove
In 1959 Alphonse Chapanis and Lester Lindenbaum tested four ways of placing four knobs in a row under four burners arranged in a square. With the arrangement whose knobs matched the burners' spatial order there were **no errors** at all; with the others people made errors and were slower, and the errors did not disappear with practice. Thirty-odd years of kitchen stoves with ambiguous layouts followed anyway. The simulation lets you run the test on yourself.

### Control–display ratio
The **C/D ratio** is how far the control moves for a unit of display movement. A low ratio makes the display fast and sensitive: large moves are quick but fine setting overshoots. A high ratio is precise but slow. Classic studies summarised by Sanders and McCormick found the best total time for knobs at C/D of about 0.2–0.8, and for levers about 2.5–4.0. For a knob of diameter $D$ turned through an angle $\\theta$ (in radians) moving a pointer by $x$:

$$\\mathrm{C/D} = \\frac{\\theta\\,D}{2\\,x}$$

### Stereotypes differ — and conflict
- **Cultures:** light switches (above); in Chinese stock-market displays red means prices rising; reading direction (left-to-right or right-to-left) shapes expectations for sequences and time lines.
- **Trades:** process operators learn "clockwise closes" for valves, electricians "clockwise increases"; plants with both need direction labels on everything.
- **Machines:** excavators are sold with two different joystick patterns (usually called the ISO and the SAE patterns) that swap boom and arm functions; an operator moving between machines can make exactly the wrong movement. Many machines now let the pattern be switched and labelled.
- **Stress:** people revert to their strongest habit. A design that is "learnable" but anti-stereotype will fail in an emergency.

### Settings
- **Workshop and industry:** handwheels on machine tools (clockwise moves the slide which way?), valve handwheels, crane pendants whose buttons are laid out like the crane's movements.
- **Vehicles and mobile machines:** pedal order, steering, joystick patterns ([[mobile-machines]]).
- **Military:** standardised layouts across vehicles and aircraft, so crews moving between types keep their habits ([[crew-stations]]).
- **Civil:** stoves, taps, lifts, door handles and car-park machines used by everyone, with no training at all.

> [!warn] Never rely on training to overcome a reversed control. Under stress, fatigue or surprise people act on the stereotype — the design must match it, or at least never oppose it.

> [!key] Put each control next to what it controls, make it move the way people expect, and keep layouts the same across a family of machines.
`,
  ideas: [
    'Population stereotypes are the control–display relations most people expect: clockwise, up, forward, right for more.',
    'Compatibility is spatial, movement-related, conceptual and by modality; matching it cuts reaction time and errors.',
    'Chapanis and Lindenbaum\'s stove: the spatially compatible layout gave no errors; the others gave errors that persisted with practice.',
    'Stereotypes differ between cultures and trades and conflict (valves close clockwise; UK and US light switches), so label and standardise.',
    'Under stress people revert to the stereotype — a design must not oppose it.'
  ],
  pitfalls: [
    'Any mapping works once people are trained — Anti-stereotype mappings keep causing errors under stress, fatigue and surprise.',
    'Stereotypes are universal — Light switches, colours and reading direction differ between countries; valves and electrical controls conflict.',
    'The more sensitive a control, the faster it is used — A low C/D ratio speeds the gross movement but makes fine setting slow and overshooting; there is an optimum.'
  ],
  formulas: [
    {
      name: 'Control–display ratio of a knob',
      expr: 'CD = theta*Dk/(2*x)', tex: '\\mathrm{C/D} = \\dfrac{\\theta\\,D_k}{2\\,x}',
      vars: {
        CD: { name: 'control–display ratio', q: 'none', tex: '\\mathrm{C/D}' },
        theta: { name: 'angle the knob is turned', q: 'angle', unit: '°', value: 90, tex: '\\theta' },
        Dk: { name: 'knob diameter', q: 'length', unit: 'mm', value: 40, tex: 'D_k' },
        x: { name: 'movement of the pointer or display', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Movement of a point on the knob\'s rim divided by the movement of the display. Classic optimum for knobs about 0.2–0.8; for levers about 2.5–4.0.',
      stories: { CD: 'A {Dk} knob turned {theta} moves a pointer {x}. What is the C/D ratio?', x: 'A {Dk} knob turned {theta} should give a C/D ratio of {CD}. How far must the pointer move?' }
    }
  ],
  examples: [
    {
      title: 'A knob that is too slow',
      q: 'Turning a 40 mm knob through 90° moves a pointer 20 mm. What is the C/D ratio, and how far should the pointer move for a ratio of 0.5?',
      steps: [
        'The rim moves $\\theta D/2 = (\\pi/2) \\times 40/2 = 31.4$ mm.',
        '$\\mathrm{C/D} = 31.4/20 = 1.57$ — above the optimum range for knobs (0.2–0.8): setting will be precise but slow.',
        'For C/D = 0.5 the pointer should move $31.4/0.5 = 63$ mm per quarter turn.'
      ],
      a: 'C/D ≈ 1.6; about 63 mm of pointer movement per quarter turn gives 0.5.'
    },
    {
      title: 'Four knobs, four burners',
      q: 'Four knobs in a row control four burners in a square. How many ways could the knobs be assigned, and why does only a spatially compatible layout make one assignment obvious?',
      steps: [
        'Four knobs can be matched to four burners in $4! = 24$ ways ([[?factorial]]).',
        'In a row of knobs under a square of burners, several of those feel "natural" to different people: left-to-right by rows, front-to-back, back-to-front.',
        'Staggering the burners, or arranging the knobs in the same square pattern, leaves only one natural reading — and the errors disappear.'
      ],
      a: '24 possible mappings; only a layout that copies the burners\' arrangement makes the right one self-evident.'
    }
  ],
  quiz: [
    { q: 'A rotary knob sets a heater\'s power. Which way should "more" be?', choices: ['Clockwise', 'Anticlockwise', 'Either, if labelled', 'Push to increase'], a: 0, why: 'Clockwise-for-more is one of the strongest stereotypes for rotary controls.' },
    { q: 'In which country does pressing a light switch down usually turn the light on?', choices: ['The United Kingdom', 'The United States', 'Canada', 'Nowhere'], a: 0, why: 'In the UK and much of Europe down is on; in North America up is on — stereotypes are cultural.' },
    { q: 'What did Chapanis and Lindenbaum find with the spatially compatible stove layout?', choices: ['No errors at all', 'The same errors as other layouts', 'Errors only at first', 'Slower responses'], a: 0, why: 'The compatible layout produced no errors; the others produced errors that persisted with practice.' },
    { q: 'True or false: once operators are well trained, a control that moves opposite to the stereotype is as safe as one that follows it.', a: false, why: 'Under stress and surprise people revert to the stereotype; the errors come back when they matter most.' },
    { q: 'A knob\'s C/D ratio is 3. What will users experience?', choices: ['Precise but slow setting: many turns for a large change', 'Fast but overshooting setting', 'No difference from 0.5', 'The pointer moves backwards'], a: 0, why: 'A high ratio means a large control movement for a small display change: fine control, slow gross movement. For knobs the optimum is about 0.2–0.8.' }
  ],
  problems: [
    { q: 'A 30 mm knob turned through 180° moves a pointer 50 mm. What is the C/D ratio?', answer: 0.942, unit: '', tol: 0.01, steps: ['Rim movement: $\\pi \\times 30/2 = 47.1$ mm.', '$\\mathrm{C/D} = 47.1/50 = 0.94$.'] }
  ],
  ranges: [
    { dim: 'Control–display ratio, knobs', range: [0.2, 0.8], unit: '', who: 'Operators setting a value by eye', why: 'Shortest total time: fast enough to travel, fine enough to settle without overshoot.', limits: 'Depends on the tolerance and the display size; test with users.', setting: ['workshop', 'vehicle', 'office'], src: 'Classic knob studies summarised in Sanders and McCormick' },
    { dim: 'Control–display ratio, levers', range: [2.5, 4.0], unit: '', who: 'Operators moving a lever to set a display', why: 'As above, for the larger movements of a lever.', limits: 'As above.', setting: ['workshop', 'vehicle'], src: 'Classic studies summarised in Sanders and McCormick' },
    { dim: 'Direction of motion for "increase" or "on"', range: 'clockwise, up, forward, to the right', unit: '', who: 'Most users in European and North American populations', why: 'Fast, error-free use without thought, even under stress.', limits: 'Valves close clockwise; UK and US light switches differ; check the users\' own habits.', setting: ['all'], src: 'ISO 9355-1; Sanders and McCormick' }
  ],
  applications: [
    'Stove and hob layouts with knobs arranged like the burners.',
    'Crane pendants whose buttons are laid out like the crane\'s movements.',
    'Excavator and loader joystick patterns, switchable and labelled.',
    'Control-room panels with each control beside the display it changes.'
  ],
  history: 'Paul Fitts and Charles Seeger showed in 1953 that the speed of a response depends on how well the arrangement of stimuli matches the arrangement of responses — stimulus–response compatibility. Alphonse Chapanis and Lester Lindenbaum\'s 1959 study of stove layouts became the textbook case.',
  sources: [
    'P. M. Fitts and C. M. Seeger, "S–R compatibility: spatial characteristics of stimulus and response codes", *Journal of Experimental Psychology* 46 (1953).',
    'A. Chapanis and L. E. Lindenbaum, "A reaction time study of four control–display linkages", *Human Factors* 1 (1959).',
    'ISO 9355-1, *Ergonomic requirements for the design of displays and control actuators — Part 1: Human interactions with displays and control actuators*.',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design* — compatibility and the control–response ratio.',
    'C. D. Wickens et al., *Engineering Psychology and Human Performance* — stimulus–response compatibility.'
  ],
  sim: 'mc-stove-mapping'
},

{
  id: 'fitts-law', parent: 'controls-displays', title: 'Fitts\'s law', level: 2,
  short: 'The time to move a hand, a finger or a pointer to a target grows with the logarithm of distance over size: MT = a + b·log₂(D/W + 1). Twice as far costs one "bit" more, and so does half the size. It tells designers to make frequent and urgent targets large and close.',
  keywords: ['Fitts\'s law', 'movement time', 'index of difficulty', 'bits', 'throughput', 'speed-accuracy trade-off', 'target size', 'pointing', 'mouse', 'touch', 'effective width', 'ISO 9241-411', 'Shannon formulation', 'MacKenzie'],
  prereq: ['controls-design', 'math:logarithms'],
  related: ['hick-law', 'hmi-screens', 'reach-zones', 'keyboard-mouse', 'stereotypes-compatibility', 'driver-workspace', 'usability'],
  body: `
Reach for a big button close to your hand and you hit it without thinking; reach for a small one far away and you slow down near the end to aim. In 1954 Paul Fitts measured this and found a law that has held for hands, feet, heads, mice, touchscreens and even eyes: **movement time grows with the [[?logarithm]] of the ratio of distance to target size.** In the form most used today (MacKenzie's Shannon formulation):

$$MT = a + b\\,\\log_2\\!\\left(\\frac{D}{W} + 1\\right)$$

$D$ is the distance to the target's centre, $W$ its width along the direction of movement, and $\\log_2(D/W + 1)$ the **index of difficulty** $ID$ in bits. The constants $a$ (a fixed start-and-stop time) and $b$ (time per bit) are measured for each limb, device and person.

### What the law says
- **Twice as far costs one bit more** — not twice the time. Distance is cheap; small targets are expensive.
- **Half the size costs one bit more.** A target twice as far and twice as large takes the same time.
- **Speed and accuracy trade.** Asked to go faster, people miss more; the hits spread over an **effective width** $W_e \\approx 4.133\\,\\sigma$ of their scatter, which is what the law really sees.
- **Throughput** $TP = ID/MT$, in bits per second, compares devices: in standard pointing tests (ISO 9241-411) a mouse typically gives about 4–5 bits/s; touchpads, trackballs and joysticks less.

| $D/W$ | 1 | 3 | 7 | 15 | 31 |
|---|---|---|---|---|---|
| $ID$ (bits) | 1 | 2 | 3 | 4 | 5 |
| $MT$ with $a$ = 100 ms, $b$ = 150 ms/bit | 250 ms | 400 ms | 550 ms | 700 ms | 850 ms |

### Designing with it
- **Frequent and urgent targets large and close**: the emergency stop is big and within easy reach; the most used buttons are nearest the hand's rest position.
- **Edges and corners** of a screen are infinitely deep for a mouse: the pointer stops there, so targets on edges are fast. On a touchscreen they are not — the finger overshoots nothing, but bezels and grips get in the way.
- **Pie and radial menus** put every item at the same short distance.
- **Touch targets** have a floor set by the finger, not by Fitts: below about 9 mm the finger itself covers the target ([[hmi-screens]]).
- **Machines:** controls grouped around the hands' working positions; spacing that is generous (for accuracy, see [[controls-design]]) costs little time because distance enters only logarithmically.

### Limits
Fitts's law covers rapid aimed movements. It does not include the time to *find* the target (visual search), to *decide* which one ([[hick-law]]), or tracking a moving target. At very small sizes tremor and finger width take over; with gloves, vibration, a moving vehicle or an older hand, $a$ and $b$ grow. The constants must come from a test with the real users and device — the simulation lets you measure your own.

### Settings
- **Office:** mouse and touch targets, menus, toolbars ([[keyboard-mouse]]).
- **Workshop and industry:** control panels, HMI screens at machines, gloved hands.
- **Vehicles:** reaching for a touchscreen while driving — every extra bit is time with the eyes and a hand off the task ([[driver-workspace]]).
- **Military:** cockpit and crew-station touchscreens used in turbulence and vibration, with gloves.

> [!tip] When a target must be hit quickly or under stress, make it bigger before you move it closer — halving the distance and doubling the size buy the same time, and the bigger target is also harder to miss.

> [!key] $MT = a + b\\log_2(D/W + 1)$: movement time depends on the ratio of distance to size. Make important targets big and near, and measure $a$ and $b$ for your users and device.
`,
  ideas: [
    'Movement time grows with the logarithm of distance over target width: MT = a + b·log₂(D/W + 1).',
    'Doubling the distance or halving the width adds one bit — the same time; distance is cheap, small targets are expensive.',
    'Throughput (bits per second) compares devices and people; a mouse gives about 4–5 bits/s in standard tests.',
    'Speed and accuracy trade: the effective width is about 4.133 times the scatter of the hits.',
    'Fitts\'s law covers the aimed movement only — not search, decision or tracking.'
  ],
  pitfalls: [
    'Moving a button twice as far away doubles the time to press it — It adds only one bit (for example 150 ms), because distance enters logarithmically.',
    'Smaller buttons are fine if people are careful — Each halving of size costs a bit, and below the finger\'s size errors rise steeply.',
    'The constants a and b are universal — They depend on the limb, the device, the person, gloves, vibration and practice; measure them.'
  ],
  formulas: [
    {
      name: 'Fitts\'s law (Shannon form)',
      expr: 'MT = a + b*log2(D/W + 1)', tex: '\\mathrm{MT} = a + b\\,\\log_2\\!\\left(\\dfrac{D}{W} + 1\\right)',
      vars: {
        MT: { name: 'movement time', q: 'time', unit: 'ms', tex: '\\mathrm{MT}' },
        a: { name: 'intercept (start and stop time)', q: 'time', unit: 'ms', value: 100 },
        b: { name: 'time per bit of difficulty', q: 'time', unit: 'ms', value: 150 },
        D: { name: 'distance to the target centre', q: 'length', unit: 'mm', value: 200 },
        W: { name: 'target width along the movement', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'a and b come from a test with the users and device: typical hand or mouse values are of the order of 0–200 ms and 100–200 ms per bit.',
      stories: { MT: 'A button {W} wide lies {D} from the hand. With a = {a} and b = {b} per bit, how long does the movement take?', W: 'A target {D} away must be reached in {MT} (a = {a}, b = {b} per bit). How wide must it be?' }
    },
    {
      name: 'Index of difficulty',
      expr: 'ID = log2(D/W + 1)', tex: '\\mathrm{ID} = \\log_2\\!\\left(\\dfrac{D}{W} + 1\\right)',
      vars: {
        ID: { name: 'index of difficulty (bits)', q: 'none', tex: '\\mathrm{ID}' },
        D: { name: 'distance', q: 'length', unit: 'mm', value: 150 },
        W: { name: 'target width', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'In bits: each doubling of D/W + 1 adds one bit.',
      stories: { ID: 'A target {W} wide lies {D} away. What is the index of difficulty?' }
    },
    {
      name: 'Throughput',
      expr: 'TP = ID/MT', tex: '\\mathrm{TP} = \\dfrac{\\mathrm{ID}}{\\mathrm{MT}}',
      vars: {
        TP: { name: 'throughput', q: false, unit: 'bit/s', tex: '\\mathrm{TP}' },
        ID: { name: 'index of difficulty', q: false, unit: 'bit', value: 3.46, tex: '\\mathrm{ID}' },
        MT: { name: 'movement time', q: false, unit: 's', value: 0.62, tex: '\\mathrm{MT}' }
      },
      note: 'Averaged over many targets it rates a device and a user; ISO 9241-411 describes the test.',
      stories: { TP: 'A movement of {ID} takes {MT}. What is the throughput?' }
    }
  ],
  examples: [
    {
      title: 'A big button far away or a small one close by?',
      q: 'With a = 100 ms and b = 150 ms/bit, compare a 40 mm emergency stop 500 mm from the hand with a 20 mm button 200 mm away.',
      steps: [
        'Emergency stop: $ID = \\log_2(500/40 + 1) = \\log_2 13.5 = 3.75$ bits; $MT = 100 + 150 \\times 3.75 = 663$ ms.',
        'Small button: $ID = \\log_2(200/20 + 1) = \\log_2 11 = 3.46$ bits; $MT = 100 + 150 \\times 3.46 = 619$ ms.',
        'Two and a half times the distance costs only 44 ms because the target is twice as big.'
      ],
      a: 'About 660 ms against 620 ms — size almost cancels the distance.'
    },
    {
      title: 'Measuring your own a and b',
      q: 'In a tapping test, targets with an index of difficulty of 2 bits took 400 ms on average and targets of 5 bits took 850 ms. Find a and b, and the throughput at 5 bits.',
      steps: [
        'Slope: $b = (850 - 400)/(5 - 2) = 150$ ms per bit.',
        'Intercept: $a = 400 - 2 \\times 150 = 100$ ms.',
        'Throughput at 5 bits: $TP = 5/0.85 = 5.9$ bits/s. With more points, fit the line by [[?least-squares]].'
      ],
      a: 'a = 100 ms, b = 150 ms/bit; about 5.9 bits/s at 5 bits.'
    }
  ],
  quiz: [
    { q: 'A target is moved twice as far from the hand, same size. By how much does the movement time grow?', choices: ['By about b — one bit more', 'It doubles', 'It quadruples', 'Not at all'], a: 0, why: 'For D much larger than W, doubling D adds log₂2 = 1 bit, i.e. b milliseconds.' },
    { q: 'Which change leaves the movement time unchanged?', choices: ['Doubling both the distance and the width', 'Doubling the distance only', 'Halving the width only', 'Halving the distance and the width… and the time'], a: 0, why: 'Only the ratio D/W appears in the law.' },
    { q: 'What does Fitts\'s law NOT include?', choices: ['The time to find or choose the target', 'The distance', 'The target size', 'The device\'s constants'], a: 0, why: 'Search and decision come before the movement; Hick\'s law describes choosing.' },
    { q: 'An index of difficulty of 4 bits corresponds to D/W of…', choices: ['15', '4', '16', '8'], a: 0, why: 'log₂(D/W + 1) = 4 means D/W + 1 = 16, so D/W = 15.' },
    { q: 'True or false: a touchscreen button can be made as small as needed if the user takes their time.', a: false, why: 'Below the finger\'s contact size (about 9 mm) the finger hides the target and errors rise regardless of time.' }
  ],
  problems: [
    { q: 'With a = 100 ms and b = 150 ms/bit, how long does it take to hit a 25 mm target 375 mm away?', answer: 700, unit: 'ms', tol: 0.01, steps: ['$ID = \\log_2(375/25 + 1) = \\log_2 16 = 4$ bits.', '$MT = 100 + 150 \\times 4 = 700$ ms.'] },
    { q: 'A target 300 mm away must be hit in 550 ms with a = 100 ms and b = 150 ms/bit. How wide must it be?', answer: 42.9, unit: 'mm', tol: 0.01, steps: ['$ID = (550 - 100)/150 = 3$ bits, so $D/W + 1 = 8$.', '$W = 300/7 = 42.9$ mm.'] }
  ],
  ranges: [
    { dim: 'Touch target size, bare finger, still screen', range: [9, null], unit: 'mm', who: 'The contact area and aiming scatter of adult fingertips', why: 'Hits without the finger hiding the target; few errors.', limits: 'Larger for the thumb held one-handed, for older users and for anything done quickly.', setting: ['office', 'civil', 'health'], src: 'HCI touch-target studies; see Wickens et al.' },
    { dim: 'Touch target size with gloves, vibration or standing at a machine', range: [15, 20], unit: 'mm', who: 'Gloved fingers and a shaking or moving hand', why: 'Keeps error rates low when the aim scatters more.', limits: 'Fewer targets fit on the screen; group and prioritise.', setting: ['workshop', 'vehicle', 'military', 'field'], src: 'Industrial HMI practice; MIL-STD-1472 (touch screens)' },
    { dim: 'Pointing throughput of a mouse in standard tests', range: [4, 5], unit: 'bit/s', who: 'Practised adult users', why: 'A benchmark to compare devices and interfaces.', limits: 'Lower for touchpads, trackballs and joysticks, for older users and under vibration.', setting: ['office'], src: 'ISO 9241-411; I. S. MacKenzie\'s studies' }
  ],
  applications: [
    'Size and place emergency stops and frequently used buttons near the hands.',
    'Screen layouts with frequent targets large and on the edges for mice; large targets for touch.',
    'Comparing input devices by throughput (ISO 9241-411).',
    'Vehicle touchscreens: fewer, larger targets to cut time with eyes and hand off the task.'
  ],
  history: 'Paul Fitts published the law in 1954, borrowing Claude Shannon\'s measure of information: a movement "transmits" bits as it chooses one target width out of a distance. Stuart Card, William English and Betty Burr used it in 1978 to show that the mouse beat other pointing devices, and I. Scott MacKenzie\'s Shannon form (1992) is the one used in ISO 9241-411.',
  sources: [
    'P. M. Fitts, "The information capacity of the human motor system in controlling the amplitude of movement", *Journal of Experimental Psychology* 47 (1954).',
    'I. S. MacKenzie, "Fitts\' law as a research and design tool in human-computer interaction", *Human-Computer Interaction* 7 (1992).',
    'ISO 9241-411, *Ergonomics of human-system interaction — Evaluation methods for the design of physical input devices*.',
    'S. K. Card, W. K. English and B. J. Burr, "Evaluation of mouse, rate-controlled isometric joystick, step keys, and text keys for text selection on a CRT", *Ergonomics* 21 (1978).',
    'C. D. Wickens et al., *Engineering Psychology and Human Performance* — movement and Fitts\'s law.'
  ],
  sim: 'mc-fitts'
},

{
  id: 'hick-law', parent: 'controls-displays', title: 'Hick\'s law', level: 2,
  short: 'The time to choose one response among n equally likely alternatives grows with the logarithm of n: RT = a + b·log₂(n + 1). Every doubling of the choices adds a fixed step of time; rare signals are answered more slowly than common ones; practice and compatible mappings flatten the slope. It tells designers to keep urgent choices few and obvious.',
  keywords: ['Hick\'s law', 'Hick–Hyman law', 'choice reaction time', 'reaction time', 'information', 'bits', 'number of alternatives', 'menu breadth and depth', 'decision time', 'stimulus probability', 'perception–reaction time', 'simple reaction time', 'compatibility', 'practice'],
  prereq: ['fitts-law', 'perception-attention', 'math:logarithms'],
  related: ['stereotypes-compatibility', 'hmi-screens', 'alarms-warnings', 'decisions-stress', 'mental-workload', 'driver-workspace', 'usability'],
  body: `
Press a button when a single lamp lights and you respond in about a fifth of a second. Put up two lamps, each with its own button, and it takes longer; four lamps, longer still. In 1952 William Hick found that the extra time grows not with the number of choices but with its [[?logarithm]] — each **doubling** of the alternatives adds the same step. Ray Hyman showed a year later that what really counts is the **information** in the signal, in bits: a signal that is expected is answered fast, a surprising one slowly. Together they are the **Hick–Hyman law**:

$$RT = a + b\\,\\log_2(n + 1)$$

for $n$ equally likely alternatives (the $+1$ allows for the uncertainty of whether a signal comes at all). With unequal chances, a signal of [[?probability]] $p$ carries $I = \\log_2(1/p)$ bits and is answered in about $a + b\\,I$.

### Typical numbers
- **Simple reaction time** to an expected signal: about 150–250 ms (sound a little faster than light).
- **Slope** $b$: of the order of 100–200 ms per bit for unpractised choices; much less with long practice or very compatible mappings — when a vibrating finger must press its own key, the time hardly grows with $n$ at all.
- **Real decisions** add detection, recognition and doubt: road designers allow a driver **2.5 s** of perception–reaction time for an unexpected hazard (AASHTO).

| $n$ choices | 1 | 3 | 7 | 15 |
|---|---|---|---|---|
| $\\log_2(n+1)$ bits | 1 | 2 | 3 | 4 |
| $RT$ with $a$ = 200 ms, $b$ = 150 ms/bit | 350 ms | 500 ms | 650 ms | 800 ms |

### What it means for design
- **Keep urgent choices few.** In an emergency the right action should be one obvious control (the emergency stop), not a choice among many ([[alarms-warnings]]).
- **Broad, shallow menus beat deep ones** when the items are familiar: one menu of 16 items costs $\\log_2 17 = 4.1$ bits once; two levels of 4 cost $2 \\times \\log_2 5 = 4.6$ bits *plus* a second intercept $a$ and a second movement.
- **Frequent things fast, rare things clear.** Common signals are answered quickly; rare ones — alarms — carry many bits and need to be unmistakable.
- **Compatibility and practice** lower the slope: a lamp directly above its button, a stereotype-matching layout ([[stereotypes-compatibility]]).
- **Defaults and grouping** cut the effective number of alternatives.

### Where it does not apply
Hick's law assumes the person knows the alternatives and only has to identify the signal. If the options must be **searched** on a screen — an unfamiliar list — time grows roughly in proportion to the number of items read, not with its logarithm. Under stress, fatigue or time pressure people trade accuracy for speed, and errors, not time, rise. And choosing is only part of the task: moving to the control follows [[fitts-law]].

### Settings
- **Office and HMI screens:** menus, dialogs and toolbars; broad and well grouped ([[hmi-screens]]).
- **Industry and control rooms:** alarm responses, procedures with clear first actions.
- **Vehicles:** every option on a touchscreen costs decision time with the eyes off the road ([[driver-workspace]]).
- **Military:** crew stations with few, obvious emergency actions; drills that turn choices into practised responses ([[decisions-stress]]).
- **Health care:** infusion pumps and monitors with many modes, used by tired staff at night.

In the simulation, choose how many lamps may light and measure your own reaction times; then shuffle the buttons (an incompatible mapping) and watch the slope steepen.

> [!key] Choice time grows with the information in the signal: RT = a + b·log₂(n + 1). Offer few alternatives when time matters, make frequent ones fast and rare ones unmistakable, and match the layout to people's expectations.
`,
  ideas: [
    'Choice reaction time grows with the logarithm of the number of equally likely alternatives: RT = a + b·log₂(n + 1).',
    'What counts is information: a signal of probability p carries log₂(1/p) bits; rare signals are answered more slowly.',
    'Simple reaction time is about 150–250 ms; each bit of choice adds of the order of 100–200 ms unpractised.',
    'Practice and compatible mappings flatten the slope; broad, shallow menus of familiar items beat deep ones.',
    'Searching unfamiliar options grows linearly with their number — Hick\'s law covers identification only.'
  ],
  pitfalls: [
    'Doubling the options doubles the decision time — It adds one step (one bit), because time grows with the logarithm.',
    'Hick\'s law says menus should be short — For familiar items broad menus are faster; for unfamiliar items visual search, not Hick, dominates.',
    'A reaction time measured in the lab is what a driver or operator needs — Real hazards are unexpected, must be detected and recognised; design values such as 2.5 s for drivers are far longer.'
  ],
  formulas: [
    {
      name: 'Hick\'s law',
      expr: 'RT = a + b*log2(n + 1)', tex: '\\mathrm{RT} = a + b\\,\\log_2(n + 1)',
      vars: {
        RT: { name: 'choice reaction time', q: 'time', unit: 'ms', tex: '\\mathrm{RT}' },
        a: { name: 'intercept (simple reaction and movement start)', q: 'time', unit: 'ms', value: 200 },
        b: { name: 'time per bit', q: 'time', unit: 'ms', value: 150 },
        n: { name: 'number of equally likely alternatives', q: 'count', value: 4, int: true }
      },
      note: 'a and b depend on the person, practice, the stimulus and the mapping; measure them for a real design.',
      stories: { RT: 'An operator must respond to one of {n} equally likely signals. With a = {a} and b = {b} per bit, how long does the choice take?', n: 'With a = {a} and b = {b} per bit, how many equally likely alternatives can be answered in {RT}?' }
    },
    {
      name: 'Information in a signal',
      expr: 'I = log2(1/p)', tex: 'I = \\log_2 \\dfrac{1}{p}',
      vars: {
        I: { name: 'information (bits)', q: 'none' },
        p: { name: 'probability of the signal', q: 'ratio', unit: '%', value: 25, min: 0.01, max: 100 }
      },
      note: 'A certain event carries 0 bits, a one-in-two event 1 bit, a one-in-sixteen event 4 bits.',
      stories: { I: 'A signal occurs with probability {p}. How much information does it carry?' }
    }
  ],
  examples: [
    {
      title: 'One broad menu or two narrow ones?',
      q: 'With a = 200 ms and b = 150 ms/bit, compare choosing one of 16 familiar items from one menu with choosing through two levels of 4.',
      steps: [
        'One level: $RT = 200 + 150 \\log_2 17 = 200 + 613 = 813$ ms.',
        'Two levels: each $200 + 150 \\log_2 5 = 548$ ms, twice: 1097 ms — plus a second movement.',
        'The broad menu wins by about 0.3 s per choice, provided the items are familiar and well grouped.'
      ],
      a: 'About 0.8 s against 1.1 s: broad and shallow is faster.'
    },
    {
      title: 'A common signal and a rare one',
      q: 'On a machine one message appears half the time and another once in sixteen occasions. With a = 200 ms and b = 150 ms/bit, how fast is each answered?',
      steps: [
        'Common: $I = \\log_2 2 = 1$ bit, $RT = 200 + 150 = 350$ ms.',
        'Rare: $I = \\log_2 16 = 4$ bits, $RT = 200 + 600 = 800$ ms.',
        'Rare events — faults, alarms — are exactly the ones answered slowly; make them unmistakable and their responses simple.'
      ],
      a: '350 ms for the common message, 800 ms for the rare one.'
    }
  ],
  quiz: [
    { q: 'The number of equally likely choices grows from 3 to 7. By how much does the reaction time grow?', choices: ['By one step b (one bit)', 'It more than doubles', 'Not at all', 'By 4b'], a: 0, why: 'log₂(3 + 1) = 2 and log₂(7 + 1) = 3: one bit more.' },
    { q: 'Which signal is answered most slowly?', choices: ['A rare one', 'A frequent one', 'One that always comes', 'All equally'], a: 0, why: 'Rare signals carry more information (log₂ 1/p) and take longer to answer.' },
    { q: 'When does Hick\'s law NOT describe the time to choose from a menu?', choices: ['When the items are unfamiliar and must be read one by one', 'When the items are familiar', 'When the menu is short', 'Never — it always applies'], a: 0, why: 'Searching an unfamiliar list takes time roughly proportional to the number of items.' },
    { q: 'True or false: with long practice and very compatible mappings the slope b can almost vanish.', a: true, why: 'When the stimulus points directly at the response — a vibrating finger pressing its own key — choice time barely grows with n.' },
    { q: 'What perception–reaction time do road designers allow for drivers facing an unexpected hazard (AASHTO)?', choices: ['2.5 s', '0.2 s', '0.7 s', '10 s'], a: 0, why: 'Real hazards must be detected, recognised and decided on; 2.5 s covers most drivers.' }
  ],
  problems: [
    { q: 'With a = 200 ms and b = 150 ms/bit, how long does a choice among 7 equally likely alternatives take?', answer: 650, unit: 'ms', tol: 0.01, steps: ['$\\log_2(7 + 1) = 3$ bits.', '$RT = 200 + 150 \\times 3 = 650$ ms.'] },
    { q: 'With a = 200 ms and b = 150 ms/bit, how many equally likely alternatives can be answered in 800 ms?', answer: 15, unit: '', tol: 0.01, steps: ['$\\log_2(n + 1) = (800 - 200)/150 = 4$.', '$n + 1 = 16$, $n = 15$.'] }
  ],
  ranges: [
    { dim: 'Simple reaction time to an expected signal', range: [150, 250], unit: 'ms', who: 'Alert adults; sounds about 150 ms, lights about 200 ms', why: 'The floor under every response time a design must allow.', limits: 'Longer with age, fatigue, alcohol, divided attention and unexpected signals.', setting: ['all'], src: 'Wickens et al., Engineering Psychology and Human Performance' },
    { dim: 'Added time per bit of choice (unpractised)', range: '≈ 100–200 ms per bit', unit: '', who: 'Operators choosing among known alternatives', why: 'Estimates how much each extra option costs.', limits: 'Much less with practice and compatible mappings; searching unknown options costs more.', setting: ['all'], src: 'Hick (1952); Hyman (1953)' },
    { dim: 'Perception–reaction time allowed for drivers (road design)', range: '2.5 s', unit: '', who: 'Most drivers facing an unexpected hazard', why: 'Stopping sight distances cover detection, recognition, decision and the start of braking.', limits: 'Older or distracted drivers may be slower; alert, expecting drivers faster.', setting: ['vehicle'], src: 'AASHTO, A Policy on Geometric Design of Highways and Streets' }
  ],
  applications: [
    'Menus and HMI screens: broad, grouped, familiar options.',
    'Emergency responses designed as one obvious action.',
    'Alarm and message design: rare events made unmistakable.',
    'Road and vehicle design allowing realistic perception–reaction times.'
  ],
  history: 'William Hick (1952) and Ray Hyman (1953) applied Claude Shannon\'s new information theory to reaction time and found that the time to choose grows with the information in the signal — one of the first quantitative laws of cognitive psychology.',
  sources: [
    'W. E. Hick, "On the rate of gain of information", *Quarterly Journal of Experimental Psychology* 4 (1952).',
    'R. Hyman, "Stimulus information as a determinant of reaction time", *Journal of Experimental Psychology* 45 (1953).',
    'C. D. Wickens et al., *Engineering Psychology and Human Performance* — reaction time, information and compatibility.',
    'AASHTO, *A Policy on Geometric Design of Highways and Streets* — perception–reaction time for stopping sight distance.'
  ],
  sim: 'mc-hick'
},

{
  id: 'alarms-warnings', parent: 'controls-displays', title: 'Alarms and warnings', level: 2,
  short: 'An alarm must be noticed, understood, located and acted on — above the noise but not deafening, distinct in urgency, and few enough that operators can answer each one. ISO 7731 sets audibility (about 15 dB(A) above the ambient noise), EEMUA 191 and IEC 62682 set how many alarms an operator can handle (about one per ten minutes in normal running), and warning signs follow ISO 3864.',
  keywords: ['alarm', 'warning', 'auditory signal', 'ISO 7731', 'audibility', 'masked threshold', 'visual alarm', 'beacon', 'flash rate', 'alarm flood', 'alarm management', 'EEMUA 191', 'IEC 62682', 'ISA-18.2', 'alarm priority', 'urgency', 'alarm fatigue', 'ISO 3864', 'signal words', 'IEC 60601-1-8'],
  prereq: ['displays-design', 'noise-basics', 'perception-attention'],
  related: ['hick-law', 'hmi-screens', 'hearing-protection', 'noise-exposure', 'control-rooms', 'situation-awareness', 'mental-workload', 'human-error', 'physics:sound-intensity', 'medicine:hearing-balance'],
  body: `
An alarm has four jobs: to be **noticed**, to be **understood** (what is wrong and how urgent), to be **located** (where), and to lead to the **right action** in time. Each can fail: the alarm drowned in machine noise, the tone nobody recognises, the beacon behind a column, the operator buried under two hundred alarms at once. Alarms are designed like any other part of the machine — around the people who must hear and answer them.

### Being heard
ISO 7731 says an auditory danger signal must be clearly audible above the ambient noise. The simplest criterion: its **A-weighted level at the listener exceeds the noise by more than 15 dB**; a finer one uses octave bands, where the signal must stand at least **10 dB above the masked threshold** in at least one band. Sound falls about **6 dB for each doubling of distance** in the open ($L = L_1 - 20\\log_{10}(r/r_1)$, a [[?logarithm]]), so in a large noisy hall several sounders near the people work better than one very loud one. Tones mostly between about 500 and 2500 Hz carry well; people with high-frequency hearing loss or wearing hearing protectors hear lower tones better. Hearing protectors cut alarm and noise alike, but a quiet alarm may drop below the hearing threshold of a worker with hearing loss — add beacons.

**Not too loud.** An alarm far above what is needed startles, masks speech and gets silenced or taped over; very loud sounders near the ear add to noise exposure ([[noise-exposure]]).

### Being understood: urgency and meaning
- **Urgency** is heard in the sound: faster pulses, higher pitch, more irregular rhythm and higher level sound more urgent. Keep high-urgency sounds for high-urgency events.
- **Meaning**: few distinct sounds, each learnt; spoken messages ("Fire in hall two — leave by the east doors") are understood without training. Medical devices use standardised priority patterns (IEC 60601-1-8).
- **Visual alarms**: beacons and flashing symbols locate the problem and persist after the sound stops. Flash no faster than **3 times per second** (photosensitive epilepsy); red for danger, amber for warning; put them in the field of view ([[displays-design]]).
- **Tactile**: vibrating pagers, seats and steering wheels for noisy places, protective suits and drivers.

### Being answered: alarm management
In a control room every alarm is a demand on the operator's attention. The UK investigation of the 1994 Milford Haven refinery explosion found that in the last 11 minutes two operators had to recognise, acknowledge and act on 275 alarms; at Three Mile Island in 1979 more than a hundred alarms sounded in the first minutes. Alarm-management guidance (EEMUA 191, ANSI/ISA-18.2, IEC 62682) asks that:

- **every alarm requires an operator action** — otherwise it is an event, not an alarm;
- in normal running an operator receives **about one alarm per ten minutes or fewer**; after an upset, **no more than about ten in the first ten minutes**;
- priorities are few and meaningful, with high priority rare;
- nuisance, chattering and standing alarms are removed, and floods suppressed by logic.

In hospitals the same problem appears as **alarm fatigue**: monitors that alarm constantly, mostly for nothing, teach staff to ignore them.

### Warnings: signs and labels
Warning signs follow ISO 3864 (safety colours and shapes: a yellow triangle for warning, a red circle for prohibition, a blue circle for mandatory actions) and, in North America, ANSI Z535 with the signal words DANGER, WARNING and CAUTION. A warning is the **last** line of defence: design the hazard out first, then guard it, and only then warn ([[machine-ergonomics-principles]]).

### Settings
- **Workshop and industry:** 85–100 dB(A) noise and hearing protection: sounders close to people, beacons, vibrating pagers.
- **Control rooms:** alarm floods, priorities, shelving ([[control-rooms]]).
- **Health care:** alarm fatigue in wards and intensive care.
- **Vehicles:** collision and lane warnings by sound, seat vibration and head-up symbols; not too many.
- **Military:** cockpit master warning and caution, voice warnings, CBRN and fire alarms heard in hearing protection and helmets.
- **Civil:** fire alarms and evacuation messages heard in every room, including by people who are hard of hearing (visual and vibrating alarms).

In the simulation, set a noise spectrum, an alarm tone and the listener's distance, hearing and protectors, and see whether the alarm clears the ISO 7731 criteria; then switch to the alarm flood and watch the backlog grow.

> [!warn] An alarm that nobody can hear, or one of hundreds, is no alarm. Check audibility with the machines running and the protectors on, and count the alarms an operator really receives.

> [!key] Heard (≥ 15 dB(A) above the noise, not deafening), understood (distinct urgency and meaning), located (visual cue), answerable (few, prioritised, each with an action).
`,
  ideas: [
    'An alarm must be noticed, understood, located and answered — design for all four.',
    'ISO 7731: at the listener the alarm should exceed the ambient noise by more than 15 dB(A), or by 10 dB above the masked threshold in an octave band.',
    'Sound falls about 6 dB per doubling of distance: several sounders near people beat one very loud sounder.',
    'Urgency is coded by pulse rate, pitch and rhythm; visual alarms locate and persist; flash no faster than 3 per second.',
    'Alarm management: every alarm needs an action; about one per ten minutes in normal running, no more than about ten in the ten minutes after an upset (EEMUA 191, IEC 62682).'
  ],
  pitfalls: [
    'Louder is always better — Alarms far above the noise startle, mask speech, add to noise exposure and get silenced.',
    'More alarms mean more safety — Floods bury the important alarm; every alarm must require an action.',
    'A warning sign makes a hazard acceptable — Warnings are the last line: design out and guard first.'
  ],
  formulas: [
    {
      name: 'Alarm level at a distance (free field)',
      expr: 'Lr = L1 - 20*log(r/r1)', tex: 'L_r = L_1 - 20\\log_{10}\\dfrac{r}{r_1}',
      vars: {
        Lr: { name: 'level at the listener', q: 'soundlevel', unit: 'dB', tex: 'L_r' },
        L1: { name: 'level at the reference distance', q: 'soundlevel', unit: 'dB', value: 100, tex: 'L_1' },
        r: { name: 'distance to the listener', q: 'length', unit: 'm', value: 8 },
        r1: { name: 'reference distance', q: 'length', unit: 'm', value: 1, tex: 'r_1' }
      },
      note: 'The inverse-square law: −6 dB per doubling of distance. Rooms reflect sound, so indoors the level falls more slowly far from the source; obstacles cast shadows.',
      stories: { Lr: 'A sounder gives {L1} at {r1}. What level reaches a worker {r} away?', r: 'A sounder gives {L1} at {r1}. How far away does its level fall to {Lr}?' }
    },
    {
      name: 'Two sound levels together',
      expr: 'L = 10*log(10^(L1/10) + 10^(L2/10))', tex: 'L = 10\\log_{10}\\!\\left(10^{L_1/10} + 10^{L_2/10}\\right)',
      vars: {
        L: { name: 'combined level', q: 'soundlevel', unit: 'dB' },
        L1: { name: 'first level (e.g. the alarm)', q: 'soundlevel', unit: 'dB', value: 88, tex: 'L_1' },
        L2: { name: 'second level (e.g. the noise)', q: 'soundlevel', unit: 'dB', value: 85, tex: 'L_2' }
      },
      note: 'Decibels add as powers: two equal levels give 3 dB more; a level 10 dB below another adds less than 0.5 dB.',
      stories: { L: 'An alarm of {L1} sounds in noise of {L2}. What is the combined level?' }
    }
  ],
  examples: [
    {
      title: 'Is one sounder enough?',
      q: 'A workshop has 85 dB(A) of noise. A sounder gives 110 dB(A) at 1 m. Using the 15 dB(A) criterion of ISO 7731, how far away is it clearly audible?',
      steps: [
        'The alarm needs at least $85 + 15 = 100$ dB(A) at the listener.',
        '$100 = 110 - 20\\log_{10} r$ gives $\\log_{10} r = 0.5$, $r = 3.2$ m.',
        'At 8 m it gives $110 - 20\\log_{10} 8 = 92$ dB(A) — only 7 dB above the noise. Use several sounders spread through the hall, plus beacons.'
      ],
      a: 'Only to about 3 m; spread several sounders and add beacons.'
    },
    {
      title: 'A flood after a trip',
      q: 'After a compressor trip, 150 alarms arrive in 10 minutes. An operator needs about 30 s to read, judge and answer each. How many can be handled, and what does the guidance say?',
      steps: [
        'In 10 minutes the operator handles about $600/30 = 20$ alarms; 130 wait in a queue, among them perhaps the one that matters.',
        'Alarm-management guidance aims for no more than about 10 alarms in the first 10 minutes after an upset.',
        'Suppress consequential alarms by logic (the trip explains them), and give the few that need action a clear priority.'
      ],
      a: 'About 20 of 150; the design should cut the flood to about 10.'
    }
  ],
  quiz: [
    { q: 'Ambient noise is 90 dB(A). What alarm level at the listener satisfies the simplest ISO 7731 criterion?', choices: ['More than 105 dB(A)', '90 dB(A)', '93 dB(A)', '120 dB(A) at least'], a: 0, why: 'The A-weighted signal level must exceed the ambient noise by more than 15 dB.' },
    { q: 'A worker moves from 2 m to 8 m from a sounder. How much quieter is the alarm in the open?', choices: ['About 12 dB', 'About 6 dB', 'About 24 dB', 'Four times quieter in dB'], a: 0, why: 'Two doublings of distance, 6 dB each: 20 log₁₀ 4 = 12 dB.' },
    { q: 'What does alarm-management guidance say about an alarm that needs no operator action?', choices: ['It should not be an alarm', 'It should be high priority', 'It should sound louder', 'It should repeat every minute'], a: 0, why: 'Alarms exist to prompt action; anything else is an event or a message and only adds to floods.' },
    { q: 'True or false: a visual alarm should flash as fast as possible to be noticed.', a: false, why: 'Flashing faster than about 3 per second can trigger seizures in people with photosensitive epilepsy; slower flashes are noticed well.' },
    { q: 'Which sound feels most urgent?', choices: ['Fast, high-pitched, irregular pulses', 'A slow, low, steady tone', 'Soft music', 'Silence'], a: 0, why: 'Pulse rate, pitch and irregularity all raise perceived urgency; keep such sounds for urgent events.' }
  ],
  problems: [
    { q: 'A beacon sounder gives 105 dB at 1 m. What level reaches a worker 10 m away in the open?', answer: 85, unit: 'dB', tol: 0.01, steps: ['$L = 105 - 20\\log_{10} 10 = 105 - 20 = 85$ dB.'] },
    { q: 'An alarm of 88 dB sounds in noise of 85 dB. What is the combined level?', answer: 89.8, unit: 'dB', tol: 0.005, steps: ['$10\\log_{10}(10^{8.8} + 10^{8.5}) = 10\\log_{10}(6.31 \\times 10^8 + 3.16 \\times 10^8) = 89.8$ dB.'] }
  ],
  ranges: [
    { dim: 'Alarm level above the ambient noise at the listener (A-weighted)', range: [15, null], unit: 'dB', who: 'Every person who must hear it, where they work', why: 'Clearly audible above the noise, without searching for it.', limits: 'Check with hearing protectors worn and with workers\' hearing loss; very loud alarms startle and are silenced.', setting: ['workshop', 'civil', 'field'], src: 'ISO 7731' },
    { dim: 'Alarm above the masked threshold in at least one octave band', range: [10, null], unit: 'dB', who: 'Listeners in noise with a strong spectrum', why: 'A finer check than the A-weighted criterion, where the noise is concentrated in some bands.', limits: 'Needs an octave-band analysis of the noise.', setting: ['workshop'], src: 'ISO 7731' },
    { dim: 'Main frequencies of auditory alarm signals', range: [500, 2500], unit: 'Hz', who: 'Listeners in noise, including with hearing protection', why: 'Carries well, heard well by most people.', limits: 'Include energy below about 1500 Hz for people with high-frequency hearing loss; follow ISO 7731 for the details.', setting: ['workshop', 'civil'], src: 'ISO 7731' },
    { dim: 'Alarm rate per operator in normal operation', range: '≈ 1 per 10 minutes or fewer', unit: '', who: 'Control-room and machine operators', why: 'Each alarm can be read, judged and answered.', limits: 'An average; peaks after upsets must also be limited.', setting: ['workshop'], src: 'EEMUA 191; ANSI/ISA-18.2; IEC 62682' },
    { dim: 'Alarms in the first 10 minutes after a process upset', range: [null, 10], unit: 'alarms', who: 'One operator', why: 'The important alarm is not lost in a flood.', limits: 'Needs suppression logic and rationalisation of the alarm list.', setting: ['workshop'], src: 'EEMUA 191' },
    { dim: 'Flash rate of visual alarms', range: [null, 3], unit: 'flashes/s', who: 'People with photosensitive epilepsy among the viewers', why: 'Noticed without the risk of triggering seizures.', limits: 'Large, bright, red flashes are the most provocative; keep them small and slow.', setting: ['all'], src: 'WCAG 2 (three flashes threshold)' }
  ],
  applications: [
    'Machine and hall sounders with beacons, planned by noise mapping.',
    'Control-room alarm rationalisation, priorities and flood suppression.',
    'Medical-device alarms with standard priority patterns.',
    'Evacuation alarms with spoken messages, visual and vibrating alerts for people who are hard of hearing.'
  ],
  history: 'Alarm floods became a recognised hazard after Three Mile Island (1979) and the Milford Haven refinery explosion (1994). The Engineering Equipment and Materials Users\' Association published EEMUA 191 in 1999; ANSI/ISA-18.2 (2009) and IEC 62682 (2014) made alarm management a lifecycle discipline.',
  sources: [
    'ISO 7731, *Ergonomics — Danger signals for public and work areas — Auditory danger signals*.',
    'EEMUA Publication 191, *Alarm systems — a guide to design, management and procurement*.',
    'IEC 62682 / ANSI/ISA-18.2, *Management of alarm systems for the process industries*.',
    'ISO 3864, *Graphical symbols — Safety colours and safety signs*; ANSI Z535 series (safety signs and signal words).',
    'IEC 60601-1-8, *Medical electrical equipment — alarm systems*.',
    'J. Edworthy, S. Loxley and I. Dennis, "Improving auditory warning design: relationship between warning sound parameters and perceived urgency", *Human Factors* 33 (1991).'
  ],
  sim: 'mc-alarm'
},

{
  id: 'hmi-screens', parent: 'controls-displays', title: 'Touchscreens and HMI panels', level: 2,
  short: 'Touch panels put a whole control desk on one screen — and take away the feel of the controls. They work when targets are big enough for the finger or glove that uses them (about 9–10 mm bare, 15–20 mm with gloves or vibration), feedback comes within a tenth of a second, screens follow a clear hierarchy with colour kept for the abnormal, and safety functions such as the emergency stop stay hard-wired.',
  keywords: ['HMI', 'human–machine interface', 'touchscreen', 'touch target size', 'glove', 'feedback', 'response time', 'ISO 9241-110', 'dialogue principles', 'ISA-101', 'high-performance HMI', 'display hierarchy', 'grey background', 'confirmation', 'undo', 'emergency stop on touchscreen', 'pixel density', 'ppi', 'graphical symbols'],
  prereq: ['fitts-law', 'hick-law', 'displays-design', 'usability'],
  related: ['controls-design', 'alarms-warnings', 'stereotypes-compatibility', 'control-rooms', 'field-computing', 'driver-workspace', 'information-design', 'motors:emergency-stop'],
  body: `
A modern machine is often run from a touch panel: recipes, settings, diagnostics, jogging, alarms — all on one screen that can change with every software update. It is flexible and cheap, and it loses what physical controls gave for free: you cannot find a touch button without looking, you cannot feel whether it moved, gloves and wet fingers may not register, and a setting can hide three pages deep. Good HMI design gives back what the screen takes away.

### Targets the finger can hit
A fingertip is not a mouse pointer: it covers what it touches and lands with a scatter around the point aimed at. If the scatter is a [[?gaussian]] of standard deviation $\\sigma$ in each direction, a square target of side $W$ is hit with probability

$$P = \\left[2\\,\\Phi\\!\\left(\\frac{W}{2\\sigma}\\right) - 1\\right]^2$$

For a careful bare finger on a still screen ($\\sigma$ about 1.8 mm in this model) a 9 mm target is hit about 97.5 % of the time and a 7 mm target only 90 %. Gloves, haste, standing at a machine, a vibrating vehicle or an older hand widen the scatter: at $\\sigma$ = 3 mm the 9 mm target falls to 75 % and it takes about 18 mm to get back above 99 %. Hence the rules of practice:

| Situation | Target size | Notes |
|---|---|---|
| Bare finger, seated, still | about 9–10 mm | phone guidelines of 44 pt or 48 dp are about 7–9 mm |
| Standing at a machine, occasional gloves | about 12–15 mm | larger gaps between targets |
| Gloves, vibration, a moving vehicle | about 15–20 mm | support for the hand: a ledge or grip beside the screen |

On a screen the size is set in pixels: $w = n \\times 25.4/\\mathrm{ppi}$ millimetres for $n$ pixels on a screen of a given pixel density. The same button in pixels is a different size on every panel — design in millimetres. Movement time follows [[fitts-law]], and the number of choices per screen [[hick-law]].

### Feedback and response
Every touch must answer at once — a change of colour, a click, a vibration — within about **0.1 s**, which feels instantaneous; after about **1 s** people need a sign that the system is working, and beyond about **10 s** a progress indicator, or they press again or walk away (the classic response-time limits of Miller, Card and Nielsen). A repeated press on a slow panel is a classic cause of double actions.

### Screens that tell the truth quickly
- **Dialogue principles** (ISO 9241-110): suitable for the task, self-descriptive, conforming to what users expect, controllable, robust against use errors, easy to learn.
- **High-performance HMI** (ANSI/ISA-101): grey or muted backgrounds, colour reserved for abnormal conditions and alarms, analogue indicators and trends that show the normal range, and a hierarchy of screens from an overview down to detail and diagnostics.
- **Consistency**: the same place, symbol and colour for the same function on every screen and every machine; standard graphical symbols (ISO 7000, IEC 60417).
- **Errors**: confirm only what is critical (too many confirmations are clicked through), make actions reversible (undo), show units and limits next to entry fields, reject impossible values.
- **Language**: short, specific labels; translations checked on the machine, where text can overflow.

### Where the screen goes
A touch panel is both a display and a control: it must lie in the field of view (about 0–30° below the horizontal, see [[displays-design]]) and within easy reach, without the arm held up for long. For standing operators a centre height of about 1300–1500 mm, tilted back, is a common compromise — or an adjustable arm. Sunlight needs high-brightness screens and hoods; dirty and wet places need screens that ignore water drops and work with gloves (resistive screens or glove modes).

### What must not be on the touchscreen alone
The **emergency stop** must be a physical, hard-wired device (ISO 13850, IEC 60204-1) — never only a button on a screen. Safety functions, enabling devices and hold-to-run controls for jogging are physical too; a screen may show their state.

### Settings
- **Workshop and industry:** machine HMIs used with gloves and oily fingers; recipes and diagnostics.
- **Control rooms:** many screens, alarm displays, long shifts ([[control-rooms]]).
- **Vehicles:** infotainment and machine-control screens used on the move; every glance and every target costs attention ([[driver-workspace]]).
- **Military:** crew-station and cockpit touchscreens in vibration and turbulence, with gloves, night vision and stress.
- **Field and health:** rugged tablets in rain and sun ([[field-computing]]); medical devices cleaned with disinfectant and used by tired staff.

In the simulation, set the target size and gap, the glove and the situation, and watch simulated touches land; then compensate the typical touch offset and see the neighbours' hits fall.

> [!warn] Never put the emergency stop, or any safety function, only on a touchscreen. It must be a physical, hard-wired device reachable from the operating position.

> [!key] Design touch targets in millimetres for the finger or glove that uses them, answer every touch within 0.1 s, keep colour for the abnormal, and keep safety functions physical.
`,
  ideas: [
    'A finger covers what it touches and lands with a scatter; target sizes follow from it: about 9–10 mm bare and still, 15–20 mm with gloves or vibration.',
    'Design in millimetres: w = n·25.4/ppi — the same pixel size differs between panels.',
    'Feedback within about 0.1 s; a sign of progress after about 1 s; a progress indicator beyond about 10 s.',
    'High-performance HMI: muted backgrounds, colour for the abnormal, trends with normal ranges, a clear hierarchy of screens (ISA-101).',
    'The emergency stop and other safety functions stay physical and hard-wired.'
  ],
  pitfalls: [
    'A button that looks big enough on the designer\'s monitor is big enough — On the machine\'s panel, with a gloved finger and vibration, it may be half the size needed.',
    'Colour everywhere makes a screen clear — When everything is coloured, alarms no longer stand out; keep colour for the abnormal.',
    'A confirmation dialog for every action prevents errors — People learn to click through them; confirm only what is critical and make actions reversible.'
  ],
  formulas: [
    {
      name: 'Chance of hitting a square touch target',
      expr: 'P = (2*ncdf(W/(2*s)) - 1)^2', tex: 'P = \\left[2\\,\\Phi\\!\\left(\\dfrac{W}{2\\sigma}\\right) - 1\\right]^2',
      vars: {
        P: { name: 'probability of a hit', q: 'ratio', unit: '%' },
        W: { name: 'target side', q: 'length', unit: 'mm', value: 9 },
        s: { name: 'touch scatter (standard deviation per axis)', q: 'length', unit: 'mm', value: 1.8, tex: '\\sigma' }
      },
      note: 'A model: touches scatter normally and independently in x and y around the target centre, with no systematic offset. Representative σ: about 1.5–2 mm bare and still, 3 mm or more with gloves or vibration.',
      stories: { P: 'A touch target is {W} square; touches scatter with σ = {s}. What share hit it?', W: 'Touches scatter with σ = {s}. How large must a square target be for a hit rate of {P}?' }
    },
    {
      name: 'Size on the screen from pixels',
      expr: 'w = n*25.4/ppi', tex: 'w = \\dfrac{25.4\\,n}{\\mathrm{ppi}}',
      vars: {
        w: { name: 'size on the screen', q: false, unit: 'mm' },
        n: { name: 'size in pixels', q: false, unit: 'px', value: 80 },
        ppi: { name: 'pixel density', q: false, unit: 'px/in', value: 133, tex: '\\mathrm{ppi}' }
      },
      note: '25.4 mm per inch. Pixel density = diagonal in pixels / diagonal in inches.',
      stories: { w: 'A button is {n} wide on a screen of {ppi}. How wide is it in millimetres?', n: 'A panel has {ppi}. How many pixels make a button {w} wide?' }
    }
  ],
  examples: [
    {
      title: 'Gloves on a touch panel',
      q: 'Touches scatter with σ = 1.8 mm for a careful bare finger and about 3 mm with work gloves. What share of touches hit a 9 mm target in each case, and how large must the target be with gloves for about 99.5 %?',
      steps: [
        'Bare: $W/2\\sigma = 2.5$, $\\Phi = 0.9938$, $P = (2 \\times 0.9938 - 1)^2 = 0.975$.',
        'Gloves: $W/2\\sigma = 1.5$, $\\Phi = 0.9332$, $P = 0.8664^2 = 0.75$ — one touch in four misses.',
        'With gloves an 18 mm target gives $W/2\\sigma = 3$, $\\Phi = 0.99865$, $P = 0.995$.'
      ],
      a: '97.5 % bare, 75 % gloved at 9 mm; about 18 mm restores 99.5 % with gloves.'
    },
    {
      title: 'Designing a machine panel in millimetres',
      q: 'A 7-inch HMI panel has 800 × 480 pixels. How many pixels make a 15 mm button, and how many such buttons fit across with 10-pixel gaps?',
      steps: [
        'Pixel density: $\\sqrt{800^2 + 480^2}/7 = 933/7 = 133$ px per inch.',
        '15 mm: $n = 15 \\times 133/25.4 = 79$ pixels, say 80.',
        'Across 800 pixels: $800/(80 + 10) \\approx 8$ buttons — the screen is only 152 mm wide. Fewer, larger targets and a clear hierarchy of screens follow.'
      ],
      a: 'About 80 pixels per button; about eight across the panel.'
    }
  ],
  quiz: [
    { q: 'A touch button measures 5 mm on the panel. What is the main problem?', choices: ['The finger covers it and often misses: it is below finger size', 'It uses too much memory', 'It is too fast to press', 'Nothing — any size works'], a: 0, why: 'Below about 9 mm the finger\'s own size and scatter make misses and neighbour hits common.' },
    { q: 'How quickly should a touchscreen show that a touch was received?', choices: ['Within about 0.1 s', 'Within about 2 s', 'Within about 10 s', 'Only when the action is complete'], a: 0, why: 'About 0.1 s feels instantaneous; slower feedback leads to repeated presses and double actions.' },
    { q: 'In a high-performance HMI, what is colour mainly used for?', choices: ['Abnormal conditions and alarms', 'Decoration and branding', 'Every value, to make the screen lively', 'Nothing — screens are monochrome'], a: 0, why: 'With muted normal screens, colour draws the eye straight to what is wrong.' },
    { q: 'True or false: an emergency-stop button on the HMI screen is an acceptable emergency stop.', a: false, why: 'The emergency stop must be a physical, hard-wired device (ISO 13850, IEC 60204-1); a screen can fail, freeze or be on the wrong page.' },
    { q: 'A button is 60 pixels wide on a 160 ppi panel. How wide is it?', choices: ['About 9.5 mm', 'About 60 mm', 'About 3.8 mm', 'About 16 mm'], a: 0, why: 'w = 60 × 25.4 / 160 = 9.5 mm.' }
  ],
  problems: [
    { q: 'With a touch scatter of σ = 2 mm, what share of touches hit a 10 mm square target?', answer: 97.5, unit: '%', tol: 0.01, steps: ['$W/2\\sigma = 2.5$, $\\Phi(2.5) = 0.9938$.', '$P = (2 \\times 0.9938 - 1)^2 = 0.975$.'] },
    { q: 'How many pixels wide must a 12 mm button be on a panel of 200 ppi?', answer: 94.5, unit: '', tol: 0.02, steps: ['$n = 12 \\times 200/25.4 = 94.5$ pixels.'] }
  ],
  ranges: [
    { dim: 'Touch target size, bare finger, still screen', range: [9, 10], unit: 'mm', who: 'Adult fingertips aiming carefully', why: 'Few misses, the finger does not hide the whole target.', limits: 'More for the thumb, older users, haste or a moving situation.', setting: ['office', 'civil', 'health'], src: 'HCI touch studies; mobile platform guidelines (44 pt, 48 dp)' },
    { dim: 'Touch target size with gloves, vibration or standing at a machine', range: [15, 20], unit: 'mm', who: 'Gloved fingers, shaking hands, moving vehicles', why: 'Keeps misses and neighbour hits rare when the scatter grows.', limits: 'Fewer targets per screen; check that the screen responds to gloves at all.', setting: ['workshop', 'vehicle', 'military', 'field'], src: 'Industrial HMI practice; MIL-STD-1472 (touch screens)' },
    { dim: 'Feedback after a touch', range: [null, 0.1], unit: 's', who: 'Every user', why: 'Feels instantaneous; no repeated presses.', limits: 'After about 1 s show activity; beyond about 10 s show progress.', setting: ['all'], src: 'Miller (1968); Card, Robertson and Mackinlay (1991); Nielsen (1993)' },
    { dim: 'Centre height of a touch panel for standing operators', range: [1300, 1500], unit: 'mm', who: 'A compromise between the reach and shoulders of the 5th-percentile woman and the downward gaze of the 95th-percentile man', why: 'Seen without craning and touched without raising the arm for long.', limits: 'Tilt the panel back; an adjustable arm fits everyone better.', setting: ['workshop'], src: 'ISO 9355-2 (method); this app\'s representative adult body data' },
    { dim: 'Vertical position of an HMI screen in the field of view', range: [0, 30], unit: '° below the horizontal line of sight', who: 'Operators with the head upright', why: 'Read with the eyes alone.', limits: 'A touch panel also has to be within easy reach: a compromise.', setting: ['workshop', 'office', 'vehicle'], src: 'ISO 9355-2' }
  ],
  applications: [
    'Machine HMI panels with large targets, a screen hierarchy and physical safety controls.',
    'Control-room displays built on high-performance HMI principles (ISA-101).',
    'Vehicle and field tablets designed for gloves, sunlight and vibration.',
    'Medical-device touchscreens with confirmations only for critical actions.'
  ],
  sources: [
    'ISO 9241-110, *Ergonomics of human-system interaction — Interaction principles*.',
    'ANSI/ISA-101.01, *Human Machine Interfaces for Process Automation Systems*.',
    'ISO 13850, *Safety of machinery — Emergency stop function*; IEC 60204-1, *Safety of machinery — Electrical equipment of machines*.',
    'ISO 7000 and IEC 60417, graphical symbols for use on equipment.',
    'R. B. Miller, "Response time in man-computer conversational transactions" (1968); J. Nielsen, *Usability Engineering* (1993) — response-time limits.',
    'C. D. Wickens et al., *Engineering Psychology and Human Performance* — displays, controls and touch.'
  ],
  sim: ['mc-touch-panel', 'mc-fitts']
}

);
