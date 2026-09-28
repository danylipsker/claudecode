/* HYPER-ERGONOMICS · content/workshop-services.js
 * The workshop (standing work heights, workbenches, assembly lines, hand tools, power tools, material flow, standing all
 * day) and special settings (patient handling, hospital workstations, school furniture, retail checkouts, commercial
 * kitchens, laboratories). Simulations in sims/workshop-services.js (prefix wk-). */
Hyper.add(

{
  id: 'standing-work-heights', parent: 'workshop-topic', title: 'Working heights standing', level: 1,
  short: 'At a standing workplace the right height comes from the elbow and the task: a little above the elbow for fine, visually demanding work, 100–150 mm below it for light work, and 150–400 mm below it for heavy work that uses the body\'s weight. Elbow heights differ by about 250 mm between the 5th-percentile woman and the 95th-percentile man, so a fixed bench suits only a minority for any one task.',
  keywords: ['standing work height', 'bench height', 'elbow height', 'precision work', 'light work', 'heavy work', 'working point', 'work surface height', 'Grandjean', 'platform', 'shoe allowance', 'viewing angle', 'standing workstation'],
  prereq: ['standing-dimensions', 'neutral-postures', 'design-for-range'],
  related: ['workbench-design', 'assembly-lines', 'standing-all-day', 'static-muscle-work', 'spinal-loading', 'kitchen-ergonomics', 'laboratory-ergonomics', 'patient-handling', 'operator-positions', 'counters-reception'],
  body: `
The hands work best when the upper arms hang relaxed at the sides and the forearms are about level. That makes the **elbow** the reference for every standing work height. In the representative data used here, standing elbow height is 1100 ± 50 mm for men and 1015 ± 46 mm for women, barefoot ([[?mean]] ± [[?standard-deviation]]); shoes add about 25 mm, work boots more. From the 5th-percentile woman (939 mm) to the 95th-percentile man (1182 mm) the spread is about 245 mm, which is as large as the whole difference between light and heavy work.

### Three kinds of task
| Task | Working point relative to the elbow | Why | Examples |
|---|---|---|---|
| **Precision** | 50–100 mm *above* | the work comes nearer the eyes; the elbows or forearms can rest on the surface or on pads | fine assembly, soldering, inspection, engraving, watch repair |
| **Light work** | 100–150 mm *below* | the hands move freely without raising the shoulders; room for tools and parts | packing, light assembly, wiring, bench fitting |
| **Heavy work** | 150–400 mm *below* | the body's weight adds to the push; the arms press down with straight elbows | planing, sanding, heavy fitting, kneading dough |

These offsets are the classic recommendations of Grandjean, carried on by Kroemer and Grandjean. They refer to the **working point** (where the hands are), not to the bench top. A workpiece 150 mm tall needs a bench 150 mm lower:

$$h_b = h_e + a_s + \\Delta h - h_o$$

with $h_e$ the elbow height, $a_s$ the shoe allowance, $\\Delta h$ the task offset and $h_o$ the height of the object.

### Through the population
| Worker (with 25 mm of shoe) | Elbow | Precision | Light | Heavy |
|---|---|---|---|---|
| 5th-percentile woman | 964 | 1014–1064 | 814–864 | 564–814 |
| 50th-percentile woman | 1040 | 1090–1140 | 890–940 | 640–890 |
| 50th-percentile man | 1125 | 1175–1225 | 975–1025 | 725–975 |
| 95th-percentile man | 1207 | 1257–1307 | 1057–1107 | 807–1057 |

A fixed bench at 950 mm, a common choice, puts light work inside the 50 mm band for only about 28 % of a workforce of equal numbers of men and women; no fixed height does better than that. The rest work a little stooped or a little hunched. A bench that adjusts from about 810 to 1110 mm fits almost all of them. Where benches cannot adjust, set them for the tallest users and raise the others on platforms: people can be raised, but not lowered.

### What goes wrong
- **Too high**: the shoulders lift and the upper arms move away from the body. The trapezius muscles work statically all shift, which leads to neck and shoulder pain (see [[static-muscle-work]]).
- **Too low**: the back and neck bend forward. The trunk becomes a cantilever loading the lower back (see [[spinal-loading]]), and in visual work the head drops too.
- **Precision work and the eyes**: the gaze angle below the horizontal is $\\theta = \\arctan\\big((h_{eye} - h_w)/d\\big)$ (an [[?inverse-trig|arctangent]]). The eyes alone comfortably cover only the first 15–30°; steeper gazes bend the neck. Raising the work, tilting it towards the worker, supporting the forearms and adding magnification all help.

### Settings
- **Workshop and industry**: every task has its height, and one bench often serves several tasks and shifts. Height-adjustable benches, jigs on adjustable columns and platforms pay back quickly. Safety boots and anti-fatigue mats raise the worker by 20–40 mm; measure in the real footwear.
- **Home**: a kitchen worktop near 900 mm is a light-work height for the median woman but low for most men (see [[kitchen-ergonomics]]).
- **Health care**: bed heights for nursing care follow the same rule (see [[patient-handling]]).
- **Military and field**: vehicle maintenance, field kitchens and workshops in containers or tents often work at the ground or at a tailgate. Adjustable trestles, stands and kneeling pads bring the work back towards elbow height.

In the simulation, choose a person and a task and move the bench: the green band is the recommended working height for that person; the chart on the right shows which percentiles of the workforce a fixed bench, platforms or an adjustable bench fit.

> [!key] Set the working point, not the bench, from the elbow of the actual worker and the task: above the elbow for precision, just below for light work, well below for heavy work. Then subtract the height of the workpiece.

> [!tip] If a bench must be fixed, set it for the tallest users of the task and provide stable, non-slip platforms (with marked edges) for the others. Check the height with the worker in their real shoes.
`,
  ideas: [
    'Standing work heights are set relative to elbow height, not as fixed numbers.',
    'Precision work goes 50–100 mm above the elbow, light work 100–150 mm below, heavy work 150–400 mm below.',
    'The height that matters is the working point: subtract the height of the workpiece from it to get the bench height.',
    'Elbow heights spread by about 250 mm across the 5th-woman to 95th-man range, so fixed benches fit only a minority for any one task.',
    'Adjustable benches, adjustable fixtures and platforms (for a bench set for the tallest) fit the whole workforce.'
  ],
  pitfalls: [
    'A standard bench height of 900 mm suits everyone — It suits light work for about the median woman; the median man needs 975–1025 mm and the 5th-percentile woman 814–864 mm.',
    'Higher is always better for the back — Above the elbow the shoulders lift and the neck and shoulder muscles work statically; only precision work, with arm support, belongs above the elbow.',
    'The bench top is the working height — The hands work on top of the workpiece; a 150 mm part on a bench makes the working point 150 mm higher.'
  ],
  formulas: [
    {
      name: 'Bench height for a task',
      expr: 'hb = he + a + dh - ho', tex: 'h_b = h_e + a_s + \\Delta h - h_o',
      vars: {
        hb: { name: 'bench (work surface) height', q: 'length', unit: 'mm', tex: 'h_b' },
        he: { name: 'standing elbow height, barefoot', q: 'length', unit: 'mm', value: 1015, tex: 'h_e' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        dh: { name: 'task offset: +50…+100 precision, −100…−150 light, −150…−400 heavy', q: 'length', unit: 'mm', value: -125, signed: true, tex: '\\Delta h' },
        ho: { name: 'height of the workpiece above the bench', q: 'length', unit: 'mm', value: 50, tex: 'h_o' }
      },
      note: 'The working point is h_e + a_s + Δh; the bench goes lower by the height of whatever is being worked on.',
      stories: { hb: 'A worker with an elbow height of {he} (barefoot) and {a} of shoe does light work (offset {dh}) on a part {ho} tall. How high should the bench be?', dh: 'A bench is {hb} high, the part is {ho} tall and the worker\'s elbow is at {he} plus {a} of shoe. How far above (+) or below (−) the elbow are the hands?' }
    },
    {
      name: 'Gaze angle to the work',
      expr: 'theta = atan((hy - hw)/d)', tex: '\\theta = \\arctan\\dfrac{h_{eye} - h_w}{d}',
      vars: {
        theta: { name: 'gaze angle below the horizontal', q: 'angle', unit: '°', tex: '\\theta' },
        hy: { name: 'standing eye height (with shoes)', q: 'length', unit: 'mm', value: 1540, tex: 'h_{eye}' },
        hw: { name: 'height of the working point', q: 'length', unit: 'mm', value: 1115, tex: 'h_w' },
        d: { name: 'horizontal distance from the eyes to the work', q: 'length', unit: 'mm', value: 350 }
      },
      note: 'The eyes comfortably look 15–30° below the head\'s horizontal; the rest of a steep gaze comes from bending the neck or the trunk.',
      stories: { theta: 'Eyes at {hy} look at work at {hw}, {d} in front. How far below the horizontal is the gaze?', hw: 'To keep the gaze at {theta} below the horizontal with eyes at {hy} and work {d} away, how high must the work be?' }
    }
  ],
  examples: [
    {
      title: 'A light-assembly bench for a mixed team',
      q: 'Men and women share a light-assembly bench, working directly on the surface. Elbow heights are 1100 ± 50 mm (men) and 1015 ± 46 mm (women), barefoot, with 25 mm of shoe. What range must the bench cover to suit the 5th-percentile woman to the 95th-percentile man?',
      steps: [
        '5th-percentile woman: $1015 - 1.645 \\times 46 = 939$ mm; with shoes 964 mm; light work 100–150 mm below: 814–864 mm.',
        '95th-percentile man: $1100 + 1.645 \\times 50 = 1182$ mm; with shoes 1207 mm; light work: 1057–1107 mm.',
        'A bench adjustable from about 810 to 1110 mm covers both; a fixed bench at 950 mm is in the band for only about 28 % of the team.'
      ],
      a: 'About 810–1110 mm of adjustment (a stroke of roughly 300 mm).'
    },
    {
      title: 'Raising precision work',
      q: 'The median woman (elbow 1015 mm, eyes 1515 mm, barefoot; 25 mm of shoe) solders a board held 60 mm above the bench, with her eyes 350 mm behind the work. Compare the gaze angle with the working point at a precision height (1115 mm) and at a light-work height (915 mm).',
      steps: [
        'Precision band: $1040 + 50$ to $1040 + 100$ = 1090–1140 mm; take 1115 mm, so the bench is $1115 - 60 = 1055$ mm.',
        { text: 'Eyes at 1540 mm with shoes; at 1115 mm:', tex: '\\theta = \\arctan\\frac{1540 - 1115}{350} = 50.5^\\circ' },
        'At 915 mm: $\\arctan(625/350) = 60.8°$, about 10° steeper, and the eyes are also farther from the joint.',
        'Even at 1115 mm the gaze is steep: fine work is usually raised further, tilted, magnified, or done sitting with the forearms supported.'
      ],
      a: 'About 50° below the horizontal at the precision height against 61° at the light-work height.'
    }
  ],
  quiz: [
    { q: 'A worker sands panels, pressing down hard. Where should the panel surface be?', choices: ['150–400 mm below the elbow', '50–100 mm above the elbow', 'At elbow height exactly', 'At shoulder height'], a: 0, why: 'Heavy work goes well below the elbow so that the body\'s weight helps and the arms push down with straight elbows.' },
    { q: 'A man with a barefoot elbow height of 1100 mm, in 25 mm shoes, assembles a gearbox 150 mm tall (light work, offset −125 mm). How high should the bench be (mm)?', answer: 850, unit: 'mm', why: '$1100 + 25 - 125 - 150 = 850$ mm: the gearbox, not the bench, is where the hands work.' },
    { q: 'A 900 mm bench suits most men for light work.', a: false, why: 'The median man\'s light-work band is 975–1025 mm; 900 mm makes most men stoop. It suits about the median woman.' },
    { q: 'Why is precision work set above the elbow?', choices: ['To bring the work closer to the eyes and let the forearms rest on supports', 'Because the hands are stronger there', 'So that the shoulders can rise', 'To make the worker stand taller'], a: 0, why: 'Fine visual work needs the work near the eyes; with forearm supports the raised arms do not tire the shoulders.' },
    { q: 'A bench cannot be adjusted. Which users should it be set for?', choices: ['The tallest users, with platforms for the others', 'The shortest users', 'The average user', 'Whoever is on the first shift'], a: 0, why: 'Shorter users can stand on a platform; nobody can be lowered, so a bench set for the average leaves the tallest stooping.' }
  ],
  problems: [
    { q: 'The 95th-percentile man has a barefoot elbow height of 1182 mm and wears 25 mm shoes. For heavy work at the middle of the heavy-work band (275 mm below the elbow), on the bench surface itself, how high is the bench?', answer: 932, unit: 'mm', tol: 0.01, steps: ['$h_b = 1182 + 25 - 275 - 0 = 932$ mm.'] },
    { q: 'A man\'s eyes are at 1665 mm (with shoes). Precision work is at 1175 mm, 400 mm in front of the eyes. What is the gaze angle below the horizontal?', answer: 50.8, unit: '°', tol: 0.02, steps: ['$\\theta = \\arctan((1665 - 1175)/400) = \\arctan(1.225) = 50.8°$.'] }
  ],
  ranges: [
    { dim: 'Working point for precision work, standing', range: [1010, 1310], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: elbow height plus 25 mm of shoe, plus 50–100 mm', why: 'Brings fine work nearer the eyes and lets the forearms rest, so the neck bends less.', limits: 'Needs elbow or forearm supports, or the raised arms tire the shoulders; very fine work is better done sitting.', setting: 'workshop', src: 'Kroemer and Grandjean, *Fitting the Task to the Human*; representative body data' },
    { dim: 'Working point for light work, standing', range: [810, 1110], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: elbow height plus shoe, less 100–150 mm', why: 'Shoulders relaxed, upper arms hanging, room for hand tools and parts.', limits: 'A fixed height fits only about a quarter of a mixed workforce within the 50 mm band; subtract the height of the workpiece.', setting: ['workshop', 'civil'], src: 'Kroemer and Grandjean; representative body data' },
    { dim: 'Working point for heavy work, standing', range: [560, 1060], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: elbow height plus shoe, less 150–400 mm', why: 'The body\'s weight adds to the downward force; the elbows can stay straight.', limits: 'Low surfaces bend the back for anyone doing lighter tasks at the same bench; lifting heavy parts onto low benches has its own risk.', setting: 'workshop', src: 'Kroemer and Grandjean; representative body data' },
    { dim: 'Adjustment stroke of a standing bench for one task', range: [250, 300], unit: 'mm', who: 'the spread of elbow height from the 5th-percentile woman to the 95th-percentile man (about 245 mm) plus the task band', why: 'Every worker can put the work in their own band.', limits: 'Several tasks at one bench need more stroke; users must be shown how and why to adjust.', setting: 'workshop', src: 'Derived from representative elbow heights (ISO 7250-1 definitions)' },
    { dim: 'Gaze below the horizontal covered by the eyes alone', range: '15–30°', unit: '', who: 'most adults with the head upright', why: 'Within this angle the neck can stay upright while the eyes do the looking down.', limits: 'Steeper gazes bend the neck or trunk; wearers of bifocal and progressive lenses look through the lower part of the lens and may tip the head back instead.', setting: 'all', src: 'Pheasant and Haslegrave, *Bodyspace*; Kroemer and Grandjean' }
  ],
  applications: [
    'Electronics, watchmaking and optics benches with raised, tilted fixtures and forearm pads.',
    'Packing and light-assembly lines with height-adjustable tables or conveyors.',
    'Joiners\' and fitters\' benches set low for planing and filing with force.',
    'Try your own numbers in [the standing workstation fitter](#/tools/workstation/standing) and see the ranges of every page in [the Dimension finder](#/tools/ranges).'
  ],
  history: 'The rule that working heights follow the elbow and the task was set out by the Swiss ergonomist Etienne Grandjean in the 1960s in his textbook on the physiological design of work, published in English as *Fitting the Task to the Man*; Karl Kroemer continued it as *Fitting the Task to the Human*. The offsets have been repeated in nearly every ergonomics handbook since.',
  sources: [
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, the chapter on work heights and the workplace.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on workspace design and standing work surfaces.',
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'EN 614-1, *Safety of machinery — Ergonomic design principles — Part 1: Terminology and general principles*.',
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1: Body measurement definitions and landmarks*.'
  ],
  sim: 'wk-bench-fit'
},

{
  id: 'workbench-design', parent: 'workshop-topic', title: 'Workbenches', level: 1,
  short: 'A workbench is a standing (or sit–stand) workstation: its height follows the task and the worker\'s elbow, its usable depth the reach of the smallest user, and its edge, toe space, lighting, storage and stability decide whether people can work at it all day. Adjustable benches or platforms cover the spread of users.',
  keywords: ['workbench', 'bench height', 'adjustable bench', 'height-adjustable workbench', 'platform', 'bench depth', 'reach zone', 'toe recess', 'vice height', 'task lighting', 'tool board', 'sit-stand bench', 'bench edge'],
  prereq: ['standing-work-heights', 'functional-reach', 'design-for-range'],
  related: ['reach-zones', 'assembly-lines', 'hand-tools', 'material-flow-layout', 'standing-all-day', 'storage-heights', 'lighting-levels', 'laboratory-ergonomics', 'maintenance-ergonomics'],
  body: `
A workbench looks like the simplest piece of equipment in a workshop, but every one of its dimensions decides a posture. Its **height** sets the angle of the back and the shoulders, its **depth** decides how far people lean, its **front edge** presses on forearms and wrists, and the **space at its foot** decides how close anyone can stand.

### Height: adjust it, or raise the people
The height comes from the task and the worker's elbow (see [[standing-work-heights]]). Across the 5th-percentile woman to the 95th-percentile man, elbow height with shoes runs from about 964 to 1207 mm. Add the 50 mm width of a task band and one task needs about **300 mm of adjustment**:

$$R = (\\mu_m + z\\,\\sigma_m) - (\\mu_f - z\\,\\sigma_f) + w$$

With $\\mu_m = 1100$, $\\sigma_m = 50$, $\\mu_f = 1015$, $\\sigma_f = 46$ mm, $z = 1.645$ (the [[?gaussian|normal distribution]]'s 5th and 95th percentiles) and $w = 50$ mm, $R$ = 293 mm. There are three ways to give it:

| Solution | Virtue | Limitation |
|---|---|---|
| **Height-adjustable bench** (crank, electric, hydraulic) | fits everyone for every task; heights can change with the job | cost, capacity under heavy loads, people who never adjust |
| **Fixed bench set for the tallest, with platforms** | cheap and robust; about 99 % fit with platforms up to 250 mm | platforms must be large, stable, non-slip and edged; trip hazards when people move; fork-truck access |
| **Adjustable fixtures** (jigs, vices on columns, tilting and turning holders) | the work, not the bench, moves; ideal for heavy parts | one fixture per job; set-up time |

A bench fixed at 1080 mm suits the tallest for light work; the 5th-percentile woman then needs a platform of about 240 mm. The traditional fitters' rule puts the top of the vice jaws at about elbow height for filing.

### Depth: the reach of the smallest user
Frequent work belongs in the **comfortable zone**, reached with the upper arm near the body; everything used during a task within **maximum reach**, without leaning. In the model used here the comfortable reach is three quarters of the forward grip reach measured from the back, and a person standing against the edge has about 250 mm of body in front of the back. For the 5th-percentile woman (forward reach 671 mm) that leaves about **250 mm** of comfortable zone and **420 mm** of maximum reach beyond the front edge. Benches are commonly 600–900 mm deep; the back part is for storage, fixtures and things used rarely.

### Details that decide comfort
- **Toe space**: a recess at the foot, of about 100 mm or more in depth and height, lets people stand close without leaning.
- **Front edge**: rounded or padded; a sharp edge concentrates pressure on the forearm and wrist.
- **Knee room** for sit–stand work: a high stool at a standing bench needs a footrest and space for the thighs under the top (see [[standing-all-day]]).
- **Stability**: no rocking under force; heavy work needs mass and bracing.
- **Light** on the work: about 500 lx for general bench work, 750 lx for fine assembly and 1000–1500 lx for precision and very fine work (typical values in the spirit of EN 12464-1; see [[lighting-levels]]), without shadows from the worker's head.
- **Storage** within reach: tool boards and bins between knuckle and shoulder height, heavy items low but not on the floor (see [[storage-heights]]).

In the simulation, switch the bench to *adjustable* or to *platforms* and watch the fitted share of the workforce; the top-view simulation shows the reach zones over the bench.

### Settings
- **Workshop and industry**: adjustable benches where people or tasks change, fixed heavy benches with platforms where they do not.
- **School workshops**: pupils from 11 to 18 years span a larger range of heights than adults (see [[school-furniture]]); adjustable benches or several heights are needed.
- **Military and field**: fold-out benches in maintenance vehicles and containers must be fixed; set them for the tallest and carry stable platforms; work on the ground needs kneeling pads and low stands.
- **Home**: a DIY bench or folding workbench is usually below elbow height, good for sawing and planing but low for fine work: raise the work on a block.

> [!warn] A platform must cover the whole area the worker uses, be firm and non-slip, have a visible edge and never be improvised from boxes or pallets.

> [!key] Height from the task and the tallest-to-smallest spread of elbows; depth from the reach of the smallest user; details — edge, toe space, light and storage — for a whole shift.
`,
  ideas: [
    'One task needs about 300 mm of height adjustment to fit the 5th-percentile woman to the 95th-percentile man.',
    'Where a bench is fixed, set it for the tallest users and raise the others on proper platforms.',
    'The usable depth is set by the reach of the smallest user: about 250 mm comfortable and 420 mm maximum beyond the edge.',
    'Toe space, a rounded edge, good light and storage within reach turn a table into a workbench.'
  ],
  pitfalls: [
    'A deeper bench is always better — Only the front 250–420 mm is within everyone\'s reach; the rest makes people lean unless it is used for storage.',
    'Platforms suit everyone at a bench that is too high — They help only shorter users; a bench too low for the tall cannot be fixed by a platform, which is why fixed benches are set for the tallest.',
    'Anyone can adjust an adjustable bench, so it will be set right — People rarely adjust without training and a quick, easy control; show them what height to look for.'
  ],
  formulas: [
    {
      name: 'Adjustment range for one task',
      expr: 'R = (mm + z*sm) - (mf - z*sf) + w', tex: 'R = (\\mu_m + z\\,\\sigma_m) - (\\mu_f - z\\,\\sigma_f) + w',
      vars: {
        R: { name: 'height adjustment the bench needs', q: 'length', unit: 'mm' },
        mm: { name: 'mean elbow height, men', q: 'length', unit: 'mm', value: 1100, tex: '\\mu_m' },
        sm: { name: 'standard deviation, men', q: 'length', unit: 'mm', value: 50, tex: '\\sigma_m' },
        mf: { name: 'mean elbow height, women', q: 'length', unit: 'mm', value: 1015, tex: '\\mu_f' },
        sf: { name: 'standard deviation, women', q: 'length', unit: 'mm', value: 46, tex: '\\sigma_f' },
        z: { name: 'standard normal value (1.645 for the 5th and 95th percentiles)', q: 'none', value: 1.645 },
        w: { name: 'width of the task band', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'From the smallest woman to the largest man accommodated; shoes shift both ends equally and cancel.',
      stories: { R: 'Elbow heights are {mm} ± {sm} for men and {mf} ± {sf} for women; the task band is {w} wide. How much adjustment covers z = ±{z}?' }
    },
    {
      name: 'Comfortable reach beyond the front edge',
      expr: 'r = k*FR - b', tex: 'r = k\\,R_f - b',
      vars: {
        r: { name: 'comfortable reach beyond the edge', q: 'length', unit: 'mm' },
        k: { name: 'share of forward reach that is comfortable', q: 'none', value: 0.75, fixed: true },
        FR: { name: 'forward grip reach of the smallest user', q: 'length', unit: 'mm', value: 671, tex: 'R_f' },
        b: { name: 'body depth in front of the back', q: 'length', unit: 'mm', value: 250 }
      },
      note: 'Forward grip reach is measured from the back (ISO 7250-1). With k = 1 the same formula gives the maximum reach.',
      stories: { r: 'The smallest user\'s forward grip reach is {FR} and {b} of her body is in front of her back. How far beyond the edge is her comfortable reach?' }
    },
    {
      name: 'Platform height at a fixed bench',
      expr: 'p = hb - he - a - dh', tex: 'p = h_b - h_e - a_s - \\Delta h',
      vars: {
        p: { name: 'platform height (negative: the bench is too low)', q: 'length', unit: 'mm', signed: true },
        hb: { name: 'fixed bench height', q: 'length', unit: 'mm', value: 1080, tex: 'h_b' },
        he: { name: 'worker\'s elbow height, barefoot', q: 'length', unit: 'mm', value: 939, tex: 'h_e' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        dh: { name: 'task offset (−125 mm for the middle of light work)', q: 'length', unit: 'mm', value: -125, signed: true, tex: '\\Delta h' }
      },
      note: 'Round up to the platform sizes on offer; a negative result means the bench is too low for this worker.',
      stories: { p: 'A bench is fixed at {hb}. A worker with an elbow height of {he} and {a} of shoe does a task with offset {dh}. How high a platform does she need?' }
    }
  ],
  examples: [
    {
      title: 'Fixed bench with platforms',
      q: 'A light-assembly bench is fixed at 1080 mm, right for the 95th-percentile man. What platform does the 5th-percentile woman (elbow 939 mm barefoot, 25 mm of shoe) need?',
      steps: [
        'Her light-work band is $964 - 150$ to $964 - 100$ = 814–864 mm.',
        '$p = 1080 - 939 - 25 - (-125) = 241$ mm, or 216–266 mm across the band.',
        'Offer platforms in 50 mm steps up to 250 mm: with them about 99 % of a mixed workforce can put the bench in their band.'
      ],
      a: 'About 240 mm — the 250 mm platform.'
    },
    {
      title: 'How deep can the working zone be?',
      q: 'The 5th-percentile woman has a forward grip reach of 671 mm. She stands against the bench with 250 mm of body in front of her back. How far into the bench are her comfortable and maximum reaches?',
      steps: [
        'Comfortable: $0.75 \\times 671 - 250 = 253$ mm.',
        'Maximum: $671 - 250 = 421$ mm.',
        'For the 95th-percentile man (862 mm): 397 mm and 612 mm. Design for her: frequent work in the front 250 mm, everything used in the task within about 420 mm.'
      ],
      a: 'About 250 mm comfortable and 420 mm maximum.'
    }
  ],
  quiz: [
    { q: 'Why is a fixed bench set for the tallest users rather than the average?', choices: ['Shorter users can be raised on platforms, but taller users cannot be lowered', 'Tall people do more work', 'It is cheaper to build tall benches', 'The average user does not exist'], a: 0, why: 'A platform solves "too high"; nothing solves "too low" except raising the work.' },
    { q: 'About how much height adjustment does one task need to fit the 5th-percentile woman to the 95th-percentile man?', choices: ['About 300 mm', 'About 50 mm', 'About 100 mm', 'About 600 mm'], a: 0, why: 'Elbow height spreads by about 245 mm, plus the 50 mm band of the task.' },
    { q: 'Parts are placed 550 mm behind the front edge of a bench. Who has trouble reaching them?', choices: ['Most smaller users: it is beyond the 5th-percentile woman\'s maximum reach of about 420 mm', 'Nobody', 'Only the 95th-percentile man', 'Only people sitting'], a: 0, why: 'Beyond about 420 mm the smallest users must lean or step; frequent picks belong within about 250 mm.' },
    { q: 'A rounded or padded front edge matters because…', choices: ['a sharp edge concentrates pressure on the forearm and wrist', 'it looks better', 'it makes the bench stronger', 'it lowers the bench'], a: 0, why: 'Contact stress on the soft tissues of the forearm and wrist adds to the load from repetitive work.' }
  ],
  problems: [
    { q: 'A bench is fixed at 1000 mm. The median woman (barefoot elbow height 1015 mm, 25 mm shoes) does light work (offset −125 mm). What platform does she need? (A negative answer means the bench is too low.)', answer: 85, unit: 'mm', tol: 0.02, hint: 'p = h_b − h_e − a_s − Δh.', steps: ['$p = 1000 - 1015 - 25 + 125 = 85$ mm: a 100 mm platform, or the 50 mm one if she prefers the lower edge of the band.'] },
    { q: 'The 95th-percentile man has a forward grip reach of 862 mm. With 250 mm of body in front of his back, what is his maximum reach beyond the bench edge?', answer: 612, unit: 'mm', tol: 0.01, steps: ['$862 - 250 = 612$ mm; his comfortable reach is $0.75 \\times 862 - 250 = 397$ mm.'] }
  ],
  ranges: [
    { dim: 'Height adjustment of a standing workbench (one task)', range: [250, 300], unit: 'mm', who: '5th-percentile woman to 95th-percentile man', why: 'Every worker can bring the working point into the band for the task.', limits: 'More for benches that serve precision and heavy work alike; people need training and an easy control.', setting: 'workshop', src: 'Derived from representative elbow heights' },
    { dim: 'Platform heights to offer at a bench set for the tallest', range: [50, 250], unit: 'mm', who: 'shorter workers, down to the 5th-percentile woman', why: 'Lets shorter workers use a fixed bench without raising their shoulders.', limits: 'Platforms must cover the whole working area, be stable, non-slip and edge-marked; they add trip and fall risks.', setting: ['workshop', 'military', 'field'], src: 'Derived from representative elbow heights; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Comfortable working zone beyond the front edge', range: [null, 250], unit: 'mm', who: '5th-percentile woman: three quarters of her forward grip reach, less 250 mm of body depth', why: 'Frequent reaches with the upper arm close to the body, no leaning.', limits: 'Seated users, pregnancy, a large abdomen and thick clothing reduce it; a toe recess increases it.', setting: 'workshop', src: 'Representative forward grip reach (ISO 7250-1)' },
    { dim: 'Everything used during a task, beyond the front edge', range: [null, 420], unit: 'mm', who: '5th-percentile woman\'s maximum forward reach', why: 'Nothing needs a lean or a step.', limits: 'Heavy items should be much closer: holding a load at arm\'s length multiplies the load on the shoulder and back.', setting: 'workshop', src: 'Representative forward grip reach' },
    { dim: 'Illuminance on the bench', range: [500, 1500], unit: 'lx', who: 'from general bench work (500) through fine assembly (750) and precision work (1000) to very fine work (1500)', why: 'Enough light for the smallest detail of the task; older workers need more.', limits: 'Glare and shadows matter as much as the level; values are typical — use the lighting standard of your country.', setting: 'workshop', src: 'EN 12464-1 (typical values)' },
    { dim: 'Vice jaw height for filing', range: 'about elbow height', unit: '', who: 'the individual user', why: 'The forearm stays level during the stroke, and the body can lean into it.', limits: 'Lower for heavy sawing or chiselling, higher for fine filing; a vice on a fixed bench needs a platform for shorter users.', setting: 'workshop', src: 'Traditional workshop practice' }
  ],
  applications: [
    'Height-adjustable assembly benches in electronics, medical-device and aerospace assembly.',
    'Fixed heavy benches with platforms in maintenance shops and on production lines.',
    'Fold-out benches in service vehicles, shipping containers and field workshops.',
    'Laboratory and school workshop benches (see [[laboratory-ergonomics]] and [[school-furniture]]).'
  ],
  sources: [
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on work heights and the standing workplace.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on workspace design, reach and adjustment.',
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places*.',
    'ISO 6385, *Ergonomics principles in the design of work systems*.'
  ],
  sim: [{ id: 'wk-bench-fit', params: { mode: 'adjust' } }, 'wk-reach-station']
},

{
  id: 'assembly-lines', parent: 'workshop-topic', title: 'Assembly lines', level: 2,
  short: 'An assembly line splits the work into short, repeated cycles at a pace set by the line. Its ergonomics is reach (parts and tools within the comfortable zone of the smallest worker), height (work between knuckle and shoulder, near the elbow), pacing (enough time and float for the natural variation of human work) and variety (rotation between tasks that load different parts of the body).',
  keywords: ['assembly line', 'takt time', 'cycle time', 'paced work', 'line balancing', 'balance loss', 'overcycle', 'float', 'repetitive work', 'OCRA', 'job rotation', 'parts presentation', 'flow rack', 'Silverstein'],
  prereq: ['workbench-design', 'repetitive-strain', 'reach-zones'],
  related: ['standing-work-heights', 'job-rotation', 'fatigue-rest-breaks', 'hand-tools', 'power-tools-ergonomics', 'material-flow-layout', 'mental-workload', 'psychosocial-factors', 'retail-checkouts'],
  body: `
An assembly line turns a product into a sequence of short tasks, each done at a station in a fixed time, the **cycle time**. The line gains speed and consistency; the people on it lose variety and control over their own pace. The same small motions are repeated hundreds or thousands of times a shift, and that repetition, with force and awkward posture, is what causes most of the tendon, nerve and shoulder disorders of industrial work (see [[repetitive-strain]]).

### Cycle time and repetition
If a line must make $Q$ units in a working time $t_s$, the **takt time** is $T = t_s/Q$, and each operator repeats the cycle $N = t_s/T$ times a shift: 480 units in 7.5 working hours give $T$ = 56 s and 480 cycles. Silverstein, Fine and Armstrong (1986) classed work as **highly repetitive** when the cycle is shorter than 30 s or when more than half of it is spent on the same kind of motion. The OCRA method, which ISO 11228-3 describes, compares the technical actions actually done with a reference of 30 actions a minute, reduced for force, posture, missing recovery time and other factors.

### Balancing the line
The total work content $W_c$ is shared among $n$ stations. Because tasks cannot be split finely, some stations have less than a full cycle of work; the idle share is the **balance loss**:

$$d = 1 - \\dfrac{W_c}{n\\,T}$$

A little balance loss is not waste: it is the time that absorbs the natural variation of human work.

### Pacing and variation
Nobody works like a clock. Task times vary from cycle to cycle — a stiff connector, a dropped screw, a moment's thought — with a spread of perhaps 5–15 % of the mean. On a moving line the part enters the station every $T$ seconds. If the operator has no **float** (no room to follow the part a little way beyond the station), a cycle overruns whenever its time exceeds $T$. For a [[?gaussian|normal]] spread with mean $\\mu$ and [[?standard-deviation|standard deviation]] $\\sigma$ the [[?probability|probability]] is

$$p = 1 - \\Phi\\!\\left(\\frac{T - \\mu}{\\sigma}\\right)$$

With work planned at 90 % of the cycle and a 10 % spread, $p$ is 13 %: one cycle in seven overruns, and each overrun means rushing, a line stop or a missed task. Loading only 86 % of the cycle brings it to 5 %. A float of half a cycle, buffers between stations, or letting operators work ahead cut it much further — watch the lag build up and recover in the simulation. Machine-paced work with short cycles and no control over the pace is also linked to stress (see [[psychosocial-factors]]).

### Reach, height and parts presentation
- Parts and tools used every cycle within the **comfortable zone** of the smallest operator (about 400 mm from the shoulder for the 5th-percentile woman in the model here); everything within maximum reach (see [[reach-zones]] and the top-view simulation).
- Work between knuckle and shoulder height, near the elbow for light work, with the carrier, conveyor or fixture adjustable in height (see [[standing-work-heights]]).
- Gravity-fed flow racks and tilted bins that bring parts to the front; tools on balancers (see [[power-tools-ergonomics]]).
- Both hands working symmetrically where possible; no parts picked from behind or from the floor.
- Some car plants turn the body on its carrier so that underbody work is done at hip height instead of overhead.

### Rotation and variety
Rotating people between stations spreads the load, but only if the stations load **different** body parts: rotating between two screw-driving tasks changes nothing. Rotation at each break, job enlargement (longer, more varied cycles), short pauses and a say in the pace are the organisational side (see [[job-rotation]] and [[fatigue-rest-breaks]]).

### Settings
- **Industry**: cars, appliances, electronics, food packing — the classic lines, often with mixed ages and sexes and two or three shifts.
- **Retail and services**: checkouts are assembly lines in reverse (see [[retail-checkouts]]).
- **Military and field**: maintenance and ammunition or ration packing lines follow the same rules, often in temporary buildings with fixed benches.

> [!key] Give every operator the time the variation of the work needs (plan below 100 % of the cycle, add float or buffers), everything used each cycle within the smallest worker's comfortable reach, and variety that really changes the load.
`,
  ideas: [
    'Cycle time sets the repetition: a 56 s cycle is 480 repetitions in a 7.5 h shift; cycles under 30 s are classed as highly repetitive.',
    'Balance loss, 1 − W/(nT), is the idle share of the line; some is needed to absorb variation.',
    'Work at 90 % of the cycle with a 10 % spread overruns about one cycle in seven without float.',
    'Float, buffers and control over the pace reduce overruns and stress.',
    'Rotation helps only between tasks that load different parts of the body.'
  ],
  pitfalls: [
    'A perfectly balanced line (100 % of every cycle loaded) is the most efficient — Human task times vary; at 100 % every slow cycle overruns, causing rushing, stops and errors.',
    'Rotation always reduces risk — Rotating between tasks that use the same muscles in the same way leaves the exposure unchanged.',
    'If the parts are within reach of the average worker, the station is fine — Half the workforce is smaller than average; lay out for the reach of the smallest operator.'
  ],
  formulas: [
    {
      name: 'Cycles per shift',
      expr: 'N = ts/T', tex: 'N = \\dfrac{t_s}{T}',
      vars: {
        N: { name: 'cycles (repetitions) per shift', q: 'count' },
        ts: { name: 'working time per shift', q: 'time', unit: 'h', value: 7.5, tex: 't_s' },
        T: { name: 'cycle time', q: 'time', unit: 's', value: 56.25 }
      },
      note: 'Multiply by the actions in one cycle for actions per shift.',
      stories: { N: 'A line runs for {ts} with a cycle time of {T}. How many cycles does each operator repeat?', T: 'The line must make {N} units in {ts}. What is the takt time?' }
    },
    {
      name: 'Balance loss of a line',
      expr: 'd = 1 - Wc/(n*T)', tex: 'd = 1 - \\dfrac{W_c}{n\\,T}',
      vars: {
        d: { name: 'balance loss (idle share)', q: 'ratio', unit: '%' },
        Wc: { name: 'total work content of one unit', q: 'time', unit: 's', value: 300, tex: 'W_c' },
        n: { name: 'number of stations', q: 'count', value: 6, int: true },
        T: { name: 'cycle time', q: 'time', unit: 's', value: 56.25 }
      },
      stories: { d: 'A product has {Wc} of work, shared among {n} stations with a cycle of {T}. What is the balance loss?' }
    },
    {
      name: 'Chance of an overcycle without float',
      expr: 'p = 1 - ncdf((T - mu)/s)', tex: 'p = 1 - \\Phi\\!\\left(\\dfrac{T - \\mu}{\\sigma}\\right)',
      vars: {
        p: { name: 'share of cycles that overrun', q: 'ratio', unit: '%' },
        T: { name: 'cycle time', q: 'time', unit: 's', value: 60 },
        mu: { name: 'mean task time at the station', q: 'time', unit: 's', value: 54, tex: '\\mu' },
        s: { name: 'standard deviation of the task time', q: 'time', unit: 's', value: 5, tex: '\\sigma' }
      },
      note: 'Assumes normally distributed task times and a station the operator cannot leave; float and buffers lower it.',
      stories: { p: 'Task times at a station average {mu} with a standard deviation of {s}; the cycle is {T}. What share of cycles overrun?', mu: 'With a cycle of {T} and a spread of {s}, how much work may be planned for only {p} of cycles to overrun?' }
    }
  ],
  examples: [
    {
      title: 'Balancing a small line',
      q: 'A product has 300 s of work. The line must make 480 units in 7.5 working hours. Find the takt time, the number of stations and the balance loss.',
      steps: [
        '$T = 7.5 \\times 3600 / 480 = 56.25$ s.',
        '$300 / 56.25 = 5.33$, so 6 stations.',
        '$d = 1 - 300/(6 \\times 56.25) = 11.1$ %. Each operator repeats the cycle 480 times a shift.'
      ],
      a: '56 s, 6 stations, 11 % balance loss.'
    },
    {
      title: 'How much work can one station carry?',
      q: 'At a station with a 56.25 s cycle, task times vary with a standard deviation of 4 s. Compare the share of overruns (no float) with 52 s and with 48 s of planned work.',
      steps: [
        '52 s: $z = (56.25 - 52)/4 = 1.06$, $p = 1 - \\Phi(1.06) = 14$ %.',
        '48 s: $z = 2.06$, $p = 2.0$ %.',
        'Taking 4 s of work off the station (moving it to a station with spare time) cuts overruns seven-fold.'
      ],
      a: 'About 14 % against 2 %.'
    }
  ],
  quiz: [
    { q: 'A station is loaded to 100 % of its cycle time. What happens?', choices: ['About half the cycles overrun, because task times vary', 'Nothing: the line is perfectly efficient', 'The operator gets more breaks', 'The cycle time gets shorter'], a: 0, why: 'With the mean equal to the cycle, every cycle slower than average overruns — about half of them.' },
    { q: 'Which rotation reduces exposure?', choices: ['Between a screw-driving station and a visual inspection station', 'Between two screw-driving stations', 'Between two identical stations on different lines', 'None ever does'], a: 0, why: 'Rotation helps when the tasks load different body parts and muscles.' },
    { q: 'By the Silverstein criterion, a task with a 25 s cycle is highly repetitive.', a: true, why: 'Cycles under 30 s (or with more than half the cycle on the same motion) were classed as highly repetitive.' },
    { q: 'Parts bins should be placed within the comfortable reach of…', choices: ['the smallest operators', 'the average operator', 'the tallest operators', 'the line supervisor'], a: 0, why: 'Reach is limited by the small: bins they can reach comfortably are within everyone\'s reach.' },
    { q: 'A line makes 600 units in 7.5 working hours. What is the takt time (s)?', answer: 45, unit: 's', why: '$7.5 \\times 3600 / 600 = 45$ s.' }
  ],
  problems: [
    { q: 'A product has 420 s of work content and the line has 8 stations with a cycle of 60 s. What is the balance loss?', answer: 12.5, unit: '%', tol: 0.01, steps: ['$d = 1 - 420/(8 \\times 60) = 1 - 0.875 = 12.5$ %.'] },
    { q: 'Task times vary with a standard deviation of 3 s. With a 40 s cycle and no float, what mean task time gives overruns in 5 % of cycles (z = 1.645)?', answer: 35.1, unit: 's', tol: 0.01, steps: ['$\\mu = T - 1.645\\,\\sigma = 40 - 4.9 = 35.1$ s — 88 % of the cycle.'] }
  ],
  ranges: [
    { dim: 'Cycle time of a repeated task', range: [30, null], unit: 's', who: 'every operator on the line', why: 'Longer cycles repeat the same motions fewer times and hold more variety.', limits: 'A long cycle can still be repetitive if one motion dominates it (more than half the cycle); force and posture matter as much as frequency.', setting: 'workshop', src: 'Silverstein, Fine and Armstrong (1986); ISO 11228-3' },
    { dim: 'Work planned at a paced station (10 % spread of task times, no float)', range: [null, 86], unit: '%', who: 'a station whose task times vary with a standard deviation of 10 % of the mean', why: 'Keeps overruns near 1 cycle in 20 instead of 1 in 2 at full load.', limits: 'More spread (new operators, variants) needs a lower load; float, buffers or self-pacing allow more.', setting: 'workshop', src: 'Derived from the normal distribution' },
    { dim: 'Parts and tools used every cycle, from the shoulder', range: [null, 400], unit: 'mm', who: '5th-percentile woman\'s comfortable reach (three quarters of her forward reach, measured from the back)', why: 'Reaches with the upper arm near the body: little shoulder load over thousands of repetitions.', limits: 'Seated operators and operators in thick clothing reach less; heavy parts belong closer still.', setting: 'workshop', src: 'Representative forward grip reach (ISO 7250-1); Pheasant and Haslegrave' },
    { dim: 'Height of the hands for frequent work', range: [null, 1260], unit: 'mm', who: '5th-percentile woman\'s shoulder height with shoes', why: 'No sustained work with the hands above the shoulder, which quickly tires the shoulder muscles.', limits: 'Tall operators need the work raised above others\' comfort — adjustable carriers solve both.', setting: 'workshop', src: 'Representative shoulder height; ISO 11226 (static postures)' },
    { dim: 'Rotation between stations', range: 'at each break (every 1–2 h)', unit: '', who: 'operators trained on stations that load different body parts', why: 'Spreads the load over different muscles and adds variety.', limits: 'Useless between similar tasks; needs training for every station and can spread exposure to more people.', setting: 'workshop', src: 'Common practice; ISO 11228-3' }
  ],
  applications: [
    'Car, appliance and electronics assembly; food and pharmaceutical packing lines.',
    'Line balancing and takt planning in lean production, with ergonomic limits on each station.',
    'Parts presentation with flow racks and kitting trolleys at the line.',
    'See the reach zones of any person in the top-view simulation and [the Dimension finder](#/tools/ranges).'
  ],
  history: 'Moving assembly lines spread from car making in the 1910s. By the 1970s and 1980s the costs of short, machine-paced cycles — tendon and nerve disorders, turnover and absenteeism — were being measured; Silverstein, Fine and Armstrong\'s 1986 study of repetitive industrial jobs linked high repetition and force with tendon and nerve disorders of the hand and wrist, and European standards (EN 1005-5, ISO 11228-3) later built risk methods such as OCRA around repetition, force, posture and recovery.',
  sources: [
    'ISO 11228-3, *Ergonomics — Manual handling — Part 3: Handling of low loads at high frequency*.',
    'EN 1005-5, *Safety of machinery — Human physical performance — Part 5: Risk assessment for repetitive handling at high frequency*.',
    'B. A. Silverstein, L. J. Fine and T. J. Armstrong, "Hand wrist cumulative trauma disorders in industry", *British Journal of Industrial Medicine*, 1986.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on reach and workspace layout.',
    'Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, chapters on work design and musculoskeletal disorders.'
  ],
  sim: ['wk-paced-line', 'wk-reach-station']
},

{
  id: 'hand-tools', parent: 'workshop-topic', title: 'Hand tools', level: 2,
  short: 'A hand tool should fit the hand and keep the wrist straight: power-grip handles of about 32–51 mm, precision handles of 8–13 mm, at least 100 mm long (125 mm with gloves), spans of 50–90 mm for pliers, no sharp edges or finger grooves — and a shape that is bent where the task would otherwise bend the wrist.',
  keywords: ['hand tools', 'handle diameter', 'power grip', 'precision grip', 'pinch', 'grip strength', 'grip span', 'pliers', 'bent handle', 'wrist deviation', 'gloves', 'Tichauer', 'contact stress', 'screwdriver torque', 'left-handed'],
  prereq: ['hand-foot-head', 'strength-and-force', 'neutral-postures'],
  related: ['power-tools-ergonomics', 'repetitive-strain', 'static-muscle-work', 'clothing-ppe-allowances', 'ppe-ergonomics', 'assembly-lines', 'workbench-design', 'controls-design'],
  body: `
A hand tool is an extension of the hand, and a poorly shaped one makes the hand and wrist pay for every use: more grip force, a bent wrist, pressure on the palm, a tired forearm. Over thousands of cycles those add up to tendon and nerve disorders such as tenosynovitis and carpal tunnel syndrome (see [[repetitive-strain]]).

### Two grips
- **Power grip**: the handle lies across the palm and the fingers wrap around it, the thumb over the fingers — hammers, saws, drivers. It gives the most force.
- **Precision grip** (pinch): the object is held between the thumb and the fingertips — pens, tweezers, small screwdrivers. It gives control but only about a fifth to a quarter of the force of a power grip.

In the representative data used in the simulation, maximum power-grip force is about 450 N for men and 280 N for women, with a wide spread and a decline with age. That is the capacity for a moment; work that repeats or holds a grip must use a small part of it. Rohmert's classic studies found that muscles hold about 15 % of their maximum for a long time; later work suggests a few per cent for static holding over a whole shift (see [[static-muscle-work]]).

### Handle dimensions
| Feature | Recommendation | Limiting user and reason |
|---|---|---|
| Power-grip diameter | 32–51 mm | small hands at the lower end, large at the upper; grip force falls on both sides of the best size |
| Precision-grip diameter | 8–13 mm | fingertip control |
| Handle length | ≥ 100 mm, ≥ 125 mm with gloves | the breadth of the largest hands; a short handle ends in the palm and presses on its base |
| Span of two-handled tools | ≥ 50 mm closed, ≤ 90 mm open | small hands must still close their grip on the open handles |
| Surface | slightly compressible, non-slip, non-conductive, no sharp edges | less grip force for the same friction, no contact stress |

These values are those of NIOSH's guide to selecting non-powered hand tools (2004). Grip force is greatest when the fingers overlap the thumb a little, which puts the best handle about a centimetre smaller than the diameter at which the fingertips just meet the thumb; in the simulation's model it is about a fifth of hand length. **Finger grooves** fit only the hand they were designed for and press on everyone else's. Two-handled tools should open by a spring, so that the weak finger extensors do not have to.

A round handle transmits torque by friction: for a grip force $F_g$ and friction coefficient $\\mu$, $T = \\mu F_g d/2$. A thicker screwdriver handle turns the same grip into more torque, up to the diameter where the grip itself weakens.

### Bend the tool, not the wrist
A wrist bent away from straight loses grip strength and squeezes the tendons and the median nerve in the carpal tunnel. The rule is to **bend the tool, not the wrist**: pliers, knives, soldering irons and hammers can have handles angled so that the forearm, wrist and tool line up for the task. In the 1960s E. R. Tichauer studied electronics trainees at Western Electric; those given pliers with bent handles kept their wrists straighter and developed fewer wrist complaints than those with straight pliers. The bend must fit the task: a tool bent for a horizontal bench is wrong on a vertical wall (see the wrist mode of the simulation, and [[power-tools-ergonomics]] for pistol and in-line tools).

### Gloves
Gloves protect against cuts, chemicals, cold and vibration, but they cost grip strength (commonly 10–30 %, more for thick or poorly fitting ones), dexterity and touch. Allow for them: longer handles, larger spans, less required force. Choose the thinnest glove that protects, in the right size (see [[clothing-ppe-allowances]]).

### Everyone's hands
About one person in ten is left-handed: tools should be symmetrical or come in both hands. Hands range from about 161 mm long (5th-percentile woman) to 208 mm (95th-percentile man); a range of handle sizes serves them better than one.

### Settings
- **Workshop and industry**: repeated use — tool choice is a matter of injury prevention, not only productivity.
- **Home and civil**: occasional use, but older users with weaker grips and arthritis benefit most from large, soft, easy tools.
- **Military and field**: tools used in cold, wet conditions with thick gloves; handles must be larger, lever-operated and usable without looking.

> [!key] Fit the handle to the hand (32–51 mm for a power grip, long enough for gloved hands), keep the required force a small part of the user's strength, and bend the tool rather than the wrist.

> [!tip] Before buying tools for a team, have its smallest and largest members try them — with the gloves they actually wear.
`,
  ideas: [
    'Power grips give the most force; pinch grips only about a fifth to a quarter of it.',
    'Power-grip handles of about 32–51 mm, precision handles of 8–13 mm, at least 100 mm long (125 mm with gloves).',
    'Grip force is greatest when the fingers overlap the thumb slightly; too thick or too thin a handle weakens the grip.',
    'Bend the tool, not the wrist — but only in the direction the task needs.',
    'Gloves cost grip strength and dexterity: allow for them in the handle and the force.'
  ],
  pitfalls: [
    'Finger grooves make a handle more comfortable — They fit only the hand they were shaped for and put ridges under everyone else\'s fingers.',
    'A bent handle is always better — A bend helps only when it matches the orientation of the work; used the wrong way it bends the wrist more.',
    'A thicker handle always gives a stronger grip — Beyond the best size the fingers cannot close around it and the grip force falls.'
  ],
  formulas: [
    {
      name: 'Share of the available grip strength used',
      expr: 'r = F/(Fmax*(1 - g))', tex: 'r = \\dfrac{F}{F_{max}\\,(1 - g)}',
      vars: {
        r: { name: 'share of available strength used', q: 'ratio', unit: '%' },
        F: { name: 'grip force the task needs', q: 'force', unit: 'N', value: 60 },
        Fmax: { name: 'maximum grip force (bare hand)', q: 'force', unit: 'N', value: 280, tex: 'F_{max}' },
        g: { name: 'strength lost to gloves', q: 'ratio', unit: '%', value: 20, min: 0, max: 60 }
      },
      note: 'Held or repeated exertions should use a small share: about 15 % in classic endurance studies, less for all-day static holding.',
      stories: { r: 'A task needs a grip of {F}. The worker\'s maximum is {Fmax} bare-handed and gloves take {g} of it. What share of her available strength does the task use?' }
    },
    {
      name: 'Torque a round handle can transmit',
      expr: 'T = mu*Fg*d/2', tex: 'T = \\dfrac{\\mu\\,F_g\\,d}{2}',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        mu: { name: 'coefficient of friction between hand and handle', q: 'none', value: 0.5, tex: '\\mu' },
        Fg: { name: 'grip (squeezing) force', q: 'force', unit: 'N', value: 150, tex: 'F_g' },
        d: { name: 'handle diameter', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'A simple friction model; real grips also push on flats and ridges. Larger diameters help only up to the size at which the grip itself weakens.',
      stories: { T: 'A screwdriver handle of {d} is gripped with {Fg} and a friction coefficient of {mu}. What torque can it transmit?', d: 'What handle diameter transmits {T} with a grip of {Fg} and friction {mu}?' }
    }
  ],
  examples: [
    {
      title: 'A screwdriver handle',
      q: 'A worker can keep up a grip of 150 N. With a friction coefficient of 0.5, what torque can a 25 mm and a 40 mm handle transmit?',
      steps: [
        '25 mm: $T = 0.5 \\times 150 \\times 0.025/2 = 0.94$ N·m.',
        '40 mm: $T = 0.5 \\times 150 \\times 0.040/2 = 1.5$ N·m.',
        'The thicker handle gives 60 % more torque for the same grip, and 40 mm is still within the power-grip range for most hands.'
      ],
      a: 'About 0.9 N·m against 1.5 N·m.'
    },
    {
      title: 'Gloves and a crimping tool',
      q: 'A crimping task needs 60 N of grip. The worker\'s maximum grip is 280 N and her gloves take 20 % of it. What share of her available strength does each crimp use?',
      steps: [
        'Available: $280 \\times 0.8 = 224$ N.',
        '$r = 60/224 = 27$ %.',
        'For a task repeated all shift this is high: choose a tool with a longer lever or a ratchet, a better-fitting glove, or a powered crimper.'
      ],
      a: 'About 27 % — too much for all-day repetition.'
    }
  ],
  quiz: [
    { q: 'Which handle suits a power grip for most adults?', choices: ['About 32–51 mm in diameter', 'About 8–13 mm', 'About 60–80 mm', 'Any size, if it has finger grooves'], a: 0, why: 'Power-grip handles in this range let the fingers wrap and overlap the thumb slightly, giving the most force.' },
    { q: 'A glove adds thickness and reduces strength. What should change in the tool?', choices: ['A longer handle (at least 125 mm) and less required force', 'A thinner handle', 'Nothing, gloves are thin', 'Finger grooves'], a: 0, why: 'Gloved hands are broader and weaker; handles should be longer and the task force lower.' },
    { q: 'Tichauer\'s bent pliers helped because…', choices: ['they let the wrist stay straight for the task the trainees did', 'bent tools are always stronger', 'they were lighter', 'the trainees liked them more'], a: 0, why: 'The bend took over the angle the wrist would otherwise have made; it fits only that orientation of work.' },
    { q: 'A pinch grip is about as strong as a power grip.', a: false, why: 'A pinch uses the fingertips and gives only about a fifth to a quarter of the force of a power grip.' },
    { q: 'Two-handled tools (pliers, cutters) should open by…', choices: ['a spring', 'the fingers pulling them apart', 'gravity', 'the other hand'], a: 0, why: 'The finger extensors are weak; a spring return saves them thousands of openings a shift.' }
  ],
  problems: [
    { q: 'A man with a 450 N maximum grip wears gloves that cost 15 % of it. A task needs 90 N. What share of his available strength does it use?', answer: 23.5, unit: '%', tol: 0.02, steps: ['Available: $450 \\times 0.85 = 382.5$ N.', '$r = 90/382.5 = 23.5$ %.'] },
    { q: 'What grip force is needed to turn 2 N·m on a 35 mm handle with a friction coefficient of 0.6?', answer: 190, unit: 'N', tol: 0.01, steps: ['$F_g = 2T/(\\mu d) = 2 \\times 2/(0.6 \\times 0.035) = 190$ N.'] }
  ],
  ranges: [
    { dim: 'Handle diameter for a power grip', range: [32, 51], unit: 'mm', who: 'small hands (5th-percentile woman) at the lower end, large hands at the upper end', why: 'The fingers wrap and slightly overlap the thumb, giving the most grip force for the least effort.', limits: 'The best size depends on the hand and the glove; offer sizes where users differ widely.', setting: ['workshop', 'civil', 'field'], src: 'NIOSH, *Easy Ergonomics: A Guide to Selecting Non-Powered Hand Tools* (2004)' },
    { dim: 'Handle diameter for a precision grip', range: [8, 13], unit: 'mm', who: 'fingertip grips of most adults', why: 'Fine control of small tools such as tweezers and small drivers.', limits: 'Precision grips are weak; tasks needing force need a power grip.', setting: ['workshop', 'health'], src: 'NIOSH (2004)' },
    { dim: 'Handle length', range: [100, null], unit: 'mm', who: 'the breadth of the largest hands; at least 125 mm with gloves', why: 'The handle spans the whole palm instead of ending in it, where it presses on nerves and vessels.', limits: 'Very long handles catch on things; the gloves actually worn decide the length.', setting: ['workshop', 'civil', 'field', 'military'], src: 'NIOSH (2004)' },
    { dim: 'Grip span of two-handled tools', range: '50 mm closed – 90 mm open', unit: '', who: 'small hands limit the open span, gloved hands the closed span', why: 'Every user can close the tool with a strong grip and open it with a spring.', limits: 'Force is greatest in the middle of the span; very large or small spans weaken it.', setting: ['workshop', 'field'], src: 'NIOSH (2004)' },
    { dim: 'Mass of a tool held in one hand for long periods', range: [null, 2.3], unit: 'kg', who: 'most users, with the tool held near the body', why: 'Limits the static load on the wrist, forearm and shoulder.', limits: 'Much less for precision work or when held away from the body; heavier tools need two hands, a support or a balancer.', setting: ['workshop', 'field'], src: 'Commonly quoted guideline (5 lb)' },
    { dim: 'Wrist flexion or extension while working', range: '0–15°', unit: '', who: 'everyone', why: 'Near-straight wrists keep grip strength and reduce pressure in the carpal tunnel.', limits: 'Posture scores such as RULA rate anything beyond 15° higher; deviation to the side adds to it.', setting: 'all', src: 'RULA (McAtamney and Corlett, 1993)' },
    { dim: 'Grip force held or repeated all shift', range: [null, 15], unit: '% of max', who: 'the weakest likely user, with gloves', why: 'Low relative force can be kept up without fatigue.', limits: 'Classic endurance limit; all-day static holding should stay lower (a few per cent).', setting: ['workshop', 'field'], src: 'Rohmert\'s endurance studies; Kroemer and Grandjean' }
  ],
  applications: [
    'Choosing screwdrivers, pliers, knives, scissors and crimpers for assembly and maintenance teams.',
    'Designing handles for kitchen, garden and DIY tools for older users and people with arthritis.',
    'Specifying tools for cold-weather and CBRN gloves in military and field work.',
    'Checking a task\'s force against grip strength in the grip mode of the simulation.'
  ],
  history: 'E. R. Tichauer\'s studies in the 1960s of bent-handled pliers at Western Electric gave ergonomics its motto "bend the tool, not the wrist". NIOSH\'s *Easy Ergonomics* guide of 2004 gathered the handle, span and length recommendations for non-powered tools into a buyer\'s checklist.',
  sources: [
    'NIOSH, *Easy Ergonomics: A Guide to Selecting Non-Powered Hand Tools*, DHHS (NIOSH) Publication 2004-164.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on hand tools and static muscle work.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on the hand and handle design.',
    'L. McAtamney and E. N. Corlett, "RULA: a survey method for the investigation of work-related upper limb disorders", *Applied Ergonomics*, 1993.',
    'Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, chapter on hand tools.'
  ],
  sim: ['wk-hand-tool', { id: 'wk-hand-tool', params: { mode: 'wrist' } }]
},

{
  id: 'power-tools-ergonomics', parent: 'workshop-topic', title: 'Power tools', level: 2,
  short: 'Power tools take the effort out of the task but bring their own loads: weight held away from the body, reaction torque at the end of every tightening, vibration that damages nerves and blood vessels, and noise. Keep tools light or supported (balancers, arms), choose the handle shape for the work surface, limit daily vibration exposure A(8) — 2.5 m/s² action and 5 m/s² limit in the EU — and absorb reaction torque with the tool or a reaction arm, not the wrist.',
  keywords: ['power tools', 'hand-arm vibration', 'A(8)', 'exposure action value', 'vibration white finger', 'HAVS', 'reaction torque', 'nutrunner', 'pistol grip', 'in-line tool', 'right-angle tool', 'balancer', 'torque arm', 'trigger', 'exposure points', 'tool weight'],
  prereq: ['hand-tools', 'hand-arm-vibration', 'strength-and-force'],
  related: ['assembly-lines', 'noise-exposure', 'static-muscle-work', 'repetitive-strain', 'construction-ergonomics', 'workbench-design', 'motors:universal-motor', 'motors:air-motors', 'physics:torque'],
  body: `
A power tool replaces the muscle work of the task with a motor, but the operator still holds the tool, points it, resists its reactions and absorbs its vibration. Four loads decide whether a power tool is kind to its user: **weight**, **handle shape**, **reaction torque** and **vibration** (with **noise** close behind).

### Weight and balance
A tool held at arm's length loads the shoulder with a moment $M_s = m g x$: a 2.5 kg grinder held 500 mm from the shoulder adds 12 N·m to the weight of the arm itself — for as long as it is held. A commonly quoted guideline is about 2.3 kg for a tool held in one hand for long periods, less for precision work. The centre of mass should sit over or just in front of the grip, so the tool does not tip the wrist. For heavier tools or long use:
- **Spring balancers** hang the tool from above, carrying nearly all its weight; the operator only guides it.
- **Articulated arms** carry the weight and also take the reaction torque.
- **Two handles** (a side handle on a grinder or a drill) share the load and control the tool.

### Handle shape and the work surface
The same rule as for hand tools — bend the tool, not the wrist — decides the type:

| Work surface | Tool that keeps the wrist straight | Wrong choice |
|---|---|---|
| Horizontal, at or below the elbow | in-line (straight) tool | pistol grip: elbow raised, wrist bent |
| Vertical, near elbow height | pistol-grip tool | in-line tool: wrist bent sideways or elbow lifted |
| Awkward, deep or tight | right-angle tool | — (but mind its reaction torque) |

Triggers held for long should be long enough for two or more fingers, or be a lever along the handle.

### Reaction torque
When a nutrunner or a screwdriver reaches its torque, the joint stops and the tool body tries to turn the other way. The operator must resist a force $F = M/L$ at the handle, where $M$ is the torque and $L$ the lever arm: a right-angle nutrunner tightening to 40 N·m with 250 mm from spindle to grip needs 160 N — a sharp jerk, repeated hundreds of times a shift. The tool matters as much as the torque: a shut-off clutch or an electronically controlled tool stops quickly; a slipping clutch or a stalling motor holds the reaction longer; pulse and impulse tools transmit little reaction. The joint matters too — ISO 5393 tests tools on a "hard" joint (full torque within about 30° of turning) and a "soft" one (about 720°); on soft joints the torque builds slowly and pulls the arm further. Above small torques use a **reaction arm** or a torque tube that takes the torque into the structure.

### Vibration
Vibration transmitted to the hands damages the small blood vessels and nerves of the fingers — the hand-arm vibration syndrome, with "vibration white finger", numbness and loss of grip — and the tendons and joints (see [[hand-arm-vibration]]). ISO 5349-1 measures the frequency-weighted acceleration at the handle, $a_{hv}$, and the daily exposure is its energy-equivalent over 8 hours, using a [[?square-root|square root]]:

$$A(8) = a_{hv}\\sqrt{\\frac{T}{T_0}},\\qquad T_0 = 8\\ \\mathrm{h}$$

The EU Directive 2002/44/EC sets an **exposure action value** of 2.5 m/s² and a **limit value** of 5 m/s². A tool vibrating at 5 m/s² reaches the action value after 2 h of trigger time, one at 10 m/s² after 30 minutes. Several tools combine as the square root of the sum of their squared partial exposures. The UK HSE turns this into "exposure points", $2\\,a_{hv}^2\\,T$ with $T$ in hours: 100 points is the action value. Declared values from standard tests (such as the ISO 28927 series for pneumatic tools and EN 62841 for electric ones) are a starting point; in use, with worn parts or hard materials, they can be higher. Reduce vibration at the source (low-vibration tools, sharp bits, balanced discs, maintenance), then the time; anti-vibration gloves, tested under ISO 10819, do little at the low frequencies that matter most. Warm hands and dry clothing help the circulation.

In the simulations, watch A(8) against the action and limit lines as you change the vibration and trigger time, switch the balancer and reaction arm on and off, and compare in-line and pistol grips in the wrist view.

### Settings
- **Workshop and industry**: repeated fastening on assembly lines (balancers, reaction arms, controlled tools), grinding and fettling (vibration and noise).
- **Construction and field**: breakers, hammer drills, disc cutters and chainsaws, often with high vibration, dust and noise, and in cold weather that worsens the effect of vibration (see [[construction-ergonomics]]).
- **Military**: vehicle and aircraft maintenance in the field, often in awkward positions and in the cold.

> [!warn] Tingling, numbness or whitening of the fingers after using vibrating tools are warning signs: report them and see a doctor or occupational health service. Legal limits for vibration are those of your country.

> [!key] Support the weight, choose the handle for the surface, take reaction torque into the tool or an arm, and keep A(8) below 2.5 m/s² by choosing low-vibration tools and limiting trigger time.
`,
  ideas: [
    'A held tool loads the shoulder with m·g·x for as long as it is held; balancers and arms take the weight.',
    'In-line tools suit horizontal surfaces below the elbow, pistol grips vertical surfaces near elbow height.',
    'Reaction force at the handle is the torque divided by the lever arm; controlled and pulse tools, and reaction arms, reduce it.',
    'Daily vibration exposure A(8) = a·√(T/8 h); the EU action value is 2.5 m/s² and the limit 5 m/s².',
    'Reduce vibration at the source first; anti-vibration gloves help little.'
  ],
  pitfalls: [
    'Half the trigger time halves the vibration exposure — A(8) goes with the square root of time: halving the time reduces it only by about 30 %.',
    'Anti-vibration gloves solve the vibration problem — They damp mainly high frequencies; the low frequencies that do most harm pass through. Low-vibration tools and less time work.',
    'A tool\'s declared vibration value is what the operator receives — It comes from a standard test; worn tools, hard materials and poor technique can give more in use.'
  ],
  formulas: [
    {
      name: 'Daily vibration exposure A(8)',
      expr: 'A8 = a*sqrt(T/T0)', tex: 'A_8 = a_{hv}\\sqrt{\\dfrac{T}{T_0}}',
      vars: {
        A8: { name: 'daily exposure A(8)', q: 'accel', unit: 'm/s²', tex: 'A_8' },
        a: { name: 'vibration total value at the handle', q: 'accel', unit: 'm/s²', value: 5, tex: 'a_{hv}' },
        T: { name: 'daily trigger (exposure) time', q: 'time', unit: 'h', value: 2 },
        T0: { name: 'reference duration', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'ISO 5349-1 and Directive 2002/44/EC. For several tools, A(8) = √(A₁(8)² + A₂(8)² + …).',
      stories: { A8: 'A grinder vibrates at {a} and is used for {T} a day. What is the daily exposure?', T: 'A tool vibrates at {a}. How long can it be used before the exposure reaches {A8}?' }
    },
    {
      name: 'Reaction force at the handle',
      expr: 'F = M/L', tex: 'F = \\dfrac{M}{L}',
      vars: {
        F: { name: 'force the operator must resist', q: 'force', unit: 'N' },
        M: { name: 'tightening torque', q: 'torque', unit: 'N·m', value: 40 },
        L: { name: 'lever arm from the spindle to the grip', q: 'length', unit: 'mm', value: 250 }
      },
      note: 'For a right-angle tool; a pistol tool is resisted by the wrist and forearm, an in-line tool by twisting the grip — only for small torques.',
      stories: { F: 'A right-angle nutrunner tightens to {M} with its grip {L} from the spindle. What force jerks the operator\'s hand?', L: 'How long must the handle be for a {M} tightening to need only {F}?' }
    },
    {
      name: 'Shoulder moment from a held tool',
      expr: 'Ms = m*g*x', tex: 'M_s = m\\,g\\,x',
      vars: {
        Ms: { name: 'moment at the shoulder from the tool', q: 'torque', unit: 'N·m', tex: 'M_s' },
        m: { name: 'tool mass', q: 'mass', unit: 'kg', value: 2.5 },
        g: { const: 'g' },
        x: { name: 'horizontal distance from the shoulder to the tool', q: 'length', unit: 'mm', value: 500 }
      },
      note: 'The arm\'s own weight adds several N·m more; a balancer removes the tool\'s part.',
      stories: { Ms: 'A {m} tool is held {x} in front of the shoulder. What moment does it add at the shoulder?' }
    },
    {
      name: 'Exposure points (UK HSE)',
      expr: 'Pt = 2*a^2*T', tex: 'P = 2\\,a_{hv}^2\\,T',
      vars: {
        Pt: { name: 'exposure points (100 = the action value, 400 = the limit)', q: false, tex: 'P' },
        a: { name: 'vibration total value', q: false, unit: 'm/s²', value: 5, tex: 'a_{hv}' },
        T: { name: 'trigger time', q: false, unit: 'h', value: 2 }
      },
      note: 'Points add up across tools, which makes a day\'s total easy to keep.',
      stories: { Pt: 'A tool at {a} is used for {T}. How many exposure points is that?' }
    }
  ],
  examples: [
    {
      title: 'How long can a grinder be used?',
      q: 'An angle grinder vibrates at 6 m/s² at the handle in use. It is used for 3 h a day. Find A(8), and the trigger times to reach the action value (2.5 m/s²) and the limit (5 m/s²).',
      steps: [
        '$A(8) = 6\\sqrt{3/8} = 3.7$ m/s² — above the action value.',
        'Action value: $T = 8\\,(2.5/6)^2 = 1.4$ h.',
        'Limit: $T = 8\\,(5/6)^2 = 5.6$ h. In points: $2 \\times 36 \\times 3 = 216$.'
      ],
      a: 'A(8) ≈ 3.7 m/s²; about 1.4 h to the action value and 5.6 h to the limit.'
    },
    {
      title: 'A right-angle nutrunner',
      q: 'A right-angle nutrunner tightens 400 bolts a shift to 40 N·m; the grip is 250 mm from the spindle. What force must the operator resist each time, and what does a reaction arm change?',
      steps: [
        '$F = 40/0.25 = 160$ N — about the weight of 16 kg, applied as a jerk 400 times.',
        'With a reaction arm fixed to the structure, the torque goes into the arm: the operator only guides the tool.',
        'A controlled electric tool with a fast shut-off also shortens the jerk.'
      ],
      a: '160 N at the grip every tightening, unless an arm takes it.'
    }
  ],
  quiz: [
    { q: 'A tool vibrates at 10 m/s². About how long can it be used before A(8) reaches 2.5 m/s²?', choices: ['30 minutes', '2 hours', '4 hours', '8 hours'], a: 0, why: '$T = 8\\,(2.5/10)^2 = 0.5$ h.' },
    { q: 'Halving the daily trigger time halves A(8).', a: false, why: 'A(8) goes with the square root of time: half the time gives $1/\\sqrt 2$, about 71 % of the exposure.' },
    { q: 'Screws are driven vertically down into a bench-height horizontal surface. Which tool shape keeps the wrist straight?', choices: ['An in-line (straight) tool', 'A pistol-grip tool', 'A right-angle tool held overhead', 'Any shape'], a: 0, why: 'On a horizontal surface below the elbow, an in-line tool lines up with the fist; a pistol grip forces the elbow up and the wrist to bend.' },
    { q: 'What most reduces the reaction torque felt by the operator of a nutrunner?', choices: ['A reaction arm or a controlled (fast shut-off) tool', 'Holding the tool more tightly', 'A longer trigger', 'Anti-vibration gloves'], a: 0, why: 'The arm takes the torque into the structure; fast shut-off shortens the reaction.' },
    { q: 'A 2 kg drill is held 400 mm in front of the shoulder. What moment does it add there (N·m)?', answer: 7.85, unit: 'N·m', why: '$2 \\times 9.81 \\times 0.4 = 7.8$ N·m, on top of the arm\'s own weight.' }
  ],
  problems: [
    { q: 'A hammer drill vibrates at 9 m/s². What trigger time gives the EU exposure limit value of 5 m/s² as A(8)?', answer: 2.47, unit: 'h', tol: 0.02, steps: ['$T = 8\\,(5/9)^2 = 2.47$ h.'] },
    { q: 'An operator uses a sander at 4 m/s² for 2 h and a breaker at 9 m/s² for 30 min. What is the total A(8)?', answer: 3.01, unit: 'm/s²', tol: 0.02, steps: ['Sander: $4\\sqrt{2/8} = 2.0$ m/s².', 'Breaker: $9\\sqrt{0.5/8} = 2.25$ m/s².', 'Total: $\\sqrt{2.0^2 + 2.25^2} = 3.0$ m/s² — above the action value.'] }
  ],
  ranges: [
    { dim: 'Daily hand-arm vibration exposure A(8)', range: [null, 2.5], unit: 'm/s²', who: 'every operator of vibrating tools; 5 m/s² is the EU limit value that must never be exceeded', why: 'Keeps the risk of vibration white finger, numbness and loss of grip low over a working life.', limits: 'Not a safe threshold for everyone: people with circulation problems, and work in the cold, need more care. National rules differ outside the EU.', setting: ['workshop', 'field', 'military'], src: 'Directive 2002/44/EC; ISO 5349-1' },
    { dim: 'Trigger time before the action value, tool at 5 m/s²', range: [null, 2], unit: 'h', who: 'one tool used all day; 30 min at 10 m/s², about 4 h at 3.5 m/s²', why: 'Turns the vibration value into a working-time budget.', limits: 'In-use vibration is often above the declared value; count every tool in the day.', setting: ['workshop', 'field'], src: 'Derived from A(8) = a√(T/8 h)' },
    { dim: 'Mass of a power tool held in one hand for long periods', range: [null, 2.3], unit: 'kg', who: 'most operators, tool held near the body', why: 'Limits the static load on the wrist, forearm and shoulder.', limits: 'Much less when held away from the body or overhead; heavier tools need a second handle, a balancer or an arm.', setting: ['workshop', 'field'], src: 'Commonly quoted guideline (5 lb)' },
    { dim: 'Grip diameter of a power-tool handle', range: [32, 51], unit: 'mm', who: 'small hands at the lower end, large and gloved hands at the upper', why: 'A full power grip with the least squeezing.', limits: 'Pistol-grip handles are often oval; the smallest users decide the size where one tool is shared.', setting: 'workshop', src: 'NIOSH (2004), for handles in general' }
  ],
  applications: [
    'Fastening stations with balancers, reaction arms and controlled nutrunners on assembly lines.',
    'Vibration exposure plans for construction, foundries, shipyards and forestry.',
    'Choosing in-line, pistol or right-angle tools for each joint and surface.',
    'Checking a day\'s exposure with [the vibration calculator](#/tools/environment/vibration).'
  ],
  sources: [
    'Directive 2002/44/EC on the minimum health and safety requirements regarding the exposure of workers to the risks arising from physical agents (vibration).',
    'ISO 5349-1, *Mechanical vibration — Measurement and evaluation of human exposure to hand-transmitted vibration — Part 1: General requirements*.',
    'ISO 5393, *Rotary tools for threaded fasteners — Performance test method*.',
    'ISO 10819, *Mechanical vibration and shock — Hand-arm vibration — Measurement and evaluation of the vibration transmission of gloves at the palm of the hand*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on tools and vibration.'
  ],
  sim: ['wk-power-tool', { id: 'wk-hand-tool', params: { mode: 'wrist' } }]
},

{
  id: 'material-flow-layout', parent: 'workshop-topic', title: 'Material flow and layout', level: 1,
  short: 'Where things are placed decides how far people walk, how often they lift, and from what height. A good layout follows the flow of the work, keeps the heaviest and busiest routes short, stores things at the point of use between knuckle and shoulder height, and brings loads to the worker on conveyors, lift tables and trolleys instead of lifting them by hand.',
  keywords: ['material flow', 'layout', 'from-to chart', 'spaghetti diagram', 'walking distance', 'travel', 'handling', 'golden zone', 'storage height', 'lift table', 'trolley', 'conveyor', 'aisle width', 'point of use', 'U-shaped cell'],
  prereq: ['lifting-principles', 'storage-heights', 'workbench-design'],
  related: ['handling-aids', 'pushing-pulling', 'carrying-loads', 'assembly-lines', 'doors-corridors', 'niosh-lifting-equation', 'work-rest-scheduling', 'standing-all-day'],
  body: `
Material handling adds no value to a product but it adds effort, time and risk to the people who do it. Every metre walked with a part, every lift from the floor and every double handling can be designed out — or designed in — by the layout.

### Measure the flow
List the moves between stations in a **from–to chart**: how many trips a day go from each station to each other. Multiply by the distance and add up; the result, the total distance travelled (or better, the sum of load × distance), is the number to reduce. A trip there and back between stations $d$ apart, made $n$ times a day, costs

$$D = 2\\,n\\,d,\\qquad t = D/v$$

at a walking speed $v$ of about 1–1.4 m/s. Forty trips a day between a store and a saw 35 m apart are 2.8 km and about 40 minutes of walking; with the saw 8 m from the store, 640 m and 9 minutes. A **spaghetti diagram** — the real paths drawn on the plan — makes the same point visually. Put the stations with the heaviest flows next to each other, in the order of the work (a line or a U-shaped cell), and keep crossings and back-tracking out.

### Heights: the golden zone
Where loads are picked or put down matters as much as how far they travel. Handling is easiest between **knuckle height and shoulder height**: no stooping, no reaching overhead. For a zone that suits everyone, take the lower limit from the tallest users' knuckle height and the upper from the smallest users' shoulder height. With the representative data here and 25 mm of shoe that is about **855 to 1260 mm**. Heavy and frequently used items go in it; light and rare ones above or below; nothing heavy on the floor or above the shoulder (see [[storage-heights]] and the NIOSH vertical multiplier in [[niosh-lifting-equation]]).

### Bring the load to the worker
- **Lift tables** and self-levelling pallet tables keep the top layer of a pallet at a constant, comfortable height as it is filled or emptied.
- **Conveyors and roller tables** at work height move parts sideways instead of lifting them.
- **Tilting bins and turntables** let people reach the far side without leaning.
- **Trolleys and carts**: pushing needs far less effort than carrying (see [[pushing-pulling]]). Handles belong between hip and elbow height, but no single horizontal handle does that for everyone: the tallest men's hip height (about 1016 mm with shoes) is above the smallest women's elbow (about 964 mm) — hence vertical handles or several grip heights spanning about 830 to 1210 mm.
- **Point-of-use storage**: parts delivered to the line in the quantity and orientation needed (kitting), so they are handled once.

### Space to move
Aisles must let people pass with what they carry. The 95th-percentile man's shoulders are about 526 mm broad; with clothing about 575 mm; two such people pass in about **1150 mm** — more with loads, trolleys and turning space, and much more where fork-lift trucks run (separate their routes from pedestrians). Building and workplace codes set the legal minimums where you work (see [[doors-corridors]]).

In the simulation, drag the stations of a small workshop and watch the daily walking distance, the time and the heaviest routes change; press *Flow line* to lay them out in the order of the work.

### Settings
- **Workshop and industry**: flow lines and cells, lift tables and conveyors; the biggest savings are often in walking and double handling.
- **Warehouses and retail backrooms**: the golden zone for fast movers, the floor and the top for pallets handled by machines.
- **Health care**: supplies stored near the point of care cut nurses' walking (see [[hospital-workstations]]).
- **Military and field**: depots, field kitchens and ammunition or ration handling in temporary layouts — plan the flow, keep loads off the ground on stands or pallets, and use handling equipment that can travel.

> [!key] Lay out for the flow: heavy and frequent routes short, stored items at the point of use between knuckle and shoulder height, loads moved by tables, conveyors and trolleys rather than by lifting and carrying.
`,
  ideas: [
    'The layout decides the walking and the handling: measure trips × distance and reduce it.',
    'A trip there and back n times a day over d metres is 2nd metres; at 1–1.4 m/s that is time lost every day.',
    'The zone everyone handles comfortably runs from the tallest users\' knuckle height to the smallest users\' shoulder height: about 855–1260 mm.',
    'Lift tables, conveyors, trolleys and point-of-use storage remove lifts and carries at their source.',
    'Aisles for two people passing need about 1150 mm; loads, trolleys and trucks need more.'
  ],
  pitfalls: [
    'Walking is healthy, so long routes do no harm — Walking while carrying adds load, time and trips over the day; breaks and varied work give movement without the load.',
    'The floor is fine for storage if the load is light — Every pick from the floor is a stoop; repeated many times a day even light items load the back.',
    'One handle height on a trolley suits everyone — No horizontal handle is between hip and elbow height for both the smallest and the tallest users; vertical handles solve it.'
  ],
  formulas: [
    {
      name: 'Walking distance per day',
      expr: 'D = 2*n*d', tex: 'D = 2\\,n\\,d',
      vars: {
        D: { name: 'distance walked per day', q: 'length', unit: 'km' },
        n: { name: 'trips per day', q: 'count', value: 40, int: true },
        d: { name: 'distance between the stations', q: 'length', unit: 'm', value: 35 }
      },
      note: 'Each trip there and back; use the real walking route, not the straight line.',
      stories: { D: 'A worker makes {n} trips a day between two stations {d} apart. How far does she walk?' }
    },
    {
      name: 'Time spent walking',
      expr: 't = D/v', tex: 't = \\dfrac{D}{v}',
      vars: {
        t: { name: 'time per day', q: 'time', unit: 'h' },
        D: { name: 'distance walked per day', q: 'length', unit: 'km', value: 2.8 },
        v: { name: 'walking speed', q: 'speed', unit: 'm/s', value: 1.2 }
      },
      stories: { t: 'Walking {D} a day at {v}, how much of the shift is spent walking?' }
    },
    {
      name: 'Lower edge of the everyone-zone',
      expr: 'zl = mk + z*sk + a', tex: 'z_l = \\mu_k + z\\,\\sigma_k + a_s',
      vars: {
        zl: { name: 'lowest height without stooping for the tallest users', q: 'length', unit: 'mm', tex: 'z_l' },
        mk: { name: 'mean knuckle height, men', q: 'length', unit: 'mm', value: 765, tex: '\\mu_k' },
        z: { name: 'standard normal value (1.645 for the 95th percentile)', q: 'none', value: 1.645 },
        sk: { name: 'standard deviation of knuckle height, men', q: 'length', unit: 'mm', value: 38, tex: '\\sigma_k' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' }
      },
      stories: { zl: 'Men\'s knuckle height is {mk} ± {sk}. With {a} of shoe, what is the knuckle height at z = {z}?' }
    },
    {
      name: 'Upper edge of the everyone-zone',
      expr: 'zu = ms - z*ss + a', tex: 'z_u = \\mu_s - z\\,\\sigma_s + a_s',
      vars: {
        zu: { name: 'highest height without reaching above the shoulder for the smallest users', q: 'length', unit: 'mm', tex: 'z_u' },
        ms: { name: 'mean shoulder height, women', q: 'length', unit: 'mm', value: 1330, tex: '\\mu_s' },
        z: { name: 'standard normal value (1.645 for the 5th percentile)', q: 'none', value: 1.645 },
        ss: { name: 'standard deviation of shoulder height, women', q: 'length', unit: 'mm', value: 58, tex: '\\sigma_s' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' }
      },
      stories: { zu: 'Women\'s shoulder height is {ms} ± {ss}. With {a} of shoe, what is the shoulder height at z = −{z}?' }
    }
  ],
  examples: [
    {
      title: 'Moving the saw',
      q: 'A worker makes 40 trips a day between the store and the saw, 35 m apart, at 1.2 m/s. How much walking does moving the saw to 8 m from the store save?',
      steps: [
        'Now: $D = 2 \\times 40 \\times 35 = 2800$ m; $t = 2800/1.2 = 2333$ s = 39 min.',
        'After: $D = 2 \\times 40 \\times 8 = 640$ m; 9 min.',
        'About 2.2 km and half an hour a day, every day — and 80 fewer carries over long distances.'
      ],
      a: 'About 2.2 km and 30 minutes a day.'
    },
    {
      title: 'The zone for heavy items',
      q: 'Men\'s knuckle height is 765 ± 38 mm and women\'s shoulder height 1330 ± 58 mm, barefoot. With 25 mm of shoe, between which heights can heavy, frequently used items be stored for the 5th-percentile woman to the 95th-percentile man?',
      steps: [
        'Lower edge: $765 + 1.645 \\times 38 + 25 = 853$ mm.',
        'Upper edge: $1330 - 1.645 \\times 58 + 25 = 1260$ mm.',
        'Shelves for heavy, frequent items between about 855 and 1260 mm; lighter items above and below.'
      ],
      a: 'About 855–1260 mm.'
    }
  ],
  quiz: [
    { q: 'Which layout change usually saves the most handling effort?', choices: ['Putting the stations with the heaviest flows next to each other, in the order of the work', 'Painting the aisles', 'Making every aisle wider', 'Storing everything on the floor'], a: 0, why: 'The total of trips × distance is dominated by the busiest routes; shortening them saves the most.' },
    { q: 'The zone that suits everyone for handling heavy items runs from…', choices: ['the tallest users\' knuckle height to the smallest users\' shoulder height', 'the floor to the ceiling', 'the smallest users\' knuckle height to the tallest users\' shoulder height', 'the average elbow height ± 100 mm'], a: 0, why: 'Above the tallest users\' knuckles nobody stoops; below the smallest users\' shoulders nobody reaches overhead.' },
    { q: 'Forty trips a day over 25 m each way, how far is walked (km)?', answer: 2, unit: 'km', why: '$2 \\times 40 \\times 25 = 2000$ m = 2 km.' },
    { q: 'A self-levelling pallet table helps because…', choices: ['it keeps the layer being handled at a constant, comfortable height', 'it makes pallets lighter', 'it lets people carry pallets', 'it speeds up fork-lift trucks'], a: 0, why: 'As layers are removed, the pallet rises, so no lift starts from near the floor.' }
  ],
  problems: [
    { q: 'A route is used 60 times a day (there and back) over 18 m. At 1.2 m/s, how many minutes of walking is that per day?', answer: 30, unit: 'min', tol: 0.01, steps: ['$D = 2 \\times 60 \\times 18 = 2160$ m.', '$t = 2160/1.2 = 1800$ s = 30 min.'] }
  ],
  ranges: [
    { dim: 'Height band for heavy and frequently handled items', range: [855, 1260], unit: 'mm', who: '95th-percentile man\'s knuckle height to 5th-percentile woman\'s shoulder height, with 25 mm of shoe', why: 'Nobody stoops and nobody lifts above the shoulder.', limits: 'Narrow: light and rarely used items go above and below; for a known workforce use its own data.', setting: ['workshop', 'civil', 'health'], src: 'Representative body data; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Handle heights on a trolley or cart (vertical handles covering)', range: [830, 1210], unit: 'mm', who: '5th-percentile woman\'s hip height to 95th-percentile man\'s elbow height, with shoes', why: 'Everyone can push between hip and elbow height, where pushing is strongest and the back upright.', limits: 'A single horizontal handle cannot suit everyone; heavy carts also need good castors and smooth floors.', setting: ['workshop', 'health', 'civil'], src: 'Representative body data; ISO 11228-2 (pushing and pulling)' },
    { dim: 'Clear width for two people to pass', range: [1150, null], unit: 'mm', who: 'two 95th-percentile men with clothing (about 575 mm each)', why: 'People pass without turning sideways or brushing.', limits: 'Carrying loads, trolleys, wheelchairs and emergency routes need more; fork-lift aisles are set by the trucks; codes set legal minimums.', setting: ['workshop', 'civil', 'health'], src: 'Representative shoulder breadth; building and workplace codes' },
    { dim: 'Walking speed for planning routes', range: [1.0, 1.4], unit: 'm/s', who: 'adults walking at work; slower when carrying, older or on uneven ground', why: 'Turns distances into working time.', limits: 'Planning figure only; measure the real routes.', setting: ['workshop', 'health'], src: 'Typical adult walking speeds' }
  ],
  applications: [
    'Rearranging machine shops into flow lines and cells to cut walking and handling.',
    'Warehouse slotting: fast movers in the golden zone.',
    'Lift tables, roller conveyors and trolleys in place of manual lifting and carrying.',
    'Planning field kitchens, depots and maintenance areas in temporary buildings.'
  ],
  sources: [
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting, lowering and carrying*.',
    'ISO 11228-2, *Ergonomics — Manual handling — Part 2: Pushing and pulling*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on reach, storage heights and workspace layout.',
    'Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, chapters on workplace design and manual handling.',
    'ISO 6385, *Ergonomics principles in the design of work systems*.'
  ],
  sim: 'wk-flow-layout'
},

{
  id: 'standing-all-day', parent: 'workshop-topic', title: 'Standing all day', level: 1,
  short: 'Standing still for hours loads the legs, feet and back and lets blood pool in the legs; walking and changing posture relieve it. The remedies are variety — sit, stand and walk in turns — sit–stand stools and seats wherever the work allows, firm cushioned floors or mats, good footwear and a foot rail, and work heights that suit both standing and perching.',
  keywords: ['prolonged standing', 'standing work', 'sit-stand stool', 'perching', 'anti-fatigue mat', 'footwear', 'foot rail', 'venous pooling', 'calf muscle pump', 'varicose veins', 'posture variation', 'seating at work', 'sit-stand'],
  prereq: ['standing-work-heights', 'static-muscle-work', 'neutral-postures'],
  related: ['sit-stand-work', 'workbench-design', 'fatigue-rest-breaks', 'retail-checkouts', 'commercial-kitchens', 'hospital-workstations', 'assembly-lines', 'physics:hydrostatic-pressure', 'medicine:blood-vessels'],
  body: `
Standing is not rest. Standing **still** holds the leg and back muscles in steady low-level contraction, loads the joints and the soles of the feet without pause, and lets gravity pool blood in the legs. Many studies of shop assistants, assembly workers, cooks, surgeons and hairdressers link long hours of standing with low back pain, leg and foot pain, swollen legs and varicose veins. The problem is not the upright posture itself but the **lack of change**.

### Why the legs swell
In the veins, blood stands as a column from the heart to the feet. Its pressure at the ankle follows the [[physics:hydrostatic-pressure|hydrostatic law]]:

$$p = \\rho\\,g\\,h$$

With blood at about 1060 kg/m³ and 1.2 m from the heart to the ankle, $p$ ≈ 12.5 kPa, about **94 mmHg**, when standing still. Walking works the **calf muscle pump**: each contraction squeezes the deep veins, and valves stop the blood falling back, so the pressure at the ankle drops to a fraction of that value. Standing still switches the pump off; fluid leaks into the tissues, and over years the vein walls and valves can give way (see [[medicine:blood-vessels]]).

### The remedies
| Measure | Virtue | Limitation |
|---|---|---|
| **Variety**: sit, stand and walk in turns; jobs that include walking | restarts the calf pump, changes the loaded tissues | needs work organised for it |
| **Seat or sit–stand stool** at the workstation | takes 60 % or more of the body weight off the legs while keeping the reach and height of standing | must adjust in height, be stable and leave room for the legs |
| **Firm, cushioned floor or anti-fatigue mat** | less discomfort on hard floors in many studies | too soft is tiring; curled or thick edges trip people; kitchens need drainable, cleanable mats |
| **Footwear**: supportive, cushioned, well-fitting, low heel | spreads the load under the foot | safety footwear must still fit; worn cushioning stops working |
| **Foot rail or footrest** | lets people shift weight and flex the hips in turns | only one foot at a time |
| **Micro-breaks** and moving on the spot | calf-pump action every few minutes | no substitute for real sitting breaks |

### Perching: between sitting and standing
A **sit–stand (perching) stool** has a high, often forward-sloping seat. The hips open to about 120–135° between trunk and thigh — between sitting (about 90°) and standing (180°) — and the feet stay on the floor. Because the thighs slope down, the hips and elbows drop by only about 150–200 mm compared with standing, so the same bench suits both postures within a task band. In the simple model used in the simulation (shins vertical, link lengths as fractions of stature), a stool must adjust from about **570 to 790 mm** to give trunk–thigh angles of 120–135° to the 5th-percentile woman and the 95th-percentile man. Look for a stable base, a seat that tilts, and room for the knees under the bench.

In the simulation, switch between standing, perching and sitting at a high bench: watch the trunk–thigh and knee angles, the elbow height against the bench, and the footrest a high chair needs.

### Settings
- **Workshop and industry**: assembly, machine tending and inspection. A stool at every standing station, the work height set for standing, and a job cycle that includes walking.
- **Retail and hospitality**: checkouts, counters and bars. Seating for cashiers is standard in much of Europe and required where the work allows it in some places — for example the UK's Workplace (Health, Safety and Welfare) Regulations 1992 and the seating provisions of California's wage orders (see [[retail-checkouts]]).
- **Health care**: surgeons, theatre staff and laboratory workers stand for hours; stools and anti-fatigue mats in theatres, and planned rest (see [[hospital-workstations]]).
- **Kitchens**: hard, wet floors — drainable mats and slip-resistant shoes (see [[commercial-kitchens]]).
- **Military and field**: sentries, guards and parade standing; periodic movement and footwear matter most.
- **Offices** are the opposite problem: people who sit all day gain by standing and moving more. An expert statement (Buckley and colleagues, 2015) advised building up to 2 h a day of standing and light activity at work, and then to 4 h (see [[sit-stand-work]]).

> [!warn] Painful, swollen or discoloured legs, or leg pain with swelling on one side, should be checked by a doctor. Pregnant workers may need more seated time and breaks — discuss it with occupational health.

> [!key] The enemy is standing still, not standing: give people seats and stools that fit the standing work height, surfaces and shoes that cushion, and work that lets them change posture and walk.
`,
  ideas: [
    'Long periods of standing still load the legs, feet and back and pool blood in the legs.',
    'Venous pressure at the ankle while standing still is about ρgh ≈ 94 mmHg; walking and the calf pump lower it.',
    'Variety — sit, stand, walk — is the main remedy; mats, shoes and foot rails help comfort.',
    'Perching stools keep the reach and height of standing while taking weight off the legs; they must adjust (about 570–790 mm).',
    'Office workers have the opposite problem: they gain from standing and moving more.'
  ],
  pitfalls: [
    'Standing is healthier than sitting, so standing all day is fine — Any posture held for hours is harmful; what helps is changing between them.',
    'The softer the mat, the better — Very soft surfaces make the leg muscles work to stabilise; firm cushioning with bevelled edges works better.',
    'A stool at a standing bench needs the bench lowered — A perching stool drops the elbows by only about 150–200 mm; the same bench works for standing and perching.'
  ],
  formulas: [
    {
      name: 'Venous pressure at the ankle, standing still',
      expr: 'p = rho*g*h', tex: 'p = \\rho\\,g\\,h',
      vars: {
        p: { name: 'extra pressure at the ankle', q: 'pressure', unit: 'mmHg' },
        rho: { name: 'density of blood', q: 'density', unit: 'kg/m³', value: 1060, tex: '\\rho' },
        g: { const: 'g' },
        h: { name: 'height of the heart above the ankle', q: 'length', unit: 'm', value: 1.2 }
      },
      note: 'The hydrostatic part only, with the calf pump idle; walking lowers it.',
      stories: { p: 'A worker stands still with the heart {h} above the ankles. What pressure does the column of blood add at the ankle?' }
    },
    {
      name: 'Height of a perching seat (simple model)',
      expr: 'hs = a + S*(0.234 + 0.245*sin(theta))', tex: 'h_s = a_s + S\\,(0.234 + 0.245\\sin\\theta)',
      vars: {
        hs: { name: 'seat height', q: 'length', unit: 'mm', tex: 'h_s' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        S: { name: 'stature', q: 'length', unit: 'mm', value: 1520 },
        theta: { name: 'thigh slope below the horizontal (trunk–thigh angle − 90°)', q: 'angle', unit: '°', value: 35, min: 0, max: 60, tex: '\\theta' }
      },
      note: 'Shins vertical, link lengths as fractions of stature (Drillis and Contini): ankle 0.039, shank 0.246, thigh 0.245, hip joint 0.051 above the seat. θ = 30–45° gives trunk–thigh angles of 120–135°.',
      stories: { hs: 'A worker {S} tall perches with the thighs sloping {theta} below the horizontal, in {a} shoes. How high is the seat?', theta: 'A perching seat is at {hs}. At what thigh slope does a person {S} tall sit on it?' }
    }
  ],
  examples: [
    {
      title: 'Blood pressure at the ankle',
      q: 'The heart is 1.2 m above the ankles and blood has a density of 1060 kg/m³. What pressure does the column of blood add at the ankle when standing still?',
      steps: [
        '$p = 1060 \\times 9.81 \\times 1.2 = 12\\,478$ Pa.',
        'In mmHg: $12\\,478 / 133.3 = 94$ mmHg — on top of the pressure in the veins at heart level.',
        'Walking works the calf pump and brings the pressure at the ankle down to a fraction of this.'
      ],
      a: 'About 94 mmHg (12.5 kPa).'
    },
    {
      title: 'How far must a perching stool adjust?',
      q: 'Using the model $h_s = 25 + S\\,(0.234 + 0.245\\sin\\theta)$ with a thigh slope of 35°, find the seat heights for the 5th-percentile woman (1520 mm) and the 95th-percentile man (1870 mm).',
      steps: [
        '$0.234 + 0.245 \\sin 35° = 0.3745$.',
        'Woman: $25 + 1520 \\times 0.3745 = 594$ mm. Man: $25 + 1870 \\times 0.3745 = 725$ mm.',
        'At slopes of 30–45° the range widens to about 570–790 mm.'
      ],
      a: 'About 590 to 730 mm at 35°; about 570–790 mm to cover 30–45°.'
    }
  ],
  quiz: [
    { q: 'Why do legs swell more when standing still than when walking?', choices: ['The calf muscle pump is idle, so venous pressure at the ankle stays high', 'The heart pumps harder when standing', 'Walking lowers the blood\'s density', 'Standing stretches the veins'], a: 0, why: 'Walking squeezes the deep veins with every step; valves stop back-flow, lowering the pressure at the ankle.' },
    { q: 'A worker moves from standing to a perching stool at the same bench. About how much do the elbows drop?', choices: ['About 150–200 mm', 'About 400–500 mm', 'Nothing', 'About 20 mm'], a: 0, why: 'On a perching stool the thighs slope down and the hips stay high; the elbows drop only a little, so the same bench works.' },
    { q: 'An anti-fatigue mat should be as soft as possible.', a: false, why: 'Very soft surfaces make the muscles work to stabilise; firm cushioning with bevelled edges is better.' },
    { q: 'Which change helps most for a cashier who stands all shift?', choices: ['A seat or sit–stand stool at a checkout designed for both postures, plus breaks', 'Thicker socks', 'Standing more upright', 'Faster scanning'], a: 0, why: 'Changing posture and taking weight off the legs deals with the cause; the checkout must be designed so the seated posture works.' }
  ],
  problems: [
    { q: 'For a 1.35 m column of blood (a tall man) at 1060 kg/m³, what is the extra pressure at the ankle in mmHg?', answer: 105.3, unit: 'mmHg', tol: 0.02, steps: ['$p = 1060 \\times 9.81 \\times 1.35 = 14\\,038$ Pa.', '$14\\,038 / 133.32 = 105$ mmHg.'] }
  ],
  ranges: [
    { dim: 'Seat height of a sit–stand (perching) stool, adjustment range', range: [570, 790], unit: 'mm', who: '5th-percentile woman to 95th-percentile man with trunk–thigh angles of 120–135°, in shoes', why: 'Takes weight off the legs while the reach and the working height stay those of standing.', limits: 'From a simple model with vertical shins; feet forward lowers the seat. Stools need a stable base and room for the knees.', setting: ['workshop', 'health', 'civil'], src: 'Derived from representative stature and link lengths (Drillis and Contini, 1966)' },
    { dim: 'Trunk–thigh angle when perching', range: '≈ 120–135°', unit: '', who: 'users of perching stools', why: 'Between sitting (about 90°) and standing (180°): the pelvis tilts less than in sitting and the legs carry less than in standing.', limits: 'A sloping seat needs friction or a knee support, or people slide off.', setting: ['workshop', 'health'], src: 'Descriptive; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Drop of elbow height from standing to perching', range: [150, 200], unit: 'mm', who: '5th-percentile woman to 95th-percentile man at a 35° thigh slope', why: 'The same bench can serve standing and perching work within a task band.', limits: 'Sitting on an ordinary high chair drops the elbows far more and needs a footrest.', setting: 'workshop', src: 'Derived from the model above' },
    { dim: 'Standing and light activity added to an office day', range: [2, 4], unit: 'h', who: 'office workers who sit most of the day: build up from 2 to 4 h', why: 'Breaks up long sitting, with benefits for comfort and health.', limits: 'Expert guidance for sedentary work; for people who already stand all day the aim is the reverse — more seated time.', setting: 'office', src: 'Buckley et al., expert statement, *British Journal of Sports Medicine* (2015)' },
    { dim: 'Posture pattern through a standing shift', range: 'sit, stand and walk in turns', unit: '', who: 'every standing worker', why: 'Changes the loaded tissues and restarts the calf pump.', limits: 'Must be built into the job and the workstation, not left to the worker.', setting: ['workshop', 'health', 'civil'], src: 'ISO 11226 and EN 1005-4 (avoid static postures)' }
  ],
  applications: [
    'Sit–stand stools at assembly, inspection and machine-tending stations.',
    'Seated or sit–stand checkouts, reception desks and ticket counters.',
    'Anti-fatigue and drainable mats in kitchens, operating theatres and workshops.',
    'Job design that mixes standing, walking and seated tasks.'
  ],
  sources: [
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'EN 1005-4, *Safety of machinery — Human physical performance — Part 4: Evaluation of working postures and movements in relation to machinery*.',
    'J. P. Buckley et al., "The sedentary office: an expert statement on the growing case for change towards better health and productivity", *British Journal of Sports Medicine*, 2015.',
    'R. Drillis and R. Contini, *Body Segment Parameters*, New York University (1966) — link lengths as fractions of stature.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on standing work and seating.'
  ],
  sim: 'wk-perch'
},

{
  id: 'patient-handling', parent: 'services-topic', title: 'Moving and handling patients', level: 2,
  short: 'Nurses and care workers move people, not boxes: heavy, unpredictable, without handles, often in cramped rooms. NIOSH analysis puts about 16 kg (35 lb) as the most a caregiver should lift of a patient\'s weight under ideal conditions, so whole-body lifts belong to hoists, and repositioning to slide sheets, lateral transfer aids and height-adjustable beds.',
  keywords: ['patient handling', 'safe patient handling', 'hoist', 'ceiling hoist', 'mobile hoist', 'slide sheet', 'lateral transfer', 'sit-to-stand aid', 'bed height', 'nurses back pain', 'care workers', 'bariatric', 'ISO/TR 12296', 'MAPO', 'no lifting policy'],
  prereq: ['lifting-principles', 'handling-aids', 'spinal-loading'],
  related: ['niosh-lifting-equation', 'pushing-pulling', 'team-lifting', 'hospital-workstations', 'standing-work-heights', 'beds-bedrooms', 'bathroom-ergonomics', 'accessible-design', 'medicine:pain'],
  body: `
Some of the highest rates of back injury in any occupation are among nurses, nursing assistants and care workers. The reason is plain: a person weighs 50 to 150 kg or more, has no handles, may move suddenly or collapse, and must be moved in beds, chairs, toilets and cramped rooms, often by one or two people bending across a bed. Training in "lifting technique" alone has not prevented these injuries; equipment and organisation have.

### How much can a caregiver lift?
In 2007 Thomas Waters of NIOSH applied the revised lifting equation (see [[niosh-lifting-equation]]) to patient handling and concluded that, even under ideal conditions, a caregiver should not lift more than about **35 lb (16 kg)** of a patient's weight. Real conditions — reaching across a bed, twisting, a patient who cannot help — lower it further. Almost every whole-body lift, and many partial ones, exceed it: holding up one leg of a 90 kg person (about 16 % of body mass) is 14 kg; of a 110 kg person, 18 kg.

### Safe patient handling: the equipment
| Task | Equipment | What it removes |
|---|---|---|
| Bed to chair, floor to bed, toileting | **Ceiling (overhead) hoist** or **mobile floor hoist** with a sling | the whole lift; the ceiling hoist also the pushing |
| Standing up a patient who can bear weight | **Sit-to-stand (standing) aid** | lifting the trunk |
| Moving up the bed, turning | **Slide sheets** (low-friction tubes), friction-reducing mattresses | most of the friction |
| Bed to trolley, trolley to table | **Lateral transfer boards**, air-assisted mattresses | the pull across a gap |
| All care at the bedside | **Height-adjustable bed** | stooping over a low bed |
| Getting up after a fall | lifting cushions, floor-level hoists | lifting from the floor |

Sliding still takes force. On a sheet, the pull is the friction $F = \\mu m g$, shared among the carers: with an assumed $\\mu$ = 0.5 for an ordinary sheet, sliding an 80 kg person takes about 390 N, and with a low-friction slide sheet ($\\mu$ ≈ 0.15, assumed) about 120 N — about 60 N each for two carers. Friction coefficients depend on the product and the bed; measure or use the maker's data.

### Heights and space
- **Bed height for care**: hands near the patient at a light-work height for the carer (see [[standing-work-heights]]). The patient lies about 100–150 mm above the mattress, so the mattress top should adjust from about 690 mm (the 5th-percentile woman) to about 990 mm (the 95th-percentile man).
- **Bed height for getting in and out**: the mattress near the patient's popliteal height plus shoe, about 390–520 mm, so that the feet reach the floor; low beds go lower still for people at risk of falls.
- **Trunk inclination**: ISO 11226 accepts static trunk inclinations up to 20°; 20–60° only for limited times; above 60° not at all. Leaning across a low bed easily exceeds 40°.
- **Space**: room around the bed, the toilet and the bath for a hoist, a wheelchair and two carers; ceiling hoists need track and ceiling strength planned in (see [[bathroom-ergonomics]] and [[accessible-design]]).
- **Bariatric care**: beds, hoists, slings and chairs rated for the person's weight, wider doors and more staff.

### Organisation
ISO/TR 12296 describes a whole-hospital approach: assess each patient's mobility, provide the right equipment where it is needed, train staff in it, and assess the risk of each ward (the MAPO method is one such index). Many hospitals and countries have adopted "no manual lifting" or safe patient handling policies, and nursing bodies such as the American Nurses Association have published interprofessional standards (2013). The virtue is double: fewer injuries to staff, and patients handled more safely and with more dignity.

In the simulation, raise and lower the bed and watch the carer's trunk inclination; compare an ordinary sheet, a slide sheet, holding a leg and a hoist; and read the force per carer against the 16 kg limit.

### Settings
- **Health care**: hospitals, operating theatres, imaging, emergency departments.
- **Care homes and home care**: often less equipment and single carers — the highest risk; mobile hoists and adjustable beds at home.
- **Military and field**: casualty evacuation — stretchers, carrying over rough ground and loading vehicles and helicopters; wheeled litters and teams of four or more reduce the load per person.
- **Ambulances**: powered stretchers and loading systems replace lifting the stretcher into the vehicle.

> [!warn] Never lift a person who has fallen by hand if you can avoid it: if they may be hurt, call your local emergency number or the clinical team first; then use a lifting cushion or a hoist.

> [!key] A person is too heavy to lift by hand: about 16 kg is the most a carer should take under ideal conditions. Hoists, slide sheets, lateral transfer aids and adjustable beds do the rest.
`,
  ideas: [
    'Waters (NIOSH, 2007) set about 16 kg (35 lb) as the most of a patient\'s weight a caregiver should lift, under ideal conditions.',
    'Whole-body lifts belong to ceiling or mobile hoists; repositioning to slide sheets and lateral transfer aids.',
    'Sliding still costs μmg; low-friction sheets cut it several-fold.',
    'Height-adjustable beds put care at the carer\'s working height (about 690–990 mm mattress top) and go low for the patient to stand.',
    'Equipment, space and organisation prevent injuries; lifting technique training alone has not.'
  ],
  pitfalls: [
    'Good lifting technique makes patient lifting safe — Technique cannot make an 80 kg lift light; the load itself exceeds safe limits.',
    'Two carers can lift twice as much — Team lifts share the load unevenly and awkwardly; the per-person limit still applies and a hoist is still needed.',
    'A slide sheet makes moving a patient effortless — It lowers the friction but sliding a heavy person still takes a real pull; use enough staff and the bed at the right height.'
  ],
  formulas: [
    {
      name: 'Pull per carer when sliding a patient',
      expr: 'F = mu*m*g/n', tex: 'F = \\dfrac{\\mu\\,m\\,g}{n}',
      vars: {
        F: { name: 'pull per carer', q: 'force', unit: 'N' },
        mu: { name: 'friction coefficient of the sheet on the bed (assumed)', q: 'none', value: 0.15, tex: '\\mu' },
        m: { name: 'patient mass', q: 'mass', unit: 'kg', value: 80 },
        g: { const: 'g' },
        n: { name: 'number of carers pulling', q: 'count', value: 2, int: true }
      },
      note: 'The starting pull; friction coefficients depend on the sheet, mattress and patient — measure or use the maker\'s data.',
      stories: { F: 'Two carers slide a {m} patient on a sheet with friction coefficient {mu}. What pull does each give?', m: 'Each of {n} carers can give {F} with friction {mu}. What patient mass can they slide?' }
    },
    {
      name: 'Load from holding part of a patient',
      expr: 'L = f*m', tex: 'L = f\\,m',
      vars: {
        L: { name: 'load held', q: 'mass', unit: 'kg' },
        f: { name: 'share of body mass (one whole leg ≈ 16 %)', q: 'ratio', unit: '%', value: 16 },
        m: { name: 'patient mass', q: 'mass', unit: 'kg', value: 90 }
      },
      note: 'Compare with about 16 kg, the most a carer should lift under ideal conditions.',
      stories: { L: 'A carer holds up the whole leg ({f} of body mass) of a {m} patient. What load is that?', m: 'Above what patient mass does holding a leg ({f}) exceed {L}?' }
    }
  ],
  examples: [
    {
      title: 'Holding a leg',
      q: 'A leg is about 16 % of body mass. For patients of 70, 90 and 110 kg, compare the load of holding one leg with the 16 kg limit.',
      steps: [
        '70 kg: 11.2 kg — under the limit, if the carer is not stooping or twisting.',
        '90 kg: 14.4 kg — at the limit.',
        '110 kg: 17.6 kg — over it: use a leg-lifting sling on a hoist or a second carer with a support.'
      ],
      a: 'Above about 100 kg even holding one leg exceeds 16 kg.'
    },
    {
      title: 'Slide sheet or ordinary sheet?',
      q: 'Two carers move an 80 kg patient up the bed. Compare the pull per carer on an ordinary sheet (μ = 0.5, assumed) and on a slide sheet (μ = 0.15, assumed).',
      steps: [
        'Ordinary sheet: $0.5 \\times 80 \\times 9.81 / 2 = 196$ N each.',
        'Slide sheet: $0.15 \\times 80 \\times 9.81 / 2 = 59$ N each.',
        'With the bed at hip height and the carers moving their weight rather than jerking, 59 N is manageable; 196 N, reached across a bed, is not.'
      ],
      a: 'About 200 N each against 60 N each.'
    }
  ],
  quiz: [
    { q: 'About how much of a patient\'s weight should one caregiver lift at most, under ideal conditions?', choices: ['About 16 kg (35 lb)', 'About 50 kg', 'Half the patient', 'Any amount with good technique'], a: 0, why: 'Waters\' 2007 application of the NIOSH equation gave 35 lb as the limit; most patient lifts exceed it.' },
    { q: 'A carer bends 45° to reposition a patient on a low bed. What does ISO 11226 say about such a trunk inclination held for a while?', choices: ['Acceptable only for limited times (20–60°): raise the bed', 'Always acceptable', 'Acceptable if the patient is light', 'It says nothing about trunk posture'], a: 0, why: 'Up to 20° is acceptable, 20–60° depends on duration, above 60° is not acceptable; a raised bed removes the lean.' },
    { q: 'A mobile hoist removes all the physical load from the carers.', a: false, why: 'It removes the lift, but pushing and steering a loaded hoist, especially on carpet, still takes force; ceiling hoists remove most of that too.' },
    { q: 'Two carers slide a 100 kg patient on a slide sheet with μ = 0.15. What pull does each give (N)?', answer: 73.6, unit: 'N', why: '$0.15 \\times 100 \\times 9.81 / 2 = 74$ N.' }
  ],
  problems: [
    { q: 'A bariatric patient weighs 160 kg. With a leg at 16 % of body mass, what load does holding one leg represent?', answer: 25.6, unit: 'kg', tol: 0.01, steps: ['$L = 0.16 \\times 160 = 25.6$ kg — far above 16 kg: use a limb-holding sling on a hoist.'] }
  ],
  ranges: [
    { dim: 'Patient weight lifted by one caregiver (whole or part)', range: [null, 16], unit: 'kg', who: 'every caregiver, under ideal conditions (load close, no twisting, good grip)', why: 'Keeps the load on the lower back within the NIOSH recommended limit.', limits: 'Lower when reaching across a bed, twisting or when the patient may move suddenly; above it use a hoist or other device.', setting: 'health', src: 'T. R. Waters, *American Journal of Nursing* (2007); revised NIOSH lifting equation' },
    { dim: 'Mattress-top height for care at the bedside (adjustment)', range: [690, 990], unit: 'mm', who: '5th-percentile woman to 95th-percentile man as carer, patient lying 100–150 mm above the mattress', why: 'The carer\'s hands at a light-work height: little trunk inclination.', limits: 'Heavy repositioning may need the bed a little lower; a bed shared by carers of different heights must adjust between tasks.', setting: 'health', src: 'Derived from representative elbow heights; Kroemer and Grandjean offsets' },
    { dim: 'Mattress-top height for sitting up and standing', range: [390, 520], unit: 'mm', who: 'patients from the 5th-percentile woman to the 95th-percentile man: popliteal height plus shoe', why: 'Feet flat on the floor when sitting on the edge — safer to stand up and to transfer.', limits: 'Older and shorter patients need the lower end; low beds for falls risk go lower still.', setting: ['health', 'civil'], src: 'Representative popliteal height; IEC 60601-2-52 (medical beds) for bed safety' },
    { dim: 'Carer\'s trunk inclination during care', range: '0–20° (20–60° only briefly)', unit: '', who: 'every carer', why: 'Keeps the load on the lower back and the static muscle work low.', limits: 'Above 60° is not acceptable for static postures; many bedside tasks exceed 20° on a low bed.', setting: 'health', src: 'ISO 11226' },
    { dim: 'Friction for sliding a patient', range: 'low-friction slide sheet or device, never an ordinary sheet alone', unit: '', who: 'patients who cannot move themselves', why: 'Cuts the pull several-fold and protects the patient\'s skin from shear.', limits: 'Sheets must be removed after use (a patient left on one can slide out of bed); still needs enough carers.', setting: 'health', src: 'ISO/TR 12296' }
  ],
  applications: [
    'Ceiling-track hoists in intensive care, rehabilitation and care-home rooms.',
    'Slide sheets and air-assisted lateral transfer in wards, imaging and theatres.',
    'Ward risk assessment (for example with the MAPO index) and patient mobility assessment.',
    'Powered stretchers and loading systems in ambulances; wheeled litters in field casualty evacuation.'
  ],
  history: 'Studies of nurses\' back injuries from the 1980s onwards showed that training in lifting technique alone did not reduce injuries. From the 1990s nursing organisations and health services in several countries adopted "no manual lifting" policies built on hoists and slide sheets; Waters\' 2007 analysis put a number on why, and ISO/TR 12296 (2012) and the American Nurses Association\'s interprofessional standards (2013) described the whole-organisation approach.',
  sources: [
    'T. R. Waters, "When is it safe to manually lift a patient?", *American Journal of Nursing*, 2007.',
    'ISO/TR 12296, *Ergonomics — Manual handling of people in the healthcare sector* (2012).',
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'American Nurses Association, *Safe Patient Handling and Mobility: Interprofessional National Standards* (2013).',
    'IEC 60601-2-52, *Medical electrical equipment — Particular requirements for the basic safety and essential performance of medical beds*.'
  ],
  sim: 'wk-patient'
},

{
  id: 'hospital-workstations', parent: 'services-topic', title: 'Hospital workstations', level: 2,
  short: 'Hospital staff work at nursing stations, computers on wheels, bedsides, operating tables, scanners and sinks — often standing, often shared by many people of different sizes on every shift. Shared equipment must adjust over a wide range (a mobile computer used sitting and standing needs about 560–1190 mm of keyboard height), be easy to adjust in seconds, and be placed so that people walk less.',
  keywords: ['hospital workstation', 'nursing station', 'computer on wheels', 'workstation on wheels', 'COW', 'WOW', 'medication cart', 'operating room', 'laparoscopic surgery', 'surgeon posture', 'sonographer', 'lead apron', 'nurses walking', 'shared workstation', 'accessible counter'],
  prereq: ['desk-height', 'standing-work-heights', 'sit-stand-work'],
  related: ['patient-handling', 'monitor-placement', 'standing-all-day', 'laboratory-ergonomics', 'counters-reception', 'material-flow-layout', 'shift-work', 'lighting-levels', 'hmi-screens'],
  body: `
A hospital is full of workstations that nobody owns. A computer on wheels is used by a dozen nurses a day, sitting and standing; an operating table serves surgeons from 1.5 to 2 m tall; a nursing station counter meets staff, patients, visitors and wheelchair users. Designing for them means **wide adjustment**, adjustment that takes **seconds** and needs no tools, and **defaults** that suit the most people.

### Computers and carts on wheels
Charting at the bedside moved screens and keyboards onto mobile workstations (COWs, WOWs) and medication carts. The keyboard should sit at about elbow height (a little below), the top of the screen at or below eye height:

| User and posture (with shoes) | Keyboard | Top of the screen |
|---|---|---|
| 5th-percentile woman, sitting | about 560 mm | about 1070 mm |
| median woman, sitting | about 645 mm | about 1170 mm |
| 5th-percentile woman, standing | about 945 mm | about 1440 mm |
| 95th-percentile man, standing | about 1190 mm | about 1780 mm |

A cart used both sitting and standing therefore needs about **560–1190 mm** of keyboard height — a stroke of over 600 mm, more than most carts have. A standing-only cart needs about 945–1190 mm. In many countries most nurses are women, which moves the whole distribution down; the simulation lets you set the share of men and see what share of the staff a cart's range fits. Other details matter as much: a height control reachable and quick to use, a keyboard tray with room for the mouse, a screen that tilts, wheels that roll easily on hospital floors (see [[pushing-pulling]]), and batteries that do not force the cart back to a wall socket.

### Nursing stations and counters
Staff stand for short tasks and sit for long charting; visitors and patients approach from the other side, some in wheelchairs. A good station has a standing section for quick writing and screens (for staff from the median woman to the median man about 990–1125 mm, elbow height with shoes less 0–50 mm), a seated section at desk height with knee room and adjustable chairs (see [[desk-height]]), and a lowered section for people in wheelchairs: the 2010 ADA Standards set accessible work surfaces at 28–34 in (710–865 mm) and a portion of sales and service counters no higher than 36 in (915 mm). Decentralised stations near the rooms, and supplies stored near the point of care, cut the several kilometres many nurses walk in a shift (see [[material-flow-layout]]).

### Operating theatres and procedure rooms
- **Table height**: surgeons of very different heights share a table. In laparoscopic surgery the long instruments put the handles well above the patient; the table should go low enough for the handles to be near the surgeon's elbow height, and step platforms raise shorter team members (see [[workbench-design]]).
- **Screens**: in front of the surgeon, at or a little below eye height, not off to one side — twisting the neck for hours is a classic cause of surgeons' neck pain (see [[monitor-placement]]).
- **Standing**: long procedures on hard floors — anti-fatigue mats, sit–stand stools, micro-pauses (see [[standing-all-day]]).
- **Lead aprons** weigh several kilograms; two-piece designs put part of the weight on the hips, and ceiling-mounted shields reduce how much must be worn.

### Imaging, pharmacy and support
Sonographers hold the probe with the arm abducted and the wrist bent for hours; adjustable couches and chairs, arm supports and a screen in front keep the arm close to the body. Pharmacy and sterile-services benches follow the standing work heights; sinks and dispensers must be reachable by the smallest staff without leaning over the basin.

### Settings
- **Hospitals**: shared, adjustable, quick to adjust — every shift brings different people.
- **Clinics and home care**: laptops and tablets on the move (see [[laptops-tablets]]).
- **Military and field hospitals**: equipment in tents and containers, fixed heights and low ceilings; adjustable stands and platforms are the only way to fit a changing team.

In the simulation, choose a nurse and a posture, set the cart's range, and watch who in the staff it fits.

> [!key] Shared clinical workstations need a wide, quick adjustment range — about 560–1190 mm of keyboard height for sit–stand use — screens in front at or below eye level, and places that cut walking.
`,
  ideas: [
    'Hospital workstations are shared by people of very different sizes on every shift: adjustment must be wide and quick.',
    'A computer on wheels used sitting and standing needs about 560–1190 mm of keyboard height; standing only, about 945–1190 mm.',
    'Nursing stations need standing, seated and lowered (accessible) sections.',
    'Surgeons need tables that go low, screens in front at or below eye level, and platforms for shorter team members.',
    'Decentralised stations and point-of-care supplies cut walking.'
  ],
  pitfalls: [
    'A cart that adjusts a little suits everyone — Sitting and standing users need a stroke of over 600 mm; a 250 mm stroke suits standing users only.',
    'Equipment will be adjusted by whoever uses it — Adjustment that takes more than a few seconds, or needs a tool, is skipped; make it quick and obvious.',
    'A screen off to the side is fine for a short procedure — Operations last hours; a twisted neck for hours is a common source of surgeons\' neck pain.'
  ],
  formulas: [
    {
      name: 'Keyboard height, sitting',
      expr: 'hk = hp + a + her - c', tex: 'h_k = h_p + a_s + h_{er} - c',
      vars: {
        hk: { name: 'keyboard (home row) height', q: 'length', unit: 'mm', tex: 'h_k' },
        hp: { name: 'popliteal height (sets the seat)', q: 'length', unit: 'mm', value: 405, tex: 'h_p' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        her: { name: 'elbow rest height above the seat', q: 'length', unit: 'mm', value: 235, tex: 'h_{er}' },
        c: { name: 'keyboard below the elbow', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'The seat set to popliteal height plus shoe, the keyboard a little below the elbow.',
      stories: { hk: 'A nurse with a popliteal height of {hp} and an elbow rest height of {her}, in {a} shoes, sits to chart. How high should the keyboard be?' }
    },
    {
      name: 'Keyboard height, standing',
      expr: 'hk = he + a - c', tex: 'h_k = h_e + a_s - c',
      vars: {
        hk: { name: 'keyboard (home row) height', q: 'length', unit: 'mm', tex: 'h_k' },
        he: { name: 'standing elbow height, barefoot', q: 'length', unit: 'mm', value: 1015, tex: 'h_e' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        c: { name: 'keyboard below the elbow', q: 'length', unit: 'mm', value: 20 }
      },
      stories: { hk: 'A nurse with an elbow height of {he}, in {a} shoes, charts standing. How high should the keyboard be?' }
    }
  ],
  examples: [
    {
      title: 'The range of a computer on wheels',
      q: 'A ward\'s mobile computers are used sitting and standing. Using the representative data (seated keyboard for the 5th-percentile woman about 556 mm; 95th-percentile man\'s elbow 1182 mm barefoot, 25 mm of shoe), what keyboard range is needed?',
      steps: [
        'Lowest: the 5th-percentile woman sitting, about 556 mm.',
        'Highest: the 95th-percentile man standing, $1182 + 25 - 20 = 1187$ mm.',
        'A range of about 560–1190 mm, a stroke of 630 mm; a standing-only cart needs about 945–1190 mm.'
      ],
      a: 'About 560–1190 mm for sit–stand use.'
    }
  ],
  quiz: [
    { q: 'A mobile computer cart adjusts from 900 to 1150 mm. Whom does it leave out?', choices: ['Everyone who wants to sit, and the tallest standing users', 'Nobody', 'Only very short standing users', 'Only wheelchair users'], a: 0, why: 'Seated keyboards are around 560–790 mm; the 95th-percentile man standing wants about 1190 mm.' },
    { q: 'Where should the screen be for a surgeon during a long laparoscopic procedure?', choices: ['In front, at or a little below eye height', 'Off to one side, at eye height', 'Above the head', 'Anywhere the cables reach'], a: 0, why: 'A screen in front and slightly low keeps the neck straight and upright for hours.' },
    { q: 'Adjustable equipment in hospitals is only worth it if adjusting it is quick and needs no tools.', a: true, why: 'Shared equipment is used by many people for short periods; slow adjustment is skipped.' },
    { q: 'Under the 2010 ADA Standards, how high may an accessible work surface be at most?', choices: ['34 in (865 mm)', '42 in (1070 mm)', '30 in (760 mm) exactly', 'There is no limit'], a: 0, why: 'Accessible work surfaces are 28–34 in (710–865 mm) high.' }
  ],
  problems: [
    { q: 'A nurse has a popliteal height of 380 mm and an elbow rest height of 210 mm. In 25 mm shoes, what seated keyboard height suits her (20 mm below the elbow)?', answer: 595, unit: 'mm', tol: 0.01, steps: ['$h_k = 380 + 25 + 210 - 20 = 595$ mm.'] }
  ],
  ranges: [
    { dim: 'Keyboard height of a mobile computer used sitting and standing', range: [560, 1190], unit: 'mm', who: '5th-percentile woman sitting to 95th-percentile man standing', why: 'Every user can type with relaxed shoulders and forearms about level.', limits: 'Few carts adjust over 600 mm; the seated posture also needs knee room and a chair of the right height.', setting: 'health', src: 'Derived from representative body data; ISO 9241-5 (workstation layout)' },
    { dim: 'Keyboard height of a standing-only cart', range: [945, 1190], unit: 'mm', who: '5th-percentile woman to 95th-percentile man, standing, with shoes', why: 'Charting at the bedside without stooping or lifting the shoulders.', limits: 'Staff who want to sit for long charting need a seated station too.', setting: 'health', src: 'Derived from representative elbow heights' },
    { dim: 'Top of the screen on a cart used standing', range: [1440, 1780], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: standing eye height with shoes', why: 'The screen top at or a little below eye level keeps the neck upright.', limits: 'Wearers of bifocals and progressive lenses need it lower; glare from windows and ceiling lights needs a tilt.', setting: 'health', src: 'Representative eye heights; ISO 9241-5' },
    { dim: 'Standing section of a nursing station for short writing and screen work', range: [990, 1125], unit: 'mm', who: 'median woman to median man: elbow height with shoes, less 0–50 mm', why: 'Quick tasks without sitting down, forearms about level.', limits: 'A fixed compromise; add a seated section for long charting and a lowered one for wheelchair users.', setting: ['health', 'office'], src: 'Representative elbow heights' },
    { dim: 'Accessible work surface height', range: [710, 865], unit: 'mm', who: 'wheelchair users (28–34 in)', why: 'Knees fit under and the surface is within seated reach.', limits: 'US federal rule; other countries set their own values. Sales and service counters need a portion no higher than 915 mm (36 in).', setting: ['health', 'civil'], src: '2010 ADA Standards for Accessible Design' }
  ],
  applications: [
    'Specifying computers and medication carts on wheels for wards.',
    'Designing nursing stations with standing, seated and accessible sections.',
    'Operating theatre layout: table heights, screen booms, platforms and stools.',
    'Field hospitals and medical containers with adjustable stands.'
  ],
  sources: [
    'ISO 9241-5, *Ergonomics of human-system interaction — Workstation layout and postural requirements*.',
    '2010 ADA Standards for Accessible Design (US Department of Justice), work surfaces and sales and service counters.',
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, chapters on health-care ergonomics.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on workstation design.'
  ],
  sim: 'wk-cart'
},

{
  id: 'school-furniture', parent: 'services-topic', title: 'School furniture for growing children', level: 1,
  short: 'Children grow about 5–6 cm a year and a class of one age spans 25–30 cm in stature, so one chair and table size cannot fit a class. EN 1729-1 sets eight colour-coded size marks (0–7) by stature, from a seat of 210 mm and a table of 400 mm to 510 and 820 mm; schools need two or more sizes per room, chosen by measuring the children, and checked every year.',
  keywords: ['school furniture', 'EN 1729', 'size mark', 'classroom chair', 'school desk', 'children', 'growth', 'stature', 'seat height', 'table height', 'colour code', 'mismatch', 'forward-sloping seat', 'Mandal', 'backpack'],
  prereq: ['age-children-elderly', 'sitting-dimensions', 'design-for-range'],
  related: ['children-furniture', 'office-chair', 'desk-height', 'meeting-classroom', 'laptops-tablets', 'percentiles', 'carrying-loads', 'medicine:child-growth'],
  body: `
Children spend much of their school day sitting, on furniture that is often the same size for a whole school or a whole year group. But children grow — about **5–6 cm a year** through primary school and faster in the growth spurt (see [[medicine:child-growth]]) — and children of one age differ widely: at ten years, two [[?standard-deviation|standard deviations]] either side of the [[?mean|mean]] span about 26 cm of stature. A chair that fits the median child is too high for the smallest (feet dangling, the seat edge pressing under the thighs) and too low for the tallest (knees up, hunched over a low table). Surveys in many countries have found that a large share of pupils sit at furniture of the wrong size.

### Size marks
The European standard **EN 1729-1** defines chairs and tables in eight sizes, each for a band of statures and marked with a colour so that a child can find their size. Its key values:

| Size mark | Colour | Stature band (mm) | Seat height (mm) | Table height (mm) |
|---|---|---|---|---|
| 0 | white | 800–950 | 210 | 400 |
| 1 | orange | 930–1160 | 260 | 460 |
| 2 | violet | 1080–1210 | 310 | 530 |
| 3 | yellow | 1190–1420 | 350 | 590 |
| 4 | red | 1330–1590 | 380 | 640 |
| 5 | green | 1460–1765 | 430 | 710 |
| 6 | blue | 1590–1880 | 460 | 760 |
| 7 | brown | 1740–2070 | 510 | 820 |

The standard also covers seat depth and width, backrest, table depth and the clearances; check the current edition for a real purchase. For sizes 2–7 the seat heights are close to a quarter of the middle of the stature band plus about 25 mm of shoe, and the table heights to about 0.44 of stature — handy rules of thumb, not substitutes for the table. The bands overlap, so a child near a boundary fits two sizes; choose the larger for a child still growing.

### How many sizes per classroom?
In the representative child data used in the simulation, the best single size fits about four in five ten-year-olds — the rest sit at the wrong size — while two adjacent sizes fit nearly all of them. So the practice is:
1. **Measure** the children's stature (a coloured scale on the classroom wall showing the size bands makes this quick).
2. Provide **two or three sizes** per room, in the proportions measured.
3. **Re-check** every year, or each term for children in the growth spurt; furniture should follow the children, not the room.
4. Where one room serves several ages (secondary schools, shared rooms), use height-adjustable tables and chairs or a wider mix of sizes.

The share of a class within a band is a normal-distribution calculation, $F = \\Phi\\big((b-\\mu)/\\sigma\\big) - \\Phi\\big((a-\\mu)/\\sigma\\big)$ (see [[percentiles]]).

### Beyond the chair
- **Seat depth**: shorter than the child's buttock–popliteal length, or the child slides forward to bend the knees.
- **Forward-sloping seats and higher tables** — advocated by the Danish surgeon A. C. Mandal from the 1970s and 1980s — let children sit with the hips more open while reading and writing; sloping table tops bring the page towards the eyes.
- **Screens and tablets**: laptops and tablets on flat desks bend the neck; stands and external keyboards help older pupils (see [[laptops-tablets]]).
- **Movement**: short lessons of standing, moving and changing places are good for children's backs and attention.
- **School bags**: commonly advised to weigh no more than about 10–15 % of the child's body weight, carried on both shoulders (see [[carrying-loads]]).
- **Teachers** in early-years classrooms sit and kneel at child-height furniture all day: an adult-height chair on castors or a low stool helps them.

In the simulation, choose an age and a furniture policy and see how many of a random class fit — and how many still fit after months of growth.

### Settings
- **Schools**: size marks and measurement; adjustable furniture in rooms shared by ages.
- **Home**: a desk and chair for homework grow with an adjustable chair and a footrest (see [[children-furniture]]).
- **Colleges and universities**: adult sizes (marks 6 and 7) and the full adult range, including wheelchair users (see [[meeting-classroom]]).

> [!key] One size cannot fit a class: measure the children, provide two or three EN 1729-1 size marks per room, and re-check as they grow.
`,
  ideas: [
    'Children grow about 5–6 cm a year and a class of one age spans 25–30 cm of stature.',
    'EN 1729-1 sets eight colour-coded size marks (0–7), each for a stature band, from 210/400 mm to 510/820 mm seat and table heights.',
    'The best single size fits about four in five children of one age; two adjacent sizes fit nearly all.',
    'Measure the children, supply two or three sizes per room, and re-check every year.',
    'Seat height is about a quarter of stature plus shoe; table height about 0.44 of stature (sizes 2–7).'
  ],
  pitfalls: [
    'One size per year group is enough — Children of one age differ by 25–30 cm in stature; a single size leaves a fifth or more of them at the wrong size.',
    'Children adapt, so furniture size does not matter — They adapt by slumping, perching on the front edge and dangling their feet; the discomfort and poor posture are the adaptation.',
    'Furniture sized in September stays right all year — A child in the growth spurt can move a good part of a size band in a year.'
  ],
  formulas: [
    {
      name: 'Seat height for a child (rule of thumb)',
      expr: 'hs = k*S + a', tex: 'h_s = k\\,S + a_s',
      vars: {
        hs: { name: 'seat height', q: 'length', unit: 'mm', tex: 'h_s' },
        k: { name: 'popliteal height as a share of stature', q: 'none', value: 0.25, fixed: true },
        S: { name: 'child\'s stature', q: 'length', unit: 'mm', value: 1380 },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' }
      },
      note: 'Reproduces the EN 1729-1 seat heights of sizes 2–7 within about 10 mm at the middle of each band; young children have relatively shorter legs.',
      stories: { hs: 'A child is {S} tall. What seat height suits her, in {a} shoes?', S: 'A chair has a seat of {hs}. What stature is it best for?' }
    },
    {
      name: 'Table height for a child (rule of thumb)',
      expr: 'ht = c*S', tex: 'h_t = c\\,S',
      vars: {
        ht: { name: 'table height', q: 'length', unit: 'mm', tex: 'h_t' },
        c: { name: 'table height as a share of stature', q: 'none', value: 0.44 },
        S: { name: 'child\'s stature', q: 'length', unit: 'mm', value: 1460 }
      },
      note: 'Within about 25 mm of the EN 1729-1 table heights for sizes 2–7; slightly above the resting elbow, as reading and writing prefer.',
      stories: { ht: 'A pupil is {S} tall. About how high should the table be?' }
    },
    {
      name: 'Share of a class within a size band',
      expr: 'F = (erf((b - mu)/(s*sqrt(2))) - erf((a - mu)/(s*sqrt(2))))/2', tex: 'F = \\Phi\\!\\left(\\dfrac{b - \\mu}{\\sigma}\\right) - \\Phi\\!\\left(\\dfrac{a - \\mu}{\\sigma}\\right)',
      vars: {
        F: { name: 'share of the class in the band', q: 'ratio', unit: '%' },
        a: { name: 'lower end of the stature band', q: 'length', unit: 'mm', value: 1330 },
        b: { name: 'upper end of the stature band', q: 'length', unit: 'mm', value: 1590 },
        mu: { name: 'mean stature of the class', q: 'length', unit: 'mm', value: 1382, tex: '\\mu' },
        s: { name: 'standard deviation', q: 'length', unit: 'mm', value: 65, tex: '\\sigma' }
      },
      note: 'Φ is the normal cumulative distribution. For boys and girls with different means, average the two shares.',
      stories: { F: 'A class has a mean stature of {mu} and a standard deviation of {s}. What share is between {a} and {b}?' }
    }
  ],
  examples: [
    {
      title: 'One size for a class of ten-year-olds',
      q: 'Ten-year-olds have a mean stature of about 1382 mm and a standard deviation of about 65 mm (representative values). What share fits size mark 4 (1330–1590 mm), and what share size 3 (1190–1420 mm)?',
      steps: [
        'Size 4: $z_b = (1590 - 1382)/65 = 3.2$, $z_a = (1330 - 1382)/65 = -0.8$; $F = 0.9993 - 0.2119 = 79$ %.',
        'Size 3: $z_b = 0.58$, $z_a = -2.95$; $F = 0.720 - 0.002 = 72$ %.',
        'Either single size leaves a fifth or more of the class at the wrong size; sizes 3 and 4 together (1190–1590 mm) fit about 99 %.'
      ],
      a: 'About 79 % (size 4) or 72 % (size 3); two sizes fit nearly all.'
    },
    {
      title: 'A chair for one child',
      q: 'A pupil is 1460 mm tall. Use the rules of thumb for the seat and the table, and choose the size mark.',
      steps: [
        'Seat: $0.25 \\times 1460 + 25 = 390$ mm; table: $0.44 \\times 1460 = 642$ mm.',
        '1460 mm is in the bands of sizes 4 (1330–1590) and 5 (1460–1765); size 4 has a 380 mm seat and a 640 mm table.',
        'Size 4 now; size 5 as soon as the child grows into its band.'
      ],
      a: 'Size mark 4 (red): seat 380 mm, table 640 mm.'
    }
  ],
  quiz: [
    { q: 'Why does EN 1729-1 give furniture sizes by stature rather than by age?', choices: ['Children of one age differ widely in size, and stature predicts the body dimensions that matter', 'Age is private', 'Stature changes less than age', 'Because adults are measured by stature'], a: 0, why: 'A class of one age spans 25–30 cm; stature is quick to measure and relates to leg and trunk lengths.' },
    { q: 'A child\'s feet dangle from the chair. What is wrong and what is the effect?', choices: ['The seat is too high; the front edge presses under the thighs', 'The seat is too low; the knees rise', 'The table is too high', 'Nothing — children like it'], a: 0, why: 'A seat above popliteal height lifts the feet and presses the soft underside of the thighs; children then perch on the edge.' },
    { q: 'What colour marks EN 1729-1 size 4?', choices: ['Red', 'Blue', 'Green', 'Yellow'], a: 0, why: 'Size 4 is red (stature 1330–1590 mm, seat 380 mm, table 640 mm).' },
    { q: 'Two adjacent size marks per classroom fit nearly all children of one age.', a: true, why: 'A single size fits roughly 70–95 % depending on the age; two adjacent sizes cover almost the whole class.' }
  ],
  problems: [
    { q: 'A secondary pupil is 1700 mm tall. Using the rule of thumb (a quarter of stature plus 25 mm of shoe), what seat height suits him?', answer: 450, unit: 'mm', tol: 0.01, steps: ['$h_s = 0.25 \\times 1700 + 25 = 450$ mm — between sizes 5 (430 mm) and 6 (460 mm); 1700 mm is in both bands.'] }
  ],
  ranges: [
    { dim: 'Chair seat height across the size marks 0–7', range: [210, 510], unit: 'mm', who: 'children and young people from about 800 to 2070 mm tall', why: 'Feet flat on the floor and thighs supported for each stature band.', limits: 'Each size fits only its band; a room needs the sizes of its children, re-checked as they grow.', setting: 'school', src: 'EN 1729-1' },
    { dim: 'Table height across the size marks 0–7', range: [400, 820], unit: 'mm', who: 'the same stature bands as the chairs', why: 'Forearms on the table at a slightly raised height for reading and writing.', limits: 'Chair and table of the same size mark belong together; mixing sizes breaks the fit.', setting: 'school', src: 'EN 1729-1' },
    { dim: 'Seat height for a child (rule of thumb)', range: 'about a quarter of stature + 25 mm', unit: '', who: 'children over about 1080 mm tall (sizes 2–7)', why: 'Matches popliteal height plus shoe, so the feet reach the floor.', limits: 'Young children have relatively shorter legs; use the size-mark table for purchasing.', setting: ['school', 'civil'], src: 'Derived from EN 1729-1 values' },
    { dim: 'Furniture sizes per classroom', range: 'at least two adjacent size marks', unit: '', who: 'a class of one age (25–30 cm of stature spread)', why: 'Two sizes fit nearly all; one size leaves a fifth or more at the wrong size.', limits: 'Mixed-age rooms need more sizes or adjustable furniture; re-check yearly.', setting: 'school', src: 'EN 1729-1 practice; representative child statures' },
    { dim: 'Weight of a school bag', range: [10, 15], unit: '% of body weight', who: 'schoolchildren, bag on both shoulders', why: 'Limits the load on a growing back and the forward lean of carrying.', limits: 'A commonly advised guide, not a sharp threshold; lockers and digital books reduce the load.', setting: 'school', src: 'Commonly advised by paediatric and therapy associations' }
  ],
  applications: [
    'Buying classroom furniture in the proportions of the children\'s measured statures.',
    'Colour-coded stature scales on classroom walls so that children find their size.',
    'Height-adjustable tables and chairs in secondary schools and shared rooms.',
    'Home desks and chairs that grow with the child.'
  ],
  history: 'Classroom desks of fixed sizes were standard for a century. In the 1970s and 1980s the Danish surgeon A. C. Mandal argued for higher desks and forward-sloping seats; surveys of pupils against their furniture in many countries showed widespread mismatch; and the European standard EN 1729 replaced older national standards with eight colour-coded sizes chosen by stature.',
  sources: [
    'EN 1729-1, *Furniture — Chairs and tables for educational institutions — Part 1: Functional dimensions*.',
    'EN 1729-2, *Furniture — Chairs and tables for educational institutions — Part 2: Safety requirements and test methods*.',
    'A. C. Mandal, "The seated man (Homo sedens): the seated work position — theory and practice", *Applied Ergonomics*, 1981.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on children\'s anthropometry and furniture.',
    'WHO growth reference for school-aged children and adolescents (2007), for statures by age.'
  ],
  sim: 'wk-school'
},

{
  id: 'retail-checkouts', parent: 'services-topic', title: 'Retail checkouts', level: 1,
  short: 'A supermarket checkout is an assembly line in reverse: thousands of items a shift, each picked from a belt, passed over a scanner and pushed or lifted to the bagging area — several tonnes a day. Good checkouts bring items within the comfortable reach of the smallest cashier, keep pick and place close together, let cashiers sit or stand, leave heavy items in the trolley for a hand scanner, and suit customers of every size, including wheelchair users.',
  keywords: ['checkout', 'cashier', 'supermarket', 'scanning', 'bi-optic scanner', 'hand scanner', 'belt', 'bagging area', 'seated checkout', 'sit-stand checkout', 'self-checkout', 'repetitive work', 'reach', 'twisting', 'retail'],
  prereq: ['assembly-lines', 'reach-zones', 'repetitive-strain'],
  related: ['standing-all-day', 'counters-reception', 'accessible-design', 'job-rotation', 'hand-tools', 'lifting-principles', 'standing-work-heights', 'hmi-screens'],
  body: `
Every item a customer buys passes through a cashier's hands: picked from the end of the belt, turned to find the barcode, passed over the scanner and pushed or lifted to the bagging area. At 20 items a minute over 5 hours of scanning that is 6000 items — and, at an average of 0.6 kg, **3.6 tonnes** moved in a shift:

$$M = r\\,t\\,\\bar m$$

The loads are small but endlessly repeated, often with the arm reaching, the trunk twisting between belt and bag, and the occasional heavy pack of drinks lifted across the scanner. Shoulder, neck, wrist and back complaints are common among cashiers.

### Layout: reach and twist
The checkout is best judged from above, with the reach zones of its smallest users (see [[reach-zones]] and the simulation):
- **Belt end** close to the cashier and within comfortable reach (about 400 mm from the shoulder for the 5th-percentile woman), with the belt stopping items there.
- **Scanner** directly in front; **bi-optic scanners** (horizontal and vertical windows) read most items without turning them.
- **Bagging area** on the same side of the body as the flow continues, close to the scanner, so items slide rather than being lifted; a long twist between pick and place (more than about a quarter turn) is repeated thousands of times.
- **Keypad, screen and payment terminal** where the eyes and hands already are.
- **Mirror-image checkouts** (flow left-to-right and right-to-left) let cashiers change hands and sides between shifts.

### Sitting or standing?
Seated checkouts, usual in much of Europe, take the weight off the legs but only work if designed for it: knee room under the scanning area, a height-adjustable seat, a footrest and a scanning surface near seated elbow height. Standing checkouts, usual in North America, allow more reach and movement but bring the problems of standing all day (see [[standing-all-day]]). A **sit–stand** checkout with a perching stool offers both. Some jurisdictions require a seat where the work allows it (for example the UK's Workplace Regulations 1992).

### Heavy items
Packs of drinks, pet food and bags of potatoes should stay in the trolley and be scanned with a **hand scanner**; customers lift them. Scales built into the scanner remove the need to lift loose produce twice.

### Customers
Customer counters and self-checkouts serve the whole public: children, older people, people of every height and wheelchair users. The 2010 ADA Standards set the unobstructed forward reach range at 15–48 in (380–1220 mm) above the floor and a portion of sales and service counters at no more than 36 in (915 mm). Payment terminals on flexible arms or at a lowered counter reach both standing and seated customers (see [[accessible-design]] and [[counters-reception]]).

### Organisation
Rotation between the checkout and other tasks (shelf-filling, customer service), breaks, and help at busy times reduce the continuous repetition (see [[job-rotation]]). EN 1005-5 and ISO 11228-3 methods (such as OCRA) apply to checkout work as to any repetitive task.

> [!key] Lay the checkout out for the smallest cashier's comfortable reach, keep the belt end, scanner and bagging close with little twist, allow sitting and standing, and leave heavy items in the trolley.
`,
  ideas: [
    'A cashier handles thousands of items and several tonnes a shift: M = r·t·m.',
    'Belt end, scanner and bagging within the smallest cashier\'s comfortable reach, with little twist between them.',
    'Bi-optic scanners and built-in scales remove turning and double lifting.',
    'Seated checkouts need knee room, an adjustable seat and a footrest; sit–stand checkouts offer both postures.',
    'Heavy items stay in the trolley for a hand scanner; customer counters must serve wheelchair users.'
  ],
  pitfalls: [
    'Each item is light, so the job is light — Six thousand small lifts, reaches and twists a shift add up to tonnes and to shoulder and wrist strain.',
    'A seat can be added to any checkout — Without knee room, a footrest and the right scanning height the seated posture is worse than standing.',
    'Self-checkouts remove the ergonomics problem — They move it to customers of every size and ability, who need reachable screens, scanners and payment terminals.'
  ],
  formulas: [
    {
      name: 'Mass handled in a shift',
      expr: 'M = r*t*m', tex: 'M = r\\,t\\,\\bar m',
      vars: {
        M: { name: 'mass handled', q: 'mass', unit: 'kg' },
        r: { name: 'items scanned per minute', q: 'rate', unit: '1/min', value: 20 },
        t: { name: 'scanning time in the shift', q: 'time', unit: 'h', value: 5 },
        m: { name: 'mean mass of an item', q: 'mass', unit: 'kg', value: 0.6, tex: '\\bar m' }
      },
      note: 'Items left in the trolley for a hand scanner do not count.',
      stories: { M: 'A cashier scans {r} for {t} and items average {m}. What mass does she move?' }
    },
    {
      name: 'Items per shift',
      expr: 'N = r*t', tex: 'N = r\\,t',
      vars: {
        N: { name: 'items (picks) per shift', q: 'count' },
        r: { name: 'items scanned per minute', q: 'rate', unit: '1/min', value: 20 },
        t: { name: 'scanning time in the shift', q: 'time', unit: 'h', value: 5 }
      },
      stories: { N: 'At {r} for {t}, how many items does a cashier pick?' }
    }
  ],
  examples: [
    {
      title: 'Tonnes at the till',
      q: 'A cashier scans 20 items a minute for 5 hours of a shift; items average 0.6 kg. How many items and what mass?',
      steps: [
        '$N = 20 \\times 300 = 6000$ items.',
        '$M = 6000 \\times 0.6 = 3600$ kg.',
        'If 3 % of items are heavy packs left in the trolley, the cashier avoids lifting the heaviest of them — often a large share of the mass.'
      ],
      a: '6000 items and about 3.6 tonnes.'
    }
  ],
  quiz: [
    { q: 'Where should the bagging area be relative to the scanner?', choices: ['Close by, continuing the flow, so items slide with little twist', 'Behind the cashier', 'As far as possible, to save space at the scanner', 'On the customer\'s side, out of reach'], a: 0, why: 'A short, continuing path avoids repeated twisting and lifting.' },
    { q: 'What makes a seated checkout work?', choices: ['Knee room under the scanning area, an adjustable seat and a footrest', 'A stool placed at a standing checkout', 'Scanning items above shoulder height', 'Nothing special'], a: 0, why: 'Without knee room the cashier sits sideways and twists; without adjustment and a footrest the seat fits few.' },
    { q: 'At 15 items a minute for 6 hours of scanning, how many items is that?', answer: 5400, why: '$15 \\times 360 = 5400$.' },
    { q: 'Heavy packs of drinks should be lifted over the scanner by the cashier.', a: false, why: 'Heavy items stay in the trolley and are scanned with a hand scanner.' }
  ],
  problems: [
    { q: 'Items average 0.45 kg and a cashier scans 18 a minute for 6 h. What mass does she move in kilograms?', answer: 2916, unit: 'kg', tol: 0.01, steps: ['$N = 18 \\times 360 = 6480$ items.', '$M = 6480 \\times 0.45 = 2916$ kg.'] }
  ],
  ranges: [
    { dim: 'Belt end, scanner and bagging area from the cashier\'s shoulder', range: [null, 400], unit: 'mm', who: '5th-percentile woman\'s comfortable reach', why: 'Every item is picked and placed with the upper arm near the body.', limits: 'Customers\' bulky items still need longer reaches; a moving belt that stops items at the end helps.', setting: 'civil', src: 'Representative forward grip reach (ISO 7250-1)' },
    { dim: 'Scanning surface of a standing checkout', range: [810, 1110], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: light-work height (elbow with shoes less 100–150 mm)', why: 'Items slide over the scanner with relaxed shoulders.', limits: 'Fixed checkouts suit the middle; platforms or adjustable units suit the rest.', setting: 'civil', src: 'Kroemer and Grandjean offsets; representative elbow heights' },
    { dim: 'Unobstructed forward reach for customers (self-checkout controls, terminals)', range: [380, 1220], unit: 'mm', who: 'wheelchair users and all customers (15–48 in above the floor)', why: 'Screens, scanners and payment terminals within everyone\'s reach.', limits: 'US federal rule; other countries set their own; the screen must also be readable from a seated eye height.', setting: 'civil', src: '2010 ADA Standards for Accessible Design (reach ranges)' },
    { dim: 'Counter portion for customers in wheelchairs', range: [null, 915], unit: 'mm', who: 'wheelchair users (36 in)', why: 'Payment and packing within seated reach.', limits: 'US federal rule; other codes differ.', setting: 'civil', src: '2010 ADA Standards (sales and service counters)' },
    { dim: 'Heavy and bulky items', range: 'scanned in the trolley with a hand scanner', unit: '', who: 'every cashier', why: 'Removes the heaviest lifts, made across the body.', limits: 'Needs a hand scanner within reach and customers who leave the items in the trolley.', setting: 'civil', src: 'Common retail practice' }
  ],
  applications: [
    'Designing checkouts with bi-optic scanners, powered belts and short bagging paths.',
    'Seated and sit–stand checkouts with knee room and footrests.',
    'Accessible self-checkouts and payment terminals.',
    'See the checkout in the top-view reach simulation.'
  ],
  sources: [
    'EN 1005-5, *Safety of machinery — Human physical performance — Part 5: Risk assessment for repetitive handling at high frequency*.',
    'ISO 11228-3, *Ergonomics — Manual handling — Part 3: Handling of low loads at high frequency*.',
    '2010 ADA Standards for Accessible Design (reach ranges and sales and service counters).',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on reach and seated and standing work.',
    'Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, on repetitive work and workstation design.'
  ],
  sim: { id: 'wk-reach-station', params: { mode: 'checkout' } }
},

{
  id: 'commercial-kitchens', parent: 'services-topic', title: 'Commercial kitchens', level: 2,
  short: 'Cooks work fast, hot, wet and on their feet, lifting full pots and trays, chopping for hours and reaching into deep sinks and low ovens. Good kitchens set counters for the task and the cook, put stock pots on low ranges, keep trays between knuckle and shoulder height, use tilting kettles and trolleys instead of lifting, and control heat, slips and knives.',
  keywords: ['commercial kitchen', 'catering', 'cook', 'chef', 'stock pot', 'stock-pot range', 'tilting kettle', 'prep counter', 'sink depth', 'oven racks', 'trays', 'kitchen heat', 'slips', 'knives', 'dishwashing'],
  prereq: ['standing-work-heights', 'niosh-lifting-equation', 'heat-stress'],
  related: ['kitchen-ergonomics', 'standing-all-day', 'material-flow-layout', 'hand-tools', 'storage-heights', 'noise-exposure', 'cold-stress', 'medicine:burns'],
  body: `
A professional kitchen combines almost every ergonomic hazard in a small space: long hours of standing on hard, wet floors; heavy and hot loads; repetitive knife work; heat and steam; noise from extraction and dishwashing; cold rooms; and time pressure. The equipment decides most of it.

### Work heights
The rules of [[standing-work-heights]] apply, with the cook's elbow as the reference:
- **Preparation** (chopping, portioning) is light work, 100–150 mm below the elbow — about 890–940 mm for the median woman and 975–1025 mm for the median man, measured on top of the chopping board. A fixed 900 mm counter suits the median woman; taller cooks need raised boards or adjustable counters.
- **Mixing** in a deep bowl puts the hands at the rim: a lower surface, or a mixer.
- **Stirring a stock pot**: the hands hold the paddle about 150 mm above the rim, so the rim must be well below the elbow. With a 40 L pot (about 370 mm tall), that puts the top of the range at about 440 mm for the 5th-percentile woman and 600 mm for the median man — which is why **stock-pot ranges are low**. A pot on a standard 900 mm range lifts the hands above the shoulders.
- **Sinks**: the bottom of a deep bowl is below knuckle height and everyone stoops; bowls of about 200 mm or less at a 900 mm rim, raised racks and spray arms help.

### Lifting pots, trays and sacks
A pot's mass is $m = m_p + \\rho V f$: a 40 L pot, 90 % full, weighs about 41 kg — never a one-person lift. Even a 20 L pot, 90 % full, is about 21 kg. Lifted from a 900 mm range to a trolley at 600 mm, with the pot's width keeping the load about 40 cm from the ankles, the revised NIOSH equation gives a recommended weight limit of only about 11.5 kg (see [[niosh-lifting-equation]]): a lifting index of 1.8. The solutions remove the lift:
- **Tilting kettles and bratt pans** pour instead of lifting; **draw-off taps** empty stock pots.
- **Trolleys** at the height of the range, and **rack trolleys** that roll into ovens.
- **Trays and ovens** loaded between knuckle and shoulder height (about 855–1260 mm for everyone; see [[storage-heights]]); combi ovens on stands, not on the floor.
- **Ingredients** in smaller containers and sacks on shelves at waist height.

### Heat, slips, knives and noise
- **Heat**: ranges, ovens and dishwashers raise air and radiant temperature; extraction hoods, make-up air, breaks and drinking water (see [[heat-stress]]). Hot surfaces and liquids burn (see [[medicine:burns]]).
- **Slips**: wet and greasy floors are among the commonest causes of kitchen injuries — slip-resistant flooring, drains, spill cleaning and slip-resistant shoes.
- **Knives**: sharp knives need less force; handles that fit the hand (see [[hand-tools]]); cut-resistant gloves for some tasks.
- **Noise and cold**: dish areas are loud (see [[noise-exposure]]); walk-in cold rooms and freezers need short stays and clothing (see [[cold-stress]]).
- **Standing**: drainable anti-fatigue mats that can be cleaned, footwear, breaks (see [[standing-all-day]]).

In the simulation, put a stock pot on a range, change the range height, the pot size and the cook, and switch between stirring and lifting: the lifting index comes from the revised NIOSH equation.

### Settings
- **Restaurants, hospitals, schools and factories**: the same hazards at different scales; institutional kitchens lift the largest pots.
- **Military and field kitchens**: containerised or tented kitchens, often at fixed heights and in heat or cold; burners on low stands for large pots, lids and pouring aids, and teams for any lift.
- **Home kitchens**: the same principles at lower loads (see [[kitchen-ergonomics]]).

> [!warn] Hot liquids and oil cause severe burns: never carry a full pot of hot liquid; drain or pour it with a tap or a tilting vessel. Cool burns with running water and seek medical care for serious burns.

> [!key] Stirring height sets the range (low for stock pots), the cook's elbow sets the counter, and tilting kettles, taps and trolleys replace lifting full pots.
`,
  ideas: [
    'Preparation counters are light-work heights: about 890–1025 mm from the median woman to the median man, on top of the board.',
    'Stirring a tall pot needs a low range: about 440–600 mm for a 40 L pot.',
    'A full 40 L pot weighs about 41 kg; even a 20 L pot lifted from a range gives a NIOSH lifting index near 2.',
    'Tilting kettles, taps, trolleys and rack ovens replace lifting.',
    'Heat, slips, knives, noise and standing are the other kitchen hazards.'
  ],
  pitfalls: [
    'All cooking can happen at one counter height — Stirring a tall pot, chopping and loading ovens need different heights; stock pots belong on low ranges.',
    'A strong cook can lift a full stock pot safely — A 40 L pot of liquid is over 40 kg, hot and awkward; no one should lift it by hand.',
    'Deep sinks save space and water — Their bottoms are below knuckle height, so everyone stoops for every item washed.'
  ],
  formulas: [
    {
      name: 'Mass of a filled pot',
      expr: 'm = mp + rhoW*V*f', tex: 'm = m_p + \\rho_w\\,V f',
      vars: {
        m: { name: 'mass of the pot and contents', q: 'mass', unit: 'kg' },
        mp: { name: 'mass of the empty pot', q: 'mass', unit: 'kg', value: 3, tex: 'm_p' },
        rhoW: { const: 'rhoW' },
        V: { name: 'pot volume', q: 'volume', unit: 'L', value: 20 },
        f: { name: 'fill level', q: 'ratio', unit: '%', value: 90 }
      },
      note: 'Water-like contents; thick stews and oils differ a little.',
      stories: { m: 'A {V} pot weighing {mp} empty is {f} full of stock. What does it weigh?' }
    },
    {
      name: 'Recommended weight limit for an occasional pot lift (NIOSH, simplified)',
      expr: 'RWL = LC*(25/H)*(1 - 0.003*abs(Vh - 75))*(0.82 + 4.5/D)', tex: '\\mathrm{RWL} = L_C\\,\\dfrac{25}{H}\\,(1 - 0.003\\,|V_h - 75|)\\left(0.82 + \\dfrac{4.5}{D}\\right)',
      vars: {
        RWL: { name: 'recommended weight limit', q: 'mass', unit: 'kg', tex: '\\mathrm{RWL}' },
        LC: { name: 'load constant', q: 'mass', unit: 'kg', value: 23, fixed: true, tex: 'L_C' },
        H: { name: 'horizontal distance of the hands from the ankles', q: false, unit: 'cm', value: 39.7, min: 25, max: 63 },
        Vh: { name: 'height of the hands at the start', q: false, unit: 'cm', value: 114.4, min: 75, max: 175, tex: 'V_h' },
        D: { name: 'vertical travel of the lift', q: false, unit: 'cm', value: 54.4, min: 25, max: 175 }
      },
      note: 'The revised NIOSH equation with the frequency, asymmetry and coupling multipliers at 1: an occasional lift (at most one every five minutes, under an hour), no twisting, good handles. The lifting index is the load divided by RWL.',
      stories: { RWL: 'A pot is lifted with the hands {H} from the ankles, starting at {Vh} and moving {D}. What is the recommended weight limit?' }
    }
  ],
  examples: [
    {
      title: 'Lifting a 20 L pot off the range',
      q: 'A 20 L pot (3 kg empty, 90 % full) is lifted from a 900 mm range to a trolley at 600 mm. The pot is 294 mm across and tall; the hands are at the side handles 50 mm below the rim and about 40 cm from the ankles. Find the lifting index.',
      steps: [
        'Mass: $3 + 1000 \\times 0.020 \\times 0.9 = 21$ kg.',
        'H = 39.7 cm, V = 90 + 29.4 − 5 = 114.4 cm, D = 114.4 − 60 = 54.4 cm.',
        { text: 'Multipliers: HM = 25/39.7 = 0.630, VM = 1 − 0.003 × 39.4 = 0.882, DM = 0.82 + 4.5/54.4 = 0.903.', tex: '\\mathrm{RWL} = 23 \\times 0.630 \\times 0.882 \\times 0.903 = 11.5\\ \\mathrm{kg}' },
        'LI = 21/11.5 = 1.8: increased risk. Use a draw-off tap, ladle it out, or slide the pot onto a trolley at range height.'
      ],
      a: 'RWL ≈ 11.5 kg and LI ≈ 1.8.'
    },
    {
      title: 'How low must a stock-pot range be?',
      q: 'The 5th-percentile woman\'s elbow is at 964 mm with shoes; a 40 L pot is 371 mm tall; her hands hold the paddle 150 mm above the rim and should be no higher than her elbow. How high can the range be?',
      steps: [
        'Rim at most $964 - 150 = 814$ mm.',
        'Range top at most $814 - 371 = 443$ mm.',
        'For the median man (elbow 1125 mm): $1125 - 150 - 371 = 604$ mm. Stock-pot ranges of about 450–600 mm suit most cooks.'
      ],
      a: 'About 440 mm for her; 450–600 mm suits most.'
    }
  ],
  quiz: [
    { q: 'Why are stock-pot ranges much lower than ordinary ranges?', choices: ['So that the rim of a tall pot, and the hands stirring it, stay below the elbow', 'To save gas', 'So that pots are easier to lift from the floor', 'Because tall pots are lighter'], a: 0, why: 'A tall pot on a standard range lifts the stirring hands to shoulder height.' },
    { q: 'A 40 L pot, 90 % full, weighs about…', choices: ['41 kg', '20 kg', '10 kg', '80 kg'], a: 0, why: '5 kg of pot plus 36 kg of contents.' },
    { q: 'The best fix for lifting full stock pots is…', choices: ['a draw-off tap or a tilting kettle, so the pot is never lifted full', 'two cooks lifting together', 'lifting faster', 'a back belt'], a: 0, why: 'Removing the lift beats sharing it.' },
    { q: 'Trays loaded into an oven between knuckle and shoulder height avoid both stooping and overhead reaching.', a: true, why: 'That band — about 855–1260 mm for everyone — is the comfortable handling zone.' }
  ],
  problems: [
    { q: 'A 60 L pot weighs 7 kg empty and is 80 % full of stock. What does it weigh?', answer: 55, unit: 'kg', tol: 0.01, steps: ['$m = 7 + 1000 \\times 0.060 \\times 0.8 = 55$ kg.'] }
  ],
  ranges: [
    { dim: 'Preparation counter (top of the chopping board)', range: [890, 1025], unit: 'mm', who: 'median woman to median man: light work, elbow with shoes less 100–150 mm', why: 'Chopping and portioning with relaxed shoulders and an upright back.', limits: 'The 5th-percentile woman needs about 815–865 mm and the 95th-percentile man about 1060–1110 mm: adjustable counters or board raisers.', setting: ['workshop', 'civil'], src: 'Kroemer and Grandjean offsets; representative elbow heights' },
    { dim: 'Top of a stock-pot range (pots of about 40 L)', range: [450, 600], unit: 'mm', who: 'cooks from the 5th-percentile woman to the median man stirring with the hands below the elbow', why: 'The rim and the stirring hands stay below the elbow.', limits: 'Smaller pots suit higher ranges; lifting from a low range is worse — pour or drain instead.', setting: ['workshop', 'military', 'field'], src: 'Derived from representative elbow heights and pot size' },
    { dim: 'Tray and rack loading heights', range: [855, 1260], unit: 'mm', who: '95th-percentile man\'s knuckle height to 5th-percentile woman\'s shoulder height, with shoes', why: 'Hot, heavy trays handled without stooping or reaching overhead.', limits: 'Ovens often have more levels than this band: load heavy trays in it, and use rack trolleys.', setting: ['workshop', 'civil'], src: 'Representative body data' },
    { dim: 'Sink bowl depth at a 900 mm rim', range: [null, 200], unit: 'mm', who: 'keeps the bottom near the 5th-percentile woman\'s knuckle height (about 690 mm)', why: 'Items reached without stooping into the bowl.', limits: 'Taller users still bend; raised baskets and spray arms help; pot sinks may need deeper bowls with platforms.', setting: ['workshop', 'civil'], src: 'Derived from representative knuckle height' },
    { dim: 'Lifting index of any pot or tray lift', range: [null, 1], unit: '', who: 'every cook, using the revised NIOSH equation', why: 'A lift within the recommended weight limit protects nearly all workers.', limits: 'Hot liquids add a burn hazard no lifting index covers: pour and drain instead of carrying.', setting: ['workshop', 'military', 'field'], src: 'Revised NIOSH lifting equation (Waters et al., 1993)' }
  ],
  applications: [
    'Low stock-pot ranges, tilting kettles and bratt pans in institutional kitchens.',
    'Adjustable prep counters and board raisers for teams of different heights.',
    'Roll-in rack ovens and trolleys in bakeries and hospital kitchens.',
    'Field kitchens with low burner stands and pouring aids.'
  ],
  sources: [
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine, "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics*, 1993.',
    'ISO 7243, *Ergonomics of the thermal environment — Assessment of heat stress using the WBGT index*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on work heights.',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting, lowering and carrying*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on kitchens and work heights.'
  ],
  sim: 'wk-stockpot'
},

{
  id: 'laboratory-ergonomics', parent: 'services-topic', title: 'Laboratories', level: 2,
  short: 'Laboratory work is precise, repetitive and often static: pipetting thousands of times a day, peering into microscopes, reaching into safety cabinets and sitting on stools at standing-height benches. The fixes are seats and footrests fitted to the bench, microscopes adjusted to the eyes rather than the eyes to the microscope, low-force and electronic pipettes, and work kept close and low inside cabinets.',
  keywords: ['laboratory', 'lab bench', 'lab stool', 'footrest', 'pipetting', 'pipette', 'microscope', 'neck flexion', 'eyepiece', 'biosafety cabinet', 'fume hood', 'RULA', 'repetitive thumb', 'static posture'],
  prereq: ['workbench-design', 'static-muscle-work', 'neutral-postures'],
  related: ['standing-work-heights', 'hand-tools', 'repetitive-strain', 'monitor-placement', 'visual-ergonomics', 'hospital-workstations', 'lighting-levels', 'standing-all-day'],
  body: `
A laboratory looks calm, but its work is some of the most static and repetitive in any building: hours of pipetting, microscopy, sample preparation and screen work, often at benches built for standing and used sitting. The complaints are in the neck, shoulders, thumbs, wrists and lower back.

### Benches, stools and footrests
Lab benches are commonly about 900 mm high for standing work and 720–750 mm for sitting. A person sitting at a standing-height bench needs a high seat so that the elbows are at about bench height — and then a **footrest**, because the feet no longer reach the floor:

$$h_s = h_b - h_{er},\\qquad h_f = h_s - (h_p + a_s)$$

At a 900 mm bench the seat must be about 610–710 mm (the 95th-percentile man to the 5th-percentile woman) and the footrest 90–325 mm; for the median woman, 665 mm and 235 mm. Foot rings on stools are too small and too far forward to rest on for long: a proper footrest, adjustable in height and angle, is better. Knee room under the bench is needed too — cupboards under the bench top stop people sitting close. The [[standing-work-heights]] rules apply to standing work.

### Pipetting
Manual pipettes are pressed with the thumb thousands of times a day, and tip ejection can take a sharp push. Keep the plunger and ejection forces low (low-force and electronic pipettes, multichannel pipettes for plates), keep the elbow low and close to the body — tubes, racks and plates near the front and low, short tubes in low racks — and support the forearm. Change hands and tasks, and take micro-pauses; the rules of [[repetitive-strain]] apply. (ISO 8655 covers the accuracy of pipettes; their ergonomics must be checked separately.)

### Microscopes
The eyepieces fix the eyes in space, and the body must bend to meet them. If they are too low or too steep, the neck bends forward and stays there. The fix is to adjust the **microscope to the person**: an ergonomic head with tilting tubes, eyepiece extensions or risers, raising the microscope on a platform or lowering the seat, focus and stage controls near the bench so the forearms can rest, and a camera and screen for long observation. Posture methods such as RULA score neck flexion of 0–10° lowest, 10–20° higher, and more than 20° higher still; trunk flexion scores from 0° upright upwards.

In the simulation, set the seat, the bench, the eyepiece height and its viewing angle, and watch the trunk and neck angles with their RULA bands.

### Safety cabinets and fume hoods
Biological safety cabinets (EN 12469 in Europe, NSF/ANSI 49 in the US) and chemical fume hoods protect the worker only when the sash and airflow are respected, which forces a reach under a fixed sash into a deep space. Work is commonly kept at least about 100 mm inside the front grille, so the arms reach forward for long periods. Seated cabinets need knee room, a footrest and a chair of the right height; armrests or padded front edges that do not block the grille; equipment placed low and close; and good lighting without glare on the sash.

### Other tasks
Opening many tubes (use de-cappers and tube openers), labelling, reaching into chest freezers (prefer upright freezers and racks), working in cold rooms, and long screen work (see [[monitor-placement]]).

### Settings
- **Research, clinical and industrial laboratories**: mixed tasks, sitting and standing; adjustability and task rotation.
- **Hospital laboratories and pharmacies**: high-throughput repetitive work (see [[hospital-workstations]]).
- **School laboratories**: children at adult-height benches need stools and footrests of their size (see [[school-furniture]]).
- **Field and military laboratories**: mobile labs in vehicles and containers with fixed benches; stools, footrests and portable microscope platforms make them usable.

> [!key] Fit the seat to the bench and the footrest to the seat, bring the microscope to the eyes, keep pipetting forces low and work close, and vary the tasks.
`,
  ideas: [
    'At a standing-height bench, the seat is the bench minus the seated elbow height — and a footrest is then essential.',
    'At a 900 mm bench the seat is about 610–710 mm and the footrest about 90–325 mm high.',
    'Adjust the microscope to the person (tilting tubes, extensions, risers), not the neck to the microscope.',
    'Low-force and electronic pipettes, low and close work, forearm support and variety reduce thumb and shoulder strain.',
    'Safety cabinets force long forward reaches: knee room, footrests and work kept low and close.'
  ],
  pitfalls: [
    'A stool\'s foot ring is enough to rest the feet — It is small and forward; hours on it tire the legs. Use a proper footrest.',
    'Good posture is the user\'s responsibility at the microscope — The eyepieces fix the eyes; only adjusting the equipment removes the bent neck.',
    'Pipetting is light work — Each press is light, but thousands of thumb presses a day are a classic repetitive-strain exposure.'
  ],
  formulas: [
    {
      name: 'Seat height at a bench',
      expr: 'hs = hb - her', tex: 'h_s = h_b - h_{er}',
      vars: {
        hs: { name: 'seat height', q: 'length', unit: 'mm', tex: 'h_s' },
        hb: { name: 'bench height', q: 'length', unit: 'mm', value: 900, tex: 'h_b' },
        her: { name: 'elbow rest height above the seat', q: 'length', unit: 'mm', value: 235, tex: 'h_{er}' }
      },
      note: 'Puts the bench at seated elbow height; subtract a little more for keyboard or pipetting work.',
      stories: { hs: 'A bench is {hb} high and a technician\'s elbow rest height is {her}. How high should the seat be?' }
    },
    {
      name: 'Footrest height',
      expr: 'hf = hs - hp - a', tex: 'h_f = h_s - h_p - a_s',
      vars: {
        hf: { name: 'footrest height', q: 'length', unit: 'mm', tex: 'h_f' },
        hs: { name: 'seat height', q: 'length', unit: 'mm', value: 665, tex: 'h_s' },
        hp: { name: 'popliteal height', q: 'length', unit: 'mm', value: 405, tex: 'h_p' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' }
      },
      note: 'Zero or negative: the feet reach the floor.',
      stories: { hf: 'A seat is {hs} high and the user\'s popliteal height is {hp} with {a} of shoe. How high must the footrest be?' }
    }
  ],
  examples: [
    {
      title: 'A stool at a standing bench',
      q: 'The median woman (elbow rest height 235 mm, popliteal height 405 mm, 25 mm of shoe) sits at a 900 mm bench. What seat and footrest heights does she need?',
      steps: [
        'Seat: $900 - 235 = 665$ mm.',
        'Footrest: $665 - 405 - 25 = 235$ mm.',
        'For the 5th-percentile woman: seat 711 mm and footrest 324 mm; for the 95th-percentile man: seat 606 mm and footrest 90 mm.'
      ],
      a: 'Seat 665 mm, footrest 235 mm.'
    }
  ],
  quiz: [
    { q: 'A technician sits on a high stool at a 900 mm bench and her feet dangle. What does she need?', choices: ['A footrest of the right height', 'A lower stool, with the elbows below the bench', 'To stand all day', 'Nothing'], a: 0, why: 'The seat must be high for the elbows to meet the bench; the footrest supports the feet and relieves the thighs.' },
    { q: 'A microscope makes the neck bend 30° forward. What is the best fix?', choices: ['Tilt the eyepiece tubes or raise the eyepieces with extensions or a riser', 'Tell the user to sit up straight', 'Lower the chair', 'Work faster'], a: 0, why: 'The eyepieces fix the eyes; raising them or making the view less steep lets the neck straighten.' },
    { q: 'By RULA\'s bands, neck flexion of 15° scores lower than neck flexion of 25°.', a: true, why: 'RULA scores 0–10° lowest, 10–20° next and more than 20° higher still.' },
    { q: 'At a 950 mm bench, what seat height suits a man with an elbow rest height of 260 mm (mm)?', answer: 690, unit: 'mm', why: '$950 - 260 = 690$ mm — and a footrest.' }
  ],
  problems: [
    { q: 'A seat is set at 700 mm for a user with a popliteal height of 440 mm and 25 mm shoes. How high a footrest does he need?', answer: 235, unit: 'mm', tol: 0.01, steps: ['$h_f = 700 - 440 - 25 = 235$ mm.'] }
  ],
  ranges: [
    { dim: 'Seat height at a 900 mm standing-height bench', range: [605, 710], unit: 'mm', who: '95th-percentile man to 5th-percentile woman: bench less seated elbow rest height', why: 'Elbows at bench height with relaxed shoulders.', limits: 'Needs a footrest and knee room under the bench; other bench heights shift the range.', setting: ['health', 'workshop', 'school'], src: 'Representative elbow rest heights' },
    { dim: 'Footrest height for a stool at a 900 mm bench', range: [90, 325], unit: 'mm', who: '95th-percentile man to 5th-percentile woman', why: 'Feet supported, no pressure under the thighs from the seat edge.', limits: 'Must be large enough for both feet and adjustable; foot rings on stools are not a substitute for long work.', setting: ['health', 'workshop', 'school'], src: 'Representative popliteal and elbow rest heights' },
    { dim: 'Neck flexion at a microscope', range: '0–20°', unit: '', who: 'every user, sustained for long sessions', why: 'Keeps the neck muscles and discs near neutral during long static viewing.', limits: 'RULA scores more than 20° higher; long sessions still need breaks and screens.', setting: ['health', 'workshop'], src: 'RULA (McAtamney and Corlett, 1993)' },
    { dim: 'Common fixed laboratory bench heights', range: '≈ 900 mm standing, 720–750 mm sitting', unit: '', who: 'the middle of the workforce', why: 'Standard furniture sizes.', limits: 'Fit few people exactly: adjustable benches, stools and footrests fit the rest.', setting: ['health', 'school'], src: 'Common laboratory furniture practice' },
    { dim: 'Work inside a biological safety cabinet, behind the front grille', range: [100, null], unit: 'mm', who: 'every user', why: 'Keeps the protective airflow at the front unobstructed.', limits: 'Forces long forward reaches: keep items low and close, and sit with knee room and a footrest.', setting: ['health'], src: 'Common biosafety cabinet practice; EN 12469, NSF/ANSI 49' }
  ],
  applications: [
    'Laboratory stools with adjustable footrests at standing-height benches.',
    'Ergonomic microscope heads, eyepiece extensions and digital microscopy.',
    'Electronic and low-force pipettes and plate handling in high-throughput labs.',
    'Seated biosafety cabinets with knee room and footrests.'
  ],
  sources: [
    'EN 12469, *Biotechnology — Performance criteria for microbiological safety cabinets*.',
    'NSF/ANSI 49, *Biosafety cabinetry: design, construction, performance and field certification*.',
    'ISO 8655, *Piston-operated volumetric apparatus* (pipette performance).',
    'L. McAtamney and E. N. Corlett, "RULA: a survey method for the investigation of work-related upper limb disorders", *Applied Ergonomics*, 1993.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on seated work and footrests.'
  ],
  sim: 'wk-microscope'
}

);
