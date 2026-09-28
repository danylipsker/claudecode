/* HYPER-ERGONOMICS · content/furniture-spaces.js
 * Topics home-furniture (dining, sofas, beds, kitchens, bathrooms, children's furniture) and building-spaces
 * (stairs, ramps, doors and corridors, counters, storage heights, accessible design). Simulations: sims/furniture-spaces.js (fs-…). */
Hyper.add(

{
  id: 'dining-tables-chairs', parent: 'home-furniture', title: 'Dining tables and chairs', level: 1,
  short: 'A dining table near 720–760 mm and a chair seat near 430–470 mm are not fashion: the 270–300 mm between them fits the elbows, the thighs must clear the apron, and each diner needs about 600 mm of table edge. The ranges, who limits each one, and how a room is sized around a table.',
  keywords: ['dining table height', 'dining chair height', 'seat to table height', 'apron', 'knee room', 'place setting', 'width per person', 'round table', 'bar stool', 'counter stool', 'footrest', 'clearance behind chair', 'dining room size'],
  prereq: ['design-for-range', 'sitting-dimensions', 'desk-height'],
  related: ['sofas-lounge', 'kitchen-ergonomics', 'children-furniture', 'accessible-design', 'office-chair', 'school-furniture', 'commercial-kitchens'],
  body: `
A dining table is a work surface for a short, social task: people sit for 20 minutes to two hours, lift food and drink from the table to the mouth, talk across it and get up and down. Its dimensions come from three body measures — the height of the back of the knee (**popliteal height**), the height of the elbow above the seat, and the thickness of the thighs — and from the width people take up side by side.

### Heights: the 270–300 mm rule
The chair seat should be close to popliteal height plus shoes: for the representative adults of this app that is 387 mm for a 5th-percentile woman, 430 mm for the median woman, 470 mm for the median man and 516 mm for a 95th-percentile man (a [[?gaussian]] spread, $x_p = \\mu + z_p\\sigma$). Dining chairs settle on **430–470 mm** — a compromise that suits the middle and needs a cushion or footrest at the ends.

The table should then sit a little above the seated elbow. Elbow rest height is about 240 mm above the seat for adults, so the **drop from table top to seat of 270–300 mm** puts the forearms just below the table edge, where cutting and lifting a fork are easy. Table heights of **720–760 mm** follow. A 450 mm seat under a 750 mm table (a 300 mm drop) suits most adults; the same table with a low 420 mm designer seat leaves a small person's plate at chin height.

| Dimension | Range | Limited by | What goes wrong outside it |
|---|---|---|---|
| Seat height | 430–470 mm | popliteal height: small users (top), tall users (bottom) | feet dangle, the seat edge presses the thighs; or knees up, weight on the buttocks |
| Table height | 720–760 mm | seated elbow height | too high: shoulders shrug; too low: stooping over the plate |
| Table top minus seat | 270–300 mm | elbow rest height | the relation that matters more than either height alone |
| Underside of apron or rail | ≥ 620–650 mm | thigh thickness of large users | thighs jammed, no room to cross legs |
| Seat depth | 400–450 mm | buttock–popliteal length of small users | seat edge behind the knees; small people cannot use the backrest |
| Table edge per diner | 600 mm (700 mm with armchairs) | shoulder and elbow breadth of large users | elbows clash; people eat sideways |
| Table width across | 800–1000 mm | two place settings (about 400 mm each) and dishes | too narrow for plates and serving dishes; too wide to pass food |

### The hidden clearance: thighs under the apron
Most discomfort at dining tables is under them. A 95th-percentile man's thighs are about 190 mm thick; on a 450 mm seat their top is at 640 mm. A 750 mm table with a 25 mm top and a 90 mm apron has only 635 mm underneath — his thighs touch before he pulls in. Keep the apron shallow (under about 70 mm at 750 mm), set it back from the edge, or use a trestle or pedestal base. The same check fails far sooner with a chair arm, a table leg at a place, or a wheelchair (whose user needs about 685 mm of knee height and a 760 mm wide gap between legs).

### Width per person and the table's size
Neufert and Panero and Zelnik both work from a **place setting of about 600 × 400 mm**: plate, glass and cutlery in front of each person and elbow room at the sides. Tight tables go down to 550 mm a place for small people or children; armchairs and generous dining need 700–750 mm. Round tables seat about $n \\approx \\pi D / w$ people: 1200 mm seats six at 600 mm each, 1500–1600 mm seats eight.

Around the table allow about **750–900 mm** from the table edge to a wall or furniture for pushing the chair back and rising, and **1100–1200 mm** where others must walk behind seated diners. A table for six (1800 × 900 mm) therefore needs a room of roughly 3.6 × 2.7 m before any sideboard. **In the sim**, pick a person and a table and look under the table first: the thighs turn red long before the elbows do.

### High tables and stools
Kitchen counters at 900–950 mm take stools at 600–650 mm; bar counters at 1050–1100 mm take stools at 750–800 mm. The seat-to-counter drop is again 250–300 mm, but now nobody's feet reach the floor: a **footrest about 430–480 mm below the seat** (popliteal height plus shoe) is not optional. Without it the thighs bear on the seat edge and people perch and fidget.

### Settings
- **Homes:** the widest range of users — children at adult tables need booster seats and footrests (see [[children-furniture]]); older people need firm chairs with arms, about 450–480 mm high, to rise from (see [[sofas-lounge]]).
- **Restaurants and canteens:** seats are often lower and tables smaller to fit more covers; a portion of tables must suit wheelchair users — the 2010 ADA Standards ask for dining surfaces 710–865 mm (28–34 in) high with knee clearance beneath.
- **Care homes and hospitals:** tables that wheelchairs and bed-tables fit under, chairs with arms, and space for a carer beside the diner.
- **Workplaces and field camps:** canteen benches and folding tables follow the same rules; fixed benches must leave room to swing the legs over.

> [!warn] Tall stools and chairs that tip are a real hazard for children and older people: check the stability of high seating and give it a footrest and, for older users, arms and a backrest.

> [!key] Fit the drop from table to seat (270–300 mm) and the clearance under the table first; then give each diner 600 mm of edge and 750–1200 mm behind the chair.
`,
  ideas: [
    'Seat height follows popliteal height plus shoes; dining chairs settle on 430–470 mm, a compromise for the middle of the range.',
    'The drop from table top to seat, 270–300 mm, matters more than either height: it puts the forearms just below the table edge.',
    'The largest thighs limit the space under the table: keep aprons shallow or set back.',
    'Each diner needs about 600 mm of table edge (700 mm with armchairs) and 750–1200 mm behind the chair.',
    'High counters need high stools, and high stools need a footrest about popliteal height below the seat.'
  ],
  pitfalls: [
    'A standard 750 mm table fits everyone — It fits the seat it is used with: with a low seat or a small user the drop is too large, and a deep apron catches large thighs.',
    'Round tables seat more people in less space — A round table gives each person the same 600 mm of edge only at a large diameter; a 1200 mm round table seats six, the same as a 1800 × 900 mm rectangle.',
    'A bar stool is just a tall chair — Without a footrest the feet hang and the seat edge presses the thighs; the footrest is part of the seat.'
  ],
  formulas: [
    {
      name: 'Deepest apron that clears the thighs',
      expr: 'a = Ht - t - Hs - T - c', tex: 'a = H_t - t - H_s - T - c',
      vars: {
        a: { name: 'greatest apron depth below the table top', q: 'length', unit: 'mm' },
        Ht: { name: 'table height (top surface)', q: 'length', unit: 'mm', value: 750, tex: 'H_t' },
        t: { name: 'thickness of the table top', q: 'length', unit: 'mm', value: 25 },
        Hs: { name: 'seat height', q: 'length', unit: 'mm', value: 450, tex: 'H_s' },
        T: { name: 'thigh clearance of the largest user (95th-percentile man)', q: 'length', unit: 'mm', value: 190 },
        c: { name: 'free space above the thighs', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'A negative result means the thighs of the chosen user cannot fit under the top at all at this seat height.',
      stories: { a: 'A {Ht} table has a {t} top; chairs are {Hs} high and the largest thighs {T} thick. Leaving {c} free, how deep may the apron be?', Hs: 'The table is {Ht} high with a {t} top and an apron {a} deep. How high may the seat be for thighs {T} thick with {c} to spare?' }
    },
    {
      name: 'People around a round table',
      expr: 'n = pi*D/w', tex: 'n = \\frac{\\pi D}{w}',
      vars: {
        n: { name: 'number of places (round down)' },
        D: { name: 'table diameter', q: 'length', unit: 'mm', value: 1200 },
        w: { name: 'table edge per place', q: 'length', unit: 'mm', value: 600 }
      },
      note: '600 mm a place for ordinary dining; 700–750 mm with armchairs or for comfort; 550 mm is tight.',
      stories: { n: 'How many people fit around a round table {D} across at {w} each?', D: 'What diameter seats {n} people at {w} of edge each?' }
    }
  ],
  examples: [
    {
      title: 'A round table for eight',
      q: 'What diameter does a round table need to seat eight people at 600 mm each, and at 700 mm each?',
      steps: ['$D = n w / \\pi = 8 \\times 600 / \\pi = 1528$ mm.', 'At 700 mm a place: $8 \\times 700 / \\pi = 1783$ mm.', 'Plan for about 1.8 m of room behind every chair as well: the table and its ring of chairs need a space of about 3.3–3.6 m across.'],
      a: 'About 1.5–1.6 m for ordinary dining, about 1.8 m for comfort.'
    },
    {
      title: 'Will large thighs fit under the table?',
      q: 'Thigh clearance is 165 ± 15 mm for men. A table is 750 mm high with a 25 mm top and chairs are 450 mm high. How deep may the apron be for the 95th-percentile man with 20 mm to spare?',
      steps: ['95th-percentile thigh clearance: $165 + 1.645 \\times 15 = 190$ mm.', 'Top of his thighs: $450 + 190 = 640$ mm; with 20 mm to spare, the underside must be at 660 mm or higher.', 'Apron: $750 - 25 - 660 = 65$ mm at most. A typical 90–100 mm rail is too deep — set it back from the place, or lower the chair.'],
      a: 'About 65 mm; deeper aprons pinch the largest users.'
    }
  ],
  quiz: [
    { q: 'Which relation matters most for eating comfortably at a table?', choices: ['The drop from table top to seat, about 270–300 mm', 'The table height alone, always 750 mm', 'The seat height alone, always 450 mm', 'The width of the table'], a: 0, why: 'The forearms must meet the table just above elbow height; that depends on the difference between the two heights, which is why a low sofa-like dining chair makes a normal table feel too high.' },
    { q: 'Whose body limits the space under a dining table?', choices: ['The largest users, with the thickest thighs', 'The smallest users', 'The average user', 'Children'], a: 0, why: 'Under-table space is a clearance: if the largest thighs fit, everyone smaller fits too.' },
    { q: 'A 1200 mm round table seats about how many people at 600 mm each?', choices: ['6', '4', '8', '10'], a: 0, why: 'π × 1200 / 600 ≈ 6.3, so six.' },
    { q: 'A kitchen counter is 1050 mm high. About how high should its stools be, and what else do they need?', choices: ['About 750–800 mm, with a footrest about 450 mm below the seat', 'About 450 mm, like a dining chair', 'About 1000 mm, with no footrest', 'About 600 mm, with no footrest'], a: 0, why: 'Keep the 250–300 mm drop to the counter; the feet then hang, so a footrest at about popliteal height below the seat carries them.' },
    { q: 'True or false: an apron that clears the median man\'s thighs is deep enough.', a: false, why: 'Half of men have thicker thighs than the median; clearances are set from the high percentiles.' }
  ],
  problems: [
    { q: 'A family table is 1800 mm long and 900 mm wide. With 600 mm a place along the two long sides and one person at each end, how many people does it seat?', answer: 8, unit: '', tol: 0.001, steps: ['Along each long side: 1800 / 600 = 3 places, so 6.', 'Each 900 mm end takes one person: 2 more.', 'Eight in all (six in comfort, if the ends are left for serving).'] },
    { q: 'A table is 740 mm high. What seat height gives a 290 mm drop from the table top?', answer: 450, unit: 'mm', tol: 0.005, steps: ['$740 - 290 = 450$ mm.'] }
  ],
  ranges: [
    { dim: 'Dining chair seat height (compressed)', range: [430, 470], unit: 'mm', who: 'median woman to median man: popliteal height plus about 25 mm of shoe', why: 'Feet flat, thighs about level, no pressure from the seat edge.', limits: 'Small users (5th-percentile woman about 390 mm) need a footrest or a lower chair; tall users sit with knees high.', setting: ['civil', 'health'], src: 'Popliteal heights of this app\'s representative adult body data (Tools → Body sizes); Pheasant and Haslegrave, Bodyspace' },
    { dim: 'Dining table height', range: [720, 760], unit: 'mm', who: 'seated elbow height of most adults on a 430–470 mm seat', why: 'The plate and forearms meet just above elbow height; no shrugged shoulders, no stoop.', limits: 'Right only with the matching seat; children and wheelchair users need other heights.', setting: ['civil', 'health', 'office'], src: 'Panero and Zelnik, Human Dimension and Interior Space' },
    { dim: 'Drop from table top to seat', range: [270, 300], unit: 'mm', who: 'elbow rest height above the seat (about 190–295 mm, 5th woman to 95th man) plus thigh room', why: 'Keeps the forearms at the table edge and leaves room for the thighs.', limits: 'Larger drops suit small people poorly; smaller drops pinch large thighs.', setting: ['civil', 'office', 'health', 'school'], src: 'Pheasant and Haslegrave, Bodyspace' },
    { dim: 'Clear height under an apron or rail', range: [620, null], unit: 'mm', who: '95th-percentile man\'s thigh clearance (about 190 mm) on a 430–450 mm seat', why: 'Thighs slide under and legs can cross.', limits: 'Higher seats, thick cushions and wheelchairs need more — about 685 mm of knee height for a wheelchair.', setting: ['civil', 'health'] },
    { dim: 'Table edge per diner', range: [600, 750], unit: 'mm', who: 'shoulder and elbow breadth of large users', why: 'Elbows do not clash while cutting; a place setting fits in front.', limits: '550 mm is tight for adults; armchairs need 700 mm or more.', setting: ['civil', 'health', 'office'], src: 'Neufert, Architects\' Data (place setting about 600 × 400 mm)' },
    { dim: 'Space from table edge to wall behind a chair', range: [750, 1200], unit: 'mm', who: 'pushing a chair back and rising (750–900 mm); walking behind a seated diner (1100–1200 mm)', why: 'People can get up without hitting the wall and others can pass.', limits: 'Wheelchair users need a clear 760 × 1220 mm space at the table and a route to it.', setting: ['civil', 'health'], src: 'Panero and Zelnik, Human Dimension and Interior Space' },
    { dim: 'Footrest below a high stool seat', range: [430, 480], unit: 'mm', who: 'popliteal height plus shoe of the middle of the range', why: 'Carries the feet so the thighs are not pressed by the seat edge.', limits: 'One fixed footrest suits the middle; small users still dangle, tall users sit with knees high.', setting: ['civil', 'office'] },
    { dim: 'Accessible dining surface height', range: [710, 865], unit: 'mm', who: 'wheelchair users (28–34 in in the 2010 ADA Standards), with knee clearance beneath', why: 'A wheelchair user can pull in under the table and reach the plate.', limits: 'Needs knee clearance about 685 mm high and a gap between legs; national rules differ.', setting: ['civil', 'health'], src: '2010 ADA Standards for Accessible Design (dining and work surfaces)' }
  ],
  applications: [
    'Choosing chairs for an existing table: measure the table, subtract 270–300 mm, and look for seats in that band.',
    'Kitchen islands and bar counters with matching stools and footrails.',
    'Restaurant and canteen layouts: covers per square metre against space behind the chairs.',
    'Care-home dining rooms: tables wheelchairs fit under, chairs with arms, room for a carer.'
  ],
  sources: [
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapters on dining and on seating.',
    'E. Neufert, *Architects\' Data*, the sections on dining rooms and place settings.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on seat and table heights and the seat-to-table relation.',
    'ISO 7250-1, *Basic human body measurements for technological design — Part 1*: popliteal height, thigh clearance, elbow rest height.',
    '2010 ADA Standards for Accessible Design (US Department of Justice): dining surfaces, knee and toe clearance.',
    'EN 12520 (domestic seating) and EN 12521 (domestic tables): strength, durability and safety — they do not fix comfortable sizes.'
  ],
  sim: 'fs-dining'
},

{
  id: 'sofas-lounge', parent: 'home-furniture', title: 'Sofas and lounge seating', level: 2,
  short: 'Lounge seats are low, deep and soft for relaxing — and that is exactly what makes them hard to get out of, especially for older people. Seat height and depth, back angle, cushions and armrests in ranges, and the mechanics of rising from a seat.',
  keywords: ['sofa seat height', 'armchair', 'easy chair', 'lounge chair', 'seat depth', 'rising from a chair', 'sit to stand', 'older people', 'riser chair', 'armrests', 'cushion', 'recliner', 'high seat chair', 'coffee table'],
  prereq: ['dining-tables-chairs', 'sitting-dimensions', 'spinal-loading'],
  related: ['age-children-elderly', 'bathroom-ergonomics', 'beds-bedrooms', 'accessible-design', 'strength-and-force', 'physics:torque', 'physics:center-of-mass', 'medicine:ageing'],
  body: `
An easy chair has a different job from a dining chair: it should let the muscles rest. So lounge seats are **lower (380–450 mm), deeper (500–600 mm), tilted back and softer**, with a reclined back. Every one of those choices makes sitting down pleasant and **getting up harder** — and for many older people, getting out of their own sofa is the hardest physical task of the day.

### Sitting: the resting posture
- **Seat height** (measured with the cushion compressed): 380–450 mm lets the legs stretch forward. Below the popliteal height of the user the knees rise above the hips.
- **Seat depth**: 480–550 mm for adults to use the backrest; a 5th-percentile woman's buttock–popliteal length is about 440 mm, so on a 600 mm deep sofa she either sits forward without back support or has her feet off the floor. Deep sofas need cushions for small people.
- **Back**: reclined to about 100–110° from the seat and high enough to support the shoulders; a head rest for the tall. The seat itself tilts back 5–10°.
- **Width**: 550–650 mm per person on a sofa; an armchair's inner width of 500–550 mm clears the widest hips (a 95th-percentile woman's hip breadth sitting is about 450 mm) with clothing.
- **Armrests**: 180–250 mm above the compressed seat, firm and reaching to the front edge.

### Rising: why low and soft is hard
To stand up, a person first slides forward, draws the feet back and leans the trunk forward until the body's centre of mass ([[physics:center-of-mass|centre of mass]]) is over the feet; only then can the legs lift it. From a low seat three things go against them:

1. **The hip is below the knee.** The thighs slope up, so the hip is already bent past 90° before any lean. People can only bend so far — less with a large abdomen, stiff hips or after some hip operations — so the lean runs out before the centre of mass reaches the feet.
2. **The knee is deeply bent.** The thigh muscles work at a poor length and must lift the body further; the knee [[physics:torque|torque]] at lift-off is high.
3. **Soft cushions sink and give nothing to push from**, and a solid base stops the feet from being drawn back under the seat.

Healthy adults overcome this with a swing of the trunk — momentum — or a push on the armrests. Many older people rise slowly, with no momentum, and depend on **armrests**: every newton the arms carry is taken off the legs and lets the centre of mass stay behind the feet. Biomechanical studies of rising consistently find that raising the seat and adding firm armrests reduce the effort at the knee.

| Seat (compressed) as a share of lower-leg length (popliteal height + shoe) | Rising for a slow, careful person |
|---|---|
| below about 85 % (a low sofa) | often needs armrests, momentum or help |
| about 90–100 % | possible with feet drawn back and a good lean |
| 100–115 % (a "high-seat" chair) | easiest; feet still reach the floor |

**In the sim**, a person rises from a sofa, an armchair, a dining chair, a WC or a bed edge. It is a static model: the body held still at the moment of lift-off, with segment masses and lengths from classic cadaver data. Lower the seat or the forward bend the person can manage and watch the lean run out; switch the armrests on and read the force the arms must supply.

### Seating for older people
Chairs made for older people raise the seat to about **450–500 mm compressed**, use firm cushions, keep the seat depth to about 450–500 mm, tilt the seat back only a little, and give sturdy armrests that reach the front edge at a comfortable push height. Riser-recliner chairs lift the whole seat. In homes, raising an existing sofa on blocks or adding a firm cushion is often the cheapest fall-prevention measure there is — but check that the feet still rest flat.

### Around the sofa
- **Coffee table** 400–450 mm high and about 400–450 mm clear of the seat front: reachable without leaning far, with room for the knees and feet.
- **Viewing**: a television is best at or a little below seated eye height (about 1000–1250 mm above the floor for adults on a sofa).
- **Circulation**: 900 mm or more between furniture where people walk.

### Settings
Homes serve the widest range of users; **care homes, hospitals and waiting rooms** (health) choose firmer, higher seats with arms and wipeable covers, and mix heights so every visitor finds one that fits; **offices and public lounges** add durability and a mix of seat heights.

> [!warn] Falls often happen at transfers — rising from a chair, a bed or a WC. A seat that is too low or too soft for its user is a fall risk; persistent difficulty in rising deserves a conversation with a doctor or physiotherapist, not only a new chair.

> [!key] Rest and rising pull in opposite directions: low, deep and soft rests the body, high, firm and armed gets it up. Choose seat height from the user's lower leg, and keep firm armrests to the front edge.
`,
  ideas: [
    'Lounge seats are lower, deeper, tilted back and softer than work seats — good for resting, hard for rising.',
    'To stand, the centre of mass must get over the feet; a low seat bends the hip so far that the forward lean runs out.',
    'Armrests let the arms carry part of the weight and relieve the knees — decisive for many older people.',
    'Seat height should be judged against the user\'s lower leg, measured with the cushion compressed.',
    'A deep seat that suits the tall leaves small people without back support.'
  ],
  pitfalls: [
    'A sofa\'s seat height is what the catalogue says — The height that matters is with the cushion compressed under the user, often 40–80 mm lower.',
    'Anyone can get up from a low seat by leaning forward — The lean is limited by how far the hip and spine bend; from a low seat it runs out before the body is over the feet, so momentum, arms or help are needed.',
    'Higher is always better for older people — Above popliteal height plus shoe the feet leave the floor and the seat edge presses the thighs; aim at 100–115 % of the lower leg, not as high as possible.'
  ],
  formulas: [
    {
      name: 'Force the arms must give when the body is behind the feet',
      expr: 'F = m*g*dc/dh', tex: 'F = \\frac{m g\\, d_c}{d_h}',
      vars: {
        F: { name: 'force pushed down through the armrests', q: 'force', unit: 'N' },
        m: { name: 'body mass', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' },
        dc: { name: 'distance the centre of mass is behind the feet', q: 'length', unit: 'mm', value: 80, tex: 'd_c' },
        dh: { name: 'distance the hands are behind the feet', q: 'length', unit: 'mm', value: 250, tex: 'd_h' }
      },
      note: 'Static balance of moments about the feet at the moment of lift-off. If the centre of mass is behind the hands too (dc > dh), no push on the armrests is enough.',
      stories: { F: 'A {m} person leans as far as they can; their centre of mass is still {dc} behind their feet and their hands are on armrests {dh} behind the feet. How hard must they push?', dc: 'A {m} person can push {F} through the arms with the hands {dh} behind the feet. How far behind the feet may the centre of mass be?' }
    },
    {
      name: 'Knee effort at lift-off',
      expr: 'M = m*g*d', tex: 'M = m g\\, d',
      vars: {
        M: { name: 'knee extending moment needed', q: 'torque', unit: 'N·m' },
        m: { name: 'mass carried by the legs', q: 'mass', unit: 'kg', value: 80 },
        g: { const: 'g' },
        d: { name: 'horizontal distance from the knee back to the line of the body weight', q: 'length', unit: 'mm', value: 120 }
      },
      note: 'A static estimate: with the weight over the feet, the knee sits in front of it by roughly the shank length times the sine of its forward lean.',
      stories: { M: 'At lift-off a {m} person\'s knees are {d} in front of the line of their weight. What moment must the knee muscles supply (both legs together)?' }
    }
  ],
  examples: [
    {
      title: 'A sofa against a care chair',
      q: 'A median woman has a popliteal height of 405 mm and wears 25 mm shoes. Her sofa is 400 mm high and its cushion sinks 40 mm; a care chair is 470 mm high and sinks 15 mm. Compare the seats with her lower leg.',
      steps: ['Lower leg with shoe: $405 + 25 = 430$ mm.', 'Sofa: $400 - 40 = 360$ mm, which is $360/430 = 84$ %.', 'Care chair: $470 - 15 = 455$ mm, which is $455/430 = 106$ %.', 'The sofa puts her hips well below her knees; the care chair puts them slightly above, with her feet still flat.'],
      a: 'About 84 % against 106 % of her lower leg: the care chair is far easier to rise from.'
    },
    {
      title: 'How hard do the arms push?',
      q: 'A 70 kg person leans as far as they can but their centre of mass is still 80 mm behind their feet. Their hands are on the armrests 250 mm behind the feet. What force must the arms give?',
      steps: ['Moments about the feet: $F d_h = m g d_c$.', '$F = 70 \\times 9.81 \\times 80 / 250 = 220$ N.', 'That is 32 % of body weight, shared between two arms — about 11 kg on each hand.'],
      a: 'About 220 N, a third of body weight.'
    }
  ],
  quiz: [
    { q: 'Why is rising from a low sofa harder than from a dining chair, even for a person who leans well forward?', choices: ['The hip starts bent past 90°, so the forward lean runs out before the body is over the feet', 'The sofa is wider', 'Soft cushions weigh more', 'The back is higher'], a: 0, why: 'With the knees above the hips, the hip is already flexed; the remaining bend is not enough to bring the centre of mass over the feet without momentum or arms.' },
    { q: 'What does an armrest do during rising?', choices: ['The arms carry part of the weight, so the centre of mass may stay behind the feet and the knees work less', 'It only gives a place to rest the arms while seated', 'It makes the seat higher', 'It stops the chair from sliding'], a: 0, why: 'Balance of moments: every newton pushed through the armrests reduces the load and the moment at the knees.' },
    { q: 'A 5th-percentile woman sits on a 600 mm deep sofa. What happens?', choices: ['Her back does not reach the backrest unless her feet leave the floor', 'She fits perfectly', 'Her knees rise above her head', 'She needs a higher backrest'], a: 0, why: 'Her buttock–popliteal length is about 440 mm; the seat is 160 mm deeper.' },
    { q: 'True or false: a chair for an older person should be as high as possible.', a: false, why: 'Above popliteal height plus shoe the feet lose the floor and the seat edge presses the thighs; about 100–115 % of lower-leg length is the target.' },
    { q: 'A catalogue gives a sofa\'s seat height as 440 mm. What is the height that matters for rising?', choices: ['The compressed height under the user — perhaps 380–400 mm', '440 mm', 'The height of the armrests', 'The height of the back'], a: 0, why: 'Cushions sink under the body; soft sofas lose 40–80 mm.' }
  ],
  problems: [
    { q: 'A 75 kg person must push through the armrests with their centre of mass 60 mm behind their feet and their hands 300 mm behind the feet. What force do the arms give?', answer: 147, unit: 'N', tol: 0.02, steps: ['$F = m g d_c / d_h = 75 \\times 9.81 \\times 60 / 300 = 147$ N.'] },
    { q: 'A man\'s popliteal height is 470 mm and he wears 25 mm shoes. What compressed seat height is 105 % of his lower leg?', answer: 520, unit: 'mm', tol: 0.01, steps: ['Lower leg with shoe: 495 mm.', '$1.05 \\times 495 = 520$ mm.'] }
  ],
  ranges: [
    { dim: 'Sofa and lounge seat height (compressed)', range: [380, 450], unit: 'mm', who: 'relaxing adults, legs stretched forward', why: 'Lets the legs rest forward and the body recline.', limits: 'Hard to rise from for older people and anyone with weak legs or stiff hips.', setting: 'civil', src: 'Pheasant and Haslegrave, Bodyspace (easy chairs)' },
    { dim: 'Seat height of chairs for older people (compressed)', range: [450, 500], unit: 'mm', who: 'about 100–115 % of lower-leg length for most adults', why: 'Hips level with or above the knees: rising needs less lean and less knee effort.', limits: 'Small users\' feet may not reach the floor; pair with a footstool or choose by the person.', setting: ['civil', 'health'] },
    { dim: 'Lounge seat depth', range: [480, 550], unit: 'mm', who: 'buttock–popliteal length: small users limit it (5th-percentile woman about 440 mm)', why: 'The back reaches the backrest while the calves are free of the seat edge.', limits: 'Deep sofas (600 mm and more) need back cushions for small people.', setting: ['civil', 'health'] },
    { dim: 'Armrest height above the compressed seat', range: [180, 250], unit: 'mm', who: 'seated elbow rest height (about 190–295 mm)', why: 'A resting place for the arms and a push point for rising.', limits: 'Armrests that stop short of the seat front cannot be pushed on while rising.', setting: ['civil', 'health'] },
    { dim: 'Seat width per person on a sofa', range: [550, 650], unit: 'mm', who: 'hip breadth and elbow room of large users', why: 'Neighbours do not touch; arms can move.', limits: 'Large users and people who shift position need the upper end.', setting: 'civil' },
    { dim: 'Back angle to the seat', range: '100–110°', who: 'resting posture of most adults', why: 'Opens the hip and unloads the spine without tipping the head back.', limits: 'More recline needs a head rest and makes rising harder.', setting: ['civil', 'health'] },
    { dim: 'Coffee table: height and gap to the sofa', range: '400–450 mm high, 400–450 mm clear', who: 'seated reach and knee room of adults', why: 'Cups are reached without a long lean; knees and feet have room.', limits: 'Low tables make older people stoop from a low seat.', setting: 'civil', src: 'Panero and Zelnik, Human Dimension and Interior Space' }
  ],
  applications: [
    'Choosing or adapting a chair for an older relative: measure the lower leg, compress the cushion, check the armrests reach the front.',
    'Care homes and hospital day rooms with a mix of seat heights, all with arms.',
    'Riser-recliner chairs and raising blocks as fall prevention.',
    'Waiting rooms and hotel lobbies that must suit every visitor.'
  ],
  sources: [
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, the chapter on seating (easy chairs and seats for older people).',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapters on living spaces.',
    'D. A. Winter, *Biomechanics and Motor Control of Human Movement* — the segment masses and centres of mass (after Dempster) used by the rising model.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, on seating.',
    'EN 1022 (domestic seating — stability) and EN 12520 (domestic seating — strength, durability and safety).'
  ],
  sim: { id: 'fs-rising', params: { preset: 'sofa' } }
},

{
  id: 'beds-bedrooms', parent: 'home-furniture', title: 'Beds and bedrooms', level: 1,
  short: 'A bed is a seat, a work surface and a place to lie: its height must suit the sleeper who sits on its edge and the carer who bends over it, its length the tallest sleeper, and the room around it a person walking, making the bed or transferring from a wheelchair.',
  keywords: ['bed height', 'mattress height', 'bed length', 'bed width', 'bed sizes', 'getting out of bed', 'care bed', 'hospital bed', 'bedroom size', 'access space', 'transfer', 'carer', 'bedside table'],
  prereq: ['design-for-range', 'sofas-lounge', 'standing-dimensions'],
  related: ['sitting-dimensions', 'patient-handling', 'accessible-design', 'storage-heights', 'children-furniture', 'posture-assessment', 'medicine:sleep', 'medicine:ageing'],
  body: `
People spend a third of their lives in bed, but the ergonomics of a bed is decided in the few minutes around it: sitting on its edge to dress, lying down and getting up, making it, and — for people who need care — being washed, turned and moved by someone standing beside it. Each task pulls the bed height a different way.

### Height: a seat for the sleeper, a bench for the carer
Sitting on the edge of the bed is sitting on a seat. With the mattress compressed under the body, its top should be close to **popliteal height plus footwear** — often bare feet or slippers at night. For the representative adults of this app that is about 360–490 mm barefoot (5th-percentile woman to 95th-percentile man); mattresses sink 20–60 mm, so the uncompressed top belongs at roughly **450–550 mm**. Lower beds (many modern platform beds are 300–400 mm) look calm and are hard to rise from; see [[sofas-lounge]] for why.

A carer making a bed, washing someone or helping them turn works on a surface about 100 mm above the mattress and up to half a bed-width away. At a 500 mm bed that means stooping: a trunk bent forward 45–70° for minutes at a time, many times a shift. ISO 11226 treats a trunk bent forward by more than 60° as not acceptable, and 20–60° as acceptable only for short holding times or with support. That is why **care and hospital beds are height-adjustable**: low (about 400 mm or less) for getting in and out safely and for people at risk of falling out, high (about 800 mm or more) for care. **In the sim**, choose a carer and raise the bed until the trunk bend falls below 20°.

### Length and width
- **Length:** a common rule is stature plus about 150–250 mm, for the pillow and the feet. Standard 2000 mm beds suit people up to about 1.80–1.85 m; the 95th-percentile man of this app (1870 mm) wants 2100 mm or more, and very tall users 2200 mm.
- **Width:** each sleeper takes about 700–900 mm to turn without waking a partner (a 95th-percentile man's shoulders are about 525 mm across). Single beds are 800–1000 mm; doubles 1350–1600 mm; kings 1500–2000 mm.

| Name | Europe (mm) | UK (mm) | US (mm, in) |
|---|---|---|---|
| Single / twin | 900 × 2000 | 900 × 1900 | 965 × 1905 (38 × 75) |
| Double / full | 1400 × 2000 | 1350 × 1900 | 1372 × 1905 (54 × 75) |
| Queen / king (UK) | 1600 × 2000 | 1500 × 2000 | 1524 × 2032 (60 × 80) |
| King / super king | 1800 × 2000 | 1800 × 2000 | 1930 × 2032 (76 × 80) |

Sizes vary between makers and countries: check the length against the tallest user, not the name.

### The room around the bed
| Activity | Clear space | Who limits it |
|---|---|---|
| Walking past, making the bed | 600–700 mm at the side and foot | hip and shoulder breadth of large users, bending to tuck sheets |
| Dressing beside the bed | about 900–1000 mm | arms and elbows moving, a person bending |
| Transfer from a wheelchair | about 760 × 1220 mm beside the bed, parallel to it | the chair's footprint (the 2010 ADA Standards ask for this in accessible hotel rooms) |
| Turning a wheelchair | a 1500 mm circle somewhere in the room | wheelchair users (see [[accessible-design]]) |
| Care with a mobile hoist | 1000–1500 mm on at least one side | hoist legs and the carer |

A double bed of 1600 × 2000 mm with 700 mm on both sides and at the foot needs a room of about 3.0 × 2.7 m; a room for a wheelchair user needs about 1.0 m more on one side and at the foot. Bedside tables at roughly mattress height (500–650 mm) keep a glass and a lamp within reach from lying and sitting; a light switch reachable from the bed prevents walks in the dark.

### Settings
- **Homes:** the sleeper decides — but older people benefit from a higher, firmer bed edge, a bed rail or grab handle, and a clear, lit path to the bathroom.
- **Hospitals and care homes (health):** height-adjustable medical beds (their safety is covered by IEC 60601-2-52), with brakes, side rails assessed person by person, and space for hoists.
- **Military, ships and field camps:** bunks and cots stacked in little space; the upper bunk needs headroom to sit up (about 800–900 mm above the mattress for a seated adult's sitting height) and a safe ladder.
- **Hotels:** the widest range of guests — length for tall visitors, and accessible rooms with transfer space.

> [!warn] Getting in and out of bed at night is a common moment for falls in older people: a bed at the right height, a firm edge, a grab handle, a light within reach and a clear route matter more than the mattress.

> [!key] Bed height is a compromise between the sleeper (popliteal height, about 450–550 mm with the mattress) and the carer (much higher): where care is needed, make it adjustable.
`,
  ideas: [
    'Sitting on the bed edge is sitting on a seat: the compressed mattress top should be near popliteal height plus footwear.',
    'A carer working at a low bed stoops; ISO 11226 treats a forward bend above 60° as not acceptable, so care beds are height-adjustable.',
    'Bed length should be stature plus about 150–250 mm; standard 2 m beds are short for tall people.',
    'Each sleeper needs about 700–900 mm of width.',
    'Plan the room around the tasks: 600–700 mm to make the bed, a transfer space and a turning circle for wheelchair users, more for hoists.'
  ],
  pitfalls: [
    'A low bed is safer — It is safer to fall out of, but harder and riskier to rise from; for most people a bed near popliteal height is safer overall, while low beds suit people at risk of rolling out.',
    'A 2 m bed is long enough for everyone — A 1.87 m man needs about 2.05–2.1 m.',
    'Carers can simply bend their knees — At a low bed the reach across the mattress forces the trunk forward anyway; raising the bed removes the bend at the source.'
  ],
  formulas: [
    {
      name: 'Bed length from stature',
      expr: 'L = S + a', tex: 'L = S + a',
      vars: {
        L: { name: 'mattress length', q: 'length', unit: 'mm' },
        S: { name: 'stature of the tallest sleeper', q: 'length', unit: 'mm', value: 1870 },
        a: { name: 'allowance for pillow and feet (150–250)', q: 'length', unit: 'mm', value: 200 }
      },
      stories: { L: 'The tallest sleeper is {S}. With {a} for the pillow and feet, how long must the mattress be?', S: 'How tall can a sleeper be on a {L} mattress with {a} to spare?' }
    },
    {
      name: 'Mattress height for sitting on the edge',
      expr: 'H = P + f + c', tex: 'H = P + f + c',
      vars: {
        H: { name: 'height of the uncompressed mattress top', q: 'length', unit: 'mm' },
        P: { name: 'popliteal height of the user', q: 'length', unit: 'mm', value: 405 },
        f: { name: 'footwear (0 barefoot, 25 shoes)', q: 'length', unit: 'mm', value: 0 },
        c: { name: 'how far the mattress sinks under a seated person', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'The same rule as a seat: feet flat, thighs level. Slightly higher makes rising easier.',
      stories: { H: 'A person with a popliteal height of {P} gets up barefoot ({f} of footwear); the mattress sinks {c}. How high should its top be?' }
    }
  ],
  examples: [
    {
      title: 'A bed for a tall man',
      q: 'Men\'s stature is 1755 ± 70 mm. How long should a bed be for the 95th-percentile man, with 200 mm for pillow and feet?',
      steps: ['95th percentile: $1755 + 1.645 \\times 70 = 1870$ mm.', 'Add 200 mm: $L = 2070$ mm.', 'A standard 2000 mm mattress is 70 mm short: choose a 2100 mm (or 2032 mm US) bed, or accept that his feet hang over.'],
      a: 'About 2070 mm: a 2.1 m bed.'
    },
    {
      title: 'The right height for getting up at night',
      q: 'A median woman (popliteal height 405 mm) gets up barefoot from a mattress that sinks 40 mm. How high should the mattress top be? What about a 95th-percentile man (491 mm)?',
      steps: ['Woman: $H = 405 + 0 + 40 = 445$ mm.', 'Man: $H = 491 + 0 + 40 = 531$ mm.', 'A shared bed at about 480–500 mm leaves her feet just touching and him slightly low — a compromise, which is why the range is 450–550 mm.'],
      a: 'About 445 mm for her, 530 mm for him.'
    }
  ],
  quiz: [
    { q: 'Why are hospital and care beds height-adjustable?', choices: ['Low suits the patient getting in and out; high suits the carer working without stooping', 'To fit different room heights', 'To make them easier to clean underneath only', 'Because patients are taller than others'], a: 0, why: 'The two users of a care bed need very different heights; one fixed height makes one of them work badly.' },
    { q: 'Which user limits the length of a bed?', choices: ['The tallest sleeper, plus about 150–250 mm', 'The average sleeper', 'The shortest sleeper', 'The width of the room'], a: 0, why: 'Length is a clearance for the body lying down.' },
    { q: 'About how much clear space is needed beside a bed to walk past it and make it?', choices: ['600–700 mm', '200–300 mm', '1500 mm', '2000 mm'], a: 0, why: 'Enough for the hips and shoulders and to bend and tuck the sheets; a wheelchair transfer or hoist needs more.' },
    { q: 'True or false: a very low platform bed (350 mm) is the best choice for an older person with weak legs.', a: false, why: 'It is below their lower-leg length, so rising needs more lean and knee effort; a bed near 100–110 % of the lower leg is easier. Very low beds are used for people at risk of rolling out.' }
  ],
  problems: [
    { q: 'A double bed (1600 × 2000 mm) stands with its head against a wall, with 700 mm clear on each side and 800 mm at the foot. What is the smallest room (width × length) in square metres?', answer: 8.4, unit: 'm²', tol: 0.01, steps: ['Width: $700 + 1600 + 700 = 3000$ mm.', 'Length: $2000 + 800 = 2800$ mm.', 'Area: $3.0 \\times 2.8 = 8.4$ m².'] }
  ],
  ranges: [
    { dim: 'Mattress top height (uncompressed), for sitting and rising', range: [450, 550], unit: 'mm', who: 'popliteal height of most adults, barefoot or in slippers, plus 20–60 mm of mattress sink', why: 'Feet flat when sitting on the edge; rising needs little lean.', limits: 'Small users sit with feet dangling at the top of the range; people at risk of rolling out may need a low bed instead.', setting: ['civil', 'health'] },
    { dim: 'Adjustment range of a care or hospital bed', range: [400, 800], unit: 'mm', who: 'the patient getting in and out (low end) and the carer\'s knuckle-to-elbow working band (high end)', why: 'Safe transfers low; care without stooping high.', limits: 'Many beds go lower and higher; the carer must actually use the adjustment.', setting: 'health', src: 'IEC 60601-2-52 (medical beds, safety); ISO 11226 for the trunk postures' },
    { dim: 'Bed length', range: [2000, 2200], unit: 'mm', who: 'stature of the tallest sleeper plus 150–250 mm', why: 'Head on the pillow, feet on the mattress.', limits: 'Standard 1900–2000 mm beds are short for about the tallest tenth of men.', setting: ['civil', 'health', 'military'] },
    { dim: 'Bed width per sleeper', range: [700, 900], unit: 'mm', who: 'shoulder breadth and turning room of large adults', why: 'Turning over without disturbing a partner.', limits: 'Single beds of 800 mm and less are tight for large adults.', setting: 'civil' },
    { dim: 'Clear space beside and at the foot of a bed', range: [600, 700], unit: 'mm', who: 'hips and shoulders of large users bending to make the bed', why: 'Walking past and making the bed.', limits: 'A wheelchair transfer needs a space about 760 × 1220 mm; hoists need 1000–1500 mm.', setting: ['civil', 'health'], src: 'Panero and Zelnik; 2010 ADA Standards (clear floor space beside beds in accessible rooms)' },
    { dim: 'Trunk forward bend while working at a bed', range: [null, 20], unit: '°', who: 'carers of all sizes, working often or for long', why: 'ISO 11226 treats up to 20° as acceptable; 20–60° only with support or short holding times; above 60° not acceptable.', limits: 'Reaching across a wide bed forces a bend at any height — work from the near side, or turn the patient towards you.', setting: 'health', src: 'ISO 11226 (evaluation of static working postures)' }
  ],
  applications: [
    'Choosing a bed for an older person: sit on the edge, feet flat, and try getting up without the arms.',
    'Care homes and hospitals: adjustable beds, transfer space and hoist space around every bed.',
    'Hotel accessible rooms with a transfer space beside the bed and a turning circle.',
    'Crew berths in ships, trains and field camps: length, sitting headroom and ladders.'
  ],
  sources: [
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapter on bedrooms.',
    'E. Neufert, *Architects\' Data*, the sections on bedrooms and bed sizes.',
    'ISO 11226, *Ergonomics — Evaluation of static working postures* (trunk inclination).',
    'IEC 60601-2-52, *Medical electrical equipment — Particular requirements for the basic safety and essential performance of medical beds*.',
    '2010 ADA Standards for Accessible Design: clear floor space and transient lodging rooms.'
  ],
  sim: 'fs-bed'
},

{
  id: 'kitchen-ergonomics', parent: 'home-furniture', title: 'Kitchens', level: 2,
  short: 'Worktops between 850 and 950 mm, wall cabinets 450–600 mm above them, ovens and dishwashers raised off the floor, and a work triangle of 4–8 m: a kitchen is a small workshop whose heights follow the elbow, the shoulder and the reach of the people who cook in it.',
  keywords: ['kitchen worktop height', 'counter height', '900 mm', '36 inch counter', 'elbow height', 'work triangle', 'wall cabinet height', 'reach', 'oven height', 'raised dishwasher', 'toe kick', 'plinth', 'kitchen aisle', 'sink height', 'hob'],
  prereq: ['standing-work-heights', 'standing-dimensions', 'functional-reach'],
  related: ['dining-tables-chairs', 'storage-heights', 'commercial-kitchens', 'accessible-design', 'workbench-design', 'lifting-principles', 'material-flow-layout'],
  body: `
Cooking is standing work with the hands, repeated every day for decades, by people from under 1.5 m to over 1.9 m tall. The kitchen industry grew up around one worktop height, yet ergonomics says the right height depends on the cook and on the task.

### Worktop height: the elbow decides
For light work with the hands — chopping, mixing, preparing — the work should be about **100–150 mm below the standing elbow**. For heavier work that needs body weight — kneading, rolling pastry — 150–400 mm below. Elbow height standing (with 25 mm of shoe) runs from about 965 mm for a 5th-percentile woman to 1205 mm for a 95th-percentile man, so ideal worktops for light work run from roughly **840 mm to 1080 mm**:

| Cook | Elbow height with shoes | Light work (100–150 below) | Heavy work (150–400 below) |
|---|---|---|---|
| 5th-percentile woman | 965 mm | 815–865 mm | 565–815 mm |
| Median woman | 1040 mm | 890–940 mm | 640–890 mm |
| Median man | 1125 mm | 975–1025 mm | 725–975 mm |
| 95th-percentile man | 1205 mm | 1055–1105 mm | 805–1055 mm |

Standard worktops sit at about **900 mm** in much of Europe and **36 in (914 mm)** in North America: right for the median woman — the users kitchens were long designed around — low for most men. The height of the *work* matters, not of the top: the bottom of a 180 mm deep sink is far lower than the worktop, and a tall pan on the hob lifts the hands 150–250 mm. Good kitchens therefore mix heights: **a slightly higher sink area or a shallower sink, a lower hob, and a preparation zone** at the main cook's height — or a plinth that can be set when the kitchen is fitted. **In the sim**, choose a cook and a task and read how far the hands work below the elbow.

### Reaching up: wall cabinets
Wall cabinets hang with their underside **450–600 mm above the worktop** (about 1350–1500 mm above the floor) — high enough to work and see under, low enough to reach into. But the worktop in front, typically 600 mm deep, pushes the shelves away from the body. With the arm as a rigid link of length $A$ from a shoulder at height $S_h$, the highest point reachable at horizontal distance $x$ is

$$h = S_h + \\sqrt{A^2 - x^2}$$

(the [[?square-root|square root]] shrinks fast as $x$ nears $A$). For a median woman ($S_h$ = 1330 mm, $A$ ≈ 580 mm) reaching 420 mm forward from the shoulder to the front of a wall cabinet, $h$ = 1730 mm; for a 5th-percentile woman about 1570 mm. **Shelves above about 1600–1700 mm over a worktop are out of reach for many cooks** without a step: keep them for light, rarely used things.

### Low down: ovens, dishwashers and drawers
Lifting a hot, heavy dish from an oven at knee height means stooping with a load held away from the body — the posture the [[niosh-lifting-equation|NIOSH lifting equation]] penalises most. A **wall oven with its shelves between knuckle and elbow height (about 750–1100 mm)**, a **dishwasher raised by 300–450 mm**, and **drawers instead of low cupboards** remove most kitchen stooping. Microwaves and wall ovens should not be above the shoulder height of the smallest cook (about 1250 mm): hot liquids must never be lifted down from above the face.

### Layout: the work triangle and aisles
The classic **work triangle** joins the sink, the hob and the fridge. Kitchen planning guidelines in the US (the National Kitchen & Bath Association) ask that each leg be about **1.2–2.7 m (4–9 ft)** and the three together no more than **about 7.9 m (26 ft)**, with no through traffic crossing the triangle. Too small and cooks collide with their own doors; too large and a meal takes hundreds of extra steps. Work aisles need about **1000–1100 mm for one cook and 1200 mm or more for two**; a wheelchair user needs about 1500 mm to turn. Keep a **landing space** of worktop beside the hob, the sink and the fridge to put things down.

### Settings
- **Homes:** fit the main cook; adjust with plinth height, mixed-height zones or a height-adjustable section for households of very different sizes, children or a wheelchair user (a worktop at about 700–850 mm with knee space).
- **Commercial kitchens:** long hours, heavy pans, heat — the same heights with more attention to lifting (see [[commercial-kitchens]]).
- **Care homes and schools:** training kitchens with adjustable worktops.
- **Ships' galleys and field kitchens (military, field):** fixed equipment for a crew of mixed sizes; platforms and raised equipment instead of stooping, and rails to hold on to in a seaway.

> [!warn] Hot pans and oven dishes lifted from low ovens or down from high shelves are a source of burns and back strain. Keep hot and heavy things between knuckle and shoulder height.

> [!key] Set the worktop from the elbow (100–150 mm below it for light work), keep heavy and hot things between knuckle and shoulder, and keep the triangle compact but uncrossed.
`,
  ideas: [
    'Worktop height follows the standing elbow: about 100–150 mm below it for light work, more for heavy work.',
    'Standard 900–914 mm worktops suit the median woman; small cooks want about 850 mm, tall cooks 1000 mm or more.',
    'The worktop pushes wall cabinets out of reach: h = S_h + √(A² − x²) shows the reach height falling with distance.',
    'Raised ovens and dishwashers and drawers instead of low cupboards remove most kitchen stooping.',
    'The work triangle: legs of about 1.2–2.7 m, a total under about 7.9 m, and no traffic through it.'
  ],
  pitfalls: [
    'The worktop height is the working height — The sink bottom, the chopping board and the pan rim are where the hands are: a deep sink lowers the work by 150–200 mm, a tall pan raises it.',
    'Wall cabinets are within reach because the top shelf is below head height — Over a 600 mm worktop the reach height falls by 150–250 mm; many cooks cannot reach the top shelf.',
    'A bigger kitchen is always more ergonomic — Beyond a total triangle of about 8 m the extra walking outweighs the space.'
  ],
  formulas: [
    {
      name: 'Worktop height from elbow height',
      expr: 'H = E + s - d', tex: 'H = E + s - d',
      vars: {
        H: { name: 'worktop (working) height', q: 'length', unit: 'mm' },
        E: { name: 'elbow height standing, barefoot', q: 'length', unit: 'mm', value: 1015 },
        s: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25 },
        d: { name: 'drop below the elbow (100–150 light, 150–400 heavy)', q: 'length', unit: 'mm', value: 125 }
      },
      note: 'For a sink add the depth from the top to where the hands work; for a hob subtract the height of the pans.',
      stories: { H: 'A cook\'s elbow is {E} above the floor barefoot; shoes add {s}. For light work {d} below the elbow, how high should the worktop be?', E: 'A worktop is {H}. For light work {d} below the elbow, with {s} of shoe, whose elbow height does it suit?' }
    },
    {
      name: 'Highest point reachable at a horizontal distance',
      expr: 'h = Sh + sqrt(A^2 - x^2)', tex: 'h = S_h + \\sqrt{A^2 - x^2}',
      vars: {
        h: { name: 'highest point the fingers can grip', q: 'length', unit: 'mm' },
        Sh: { name: 'shoulder height', q: 'length', unit: 'mm', value: 1330, tex: 'S_h' },
        A: { name: 'grip reach from the shoulder (vertical grip reach − shoulder height)', q: 'length', unit: 'mm', value: 580 },
        x: { name: 'horizontal distance from the shoulder', q: 'length', unit: 'mm', value: 420, max: 579 }
      },
      note: 'A rigid arm pivoting at the shoulder, body upright and flat-footed. Leaning in or rising on the toes adds perhaps 50–100 mm; shoes add about 25 mm.',
      stories: { h: 'A cook\'s shoulder is {Sh} high and her grip reach from the shoulder is {A}. How high can she reach {x} in front of her shoulder?', x: 'A cook with shoulder height {Sh} and reach {A} must grip a shelf {h} high. How far forward of the shoulder can it be?' }
    }
  ],
  examples: [
    {
      title: 'One worktop, four cooks',
      q: 'Elbow heights standing are 1015 ± 46 mm for women and 1100 ± 50 mm for men. For light work 125 mm below the elbow, with 25 mm shoes, what worktop suits the 5th-percentile woman, the median woman and the 95th-percentile man?',
      steps: ['5th-percentile woman: $1015 - 1.645 \\times 46 = 939$ mm; $H = 939 + 25 - 125 = 839$ mm.', 'Median woman: $H = 1015 + 25 - 125 = 915$ mm.', '95th-percentile man: $1100 + 1.645 \\times 50 = 1182$ mm; $H = 1182 + 25 - 125 = 1082$ mm.', 'A 900 mm worktop suits the median woman; it is 60 mm high for the smallest cook and 180 mm low for the tallest.'],
      a: 'About 840, 915 and 1080 mm — a spread of 240 mm that one fixed height cannot cover.'
    },
    {
      title: 'Can she reach the top shelf?',
      q: 'A 5th-percentile woman has a shoulder height of 1235 mm and a vertical grip reach of 1770 mm. She stands at a 600 mm worktop; her shoulder is 120 mm behind her body front and the wall cabinet front is 300 mm from the wall. How high can she reach at the cabinet front?',
      steps: ['Reach from the shoulder: $A = 1770 - 1235 = 535$ mm.', 'Horizontal distance to the cabinet front: $600 - 300 + 120 = 420$ mm.', '$h = 1235 + \\sqrt{535^2 - 420^2} = 1235 + 331 = 1566$ mm; with shoes about 1590 mm.'],
      a: 'About 1.57–1.6 m: a top shelf at 1.9 m is out of her reach.'
    }
  ],
  quiz: [
    { q: 'A 1.90 m tall man cooks at a 900 mm worktop. What is the problem?', choices: ['He stoops: his hands work about 250 mm below his elbow for light work', 'He must raise his shoulders', 'None, 900 mm is standard', 'His knees hit the cupboards'], a: 0, why: 'His elbow with shoes is near 1200 mm; light work belongs about 1050–1100 mm.' },
    { q: 'Why should a sink area often be higher than the rest of the worktop?', choices: ['The hands work at the bottom of the basin, 150–200 mm below the top', 'Water runs better downhill', 'To hide the pipes', 'Sinks are always lower'], a: 0, why: 'The working level is inside the basin; raising the top (or a shallower basin) brings it back towards elbow minus 100–150 mm.' },
    { q: 'Which layout rule belongs to the work triangle?', choices: ['Legs of about 1.2–2.7 m and a total under about 7.9 m, with no traffic through it', 'All three centres side by side', 'The fridge next to the oven', 'Legs longer than 3 m for comfort'], a: 0, why: 'Compact enough to save steps, spacious enough to work, and not a corridor.' },
    { q: 'Where should a heavy, hot oven dish be lifted from?', choices: ['Between knuckle and elbow height, about 750–1100 mm', 'Near the floor', 'Above the head', 'It does not matter'], a: 0, why: 'Low lifts force stooping with a load held away from the body; high lifts bring hot things near the face.' },
    { q: 'True or false: raising a dishwasher by 300–450 mm is an ergonomic improvement.', a: true, why: 'It moves the lower basket from near the floor towards knee and knuckle height, removing a daily deep stoop.' }
  ],
  problems: [
    { q: 'A median man\'s shoulder is 1440 mm high and his grip reach from the shoulder is 620 mm. How high can he reach 420 mm in front of his shoulder?', answer: 1896, unit: 'mm', tol: 0.01, steps: ['$h = 1440 + \\sqrt{620^2 - 420^2} = 1440 + \\sqrt{208000} = 1440 + 456 = 1896$ mm.'] },
    { q: 'A kitchen has the sink–hob leg 1.4 m, hob–fridge 2.3 m and fridge–sink 2.0 m. What is the total of the triangle, in metres?', answer: 5.7, unit: 'm', tol: 0.01, steps: ['$1.4 + 2.3 + 2.0 = 5.7$ m — within about 4–7.9 m, and each leg within 1.2–2.7 m.'] }
  ],
  ranges: [
    { dim: 'Kitchen worktop height', range: [850, 950], unit: 'mm', who: 'light work 100–150 mm below the standing elbow of most women and shorter men', why: 'Chopping and preparing without shrugging or stooping.', limits: 'Tall cooks (median man and up) want 950–1050 mm; the smallest 850 mm or less. Mix heights or set the plinth for the main cook.', setting: 'civil', src: 'Elbow heights of this app\'s representative adult body data (Tools → Body sizes); common European and US kitchen practice' },
    { dim: 'Working level below the standing elbow, light work', range: [100, 150], unit: 'mm', who: 'every cook, measured from their own elbow with shoes', why: 'Forearms slightly below horizontal, shoulders relaxed.', limits: 'Heavy work (kneading) wants 150–400 mm; fine decorating work wants the elbow or higher.', setting: ['civil', 'workshop'], src: 'Pheasant and Haslegrave, Bodyspace (standing work heights)' },
    { dim: 'Wall cabinet underside above the worktop', range: [450, 600], unit: 'mm', who: 'headroom over the worktop and reach of small users', why: 'Room for appliances and to see the work; the lower shelf stays reachable.', limits: 'Top shelves over a 600 mm worktop are out of reach above about 1600–1700 mm for many cooks.', setting: 'civil' },
    { dim: 'Highest shelf over a 600 mm worktop for regular use', range: [null, 1600], unit: 'mm', who: '5th-percentile woman reaching about 420 mm forward from her shoulder', why: 'Reachable flat-footed without a step or a stretch.', limits: 'Rarely used, light items only above it; provide a stable step.', setting: 'civil' },
    { dim: 'Oven shelves and raised appliances', range: [750, 1100], unit: 'mm', who: 'between knuckle and elbow height of most adults', why: 'Hot, heavy dishes lifted without stooping or reaching up.', limits: 'Wheelchair users need a side-opening door and a pull-out shelf below.', setting: ['civil', 'workshop'] },
    { dim: 'Work triangle: each leg / total', range: '1.2–2.7 m each, 4.0–7.9 m in total', who: 'one cook walking between sink, hob and fridge', why: 'Few steps, no collisions, room to work.', limits: 'Several cooks and island kitchens work better in zones than one triangle.', setting: 'civil', src: 'National Kitchen & Bath Association (US) planning guidelines' },
    { dim: 'Work aisle between opposite runs', range: [1000, 1200], unit: 'mm', who: 'one cook bending at an open oven or dishwasher (lower end), two cooks passing (upper end)', why: 'Doors open and people pass without collisions.', limits: 'Wheelchair users need about 1500 mm to turn; more than about 1400 mm adds steps.', setting: ['civil', 'health'] },
    { dim: 'Toe recess under base units (height × depth)', range: '100–150 mm × 50–75 mm', who: 'shoe length and toe height', why: 'The cook stands close to the worktop without leaning.', limits: 'Without it the body is pushed about 75 mm back and the reach grows.', setting: 'civil' }
  ],
  applications: [
    'Setting the plinth and worktop height for the main cook when a kitchen is fitted.',
    'Mixed-height kitchens: higher sink, lower hob, a baking table at kneading height.',
    'Kitchens for wheelchair users: a lowered section with knee space, side-opening ovens, pull-down shelves.',
    'Ship galleys, field kitchens and canteens for crews of mixed sizes.'
  ],
  history: 'Margarete Schütte-Lihotzky\'s Frankfurt Kitchen (1926) applied time-and-motion thinking to the home: a compact galley laid out for the sequence of work. Lillian Gilbreth studied the steps of kitchen work in the 1920s, and planners in the United States later distilled the idea into the work triangle.',
  sources: [
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on standing work heights and kitchens.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapter on kitchens.',
    'National Kitchen & Bath Association (US), *Kitchen Planning Guidelines* (work triangle, aisles, landing areas).',
    'EN 1116, *Kitchen furniture — Coordinating sizes for kitchen furniture and kitchen appliances*.',
    'E. Neufert, *Architects\' Data*, the sections on kitchens.'
  ],
  sim: 'fs-kitchen'
},

{
  id: 'bathroom-ergonomics', parent: 'home-furniture', title: 'Bathrooms', level: 2,
  short: 'The smallest room holds the most risky transfers of the day — on and off a WC, into a shower or bath, bending over a basin, all on a wet floor. WC and basin heights, grab bars, level showers and the free floor space a wheelchair needs, with the rules that differ by country.',
  keywords: ['WC height', 'toilet seat height', 'comfort height toilet', 'basin height', 'washbasin', 'grab bar', 'grab rail', 'level access shower', 'wet room', 'shower seat', 'bath', 'accessible toilet', 'turning circle', 'slip resistance', 'scalding', 'mirror height'],
  prereq: ['sofas-lounge', 'standing-dimensions', 'disability-inclusive'],
  related: ['accessible-design', 'doors-corridors', 'beds-bedrooms', 'children-furniture', 'patient-handling', 'strength-and-force', 'medicine:ageing', 'medicine:burns'],
  body: `
Bathrooms are small, hard and wet, and in them people undress, sit down low, stand up, step over things and bend — often half awake or unwell. Bathrooms are among the places at home where older people fall most often. Ergonomics here is about three things: **heights that make the transfers easy, something firm to hold, and enough free floor**.

### The WC: low for the bowels, high for the knees
A standard WC pan puts the seat top at about **400–430 mm**. For rising, that is low: below the lower-leg length of most adults (see [[sofas-lounge]] — the same mechanics). "Comfort height" pans and accessible WCs put the seat at about **430–480 mm**: the 2010 ADA Standards ask for 430–485 mm (17–19 in) to the top of the seat, and England's Approved Document M uses 480 mm in wheelchair-accessible toilets, close to a wheelchair's seat height for a sideways transfer. The trade-off: for emptying the bowels a lower seat, or a footstool that raises the knees, is often more comfortable. A household can use a standard pan with a removable raised seat or a footstool, rather than one height for all. **In the second sim**, set the seat to WC height and compare rising with and without grab rails.

### Something to hold
A **grab bar** turns the arms into a third leg. In the ADA layout, horizontal bars run beside and behind the WC at **840–915 mm (33–36 in)** above the floor, at least 1065 mm (42 in) long on the side wall, 32–51 mm in diameter, 38 mm clear of the wall, and able to take about 1100 N (250 lbf). European layouts often use **hinged drop-down rails on both sides** of the WC, so a wheelchair user can transfer from either side. Towel rails, soap dishes and basin edges are not grab bars — people will use them anyway, so fix them strongly or not at all.

### The basin: too low for most standing adults
Basin rims have long been set at about 800–850 mm. Washing hands happens inside the basin, well below the rim; with the hands 200–300 mm below the elbow, most standing adults are served better by a rim near **850–950 mm**, and stooping over a low basin is a common source of back discomfort. Seated users and wheelchair users need the opposite: a rim at most about **865 mm (34 in in the ADA Standards) with knee space at least 685 mm high** beneath, a lever tap within reach, and a mirror whose lower edge is low enough to see (the ADA limit over basins is 1015 mm, 40 in). Children need a stable step. Where a household cannot agree, a height-adjustable basin, two basins at different heights, or 850 mm with a step is the compromise.

### Showers and baths
- **Level-access showers** (wet rooms) with the floor sloping gently to a drain remove the step that trips people and blocks wheelchairs and shower chairs.
- A **fold-down seat at 430–485 mm**, a **hand shower on a slide rail** and controls reachable both seated and standing (roughly 900–1200 mm) let people wash sitting down.
- Shower spaces: about 900 × 900 mm for a transfer shower (the ADA's 36 × 36 in) and at least 760 × 1525 mm (30 × 60 in) for a roll-in shower.
- **Baths** demand the hardest transfer of all — stepping over a rim about 500 mm high onto a slippery surface. A bath board or seat, a vertical grab bar at the entry and a non-slip base help; for many older people a level shower replaces the bath.

### Floor, water and doors
Wet floors need slip resistance tested for bare feet (Germany classifies barefoot floors by the angle of an inclined test platform, DIN 51097). Hot water scalds children and older people in seconds: England's Building Regulations (Approved Document G) require new baths to be fitted with a device limiting the hot water delivered to 48 °C, and health-care buildings use lower settings. **Doors should open outwards or slide**, and locks be openable from outside, so a person who collapses against the door can be reached.

### Free floor space
| Need | Space | Source of the number |
|---|---|---|
| Standing, bending and drying in front of a fixture | about 600–750 mm deep | design guides (Neufert; Panero and Zelnik) |
| Clear space around an accessible WC | 1525 mm wide × 1420 mm deep (60 × 56 in) | 2010 ADA Standards |
| Turning a wheelchair | a 1500 mm circle (1525 mm in the ADA) | ISO 21542, national rules |

**In the sim** of the bathroom plan, move the WC, basin and shower and the 1500 mm circle, and see which layouts let a wheelchair turn and a door swing.

> [!warn] Most bathroom falls happen at transfers — standing up from the WC, stepping out of a bath or shower — often at night. Grab bars fixed into solid backing, a non-slip floor, a night light and a door that opens outwards are cheap and effective.

> [!key] Raise what people sit on (WC 430–480 mm), raise what standing people wash at (basin 850–950 mm) unless seated users need it lower, give every transfer a grab bar, and keep a 1500 mm circle of floor clear where a wheelchair must turn.
`,
  ideas: [
    'A standard WC seat (400–430 mm) is low for rising; accessible and comfort-height seats are about 430–485 mm.',
    'Grab bars turn the arms into a third leg: 840–915 mm high beside and behind the WC in the ADA layout, strong enough for about 1100 N.',
    'Most standing adults would be better served by a basin rim near 850–950 mm; seated users need at most about 865 mm with knee space.',
    'Level-access showers with a seat and a hand shower suit everyone from children to wheelchair users.',
    'Doors that open outwards, water limited against scalding, and a non-slip floor are the invisible safety features.'
  ],
  pitfalls: [
    'A higher WC is always better — For rising yes, but for emptying the bowels a lower seat or a footstool is more comfortable; removable raised seats and footstools serve both.',
    'Towel rails and basin edges will do as supports — People will pull on them; only grab bars fixed into solid backing and rated for about 1100 N are safe to rely on.',
    'The standard basin height suits adults — Rims at 800 mm make most standing adults stoop; they suit children and seated users better.'
  ],
  formulas: [
    {
      name: 'Basin rim height for a standing user',
      expr: 'H = E + s - d + b', tex: 'H = E + s - d + b',
      vars: {
        H: { name: 'height of the basin rim', q: 'length', unit: 'mm' },
        E: { name: 'elbow height standing, barefoot', q: 'length', unit: 'mm', value: 1015 },
        s: { name: 'footwear', q: 'length', unit: 'mm', value: 25 },
        d: { name: 'how far below the elbow the hands work (200–300)', q: 'length', unit: 'mm', value: 250 },
        b: { name: 'depth from the rim down to the hands', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The hands wash inside the basin, below its rim. Washing the face needs a bend at any height.',
      stories: { H: 'A user\'s elbow is {E} high barefoot, footwear adds {s}; the hands work {d} below the elbow and {b} below the rim. How high should the rim be?' }
    }
  ],
  examples: [
    {
      title: 'A basin for two users',
      q: 'Elbow heights standing are 1015 mm for the median woman and 1100 mm for the median man. With 25 mm of footwear, hands 250 mm below the elbow and 100 mm below the rim, what rim heights suit them? How does an 800 mm basin compare?',
      steps: ['Woman: $H = 1015 + 25 - 250 + 100 = 890$ mm.', 'Man: $H = 1100 + 25 - 250 + 100 = 975$ mm.', 'At 800 mm their hands work 340 mm and 425 mm below the elbow: both stoop.'],
      a: 'About 890 and 975 mm; 800 mm is low for both.'
    },
    {
      title: 'Will a wheelchair turn?',
      q: 'A bathroom is 2400 mm wide. A WC projects 700 mm from one wall and a wall-hung basin 450 mm from the opposite wall. Is there room for a 1500 mm turning circle between them? What if knee space under the basin may be used?',
      steps: ['Free width between the fixtures: $2400 - 700 - 450 = 1250$ mm — less than 1500.', 'With usable knee space under the basin (the ADA Standards allow the turning space to include knee and toe space), the free width is $2400 - 700 = 1700$ mm.'],
      a: 'Not between solid fixtures (1250 mm), but yes if the basin has knee space beneath (1700 mm).'
    }
  ],
  quiz: [
    { q: 'Why do accessible WCs have seats at about 430–485 mm rather than 400 mm?', choices: ['Rising is easier, and the seat is near a wheelchair seat for a sideways transfer', 'To use less water', 'Because children use them', 'To make cleaning easier'], a: 0, why: 'A seat nearer the lower-leg length needs less lean and knee effort, and matching the wheelchair seat makes a level transfer.' },
    { q: 'Where do horizontal grab bars go beside a WC in the ADA layout?', choices: ['840–915 mm above the floor', '400–500 mm above the floor', '1200–1400 mm above the floor', 'Anywhere the tiles allow'], a: 0, why: '33–36 in: about hip to low-chest height of a seated person rising, where a push down is strongest.' },
    { q: 'Why should a bathroom door open outwards?', choices: ['A person who collapses against it would block an inward-opening door', 'It saves heat', 'It is easier to lock', 'It keeps steam in'], a: 0, why: 'Rescue must be possible; an outward-opening or sliding door, with a lock openable from outside, allows it.' },
    { q: 'True or false: a level-access shower helps only wheelchair users.', a: false, why: 'It removes a trip for everyone, lets older people use a shower seat or chair, and makes cleaning easier — inclusive design at its best.' }
  ],
  problems: [
    { q: 'A 95th-percentile man has a standing elbow height of 1182 mm. With 25 mm footwear, hands 250 mm below the elbow and 100 mm below the rim, how high should a basin rim be for him?', answer: 1057, unit: 'mm', tol: 0.01, steps: ['$H = 1182 + 25 - 250 + 100 = 1057$ mm.'] }
  ],
  ranges: [
    { dim: 'WC seat height (top of the seat), standard', range: [400, 430], unit: 'mm', who: 'a compromise between rising and a comfortable posture for the bowels', why: 'Feet flat and knees raised for most adults.', limits: 'Low for rising, especially for older people and anyone with weak knees or stiff hips.', setting: 'civil' },
    { dim: 'WC seat height, accessible or comfort height', range: [430, 485], unit: 'mm', who: 'people who find rising hard; wheelchair users transferring sideways', why: 'Close to lower-leg length and to a wheelchair seat.', limits: 'Short users\' feet may dangle — offer a footstool.', setting: ['civil', 'health'], src: '2010 ADA Standards (17–19 in); Approved Document M (480 mm in accessible WCs)' },
    { dim: 'Horizontal grab bar height beside and behind a WC', range: [840, 915], unit: 'mm', who: 'seated people pushing up to stand', why: 'A firm push point at the height where the arms are strongest when rising.', limits: 'Must be fixed into solid backing and take about 1100 N; European layouts often add hinged rails on both sides.', setting: ['civil', 'health'], src: '2010 ADA Standards (33–36 in, 250 lbf)' },
    { dim: 'Basin rim height for standing adults', range: [850, 950], unit: 'mm', who: 'standing elbow heights of most adults, hands working inside the basin', why: 'Hands wash without stooping.', limits: 'Too high for children and seated users; a step or a second, lower basin serves them.', setting: 'civil' },
    { dim: 'Accessible basin: rim height and knee space below', range: 'rim ≤ 865 mm; knee space ≥ 685 mm high', who: 'wheelchair users and seated users', why: 'The knees go under, so the hands reach the tap and water.', limits: 'Low for standing adults; needs insulated or recessed pipes.', setting: ['civil', 'health'], src: '2010 ADA Standards (34 in rim, 27 in knee clearance)' },
    { dim: 'Shower seat height', range: [430, 485], unit: 'mm', who: 'people who shower seated, and transfers from a wheelchair', why: 'Same as a seat to rise from; matches wheelchair seats.', limits: 'Needs a hand shower and controls reachable from it.', setting: ['civil', 'health'], src: '2010 ADA Standards (17–19 in)' },
    { dim: 'Clear floor space in front of a fixture', range: [600, 750], unit: 'mm', who: 'standing, bending and drying adults', why: 'Room to bend over the basin and to stand from the WC.', limits: 'Wheelchair users need a 1500 mm turning circle and transfer space beside the WC.', setting: 'civil', src: 'Neufert; Panero and Zelnik; BS 6465-2 (space for sanitary installations)' },
    { dim: 'Hot water delivered to a bath', range: [null, 48], unit: '°C', who: 'children and older people, whose skin scalds quickly and who react slowly', why: 'Limits scalding.', limits: 'England\'s rule for new baths; health-care settings use lower limits; other countries differ.', setting: ['civil', 'health'], src: 'Approved Document G (England)' }
  ],
  applications: [
    'Adapting a bathroom for an older person: raised seat or comfort-height WC, grab bars, level shower with seat, outward-opening door.',
    'Accessible toilets in public buildings laid out to the national rule (ADA, Approved Document M, DIN 18040, ISO 21542).',
    'Family bathrooms with a basin at adult height and a step for children.',
    'Hospital and care-home en-suites with space for a carer and a shower chair.'
  ],
  sources: [
    '2010 ADA Standards for Accessible Design (US Department of Justice): water closets, grab bars, lavatories, showers, clear floor space.',
    'Approved Document M, *Access to and use of buildings* (England) and BS 8300-2 (inclusive design of buildings).',
    'Approved Document G, *Sanitation, hot water safety and water efficiency* (England).',
    'BS 6465-2, *Sanitary installations — Code of practice for space requirements*.',
    'ISO 21542, *Building construction — Accessibility and usability of the built environment*.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapter on bathrooms.'
  ],
  sim: ['fs-bathroom', { id: 'fs-rising', params: { preset: 'wc' } }]
},

{
  id: 'children-furniture', parent: 'home-furniture', title: 'Furniture for children', level: 2,
  short: 'Children grow about 60 mm a year and change shape as they grow, so furniture for them must come in sizes, adjust, or be adapted with cushions and footrests. How seat and table heights follow stature, how sizes are chosen, and the safety rules for cots, bunk beds, high chairs and furniture that tips.',
  keywords: ['children furniture', 'child chair height', 'child desk height', 'growing chair', 'size marks', 'EN 1729', 'stature', 'growth', 'booster seat', 'footrest', 'cot', 'crib', 'bunk bed', 'high chair', 'tip-over', 'anchoring furniture'],
  prereq: ['age-children-elderly', 'dining-tables-chairs', 'percentiles'],
  related: ['school-furniture', 'desk-height', 'beds-bedrooms', 'bathroom-ergonomics', 'storage-heights', 'medicine:child-growth'],
  body: `
A child at the family table sits with feet dangling half-way to the floor and the plate at chest height. Adult furniture fits children badly because children are not only smaller but **shaped differently** — and because they keep changing.

### How children grow
Rounded medians of the WHO growth standards and references give a stature of about **870 mm at 2 years, 1100 mm at 5, 1380 mm at 10**, and adult stature by 16–18 years (about 1630 mm for girls and 1760 mm for boys). Between 5 and 11 years children grow roughly 55–60 mm a year; the pubertal spurt comes around 10–12 for girls and 12–14 for boys. At any age the spread is wide: 5th and 95th percentiles lie about ±7 % from the median ([[?standard-deviation|standard deviation]] about 4–5 % of stature).

Children are also **proportioned differently**. A 2-year-old's sitting height is close to 58–60 % of stature; by the pubertal years it is about 52 %, as the legs grow fastest. A small child therefore has a long trunk and short legs: furniture cannot simply be an adult's scaled down.

### Seat and table from stature
Because every body dimension grows with stature, furniture for children is sized by **stature**. From the proportions of children's bodies:

- **Seat height ≈ 0.25–0.27 × stature** (popliteal height plus shoe);
- **Table or desk height ≈ 0.40–0.42 × stature** (seat plus elbow height sitting).

A 7-year-old of 1220 mm wants a seat near 310–330 mm and a table near 490–510 mm; at the family table (750 mm) the same child needs the seat raised by about 120 mm (a booster) *and* a footrest of about 250 mm, or a "growing" chair with an adjustable seat and footplate. Without the footrest a booster only moves the dangling feet higher. **In the sim**, press *Grow* and watch the child outgrow a chair, then fit an adjustable chair year by year.

School furniture is sold in **size marks**: EN 1729-1 defines eight (0 to 7), each for a band of statures and marked with a colour, so a teacher can match a child to a chair and table by height (see [[school-furniture]]). A fixed size serves a child for only two or three years of growth; adjustable desks and chairs follow them longer.

### Safety comes first
Children climb, lean, poke and chew, and many furniture injuries come from tipping, falling and entrapment rather than from posture:

| Item | The hazard | What the rules and good practice say |
|---|---|---|
| Cot (crib) | head or limbs trapped between bars; climbing out | bar gaps of 45–65 mm in Europe (EN 716); no more than 60 mm (2⅜ in) in the US; no drop sides (banned in the US since 2011) |
| Bunk bed | falls from the top | upper bunks for children of 6 and over; guard rails all round the top bunk; a firm ladder (EN 747 in Europe) |
| High chair | falls, tipping | a harness with crotch strap; wide, stable base (EN 14988) |
| Chests of drawers, televisions, shelves | tipping onto a climbing child | anchor to the wall; in the US clothing storage units must meet a mandatory stability standard (the STURDY Act, 2022) |
| Changing table | falls | raised edges; never leave the baby — and a height for the parent, surface about 800–900 mm |

### Settings
- **Homes:** adjustable chairs and desks, footrests at adult tables, step stools at basins, anchored storage, and a desk that is raised year by year.
- **Schools and nurseries:** sized furniture chosen by stature, several sizes in each class (see [[school-furniture]]).
- **Public spaces:** high chairs and booster seats in restaurants, low basins and baby-changing units in public toilets, low counters in libraries.
- **Health:** paediatric wards and waiting rooms with child-height seats beside adult ones.

> [!warn] Anchor tall furniture and televisions to the wall, keep cots free of gaps that trap heads and limbs, and keep children under 6 off the top bunk. These rules exist because children have died without them.

> [!key] Size children's furniture from stature — seat about a quarter of it, table about 0.4 of it — and plan for growth: sizes, adjustment, or a booster with a footrest.
`,
  ideas: [
    'Children grow about 55–60 mm a year in mid-childhood, and their proportions change: young children have long trunks and short legs.',
    'Seat height is about 0.25–0.27 of stature and table height about 0.40–0.42.',
    'A booster seat at an adult table needs a footrest too, or the feet simply dangle higher.',
    'School furniture comes in size marks chosen by stature; a fixed size lasts two or three years.',
    'Safety first: cot bar gaps, bunk-bed ages and guard rails, harnesses, and anchoring furniture that could tip.'
  ],
  pitfalls: [
    'Children\'s furniture is adult furniture scaled down — Children have relatively long trunks and short legs, so a scaled adult chair is too high for their legs and its table too low for their trunk.',
    'A booster cushion fixes the family table — It raises the child to the plate but leaves the feet hanging higher; a footrest or a chair with a footplate is needed as well.',
    'Buy a chair for the child\'s age — Children of the same age differ by 150 mm or more in stature; choose by stature.'
  ],
  formulas: [
    {
      name: 'Seat height for a child',
      expr: 'Hs = ks*S', tex: 'H_s = k_s S',
      vars: {
        Hs: { name: 'seat height', q: 'length', unit: 'mm', tex: 'H_s' },
        ks: { name: 'seat factor (0.25–0.27)', value: 0.26, tex: 'k_s' },
        S: { name: 'stature of the child', q: 'length', unit: 'mm', value: 1220 }
      },
      note: 'Popliteal height plus shoe as a share of stature; slightly lower for toddlers, whose legs are relatively short.',
      stories: { Hs: 'A child is {S} tall. With a seat factor of {ks}, how high should the seat be?', S: 'A chair seat is {Hs} high. For a factor of {ks}, what stature does it fit best?' }
    },
    {
      name: 'Table height for a child',
      expr: 'Ht = kt*S', tex: 'H_t = k_t S',
      vars: {
        Ht: { name: 'table or desk height', q: 'length', unit: 'mm', tex: 'H_t' },
        kt: { name: 'table factor (0.40–0.42)', value: 0.41, tex: 'k_t' },
        S: { name: 'stature of the child', q: 'length', unit: 'mm', value: 1220 }
      },
      stories: { Ht: 'A child is {S} tall. With a table factor of {kt}, how high should the table be?' }
    }
  ],
  examples: [
    {
      title: 'A 7-year-old at the family table',
      q: 'A child is 1220 mm tall; her elbow sits about 180 mm above the seat. The family table is 750 mm and the chairs 450 mm high. What does she need?',
      steps: ['Her own seat: $0.26 \\times 1220 = 317$ mm; her own table: $0.41 \\times 1220 = 500$ mm.', 'At the 450 mm chair her feet hang about $450 - 317 = 133$ mm above the floor, and the table is $750 - 450 - 180 = 120$ mm above her elbow.', 'To bring her elbow to the table: seat at $750 - 180 = 570$ mm, a 120 mm booster. The footrest must then be about $570 - 317 = 253$ mm high.'],
      a: 'A booster of about 120 mm and a footrest of about 250 mm — or a growing chair set to seat 570 mm and footplate 250 mm.'
    },
    {
      title: 'How long does a chair size last?',
      q: 'A child grows 57 mm a year. A chair suits a child while its seat is within ±25 mm of 0.26 × stature. For how long does one fixed chair suit a growing child?',
      steps: ['The ideal seat rises $0.26 \\times 57 = 14.8$ mm a year.', 'The chair covers a band of 50 mm of ideal seat height.', '$50 / 14.8 = 3.4$ years — if bought when the child is at the bottom of the band.'],
      a: 'About three years at best.'
    }
  ],
  quiz: [
    { q: 'How should a chair for a child be chosen?', choices: ['By the child\'s stature', 'By the child\'s age', 'By the child\'s weight', 'By the table it goes with only'], a: 0, why: 'Body dimensions follow stature, and children of one age differ widely in height.' },
    { q: 'Why does a booster cushion alone not fit a child to an adult table?', choices: ['It raises the seat but leaves the feet dangling; a footrest is needed too', 'It makes the table too low', 'Cushions are unsafe', 'It changes the child\'s elbow height'], a: 0, why: 'The seat must be high for the table and the feet supported: both adjustments are needed.' },
    { q: 'What is the minimum age commonly given for sleeping on an upper bunk?', choices: ['6 years', '2 years', '12 years', 'No limit'], a: 0, why: 'European standards and product warnings give 6 years; younger children fall more easily and cannot use the ladder safely at night.' },
    { q: 'True or false: a 2-year-old\'s legs are about the same share of stature as an adult\'s.', a: false, why: 'Young children have relatively long trunks: sitting height is close to 58–60 % of stature at 2 years against about 52 % in adults.' }
  ],
  problems: [
    { q: 'A child is 1380 mm tall. Using a table factor of 0.41, how high should the desk be?', answer: 566, unit: 'mm', tol: 0.01, steps: ['$0.41 \\times 1380 = 566$ mm.'] }
  ],
  ranges: [
    { dim: 'Child\'s seat height', range: '0.25–0.27 × stature', who: 'the child\'s own popliteal height plus shoe', why: 'Feet flat, thighs level, no pressure under the thighs.', limits: 'Lower end for toddlers, whose legs are relatively short; recheck every year.', setting: ['civil', 'school'], src: 'WHO growth references and the body proportions of children' },
    { dim: 'Child\'s table or desk height', range: '0.40–0.42 × stature', who: 'the child\'s seated elbow height on a fitting seat', why: 'Forearms level with the table; no shrugging, no slumping.', limits: 'Only with the fitting seat; at an adult table use a booster and footrest.', setting: ['civil', 'school'] },
    { dim: 'Gap between cot bars', range: [45, 65], unit: 'mm', who: 'infants\' heads (must not pass) and limbs (must not be trapped)', why: 'Stops head and limb entrapment.', limits: 'EU rule (EN 716); the US limit is 60 mm (2⅜ in). Second-hand and old cots may not comply.', setting: 'civil', src: 'EN 716-1; US CPSC crib standards' },
    { dim: 'Age for an upper bunk', range: '6 years and older', who: 'children able to use a ladder and stay in bed half-asleep', why: 'Limits falls from height.', limits: 'Guard rails on all sides of the top bunk; a firm ladder; no loose cords.', setting: 'civil', src: 'EN 747-1 (bunk beds and high beds)' },
    { dim: 'Changing table surface height', range: [800, 900], unit: 'mm', who: 'the parent\'s standing elbow height less a light-work drop and the baby', why: 'The parent works without stooping.', limits: 'Tall parents want more; never leave a baby on it.', setting: 'civil' },
    { dim: 'Step stool for a child at an adult basin', range: [150, 250], unit: 'mm', who: 'children of about 3–8 years at an 800–850 mm basin', why: 'Hands reach the water without climbing.', limits: 'Must be stable and non-slip; remove the need with a lower basin where possible.', setting: 'civil' }
  ],
  applications: [
    'Growing chairs with movable seat and footplate that follow a child from toddler to teenager.',
    'Height-adjustable children\'s desks raised each school year.',
    'School furniture chosen by size mark and stature, several sizes in a class.',
    'Anchoring kits for chests of drawers and televisions.'
  ],
  sources: [
    'WHO Child Growth Standards (0–5 years, 2006) and WHO Growth Reference (5–19 years, 2007): stature by age.',
    'EN 1729-1, *Furniture — Chairs and tables for educational institutions — Part 1: Functional dimensions* (size marks).',
    'EN 716-1 (children\'s cots), EN 747-1 (bunk beds and high beds), EN 14988 (children\'s high chairs).',
    'US Consumer Product Safety Commission rules for full-size cribs (2011) and the STURDY Act (2022) for clothing storage units.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on children\'s anthropometry and furniture.'
  ],
  sim: 'fs-child'
},

{
  id: 'stairs-ergonomics', parent: 'building-spaces', title: 'Stairs and handrails', level: 2,
  short: 'A stair is a ladder tilted to fit the human stride: rise and going follow Blondel\'s rule 2R + G ≈ 600–650 mm, the going must take the foot, the rises must be uniform, and handrails, headroom and guards are set from the body. Comfortable ranges, and how the building codes of different countries set their limits.',
  keywords: ['stairs', 'rise', 'riser', 'going', 'tread', 'Blondel', '2R + G', 'pitch', 'stair angle', 'handrail height', 'headroom', 'nosing', 'guard', 'balustrade', 'falls on stairs', 'Approved Document K', 'IRC', 'IBC', 'ADA stairs'],
  prereq: ['standing-dimensions', 'hand-foot-head', 'design-for-range'],
  related: ['ramps-accessibility', 'accessible-design', 'doors-corridors', 'lighting-levels', 'age-children-elderly', 'working-at-height', 'physics:inclined-plane', 'math:right-triangle-trig'],
  body: `
Walking up a stair, the body lifts itself one **rise** at a time while moving forward one **going** (the horizontal depth of a tread). Steps that match the stride are climbed without thinking; steps that do not are where people trip and fall — stairs are among the commonest places of serious falls at home and in public buildings, above all going down.

### Blondel's rule
In the 1670s the French architect François Blondel observed that a comfortable stair keeps **two rises plus one going** about equal to the length of a stride on level ground:

$$2R + G \\approx 600\\text{–}650\\ \\text{mm}$$

Steeper stairs (big $R$) must have shorter goings and flatter stairs longer ones, because lifting the body shortens the step. The pitch is $\\alpha = \\arctan(R/G)$ (an [[?inverse-trig|inverse tangent]]): 30–35° is comfortable; above about 40° a stair becomes hard to descend facing forwards. A stair of 170 mm rises and 280 mm goings gives $2R + G$ = 620 mm and a pitch of 31°.

### The foot must fit the tread
Going down, people place the foot near the front of the tread; if the going is shorter than the shoe, the heel overhangs or the foot turns sideways. A 95th-percentile man's foot is about 290 mm long, 310–320 mm in shoes. **Goings of 280 mm or more** (with a small nosing) take most feet; 220–250 mm goings, common in older homes, are where descents go wrong. Rises of **150–180 mm** suit most people, including many older people; rises above about 190 mm are hard for older people, children and anyone carrying something.

**Uniformity matters as much as size.** The eye checks the first steps and the feet then trust the rhythm; a single step that differs by 10 mm catches people out. Codes therefore limit variation (in the US, adjacent rises and goings may differ by no more than 9.5 mm, ⅜ in), forbid single steps in many places, and ask for visually contrasting nosings so the edge of each tread is seen.

### Codes differ by country
| Rule | Rise | Going | Other limits |
|---|---|---|---|
| Comfortable (ergonomics) | 150–180 mm | 280–320 mm | $2R + G$ = 600–650 mm, pitch about 30–35° |
| England, private stair (Approved Document K) | 150–220 mm | 220–300 mm | pitch ≤ 42°, $2R + G$ = 550–700 mm |
| England, general access stair | 150–170 mm | 250–400 mm | $2R + G$ = 550–700 mm |
| US homes (International Residential Code) | ≤ 196 mm (7¾ in) | ≥ 254 mm (10 in) | nosings 19–32 mm on short treads |
| US public buildings (IBC; 2010 ADA Standards) | 102–178 mm (4–7 in) | ≥ 279 mm (11 in) | closed risers on accessible stairs |

The US public-building rule — "7–11" — owes much to research on stair falls in the 1970s and 1980s, summarised in John Templer's *The Staircase*. Germany's DIN 18065 uses the same step rule as Blondel. **In the sim**, choose a rule and change the rise and going: the steps, the climber's foot, the handrail and the headroom are drawn to scale.

### Handrails, headroom and guards
- **Handrails** on both sides of stairs in public buildings (and ideally at home), at **865–1000 mm** above the nosings (34–38 in in the US, 900–1000 mm in England); a round or oval grip of 32–50 mm that the hand can close around, clear of the wall by 40–50 mm; continuous and extended about 300 mm beyond the top and bottom so the hand is held until the feet are on the level. A second rail at 600–700 mm helps children and people of short stature.
- **Headroom** of at least 2000 mm above the pitch line (England; 2032 mm, 6 ft 8 in, in the US) — set, like a door, by the tallest users plus shoes and a stride.
- **Guards** (balustrades) at open edges: 900 mm on stairs in homes and 1100 mm at landings in public buildings in England; 36 in (914 mm) in US homes and 42 in (1067 mm) in US public buildings, with openings that a 100 mm (4 in) sphere cannot pass — a child's head.

### Settings
- **Homes:** steeper stairs are allowed to save space, but older users need low rises, two handrails and good light (about 100–150 lx, with switches at both ends).
- **Public buildings, schools, health:** the gentle "7–11" or 150–170/280 mm stairs, both handrails, contrasting nosings, no open risers.
- **Workshops and industry:** access stairs to machines and platforms follow ISO 14122 (permanent means of access to machinery), which ranks the choice ramp, stair, step ladder, ladder by steepness.
- **Ships, military vehicles and field sites:** steep ladder-stairs (50–75°) save space; they are climbed facing the steps with both hands, which changes every rule above.

> [!warn] Most stair falls happen going down, on the last steps, on irregular or poorly lit stairs, and when a hand is not on a rail. Uniform steps, a going that takes the foot, handrails on both sides and light at both ends prevent most of them.

> [!key] Keep 2R + G near 600–650 mm, rises about 150–180 mm and goings of 280 mm or more; make every step the same; add handrails on both sides at about 900 mm and 2 m of headroom.
`,
  ideas: [
    'Blondel\'s rule: two rises plus one going ≈ 600–650 mm, the length of a stride.',
    'The pitch is arctan(R/G); comfortable stairs are about 30–35°.',
    'The going must take the shoe on the way down: 280 mm or more; rises of 150–180 mm suit most people.',
    'Uniform steps matter as much as their size: people climb by rhythm.',
    'Codes differ: England allows private stairs up to 42°, US public stairs follow the 7-in rise, 11-in going rule.'
  ],
  pitfalls: [
    'Steeper stairs are only harder to climb — The real danger is descending: short goings force the heel over the nosing.',
    'One step of a slightly different height does not matter — The feet climb by rhythm; a 10 mm difference is enough to trip people, which is why codes limit it.',
    'A handrail on one side is enough — People going down hold with their stronger hand; half of them would have it on the wrong side.'
  ],
  formulas: [
    {
      name: 'Blondel\'s step rule',
      expr: 's = 2*R + G', tex: 's = 2R + G',
      vars: {
        s: { name: 'step length (comfortable 600–650)', q: 'length', unit: 'mm' },
        R: { name: 'rise of each step', q: 'length', unit: 'mm', value: 170 },
        G: { name: 'going of each tread', q: 'length', unit: 'mm', value: 280 }
      },
      stories: { s: 'A stair has rises of {R} and goings of {G}. What is 2R + G?', G: 'For rises of {R} and a step length of {s}, what going is needed?' }
    },
    {
      name: 'Pitch of a stair',
      expr: 'alpha = atan(R/G)', tex: '\\alpha = \\arctan\\frac{R}{G}',
      vars: {
        alpha: { name: 'pitch', q: 'angle', unit: '°', tex: '\\alpha' },
        R: { name: 'rise', q: 'length', unit: 'mm', value: 170 },
        G: { name: 'going', q: 'length', unit: 'mm', value: 280 }
      },
      stories: { alpha: 'What is the pitch of a stair with {R} rises and {G} goings?', G: 'A stair has {R} rises. What going gives a pitch of {alpha}?' }
    },
    {
      name: 'Number of risers',
      expr: 'n = H/R', tex: 'n = \\frac{H}{R}',
      vars: {
        n: { name: 'number of risers' },
        H: { name: 'floor-to-floor height', q: 'length', unit: 'mm', value: 2700 },
        R: { name: 'rise', q: 'length', unit: 'mm', value: 180 }
      },
      note: 'Round n to a whole number and recompute R = H/n: every rise must be the same.',
      stories: { n: 'A floor-to-floor height of {H} is climbed with rises of {R}. How many risers?' }
    }
  ],
  examples: [
    {
      title: 'Designing a house stair',
      q: 'The floor-to-floor height is 2700 mm. Choose the number of risers, the rise and a going that satisfies Blondel\'s rule at 630 mm. How long is the flight in plan, and how steep?',
      steps: ['Try rises near 175 mm: $2700 / 175 = 15.4$, so 15 risers of $2700/15 = 180$ mm.', 'Going: $G = 630 - 2 \\times 180 = 270$ mm.', 'A flight has one tread fewer than risers: $14 \\times 270 = 3780$ mm in plan.', 'Pitch: $\\arctan(180/270) = 33.7°$.'],
      a: '15 risers of 180 mm, 270 mm goings, 3.78 m long, about 34°.'
    },
    {
      title: 'England\'s steepest private stair',
      q: 'Approved Document K allows private stairs a rise of up to 220 mm and a pitch of up to 42°. What is the shortest going with a 220 mm rise, and does 2R + G fall within 550–700 mm?',
      steps: ['$G = R / \\tan 42° = 220 / 0.900 = 244$ mm.', '$2R + G = 440 + 244 = 684$ mm — inside 550–700.', 'A 220/220 stair (45°) would break the pitch limit even though both dimensions are within their own limits.'],
      a: 'About 245 mm; 2R + G = 684 mm.'
    }
  ],
  quiz: [
    { q: 'A stair has 200 mm rises. What going does Blondel\'s rule (2R + G = 630 mm) suggest?', choices: ['230 mm', '430 mm', '330 mm', '130 mm'], a: 0, why: '630 − 2 × 200 = 230 mm: steep stairs need short goings to keep the stride, which is why steep stairs are uncomfortable for large feet.' },
    { q: 'Why do most stair falls happen going down?', choices: ['The foot lands on the front of the tread; short goings and poor sight of the edges make it slip or overhang', 'People are more tired going down', 'Handrails are only on the up side', 'Going down is faster'], a: 0, why: 'Descent puts the heel near the nosing; with short goings or unclear edges the foot misses.' },
    { q: 'What is the US public-building stair limit known as "7–11"?', choices: ['Rises of at most 7 in (178 mm), goings of at least 11 in (279 mm)', 'Seven steps then eleven', 'A 7° to 11° pitch', 'Handrails 7 to 11 in apart'], a: 0, why: 'The IBC and the 2010 ADA Standards limit risers to 4–7 in and treads to 11 in minimum.' },
    { q: 'True or false: a guard should stop a 100 mm (4 in) sphere passing through it.', a: true, why: 'That is roughly the size of a small child\'s head; codes in England and the US use this test.' },
    { q: 'About how high are handrails set above the nosings?', choices: ['865–1000 mm', '500–600 mm', '1200–1400 mm', 'At the height of the user\'s shoulder'], a: 0, why: 'About hip height of most adults: 34–38 in in the US, 900–1000 mm in England.' }
  ],
  problems: [
    { q: 'A US house stair uses the IRC limits exactly: rise 196 mm and going 254 mm. What is its pitch in degrees?', answer: 37.7, unit: '°', tol: 0.01, steps: ['$\\alpha = \\arctan(196/254) = \\arctan(0.772) = 37.7°$.'] },
    { q: 'A stair has rises of 165 mm. What going makes 2R + G = 620 mm?', answer: 290, unit: 'mm', tol: 0.005, steps: ['$G = 620 - 2 \\times 165 = 290$ mm.'] }
  ],
  ranges: [
    { dim: 'Stair rise (comfortable)', range: [150, 180], unit: 'mm', who: 'older people, children and people carrying loads (upper limit); the stride of tall people (lower limit)', why: 'Easy lift per step; the stride stays natural.', limits: 'Codes allow more in homes (England 220 mm, US 196 mm); low rises under about 130 mm are tripped over.', setting: ['civil', 'health', 'school'], src: 'J. Templer, The Staircase; national codes' },
    { dim: 'Stair going (comfortable)', range: [280, 320], unit: 'mm', who: 'shoe length of large users placed on the tread when descending (95th-percentile man about 310–320 mm in shoes)', why: 'The whole foot, or nearly, lands on the tread going down.', limits: 'Long goings with low rises break the stride too; keep 2R + G within 600–650 mm.', setting: ['civil', 'health', 'school'] },
    { dim: 'Blondel\'s step length 2R + G', range: [600, 650], unit: 'mm', who: 'the walking stride of adults, shortened by the climb', why: 'Keeps the natural rhythm of walking.', limits: 'England allows 550–700 mm; children have shorter strides.', setting: 'all', src: 'F. Blondel, Cours d\'architecture (1675)' },
    { dim: 'Stair pitch', range: [null, 42], unit: '°', who: 'people descending facing forwards', why: 'Above about 40° descending facing forwards becomes unsafe.', limits: 'England\'s limit for private stairs; public stairs are gentler (about 30–35°). Ladder-stairs (50–75°) are climbed facing the steps.', setting: ['civil', 'workshop'], src: 'Approved Document K (England)' },
    { dim: 'Handrail height above the nosings', range: [865, 1000], unit: 'mm', who: 'hip to waist height of most adults, hand held low and forward', why: 'A firm grip at a height where it can check a fall.', limits: 'A second rail at 600–700 mm for children and short people; 34–38 in in the US, 900–1000 mm in England.', setting: ['civil', 'health', 'school', 'workshop'], src: '2010 ADA Standards; Approved Document K' },
    { dim: 'Handrail grip diameter', range: [32, 50], unit: 'mm', who: 'hand sizes from small women to large men', why: 'The fingers can wrap round and hold in a fall.', limits: 'Flat or large profiles cannot be gripped; clearance to the wall of about 40–50 mm is needed.', setting: 'all', src: '2010 ADA Standards (1¼–2 in)' },
    { dim: 'Headroom over a stair', range: [2000, null], unit: 'mm', who: 'the tallest users with shoes and the bob of climbing', why: 'Nobody hits their head.', limits: 'England 2.0 m (less allowed in loft conversions); US 2032 mm (6 ft 8 in).', setting: ['civil', 'workshop'] },
    { dim: 'Guard (balustrade) height at an open edge', range: [900, 1100], unit: 'mm', who: 'the centre of mass of tall adults leaning on it (upper), homes (lower)', why: 'Stops people toppling over the edge.', limits: 'England: 900 mm on stairs in homes, 1100 mm at landings in public buildings; US: 36 in (914 mm) homes, 42 in (1067 mm) public. Openings smaller than a 100 mm sphere.', setting: ['civil', 'workshop'] }
  ],
  applications: [
    'Laying out a staircase for a house from the floor-to-floor height.',
    'Checking an existing stair for fall risk: uniformity, goings, handrails, lighting.',
    'Access stairs and platforms at machines (ISO 14122).',
    'Public buildings with contrasting nosings, handrails on both sides and closed risers.'
  ],
  history: 'François Blondel set out his rule of two rises and a going in his Cours d\'architecture (1675–1683), based on the Paris foot. Three centuries later, John Templer and colleagues filmed people on stairs and analysed accidents; their work supported the gentler "7–11" stairs adopted in US public buildings.',
  sources: [
    'J. Templer, *The Staircase: Studies of Hazards, Falls, and Safer Design* (MIT Press, 1992).',
    'Approved Document K, *Protection from falling, collision and impact* (England).',
    'International Residential Code and International Building Code (US): stairways, handrails, guards.',
    '2010 ADA Standards for Accessible Design: stairways and handrails.',
    'DIN 18065, *Stairs in buildings — Terminology, measuring rules, main dimensions* (Germany).',
    'ISO 14122-3 and -4, *Safety of machinery — Permanent means of access to machinery* (stairs, step ladders, guard rails; ladders).'
  ],
  sim: 'fs-stairs'
},

{
  id: 'ramps-accessibility', parent: 'building-spaces', title: 'Ramps', level: 2,
  short: 'A ramp trades height for length: every 1 % of gradient is felt in the arms of a wheelchair user and the legs of an older walker. Gradients of 1:20 to 1:12, the length a flight may run before a landing, and how the US, England and Germany set their limits differently.',
  keywords: ['ramp gradient', '1:12', '1:20', 'slope', 'wheelchair ramp', 'landing', 'rise per flight', 'push force', 'rolling resistance', 'cross slope', 'handrails on ramps', 'kerb ramp', 'ADA ramp', 'DIN 18040', 'Approved Document M'],
  prereq: ['stairs-ergonomics', 'pushing-pulling', 'disability-inclusive'],
  related: ['accessible-design', 'doors-corridors', 'handling-aids', 'physics:inclined-plane', 'physics:friction', 'physics:power', 'math:linear-functions'],
  body: `
A ramp is an [[physics:inclined-plane|inclined plane]] for people. Pushing a wheelchair, a buggy or a trolley up it, the force along the slope is

$$F = m g\\,(\\sin\\theta + c_{rr}\\cos\\theta), \\qquad \\theta = \\arctan G,$$

where $G$ is the gradient (rise over going), $m$ the mass pushed and $c_{rr}$ the rolling resistance — roughly 0.01 on a smooth hard floor and several times that on carpet or gravel. For 100 kg (a user and a manual chair) the gravity part alone is 49 N at 1:20 (5 %) and 81 N at 1:12 (8.3 %). Pushed on hand-rims at walking pace for 9 m, the steeper ramp is hard work for many users and impossible for some; coming down, the same force must be held back with the hands on the rims.

### Gradient against length
Every gradient is a compromise: a gentle ramp is easier per metre but longer, so it takes more time, space and total effort to reach the same height (and the potential energy $mgh$ to be supplied is the same). Rules therefore limit both **the gradient** and **how long a flight may run** before a level landing where people can rest, pass and turn:

| Rule | Steepest gradient | Longest flight | Landings, width |
|---|---|---|---|
| US, 2010 ADA Standards | 1:12 (8.33 %) | 760 mm (30 in) of rise per run, 9.1 m at 1:12 | landings ≥ 1525 mm (60 in) long; ≥ 915 mm (36 in) between handrails; cross slope ≤ 1:48 |
| England, Approved Document M | 1:12 for a 2 m flight, 1:15 for 5 m, 1:20 for 10 m (sliding scale) | 500 mm of rise per flight | a lift is considered where the total rise exceeds about 2 m; steps as well as a ramp where the rise exceeds 300 mm |
| Germany, DIN 18040 | 6 % | 6 m, then a landing | landings 1500 × 1500 mm; ramps 1200 mm wide; no cross slope |

The same 600 mm rise is one 7.2 m run at 1:12 in the US, but in England a 1:12 flight may be only 2 m long, so the ramp becomes two flights at 1:15 or 1:20 — 9–12 m in all — and in Germany two 6 % flights of 5 m. Where a ramp would be very long, a **platform lift or lift** serves wheelchair users better, and **steps beside the ramp** serve people who walk with sticks, who often find steps easier than a long slope. **In the sim**, choose a rule and a rise and watch the flights and landings appear, with the force the user must push and the power at walking pace.

### Details that make a ramp usable
- **Handrails on both sides**, at about 900–1000 mm (865–965 mm in the US), extending about 300 mm beyond each end — needed on anything but very short ramps (in the US, above 150 mm of rise).
- **Edge protection**: an upstand or kerb so a front wheel or a crutch cannot slip off the side.
- **Landings at the top and bottom and at every turn**, level and about 1500 mm long, clear of door swings.
- **Slip-resistant surface**, drained so it does not ice; visual contrast at the top and bottom.
- **Cross slope** (across the direction of travel) kept tiny — a wheelchair on a cross slope veers downhill and must be steered with one hand.

### Settings
- **Civil and public:** the ramp is part of the main route — the same entrance for everyone, not a back door.
- **Homes:** portable and threshold ramps are often steeper (1:6–1:8) and are usable only with a helper or a powered chair; say so when recommending one.
- **Workshops and warehouses:** trolleys, pallet trucks and carts obey the same force law; pushing a 300 kg trolley up 1:12 needs about 250 N before rolling resistance — far beyond the forces people should push for long (see [[pushing-pulling]]). Keep routes level or use powered handling.
- **Vehicles, the military and field sites:** vehicle and aircraft loading ramps are steep and short; they are designed for powered movement or several people, with rails and grip.

> [!warn] Steep ramps are dangerous downhill too: a manual wheelchair can run away or tip backwards on the way up. Short, steep portable ramps need a helper; never improvise a ramp from boards without edge protection.

> [!key] Choose the gentlest gradient the space allows — 1:20 is easy, 1:12 is the steepest most rules accept — and break long ramps with level landings; beyond about 2 m of rise, prefer a lift.
`,
  ideas: [
    'The push up a ramp is mg(sin θ + c cos θ): about 49 N per 100 kg at 1:20 and 81 N at 1:12, before rolling resistance.',
    'A gentler ramp is easier per metre but longer; rules limit both the gradient and the flight length.',
    'The US allows 1:12 for 760 mm of rise per run; England limits 1:12 to 2 m flights; Germany limits ramps to 6 %.',
    'Landings, handrails on both sides, edge protection and no cross slope make a ramp usable.',
    'Very long ramps are worse than a lift; people with sticks often prefer steps.'
  ],
  pitfalls: [
    'Any slope a wheelchair can climb is accessible — Many users cannot push up 1:12 for long, and must also hold back coming down; the gradient limits exist for them.',
    'A gentler ramp needs less energy — It needs less force, but the same mgh of lift over a longer distance, plus more rolling resistance; it is the force and its duration that matter.',
    'Ramps suit everyone better than steps — People who walk with sticks or have painful knees often find a few good steps easier; provide both where the rise is more than a step or two.'
  ],
  formulas: [
    {
      name: 'Length of a ramp',
      expr: 'L = R/G', tex: 'L = \\frac{R}{G}',
      vars: {
        L: { name: 'horizontal length of sloping ramp', q: 'length', unit: 'm' },
        R: { name: 'rise', q: 'length', unit: 'mm', value: 600 },
        G: { name: 'gradient (rise ÷ going)', q: 'ratio', unit: '%', value: 8.33 }
      },
      note: 'Add level landings between flights: about 1.5 m each.',
      stories: { L: 'A ramp must climb {R} at a gradient of {G}. How long is the slope?', G: 'There is room for {L} of ramp to climb {R}. What gradient results?' }
    },
    {
      name: 'Force to push up a ramp',
      expr: 'F = m*g*(sin(atan(G)) + c*cos(atan(G)))', tex: 'F = m g\\left(\\sin(\\arctan G) + c_{rr}\\cos(\\arctan G)\\right)',
      vars: {
        F: { name: 'force along the slope', q: 'force', unit: 'N' },
        m: { name: 'mass pushed (user + chair, or trolley)', q: 'mass', unit: 'kg', value: 100 },
        g: { const: 'g' },
        G: { name: 'gradient', q: 'ratio', unit: '%', value: 8.33, min: 0, max: 50 },
        c: { name: 'rolling resistance coefficient (about 0.01 hard floor, 0.03 carpet)', value: 0.015, tex: 'c_{rr}' }
      },
      note: 'Steady speed; add the force to accelerate when starting on the slope. Coming down, mg(sin θ − c cos θ) must be held back.',
      stories: { F: 'A wheelchair user and chair weigh {m} together. What force is needed to push up a {G} ramp with rolling resistance {c}?', G: 'A user can push {F} steadily with {m} of chair and body, rolling resistance {c}. What is the steepest gradient they can climb?' }
    }
  ],
  examples: [
    {
      title: 'One rise, three rules',
      q: 'A doorway is 600 mm above the pavement. Lay out a ramp under the US ADA rule (1:12), England\'s sliding scale, and Germany\'s DIN 18040 (6 %, flights of 6 m).',
      steps: ['US: at 1:12 the going is $600 \\times 12 = 7200$ mm, one run (600 mm ≤ 760 mm of rise per run).', 'England: a 1:12 flight may be only 2 m (166 mm of rise). At 1:15 a flight may run 5 m (333 mm): two flights of 4.5 m, 300 mm each, 9 m of slope plus a landing.', 'Germany: at 6 % the going is 10 m, split into two flights of 5 m with a 1.5 m landing.'],
      a: 'About 7.2 m in the US, 9 m in England, 10 m in Germany — plus landings.'
    },
    {
      title: 'How hard is the push?',
      q: 'A user and chair weigh 100 kg. Rolling resistance is 0.015. Compare the push up 1:20 and 1:12, and the power at 0.6 m/s.',
      steps: ['1:12: $\\theta = \\arctan 0.0833 = 4.76°$; $F = 100 \\times 9.81 \\times (0.0830 + 0.015 \\times 0.9966) = 96$ N.', '1:20: $\\theta = 2.86°$; $F = 981 \\times (0.0499 + 0.0150) = 64$ N.', 'Power at 0.6 m/s: 58 W against 38 W — delivered through the hands on the rims.'],
      a: 'About 96 N (58 W) at 1:12 against 64 N (38 W) at 1:20.'
    }
  ],
  quiz: [
    { q: 'What is 1:12 as a percentage and an angle?', choices: ['8.3 % and 4.8°', '12 % and 12°', '1.2 % and 0.7°', '8.3 % and 8.3°'], a: 0, why: '1/12 = 0.0833; arctan 0.0833 = 4.76°.' },
    { q: 'Why do rules limit the length of a ramp flight as well as its gradient?', choices: ['Users need level landings to rest, pass, open doors and regain control', 'To save concrete', 'Because long ramps are steeper', 'Only for drainage'], a: 0, why: 'The effort accumulates with length; landings give rest and room to manoeuvre.' },
    { q: 'A 300 kg trolley is pushed up a 1:12 ramp. Roughly what force does gravity alone require?', choices: ['About 245 N', 'About 25 N', 'About 2450 N', 'About 3 N'], a: 0, why: '300 × 9.81 × 0.083 ≈ 245 N — more than people should push for long; use level routes or power.' },
    { q: 'True or false: a person walking with two sticks always prefers a ramp to steps.', a: false, why: 'Many find a slope tiring and unstable and prefer a few good steps with handrails; provide both.' }
  ],
  problems: [
    { q: 'How long must a 1:20 ramp be to climb 450 mm (slope only, in metres)?', answer: 9, unit: 'm', tol: 0.01, steps: ['$L = R/G = 0.45 / 0.05 = 9$ m.'] },
    { q: 'What force pushes 90 kg up a 6 % ramp with rolling resistance 0.01?', answer: 61.7, unit: 'N', tol: 0.02, steps: ['$\\theta = \\arctan 0.06 = 3.43°$; $\\sin\\theta = 0.0599$, $\\cos\\theta = 0.9982$.', '$F = 90 \\times 9.81 \\times (0.0599 + 0.0100) = 61.7$ N.'] }
  ],
  ranges: [
    { dim: 'Ramp gradient, easy for most users', range: '1:20 (5 %) or gentler', who: 'manual wheelchair users, older walkers, people pushing buggies', why: 'About 50 N per 100 kg: most users can climb it without help.', limits: 'Long: 20 m of ramp per metre of rise.', setting: ['civil', 'health'] },
    { dim: 'Steepest ramp gradient in most rules', range: '1:12 (8.33 %)', who: 'the steepest a majority of independent manual wheelchair users can climb over a short run', why: 'Keeps ramps short enough to build.', limits: 'Hard work for many users; England allows it only for 2 m flights, Germany not at all (6 %).', setting: ['civil', 'health'], src: '2010 ADA Standards; Approved Document M' },
    { dim: 'Rise of one ramp flight', range: [null, 760], unit: 'mm', who: 'wheelchair users needing a rest and a place to regain control', why: 'Limits sustained effort and runaway risk.', limits: 'US rule (30 in); England 500 mm; Germany limits flights to 6 m long.', setting: ['civil', 'health'], src: '2010 ADA Standards; Approved Document M; DIN 18040' },
    { dim: 'Landing length', range: [1500, null], unit: 'mm', who: 'a wheelchair (about 1200 mm long) with room to stop, and to open a door', why: 'Rest, passing and turning on the level.', limits: 'Door swings need more; 1525 mm (60 in) in the US.', setting: ['civil', 'health'] },
    { dim: 'Clear width of a ramp', range: [915, 1500], unit: 'mm', who: 'a wheelchair with hands on the rims (lower end); a wheelchair passing a walker (upper end)', why: 'Room to push and for people to pass.', limits: '915 mm (36 in) between handrails in the US; 1200 mm in Germany; wider where people pass.', setting: ['civil', 'health'] },
    { dim: 'Ramp handrail height', range: [865, 1000], unit: 'mm', who: 'walkers holding on, wheelchair users pulling', why: 'A grip on both sides for going up and holding back going down.', limits: 'A lower second rail helps children and wheelchair users.', setting: ['civil', 'health'] },
    { dim: 'Cross slope of a ramp or path', range: '1:48 (about 2 %) or less', who: 'wheelchair users', why: 'Stops the chair veering downhill.', limits: 'Drainage needs some fall; Germany allows none on ramps.', setting: ['civil', 'health'], src: '2010 ADA Standards' }
  ],
  applications: [
    'Level or gently sloping main entrances instead of a separate ramp at the side.',
    'Laying out ramps under the rule where the building is: the same rise gives different lengths in the US, England and Germany.',
    'Keeping trolley routes in hospitals, kitchens and warehouses level.',
    'Choosing a platform lift when the rise is large.'
  ],
  sources: [
    '2010 ADA Standards for Accessible Design (US Department of Justice): ramps, landings, handrails, edge protection.',
    'Approved Document M, *Access to and use of buildings*, Volume 2 (England): ramped access and the sliding scale.',
    'DIN 18040-1, *Construction of accessible buildings — Design principles — Part 1: Publicly accessible buildings* (Germany).',
    'ISO 21542, *Building construction — Accessibility and usability of the built environment*.',
    'ISO 11228-2, *Ergonomics — Manual handling — Part 2: Pushing and pulling*.'
  ],
  sim: 'fs-ramp'
},

{
  id: 'doors-corridors', parent: 'building-spaces', title: 'Doors, corridors and clearances', level: 1,
  short: 'Doors and corridors are clearances: they must pass the widest thing that ever moves through them — a large person with bags, two people passing, a wheelchair, a hospital bed, a sofa turning a corner. Clear widths in ranges, handle heights and opening forces, and how different countries pair corridor and door widths.',
  keywords: ['door width', 'clear opening width', 'effective clear width', 'corridor width', 'passing space', 'wheelchair door', 'door handle height', 'door opening force', 'vision panel', 'threshold', 'moving furniture', 'sofa around a corner', 'ladder around a corner', 'escape width'],
  prereq: ['design-for-range', 'standing-dimensions', 'disability-inclusive'],
  related: ['ramps-accessibility', 'accessible-design', 'bathroom-ergonomics', 'stairs-ergonomics', 'access-openings', 'office-layout', 'handling-aids', 'math:circles'],
  body: `
A door or a corridor fits everything narrower than itself and nothing wider, so it is set from the **widest user**, with room to move. The widest users are rarely people walking alone: they are people carrying things, people passing each other, wheelchairs, buggies, beds and furniture on moving day.

### How wide are people moving?
The body's widest part standing is the shoulders: about 525 mm for a 95th-percentile man in this app's representative data. Walking adds a sway of roughly ±50 mm, clothing and bags add more:

| Who or what | Width needed while moving (about) | What limits it |
|---|---|---|
| One adult walking | 600–650 mm | shoulder breadth of large men plus sway |
| Adult with two shopping bags or a case | 800–850 mm | bags held at the sides |
| Two adults passing | 1100–1200 mm | two shoulder widths, turned slightly |
| Walking frame or rollator | 650–750 mm | frame width |
| Person on crutches | about 900 mm | the crutches spread out |
| Manual wheelchair | 750–850 mm | chair width 600–700 mm plus the hands on the rims |
| Wheelchair and a walking person | about 1500 mm | the two side by side |
| Two wheelchairs passing | about 1800 mm | the two chairs with hands |

A **clear opening** is measured between the face of the open door (at 90°) and the stop on the other side; the door's thickness, the stop and the hinge side take roughly 50–100 mm off the leaf width, and a projecting lever handle takes more.

### Doors
- **Clear width.** The 2010 ADA Standards require at least 815 mm (32 in); England's Approved Document M asks, for new buildings, about 800 mm for a straight approach, 825 mm off a 1200 mm corridor, and 1000 mm for main entrances used by the public; Germany's DIN 18040 asks 900 mm. In homes 750–800 mm doors are common and many are narrower in older buildings.
- **Corridor and door go together.** Turning a wheelchair through a door off a narrow corridor needs a wider door than meeting it head-on; England's rules for new homes pair wider doors with narrower corridors for this reason.
- **Height**: 2000–2100 mm leaves (see [[design-for-range]]).
- **Handles** at about 850–1050 mm, levers operable with a closed fist (the ADA allows 865–1220 mm, 34–48 in; DIN 18040 uses 850 mm).
- **Opening force**: small enough for older people and wheelchair users — about 22 N (5 lbf) for interior doors in the ADA, and about 30 N at the leading edge in England. Heavy fire doors on closers are the commonest barrier in public buildings; hold-open devices linked to the fire alarm solve it.
- **Space at the latch side** (300 mm in England, 455 mm, 18 in, on the pull side in the US) so a wheelchair user can reach the handle and swing the door past the footplates.
- **Vision panels** from about 500 to 1500 mm above the floor, so both a child or seated person and a standing adult are seen from the other side.
- **Thresholds** no higher than about 13–15 mm, bevelled.

### Corridors
Homes manage with 900 mm; public buildings need **1200 mm or more** with passing places, **1500 mm** where a wheelchair must pass a walking person or turn, **1800 mm** for two wheelchairs, and hospitals much more for beds with staff. The ADA's minimum route is 915 mm (36 in) with passing spaces 1525 mm (60 in) square every 61 m (200 ft). Fire codes add their own widths, sized from the number of people who must escape.

### Furniture round corners
The longest thin pole that turns a right-angle corner between corridors of widths $a$ and $b$ has length

$$L = \\left(a^{2/3} + b^{2/3}\\right)^{3/2},$$

found by making the pole touch both outer walls and the inner corner at the worst angle (a minimum found with the [[?derivative]]). Two 900 mm corridors pass a 2.55 m pole with no thickness; a real object with plan depth $w$ passes much less, because its depth fills the corner. A sofa 900 mm deep cannot turn flat at all in 900 mm corridors — it is stood on end, which is why 800 mm doors and tight stairs trap furniture. **In the sim**, choose users and see who passes a corridor and door, then carry furniture round a corner and find where it jams.

### Settings
- **Homes:** 900 mm corridors and 750–800 mm doors are usual; wider doors (850–900 mm) and level thresholds make a home usable for a wheelchair or a walking frame later in life.
- **Public buildings, offices, schools:** 1200–1800 mm corridors, 800–1000 mm doors, light doors or powered openers.
- **Hospitals and care homes (health):** beds, trolleys and hoists set the widths — double doors and wide corridors.
- **Workshops and plant (workshop):** doors and aisles sized for trolleys and forklifts, kept separate from walkways; access openings into machines follow ISO 15534 (see [[access-openings]]).
- **Military and field:** hatches, tents and vehicle doors must pass people wearing packs, armour and cold-weather clothing — add their bulk to the body.

> [!warn] Escape routes must stay clear of stored goods and furniture: the clear width that fire codes require is width that must exist on the day of the fire, not on the drawings.

> [!key] Size doors and corridors from the widest thing that moves through them — two people passing, a wheelchair, a bed or a sofa on its end — and pair narrow corridors with wider doors.
`,
  ideas: [
    'Doors and corridors are clearances, set by the widest user moving through them.',
    'A walking adult needs 600–650 mm, two passing 1100–1200 mm, a wheelchair 750–850 mm, a wheelchair and a walker about 1500 mm.',
    'Clear opening is 50–100 mm less than the door leaf; the US requires 815 mm, England about 800–1000 mm, Germany 900 mm.',
    'Handles about 850–1050 mm, opening forces about 22–30 N, vision panels from 500 to 1500 mm.',
    'Turning furniture round a corner is limited by its depth: L = (a^{2/3} + b^{2/3})^{3/2} for a thin pole, much less for a sofa.'
  ],
  pitfalls: [
    'An 800 mm door means 800 mm to pass — That is often the leaf; the clear opening with the door open is 50–100 mm less.',
    'If a wheelchair fits the corridor it fits the door — Turning in from a narrow corridor needs a wider door than going straight through.',
    'Any furniture that fits through the door can be delivered — The corners of the route decide; deep sofas must be stood on end to turn a 900 mm corner.'
  ],
  formulas: [
    {
      name: 'Longest pole round a right-angle corner',
      expr: 'L = (a^(2/3) + b^(2/3))^(3/2)', tex: 'L = \\left(a^{2/3} + b^{2/3}\\right)^{3/2}',
      vars: {
        L: { name: 'longest thin object that turns the corner (carried level)', q: 'length', unit: 'mm' },
        a: { name: 'width of the first corridor', q: 'length', unit: 'mm', value: 900 },
        b: { name: 'width of the second corridor or opening', q: 'length', unit: 'mm', value: 900 }
      },
      note: 'For a thin object. An object with plan depth w passes less: the minimum over angles of a/sin θ + b/cos θ − w/(sin θ cos θ).',
      stories: { L: 'A corridor {a} wide turns into one {b} wide. How long a plank can be carried level round the corner?', b: 'A {L} ladder must turn from a {a} corridor. How wide must the second corridor be?' }
    },
    {
      name: 'Corridor width for two users passing',
      expr: 'W = b1 + b2 + c', tex: 'W = b_1 + b_2 + c',
      vars: {
        W: { name: 'corridor clear width', q: 'length', unit: 'mm' },
        b1: { name: 'width of the first user moving', q: 'length', unit: 'mm', value: 630, tex: 'b_1' },
        b2: { name: 'width of the second user moving', q: 'length', unit: 'mm', value: 800, tex: 'b_2' },
        c: { name: 'clearance between and to the walls', q: 'length', unit: 'mm', value: 100 }
      },
      stories: { W: 'A walking adult needs {b1} and a wheelchair user {b2}. With {c} of clearance, how wide must the corridor be for them to pass?' }
    }
  ],
  examples: [
    {
      title: 'A ladder round a corner',
      q: 'How long a ladder can be carried level round a corner from a 1200 mm corridor into an 800 mm one? And between two 900 mm corridors?',
      steps: ['$1200^{2/3} = 112.9$ and $800^{2/3} = 86.2$; the sum is 199.1.', '$L = 199.1^{3/2} = 2809$ mm.', 'Two 900 mm corridors: $L = 900 \\times 2^{3/2} = 2546$ mm.'],
      a: 'About 2.8 m, and 2.5 m between two 900 mm corridors — for a thin object carried level.'
    },
    {
      title: 'A wheelchair meets a walker',
      q: 'The 95th-percentile man\'s shoulder breadth is 526 mm; allow 100 mm for sway. A wheelchair user needs 800 mm with hands on the rims. With 100 mm of clearance, what corridor lets them pass?',
      steps: ['Walker: $526 + 100 = 626$, about 630 mm.', '$W = 630 + 800 + 100 = 1530$ mm.', 'This is why 1500 mm is the usual corridor width where wheelchairs and walkers must pass freely.'],
      a: 'About 1.5 m.'
    }
  ],
  quiz: [
    { q: 'Which user limits the width of a corridor in a public building?', choices: ['The widest combination that must pass: a wheelchair and a walker, or two wheelchairs', 'The average adult', 'The smallest adult', 'The cleaning trolley only'], a: 0, why: 'A corridor is a clearance for everything that must pass along it at the same time.' },
    { q: 'Why can a narrow corridor need a wider door?', choices: ['A wheelchair turning in from a narrow corridor sweeps across the opening at an angle', 'Narrow corridors are darker', 'Doors in narrow corridors are heavier', 'It is only a matter of appearance'], a: 0, why: 'Turning through the opening needs more width than going straight through; codes such as England\'s pair the two widths.' },
    { q: 'Vision panels in doors should span roughly which heights?', choices: ['500–1500 mm', '1400–1800 mm', '0–500 mm', '1800–2000 mm'], a: 0, why: 'So that a child or a seated person as well as a standing adult is seen from the other side.' },
    { q: 'True or false: a deep sofa that fits through a 900 mm door can always be carried round a 900 mm corridor corner level.', a: false, why: 'The depth fills the corner: an object 900 mm deep cannot turn flat at all in 900 mm corridors; it must be stood on end.' }
  ],
  problems: [
    { q: 'How long a thin pole can be carried level round a corner between two 1000 mm corridors?', answer: 2828, unit: 'mm', tol: 0.01, steps: ['$L = (1000^{2/3} + 1000^{2/3})^{3/2} = 1000 \\times 2^{3/2} = 2828$ mm.'] }
  ],
  ranges: [
    { dim: 'Door clear opening width (public buildings)', range: [800, 1000], unit: 'mm', who: 'wheelchair users with hands on the rims (lower end); main entrances with people passing (upper end)', why: 'Everyone passes without turning sideways or scraping knuckles.', limits: 'US minimum 815 mm (32 in); England about 800–1000 mm by approach; Germany 900 mm; wider for beds and double doors in hospitals.', setting: ['civil', 'health', 'office', 'school'], src: '2010 ADA Standards; Approved Document M; DIN 18040' },
    { dim: 'Door clear opening width (homes)', range: [750, 900], unit: 'mm', who: 'a walking frame or wheelchair later in life (upper end)', why: 'Moving in and out, furniture, and later mobility aids.', limits: 'Narrow doors (under 750 mm) exclude most wheelchairs; pair narrow corridors with wider doors.', setting: 'civil', src: 'Approved Document M, Volume 1 (dwellings)' },
    { dim: 'Corridor clear width', range: [900, 1800], unit: 'mm', who: 'one person (900, homes) to two wheelchairs passing (1800)', why: 'People pass without stopping.', limits: 'Public buildings 1200 mm or more with passing places; 1500 mm for a wheelchair and a walker; hospitals more for beds.', setting: ['civil', 'health', 'office', 'school'], src: 'Approved Document M; 2010 ADA Standards (915 mm route, 1525 mm passing spaces)' },
    { dim: 'Door handle height', range: [850, 1050], unit: 'mm', who: 'standing adults (knuckle to elbow), children and seated wheelchair users (lower end)', why: 'Reached without stooping or stretching from standing and sitting.', limits: 'ADA allows 865–1220 mm; DIN 18040 uses 850 mm; lever handles, not knobs.', setting: ['civil', 'office', 'health'] },
    { dim: 'Door opening force', range: [null, 30], unit: 'N', who: 'older people, children and wheelchair users', why: 'Everyone can open the door unaided.', limits: 'ADA 22.2 N (5 lbf) for interior doors; England 30 N at the leading edge up to 30° of opening. Fire doors need hold-open devices or powered openers.', setting: ['civil', 'health', 'office'], src: '2010 ADA Standards; Approved Document M' },
    { dim: 'Vision panel zone in doors', range: [500, 1500], unit: 'mm', who: 'children and seated users (lower edge), standing adults (upper edge)', why: 'People on either side see each other before the door swings.', limits: 'England\'s guidance; a narrow panel still leaves blind spots.', setting: ['civil', 'office', 'health', 'school'], src: 'Approved Document M' },
    { dim: 'Threshold height', range: [null, 15], unit: 'mm', who: 'wheelchair castors, walking frames, shuffling feet', why: 'No trips and no wheel stops.', limits: 'ADA 13 mm (½ in), bevelled; external doors need weather detailing that still meets it.', setting: ['civil', 'health'] }
  ],
  applications: [
    'Checking a delivery route for a sofa or a piano: every door and every corner.',
    'Hospital corridors and doors sized for beds, hoists and passing staff.',
    'Adapting a home for a wheelchair: widening doors, removing thresholds, pairing corridor and door widths.',
    'Escape routes sized for the number of occupants and kept clear.'
  ],
  sources: [
    '2010 ADA Standards for Accessible Design: doors, doorways and gates; accessible routes; clear width and passing spaces.',
    'Approved Document M, *Access to and use of buildings*, Volumes 1 (dwellings) and 2 (buildings other than dwellings) (England).',
    'DIN 18040-1 and -2, accessible buildings: public buildings and dwellings (Germany).',
    'ISO 21542, *Building construction — Accessibility and usability of the built environment*.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapter on circulation.'
  ],
  sim: 'fs-corridor'
},

{
  id: 'counters-reception', parent: 'building-spaces', title: 'Counters and service desks', level: 2,
  short: 'A counter joins two people of any size across a surface: a standing customer, a wheelchair user or a child on one side, a seated or standing member of staff on the other. Standing and seated sections, depth and reach, and the sight line between two faces.',
  keywords: ['counter height', 'reception desk', 'service counter', 'transaction counter', 'lowered section', 'wheelchair accessible counter', 'knee space', 'check-in desk', 'bank counter', 'pharmacy counter', 'sight line', 'eye contact', 'induction loop', 'writing shelf'],
  prereq: ['standing-work-heights', 'sitting-dimensions', 'accessible-design'],
  related: ['retail-checkouts', 'office-layout', 'hospital-workstations', 'doors-corridors', 'storage-heights', 'hearing-protection', 'math:right-triangle-trig'],
  body: `
Every counter has two sides and two kinds of work. The **customer** stands, sits in a wheelchair, leans on a stick, or is a child; they sign, pay, hand over a document or a parcel, and talk. The **staff member** works there all day, usually at a screen, and must also talk, see and hand things across. A good counter serves both — which usually means two heights.

### The public side
- **Standing section, 950–1100 mm.** Writing and handling while standing work best 50–100 mm below the elbow: about 965–990 mm for the median woman and 1050–1075 mm for the median man (elbow heights with shoes). A counter at 1000–1050 mm is a fair compromise, and people lean on it with their forearms.
- **Lowered section, about 730–800 mm with knee space.** Wheelchair users, people of short stature, children and anyone who needs to sit need a section they can pull up to: a surface at about 750–800 mm with knee space at least about 685–700 mm high beneath. The 2010 ADA Standards ask that part of every sales or service counter be no higher than 915 mm (36 in) over at least 915 mm of its length, and England's Approved Document M asks for a lowered section at reception desks with a knee recess. A chair or a perch at the standing section helps people who cannot stand for long.
- **Depth and reach.** Documents, cards and parcels must cross the counter. The forward reach of a 5th-percentile woman is about 670 mm from her back, less than 600 mm from her shoulder; counters deeper than about 600–700 mm need a transaction tray, a pass-through, or staff who come round.

### The staff side
Staff usually sit at a work surface of 720–750 mm with a screen. Behind a 1050 mm public counter they sit in a pit: the counter top is at their chin, and a standing visitor looks down on them. The fixes:

1. **Split levels**: staff work at 720–750 mm; a narrow transaction shelf rises to about 1050–1100 mm at the front, hiding papers and screens while giving the visitor a writing ledge.
2. **Raised staff**: a platform, or high chairs (seat 650–750 mm) with a proper footrest, to bring the staff's eyes nearer the visitor's.
3. **Sit–stand desks** so staff can meet visitors standing.

### Faces and voices
The look between a seated receptionist and a standing visitor tilts up at

$$\\alpha = \\arctan\\frac{E_v - E_s}{d},$$

where $E_v$ and $E_s$ are the two eye heights and $d$ the distance between them (an [[?inverse-trig|inverse tangent]] of the height difference over distance). For a median man standing (eyes about 1665 mm with shoes) and a median woman seated on a 450 mm chair (eyes about 1190 mm) a metre apart, $\\alpha$ is about 25–28°: a strained look up, repeated all day. **In the sim**, choose a visitor and a staff position and watch the sight line and the reach across the counter.

People with hearing loss need a **hearing loop** (induction loop, IEC 60118-4) and a quiet position; people who lip-read need the staff member's face lit and not against a bright window. Glass security screens need speech transfer and a low transaction tray.

### Settings
- **Shops, banks, post offices, ticket offices (civil):** standing and lowered sections side by side, clear signs, loops.
- **Hospitals, pharmacies, clinics (health):** privacy (a screen or distance between queue and counter), seated sections for patients who cannot stand, space for wheelchairs and buggies.
- **Hotels and offices (office):** reception desks with two levels and room for luggage.
- **Workshops and stores (workshop):** tool-store and parts counters where heavy items cross — low enough to slide rather than lift, with a roller or shelf at knuckle height (see [[lifting-principles]]).
- **Military and field (military, field):** guard posts, issue counters and field check-points: people in armour and gloves, carrying equipment — larger reach margins and bigger surfaces.

> [!warn] Staff who sit behind high counters all day look up, reach up and lean forward for hours: split the levels or raise the staff seat with a footrest.

> [!key] Give every counter two heights — a standing section of about 950–1100 mm and a lowered section of about 750–800 mm with knee space — keep it shallow enough to reach across, and put the two faces as near the same height as you can.
`,
  ideas: [
    'A counter has two users with different postures; one height cannot serve both, so good counters have two levels.',
    'Standing sections work at 950–1100 mm; lowered sections at about 730–800 mm with knee space for wheelchair users, children and seated people.',
    'The ADA asks for part of every service counter to be at most 915 mm (36 in) high; England asks for a lowered section at reception desks.',
    'Counter depth is limited by the reach of small users: about 600–700 mm, or a tray or pass-through.',
    'The sight line between a seated receptionist and a standing visitor tilts by 25–30°; split levels or raised staff reduce it.'
  ],
  pitfalls: [
    'A counter at desk height serves wheelchair users — Only if there is knee space beneath; without it the user must reach sideways over the armrest.',
    'High counters make staff feel safe and cost nothing — The staff member pays with a day of looking and reaching up; split levels give the same screening.',
    'One accessible counter somewhere in the building is enough — The lowered section must be where the service is given, not at a separate desk nobody staffs.'
  ],
  formulas: [
    {
      name: 'Looking up across a counter',
      expr: 'alpha = atan((Ev - Es)/d)', tex: '\\alpha = \\arctan\\frac{E_v - E_s}{d}',
      vars: {
        alpha: { name: 'angle of the sight line above horizontal', q: 'angle', unit: '°', tex: '\\alpha' },
        Ev: { name: 'eye height of the visitor', q: 'length', unit: 'mm', value: 1665, tex: 'E_v' },
        Es: { name: 'eye height of the staff member', q: 'length', unit: 'mm', value: 1190, tex: 'E_s' },
        d: { name: 'horizontal distance between the eyes', q: 'length', unit: 'mm', value: 900 }
      },
      note: 'Eye heights: standing eye height plus shoes; seated, seat height plus eye height sitting.',
      stories: { alpha: 'A visitor\'s eyes are {Ev} high and the seated receptionist\'s {Es}, {d} apart. How steeply does the receptionist look up?', Es: 'To keep the look up to {alpha} for a visitor with eyes at {Ev}, {d} away, how high must the receptionist\'s eyes be?' }
    },
    {
      name: 'Standing counter height from elbow height',
      expr: 'H = E + s - d', tex: 'H = E + s - d',
      vars: {
        H: { name: 'counter height', q: 'length', unit: 'mm' },
        E: { name: 'elbow height standing, barefoot', q: 'length', unit: 'mm', value: 1015 },
        s: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25 },
        d: { name: 'drop below the elbow for writing and handling (50–100)', q: 'length', unit: 'mm', value: 75 }
      },
      stories: { H: 'A visitor\'s elbow is {E} barefoot, shoes add {s}. For writing {d} below the elbow, how high should the counter be?' }
    }
  ],
  examples: [
    {
      title: 'Receptionist and visitor',
      q: 'A median man stands at a counter: eye height 1640 mm plus 25 mm of shoe. The receptionist, a median woman, sits on a 450 mm chair with a seated eye height of 740 mm. Their eyes are 900 mm apart. How steep is her look up? What if she sits on a 650 mm high chair with a footrest?',
      steps: ['Visitor: $E_v = 1665$ mm. Receptionist: $E_s = 450 + 740 = 1190$ mm.', '$\\alpha = \\arctan(475 / 900) = 27.8°$.', 'On a 650 mm chair: $E_s = 1390$ mm; $\\alpha = \\arctan(275/900) = 17.0°$.'],
      a: 'About 28°, falling to 17° with the raised chair.'
    },
    {
      title: 'Two sections of one counter',
      q: 'Standing elbow heights are 1015 mm (median woman) and 1100 mm (median man). With 25 mm shoes and writing 75 mm below the elbow, what standing counter height suits each? What does a wheelchair user need?',
      steps: ['Woman: $1015 + 25 - 75 = 965$ mm. Man: $1100 + 25 - 75 = 1050$ mm.', 'A standing section at about 1000–1050 mm is the compromise.', 'A wheelchair user\'s seat is about 480 mm and the elbow about 240 mm above it: a surface near 730–800 mm, with knee space about 700 mm high.'],
      a: 'Standing about 1000–1050 mm; lowered about 750–800 mm with knee space.'
    }
  ],
  quiz: [
    { q: 'Why do good service counters have two heights?', choices: ['Standing customers and seated or wheelchair users need surfaces about 250–300 mm apart', 'To look modern', 'For storage underneath', 'Because staff are taller'], a: 0, why: 'Their elbows differ by about that much; one height serves one group badly.' },
    { q: 'What must a lowered counter section have besides a lower top?', choices: ['Knee space beneath, about 685–700 mm high', 'A higher stool', 'A glass screen', 'A footrest for staff'], a: 0, why: 'Without knee space a wheelchair user cannot pull in and must reach sideways.' },
    { q: 'How does a transaction shelf on a staff desk help?', choices: ['Staff work at desk height while the visitor gets a writing ledge at standing height', 'It raises the staff\'s eyes', 'It makes the counter deeper', 'It hides the visitor'], a: 0, why: 'Split levels suit both users and screen the staff\'s papers.' },
    { q: 'True or false: a deeper counter is always more secure and so better.', a: false, why: 'Beyond about 600–700 mm small users cannot reach across, so documents and payment become awkward; use trays or pass-throughs instead.' }
  ],
  problems: [
    { q: 'A standing visitor\'s eyes are at 1540 mm; a seated receptionist\'s at 1190 mm; they are 1000 mm apart. What is the angle of the receptionist\'s look up?', answer: 19.3, unit: '°', tol: 0.02, steps: ['$\\alpha = \\arctan(350/1000) = 19.3°$.'] }
  ],
  ranges: [
    { dim: 'Standing section of a service counter', range: [950, 1100], unit: 'mm', who: 'standing adults writing and handling 50–100 mm below the elbow', why: 'Signing, paying and handling without stooping or shrugging.', limits: 'Too high for children, people of short stature and wheelchair users — a lowered section is needed.', setting: ['civil', 'office', 'health'] },
    { dim: 'Lowered section of a service counter', range: [730, 800], unit: 'mm', who: 'wheelchair users, seated customers, people of short stature, children', why: 'They can pull in, write and see the staff member.', limits: 'Needs knee space; the ADA sets 915 mm (36 in) as the maximum for the accessible part of sales and service counters.', setting: ['civil', 'office', 'health'], src: '2010 ADA Standards; Approved Document M' },
    { dim: 'Knee space under a lowered counter', range: [685, null], unit: 'mm', who: 'wheelchair users\' knees (27 in in the ADA Standards)', why: 'The user pulls up close instead of reaching sideways.', limits: 'Keep it at least about 480 mm deep and clear of pipes and bins.', setting: ['civil', 'health'], src: '2010 ADA Standards' },
    { dim: 'Counter depth across which people pass things', range: [null, 700], unit: 'mm', who: 'forward reach of small users (5th-percentile woman about 670 mm from the back)', why: 'Documents and cards cross without stretching.', limits: 'Deeper or screened counters need a tray or pass-through.', setting: ['civil', 'office', 'health'] },
    { dim: 'Staff work surface behind a counter', range: [720, 750], unit: 'mm', who: 'seated staff at a screen', why: 'An office workstation for the working day (see desk-height ranges).', limits: 'Staff look up at standing visitors: raise the seat with a footrest or split the levels.', setting: 'office', src: 'EN 527-1 (office work tables)' },
    { dim: 'High staff chair at a counter (with footrest)', range: [650, 750], unit: 'mm', who: 'staff meeting standing visitors', why: 'Brings the staff\'s eyes towards the visitor\'s and the hands to the transaction level.', limits: 'A footrest about popliteal height below the seat is essential.', setting: ['office', 'civil'] }
  ],
  applications: [
    'Hotel, hospital and office reception desks with a standing ledge and a lowered section.',
    'Pharmacy and bank counters with privacy screens, trays and hearing loops.',
    'Ticket offices and information desks in stations.',
    'Tool stores and parts counters in workshops where heavy items cross.'
  ],
  sources: [
    '2010 ADA Standards for Accessible Design: sales and service counters, knee and toe clearance, reach ranges.',
    'Approved Document M, Volume 2, and BS 8300-2 (England and the UK): reception desks and counters.',
    'IEC 60118-4, *Electroacoustics — Hearing aids — Part 4: Induction-loop systems for hearing aid purposes — System performance requirements*.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, the chapter on retail and service spaces.',
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on standing work heights.'
  ],
  sim: 'fs-counter'
},

{
  id: 'storage-heights', parent: 'building-spaces', title: 'Shelves, cupboards and storage heights', level: 1,
  short: 'Where something is stored decides how people will reach it for years: frequent and heavy things between knuckle and shoulder height, light and rare things higher or lower, nothing that matters above the reach of the smallest user. Storage zones in ranges, reach over obstacles, and the reach ranges of wheelchair users.',
  keywords: ['shelf height', 'storage height', 'reach height', 'top shelf', 'golden zone', 'knuckle height', 'shoulder height', 'wardrobe rail height', 'reach over obstruction', 'wheelchair reach range', 'step stool', 'racking', 'picking heights', 'vertical multiplier'],
  prereq: ['functional-reach', 'standing-dimensions', 'lifting-principles'],
  related: ['kitchen-ergonomics', 'accessible-design', 'niosh-lifting-equation', 'material-flow-layout', 'reach-zones', 'design-for-range', 'working-at-height'],
  body: `
A shelf is a decision about posture made once and paid for every time something is taken from it. Put a heavy box on the floor and everyone who lifts it stoops; put the daily coffee on the top shelf and the smallest person in the house climbs on a chair for it. Storage heights follow three body heights — **knuckle**, **shoulder** and **grip reach** — and the reach of the smallest and least mobile users.

### The zones
Heights with 25 mm of shoe, from this app's representative adult body data:

| Zone | Height | Suits | Why |
|---|---|---|---|
| Out of reach | above about 1770–1800 mm | nothing needed without a step | above the 5th-percentile woman's grip reach, flat-footed |
| Stretch | shoulder (about 1260–1545 mm) to grip reach | light, occasionally used things | arms raised, loads far from the body, eyes cannot see the back of the shelf |
| **Best** | knuckle to shoulder, about **850–1250 mm** for everyone | frequent and heavy items | upright, arms low, load close to the body |
| Low | knee to knuckle (about 500–850 mm) | frequent light items, heavy items slid rather than lifted | a slight bend |
| Stoop | below about 500 mm | rarely used, or on rollers, drawers or pallets | deep bend or squat, the worst posture to lift from |

The best zone is where the two ends of the population overlap: above the knuckles of tall men (about 850 mm) and below the shoulders of small women (about 1260 mm). The [[niosh-lifting-equation|revised NIOSH lifting equation]] makes the same point numerically: its vertical multiplier $VM = 1 - 0.003\\,|V - 75|$ (with $V$ the hand height in cm) is 1 at 75 cm and falls to 0.78 at the floor and at 150 cm, cutting the recommended weight limit by more than a fifth.

### Who reaches the top shelf?
Reach is spread like any body dimension. With vertical grip reach normally distributed ([[?gaussian]] with [[?mean]] $\\mu$ and [[?standard-deviation|standard deviation]] $\\sigma$), the share of people who reach a shelf at height $h$ in shoes adding $a$ is

$$F = \\Phi\\!\\left(\\frac{\\mu + a - h}{\\sigma}\\right).$$

For women ($\\mu$ = 1910 mm, $\\sigma$ = 85 mm) and a shelf at 1800 mm, $F$ = 94 %; at 1900 mm, 66 %. For men almost all reach both. **Obstacles pull the reach down**: over a 600 mm worktop the fingers reach only about 1600–1730 mm (see [[kitchen-ergonomics]]), and deep shelves hide their back half from anyone below eye level. Keep high shelves shallow (about 300 mm) and put deep storage in drawers and pull-outs.

### Wheelchair users and seated reach
A seated person's shoulder is about 1000–1100 mm above the floor in a wheelchair, and many wheelchair users also have limited arm or trunk movement. The 2010 ADA Standards set reach ranges for them: **380–1220 mm (15–48 in)** for an unobstructed forward or side reach; over an obstruction 510–635 mm deep, a forward reach of at most **1120 mm (44 in)**; a side reach over a counter up to 610 mm deep and 865 mm high, at most about 1170 mm (46 in). Storage and controls for wheelchair users belong in roughly **400–1200 mm**, with knee space or a side approach. **In the sim**, drag the shelves, choose a standing person or a wheelchair user, and add a worktop in front.

### Settings
- **Homes:** everyday things in the best zone; high cupboards for the Christmas box; a stable step stool with a handle rather than a chair — falls from chairs and steps are a common injury in older people.
- **Offices and shops (office, civil):** files and stock at the heights of the people who use them most; heavy paper low but not on the floor.
- **Workshops, warehouses and stores (workshop):** frequent picks and heavy items at 850–1250 mm; the floor level only for pallets moved by truck; the top levels for slow movers served by a picking truck or step platform. Tools on shadow boards at elbow height.
- **Vehicles, military and field (vehicle, military, field):** stowage in vehicles and on field equipment is often forced into awkward heights — pull-out trays and load-assist devices make up for it; loads lifted onto trucks at tailgate height (about 1 m or more) are shoulder lifts.
- **Health and care:** medicines and supplies at heights all staff reach; hoists and aids stored where they are used.

> [!warn] Heavy things stored high fall on heads and pull people off balance; heavy things stored low hurt backs. Keep them between knuckle and shoulder height, and never above head height.

> [!key] Store by frequency and weight: the knuckle-to-shoulder band (about 850–1250 mm) for heavy and frequent items, nothing important above the smallest user's reach (about 1.77 m, less over a worktop), and 400–1200 mm for wheelchair users.
`,
  ideas: [
    'The best storage band, about 850–1250 mm, lies between tall people\'s knuckles and small people\'s shoulders.',
    'The NIOSH vertical multiplier is 1 at 75 cm and 0.78 at the floor and at 150 cm: storage height changes the safe weight.',
    'The share who reach a shelf is Φ((μ + a − h)/σ): at 1800 mm about 94 % of women, at 1900 mm about 62 %.',
    'Obstacles and depth pull the reach down; high shelves should be shallow.',
    'Wheelchair users reach about 380–1220 mm unobstructed (ADA); storage for them belongs in about 400–1200 mm.'
  ],
  pitfalls: [
    'If the tallest can reach it, the shelf is fine — Reach is limited by the smallest users; check the 5th-percentile woman, and the wheelchair user where they must use it.',
    'Heavy things belong on the floor, where they cannot fall — Lifting from the floor is the worst lift; store heavy items between knuckle and shoulder or on wheels.',
    'A shelf within reach height is reachable — Not over a worktop or at full depth: horizontal distance takes away height quickly.'
  ],
  formulas: [
    {
      name: 'Share of people who reach a shelf',
      expr: 'F = (1 + erf((mu + a - h)/(s*sqrt(2))))/2', tex: 'F = \\Phi\\!\\left(\\dfrac{\\mu + a - h}{\\sigma}\\right)',
      vars: {
        F: { name: 'share who can grip the shelf', q: 'ratio', unit: '%' },
        mu: { name: 'mean vertical grip reach', q: 'length', unit: 'mm', value: 1910, tex: '\\mu' },
        a: { name: 'shoe allowance', q: 'length', unit: 'mm', value: 25 },
        h: { name: 'shelf height', q: 'length', unit: 'mm', value: 1800 },
        s: { name: 'standard deviation of grip reach', q: 'length', unit: 'mm', value: 85, tex: '\\sigma' }
      },
      note: 'Flat-footed, nothing in front of the shelf. Φ is the standard normal distribution, Φ(z) = ½[1 + erf(z/√2)]. For a mixed population, weight the shares of men and women.',
      stories: { F: 'Women\'s vertical grip reach is {mu} ± {s}; shoes add {a}. What share can reach a shelf at {h}?', h: 'With grip reach {mu} ± {s} and {a} of shoe, how high may a shelf be for {F} of users to reach it?' }
    },
    {
      name: 'Reach height at a horizontal distance',
      expr: 'h = Sh + sqrt(A^2 - x^2)', tex: 'h = S_h + \\sqrt{A^2 - x^2}',
      vars: {
        h: { name: 'highest point the fingers can grip', q: 'length', unit: 'mm' },
        Sh: { name: 'shoulder height', q: 'length', unit: 'mm', value: 1330, tex: 'S_h' },
        A: { name: 'grip reach from the shoulder', q: 'length', unit: 'mm', value: 580 },
        x: { name: 'horizontal distance from the shoulder', q: 'length', unit: 'mm', value: 300, max: 579 }
      },
      note: 'Upright, flat-footed, a rigid arm from the shoulder. For a seated user use the seated shoulder height.',
      stories: { h: 'A shoulder is {Sh} high and the grip reach from it {A}. How high can the hand reach {x} in front?' }
    }
  ],
  examples: [
    {
      title: 'How high is the top shelf allowed to be?',
      q: 'Women\'s vertical grip reach is 1910 ± 85 mm, men\'s 2060 ± 90 mm; shoes add 25 mm. What share of each reaches a shelf at 1800 mm, and at 1900 mm?',
      steps: ['Women at 1800 mm: $z = (1910 + 25 - 1800)/85 = 1.59$, $F = 94$ %.', 'Women at 1900 mm: $z = 35/85 = 0.41$, $F = 66$ %: raising the shelf by 100 mm leaves a third of women out.', 'Men at 1900 mm: $z = 185/90 = 2.06$, $F = 98$ %.'],
      a: 'About 94 % of women at 1800 mm but only about two thirds at 1900 mm; nearly all men reach both.'
    },
    {
      title: 'The same box, stored at three heights',
      q: 'Using the NIOSH vertical multiplier VM = 1 − 0.003 |V − 75| (V in cm), compare a box lifted from the floor (V = 0), from 75 cm and from 150 cm.',
      steps: ['Floor: $VM = 1 - 0.003 \\times 75 = 0.775$.', '75 cm: $VM = 1$.', '150 cm: $VM = 1 - 0.003 \\times 75 = 0.775$.', 'With every other factor ideal the recommended weight limit falls from 23 kg to about 17.8 kg at the floor and at shoulder height.'],
      a: 'Storing at knuckle height rather than on the floor raises the recommended limit by about 29 %.'
    }
  ],
  quiz: [
    { q: 'Which band suits heavy, frequently used items for a mixed population?', choices: ['About 850–1250 mm, between tall people\'s knuckles and small people\'s shoulders', 'The floor', 'Above 1800 mm', 'Below the knee'], a: 0, why: 'In that band everyone lifts upright with the arms low and the load close.' },
    { q: 'Whose reach limits the top shelf in a shared kitchen or store?', choices: ['The smallest user — typically a 5th-percentile woman', 'The tallest user', 'The average user', 'Whoever installs it'], a: 0, why: 'Reach is a "nobody too small" case: if the smallest reaches it, everyone does.' },
    { q: 'What do the 2010 ADA Standards give as the unobstructed reach range for wheelchair users?', choices: ['380–1220 mm (15–48 in)', '600–1800 mm', '0–900 mm', '1000–1600 mm'], a: 0, why: 'Forward or side reach with nothing in the way; over obstructions the upper limit drops.' },
    { q: 'True or false: a worktop in front of a shelf lowers the height people can reach.', a: true, why: 'The reach becomes h = S_h + √(A² − x²): each extra 100 mm of distance near the end of the arm takes away much more height.' }
  ],
  problems: [
    { q: 'With women\'s grip reach 1910 ± 85 mm and 25 mm of shoe, what share of women can reach a shelf at 1850 mm? Give a percentage.', answer: 84.1, unit: '%', tol: 0.02, steps: ['$z = (1910 + 25 - 1850)/85 = 1.0$.', '$\\Phi(1.0) = 0.841$, about 84 %.'] }
  ],
  ranges: [
    { dim: 'Best band for heavy and frequent items', range: [850, 1250], unit: 'mm', who: 'above the knuckles of tall men (about 850 mm), below the shoulders of small women (about 1260 mm), with shoes', why: 'Upright lifting, load close to the body, eyes on the item.', limits: 'Narrow: most storage must use the zones around it for lighter or rarer items.', setting: ['civil', 'workshop', 'office', 'health'], src: 'This app\'s representative adult body data (Tools → Body sizes); the revised NIOSH lifting equation (vertical multiplier)' },
    { dim: 'Highest shelf for occasional use, nothing in front', range: [null, 1770], unit: 'mm', who: '5th-percentile woman\'s vertical grip reach, flat-footed', why: 'Almost everyone reaches it without a step.', limits: 'Over a worktop about 1600 mm; heavy items never up here.', setting: ['civil', 'workshop', 'office'], src: 'Pheasant and Haslegrave, Bodyspace' },
    { dim: 'Lowest shelf for regular use', range: [500, null], unit: 'mm', who: 'knee height and above, for users who should not stoop or squat', why: 'Avoids deep bends, especially for older people and heavy items.', limits: 'Below it use drawers, pull-outs or rarely used items.', setting: ['civil', 'workshop', 'health'] },
    { dim: 'Depth of shelves above shoulder height', range: [null, 300], unit: 'mm', who: 'small users reaching up and forward, who cannot see the back', why: 'Everything on the shelf can be seen and reached.', limits: 'Deep storage belongs lower, in drawers or pull-outs.', setting: ['civil', 'workshop'] },
    { dim: 'Wheelchair users\' reach range (unobstructed)', range: [380, 1220], unit: 'mm', who: 'wheelchair users, including those with limited arm and trunk movement', why: 'Storage and controls usable from a seated position, forward or sideways.', limits: 'Over an obstruction 510–635 mm deep the upper limit falls to 1120 mm (44 in); many users reach less than the maximum.', setting: ['civil', 'health', 'office'], src: '2010 ADA Standards (15–48 in)' },
    { dim: 'Wardrobe rail height (standing users)', range: [1600, 1750], unit: 'mm', who: 'grip reach of small users (upper end) and the length of long garments (lower end)', why: 'Hangers reached flat-footed; coats clear the floor.', limits: 'For wheelchair users a rail at about 1200–1400 mm or a pull-down rail.', setting: 'civil' }
  ],
  applications: [
    'Kitchen and pantry layouts: daily items at the front of the best zone.',
    'Warehouse slotting: fast movers and heavy items in the golden zone, slow movers high.',
    'Workshop tool boards and bins at the bench user\'s knuckle-to-shoulder band.',
    'Accessible storage in hotel rooms and homes: rails, shelves and controls within 400–1200 mm.'
  ],
  sources: [
    'S. Pheasant and C. M. Haslegrave, *Bodyspace*, on reach and storage.',
    'T. R. Waters, V. Putz-Anderson, A. Garg and L. J. Fine, "Revised NIOSH equation for the design and evaluation of manual lifting tasks", *Ergonomics*, 1993, and the NIOSH *Applications Manual* (1994).',
    '2010 ADA Standards for Accessible Design: reach ranges and storage.',
    'ISO 7250-1: vertical grip reach, shoulder and knuckle heights.',
    'J. Panero and M. Zelnik, *Human Dimension and Interior Space*, on storage.'
  ],
  sim: 'fs-storage'
},

{
  id: 'accessible-design', parent: 'building-spaces', title: 'Accessible design', level: 2,
  short: 'Accessible design extends the design range to people who use wheelchairs, walk with aids, see or hear little, have limited reach, grip or stamina — and usually makes spaces better for everyone. Wheelchair sizes and turning space, reach ranges, controls, contrast and signs, and how ISO 21542, the 2010 ADA Standards and national rules set them.',
  keywords: ['accessibility', 'accessible design', 'universal design', 'inclusive design', 'wheelchair turning circle', '1500 mm', 'T-turn', 'clear floor space', 'reach range', 'ISO 21542', 'ADA', 'Approved Document M', 'DIN 18040', 'SI 1918', 'visual contrast', 'tactile paving', 'hearing loop', 'lift size', 'EN 81-70'],
  prereq: ['disability-inclusive', 'design-for-range', 'doors-corridors'],
  related: ['ramps-accessibility', 'bathroom-ergonomics', 'storage-heights', 'counters-reception', 'stairs-ergonomics', 'age-children-elderly', 'information-design', 'medicine:vision', 'medicine:stroke'],
  body: `
Around one person in six worldwide lives with a significant disability (WHO, 2022), and far more have a temporary or situational one — a broken leg, a buggy, heavy luggage, age. Accessible design treats these people as part of the design range rather than exceptions. Its central idea, from the **social model of disability**, is that a step or a narrow door disables people; remove the barrier and the disability in that place shrinks. **Universal design** (Ron Mace and colleagues at North Carolina State University set out seven principles in 1997) goes further: one design, usable by all, without adaptation.

### Wheelchairs set many dimensions
A manual wheelchair is typically 600–700 mm wide and 1000–1200 mm long; ISO 7193 gives an envelope of about 700 × 1200 mm that most chairs fit. The seat is near 480 mm, the user's eyes about 1100–1300 mm and shoulders about 1000–1100 mm above the floor. From these come:

- **Clear width** of 800–900 mm or more through doors and 1500 mm to pass (see [[doors-corridors]]).
- **A clear floor space** of about 760 × 1220 mm (30 × 48 in in the ADA Standards) in front of or beside anything a person must use.
- **A turning space**: a **1500 mm circle** in ISO 21542 and most national rules (1525 mm, 60 in, in the ADA, which also accepts a T-shaped space).

Why 1500 mm? If a manual chair spun on the spot about the middle of its drive axle, its footplates would sweep a circle of diameter

$$D = 2\\sqrt{(L - a)^2 + (W/2)^2},$$

where $L$ is the chair's length, $W$ its width and $a$ the distance from the back to the axle — about 1.7 m for a typical 1100 × 650 mm chair ([[math:pythagorean-theorem|Pythagoras]] in the plan, then a [[?square-root|square root]]). Users manage in about 1.5 m by moving forwards and back as they turn. Mid-wheel-drive powered chairs pivot near their centre and turn in much less; large powered chairs and scooters need more. **In the sim**, choose a chair and watch its pivot circle against the standard space.

### Reach, controls and operation
- **Reach ranges** for wheelchair users: 380–1220 mm (15–48 in) unobstructed in the ADA; controls, switches, sockets and entry phones therefore sit in bands such as **450–1200 mm** (England's Approved Document M for switches and sockets) or about 800–1100 mm for the controls people use most.
- **Operable with one hand, without tight grasping, pinching or twisting of the wrist**, and with little force — the ADA's limit is 22.2 N (5 lbf). Lever handles, large push buttons, push-pad door openers.
- **Knee space** under basins, counters, tables and desks: at least about 685 mm high.

### Seeing, hearing and finding the way
- **Visual contrast** between floors, walls, doors, handrails and nosings — UK guidance asks for a difference in light reflectance value of at least 30 points; glare-free, even light.
- **Tactile walking surface indicators** at crossings and stair tops (ISO 23599), raised and Braille signs at doors, and consistent layouts.
- **Hearing loops** at counters and in meeting rooms (IEC 60118-4), visual fire alarms, good acoustics.
- **Lifts** with cars big enough for a wheelchair and companion: EN 81-70 describes cars from about 1000 × 1250 mm (a wheelchair user alone) through 1100 × 1400 mm (with a companion) to 2000 × 1400 mm (room to turn).

### Rules by country
| Where | Main rule | Character |
|---|---|---|
| International | ISO 21542:2021 | recommendations for the built environment, used as a basis for national rules |
| European Union | EN 17210:2021 | functional requirements for accessibility of the built environment |
| United States | 2010 ADA Standards for Accessible Design | enforceable civil-rights standard, exact dimensions in inches |
| England (UK) | Approved Document M, BS 8300 | building regulations and a code of practice; homes in three levels, M4(1)–M4(3) |
| Germany | DIN 18040-1/-2/-3 | public buildings, dwellings, public spaces |
| Israel | SI 1918 | accessibility of the built environment, in several parts |
| Australia / Canada | AS 1428.1 / CSA B651 | national design standards |

The numbers are close — 1500 mm circles, about 800–900 mm doors, 1:12 to 1:20 ramps — but not the same; always design to the rule where the building stands, and to the users who will actually be there.

### Settings
Public buildings, transport and workplaces are covered by law in most countries (civil, office); workplaces must also make **reasonable adjustments** for individual employees (the US ADA, the UK Equality Act 2010). Homes can be **visitable, adaptable or wheelchair-ready** (England's M4(1), M4(2), M4(3)). Health buildings serve the most people with impairments of all. Schools serve children with disabilities and parents who use wheelchairs. Military and field settings are rarely designed for disability, but veterans' services, rehabilitation and field hospitals are.

> [!warn] A separate "accessible" entrance at the back, a platform lift that is always switched off, or an accessible toilet used as a store fails the people it is for. Accessibility is a property of the building in use, not of the drawings.

> [!key] Design for the full range: 1500 mm to turn, 800–900 mm doors, controls within 450–1200 mm that work with one hand, contrast, loops and lifts — and follow the national rule where you build.
`,
  ideas: [
    'About one person in six lives with a significant disability; many more have temporary or situational ones.',
    'Wheelchairs (about 600–700 × 1000–1200 mm) set clear widths, clear floor spaces and the 1500 mm turning circle.',
    'A pivot turn would need about 1.7 m for a typical manual chair; users manage 1.5 m by moving while turning.',
    'Controls within about 450–1200 mm, usable with one hand and little force; knee space under surfaces.',
    'ISO 21542, EN 17210, the ADA Standards, Approved Document M, DIN 18040 and SI 1918 agree in spirit but differ in numbers.'
  ],
  pitfalls: [
    'Accessible design is for a small minority — It serves wheelchair users, older people, parents with buggies, people with luggage or injuries — a large share of any population at some time.',
    'Meeting the code means the building is accessible — Codes are minimums; furniture, storage, heavy doors and poor management often defeat a compliant design.',
    'A 1500 mm circle suits every wheelchair — It suits most manual chairs; large powered chairs and scooters need more, and a pivot turn needs more still.'
  ],
  formulas: [
    {
      name: 'Circle swept by a wheelchair turning on the spot',
      expr: 'D = 2*sqrt((L - a)^2 + (W/2)^2)', tex: 'D = 2\\sqrt{(L - a)^2 + \\left(\\frac{W}{2}\\right)^2}',
      vars: {
        D: { name: 'diameter of the swept circle', q: 'length', unit: 'mm' },
        L: { name: 'overall length of the chair (with footplates)', q: 'length', unit: 'mm', value: 1100 },
        a: { name: 'distance from the back of the chair to the pivot (drive axle)', q: 'length', unit: 'mm', value: 300, max: 550 },
        W: { name: 'overall width of the chair', q: 'length', unit: 'mm', value: 650 }
      },
      note: 'The front corners sweep the largest circle when the pivot is behind the middle. The user\'s feet and hands add to it.',
      stories: { D: 'A wheelchair is {L} long and {W} wide, with its drive axle {a} from the back. What circle does it sweep turning on the spot?' }
    }
  ],
  examples: [
    {
      title: 'Two chairs turning',
      q: 'A manual chair is 1100 × 650 mm with its axle 300 mm from the back. A mid-wheel-drive powered chair is 1050 × 640 mm, pivoting 525 mm from the back. What circles do they sweep turning on the spot?',
      steps: ['Manual: $D = 2\\sqrt{800^2 + 325^2} = 2 \\times 863 = 1727$ mm.', 'Mid-wheel drive: $D = 2\\sqrt{525^2 + 320^2} = 2 \\times 615 = 1230$ mm.', 'The manual chair user needs a shuffle-turn to manage within 1500 mm; the mid-wheel chair turns freely.'],
      a: 'About 1.73 m and 1.23 m.'
    },
    {
      title: 'A light switch at 1400 mm',
      q: 'An old building has switches at 1400 mm. Are they within the ADA\'s unobstructed reach range of 380–1220 mm, and England\'s 450–1200 mm band for switches?',
      steps: ['1400 mm is 180 mm above the ADA\'s upper limit and 200 mm above England\'s band.', 'Moving them to about 1000–1100 mm puts them within reach of both standing and seated users.'],
      a: 'No; lower them to about 1000–1100 mm.'
    }
  ],
  quiz: [
    { q: 'What is the standard turning space for a wheelchair in most rules?', choices: ['A 1500 mm circle (1525 mm in the ADA)', 'A 900 mm circle', 'A 2500 mm circle', 'A 1000 × 1000 mm square'], a: 0, why: 'It suits most manual wheelchair users, who combine rotation with small forward and back moves.' },
    { q: 'Which idea does the social model of disability express?', choices: ['Barriers in the environment disable people; removing them reduces disability', 'Disability is only a medical problem', 'Only people with disabilities benefit from accessible design', 'Buildings cannot change disability'], a: 0, why: 'A step disables a wheelchair user; a ramp or a level entrance removes that disability in that place.' },
    { q: 'Why do mid-wheel-drive powered chairs turn in less space?', choices: ['They pivot near the middle, so no corner is far from the pivot', 'They are always smaller', 'They have no footplates', 'They turn faster'], a: 0, why: 'The swept circle is set by the farthest corner from the pivot; a central pivot halves the longest distance.' },
    { q: 'True or false: accessibility rules are the same in every country.', a: false, why: 'ISO 21542 is international guidance; the US, England, Germany, Israel and others set their own, similar but different, numbers.' }
  ],
  problems: [
    { q: 'A chair is 1200 mm long and 700 mm wide (the ISO 7193 envelope) with its pivot 300 mm from the back. What circle does it sweep turning on the spot?', answer: 1931, unit: 'mm', tol: 0.01, steps: ['$D = 2\\sqrt{900^2 + 350^2} = 2\\sqrt{932500} = 2 \\times 965.7 = 1931$ mm.'] }
  ],
  ranges: [
    { dim: 'Wheelchair turning space', range: [1500, null], unit: 'mm', who: 'manual wheelchair users turning 360° with small forward and back moves', why: 'Turning round in toilets, lobbies, lifts and rooms without help.', limits: 'Large powered chairs and scooters need more; the ADA uses 1525 mm or a T-shape.', setting: ['civil', 'health', 'office', 'school'], src: 'ISO 21542; 2010 ADA Standards; Approved Document M' },
    { dim: 'Clear floor space for one wheelchair', range: '760 × 1220 mm or more', who: 'a wheelchair and its user, forward or parallel to what they use', why: 'Room to pull up to a basin, a counter, a control or a bed.', limits: 'ADA figure (30 × 48 in); other rules use similar or slightly larger spaces.', setting: ['civil', 'health', 'office'], src: '2010 ADA Standards' },
    { dim: 'Height of switches and sockets', range: [450, 1200], unit: 'mm', who: 'wheelchair users and people who cannot bend or stretch', why: 'Reached from sitting and standing without stooping or stretching.', limits: 'England\'s band; controls used often are better at about 800–1100 mm.', setting: ['civil', 'office', 'health'], src: 'Approved Document M (England)' },
    { dim: 'Reach range for operable parts (unobstructed)', range: [380, 1220], unit: 'mm', who: 'wheelchair users, forward or side reach', why: 'Controls and storage usable from a seated position.', limits: 'Over obstructions the upper limit falls to 1120–1170 mm.', setting: ['civil', 'office', 'health'], src: '2010 ADA Standards (15–48 in)' },
    { dim: 'Force to operate controls and hardware', range: [null, 22.2], unit: 'N', who: 'people with weak grip or limited dexterity, older people, children', why: 'Everyone can operate it with one hand.', limits: 'ADA limit (5 lbf); door rules differ (about 22–30 N).', setting: ['civil', 'office', 'health'], src: '2010 ADA Standards' },
    { dim: 'Knee space under surfaces for seated users', range: [685, null], unit: 'mm', who: 'wheelchair users\' knees (27 in)', why: 'Pulling up close to basins, desks, counters and tables.', limits: 'Pipes and aprons often steal it; check the depth too.', setting: ['civil', 'health', 'office', 'school'], src: '2010 ADA Standards' },
    { dim: 'Lift car size', range: '1100 × 1400 mm or more', who: 'a wheelchair user with a companion', why: 'Enter forwards, leave backwards or turn, with a companion or a buggy.', limits: 'A car of about 2000 × 1400 mm allows turning inside; small existing lifts often exclude wheelchairs.', setting: ['civil', 'health', 'office'], src: 'EN 81-70 (accessibility to lifts)' }
  ],
  applications: [
    'Designing public buildings to the national rule and ISO 21542, then testing with disabled users.',
    'Adaptable homes that can take a wheelchair, a stairlift or a through-floor lift later.',
    'Workplace adjustments for an individual employee: desk, route, toilet, controls.',
    'Hospitals and care homes designed around wheelchairs, hoists and people with sensory impairments.'
  ],
  history: 'Accessibility standards began with the American standard ANSI A117.1 (1961), which grew from work with disabled veterans. The Architectural Barriers Act (1968) and the Americans with Disabilities Act (1990) made them law in the US; Ron Mace coined "universal design" and, with colleagues, published its seven principles in 1997. ISO 21542 appeared in 2011 and was revised in 2021.',
  sources: [
    'ISO 21542:2021, *Building construction — Accessibility and usability of the built environment*.',
    'EN 17210:2021, *Accessibility and usability of the built environment — Functional requirements*.',
    '2010 ADA Standards for Accessible Design (US Department of Justice).',
    'Approved Document M (England) and BS 8300-1 and -2, *Design of an accessible and inclusive built environment*.',
    'DIN 18040-1, -2 and -3 (Germany); SI 1918 (Israel); AS 1428.1 (Australia); CSA B651 (Canada).',
    'ISO 7193, *Wheelchairs — Maximum overall dimensions*; EN 81-70, *Safety rules for the construction and installation of lifts — Accessibility to lifts for persons including persons with disability*.',
    'World Health Organization, *Global report on health equity for persons with disabilities* (2022).',
    'The Center for Universal Design, North Carolina State University, *The Principles of Universal Design* (1997).'
  ],
  sim: ['fs-access', { id: 'fs-storage', params: { user: 'wheelchair' } }, 'fs-ramp']
}

);
