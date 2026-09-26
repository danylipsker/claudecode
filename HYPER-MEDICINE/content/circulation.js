/* HYPER-MEDICINE · content/circulation.js — blood vessels and blood flow (the blood-pressure concept of
 * this topic is the reference, in content/reference.js). Simulations in sims/cardio.js. */
Hyper.add(

{
  id: 'blood-vessels', parent: 'circulation', title: 'Arteries, veins and capillaries', level: 1,
  short: 'The tubes of the circulation, each built for its job: elastic arteries that smooth the pulse, muscular arterioles that steer the flow, capillaries one cell thick where exchange happens, and veins that return the blood and hold most of it.',
  keywords: ['blood vessels', 'artery', 'arteriole', 'capillary', 'vein', 'venule', 'aorta', 'lymphatic', 'oedema', 'edema', 'Starling forces', 'oncotic pressure', 'windkessel', 'aneurysm', 'varicose veins', 'deep vein thrombosis', 'muscle pump', 'endothelium'],
  prereq: ['heart-anatomy', 'physics:pressure', 'body-fluids'],
  related: ['hemodynamics', 'blood-pressure', 'atherosclerosis', 'pulmonary-embolism', 'physics:continuity-equation', 'physics:surface-tension'],
  body: `
Press on the inside of your wrist and you feel an artery throb; look at the back of your hand and you see bluish veins that do not. Between the two, invisible, run capillaries so narrow that red cells pass through them in single file. Laid end to end, a much-quoted estimate puts all the body's vessels at around 100 000 km — the true figure is uncertain, but most of it is capillaries. None of these vessels is a passive pipe: each kind is built for a particular job.

### From aorta to vein
| Vessel | Inside diameter | Wall | Job |
|---|---|---|---|
| Aorta and large arteries | about 2.5 cm down to a few mm | thick and elastic | carry blood away at high pressure and smooth the pulses |
| Small arteries and arterioles | under 0.3 mm down to 10–20 µm | thick muscle for their size | set the resistance and steer blood between organs |
| Capillaries | 5–10 µm | a single layer of cells | exchange oxygen, nutrients, wastes and water |
| Venules and veins | 20 µm up to about 3 cm (venae cavae) | thin, with valves in the limbs | return blood to the heart and store most of it |

All of them are lined by the **endothelium**, a single sheet of cells that is far from inert: it releases nitric oxide and other signals that relax the muscle around it, and keeps blood from clotting on the wall. Damage to it is the first step of [[atherosclerosis]].

**Arteries** have thick walls of elastic fibres and smooth muscle. With each beat the aorta stretches and stores some of the energy, then recoils while the heart refills and keeps blood moving — the *windkessel* effect, much like a capacitor smoothing a pulsing current ([[electronics:capacitors|capacitors]]). With age the elastic fibres stiffen, which is why systolic pressure and pulse pressure rise in later life ([[blood-pressure]]).

**Arterioles** hold most of the resistance of the circulation and the biggest fall in pressure ([[hemodynamics]]). Their muscular walls tighten or relax in response to nerves, hormones and local signals — carbon dioxide, acidity, lack of oxygen and nitric oxide all open them — and so they decide which organs get the blood: muscles in exercise, the gut after a meal, the skin on a hot day.

**Capillaries** are the reason the whole system exists. Their walls are one cell thick, and there are so many — billions — that hardly any cell is more than a few cells' width from one. Their combined cross-section is several hundred times that of the aorta, so blood slows from about 20 cm/s in the aorta to a fraction of a millimetre per second in them, giving it about a second to exchange gases and nutrients ([[physics:continuity-equation|the continuity equation]]).

**Veins** have thin walls and low pressure, and at any moment they hold about two-thirds of the blood — a reservoir that can be squeezed to send more blood to the heart. In the legs, one-way valves and the squeezing of the calf muscles (the *muscle pump*) push blood upward against gravity; standing still for a long time lets it pool, which is why soldiers standing to attention sometimes faint.

### Water in and out: the Starling forces
Water crosses the capillary wall under two opposing pressures. The blood pressure inside the capillary — about 30 mmHg where it begins and 15 mmHg where it ends — pushes fluid out; the pull of the proteins in the plasma, chiefly albumin (the **oncotic pressure**, about 25 mmHg), holds it in. More leaves than comes back, and the **lymphatic vessels** return the excess, several litres a day, to the veins. In the classic picture fluid leaves at the start of the capillary and returns at the end; more recent measurements suggest that in most tissues little returns directly and the lymph carries nearly all of it back. Either way, swelling (**oedema**) appears when the balance tips: high venous pressure in [[heart-failure]], too little albumin in liver or kidney disease or malnutrition, leaky capillaries in inflammation, or blocked lymphatics.

### The wall and its tension
The tension in a vessel's wall grows with the pressure and the radius — Laplace's law, $T = P\\,r$. With its tiny radius a capillary withstands the blood pressure with a wall one cell thick, while the aorta needs a thick, tough one. The same law explains why an **aneurysm**, a ballooned artery, is dangerous: the wider it gets, the greater the tension in its thinning wall, so it tends to keep growing until it may burst.

### What goes wrong
- **Atherosclerosis**, fatty plaque in artery walls — the root of most heart attacks and strokes ([[atherosclerosis]]).
- **Aneurysm**, most often of the abdominal aorta in older men who have smoked. Several countries, the UK among them, offer men a one-off ultrasound screen at about 65.
- **Varicose veins**: leaky valves let blood pool in stretched surface veins of the legs — common, and mostly a nuisance.
- **Deep vein thrombosis**: a clot in a deep leg vein, which can break off and lodge in the lungs ([[pulmonary-embolism]]).
- **Vasculitis**: inflammation of the vessel walls, usually autoimmune.

> [!warn] Call your local emergency number for sudden, severe chest or back pain that feels like tearing (a possible tear in the aorta); sudden severe pain in the abdomen or back with faintness, especially in someone with an aneurysm; or sudden breathlessness or chest pain after a painful, swollen leg (a possible clot in the lung). A painful, swollen, warm calf on its own should be seen by a doctor the same day.
`,
  ideas: [
    'Arteries are elastic and smooth the pulse; arterioles are muscular and set the resistance; capillaries exchange; veins return blood and hold about two-thirds of it.',
    'Blood slows enormously in the capillaries because their combined cross-section is huge — flow = speed × area.',
    'Fluid leaves capillaries pushed by blood pressure and is held back by the oncotic pull of plasma proteins; the lymphatics return the excess.',
    'Oedema follows high venous pressure, low albumin, leaky capillaries or blocked lymph.',
    'Wall tension grows with radius (Laplace), so capillaries can be thin-walled and aneurysms tend to keep growing.'
  ],
  pitfalls: [
    'Veins carry blue blood — Venous blood is dark red. Veins look blue through the skin because of the way skin scatters and absorbs light of different colours.',
    'Blood flows fastest in the narrowest vessels, like water from a nozzle — Each capillary is narrow, but there are so many that their total cross-section is hundreds of times that of the aorta, so blood moves slowest there.',
    'Swollen ankles always mean a heart problem — Oedema can come from standing, heat, some medicines, vein problems, low albumin, kidney or liver disease, as well as heart failure.'
  ],
  formulas: [
    {
      name: 'Speed of flow and cross-section (continuity)',
      expr: 'v = Q/A', tex: 'v = \\frac{Q}{A}',
      vars: {
        v: { name: 'mean speed of the blood', q: 'speed', unit: 'cm/s' },
        Q: { name: 'blood flow', q: 'flowrate', unit: 'L/min', value: 5 },
        A: { name: 'total cross-section of the vessels', q: 'area', unit: 'cm²', value: 4.9 }
      },
      note: 'The same flow passes through every level of the circulation, so the speed falls where the total cross-section is large. The aorta is about 4.9 cm² across; all the capillaries together some 2 500–3 000 cm² (estimates vary).',
      practice: { unknowns: ['v', 'A'] },
      stories: { v: 'The cardiac output of {Q} passes through vessels with a total cross-section of {A}. How fast does the blood move on average?', A: 'Blood moves at {v} through a set of vessels carrying {Q}. What is their total cross-section?' }
    },
    {
      name: 'Net filtration pressure (Starling)',
      expr: 'NFP = (Pc - Pi) - (oc - oi)', tex: '\\text{NFP} = (P_c - P_i) - (\\pi_c - \\pi_i)',
      vars: {
        NFP: { name: 'net pressure pushing fluid out', q: 'pressure', unit: 'mmHg', signed: true, tex: '\\text{NFP}' },
        Pc: { name: 'blood pressure in the capillary', q: 'pressure', unit: 'mmHg', value: 32, tex: 'P_c' },
        Pi: { name: 'pressure in the tissue fluid', q: 'pressure', unit: 'mmHg', value: -2, signed: true, tex: 'P_i' },
        oc: { name: 'oncotic pressure of the plasma', q: 'pressure', unit: 'mmHg', value: 25, tex: '\\pi_c' },
        oi: { name: 'oncotic pressure of the tissue fluid', q: 'pressure', unit: 'mmHg', value: 5, tex: '\\pi_i' }
      },
      note: 'Positive: fluid leaves the capillary; negative: it is drawn back. A simplified Starling equation (the full one weights the oncotic term by how well the wall holds back protein). Real tissue values vary, and the net return at the venous end is now thought to be small in most tissues.',
      practice: { unknowns: ['NFP'] },
      stories: { NFP: 'In a capillary the blood pressure is {Pc}, the tissue pressure {Pi}, and the oncotic pressures are {oc} in the plasma and {oi} in the tissue. What is the net filtration pressure, and which way does fluid move?' }
    },
    {
      name: 'Wall tension in a vessel (Laplace)',
      expr: 'T = P*r', tex: 'T = P\\,r',
      vars: {
        T: { name: 'wall tension (force per unit length of wall)', q: 'surfacetension', unit: 'N/m' },
        P: { name: 'pressure inside', q: 'pressure', unit: 'mmHg', value: 100 },
        r: { name: 'radius of the vessel', q: 'length', unit: 'cm', value: 1.25 }
      },
      note: 'For a cylinder. The stress in the wall material is T divided by the wall thickness, which is why a wider or thinner vessel is under more strain.',
      practice: { unknowns: ['T'] },
      stories: { T: 'An artery of radius {r} holds a mean pressure of {P}. What tension does its wall bear?' }
    }
  ],
  examples: [
    {
      title: 'From racing to crawling',
      q: 'At rest 5 L of blood a minute passes through the aorta (cross-section 4.9 cm²) and then, lower down, through all the capillaries together (about 3 000 cm²). Find the mean speed in each.',
      steps: [
        'Flow: $5\\ \\text{L/min} = 5000\\ \\text{cm}^3 / 60\\ \\text{s} = 83.3\\ \\text{cm}^3/\\text{s}$.',
        'Aorta: $v = 83.3/4.9 = 17$ cm/s (with peaks near 1 m/s during ejection).',
        'Capillaries: $v = 83.3/3000 = 0.028$ cm/s $= 0.28$ mm/s.',
        'A capillary is about half a millimetre to a millimetre long, so blood spends one to a few seconds in it — enough time for oxygen to diffuse out.'
      ],
      a: 'About 17 cm/s in the aorta and 0.3 mm/s in the capillaries — some 600 times slower.'
    },
    {
      title: 'Why a capillary does not burst',
      q: 'Compare the wall tension of an aorta (radius 1.25 cm, mean pressure 100 mmHg), a 6 cm-wide aortic aneurysm (radius 3 cm, same pressure) and a capillary (radius 4 µm, pressure 25 mmHg).',
      steps: [
        'Aorta: $T = 100 \\times 133.3\\ \\text{Pa} \\times 0.0125\\ \\text{m} \\approx 167$ N/m.',
        'Aneurysm: $T = 13\\,330 \\times 0.03 \\approx 400$ N/m — 2.4 times more, borne by a wall that is often thinner.',
        'Capillary: $T = 25 \\times 133.3 \\times 4 \\times 10^{-6} \\approx 0.013$ N/m — over ten thousand times less than the aorta.',
        'So a wall one cell thick is enough for a capillary, while an aneurysm\'s wall is under ever-growing strain as it widens.'
      ],
      a: 'About 167 N/m for the aorta, 400 N/m for the aneurysm and 0.013 N/m for the capillary.'
    },
    {
      title: 'Where oedema comes from',
      q: 'In a leg capillary the blood pressure is 32 mmHg at the arterial end and 15 mmHg at the venous end; the tissue pressure is −2 mmHg, the plasma oncotic pressure 25 mmHg and the tissue oncotic pressure 5 mmHg. Find the net filtration pressure at each end, then again for a person whose failing heart raises the venous-end pressure to 30 mmHg.',
      steps: [
        'Arterial end: $(32 - (-2)) - (25 - 5) = 34 - 20 = +14$ mmHg: fluid leaves.',
        'Venous end: $(15 + 2) - 20 = -3$ mmHg: a slight pull back (in the classic picture).',
        'With heart failure: $(30 + 2) - 20 = +12$ mmHg: fluid now leaves along the whole capillary.',
        'When the outflow exceeds what the lymphatics can carry away, the ankles swell — worst at the end of the day, when gravity has added to the pressure in the leg veins.'
      ],
      a: '+14 and −3 mmHg normally; +12 mmHg at the venous end in heart failure, so fluid accumulates.'
    }
  ],
  quiz: [
    { q: 'Where in the circulation does blood move most slowly?', choices: ['in the aorta', 'in the arterioles', 'in the capillaries', 'in the venae cavae'], a: 2,
      why: 'Flow is the same at every level, and the capillaries\' combined cross-section is by far the largest, so the mean speed there is lowest — which gives time for exchange.' },
    { q: 'Which vessels hold most of the blood at any moment?', choices: ['arteries', 'capillaries', 'veins', 'the heart\'s chambers'], a: 2,
      why: 'Thin-walled, stretchy veins hold about two-thirds of the blood, a reservoir the body can tighten to send more to the heart.' },
    { q: 'Why does a very low level of albumin in the blood cause swelling?', choices: ['albumin carries water into the kidneys', 'the plasma\'s oncotic pull falls, so less fluid is held in the capillaries', 'the capillaries become narrower', 'blood pressure rises'], a: 1,
      why: 'Albumin provides most of the plasma\'s oncotic pressure; with less of it, the outward push of blood pressure wins and fluid collects in the tissues.' },
    { q: '5 L/min flows through capillaries with a total cross-section of 2 500 cm². What is the mean speed, in mm/s?', answer: 0.333, unit: 'mm/s',
      why: '5 L/min = 83.3 cm³/s; 83.3 / 2500 = 0.0333 cm/s = 0.33 mm/s.' },
    { q: 'By Laplace\'s law, an aneurysm tends to keep growing because the wider it gets, the greater the tension in its wall.', a: true,
      why: 'T = P r: at the same pressure, doubling the radius doubles the wall tension, and the stretched wall is often thinner too.' }
  ],
  applications: ['Ultrasound screening for abdominal aortic aneurysm.', 'Compression stockings, which support the leg veins and help against swelling and clots.', 'Understanding oedema in heart, liver and kidney disease.', 'Choosing veins and arteries for blood tests, drips and bypass grafts.'],
  history: 'Marcello Malpighi saw capillaries in a frog\'s lung in 1661, completing Harvey\'s circle. Ernest Starling described the balance of filtration and oncotic pressure across the capillary wall in 1896.',
  sim: { id: 'cv-loop', params: { pressures: true } }
},

{
  id: 'hemodynamics', parent: 'circulation', title: 'Blood flow and resistance', level: 2,
  short: 'Blood flows because of a pressure difference and is opposed by resistance, like current in a circuit. Resistance depends on the fourth power of a vessel\'s radius, so tiny changes in the arterioles redirect blood — and a narrowed artery costs far more flow than its size suggests.',
  keywords: ['hemodynamics', 'haemodynamics', 'blood flow', 'vascular resistance', 'Poiseuille', 'fourth power', 'viscosity', 'haematocrit', 'laminar flow', 'turbulent flow', 'Reynolds number', 'murmur', 'bruit', 'autoregulation', 'series and parallel', 'arterioles', 'shear stress'],
  prereq: ['blood-vessels', 'blood-pressure', 'physics:viscosity'],
  related: ['cardiac-output', 'atherosclerosis', 'hypertension', 'blood-composition', 'electronics:series-parallel', 'physics:bernoullis-equation', 'math:power-functions'],
  body: `
Squeeze a garden hose and the water slows to a trickle; narrow it only a little and the change is already surprisingly large. Blood obeys the same physics. Three quantities do most of the work — the **pressure difference** that pushes, the **flow** that results, and the **resistance** between them:

$$Q = \\frac{\\Delta P}{R}$$

It is Ohm's law with pressure in place of voltage and flow in place of current ([[electronics:resistance-ohms-law|Ohm's law]]). For the whole body it reads MAP ≈ CO × SVR: mean arterial pressure equals cardiac output times the systemic vascular resistance ([[blood-pressure]]).

### Poiseuille's law: the fourth power
For smooth flow in a tube, the resistance depends on the tube's length $L$, the fluid's viscosity $\\eta$ and, above all, its radius $r$:

$$R = \\frac{8\\,\\eta\\,L}{\\pi\\,r^4}, \\qquad Q = \\frac{\\pi\\,r^4\\,\\Delta P}{8\\,\\eta\\,L}$$

The fourth power ([[math:power-functions|a power function]]) is the key to the circulation. Widen an arteriole by 19 % and its flow doubles; narrow it by 16 % and the flow halves. Small changes in the muscle tone of millions of arterioles are how the body sends blood to the muscles in exercise, the gut after a meal or the skin on a hot day, without the heart doing anything different. The same law works against us when a plaque narrows an artery ([[atherosclerosis]]).

### Series and parallel
Vessels one after another (in series) add their resistances; vessels side by side (in parallel) combine like parallel resistors, so the total is lower than any one of them ([[electronics:series-parallel|series and parallel]]). The organs sit in parallel off the aorta, which has two advantages: each receives blood at full arterial pressure, and each can change its own flow without disturbing the others. A single capillary has a huge resistance, but billions in parallel add up to a modest one. Most of the resistance — and the biggest fall in pressure — lies in the small arteries and arterioles:

| Where | Mean pressure (mmHg, approx.) |
|---|---|
| Aorta | 90–95 |
| Start of the arterioles | about 85 |
| Start of the capillaries | 30–35 |
| End of the capillaries, venules | about 15 |
| Right atrium | 2–6 |

### Viscosity: thick and thin blood
Blood is several times as viscous as water, mainly because of its red cells, so the **haematocrit** — the fraction of blood that is red cells, normally roughly 36–50 %, a little lower in women than in men — matters. In severe dehydration or a disease that makes too many red cells, blood thickens and flows less easily; in anaemia it thins, which partly makes up for carrying less oxygen ([[blood-composition]]). In the narrowest vessels the red cells crowd into the middle, and blood behaves as if it were thinner than it is in a wide tube.

### Smooth and turbulent flow
In most vessels the flow is **laminar**: smooth layers, fastest in the centre and still at the wall. When the Reynolds number — density × speed × diameter ÷ viscosity — rises above about 2 000, eddies appear and the flow becomes **turbulent**. Turbulence wastes energy and makes noise: the Korotkoff sounds of a blood-pressure cuff, a **murmur** across a diseased valve, a **bruit** heard with a stethoscope over a narrowed artery. The wall also feels the flow: steady, smooth shear keeps the lining healthy, while the disturbed flow at branches and bends is where plaques tend to form.

### Autoregulation
The brain, kidneys and heart muscle keep their own flow nearly constant as blood pressure changes, relaxing their arterioles when pressure falls and tightening them when it rises. In the classic description this holds for mean pressures from about 60 to 150 mmHg; more recent studies suggest the plateau is narrower and differs between people. Outside it, flow follows pressure: too low and the organ is starved, too high and its vessels are damaged. In long-standing high blood pressure the range shifts upward — one reason doctors lower a very high pressure gradually rather than all at once ([[hypertension]]).

> [!key] Flow = pressure difference ÷ resistance, and resistance ∝ 1/r⁴. The circulation is steered by the radius of its smallest arteries.
`,
  ideas: [
    'Flow = pressure difference ÷ resistance: Ohm\'s law for blood.',
    'Poiseuille: resistance ∝ length × viscosity ÷ radius⁴, so a 19 % wider vessel carries twice the flow.',
    'Organs are in parallel, each at full arterial pressure and able to set its own flow; the arterioles hold most of the resistance.',
    'Thicker blood (high haematocrit) flows less easily; turbulence at a narrowing makes murmurs and bruits.',
    'Autoregulation keeps flow to the brain, kidneys and heart steady over a range of pressures.'
  ],
  pitfalls: [
    'Narrowing a vessel by 10 % cuts its flow by 10 % — By Poiseuille\'s law the flow falls to 0.9⁴ ≈ 0.66 of its value: a third less.',
    'The capillaries hold most of the resistance because they are the narrowest — There are so many of them in parallel that their combined resistance is modest; the arterioles dominate.',
    'Thicker blood, with more red cells, is always better because it carries more oxygen — Beyond the normal range the extra viscosity cuts flow and raises the risk of clots.'
  ],
  formulas: [
    {
      name: 'Poiseuille\'s law for blood flow',
      expr: 'Q = pi*r^4*dP/(8*eta*L)', tex: 'Q = \\frac{\\pi r^4 \\Delta P}{8 \\eta L}',
      vars: {
        Q: { name: 'blood flow', q: 'flowrate', unit: 'mL/min' },
        r: { name: 'inner radius of the vessel', q: 'length', unit: 'mm', value: 1 },
        dP: { name: 'pressure difference along it', q: 'pressure', unit: 'mmHg', value: 5, tex: '\\Delta P' },
        eta: { name: 'viscosity of blood', q: 'viscosity', unit: 'mPa·s', value: 3.5 },
        L: { name: 'length of the vessel', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Smooth (laminar) flow of a simple fluid in a straight, rigid tube. Blood and arteries are neither simple nor rigid, but the r⁴ dependence holds well enough to explain how arterioles control flow.',
      practice: { unknowns: ['Q', 'r', 'dP'] },
      stories: { Q: 'Blood (viscosity {eta}) flows along an artery of radius {r} and length {L} with a pressure drop of {dP}. What is the flow?', r: 'What radius must a {L} vessel have to carry {Q} of blood (viscosity {eta}) with a pressure drop of {dP}?' }
    },
    {
      name: 'Flow through an organ',
      expr: 'Q = dP/R', tex: 'Q = \\frac{\\Delta P}{R}',
      vars: {
        Q: { name: 'blood flow to the organ', q: 'flowrate', unit: 'L/min' },
        dP: { name: 'arterial minus venous pressure', q: 'pressure', unit: 'mmHg', value: 88, tex: '\\Delta P' },
        R: { name: 'vascular resistance of the organ', q: 'vascres', unit: 'mmHg·min/L', value: 80 }
      },
      note: '1 mmHg·min/L is a Wood unit. The example values are close to those of the two kidneys together.',
      practice: { unknowns: ['Q', 'R'] },
      stories: { Q: 'The pressure difference across the kidneys is {dP} and their resistance {R}. What is renal blood flow?', R: 'An organ receives {Q} with a pressure difference of {dP} across it. What is its vascular resistance?' }
    },
    {
      name: 'Reynolds number of blood flow',
      expr: 'Re = rho*v*D/eta', tex: '\\mathit{Re} = \\frac{\\rho v D}{\\eta}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathit{Re}' },
        rho: { name: 'density of blood', q: 'density', unit: 'kg/m³', value: 1060, fixed: true, tex: '\\rho' },
        v: { name: 'mean speed', q: 'speed', unit: 'm/s', value: 0.2 },
        D: { name: 'vessel diameter', q: 'length', unit: 'cm', value: 2.5 },
        eta: { name: 'viscosity of blood', q: 'viscosity', unit: 'mPa·s', value: 3.5 }
      },
      note: 'Below about 2 000 flow is usually laminar and silent; above it, turbulent. The pulsing aorta briefly exceeds this at peak ejection; a jet through a narrowed valve does so strongly, which is the murmur.',
      practice: { unknowns: ['Re', 'v'] },
      stories: { Re: 'Blood (density {rho}, viscosity {eta}) flows at {v} through a vessel {D} across. What is the Reynolds number?', v: 'At what mean speed does blood ({rho}, {eta}) in a {D} vessel reach a Reynolds number of {Re}?' }
    },
    {
      name: 'Flow change from a change of radius',
      expr: 'k = f^4', tex: 'k = f^{4}',
      vars: {
        k: { name: 'new flow as a share of the old', q: 'ratio', unit: '%' },
        f: { name: 'new radius as a share of the old', q: 'ratio', unit: '%', value: 119 }
      },
      note: 'At the same pressure difference, from Poiseuille\'s law. 119 % of the radius gives about 200 % of the flow; 84 % gives about 50 %.',
      practice: { unknowns: ['k', 'f'] },
      stories: { k: 'An arteriole relaxes until its radius is {f} of what it was. What share of the old flow does it now carry?', f: 'To carry {k} of its previous flow at the same pressure, to what share of its radius must a vessel change?' }
    }
  ],
  examples: [
    {
      title: 'An arteriole steering blood',
      q: 'During exercise an arteriole in a leg muscle widens its radius by 10 %; one in the gut narrows by 10 %. With the same pressure across each, how does the flow through each change?',
      steps: [
        'Muscle: $1.1^4 = 1.46$ — 46 % more flow.',
        'Gut: $0.9^4 = 0.66$ — a third less flow.',
        'Two changes of 10 % in radius shift blood strongly from gut to muscle. Repeated over millions of arterioles, with bigger changes in hard exercise, this is how the muscles come to receive most of the cardiac output.'
      ],
      a: 'Flow rises by about 46 % in the muscle and falls by about 34 % in the gut.'
    },
    {
      title: 'Blood flow to the kidneys',
      q: 'The mean arterial pressure is 93 mmHg and the pressure in the renal veins 5 mmHg. The kidneys\' vascular resistance is 80 mmHg·min/L. Find the renal blood flow. What happens if their arterioles relax so the resistance falls to 60 mmHg·min/L?',
      steps: [
        'Pressure difference: $93 - 5 = 88$ mmHg.',
        'Flow: $Q = 88 / 80 = 1.1$ L/min — about a fifth of the cardiac output for two organs of about 300 g together.',
        'With 60 mmHg·min/L: $Q = 88/60 = 1.47$ L/min, a third more, provided the heart can supply it without the mean pressure falling.'
      ],
      a: '1.1 L/min, rising to about 1.5 L/min.'
    },
    {
      title: 'Poiseuille in numbers',
      q: 'A small artery has an inner radius of 1 mm and length 10 cm, with a pressure drop of 5 mmHg along it. Blood\'s viscosity is 3.5 mPa·s. Estimate the flow, and check that it is laminar.',
      steps: [
        { text: 'In SI units:', tex: 'Q = \\frac{\\pi\\,(10^{-3})^4 \\times 667}{8 \\times 0.0035 \\times 0.1} = 7.5 \\times 10^{-7}\\ \\text{m}^3/\\text{s}' },
        'That is 0.75 mL/s, or about 45 mL/min.',
        'Mean speed: $Q / (\\pi r^2) = 7.5\\times10^{-7}/3.14\\times10^{-6} = 0.24$ m/s.',
        'Reynolds number: $1060 \\times 0.24 \\times 0.002 / 0.0035 \\approx 145$ — far below 2 000, so laminar.'
      ],
      a: 'About 45 mL/min, laminar (Re ≈ 145).'
    }
  ],
  quiz: [
    { q: 'If an arteriole\'s radius halves, with the same pressure across it, its flow becomes…', choices: ['one half', 'one quarter', 'one eighth', 'one sixteenth'], a: 3,
      why: 'Flow ∝ r⁴, and (½)⁴ = 1/16.' },
    { q: 'By what factor does flow rise when a vessel\'s radius increases by 10 % (same pressure difference)?', answer: 1.46,
      why: '1.1⁴ = 1.4641 — a 46 % increase from a 10 % widening.' },
    { q: 'Why is it useful that the organs are connected in parallel rather than in series?', choices: ['it lowers the heart\'s workload to zero', 'each organ gets blood at full arterial pressure and can adjust its own flow', 'it makes the blood flow faster in every organ', 'it prevents turbulence'], a: 1,
      why: 'In parallel each organ sees the whole arterial pressure and can open or close its own arterioles without starving the others; in series, each would receive only what the one before left.' },
    { q: 'Where does the largest drop in mean blood pressure occur?', choices: ['in the aorta', 'across the small arteries and arterioles', 'across the capillaries', 'in the veins'], a: 1,
      why: 'The arterioles hold most of the resistance, so most of the pressure (from about 85 to 30–35 mmHg) is used up across them.' },
    { q: 'A doctor hears a whooshing bruit over the neck artery. This most likely means turbulent flow through a narrowing.', a: true,
      why: 'Laminar flow is silent. A narrowing makes a fast jet that becomes turbulent (high Reynolds number) and noisy.' }
  ],
  applications: ['Medicines that relax arterioles to lower blood pressure.', 'Doppler ultrasound, which measures flow speed and finds narrowings.', 'Choosing catheter and cannula sizes: a slightly wider cannula allows a much faster infusion.', 'Understanding why severe anaemia or dehydration changes circulation.'],
  history: 'Jean Léonard Marie Poiseuille, a French physician interested in blood flow, measured flow through fine glass tubes in the late 1830s and 1840s; Gotthilf Hagen found the same law for water independently in 1839. Osborne Reynolds described the transition to turbulence in 1883.',
  sim: 'cv-poiseuille'
}

);
