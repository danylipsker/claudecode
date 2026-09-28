/* HYPER-ERGONOMICS · content/biomech-handling.js — the body as a machine (body-mechanics) and manual handling
 * (lifting-topic): bones, joints, muscles and discs; loads on the spine; neutral postures; static muscle work;
 * repetitive strain; strength; ranges of joint motion; safe lifting; the revised NIOSH lifting equation and the
 * lifting index; carrying; pushing and pulling; team lifting; handling aids. Simulations in sims/biomech-handling.js. */
Hyper.add(

{
  id: 'musculoskeletal-system', parent: 'body-mechanics', title: 'Bones, joints, muscles and discs', level: 1,
  short: 'The body is a machine of rigid links (bones), bearings (joints), motors (muscles), cables (tendons) and spacers (the discs of the spine). Muscles attach close to the joints, so they must pull many times harder than the load in the hand — the root of most ergonomic advice.',
  keywords: ['musculoskeletal system', 'bones', 'joints', 'muscles', 'tendons', 'ligaments', 'cartilage', 'intervertebral disc', 'spine', 'lumbar', 'L5/S1', 'lever', 'moment arm', 'third-class lever', 'biceps', 'mechanical advantage', 'disc creep', 'joint reaction force'],
  prereq: ['ergonomics-defined', 'physics:torque', 'physics:static-equilibrium'],
  related: ['spinal-loading', 'static-muscle-work', 'strength-and-force', 'joint-ranges', 'neutral-postures', 'repetitive-strain', 'mass-strength-data', 'biology:muscles-movement', 'medicine:bone-calcium'],
  body: `
Look at the body as an engineer would. About 206 bones form a frame of rigid links; joints let them turn; more than 600 skeletal muscles are the motors; tendons are the cables that carry muscle force to bone; ligaments hold the joints together; cartilage lines the bearing surfaces; and a column of vertebrae separated by discs carries the trunk. Nerves are the wiring and the blood the fuel line. Every part has its own way of failing, and much of ergonomics is keeping each one inside its comfortable working range.

### Levers that trade force for speed
Most muscles work on **third-class levers**: they attach between the joint and the load. The biceps inserts on the forearm about 40–50 mm from the elbow, while the hand is about 330–360 mm away. For the forearm to stay still, the moments about the elbow must balance ([[physics:static-equilibrium|static equilibrium]]):
$$F_m\\,d_m = g\\,(m\\,d_L + m_f\\,d_f)$$
With 5 kg in the hand at 350 mm, a forearm and hand of 1.8 kg acting at 150 mm and a muscle arm of 45 mm, the biceps pulls about **440 N** — nine times the weight of the load — and the elbow joint is pressed together by about 370 N. The design gives speed and range of movement at the hand; the price is large internal forces. That is why moving a load a few centimetres closer to a joint saves so much effort, and why forces at the joints and the spine run to thousands of newtons. In the simulation, change the elbow angle and the insertion distance and watch the muscle force: the biceps' lever is longest near a right angle, where the arm is strongest.

### The parts and their limits
| Part | Its job | How it suffers at work | Design response |
|---|---|---|---|
| Bone | rigid link | fractures from falls and impacts; stress fractures from long marches; weaker with age ([[medicine:bone-calcium|osteoporosis]]) | fall protection, graded training loads |
| Muscle | motor | fatigue in static holds; strains in sudden overloads | dynamic work, low static effort ([[static-muscle-work]]) |
| Tendon and sheath | cable and guide | irritation from force, repetition and bent wrists | fewer, lighter, straighter exertions ([[repetitive-strain]]) |
| Ligament | holds a joint together | sprains from slips and twists | good footing, no sudden loads |
| Cartilage | bearing surface, fed by movement | wear; long hours of kneeling and squatting are associated with knee osteoarthritis | raise the work, knee pads, rotation |
| Intervertebral disc | spacer and shock absorber | creep under sustained load; damage under flexion plus compression | keep loads close, avoid deep bends ([[spinal-loading]]) |
| Nerve | signals | pressure in tight tunnels (the wrist), vibration | straight wrists, low vibration |

### The spine and its discs
The spine has 7 cervical, 12 thoracic and 5 lumbar vertebrae above the sacrum, in a gentle S-curve that springs under load. Between the bodies of the vertebrae lie the **discs**: a gel core held in rings of tough fibres. The lowest lumbar disc, between L5 and the sacrum (**L5/S1**), carries the weight of everything above and has the longest lever to the hands, so biomechanical models of lifting evaluate the load there. Adult discs have almost no blood supply; they are fed by diffusion, pumped by changes in load. Movement nourishes them; long unchanging loads squeeze water out. We are about 1 % shorter in the evening than in the morning — 15–20 mm — so stature and sitting height should be measured at a known time of day.

### Muscles like to move
A muscle's force grows with its cross-section and is greatest near its middle length, so each joint is strongest in part of its range. **Dynamic work** — contracting and relaxing — pumps blood through the muscle. **Static work** — holding — squeezes the vessels shut, and fatigue comes within minutes (see [[static-muscle-work]]). The machine is built for varied movement, not for holding still.

### Different settings
- **Office:** small forces but long static loads on the neck and shoulders.
- **Warehouse and workshop:** heavy handling loads the lower back; repetitive assembly loads the tendons of the hand and forearm.
- **Health care:** moving people — heavy, not compact, not predictable — gives some of the highest injury rates of any work.
- **Military and field:** heavy loads over long distances; stress fractures of the feet and shins are well known among recruits.

> [!note] This page explains how the body works as a machine; it is not medical advice. Pain that persists belongs with a doctor or physiotherapist.

> [!key] Muscles work on short levers, so internal forces are many times the external load. Every centimetre a load comes closer to a joint saves force many times over.
`,
  ideas: [
    'Bones are links, joints bearings, muscles motors, tendons cables and discs spacers — each fails in its own way.',
    'Most muscles work on third-class levers: the biceps pulls about eight times the load held in the hand.',
    'Internal forces scale with the distance of the load from the joint, so keeping loads close matters more than almost anything else.',
    'Discs and cartilage are fed by movement; sustained loading squeezes the discs — we lose 15–20 mm of stature by evening.',
    'Muscles tolerate dynamic work far better than static holding.'
  ],
  pitfalls: [
    'A 5 kg load puts 5 kg of force on the elbow — The muscle pulls about 440 N to hold it, and the joint is pressed together by several hundred newtons: internal forces are many times the load.',
    'Resting completely is best for discs — Discs are fed by diffusion driven by changing load; long unchanging postures, even sitting still, starve and squeeze them. Varied movement is what they need.',
    'Strength is a fixed number for each person — Strength depends on the joint angle, the speed of movement, fatigue and how long the force must be held.'
  ],
  formulas: [
    {
      name: 'Muscle force to hold a load in the hand',
      expr: 'Fm = g*(m*dL + mf*df)/dm', tex: 'F_m = \\frac{g\\,(m\\,d_L + m_f\\,d_f)}{d_m}',
      vars: {
        Fm: { name: 'muscle force (biceps)', q: 'force', unit: 'N', tex: 'F_m' },
        g: { const: 'g' },
        m: { name: 'load in the hand', q: 'mass', unit: 'kg', value: 5, tex: 'm' },
        dL: { name: 'horizontal distance of the load from the elbow', q: 'length', unit: 'mm', value: 350, tex: 'd_L' },
        mf: { name: 'mass of forearm and hand', q: 'mass', unit: 'kg', value: 1.8, tex: 'm_f' },
        df: { name: 'distance of their centre of mass from the elbow', q: 'length', unit: 'mm', value: 150, tex: 'd_f' },
        dm: { name: 'moment arm of the muscle about the elbow', q: 'length', unit: 'mm', value: 45, tex: 'd_m' }
      },
      note: 'Forearm horizontal, muscle pulling at right angles to it, static. The forearm and hand weigh about 2 % of body mass.',
      stories: { Fm: 'You hold {m} in your hand {dL} from the elbow; forearm and hand weigh {mf} at {df}, and the biceps acts {dm} from the joint. How hard does the biceps pull?', m: 'A biceps can pull {Fm} with a moment arm of {dm}. The forearm and hand ({mf} at {df}) are part of the load. What mass can the hand hold at {dL}?' }
    },
    {
      name: 'The force pressing the elbow together',
      expr: 'R = Fm - g*(m + mf)', tex: 'R = F_m - g\\,(m + m_f)',
      vars: {
        R: { name: 'joint reaction force at the elbow', q: 'force', unit: 'N', tex: 'R' },
        Fm: { name: 'muscle force', q: 'force', unit: 'N', value: 440, tex: 'F_m' },
        g: { const: 'g' },
        m: { name: 'load in the hand', q: 'mass', unit: 'kg', value: 5, tex: 'm' },
        mf: { name: 'mass of forearm and hand', q: 'mass', unit: 'kg', value: 1.8, tex: 'm_f' }
      },
      note: 'Vertical forces on the forearm balance: the muscle pulls up, the weights and the upper arm push down.',
      stories: { R: 'The biceps pulls {Fm} to hold {m} with a forearm and hand of {mf}. How hard is the elbow joint pressed together?' }
    },
    {
      name: 'Mechanical advantage of a limb lever',
      expr: 'MA = dm/dL', tex: '\\mathrm{MA} = \\frac{d_m}{d_L}',
      vars: {
        MA: { name: 'mechanical advantage (load force ÷ muscle force)', tex: '\\mathrm{MA}' },
        dm: { name: 'muscle moment arm', q: 'length', unit: 'mm', value: 45, tex: 'd_m' },
        dL: { name: 'load moment arm', q: 'length', unit: 'mm', value: 350, tex: 'd_L' }
      },
      note: 'Below 1 for almost every joint of the body: the muscle pulls harder than the load, and the hand moves faster than the muscle shortens.',
      stories: { MA: 'A muscle acts {dm} from the joint and the load {dL}. What is the mechanical advantage?' }
    }
  ],
  examples: [
    {
      title: 'Holding a bag at the elbow',
      q: 'You hold a 5 kg bag with the forearm horizontal, 350 mm from the elbow. Forearm and hand weigh 1.8 kg with their centre of mass 150 mm from the elbow; the biceps acts 45 mm from the joint. Find the biceps force and the force on the elbow joint.',
      steps: [
        'Moment of the load: $5 \\times 9.81 \\times 0.35 = 17.2$ N·m. Moment of the forearm: $1.8 \\times 9.81 \\times 0.15 = 2.6$ N·m. Total 19.8 N·m.',
        'Biceps force: $19.8 / 0.045 = 440$ N — about nine times the 49 N weight of the bag.',
        'Vertical balance: the joint is pressed by $440 - 9.81 \\times 6.8 = 374$ N.',
        'Hold the bag with the arm straight down instead and its moment about the elbow falls to zero: the biceps can relax.'
      ],
      a: 'About 440 N in the biceps and 370 N on the elbow joint.'
    },
    {
      title: 'Morning and evening',
      q: 'A seat-height trial measures a worker\'s stature as 1760 mm at 7 am. About what will it be at 5 pm, and why does it matter?',
      steps: [
        'The discs lose water under a day\'s load: about 1 % of stature, here roughly 15–20 mm.',
        'Expect about 1740–1745 mm in the evening; sitting height falls by nearly the same amount, because most of the loss is in the spine.',
        'Record the time of day with body measurements, and let adjustable seats and screens cover the change.'
      ],
      a: 'About 1740–1745 mm — record the time of day with every body measurement.'
    }
  ],
  quiz: [
    { q: 'The biceps attaches about 45 mm from the elbow and the hand is about 350 mm away. Roughly how much harder does the muscle pull than the weight in the hand?', choices: ['About 8 times harder', 'About the same', 'About half as hard', 'About 50 times harder'], a: 0, why: 'Moments balance: $F_m \\times 45 = W \\times 350$, so $F_m \\approx 7.8\\,W$ (a little more with the forearm\'s own weight).' },
    { q: 'Discs have a rich blood supply, so rest is what nourishes them.', a: false, why: 'Adult discs have almost no blood supply. They are fed by diffusion, pumped by changes in load — movement nourishes them, long static loads squeeze them.' },
    { q: 'Where do biomechanical models of lifting usually estimate the load on the spine?', choices: ['At the L5/S1 disc, between the last lumbar vertebra and the sacrum', 'At the neck', 'At the hip joints', 'At the knees'], a: 0, why: 'L5/S1 carries the weight of the whole upper body and has the longest lever arm to the hands; it is also where many disc problems arise.' },
    { q: 'A load is moved from 350 mm to 250 mm from the elbow. By how much does the muscle force for the load fall?', choices: ['By about 29 %', 'By about 10 %', 'Not at all — the weight is the same', 'By about 71 %'], a: 0, why: 'Muscle force is proportional to the load\'s moment arm: $250/350 = 0.71$, a 29 % saving.' }
  ],
  problems: [
    { q: 'A 2 kg tool is held with the forearm horizontal, 300 mm from the elbow. Forearm and hand weigh 1.6 kg with their centre of mass 140 mm from the elbow; the muscle acts 40 mm from the joint. What force must the muscle exert?', answer: 202, unit: 'N', tol: 0.02, steps: ['Moments: $9.81 \\times (2 \\times 0.30 + 1.6 \\times 0.14) = 9.81 \\times 0.824 = 8.08$ N·m.', 'Muscle force: $8.08 / 0.040 = 202$ N.'] }
  ],
  ranges: [
    { dim: 'Elbow angle for holding and pulling (the strongest part of the range)', range: [80, 110], unit: '°', who: 'adults generally: the elbow flexors have their longest lever and best length near a right angle', why: 'The same hand force needs the least muscle effort; holds last longer and pulls are strongest.', limits: 'Keyboard and fine work prefer 90–110°; the angle follows the work height, so short and tall users need the work surface or seat adjusted to reach it.', setting: ['workshop', 'office'], src: 'Chaffin, Andersson and Martin, *Occupational Biomechanics*' },
    { dim: 'Loss of stature over a day (disc creep)', range: [10, 20], unit: 'mm', who: 'adults; about 1 % of stature, most of it in sitting height', why: 'Tells designers how much a measurement changes between morning and evening, and why seats and screens should adjust.', limits: 'Varies with age, the day\'s loading and time lying down; astronauts and people after bed rest gain more.', setting: 'all', src: 'Diurnal variation in stature, widely reported in anthropometry' }
  ],
  applications: [
    'Placing hand work close to the body and near elbow height, so the joints work on short load arms.',
    'Tool and control design: handles that let the wrist stay straight and the elbow near a right angle.',
    'Understanding why the lower back, shoulders and wrists are the commonest sites of work-related pain.'
  ],
  history: 'Giovanni Alfonso Borelli\'s *De Motu Animalium* (published 1680–81) treated muscles and bones as machines and showed that muscles act at a mechanical disadvantage, pulling far harder than the loads they move. Modern occupational biomechanics — the static models of the back and limbs behind today\'s lifting limits — grew from this view in the second half of the 20th century.',
  sources: [
    'D. B. Chaffin, G. B. J. Andersson and B. J. Martin, *Occupational Biomechanics* — levers, joint forces and static models of the body.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human* — muscles, the skeleton and the spine at work.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — the body as a machine, for designers.',
    'G. A. Borelli, *De Motu Animalium* (1680–81).'
  ],
  sim: 'bh-forearm-lever'
},

{
  id: 'spinal-loading', parent: 'body-mechanics', title: 'Loads on the spine', level: 2,
  short: 'When you bend and lift, the back muscles — working on a lever arm of only about 5 cm — must balance the moment of the load and of the upper body. The lowest lumbar disc is then squeezed by thousands of newtons. NIOSH set 3400 N as the design limit most workers tolerate and 6400 N as the level most do not.',
  keywords: ['spinal compression', 'L5/S1', 'low back pain', 'erector spinae', 'moment', 'lever arm', '3400 N', '6400 N', 'action limit', 'maximum permissible limit', 'shear force', 'intradiscal pressure', 'Nachemson', 'biomechanical model', 'stoop', 'squat', 'back belt'],
  prereq: ['musculoskeletal-system', 'physics:torque', 'physics:static-equilibrium'],
  related: ['lifting-principles', 'niosh-lifting-equation', 'neutral-postures', 'handling-aids', 'patient-handling', 'load-carriage', 'posture-assessment', 'medicine:pain'],
  body: `
Low back pain is among the commonest reasons for lost working days, and the Global Burden of Disease studies rank it as a leading cause of years lived with disability worldwide. Heavy handling, deep bending and twisting raise the risk, and a simple lever model shows why.

### A lever with a very short arm
Take the L5/S1 disc as the pivot. In front of it hang the load, of mass $m_L$ at a horizontal distance $d_L$, and the upper body — head, arms and trunk, roughly half the body mass — with its centre of mass at $d_B$, which grows as the trunk bends. Behind it the back extensor muscles pull on a lever arm $E$ of only about 50 mm. The moment they must balance is
$$M = g\\,(m_L d_L + m_B d_B)$$
and the muscle force is $F_m = M/E$. Because the muscles run nearly along the spine, their force presses the disc together; add the part of the weight that acts along the spine at a trunk angle $\\theta$ ([[?sine-cosine|its cosine]]):
$$C \\approx \\frac{M}{E} + (m_L + m_B)\\,g\\cos\\theta$$
A 20 kg box held 400 mm in front of L5/S1, with 40 kg of upper body at 200 mm and the trunk bent 45°, gives $M$ = 157 N·m, a muscle force of about 3140 N and a compression of about **3560 N** — eighteen times the weight of the box. Pull the same box in to 250 mm and the compression falls to about 2970 N. Even bending with empty hands loads the disc with some 1850 N: the upper body is often as heavy a load as the box. The part of the weight across the disc, $(m_L + m_B)\\,g\\sin\\theta$, is the **shear**.

### The limits: 3400 N and 6400 N
| Compression at L5/S1 | Meaning | Source |
|---|---|---|
| below 3400 N | tolerated by most young, healthy workers: the design limit | NIOSH 1981 action limit; criterion of the 1991 equation |
| 3400–6400 N | rising risk: some workers' vertebral end plates are damaged; redesign needed | NIOSH 1981 |
| above 6400 N | not tolerated by most workers: the maximum permissible limit | NIOSH 1981 |

The numbers come from laboratory tests of spinal segments, which fail at loads spread over a wide range, and from studies of injured workers. Tolerance falls with age, is lower on average in women (smaller vertebrae) and falls further under repeated loading, so one fixed limit protects people unequally; age- and sex-specific limits, such as the German *Dortmund recommendations*, are lower. For shear, Gallagher and Marras (2012) proposed about **1000 N** for occasional and **700 N** for frequent loading.

### What raises the load
- **Distance.** With a 50 mm muscle lever, each extra 100 mm of a 20 kg load adds about 390 N of compression.
- **Bending.** The upper body's moment grows with $\\sin\\theta$, and a flexed spine is also weaker; flexion with compression is the classic path to disc damage.
- **Twisting and side-bending.** Muscles on both sides work against each other, raising compression; NIOSH penalises asymmetry.
- **Speed.** Jerking a load adds inertial force to the static estimate.

Measurements inside living discs tell the same story. Alf Nachemson measured them from the 1960s; Wilke and colleagues (1999) found, in one volunteer, about 0.5 MPa standing, about 0.46 MPa sitting relaxed, about 1.1 MPa bending forward, and about 2.3 MPa lifting 20 kg with a rounded back against about 1.7 MPa lifting it close with bent knees.

### What to look for in the simulation
Choose a person, bend the trunk and the knees, set the load and how far out it is held. Watch the dimension lines from L5/S1 and the gauge with its 3400 N and 6400 N marks; the graph shows compression against trunk angle for the same load, held as now and held close.

### Settings
- **Warehouses and workshops:** floor-level picks and deep bins give the largest loads — raise the work instead of bending to it.
- **Health care:** people are heavy, not compact and can move unexpectedly; model estimates for lifting a patient by hand far exceed 3400 N, which is why hoists are used ([[patient-handling]]).
- **Military and field:** packs of 30–50 kg compress the spine for hours, and sandbags, ammunition boxes and stores are lifted from the ground ([[load-carriage]]).
- **Home:** lifting a child out of a cot at arm's length, gardening, moving furniture.

> [!warn] These are static estimates from a simplified model. They rank tasks and show what to change; they do not tell whether one person will be injured. Back pain that persists, spreads down a leg or comes with numbness or weakness should be seen by a doctor. Not medical advice.

> [!key] Spinal compression is set mostly by the moment: load times distance, plus upper body times bend. Keep loads close, raise the work, avoid deep and twisted bends.
`,
  ideas: [
    'The back extensors act on a lever arm of about 50 mm, so compression at L5/S1 is roughly the load moment divided by 0.05 m.',
    'NIOSH set 3400 N as the design limit most workers tolerate and 6400 N as the level most do not.',
    'The upper body is a load too: bending with empty hands compresses the lower back by well over 1000 N.',
    'Each 100 mm a load comes closer saves about 20 N of compression per kilogram held.',
    'Tolerance falls with age, is lower on average for women and falls with repetition; the limits protect most, not all.'
  ],
  pitfalls: [
    'Only the weight of the load matters — The moment matters: a light load far out, or a deep bend with empty hands, can compress the spine more than a heavy load held close and upright.',
    'Below 3400 N a lift is safe for everyone — 3400 N is a design limit for most young, healthy workers; older workers, many women and frequent repetition need lower loads.',
    'A back belt protects the spine — NIOSH reviewed the evidence in 1994 and found it insufficient to show that belts prevent back injury; the moment of the load is unchanged.'
  ],
  formulas: [
    {
      name: 'Moment about L5/S1',
      expr: 'M = g*(mL*dL + mB*dB)', tex: 'M = g\\,(m_L\\,d_L + m_B\\,d_B)',
      vars: {
        M: { name: 'moment about the L5/S1 disc', q: 'torque', unit: 'N·m', tex: 'M' },
        g: { const: 'g' },
        mL: { name: 'load in the hands', q: 'mass', unit: 'kg', value: 20, tex: 'm_L' },
        dL: { name: 'horizontal distance of the load from L5/S1', q: 'length', unit: 'mm', value: 400, tex: 'd_L' },
        mB: { name: 'mass of the upper body (head, arms, trunk above L5/S1)', q: 'mass', unit: 'kg', value: 40, tex: 'm_B' },
        dB: { name: 'horizontal distance of its centre of mass from L5/S1', q: 'length', unit: 'mm', value: 200, tex: 'd_B' }
      },
      note: 'Static, in the side view. The upper body above L5/S1 is roughly half the body mass; its lever arm is near zero upright and grows as the trunk bends.',
      stories: { M: 'A worker holds {mL} at {dL} in front of the lower back, with an upper body of {mB} bent so that its centre is {dB} forward. What moment must the back muscles balance?', dL: 'The back can take a moment of {M}. With an upper body of {mB} at {dB}, how far out can {mL} be held?' }
    },
    {
      name: 'Compression of the L5/S1 disc',
      expr: 'C = M/E + g*(mL + mB)*cos(theta)', tex: 'C = \\frac{M}{E} + g\\,(m_L + m_B)\\cos\\theta',
      vars: {
        C: { name: 'compression force on the disc', q: 'force', unit: 'N', tex: 'C' },
        M: { name: 'moment about L5/S1', q: 'torque', unit: 'N·m', value: 157, tex: 'M' },
        E: { name: 'moment arm of the back extensor muscles', q: 'length', unit: 'mm', value: 50, tex: 'E' },
        g: { const: 'g' },
        mL: { name: 'load', q: 'mass', unit: 'kg', value: 20, tex: 'm_L' },
        mB: { name: 'upper-body mass', q: 'mass', unit: 'kg', value: 40, tex: 'm_B' },
        theta: { name: 'trunk inclination from vertical', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'A simple static model: extensor muscles parallel to the spine, no help from abdominal pressure, no co-contraction. Compare with 3400 N (design limit) and 6400 N (maximum).',
      stories: { C: 'The back muscles balance {M} on a lever of {E}; the load is {mL}, the upper body {mB} and the trunk is bent {theta}. What is the compression at L5/S1?', M: 'What moment about L5/S1 brings the compression to {C}, with a muscle lever of {E}, {mL} of load, {mB} of upper body and the trunk at {theta}?' }
    },
    {
      name: 'Shear across the L5/S1 disc',
      expr: 'S = g*(mL + mB)*sin(theta)', tex: 'S = g\\,(m_L + m_B)\\sin\\theta',
      vars: {
        S: { name: 'shear force across the disc', q: 'force', unit: 'N', tex: 'S' },
        g: { const: 'g' },
        mL: { name: 'load', q: 'mass', unit: 'kg', value: 20, tex: 'm_L' },
        mB: { name: 'upper-body mass', q: 'mass', unit: 'kg', value: 40, tex: 'm_B' },
        theta: { name: 'trunk inclination from vertical', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The component of the weights across the disc (the muscles, pulling along the spine, add little). Compare with about 700 N (frequent) and 1000 N (occasional).',
      stories: { S: 'A worker with {mB} of upper body bends {theta} holding {mL}. What is the shear across L5/S1?' }
    }
  ],
  examples: [
    {
      title: 'A box from a low shelf',
      q: 'A worker bends 45° to take a 20 kg box, holding it 400 mm in front of L5/S1. The upper body (40 kg) has its centre of mass 200 mm forward; the back muscles act 50 mm behind the disc. Estimate the compression — then again with the box pulled in to 250 mm.',
      steps: [
        'Moment: $9.81 \\times (20 \\times 0.40 + 40 \\times 0.20) = 9.81 \\times 16 = 157$ N·m.',
        'Muscle force: $157 / 0.05 = 3140$ N.',
        'Weight along the spine: $9.81 \\times 60 \\times \\cos 45° = 416$ N; compression $\\approx 3140 + 416 = 3560$ N — above the 3400 N design limit.',
        'At 250 mm: $M = 9.81 \\times (5 + 8) = 127.5$ N·m, $F_m = 2550$ N, $C \\approx 2970$ N — below the limit.'
      ],
      a: 'About 3560 N held out, about 2970 N held close: 150 mm saved about 590 N.'
    },
    {
      title: 'How much at arm\'s length?',
      q: 'Bent 60°, with the upper body (40 kg) at 250 mm and the hands 500 mm in front of L5/S1, what load brings the compression to 3400 N? Take $E$ = 50 mm.',
      steps: [
        '$C = 9.81\\,(0.5\\,m_L + 40 \\times 0.25)/0.05 + 9.81\\,(m_L + 40)\\cos 60°$.',
        '$C = 98.1\\,m_L + 1962 + 4.9\\,m_L + 196 = 103\\,m_L + 2158$ N.',
        'Set $C$ = 3400 N: $m_L = (3400 - 2158)/103 = 12$ kg.'
      ],
      a: 'About 12 kg — held far out and bent, a light load reaches the design limit.'
    }
  ],
  quiz: [
    { q: 'Why is the compression on the lumbar disc so much larger than the weight of the load?', choices: ['The back muscles act on a lever arm about ten times shorter than the load\'s', 'Discs are soft and amplify force', 'The arms add their own strength', 'Gravity acts more strongly on the spine'], a: 0, why: 'Moments balance about L5/S1: a load 400–500 mm out is balanced by muscles 50 mm behind, pulling eight to ten times harder.' },
    { q: 'A worker pulls a 20 kg box 100 mm closer. With an extensor lever of 50 mm, roughly how much does the compression fall?', choices: ['About 390 N', 'About 20 N', 'About 2 N', 'About 4000 N'], a: 0, why: '$20 \\times 9.81 \\times 0.10 / 0.05 = 392$ N.' },
    { q: 'A compression of 3000 N is safe for everybody.', a: false, why: '3400 N is a design limit for most young, healthy workers. Tolerance is lower for many older workers and women and falls with repeated loading.' },
    { q: 'Which change lowers the spinal load most for lifting a bulky 15 kg box from the floor?', choices: ['Raise the box to about knuckle height on a stand or lift table', 'Wear a back belt', 'Lift faster to get it over with', 'Squat with the box in front of the knees'], a: 0, why: 'Raising the work removes the deep bend and lets the box be held close. A squat with the box in front of the knees puts it further out; belts do not change the moment.' }
  ],
  problems: [
    { q: 'Upper body 38 kg with its centre 180 mm forward, a 12 kg load 450 mm forward, extensor lever 50 mm, trunk bent 40°. Estimate the compression at L5/S1.', answer: 2777, unit: 'N', tol: 0.02, steps: ['$M = 9.81 \\times (12 \\times 0.45 + 38 \\times 0.18) = 120.1$ N·m.', '$F_m = 120.1 / 0.05 = 2401$ N.', 'Along the spine: $9.81 \\times 50 \\times \\cos 40° = 376$ N.', '$C \\approx 2777$ N.'] }
  ],
  ranges: [
    { dim: 'Compression at L5/S1 — design limit', range: [null, 3400], unit: 'N', who: 'most young, healthy workers', why: 'Below this few spinal segments are damaged in laboratory tests; it is the biomechanical criterion of the NIOSH lifting equation.', limits: 'An estimate from a model; older workers and many women tolerate less, and frequent loading lowers tolerance further.', setting: ['workshop', 'health', 'field', 'military'], src: 'NIOSH Work Practices Guide for Manual Lifting (1981); Waters et al. (1993)' },
    { dim: 'Compression at L5/S1 — maximum permissible', range: [null, 6400], unit: 'N', who: 'the level most workers cannot tolerate', why: 'Marks the work that must be redesigned, not managed: above it injury is likely for most people.', limits: 'Not a target: work between 3400 and 6400 N already carries rising risk and needs engineering controls.', setting: ['workshop', 'health', 'field', 'military'], src: 'NIOSH Work Practices Guide for Manual Lifting (1981)' },
    { dim: 'Shear across L5/S1 — frequent loading', range: [null, 700], unit: 'N', who: 'workers who bend and lift many times a shift', why: 'Shear strains the facet joints and the disc; repeated loading lowers the tolerable level.', limits: 'A proposed limit from a review of laboratory data; models of shear are less certain than those of compression.', setting: ['workshop', 'health'], src: 'Gallagher and Marras (2012)' },
    { dim: 'Shear across L5/S1 — occasional loading', range: [null, 1000], unit: 'N', who: 'workers who bend and lift occasionally', why: 'Keeps occasional deep bends with a load below the shear the spine tolerates.', limits: 'As above; combine with the compression limit, not instead of it.', setting: ['workshop', 'health', 'field'], src: 'Gallagher and Marras (2012)' }
  ],
  applications: [
    'Ranking handling tasks by estimated compression, and checking redesigns (lift tables, closer grips, lower shelves).',
    'The biomechanical criterion behind the NIOSH lifting equation and behind software such as the University of Michigan 3DSSPP.',
    'Patient handling: showing why lifting a person by hand is beyond the design limit and hoists are needed.'
  ],
  history: 'Alf Nachemson, in Sweden, measured the pressure inside living lumbar discs from the 1960s and showed how posture and lifting change it. Static biomechanical models of the lower back, developed by Don Chaffin and others at the University of Michigan, turned postures and loads into forces at L5/S1. NIOSH\'s 1981 Work Practices Guide set its action limit and maximum permissible limit to match compressions of 3400 N and 6400 N, and the 1991 revised equation kept 3400 N as its biomechanical criterion.',
  sources: [
    'NIOSH, *Work Practices Guide for Manual Lifting*, DHHS (NIOSH) Publication No. 81-122 (1981).',
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine, "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics* 36 (1993).',
    'D. B. Chaffin, G. B. J. Andersson and B. J. Martin, *Occupational Biomechanics* — static models of the lower back.',
    'H.-J. Wilke et al., "New in vivo measurements of pressures in the intervertebral disc in daily life", *Spine* 24 (1999).',
    'S. Gallagher and W. S. Marras, "Tolerance of the lumbar spine to shear: a review and recommended exposure limits", *Clinical Biomechanics* 27 (2012).',
    'NIOSH, *Workplace Use of Back Belts* (1994).'
  ],
  sim: 'bh-back-lever'
},

{
  id: 'neutral-postures', parent: 'body-mechanics', title: 'Neutral postures', level: 1,
  short: 'A neutral posture keeps each joint near the middle of its range, where muscles work at a good length, tissues are not stretched and the skeleton carries the weight. ISO 11226 and EN 1005-4 turn this into zones: trunk and upper arm within about 20° of upright are acceptable for long holds, 20–60° only for limited times or with support, beyond 60° not recommended.',
  keywords: ['neutral posture', 'awkward posture', 'ISO 11226', 'EN 1005-4', 'trunk inclination', 'head inclination', 'neck flexion', 'upper arm elevation', 'wrist deviation', 'static posture', 'overhead work', 'stooping', 'text neck', 'RULA'],
  prereq: ['musculoskeletal-system', 'spinal-loading'],
  related: ['joint-ranges', 'static-muscle-work', 'posture-assessment', 'monitor-placement', 'standing-work-heights', 'reach-zones', 'hand-tools', 'working-at-height', 'office-chair'],
  body: `
Stand relaxed and the body finds its own balance: the head sits over the shoulders, the upper arms hang, the trunk keeps its natural curves and the weight is shared by both feet. Seated, add thighs about level and a backrest that holds the curve of the lower back. For hand work the elbows are near a right angle and the wrists straight. These are **neutral postures**: every joint near the middle of its range. Work that pulls the body away from them — a bowed head, a bent trunk, raised arms, bent wrists — is called *awkward*, and held or repeated it is a main cause of neck, shoulder, back and wrist complaints.

### Why the middle of the range
- **Moments.** Every body segment is a weight on a lever. The head (about 4.5–5 kg) balanced over the neck needs little muscle; bowed forward by an angle $\\theta$ it creates a moment $M = m g d \\sin\\theta$ that small neck muscles on short levers must hold ([[?sine-cosine|the sine]] grows quickly from zero). At 60° the moment is more than three times that at 15°. The same holds for the trunk and for raised arms.
- **Muscle length.** Muscles are strongest near their middle length; at the ends of a joint's range the same task takes a larger share of their strength.
- **Tissues at their limits.** At the end of a range ligaments are stretched, discs and joint capsules loaded unevenly, and tunnels narrowed — a bent wrist crowds the tendons and the median nerve in the carpal tunnel.

### The zones
In outline, after ISO 11226 (static working postures) and EN 1005-4 (postures at machinery):

| Body part | Acceptable for long holds | Limited time, or only with full support | Not recommended |
|---|---|---|---|
| Trunk, forward inclination | 0–20° | 20–60° (acceptable with full trunk support) | over 60°; leaning back unsupported; twisting or side-bending |
| Head, inclination from vertical | 0–25° | 25–85° | over 85°; tilted back without head support |
| Upper arm, elevation | 0–20° | 20–60° (acceptable with full arm support) | over 60° |
| Elbow, forearm, wrist | mid-range | — | extreme bending, rotation or deviation |
| Knees, standing | straight or nearly | — | standing on bent knees; long kneeling or squatting |

The standards add maximum holding times for the middle zone, shorter as the angle grows. Head inclination is trunk inclination plus neck flexion: a worker leaning 15° with the neck bent 20° has a head inclination of 35°.

### Posture follows the design
People take the posture the workplace forces on them, so an awkward posture is a symptom of the design:

| Posture seen | Usual cause | Design fix |
|---|---|---|
| head bowed over 25° | screen, document or work too low; laptops and phones | raise the work, separate screen ([[monitor-placement]]) |
| trunk bent forward | bench too low, reach too far, poor view | raise and bring the work closer ([[standing-work-heights]]) |
| arms raised over 60° | work above the shoulder, overhead drilling | platforms, extension tools, tilt or rotate the work |
| shoulders shrugged | desk too high for the seat | lower the desk or raise the seat with a footrest |
| wrist bent | handle at the wrong angle, steep keyboard | tools shaped so the force runs in line with the forearm ([[hand-tools]]) |

A bench fixed at one height puts the smallest and the largest users in different postures: the same design is neutral for some and awkward for others. Adjustable heights and reach are the cure.

### Neutral is not still
Even a good posture tires muscles and squeezes discs when held for hours (see [[static-muscle-work]]). The best posture is the next one: alternate sitting and standing, reach, walk.

### Settings
- **Office:** head and upper arms at the screen, keyboard and mouse.
- **Workshop and assembly:** bench heights and reach; overhead assembly is reduced by carriers that tilt or turn the work.
- **Health care:** bending over beds and trolleys — height-adjustable beds keep carers upright.
- **Military and field:** body armour, helmets and packs pull the head and trunk forward; harvesting and ground-level work mean long stoops; crew stations can force hours in one position.

In the simulation, set each angle — or pick a task — and watch each segment turn green, amber or red; tick *supported* to see how a backrest or armrest changes the zone.

> [!tip] Look at the posture, then fix the workplace: a bowed head means the work is too low, raised arms mean it is too high, a bent trunk means it is too low or too far.

> [!key] Keep each joint near the middle of its range: trunk and upper arms within about 20° of upright, head within about 25°, wrists straight — and change posture often.
`,
  ideas: [
    'A neutral posture keeps each joint near the middle of its range, with the skeleton carrying the weight.',
    'The moment of a bowed head, a bent trunk or a raised arm grows with the sine of the angle, and short muscles must hold it.',
    'ISO 11226 zones: trunk and upper arm 0–20° acceptable, 20–60° limited or supported, over 60° not recommended; head 0–25°, 25–85°, over 85°.',
    'Awkward postures are symptoms of the design: work too low, too high or too far.',
    'Even neutral postures should change often.'
  ],
  pitfalls: [
    'Good posture means sitting bolt upright all day — No single posture is good for hours; neutral postures reduce load, but movement between them is what keeps tissues healthy.',
    'Posture is the worker\'s responsibility — People adopt the posture the workplace forces; training cannot fix a bench 200 mm too low.',
    'A slightly bowed head is harmless because the head is light — Held for hours, the moment of a 5 kg head at 40–60° keeps the neck muscles working continuously.'
  ],
  formulas: [
    {
      name: 'Moment of the bowed head about the lower neck',
      expr: 'M = m*g*d*sin(theta)', tex: 'M = m\\,g\\,d\\sin\\theta',
      vars: {
        M: { name: 'moment the neck muscles must hold', q: 'torque', unit: 'N·m', tex: 'M' },
        m: { name: 'mass of the head', q: 'mass', unit: 'kg', value: 4.5, tex: 'm' },
        g: { const: 'g' },
        d: { name: 'distance from the lower neck to the head\'s centre of mass', q: 'length', unit: 'mm', value: 120, tex: 'd' },
        theta: { name: 'forward inclination of the head', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'A rounded single-lever model: head mass about 6–7 % of body mass, lever about 100–150 mm. It shows how the load grows with the angle; it is not a clinical measurement.',
      stories: { M: 'A {m} head is bowed {theta}, its centre of mass {d} from the lower neck. What moment must the neck muscles hold?', theta: 'At what head inclination does a {m} head with its centre {d} from the lower neck need a moment of {M}?' }
    },
    {
      name: 'Head inclination from trunk and neck',
      expr: 'h = t + n', tex: '\\theta_h = \\theta_t + \\theta_n',
      vars: {
        h: { name: 'head inclination from vertical', q: 'angle', unit: '°', signed: true, tex: '\\theta_h' },
        t: { name: 'trunk inclination from vertical', q: 'angle', unit: '°', value: 15, signed: true, tex: '\\theta_t' },
        n: { name: 'neck flexion (head relative to trunk)', q: 'angle', unit: '°', value: 20, signed: true, tex: '\\theta_n' }
      },
      note: 'ISO 11226 judges the head by its inclination from vertical; a bent trunk and a bent neck add up.',
      stories: { h: 'A seated worker leans forward {t} and bends the neck {n}. What is the head inclination?' }
    }
  ],
  examples: [
    {
      title: 'Looking down at a phone',
      q: 'A 4.5 kg head has its centre of mass 120 mm from the lower neck. Compare the moment the neck muscles hold at 15° and at 60° of head inclination.',
      steps: [
        'At 15°: $4.5 \\times 9.81 \\times 0.12 \\times \\sin 15° = 1.37$ N·m.',
        'At 60°: $4.5 \\times 9.81 \\times 0.12 \\times \\sin 60° = 4.59$ N·m.',
        'More than three times the load, held as long as the person reads. At 60° the head is also in the zone ISO 11226 accepts only for limited times.'
      ],
      a: 'About 1.4 N·m at 15° against 4.6 N·m at 60°: raise the device, not the neck muscles\' workload.'
    },
    {
      title: 'Reading a document flat on the desk',
      q: 'A seated worker leans forward 15° and bends the neck 20° to read papers lying on the desk. Which zone is the head in, and what fixes it?',
      steps: [
        'Head inclination $= 15° + 20° = 35°$: in the 25–85° zone, acceptable only for limited holding times.',
        'A sloping document holder beside the screen lets the trunk come upright (0–5°) and the neck bend about 15–20°: head inclination 15–25°, the acceptable zone.'
      ],
      a: '35°, limited-time zone; a document holder brings it to about 20°.'
    }
  ],
  quiz: [
    { q: 'By ISO 11226-type zones, a trunk inclination of 40° held for a long time is…', choices: ['Acceptable only for limited times, or with full trunk support', 'Always acceptable', 'Acceptable for young workers', 'Only a problem above 90°'], a: 0, why: '20–60° is the middle zone: holding time must be limited unless the trunk is fully supported.' },
    { q: 'Why does bowing the head strain the neck even though the head weighs only about 4–5 kg?', choices: ['Its moment about the lower neck grows with the sine of the angle and small muscles on short levers must hold it', 'The head gets heavier when tilted', 'Blood pools in the head', 'It does not; only the eyes tire'], a: 0, why: '$M = mgd\\sin\\theta$: from 15° to 60° the moment more than triples, and the neck extensors hold it for as long as the posture lasts.' },
    { q: 'A perfect neutral posture can be held all day without problems.', a: false, why: 'Any held posture keeps some muscles working and squeezes the discs; movement and posture changes are needed.' },
    { q: 'A worker\'s upper arms are raised about 70° to take parts from a high rack. The best fix is…', choices: ['Bring the parts down to between elbow and shoulder height, or raise the worker on a platform', 'Train the worker to raise the arms less', 'Longer breaks', 'Wear gloves'], a: 0, why: 'Over 60° is not recommended; the cause is the rack height, so change the rack or the standing level.' }
  ],
  problems: [
    { q: 'A 5.0 kg head with its centre of mass 110 mm from the lower neck is inclined 40°. What moment must the neck muscles hold?', answer: 3.47, unit: 'N·m', tol: 0.02, steps: ['$M = 5.0 \\times 9.81 \\times 0.110 \\times \\sin 40°$.', '$= 5.40 \\times 0.643 = 3.47$ N·m.'] }
  ],
  ranges: [
    { dim: 'Trunk forward inclination held for long periods', range: [0, 20], unit: '°', who: 'all adults', why: 'The upper body\'s moment about the lower back stays small and the discs stay near neutral.', limits: '20–60° only for limited times or with full trunk support; over 60° not recommended. Say nothing about forces lifted — see the lifting pages.', setting: ['office', 'workshop', 'health', 'field'], src: 'ISO 11226; EN 1005-4' },
    { dim: 'Head inclination held for long periods', range: [0, 25], unit: '°', who: 'all adults, including people reading, writing and using screens', why: 'The head stays nearly balanced; the neck muscles work lightly.', limits: '25–85° only for limited times; tilting back without head support is not recommended. Bifocal wearers tilt the head back to read screens — raise or lower the screen for them.', setting: ['office', 'workshop', 'school', 'field'], src: 'ISO 11226' },
    { dim: 'Upper-arm elevation held for long periods', range: [0, 20], unit: '°', who: 'all adults; the shoulder tires quickly when the arm is raised', why: 'The arm hangs close to the body and the shoulder muscles are nearly at rest.', limits: '20–60° only for limited times or with the arm fully supported; over 60° not recommended. Overhead work needs platforms or extension tools.', setting: ['office', 'workshop', 'field'], src: 'ISO 11226; EN 1005-4' },
    { dim: 'Wrist bending during repeated or forceful work', range: '±15° of straight', unit: '', who: 'all hand workers', why: 'Keeps the carpal tunnel open and the forearm muscles at a good length; grip is strongest near straight.', limits: 'A guideline, not a hard limit; tool shape and work orientation decide the wrist angle.', setting: ['workshop', 'office'], src: 'RULA (McAtamney and Corlett, 1993); Pheasant and Haslegrave, *Bodyspace*' }
  ],
  applications: [
    'Setting bench, screen and shelf heights so that most users can work in the acceptable zones.',
    'Posture assessment with ISO 11226, EN 1005-4, RULA, REBA or OWAS ([[posture-assessment]]).',
    'Designing machines and assembly carriers that bring the work to the operator instead of the operator to the work.'
  ],
  history: 'Systematic posture recording began with methods such as OWAS, developed in the Finnish steel industry in the 1970s, and RULA, published by Lynn McAtamney and Nigel Corlett in 1993. ISO 11226 (2000) gave an international method for judging static postures, and EN 1005-4 did the same for postures at machinery.',
  sources: [
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'EN 1005-4, *Safety of machinery — Human physical performance — Part 4: Evaluation of working postures and movements in relation to machinery*.',
    'L. McAtamney and E. N. Corlett, "RULA: a survey method for the investigation of work-related upper limb disorders", *Applied Ergonomics* 24 (1993).',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human* — postures and their loads.'
  ],
  sim: 'bh-posture-zones'
},

{
  id: 'static-muscle-work', parent: 'body-mechanics', title: 'Static muscle work and fatigue', level: 2,
  short: 'Holding a posture or a load keeps muscles contracted without movement. The contraction squeezes the blood vessels, waste builds up and the muscle tires within minutes: at half of maximum strength a hold lasts about a minute, at 15 % about a quarter of an hour. Over a working day, sustained effort should stay at a few per cent of maximum.',
  keywords: ['static work', 'static load', 'isometric contraction', 'endurance time', 'Rohmert curve', 'maximum voluntary contraction', 'MVC', 'muscle fatigue', 'blood flow', 'occlusion', 'Jonsson', 'rest breaks', 'micro-pauses', 'holding', 'neck and shoulder pain'],
  prereq: ['musculoskeletal-system', 'neutral-postures'],
  related: ['fatigue-rest-breaks', 'repetitive-strain', 'strength-and-force', 'work-rest-scheduling', 'sit-stand-work', 'standing-all-day', 'biology:muscles-movement', 'medicine:physical-activity'],
  body: `
Muscles do two kinds of work. **Dynamic work** — walking, turning a crank, lifting and putting down — contracts and relaxes them in turn. **Static work** — holding the arm out to a mouse, holding the head over a microscope, gripping a heavy tool, holding a part in place, standing still — keeps them contracted without movement. Static work produces no visible output, yet it is often what makes a job tiring and painful.

### Why holding tires
A contracting muscle squeezes its own blood vessels. As the effort rises, the pressure inside the muscle rises with it: blood flow is restricted from moderate efforts and almost stopped near half of maximum. Oxygen runs short, the muscle turns to anaerobic metabolism, by-products accumulate, force falls and discomfort grows. Dynamic work pumps blood through the muscle with every relaxation, which is why walking for an hour is easier than standing still for an hour.

### How long can a muscle hold?
Effort is measured as a fraction $f$ of the **maximum voluntary contraction** (MVC) — the strongest effort the person can make. Walter Rohmert (1960) measured how long people could hold each fraction; a curve often fitted to his results gives the endurance time in minutes:
$$T = -1.5 + \\frac{2.1}{f} - \\frac{0.6}{f^2} + \\frac{0.1}{f^3}$$

| Effort ($f$) | 100 % | 70 % | 50 % | 30 % | 20 % | 15 % |
|---|---|---|---|---|---|---|
| Endurance time | about 6 s | about 35 s | about 1.1 min | about 2.5 min | about 6.5 min | about 15 min |

The curve falls steeply: halving the effort from 30 % to 15 % multiplies the endurance about six times — an [[?inverse|inverse]] relation that rewards any reduction in force. Rohmert believed efforts under about 15 % could be held indefinitely; later work found fatigue and discomfort at much lower levels over hours, and a meta-analysis by Frey-Law and Avin (2010) showed that endurance differs from joint to joint. Endurance to exhaustion is also not a design target: long before, the person is uncomfortable and working worse.

### Guidelines for a working day
Swedish EMG research by Bengt Jonsson led to widely quoted guidelines: over a working day the **static** (sustained) level of a muscle should not exceed about 2–5 % of maximum, the **average** about 10–14 %, and **peaks** about 50–70 %. The shoulder muscle that holds the arm up to a keyboard, or the neck muscles that hold a bowed head, easily exceed the static guideline.

### Rest and recovery
A tired muscle recovers, but recovery takes longer than the fatigue took to build, so many short pauses work better than a few long ones. For screen work the UK HSE suggests breaks or changes of activity of about 5–10 minutes after 50–60 minutes of continuous work. Micro-pauses of a few seconds — letting the hand drop, looking away — help too (see [[fatigue-rest-breaks]]).

### Designing out static work
| Static load | Where it appears | Fix |
|---|---|---|
| arms held up | work above elbow height, a far mouse | lower the work, bring the mouse in, support the forearms |
| head held bowed | low screens, microscopes, fine assembly | raise or tilt the work, adjustable eyepieces |
| gripping a tool | heavy tools, stiff triggers | balancers, lighter tools, trigger bars, handles that need no squeeze |
| holding a part | assembly, welding, drilling | jigs, fixtures, vices, magnets |
| standing still | checkouts, machine minding | sit–stand seats, footrests, room to move ([[standing-all-day]]) |

### Settings
- **Office:** low but unbroken loads on the neck and shoulders are the main source of complaints.
- **Workshop:** holding parts and tools; overhead work.
- **Health care:** surgeons, dentists and sonographers hold precise postures for long periods.
- **Military and field:** long watches in fixed positions, holding equipment steady, working in cramped crew spaces.

In the simulation, set the effort and press *Hold*: the muscle's blood flow slows, the fatigue bar drains over the endurance time and the point runs along Rohmert's curve.

> [!key] Static effort tires within minutes: at 50 % of maximum about a minute, at 15 % about a quarter of an hour. For all-day work keep sustained effort to a few per cent — support, fix and hang the load instead of holding it.
`,
  ideas: [
    'Static contraction squeezes the muscle\'s blood vessels; dynamic work pumps blood through it.',
    'Endurance time falls steeply with effort: about 1 minute at 50 % of maximum, about 15 minutes at 15 %.',
    'Over a working day sustained effort should stay at about 2–5 % of maximum.',
    'Many short breaks help more than a few long ones.',
    'The cure is to support, fix or hang the load, not to ask people to hold it.'
  ],
  pitfalls: [
    'If a task needs only a small force it cannot be tiring — A small force held without a break for hours, such as the shoulder holding the arm up, is one of the commonest causes of neck and shoulder pain.',
    'Efforts under 15 % of maximum can be held forever — That was Rohmert\'s view; later work found fatigue and discomfort at much lower levels over a working day.',
    'Stronger workers do not tire — Endurance depends on the fraction of each person\'s own maximum, so the same absolute force tires a weaker person far sooner.'
  ],
  formulas: [
    {
      name: 'Endurance time of a static hold (Rohmert\'s curve)',
      expr: 'T = -1.5 + 2.1/f - 0.6/f^2 + 0.1/f^3', tex: 'T = -1.5 + \\frac{2.1}{f} - \\frac{0.6}{f^2} + \\frac{0.1}{f^3}',
      vars: {
        T: { name: 'endurance time to exhaustion', q: false, unit: 'min', tex: 'T' },
        f: { name: 'effort as a fraction of maximum (MVC)', q: 'ratio', unit: '%', value: 30, min: 15, max: 100, tex: 'f' }
      },
      note: 'A fit to Rohmert\'s data for efforts of 15–100 % of maximum; the time to exhaustion, not a comfortable working time. Endurance also differs between muscles and people.',
      stories: { T: 'A worker holds a part with {f} of maximum grip. About how long until exhaustion?', f: 'A hold must last {T}. At most what share of maximum strength may it take?' }
    },
    {
      name: 'Effort as a share of maximum strength',
      expr: 'f = F/Fmax', tex: 'f = \\frac{F}{F_{max}}',
      vars: {
        f: { name: 'relative effort', q: 'ratio', unit: '%', tex: 'f' },
        F: { name: 'force the task needs', q: 'force', unit: 'N', value: 120, tex: 'F' },
        Fmax: { name: 'the person\'s maximum force for this action', q: 'force', unit: 'N', value: 400, tex: 'F_{max}' }
      },
      note: 'The same task is a larger fraction — and so more tiring — for a weaker person.',
      stories: { f: 'A task needs a grip of {F}; the worker\'s maximum is {Fmax}. What fraction of maximum is that?', F: 'A worker with a maximum of {Fmax} should stay at {f}. What force may the task ask for?' }
    }
  ],
  examples: [
    {
      title: 'Holding a part while it is fixed',
      q: 'A task needs a sustained grip of 120 N; the worker\'s maximum grip is 400 N. How long could it be held, and what grip would suit all-day work?',
      steps: [
        'Relative effort: $120/400 = 0.30$ (30 %).',
        'Rohmert: $T = -1.5 + 2.1/0.3 - 0.6/0.09 + 0.1/0.027 = -1.5 + 7.0 - 6.67 + 3.70 = 2.5$ min.',
        'All-day static guideline about 2–5 % of maximum: 8–20 N — in practice, a fixture should hold the part.'
      ],
      a: 'About 2.5 minutes to exhaustion; use a jig rather than a grip.'
    },
    {
      title: 'A weaker person, the same task',
      q: 'The same 120 N grip is needed by a worker whose maximum is 250 N. How long could it be held?',
      steps: [
        '$f = 120/250 = 0.48$.',
        '$T = -1.5 + 2.1/0.48 - 0.6/0.2304 + 0.1/0.1106 = -1.5 + 4.375 - 2.604 + 0.904 = 1.18$ min.'
      ],
      a: 'About 1.2 minutes — half the time of the stronger worker; design for the weaker users.'
    }
  ],
  quiz: [
    { q: 'At about half of maximum strength, how long can a static hold last?', choices: ['About a minute', 'About an hour', 'About a second', 'Indefinitely'], a: 0, why: 'Rohmert\'s curve gives about 1.1 minutes at 50 % of maximum.' },
    { q: 'Why is dynamic work less tiring than static work at the same force?', choices: ['Alternate contraction and relaxation pumps blood through the muscle', 'Dynamic work always needs less force', 'Static work uses larger muscles', 'It is not less tiring'], a: 0, why: 'A held contraction squeezes the vessels; relaxing between contractions lets blood flow and clears the by-products.' },
    { q: 'An effort of 15 % of maximum can be held all day without fatigue.', a: false, why: 'Rohmert\'s curve gives about 15 minutes to exhaustion at 15 %; guidelines for a working day put the sustained level at about 2–5 %.' },
    { q: 'Which change reduces the static load of microscope work most?', choices: ['Adjust the eyepieces and height so the head is nearly upright, and support the forearms', 'Longer shifts with fewer breaks', 'Brighter lighting', 'Stronger neck muscles through exercise alone'], a: 0, why: 'Bringing the head near upright and resting the arms removes the held moments instead of asking muscles to hold them.' }
  ],
  problems: [
    { q: 'Using Rohmert\'s curve, how long can an effort of 40 % of maximum be held?', answer: 1.56, unit: 'min', tol: 0.03, steps: ['$T = -1.5 + 2.1/0.4 - 0.6/0.16 + 0.1/0.064$.', '$= -1.5 + 5.25 - 3.75 + 1.5625 = 1.56$ min.'] },
    { q: 'A worker\'s maximum pinch is 75 N. Keeping a sustained pinch at 5 % of maximum, what force may a task ask for?', answer: 3.75, unit: 'N', tol: 0.02, steps: ['$F = f \\times F_{max} = 0.05 \\times 75 = 3.75$ N — a clip or a fixture, not a finger, should do this.'] }
  ],
  ranges: [
    { dim: 'Sustained (static) muscle effort over a working day', range: [null, 5], unit: '% of maximum', who: 'every muscle held in one state for long: neck, shoulders, back, grip', why: 'Keeps blood flowing and fatigue from accumulating over the hours.', limits: 'Hard to measure without EMG; in practice, remove the hold (supports, fixtures, balancers) rather than estimate it.', setting: ['office', 'workshop', 'health', 'field'], src: 'B. Jonsson\'s EMG guidelines (1978)' },
    { dim: 'Average muscle effort over a working day', range: '10–14 % of maximum at most', unit: '', who: 'the working muscles of a repetitive or varied job', why: 'Leaves time for recovery within the day.', limits: 'A guideline for the whole day, not for single tasks; peak efforts should stay below about 50–70 %.', setting: ['workshop', 'office'], src: 'B. Jonsson\'s EMG guidelines (1978)' },
    { dim: 'Longest continuous hold at half of maximum strength', range: [null, 1], unit: 'min', who: 'average adult muscles, to exhaustion', why: 'Shows how short heavy holds must be — a minute is the limit, not a comfortable time.', limits: 'Endurance varies between muscles and people; comfortable holds are far shorter.', setting: ['workshop', 'field', 'military'], src: 'Rohmert (1960)' },
    { dim: 'Break or change of activity in continuous screen work', range: '5–10 min after 50–60 min', unit: '', who: 'screen users', why: 'Short, frequent breaks let neck, shoulder and eye muscles recover before fatigue builds up.', limits: 'National rules differ; micro-pauses and varied tasks help as well as scheduled breaks.', setting: 'office', src: 'UK HSE guidance on display screen equipment (INDG36)' }
  ],
  applications: [
    'Supporting forearms at keyboards and microscopes, and keeping the mouse close.',
    'Tool balancers, jigs and fixtures that take over holding.',
    'Break schedules for screen work, surgery and inspection.'
  ],
  history: 'Walter Rohmert\'s 1960 study of how long people could hold static efforts gave ergonomics its best-known fatigue curve and a method for setting rest allowances. Bengt Jonsson\'s EMG work in Sweden in the 1970s and 1980s turned muscle activity recordings into guidelines for a working day.',
  sources: [
    'W. Rohmert, "Ermittlung von Erholungspausen für statische Arbeit des Menschen", *Internationale Zeitschrift für angewandte Physiologie* 18 (1960).',
    'B. Jonsson, "Quantitative electromyographic evaluation of muscular load during work", *Scandinavian Journal of Rehabilitation Medicine*, supplement 6 (1978).',
    'L. A. Frey-Law and K. G. Avin, "Endurance time is joint-specific: a modelling and meta-analysis investigation", *Ergonomics* 53 (2010).',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human* — static and dynamic muscle work.',
    'UK Health and Safety Executive, *Working with display screen equipment (DSE)*, INDG36.'
  ],
  sim: 'bh-endurance'
},

{
  id: 'repetitive-strain', parent: 'body-mechanics', title: 'Repetitive strain and MSDs', level: 2,
  short: 'Small forces repeated thousands of times a day — with bent wrists, raised arms, vibration and too little recovery — wear out the tendons, nerves and muscles of the hand, arm, neck and shoulder. Work-related musculoskeletal disorders are prevented by cutting force, repetition and awkward posture together, and by leaving time to recover.',
  keywords: ['repetitive strain injury', 'RSI', 'work-related upper limb disorders', 'WRULD', 'cumulative trauma disorders', 'musculoskeletal disorders', 'MSD', 'carpal tunnel syndrome', 'tendinitis', 'tenosynovitis', 'De Quervain', 'epicondylitis', 'tennis elbow', 'trigger finger', 'rotator cuff', 'Strain Index', 'OCRA', 'ISO 11228-3', 'cycle time', 'recovery time'],
  prereq: ['musculoskeletal-system', 'static-muscle-work', 'neutral-postures'],
  related: ['strength-and-force', 'hand-tools', 'assembly-lines', 'keyboard-mouse', 'job-rotation', 'hand-arm-vibration', 'retail-checkouts', 'ergonomic-risk-assessment', 'psychosocial-factors'],
  body: `
In 1700 Bernardino Ramazzini described the ailments of scribes and notaries: constant sitting, the same movement of the hand over and over, and the strain of the mind. Three centuries later the same pattern has many names — repetitive strain injury (RSI), work-related upper limb disorders (WRULD), cumulative trauma disorders — and **musculoskeletal disorders** (MSDs) are the most common work-related health problem in Europe, according to the European Agency for Safety and Health at Work.

### How repetition does damage
Tissues are damaged a little by every loading and repaired between loadings. When loads come faster than repair — or recovery is cut short — small damage accumulates. Tendons slide in their sheaths and become irritated (tenosynovitis); tendons wear where they attach to bone (at the elbow and the shoulder); nerves are squeezed in tight tunnels, above all the median nerve in the carpal tunnel of the wrist, where a bent wrist, a forceful grip and vibration all raise the pressure; muscles held tense by precise work ache.

| Disorder | Where | Typical work risk factors |
|---|---|---|
| Carpal tunnel syndrome | median nerve at the wrist | forceful, repetitive gripping with a bent wrist; vibration |
| De Quervain's tenosynovitis | thumb tendons at the wrist | repeated thumb use with the wrist turned towards the little finger; wringing |
| Trigger finger | finger flexor tendons | repeated forceful gripping; tool edges pressing into the palm |
| Lateral epicondylitis ("tennis elbow") | forearm extensor tendons at the elbow | forceful gripping with the wrist bent back; twisting |
| Rotator-cuff tendinopathy | shoulder | work with the arms raised; overhead work |
| Tension neck | neck and shoulder muscles | static neck posture; precise visual work |
| Hand-arm vibration syndrome | vessels and nerves of the fingers | vibrating tools ([[hand-arm-vibration]]) |

### The risk factors multiply
The main factors are **force**, **repetition**, **posture**, **duration** and **lack of recovery**; others add to them — vibration, cold, pressure of hard edges on the skin, gloves that fit poorly, a pace set by a machine, and psychosocial strain (high demands with little control, see [[psychosocial-factors]]). They do not simply add: studies of industrial jobs by Silverstein, Fine and Armstrong (1986) found hand and wrist disorders many times more common where high force and high repetition came together than where either was low. They called work highly repetitive when the cycle was shorter than **30 seconds**, or when more than half of the cycle repeated the same movement.

### Measuring the risk
- **The Strain Index** (Moore and Garg, 1995) multiplies six ratings — intensity of exertion, its share of the cycle, exertions per minute, hand and wrist posture, speed and hours per day: $\\mathrm{SI} = \\prod M_i$ (a [[?product|product]]). Scores up to about 3 are probably safe, 7 and above probably hazardous. Because the ratings multiply, halving any one factor halves the score.
- **OCRA** (Occhipinti and Colombini), the detailed method recommended by ISO 11228-3, compares the technical actions a job actually demands with a reference of 30 actions per minute under ideal conditions, reduced for force, posture, missing recovery and extra factors.
- The ACGIH threshold limit value for hand activity combines a 0–10 rating of hand activity with the peak force; screening checklists include the OCRA checklist and the UK HSE's ART tool.

### Prevention
1. **Less force:** power tools, sharp blades, lower friction, balancers, triggers operated by several fingers.
2. **Less repetition:** automate the most repetitive steps; enlarge jobs so they contain different movements.
3. **Better posture:** tools and work orientations that keep wrists straight and elbows low ([[hand-tools]]).
4. **Recovery:** short, frequent breaks; rotation between tasks that use *different* muscles ([[job-rotation]]); OCRA takes about one part of recovery to five parts of work within each hour as its ideal.
5. **Environment and organization:** less vibration and cold, gloves that fit, control over pace, and early reporting of symptoms.

### Settings
- **Industry:** assembly lines, meat and poultry processing, packing, sewing — cycle times of seconds, all day.
- **Retail and office:** checkout scanning, keyboards and mice ([[retail-checkouts]], [[keyboard-mouse]]).
- **Health care:** sonographers, dentists and laboratory staff (pipetting).
- **Field and construction:** pruning and harvesting with secateurs, tying reinforcing bars, powered hand tools.
- **Military:** long hours at keyboards and consoles in operations rooms; equipment maintenance with hand tools in cold, gloved conditions.

In the simulation, set the six factors of the Strain Index and watch the score: see which single change brings a hazardous job down fastest.

> [!warn] Tingling or numbness in the fingers, especially at night, pain that persists, or weakness of grip should be seen by a doctor or occupational health service early. This page explains risk factors; it is not medical advice.

> [!key] Force, repetition, posture and lack of recovery multiply each other. Attack them together — and the most effective fix is usually less force and less repetition, designed into the job.
`,
  ideas: [
    'Repetitive work damages tissues faster than they repair when force, repetition, posture and short recovery combine.',
    'Cycles shorter than about 30 s, or the same movement for over half the cycle, count as highly repetitive.',
    'Risk factors multiply: the Strain Index is a product of six ratings; about 3 or less probably safe, 7 or more probably hazardous.',
    'ISO 11228-3 recommends OCRA, whose reference is 30 technical actions per minute under ideal conditions.',
    'Prevention designs out force and repetition first; breaks and rotation help only when they give different muscles the work.'
  ],
  pitfalls: [
    'Light work cannot injure — Low forces repeated thousands of times with bent wrists and no recovery are exactly how many upper-limb disorders arise.',
    'Rotation always helps — Rotating between two tasks that use the same muscles in the same way changes nothing; rotation must change the load.',
    'Wrist splints and exercises solve the problem — They may help an individual, but the risk sits in the task; force, repetition and posture have to be designed out.'
  ],
  formulas: [
    {
      name: 'The Strain Index',
      expr: 'SI = MI*MD*ME*MP*MS*MH', tex: '\\mathrm{SI} = M_I\\,M_D\\,M_E\\,M_P\\,M_S\\,M_H',
      vars: {
        SI: { name: 'Strain Index score (≤ 3 probably safe, ≥ 7 probably hazardous)', tex: '\\mathrm{SI}' },
        MI: { name: 'intensity of exertion multiplier (1 light … 13 near maximal)', value: 6, tex: 'M_I' },
        MD: { name: 'duration of exertion multiplier (share of the cycle; 0.5–3)', value: 1.5, tex: 'M_D' },
        ME: { name: 'efforts per minute multiplier (0.5–3)', value: 1.5, tex: 'M_E' },
        MP: { name: 'hand/wrist posture multiplier (1–3)', value: 1.5, tex: 'M_P' },
        MS: { name: 'speed of work multiplier (1–2)', value: 1.5, tex: 'M_S' },
        MH: { name: 'hours per day multiplier (0.25–1.5)', value: 1, tex: 'M_H' }
      },
      note: 'Moore and Garg (1995): each factor is rated on a five-step scale and turned into a multiplier; see the simulation for the steps.',
      stories: { SI: 'A packing job is rated with multipliers {MI}, {MD}, {ME}, {MP}, {MS} and {MH}. What is its Strain Index?', MI: 'Every other multiplier is fixed ({MD}, {ME}, {MP}, {MS}, {MH}). What intensity multiplier would bring the score to {SI}?' }
    },
    {
      name: 'Exertions per minute from the cycle time',
      expr: 'r = 60*k/tc', tex: 'r = \\frac{60\\,k}{t_c}',
      vars: {
        r: { name: 'exertions per minute', q: false, unit: '/min', tex: 'r' },
        k: { name: 'exertions in one cycle', int: true, value: 3, tex: 'k' },
        tc: { name: 'cycle time', q: 'time', unit: 's', value: 12, tex: 't_c' }
      },
      note: 'Count the hand exertions in one work cycle (grip, press, twist); cycles under about 30 s count as highly repetitive.',
      stories: { r: 'A task has {k} exertions in a cycle of {tc}. How many exertions per minute?', tc: 'A task with {k} exertions per cycle should stay at {r}. How long must the cycle be?' }
    }
  ],
  examples: [
    {
      title: 'Scoring and redesigning a packing job',
      q: 'A packer closes boxes with a hard squeeze (intensity multiplier 6), exerting for 40 % of each cycle (1.5), 12 times a minute (1.5), with the wrist fairly bent (1.5), at a fast pace (1.5), for a 7.5-hour shift (1.0). Score it, then redesign it.',
      steps: [
        '$\\mathrm{SI} = 6 \\times 1.5 \\times 1.5 \\times 1.5 \\times 1.5 \\times 1.0 = 30$: far above 7 — probably hazardous.',
        'A power-assisted closer makes the effort "somewhat hard" (3); a tilted table straightens the wrist (1.0); a longer cycle brings exertions to 8 a minute (1.0) at a fair pace (1.0).',
        'New score: $3 \\times 1.5 \\times 1.0 \\times 1.0 \\times 1.0 \\times 1.0 = 4.5$ — in the grey zone between 3 and 7: keep improving (force first).'
      ],
      a: 'From 30 to 4.5 — force, posture and repetition changed together.'
    },
    {
      title: 'Is a checkout highly repetitive?',
      q: 'A checkout operator scans about 20 items a minute, each with a grip, a lift and a turn. What is the cycle time per item and the exertion rate?',
      steps: [
        'Cycle time: $60/20 = 3$ s — far under 30 s: highly repetitive.',
        'Exertions: $r = 60 \\times 3/3 = 60$ per minute.',
        'Hence the design measures at checkouts: scanners that read from several sides, belts that bring items close, seats and sit–stand options, and task rotation.'
      ],
      a: '3 s per item, about 60 exertions a minute — highly repetitive work.'
    }
  ],
  quiz: [
    { q: 'Which combination raised the prevalence of hand and wrist disorders most in studies of industrial jobs?', choices: ['High force together with high repetition', 'High repetition alone', 'High force alone', 'Neither — only age mattered'], a: 0, why: 'Force and repetition multiply each other\'s effect; jobs high in both had far more disorders than jobs high in one.' },
    { q: 'A job cycle lasts 20 s and repeats all shift. Is it highly repetitive?', choices: ['Yes — cycles under 30 s count as highly repetitive', 'No — only cycles under 5 s', 'Only if the load exceeds 10 kg', 'Only on an assembly line'], a: 0, why: 'The classic definition: cycle time under 30 s, or more than half the cycle repeating the same movement.' },
    { q: 'Rotating a worker between two tasks that use the same muscles in the same way reduces the risk.', a: false, why: 'Rotation helps only when the tasks load different muscles or give real recovery.' },
    { q: 'In the Strain Index, which factor has the widest range of multipliers?', choices: ['Intensity of exertion (1 to 13)', 'Speed of work (1 to 2)', 'Hand/wrist posture (1 to 3)', 'Hours per day (0.25 to 1.5)'], a: 0, why: 'Force dominates: reducing the intensity of exertion usually lowers the score most.' }
  ],
  problems: [
    { q: 'A job is rated: intensity "somewhat hard" (3), exertion 30–49 % of the cycle (1.5), 9–14 efforts a minute (1.5), bad wrist posture (2.0), fast pace (1.5), 4–8 hours a day (1.0). What is its Strain Index?', answer: 20.25, tol: 0.01, steps: ['$\\mathrm{SI} = 3 \\times 1.5 \\times 1.5 \\times 2.0 \\times 1.5 \\times 1.0 = 20.25$ — probably hazardous.'] }
  ],
  ranges: [
    { dim: 'Cycle time for work to count as low-repetition', range: [30, null], unit: 's', who: 'hand and arm work repeated through a shift', why: 'Longer, varied cycles give tissues time to recover between repetitions of the same movement.', limits: 'Also count the share of the cycle spent on one movement (over 50 % is highly repetitive); long cycles of hard work can still be harmful.', setting: ['workshop', 'office'], src: 'Silverstein, Fine and Armstrong (1986)' },
    { dim: 'Technical actions per minute (reference under ideal conditions)', range: [null, 30], unit: 'actions/min', who: 'repetitive upper-limb work, per arm', why: 'The OCRA reference rate, reduced further for force, awkward posture, missing recovery and extra factors.', limits: 'Real jobs rarely have ideal conditions, so the acceptable rate is usually well below 30.', setting: 'workshop', src: 'ISO 11228-3; OCRA method (Occhipinti and Colombini)' },
    { dim: 'Strain Index score', range: [null, 3], unit: '', who: 'jobs with repeated hand and wrist exertions', why: 'Scores of about 3 or less were associated with few distal upper-limb disorders.', limits: 'Scores of 3–7 are uncertain, 7 or more probably hazardous; the index does not cover the shoulder or neck.', setting: 'workshop', src: 'Moore and Garg (1995)' },
    { dim: 'Recovery within each hour of repetitive work', range: 'about 1 part recovery to 5 parts work', unit: '', who: 'repetitive upper-limb work', why: 'Recovery spread through the hour prevents fatigue and micro-damage from accumulating.', limits: 'Breaks must rest the working muscles; a different task with the same movements is not recovery.', setting: ['workshop', 'office'], src: 'OCRA method (ISO 11228-3)' }
  ],
  applications: [
    'Screening assembly, packing, food processing and checkout jobs with the Strain Index, OCRA or ART.',
    'Choosing power tools, balancers and fixtures that remove forceful, repeated exertions.',
    'Designing job rotation and break schedules that give real recovery.'
  ],
  history: 'Bernardino Ramazzini\'s *De Morbis Artificum Diatriba* (1700) described disorders of scribes caused by repeated movement and constant posture. The rise of keyboard work brought an epidemic of reported "RSI" in Australia in the 1980s, and epidemiology from the 1980s onwards — notably Silverstein, Fine and Armstrong — tied upper-limb disorders to force and repetition, leading to the Strain Index (1995), OCRA (1990s) and ISO 11228-3 (2007).',
  sources: [
    'ISO 11228-3, *Ergonomics — Manual handling — Part 3: Handling of low loads at high frequency*.',
    'J. S. Moore and A. Garg, "The Strain Index: a proposed method to analyze jobs for risk of distal upper extremity disorders", *American Industrial Hygiene Association Journal* 56 (1995).',
    'B. A. Silverstein, L. J. Fine and T. J. Armstrong, "Hand wrist cumulative trauma disorders in industry", *British Journal of Industrial Medicine* 43 (1986).',
    'E. Occhipinti, "OCRA: a concise index for the assessment of exposure to repetitive movements of the upper limbs", *Ergonomics* 41 (1998).',
    'B. Ramazzini, *De Morbis Artificum Diatriba* (1700).'
  ],
  sim: 'bh-strain-index'
},

{
  id: 'strength-and-force', parent: 'body-mechanics', title: 'Strength: grip, push and pull', level: 2,
  short: 'Human strength varies far more than body size: the strongest men grip about three times harder than the weakest women. Set the force a task needs from the weak end of the users, the strength of what they handle from the strong end, and keep frequent forces to a fraction of what people can exert.',
  keywords: ['strength', 'grip strength', 'pinch strength', 'push force', 'pull force', 'maximum voluntary contraction', 'strength percentiles', 'design force limits', 'EN 1005-3', 'women and men', 'age and strength', 'gloves', 'handle diameter', 'dynamometer', 'operating force', 'ADA 5 lbf'],
  prereq: ['musculoskeletal-system', 'percentiles', 'static-muscle-work'],
  related: ['mass-strength-data', 'sex-differences', 'age-children-elderly', 'controls-design', 'hand-tools', 'pushing-pulling', 'design-for-range', 'repetitive-strain', 'accessible-design', 'math:normal-distribution'],
  body: `
Strength is the largest force or moment a person can exert in a given posture, direction, speed and duration. It is measured under standard conditions — usually a few seconds of steady effort on a dynamometer — and it depends on muscle size, the joint angle, the handle, the footing, training, fatigue, age, sex and motivation. A designer needs it twice: to be sure the users *can* do the task, and to be sure what they handle survives the strongest of them.

### How strength is spread
Within one group strength is roughly a [[?gaussian|bell curve]], but a wide one. Its [[?standard-deviation|standard deviation]] is about a fifth of the [[?mean|mean]], against about 4 % for stature. Representative, rounded values for working-age adults, dominant hand, from dynamometer surveys such as Mathiowetz and colleagues (1985):

| Action | Men, mean ± SD | Women, mean ± SD | 5th %ile woman | 95th %ile man |
|---|---|---|---|---|
| Power grip | 480 ± 90 N (49 kgf) | 290 ± 60 N (30 kgf) | about 190 N | about 630 N |
| Key (lateral) pinch | 108 ± 20 N | 74 ± 14 N | about 51 N | about 141 N |
| Tip pinch | 75 ± 15 N | 50 ± 10 N | about 34 N | about 100 N |

The 95th-percentile man grips about 3.3 times harder than the 5th-percentile woman. On average women's strength is about 50–70 % of men's — nearer the lower figure for the upper body, higher for the legs — with overlap: roughly one man in six grips less hard than the 95th-percentile woman. Grip peaks between about 25 and 40 years and falls by roughly a quarter to a third by the late sixties. Gloves cut grip by about 10–30 %; a bent wrist, a handle too thick or too thin, cold hands and fatigue all cut it further.

### Design for the right end
| Design question | The limiting user | Examples |
|---|---|---|
| Can everyone operate it? | the weakest intended users — a low percentile of women, older people, gloved hands | valve handwheels, emergency releases, taps, door closers |
| Will it survive use and misuse? | the strongest users, plus a safety factor | levers, handles, handrails, guards, pedals |
| Must some people be unable to operate it? | children | child-resistant packaging, tested with panels of children and adults (ISO 8317) |
| Is it used often or for long? | a fraction of the weak users' capacity | hand tools, controls, triggers, fastenings |

### How much of the capacity may a task take?
Maximum strength is a single effort; repeated or held forces must be much lower (see [[static-muscle-work]]). EN 1005-3, for machinery, starts from a basic force — a low percentile of the intended users' strength, lower still for products used by the general public — reduces it for speed, frequency and duration of use, and then compares the actual force with the reduced value: up to **half** is recommended, half to 70 % is not recommended, more than 70 % should be avoided. The same idea sits behind the US accessibility rule that operable parts and interior doors need no more than **22.2 N (5 lbf)**.

### What the percentiles hide
Strength for one action does not predict another well; a strong grip does not mean a strong pull. Test the actual action in the actual posture — with the gloves, clothing and footing of the real task. For whole-body pushing and pulling the limit is often the friction under the feet, not the muscles (see [[pushing-pulling]]).

### Settings
- **Civil and home:** the widest range of users — children, older people, people with arthritis or limited grip: taps, jar lids, door handles and closers, buttons.
- **Office:** small forces repeated: keys, staplers, chair adjustments that the small can actually operate.
- **Workshop:** valves, clamps, hand tools, machine controls — often with gloves.
- **Health care:** patients with weak grip; carers pushing beds and trolleys.
- **Military and field:** cold, wet and gloved hands; equipment that must be operable by the whole range of personnel while tired.
- **Vehicles:** pedal, handbrake and door forces.

In the simulation, pick an action and a required force: the curves show who can exert it, for men, women and a mixed group, and how age and gloves shift them.

> [!tip] Specify forces from the weak end and strength from the strong end: an emergency release that the 5th-percentile woman can pull in gloves, on a handle that the 99th-percentile man cannot break.

> [!key] Strength varies about five times more than stature. Design required forces for the weakest users at a fraction of their maximum; design parts to survive the strongest.
`,
  ideas: [
    'Strength spreads widely: its standard deviation is about a fifth of the mean.',
    'The 95th-percentile man grips over three times harder than the 5th-percentile woman; women average about 50–70 % of men\'s strength.',
    'Required forces are set from the weakest users, strength of parts from the strongest.',
    'EN 1005-3 keeps actual forces to at most half of a reduced capacity; US accessibility rules cap operating forces at 22.2 N.',
    'Age, gloves, cold, wrist posture and fatigue all reduce the force people can give.'
  ],
  pitfalls: [
    'Design for the average person\'s strength — Half of the users are weaker than average; a force set at the mean excludes about half of the women and many men.',
    'If people can do it once, it is acceptable — A maximum effort is a single exertion; frequent or sustained forces must be a fraction of it.',
    'Strength data from one action apply to another — Grip, pinch, push and pull strengths are only loosely related; measure the real action in the real posture.'
  ],
  formulas: [
    {
      name: 'A strength percentile',
      expr: 'Fp = mu + z*s', tex: 'F_p = \\mu + z_p\\,\\sigma',
      vars: {
        Fp: { name: 'strength at percentile p', q: 'force', unit: 'N', tex: 'F_p' },
        mu: { name: 'mean strength of the group', q: 'force', unit: 'N', value: 290, tex: '\\mu' },
        z: { name: 'standard normal value for p (−1.645 for the 5th)', value: -1.645, signed: true, tex: 'z_p' },
        s: { name: 'standard deviation', q: 'force', unit: 'N', value: 60, tex: '\\sigma' }
      },
      note: 'For one sex and one action, measured the same way. Strength distributions are somewhat skewed; treat the tails as approximate.',
      stories: { Fp: 'Women\'s grip strength is {mu} with a standard deviation of {s}. What is the grip at z = {z}?' }
    },
    {
      name: 'The share of users able to exert a force',
      expr: 'P = 1 - ncdf((Fr - mu)/s)', tex: 'P = 1 - \\Phi\\!\\left(\\dfrac{F_r - \\mu}{\\sigma}\\right)',
      vars: {
        P: { name: 'share able to exert the force', q: 'ratio', unit: '%', tex: 'P' },
        Fr: { name: 'force the task requires', q: 'force', unit: 'N', value: 250, tex: 'F_r' },
        mu: { name: 'mean strength', q: 'force', unit: 'N', value: 290, tex: '\\mu' },
        s: { name: 'standard deviation', q: 'force', unit: 'N', value: 60, tex: '\\sigma' }
      },
      note: 'Φ is the normal cumulative distribution. For a mixed group, weight the shares of men and women by their numbers.',
      stories: { P: 'A valve needs a grip of {Fr}. Women\'s grip is {mu} ± {s}. What share of women can operate it at all?', Fr: 'What force can {P} of a group with grip {mu} ± {s} still exert?' }
    },
    {
      name: 'A recommended force from a reduced capacity',
      expr: 'Fd = mr*Fb', tex: 'F_d = m_r\\,F_b',
      vars: {
        Fd: { name: 'recommended operating force', q: 'force', unit: 'N', tex: 'F_d' },
        mr: { name: 'risk multiplier (0.5 recommended; up to 0.7 not recommended)', value: 0.5, tex: 'm_r' },
        Fb: { name: 'reduced capacity of the weak users (after speed, frequency, duration)', q: 'force', unit: 'N', value: 190, tex: 'F_b' }
      },
      note: 'The logic of EN 1005-3: start low in the distribution, reduce for how the force is used, then keep to half of what remains.',
      stories: { Fd: 'The reduced capacity of the weakest intended users is {Fb}. With a risk multiplier of {mr}, what force is recommended?' }
    }
  ],
  examples: [
    {
      title: 'Who can close the valve?',
      q: 'A valve handwheel needs a grip force of 250 N. With grip strength 480 ± 90 N for men and 290 ± 60 N for women, what share of each can close it? What if the force is cut to 150 N?',
      steps: [
        'Men: $z = (250 - 480)/90 = -2.56$; share able $= 1 - \\Phi(-2.56) = 99.5$ %.',
        'Women: $z = (250 - 290)/60 = -0.67$; share able $= 74.8$ %. In a mixed workforce about one person in eight cannot do it at all — and nobody should do it often at that force.',
        'At 150 N: women $z = -2.33$, share 99 %; men essentially all. A larger rim or a gear takes the force down.'
      ],
      a: 'At 250 N: 99.5 % of men, 75 % of women. At 150 N: about 99 % of women.'
    },
    {
      title: 'Designing a lever that nobody breaks',
      q: 'A squeeze lever must survive the grip of the 99th-percentile man (z = 2.326, grip 480 ± 90 N) with a safety factor of 2. What force must it withstand?',
      steps: [
        '99th-percentile grip: $480 + 2.326 \\times 90 = 689$ N.',
        'With a factor of 2: about 1380 N — before adding allowances for misuse such as standing on it or using an extension bar.'
      ],
      a: 'About 1.4 kN.'
    }
  ],
  quiz: [
    { q: 'Which user limits the force needed to open an emergency door?', choices: ['The weakest intended users — small, older or gloved people', 'The strongest man', 'The average person', 'The installer'], a: 0, why: 'If the weakest can operate it, everyone stronger can too.' },
    { q: 'Which user limits the strength a handrail or lever must have?', choices: ['The strongest users, plus misuse and a safety factor', 'The weakest users', 'The average user', 'Children'], a: 0, why: 'Strength of parts is a "nobody must exceed it" case, limited by the strongest.' },
    { q: 'Strength varies between people about as much as stature does.', a: false, why: 'Stature\'s standard deviation is about 4 % of the mean, strength\'s about 20 %: strength varies about five times more.' },
    { q: 'Working gloves on a cold site reduce grip strength by roughly…', choices: ['10–30 %', 'Nothing', '70–90 %', 'They increase it'], a: 0, why: 'Glove thickness separates the fingers and cuts friction and feel; cold hands lose strength too.' }
  ],
  problems: [
    { q: 'Women\'s grip strength is 290 ± 60 N. What share of women can exert at least 200 N?', answer: 93.3, unit: '%', tol: 0.01, steps: ['$z = (200 - 290)/60 = -1.5$.', 'Share $= 1 - \\Phi(-1.5) = 0.933$.'] }
  ],
  ranges: [
    { dim: 'Force to operate controls, buttons and handles in public buildings', range: [null, 22.2], unit: 'N', who: 'people with limited strength or grip, including older people and people with arthritis', why: 'One-handed operation without tight grasping, pinching or twisting, for nearly everyone.', limits: 'A US rule for accessible design; other countries set their own values. Some devices (fire doors) are allowed more.', setting: 'civil', src: 'ADA Standards for Accessible Design (2010), 309.4' },
    { dim: 'Opening force of interior hinged doors on accessible routes', range: [null, 22.2], unit: 'N', who: 'wheelchair users and people with limited strength', why: 'Doors that can be pushed open without help.', limits: 'Fire doors and exterior doors follow other rules; closers must be adjusted and maintained.', setting: 'civil', src: 'ADA Standards for Accessible Design (2010), 404.2.9' },
    { dim: 'Power-grip handle diameter', range: [30, 45], unit: 'mm', who: 'small to large adult hands; small hands prefer the lower end', why: 'The fingers wrap around the handle and the grip is strongest.', limits: 'Gloves need more; precision grips want 8–16 mm; one size never fits every hand — offer sizes for tools used all day.', setting: ['workshop', 'field'], src: 'Pheasant and Haslegrave, *Bodyspace*; Kroemer and Grandjean' },
    { dim: 'Operating force as a share of the users\' reduced capacity', range: '≤ 50 % recommended; 50–70 % not recommended; > 70 % avoid', unit: '', who: 'the intended users of a machine, from a low percentile of their strength', why: 'Leaves reserve for fatigue, awkward postures and weaker users.', limits: 'The reduced capacity depends on speed, frequency and duration of use; use the standard\'s method for real machines.', setting: ['workshop', 'vehicle'], src: 'EN 1005-3' }
  ],
  applications: [
    'Setting operating forces of valves, levers, doors, closures and controls.',
    'Specifying the strength of handles, rails and guards against the strongest users and misuse.',
    'Choosing hand tools with handle sizes and forces that suit small hands and gloves.',
    'Exploring strength percentiles in [the body-size explorer](#/tools/bodysize/explorer).'
  ],
  history: 'Hand dynamometers have been used to measure grip since the 19th century. Normative grip and pinch data for adults, published by Virgil Mathiowetz and colleagues in 1985, remain widely used, and European machinery standards (EN 1005-3) turned strength percentiles into design force limits.',
  sources: [
    'V. Mathiowetz et al., "Grip and pinch strength: normative data for adults", *Archives of Physical Medicine and Rehabilitation* 66 (1985).',
    'EN 1005-3, *Safety of machinery — Human physical performance — Part 3: Recommended force limits for machinery operation*.',
    '*2010 ADA Standards for Accessible Design*, US Department of Justice — 309.4 (operable parts) and 404.2.9 (door opening force).',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — strength and its variation.',
    'ISO 8317, *Child-resistant packaging — Requirements and testing procedures for reclosable packages*.'
  ],
  sim: 'bh-strength'
},

{
  id: 'joint-ranges', parent: 'body-mechanics', title: 'Ranges of joint motion', level: 1,
  short: 'Every joint moves through a range — the wrist about 70–80° each way, the neck 60–80° to each side — but work should use only the middle of it. Typical ranges, how they shrink with age, illness and protective clothing, and why designers aim for the comfortable centre.',
  keywords: ['range of motion', 'ROM', 'joint mobility', 'goniometer', 'flexion', 'extension', 'abduction', 'rotation', 'pronation', 'supination', 'ulnar deviation', 'radial deviation', 'comfort zone', 'ageing', 'PPE restriction', 'body armour', 'neck rotation'],
  prereq: ['musculoskeletal-system', 'neutral-postures'],
  related: ['functional-reach', 'reach-zones', 'controls-design', 'personal-equipment-fit', 'age-children-elderly', 'disability-inclusive', 'hand-tools', 'driver-workspace', 'accessible-design'],
  body: `
Range of motion is measured with a goniometer — a protractor with two arms — from the anatomical position: standing upright, arms at the sides, palms forward, which counts as zero for every joint. Bending a joint is **flexion** and straightening it past zero **extension**; moving a limb away from the body's midline is **abduction**; the forearm turns palm-down (**pronation**) and palm-up (**supination**); the wrist bends sideways towards the thumb (**radial deviation**) or the little finger (**ulnar deviation**).

### Typical ranges
Active ranges for healthy young adults, rounded, in the spirit of the clinical norms published by the American Academy of Orthopaedic Surgeons. Individuals differ by 10–20° or more.

| Joint | Movement | Typical range |
|---|---|---|
| Neck | flexion / extension | 45–60° / 45–70° |
| Neck | rotation, each way | 60–80° |
| Trunk (thoracic and lumbar) | flexion / extension | 70–90° / 20–30° |
| Trunk | rotation, each way | 30–45° |
| Shoulder | flexion / extension | 160–180° / 45–60° |
| Shoulder | abduction | 160–180° |
| Elbow | flexion | 140–150° |
| Forearm | pronation / supination | 75–90° / 80–90° |
| Wrist | flexion / extension | 70–80° / 60–75° |
| Wrist | radial / ulnar deviation | 15–25° / 30–40° |
| Hip | flexion | 110–125° |
| Knee | flexion | 130–140° |
| Ankle | dorsiflexion / plantar flexion | 15–20° / 40–50° |

### Comfortable is the middle
A joint *can* reach the end of its range, but work should not live there. Near the ends muscles are too short or overstretched to be strong, ligaments and capsules are stretched, and tunnels for tendons and nerves narrow. Frequent and forceful work belongs in the middle of the range; occasional reaches may use more; the extremes are for rare movements only. Guidance puts numbers on the middle: trunk and upper arm within about 20° and head within about 25° for held postures (ISO 11226), wrist within about ±15° of straight and elbow roughly 60–100° for repeated arm work (RULA's lowest scores). A task angle can be read as a share of the range — 30° of wrist extension uses about 40 % of a 70° range, well past the comfortable middle.

### What changes the range
- **Sex:** women are on average somewhat more mobile than men.
- **Age:** ranges fall gradually through adult life; reduced neck rotation matters for checking over the shoulder when driving, and reduced shoulder range for reaching high shelves.
- **Health:** arthritis, injury, pregnancy and a large abdomen reduce ranges, especially bending to the floor.
- **Clothing and protective equipment:** body armour, heavy winter clothing, harnesses and chemical-protective suits restrict trunk flexion and shoulder reach; helmets limit looking up. Reaches, views and access must be checked *with* the equipment on ([[personal-equipment-fit]]).

### Using ranges in design
- **Reach envelopes** come from link lengths and joint ranges together ([[functional-reach]]).
- **Rotary controls and keys:** pronation plus supination is about 160–180° in total, so a knob or key that must turn more than a quarter-turn or so in one grasp drives the forearm towards its limits; larger turns need regrasping, a crank or a lever.
- **Handles for everyone:** lever taps and lever door handles need no forearm rotation under grip — better for older people and people with arthritis than round knobs ([[accessible-design]]).
- **Vehicles and control rooms:** frequent checks should need small head turns — mirrors, cameras and displays placed where the eyes reach them ([[driver-workspace]]).

### Settings
| Setting | Who is restricted | Typical design answer |
|---|---|---|
| Home and public spaces | older people, people with arthritis or disabilities | lever handles, reachable heights, no deep bends |
| Office | neck turned to side screens | main screen straight ahead |
| Workshop | overhead reaches, deep bins | work between knuckle and shoulder height, tilting bins |
| Military | armour, packs and helmets limit trunk, shoulder and head movement | crew stations, hatches and controls tested in full kit |
| Field | winter clothing and protective suits | larger controls, fewer fine movements |

In the simulation (in *joint ranges* mode) every joint shows its typical range as a grey arc and its comfortable zone in colour; raise *range lost* to see how age, stiffness or body armour make a task angle impossible.

> [!key] Measure and design in the middle of the range: frequent and forceful movements well inside it, the extremes only occasionally — and check ranges with the clothing and equipment people will wear.
`,
  ideas: [
    'Ranges are measured from the anatomical position; the wrist bends about 70–80° each way, the forearm turns about 160–180° in total.',
    'Work belongs in the middle of the range, where muscles are strong and tissues unstrained.',
    'A task angle can be judged as a share of the joint\'s range.',
    'Ranges shrink with age, illness and protective equipment; check designs with the real kit on.',
    'Lever handles, cranks and well-placed displays keep joints in the middle.'
  ],
  pitfalls: [
    'If a joint can reach an angle, the task may use it — Reaching an angle once is not working there all day; frequent work must stay in the middle of the range.',
    'Range-of-motion tables describe everyone — They are typical values for healthy young adults; older users, people with arthritis and people in protective equipment have less.',
    'Flexibility can be trained so design does not matter — Training changes ranges a little; the design decides the angles every user must reach.'
  ],
  formulas: [
    {
      name: 'Share of a joint\'s range a task uses',
      expr: 'u = a/R', tex: 'u = \\frac{a}{R}',
      vars: {
        u: { name: 'share of the range used', q: 'ratio', unit: '%', tex: 'u' },
        a: { name: 'angle the task needs', q: 'angle', unit: '°', value: 30, tex: 'a' },
        R: { name: 'the joint\'s range in that direction', q: 'angle', unit: '°', value: 70, tex: 'R' }
      },
      note: 'A simple way to compare tasks across joints; use the range of the real users (older, in protective equipment) where it is smaller.',
      stories: { u: 'A task needs {a} of wrist extension; the typical range is {R}. What share of the range does it use?', a: 'A task should use at most {u} of a {R} range. What angle is that?' }
    },
    {
      name: 'A range reduced by age, illness or equipment',
      expr: 'Rr = R*(1 - k)', tex: 'R_r = R\\,(1 - k)',
      vars: {
        Rr: { name: 'remaining range', q: 'angle', unit: '°', tex: 'R_r' },
        R: { name: 'typical range', q: 'angle', unit: '°', value: 70, tex: 'R' },
        k: { name: 'share of the range lost', q: 'ratio', unit: '%', value: 25, min: 0, max: 100, tex: 'k' }
      },
      note: 'An illustration, not a rule: measure the real restriction where it matters (a user trial in the actual equipment).',
      stories: { Rr: 'A user has lost {k} of a {R} range. What range remains?' }
    }
  ],
  examples: [
    {
      title: 'Wrist extension at a keyboard',
      q: 'A steep keyboard makes a typist work with 30° of wrist extension. Typical wrist extension is about 70°. What share of the range is used, and what fixes it?',
      steps: [
        '$u = 30/70 = 0.43$: 43 % of the range — well outside the ±15° zone for repeated work.',
        'Fold the keyboard\'s rear feet, lower it or raise the chair (with a footrest), or use a keyboard with a neutral or negative slope: extension falls to about 10°, 14 % of the range.'
      ],
      a: 'About 43 % of the range; a flatter, lower keyboard brings it to about 14 %.'
    },
    {
      title: 'A knob for older hands',
      q: 'A valve on a public drinking fountain needs a 180° turn of a round knob. Why is this poor design for older users, and what is better?',
      steps: [
        'Pronation plus supination totals about 160–180° in young adults and less in older people, so a half-turn cannot be made in one grasp comfortably.',
        'A round knob also needs grip and twist at once — hard with arthritis.',
        'A lever that moves through 90° or a push button needs no forearm rotation under grip.'
      ],
      a: 'The turn exceeds a comfortable single-grasp rotation; use a lever or a push button.'
    }
  ],
  quiz: [
    { q: 'Why should frequent work stay in the middle of a joint\'s range?', choices: ['Near the ends strength falls and tissues are stretched or squeezed', 'The ends of the range are faster', 'Ranges are the same for everyone', 'The middle looks better'], a: 0, why: 'Muscles are strongest near mid-length; at the ends ligaments stretch and tunnels for tendons and nerves narrow.' },
    { q: 'Body armour and heavy packs mainly restrict…', choices: ['Trunk flexion and shoulder reach', 'Finger flexion', 'Ankle rotation', 'Eye movements'], a: 0, why: 'Rigid plates and load on the shoulders limit bending and reaching; check reaches and access in full equipment.' },
    { q: 'Tables of joint ranges describe what every adult can do.', a: false, why: 'They are typical values for healthy young adults; many users have less.' },
    { q: 'For older people, which door hardware is most inclusive?', choices: ['A lever handle', 'A round knob', 'A small thumb latch', 'A key that must be turned twice'], a: 0, why: 'A lever needs no grip-and-twist and no forearm rotation under load.' }
  ],
  problems: [
    { q: 'A task needs 50° of wrist flexion; the typical range is 75°. What share of the range does it use?', answer: 66.7, unit: '%', tol: 0.01, steps: ['$u = 50/75 = 0.667$ — two-thirds of the range: redesign the task.'] }
  ],
  ranges: [
    { dim: 'Neck rotation, each way (typical adult range)', range: [60, 80], unit: '°', who: 'healthy young adults; older people and people in helmets or collars have less', why: 'Sets how far people can turn to look to the side or behind.', limits: 'Frequent checks should need only small head turns: mirrors, cameras and displays in front.', setting: ['vehicle', 'military', 'all'], src: 'Clinical range-of-motion norms (American Academy of Orthopaedic Surgeons)' },
    { dim: 'Wrist flexion and extension, each way (typical adult range)', range: '60–80°', unit: '', who: 'healthy young adults', why: 'The largest bend a task could ever ask of the wrist.', limits: 'Repeated or forceful work should stay within about ±15° of straight.', setting: ['workshop', 'office'], src: 'Clinical range-of-motion norms; RULA (McAtamney and Corlett, 1993)' },
    { dim: 'Forearm rotation, total (pronation plus supination)', range: [155, 180], unit: '°', who: 'healthy young adults; less with age and arthritis', why: 'Sets the largest turn of a knob, key or handle in one grasp.', limits: 'Strong, comfortable turning uses the middle of the range; larger turns need regrasping, a crank or a lever.', setting: ['civil', 'workshop'], src: 'Clinical range-of-motion norms (American Academy of Orthopaedic Surgeons)' },
    { dim: 'Wrist ulnar or radial deviation in repeated work', range: 'as close to 0° as the task allows', unit: '', who: 'hand workers using tools, keyboards and mice', why: 'Sideways bending loads the tendons at the wrist and thumb.', limits: 'Tool and work orientation decide the angle; bent-handle tools help only when the force runs in line with the forearm.', setting: ['workshop', 'office'], src: 'RULA (McAtamney and Corlett, 1993)' }
  ],
  applications: [
    'Placing controls and displays so that reaching and looking stay in comfortable ranges.',
    'Choosing lever handles, cranks and D-grips for users with reduced mobility.',
    'Checking crew stations, access openings and controls in full protective equipment.'
  ],
  history: 'Clinicians measured joint angles with goniometers through the 20th century; the American Academy of Orthopaedic Surgeons\' booklet *Joint Motion: Method of Measuring and Recording* (1965) standardised the zero positions and gave average ranges still quoted today.',
  sources: [
    'American Academy of Orthopaedic Surgeons, *Joint Motion: Method of Measuring and Recording* (1965).',
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'L. McAtamney and E. N. Corlett, "RULA: a survey method for the investigation of work-related upper limb disorders", *Applied Ergonomics* 24 (1993).',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — joint mobility and its variation.'
  ],
  sim: { id: 'bh-posture-zones', params: { mode: 'rom' }, title: 'Joint ranges and comfortable zones' }
},

{
  id: 'lifting-principles', parent: 'lifting-topic', title: 'Principles of safe lifting', level: 1,
  short: 'The safest lift is the one designed out. The next best starts and ends between knuckle and elbow height, close to the body, without twisting, with a good grip, a manageable weight and time to recover. Technique helps, but the workplace decides most of the risk.',
  keywords: ['safe lifting', 'manual handling', 'lifting technique', 'squat lift', 'stoop lift', 'keep the load close', 'power zone', 'knuckle height', 'twisting', 'UK HSE guidelines', 'Manual Handling Operations Regulations', 'ISO 11228-1', 'EN 1005-2', 'reference mass', 'TILE', 'Directive 90/269/EEC'],
  prereq: ['spinal-loading', 'neutral-postures'],
  related: ['niosh-lifting-equation', 'lifting-index-risk', 'carrying-loads', 'team-lifting', 'handling-aids', 'storage-heights', 'material-flow-layout', 'patient-handling', 'ergonomic-risk-assessment'],
  body: `
European law (Council Directive 90/269/EEC) and the UK Manual Handling Operations Regulations 1992 set the order of thinking: **avoid** hazardous manual handling where reasonably practicable, **assess** what cannot be avoided, and **reduce** the risk. In the US there is no specific federal lifting standard; the NIOSH equation is the accepted yardstick. Everywhere the same lesson holds: the design of the task, the load and the workplace decides most of the risk, and technique only the rest.

### Where the risk comes from
UK guidance sorts the factors under **TILE**:

| Factor | Questions to ask |
|---|---|
| **Task** | How far from the body? From what height to what height? Twisting, stooping, reaching up? How often, for how long, at whose pace, with what rest? Carried how far? |
| **Individual** | Does it need unusual strength or height? Pregnancy, health, age, training? Does protective clothing hinder? |
| **Load** | Heavy, bulky, hard to grip, unstable (liquids, people, animals), sharp or hot? |
| **Environment** | Space to move? Floor even and not slippery? Steps, slopes, poor light, heat, cold, wind? |

### The design principles
1. **Start and end between knuckle and elbow height** — roughly 750–1000 mm. Lifts from the floor and placing above the shoulder cost the most ([[storage-heights]]).
2. **Keep it close.** The moment on the back is load × distance; each 100 mm further out adds about 20 N of spinal compression per kilogram (see [[spinal-loading]]). Bulky loads push the hands out: make them narrow on the side that is held.
3. **Do not twist.** Turn with the feet; put the conveyor or table beside or in front, not behind.
4. **A good grip.** Handles or hand-holds of the right size ([[carrying-loads]]).
5. **A manageable weight.** Under ideal conditions the NIOSH equation allows 23 kg; ISO 11228-1 and EN 1005-2 use a reference mass of about 25 kg for the adult working population and about 15 kg where young and older workers are included, less for products handled by the public. The UK HSE's screening *filter* suggests about 25 kg for men and 16 kg for women, close to the body at waist height — about 10 kg and 7 kg near the floor or above the shoulder, roughly half at arm's length, 10–20 % less for twisting and much less for frequent lifting.
6. **Frequency and recovery:** the more often, the lighter; mix tasks and give pauses.
7. **Good surroundings:** space, dry level floors, good light.

### Technique: useful, not sufficient
Plan the lift and the route; feet apart around the load, one slightly forward; bend hips and knees, keeping the back's natural curve; grip firmly; keep the load close, heaviest side nearest; lift smoothly with the legs; move the feet instead of twisting; put down, then adjust. A *squat* keeps the trunk more upright, but a bulky load must then pass in front of the knees and ends up further out, and squatting costs more energy and loads the knees — for many loads a *semi-squat* works best. Systematic reviews (such as the Cochrane review by Verbeek and colleagues) found no evidence that training in lifting technique alone prevents back pain. Train people, but redesign the task first.

### What to look for in the simulation
Compare the presets: a stoop with straight legs, a full squat with the box in front of the knees, a semi-squat with the box between the knees, and the box lifted from a stand at knuckle height. Watch the lever arms and the compression gauge: the stand wins.

### Settings
- **Warehouses:** floor-level pallets and high racking: lift tables, pallet turners and golden-zone slotting (heavy items between knuckle and shoulder height).
- **Workshops:** parts bins and fixtures at bench height, hoists for anything heavy ([[handling-aids]]).
- **Health care:** people are not loads — use the patient-handling methods and equipment ([[patient-handling]]).
- **Military and field:** stores and sandbags lifted from the ground by tired people in body armour: raise stacks off the ground, use two-person lifts and mechanical aids ([[team-lifting]]).
- **Home:** shopping, garden sacks, children, furniture — smaller packs, trolleys, help.

> [!tip] Walk the route before lifting: where will the load go, what is in the way, is there somewhere to rest it?

> [!key] Avoid, assess, reduce. Most risk is removed by design — heights between knuckle and elbow, loads close and light, no twisting — not by telling people to lift better.
`,
  ideas: [
    'Avoid manual handling where you can, assess what remains, and reduce the risk — design first, technique second.',
    'Start and end lifts between knuckle and elbow height (about 750–1000 mm), close to the body, without twisting.',
    'Reference masses: 23 kg (NIOSH, ideal), about 25 kg for adult workers and 15 kg including young and older workers (ISO 11228-1, EN 1005-2).',
    'UK screening values: about 25 kg for men and 16 kg for women close at waist height, much less near the floor, above the shoulder or at arm\'s length.',
    'Technique training alone has not been shown to prevent back pain.'
  ],
  pitfalls: [
    'Bend the knees, not the back, and every lift is safe — A squat may put a bulky load further out, and the height, distance, weight and frequency matter more than technique.',
    'A 25 kg limit applies to every lift — Limits fall steeply away from waist height and close to the body, with twisting, with frequency, and for many women and older workers.',
    'Training solves manual handling — Reviews found no evidence that technique training alone prevents back injuries; the task has to change.'
  ],
  formulas: [
    {
      name: 'Moment of a load about the lower back',
      expr: 'M = m*g*h', tex: 'M = m\\,g\\,h',
      vars: {
        M: { name: 'moment of the load about L5/S1', q: 'torque', unit: 'N·m', tex: 'M' },
        m: { name: 'load', q: 'mass', unit: 'kg', value: 15, tex: 'm' },
        g: { const: 'g' },
        h: { name: 'horizontal distance of the load from the lower back', q: 'length', unit: 'mm', value: 450, tex: 'h' }
      },
      note: 'Only the load\'s part; the bent upper body adds its own moment (see Loads on the spine).',
      stories: { M: 'A {m} box is held {h} in front of the lower back. What moment does it put on the back?', h: 'How far out can {m} be held for a load moment of {M}?' }
    },
    {
      name: 'Compression saved by bringing the load closer',
      expr: 'dC = m*g*dh/E', tex: '\\Delta C = \\frac{m\\,g\\,\\Delta h}{E}',
      vars: {
        dC: { name: 'reduction in spinal compression', q: 'force', unit: 'N', tex: '\\Delta C' },
        m: { name: 'load', q: 'mass', unit: 'kg', value: 20, tex: 'm' },
        g: { const: 'g' },
        dh: { name: 'distance the load comes closer', q: 'length', unit: 'mm', value: 100, tex: '\\Delta h' },
        E: { name: 'moment arm of the back extensors', q: 'length', unit: 'mm', value: 50, tex: 'E' }
      },
      note: 'From the lever model of the lower back: the muscles, about 50 mm behind the disc, supply the difference.',
      stories: { dC: 'A {m} load is brought {dh} closer to the body. With a muscle lever of {E}, how much does the compression fall?' }
    }
  ],
  examples: [
    {
      title: 'From the floor or from a stand?',
      q: 'A worker lifts a 15 kg box. From the floor they bend 60°, the upper body (40 kg) acting 250 mm forward and the box 450 mm forward. From a stand at knuckle height they bend 15°, upper body 70 mm forward, box 300 mm forward. Compare compressions ($E$ = 50 mm).',
      steps: [
        'Floor: $M = 9.81 \\times (15 \\times 0.45 + 40 \\times 0.25) = 164$ N·m; $F_m = 3290$ N; along the spine $9.81 \\times 55 \\times \\cos 60° = 270$ N; $C \\approx 3560$ N.',
        'Stand: $M = 9.81 \\times (15 \\times 0.30 + 40 \\times 0.07) = 71.6$ N·m; $F_m = 1430$ N; along the spine $9.81 \\times 55 \\times \\cos 15° = 521$ N; $C \\approx 1950$ N.',
        'Raising the box by about 700 mm almost halves the load on the spine — no technique does as much.'
      ],
      a: 'About 3560 N from the floor, about 1950 N from a stand.'
    },
    {
      title: 'Screening with the UK filter',
      q: 'A woman lifts 12 kg boxes. Check them against the UK screening values: close at waist height (16 kg), near the floor (7 kg), with a 90° twist (reduce by about 20 %) and at 5–8 lifts a minute (reduce by about 50 %).',
      steps: [
        'Waist height, close, occasional: 12 kg < 16 kg — within the filter.',
        'From the floor: 12 kg > 7 kg — outside: raise the boxes.',
        'At waist height with a 90° twist: $16 \\times 0.8 = 12.8$ kg — just within.',
        'At waist height, 6 lifts a minute: $16 \\times 0.5 = 8$ kg — outside: a full assessment is needed.'
      ],
      a: 'Acceptable only occasionally, at waist height; floor lifts and frequent lifting need redesign.'
    }
  ],
  quiz: [
    { q: 'Where is it best for lifts to start and end?', choices: ['Between knuckle and elbow height, close to the body', 'At floor level with bent knees', 'At shoulder height', 'Overhead'], a: 0, why: 'In that zone the trunk stays upright, the load stays close and the arms need not rise.' },
    { q: 'Teaching lifting technique alone reliably prevents back injuries.', a: false, why: 'Systematic reviews found no evidence of this; redesigning the task is what works.' },
    { q: 'A worker turns 90° to put boxes on a conveyor behind them. What is the best fix?', choices: ['Move the conveyor beside or in front of the worker', 'Tell the worker to twist slowly', 'Issue a back belt', 'Lift faster'], a: 0, why: 'Twisting is designed in by the layout; change the layout.' },
    { q: 'Why can a full squat be worse than a semi-squat for a bulky box?', choices: ['The box must pass in front of the knees, so it is held further from the spine', 'Squatting uses the back more', 'The knees are weaker than the back', 'It never can'], a: 0, why: 'The distance of the load from the spine sets the moment; a squat can push a bulky load out.' }
  ],
  problems: [
    { q: 'A 15 kg load is brought 150 mm closer to the body. With a back-muscle lever of 50 mm, how much does the spinal compression fall?', answer: 441, unit: 'N', tol: 0.02, steps: ['$\\Delta C = 15 \\times 9.81 \\times 0.15 / 0.05 = 441$ N.'] }
  ],
  ranges: [
    { dim: 'Height of the hands at the start and end of a lift', range: [750, 1000], unit: 'mm', who: 'between the knuckle height of tall men (about 830 mm with shoes) and the elbow height of small women (about 960 mm with shoes)', why: 'The trunk stays upright, the load close and the arms low; the NIOSH vertical multiplier is 1 at 75 cm.', limits: 'Only about 850–960 mm is between knuckle and elbow for everyone; adjustable lift tables and pallet levellers cover the rest.', setting: ['workshop', 'health', 'civil'], src: 'Revised NIOSH lifting equation; UK HSE guidance on the Manual Handling Operations Regulations (L23)' },
    { dim: 'Load lifted occasionally, close to the body at waist height (screening value)', range: '25 kg men · 16 kg women', unit: '', who: 'most healthy adults in good conditions', why: 'A quick filter: loads within it rarely need a detailed assessment.', limits: 'Near the floor or above the shoulder about 10 kg and 7 kg; about half at arm\'s length; less with twisting and frequency. Not a safe limit, a trigger for assessment.', setting: ['workshop', 'civil', 'field'], src: 'UK HSE guidance on the Manual Handling Operations Regulations 1992 (L23)' },
    { dim: 'Reference mass for designing lifting tasks', range: '25 kg (adult working population) · 15 kg (including young and older workers)', unit: '', who: 'the intended working population', why: 'The starting mass that the ISO/EN method reduces for distance, height, twisting and frequency.', limits: 'Products used by the public need lower values (about 5–10 kg); special trained groups may be allowed more.', setting: ['workshop', 'civil'], src: 'ISO 11228-1; EN 1005-2' },
    { dim: 'Horizontal distance of the hands from the ankles', range: [250, 400], unit: 'mm', who: 'every lifter; 250 mm is about the least possible with a box in front of the body', why: 'Keeps the moment on the back small; the NIOSH horizontal multiplier falls from 1 at 250 mm to 0.63 at 400 mm.', limits: 'Bulky loads, obstacles and bins with high sides push the hands further out: design them away.', setting: ['workshop', 'health', 'field'], src: 'Revised NIOSH lifting equation (Waters et al., 1993)' },
    { dim: 'Trunk twist while lifting', range: 'none — turn with the feet', unit: '', who: 'every lifter', why: 'Twisting under load raises spinal compression and shear; NIOSH cuts the recommended weight by about 14 % for 45°.', limits: 'Layouts that place the destination behind the worker make twisting inevitable: change the layout.', setting: ['workshop', 'field'], src: 'Revised NIOSH lifting equation; ISO 11228-1' }
  ],
  applications: [
    'Warehouse slotting: heavy, fast-moving items between knuckle and shoulder height.',
    'Workplace layouts that remove twisting and floor-level picks.',
    'Screening tasks with the UK filter or the NIOSH equation ([the NIOSH calculator](#/tools/lifting/niosh)).'
  ],
  history: 'The International Labour Organization adopted a convention on the maximum weight carried by one worker in 1967 (No. 127). NIOSH\'s Work Practices Guide for Manual Lifting followed in 1981 and the revised equation in 1991; the European Directive 90/269/EEC (1990) and the UK Manual Handling Operations Regulations 1992 moved the emphasis from fixed weight limits to avoiding and assessing risk.',
  sources: [
    'Council Directive 90/269/EEC on the minimum health and safety requirements for the manual handling of loads (1990).',
    'UK Health and Safety Executive, *Manual Handling Operations Regulations 1992: guidance on regulations* (L23).',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting and carrying*.',
    'EN 1005-2, *Safety of machinery — Human physical performance — Part 2: Manual handling of machinery and component parts of machinery*.',
    'J. H. Verbeek et al., "Manual material handling advice and assistive devices for preventing and treating back pain in workers", *Cochrane Database of Systematic Reviews* (2011).'
  ],
  sim: [{ id: 'bh-back-lever', params: { preset: 'semi' }, title: 'Stoop, squat or stand? The lower back as a lever' }, 'bh-niosh']
},

{
  id: 'niosh-lifting-equation', parent: 'lifting-topic', title: 'The revised NIOSH lifting equation', level: 2,
  short: 'NIOSH\'s 1991 equation starts from 23 kg — the load most healthy workers can lift under ideal conditions — and multiplies it by six factors between 0 and 1: how far out the hands are, how high, how far the load travels, how much the body twists, how often and for how long, and how good the grip is. The product is the recommended weight limit (RWL) for that lift.',
  keywords: ['NIOSH lifting equation', 'revised NIOSH equation', 'recommended weight limit', 'RWL', 'load constant', '23 kg', 'horizontal multiplier', 'vertical multiplier', 'distance multiplier', 'asymmetric multiplier', 'frequency multiplier', 'coupling multiplier', 'lifting index', 'Applications Manual', 'Waters 1993'],
  prereq: ['lifting-principles', 'spinal-loading'],
  related: ['lifting-index-risk', 'handling-aids', 'team-lifting', 'carrying-loads', 'ergonomic-risk-assessment', 'storage-heights', 'material-flow-layout', 'patient-handling'],
  body: `
In 1991 a NIOSH committee revised the 1981 lifting guide into one equation for two-handed lifting. It gives, for a particular lift, the **recommended weight limit** — the load that nearly all healthy workers could lift over a substantial period (up to eight hours) without an increased risk of lifting-related low back pain:
$$\\mathrm{RWL} = \\mathrm{LC} \\times \\mathrm{HM} \\times \\mathrm{VM} \\times \\mathrm{DM} \\times \\mathrm{AM} \\times \\mathrm{FM} \\times \\mathrm{CM}$$
Each multiplier is 1 under ideal conditions and falls towards 0 as the lift gets worse. The limits rest on three criteria: **biomechanical** (compression at L5/S1 about 3400 N for infrequent lifts, see [[spinal-loading]]), **physiological** (energy expenditure for frequent lifting) and **psychophysical** (the weights workers judge acceptable — 23 kg under ideal conditions suits most men and about three-quarters of women).

### The multipliers, one by one
Distances are in centimetres, as in the metric equation.

| Factor | Formula | What is measured | Range | What it captures |
|---|---|---|---|---|
| **LC**, load constant | 23 kg | — | — | the most any lift may recommend |
| **HM**, horizontal | $25/H$ | $H$: from the mid-point between the inner ankles to the mid-point of the hands | 1 at $H \\le 25$; 0.40 at 63; 0 beyond | the moment on the back grows with $H$, so HM is its [[?inverse|inverse]] |
| **VM**, vertical | $1 - 0.003\\,\\lvert V - 75\\rvert$ | $V$: height of the hands above the floor | 1 at 75 cm; 0.78 at the floor; 0.70 at 175 cm | stooping low or reaching high |
| **DM**, distance | $0.82 + 4.5/D$ | $D$: vertical travel from origin to destination | 1 at $D \\le 25$; 0.85 at 175 cm | long lifts cost energy and posture |
| **AM**, asymmetry | $1 - 0.0032\\,A$ | $A$: angle of the hands away from straight ahead of the body | 1 at 0°; 0.86 at 45°; 0.71 at 90°; 0 beyond 135° | twisting loads the spine unevenly |
| **FM**, frequency | from a table | lifts per minute, duration (≤ 1 h, 1–2 h, up to 8 h) and whether $V$ is below 75 cm | 1.0 down to 0 (above 15 lifts/min) | fatigue and energy |
| **CM**, coupling | good 1.00; fair 0.95 (1.00 at $V \\ge$ 75); poor 0.90 | handles, hand-holds, the shape of the load | 0.90–1.00 | a poor grip makes the lift harder to control |

The duration classes assume recovery: a *short* period (up to 1 h) must be followed by light work lasting at least 1.2 times as long, a *moderate* one (1–2 h) by at least 0.3 times. For frequent lifting the FM table becomes the largest factor of all: at 5 lifts a minute over a shift it is 0.35.

Evaluate the lift at its **origin** and — where the load must be placed with control — at its **destination** too; the lower RWL governs. Divide the actual load by the RWL and you have the [[lifting-index-risk|lifting index]].

### What the equation does not cover
One-handed lifting; lifting while seated or kneeling; cramped spaces; unstable loads such as people, animals and sloshing liquids; carrying, pushing and pulling; very fast, jerky lifts; slippery floors; hot or cold, humid surroundings; shifts longer than eight hours. For these, use other methods (ISO 11228-1 and -2, psychophysical tables) and judgement.

### Settings
- **Warehouses and parcel handling:** pallets from floor to shoulder, bins of mixed weights — the equation shows which layers and positions are worst.
- **Manufacturing:** loading machines, moving parts between conveyors and fixtures.
- **Health care:** people are not boxes; using the equation's criteria, Waters (2007) recommended that under ideal conditions a person should not lift more than about 16 kg (35 lb) of a patient by hand — above that, use equipment ([[patient-handling]]).
- **Field and agriculture:** 25 kg sacks of feed, seed and cement from the ground — typically far above the RWL.
- **Military logistics:** loading stores and ammunition boxes into vehicles, often from the ground to above the shoulder.

In the simulation, drag the controls: the person bends to reach the box at its origin and the destination shelf; the bars show each multiplier, and the RWL and lifting index update. Find the one change that raises the RWL most.

> [!warn] The RWL protects nearly all *healthy* workers; it is not a guarantee for everybody, and it is not a legal limit everywhere. Where national rules exist, they apply.

> [!key] RWL = 23 kg × six multipliers. Each names a design change: bring the load closer (HM), to 75 cm (VM), shorten the travel (DM), remove the twist (AM), lift less often (FM), add handles (CM).
`,
  ideas: [
    'The RWL starts at 23 kg and is multiplied by six factors, each 1 under ideal conditions.',
    'HM = 25/H, VM = 1 − 0.003|V − 75|, DM = 0.82 + 4.5/D, AM = 1 − 0.0032A (centimetres and degrees); FM and CM come from tables.',
    'The equation rests on biomechanical (3400 N), physiological and psychophysical criteria.',
    'Evaluate origin and, where placement needs control, destination; the lower RWL governs.',
    'Each multiplier points at a design change; frequency often dominates in repetitive jobs.'
  ],
  pitfalls: [
    '23 kg is a safe weight for any lift — It is the limit only under ideal conditions; real lifts often have an RWL of 5–12 kg.',
    'The RWL is a limit for each individual — It is a population recommendation for nearly all healthy workers; it does not guarantee safety for a particular person.',
    'The equation covers all manual handling — It does not cover one-handed lifts, seated or kneeling lifts, people and other unstable loads, carrying, pushing or pulling.'
  ],
  formulas: [
    {
      name: 'Recommended weight limit (metric)',
      expr: 'RWL = LC*(25/H)*(1 - 0.003*abs(V - 75))*(0.82 + 4.5/D)*(1 - 0.0032*A)*FM*CM',
      tex: '\\mathrm{RWL} = \\mathrm{LC}\\,\\frac{25}{H}\\left(1 - 0.003\\left|V - 75\\right|\\right)\\left(0.82 + \\frac{4.5}{D}\\right)\\left(1 - 0.0032\\,A\\right)\\mathrm{FM}\\,\\mathrm{CM}',
      vars: {
        RWL: { name: 'recommended weight limit', q: 'mass', unit: 'kg', tex: '\\mathrm{RWL}' },
        LC: { name: 'load constant', q: 'mass', unit: 'kg', value: 23, fixed: true, tex: '\\mathrm{LC}' },
        H: { name: 'horizontal distance of the hands from the mid-ankles (25–63)', q: false, unit: 'cm', value: 40, min: 25, max: 63, tex: 'H' },
        V: { name: 'height of the hands above the floor (0–175)', q: false, unit: 'cm', value: 30, min: 0, max: 175, tex: 'V' },
        D: { name: 'vertical travel of the load (25–175)', q: false, unit: 'cm', value: 45, min: 25, max: 175, tex: 'D' },
        A: { name: 'asymmetry angle (0–135)', q: false, unit: '°', value: 30, min: 0, max: 135, tex: 'A' },
        FM: { name: 'frequency multiplier (from the table)', value: 0.75, min: 0, max: 1, tex: '\\mathrm{FM}' },
        CM: { name: 'coupling multiplier (1.00 good, 0.95 fair, 0.90 poor)', value: 0.95, min: 0.9, max: 1, tex: '\\mathrm{CM}' }
      },
      note: 'Valid for H 25–63 cm, V 0–175 cm, D 25–175 cm, A 0–135° (take H or D below 25 cm as 25). FM: 0.75 is 1 lift a minute for up to 8 h below 75 cm; 1.00 is at most one lift every 5 minutes for up to an hour. V has two solutions, one on each side of 75 cm.',
      stories: { RWL: 'A box is lifted with the hands {H} from the ankles, from {V} high, through {D}, with a twist of {A}; FM is {FM} and CM {CM}. What is the recommended weight limit?', H: 'How far from the ankles may the hands be for an RWL of {RWL} (V = {V}, D = {D}, A = {A}, FM = {FM}, CM = {CM})?' }
    },
    {
      name: 'The lifting index',
      expr: 'LI = L/RWL', tex: '\\mathrm{LI} = \\frac{L}{\\mathrm{RWL}}',
      vars: {
        LI: { name: 'lifting index', tex: '\\mathrm{LI}' },
        L: { name: 'load actually lifted', q: 'mass', unit: 'kg', value: 12, tex: 'L' },
        RWL: { name: 'recommended weight limit', q: 'mass', unit: 'kg', value: 7.37, tex: '\\mathrm{RWL}' }
      },
      note: 'At or below 1.0 nearly all healthy workers are protected; risk rises above 1 and is high above about 3.',
      stories: { LI: 'A {L} load is lifted where the RWL is {RWL}. What is the lifting index?', L: 'The RWL is {RWL}. What load gives a lifting index of {LI}?' }
    }
  ],
  examples: [
    {
      title: 'Cartons from a pallet',
      q: 'A worker lifts 15 kg cartons from a pallet (hands at $V$ = 15 cm, $H$ = 40 cm) to a conveyor at 75 cm, twisting 30°, twice a minute for 8 hours; the cartons have cut-outs of fair quality. Find the RWL and LI at the origin, then redesign.',
      steps: [
        '$\\mathrm{HM} = 25/40 = 0.625$; $\\mathrm{VM} = 1 - 0.003 \\times 60 = 0.82$; $D = 60$: $\\mathrm{DM} = 0.82 + 4.5/60 = 0.895$; $\\mathrm{AM} = 1 - 0.0032 \\times 30 = 0.904$.',
        'FM (2 lifts/min, 8 h, $V$ < 75) = 0.65; CM (fair, $V$ < 75) = 0.95.',
        '$\\mathrm{RWL} = 23 \\times 0.625 \\times 0.82 \\times 0.895 \\times 0.904 \\times 0.65 \\times 0.95 = 5.9$ kg; $\\mathrm{LI} = 15/5.9 = 2.5$ — high.',
        'Redesign: a lift table keeps the top layer at 75 cm (VM = 1, CM = 1), the conveyor beside the pallet removes the twist and shortens the travel to under 25 cm, and $H$ drops to 30 cm: $\\mathrm{RWL} = 23 \\times 0.833 \\times 0.65 = 12.5$ kg, LI = 1.2.',
        'Frequency now dominates: at one lift a minute (FM = 0.75) the RWL is 14.4 kg and LI = 1.04.'
      ],
      a: 'RWL 5.9 kg, LI 2.5; after redesign LI about 1.0–1.2.'
    },
    {
      title: 'Sacks onto a trailer',
      q: 'A 25 kg sack of feed is lifted from the ground ($V$ = 10 cm, $H$ = 50 cm, bulky) onto a trailer bed ($D$ = 110 cm), once a minute for 8 hours, with a poor grip. What are the RWL and the LI?',
      steps: [
        '$\\mathrm{HM} = 0.50$, $\\mathrm{VM} = 1 - 0.003 \\times 65 = 0.805$, $\\mathrm{DM} = 0.82 + 4.5/110 = 0.861$, AM = 1, FM = 0.75, CM = 0.90.',
        '$\\mathrm{RWL} = 23 \\times 0.50 \\times 0.805 \\times 0.861 \\times 0.75 \\times 0.90 = 5.4$ kg.',
        '$\\mathrm{LI} = 25/5.4 = 4.6$ — very high: use smaller sacks, a conveyor or a pallet and forklift.'
      ],
      a: 'RWL about 5.4 kg; LI about 4.6.'
    }
  ],
  quiz: [
    { q: 'What is the RWL under ideal conditions?', choices: ['23 kg', '25 kg', '40 kg', '15 kg'], a: 0, why: 'The load constant; every real condition multiplies it by a factor of at most 1.' },
    { q: 'The hands move from 25 cm to 50 cm in front of the ankles. What happens to HM?', choices: ['It halves, from 1.0 to 0.5', 'Nothing', 'It falls by 10 %', 'It doubles'], a: 0, why: '$\\mathrm{HM} = 25/H$: doubling the distance halves the multiplier, as it doubles the moment on the back.' },
    { q: 'At which hand height is the vertical multiplier equal to 1?', choices: ['75 cm', 'At the floor', '175 cm', '100 cm'], a: 0, why: '$\\mathrm{VM} = 1 - 0.003\\,|V - 75|$: 75 cm, about knuckle height, is ideal.' },
    { q: 'The NIOSH equation can be used to set limits for lifting patients and for carrying loads 20 m.', a: false, why: 'People are unstable loads and carrying is not lifting; both are outside its scope (though its criteria informed a patient-lifting limit of about 16 kg).' },
    { q: 'Which multiplier depends on the duration of the work and on whether the hands are below 75 cm?', choices: ['FM, the frequency multiplier', 'HM', 'AM', 'DM'], a: 0, why: 'The FM table has columns for up to 1 h, 1–2 h and up to 8 h, each split at V = 75 cm.' }
  ],
  problems: [
    { q: 'An occasional lift (FM = 1.0) with a good grip: $H$ = 30 cm, $V$ = 75 cm, $D$ = 40 cm, $A$ = 45°. What is the RWL?', answer: 15.3, unit: 'kg', tol: 0.02, steps: ['HM = 25/30 = 0.833; VM = 1; DM = 0.82 + 4.5/40 = 0.9325; AM = 1 − 0.144 = 0.856.', '$\\mathrm{RWL} = 23 \\times 0.833 \\times 0.9325 \\times 0.856 = 15.3$ kg.'] },
    { q: 'A 10 kg box is lifted where the RWL is 8 kg. What is the lifting index?', answer: 1.25, tol: 0.01, steps: ['$\\mathrm{LI} = 10/8 = 1.25$ — above 1: some workers are at increased risk.'] }
  ],
  ranges: [
    { dim: 'Recommended weight limit under ideal conditions (load constant)', range: [null, 23], unit: 'kg', who: 'nearly all healthy workers, two-handed lifting', why: 'Keeps compression near or below 3400 N and suits most men and about three-quarters of women.', limits: 'Only for ideal lifts: close, at 75 cm, short travel, no twist, infrequent, good grip. Real limits are usually far lower.', setting: ['workshop', 'field', 'military'], src: 'Waters et al. (1993); NIOSH Applications Manual (1994)' },
    { dim: 'Horizontal distance of the hands from the mid-ankles (H)', range: [250, 630], unit: 'mm', who: 'lifts with a load in front of the body', why: 'Within this the equation applies; HM = 1 at 250 mm, 0.40 at 630 mm.', limits: 'Beyond 630 mm the RWL is zero: the load cannot be lifted safely at that reach.', setting: ['workshop', 'field', 'health'], src: 'Revised NIOSH lifting equation' },
    { dim: 'Height of the hands (V), with the ideal at 750 mm', range: [0, 1750], unit: 'mm', who: 'all lifters; 750 mm is about knuckle height', why: 'VM = 1 at 750 mm, 0.78 at the floor, 0.70 at 1750 mm.', limits: 'Above 1750 mm the RWL is zero; frequent lifts above shoulder height need platforms or aids.', setting: ['workshop', 'field'], src: 'Revised NIOSH lifting equation' },
    { dim: 'Asymmetry angle (A)', range: [0, 135], unit: '°', who: 'lifts that start or end to one side', why: 'AM falls 0.32 % per degree: 0.86 at 45°, 0.71 at 90°.', limits: 'Beyond 135° the RWL is zero; remove twisting by layout, not by limits.', setting: ['workshop', 'field'], src: 'Revised NIOSH lifting equation' },
    { dim: 'Lifting frequency covered by the equation', range: [0.2, 15], unit: 'lifts/min', who: 'lifting jobs up to 8 hours', why: 'The FM table covers one lift every 5 minutes to 15 a minute.', limits: 'Above 15 a minute, or longer than 8 hours, the equation gives no recommendation — redesign.', setting: ['workshop'], src: 'NIOSH Applications Manual (1994)' },
    { dim: 'Part of a patient\'s weight lifted by hand', range: [null, 16], unit: 'kg', who: 'carers lifting under ideal conditions', why: 'Derived from the equation\'s criteria (about 35 lb); above it, use hoists and other equipment.', limits: 'Less when the carer reaches, twists or the patient moves; national safe-handling policies apply.', setting: 'health', src: 'T. R. Waters (2007)' }
  ],
  applications: [
    'Rating and redesigning lifting tasks in warehouses, factories and distribution centres.',
    'Setting maximum package weights and handle designs for products that will be lifted by hand.',
    'Try your own lifts in [the NIOSH calculator](#/tools/lifting/niosh).'
  ],
  history: 'NIOSH\'s 1981 Work Practices Guide for Manual Lifting set an action limit and a maximum permissible limit for symmetric lifts. A committee revised it in 1991 to cover twisting, grip quality and a wider range of tasks; Waters, Putz-Anderson, Garg and Fine published the revised equation in 1993, and the Applications Manual (1994) showed how to use it. ISO 11228-1 and EN 1005-2 later adopted a closely related method.',
  sources: [
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine, "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics* 36 (1993).',
    'T. R. Waters, V. Putz-Anderson and A. Garg, *Applications Manual for the Revised NIOSH Lifting Equation*, DHHS (NIOSH) Publication No. 94-110 (1994).',
    'NIOSH, *Work Practices Guide for Manual Lifting*, DHHS (NIOSH) Publication No. 81-122 (1981).',
    'T. R. Waters, "When is it safe to manually lift a patient?", *American Journal of Nursing* 107 (2007).',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting and carrying*.'
  ],
  sim: 'bh-niosh'
},

{
  id: 'lifting-index-risk', parent: 'lifting-topic', title: 'The lifting index and risk', level: 2,
  short: 'The lifting index — the load divided by the recommended weight limit — ranks how demanding a lift is. At or below 1 nearly all healthy workers are protected; above 1 risk rises for some; above about 3 it is high for many. Composite indices combine the tasks of a whole job, and the multipliers point at what to fix first.',
  keywords: ['lifting index', 'LI', 'composite lifting index', 'CLI', 'frequency-independent lifting index', 'risk bands', 'traffic light', 'recommended weight limit', 'prioritising', 'job redesign', 'pallet', 'order picking', 'baggage handling'],
  prereq: ['niosh-lifting-equation'],
  related: ['lifting-principles', 'handling-aids', 'ergonomic-risk-assessment', 'job-rotation', 'material-flow-layout', 'storage-heights', 'team-lifting', 'ergonomics-productivity'],
  body: `
The lifting index turns the NIOSH equation into a measure of risk:
$$\\mathrm{LI} = \\frac{L}{\\mathrm{RWL}}$$
where $L$ is the load actually lifted. An LI of 2 means the load is twice what the equation recommends for that lift. It lets different tasks — a light box from the floor, a heavy one at waist height — be ranked on one scale, and it shows how much a redesign gains.

### What the numbers mean
NIOSH's Applications Manual names two points: at an LI of **1.0 or less** nearly all healthy workers are protected, and above **3.0** many or most workers are at high risk. Between them the risk rises. Field studies by Waters and colleagues found that the odds of low back pain rose with the index, clearly so above about 2. Practitioners therefore often use bands:

| Lifting index | Band | What to do |
|---|---|---|
| up to 1.0 | low | acceptable for nearly all healthy workers — the design target |
| 1.0–2.0 | moderate | some workers at risk: redesign as a priority |
| 2.0–3.0 | high | redesign soon; meanwhile limit exposure, use aids and teams |
| above 3.0 | very high | many or most workers at risk: redesign now |

The bands between 1 and 3 are a convention, not part of the equation. ISO 11228-1 uses the same logic: an index above 1 calls for measures to reduce the risk.

### Where to act: read the multipliers
The index is a product, so the smallest multiplier shows the biggest lever. HM of 0.5 — the load is held 50 cm out: bring it closer (smaller packages, cut-outs near the body, no obstacles). VM of 0.78 — lifting from the floor: raise the pallet. FM of 0.35 — five lifts a minute all day: reduce the rate, share the work, add pauses. AM of 0.71 — a 90° twist: change the layout. CM of 0.90 — no handles: add hand-holds.

### Jobs with several tasks
A job usually mixes lifts. The **composite lifting index** combines them without simply averaging: each task's *frequency-independent* index (FILI, computed with FM = 1) is found, the tasks are ordered from the most demanding, and each further task adds the extra strain of its frequency on top of what came before. For two tasks:
$$\\mathrm{CLI} = \\mathrm{STLI}_1 + \\mathrm{FILI}_2\\left(\\frac{1}{\\mathrm{FM}_{1,2}} - \\frac{1}{\\mathrm{FM}_1}\\right)$$
where $\\mathrm{STLI}_1$ is the single-task index of the hardest task, $\\mathrm{FM}_1$ the frequency multiplier at its own rate and $\\mathrm{FM}_{1,2}$ the multiplier at the two tasks' combined rate. Later work added a sequential index for jobs that rotate between tasks during a shift.

### Pallets: where the risk sits
On a pallet loaded from the floor to 1.5 m, the bottom layer and the far row carry the highest indices; the middle layers at 70–110 cm the lowest. The simulation colours every box on a pallet by its LI; try a lift table that keeps the working layer near 75 cm and a turntable that brings the far row near.

### Settings
- **Warehouses and parcel hubs:** order picking and pallet building; heavy items slotted between knuckle and shoulder height.
- **Airports:** baggage handling in cramped holds (kneeling) — outside the equation, and among the riskiest jobs; belt loaders and lifting aids help.
- **Construction:** UK guidance discourages building blocks over 20 kg for one-person lifting; cement and plaster bags of 25 kg are commonly lifted from the ground.
- **Manufacturing:** machine loading and unloading.
- **Military logistics:** stores packed for two-person lifts, with handles and marked weights.

> [!warn] An index of 1 or less is not a promise that no one will be hurt, and the index says nothing about people with existing back problems. Symptoms belong with occupational health; national limits apply.

> [!key] LI = load ÷ RWL. Aim for 1.0 or less; above 1 redesign, above 3 redesign now — and let the smallest multiplier tell you what to change.
`,
  ideas: [
    'The lifting index is the load divided by the recommended weight limit.',
    'At or below 1 nearly all healthy workers are protected; above 3 many or most are at high risk.',
    'Bands between 1 and 3 are practitioners\' conventions; field studies found more back pain as the index rose.',
    'The smallest multiplier points at the most effective redesign.',
    'Multi-task jobs are rated with a composite index, which adds the extra strain of each task\'s frequency.'
  ],
  pitfalls: [
    'An LI of 1.5 is fine because it is close to 1 — Above 1 some workers are at increased risk; it is a signal to redesign, not a pass.',
    'Rotating between two tasks averages their risk — Rotation between two tasks with LI 2.5 leaves each lift at 2.5; composite and sequential indices exist because risks do not average.',
    'Choosing strong workers makes a high index acceptable — The index concerns the task; selection does not remove the risk and excludes people who could do a well-designed job.'
  ],
  formulas: [
    {
      name: 'The lifting index',
      expr: 'LI = L/RWL', tex: '\\mathrm{LI} = \\frac{L}{\\mathrm{RWL}}',
      vars: {
        LI: { name: 'lifting index', tex: '\\mathrm{LI}' },
        L: { name: 'load lifted', q: 'mass', unit: 'kg', value: 15, tex: 'L' },
        RWL: { name: 'recommended weight limit', q: 'mass', unit: 'kg', value: 5.9, tex: '\\mathrm{RWL}' }
      },
      note: 'Up to 1.0 low; 1–2 moderate; 2–3 high; above 3 very high (bands between 1 and 3 by convention).',
      stories: { LI: 'The RWL of a lift is {RWL} and the load is {L}. What is the lifting index?', RWL: 'A {L} load gives a lifting index of {LI}. What is the RWL?' }
    },
    {
      name: 'Composite lifting index of two tasks',
      expr: 'CLI = STLI1 + FILI2*(1/FM12 - 1/FM1)', tex: '\\mathrm{CLI} = \\mathrm{STLI}_1 + \\mathrm{FILI}_2\\left(\\frac{1}{\\mathrm{FM}_{12}} - \\frac{1}{\\mathrm{FM}_1}\\right)',
      vars: {
        CLI: { name: 'composite lifting index', tex: '\\mathrm{CLI}' },
        STLI1: { name: 'single-task index of the hardest task', value: 2.13, tex: '\\mathrm{STLI}_1' },
        FILI2: { name: 'frequency-independent index of the second task', value: 1.0, tex: '\\mathrm{FILI}_2' },
        FM12: { name: 'frequency multiplier at the combined rate', value: 0.65, min: 0.01, max: 1, tex: '\\mathrm{FM}_{12}' },
        FM1: { name: 'frequency multiplier of the first task alone', value: 0.75, min: 0.01, max: 1, tex: '\\mathrm{FM}_1' }
      },
      note: 'Tasks are ordered by their single-task index, hardest first; with more tasks, each adds a term of the same form.',
      stories: { CLI: 'The hardest task has STLI {STLI1}; the second has FILI {FILI2}. FM is {FM1} at the first task\'s rate and {FM12} at the combined rate. What is the composite index?' }
    }
  ],
  examples: [
    {
      title: 'Ranking three lifts',
      q: 'Three lifts in a store: A — 15 kg with RWL 5.9 kg; B — 8 kg with RWL 9.5 kg; C — 12 kg with RWL 7.4 kg. Rank them and say what each needs.',
      steps: [
        'A: $\\mathrm{LI} = 15/5.9 = 2.5$ — high.',
        'B: $8/9.5 = 0.84$ — low.',
        'C: $12/7.4 = 1.6$ — moderate.',
        'Redesign A first, then C; B can stay as it is.'
      ],
      a: 'A (2.5) before C (1.6); B (0.84) is acceptable.'
    },
    {
      title: 'A job with two tasks',
      q: 'Task 1 has a frequency-independent index of 1.6 and is done once a minute; task 2 has FILI 1.0, also once a minute; 8-hour shift, hands below 75 cm (FM = 0.75 at 1/min, 0.65 at 2/min). Find the composite index.',
      steps: [
        'Single-task index of task 1: $1.6/0.75 = 2.13$.',
        'Increment of task 2: $1.0 \\times (1/0.65 - 1/0.75) = 1.0 \\times (1.538 - 1.333) = 0.21$.',
        '$\\mathrm{CLI} = 2.13 + 0.21 = 2.34$ — high, driven by task 1.'
      ],
      a: 'CLI ≈ 2.3: redesign task 1 first.'
    }
  ],
  quiz: [
    { q: 'A 14 kg box is lifted where the RWL is 7 kg. What is the lifting index?', choices: ['2.0', '0.5', '7', '21'], a: 0, why: '$\\mathrm{LI} = 14/7 = 2.0$ — high.' },
    { q: 'What does an LI of 1.0 mean?', choices: ['Nearly all healthy workers can do the lift without an increased risk of lifting-related back pain', 'Everyone, including people with back problems, is safe', 'The lift is at a legal maximum', 'Half of workers are at risk'], a: 0, why: 'The RWL is set for nearly all healthy workers; it is a design target, not a guarantee or a legal limit.' },
    { q: 'Rotating workers between two tasks each with LI 2.5 makes the job acceptable.', a: false, why: 'Each lift still has LI 2.5; the task itself must change.' },
    { q: 'An analysis shows HM = 0.5 and every other multiplier above 0.9. What should change first?', choices: ['Bring the load closer to the body', 'Reduce the frequency', 'Add handles', 'Remove twisting'], a: 0, why: 'The smallest multiplier is the biggest lever: HM = 0.5 means the hands are 50 cm out.' }
  ],
  problems: [
    { q: 'An 18 kg load is lifted where the RWL is 12 kg. What is the lifting index?', answer: 1.5, tol: 0.01, steps: ['$\\mathrm{LI} = 18/12 = 1.5$ — moderate: redesign as a priority.'] }
  ],
  ranges: [
    { dim: 'Lifting index for a job to be accepted as designed', range: [null, 1.0], unit: '', who: 'nearly all healthy workers', why: 'At or below 1 the load is within the recommended weight limit for that lift.', limits: 'Not a guarantee for individuals or for people with back problems; outside the equation\'s scope (patients, one hand, kneeling) it does not apply.', setting: ['workshop', 'health', 'field', 'military'], src: 'NIOSH Applications Manual (1994)' },
    { dim: 'Lifting index above which many or most workers are at high risk', range: [3, null], unit: '', who: 'healthy workers', why: 'Marks jobs that must be redesigned at once.', limits: 'Risk already rises above 1; field studies found clearly more back pain above about 2.', setting: ['workshop', 'field', 'military'], src: 'NIOSH Applications Manual (1994); Waters et al. (1999)' },
    { dim: 'Composite lifting index of a multi-task job', range: [null, 1.0], unit: '', who: 'workers doing several lifting tasks in one job', why: 'Accounts for the combined frequency of all the lifts, which single-task indices miss.', limits: 'Depends on the order and frequency of tasks; rotation schemes need the sequential index.', setting: 'workshop', src: 'NIOSH Applications Manual (1994)' },
    { dim: 'Mass of building blocks for one-person lifting', range: [null, 20], unit: 'kg', who: 'bricklayers and labourers on construction sites', why: 'Repeated lifts of heavier blocks exceed recommended limits; lighter blocks or mechanical handling remove the risk.', limits: 'UK guidance; many blocks are lifted from low stacks and placed at height, so even 20 kg can be high risk.', setting: 'field', src: 'UK HSE guidance on handling heavy building blocks (Construction Information Sheet 37)' }
  ],
  applications: [
    'Ranking the lifting tasks of a site and choosing which to redesign first.',
    'Checking pallet patterns, rack heights and package weights before they are built.',
    'Showing the gain of lift tables, turntables and vacuum lifters in numbers ([the NIOSH calculator](#/tools/lifting/niosh)).'
  ],
  history: 'The lifting index and the composite index for multi-task jobs were introduced with the revised equation (1991–1994). Field studies by Thomas Waters and colleagues (1999, 2011) linked higher indices to more low back pain, and a sequential lifting index for job rotation was added later.',
  sources: [
    'T. R. Waters, V. Putz-Anderson and A. Garg, *Applications Manual for the Revised NIOSH Lifting Equation*, DHHS (NIOSH) Publication No. 94-110 (1994).',
    'T. R. Waters et al., "Evaluation of the revised NIOSH lifting equation: a cross-sectional epidemiologic study", *Spine* 24 (1999).',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting and carrying*.',
    'UK Health and Safety Executive, *Handling heavy building blocks*, Construction Information Sheet 37.'
  ],
  sim: 'bh-pallet-li'
},

{
  id: 'carrying-loads', parent: 'lifting-topic', title: 'Carrying loads', level: 2,
  short: 'Carrying adds walking to lifting: the grip must hold the load for the whole distance, a load in one hand bends the trunk sideways, a load in front pulls the back forward and a load on the back costs energy with every step. How a load is carried matters as much as its weight — close, balanced, on the back or on wheels.',
  keywords: ['carrying', 'one-handed carrying', 'two-handed carrying', 'backpack', 'schoolbag', 'hand-held load', 'grip endurance', 'lateral bending', 'Pandolf equation', 'metabolic rate', 'energy expenditure', 'handles', 'hand-holds', 'carrying distance', 'yoke', 'head carrying', 'double pack'],
  prereq: ['lifting-principles', 'static-muscle-work', 'strength-and-force'],
  related: ['load-carriage', 'pushing-pulling', 'handling-aids', 'niosh-lifting-equation', 'agriculture-ergonomics', 'construction-ergonomics', 'work-rest-scheduling', 'school-furniture'],
  body: `
The NIOSH equation stops when the load leaves the floor; carrying is a different task. The arms or the back hold the load while the legs walk, so three limits compete: the **grip**, which must hold for the whole distance; the **trunk**, which must balance a load held to one side or in front; and **energy**, spent with every step. ISO 11228-1 covers carrying (with limits on distance and on the mass carried in a day), and the UK screening values for lifting assume carries of up to about 10 m with the load against the body.

### Ways of carrying
| Way | What it loads | Virtue | Limitation |
|---|---|---|---|
| One hand (bucket, toolbox, suitcase) | grip; trunk bent sideways; back muscles of the other side | a hand stays free | sideways moment on the spine; grip tires fast |
| Two hands, split (two buckets) | both grips | trunk balanced | grip still limits; loads swing against the legs |
| In front, in both arms (a box) | arms, shoulders, lower back | natural for boxes | moment at L5/S1 as in lifting; the view of the feet is blocked — trips |
| On one shoulder (timber, pipes, sacks) | shoulder, neck, trunk sideways | long loads | asymmetric; pressure on the shoulder |
| Backpack | shoulders and hips; slight forward lean | close to the body's centre, hands free | energy; spinal compression; straps press on nerves when heavy (a hip belt should carry most) |
| Double pack, yoke, head | the body's centre line | energy-efficient | needs practice; head loads load the neck |
| On wheels | pushing and pulling only | removes carrying | floors, slopes and steps ([[pushing-pulling]]) |

Datta and Ramanathan (1971) compared seven ways of carrying the same load and found a double pack (front and back) the most economical and carrying in the hands the least. In the simulation, switch between the ways and watch the lean of the body, the moment on the lower back, the grip and the energy.

### The grip and the clock
In the hands, the finger flexors hold roughly the weight of the load divided between the hands. A 15 kg toolbox in one hand needs about 150 N of grip — about half the grip strength of an average woman (290 N) — and by Rohmert's curve half of maximum can be held for only about a minute: some 80 m at a brisk walk. Split into two 7.5 kg loads, each hand works at about a quarter of its maximum and the hold lasts about 3.5 minutes ([[static-muscle-work]]). Good handles help all users: NIOSH counts a handle as good when it is about 19–38 mm in diameter, at least 115 mm long, with about 50 mm of clearance for the hand.

### Energy: the Pandolf equation
For walking with a load on the back, Pandolf, Givoni and Goldman (1977) gave the metabolic rate in watts:
$$M = 1.5\\,W + 2.0\\,(W + L)\\left(\\frac{L}{W}\\right)^2 + \\eta\\,(W + L)\\left(1.5\\,V^2 + 0.35\\,V\\,G\\right)$$
with $W$ the body mass and $L$ the load (kg), $V$ the speed (m/s), $G$ the grade (%) and $\\eta$ a terrain factor — about 1.0 on a paved road, 1.1 on a dirt road, 1.5 in heavy brush and 2.1 in loose sand. The speed enters as a square: walking 40 % faster costs about twice as much in that term. A 75 kg person carrying 25 kg at 1.3 m/s on the level spends about 390 W against about 300 W unloaded; up a 5 % slope about 620 W; in loose sand about 670 W. For a whole working day, average metabolic rates are usually kept to roughly a third of a person's aerobic capacity (see [[work-rest-scheduling]]).

### Settings
- **Home and civil:** shopping, luggage (wheels and telescopic handles), water and fuel carried by hand or on the head in many parts of the world.
- **Schools:** schoolbags — guidance commonly suggests no more than about 10–15 % of body mass, worn on both shoulders.
- **Workshops and construction:** plasterboard, pipes on the shoulder, buckets of mortar — trolleys and lighter packs.
- **Agriculture and field:** harvest baskets and sprayers on the back, often on slopes and soft ground.
- **Health care:** equipment bags; stretchers carried by four bearers.
- **Military:** packs, radios and equipment of 30–50 kg or more over long distances ([[load-carriage]]).

> [!warn] A load that blocks the view of the feet causes trips and falls, especially on stairs: carry it lower, split it or use a trolley. Carrying up and down stairs and ladders is far more demanding than on the level.

> [!key] Carry close to the body's centre and balanced — split loads, use both shoulders and a hip belt — keep hand-held loads to a small share of grip strength, and put anything heavy or far on wheels.
`,
  ideas: [
    'Carrying is limited by the grip, by the balance of the trunk and by energy.',
    'A one-handed load bends the trunk sideways; splitting it between two hands balances the body and halves each grip.',
    'Loads close to the body\'s centre — backpacks, double packs — cost the least energy; loads in the hands the most.',
    'Pandolf\'s equation gives the energy of walking with a load: it rises with the load, the square of the speed, the slope and the terrain.',
    'Good handles (about 19–38 mm across, 115 mm long, 50 mm clearance) make every carry easier.'
  ],
  pitfalls: [
    'If a load can be lifted, it can be carried — The grip must hold for the whole distance; a load that is fine to lift can exhaust the grip within a minute of walking.',
    'Carrying on one shoulder or in one hand is as good as two — Asymmetric loads bend the trunk sideways and load one side of the spine and back muscles.',
    'Walking faster gets it over with — Energy cost rises with the square of speed; a steady moderate pace with pauses is less tiring.'
  ],
  formulas: [
    {
      name: 'Energy of walking with a load (Pandolf)',
      expr: 'Mw = 1.5*W + 2*(W + L)*(L/W)^2 + eta*(W + L)*(1.5*V^2 + 0.35*V*G)',
      tex: 'M = 1.5\\,W + 2.0\\,(W + L)\\left(\\frac{L}{W}\\right)^2 + \\eta\\,(W + L)\\left(1.5\\,V^2 + 0.35\\,V\\,G\\right)',
      vars: {
        Mw: { name: 'metabolic rate', q: 'power', unit: 'W', tex: 'M' },
        W: { name: 'body mass', q: 'mass', unit: 'kg', value: 75, min: 35, max: 150, tex: 'W' },
        L: { name: 'load carried', q: 'mass', unit: 'kg', value: 25, min: 0, max: 80, tex: 'L' },
        V: { name: 'walking speed', q: 'speed', unit: 'm/s', value: 1.3, min: 0, max: 2.5, tex: 'V' },
        G: { name: 'grade (slope)', q: false, unit: '%', value: 3, min: 0, max: 30, tex: 'G' },
        eta: { name: 'terrain factor (1.0 road, 1.1 dirt road, 1.5 heavy brush, 2.1 loose sand)', value: 1, min: 1, max: 3, tex: '\\eta' }
      },
      note: 'Pandolf, Givoni and Goldman (1977), for loads carried on the body (a pack), walking on the level or uphill at up to about 2.5 m/s. Downhill walking needs a different correction.',
      stories: { Mw: 'A {W} person carries {L} at {V} up a {G} slope on terrain with factor {eta}. What is the metabolic rate?', V: 'A {W} person with {L} may spend {Mw} on a {G} slope (terrain {eta}). How fast can they walk?' }
    },
    {
      name: 'Grip effort of a hand-carried load',
      expr: 'f = m*g/(n*Fg)', tex: 'f = \\frac{m\\,g}{n\\,F_g}',
      vars: {
        f: { name: 'grip effort as a share of maximum', q: 'ratio', unit: '%', tex: 'f' },
        m: { name: 'load carried in the hands', q: 'mass', unit: 'kg', value: 15, tex: 'm' },
        g: { const: 'g' },
        n: { name: 'number of hands sharing it', int: true, value: 1, min: 1, max: 2, tex: 'n' },
        Fg: { name: 'maximum grip strength', q: 'force', unit: 'N', value: 290, tex: 'F_g' }
      },
      note: 'A rough estimate: in a hook grip the fingers carry about the weight per hand. Use the result with Rohmert\'s curve for the endurance time.',
      stories: { f: 'A person with a grip of {Fg} carries {m} in {n} hand(s). What share of maximum grip does that take?', m: 'To keep the grip at {f} of a {Fg} maximum with {n} hand(s), how heavy may the load be?' }
    }
  ],
  examples: [
    {
      title: 'A pack on the level, uphill and in sand',
      q: 'A 75 kg person carries a 25 kg pack at 1.3 m/s. Find the metabolic rate on a paved level road, up a 5 % slope, and on loose sand ($\\eta$ = 2.1), and compare with walking unloaded.',
      steps: [
        'Standing terms: $1.5 \\times 75 = 112.5$ W and $2 \\times 100 \\times (25/75)^2 = 22.2$ W.',
        'Level road: $100 \\times 1.5 \\times 1.3^2 = 253.5$ W; total $\\approx 388$ W. Unloaded: $112.5 + 75 \\times 2.535 = 303$ W.',
        '5 % slope: add $100 \\times 0.35 \\times 1.3 \\times 5 = 227.5$ W: $\\approx 616$ W.',
        'Loose sand: the walking term is multiplied by 2.1: $112.5 + 22.2 + 532 \\approx 667$ W.'
      ],
      a: 'About 390 W level, 620 W uphill, 670 W in sand, against 300 W unloaded.'
    },
    {
      title: 'One toolbox or two?',
      q: 'A woman with a grip strength of 290 N carries 15 kg of tools. How long could she hold it in one hand, and in two 7.5 kg boxes?',
      steps: [
        'One hand: $f = 15 \\times 9.81/290 = 0.51$; Rohmert: $T \\approx 1.1$ min — about 80 m at 1.3 m/s.',
        'Two hands: $f = 0.25$ each; $T \\approx 3.6$ min — and the trunk is balanced.',
        'For longer distances: a trolley or a backpack.'
      ],
      a: 'About 1 minute in one hand, about 3.5 minutes split between two.'
    }
  ],
  quiz: [
    { q: 'Which way of carrying 20 kg over 200 m is usually least demanding?', choices: ['In a backpack or split evenly, close to the body', 'In one hand', 'Held out in front in both arms', 'On one shoulder'], a: 0, why: 'Loads close to the body\'s centre line cost the least energy and need no grip or sideways balance.' },
    { q: 'Why does carrying a bucket in one hand tire the back?', choices: ['Its sideways moment must be balanced by the back muscles of the other side, loading the spine unevenly', 'It does not — only the arm tires', 'Buckets are always heavy', 'Walking tires the back'], a: 0, why: 'A load held 200 mm or more to the side creates a lateral moment at the lower back; the trunk leans and the opposite muscles work.' },
    { q: 'The NIOSH lifting equation gives limits for carrying.', a: false, why: 'Carrying is outside its scope; ISO 11228-1 and psychophysical tables cover it.' },
    { q: 'In the Pandolf equation, walking twice as fast multiplies the speed term by…', choices: ['About 4 (it grows with the square of speed)', '2', '1 — speed does not matter', '8'], a: 0, why: 'The term is $1.5\\,V^2$: double $V$, four times the cost in that term.' }
  ],
  problems: [
    { q: 'A 70 kg person walks at 1.2 m/s on a level paved road with a 20 kg pack. Using the Pandolf equation, what is the metabolic rate?', answer: 314, unit: 'W', tol: 0.02, steps: ['$1.5 \\times 70 = 105$ W; $2 \\times 90 \\times (20/70)^2 = 14.7$ W.', 'Walking: $90 \\times 1.5 \\times 1.2^2 = 194.4$ W.', 'Total $\\approx 314$ W.'] }
  ],
  ranges: [
    { dim: 'Load carried by hand against the body, up to about 10 m (screening value)', range: '25 kg men · 16 kg women', unit: '', who: 'most healthy adults, on the level, load held against the body at waist height', why: 'A quick filter for short carries: loads within it rarely need a detailed assessment.', limits: 'Reduce for longer distances, loads held away from the body or above the shoulder, stairs and slopes; not a safe limit for everyone.', setting: ['workshop', 'civil', 'field'], src: 'UK HSE guidance on the Manual Handling Operations Regulations 1992 (L23)' },
    { dim: 'Handle diameter on boxes, totes and cases', range: [19, 38], unit: 'mm', who: 'small to large hands, bare or gloved', why: 'A handle the hand can wrap around — the "good coupling" of the NIOSH equation.', limits: 'Gloves need the larger end; heavy loads on thin handles cut into the fingers.', setting: ['workshop', 'civil'], src: 'NIOSH Applications Manual (1994), coupling classification' },
    { dim: 'Handle length (clear width for the hand)', range: [115, null], unit: 'mm', who: 'the widest hands, with gloves', why: 'All four fingers fit side by side.', limits: 'Add width for insulated gloves.', setting: ['workshop', 'civil', 'military'], src: 'NIOSH Applications Manual (1994)' },
    { dim: 'Clearance around a handle or hand-hold', range: [50, null], unit: 'mm', who: 'large and gloved hands', why: 'Room for the fingers to curl round the handle.', limits: 'Cut-out hand-holds need a smooth edge and enough height as well.', setting: ['workshop', 'civil'], src: 'NIOSH Applications Manual (1994)' },
    { dim: 'Schoolbag mass', range: [null, 15], unit: '% of body mass', who: 'schoolchildren', why: 'Limits forward lean and discomfort on the walk to and around school.', limits: 'Guidance varies (commonly 10–15 %); lockers, digital books and wheeled bags reduce what is carried.', setting: 'school', src: 'Common paediatric and school guidance' },
    { dim: 'Soldier\'s fighting load and approach-march load', range: '≤ 30 % and ≤ 45 % of body mass', unit: '', who: 'trained soldiers, human factors only', why: 'Beyond these, mobility, endurance and the risk of injury worsen sharply.', limits: 'Often exceeded in practice; lighter equipment and vehicles or carts for stores are the real answer.', setting: 'military', src: 'US Army FM 21-18, *Foot Marches* (1990)' }
  ],
  applications: [
    'Choosing packs, handles, trolleys and split loads for field, construction and delivery work.',
    'Estimating the energy cost of carrying for work–rest planning ([the carrying calculator](#/tools/lifting/carry)).',
    'Designing products (cases, tool boxes, containers) with good handles and balanced weight.'
  ],
  history: 'The Pandolf equation (1977) grew from US Army research into the energy cost of carrying loads, extending earlier work by Givoni and Goldman; terrain factors came from Soule and Goldman. Datta and Ramanathan\'s 1971 comparison of carrying methods showed how much the way of carrying matters.',
  sources: [
    'K. B. Pandolf, B. Givoni and R. F. Goldman, "Predicting energy expenditure with loads while standing or walking very slowly", *Journal of Applied Physiology* 43 (1977).',
    'S. R. Datta and N. L. Ramanathan, "Ergonomic comparison of seven modes of carrying loads on the horizontal plane", *Ergonomics* 14 (1971).',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting and carrying*.',
    'UK Health and Safety Executive, *Manual Handling Operations Regulations 1992: guidance on regulations* (L23).',
    'US Army, FM 21-18, *Foot Marches* (1990).'
  ],
  sim: 'bh-carry'
},

{
  id: 'pushing-pulling', parent: 'lifting-topic', title: 'Pushing and pulling', level: 2,
  short: 'Trolleys, carts, pallet trucks and wheeled bins turn carrying into pushing and pulling. The force needed is rolling resistance plus slope plus acceleration: small on good wheels and hard floors, large when starting, on slopes, carpet or broken ground. ISO 11228-2 gives force limits that depend on who pushes, how far and how often.',
  keywords: ['pushing', 'pulling', 'trolley', 'cart', 'roll cage', 'pallet truck', 'rolling resistance', 'castors', 'initial force', 'sustained force', 'ISO 11228-2', 'Snook and Ciriello', 'handle height', 'floor friction', 'slip', 'slope', 'powered assistance'],
  prereq: ['strength-and-force', 'lifting-principles', 'physics:friction'],
  related: ['handling-aids', 'carrying-loads', 'patient-handling', 'material-flow-layout', 'hospital-workstations', 'ramps-accessibility', 'physics:inclined-plane'],
  body: `
Wheels take the weight off the hands, but not all the risk: pushing and pulling strain the shoulders and back, and a hard push on a slippery floor ends in a fall. The good news is that the force is simple physics, and each part of it can be designed down.

### The force a trolley needs
$$F = m g\\,(c_r\\cos\\alpha + \\sin\\alpha) + m a$$
The first term is **rolling resistance**: the coefficient $c_r$ is roughly 0.01–0.02 for good castors on a smooth hard floor, several times more on rough concrete, carpet or vinyl tiles with gaps, and 0.1 or more on grass or gravel. The second is the **slope** ([[physics:inclined-plane|an inclined plane]]): a 5 % slope ($\\sin\\alpha \\approx 0.05$) adds several times the rolling resistance of good castors. The third is **acceleration**. For a 300 kg roll cage on good castors ($c_r$ = 0.02) on the level, keeping it rolling takes about 60 N, but starting it at 0.5 m/s² takes about 210 N; up a 5 % ramp it needs about 205 N just to keep going; on poor floors ($c_r$ = 0.05) about 150 N. Starting also has to overcome wheels that stick and castors that must swivel into line, so **initial forces** are always higher than **sustained** ones — and stopping, turning and manoeuvring into tight spaces are the hardest moments of all.

### Force limits
- **UK guidance** suggests, for pushing and pulling on the level with the hands between hip and shoulder height: about **200 N (men) and 150 N (women)** to start or stop a load, about **100 N and 70 N** to keep it moving.
- **ISO 11228-2** offers two methods: tables of forces acceptable to most of a population, based on the psychophysical studies of Snook and Ciriello (1991), and a calculation from the population's strength reduced for distance, frequency and duration. Both give lower limits for women, longer distances, more frequent pushes and handles too low or too high.
- **EN 1005-3** gives the same kind of reduction for forces on machine controls.

The friction under the feet caps what anyone can push: horizontally, about $\\mu\\,m_b\\,g$. With a shoe–floor coefficient of 0.4 a 70 kg person can push about 275 N before slipping; on a wet floor at 0.2, only about 140 N.

### Designing trolleys and routes
| Element | Good practice | Why |
|---|---|---|
| Wheels | large, hard-wearing, with sealed bearings; swivel castors at one end, fixed wheels at the other; brakes | lower rolling resistance, straight running, control |
| Handles | roughly hip to elbow height (about 900–1150 mm), or vertical handles so each user chooses; hands about shoulder-width apart | the force goes straight into the body; small and tall users both fit |
| Loads | heavy items low; the view ahead clear | stability and seeing where you go |
| Floors | smooth, level, clean, no thresholds or gaps; gentle slopes | rolling resistance and slopes are the biggest forces |
| Powered help | tugs, powered pallet trucks, power-assisted beds and cages | above a few hundred kilograms or on slopes, people should not push |

Push rather than pull where possible: facing the way you go, you see ahead, lean into the load and twist less.

### Settings
- **Health care:** beds, meal and linen trolleys and wheelchairs — often several hundred kilograms with the patient; power-assisted beds and tugs ([[patient-handling]]).
- **Retail and warehouses:** roll cages and hand pallet trucks: good wheels, level docks, powered trucks for full pallets.
- **Workshops and construction:** gas-cylinder trolleys, wheelbarrows (which also need lifting), carts on broken ground.
- **Field and agriculture:** carts on soft ground, where rolling resistance can be ten times that of a warehouse floor.
- **Military:** hand-drawn carts and wheeled stretchers over rough ground.
- **Home:** supermarket trolleys, prams, wheelie bins and luggage.

In the simulation, set the mass, wheels, floor, slope and handle height, press *Push*: watch the starting peak and the rolling force against the guideline bands, and the slip limit of the floor.

> [!warn] A heavy trolley on a slope can run away: brakes, gentle slopes and never standing downhill of a load on a ramp.

> [!key] Force = rolling resistance + slope + acceleration. Good wheels, hard level floors and powered help keep starting forces within about 150–200 N and rolling forces within about 70–100 N.
`,
  ideas: [
    'The force to move a trolley is m g (c_r cos α + sin α) + m a: rolling resistance, slope and acceleration.',
    'Starting, stopping and turning need much more force than keeping a load rolling.',
    'UK guidance: about 200/150 N (men/women) to start, 100/70 N to keep moving; ISO 11228-2 reduces limits for distance, frequency and handle height.',
    'Floor friction caps the force anyone can push; wet floors halve it.',
    'Good wheels, level floors, handles between hip and elbow height and powered help are the design answers.'
  ],
  pitfalls: [
    'If it has wheels it is safe — Starting, stopping, slopes, carpets and broken floors can demand forces far above guidelines.',
    'Pulling is as good as pushing — Pulling usually means walking backwards or twisting with the arm behind; pushing lets you see and lean into the load.',
    'A stronger person can always push more — The shoe–floor friction limits the force for everyone; beyond it they slip.'
  ],
  formulas: [
    {
      name: 'Force to push a trolley',
      expr: 'F = m*g*(cr*cos(alpha) + sin(alpha)) + m*a', tex: 'F = m\\,g\\,(c_r\\cos\\alpha + \\sin\\alpha) + m\\,a',
      vars: {
        F: { name: 'push force along the floor', q: 'force', unit: 'N', tex: 'F' },
        m: { name: 'total mass of trolley and load', q: 'mass', unit: 'kg', value: 300, tex: 'm' },
        g: { const: 'g' },
        cr: { name: 'rolling-resistance coefficient', value: 0.02, min: 0.001, max: 0.3, tex: 'c_r' },
        alpha: { name: 'slope angle', q: 'angle', unit: '°', value: 2, min: 0, max: 15, tex: '\\alpha' },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 0.2, tex: 'a' }
      },
      note: 'Uphill or on the level; starting also needs the wheels and castors to break away, so real initial forces are higher. A slope of p % is an angle of about arctan(p/100).',
      stories: { F: 'A {m} trolley on castors with {cr} is pushed up a {alpha} slope, accelerating at {a}. What force is needed?', m: 'A worker may push with {F}. On a {alpha} slope with {cr}, accelerating at {a}, what mass can be moved?' }
    },
    {
      name: 'The slip limit: most horizontal force before the feet slide',
      expr: 'Fs = mu*mb*g', tex: 'F_s = \\mu\\,m_b\\,g',
      vars: {
        Fs: { name: 'largest horizontal force without slipping', q: 'force', unit: 'N', tex: 'F_s' },
        mu: { name: 'shoe–floor friction coefficient', value: 0.4, min: 0.05, max: 1, tex: '\\mu' },
        mb: { name: 'body mass of the person pushing', q: 'mass', unit: 'kg', value: 70, tex: 'm_b' },
        g: { const: 'g' }
      },
      note: 'For a horizontal push with the vertical force equal to body weight; pushing slightly downwards adds grip, pulling upwards removes it.',
      stories: { Fs: 'A {mb} person on a floor with friction {mu}: how hard can they push before slipping?', mu: 'What friction coefficient lets a {mb} person push {Fs} without slipping?' }
    }
  ],
  examples: [
    {
      title: 'A roll cage in a supermarket',
      q: 'A roll cage and its load weigh 300 kg on castors with $c_r$ = 0.02. Find the force to keep it rolling on the level, to start it at 0.5 m/s², and to keep it rolling up a 5 % ramp.',
      steps: [
        'Rolling: $300 \\times 9.81 \\times 0.02 = 59$ N — within the 70 N guideline for women.',
        'Starting: $59 + 300 \\times 0.5 = 209$ N — above 150 N for women and at 200 N for men (plus breakaway).',
        'Ramp: $\\alpha = \\arctan 0.05 = 2.86°$: $300 \\times 9.81 \\times (0.02 \\times 0.999 + 0.0499) = 206$ N — too much to keep up for any distance: powered help or a lighter load.'
      ],
      a: 'About 59 N rolling, 209 N starting, 206 N up a 5 % ramp.'
    },
    {
      title: 'The wet floor',
      q: 'A 70 kg worker must start the same cage with 209 N. Can they do it on a dry floor ($\\mu$ = 0.4) and on a wet one ($\\mu$ = 0.2)?',
      steps: [
        'Dry: $F_s = 0.4 \\times 70 \\times 9.81 = 275$ N > 209 N — possible.',
        'Wet: $F_s = 0.2 \\times 70 \\times 9.81 = 137$ N < 209 N — the feet slip first.'
      ],
      a: 'Dry yes; wet no — clean and dry floors are part of the handling design.'
    }
  ],
  quiz: [
    { q: 'What sets the force needed to keep a trolley rolling on a level floor?', choices: ['Rolling resistance: mass × g × the rolling coefficient', 'The mass alone, as if lifting it', 'The handle height', 'The square of the speed'], a: 0, why: 'On the level at steady speed only rolling resistance remains: $m g c_r$, typically 1–2 % of the weight on good wheels.' },
    { q: 'Why is pushing usually preferred to pulling?', choices: ['You face the way you go, see ahead and lean into the load with less twisting', 'Pulling always needs less force', 'Pushing needs no grip', 'There is no difference'], a: 0, why: 'Pulling often means walking backwards or twisting with an arm behind the body.' },
    { q: 'A 5 % slope adds about the same force as the rolling resistance of good castors on the level.', a: false, why: 'A 5 % slope adds about 5 % of the weight; good castors resist with only 1–2 %: the slope adds several times more.' },
    { q: 'Where is the best handle height for pushing?', choices: ['Roughly between hip and elbow height — or vertical handles so each user chooses', 'At knee height', 'At shoulder height', 'Overhead'], a: 0, why: 'The force then runs roughly horizontally into the trunk without bending or raising the arms.' }
  ],
  problems: [
    { q: 'A 200 kg trolley with $c_r$ = 0.015 is pushed at steady speed up a 3° slope. What force is needed?', answer: 132, unit: 'N', tol: 0.02, steps: ['$F = 200 \\times 9.81 \\times (0.015 \\cos 3° + \\sin 3°)$.', '$= 1962 \\times (0.0150 + 0.0523) = 132$ N.'] }
  ],
  ranges: [
    { dim: 'Force to start or stop a load (occasional, on the level)', range: '≤ about 200 N men · 150 N women', unit: '', who: 'most healthy adults, handles between hip and shoulder height', why: 'Keeps peak forces on the shoulders and back within what most people accept.', limits: 'Lower for frequent pushing, long distances, poor handles, slopes and wet floors; ISO 11228-2 gives the detailed method.', setting: ['workshop', 'health', 'civil'], src: 'UK HSE guidance on the Manual Handling Operations Regulations 1992 (L23)' },
    { dim: 'Force to keep a load moving', range: '≤ about 100 N men · 70 N women', unit: '', who: 'most healthy adults', why: 'Sustained force over the whole distance, without undue fatigue.', limits: 'Reduce for long distances and frequent trips; guideline values, not safe limits for everyone.', setting: ['workshop', 'health', 'civil'], src: 'UK HSE guidance on the Manual Handling Operations Regulations 1992 (L23)' },
    { dim: 'Push-handle height', range: [900, 1150], unit: 'mm', who: 'roughly the hip-to-elbow band of small women to large men, with shoes', why: 'The push runs horizontally into the body with the arms low and the trunk upright.', limits: 'No single height fits all: vertical or multiple handles let each user choose.', setting: ['workshop', 'health', 'civil'], src: 'Pheasant and Haslegrave, *Bodyspace*; ISO 11228-2' },
    { dim: 'Rolling-resistance coefficient to aim for (good wheels, hard floor)', range: [0.01, 0.02], unit: '', who: 'trolleys moved by hand', why: 'Keeps rolling forces to 1–2 % of the load\'s weight.', limits: 'Carpet, rough or broken floors, soft ground and worn wheels raise it several times; starting needs more.', setting: ['workshop', 'health'], src: 'Typical values for industrial castors on hard floors' },
    { dim: 'Shoe–floor friction coefficient for pushing work', range: [0.4, null], unit: '', who: 'everyone pushing or pulling', why: 'Lets a 70 kg person exert about 275 N horizontally without slipping.', limits: 'Wet, oily or dusty floors can halve it; footwear matters as much as the floor.', setting: ['workshop', 'health', 'field'], src: 'Slip-resistance practice; NIOSH Applications Manual (1994)' }
  ],
  applications: [
    'Specifying wheels, handles and brakes for trolleys, cages and beds.',
    'Planning routes: level floors, no thresholds, gentle slopes, powered tugs where loads are heavy.',
    'Setting maximum loads for hand-pushed equipment in hospitals, retail and warehouses.'
  ],
  history: 'Stover Snook and colleagues at the Liberty Mutual Research Institute measured the forces and weights workers found acceptable for pushing, pulling, lifting and carrying from the 1960s; their revised tables (Snook and Ciriello, 1991) underlie ISO 11228-2 (2007).',
  sources: [
    'ISO 11228-2, *Ergonomics — Manual handling — Part 2: Pushing and pulling*.',
    'S. H. Snook and V. M. Ciriello, "The design of manual handling tasks: revised tables of maximum acceptable weights and forces", *Ergonomics* 34 (1991).',
    'UK Health and Safety Executive, *Manual Handling Operations Regulations 1992: guidance on regulations* (L23).',
    'EN 1005-3, *Safety of machinery — Human physical performance — Part 3: Recommended force limits for machinery operation*.'
  ],
  sim: 'bh-trolley'
},

{
  id: 'team-lifting', parent: 'lifting-topic', title: 'Team lifting', level: 2,
  short: 'When a load is too heavy or bulky for one person, two or more share it — but rarely equally and never perfectly. A team of two can handle about two-thirds of the sum of their individual capacities, a team of three about half; each person\'s share depends on where they hold, on slopes and stairs and on the heights of the lifters.',
  keywords: ['team lifting', 'two-person lift', 'team handling', 'load sharing', 'lever rule', 'stairs', 'coordination', 'furniture removal', 'stretcher', 'plasterboard', 'team capacity', 'MIL-STD-1472', 'statically indeterminate'],
  prereq: ['lifting-principles', 'niosh-lifting-equation', 'physics:static-equilibrium'],
  related: ['handling-aids', 'carrying-loads', 'patient-handling', 'construction-ergonomics', 'military-human-factors', 'lifting-index-risk', 'sex-differences'],
  body: `
Team lifting is everywhere: furniture carried up stairs, plasterboard and glass on building sites, beams and pipes in workshops, stretchers, stores and equipment. It is a sensible answer when an aid is impractical, but it brings risks of its own. Shares are unequal; if one person stumbles, lets go or lifts early, the whole load shifts suddenly onto the others; the view is blocked; the lifters differ in height and strength; and nobody may be in charge.

### How much a team can lift
Teams are less than the sum of their members. UK guidance suggests a team of **two** should handle no more than about **two-thirds** of the sum of their individual capacities, and a team of **three** about **half** — because shares are uneven, movements are not perfectly in step, and each person has less freedom to place their feet and keep the load close. Two people who could each lift 25 kg should together lift about 33 kg, not 50 kg. Military standards such as MIL-STD-1472 give design weight limits for one-person and two-person lifts of equipment, lower where the users include women as well as men.

### Who carries what: the lever rule
For two people holding a rigid load at positions $x_1$ and $x_2$, with its centre of mass at $x_c$, moments give each share:
$$F_1 = W\\,\\frac{x_2 - x_c}{x_2 - x_1}, \\qquad F_2 = W - F_1$$
The person nearer the centre of mass carries more. A load carried on a slope or on stairs tilts, and if its centre of mass lies above the line of the grips it moves horizontally towards the lower end: **the person below carries more**. A wardrobe 1.8 m long and 0.6 m deep, lying on its back and carried by its ends up a 30° stair, puts about 60 % of its weight on the person below and 40 % on the one above.

With three or more people the load is statically indeterminate: the shares depend on how high each person holds and how much their arms give. A tall person among short ones — or anyone whose hands are higher — ends up carrying more, and someone whose hands are lower may carry almost nothing. In the simulation, place up to four people along a load, choose their sizes, tilt it as on a stair and watch the arrows: the lever rule for two, springy arms for three and four.

### Good practice
- **Plan and lead:** one person plans the route, checks the grip points and calls the lift ("ready — lift"); everyone knows where the load is going and where it can be set down.
- **Match the team:** similar heights and capabilities; the stronger or taller person where the load will be heaviest (the lower end on stairs).
- **Good grips:** handles, straps or carrying clamps; gloves that grip.
- **Space and route:** clear, dry, wide enough for everyone's feet; rest points on long carries.
- **Keep teams small** — two or three work best; larger loads call for aids ([[handling-aids]]).

### Settings
- **Home and civil:** removals, furniture on stairs — stair-climbing trolleys help.
- **Construction:** glass panels, kerbs, steel sections, full sheets of plasterboard; vacuum lifters and panel trolleys remove many team lifts.
- **Health care:** people are moved with hoists and slide sheets, not by teams lifting bodily ([[patient-handling]]); stretchers are carried by four or more.
- **Military:** equipment designed for one- or two-person handling, with handles and marked weights; stretchers over rough ground.
- **Field:** canoes, generators, pumps and survey equipment carried by teams.

> [!warn] If one member of a team lets go, the others take the whole load suddenly. Agree a signal to stop and set down, and never team-lift a load that the team could not safely lower if one person slipped.

> [!key] Teams lift less than the sum of their members — about two-thirds for two, half for three — and the shares are rarely equal: the person nearer the centre of mass, lower on a stair, or holding higher carries more.
`,
  ideas: [
    'A team of two can handle about two-thirds, a team of three about half, of the sum of their individual capacities.',
    'For two people the lever rule gives each share: the one nearer the centre of mass carries more.',
    'On stairs and slopes a load whose centre of mass is above the grips puts more weight on the person below.',
    'With three or more people the shares depend on hand heights and how the arms give; a taller person carries more.',
    'Plan, lead, match the team and keep it small — and use aids for heavy or frequent loads.'
  ],
  pitfalls: [
    'Two people lift twice as much — Uneven shares and imperfect coordination cut team capacity to about two-thirds of the sum.',
    'In a team of four each carries a quarter — The shares depend on grip positions, hand heights and the load\'s shape; one person may carry far more.',
    'More people make a lift safer — Large teams coordinate poorly and crowd each other; beyond two or three, use a handling aid.'
  ],
  formulas: [
    {
      name: 'What a team can handle',
      expr: 'Lt = r*S', tex: 'L_t = r\\,S',
      vars: {
        Lt: { name: 'recommended team load', q: 'mass', unit: 'kg', tex: 'L_t' },
        r: { name: 'team factor (about 67 % for two, 50 % for three)', q: 'ratio', unit: '%', value: 67, min: 0, max: 100, tex: 'r' },
        S: { name: 'sum of the members\' individual capacities', q: 'mass', unit: 'kg', value: 50, tex: 'S' }
      },
      note: 'UK guidance for team handling; the individual capacities are those for the same lift done alone.',
      stories: { Lt: 'Two people whose individual capacities add to {S} lift together with a team factor of {r}. What should the team lift at most?' }
    },
    {
      name: 'Share of the first of two lifters (the lever rule)',
      expr: 'F1 = W*(x2 - xc)/(x2 - x1)', tex: 'F_1 = W\\,\\frac{x_2 - x_c}{x_2 - x_1}',
      vars: {
        F1: { name: 'force carried by the first person', q: 'force', unit: 'N', tex: 'F_1' },
        W: { name: 'weight of the load', q: 'force', unit: 'N', value: 785, tex: 'W' },
        x1: { name: 'horizontal position of the first person\'s grip', q: 'length', unit: 'mm', value: 100, tex: 'x_1' },
        x2: { name: 'horizontal position of the second person\'s grip', q: 'length', unit: 'mm', value: 1900, tex: 'x_2' },
        xc: { name: 'horizontal position of the load\'s centre of mass', q: 'length', unit: 'mm', value: 900, tex: 'x_c' }
      },
      note: 'Rigid load, vertical forces. On a slope, use horizontal positions: the centre of mass moves by its height above the grip line times the sine of the tilt.',
      stories: { F1: 'A load of weight {W} is held at {x1} and {x2}; its centre of mass is at {xc}. How much does the first person carry?', xc: 'Where must the centre of mass be for the first person (at {x1}) to carry {F1} of a {W} load held also at {x2}?' }
    }
  ],
  examples: [
    {
      title: 'A wardrobe on the stairs',
      q: 'An 80 kg wardrobe, 1.8 m long and 0.6 m deep, lies on its back and is carried by its two ends up a 30° stair. Its centre of mass is at the middle, 0.3 m above the line of the grips. How is the weight shared?',
      steps: [
        'Horizontal positions: lower grip at 0, upper grip at $1.8 \\cos 30° = 1.559$ m.',
        'Centre of mass: $0.9 \\cos 30° - 0.3 \\sin 30° = 0.779 - 0.150 = 0.629$ m from the lower grip.',
        'Lower person: $80 \\times (1.559 - 0.629)/1.559 = 47.7$ kg; upper person: 32.3 kg.',
        'On the level it would be 40 kg each: the stair moves 7.7 kg onto the person below.'
      ],
      a: 'About 48 kg below and 32 kg above.'
    },
    {
      title: 'Team capacities',
      q: 'A man and a woman whose individual capacities for a lift are 25 kg and 16 kg team up. What may they lift together? And a team of three with 25, 25 and 16 kg?',
      steps: [
        'Two: $0.67 \\times (25 + 16) = 27$ kg.',
        'Three: $0.5 \\times (25 + 25 + 16) = 33$ kg.'
      ],
      a: 'About 27 kg for the pair, 33 kg for the three.'
    }
  ],
  quiz: [
    { q: 'Two people who can each lift 25 kg team up. About how much should they lift together?', choices: ['About 33 kg', '50 kg', '25 kg', '75 kg'], a: 0, why: 'About two-thirds of the sum: $0.67 \\times 50 = 33$ kg.' },
    { q: 'Carrying a wardrobe up the stairs, who carries more?', choices: ['The person below', 'The person above', 'They carry equal shares', 'Whoever is stronger'], a: 0, why: 'Its centre of mass, above the grip line, moves horizontally towards the lower end when the load tilts.' },
    { q: 'In a team of four holding a rigid load, each person carries a quarter.', a: false, why: 'The load is statically indeterminate: hand heights, grip positions and how the arms give decide the shares.' },
    { q: 'What improves a team lift most?', choices: ['A leader who plans and calls the lift, members of similar height, good grips and a clear route', 'Adding more people', 'Lifting faster', 'Gloves alone'], a: 0, why: 'Coordination and matching reduce uneven and sudden loading; more people make coordination harder.' }
  ],
  problems: [
    { q: 'Two people hold a beam at 200 mm and 2000 mm from one end; its weight, 600 N, acts at 800 mm. How much does the person at 200 mm carry?', answer: 400, unit: 'N', tol: 0.01, steps: ['$F_1 = 600 \\times (2000 - 800)/(2000 - 200) = 600 \\times 1200/1800 = 400$ N.', 'The other carries 200 N.'] }
  ],
  ranges: [
    { dim: 'Team of two: load as a share of the sum of individual capacities', range: [null, 67], unit: '%', who: 'two people lifting together', why: 'Allows for unequal shares and imperfect coordination.', limits: 'Assumes matched, trained lifters with good grips and space; on stairs or with bulky loads the share of one person can be much larger.', setting: ['workshop', 'civil', 'field', 'military'], src: 'UK HSE guidance on the Manual Handling Operations Regulations 1992 (L23)' },
    { dim: 'Team of three: load as a share of the sum of individual capacities', range: [null, 50], unit: '%', who: 'three people lifting together', why: 'Shares grow more uneven and coordination harder with more people.', limits: 'Beyond three, handling aids are usually safer than bigger teams.', setting: ['workshop', 'civil', 'field', 'military'], src: 'UK HSE guidance on the Manual Handling Operations Regulations 1992 (L23)' }
  ],
  applications: [
    'Planning removals, glazing and construction lifts with the right team and equipment.',
    'Designing equipment and packaging for one- or two-person handling, with handles and marked weights.',
    'Choosing who goes where on stairs and slopes.'
  ],
  history: 'Rules for team handling grew from military and industrial practice. Human-engineering standards such as MIL-STD-1472 give design weight limits for one- and two-person lifts of equipment, and the UK guidance on the 1992 Manual Handling Operations Regulations introduced the simple team factors used today.',
  sources: [
    'UK Health and Safety Executive, *Manual Handling Operations Regulations 1992: guidance on regulations* (L23) — team handling.',
    'MIL-STD-1472, *Human Engineering*, US Department of Defense — design weight limits for lifting and carrying.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace* — manual handling.'
  ],
  sim: 'bh-team'
},

{
  id: 'handling-aids', parent: 'lifting-topic', title: 'Handling aids and exoskeletons', level: 2,
  short: 'The surest way to reduce handling risk is to take the load off the person: lift tables and turntables bring work to the right height, trolleys and conveyors do the carrying, hoists, balancers and vacuum lifters take the weight, and exoskeletons share part of the load with the body. Each aid has limits — speed, space, training, maintenance — and works only if it is designed into the job.',
  keywords: ['handling aids', 'mechanical aids', 'lift table', 'pallet leveller', 'turntable', 'conveyor', 'trolley', 'hoist', 'chain block', 'jib crane', 'balancer', 'manipulator', 'vacuum tube lifter', 'patient hoist', 'slide sheet', 'exoskeleton', 'exosuit', 'LOLER', 'engineering controls'],
  prereq: ['lifting-principles', 'lifting-index-risk', 'pushing-pulling'],
  related: ['team-lifting', 'patient-handling', 'material-flow-layout', 'machine-ergonomics-principles', 'ergonomics-productivity', 'participatory-ergonomics', 'pneumatics:vacuum-handling', 'hydraulics:lifts-cranes', 'motors:motors-conveyors-hoists'],
  body: `
The hierarchy of control puts engineering first: **eliminate** the handling (automate, or change the flow so the load never needs lifting), **mechanise** it with an aid, and only then **reduce** what remains by organization and training. An aid works whatever the lifter's technique, strength or tiredness — as long as it is there, suits the task and is used.

### A catalogue of aids
| Aid | What it takes away | Good for | Limitations |
|---|---|---|---|
| Lift tables, pallet levellers, tilting bins | bending low, reaching into deep bins | pallet building and unpicking, machine loading | floor space; pinch points; must be adjusted as the stack changes |
| Turntables | reaching to the far side of a pallet | pallets, large parts | space |
| Conveyors, roller tracks, chutes | carrying and lifting between stations | production and packing lines | fixed layout; guarding and noise |
| Trolleys, pallet trucks, powered tugs | carrying | moves of more than a few metres | floors, slopes and starting forces ([[pushing-pulling]]) |
| Hoists, jib and gantry cranes | the whole weight | heavy parts, engines, dies | slow; lifting points; inspection and training |
| Balancers, manipulators, tool supports | the weight of tools and parts, leaving only guiding | repeated handling of the same item | must be set to the load; limited reach |
| Vacuum tube lifters and grippers | weight and grip | cartons, sacks, panels, glass, kerbs | the surface must seal; porous loads leak ([[pneumatics:vacuum-handling]]) |
| Patient hoists, slide sheets, standing aids | lifting people | transfers and repositioning | training, space, time, dignity ([[patient-handling]]) |
| Exoskeletons (passive or powered) | part of the moment at the back or shoulders | repeated bending, overhead work | modest help; fit, heat and comfort; may move load elsewhere |

### The physics of an aid
A **hoist** with $n$ falls of rope trades force for distance: the operator pulls
$$F = \\frac{m g}{n\\,\\eta}$$
and hauls $n$ metres of rope for each metre of lift. With four falls and an efficiency of 90 %, 100 kg needs about 270 N — still above the guideline for sustained pulling — so chain blocks add gearing and frequent lifts need powered hoists. A **balancer** set to the load leaves the operator only acceleration and friction: guiding a balanced 25 kg part at 0.3 m/s² takes about 7.5 N; set for 20 kg it needs about 49 N more just to hold. A **lift table** that keeps the working layer near 75 cm removes the vertical and distance penalties of the NIOSH equation; with a turntable it cuts the horizontal reach too ([[lifting-index-risk]]).

### Exoskeletons
Passive exoskeletons store energy in springs as the wearer bends or raises the arms and give some of it back as support; powered ones add motors. In laboratory and field studies of bending and overhead tasks, reviewers (de Looze and colleagues, 2016) found reductions in the activity of the supported muscles of the order of 10–40 %. They do not make a lift acceptable: they can hinder walking and climbing, press on the thighs and chest, add heat and mass, and move load to other parts of the body; long-term effects are still being studied and test standards are being developed (for example by the ASTM F48 committee). They are a complement where the task cannot be redesigned, not a substitute for redesign.

### Making aids work
Aids left in a corner help nobody. They are used when they are **where the work is**, **as fast** or nearly as fast as lifting by hand, **suited** to the loads, **ready** (charged, maintained, the right slings and grippers at hand) and chosen **with the users** ([[participatory-ergonomics]]). Lifting equipment needs rated capacities, inspection and trained users (in the UK under LOLER 1998; elsewhere under national rules and machinery legislation). The costs are usually repaid by fewer injuries and faster, steadier work ([[ergonomics-productivity]]).

### Settings
- **Warehouses:** vacuum lifters for cartons and sacks, pallet levellers and turntables, conveyors to the truck.
- **Workshops:** jib cranes over machines, balancers for heavy tools, manipulators for parts.
- **Health care:** ceiling and mobile hoists, slide sheets and powered beds; under ideal conditions no more than about 16 kg of a patient should be lifted by hand (Waters, 2007).
- **Construction and field:** vacuum lifters for glass and kerbs, block grabs, mini-cranes, powered barrows.
- **Military:** vehicle cranes and load-handling systems for stores and equipment (human factors only).
- **Home:** stair-climbing trolleys, wheeled bins, lifting aids for carers at home.

In the simulation, lift a load with a hoist of one to eight falls or guide it on a balancer, and compare the operator's force with the pushing and pulling guidelines.

> [!warn] Lifting equipment must be rated for the load, inspected and used by trained people; never stand under a suspended load.

> [!key] Take the load off the person: bring the work to the right height, put it on wheels, hang it on a hoist or balancer. Aids work only if they are designed into the job — and exoskeletons help at the margin, never instead of redesign.
`,
  ideas: [
    'Engineering controls come first: eliminate the handling, then mechanise it, then reduce what remains.',
    'Lift tables, turntables and levellers remove bending and reaching; trolleys and conveyors remove carrying; hoists, balancers and vacuum lifters remove the weight.',
    'A hoist with n falls cuts the pull to m g/(nη) but multiplies the rope hauled by n; a balancer set to the load leaves only guiding.',
    'Exoskeletons reduce supported-muscle activity by about 10–40 % in studies, but do not make a bad task acceptable.',
    'Aids are used when they are close, quick, suited, ready and chosen with the users.'
  ],
  pitfalls: [
    'Buying an aid solves the problem — Slow, distant or ill-suited aids are bypassed; the aid must fit the workflow and the users.',
    'An exoskeleton makes any lift safe — Studies show partial reductions in muscle activity for particular tasks; loads move elsewhere and the task still needs redesign.',
    'A hoist removes all force — A manual hoist trades force for rope pulled; heavy or frequent lifts still need gearing or power.'
  ],
  formulas: [
    {
      name: 'Pull on a rope hoist',
      expr: 'F = m*g/(n*eta)', tex: 'F = \\frac{m\\,g}{n\\,\\eta}',
      vars: {
        F: { name: 'pull on the hauling rope', q: 'force', unit: 'N', tex: 'F' },
        m: { name: 'mass lifted', q: 'mass', unit: 'kg', value: 100, tex: 'm' },
        g: { const: 'g' },
        n: { name: 'number of falls (rope parts supporting the load)', int: true, value: 4, min: 1, max: 12, tex: 'n' },
        eta: { name: 'overall efficiency of the sheaves', q: 'ratio', unit: '%', value: 90, min: 30, max: 100, tex: '\\eta' }
      },
      note: 'Steady lifting; the rope hauled is n times the height lifted. Chain blocks add gearing, so their hand-chain pull is much lower.',
      stories: { F: 'A hoist with {n} falls and an efficiency of {eta} lifts {m}. What pull is needed?', n: 'How many falls are needed to lift {m} with a pull of {F} at an efficiency of {eta}?' }
    },
    {
      name: 'Operator force on a balancer',
      expr: 'F = abs(m - mb)*g + m*a', tex: 'F = \\left|m - m_b\\right| g + m\\,a',
      vars: {
        F: { name: 'force the operator applies', q: 'force', unit: 'N', tex: 'F' },
        m: { name: 'mass of the load', q: 'mass', unit: 'kg', value: 25, min: 0, max: 500, tex: 'm' },
        mb: { name: 'mass the balancer is set for', q: 'mass', unit: 'kg', value: 20, min: 0, max: 500, tex: 'm_b' },
        g: { const: 'g' },
        a: { name: 'acceleration given to the load', q: 'accel', unit: 'm/s²', value: 0.3, tex: 'a' }
      },
      note: 'Friction in the balancer and hoses adds a little more. A balancer set to the actual load leaves only m a.',
      stories: { F: 'A balancer set for {mb} holds a {m} part, which the operator moves with an acceleration of {a}. What force is needed?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a hoist',
      q: 'A 100 kg motor must be lifted 1.2 m. What pull does a rope hoist need with 4 falls (efficiency 90 %), and with 6 falls? How much rope is hauled?',
      steps: [
        '4 falls: $F = 100 \\times 9.81/(4 \\times 0.9) = 272$ N; rope hauled $4 \\times 1.2 = 4.8$ m.',
        '6 falls: $F = 981/(6 \\times 0.9) = 182$ N; rope $7.2$ m.',
        'Both exceed the sustained-pull guidelines (about 70–100 N): use a geared chain block or an electric hoist.'
      ],
      a: 'About 270 N or 180 N — use a geared or powered hoist.'
    },
    {
      title: 'A balancer set for the wrong part',
      q: 'A pneumatic balancer is set for a 20 kg part, but the operator handles a 25 kg part with an acceleration of 0.3 m/s². What force is needed, and what if it is reset to 25 kg?',
      steps: [
        'Mis-set: $F = 5 \\times 9.81 + 25 \\times 0.3 = 49 + 7.5 = 56.5$ N, held with every move.',
        'Reset: $F = 0 + 7.5 = 7.5$ N plus a little friction.'
      ],
      a: 'About 57 N mis-set, about 8 N when set to the load — balancers with automatic load sensing avoid the mistake.'
    }
  ],
  quiz: [
    { q: 'Which is the most effective way to reduce manual handling risk?', choices: ['Remove the manual lift by redesign or a mechanical aid', 'Training in lifting technique', 'Back belts', 'Hiring strong workers'], a: 0, why: 'Engineering controls act on every lift regardless of technique, strength or fatigue.' },
    { q: 'A rope hoist with 4 falls lifts 100 kg. The operator pulls…', choices: ['About a quarter of the weight (a little more for friction) over four times the distance', 'The full weight', 'Nothing', 'Four times the weight'], a: 0, why: '$F = mg/(n\\eta)$: force is divided by the falls, distance multiplied — the work is the same.' },
    { q: 'Wearing an exoskeleton makes any lift acceptable.', a: false, why: 'Studies show partial reductions in supported-muscle activity for particular tasks; the task still needs to meet the limits.' },
    { q: 'Why do handling aids often stand unused?', choices: ['They are slow, far from the task, not ready or unsuited — they must be designed into the work with the users', 'Workers are careless', 'Aids are more dangerous than lifting', 'They are too cheap to matter'], a: 0, why: 'Use follows convenience: place, speed, readiness and fit decide whether an aid is used.' }
  ],
  problems: [
    { q: 'A 150 kg load is lifted with a 6-fall rope hoist of 85 % efficiency. What pull is needed?', answer: 288.5, unit: 'N', tol: 0.02, steps: ['$F = 150 \\times 9.81/(6 \\times 0.85) = 1471.5/5.1 = 288.5$ N.'] }
  ],
  ranges: [
    { dim: 'When a mechanical aid should be provided', range: 'LI above 1; loads above about 20–25 kg handled often; any lift of a person', unit: '', who: 'handling tasks that cannot be eliminated', why: 'Beyond these, manual handling carries an increased risk for many workers.', limits: 'Lower thresholds for mixed, young or older workforces; aids need space, maintenance and training.', setting: ['workshop', 'health', 'field', 'military'], src: 'NIOSH Applications Manual (1994); Waters (2007); ISO 11228-1' },
    { dim: 'Working height held by a lift table or pallet leveller', range: [750, 1000], unit: 'mm', who: 'between the knuckle height of tall men and the elbow height of small women, with shoes', why: 'Keeps each layer in the zone where the NIOSH vertical and distance multipliers are near 1.', limits: 'Must be adjusted as the stack changes (spring levellers do it automatically); pinch points need guarding.', setting: ['workshop'], src: 'Revised NIOSH lifting equation; lifting-principles guidance' },
    { dim: 'Guiding force on a balanced or suspended load', range: [null, 70], unit: 'N', who: 'operators of balancers, manipulators, vacuum lifters and hoists', why: 'Keeps guiding within the sustained push–pull guideline for most women, so the aid is easier than lifting.', limits: 'Starting and stopping heavy suspended loads needs more; slow the motion or add power.', setting: 'workshop', src: 'Derived from UK HSE push–pull guideline values (L23)' },
    { dim: 'Reduction of supported-muscle activity with an exoskeleton', range: '≈ 10–40 %', unit: '', who: 'workers in studied bending and overhead tasks', why: 'Shows the size of the benefit to expect in suitable tasks.', limits: 'Task-specific; loads can move elsewhere; comfort, heat and long-term effects need checking in trials.', setting: ['workshop', 'health'], src: 'de Looze et al. (2016)' }
  ],
  applications: [
    'Selecting aids for warehouses, workshops, hospitals and building sites, and placing them in the workflow.',
    'Specifying hoists, balancers and vacuum lifters with the operator\'s force in mind.',
    'Planning safe patient handling with hoists and slide sheets.'
  ],
  history: 'Cranes and hoists are ancient; their deliberate use to protect workers\' backs grew with occupational biomechanics in the 1970s–90s. Vacuum tube lifters, pneumatic balancers and powered hoists spread through industry in the late 20th century, "safe patient handling" programmes replaced manual lifting of patients in many hospitals, and industrial exoskeletons appeared in the 2010s.',
  sources: [
    'M. P. de Looze et al., "Exoskeletons for industrial application and their potential effects on physical work load", *Ergonomics* 59 (2016).',
    'UK Health and Safety Executive, *Manual Handling Operations Regulations 1992: guidance on regulations* (L23); *Lifting Operations and Lifting Equipment Regulations 1998* (LOLER).',
    'T. R. Waters, "When is it safe to manually lift a patient?", *American Journal of Nursing* 107 (2007).',
    'ISO 11228-1, *Ergonomics — Manual handling — Part 1: Lifting and carrying*.'
  ],
  sim: ['bh-hoist', { id: 'bh-pallet-li', params: { aids: true }, title: 'A lift table and a turntable at the pallet' }]
}

);
