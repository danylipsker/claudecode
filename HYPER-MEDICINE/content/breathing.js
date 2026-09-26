/* HYPER-MEDICINE · content/breathing.js — How breathing works:
 * the respiratory system, the mechanics of breathing, gas exchange, oxygen transport,
 * the control of breathing, and spirometry. Simulations in sims/respiratory.js. */
Hyper.add(

{
  id: 'respiratory-system', parent: 'breathing', title: 'The respiratory system', level: 1,
  short: 'The airways, lungs, muscles and blood vessels that bring air to within half a micrometre of the blood. A branching tree of tubes carries each breath down to hundreds of millions of tiny air sacs, where oxygen enters the blood and carbon dioxide leaves.',
  keywords: ['respiratory system', 'lungs', 'airways', 'trachea', 'bronchi', 'bronchioles', 'alveoli', 'diaphragm', 'pleura', 'dead space', 'tidal volume', 'minute ventilation', 'alveolar ventilation', 'cilia', 'mucus'],
  prereq: ['tissue-types', 'blood-vessels', 'physics:pressure'],
  related: ['ventilation', 'gas-exchange', 'smoking', 'environmental-health', 'vital-signs', 'innate-immunity'],
  body: `
Right now, without a thought, you are breathing twelve to sixteen times a minute — some 17,000 to 23,000 breaths a day. Each quiet breath is about half a litre, the volume of a small water bottle, and over a day roughly 8,000–10,000 litres of air pass in and out. The whole system exists for one purpose: to bring that air within half a thousandth of a millimetre of the blood, over an area large enough for all the oxygen the body needs to cross.

### The route of a breath
Air enters through the **nose**, which warms it, saturates it with water and traps dust on sticky mucus (mouth breathing skips this, which is one reason cold, dry air irritates the airways during exercise). It passes the **pharynx**, the crossroads shared with food, and the **larynx**, the voice box, into the **trachea**: a tube about 10–12 cm long and 2 cm wide, held open by C-shaped rings of cartilage. The trachea divides into two **main bronchi**. The right one is wider and more vertical, so an inhaled peanut usually ends up on the right.

The bronchi branch again and again — about 23 times in all — into ever narrower and more numerous tubes. Beyond about the eleventh division the walls lose their cartilage: these **bronchioles** are held open only by the pull of the surrounding lung and are wrapped in smooth muscle, which is why they are the tubes that squeeze shut in [[asthma]]. The first sixteen or so generations only conduct air, so the air they hold at the end of a breath — about 150 mL — never reaches the blood: the **anatomical dead space**. The last generations end in **alveoli**, 300–500 million sacs each about a fifth of a millimetre across, with a combined surface of 50–100 m², the floor of a small flat.

| Typical adult at rest | Value |
|---|---|
| Breathing rate | 12–20 breaths/min (newborn babies 30–60) |
| Tidal volume (one breath) | about 500 mL, roughly 6–8 mL per kg of ideal body weight |
| Anatomical dead space | about 150 mL |
| Minute ventilation | 5–8 L/min |
| Gas-exchange surface | 50–100 m² in 300–500 million alveoli |
| Air–blood barrier | about 0.5 µm thick |

### Lungs, pleura and muscles
The right lung has three lobes and the left two, leaving room for the heart. Each lung is wrapped in the **pleura**, two thin membranes with a film of fluid between them, which lets the lung glide against the chest wall while staying stuck to it, like two wet panes of glass. The lungs have no muscle of their own to inflate them: the **diaphragm**, a dome of muscle beneath them, does most of the work at rest, helped by the muscles between the ribs. Neck and shoulder muscles join in only when breathing is hard — a sign clinicians look for. How these pressures move air is the subject of [[ventilation|the mechanics of breathing]].

The whole output of the right side of the heart, about 5 litres a minute, flows through the lungs at a mean pressure of only about 15 mmHg, in capillaries so narrow that red cells pass in single file. A separate small circulation from the aorta feeds the walls of the airways.

### Keeping the lungs clean
Every breath brings dust, pollen, smoke and microbes. The airways are lined with cells carrying **cilia**, tiny hairs beating many times a second, which sweep a blanket of mucus upwards — the *mucociliary escalator* — to the throat, where it is swallowed unnoticed. Coughing clears larger loads, and in the alveoli, which have no cilia, wandering **macrophages** engulf what arrives ([[innate-immunity]]). Tobacco smoke paralyses and then destroys the cilia, which is why people who smoke must cough up what the escalator no longer carries ([[smoking]]).

### Fresh air where it counts
Only air that reaches the alveoli takes part in gas exchange. The **minute ventilation** counts all the air moved; the **alveolar ventilation** subtracts the dead space from every breath:

$$\\dot{V}_E = V_T \\times f, \\qquad \\dot{V}_A = (V_T - V_D) \\times f$$

At 500 mL twelve times a minute, 6 L/min is moved but only 4.2 L/min of fresh air reaches the alveoli. Rapid, shallow breathing spends a larger share of every breath on the dead space.

> [!warn] Sudden severe breathlessness, lips or face turning blue or grey, breathing that is very noisy, very slow or stopping, or someone who cannot speak, cough or breathe after something went down the wrong way — call your local emergency number (and see [[choking]]).
`,
  ideas: [
    'Air travels down a tree of about 23 branchings, from the trachea to 300–500 million alveoli with 50–100 m² of surface.',
    'The conducting airways hold about 150 mL of dead-space air that never reaches the alveoli.',
    'Alveolar ventilation — (tidal volume − dead space) × rate — is what counts for gas exchange.',
    'The lungs cannot inflate themselves: the diaphragm and chest muscles do it, and the pleura couples lung to chest wall.',
    'Mucus, cilia, coughing and macrophages keep the lungs clean, and tobacco smoke disables them.'
  ],
  pitfalls: [
    'We breathe out only carbon dioxide — Exhaled air still holds about 16 % oxygen and only about 4 % carbon dioxide; that leftover oxygen is why rescue breaths work.',
    'Breathing faster always means more air for the blood — Rapid, shallow breaths waste much of each breath on the dead space; alveolar ventilation can fall even as the rate rises.',
    'The lungs expand by their own effort — They have no muscles to inflate them; they follow the chest wall and diaphragm through the pleura, and collapse if air gets between them.'
  ],
  formulas: [
    {
      name: 'Minute ventilation',
      expr: 'VE = VT*f', tex: '\\dot{V}_E = V_T \\times f',
      vars: {
        VE: { name: 'minute ventilation', q: 'flowrate', unit: 'L/min', tex: '\\dot{V}_E' },
        VT: { name: 'tidal volume (one breath)', q: 'volume', unit: 'mL', value: 500, tex: 'V_T' },
        f: { name: 'breathing rate', q: 'frequency', unit: 'breaths/min', value: 12 }
      },
      note: 'All the air moved in and out each minute, including the part that only fills the airways.',
      stories: { VE: 'At rest a person takes breaths of {VT} at {f}. How much air do they move each minute?', f: 'A person moves {VE} of air with breaths of {VT}. How fast are they breathing?' }
    },
    {
      name: 'Alveolar ventilation',
      expr: 'VA = (VT - VD)*f', tex: '\\dot{V}_A = (V_T - V_D) \\times f',
      vars: {
        VA: { name: 'alveolar ventilation', q: 'flowrate', unit: 'L/min', tex: '\\dot{V}_A' },
        VT: { name: 'tidal volume', q: 'volume', unit: 'mL', value: 500, tex: 'V_T' },
        VD: { name: 'dead space', q: 'volume', unit: 'mL', value: 150, tex: 'V_D' },
        f: { name: 'breathing rate', q: 'frequency', unit: 'breaths/min', value: 12 }
      },
      note: 'The fresh air that actually reaches the alveoli. Each breath first refills the dead space of the airways (about 150 mL in an adult, plus any mask, tube or snorkel).',
      practice: { unknowns: ['VA', 'VT', 'VD'] },
      stories: { VA: 'Breaths of {VT} at {f}, with a dead space of {VD}. How much fresh air reaches the alveoli each minute?', VD: 'A diver breathes {VT} at {f} through a mouthpiece, and the alveolar ventilation is {VA}. What is the total dead space?' }
    },
    {
      name: 'Airways after n branchings',
      expr: 'N = 2^n', tex: 'N = 2^{n}',
      vars: {
        N: { name: 'number of airways in that generation' },
        n: { name: 'number of branchings (generation)', value: 16, int: true, min: 0, max: 30 }
      },
      note: 'An idealised tree in which every tube splits in two. Real airways branch unevenly, but the counts are of this order: some 65,000 terminal bronchioles after 16 divisions.',
      stories: { N: 'If every airway splits in two, how many airways are there after {n} branchings?', n: 'How many branchings does it take to make {N} airways from one trachea?' }
    }
  ],
  examples: [
    {
      title: 'Shallow and fast, or slow and deep?',
      q: 'Three people each move 6 litres of air a minute. A takes 250 mL breaths 24 times a minute, B 500 mL twelve times, C 1000 mL six times. With a dead space of 150 mL, how much fresh air reaches their alveoli?',
      steps: [
        'A: $(250 - 150) \\times 24 = 2400$ mL/min $= 2.4$ L/min.',
        'B: $(500 - 150) \\times 12 = 4200$ mL/min $= 4.2$ L/min.',
        'C: $(1000 - 150) \\times 6 = 5100$ mL/min $= 5.1$ L/min.',
        'The same minute ventilation gives A less than half of C\'s fresh air. An exhausted person breathing rapidly and shallowly can be in trouble despite a high breathing rate.'
      ],
      a: '2.4, 4.2 and 5.1 L/min.'
    },
    {
      title: 'A snorkel adds dead space',
      q: 'A snorkel is a tube 40 cm long and 2 cm across. By how much does it reduce the alveolar ventilation of a swimmer who breathes 500 mL twelve times a minute?',
      steps: [
        'Volume of the tube: $\\pi r^2 L = \\pi \\times 1^2 \\times 40 \\approx 126$ cm³ (mL).',
        'New dead space: $150 + 126 = 276$ mL.',
        'Alveolar ventilation: $(500 - 276) \\times 12 = 2688$ mL/min, down from 4200.',
        'The swimmer must breathe more deeply to compensate. That is why snorkels are short: a 1 m tube 2.5 cm across would hold almost 500 mL, a whole breath, and the water pressure on the chest makes breathing through it harder still.'
      ],
      a: 'From 4.2 to about 2.7 L/min, unless the swimmer breathes more deeply.'
    }
  ],
  quiz: [
    { q: 'If the minute ventilation is the same, which breathing pattern brings the most fresh air to the alveoli?', choices: ['Fast and shallow', 'Slow and deep', 'All patterns are the same', 'It depends only on the rate'], a: 1,
      why: 'Every breath first refills the dead space of about 150 mL; the fewer breaths, the less is wasted. At 6 L/min, six 1-litre breaths deliver 5.1 L/min of fresh air, twenty-four 250 mL breaths only 2.4.' },
    { q: 'A child inhales a small toy part. Which main bronchus is it most likely to enter?', choices: ['The left, because the left lung is larger', 'The right, because it is wider and more vertical', 'Neither: it stays in the trachea', 'Either, equally'], a: 1,
      why: 'The right main bronchus continues the line of the trachea more directly and is wider; the left angles away around the heart. (The left lung is in fact the smaller one.)' },
    { q: 'The air you breathe out contains no oxygen.', a: false,
      why: 'Exhaled air still holds about 16 % oxygen, against 21 % in room air; only about a quarter of the inhaled oxygen is taken up. That is enough for rescue breaths to help someone else.' },
    { q: 'A person breathes 400 mL fifteen times a minute, with a dead space of 150 mL. What is the alveolar ventilation?', answer: 3.75, unit: 'L/min',
      why: '(400 − 150) × 15 = 3750 mL/min = 3.75 L/min, although the minute ventilation is 6 L/min.' },
    { q: 'Which airways have no cartilage but plenty of smooth muscle, and narrow in asthma?', choices: ['The trachea', 'The main bronchi', 'The bronchioles', 'The alveoli'], a: 2,
      why: 'Bronchioles have lost the cartilage rings of the larger airways; their smooth muscle can squeeze them almost shut.' }
  ],
  applications: ['Rescue breaths in CPR, which work because exhaled air still carries oxygen.', 'Setting a ventilator: tidal volume, rate and the dead space of the tubing.', 'Designing snorkels, masks and breathing circuits with as little dead space as possible.', 'Inhaled medicines, which reach the airways directly.'],
  sim: 'resp-breath'
},

{
  id: 'ventilation', parent: 'breathing', title: 'The mechanics of breathing', level: 2,
  short: 'How air moves: the diaphragm enlarges the chest, the pressure in the alveoli falls slightly below the air outside, and air flows in; at rest, breathing out is the stretched lungs springing back. Compliance, surfactant and airway resistance decide how hard the work is.',
  keywords: ['mechanics of breathing', "Boyle's law", 'diaphragm', 'pleural pressure', 'alveolar pressure', 'transpulmonary pressure', 'compliance', 'elastic recoil', 'surfactant', "Laplace's law", 'airway resistance', 'work of breathing', 'pneumothorax', 'cmH2O', 'respiratory distress syndrome'],
  prereq: ['respiratory-system', 'chemistry:gas-laws', 'physics:pressure', 'physics:surface-tension'],
  related: ['lung-function-tests', 'asthma', 'copd', 'physics:viscosity', 'physics:elasticity', 'birth-newborn'],
  body: `
Put a hand flat on your upper belly and breathe in slowly. It moves out: the **diaphragm**, a dome of muscle under the lungs, is contracting and flattening, pushing the abdomen down and making the chest taller. Take a deeper breath and the ribs swing up and out as well, like the handle of a bucket being lifted. Breathing out at rest needs no effort at all — you simply let go.

### Boyle's law does the work
The lungs have no muscle able to inflate them. They are stretched open inside the chest, coupled to its wall by the thin fluid film of the pleura, so when the chest enlarges they are pulled open with it. The gas inside then fills a larger volume, and by Boyle's law ([[chemistry:gas-laws|the gas laws]]) its pressure falls:

$$P_1 V_1 = P_2 V_2$$

The drop needed is tiny. During a quiet breath the alveolar pressure falls only about 1 cmH₂O below the air outside — a thousandth of an atmosphere — and that small difference draws half a litre in over a second or two. When the muscles relax, the stretched lungs spring back, squeeze the gas to about 1 cmH₂O above atmospheric, and the air flows out. Only in exercise, coughing or blowing out candles do the abdominal and rib muscles push actively.

Breathing pressures are so small that they are measured in centimetres of water (1 cmH₂O ≈ 0.74 mmHg ≈ 98 Pa), relative to the atmosphere:

| Pressure (cmH₂O) | End of breathing out | Middle of breathing in | End of breathing in |
|---|---|---|---|
| In the alveoli | 0 | about −1 | 0 |
| In the pleural space | about −5 | about −6.5 | about −7.5 |
| Across the lung (alveolar − pleural) | 5 | about 5.5 | about 7.5 |

The pleural pressure is below atmospheric because the lung constantly tries to shrink away from the chest wall while the chest wall tends to spring outwards, pulling on the fluid film from both sides. If air enters that space — through a wound, or when a small blister on the lung surface bursts — the coupling is lost and the lung collapses under its own elasticity: a **pneumothorax**.

### Compliance: how stretchy the lungs are
**Compliance** is the volume gained for each unit of pressure:

$$C = \\frac{\\Delta V}{\\Delta P}$$

Healthy lungs have a compliance of about 200 mL/cmH₂O (lungs and chest wall together about 100). Scarred lungs in **pulmonary fibrosis**, lungs full of fluid, or a chest stiffened by severe obesity or a curved spine have a low compliance: every breath takes more pressure, so people take small, quick breaths. In **emphysema** ([[copd]]) the destroyed alveolar walls leave lungs that are too compliant — easy to inflate, but with little elastic recoil to empty them or to hold the small airways open on the way out.

### Surfactant and the law of Laplace
The inside of each alveolus is lined with a thin film of water whose surface tension pulls inwards. For a bubble of radius $r$, Laplace's law gives the pressure needed to hold it open:

$$P = \\frac{2T}{r}$$

With the surface tension of plain water (about 70 mN/m), an alveolus 0.1 mm in radius would need 14 cmH₂O just to stay open, and small alveoli would empty into large ones. Cells in the alveolar wall secrete **surfactant**, a mixture of lipids and proteins that cuts the surface tension to about a third — and further still as an alveolus shrinks — so the lungs stay open and inflate easily ([[physics:surface-tension|surface tension]]). Babies born very early have not yet made enough and develop **respiratory distress syndrome**; steroids given to the mother before an early birth, surfactant given into the baby's airway and gentle pressure support have made it far less deadly ([[birth-newborn]]).

### Resistance: getting air through the tubes
Air flows from high pressure to low through the resistance of the airways, just as current flows through a resistor:

$$\\dot{V} = \\frac{\\Delta P}{R}$$

Surprisingly, most of the resistance sits in the medium-sized bronchi, not the tiny bronchioles, because the tiny ones are so numerous and lie side by side. But the resistance of any one tube rises with the fourth power of its narrowing ([[physics:viscosity|Poiseuille's law]]), so when many small airways narrow together, as in [[asthma]], breathing becomes hard work and the lungs take longer to empty.

### The work of breathing
At rest, breathing costs only a few per cent of the body's oxygen use. Stiff lungs, narrow airways or trapped air can multiply that cost many times; exhausted breathing muscles are one of the routes to respiratory failure, and the extra energy spent is one reason people with severe lung disease lose weight.

> [!warn] Sudden sharp pain on one side of the chest with breathlessness — especially after a chest injury, or in someone with lung disease — may be a collapsed lung. Worsening breathlessness, a racing heart, blue or grey lips or confusion are an emergency: call your local emergency number.
`,
  ideas: [
    'Breathing in is active: the diaphragm and rib muscles enlarge the chest, the lungs follow, and by Boyle\'s law the alveolar pressure dips about 1 cmH₂O below atmospheric.',
    'Quiet breathing out is passive: the elastic recoil of the stretched lungs pushes the air out.',
    'Compliance, ΔV/ΔP, measures stretchiness: low in fibrosis, abnormally high in emphysema.',
    'Surfactant lowers surface tension and keeps small alveoli open (Laplace: P = 2T/r).',
    'Air flow = pressure difference ÷ resistance, and a tube\'s resistance rises steeply as it narrows.'
  ],
  pitfalls: [
    'The lungs suck the air in — They have no muscle to do so; the chest wall and diaphragm pull them open through the pleura.',
    'Breathing in needs a strong vacuum — The alveolar pressure falls by only about 1 cmH₂O, a thousandth of an atmosphere.',
    'Breathing out takes as much work as breathing in — At rest it is passive; only exercise, coughing or narrowed airways make the muscles push air out.'
  ],
  formulas: [
    {
      name: 'Compliance',
      expr: 'C = dV/dP', tex: 'C = \\frac{\\Delta V}{\\Delta P}',
      vars: {
        C: { name: 'compliance (mL per cmH₂O)' },
        dV: { name: 'volume change (mL)', value: 500, tex: '\\Delta V' },
        dP: { name: 'pressure change across the lung (cmH₂O)', value: 2.5, tex: '\\Delta P' }
      },
      note: 'Healthy lungs: about 200 mL/cmH₂O; lungs and chest wall together about 100. The units are the clinical ones, so the variables are plain numbers in mL and cmH₂O.',
      stories: { C: 'A breath of {dV} mL needs a change of {dP} cmH₂O across the lung. What is the lung\'s compliance?', dP: 'A lung with a compliance of {C} mL/cmH₂O takes a {dV} mL breath. What pressure change does it need?' }
    },
    {
      name: 'Laplace\'s law for an alveolus',
      expr: 'P = 2*T/r', tex: 'P = \\frac{2T}{r}',
      vars: {
        P: { name: 'pressure needed to hold it open', q: 'pressure', unit: 'cmH₂O' },
        T: { name: 'surface tension of the lining', q: 'surfacetension', unit: 'mN/m', value: 25 },
        r: { name: 'radius of the alveolus', q: 'length', unit: 'µm', value: 100 }
      },
      note: 'Water has a surface tension of about 70 mN/m; surfactant brings it to about 25 mN/m, and lower as an alveolus shrinks.',
      stories: { P: 'An alveolus of radius {r} is lined with fluid of surface tension {T}. What pressure does it take to keep it open?', T: 'Holding an alveolus of radius {r} open takes {P}. What is the surface tension of its lining?' }
    },
    {
      name: 'Air flow through the airways',
      expr: 'Q = dP/R', tex: '\\dot{V} = \\frac{\\Delta P}{R}',
      vars: {
        Q: { name: 'air flow (L/s)', tex: '\\dot{V}' },
        dP: { name: 'pressure difference between mouth and alveoli (cmH₂O)', value: 1, tex: '\\Delta P' },
        R: { name: 'airway resistance (cmH₂O·s/L)', value: 2 }
      },
      note: 'The airways\' Ohm\'s law. Normal airway resistance is about 1–2 cmH₂O per L/s; in an asthma attack it can rise several-fold.',
      stories: { Q: 'The alveolar pressure is {dP} cmH₂O below the mouth and the airway resistance is {R} cmH₂O·s/L. How fast does air flow in, in L/s?', dP: 'To breathe in at {Q} L/s through airways with a resistance of {R} cmH₂O·s/L, how far below atmospheric must the alveolar pressure fall, in cmH₂O?' }
    },
    {
      name: 'Boyle\'s law in the lungs',
      expr: 'P1*V1 = P2*V2', solveFor: 'P2', tex: 'P_1 V_1 = P_2 V_2',
      vars: {
        P1: { name: 'pressure before', q: 'pressure', unit: 'cmH₂O', value: 1033.2 },
        V1: { name: 'gas volume before', q: 'volume', unit: 'mL', value: 3000 },
        P2: { name: 'pressure after', q: 'pressure', unit: 'cmH₂O' },
        V2: { name: 'gas volume after', q: 'volume', unit: 'mL', value: 3003 }
      },
      note: 'At constant temperature. One atmosphere is about 1033 cmH₂O, so a pressure change of 1 cmH₂O corresponds to a volume change of only about one part in a thousand.',
      stories: { P2: 'The lungs hold {V1} of gas at {P1}. The chest enlarges it to {V2} before any air can flow in. What is the new pressure?' }
    }
  ],
  examples: [
    {
      title: 'Stiff lungs',
      q: 'Healthy lungs have a compliance of 200 mL/cmH₂O; in severe fibrosis it may be 50 mL/cmH₂O. What pressure change across the lung does a 500 mL breath need in each case?',
      steps: [
        '$\\Delta P = \\Delta V / C$.',
        'Healthy: $500 / 200 = 2.5$ cmH₂O.',
        'Fibrosis: $500 / 50 = 10$ cmH₂O — four times the effort for the same breath.',
        'The breathing muscles cope by taking smaller, faster breaths, which cost less pressure each but waste more air on the dead space.'
      ],
      a: '2.5 cmH₂O against 10 cmH₂O.'
    },
    {
      title: 'Why surfactant matters',
      q: 'An alveolus has a radius of 0.1 mm. What pressure does surface tension create in it with plain water (70 mN/m) and with surfactant (25 mN/m)? And in a smaller alveolus, 0.05 mm in radius, lined with plain water?',
      steps: [
        'Water: $P = 2 \\times 0.070 / 0.0001 = 1400$ Pa $\\approx 14.3$ cmH₂O.',
        'Surfactant: $P = 2 \\times 0.025 / 0.0001 = 500$ Pa $\\approx 5.1$ cmH₂O.',
        'Half the radius, water: $2800$ Pa $\\approx 28.6$ cmH₂O. The smaller alveolus has the higher pressure, so without surfactant it would empty into its larger neighbour and collapse.',
        'Surfactant becomes more concentrated as an alveolus shrinks, lowering the surface tension further and preventing this.'
      ],
      a: 'About 14 cmH₂O with water and 5 cmH₂O with surfactant; small alveoli would collapse without it.'
    },
    {
      title: 'How little the pressure changes',
      q: 'At the end of a quiet breath the lungs hold 3 litres of gas at atmospheric pressure, about 1033 cmH₂O. If the chest enlarged that gas by just 3 mL before any air could flow in, what would its pressure be?',
      steps: [
        'Boyle\'s law: $P_2 = P_1 V_1 / V_2 = 1033.2 \\times 3000 / 3003$.',
        '$P_2 \\approx 1032.2$ cmH₂O: a fall of about 1 cmH₂O.',
        'An expansion of one part in a thousand creates the pressure difference that drives a whole breath in; air then flows until the pressures are equal again.'
      ],
      a: 'About 1032 cmH₂O — a fall of 1 cmH₂O.'
    }
  ],
  quiz: [
    { q: 'During a quiet breath in, the pressure in the alveoli is…', choices: ['about 1 cmH₂O below atmospheric', 'about 50 cmH₂O below atmospheric', 'slightly above atmospheric', 'equal to the pleural pressure'], a: 0,
      why: 'A dip of about 1 cmH₂O is enough to draw half a litre in through healthy airways. The pleural pressure is lower still, about −5 to −7.5 cmH₂O.' },
    { q: 'At rest, breathing out requires the abdominal and rib muscles to contract.', a: false,
      why: 'Quiet expiration is passive: the diaphragm relaxes and the elastic recoil of the lungs pushes the air out.' },
    { q: 'A baby born at 28 weeks breathes with great effort, and her alveoli tend to collapse at the end of each breath. What is she short of?', choices: ['Cilia', 'Surfactant', 'Haemoglobin', 'Cartilage in the trachea'], a: 1,
      why: 'Without enough surfactant the surface tension is high, small alveoli collapse (Laplace) and the lungs are stiff: respiratory distress syndrome.' },
    { q: 'A stab wound lets air into the pleural space on one side. What happens to that lung?', choices: ['It over-inflates', 'It collapses towards its root', 'Nothing, as long as the other lung works', 'It fills with blood'], a: 1,
      why: 'Once the pleural coupling is lost, the lung\'s own elastic recoil shrinks it (a pneumothorax), while the chest wall springs outwards.' },
    { q: 'A lung takes in 600 mL when the pressure across it rises by 3 cmH₂O. What is its compliance, in mL per cmH₂O?', answer: 200,
      why: 'C = ΔV/ΔP = 600/3 = 200 mL/cmH₂O — a healthy value.' }
  ],
  applications: ['Mechanical ventilators, which push air in with positive pressure — the reverse of natural breathing.', 'Surfactant treatment and antenatal steroids for premature babies.', 'Chest drains for a pneumothorax, which restore the negative pleural pressure.', 'Breathing exercises after surgery, which reopen collapsed areas of lung.'],
  sim: 'resp-breath'
},

{
  id: 'gas-exchange', parent: 'breathing', title: 'Gas exchange', level: 2,
  short: 'Oxygen and carbon dioxide cross the thin alveolar wall by diffusion, each moving down its own partial-pressure difference. Exchange works only where air and blood reach the same alveoli — ventilation matched to perfusion — and it fails in recognisable ways when they do not.',
  keywords: ['gas exchange', 'diffusion', "Fick's law", 'partial pressure', 'alveolar gas equation', 'A–a gradient', 'diffusing capacity', 'DLCO', 'ventilation–perfusion', 'V/Q mismatch', 'shunt', 'dead space', 'hypoxaemia', 'transit time', 'altitude'],
  prereq: ['respiratory-system', 'membrane-transport', 'chemistry:partial-pressures', 'chemistry:henrys-law'],
  related: ['oxygen-transport', 'pneumonia', 'pulmonary-embolism', 'copd', 'lung-function-tests', 'chemistry:effusion-diffusion'],
  body: `
At the top of a 5,000-metre pass a trekker stops every few steps. A marathon runner's blood leaves the lungs fully loaded even at top speed. An older man with pneumonia has a low oxygen level that barely improves on an oxygen mask. All three are stories of gas exchange: whether oxygen can get from the air into the blood fast enough, and whether air and blood arrive in the same places.

### Partial pressures do the pushing
Gases cross the alveolar wall by **diffusion**, each moving from where its partial pressure is higher to where it is lower ([[chemistry:partial-pressures|partial pressures]]). In the airways, water vapour (47 mmHg at body temperature) dilutes the oxygen of dry air from about 159 to 150 mmHg; in the alveoli, where oxygen is constantly removed and carbon dioxide added, it settles near 100 mmHg, beside 40 mmHg of carbon dioxide.

| Partial pressure, mmHg (kPa) | Oxygen | Carbon dioxide |
|---|---|---|
| Dry air at sea level | 159 (21.2) | about 0.3 |
| Air in the airways, humidified | 150 (20.0) | about 0.3 |
| Alveolar gas | about 100 (13.3) | 40 (5.3) |
| Blood arriving at the lungs (mixed venous) | 40 (5.3) | 46 (6.1) |
| Arterial blood | 80–100 (10.7–13.3) | 35–45 (4.7–6.0) |

The arterial values are typical for healthy young adults at sea level; reference ranges differ between laboratories, and the normal oxygen level falls gently with age and with altitude.

### Fick's law
The rate at which a gas diffuses through a sheet grows with the area and the pressure difference, and falls with the thickness:

$$\\dot{V}_{\\text{gas}} = D \\cdot \\frac{A\\,(P_1 - P_2)}{T}$$

where $D$ depends on how soluble and how small the molecule is. The lung maximises the area (50–100 m²) and minimises the thickness (about 0.5 µm). Carbon dioxide is so much more soluble that it diffuses about twenty times more readily than oxygen, so its exchange is almost never limited by diffusion even though its pressure difference is only about 6 mmHg. The lung's **diffusing capacity** is measured with a harmless trace of carbon monoxide (the DLCO): it falls when area is lost (emphysema), when the membrane thickens (fibrosis) and when there is less blood in the capillaries (anaemia, clots in the lung).

### A race along the capillary
A red cell spends about three-quarters of a second in an alveolar capillary at rest, yet it is fully loaded after about a quarter of a second — a large safety margin. In hard exercise the transit shortens to around a quarter of a second and a healthy lung still just keeps up. A thickened membrane uses up the margin: at rest the blood still equilibrates, but on exertion it leaves before it is full, which is why people with lung fibrosis desaturate when they walk. At altitude the pressure pushing oxygen across is smaller from the start. The capillary simulation below shows all three.

### The alveolar gas equation
The oxygen in the alveoli depends on the air breathed and on how much carbon dioxide is displacing it:

$$P_{A\\mathrm{O_2}} = F_{i\\mathrm{O_2}}\\,(P_{atm} - P_{\\mathrm{H_2O}}) - \\frac{P_{a\\mathrm{CO_2}}}{R}$$

At sea level, breathing air with a normal PaCO₂ of 40 mmHg and a respiratory quotient $R$ of 0.8, this gives about 100 mmHg. The arterial value is a little lower; the difference, the **A–a gradient**, is normally about 5–15 mmHg in young adults and widens with age. A low arterial oxygen with a normal gradient means the lungs themselves are fine but too little oxygen is reaching them — at altitude, or because breathing is too shallow ([[control-of-breathing]]). A wide gradient points to a problem inside the lung.

### Matching air to blood
Exchange happens only where ventilation ($\\dot{V}$) and blood flow ($\\dot{Q}$) meet. For the whole lung, about 4.2 L/min of alveolar air meets 5 L/min of blood, a **V/Q ratio** of about 0.8. Gravity spreads it unevenly — the apex of an upright lung is over-ventilated, the base over-perfused — and disease pushes it to extremes:

- **Shunt** (V/Q = 0): blood passes alveoli with no air in them — filled with fluid or pus, or collapsed, as in [[pneumonia]]. That blood leaves as venous as it came, and extra oxygen barely helps because it never meets the oxygen.
- **Low V/Q**: areas that are poorly ventilated but still perfused, as in [[asthma]] and [[copd]] — the commonest cause of a low oxygen level, and one that a little extra oxygen corrects well.
- **Dead space** (V/Q infinite): ventilated alveoli with no blood flow, as when a clot blocks an artery in [[pulmonary-embolism]]. The breathing there is wasted, and more breathing is needed to clear carbon dioxide.

The lung limits the damage itself: small arteries constrict where the alveolar oxygen is low (**hypoxic pulmonary vasoconstriction**), diverting blood to better-ventilated areas.

| Cause of a low arterial oxygen | Example | A–a gradient | Extra oxygen |
|---|---|---|---|
| Low inspired oxygen | high altitude | normal | corrects it |
| Hypoventilation | opioid overdose, weak breathing muscles | normal | corrects the oxygen, not the CO₂ |
| Diffusion limitation | fibrosis, on exertion | wide | corrects it |
| Low V/Q | asthma, COPD | wide | corrects it well |
| Shunt | pneumonia, collapsed lung | wide | helps little |

> [!warn] Breathlessness at rest, blue or grey lips, new confusion or drowsiness, or an oxygen saturation well below the person's usual level (for most people with healthy lungs, 92 % or lower) are signs of failing gas exchange — call your local emergency number.
`,
  ideas: [
    'Oxygen and carbon dioxide cross the 0.5 µm alveolar wall by diffusion, each down its own partial-pressure difference.',
    'Fick\'s law: diffusion grows with area and pressure difference and falls with thickness; CO₂ diffuses about 20 times more readily than O₂.',
    'Blood normally finishes loading oxygen a third of the way along the capillary — a reserve used up by exercise, thickened membranes and altitude.',
    'The alveolar gas equation gives the alveolar PO₂; the A–a gradient separates lung problems from breathing or altitude problems.',
    'Air and blood must meet: shunt barely responds to oxygen, low V/Q responds well, and dead space wastes breathing.'
  ],
  pitfalls: [
    'The body actively pulls oxygen into the blood — It moves only by diffusion, down a partial-pressure difference; anything that shrinks that difference, such as altitude or hypoventilation, slows it.',
    'Extra oxygen fixes every low oxygen level — It corrects low V/Q, diffusion limitation and altitude, but true shunt barely responds, and in hypoventilation it hides a rising CO₂.',
    'A high CO₂ means the membrane is damaged — Because CO₂ diffuses so easily, a high arterial CO₂ almost always means too little ventilation, not a diffusion problem.'
  ],
  formulas: [
    {
      name: 'The alveolar gas equation',
      expr: 'PAO2 = FiO2*(Patm - PH2O) - PaCO2/RQ',
      tex: 'P_{A\\mathrm{O_2}} = F_{i\\mathrm{O_2}}\\,(P_{atm} - P_{\\mathrm{H_2O}}) - \\frac{P_{a\\mathrm{CO_2}}}{R}',
      vars: {
        PAO2: { name: 'alveolar oxygen pressure', q: 'pressure', unit: 'mmHg', tex: 'P_{A\\mathrm{O_2}}' },
        FiO2: { name: 'fraction of oxygen breathed', q: 'ratio', unit: '%', value: 21, min: 0, max: 100, tex: 'F_{i\\mathrm{O_2}}' },
        Patm: { name: 'barometric pressure', q: 'pressure', unit: 'mmHg', value: 760, tex: 'P_{atm}' },
        PH2O: { name: 'water vapour pressure at 37 °C', q: 'pressure', unit: 'mmHg', value: 47, fixed: true, tex: 'P_{\\mathrm{H_2O}}' },
        PaCO2: { name: 'arterial carbon dioxide pressure', q: 'pressure', unit: 'mmHg', value: 40, tex: 'P_{a\\mathrm{CO_2}}' },
        RQ: { name: 'respiratory quotient', value: 0.8, tex: 'R' }
      },
      note: 'Pressures may be in mmHg or kPa. R, the ratio of CO₂ made to O₂ used, is about 0.8 on a mixed diet. A simplified form that is accurate enough for bedside use.',
      practice: { unknowns: ['PAO2', 'FiO2', 'PaCO2'] },
      stories: {
        PAO2: 'At a barometric pressure of {Patm}, someone breathes {FiO2} oxygen and has an arterial PCO₂ of {PaCO2}. What is the alveolar PO₂?',
        FiO2: 'At {Patm}, with a PaCO₂ of {PaCO2}, what share of oxygen must be breathed to give an alveolar PO₂ of {PAO2}?',
        PaCO2: 'At {Patm} on {FiO2} oxygen the alveolar PO₂ is {PAO2}. What must the PaCO₂ be?'
      }
    },
    {
      name: 'The A–a gradient',
      expr: 'AaG = PAO2 - PaO2', tex: '\\text{A–a} = P_{A\\mathrm{O_2}} - P_{a\\mathrm{O_2}}',
      vars: {
        AaG: { name: 'alveolar–arterial oxygen gradient', q: 'pressure', unit: 'mmHg', tex: '\\text{A–a}' },
        PAO2: { name: 'alveolar oxygen pressure', q: 'pressure', unit: 'mmHg', value: 100, tex: 'P_{A\\mathrm{O_2}}' },
        PaO2: { name: 'arterial oxygen pressure (blood gas)', q: 'pressure', unit: 'mmHg', value: 90, tex: 'P_{a\\mathrm{O_2}}' }
      },
      note: 'Normally about 5–15 mmHg in young adults breathing air, rising with age (a rough upper limit is age/4 + 4 mmHg). A wide gradient means a problem inside the lung.',
      stories: { AaG: 'The alveolar gas equation gives {PAO2}, and the arterial blood gas shows {PaO2}. What is the A–a gradient?' }
    },
    {
      name: 'Oxygen uptake and the diffusing capacity',
      expr: 'VO2 = DL*dP', tex: '\\dot{V}_{\\mathrm{O_2}} = D_L \\times \\Delta P',
      vars: {
        VO2: { name: 'oxygen taken up (mL/min)', tex: '\\dot{V}_{\\mathrm{O_2}}' },
        DL: { name: 'diffusing capacity for oxygen (mL/min per mmHg)', value: 21, tex: 'D_L' },
        dP: { name: 'average alveolar–capillary PO₂ difference (mmHg)', value: 12, tex: '\\Delta P' }
      },
      note: 'Fick\'s law for the whole lung, with area, thickness and solubility lumped into one number. It is measured with carbon monoxide (DLCO) and falls in emphysema, fibrosis and anaemia.',
      stories: { VO2: 'A lung has a diffusing capacity of {DL} mL/min per mmHg and an average PO₂ difference of {dP} mmHg. How much oxygen does it take up per minute?', dP: 'To take up {VO2} mL of oxygen a minute with a diffusing capacity of {DL} mL/min per mmHg, what average PO₂ difference is needed?' }
    },
    {
      name: 'Ventilation–perfusion ratio',
      expr: 'VQ = VA/Q', tex: '\\text{V/Q} = \\frac{\\dot{V}_A}{\\dot{Q}}',
      vars: {
        VQ: { name: 'ventilation–perfusion ratio', tex: '\\text{V/Q}' },
        VA: { name: 'alveolar ventilation', q: 'flowrate', unit: 'L/min', value: 4.2, tex: '\\dot{V}_A' },
        Q: { name: 'blood flow', q: 'flowrate', unit: 'L/min', value: 5, tex: '\\dot{Q}' }
      },
      note: 'About 0.8 for the whole lung; 0 in a shunt (blood but no air), infinite in dead space (air but no blood).',
      stories: { VQ: 'A region of lung receives {VA} of air and {Q} of blood. What is its V/Q ratio?' }
    }
  ],
  examples: [
    {
      title: 'Thin air in La Paz',
      q: 'La Paz lies at about 3,600 m, where the barometric pressure is about 490 mmHg. What is the alveolar PO₂ of a newly arrived visitor with a normal PaCO₂ of 40 mmHg, and of a resident who breathes more and has a PaCO₂ of 30 mmHg?',
      steps: [
        'Inspired oxygen: $0.21 \\times (490 - 47) = 93.0$ mmHg.',
        'Visitor: $93.0 - 40/0.8 = 43.0$ mmHg — less than half the sea-level value.',
        'Resident: $93.0 - 30/0.8 = 55.5$ mmHg.',
        'Breathing more lowers the alveolar CO₂ and leaves more room for oxygen: the first step of acclimatisation.'
      ],
      a: 'About 43 mmHg for the visitor and 56 mmHg for the resident.'
    },
    {
      title: 'Two people with the same low oxygen',
      q: 'Two people breathing room air at sea level both have an arterial PO₂ of 55 mmHg. One is drowsy after an opioid overdose, with a PaCO₂ of 70 mmHg; the other has pneumonia and a PaCO₂ of 32 mmHg. Work out their A–a gradients.',
      steps: [
        'Inspired oxygen: $0.21 \\times (760 - 47) = 149.7$ mmHg.',
        'Overdose: $P_{A\\mathrm{O_2}} = 149.7 - 70/0.8 = 62.2$ mmHg; gradient $62.2 - 55 \\approx 7$ mmHg — normal. The lungs work; there is simply too little breathing.',
        'Pneumonia: $P_{A\\mathrm{O_2}} = 149.7 - 32/0.8 = 109.7$ mmHg; gradient $\\approx 55$ mmHg — wide. Oxygen reaches the alveoli but not the blood: the problem is in the lung.'
      ],
      a: 'A gradient of about 7 mmHg (hypoventilation) against about 55 mmHg (a lung problem).'
    },
    {
      title: 'Shunt or low V/Q?',
      q: 'In the two-unit lung of the simulation, either 30 % of the blood passes a unit with no air (like pneumonia), or half the blood passes a unit that gets a tenth of the air (like asthma). Both give an arterial PO₂ of about 50–55 mmHg on room air. What does extra oxygen do?',
      steps: [
        'Low V/Q: raising the inspired oxygen to 28 % lifts the arterial PO₂ to about 61 mmHg, and 40 % to about 100 mmHg, because the poorly ventilated alveoli still receive some of the richer air.',
        'Shunt: 60 % oxygen raises it only to about 70 mmHg, and even 100 % only to about 100 mmHg (a healthy lung would exceed 600), because the shunted blood never meets the oxygen.',
        'A low oxygen level that hardly responds to oxygen makes clinicians think of shunt: pneumonia, collapse, fluid in the lungs, or a hole between the two sides of the heart.'
      ],
      a: 'Low V/Q responds well to a little extra oxygen; shunt hardly responds.'
    }
  ],
  quiz: [
    { q: 'Why is carbon dioxide exchange rarely limited by diffusion, although its pressure difference across the alveolar wall is only about 6 mmHg?', choices: ['CO₂ is a smaller molecule than O₂', 'CO₂ is far more soluble, so it diffuses about 20 times more readily', 'CO₂ is actively pumped out of the blood', 'CO₂ leaves through the airway walls instead'], a: 1,
      why: 'Diffusion depends on solubility as well as on the pressure difference. CO₂ is about 24 times more soluble than O₂ in water, which more than makes up for its small gradient.' },
    { q: 'A person given a sedative has an arterial PO₂ of 60 mmHg and a normal A–a gradient. The most likely cause of the low oxygen is…', choices: ['pneumonia', 'hypoventilation', 'a pulmonary embolism', 'a thickened alveolar membrane'], a: 1,
      why: 'A normal gradient means the lungs transfer oxygen normally; too little air is reaching them. Pneumonia, clots and fibrosis widen the gradient.' },
    { q: 'Which cause of a low oxygen level responds least to breathing extra oxygen?', choices: ['High altitude', 'Low V/Q in asthma', 'Shunt in pneumonia', 'Diffusion limitation in fibrosis'], a: 2,
      why: 'Shunted blood never meets alveolar gas, however rich in oxygen that gas is.' },
    { q: 'Oxygen moves from the alveoli into the blood because its partial pressure is higher in the alveoli.', a: true,
      why: 'Diffusion runs down the partial-pressure difference: about 100 mmHg in the alveoli against 40 mmHg in the arriving blood.' },
    { q: 'At sea level, what is the alveolar PO₂ of someone breathing 30 % oxygen with a PaCO₂ of 40 mmHg (R = 0.8)?', answer: 164, unit: 'mmHg',
      why: '0.30 × (760 − 47) − 40/0.8 = 213.9 − 50 = 164 mmHg.' }
  ],
  applications: ['Arterial blood gases and the A–a gradient in emergency departments and intensive care.', 'The diffusing-capacity (DLCO) test in lung clinics.', 'Planning oxygen for high-altitude travel, flights and mountain rescue.', 'Choosing how much oxygen to give, and recognising when oxygen alone cannot help.'],
  sim: ['resp-diffusion', 'resp-vq']
},

{
  id: 'oxygen-transport', parent: 'breathing', title: 'Oxygen transport and haemoglobin', level: 2,
  short: 'Almost all the oxygen in blood rides on haemoglobin, which loads it in the lungs and releases it in the tissues along an S-shaped curve. How much oxygen reaches the body each minute depends on haemoglobin, saturation and cardiac output together.',
  keywords: ['haemoglobin', 'hemoglobin', 'oxygen saturation', 'SpO2', 'SaO2', 'oxygen–haemoglobin dissociation curve', 'P50', 'Bohr effect', '2,3-BPG', 'oxygen content', 'oxygen delivery', 'pulse oximeter', 'carbon monoxide', 'cyanosis', 'fetal haemoglobin'],
  prereq: ['gas-exchange', 'blood-composition', 'cardiac-output', 'chemistry:henrys-law'],
  related: ['anemia', 'control-of-breathing', 'acid-base-balance', 'poisoning-overdose', 'copd', 'vital-signs'],
  body: `
A clip on a fingertip glows red and shows 97 %: the share of the haemoglobin in the arterial blood that is carrying oxygen. It is one of the most useful numbers in medicine, and one of the most misunderstood, because saturation is not the same as the amount of oxygen the blood carries, nor the amount that reaches the tissues.

### Why blood needs haemoglobin
Oxygen dissolves poorly in water ([[chemistry:henrys-law|Henry's law]]): at an arterial PO₂ of 100 mmHg, a decilitre of plasma holds only 0.3 mL. With a cardiac output of 5 L/min, dissolved oxygen alone would deliver about 15 mL a minute — a sixteenth of what a resting body uses. **Haemoglobin**, the red protein packed into red blood cells ([[blood-composition]]), solves the problem. Each molecule has four iron-containing haem groups, each able to bind one oxygen molecule, and each gram of haemoglobin can carry about 1.34 mL of oxygen. With 15 g of haemoglobin per decilitre, arterial blood carries about 20 mL of oxygen per decilitre — some seventy times the dissolved amount.

### The S-shaped curve
Binding is cooperative: once one oxygen molecule is attached, the haemoglobin changes shape and the next ones bind more easily. The result is the sigmoid **oxygen–haemoglobin dissociation curve** (standard curve, pH 7.4 and 37 °C):

| PO₂, mmHg | 100 | 80 | 60 | 50 | 40 | 27 | 20 |
|---|---|---|---|---|---|---|---|
| PO₂, kPa | 13.3 | 10.7 | 8.0 | 6.7 | 5.3 | 3.6 | 2.7 |
| Saturation | 98 % | 96 % | 91 % | 85 % | 75 % | 50 % | 32 % |

Its shape is a piece of engineering. The **flat top** is a safety margin: the arterial PO₂ can fall from 100 to 60 mmHg — at altitude, or with mild lung disease — while the saturation drops only from 98 to 91 %. The **steep middle** is where the tissues work: a modest fall of PO₂ in a capillary releases a lot of oxygen. Resting tissues take about a quarter of what arrives, and venous blood returns about 75 % saturated at a PO₂ of 40 mmHg. Below about 60 mmHg in the arteries, every further fall costs much more saturation.

The **P50**, the PO₂ at which haemoglobin is half saturated, is about 27 mmHg and summarises the curve's position. Acid, carbon dioxide, heat and 2,3-BPG (a molecule made by red cells, which rises at altitude and in anaemia) push the curve **to the right**, loosening haemoglobin's grip: warm, acidic, exercising muscle gets more oxygen at the same PO₂ — the **Bohr effect**. At pH 7.2, for example, the saturation at 40 mmHg falls from 75 % to about 62 %, releasing another eighth of the load. Alkalosis, cold, carbon monoxide and **fetal haemoglobin** shift it **to the left**; the fetal shift is useful, letting a baby draw oxygen from the mother's blood across the placenta.

### Content and delivery
What matters to the tissues is the oxygen delivered each minute:

$$C_{a\\mathrm{O_2}} = 1.34 \\times \\text{Hb} \\times S_{a\\mathrm{O_2}} + 0.003 \\times P_{a\\mathrm{O_2}}, \\qquad D_{\\mathrm{O_2}} = 10 \\times \\text{CO} \\times C_{a\\mathrm{O_2}}$$

With a cardiac output of 5 L/min that is about 1,000 mL of oxygen a minute, of which about 250 is used at rest. Three levers set it — haemoglobin, saturation and [[cardiac-output]] — and a failure of any one can starve the tissues. In [[anemia|anaemia]] the saturation and PO₂ stay normal while the content falls; the heart compensates by pumping more, which is why people with anaemia notice their heartbeat and get breathless on exertion. Breathing pure oxygen in a healthy person adds only about a tenth to the content, because the haemoglobin is already nearly full.

### Pulse oximeters and their limits
A pulse oximeter shines red and infrared light through the finger and compares how much of each the pulsing arterial blood absorbs. Healthy people at sea level usually read 95–100 %; people with chronic lung disease may have a lower target agreed with their team. Readings are less reliable with cold hands, poor circulation, movement or nail varnish, and studies since 2020 have shown that they can **over-read in people with darker skin**, hiding low oxygen levels; regulators have since been reviewing how the devices are tested. They also cannot tell oxygen from carbon monoxide on haemoglobin.

### Carbon monoxide
Carbon monoxide, from faulty boilers and heaters, generators, barbecues or engines in enclosed spaces, binds haemoglobin about 200–250 times more tightly than oxygen. It takes the places oxygen should occupy and shifts the curve to the left, so the rest unloads poorly. Its symptoms — headache, dizziness, nausea, tiredness, confusion — are easily mistaken for flu, and the skin does not turn blue.

> [!warn] Suspect carbon monoxide if several people (or pets) in the same place feel ill at once, or if symptoms ease away from the building. Get everyone into fresh air, do not go back in, and call your local emergency number. A finger oximeter can read normal in carbon monoxide poisoning.

Blueness of the lips and skin (**cyanosis**) appears only when a lot of haemoglobin has lost its oxygen, so it is a late sign, harder to see in darker skin (check the lips, tongue and gums), and it may never appear in severe anaemia.
`,
  ideas: [
    'Haemoglobin carries about 98 % of the oxygen in blood; each gram binds up to about 1.34 mL.',
    'The S-shaped curve has a flat top (a safety margin in the lungs) and a steep middle (easy release in the tissues); P50 ≈ 27 mmHg.',
    'Acid, CO₂, heat and 2,3-BPG shift the curve right and release more oxygen (the Bohr effect); alkalosis, cold, fetal haemoglobin and carbon monoxide shift it left.',
    'Oxygen delivery = cardiac output × content: haemoglobin, saturation and cardiac output all count.',
    'A pulse oximeter measures saturation, not content: it can read normal in anaemia and in carbon monoxide poisoning.'
  ],
  pitfalls: [
    'A saturation of 97 % means the blood carries plenty of oxygen — Saturation is a percentage of the haemoglobin present; with half the normal haemoglobin, 97 % carries half the oxygen.',
    'Breathing pure oxygen doubles the oxygen in the blood — In a healthy person haemoglobin is already about 98 % full, so the content rises by only about a tenth.',
    'Blue lips are an early sign of low oxygen — Cyanosis appears late, is hard to see in darker skin, and may not appear at all in anaemia or carbon monoxide poisoning.'
  ],
  formulas: [
    {
      name: 'Oxygen content of arterial blood',
      expr: 'CaO2 = 1.34*Hb*SaO2 + 0.003*PaO2',
      tex: 'C_{a\\mathrm{O_2}} = 1.34 \\times \\text{Hb} \\times S_{a\\mathrm{O_2}} + 0.003 \\times P_{a\\mathrm{O_2}}',
      vars: {
        CaO2: { name: 'arterial oxygen content (mL O₂ per dL)', tex: 'C_{a\\mathrm{O_2}}' },
        Hb: { name: 'haemoglobin', q: 'hemoglobin', unit: 'g/dL', value: 15, tex: '\\text{Hb}' },
        SaO2: { name: 'arterial oxygen saturation', q: 'ratio', unit: '%', value: 98, min: 0, max: 100, tex: 'S_{a\\mathrm{O_2}}' },
        PaO2: { name: 'arterial PO₂ (mmHg)', value: 95, tex: 'P_{a\\mathrm{O_2}}' }
      },
      note: 'An empirical formula: haemoglobin in g/dL (the calculator converts g/L or mmol/L), PO₂ in mmHg. Some laboratories use 1.36 or 1.39 in place of 1.34.',
      practice: { unknowns: ['CaO2', 'Hb', 'SaO2'] },
      stories: {
        CaO2: 'A patient has a haemoglobin of {Hb}, an arterial saturation of {SaO2} and a PaO₂ of {PaO2} mmHg. How much oxygen does each decilitre of arterial blood carry, in mL?',
        Hb: 'Arterial blood carries {CaO2} mL of oxygen per decilitre at a saturation of {SaO2} and a PaO₂ of {PaO2} mmHg. What is the haemoglobin?',
        SaO2: 'Blood with a haemoglobin of {Hb} and a PaO₂ of {PaO2} mmHg carries {CaO2} mL of oxygen per decilitre. What is its saturation?'
      }
    },
    {
      name: 'Oxygen delivery',
      expr: 'DO2 = 10*CO*CaO2', tex: 'D_{\\mathrm{O_2}} = 10 \\times \\text{CO} \\times C_{a\\mathrm{O_2}}',
      vars: {
        DO2: { name: 'oxygen delivery (mL/min)', tex: 'D_{\\mathrm{O_2}}' },
        CO: { name: 'cardiac output (L/min)', value: 5, tex: '\\text{CO}' },
        CaO2: { name: 'arterial oxygen content (mL/dL)', value: 20, tex: 'C_{a\\mathrm{O_2}}' }
      },
      note: 'The 10 turns litres of blood into decilitres. About 1,000 mL/min at rest, of which about a quarter is used.',
      stories: { DO2: 'The heart pumps {CO} L/min of blood carrying {CaO2} mL of oxygen per decilitre. How much oxygen is delivered each minute, in mL?', CO: 'Blood carries only {CaO2} mL of oxygen per decilitre. What cardiac output, in L/min, keeps the delivery at {DO2} mL/min?' }
    },
    {
      name: 'The Fick principle: oxygen used',
      expr: 'VO2 = 10*CO*(CaO2 - CvO2)', tex: '\\dot{V}_{\\mathrm{O_2}} = 10 \\times \\text{CO} \\times (C_{a\\mathrm{O_2}} - C_{v\\mathrm{O_2}})',
      vars: {
        VO2: { name: 'oxygen consumption (mL/min)', tex: '\\dot{V}_{\\mathrm{O_2}}' },
        CO: { name: 'cardiac output (L/min)', value: 5, tex: '\\text{CO}' },
        CaO2: { name: 'arterial oxygen content (mL/dL)', value: 20, tex: 'C_{a\\mathrm{O_2}}' },
        CvO2: { name: 'mixed venous oxygen content (mL/dL)', value: 15, tex: 'C_{v\\mathrm{O_2}}' }
      },
      note: 'Adolf Fick\'s principle (1870): what the body uses is what arrives minus what returns. Turned round, it gives the cardiac output from the oxygen used and the arterial–venous difference.',
      practice: { unknowns: ['VO2', 'CO', 'CvO2'] },
      stories: { CO: 'A patient uses {VO2} mL of oxygen a minute; arterial blood carries {CaO2} and mixed venous blood {CvO2} mL/dL. What is the cardiac output, in L/min?', CvO2: 'With a cardiac output of {CO} L/min, an arterial content of {CaO2} mL/dL and an oxygen use of {VO2} mL/min, what is the venous oxygen content, in mL/dL?' }
    },
    {
      name: 'Saturation on the standard curve',
      expr: 'S = 1/(23400/(P^3 + 150*P) + 1)', tex: 'S = \\dfrac{1}{\\dfrac{23400}{P^3 + 150\\,P} + 1}',
      vars: {
        S: { name: 'haemoglobin saturation', q: 'ratio', unit: '%', min: 0, max: 100 },
        P: { name: 'PO₂ (mmHg)', value: 60, min: 0, max: 700 }
      },
      note: 'Severinghaus\'s 1979 fit to the standard curve at pH 7.4 and 37 °C, with PO₂ in mmHg. Solved for P it gives the PO₂ that goes with a pulse-oximeter reading — a rough guide only.',
      stories: { S: 'What is the saturation of haemoglobin at a PO₂ of {P} mmHg (standard curve)?', P: 'A pulse oximeter reads {S}. Roughly what arterial PO₂, in mmHg, does that correspond to on the standard curve?' }
    }
  ],
  examples: [
    {
      title: 'Anaemia against lung disease',
      q: 'Ana has healthy lungs but severe anaemia: haemoglobin 7.5 g/dL (75 g/L), saturation 98 %, PaO₂ 95 mmHg. Ben has lung disease: haemoglobin 15 g/dL, saturation 88 %, PaO₂ 55 mmHg. Both have a cardiac output of 5 L/min. Who delivers more oxygen?',
      steps: [
        'Ana: $1.34 \\times 7.5 \\times 0.98 + 0.003 \\times 95 = 9.85 + 0.29 = 10.1$ mL/dL.',
        'Ben: $1.34 \\times 15 \\times 0.88 + 0.003 \\times 55 = 17.69 + 0.17 = 17.9$ mL/dL.',
        'Delivery: Ana $10 \\times 5 \\times 10.1 \\approx 510$ mL/min; Ben $10 \\times 5 \\times 17.9 \\approx 890$ mL/min.',
        'Ana\'s oximeter shows a reassuring 98 % while she delivers far less oxygen; her heart will speed up to compensate.'
      ],
      a: 'Ben, with about 890 mL/min against 510 — despite his lower saturation.'
    },
    {
      title: 'A faulty boiler',
      q: 'After a night in a house with a faulty boiler, 30 % of a man\'s haemoglobin (15 g/dL) is bound to carbon monoxide, and almost all the rest carries oxygen: 68 % of his haemoglobin is oxyhaemoglobin. His PaO₂ is a normal 95 mmHg. What is his oxygen content, and what does a finger oximeter show?',
      steps: [
        'Content: $1.34 \\times 15 \\times 0.68 + 0.003 \\times 95 = 13.67 + 0.29 \\approx 14.0$ mL/dL, against about 20 normally.',
        'An ordinary two-wavelength oximeter counts carboxyhaemoglobin as if it were oxyhaemoglobin, so it shows about 98 %.',
        'The left shift caused by carbon monoxide also makes the remaining oxygen harder to release. Hospital blood-gas analysers with a CO-oximeter measure carboxyhaemoglobin directly.'
      ],
      a: 'About 14 mL/dL — 30 % less than normal — while the oximeter reads about 98 %.'
    },
    {
      title: 'Muscle at work',
      q: 'In exercising muscle the capillary PO₂ may fall to 20 mmHg while the blood becomes more acid (pH 7.2) and warmer (39 °C). Compare the saturation at 20 mmHg with the standard curve.',
      steps: [
        'Standard curve at 20 mmHg: about 32 %.',
        'Right-shifted curve at pH 7.2 and 39 °C: about 18 % (the P50 rises from 27 to about 37 mmHg).',
        'Starting from about 98 %, the muscle takes 80 points of saturation instead of 66: about a fifth more oxygen from the same blood, with no extra work by the heart.'
      ],
      a: 'About 18 % instead of 32 % — roughly a fifth more oxygen released.'
    }
  ],
  quiz: [
    { q: 'A person with severe anaemia and healthy lungs puts on a pulse oximeter. It will most likely read…', choices: ['very low, around 70 %', 'normal, around 97 %', 'above 100 %', 'nothing, because there is too little haemoglobin'], a: 1,
      why: 'Saturation is a percentage of the haemoglobin present, and the little there is is fully loaded. It is the content, not the saturation, that is low.' },
    { q: 'Why is the flat top of the dissociation curve useful?', choices: ['It lets the tissues extract more oxygen', 'Arterial saturation stays high even if the PO₂ in the lungs falls moderately', 'It stops oxygen from being toxic', 'It keeps carbon dioxide in the blood'], a: 1,
      why: 'Between 100 and 60 mmHg the saturation falls only from about 98 to 91 %: a margin for altitude and mild lung disease.' },
    { q: 'Which change shifts the curve to the right, helping haemoglobin release oxygen?', choices: ['Cooling the blood', 'Alkalosis after over-breathing', 'Fever and acidity', 'Carbon monoxide'], a: 2,
      why: 'Heat, acid, CO₂ and 2,3-BPG lower haemoglobin\'s affinity for oxygen (the Bohr effect); the other three shift the curve left.' },
    { q: 'Breathing 100 % oxygen roughly doubles the oxygen content of a healthy person\'s arterial blood.', a: false,
      why: 'Haemoglobin is already about 98 % saturated; the content rises from about 20 to about 22 mL/dL, mostly as extra dissolved oxygen.' },
    { q: 'Haemoglobin 12 g/dL, saturation 95 %, PaO₂ 80 mmHg. What is the arterial oxygen content, in mL per dL?', answer: 15.5,
      why: '1.34 × 12 × 0.95 + 0.003 × 80 = 15.28 + 0.24 ≈ 15.5 mL/dL.' }
  ],
  applications: ['Pulse oximetry at home, in clinics, ambulances and operating theatres.', 'Weighing haemoglobin against oxygen delivery when deciding on a blood transfusion.', 'High-flow and hyperbaric oxygen for carbon monoxide poisoning.', 'Training at altitude, where 2,3-BPG and haemoglobin rise.'],
  sim: 'resp-o2-curve'
},

{
  id: 'control-of-breathing', parent: 'breathing', title: 'The control of breathing', level: 2,
  short: 'A rhythm generator in the brainstem sets each breath, and chemical sensors adjust it — mainly to the carbon dioxide and acidity of the blood, and only secondarily to a lack of oxygen. That is why you cannot hold your breath for long, why over-breathing makes your fingers tingle, and why opioids can stop breathing.',
  keywords: ['control of breathing', 'respiratory centre', 'brainstem', 'medulla', 'chemoreceptors', 'carotid body', 'carbon dioxide', 'PaCO2', 'hypoventilation', 'hyperventilation', 'breath-holding', 'respiratory acidosis', 'respiratory alkalosis', 'altitude', 'acclimatisation'],
  prereq: ['gas-exchange', 'acid-base-balance', 'homeostasis-feedback', 'chemistry:buffers'],
  related: ['oxygen-transport', 'sleep-apnea', 'copd', 'poisoning-overdose', 'brain-regions', 'anxiety-disorders'],
  body: `
Hold your breath and time it. For a while nothing happens; then the urge to breathe builds until, somewhere between half a minute and a minute and a half for most people, it becomes overwhelming — the **break point**. What forces you to breathe is not, as most people assume, a lack of oxygen: it is the carbon dioxide building up in your blood. Breathe fast and deep for a minute first, blowing carbon dioxide off, and you can hold on much longer — while your oxygen keeps falling. That is exactly what makes over-breathing before an underwater swim so dangerous.

### The rhythm generator
The basic rhythm comes from networks of neurons in the **brainstem**, in the medulla, with the pons smoothing the switch between breathing in and out ([[brain-regions]]). Their output runs down the phrenic nerves, which leave the spinal cord high in the neck — why a high neck injury can stop breathing — to the diaphragm, and along other nerves to the rib muscles. The conscious brain can override the rhythm for speech, song, sighs and breath-holding, but only for a while: the brainstem always wins. Stretch receptors in the lungs, irritant receptors that trigger coughing, signals from moving limbs and emotion all adjust it.

### The sensors: carbon dioxide first
Two sets of chemical sensors tune the breathing to the body's needs:

- **Central chemoreceptors**, near the surface of the medulla, are bathed in cerebrospinal fluid. Carbon dioxide crosses into that fluid easily and forms carbonic acid, and these cells respond to the fall in pH. They supply most of the response to carbon dioxide.
- **Peripheral chemoreceptors**, the tiny carotid bodies at the fork of each carotid artery (with the aortic bodies), respond within seconds to a low arterial oxygen — mainly below about 60 mmHg (8 kPa) — and also to CO₂ and to acid from any source, which is why people with diabetic ketoacidosis breathe deeply.

The link between breathing and carbon dioxide is one line of arithmetic. At rest the body makes about 200 mL of CO₂ a minute, and the alveolar ventilation has to carry it away:

$$P_{a\\mathrm{CO_2}} = \\frac{0.863 \\times \\dot{V}_{\\mathrm{CO_2}}}{\\dot{V}_A}$$

Halve the alveolar ventilation and the PaCO₂ doubles, from 40 to 80 mmHg; double it and PaCO₂ halves. Because carbon dioxide forms an acid, $\\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3-}$, it also sets the pH of the blood ([[acid-base-balance]], [[chemistry:buffers|buffers]]):

$$\\text{pH} = 6.1 + \\log_{10}\\frac{\\mathrm{[\\ce{HCO3-}]}}{0.03 \\times P_{a\\mathrm{CO_2}}}$$

The controller holds the PaCO₂ within about 35–45 mmHg (4.7–6.0 kPa) with remarkable precision: each extra mmHg typically raises the ventilation by one to several litres a minute, though people differ widely.

### Oxygen: the back-up
Down to an arterial PO₂ of about 60 mmHg, oxygen hardly influences breathing — the flat top of the [[oxygen-transport|dissociation curve]] means there is no need. Below it the carotid bodies take over. At altitude they drive the first rise in breathing, which lowers the PaCO₂ and so, by the alveolar gas equation, raises the alveolar oxygen ([[gas-exchange]]). Over days the kidneys excrete bicarbonate, the pH of the brain's fluid readjusts, and breathing rises further: **acclimatisation**. Alveolar samples taken on Everest's summit in 1981 showed a PCO₂ of about 7.5 mmHg, a fifth of normal — extreme breathing that makes survival there possible.

Going up too fast outpaces this: **acute mountain sickness** (headache, nausea, poor sleep) is common above about 2,500 m, and fluid on the lungs or brain can kill. Breathlessness at rest, confusion or an unsteady walk at altitude call for immediate descent and medical help.

### When the control fails
- **Hypoventilation**: opioids, sedatives and alcohol (especially together), anaesthesia, brainstem strokes, weak breathing muscles and severe obesity blunt the drive or the pump. CO₂ rises and the blood turns acid. Extra oxygen can correct the saturation while the CO₂ keeps climbing, so a normal oximeter reading does not prove that someone is breathing enough.
- **CO₂ retention in severe COPD**: in some people with [[copd]], high concentrations of oxygen raise the CO₂ further — mainly by upsetting the matching of air to blood, not, as used to be taught, by switching off a "hypoxic drive". Guidelines therefore aim for a saturation of about 88–92 % in people at risk (British Thoracic Society, 2017).
- **Hyperventilation**: anxiety and panic can drive breathing beyond the body's needs ([[anxiety-disorders]]). The PaCO₂ falls, the blood becomes alkaline, brain vessels narrow, and people feel light-headed with tingling lips and fingers. Slow breathing helps; breathing into a paper bag is no longer advised, because fast breathing can also come from asthma, a clot or a heart attack.
- **Unstable control**: the waxing and waning breathing of heart failure, and central [[sleep-apnea|sleep apnoea]], come from a controller that over-reacts.

> [!warn] Breathing that is very slow, shallow or has stopped, with drowsiness from which the person cannot be woken, pinpoint pupils or blue or grey lips — for example after opioids, other sedatives or alcohol — is an emergency. Call your local emergency number and follow the dispatcher's instructions; where naloxone is available it can reverse an opioid overdose ([[poisoning-overdose]]).

> [!warn] Never over-breathe before swimming underwater or free-diving. Lowering your CO₂ removes the warning, and you can lose consciousness from lack of oxygen before you feel any need to breathe.
`,
  ideas: [
    'A rhythm generator in the brainstem sets breathing; the conscious brain can override it only briefly.',
    'Carbon dioxide, sensed as acidity by central chemoreceptors, is the main drive: PaCO₂ = 0.863 × V̇CO₂ / V̇A.',
    'Oxygen matters mainly below an arterial PO₂ of about 60 mmHg, through the carotid bodies — the drive behind acclimatisation to altitude.',
    'Hypoventilation raises CO₂ and makes the blood acid; supplemental oxygen can hide it from a pulse oximeter.',
    'Hyperventilation lowers CO₂ and makes the blood alkaline: light-headedness and tingling.'
  ],
  pitfalls: [
    'Low oxygen is what makes us breathe — At sea level the drive comes mainly from carbon dioxide; oxygen takes over only when it falls well below normal.',
    'A normal oxygen saturation means breathing is adequate — On supplemental oxygen, someone can have a normal saturation while CO₂ builds up dangerously.',
    'People with COPD breathe only because of a "hypoxic drive" that oxygen switches off — The CO₂ rise some of them show on high-flow oxygen comes mostly from worse ventilation–perfusion matching; the answer is controlled oxygen with a target range, not withholding oxygen.'
  ],
  formulas: [
    {
      name: 'Carbon dioxide and alveolar ventilation',
      expr: 'PaCO2 = 0.863*VCO2/VA', tex: 'P_{a\\mathrm{CO_2}} = \\frac{0.863 \\times \\dot{V}_{\\mathrm{CO_2}}}{\\dot{V}_A}',
      vars: {
        PaCO2: { name: 'arterial PCO₂ (mmHg)', tex: 'P_{a\\mathrm{CO_2}}' },
        VCO2: { name: 'CO₂ produced (mL/min)', value: 200, tex: '\\dot{V}_{\\mathrm{CO_2}}' },
        VA: { name: 'alveolar ventilation (L/min)', value: 4.3, tex: '\\dot{V}_A' }
      },
      note: 'The 0.863 converts mL/min of CO₂ (dry, at standard conditions) and L/min of moist alveolar gas at body temperature into mmHg, so the variables are plain numbers in those units.',
      stories: { PaCO2: 'A person makes {VCO2} mL of CO₂ a minute and has an alveolar ventilation of {VA} L/min. What is the PaCO₂, in mmHg?', VA: 'After a sedative, the PaCO₂ of someone making {VCO2} mL of CO₂ a minute rises to {PaCO2} mmHg. What is the alveolar ventilation, in L/min?' }
    },
    {
      name: 'Blood pH from bicarbonate and CO₂ (Henderson–Hasselbalch)',
      expr: 'pH = 6.1 + log(HCO3/(0.03*PaCO2))', tex: '\\text{pH} = 6.1 + \\log_{10}\\frac{\\mathrm{[\\ce{HCO3-}]}}{0.03 \\times P_{a\\mathrm{CO_2}}}',
      vars: {
        pH: { name: 'blood pH', tex: '\\text{pH}' },
        HCO3: { name: 'bicarbonate (mmol/L)', value: 24, tex: '\\mathrm{[\\ce{HCO3-}]}' },
        PaCO2: { name: 'arterial PCO₂ (mmHg)', value: 40, tex: 'P_{a\\mathrm{CO_2}}' }
      },
      note: '6.1 is the pK of the carbonic acid system in plasma and 0.03 mmol/L per mmHg the solubility of CO₂, so bicarbonate is in mmol/L (= mEq/L) and PCO₂ in mmHg. Normal arterial pH is 7.35–7.45.',
      stories: { pH: 'A blood gas shows a bicarbonate of {HCO3} mmol/L and a PaCO₂ of {PaCO2} mmHg. What is the pH?', PaCO2: 'The pH is {pH} with a bicarbonate of {HCO3} mmol/L. What is the PaCO₂, in mmHg?' }
    }
  ],
  examples: [
    {
      title: 'An opioid slows the breathing',
      q: 'After an opioid, the alveolar ventilation of a person making 200 mL of CO₂ a minute falls from 4.3 to 2.6 L/min. Find the PaCO₂, the alveolar PO₂ on room air and the pH (bicarbonate 24 mmol/L). What changes on 28 % oxygen?',
      steps: [
        '$P_{a\\mathrm{CO_2}} = 0.863 \\times 200 / 2.6 \\approx 66$ mmHg.',
        'Alveolar PO₂ on air: $0.21 \\times 713 - 66.4/0.8 = 149.7 - 83.0 = 66.8$ mmHg; the arterial value might be about 62 mmHg, a saturation near 91 %.',
        'pH $= 6.1 + \\log_{10}\\left(24 / (0.03 \\times 66.4)\\right) = 6.1 + \\log_{10} 12.05 \\approx 7.18$: an acute respiratory acidosis.',
        'On 28 % oxygen: $0.28 \\times 713 - 83.0 = 116.7$ mmHg, a saturation of about 98 %, yet the PaCO₂ and pH are unchanged. The oximeter looks reassuring while the person is still dangerously under-breathing.'
      ],
      a: 'PaCO₂ about 66 mmHg and pH about 7.18; oxygen restores the saturation but not the CO₂.'
    },
    {
      title: 'Over-breathing in a panic attack',
      q: 'During a panic attack a young woman doubles her alveolar ventilation without making more CO₂. What happens to her PaCO₂ and pH?',
      steps: [
        'PaCO₂ halves, from 40 to about 20 mmHg.',
        'With the bicarbonate still at 24 mmol/L: pH $= 6.1 + \\log_{10}(24/0.6) \\approx 7.70$. Within minutes the body\'s buffers lower the bicarbonate to about 20, giving about 7.62.',
        'The alkaline blood narrows brain vessels and lowers ionised calcium: light-headedness, tingling around the mouth and in the fingers, sometimes cramps. Slowing the breathing reverses it.'
      ],
      a: 'PaCO₂ about 20 mmHg and pH about 7.6–7.7: a respiratory alkalosis.'
    }
  ],
  quiz: [
    { q: 'While holding your breath, what mainly forces you to breathe again?', choices: ['Falling oxygen', 'Rising carbon dioxide and acidity', 'Stretch receptors in the empty lungs', 'The heart slowing down'], a: 1,
      why: 'Central chemoreceptors sense the acid formed from rising CO₂. That is why over-breathing first, which lowers CO₂, lets you hold on longer — while oxygen keeps falling.' },
    { q: 'After an operation, a patient on oxygen has a saturation of 98 % but is drowsy and breathing six times a minute after an opioid. This means…', choices: ['breathing is adequate, since the saturation is normal', 'the CO₂ may be dangerously high: the oxygen is hiding the hypoventilation', 'the oximeter must be faulty', 'more oxygen is all that is needed'], a: 1,
      why: 'Oxygen corrects the saturation but does nothing for the CO₂; slow, drowsy breathing after an opioid needs urgent assessment of the breathing itself.' },
    { q: 'If the alveolar ventilation halves while CO₂ production stays the same, the PaCO₂ goes from 40 mmHg to…', answer: 80, unit: 'mmHg',
      why: 'PaCO₂ = 0.863 × V̇CO₂ / V̇A is inversely proportional to the alveolar ventilation.' },
    { q: 'Breathing into a paper bag is the recommended first aid for anyone who is breathing fast.', a: false,
      why: 'Fast breathing may come from asthma, a clot in the lung, a heart attack or diabetic ketoacidosis, where rebreathing would do harm. Calm, slow breathing and medical assessment are advised.' },
    { q: 'At altitude, why does breathing harder raise the oxygen in the alveoli?', choices: ['It raises the barometric pressure', 'It lowers the alveolar CO₂, leaving more room for oxygen', 'It increases the haemoglobin', 'It warms the air'], a: 1,
      why: 'In the alveolar gas equation, PAO₂ = FiO₂(Patm − 47) − PaCO₂/R: a lower PaCO₂ means a higher PAO₂.' }
  ],
  applications: ['Monitoring breathing and exhaled CO₂ (capnography) during sedation and after surgery.', 'Naloxone programmes for people at risk of opioid overdose.', 'Oxygen target ranges for people with COPD.', 'Acclimatisation plans for trekkers and climbers.'],
  sim: 'resp-control'
},

{
  id: 'lung-function-tests', parent: 'breathing', title: 'Spirometry and lung function', level: 2,
  short: 'Blowing out as hard and as long as possible into a spirometer measures how much air the lungs hold and how fast it can leave. FEV₁, FVC and their ratio tell narrowed airways (obstruction) from small, stiff lungs (restriction), and follow disease and treatment over the years.',
  keywords: ['spirometry', 'FEV1', 'FVC', 'FEV1/FVC ratio', 'peak expiratory flow', 'PEF', 'flow–volume loop', 'obstruction', 'restriction', 'bronchodilator response', 'lung volumes', 'total lung capacity', 'DLCO', 'per cent predicted', 'lower limit of normal', 'z-score'],
  prereq: ['ventilation', 'respiratory-system', 'math:exponential-functions'],
  related: ['asthma', 'copd', 'gas-exchange', 'lab-tests', 'diagnostic-accuracy', 'smoking'],
  body: `
"Breathe in as deeply as you can… seal your lips… and *blast* it out! Keep going, keep going, keep going…" Anyone who has had spirometry remembers the coaching. The test takes a few minutes, needs only a mouthpiece and a flow sensor, and is still the single most useful measurement of how well the lungs work.

### What is measured
After the deepest possible breath in, the person breathes out as hard and as long as possible:

- **FVC**, the forced vital capacity: the total volume blown out — about 4–5 L in a young adult man, less in women and in shorter and older people.
- **FEV₁**, the forced expiratory volume in one second: a healthy young adult blows out about 80 % of the FVC in the first second.
- **FEV₁/FVC**, their ratio: the key to telling narrowed airways from small lungs.
- **PEF**, the peak expiratory flow, reached in the first tenth of a second — roughly 350–700 L/min in healthy adults, depending on age, sex and height. A cheap peak-flow meter measures it at home, which makes it useful for following [[asthma]].

Results are compared with **predicted values** for a healthy person of the same age, sex and height, today usually from the Global Lung Function Initiative equations (in 2023 the American Thoracic Society recommended their race-neutral version). They are reported as a percentage of predicted and as a **z-score**; a value below the fifth percentile of healthy people — a z-score below −1.645, the **lower limit of normal** — counts as abnormal.

### Obstruction and restriction

| Pattern | FEV₁ | FVC | FEV₁/FVC | Typical causes |
|---|---|---|---|---|
| Normal | normal | normal | about 0.75–0.85 in young adults | — |
| Obstructive | reduced | normal or reduced | low: below 0.70, or below the lower limit | asthma, COPD, bronchiectasis |
| Restrictive | reduced | reduced | normal or high | fibrosis, obesity, chest-wall or muscle disease |

In **obstruction**, air cannot leave fast enough through narrowed or collapsing airways, so FEV₁ falls more than FVC. In **restriction** the lungs are small or stiff: both fall together and the ratio stays normal or rises. A low FVC with a normal ratio only *suggests* restriction; measuring the total lung capacity, in a body box or by gas dilution, confirms it.

### Why obstruction lowers the ratio
A forced breath out empties the lung rather like a leaky balloon: exponentially, with a **time constant** τ set by the airway resistance and the lung's elasticity:

$$V(t) = \\text{FVC}\\,\\left(1 - e^{-t/\\tau}\\right) \\quad\\Rightarrow\\quad \\frac{\\text{FEV}_1}{\\text{FVC}} = 1 - e^{-1\\,\\text{s}/\\tau}$$

With τ ≈ 0.6 s the ratio is about 0.81. Narrow airways ([[asthma]]) or floppy lungs whose small airways collapse ([[copd]]) lengthen τ; at 1.25 s the ratio falls to 0.55. Stiff lungs empty quickly, so their ratio is normal or high even though their volumes are small ([[math:exponential-functions|exponential functions]]). Real lungs empty as many regions with different time constants, which is why an obstructed flow–volume curve is scooped.

### The flow–volume loop
Plotting flow against volume gives a picture that experienced eyes read at a glance: a sharp peak and a straight descent in health; a scooped, concave descent in obstruction; a small but normally shaped loop in restriction; a flat top when the windpipe or larynx is narrowed; a slow, rounded peak when the effort was poor. The spirometer simulation below draws all of them.

### The bronchodilator test
The test is often repeated about 15 minutes after an inhaled bronchodilator. The 2022 ATS/ERS interpretation standard counts a rise in FEV₁ or FVC of more than **10 % of the predicted value** as a significant response; the older rule — at least 12 % and 200 mL above the starting value — is still used by some guidelines, including GINA for asthma. A large response supports asthma; obstruction that persists after the bronchodilator (FEV₁/FVC below 0.70) defines COPD in the GOLD strategy.

### Other tests
- **Lung volumes**: in an adult the total lung capacity is about 6 L, the residual volume that never leaves about 1.2–1.5 L, and the volume at the end of a quiet breath about 2.5–3 L.
- **Diffusing capacity** (DLCO): how well gas crosses into the blood ([[gas-exchange]]).
- **Exhaled nitric oxide** (FeNO): a marker of the kind of airway inflammation that responds to inhaled corticosteroids.
- **Challenge tests**, walking tests, arterial blood gases and pulse oximetry.

A result is only as good as the blow: the standards ask for at least three acceptable attempts, the best two within 150 mL of each other. Avoid smoking, heavy meals and hard exercise just before, wear loose clothing, and ask whether to take your usual inhalers beforehand. Tell the staff about recent surgery, a recent heart problem or chest pain, as the test may need to wait.
`,
  ideas: [
    'Spirometry measures FVC (all the air you can blow out) and FEV₁ (the first second); their ratio separates obstruction from restriction.',
    'Obstruction: FEV₁/FVC below 0.70 or the lower limit of normal. Restriction: small volumes with a normal ratio, confirmed by measuring lung volumes.',
    'A forced breath empties like a leaky balloon: FEV₁/FVC ≈ 1 − e^(−1 s/τ), so longer time constants give lower ratios.',
    'A bronchodilator response of more than 10 % of predicted supports asthma; obstruction that persists after it defines COPD.',
    'Results are compared with predicted values for age, sex and height, as a percentage of predicted and as z-scores.'
  ],
  pitfalls: [
    'A ratio below 0.70 always means disease — The ratio falls naturally with age; the fixed 0.70 cut-off over-diagnoses COPD in older people and can miss it in younger ones, which is why many experts prefer the lower limit of normal.',
    'Normal spirometry rules out asthma — Asthma is variable: tests between episodes can be normal, and repeated measurements, a bronchodilator test or a challenge test may be needed.',
    'A low FVC means restriction — Only if a lung-volume test confirms a low total lung capacity; poor effort or air trapping can lower the FVC too.'
  ],
  formulas: [
    {
      name: 'The FEV₁/FVC ratio',
      expr: 'ratio = FEV1/FVC', tex: '\\text{ratio} = \\frac{\\text{FEV}_1}{\\text{FVC}}',
      vars: {
        ratio: { name: 'FEV₁/FVC ratio', tex: '\\text{ratio}' },
        FEV1: { name: 'FEV₁ (volume in the first second)', q: 'volume', unit: 'L', value: 3.2, tex: '\\text{FEV}_1' },
        FVC: { name: 'forced vital capacity', q: 'volume', unit: 'L', value: 4.2, tex: '\\text{FVC}' }
      },
      note: 'Below 0.70 (or below the lower limit of normal for age) means airflow obstruction.',
      stories: { ratio: 'A spirometry test gives FEV₁ {FEV1} and FVC {FVC}. What is the ratio?', FEV1: 'The FVC is {FVC} and the ratio {ratio}. What is the FEV₁?' }
    },
    {
      name: 'Per cent of predicted',
      expr: 'p = x/xp', tex: 'p = \\frac{x}{x_{\\text{pred}}}',
      vars: {
        p: { name: 'per cent of predicted', q: 'ratio', unit: '%' },
        x: { name: 'measured value', q: 'volume', unit: 'L', value: 2.35 },
        xp: { name: 'predicted value for age, sex and height', q: 'volume', unit: 'L', value: 3.9, tex: 'x_{\\text{pred}}' }
      },
      note: 'For COPD, GOLD grades the post-bronchodilator FEV₁: 80 % or more is grade 1, 50–79 % grade 2, 30–49 % grade 3, below 30 % grade 4.',
      stories: { p: 'A man blows an FEV₁ of {x}; the predicted value is {xp}. What percentage of predicted is that?' }
    },
    {
      name: 'Bronchodilator response',
      expr: 'BDR = (post - pre)/pred', tex: '\\text{BDR} = \\frac{x_{\\text{post}} - x_{\\text{pre}}}{x_{\\text{pred}}}',
      vars: {
        BDR: { name: 'bronchodilator response, as a share of predicted', q: 'ratio', unit: '%', signed: true, tex: '\\text{BDR}' },
        post: { name: 'FEV₁ after the bronchodilator', q: 'volume', unit: 'L', value: 3.62, tex: 'x_{\\text{post}}' },
        pre: { name: 'FEV₁ before', q: 'volume', unit: 'L', value: 2.83, tex: 'x_{\\text{pre}}' },
        pred: { name: 'predicted FEV₁', q: 'volume', unit: 'L', value: 3.9, tex: 'x_{\\text{pred}}' }
      },
      note: 'The 2022 ATS/ERS standard: more than 10 % of predicted (for FEV₁ or FVC) is a significant response. Some guidelines still use at least 12 % and 200 mL above the starting value.',
      stories: { BDR: 'FEV₁ rises from {pre} to {post} after a bronchodilator; the predicted value is {pred}. What is the response, as a share of predicted?' }
    },
    {
      name: 'Emptying time constant and FEV₁/FVC',
      expr: 'ratio = 1 - exp(-t1/tau)', tex: '\\text{ratio} = 1 - e^{-t_1/\\tau}',
      vars: {
        ratio: { name: 'FEV₁/FVC ratio', tex: '\\text{ratio}' },
        t1: { name: 'time for FEV₁', q: 'time', unit: 's', value: 1, fixed: true, tex: 't_1' },
        tau: { name: 'emptying time constant', q: 'time', unit: 's', value: 0.6, tex: '\\tau' }
      },
      note: 'A one-compartment "leaky balloon" model — a teaching simplification that shows why slow emptying lowers the ratio, not a clinical formula.',
      stories: { ratio: 'A lung empties with a time constant of {tau}. What FEV₁/FVC ratio does the simple model predict?', tau: 'A spirogram shows an FEV₁/FVC of {ratio}. What emptying time constant does the simple model imply?' }
    }
  ],
  examples: [
    {
      title: 'Reading a spirogram',
      q: 'A 62-year-old former smoker blows FEV₁ 2.35 L and FVC 3.83 L; the predicted values are 3.9 L and 4.8 L. After a bronchodilator: FEV₁ 2.54 L, FVC 4.02 L. Interpret the result.',
      steps: [
        'Ratio before: $2.35/3.83 = 0.61$; after: $2.54/4.02 = 0.63$. Below 0.70 both times: obstruction.',
        'FEV₁ after the bronchodilator: $2.54/3.9 = 0.65$, i.e. 65 % of predicted.',
        'Response: $(2.54 - 2.35)/3.9 = 0.049$, i.e. 4.9 % of predicted — below the 10 % threshold, so not significant.',
        'Persistent obstruction in a former smoker with symptoms fits COPD; with FEV₁ at 65 % it would be GOLD grade 2 (moderate). The diagnosis also rests on the history and on ruling out other causes.'
      ],
      a: 'Persistent, moderate airflow obstruction, as in COPD.'
    },
    {
      title: 'An obstruction that reverses',
      q: 'A 30-year-old with episodes of wheeze blows FEV₁ 2.83 L and FVC 4.48 L; after a bronchodilator FEV₁ is 3.62 L and FVC 4.69 L. Her predicted FEV₁ is 3.9 L.',
      steps: [
        'Ratio before: $2.83/4.48 = 0.63$ — obstructed. After: $3.62/4.69 = 0.77$ — normal.',
        'Change in FEV₁: $3.62 - 2.83 = 0.79$ L, which is $0.79/3.9 = 0.20$, i.e. 20 % of predicted, and 28 % above her starting value.',
        'Far above both thresholds: a large, reversible obstruction that supports asthma.'
      ],
      a: 'A significant bronchodilator response (about 20 % of predicted): variable, reversible obstruction, as in asthma.'
    },
    {
      title: 'A time constant from a ratio',
      q: 'In the leaky-balloon model, what emptying time constant gives an FEV₁/FVC of 0.55?',
      steps: [
        '$0.55 = 1 - e^{-1/\\tau}$, so $e^{-1/\\tau} = 0.45$.',
        '$\\tau = -1/\\ln 0.45 = 1/0.799 \\approx 1.25$ s.',
        'About twice the healthy value of 0.6 s: the lung takes twice as long to empty.'
      ],
      a: 'About 1.25 s.'
    }
  ],
  quiz: [
    { q: 'FEV₁ is 1.9 L (55 % of predicted) and FVC 4.1 L (90 % of predicted). The pattern is…', choices: ['normal', 'obstructive', 'restrictive', 'impossible to say'], a: 1,
      why: 'The ratio 1.9/4.1 = 0.46 is far below 0.70 with a preserved FVC: obstruction.' },
    { q: 'The FVC is 60 % of predicted and the FEV₁/FVC is 0.90. What is the sensible next step?', choices: ['Diagnose COPD', 'Measure the total lung capacity to confirm restriction', 'Nothing: the ratio is normal, so the lungs are normal', 'Give a bronchodilator and diagnose asthma'], a: 1,
      why: 'A low FVC with a normal or high ratio suggests restriction, which only a lung-volume test can confirm.' },
    { q: 'Normal spirometry on a good day rules out asthma.', a: false,
      why: 'Asthma is variable; between episodes the airways can be normal. Repeated peak-flow readings, a bronchodilator test or a challenge test may be needed.' },
    { q: 'In the leaky-balloon model, what FEV₁/FVC ratio does an emptying time constant of 1.2 s give?', answer: 0.565,
      why: '1 − e^(−1/1.2) = 1 − 0.435 = 0.565: obstruction.' },
    { q: 'Why does the fixed ratio of 0.70 tend to over-diagnose COPD in healthy older people?', choices: ['Older people blow harder', 'The lungs lose elastic recoil with age, so the normal ratio falls', 'Spirometers are less accurate in older people', 'The FVC rises with age'], a: 1,
      why: 'The normal FEV₁/FVC declines with age; the lower limit of normal adjusts for this, a fixed cut-off does not.' }
  ],
  applications: ['Diagnosing asthma and COPD and grading their severity.', 'Following lung disease and its treatment over years.', 'Checking fitness for lung surgery, and screening workers exposed to dusts.', 'Home peak-flow diaries in asthma action plans.'],
  sim: 'resp-spirometer'
}

);
