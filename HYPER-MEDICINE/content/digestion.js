/* HYPER-MEDICINE · content/digestion.js — topic "digestion": the digestive tract, digestion
 * and absorption, the liver and the gut microbiome. Simulations in sims/digestive.js. */
Hyper.add(

{
  id: 'digestive-system', parent: 'digestion', title: 'The digestive system', level: 1,
  short: 'A single muscular tube from mouth to anus, helped by the salivary glands, pancreas, liver and gallbladder, that breaks food down, absorbs what the body needs and recycles about nine litres of fluid a day.',
  keywords: ['digestive system', 'gut', 'gastrointestinal tract', 'oesophagus', 'esophagus', 'stomach', 'small intestine', 'large intestine', 'colon', 'pancreas', 'gallbladder', 'peristalsis', 'transit time', 'bowel habit', 'portal vein', 'enteric nervous system'],
  prereq: ['tissue-types', 'cell-structure'],
  related: ['digestion-absorption', 'liver-function', 'gut-microbiome', 'reflux-ulcers', 'body-fluids', 'common-cancers'],
  body: `
It is one o'clock, and you eat a cheese sandwich and an apple. Teeth grind the food and saliva wets it — the glands make about a litre a day, carrying an enzyme that starts cutting starch into sugar. A swallow hands each mouthful to the **oesophagus**, a muscular tube about 25 cm long that squeezes it down to the stomach in five to ten seconds; this wave of squeezing, **peristalsis**, works even if you are upside down. The **stomach** stores the meal, bathes it in acid and churns it into a soupy mix called chyme for two to four hours, then lets it through a squirt at a time into the **small intestine**. There, over the next few hours, enzymes from the pancreas and bile from the liver finish the digestion, and the lining absorbs nearly all the nutrients. What is left — fibre, water, bacteria and cells shed from the lining — moves slowly through the **large intestine** (the colon) for a day or more, where water is taken back and bacteria ferment the fibre, before leaving as stool. For most people the whole trip takes one to three days.

### One tube and its helpers
The gut is a single tube open at both ends, so its inside is, strictly, outside the body: food only enters you when it crosses the lining. Rings of muscle (sphincters) keep the traffic moving one way, and three organs outside the tube pour in their products: the **salivary glands**, the **pancreas** (digestive enzymes, and bicarbonate to neutralise the stomach's acid) and the **liver**, whose bile is stored and concentrated in the **gallbladder**.

| Part | Size (adult, roughly) | Time a meal spends there | Main jobs |
|---|---|---|---|
| Mouth | — | seconds to a minute | chewing; saliva starts on starch |
| Oesophagus | 25 cm | 5–10 s | carries food down |
| Stomach | holds 1–1.5 L comfortably | 2–4 h, longer after a fatty meal | acid and pepsin; churning; sets the pace |
| Small intestine | 3–5 m in life (6–7 m after death, when the muscle relaxes) | 3–5 h | digestion and nearly all absorption |
| Large intestine | about 1.5 m | 12–48 h, often longer | recovering water and salt; fermentation by bacteria |

The tube has its own nervous system — the **enteric nervous system**, a few hundred million neurons in its wall — which coordinates mixing and pushing even when cut off from the brain; the vagus nerve links the two, which is part of why stress and emotion are felt in the gut. Hormones made by the lining (gastrin, secretin, cholecystokinin, GLP-1) tell the stomach, pancreas, gallbladder and brain what has arrived; GLP-1 also signals fullness, and the medicines that mimic it appear under [[obesity]]. The lining itself is replaced every few days, one of the fastest turnovers in the body.

Blood from the stomach and intestines does not go straight back to the heart: it collects in the **portal vein** and passes through the [[liver-function|liver]] first, so everything absorbed is checked and processed before the rest of the body sees it.

### Nine litres a day
About 2 litres of food and drink enter the gut each day, and the body adds some 7 more: saliva, gastric juice, bile, pancreatic juice and intestinal secretions. Nearly all of it is taken back — most in the small intestine, the rest in the colon — and only a tenth of a litre or so leaves in the stool. This recycling is why diarrhoea dehydrates so quickly: when absorption fails, or a toxin switches secretion on, litres rather than decilitres are lost, and severe cholera can drain more than a litre an hour. Babies, small children and frail older people have the least reserve.

### What is normal, and what is not
Bowel habits vary widely: anything from three times a day to three times a week can be normal, and the colour and shape of stool change with diet. Occasional heartburn, wind or bloating are part of having a gut. Some symptoms, though, need attention:

> [!warn] Vomiting blood or material like coffee grounds, black tarry stools, heavy bleeding from the back passage, sudden severe abdominal pain or pain that keeps getting worse, a swollen hard belly with vomiting and no passing of wind, or signs of severe dehydration (very little urine, dizziness, confusion, a floppy or unusually sleepy child) need help at once — call your local emergency number.

> [!note] Not emergencies, but reasons to see a doctor soon: difficulty swallowing or food sticking, unintended weight loss, blood in the stool, a change in bowel habit lasting more than a few weeks, persistent indigestion or pain, and iron-deficiency anaemia. They usually have a treatable cause — and when they are an early sign of cancer, finding it early matters most.

The rest of this topic follows the meal: [[digestion-absorption|how food is taken apart and absorbed]], [[liver-function|what the liver does with it]] and [[gut-microbiome|the microbes that eat what we cannot]]. [The body map](#/tools/body) shows where each organ sits.
`,
  ideas: [
    'The gut is one tube open at both ends: food only enters the body when it crosses the lining.',
    'The stomach stores, sterilises and churns; the small intestine does most of the digestion and nearly all the absorption; the colon recovers water and hosts the microbes.',
    'The pancreas, the liver and the gallbladder pour enzymes, bicarbonate and bile into the tube.',
    'About 9 litres of fluid enter the gut each day and all but about 0.1–0.2 L is taken back — which is why diarrhoea dehydrates so fast.',
    'Blood from the intestines passes through the liver, via the portal vein, before it reaches the rest of the body.'
  ],
  pitfalls: [
    'Food is digested mainly in the stomach — The stomach stores, sterilises and churns the meal and starts on protein; most digestion and almost all absorption happen in the small intestine.',
    'A daily bowel movement is needed for health — Anything from three a day to three a week can be normal. What matters is a lasting change from your own pattern, pain, or blood.',
    'Chest pain after a meal must be indigestion — A heart attack can feel like heartburn. Chest pain with breathlessness, sweating, or pain spreading to the arm, back or jaw needs emergency care.'
  ],
  formulas: [
    {
      name: 'The share of the gut\'s fluid taken back',
      expr: 'f = 1 - Vout/Vin', tex: 'f = 1 - \\frac{V_\\text{out}}{V_\\text{in}}',
      vars: {
        f: { name: 'share of the fluid reabsorbed', q: 'ratio', unit: '%', min: 0, max: 100 },
        Vout: { name: 'water leaving in the stool (per day)', q: 'volume', unit: 'L', value: 0.15, tex: 'V_\\text{out}' },
        Vin: { name: 'fluid entering the gut (per day)', q: 'volume', unit: 'L', value: 9, tex: 'V_\\text{in}' }
      },
      note: 'The inflow counts what is eaten and drunk (about 2 L) and the digestive secretions (about 7 L). A few per cent less absorption means several times more water in the stool.',
      stories: { f: 'About {Vin} of fluid enter the gut in a day and {Vout} leaves in the stool. What share was taken back?', Vout: 'During a gut infection only {f} of the {Vin} entering the gut is taken back. How much water leaves in the stool each day?' }
    },
    {
      name: 'Average speed through a part of the gut',
      expr: 'v = L/t',
      vars: {
        v: { name: 'average speed', q: 'speed', unit: 'mm/s' },
        L: { name: 'length of the part', q: 'length', unit: 'm', value: 4 },
        t: { name: 'time the meal spends there', q: 'time', unit: 'h', value: 4 }
      },
      note: 'The oesophagus moves food at a few centimetres a second, the small intestine at a fraction of a millimetre a second, the colon slower still: slow transit gives time for digestion, absorption and fermentation.',
      stories: { v: 'A meal takes {t} to travel the {L} of the small intestine. What is its average speed?', t: 'The colon is about {L} long and its contents move at about {v}. How long do they take?' }
    }
  ],
  examples: [
    {
      title: 'Where the water goes',
      q: 'Of the 9 L that enter the gut each day, the small intestine takes back about 7.5 L, and the colon about 1.35 L of the 1.5 L that reach it. (a) How much leaves in the stool, and what share is reabsorbed? (b) An infection halves what the colon can take back. What changes?',
      steps: [
        '(a) Out: $9 - 7.5 - 1.35 = 0.15$ L. Share taken back: $f = 1 - 0.15/9 = 0.983$, about 98 %.',
        '(b) The colon now takes back about 0.68 L of the 1.5 L, so about $1.5 - 0.675 = 0.83$ L leaves: five and a half times the usual amount.',
        'Yet the share reabsorbed has only fallen to $1 - 0.825/9 = 0.91$, 91 %. A few per cent less absorption is a large loss of water — which is why diarrhoea dehydrates quickly and why replacing fluid matters.'
      ],
      a: '(a) About 0.15 L leaves, 98 % is reabsorbed. (b) About 0.8 L a day leaves, though 91 % is still reabsorbed.'
    },
    {
      title: 'Fast and slow',
      q: 'A mouthful travels the 25 cm of the oesophagus in about 7 s; a meal takes about 4 h to cross 4 m of small intestine and about 30 h to cross the 1.5 m colon. Compare the speeds.',
      steps: [
        'Oesophagus: $0.25/7 = 0.036$ m/s, about 36 mm/s (3.6 cm a second).',
        'Small intestine: $4/(4 \\times 3600) = 2.8 \\times 10^{-4}$ m/s, about 0.28 mm/s (1.7 cm a minute).',
        'Colon: $1.5/(30 \\times 3600) = 1.4 \\times 10^{-5}$ m/s, about 0.014 mm/s (5 cm an hour).',
        'The oesophagus is some 2 600 times faster than the colon: it only transports, while the intestines need time to digest, absorb and ferment.'
      ],
      a: 'About 36 mm/s, 0.28 mm/s and 0.014 mm/s — a spread of more than a thousandfold.'
    }
  ],
  quiz: [
    { q: 'Where are most of the nutrients in a meal absorbed?', choices: ['the stomach', 'the small intestine', 'the large intestine', 'the liver'], a: 1,
      why: 'The small intestine, with its enormous folded surface, absorbs almost all sugars, amino acids and fats. The stomach absorbs little (alcohol and some medicines), the colon mainly water and salts, and the liver absorbs nothing from the gut directly — it processes what the intestine sends it.' },
    { q: 'A bite of bread sitting in your stomach has already entered the tissues of your body.', a: false,
      why: 'The gut is a tube open at both ends, so its contents are, strictly, outside the body. Food enters only when its molecules cross the lining — mostly in the small intestine.' },
    { q: 'Blood leaving the small intestine, loaded with absorbed nutrients, goes first to…', choices: ['the heart', 'the liver', 'the kidneys', 'the lungs'], a: 1,
      why: 'It drains into the portal vein, which leads to the liver. The liver stores, converts and detoxifies before the blood returns to the heart — which is also why swallowed medicines meet the liver first.' },
    { q: 'About 9 L of fluid enter the gut in a day and 0.15 L leaves in the stool. What percentage is reabsorbed? (Give a number.)', answer: 98.3,
      why: '$1 - 0.15/9 = 0.983$: about 98.3 %. The margin is small, so modest failures of absorption cause large losses.' },
    { q: 'Which of these needs emergency care?', choices: ['bloating after a large meal', 'black, tarry stools', 'opening the bowels every other day', 'occasional heartburn after a spicy meal'], a: 1,
      why: 'Black, tarry stools are usually digested blood from bleeding high in the gut, for example from an ulcer, and need urgent assessment. The others are common and usually harmless (iron tablets and some foods can also darken stool, but that is for a doctor to judge).' }
  ],
  applications: ['Understanding why diarrhoea and vomiting dehydrate babies and small children so quickly.', 'Knowing which gut symptoms are routine and which need a doctor.', 'Why medicines taken by mouth pass through the liver first.', 'Endoscopy and colonoscopy, which look inside the tube from either end.'],
  history: 'In the 1820s the US army surgeon William Beaumont studied digestion through a wound that had healed as an opening into the stomach of a young trapper, Alexis St. Martin, lowering food on a string and sampling the juices — some of the first experiments on digestion in a living person.',
  sim: 'gi-journey'
},

{
  id: 'digestion-absorption', parent: 'digestion', title: 'Digestion and absorption', level: 2,
  short: 'How acid, enzymes and bile cut starch, proteins and fats into molecules small enough to cross the gut lining, how a surface folded three times over absorbs them, and why water follows salt and sugar.',
  keywords: ['digestion', 'absorption', 'enzymes', 'amylase', 'pepsin', 'trypsin', 'lipase', 'bile salts', 'emulsification', 'micelles', 'chylomicrons', 'villi', 'microvilli', 'surface area', 'SGLT1', 'oral rehydration solution', 'lactose intolerance', 'lactase', 'malabsorption', 'vitamin B12', 'intrinsic factor'],
  prereq: ['digestive-system', 'membrane-transport', 'chemistry:enzyme-kinetics'],
  related: ['macronutrients', 'celiac-disease', 'gut-microbiome', 'vitamins-minerals', 'chemistry:carbohydrates', 'chemistry:lipids', 'chemistry:amino-acids-proteins', 'chemistry:osmotic-pressure', 'math:surface-area'],
  body: `
Chew a piece of plain bread for a minute without swallowing and it begins to taste sweet: amylase, an enzyme in saliva, is cutting the long chains of starch into sugars. That is digestion in miniature. Food arrives as large molecules — starch, proteins, fats — far too big to cross the lining of the gut, and digestion is the business of cutting them into pieces that can: simple sugars, amino acids and fatty acids. Each cut is a **hydrolysis**, a bond split by adding water, and each is speeded up by a specialised enzyme.

### Three foods, three toolkits
| Nutrient | Where it is cut | Enzymes and helpers (source) | Absorbed as |
|---|---|---|---|
| Starch and sugars | mouth, then small intestine | amylase (saliva, pancreas); maltase, sucrase, lactase (the lining) | glucose, fructose, galactose |
| Proteins | stomach, then small intestine | pepsin (stomach); trypsin, chymotrypsin, carboxypeptidase (pancreas); peptidases (the lining) | amino acids and short peptides |
| Fats (triglycerides) | small intestine | bile salts (liver) to emulsify; lipase (pancreas) | fatty acids and monoglycerides |

**Carbohydrates.** Amylase breaks starch into two- and three-sugar pieces; enzymes fixed to the surface of the lining cells finish the job. Glucose and galactose are pulled into the cells by a carrier that brings sodium in with them, fructose by a separate carrier, and all three leave the other side into the blood. **Fibre** resists human enzymes and travels on to the colon, where [[gut-microbiome|bacteria]] ferment it.

**Proteins.** Stomach acid unfolds proteins and kills most microbes, and pepsin makes the first cuts. The pancreas releases its protein-cutting enzymes as inactive precursors that are switched on only once they reach the intestine — otherwise the pancreas would digest itself, which is roughly what happens in acute pancreatitis.

**Fats.** Fat and water do not mix, and lipase can only work at the surface of a fat droplet. Bile salts act like washing-up liquid, breaking fat into tiny droplets and multiplying the surface the enzyme can reach. The products gather in minute bundles (micelles) that ferry them to the lining; inside the cells they are rebuilt into fat and packed into particles called chylomicrons, which enter the **lymph** rather than the blood — so absorbed fat bypasses the liver at first. The fat-soluble vitamins A, D, E and K travel the same way. Bile salts are taken back at the end of the small intestine and reused several times a day.

Some nutrients need special handling. Iron and calcium are absorbed mostly in the duodenum, the first part of the small intestine; vitamin B12 only at the far end, and only when bound to *intrinsic factor*, a protein made by the stomach — which is why stomach surgery or autoimmune gastritis can cause B12 deficiency (see [[vitamins-minerals]]).

### A studio flat in a tube
As a smooth pipe a few metres long and about 2.5 cm across, the small intestine would have an inner surface of about a third of a square metre. Three levels of folding multiply it: circular folds of the lining (about ×3), finger-like **villi** a millimetre tall (about ×10), and on every lining cell a brush of **microvilli** (about ×20):

$$A = \\pi\\, d\\, L \\times f_\\text{folds} \\times f_\\text{villi} \\times f_\\text{microvilli}$$

With these textbook factors the answer is nearly 200 m², behind the old claim of "a tennis court". A careful 2014 measurement put the lining of the whole gut nearer 30 m² — the floor of a studio flat — because the answer depends on how finely the folds are counted. Either way, the absorbing surface is around a hundred times that of a smooth pipe, and anything that flattens the villi, as [[celiac-disease|coeliac disease]] does, cuts it drastically.

### Water follows salt, and carriers fill up
Water is never pumped directly: it follows dissolved particles by [[chemistry:osmotic-pressure|osmosis]]. The main glucose carrier of the lining takes two sodium ions in with each glucose molecule, and water follows both. That coupling is the basis of **oral rehydration solution** — a precise mix of salt and glucose in clean water that lets the gut take back fluid even during cholera, when its secretions are running wild. Promoted by WHO since the late 1970s, it has saved tens of millions of lives, most of them children's. Juices and sports drinks are no substitute: with too much sugar and too little salt they can pull water the wrong way.

Carriers behave like enzymes: there are only so many, so uptake levels off as the concentration rises — the same saturation curve as in [[chemistry:enzyme-kinetics|enzyme kinetics]]:

$$J = J_\\text{max}\\,\\frac{C}{K_m + C}$$

### When absorption fails
- **Lactose intolerance.** In about two-thirds of adults worldwide (68 % in a 2017 global estimate), lactase fades after early childhood. Undigested milk sugar reaches the colon, where bacteria ferment it into gas and draw in water: bloating, cramps and loose stools. It is not an allergy, and most people can still manage the lactose in a glass of milk, especially with food; yoghurt and hard cheese contain much less.
- **Coeliac disease** flattens the villi — see [[celiac-disease]].
- **Too few pancreatic enzymes** (chronic pancreatitis, cystic fibrosis): fat goes undigested, giving pale, greasy, floating stools and weight loss; enzyme capsules taken with meals replace what is missing.
- **Blocked bile flow**, for example by a gallstone, gives pale stools, dark urine and jaundice — see [[liver-disease]].

Weight loss despite eating normally, lasting diarrhoea, greasy stools or unexplained anaemia are reasons to see a doctor.

> [!warn] In a baby or young child with diarrhoea or vomiting, get help at once if they are unusually sleepy or floppy, have far fewer wet nappies than usual, have sunken eyes or cold hands and feet, vomit green fluid, or have blood in the stool — call your local emergency number.
`,
  ideas: [
    'Digestion cuts big molecules into small ones by hydrolysis: starch to sugars, proteins to amino acids, fats to fatty acids and monoglycerides.',
    'Pancreatic enzymes do most of the cutting; bile does not digest fat but emulsifies it so lipase can reach it.',
    'Folds, villi and microvilli multiply the absorbing surface of the small intestine around a hundredfold or more.',
    'Absorbed fat enters the lymph as chylomicrons; sugars and amino acids enter the portal blood.',
    'Water follows salt: sodium and glucose are absorbed together, which is why oral rehydration solution works.'
  ],
  pitfalls: [
    'Bile digests fat — Bile contains no fat-digesting enzyme; its salts break fat into droplets and carry the products, while pancreatic lipase does the chemistry.',
    'Lactose intolerance is a milk allergy — It is a shortage of an enzyme, causing gut symptoms only. Milk allergy is an immune reaction to milk protein that can cause hives, vomiting or anaphylaxis.',
    'Any sweet drink will rehydrate someone with diarrhoea — Oral rehydration solution has a precise salt-to-glucose ratio; very sugary drinks can draw water into the gut and make diarrhoea worse.'
  ],
  formulas: [
    {
      name: 'The absorbing surface of the small intestine',
      expr: 'A = pi*d*L*f1*f2*f3', tex: 'A = \\pi\\, d\\, L\\, f_1 f_2 f_3',
      vars: {
        A: { name: 'absorbing surface area', q: 'area', unit: 'm²' },
        d: { name: 'diameter of the tube', q: 'length', unit: 'cm', value: 2.5 },
        L: { name: 'length of the small intestine', q: 'length', unit: 'm', value: 4 },
        f1: { name: 'gain from the circular folds', value: 3 },
        f2: { name: 'gain from the villi', value: 10 },
        f3: { name: 'gain from the microvilli', value: 20 }
      },
      note: 'Textbook factors; real ones vary along the gut and with how the surface is measured. A 2014 study put the whole gut\'s lining at about 30 m².',
      practice: { unknowns: ['A', 'f2'] },
      stories: { A: 'A small intestine is {L} long and {d} across, with folds multiplying its area by {f1}, villi by {f2} and microvilli by {f3}. What is its absorbing surface?', f2: 'In coeliac disease the villi are damaged. If the tube is {L} long and {d} across, with folds ×{f1} and microvilli ×{f3}, and the surface is only {A}, what gain do the remaining villi give?' }
    },
    {
      name: 'Carriers fill up: saturable uptake',
      expr: 'J = Jmax*C/(Km + C)', tex: 'J = J_\\text{max}\\,\\frac{C}{K_m + C}',
      vars: {
        J: { name: 'uptake rate (% of the maximum)' },
        Jmax: { name: 'maximum uptake rate (%)', value: 100, fixed: true, tex: 'J_\\text{max}' },
        C: { name: 'glucose concentration at the lining', q: 'concentration', unit: 'mM', value: 5 },
        Km: { name: 'half-saturation concentration', q: 'concentration', unit: 'mM', value: 0.5, tex: 'K_m' }
      },
      note: 'Illustrative values: the main glucose carrier is half-saturated at well under 1 mM, while glucose next to the lining after a starchy meal can reach tens of mM — so the carriers run close to full speed.',
      practice: { unknowns: ['J', 'C'] },
      stories: { J: 'A carrier is half-saturated at {Km}. What share of its maximum rate does it reach when glucose at the lining is {C}?', C: 'A carrier half-saturated at {Km} is working at {J} of its maximum. What is the glucose concentration?' }
    }
  ],
  examples: [
    {
      title: 'Folding up a surface',
      q: 'A small intestine is 4 m long and 2.5 cm across. Folds multiply its surface by 3, villi by 10 and microvilli by 20. Find the surface as a smooth pipe and with all three, and then with the villi flattened.',
      steps: [
        'Smooth pipe: $A = \\pi d L = \\pi \\times 0.025 \\times 4 = 0.314$ m².',
        'All three: $0.314 \\times 3 \\times 10 \\times 20 = 188$ m², six hundred times the pipe.',
        'Villi flattened ($f_\\text{villi} = 1$): $0.314 \\times 3 \\times 20 = 18.8$ m², a tenth of the healthy value — why untreated coeliac disease can cause malabsorption, anaemia and weight loss.'
      ],
      a: 'About 0.3 m² as a pipe, about 190 m² with the folding, and about 19 m² with flattened villi (by these textbook factors).'
    },
    {
      title: 'Carriers near their limit',
      q: 'A glucose carrier is half-saturated at 0.5 mM. What fraction of its maximum rate does it reach at 0.5, 5 and 50 mM?',
      steps: [
        'At 0.5 mM: $0.5/(0.5 + 0.5) = 50$ %.',
        'At 5 mM: $5/5.5 = 91$ %.',
        'At 50 mM: $50/50.5 = 99$ %. Ten times more glucose barely changes the rate: once carriers are full, absorption is limited by how many there are, and unabsorbed sugar moves further down the gut.'
      ],
      a: '50 %, 91 % and 99 % of the maximum.'
    },
    {
      title: 'Case: bloating after milk',
      q: 'Kenji, 28, gets bloating, wind and loose stools an hour or two after milky coffee, but not after rice, meat or vegetables. What might be happening, and what questions would a doctor ask?',
      steps: [
        'The timing and trigger suggest lactose reaching the colon undigested: bacteria ferment it into gas and it draws water into the gut.',
        'Lactase commonly fades after childhood — in most East Asian adults, for example — so this is a normal variant of human biology, not an allergy and not damage to the gut.',
        'A doctor would ask about weight loss, blood in the stool, anaemia and a family history of coeliac disease or bowel disease, because those would point elsewhere, and might suggest a breath test or a trial without lactose.',
        'Many people with low lactase still tolerate small amounts, especially with meals, or choose lactose-free milk, yoghurt or hard cheese.'
      ],
      a: 'Probably lactase non-persistence (lactose intolerance); red-flag symptoms would call for further tests.'
    }
  ],
  quiz: [
    { q: 'What is the main job of bile in digesting fat?', choices: ['it breaks the chemical bonds of fats', 'it breaks fat into small droplets so lipase can reach it', 'it neutralises stomach acid and nothing else', 'it carries fat directly into the blood'], a: 1,
      why: 'Bile salts emulsify fat and then carry the products to the lining in micelles. The chemical cutting is done by pancreatic lipase. (Bicarbonate from the pancreas does most of the neutralising.)' },
    { q: 'Most absorbed fat enters the portal vein and goes straight to the liver.', a: false,
      why: 'Fat is repackaged into chylomicrons, which are too big for blood capillaries; they enter the lymph and reach the blood near the heart, bypassing the liver at first. Sugars and amino acids do go to the liver first.' },
    { q: 'If disease flattened the villi but left the folds and microvilli, the absorbing surface would fall…', choices: ['by about 10 %', 'to about half', 'to about a tenth', 'not at all, because microvilli remain'], a: 2,
      why: 'Villi multiply the surface about tenfold, so losing them divides it by about ten. Microvilli remain, but on a much smaller area.' },
    { q: 'Why does oral rehydration solution contain glucose as well as salt?', choices: ['to provide energy only', 'sodium and glucose are carried into the lining together, and water follows them', 'to make it taste better for children', 'glucose kills the microbes that cause diarrhoea'], a: 1,
      why: 'The main glucose carrier brings sodium in with each glucose molecule, and water follows the dissolved particles by osmosis. This route keeps working even in cholera.' },
    { q: 'A carrier is half-saturated at 0.5 mM. At a glucose concentration of 4.5 mM, what percentage of its maximum rate does it reach? (Give a number.)', answer: 90,
      why: '$4.5/(0.5 + 4.5) = 0.9$, so 90 %. Beyond a few times the half-saturation concentration, more glucose adds little.' }
  ],
  applications: ['Oral rehydration therapy for diarrhoea, one of the most effective treatments in medicine.', 'Enzyme replacement for people whose pancreas makes too few enzymes.', 'Lactose-free foods and reading labels.', 'Understanding why some vitamins need fat, bile or a healthy stomach to be absorbed.'],
  sim: 'gi-surface'
},

{
  id: 'liver-function', parent: 'digestion', title: 'The liver', level: 2,
  short: 'The body\'s chemical plant: it stores and releases fuel, makes blood proteins and bile, turns ammonia into urea, and clears medicines, alcohol and toxins — first in line for everything absorbed from the gut.',
  keywords: ['liver', 'hepatocyte', 'portal vein', 'glycogen', 'gluconeogenesis', 'albumin', 'clotting factors', 'bile', 'bilirubin', 'jaundice', 'urea', 'ammonia', 'first-pass metabolism', 'bioavailability', 'cytochrome P450', 'alcohol metabolism', 'Widmark formula', 'zero-order elimination', 'liver function tests', 'ALT', 'paracetamol'],
  prereq: ['digestion-absorption', 'metabolism-energy', 'chemistry:enzyme-kinetics'],
  related: ['liver-disease', 'pharmacokinetics', 'half-life-dosing', 'alcohol', 'glucose-regulation', 'lab-tests', 'poisoning-overdose', 'math:exponential-growth-decay'],
  body: `
At three in the morning, hours after your last meal, your brain is still burning glucose — about 5 grams an hour, day and night. Nothing is coming in from the gut, so where does it come from? From your liver, which spent the evening storing sugar as **glycogen** and now releases it steadily; as that store (around 100 g) runs down over the following day, the liver starts making new glucose from amino acids, lactate and glycerol. That is one of several hundred jobs done by a 1.5 kg organ tucked under the right ribs.

### A chemical plant with two supplies
The liver receives about a quarter of the heart's output — some 1.5 litres a minute — from two sources. About three-quarters arrives through the **portal vein**, carrying everything absorbed from the stomach and intestines; the other quarter is oxygen-rich blood from the hepatic artery. The two mix as they trickle past plates of liver cells (hepatocytes) in wide, leaky capillaries, and drain back to the heart through the hepatic veins. Immune cells lining the channels catch bacteria that slip through the gut wall.

### What it does
- **Fuel**: stores glucose as glycogen after meals and releases it between them; makes new glucose when fasting; turns surplus carbohydrate into fat and exports fats in lipoproteins; makes ketones during prolonged fasting.
- **Proteins**: albumin, the main protein of plasma, which holds water inside the blood vessels; most clotting factors; many carrier proteins.
- **Waste**: turns toxic ammonia from protein breakdown into urea for the kidneys; takes up bilirubin, the yellow breakdown product of old red cells, and excretes it in bile.
- **Bile**: about half a litre to a litre a day, whose salts help digest fat.
- **Medicines and toxins**: enzymes, the cytochrome P450 family among them, modify foreign molecules and attach water-soluble tags so the kidneys or the bile can remove them.
- **Storage**: vitamins A, D and B12, iron and copper.

It can also regrow: after as much as two-thirds is removed, the rest grows back to nearly full size within a couple of months — what makes living-donor liver transplantation possible.

### First-pass metabolism
Because the portal vein comes first, a medicine swallowed as a tablet must survive the gut wall and one passage through the liver before it reaches the rest of the body. The fraction that makes it, the oral **bioavailability**, is roughly

$$F = f_a\\,(1 - E_H)$$

with $f_a$ the fraction absorbed and $E_H$ the fraction the liver removes on the way. For some medicines $E_H$ is large: that is why glyceryl trinitrate for angina is placed under the tongue, whose veins bypass the liver, and why some medicines need much larger doses by mouth than by injection. Grapefruit juice blocks one of the metabolising enzymes in the gut wall and can raise the levels of certain medicines — one reason to read the leaflet or ask a pharmacist.

### Steady or proportional: alcohol against medicines
Most medicines are cleared **in proportion to how much is there**: a fixed fraction leaves each hour, so the level halves every [[half-life-dosing|half-life]] — first-order elimination. Alcohol is different. The enzyme that starts its breakdown, alcohol dehydrogenase, is saturated at quite low levels, so the liver removes a roughly **fixed amount per hour**: about 0.1 g of alcohol per kilogram of body weight, some 7 g an hour for a 70 kg adult. The blood level falls by about 0.15 g/L (0.015 %) an hour, with a range of roughly 0.1–0.2 between people. This is zero-order elimination, and nothing speeds it up — not coffee, a cold shower, a walk or sleep. The Widmark formula estimates the level:

$$\\text{BAC} \\approx \\frac{A}{r\\,W} - \\beta\\, t$$

with $A$ the grams of alcohol, $W$ the body weight, $r$ the share of the body the alcohol spreads through (on average about 0.68 in men and 0.55 in women) and $\\beta$ the hourly fall. It is an average: food, drinking speed, medicines and individual differences change the real value, so it must never be used to decide whether it is safe to drive — the only safe level for driving is zero. [[alcohol|Alcohol and health]] covers the rest.

Paracetamol (acetaminophen) shows what happens when capacity runs out. At normal doses the liver disposes of it safely; after an overdose the usual routes saturate, a toxic by-product builds up, and liver cells die over the following days — often after the person has felt well at first. The antidote works best when given early.

> [!warn] A suspected overdose of paracetamol (acetaminophen) is an emergency even if the person feels well — do not wait for symptoms. So are yellow skin or eyes with confusion or drowsiness, and vomiting blood or passing black stools in someone with liver disease — call your local emergency number.

### "Liver function tests"
The usual blood panel mostly measures **injury**, not function: ALT and AST are enzymes that leak from damaged liver cells, and ALP and GGT rise when bile flow is blocked. The real tests of function are **bilirubin** (clearance) and **albumin** and the **prothrombin time (INR)** (manufacture). Reference ranges vary between laboratories; as a rough guide total bilirubin is below about 20 µmol/L (1.2 mg/dL), yellowing of the eyes shows above roughly 40–50 µmol/L (2.5–3 mg/dL), and albumin is about 35–50 g/L (3.5–5.0 g/dL). Roughly 3–7 % of people have Gilbert syndrome, a harmless inherited trait that makes bilirubin creep up when fasting or unwell. What goes wrong — hepatitis, fatty liver disease and cirrhosis — is in [[liver-disease]].
`,
  ideas: [
    'The liver gets about three-quarters of its blood from the gut through the portal vein, so it processes everything absorbed before the rest of the body sees it.',
    'It buffers fuel (glycogen, new glucose, fats), makes albumin and clotting factors, turns ammonia into urea, makes bile and clears bilirubin.',
    'First-pass metabolism: a swallowed medicine loses the fraction the liver removes on the way — $F = f_a(1 - E_H)$.',
    'Most medicines leave by first-order kinetics (a fixed fraction per hour); alcohol by zero-order kinetics (a fixed amount, about 0.15 g/L an hour).',
    '"Liver function tests" are mostly markers of injury; albumin, INR and bilirubin reflect real function.'
  ],
  pitfalls: [
    'Coffee, cold water or sleep sobers you up faster — The liver removes alcohol at a nearly fixed rate; they may make you feel more awake, but the blood level falls just as slowly.',
    'A high ALT means the liver is failing — ALT shows liver cells are being injured; the liver can still work well. Function is judged from albumin, INR and bilirubin, and the cause matters most.',
    'If someone feels fine after taking too much paracetamol, there is no harm — Liver damage appears one to three days later; treatment works best in the first hours, so it is an emergency from the start.'
  ],
  formulas: [
    {
      name: 'Blood alcohol: the Widmark estimate',
      expr: 'BAC = A/(r*W) - beta*t', tex: '\\text{BAC} = \\frac{A}{r\\,W} - \\beta\\, t',
      vars: {
        BAC: { name: 'blood alcohol concentration (g/L)', tex: '\\text{BAC}' },
        A: { name: 'alcohol drunk (g)', value: 40 },
        r: { name: 'Widmark factor (share of the body alcohol spreads through)', value: 0.68, min: 0.4, max: 0.9 },
        W: { name: 'body weight (kg)', value: 80 },
        beta: { name: 'hourly fall in blood alcohol (g/L per hour)', value: 0.15, tex: '\\beta' },
        t: { name: 'hours since drinking began', value: 2 }
      },
      note: 'Averages: r about 0.68 for men and 0.55 for women; β about 0.15 g/L an hour (0.1–0.2). 1 g/L = 0.1 % = 100 mg/dL. A standard drink is 8–14 g of alcohol depending on the country. An estimate for learning, never a way to decide whether to drive.',
      practice: { unknowns: ['BAC', 't'] },
      stories: { BAC: 'A person weighing {W} (Widmark factor {r}) drinks {A} of alcohol. Estimate the blood alcohol {t} after starting, if it falls by {beta}.', t: 'A person weighing {W} (Widmark factor {r}) drank {A} of alcohol. With a fall of {beta}, how many hours until the level is down to {BAC}?' }
    },
    {
      name: 'Oral bioavailability after the first pass',
      expr: 'F = fa*(1 - EH)', tex: 'F = f_a\\,(1 - E_H)',
      vars: {
        F: { name: 'oral bioavailability', q: 'ratio', unit: '%', min: 0, max: 100 },
        fa: { name: 'fraction absorbed from the gut', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_a' },
        EH: { name: 'fraction removed by the liver on the first pass', q: 'ratio', unit: '%', value: 70, min: 0, max: 99, tex: 'E_H' }
      },
      note: 'A simplified view that ignores metabolism in the gut wall. Values for real medicines are in their prescribing information; the numbers here are hypothetical.',
      stories: { F: 'A medicine is {fa} absorbed, and the liver removes {EH} of it on the first pass. What fraction reaches the circulation?', EH: 'A medicine is {fa} absorbed but only {F} reaches the circulation. What fraction does the liver remove on the first pass?' }
    },
    {
      name: 'Most medicines: a fixed fraction per hour',
      expr: 'C = C0*2^(-t/th)', tex: 'C = C_0 \\cdot 2^{-t/t_{1/2}}',
      vars: {
        C: { name: 'concentration now', q: 'massconc', unit: 'mg/L' },
        C0: { name: 'starting concentration', q: 'massconc', unit: 'mg/L', value: 10, tex: 'C_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'h', value: 8 },
        th: { name: 'half-life', q: 'time', unit: 'h', value: 4, tex: 't_{1/2}' }
      },
      note: 'First-order elimination, for comparison with alcohol\'s fixed amount per hour. See Half-life and dosing for repeated doses.',
      stories: { C: 'A (hypothetical) medicine with a half-life of {th} is at {C0}. What is the level after {t}?', th: 'A level falls from {C0} to {C} in {t}. What is the half-life?' }
    }
  ],
  examples: [
    {
      title: 'The morning after',
      q: 'An 80 kg man (Widmark factor 0.68) drinks 100 g of alcohol — about ten drinks of 10 g — between 8 p.m. and midnight. Estimate his blood alcohol at 7 a.m., and when it reaches zero, with a fall of 0.15 g/L an hour.',
      steps: [
        'If it were all absorbed at once: $100/(0.68 \\times 80) = 1.84$ g/L.',
        'At 7 a.m., 11 hours after he started: $1.84 - 0.15 \\times 11 = 0.19$ g/L — still alcohol in the blood.',
        'Zero after $1.84/0.15 = 12.3$ hours, around 8:15 a.m.',
        'A real person may clear it faster or much slower. The lesson is that sleep does not reset the clock: next-morning driving after heavy drinking is a recognised danger.'
      ],
      a: 'Roughly 0.2 g/L at 7 a.m., reaching zero around 8 a.m. at the earliest — an estimate only.'
    },
    {
      title: 'A fixed amount against a fixed fraction',
      q: 'Blood alcohol is 1.2 g/L and falls by 0.15 g/L an hour; a medicine is at 1.2 mg/L with a half-life of 4 hours. Compare them after 4 and 8 hours. Then start the alcohol at 2.4 g/L.',
      steps: [
        'After 4 h: alcohol $1.2 - 0.6 = 0.6$ g/L; medicine $1.2/2 = 0.6$ mg/L. The same so far.',
        'After 8 h: alcohol $1.2 - 1.2 = 0$; medicine $1.2/4 = 0.3$ mg/L — it never quite reaches zero, it keeps halving.',
        'From 2.4 g/L, after 4 h alcohol is still $2.4 - 0.6 = 1.8$ g/L: only a quarter gone. A fixed amount per hour means the more you drink, the longer it lasts in proportion — whereas a medicine at twice the level would still be halved in 4 hours.'
      ],
      a: 'Zero-order: equal amounts each hour, gone in a time proportional to the dose. First-order: equal fractions each hour, halving every half-life.'
    },
    {
      title: 'Why the tablet dose is bigger',
      q: 'A hypothetical medicine is 90 % absorbed from the gut and the liver removes 70 % of it on the first pass. What is its oral bioavailability, and how does an oral dose compare with an injected one giving the same exposure?',
      steps: [
        '$F = 0.9 \\times (1 - 0.7) = 0.27$: 27 % reaches the circulation.',
        'For the same amount in the body, the oral dose must be $1/0.27 \\approx 3.7$ times the intravenous one.',
        'People with cirrhosis may remove far less on the first pass, so the same tablet can give much higher levels — one reason doctors adjust medicines in liver disease.'
      ],
      a: 'F = 27 %; the oral dose would need to be about 3.7 times the injected one.'
    }
  ],
  quiz: [
    { q: 'Most of the blood reaching the liver comes from…', choices: ['the hepatic artery', 'the portal vein, draining the gut', 'the hepatic veins', 'the renal arteries'], a: 1,
      why: 'About three-quarters comes through the portal vein from the stomach, intestines, pancreas and spleen; the hepatic artery supplies the rest, rich in oxygen. The hepatic veins carry blood away.' },
    { q: 'Someone\'s blood alcohol is 1.2 g/L and falls by 0.15 g/L an hour. About how many hours until it reaches zero?', answer: 8, unit: 'h',
      why: '$1.2/0.15 = 8$ hours. Zero-order elimination: the same amount leaves every hour.' },
    { q: 'A strong coffee makes the liver remove alcohol faster.', a: false,
      why: 'Caffeine can make a person feel more alert but does not change alcohol dehydrogenase, which is already working flat out. The blood level falls at the same rate.' },
    { q: 'Which results best show how well the liver is making proteins?', choices: ['ALT and AST', 'ALP and GGT', 'albumin and the prothrombin time (INR)', 'the white cell count'], a: 2,
      why: 'Albumin and the clotting factors measured by the INR are made in the liver, so they fall or lengthen when it fails. ALT and AST show injury; ALP and GGT show blocked bile flow.' },
    { q: 'A medicine is almost entirely destroyed on its first pass through the liver. Which way of giving it avoids that?', choices: ['a tablet swallowed with food', 'a slow-release capsule', 'under the tongue or by injection', 'a coated tablet'], a: 2,
      why: 'Veins from the mouth and injections reach the general circulation without passing the liver first. All swallowed forms go through the portal vein.' }
  ],
  applications: ['Choosing routes of administration: under the tongue, by injection, through the skin.', 'Understanding why alcohol lingers into the next morning.', 'Reading a liver blood panel: injury versus function.', 'Adjusting medicines for people with liver disease.'],
  history: 'Claude Bernard showed in the 1850s that the liver makes and stores a starch-like substance, glycogen, and releases sugar into the blood — the first description of an organ keeping the internal environment steady. The Swedish chemist Erik Widmark published his formula for blood alcohol in 1932.',
  sim: 'gi-clearance'
},

{
  id: 'gut-microbiome', parent: 'digestion', title: 'The gut microbiome', level: 2,
  short: 'The trillions of bacteria and other microbes in the gut — mostly the colon — that ferment fibre, make vitamins, keep invaders out and train the immune system; what the evidence shows, and where the hype outruns it.',
  keywords: ['gut microbiome', 'microbiota', 'gut bacteria', 'gut flora', 'fibre fermentation', 'short-chain fatty acids', 'butyrate', 'Shannon diversity', 'antibiotics', 'Clostridioides difficile', 'C. difficile', 'faecal microbiota transplantation', 'FMT', 'probiotics', 'prebiotics', 'colonisation resistance'],
  prereq: ['digestive-system', 'microbes-types', 'digestion-absorption'],
  related: ['antibiotics', 'antimicrobial-resistance', 'ibd', 'innate-immunity', 'healthy-diet', 'macronutrients', 'math:logarithms'],
  body: `
Maria, 72, takes a course of antibiotics for pneumonia and recovers. Ten days later she has watery diarrhoea several times a day, cramps and a fever. The cause is a bacterium, *Clostridioides difficile*, that had been held in check by the crowd of harmless microbes in her colon until the antibiotics thinned them out. Her story shows two things at once: the microbes in our gut matter, and they work as a community.

### A crowded ecosystem
The **gut microbiome** is the community of bacteria, archaea, fungi and viruses that live in the digestive tract — overwhelmingly in the colon, where each gram of contents holds around a hundred billion bacteria. A 2016 recount put the total at about 38 trillion bacteria in a typical adult, roughly as many as the body's own cells (the old claim of ten microbes for every human cell was an overestimate), weighing about 0.2 kg. Each person carries a few hundred species out of the thousands found across humanity, in a mix as individual as a fingerprint yet fairly stable over years. It is seeded at birth — differently after a caesarean than a vaginal birth — shaped by breast milk or formula and early foods, and settles into an adult-like pattern by about the age of three.

### What the microbes do
- **Ferment what we cannot digest.** Fibre and resistant starch reach the colon intact; bacteria turn them into gas and short-chain fatty acids — acetate, propionate and butyrate. Butyrate is the main fuel of the cells lining the colon, and together these acids supply a few per cent of the body's energy.
- **Make vitamins**, notably vitamin K and some B vitamins (how much of them we absorb is uncertain).
- **Guard the door.** A dense, established community leaves no room or food for newcomers — *colonisation resistance*, which is what Maria lost.
- **Train the immune system**, which learns in early life to tolerate harmless microbes and foods.
- **Transform bile acids and medicines**: some bacteria inactivate digoxin, a heart medicine; others activate or recycle drugs.

### Measuring diversity
Today microbes are counted by reading their DNA from a stool sample. One summary is **diversity** — how many kinds are present and how evenly they share the space. The Shannon index is

$$H = -\\sum_i p_i \\ln p_i$$

where $p_i$ is the share of type $i$. For $S$ equally common types it equals $\\ln S$, and $e^H$ is the *effective number* of types. A community dominated by one species has a low $H$ even if many others survive in traces. Broad-spectrum antibiotics can cut diversity sharply within days; most of it returns over weeks to months, though some species may stay missing for longer. Diets rich in varied plant fibre go with higher diversity, and a drastic change of diet shifts the mix within days.

### What is known, and what is hype
The strongest evidence concerns *C. difficile*: when it keeps coming back, transplanting stool from a screened healthy donor (faecal microbiota transplantation) cures about 80–90 % of people, and guidelines recommend it. Some probiotics modestly reduce diarrhoea during antibiotics, and certain combinations appear to protect very premature babies from a severe bowel disease. Beyond that, differences in the microbiome have been linked with obesity, diabetes, [[ibd|inflammatory bowel disease]], allergy and even mood — but most of these are **associations**: it is often unclear whether the microbes cause the disease, respond to it, or both reflect diet and medicines. Commercial stool tests that promise a personal diet plan cannot yet guide treatment, and most probiotic strains pass through without settling. The best-supported advice is also the simplest: plenty of fibre from a variety of plants, and antibiotics only when they are needed — see [[antibiotics]] and [[healthy-diet]].

> [!warn] Diarrhoea during or after antibiotics usually settles, but seek medical care promptly if there is fever, blood in the stool, severe or worsening abdominal pain, a swollen belly or signs of dehydration. If the person is confused, very weak or has stopped passing urine, call your local emergency number.
`,
  ideas: [
    'About 38 trillion bacteria — roughly one for every human cell — live in the gut, mostly in the colon.',
    'They ferment fibre into short-chain fatty acids; butyrate is the main fuel of the colon lining.',
    'An established community keeps invaders such as C. difficile out; antibiotics can break that resistance.',
    'Diversity is measured with indices such as Shannon\'s, $H = -\\sum p_i \\ln p_i$; evenness matters as well as the number of species.',
    'Stool transplants for recurrent C. difficile are proven; most other microbiome claims are associations still being tested.'
  ],
  pitfalls: [
    'We are ten parts microbe to one part human — A 2016 recount found roughly one bacterium per human cell; the old 10 : 1 figure was a rough guess that stuck.',
    'A probiotic yoghurt permanently re-seeds your gut — Most probiotic strains are detectable only while they are being taken; they rarely settle in an established community.',
    'A difference in the microbiome of people with a disease proves the microbes caused it — The disease, its treatment or the diet that goes with it can change the microbes; cause needs trials.'
  ],
  formulas: [
    {
      name: 'Diversity of a two-group community',
      expr: 'H = -(p*ln(p) + (1 - p)*ln(1 - p))', tex: 'H = -\\left(p \\ln p + (1 - p)\\ln (1 - p)\\right)',
      vars: {
        H: { name: 'Shannon index' },
        p: { name: 'share of the first group', q: 'ratio', unit: '%', value: 90, min: 0.1, max: 99.9 }
      },
      note: 'The largest value, ln 2 ≈ 0.69, is reached at an even split; a community dominated by one group scores near zero. Solving for the share gives two answers, p and 1 − p.',
      stories: { H: 'After antibiotics, one group makes up {p} of the bacteria and a second group the rest. What is the Shannon index?' }
    },
    {
      name: 'The effective number of species',
      expr: 'D = exp(H)', tex: 'D = e^{H}',
      vars: {
        D: { name: 'effective number of equally common species' },
        H: { name: 'Shannon index', value: 3 }
      },
      note: 'D is how many equally common species would give the same Shannon index; for S equally common species H = ln S and D = S.',
      stories: { D: 'A stool sample has a Shannon index of {H}. How many equally common species would give the same diversity?', H: 'A community behaves like {D} equally common species. What is its Shannon index?' }
    }
  ],
  examples: [
    {
      title: 'Same species, different diversity',
      q: 'Community A has four species at 25 % each. Community B has the same four at 85 %, 5 %, 5 % and 5 %. Compare their Shannon indices and effective numbers of species.',
      steps: [
        'A: $H = -4 \\times 0.25 \\ln 0.25 = \\ln 4 = 1.39$; $D = e^{1.39} = 4$.',
        'B: $H = -(0.85 \\ln 0.85 + 3 \\times 0.05 \\ln 0.05) = 0.138 + 0.449 = 0.59$; $D = e^{0.59} = 1.8$.',
        'Both have four species, but B behaves like fewer than two: one species crowds out the rest, as often happens after antibiotics.'
      ],
      a: 'A: H = 1.39, 4 effective species; B: H = 0.59, about 1.8 effective species.'
    },
    {
      title: 'Case: diarrhoea after antibiotics',
      q: 'Maria, 72, develops watery diarrhoea and fever ten days after antibiotics for pneumonia. A stool test finds C. difficile toxin. What has happened, and how is it managed?',
      steps: [
        'Antibiotics cleared many of the colon\'s resident bacteria. C. difficile survives as hardy spores, and with its competitors gone it grows and releases toxins that inflame the colon.',
        'Doctors stop the triggering antibiotic where possible and treat with specific antibiotics taken by mouth that act inside the colon (vancomycin or fidaxomicin); they watch for dehydration and for signs of severe colitis.',
        'About one person in five has a recurrence. After repeated recurrences, faecal microbiota transplantation restores a protective community and cures most.',
        'Spores are not killed by alcohol hand gel: in hospitals and at home, washing hands with soap and water and cleaning surfaces stops spread.'
      ],
      a: 'Antibiotics removed colonisation resistance; targeted treatment, and for repeated recurrences a stool transplant, restore it.'
    }
  ],
  quiz: [
    { q: 'Where do most of the gut\'s microbes live?', choices: ['the stomach', 'the duodenum', 'the colon', 'the oesophagus'], a: 2,
      why: 'Acid and fast transit keep numbers low in the stomach and upper small intestine; the slow, oxygen-poor colon holds around 10¹¹ bacteria per gram of contents.' },
    { q: 'Current estimates say the bacteria in the body outnumber human cells about ten to one.', a: false,
      why: 'A careful 2016 recount found about 38 trillion bacteria and about 30 trillion human cells: roughly one to one.' },
    { q: 'What do colon bacteria make from fibre that feeds the cells of the colon lining?', choices: ['glucose', 'short-chain fatty acids such as butyrate', 'cholesterol', 'vitamin C'], a: 1,
      why: 'Fermenting fibre yields acetate, propionate and butyrate; butyrate is the preferred fuel of colon lining cells.' },
    { q: 'Two samples contain the same 50 species. In one, a single species makes up 95 % of the bacteria; the other is evenly mixed. The first has…', choices: ['the same Shannon diversity, because the count is the same', 'a lower Shannon diversity', 'a higher Shannon diversity', 'a diversity that cannot be compared'], a: 1,
      why: 'Shannon diversity counts evenness as well as richness: a community dominated by one species has a much lower index and behaves like far fewer species.' },
    { q: 'What is the Shannon index of a community of 20 equally common species? (Give a number.)', answer: 3.0,
      why: 'For S equal shares, $H = \\ln S = \\ln 20 = 3.0$.' }
  ],
  applications: ['Faecal microbiota transplantation for recurrent C. difficile infection.', 'Careful antibiotic use (antimicrobial stewardship), which protects the gut community as well as slowing resistance.', 'Understanding fibre, fermentation and wind.', 'Research into the microbiome in inflammatory bowel disease, obesity and bowel cancer.'],
  sim: 'gi-microbiome'
}

);
