/* HYPER-ERGONOMICS · content/foundations.js
 * What ergonomics is (topic ergo-basics, except design-for-range, which is in reference.js) and its methods
 * (topic ergo-methods). Simulations in sims/foundations.js (prefix fd-). */
Hyper.add(

{
  id: 'ergonomics-defined', parent: 'ergo-basics', title: 'What ergonomics is', level: 1,
  short: 'Ergonomics — also called human factors — studies how people interact with the other parts of a system, and uses that knowledge to design tasks, products, workplaces and machines for people\'s well-being and for the performance of the whole system. It has physical, cognitive and organisational domains, and it is needed wherever people live and work: at home and in public, in offices, workshops, the military and the field.',
  keywords: ['ergonomics', 'human factors', 'IEA definition', 'physical ergonomics', 'cognitive ergonomics', 'organisational ergonomics', 'human–machine system', 'work system', 'person in the loop', 'context of use', 'human factors engineering', 'socio-technical system', 'settings'],
  prereq: [],
  related: ['design-for-range', 'human-centred-design', 'ergonomic-principles', 'ergo-standards', 'human-error', 'mental-workload', 'psychosocial-factors', 'military-human-factors', 'construction-ergonomics', 'machine-ergonomics-principles', 'fitts-law', 'hick-law'],
  body: `
Watch someone use a badly designed thing — a ticket machine in the rain, a lathe whose stop button sits behind the chuck, a cockpit in which two identical levers do different things — and you see the problem ergonomics exists to solve. The person adapts: they stoop, stretch, guess and improvise. Sometimes that costs a few seconds; sometimes a back, a hand or a life. **Ergonomics** turns the question round: instead of asking people to fit the thing, it designs the thing — and the task, the workplace and the way work is organised — to fit people.

### A definition
The International Ergonomics Association (IEA) describes ergonomics, which it treats as the same discipline as *human factors*, as two things at once: a **science** that studies the interactions between people and the other elements of a system, and a **profession** that applies theory, principles, data and methods to design, with two aims pursued together — people's **well-being** and the **performance of the whole system**. (The IEA adopted its definition in 2000; this is a paraphrase.) Three words in it carry the weight:
- **Interactions** — not people alone, not machines alone, but the fit between them.
- **System** — the person, the task, the tools and machines, the workspace, the physical environment and the organisation all act on one another; change one and the others move.
- **Both aims** — a design that is comfortable but slow, or fast but injurious, has failed. Ergonomics does not trade health against output; done well it improves both (see [[ergonomics-productivity]]).

The word comes from the Greek *ergon*, work, and *nomos*, law or rule.

### Three domains
| Domain | What it studies | Typical questions | Where in this app |
|---|---|---|---|
| **Physical** | body sizes, postures, forces, movements; noise, vibration, climate, light | Can the smallest user reach the stop button? Is this lift safe? Is the cab too loud? | [[design-for-range]], [[neutral-postures]], [[niosh-lifting-equation]], [[noise-exposure]] |
| **Cognitive** | perception, attention, memory, decisions, workload, error | Will the operator notice the alarm? Does the knob turn the way people expect? | [[human-error]], [[mental-workload]], [[stereotypes-compatibility]] |
| **Organisational** | how work is arranged: pace, shifts, teams, rotation, communication, safety culture | Is the line speed achievable for a whole shift? Who may stop the line? | [[shift-work]], [[job-rotation]], [[psychosocial-factors]] |

Real problems cross the domains. An operator's slip in a control room may begin with a display placed out of sight (physical), an ambiguous alarm (cognitive) and a twelve-hour night shift with too few people (organisational).

### The person in the loop
In a work system a person closes a loop: a display or the work itself presents information, the person perceives it, chooses what to do and acts on a control, and the machine responds. Each step takes time and each can fail. A simple estimate of one response adds a base time for seeing and starting to act, a decision time that grows with the [[?logarithm]] of the number of choices ([[hick-law]]) and a movement time that grows with the distance to the control and falls with its size ([[fitts-law]]). In the sim **The person in the loop**, events arrive at a pace set by the organisation. Move the control beyond the smallest user's reach (physical), add choices (cognitive) or quicken the pace (organisational) and watch the response time approach the time between events: a queue forms, and waits grow far faster than the load. No amount of effort fixes a loop designed beyond human capacity.

### Where ergonomics is needed — civil, office, workshop, military, field
The principles are the same everywhere; the users, their clothing, their exposure and the stakes are not.

| Setting | Users | What they wear and carry | Exposure | What goes wrong without ergonomics |
|---|---|---|---|---|
| **Civil — home and public** | everyone: children, older people, disabled people, the very small and very tall | everyday clothes, bags, prams, wheelchairs, walking aids | short and occasional, but by millions | falls on stairs, controls out of reach, people shut out |
| **Office** | working-age adults | light clothing | hours a day for years | neck, back and wrist complaints, eyestrain |
| **Workshop and industry** | working-age adults, often an ageing workforce | safety boots, gloves, hearing protection, helmets | full shifts, repetition, loads | back and shoulder injuries, hand disorders, hearing loss, machine accidents |
| **Military** | selected, trained people — still a wide range of sizes, women and men | helmets, body armour, packs, protective suits | long operations, heat, cold, vibration, sleep loss | crew stations that do not fit, loads too heavy, errors under stress |
| **Field — construction, farming, utilities** | working-age adults, often seasonal or self-employed | weather clothing, harnesses, heavy tools | weather, uneven ground, far from help | overexertion, vibration injuries, heat illness, falls |

The sim **One design, four settings** walks the same person through the same doorway dressed for each setting: clothing and equipment alone decide who ducks and who turns sideways.

### What ergonomics is not
It is not a label on a chair, nor a list of fixed numbers. It is a way of designing: learn who the users are and what they really do ([[task-analysis]]), find what limits them, design for the range ([[design-for-range]]), and test with real people ([[user-trials-mockups]]). Ergonomics recommends **ranges** with reasons — which user limits each dimension, what the range protects, and whom it still leaves out.

> [!key] Ergonomics designs the whole system — task, tools, workplace, environment and organisation — around people as they really are, for their well-being and for the system's performance together.
`,
  ideas: [
    'Ergonomics (human factors) is both a science of how people interact with systems and a profession that designs them, for well-being and performance together.',
    'It has three domains — physical, cognitive and organisational — and real problems usually cross them.',
    'A person in a work system closes a loop: perceive, decide, act; each step takes time, and a pace close to that time makes queues and errors grow fast.',
    'The same principles apply at home, in offices, workshops, the military and the field, but users, clothing, exposure and stakes differ.',
    'Ergonomics gives ranges with reasons, not single numbers.'
  ],
  pitfalls: [
    'Ergonomics is about office chairs and comfort — It covers the whole work system: machines, controls, loads, noise, heat, shifts and errors, in every setting; comfort is only part of it.',
    'If an operator makes a mistake, the fix is training and discipline — Many "operator errors" are designed in: controls that look alike, displays out of sight, paces beyond human response times. Change the design first.',
    'Good ergonomics costs performance — Its two aims go together: designs that fit people usually make work faster, more accurate and cheaper over their life.'
  ],
  formulas: [
    {
      name: 'Response time of a person in the loop',
      expr: 'T = t0 + bH*log2(n + 1) + bF*log2(D/W + 1)', tex: 'T = t_0 + b_H \\log_2(n + 1) + b_F \\log_2\\!\\left(\\dfrac{D}{W} + 1\\right)',
      vars: {
        T: { name: 'response time', q: 'time', unit: 's' },
        t0: { name: 'base time: seeing the signal and starting to act', q: 'time', unit: 's', value: 0.25, tex: 't_0' },
        bH: { name: 'decision time per bit (Hick)', q: 'time', unit: 's', value: 0.15, tex: 'b_H' },
        n: { name: 'number of equally likely choices', q: 'count', value: 4, min: 1, tex: 'n' },
        bF: { name: 'movement time per bit (Fitts)', q: 'time', unit: 's', value: 0.1, tex: 'b_F' },
        D: { name: 'distance the hand moves to the control', q: 'length', unit: 'mm', value: 300 },
        W: { name: 'width of the control (target)', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'A first estimate that joins Hick\'s law for the decision and Fitts\'s law for the movement. The constants are typical values for practised adults; measure them for a real task. Compare T with the time between events: when they come close, waits grow sharply.',
      stories: { T: 'An operator chooses among {n} buttons, {W} wide, {D} from the hand. With {t0} base time, {bH} per bit of choice and {bF} per bit of movement, how long does one response take?', n: 'A response must take no longer than {T}. With the other times as given, how many equally likely choices can the operator be offered?' }
    }
  ],
  examples: [
    {
      title: 'A response in a control room',
      q: 'An alarm asks the operator to press one of 4 buttons, each 20 mm wide, 300 mm from the resting hand. With a base time of 0.25 s, 0.15 s per bit of decision and 0.1 s per bit of movement, estimate the response time. Alarms arrive on average every 1.25 s. What share of the time is the operator busy?',
      steps: [
        'Decision: $0.15 \\log_2(4 + 1) = 0.15 \\times 2.32 = 0.35$ s.',
        'Movement: $0.1 \\log_2(300/20 + 1) = 0.1 \\times 4 = 0.40$ s.',
        'Response: $T = 0.25 + 0.35 + 0.40 = 1.00$ s.',
        'Busy share: $1.00/1.25 = 80$ %. With alarms arriving at random, a queue forms often: at 80 % utilisation the average wait before an alarm is handled is already about twice the response time (the M/D/1 queue: wait $= \\rho T / 2(1-\\rho) = 0.8 \\times 1.0 / 0.4 = 2.0$ s).'
      ],
      a: 'About 1.0 s per response; 80 % busy, with average waits of about 2 s — fewer choices, bigger or closer buttons, or fewer alarms would help.'
    },
    {
      title: 'The same doorway, four settings',
      q: 'A doorway is 2000 mm high. The 95th-percentile man is 1870 mm tall. In street shoes (+25 mm) does he pass with a 75 mm margin for walking? In safety boots (+35 mm) and a hard hat that sits about 50 mm above the head (illustrative values — measure your own)?',
      steps: [
        'Street shoes: $1870 + 25 + 75 = 1970$ mm — passes with 30 mm to spare.',
        'Boots and helmet: $1870 + 35 + 50 + 75 = 2030$ mm — 30 mm too low: he ducks, or hits the frame.',
        'The same door that is right in an office is wrong in a workshop: the setting changes the design case.'
      ],
      a: 'Fine in the office, too low in the workshop — clothing and equipment belong in the design.'
    }
  ],
  quiz: [
    { q: 'Which pair best states the two aims of ergonomics?', choices: ['People\'s well-being and the performance of the whole system', 'Comfort and appearance', 'Low cost and speed of manufacture', 'Legal compliance and training'], a: 0, why: 'The IEA\'s definition puts well-being and overall system performance together; ergonomics pursues both at once.' },
    { q: 'A nurse working twelve-hour night shifts misreads a pump display with small, similar-looking digits. Which domains are involved?', choices: ['Cognitive and organisational (and physical, for the display\'s size and position)', 'Only cognitive', 'Only organisational', 'None — it is a training problem'], a: 0, why: 'The display design is cognitive and physical; the long night shift is organisational. Real errors usually cross the domains.' },
    { q: 'An operator\'s response takes 1 s and events arrive on average once a second. What happens?', choices: ['A queue builds up without limit: the operator can never catch up', 'The operator keeps up exactly', 'The operator is idle half the time', 'Nothing — people speed up when needed'], a: 0, why: 'At a utilisation of 100 % random arrivals make the queue grow without bound; waits grow steeply well before that.' },
    { q: 'True or false: the same doorway height can be right for an office and wrong for a workshop.', a: true, why: 'Boots and helmets add tens of millimetres; the design case — the largest user *with* their equipment — changes with the setting.' },
    { q: 'Going from 3 to 7 equally likely choices adds about how much decision time at 0.15 s per bit?', choices: ['About 0.15 s', 'About 0.6 s', 'Nothing', 'It more than doubles the decision time'], a: 0, why: '$\\log_2 8 - \\log_2 4 = 1$ bit, so about 0.15 s: decision time grows with the logarithm of the choices, not in proportion.' }
  ],
  problems: [
    { q: 'An operator must respond within 1.2 s. The base time is 0.25 s and the movement takes 0.40 s. At 0.15 s per bit, how many equally likely choices can the decision include?', answer: 11.7, tol: 0.03, steps: ['Time left for the decision: $1.2 - 0.25 - 0.40 = 0.55$ s.', 'Bits: $0.55/0.15 = 3.67$, so $n + 1 = 2^{3.67} = 12.7$.', '$n \\approx 11.7$: about eleven choices at most — fewer if the operator must also be accurate under stress.'] }
  ],
  ranges: [
    { dim: 'Share of the intended users a design accommodates', range: [90, 95], unit: '%', who: 'For most comfort and fit dimensions, the 5th-percentile woman to the 95th-percentile man', why: 'Fits almost everyone without making things huge, heavy or costly.', limits: 'Exits, guards, emergency controls and public buildings go further into the tails (99 % and beyond) or add a second way; the share falls when several dimensions must fit at once.', setting: 'all', src: 'Pheasant and Haslegrave, *Bodyspace*; MIL-STD-1472 (the 5th to 95th percentile as its usual design range)' }
  ],
  applications: [
    'Control rooms, cockpits and machine panels whose response demands are checked against human response times.',
    'Buildings and public equipment designed for the whole population, from children to older and disabled people.',
    'Workshops and production lines where loads, reaches and paces are set from human limits rather than from the machine.',
    'Military crew stations, loads and protective equipment fitted to the people who use them.'
  ],
  history: 'The Polish naturalist Wojciech Jastrzębowski used the word *ergonomics* in 1857. The modern discipline grew out of the Second World War, when aircraft, radar and weapons outstripped the people who operated them: in 1947 Paul Fitts and Richard Jones analysed hundreds of reports of "pilot error" and found that many were induced by the design of controls and displays, and Alphonse Chapanis gave landing-gear and flap levers different shapes so they could not be confused. In Britain K. F. H. Murrell and colleagues founded the Ergonomics Research Society in 1949; the Human Factors Society followed in the US in 1957 and the International Ergonomics Association in 1959.',
  sources: [
    'International Ergonomics Association, definition of ergonomics (adopted 2000) and its domains of specialisation.',
    'ISO 26800, *Ergonomics — General approach, principles and concepts*.',
    'ISO 6385, *Ergonomics principles in the design of work systems*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, the introductory chapters.',
    'G. Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, the chapters on the discipline and its history.',
    'C. D. Wickens et al., *Engineering Psychology and Human Performance*, on information processing, decision time and the human in the loop.'
  ],
  sim: ['fd-system-loop', 'fd-context']
},

{
  id: 'human-centred-design', parent: 'ergo-basics', title: 'Fitting the task to the person', level: 1,
  short: 'The founding idea of ergonomics: instead of selecting and training people to cope with a task, design the task, tools and workplace so that the whole range of intended users can do it well. Human-centred design (ISO 9241-210) turns this into a process — understand the users and their context, specify requirements, design, evaluate with users, and repeat.',
  keywords: ['fitting the task to the person', 'FTTP', 'fitting the person to the task', 'selection and training', 'human-centred design', 'user-centred design', 'ISO 9241-210', 'context of use', 'iterative design', 'design hierarchy', 'adjustability', 'platforms', 'adapting the work to the individual'],
  prereq: ['ergonomics-defined', 'design-for-range'],
  related: ['user-trials-mockups', 'task-analysis', 'standing-work-heights', 'workbench-design', 'accessible-design', 'participatory-ergonomics', 'usability', 'ergonomic-principles', 'clothing-ppe-allowances', 'percentiles'],
  body: `
There are two ways to make a job and a worker fit. One is to **fit the person to the task**: choose people who are tall enough, strong enough or sharp-eyed enough, and train them to cope with what the job demands. The other is to **fit the task to the person**: change the job — its heights, reaches, loads, pace, tools and information — until the people who will really do it can do it well. Early industrial psychology leaned on selection and training. Ergonomics was born when that stopped working: in the 1940s aircraft and weapons demanded more than even carefully selected crews could give, and investigators found that many "human errors" were built into the equipment.

### Why fitting the task wins
Take a standing assembly bench. For light work the surface should be about 100–150 mm below the elbow, with shoes on — the middle of that band is about 100 mm below the bare elbow height plus 25 mm of shoe. Elbow heights in a mixed population run from about 940 mm (5th-percentile woman) to 1180 mm (95th-percentile man), so the ideal bench heights spread over about 250 mm. Allow each person ±50 mm around their ideal and a **fixed** bench at the best single height — about 950 mm — suits only **54 %** of an equal mix of women and men (60 % of women, 48 % of men). Raise it to 1000 mm and only 22 % of women fit.

Selection would solve this for the employer by rejecting the other 46 % of applicants — and then every worker who is injured, ages, becomes pregnant or leaves takes the "fit" with them. Fitting the task keeps the whole labour pool: in the sim **Fit the task, or pick the people?** try the four strategies:

| Strategy | What it is | Share of a mixed population suited (light work, ±50 mm) | Costs and limits |
|---|---|---|---|
| Fixed bench, one height | the cheapest | about 54 % at best | the rest stoop or lift their shoulders |
| Select the workers | fit the person to the task | same 54 % — the other 46 % are not hired | excludes people; fit lost as people change |
| Fixed bench for the tallest + platforms up to 150 mm | adapt the task for shorter users | about 95 % (bench at 1050 mm) | platforms must be safe, stable and moved; trip edges |
| Height-adjustable bench, about 815–1105 mm | fit everyone | over 99 % | price, maintenance, and people who never adjust |

European law writes the principle down: the EU Framework Directive 89/391/EEC lists *adapting the work to the individual* — the design of workplaces, the choice of equipment and of working methods — among the general principles of prevention an employer must follow.

### Human-centred design: the process
Fitting the task to the person is not a single decision but a way of working. ISO 9241-210 (written for interactive systems, but its logic applies to any product or workplace) describes human-centred design by its principles — design based on an explicit understanding of users, tasks and environments; users involved throughout; design driven and refined by evaluation with users; iteration; the whole user experience; a multidisciplinary team — and by four linked activities:

1. **Understand and specify the context of use** — who the users are (their range of sizes, strengths, abilities, languages, experience), their tasks, their equipment and clothing, the physical and social environment. See [[task-analysis]].
2. **Specify the user requirements** — the ranges the design must meet, e.g. "reachable by the 5th-percentile woman wearing winter gloves".
3. **Produce design solutions** — sketches, mock-ups, digital manikins ([[digital-human-models]]).
4. **Evaluate against the requirements with users** — fitting trials and usability tests ([[user-trials-mockups]]); then go round again.

### The context of use changes the answer
The sim **One design, four settings** shows why the first activity matters. The same person needs more headroom in boots and a helmet, more width in body armour and a pack, more reach allowance in thick gloves. The public includes children, older people and wheelchair users; a military crew includes the 5th-percentile woman *in full kit*; a field worker adds weather, slopes and harnesses. A requirement copied from another setting is a requirement for the wrong people.

### The design hierarchy
1. **One generous size** where a clearance or reach can simply be made to suit everyone.
2. **Several sizes** where adjustment is impractical — gloves, helmets, school chairs.
3. **Adjustment** where the dimension matters and users change — chairs, benches, seats.
4. **Adapt the task** — platforms, stools, long-handled tools — for those still missed.
5. Only then **selection, training, rotation and protective equipment**, for what design cannot remove.

### Virtues and limits
Fitting the task to the person keeps the whole workforce, reduces injuries and errors, survives changes in the people, and usually costs less over the life of a workplace than the absence and turnover it prevents ([[ergonomics-productivity]]). Its limits: adjustable equipment costs more and must be explained, or people leave it wherever it is; some demands cannot be designed away — a soldier's load, a lineworker's weather — and there selection standards, training and protective equipment still have a place, *after* design.

> [!warn] Choosing workers by size, sex or age when the work could be redesigned is unfair, and in many countries it raises legal questions. Redesign first.

> [!key] Change the task, not the person: design for the real range of users in their real context, test with them, and iterate. Selection and training come after design, not instead of it.
`,
  ideas: [
    'Fitting the person to the task selects and trains; fitting the task to the person redesigns — ergonomics prefers the second.',
    'A single fixed height for standing light work suits only about half of a mixed population; platforms or adjustment raise that above 95 %.',
    'Human-centred design (ISO 9241-210): understand the context of use, specify requirements, design, evaluate with users, iterate.',
    'The context of use — users, tasks, equipment, clothing, environment — changes the right dimensions from one setting to another.',
    'The design hierarchy: one generous size, several sizes, adjustment, adapting the task — selection, training and PPE last.'
  ],
  pitfalls: [
    'Hire people who fit and the problem is solved — The fit leaves with every injury, ageing worker and new hire, the labour pool shrinks, and choosing by body size is unfair and often unlawful.',
    'An adjustable workstation is ergonomic by itself — Only if its range covers the users, it is easy to adjust from the working position, and people know how and why to adjust it.',
    'User involvement means asking users what they want — Human-centred design observes and measures what people do and tests designs with them; opinions alone miss problems people have learned to live with.'
  ],
  formulas: [
    {
      name: 'Share of one group a fixed height suits',
      expr: 'F = (erf((H + t - mu)/(s*sqrt(2))) - erf((H - t - mu)/(s*sqrt(2))))/2',
      tex: 'F = \\Phi\\!\\left(\\dfrac{H + t - \\mu}{\\sigma}\\right) - \\Phi\\!\\left(\\dfrac{H - t - \\mu}{\\sigma}\\right)',
      vars: {
        F: { name: 'share of the group suited', q: 'ratio', unit: '%' },
        H: { name: 'the fixed height', q: 'length', unit: 'mm', value: 950, min: 500, max: 1500 },
        t: { name: 'tolerance around each person\'s ideal', q: 'length', unit: 'mm', value: 50, min: 0, max: 300 },
        mu: { name: 'mean ideal height of the group', q: 'length', unit: 'mm', value: 915, min: 500, max: 1500, tex: '\\mu' },
        s: { name: 'standard deviation of the ideal height', q: 'length', unit: 'mm', value: 46, min: 1, max: 200, tex: '\\sigma' }
      },
      note: 'Φ is the normal distribution function. The example values are women\'s ideal standing height for light work: elbow height 1015 ± 46 mm, plus 25 mm of shoe, less 125 mm. For a mixed population add each group\'s share weighted by its numbers.',
      stories: { F: 'A group\'s ideal work height is {mu} with a standard deviation of {s}. What share is suited by a fixed height of {H}, within {t}?', t: 'How much tolerance around each person\'s ideal would a fixed height of {H} need to suit {F} of a group whose ideal is {mu} ± {s}?' }
    }
  ],
  examples: [
    {
      title: 'One bench for everyone?',
      q: 'Women\'s elbow height is 1015 ± 46 mm and men\'s 1100 ± 50 mm (representative data). For light work each person\'s ideal bench is their elbow height + 25 mm of shoe − 125 mm, and ±50 mm is acceptable. What share of women, of men and of an equal mix does a fixed 950 mm bench suit?',
      steps: [
        'Ideal heights: women $915 \\pm 46$ mm, men $1000 \\pm 50$ mm.',
        'Women: $\\Phi\\big((1000-915)/46\\big) - \\Phi\\big((900-915)/46\\big) = \\Phi(1.85) - \\Phi(-0.33) = 0.968 - 0.372 = 59.6$ %.',
        'Men: $\\Phi\\big((1000-1000)/50\\big) - \\Phi\\big((900-1000)/50\\big) = 0.500 - 0.023 = 47.7$ %.',
        'Equal mix: $(59.6 + 47.7)/2 = 53.6$ % — no fixed height does much better.'
      ],
      a: 'About 60 % of women, 48 % of men, 54 % of the mix: a fixed bench leaves nearly half badly suited.'
    },
    {
      title: 'The range an adjustable bench needs',
      q: 'Using the same rule, what adjustment range suits the 5th-percentile woman (elbow 939 mm) to the 95th-percentile man (elbow 1182 mm) for light work, taking the whole 100–150 mm band?',
      steps: [
        '5th-percentile woman: $939 + 25 - 150 = 814$ mm to $939 + 25 - 100 = 864$ mm.',
        '95th-percentile man: $1182 + 25 - 150 = 1057$ mm to $1182 + 25 - 100 = 1107$ mm.',
        'A bench adjustable over about 815–1105 mm puts every one of them in their band; with ±50 mm tolerance it suits over 99 % of the mix.'
      ],
      a: 'About 815–1105 mm.'
    }
  ],
  quiz: [
    { q: 'A company finds its fixed-height bench suits only half its workers. Which response fits the task to the person?', choices: ['Make the bench adjustable or add platforms', 'Hire only people of the right height', 'Train workers to lift their shoulders less', 'Give everyone a back belt'], a: 0, why: 'Changing the workplace fits the task to the people; selection, training and protective items leave the misfit in place.' },
    { q: 'Which is the first activity of human-centred design in ISO 9241-210?', choices: ['Understand and specify the context of use', 'Build a prototype', 'Write the user manual', 'Choose the colours'], a: 0, why: 'Everything else rests on knowing the users, their tasks, equipment and environment.' },
    { q: 'Platforms under a fixed bench can help…', choices: ['users who are too short for it, not those too tall', 'users who are too tall for it', 'everyone equally', 'nobody — they are a trip hazard only'], a: 0, why: 'A platform raises the person; it cannot lower them. So a fixed bench with platforms is set for the tallest users.' },
    { q: 'True or false: once a workstation is adjustable, its users will set it correctly.', a: false, why: 'Many people never adjust; controls must be easy to reach and use, and people need to know why and how to adjust.' },
    { q: 'For a soldier\'s combat load, which design-hierarchy step is often all that remains after the equipment has been made as light and well-fitted as possible?', choices: ['Selection standards, training and conditioning', 'Adjustable workbenches', 'A fixed generous size', 'Nothing can be done'], a: 0, why: 'Where the demand cannot be designed away, selection and training come in — after design, not instead of it.' }
  ],
  problems: [
    { q: 'Men\'s ideal light-work height is 1000 ± 50 mm. What share of men does a fixed 1000 mm bench suit within ±50 mm?', answer: 68.3, unit: '%', tol: 0.01, steps: ['$\\Phi(50/50) - \\Phi(-50/50) = \\Phi(1) - \\Phi(-1)$.', '$0.8413 - 0.1587 = 0.683$: 68.3 %.'] }
  ],
  ranges: [
    { dim: 'Standing work surface, light assembly', range: '100–150 mm below elbow height (shoes on)', who: 'Each user\'s own elbow height; set by the person, not the average', why: 'Forearms slope slightly down, shoulders relaxed, the hands see and reach the work without stooping.', limits: 'Precision work needs a higher surface (above the elbow) and heavy work a lower one; the band depends on the tool and object heights.', setting: 'workshop', src: 'Kroemer and Grandjean, *Fitting the Task to the Human*' },
    { dim: 'Adjustable standing bench for light work (mixed population)', range: [815, 1105], unit: 'mm', who: '5th-percentile woman (elbow about 940 mm) to 95th-percentile man (about 1180 mm), with 25 mm of shoe', why: 'Puts almost everyone in their light-work band; a fixed bench suits only about half.', limits: 'Representative data: measure the real workforce and add the height of the object worked on; tall or short populations shift the range.', setting: 'workshop', src: 'Derived from this app\'s representative adult body data (Tools → Body sizes); Kroemer and Grandjean' }
  ],
  applications: [
    'Height-adjustable benches, platforms and lift tables in assembly and packing.',
    'Product development following ISO 9241-210: context-of-use studies, requirements, prototypes and user tests.',
    'Public buildings and services designed with and for older and disabled people.',
    'Military procurement that specifies equipment for the 5th- to 95th-percentile user in full protective kit.'
  ],
  history: 'The phrase *fitting the task to the man* became the title of Etienne Grandjean\'s classic textbook, later revised with Karl Kroemer as *Fitting the Task to the Human*. User-centred design was championed for computer systems in the 1980s, and ISO turned it into a standard — ISO 13407 in 1999, replaced by ISO 9241-210 in 2010 and revised in 2019.',
  sources: [
    'ISO 9241-210, *Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems*.',
    'ISO 9241-11, *Usability: Definitions and concepts* (context of use).',
    'Council Directive 89/391/EEC (the EU Framework Directive on safety and health at work), Article 6 — the general principles of prevention.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on the design hierarchy and fitting trials.'
  ],
  sim: ['fd-fit-strategies', 'fd-context']
},

{
  id: 'ergonomic-principles', parent: 'ergo-basics', title: 'The core principles', level: 1,
  short: 'Most of ergonomics fits in eight principles: work in neutral postures; reduce force; limit repetition and static load; keep things within reach; give clearance; make it adjustable; give clear feedback; and design so errors are hard to make and easy to recover from. Each comes with ranges, a user who limits it, a virtue and a limit.',
  keywords: ['ergonomic principles', 'neutral posture', 'reduce force', 'keep loads close', 'repetition', 'static load', 'static muscle work', 'reach', 'clearance', 'adjustability', 'feedback', 'error tolerance', 'poka-yoke', 'ISO 11226', 'Rohmert curve', 'endurance time'],
  prereq: ['ergonomics-defined', 'design-for-range', 'human-centred-design'],
  related: ['neutral-postures', 'static-muscle-work', 'repetitive-strain', 'strength-and-force', 'reach-zones', 'functional-reach', 'doors-corridors', 'human-error', 'controls-design', 'alarms-warnings', 'machine-ergonomics-principles', 'posture-assessment', 'niosh-lifting-equation', 'physics:torque'],
  body: `
Ergonomics has thousands of numbers, but they come from a handful of principles. Learn the principles and you can judge a workplace you have never seen; learn only the numbers and you will apply the right number in the wrong place. Below, each principle with its rule of thumb, its range, the user who limits it, what it protects — and where it stops working. The sim **A workplace checked against the principles** lets you move the work, the part and the person and see every principle turn green, amber or red.

### 1. Work in neutral postures
Joints work best near the middle of their range: an upright trunk, upper arms hanging close to the body, elbows bent at about a right angle, wrists straight, the head balanced over the shoulders and inclined only a little. ISO 11226 judges static postures this way: trunk inclined forward up to about 20° and upper arms raised up to about 20° are acceptable for long periods; beyond about 60° either is not recommended; in between, acceptability depends on how long the posture is held and on support. The head may incline forward up to about 25°. *Virtue*: low muscle effort, low joint and disc loads. *Limit*: no posture is good for hours — the body needs movement and variety; neutral is where to spend most of the time, not the only place to be.

### 2. Reduce force — and keep loads close
A load held away from the body loads the shoulder and the lower back with a moment $M = mgd$ ([[physics:torque|torque]]): the same 5 kg part at 500 mm from the shoulder or spine is twice as hard on them as at 250 mm. The revised NIOSH equation captures this with its horizontal multiplier, $25/H$ (H in cm): at 50 cm the recommended weight limit halves ([[niosh-lifting-equation]]). Reduce force by bringing the work close, using gravity and body weight rather than fighting them, using hoists, balancers and jigs, keeping tools sharp and maintained, and giving good grips. *Limit*: close is not always possible — a guard, a conveyor or a vehicle body may be in the way; then the design must move the obstacle or provide a mechanical aid.

### 3. Limit repetition and static load
Muscles tire fastest when they cannot relax. Rohmert's classic curve relates how long a static contraction can be held to its share of maximum voluntary contraction (MVC): about 1 minute at 50 %, 2–3 minutes at 30 %, 15 minutes near 15 %. For a whole working day static levels must be far lower — Jonsson's widely used guideline keeps the static level to about 2–5 % of MVC. Repetition adds its own risk: a work cycle shorter than about 30 s, or one in which the same motions fill more than half the cycle, is usually classed as highly repetitive (Silverstein and colleagues). *Virtue*: fewer tendon, nerve and muscle disorders ([[repetitive-strain]], [[static-muscle-work]]). *Limit*: these are population guides; individuals differ, and combined with force and posture the risk rises more than any single factor suggests.

### 4. Keep things within reach
Put the most frequently used items within the forearm's sweep with the elbow near the side — for the smallest users, about 300 mm from the elbow — and occasional items within the arm's reach of the smallest user (about 590 mm from the shoulder for the 5th-percentile woman, from representative link lengths). Overhead and floor-level reaches are for rare, light items only. *Limit*: reach falls with thick clothing, body armour, restraint belts, and in older users with stiff shoulders.

### 5. Give clearance
Clearances — head, knees, feet, shoulders, hands, access openings — are set by the largest users *with* their clothing and equipment. A doorway starts from the 99th-percentile man's stature plus shoes and a walking margin (about 2000–2100 mm); a passage from the 95th–99th-percentile man's shoulder breadth (about 530–545 mm bare) plus clothing and room to move. Guards and openings for the hand follow ISO 13857 and ISO 15534. *Limit*: generous clearance costs space and can let smaller users reach where they should not — the two cases must be checked together.

### 6. Make it adjustable
Where one size cannot fit, let the user adjust — seats, work surfaces, screens, steering wheels, footrests — across the 5th-percentile woman to 95th-percentile man at least, from the working position, quickly and without tools. *Limit*: people must know that and why to adjust; adjustments that are hard to reach are not used.

### 7. Give clear feedback
Every action should produce an immediate, unmistakable response: a click, a detent, a light, a sound, a moving part. Responses within about 0.1 s feel instantaneous; up to about 1 s the flow of work is kept; longer delays need a progress indication (Miller, 1968). Show the system's state, not just the operator's input. *Limit*: too much feedback — constant beeps, alarms that never stop — is ignored ([[alarms-warnings]]).

### 8. Tolerate errors
People will make errors ([[human-error]]). Design so that errors are **hard to make** (shape coding, parts that fit only one way — the *poka-yoke* of Shigeo Shingo's production system), **easy to see** (clear states, confirmations for irreversible actions) and **easy to recover from** (undo, guarded controls, interlocks, limits on the consequences). *Limit*: forcing functions that get in the way of the normal task are defeated — the design must make the right way the easy way ([[guards-and-people]]).

### The principles at a glance
| Principle | Rule of thumb | Limiting user | Fails when |
|---|---|---|---|
| Neutral posture | trunk and upper arm 0–20°, head 0–25°, elbows ~90°, wrists straight | the extremes of size, who stoop or reach | the work is too low, high or far |
| Reduce force | loads close; aids above small weights | the weakest users | the load must be handled at a distance |
| Repetition, static load | cycle ≥ 30 s; static ≤ 2–5 % MVC all day | everyone, over time | pace set by the machine, no pauses |
| Reach | frequent ≤ forearm reach, occasional ≤ arm reach | the smallest, gloved | items spread along a long bench |
| Clearance | largest user + clothing + margin | the largest, in full kit | space is tight, equipment is bulky |
| Adjustability | 5th woman to 95th man | both ends | adjustment is hard or unknown |
| Feedback | response ≤ 0.1–1 s, state visible | novices, stressed users | silent failures, alarm floods |
| Error tolerance | hard to err, easy to see, easy to undo | tired, rushed, new users | safeguards obstruct the task |

> [!warn] Pain that persists — in the back, neck, shoulders, wrists or hands — is a reason to see a doctor or physiotherapist, and a signal to look at the work. These principles explain risk; they are not medical advice.

> [!key] Neutral posture, low force, limited repetition and static load, reach for the smallest, clearance for the largest, adjustment across both, clear feedback and tolerance of error: check every design against all eight.
`,
  ideas: [
    'Neutral postures keep joints near the middle of their range: trunk and upper arms within about 20°, head within about 25°.',
    'Force at a joint grows with the distance of the load: keep loads close (M = mgd; NIOSH halves the limit at 50 cm).',
    'Static holding and short repetitive cycles tire and injure; endurance falls steeply as the share of maximum force rises.',
    'Reach is set by the smallest users, clearance by the largest with their equipment, adjustment spans both.',
    'Feedback within a fraction of a second and designs that make errors hard, visible and recoverable complete the list.'
  ],
  pitfalls: [
    'There is one correct posture to hold all day — Even a neutral posture held without movement becomes static load; variety and movement matter.',
    'A light load cannot hurt — Light loads held far away, repeatedly, or for long periods can load the shoulder and back more than a heavy one held close and briefly.',
    'Error-proofing means adding warnings — A warning is the weakest barrier; shape, interlocks and parts that fit only one way prevent the error instead of asking people to notice it.'
  ],
  formulas: [
    {
      name: 'The moment of a load held away from a joint',
      expr: 'M = m*g*d', tex: 'M = m\\,g\\,d',
      vars: {
        M: { name: 'moment (torque) about the joint', q: 'torque', unit: 'N·m' },
        m: { name: 'mass held in the hands', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        d: { name: 'horizontal distance of the load from the joint', q: 'length', unit: 'mm', value: 500 }
      },
      note: 'The load\'s share only; the arm\'s own weight (about 5 % of body mass for one arm) adds to it. The muscles, attached a few centimetres from the joint, must pull many times harder than the load.',
      stories: { M: 'A worker holds a {m} part {d} in front of the shoulder. What moment does it add at the shoulder?', d: 'How far from the lower back can a {m} load be held for its moment to stay at {M}?' }
    },
    {
      name: 'Endurance of a static contraction (Rohmert)',
      expr: 'T = -1.5 + 2.1/f - 0.6/f^2 + 0.1/f^3', tex: 'T = -1.5 + \\dfrac{2.1}{f} - \\dfrac{0.6}{f^2} + \\dfrac{0.1}{f^3}',
      vars: {
        T: { name: 'endurance time', q: false, unit: 'min' },
        f: { name: 'force as a share of maximum voluntary contraction', q: 'ratio', unit: '%', value: 30, min: 15, max: 100 }
      },
      note: 'Rohmert\'s (1960) general curve for static holding, in minutes; valid from about 15 % of MVC upwards. Individuals and muscles vary widely, and endurance is not the same as a safe level: for a whole working day static levels should stay far lower, around 2–5 % of MVC.',
      stories: { T: 'A muscle holds {f} of its maximum. Roughly how long until it must stop?', f: 'A holding task lasts {T}. What share of maximum force could be held that long (to exhaustion)?' }
    }
  ],
  examples: [
    {
      title: 'Keep it close',
      q: 'A 5 kg part is held 250 mm and then 500 mm in front of the shoulder. Find the moment each time, and the NIOSH horizontal multiplier for hands 25 cm and 50 cm from the ankles.',
      steps: [
        '$M = 5 \\times 9.81 \\times 0.25 = 12.3$ N·m at 250 mm; $5 \\times 9.81 \\times 0.50 = 24.5$ N·m at 500 mm.',
        'NIOSH: $HM = 25/H$, so 1.0 at 25 cm and 0.5 at 50 cm — the recommended weight limit falls from 23 kg to 11.5 kg with everything else ideal.',
        'Doubling the distance doubles the load on the joint: move the work, not the worker.'
      ],
      a: '12.3 N·m against 24.5 N·m; the NIOSH limit halves.'
    },
    {
      title: 'How long can it be held?',
      q: 'Using Rohmert\'s curve, how long can a hold at 30 % and at 15 % of maximum voluntary contraction be sustained?',
      steps: [
        { text: 'At $f = 0.30$:', tex: 'T = -1.5 + \\tfrac{2.1}{0.3} - \\tfrac{0.6}{0.09} + \\tfrac{0.1}{0.027} = -1.5 + 7 - 6.67 + 3.70 = 2.5\\ \\text{min}' },
        'At $f = 0.15$: $T = -1.5 + 14 - 26.7 + 29.6 = 15.5$ min.',
        'Halving the force multiplies the endurance about six times — but these are times to exhaustion. Whole-day static work belongs near 2–5 % of maximum.'
      ],
      a: 'About 2.5 min at 30 %, about 15 min at 15 %.'
    }
  ],
  quiz: [
    { q: 'Which change most reduces the load on a worker\'s back when handling a 10 kg box?', choices: ['Bringing the box from 50 cm to 25 cm in front of the body', 'Lifting faster', 'Wearing a back belt', 'Lifting with straight legs'], a: 0, why: 'The moment is proportional to the horizontal distance: halving it halves the load on the spine.' },
    { q: 'An emergency stop must be placed for which user?', choices: ['The smallest, in the worst posture and clothing', 'The largest', 'The average', 'The maintenance technician only'], a: 0, why: 'A reach: if the smallest user can reach it, everyone can.' },
    { q: 'By Rohmert\'s curve, a hold at 50 % of maximum lasts about…', choices: ['1 minute', '10 seconds', '15 minutes', 'all day'], a: 0, why: '$-1.5 + 4.2 - 2.4 + 0.8 = 1.1$ min.' },
    { q: 'True or false: a work cycle of 20 s in which the same motions repeat throughout is usually classed as highly repetitive.', a: true, why: 'Cycles under about 30 s, or with the same motions filling over half the cycle, are the usual definition of high repetitiveness.' },
    { q: 'Which is the strongest way to prevent a part being fitted backwards?', choices: ['Shape the part and fixture so it fits only one way', 'A warning label', 'Training', 'A supervisor\'s check'], a: 0, why: 'A forcing function (poka-yoke) makes the error impossible; labels, training and checks rely on people noticing.' }
  ],
  problems: [
    { q: 'An 8 kg tool is held 600 mm in front of the lower back. What moment does the tool alone add about the lower back?', answer: 47.1, unit: 'N·m', tol: 0.01, steps: ['$M = mgd = 8 \\times 9.81 \\times 0.6$.', '$= 47.1$ N·m — a balancer or support arm removes almost all of it.'] },
    { q: 'By Rohmert\'s curve, how long can a hold at 20 % of maximum voluntary contraction last?', answer: 6.5, unit: 'min', tol: 0.02, steps: ['$T = -1.5 + 2.1/0.2 - 0.6/0.04 + 0.1/0.008$.', '$= -1.5 + 10.5 - 15 + 12.5 = 6.5$ min.'] }
  ],
  ranges: [
    { dim: 'Trunk inclination, sustained posture', range: [0, 20], unit: '°', who: 'Everyone; the work height and distance must suit the smallest and largest users', why: 'Keeps the back muscles and discs lightly loaded for long periods.', limits: '20–60° only briefly or with support; over about 60° not recommended. A single range for all ages and fitness levels.', setting: 'all', src: 'ISO 11226' },
    { dim: 'Upper-arm elevation, sustained posture', range: [0, 20], unit: '°', who: 'Everyone; set by work height and reach for the smallest users', why: 'Shoulder muscles and tendons stay relaxed.', limits: '20–60° acceptable only for limited holding times or with arm support; over about 60° not recommended.', setting: 'all', src: 'ISO 11226' },
    { dim: 'Forward head inclination, sustained', range: [0, 25], unit: '°', who: 'Everyone; set by the height of the work or screen and the viewing distance', why: 'The neck carries the head\'s weight with little muscle effort.', limits: 'Larger inclinations only briefly; bifocal wearers tilt the head back for close work.', setting: 'all', src: 'ISO 11226' },
    { dim: 'Elbow angle for hand work', range: [60, 100], unit: '°', who: 'Each user, through work height and seat height', why: 'Forearm muscles work in their middle range; shoulders stay down.', limits: 'Precision work may need the hands higher, with forearm support.', setting: ['office', 'workshop'], src: 'McAtamney and Corlett, RULA (1993): the lowest-risk band for the lower arm' },
    { dim: 'Work cycle time for repetitive hand work', range: [30, null], unit: 's', who: 'Everyone doing the task all shift', why: 'Longer, varied cycles give tissues time to recover.', limits: 'A cycle over 30 s can still be repetitive if the same motion fills most of it; force and posture add to the risk.', setting: 'workshop', src: 'Silverstein, Fine and Armstrong (1986)' },
    { dim: 'Static muscle load over a working day', range: '≤ 2–5 % of maximum voluntary contraction', who: 'Everyone, especially the weakest users', why: 'Muscles can hold low levels for hours without cumulative fatigue.', limits: 'Individual strength varies widely; measure with EMG or estimate from strength data.', setting: 'all', src: 'Jonsson (1982); Rohmert (1960)' },
    { dim: 'Frequent reaches', range: [null, 300], unit: 'mm', who: '5th-percentile woman: forearm sweep from the elbow with the upper arm near the side', why: 'No shoulder or trunk movement for most actions.', limits: 'Representative link lengths; thick gloves and clothing shorten reach.', setting: ['office', 'workshop'], src: 'Derived from representative link lengths (Drillis and Contini) and this app\'s adult body data (Tools → Body sizes)' },
    { dim: 'Feedback after an action', range: [null, 0.1], unit: 's', who: 'Every user; novices and stressed users need it most', why: 'The response feels directly caused by the action; no double presses.', limits: 'Up to about 1 s keeps the flow of work; beyond that show progress.', setting: 'all', src: 'Miller (1968)' }
  ],
  applications: [
    'Checking a new machine or workstation layout at design review, principle by principle.',
    'Assembly fixtures that hold the part at elbow height, close to the body, and accept it only one way round.',
    'Tool balancers and support arms that take the static load off the shoulder.',
    'Controls with detents and lights that confirm each action, and guarded controls for irreversible ones.'
  ],
  history: 'Frank and Lillian Gilbreth\'s "principles of motion economy" (1910s–1920s) already asked for materials close at hand and both hands working. Walter Rohmert measured static endurance in 1960; the principles of error-proofing (*poka-yoke*) were developed by Shigeo Shingo in Japanese manufacturing in the 1960s; ISO 11226 put acceptable static postures into a standard in 2000.',
  sources: [
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'ISO 6385, *Ergonomics principles in the design of work systems*.',
    'W. Rohmert (1960), on static endurance as a function of the share of maximum force (Internationale Zeitschrift für angewandte Physiologie).',
    'B. Jonsson (1982), "Measurement and evaluation of local muscular strain in the shoulder during constrained work", *Journal of Human Ergology*.',
    'B. A. Silverstein, L. J. Fine and T. J. Armstrong (1986), on hand–wrist disorders, force and repetitiveness, *British Journal of Industrial Medicine*.',
    'R. B. Miller (1968), "Response time in man–computer conversational transactions", AFIPS Fall Joint Computer Conference.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*.'
  ],
  sim: 'fd-principles'
},

{
  id: 'ergonomics-productivity', parent: 'ergo-basics', title: 'Ergonomics, productivity and cost', level: 2,
  short: 'Poor ergonomics is expensive: musculoskeletal disorders are the commonest work-related health problem in Europe, and overexertion leads the causes of the costliest injuries in the US. Good ergonomics pays back through fewer injuries and absences and through faster, better work — and a simple cash-flow appraisal, with honest ranges, shows whether a change pays.',
  keywords: ['cost of injuries', 'return on investment', 'ROI', 'payback period', 'net present value', 'direct costs', 'indirect costs', 'absenteeism', 'presenteeism', 'productivity', 'quality', 'business case', 'cost–benefit analysis', 'MSD costs', 'good ergonomics is good economics'],
  prereq: ['ergonomics-defined', 'ergonomic-principles', 'finance:npv'],
  related: ['ergonomic-risk-assessment', 'repetitive-strain', 'lifting-index-risk', 'handling-aids', 'participatory-ergonomics', 'ageing-workforce', 'finance:present-value', 'finance:time-value', 'medicine:epidemiology', 'machine-ergonomics-principles'],
  body: `
Ergonomics is often sold as care for people, and it is. It is also one of the better investments a workplace can make — not always, and not by magic, but often and for clear reasons. This page puts numbers to both sides, as ranges from well-established sources, and shows how to test a proposal of your own in the sim **Does the ergonomic change pay?**

### What poor ergonomics costs
- **Europe.** Musculoskeletal disorders (MSDs) are the most common work-related health problem in the EU: about three in five workers report MSD complaints, most often backache and aching muscles of the upper limbs (EU-OSHA, 2019, from the European Working Conditions Survey).
- **The economy.** International estimates put the cost of work-related injury and ill-health at roughly 3–4 % of gross domestic product — about 3.3 % in the EU and about 3.9 % worldwide in estimates published in 2017 (EU-OSHA with the ILO and partners). Not all of it is ergonomic, but MSDs are a large share.
- **The United States.** "Overexertion involving outside sources" — lifting, pushing, pulling, holding, carrying — has for years been the leading cause in the Liberty Mutual Workplace Safety Index, at roughly a fifth to a quarter of the direct costs of the most disabling injuries. In the years the Bureau of Labor Statistics reported them separately, MSDs made up about three in ten of the injury and illness cases that involved days away from work.

**Direct costs** — medical treatment and compensation — are the visible part. **Indirect costs** include lost output, overtime and temporary staff, hiring and training replacements, supervisors' time, investigations, damaged goods, poorer quality and morale. Estimates of the ratio of indirect to direct costs vary widely, from about 1:1 to 4:1 or more; H. W. Heinrich's famous 4:1 (1931) is a rule of thumb, not a law.

### What good ergonomics returns
The benefits come in two streams:
1. **Fewer injuries and less absence** — fewer claims, fewer lost days, less turnover, less *presenteeism* (working while in pain, slowly and with errors).
2. **Better work** — less walking, reaching and searching ([[task-analysis]]), fewer errors and rejects when the work is visible and error-proofed ([[ergonomic-principles]]), faster changeovers when the machine is easy to reach and maintain, and people who can keep working into later life ([[ageing-workforce]]).

The second stream is often the larger, and it is the one engineers control directly: a layout that saves 3 s of a 45 s cycle is a 7 % gain in output from the same people, before a single injury is counted. A systematic review of ergonomic interventions with economic evaluations (Tompa and colleagues, 2010) found strong evidence that they pay in manufacturing and warehousing, and moderate evidence in administrative and support work and in health care. Hal Hendrick's summary — *good ergonomics is good economics* — became the field's motto.

### Making the business case
1. **Measure the baseline**: MSD and injury cases per 100 workers per year, their cost (direct and indirect), absence, turnover, cycle times, error and rework rates.
2. **Estimate the effects as ranges**: a low, a central and a high estimate of the reduction in cases and of the productivity gain. Take them from your own pilot, not from the best case study you can find.
3. **Put them in time**: the investment now, the running costs and benefits each year, over the life of the equipment.
4. **Judge with payback and net present value** ([[finance:npv|NPV]]): discounting each year's benefit by $(1+i)^{-k}$ and adding the years — a [[?geometric-series]] — gives the annuity form used below.
5. **Test the sensitivity**: if the change still pays with half the expected benefit, it is robust.

### Settings
| Setting | Where the money is | Who pays, who gains |
|---|---|---|
| Civil and public buildings | fitting accessibility and good stairs, doors and counters into the design costs little; retrofitting costs much more | the owner pays; users, carers and the public health system gain |
| Office | fewer neck, back and eye complaints, fewer errors | employer and employee |
| Workshop and industry | the clearest returns: handling aids, lift tables, layout, tool balancers | often split: the production budget pays, the claims budget gains |
| Military | an injured or misfitted person is lost to a unit; equipment that does not fit must be modified or replaced; human-systems integration programmes aim to catch problems early, when fixes are cheapest | acquisition pays, operations gain |
| Field | lighter tools and mechanised handling reduce overexertion and vibration injuries among workers who are hard to replace | contractors, often small firms |

### Limitations — read the numbers critically
- **Publication bias**: successful projects are written up; failures rarely are.
- **Attribution**: injury rates change for many reasons (new staff, reporting rules, the business cycle); use a comparison group where you can.
- **Split budgets**: the department that pays for the equipment is often not the one that saves.
- **Not everything is money**: health, dignity and the ability to keep working matter in themselves, and in most countries employers must reduce risks whether or not it pays.

> [!key] Count both streams — fewer injuries and better work — as honest ranges, discount them over the life of the change, and test the result with half the benefit. Most well-chosen ergonomic changes still pay.
`,
  ideas: [
    'MSDs are the commonest work-related health problem in Europe; overexertion leads the costliest injury causes in the US.',
    'Indirect costs (lost output, replacement, quality) are often as large as or larger than the direct costs.',
    'Benefits come from fewer injuries and from better work; the productivity stream is often the larger.',
    'Judge a change with payback and net present value, from ranges of estimates, and test it with half the benefit.',
    'Case-study returns are biased towards successes; measure your own baseline and results.'
  ],
  pitfalls: [
    'The cost of an injury is the medical bill — Indirect costs of lost output, replacement staff, training and quality are often as large or larger.',
    'Ergonomics pays only through fewer injuries — Faster, more accurate work and lower turnover often return more than injury savings.',
    'A published case study shows what my project will return — Published cases are selected successes in other conditions; use them to shape a hypothesis and your own pilot to test it.'
  ],
  formulas: [
    {
      name: 'Yearly savings from fewer injury cases',
      expr: 'B = N*r*c*k', tex: 'B = N\\,r\\,c\\,k',
      vars: {
        B: { name: 'yearly saving', q: 'money', unit: '$' },
        N: { name: 'workers affected', q: 'count', value: 120, int: true },
        r: { name: 'cases per worker per year', q: 'ratio', unit: '%', value: 4 },
        c: { name: 'full cost of one case (direct + indirect)', q: 'money', unit: '$', value: 25000 },
        k: { name: 'reduction in cases', q: 'ratio', unit: '%', value: 50, max: 100 }
      },
      note: 'r of 4 % means 4 cases per 100 workers a year. Use your own records for r and c, and a range for k.',
      stories: { B: 'A plant has {N} workers with {r} MSD cases per worker a year, each costing {c}. A change cuts the cases by {k}. What does it save a year?', k: 'To save {B} a year with {N} workers, {r} cases per worker and {c} per case, by how much must cases fall?' }
    },
    {
      name: 'Simple payback period',
      expr: 'P = I/(B - C)', tex: 'P = \\dfrac{I}{B - C}',
      vars: {
        P: { name: 'payback period', q: 'years', unit: 'yr' },
        I: { name: 'investment', q: 'money', unit: '$', value: 80000 },
        B: { name: 'yearly benefit', q: 'money', unit: '$', value: 60000 },
        C: { name: 'yearly running cost', q: 'money', unit: '$', value: 5000 }
      },
      note: 'Ignores the time value of money; good for a first look. Benefits must exceed running costs.',
      stories: { P: 'Equipment costs {I}, returns {B} a year and costs {C} a year to run. How long until it has paid for itself?', B: 'What yearly benefit pays back {I} in {P} with running costs of {C}?' }
    },
    {
      name: 'Net present value of an ergonomic investment',
      expr: 'NPV = -I + (B - C)*(1 - (1 + i)^(-n))/i', tex: '\\mathrm{NPV} = -I + (B - C)\\,\\dfrac{1 - (1 + i)^{-n}}{i}',
      vars: {
        NPV: { name: 'net present value', q: 'money', unit: '$', signed: true, tex: '\\mathrm{NPV}' },
        I: { name: 'investment now', q: 'money', unit: '$', value: 80000 },
        B: { name: 'yearly benefit', q: 'money', unit: '$', value: 60000 },
        C: { name: 'yearly running cost', q: 'money', unit: '$', value: 5000 },
        i: { name: 'discount rate', q: 'ratio', unit: '%', value: 6, min: 0.1, max: 100 },
        n: { name: 'life of the change', q: 'years', unit: 'yr', value: 5, min: 0.5, max: 50 }
      },
      note: 'Equal yearly net benefits at the end of each year, discounted at rate i. A positive NPV means the change beats leaving the money at that rate.',
      stories: { NPV: 'An investment of {I} returns {B} a year for {n}, with running costs of {C}. At a discount rate of {i}, what is its net present value?', B: 'What yearly benefit gives an NPV of {NPV} on an investment of {I} over {n} at {i}, with running costs of {C}?' }
    }
  ],
  examples: [
    {
      title: 'Vacuum lifters in a warehouse',
      q: 'Forty pickers have 6 MSD cases per 100 workers a year, each costing about ¤30,000 in all. Vacuum lifters cost ¤90,000 plus ¤6,000 a year to maintain. Expect cases to halve and output to rise 2 % on labour costing ¤45,000 per worker a year. Find the payback and the 5-year NPV at 6 %; then halve all benefits.',
      steps: [
        'Injury savings: $40 \\times 0.06 \\times 30{,}000 \\times 0.5 = ¤36{,}000$ a year.',
        'Productivity: $0.02 \\times 40 \\times 45{,}000 = ¤36{,}000$ a year. Total benefit ¤72,000; net of running costs ¤66,000.',
        'Payback: $90{,}000/66{,}000 = 1.4$ years.',
        'NPV: the annuity factor at 6 % over 5 years is $(1 - 1.06^{-5})/0.06 = 4.212$; $66{,}000 \\times 4.212 - 90{,}000 = ¤188{,}000$.',
        'Half the benefits: net ¤30,000 a year, payback 3 years, NPV $30{,}000 \\times 4.212 - 90{,}000 = ¤36{,}000$ — still positive.'
      ],
      a: 'Payback about 1.4 years and NPV about ¤188,000; with half the benefit, 3 years and about ¤36,000. Robust.'
    }
  ],
  quiz: [
    { q: 'Which usually belongs to the indirect cost of a back injury at work?', choices: ['Overtime and a replacement worker', 'The doctor\'s fee', 'The compensation payment', 'The physiotherapy'], a: 0, why: 'Medical care and compensation are direct costs; lost output, replacements, training and supervision are indirect.' },
    { q: 'A change still pays when its benefits are halved. What does that tell you?', choices: ['The decision is robust to over-optimistic estimates', 'The estimates were wrong', 'The change will fail', 'Nothing'], a: 0, why: 'Sensitivity testing shows how much the conclusion depends on uncertain benefits; surviving a halving is a strong sign.' },
    { q: 'Why are published ergonomics case studies likely to overstate returns?', choices: ['Successful projects are more likely to be written up', 'Ergonomists exaggerate', 'Costs are always hidden', 'They use old currencies'], a: 0, why: 'Publication bias: failures are rarely reported, so the published average is optimistic.' },
    { q: 'True or false: an ergonomic improvement that saves 3 s of a 45 s cycle raises output by about 7 % with the same people.', a: true, why: '45/42 = 1.071: the productivity stream alone can justify a change.' },
    { q: 'In the NPV formula, raising the discount rate…', choices: ['lowers the present value of future benefits', 'raises it', 'has no effect', 'only changes the payback'], a: 0, why: 'Each future benefit is divided by $(1+i)^k$; a higher rate shrinks them.' }
  ],
  problems: [
    { q: 'A lift table costs ¤12,000 and saves ¤5,000 a year net of running costs. What is the simple payback?', answer: 2.4, unit: 'yr', tol: 0.01, steps: ['$P = 12{,}000/5{,}000 = 2.4$ years.'] },
    { q: 'An investment of ¤50,000 returns ¤15,000 a year net for 6 years. What is its NPV at 8 %?', answer: 19344, tol: 0.01, steps: ['Annuity factor: $(1 - 1.08^{-6})/0.08 = 4.623$.', '$15{,}000 \\times 4.623 - 50{,}000 = ¤19{,}340$ (about ¤19,300).'] }
  ],
  applications: [
    'Business cases for handling aids, lift tables, adjustable workstations and layout changes.',
    'Choosing between design options at the drawing stage, when ergonomic fixes are cheapest.',
    'Explaining to managers why a machine designed to ergonomic recommendations is worth a higher price.',
    'Try your own numbers with [[finance:npv|net present value in Hyper Finances]] or the sim below.'
  ],
  history: 'Maurice Oxenburgh\'s *Increasing Productivity and Profit through Health and Safety* (1991) gave companies a way to cost the whole productivity effect of working conditions. Hal Hendrick\'s 1996 address "Good ergonomics is good economics" to the Human Factors and Ergonomics Society collected cases in which ergonomic design paid for itself, and the phrase became the field\'s motto.',
  sources: [
    'EU-OSHA (2019), *Work-related musculoskeletal disorders: prevalence, costs and demographics in the EU*.',
    'EU-OSHA with the ILO and partners (2017), estimates of the cost of work-related injury and illness.',
    'Liberty Mutual Insurance, *Workplace Safety Index* (annual), the leading causes and costs of disabling injuries in the US.',
    'E. Tompa et al. (2010), "A systematic review of workplace ergonomic interventions with economic analyses", *Journal of Occupational Rehabilitation*.',
    'M. Oxenburgh, P. Marlow and A. Oxenburgh, *Increasing Productivity and Profit through Health and Safety*, 2nd ed.',
    'H. W. Hendrick, "Good ergonomics is good economics", Human Factors and Ergonomics Society (1996).'
  ],
  sim: 'fd-roi'
},

{
  id: 'ergo-standards', parent: 'ergo-basics', title: 'Ergonomics standards', level: 2,
  short: 'Ergonomics is written down in layers: laws that oblige employers and manufacturers to consider people; general standards on the ergonomic approach (ISO 26800, ISO 6385, ISO 9241-210); standards of data and methods (ISO 7250, ISO 11226, ISO 11228); and standards for particular things — machinery (EN 614, ISO 14738), offices (ISO 9241, EN 1335), the environment, buildings and military systems (MIL-STD-1472). They differ between the EU, the UK, the US and elsewhere.',
  keywords: ['ergonomics standards', 'ISO 6385', 'ISO 26800', 'EN 614', 'ISO 9241', 'ISO 7250', 'ISO 11226', 'ISO 11228', 'ISO 14738', 'EN 1005', 'harmonised standards', 'Machinery Directive', 'Machinery Regulation', 'OSHA', 'General Duty Clause', 'MIL-STD-1472', 'DEF STAN 00-250', 'ANSI/HFES 100', 'ISO/TC 159', 'action values'],
  prereq: ['ergonomics-defined', 'ergonomic-principles'],
  related: ['machine-ergonomics-principles', 'anthropometry-basics', 'niosh-lifting-equation', 'noise-exposure', 'hand-arm-vibration', 'whole-body-vibration', 'office-chair', 'lighting-levels', 'thermal-comfort', 'accessible-design', 'military-human-factors', 'ergonomic-risk-assessment', 'motors:emergency-stop'],
  body: `
An engineer designing a machine, a workstation or a building meets ergonomics first as a stack of documents. It helps to see the stack as layers, each answering a different question: **law** says *what you must achieve*; **standards** say *how it is usually achieved and measured*; **guidance and textbooks** explain *why*, and fill the gaps. The sim **Which standards apply?** lets you choose what you are designing and where, and lights up the layers that matter.

### Law: the duties
| Where | Workplaces | Machines and products | Buildings |
|---|---|---|---|
| **European Union** | Framework Directive 89/391/EEC (assess risks; adapt the work to the individual); directives on manual handling (90/269/EEC), display screen equipment (90/270/EEC), noise (2003/10/EC), vibration (2002/44/EC) — each made law by the member states | Machinery Directive 2006/42/EC, whose essential requirements include ergonomics; replaced by the Machinery Regulation (EU) 2023/1230, applying from January 2027 | national building codes |
| **United Kingdom** | Manual Handling Operations Regulations 1992; Display Screen Equipment Regulations 1992; Control of Noise at Work Regulations 2005; Control of Vibration at Work Regulations 2005 | Supply of Machinery (Safety) Regulations 2008 | Building Regulations (access and use) |
| **United States** | no general federal ergonomics standard (OSHA's standard of 2000 was repealed in 2001); the General Duty Clause of the OSH Act, OSHA guidelines, the noise standard 29 CFR 1910.95, and a few state rules such as California's on repetitive motion injuries | product liability; voluntary consensus standards | 2010 ADA Standards for Accessible Design |
| **Defence** | — | MIL-STD-1472 (US human engineering design criteria) and MIL-STD-46855 (the human engineering process); DEF STAN 00-250 (UK human factors) | — |

In the EU, **harmonised standards** — European standards cited for a directive or regulation — give a *presumption of conformity*: a machine built to them is presumed to meet the essential requirements they cover. That is why EN ISO 12100, EN 614, EN 1005, EN 894, EN 547 and EN ISO 14738 matter so much to machine builders.

### Standards: the family
International ergonomics standards are written by ISO/TC 159 (Ergonomics) and, in Europe, CEN/TC 122.

| Layer | Standards | What they give |
|---|---|---|
| **The approach** | ISO 26800 (general approach, principles, concepts); ISO 6385 (ergonomic principles in the design of work systems); ISO 27500 (the human-centred organisation); ISO 9241-210 (human-centred design); ISO 10075 (mental workload) | the process and principles — who, what, how to involve users |
| **Data** | ISO 7250-1 (body measurement definitions); ISO/TR 7250-2 (national summary statistics); ISO 15535 (building anthropometric databases); ISO 15537 (test persons for anthropometric testing) | measurements everyone defines the same way |
| **Body and forces** | ISO 11226 (static postures); ISO 11228-1, -2, -3 (lifting and carrying; pushing and pulling; repetitive handling of low loads); ISO/TR 12295 (applying them); EN 1005-1 to -5 (human physical performance at machinery) | methods and limits for postures and handling |
| **Machinery** | ISO 12100 (risk assessment); EN 614-1 and -2 (ergonomic design principles); ISO 14738 (anthropometry of workstations at machinery); ISO 15534 / EN 547 (access openings); ISO 13857 (safety distances); ISO 9355 and EN 894 (displays and controls); ISO 11064 (control centres) | dimensions and rules for machines and their operators |
| **Office and product** | ISO 9241 series (e.g. -5 workstation layout, -11 usability); EN 1335-1 (office chairs); EN 527-1 (office desks); ANSI/HFES 100 (computer workstations, US) | the seated workplace and interactive systems |
| **Environment** | ISO 9612 (noise measurement); ISO 5349-1 and ISO 2631-1 (hand-arm and whole-body vibration); ISO 7730 (thermal comfort); ISO 7243 (WBGT heat stress); ISO 11079 (cold); EN 12464-1 (lighting of indoor workplaces) | how to measure and judge exposures |
| **Buildings and schools** | ISO 21542 (accessibility of the built environment); 2010 ADA Standards; EN 1729-1 (school furniture) | public spaces and children |

### The headline numbers — and what they rest on
| Quantity | Value | Source | Rests on |
|---|---|---|---|
| Daily noise exposure, EU | 80 / 85 dB(A) action values, 87 dB(A) limit ($L_{EX,8h}$) | Directive 2003/10/EC | hearing-loss risk over a working life; the limit counts hearing protection, the action values do not |
| Noise, US | 90 dB(A) permissible limit, 85 dB(A) action level, 5 dB exchange rate | OSHA 29 CFR 1910.95 | older criteria; NIOSH recommends 85 dB(A) with a 3 dB exchange |
| Hand-arm vibration | 2.5 m/s² action, 5 m/s² limit, A(8) | Directive 2002/44/EC | vibration white finger and nerve damage |
| Whole-body vibration | 0.5 m/s² action, 1.15 m/s² limit, A(8) | Directive 2002/44/EC | back disorders in drivers |
| Lifting | 23 kg load constant; 25 kg reference mass | NIOSH (1991/1994); ISO 11228-1 | ideal lifts by most of the working population |
| Office chair | seat height adjustable over 400–510 mm | EN 1335-1 | popliteal heights of the 5th woman to the 95th man, with shoes |
| Office lighting | 500 lx on the task for writing, reading, screen work | EN 12464-1 | visual performance and comfort |
| Thermal comfort | PMV between −0.5 and +0.5, PPD below 10 % (category B) | ISO 7730 | Fanger's comfort model |

The last column is the point: a number is only as good as the population and the harm it was set for. Under EU law 88 dB(A) over 8 hours exceeds the upper action value and needs a noise-reduction programme and compulsory hearing protection; under OSHA it is below the 90 dB(A) limit but above the 85 dB(A) action level, so a hearing conservation programme is required. Same noise, different duties.

### How to use standards well — and their limits
- **Minimums, not targets.** A standard records a consensus of what is reasonable; good design often does better.
- **Populations.** Their data often come from particular (mostly European and North American, adult, working-age) populations; check who your users are ([[population-differences]]).
- **Editions and countries.** Standards are revised every few years and national rules differ: always check the current edition and the law where the product is sold or the work is done.
- **Scope.** A standard covers what it says it covers; meeting ISO 11228-1 says nothing about noise or vibration. A risk assessment still has to look at the whole job ([[ergonomic-risk-assessment]]).
- **Access.** Most standards are sold, not free; their key values are summarised in textbooks and official guidance — but the standard itself governs.

> [!warn] The numbers on this page are summaries for learning. Legal limits are those of the country where the work is done or the product sold; read the current text of the law and standard before relying on a value.

> [!key] Law sets the duty, standards show the usual way and the measurements, guidance explains. Know which layer a number comes from, what population and harm it rests on, and whether it is a minimum, an action value or a limit.
`,
  ideas: [
    'Law sets duties, standards describe how to meet and measure them, guidance explains why.',
    'In the EU, harmonised standards give a presumption of conformity with the machinery rules they cover.',
    'General standards (ISO 26800, ISO 6385) set the approach; data, method and product standards give the numbers.',
    'The US has no general federal ergonomics standard; OSHA relies on the General Duty Clause, guidelines and specific standards such as noise.',
    'Every headline number rests on a population and a harm; limits differ between countries.'
  ],
  pitfalls: [
    'Meeting the standard means the design is ergonomic — Standards are consensus minimums for what they cover; a compliant design can still fit its real users badly.',
    'A limit is a safe level — Action and limit values balance risk against practicality; some people are harmed below them, which is why action values require measures early.',
    'The same number applies everywhere — EU, UK and US rules differ (for example on noise exchange rates and limits); use the rules where the work is done.'
  ],
  examples: [
    {
      title: 'The same noise under two laws',
      q: 'A press shop has a steady 88 dB(A) over an 8-hour shift. What must an employer do under EU law and under OSHA?',
      steps: [
        'EU: $L_{EX,8h} = 88$ dB(A) exceeds the upper action value of 85 dB(A): a programme to reduce noise, marked zones and compulsory hearing protection. The 87 dB(A) limit value counts the protectors, so with protectors bringing the level at the ear below 87 dB(A) the limit is respected.',
        'OSHA: the time-weighted average of 88 dB(A) is below the 90 dB(A) permissible limit but above the 85 dB(A) action level: a hearing conservation programme with monitoring, audiometric tests, protectors and training.',
        'Both say: reduce the noise at its source first ([[noise-control]]).'
      ],
      a: 'EU: noise programme and compulsory protectors; US: hearing conservation programme. Same shop, different duties.'
    },
    {
      title: 'Which standards for a new machine sold in Europe?',
      q: 'You design a packaging machine for the EU market with an operator station and manual loading. Which ergonomics documents do you start from?',
      steps: [
        'The law: the Machinery Directive 2006/42/EC now, the Machinery Regulation (EU) 2023/1230 from January 2027 — including their essential requirement on ergonomics.',
        'Risk assessment: EN ISO 12100. Ergonomic design principles: EN 614-1 and -2.',
        'Dimensions: EN ISO 14738 for the workstation, ISO 15534 / EN 547 for openings, ISO 13857 for safety distances. Forces and postures: EN 1005-2 to -5. Controls and displays: EN 894 / ISO 9355.',
        'And the workplace that will use it must still be assessed by the employer under the national laws based on 89/391/EEC.'
      ],
      a: 'Directive or Regulation → EN ISO 12100 → EN 614 → EN ISO 14738, ISO 13857, ISO 15534, EN 1005, EN 894.'
    }
  ],
  quiz: [
    { q: 'In the EU, what does designing a machine to a harmonised standard give?', choices: ['A presumption of conformity with the essential requirements the standard covers', 'An exemption from risk assessment', 'Automatic compliance in the US', 'Nothing legally'], a: 0, why: 'Harmonised standards cited under the directive or regulation give a presumption of conformity — for what they cover only.' },
    { q: 'Which standard sets out the general ergonomics approach, principles and concepts?', choices: ['ISO 26800', 'ISO 7250-1', 'EN 1335-1', 'ISO 9612'], a: 0, why: 'ISO 26800 is the umbrella; ISO 7250-1 defines body measurements, EN 1335-1 covers office chairs, ISO 9612 noise measurement.' },
    { q: 'True or false: the US has a general federal OSHA ergonomics standard for all workplaces.', a: false, why: 'OSHA\'s ergonomics program standard of 2000 was repealed in 2001; OSHA uses the General Duty Clause, guidelines and specific standards.' },
    { q: 'The EU exposure limit value for noise (87 dB(A)) differs from the action values because…', choices: ['it takes the attenuation of hearing protectors into account', 'it is measured in a different unit', 'it applies only to peak noise', 'it is voluntary'], a: 0, why: 'Action values are judged without protectors; the limit value is the exposure at the ear, with protectors.' },
    { q: 'Which is a standard of anthropometric data definitions rather than of a product?', choices: ['ISO 7250-1', 'EN 527-1', 'ISO 11064', 'EN 1729-1'], a: 0, why: 'ISO 7250-1 defines how body dimensions are measured; the others cover desks, control centres and school furniture.' }
  ],
  problems: [
    { q: 'Under OSHA\'s 5 dB exchange rate and 90 dB(A) limit, how many hours a day is exposure to 95 dB(A) permitted?', answer: 4, unit: 'h', tol: 0.01, steps: ['$T = 8 / 2^{(95 - 90)/5} = 8/2 = 4$ h.'] },
    { q: 'With the EU\'s 3 dB exchange rate, after how many hours at 91 dB(A) does a worker reach an 8-hour equivalent of 85 dB(A)?', answer: 2, unit: 'h', tol: 0.01, steps: ['Every 3 dB halves the time: $T = 8 / 2^{(91 - 85)/3} = 8/4 = 2$ h.'] }
  ],
  ranges: [
    { dim: 'Daily noise exposure, EU action values and limit', range: '80 / 85 dB(A) action; 87 dB(A) limit (L_EX,8h)', unit: 'dB(A)', who: 'Every worker exposed; the limit is at the ear, with protectors', why: 'Keeps the risk of noise-induced hearing loss over a working life low; action values trigger measures early.', limits: 'Some people are harmed below the action values; peaks have their own values (135 / 137 / 140 dB(C)).', setting: ['workshop', 'field', 'military'], src: 'Directive 2003/10/EC' },
    { dim: 'Noise, US permissible exposure limit', range: '90 dB(A) TWA, 85 dB(A) action level, 5 dB exchange', unit: 'dB(A)', who: 'Workers under OSHA', why: 'Legal limit and trigger for a hearing conservation programme.', limits: 'NIOSH recommends 85 dB(A) with a 3 dB exchange, which is more protective.', setting: ['workshop', 'field'], src: 'OSHA 29 CFR 1910.95; NIOSH REL' },
    { dim: 'Hand-arm vibration, daily exposure A(8)', range: '2.5 m/s² action, 5 m/s² limit', unit: 'm/s²', who: 'Users of vibrating hand tools', why: 'Protects against vibration white finger, nerve and joint damage.', limits: 'Cold, grip force and individual susceptibility change the risk; symptoms are not always reversible.', setting: ['workshop', 'field'], src: 'Directive 2002/44/EC; ISO 5349-1' },
    { dim: 'Whole-body vibration, daily exposure A(8)', range: '0.5 m/s² action, 1.15 m/s² limit', unit: 'm/s²', who: 'Drivers and operators of vehicles and mobile machines', why: 'Limits back disorders from long-term vibration and shocks.', limits: 'Shocks and posture matter as much as the average; some states use the vibration dose value instead.', setting: ['vehicle', 'field', 'military'], src: 'Directive 2002/44/EC; ISO 2631-1' },
    { dim: 'Lifting: load under ideal conditions', range: '23 kg (NIOSH load constant); 25 kg (ISO 11228-1 reference mass)', unit: 'kg', who: 'Most of the adult working population, ideal lifts', why: 'The starting point that every less-than-ideal factor reduces.', limits: 'Real lifts are rarely ideal; the recommended limit is usually far lower. Not for pregnant workers, young people or others needing more protection without further assessment.', setting: ['workshop', 'field', 'health'], src: 'Waters et al. (1993); ISO 11228-1' },
    { dim: 'Office chair seat height (adjustment)', range: [400, 510], unit: 'mm', who: '5th-percentile woman to 95th-percentile man with shoes', why: 'Feet flat, thighs level, no pressure under the thighs.', limits: 'Small users at a fixed desk need a footrest.', setting: 'office', src: 'EN 1335-1' },
    { dim: 'Maintained illuminance for office tasks', range: [500, null], unit: 'lx', who: 'Normal-sighted adults; older eyes need more', why: 'Reading, writing and screen work without strain.', limits: 'More light is not better if it causes glare or reflections on screens.', setting: 'office', src: 'EN 12464-1' },
    { dim: 'Thermal comfort, predicted percentage dissatisfied', range: [null, 10], unit: '%', who: 'Occupants at their usual clothing and activity (PMV −0.5 to +0.5)', why: 'Most people comfortable; performance and satisfaction kept.', limits: 'Individuals differ; the model is for steady indoor conditions.', setting: ['office', 'civil'], src: 'ISO 7730 (category B)' }
  ],
  applications: [
    'Designing a machine for the EU market: from the Machinery Directive (Regulation from 2027) through EN ISO 12100 and EN 614 to the dimension standards.',
    'Specifying office furniture and lighting to EN 1335-1, EN 527-1 and EN 12464-1.',
    'Military procurement with MIL-STD-1472 or DEF STAN 00-250 in the contract.',
    'Finding every range recommended in this app, with its source, in [the Dimension finder](#/tools/ranges).'
  ],
  history: 'ISO set up its technical committee on ergonomics, ISO/TC 159, in 1975; ISO 6385, the first general ergonomics standard for work systems, followed in 1981 and was revised in 2004 and 2016. The US military standard MIL-STD-1472 has been revised many times since the 1960s and remains one of the most detailed collections of human-engineering criteria.',
  sources: [
    'ISO 26800, *Ergonomics — General approach, principles and concepts*.',
    'ISO 6385, *Ergonomics principles in the design of work systems*.',
    'EN 614-1 and EN 614-2, *Safety of machinery — Ergonomic design principles*.',
    'ISO 12100, *Safety of machinery — General principles for design — Risk assessment and risk reduction*.',
    'Directive 2006/42/EC on machinery; Regulation (EU) 2023/1230 on machinery products.',
    'Council Directive 89/391/EEC; Directives 2003/10/EC (noise) and 2002/44/EC (vibration).',
    'OSHA, 29 CFR 1910.95, *Occupational noise exposure*.',
    'MIL-STD-1472, *Human Engineering* (US Department of Defense); DEF STAN 00-250, *Human Factors for Designers of Systems* (UK Ministry of Defence).'
  ],
  sim: 'fd-standards-map'
},

{
  id: 'task-analysis', parent: 'ergo-methods', title: 'Task analysis', level: 2,
  short: 'Before designing a job, find out what it really consists of. Task analysis breaks work into goals, tasks and operations (hierarchical task analysis), records how often and in what order things are used (link analysis), times the elements, and notes what each demands of the body and the mind — so that the design fixes the real problems.',
  keywords: ['task analysis', 'hierarchical task analysis', 'HTA', 'link analysis', 'time study', 'work sampling', 'predetermined motion time systems', 'MTM', 'therbligs', 'cognitive task analysis', 'job hazard analysis', 'cycle time', 'work content', 'allowances', 'hand travel', 'workplace layout'],
  prereq: ['ergonomics-defined', 'human-centred-design', 'ergonomic-principles'],
  related: ['posture-assessment', 'ergonomic-risk-assessment', 'reach-zones', 'material-flow-layout', 'assembly-lines', 'work-rest-scheduling', 'human-error', 'mental-workload', 'control-rooms', 'fitts-law', 'participatory-ergonomics'],
  body: `
Designers usually know how a job is *supposed* to be done. Task analysis finds out how it *is* done — every step, how often, in what order, with what information, in what posture — because ergonomic problems hide in the details: the fourth screw that needs an awkward wrist, the part that must be fetched from the far end of the bench forty times an hour, the reset that happens only on a night shift.

### Hierarchical task analysis (HTA)
HTA, introduced by John Annett and Keith Duncan in 1967, describes work as a hierarchy of **goals**, broken into sub-goals and finally into **operations**, with **plans** saying in what order and under what conditions the operations are done. For a bench assembly:

| No. | Goal / operation | Plan, notes and demands |
|---|---|---|
| 0 | Assemble a switch housing | do 1–5 in order; repeat; if a part is faulty do 6 |
| 1 | Place the base | 1.1 reach to bin A · 1.2 grasp · 1.3 place in fixture |
| 2 | Fit the cover | 2.1 reach to bin B · 2.2 grasp · 2.3 align — look at the instruction screen when the variant changes |
| 3 | Drive four screws | 3.1 take a screw (×4) · 3.2 start it by hand · 3.3 pick up the screwdriver · 3.4 drive · 3.5 put it back — wrist deviation, fine vision |
| 4 | Inspect | check seams and label — visual demand, a decision |
| 5 | Put the housing in the outbox | a reach, sometimes to the side |
| 6 | Reject a faulty part | reject bin, record — an infrequent task, easily forgotten in design |

Stop breaking down when further detail would not change the design. Record for each operation the **posture, force, frequency, duration**, the **information** needed, the **decisions** and the **errors** possible — this is the raw material for [[posture-assessment]], [[ergonomic-risk-assessment]] and [[human-error]] analysis.

### Link analysis
A link is a movement of the hands, eyes or feet — or of a person or material — between two elements of a workplace. Count the links per cycle (their **frequency**) and weigh them by **importance** (safety-critical links first); then place the most-linked elements closest together and the most important ones where they are easiest to reach and see. The total cost of a layout is the sum over all links of frequency times distance, $\\sum f_i d_i$ — a [[?sum]] you can shrink by moving things. In the sim **Link analysis of an assembly bench**, drag the bins, screws and tool around the fixture: the link lines thicken with frequency, the readout gives hand travel per cycle and per shift, and items beyond the smallest user's reach turn red. Press *Improve the layout* to let a simple search swap positions until the travel stops falling.

### Timing the work
- **Time study** — timing each element with a stopwatch or video over many cycles, rated for pace.
- **Work sampling** — observing at random moments and counting what is being done (see [[posture-assessment]] for how many observations are needed).
- **Predetermined motion time systems** such as MTM (Methods-Time Measurement, published in 1948): times for basic motions — reach, grasp, move, position — looked up from tables by distance and difficulty, so a job can be timed before it exists.
- **Allowances** — personal needs, recovery from fatigue and unavoidable delays are added to the basic time to give a standard time; work-study practice adds, typically, of the order of 10–20 % for light to moderate work, more for heavy or hot work ([[fatigue-rest-breaks]]).

The same numbers carry the ergonomics: a 45 s cycle repeated for a 7.5-hour shift is 600 cycles, and a layout with 6.4 m of hand travel per cycle adds up to nearly 4 km of reaching a day.

### Beyond the hands
**Cognitive task analysis** asks what people must know, notice, remember and decide — essential for control rooms, cockpits and maintenance. **Job hazard analysis** lists the hazards step by step. **Functional analysis**, used in military and aerospace systems, first decides which functions go to people and which to machines, then analyses the human ones.

### Settings
| Setting | What task analysis must catch |
|---|---|
| Civil — home and public | first-time, infrequent and hurried users; children, older and disabled people; misuse |
| Office | screen, keyboard and phone tasks, their durations and interruptions |
| Workshop and industry | cycles, reaches, forces, changeovers, cleaning and maintenance — the non-routine tasks where many accidents happen |
| Military | missions broken into functions and tasks, with equipment, clothing and time pressure (MIL-STD-46855 describes the process) |
| Field | non-cyclic tasks that change with weather, terrain and the site; travel and set-up as well as the work |

### Limits
Work as imagined differs from work as done: observe, and ask the people who do the job ([[participatory-ergonomics]]). Being observed changes behaviour. Rare tasks — faults, emergencies, cleaning, maintenance — are easily missed, and are often where the worst demands lie. A task analysis is a snapshot: repeat it when products, volumes or staff change.

> [!key] Break the job into goals and operations, count the links and time the elements, and record what each step asks of the body and the mind — then design the layout so the most frequent and important links are the shortest.
`,
  ideas: [
    'Hierarchical task analysis breaks work into goals, sub-goals and operations, with plans for their order.',
    'Link analysis places the most frequently and most importantly linked elements closest together; its cost is the sum of frequency times distance.',
    'Time study, work sampling and predetermined motion times give the numbers; allowances turn basic time into standard time.',
    'Record posture, force, frequency, duration, information and possible errors for each step.',
    'Rare tasks — maintenance, cleaning, faults — are easily missed and often the most demanding.'
  ],
  pitfalls: [
    'The written procedure is the task — Work as done differs from work as imagined; observe it and ask the people who do it.',
    'Only the normal cycle matters — Changeovers, cleaning, maintenance and fault recovery carry many of the worst postures and most of the accidents.',
    'A shorter cycle time is always better — A faster pace raises repetition and cuts recovery; timing must include allowances for people to stay healthy.'
  ],
  formulas: [
    {
      name: 'Hand travel per shift',
      expr: 'Ds = Tsh/Tc*dc', tex: 'D_s = \\dfrac{T_{sh}}{T_c}\\,d_c',
      vars: {
        Ds: { name: 'hand travel per shift', q: 'length', unit: 'km', tex: 'D_s' },
        Tsh: { name: 'working time in the shift', q: 'time', unit: 'h', value: 7.5, tex: 'T_{sh}' },
        Tc: { name: 'cycle time', q: 'time', unit: 's', value: 45, tex: 'T_c' },
        dc: { name: 'hand travel per cycle', q: 'length', unit: 'm', value: 6.4, tex: 'd_c' }
      },
      note: 'T_sh/T_c is the number of cycles. The same product counts reaches, lifts or steps per shift.',
      stories: { Ds: 'A cycle of {Tc} involves {dc} of hand travel. How far do the hands travel in {Tsh}?', dc: 'To keep hand travel to {Ds} in a {Tsh} shift of {Tc} cycles, how much travel per cycle is allowed?' }
    },
    {
      name: 'Standard time from basic time and allowances',
      expr: 'Tst = Tb*(1 + A)', tex: 'T_{st} = T_b\\,(1 + A)',
      vars: {
        Tst: { name: 'standard time', q: 'time', unit: 's', tex: 'T_{st}' },
        Tb: { name: 'basic time (at a standard pace)', q: 'time', unit: 's', value: 40, tex: 'T_b' },
        A: { name: 'allowances for personal needs, recovery and delays', q: 'ratio', unit: '%', value: 15 }
      },
      note: 'Allowances depend on the work: more for heavy, hot, noisy or static work. Setting them too low builds fatigue into the job.',
      stories: { Tst: 'Elements take {Tb} at a standard pace; allowances are {A}. What is the standard time?', A: 'A job with a basic time of {Tb} is set at {Tst}. What allowance does that include?' }
    }
  ],
  examples: [
    {
      title: 'Four kilometres a day',
      q: 'An assembly cycle takes 45 s and involves 16 hand movements averaging 400 mm. How far do the hands travel in a 7.5-hour shift? A new layout brings the average to 250 mm.',
      steps: [
        'Per cycle: $16 \\times 0.40 = 6.4$ m. Cycles per shift: $7.5 \\times 3600 / 45 = 600$.',
        'Per shift: $600 \\times 6.4 = 3840$ m ≈ 3.8 km.',
        'New layout: $16 \\times 0.25 = 4.0$ m a cycle, 2.4 km a shift — 1.4 km less reaching, and every movement also shorter in time ([[fitts-law]]).'
      ],
      a: 'About 3.8 km a shift, falling to 2.4 km.'
    },
    {
      title: 'Allowances',
      q: 'The elements of a job take 40 s at a standard pace. With 15 % allowances, what is the standard time, and how many cycles fit in 7.5 hours?',
      steps: [
        '$T_{st} = 40 \\times 1.15 = 46$ s.',
        '$7.5 \\times 3600 / 46 = 587$ cycles, not the 675 that the basic time alone would suggest.'
      ],
      a: '46 s; about 587 cycles a shift.'
    }
  ],
  quiz: [
    { q: 'In link analysis, which elements should be placed closest together?', choices: ['Those with the most frequent or most important links', 'The largest ones', 'Those used by the supervisor', 'Alphabetically'], a: 0, why: 'Minimising the sum of frequency times distance, weighted for importance, puts the busiest links shortest.' },
    { q: 'In hierarchical task analysis, a "plan" states…', choices: ['the order and conditions in which sub-tasks are done', 'the cost of the task', 'the layout of the workstation', 'the training schedule'], a: 0, why: 'Plans link the operations under each goal: in sequence, repeated, or when a condition arises.' },
    { q: 'Which tasks does a task analysis most often miss?', choices: ['Maintenance, cleaning, changeovers and fault recovery', 'The main production cycle', 'Tasks done every minute', 'Tasks in the written procedure'], a: 0, why: 'Rare and non-routine tasks are easily overlooked, and often involve the worst postures and highest risks.' },
    { q: 'True or false: predetermined motion time systems let a job be timed before it exists.', a: true, why: 'Times for basic motions come from tables by distance and difficulty, so a planned layout can be timed on paper.' },
    { q: 'A 30 s cycle with 5 m of hand travel runs for 8 hours. About how far do the hands travel?', choices: ['4.8 km', '480 m', '48 km', '1.2 km'], a: 0, why: '$8 \\times 3600/30 = 960$ cycles × 5 m = 4800 m.' }
  ],
  problems: [
    { q: 'A 36 s cycle includes 5.5 m of hand travel. How many kilometres is that in a 7-hour working day?', answer: 3.85, unit: 'km', tol: 0.01, steps: ['Cycles: $7 \\times 3600 / 36 = 700$.', 'Travel: $700 \\times 5.5 = 3850$ m = 3.85 km.'] }
  ],
  ranges: [
    { dim: 'Frequently used items (many times a minute)', range: [null, 300], unit: 'mm', who: '5th-percentile woman: the forearm\'s sweep from the elbow, upper arm near the side', why: 'Most actions need no shoulder or trunk movement; shortest times.', limits: 'Representative link lengths; gloves and bulky clothing shorten reach; two-handed work needs the items near the midline.', setting: ['office', 'workshop'], src: 'Derived from representative link lengths (Drillis and Contini) and this app\'s adult body data (Tools → Body sizes); Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Occasionally used items', range: [null, 590], unit: 'mm', who: '5th-percentile woman\'s arm reach, measured from the shoulder joint', why: 'Reachable without leaning or stepping.', limits: 'Full stretch: for occasional use only; add the effect of a desk edge, a guard or a restraint.', setting: ['office', 'workshop', 'vehicle'], src: 'Derived from representative link lengths (Drillis and Contini) and this app\'s adult body data (Tools → Body sizes)' },
    { dim: 'Work cycle for repetitive hand work', range: [30, null], unit: 's', who: 'Every worker on the task all shift', why: 'Longer, varied cycles give tissues time to recover.', limits: 'A long cycle can still be repetitive if the same motion fills most of it.', setting: 'workshop', src: 'Silverstein, Fine and Armstrong (1986)' }
  ],
  applications: [
    'Laying out assembly benches, machine panels, kitchens and cockpits from link frequencies.',
    'Timing a planned production line and checking its pace against recovery needs.',
    'Finding the tasks — maintenance, cleaning, faults — where a new machine will be hardest to use.',
    'Supplying the steps, postures and forces that a risk assessment then scores.'
  ],
  history: 'Frederick Taylor timed work with a stopwatch in the 1880s–1900s; Frank and Lillian Gilbreth filmed motions and named their elements "therbligs". L. H. C. Tippett introduced work sampling in British textile mills in the 1930s. MTM was published in 1948 by Maynard, Stegemerten and Schwab, and hierarchical task analysis by Annett and Duncan in 1967.',
  sources: [
    'J. Annett and K. D. Duncan (1967), "Task analysis and training design", *Occupational Psychology*.',
    'B. Kirwan and L. K. Ainsworth (eds), *A Guide to Task Analysis*.',
    'H. B. Maynard, G. J. Stegemerten and J. L. Schwab, *Methods-Time Measurement* (1948).',
    'International Labour Office, *Introduction to Work Study* (work measurement and allowances).',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design*, on task and link analysis and workplace arrangement.'
  ],
  sim: 'fd-link-analysis'
},

{
  id: 'posture-assessment', parent: 'ergo-methods', title: 'Assessing postures', level: 2,
  short: 'Postures are assessed by watching work and scoring the body\'s angles. Observational methods such as OWAS, RULA and REBA turn joint angles, loads and repetition into a score and an action level; ISO 11226 judges static postures; work sampling shows how much of a shift is spent in each posture; sensors and video now measure the angles directly.',
  keywords: ['posture assessment', 'RULA', 'REBA', 'OWAS', 'ISO 11226', 'EN 1005-4', 'observational methods', 'action level', 'posture score', 'work sampling', 'joint angles', 'trunk flexion', 'upper arm elevation', 'inclinometer', 'wearable sensors', 'video analysis'],
  prereq: ['ergonomic-principles', 'task-analysis', 'neutral-postures'],
  related: ['ergonomic-risk-assessment', 'joint-ranges', 'static-muscle-work', 'repetitive-strain', 'spinal-loading', 'digital-human-models', 'patient-handling', 'construction-ergonomics', 'agriculture-ergonomics', 'math:probability'],
  body: `
A posture is a set of joint angles held for a time. To judge one, ergonomists watch the work (live or on video), estimate the angles of the trunk, neck, arms, wrists and legs, note the load, how long the posture is held and how often it recurs, and turn all that into a score that ranks the risk and says how urgently to act. The methods differ in which body parts they look at and how they combine them; all of them rest on the same idea — **the farther a joint works from its neutral range, the longer and the more often, and the heavier the load, the higher the risk**.

### The methods
| Method | Origin | Looks at | Result | Suits |
|---|---|---|---|---|
| **OWAS** | Finnish steel industry (Ovako), Karhu, Kansi and Kuorinka, 1977 | back (4 classes), arms (3), legs (7), load (3) — a four-digit posture code | action category 1 (no action) to 4 (act immediately) | whole-body, varied work: construction, farming, maintenance |
| **RULA** | McAtamney and Corlett, 1993 | upper arm, lower arm, wrist, neck, trunk, legs; muscle use and force | grand score 1–7 and four action levels | seated and standing upper-limb work: screens, assembly, sewing |
| **REBA** | Hignett and McAtamney, 2000 | trunk, neck, legs, arms, wrists; load, grip coupling, activity | score 1–15: negligible, low, medium, high, very high | whole-body and unpredictable postures: health care, services |
| **ISO 11226** (and EN 1005-4 for machinery) | international standards, 2000 | trunk, head, upper arm, forearm, wrist, legs; holding time | acceptable, acceptable under conditions, not recommended | static postures; design checks |
| Others | QEC (Li and Buckle), the Strain Index (Moore and Garg, 1995), OCRA (Occhipinti; ISO 11228-3) | exposure checklists; distal upper limb; repetitive movements | indices and zones | screening; repetitive hand work |

### The angle bands
The methods share similar breakpoints. The bands below are those used in RULA, with ISO 11226's zones for the trunk and upper arm:

| Body part | Near neutral | Larger | Largest | Also scored |
|---|---|---|---|---|
| Trunk (forward inclination) | upright to about 20° | 20–60° | over 60° | twisting, side bending, no support for the legs |
| Upper arm (from the side of the body) | 20° back to 20° forward | 20–45°, then 45–90° | over 90° | shoulder raised, arm abducted; arm supported lowers it |
| Lower arm (elbow flexion) | 60–100° | — | under 60° or over 100° | working across the body's midline or out to the side |
| Wrist | straight | up to 15° bent | over 15° bent | sideways deviation, twist |
| Neck | 0–10° forward | 10–20° | over 20°, or bent back | twisting, side bending |
| Legs | both feet supported, weight even | — | one leg, kneeling, squatting | walking (OWAS) |

The sim **Score a posture** draws a manikin in any posture you set, colours each body segment by its band, and shows three views side by side: the RULA-style band of each part, the ISO 11226 zones for trunk, upper arm and head, and the OWAS posture code. Its overall verdict follows a simple *worst-segment* rule for teaching; the real methods combine the parts through their own published tables, which you should use for a real assessment.

### From angles to action
Each method then adds what the angles miss: the **load or force** (RULA and REBA add points above about 2 kg and 10 kg; OWAS has classes below 10 kg, 10–20 kg and over 20 kg), **static or repeated muscle use** (in RULA, a posture held over a minute or repeated four or more times a minute), and the **grip** or **activity**. The result is an **action level**: in RULA, 1–2 acceptable, 3–4 investigate further, 5–6 investigate and change soon, 7 change immediately. Scores rank tasks and show which body part drives the risk — which is exactly what a designer needs to fix.

### How long and how often: work sampling
A snapshot says nothing about duration. **Work sampling** observes at random moments through the shift and counts the share of observations, $p$, in each posture class. Because each observation is a yes/no trial, the estimate has a [[?standard-deviation|standard deviation]] of $\\sqrt{p(1-p)/n}$, and to know $p$ within $\\pm e$ at 95 % confidence you need about
$$n = \\frac{z^2\\,p\\,(1-p)}{e^2}$$
observations, with $z = 1.96$. Estimating a 20 % share to within ±5 points takes about 250 observations; the worst case, $p$ = 50 %, about 385. OWAS was designed for exactly this kind of sampling.

### Measuring the angles
Observers estimate angles from the side, ideally perpendicular to the plane of movement; video lets several people score the same frames. Inclinometers and wearable inertial sensors measure trunk and arm angles all shift long, and video pose estimation is making automatic scoring common. Each has errors — parallax, clothing hiding the joints, sensor drift — and each needs clear definitions of what is being measured.

### Settings
| Setting | Typical use | What to watch for |
|---|---|---|
| Office | RULA on screen work, laptops, phones | neck and wrist; long static holds |
| Workshop and industry | RULA or OCRA on assembly; REBA or OWAS on handling | cycle-by-cycle repetition; the rare awkward task |
| Health care | REBA on patient handling | unpredictable, shared loads |
| Military | posture in crew stations, with armour and helmets; loads carried | equipment changes posture: helmets tilt the head, armour limits trunk bending |
| Field — construction, agriculture | OWAS, work sampling over whole days | stooping, kneeling, overhead work, uneven ground |

### Limits
Observational scores are simplifications: they rank risk well but do not predict who will be injured. Observers disagree by several degrees on the same posture, and the methods disagree with one another — never compare a RULA score with a REBA score. Scores ignore individual differences, recovery time and the combined effect of many small exposures. Use them to find and fix the worst postures, then check the fix with the same method.

> [!key] Score the angles against neutral bands, add load, duration and repetition, and let the worst body part tell you what to redesign. Sample over time to know how long people spend there.
`,
  ideas: [
    'Posture methods score joint angles against bands around neutral and add load, static holding and repetition.',
    'OWAS gives a four-digit code for back, arms, legs and load; RULA focuses on the upper limb; REBA on the whole body; ISO 11226 on static postures.',
    'A score ranks risk and points to the body part to fix; the published tables of each method turn scores into action levels.',
    'Work sampling estimates how much of a shift is spent in a posture; its precision needs n = z²p(1−p)/e² observations.',
    'Scores from different methods cannot be compared, and none predicts individual injury.'
  ],
  pitfalls: [
    'A single photograph is enough to assess a job — A snapshot misses how long and how often postures occur; observe whole cycles and sample over the shift.',
    'A RULA score of 5 and a REBA score of 5 mean the same — Each method has its own scale and action levels; compare scores only within one method.',
    'An acceptable score means no one will be hurt — Scores rank typical risk; individuals, recovery and combined exposures differ.'
  ],
  formulas: [
    {
      name: 'Observations needed for work sampling',
      expr: 'n = z^2*p*(1 - p)/acc^2', tex: 'n = \\dfrac{z^2\\,p\\,(1 - p)}{e^2}',
      vars: {
        n: { name: 'number of random observations', q: 'count' },
        z: { name: 'standard normal value for the confidence (1.96 for 95 %)', q: 'none', value: 1.96 },
        p: { name: 'expected share of observations in the posture', q: 'ratio', unit: '%', value: 20, min: 0.1, max: 99.9 },
        acc: { name: 'accuracy wanted (± percentage points)', q: 'ratio', unit: '%', value: 5, min: 0.1, max: 50, tex: 'e' }
      },
      note: 'Observations at random moments, independent of the work cycle. p(1 − p) is largest at p = 50 %, the worst case when nothing is known in advance.',
      stories: { n: 'A posture is expected in about {p} of the time. How many random observations estimate it within {acc} at z = {z}?', acc: 'With {n} observations and a share of about {p}, how precise is the estimate at z = {z}?' }
    }
  ],
  examples: [
    {
      title: 'Drilling into a ceiling',
      q: 'A fitter stands upright and drills overhead: upper arms raised 120°, elbows at 90°, wrists straight, the neck bent back about 20° to see the drill, feet flat. The drill weighs 3 kg. Band each body part and judge the posture.',
      steps: [
        'Upper arm: over 90° — the highest band. ISO 11226: elevation over 60° is not recommended.',
        'Neck: bent back — the highest neck band (extension).',
        'Trunk upright, elbows in the 60–100° band, wrists straight, legs supported: all lowest bands.',
        'Load: 3 kg held — RULA and REBA add for loads over about 2 kg; repeated or held over a minute adds again.',
        'Verdict: the arms and neck drive the risk. Raise the worker (a platform) or bring the work down, or use a drill stand or pole that puts the force through the legs.'
      ],
      a: 'Highest bands for upper arm and neck; change it — platform or drill stand.'
    },
    {
      title: 'How many observations?',
      q: 'You expect workers to stoop more than 60° about 20 % of the time. How many random observations give that share to ±5 points at 95 % confidence? And to ±3 points?',
      steps: [
        '$n = 1.96^2 \\times 0.2 \\times 0.8 / 0.05^2 = 3.84 \\times 0.16 / 0.0025 = 246$.',
        'For ±3 points: $3.84 \\times 0.16 / 0.0009 = 683$ — halving the error roughly quadruples the effort.'
      ],
      a: 'About 250 observations; about 680 for ±3 points.'
    }
  ],
  quiz: [
    { q: 'Which method was designed around a four-digit code for back, arms, legs and load?', choices: ['OWAS', 'RULA', 'REBA', 'ISO 9612'], a: 0, why: 'OWAS codes the back (4 classes), arms (3), legs (7) and load (3).' },
    { q: 'An office worker types with the neck bent forward 25°. In the RULA bands, the neck is…', choices: ['in the highest flexion band (over 20°)', 'neutral', 'in the lowest band', 'not scored'], a: 0, why: 'RULA bands the neck at 0–10°, 10–20° and over 20° (extension scores highest).' },
    { q: 'Why should a posture assessment observe many cycles rather than one moment?', choices: ['Duration and frequency matter as much as the angle', 'Cameras need time to focus', 'Standards require exactly 100 observations', 'Workers slow down at first'], a: 0, why: 'A snapshot shows the angle, not how long or how often it occurs, which drives fatigue and injury.' },
    { q: 'True or false: work sampling needs the most observations when the posture occupies about half of the time.', a: true, why: '$p(1-p)$ is largest at $p = 0.5$.' },
    { q: 'Which is the best use of a posture score?', choices: ['Ranking tasks and finding the body part to redesign', 'Predicting which worker will be injured', 'Comparing with a score from another method', 'Replacing a conversation with workers'], a: 0, why: 'Scores rank risk and point to causes; they do not predict individuals and are method-specific.' }
  ],
  problems: [
    { q: 'How many random observations are needed to estimate a posture occupying about 10 % of the time to within ±4 percentage points at 95 % confidence (z = 1.96)?', answer: 216, tol: 0.02, steps: ['$n = 1.96^2 \\times 0.1 \\times 0.9 / 0.04^2$.', '$= 3.8416 \\times 0.09 / 0.0016 = 216$.'] }
  ],
  ranges: [
    { dim: 'Trunk forward inclination, lowest-risk band', range: [0, 20], unit: '°', who: 'Everyone; work heights set for the smallest and largest users keep people in it', why: 'Low back muscle effort and disc load.', limits: 'Twisting or side bending adds risk at any inclination.', setting: 'all', src: 'ISO 11226; McAtamney and Corlett (RULA, 1993)' },
    { dim: 'Upper arm elevation, lowest-risk band', range: [-20, 20], unit: '°', who: 'Everyone (negative = arm behind the body)', why: 'Shoulder muscles and tendons relaxed.', limits: 'Raised shoulders or abducted arms add risk inside the band.', setting: 'all', src: 'McAtamney and Corlett (RULA, 1993); ISO 11226' },
    { dim: 'Elbow flexion, lowest-risk band', range: [60, 100], unit: '°', who: 'Everyone, through work and seat heights', why: 'Forearm muscles in their middle range.', limits: 'Working across the midline or to the side adds risk.', setting: ['office', 'workshop'], src: 'McAtamney and Corlett (RULA, 1993)' },
    { dim: 'Neck flexion, lowest-risk band', range: [0, 10], unit: '°', who: 'Everyone, through screen, document and work heights', why: 'The head balanced over the neck.', limits: 'ISO 11226 accepts forward head inclination up to about 25°; bending back (extension) scores highest.', setting: ['office', 'workshop'], src: 'McAtamney and Corlett (RULA, 1993); ISO 11226' },
    { dim: 'Wrist flexion or extension', range: [null, 15], unit: '°', who: 'Everyone; set by tool handles, keyboard slope and work height', why: 'Tendons of the forearm glide freely through the wrist.', limits: 'Straight is best; any sideways deviation or twist adds risk.', setting: ['office', 'workshop'], src: 'McAtamney and Corlett (RULA, 1993)' },
    { dim: 'Random observations for work sampling to ±5 points (95 %)', range: [140, 385], unit: 'observations', who: 'Posture shares from about 10 % to 50 % of the time', why: 'Enough observations for a share to be trusted.', limits: 'Observations must be random and independent of the work cycle; rare postures need many more.', setting: 'all', src: 'Binomial sampling; work-sampling practice (Tippett)' }
  ],
  applications: [
    'Ranking the jobs on a line so the worst are redesigned first.',
    'Checking a new workstation or tool by scoring a trial user before and after the change.',
    'Scoring the postures of digital manikins in a CAD model ([[digital-human-models]]).',
    'Whole-day posture profiles from wearable sensors in construction, farming and health care.'
  ],
  history: 'OWAS was developed at the Finnish steel company Ovako Oy and published in 1977. Lynn McAtamney and Nigel Corlett published RULA in 1993, and Sue Hignett and McAtamney REBA in 2000, both in *Applied Ergonomics*. ISO 11226 on static working postures appeared in 2000.',
  sources: [
    'O. Karhu, P. Kansi and I. Kuorinka (1977), "Correcting working postures in industry: a practical method for analysis", *Applied Ergonomics*.',
    'L. McAtamney and E. N. Corlett (1993), "RULA: a survey method for the investigation of work-related upper limb disorders", *Applied Ergonomics*.',
    'S. Hignett and L. McAtamney (2000), "Rapid Entire Body Assessment (REBA)", *Applied Ergonomics*.',
    'ISO 11226, *Ergonomics — Evaluation of static working postures*; EN 1005-4, *Evaluation of working postures and movements in relation to machinery*.',
    'ISO 11228-3, *Handling of low loads at high frequency* (OCRA).'
  ],
  sim: 'fd-posture-score'
},

{
  id: 'ergonomic-risk-assessment', parent: 'ergo-methods', title: 'Ergonomic risk assessment', level: 2,
  short: 'An ergonomic risk assessment finds the tasks that can hurt people, estimates how likely and how serious the harm is — with screening checklists and quantitative tools such as the NIOSH lifting index and the noise and vibration exposures — controls the risk, starting with design rather than training or protective equipment, and checks that the controls worked.',
  keywords: ['risk assessment', 'ergonomic risk', 'hazard identification', 'screening tools', 'lifting index', 'KIM', 'MAC', 'ART', 'OCRA', 'Strain Index', 'daily noise exposure', 'A(8)', 'LEX,8h', 'action values', 'hierarchy of controls', 'risk matrix', 'ISO 12100', 'principles of prevention'],
  prereq: ['ergonomic-principles', 'task-analysis', 'posture-assessment'],
  related: ['niosh-lifting-equation', 'lifting-index-risk', 'noise-exposure', 'hand-arm-vibration', 'whole-body-vibration', 'handling-aids', 'job-rotation', 'hearing-protection', 'ergo-standards', 'ergonomics-productivity', 'participatory-ergonomics', 'medicine:risk-communication'],
  body: `
A risk assessment asks four questions about every task: **what could hurt someone, how likely is it, how bad would it be — and what will we do about it?** For ergonomics the hazards are the ones this app describes: loads, postures, repetition, force, vibration, noise, heat and cold, poor lighting, and demands on attention and time. The law in most countries requires employers to assess them (in the EU through the Framework Directive 89/391/EEC and its daughter directives), and machine designers must do the same for their products (ISO 12100).

### The steps
1. **Identify** — walk the workplace, read injury and absence records, ask the workers (discomfort surveys, body maps), use a [[task-analysis]] to list the steps. Include cleaning, maintenance and faults.
2. **Screen** — quick checklists sort tasks into clearly fine, clearly not, and needs a closer look: the UK HSE's MAC (manual handling) and ART (repetitive tasks) tools, the German Key Indicator Methods (KIM), the quick assessment of ISO/TR 12295.
3. **Assess in detail** — with a quantitative method for each hazard: the NIOSH lifting equation or ISO 11228-1 for lifting, ISO 11228-2 or the Snook and Ciriello tables for pushing and pulling, OCRA or the Strain Index for repetitive hand work, [[posture-assessment]] methods, noise measured to ISO 9612, vibration to ISO 5349 and ISO 2631.
4. **Control** — following the hierarchy below.
5. **Record, review, re-assess** — after the change, and whenever the work changes.

### Numbers that turn traffic lights
| Hazard | Measure | Green | Amber | Red | Basis |
|---|---|---|---|---|---|
| Lifting | lifting index LI = load / RWL | ≤ 1 | 1–3 | > 3 | revised NIOSH equation; [[lifting-index-risk]] |
| Noise | daily exposure $L_{EX,8h}$ | < 80 dB(A) | 80–85 dB(A) | ≥ 85 dB(A) (limit 87 at the ear) | Directive 2003/10/EC |
| Hand-arm vibration | A(8) | < 2.5 m/s² | 2.5–5 m/s² | > 5 m/s² | Directive 2002/44/EC |
| Whole-body vibration | A(8) | < 0.5 m/s² | 0.5–1.15 m/s² | > 1.15 m/s² | Directive 2002/44/EC |
| Static posture | trunk or upper-arm angle | ≤ 20° | 20–60°, time-limited | > 60° | ISO 11226 |
| Repetition | cycle time | ≥ 30 s, varied | < 30 s | < 30 s with force or awkward posture | Silverstein et al.; ISO 11228-3 |

Two of these are daily doses, and both scale with time in a way worth knowing. Vibration exposure grows with the [[?square-root]] of time: $A(8) = a\\sqrt{T/8\\,\\text{h}}$ — halving the trigger time lowers A(8) only by a factor of 1.4. Noise adds by energy, so the level rises by $10\\log_{10}$ of the time ratio ([[?logarithm]]): each halving of time lowers $L_{EX,8h}$ by only 3 dB. Cutting exposure time helps less than cutting the source.

The sim **Screen a job for risk, then control it** runs these numbers for one job — a lift, a noise, a vibrating tool and a posture — and lets you switch on controls from the hierarchy to see which bars fall and by how much.

### Likelihood × severity
Where no quantitative method exists, teams often rate likelihood and severity on scales of 1–5 and multiply them in a **risk matrix**. It is useful for ranking and discussion, but the numbers are ordinal: a 12 is not "twice" a 6. Prefer a measured exposure wherever there is a method.

### Controlling the risk
The EU's general principles of prevention put the order plainly: avoid risks; evaluate those that cannot be avoided; combat them at source; adapt the work to the individual; replace the dangerous by the less dangerous; give collective protection priority over individual protection; instruct the workers. For ergonomics that becomes:

| Level | Example | Effect |
|---|---|---|
| **Eliminate** | deliver parts at waist height; automate the lift | the hazard is gone |
| **Substitute or redesign** | smaller packs, lighter materials, a quieter process | the hazard is smaller |
| **Engineering controls** | lift tables, hoists, vacuum lifters, balancers; low-vibration tools; enclosures | the exposure falls for everyone, every time |
| **Administrative** | job rotation, breaks, maintenance of tools, training | the dose falls if people follow it |
| **Personal protective equipment** | hearing protection, anti-vibration gloves | the last line — often uncomfortable, often not worn, gloves do little for vibration |

### Settings
| Setting | What the assessment emphasises |
|---|---|
| Civil — home and public | the public cannot be trained or selected: design out falls, pinches and exclusion; accessibility audits |
| Office | display screen assessments: chair, desk, screen, breaks, eyesight |
| Workshop and industry | handling, repetition, vibration and noise at each workstation; machine hazards |
| Health care | patient handling assessments for each person and each task |
| Military | equipment assessed for noise, vibration, heat, load and fit as part of human systems integration |
| Field | site-by-site and day-by-day ("dynamic") assessment: weather, terrain, lone work, distance from help |

### Limits
Screening tools are not diagnoses, and the detailed methods each cover one hazard: combined exposures — a heavy lift in the cold with a vibrating tool — are not simply added by any of them. Pregnant workers, young workers, older workers and people with disabilities need individual consideration. And a score can be gamed; involve the people who do the work, and judge the task, not the number.

> [!warn] Exposure limits are those of the country where the work is done. Symptoms that persist — pain, numbness, tingling, whitening fingers, ringing in the ears — are a reason to see a doctor and to re-assess the task; this page is not medical advice.

> [!key] Identify, screen, measure, control from the top of the hierarchy, and check the result: design changes that remove the exposure beat rules and protective equipment that ask people to endure it.
`,
  ideas: [
    'A risk assessment identifies hazards, estimates likelihood and severity, controls the risk and reviews the result.',
    'Screening tools sort tasks; quantitative methods (NIOSH LI, A(8), L_EX,8h, ISO 11226) measure them against action and limit values.',
    'Vibration dose grows with the square root of time and noise with the logarithm of time: cutting time helps less than cutting the source.',
    'Controls follow a hierarchy: eliminate, substitute, engineer, organise, and protective equipment last.',
    'Risk matrices rank; they do not measure — use a quantitative method wherever one exists.'
  ],
  pitfalls: [
    'Training people to lift properly controls the risk — Training is an administrative control near the bottom of the hierarchy; redesigning the lift removes the exposure.',
    'Halving exposure time halves the risk — Vibration dose falls only by √2 and noise exposure by 3 dB; reduce the source.',
    'A likelihood × severity score of 12 is twice as risky as 6 — The scales are ordinal; the product ranks tasks but is not a measurement.'
  ],
  formulas: [
    {
      name: 'Lifting index',
      expr: 'LI = m/RWL', tex: '\\mathrm{LI} = \\dfrac{m}{\\mathrm{RWL}}',
      vars: {
        LI: { name: 'lifting index', q: 'none', tex: '\\mathrm{LI}' },
        m: { name: 'load lifted', q: 'mass', unit: 'kg', value: 12 },
        RWL: { name: 'recommended weight limit for the task', q: 'mass', unit: 'kg', value: 5.8, tex: '\\mathrm{RWL}' }
      },
      note: 'RWL from the revised NIOSH equation for the task\'s geometry and frequency. LI ≤ 1: nearly all workers; LI > 1: increased risk for some; LI > 3: high risk for many.',
      stories: { LI: 'A {m} box is lifted where the recommended weight limit is {RWL}. What is the lifting index?', m: 'What load gives a lifting index of {LI} where the RWL is {RWL}?' }
    },
    {
      name: 'Daily vibration exposure A(8)',
      expr: 'A8 = a*sqrt(T/T0)', tex: 'A_{(8)} = a\\,\\sqrt{\\dfrac{T}{T_0}}',
      vars: {
        A8: { name: 'daily exposure A(8)', q: 'accel', unit: 'm/s²', tex: 'A_{(8)}' },
        a: { name: 'vibration total value of the tool', q: 'accel', unit: 'm/s²', value: 6 },
        T: { name: 'daily time holding the vibrating tool (trigger time)', q: 'time', unit: 'h', value: 2 },
        T0: { name: 'reference duration', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'For hand-arm vibration a is the vibration total value (ISO 5349-1); for whole-body vibration use the highest frequency-weighted axis (ISO 2631-1). EU action and limit values: 2.5 and 5 m/s² (hand-arm), 0.5 and 1.15 m/s² (whole-body).',
      stories: { A8: 'A grinder vibrates at {a} and is used for {T} a day. What is the daily exposure A(8)?', T: 'How long may a tool at {a} be used before A(8) reaches {A8}?' }
    },
    {
      name: 'Daily noise exposure from one steady level',
      expr: 'LEX = LA + 10*log10(T/T0)', tex: 'L_{EX,8h} = L_{A} + 10\\log_{10}\\dfrac{T}{T_0}',
      vars: {
        LEX: { name: 'daily noise exposure level', q: 'soundlevel', unit: 'dB', tex: 'L_{EX,8h}' },
        LA: { name: 'A-weighted equivalent level during the exposure', q: 'soundlevel', unit: 'dB', value: 92, tex: 'L_{A}' },
        T: { name: 'daily exposure time', q: 'time', unit: 'h', value: 3 },
        T0: { name: 'reference duration', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'Energy averaging with a 3 dB exchange rate (ISO 9612, EU). With several activities, add their energies. OSHA uses a 5 dB exchange rate and a different formula.',
      stories: { LEX: 'A worker spends {T} a day at {LA}, and the rest of the day in quiet. What is the daily exposure?', T: 'How long can a worker spend at {LA} before the daily exposure reaches {LEX}?' }
    }
  ],
  examples: [
    {
      title: 'A lift from the floor — and a lift table',
      q: 'A 12 kg box is lifted twice a minute over an 8-hour shift from the floor (hands 15 cm high, 45 cm in front of the ankles) to a bench 75 cm high, with a fair grip. The NIOSH multipliers are HM 0.56, VM 0.82, DM 0.90, AM 1, FM 0.65, CM 0.95. A lift table then brings the box to 75 cm, 30 cm from the ankles, so the travel is short (DM 1, VM 1, HM 0.83, CM 1). Find the lifting index before and after.',
      steps: [
        'Before: $RWL = 23 \\times 0.556 \\times 0.82 \\times 0.895 \\times 1 \\times 0.65 \\times 0.95 = 5.8$ kg; $LI = 12/5.8 = 2.1$ — amber, close to high.',
        'After: $RWL = 23 \\times 0.833 \\times 1 \\times 1 \\times 1 \\times 0.65 \\times 1 = 12.5$ kg; $LI = 12/12.5 = 0.96$ — green.',
        'An engineering control removed the stoop and the distance; no training asked anyone to endure it.'
      ],
      a: 'LI about 2.1 before and 0.96 after the lift table.'
    },
    {
      title: 'A grinder and a noisy hall',
      q: 'A grinder vibrates at 6 m/s² and is used for 2 hours a day, in a hall at 92 dB(A) for 3 hours (quiet otherwise). Find A(8) and $L_{EX,8h}$; how long could the grinder be used before the action and limit values?',
      steps: [
        '$A(8) = 6\\sqrt{2/8} = 3.0$ m/s² — above the 2.5 m/s² action value.',
        'Action value reached after $8 (2.5/6)^2 = 1.39$ h; limit value after $8 (5/6)^2 = 5.6$ h.',
        '$L_{EX,8h} = 92 + 10\\log_{10}(3/8) = 92 - 4.3 = 87.7$ dB(A) — above the upper action value; the level at the ear, with protectors, must stay below the 87 dB(A) limit.',
        'Better: a lower-vibration grinder and quieter process than shorter shifts.'
      ],
      a: 'A(8) = 3.0 m/s² (action after 1.4 h, limit after 5.6 h); L_EX,8h ≈ 87.7 dB(A).'
    }
  ],
  quiz: [
    { q: 'Which control is highest in the hierarchy for a heavy lift from the floor?', choices: ['Deliver the load at waist height so no floor lift is needed', 'Train workers in lifting technique', 'Rotate workers every hour', 'Provide back belts'], a: 0, why: 'Removing the floor lift eliminates the hazard; the others leave it in place.' },
    { q: 'A tool is used for 4 h instead of 8 h. By what factor does A(8) fall?', choices: ['About 1.4 (√2)', '2', '4', 'It does not change'], a: 0, why: '$A(8) \\propto \\sqrt{T}$: half the time gives $1/\\sqrt 2$ of the dose.' },
    { q: 'Halving the time spent at a steady noise level lowers $L_{EX,8h}$ by about…', choices: ['3 dB', '6 dB', '50 %', '10 dB'], a: 0, why: '$10\\log_{10}(1/2) = -3$ dB.' },
    { q: 'True or false: a lifting index of 0.9 means the lift is safe for every worker.', a: false, why: 'LI ≤ 1 protects nearly all healthy workers under the equation\'s assumptions; individuals and combined exposures still matter.' },
    { q: 'What is the main weakness of a likelihood × severity risk matrix?', choices: ['Its scales are ordinal, so products rank but do not measure risk', 'It cannot be used for ergonomics', 'It needs a computer', 'It is required by law'], a: 0, why: 'The numbers order categories; multiplying them gives a ranking, not a quantity.' }
  ],
  problems: [
    { q: 'A breaker vibrates at 12 m/s². How many minutes of trigger time a day bring A(8) to the EU action value of 2.5 m/s²?', answer: 20.8, unit: 'min', tol: 0.02, steps: ['$T = 8\\,\\text{h} \\times (2.5/12)^2 = 8 \\times 0.0434 = 0.347$ h.', '$0.347 \\times 60 = 20.8$ min.'] },
    { q: 'A worker spends 5 hours at 88 dB(A) and the rest of the shift in quiet. What is the daily exposure $L_{EX,8h}$?', answer: 86.0, unit: 'dB', tol: 0.005, steps: ['$L_{EX,8h} = 88 + 10\\log_{10}(5/8) = 88 - 2.04 = 86.0$ dB(A) — above the upper action value.'] }
  ],
  ranges: [
    { dim: 'Lifting index of a manual lift', range: [null, 1], unit: '', who: 'Nearly all healthy workers under the NIOSH equation\'s assumptions', why: 'Keeps the lift within limits set from biomechanical, physiological and psychophysical criteria.', limits: 'Not for one-handed, seated, kneeling or very fast lifts, or for unstable loads; LI between 1 and 3 is increased risk, above 3 high risk.', setting: ['workshop', 'field', 'health'], src: 'Waters, Putz-Anderson, Garg and Fine (1993); NIOSH Applications Manual (1994)' },
    { dim: 'Daily noise exposure without action (EU lower action value)', range: [null, 80], unit: 'dB(A)', who: 'Every exposed worker, without hearing protection', why: 'Below 80 dB(A) over a working life, the added risk of hearing loss is small.', limits: 'Above it, information and hearing protectors must be offered; above 85 dB(A) protectors are compulsory and a noise programme required.', setting: ['workshop', 'field', 'military'], src: 'Directive 2003/10/EC' },
    { dim: 'Hand-arm vibration A(8) without action', range: [null, 2.5], unit: 'm/s²', who: 'Users of vibrating hand tools', why: 'Below the EU action value the risk of vibration white finger and nerve damage is low.', limits: 'Cold and tight grips raise the risk; above 5 m/s² is the limit value.', setting: ['workshop', 'field'], src: 'Directive 2002/44/EC; ISO 5349-1' },
    { dim: 'Whole-body vibration A(8) without action', range: [null, 0.5], unit: 'm/s²', who: 'Drivers and operators of vehicles and mobile machines', why: 'Keeps the risk of back disorders low.', limits: 'Shocks and jolts need separate attention; 1.15 m/s² is the limit value.', setting: ['vehicle', 'field', 'military'], src: 'Directive 2002/44/EC; ISO 2631-1' }
  ],
  applications: [
    'Workplace assessments under national law, with priorities for the tasks that score red.',
    'Machine design reviews under ISO 12100 that include handling, posture, noise and vibration.',
    'Choosing between a lift table, a hoist and job rotation by what each does to the numbers.',
    'Running the numbers for your own tasks in [the lifting calculators](#/tools/lifting/niosh) and [the noise and vibration tools](#/tools/environment/noise).'
  ],
  sources: [
    'Council Directive 89/391/EEC, Article 6 (general principles of prevention) and Article 9 (risk assessment).',
    'ISO 12100, *Safety of machinery — Risk assessment and risk reduction*.',
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine (1993), "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics*; NIOSH, *Applications Manual for the Revised NIOSH Lifting Equation* (1994).',
    'ISO 11228-1, -2 and -3; ISO/TR 12295 (application document for ISO 11228 and ISO 11226).',
    'Directive 2003/10/EC (noise) and ISO 9612; Directive 2002/44/EC (vibration), ISO 5349-1 and ISO 2631-1.',
    'UK Health and Safety Executive, the MAC and ART assessment tools.'
  ],
  sim: 'fd-risk-screen'
},

{
  id: 'user-trials-mockups', parent: 'ergo-methods', title: 'Fitting trials and mock-ups', level: 2,
  short: 'The surest test of a design is people using it. Fitting trials put a range of real users — deliberately including the smallest and the largest — into an adjustable mock-up to find the dimensions they accept; usability tests watch people try a prototype. Small panels find most problems quickly, but estimating a range needs the extremes and enough people.',
  keywords: ['fitting trial', 'user trial', 'mock-up', 'rig', 'seating buck', 'method of limits', 'bracketing', 'test persons', 'ISO 15537', 'usability testing', 'think-aloud', 'prototype', 'sample size', 'five users', 'participant selection', 'informed consent'],
  prereq: ['human-centred-design', 'design-for-range', 'task-analysis'],
  related: ['digital-human-models', 'percentiles', 'combining-percentiles', 'usability', 'clothing-ppe-allowances', 'accessible-design', 'crew-stations', 'participatory-ergonomics', 'math:probability', 'math:standard-deviation'],
  body: `
Tables of body sizes and digital manikins get a design close; people finish it. A **fitting trial** puts real users into a mock-up whose dimensions can be changed and asks, for each dimension, what they can use and what they prefer. A **usability test** watches people try to do real tasks with a prototype and notes where they hesitate, err or give up. Both catch what data and theory miss: the way people actually sit, lean, grip and read, the effect of a thick glove or a helmet, the control nobody finds.

### Mock-ups: fidelity against cost and time
| Kind | Made of | Good for | Limits |
|---|---|---|---|
| Cardboard and foam, full scale | card, foam board, tape | very early: space, reach, clearance, layout | no forces, no real surfaces |
| Adjustable rig (seating buck, cab or console rig) | extrusions, clamps, real seats and controls | fitting trials: heights, distances, angles | still static; controls may not work |
| Virtual reality with body tracking | headset and tracking | layout and sight lines before hardware exists | no touch or forces; people misjudge distances in VR |
| Working prototype | the real thing, early | usability, forces, maintenance, full tasks | late and expensive to change |

Build the cheapest mock-up that can answer the question, as early as possible: a problem found in cardboard costs a few hours; the same problem found in production costs a redesign.

### The fitting trial
Pheasant's *Bodyspace* describes the classic procedure. For a dimension — a seat height, a bench height, the distance to a pedal — each participant starts well above their preferred setting and comes down until it is just acceptable, then starts well below and goes up (the **method of limits**), then settles on a preference. Each person yields an **acceptable range** and a **preferred value**. Stack the ranges and you get, for every possible setting, the share of the panel who accept it: pick the fixed value that the most people accept, or the adjustment range that covers the share you want.

The sim **A fitting trial with a small panel** runs a virtual trial of a standing work height. Each simulated participant is drawn from the population, with their own preference scatter; recruit panels of different sizes and by different rules, and compare the panel's answer with the population's true one.

### Choosing the people
The panel must span the **extremes** of the dimensions that matter — ISO 15537 sets out principles for selecting test persons for anthropometric testing. Random recruitment rarely does this: the chance that a random panel of $n$ includes at least one person from the smallest 5 % is $1 - 0.95^n$ — 23 % with 5 people, 40 % with 10, and 95 % only at 59. So recruit on purpose: the 5th-percentile woman and the 95th-percentile man (**bracketing**), or the 1st and 99th for safety-critical dimensions, plus people in the middle. Test them in the clothing and equipment of the real setting, and include the users the design must not exclude — older people, wheelchair users, people with limited grip or sight for public products.

### How many for a usability test?
Nielsen and Landauer (1993) modelled the discovery of usability problems: if each problem is seen by a share $p$ of users, a test with $n$ users finds a share $1 - (1-p)^n$ of such problems ([[?exponential|an exponential approach]] to 100 %). With their average $p$ of about 31 %, five users find about 84 %. Hence the famous advice: test with about five users, fix, and test again. The catch is in $p$: a problem that affects only 10 % of users — often the older, the smaller, the newcomers — is found by five users only 41 % of the time. Diverse user groups each need their own round.

### How many to estimate a number?
To estimate a mean dimension within $\\pm e$ at 95 % confidence you need about $n = (z\\sigma/e)^2$ people ([[?standard-deviation|σ]] the spread of the dimension): about 160 for stature to ±10 mm. Percentiles near the tails need far more — which is why trials are for *checking and fitting*, and surveys (ISO 15535) are for *data*.

### Settings
| Setting | Who to recruit | What to include |
|---|---|---|
| Civil — home and public | children, older people, wheelchair users, people with limited sight or grip | real bags, prams, walking aids; first-time use |
| Office | the range of staff, including the smallest and largest | a whole working session, not a minute |
| Workshop and industry | experienced operators of both sexes, across the size range | gloves, boots, real parts, real cycle times, maintenance tasks |
| Military | personnel spanning the size range, in full kit | armour, helmets, cold-weather and protective suits, night conditions |
| Field | the actual crews | weather, slopes, mud, harnesses, fatigue at the end of a day |

### Ethics and honesty
Participants give informed consent, may stop at any time, are kept safe (no real hazards, stable rigs) and have their data protected; many organisations require an ethics review. Participants are also polite — they blame themselves and say "it's fine": watch what they do, measure, and ask neutral questions.

### Limits
Trials are short, but discomfort and fatigue grow over hours; novelty changes behaviour; small panels miss rare problems and misestimate ranges; a mock-up can be more or less comfortable than the product. Combine trials with data, manikins and field follow-up.

> [!key] Test with real people as early and as cheaply as the question allows; recruit the extremes on purpose, in their real clothing and equipment; test small and often for problems, and use data for numbers.
`,
  ideas: [
    'Fitting trials find acceptable and preferred dimensions by letting real users adjust an adjustable mock-up.',
    'Recruit the extremes deliberately (bracketing): a random panel rarely contains the smallest or largest users.',
    'The chance of seeing something at least once in n tries is 1 − (1 − p)^n: five users find most common problems, but not rare ones.',
    'Estimating a dimension needs far more people than finding a problem: n = (zσ/e)².',
    'Use the cheapest, earliest mock-up that answers the question; test in the real setting\'s clothing and equipment.'
  ],
  pitfalls: [
    'A panel of ten colleagues is a fitting trial — Colleagues are rarely the users and rarely span the extremes; recruit to the size range, in the right clothing and equipment.',
    'Five users are always enough — Five find most problems that affect many users; problems affecting a minority, and different user groups, need more rounds.',
    'Participants liked it, so it works — People are polite and adapt; measure what they do and whether they can complete the task.'
  ],
  formulas: [
    {
      name: 'Chance of seeing something at least once in n participants',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^n',
      vars: {
        P: { name: 'chance it is seen at least once', q: 'ratio', unit: '%' },
        p: { name: 'share of people who show it (a problem, or being in an extreme group)', q: 'ratio', unit: '%', value: 31, min: 0.01, max: 99.99 },
        n: { name: 'number of participants', q: 'count', value: 5, min: 1 }
      },
      note: 'Assumes independent participants. With p = 31 % (Nielsen and Landauer\'s average) it is the share of usability problems found; with p = 5 % it is the chance a random panel includes someone from the smallest (or largest) 5 %.',
      stories: { P: 'A problem affects {p} of users. What is the chance a test with {n} users sees it?', n: 'How many randomly recruited participants give a {P} chance of including at least one person from a group that makes up {p} of the population?' }
    },
    {
      name: 'People needed to estimate a mean dimension',
      expr: 'n = (z*s/acc)^2', tex: 'n = \\left(\\dfrac{z\\,\\sigma}{e}\\right)^2',
      vars: {
        n: { name: 'number of people measured', q: 'count' },
        z: { name: 'standard normal value for the confidence (1.96 for 95 %)', q: 'none', value: 1.96 },
        s: { name: 'standard deviation of the dimension', q: 'length', unit: 'mm', value: 64, tex: '\\sigma' },
        acc: { name: 'accuracy wanted (±)', q: 'length', unit: 'mm', value: 10, tex: 'e' }
      },
      note: 'For a mean only; percentiles in the tails need several times more. Surveys follow ISO 15535.',
      stories: { n: 'A dimension varies with a standard deviation of {s}. How many people must be measured to know its mean within {acc} at z = {z}?', acc: 'With {n} people and a standard deviation of {s}, how precisely is the mean known at z = {z}?' }
    }
  ],
  examples: [
    {
      title: 'Will a random panel find the small users?',
      q: 'You recruit 12 people at random from a mixed population for a reach trial. What is the chance that at least one of them is in the smallest 5 % for reach? How many would you need for a 90 % chance?',
      steps: [
        '$P = 1 - 0.95^{12} = 1 - 0.54 = 46$ %.',
        'For 90 %: $0.95^n = 0.10$, so $n = \\ln 0.10 / \\ln 0.95 = 44.9$ — 45 people.',
        'Far cheaper: recruit two or three small users on purpose.'
      ],
      a: 'About 46 %; 45 people for 90 % — recruit the extremes deliberately instead.'
    },
    {
      title: 'Five users and a rare problem',
      q: 'A problem affects 31 % of users; another affects 10 %. What share of each is found by a test with 5 users? With 15 users in three rounds of 5?',
      steps: [
        'Common problem: $1 - 0.69^5 = 84$ %; with 15 users $1 - 0.69^{15} = 99.6$ %.',
        'Rare problem: $1 - 0.90^5 = 41$ %; with 15 users $1 - 0.90^{15} = 79$ %.',
        'Several small rounds, with different user groups, find the rare problems that a single round misses.'
      ],
      a: '84 % and 41 % with five users; 99.6 % and 79 % with fifteen.'
    }
  ],
  quiz: [
    { q: 'Why do fitting trials recruit the smallest and largest users on purpose?', choices: ['A random panel rarely includes them, yet they limit the design', 'They are easier to find', 'Standards forbid average users', 'They complain more'], a: 0, why: 'Reach is limited by the smallest and clearance by the largest; random panels of ten include one of the smallest 5 % only about 40 % of the time.' },
    { q: 'In the method of limits, a participant…', choices: ['approaches a setting from above and from below to find the acceptable range', 'is measured with a tape', 'chooses from three fixed options', 'rates the colour'], a: 0, why: 'Coming down from too high and up from too low brackets the acceptable range.' },
    { q: 'With p = 31 %, five users find about what share of usability problems?', choices: ['84 %', '31 %', '100 %', '50 %'], a: 0, why: '$1 - 0.69^5 = 0.84$.' },
    { q: 'True or false: a fitting trial of 12 people gives reliable 5th and 95th percentiles for a new population.', a: false, why: 'Percentiles need large surveys; trials check and fit designs, they do not replace anthropometric data.' },
    { q: 'For a military crew station, the trial should be run…', choices: ['with personnel across the size range in full protective equipment', 'with engineers in office clothes', 'with the average soldier only', 'only in virtual reality'], a: 0, why: 'Equipment changes size, reach and posture; the extremes in full kit limit the design.' }
  ],
  problems: [
    { q: 'How many randomly recruited people give a 95 % chance that the panel includes at least one person from the largest 5 % of a population?', answer: 58.4, tol: 0.02, steps: ['$0.95^n = 0.05$.', '$n = \\ln 0.05/\\ln 0.95 = 58.4$ — 59 people.'] },
    { q: 'Sitting height varies with a standard deviation of 36 mm. How many people must be measured to know its mean within ±5 mm at 95 % confidence?', answer: 199, tol: 0.02, steps: ['$n = (1.96 \\times 36/5)^2 = 14.1^2 = 199$.'] }
  ],
  ranges: [
    { dim: 'Participants per round of formative usability testing', range: '≈ 5 per distinct user group, repeated over several rounds', who: 'Each distinct group of users (novices, experts, older users, users with disabilities)', why: 'Finds most problems that affect many users, cheaply, in time to fix them.', limits: 'Problems affecting a minority need more users; summative measurements need larger samples.', setting: 'all', src: 'Nielsen and Landauer (1993)' },
    { dim: 'Random panel size for a 95 % chance of including one of the smallest (or largest) 5 %', range: [59, null], unit: 'people', who: 'Randomly recruited participants', why: 'Shows why extremes must be recruited on purpose rather than hoped for.', limits: 'Purposive recruitment (bracketing) reaches the extremes with a handful of people.', setting: 'all', src: 'Probability: 1 − 0.95ⁿ' },
    { dim: 'Fitting-trial panel', range: 'at least the 5th-percentile woman to the 95th-percentile man (1st to 99th for safety), plus the middle', who: 'Chosen by the body dimensions that limit the design, in the real clothing and equipment', why: 'The extremes decide clearances and reaches; the middle shows preferences.', limits: 'Several dimensions at once need people chosen on combinations (boundary cases), not on stature alone.', setting: 'all', src: 'ISO 15537; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'People measured to estimate a mean dimension within ±10 mm (95 %)', range: [140, 190], unit: 'people', who: 'Dimensions with standard deviations of about 60–70 mm, such as stature', why: 'Enough to trust a mean; far more are needed for tail percentiles.', limits: 'Use a proper survey (ISO 15535) for design data.', setting: 'all', src: 'Sampling theory: n = (zσ/e)²' }
  ],
  applications: [
    'Seating bucks and cab rigs for vehicles, cranes and agricultural machines.',
    'Cardboard mock-ups of kitchens, bathrooms, counters and control desks.',
    'Iterative usability tests of machine HMIs, apps and public equipment.',
    'Military crew-station trials in full protective equipment.'
  ],
  history: 'Fitting trials with adjustable rigs grew out of seat and cockpit design in the mid-20th century and were set out for designers in Stephen Pheasant\'s *Bodyspace* (first edition 1986). Jakob Nielsen and Thomas Landauer published their model of how many users find how many usability problems in 1993.',
  sources: [
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on fitting trials and the method of limits.',
    'ISO 15537, *Principles for selecting and using test persons for testing anthropometric aspects of industrial products and designs*.',
    'ISO 9241-11, *Usability: Definitions and concepts*; ISO 9241-210, *Human-centred design for interactive systems*.',
    'J. Nielsen and T. K. Landauer (1993), "A mathematical model of the finding of usability problems", Proceedings of INTERCHI \'93.',
    'ISO 15535, *General requirements for establishing anthropometric databases*.'
  ],
  sim: 'fd-fitting-trial'
},

{
  id: 'digital-human-models', parent: 'ergo-methods', title: 'Digital human models', level: 3,
  short: 'A digital human model is a manikin in the CAD model: a jointed figure scaled to chosen body sizes, posed at the design to check reach, clearance, vision, posture and strength long before a prototype exists. Its power lies in families of manikins that span the population\'s real combinations of dimensions; its limits are those of its data and its posture rules.',
  keywords: ['digital human model', 'DHM', 'manikin', 'CAD manikin', 'boundary manikins', 'boundary cases', 'multivariate accommodation', 'principal components', 'accommodation ellipse', 'percentile stacking', 'regression', 'reach envelope', 'vision cone', 'eyellipse', 'posture prediction', 'virtual ergonomics', '3DSSPP', 'SAMMIE', 'Jack', 'RAMSIS'],
  prereq: ['design-for-range', 'combining-percentiles', 'functional-reach'],
  related: ['user-trials-mockups', 'posture-assessment', 'percentiles', 'anthropometry-basics', 'crew-stations', 'vehicle-seating', 'driver-workspace', 'cockpit-ergonomics', 'maintenance-ergonomics', 'math:normal-distribution', 'math:linear-regression'],
  body: `
Long before there is a prototype there is a CAD model, and into it the designer can drop a **digital human model** (DHM): a skeleton of links and joints, each joint with its limits, covered by a surface, and scaled to the body sizes chosen. Pose it at the controls and ask: can it reach them, does its head clear the roof, can it see the display and the ground ahead, is its posture acceptable, can it exert the force? Computer manikins have been used in aircraft and vehicle design since the 1960s and 1970s; systems such as SAMMIE, Jack and RAMSIS, and manikins built into today's CAD and simulation packages, are standard tools of vehicle, aircraft, military and factory design.

### What a manikin can check
| Check | How | Typical criterion |
|---|---|---|
| **Reach** | reach envelopes swept by the arm from the shoulder; the hand placed on each control | frequent controls within comfortable reach of the smallest user; all within maximum reach |
| **Clearance** | the manikin's surface against the structure, with clothing and equipment | head, knees, feet and shoulders clear for the largest user in full kit |
| **Vision** | eye points, sight lines, view cones, mirror views, obstructions | displays near the normal line of sight, about 10–15° below horizontal; the world outside visible |
| **Posture** | joint angles compared with comfort ranges; built-in RULA, REBA or OWAS | the posture assessment methods of [[posture-assessment]] |
| **Strength and loads** | static biomechanical models, e.g. the University of Michigan's 3DSSPP | share of the population able to exert the force; spinal compression |
| **Tasks over time** | animation of assembly or maintenance sequences | reach and posture at every step; collisions |

The sim **Check a design with a family of manikins** does the core checks in 2-D: a small woman, a middle-sized person and a large man stand or sit at the same station; drag the control, the display and the overhead obstruction and read, for each, whether they reach, see and clear.

### Which manikins? The multivariate problem
The tempting answer — a "5th-percentile" and a "95th-percentile" manikin — is wrong in an important way. A manikin built from the 95th percentile of every dimension is nobody: body dimensions are correlated but far from perfectly ([[combining-percentiles]]). Within one sex, stature correlates strongly with most body lengths, but not perfectly, and only moderately with body mass. A man of 95th-percentile stature (1870 mm) has, on average, a sitting height of
$$\\hat y = \\mu_y + \\rho\\,\\frac{\\sigma_y}{\\sigma_x}(x - \\mu_x) = 915 + 0.75 \\times \\frac{36}{70} \\times 115 \\approx 959\\ \\text{mm},$$
the 89th percentile of sitting height, not the 95th — this is [[math:linear-regression|regression]] toward the mean, with an illustrative correlation of 0.75. Some tall men have short trunks and long legs; a cab designed with a single tall manikin misses them.

The remedy is a **family of boundary manikins** (boundary cases). Plot two correlated dimensions for a population and the people form an elliptical cloud; for a [[?gaussian]] population the share inside an [[?ellipse]] of "radius" $r$ standard deviations is
$$P = 1 - e^{-r^2/2}.$$
An ellipse holding 90 % of people has $r$ = 2.15; for 95 %, 2.45. Manikins placed around its boundary represent the extreme *combinations* that real people have — tall with a short trunk, short with long arms — and a design that fits all of them fits everyone inside. With more than two dimensions the ellipse becomes a hyper-ellipsoid, usually found with principal component analysis. The corners of a percentile box, by contrast, may be combinations almost no one has: with a correlation of 0.75, "5th-percentile stature with 95th-percentile sitting height" lies so far outside the cloud that only about 1 person in 50,000 is beyond it. The sim **Boundary manikins** shows the cloud, the box and the ellipse, and lets you change the correlation and the coverage.

### Settings
| Setting | What manikins are used for |
|---|---|
| Vehicles | seat and pedal positions, the seating reference point, the eye ellipse (SAE J941) for mirrors and pillars, head clearance |
| Military | crew stations for the size range *in body armour and helmets*, hatches, escape, weapons and equipment stowage; families built from surveys such as ANSUR II |
| Workshop and industry | assembly lines and maintenance: reach, posture, sight of the work, tool access |
| Civil — home and public | kitchens, bathrooms, counters, transport: manikins of wheelchair users, older and smaller people |
| Health care | beds, patient-handling equipment and the space around them |

### Limits
- **Posture prediction** tells you where the manikin *can* be; real people slump, lean, cross their legs and take postures no rule predicts.
- **Data**: a manikin is only as good as the survey behind it, and the survey's population may not be your users (see [[population-differences]]).
- **Soft tissue and clothing**: bodies compress and bulge; clothing and equipment must be added realistically.
- **Dynamics and time**: most checks are static; fatigue, discomfort over hours and dynamic forces are largely missing.
- **Validation**: confirm critical results with real people in a mock-up ([[user-trials-mockups]]). DHMs make trials fewer and better aimed; they do not replace them.

> [!key] Use a family of manikins that spans the real combinations of body dimensions — boundary cases, not percentile stacks — check reach for the small, clearance for the large and vision for all, and confirm with real people.
`,
  ideas: [
    'A digital human model is a jointed, scaled manikin posed in the CAD model to check reach, clearance, vision, posture and strength.',
    'Percentile-stacked manikins represent almost nobody: body dimensions are correlated but not perfectly.',
    'Regression gives the expected value of one dimension given another: a 95th-percentile-stature man has about an 89th-percentile sitting height.',
    'Boundary manikins placed around a population ellipse (P = 1 − e^(−r²/2)) cover the real extreme combinations.',
    'Posture prediction, data, clothing and dynamics limit DHMs; confirm with real users.'
  ],
  pitfalls: [
    'A 95th-percentile manikin has 95th-percentile everything — Real people are not uniformly large; stacked percentiles describe almost nobody and oversize the design.',
    'If the manikin fits, people will fit — Manikins take the posture you give them; people take their own. Confirm critical dimensions in a trial.',
    'Two manikins, a small woman and a large man, cover everyone — Two cases span one dimension; several correlated dimensions need a family of boundary cases.'
  ],
  formulas: [
    {
      name: 'Share of a population inside an accommodation ellipse',
      expr: 'P = 1 - exp(-r^2/2)', tex: 'P = 1 - e^{-r^2/2}',
      vars: {
        P: { name: 'share of people inside', q: 'ratio', unit: '%' },
        r: { name: 'ellipse "radius" in standard deviations (Mahalanobis distance)', q: 'none', value: 2.146, min: 0 }
      },
      note: 'For two jointly normal dimensions. With more dimensions the share inside a hyper-ellipsoid of the same r is smaller, so r must grow.',
      stories: { P: 'Boundary manikins are placed on an ellipse {r} standard deviations out. What share of people lies inside?', r: 'How many standard deviations out must the ellipse be to hold {P} of the population?' }
    },
    {
      name: 'Expected value of one dimension given another (regression)',
      expr: 'y = muy + rho*(sy/sx)*(x - mux)', tex: '\\hat y = \\mu_y + \\rho\\,\\dfrac{\\sigma_y}{\\sigma_x}\\,(x - \\mu_x)',
      vars: {
        y: { name: 'expected value of the second dimension', q: 'length', unit: 'mm', tex: '\\hat y' },
        muy: { name: 'mean of the second dimension (sitting height)', q: 'length', unit: 'mm', value: 915, tex: '\\mu_y' },
        rho: { name: 'correlation between the dimensions', q: 'none', value: 0.75, min: -1, max: 1, signed: true, tex: '\\rho' },
        sy: { name: 'standard deviation of the second dimension', q: 'length', unit: 'mm', value: 36, tex: '\\sigma_y' },
        sx: { name: 'standard deviation of the first dimension (stature)', q: 'length', unit: 'mm', value: 70, tex: '\\sigma_x' },
        x: { name: 'the person\'s first dimension', q: 'length', unit: 'mm', value: 1870 },
        mux: { name: 'mean of the first dimension', q: 'length', unit: 'mm', value: 1755, tex: '\\mu_x' }
      },
      note: 'Linear regression for jointly normal dimensions. Individuals scatter around ŷ with a standard deviation of σ_y√(1 − ρ²). The correlation 0.75 is illustrative; take it from the survey you use.',
      stories: { y: 'A man is {x} tall (mean {mux}, SD {sx}). Sitting height has a mean of {muy} and SD {sy}, correlation {rho}. What sitting height is expected?', rho: 'Men of stature {x} have an average sitting height of {y}. With the means and SDs given, what is the correlation?' }
    }
  ],
  examples: [
    {
      title: 'The tall man\'s trunk',
      q: 'Men\'s stature is 1755 ± 70 mm and sitting height 915 ± 36 mm, with a correlation of 0.75 (illustrative). What sitting height do men of 95th-percentile stature (1870 mm) have on average, and what percentile is it? How much do they scatter?',
      steps: [
        '$\\hat y = 915 + 0.75 \\times (36/70) \\times (1870 - 1755) = 915 + 44 = 959$ mm.',
        'Percentile: $z = (959 - 915)/36 = 1.23$, the 89th percentile — not the 95th.',
        'Scatter about that mean: $36\\sqrt{1 - 0.75^2} = 24$ mm, so about one in six of these tall men has a sitting height over 983 mm, above the population\'s 97th percentile.'
      ],
      a: 'About 959 mm, the 89th percentile, with a spread of ±24 mm: some tall men have very long trunks, some short.'
    },
    {
      title: 'The corner of the percentile box',
      q: 'For two dimensions with correlation 0.75, how unusual is the combination "5th percentile of one, 95th of the other" (z = −1.645 and +1.645)?',
      steps: [
        { text: 'The squared Mahalanobis distance:', tex: 'd^2 = \\frac{z_1^2 - 2\\rho z_1 z_2 + z_2^2}{1 - \\rho^2} = \\frac{2.706 + 4.059 + 2.706}{0.4375} = 21.6' },
        '$d = 4.65$; the share of people farther out is $e^{-d^2/2} = e^{-10.8} \\approx 2 \\times 10^{-5}$.',
        'About one person in 50,000: designing a seat for that manikin wastes effort on nobody, while real extreme combinations lie elsewhere on the ellipse.'
      ],
      a: 'About 1 in 50,000 people — the box corner is almost empty.'
    }
  ],
  quiz: [
    { q: 'Why is a manikin built from the 95th percentile of every dimension a poor design case?', choices: ['Dimensions are not perfectly correlated, so almost nobody is 95th on all of them', 'Such people are too heavy for CAD', 'Percentiles only apply to stature', 'It is too small'], a: 0, why: 'Imperfect correlation means extremes rarely coincide; the stacked manikin represents almost no one.' },
    { q: 'For a bivariate normal population, what share lies inside an ellipse 2.45 standard deviations out?', choices: ['About 95 %', 'About 99 %', 'About 90 %', 'About 68 %'], a: 0, why: '$1 - e^{-2.45^2/2} = 1 - e^{-3.0} = 0.95$.' },
    { q: 'Which check is limited by the largest user?', choices: ['Head clearance under a cab roof', 'Reach to an emergency stop', 'Seeing over a dashboard (for a short driver)', 'Reaching a pedal'], a: 0, why: 'Clearance is set by the largest user with clothing and equipment; the others are limited by the smallest.' },
    { q: 'True or false: once a design fits a family of digital manikins, a trial with real people is unnecessary.', a: false, why: 'Manikins take the postures they are given; real people slump, lean and wear real equipment. Confirm critical results with people.' },
    { q: 'Men of 95th-percentile stature have, on average, a sitting height at about which percentile (correlation 0.75)?', choices: ['The 89th', 'The 95th', 'The 50th', 'The 99th'], a: 0, why: 'Regression toward the mean: $z = 0.75 \\times 1.645 = 1.23$, the 89th percentile.' }
  ],
  problems: [
    { q: 'Boundary manikins are placed on an ellipse holding 99 % of a bivariate normal population. How many standard deviations out is it?', answer: 3.035, tol: 0.01, steps: ['$0.99 = 1 - e^{-r^2/2}$, so $r^2 = -2\\ln 0.01 = 9.21$.', '$r = 3.03$.'] },
    { q: 'Women\'s stature is 1625 ± 64 mm and their eye height sitting 740 ± 33 mm, with a correlation of 0.7 (illustrative). What eye height sitting is expected for a woman 1520 mm tall?', answer: 702, unit: 'mm', tol: 0.005, steps: ['$\\hat y = 740 + 0.7 \\times (33/64) \\times (1520 - 1625)$.', '$= 740 - 37.9 = 702$ mm.'] }
  ],
  ranges: [
    { dim: 'Share of the population inside a boundary-manikin family', range: [90, 95], unit: '%', who: 'Boundary cases on a 90–95 % ellipse (or hyper-ellipsoid) of the dimensions that matter', why: 'A design that fits the boundary fits everyone inside it.', limits: 'Safety-critical dimensions (escape, guards) need more; the share falls as dimensions are added unless the boundary grows.', setting: ['vehicle', 'military', 'workshop'], src: 'Multivariate accommodation methods; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Normal line of sight', range: '10–15° below horizontal', unit: '°', who: 'Seated and standing users looking ahead, relaxed', why: 'Place primary displays and frequently watched work near it for a relaxed neck and eyes.', limits: 'Individuals and tasks differ; bifocal wearers look through the lower lens and need lower displays.', setting: ['office', 'vehicle', 'workshop', 'military'], src: 'MIL-STD-1472; Pheasant and Haslegrave, *Bodyspace*' },
    { dim: 'Primary displays', range: '0–30° below the horizontal eye line', unit: '°', who: 'Every manikin of the family, from its own eye point', why: 'Displays read with little head movement.', limits: 'Head-up and overhead displays follow other rules; glare and reflections still need checking.', setting: ['office', 'vehicle', 'military'], src: 'MIL-STD-1472; Sanders and McCormick, *Human Factors in Engineering and Design*' }
  ],
  applications: [
    'Vehicle packaging: seat travel, pedals, steering wheel, mirrors and pillars checked with manikin families.',
    'Military crew stations and hatches checked for the size range in body armour and helmets.',
    'Assembly-line and maintenance planning: reach, posture and tool access at every step.',
    'Accessible kitchens, bathrooms and counters checked with manikins of wheelchair users.'
  ],
  history: 'Computer manikins appeared in aircraft and vehicle design in the 1960s and 1970s; SAMMIE in Britain, Jack at the University of Pennsylvania and RAMSIS for the German car industry became widely used. Multivariate methods of choosing boundary cases, using principal component analysis, grew up in cockpit and crew-station design, where the flaws of percentile manikins were most costly.',
  sources: [
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on combining percentiles and multivariate accommodation.',
    'G. Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, the chapter on digital human modelling.',
    'ISO 7250-1 and ISO 15535 (the measurements and databases behind the manikins).',
    'SAE J941, *Motor Vehicle Drivers\' Eye Locations* (the eyellipse).',
    'C. C. Gordon et al. (2014), *2012 Anthropometric Survey of U.S. Army Personnel* (ANSUR II).',
    'MIL-STD-1472, *Human Engineering* (US Department of Defense), on lines of sight and accommodation.'
  ],
  sim: ['fd-manikin-check', 'fd-boundary-cases']
}

);
