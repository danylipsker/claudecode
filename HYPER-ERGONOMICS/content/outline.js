/* HYPER-ERGONOMICS · content/outline.js
 *
 * The shape of the app: the root, its branches and their topics. Concepts live in the topic files and hang
 * under these topics with `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 *
 * Hyper Ergonomics is the science of fitting tasks, products, spaces and machines to people: the body's
 * dimensions (always as ranges — percentiles for men, women and mixed populations), biomechanics, manual
 * handling, workstations, furniture and buildings, workshops and industry, machinery and its controls, the
 * physical environment (noise, vibration, climate, light), the mind at work, work organization, vehicles, the
 * military, field work and special settings. Medicine is linked as medicine:<id>, physics as physics:<id>,
 * mathematics as math:<id>, motors and machines as motors:<id>.
 */
Hyper.add(
  {
    id: 'ergonomics', kind: 'root', title: 'Hyper Ergonomics',
    short: 'Designing for people as they really are: body sizes as ranges, postures and forces, workstations, furniture, buildings, machinery and controls, noise, vibration, climate and light — at home, in offices, workshops, the field and the military.',
    links: [['Body sizes', '#/tools/bodysize', 'person'], ['Workstation fitter', '#/tools/workstation', 'chair'], ['Lifting (NIOSH)', '#/tools/lifting', 'lift'], ['Noise, vibration & climate', '#/tools/environment', 'ear']],
    body: `People come in a wide range of sizes, strengths and abilities, and they change with age, clothing, fatigue and the task in hand. Ergonomics — also called human factors — is the discipline of designing tasks, products, workplaces and machines to fit that range, so that they are safe, comfortable, efficient and easy to use. It is why a good office chair adjusts from about 400 to 510 mm (the range of EN 1335-1), why a door handle sits near 1 m, why a control that turns clockwise should make things go up, and why a lift of a 15 kg box far from the body can be riskier than a 25 kg box held close.

Ergonomics rarely gives a single "right" number. It gives **ranges**, with the reasons behind their limits: a seat higher than the shortest users' lower legs cuts off their circulation; a shelf higher than the reach of the smallest users is out of reach; a doorway lower than the tallest users hits their heads. Hyper Ergonomics shows those ranges, where they come from, what each limit protects, and how they change between the office, the workshop, the vehicle, the battlefield and the field.

> [!note] The body dimensions used here are representative, rounded values for adults, consistent with large surveys of North American and European populations (such as ANSUR II, 2012) and measured as defined in ISO 7250-1. Populations differ by several centimetres: for a real design, use data for your actual users, add allowances for clothing, shoes and posture, and test with people. Pages about pain and injury explain risks; they are not medical advice.`
  },

  /* ================================================================ FOUNDATIONS */
  {
    id: 'ergo-foundations', kind: 'branch', parent: 'ergonomics', title: 'What Ergonomics Is', icon: 'person', hue: 62,
    short: 'The discipline and its principles — fit the task to the person, design for a range, prefer adjustability, reduce force, repetition and awkward posture — its standards, and the methods ergonomists use: task analysis, posture assessment, risk assessment, fitting trials and digital manikins.',
    body: `The International Ergonomics Association describes ergonomics as both a science — understanding how people interact with the other parts of a system — and a profession that applies that understanding to design, for the sake of people's well-being and of the performance of the whole system. In practice it has three domains: physical (bodies, postures, forces), cognitive (perception, attention, decisions, errors) and organizational (shifts, teams, how work is arranged). This branch sets out the principles and the tools of the trade.`
  },
  { id: 'ergo-basics', kind: 'topic', parent: 'ergo-foundations', title: 'Principles', short: 'Ergonomics defined, human-centred design, designing for a range, the core principles, productivity and cost, standards.',
    plan: [['ergonomics-defined', 'What ergonomics is'], ['human-centred-design', 'Fitting the task to the person'], ['design-for-range', 'Designing for a range of people'], ['ergonomic-principles', 'The core principles'], ['ergonomics-productivity', 'Ergonomics, productivity and cost'], ['ergo-standards', 'Ergonomics standards']] },
  { id: 'ergo-methods', kind: 'topic', parent: 'ergo-foundations', title: 'Methods', short: 'Task analysis, posture assessment, ergonomic risk assessment, user trials and mock-ups, digital human models.',
    plan: [['task-analysis', 'Task analysis'], ['posture-assessment', 'Assessing postures'], ['ergonomic-risk-assessment', 'Ergonomic risk assessment'], ['user-trials-mockups', 'Fitting trials and mock-ups'], ['digital-human-models', 'Digital human models']] },

  /* ================================================================ ANTHROPOMETRY */
  {
    id: 'anthropometry', kind: 'branch', parent: 'ergonomics', title: 'Anthropometry: Measuring People', icon: 'person', hue: 20,
    short: 'The measurement of human bodies: standard dimensions standing and sitting, hands, feet and heads, reach, mass and strength; percentiles; and how people differ by sex, population, age, disability and clothing.',
    body: `Anthropometry is the measurement of the human body. Surveys of thousands of people, measured the same way (ISO 7250-1), give the average and the spread of each dimension for a population. Because most dimensions are close to normally distributed, the spread can be described by percentiles: the 5th percentile woman's stature is exceeded by 95 % of women. Designers use the ends of the range — a clearance must fit the large, a reach must suit the small — and adjustability to cover the middle. This branch explains the measurements, the statistics and the ways real populations differ.`
  },
  { id: 'body-dimensions', kind: 'topic', parent: 'anthropometry', title: 'Body dimensions', short: 'Anthropometry and ISO 7250, percentiles, standing and sitting dimensions, hands, feet and heads, reach envelopes, mass and strength data.',
    plan: [['anthropometry-basics', 'Measuring the body'], ['percentiles', 'Percentiles'], ['standing-dimensions', 'Dimensions standing'], ['sitting-dimensions', 'Dimensions sitting'], ['hand-foot-head', 'Hands, feet and heads'], ['functional-reach', 'Reach and reach envelopes'], ['mass-strength-data', 'Body mass and strength']] },
  { id: 'human-variation', kind: 'topic', parent: 'anthropometry', title: 'Human variation', short: 'Men and women, populations and secular trends, children and older people, disability and inclusive design, clothing and PPE, why there is no "95th percentile person".',
    plan: [['sex-differences', 'Men and women'], ['population-differences', 'Populations and the secular trend'], ['age-children-elderly', 'Children and older people'], ['disability-inclusive', 'Disability and inclusive design'], ['clothing-ppe-allowances', 'Clothing, shoes and PPE allowances'], ['combining-percentiles', 'Why there is no "95th percentile person"']] },

  /* ================================================================ BIOMECHANICS AND HANDLING */
  {
    id: 'biomechanics', kind: 'branch', parent: 'ergonomics', title: 'Biomechanics and Posture', icon: 'person', hue: 0,
    short: 'The body as a machine: joints, muscles and discs, loads on the spine, neutral postures, static muscle work, repetitive strain, strength and ranges of motion.',
    body: `The body is a set of levers — bones — moved by motors — muscles — across joints, with the spine as a flexible column of vertebrae and discs. Because muscles attach close to the joints, they must pull with forces many times the load in the hands: holding 10 kg at arm's length can load the lower back with several thousand newtons. Biomechanics explains why posture, distance and repetition matter so much, why holding still is tiring, and why small repeated strains add up to disorders of the tendons, nerves and joints.`
  },
  { id: 'body-mechanics', kind: 'topic', parent: 'biomechanics', title: 'The body as a machine', short: 'The musculoskeletal system, spinal loading, neutral postures, static muscle work, repetitive strain, strength, ranges of motion.',
    plan: [['musculoskeletal-system', 'Bones, joints, muscles and discs'], ['spinal-loading', 'Loads on the spine'], ['neutral-postures', 'Neutral postures'], ['static-muscle-work', 'Static muscle work and fatigue'], ['repetitive-strain', 'Repetitive strain and MSDs'], ['strength-and-force', 'Strength: grip, push and pull'], ['joint-ranges', 'Ranges of joint motion']] },
  {
    id: 'manual-handling', kind: 'branch', parent: 'ergonomics', title: 'Manual Handling', icon: 'lift', hue: 36,
    short: 'Lifting, carrying, pushing and pulling: the principles, the revised NIOSH lifting equation and lifting index, team lifting, and handling aids from trolleys to exoskeletons.',
    body: `Handling loads by hand is one of the commonest causes of injury at work. Risk depends not only on the weight but on where it is held (distance from the body), how high it starts and ends, twisting, how often it is lifted, for how long, and how good the grip is. The revised NIOSH lifting equation (1991) turns these into a recommended weight limit — 23 kg under ideal conditions, and much less in most real ones — and a lifting index that ranks the risk. Carrying, pushing and pulling have their own limits, and handling aids remove the risk at the source.`
  },
  { id: 'lifting-topic', kind: 'topic', parent: 'manual-handling', title: 'Lifting, carrying, pushing', short: 'Lifting principles, the NIOSH equation, the lifting index, carrying, pushing and pulling, team lifts, handling aids.',
    plan: [['lifting-principles', 'Principles of safe lifting'], ['niosh-lifting-equation', 'The revised NIOSH lifting equation'], ['lifting-index-risk', 'The lifting index and risk'], ['carrying-loads', 'Carrying loads'], ['pushing-pulling', 'Pushing and pulling'], ['team-lifting', 'Team lifting'], ['handling-aids', 'Handling aids and exoskeletons']] },

  /* ================================================================ WORKSTATIONS */
  {
    id: 'workstations', kind: 'branch', parent: 'ergonomics', title: 'Office and Computer Workstations', icon: 'chair', hue: 200,
    short: 'The seated workplace: chairs, desk heights, sit-stand work, screens, keyboards and mice, laptops, visual ergonomics — and the layout of offices, meeting rooms and control rooms.',
    body: `Office work looks harmless, yet hours in a fixed posture in front of a screen bring neck, shoulder, back and wrist complaints and tired eyes. A good workstation starts from the body: a seat at about the height of the back of the knee, a work surface near elbow height, a screen at arm's length with its top at or below eye level, input devices close to the body — all adjustable, because users differ by 20 cm and more. The branch also covers the rooms around the desk: space per person, sightlines in meeting rooms and classrooms, and the special case of control rooms.`
  },
  { id: 'seated-work', kind: 'topic', parent: 'workstations', title: 'The seated workstation', short: 'Office chairs, desk heights, sit-stand work, screen placement, keyboards and mice, laptops and tablets, visual ergonomics.',
    plan: [['office-chair', 'The office chair'], ['desk-height', 'Desk and work-surface height'], ['sit-stand-work', 'Sitting and standing'], ['monitor-placement', 'Placing the screen'], ['keyboard-mouse', 'Keyboards, mice and input devices'], ['laptops-tablets', 'Laptops, tablets and phones'], ['visual-ergonomics', 'Visual ergonomics at the screen']] },
  { id: 'workspace-layout', kind: 'topic', parent: 'workstations', title: 'Layout', short: 'Reach zones on the desk, office layout and space, meeting rooms and classrooms, control rooms.',
    plan: [['reach-zones', 'Reach zones on the work surface'], ['office-layout', 'Office layout and space'], ['meeting-classroom', 'Meeting rooms and classrooms'], ['control-rooms', 'Control rooms']] },

  /* ================================================================ FURNITURE AND BUILDINGS */
  {
    id: 'furniture-spaces', kind: 'branch', parent: 'ergonomics', title: 'Furniture and Living Spaces', icon: 'house', hue: 100,
    short: 'Tables, chairs, sofas, beds, kitchens, bathrooms and children\'s furniture; stairs, ramps, doors and corridors, counters and shelving, and accessible design.',
    body: `The dimensions of everyday furniture and buildings encode ergonomics: a dining table near 730–760 mm, a chair seat near 430–460 mm, a kitchen worktop near 900 mm, a stair riser under about 180 mm. Each is a compromise across a population, and each has a reason — the height of the back of the knee, the height of the elbow, the length of a stride. Accessible design extends the range to wheelchair users and people with limited reach, strength or sight, and usually makes spaces better for everyone.`
  },
  { id: 'home-furniture', kind: 'topic', parent: 'furniture-spaces', title: 'Furniture', short: 'Dining tables and chairs, sofas and lounge seating, beds, kitchens, bathrooms, children\'s furniture.',
    plan: [['dining-tables-chairs', 'Dining tables and chairs'], ['sofas-lounge', 'Sofas and lounge seating'], ['beds-bedrooms', 'Beds and bedrooms'], ['kitchen-ergonomics', 'Kitchens'], ['bathroom-ergonomics', 'Bathrooms'], ['children-furniture', 'Furniture for children']] },
  { id: 'building-spaces', kind: 'topic', parent: 'furniture-spaces', title: 'Buildings', short: 'Stairs and handrails, ramps, doors and corridors, counters, storage heights, accessible design.',
    plan: [['stairs-ergonomics', 'Stairs and handrails'], ['ramps-accessibility', 'Ramps'], ['doors-corridors', 'Doors, corridors and clearances'], ['counters-reception', 'Counters and service desks'], ['storage-heights', 'Shelves, cupboards and storage heights'], ['accessible-design', 'Accessible design']] },

  /* ================================================================ INDUSTRY */
  {
    id: 'industrial', kind: 'branch', parent: 'ergonomics', title: 'Workshops and Industrial Work', icon: 'hand', hue: 40,
    short: 'Standing work heights for precision, light and heavy work; workbenches; assembly lines; hand tools and power tools; material flow; standing all day — and the organization of work: shifts, fatigue, breaks, rotation, psychosocial factors and an ageing workforce.',
    body: `In a workshop the body is the tool-holder. The right bench height depends on the work: above the elbow for fine, visually demanding tasks, just below it for light assembly, well below it for heavy work that needs body weight. Hand tools should fit the hand and keep the wrist straight; power tools add vibration and reaction torque; assembly lines add repetition and pace. How work is organized — shifts, breaks, rotation, control over one's own pace — matters as much as the hardware.`
  },
  { id: 'workshop-topic', kind: 'topic', parent: 'industrial', title: 'The workshop', short: 'Standing work heights, workbenches, assembly lines, hand tools, power tools, material flow, standing all day.',
    plan: [['standing-work-heights', 'Working heights standing'], ['workbench-design', 'Workbenches'], ['assembly-lines', 'Assembly lines'], ['hand-tools', 'Hand tools'], ['power-tools-ergonomics', 'Power tools'], ['material-flow-layout', 'Material flow and layout'], ['standing-all-day', 'Standing all day']] },
  { id: 'org-topic', kind: 'topic', parent: 'industrial', title: 'Organizing work', short: 'Shift work, fatigue and breaks, work–rest scheduling, job rotation, psychosocial factors, participatory ergonomics, the ageing workforce.',
    plan: [['shift-work', 'Shift work'], ['fatigue-rest-breaks', 'Fatigue and rest breaks'], ['work-rest-scheduling', 'Energy expenditure and work–rest cycles'], ['job-rotation', 'Job rotation and job design'], ['psychosocial-factors', 'Psychosocial factors'], ['participatory-ergonomics', 'Participatory ergonomics'], ['ageing-workforce', 'The ageing workforce']] },

  /* ================================================================ MACHINERY */
  {
    id: 'machinery', kind: 'branch', parent: 'ergonomics', title: 'Machinery Design', icon: 'gear', hue: 250,
    short: 'Designing machines around their operators: ergonomic principles for machinery, access openings and safety distances, operator positions, maintenance access, guards — and controls and displays: sizes, forces, stereotypes, Fitts\'s and Hick\'s laws, alarms and touchscreens.',
    body: `A machine that ignores its operator gets misused, bypassed or broken — and hurts people. Machinery standards (EN 614, ISO 12100) require designers to consider the operator's body, reach and strength from the start: where they stand, what they must see, how far they must reach, how they will clean and maintain it, how guards keep hands away without making the job impossible. Controls and displays are the machine's language: they should be where hands expect them, move the way people expect (up for more, clockwise to increase), be large enough to hit quickly (Fitts's law) and few enough to choose quickly (Hick's law), and warn clearly when something is wrong.`
  },
  { id: 'machine-design', kind: 'topic', parent: 'machinery', title: 'Machines and operators', short: 'Ergonomic principles for machinery, access openings, safety distances at guards, operator positions, maintenance, guards and people.',
    plan: [['machine-ergonomics-principles', 'Ergonomic principles for machinery'], ['access-openings', 'Access openings for the body'], ['safety-distances', 'Safety distances at guards'], ['operator-positions', 'Operator positions'], ['maintenance-ergonomics', 'Designing for maintenance'], ['guards-and-people', 'Guards that people do not defeat']] },
  { id: 'controls-displays', kind: 'topic', parent: 'machinery', title: 'Controls and displays', short: 'Designing controls, displays, stereotypes and compatibility, Fitts\'s law, Hick\'s law, alarms and warnings, HMI screens.',
    plan: [['controls-design', 'Designing controls'], ['displays-design', 'Designing displays'], ['stereotypes-compatibility', 'Population stereotypes and compatibility'], ['fitts-law', 'Fitts\'s law'], ['hick-law', 'Hick\'s law'], ['alarms-warnings', 'Alarms and warnings'], ['hmi-screens', 'Touchscreens and HMI panels']] },

  /* ================================================================ ENVIRONMENT */
  {
    id: 'environment', kind: 'branch', parent: 'ergonomics', title: 'The Physical Environment', icon: 'ear', hue: 175,
    short: 'Noise and hearing, vibration of the hands and the whole body, thermal comfort, heat and cold stress, lighting, glare and colour, and indoor air.',
    body: `People work within an environment that can help or harm them. Noise above about 80 dB(A) damages hearing over years and disturbs concentration long before that; vibration from tools and vehicles damages nerves, blood vessels and spines; heat and cold strain the body and cloud judgement; poor light causes eyestrain and errors; stale air brings headaches and drowsiness. Each has its measures — decibels and dose, A(8), PMV and WBGT, lux, parts per million of CO₂ — and its limits, set by law and by comfort.`
  },
  { id: 'noise-vibration', kind: 'topic', parent: 'environment', title: 'Noise and vibration', short: 'Decibels and A-weighting, noise exposure and limits, hearing protection, noise control, hand-arm vibration, whole-body vibration.',
    plan: [['noise-basics', 'Sound, decibels and A-weighting'], ['noise-exposure', 'Noise exposure and its limits'], ['hearing-protection', 'Hearing protection'], ['noise-control', 'Controlling noise'], ['hand-arm-vibration', 'Hand-arm vibration'], ['whole-body-vibration', 'Whole-body vibration']] },
  { id: 'climate-light', kind: 'topic', parent: 'environment', title: 'Climate, light and air', short: 'Thermal comfort (PMV/PPD), heat stress and WBGT, cold stress, lighting levels, glare and colour, indoor air.',
    plan: [['thermal-comfort', 'Thermal comfort'], ['heat-stress', 'Heat stress'], ['cold-stress', 'Cold stress'], ['lighting-levels', 'How much light'], ['glare-colour', 'Glare, contrast and colour'], ['indoor-air', 'Indoor air and ventilation']] },

  /* ================================================================ COGNITIVE AND TRANSPORT */
  {
    id: 'cognitive', kind: 'branch', parent: 'ergonomics', title: 'Cognitive Ergonomics', icon: 'brain', hue: 280,
    short: 'The mind at work: perception and attention, mental workload, human error, situation awareness, decisions under stress, usability and information design.',
    body: `Many accidents happen not because people are weak but because systems demand more of their attention, memory and judgement than people can give. Cognitive ergonomics designs tasks and interfaces around the mind's real limits: we notice change but miss the expected, hold only a few items in working memory, slip into habits under stress, and read displays by expectation. Good design makes the right action the easy one and makes errors visible and recoverable.`
  },
  { id: 'mind-work', kind: 'topic', parent: 'cognitive', title: 'The mind at work', short: 'Perception and attention, mental workload, human error, situation awareness, decisions and stress, usability, information design.',
    plan: [['perception-attention', 'Perception and attention'], ['mental-workload', 'Mental workload'], ['human-error', 'Human error'], ['situation-awareness', 'Situation awareness'], ['decisions-stress', 'Decisions under stress'], ['usability', 'Usability'], ['information-design', 'Labels, signs and information design']] },
  {
    id: 'transport', kind: 'branch', parent: 'ergonomics', title: 'Vehicles and Transport', icon: 'truck', hue: 215,
    short: 'Seats and driving positions, the driver\'s workspace, aircraft cockpits, truck and bus cabs, forklifts and mobile machines, public transport.',
    body: `A vehicle is a workstation that moves. The seat, pedals, steering wheel and mirrors must fit drivers from small to large, the controls must be reachable without looking, the view out must be clear, and the ride must not shake the spine. Cockpits add the heaviest demands on displays and workload; forklifts and earth-movers add whole-body vibration and poor visibility; buses and trains add standing passengers who must be kept upright.`
  },
  { id: 'vehicle-topic', kind: 'topic', parent: 'transport', title: 'Vehicles', short: 'Seating, the driver\'s workspace, cockpits, truck and bus cabs, forklifts and mobile machines, public transport.',
    plan: [['vehicle-seating', 'Vehicle seats and the seating reference point'], ['driver-workspace', 'The driver\'s workspace'], ['cockpit-ergonomics', 'Aircraft cockpits'], ['truck-bus-cabs', 'Truck and bus cabs'], ['mobile-machines', 'Forklifts and mobile machines'], ['public-transport', 'Public transport']] },

  /* ================================================================ MILITARY AND FIELD */
  {
    id: 'military', kind: 'branch', parent: 'ergonomics', title: 'Military Ergonomics', icon: 'helmet', hue: 115,
    short: 'Human factors in defence: design standards such as MIL-STD-1472, load carriage, crew stations in vehicles, aircraft and ships, fitting helmets, body armour and equipment, extreme environments, and sustained operations.',
    body: `Military ergonomics pushes every limit at once: heavy loads carried far, cramped crew stations, protective equipment that restricts movement and traps heat, extreme heat, cold and altitude, loud noise and vibration, and long operations with little sleep — all where errors cost lives. Defence organizations therefore developed some of the most detailed human-engineering standards, such as the US Department of Defense's MIL-STD-1472, and design their systems around the whole range of personnel who will use them.`
  },
  { id: 'military-topic', kind: 'topic', parent: 'military', title: 'Military human factors', short: 'Human engineering standards, load carriage, crew stations, fitting personal equipment, extreme environments, sustained operations.',
    plan: [['military-human-factors', 'Human factors in defence'], ['load-carriage', 'Carrying loads on foot'], ['crew-stations', 'Crew stations in vehicles, aircraft and ships'], ['personal-equipment-fit', 'Fitting helmets, armour and equipment'], ['extreme-environments', 'Heat, cold, altitude and protective suits'], ['sustained-operations', 'Sleep loss and sustained operations']] },
  {
    id: 'field-work', kind: 'branch', parent: 'ergonomics', title: 'Field and Outdoor Work', icon: 'sun', hue: 80,
    short: 'Work outside a building: construction, agriculture, sun and heat outdoors, working at height, confined spaces, PPE that people can work in, and field computing.',
    body: `Field work happens where the environment cannot be designed: on scaffolds, in fields, in trenches and tanks, in sun and rain. Loads are awkward, ground is uneven, tools are heavy and vibrating, and the work is often far from help. Ergonomics here means choosing and designing equipment that brings the work to a better height and posture, reducing exposure to heat, cold and vibration, and making protective equipment that people can actually work in.`
  },
  { id: 'field-topic', kind: 'topic', parent: 'field-work', title: 'Working in the field', short: 'Construction, agriculture, sun and heat, working at height, confined spaces, PPE, mobile and field computing.',
    plan: [['construction-ergonomics', 'Construction'], ['agriculture-ergonomics', 'Agriculture'], ['outdoor-heat-sun', 'Sun and heat outdoors'], ['working-at-height', 'Working at height'], ['confined-spaces', 'Confined spaces'], ['ppe-ergonomics', 'Personal protective equipment people can work in'], ['field-computing', 'Field computers and working from vehicles']] },

  /* ================================================================ SERVICES */
  {
    id: 'services', kind: 'branch', parent: 'ergonomics', title: 'Healthcare, Education and Services', icon: 'house', hue: 330,
    short: 'Special settings: patient handling, hospital workstations, school furniture for growing children, retail checkouts, commercial kitchens and laboratories.',
    body: `Some of the highest rates of musculoskeletal injury are among nurses and care workers, who move people rather than boxes. Schools seat children whose sizes change by the year in furniture that often fits none of them. Checkout operators repeat the same reach thousands of times a shift; cooks work hot, fast and on their feet; laboratory staff pipette and peer into microscopes for hours. Each setting has its own solutions, built from the same principles.`
  },
  { id: 'services-topic', kind: 'topic', parent: 'services', title: 'Special settings', short: 'Patient handling, hospital workstations, school furniture, retail checkouts, commercial kitchens, laboratories.',
    plan: [['patient-handling', 'Moving and handling patients'], ['hospital-workstations', 'Hospital workstations'], ['school-furniture', 'School furniture for growing children'], ['retail-checkouts', 'Retail checkouts'], ['commercial-kitchens', 'Commercial kitchens'], ['laboratory-ergonomics', 'Laboratories']] }
);
