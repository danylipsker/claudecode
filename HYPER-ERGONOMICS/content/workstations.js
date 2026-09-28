/* HYPER-ERGONOMICS · content/workstations.js — the seated workstation and the layout of offices, meeting rooms and
 * control rooms: the office chair, desk height, sitting and standing, the screen, keyboards and mice, laptops and tablets,
 * visual ergonomics, reach zones, office layout, meeting rooms and classrooms, control rooms.
 * Simulations in sims/workstations.js (ids ws-…). Body sizes are this app's representative adult body data. */
Hyper.add(

{
  id: 'office-chair', parent: 'seated-work', title: 'The office chair', level: 1,
  short: 'A good office chair is a set of adjustments sized from the body: seat height from the back of the knee, seat depth from the thigh, width from the hips, a backrest that fills the small of the back and armrests at elbow height — each with a range that spans the smallest and the largest users.',
  keywords: ['office chair', 'task chair', 'seat height', 'seat depth', 'seat width', 'lumbar support', 'backrest', 'recline', 'armrests', 'EN 1335', 'gas lift', 'synchro mechanism', 'footrest', 'popliteal height', 'buttock–popliteal length', 'sitting posture'],
  prereq: ['sitting-dimensions', 'design-for-range', 'neutral-postures'],
  related: ['desk-height', 'sit-stand-work', 'keyboard-mouse', 'spinal-loading', 'static-muscle-work', 'dining-tables-chairs', 'vehicle-seating', 'school-furniture', 'combining-percentiles', 'control-rooms'],
  body: `
A chair decides the posture of everyone who works at a desk. It carries most of the body's weight through two small bony points in the buttocks, the ischial tuberosities, and it sets the angles of the hips, the knees and the lower back for hours at a time. A good office chair is not one shape but **a set of adjustments**, each sized from a body dimension.

### Seat height — from the back of the knee
The seat should be about as high as the **popliteal height** (the floor to the underside of the thigh just behind the knee) plus the shoe. With the representative data of this app — $405 \\pm 26$ mm for women and $445 \\pm 28$ mm for men, a [[?gaussian|normal spread]] around each [[?mean]] — the ideal seat runs from about **387 mm** for the 5th-percentile woman to **516 mm** for the 95th-percentile man. That is why EN 1335-1 asks work chairs to adjust over at least **400–510 mm**.

- **Too high:** the front edge presses under the thighs, where vessels and nerves run behind the knee; the feet dangle or rest on tiptoe, and people perch forward, off the backrest.
- **Too low:** the knees rise above the hips, the weight moves back onto the sitting bones, the pelvis rolls backwards and the lower back flattens into a slump.

### Seat depth — from the thigh
The seat must be shorter than the thigh, or the user cannot sit back against the backrest. Leave **50–100 mm (two to four fingers)** between the front edge and the back of the knee. Both ends of the population limit it: the 5th-percentile woman's buttock–popliteal length is about 439 mm, so for her the seat may be no deeper than about 390 mm; the 95th-percentile man's is about 546 mm, and he is well supported only by 480–500 mm. A fixed seat near 420–440 mm is a compromise; a **seat slide** fits both.

### Width and armrests — from the hips and the elbows
Hip breadth sitting is one dimension where **women are the larger group**: the 95th-percentile woman measures about 451 mm, so a seat of 450–520 mm, with clothing, fits nearly everybody. Armrests carry the weight of the forearms and relax the shoulders — if they sit at **elbow rest height**, about 190 mm above the seat for a small woman and 295 mm for a large man. Too high, they hunch the shoulders; too low, the user leans sideways; too long or too wide, they keep the chair from the desk or spread the elbows.

### The backrest and the lumbar support
Seated, the pelvis tends to roll back and the natural inward curve of the lower back flattens. A **lumbar support** — a firm convexity centred about 170–220 mm above the compressed seat, the band EN 1335-1 describes — holds the curve. In the 1970s Andersson, Örtengren and Nachemson measured the pressure inside the lumbar discs of seated volunteers: it fell as the backrest was reclined and again when a lumbar pad was added. That is why working chairs recline to **about 100–120°** between seat and backrest, usually with a synchronous mechanism that tilts the seat a little as the back goes back, and why the backrest should reach at least the lower shoulder blades.

| Adjustment | Body dimension | Limiting user | Typical range |
|---|---|---|---|
| Seat height | popliteal height + shoe | both ends | 400–510 mm |
| Seat depth | buttock–popliteal length less 50–100 mm | small (maximum), large (support) | 390–490 mm |
| Seat width | hip breadth + clothing | 95th-percentile woman | 450–520 mm |
| Lumbar support | height of the lumbar curve | both ends | 170–220 mm above the seat |
| Armrest height | elbow rest height | both ends | 180–290 mm above the seat |
| Backrest angle | — | the task | 100–120° |

### Settings
- **Offices and call centres:** eight hours a day; a fully adjustable chair to EN 1335-1 (ANSI/HFES 100 and BIFMA in North America), set up *with* the user — most people never touch the levers unless shown.
- **Home:** dining chairs are fixed near 450 mm with no lumbar support; a cushion, a footrest and a small back roll help (see [[dining-tables-chairs]]).
- **Control rooms and 24-hour work:** chairs shared across shifts need quick adjustment and a higher rated load (see [[control-rooms]]).
- **Laboratories and counters:** high seats with a foot ring — the popliteal rule then measures from the ring.
- **Schools:** size-marked chairs for growing children (EN 1729-1; see [[school-furniture]]).
- **Vehicles and the military:** the same rules plus vibration, belts and body armour (see [[vehicle-seating]], [[crew-stations]]).

> [!tip] In the simulation press *Fit the chair* for a 5th-percentile woman and a 95th-percentile man in turn; then press *A dining chair* and read how many women and men it suits.

> [!warn] A chair does not cure back pain, and no posture is right for hours. Change position, stand and walk often; pain that persists belongs with a doctor or physiotherapist.

> [!key] Size every adjustment from a body dimension — height from the knee, depth from the thigh, width from the hips, armrests from the elbows — and make each range span the smallest to the largest user.
`,
  ideas: [
    'The seat height is the popliteal height plus the shoe: about 390 to 515 mm from the 5th-percentile woman to the 95th-percentile man.',
    'The seat must be shorter than the thigh of the smallest users, so that they can sit back and still clear the backs of their knees.',
    'Seat width is limited by the widest hips, which belong to women.',
    'A lumbar support 170–220 mm above the seat and a backrest reclined to 100–120° lower the load on the lower back.',
    'Armrests at elbow rest height take the weight of the arms off the shoulders; too high or too wide, they do harm.'
  ],
  pitfalls: [
    'A chair should be as high as the desk requires — Set the chair to the legs first; if the desk is then too high, lower the desk or add a footrest.',
    'A deeper seat is more comfortable for everyone — A seat deeper than the thigh pushes small users forward, off the backrest, or presses behind their knees.',
    'Sitting bolt upright at 90° is the healthy posture — Disc pressure and back-muscle effort are lower with the backrest reclined to 100–120° and the lumbar curve supported.'
  ],
  formulas: [
    {
      name: 'Seat height from the knee',
      expr: 'hs = hp + a', tex: 'h_s = h_p + a_s',
      vars: {
        hs: { name: 'seat height (top of the compressed seat)', q: 'length', unit: 'mm', tex: 'h_s' },
        hp: { name: 'popliteal height of the user', q: 'length', unit: 'mm', value: 405, tex: 'h_p' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' }
      },
      note: 'Feet flat, thighs about level. Measure a real user\'s popliteal height sitting, barefoot, from the floor to the underside of the thigh behind the knee.',
      stories: { hs: 'A user\'s popliteal height is {hp} and she wears shoes that add {a}. How high should her seat be?', hp: 'A chair set to {hs} fits a user with shoes of {a}. What is that user\'s popliteal height?' }
    },
    {
      name: 'Seat depth from the thigh',
      expr: 'ds = lbp - c', tex: 'd_s = l_{bp} - c',
      vars: {
        ds: { name: 'largest seat depth (backrest to front edge)', q: 'length', unit: 'mm', tex: 'd_s' },
        lbp: { name: 'buttock–popliteal length of the smallest user', q: 'length', unit: 'mm', value: 439, tex: 'l_{bp}' },
        c: { name: 'clearance behind the knee (50–100 mm)', q: 'length', unit: 'mm', value: 50, tex: 'c' }
      },
      note: 'The smallest user limits the depth; the largest users want more thigh support, which a seat slide provides.',
      stories: { ds: 'The smallest user\'s buttock–popliteal length is {lbp}. With {c} of clearance behind the knee, how deep may the seat be?' }
    },
    {
      name: 'Seat width from the hips',
      expr: 'ws = bh + ac', tex: 'w_s = b_h + a_c',
      vars: {
        ws: { name: 'seat width', q: 'length', unit: 'mm', tex: 'w_s' },
        bh: { name: 'hip breadth sitting of the largest user (95th-percentile woman)', q: 'length', unit: 'mm', value: 451, tex: 'b_h' },
        ac: { name: 'allowance for clothing and movement', q: 'length', unit: 'mm', value: 50, tex: 'a_c' }
      },
      note: 'A clearance: the largest user limits it. The same sum, with a little more, gives the clear width between armrests.',
      stories: { ws: 'The widest hips to be fitted measure {bh}, and clothing and movement need {ac}. How wide should the seat be?' }
    }
  ],
  examples: [
    {
      title: 'One chair for the smallest and the largest user',
      q: 'Popliteal height is 405 ± 26 mm for women and 445 ± 28 mm for men; buttock–popliteal length is 485 ± 28 mm for women and 500 ± 28 mm for men. With 25 mm of shoe and 50 mm of clearance behind the knee, what seat heights and depths do the 5th-percentile woman and the 95th-percentile man need?',
      steps: [
        'Seat height, 5th-percentile woman: $405 - 1.645 \\times 26 + 25 = 387$ mm.',
        'Seat height, 95th-percentile man: $445 + 1.645 \\times 28 + 25 = 516$ mm.',
        'Seat depth, 5th-percentile woman: $485 - 1.645 \\times 28 - 50 = 389$ mm at the most.',
        'Seat depth, 95th-percentile man: $500 + 1.645 \\times 28 - 50 = 496$ mm for full support.',
        'So the height must adjust over about 390–515 mm (EN 1335-1: at least 400–510 mm) and the depth over about 390–495 mm — a seat slide of about 100 mm.'
      ],
      a: 'Seat height about 387–516 mm, seat depth about 389–496 mm.'
    },
    {
      title: 'A dining chair used for a home office',
      q: 'A dining chair has a fixed 450 mm seat. With 25 mm shoes, a user\'s feet rest flat only if her popliteal height is at least 425 mm. What share of women (405 ± 26 mm) and of men (445 ± 28 mm) can sit with their feet flat?',
      steps: [
        'Women: $z = (425 - 405)/26 = 0.77$; the share above is $1 - \\Phi(0.77) \\approx 22\\%$.',
        'Men: $z = (425 - 445)/28 = -0.71$; the share above is $1 - \\Phi(-0.71) \\approx 76\\%$.',
        'About three women in four, and one man in four, sit with the seat edge under their thighs — a footrest (or a lower chair) fixes it.'
      ],
      a: 'About 22 % of women and 76 % of men.'
    }
  ],
  quiz: [
    { q: 'The front edge of a seat presses under a user\'s thighs and her feet only just touch the floor. What should be changed first?', choices: ['Lower the seat (and then lower the desk or add a footrest if needed)', 'Raise the seat', 'Tilt the backrest back', 'Lower the armrests'], a: 0, why: 'The seat is higher than her popliteal height plus shoe. Fit the chair to the legs first, then deal with the desk.' },
    { q: 'Which user limits the largest acceptable seat depth?', choices: ['The one with the shortest thighs (a low-percentile woman)', 'The one with the longest thighs', 'The heaviest user', 'The average user'], a: 0, why: 'If the seat is deeper than the shortest thigh less a clearance, that user cannot sit back without the edge pressing behind the knees.' },
    { q: 'For the width of a seat, which group is usually the limiting one?', choices: ['Women — their hips are wider sitting', 'Men — they are larger in every dimension', 'Children', 'Neither: width does not matter'], a: 0, why: 'Hip breadth sitting is larger for women (about 451 mm at the 95th percentile against 414 mm for men).' },
    { q: 'A lumbar support belongs at shoulder-blade height.', a: false, why: 'It belongs in the small of the back, about 170–220 mm above the compressed seat, where the lumbar curve is.' },
    { q: 'Why do armrests set too high cause trouble?', choices: ['They lift the shoulders and keep the neck and shoulder muscles working', 'They make the seat too narrow', 'They lower the lumbar support', 'They stop the chair from reclining'], a: 0, why: 'Armrests should meet the elbows with the shoulders relaxed; higher ones hold the shoulders up all day.' }
  ],
  problems: [
    { q: 'Men\'s popliteal height is 445 ± 28 mm. What seat height suits the 95th-percentile man (z = 1.645) wearing 25 mm shoes?', answer: 516, unit: 'mm', tol: 0.01, steps: ['$h_p = 445 + 1.645 \\times 28 = 491$ mm.', '$h_s = 491 + 25 = 516$ mm — just above the 510 mm top of the EN 1335-1 range.'] },
    { q: 'Women\'s buttock–popliteal length is 485 ± 28 mm. How deep may a seat be for the 5th-percentile woman (z = −1.645) if 60 mm must remain behind the knee?', answer: 379, unit: 'mm', tol: 0.01, steps: ['$l_{bp} = 485 - 1.645 \\times 28 = 439$ mm.', '$d_s = 439 - 60 = 379$ mm.'] },
    { q: 'Women\'s popliteal height is 405 ± 26 mm. A fixed seat of 450 mm lets a user\'s feet rest flat only if her popliteal height is at least 425 mm (25 mm shoes). What percentage of women can sit with their feet flat?', answer: 22, unit: '%', tol: 0.08, steps: ['$z = (425 - 405)/26 = 0.77$.', '$1 - \\Phi(0.77) = 1 - 0.78 = 0.22$: about 22 %.'] }
  ],
  ranges: [
    { dim: 'Office chair seat height (adjustment range)', range: [400, 510], unit: 'mm', who: '5th-percentile woman (popliteal height about 362 mm) to 95th-percentile man (about 491 mm), each plus about 25 mm of shoe', why: 'Feet flat on the floor, thighs about level, no pressure from the front edge under the thighs.', limits: 'The very smallest need the seat a little below 400 mm or a footrest; very tall users need a taller gas lift. At a fixed desk the seat follows the desk, not the legs.', setting: 'office', src: 'EN 1335-1' },
    { dim: 'Seat depth, backrest to front edge (adjustment range)', range: [390, 490], unit: 'mm', who: 'Buttock–popliteal length less 50–100 mm: about 439 mm for the 5th-percentile woman, about 546 mm for the 95th-percentile man', why: 'Small users reach the backrest without the seat edge pressing behind their knees; tall users get their thighs supported.', limits: 'A fixed depth of 420–440 mm is a compromise that leaves the tallest with little thigh support; a seat slide solves it.', setting: 'office', src: 'Derived from buttock–popliteal length (representative data); EN 1335-1 sets its own limits' },
    { dim: 'Seat width', range: [450, 520], unit: 'mm', who: 'Hip breadth sitting of the 95th-percentile woman (about 451 mm) plus clothing and room to shift', why: 'The widest hips fit without pressure from the seat edges or the armrests.', limits: 'EN 1335-1 allows narrower seats (from 400 mm). Larger bodies need wider chairs rated for their weight.', setting: ['office', 'civil'], src: 'Hip breadth data; EN 1335-1 (minimum)' },
    { dim: 'Lumbar support, centre above the compressed seat', range: [170, 220], unit: 'mm', who: 'The lumbar curve of small to large users lies in this band', why: 'Holds the inward curve of the lower back so the pelvis does not roll back and the spine does not slump.', limits: 'A fixed pad suits the middle; small and tall users need a height-adjustable support. It is useless if the seat is too deep to sit back.', setting: 'office', src: 'EN 1335-1' },
    { dim: 'Backrest angle to the seat (working recline)', range: [100, 120], unit: '°', who: 'All users; chosen by the task', why: 'Opening the trunk–thigh angle lowers the pressure in the lumbar discs and the work of the back muscles.', limits: 'Reclining moves the eyes and shoulders back: the screen and keyboard must follow, or the user leans forward off the backrest.', setting: ['office', 'vehicle'], src: 'Andersson, Örtengren and Nachemson, lumbar disc pressure studies (1974)' },
    { dim: 'Armrest height above the seat (adjustment range)', range: [180, 290], unit: 'mm', who: 'Elbow rest height of the 5th-percentile woman (about 189 mm) to the 95th-percentile man (about 294 mm)', why: 'The forearms rest with relaxed shoulders, taking the weight of the arms off the neck and shoulder muscles.', limits: 'Fixed armrests that are too high lift the shoulders; long ones stop the chair reaching the desk — choose short or adjustable ones.', setting: 'office', src: 'Derived from elbow rest height (representative data)' },
    { dim: 'Clear width between armrests', range: [460, 520], unit: 'mm', who: 'The widest hips plus clothing (the minimum) and the narrowest shoulders (the maximum)', why: 'Wide hips pass between the armrests, yet small users can still rest their elbows without spreading them.', limits: 'No single width fits both ends: width-adjustable or pivoting armrests do.', setting: 'office', src: 'Derived from hip and shoulder breadth' }
  ],
  applications: [
    'Setting up a new employee\'s chair: seat to the knees, depth to the thighs, lumbar pad to the small of the back, armrests to the elbows — then the desk.',
    'Writing a purchasing specification from EN 1335-1 and the body sizes of the actual users (a workforce of tall men needs a taller gas lift).',
    'Chairs for shared, 24-hour workplaces: quick adjustment and a higher rated load.',
    'Checking a chair against a person in [the workstation fitter](#/tools/workstation/sitting).'
  ],
  history: 'The Swedish orthopaedist Bengt Åkerblom argued in 1948 that a chair should support the lower back, and in the 1960s and 1970s Alf Nachemson, Gunnar Andersson and Roland Örtengren measured the pressure in the lumbar discs of sitting people, showing why reclined backrests and lumbar supports help. Adjustable office chairs with gas lifts spread in the 1970s; European screen-work rules of the early 1990s (Directive 90/270/EEC) made an adjustable chair a requirement at every display screen workstation.',
  sources: [
    'EN 1335-1, *Office furniture — Office work chair — Part 1: Dimensions*.',
    'ANSI/HFES 100-2007, *Human Factors Engineering of Computer Workstations*.',
    'B. J. G. Andersson, R. Örtengren, A. Nachemson and G. Elfström, studies of lumbar disc pressure and back muscle activity during sitting, *Scandinavian Journal of Rehabilitation Medicine*, 1974.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, the chapters on seating.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on sitting at work.'
  ],
  sim: 'ws-chair'
},

{
  id: 'desk-height', parent: 'seated-work', title: 'Desk and work-surface height', level: 1,
  short: 'The work surface belongs at about seated elbow height — which runs from under 600 mm for a small woman to over 800 mm for a tall man. A fixed desk near 740 mm suits the middle and the tall; everyone else raises the chair and adds a footrest, or uses an adjustable desk.',
  keywords: ['desk height', 'work surface height', 'elbow height', 'EN 527', 'fixed desk', 'adjustable desk', 'knee clearance', 'leg room', 'thigh clearance', 'footrest', 'keyboard height', '740 mm', 'accessible desk', 'wheelchair'],
  prereq: ['office-chair', 'sitting-dimensions', 'design-for-range'],
  related: ['sit-stand-work', 'keyboard-mouse', 'reach-zones', 'standing-work-heights', 'dining-tables-chairs', 'workbench-design', 'accessible-design', 'school-furniture', 'combining-percentiles'],
  body: `
Once the chair fits the legs, the desk must fit the arms. With the upper arms hanging relaxed and the forearms about level, the hands work at **seated elbow height**: the seat height plus the elbow rest height. That height varies more than either dimension alone, because it adds a leg length to a trunk length.

### How high is elbow height?
With the representative data of this app and the chair fitted to the legs, seated elbow height runs from about **576 mm** for the 5th-percentile woman (a 387 mm seat plus a 189 mm elbow rest height) to about **810 mm** for the 95th-percentile man (516 + 294 mm). Adding the 5th percentiles of two dimensions slightly overstates the spread — a person with short legs does not always have a short trunk (see [[combining-percentiles]]) — but the lesson stands: **a quarter of a metre separates the smallest and the largest users**. For keyboard work the key tops belong at or a little below the elbow, so the desk itself may sit 20–30 mm lower; for writing and reading it may be a little higher.

### The fixed desk
Most fixed desks stand near **740 mm**, the height EN 527-1 describes for them (±20 mm). At 740 mm:
- **Tall users** find the surface up to 70 mm below their elbows, stoop over it and bump their thighs: the 95th-percentile man at his own seat height has the tops of his thighs about 706 mm above the floor, which leaves almost nothing under a 30 mm top.
- **Small users** raise the seat until their elbows reach the desk — and their feet leave the floor. The 5th-percentile woman needs a footrest about $740 - 189 - 387 = 164$ mm high, more than many footrests offer.
- In between, the desk fits the people whose own elbow height lies within about 25 mm of it — mostly average and tall men.

### The adjustable desk
An adjustable desk brings the surface to the person, so the chair can stay fitted to the legs. EN 527-1 describes height-adjustable desks over about **650–850 mm** and sit–stand desks over about **650–1250 mm**. To serve the smallest seated users fully the travel should start nearer **580–600 mm**; where it does not, they raise the chair and use a small footrest.

### Room for the legs
Under the desk the **largest** users set the limits. The 95th-percentile man's thighs need the underside at about **700 mm** or more; his knees need at least about 450 mm of depth (his buttock–knee length is about 660 mm and he sits 150–200 mm back from the edge) and his feet more; and the clear width should be at least about 700 mm so the chair base and crossed legs fit. Drawers, modesty panels, cross-bars and keyboard trays all eat into this space.

| | Fixed desk (740 mm) | Adjustable desk | Fixed desk + footrest |
|---|---|---|---|
| Small users | elbows low → seat up → feet dangle | fits | fits, if the footrest is high enough |
| Average users | roughly fits | fits | — |
| Large users | stoop, thighs touch | fits | no help |
| Cost, complexity | lowest | higher: motors or cranks | low |

### The surface itself
Deep enough for a screen at arm's length behind the keyboard — **at least 800 mm** for screen work — and 1200–1600 mm wide; a thin front edge (under about 30 mm) to keep thigh room; a rounded front where the forearms rest; and a matt surface that does not mirror lamps and windows (see [[glare-colour]]).

### Settings
- **Home:** dining and kitchen tables stand near 720–760 mm; the footrest rule applies to small adults and to children at adult tables.
- **Offices:** EN 527-1 in Europe; ANSI/HFES 100 and the BIFMA ergonomics guideline in North America. The EU screen-work directive requires a footrest for anyone who wants one.
- **Accessible workplaces:** the 2010 ADA Standards ask for a work surface **710–865 mm (28–34 in)** high with knee clearance at least **685 mm (27 in)** high and 760 mm (30 in) wide; an adjustable desk solves it for everyone (see [[accessible-design]]).
- **Schools:** tables sized together with chairs in EN 1729-1 size marks (see [[school-furniture]]).
- **Laboratories, counters and control consoles:** the same elbow rule at higher seats (see [[laboratory-ergonomics]] and [[control-rooms]]); standing surfaces follow [[standing-work-heights]].
- **Field and vehicles:** folding tables and vehicle desks rarely adjust — plan a seat that does and a footrest (see [[field-computing]]).

> [!tip] In the simulation choose a fixed 740 mm desk and read the dots on the graph: green people fit, red ones do not. Switch to an adjustable desk and compare the ranges 650–850 mm and 580–820 mm.

> [!key] The desk belongs at elbow height, and elbow height differs by a quarter of a metre between users. A fixed desk fits the middle and the tall; the small need a footrest; an adjustable desk fits everyone.
`,
  ideas: [
    'The work surface belongs at seated elbow height, the seat height plus the elbow rest height.',
    'Seated elbow height spans about 576 to 810 mm from the 5th-percentile woman to the 95th-percentile man.',
    'At a fixed desk small users raise the chair and need a footrest; tall users stoop and lack thigh room.',
    'Knee and thigh clearance under the desk are set by the largest users.',
    'An adjustable desk lets the chair stay fitted to the legs while the surface comes to the elbows.'
  ],
  pitfalls: [
    'The standard 740 mm desk is right for most people — It is within 25 mm of the elbow height of only a minority, mostly average and tall men.',
    'If the desk is too high, lower the chair — Lowering the chair below the knee height pushes the knees up and the elbows further below the desk; raise the chair and add a footrest instead.',
    'Drawers under the desk are harmless — Over the knees they remove the thigh clearance the largest users need.'
  ],
  formulas: [
    {
      name: 'Seated work-surface height',
      expr: 'hd = hs + he - k', tex: 'h_d = h_s + h_e - k',
      vars: {
        hd: { name: 'work surface height', q: 'length', unit: 'mm', tex: 'h_d' },
        hs: { name: 'seat height (fitted to the legs)', q: 'length', unit: 'mm', value: 430, tex: 'h_s' },
        he: { name: 'elbow rest height above the seat', q: 'length', unit: 'mm', value: 235, tex: 'h_e' },
        k: { name: 'allowance for the keyboard (0 for writing)', q: 'length', unit: 'mm', value: 20, tex: 'k' }
      },
      note: 'With k = 0 the surface is at elbow height (writing, reading); with a keyboard about 20–30 mm lower so the key tops meet the elbow.',
      stories: { hd: 'A user sits at {hs} and her elbow rest height is {he}. With a keyboard allowance of {k}, how high should the desk be?', hs: 'The desk is at {hd}, the user\'s elbow rest height {he} and the keyboard allowance {k}. How high must the seat be?' }
    },
    {
      name: 'Footrest needed at a fixed desk',
      expr: 'hf = D - he - hp - a', tex: 'h_f = D - h_e - (h_p + a_s)',
      vars: {
        hf: { name: 'footrest height', q: 'length', unit: 'mm', tex: 'h_f' },
        D: { name: 'fixed desk height', q: 'length', unit: 'mm', value: 740, tex: 'D' },
        he: { name: 'elbow rest height above the seat', q: 'length', unit: 'mm', value: 189, tex: 'h_e' },
        hp: { name: 'popliteal height', q: 'length', unit: 'mm', value: 362, tex: 'h_p' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' }
      },
      note: 'The seat is raised to D − h_e so the elbows meet the desk; the feet then need support by the difference from the seat the legs want.',
      stories: { hf: 'A fixed desk stands at {D}. A user\'s elbow rest height is {he}, her popliteal height {hp} and her shoes add {a}. How high a footrest does she need?', D: 'A footrest of {hf} lets a user with elbow rest height {he}, popliteal height {hp} and shoes of {a} work at a fixed desk. How high is the desk?' }
    },
    {
      name: 'Thigh clearance under the desk',
      expr: 'hu = hs + t + c', tex: 'h_u = h_s + t_{th} + c',
      vars: {
        hu: { name: 'height of the underside of the desk', q: 'length', unit: 'mm', tex: 'h_u' },
        hs: { name: 'seat height of the largest user', q: 'length', unit: 'mm', value: 516, tex: 'h_s' },
        t: { name: 'thigh clearance (thigh thickness) of the largest user', q: 'length', unit: 'mm', value: 190, tex: 't_{th}' },
        c: { name: 'margin for movement', q: 'length', unit: 'mm', value: 20, tex: 'c' }
      },
      note: 'A clearance: the 95th-percentile man at his own seat height limits it.',
      stories: { hu: 'The largest user sits at {hs} and his thighs are {t} thick. With a margin of {c}, how high must the underside of the desk be?' }
    }
  ],
  examples: [
    {
      title: 'A small user at a fixed desk',
      q: 'The 5th-percentile woman has a popliteal height of 362 mm and an elbow rest height of 189 mm; her shoes add 25 mm. She works at a fixed 740 mm desk. How should she set her chair, and what footrest does she need?',
      steps: [
        'Her legs want a seat of $362 + 25 = 387$ mm.',
        'Her elbows reach the desk only if the seat is at $740 - 189 = 551$ mm.',
        'She raises the seat to 551 mm and needs a footrest of $551 - 387 = 164$ mm.',
        'That is higher than many footrests go: an adjustable desk at $387 + 189 = 576$ mm is the better answer.'
      ],
      a: 'Seat at 551 mm with a footrest of about 164 mm — or an adjustable desk set near 576 mm.'
    },
    {
      title: 'A tall user at the same desk',
      q: 'The 95th-percentile man has a popliteal height of 491 mm, an elbow rest height of 294 mm and a thigh clearance of 190 mm. How well does a 740 mm desk with a 30 mm top fit him?',
      steps: [
        'Seat for his legs: $491 + 25 = 516$ mm; his elbows are at $516 + 294 = 810$ mm — 70 mm above the desk.',
        'The tops of his thighs are at $516 + 190 = 706$ mm; the underside of the desk is at $740 - 30 = 710$ mm: 4 mm to spare.',
        'He either stoops over a desk 70 mm too low or lowers his seat, pushing his knees up. An adjustable desk at about 810 mm fits him.'
      ],
      a: 'The desk is 70 mm too low and leaves only about 4 mm of thigh room.'
    }
  ],
  quiz: [
    { q: 'A fixed 740 mm desk is too high for a small user. What is the usual fix?', choices: ['Raise the chair until the elbows meet the desk and add a footrest', 'Lower the chair', 'Raise the armrests', 'Sit further from the desk'], a: 0, why: 'Raising the chair brings the elbows to the desk; the footrest then gives back the support the feet lost.' },
    { q: 'Which user sets the minimum height of the knee space under a desk?', choices: ['The largest (a 95th-percentile man)', 'The smallest', 'The average', 'A wheelchair user only'], a: 0, why: 'Clearance is limited by the largest thighs and knees; everyone smaller then fits.' },
    { q: 'A desk set at the average user\'s elbow height fits most users within 25 mm.', a: false, why: 'Seated elbow height spans about 234 mm (576–810 mm) between the 5th-percentile woman and the 95th-percentile man; a band of ±25 mm around the average holds only a minority.' },
    { q: 'An adjustable desk goes down only to 650 mm. A user\'s seated elbow height, with the chair fitted to her legs, is 590 mm. What does she do?', choices: ['Raise the chair 60 mm and use a 60 mm footrest', 'Lower the chair 60 mm', 'Work with her shoulders raised', 'Nothing: 60 mm does not matter'], a: 0, why: 'With the desk at its lowest, the seat must rise 60 mm to bring her elbows to the surface; a 60 mm footrest restores the support of her feet.' },
    { q: 'Why should the front edge of a desk top be thin?', choices: ['To leave room for the thighs of large users', 'To make the desk lighter', 'To reduce reflections', 'To make the desk more stable'], a: 0, why: 'Every millimetre of top and frame over the knees reduces thigh clearance, which is tightest for the largest users.' }
  ],
  problems: [
    { q: 'A woman\'s seat is set to her legs at 430 mm and her elbow rest height is 235 mm. How high should the desk be for writing (no keyboard allowance)?', answer: 665, unit: 'mm', tol: 0.005, steps: ['$h_d = 430 + 235 = 665$ mm.'] },
    { q: 'A user with a popliteal height of 380 mm, an elbow rest height of 210 mm and 25 mm shoes works at a fixed 730 mm desk. How high a footrest does he need?', answer: 115, unit: 'mm', tol: 0.02, steps: ['Seat for the elbows: $730 - 210 = 520$ mm.', 'Seat for the legs: $380 + 25 = 405$ mm.', 'Footrest: $520 - 405 = 115$ mm.'] },
    { q: 'Men\'s popliteal height is 445 ± 28 mm and thigh clearance 165 ± 15 mm. Taking the 95th percentile of each (z = 1.645), 25 mm of shoe and a 20 mm margin, how high must the underside of a desk be?', answer: 726, unit: 'mm', tol: 0.01, steps: ['Seat: $445 + 1.645 \\times 28 + 25 = 516$ mm.', 'Thighs: $165 + 1.645 \\times 15 = 190$ mm.', '$h_u = 516 + 190 + 20 = 726$ mm.'] }
  ],
  ranges: [
    { dim: 'Fixed desk height', range: [720, 760], unit: 'mm', who: 'Fits average and tall men at their own seat height; smaller users raise the seat and need a footrest', why: 'One height for furniture that cannot adjust, near the middle of the adult range.', limits: 'Fits a minority exactly: the 5th-percentile woman needs a footrest of about 160 mm, and the tallest users stoop and lack thigh room.', setting: ['office', 'civil'], src: 'EN 527-1' },
    { dim: 'Seated work surface, adjustable range', range: [580, 810], unit: 'mm', who: 'Seated elbow height from the 5th-percentile woman (about 576 mm) to the 95th-percentile man (about 810 mm), with the chair fitted to the legs', why: 'Every user gets the surface at elbow height without lifting the chair off their feet.', limits: 'Many desks stop at 650–680 mm: the smallest users then raise the chair and add a footrest. For keyboards set it 20–30 mm lower than for writing.', setting: 'office', src: 'Derived from popliteal and elbow rest heights (representative data); compare EN 527-1' },
    { dim: 'Underside of the desk (thigh clearance)', range: [700, null], unit: 'mm', who: '95th-percentile man at his own seat height (thigh tops about 706 mm above the floor), plus a margin', why: 'The largest thighs pass under the desk and the chair can come close.', limits: 'At a fixed 740 mm this leaves room only for a thin top — no drawers or aprons over the knees.', setting: 'office', src: 'Derived from popliteal height and thigh clearance' },
    { dim: 'Clear leg-room width', range: [700, null], unit: 'mm', who: 'The chair base and the knees of large users, crossing their legs', why: 'The chair can be pulled in and turned, and the legs can move.', limits: 'Pedestals and cable trays narrow it; wheelchair users need at least 760 mm (30 in).', setting: 'office', src: 'Chair and body dimensions; 2010 ADA Standards (knee clearance width)' },
    { dim: 'Work surface depth for screen work', range: [800, null], unit: 'mm', who: 'A keyboard in front plus a screen at arm\'s length', why: 'The screen can stand 500 mm or more from the eyes with the keyboard in front of it.', limits: 'Large or several screens need more depth or a monitor arm.', setting: 'office', src: 'EN 527-1; common practice' },
    { dim: 'Accessible work surface height', range: [710, 865], unit: 'mm', who: 'Wheelchair users (28–34 in), with knee clearance at least 685 mm (27 in) high', why: 'A wheelchair fits under the surface and the arms work at a usable height.', limits: 'Wheelchairs and users vary widely; an adjustable desk beats any fixed height.', setting: ['office', 'civil'], src: '2010 ADA Standards for Accessible Design, §306 and §902' }
  ],
  applications: [
    'Choosing between fixed desks with footrests and adjustable desks for a new office, with the body sizes of the actual staff.',
    'Checking that drawers, beams and keyboard trays leave the knee room the largest users need.',
    'Accessible workstations for wheelchair users, and desks shared by people of very different sizes.',
    'Trying any person at any desk in [the workstation fitter](#/tools/workstation/sitting).'
  ],
  history: 'Typewriters stood their keys well above the table, so offices long had lower typing tables beside the writing desk. Thin keyboards brought typing back onto the desk top — and for many people the desk was now too high. The European screen-work directive of 1990 (90/270/EEC) made a footrest available to anyone who wants one, and height-adjustable desks spread from Scandinavia through the 1990s and 2000s.',
  sources: [
    'EN 527-1, *Office furniture — Work tables and desks — Part 1: Dimensions*.',
    'ANSI/HFES 100-2007, *Human Factors Engineering of Computer Workstations*.',
    'Council Directive 90/270/EEC on the minimum safety and health requirements for work with display screen equipment (annex: work surface and footrest).',
    '2010 ADA Standards for Accessible Design, §306 (knee and toe clearance) and §902 (dining surfaces and work surfaces).',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on work surface heights.'
  ],
  sim: ['ws-desk', 'ref-seat-fit']
},

{
  id: 'sit-stand-work', parent: 'seated-work', title: 'Sitting and standing', level: 1,
  short: 'Neither sitting all day nor standing all day is good: the body wants change. Break up sitting every 20–30 minutes, build standing and light activity up to 2–4 hours across the working day, and give the desk a travel of about 580–1180 mm so every user reaches both heights.',
  keywords: ['sit-stand desk', 'standing desk', 'height-adjustable desk', 'sedentary work', 'prolonged sitting', 'standing work', '20-8-2', 'posture change', 'anti-fatigue mat', 'perching stool', 'breaks', 'energy expenditure', 'EN 527'],
  prereq: ['desk-height', 'static-muscle-work', 'standing-dimensions'],
  related: ['standing-all-day', 'standing-work-heights', 'fatigue-rest-breaks', 'work-rest-scheduling', 'office-chair', 'monitor-placement', 'medicine:physical-activity', 'motors:dc-gearmotors'],
  body: `
Neither sitting all day nor standing all day is good for people. Long unbroken sitting keeps the leg muscles idle and holds the spine in one shape; long standing makes the leg and back muscles work statically, lets blood pool in the legs and tires the feet. The body wants **change** — and a desk that moves between sitting and standing height makes change easy.

### What the evidence says
- **Breaking up sitting matters.** In a laboratory study by Dunstan and colleagues (2012), interrupting sitting every 20 minutes with two minutes of light walking lowered the rise of blood glucose and insulin after a meal, compared with the same hours of unbroken sitting.
- **Standing is not exercise.** A meta-analysis by Saeidifard and colleagues (2018) found that standing uses only about **0.15 kcal a minute** more than sitting — some 36 kcal in four hours. Walking uses roughly ten times as much extra.
- **Too much standing hurts too.** Jobs with long hours of standing are associated with leg discomfort, low-back pain and varicose veins (see [[standing-all-day]]).
- **Sit–stand desks do change behaviour.** A Cochrane review (Shrestha and colleagues, 2018) found that they cut sitting at work by roughly one to two hours a day in the short term; evidence on long-term health effects is still weak.

An expert statement for office workers (Buckley and colleagues, 2015) suggested building up to at least **2 hours a day** of standing and light activity during working hours, then towards **4 hours**, and breaking up seated work regularly. Alan Hedge's ergonomics group at Cornell popularised a simple rhythm: **20 minutes sitting, 8 standing, 2 moving** in every half hour — a pattern to aim at, not a law.

### Two heights for every user
A sit–stand desk must reach seated elbow height *and* standing elbow height for everyone. Standing, the keyboard surface sits about 30–50 mm below elbow height with shoes on:

| | Seated surface | Standing surface (keyboard) |
|---|---|---|
| 5th-percentile woman | about 576 mm | about 915–935 mm |
| 50th-percentile woman / man | about 665 / 715 mm | about 1000 / 1085 mm |
| 95th-percentile man | about 810 mm | about 1160–1180 mm |

So the desk must travel from about **580 to 1180 mm** — close to the **650–1250 mm** that EN 527-1 describes for sit–stand desks, but lower at the bottom. The screen must travel with the desk (stand it on the desk or on a desk-mounted arm) so that the eye-to-screen geometry holds in both postures (see [[monitor-placement]]).

### Making it work
- **Memory presets** for the two heights and a motor quick enough that changing is no bother. Many users stop adjusting after the first weeks: prompts, habits (stand for phone calls) and team norms keep it going.
- **Build up** standing a little at a time rather than switching to hours at once.
- **Support the standing body:** cushioned mats on hard floors, supportive shoes, a footrail or low step to shift the weight, room to move.
- **Perching stools** (sit–lean seats) give a third posture between the two.
- Standing is a change of posture, not a replacement for moving: walk to the printer, to a colleague, to meetings.

### Settings
- **Offices:** electric sit–stand desks, usually with two or three motorised telescopic legs (see [[motors:dc-gearmotors|DC gearmotors]]).
- **Workshops, laboratories, shops and hospitals:** the reverse problem — people stand all day. Give them a seat or a sit–stand stool at the same work height, anti-fatigue mats and job rotation (see [[standing-work-heights]], [[retail-checkouts]], [[laboratory-ergonomics]]).
- **Home:** a kitchen worktop near 900 mm is a standing desk only for the smallest users; the others need a riser.
- **Control rooms and military operations centres:** long shifts with quiet spells — sit–stand consoles help operators stay alert (see [[control-rooms]], [[sustained-operations]]).
- **Schools:** standing desks are being tried in classrooms; children's sizes change year by year, so the heights must adjust.

> [!tip] In the simulation play a whole working day with each pattern and read the time sitting, the time standing, the longest unbroken spell of sitting and the extra energy used. Then change the person and watch both desk heights move.

> [!warn] Standing for hours on a hard floor is no healthier than sitting for hours. The goal is movement and variety, not a new fixed posture. Leg swelling or pain that persists belongs with a doctor.

> [!key] Alternate: break up sitting every 20–30 minutes, build standing and light activity up to 2–4 hours a day, and let the desk travel about 580–1180 mm so that every user reaches both heights.
`,
  ideas: [
    'The body needs changes of posture: long sitting and long standing each have their own harms.',
    'Breaking up sitting every 20–30 minutes with standing or a little walking helps; standing itself burns only about 0.15 kcal a minute more than sitting.',
    'Expert advice for office workers: build up to 2–4 hours of standing and light activity across the working day.',
    'A sit–stand desk must reach about 580 mm for the smallest seated user and about 1180 mm for the tallest standing one.',
    'The screen must move with the desk, and standing needs mats, shoes and room to move.'
  ],
  pitfalls: [
    'A standing desk is a way to burn calories — Standing uses only about 0.15 kcal a minute more than sitting; its value is in breaking up sitting and changing posture.',
    'Standing all day is the healthy alternative to sitting — Long static standing brings its own leg, foot and back problems; alternate and move.',
    'Any sit–stand desk fits everybody — Many stop at 650 mm or more at the bottom, too high for the smallest seated users, who then need a footrest.'
  ],
  formulas: [
    {
      name: 'Standing keyboard surface height',
      expr: 'hst = hel + a - k', tex: 'h_{st} = h_{el} + a_s - k',
      vars: {
        hst: { name: 'standing work surface height (keyboard work)', q: 'length', unit: 'mm', tex: 'h_{st}' },
        hel: { name: 'elbow height standing (barefoot)', q: 'length', unit: 'mm', value: 1015, tex: 'h_{el}' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25, tex: 'a_s' },
        k: { name: 'allowance for the keyboard (30–50 mm)', q: 'length', unit: 'mm', value: 40, tex: 'k' }
      },
      note: 'Writing and reading may sit a little higher, heavier standing work lower (see working heights standing).',
      stories: { hst: 'A user\'s standing elbow height is {hel}, her shoes add {a} and the keyboard {k}. At what height should the desk be set for standing?' }
    },
    {
      name: 'Extra energy used by standing instead of sitting',
      expr: 'dE = r*t', tex: '\\Delta E = r\\,t',
      vars: {
        dE: { name: 'extra energy used', q: false, unit: 'kcal', tex: '\\Delta E' },
        r: { name: 'extra rate standing rather than sitting (about 0.15)', q: false, unit: 'kcal/min', value: 0.15, tex: 'r' },
        t: { name: 'time spent standing', q: false, unit: 'min', value: 240, tex: 't' }
      },
      note: 'The average difference found in a meta-analysis (Saeidifard and colleagues, 2018). Light walking adds roughly 1.5–2 kcal a minute over sitting.',
      stories: { dE: 'A worker stands for {t} instead of sitting. At {r} extra, how much more energy does she use?' }
    },
    {
      name: 'Share of the working day spent standing',
      expr: 'f = ts/(ts + tsi)', tex: 'f = \\frac{t_{st}}{t_{st} + t_{si}}',
      vars: {
        f: { name: 'share of time standing', q: 'ratio', unit: '%' },
        ts: { name: 'time standing', q: 'time', unit: 'h', value: 2, tex: 't_{st}' },
        tsi: { name: 'time sitting', q: 'time', unit: 'h', value: 6, tex: 't_{si}' }
      },
      stories: { f: 'In a working day a user stands for {ts} and sits for {tsi}. What share of the time does he stand?', ts: 'A user sits for {tsi} and wants to stand for {f} of the time. How long must she stand?' }
    }
  ],
  examples: [
    {
      title: 'How far must a sit–stand desk travel?',
      q: 'Seated elbow height (chair fitted to the legs) is about 576 mm for the 5th-percentile woman and 810 mm for the 95th-percentile man. Standing elbow heights are 939 mm and 1182 mm; shoes add 25 mm and the keyboard needs 40 mm. What travel must the desk have, and how does it compare with a desk of 650–1250 mm?',
      steps: [
        'Lowest setting: the 5th-percentile woman seated, about 576 mm.',
        'Highest setting: the 95th-percentile man standing, $1182 + 25 - 40 = 1167$ mm.',
        'Travel: about 580–1170 mm.',
        'A 650–1250 mm desk covers the top easily but is about 74 mm too high for the smallest seated users: they raise the chair 74 mm and use a 74 mm footrest.'
      ],
      a: 'About 580–1170 mm; a 650 mm minimum leaves the smallest users needing a footrest.'
    },
    {
      title: 'A 20–8–2 day',
      q: 'A worker follows the 20–8–2 rhythm (20 minutes sitting, 8 standing, 2 moving) through 8 hours. How long does she sit, stand and move, and roughly how much extra energy does it use compared with sitting throughout?',
      steps: [
        '8 hours hold 16 half-hours: sitting $16 \\times 20 = 320$ min (5 h 20 min), standing $16 \\times 8 = 128$ min, moving $16 \\times 2 = 32$ min.',
        'Standing: $128 \\times 0.15 \\approx 19$ kcal extra.',
        'Moving: light walking uses roughly 1.5–2 kcal a minute more than sitting, so $32 \\times 1.8 \\approx 58$ kcal.',
        'Total roughly 75–80 kcal — the walking does most of it; the gain for the body is mainly the 16 breaks in sitting.'
      ],
      a: 'Sitting 5 h 20 min, standing 2 h 8 min, moving 32 min; roughly 75–80 kcal extra.'
    }
  ],
  quiz: [
    { q: 'Which pattern best matches the evidence for desk work?', choices: ['Sit for 20–30 minutes, then stand or move for a few minutes, through the day', 'Stand all day', 'Sit all day and take one long walk at lunch', 'Alternate sitting days and standing days'], a: 0, why: 'Frequent breaks in sitting are what the laboratory studies and expert statements support; long static standing is a load of its own.' },
    { q: 'Standing at a desk for four hours uses about as much energy as a 30-minute run.', a: false, why: 'At about 0.15 kcal a minute more than sitting, four hours of standing add only some 36 kcal — a few minutes of brisk walking.' },
    { q: 'A sit–stand desk adjusts from 650 to 1250 mm. Who is not fully served?', choices: ['The smallest users when they sit', 'The tallest users when they stand', 'Average users when they stand', 'Nobody'], a: 0, why: 'The 5th-percentile woman\'s seated elbow height is about 576 mm, below the 650 mm minimum; she needs to raise the chair and use a footrest.' },
    { q: 'Why should the screen stand on a sit–stand desk rather than on a wall arm?', choices: ['So it moves with the desk and stays at the same height relative to the eyes', 'Because wall arms are unstable', 'To keep cables short', 'To reduce glare'], a: 0, why: 'When the desk rises 400 mm for standing, the eyes rise too; a screen fixed to the wall would end up far below them.' },
    { q: 'What is the main benefit of a sit–stand desk?', choices: ['It makes it easy to change posture and break up sitting', 'It burns many extra calories', 'It removes the need for breaks', 'It lets people stand all day'], a: 0, why: 'Its value is variety: less unbroken sitting, more movement.' }
  ],
  problems: [
    { q: 'A man\'s standing elbow height is 1100 mm. With 25 mm shoes and a 40 mm keyboard allowance, at what height should his sit–stand desk be set for standing?', answer: 1085, unit: 'mm', tol: 0.005, steps: ['$h_{st} = 1100 + 25 - 40 = 1085$ mm.'] },
    { q: 'At 0.15 kcal a minute more than sitting, how much extra energy do 150 minutes of standing use?', answer: 22.5, unit: 'kcal', tol: 0.02, steps: ['$\\Delta E = 0.15 \\times 150 = 22.5$ kcal.'] },
    { q: 'A worker stands for 2.5 hours of an 8-hour day and sits for the rest. What percentage of the day does she stand?', answer: 31.25, unit: '%', tol: 0.01, steps: ['Sitting: $8 - 2.5 = 5.5$ h.', '$f = 2.5/(2.5 + 5.5) = 0.3125$, about 31 %.'] }
  ],
  ranges: [
    { dim: 'Sit–stand desk height travel', range: [580, 1180], unit: 'mm', who: 'Seated elbow height of the 5th-percentile woman (about 576 mm) to standing keyboard height of the 95th-percentile man (about 1170 mm)', why: 'Every user reaches both working heights without a footrest or stooping.', limits: 'Desks built to about 650–1250 mm leave the smallest seated users needing a footrest; the tallest users in thick-soled boots may need a little more at the top.', setting: 'office', src: 'Derived from representative body data; compare EN 527-1 (sit–stand desks)' },
    { dim: 'Standing keyboard surface height', range: [910, 1180], unit: 'mm', who: '5th-percentile woman to 95th-percentile man: standing elbow height plus about 25 mm of shoe, less 30–50 mm for the keyboard', why: 'Forearms about level and shoulders relaxed while typing standing.', limits: 'Writing wants a little more height, heavier work much less; mats and shoe soles change it by 10–30 mm.', setting: 'office', src: 'Derived from standing elbow height (representative data)' },
    { dim: 'Standing and light activity during working hours', range: [2, 4], unit: 'h a day', who: 'Office workers who otherwise sit for most of the day', why: 'Less unbroken sitting, more muscle activity and better blood-glucose control after meals.', limits: 'An expert consensus built on limited long-term evidence; build up gradually, and treat long static standing as a load of its own.', setting: 'office', src: 'Buckley and colleagues, expert statement, British Journal of Sports Medicine, 2015' },
    { dim: 'Longest unbroken spell of sitting', range: [20, 30], unit: 'min', who: 'Everyone working at a desk', why: 'Short, frequent breaks with standing or a little walking lowered the rise of blood glucose and insulin after a meal in laboratory studies, and relieve static postures.', limits: 'Laboratory studies lasting hours, not years; the right rhythm varies with the person and the task — the point is to change often.', setting: ['office', 'school'], src: 'Dunstan and colleagues, Diabetes Care, 2012; the 20–8–2 rhythm (Hedge, Cornell)' }
  ],
  applications: [
    'Specifying sit–stand desks with a travel that fits the whole workforce, with memory presets.',
    'Planning standing jobs (labs, checkouts, reception) with seats or perching stools at the same work height.',
    'Workplace programmes that pair sit–stand desks with prompts, walking meetings and team habits.',
    'Checking both working heights for a person in [the workstation fitter](#/tools/workstation/standing).'
  ],
  history: 'Standing desks are old — clerks and writers used tall desks in the nineteenth century — but the modern electric sit–stand desk spread from the Nordic countries in the 1990s and 2000s. Research on sedentary behaviour in the 2000s and 2010s, from the health effects of long sitting to laboratory studies of breaking it up, turned the adjustable desk from an ergonomic convenience into a public-health tool.',
  sources: [
    'J. P. Buckley, A. Hedge, T. Yates and colleagues, The sedentary office: an expert statement on the growing case for change towards better health and productivity, *British Journal of Sports Medicine*, 2015.',
    'D. W. Dunstan and colleagues, Breaking up prolonged sitting reduces postprandial glucose and insulin responses, *Diabetes Care*, 2012.',
    'F. Saeidifard and colleagues, a systematic review and meta-analysis of energy expenditure while sitting versus standing, *European Journal of Preventive Cardiology*, 2018.',
    'N. Shrestha and colleagues, Workplace interventions for reducing sitting at work, *Cochrane Database of Systematic Reviews*, 2018.',
    'EN 527-1, *Office furniture — Work tables and desks — Part 1: Dimensions* (sit–stand desks).'
  ],
  sim: 'ws-sit-stand'
},

{
  id: 'monitor-placement', parent: 'seated-work', title: 'Placing the screen', level: 1,
  short: 'Put the screen straight ahead, about an arm\'s length away (roughly 500–1000 mm), with its top line at or a little below eye height so that its centre is 15–20° below the horizontal, tilted back to face the eyes. Bigger and multiple screens go further back and wrap around the viewer.',
  keywords: ['monitor height', 'screen distance', 'viewing distance', 'screen tilt', 'eye level', 'gaze angle', 'line of sight', 'dual monitors', 'multiple screens', 'monitor arm', 'progressive lenses', 'bifocals', 'neck posture', 'visual field'],
  prereq: ['sitting-dimensions', 'neutral-postures', 'desk-height'],
  related: ['visual-ergonomics', 'laptops-tablets', 'keyboard-mouse', 'glare-colour', 'displays-design', 'control-rooms', 'joint-ranges', 'hmi-screens', 'physics:the-eye', 'math:right-triangle-trig'],
  body: `
Where the screen stands decides where the head and eyes go for the whole working day. The eyes are most comfortable looking a little **downwards** at a moderate distance; the neck is most comfortable with the head balanced upright over the trunk. A good screen position satisfies both.

### Height: look slightly down
Seated and relaxed, people look naturally somewhat below the horizontal. The eyes rotate down easily; looking up makes the head tip back and the eyes open wider, which dries them. Hence the classic rule: **the top line of text at or slightly below eye height**, so that the centre of the screen lies about **15–20° below** the horizontal line of sight — the angle the US OSHA computer-workstation guidance also gives. The gaze angle to any point follows from the [[?inverse-trig|inverse tangent]]:

$$\\alpha = \\arctan\\frac{h_{eye} - h_c}{d}$$

where $h_{eye} - h_c$ is how far the point lies below the eyes and $d$ is the horizontal distance to it.

Seated eye height varies by about 300 mm: from about 1073 mm above the floor for the 5th-percentile woman to about 1369 mm for the 95th-percentile man, each with the chair fitted to the legs. Yet **above the desk** the difference shrinks when each person's desk is at their own elbow height: the eyes stand about 497 mm above the desk for the small woman and 558 mm for the large man, because eye height and elbow height rise together. At a fixed desk the difference returns, and a stand or arm with 150 mm or more of height adjustment is needed.

### Distance: about an arm's length
**500–1000 mm** (20–40 in) is the usual range: close enough to read comfortably, far enough to relax the focusing and converging muscles of the eyes. The closer the screen, the harder the eyes work (see [[visual-ergonomics]]); the farther, the larger the text must be. Larger screens go farther back so that the whole picture stays in view — a 24-inch screen at 600–700 mm, a 32-inch one at 800 mm or more.

### Tilt: face the eyes
Tilt the screen back by about **10–20°**, so that its face is roughly at right angles to the line of sight and the top and bottom are at about the same distance. Check the reflections: tilting back turns the screen towards the ceiling lights, so move the lamp or the screen rather than accept a bright patch (see [[glare-colour]]).

### Side to side: one, two, three screens
The primary screen belongs **straight ahead**, in line with the keyboard. The visual-field figures of MIL-STD-1472 give useful limits: the eyes rotate easily through about **15°** either side of straight ahead and at most about 35°; the head turns easily through about **45°** and at most about 60°.

| Arrangement | Put it … | Why |
|---|---|---|
| One screen | centred on the keyboard | no twisting |
| Two, used equally | inner edges meeting at the midline, angled in | each lies 0–40° to one side |
| One main, one occasional | main centred, the second beside it, angled in | the main one without turning |
| Three | in an arc, all at the same distance | the edges stay in focus |

Two 24-inch screens side by side and flat at 650 mm put their outer edges about 39° from straight ahead — past the easy range of the eyes, so the head turns. Angling them to face the eyes keeps the distance constant and the edges sharp.

### Glasses
Bifocal and progressive lenses have their reading zone at the bottom: with a high screen the wearer tips the head back to look through it. Lower the screen, or ask an optician about lenses made for screen distance (see [[visual-ergonomics]]).

### Settings
- **Offices and homes:** a screen on an adjustable arm or stand; a laptop on a stand with a separate keyboard (see [[laptops-tablets]]).
- **Control rooms:** personal screens on the console in the same zones, and large shared displays several metres away (see [[control-rooms]]).
- **Workshops and machines:** HMI panels at standing eye height, often touched as well as read — then within reach too (see [[hmi-screens]]).
- **Health care:** screens on carts and bedside arms that must adjust between users of very different heights, sitting and standing (see [[hospital-workstations]]).
- **Vehicles, cockpits and military crew stations:** displays fixed in a cramped space, used by the whole range of crews, sometimes through visors — placed in the preferred zones below the view outside (see [[driver-workspace]], [[crew-stations]]).

> [!tip] In the simulation raise the screen until its top is above the eyes and watch the head tip back; then set two screens flat and angled, and read how far the head must turn to see the far edge.

> [!key] Screen straight ahead, about an arm's length away, the top at or just below eye height, tilted to face the eyes; several screens in an arc, the one used most in the middle.
`,
  ideas: [
    'The eyes like to look slightly down: the screen centre about 15–20° below the horizontal, its top at or just below eye height.',
    'Viewing distance of about 500–1000 mm, farther for bigger screens, with text sized to suit.',
    'Tilt the screen back 10–20° so it faces the line of sight.',
    'The primary screen goes straight ahead; eyes turn easily 15°, the head 45° — several screens form an arc.',
    'With each desk at its user\'s elbow height, eye height above the desk varies only about 60 mm between small and large users.'
  ],
  pitfalls: [
    'The top of the screen should be exactly at eye level for everyone — Level is the upper limit; slightly below is better, and wearers of progressive lenses need it lower still.',
    'The closer the screen, the easier it is to read — Close screens make the eyes focus and converge harder; enlarge the text instead.',
    'Two screens should both be straight ahead — Only one thing can be straight ahead: centre the one used most, or join two equally used screens at the midline.'
  ],
  formulas: [
    {
      name: 'Gaze angle below the horizontal',
      expr: 'alpha = atan((he - hc)/d)', tex: '\\alpha = \\arctan\\frac{h_{eye} - h_c}{d}',
      vars: {
        alpha: { name: 'gaze angle below the horizontal', q: 'angle', unit: '°', signed: true, tex: '\\alpha' },
        he: { name: 'eye height above the floor', q: 'length', unit: 'mm', value: 1170, tex: 'h_{eye}' },
        hc: { name: 'height of the point viewed (screen centre)', q: 'length', unit: 'mm', value: 990, tex: 'h_c' },
        d: { name: 'horizontal distance from the eyes', q: 'length', unit: 'mm', value: 650, tex: 'd' }
      },
      note: 'Negative when the point is above the eyes. Aim for 15–20° to the screen centre.',
      stories: { alpha: 'A user\'s eyes are {he} above the floor and the screen centre {hc}, at {d} from the eyes. How far below the horizontal does she look?', hc: 'Eyes at {he}, a screen at {d}: at what height should the screen centre be for a gaze angle of {alpha}?' }
    },
    {
      name: 'Screen height from its diagonal',
      expr: 'H = D*b/sqrt(a^2 + b^2)', tex: 'H = \\frac{D\\,b}{\\sqrt{a^2 + b^2}}',
      vars: {
        H: { name: 'picture height', q: 'length', unit: 'mm', tex: 'H' },
        D: { name: 'screen diagonal', q: 'length', unit: 'in', value: 24, tex: 'D' },
        a: { name: 'aspect ratio, width part (16 for 16:9)', value: 16, tex: 'a' },
        b: { name: 'aspect ratio, height part (9 for 16:9)', value: 9, tex: 'b' }
      },
      note: 'The width is D·a/√(a² + b²). A 24-inch 16:9 screen is about 531 × 299 mm.',
      stories: { H: 'How tall is the picture of a {D} screen with an aspect ratio of {a} to {b}?' }
    },
    {
      name: 'Angle a screen subtends at the eye',
      expr: 'theta = 2*atan(w/(2*d))', tex: '\\theta = 2\\arctan\\frac{w}{2d}',
      vars: {
        theta: { name: 'angle subtended by the screen width', q: 'angle', unit: '°', tex: '\\theta' },
        w: { name: 'screen width', q: 'length', unit: 'mm', value: 531 },
        d: { name: 'viewing distance', q: 'length', unit: 'mm', value: 650 }
      },
      note: 'For a centred screen the edges lie θ/2 to each side; keep them within about ±15–35° for eye movements alone.',
      stories: { theta: 'A screen {w} wide is viewed from {d}. What angle does it span?', d: 'How far away must a screen {w} wide be for it to span {theta}?' }
    }
  ],
  examples: [
    {
      title: 'Setting the screen height',
      q: 'A 50th-percentile woman sits at 430 mm; her eye height sitting is 740 mm and her desk is at her elbow height, 665 mm. Her 24-inch 16:9 screen (299 mm tall) is 650 mm away, with its top 30 mm below her eyes. How high above the desk is the top, and at what angle does she look at the centre?',
      steps: [
        'Eye height above the floor: $430 + 740 = 1170$ mm.',
        'Screen top: $1170 - 30 = 1140$ mm, which is $1140 - 665 = 475$ mm above the desk.',
        'Screen centre: $1140 - 299/2 = 990$ mm, 180 mm below the eyes.',
        'Gaze angle: $\\arctan(180/650) = 15.5°$ — within the 15–20° recommendation.'
      ],
      a: 'The top 475 mm above the desk; the gaze to the centre 15.5° below the horizontal.'
    },
    {
      title: 'Two screens, flat or angled',
      q: 'Two 24-inch screens (531 mm wide each) are used equally, their inner edges meeting in front of the user at 650 mm. How far to the side is each outer edge if they stand flat, and if each is angled to face the eyes?',
      steps: [
        'Flat: the outer edge is 531 mm to the side at 650 mm: $\\arctan(531/650) = 39°$.',
        'Angled to face the eyes (each screen on the circle of radius 650 mm): each spans $2\\arctan(265.5/650) = 44°$, so the outer edge is 44° off — but at the same 650 mm, so it stays sharp.',
        'Either way the eyes alone (easy to about 15°) cannot reach the edges: the head turns, comfortably, by up to about 30°.'
      ],
      a: 'About 39° (flat, and farther away) or 44° (angled, at the same distance).'
    }
  ],
  quiz: [
    { q: 'The top of a screen is 100 mm above a user\'s eyes, 600 mm away. What happens?', choices: ['The head tips back, loading the neck, and the eyes open wider and dry out', 'Nothing: looking up is relaxing', 'The eyes converge more', 'The screen reflects less'], a: 0, why: 'Looking up extends the neck and widens the eye opening; the screen top belongs at or below eye height.' },
    { q: 'The bigger the screen, the closer it should stand.', a: false, why: 'Larger screens go farther back, so the whole picture stays within easy eye movements; the text is larger anyway.' },
    { q: 'Two screens are used equally. Where do they go?', choices: ['Inner edges meeting at the midline, both angled towards the user', 'One straight ahead, one far to the side', 'Stacked one above the other at eye level', 'Both flat against the wall'], a: 0, why: 'Neither is primary, so they share the centre and turn to face the eyes.' },
    { q: 'A user with progressive lenses tilts her head back to read her screen. What helps?', choices: ['Lower the screen, or use lenses made for screen distance', 'Raise the screen', 'Move the screen closer', 'Increase the screen brightness'], a: 0, why: 'The reading zone is at the bottom of the lens; a lower screen, or single-vision screen glasses, lets her keep her head upright.' },
    { q: 'At a desk set to each user\'s own elbow height, how much does eye height above the desk differ between the 5th-percentile woman and the 95th-percentile man?', choices: ['About 60 mm', 'About 300 mm', 'About 150 mm', 'Nothing'], a: 0, why: 'Eye height above the desk is eye height sitting minus elbow rest height: about 497 mm and 558 mm — both grow with body size.' }
  ],
  problems: [
    { q: 'A user\'s eyes are 1250 mm above the floor and the centre of his screen 1050 mm, 700 mm away horizontally. What is the gaze angle below the horizontal?', answer: 15.9, unit: '°', tol: 0.02, steps: ['$\\alpha = \\arctan(200/700) = 15.9°$.'] },
    { q: 'How tall is the picture of a 27-inch screen with a 16:9 aspect ratio?', answer: 336, unit: 'mm', tol: 0.01, steps: ['$D = 27 \\times 25.4 = 685.8$ mm.', '$H = 685.8 \\times 9/\\sqrt{16^2 + 9^2} = 685.8 \\times 0.490 = 336$ mm.'] },
    { q: 'What angle does a screen 600 mm wide span when viewed from 700 mm?', answer: 46.4, unit: '°', tol: 0.02, steps: ['$\\theta = 2\\arctan(300/700) = 2 \\times 23.2° = 46.4°$.'] }
  ],
  ranges: [
    { dim: 'Viewing distance to the screen', range: [500, 1000], unit: 'mm', who: 'Adults with normal or corrected vision, with text sized for the distance', why: 'Close enough to read, far enough to relax focusing and convergence and to see the whole screen.', limits: 'Large screens need the far end; older eyes with reading glasses may see sharply only over a short band of distances.', setting: ['office', 'civil'], src: 'US OSHA computer workstations eTool (20–40 in)' },
    { dim: 'Gaze angle to the screen centre, below the horizontal', range: [15, 20], unit: '°', who: 'Seated users with the head upright', why: 'The eyes look comfortably down, the neck stays upright and the eyelids lower, which keeps the eyes moist.', limits: 'Wearers of bifocal or progressive lenses need a lower screen or screen glasses; very large screens bring the top edge near eye level.', setting: 'office', src: 'US OSHA computer workstations eTool' },
    { dim: 'Top of the screen relative to eye height', range: '0–100 mm below eye height', unit: '', who: 'Every user, measured from their own eye height', why: 'Keeps the whole screen at or below the horizontal, so the head never tips back.', limits: 'Follows from the gaze angle and the screen size; tall screens and progressive lenses need the top lower still.', setting: 'office', src: 'Derived from the recommended gaze angle' },
    { dim: 'Screen tilt back from vertical', range: [10, 20], unit: '°', who: 'Screens viewed from above, at 15–20° below the horizontal', why: 'The screen face is at right angles to the line of sight, so its top and bottom are equally sharp.', limits: 'Tilting back faces the ceiling lights: check for reflections and move them.', setting: 'office', src: 'US OSHA computer workstations eTool' },
    { dim: 'Primary screen, angle from straight ahead', range: [0, 15], unit: '°', who: 'Easy eye rotation, for everyone', why: 'The screen used most is seen without turning the head or trunk.', limits: 'Wide single screens reach beyond it at the edges; move them back.', setting: ['office', 'workshop', 'military'], src: 'MIL-STD-1472, visual field figures' },
    { dim: 'Secondary screens, outer edge from straight ahead', range: [null, 45], unit: '°', who: 'Easy head rotation (the eyes add about 15° more)', why: 'Glances to the side screen take a comfortable head turn, not a twist of the trunk.', limits: 'A side screen watched for long periods belongs in the centre; beyond about 60°, turn the chair.', setting: ['office', 'workshop', 'military'], src: 'MIL-STD-1472, visual field figures' }
  ],
  applications: [
    'Setting up a workstation: fit the chair, then the desk, then the screen height, distance and tilt.',
    'Planning dual- and triple-screen desks for trading, design and control work.',
    'Monitor arms and stands with enough height adjustment for fixed desks.',
    'Checking a screen position for any person in [the workstation fitter](#/tools/workstation/sitting).'
  ],
  history: 'Early screen-work rules put the top of the screen at eye level. Studies in the 1980s — among them Etienne Grandjean\'s group in Zürich — found that operators left to set their own workstations leaned back and placed their screens farther away than the rules of the day said, and later work on gaze and neck posture supported a lower screen. Flat panels on arms made height, distance and tilt easy to change; multi-screen desks brought the visual-field limits long used in military crew stations into the office.',
  sources: [
    'ISO 9241-5, *Ergonomic requirements for office work with visual display terminals — Workstation layout and postural requirements*.',
    'US Occupational Safety and Health Administration, *Computer Workstations eTool* (monitor position).',
    'MIL-STD-1472, *Human Engineering* (US Department of Defense), the visual field figures.',
    'ANSI/HFES 100-2007, *Human Factors Engineering of Computer Workstations*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on screen workstations.'
  ],
  sim: 'ws-monitor'
},

{
  id: 'keyboard-mouse', parent: 'seated-work', title: 'Keyboards, mice and input devices', level: 2,
  short: 'Keys and mouse belong close to the body at or just below elbow height, so the upper arms hang relaxed, the forearms are about level and the wrists are straight. Compact keyboards bring the mouse in; negative tilt, split keyboards and vertical mice straighten the wrist further.',
  keywords: ['keyboard height', 'mouse position', 'wrist extension', 'ulnar deviation', 'keyboard tilt', 'negative slope', 'split keyboard', 'compact keyboard', 'tenkeyless', 'vertical mouse', 'trackball', 'palm rest', 'carpal tunnel', 'RSI', 'input devices', 'pointer gain'],
  prereq: ['desk-height', 'neutral-postures', 'repetitive-strain'],
  related: ['reach-zones', 'laptops-tablets', 'fitts-law', 'hand-foot-head', 'joint-ranges', 'strength-and-force', 'controls-design', 'hmi-screens', 'office-chair'],
  body: `
The hands spend the working day on the keyboard and the mouse, repeating small movements thousands of times. Each movement is harmless; what adds up is **posture held while repeating** — shoulders raised, wrists bent back or sideways, an arm reaching out to a distant mouse. The aim is simple: keys and mouse **close to the body at about elbow height**, so that the upper arms hang, the forearms are about level and the wrists are straight.

### The neutral typing posture
| Joint | Aim | Set by |
|---|---|---|
| Shoulders | relaxed, not raised; upper arms hanging near the body | keyboard at or below elbow height, close to the body |
| Elbows | open, about 90–120° | keyboard height and distance |
| Wrists, up and down | nearly straight: extension no more than about 15° | keyboard height, slope, palm rest |
| Wrists, sideways | nearly straight: little bend towards the little finger | keyboard width, split keyboards |
| Mouse arm | beside the body, not reaching out | compact keyboard, mouse close |

Pressure in the carpal tunnel, through which the median nerve and the finger tendons pass, is lowest near a straight wrist and rises as it bends back or forward (see [[repetitive-strain]]).

### Height and slope
Put the **home row at elbow height or up to about 50 mm below it**. A keyboard higher than the elbows lifts the shoulders; one far below them tips the forearms down and makes the wrists bend back to reach the keys. The keyboard's own legs add slope and more extension; folding them, or tilting the keyboard **away** from the user on a lowered tray (a negative slope), straightens the wrist — as Hedge and Powers showed in 1995. A palm rest is for pauses: resting the heel of the hand on it *while* typing bends the wrist back.

### Width: why the mouse ends up far out
A full-size keyboard is about 440–460 mm wide, with the number pad on the right. With the letter keys centred on the body, a right-hand mouse lands about **360 mm right of the midline** — some 150 mm outside the shoulder, so the arm reaches out and rotates for hours. A keyboard without the number pad (tenkeyless, about 370 mm) brings the mouse to about 275 mm; a compact one (about 300 mm) to about 205 mm, almost under the shoulder. Other remedies: a separate number pad on the left, the mouse on the left (a full keyboard has little to the left of its letters) or a central pointing device.

### Straight keyboards bend the wrists sideways
The elbows sit roughly shoulder-width apart, about ±200 mm from the midline, but on a straight keyboard the hands meet at about ±60 mm. The forearms converge, and to keep the fingers in line with the keys the wrists bend towards the little fingers by about $\\arctan\\big((x_e - x_h)/L\\big)$ — some 28° for a 260 mm forearm. **Split and angled keyboards** let each hand sit in line with its forearm.

### Mice and other pointing devices
| Device | Virtue | Limitation |
|---|---|---|
| Ordinary mouse | fast, precise, familiar | forearm turned fully palm-down; far out beside a wide keyboard |
| Vertical mouse | hand in a handshake posture, less forearm twist | a new grip to learn; size must fit the hand |
| Trackball | no arm movement; works in cramped or moving places | thumb or finger load; slower for some tasks |
| Touchpad, central roller bar | in the middle, no reaching | small movements repeated by one finger |
| Pen and tablet | a natural grip for drawing | reach to the tablet |
| Keyboard shortcuts | no pointing at all | must be learned |

The time to point grows with the [[?logarithm]] of distance over target size ([[fitts-law]]); a higher pointer gain moves the pointer farther for less hand movement, at some cost in precision. Alternating hands and devices spreads the load.

### Settings
- **Offices and homes:** the arrangement above; laptops need a separate keyboard and mouse for long work (see [[laptops-tablets]]).
- **Control rooms:** several systems mean several keyboards and mice — a shared keyboard-and-mouse switch cuts the reaching (see [[control-rooms]]).
- **Workshops and industry:** sealed keyboards and touch panels used with gloves need larger keys and targets (see [[hmi-screens]]).
- **Military and vehicles:** trackballs and joysticks are common because they work while the vehicle or ship moves, and with gloved hands (see [[crew-stations]]).
- **Health care:** cleanable keyboards on carts, used standing (see [[hospital-workstations]]).

> [!tip] In the simulation lower the keyboard 100 mm below the elbow with resting wrists, then add a negative tilt and a palm rest; in the top view switch to a compact keyboard and watch the mouse come in.

> [!warn] Tingling, numbness or pain in the hands, at night or at work, can be an early sign of a nerve or tendon problem. Do not work through it: see a doctor or physiotherapist and have the workstation checked.

> [!key] Keys and mouse close, at or just below elbow height; wrists straight in both directions; the mouse beside the letter keys, not beyond a number pad.
`,
  ideas: [
    'Home row at elbow height or up to 50 mm below; shoulders relaxed, elbows open 90–120°.',
    'Keyboards far below the elbows, keyboard legs and palm rests used while typing all bend the wrists back.',
    'A number pad pushes a right-hand mouse about 150 mm outside the shoulder; compact keyboards bring it back.',
    'On a straight keyboard the forearms converge, bending the wrists sideways; split keyboards straighten them.',
    'Alternative pointing devices trade one load for another: choose for the task and alternate.'
  ],
  pitfalls: [
    'A palm rest is for resting the wrists while typing — Resting the heel of the hand while typing bends the wrist back; the rest is for pauses.',
    'Keyboard legs should be folded out to make typing easier — They raise the back rows and increase wrist extension; flat or negative slope is better.',
    'The mouse position hardly matters as long as it is on the desk — Reaching 150 mm outside the shoulder all day loads the shoulder; keep it next to the letter keys.'
  ],
  formulas: [
    {
      name: 'Forearm angle from the keyboard height',
      expr: 'beta = asin((hw - he)/Lf)', tex: '\\beta = \\arcsin\\frac{h_w - h_e}{L_f}',
      vars: {
        beta: { name: 'forearm angle above the horizontal (negative: sloping down)', q: 'angle', unit: '°', signed: true, tex: '\\beta' },
        hw: { name: 'wrist height above the floor', q: 'length', unit: 'mm', value: 610, tex: 'h_w' },
        he: { name: 'elbow joint height above the floor', q: 'length', unit: 'mm', value: 690, tex: 'h_e' },
        Lf: { name: 'forearm length, elbow to wrist', q: 'length', unit: 'mm', value: 250, tex: 'L_f' }
      },
      note: 'A forearm sloping down means the hand must bend back to reach level keys: wrist extension is roughly the hand angle minus β.',
      stories: { beta: 'A user\'s wrists rest at {hw} and his elbows are at {he}; his forearm is {Lf} long. At what angle does the forearm slope?', hw: 'For a forearm of {Lf} and elbows at {he}, how high must the wrists be for a forearm angle of {beta}?' }
    },
    {
      name: 'Sideways wrist bend on a straight keyboard',
      expr: 'u = atan((xe - xh)/L)', tex: 'u = \\arctan\\frac{x_e - x_h}{L}',
      vars: {
        u: { name: 'ulnar deviation (bend towards the little finger)', q: 'angle', unit: '°', tex: 'u' },
        xe: { name: 'elbow distance from the body midline', q: 'length', unit: 'mm', value: 200, tex: 'x_e' },
        xh: { name: 'hand distance from the midline on the keys', q: 'length', unit: 'mm', value: 60, tex: 'x_h' },
        L: { name: 'forearm length in plan', q: 'length', unit: 'mm', value: 260, tex: 'L' }
      },
      note: 'Plan view. On a split keyboard x_h grows (and angled halves take away more), so u falls.',
      stories: { u: 'The elbows sit {xe} from the midline, the hands {xh} from it on the keys, and the forearms are {L} long. How far must the wrists bend sideways?', xh: 'Elbows at {xe} from the midline, forearms {L} long: how far apart must each hand be from the midline for a bend of {u}?' }
    },
    {
      name: 'Pointer gain',
      expr: 'dh = ds/G', tex: 'd_h = \\frac{d_s}{G}',
      vars: {
        dh: { name: 'hand movement', q: 'length', unit: 'mm', tex: 'd_h' },
        ds: { name: 'pointer travel on the screen', q: 'length', unit: 'mm', value: 300, tex: 'd_s' },
        G: { name: 'pointer gain (screen movement ÷ hand movement)', value: 3, tex: 'G' }
      },
      note: 'Operating systems vary the gain with speed; the average is a useful guide. More gain, less arm movement, less precision.',
      stories: { dh: 'The pointer must cross {ds} of screen with a gain of {G}. How far does the hand move?' }
    }
  ],
  examples: [
    {
      title: 'Where does the mouse go?',
      q: 'The letter block of a keyboard is 286 mm wide and centred on the body. A full keyboard adds a 57 mm arrow cluster and a 76 mm number pad, with 10 mm gaps and a 10 mm frame; a mouse 70 mm wide sits 20 mm to the right. The shoulder joint is 210 mm from the midline and the mouse 330 mm in front of it. How far out is the mouse, and how far does the arm swing out, for a full, a tenkeyless (no pad) and a compact (letters only, 5 mm frame) keyboard?',
      steps: [
        'Full: right edge $143 + 10 + 57 + 10 + 76 + 10 = 306$ mm; mouse centre $306 + 20 + 35 = 361$ mm; swing $\\arctan(151/330) = 25°$.',
        'Tenkeyless: $143 + 10 + 57 + 10 = 220$ mm; mouse at 275 mm; swing $\\arctan(65/330) = 11°$.',
        'Compact: $143 + 5 = 148$ mm; mouse at 203 mm, 7 mm inside the shoulder: no swing.',
        'A left-hand mouse beside a full keyboard sits, like the compact case, near 205 mm.'
      ],
      a: 'About 360, 275 and 205 mm from the midline; the arm swings out about 25°, 11° and 0°.'
    },
    {
      title: 'Straight and split keyboards',
      q: 'The elbows are 200 mm from the midline and the forearms 260 mm long. On a straight keyboard the hands sit 60 mm from the midline; on a split keyboard with a 200 mm gap they sit 160 mm from it. How much do the wrists bend sideways?',
      steps: [
        'Straight: $u = \\arctan(140/260) = 28°$.',
        'Split: $u = \\arctan(40/260) = 9°$.',
        'Angling each half outward by a few degrees removes most of the rest.'
      ],
      a: 'About 28° on the straight keyboard, about 9° on the split one.'
    }
  ],
  quiz: [
    { q: 'A keyboard sits 100 mm below a user\'s elbows and she rests her wrists on the desk. What happens at the wrist?', choices: ['It bends back (extension) to reach the keys', 'It stays straight', 'It bends forward (flexion)', 'It bends towards the thumb'], a: 0, why: 'The forearm slopes down to the resting wrist, so the hand must tilt up relative to it to reach level keys.' },
    { q: 'A palm rest is meant for resting the wrists on while typing.', a: false, why: 'Typing with the heel of the hand on a rest bends the wrist back; the rest is for pauses between bursts of typing.' },
    { q: 'A right-handed user with a full-size keyboard has pain in the right shoulder. Which change brings the mouse closest to the body?', choices: ['A keyboard without the number pad, or a compact one', 'A larger mouse pad', 'Raising the chair', 'A higher pointer gain'], a: 0, why: 'The number pad and arrow keys push the mouse about 150 mm outside the shoulder; removing them brings it back under the shoulder.' },
    { q: 'Why does a straight keyboard bend the wrists sideways?', choices: ['The elbows are wider apart than the hands, so the forearms converge', 'The keys are too small', 'The keyboard is too high', 'The fingers are too short'], a: 0, why: 'With elbows near shoulder width and hands close together, the forearms angle inwards and the hands bend outwards to line up with the keys.' },
    { q: 'What does a vertical mouse change?', choices: ['It reduces the twist of the forearm by holding the hand in a handshake posture', 'It removes all wrist movement', 'It makes pointing faster', 'It lets the mouse sit farther away'], a: 0, why: 'An ordinary mouse needs the forearm turned fully palm-down; a vertical one needs less of that rotation.' }
  ],
  problems: [
    { q: 'A user\'s wrists rest 90 mm below his elbow joints, and his forearms are 250 mm long. At what angle do the forearms slope down?', answer: 21.1, unit: '°', tol: 0.02, steps: ['$\\beta = \\arcsin(-90/250) = -21.1°$: 21.1° downwards.'] },
    { q: 'Elbows 220 mm from the midline, hands 70 mm from it, forearms 250 mm long. How far do the wrists bend sideways?', answer: 31, unit: '°', tol: 0.02, steps: ['$u = \\arctan(150/250) = 31.0°$.'] },
    { q: 'With a pointer gain of 2.5, how far must the hand move for the pointer to cross 400 mm of screen?', answer: 160, unit: 'mm', tol: 0.01, steps: ['$d_h = 400/2.5 = 160$ mm.'] }
  ],
  ranges: [
    { dim: 'Home row height relative to seated elbow height', range: '0–50 mm below elbow height', unit: '', who: 'Every user, measured at their own elbow with the chair fitted', why: 'Shoulders relaxed, forearms about level, wrists straight.', limits: 'Thick keyboards need the desk lower still; a keyboard tray must not steal thigh room.', setting: ['office', 'civil'], src: 'Derived from the neutral posture; common guidance' },
    { dim: 'Elbow angle while typing', range: [90, 120], unit: '°', who: 'Every user', why: 'An open elbow lets the upper arm hang and the hands reach the keys without reaching forward.', limits: 'Much more than 120° means the keyboard is too far away or too low.', setting: ['office', 'civil'], src: 'US OSHA computer workstations eTool (neutral postures)' },
    { dim: 'Wrist extension (bending back) while typing', range: [0, 15], unit: '°', who: 'Every user; repetitive keying', why: 'Keeps the pressure in the carpal tunnel and the load on the forearm tendons low.', limits: 'Around 20° is common and tolerable in short spells; long, repetitive work should stay nearer straight.', setting: ['office', 'workshop'], src: 'Common ergonomic guidance on neutral wrist posture' },
    { dim: 'Sideways wrist bend (towards the little finger)', range: [0, 10], unit: '°', who: 'Every user; repetitive keying', why: 'Keeps the tendons running straight through the wrist.', limits: 'A straight keyboard gives 20–30° to most users; split or angled keyboards bring it down.', setting: ['office', 'workshop'], src: 'Common ergonomic guidance on neutral wrist posture' },
    { dim: 'Mouse, distance from the body midline', range: [null, 250], unit: 'mm', who: 'Close to the shoulder joint of the smallest users (about 200 mm from the midline)', why: 'The upper arm hangs by the side instead of reaching out and rotating all day.', limits: 'A full keyboard puts a right-hand mouse near 360 mm: use a compact keyboard, a left-hand mouse or a central device.', setting: ['office', 'civil'], src: 'Derived from shoulder breadth and keyboard widths' },
    { dim: 'Keyboard slope', range: '0° (legs folded) or tilted away from the user', unit: '', who: 'Keyboards at or below elbow height', why: 'Removes the wrist extension that a front-low, back-high keyboard adds.', limits: 'A negative slope needs a tray below elbow height; on a desk top, simply fold the legs.', setting: 'office', src: 'Hedge and Powers, Ergonomics, 1995' }
  ],
  applications: [
    'Choosing keyboards for a department: compact or tenkeyless by default, number pads as separate units for those who need them.',
    'Keyboard trays with negative tilt for users whose desks cannot be lowered.',
    'Trackballs and joysticks for vehicles, ships and cramped consoles; larger targets for gloved hands.',
    'Pointing speed and target size in [[fitts-law|Fitts\'s law]] for designing screens and panels.'
  ],
  history: 'The QWERTY layout was set for mechanical typewriters in the 1870s. Split keyboards were studied from the 1920s, when August Klockenberg described the strain of the straight typewriter keyboard, and came to market in the 1990s. Douglas Engelbart\'s group demonstrated the mouse in 1968; with graphical interfaces in the 1980s it became the most used pointing device, and its position beside the keyboard became a leading ergonomic question of office work.',
  sources: [
    'ISO 9241-410, *Ergonomics of human-system interaction — Design criteria for physical input devices*.',
    'A. Hedge and J. R. Powers, Wrist postures while keyboarding: effects of a negative slope keyboard system and full motion forearm supports, *Ergonomics*, 1995.',
    'ANSI/HFES 100-2007, *Human Factors Engineering of Computer Workstations* (input devices).',
    'US Occupational Safety and Health Administration, *Computer Workstations eTool* (keyboards, pointers, neutral postures).',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on keyboards and pointing devices.'
  ],
  sim: 'ws-keyboard'
},

{
  id: 'laptops-tablets', parent: 'seated-work', title: 'Laptops, tablets and phones', level: 1,
  short: 'A laptop joins its screen to its keyboard, so one of them is always in the wrong place. Short sessions are fine anywhere; for long ones, raise the screen and add a keyboard and mouse. Tablets and phones pull the head further down — raise the device, not the neck, and change posture often.',
  keywords: ['laptop', 'notebook', 'tablet', 'smartphone', 'phone', 'text neck', 'head flexion', 'neck posture', 'laptop stand', 'docking station', 'external keyboard', 'hybrid work', 'working from home', 'mobile devices', 'head inclination', 'ISO 11226'],
  prereq: ['monitor-placement', 'keyboard-mouse', 'neutral-postures'],
  related: ['visual-ergonomics', 'field-computing', 'static-muscle-work', 'spinal-loading', 'sofas-lounge', 'hmi-screens', 'school-furniture', 'physics:torque'],
  body: `
A laptop joins the screen to the keyboard, so one of them is always in the wrong place: with the keys at elbow height the screen is far below the eyes; with the screen at eye height the keys are up at the chin. For short sessions it hardly matters. For hours a day it does — and tablets and phones pull the head further down still.

### The head as a weight on a lever
The head weighs about 7 % of the body — some 4.5–6 kg. Upright, it balances on the neck; as it tips forward its centre of mass moves in front of the neck, and the neck muscles must hold a moment that grows with the [[?sine-cosine|sine]] of the angle ([[physics:torque|torque]]):

$$M = m\\,g\\,L\\,\\sin\\theta$$

With a 5.5 kg head whose centre of mass is about 150 mm from the base of the neck (a simple model), tipping it 45° forward asks the neck muscles for about 5.7 N·m — held for as long as the gaze stays down. ISO 11226, the standard on static working postures, treats a head inclined forward by **up to about 25°** as acceptable for sustained work; beyond that the acceptable holding time falls quickly.

### How far down does each device pull the gaze?
| Device and position | Gaze below the horizontal | Head inclination / neck bent on the trunk (model*) |
|---|---|---|
| Screen on a stand, top near eye height | 15–20° | about 0–5° / 0–5° |
| Laptop on a desk | 30–40° | about 15–20° / about 20° |
| Laptop on the lap, leaning back on a sofa | 40–50° | about 20–25° / about 40° |
| Tablet flat on a desk or in the lap | 50–60° | about 30–35° / 25–35° |
| Phone held at chest height | 50–60° | about 30–35° / about 35° |

*The simulation's simple model: the eyes take the first 15° below the horizontal and the head about four-fifths of the rest. Leaning back keeps the head near vertical but bends the neck further on the trunk; ISO 11226 limits both. Real people vary widely.

### What helps
1. **For long work, dock it:** an external screen (or the laptop raised on a stand so the top line is near eye height) plus a separate keyboard and mouse at elbow height — the ordinary workstation of [[monitor-placement]] and [[keyboard-mouse]].
2. **For shorter work on the move:** raise the laptop on a bag or books, lean back against a backrest with the laptop on a lap cushion, and change posture every 20–30 minutes.
3. **Tablets:** use a stand that tilts the screen **45–70° from horizontal**, so its face is at right angles to the gaze; add a keyboard for writing; hold it higher when reading, elbows supported.
4. **Phones:** raise the phone rather than bending the head, support the elbows, enlarge the text, use voice input, and look away often.

Handheld screens are also held close — people read phones at about **30–40 cm** (Bababekova and colleagues, 2011) — which makes the eyes focus hard, a burden that grows after 40 (see [[visual-ergonomics]]).

### Settings
- **Home and hybrid work:** kitchen tables, sofas and beds — a stand, a separate keyboard and mouse and a proper chair turn a laptop into a workstation (see [[sofas-lounge]]).
- **Offices and hot desks:** a docking station with a screen, keyboard and mouse at every shared desk.
- **Schools and universities:** children and students on tablets and laptops for hours, in furniture rarely sized for them (see [[school-furniture]]).
- **Field work and vehicles:** rugged laptops and tablets on bonnets, tailgates and vehicle mounts, in sun and cold, with gloves (see [[field-computing]]).
- **Health care:** tablets and workstations on wheels at the bedside, often used standing — the height must adjust (see [[hospital-workstations]]).
- **Military:** rugged handhelds used with gloves, helmets and body armour, which limit how far the head can bend and the hands can reach (see [[personal-equipment-fit]]).

> [!tip] In the simulation go through the devices one by one and watch the gaze line, the head angle and the neck moment; then compare *Laptop on a desk* with *Laptop on a stand, separate keyboard*.

> [!key] A laptop's screen and keyboard cannot both be right. For long work separate them — screen up, keys down; for short work change posture often; with tablets and phones, raise the device, not the eyebrows.
`,
  ideas: [
    'A laptop cannot have both its screen at eye level and its keyboard at elbow height.',
    'The neck moment grows with the sine of the head\'s forward angle: at 45° it is about twice that at 20°.',
    'ISO 11226 accepts a head inclined forward by up to about 25° for sustained work.',
    'Tablets and phones pull the gaze 45–65° down; stands, raised devices and supported elbows help.',
    'For long work, dock the laptop: external screen or stand, separate keyboard and mouse.'
  ],
  pitfalls: [
    'A laptop is ergonomic because it is light and small — Its size is for carrying; for work its joined screen and keyboard force either the neck or the arms into a poor posture.',
    'Looking down with the eyes costs the neck nothing — Beyond about 15° the head joins in, and the load on the neck grows with the sine of its angle.',
    'Holding the phone at eye level solves everything — It straightens the neck but raises the arms; support the elbows or use a stand.'
  ],
  formulas: [
    {
      name: 'Neck moment of a forward-tipped head',
      expr: 'M = m*g*L*sin(theta)', tex: 'M = m\\,g\\,L\\,\\sin\\theta',
      vars: {
        M: { name: 'moment the neck muscles must hold', q: 'torque', unit: 'N·m', tex: 'M' },
        m: { name: 'mass of the head (about 7 % of body mass)', q: 'mass', unit: 'kg', value: 5.5, tex: 'm' },
        g: { const: 'g' },
        L: { name: 'distance from the base of the neck to the head\'s centre of mass', q: 'length', unit: 'mm', value: 150, tex: 'L' },
        theta: { name: 'forward inclination of the head from upright', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'A simple lever model, measured from the upright, balanced head. It shows the trend, not a precise load.',
      stories: { M: 'A {m} head with its centre of mass {L} from the neck tips forward by {theta}. What moment must the neck muscles hold?', theta: 'A {m} head, {L} lever: at what forward angle does the neck moment reach {M}?' }
    },
    {
      name: 'Gaze angle to a handheld or low screen',
      expr: 'alpha = atan(v/d)', tex: '\\alpha = \\arctan\\frac{v}{d}',
      vars: {
        alpha: { name: 'gaze angle below the horizontal', q: 'angle', unit: '°', tex: '\\alpha' },
        v: { name: 'drop from the eyes to the screen centre', q: 'length', unit: 'mm', value: 350, tex: 'v' },
        d: { name: 'horizontal distance from the eyes', q: 'length', unit: 'mm', value: 300, tex: 'd' }
      },
      stories: { alpha: 'A phone is held {v} below the eyes and {d} in front of them. How far down does the user look?', v: 'At {d} in front of the eyes, how far below them can a phone be for a gaze angle of {alpha}?' }
    },
    {
      name: 'Screen tilt that faces the gaze',
      expr: 'phi = pi/2 - alpha', tex: '\\varphi = 90^\\circ - \\alpha',
      vars: {
        phi: { name: 'screen angle from the horizontal', q: 'angle', unit: '°', tex: '\\varphi' },
        alpha: { name: 'gaze angle below the horizontal', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\alpha' }
      },
      note: 'A screen at this angle is at right angles to the line of sight: sharp all over and least prone to reflections from above.',
      stories: { phi: 'A tablet on a desk is viewed {alpha} below the horizontal. At what angle from horizontal should its stand hold it?' }
    }
  ],
  examples: [
    {
      title: 'A laptop on a desk',
      q: 'A 50th-percentile woman\'s eyes are 505 mm above her desk (the desk at her elbow height). Her laptop\'s screen centre is 110 mm above the desk and 550 mm in front of her eyes. What is her gaze angle, and — with the simple model (eyes take 15°, the head four-fifths of the rest) — her head inclination?',
      steps: [
        'Drop from the eyes to the screen centre: $505 - 110 = 395$ mm.',
        'Gaze angle: $\\arctan(395/550) = 35.7°$.',
        'Head inclination: $0.8 \\times (35.7 - 15) = 16.6°$ — inside the 25° of ISO 11226, but held all day.',
        'On a stand with its centre 180 mm below the eyes at 650 mm the gaze is 15.5° and the head stays upright.'
      ],
      a: 'Gaze about 36° down, head about 17° forward; on a stand, 15.5° and upright.'
    },
    {
      title: 'The neck moment of a phone user',
      q: 'A 5.5 kg head has its centre of mass 150 mm from the base of the neck. Compare the neck moment with the head tipped 10° and 45° forward.',
      steps: [
        '$M_{10} = 5.5 \\times 9.81 \\times 0.15 \\times \\sin 10° = 1.4$ N·m.',
        '$M_{45} = 5.5 \\times 9.81 \\times 0.15 \\times \\sin 45° = 5.7$ N·m.',
        'Four times the load, held for as long as the reading goes on.'
      ],
      a: 'About 1.4 N·m at 10° and 5.7 N·m at 45°.'
    }
  ],
  quiz: [
    { q: 'Why can a laptop on its own never give an ideal posture?', choices: ['Its screen and keyboard are joined: if one is at the right height, the other is not', 'Its screen is too small', 'Its keyboard has too few keys', 'It is too light'], a: 0, why: 'The screen should be near eye height and the keyboard at elbow height — about 500 mm apart vertically — but the laptop hinges them together.' },
    { q: 'Bending the head forward by 45° roughly doubles the neck moment compared with 20°.', a: true, why: 'The moment grows with sin θ: sin 45° / sin 20° = 0.71 / 0.34 ≈ 2.1.' },
    { q: 'What is the best set-up for a laptop used six hours a day?', choices: ['A stand or external screen at eye height with a separate keyboard and mouse', 'On the lap on a sofa', 'Flat on the desk, with a cushion on the chair', 'On a high table, used standing'], a: 0, why: 'Separating the screen from the keyboard lets both be placed right, as at a desktop workstation.' },
    { q: 'A tablet on a desk is viewed 30° below the horizontal. At what angle from the horizontal should its stand hold it so the screen faces the eyes?', choices: ['60°', '30°', '90°', '15°'], a: 0, why: 'A screen faces the gaze when its angle from horizontal is 90° minus the gaze angle.' },
    { q: 'Which of these keeps the head most upright?', choices: ['A laptop on a stand with a separate keyboard', 'A laptop on a desk', 'A tablet in the lap', 'A phone at chest height'], a: 0, why: 'Only the stand brings the screen near eye height; the others pull the gaze 35–65° down.' }
  ],
  problems: [
    { q: 'A 5 kg head, centre of mass 150 mm from the base of the neck, tips 30° forward. What moment must the neck muscles hold?', answer: 3.68, unit: 'N·m', tol: 0.02, steps: ['$M = 5 \\times 9.81 \\times 0.15 \\times \\sin 30° = 3.68$ N·m.'] },
    { q: 'A phone is held 300 mm below the eyes and 250 mm in front of them. What is the gaze angle below the horizontal?', answer: 50.2, unit: '°', tol: 0.02, steps: ['$\\alpha = \\arctan(300/250) = 50.2°$.'] },
    { q: 'A tablet on a stand is viewed 25° below the horizontal. At what angle from the horizontal should the stand hold it?', answer: 65, unit: '°', tol: 0.01, steps: ['$\\varphi = 90° - 25° = 65°$.'] }
  ],
  ranges: [
    { dim: 'Head inclination for sustained screen work', range: [0, 25], unit: '°', who: 'Everyone; the longer the holding time, the more it matters', why: 'Keeps the static load on the neck muscles low enough to hold for long periods.', limits: 'Beyond about 25° the acceptable holding time falls quickly; ISO 11226 also limits how far the head may bend relative to the trunk.', setting: 'all', src: 'ISO 11226' },
    { dim: 'Laptop used for long work: top of its screen', range: '0–100 mm below eye height (on a stand)', unit: '', who: 'Every user, with a separate keyboard and mouse', why: 'Brings the laptop screen into the same zone as a desktop screen, so the head stays upright.', limits: 'Needs a stand plus a keyboard and mouse to carry; without them, keep sessions short.', setting: ['office', 'civil', 'field'], src: 'As for desktop screens (monitor placement)' },
    { dim: 'Tablet stand angle from the horizontal', range: [45, 70], unit: '°', who: 'Tablets on a desk viewed 20–45° below the horizontal', why: 'The screen faces the gaze: sharp, fewer reflections and less head bending than lying flat.', limits: 'Steep angles are awkward for touching and writing; add a keyboard, or tilt lower for drawing.', setting: ['office', 'school', 'civil'], src: 'Derived from the gaze angle' },
    { dim: 'Change of posture when working on mobile devices', range: [20, 30], unit: 'min', who: 'Anyone working on a laptop, tablet or phone away from a desk', why: 'Relieves the static neck and shoulder load that no mobile posture avoids.', limits: 'A rule of thumb, not a tested limit; long work belongs at a proper workstation.', setting: ['civil', 'field', 'school'], src: 'Common guidance' },
    { dim: 'Typical reading distance of phones (observed)', range: [300, 400], unit: 'mm', who: 'Young adults reading messages and web pages', why: 'Shows how hard the eyes must focus: 2.5–3.3 dioptres, more than for a desk screen.', limits: 'An observation, not a recommendation: larger text allows a longer distance, and after 40 the eyes may not focus this close.', setting: 'civil', src: 'Bababekova and colleagues, Optometry and Vision Science, 2011' }
  ],
  applications: [
    'Hybrid-work kits: a laptop stand, a compact keyboard and a mouse for every home worker.',
    'Docking stations at hot desks, so a laptop becomes a full workstation in seconds.',
    'Tablet stands and cases that hold 45–70°, for classrooms, kiosks and bedside use.',
    'Rugged field computers on adjustable vehicle mounts rather than on laps.'
  ],
  history: 'Portable computers appeared in the early 1980s and the folding laptop with its keyboard in front of the screen became the standard shape by the 1990s. Touchscreen smartphones (from 2007) and tablets (from 2010) moved much reading and writing into the hands and laps of their users, and the forward-bent posture of phone use gained the popular name "text neck". Research since has measured large head and neck flexion with tablets and phones and has shaped advice on stands, raised devices and breaks.',
  sources: [
    'ISO 11226, *Ergonomics — Evaluation of static working postures*.',
    'M. Bababekova and colleagues, Font size and viewing distance of handheld smart phones, *Optometry and Vision Science*, 2011.',
    'P. de Leva, Adjustments to Zatsiorsky–Seluyanov\'s segment inertia parameters, *Journal of Biomechanics*, 1996 (body segment masses).',
    'US Occupational Safety and Health Administration, *Computer Workstations eTool*.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*.'
  ],
  sim: 'ws-laptop'
},

{
  id: 'visual-ergonomics', parent: 'seated-work', title: 'Visual ergonomics at the screen', level: 2,
  short: 'Comfortable screen work needs text big enough for the distance (a capital at least 16, better 20–22 minutes of arc), a distance the eyes can focus at comfortably — which moves outward after 40 — good contrast without glare, and regular breaks to blink and look far away.',
  keywords: ['visual ergonomics', 'eye strain', 'digital eye strain', 'computer vision syndrome', 'character height', 'visual angle', 'minutes of arc', 'contrast', 'glare', 'presbyopia', 'accommodation', 'near point', 'computer glasses', 'blink rate', 'dry eye', '20-20-20', 'breaks', 'luminance ratio', 'screen scaling'],
  prereq: ['monitor-placement', 'lighting-levels', 'medicine:vision'],
  related: ['glare-colour', 'laptops-tablets', 'displays-design', 'information-design', 'age-children-elderly', 'fatigue-rest-breaks', 'control-rooms', 'physics:the-eye', 'physics:vision-correction', 'medicine:headache-migraine'],
  body: `
Screen work is visual work. People look at a screen for hours at one distance, and the eyes answer with a familiar set of complaints — tired, dry or burning eyes, blurred vision, headaches — often joined by neck pain from peering forward. Optometrists call it digital eye strain. Most of it comes from four things a designer can change: **text too small for the distance, a distance the eyes cannot focus at comfortably, glare and poor contrast, and too few breaks.**

### Text big enough for the distance
What matters is not a letter's size in millimetres but the angle it subtends at the eye. A capital of height $h$ at distance $d$ subtends

$$\\theta = 2\\arctan\\frac{h}{2d} \\approx \\frac{h}{d}$$

in [[?radian]]s, by the [[?small-approximation|small-angle approximation]]. The screen-legibility standard ISO 9241-303 (following the older ISO 9241-3) asks for a capital height of **at least 16 minutes of arc, preferably 20–22′**, for sustained reading. At 600 mm that is at least 2.8 mm and preferably 3.5–3.8 mm; at 1 m, 4.7–6.4 mm.

On screen the size depends on the font size, the operating system's scaling and the pixel pitch. On a 24-inch full-HD screen (pixels about 0.277 mm apart) a 12-point font at 100 % scaling has capitals about 11 pixels — 3.1 mm — high: **16′ at 650 mm**, only just enough. Scaling to 125 % gives about 20′. Sharper screens have smaller pixels and need *more* scaling, not less.

### Eyes that can focus at that distance
To see a near object sharply the eye's lens adds focusing power, measured in dioptres (one over the distance in metres): about 1.7 D at 600 mm, 2.5 D at 400 mm. The **amplitude of accommodation** — the most the eye can add — falls steadily with age; Hofstetter's classic estimate of the average is

$$A = 18.5 - 0.3\\,y$$

dioptres at age $y$. Holding more than about half of it for long is tiring, so the comfortable nearest distance is about $1/(A/2)$ metres: roughly 160 mm at 20, 310 mm at 40, 400 mm at 45 and 570 mm at 50. This is **presbyopia**, the reason nearly everyone needs help for near work in their forties and fifties. Reading glasses for 400 mm are often too strong for a screen at 700 mm, and progressive lenses keep only a narrow band for screen distance, low in the lens. Lenses made for the screen distance solve both — an optician can advise (see [[physics:vision-correction]]).

### Contrast, glare and the room
- Dark text on a light background is legible for most people and hides reflections; the contrast between characters and background matters more than their colours.
- Keep the screen's brightness near its surroundings': a common rule of thumb keeps luminance ratios within about **3 : 1** between the task and its near surroundings and **10 : 1** to the far field.
- Light the desk to about **500 lx** for reading, writing and screen work (EN 12464-1) — more for older eyes — from luminaires that are not mirrored in the screen.
- Turn screens **side-on to windows**: a window behind the screen dazzles; a window behind the user is reflected (see [[glare-colour]], [[lighting-levels]]).

### Breaks and blinking
People blink far less while concentrating on a screen — one study counted about a third as many blinks as at rest (Tsubota and Nakamori, 1993) — and the eyes dry. The EU screen-work directive (90/270/EEC) requires breaks or changes of activity and eye tests for screen workers. UK HSE guidance prefers short, frequent breaks: **5–10 minutes after 50–60 minutes** of continuous screen work is better than 15 minutes every two hours. The popular "20-20-20" rule (every 20 minutes, look 20 feet away for 20 seconds) has little formal testing behind it, but looking far away does relax focusing.

### Settings
- **Offices and homes:** text scaled to the distance, eye tests for screen users, screens side-on to windows.
- **Schools:** children focus easily up close and hold tablets near; breaks matter for young eyes too (see [[age-children-elderly]]).
- **Control rooms:** dim rooms, many screens and 12-hour shifts; wall displays read at several metres need large characters (see [[control-rooms]]).
- **Field work and vehicles:** screens read in sunlight need high brightness and anti-reflective surfaces; glances must be short (see [[field-computing]], [[driver-workspace]]).
- **Health care:** dim diagnostic reading rooms; bedside screens read at a glance.
- **Military:** displays compatible with night-vision equipment, read through visors.

> [!tip] In the simulation set your own age and screen, then take a 50-year-old with no glasses, +1.0 D and +2.5 D, and see where the screen falls.

> [!warn] Eye strain has many causes, some of them medical. Persistent blurred or double vision, eye pain or headaches need an examination by an optometrist or a doctor.

> [!key] Size text by the angle it subtends (at least 16′, better 20–22′); keep the screen where the eyes can focus comfortably — a distance that moves outward with age; control glare and contrast; break often.
`,
  ideas: [
    'Legibility depends on the angle a character subtends: at least 16′, preferably 20–22′ for a capital.',
    'Font size, display scaling and pixel pitch together set the size of screen text; sharper screens need more scaling.',
    'The eye\'s focusing range shrinks with age: the comfortable nearest distance is about 400 mm at 45 and 570 mm at 50.',
    'Glasses for the screen distance often suit screen workers over 45 better than reading glasses or progressives.',
    'Glare, poor contrast and too few breaks — with rarer blinking — cause much of digital eye strain.'
  ],
  pitfalls: [
    'A sharper, higher-resolution screen lets text be smaller — Legibility depends on the angle at the eye; smaller pixels make text smaller unless the scaling is raised.',
    'Reading glasses are fine for the screen — Glasses for 400 mm often blur a screen at 700 mm; lenses for the screen distance are the answer.',
    'Screens should face the window for the best light — A window behind the screen dazzles and one behind the user reflects; screens go side-on to windows.'
  ],
  formulas: [
    {
      name: 'Character height for a visual angle',
      expr: 'h = 2*d*tan(theta/2)', tex: 'h = 2d\\tan\\frac{\\theta}{2}',
      vars: {
        h: { name: 'capital letter height', q: 'length', unit: 'mm', tex: 'h' },
        d: { name: 'viewing distance', q: 'length', unit: 'mm', value: 600, tex: 'd' },
        theta: { name: 'visual angle of the capital', q: 'angle', unit: '′', value: 20, min: 0, tex: '\\theta' }
      },
      note: 'At least 16′, preferably 20–22′ for sustained reading (ISO 9241-303). For small angles h ≈ d·θ with θ in radians.',
      stories: { h: 'A screen is read from {d}. How tall must the capitals be to subtend {theta}?', d: 'Capitals are {h} tall. From how far do they subtend {theta}?', theta: 'What angle do capitals {h} tall subtend at {d}?' }
    },
    {
      name: 'Amplitude of accommodation with age (Hofstetter, average)',
      expr: 'A = 18.5 - 0.3*y', tex: 'A = 18.5 - 0.3\\,y',
      vars: {
        A: { name: 'amplitude of accommodation', q: false, unit: 'D', tex: 'A' },
        y: { name: 'age', q: false, unit: 'years', value: 45, tex: 'y' }
      },
      note: 'An average for people from about 10 to 55 years; individuals vary by a few dioptres, and after about 60 little remains.',
      stories: { A: 'What is the average amplitude of accommodation at {y}?', y: 'At what age does the average amplitude fall to {A}?' }
    },
    {
      name: 'Nearest comfortable focusing distance',
      expr: 'dc = 1000/(k*A)', tex: 'd_c = \\frac{1000}{k\\,A}',
      vars: {
        dc: { name: 'nearest comfortable distance', q: false, unit: 'mm', tex: 'd_c' },
        k: { name: 'share of the amplitude used comfortably (about one half)', value: 0.5, tex: 'k' },
        A: { name: 'amplitude of accommodation', q: false, unit: 'D', value: 5, tex: 'A' }
      },
      note: 'For eyes corrected for distance. A reading add of P dioptres brings it in to 1000/(kA + P) mm but blurs everything beyond 1000/P mm.',
      stories: { dc: 'A worker\'s amplitude of accommodation is {A} and she can hold {k} of it for long. How close can she read comfortably?' }
    }
  ],
  examples: [
    {
      title: 'Is 12-point text big enough?',
      q: 'A 24-inch full-HD screen (1920 × 1080) is read from 650 mm. A 12-point font at 100 % scaling is 16 pixels to the em, and its capitals are about 0.7 em high. What visual angle do the capitals subtend, and at 125 % scaling?',
      steps: [
        'Pixel pitch: $609.6/\\sqrt{1920^2 + 1080^2} = 609.6/2203 = 0.277$ mm.',
        'Capital height: $0.7 \\times 16 = 11.2$ px $= 3.10$ mm.',
        '$\\theta = 3.10/650$ rad $= 0.00477$ rad $= 16.4′$ — only just the minimum.',
        'At 125 %: $3.87$ mm, $20.5′$ — in the preferred band.'
      ],
      a: 'About 16′ at 100 %, about 20′ at 125 % scaling.'
    },
    {
      title: 'Glasses for a 50-year-old',
      q: 'A 50-year-old has an average amplitude of accommodation and can hold half of it. Her screen is at 650 mm and her papers at 400 mm. Compare no glasses, a +1.0 D add and +2.5 D reading glasses.',
      steps: [
        '$A = 18.5 - 0.3 \\times 50 = 3.5$ D; comfortably usable $1.75$ D.',
        'No glasses: comfortable from $1000/1.75 = 571$ mm outwards — the screen is fine, the papers are not.',
        '+1.0 D: comfortable from $1000/2.75 = 364$ mm to $1000/1.0 = 1000$ mm — screen and papers both sharp.',
        '+2.5 D: from $1000/4.25 = 235$ mm to $1000/2.5 = 400$ mm — the papers are sharp, the screen at 650 mm is blurred, so she leans forward.'
      ],
      a: 'A +1.0 D screen lens covers 364–1000 mm; +2.5 D reading glasses stop at 400 mm.'
    }
  ],
  quiz: [
    { q: 'Capitals 3 mm tall are read at 500 mm, and capitals 6 mm tall at 1000 mm. Which look bigger?', choices: ['Neither: both subtend the same angle', 'The 6 mm capitals', 'The 3 mm capitals', 'It depends on the font'], a: 0, why: 'The visual angle is about h/d: 3/500 = 6/1000 = 0.006 rad, about 21′ in both cases.' },
    { q: 'A higher-resolution screen of the same size lets text be smaller at the same distance.', a: false, why: 'Legibility depends on the angle at the eye; more, smaller pixels only make text smaller unless the scaling is raised.' },
    { q: 'A 48-year-old with +2.5 D reading glasses sees her screen at 700 mm blurred. Why?', choices: ['With those glasses nothing beyond about 400 mm is sharp', 'The screen is too bright', 'Her eyes converge too much', 'The text is too large'], a: 0, why: 'A +2.5 D add focuses the relaxed eye at 1/2.5 m = 400 mm; screen-distance lenses of about +1 D reach to 1 m.' },
    { q: 'Where should the window be relative to a screen?', choices: ['To the side, with the line of sight parallel to it', 'Behind the screen', 'Behind the user', 'It does not matter'], a: 0, why: 'A window behind the screen dazzles and one behind the user reflects in the screen.' },
    { q: 'Which break pattern does UK guidance on screen work prefer?', choices: ['Short, frequent breaks: 5–10 minutes after 50–60 minutes', 'One long break at lunch', '15 minutes every two hours', 'No breaks but a change of screen'], a: 0, why: 'Short, frequent breaks relieve eyes and posture before fatigue builds up.' }
  ],
  problems: [
    { q: 'How tall must capitals be to subtend 20′ at a viewing distance of 800 mm?', answer: 4.65, unit: 'mm', tol: 0.02, steps: ['$h = 2 \\times 800 \\times \\tan(10′) = 1600 \\times 0.00291 = 4.65$ mm.'] },
    { q: 'By Hofstetter\'s average formula, what is the amplitude of accommodation at 42?', answer: 5.9, unit: 'D', tol: 0.01, steps: ['$A = 18.5 - 0.3 \\times 42 = 5.9$ D.'] },
    { q: 'A worker\'s amplitude of accommodation is 4 D and he can hold half of it. What is his nearest comfortable reading distance?', answer: 500, unit: 'mm', tol: 0.01, steps: ['$d_c = 1000/(0.5 \\times 4) = 500$ mm.'] }
  ],
  ranges: [
    { dim: 'Capital letter height as a visual angle', range: '≥ 16′, preferably 20–22′', unit: '', who: 'Readers with normal or corrected vision, sustained reading', why: 'Text is read without effort or leaning forward.', limits: 'Older eyes, low contrast and dim light need more; very large text fits fewer lines, so screens get bigger or farther.', setting: ['office', 'school', 'civil', 'workshop', 'military'], src: 'ISO 9241-303 (and the earlier ISO 9241-3)' },
    { dim: 'Capital letter height at 600 mm', range: [2.8, 3.8], unit: 'mm', who: 'Screen text read at 600 mm', why: 'The 16–22′ band expressed in millimetres at a common screen distance.', limits: 'Scales in proportion to the distance: at 1 m, 4.7–6.4 mm.', setting: ['office', 'civil'], src: 'Derived from ISO 9241-303' },
    { dim: 'Illuminance on the desk for reading, writing and screen work', range: [500, null], unit: 'lx', who: 'Young to older eyes; older workers often need more', why: 'Enough light to read paper and see the keyboard without making the screen look dim.', limits: 'Too much light on the screen washes it out; control the direction of light and reflections, not only the amount.', setting: ['office', 'school'], src: 'EN 12464-1' },
    { dim: 'Luminance ratio, task to its surroundings', range: '≤ 3 : 1 near, ≤ 10 : 1 far', unit: '', who: 'Every screen worker', why: 'The eyes need not re-adapt at every glance between screen, papers and room.', limits: 'A rule of thumb for design; bright windows and dark screens break it easily.', setting: ['office', 'workshop'], src: 'Lighting design rule of thumb' },
    { dim: 'Breaks from continuous screen work', range: '5–10 min after 50–60 min', unit: '', who: 'Screen users working without natural pauses', why: 'Relieves the eyes, the static posture and the mind before fatigue builds up.', limits: 'A change of task counts as a break; long continuous work still needs a longer break.', setting: ['office', 'school'], src: 'UK HSE guidance on display screen equipment; EU Directive 90/270/EEC' },
    { dim: 'Nearest comfortable focusing distance at 45 (average eyes, no near correction)', range: [400, null], unit: 'mm', who: 'An average 45-year-old using half of the amplitude of accommodation', why: 'Shows why screens at arm\'s length suit older eyes better than close ones.', limits: 'People vary by a few dioptres; by 50 it is nearer 570 mm, and lenses for the screen distance restore near work.', setting: ['office', 'civil'], src: 'Hofstetter\'s age–amplitude formula (1950)' }
  ],
  applications: [
    'Setting display scaling so that screen text subtends 20′ or more at the user\'s distance.',
    'Sizing text on shared displays in meeting and control rooms from the farthest viewer.',
    'Screen-work eye tests and lenses for the screen distance for workers over about 45.',
    'Placing screens side-on to windows and luminaires out of the reflected view.'
  ],
  history: 'Hermann Snellen\'s letter chart of 1862 defined letters by the angle they subtend — 5 minutes of arc for a letter just readable with normal acuity. When screens spread through offices in the 1970s and 1980s, complaints of eye strain led to research on character size, contrast and flicker and to the ISO 9241 series; its visual requirements were later gathered in ISO 9241-303 for all electronic displays.',
  sources: [
    'ISO 9241-303, *Ergonomics of human-system interaction — Requirements for electronic visual displays*.',
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places*.',
    'Council Directive 90/270/EEC on work with display screen equipment (breaks, eyes and eyesight).',
    'UK Health and Safety Executive, guidance on the Health and Safety (Display Screen Equipment) Regulations 1992.',
    'H. W. Hofstetter, the age–amplitude formulas for accommodation, 1950.',
    'K. Tsubota and K. Nakamori, Dry eyes and video display terminals, *New England Journal of Medicine*, 1993.'
  ],
  sim: ['ws-vision', 'ws-monitor']
},

{
  id: 'reach-zones', parent: 'workspace-layout', title: 'Reach zones on the work surface', level: 2,
  short: 'Around a seated person the work surface divides into zones: a normal area swept by the forearms with the elbows at the sides, a maximum area reached by the outstretched arms (only about 340 mm deep for small users without leaning), and everything beyond. Frequent items go in the first, occasional ones in the second.',
  keywords: ['reach zones', 'normal working area', 'maximum working area', 'reach envelope', 'Barnes', 'desk layout', 'frequency of use', 'primary zone', 'secondary zone', 'arm reach', 'workstation layout', 'ISO 14738', 'motion economy'],
  prereq: ['functional-reach', 'desk-height', 'sitting-dimensions'],
  related: ['keyboard-mouse', 'office-layout', 'workbench-design', 'assembly-lines', 'operator-positions', 'control-rooms', 'retail-checkouts', 'driver-workspace', 'storage-heights', 'clothing-ppe-allowances'],
  body: `
Every item on a work surface costs a movement each time it is used. Near the body a movement is a flick of the forearm; farther out it takes the whole arm, then a lean of the trunk, then standing up. Ergonomics divides the surface around a seated person into **zones of reach** and places things by how often they are used — the same idea at an office desk, a workbench, a checkout, a control console or a cockpit.

### Arcs drawn by the arms
- The **normal area** is what the hands sweep with the upper arms hanging relaxed and the forearms pivoting at the elbows. Its radius is about the forearm plus half the hand, roughly **0.2 × stature**: some 305 mm for the 5th-percentile woman and 375 mm for the 95th-percentile man (from the segment proportions of Drillis and Contini).
- The **maximum area** is what the hands reach with the arm outstretched from the shoulder: shoulder to grip, roughly **0.39 × stature** — about 587 mm and 722 mm.

On the desk the maximum area is smaller than the arm, because the shoulder is above the surface and behind its front edge. By [[math:pythagorean-theorem|Pythagoras]] in three dimensions, the reach forward along the surface at a sideways offset $x$ from the shoulder is

$$y = \\sqrt{R^2 - h^2 - x^2} - d$$

(see [[?square-root]]), with $R$ the arm reach, $h$ the height of the shoulder above the surface and $d$ how far the shoulder sits behind the front edge. For the 5th-percentile woman at her own desk height ($R \\approx 587$ mm, $h \\approx 320$ mm, $d \\approx 150$ mm) the maximum area reaches only about **340 mm** into the desk straight ahead, and 300 mm at 200 mm to the side. For the 95th-percentile man ($R \\approx 722$, $h \\approx 358$, $d \\approx 170$ mm) it is about 460 mm. Leaning forward adds 100–200 mm, at the price of load on the back.

### What goes where
| Zone | How often | Examples at a desk | Depth from the front edge (small user) |
|---|---|---|---|
| Normal area | continuously or often | keyboard, mouse, the document in hand, a notepad | within about 250–300 mm |
| Maximum area | occasionally | phone, reference papers, a drink | within about 340 mm ahead, less to the sides |
| Beyond reach | rarely | binders, printer, storage | stand up and walk |
| Looked at, not touched | continuously | the screen | 500–1000 mm from the eyes |

The screen is the exception: it is looked at, not handled, and belongs beyond the reach zones. Touchscreens are handled too and must be within reach as well as in view (see [[hmi-screens]]).

### The smallest user limits reach
Reach is the classic case for the **small end** of the population (see [[design-for-range]]): what the 5th-percentile woman can reach, everyone can. Wide desks help only if their far corners hold rarely used things; L-shaped and curved desks wrap more surface into the maximum area. Deep desks (1000 mm and more) put their back half out of reach but give room for large screens.

### Height as well as depth
Reach shrinks well above the shoulder and far below it. Shelves above a desk should hold only occasional items; frequently used things belong on the work surface when sitting and between knuckle and shoulder height when standing (see [[storage-heights]] and [[functional-reach]]).

### Settings
- **Offices:** arrange the desk by zones; a phone used all day belongs in the normal area of the non-writing hand.
- **Workshops and assembly:** the same zones at bench height — parts bins inside the maximum area, the tool used most in the normal area; ISO 14738 and EN 614-2 apply the reasoning to workstations at machinery (see [[workbench-design]], [[assembly-lines]]).
- **Checkouts and packing tables:** thousands of reaches a shift — scanner and bagging within the normal area (see [[retail-checkouts]]).
- **Control consoles, cockpits and cabs:** controls used often or in an emergency inside the reach of the smallest operator, belted in and in winter clothing (see [[control-rooms]], [[driver-workspace]]).
- **Military crew stations:** body armour, harnesses and bulky gloves shorten reach; design for the smallest crew member **as equipped** (see [[crew-stations]], [[clothing-ppe-allowances]]).
- **Home:** kitchens follow the same logic — things used daily between hip and shoulder, near where they are used (see [[kitchen-ergonomics]]).

> [!tip] In the simulation drag the items around the desk: green means an item sits in the right zone for how often it is used. Switch to the 5th-percentile woman and watch items fall out of reach; then let her lean forward.

> [!key] Frequent items in the normal area (forearm reach), occasional ones in the maximum area (arm reach), rare ones beyond — and size the zones from the smallest user.
`,
  ideas: [
    'The normal area is swept by the forearms (radius about 0.2 × stature); the maximum area by the whole arm (about 0.39 × stature).',
    'On a desk the maximum reach is shortened by the shoulder\'s height above the surface and its distance behind the edge.',
    'The 5th-percentile woman reaches only about 340 mm into a desk without leaning.',
    'Place items by frequency of use: frequent in the normal area, occasional in the maximum area, rare beyond.',
    'The screen is looked at, not handled, and goes beyond reach; touchscreens must be both reachable and visible.'
  ],
  pitfalls: [
    'A bigger desk is a better desk — Space beyond the maximum area is only storage; what matters is what lies within reach.',
    'Reach can be taken from the average user — Reach is limited by the smallest users; an average reach leaves half of them stretching.',
    'Arm length is the reach on the desk — The shoulder is above and behind the desk, so the reach along the surface is much shorter than the arm.'
  ],
  formulas: [
    {
      name: 'Reach along the work surface',
      expr: 'y = sqrt(R^2 - h^2 - x^2) - d', tex: 'y = \\sqrt{R^2 - h^2 - x^2} - d',
      vars: {
        y: { name: 'reach into the surface from its front edge', q: 'length', unit: 'mm', signed: true, tex: 'y' },
        R: { name: 'arm reach, shoulder to grip', q: 'length', unit: 'mm', value: 587, tex: 'R' },
        h: { name: 'height of the shoulder above the surface', q: 'length', unit: 'mm', value: 320, tex: 'h' },
        x: { name: 'sideways offset from the shoulder', q: 'length', unit: 'mm', value: 200, tex: 'x' },
        d: { name: 'shoulder distance behind the front edge', q: 'length', unit: 'mm', value: 150, tex: 'd' }
      },
      note: 'Without leaning. The defaults are the 5th-percentile woman at her own desk height.',
      stories: { y: 'A user\'s arm reach is {R}, her shoulder {h} above the desk and {d} behind its edge. How far into the desk can she reach at {x} to the side?', R: 'To reach {y} into the desk at {x} to the side, with the shoulder {h} above it and {d} behind the edge, how long must the arm reach be?' }
    },
    {
      name: 'Radius of the normal area',
      expr: 'rn = Lf + Lh/2', tex: 'r_n = L_f + \\frac{L_h}{2}',
      vars: {
        rn: { name: 'radius of the normal area (from the elbow)', q: 'length', unit: 'mm', tex: 'r_n' },
        Lf: { name: 'forearm length, elbow to wrist', q: 'length', unit: 'mm', value: 222, tex: 'L_f' },
        Lh: { name: 'hand length', q: 'length', unit: 'mm', value: 161, tex: 'L_h' }
      },
      note: 'The hand grips at about half its length. Defaults: the 5th-percentile woman.',
      stories: { rn: 'A forearm is {Lf} long and the hand {Lh}. What radius does the normal area have?' }
    },
    {
      name: 'Arm reach from stature',
      expr: 'R = k*S', tex: 'R = k\\,S',
      vars: {
        R: { name: 'arm reach, shoulder to grip', q: 'length', unit: 'mm', tex: 'R' },
        k: { name: 'share of stature (upper arm + forearm + half the hand ≈ 0.386)', value: 0.386, tex: 'k' },
        S: { name: 'stature', q: 'length', unit: 'mm', value: 1520, tex: 'S' }
      },
      note: 'Segment proportions after Drillis and Contini (1966): upper arm 0.186, forearm 0.146, hand 0.108 of stature. A first estimate; use measured reach for real designs.',
      stories: { R: 'Estimate the arm reach of a person {S} tall.' }
    }
  ],
  examples: [
    {
      title: 'How far can the smallest user reach?',
      q: 'The 5th-percentile woman (stature 1520 mm) sits with her desk at her elbow height: her shoulder is 320 mm above the desk and 150 mm behind its edge. How far into the desk can she reach straight ahead and 200 mm to the side?',
      steps: [
        'Arm reach: $R = 0.386 \\times 1520 = 587$ mm.',
        'Straight ahead: $y = \\sqrt{587^2 - 320^2} - 150 = 492 - 150 = 342$ mm.',
        'At 200 mm to the side: $y = \\sqrt{587^2 - 320^2 - 200^2} - 150 = 450 - 150 = 300$ mm.',
        'A phone 450 mm into the desk is out of her reach without leaning.'
      ],
      a: 'About 340 mm straight ahead and 300 mm at 200 mm to the side.'
    },
    {
      title: 'The same desk for the largest user',
      q: 'The 95th-percentile man (stature 1870 mm) has his shoulder 358 mm above his desk and 170 mm behind its edge. How far does he reach straight ahead?',
      steps: [
        '$R = 0.386 \\times 1870 = 722$ mm.',
        '$y = \\sqrt{722^2 - 358^2} - 170 = 627 - 170 = 457$ mm.',
        'Over 100 mm more than the smallest user: a layout that suits him leaves her stretching.'
      ],
      a: 'About 460 mm.'
    }
  ],
  quiz: [
    { q: 'Which user sets the depth of the maximum reach zone on a shared desk?', choices: ['The smallest (a 5th-percentile woman or smaller)', 'The largest', 'The average', 'The user who sits closest'], a: 0, why: 'Reach is limited by the small end: whatever the smallest can reach, everyone can.' },
    { q: 'Where does a phone that is answered all day belong?', choices: ['In the normal area, on the side of the non-writing hand', 'At the back corner of the desk', 'On a shelf above the desk', 'Beside the screen'], a: 0, why: 'Frequent items belong in the normal area; on the non-writing side the writing hand stays free for notes.' },
    { q: 'The screen should be inside the normal area, so that it is close.', a: false, why: 'The screen is looked at, not handled: it belongs 500–1000 mm from the eyes, beyond the reach zones (touchscreens excepted).' },
    { q: 'Why is the reach along a desk shorter than the arm?', choices: ['The shoulder is above the surface and behind its front edge', 'The hand is not counted', 'The desk is slippery', 'The elbow cannot straighten'], a: 0, why: 'Part of the arm\'s length is used up going down to the surface and forward past the edge: y = √(R² − h² − x²) − d.' },
    { q: 'What is the cost of placing occasional items just beyond reach?', choices: ['Each use needs a forward lean that loads the back', 'None: leaning is healthy', 'The items get lost', 'The normal area shrinks'], a: 0, why: 'Leaning forward adds reach but bends and loads the spine each time.' }
  ],
  problems: [
    { q: 'A user\'s arm reach is 650 mm, his shoulder 330 mm above the desk and 160 mm behind its edge. How far into the desk can he reach straight ahead?', answer: 400, unit: 'mm', tol: 0.01, steps: ['$y = \\sqrt{650^2 - 330^2} - 160 = \\sqrt{313600} - 160 = 560 - 160 = 400$ mm.'] },
    { q: 'A man\'s forearm is 256 mm long and his hand 192 mm. What is the radius of his normal area?', answer: 352, unit: 'mm', tol: 0.01, steps: ['$r_n = 256 + 192/2 = 352$ mm.'] },
    { q: 'Estimate the arm reach (shoulder to grip) of a person 1755 mm tall.', answer: 677, unit: 'mm', tol: 0.01, steps: ['$R = 0.386 \\times 1755 = 677$ mm.'] }
  ],
  ranges: [
    { dim: 'Frequently used items, depth from the front edge', range: [null, 300], unit: 'mm', who: 'Normal (forearm) area of the 5th-percentile woman', why: 'Items used again and again are reached by the forearm alone, with the upper arm relaxed.', limits: 'Less at the midline and far to the sides; the keyboard already fills much of this zone.', setting: ['office', 'workshop'], src: 'Derived from forearm and hand length (Drillis and Contini proportions)' },
    { dim: 'Occasionally used items, depth from the front edge (no leaning)', range: [null, 340], unit: 'mm', who: 'Maximum (arm) area of the 5th-percentile woman at her own desk height', why: 'Everyone reaches them without leaning forward.', limits: 'About 300 mm at 200 mm to the side; larger users reach 450 mm and more, so layouts that suit them leave small users stretching.', setting: ['office', 'workshop'], src: 'Derived from arm reach and seated shoulder height' },
    { dim: 'Normal area radius (forearm plus half the hand)', range: [300, 375], unit: 'mm', who: '5th-percentile woman to 95th-percentile man', why: 'Defines the zone for continuous work: keyboard, mouse, parts being assembled.', limits: 'Measured from the elbow, which moves; heavy gloves and tools change the grip point.', setting: ['office', 'workshop'], src: 'Segment proportions (Drillis and Contini, 1966)' },
    { dim: 'Arm reach, shoulder to grip', range: [590, 720], unit: 'mm', who: '5th-percentile woman to 95th-percentile man', why: 'Sets the outer boundary of controls and items that must be reached without leaning.', limits: 'Unclothed estimate: heavy clothing, harnesses and body armour shorten it; seat belts stop leaning.', setting: ['office', 'workshop', 'vehicle', 'military'], src: 'Segment proportions (Drillis and Contini, 1966)' }
  ],
  applications: [
    'Laying out desks, workbenches and checkouts by frequency of use.',
    'Placing controls on consoles and in cabs within the reach of the smallest operator, as equipped.',
    'Choosing L-shaped or curved desks that wrap the surface into reach.',
    'Checking a layout for the smallest and largest users in [the workstation fitter](#/tools/workstation/sitting).'
  ],
  history: 'Frank and Lillian Gilbreth\'s motion studies in the early twentieth century turned the placement of tools and materials into a science. Ralph Barnes\'s textbook *Motion and Time Study* (first published in 1937) drew the normal and maximum working areas as arcs of the forearm and the whole arm; later studies refined their shape to account for the moving elbow, and the idea passed into standards such as ISO 14738 for workstations at machinery.',
  sources: [
    'ISO 14738, *Safety of machinery — Anthropometric requirements for the design of workstations at machinery*.',
    'EN 614-2, *Safety of machinery — Ergonomic design principles — Part 2: Interactions between the design of machinery and work tasks*.',
    'R. M. Barnes, *Motion and Time Study: Design and Measurement of Work*, the normal and maximum working areas.',
    'R. Drillis and R. Contini, *Body Segment Parameters*, New York University, 1966.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on reach and the zone of convenient reach.'
  ],
  sim: 'ws-reach'
},

{
  id: 'office-layout', parent: 'workspace-layout', title: 'Office layout and space', level: 2,
  short: 'An office plan is ergonomics at room scale: enough floor area and air per person, room to move around each desk, aisles wide enough for two people or a wheelchair, screens side-on to the windows, and zones for concentration, talk and movement. Typical plans give about 8–15 m² per workstation.',
  keywords: ['office layout', 'open-plan office', 'space per person', 'floor area per workstation', 'circulation', 'aisle width', 'benching', 'desk clusters', 'cellular office', 'activity-based working', 'hot desking', 'noise', 'privacy', 'windows', 'occupancy density', 'ASR A1.2', '11 cubic metres', 'wheelchair turning circle'],
  prereq: ['desk-height', 'reach-zones', 'design-for-range'],
  related: ['meeting-classroom', 'control-rooms', 'doors-corridors', 'accessible-design', 'noise-control', 'glare-colour', 'lighting-levels', 'indoor-air', 'thermal-comfort', 'psychosocial-factors'],
  body: `
An office floor plan is ergonomics at room scale. Each person needs a workstation that fits the body, room to push the chair back and stand up, a way through for others, light without glare, air, and a level of noise and privacy that suits the work. Squeeze the plan and each of these is lost in turn.

### From the desk outwards
A workstation is more than its desk. Add up the pieces:

| Piece | Typical size | Set by |
|---|---|---|
| Desk | 1200–1600 × 800 mm | screen distance and reach (see [[desk-height]], [[reach-zones]]) |
| Chair and movement zone behind the desk | at least about 1.0 m deep | sitting down, standing up, turning the chair |
| Storage | 0.3–1 m² | the work |
| Share of aisles, meeting space, printers | 3–8 m² | the plan |

The German workplace rule ASR A1.2 asks for a free movement area at each workstation of at least **1.5 m²**, no less than 1 m wide and deep, and gives guide values of about **8–10 m² per workstation in cellular offices and 12–15 m² in open-plan offices**, including furniture and a share of circulation. In the UK the Workplace Regulations' code of practice asks for at least **11 m³ of room volume per person**, counting the ceiling height up to 3 m — with a 2.7 m ceiling about 4 m² of floor, a floor rather than a target. The US has no general federal minimum; planners work from practice. Many recent offices plan 6–10 m² per desk and share desks, trading density against noise and distraction.

### Circulation for the whole range of people
Aisles are clearances, so the **largest** users and equipment set them:
- Two people passing: the 95th-percentile man's shoulders are about 526 mm wide; two of them with a small margin need about **1.2 m**.
- Wheelchairs: accessible routes need at least **915 mm (36 in)** clear under the 2010 ADA Standards, and a wheelchair turns in a circle of about **1500 mm** (ISO 21542; 60 in in the ADA), so main aisles of **1.2–1.5 m** with turning places at junctions serve everyone.
- Behind a row of desks: the chair zone of about 1 m, plus about 0.6 m where people walk behind seated colleagues.
Escape routes and exits follow the local fire code, which may ask for more.

### Windows, light and screens
Place desks so that the line of sight runs **parallel to the windows**: facing a window puts the brightest surface in the room behind the screen; with the window behind the user it is reflected in the screen (see [[glare-colour]]). Rows of desks at right angles to the window wall do this naturally and share the daylight. Blinds control the rest.

### Noise, privacy and the kind of work
Open plans help quick exchanges and flexible use; they cost concentration, because intelligible speech is the most distracting sound there is (see [[noise-control]]; ISO 3382-3 measures the acoustics of open-plan offices). Good plans **zone** the floor: quiet areas away from entrances and kitchens, team areas, phone booths and small rooms for calls and focused work, and circulation routes that do not pass through desk clusters.

| Plan | Area per person | Virtues | Limitations |
|---|---|---|---|
| Cellular (1–2 per room) | 8–12 m² | quiet, privacy, own climate | costly, isolating, corridor space |
| Open plan in rows or benches | 10–15 m² | flexible, easy contact, shared daylight | noise, interruptions, little privacy |
| Activity-based, shared desks | 6–10 m² per desk | fits part-time presence; varied settings | desks must adjust fast to each user; storage |
| Call centre | 6–8 m² | density | noise, long static work: needs breaks and good acoustics |

### Settings
- **Offices:** the ranges above, with local building and workplace rules.
- **Home offices:** a corner with a desk at least 1200 × 600–800 mm, a chair zone of about 1 m and light from the side.
- **Health care:** nurses' stations and charting areas squeezed into corridors — the same clearances, plus room for beds and trolleys to pass (see [[hospital-workstations]]).
- **Workshops and plants:** offices on the shop floor, glass-fronted to see the process — glare from process lights and noise from machines (see [[material-flow-layout]]).
- **Control rooms and military command posts:** consoles, supervisors and shared displays planned together from the tasks (see [[control-rooms]]).
- **Schools:** staff rooms and administration follow office rules; classrooms follow their own (see [[meeting-classroom]]).

> [!tip] In the simulation fill a floor with rows, benches, clusters or cellular rooms and read the area and volume per person. Narrow the main aisle below 1.5 m and watch the wheelchair turning circle turn red; turn the desks to face the windows and read what happens to glare.

> [!key] Start from the workstation and its movement zone, add aisles sized for the largest people and for wheelchairs, turn screens side-on to windows, and zone the floor by noise — then count the area per person.
`,
  ideas: [
    'A workstation needs its desk, about 1 m of movement zone behind it, storage and a share of circulation: typically 8–15 m² in all.',
    'German guidance: 8–10 m² per workstation in cellular offices, 12–15 m² in open plan; UK rules: at least 11 m³ of room per person.',
    'Aisles are clearances: about 1.2 m for two people passing, 1.5 m for a wheelchair to turn.',
    'Screens belong side-on to windows, with the line of sight parallel to the window wall.',
    'Open plans trade privacy and quiet for flexibility; zoning by noise and activity restores some of both.'
  ],
  pitfalls: [
    'The legal minimum is a design target — The UK 11 m³ or a code minimum is a floor, far below what good offices provide.',
    'Desks facing the window give the best light — The bright window behind the screen dazzles; side-on is better.',
    'Open plan always improves communication — It helps quick contact but costs concentration; people often use headphones and email instead of talking.'
  ],
  formulas: [
    {
      name: 'Floor area per workstation',
      expr: 'a = A/n', tex: 'a = \\frac{A}{n}',
      vars: {
        a: { name: 'floor area per workstation', q: 'area', unit: 'm²', tex: 'a' },
        A: { name: 'net floor area of the office', q: 'area', unit: 'm²', value: 600, tex: 'A' },
        n: { name: 'number of workstations', q: 'count', value: 48, int: true, tex: 'n' }
      },
      stories: { a: 'An office floor of {A} holds {n} workstations. What is the area per workstation?', n: 'How many workstations fit on {A} at {a} each?' }
    },
    {
      name: 'Room volume per person',
      expr: 'v = A*h/n', tex: 'v = \\frac{A\\,h}{n}',
      vars: {
        v: { name: 'room volume per person', q: 'volume', unit: 'm³', tex: 'v' },
        A: { name: 'floor area of the room', q: 'area', unit: 'm²', value: 20, tex: 'A' },
        h: { name: 'ceiling height (counted up to 3 m in the UK)', q: 'length', unit: 'm', value: 2.7, tex: 'h' },
        n: { name: 'number of people', q: 'count', value: 4, int: true, tex: 'n' }
      },
      note: 'The UK Workplace Regulations\' code of practice asks for at least 11 m³ per person, ignoring ceiling height above 3.0 m.',
      stories: { v: 'A room of {A} with a {h} ceiling holds {n} people. How much volume does each have?', n: 'A room of {A} with a {h} ceiling: how many people can it hold at {v} each?' }
    },
    {
      name: 'Aisle width for people passing',
      expr: 'w = k*b + c', tex: 'w = k\\,b + c',
      vars: {
        w: { name: 'aisle width', q: 'length', unit: 'mm', tex: 'w' },
        k: { name: 'number of people side by side', q: 'count', value: 2, int: true, tex: 'k' },
        b: { name: 'body breadth of a large user (95th-percentile man\'s shoulders)', q: 'length', unit: 'mm', value: 526, tex: 'b' },
        c: { name: 'clearance for movement', q: 'length', unit: 'mm', value: 150, tex: 'c' }
      },
      note: 'A first estimate; add for clothing, carried items and trolleys, and check wheelchair and fire-code minimums.',
      stories: { w: '{k} large people ({b} across the shoulders) must pass with {c} to spare. How wide should the aisle be?' }
    }
  ],
  examples: [
    {
      title: 'An open-plan floor',
      q: 'An open-plan floor of 30 × 20 m holds 48 workstations. What is the area per workstation, and how does it compare with the German guide values?',
      steps: [
        'Area: $30 \\times 20 = 600$ m².',
        '$a = 600/48 = 12.5$ m² per workstation.',
        'Within the 12–15 m² that ASR A1.2 gives for open-plan offices; at 60 workstations it would drop to 10 m².'
      ],
      a: '12.5 m² per workstation — inside the open-plan guide range.'
    },
    {
      title: 'The UK volume rule',
      q: 'A room of 20 m² with a 2.7 m ceiling holds four people. Does it meet the UK code of practice of 11 m³ per person? How many people would the rule allow at the most?',
      steps: [
        '$v = 20 \\times 2.7/4 = 13.5$ m³ per person — above 11 m³.',
        'Most people: $20 \\times 2.7/11 = 4.9$, so four.',
        'At 5 m² each the room meets the legal minimum, but gives far less than the 8–10 m² per workstation of good practice.'
      ],
      a: '13.5 m³ each — it meets the rule, which allows at most four people.'
    }
  ],
  quiz: [
    { q: 'Which users set the width of a main aisle?', choices: ['The largest people and wheelchair users, passing each other', 'The average person', 'The smallest people', 'The cleaners'], a: 0, why: 'An aisle is a clearance: the widest bodies and equipment that must pass set it.' },
    { q: 'How should desks with screens be turned relative to the windows?', choices: ['Side-on: the line of sight parallel to the window wall', 'Facing the windows', 'With the window behind the user', 'It does not matter with modern screens'], a: 0, why: 'Facing a window puts a bright surface behind the screen; with the window behind, it is reflected. Side-on avoids both.' },
    { q: 'The UK minimum of 11 m³ per person is a good design target for offices.', a: false, why: 'It is a legal floor — about 4 m² of floor with a normal ceiling — far below the 8–15 m² of good practice.' },
    { q: 'What is the main cost of an open-plan office?', choices: ['Noise and interruptions that disturb concentration', 'Higher heating costs', 'Less daylight', 'Fewer desks'], a: 0, why: 'Intelligible speech from others is the most distracting sound in offices.' },
    { q: 'About how deep should the free zone behind a desk be for the chair and for standing up?', choices: ['About 1 m', 'About 0.4 m', 'About 2.5 m', 'About 0.1 m'], a: 0, why: 'A chair pushed back and a person rising need about 1 m; more where others walk behind.' }
  ],
  problems: [
    { q: 'An office of 450 m² holds 40 workstations. What is the floor area per workstation?', answer: 11.25, unit: 'm²', tol: 0.01, steps: ['$a = 450/40 = 11.25$ m².'] },
    { q: 'A room of 16 m² with a 3.4 m ceiling holds three people. Counting the ceiling only up to 3 m, what is the volume per person?', answer: 16, unit: 'm³', tol: 0.01, steps: ['$v = 16 \\times 3.0/3 = 16$ m³.'] },
    { q: 'Two large people, 526 mm across the shoulders, must pass with 150 mm to spare. How wide should the aisle be?', answer: 1202, unit: 'mm', tol: 0.01, steps: ['$w = 2 \\times 526 + 150 = 1202$ mm — about 1.2 m.'] }
  ],
  ranges: [
    { dim: 'Floor area per workstation, cellular offices', range: [8, 10], unit: 'm²', who: 'One or two people per room, including furniture and a share of circulation', why: 'Room for the workstation, its movement zone, storage and a visitor.', limits: 'A guide value, not a law elsewhere; special work (drawing boards, large screens, meetings) needs more.', setting: 'office', src: 'ASR A1.2 (Germany)' },
    { dim: 'Floor area per workstation, open-plan offices', range: [12, 15], unit: 'm²', who: 'Open-plan floors, including a larger share of circulation and shared areas', why: 'Leaves room for aisles, quiet zones and meeting space besides the desks.', limits: 'Many offices plan less with shared desks; below about 10 m² noise and crowding grow.', setting: 'office', src: 'ASR A1.2 (Germany)' },
    { dim: 'Room volume per person', range: [11, null], unit: 'm³', who: 'Every person usually working in the room; ceiling counted up to 3.0 m', why: 'A legal minimum of space and air per person.', limits: 'A floor, not a target: with a 2.7 m ceiling it allows about 4 m² per person.', setting: ['office', 'workshop'], src: 'UK Workplace (Health, Safety and Welfare) Regulations 1992, code of practice' },
    { dim: 'Free movement area at a workstation', range: [1.5, null], unit: 'm²', who: 'Every workstation; at least 1 m wide and deep', why: 'Room to push the chair back, stand up, turn and move while working.', limits: 'Not shared with aisles others use; wheelchair users need more.', setting: 'office', src: 'ASR A1.2 (Germany)' },
    { dim: 'Main aisle width', range: [1200, 1500], unit: 'mm', who: 'Two large people passing (1.2 m); a wheelchair turning (1.5 m)', why: 'Everyone moves through the office without squeezing past desks and chairs.', limits: 'Fire codes may ask for more on escape routes; trolleys and deliveries need more.', setting: ['office', 'civil'], src: 'Derived from shoulder breadth; ISO 21542 and 2010 ADA Standards (turning space)' },
    { dim: 'Accessible route, clear width', range: [915, null], unit: 'mm', who: 'Wheelchair users (36 in)', why: 'A wheelchair passes along every route to every workstation, toilet and exit.', limits: 'A minimum for a straight route; turns, doors and passing places need more.', setting: ['office', 'civil', 'health', 'school'], src: '2010 ADA Standards for Accessible Design, §403' }
  ],
  applications: [
    'Test-fitting a floor plan: count workstations, check area and volume per person, and check every aisle for wheelchairs.',
    'Turning desks side-on to the windows during a refit.',
    'Zoning an open-plan office into quiet, team and social areas with booths for calls.',
    'Planning desk-sharing ratios without losing the adjustment each user needs.'
  ],
  history: 'The open-plan office of rows of clerks goes back to the early twentieth century. In the late 1950s the Quickborner team in Germany proposed the *Bürolandschaft* (office landscape), planning desks by the flow of work; in the 1960s Robert Propst\'s "Action Office" for Herman Miller led, against his intent, to the cubicle. Since the 2000s activity-based working with shared desks has spread, and research on noise and distraction has pushed plans back towards zones and small rooms.',
  sources: [
    'ASR A1.2, *Raumabmessungen und Bewegungsflächen* (room dimensions and movement areas), German technical rule for workplaces.',
    'UK Workplace (Health, Safety and Welfare) Regulations 1992 and their Approved Code of Practice (L24): space per person.',
    '2010 ADA Standards for Accessible Design, §304 (turning space) and §403 (walking surfaces).',
    'ISO 21542, *Building construction — Accessibility and usability of the built environment*.',
    'ISO 3382-3, *Acoustics — Measurement of room acoustic parameters — Part 3: Open plan offices*.',
    'E. Neufert, *Architects\' Data*, on office planning.'
  ],
  sim: 'ws-office'
},

{
  id: 'meeting-classroom', parent: 'workspace-layout', title: 'Meeting rooms and classrooms', level: 2,
  short: 'Rooms where people watch and talk together are designed from their eyes: table edge per person, clearance to get in and out, rows spaced and raised so each head clears the one in front, a screen high enough and text big enough for the back row, and no one twisted too far to see.',
  keywords: ['meeting room', 'conference table', 'classroom', 'lecture hall', 'auditorium', 'sightlines', 'C-value', 'riser', 'tiered seating', 'raked floor', 'projection screen', 'display size', 'viewing distance', '4-6-8 rule', 'seating layout', 'U-shape', 'boardroom', 'table size'],
  prereq: ['office-layout', 'visual-ergonomics', 'sitting-dimensions'],
  related: ['school-furniture', 'dining-tables-chairs', 'accessible-design', 'control-rooms', 'displays-design', 'noise-control', 'indoor-air', 'information-design', 'monitor-placement'],
  body: `
Meeting rooms, classrooms and lecture halls are for looking and listening together. Their ergonomics starts at two places: the edge of the table, where each person needs elbow room, and the eyes, which must see past the heads in front to the screen, the board or the speaker.

### Around the table
- **Width per person:** the 95th-percentile man is about 526 mm across the shoulders, and elbows spread wider when writing: allow **600 mm** of table edge per person at the least and **700–750 mm** for comfort.
- **Table width:** 900–1200 mm across keeps people close enough to talk while leaving room for papers and knees that do not clash.
- **Behind the chairs:** about 900 mm from the table edge to the wall lets people pull out a chair and sit; about 1200 mm or more lets others pass behind seated people.
- **Shape:** a long boardroom table suits formal meetings but puts the ends far apart; a U-shape lets everyone see the screen; a round table suits discussion without a screen.
- **Access:** a wheelchair user needs a place with knee clearance at least 685 mm high and 760 mm wide (the ADA values) and a clear route to it (see [[accessible-design]]).

### Seeing the screen
Three questions decide whether everyone can see:
1. **Is the image big enough for the back row?** A long-standing audio-visual rule of thumb (the "4-6-8 rule") puts the farthest viewer at no more than about 4, 6 or 8 image heights for detailed inspection, reading documents and general viewing respectively; the AVIXA DISCAS standard later refined it. Text should reach at least 16′ and preferably 20–22′ at the back (see [[visual-ergonomics]]): at 8 m a capital needs about 47 mm for 20′.
2. **Can the front row see the top without craning?** A common rule keeps the upward angle from the front row to the top of the image below about 30–35°.
3. **Can every row see past the heads in front?** That is the sightline problem below.

Viewers far off the screen's axis see a distorted, lower-contrast image; keep them within about 45° of it.

### Sightlines over heads: the C-value
In tiered seating each row sees the point of focus (the bottom of the screen, the front of the stage) over the eye of the person in front by a margin called the **C-value**:

$$C = \\frac{D\\,(N + R)}{D + T} - R$$

where $D$ is the horizontal distance from the front person's eye to the point of focus, $R$ the height of that eye above the point of focus, $N$ the rise between rows and $T$ the row spacing. A head reaches about 120 mm above the eyes (sitting height minus eye height sitting), so **C ≈ 120 mm** gives a clear view over heads and hats, about 90 mm a good view, and about **60 mm** is acceptable only with **staggered seats**, where each viewer looks between two heads. These values are used for stadium and theatre seating in guidance such as the UK *Guide to Safety at Sports Grounds*. On a flat floor C is small or negative for a low point of focus: raise the screen, rake the floor or stagger the seats.

### Classrooms
Classrooms add growing bodies: children of one class differ by 20–30 cm in stature, and furniture comes in size marks (EN 1729-1) that should be matched to each child, not one size per room (see [[school-furniture]]). The teacher's sightlines to every pupil, the board height for the age group, daylight from the side, and acoustics that let every pupil hear the teacher matter as much as the furniture (see [[noise-control]], [[indoor-air]]).

### Settings
- **Offices:** meeting rooms of 4–20 people with a shared screen; video calls add a camera at eye height.
- **Schools and universities:** classrooms, laboratories, raked lecture halls.
- **Civil and public:** theatres, cinemas, places of worship, sports grounds — sightline design at scale, plus exits and wheelchair places with a view.
- **Health care:** case conference and training rooms; the same rules.
- **Military:** briefing rooms, often with maps and screens viewed by seated and standing people in bulky clothing.

> [!tip] In the simulation start with a flat floor and a random audience: some viewers cannot see the bottom of the screen. Add a rise between rows, stagger the seats or raise the screen until every sightline turns green, and read the C-values and the back-row text size.

> [!key] Give each seated person 600–750 mm of table and room to get out; size the image and its text for the back row; raise the rows, stagger the seats or raise the screen until every viewer sees over the head in front.
`,
  ideas: [
    'Allow 600–750 mm of table edge per person and 0.9–1.2 m behind the chairs.',
    'The back row sets the size of the image and its text: at least 16′, better 20–22′, per capital letter.',
    'The C-value measures how far each sightline clears the eye in front: about 120 mm clears heads, 60 mm needs staggered seats.',
    'Rake the floor, stagger the seats or raise the screen to give every row a view.',
    'Classrooms must fit children of widely different sizes: furniture in several size marks.'
  ],
  pitfalls: [
    'A bigger screen solves every visibility problem — Size helps the back row read, but if the bottom is hidden behind heads a bigger screen does not help; raise it or rake the floor.',
    'On a flat floor everyone sees if the screen is big — People in the middle rows lose the lower part of the image behind heads unless the screen is high or the seats are staggered.',
    'One table size per person fits all meetings — Writing, laptops and wheelchair places need more edge and knee room than a quick discussion.'
  ],
  formulas: [
    {
      name: 'C-value of a sightline',
      expr: 'C = D*(N + R)/(D + T) - R', tex: 'C = \\frac{D\\,(N + R)}{D + T} - R',
      vars: {
        C: { name: 'C-value: clearance of the sightline over the eye in front', q: 'length', unit: 'mm', signed: true, tex: 'C' },
        D: { name: 'horizontal distance from the front viewer\'s eye to the point of focus', q: 'length', unit: 'mm', value: 6000, tex: 'D' },
        N: { name: 'rise between rows (riser height)', q: 'length', unit: 'mm', value: 150, tex: 'N' },
        R: { name: 'height of the front viewer\'s eye above the point of focus', q: 'length', unit: 'mm', value: 500, signed: true, tex: 'R' },
        T: { name: 'row spacing (seating row depth)', q: 'length', unit: 'mm', value: 900, tex: 'T' }
      },
      note: 'About 120 mm clears heads, about 90 mm is good, about 60 mm needs staggered seats. R is negative when the point of focus is above the eyes.',
      stories: { C: 'Rows {T} apart rise by {N}. The viewer in front has his eye {R} above the point of focus, {D} from it. What is the C-value for the viewer behind?', N: 'Rows are {T} apart; the front eye is {R} above the focus and {D} from it. What rise between rows gives a C-value of {C}?' }
    },
    {
      name: 'Farthest viewing distance for an image',
      expr: 'dmax = k*Hi', tex: 'd_{max} = k\\,H_i',
      vars: {
        dmax: { name: 'distance of the farthest viewer', q: 'length', unit: 'm', tex: 'd_{max}' },
        k: { name: 'image heights allowed (4 detailed, 6 documents, 8 general viewing)', value: 6, tex: 'k' },
        Hi: { name: 'image height', q: 'length', unit: 'm', value: 1.2, tex: 'H_i' }
      },
      note: 'A rule of thumb; check the text size at the back row against 16–22′ as well.',
      stories: { dmax: 'An image is {Hi} tall and viewers read documents on it (k = {k}). How far back may the last row be?', Hi: 'The last row is {dmax} from the screen. How tall must the image be for k = {k}?' }
    },
    {
      name: 'Upward viewing angle from the front row',
      expr: 'beta = atan((Ht - He)/D1)', tex: '\\beta = \\arctan\\frac{H_t - H_e}{D_1}',
      vars: {
        beta: { name: 'upward angle to the top of the image', q: 'angle', unit: '°', signed: true, tex: '\\beta' },
        Ht: { name: 'height of the top of the image', q: 'length', unit: 'mm', value: 2600, tex: 'H_t' },
        He: { name: 'seated eye height in the front row', q: 'length', unit: 'mm', value: 1180, tex: 'H_e' },
        D1: { name: 'distance of the front row from the screen', q: 'length', unit: 'mm', value: 2500, tex: 'D_1' }
      },
      note: 'Keep it below about 30–35° so the front row need not crane.',
      stories: { beta: 'The top of the image is at {Ht}, the front row\'s eyes at {He}, {D1} from the screen. How steeply must they look up?', D1: 'How far from a screen whose top is at {Ht} must the front row sit, eyes at {He}, to look up by no more than {beta}?' }
    }
  ],
  examples: [
    {
      title: 'A raked lecture hall',
      q: 'Rows are 900 mm apart and rise 150 mm each. The viewer in front has her eyes 500 mm above the point of focus and 6000 mm from it. What is the C-value for the viewer behind, and what does it mean?',
      steps: [
        '$C = 6000 \\times (150 + 500)/(6000 + 900) - 500$.',
        '$= 3\\,900\\,000/6900 - 500 = 565 - 500 = 65$ mm.',
        'About 65 mm: acceptable only if the seats are staggered so each viewer looks between two heads. A rise of about 250 mm would give about 150 mm.'
      ],
      a: 'C ≈ 65 mm — enough with staggered seats.'
    },
    {
      title: 'Sizing a meeting-room screen',
      q: 'The back row of a meeting room is 7.5 m from the screen and people read documents on it (6 image heights). How tall must the image be, what diagonal is that for 16:9, and how tall must the capitals be for 20′ at the back row?',
      steps: [
        'Image height: $7.5/6 = 1.25$ m.',
        '16:9 width: $1.25 \\times 16/9 = 2.22$ m; diagonal $\\sqrt{1.25^2 + 2.22^2} = 2.55$ m, about 100 in.',
        'Capitals for 20′ at 7.5 m: $h = 2 \\times 7500 \\times \\tan 10′ = 43.6$ mm — about 3.5 % of the image height, so roughly 15–20 lines of text at the most.'
      ],
      a: 'An image about 1.25 m tall (about 100 in diagonal) with capitals of at least 44 mm.'
    }
  ],
  quiz: [
    { q: 'How much table edge should each seated person have for comfort?', choices: ['About 700–750 mm', 'About 400 mm', 'About 1200 mm', 'About 300 mm'], a: 0, why: 'Large shoulders are about 526 mm wide and elbows spread when writing: 600 mm at the least, 700–750 mm for comfort.' },
    { q: 'On a flat floor, several middle-row viewers cannot see the bottom of the screen. Which change helps most?', choices: ['Raise the screen, stagger the seats or rake the floor', 'Make the screen wider', 'Dim the lights', 'Move the back row closer'], a: 0, why: 'The problem is heads in front of the sightline to the bottom edge; a higher focus point, gaps between heads or a rising floor fix it.' },
    { q: 'A C-value of about 120 mm lets the viewer behind see over the head of the person in front.', a: true, why: 'The top of the head is about 115–120 mm above the eyes, so a sightline 120 mm above the front eye clears the head.' },
    { q: 'The back row of a room is 9 m from the screen and people read documents on it. By the 6-image-heights rule, how tall must the image be?', choices: ['1.5 m', '0.9 m', '2.25 m', '3 m'], a: 0, why: 'Image height = 9 m / 6 = 1.5 m.' },
    { q: 'Why do classrooms need furniture in several sizes?', choices: ['Children in one class differ by 20–30 cm in stature', 'To look varied', 'Because adults also use them', 'Because it is cheaper'], a: 0, why: 'One chair and table size fits only part of a class; EN 1729-1 size marks match furniture to each child.' }
  ],
  problems: [
    { q: 'Rows are 850 mm apart and rise 200 mm. The front viewer\'s eye is 300 mm above the point of focus and 5000 mm from it. What is the C-value?', answer: 127, unit: 'mm', tol: 0.02, steps: ['$C = 5000 \\times (200 + 300)/(5000 + 850) - 300 = 2\\,500\\,000/5850 - 300 = 427 - 300 = 127$ mm.'] },
    { q: 'An image is 1.5 m tall and is used for detailed inspection (k = 4). How far back may the last row be?', answer: 6, unit: 'm', tol: 0.01, steps: ['$d_{max} = 4 \\times 1.5 = 6$ m.'] },
    { q: 'The top of an image is 2.8 m above the floor, the front row\'s eyes 1.15 m, and the front row 3 m from the screen. What is the upward viewing angle?', answer: 28.8, unit: '°', tol: 0.02, steps: ['$\\beta = \\arctan(1650/3000) = 28.8°$ — just inside the 30–35° rule.'] }
  ],
  ranges: [
    { dim: 'Table edge per seated person', range: [600, 750], unit: 'mm', who: 'Large users (95th-percentile man\'s shoulders about 526 mm) with elbows out when writing', why: 'Neighbours do not bump elbows; there is room for papers or a laptop.', limits: '600 mm is tight for writing and laptops; wheelchair places need about 760 mm of knee room.', setting: ['office', 'civil', 'school'], src: 'Derived from shoulder breadth; planning practice (e.g. Panero and Zelnik)' },
    { dim: 'Clearance from table edge to wall behind the chairs', range: [900, 1200], unit: 'mm', who: 'Getting in and out of a chair (about 900 mm); others passing behind (about 1200 mm)', why: 'People can sit down and stand up without squeezing, and others can pass.', limits: 'Wheelchair users need more to turn and reach the table; exits follow the fire code.', setting: ['office', 'civil', 'school'], src: 'Derived from seat depth and body depth; planning practice' },
    { dim: 'Farthest viewer from a screen, in image heights', range: '4 (detail) – 6 (documents) – 8 (general)', unit: '× image height', who: 'The back row', why: 'The image is large enough for the content to be read or seen.', limits: 'A rule of thumb; check the text size at the back row (16–22′) as well.', setting: ['office', 'school', 'civil'], src: 'Audio-visual practice (the 4-6-8 rule, refined by AVIXA DISCAS)' },
    { dim: 'C-value of tiered seating', range: [60, 120], unit: 'mm', who: 'Every row seeing the point of focus over the eye in front', why: 'About 120 mm clears heads and hats; about 60 mm works with staggered seats.', limits: 'Higher C needs steeper rakes, which bring stairs, handrails and accessibility issues.', setting: ['civil', 'school'], src: 'Sightline practice for tiered seating (e.g. the UK Guide to Safety at Sports Grounds)' },
    { dim: 'Upward viewing angle from the front row to the top of the image', range: [null, 35], unit: '°', who: 'The front row', why: 'The front row watches without craning the neck back.', limits: 'A rule of thumb; long viewing wants less (about 30°) — move the front row back or lower the image.', setting: ['civil', 'school', 'office'], src: 'Cinema and audio-visual practice' },
    { dim: 'Viewer angle off the screen axis', range: [null, 45], unit: '°', who: 'Seats at the sides of the room', why: 'The image is seen without strong distortion or loss of contrast.', limits: 'Some screen technologies lose contrast sooner; wide rooms need a wider screen position or two screens.', setting: ['office', 'school', 'civil'], src: 'Audio-visual practice' }
  ],
  applications: [
    'Sizing meeting tables and rooms from the number of people and their clearances.',
    'Choosing screen size, height and text size from the distance of the back row.',
    'Designing raked lecture halls and auditoria from the C-value, with staggered seats.',
    'Placing wheelchair spaces with a view and a route in every room.'
  ],
  history: 'Theatre builders have raked their seating since antiquity; the Greek theatre at Epidaurus is a famous example of sightlines over the rows in front. Nineteenth-century engineers such as John Scott Russell worked out sightline curves for auditoria, and the C-value method became standard in stadium design in the late twentieth century. Projection in meeting rooms moved from slides and overhead projectors to digital displays, and the rules for image size were formalised by the audio-visual industry.',
  sources: [
    'UK Sports Grounds Safety Authority, *Guide to Safety at Sports Grounds* ("Green Guide"), on sightlines and C-values.',
    'AVIXA (formerly InfoComm), *Display Image Size for 2D Content in Audiovisual Systems* (DISCAS).',
    'EN 1729-1, *Furniture — Chairs and tables for educational institutions — Part 1: Functional dimensions*.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, on tables, meeting spaces and clearances.',
    '2010 ADA Standards for Accessible Design, on knee clearance at tables and wheelchair spaces.'
  ],
  sim: 'ws-sightlines'
},

{
  id: 'control-rooms', parent: 'workspace-layout', title: 'Control rooms', level: 3,
  short: 'Control rooms — for power, process plants, transport, security and emergency services — are designed from the operator outwards (ISO 11064): what each person must see, reach and hear, at consoles low enough for the 5th-percentile woman to see over and roomy enough for the 95th-percentile man\'s knees, in a room laid out for teamwork, 24-hour shifts and emergencies.',
  keywords: ['control room', 'control centre', 'ISO 11064', 'console', 'operator workstation', 'video wall', 'large display', 'shared display', 'sightline', 'over-console viewing', 'alarm', 'shift work', '24-hour chair', 'supervisor', 'link analysis', 'situation awareness', 'human-centred design'],
  prereq: ['office-layout', 'monitor-placement', 'displays-design'],
  related: ['reach-zones', 'situation-awareness', 'alarms-warnings', 'mental-workload', 'shift-work', 'hmi-screens', 'crew-stations', 'visual-ergonomics', 'thermal-comfort', 'noise-control', 'fatigue-rest-breaks', 'meeting-classroom'],
  body: `
A control room is where a few people watch over something large — a power grid, a refinery, a railway, a city's emergency calls, an air-traffic sector. Long quiet hours alternate with minutes of intense activity when alarms pour in and decisions matter. The people may be anyone in the working population, sitting for shifts of 8–12 hours, day and night. Ergonomics here is not a comfort extra; it is part of how the system stays safe.

### Design from the inside out
The ISO 11064 series sets out the process: part 1 the principles, part 2 the arrangement of the control suite, part 3 the room layout, part 4 the workstations, part 5 displays and controls, part 6 the environment and part 7 evaluation. The order matters. Start from the **tasks** — what must be monitored, decided and done, by whom, in normal operation and in an emergency; allocate them to people and automation; study the **links** between operators (who talks to whom, who needs to see whose screen); then design the workstations, then the room, then the building. Involve the operators, test with full-size mock-ups and evaluate before the room is built (see [[user-trials-mockups]]).

### The console
A console is a desk with many screens, and every desk rule applies (see [[desk-height]], [[monitor-placement]], [[reach-zones]]): a work surface adjustable over roughly 580–810 mm or a fixed one with adjustable chairs and footrests, knee room of at least 700 mm for the largest users, the primary screens within about 15° of the line of sight and the rest within easy head rotation, frequently used controls and phones within the reach of the smallest operator.

Two limits are special:
- **Seeing over the console.** When operators share a large wall display, the top of the console and its screens must stay below the sightline of the **smallest** seated operator — the 5th-percentile woman, whose eyes are only about 1070–1110 mm above the floor.
- **Screens that fit the view.** Many screens per operator mean wide consoles: their outer screens must stay within about 45° of straight ahead, or the operator turns the chair.

### Seeing the shared display
The lowest point an operator can see on a wall display, looking over the top edge of the console, follows from similar triangles:

$$H_v = H_e + (H_c - H_e)\\,\\frac{D_w}{D_c}$$

where $H_e$ is the eye height, $H_c$ the height of the console's top edge, $D_c$ its horizontal distance from the eye and $D_w$ the distance to the wall. A console edge just 30 mm above the eyes at 1 m hides everything below about 180 mm above eye level on a wall 6 m away — the effect is magnified six times. Text on the wall display is sized for the **farthest** operator: 20′ at 8 m needs capitals about 47 mm tall (see [[visual-ergonomics]]). Upward viewing angles should stay modest, because operators watch the wall for hours; a wall display low and far is kinder to the neck than one high and close.

### The room
- **Layout:** consoles arranged by the links between operators, a supervisor who can see the operators and the shared display (often on a raised platform), circulation behind the consoles, visitors kept out of the operators' view and hearing.
- **Space:** plan from the layout, not from a figure per head — consoles need far more floor than desks.
- **Environment:** dimmable, glare-free lighting that suits both screens and paper, individual control of temperature where possible, acoustics that keep one operator's calls from masking another's alarms (see [[thermal-comfort]], [[noise-control]], [[glare-colour]]).
- **People:** 24-hour chairs rated for continuous use and larger users, sit–stand consoles for alertness, rest rooms and kitchens nearby, and shift schedules that respect sleep (see [[shift-work]], [[fatigue-rest-breaks]]).
- **Alarms:** well-designed alarms and displays keep the operators' picture of the situation clear in an upset (see [[alarms-warnings]], [[situation-awareness]]).

### Settings
- **Industry and utilities:** refinery, chemical-plant and power-station control rooms, linked to field operators outside.
- **Transport:** rail signalling, traffic and air-traffic control.
- **Civil:** emergency call and dispatch centres, CCTV rooms — many screens and stress (see [[psychosocial-factors]]).
- **Health care:** central monitoring in intensive care.
- **Military:** operations centres and ships' information centres — dim rooms, crowded consoles, long watches (see [[crew-stations]], [[sustained-operations]]).
- **Field:** mobile command posts in vehicles and containers — the same rules in far less space.

> [!tip] In the simulation seat the 5th-percentile woman at a console with tall screens and watch the wall display disappear; then add a supervisor row and find the platform height that lets her see over a tall operator.

> [!key] Design from the tasks outwards; keep console tops below the smallest operator's sightline, size wall-display text for the farthest one, and plan the room for teamwork, 24-hour shifts and upsets.
`,
  ideas: [
    'ISO 11064 designs control centres from the tasks and links between operators outwards: workstation, room, building.',
    'Every desk and screen rule applies at a console; many screens make wide consoles and demand head rotation limits.',
    'Console tops must stay below the sightline of the smallest seated operator to the shared display.',
    'The height hidden on a wall display is magnified by the ratio of wall distance to console distance.',
    'Wall-display text is sized for the farthest operator; lighting, acoustics, chairs and shifts are designed for 24-hour work.'
  ],
  pitfalls: [
    'A few centimetres of console height do not matter — Any excess over the eye line is magnified by D_w/D_c, typically five to ten times, on the wall display.',
    'Control rooms can be planned like offices by area per person — They are planned from the tasks, the links between operators and the sightlines, which usually need much more space.',
    'The supervisor can see everything from the back of the room — Only if the floor is raised or the consoles and operators are low enough; check the sightline over the tallest operator.'
  ],
  formulas: [
    {
      name: 'Lowest visible point on a wall display',
      expr: 'Hv = He + (Hc - He)*Dw/Dc', tex: 'H_v = H_e + (H_c - H_e)\\,\\frac{D_w}{D_c}',
      vars: {
        Hv: { name: 'lowest visible height on the wall display', q: 'length', unit: 'mm', signed: true, tex: 'H_v' },
        He: { name: 'operator\'s seated eye height above the floor', q: 'length', unit: 'mm', value: 1090, tex: 'H_e' },
        Hc: { name: 'height of the top edge of the console (or its screens)', q: 'length', unit: 'mm', value: 1120, tex: 'H_c' },
        Dw: { name: 'horizontal distance from the eye to the wall display', q: 'length', unit: 'mm', value: 6000, tex: 'D_w' },
        Dc: { name: 'horizontal distance from the eye to the console edge', q: 'length', unit: 'mm', value: 1000, tex: 'D_c' }
      },
      note: 'Similar triangles through the console edge. Use the smallest seated operator; the same formula checks a supervisor looking over operators\' heads.',
      stories: { Hv: 'An operator\'s eyes are at {He}; the console edge, {Dc} away, is at {Hc}. The wall display is {Dw} away. How high is the lowest point she can see on it?', Hc: 'Eyes at {He}, a console edge {Dc} away and a wall {Dw} away: how high may the console edge be for the operator to see down to {Hv}?' }
    },
    {
      name: 'Upward angle to the top of a wall display',
      expr: 'beta = atan((Ht - He)/Dw)', tex: '\\beta = \\arctan\\frac{H_t - H_e}{D_w}',
      vars: {
        beta: { name: 'upward viewing angle', q: 'angle', unit: '°', signed: true, tex: '\\beta' },
        Ht: { name: 'height of the top of the display', q: 'length', unit: 'mm', value: 2600, tex: 'H_t' },
        He: { name: 'seated eye height above the floor', q: 'length', unit: 'mm', value: 1090, tex: 'H_e' },
        Dw: { name: 'horizontal distance to the display', q: 'length', unit: 'mm', value: 6000, tex: 'D_w' }
      },
      stories: { beta: 'A wall display\'s top is at {Ht}; an operator\'s eyes are at {He}, {Dw} away. How far up does she look?' }
    },
    {
      name: 'Character height on a shared display',
      expr: 'h = 2*D*tan(theta/2)', tex: 'h = 2D\\tan\\frac{\\theta}{2}',
      vars: {
        h: { name: 'capital letter height', q: 'length', unit: 'mm', tex: 'h' },
        D: { name: 'distance of the farthest operator', q: 'length', unit: 'mm', value: 8000, tex: 'D' },
        theta: { name: 'visual angle of a capital (16′ minimum, 20–22′ preferred)', q: 'angle', unit: '′', value: 20, min: 0, tex: '\\theta' }
      },
      stories: { h: 'The farthest operator sits {D} from the wall display. How tall must its capitals be to subtend {theta}?' }
    }
  ],
  examples: [
    {
      title: 'Tall screens on a console',
      q: 'A 5th-percentile woman sits at 420 mm with an eye height sitting of 686 mm. The top of the screens on her console is 900 mm in front of her eyes; the wall display is 6 m away. What is the lowest point she can see on the wall if the screens reach 1150 mm, and if they are lowered to 1050 mm?',
      steps: [
        'Eye height: $420 + 686 = 1106$ mm.',
        'Screens at 1150 mm: $H_v = 1106 + 44 \\times 6000/900 = 1106 + 293 = 1399$ mm.',
        'Screens at 1050 mm: $H_v = 1106 - 56 \\times 6000/900 = 1106 - 373 = 733$ mm.',
        'A 100 mm lower console uncovers about 670 mm of wall display.'
      ],
      a: 'About 1400 mm with the tall screens, about 730 mm with the lower ones.'
    },
    {
      title: 'Text on the video wall',
      q: 'The farthest operator sits 8 m from the wall display. How tall must capitals be for 16′ and for 20′?',
      steps: [
        '16′: $h = 2 \\times 8000 \\times \\tan 8′ = 37.2$ mm.',
        '20′: $h = 2 \\times 8000 \\times \\tan 10′ = 46.5$ mm.',
        'A wall display 1.5 m tall holds about 20–25 lines of such text — design the content for it.'
      ],
      a: 'About 37 mm at the least, 47 mm preferred.'
    }
  ],
  quiz: [
    { q: 'Which operator limits the height of consoles in a room with a shared wall display?', choices: ['The smallest seated operator (a 5th-percentile woman)', 'The tallest operator', 'The supervisor', 'The average operator'], a: 0, why: 'The smallest seated eye height has the lowest sightline over the console; if she sees the wall, everyone does.' },
    { q: 'A console edge 1 m from the eyes rises 20 mm above the eye line. The wall display is 8 m away. How much of the wall above eye height is hidden?', choices: ['About 160 mm', 'About 20 mm', 'About 2.5 mm', 'About 800 mm'], a: 0, why: 'The excess is magnified by D_w/D_c = 8: 20 × 8 = 160 mm.' },
    { q: 'In ISO 11064 the control room is designed starting from the building and working inwards to the consoles.', a: false, why: 'The approach is from the inside out: tasks and links first, then workstations, then the room and the building.' },
    { q: 'For whom is the text on a shared wall display sized?', choices: ['The farthest operator', 'The nearest operator', 'The supervisor only', 'Visitors'], a: 0, why: 'If the farthest operator can read it at 16–22′, everyone nearer can too.' },
    { q: 'Why are 24-hour chairs used in control rooms?', choices: ['They are used continuously by several people of different sizes and must last and adjust quickly', 'They are cheaper', 'They recline flat for sleeping', 'They have no armrests'], a: 0, why: 'Round-the-clock use by several shifts needs robust, quickly adjustable chairs rated for larger users.' }
  ],
  problems: [
    { q: 'An operator\'s eyes are 1100 mm above the floor. The console edge, 800 mm away, is at 1060 mm. The wall display is 5 m away. What is the lowest height she can see on the wall?', answer: 850, unit: 'mm', tol: 0.01, steps: ['$H_v = 1100 + (1060 - 1100) \\times 5000/800 = 1100 - 250 = 850$ mm.'] },
    { q: 'The top of a wall display is 2.4 m above the floor and 7 m from an operator whose eyes are at 1.1 m. What is the upward viewing angle?', answer: 10.5, unit: '°', tol: 0.02, steps: ['$\\beta = \\arctan(1300/7000) = 10.5°$.'] },
    { q: 'How tall must capitals be to subtend 22′ at 10 m?', answer: 64, unit: 'mm', tol: 0.01, steps: ['$h = 2 \\times 10\\,000 \\times \\tan 11′ = 20\\,000 \\times 0.0032 = 64$ mm.'] }
  ],
  ranges: [
    { dim: 'Console top edge for over-console viewing, height above the floor', range: [null, 1100], unit: 'mm', who: 'The 5th-percentile woman seated, eyes about 1070–1110 mm above the floor', why: 'The smallest operator sees the shared display over her own console and those in front.', limits: 'Depends on the distances: the farther the wall and the nearer the console edge, the lower it must be; check with the sightline formula.', setting: ['workshop', 'civil', 'military', 'health'], src: 'Derived from seated eye height; see ISO 11064-4' },
    { dim: 'Console work surface height (seated, adjustable)', range: [580, 810], unit: 'mm', who: '5th-percentile woman to 95th-percentile man, chair fitted to the legs', why: 'Each operator of each shift works at elbow height.', limits: 'Fixed consoles need adjustable chairs and footrests; sit–stand consoles need about 1180 mm at the top.', setting: ['workshop', 'civil', 'military', 'health'], src: 'As for desks (EN 527-1; representative body data)' },
    { dim: 'Knee clearance under the console', range: [700, null], unit: 'mm', who: '95th-percentile man at his own seat height', why: 'The largest operators sit close to the console without their thighs touching.', limits: 'Cable ducts and equipment bays under consoles often steal it.', setting: ['workshop', 'civil', 'military'], src: 'Derived from thigh clearance; see ISO 11064-4' },
    { dim: 'Primary console screens, angle from straight ahead', range: [0, 15], unit: '°', who: 'Every operator: easy eye rotation', why: 'The screens watched most are seen without turning.', limits: 'Wide consoles push outer screens far out; place them by frequency of use.', setting: ['workshop', 'civil', 'military'], src: 'MIL-STD-1472, visual field figures' },
    { dim: 'Outer console screens, angle from straight ahead', range: [null, 45], unit: '°', who: 'Easy head rotation', why: 'Occasional glances need only a comfortable turn of the head.', limits: 'Beyond about 60° the operator turns the chair — acceptable only for rarely used screens.', setting: ['workshop', 'civil', 'military'], src: 'MIL-STD-1472, visual field figures' },
    { dim: 'Capital height on shared displays, visual angle at the farthest operator', range: '≥ 16′, preferably 20–22′', unit: '', who: 'The farthest operator', why: 'Everyone in the room reads the shared picture without leaving the console.', limits: 'Large text fits fewer lines: design the content of the wall for its distance.', setting: ['workshop', 'civil', 'military', 'health'], src: 'ISO 9241-303 applied to shared displays' }
  ],
  applications: [
    'Designing a new control room with ISO 11064: task analysis, link analysis, mock-ups, then the room.',
    'Checking over-console sightlines to a video wall for the smallest operator and for a supervisor on a platform.',
    'Sizing text and symbols on video walls from the distance of the farthest operator.',
    'Refitting control rooms with sit–stand consoles, 24-hour chairs and dimmable, glare-free lighting.'
  ],
  history: 'Early control rooms of the 1950s and 1960s were walls of analogue instruments and switches. The Three Mile Island nuclear accident in 1979 exposed how control-room design — displays, alarms and layout — could mislead operators, and led to a large programme of human-factors review in the nuclear industry. The ISO 11064 series, published in parts from 2000 onwards, brought the lessons of process, nuclear and transport control rooms together into one design process.',
  sources: [
    'ISO 11064-1 to -7, *Ergonomic design of control centres* (principles, arrangement of control suites, room layout, workstations, displays and controls, environment, evaluation).',
    'ISO 9241-303, *Ergonomics of human-system interaction — Requirements for electronic visual displays*.',
    'MIL-STD-1472, *Human Engineering* (US Department of Defense), visual field and console design.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on consoles and sightlines.',
    'G. Salvendy (ed.), *Handbook of Human Factors and Ergonomics*, on control rooms and process control.'
  ],
  sim: ['ws-control', 'ws-reach']
}

);
