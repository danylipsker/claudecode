/* HYPER-ERGONOMICS · content/military-field.js
 * Military human factors (human-systems integration and its standards, load carriage, crew stations, fitting helmets,
 * armour and equipment, heat, cold, altitude and protective suits, sleep loss and sustained operations) and field work
 * (construction, agriculture, sun and heat outdoors, working at height, confined spaces, PPE people can work in, field
 * computing). Military pages are human factors only: fitting people to equipment, loads, crew stations, climates and
 * hours. Simulations in sims/military-field.js (prefix mf-). */
Hyper.add(

{
  id: 'military-human-factors', parent: 'military-topic', title: 'Human factors in defence', level: 2,
  short: 'Defence equipment must fit the whole force — women and men of every size — wearing helmets, armour and equipment, in every climate, for decades of service. Human-systems integration and standards such as MIL-STD-1472 and DEF STAN 00-250 turn that into design requirements: the encumbered 5th to 95th, and for critical items the 1st to 99th, percentile.',
  keywords: ['military ergonomics', 'human factors', 'human-systems integration', 'HSI', 'MANPRINT', 'Human Factors Integration', 'MIL-STD-1472', 'DEF STAN 00-250', 'ANSUR II', 'encumbered anthropometry', 'design population', '1st to 99th percentile', 'women in the armed forces', 'selection versus design', 'multivariate accommodation'],
  prereq: ['design-for-range', 'ergo-standards', 'clothing-ppe-allowances'],
  related: ['load-carriage', 'crew-stations', 'personal-equipment-fit', 'extreme-environments', 'sustained-operations', 'combining-percentiles', 'sex-differences', 'digital-human-models', 'user-trials-mockups', 'human-error', 'control-rooms', 'cockpit-ergonomics'],
  body: `
A soldier, sailor or aircrew member must fit into a crew seat in a helmet and body armour, reach controls with gloved hands, carry a third of their body mass or more on foot, and keep working in heat, cold and noise, often short of sleep. Military ergonomics — in defence usually **human factors** or **human-systems integration** (HSI) — designs equipment, vehicles, ships and aircraft so that the whole range of people who will use them can do so safely and well. These pages are about fitting people to equipment, loads, crew stations and climates, nothing else.

### Why defence is different
| | Office or workshop | Military |
|---|---|---|
| Users | the working population | selected, fit adults — women and men in every role |
| What they wear | ordinary clothes, some PPE | helmet, armour, vest, gloves, perhaps a protective suit: 20–30 kg before a pack |
| Environment | largely controlled | arctic to desert, at sea and at altitude, with noise and vibration |
| Exposure | shifts with breaks | sustained operations lasting days |
| Life of the design | years | often decades: a vehicle designed today serves people not yet recruited |
| Cost of a misfit | discomfort and injury | injury, and errors that endanger a crew |

### Human-systems integration
HSI follows the people through the whole life of a system under headings such as manpower, personnel (abilities and sizes), training, human factors engineering (workspaces and interfaces), safety and health, habitability and survivability. The US Army's MANPRINT programme of the 1980s made this a formal part of buying equipment; the UK's Human Factors Integration does the same. When equipment and people do not fit, you can **design** the equipment for more people, **select** only the people who fit, or **train** people to cope. Selection shrinks the pool of recruits for reasons unrelated to ability, and training cannot lengthen an arm: design is almost always the better answer.

### The standards
- **MIL-STD-1472**, *Department of Defense Design Criteria Standard: Human Engineering* (US), revised many times since the 1960s: anthropometry and workspaces, controls and displays, labels, noise, vibration, climate, light, maintenance and user interfaces — stated for a range of users, not an average.
- **DEF STAN 00-250**, *Human Factors for Designers of Systems* (UK Ministry of Defence): the process of integrating human factors, and technical guidance on human characteristics.
- Domain standards (for ships, ASTM F1166) and civil ones (ISO 9241, ISO 11064, EN 614, ISO 7243) apply the same principles.

### Who is the user?
Military populations are selected for age and fitness, but they are not narrow. Since the mid-2010s women have been able to serve in every role in the US and UK armed forces, and equipment built on men's data excludes many of them. The US Army's ANSUR II survey (2012) measured 4082 men and 1986 women on more than 90 dimensions for exactly this reason. A control placed at the forward reach of the 5th-percentile man (about 737 mm in the representative data used here, a [[?gaussian]] with [[?mean]] 800 mm and [[?standard-deviation]] 38 mm) is beyond the reach of about 58 % of women.

What must fit is the **encumbered** body — body plus clothing, armour, helmet and equipment. Armour adds depth front and back, a helmet adds height and changes the line of sight, gloves thicken the fingers, and cold-weather clothing adds bulk everywhere ([[clothing-ppe-allowances]]). Critical items — escape hatches, restraints, emergency controls — are therefore often sized for the **1st to 99th percentile** of the whole force, encumbered; comfort items use the 5th to 95th. And because a crew station must fit several dimensions at once, accommodation is checked with correlated, multivariate data, boundary manikins and trials with real people ([[combining-percentiles]], [[digital-human-models]], [[user-trials-mockups]]).

In the simulation a crowd with correlated body sizes meets a crew station's limits — head and knee clearance, reach, the seat's mass range. Set the limits from men's data and see who is left out; add helmets and armour; compare each limit alone with all of them together.

### Settings
Crew stations ([[crew-stations]]), loads and personal equipment ([[load-carriage]], [[personal-equipment-fit]]), climate and hours ([[extreme-environments]], [[sustained-operations]]), command posts and field maintenance ([[control-rooms]], [[maintenance-ergonomics]]). Police, fire and rescue and ambulance crews share many of the same problems — armour, heavy PPE, loads and long shifts.

> [!key] In defence, fit the encumbered person: the whole force, women and men, wearing everything they will wear, over the whole life of the system. Design first — selection and training cannot make up for equipment that does not fit.

> [!note] The body data in this app are representative, rounded values for learning. Defence programmes use their own surveys (such as ANSUR II), measurements of people in full equipment, and trials.
`,
  ideas: [
    'Human-systems integration treats the people as part of the system for its whole life: manpower, personnel, training, human factors engineering, safety, habitability and survivability.',
    'When equipment and people do not fit, design is almost always better than selecting people or training them to cope.',
    'The design population is the whole force — women and men — and the size that matters is the encumbered size.',
    'Critical items (escape, restraints, emergency controls) are often sized for the 1st to 99th percentile; comfort items for the 5th to 95th.',
    'Several limits at once accommodate fewer people than any one of them: accommodation is checked with multivariate data, manikins and trials.'
  ],
  pitfalls: [
    'Soldiers are a selected population, so men\'s data will do — Women now serve in every role; a reach set from men\'s 5th percentile excludes more than half of women.',
    'Fitting each dimension from the 5th to the 95th percentile fits 90–95 % of people — Each limit excludes a few more; four or five limits together can exclude a fifth of the force or more.',
    'Body sizes from an unclothed survey are the design sizes — Helmets, armour, gloves and cold-weather clothing add centimetres; military designs use encumbered dimensions.'
  ],
  formulas: [
    {
      name: 'Share of a mixed force that can reach a control',
      expr: 'F = w*ncdf((mm - r)/sm) + (1 - w)*ncdf((mf - r)/sf)',
      tex: 'F = w\\,\\Phi\\!\\left(\\dfrac{\\mu_m - r}{\\sigma_m}\\right) + (1 - w)\\,\\Phi\\!\\left(\\dfrac{\\mu_f - r}{\\sigma_f}\\right)',
      vars: {
        F: { name: 'share of the force who can reach', q: 'ratio', unit: '%', tex: 'F' },
        w: { name: 'share of men in the force', q: 'ratio', unit: '%', value: 85, min: 0, max: 100, tex: 'w' },
        r: { name: 'reach the control demands', q: 'length', unit: 'mm', value: 737, tex: 'r' },
        mm: { name: 'men\'s mean reach', q: 'length', unit: 'mm', value: 800, tex: '\\mu_m' },
        sm: { name: 'men\'s standard deviation', q: 'length', unit: 'mm', value: 38, tex: '\\sigma_m' },
        mf: { name: 'women\'s mean reach', q: 'length', unit: 'mm', value: 730, tex: '\\mu_f' },
        sf: { name: 'women\'s standard deviation', q: 'length', unit: 'mm', value: 36, tex: '\\sigma_f' }
      },
      note: 'Φ is the normal cumulative distribution. For a clearance (people must be smaller than the limit) swap the signs inside Φ. Representative forward grip reach: 800 ± 38 mm (men), 730 ± 36 mm (women).',
      stories: { F: 'A force is {w} men. Reach is {mm} ± {sm} for men and {mf} ± {sf} for women. What share can reach a control {r} away?', r: 'A force is {w} men (reach {mm} ± {sm}; women {mf} ± {sf}). How far away may a control be if {F} of the force must reach it?' }
    },
    {
      name: 'Several independent limits at once',
      expr: 'P = p^n', tex: 'P = p^{n}',
      vars: {
        P: { name: 'share accommodated by all the limits', q: 'ratio', unit: '%', tex: 'P' },
        p: { name: 'share accommodated by each limit', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: 'p' },
        n: { name: 'number of independent limits', int: true, value: 4, min: 1, max: 20, tex: 'n' }
      },
      note: 'A worst case: real body dimensions are correlated, so the true share lies between this and the share of the tightest single limit.',
      stories: { P: 'A crew station has {n} independent limits, each accommodating {p}. What share of people fits all of them?', p: 'To accommodate {P} of people on {n} independent limits, what share must each limit accommodate?' }
    }
  ],
  examples: [
    {
      title: 'A control placed from men\'s data',
      q: 'Forward grip reach is 800 ± 38 mm for men and 730 ± 36 mm for women. A designer places a control at the reach of the 5th-percentile man. The force is 85 % men. What share of women, and of the whole force, can reach it? Where should it go?',
      steps: [
        '5th-percentile man: $800 - 1.645 \\times 38 = 737$ mm.',
        'Women: $z = (730 - 737)/36 = -0.19$, so $\\Phi(-0.19) = 42$ % reach it — 58 % cannot.',
        { text: 'The whole force:', tex: 'F = 0.85 \\times 0.95 + 0.15 \\times 0.42 = 0.87' },
        'With equal numbers of men and women it would be only 69 %. At the 5th-percentile woman\'s reach, $730 - 1.645 \\times 36 = 671$ mm, 95 % of women and practically all men reach it.'
      ],
      a: 'About 42 % of women and 87 % of the force; place it within about 670 mm (less with armour and a restraint).'
    },
    {
      title: 'Four limits at once',
      q: 'A crew station has four limits — head clearance, knee clearance, reach and the seat\'s mass range — each set to accommodate 95 % of the force. If they were independent, what share would fit all four?',
      steps: [
        '$P = 0.95^4 = 0.81$: about 81 %.',
        'Sitting height, leg length and reach are correlated (tall people tend to be large in all three), so the real share is higher — somewhere between 81 % and 95 %.',
        'Only a multivariate check — a correlated sample, boundary manikins or a trial — gives the real figure; try it in the simulation.'
      ],
      a: 'At worst about 81 %; with realistic correlations somewhat more.'
    }
  ],
  quiz: [
    { q: 'An escape hatch is being sized. Which user limits it?', choices: ['The largest users, wearing armour and equipment', 'The smallest users', 'The average user, unclothed', 'The crew commander'], a: 0, why: 'A hatch is a clearance: if the largest encumbered user passes, everyone smaller does too. For escape the design goes to the 99th percentile or beyond.' },
    { q: 'Equipment designed from men\'s body data usually fits most women as well.', a: false, why: 'Clearances set from men usually fit women, but reaches, seat depths, grips and sizes set from men\'s data leave out many women — more than half for a reach at the 5th-percentile man.' },
    { q: 'In human-systems integration, which response to a misfit is usually best?', choices: ['Change the design so it fits more people', 'Recruit only people who fit', 'Train people to adapt their posture', 'Issue a waiver'], a: 0, why: 'Selection narrows the pool of people and training cannot change body size; design removes the problem for everyone.' },
    { q: 'Why are critical military items often designed for the 1st to 99th percentile rather than the 5th to 95th?', choices: ['A misfit could trap, injure or disable someone, so fewer may be excluded', 'Military people are larger', 'It is cheaper', 'The 5th–95th range is only used for children'], a: 0, why: 'Where the cost of a misfit is severe, the design goes further into the tails.' },
    { q: 'Five independent limits each accommodate 96 %. Roughly what share fits all five?', choices: ['About 82 %', 'About 96 %', 'About 99 %', 'About 50 %'], a: 0, why: '$0.96^5 = 0.815$. Correlations make the true share a little higher, but always below 96 %.' }
  ],
  problems: [
    { q: 'A force is 70 % men. Forward reach is 800 ± 38 mm for men and 730 ± 36 mm for women. What share of the force can reach a control 700 mm away?', answer: 93.6, unit: '%', tol: 0.01, steps: ['Men: $\\Phi((800 - 700)/38) = \\Phi(2.63) = 0.996$.', 'Women: $\\Phi((730 - 700)/36) = \\Phi(0.83) = 0.798$.', '$F = 0.7 \\times 0.996 + 0.3 \\times 0.798 = 0.936$, about 93.6 %.'] },
    { q: 'Five independent limits each accommodate 97 % of people. What share fits all five?', answer: 85.9, unit: '%', tol: 0.01, steps: ['$P = 0.97^5 = 0.859$, about 85.9 %.'] }
  ],
  ranges: [
    { dim: 'Design population for critical items (escape, restraints, emergency controls)', range: '1st-percentile woman to 99th-percentile man, encumbered', who: 'The whole force, women and men, in helmet, armour and equipment', why: 'Nobody is trapped, unrestrained or unable to reach an emergency control because of their size.', limits: 'Still leaves about 1 % at each end; very small and very large people need individual fitting or solutions.', setting: 'military', src: 'Common defence practice described in MIL-STD-1472 and DEF STAN 00-250; the system\'s own requirement governs' },
    { dim: 'Design population for comfort and convenience items', range: '5th-percentile woman to 95th-percentile man', who: 'The whole force, dressed as for the task', why: 'Fits about 95 % of a mixed force on each dimension at a sensible cost.', limits: 'Several limits together fit fewer; check the combination.', setting: 'military', src: 'MIL-STD-1472; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Stature range of a mixed design population, barefoot', range: [1476, 1918], unit: 'mm', who: '1st-percentile woman to 99th-percentile man (representative data)', why: 'The span every fixed height, clearance and adjustment must be tested against.', limits: 'Add boots (about 30–40 mm) and helmet; the real force\'s survey governs.', setting: 'military', src: 'Representative data in the spirit of ANSUR II (2012)' },
    { dim: 'Forward reach to a frequently used control, from the seat back', range: [null, 650], unit: 'mm', who: 'About the 1st-percentile woman\'s forward grip reach (646 mm), unencumbered', why: 'The smallest users reach it without leaning out of their restraint.', limits: 'Full grip reach at full stretch: armour, restraints and gloves shorten it; frequent controls belong well inside it.', setting: ['military', 'vehicle'], src: 'Representative data; MIL-STD-1472 for the method' }
  ],
  applications: [
    'Requirements for new vehicles, aircraft and ships written as percentile ranges of an encumbered, mixed force.',
    'Anthropometric screening of candidates against specific cockpits instead of blanket height limits.',
    'Checking crew stations with boundary manikins, then trials in full equipment — see [the body-size explorer](#/tools/bodysize/explorer).',
    'Police, fire and rescue services adopting the same fitting approach for armour, breathing apparatus and vehicles.'
  ],
  history: 'In the Second World War, psychologists studying aircraft accidents found that many "pilot errors" had been designed in: Alphonse Chapanis traced wheels-up landings in some aircraft to identical, adjacent flap and landing-gear levers and proposed shape-coded knobs, and Paul Fitts and Richard Jones (1947) collected hundreds of control and display errors. Gilbert Daniels\'s 1952 study of pilots\' body sizes ended designing for the average. MIL-STD-1472 gathered the lessons into requirements, and the US Army\'s MANPRINT programme of the 1980s made the human a formal part of buying every system.',
  sources: [
    'MIL-STD-1472, *Department of Defense Design Criteria Standard: Human Engineering* (US Department of Defense).',
    'DEF STAN 00-250, *Human Factors for Designers of Systems* (UK Ministry of Defence).',
    'C. C. Gordon et al., *2012 Anthropometric Survey of U.S. Army Personnel: Methods and Summary Statistics* (ANSUR II), US Army Natick, 2014.',
    'H. R. Booher (ed.), *Handbook of Human Systems Integration*, Wiley, 2003.',
    'P. M. Fitts and R. E. Jones, *Analysis of factors contributing to 460 "pilot-error" experiences in operating aircraft controls*, US Army Air Forces report, 1947.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, chapters on design for a population and on clothing.'
  ],
  sim: 'mf-hsi-crowd'
},

{
  id: 'load-carriage', parent: 'military-topic', title: 'Carrying loads on foot', level: 2,
  short: 'Soldiers on foot often carry 30–60 kg. Guidance limits a fighting load to about 30 % and an approach-march load to about 45 % of body mass; the energy cost follows the Pandolf equation, and the same pack is a far heavier burden — and a greater injury risk — for a smaller person.',
  keywords: ['load carriage', 'soldier load', 'fighting load', 'approach march load', 'rucksack', 'backpack', 'hip belt', 'Pandolf equation', 'march', 'foot march', 'body mass share', 'stress fracture', 'blisters', 'rucksack palsy', 'energy cost', 'aerobic capacity', 'exoskeleton'],
  prereq: ['carrying-loads', 'mass-strength-data', 'work-rest-scheduling'],
  related: ['military-human-factors', 'personal-equipment-fit', 'extreme-environments', 'spinal-loading', 'sex-differences', 'handling-aids', 'agriculture-ergonomics', 'outdoor-heat-sun'],
  body: `
A soldier on foot is a load-carrying system: the body, plus clothing, armour and helmet, plus a vest of equipment, plus a pack. For as long as armies have marched, the load has limited how far and how fast people can move — and it is a leading cause of injury in training and in service.

### Loads as a share of body mass
The body carries a load in proportion to its own size, so guidance states loads as a share of body mass:

| Load | What it is | Guidance | Measured in operations (Afghanistan, 2003) |
|---|---|---|---|
| **Fighting load** | what is worn to move and work | at most about 30 % of body mass | around 29 kg |
| **Approach-march load** | fighting load plus a pack for a few days | at most about 45 % | around 45 kg |
| **Emergency approach-march load** | when there is no other way | above 45 %, briefly | close to 60 kg in some roles |

The guidance goes back to S. L. A. Marshall's argument (1950) that a soldier should carry no more than about a third of body mass, and to the US Army's foot-march manual (FM 21-18, 1990), which set 22 kg and 33 kg — about 30 % and 45 % of the average soldier of the time. The measured loads come from a US Army survey of dismounted troops (Dean, 2004): real loads routinely exceed the guidance.

**The same load is not the same burden.** 30 kg is 35 % of an 85 kg man, 44 % of a 68 kg woman and 64 % of a 47 kg woman (the 5th percentile of body mass in the representative data). Equipment is issued by task, not by body size, so lighter people — many of them women — carry the heaviest relative loads.

### Energy
Pandolf, Givoni and Goldman (1977) gave the metabolic rate of walking with a load (the terms are explained in [[carrying-loads]]):

$$M = 1.5\\,W + 2.0\\,(W + L)\\left(\\frac{L}{W}\\right)^2 + \\eta\\,(W + L)\\left(1.5\\,V^2 + 0.35\\,V\\,G\\right)$$

A 75 kg soldier with 30 kg at 4.5 km/h on a road spends about 390 W; up a 5 % slope about 620 W; in loose sand about 660 W. What limits a march is that power as a share of aerobic capacity: people can hold about half of their maximum for an hour or two and about a third over a working day ([[work-rest-scheduling]]). With the same load and the same fitness per kilogram, a 47 kg soldier works at about 43 % of capacity where an 85 kg soldier works at 32 %. The equation was fitted to level and uphill walking; downhill walking needs a later correction. Try your own numbers in [the carrying calculator](#/tools/lifting/carry).

### Where the load sits
- **Close to the back and near the body's centre of mass**: a pack that hangs far behind forces the trunk to lean forward to balance it — watch the lean in the simulation.
- **A hip belt** moves much of a framed pack's weight to the pelvis. Without one, shoulder-strap pressure can compress the nerves of the arm (*rucksack palsy*: numbness and weakness).
- **High and close** suits roads; **lower** gives better balance on rough ground and obstacles.
- **Front and back** — armour and pouches on the chest balancing a pack — is energy-efficient, but restricts breathing, movement and the view of the feet.

### What loads do to people
| Effect | Cause | Responses |
|---|---|---|
| Blisters, foot pain | friction and pressure over long distances | boot fit, socks, gradual build-up |
| Stress fractures (feet, shins, pelvis) | repeated impact; over-striding when marching in step with taller people | progressive training, self-paced marching |
| Knee and low-back pain | compression and bending | lighter loads, hip belts, balanced loads |
| Rucksack palsy | strap pressure | hip belt, wide padded straps |
| Slower, less stable | energy and balance | carry less; vehicles, resupply, rests |

### Reducing the load
Lighter materials, only what the task needs, vehicles, unmanned carriers and resupply take weight off people; exoskeletons are still in trials, with mixed evidence. A steady self-chosen pace, the traditional 50 minutes walking and 10 minutes rest, water and food keep a march within the body's budget.

### Settings
- **Military**: loads are set by equipment and tasks; programmes aim to measure and cap them.
- **Field work**: foresters, surveyors, mountain rescue teams and wildland firefighters carry packs over rough ground all day; outdoor advice commonly suggests packs of about a fifth to a quarter of body mass.
- **Civil**: schoolbags of about 10–15 % of body mass ([[carrying-loads]]).

In the simulation, change the load, the carrier, the speed, the slope and the ground: the figure leans, and the load's share of body mass, the metabolic power and the share of aerobic capacity update.

> [!warn] Load and heat add up: a heavy march on a hot day raises body temperature quickly. Plan rests, water and shade, and know the signs of heat illness ([[extreme-environments]], [[medicine:heat-cold|heatstroke and hypothermia]]).

> [!key] Judge a load as a share of the carrier's body mass and aerobic capacity, not in kilograms alone: the same pack is a far heavier burden for a smaller person.
`,
  ideas: [
    'Loads are judged as a share of body mass: about 30 % for a fighting load and 45 % for an approach-march load.',
    'Real loads in operations have often exceeded the guidance, reaching 45–60 kg.',
    'The energy cost rises with body mass, load, the square of speed, slope and terrain (Pandolf); what limits a march is that cost as a share of aerobic capacity.',
    'The same load is a larger share of body mass and of capacity for a smaller person, who therefore carries a greater risk.',
    'Keep the load close, use a hip belt, build up gradually and carry less.'
  ],
  pitfalls: [
    'A load is heavy or light in kilograms — What matters is the share of the carrier\'s body mass and aerobic capacity: 30 kg is 35 % of an 85 kg man and 64 % of a 47 kg woman.',
    'Marching in step is harmless — Shorter people over-stride to keep up with taller ones, which is linked to pelvic and leg stress fractures in recruits.',
    'A strong person can carry any load on the shoulders — Shoulder straps alone can compress the nerves of the arm; a hip belt should carry much of a heavy pack.'
  ],
  formulas: [
    {
      name: 'Energy of walking with a load (Pandolf)',
      expr: 'Mw = 1.5*W + 2*(W + L)*(L/W)^2 + eta*(W + L)*(1.5*V^2 + 0.35*V*G)',
      tex: 'M = 1.5\\,W + 2.0\\,(W + L)\\left(\\frac{L}{W}\\right)^2 + \\eta\\,(W + L)\\left(1.5\\,V^2 + 0.35\\,V\\,G\\right)',
      vars: {
        Mw: { name: 'metabolic rate', q: 'power', unit: 'W', tex: 'M' },
        W: { name: 'body mass', q: 'mass', unit: 'kg', value: 75, min: 35, max: 150, tex: 'W' },
        L: { name: 'load carried (pack, armour and equipment)', q: 'mass', unit: 'kg', value: 30, min: 0, max: 80, tex: 'L' },
        V: { name: 'walking speed', q: 'speed', unit: 'km/h', value: 4.5, min: 0, max: 9, tex: 'V' },
        G: { name: 'grade (slope)', q: false, unit: '%', value: 0, min: 0, max: 30, tex: 'G' },
        eta: { name: 'terrain factor (1.0 road, 1.1 dirt road, 1.5 heavy brush, 2.1 loose sand)', value: 1, min: 1, max: 3, tex: '\\eta' }
      },
      note: 'Pandolf, Givoni and Goldman (1977), for a load carried on the body, level or uphill. The calculator works in SI (the speed in m/s inside the formula). Downhill walking needs a later correction.',
      stories: { Mw: 'A {W} soldier carries {L} at {V} up a {G} slope on terrain with factor {eta}. What is the metabolic rate?', L: 'A {W} soldier walking at {V} on a {G} slope (terrain {eta}) should not exceed {Mw}. What load may they carry?' }
    },
    {
      name: 'Load as a share of body mass',
      expr: 's = L/W', tex: 's = \\frac{L}{W}',
      vars: {
        s: { name: 'load as a share of body mass', q: 'ratio', unit: '%', tex: 's' },
        L: { name: 'load carried', q: 'mass', unit: 'kg', value: 30, tex: 'L' },
        W: { name: 'body mass', q: 'mass', unit: 'kg', value: 68, tex: 'W' }
      },
      note: 'Guidance: at most about 30 % for a fighting load and 45 % for an approach-march load.',
      stories: { s: 'A {W} soldier carries {L}. What share of body mass is that?', L: 'For a {W} soldier, what load is {s} of body mass?' }
    },
    {
      name: 'Share of aerobic capacity',
      expr: 'I = Mw/(0.348*VO2*W)', tex: 'I = \\frac{M}{0.348\\,\\dot{V}_{O_2}\\,W}',
      vars: {
        I: { name: 'metabolic rate as a share of aerobic capacity', q: 'ratio', unit: '%', tex: 'I' },
        Mw: { name: 'metabolic rate', q: 'power', unit: 'W', value: 392, tex: 'M' },
        VO2: { name: 'maximal oxygen uptake, VO₂max', q: false, unit: 'mL/(kg·min)', value: 45, tex: '\\dot{V}_{O_2}' },
        W: { name: 'body mass', q: 'mass', unit: 'kg', value: 75, tex: 'W' }
      },
      note: 'About 20.9 kJ per litre of oxygen: 1 mL/(kg·min) for 1 kg is 0.348 W. Sustainable: about half of capacity for an hour or two, about a third over a working day.',
      stories: { I: 'A {W} soldier with a VO₂max of {VO2} marches at {Mw}. What share of aerobic capacity is that?', Mw: 'A {W} soldier with a VO₂max of {VO2} should stay at {I} of capacity. What metabolic rate is that?' }
    }
  ],
  examples: [
    {
      title: 'One load, three soldiers',
      q: 'Three soldiers — 85 kg, 68 kg and 47 kg — each carry 30 kg at 4.5 km/h on a road. All have a VO₂max of 45 mL/(kg·min). Compare the load share, the metabolic rate and the share of aerobic capacity.',
      steps: [
        'Load share: $30/85 = 35$ %, $30/68 = 44$ %, $30/47 = 64$ %.',
        'Pandolf at 1.25 m/s, level road: 426 W, 370 W and 313 W — the heavier person spends more watts in total.',
        'Capacity: $0.348 \\times 45 \\times W$ = 1331 W, 1065 W and 730 W.',
        'Share of capacity: 32 %, 35 % and 43 %: the lightest soldier works hardest relative to their capacity — and carries a load far above the 45 % guidance.'
      ],
      a: '35 %, 44 % and 64 % of body mass; about 32 %, 35 % and 43 % of aerobic capacity.'
    },
    {
      title: 'How fast can the march go?',
      q: 'A 75 kg soldier with a VO₂max of 48 mL/(kg·min) carries 35 kg up a 3 % grade on a dirt road (η = 1.1). What speed keeps the march at 45 % of capacity?',
      steps: [
        'Capacity: $0.348 \\times 48 \\times 75 = 1253$ W; 45 % of it is 564 W.',
        'Standing terms: $1.5 \\times 75 = 112.5$ W and $2 \\times 110 \\times (35/75)^2 = 47.9$ W.',
        { text: 'The walking terms must supply the rest, 403.4 W:', tex: '1.1 \\times 110 \\times (1.5\\,V^2 + 0.35 \\times 3\\,V) = 403.4' },
        'So $1.5V^2 + 1.05V = 3.334$, giving $V = 1.18$ m/s.'
      ],
      a: 'About 1.18 m/s, or 4.3 km/h.'
    }
  ],
  quiz: [
    { q: 'Three soldiers carry the same 30 kg pack. For whom is it the heaviest burden?', choices: ['The 47 kg soldier', 'The 85 kg soldier', 'The same for all three', 'It depends only on the pack'], a: 0, why: 'It is 64 % of the lightest soldier\'s body mass against 35 % of the heaviest\'s, and a larger share of aerobic capacity.' },
    { q: 'A 75 kg soldier marches with 30 kg at 4.5 km/h on a road (about 390 W). Which change costs the most extra energy?', choices: ['Moving onto loose sand', 'Adding 10 kg to the pack', 'Walking at 5.5 km/h', 'A 1 % slope'], a: 0, why: 'By Pandolf: sand (η = 2.1) about 660 W; 5.5 km/h about 510 W; +10 kg about 450 W; a 1 % slope about 440 W.' },
    { q: 'A hip belt only adds comfort; it does not change where the load is carried.', a: false, why: 'A well-fitted hip belt transfers much of a framed pack\'s weight to the pelvis, relieving the shoulders and the nerves under the straps.' },
    { q: 'Why can marching in step raise the risk of stress fractures for shorter recruits?', choices: ['They over-stride to keep up', 'They carry less', 'They walk more slowly', 'Their boots are heavier'], a: 0, why: 'A stride longer than a person\'s natural one raises the loads on the pelvis and legs; self-paced marching avoids it.' },
    { q: 'A 60 kg soldier carries 27 kg. What share of body mass is that (%)?', answer: 45, unit: '%', why: '$27/60 = 0.45$: right at the approach-march guidance.' }
  ],
  problems: [
    { q: 'A 60 kg soldier carries 25 kg at 4 km/h on a level road (η = 1). What is the metabolic rate by the Pandolf equation?', answer: 277, unit: 'W', tol: 0.02, steps: ['$V = 4/3.6 = 1.111$ m/s.', 'Standing: $1.5 \\times 60 = 90$ W; $2 \\times 85 \\times (25/60)^2 = 29.5$ W.', 'Walking: $85 \\times 1.5 \\times 1.111^2 = 157.4$ W.', 'Total about 277 W.'] },
    { q: 'A 75 kg soldier carries 30 kg at 4 km/h on a level road, which costs about 341 W. How much energy does a 5-hour march use, in MJ?', answer: 6.13, unit: 'MJ', tol: 0.02, steps: ['$E = 341 \\times 5 \\times 3600 = 6.13 \\times 10^6$ J = 6.13 MJ.', 'That is about 1470 kcal — to be replaced by food and water on long marches.'] }
  ],
  ranges: [
    { dim: 'Fighting load', range: [null, 30], unit: '% of body mass', who: 'Each person, by their own body mass', why: 'Keeps movement quick and the energy cost within a sustainable share of capacity.', limits: 'Real loads often exceed it; lighter people reach it with less equipment; bulk and heat matter too.', setting: 'military', src: 'S. L. A. Marshall (1950); US Army FM 21-18, *Foot Marches* (1990)' },
    { dim: 'Approach-march load (fighting load plus pack)', range: [null, 45], unit: '% of body mass', who: 'Each person, by their own body mass', why: 'Limits injury and exhaustion on marches of several hours.', limits: 'An upper limit, not a target; over rough ground, uphill or in heat, much less.', setting: 'military', src: 'US Army FM 21-18, *Foot Marches* (1990)' },
    { dim: 'Pack for all-day field work', range: '20–25', unit: '% of body mass', who: 'Foresters, surveyors, rescue teams, hikers', why: 'A load most fit adults can carry over rough ground all day.', limits: 'Guidance varies; fitness, terrain and heat matter more than a single number.', setting: 'field', src: 'Common outdoor and occupational guidance' },
    { dim: 'Metabolic rate that can be held', range: 'about 50 % of capacity for 1–2 h; about 33 % over a working day', who: 'Fit adults; less for older, less fit or unacclimatised people', why: 'Below these shares a march can go on without exhaustion.', limits: 'Heat, altitude and sleep loss lower them.', setting: ['military', 'field'], src: 'Work physiology (Åstrand and Rodahl, *Textbook of Work Physiology*)' },
    { dim: 'Planned rate of a loaded foot march, including halts', range: '2.4–4', unit: 'km/h', who: 'About 4 km/h on roads, about 2.4 km/h across country, by day', why: 'Keeps the energy cost and the injury risk of a long march down.', limits: 'Slower at night, in heat, uphill and with heavier loads.', setting: 'military', src: 'US Army FM 21-18, *Foot Marches* (1990)' },
    { dim: 'March–rest cycle', range: '50 min walking, 10 min rest', who: 'Everyone on a long march', why: 'Regular rests let people adjust loads and feet, drink and recover.', limits: 'Heat and heavy loads call for more rest, not less.', setting: ['military', 'field'], src: 'Traditional march practice; FM 21-18' }
  ],
  applications: [
    'Load planning that caps what each role carries and weighs it for real.',
    'Packs with frames and hip belts, adjustable torso lengths and quick-release straps.',
    'Progressive march training in recruit schools, with self-paced marching for mixed groups.',
    'Estimating energy, water and pace for a march in [the carrying calculator](#/tools/lifting/carry).'
  ],
  history: 'Roman legionaries after Marius\'s reforms were nicknamed "Marius\'s mules" for the kit they carried. S. L. A. Marshall\'s *The Soldier\'s Load and the Mobility of a Nation* (1950) argued from the Second World War that overloaded soldiers arrive exhausted, and proposed the one-third rule. US Army research at Natick — Givoni and Goldman, then Pandolf and colleagues in 1977 — turned the energy cost of carrying into an equation still used today.',
  sources: [
    'J. J. Knapik, K. L. Reynolds and E. Harman, "Soldier load carriage: historical, physiological, biomechanical, and medical aspects", *Military Medicine* 169 (2004).',
    'K. B. Pandolf, B. Givoni and R. F. Goldman, "Predicting energy expenditure with loads while standing or walking very slowly", *Journal of Applied Physiology* 43 (1977).',
    'US Army Field Manual FM 21-18, *Foot Marches* (1990).',
    'S. L. A. Marshall, *The Soldier\'s Load and the Mobility of a Nation*, 1950.',
    'C. Dean, *The Modern Warrior\'s Combat Load: Dismounted Operations in Afghanistan, April–May 2003*, US Army, 2004.',
    'S. Datta and N. Ramanathan, "Ergonomic comparison of seven modes of carrying loads on the horizontal plane", *Ergonomics* 14 (1971).'
  ],
  sim: 'mf-load-march'
},

{
  id: 'crew-stations', parent: 'military-topic', title: 'Crew stations in vehicles, aircraft and ships', level: 2,
  short: 'A crew station fixes the eyes at a design eye point and fits everything else around the encumbered extremes: head room and knee room for the largest crew member in helmet and armour, reach for the smallest, and seat travel of about 170–215 mm for everyone between.',
  keywords: ['crew station', 'design eye point', 'seat reference point', 'armoured vehicle', 'cockpit', 'ejection seat', 'helicopter', 'ship', 'vision block', 'periscope', 'head clearance', 'knee clearance', 'seat adjustment', 'body armour', 'helmet', 'occupant mass range', 'MIL-STD-1333', 'ASTM F1166'],
  prereq: ['vehicle-seating', 'sitting-dimensions', 'military-human-factors'],
  related: ['cockpit-ergonomics', 'driver-workspace', 'personal-equipment-fit', 'whole-body-vibration', 'access-openings', 'functional-reach', 'controls-design', 'displays-design', 'combining-percentiles', 'digital-human-models', 'sustained-operations', 'noise-exposure'],
  body: `
A crew station is a workplace wrapped tightly around a person. In an armoured vehicle, a cockpit or a ship's compartment every litre is contested by armour, fuel, equipment and systems, and the crew must fit the space left over — in helmet, armour and restraint, for hours, while the platform moves.

### Designing from the eye
Most crew stations start from a **design eye point** — where the eyes must be to see through a vision block or sight, over an aircraft's nose, or out of a bridge window — and a **seat reference point**. The seat adjusts so that every user's eyes reach that point: small users raise the seat, large users lower it. The travel needed is the spread of sitting eye height:

$$\\Delta s = (\\mu_m + z\\,\\sigma_m) - (\\mu_f - z\\,\\sigma_f)$$

With sitting eye heights of 795 ± 35 mm (men) and 740 ± 33 mm (women), the 5th-percentile woman to the 95th-percentile man needs 167 mm of travel; the 1st to the 99th, 213 mm. With the eyes fixed, everything else is checked from there:

| Check | Limiting user | Representative value | Add for equipment |
|---|---|---|---|
| Roof above the eye point | largest head above the eyes | about 125 mm (99th man) | helmet 30–50 mm, a margin for jolts |
| Knee room from the seat back | longest thighs | buttock–knee 680 mm (99th man) | back armour 25–50 mm pushes the body forward |
| Reach to controls | shortest arms | forward grip reach 646–671 mm (1st–5th woman) | restraint, armour and gloves shorten it |
| Seat and shoulder width | broadest shoulders | bideltoid 545 mm (99th man) | vest, armour, cold-weather clothing |
| Hatches and escape | largest encumbered body | shoulders plus equipment | see [[access-openings]] |
| Seat mass range | lightest and heaviest | about 38–118 kg (1st woman to 99th man) | worn equipment adds 20–30 kg |

**Body armour moves the person.** Plates on the back push the occupant forward by their thickness, taking knee room and moving the eyes; plates on the front meet the controls and the restraint first. Armour, helmets and the bulkiest cold-weather clothing belong in every fitting trial.

### Vehicles
Vision blocks and periscopes fix the eye position; a commander or driver who also works head-out through a hatch needs a seat that rises far enough for both. Rough ground brings whole-body vibration and jolts ([[whole-body-vibration]]), closed hulls bring heat and noise, long hours seated bring stiffness and fatigue. Seats that absorb shocks need free space to move, and an absorber tuned for a mid-size man treats a light occupant more harshly; mass-adjustable seats fix that.

### Aircraft
The design eye position is set by the view over the nose and through a head-up display; controls must be reached with the harness locked, and the legs must clear the panel and canopy in an emergency exit. Ejection seats are qualified for a range of body and helmet mass: in 2015 one new fighter restricted pilots under about 62 kg until its seat and helmet were modified. The US Air Force long limited pilots' stature to 1.63–1.96 m (64–77 in); since 2020 it screens each candidate's body dimensions against the aircraft instead. Helicopter crews sit leaning and twisted for hours, with night-vision goggles on the front of the helmet: back and neck pain are common ([[cockpit-ergonomics]]).

### Ships
Steep ladders, raised sills, low deckheads, narrow passageways, bunks three high and a deck that moves: handholds, non-slip treads and headroom matter more than ashore, and a casualty on a stretcher must pass every hatch and turn of the evacuation route. ASTM F1166 gives marine human-engineering criteria.

### In the simulation
A crew member of any sex and percentile in a vehicle station, with or without helmet and armour. Fit the seat to bring the eyes to the vision block, then read the head, knee and reach checks; below, a force of correlated body sizes shows who the station fits. Add armour and watch knee room vanish for the longest thighs; shorten the seat travel and watch the smallest drop out.

> [!key] Fix the eyes, then fit everything else to the encumbered extremes: head and knee room for the largest, reach for the smallest, seat travel for the whole range — and test it in full equipment.

> [!warn] Percentile tables miss combinations — a short trunk with long legs, a tall body with short arms. Use correlated data, boundary manikins and trials with real crews ([[combining-percentiles]], [[digital-human-models]]).
`,
  ideas: [
    'A crew station is built around a design eye point; the seat adjusts to bring every user\'s eyes there.',
    'Seat travel equals the spread of sitting eye height: about 167 mm for the 5th woman to the 95th man, 213 mm for the 1st to the 99th.',
    'Head room is set by the largest head above the eyes plus the helmet, knee room by the longest thighs plus back armour, reach by the shortest arms.',
    'Body armour pushes the occupant forward and changes every clearance and reach.',
    'Seats and restraints are qualified for a range of occupant mass; light and heavy occupants need adjustable seats.'
  ],
  pitfalls: [
    'Head room is set by the tallest person\'s sitting height — Once the seat lowers large users to the eye point, what matters is the height of the head above the eyes, plus the helmet and a margin.',
    'Armour only adds thickness in front — Back plates push the whole body forward, taking knee room and moving the eyes off the design point.',
    'A stature limit guarantees a cockpit fit — Sitting height, leg length and arm length vary independently of stature; screening the actual dimensions against the actual cockpit works better.'
  ],
  formulas: [
    {
      name: 'Seat height that brings the eyes to the design eye point',
      expr: 's = E - he', tex: 's = E - h_e',
      vars: {
        s: { name: 'seat height above the floor (compressed cushion)', q: 'length', unit: 'mm', tex: 's' },
        E: { name: 'height of the design eye point above the floor', q: 'length', unit: 'mm', value: 1250, tex: 'E' },
        he: { name: 'sitting eye height of the user', q: 'length', unit: 'mm', value: 686, tex: 'h_e' }
      },
      note: 'Representative sitting eye height: 740 ± 33 mm (women), 795 ± 35 mm (men). Add helmet or cushion effects if they change the eye position.',
      stories: { s: 'The design eye point is {E} above the floor. How high must the seat be for a user whose sitting eye height is {he}?', he: 'A seat at {s} brings a user\'s eyes to a design eye point {E} above the floor. What is the user\'s sitting eye height?' }
    },
    {
      name: 'Seat travel for a design range',
      expr: 'dS = (em + z*sem) - (ef - z*sef)', tex: '\\Delta s = (\\mu_m + z\\,\\sigma_m) - (\\mu_f - z\\,\\sigma_f)',
      vars: {
        dS: { name: 'vertical seat travel needed', q: 'length', unit: 'mm', tex: '\\Delta s' },
        em: { name: 'men\'s mean sitting eye height', q: 'length', unit: 'mm', value: 795, tex: '\\mu_m' },
        sem: { name: 'men\'s standard deviation', q: 'length', unit: 'mm', value: 35, tex: '\\sigma_m' },
        ef: { name: 'women\'s mean sitting eye height', q: 'length', unit: 'mm', value: 740, tex: '\\mu_f' },
        sef: { name: 'women\'s standard deviation', q: 'length', unit: 'mm', value: 33, tex: '\\sigma_f' },
        z: { name: 'standard normal value of the range (1.645 for 5th–95th, 2.326 for 1st–99th)', q: 'none', value: 1.645, tex: 'z' }
      },
      note: 'From the smallest woman to the largest man of the design range.',
      stories: { dS: 'Sitting eye height is {em} ± {sem} for men and {ef} ± {sef} for women. How much seat travel covers the range at z = {z}?' }
    },
    {
      name: 'Roof above the design eye point',
      expr: 'Hr = v + ah + m', tex: 'H_r = v + a_h + m',
      vars: {
        Hr: { name: 'roof or canopy above the design eye point', q: 'length', unit: 'mm', tex: 'H_r' },
        v: { name: 'height of the top of the head above the eyes, largest user', q: 'length', unit: 'mm', value: 123, tex: 'v' },
        ah: { name: 'helmet allowance (shell and pads)', q: 'length', unit: 'mm', value: 40, tex: 'a_h' },
        m: { name: 'margin for posture changes and jolts', q: 'length', unit: 'mm', value: 50, tex: 'm' }
      },
      note: 'For a seat that brings every user\'s eyes to the same point. Rough ground and energy-absorbing seats need more margin.',
      stories: { Hr: 'The largest crew member\'s head rises {v} above the eyes, the helmet adds {ah} and the margin is {m}. How far above the design eye point must the roof be?' }
    }
  ],
  examples: [
    {
      title: 'How far must the seat move?',
      q: 'Sitting eye height is 795 ± 35 mm (men) and 740 ± 33 mm (women). A vision block puts the design eye point 1250 mm above the floor. What seat heights and travel does the 5th woman to the 95th man need? And the 1st to the 99th?',
      steps: [
        '5th-percentile woman: $740 - 1.645 \\times 33 = 686$ mm, so the seat must be at $1250 - 686 = 564$ mm.',
        '95th-percentile man: $795 + 1.645 \\times 35 = 853$ mm, so the seat must be at $1250 - 853 = 397$ mm.',
        'Travel: $564 - 397 = 167$ mm. For the 1st woman (663 mm) and 99th man (876 mm): 374–587 mm, 213 mm of travel.'
      ],
      a: 'About 397–564 mm (167 mm of travel); 374–587 mm (213 mm) for the 1st to the 99th percentile.'
    },
    {
      title: 'Head room with a helmet',
      q: 'In the same station the largest crew member\'s head rises about 123 mm above the eyes (99th-percentile man: sitting height 999 mm less eye height 876 mm). The helmet adds 40 mm and a 50 mm margin allows for jolts. How high must the roof be above the floor?',
      steps: [
        'Above the eye point: $123 + 40 + 50 = 213$ mm.',
        'Above the floor: $1250 + 213 = 1463$ mm.',
        'Note what did *not* matter: the 99th-percentile sitting height itself. Because the seat lowers large users to the eye point, the head above the eyes sets the roof.'
      ],
      a: 'About 213 mm above the eye point, 1463 mm above the floor.'
    }
  ],
  quiz: [
    { q: 'In a crew station built around a design eye point, what does the seat\'s vertical travel compensate for?', choices: ['Differences in sitting eye height', 'Differences in stature only', 'Differences in body mass', 'The thickness of the helmet'], a: 0, why: 'The seat brings each person\'s eyes to the same point, so its travel must equal the spread of sitting eye height across the design range.' },
    { q: 'A crew member puts on back armour 40 mm thick. What changes most?', choices: ['Knee room and eye position: the body moves forward', 'Head room', 'Nothing — armour is on the back', 'The reach to the pedals increases greatly'], a: 0, why: 'The back plate pushes the occupant forward by its thickness, taking knee room and moving the eyes off the design point.' },
    { q: 'A cockpit that fits pilots from 1.63 to 1.96 m tall fits every pilot in that height range.', a: false, why: 'Sitting height, leg length and arm length vary independently of stature; a tall pilot with a long trunk may hit the canopy while one with short arms cannot reach.' },
    { q: 'Why can a shock-absorbing seat tuned for a mid-size man treat a light occupant more harshly?', choices: ['Its fixed stroking force gives a lighter body a larger deceleration', 'Light people sit lower', 'The seat is heavier', 'Light occupants wear less armour'], a: 0, why: 'For a fixed force $F$, the deceleration is $F/m$: halve the mass and it doubles. Mass-adjustable absorbers match the force to the occupant.' },
    { q: 'Sitting eye height is 795 ± 35 mm (men), 740 ± 33 mm (women). How much seat travel (mm) covers the 5th woman to the 95th man?', answer: 167, unit: 'mm', why: '$(795 + 1.645 \\times 35) - (740 - 1.645 \\times 33) = 853 - 686 = 167$ mm.' }
  ],
  problems: [
    { q: 'The design eye point is 1200 mm above the floor. Women\'s sitting eye height is 740 ± 33 mm. What seat height does the 5th-percentile woman need?', answer: 514, unit: 'mm', tol: 0.01, steps: ['Her eye height: $740 - 1.645 \\times 33 = 686$ mm.', 'Seat: $1200 - 686 = 514$ mm.'] },
    { q: 'What vertical seat travel covers the 1st-percentile woman to the 99th-percentile man, with sitting eye heights 740 ± 33 mm and 795 ± 35 mm?', answer: 213, unit: 'mm', tol: 0.01, steps: ['99th man: $795 + 2.326 \\times 35 = 876$ mm.', '1st woman: $740 - 2.326 \\times 33 = 663$ mm.', 'Travel $876 - 663 = 213$ mm.'] }
  ],
  ranges: [
    { dim: 'Vertical seat travel to bring every user\'s eyes to one design eye point', range: [167, 213], unit: 'mm', who: '5th-percentile woman to 95th-percentile man (167 mm); 1st to 99th (213 mm): the spread of sitting eye height', why: 'Everyone sees through the same vision block, sight or window without craning or slumping.', limits: 'Head-out positions, helmets that move the eyes and cushions that compress change it; the real force\'s data govern.', setting: ['military', 'vehicle'], src: 'Representative sitting eye heights; the method of MIL-STD-1472 and MIL-STD-1333' },
    { dim: 'Roof or canopy above the design eye point, with a helmet', range: [200, 230], unit: 'mm', who: 'The largest head above the eyes (about 125 mm, 99th-percentile man) plus 30–50 mm of helmet and a margin', why: 'The helmet clears the roof when the vehicle jolts, and heads can turn and nod.', limits: 'Rough ground, helmet-mounted devices and energy-absorbing seats need more; measure the real helmet.', setting: ['military', 'vehicle'], src: 'Derived from representative body data; check against MIL-STD-1472 and trials' },
    { dim: 'Knee room: seat back (rearmost) to the panel at knee height', range: [710, 760], unit: 'mm', who: '95th to 99th-percentile man (buttock–knee 659–680 mm) plus 25–50 mm of back armour and a margin', why: 'The knees clear the panel and can move; legs clear it in an emergency exit.', limits: 'Seat travel and armour thickness change it; very long-legged users need more.', setting: ['military', 'vehicle'], src: 'Derived from representative body data' },
    { dim: 'Occupant mass range for seats and restraints', range: [38, 118], unit: 'kg', who: '1st-percentile woman to 99th-percentile man, before 20–30 kg of worn equipment', why: 'Shock-absorbing and ejection seats and their restraints protect light and heavy occupants alike.', limits: 'Fixed absorbers tuned to the middle treat the ends harshly; mass-adjustable seats or restrictions follow.', setting: ['military', 'vehicle'], src: 'Representative body mass; seat qualification requirements' },
    { dim: 'Pilot stature once used as a screening limit (US Air Force, until 2020)', range: [1626, 1956], unit: 'mm', who: '64–77 in', why: 'A simple proxy for fitting the cockpits of the time.', limits: 'Stature is a poor proxy for sitting height, leg and arm length; replaced by screening each person against each aircraft.', setting: 'military', src: 'US Air Force pilot standards (before 2020)' },
    { dim: 'Crew whole-body vibration, daily exposure A(8)', range: [null, 0.5], unit: 'm/s²', who: 'Drivers and crews on rough ground', why: 'The EU action value: below it, low-back risk from vibration is low.', limits: 'Many off-road and military vehicles exceed it; the limit value is 1.15 m/s²; suspension seats, speed, routes and crew rotation reduce it; national rules for armed forces vary.', setting: ['military', 'vehicle'], src: 'Directive 2002/44/EC; ISO 2631-1' }
  ],
  applications: [
    'Vehicle crew stations with seats that travel far enough for both closed-hatch and head-out positions.',
    'Cockpits checked with boundary manikins and pilots screened against each aircraft\'s geometry.',
    'Mass-adjustable shock-absorbing seats for crews of every size.',
    'Ship design with stretcher routes through hatches and ladders, and headroom for tall crew.'
  ],
  sources: [
    'MIL-STD-1472, *Department of Defense Design Criteria Standard: Human Engineering*, sections on workspace and anthropometry.',
    'MIL-STD-1333, *Aircrew Station Geometry for Military Aircraft* (US Department of Defense).',
    'ASTM F1166, *Standard Practice for Human Engineering Design for Marine Systems, Equipment, and Facilities*.',
    'ISO 2631-1, *Mechanical vibration and shock — Evaluation of human exposure to whole-body vibration*.',
    'C. C. Gordon et al., *2012 Anthropometric Survey of U.S. Army Personnel* (ANSUR II), 2014.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, chapters on seating and vehicle workspaces.'
  ],
  sim: ['mf-crew-station', 'mf-hsi-crowd']
},

{
  id: 'personal-equipment-fit', parent: 'military-topic', title: 'Fitting helmets, armour and equipment', level: 2,
  short: 'Worn equipment is fitted twice: to each body, by sizes and adjustment, and to the whole force, by the size tariff — the share of each size to buy, drawn from the users\' own body data. Sizes built on men\'s data leave women with helmets, armour, gloves and boots that do not fit.',
  keywords: ['sizing system', 'size tariff', 'size roll', 'helmet fit', 'head circumference', 'body armour fit', 'plate carrier', 'women\'s body armour', 'gloves', 'boots', 'lasts', 'clothing sizes', 'head-supported mass', 'fit trial', 'ISO 8559', 'EN 13402'],
  prereq: ['hand-foot-head', 'clothing-ppe-allowances', 'sex-differences'],
  related: ['military-human-factors', 'crew-stations', 'load-carriage', 'ppe-ergonomics', 'percentiles', 'population-differences', 'user-trials-mockups', 'hearing-protection', 'static-muscle-work', 'extreme-environments'],
  body: `
Helmets, body armour, load-carriage vests, gloves, boots and clothing are worn, not operated. Each item must fit one body well enough to protect it without hurting it, and the whole stock must fit a whole force. Ergonomics decides the key dimensions, the number and width of sizes, the adjustment within each size — and how many of each to buy, the **size tariff**.

### Sizing systems
| Item | Key dimension(s) | Adjustment within a size |
|---|---|---|
| Helmet | head circumference (and length and breadth) | pad kits, harness, chin strap |
| Body armour | chest circumference and torso length | side straps, cummerbund, shoulders |
| Vest, pack | torso length, waist | torso setting, hip belt |
| Clothing | stature, chest, waist, inside leg | cuffs, drawcords |
| Gloves | hand circumference and length | wrist closure |
| Boots | foot length and breadth | laces, insoles |

With head circumference of 575 ± 15 mm for men and 550 ± 15 mm for women, the 1st-percentile woman to the 99th-percentile man spans about 515–610 mm. Pads take up about ±10 mm, so each helmet size can cover a band of about 20–25 mm, and four or five sizes cover the force.

### The tariff
The share of each size to buy is the share of the force whose key dimension falls in each band — a [[?probability]] under the [[?gaussian|normal curves]] of the actual users. For a force of 85 % men, four 25 mm helmet bands (512–537, 537–562, 562–587 and 587–612 mm) need about 3 %, 25 %, 54 % and 18 % of the stock; with equal numbers of men and women, about 10 %, 39 %, 40 % and 11 %. A tariff drawn from men's data alone buys about a sixth of the small helmets a force with 15 % women needs — and the women get helmets that are too big, tip over the eyes and shift on impact.

**More sizes fit better but cost more**: each size must be stocked everywhere and tried in trials. Adjustment within a size is the cheaper way to cover the gaps; a trial of the whole ensemble is the only way to be sure.

### Helmets
A helmet must sit level and stable, its front edge just above the eyebrows, the pads touching all round, the straps snug. It must stay put when the wearer looks up, lies prone with an armour collar pushing at its back edge, or turns in a seat. Head shape matters as well as size: a helmet built on one population's head form can press or rock on another's. Visors, hearing protection, radios, night-vision devices and counterweights all add mass that the neck carries all day, and mass hung at the front adds a moment the neck muscles must hold ([[static-muscle-work]]).

### Body armour
Armour trades coverage against mobility, heat and weight — plates and carrier commonly weigh 10–15 kg. A plate too long digs into the thighs when seated and blocks bending; one too wide hampers the arms. Armour cut for men's torsos rides up, presses and gapes on many women, who are on average shorter in the torso; since the 2010s several forces have introduced armour designed and sized for women. Armour also stops sweat evaporating from much of the torso ([[extreme-environments]]).

### Gloves, boots and clothing
Gloves follow hand circumference and length: too big and dexterity suffers, too small and circulation does. Boots built on men's lasts and scaled down fit many women poorly, and blisters follow ([[load-carriage]]). Clothing needs short, regular and long lengths in each chest size.

### In the simulation
Choose an item and a force; set the number of sizes, their width and the share of women, and see the tariff, who falls between sizes, and how many of each to order.

### Settings
Military: issued equipment, a mixed force, decades of service. Police and security: armour for officers of every size. Fire and rescue: helmets and breathing apparatus. Industry: hard hats, gloves and boots ([[ppe-ergonomics]]).

> [!key] Size worn equipment from the actual force's data, buy the tariff that data gives, provide adjustment within each size, and try the whole ensemble on people of every size.
`,
  ideas: [
    'A sizing system picks one or two key dimensions, a number of sizes and the adjustment within each size.',
    'The size tariff is the share of the force in each size band, read from the force\'s own body data.',
    'A tariff built on men\'s data leaves too few small sizes, and women end up in equipment that does not fit.',
    'Helmets must be stable in every posture, and front-mounted mass loads the neck.',
    'Body armour must match torso length and shape; several forces now size armour for women.'
  ],
  pitfalls: [
    'If the size range covers everyone, the stock will too — The tariff decides how many of each size exist; with too few small sizes, small people get large ones.',
    'Women can wear small men\'s sizes — Scaled-down men\'s helmets, armour, gloves and boots do not match women\'s proportions: torso length, chest shape, hand and foot shape differ.',
    'More sizes are always better — Each size adds cost, stock and logistics; adjustment within fewer sizes often fits as well.'
  ],
  formulas: [
    {
      name: 'Share of a mixed force up to a size limit (building the tariff)',
      expr: 'F = w*ncdf((b - mm)/sm) + (1 - w)*ncdf((b - mf)/sf)',
      tex: 'F = w\\,\\Phi\\!\\left(\\dfrac{b - \\mu_m}{\\sigma_m}\\right) + (1 - w)\\,\\Phi\\!\\left(\\dfrac{b - \\mu_f}{\\sigma_f}\\right)',
      vars: {
        F: { name: 'share of the force at or below the limit', q: 'ratio', unit: '%', tex: 'F' },
        w: { name: 'share of men', q: 'ratio', unit: '%', value: 85, min: 0, max: 100, tex: 'w' },
        b: { name: 'upper edge of a size band', q: 'length', unit: 'mm', value: 562, tex: 'b' },
        mm: { name: 'men\'s mean', q: 'length', unit: 'mm', value: 575, tex: '\\mu_m' },
        sm: { name: 'men\'s standard deviation', q: 'length', unit: 'mm', value: 15, tex: '\\sigma_m' },
        mf: { name: 'women\'s mean', q: 'length', unit: 'mm', value: 550, tex: '\\mu_f' },
        sf: { name: 'women\'s standard deviation', q: 'length', unit: 'mm', value: 15, tex: '\\sigma_f' }
      },
      note: 'The share in one size is the difference between its upper and lower edges: for 537–562 mm, 28.24 % − 3.38 % = 24.86 % of a force of 85 % men. Representative head circumference: 575 ± 15 mm (men), 550 ± 15 mm (women). Multiply by the number ordered to get the stock.',
      stories: { F: 'A force is {w} men. Head circumference is {mm} ± {sm} for men and {mf} ± {sf} for women. What share of the force has a head no larger than {b}?', b: 'A force is {w} men (head {mm} ± {sm}; women {mf} ± {sf}). Below what head circumference are {F} of the force?' }
    }
  ],
  examples: [
    {
      title: 'A tariff for 10 000 helmets',
      q: 'A force of 85 % men orders 10 000 helmets in four sizes of 25 mm: 512–537, 537–562, 562–587 and 587–612 mm of head circumference (men 575 ± 15 mm, women 550 ± 15 mm). How many of each? What if the tariff had been drawn from men\'s data only?',
      steps: [
        'Men: 0.6 %, 18.7 %, 59.5 % and 20.5 % of men fall in the four bands; women: 18.7 %, 59.5 %, 20.5 % and 0.7 %.',
        'Mixed: $0.85 \\times 0.6 + 0.15 \\times 18.7 = 3.3$ %, then 24.9 %, 53.7 % and 17.5 % — about 330, 2490, 5370 and 1750 helmets; some 60 people fall outside all four sizes.',
        'From men\'s data only, the small size would be 0.6 %: 60 helmets instead of 330. About 270 people — nearly all of them women — would get a helmet one size too big.'
      ],
      a: 'About 330 S, 2490 M, 5370 L and 1750 XL; a men-only tariff buys about a sixth of the small helmets needed.'
    },
    {
      title: 'How many sizes?',
      q: 'The helmets must fit the 1st-percentile woman to the 99th-percentile man. Pads adjust each size by ±10 mm. How many sizes are needed?',
      steps: [
        '1st-percentile woman: $550 - 2.326 \\times 15 = 515$ mm. 99th-percentile man: $575 + 2.326 \\times 15 = 610$ mm.',
        'The span is 95 mm. With ±10 mm of pads a size covers about 20 mm, so five sizes; with thicker pad options covering 25 mm, four.',
        'Check the combination of circumference with head length and breadth in a trial: two heads of equal circumference can have different shapes.'
      ],
      a: 'Four or five sizes for 515–610 mm of head circumference.'
    }
  ],
  quiz: [
    { q: 'What is a size tariff?', choices: ['The share of each size to buy, from the users\' body data', 'The price of each size', 'The list of sizes a maker offers', 'The tolerance of a size label'], a: 0, why: 'A tariff turns the distribution of the key dimension in the actual population into quantities of each size.' },
    { q: 'A helmet stock for a force with 15 % women is bought from men\'s data. What happens?', choices: ['Too few small helmets: many women get helmets that are too big', 'Too many small helmets', 'Nothing — helmets are adjustable', 'The men\'s helmets are too small'], a: 0, why: 'Men\'s data put under 1 % in the smallest size; the mixed force needs over 3 %, most of them women.' },
    { q: 'More sizes always give a better-fitting and better-value stock.', a: false, why: 'Fit improves, but every size adds stock, logistics and trials; adjustment within fewer sizes is often the better compromise.' },
    { q: 'Why does armour cut for men\'s torsos fit many women poorly?', choices: ['Women are on average shorter in the torso and differently shaped at the chest', 'Women\'s armour must be heavier', 'Women do not wear load-carriage vests', 'Men\'s armour is too thin'], a: 0, why: 'Torso length and chest shape set plate position and carrier shape; a scaled men\'s design rides up, presses and gapes.' },
    { q: 'Women\'s head circumference is 550 ± 15 mm. What is the 1st percentile (mm)?', answer: 515, unit: 'mm', why: '$550 - 2.326 \\times 15 = 515$ mm.' }
  ],
  problems: [
    { q: 'Women\'s head circumference is 550 ± 15 mm. What share of women falls in the 537–562 mm helmet size?', answer: 59.5, unit: '%', tol: 0.01, steps: ['$z$ from $(537 - 550)/15 = -0.87$ to $(562 - 550)/15 = 0.80$.', '$\\Phi(0.80) - \\Phi(-0.87) = 0.788 - 0.193 = 0.595$.'] },
    { q: 'A force of 20 000 is 30 % women. Head circumference: men 575 ± 15 mm, women 550 ± 15 mm. How many helmets of the smallest size (512–537 mm) does it need?', answer: 1203, tol: 0.02, steps: ['Women in the band: 18.7 % of 6000 = 1124.', 'Men in the band: 0.56 % of 14 000 = 79.', 'Total about 1203.'] }
  ],
  ranges: [
    { dim: 'Head circumference a helmet range must fit', range: [515, 610], unit: 'mm', who: '1st-percentile woman to 99th-percentile man (representative data)', why: 'Every member of a mixed force can be issued a helmet that fits.', limits: 'Head length, breadth and shape vary too; populations differ; the force\'s own data govern.', setting: 'military', src: 'Representative data in the spirit of ANSUR II; ISO 7250-1 definitions' },
    { dim: 'Width of a helmet size band (with pad adjustment)', range: [20, 25], unit: 'mm', who: 'About ±10 mm taken up by pads', why: 'Four or five sizes then cover the whole force with a stable fit.', limits: 'Wider bands rely on thicker pads, which raise the helmet and change its stability.', setting: ['military', 'field'], src: 'Derived from representative head data' },
    { dim: 'Hand length a glove range must fit', range: [155, 215], unit: 'mm', who: '1st-percentile woman to 99th-percentile man', why: 'Nobody works in gloves that are too long (clumsy) or too short (tight).', limits: 'Hand circumference and finger length matter as well; tactile and dexterity demands vary by task.', setting: ['military', 'field'], src: 'Representative data; EN ISO 21420 glove sizes' },
    { dim: 'Foot length a boot range must fit', range: [217, 298], unit: 'mm', who: '1st-percentile woman to 99th-percentile man', why: 'Boots for everyone, including the smallest women, without scaled-down men\'s lasts.', limits: 'Width and heel shape differ between women and men; half sizes and width fittings help.', setting: ['military', 'field'], src: 'Representative data' },
    { dim: 'Size tariff', range: 'the share of the force in each size band, from the force\'s own data', who: 'The actual users: women and men, their nations and ages', why: 'Stock matches people; nobody makes do with the wrong size.', limits: 'Must be updated as the force changes; check with issue records and trials.', setting: ['military', 'field'], src: 'ISO 15535 (anthropometric databases); Pheasant and Haslegrave, *Bodyspace*' }
  ],
  applications: [
    'Helmet, armour and uniform tariffs drawn from anthropometric surveys of the actual force.',
    'Armour, boots and packs designed for women\'s proportions rather than scaled from men\'s.',
    'Fitting stations and trained fitters at the point of issue.',
    'Checking which sizes a population needs with [the body-size explorer](#/tools/bodysize/explorer).'
  ],
  sources: [
    'ISO 8559-1, *Size designation of clothes — Part 1: Anthropometric definitions for body measurement*.',
    'EN 13402, *Size designation of clothes*.',
    'EN ISO 21420, *Protective gloves — General requirements and test methods* (glove sizes).',
    'ISO 15535, *General requirements for establishing anthropometric databases*.',
    'C. C. Gordon et al., *2012 Anthropometric Survey of U.S. Army Personnel* (ANSUR II), 2014.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, chapters on clothing and sizing.'
  ],
  sim: 'mf-size-tariff'
},

{
  id: 'extreme-environments', parent: 'military-topic', title: 'Heat, cold, altitude and protective suits', level: 2,
  short: 'Military and field work go wherever the task is: desert heat, arctic cold, thin air at altitude and sealed protective suits. Ergonomics sets the working limits — core temperature below about 38–38.5 °C, WBGT reference values, hands warm enough to work, a slow ascent — and plans clothing, water, rest and acclimatisation to keep people inside them.',
  keywords: ['heat stress', 'cold stress', 'altitude', 'hypoxia', 'protective suit', 'CBRN', 'MOPP', 'WBGT', 'clothing adjustment value', 'heat storage', 'core temperature', 'acclimatisation', 'wind chill', 'frostbite', 'dexterity in the cold', 'IREQ', 'barometric pressure', 'aerobic capacity', 'acute mountain sickness', 'microclimate cooling'],
  prereq: ['heat-stress', 'cold-stress', 'thermal-comfort'],
  related: ['load-carriage', 'personal-equipment-fit', 'sustained-operations', 'outdoor-heat-sun', 'ppe-ergonomics', 'work-rest-scheduling', 'confined-spaces', 'field-computing', 'medicine:thermoregulation', 'medicine:heat-cold', 'medicine:oxygen-transport', 'aerodynamics:isa'],
  body: `
Military and field work happen wherever the task is: in desert heat, arctic cold, thin air at altitude, and sometimes inside suits that cut the body off from the air around it. Ergonomics cannot change the climate; it sets the limits of work, chooses clothing and equipment, and plans time, water, rest and acclimatisation to keep people within the body's range. The physiology is in [[medicine:thermoregulation|body temperature and fever]]; this page gives the working limits.

### The heat balance
The heat made by working muscles must leave the body, or it is stored and the body warms:
$$S = M - W - (C + R) - E - (C_{res} + E_{res})$$
with $M$ the metabolic rate, $W$ external work, $C + R$ convection and radiation, $E$ evaporation of sweat and the last bracket the losses by breathing. When the air is hotter than the skin, only sweating removes heat — so clothing that stops sweat evaporating lets the storage $S$ grow and the core temperature climb about $S/(m\\,c)$: 150 W stored in a 75 kg body raises it about 2 °C an hour. In the cold, $C + R$ is large, and clothing insulation must hold it down to what the body makes.

| Environment | What limits work | Key numbers |
|---|---|---|
| Heat | core temperature, dehydration | core below about 38–38.5 °C; WBGT reference values of 25–33 °C by work rate (ISO 7243) |
| Protective suits | evaporation blocked | add a few degrees to the WBGT for armour and double layers, around 10 °C for vapour-tight suits |
| Cold | cooling of the hands and exposed skin | dexterity falls below about 15 °C skin temperature; skin can freeze in 10–30 min below about −28 °C wind chill |
| Altitude | oxygen | about 70 kPa at 3000 m and 54 kPa at 5000 m; aerobic capacity down roughly 7–10 % per 1000 m above about 1000 m |

### Heat
Acclimatisation takes 7–14 days of progressive work in the heat: sweating starts sooner and heavier, the heart rate falls. NIOSH advises new workers to start at no more than 20 % of the usual time in the heat and add no more than 20 % a day. The wet-bulb globe temperature sets work–rest cycles ([[heat-stress]], [the heat-stress calculator](#/tools/environment/heat)). Drink small amounts often, about 0.25 L every 15–20 minutes; US Army guidance caps intake at about 1.4 L an hour, because drinking far beyond sweat loss dilutes the blood's sodium. Loads add heat production ([[load-carriage]]).

### Protective suits
Suits against chemical, biological, radiological and nuclear hazards, and vapour-tight suits in industry, trap heat and sweat. US Army heat guidance has long added roughly 3 °C (5 °F) to the WBGT for body armour and 6 °C (10 °F) for the full protective ensemble; for vapour-barrier suits the clothing adjustment reaches about 10 °C or more (ACGIH; ISO 7243:2017). In hot weather, people in full suits may manage only tens of minutes of hard work — and the mask, gloves and hood also cost vision, dexterity, hearing and speech. Cooling vests, shade and strict work–rest cycles extend the time.

### Cold
The hands fail first: dexterity falls sharply once finger skin cools below about 15 °C, and touch fades below about 8 °C. Required clothing insulation (the IREQ of ISO 11079) grows as the air cools, the wind rises and the work eases: moderate work at −10 °C in a wind needs about 2 clo, while people who sit still — sentries, drivers, those waiting — need far more and get cold first. Gloves trade warmth for dexterity; mitts are warmest. Metal and fuel at −30 °C freeze skin on contact. Batteries and screens slow down too ([[field-computing]]). See [[cold-stress]] and [the cold calculator](#/tools/environment/cold).

### Altitude
At 3000 m the pressure is about 70 kPa, so each breath carries about 30 % less oxygen ([[aerodynamics:isa|the standard atmosphere]], [[medicine:oxygen-transport|oxygen transport]]). Saturation and aerobic capacity fall — roughly a quarter less at 4000 m — and the same march takes a larger share of capacity. Acute mountain sickness can appear above about 2500 m; above about 3000 m, guidance is to raise the sleeping altitude by no more than 300–500 m a day, with a rest day every three to four days. Cold, wind and UV grow with altitude.

### In the simulations
In the first, a person works in heat or cold in the clothing you choose; arrows show the heat flows and the graph the body temperature over time — put on armour or a protective suit at 35 °C and watch it climb. In the second, climb a mountain and see the pressure, the oxygen, the estimated saturation and the share of capacity a loaded march takes.

> [!warn] Heat stroke (confusion, collapse, hot skin), hypothermia (confusion, shivering that stops) and severe altitude illness (breathless at rest, confused, unsteady) are emergencies: stop the work, get help — call your local emergency number — and give first aid ([[medicine:heat-cold|heatstroke and hypothermia]]).

> [!key] Work within the body's balance: plan heat by WBGT, clothing and acclimatisation; cold by insulation, wind and the hands; altitude by the oxygen available — with time, water, rest, and a way to warm up or cool down.
`,
  ideas: [
    'Heat that cannot leave the body is stored: 150 W stored in a 75 kg body raises its temperature about 2 °C an hour.',
    'In the heat only sweat evaporation removes heat; armour and protective suits block it and add several degrees to the effective WBGT.',
    'In the cold the hands fail first; the required insulation rises as work slows, so resting people get cold first.',
    'At altitude the pressure, the oxygen in each breath and aerobic capacity fall; ascend slowly.',
    'Acclimatisation, water, rest, shade or shelter and work–rest cycles keep people within their limits.'
  ],
  pitfalls: [
    'Body armour is only a weight problem — It also stops sweat evaporating from much of the torso, which in the heat matters as much as its mass.',
    'Drink as much water as possible in the heat — Drinking far beyond sweat loss dilutes the blood\'s sodium; small amounts often, up to about 1.4 L an hour, is the guidance.',
    'Fit people do not need to acclimatise to heat or altitude — Fitness helps, but acclimatisation takes one to two weeks for heat and days to weeks for altitude, whoever you are.'
  ],
  formulas: [
    {
      name: 'Effective WBGT outdoors, with a clothing adjustment',
      expr: 'Wb = 0.7*tnw + 0.2*tg + 0.1*ta + cav', tex: '\\mathrm{WBGT} = 0.7\\,t_{nw} + 0.2\\,t_g + 0.1\\,t_a + \\mathrm{CAV}',
      vars: {
        Wb: { name: 'effective wet-bulb globe temperature', q: 'temperature', unit: '°C', tex: '\\mathrm{WBGT}' },
        tnw: { name: 'natural wet-bulb temperature', q: 'temperature', unit: '°C', value: 24, tex: 't_{nw}' },
        tg: { name: 'black-globe temperature', q: 'temperature', unit: '°C', value: 38, tex: 't_g' },
        ta: { name: 'air temperature', q: 'temperature', unit: '°C', value: 31, tex: 't_a' },
        cav: { name: 'clothing adjustment value (0 work clothes; about 3 armour; about 6 protective suit)', q: 'dtemp', unit: '°C', value: 6, tex: '\\mathrm{CAV}' }
      },
      note: 'ISO 7243: outdoors in sunshine 0.7 t_nw + 0.2 t_g + 0.1 t_a (indoors 0.7 t_nw + 0.3 t_g). Compare with the reference value for the work rate: about 33 °C resting to 25 °C for very heavy work, acclimatised.',
      stories: { Wb: 'Outdoors the natural wet bulb reads {tnw}, the globe {tg} and the air {ta}. A protective suit adds {cav}. What is the effective WBGT?' }
    },
    {
      name: 'How fast stored heat warms the body',
      expr: 'r = 3600*S/(m*c)', tex: 'r = \\frac{3600\\,S}{m\\,c}',
      vars: {
        r: { name: 'rise of body temperature', q: false, unit: '°C/h', tex: 'r' },
        S: { name: 'heat stored (production minus losses)', q: false, unit: 'W', value: 150, tex: 'S' },
        m: { name: 'body mass', q: false, unit: 'kg', value: 75, tex: 'm' },
        c: { name: 'specific heat of the body', q: false, unit: 'J/(kg·K)', value: 3490, tex: 'c' }
      },
      note: 'The mean body temperature; the core follows. 3600 converts seconds to hours.',
      stories: { r: 'A {m} person stores {S} of heat (specific heat {c}). How fast does body temperature rise?', S: 'Body temperature of a {m} person rises {r}. How much heat is being stored?' }
    },
    {
      name: 'Air pressure at altitude (standard atmosphere)',
      expr: 'p = p0*(1 - 0.0000225577*h)^5.25588', tex: 'p = p_0\\left(1 - 2.256 \\times 10^{-5}\\,h\\right)^{5.256}',
      vars: {
        p: { name: 'air pressure', q: 'pressure', unit: 'kPa', tex: 'p' },
        p0: { name: 'sea-level pressure', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_0' },
        h: { name: 'altitude (in m in the formula)', q: 'length', unit: 'm', value: 3000, min: 0, max: 11000, tex: 'h' }
      },
      note: 'The International Standard Atmosphere up to 11 km. Real pressure varies with weather and latitude by a few per cent.',
      stories: { p: 'What is the standard air pressure at {h}?', h: 'At what altitude is the standard pressure {p}?' }
    },
    {
      name: 'Oxygen pressure in the air breathed in',
      expr: 'pO2 = 0.2095*(p - pw)', tex: 'P_{IO_2} = 0.2095\\,(p - p_w)',
      vars: {
        pO2: { name: 'inspired oxygen partial pressure', q: 'pressure', unit: 'kPa', tex: 'P_{IO_2}' },
        p: { name: 'air pressure', q: 'pressure', unit: 'kPa', value: 70.1, tex: 'p' },
        pw: { name: 'water vapour pressure in the airways at 37 °C', q: 'pressure', unit: 'kPa', value: 6.27, tex: 'p_w' }
      },
      note: 'Oxygen is 20.95 % of dry air at every altitude; what falls is the pressure. Sea level: about 19.9 kPa (150 mmHg).',
      stories: { pO2: 'The air pressure is {p} and the airways add {pw} of water vapour. What is the inspired oxygen pressure?' }
    }
  ],
  examples: [
    {
      title: 'How long until 38.5 °C?',
      q: 'A 75 kg soldier in body armour does moderate work at 35 °C. Sweat can evaporate only from part of the body, and 150 W of heat is stored. Starting at 37.0 °C, how long until the body reaches 38.5 °C?',
      steps: [
        { text: 'Rate of rise:', tex: 'r = \\frac{3600 \\times 150}{75 \\times 3490} = 2.06\\ ^\\circ\\mathrm{C/h}' },
        'Time for 1.5 °C: $1.5/2.06 = 0.73$ h, about 44 minutes.',
        'So the work–rest cycle must include cooling rests well within that — or the stored heat must be cut by lighter work, shade, ventilation or cooling vests.'
      ],
      a: 'About 44 minutes.'
    },
    {
      title: 'Oxygen at 3000 m',
      q: 'What are the air pressure and the inspired oxygen pressure at 3000 m, compared with sea level?',
      steps: [
        'Pressure: $101.3 \\times (1 - 2.256 \\times 10^{-5} \\times 3000)^{5.256} = 70.1$ kPa.',
        'Inspired oxygen: $0.2095 \\times (70.1 - 6.27) = 13.4$ kPa, against $0.2095 \\times (101.3 - 6.27) = 19.9$ kPa at sea level.',
        'That is a third less oxygen pressure in the lungs to drive oxygen into the blood — the reason for slower marches, longer rests and a slow ascent.'
      ],
      a: 'About 70 kPa and 13.4 kPa, against 101 kPa and 19.9 kPa at sea level.'
    },
    {
      title: 'A protective suit on a warm day',
      q: 'The natural wet bulb reads 24 °C, the globe 38 °C and the air 31 °C, in sunshine. Soldiers in full protective suits (clothing adjustment about 6 °C) do moderate work, whose reference value is 28 °C for acclimatised people. Compare.',
      steps: [
        'WBGT: $0.7 \\times 24 + 0.2 \\times 38 + 0.1 \\times 31 = 27.5$ °C — just within the reference in ordinary clothing.',
        'In the suits: $27.5 + 6 = 33.5$ °C, 5.5 °C over the reference.',
        'Work must be much lighter, far shorter, with rests in shade and cooling — the suit, not the weather, is the main hazard.'
      ],
      a: 'An effective WBGT of about 33.5 °C, well above the 28 °C reference.'
    }
  ],
  quiz: [
    { q: 'Why does body armour raise heat strain even though it adds little insulation?', choices: ['It stops sweat evaporating from much of the torso', 'It reflects sunlight onto the skin', 'It makes people breathe faster', 'It lowers the air temperature inside'], a: 0, why: 'In the heat, evaporation is the main way heat leaves the body; covering the torso with an impermeable layer removes much of it.' },
    { q: 'At 3000 m the air pressure is about 70 kPa. The oxygen in each breath, compared with sea level, is about…', choices: ['30 % less', 'The same — air is still 21 % oxygen', '70 % less', '10 % more, because the air is colder'], a: 0, why: 'The fraction of oxygen is unchanged, but the pressure is about 70 % of sea level, so each breath carries about 30 % less oxygen.' },
    { q: 'In the heat it is always safe to drink as much water as possible.', a: false, why: 'Drinking far beyond sweat loss can dilute the blood\'s sodium. Guidance is small amounts often, capped at about 1.4 L an hour in US Army guidance.' },
    { q: 'At −15 °C, who in a team is most likely to become cold first?', choices: ['The one standing still on watch', 'The one digging', 'The one carrying a heavy load uphill', 'Everyone equally'], a: 0, why: 'Heat production falls with activity, so the required insulation rises: people who sit or stand still need much more clothing than those working hard.' },
    { q: 'A 70 kg person stores 120 W of heat. How fast does body temperature rise (°C/h)? Take c = 3490 J/(kg·K).', answer: 1.77, unit: '°C/h', why: '$3600 \\times 120/(70 \\times 3490) = 1.77$ °C an hour.' }
  ],
  problems: [
    { q: 'A 75 kg worker stores 150 W of heat. How many minutes until body temperature has risen 1.5 °C? (c = 3490 J/(kg·K))', answer: 44, unit: 'min', tol: 0.03, steps: ['$r = 3600 \\times 150/(75 \\times 3490) = 2.06$ °C/h.', '$1.5/2.06 = 0.73$ h = 44 min.'] },
    { q: 'What is the standard air pressure at 4000 m?', answer: 61.6, unit: 'kPa', tol: 0.01, steps: ['$101.325 \\times (1 - 2.256 \\times 10^{-5} \\times 4000)^{5.256}$.', '$= 101.325 \\times 0.9098^{5.256} = 61.6$ kPa.'] }
  ],
  ranges: [
    { dim: 'Core body temperature during work', range: [38, 38.5], unit: '°C', who: '38 °C for most workers; up to 38.5 °C for acclimatised, medically monitored workers', why: 'Keeps people clear of heat exhaustion and heat stroke, and judgement intact.', limits: 'Individuals differ; illness, dehydration and some medicines lower tolerance.', setting: ['military', 'field'], src: 'World Health Organization (1969); ACGIH heat-stress guidance' },
    { dim: 'WBGT reference values for continuous work, acclimatised', range: [25, 33], unit: '°C', who: '33 °C resting to 25 °C for very heavy work; lower for people not acclimatised', why: 'Below the reference, work can continue without excessive heat strain.', limits: 'For ordinary work clothes; add the clothing adjustment for armour and suits.', setting: ['military', 'field'], src: 'ISO 7243:2017' },
    { dim: 'Clothing adjustment added to the WBGT', range: 'about 3 °C (armour, double layers) to 6 °C (full protective suit); about 10 °C or more (vapour barrier)', who: 'People in armour or protective clothing', why: 'Accounts for sweat that cannot evaporate.', limits: 'Approximate; the ensemble and the work matter; monitor people, not only the index.', setting: ['military', 'field'], src: 'US Army heat-illness guidance (TB MED 507); ACGIH; ISO 7243:2017' },
    { dim: 'Finger skin temperature for manual work', range: [15, null], unit: '°C', who: 'Anyone working with the hands in the cold', why: 'Dexterity and grip hold up; below about 8 °C touch fades.', limits: 'Gloves warm but clumsy; warm-up breaks and handwarmers are needed.', setting: ['military', 'field'], src: 'Heus, Daanen and Havenith, *Applied Ergonomics* (1995); ISO 11079' },
    { dim: 'Wind chill at which exposed skin can freeze in 10–30 minutes', range: [null, -28], unit: '°C', who: 'Anyone with exposed face or hands', why: 'Marks when faces and hands must be covered and exposure limited.', limits: 'Wet skin, metal contact and fuel freeze skin faster.', setting: ['military', 'field'], src: 'North American wind chill index (2001) and its guidance' },
    { dim: 'Gain in sleeping altitude above about 3000 m', range: [300, 500], unit: 'm per day', who: 'Everyone, fit or not; a rest day every three to four days', why: 'Gives time to acclimatise and lowers the risk of altitude illness.', limits: 'People differ; rapid deployments by air need extra care; not medical advice.', setting: ['military', 'field'], src: 'Wilderness Medical Society altitude guidelines (Luks et al., 2019)' },
    { dim: 'Heat acclimatisation', range: '7–14 days, starting at ≤ 20 % of the full exposure, adding ≤ 20 % a day', who: 'New workers and people returning after a week or more away', why: 'Many heat deaths at work happen in a worker\'s first days in the heat.', limits: 'Lost within weeks without heat; fitness shortens it but does not replace it.', setting: ['military', 'field'], src: 'NIOSH criteria for a recommended standard: heat and hot environments (2016)' },
    { dim: 'Drinking during hot work', range: 'about 0.25 L every 15–20 min; at most about 1.4 L an hour', who: 'People working in the heat', why: 'Replaces sweat without diluting the blood\'s sodium.', limits: 'Sweat rates differ; long exposures need food or salt too; not medical advice.', setting: ['military', 'field'], src: 'NIOSH; US Army heat-illness guidance (TB MED 507)' }
  ],
  applications: [
    'Work–rest tables by WBGT and clothing for training and field work — [the heat-stress calculator](#/tools/environment/heat).',
    'Cooling vests and ventilated protective suits that extend safe working time.',
    'Cold-weather clothing systems in layers, with mitts over thin working gloves.',
    'Ascent plans for mountain operations and high-altitude work.'
  ],
  history: 'The wet-bulb globe temperature was devised in the 1950s by Yaglou and Minard to cut heat casualties among US Marine Corps recruits in training: with outdoor training limited by the index, heat casualties fell sharply. The index became ISO 7243 and the basis of work–rest guidance worldwide.',
  sources: [
    'ISO 7243:2017, *Ergonomics of the thermal environment — Assessment of heat stress using the WBGT index*.',
    'ISO 7933, *Ergonomics of the thermal environment — Analytical determination and interpretation of heat stress using calculation of the predicted heat strain*.',
    'ISO 11079, *Ergonomics of the thermal environment — Determination and interpretation of cold stress when using required clothing insulation (IREQ) and local cooling effects*.',
    'ISO 9920, *Ergonomics of the thermal environment — Estimation of thermal insulation and water vapour resistance of a clothing ensemble*.',
    'NIOSH, *Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments*, 2016.',
    'US Army TB MED 507, guidance on heat-illness prevention and heat stress control.',
    'A. M. Luks et al., Wilderness Medical Society clinical practice guidelines for acute altitude illness, *Wilderness & Environmental Medicine* (2019).',
    'C. P. Yaglou and D. Minard, "Control of heat casualties at military training centers", *AMA Archives of Industrial Health* (1957).'
  ],
  sim: ['mf-thermal-balance', 'mf-altitude']
},

{
  id: 'sustained-operations', parent: 'military-topic', title: 'Sleep loss and sustained operations', level: 2,
  short: 'In operations that run for days the limit is the brain, not the muscles. Sleep pressure builds while awake and the body clock bottoms out in the early morning; after about 17 hours awake performance is like that at 0.05 % blood alcohol. Sleep has to be planned like water and fuel.',
  keywords: ['sustained operations', 'continuous operations', 'sleep deprivation', 'sleep restriction', 'fatigue', 'two-process model', 'circadian rhythm', 'window of circadian low', 'microsleep', 'nap', 'sleep inertia', 'watch system', 'fatigue risk management', 'drivers\' hours', 'caffeine'],
  prereq: ['shift-work', 'fatigue-rest-breaks', 'military-human-factors'],
  related: ['mental-workload', 'human-error', 'situation-awareness', 'decisions-stress', 'extreme-environments', 'crew-stations', 'work-rest-scheduling', 'agriculture-ergonomics', 'truck-bus-cabs', 'medicine:sleep'],
  body: `
Sustained operations — continuous work for days with little or broken sleep — happen in defence, disaster response, shipping, aviation, health care, and on farms at harvest. The limit is not the muscles but the brain: short of sleep, attention lapses, reactions slow, memory and judgement fail, and people underestimate how impaired they are.

### Two processes
Sleepiness follows two processes (Borbély, 1982). A **homeostatic** pressure $S$ builds while awake and drains during sleep, both [[?exponential|exponentially]] — rising with a time constant of roughly 18 h and falling with one of roughly 4 h:
$$S_{wake} = 1 - (1 - S_0)\\,e^{-t/\\tau_r} \\qquad S_{sleep} = S_0\\,e^{-t/\\tau_d}$$
A **circadian** rhythm $C$ — the body clock — makes alertness lowest in the early morning, about 02:00–06:00 (the "window of circadian low"), with a smaller dip in the early afternoon. Alertness is roughly the gap between the two, so it is worst when a long wake period runs into the small hours. Because the fall during sleep is fast at first, a short nap removes a useful part of the pressure; but a whole night is needed to clear a day's worth.

### How much is too little
- Adults need about 7–9 hours of sleep a day; most need at least 7 to perform consistently.
- After about 17 hours awake, test performance equals that at a blood-alcohol concentration of about 0.05 %; after 24 hours, about 0.10 % (Dawson and Reid, 1997).
- Two weeks of 4–6 hours a night built up deficits like one or two nights without sleep, while people felt only slightly sleepy (Van Dongen and colleagues, 2003).
- Three nights of recovery sleep did not fully restore performance after a week of restricted sleep (Belenky and colleagues, 2003).
- **Microsleeps** — lapses of a few seconds — come long before sleep itself, and are most dangerous for drivers, watchkeepers and machine operators.

### Designing work for people who must sleep
| Measure | Why it works | Limits |
|---|---|---|
| A protected block of sleep every 24 h | keeps sleep pressure from building | operations interrupt; sleep in vehicles and tents is poorer |
| Three watches rather than two | everyone gets a longer sleep block | needs more people |
| Naps of 10–20 min, or a full 90 min | short naps cut sleep pressure without grogginess | after deeper sleep, sleep inertia lasts 15–30 min |
| Critical tasks outside 02:00–06:00 | avoids the circadian low | not always possible |
| Dark, quiet, cool sleeping places | better sleep in the time available | field conditions |
| Checklists, cross-checks, simple displays | catch fatigue's errors | do not remove fatigue |
| Caffeine, used deliberately | alertness for a few hours | disturbs later sleep; not a substitute for it |

After two fatal collisions of US Navy destroyers in 2017, the Navy's reviews found fatigue among the contributing causes, and the surface fleet moved to watch schedules built around a 24-hour day. Transport has hours rules: in the EU, at most 9 hours of driving a day (10 twice a week) and a 45-minute break after 4.5 hours; in the US, 11 hours of driving within 14 on duty after 10 hours off.

### Settings
- **Military**: planned sleep, crew rotation, sleep in vehicles, command posts working round the clock.
- **Field work**: harvest and planting through the night, disaster response, utility repairs after storms, remote sites with long rotations.
- **Transport and health care**: drivers' hours, pilots' flight-time limits, clinicians' shifts ([[shift-work]], [[fatigue-rest-breaks]]).

### In the simulation
A simple two-process model over four days. Choose how much sleep, when, and whether to nap; the curve shows alertness, the shaded bands night and sleep, and the dashed lines the alertness of someone 17 and 24 hours awake after a normal night. See how one lost night and three short nights compare, and how much a nap in the small hours buys.

> [!warn] Microsleeps give no warning. Anyone very sleepy should not drive or operate machinery — plan rest before the drive home after a long operation.

> [!key] Plan sleep like water and fuel: a protected block every 24 hours, naps where they fit, critical work out of the early-morning low, and checks that catch the errors fatigue brings.
`,
  ideas: [
    'Sleep pressure builds while awake (time constant about 18 h) and drains in sleep (about 4 h); the body clock adds an early-morning low.',
    'About 17 h awake impairs performance like 0.05 % blood alcohol; 24 h like 0.10 %.',
    'Chronic short sleep builds a deficit people do not feel, and takes more than a few nights to repay.',
    'Short naps of 10–20 minutes help without grogginess; critical tasks belong outside 02:00–06:00.',
    'Sleep is a resource to be planned: protected blocks, crew rotation, watch systems and hours rules.'
  ],
  pitfalls: [
    'Experienced people get used to little sleep — Performance keeps falling with chronic restriction even when people feel adapted; the feeling adapts, the deficit does not.',
    'One long sleep repays a week of short nights — Several nights of recovery sleep are needed, and even three may not be enough.',
    'Longer naps are always better — Naps that reach deep sleep leave 15–30 minutes of grogginess; before a critical task a 10–20 minute nap is better.'
  ],
  formulas: [
    {
      name: 'Sleep pressure while awake (two-process model)',
      expr: 'S = 1 - (1 - S0)*exp(-t/tr)', tex: 'S = 1 - (1 - S_0)\\,e^{-t/\\tau_r}',
      vars: {
        S: { name: 'homeostatic sleep pressure (0 rested, 1 maximal)', tex: 'S' },
        S0: { name: 'sleep pressure on waking', value: 0.1, min: 0, max: 1, tex: 'S_0' },
        t: { name: 'time awake', q: 'time', unit: 'h', value: 17, tex: 't' },
        tr: { name: 'time constant of the rise', q: 'time', unit: 'h', value: 18.2, tex: '\\tau_r' }
      },
      note: 'A simplified form of Borbély\'s process S, with the time constant of Daan, Beersma and Borbély (1984). The scale is relative; alertness also depends on the time of day.',
      stories: { S: 'Someone wakes with a sleep pressure of {S0}. What is it after {t} awake (time constant {tr})?', t: 'Starting from {S0}, how long awake until the sleep pressure reaches {S} (time constant {tr})?' }
    },
    {
      name: 'Sleep pressure during sleep',
      expr: 'S = S0*exp(-t/td)', tex: 'S = S_0\\,e^{-t/\\tau_d}',
      vars: {
        S: { name: 'sleep pressure after sleeping', tex: 'S' },
        S0: { name: 'sleep pressure on falling asleep', value: 0.76, min: 0, max: 1, tex: 'S_0' },
        t: { name: 'time asleep', q: 'time', unit: 'h', value: 8, tex: 't' },
        td: { name: 'time constant of the fall', q: 'time', unit: 'h', value: 4.2, tex: '\\tau_d' }
      },
      note: 'The fall is fastest at the start, which is why a short nap helps.',
      stories: { S: 'Someone falls asleep with a sleep pressure of {S0}. What is it after {t} of sleep (time constant {td})?', t: 'How long must someone with a sleep pressure of {S0} sleep to bring it down to {S}?' }
    }
  ],
  examples: [
    {
      title: 'A night without sleep',
      q: 'In the two-process model someone wakes at 07:00 with a sleep pressure of 0.1. What is it at 23:00, at midnight and at 07:00 the next morning, without sleep?',
      steps: [
        '16 h: $1 - 0.9\\,e^{-16/18.2} = 1 - 0.9 \\times 0.415 = 0.63$.',
        '17 h: $1 - 0.9\\,e^{-17/18.2} = 0.65$ — the point Dawson and Reid compared with 0.05 % blood alcohol.',
        '24 h: $1 - 0.9\\,e^{-24/18.2} = 0.76$ — and it is now also the circadian low, so alertness is at its worst.'
      ],
      a: 'About 0.63, 0.65 and 0.76.'
    },
    {
      title: 'What a nap buys',
      q: 'After 24 h awake the sleep pressure is 0.76. What is it after a 20-minute nap, 90 minutes, 4 hours and 8 hours of sleep?',
      steps: [
        '20 min: $0.76\\,e^{-0.333/4.2} = 0.70$.',
        '90 min: $0.76\\,e^{-1.5/4.2} = 0.53$; 4 h: 0.29; 8 h: 0.11.',
        'A nap is a real but partial repair; a night of sleep is needed to return to about 0.1.'
      ],
      a: 'About 0.70, 0.53, 0.29 and 0.11.'
    }
  ],
  quiz: [
    { q: 'When is alertness usually at its lowest?', choices: ['About 02:00–06:00', 'About 10:00–12:00', 'About 18:00–20:00', 'It depends only on hours awake'], a: 0, why: 'The circadian rhythm reaches its low in the early morning; with a long wake period the two processes combine there.' },
    { q: 'After about 17 hours awake, performance on tests is comparable to…', choices: ['a blood-alcohol concentration of about 0.05 %', 'no impairment at all', 'a blood-alcohol concentration of about 0.20 %', 'being awake 4 hours'], a: 0, why: 'Dawson and Reid (1997) found about 0.05 % after 17 h and about 0.10 % after 24 h awake.' },
    { q: 'People restricted to 6 hours of sleep a night for two weeks know how impaired they are.', a: false, why: 'Their sleepiness ratings levelled off while their performance kept falling (Van Dongen and colleagues, 2003).' },
    { q: 'Why can a 15-minute nap be better than a 60-minute nap just before a critical task?', choices: ['Longer naps reach deep sleep, leaving 15–30 minutes of grogginess', 'Short naps remove more sleep pressure', 'Long naps shift the body clock by hours', 'There is no difference'], a: 0, why: 'Sleep inertia after waking from deep sleep impairs performance for a while; short naps avoid deep sleep.' },
    { q: 'With the two-process model (τ = 18.2 h), what is the sleep pressure after 24 h awake, starting from 0.1?', answer: 0.76, why: '$1 - 0.9\\,e^{-24/18.2} = 1 - 0.9 \\times 0.268 = 0.76$.' }
  ],
  problems: [
    { q: 'Someone falls asleep with a sleep pressure of 0.76. With a time constant of 4.2 h, what is it after 8 hours of sleep?', answer: 0.113, tol: 0.02, steps: ['$S = 0.76\\,e^{-8/4.2} = 0.76 \\times 0.149 = 0.113$.'] },
    { q: 'Starting from 0.1 on waking, how many hours awake until the sleep pressure reaches 0.65 (τ = 18.2 h)?', answer: 17.2, unit: 'h', tol: 0.02, steps: ['$0.65 = 1 - 0.9\\,e^{-t/18.2}$, so $e^{-t/18.2} = 0.389$.', '$t = -18.2 \\ln 0.389 = 17.2$ h.'] }
  ],
  ranges: [
    { dim: 'Sleep in 24 hours to sustain performance', range: [7, 9], unit: 'h', who: 'Most adults', why: 'Attention, reaction time, memory and judgement hold up day after day.', limits: 'Individual need varies; sleep in vehicles, tents and noise is less restful than its hours suggest.', setting: ['military', 'field'], src: 'American Academy of Sleep Medicine and Sleep Research Society consensus (2015); US National Sleep Foundation (2015)' },
    { dim: 'Continuous time awake before performance is clearly impaired', range: [null, 17], unit: 'h', who: 'A person who slept normally the night before', why: 'Beyond it, performance is like that at 0.05 % blood alcohol and keeps falling.', limits: 'Less after short nights and at the circadian low.', setting: ['military', 'field', 'vehicle'], src: 'Dawson and Reid, *Nature* (1997)' },
    { dim: 'Short nap', range: [10, 20], unit: 'min', who: 'Anyone who must stay alert in a long operation', why: 'Lowers sleep pressure without the grogginess of deep sleep.', limits: 'Does not replace a night\'s sleep; a full cycle of about 90 min repays more.', setting: ['military', 'field'], src: 'Brooks and Lack, *Sleep* (2006)' },
    { dim: 'Time to allow after waking before critical tasks', range: [15, 30], unit: 'min', who: 'People woken from deep sleep', why: 'Sleep inertia clears; errors on waking are avoided.', limits: 'Emergencies may not wait; short naps avoid most of it.', setting: ['military', 'field'], src: 'Tassi and Muzet, *Sleep Medicine Reviews* (2000)' },
    { dim: 'Hours to keep critical tasks away from', range: '02:00–06:00', who: 'Everyone on a normal day-oriented body clock', why: 'The circadian low, when errors and microsleeps peak.', limits: 'Night workers adapt only partly; operations do not always allow it.', setting: ['military', 'field', 'vehicle'], src: 'Circadian research; fatigue risk management guidance' },
    { dim: 'Driving time (EU drivers\' hours)', range: 'at most 9 h a day (10 h twice a week); 45 min break after 4.5 h', who: 'Drivers of goods and passenger vehicles in the EU', why: 'Limits fatigue on the road.', limits: 'Different rules elsewhere (in the US, 11 h driving within 14 h on duty); armed forces and some field vehicles are exempt.', setting: ['vehicle', 'field'], src: 'Regulation (EC) No 561/2006' }
  ],
  applications: [
    'Sleep plans and crew rotation for operations lasting days.',
    'Watch systems on ships aligned with the body clock.',
    'Fatigue risk management systems in aviation, rail and road transport.',
    'Harvest and disaster-response rosters that protect a block of sleep.'
  ],
  history: 'Alexander Borbély proposed the two-process model of sleep regulation in 1982, and with Serge Daan and Domien Beersma fitted its time constants in 1984. Drew Dawson and Kathryn Reid\'s 1997 comparison of sleep loss with alcohol, published in *Nature*, gave fatigue a yardstick that regulators and the public understood.',
  sources: [
    'A. A. Borbély, "A two process model of sleep regulation", *Human Neurobiology* 1 (1982).',
    'S. Daan, D. G. M. Beersma and A. A. Borbély, "Timing of human sleep: recovery process gated by a circadian pacemaker", *American Journal of Physiology* (1984).',
    'D. Dawson and K. Reid, "Fatigue, alcohol and performance impairment", *Nature* 388 (1997).',
    'H. P. A. Van Dongen et al., "The cumulative cost of additional wakefulness", *Sleep* 26 (2003).',
    'G. Belenky et al., "Patterns of performance degradation and restoration during sleep restriction and subsequent recovery", *Journal of Sleep Research* 12 (2003).',
    'Regulation (EC) No 561/2006 on drivers\' hours.'
  ],
  sim: 'mf-sleep-loss'
},

{
  id: 'construction-ergonomics', parent: 'field-topic', title: 'Construction', level: 2,
  short: 'Building sites combine heavy, bulky materials, work from the ground to the ceiling, kneeling, vibrating tools and weather. The most effective ergonomics happens before the site opens: lighter blocks and bags, prefabrication, lifting aids and working platforms that keep the hands between knuckle and elbow height.',
  keywords: ['construction', 'building site', 'bricklaying', 'block laying', 'heavy blocks', 'plasterboard', 'cement bags', 'kneeling', 'floor layers', 'knee bursitis', 'overhead drilling', 'rebar tying', 'hand-arm vibration', 'breaker', 'CDM Regulations', 'designers\' duties', 'vacuum lifter', 'mason\'s platform'],
  prereq: ['niosh-lifting-equation', 'hand-arm-vibration', 'standing-work-heights'],
  related: ['lifting-index-risk', 'handling-aids', 'team-lifting', 'power-tools-ergonomics', 'whole-body-vibration', 'working-at-height', 'outdoor-heat-sun', 'ppe-ergonomics', 'neutral-postures', 'joint-ranges', 'noise-exposure', 'agriculture-ergonomics'],
  body: `
A building site is a workplace that changes every day. Materials arrive heavy and bulky, the work moves from the ground to the ceiling, the ground is uneven, the weather is outside, and many workers move between sites and employers. Back, shoulder, knee and hand disorders are among the commonest reasons people leave the trades early. Unlike a workshop, a site cannot be built around its workers — so the most effective ergonomics happens earlier, in the **design**, the **choice of materials** and the **method of work**. In the UK the CDM Regulations 2015, and across the EU the directive on temporary and mobile sites (92/57/EEC), put that duty on designers and clients as well as contractors.

### Manual handling
| Material | Typical unit | The problem | Better |
|---|---|---|---|
| Concrete blocks | 10–25 kg or more | repeated lifts reaching over a wall, twisting | lighter or smaller blocks, block lifters, platforms raised as the wall rises |
| Cement, plaster, adhesive | 25 kg bags in Europe; 94 lb (42.6 kg) in the US | lifted from the ground, carried | smaller bags, silos, delivery to the working level |
| Plasterboard | a 2.4 × 1.2 m sheet weighs about 25–30 kg | bulky, catches the wind, fitted overhead | board lifters, trolleys, two-person handling |
| Kerbs and slabs | 30–70 kg | at ground level | vacuum lifters, mini-cranes |
| Reinforcing bar | long and awkward; tied at floor level | hours stooped | tying tools on long handles, powered tiers, prefabricated cages |

UK construction guidance treats blocks heavier than about 20 kg as needing a lighter specification or mechanical handling. The revised NIOSH equation shows why ([[niosh-lifting-equation]]): laying a 20 kg block onto a course 1.1 m high from a pallet, 40 cm out from the ankles, with a 45° twist and poor grip, one every two minutes all day, gives a recommended limit near 7 kg — a lifting index near 3 ([[lifting-index-risk]]). The height of the course matters: the best band is roughly knuckle to elbow height, 0.7–1.1 m above where the mason stands. In the simulation, build the wall course by course and raise the platform to keep the index down.

### Kneeling and floor work
Floor layers, tilers, screeders and rebar fixers spend hours kneeling or squatting. Studies link more than about an hour a day of kneeling or squatting with knee osteoarthritis, and constant kneeling with bursitis ("carpet layer's knee"). Knee pads spread the pressure but do not remove the bending; stand-up tools (long-handled screeds and trowels, power trowels), raising work onto trestles, and rotating tasks do.

### Overhead and awkward work
Drilling into ceilings holds the arms above the shoulders against the tool's weight and reaction — a recipe for shoulder disorders ([[joint-ranges]]). Drill stands and props take the load; mobile platforms bring the work below shoulder height; cast-in fixings remove the drilling.

### Vibration and noise
Breakers, hammer drills, disc cutters and compactors vibrate the hands and arms; dumpers, excavators and rollers the whole body. The time a tool may be used before a daily exposure value is reached falls with the *square* ([[?exponent]] 2) of its vibration:
$$T = 8\\,\\mathrm{h} \\times \\left(\\frac{A}{a}\\right)^2$$
A breaker at 12 m/s² reaches the EU action value (2.5 m/s² A(8)) in about 20 minutes of trigger time and the limit value (5 m/s²) in about 80 minutes ([[hand-arm-vibration]]). Low-vibration tools, maintained bits, rotation — and designs that need less breaking — keep workers below them. Most of these tools are loud too ([[noise-exposure]]).

### Settings
- **Construction**: temporary, changing, outdoors — ergonomics must be planned into the design and the method.
- **Workshops and prefabrication**: the same components made indoors at good heights, with cranes and jigs, then assembled on site ([[standing-work-heights]]).
- **Military engineers and disaster response**: building camps, roads and shelters with the same loads, often with less machinery.
- **Home**: DIY with 25 kg bags and full sheets of board, without training or lifting aids.

> [!warn] Heavy work at height adds the risk of falls: platforms and scaffolds must have edge protection before loads are handled on them ([[working-at-height]]).

> [!key] Design the heavy lifting out: lighter units, prefabrication, lifting aids, and platforms that keep work between knuckle and elbow height. Then time-limit vibration and kneeling, which PPE cannot remove.
`,
  ideas: [
    'Construction ergonomics is decided mostly in design and planning: materials, prefabrication, methods and lifting aids.',
    'Heavy blocks laid by hand give lifting indices near 3; blocks over about 20 kg call for lighter units or machines.',
    'Keep the course, the board or the fixing between knuckle and elbow height by raising platforms as the work rises.',
    'More than about an hour a day of kneeling or squatting is linked with knee disorders; knee pads alone are not enough.',
    'Vibration time limits fall with the square of the vibration: halve the vibration, quadruple the time.'
  ],
  pitfalls: [
    'Experienced labourers know how to lift, so training solves handling — Technique cannot make a 20 kg block laid over a wall a safe lift; the weight, reach and twist must change.',
    'Knee pads make kneeling work safe — They spread the pressure on the kneecap, but deep knee bending for hours still loads the joint.',
    'A tool\'s vibration only matters if it hurts at the time — Vibration injury builds up over months and years without pain on the day.'
  ],
  formulas: [
    {
      name: 'Tool time to reach a daily vibration value',
      expr: 'T = 8*(A/a)^2', tex: 'T = 8\\,\\mathrm{h} \\times \\left(\\frac{A}{a}\\right)^2',
      vars: {
        T: { name: 'trigger time to reach the value', q: 'time', unit: 'h', tex: 'T' },
        A: { name: 'daily exposure value (EU hand-arm: 2.5 action, 5 limit)', q: 'accel', unit: 'm/s²', value: 2.5, tex: 'A' },
        a: { name: 'vibration magnitude of the tool', q: 'accel', unit: 'm/s²', value: 12, tex: 'a' }
      },
      note: 'From A(8) = a √(T/8 h). The 8 in the formula is 8 hours, so T comes out in hours. Use the tool\'s measured vibration in real use, not only the declared value.',
      stories: { T: 'A breaker vibrates at {a}. How long may it be used before the daily exposure reaches {A}?', a: 'A tool is used for {T} a day. How strongly may it vibrate if the exposure must stay at {A}?' }
    },
    {
      name: 'Lifting index',
      expr: 'LI = Lm/RWL', tex: '\\mathrm{LI} = \\frac{L}{\\mathrm{RWL}}',
      vars: {
        LI: { name: 'lifting index', tex: '\\mathrm{LI}' },
        Lm: { name: 'mass of the load', q: 'mass', unit: 'kg', value: 20, tex: 'L' },
        RWL: { name: 'recommended weight limit for the task (NIOSH)', q: 'mass', unit: 'kg', value: 7.3, tex: '\\mathrm{RWL}' }
      },
      note: 'Revised NIOSH equation: above 1 the risk rises for some workers; above about 3 for many. Try the whole equation in the NIOSH calculator.',
      stories: { LI: 'A {Lm} block is laid in a task whose recommended weight limit is {RWL}. What is the lifting index?', Lm: 'What block mass gives a lifting index of {LI} when the recommended weight limit is {RWL}?' }
    }
  ],
  examples: [
    {
      title: 'Laying heavy blocks',
      q: 'A mason lifts 20 kg blocks from a pallet at 60 cm and lays them on a course 110 cm high. The hands are 40 cm out from the ankles, the trunk twists 45°, the grip is poor, and a block is laid every two minutes for 8 hours. Find the recommended weight limit at the destination and the lifting index.',
      steps: [
        'Multipliers: $HM = 25/40 = 0.625$; $VM = 1 - 0.003 \\times |110 - 75| = 0.895$; $DM = 0.82 + 4.5/50 = 0.91$; $AM = 1 - 0.0032 \\times 45 = 0.856$; $FM = 0.81$ (0.5 lifts a minute, 8 h); $CM = 0.90$.',
        { text: 'Recommended weight limit:', tex: '\\mathrm{RWL} = 23 \\times 0.625 \\times 0.895 \\times 0.91 \\times 0.856 \\times 0.81 \\times 0.90 = 7.3\\ \\mathrm{kg}' },
        '$\\mathrm{LI} = 20/7.3 = 2.7$. A 10 kg block would give 1.4; a block lifter or a lighter block is the fix.'
      ],
      a: 'RWL about 7.3 kg; lifting index about 2.7.'
    },
    {
      title: 'How long on the breaker?',
      q: 'A road breaker vibrates at 12 m/s² in use. How long may it be used in a day before the EU action value (2.5 m/s²) and the limit value (5 m/s²) are reached?',
      steps: [
        'Action: $T = 8 \\times (2.5/12)^2 = 0.35$ h, about 21 minutes of trigger time.',
        'Limit: $T = 8 \\times (5/12)^2 = 1.39$ h, about 83 minutes.',
        'A low-vibration breaker at 6 m/s² would allow four times as long: about 83 minutes to the action value.'
      ],
      a: 'About 21 minutes to the action value and 83 minutes to the limit value.'
    }
  ],
  quiz: [
    { q: 'Which is the most effective way to reduce the risk of laying heavy blocks?', choices: ['Specify lighter blocks or use a block lifter', 'Train masons to bend their knees', 'Issue back belts', 'Lay blocks faster to finish sooner'], a: 0, why: 'Removing the weight at the design stage or with a lifting aid changes the task itself; training and belts leave the load and reach unchanged.' },
    { q: 'A breaker vibrates at 12 m/s². About how long does it take to reach the EU action value of 2.5 m/s² A(8)?', choices: ['About 20 minutes', 'About 2 hours', 'About 8 hours', 'About 2 minutes'], a: 0, why: '$T = 8 \\times (2.5/12)^2 = 0.35$ h ≈ 21 min.' },
    { q: 'Knee pads remove the risk of kneeling work.', a: false, why: 'Pads spread the pressure on the kneecap, but deep, sustained knee bending still loads the joint; stand-up tools and raised work reduce it.' },
    { q: 'Why must construction ergonomics start at the design stage?', choices: ['The site changes daily and cannot be built around the worker, so materials and methods must be chosen for people', 'Designers are always on site', 'Construction workers never lift', 'Regulations forbid lifting aids'], a: 0, why: 'On a temporary site the only lasting controls are the units, methods and equipment chosen beforehand — hence designers\' duties under CDM 2015 and 92/57/EEC.' },
    { q: 'A plasterboard sheet 2.4 × 1.2 m weighs 9 kg/m². What does it weigh (kg)?', answer: 25.9, unit: 'kg', why: '$2.4 \\times 1.2 \\times 9 = 25.9$ kg — bulky as well as heavy, and a sail in the wind.' }
  ],
  problems: [
    { q: 'A hammer drill vibrates at 8 m/s². How many minutes of trigger time bring a worker to the EU action value of 2.5 m/s² A(8)?', answer: 47, unit: 'min', tol: 0.02, steps: ['$T = 8 \\times (2.5/8)^2 = 0.78$ h.', '$0.78 \\times 60 = 47$ min.'] },
    { q: 'A task\'s recommended weight limit is 9 kg. What is the lifting index for an 18 kg block?', answer: 2, tol: 0.01, steps: ['$\\mathrm{LI} = 18/9 = 2.0$: a high risk for many workers.'] }
  ],
  ranges: [
    { dim: 'Mass of a block or unit laid by hand, repeatedly', range: [null, 20], unit: 'kg', who: 'Masons of every size, all day', why: 'Keeps the lifting index down for lifts that reach over a wall and twist.', limits: 'Even 20 kg is well above the NIOSH limit for such lifts; lighter still, or lifters, is better.', setting: 'field', src: 'UK HSE construction manual-handling guidance; revised NIOSH lifting equation' },
    { dim: 'Height of the course or work above the standing level', range: [700, 1100], unit: 'mm', who: 'About knuckle to elbow height of most workers in boots', why: 'Lifts start and end near the waist: no stooping, nothing above the shoulders.', limits: 'Walls rise: raise the platform in lifts or use an adjustable mason\'s platform.', setting: 'field', src: 'Revised NIOSH lifting equation (vertical multiplier); representative body data' },
    { dim: 'Bags of cement, plaster and aggregate', range: [null, 25], unit: 'kg', who: 'Anyone who lifts them from the ground or a pallet', why: 'A 25 kg bag handled close to the body stays near the limits most guidance sets.', limits: 'Still heavy for many people and for lifts from the floor; bulk delivery and silos are better.', setting: 'field', src: 'Common European practice; ISO 11228-1' },
    { dim: 'Kneeling or squatting in a day', range: [null, 1], unit: 'h', who: 'Floor layers, tilers, screeders, rebar fixers', why: 'Longer daily kneeling and squatting is linked with knee osteoarthritis and bursitis.', limits: 'A threshold from studies, not a safe dose; pads, stand-up tools and rotation reduce it further.', setting: 'field', src: 'L. K. Jensen, review of kneeling work and knee osteoarthritis, *Occupational and Environmental Medicine* (2008)' },
    { dim: 'Trigger time on a breaker at about 12 m/s²', range: 'about 20 min to the action value; about 80 min to the limit value', who: 'Anyone using the tool that day', why: 'Keeps daily hand-arm vibration below the EU action and limit values.', limits: 'Other tools add to the same daily dose; use measured, not declared, values.', setting: 'field', src: 'Directive 2002/44/EC; ISO 5349-1' }
  ],
  applications: [
    'Specifying lighter blocks, smaller bags and prefabricated components at the design stage.',
    'Vacuum lifters for blocks, kerbs and slabs; board lifters for ceilings.',
    'Mason\'s platforms that rise with the wall.',
    'Planning breaker work with [the vibration calculator](#/tools/environment/vibration) and lifts with [the NIOSH calculator](#/tools/lifting/niosh).'
  ],
  sources: [
    'Council Directive 92/57/EEC on temporary or mobile construction sites.',
    'Construction (Design and Management) Regulations 2015 (UK).',
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine, "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics* 36 (1993).',
    'Directive 2002/44/EC (vibration) and ISO 5349-1 (hand-arm vibration).',
    'L. K. Jensen, "Knee osteoarthritis: influence of work involving heavy lifting, kneeling, climbing stairs or ladders, or kneeling/squatting combined with heavy lifting", *Occupational and Environmental Medicine* (2008).',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting, lowering and carrying*.'
  ],
  sim: 'mf-block-laying'
},

{
  id: 'agriculture-ergonomics', parent: 'field-topic', title: 'Agriculture', level: 2,
  short: 'Farm work stoops over low crops, lifts sacks and crates, repeats cuts and picks thousands of times, and rides vibrating tractors with the head turned back — in sun, heat and dust, often through the night at harvest. Raised crops, harvest aids, long handles, suspended seats and roll-over protection change the work.',
  keywords: ['agriculture', 'farm work', 'stooped work', 'harvest', 'picking', 'weeding', 'short-handled hoe', 'raised beds', 'table-top strawberries', 'harvest aid', 'tractor', 'rollover protective structure', 'ROPS', 'whole-body vibration', 'knapsack sprayer', 'ISO 11226', 'trunk flexion', 'piece rate', 'seasonal workers'],
  prereq: ['spinal-loading', 'posture-assessment', 'whole-body-vibration'],
  related: ['construction-ergonomics', 'outdoor-heat-sun', 'ppe-ergonomics', 'mobile-machines', 'repetitive-strain', 'lifting-principles', 'carrying-loads', 'static-muscle-work', 'sustained-operations', 'hand-tools', 'load-carriage'],
  body: `
Farm work combines almost every hazard in this app: stooping and kneeling over low crops, lifting sacks, bales and crates, cutting and picking thousands of times a day, long hours on vibrating tractors with the head turned back to the implement, heat, sun, dust and pesticides, and harvests that run through the night. Many farm workers are self-employed, seasonal or migrant, young or old, and far from help. Agriculture has one of the highest rates of fatal injury of any industry, and musculoskeletal disorders are common among those who stay in it.

### Stooped work
Low crops — strawberries, lettuce, vegetables, asparagus — put the hands near the ground. Picking or weeding with straight legs bends the trunk 60–90° for hours. **ISO 11226** treats a trunk inclined up to about 20° as acceptable, 20–60° as acceptable only for limited times or with the trunk supported, and beyond 60° as not acceptable. The load on the lower back is the upper body's weight times its horizontal distance from the lower spine — its lever arm times the [[?sine-cosine|sine]] of the trunk angle:
$$M = m_u\\,g\\,d\\,\\sin\\theta$$
For a 70 kg, 1.70 m person the head, arms and trunk weigh about 47 kg with their centre about 0.3 m from the lower back, so at 60° the moment is about 120 N·m and the compression on the lower spine about 2.7 kN. That is not extreme for one lift — the harm comes from holding it, static, for hours ([[static-muscle-work]], [[spinal-loading]]). Kneeling or squatting relieves the back but loads the knees.

**Better**: raise the crop (table-top strawberries at about waist height, raised beds, greenhouse gutters); bring the picker down to it on a support (harvest platforms where pickers lie face-down, stools and carts); use long-handled tools; mechanise; rotate tasks; and pay in ways that do not punish rest — piece rates speed the work and discourage breaks. In the simulation, compare stooping, kneeling, a raised bed and a harvest platform.

### Lifting and carrying
Sacks of feed, seed and fertiliser, small bales, crates of produce, picking bags carried up ladders, knapsack sprayers with 15–20 L of liquid on the back ([[load-carriage]]). Smaller bags, bulk handling, front loaders, bins and conveyors at waist height, and harvest rigs that carry the crates alongside the pickers all cut the lifting ([[lifting-principles]]).

### Tractors and machines
| Hazard | What happens | What helps |
|---|---|---|
| Overturns | a leading cause of death on farms | a roll-over protective structure (ROPS) **and** the seat belt worn |
| Whole-body vibration | rough fields often bring exposure near or above the EU action value (0.5 m/s² A(8)) | suspended seats, cab and axle suspension, tyre pressures, speed |
| Twisted posture | watching an implement behind turns the neck and trunk for hours | swivel seats, mirrors and cameras, front-mounted implements |
| Getting on and off | falls from steps and cabs | steps, handholds, three points of contact |
| Noise | older tractors without cabs are loud | cabs, maintenance, hearing protection |

NIOSH describes ROPS used with a seat belt as about 99 % effective in preventing death or serious injury in an overturn. The seat's position is defined from its seat index point (ISO 5353) and the forces, travel and placing of controls in ISO 15077.

### People and settings
Family farms include children and older people; seasonal and migrant crews may not share the language of the instructions — pictures and demonstration work better than text. Women farmers often use machines and tools sized for men. Heat and sun, chemicals in hot PPE, and harvest nights are covered in [[outdoor-heat-sun]], [[ppe-ergonomics]] and [[sustained-operations]].

> [!warn] Most tractor overturn deaths happen to drivers who were not protected by a ROPS or not wearing the seat belt. Keep the ROPS up and the belt on.

> [!key] Bring the crop to the worker or the worker to the crop: raised crops, supports and carts; mechanise the heaviest lifts; suspend the seat and turn the driver to the work — and never ride without roll-over protection.
`,
  ideas: [
    'Stooping over low crops bends the trunk 60–90° for hours; ISO 11226 treats more than 60° as not acceptable.',
    'The lower-back moment is the upper body\'s weight times its lever arm: about 120 N·m at 60° for a 70 kg person.',
    'Raised crops, harvest platforms, carts and long-handled tools remove the stoop.',
    'Tractors bring overturns, whole-body vibration and twisted postures; ROPS with a seat belt prevents most overturn deaths.',
    'Piece rates, seasonal peaks and language barriers make the organisation of farm work as important as its tools.'
  ],
  pitfalls: [
    'Stooping is fine if you lift nothing — The upper body itself is the load: about 47 kg held on a 0.3 m lever for hours.',
    'Kneeling solves stooped work — It spares the back but loads the knees; a raised crop or a support removes both.',
    'A roll bar is enough without a belt — Without the seat belt the driver can be thrown out and crushed by the frame meant to protect them.'
  ],
  formulas: [
    {
      name: 'Moment on the lower back when stooping',
      expr: 'M = mu*g*d*sin(theta)', tex: 'M = m_u\\,g\\,d\\,\\sin\\theta',
      vars: {
        M: { name: 'moment about the lower spine', q: 'torque', unit: 'N·m', tex: 'M' },
        mu: { name: 'mass of head, arms and trunk (about 0.68 of body mass)', q: 'mass', unit: 'kg', value: 47.5, tex: 'm_u' },
        g: { const: 'g' },
        d: { name: 'distance from the lower spine to the upper body\'s centre of mass', q: 'length', unit: 'mm', value: 306, tex: 'd' },
        theta: { name: 'trunk inclination from vertical', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'A static estimate, arms hanging; anything held in the hands adds its weight times its own lever arm. Segment masses after Winter (head, arms and trunk ≈ 0.68 of body mass, centre about 0.63 of the way from hip to shoulder).',
      stories: { M: 'A picker\'s upper body weighs {mu} with its centre {d} from the lower back. What is the moment when stooped at {theta}?', theta: 'At what trunk angle does an upper body of {mu} at {d} produce a moment of {M}?' }
    },
    {
      name: 'Compression on the lower spine',
      expr: 'Fc = M/r + mu*g*cos(theta)', tex: 'F_c = \\frac{M}{r} + m_u\\,g\\,\\cos\\theta',
      vars: {
        Fc: { name: 'compressive force on the lower spine', q: 'force', unit: 'N', tex: 'F_c' },
        M: { name: 'moment about the lower spine', q: 'torque', unit: 'N·m', value: 123.6, tex: 'M' },
        r: { name: 'lever arm of the back muscles', q: 'length', unit: 'mm', value: 50, tex: 'r' },
        mu: { name: 'mass of head, arms and trunk', q: 'mass', unit: 'kg', value: 47.5, tex: 'm_u' },
        g: { const: 'g' },
        theta: { name: 'trunk inclination from vertical', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The back muscles, about 5 cm behind the spine, must pull M/r; the part of the upper body\'s weight along the spine adds to it. NIOSH used 3.4 kN as a design limit for lifting.',
      stories: { Fc: 'A moment of {M} is balanced by back muscles with a lever arm of {r}; the upper body of {mu} is inclined {theta}. What is the compression?' }
    }
  ],
  examples: [
    {
      title: 'Picking strawberries at ground level',
      q: 'A 70 kg, 1.70 m picker stoops to strawberries with straight legs, the trunk at 60°. Estimate the lower-back moment and compression, and judge the posture by ISO 11226.',
      steps: [
        'Upper body: $0.678 \\times 70 = 47.5$ kg. Hip to shoulder is about $0.288 \\times 1700 = 490$ mm, so the centre is about $0.626 \\times 490 = 306$ mm from the lower back.',
        { text: 'Moment:', tex: 'M = 47.5 \\times 9.81 \\times 0.306 \\times \\sin 60^\\circ = 124\\ \\mathrm{N\\,m}' },
        'Compression: $124/0.05 + 47.5 \\times 9.81 \\times \\cos 60^\\circ = 2470 + 233 \\approx 2700$ N.',
        'ISO 11226: 60° is at the edge of "not acceptable", and here it is held for hours. A table-top crop at waist height removes it.'
      ],
      a: 'About 124 N·m and 2.7 kN, held for hours — unacceptable as a sustained posture.'
    }
  ],
  quiz: [
    { q: 'By ISO 11226, how is a trunk held inclined at 70° judged?', choices: ['Not acceptable', 'Acceptable for any duration', 'Acceptable if the person is fit', 'Acceptable if the legs are straight'], a: 0, why: 'Beyond 60° of trunk inclination ISO 11226 treats a sustained posture as not acceptable; 20–60° only for limited times or with support.' },
    { q: 'Which change removes stooping from strawberry picking most completely?', choices: ['Growing the crop on table-tops at about waist height', 'Giving pickers knee pads', 'Paying by the kilogram', 'Picking faster to finish earlier'], a: 0, why: 'Bringing the crop to the worker removes the bend; knee pads move the load to the knees, and piece rates discourage rest.' },
    { q: 'A tractor roll-over protective structure protects the driver even without the seat belt.', a: false, why: 'Without the belt the driver can be thrown from the seat and crushed by the tractor or the frame itself; ROPS works with the belt worn.' },
    { q: 'Why is looking back at an implement for hours an ergonomic problem?', choices: ['It holds the neck and trunk twisted, a static awkward posture', 'It makes the tractor slower', 'It raises the noise level', 'It increases fuel use'], a: 0, why: 'Sustained trunk and neck rotation loads muscles statically; swivel seats, mirrors, cameras and front-mounted implements help.' },
    { q: 'An upper body of 47.5 kg has its centre 0.3 m from the lower back. What is the moment (N·m) with the trunk at 90°?', answer: 140, unit: 'N·m', why: '$47.5 \\times 9.81 \\times 0.3 \\times \\sin 90^\\circ = 140$ N·m.' }
  ],
  problems: [
    { q: 'A 60 kg picker (upper body 0.678 of body mass, centre 0.28 m from the lower back) stoops at 45°. What is the moment on the lower back?', answer: 79, unit: 'N·m', tol: 0.02, steps: ['$m_u = 0.678 \\times 60 = 40.7$ kg.', '$M = 40.7 \\times 9.81 \\times 0.28 \\times \\sin 45^\\circ = 79$ N·m.'] }
  ],
  ranges: [
    { dim: 'Trunk inclination held for long periods', range: [null, 20], unit: '°', who: 'Anyone picking, weeding or tending low crops', why: 'Acceptable without time limits; 20–60° only for limited times or with support; beyond 60° not acceptable.', limits: 'Twisting and sideways bending are judged separately; repetition adds risk.', setting: 'field', src: 'ISO 11226' },
    { dim: 'Height of a crop, bench or conveyor for harvesting standing', range: [820, 1110], unit: 'mm', who: 'Light-work height (100–150 mm below the elbow) of the 5th-percentile woman to the 95th-percentile man, in boots', why: 'Hands work at the light-work height with an upright trunk.', limits: 'A fixed height fits part of the crew; adjustable supports or platforms fit the rest.', setting: 'field', src: 'Representative body data; Kroemer and Grandjean' },
    { dim: 'Tractor driver\'s whole-body vibration, A(8)', range: [null, 0.5], unit: 'm/s²', who: 'Tractor and harvester drivers', why: 'The EU action value: below it, vibration risk to the back is low.', limits: 'Rough fields and fast transport often exceed it; the limit value is 1.15 m/s².', setting: 'field', src: 'Directive 2002/44/EC; ISO 2631-1' },
    { dim: 'Bags of feed, seed and fertiliser handled by hand', range: [null, 25], unit: 'kg', who: 'Farm workers of every size', why: 'Keeps single lifts near the limits of manual-handling guidance.', limits: 'Lifts from the ground or a trailer bed are harder; bulk handling is better.', setting: 'field', src: 'ISO 11228-1; common European practice' }
  ],
  applications: [
    'Table-top and raised-bed growing, and harvest platforms on which pickers lie supported.',
    'Suspended tractor seats, cabs with swivel seats and rear-view cameras.',
    'ROPS retrofits and seat-belt campaigns.',
    'Harvest rigs with conveyors that bring crates to the pickers.'
  ],
  history: 'For decades Californian farm workers weeded and thinned with the short-handled hoe, *el cortito*, which forced them to work bent double. After a long campaign by farm workers and their lawyers, the state\'s Division of Industrial Safety banned it in 1975 — one of the first legal victories for agricultural ergonomics, and long-handled tools replaced it.',
  sources: [
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'ISO 5353, *Earth-moving machinery, and tractors and machinery for agriculture and forestry — Seat index point*.',
    'ISO 15077, *Tractors and self-propelled machinery for agriculture — Operator controls — Actuating forces, displacement, location and method of operation*.',
    'ISO 4254-1, *Agricultural machinery — Safety — Part 1: General requirements*.',
    'Directive 2002/44/EC (vibration) and ISO 2631-1 (whole-body vibration).',
    'D. A. Winter, *Biomechanics and Motor Control of Human Movement*, anthropometric segment data.'
  ],
  sim: 'mf-stoop-harvest'
},

{
  id: 'outdoor-heat-sun', parent: 'field-topic', title: 'Sun and heat outdoors', level: 1,
  short: 'Outdoor workers get two things from the sun: heat and ultraviolet radiation. Both are predictable hour by hour — the WBGT from humidity, sun and air, the UV index from the height of the sun — so heavy work can be moved to cooler hours, shade put up, and skin and eyes covered when the UV index reaches 3.',
  keywords: ['outdoor work', 'heat', 'sun', 'WBGT outdoors', 'globe temperature', 'humidity', 'work–rest cycle', 'shade', 'ultraviolet', 'UV index', 'skin cancer', 'sunscreen', 'hat brim', 'sunglasses', 'acclimatisation', 'heat rules', 'California heat standard', 'midday work ban'],
  prereq: ['heat-stress', 'thermal-comfort'],
  related: ['extreme-environments', 'construction-ergonomics', 'agriculture-ergonomics', 'ppe-ergonomics', 'work-rest-scheduling', 'load-carriage', 'field-computing', 'glare-colour', 'medicine:heat-cold', 'medicine:cancer-prevention', 'physics:thermal-radiation'],
  body: `
Builders, farm and forestry workers, road crews, postal workers, soldiers and lifeguards work in weather they cannot control. The sun brings two hazards: **heat** — the air, plus radiant heat from the sun and hot surfaces, plus humidity — and **ultraviolet radiation**. Both follow the sun, hour by hour, so both can be planned for.

### Heat in the sun
Outdoors in sunshine ISO 7243 weighs the natural wet bulb (humidity and air movement), the black globe (sun and radiant heat) and the air:
$$\\mathrm{WBGT} = 0.7\\,t_{nw} + 0.2\\,t_g + 0.1\\,t_a$$
In full sun a black globe reads roughly 10–15 °C above the air ([[physics:thermal-radiation|thermal radiation]]); shade takes most of that away. Humidity counts most — the wet bulb carries 70 % of the weight — so a humid 30 °C morning can be worse than a dry 35 °C afternoon. Compare the WBGT with the reference value for the work:

| Work rate | Examples | Reference WBGT, acclimatised | Not acclimatised |
|---|---|---|---|
| Resting | sitting in shade | 33 °C | 32 °C |
| Low | light hand work, driving | 30 °C | 29 °C |
| Moderate | walking with a load, hoeing, laying bricks | 28 °C | 26 °C |
| High | shovelling, digging, carrying heavy loads | 26 °C | 23 °C |
| Very high | very intense work at a fast pace | 25 °C | 20 °C |

Above the reference, lighten or shorten the work: rest in shade for 15, 30 or 45 minutes of each hour, move heavy work to the early morning, drink small amounts often, work in pairs who watch each other, and build up new workers over one to two weeks ([[extreme-environments]], [the heat-stress calculator](#/tools/environment/heat)).

**Rules differ.** In the US, California has required shade from 80 °F (26.7 °C), extra procedures from 95 °F (35 °C) and about a litre of water per worker per hour since 2005; federal OSHA proposed a national heat standard in 2024. The EU has no heat limit value — heat falls under the general duty to assess risks — and several southern European countries restrict outdoor work in the hottest hours during heat alerts; several Gulf states ban outdoor work around midday in summer.

### Ultraviolet
The UV index (WHO) runs from 1–2 (low) through 3–5 (moderate), 6–7 (high) and 8–10 (very high) to 11 and above (extreme); protection is needed from 3. It depends above all on how high the sun is — on a clear day roughly $\\mathrm{UVI} \\approx 12.5\\,\\sin^{2.42}$ of the sun's elevation (Madronich, 2007) — and also on ozone, cloud, altitude and reflection: fresh snow reflects up to about 80 % of UV. Thin cloud lets most of it through. Outdoor workers receive several times the UV of indoor workers, and WHO and ILO estimates (2023) put nearly a third of deaths from non-melanoma skin cancer down to working outdoors in the sun ([[medicine:cancer-prevention|preventing cancer]]).

### Controls, most effective first
1. **Schedule**: heavy work in the cooler hours; tasks in shade around solar noon, when heat and UV peak.
2. **Shade**: canopies on machines and cabs, portable shelters, working on the shaded side.
3. **Clothing**: loose, light, tightly woven long sleeves and trousers; hard-hat brims and neck flaps; a broad-brimmed hat where no helmet is needed.
4. **Eyes**: sunglasses or safety glasses that block UV; tinted filters for glare ([[glare-colour]]).
5. **Skin**: broad-spectrum sunscreen of SPF 30 or more on what clothing leaves bare, reapplied every two hours.
6. **Water, rest and watching each other.**

Clothing that blocks UV can add heat; the answer is loose, breathable, light-coloured fabric, not bare skin.

### Settings
Field work of every kind; the military, where armour and helmets add heat ([[load-carriage]]); and civil life — outdoor events, sport, gardening. Screens outdoors fight the same sun ([[field-computing]]).

### In the simulation
A working day outdoors: choose the latitude, the date, the sky and the humidity, and the work. The graph shows WBGT and the UV index hour by hour, with the reference for the work; hours over the reference and with UV index 3 or more are marked. Move the heavy work to the morning, or put up shade, and see what changes.

> [!warn] Heat stroke — confusion, collapse, hot skin — is an emergency: call your local emergency number and cool the person at once ([[medicine:heat-cold|heatstroke and hypothermia]]).

> [!key] Plan outdoor work by the sun: heavy work early, shade at midday, water and rest by the WBGT, and skin and eyes covered whenever the UV index is 3 or more.
`,
  ideas: [
    'Outdoors, the WBGT weighs humidity (wet bulb 70 %), sun (globe 20 %) and air (10 %).',
    'The same air temperature can be safe when dry and dangerous when humid.',
    'The UV index follows the height of the sun; protection is needed from 3 upwards, and thin cloud does not stop it.',
    'Scheduling and shade come first; clothing, hats, glasses and sunscreen cover what is left.',
    'Rules differ: some places set temperature triggers or midday bans; others rely on risk assessment.'
  ],
  pitfalls: [
    'A cloudy day needs no sun protection — Thin or broken cloud lets most UV through; check the UV index, not the brightness.',
    'The air temperature says how hot the work is — Humidity and sun change the heat stress by several degrees; use the WBGT.',
    'Short sleeves are cooler, so better in the sun — Loose, light, tightly woven sleeves block UV and can be as cool, especially with shade and air movement.'
  ],
  formulas: [
    {
      name: 'WBGT outdoors in sunshine',
      expr: 'Wb = 0.7*tnw + 0.2*tg + 0.1*ta', tex: '\\mathrm{WBGT} = 0.7\\,t_{nw} + 0.2\\,t_g + 0.1\\,t_a',
      vars: {
        Wb: { name: 'wet-bulb globe temperature', q: 'temperature', unit: '°C', tex: '\\mathrm{WBGT}' },
        tnw: { name: 'natural wet-bulb temperature', q: 'temperature', unit: '°C', value: 25, tex: 't_{nw}' },
        tg: { name: 'black-globe temperature', q: 'temperature', unit: '°C', value: 45, tex: 't_g' },
        ta: { name: 'air temperature', q: 'temperature', unit: '°C', value: 32, tex: 't_a' }
      },
      note: 'ISO 7243. Indoors or in shade without sun: 0.7 t_nw + 0.3 t_g.',
      stories: { Wb: 'In the sun the natural wet bulb reads {tnw}, the globe {tg} and the air {ta}. What is the WBGT?', tnw: 'The globe reads {tg} and the air {ta}; the WBGT must stay at {Wb}. What natural wet-bulb temperature is that?' }
    },
    {
      name: 'Clear-sky UV index from the sun\'s elevation',
      expr: 'U = 12.5*sin(el)^2.42*(O/300)^(-1.23)', tex: '\\mathrm{UVI} = 12.5\\,\\sin^{2.42}\\!\\alpha \\left(\\frac{\\Omega}{300}\\right)^{-1.23}',
      vars: {
        U: { name: 'UV index', tex: '\\mathrm{UVI}' },
        el: { name: 'elevation of the sun above the horizon', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\alpha' },
        O: { name: 'ozone column (Dobson units)', value: 300, min: 150, max: 500, tex: '\\Omega' }
      },
      note: 'Madronich (2007): a clear sky at sea level. Cloud lowers it, altitude and snow raise it.',
      stories: { U: 'On a clear day the sun is {el} above the horizon and the ozone column is {O} DU. What is the UV index?', el: 'How high must the sun be for a clear-sky UV index of {U} (ozone {O} DU)?' }
    }
  ],
  examples: [
    {
      title: 'A humid morning or a dry afternoon?',
      q: 'Morning: air 30 °C, humid, natural wet bulb 27 °C, globe 42 °C. Afternoon: air 35 °C, dry, natural wet bulb 22 °C, globe 47 °C. Which is worse for moderate work (reference 28 °C, acclimatised)?',
      steps: [
        'Morning: $0.7 \\times 27 + 0.2 \\times 42 + 0.1 \\times 30 = 30.3$ °C.',
        'Afternoon: $0.7 \\times 22 + 0.2 \\times 47 + 0.1 \\times 35 = 28.3$ °C.',
        'The humid morning is 2 °C worse, although it feels 5 °C cooler: over the reference, so work–rest cycles and shade are needed then too.'
      ],
      a: 'The humid morning: WBGT 30.3 °C against 28.3 °C.'
    },
    {
      title: 'UV at midsummer noon',
      q: 'At midsummer the noon sun stands at 90° − latitude + 23.4°. Estimate the clear-sky UV index at 32° N (ozone 300 DU) and at 52° N (ozone 340 DU).',
      steps: [
        '32° N: elevation $90 - 32 + 23.4 = 81.4°$; $\\mathrm{UVI} = 12.5 \\times \\sin^{2.42} 81.4° = 12.2$ — extreme.',
        '52° N: elevation 61.4°; $12.5 \\times 0.730 \\times (340/300)^{-1.23} = 7.8$ — high.',
        'Both need protection for hours around noon; at 32° N even the morning and afternoon reach "high".'
      ],
      a: 'About 12 at 32° N and 8 at 52° N.'
    }
  ],
  quiz: [
    { q: 'Which reading has the most weight in the outdoor WBGT?', choices: ['The natural wet bulb (humidity)', 'The black globe (sun)', 'The air temperature', 'All three equally'], a: 0, why: 'The weights are 0.7, 0.2 and 0.1: humidity, through the wet bulb, dominates.' },
    { q: 'From what UV index is sun protection recommended?', choices: ['3', '8', '11', '1'], a: 0, why: 'WHO\'s scale calls 3–5 moderate and recommends protection from 3 upwards.' },
    { q: 'On an overcast day the UV index is always low.', a: false, why: 'Thin and broken cloud lets much of the UV through, and broken cloud can even raise it for a while.' },
    { q: 'Which control for heat on a road crew comes first?', choices: ['Scheduling heavy work into the cooler hours and providing shade', 'Issuing cooling towels', 'Asking workers to drink more', 'Shorter sleeves'], a: 0, why: 'Changing when and where the work happens removes the most heat; water, rest and clothing then handle what remains.' },
    { q: 'Natural wet bulb 26 °C, globe 44 °C, air 31 °C, in the sun. What is the WBGT (°C)?', answer: 30.1, unit: '°C', why: '$0.7 \\times 26 + 0.2 \\times 44 + 0.1 \\times 31 = 18.2 + 8.8 + 3.1 = 30.1$ °C.' }
  ],
  problems: [
    { q: 'In the sun the natural wet bulb reads 25 °C, the globe 45 °C and the air 32 °C. What is the WBGT?', answer: 29.7, unit: '°C', tol: 0.01, steps: ['$0.7 \\times 25 + 0.2 \\times 45 + 0.1 \\times 32 = 17.5 + 9.0 + 3.2 = 29.7$ °C.'] },
    { q: 'What is the clear-sky UV index when the sun is 70° above the horizon and the ozone column is 300 DU?', answer: 10.8, tol: 0.02, steps: ['$\\sin 70° = 0.940$; $0.940^{2.42} = 0.860$.', '$\\mathrm{UVI} = 12.5 \\times 0.860 = 10.8$ — very high.'] }
  ],
  ranges: [
    { dim: 'WBGT reference for moderate work', range: [26, 28], unit: '°C', who: '26 °C not acclimatised, 28 °C acclimatised, in ordinary work clothes', why: 'Below it, moderate work can go on without excessive heat strain.', limits: 'Lower for heavy work, higher for light; add a clothing adjustment for PPE and armour.', setting: 'field', src: 'ISO 7243:2017' },
    { dim: 'Rest in shade per hour when over the reference', range: '15, 30 or 45 min, as the excess grows', who: 'Everyone doing the work', why: 'Brings the average heat load back to what the body can shed.', limits: 'Only works if the rest is really in shade and cool; very hot conditions call for stopping.', setting: ['field', 'military'], src: 'ACGIH work–rest guidance; ISO 7243' },
    { dim: 'UV index from which skin and eyes are protected', range: [3, null], unit: 'UVI', who: 'All outdoor workers, whatever their skin type', why: 'Cuts sunburn, eye damage and skin cancer over a working life.', limits: 'Snow, water and altitude raise exposure; reflection reaches under hats.', setting: ['field', 'military'], src: 'WHO, *Global Solar UV Index: A Practical Guide* (2002)' },
    { dim: 'Sunscreen on skin left bare', range: 'SPF 30 or more, broad-spectrum, reapplied every 2 h', who: 'Outdoor workers', why: 'Covers what clothing and shade cannot.', limits: 'Sweat and rubbing remove it; it comes after shade and clothing, not before.', setting: 'field', src: 'Cancer Council Australia and WHO sun-protection guidance' },
    { dim: 'Temperature triggers for outdoor work (California)', range: 'shade from 26.7 °C (80 °F); high-heat procedures from 35 °C (95 °F)', who: 'Outdoor workers in California', why: 'Clear, measurable triggers for shade, water, rest and supervision.', limits: 'One state\'s air-temperature rule; WBGT gives a fuller picture; other places differ.', setting: 'field', src: 'California Code of Regulations, Title 8, §3395' }
  ],
  applications: [
    'Daily heat and UV plans for road, farm and construction crews.',
    'Shade canopies on machines and portable shelters at work fronts.',
    'Hard-hat brims, neck flaps and UV-blocking safety glasses.',
    'Checking a site\'s heat stress in [the heat-stress calculator](#/tools/environment/heat).'
  ],
  sources: [
    'ISO 7243:2017, *Ergonomics of the thermal environment — Assessment of heat stress using the WBGT index*.',
    'World Health Organization, *Global Solar UV Index: A Practical Guide*, 2002.',
    'S. Madronich, "Analytic formula for the clear-sky UV index", *Photochemistry and Photobiology* 83 (2007).',
    'NIOSH, *Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments*, 2016.',
    'California Code of Regulations, Title 8, §3395, *Heat Illness Prevention in Outdoor Places of Employment*.',
    'J. C. Liljegren et al., "Modeling the wet bulb globe temperature using standard meteorological measurements", *Journal of Occupational and Environmental Hygiene* (2008).'
  ],
  sim: 'mf-sun-day'
},

{
  id: 'working-at-height', parent: 'field-topic', title: 'Working at height', level: 2,
  short: 'Falls from height kill more workers than almost anything else. Avoid the height, then prevent the fall with guardrails and platforms, then arrest it. Ergonomics sets the numbers: ladders at about 75° (1 out for 4 up), rails above the body\'s centre of mass (about 1–1.1 m), harnesses that fit, and clearance and rescue planned before anyone climbs.',
  keywords: ['working at height', 'fall', 'ladder', 'ladder angle', '1 in 4 rule', '75 degrees', 'guardrail', 'edge protection', 'toe board', 'centre of mass', 'scaffold', 'MEWP', 'full-body harness', 'fall arrest', 'energy absorber', 'fall clearance', 'suspension', 'rescue plan', 'Work at Height Regulations'],
  prereq: ['standing-dimensions', 'stairs-ergonomics', 'design-for-range'],
  related: ['construction-ergonomics', 'confined-spaces', 'ppe-ergonomics', 'maintenance-ergonomics', 'safety-distances', 'access-openings', 'mass-strength-data', 'personal-equipment-fit', 'physics:friction', 'physics:torque', 'physics:center-of-mass'],
  body: `
Falls from height are among the commonest causes of death at work — in construction above all — and many are from low heights: a ladder, a roof edge, a fragile skylight, the back of a truck. The order of controls is fixed in law in many countries (the UK's Work at Height Regulations 2005, US OSHA's fall-protection rules): **avoid** work at height where you can (assemble at ground level, long-handled tools, prefabrication); **prevent** falls with collective protection — guardrails, scaffolds, platforms, mobile elevating work platforms (MEWPs); only then **arrest** falls with nets or harnesses. Ladders are for short, light work. Ergonomics sets the dimensions of each so that people can work without defeating it.

### Choosing the means of access
| Angle of the route | Use | Why |
|---|---|---|
| up to about 20° | ramp | walk and carry upright |
| about 20–45° | stair | carry loads, descend facing forwards |
| about 45–75° | stepladder, ship's ladder | hands needed; descend facing the steps |
| about 75–90° | ladder | hands always needed; no loads |

(After ISO 14122-1 for access to machinery; see [[stairs-ergonomics]].)

### Ladders
- **Angle about 75°: one unit out for every four up** (the [[?inverse-trig|arctangent]] of 4 is 76°). Too shallow and the foot slides; too steep and the ladder tips back when the climber leans out. The friction the foot needs grows as the ladder flattens: for a 90 kg climber near the top of a 12 kg ladder, about 0.21 at 76° but 0.38 at 65° ([[physics:friction|friction]], [[physics:torque|torque]]).
- **Extend about 1 m above the landing** (OSHA: 3 ft), so there is something to hold when stepping off.
- **Three points of contact**, facing the ladder, the belt buckle between the stiles — no overreaching. Rungs 250–360 mm apart (OSHA: 10–14 in) suit the step of most adults.
- **Short and light**: UK guidance keeps ladders to tasks of up to about 30 minutes at a time with light loads; longer or heavier work needs a platform.

### Edge protection
The body's centre of mass stands about 55 % of stature above the soles — about 1.06 m for the 95th-percentile man in boots. A rail below it lets a stumbling person pivot over; a rail above it stops them. Hence top rails of about 1 m and more:

| Rule | Top rail | Other parts |
|---|---|---|
| UK Work at Height Regulations 2005 | at least 950 mm | gaps no more than 470 mm; toe board at least 150 mm |
| US OSHA construction | 42 ± 3 in (0.99–1.14 m) | mid-rail; toe board at least 3.5 in |
| EN 13374 (temporary edge protection) | at least 1.0 m | classes by slope and fall energy |
| ISO 14122-3 (machinery) | 1.1 m | knee rail, toe plate |

A 950 mm rail is below the centre of mass of many tall men — one reason machinery standards use 1.1 m. Watch the centre of mass against the rail in the simulation.

### Harnesses and fall arrest
A full-body harness (never a belt) spreads the arrest over the thighs, pelvis and chest; the attachment point is between the shoulder blades. It must fit: leg straps snug (a flat hand underneath), the chest strap mid-chest; harnesses come in sizes, some shaped for women, and are rated for a range of user mass — US standards cover 59–140 kg, European tests use 100 kg — so heavy workers with tools must check. Limits: free fall no more than 1.8 m; arrest force no more than 6 kN with a European energy absorber (8 kN in OSHA rules). The **clearance** below must hold the free fall, the absorber's tear-out (up to 1.75 m), harness stretch and a margin — often 5 m or more — so anchor above the attachment point.

**After a fall**, a person hanging still in a harness can lose consciousness within minutes to tens of minutes as blood pools in the legs. Rescue must be planned to be fast; relief straps let the person stand in loops meanwhile.

> [!warn] Never work at height without a rescue plan that works in minutes. Calling the emergency services is not a plan for someone hanging in a harness.

> [!key] Avoid, then prevent, then arrest. Set ladders at 1 in 4 and extend them 1 m; put rails above the body's centre of mass; fit harnesses to the person; plan clearance and rescue first.
`,
  ideas: [
    'Avoid work at height, then prevent falls with collective protection, then arrest them — in that order.',
    'A ladder at about 75° (1 out for 4 up) needs little friction at the foot and does not tip back.',
    'Guardrails must stand above the body\'s centre of mass, about 55 % of stature: 1–1.1 m for tall adults in boots.',
    'A harness must fit the person and the mass range; clearance below must cover free fall, absorber and stretch.',
    'Suspended people need rescue within minutes: plan it before anyone climbs.'
  ],
  pitfalls: [
    'A steeper ladder is always safer — Beyond about 80° a climber leaning out can tip it backwards; 75° balances slipping and tipping.',
    'Any rail at waist height will do — A rail below the centre of mass lets a person pivot over it; tall workers need about 1.1 m.',
    'Once a fall is arrested the worker is safe — Hanging motionless in a harness can cause fainting within minutes; rescue is part of the system.'
  ],
  formulas: [
    {
      name: 'Friction needed at the foot of a ladder',
      expr: 'f = (ml*Ll/2 + mp*s)/((ml + mp)*Ll*tan(theta))', tex: 'f = \\frac{m_l\\,L/2 + m_p\\,s}{(m_l + m_p)\\,L\\,\\tan\\theta}',
      vars: {
        f: { name: 'friction coefficient needed at the foot', tex: 'f' },
        ml: { name: 'ladder mass', q: 'mass', unit: 'kg', value: 12, tex: 'm_l' },
        mp: { name: 'climber with tools', q: 'mass', unit: 'kg', value: 90, tex: 'm_p' },
        Ll: { name: 'ladder length to the top support', q: 'length', unit: 'm', value: 5, tex: 'L' },
        s: { name: 'climber\'s distance up the ladder', q: 'length', unit: 'm', value: 4.5, tex: 's' },
        theta: { name: 'ladder angle to the ground', q: 'angle', unit: '°', value: 75.5, min: 45, max: 89, tex: '\\theta' }
      },
      note: 'Statics with a smooth wall at the top: the wall pushes sideways, and the foot must supply the same sideways force by friction. It ignores climbing dynamics and leaning out, which need more.',
      stories: { f: 'A {mp} climber stands {s} up a {Ll} ladder of {ml} set at {theta}. What friction coefficient does the foot need?', theta: 'The foot of a {Ll} ladder ({ml}) can supply a friction coefficient of {f}. At what angle can a {mp} climber reach {s} up it?' }
    },
    {
      name: 'Ladder angle from the one-in-four rule',
      expr: 'theta = atan(hs/b)', tex: '\\theta = \\arctan\\frac{h}{b}',
      vars: {
        theta: { name: 'ladder angle to the ground', q: 'angle', unit: '°', tex: '\\theta' },
        hs: { name: 'height of the top support', q: 'length', unit: 'm', value: 4, tex: 'h' },
        b: { name: 'distance of the foot from the wall', q: 'length', unit: 'm', value: 1, tex: 'b' }
      },
      note: 'One out for four up gives arctan 4 = 76°; guidance rounds it to 75°.',
      stories: { theta: 'A ladder rests on a wall {hs} up with its foot {b} out. What is its angle?', b: 'A ladder must rest {hs} up a wall at {theta}. How far out is its foot?' }
    },
    {
      name: 'Clearance needed below a fall-arrest anchor',
      expr: 'C = Ly - ha + dd + hs + sm', tex: 'C = L_y - h_a + d_d + h_s + s_m',
      vars: {
        C: { name: 'clearance needed below the working surface', q: 'length', unit: 'm', tex: 'C' },
        Ly: { name: 'lanyard length', q: 'length', unit: 'm', value: 1.8, tex: 'L_y' },
        ha: { name: 'anchor height above the harness attachment (negative if below)', q: 'length', unit: 'm', value: 0, signed: true, tex: 'h_a' },
        dd: { name: 'energy-absorber extension', q: 'length', unit: 'm', value: 1.75, tex: 'd_d' },
        hs: { name: 'harness stretch and attachment shift', q: 'length', unit: 'm', value: 0.3, tex: 'h_s' },
        sm: { name: 'safety margin', q: 'length', unit: 'm', value: 1, tex: 's_m' }
      },
      note: 'Ly − ha is the free fall of the attachment point (at most 1.8 m). The feet start on the working surface and fall the same distance, so the body height cancels out.',
      stories: { C: 'A {Ly} lanyard is anchored {ha} above the harness attachment; the absorber extends {dd}, the harness {hs}, and the margin is {sm}. How much clear space is needed below the working surface?' }
    }
  ],
  examples: [
    {
      title: 'Setting a ladder',
      q: 'A ladder rests on a gutter 5.6 m up. Where should its foot go, how long must it be to the support, and what friction does its foot need with a 90 kg climber 5 m up (ladder 12 kg)? Compare with 65°.',
      steps: [
        'One in four: the foot $5.6/4 = 1.4$ m out; angle $\\arctan 4 = 76°$; length to the support $\\sqrt{5.6^2 + 1.4^2} = 5.77$ m — plus about 1 m above the gutter to hold on to.',
        { text: 'Friction needed:', tex: 'f = \\frac{12 \\times 2.89 + 90 \\times 5}{102 \\times 5.77 \\times \\tan 76^\\circ} = 0.21' },
        'At 65° the same ladder needs $f = 0.38$ — more than a rubber foot on wet or dusty ground can be relied on to give.'
      ],
      a: 'Foot 1.4 m out, 5.8 m to the support (about 6.8 m in all); friction 0.21 at 76°, 0.38 at 65°.'
    },
    {
      title: 'How high a rail?',
      q: 'The centre of mass stands at about 55 % of stature. With 30 mm boots, where is it for the 95th-percentile man (1870 mm) and the median woman (1625 mm)? Compare with rail heights.',
      steps: [
        '95th man: $0.55 \\times 1870 + 30 = 1059$ mm. Median woman: $0.55 \\times 1625 + 30 = 924$ mm.',
        'A 950 mm rail is above the woman\'s centre of mass but about 110 mm below the tall man\'s; a 42 in (1067 mm) OSHA rail just clears his; 1.1 m (ISO 14122-3) clears the 99th percentile (1085 mm).',
        'Tall workers leaning on a low rail are the case to design for.'
      ],
      a: 'About 1.06 m and 0.92 m: rails of 1.0–1.1 m are needed for tall users.'
    },
    {
      title: 'Clearance below a harness',
      q: 'A worker is anchored with a 1.8 m lanyard at the height of the harness attachment. The absorber may extend 1.75 m, the harness stretches 0.3 m, and the margin is 1 m. How much clear space must there be below the platform? What if the anchor were at the feet (1.5 m below the attachment)?',
      steps: [
        'Anchor level with the attachment: $C = 1.8 - 0 + 1.75 + 0.3 + 1.0 = 4.85$ m.',
        'Anchor at the feet: $h_a = -1.5$ m, so the free fall is 3.3 m — beyond the 1.8 m limit, and $C = 6.35$ m.',
        'Anchor overhead, or use a self-retracting lifeline, to shorten both.'
      ],
      a: 'About 4.9 m; anchoring at the feet would need 6.4 m and exceed the free-fall limit.'
    }
  ],
  quiz: [
    { q: 'A ladder must reach 4 m up a wall. How far from the wall should its foot be?', choices: ['About 1 m', 'About 2 m', 'About 0.5 m', 'As close as possible'], a: 0, why: 'One out for every four up: 4/4 = 1 m, an angle of about 76°.' },
    { q: 'Why are guardrails set at about 1 m or more?', choices: ['To be above the body\'s centre of mass, so a stumbling person cannot pivot over', 'To match standard timber lengths', 'To be at hand height for everyone', 'Because lower rails are harder to install'], a: 0, why: 'The centre of mass is about 55 % of stature above the soles; a rail below it acts as a pivot.' },
    { q: 'Once a harness has arrested a fall, the worker is safe until help arrives.', a: false, why: 'A person hanging still can faint within minutes as blood pools in the legs; rescue must be planned to be quick.' },
    { q: 'Where should a fall-arrest lanyard be anchored?', choices: ['Above the harness attachment point', 'At foot level', 'Anywhere, the absorber handles it', 'Below the platform'], a: 0, why: 'An overhead anchor shortens the free fall and the clearance needed; at foot level the free fall exceeds 1.8 m with a 1.8 m lanyard.' },
    { q: 'For a 90 kg climber near the top of a light ladder, what happens to the friction needed at the foot as the ladder is set flatter?', choices: ['It rises — at 65° nearly twice what it is at 76°', 'It falls', 'It does not change', 'It becomes zero'], a: 0, why: 'The wall\'s sideways push grows with 1/tan θ; 0.21 at 76° becomes 0.38 at 65°.' }
  ],
  problems: [
    { q: 'A 5 m ladder of 12 kg stands at 75.5°. A 90 kg climber is 4.5 m up. What friction coefficient must the foot supply?', answer: 0.221, tol: 0.02, steps: ['Numerator: $12 \\times 2.5 + 90 \\times 4.5 = 435$ kg·m.', 'Denominator: $102 \\times 5 \\times \\tan 75.5° = 510 \\times 3.867 = 1972$ kg·m.', '$f = 435/1972 = 0.221$.'] },
    { q: 'A 2 m lanyard is anchored 0.5 m above the harness attachment. The absorber extends up to 1.75 m, the harness stretches 0.3 m, and a 1 m margin is kept. What clearance is needed below the working surface?', answer: 4.55, unit: 'm', tol: 0.01, steps: ['Free fall: $2 - 0.5 = 1.5$ m.', '$C = 1.5 + 1.75 + 0.3 + 1 = 4.55$ m.'] }
  ],
  ranges: [
    { dim: 'Ladder angle', range: 'about 75° (1 out for every 4 up)', who: 'Anyone climbing a leaning ladder', why: 'Little friction needed at the foot, and no tipping back when leaning out.', limits: 'Still needs a firm, level footing and a secure top; not for heavy or long work.', setting: 'field', src: 'OSHA 29 CFR 1926.1053; HSE guidance on ladders' },
    { dim: 'Ladder extension above the landing', range: [900, null], unit: 'mm', who: 'Anyone stepping on or off at the top', why: 'Something to hold while stepping off and back on.', limits: 'Or a secure handhold of equal height; the ladder must be tied or footed.', setting: 'field', src: 'OSHA 29 CFR 1926.1053 (3 ft)' },
    { dim: 'Rung spacing of portable ladders', range: [254, 356], unit: 'mm', who: 'Most adults\' climbing step', why: 'A comfortable, even step up and down.', limits: 'Short people and people in bulky clothing prefer the lower end.', setting: 'field', src: 'OSHA 29 CFR 1926.1053 (10–14 in)' },
    { dim: 'Guardrail top height', range: [950, 1100], unit: 'mm', who: 'Above the centre of mass of tall adults in boots (about 1.06 m for the 95th-percentile man)', why: 'A stumbling person cannot pivot over the rail.', limits: 'The legal minimum depends on the country (UK ≥ 950 mm; OSHA 42 ± 3 in; EN 13374 ≥ 1.0 m; ISO 14122-3 1.1 m for machinery).', setting: ['field', 'military'], src: 'Work at Height Regulations 2005; OSHA 29 CFR 1926.502; EN 13374; ISO 14122-3' },
    { dim: 'Toe board height', range: '≥ 150 mm (UK); ≥ 3.5 in, 89 mm (US)', who: 'People and materials at an edge', why: 'Stops feet, tools and materials sliding off the edge.', limits: 'Higher brick guards or netting where materials are stacked.', setting: 'field', src: 'Work at Height Regulations 2005; OSHA 29 CFR 1926.502' },
    { dim: 'Free fall in a fall-arrest system', range: [null, 1.8], unit: 'm', who: 'The harness attachment point', why: 'Keeps the arrest force and the clearance needed within limits.', limits: 'Anchor overhead; anchoring at the feet doubles the fall.', setting: ['field', 'military'], src: 'OSHA 29 CFR 1926.502(d)' },
    { dim: 'Arrest force on the body', range: [null, 6], unit: 'kN', who: 'A worker in a full-body harness with a European energy absorber (OSHA allows 8 kN)', why: 'Keeps the arrest survivable without serious injury.', limits: 'Absorbers are tested with a 100 kg mass; heavier users need rated equipment.', setting: ['field', 'military'], src: 'EN 355; OSHA 29 CFR 1926.502(d)' },
    { dim: 'User mass range of a fall-arrest harness', range: [59, 140], unit: 'kg', who: 'Users with clothing and tools (130–310 lb)', why: 'The harness and absorber work as tested.', limits: 'European tests use 100 kg; check the rating against the real worker with tools.', setting: ['field', 'military'], src: 'ANSI/ASSP Z359 (US); EN 361 and EN 355' }
  ],
  applications: [
    'Mobile elevating work platforms and scaffolds instead of ladders for longer or heavier work.',
    'Edge protection at 1.0–1.1 m with mid-rails and toe boards on roofs and slabs.',
    'Harness fitting by size, with women\'s and large sizes, and rated user mass.',
    'Rescue plans and kits at every harness workplace.'
  ],
  sources: [
    'The Work at Height Regulations 2005 (UK).',
    'US OSHA, 29 CFR 1926 Subpart M (fall protection) and Subpart X (stairways and ladders).',
    'EN 13374, *Temporary edge protection systems*.',
    'ISO 14122-1 and -3, *Safety of machinery — Permanent means of access to machinery* (choice of access; stairs, stepladders and guard-rails).',
    'EN 361 (full-body harnesses) and EN 355 (energy absorbers); ANSI/ASSP Z359 fall-protection code.',
    'HSE, *Safe use of ladders and stepladders: a brief guide* (INDG455).'
  ],
  sim: 'mf-height'
},

{
  id: 'confined-spaces', parent: 'field-topic', title: 'Confined spaces', level: 2,
  short: 'Tanks, silos, sewers, vessels and voids are not built for people, and many who die in them went in to help. Ergonomics designs the entry out where it can, sizes openings for the largest person with harness and breathing apparatus, and plans a rescue that lifts an unconscious person out without anyone else going in.',
  keywords: ['confined space', 'permit-required confined space', 'manhole', 'access opening', 'tank entry', 'silo', 'sewer', 'vessel', 'oxygen deficiency', 'atmosphere testing', 'attendant', 'non-entry rescue', 'tripod and winch', 'retrieval harness', 'wristlets', 'breathing apparatus', 'ISO 15534', 'EN 547'],
  prereq: ['access-openings', 'standing-dimensions', 'clothing-ppe-allowances'],
  related: ['working-at-height', 'ppe-ergonomics', 'extreme-environments', 'maintenance-ergonomics', 'safety-distances', 'construction-ergonomics', 'agriculture-ergonomics', 'crew-stations', 'combining-percentiles'],
  body: `
A confined space is enclosed or largely enclosed, has limited ways in and out, and is not designed for people to work in continuously: tanks, silos, vessels, sewers, manholes, pits, ships' double bottoms, ducts, vaults. Its dangers are the atmosphere (too little oxygen, toxic or flammable gas), engulfment by grain, water or slurry, heat, and the difficulty of getting out — or of getting someone else out. Investigations have repeatedly found that many of the dead were would-be rescuers who went in unprotected. The law in most countries sets the system (the UK's Confined Spaces Regulations 1997; US OSHA's permit-required confined spaces rule, 29 CFR 1910.146); this page gives the ergonomic principles.

### First, avoid entry
The best confined space is one nobody enters. Designers can put inspection and cleaning outside: cameras and sensors, clean-in-place systems, removable covers, valves and instruments reached from outside, openings at the bottom as well as the top ([[maintenance-ergonomics]]).

### Openings sized for the body
If people must enter, the opening must pass the **largest** person in everything they will wear — clothing, harness, and for rescuers breathing apparatus — and must let a person be lifted out unconscious. For a vertical round entry the widest part of the body is the shoulders: in the representative data the 95th-percentile man's shoulder breadth is 526 mm and the 99th's 545 mm; clothing and a harness add a few tens of millimetres, and a margin is needed to move:
$$d = B_s + a_c + m$$
That gives about 600–650 mm. A breathing-apparatus cylinder adds depth behind the back — in a round opening the shoulders usually still decide, but in a narrow rectangular one the depth may. ISO 15534-1 and EN 547-1 give the method for access openings ([[access-openings]]). Smaller manholes, common on older tanks and vessels, exclude large workers and make rescue far harder. Openings in the side of a vessel should be low enough to step or be carried through, with clear space outside for a stretcher.

In the simulation, pass a person through an opening seen from above: change the size, the person and the equipment, and see who fits and how much clearance is left.

### Inside
The work is often done kneeling, lying or crouched in low, cramped spaces, in heat (tanks in the sun, steam), in poor light, with noise echoing off metal and with no line of sight to help. Plan shorter work periods and rests outside, lighting at safe voltages, ventilation, and a way to talk to the attendant (voice, radio or a line signal). Sizes matter inside too: a small person may be chosen to reach the far end of a vessel — then the rescue must reach them there.

### Rescue — the principles
- **An attendant stays outside** and never enters to rescue.
- **Non-entry rescue first**: entrants wear a harness attached to a retrieval line, with a tripod or davit and winch over vertical entries where possible.
- **A small profile**: the line is attached high on the back or above the head so that a limp body rises upright through the opening; wristlets can draw the arms overhead where a harness cannot be used.
- **Trained rescuers**, with breathing apparatus, who have practised in the actual openings.

### Settings
Utilities and field work (sewers, water tanks, cable vaults), agriculture (silos, grain bins, slurry pits), industry (vessels, boilers), shipping and the military (tanks, voids, fuel cells, vehicle hulls during maintenance) — each with its own openings and its own rescue problem.

> [!warn] The atmospheres that kill in confined spaces usually cannot be seen or smelled. Test, ventilate and never enter — nor go in to help someone — without the permit, equipment, attendant and rescue arrangements your law requires. If someone collapses inside, call for trained rescue at once.

> [!key] Design the entry out. If people must go in, size the opening for the largest person in harness and breathing apparatus, and plan a rescue that lifts an unconscious person out without anyone else entering.
`,
  ideas: [
    'Confined spaces kill through atmospheres that cannot be seen or smelled, engulfment and the difficulty of escape and rescue.',
    'Many victims are would-be rescuers: the attendant stays outside, and rescue is planned before entry.',
    'The best design removes the need to enter: inspection and cleaning from outside.',
    'Openings are sized for the largest user in harness and equipment: about 600–650 mm for a round vertical entry.',
    'Retrieval lines attach high on the back or above the head, so a limp body passes the opening upright.'
  ],
  pitfalls: [
    'If nothing can be smelled, the air is safe — Oxygen deficiency and many toxic gases give no warning; only testing tells.',
    'A small worker solves a small opening — It may get them in, but a rescue through the same opening, with breathing apparatus, may be impossible.',
    'A brave colleague can pull a collapsed person out — Without breathing apparatus and training the rescuer often becomes the next victim.'
  ],
  formulas: [
    {
      name: 'Diameter of a round opening for vertical entry',
      expr: 'd = Bs + ac + m', tex: 'd = B_s + a_c + m',
      vars: {
        d: { name: 'clear diameter of the opening', q: 'length', unit: 'mm', tex: 'd' },
        Bs: { name: 'shoulder breadth of the largest user', q: 'length', unit: 'mm', value: 545, tex: 'B_s' },
        ac: { name: 'allowance for clothing and harness', q: 'length', unit: 'mm', value: 30, tex: 'a_c' },
        m: { name: 'margin for movement', q: 'length', unit: 'mm', value: 50, tex: 'm' }
      },
      note: 'Representative shoulder breadth: 480 ± 28 mm (men), 415 ± 25 mm (women). Check the depth too when breathing apparatus is worn, and the standard\'s own values (ISO 15534-1, EN 547-1).',
      stories: { d: 'The largest user\'s shoulders are {Bs} across; clothing and harness add {ac} and the margin is {m}. How wide must a round opening be?', Bs: 'A manhole is {d} across. With {ac} of clothing and harness and a {m} margin, how broad may the shoulders be?' }
    },
    {
      name: 'Oxygen left when an inert gas displaces air',
      expr: 'o = 0.209*(1 - x)', tex: 'o = 20.9\\,\\% \\times (1 - x)',
      vars: {
        o: { name: 'oxygen concentration', q: 'ratio', unit: '%', tex: 'o' },
        x: { name: 'share of the air displaced by an inert gas (nitrogen, argon, carbon dioxide)', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: 'x' }
      },
      note: 'Air is 20.9 % oxygen. OSHA calls an atmosphere below 19.5 % oxygen deficient: displacing just 7 % of the air gets there.',
      stories: { o: 'An inert gas displaces {x} of the air in a tank. What is the oxygen concentration?', x: 'What share of the air must be displaced to bring the oxygen down to {o}?' }
    }
  ],
  examples: [
    {
      title: 'How big a manhole?',
      q: 'Men\'s shoulder breadth is 480 ± 28 mm. Size a round manhole for the 95th and for the 99th-percentile man with 30 mm for clothing and harness and a 50 mm margin.',
      steps: [
        '95th: $480 + 1.645 \\times 28 = 526$ mm; $d = 526 + 30 + 50 = 606$ mm.',
        '99th: $480 + 2.326 \\times 28 = 545$ mm; $d = 625$ mm.',
        'A 500 mm manhole would stop about half of men in a harness — and any rescuer in breathing apparatus.'
      ],
      a: 'About 610 mm (95th) to 625 mm (99th); 600–650 mm in practice.'
    },
    {
      title: 'A little nitrogen',
      q: 'A vessel was purged with nitrogen and then partly vented: 10 % of its atmosphere is still nitrogen from the purge. What is the oxygen concentration?',
      steps: [
        '$o = 20.9 \\times (1 - 0.10) = 18.8$ %.',
        'That is below OSHA\'s 19.5 % — oxygen deficient — although nothing can be seen or smelled.',
        'Only a calibrated gas detector at the top, middle and bottom of the space shows it.'
      ],
      a: 'About 18.8 %: deficient.'
    }
  ],
  quiz: [
    { q: 'In many confined-space incidents, who are a large share of the victims?', choices: ['Would-be rescuers who went in unprotected', 'People working alone at night', 'Only inexperienced workers', 'People with breathing apparatus'], a: 0, why: 'Investigations repeatedly find that unprotected rescuers make up a large share of confined-space deaths.' },
    { q: 'Which body dimension usually decides the size of a round vertical opening?', choices: ['Shoulder breadth of the largest user, plus clothing, harness and a margin', 'Stature', 'Hip breadth of the smallest user', 'Hand length'], a: 0, why: 'Passing vertically, the shoulders are the widest part of the body; the largest user limits a clearance.' },
    { q: 'If a tank does not smell, it is safe to enter.', a: false, why: 'Oxygen deficiency and many toxic gases have no smell; only testing shows the atmosphere.' },
    { q: 'Where should a retrieval line attach to an entrant\'s harness?', choices: ['High on the back or above the head', 'At the waist belt', 'At one ankle', 'Anywhere, if the winch is strong'], a: 0, why: 'A high attachment lifts a limp body upright, with the smallest profile, through the opening.' },
    { q: 'An inert gas displaces 10 % of the air in a space. What is the oxygen concentration (%)?', answer: 18.8, unit: '%', why: '$20.9 \\times 0.9 = 18.8$ % — below the 19.5 % OSHA threshold.' }
  ],
  problems: [
    { q: 'Size a round opening for the 95th-percentile man (shoulder breadth 526 mm) with 30 mm for clothing and harness and a 50 mm margin.', answer: 606, unit: 'mm', tol: 0.01, steps: ['$d = 526 + 30 + 50 = 606$ mm.'] },
    { q: 'What share of the air must an inert gas displace to bring the oxygen down to 19.5 %?', answer: 6.7, unit: '%', tol: 0.03, steps: ['$19.5 = 20.9 (1 - x)$, so $x = 1 - 19.5/20.9 = 0.067$: under 7 %.'] }
  ],
  ranges: [
    { dim: 'Round opening for vertical whole-body entry, with a harness', range: [600, 650], unit: 'mm', who: '95th to 99th-percentile man\'s shoulders (526–545 mm) plus about 30 mm of clothing and harness and a 50 mm margin', why: 'The largest workers pass, and a limp person can be lifted out upright.', limits: 'Rescuers with breathing apparatus, bulky clothing and awkward approaches need more; the standard\'s own values govern.', setting: 'field', src: 'Derived from representative body data; ISO 15534-1 and EN 547-1 for the method' },
    { dim: 'Oxygen concentration for entry', range: [19.5, 23.5], unit: '%', who: 'Everyone entering', why: 'Below 19.5 % judgement and strength fail; above 23.5 % fire risk rises sharply.', limits: 'Toxic and flammable gases must be tested too; conditions can change during the work.', setting: ['field', 'military'], src: 'OSHA 29 CFR 1910.146' },
    { dim: 'Flammable gas or vapour', range: [null, 10], unit: '% of the lower flammable limit', who: 'Everyone entering', why: 'Keeps a wide margin below an atmosphere that can ignite.', limits: 'Hot work needs stricter limits and continuous monitoring.', setting: ['field', 'military'], src: 'OSHA 29 CFR 1910.146' }
  ],
  applications: [
    'Vessels and tanks designed for inspection and cleaning from outside.',
    'Manholes of 600 mm and more on new tanks, vessels and sewers.',
    'Tripods, davits and winches over vertical entries, with retrieval harnesses.',
    'Rescue teams that practise in the actual openings of their site.'
  ],
  sources: [
    'US OSHA, 29 CFR 1910.146, *Permit-required confined spaces*.',
    'The Confined Spaces Regulations 1997 (UK), with HSE\'s approved code of practice *Safe work in confined spaces* (L101).',
    'ISO 15534-1, *Ergonomic design for the safety of machinery — Part 1: Principles for determining the dimensions required for openings for whole-body access into machinery*.',
    'EN 547-1, *Safety of machinery — Human body measurements — Part 1: Principles for determining the dimensions required for openings for whole body access into machinery*.',
    'NIOSH, *Preventing Occupational Fatalities in Confined Spaces* (alert, 1986).'
  ],
  sim: 'mf-manhole'
},

{
  id: 'ppe-ergonomics', parent: 'field-topic', title: 'Personal protective equipment people can work in', level: 2,
  short: 'PPE is the last line of defence, and it only protects when it is worn and fits. Gloves cost grip and dexterity, suits trap heat, respirators must seal on every face, hearing protectors can isolate, and much PPE was designed for the average man. Ergonomic PPE fits the person, works with the other PPE and lets the job be done.',
  keywords: ['personal protective equipment', 'PPE', 'gloves', 'dexterity', 'grip strength', 'glove size', 'respirator fit', 'fit test', 'fit factor', 'face shape', 'hearing protector', 'overprotection', 'heat burden', 'protective suit', 'high-visibility clothing', 'EN ISO 20471', 'PPE for women', 'compatibility', 'hierarchy of controls'],
  prereq: ['clothing-ppe-allowances', 'hand-foot-head', 'heat-stress'],
  related: ['personal-equipment-fit', 'extreme-environments', 'outdoor-heat-sun', 'hearing-protection', 'confined-spaces', 'working-at-height', 'construction-ergonomics', 'agriculture-ergonomics', 'strength-and-force', 'hand-tools', 'field-computing', 'sex-differences'],
  body: `
Personal protective equipment is the **last** line of defence — after removing the hazard, engineering it out and organising the work — but in field work it is often essential. PPE only protects when it is worn and fits. Equipment that is hot, heavy, clumsy, blocks sight or hearing, or slows the job is taken off, worn loose or defeated. Ergonomic PPE is PPE people can work in.

### What PPE costs the wearer
| PPE | The burden | Ergonomic answers |
|---|---|---|
| Gloves | less grip strength (commonly 10–30 %, more with thick gloves), dexterity and touch; more effort for the same grip | the right size, the thinnest glove that protects, textured palms |
| Protective clothing, suits | heat — sweat cannot evaporate; bulk; stiffness | breathable fabrics where the hazard allows, cooling, work–rest cycles, sizes |
| Respirators | breathing resistance, heat and damp in the mask, speech, seal on different faces | fit testing, several models and sizes, powered air for long wear |
| Hearing protection | isolation, missed warnings, heat under earmuffs | level-dependent and communication protectors; not over-protecting |
| Eye and face protection | fogging, scratches, narrower view, prescriptions | anti-fog coatings, prescription safety glasses, wrap-around shapes |
| Helmets | mass on the neck, heat | light ventilated shells, integrated eye and ear protection |
| High-visibility clothing | heat in summer, fit | mesh, sizes, the class matched to the risk |
| Safety footwear | weight, heat, poor fit | length and width fittings, light toecaps |

### Fit: the whole range of people
PPE designed around the average man fails the small, the large and many women: gloves too long in the fingers, respirators that do not seal on smaller or differently shaped faces, coveralls and harnesses cut for men, boots too wide. Surveys by UK trade unions (TUC, 2017) found many women working in PPE designed for men. Glove sizes 6 to 11 follow the hand's circumference in inches (EN ISO 21420): size 8 fits a hand about 203 mm round. For respirators, a quantitative fit test must reach a fit factor — the concentration outside divided by that inside — of at least 100 for a half mask and 500 for a full facepiece (OSHA). NIOSH replaced its fit-test panel, based on 1960s air-force data, with one from a survey of about 4000 respirator users of both sexes and many origins.

### Working together
Items must be compatible: glasses break a respirator's seal, earmuffs need the right helmet adaptor, a hood changes a helmet's fit, glove cuffs must meet sleeves. Test the whole ensemble on real users doing the real task.

### Heat
Protective clothing adds to heat stress by a few degrees of WBGT for double-layer clothing and around 10 °C or more for vapour-tight suits ([[extreme-environments]]). In the heat a suit can cut safe working time from hours to tens of minutes: plan cooling, shade and work–rest cycles — or choose a less burdensome ensemble when the hazard allows. Pesticide PPE on a hot farm is a classic trap ([[agriculture-ergonomics]]).

### Seeing, hearing and being seen
High-visibility clothing (EN ISO 20471) comes in three classes by the area of fluorescent and retroreflective material — class 3, the most visible, has at least 0.80 m² of fluorescent background and 0.20 m² of reflective tape. Hearing protectors should bring the level at the ear to about 70–75 dB(A): much lower isolates the wearer from speech and warning signals ([[hearing-protection]]); rated protection is rarely reached in real use, so estimates are derated.

### In the simulations
The first shows heat balance in PPE ensembles: at 30 °C and moderate work, compare work clothes with a protective suit. The second is the size tariff for gloves: see how many sizes a mixed workforce needs.

### Settings
Field (construction, farms, utilities), military (armour, protective suits — [[personal-equipment-fit]]), health care (gowns and respirators worn for whole shifts in epidemics, with skin damage and heat strain), industry.

> [!warn] PPE that does not fit does not protect. A respirator that does not seal, a harness too big, a glove too loose to grip — each gives false confidence.

> [!key] Choose PPE with the people who will wear it: sizes for the whole range, the lightest protection that works, compatible items tested together — and remember that PPE comes after removing the hazard, not instead of it.
`,
  ideas: [
    'PPE is the last line of defence, and it only protects when it is worn and fits.',
    'Gloves cost grip strength and dexterity; suits cost heat tolerance; respirators cost breathing ease and speech.',
    'PPE must fit the whole range of people, including women and small and large users, in sizes and shapes.',
    'Items must be compatible and tested together as an ensemble, on real users doing real tasks.',
    'Hearing protection should aim for about 70–75 dB(A) at the ear, not silence.'
  ],
  pitfalls: [
    'More protection is always better — Over-protective hearing defenders isolate; over-heavy suits cause heat illness; the right protection is the least that controls the hazard.',
    'One size fits most — Small people, large people and many women are left in PPE that leaks, slips or snags.',
    'The rating on the box is the protection people get — Real-world protection from hearing protectors and respirators is usually much lower than laboratory ratings; derate and fit-test.'
  ],
  formulas: [
    {
      name: 'Level at the ear under a hearing protector (OSHA derating)',
      expr: 'Lp = L - (NRR - 7)/2', tex: 'L_p = L - \\frac{\\mathrm{NRR} - 7}{2}',
      vars: {
        Lp: { name: 'estimated level at the ear', q: 'soundlevel', unit: 'dB', tex: 'L_p' },
        L: { name: 'workplace level, A-weighted', q: 'soundlevel', unit: 'dB', value: 100, tex: 'L' },
        NRR: { name: 'noise reduction rating on the label', q: 'soundlevel', unit: 'dB', value: 29, tex: '\\mathrm{NRR}' }
      },
      note: 'US practice: subtract 7 dB because the NRR is C-weighted, then halve for real-world fit. European ratings (SNR) are used differently. Aim for about 70–75 dB(A) at the ear.',
      stories: { Lp: 'A worker in {L} wears protectors labelled NRR {NRR}. What level reaches the ear, derated?', NRR: 'What NRR is needed to bring {L} down to {Lp} at the ear, derated?' }
    },
    {
      name: 'Respirator fit factor',
      expr: 'FF = Co/Ci', tex: '\\mathrm{FF} = \\frac{C_o}{C_i}',
      vars: {
        FF: { name: 'fit factor', tex: '\\mathrm{FF}' },
        Co: { name: 'particle concentration outside the mask', q: false, unit: 'particles/cm³', value: 5000, tex: 'C_o' },
        Ci: { name: 'particle concentration inside the mask', q: false, unit: 'particles/cm³', value: 25, tex: 'C_i' }
      },
      note: 'Measured in a quantitative fit test on the wearer\'s own face. Pass: at least 100 for a half mask, 500 for a full facepiece (OSHA).',
      stories: { FF: 'In a fit test the counter reads {Co} outside and {Ci} inside the mask. What is the fit factor?', Ci: 'A half mask must reach a fit factor of {FF}. With {Co} outside, how many particles may leak inside?' }
    }
  ],
  examples: [
    {
      title: 'Derating a hearing protector',
      q: 'A breaker operator works in 100 dB(A). The earmuffs are labelled NRR 29. Estimate the level at the ear, and judge it.',
      steps: [
        '$L_p = 100 - (29 - 7)/2 = 100 - 11 = 89$ dB(A).',
        'Still above 85 dB(A): the muffs alone are not enough. Quieter tools, less time on the breaker, or muffs plus plugs are needed.',
        'By contrast, in 88 dB(A) the same muffs give about 77 dB(A) — right in the target band, and speech can still be heard.'
      ],
      a: 'About 89 dB(A): not enough protection alone.'
    },
    {
      title: 'Passing a fit test',
      q: 'In a quantitative fit test a half mask gives 5000 particles/cm³ outside and 25 inside. A second, smaller model gives 8. Which passes?',
      steps: [
        'First: $FF = 5000/25 = 200$ — passes (≥ 100).',
        'Second: $5000/8 = 625$ — passes with a wider margin.',
        'Both pass, but the smaller model seals better on this face: offer several sizes and let each wearer be tested.'
      ],
      a: 'Both pass (200 and 625); the smaller model fits better.'
    }
  ],
  quiz: [
    { q: 'Where does PPE come in the hierarchy of controls?', choices: ['Last, after elimination, engineering and organisational controls', 'First, because it is cheapest', 'Only for military work', 'It replaces risk assessment'], a: 0, why: 'PPE protects only the wearer, only when worn and fitted; removing or engineering out the hazard protects everyone.' },
    { q: 'What happens to grip strength when thick protective gloves are worn?', choices: ['It falls — commonly by 10–30 %, more with thick gloves', 'It rises, because the glove adds friction', 'It does not change', 'It doubles'], a: 0, why: 'Glove material between the fingers and the object reduces grip force and dexterity; more effort is needed for the same grip.' },
    { q: 'The more a hearing protector attenuates, the better.', a: false, why: 'Over-protection isolates the wearer from speech and warnings and tempts them to lift the protector; about 70–75 dB(A) at the ear is the aim.' },
    { q: 'Why do many women report poorly fitting PPE?', choices: ['Much PPE is sized and shaped for men', 'Women need more protection', 'PPE is not made in small sizes at all', 'Women wear it incorrectly'], a: 0, why: 'Sizes scaled from men\'s patterns miss women\'s proportions — hands, faces, torsos and feet.' },
    { q: 'A worker in 95 dB(A) wears muffs with NRR 25. Using OSHA\'s derating, what level reaches the ear (dB(A))?', answer: 86, unit: 'dB', why: '$95 - (25 - 7)/2 = 95 - 9 = 86$ dB(A).' }
  ],
  problems: [
    { q: 'A worker in 100 dB(A) wears muffs with NRR 29. What level reaches the ear with OSHA\'s derating?', answer: 89, unit: 'dB', tol: 0.01, steps: ['$100 - (29 - 7)/2 = 100 - 11 = 89$ dB(A).'] },
    { q: 'A full-face respirator must reach a fit factor of 500. With 6000 particles/cm³ outside, how many may be inside?', answer: 12, unit: 'particles/cm³', tol: 0.01, steps: ['$C_i = C_o/FF = 6000/500 = 12$ particles/cm³.'] }
  ],
  ranges: [
    { dim: 'Glove sizes (hand circumference)', range: [152, 279], unit: 'mm', who: 'Sizes 6 to 11 — one size per inch of hand circumference', why: 'Every hand gets a glove close enough to grip and feel.', limits: 'Finger length and hand shape vary within a size; women\'s and large sizes must actually be stocked.', setting: ['field', 'military'], src: 'EN ISO 21420' },
    { dim: 'Quantitative respirator fit factor', range: '≥ 100 (half mask); ≥ 500 (full facepiece)', who: 'Each wearer, on their own face, with each model', why: 'Shows that the mask seals on that face.', limits: 'Beards and stubble break the seal; re-test when the face or the model changes.', setting: ['field', 'military'], src: 'OSHA 29 CFR 1910.134, Appendix A' },
    { dim: 'Level at the ear under hearing protection', range: [70, 75], unit: 'dB(A)', who: 'Workers in noise who must still hear speech and warnings', why: 'Enough protection without isolation.', limits: 'Real-world protection is lower than rated; derate. Level-dependent protectors help where sounds vary.', setting: 'field', src: 'EN 458 (selection of hearing protectors)' },
    { dim: 'High-visibility clothing, class 3', range: '≥ 0.80 m² fluorescent background; ≥ 0.20 m² retroreflective', who: 'Workers near fast traffic or in poor light', why: 'Seen from far enough away, by day and in headlights.', limits: 'Adds heat in summer; dirty or faded material loses its effect.', setting: 'field', src: 'EN ISO 20471' }
  ],
  applications: [
    'PPE trials with workers of every size and both sexes before purchase.',
    'Fit-testing programmes with several respirator models and sizes.',
    'Level-dependent and communication hearing protectors on noisy sites.',
    'Ventilated and cooled suits for chemical work in the heat.'
  ],
  sources: [
    'Regulation (EU) 2016/425 on personal protective equipment.',
    'EN ISO 21420, *Protective gloves — General requirements and test methods*.',
    'US OSHA, 29 CFR 1910.134, *Respiratory protection*, Appendix A (fit-testing procedures).',
    'EN 458, *Hearing protectors — Recommendations for selection, use, care and maintenance*.',
    'EN ISO 20471, *High visibility clothing — Test methods and requirements*.',
    'Z. Zhuang et al., new respirator fit-test panels from the NIOSH anthropometric survey of respirator users, 2005.'
  ],
  sim: [{ id: 'mf-thermal-balance', params: { ensemble: 'suit', ta: 30 } }, { id: 'mf-size-tariff', params: { item: 'glove' } }]
},

{
  id: 'field-computing', parent: 'field-topic', title: 'Field computers and working from vehicles', level: 2,
  short: 'A tablet in a field, a site or a vehicle meets sunlight, rain, cold, vibration and gloved hands. It must be bright enough to beat the sun (1000 cd/m² and more), use characters large enough for the distance and the shaking, have touch targets and hard keys that work with gloves, and be mounted and used without taking a driver\'s eyes off the road.',
  keywords: ['field computing', 'rugged tablet', 'handheld', 'vehicle-mounted terminal', 'sunlight readability', 'display luminance', 'ambient contrast ratio', 'reflectance', 'character height', 'visual angle', 'arc minutes', 'touch target', 'gloves', 'Fitts\'s law', 'vibration', 'MIL-STD-810', 'IP rating', 'driver distraction', 'glance time', 'night mode'],
  prereq: ['visual-ergonomics', 'fitts-law', 'hmi-screens'],
  related: ['laptops-tablets', 'displays-design', 'glare-colour', 'lighting-levels', 'driver-workspace', 'whole-body-vibration', 'outdoor-heat-sun', 'extreme-environments', 'ppe-ergonomics', 'crew-stations', 'controls-design'],
  body: `
Tablets, handhelds and vehicle terminals now carry maps, forms, work orders, manuals and messages into fields, building sites, vehicles and military units. Out there a screen meets sunlight, rain, dust and cold, its user is standing, walking or bouncing in a seat, and the hands are gloved. Designs that work in an office fail ([[laptops-tablets]], [[hmi-screens]]).

### Readable in the sun
Sunlight reflected by the screen washes out the picture. The contrast the eye sees is
$$\\mathrm{CR} = \\frac{L_{on} + R\\,E/\\pi}{L_{off} + R\\,E/\\pi}$$
where $L_{on}$ and $L_{off}$ are the screen's white and black luminances, $E$ the illuminance falling on it and $R$ its reflectance. An office is lit to about 500 lx; direct sun gives up to about 100 000 lx. There a laptop screen of 300 cd/m² reflecting 2 % adds about 640 cd/m² of glare and the contrast falls to 1.5 — unreadable. A sunlight-readable screen of 1000–1500 cd/m² with an anti-reflective, optically bonded front reflecting under 1 % keeps a contrast of about 6: comfortably above the roughly 3:1 that text needs. Shading the screen, tilting it away from the sun and a matt, dark case help too ([[glare-colour]]). At night the same screen must dim to a few cd/m² to keep the user's night vision — and in military vehicles to stay compatible with night-vision devices.

### Characters large enough
Legibility depends on the angle a character subtends at the eye:
$$h = 2\\,d\\,\\tan\\frac{\\theta}{2}$$
Office guidance (ISO 9241-303) prefers capital letters of about 20–22 minutes of arc, and at least 16. At 600 mm, 20′ is 3.5 mm; for a vehicle screen at 700 mm, 4.1 mm. Vibration, glare, motion and older eyes call for more than the office minimum — test legibility on the move ([[visual-ergonomics]]).

### Touch with gloves
A bare fingertip is roughly 15–20 mm wide, and a glove adds a few millimetres and takes away feel. Capacitive touchscreens may not respond to ordinary work gloves at all; glove modes, conductive fingertips and resistive screens help. Targets for gloved use need to be about as large as the gloved fingertip — 15–20 mm — with gaps between them, and Fitts's law shows the cost of small targets: tap time grows with the [[?logarithm]] of distance over width ([[fitts-law]]). In a vibrating vehicle the finger scatters, and physical keys and edge bezels that guide the finger work better. Keep hard keys for the functions that must work blind, in gloves or in the dark.

### Holding and mounting
Rugged tablets often weigh 1–1.5 kg: give them hand straps, harnesses or stands, and design for two-handed use or short one-handed use. In vehicles, mount screens within easy reach and near the line of sight, but outside airbag and head-strike zones and without blocking the view out ([[driver-workspace]], [[crew-stations]]). US guidelines for in-vehicle devices limit single glances to about 2 seconds and a task to 12 seconds of eyes off the road (NHTSA, 2013): lock out text entry while moving.

### Built for the field
Rugged devices are tested to MIL-STD-810 methods (drop, vibration, temperature, humidity, rain, sand and dust) and sealed to IP65–IP67 (IEC 60529: dust-tight, water jets to brief immersion). Batteries lose capacity and screens respond slowly in the cold; hot vehicles and direct sun overheat them ([[extreme-environments]]).

### In the simulation
A screen in sunlight: set the daylight, the screen's brightness and reflectance, the text size and distance, and the glove. The sample text washes out as the contrast falls; a gloved finger taps targets of the size you choose, with and without vibration.

> [!key] Make field screens bright enough to beat the sun and dim enough for the night, with characters sized for the distance and the shaking, targets and hard keys that work with gloves, and mounts that keep a driver's eyes on the road.
`,
  ideas: [
    'Ambient light adds R·E/π to both black and white, so contrast collapses in sunlight unless the screen is bright and low-reflecting.',
    'Sunlight-readable screens: about 1000–1500 cd/m² with anti-reflective, bonded fronts; at night the same screen must dim to a few cd/m².',
    'Character height follows the viewing distance and visual angle: about 20′ in an office, more on the move.',
    'Gloved touch needs targets about the size of the gloved fingertip, 15–20 mm, and hard keys for critical functions.',
    'In vehicles, mount screens near the line of sight but outside head-strike zones, and keep glances under about 2 s.'
  ],
  pitfalls: [
    'A brighter screen solves sunlight on its own — Reflection matters as much: halving the reflectance helps as much as doubling the brightness.',
    'Touchscreens are fine for everything — Gloves, rain, cold and vibration defeat them; critical functions need physical controls that can be found by feel.',
    'Office character sizes are enough in the field — Vibration, glare, motion and divided attention call for larger characters and higher contrast.'
  ],
  formulas: [
    {
      name: 'Contrast of a screen in ambient light',
      expr: 'CR = (Lon + R*E/pi)/(Loff + R*E/pi)', tex: '\\mathrm{CR} = \\frac{L_{on} + R\\,E/\\pi}{L_{off} + R\\,E/\\pi}',
      vars: {
        CR: { name: 'contrast ratio seen by the eye', tex: '\\mathrm{CR}' },
        Lon: { name: 'luminance of white', q: false, unit: 'cd/m²', value: 1200, tex: 'L_{on}' },
        Loff: { name: 'luminance of black', q: false, unit: 'cd/m²', value: 1.2, tex: 'L_{off}' },
        R: { name: 'diffuse reflectance of the screen', q: 'ratio', unit: '%', value: 0.7, min: 0, max: 20, tex: 'R' },
        E: { name: 'illuminance on the screen', q: 'illuminance', unit: 'lx', value: 100000, tex: 'E' }
      },
      note: 'A diffusely reflecting screen adds R·E/π cd/m² to every pixel. Direct sun gives up to about 100 000 lx, overcast daylight about 10 000 lx, an office 500 lx.',
      stories: { CR: 'A screen of {Lon} (black {Loff}) reflects {R} of {E}. What contrast does the eye see?', Lon: 'A screen reflecting {R} of {E} (black {Loff}) must reach a contrast of {CR}. How bright must white be?' }
    },
    {
      name: 'Character height for a visual angle',
      expr: 'h = 2*d*tan(theta/2)', tex: 'h = 2\\,d\\,\\tan\\frac{\\theta}{2}',
      vars: {
        h: { name: 'character (capital) height', q: 'length', unit: 'mm', tex: 'h' },
        d: { name: 'viewing distance', q: 'length', unit: 'mm', value: 600, tex: 'd' },
        theta: { name: 'visual angle of the character', q: 'angle', unit: '′', value: 20, min: 1, max: 600, tex: '\\theta' }
      },
      note: 'ISO 9241-303 prefers about 20–22 minutes of arc (′) for office screens, at least 16; field use needs more.',
      stories: { h: 'A screen is read from {d}. How tall must a character be to subtend {theta}?', d: 'Characters {h} tall must subtend {theta}. From how far may the screen be read?' }
    },
    {
      name: 'Time to tap a target (Fitts\'s law)',
      expr: 'MT = a + b*log2(D/W + 1)', tex: 'T_m = a + b\\,\\log_2\\!\\left(\\frac{D}{W} + 1\\right)',
      vars: {
        MT: { name: 'movement time', q: 'time', unit: 'ms', tex: 'T_m' },
        a: { name: 'start-up time', q: 'time', unit: 'ms', value: 100, tex: 'a' },
        b: { name: 'time per bit of difficulty', q: 'time', unit: 'ms', value: 150, tex: 'b' },
        D: { name: 'distance to the target', q: 'length', unit: 'mm', value: 80, tex: 'D' },
        W: { name: 'target width', q: 'length', unit: 'mm', value: 10, tex: 'W' }
      },
      note: 'a and b are illustrative; gloves and vibration raise both and scatter the finger, so the effective target is smaller than drawn.',
      stories: { MT: 'A target {W} wide is {D} away. With a = {a} and b = {b}, how long does a tap take?', W: 'With a = {a} and b = {b}, how wide must a target {D} away be to be tapped in {MT}?' }
    }
  ],
  examples: [
    {
      title: 'An office laptop in the sun',
      q: 'A laptop screen gives 300 cd/m² white and 0.3 cd/m² black, and reflects 2 %. What contrast does the eye see at 500 lx, 10 000 lx and 100 000 lx? What does a 1200 cd/m² screen reflecting 0.7 % give in full sun?',
      steps: [
        'Reflected luminance $R E/\\pi$: 3.2, 64 and 637 cd/m².',
        'Contrast: $(300 + 3.2)/(0.3 + 3.2) = 87$ at 500 lx; $364/64 = 5.7$ overcast; $937/637 = 1.5$ in full sun — unreadable.',
        'Sunlight-readable screen: $R E/\\pi = 0.007 \\times 100\\,000/\\pi = 223$; contrast $(1200 + 223)/(1.2 + 223) = 6.4$.'
      ],
      a: 'About 87, 5.7 and 1.5 for the laptop; about 6.4 for the sunlight-readable screen.'
    },
    {
      title: 'Text on a vehicle screen',
      q: 'A screen is mounted 700 mm from the driver\'s eyes. How tall must capital letters be to subtend 20 minutes of arc? And 30′?',
      steps: [
        '$h = 2 \\times 700 \\times \\tan(10′) = 2 \\times 700 \\times 0.00291 = 4.1$ mm.',
        'At 30′: $2 \\times 700 \\times \\tan(15′) = 6.1$ mm.',
        'On a rough road the larger size keeps the text legible at a glance.'
      ],
      a: 'About 4.1 mm for 20′ and 6.1 mm for 30′.'
    }
  ],
  quiz: [
    { q: 'Why does a screen become unreadable in direct sunlight?', choices: ['Reflected sunlight adds the same luminance to black and white, collapsing the contrast', 'The screen turns off to protect itself', 'Sunlight changes the colours of the pixels', 'The eye cannot focus in bright light'], a: 0, why: 'In $\\mathrm{CR} = (L_{on} + RE/\\pi)/(L_{off} + RE/\\pi)$ a large $RE/\\pi$ drives the ratio towards 1.' },
    { q: 'Which change helps a screen in sunlight as much as doubling its brightness?', choices: ['Halving its reflectance', 'Making the text bold', 'Doubling the resolution', 'Using a larger font colour palette'], a: 0, why: 'When reflection dominates, contrast depends on $L_{on}/(RE/\\pi)$: halving $R$ has the same effect as doubling $L_{on}$.' },
    { q: 'Capacitive touchscreens work with any work glove.', a: false, why: 'Most ordinary work gloves do not conduct; glove modes, conductive fingertips, resistive screens or physical keys are needed.' },
    { q: 'How long should a single glance at an in-vehicle display last at most, by the US guidelines?', choices: ['About 2 seconds', 'About 6 seconds', 'About 0.2 seconds', 'As long as needed'], a: 0, why: 'NHTSA\'s 2013 guidelines limit single glances to about 2 s and a task to 12 s of eyes off the road.' },
    { q: 'At a viewing distance of 600 mm, how tall (mm) is a character that subtends 20 minutes of arc?', answer: 3.49, unit: 'mm', why: '$2 \\times 600 \\times \\tan(10′) = 3.49$ mm.' }
  ],
  problems: [
    { q: 'A screen gives 1000 cd/m² white and 1 cd/m² black and reflects 0.5 %. What contrast ratio does the eye see in 100 000 lx?', answer: 7.24, tol: 0.02, steps: ['$R E/\\pi = 0.005 \\times 100\\,000/\\pi = 159$ cd/m².', '$\\mathrm{CR} = (1000 + 159)/(1 + 159) = 7.24$.'] },
    { q: 'With a = 100 ms and b = 150 ms, how long does a tap take on a 20 mm target 80 mm away?', answer: 448, unit: 'ms', tol: 0.01, steps: ['$\\log_2(80/20 + 1) = \\log_2 5 = 2.32$ bits.', '$T_m = 100 + 150 \\times 2.32 = 448$ ms (575 ms for a 10 mm target).'] }
  ],
  ranges: [
    { dim: 'Display luminance for use in direct sunlight', range: [1000, 1500], unit: 'cd/m²', who: 'Screens used outdoors, with a reflectance under about 1 %', why: 'Keeps the contrast near 5–7 in full sun, above the roughly 3:1 text needs.', limits: 'Brightness costs battery and heat; reflectance must be low too; dim far lower at night.', setting: ['field', 'military', 'vehicle'], src: 'Ambient-contrast calculation; common practice for sunlight-readable displays' },
    { dim: 'Contrast ratio for reading text', range: [3, null], unit: ':1', who: 'Readers with normal vision; more for older eyes', why: 'Text can be read at a glance.', limits: 'Higher contrast is needed for small text, vibration and older users.', setting: ['field', 'military', 'vehicle'], src: 'ISO 9241-303; WCAG 2 (3:1 for large text)' },
    { dim: 'Visual angle of capital letters', range: [20, 22], unit: 'arcmin', who: 'Office screen users (at least 16′)', why: 'Comfortable, fast reading.', limits: 'Field and vehicle use — vibration, glare, motion — needs more; test on the move.', setting: ['field', 'vehicle'], src: 'ISO 9241-303' },
    { dim: 'Touch target for gloved use', range: [15, 20], unit: 'mm', who: 'Gloved fingertips (a bare fingertip is roughly 15–20 mm wide)', why: 'Hits the intended target, not its neighbour, with gloves and some vibration.', limits: 'Thick gloves and rough rides need more; use physical keys for critical functions.', setting: ['field', 'military'], src: 'Derived from fingertip size and Fitts\'s law; test with the real gloves' },
    { dim: 'Single glance at an in-vehicle display while driving', range: [null, 2], unit: 's', who: 'Drivers', why: 'Keeps the eyes on the road; a task should take no more than 12 s of glances in all.', limits: 'Lock out text entry and complex tasks while moving.', setting: ['vehicle', 'field', 'military'], src: 'NHTSA visual-manual driver distraction guidelines (2013)' },
    { dim: 'Enclosure protection for outdoor devices', range: 'IP65 to IP67', who: 'Devices exposed to dust, rain and splashes', why: 'Dust-tight; water jets to brief immersion.', limits: 'Ports and seals must be closed; temperature and drop also matter (MIL-STD-810 methods).', setting: ['field', 'military'], src: 'IEC 60529' }
  ],
  applications: [
    'Sunlight-readable rugged tablets for surveyors, farmers, utility crews and soldiers.',
    'Vehicle terminals with hard keys, glove-friendly targets and lock-outs while moving.',
    'Night modes that dim displays for night vision.',
    'Field forms designed for large targets, few inputs and offline use.'
  ],
  sources: [
    'ISO 9241-303, *Ergonomics of human-system interaction — Requirements for electronic visual displays*.',
    'MIL-STD-810, *Environmental Engineering Considerations and Laboratory Tests* (US Department of Defense).',
    'IEC 60529, *Degrees of protection provided by enclosures (IP code)*.',
    'NHTSA, *Visual-Manual NHTSA Driver Distraction Guidelines for In-Vehicle Electronic Devices*, 2013.',
    'P. M. Fitts, "The information capacity of the human motor system in controlling the amplitude of movement", *Journal of Experimental Psychology* 47 (1954).',
    'MIL-STD-1472, sections on displays and touch interfaces.'
  ],
  sim: 'mf-field-screen'
}

);
