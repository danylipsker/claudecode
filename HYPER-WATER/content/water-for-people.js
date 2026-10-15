/* HYPER-WATER · content/water-for-people.js — Water for people (branch Water and Us).
 *   drinking-water-and-thirst  the daily budget, thirst, what is in tap water, too much
 *   water-treatment            the chain from river to tap, and what the chlorine is doing
 *   desalination               osmotic pressure, the thermodynamic floor, reverse osmosis, the Gulf and Israel
 *   heavy-water-in-reactors    why a heavier hydrogen makes natural uranium work; Vemork
 *   water-as-a-standard        the kilogram, the litre, the degree, the calorie, the kelvin, VSMOW
 *   ultrapure-water            18.2 MΩ·cm, the semiconductor fab, why it eats pipes
 *   water-in-the-kitchen       boiling, the pressure cooker, altitude, salt, eggs, steam burns
 *   could-life-use-another-liquid   Henderson's criteria and the candidates
 *   the-search-follows-the-water    the mantra, the missions, what a detection would mean
 *   how-much-water-things-take      green, blue and grey water; virtual water
 * Every number that a function of the water engine could give is given by it in the simulations
 * (sims/water-for-people.js); the pages quote the same sources.
 */
Hyper.add(

/* ================================================================ 1. drinking water and thirst */
{
  id: 'drinking-water-and-thirst', parent: 'water-for-people', title: 'Drinking water and thirst', level: 1,
  short: 'An adult turns over about two and a half litres of water a day, a third of it hidden in food, and a hormone-and-thirst loop that responds to a one per cent change in the blood keeps the books balanced. The “eight glasses” rule has no scientific source; tap water is a dilute mineral solution held to guideline values set at the microgram; and the one real danger of drinking is too much, too fast.',
  keywords: ['thirst', 'dehydration', 'how much water to drink', 'eight glasses', '8 glasses', 'daily water intake', 'hyponatraemia', 'water intoxication', 'tap water', 'bottled water', 'WHO guideline', 'nitrate', 'fluoride', 'lead', 'arsenic', 'dissolved solids', 'osmolality', 'antidiuretic hormone'],
  prereq: ['how-much-water-we-are', 'blood-and-the-daily-budget', 'osmosis-and-osmotic-pressure'],
  related: ['aquaporins', 'the-body-at-37-degrees', 'evaporative-cooling', 'the-salt-of-the-sea', 'hard-water-and-limescale', 'water-treatment', 'medicine:electrolytes', 'medicine:kidney-function', 'medicine:urine-concentration'],
  body: `
A 70 kg adult is about 42 litres of water, and about two and a half litres of it are replaced every day: as much leaves by the kidneys, the skin, the breath and the gut as arrives through the mouth. Thirst is the control system that keeps that ledger level, and it is better at the job than the advice columns suggest.

### The daily budget
| In | Litres | Out | Litres |
|---|---|---|---|
| Drinks | about 1.5 | Urine | about 1.5 |
| Moisture in food | about 0.7 | Skin, unnoticed | 0.45 |
| Made by metabolism | about 0.3 | Breath | 0.35 |
| | | Sweat, at rest | 0.1 |
| | | Faeces | 0.1 |
| **Total** | **2.5** | **Total** | **2.5** |

The “metabolic” water is real: burning a gram of fat yields 1.07 g of water, a gram of carbohydrate 0.55 g, a gram of protein 0.41 g. The totals move with the day. In a hot climate or on a long run sweat alone can pass a litre an hour, each litre evaporating at about 2.4 MJ — the way the body sheds heat, as [[evaporative-cooling]] describes. The European Food Safety Authority (2010) put the *adequate* total intake at 2.0 litres a day for women and 2.5 for men in a mild climate, of which 20–30 % comes with food.

### Where “eight glasses” came from
Nowhere that can be traced. Heinz Valtin searched the medical literature in 2002 for a source of the rule and found none; the likeliest ancestor is a 1945 recommendation of about one millilitre of water per calorie of food, whose next sentence — that most of it is already in prepared food — was lost in the retelling. Tea, coffee and milk count towards the total: the mild diuretic effect of the caffeine in ordinary cups is small beside the water they bring.

### How thirst keeps the books
Sensors in the brain track the concentration of the blood. When the osmolality creeps up about 1 % the pituitary releases antidiuretic hormone, the kidney opens more [[aquaporins|aquaporin]] channels and the urine can be concentrated to four times the blood's strength (a minimum of about half a litre a day to carry away the waste). A few per cent up, and thirst itself switches on; a loss of roughly a tenth of the blood volume does the same through pressure sensors. For a healthy adult in ordinary conditions this is an accurate guide. It lags in two cases: in hard exercise in heat, where sweat outruns drinking, and in old age, when the thirst response is blunted (Phillips and colleagues, 1984) — as it is in infants and in anyone who cannot ask for a drink.

### What is in a glass of tap water
Not H₂O alone. Tap water carries 50–500 mg/L of dissolved solids — calcium, magnesium, bicarbonate, sodium, chloride, sulfate — plus a chlorine residual of a few tenths of a milligram per litre that keeps the pipes safe (see [[water-treatment]]). The World Health Organization sets guideline values for lifetime drinking of two litres a day:

| Substance | WHO guideline | Why |
|---|---|---|
| Nitrate | 50 mg/L (as nitrate) | infants: blood cannot carry oxygen |
| Fluoride | 1.5 mg/L | above it, teeth mottle and bones thicken |
| Lead | 10 µg/L | no safe level for the developing brain; from old pipes |
| Arsenic | 10 µg/L (provisional) | cancer; natural, in well water |
| Chlorine (free) | 5 mg/L | far above the taste threshold of about 0.6 mg/L |

Bottled water is not purer in a place with a regulated public supply: it is often tested less often, and costs hundreds of times as much per litre. Where the tap is not safe, it is a different matter.

### Too much, too fast
The kidney can pass at most about 0.8–1 litre of water an hour. Drink faster for long enough and the water that cannot leave dilutes the blood's sodium: **hyponatraemia**, a serum sodium below 135 mmol/L. Of 488 runners sampled at the 2002 Boston Marathon, 13 % had it (Almond and colleagues, 2005), the ones who had drunk most and gained weight.

> [!warn] Severe hyponatraemia can cause a headache, nausea, confusion, seizures and coma. Anyone who becomes confused, very drowsy or has a seizure after drinking a great deal needs urgent medical help: call your local emergency number.

> [!key] The body replaces about 2.5 L of water a day and steers it by osmotic sensors that react to a 1 % change; thirst is a reliable guide for a healthy adult, and the real hazards are contaminants above guideline values and, rarely, drinking far faster than the kidneys can clear.`,
  ideas: ['About 2.5 L of water enters and leaves an adult each day: drinks 1.5 L, food 0.7 L, metabolism 0.3 L; and urine 1.5 L, skin and breath 0.8 L, sweat and gut 0.2 L.', 'Sensors in the brain react to a rise of about 1 % in the blood’s concentration; thirst is a dependable guide to a healthy adult, less so in the old, in infants and in hard exercise in heat.', 'Tap water is a dilute mineral solution (50–500 mg/L) kept below WHO guideline values such as 50 mg/L nitrate, 10 µg/L lead and 10 µg/L arsenic.', 'The kidney clears about 1 L of water an hour at most; drinking faster than that dilutes the blood’s sodium.'],
  pitfalls: ["“Everyone must drink eight glasses a day” — No study supports a fixed number. Needs vary from one litre to several with climate, diet and effort, and about a fifth to a third of the water comes with food.", "“Coffee and tea dehydrate you” — At ordinary doses the water in the cup outweighs the mild diuretic effect of the caffeine; controlled trials of habitual coffee drinkers found hydration markers like those on water.", "“You cannot drink too much water” — You can: sodium in the blood is diluted if more water arrives than the kidneys can clear, and the harm is to the brain.", "“Bottled water is pure and tap water is not” — A regulated public supply is routinely tested for the substances in the guideline list; bottled water is mostly a matter of taste and convenience."],
  terms: [
    { term: 'Osmolality', also: ['plasma osmolality', 'mOsm/kg'], def: 'The number of dissolved particles per kilogram of water, in milliosmoles. Blood plasma runs at about 285–295 mOsm/kg, and thirst and the antidiuretic hormone respond to changes of 1–3 % in it.' },
    { term: 'Antidiuretic hormone', also: ['ADH', 'vasopressin', 'AVP'], def: 'A hormone released by the pituitary when the blood becomes more concentrated or its volume falls; it makes the kidney reabsorb water through aquaporin channels so that less, stronger urine is made.' },
    { term: 'Metabolic water', also: ['oxidation water', 'water of oxidation'], def: 'Water produced inside the body when food is oxidised: 1.07 g per gram of fat, 0.55 g per gram of carbohydrate, 0.41 g per gram of protein; about 0.3 L a day for an adult.' },
    { term: 'Hyponatraemia', also: ['low blood sodium', 'water intoxication'], def: 'A serum sodium concentration below 135 mmol/L. It arises when water is taken in, or kept, in excess of salt; severe cases swell brain cells and are an emergency.' },
    { term: 'Total dissolved solids', also: ['TDS', 'mineral content'], def: 'The mass of dissolved minerals and salts per litre of water, in mg/L. Tap water is typically 50–500 mg/L; the WHO calls taste poor above about 1,000 mg/L.' },
    { term: 'Guideline value', also: ['WHO guideline value', 'GV'], def: 'The concentration of a substance in drinking water that the WHO judges would not harm a person drinking two litres a day for a lifetime; a basis for national standards rather than a legal limit itself.' }
  ],
  formulas: [
    { name: 'Calculated osmolality of the blood', expr: 'osm = 2*Na + Glu + Urea', tex: '\\mathrm{Osm} = 2\\,\\mathrm{Na} + \\mathrm{Glu} + \\mathrm{Urea}',
      vars: { osm: { name: 'osmolality', q: 'osmol', unit: 'mOsm/L', tex: '\\mathrm{Osm}', hint: 'About 275–295 in a healthy adult; thirst begins a few per cent above the set point.' }, Na: { name: 'sodium', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\mathrm{Na}', hint: 'Normal serum sodium is 135–145 mmol/L; reference ranges vary by laboratory.' }, Glu: { name: 'glucose', q: 'concentration', unit: 'mmol/L', value: 5, tex: '\\mathrm{Glu}', hint: 'Fasting glucose about 4–6 mmol/L (70–110 mg/dL).' }, Urea: { name: 'urea', q: 'concentration', unit: 'mmol/L', value: 5, tex: '\\mathrm{Urea}', hint: 'About 2.5–7 mmol/L (urea nitrogen 7–20 mg/dL).' } },
      solveFor: 'osm', note: 'Sodium and the anions that go with it supply nearly all the particles, which is why the blood’s sodium is the number that thirst effectively watches. The factor 2 stands for sodium and its partners.',
      stories: { osm: 'A blood test shows sodium {Na}, glucose {Glu} and urea {Urea}. What is the calculated osmolality?', Na: 'The calculated osmolality is {osm} with glucose {Glu} and urea {Urea}. What is the sodium?' } },
    { name: 'Diluting the blood’s sodium', expr: 'C = C0*TBW/(TBW + V)', tex: 'C = C_0\\,\\frac{\\mathrm{TBW}}{\\mathrm{TBW} + V}',
      vars: { C: { name: 'sodium after the water is kept', q: 'concentration', unit: 'mmol/L', hint: 'Below 135 mmol/L is hyponatraemia.' }, C0: { name: 'sodium before', q: 'concentration', unit: 'mmol/L', value: 140, tex: 'C_0' }, TBW: { name: 'total body water', q: 'volume', unit: 'L', value: 42, min: 10, max: 60, tex: '\\mathrm{TBW}', hint: 'About 60 % of body mass in a man (42 L at 70 kg), 50–55 % in a woman.' }, V: { name: 'extra water kept in the body', q: 'volume', unit: 'L', value: 3, min: 0, max: 15, hint: 'Water drunk minus water the kidneys have cleared and sweat has lost.' } },
      solveFor: 'C', note: 'A one-compartment sketch: the same sodium shared among more water. Real cases are complicated by sodium lost in sweat and by the hormone that holds back urine during a race.',
      stories: { C: 'A runner with {TBW} of body water and sodium {C0} holds back {V} of plain water. What is the sodium now?', V: 'Sodium falls from {C0} to {C} in a person with {TBW} of body water. How much extra water is kept?' } },
    { name: 'Sweat needed to shed heat', expr: 'm = P*t/Lv', tex: 'm = \\frac{P\\,t}{L_v}',
      vars: { m: { name: 'sweat evaporated', q: 'mass', unit: 'kg', hint: 'A kilogram of sweat is about a litre.' }, P: { name: 'heat to lose by evaporation', q: 'power', unit: 'W', value: 500, hint: 'Hard exercise makes 500–1,000 W of surplus heat; resting is about 100 W.' }, t: { name: 'time', q: 'time', unit: 'h', value: 1 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2420, fixed: true, tex: 'L_v', hint: 'About 2,420 kJ/kg at skin temperature, a little more than at 100 °C.' } },
      solveFor: 'm', note: 'Only sweat that evaporates cools; sweat that drips off carries away no heat. In humid air much of it drips.',
      stories: { m: 'Evaporation must carry away {P} for {t}. How much sweat is that?', P: 'An athlete evaporates {m} of sweat in {t}. What cooling power is that?' } },
    { name: 'Turnover time of the body’s water', expr: 't = ln(2)*V/F', tex: 't_{1/2} = \\ln 2\\,\\frac{V}{F}',
      vars: { t: { name: 'time to renew half the body water (days)', q: false, unit: 'days', tex: 't_{1/2}', hint: 'About 10 days for an adult; days for an infant, weeks for the old and sedentary.' }, V: { name: 'body water (L)', q: false, unit: 'L', value: 42 }, F: { name: 'daily turnover (L/day)', q: false, unit: 'L/day', value: 2.5, hint: 'Intake equals output at steady state: about 2.5 L a day.' } },
      solveFor: 't', note: 'Valid for a well-mixed pool replaced at a steady rate; isotope tracers (deuterated or labelled water) measure it directly.',
      stories: { t: 'An adult holds {V} of water and turns over {F}. After how many days is half of it new water?' } }
  ],
  examples: [
    { title: 'Where the 2.5 litres go', q: 'An adult drinks 1.5 L, eats food holding 0.7 L, and burns food that yields 0.3 L of water. What is the total, and what fraction is the “drink”?',
      steps: ['Total in: $1.5 + 0.7 + 0.3 = 2.5$ L.', 'Fraction from drinks: $1.5/2.5 = 0.6$.', 'So 40 % of the water arrives without anyone pouring it — which is why the “eight glasses” of 1.9 L, taken on top of normal food, is more than the budget asks.'],
      a: '2.5 L in all, 60 % of it as drink.' },
    { title: 'Three litres kept', q: 'After a long race a man of 70 kg (body water 42 L, serum sodium 140 mmol/L) has retained 3 L of the plain water he drank. What is his sodium, treating the body as one pool?',
      steps: [{ text: 'Dilute the same sodium through more water:', tex: 'C = 140 \\times \\frac{42}{42 + 3} = 130.7\\ \\mathrm{mmol/L}' }, 'That is below 135, so it meets the definition of hyponatraemia, though by a modest margin. Severe cases (below 120) need a much larger excess or a body that is also losing sodium.'],
      a: 'About 131 mmol/L: mildly low, from 3 L alone.' },
    { title: 'Sweating for an hour', q: 'A cyclist makes 600 W more heat than she can lose by other routes. How much sweat must evaporate in an hour?',
      steps: ['Heat to lose: $600 \\times 3600 = 2.16$ MJ.', 'Each kilogram of sweat carries away 2.42 MJ as it evaporates, so $2.16/2.42 = 0.89$ kg.'],
      a: 'About 0.9 L of sweat — and all of it has to evaporate, not run off.' }
  ],
  quiz: [
    { q: 'Where does a person’s daily water intake of about 2.5 L come from?', choices: ['Entirely from drinks', 'Drinks, the moisture in food and water made by metabolism', 'Drinks and tap water only; food adds none', 'Mostly from the air breathed in'], a: 1, why: 'Drinks supply about 1.5 L, food about 0.7 L and the oxidation of food about 0.3 L. The breath loses water; it does not gain it.' },
    { q: 'The rule “drink eight glasses of water a day” rests on a controlled study of how much water healthy adults need.', a: false, why: 'Valtin (2002) found no such study. Needs vary with climate, body size, diet and exercise, and a large part of the intake comes with food and other drinks.' },
    { q: 'Thirst sets in after the blood’s osmolality has risen by', choices: ['about 0.01 %', 'a few per cent', 'about 30 %', 'about 100 %'], a: 1, why: 'The hormone loop responds to about 1 %, and thirst itself to a few per cent: a sensitive control, which is why healthy adults stay within a narrow range without counting glasses.' },
    { q: 'A woman of 55 kg with 30 L of body water and serum sodium 140 mmol/L retains 4 L of water. Her sodium falls to about what? (mmol/L)', answer: 123.5, why: '$140 \\times 30/(30+4) = 123.5$ mmol/L, dangerously low; the smaller the body, the faster the dilution.' },
    { q: 'Why can drinking several litres of water in an hour be dangerous even though water is harmless?', choices: ['Water itself is toxic above 3 L', 'The kidney clears at most about 1 L an hour, so the surplus dilutes the sodium in the blood', 'Cold water stops the heart', 'The stomach absorbs only 500 mL'], a: 1, why: 'The harm is dilution of sodium and the swelling of brain cells; it is not the water as a substance. Sipping the same volume across a day is absorbed and cleared without trouble.' }
  ],
  applications: ['Marathons and hot-weather work: advice now speaks of drinking to thirst because over-drinking, not under-drinking, caused the deaths from hyponatraemia in races.', 'Hospitals and care homes: the old and the sedentary are offered drinks on a schedule because their thirst is blunted.', 'Setting drinking-water standards: each WHO guideline value assumes a 60 kg adult drinking two litres a day for a lifetime.', 'Bottle-or-tap choices and the cost of water: tap water costs a fraction of a cent a litre in most rich countries.'],
  history: 'The 1945 recommendation that the body needs about one millilitre of water per calorie of food was published by the US Food and Nutrition Board; Valtin’s 2002 review in the *American Journal of Physiology* is the standard debunking. Hyponatraemia in endurance athletes was first described in the 1980s (Noakes and colleagues, 1985), and the study of the 2002 Boston Marathon by Almond and colleagues, published in 2005, showed how common the milder form was.',
  sources: ['Valtin, “Drink at least eight glasses of water a day. Really?”, *American Journal of Physiology — Regulatory, Integrative and Comparative Physiology* 283, R993 (2002).', 'EFSA Panel on Dietetic Products, Nutrition and Allergies, “Scientific opinion on dietary reference values for water”, *EFSA Journal* 8(3):1459 (2010).', 'WHO, *Guidelines for drinking-water quality*, 4th edition incorporating the first and second addenda (2022).', 'Almond and colleagues, “Hyponatremia among runners in the Boston Marathon”, *New England Journal of Medicine* 352, 1550 (2005).'],
  sim: 'us-water-balance'
},

/* ================================================================ 2. water treatment */
{
  id: 'water-treatment', parent: 'water-for-people', title: 'Water treatment', level: 2,
  short: 'A river becomes drinking water in a chain: screens, a coagulant that clumps the clay, settling, sand, and then a disinfectant dosed so that concentration times contact time passes a threshold. John Snow’s pump handle in 1854 began the idea; chlorine at Jersey City in 1908 spread it; and about 2.2 billion people still lack a safely managed supply.',
  keywords: ['water treatment', 'drinking water plant', 'coagulation', 'flocculation', 'alum', 'sand filter', 'chlorination', 'chloramine', 'ozone', 'UV disinfection', 'CT value', 'turbidity', 'NTU', 'John Snow', 'Broad Street pump', 'cholera', 'typhoid', 'Jersey City', 'log removal'],
  prereq: ['drinking-water-and-thirst', 'rivers-and-groundwater', 'the-liquid-that-pulls-salt-apart'],
  related: ['desalination', 'ultrapure-water', 'how-much-water-things-take', 'hard-water-and-limescale', 'the-dielectric-constant', 'hydraulics:water-supply', 'hydraulics:water-resources', 'chemistry:acid-base-theory'],
  body: `
In September 1854 John Snow, a London physician, plotted the cholera deaths of Soho on a map and found them clustered round one public pump in Broad Street. He had the handle taken off; the outbreak, already waning, ended. The germ was not seen for another thirty years, but the lesson stood: water can carry disease, and a supply must be made safe on purpose. Every treatment plant since is a way of putting that lesson into a sequence of steps.

### The chain
| Stage | What it does | Turbidity after (typical) |
|---|---|---|
| Raw river | clay, silt, algae, microbes | 5–100 NTU, thousands in a flood |
| Screens | stop leaves, fish, rags | unchanged |
| Coagulation | alum (aluminium sulfate) releases Al³⁺, which cancels the negative charge that keeps clay particles apart | unchanged, but particles now stick |
| Flocculation | slow stirring, 20–30 minutes, grows flocs from micrometres to a millimetre | unchanged |
| Sedimentation | flocs settle over a few hours | 1–5 NTU |
| Sand filtration | what is left is caught in the sand bed, at 5–10 m/h | below 0.3 NTU |
| Disinfection | chlorine, chloramine, ozone or UV inactivate what remains | — |

*NTU* is the nephelometric turbidity unit, the cloudiness of the water measured by scattered light. Treatment plants aim for below 0.3 NTU after filtration because what hides microbes from the disinfectant is cloud.

### Disinfection: concentration times time
Chlorine kills in proportion to how much is present and how long it acts. The product, $CT$ in mg·min/L, is the measure the regulators use, and the log of the kill is roughly proportional to it (the Chick–Watson law). A residual of about 1 mg/L for half an hour is a $CT$ of 30. Two things reshape it: temperature (a $CT$ target roughly halves for each 10 °C of warming) and pH, because chlorine in water exists as hypochlorous acid HOCl, a powerful killer, in equilibrium with the hypochlorite ion OCl⁻, about eighty times weaker. The acid's share falls from 76 % at pH 7 to 24 % at pH 8.

The three microbial classes differ enormously. Bacteria such as *E. coli* die within a minute at 1 mg/L; viruses need a few minutes; the cysts of *Giardia* need a $CT$ tens of times larger than viruses do; and the oocysts of *Cryptosporidium* survive chlorine for days, which is why the filters and **ultraviolet light** matter: a dose of about 12 mJ/cm² inactivates 99.9 % of *Cryptosporidium*, and 40 mJ/cm² (400 J/m²) is a common design dose for drinking water. **Ozone** is strong and leaves no residual; **chloramine** (chlorine joined to ammonia) is weaker but persists, which is why many cities use it to protect pipes that run for kilometres.

### What the chlorine costs, and the other side
Chlorine reacts with organic matter in raw water to form by-products — the trihalomethanes, found by Rook in 1974 — and the rules aim to keep them low while keeping the kill. The same chlorine gives the “pool” smell that fills many taps. A residual in the pipes is a protection against contamination after the plant.

### Did it work?
It worked more than almost anything else in public health. Jersey City began continuous chlorination of its water in 1908; typhoid, which killed tens of Americans in every hundred thousand each year in 1900, had nearly vanished from the cities by mid-century, and Cutler and Miller (2005) estimated that clean water accounts for nearly half of the fall in urban mortality in the first decades of the century. Yet the WHO and UNICEF reported in 2023 that about 2.2 billion people in 2022 still lacked safely managed drinking water, and diarrhoeal disease from unsafe water remains a leading killer of small children.

> [!key] Treatment is a sequence in which each stage removes what the next cannot: coagulation and filtration take out the cloud that hides microbes, and a disinfectant dose, set by concentration times time, takes out the rest. It is the most effective public-health engineering ever built and it still has not reached two billion people.`,
  ideas: ['The chain is screens, coagulation (alum), flocculation, sedimentation, sand filtration and disinfection; each step takes out what would defeat the next.', 'Disinfection depends on concentration times contact time, $CT$; pH, temperature and the organism change the target.', 'Chlorine is dosed as HOCl; chloramine is weaker but lasts in pipes; ozone and UV leave no residual, and UV is the practical answer to *Cryptosporidium*.', 'Typhoid and cholera fell in the cities that treated their water; about 2.2 billion people still lack a safely managed supply (WHO/UNICEF 2023).'],
  pitfalls: ["“Boiling and filtering are the same as treatment” — A filter jug removes taste and some metals, not microbes; boiling kills them but leaves chemical pollutants where they were.", "“More chlorine is always safer” — Past a point it adds taste and by-products without extra kill; the target is a $CT$ value met every minute, not the largest dose.", "“Clear water is safe water” — Many pathogens are invisible; turbidity matters because it protects microbes, not because it measures them.", "“UV leaves protection in the pipes” — It does not: UV and ozone leave no residual, so a small chlorine or chloramine dose usually follows."],
  terms: [
    { term: 'Turbidity', also: ['NTU', 'cloudiness'], def: 'The cloudiness of water caused by suspended particles, measured by the light they scatter, in nephelometric turbidity units (NTU). Filtered drinking water is held below 0.3 NTU in much of the world.' },
    { term: 'Coagulation', also: ['flocculation', 'alum dosing'], def: 'Adding a coagulant such as aluminium sulfate or ferric chloride whose metal ions neutralise the charge of suspended particles so that they clump into flocs which settle or can be filtered.' },
    { term: 'CT value', also: ['concentration times time', 'contact time'], def: 'The product of disinfectant concentration (mg/L) and contact time (min), the basis of disinfection rules. The log inactivation is roughly proportional to it.' },
    { term: 'Log removal', also: ['log reduction', '3-log'], def: 'A tenfold reduction counted as one “log”: 3-log is 99.9 % removed or inactivated, 4-log is 99.99 %.' },
    { term: 'Chloramine', also: ['monochloramine', 'NH₂Cl'], def: 'A weaker disinfectant made by combining chlorine with ammonia; it lasts far longer in distribution pipes and forms fewer trihalomethanes than free chlorine.' },
    { term: 'UV dose', also: ['fluence', 'mJ/cm²'], def: 'The ultraviolet energy delivered per unit area, intensity times exposure time, in mJ/cm² (1 mJ/cm² = 10 J/m²). It damages the nucleic acids of microbes so that they cannot copy.' }
  ],
  formulas: [
    { name: 'Disinfection dose', expr: 'CT = C*t', tex: '\\mathrm{CT} = C\\,t',
      vars: { CT: { name: 'CT value (mg·min/L)', q: false, unit: 'mg·min/L', tex: '\\mathrm{CT}' }, C: { name: 'residual disinfectant (mg/L)', q: false, unit: 'mg/L', value: 1, min: 0, hint: 'Free chlorine at the plant outlet is typically 0.5–2 mg/L.' }, t: { name: 'contact time (min)', q: false, unit: 'min', value: 30, min: 0, hint: 'The time the water spends in the contact tank or pipe, usually the fastest 10 % of the flow.' } },
      solveFor: 'CT', note: 'A drinking-water regulation gives the CT needed for each organism, temperature and pH; the plant must show that its tanks reach it.',
      stories: { CT: 'Chlorine at {C} acts for {t}. What is the CT value?', t: 'How long must {C} of chlorine act to reach CT = {CT}?' } },
    { name: 'Inactivation by chlorine (Chick–Watson)', expr: 'L = k*C*t', tex: 'L = k\\,C\\,t',
      vars: { L: { name: 'log10 inactivation', q: false, unit: 'log', hint: '3 means 99.9 % killed.' }, k: { name: 'rate constant (L/(mg·min))', q: false, unit: 'L/(mg·min)', value: 0.03, hint: 'Depends on the organism, temperature and pH. 0.03 is about right for Giardia in cold water; E. coli is some hundred times larger.' }, C: { name: 'residual (mg/L)', q: false, unit: 'mg/L', value: 1 }, t: { name: 'time (min)', q: false, unit: 'min', value: 30 } },
      solveFor: 'L', note: 'The simplest law of disinfection, accurate in the middle of the range; real curves have shoulders and tails.',
      stories: { L: 'With k = {k}, chlorine at {C} acts for {t}. How many log units are killed?', t: 'How long is needed for {L} of kill with k = {k} and {C}?' } },
    { name: 'Share of chlorine that is HOCl', expr: 'f = 1/(1 + 10^(pH - pKa))', tex: 'f_{\\mathrm{HOCl}} = \\frac{1}{1 + 10^{\\mathrm{pH} - \\mathrm{pK_a}}}',
      vars: { f: { name: 'fraction as HOCl', q: 'ratio', unit: '%', tex: 'f_{\\mathrm{HOCl}}', hint: 'The more powerful form; the rest is hypochlorite, OCl⁻.' }, pH: { name: 'pH of the water', value: 7, min: 4, max: 11, tex: '\\mathrm{pH}' }, pKa: { name: 'pKa of hypochlorous acid', value: 7.5, fixed: true, tex: '\\mathrm{pK_a}' } },
      solveFor: 'f', note: 'The Henderson–Hasselbalch relation for a weak acid. Dosing at a lower pH makes the same chlorine kill faster.',
      stories: { f: 'Water of pH {pH} is chlorinated. What share of the free chlorine is the strong form HOCl?' } },
    { name: 'Ultraviolet dose', expr: 'D = I*t', tex: 'D = I\\,t',
      vars: { D: { name: 'UV dose (mJ/cm²)', q: false, unit: 'mJ/cm²' }, I: { name: 'intensity (mW/cm²)', q: false, unit: 'mW/cm²', value: 2, hint: 'Averaged over the water, after the lamp, the quartz and the water itself have absorbed some.' }, t: { name: 'exposure (s)', q: false, unit: 's', value: 20 } },
      solveFor: 'D', note: 'One mW/cm² for one second is one mJ/cm². Reactors are designed so that the slowest, farthest packet of water still gets the dose.',
      stories: { D: 'Water spends {t} in a lamp bank with intensity {I}. What dose does it receive?', t: 'How long to deliver {D} at {I}?' } }
  ],
  examples: [
    { title: 'A contact tank', q: 'Water leaves a tank carrying a chlorine residual of 1.2 mg/L after 25 minutes of contact. What is the CT value, and how many log units of a Giardia-like organism (k = 0.03 L/(mg·min)) does it inactivate?',
      steps: ['$CT = 1.2 \\times 25 = 30$ mg·min/L.', 'Log kill: $L = 0.03 \\times 30 = 0.9$ log, about 87 %.', 'A full 3-log kill with this constant would need $CT = 3/0.03 = 100$: more than three times the time or the dose, which is why a plant that must kill cysts in cold water adds contact volume, or UV.'],
      a: 'CT = 30 mg·min/L, about 0.9 log (87 %) of Giardia-like organisms.' },
    { title: 'Meeting a 3-log target by filtration and chlorine', q: 'A rule demands 99.9 % (3-log) inactivation of *Giardia* and 99.99 % (4-log) of viruses. Conventional filtration is credited with 2.5 log and 2 log. How much must the disinfectant do?',
      steps: ['*Giardia*: $3 - 2.5 = 0.5$ log from the disinfectant.', 'Viruses: $4 - 2 = 2$ log from the disinfectant.', 'Per log, *Giardia* cysts are far harder to kill with chlorine than viruses are, so in cold water the half-log for *Giardia* usually sets the chlorine dose even though it is the smaller number of logs.'],
      a: '0.5 log for Giardia and 2 log for viruses; filtration does most of the work for the cysts.' },
    { title: 'A UV reactor', q: 'A UV reactor delivers an average intensity of 3 mW/cm² for 15 seconds. Is the dose enough for the common design dose of 40 mJ/cm²?',
      steps: ['Dose: $3 \\times 15 = 45$ mJ/cm².', 'That exceeds 40 mJ/cm² and the 12 mJ/cm² that gives 3-log *Cryptosporidium* inactivation by a wide margin.'],
      a: '45 mJ/cm²: yes, with a margin of about 12 %.' }
  ],
  quiz: [
    { q: 'What does alum do in coagulation?', choices: ['Kills the microbes', 'Releases aluminium ions that neutralise the charge on clay particles so they clump', 'Raises the pH to 12', 'Removes dissolved salt'], a: 1, why: 'Particles in raw water repel one another because they carry negative charge. Aluminium ions cancel it, and the clumps grow into flocs that settle or are filtered.' },
    { q: 'A treatment plant that keeps 0.5 mg/L of chlorine for 20 minutes has a CT value of', choices: ['0.025 mg·min/L', '10 mg·min/L', '20.5 mg·min/L', '100 mg·min/L'], a: 1, why: 'The product of concentration and time: $0.5 \\times 20 = 10$.' },
    { q: 'Chlorine works better at pH 6.5 than at pH 8.5.', a: true, why: 'At the lower pH most of the free chlorine is the hypochlorous acid HOCl, which kills about eighty times faster than the hypochlorite ion that dominates at the higher pH.' },
    { q: 'Why is ultraviolet light the practical defence against *Cryptosporidium*?', choices: ['It leaves a residual in the pipes', 'The oocysts survive chlorine but are damaged by a modest UV dose', 'It removes turbidity', 'It is cheaper than filtration'], a: 1, why: 'The oocysts have a tough wall that chlorine barely penetrates; about 12 mJ/cm² of UV disrupts their DNA enough to inactivate 99.9 %. UV leaves no residual, so it does not replace the chlorine in the pipes.' },
    { q: 'What fraction of the water in a glass is killed by a 2-log reduction? (answer in %)', answer: 99, why: 'Each log is a factor of ten in survivors: 2-log leaves 1 % alive, so 99 % are inactivated.' }
  ],
  applications: ['Every city supply, from the Soho pump of 1854 to a modern plant that treats millions of cubic metres a day.', 'Swimming pools, which are dosed to keep a CT value on the bathers’ pathogens, and the hypochlorite bleach in a household disinfectant.', 'Emergency water: a few drops of bleach or a boiled pot gives the CT or the heat that a plant would.', 'Wastewater reuse: after treatment, ultraviolet and ozone are the usual final steps before recycled water is released or reused.'],
  history: 'Snow’s map (1854) preceded germ theory; Koch isolated the cholera bacillus in 1883. The first continuous chlorination of a public supply in the United States was at Jersey City in 1908, designed under the engineer John Leal and George Fuller; the practice spread within a decade, and the fall in typhoid deaths that followed is among the clearest results in the history of public health. The trihalomethanes were identified in treated water in 1974.',
  sources: ['Snow, *On the Mode of Communication of Cholera*, 2nd edition (1855).', 'WHO/UNICEF Joint Monitoring Programme, *Progress on household drinking water, sanitation and hygiene 2000–2022* (2023).', 'Crittenden and colleagues (MWH), *Water Treatment: Principles and Design*, 3rd edition (2012) — coagulation, filtration and the CT concept.', 'US EPA, *Ultraviolet Disinfection Guidance Manual for the Final Long Term 2 Enhanced Surface Water Treatment Rule* (2006) — dose tables.'],
  sim: 'us-treatment-train'
},

/* ================================================================ 3. desalination */
{
  id: 'desalination', parent: 'water-for-people', title: 'Desalination', level: 2,
  short: 'Sea water has an osmotic pressure of about 27 bar, and taking fresh water out of it costs at least 1.06 kWh per cubic metre at half recovery. Reverse osmosis squeezes it through a membrane at 55–70 bar and, with energy recovery, now spends 2.5–4 kWh/m³; thermal plants in the Gulf spend several times as much. Israel gets most of its household water this way.',
  keywords: ['desalination', 'reverse osmosis', 'RO', 'seawater', 'osmotic pressure', 'brine', 'recovery', 'energy recovery', 'kWh per cubic metre', 'Sorek', 'MSF', 'MED', 'multi-stage flash', 'thermal desalination', 'Israel', 'Ashkelon', 'minimum energy of desalination'],
  prereq: ['osmosis-and-osmotic-pressure', 'the-salt-of-the-sea', 'colligative-properties'],
  related: ['water-treatment', 'ultrapure-water', 'water-in-the-kitchen', 'latent-heat-of-vaporisation', 'how-much-water-things-take', 'hydraulics:water-resources', 'chemistry:osmotic-pressure', 'physics:latent-heat'],
  body: `
A tap in Tel Aviv today probably runs with water that was in the Mediterranean a day earlier. The sea holds 97 % of Earth's water, and the difficulty is the 35 grams of salt in each kilogram. Taking it out is an uphill task with a floor set by thermodynamics, a proven way over it at a few times the floor, and a bill that is mostly electricity.

### The floor
A semipermeable membrane lets water through and holds salt back; on the sea water's side the pressure needed to stop water flowing in is the osmotic pressure, $\\pi = cRT$, with $c$ the concentration of dissolved particles (see [[osmosis-and-osmotic-pressure]]). Sea water carries about 1.1 osmoles per litre — sodium and chloride ions count as two particles apiece — so at 25 °C

$$\\pi = 1.1\\times 10^{3}\\ \\mathrm{mol/m^3} \\times 8.314 \\times 298\\ \\mathrm{K} \\approx 2.7\\ \\mathrm{MPa} = 27\\ \\mathrm{bar}.$$

That is the pressure at the foot of a column of water 280 metres high. To get fresh water out you must push harder than this. And as water leaves, the salt left behind is more concentrated, so the pressure rises: at a **recovery** $r$ (the fraction of the feed that becomes fresh water) the final brine is $1/(1-r)$ times as strong. Adding up the work as the brine thickens gives the minimum energy per cubic metre of fresh water, $\\pi_0\\,[-\\ln(1-r)]/r$. At 50 % recovery that is **1.06 kWh/m³** (Elimelech and Phillip, 2011): about the energy that would warm the same cubic metre of water by one degree.

### The way over: reverse osmosis
Reverse osmosis pushes sea water at 55–70 bar against a polyamide membrane only a fraction of a micrometre thick that passes water and holds back 99.8 % of the salt. Because the brine at the outlet of a 45 % recovery plant has an osmotic pressure of 50 bar, the pump must exceed that and the membranes are rated to about 83 bar, which sets the ceiling on recovery. The trick that made the process cheap is **energy recovery**: the rejected brine still carries nearly the full pressure, and pressure exchangers hand it back to the incoming feed with an efficiency of 95–98 %. The pump then supplies only the part that went through the membrane.

| Process | Energy per m³ of fresh water |
|---|---|
| Thermodynamic floor, sea water at 50 % recovery | 1.06 kWh |
| Sea-water RO plant, high-pressure pump only, with energy recovery | about 2 kWh |
| Sea-water RO, whole plant (intake, pretreatment, post-treatment) | 2.5–4 kWh |
| Brackish-water RO (feed 1–10 g/L) | 0.5–1.5 kWh |
| Thermal (multi-stage flash, multi-effect), electrical equivalent | roughly 10–15 kWh |

### The Gulf and Israel
The Gulf states built desalination first, and with cheap fuel and heat from power stations they chose **distillation**: multi-stage flash (water boils at falling pressure in stage after stage, each giving up its latent heat to warm the feed) and multi-effect distillation. They use several times the energy of RO, partly because evaporating a kilogram takes 2,257 kJ whatever one does. Israel started later and chose reverse osmosis: Ashkelon (2005), Palmachim (2007), Hadera (2009), Sorek (2013) and Ashdod (2015). Sorek makes 624,000 m³ a day at about 3 kWh/m³ — a power draw of roughly 78 MW — and by the 2020s desalination supplied something like 80–85 % of Israel's household and municipal water (approximate).

### The by-products
For each cubic metre of fresh water about 1.5 m³ of brine, twice the salinity of the sea, goes back: Jones and colleagues (2019) counted 15,906 plants making 95 million m³/day of water and 142 million m³/day of brine. Diffusers spread it in the sea, but the near-shore effects of the extra salt and the chemicals used in cleaning membranes are real. The product water, with its minerals taken out, has to have calcium and magnesium put back so it does not attack pipes or lack nutrients.

> [!key] Desalination is the osmotic pressure of the sea, 27 bar, paid for in electricity: a floor of 1.06 kWh/m³, an RO plant at 2.5–4, a distillation plant at several times that. The product is expensive because water was never meant to be unmixed from salt.`,
  ideas: ['Sea water has an osmotic pressure of about 27 bar; fresh water can be taken out only by pushing harder than this, and the pressure rises as the brine thickens.', 'The thermodynamic minimum is 1.06 kWh/m³ at 50 % recovery; real reverse-osmosis plants with energy recovery use 2.5–4.', 'Energy recovery devices return 95–98 % of the brine’s pressure to the feed, which cut the energy of sea-water RO to a third of what it was.', 'Gulf plants distil sea water at many times the energy; Israel’s five large plants use RO and supply most of its household water.'],
  pitfalls: ["“Desalination is too expensive to use” — At about 0.5–1 US dollar per cubic metre it costs a few times more than river water but a small share of a household bill, and it is cheaper than the water it replaces where there is none.", "“RO is just a very fine sieve” — Partly. The polymer layer is dense: water dissolves in it and diffuses through while the hydrated ions are held out, and the pressure must beat the osmotic pressure, which a plain sieve would never need.", "“The brine is poison” — It is sea water at twice the salinity, with traces of anti-scaling and cleaning chemicals; the question is local concentration and the life of the sea floor near the outfall.", "“More recovery is always better” — Higher recovery makes less brine but thicker, so the pressure and energy rise and salts such as calcium sulfate precipitate on the membranes."],
  terms: [
    { term: 'Reverse osmosis', also: ['RO'], def: 'Forcing a solution through a semipermeable membrane with a hydraulic pressure greater than its osmotic pressure, so that water flows from the salty side to the fresh side.' },
    { term: 'Recovery', also: ['recovery ratio', 'permeate recovery'], def: 'The share of the feed water that leaves as fresh water (permeate). Sea-water plants run at 40–50 %, brackish plants at 75–90 %.' },
    { term: 'Brine', also: ['concentrate', 'reject'], def: 'The salty stream that leaves a desalination plant, at a concentration of $1/(1-r)$ times the feed when the membrane rejects all salt.' },
    { term: 'Energy recovery device', also: ['ERD', 'pressure exchanger', 'isobaric chamber'], def: 'A machine that moves the hydraulic pressure of the leaving brine into the incoming feed, with 95–98 % efficiency in current designs.' },
    { term: 'Multi-stage flash', also: ['MSF', 'flash distillation'], def: 'Desalination by letting heated sea water boil in successive chambers at lower and lower pressure, each condensing its steam on tubes that preheat the feed.' },
    { term: 'Specific energy consumption', also: ['kWh/m³', 'energy per cubic metre'], def: 'The electrical (or electrical-equivalent) energy used per cubic metre of fresh water produced; the figure by which plants are compared.' }
  ],
  formulas: [
    { name: 'Osmotic pressure of the feed', expr: 'Posm = c*R*T', tex: '\\pi = c\\,R\\,T',
      vars: { Posm: { name: 'osmotic pressure', q: 'pressure', unit: 'bar', tex: '\\pi' }, c: { name: 'concentration of particles', q: 'concentration', unit: 'mol/L', value: 1.1, hint: 'Sea water at 35 g/kg: about 1.1 osmol/L; the Gulf and Red Sea 1.3–1.5.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 60 } },
      solveFor: 'Posm', note: 'The van ’t Hoff relation, accurate to a few per cent for sea water if the particle concentration is taken as 1.1 osmol/L instead of the ideal 1.2.',
      stories: { Posm: 'Sea water with {c} of dissolved particles at {T}. What is its osmotic pressure?', c: 'A feed at {T} has an osmotic pressure of {Posm}. What is its particle concentration?' } },
    { name: 'Brine at a given recovery', expr: 'pb = p0/(1 - r)', tex: '\\pi_b = \\frac{\\pi_0}{1 - r}',
      vars: { pb: { name: 'osmotic pressure of the brine', q: 'pressure', unit: 'bar', tex: '\\pi_b' }, p0: { name: 'osmotic pressure of the feed', q: 'pressure', unit: 'bar', value: 27.3, tex: '\\pi_0' }, r: { name: 'recovery', q: 'ratio', unit: '%', value: 45, min: 1, max: 95 } },
      solveFor: 'pb', note: 'Assumes the membrane rejects all salt. The pump must exceed this pressure at the outlet; a membrane element is rated to about 83 bar.',
      stories: { pb: 'A feed has an osmotic pressure of {p0}. At a recovery of {r}, what is the osmotic pressure of the brine at the outlet?', r: 'A feed of {p0} leaves as brine of {pb}. What recovery was run?' } },
    { name: 'Minimum energy of desalination', expr: 'E = (p0/36)*(-ln(1 - r))/r', tex: 'E_{\\min} = \\frac{\\pi_0}{36}\\,\\frac{-\\ln(1 - r)}{r}',
      vars: { E: { name: 'minimum work (kWh per m³ of fresh water)', q: false, unit: 'kWh/m³', tex: 'E_{\\min}' }, p0: { name: 'osmotic pressure of the feed (bar)', q: false, unit: 'bar', value: 27.3, tex: '\\pi_0' }, r: { name: 'recovery', q: 'ratio', unit: '%', value: 50, min: 1, max: 95, hint: 'The limit as recovery goes to zero is the osmotic pressure itself, 0.76 kWh/m³ for sea water.' } },
      solveFor: 'E', note: 'The reversible work to unmix an ideal solution (Elimelech and Phillip 2011). Because 1 bar × 1 m³ = 100 kJ = 1/36 kWh, a pressure in bar gives kWh/m³ after dividing by 36.',
      stories: { E: 'A feed with osmotic pressure {p0} is desalinated at a recovery of {r}. What is the least work per cubic metre of product?' } },
    { name: 'Energy of a reverse-osmosis plant', expr: 'E = p/(36*eta*r)*(1 - eps*(1 - r))', tex: 'E = \\frac{p}{36\\,\\eta\\,r}\\bigl[1 - \\varepsilon(1 - r)\\bigr]',
      vars: { E: { name: 'high-pressure pump energy (kWh per m³ of fresh water)', q: false, unit: 'kWh/m³' }, p: { name: 'feed pressure (bar)', q: false, unit: 'bar', value: 57, min: 1, hint: 'Must exceed the brine’s osmotic pressure by the driving force; 55–70 bar for sea water.' }, eta: { name: 'pump efficiency', q: 'ratio', unit: '%', value: 85, min: 30, max: 100, tex: '\\eta' }, r: { name: 'recovery', q: 'ratio', unit: '%', value: 45, min: 5, max: 95 }, eps: { name: 'energy recovery efficiency', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: '\\varepsilon', hint: '0 with no recovery device; 95–98 % for a modern pressure exchanger.' } },
      solveFor: 'E', note: 'The feed is $1/r$ times the product; the pump lifts all of it, and the device returns a share of the brine’s pressure, $(1-r)/r$ of the product volume. Add 0.3–1 kWh/m³ for intake, pretreatment and post-treatment.',
      stories: { E: 'A plant runs at {p} and a recovery of {r}, with a pump efficiency of {eta} and energy recovery of {eps}. What energy does the high-pressure pump use per cubic metre of fresh water?' } }
  ],
  examples: [
    { title: 'The pressure that matters', q: 'A plant desalinates sea water (osmotic pressure 27.3 bar) at a recovery of 45 %. What is the osmotic pressure of the brine, and why must the feed be pumped above it?',
      steps: [{ text: 'The brine is concentrated by $1/(1-r)$:', tex: '\\pi_b = \\frac{27.3}{1 - 0.45} = 49.6\\ \\mathrm{bar}' }, 'At the last metre of membrane the water must still be pushed against 49.6 bar of osmotic pressure; to move at a useful rate the pump adds a margin of 5–8 bar: about 55–58 bar.'],
      a: '49.6 bar of osmotic pressure in the brine, so a feed pressure of 55–58 bar.' },
    { title: 'What Sorek costs in power', q: 'Sorek produces 624,000 m³ of fresh water a day at about 3.0 kWh/m³. What is the average electrical power, and how does it compare with the floor?',
      steps: ['Energy per day: $624{,}000 \\times 3.0 = 1.87\\times10^{6}$ kWh.', 'Power: $1.87\\times10^{6}/24 \\approx 78$ MW.', 'At the 1.06 kWh/m³ floor the plant would need $624{,}000 \\times 1.06/24 = 27.6$ MW. The real plant spends 2.8 times the floor.'],
      a: 'About 78 MW, 2.8 times the thermodynamic minimum of 27.6 MW.' },
    { title: 'Why energy recovery matters', q: 'A plant runs at 57 bar, recovery 45 %, with a pump efficiency of 85 %. Compare the pump energy with no recovery and with a 95 % efficient pressure exchanger.',
      steps: ['Without recovery: $E = 57/(36\\times0.85\\times0.45) = 4.14$ kWh/m³.', 'With recovery: multiply by $1 - 0.95\\times0.55 = 0.4775$ to get 1.98 kWh/m³.'],
      a: '4.14 kWh/m³ without, 1.98 kWh/m³ with: the device halves the pump energy.' }
  ],
  quiz: [
    { q: 'Why does the pressure needed to desalinate sea water rise as the recovery rises?', choices: ['The pump gets less efficient', 'The leftover brine is saltier, so its osmotic pressure is higher', 'The membrane shrinks', 'Fresh water is more viscous'], a: 1, why: 'Brine at recovery $r$ has $1/(1-r)$ times the salt concentration, and osmotic pressure is proportional to concentration: 27 bar at the feed becomes 54.6 bar at 50 % recovery.' },
    { q: 'The thermodynamic minimum energy to desalinate sea water at 50 % recovery is closest to', choices: ['0.01 kWh/m³', '1 kWh/m³', '10 kWh/m³', '100 kWh/m³'], a: 1, why: 'About 1.06 kWh/m³ (Elimelech and Phillip 2011), which would warm the water by roughly one degree. Real plants use 2.5–4; thermal plants 10 or more.' },
    { q: 'Energy recovery devices work by passing the pressure of the leaving brine to the incoming feed.', a: true, why: 'The brine leaves at nearly the feed pressure. A pressure exchanger transfers that pressure to fresh feed at 95–98 % efficiency, so the pump has only to supply the volume that crossed the membrane.' },
    { q: 'What is the osmotic pressure of sea water of 1.1 osmol/L at 25 °C, in bar?', answer: 27.3, why: '$1.1\\times10^{3}\\times8.314\\times298.15 = 2.73$ MPa, or 27.3 bar.' },
    { q: 'Gulf states built distillation plants rather than reverse osmosis because', choices: ['Distillation uses less energy', 'Fuel and waste heat from power stations were cheap and the plants came first', 'RO membranes cannot handle sea water', 'Distillation removes boron'], a: 1, why: 'Distillation uses far more energy, but with abundant oil and gas and a power station nearby it was the natural early choice. RO plants are now winning new contracts everywhere.' }
  ],
  applications: ['Israel’s five large RO plants supply most of the country’s household water, so a drought no longer cuts the tap.', 'Gulf states, Spain, Australia, Singapore, California: places where rain cannot meet demand use sea water or brackish water.', 'Ships, oil platforms and islands desalinate on board.', 'Industry: ultrapure water for chip factories and boiler feed begins with RO membranes (see [[ultrapure-water]]).'],
  history: 'Reverse osmosis became practical when Loeb and Sourirajan at UCLA made an asymmetric cellulose-acetate membrane in about 1960. The thin-film composite polyamide membrane of John Cadotte (1970s) raised both flux and salt rejection and is the basis of today’s plants; isobaric energy recovery in the 1990s–2000s took the energy of sea-water RO from more than 6 kWh/m³ to about 3.',
  sources: ['Elimelech and Phillip, “The future of seawater desalination: energy, technology, and the environment”, *Science* 333, 712 (2011).', 'Jones, Qadir, van Vliet, Smakhtin and Kang, “The state of desalination and brine production: a global outlook”, *Science of the Total Environment* 657, 1343 (2019).', 'Voutchkov, *Desalination Engineering: Planning and Design* (McGraw-Hill).', 'Israel Water Authority and IDE Technologies public descriptions of the Sorek and other plants (capacities and energy figures).'],
  sim: 'us-reverse-osmosis'
},

/* ================================================================ 4. heavy water in reactors */
{
  id: 'heavy-water-in-reactors', parent: 'water-for-people', title: 'Heavy water in reactors', level: 2,
  short: 'Fission neutrons must be slowed before they will split another uranium nucleus, and the best slowing needs a light nucleus that does not swallow them. Ordinary hydrogen slows well but captures neutrons; deuterium slows nearly as well and captures 640 times less, so heavy water lets a reactor run on natural uranium. The Norwegian plant that made it was the target of the best-known sabotage of the war.',
  keywords: ['heavy water', 'D2O', 'moderator', 'neutron', 'CANDU', 'natural uranium', 'moderating ratio', 'deuterium', 'Vemork', 'Rjukan', 'Norsk Hydro', 'Gunnerside', 'Urey', 'Girdler sulfide', 'neutron absorption cross-section', 'thermal neutron'],
  prereq: ['isotopes-and-heavy-water', 'water-as-an-element', 'the-deuterium-clock'],
  related: ['water-as-a-standard', 'quantum-effects-in-water', 'water-in-numbers', 'ice-beyond-earth', 'chemistry:isotopes'],
  body: `
A uranium-235 nucleus splits when it absorbs a neutron, and each split frees about 2.4 neutrons. For a chain reaction, one of those must go on to split another nucleus. The snag is speed: the neutrons are born at 2 MeV, moving at a tenth of the speed of light, and a U-235 nucleus catches them a thousand times more readily when they have slowed to thermal energies, about 0.025 eV. The job of a **moderator** is to slow them by collisions without absorbing them. A neutron loses the most energy against something of its own mass, so the best moderator is made of the lightest nuclei — hydrogen.

### Hydrogen slows, and swallows
A neutron striking a hydrogen nucleus (a proton, almost the same mass) can lose all its energy in one collision and loses, on average, a factor of $e$ (2.7) in energy per collision. Eighteen collisions take it from 2 MeV to 0.025 eV. But ordinary hydrogen also absorbs thermal neutrons, with a cross-section of 0.333 barns, to make deuterium. In water about one collision in seventy at thermal energy ends in capture. That is bearable when the fuel is uranium enriched to 3–5 % U-235; with natural uranium, which is 0.72 % U-235, light water uses up too many neutrons for a chain reaction in any arrangement.

### Deuterium slows and spares
Deuterium has twice the mass, so it takes about 25 collisions rather than 18 — but its capture cross-section is 0.0005 barns, 640 times smaller. The **moderating ratio** (slowing power divided by absorption) shows the gap.

| Moderator | Mass number $A$ | Mean log-energy loss $\\xi$ | Collisions (molecule), 2 MeV → 0.025 eV | Moderating ratio |
|---|---|---|---|---|
| Light water | 1 | 0.92 (molecule) | about 20 | about 60–70 |
| Heavy water, 99.75 % | 2 | 0.51 (molecule) | about 35 | about 2,000 |
| Graphite | 12 | 0.158 | 115 | about 200 |

(Pure D₂O reaches 5,000; it is the 0.25 % of ordinary hydrogen in reactor-grade heavy water that holds it to about 2,000.) With a moderator thirty times better than water, a reactor can run on **natural uranium** and does not need an enrichment plant. This is the logic of the Canadian CANDU design, in which heavy water is both moderator and coolant, and which is used in Canada, Argentina, South Korea, Romania, China and India.

### Making heavy water
Heavy water is hard to make because it is rare: the deuterium-to-hydrogen ratio of ocean water is 1 in 6,420, so a kilogram of D₂O is dissolved in about 5.8 tonnes of ordinary water. Its properties differ only slightly — boiling at 101.42 °C, freezing at 3.82 °C, densest at 11.2 °C at 1,105 kg/m³ — so separation proceeds in many stages. Norsk Hydro's plant at Vemork, Rjukan, took the heavy water that concentrates in the residue of its electrolysis cells, and a later process (Girdler sulfide) exploits the exchange of deuterium between hydrogen sulfide and water at two temperatures, 30 °C and 130 °C. A reactor holds hundreds of tonnes, at a price of the order of hundreds of dollars per kilogram.

### Vemork, 1943–44
After Germany occupied Norway in 1940 the Allies feared that the Vemork supply would feed a German reactor. In February 1943 six Norwegian saboteurs trained in Britain (Operation Gunnerside) crossed the gorge, entered the plant and blew up the high-concentration cells, spilling some 500 kg of heavy water. The plant was rebuilt; American bombers hit it in November 1943; the Germans moved the remaining stock, and on 20 February 1944 Knut Haukelid sank the ferry carrying it across Lake Tinnsjø. Germany's last reactor experiment, at Haigerloch in 1945, used about 1.5 tonnes of heavy water and never reached a chain reaction.

> [!key] Heavy water is the best slowing medium in common use because deuterium doubles hydrogen's mass but captures 640 times fewer neutrons: a moderating ratio near 2,000 against 60–70 for light water. That is why a reactor can burn natural uranium, and why one factory in Norway was worth a commando raid.`,
  ideas: ['A moderator slows fission neutrons from 2 MeV to thermal energies, where U-235 catches them about a thousand times more readily; it must not absorb them.', 'Hydrogen slows best (18 collisions) but absorbs (0.333 b); deuterium needs about 25 collisions and absorbs 640 times less (0.0005 b).', 'The moderating ratio is about 60–70 for light water and about 2,000 for reactor-grade heavy water, so only the latter can run on natural uranium.', 'Heavy water costs hundreds of dollars per kilogram: deuterium is 1 part in 6,420 of ocean hydrogen, and it is separated by electrolysis and by the Girdler sulfide process.'],
  pitfalls: ["“Heavy water is radioactive” — Deuterium is a stable isotope. A reactor’s heavy water becomes slightly radioactive with tritium, but the substance as made is not.", "“Heavy water is poisonous” — It is not toxic in small amounts; tests on mammals show harm only when a quarter or more of the body’s water is replaced, over days.", "“Any reactor needs heavy water” — Most use ordinary water as moderator and coolant, with enriched fuel; the choice is a trade between a costly moderator and an enrichment plant.", "“The sabotage ended the German bomb” — Historians stress that the German programme was far from a working reactor for other reasons; the Norwegian raids denied the Germans a supply and delayed rather than ended it."],
  terms: [
    { term: 'Moderator', also: ['neutron moderator'], def: 'A material that slows fast neutrons by elastic collisions without absorbing many of them; water, heavy water and graphite are the common ones.' },
    { term: 'Heavy water', also: ['D₂O', 'deuterium oxide'], def: 'Water in which the hydrogen is the isotope deuterium (one proton and one neutron): molar mass 20.03 g/mol, density 1,105 kg/m³ at its maximum, melting at 3.82 °C and boiling at 101.42 °C.' },
    { term: 'Moderating ratio', also: ['moderating power ratio'], def: 'The slowing-down power $\\xi\\Sigma_s$ divided by the absorption cross-section $\\Sigma_a$. About 60–70 for light water, 200 for graphite, 2,000 for reactor-grade D₂O.' },
    { term: 'Neutron absorption cross-section', also: ['barn', 'capture cross-section'], def: 'A measure, in barns (10⁻²⁸ m²), of how likely a nucleus is to capture a neutron. For thermal neutrons, 0.333 b for hydrogen-1 and 0.0005 b for deuterium.' },
    { term: 'CANDU', also: ['CANada Deuterium Uranium'], def: 'A Canadian reactor design that uses natural-uranium fuel with heavy water as moderator and coolant, and is refuelled while running.' },
    { term: 'Girdler sulfide process', also: ['GS process'], def: 'A heavy-water production method that exploits the temperature dependence of deuterium exchange between water and hydrogen sulfide, run between a cold tower (about 30 °C) and a hot one (about 130 °C).' }
  ],
  formulas: [
    { name: 'Mean log energy loss per collision', expr: 'xi = 1 + (A - 1)^2/(2*A)*ln((A - 1)/(A + 1))', tex: '\\xi = 1 + \\frac{(A-1)^2}{2A}\\,\\ln\\frac{A-1}{A+1}',
      vars: { xi: { name: 'mean logarithmic energy loss', tex: '\\xi', hint: 'The average of ln(E before / E after) over a collision; 1 for hydrogen.' }, A: { name: 'mass number of the nucleus', value: 2, min: 1.05, max: 240, hint: '1 hydrogen, 2 deuterium, 12 carbon, 16 oxygen, 238 uranium. The formula tends to 1 as A approaches 1.' } },
      solveFor: 'xi', note: 'For elastic scattering from nuclei at rest (the s-wave): a neutron can lose at most the fraction $1 - ((A-1)/(A+1))^2$ of its energy per collision.',
      stories: { xi: 'A neutron scatters off nuclei of mass number {A}. What is its mean logarithmic energy loss per collision?' } },
    { name: 'Collisions to slow down', expr: 'n = ln(E0/E)/xi', tex: 'n = \\frac{\\ln(E_0/E)}{\\xi}',
      vars: { n: { name: 'collisions', hint: 'Average number of scatterings between the two energies.' }, E0: { name: 'starting energy', q: 'energy', unit: 'MeV', value: 2, tex: 'E_0', hint: 'Fission neutrons average about 2 MeV.' }, E: { name: 'final energy', q: 'energy', unit: 'eV', value: 0.0253, hint: 'Thermal: 0.0253 eV at 20 °C.' }, xi: { name: 'mean logarithmic energy loss', value: 0.725, min: 0.05, max: 1, tex: '\\xi', hint: '1 for H, 0.725 for D, 0.158 for C.' } },
      solveFor: 'n', note: 'Gives 18 for hydrogen, 25 for deuterium and 115 for carbon between 2 MeV and 0.0253 eV.',
      stories: { n: 'A neutron starts at {E0} and slows to {E} in a material with ξ = {xi}. How many collisions does that take?' } },
    { name: 'Moderating ratio', expr: 'MR = xi*Ss/Sa', tex: '\\mathrm{MR} = \\frac{\\xi\\,\\Sigma_s}{\\Sigma_a}',
      vars: { MR: { name: 'moderating ratio', tex: '\\mathrm{MR}', hint: 'The higher, the better; above 100 makes natural-uranium fuel possible.' }, xi: { name: 'mean log energy loss per collision', value: 0.509, min: 0.01, max: 1, tex: '\\xi', hint: 'For the whole molecule: 0.920 for H₂O, 0.509 for D₂O.' }, Ss: { name: 'scattering cross-section per cm (cm⁻¹)', q: false, unit: 'cm⁻¹', value: 0.35, tex: '\\Sigma_s' }, Sa: { name: 'absorption cross-section per cm (cm⁻¹)', q: false, unit: 'cm⁻¹', value: 8.6e-5, tex: '\\Sigma_a', hint: '0.0222 for light water; 8.6e-5 for D₂O of 99.75 %: nearly all of it from the ordinary hydrogen that remains.' } },
      solveFor: 'MR', note: 'With the values shown, reactor-grade heavy water gives about 2,000. Pure D₂O is near 5,000 and light water is near 60.',
      stories: { MR: 'A moderator has ξ = {xi}, Σs = {Ss} and Σa = {Sa}. What is its moderating ratio?' } },
    { name: 'Heavy water hidden in natural water', expr: 'm = M*k*r/(1 + r)', tex: 'm = M\\,k\\,\\frac{r}{1 + r}',
      vars: { m: { name: 'D₂O in the water (kg)', q: false, unit: 'kg' }, M: { name: 'mass of ordinary water (kg)', q: false, unit: 'kg', value: 1000 }, r: { name: 'deuterium-to-hydrogen ratio', value: 1.5576e-4, fixed: true, hint: 'VSMOW, the ocean standard.' }, k: { name: 'molar-mass ratio D₂O to H₂O', value: 1.1117, fixed: true, hint: '20.028/18.015: turns the deuterium atoms into the mass of D₂O they would make.' } },
      solveFor: 'm', note: 'An estimate that counts every deuterium atom as if it sat in a D₂O molecule (most are in HDO). A tonne of ocean water holds about 0.17 kg of D₂O equivalent.',
      stories: { m: 'A tank holds {M} of natural water with D/H = {r}. How much D₂O is hidden in it?' } }
  ],
  examples: [
    { title: 'Collisions to slow a neutron', q: 'How many elastic collisions take a 2 MeV neutron to 0.0253 eV in hydrogen, deuterium and carbon?',
      steps: [{ text: 'The logarithm of the energy ratio is the same for all:', tex: '\\ln\\frac{2\\times10^{6}}{0.0253} = 18.2' }, 'Divide by $\\xi$: hydrogen $18.2/1 = 18$; deuterium $18.2/0.725 = 25$; carbon $18.2/0.158 = 115$.'],
      a: '18, 25 and 115 collisions: graphite needs a metre or two of thickness, water ten times less.' },
    { title: 'The kilogram of heavy water', q: 'How much ordinary water holds one kilogram of D₂O, if every deuterium atom is counted as part of a D₂O molecule?',
      steps: ['The ratio is $1.5576\\times10^{-4}$; per kilogram of water 111.0 mol of hydrogen atoms, of which $1.7\\times10^{-2}$ mol are deuterium.', 'As D₂O: $0.0086$ mol × 20.03 g/mol = 0.173 g per kilogram of water.', '$1000/0.173 \\approx 5{,}800$ kg of water per kilogram of D₂O.'],
      a: 'About 5.8 tonnes of ocean water per kilogram of heavy water: the reason it is expensive.' },
    { title: 'A kilotonne of heavy water', q: 'The Sudbury Neutrino Observatory held 1,000 tonnes of heavy water in a sphere 12 m across. What density does that imply, and does it agree with the 1,104 kg/m³ of D₂O at room temperature?',
      steps: ['Volume: $\\tfrac{4}{3}\\pi (6\\ \\mathrm{m})^3 = 905\\ \\mathrm{m^3}$.', 'Density: $10^{6}\\ \\mathrm{kg}/905\\ \\mathrm{m^3} = 1105\\ \\mathrm{kg/m^3}$.'],
      a: '1,105 kg/m³: heavy water is 10.5 % denser than light water.' }
  ],
  quiz: [
    { q: 'Why is heavy water a better moderator than light water for natural-uranium fuel?', choices: ['It is heavier, so it slows neutrons faster', 'Deuterium captures 640 times fewer neutrons than hydrogen, though it slows them almost as well', 'It is cheaper', 'It does not boil'], a: 1, why: 'The point is not slowing but sparing: hydrogen takes up thermal neutrons and a natural-uranium chain reaction cannot afford the loss. Deuterium takes up almost none.' },
    { q: 'About how many collisions take a fission neutron from 2 MeV to thermal energy in graphite?', choices: ['5', '18', '115', '10,000'], a: 2, why: 'Carbon’s $\\xi = 0.158$ and $\\ln(2\\times10^{6}/0.0253) = 18.2$, so about 115 collisions: graphite is a thick moderator.' },
    { q: 'Heavy water is dangerous to drink in a glass.', a: false, why: 'Deuterium is stable and a glass or two does no harm; trouble in mammals begins only when a large share (tens of per cent) of the body’s water is replaced over days.' },
    { q: 'Operation Gunnerside (1943) destroyed', choices: ['a German reactor', 'the high-concentration cells at the Vemork heavy-water plant', 'the Hydro ferry', 'a uranium mine'], a: 1, why: 'Six Norwegians destroyed the cells in the cellar, spilling about 500 kg of heavy water. The ferry was sunk a year later, in February 1944.' },
    { q: 'The D/H ratio of the ocean is 1.56×10⁻⁴. How many tonnes of ocean water (to the nearest tenth) hold one kilogram of D₂O-equivalent?', answer: 5.8, why: 'A tonne of ocean water holds $1000\\times1.1117\\times1.5576\\times10^{-4}/(1+1.5576\\times10^{-4}) = 0.173$ kg of D₂O-equivalent, so one kilogram needs $1/0.173 = 5.8$ tonnes.' }
  ],
  applications: ['CANDU power reactors: some thirty heavy-water reactors of the CANDU type run in Canada, India, South Korea, Romania, Argentina, China and Pakistan.', 'The Sudbury Neutrino Observatory: 1,000 tonnes of heavy water that showed solar neutrinos change flavour (Nobel Prize in Physics 2015 to Arthur McDonald and Takaaki Kajita).', 'Nuclear magnetic resonance: deuterated solvents let chemists see the molecule rather than the solvent.', 'Tracer studies: doubly labelled water measures the energy a person uses in daily life.'],
  history: 'Harold Urey, Ferdinand Brickwedde and George Murphy found deuterium in 1931 by spectroscopy of evaporated liquid hydrogen; Urey received the Nobel Prize in Chemistry in 1934. G. N. Lewis prepared nearly pure heavy water in 1933. Norsk Hydro began producing it at Vemork in 1934; the 1943 sabotage and the 1944 ferry sinking are the subject of Per Dahl’s history. The first heavy-water reactor outside the United States was Canada’s ZEEP in 1945.',
  sources: ['Lamarsh and Baratta, *Introduction to Nuclear Engineering*, 3rd edition (2001) — scattering, ξ and the moderating ratio.', 'Urey, Brickwedde and Murphy, “A hydrogen isotope of mass 2”, *Physical Review* 39, 164 (1932).', 'Dahl, *Heavy Water and the Wartime Race for Nuclear Energy* (Institute of Physics Publishing, 1999).', 'Ben Abu, Jungwirth, Niv and colleagues, “Sweet taste of heavy water”, *Communications Biology* (2021).'],
  sim: 'us-neutron-moderation'
},
/* ================================================================ 5. water as a standard */
{
  id: 'water-as-a-standard', parent: 'water-for-people', title: 'Water as a standard', level: 2,
  short: 'The kilogram was a litre of water at 4 °C; the Celsius degree is a hundredth of the way from the freezing to the boiling of water; the calorie is the heat for a gram of it; the kelvin was a 273.16th of its triple point; and the isotopes of every sample are quoted against ocean water. Each definition was dropped or redefined, and each failed for a reason that is itself a property of water.',
  keywords: ['kilogram', 'litre', 'Celsius', 'calorie', 'kelvin', 'triple point', 'VSMOW', 'specific gravity', 'Kilogramme des Archives', 'SI redefinition 2019', 'density of water at 4 C', 'centigrade', 'delta notation', 'ITS-90', 'BTU'],
  prereq: ['the-density-maximum', 'specific-heat-of-water', 'the-triple-point-standard'],
  related: ['isotopes-and-heavy-water', 'the-deuterium-clock', 'boiling-at-altitude', 'heavy-water-in-reactors', 'water-in-numbers', 'physics:density', 'physics:specific-heat'],
  body: `
The metric system was made partly from water. When the French revolutionaries wanted units “for all people, for all time” in the 1790s, they took the metre from the Earth and the mass from a cube of water. Over the next two centuries each water-based definition was replaced; the reasons are a short tour of what makes water unusual.

### The kilogram and the litre
In 1795 the *gramme* was defined as the mass of a cube of pure water one hundredth of a metre on a side, at the temperature of melting ice. In 1799 the platinum **Kilogramme des Archives** was made to stand for the mass of a cubic decimetre of water, and the temperature was changed to **4 °C**. The change was shrewd: near its density maximum the curve is flat. Water at 0 °C changes density by 68 parts per million for each degree of error in the thermometer; at 3.98 °C it changes by none, to first order, so a 0.1 K error costs less than 0.1 part per million. The price of the later, better measurement was a small embarrassment: a cubic decimetre of water at 4 °C has a mass of 0.999972 kg, 28 parts per million short of the archive's kilogram. The *litre*, defined in 1901 as the volume of a kilogram of water, was therefore 1.000028 dm³, until in 1964 it was redefined as exactly a cubic decimetre. In 1889 the kilogram had passed to an artefact in platinum–iridium; since 2019 it is defined by the Planck constant.

| Temperature | Mass of one litre of water |
|---|---|
| 0 °C | 0.99984 kg |
| 3.98 °C | 0.99997 kg |
| 20 °C | 0.99820 kg |
| 25 °C | 0.99705 kg |
| 37 °C | 0.99333 kg |

“A litre of water weighs a kilogram” is true to 0.3 % anywhere in a kitchen and to 0.003 % at the fridge door.

### The degree
Anders Celsius published his scale in Uppsala in 1742 with **0 at the boiling point and 100 at the freezing point**, upside down to ours; it was turned the right way up in the years after his death in 1744. He noted that boiling depends on the height of the barometer and specified the value at which to mark it. From 1954 the degree Celsius was tied to the kelvin, which was defined as 1/273.16 of the temperature of the **triple point of water** (0.01 °C), the single state where ice, liquid and vapour coexist. Under the 1990 temperature scale, water at one atmosphere boils at 99.974 °C: “100” has become a rounded approximation of something once defined to be exact. Since 2019 the kelvin is defined by the Boltzmann constant, so the triple point is now a measured value, 273.1600 K to a tenth of a millikelvin, and sealed triple-point cells remain the thermometer maker's most precise reference.

### The calorie
A calorie was the heat that raises one gram of water by one degree: 4.1855 J at 15 °C, though the thermochemical calorie (4.184 J) and the International Table calorie (4.1868 J) are conventions. The BTU, the heat to warm a pound of water by one degree Fahrenheit, is 1,055 J. A “ton” of refrigeration is the heat to melt a ton of ice in a day. With water's specific heat set to one, a thermometer and a scale measure heat.

### Relative to water: specific gravity and isotope ratios
**Specific gravity** is a density divided by that of water: 1.025 for sea water, 1.048 for a beer wort, 1.0–1.03 for urine. Isotope scientists go further. Hydrogen and oxygen ratios of any sample are quoted as a deviation, in parts per thousand, from **Vienna Standard Mean Ocean Water (VSMOW)**, whose D/H is 155.76 parts per million and ¹⁸O/¹⁶O 2005.2 parts per million: Antarctic snow sits near −55 ‰ in oxygen-18, which tells its history.

> [!key] Water gave the metric system its mass, its degree and its heat unit, because it is the most available reproducible substance. Each of those definitions was retired by physics that is itself a water property: the density maximum, the dependence of the boiling point on pressure, the triple point, and a slight variation of specific heat with temperature.`,
  ideas: ['The gramme (1795) was a cubic centimetre of water at 0 °C; the kilogram of 1799 used 4 °C, where the density curve is flat.', 'A cubic decimetre of water at 4 °C has a mass of 0.999972 kg; the litre was a kilogram of water (1.000028 dm³) from 1901 to 1964.', 'The Celsius scale had boiling at 0 and freezing at 100 until it was reversed in the 1740s; modern water boils at 99.974 °C at one atmosphere.', 'The calorie (4.184 J) and the specific gravity are water-relative units; isotope ratios are quoted against VSMOW.'],
  pitfalls: ["“Water boils at exactly 100 °C” — Only by the old definition. The 1990 scale puts the boiling point at 99.974 °C at 1 atm, and it moves by about a third of a degree with each kPa of weather.", "“A litre of water is a kilogram” — Within 0.3 % at room temperature; it is exact only for water near 4 °C, which is not how the litre is now defined.", "“The kelvin is still defined by water” — Since 2019 it is defined by the Boltzmann constant; the triple point is a measured temperature, 273.1600 K, and a great practical reference.", "“Celsius invented the scale in the form we use” — His 1742 scale was inverted, with 0 at the boiling point."],
  terms: [
    { term: 'Kilogramme des Archives', also: ['Archive kilogram', 'kilogram of 1799'], def: 'The platinum cylinder made in 1799 to stand for the mass of a cubic decimetre of water at its density maximum; it was replaced as the standard in 1889 by the International Prototype Kilogram.' },
    { term: 'Triple point of water', also: ['water triple point', '273.16 K', '0.01 °C'], def: 'The unique state, at 273.16 K (0.01 °C) and 611.657 Pa, where ice, liquid water and vapour coexist. It defined the kelvin from 1954 to 2019.' },
    { term: 'Specific gravity', also: ['relative density'], def: 'The ratio of a substance\'s density to that of water (at 4 °C or a stated temperature); a dimensionless number: 1.025 for sea water, 13.6 for mercury.' },
    { term: 'Calorie', also: ['cal', 'kilocalorie', 'Calorie'], def: 'A unit of energy, formerly the heat to raise 1 g of water by 1 °C; the thermochemical calorie is 4.184 J exactly. The food “Calorie” is a kilocalorie.' },
    { term: 'VSMOW', also: ['Vienna Standard Mean Ocean Water'], def: 'The reference water, prepared by the IAEA in Vienna, to which hydrogen and oxygen isotope ratios are compared; D/H = 155.76 ppm, ¹⁸O/¹⁶O = 2005.2 ppm.' },
    { term: 'Delta value', also: ['δ notation', 'per mil'], def: 'The deviation of an isotope ratio from the standard, in parts per thousand: δ = (R_sample/R_standard − 1) × 1000. Cold-climate snow has strongly negative values.' }
  ],
  formulas: [
    { name: 'How the density of water departs from its maximum', expr: 'dr = a*(T - Tm)^2', tex: '\\delta_\\rho = a\\,(T - T_m)^2',
      vars: { dr: { name: 'fractional loss of density', q: 'ratio', unit: 'ppm', tex: '\\delta_\\rho', hint: 'How far below the peak density the water is.' }, a: { name: 'curvature of the density curve (K⁻²)', value: 8.3e-6, fixed: true, hint: 'From the measured 0.013 % drop between 4 °C and 0 °C: 1.3×10⁻⁴ over 3.98 K squared.' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 0, min: 0, max: 10 }, Tm: { name: 'temperature of maximum density', q: 'temperature', unit: '°C', value: 3.98, fixed: true, tex: 'T_m' } },
      solveFor: 'dr', note: 'A parabola, good to about 10 °C. It is why the 1799 kilogram chose 4 °C: an error of 0.1 K in the thermometer changes the mass by 0.08 ppm.',
      stories: { dr: 'Water at {T} is compared with water at its density maximum {Tm}. By what fraction is it less dense?' } },
    { name: 'Heat for a given warming (the calorie)', expr: 'Q = m*cW*dT', tex: 'Q = m\\,c_w\\,\\Delta T',
      vars: { Q: { name: 'heat', q: 'energy', unit: 'kJ' }, m: { name: 'mass of water', q: 'mass', unit: 'kg', value: 1 }, cW: { const: 'cW' }, dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 1, tex: '\\Delta T' } },
      solveFor: 'Q', note: 'With the specific heat of water, 4.184 kJ/(kg·K), one kilocalorie raises a kilogram by one kelvin: the old definition.',
      stories: { Q: 'How much heat warms {m} of water by {dT}?', m: 'A heat of {Q} warms some water by {dT}. What is its mass?' } },
    { name: 'Delta value of a sample', expr: 'd = R/Rs - 1', tex: '\\delta = \\frac{R}{R_s} - 1',
      vars: { d: { name: 'deviation from the standard', q: 'ratio', unit: '‰', signed: true, tex: '\\delta', hint: 'Negative for a sample poorer in the heavy isotope than the ocean.' }, R: { name: 'isotope ratio of the sample', value: 0.0018949, hint: '¹⁸O/¹⁶O of a sample of Antarctic snow.' }, Rs: { name: 'ratio of the standard (VSMOW)', value: 0.0020052, fixed: true, tex: 'R_s', hint: '¹⁸O/¹⁶O = 2005.2 ppm for VSMOW; D/H = 155.76 ppm.' } },
      solveFor: 'd', note: 'The same expression gives δ¹⁸O or δD; the ratio and its standard must be for the same pair of isotopes.',
      stories: { d: 'A sample has an ¹⁸O/¹⁶O ratio of {R} against a standard of {Rs}. What is its δ value?' } },
    { name: 'Specific gravity', expr: 'SG = rho/rhoW', tex: '\\mathrm{SG} = \\frac{\\rho}{\\rho_w}',
      vars: { SG: { name: 'specific gravity', tex: '\\mathrm{SG}' }, rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, rhoW: { const: 'rhoW' } },
      solveFor: 'SG', note: 'Uses 1,000 kg/m³ for water, which is its density at about 4 °C; a stated temperature changes the third decimal place.',
      stories: { SG: 'A hydrometer shows a liquid of density {rho}. What is its specific gravity?', rho: 'A liquid has specific gravity {SG}. What is its density?' } }
  ],
  examples: [
    { title: 'Why the kilogram used 4 °C', q: 'A thermometer in 1799 could be trusted to 0.1 K. How much would the mass of a litre of water change for that error at 0 °C, and at 4 °C?',
      steps: ['At 0 °C the density rises by about 68 ppm per kelvin (the expansion coefficient is $-6.8\\times10^{-5}$ K⁻¹): a 0.1 K error is about 6.8 ppm.', 'At 3.98 °C the slope is zero; the curvature gives $8.3\\times10^{-6} \\times (0.1)^2 = 0.083$ ppm.'],
      a: '6.8 ppm at 0 °C against 0.08 ppm at 4 °C: the maximum made the measurement eighty times more forgiving.' },
    { title: 'A food Calorie', q: 'A 2,000 kcal diet is eaten in a day. How many degrees would that energy warm 100 litres of water?',
      steps: ['$2000\\ \\mathrm{kcal} = 8.37$ MJ.', '$\\Delta T = Q/(m c) = 8.37\\times10^{6}/(100 \\times 4186) = 20$ K.'],
      a: '20 K: a day of food could warm a bath from 15 to 35 °C.' },
    { title: 'Snow from the cold', q: 'Snow has an ¹⁸O/¹⁶O ratio of 0.0018949, compared with 0.0020052 for the ocean standard. What is its δ¹⁸O?',
      steps: [{ text: 'Substitute:', tex: '\\delta = \\frac{0.0018949}{0.0020052} - 1 = -0.0550' }, 'That is −55.0 parts per thousand: the vapour that made it lost heavy water by condensing on the way from the warm ocean.'],
      a: 'δ¹⁸O = −55 ‰, typical of central Antarctica.' }
  ],
  quiz: [
    { q: 'The kilogram of 1799 used water at 4 °C rather than 0 °C because', choices: ['4 °C is easier to reach', 'Near 4 °C the density of water is at its maximum, so thermometer errors barely matter', 'Ice floats at 4 °C', 'Water boils at 4 °C in vacuum'], a: 1, why: 'The density curve is flat at the maximum; at 0 °C the same thermometer error would change the density of the water a hundred times as much.' },
    { q: 'Water at one standard atmosphere boils at', choices: ['exactly 100 °C by definition today', '99.974 °C on the 1990 temperature scale', '98.6 °C', '101.3 °C'], a: 1, why: 'The Celsius scale is now tied to the kelvin and to the triple point and other fixed points; the boiling point turned out, by measurement, to be 99.974 °C.' },
    { q: 'Anders Celsius defined 0 as the freezing point and 100 as the boiling point of water.', a: false, why: 'His 1742 scale was the other way round, with 0 at boiling and 100 at freezing; it was reversed in the 1740s.' },
    { q: 'What is the specific gravity of a liquid of density 1,048 kg/m³?', answer: 1.048, why: 'Divide by the density of water, 1,000 kg/m³: 1.048, a typical wort for beer.' },
    { q: 'The unit of mass was defined by a volume of water because', choices: ['water is the densest liquid', 'it is a common, reproducible substance with a density maximum that gives stable measurements', 'metal was not available', 'the French liked water'], a: 1, why: 'Pure water is available everywhere and its density at 4 °C is a natural reference. It was retired for the kilogram since water can never be made perfectly pure or measured to the precision the artefact allowed.' }
  ],
  applications: ['Hydrometers in breweries, wineries, car-battery shops and clinics read specific gravity against water.', 'Triple-point-of-water cells calibrate platinum thermometers to a tenth of a millikelvin.', 'Ice-core and tree-ring scientists read past climates from δ¹⁸O and δD, with every result quoted against VSMOW.', 'Food labels, boilers and heat-pump ratings still count energy in calories and BTU.'],
  history: 'The 1795 decree, the 1799 Archive kilogram (weighings by Lefèvre-Gineau and Fabbroni), the metre convention of 1875 and the 1889 prototype are the steps of the kilogram; Celsius published in 1742, Christin in Lyon proposed the upright scale independently in 1743; the kelvin got its triple point in 1954 and its Boltzmann constant in 2019. Craig described a mean ocean water standard in 1961 and the IAEA prepared and distributed VSMOW from the late 1960s.',
  sources: ['BIPM, *The International System of Units (SI Brochure)*, 9th edition (2019) — the 2019 definitions and the history of the kilogram, the kelvin and the litre.', 'Kell, “Density, thermal expansivity and compressibility of liquid water from 0 to 150 °C”, *Journal of Chemical and Engineering Data* 20, 97 (1975).', 'Chang, *Inventing Temperature: Measurement and Scientific Progress* (Oxford, 2004).', 'Gonfiantini, “Standards for stable isotope measurements in natural compounds”, *Nature* 271, 534 (1978) — VSMOW and SLAP.'],
  sim: 'us-water-units'
},

/* ================================================================ 6. ultrapure water */
{
  id: 'ultrapure-water', parent: 'water-for-people', title: 'Ultrapure water', level: 2,
  short: 'Pure water still conducts, because a few molecules in 550 million are always ionised: its ions give it a resistivity of 18.18 MΩ·cm at 25 °C, and any real water is below that. Chip factories make thousands of cubic metres a day of the nearest approach, and it is harmless to drink and ruinous to pipes.',
  keywords: ['ultrapure water', '18.2 megohm', 'resistivity', 'conductivity', 'deionised water', 'semiconductor', 'fab', 'ion exchange', 'electrodeionisation', 'TOC', 'ASTM D5127', 'distilled water', 'reagent water', 'mixed bed', 'UPW'],
  prereq: ['pure-water-and-conductivity', 'water-the-amphoteric', 'the-dielectric-constant'],
  related: ['desalination', 'water-treatment', 'hard-water-and-limescale', 'how-salt-dissolves', 'gases-in-water', 'chemistry:water-autoionization', 'chemistry:solutions'],
  body: `
Water that has nothing dissolved in it is not found on Earth. Rain picks up carbon dioxide and dust on the way down, and a glass left on a table takes up the gases of the air within minutes. The nearest approach is made on purpose in factories that make microchips, where one stray ion on a wafer can ruin a transistor a few nanometres wide.

### Even pure water conducts
Pure water ionises itself: $\\ce{2H2O <=> H3O+ + OH-}$. At 25 °C the concentration of each ion is $1.0\\times10^{-7}$ mol/L — one molecule in 550 million, or $6\\times10^{16}$ ions of each sign in a litre. Free to move in a field, they carry a current: the conductivity of absolutely pure water is **0.055 µS/cm** (5.5 µS/m) and its resistivity is **18.18 MΩ·cm**. That is a limit of nature, not a measure of cleanliness: no sample at 25 °C can be more resistive than its own ions allow. The number rises with temperature by about 4.5 % a degree, so readings are corrected to 25 °C.

| Water | Conductivity | Resistivity | Dissolved solids |
|---|---|---|---|
| Sea water | about 50,000 µS/cm | 20 Ω·cm | 35,000 mg/L |
| Tap water | 100–800 µS/cm | 1.2–10 kΩ·cm | 50–500 mg/L |
| Laboratory distilled water, stored | 1–5 µS/cm | 0.2–1 MΩ·cm | a few mg/L |
| Ultrapure water | 0.055 µS/cm | 18.18 MΩ·cm | less than 1 µg/L of ions |
| Ultrapure water left open to the air | about 1 µS/cm | about 1 MΩ·cm | + dissolved CO₂ |

A single microgram of table salt in a litre — one part per billion — would add 2.2 nS/cm and cut the resistivity of ultrapure water to 17.5 MΩ·cm. That is how the meter, the best chemical sensor in the plant, sees a trace.

### The train
Semiconductor-grade water (the standards are ASTM D5127 and the SEMI documents) is made in steps, each removing what the last cannot:
1. **Pretreatment**: media filters, activated carbon (to remove the chlorine, which would damage the next membrane), softening.
2. **Reverse osmosis**, often twice, which removes 98–99 % of ions and almost all organics and particles (see [[desalination]]).
3. **Electrodeionisation** or **mixed-bed ion exchange**: resin beads swap each cation for a hydrogen ion and each anion for a hydroxide, so that the dissolved salts become water.
4. **Degassing** across membranes: removes carbon dioxide and oxygen.
5. **Ultraviolet light** at 185 nm, which turns traces of organic carbon into CO₂ that the resin then takes, and at 254 nm, which kills bacteria.
6. **Ultrafiltration** at about 0.02 µm to stop particles, and a recirculating loop through plastic pipe, to stop anything from settling.

The end product has ions at the parts-per-trillion level, organic carbon in single parts per billion and particles of tens of nanometres. A single leading-edge fab uses thousands of cubic metres of it a day (figures of 2,000–5,000 m³/day are quoted for a large factory).

### Safe to drink, hostile to everything else
Ultrapure water contains no toxin, and a mouthful is harmless; it tastes flat. But it is “hungry”: with no ions and no buffer, it dissolves whatever it touches. It leaches metal ions from stainless steel, silica from glass, and additives from plastic, so the pipes are plastic of high purity (PVDF, PFA). Exposed to air it absorbs carbon dioxide, falls to about 1 MΩ·cm in minutes and turns slightly acidic (pH about 5.6), which is why it is delivered through closed loops. The old notion that drinking very pure water “leaches minerals from your body” is not borne out: the gut handles it, and the diet supplies the minerals. The WHO's concern is only that demineralised water is a poor source of calcium and magnesium for people who rely on it alone for years.

> [!key] Water ionises itself, so even perfect water carries 0.055 µS/cm and stops at 18.18 MΩ·cm; a fab's water is within a few parts per trillion of that limit. It is aggressive because it is hungry for ions, and harmless in a glass for the same reason that it is dangerous in a pipe.`,
  ideas: ['Pure water ionises itself ($10^{-7}$ mol/L of each ion at 25 °C): its conductivity is 0.055 µS/cm and its resistivity 18.18 MΩ·cm.', 'Resistivity is the best instant gauge of ionic contamination: one part per billion of NaCl pulls it from 18.18 to 17.5.', 'Production is a train: RO, electrodeionisation or ion exchange, degassing, 185 nm UV and ultrafilters, in a recirculating loop.', 'It is safe to sip but corrodes and leaches, and it takes up CO₂ from the air within minutes.'],
  pitfalls: ["“Distilled water is ultrapure” — Stored in a bottle it takes up CO₂ and ions from the glass and sits at 1–5 µS/cm, a hundred times above ultrapure.", "“Pure water does not conduct, so it is safe from electric shock” — A body in a bath or a pool conducts through its own salts and the water around it, and tap water is a fair conductor.", "“Drinking pure water leaches minerals from the body” — No: the gut does not become a sink for minerals; the real issue is only the lack of calcium and magnesium in the diet if it is the sole source.", "“Pure water has pH 7 under all conditions” — It is neutral by definition (equal ions), but its pH is 7.00 only at 25 °C, and in air it is close to 5.6; with so few ions it is very hard to measure."],
  terms: [
    { term: 'Ultrapure water', also: ['UPW', 'electronics-grade water', 'Type I water'], def: 'Water purified until resistivity is at or near the 18.18 MΩ·cm of ionisation, with ions at parts per trillion, organic carbon at a few parts per billion and no particles above tens of nanometres.' },
    { term: 'Resistivity of water', also: ['megohm-cm', 'MΩ·cm'], def: 'The resistance of a centimetre cube of water to current, the reciprocal of its conductivity. A resistivity of 1 MΩ·cm corresponds to a conductivity of 1 µS/cm; ultrapure water is 18.18 MΩ·cm at 25 °C.' },
    { term: 'Ion exchange', also: ['deionisation', 'mixed bed'], def: 'Removing dissolved salts by passing water over resin beads that swap each cation for H⁺ and each anion for OH⁻; the H⁺ and OH⁻ combine to water.' },
    { term: 'Electrodeionisation', also: ['EDI'], def: 'Ion exchange resin and an electric field in one unit, so the resin is regenerated continuously by the current rather than by chemicals.' },
    { term: 'Total organic carbon', also: ['TOC'], def: 'The carbon in dissolved organic compounds, in µg/L; the figure that tells if bacteria or leached plastic are present. Ultrapure water has a few µg/L.' },
    { term: 'Degassing', also: ['membrane contactor', 'deaeration'], def: 'Removing dissolved gases such as CO₂ and O₂, usually across a gas-permeable membrane under vacuum; CO₂ matters because it forms ions.' }
  ],
  formulas: [
    { name: 'Conductivity from the ions of the water itself', expr: 'k = c*(lH + lOH)', tex: '\\kappa = c\\,(\\lambda_{\\mathrm{H}} + \\lambda_{\\mathrm{OH}})',
      vars: { k: { name: 'conductivity', q: 'conductivity', unit: 'µS/cm', tex: '\\kappa' }, c: { name: 'concentration of each ion', q: 'concentration', unit: 'mol/L', value: 1e-7, hint: '1.0×10⁻⁷ mol/L for H₃O⁺ and for OH⁻ at 25 °C.' }, lH: { name: 'molar conductivity of H₃O⁺ (S·m²/mol)', unit: 'S·m²/mol', value: 0.03498, fixed: true, tex: '\\lambda_{\\mathrm{H}}', hint: '349.8 S·cm²/mol at 25 °C: the proton hops from molecule to molecule, which makes it seven times faster than sodium.' }, lOH: { name: 'molar conductivity of OH⁻ (S·m²/mol)', unit: 'S·m²/mol', value: 0.01986, fixed: true, tex: '\\lambda_{\\mathrm{OH}}', hint: '198.6 S·cm²/mol at 25 °C.' } },
      solveFor: 'k', note: 'Gives 0.0548 µS/cm; the true 0.0550 includes small corrections. The high mobility of H⁺ and OH⁻ comes from proton hopping (see [[the-proton-hops]]).',
      stories: { k: 'Pure water has {c} each of H₃O⁺ and OH⁻. What is its conductivity?' } },
    { name: 'Resistivity from conductivity', expr: 'rho = 1/k', tex: '\\rho = \\frac{1}{\\kappa}',
      vars: { rho: { name: 'resistivity (MΩ·cm)', q: false, unit: 'MΩ·cm', tex: '\\rho' }, k: { name: 'conductivity (µS/cm)', q: false, unit: 'µS/cm', value: 0.055, tex: '\\kappa', hint: 'With conductivity in µS/cm the resistivity comes out in MΩ·cm directly.' } },
      solveFor: 'rho', note: 'A conductivity of 0.055 µS/cm is a resistivity of 18.18 MΩ·cm, and 1 µS/cm is 1 MΩ·cm.',
      stories: { rho: 'A probe reads a conductivity of {k}. What is the resistivity?', k: 'Water has a resistivity of {rho}. What is its conductivity?' } },
    { name: 'Conductivity of a dissolved salt', expr: 'k = L*c/1000', tex: '\\kappa = \\frac{\\Lambda\\,c}{1000}',
      vars: { k: { name: 'added conductivity (µS/cm)', q: false, unit: 'µS/cm', tex: '\\kappa' }, L: { name: 'molar conductivity (S·cm²/mol)', q: false, unit: 'S·cm²/mol', value: 126.4, tex: '\\Lambda', hint: 'NaCl 126.4, KCl 149.9, HCl 426.2, NaOH 247.8 (limiting values, 25 °C).' }, c: { name: 'concentration (µmol/L)', q: false, unit: 'µmol/L', value: 0.0171, hint: '1 µg/L of NaCl is 0.0171 µmol/L.' } },
      solveFor: 'k', note: 'Valid for very dilute solutions, where the ions do not interact; add the result to 0.055 µS/cm for the water itself.',
      stories: { k: 'A salt of molar conductivity {L} is dissolved to {c}. How much conductivity does it add?' } },
    { name: 'Correcting a reading to 25 °C', expr: 'k25 = kT/(1 + a*(T - Tref))', tex: '\\kappa_{25} = \\frac{\\kappa_T}{1 + \\alpha\\,(T - T_{\\mathrm{ref}})}',
      vars: { k25: { name: 'conductivity at 25 °C (µS/cm)', q: false, unit: 'µS/cm', tex: '\\kappa_{25}' }, kT: { name: 'reading at temperature T (µS/cm)', q: false, unit: 'µS/cm', value: 0.1, tex: '\\kappa_T' }, a: { name: 'temperature coefficient per kelvin', value: 0.045, fixed: true, tex: '\\alpha', hint: 'About 4.5 % per K for ultrapure water, 2 % per K for tap water.' }, T: { name: 'sample temperature', q: 'temperature', unit: '°C', value: 30, min: 0, max: 80 }, Tref: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, fixed: true, tex: 'T_{\\mathrm{ref}}' } },
      solveFor: 'k25', note: 'A linear correction is good to a few per cent near 25 °C; standards such as ASTM D5391 tabulate the non-linear one.',
      stories: { k25: 'A probe at {T} reads {kT}. What would it read at 25 °C?' } }
  ],
  examples: [
    { title: 'How few ions', q: 'How many ions of each sign are in a litre of absolute pure water at 25 °C, and what share of molecules is that?',
      steps: ['$10^{-7}\\ \\mathrm{mol} \\times 6.022\\times10^{23} = 6.0\\times10^{16}$ of H₃O⁺ and the same of OH⁻.', 'A litre holds $3.34\\times10^{25}$ molecules (55.5 mol): one in $5.5\\times10^{8}$ is ionised at a given moment.'],
      a: 'About $6\\times10^{16}$ ions of each sign: one molecule in 550 million.' },
    { title: 'A pinch in a swimming pool', q: 'One microgram per litre of NaCl dissolves in ultrapure water. By how much does the resistivity fall?',
      steps: ['The concentration is $1\\ \\mu\\mathrm{g/L} / 58.44\\ \\mathrm{g/mol} = 0.0171\\ \\mu\\mathrm{mol/L}$.', 'Added conductivity: $\\kappa = 126.4 \\times 0.0171/1000 = 0.00216$ µS/cm.', 'Total: $0.0550 + 0.0022 = 0.0572$ µS/cm, so $\\rho = 1/0.0572 = 17.5$ MΩ·cm.'],
      a: 'From 18.18 to 17.5 MΩ·cm: a 4 % drop from one part per billion of salt.' },
    { title: 'Open to the air', q: 'Ultrapure water meets air with 420 ppm of CO₂. Estimate its conductivity once dissolved CO₂ reaches equilibrium (Henry constant 0.034 mol/(L·atm); first acid constant of carbonic acid $4.45\\times10^{-7}$).',
      steps: ['Dissolved CO₂: $0.034 \\times 4.2\\times10^{-4} = 1.43\\times10^{-5}$ mol/L.', 'Ions: $[\\mathrm{H^+}] = [\\mathrm{HCO_3^-}] \\approx \\sqrt{K_{a1}c} = \\sqrt{4.45\\times10^{-7}\\times1.43\\times10^{-5}} = 2.5\\times10^{-6}$ mol/L.', 'Conductivity: $\\kappa \\approx 2.5\\times10^{-6} \\times (349.8 + 44.5)/1000$ S/cm = 0.99 µS/cm.'],
      a: 'About 1 µS/cm, or 1 MΩ·cm: eighteen times worse than the pure water you started with.' }
  ],
  quiz: [
    { q: 'Why can resistivity never exceed 18.18 MΩ·cm at 25 °C?', choices: ['The meter cannot read higher', 'Water ionises itself, and these H₃O⁺ and OH⁻ ions always carry some current', 'Water absorbs the current', 'A salt always remains'], a: 1, why: 'Even perfect water has $10^{-7}$ mol/L of each ion. They conduct 0.055 µS/cm, and no sample can be more resistive than that.' },
    { q: 'The ions in pure water are mostly sodium and chloride from the container.', a: false, why: 'In absolutely pure water the ions are the water\'s own H₃O⁺ and OH⁻; sodium and chloride would be contamination and would lower the resistivity.' },
    { q: 'A reading of 1 µS/cm means a resistivity of', choices: ['1 kΩ·cm', '0.055 MΩ·cm', '1 MΩ·cm', '18 MΩ·cm'], a: 2, why: 'Resistivity is the inverse: $1/(1\\ \\mu\\mathrm{S/cm}) = 1\\ \\mathrm{M\\Omega\\cdot cm}$.' },
    { q: 'What is the conductivity, in µS/cm, of ultrapure water at 25 °C (to two figures)?', answer: 0.055, why: 'It is $1/18.18 = 0.055$ µS/cm: the ions of the water itself.' },
    { q: 'Why are ultrapure water pipes made of PVDF or PFA rather than stainless steel?', choices: ['Plastic is cheaper', 'The water leaches ions from metal and the leached ions would defeat its purity', 'Steel rusts in air', 'Plastic is a better conductor'], a: 1, why: 'Hungry for ions, ultrapure water attacks even stainless steel; a clean fluoropolymer adds almost nothing.' }
  ],
  applications: ['Chip fabrication, where every rinse, bath and clean uses ultrapure water.', 'Power-station boilers and steam turbines, which cannot tolerate ions that deposit or corrode.', 'Pharmaceutical “water for injection”, whose conductivity limit is 1.3 µS/cm at 25 °C.', 'Laboratories (reagent-grade Type I water) and dialysis clinics.'],
  history: 'Kohlrausch and Heydweiller distilled water in vacuum in 1894 and measured about 0.043 µS/cm at 18 °C, close to the theoretical limit of the time. Ion-exchange resins date from Adams and Holmes in 1935; the production of ultrapure water in the modern sense followed the semiconductor industry in the 1970s and 1980s. Light and colleagues (2005) re-derived the fundamental conductivity of water from the ionic product.',
  sources: ['ASTM D5127, *Standard Guide for Ultra-Pure Water Used in the Electronics and Semiconductor Industries* (also ASTM D1193 for reagent water).', 'Light, Licht, Bevilacqua and Morash, “The fundamental conductivity and resistivity of water”, *Electrochemical and Solid-State Letters* 8, E16 (2005).', 'Kohlrausch and Heydweiller, “Über reines Wasser” (1894).', 'WHO, *Nutrients in drinking-water* (2005) — the discussion of demineralised water.'],
  sim: 'us-resistivity'
},

/* ================================================================ 7. water in the kitchen */
{
  id: 'water-in-the-kitchen', parent: 'water-for-people', title: 'Water in the kitchen', level: 1,
  short: 'A pot cannot be hotter than the boiling point of its water, so cooking speed is set by pressure: a pressure cooker at about two atmospheres cooks at 120 °C in a third of the time, and the same potato on a mountain takes longer. Salt in the pasta water barely moves the boiling point, salt on ice gets to −21 °C, and a puff of steam burns nine times as hard as the same mass of boiling water.',
  keywords: ['boiling', 'pressure cooker', 'cooking at altitude', 'salt in pasta water', 'sous vide', 'egg cooking temperature', 'ice cream salt', 'steam burn', 'kettle', 'rolling boil', 'simmer', 'boiling point elevation', 'eutectic', 'Arrhenius cooking', 'denaturation'],
  prereq: ['boiling-at-altitude', 'latent-heat-of-vaporisation', 'specific-heat-of-water'],
  related: ['colligative-properties', 'the-phase-diagram', 'thermal-conductivity-of-water', 'hurricanes-and-latent-heat', 'water-as-a-standard', 'chemistry:arrhenius-equation', 'chemistry:colligative-properties'],
  body: `
A pot of water on a stove warms until it boils and then stops warming, however high the flame. The extra heat goes into steam: 2,257 kJ for every kilogram that leaves, about six times what it took to bring that kilogram from the tap to the boil. So a rolling boil is no hotter than a gentle simmer; it only turns the water to steam faster. Everything else about cooking with water follows from that ceiling and from how to move it.

### Pressure moves the ceiling
At sea level water boils at 99.97 °C. A pressure cooker seals its lid, so steam cannot escape until a weight on the vent lifts at about 1 bar above the air outside: 2 atmospheres absolute, where the water boils at **about 120 °C**. Chemical reactions in the food, from the softening of pectin to the conversion of collagen, speed up with temperature in the Arrhenius way, $\\exp(-E_a/RT)$; with an activation energy of 75 kJ/mol twenty degrees makes them 3.5 times quicker. A bean pot of 90 minutes is done in about 25.

Climb and the ceiling falls:

| Place | Height | Pressure | Water boils at |
|---|---|---|---|
| Dead Sea | −430 m | 106.6 kPa | 101.4 °C |
| Sea level | 0 | 101.3 kPa | 99.97 °C |
| Jerusalem | 750 m | 92.6 kPa | 97.5 °C |
| Denver | 1,609 m | 83.4 kPa | 94.6 °C |
| La Paz | 3,640 m | 64.6 kPa | 87.8 °C |
| Everest summit | 8,849 m | 31.4 kPa | 70 °C |

The same Arrhenius factor makes a potato at Denver 1.4 times slower than at the sea, and on the summit of Everest, at 70 °C, an egg white barely sets. High-altitude cooking uses a pressure cooker, or accepts that “boiled” is a cooler temperature than at home.

### Salt: little for boiling, a lot for freezing
A tablespoon of salt (about 18 g) in 4 litres of pasta water raises the boiling point by $K_b\\, i\\, m = 0.512 \\times 2 \\times 0.077 = 0.08$ K — much too small to matter. Cooks salt the water for taste, to about the saltiness of a broth, 10 g per litre. To make a real difference in boiling point you would need a brine of tens of per cent. The effect at the freezing end is dramatic: salt lowers the melting point of ice until it reaches −21.1 °C in a 23.3 % brine (the *eutectic*). Ice mixed with salt melts, absorbing 334 kJ/kg of latent heat from the cream in the churn, until the bath is at −18 to −21 °C, cold enough to freeze ice cream.

### The temperatures of food
Proteins unfold (denature) at set temperatures. Egg white begins to set near 62 °C, and sets fully by 80; yolk sets at 65–70 °C; a “63-degree egg” is cooked in a water bath for an hour or so. Beef myosin denatures at 50–55 °C, and collagen, the tough connective tissue, shrinks at 60–65 °C and turns slowly to gelatine above 70 °C, which is why a steak is ready in minutes at 55 °C but a brisket needs hours. **Sous vide** puts food in a bag in a bath held at exactly the finishing temperature (Baldwin 2012). It works because water carries heat to a bag some twenty-five times better than air at the same temperature: a person can sit in a 90 °C sauna but would be scalded in a second by a 90 °C bath, and a few seconds at 60 °C is enough to scald.

### Steam, and the kettle
A kilogram of steam at 100 °C condenses to water at 100 °C and gives 2,257 kJ to whatever it touches; cooling that water to the temperature of skin gives another 264 kJ. A kilogram of boiling water cooling to 37 °C gives only 264 kJ. A given mass of steam delivers 9.5 times as much heat, which is why a steam burn is worse than a scald. Heating a 1.7-litre kettle from 20 to 100 °C takes 570 kJ; a 3 kW element at 90 % efficiency does it in 3.5 minutes, and boiling off a tenth of a litre adds another 226 kJ.

> [!key] A pot is limited to the boiling point, which depends on pressure: 120 °C in a pressure cooker, 95 °C in Denver, 70 °C on Everest. Cooking time follows the Arrhenius law; salt hardly shifts the boiling point but drops ice to −21 °C, and steam is dangerous because the latent heat of vaporisation is nine times what the hot water carries.`,
  ideas: ['Boiling pins the temperature of a pot at the boiling point, which depends on pressure: 120 °C at 2 atm, 94.6 °C at Denver, 70 °C on Everest.', 'Cooking reactions follow Arrhenius: with $E_a$ = 75 kJ/mol a rise from 100 to 120 °C makes them 3.5 times faster, so a pressure cooker takes about a third of the time.', 'A tablespoon of salt in 4 L raises the boiling point by 0.08 K; salt is for taste. Salt on ice reaches −21.1 °C at the eutectic.', 'Steam condensing gives 2,257 kJ/kg; a mass of steam delivers 9.5 times the heat of the same mass of boiling water cooling to skin temperature.'],
  pitfalls: ["“Salting the water makes it boil faster” — It lowers the boiling point of the pot by far less than a tenth of a degree and, if anything, makes it heat very slightly slower; it is about taste.", "“A fiercer boil cooks faster” — The temperature of the water is fixed at the boiling point; a harder boil wastes heat and fuel as steam.", "“Food cooked in boiling water at altitude is just as done” — Boiling water at 3,000 m is about 90 °C, and a slower Arrhenius rate means longer times.", "“Water is the same as air at the same temperature” — Water carries heat 25 times better; 60 °C air is a warm room, 60 °C water is a scald."],
  terms: [
    { term: 'Rolling boil', also: ['simmer', 'full boil'], def: 'Vigorous boiling with large bubbles. The water temperature is the same as in a simmer; a hotter burner only makes more steam.' },
    { term: 'Denaturation', also: ['protein denaturation', 'unfolding'], def: 'The unfolding of a protein by heat or acid, losing its shape and often becoming insoluble: the setting of egg white, the firming of meat.' },
    { term: 'Sous vide', also: ['water-bath cooking', 'low-temperature cooking'], def: 'Cooking vacuum-sealed food in a bath held at the target temperature for a long time, exploiting water\'s high thermal conductivity and specific heat.' },
    { term: 'Eutectic', also: ['eutectic point', 'freezing mixture'], def: 'The composition of a mixture that melts at the lowest temperature of any proportion: for salt and water, 23.3 % NaCl at −21.1 °C.' },
    { term: 'Gauge pressure', also: ['absolute pressure'], def: 'Pressure measured above the surrounding air. A cooker at 1 bar gauge is at about 2 bar absolute, and its water boils at about 120 °C.' }
  ],
  formulas: [
    { name: 'Boiling point at another pressure', expr: 'Tb = 1/(1/T0 - R*ln(p/patm)/H)', tex: 'T_b = \\left[\\frac{1}{T_0} - \\frac{R\\,\\ln(p/p_{\\mathrm{atm}})}{\\Delta H}\\right]^{-1}',
      vars: { Tb: { name: 'boiling temperature', q: 'temperature', unit: '°C', tex: 'T_b' }, T0: { name: 'boiling point at 1 atm', q: 'temperature', unit: '°C', value: 100, fixed: true, tex: 'T_0' }, R: { const: 'R' }, p: { name: 'pressure (absolute)', q: 'pressure', unit: 'kPa', value: 202.65, min: 1, hint: '2 atm for a pressure cooker at 1 bar gauge; 83.4 kPa at Denver.' }, patm: { const: 'atm', tex: 'p_{\\mathrm{atm}}' }, H: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 40.66, fixed: true, tex: '\\Delta H' } },
      solveFor: 'Tb', note: 'The integrated Clausius–Clapeyron relation, accurate to about half a degree between 70 and 120 °C; the steam tables give 120.6 °C at 2 atm.',
      stories: { Tb: 'Water in a pot at an absolute pressure of {p}. At what temperature does it boil?', p: 'Water boils at {Tb}. What is the pressure over it?' } },
    { name: 'Cooking time at another temperature', expr: 't = t0*exp(Ea/R*(1/T - 1/T0))', tex: 't = t_0\\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right]',
      vars: { t: { name: 'cooking time', q: 'time', unit: 'min' }, t0: { name: 'time at the reference temperature', q: 'time', unit: 'min', value: 90, tex: 't_0' }, Ea: { name: 'activation energy of the cooking reaction', q: 'molarenergy', unit: 'kJ/mol', value: 75, hint: '60–100 kJ/mol for softening of vegetables, gelatinisation of starch, collagen; much higher for killing bacterial spores.' }, R: { const: 'R' }, T: { name: 'cooking temperature', q: 'temperature', unit: '°C', value: 120.6, min: 60, max: 140 }, T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 99.97, fixed: true, tex: 'T_0' } },
      solveFor: 't', note: 'Rule of thumb: time falls by a factor of 2–3.5 for each 10–20 °C. Valid for reactions in the food; heating the middle of a big piece still takes diffusion time.',
      stories: { t: 'A stew takes {t0} at {T0}. How long at {T} if Ea = {Ea}?' } },
    { name: 'Boiling-point elevation by salt', expr: 'dT = Kb*i*m', tex: '\\Delta T_b = K_b\\,i\\,m',
      vars: { dT: { name: 'rise of boiling point', q: 'dtemp', unit: 'K', tex: '\\Delta T_b' }, Kb: { name: 'ebullioscopic constant of water (K·kg/mol)', unit: 'K·kg/mol', value: 0.512, fixed: true, tex: 'K_b' }, i: { name: 'particles per formula unit', value: 2, min: 1, max: 3, hint: '2 for NaCl, which gives Na⁺ and Cl⁻.' }, m: { name: 'molality of the salt', q: 'molality', unit: 'mol/kg', value: 0.171, hint: '10 g/L of salt is 0.171 mol/L, close to 0.171 mol/kg.' } },
      solveFor: 'dT', note: 'For 10 g/L of NaCl, about 0.18 K. To raise the boiling point by one degree takes 1.0 mol/kg of salt, a brine of 5.5 % by mass.',
      stories: { dT: 'Water holds {m} of salt that splits into {i} particles. By how much does the boiling point rise?' } },
    { name: 'Time to boil a kettle', expr: 't = m*cW*dT/(eta*P)', tex: 't = \\frac{m\\,c_w\\,\\Delta T}{\\eta\\,P}',
      vars: { t: { name: 'time', q: 'time', unit: 'min' }, m: { name: 'mass of water', q: 'mass', unit: 'kg', value: 1.7 }, cW: { const: 'cW' }, dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 80, tex: '\\Delta T' }, eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 90, min: 10, max: 100, tex: '\\eta' }, P: { name: 'element power', q: 'power', unit: 'W', value: 3000 } },
      solveFor: 't', note: 'Ignores the heat in the kettle itself and the loss during the boil; a few per cent for a modern electric kettle.',
      stories: { t: 'A kettle with {m} of water, a rise of {dT}, an element of {P} and efficiency {eta}. How long does it take?' } }
  ],
  examples: [
    { title: 'Beans in a pressure cooker', q: 'Beans take 90 minutes in an open pot at 99.97 °C. A pressure cooker holds 120.6 °C. If the cooking reaction has an activation energy of 75 kJ/mol, how long do the beans take?',
      steps: [{ text: 'The Arrhenius factor between the two temperatures:', tex: '\\exp\\left[\\frac{75000}{8.314}\\left(\\frac{1}{393.75} - \\frac{1}{373.12}\\right)\\right] = e^{-1.27} = 0.28' }, 'Time: $90 \\times 0.28 = 25$ minutes.'],
      a: 'About 25 minutes: roughly a third of the open-pot time.' },
    { title: 'Pasta water', q: 'You dissolve 40 g of salt in 4 L of water. By how much does the boiling point rise, and is that why we salt the water?',
      steps: ['Moles of NaCl: $40/58.44 = 0.684$; molality $\\approx 0.684/4 = 0.171$ mol/kg.', '$\\Delta T_b = 0.512 \\times 2 \\times 0.171 = 0.175$ K.', 'Less than a fifth of a degree: the effect on cooking is negligible, and the salt is there for taste.'],
      a: '0.18 K: not the reason. (A 40 g dose is 10 g per litre, about the saltiness of a clear broth.)' },
    { title: 'Why steam scalds', q: 'Compare the heat released by 10 g of steam at 100 °C and 10 g of boiling water as each cools to 37 °C on skin.',
      steps: ['Boiling water: $0.010 \\times 4186 \\times 63 = 2.64$ kJ.', 'Steam: condensing gives $0.010 \\times 2257 = 22.6$ kJ, then cooling gives the same 2.64 kJ: 25.2 kJ.', 'Ratio: $25.2/2.64 = 9.5$.'],
      a: 'Steam delivers 9.5 times the heat: the latent heat dominates.' }
  ],
  quiz: [
    { q: 'You turn the burner up under a pot that is already boiling. What happens to the water temperature?', choices: ['It rises a lot', 'It stays at the boiling point; more steam is made', 'It falls', 'It rises slowly to 120 °C'], a: 1, why: 'The extra heat goes into the latent heat of vaporisation. The temperature is pinned at the boiling point for the pressure of the room.' },
    { q: 'Adding two teaspoons of salt (about 12 g) to a 5-litre pot of water raises its boiling point by about', choices: ['0.04 K', '3 K', '10 K', '30 K'], a: 0, why: 'The molality is $12/58.44/5 = 0.041$ mol/kg, so $\\Delta T_b = 0.512 \\times 2 \\times 0.041 = 0.042$ K: a few hundredths of a degree.' },
    { q: 'A pressure cooker cooks food faster mainly because the water temperature is higher.', a: true, why: 'Higher pressure raises the boiling point to about 120 °C, and chemical reactions in food speed up exponentially with temperature.' },
    { q: 'At what temperature (°C, to the nearest degree) does water boil in a pot at 83.4 kPa, the pressure at Denver?', answer: 95, why: 'The vapour pressure of water is 83.4 kPa at about 94.6 °C, so that is where it boils.' },
    { q: 'Why is a steam burn worse than a scald from boiling water of the same mass?', choices: ['Steam is hotter than 100 °C', 'The steam condenses on skin and releases its latent heat of vaporisation, 2,257 kJ/kg', 'Steam is under pressure', 'It carries minerals'], a: 1, why: 'Steam at 100 °C is no hotter than boiling water; the energy is in the change of state. Condensation gives up 2,257 kJ/kg before the water even starts to cool.' }
  ],
  applications: ['Pressure cookers, from the 17th-century “digester” of Denis Papin to the multi-cookers of today.', 'Autoclaves in hospitals and canning, which sterilise at 121 °C for 15 minutes.', 'Freezing mixtures for ice cream and for cooling drinks; salt on icy roads is the same effect.', 'Mountaineers and high-altitude bakers adjusting recipes to the local boiling point.'],
  history: 'Denis Papin built his “steam digester” in 1679, the first pressure cooker, with a safety valve. The salt–ice freezing mixture was used in the 18th century to make ice cream, and Fahrenheit used the ice–salt mixture as the zero of his scale in 1724. The theory of sous vide cooking was set out by Baldwin in 2012, after chefs had used it since the 1970s.',
  sources: ['Baldwin, “Sous vide cooking: a review”, *International Journal of Gastronomy and Food Science* 1, 15 (2012).', 'McGee, *On Food and Cooking: The Science and Lore of the Kitchen*, revised edition (2004).', 'CRC *Handbook of Chemistry and Physics* — vapour pressure and freezing-mixture tables.', 'Atkins and de Paula, *Physical Chemistry* — Clausius–Clapeyron and colligative properties.'],
  sim: 'us-cooking-time'
},

/* ================================================================ 8. could life use another liquid */
{
  id: 'could-life-use-another-liquid', parent: 'water-for-people', title: 'Could life use another liquid?', level: 3,
  short: 'Ammonia, methane and ethane, hydrogen fluoride, supercritical carbon dioxide, sulfuric acid and formamide have each been proposed as a solvent for life. Each does one or two of water\'s jobs; none has been shown to do them all. Henderson argued in 1913 that water was unmatched, and the 2007 report of the US National Research Council asked us to look anyway.',
  keywords: ['alternative solvent', 'ammonia life', 'Titan methane life', 'azotosome', 'weird life', 'shadow biosphere', 'hydrogen fluoride', 'supercritical carbon dioxide', 'sulfuric acid Venus clouds', 'formamide', 'Henderson fitness of the environment', 'NRC 2007 limits of organic life', 'water chauvinism', 'biosolvent'],
  prereq: ['henderson-and-the-fitness-of-the-environment', 'the-dielectric-constant', 'the-hydrophobic-effect'],
  related: ['the-search-follows-the-water', 'what-life-needs', 'the-strange-reason', 'titan', 'venus-lost-its-ocean', 'water-worlds-around-other-stars', 'supercritical-water', 'chemistry:intermolecular-forces', 'chemistry:arrhenius-equation'],
  body: `
Lawrence Henderson, a Harvard physiologist, set out in 1913 to ask why the world is so well suited to life, and found that the answer began with water: its heat capacity, its solvent power, its expansion on freezing, each at an extreme and each used by every living thing. A century later the question was reversed. Perhaps life is fitted to its liquid only because it was born in it, and elsewhere some other solvent would have done. The 2007 report of the US National Research Council, *The Limits of Organic Life in Planetary Systems*, asked scientists to take that possibility seriously without assuming it.

### What a solvent for life would have to do
A solvent that could host complex, evolving chemistry would need to:
- be **liquid** over the range of temperatures where chemistry runs at a useful rate, yet cold enough for the weak bonds that give structure to survive;
- **dissolve** many different molecules, including ions, and **leave out** others, so that membranes can form;
- offer **hydrogen bonds** or something like them for structure and for moving protons;
- be made of **common elements**;
- let the chemistry go quickly enough at the temperature where it is liquid.

### The candidates
| Liquid | Liquid range at 1 atm | Dielectric constant | Where proposed | In its favour | Against |
|---|---|---|---|---|---|
| Water | 0–100 °C | 78 | Earth | all five | — |
| Ammonia | −78 to −33 °C | 22 | cold moons, ammonia-water oceans | hydrogen-bonded, polar, high heat capacity; nitrogen is common | cold: chemistry slow; one lone pair, so a weaker network; strong base |
| Methane / ethane | 91–112 K (methane) | 1.7–1.9 | Titan's lakes, 94 K | carbon and hydrogen are common | non-polar (no ions, no salts); reactions about $10^{-19}$ times as fast |
| Hydrogen fluoride | −84 to 19.5 °C | 84 | none known | very polar, strong bonds | fluorine is tens of thousands of times scarcer than oxygen; attacks silicates and most organics |
| Supercritical CO₂ | above 31 °C and 74 bar | about 1.5 | Venus surface (92 bar, 464 °C) | CO₂ abundant | non-polar; Venus is far too hot |
| Sulfuric acid | 10–337 °C | about 100 | Venus cloud droplets | polar, a wide range | dehydrates; destroys most biochemistry |
| Formamide | 2.5–210 °C | 111 | lab prebiotic chemistry | polar, hydrogen-bonded, makes nucleobases in the lab | rare; not known as a natural sea |

### Why the dielectric constant matters
Two ions in a medium of dielectric constant $\\varepsilon$ attract each other with $1/\\varepsilon$ of their force in vacuum. At the contact distance of Na⁺ and Cl⁻ (0.28 nm) the energy of the pair is about 6 kJ/mol in water, 23 kJ/mol in ammonia and 290 kJ/mol in liquid methane. Salt stays apart in water, barely in ammonia and not at all in methane: so a methane sea cannot carry charged building blocks, and chemistry there has to be of neutral hydrocarbons.

### Cold chemistry
Titan's lakes are liquid because the temperature is 94 K. But rates fall with temperature exponentially (Arrhenius): a reaction with an activation energy of 50 kJ/mol runs $10^{-19}$ times as fast at 94 K as at 25 °C, so that what takes a second in a flask would take longer than the age of the universe. In 2015 Stevenson, Lunine and Clancy proposed that acrylonitrile, which Titan's atmosphere makes, could assemble into membrane-like “azotosomes” in methane; in 2020 Sandström and Rahm calculated that such a vesicle would not hold together. The idea remains open, not demonstrated.

### Honestly weighed
Water scores well on every row at once: a wide liquid range, a polar solvent that also pushes oil-like molecules together (the hydrophobic effect that folds proteins and builds membranes), a network that both holds and lets go, and the third most abundant element in the universe among its ingredients. Each alternative fails at least one of the tests, and none has been shown to support a self-replicating, evolving chemistry; the laboratory evidence so far is that some molecules survive in sulfuric acid, and some nucleobases form in formamide. That is an argument that water is the best solvent known and that the evidence for any alternative is thin, not a proof that life without water is impossible. The search for life accepts both sides: it follows the water, but its instruments are built to notice a stranger chemistry.

> [!key] Water is the one liquid that does every job life seems to need — a wide liquid range, a strong solvent, a network that holds and lets go, common ingredients — and each alternative fails at least one. Henderson was right that water is unmatched; the honest conclusion is "unmatched among the liquids anyone has tested", not "no other liquid can host life".`,
  ideas: ['A life solvent needs a useful liquid range, polarity, hydrogen bonds, common elements and a chemistry fast enough at its temperature.', 'Dielectric constant sets whether ions can stay apart: Na⁺Cl⁻ pair energy is 6 kJ/mol in water, 23 in ammonia and 290 in methane.', 'Reactions at 94 K (Titan) run some $10^{19}$ times slower than at 25 °C for an activation energy of 50 kJ/mol.', 'No alternative solvent has been shown to support evolving chemistry; the NRC (2007) asked that we keep looking.'],
  pitfalls: ["“Ammonia-based life has been shown possible” — It has been proposed. No experiment has built a self-replicating chemistry in liquid ammonia, which is also too cold at 1 atm and too basic for most organic molecules.", "“Titan has methane-breathing life” — Titan has methane lakes and a rich organic chemistry, but no evidence of life. A 2010 report that hydrogen is scarcer near Titan's surface than expected was noted as a possible biological sign and has other explanations; nothing was confirmed.", "“Life must use water because organisms are mostly water” — That reasons from the only example; the argument for water is its properties, which the table compares.", "“Silicon-for-carbon is the same question” — It is a separate one: the solvent and the backbone element are chosen independently."],
  terms: [
    { term: 'Biosolvent', also: ['solvent for life', 'life solvent'], def: 'A liquid in which the chemistry of a living system could take place: it dissolves the reactants, lets weak bonds form and break, and stays liquid at the temperature of the chemistry.' },
    { term: 'Weird life', also: ['alternative biochemistry', 'shadow biosphere'], def: 'Hypothetical life that uses a different solvent, backbone element or genetic molecule from Earth\'s; the subject of the NRC 2007 report. No example has been found.' },
    { term: 'Azotosome', def: 'A hypothetical membrane-like vesicle of nitrogen-containing molecules such as acrylonitrile, proposed in 2015 for liquid methane on Titan and judged unstable by calculations in 2020.' },
    { term: 'Supercritical fluid', also: ['supercritical CO₂', 'scCO₂'], def: 'A substance above its critical temperature and pressure (31 °C and 74 bar for CO₂), neither liquid nor gas, with liquid-like density and gas-like flow; a solvent for non-polar compounds.' },
    { term: 'Fitness of the environment', also: ['Henderson\'s argument'], def: 'Henderson\'s 1913 thesis that the physical and chemical properties of water, carbon dioxide and carbon make the Earth an environment uniquely suited to life.' }
  ],
  formulas: [
    { name: 'Energy of an ion pair in a solvent', expr: 'U = NA*ke*qe^2/(eps*r)', tex: 'U = \\frac{N_A\\,k_e\\,e^2}{\\varepsilon\\,r}',
      vars: { U: { name: 'energy of the ion pair', q: 'molarenergy', unit: 'kJ/mol' }, NA: { const: 'NA', tex: 'N_A' }, ke: { const: 'ke', tex: 'k_e' }, qe: { const: 'qe', tex: 'e' }, eps: { name: 'dielectric constant of the solvent', value: 78, min: 1, max: 200, tex: '\\varepsilon', hint: '78 water, 33 methanol, 22 liquid ammonia, 111 formamide, 1.7 liquid methane.' }, r: { name: 'distance between the ions', q: 'length', unit: 'pm', value: 280, min: 100, max: 1000, hint: 'Na⁺ and Cl⁻ touch at about 280 pm.' } },
      solveFor: 'U', note: 'Coulomb\'s law in a medium. Compare with $RT$ = 2.5 kJ/mol at 25 °C: a pair held by 6 kJ/mol is easily torn apart, one held by 290 kJ/mol is not.',
      stories: { U: 'Two ions {r} apart in a solvent with a dielectric constant of {eps}. What is the energy of the pair per mole?', eps: 'An ion pair at {r} has an energy of {U}. What is the dielectric constant of the solvent?' } },
    { name: 'How slow does chemistry get when it is cold?', expr: 'f = exp(-Ea/R*(1/T - 1/T0))', tex: 'f = \\exp\\left[-\\frac{E_a}{R}\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right]',
      vars: { f: { name: 'rate relative to the reference', tex: 'f', hint: 'Below 1 the reaction is slower than at the reference temperature.' }, Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 50, hint: 'A typical biochemical reaction without an enzyme: 50–100 kJ/mol; enzymes lower the effective barrier.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: -179, min: -270 }, T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, fixed: true, tex: 'T_0' } },
      solveFor: 'f', note: 'The Arrhenius law. Titan\'s surface (94 K, −179 °C) against 25 °C gives about $10^{-19}$ for 50 kJ/mol. Cold is not forbidden to chemistry, but it asks for much lower barriers.',
      stories: { f: 'A reaction with {Ea} runs at {T} instead of {T0}. By what factor is it faster or slower?' } },
    { name: 'Trouton’s ratio: a sign of hydrogen bonding', expr: 'S = H/Tb', tex: '\\Delta S_{\\mathrm{vap}} = \\frac{\\Delta H_{\\mathrm{vap}}}{T_b}',
      vars: { S: { name: 'entropy of vaporisation (J/(mol·K))', q: false, unit: 'J/(mol·K)', tex: '\\Delta S_{\\mathrm{vap}}', hint: 'About 85–88 J/(mol·K) for a liquid with no strong association; higher for hydrogen-bonded liquids.' }, H: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 40.66, tex: '\\Delta H_{\\mathrm{vap}}' }, Tb: { name: 'boiling point', q: 'temperature', unit: '°C', value: 100, min: -270, tex: 'T_b' } },
      solveFor: 'S', note: 'Trouton\'s rule: ordinary liquids vaporise with about 88 J/(mol·K). Water gives 109, ethanol 110, ammonia 97, methane 73: the associated liquids need extra entropy to leave their networks.',
      stories: { S: 'A liquid boils at {Tb} with an enthalpy of vaporisation of {H}. What is its entropy of vaporisation?' } }
  ],
  examples: [
    { title: 'Why salt dissolves in water and not in methane', q: 'Compare the energy of a Na⁺–Cl⁻ contact pair (280 pm) in water ($\\varepsilon$ = 78), ammonia (22) and liquid methane (1.7), and with the thermal energy $RT$ = 2.5 kJ/mol at 25 °C.',
      steps: ['In vacuum, $N_A k_e e^2 / r = 8.99\\times10^{9}\\times (1.602\\times10^{-19})^2 \\times 6.022\\times10^{23}/(2.8\\times10^{-10}) = 496$ kJ/mol.', 'Divide by $\\varepsilon$: water 6.4; ammonia 22.5; methane 292 kJ/mol.', 'Water: 2.5 times $RT$, ions separate; methane: 100 times $RT$, ions stay together.'],
      a: '6.4, 22.5 and 292 kJ/mol: salt is a solute in water, a poor one in ammonia, an insoluble solid in methane.' },
    { title: 'Chemistry on Titan', q: 'A reaction with activation energy 50 kJ/mol takes one second at 25 °C. How long on Titan\'s surface at 94 K?',
      steps: [{ text: 'The Arrhenius factor:', tex: 'f = \\exp\\left[-\\frac{50000}{8.314}\\left(\\frac{1}{94} - \\frac{1}{298.15}\\right)\\right] = 10^{-19.0}' }, 'So it takes $10^{19}$ s = $3\\times10^{11}$ years, twenty times the age of the universe.'],
      a: 'About $3\\times10^{11}$ years: any life in Titan\'s lakes would need catalysts that bring the barrier below about 20 kJ/mol.' },
    { title: 'The mark of an associated liquid', q: 'Ammonia boils at −33.3 °C with $\\Delta H_{vap}$ = 23.35 kJ/mol; methane at −161.5 °C with 8.19 kJ/mol. Compare Trouton ratios.',
      steps: ['Ammonia: $23350/239.8 = 97$ J/(mol·K).', 'Methane: $8190/111.7 = 73$ J/(mol·K).', 'Water: $40660/373.15 = 109$.'],
      a: 'Methane (no hydrogen bonds) is near the rule\'s 88; ammonia sits above it and water higher still.' }
  ],
  quiz: [
    { q: 'Why can liquid methane on Titan not carry dissolved salts?', choices: ['It is too cold to dissolve anything', 'Its dielectric constant of about 1.7 leaves ion pairs bound tightly together', 'Methane reacts with sodium', 'There is no salt on Titan'], a: 1, why: 'In a medium with $\\varepsilon$ = 1.7 the Coulomb attraction is divided by only 1.7, so the energy of a Na⁺Cl⁻ pair is some 290 kJ/mol, vastly more than the thermal energy of 0.8 kJ/mol at 94 K.' },
    { q: 'Henderson (1913) argued that', choices: ['life could use any solvent', 'water and carbon dioxide are uniquely fitted for life', 'ammonia was better than water', 'water is the product of life'], a: 1, why: 'In *The Fitness of the Environment* he catalogued the extreme properties of water, CO₂ and carbon and showed how each supports living things and the planet that hosts them.' },
    { q: 'A reaction with an activation energy of 50 kJ/mol is a million million times slower at 94 K than at 298 K.', a: false, why: 'It is slower by about $10^{19}$, ten million times more than a million million ($10^{12}$).' },
    { q: 'What is the Trouton ratio of water, in J/(mol·K), to the nearest whole number? (ΔH = 40.66 kJ/mol, boils at 100 °C)', answer: 109, why: '$40660/373.15 = 109$, well above the 88 expected for a liquid without strong association: the hydrogen-bond network.' },
    { q: 'Which statement about alternatives to water is best supported today?', choices: ['Ammonia life has been found on Titan', 'Several have been proposed and each fails at least one of the needed tests; none has been shown to support evolving chemistry', 'Sulfuric acid life has been confirmed on Venus', 'All alternatives are ruled out by physics'], a: 1, why: 'The honest summary is of unproven alternatives, not refuted ones.' }
  ],
  applications: ['Planning life-detection instruments that look for complex organic chemistry in non-aqueous settings (Dragonfly on Titan).', 'Choosing which worlds to explore: liquid water, then the other criteria.', 'Industrial chemistry: supercritical CO₂ extracts caffeine; liquid ammonia and anhydrous HF are working solvents.', 'Prebiotic-chemistry research on formamide as a source of nucleobases.'],
  history: 'Henderson published *The Fitness of the Environment* in 1913. In the 1950s–60s Sagan, Salpeter and others speculated about life in cold hydrocarbon seas; Bains (2004) catalogued the chemistries that might serve; the NRC report (2007) set out the research agenda; Stevenson, Lunine and Clancy (2015) proposed azotosomes; Sandström and Rahm (2020) tested them by quantum calculation. Seager\'s group tested whether biomolecules survive in concentrated sulfuric acid in the 2020s.',
  sources: ['Henderson, *The Fitness of the Environment* (Macmillan, 1913).', 'National Research Council, *The Limits of Organic Life in Planetary Systems* (National Academies Press, 2007).', 'Stevenson, Lunine and Clancy, “Membrane alternatives: worlds without oxygen”, *Science Advances* 1, e1400067 (2015); Sandström and Rahm, “Can polarity-inverted membranes self-assemble on Titan?”, *Science Advances* 6, eaax0272 (2020).', 'Bains, “Many chemistries could be used to build living systems”, *Astrobiology* 4, 137 (2004).'],
  sim: 'us-solvents'
},

/* ================================================================ 9. the search follows the water */
{
  id: 'the-search-follows-the-water', parent: 'water-for-people', title: 'The search follows the water', level: 2,
  short: 'Since the 1990s NASA\'s exploration of other worlds has been organised around a plain rule: look for liquid water, because life as we know it needs it and because water is the one requirement we can detect from a distance. Mars rovers, Europa Clipper (2030), JUICE (2031), Dragonfly (2034) and the James Webb Space Telescope follow it. A detection of water would tell us a place is habitable, not that it is inhabited.',
  keywords: ['follow the water', 'astrobiology', 'Europa Clipper', 'JUICE', 'Dragonfly', 'Mars Perseverance', 'James Webb exoplanet', 'habitable zone', 'ocean worlds', 'biosignature', 'life detection', 'Enceladus', 'Titan', 'Mars sample return', 'TRAPPIST-1'],
  prereq: ['what-life-needs', 'the-habitable-zone', 'could-life-use-another-liquid'],
  related: ['europa', 'enceladus', 'titan', 'ganymede-and-callisto', 'the-moon-and-mars', 'tidal-heating', 'water-worlds-around-other-stars', 'oceans-in-the-dark', 'the-strange-reason', 'physics:planets'],
  body: `
Imagine you have to choose where to send a probe that costs a billion dollars and takes a decade to arrive. You do not know what alien life would look like, only that one example is known, and that it needs liquid water, an energy source and the elements carbon, hydrogen, nitrogen, oxygen, phosphorus and sulfur. Water is the one of those that you can see from a distance, in the shape of ice, vapour, absorption bands in a spectrum or a magnetic field induced by a salty ocean. So you go where the water is. That is the content of NASA's “follow the water” strategy, which took hold in the Mars programme at the end of the 1990s and has since spread to the whole search.

### The destinations
| World | Why water | The next step |
|---|---|---|
| Mars | Ancient lakes and deltas (Curiosity at Gale, 2012; Perseverance at Jezero, 2021); ice in the poles and ground. Today's surface pressure, about 600 Pa, is almost exactly the triple-point pressure of water (611.657 Pa), so liquid cannot last | Perseverance is caching samples; their return is under review |
| Europa | An ocean beneath 15–25 km of ice, from Galileo's magnetometer; a probable plume (Hubble 2016) | Europa Clipper, launched October 2024, due at Jupiter in 2030 |
| Ganymede | A salty ocean sandwiched between ice layers, seen by its effect on the aurora (Hubble 2015) | JUICE, launched April 2023; Jupiter 2031, Ganymede orbit 2034 |
| Enceladus | Cassini flew through a plume of water vapour and ice, with hydrogen, CO₂, methane and ammonia; phosphates were found in 2023 | No mission approved; orbiter and lander studies |
| Titan | A water–ammonia ocean from tidal data (Cassini) and methane lakes at the surface | Dragonfly, a rotorcraft, launch planned 2028, arrival 2034 |
| Exoplanets | Water vapour in atmospheres seen by JWST; rocky planets in the habitable zone of cool stars | JWST and the next generation of telescopes |

### The telescope route
For a planet around another star the only data are light. When a planet passes in front of its star, the starlight that goes through the planet's atmosphere carries absorption lines. The signal is $2R_pnH/R_*^2$ for $n$ scale heights of atmosphere: for an Earth-like planet around a star like the Sun about one part per million, around a small cool star like TRAPPIST-1 about eighty parts per million. That is why the first rocky planets examined by JWST are those around M dwarfs, and why such planets sit near the edge of what can be measured. The catalogue of confirmed exoplanets passed 6,000 in 2025, with a few dozen in the “habitable zone” of their star, the range of distances where a planet with a good atmosphere could hold liquid water on its surface. The caveat: the habitable zone does not hold the moons of Jupiter and Saturn, which keep their oceans liquid by [[tidal-heating]] rather than sunlight.

### What a detection would and would not mean
- **Water is not life.** Mars had lakes and the verdict on life there is still open. Liquid water makes a place *habitable*; showing it is *inhabited* needs a **biosignature**: a gas, a chemical pattern, an isotope ratio, a structure that biology produces and chemistry alone does not. The “ladder of life detection” (Neveu and colleagues, 2018) and the “CoLD” scale (Green and colleagues, 2021) grade the confidence.
- **False positives are common.** Oxygen can come from the splitting of water by light; methane from rocks; the 1996 claim of fossils in a Martian meteorite was not accepted; the 2020 report of phosphine on Venus is disputed, and so are claims for the gas dimethyl sulfide on the planet K2-18b.
- **The rule is a prior, not a law.** Looking where the water is looks under the lamppost. That is why Dragonfly carries a mass spectrometer for any complex chemistry on Titan, and why the NRC asks us to keep alternatives in mind (see [[could-life-use-another-liquid]]).

So far no extraterrestrial life has been found, and the water is not yet shown to host it.

> [!key] The search follows the water because life on Earth needs it and because it is the requirement we can detect: oceans under the ice of Europa, Ganymede, Enceladus and Titan, and ancient lakes on Mars, are the targets. Finding liquid water makes a world habitable, not inhabited.`,
  ideas: ['“Follow the water” is a strategy: water is necessary for known life and is detectable from afar, but it is a prior, not a proof.', 'The targets are the ocean worlds of the outer Solar System (Europa 2030, Ganymede 2031–34, Titan 2034) and the dry beds of Mars.', 'JWST reads exoplanet atmospheres from absorption of starlight; the signal for a rocky planet is about 80 ppm around TRAPPIST-1 and 1 ppm around a Sun-like star.', 'A detection of water means a world is habitable; showing that it is inhabited needs a biosignature and a ladder of increasingly strong evidence.'],
  pitfalls: ["“Finding water means finding life” — Water is a necessary condition, not a sufficient one. Mars had rivers and lakes; whether it had life is unknown.", "“There is liquid water on Mars now” — There is ice, and possibly brines below the ground; at the surface the pressure is too low for liquid water to last, and claims of seasonal flows were revised to dry granular flows.", "“The habitable zone is where life lives” — It is where liquid water could exist on the surface of a planet with a suitable atmosphere; oceans under ice are outside it.", "“JWST has found a habitable planet” — It has measured atmospheres, mostly of giant planets, and has begun to test rocky planets; none has been shown to have a ocean or a biosignature."],
  terms: [
    { term: 'Follow the water', def: 'The strategy, adopted by NASA\'s Mars programme in the late 1990s and since generalised, of directing the search for life to places where liquid water exists or existed.' },
    { term: 'Biosignature', also: ['sign of life', 'life marker'], def: 'A substance, pattern or structure that could only, or most likely, be produced by living things: an atmospheric gas, a ratio of isotopes, a molecular pattern, a fossil.' },
    { term: 'Ocean world', also: ['ocean moon'], def: 'A planet or moon with a global liquid-water ocean under an ice shell or at the surface; Europa, Ganymede, Enceladus and probably Titan are the examples in the Solar System.' },
    { term: 'Transit spectroscopy', also: ['transmission spectrum'], def: 'Measuring the dimming of a star by a planet at different wavelengths as the planet crosses in front: the atmosphere\'s absorption bands show which gases are in it.' },
    { term: 'Habitable', also: ['habitability', 'inhabited'], def: 'Able to support life: liquid water, energy and the necessary elements together. A habitable world need not be inhabited.' }
  ],
  formulas: [
    { name: 'Equilibrium temperature of a planet', expr: 'T = 278.6*L^0.25*(1 - A)^0.25/d^0.5', tex: 'T_{\\mathrm{eq}} = 278.6\\,\\mathrm{K}\\;\\frac{L^{1/4}(1 - A)^{1/4}}{d^{1/2}}',
      vars: { T: { name: 'equilibrium temperature', q: 'temperature', unit: 'K', tex: 'T_{\\mathrm{eq}}', hint: 'Without a greenhouse effect. The Earth is 255 K by this formula and 288 K in fact.' }, L: { name: 'luminosity of the star (Suns)', value: 1, min: 0.0001, max: 100, hint: 'TRAPPIST-1 is 0.00055.' }, A: { name: 'albedo (Bond)', value: 0.3, min: 0, max: 0.95 }, d: { name: 'distance from the star (AU)', value: 1, min: 0.01, max: 100 } },
      solveFor: 'T', note: 'A planet absorbs the starlight it does not reflect and radiates like a black body. Habitable-zone limits are set by detailed climate models (Kopparapu 2013), not by this number alone.',
      stories: { T: 'A planet of albedo {A} orbits at {d} AU from a star of luminosity {L} Suns. What is its equilibrium temperature?' } },
    { name: 'Delay of a radio signal to a probe', expr: 'dt = d*AU/c', tex: '\\Delta t = \\frac{d\\,\\mathrm{AU}}{c}',
      vars: { dt: { name: 'one-way signal time', q: 'time', unit: 'min', tex: '\\Delta t' }, d: { name: 'distance (AU)', value: 9.58, min: 0.1, max: 100, hint: 'Mars 0.4–2.7 AU, Jupiter 4.2–6.2, Titan about 8.2–11.' }, AU: { const: 'AU' }, c: { const: 'c' } },
      solveFor: 'dt', note: 'Why a rover cannot be driven in real time: Mars is 3 to 22 minutes away, Titan about 70 to 90.',
      stories: { dt: 'A probe is {d} AU from Earth. How long does a radio message take one way?' } },
    { name: 'Size of an atmosphere\'s signature in a transit', expr: 'D = 2*Rp*n*H/Rs^2', tex: '\\Delta D = \\frac{2\\,R_p\\,n\\,H}{R_\\ast^{2}}',
      vars: { D: { name: 'extra dimming', q: 'ratio', unit: 'ppm', tex: '\\Delta D' }, Rp: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371, tex: 'R_p' }, n: { name: 'scale heights probed', value: 5, hint: 'Light that passes through the atmosphere samples about five scale heights.' }, H: { name: 'scale height of the atmosphere', q: 'length', unit: 'km', value: 8.5, hint: 'About 8.5 km for Earth; a few km for a heavy atmosphere, tens for a thin hot one.' }, Rs: { name: 'radius of the star', q: 'length', unit: 'km', value: 83000, tex: 'R_\\ast', hint: 'TRAPPIST-1 is 83,000 km (0.119 Suns); the Sun is 696,000 km.' } },
      solveFor: 'D', note: 'The annulus of atmosphere compared with the disc of the star. A hundred times smaller around a Sun-like star than around a cool dwarf.',
      stories: { D: 'A planet of radius {Rp} with a scale height of {H} transits a star of radius {Rs}. How much extra dimming does the atmosphere cause when {n} scale heights are probed?' } }
  ],
  examples: [
    { title: 'A message to Titan', q: 'Saturn is between 8.0 and 11.1 AU from Earth. How long does a command take to reach Dragonfly on Titan when the distance is 9.58 AU?',
      steps: ['One AU is 499 light-seconds.', '$9.58 \\times 499 = 4{,}780$ s = 79.7 min.'],
      a: 'About 80 minutes one way, so the rotorcraft must fly and decide on its own.' },
    { title: 'Seen through the atmosphere', q: 'Compare the transit signal of an Earth-like atmosphere (5 scale heights of 8.5 km) for an Earth-sized planet around TRAPPIST-1 (83,000 km) and around the Sun (696,000 km).',
      steps: ['TRAPPIST-1: $2\\times6371\\times5\\times8.5/(83000)^2 = 5.4\\times10^{5}/6.9\\times10^{9} = 7.9\\times10^{-5}$.', 'The Sun: $5.4\\times10^{5}/4.84\\times10^{11} = 1.1\\times10^{-6}$.'],
      a: '79 ppm against 1.1 ppm: 70 times stronger around the dwarf, which is why JWST begins there.' },
    { title: 'Why the Earth is not frozen', q: 'Find the equilibrium temperature of the Earth (1 AU, albedo 0.3, one Sun) and compare it with the actual mean surface temperature of 288 K.',
      steps: ['$T = 278.6 \\times 1 \\times 0.7^{0.25} = 278.6 \\times 0.915 = 254.8$ K.', 'The difference, 33 K, is the natural greenhouse effect of the water vapour and carbon dioxide in the air.'],
      a: '255 K (−18 °C) without a greenhouse; 288 K with it.' }
  ],
  quiz: [
    { q: 'Why does the search for life follow water first?', choices: ['Water proves life exists', 'All known life needs liquid water, and water can be detected from a distance', 'Water is the only thing telescopes can see', 'Aliens drink it'], a: 1, why: 'It is a strategy based on the one example we know, helped by the fact that ice, vapour and oceans can be detected remotely.' },
    { q: 'If liquid water is found on a distant world, that shows the world is inhabited.', a: false, why: 'It shows the world is habitable. Showing that it is inhabited needs a biosignature and several lines of evidence.' },
    { q: 'Europa Clipper, JUICE and Dragonfly are expected, in planned order of arrival, at', choices: ['Titan 2030, Europa 2031, Ganymede 2034', 'Europa 2030, Ganymede 2031, Titan 2034', 'Mars 2030, Venus 2031, Moon 2034', 'Enceladus 2030, Titan 2031, Europa 2034'], a: 1, why: 'Europa Clipper arrives at Jupiter in 2030; JUICE in 2031 (Ganymede orbit 2034); Dragonfly reaches Titan in 2034. Dates are the planned ones.' },
    { q: 'How many minutes does a radio signal take one way over 5.2 AU (Jupiter)?', answer: 43.2, why: '$5.2 \\times 499\\ \\mathrm{s} = 2595$ s = 43 min.' },
    { q: 'Why are the oceans of Europa and Enceladus outside the “habitable zone” and yet candidates for life?', choices: ['They are not candidates', 'Their heat comes from tides and rock chemistry, not from sunlight, so liquid water can exist far from the star', 'The zone is calculated wrongly', 'They are much closer to the Sun'], a: 1, why: 'The zone is defined by sunlight on a surface. An ice shell insulates an ocean that tidal flexing heats from within.' }
  ],
  applications: ['Choosing the next mission: the orbit and instruments of Europa Clipper were designed to find where the ice is thin and the plumes erupt.', 'Telescope time: JWST programmes on rocky planets around small stars are chosen by the signal-size formula.', 'Planetary protection: the places most likely to have water are also those the spacecraft must not contaminate.', 'Public understanding of what “alien life” announcements can and cannot claim.'],
  history: 'Mariner 4 in 1965 showed a cratered, dry Mars; Viking in 1976 had ambiguous life-detection results; the Martian meteorite ALH 84001 claim of fossils was published in 1996 and not accepted. Galileo (1995–2003) found the induced field that implies an ocean in Europa; Cassini found plumes at Enceladus in 2005 and hydrogen in 2015; Opportunity (2004) and Curiosity (2012) found evidence of ancient water on Mars. The “follow the water” theme dates from the Mars Exploration Program of the late 1990s.',
  sources: ['NASA JPL, “NASA missions provide new insights into ‘ocean worlds’” (13 April 2017) — Enceladus hydrogen, Europa plume.', 'NASA Astrobiology Strategy 2015.', 'Neveu and colleagues, “The ladder of life detection”, *Astrobiology* 18, 1375 (2018); Green and colleagues, “Call for a framework for reporting evidence for life beyond Earth”, *Nature* 598, 575 (2021).', 'NASA and ESA mission pages for Europa Clipper, JUICE, Dragonfly and the James Webb Space Telescope.'],
  sim: { id: 'us-solvents', params: { mode: 'tree' } }
},

/* ================================================================ 10. how much water things take */
{
  id: 'how-much-water-things-take', parent: 'water-for-people', title: 'How much water things take', level: 1,
  short: 'A kilogram of beef takes about 15,400 litres of water to produce, wheat 1,800, a cup of coffee 130, a cotton T-shirt 2,700. Most of it is rain on fields, not water drawn from a river; farming takes 70 % of all water withdrawn; and a country can import water by importing grain. The footprint of a person\'s food is a thousand times the water they drink.',
  keywords: ['water footprint', 'virtual water', 'green water', 'blue water', 'grey water', 'beef water', 'agriculture water use', 'Mekonnen Hoekstra', 'embedded water', 'water per kilogram', 'water in food', 'coffee water', 'cotton T-shirt', 'withdrawals', 'AQUASTAT'],
  prereq: ['the-water-cycle', 'drinking-water-and-thirst', 'rivers-and-groundwater'],
  related: ['desalination', 'water-treatment', 'transpiration-pull', 'stomata-and-the-cost-of-carbon', 'how-much-water-earth-has', 'hydraulics:water-resources', 'hydraulics:water-supply', 'hydraulics:groundwater-darcy'],
  body: `
A cup of coffee holds 125 millilitres. To grow the beans, process them and roast them, the water that passes through the world to make one such cup is about 130 litres — a thousand times what is in the cup. The invisible water in what we eat and wear is the largest water use of any person, and it is measured by the **water footprint**, introduced by Arjen Hoekstra in 2002: the volume of fresh water used, along the whole chain, to produce a good.

### Three colours
- **Green water** is rain that falls on a field and is taken up by the crop through its roots and transpired. It is most of the water in most food, and no river or well supplies it.
- **Blue water** is surface or groundwater taken for irrigation, industry or the home and not returned to where it came from: the water that makes rivers shrink and aquifers fall.
- **Grey water** is the volume that would be needed to dilute the pollution a process leaves to the level of the water-quality standard.

Averaged over the world, humanity's footprint was 9,087 cubic kilometres a year in 1996–2005, or 1,385 m³ per person per year — 3.8 cubic metres a day — and 74 % of it green, 11 % blue and 15 % grey (Hoekstra and Mekonnen, 2012).

### Litres per kilogram
| Product | Global average, L/kg | Of which green |
|---|---|---|
| Beef | 15,400 | 94 % |
| Pork | 6,000 | 82 % |
| Chicken | 4,300 | 82 % |
| Eggs | 3,300 | 79 % |
| Rice | 2,500 | 46 % |
| Wheat | 1,800 | 70 % |
| Milk | 1,000 | 85 % |
| Maize | 1,200 | 78 % |
| Potatoes | 290 | 67 % |
| Tomatoes | 210 | 50 % |
| One cup of coffee (125 mL) | 130 L | — |
| A cotton T-shirt (about 250 g) | 2,500–2,700 L | — |

(Mekonnen and Hoekstra 2011 and 2012; the numbers are global averages and the range around each is wide.) The beef figure is large because an animal eats several kilograms of feed — grass, hay, grain — for each kilogram of meat, and each kilogram of feed has its own footprint. About 98 % of the water in beef is in the feed. Per kilocalorie the contrast is the same: roughly 10 litres for beef, 2 for chicken, 0.5 for wheat or potatoes. A hamburger is about 2,400 L; a plate of chicken and rice about 900 L; a vegetable dish a few hundred. Against that a person drinks 2.5 L a day.

### Who uses the water
Of about 4,000 cubic kilometres a year withdrawn from rivers, lakes and aquifers worldwide, roughly **70 % goes to agriculture, 20 % to industry and 10 % to homes** (FAO AQUASTAT; round numbers). In many hot countries agriculture is above 90 %. A household in a rich country uses 100–300 litres a day at the tap and an order of magnitude more through its food and goods.

### Virtual water
In 1993 the geographer Tony Allan pointed out that a country short of water can import it embedded in grain: a tonne of wheat is 1,800 m³ of water that did not have to come from the importing country's rivers. The Middle East and North Africa have imported more and more grain over the decades. The global trade in embedded water is roughly a quarter of humanity's total footprint. Allan's idea changes the question from “how much water does a country have?” to “where is its water coming from?”

### Reading a footprint
A footprint is an *inventory*, not an *impact*. A litre of blue water drawn from a shrinking desert aquifer does far more harm than a litre of green rainwater in a wet climate, where the rain would fall and evaporate anyway. Beef from pasture in the rainy tropics has a small blue footprint; beef finished on irrigated feed in a dry region has a large one. The averages are good for ranking foods and bad for judging a particular farm.

> [!key] The water in what we eat — 3.8 cubic metres a day on average — is a thousand times what we drink, and most of it is rain: green water for crops and, above all, for the feed of livestock. Farming withdraws 70 % of the world's fresh water, and a country can import water by importing grain.`,
  ideas: ['The water footprint counts all fresh water used along a chain, in green (rain), blue (withdrawn) and grey (dilution) parts.', 'Global averages: beef 15,400 L/kg, pork 6,000, chicken 4,300, rice 2,500, wheat 1,800, milk 1,000, potatoes 290; a cup of coffee 130 L and a cotton T-shirt about 2,700.', 'Agriculture takes about 70 % of withdrawals, industry 20 %, homes 10 %.', 'Virtual water: trading a tonne of wheat moves 1,800 m³ of water from the exporter to the importer.'],
  pitfalls: ["“15,400 litres of water are taken from rivers to make a kilo of beef” — About 94 % is green water, rain on pastures and feed crops. The blue share is small; the issue is the land and, locally, irrigation.", "“A low footprint means a low impact” — A footprint is a volume. Where the water comes from (a scarce aquifer or a rainy plain) decides the harm.", "“Home use is the main use” — At the tap people use 100–300 L a day; their food and goods hold 3,800 L a day.", "“Importing food makes a country dependent for no reason” — It is also a way to save a scarce resource: the importer uses another country's rain."],
  terms: [
    { term: 'Water footprint', also: ['WF', 'embedded water'], def: 'The volume of fresh water used to produce a good or service, summed over the supply chain and split into green, blue and grey components.' },
    { term: 'Green water', def: 'Rainwater held in the soil and used by plants (evapotranspiration); the largest part of the footprint of crops and livestock.' },
    { term: 'Blue water', def: 'Surface water and groundwater used and not returned to the source: irrigation losses, evaporation from reservoirs, water in products.' },
    { term: 'Grey water (footprint)', def: 'The volume of fresh water needed to dilute pollutants from a process to the level at which the water meets the quality standard.' },
    { term: 'Virtual water', also: ['embedded water', 'water in trade'], def: 'The water used to produce a traded commodity, as if it moved with the goods. Allan, 1993.' },
    { term: 'Withdrawal and consumption', def: 'Withdrawal is water taken from a source; consumption is the part that does not return (evaporated, incorporated in a product). Irrigation consumes about half to two-thirds of what it withdraws.' }
  ],
  formulas: [
    { name: 'Footprint of a product', expr: 'F = m*wf', tex: 'F = m\\,w_f',
      vars: { F: { name: 'water footprint (L)', q: false, unit: 'L', tex: 'F' }, m: { name: 'mass of product (kg)', q: false, unit: 'kg', value: 0.15, min: 0 }, wf: { name: 'footprint per kilogram (L/kg)', q: false, unit: 'L/kg', value: 15400, tex: 'w_f', hint: 'Global averages (Mekonnen and Hoekstra): beef 15,400; chicken 4,300; rice 2,500; wheat 1,800; potatoes 290.' } },
      solveFor: 'F', note: 'Global average footprints; a specific product can be an order of magnitude different.',
      stories: { F: 'A burger holds {m} of beef, with a footprint of {wf}. How much water went into the beef?', m: 'A product with a footprint of {wf} has used {F} of water. How much of it is there?' } },
    { name: 'Footprint of a meal', expr: 'F = m1*w1 + m2*w2 + m3*w3', tex: 'F = m_1 w_1 + m_2 w_2 + m_3 w_3',
      vars: { F: { name: 'water footprint of the meal (L)', q: false, unit: 'L' }, m1: { name: 'mass of ingredient 1 (kg)', q: false, unit: 'kg', value: 0.15, tex: 'm_1' }, w1: { name: 'footprint of ingredient 1 (L/kg)', q: false, unit: 'L/kg', value: 4300, tex: 'w_1', hint: 'Chicken, 4,300.' }, m2: { name: 'mass of ingredient 2 (kg)', q: false, unit: 'kg', value: 0.1, tex: 'm_2' }, w2: { name: 'footprint of ingredient 2 (L/kg)', q: false, unit: 'L/kg', value: 2500, tex: 'w_2', hint: 'Rice, 2,500 (dry weight).' }, m3: { name: 'mass of ingredient 3 (kg)', q: false, unit: 'kg', value: 0.1, tex: 'm_3' }, w3: { name: 'footprint of ingredient 3 (L/kg)', q: false, unit: 'L/kg', value: 210, tex: 'w_3', hint: 'Tomatoes, 210.' } },
      solveFor: 'F', note: 'Adds ingredient by ingredient. The sim lets you build a bigger meal from twelve foods.',
      stories: { F: 'A meal has {m1} of an ingredient at {w1}, {m2} at {w2} and {m3} at {w3}. What is its water footprint?' } },
    { name: 'Water per kilocalorie', expr: 'w = wf/E', tex: 'w = \\frac{w_f}{E}',
      vars: { w: { name: 'litres per kilocalorie', q: false, unit: 'L/kcal' }, wf: { name: 'footprint per kilogram (L/kg)', q: false, unit: 'L/kg', value: 15400, tex: 'w_f' }, E: { name: 'energy content (kcal/kg)', q: false, unit: 'kcal/kg', value: 1510, hint: 'Beef about 1,500 kcal/kg; wheat grain 3,400; potatoes 770; milk 640.' } },
      solveFor: 'w', note: 'Beef about 10 L/kcal against about 0.5 for wheat: the reason for the advice to eat lower in the food chain.',
      stories: { w: 'A food has a footprint of {wf} and holds {E}. What is its footprint per kilocalorie?' } }
  ],
  examples: [
    { title: 'A hamburger', q: 'A burger has 150 g of beef, 60 g of wheat in the bun and 30 g of tomato. Using 15,400, 1,800 and 210 L/kg, what is its footprint, and how many days of drinking water is that?',
      steps: ['Beef: $0.15 \\times 15400 = 2310$ L. Bun: $0.06 \\times 1800 = 108$ L. Tomato: $0.03 \\times 210 = 6.3$ L.', 'Total: 2,424 L.', 'At 2.5 L a day for drinking: $2424/2.5 = 970$ days.'],
      a: 'About 2,400 L, nearly 2.7 years of drinking water; 95 % of it in the patty.' },
    { title: 'Chicken, rice and tomato', q: 'A meal of 150 g of chicken, 100 g of dry rice and 100 g of tomato: what is the footprint?',
      steps: ['Chicken: $0.15 \\times 4300 = 645$ L; rice: $0.10 \\times 2500 = 250$ L; tomato: $0.10 \\times 210 = 21$ L.', 'Total: 916 L.'],
      a: 'About 920 L: two-fifths of the burger.' },
    { title: 'A country\'s import of water', q: 'A country imports 4 million tonnes of wheat a year. How much water, in cubic kilometres, does it import with it?',
      steps: ['$4\\times10^{9}\\ \\mathrm{kg} \\times 1800\\ \\mathrm{L/kg} = 7.2\\times10^{12}$ L.', '$1\\ \\mathrm{km^3} = 10^{12}$ L, so 7.2 km³ — as much as the Sea of Galilee holds in a few years of its inflow.'],
      a: '7.2 km³ a year of virtual water.' }
  ],
  quiz: [
    { q: 'About how much of the water footprint of beef is green water?', choices: ['6 %', '30 %', '60 %', '94 %'], a: 3, why: 'Most of the water is rain falling on the pasture and the feed crops (94 %, Mekonnen and Hoekstra 2012). The blue share, withdrawn from rivers or aquifers, is only a few per cent.' },
    { q: 'Worldwide, agriculture accounts for roughly what share of fresh-water withdrawals?', choices: ['10 %', '20 %', '40 %', '70 %'], a: 3, why: 'About 70 %, against roughly 20 % for industry and 10 % for homes (FAO AQUASTAT, round numbers).' },
    { q: 'A product with a high water footprint must be bad for the environment wherever it is made.', a: false, why: 'A footprint is a volume. The harm depends on whether the water is green or blue and on how scarce it is where it is drawn: rain on a wet plain is not a rival use.' },
    { q: 'What is the water footprint, in litres, of 200 g of wheat bread flour (1,800 L/kg)?', answer: 360, why: '$0.2 \\times 1800 = 360$ L.' },
    { q: '“Virtual water” means', choices: ['water made by chemical reaction', 'the water used to produce a traded good, as if it travelled with it', 'water in the atmosphere', 'water recycled in a plant'], a: 1, why: 'Allan\'s term for the water embedded in trade: a country importing a tonne of wheat imports the 1,800 m³ used to grow it.' }
  ],
  applications: ['Choosing foods and diets with lower footprints.', 'National water planning: arid countries import grain rather than irrigate it.', 'Company water accounting, including the “grey” water for pollution.', 'Drought policy: a farm\'s blue water, not the rain, is what a restriction on irrigation limits.'],
  history: 'Tony Allan proposed “virtual water” in 1993 (he received the Stockholm Water Prize in 2008). Arjen Hoekstra introduced the water footprint in 2002 and, with Mekonnen, produced the global tables of 2011–2012 that are the source of the numbers on this page. The shares of withdrawals are from FAO\'s AQUASTAT database.',
  sources: ['Mekonnen and Hoekstra, “The green, blue and grey water footprint of crops and derived crop products”, *Hydrology and Earth System Sciences* 15, 1577 (2011).', 'Mekonnen and Hoekstra, “A global assessment of the water footprint of farm animal products”, *Ecosystems* 15, 401 (2012).', 'Hoekstra and Mekonnen, “The water footprint of humanity”, *PNAS* 109, 3232 (2012).', 'FAO AQUASTAT, global water-use statistics (agriculture, industry and municipal withdrawals).'],
  sim: 'us-meal-footprint'
}
);
