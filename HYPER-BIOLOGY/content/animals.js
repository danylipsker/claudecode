/* HYPER-BIOLOGY · content/animals.js
 * Branch "Animal Form and Function": topics animal-systems (homeostasis, endotherms and ectotherms,
 * gas exchange, circulation, osmoregulation, nervous systems, hormones) and animal-life (muscles,
 * immunity, reproduction, development, size and scaling). Comparative physiology: the human detail
 * is in Hyper Medicine (medicine:<id>). Simulations in sims/animals.js (prefix ani-).
 */
Hyper.add(

/* ================================================================ ANIMAL SYSTEMS */
{
  id: 'animal-homeostasis', parent: 'animal-systems', title: 'Homeostasis in animals', level: 1,
  short: 'Animals keep their internal fluids steady — temperature, salts, water, sugar, oxygen — by negative feedback: a sensor detects a change, a control centre compares it with a set point, and effectors push it back. Each species regulates some variables and lets others follow the outside world.',
  keywords: ['homeostasis', 'negative feedback', 'positive feedback', 'set point', 'regulator', 'conformer', 'loop gain', 'internal environment', 'milieu intérieur', 'feedforward', 'effector', 'sensor', 'behavioural fever', 'honeybee thermoregulation'],
  prereq: ['enzymes', 'cell-signalling', 'diffusion-osmosis'],
  related: ['thermoregulation-animals', 'osmoregulation', 'animal-hormones', 'animal-nervous-systems', 'enzyme-regulation', 'social-behaviour', 'medicine:homeostasis-feedback', 'medicine:hormone-feedback', 'medicine:body-fluids'],
  body: `
A trout in a mountain stream and a vole on the bank share the same frosty night. By morning the trout's body is at the temperature of the water, about 4 °C, and it is perfectly well; the vole's core is still at 37 °C, paid for with fat burned through the night. The trout **conforms** to its surroundings in temperature; the vole **regulates**. Every animal does some of each, and what it holds constant — and what it lets drift — is one of the best ways to understand how it lives.

### The internal environment
Claude Bernard pointed out in the 1860s that an animal's cells do not live in the outside world but in its own fluids, the *milieu intérieur*; Walter Cannon named the business of keeping those fluids steady **homeostasis** in 1926. In a mammal the numbers are held tight: plasma sodium 135–145 mM, glucose about 4–7 mM, pH 7.35–7.45, core temperature within about half a degree of 37 °C. Birds run hotter, at 40–42 °C. Enzymes, membranes and nerves are tuned to these values (see [[enzymes]]), so keeping them steady lets cells work at full speed whatever happens outside.

| Variable | A conformer | A regulator |
|---|---|---|
| Body temperature | cod, starfish, most resting insects | mouse (37 °C), sparrow (about 41 °C), a bumblebee's thorax in flight (about 35 °C) |
| Osmotic concentration | mussel, octopus, hagfish (like seawater, about 1000 mOsm/kg) | salmon (300–400 mOsm/kg in river and sea alike) |
| Oxygen uptake when O₂ falls | many worms and crabs | goldfish, most mammals |

Regulating costs energy and machinery; conforming demands cells that tolerate change. Neither is primitive — they are two strategies.

### The negative feedback loop
Almost all regulation is **negative feedback**: a **sensor** measures the variable, a **control centre** compares it with a **set point**, and **effectors** push it back, so the response always opposes the change. Effectors can be physiological — sweating, shivering, a kidney saving water — or behavioural: a lizard walking into shade, a crab leaving a drying rock pool. A honeybee colony regulates as a superorganism: when the brood comb cools below about 34.5 °C, workers press against it and shiver their flight muscles; above about 36 °C they fan at the entrance and spread droplets of water that cool the comb as they evaporate.

### How good is a loop? Its gain
If a disturbance would shift a variable by $D$ with no regulation, a loop of **gain** $G$ leaves only

$$E = \\frac{D}{1 + G}$$

Arthur Guyton estimated the gain of human temperature control at about 33: cold that would chill an unregulated body by 20 °C moves the core by only about 0.6 °C. The baroreceptor reflex that steadies blood pressure has a gain of only about 2. High gain means a small error, but combined with a **delay** — a sensor that responds late, blood that takes a minute to go round — it overshoots and oscillates, like a shower whose hot water arrives through a long pipe. Animals reduce the problem with **feedforward**: a desert lizard retreats before it overheats, and a thirsty dog stops drinking within minutes, long before the water has been absorbed.

### Positive feedback and moving set points
**Positive feedback** amplifies a change instead: the upstroke of a nerve impulse, a clotting cascade, the hormone surge that triggers ovulation, the oxytocin loop that ends in birth. It finishes a job quickly and then stops. Set points themselves move: body temperature follows a daily rhythm, rises in fever — even ectotherms do it, as infected desert iguanas choose warmer places — and falls in hibernation. Homeostasis is steadiness about a target the animal can reset.

> [!key] Negative feedback opposes change and keeps a variable near its set point; the loop's gain sets how small the remaining error is, and delays make it overshoot. Positive feedback amplifies change to complete a process. Every animal regulates some variables and conforms in others.

The human control systems in detail are in [[medicine:homeostasis-feedback|Hyper Medicine]].
`,
  ideas: [
    'Regulators hold a variable steady whatever the surroundings; conformers let it follow the outside. Most animals regulate some variables and conform in others.',
    'Negative feedback: sensor, control centre with a set point, effectors — the response opposes the change.',
    'A loop of gain G leaves a fraction 1/(1 + G) of a disturbance uncorrected; delays make high-gain loops overshoot and oscillate.',
    'Positive feedback amplifies a change to finish a process quickly: nerve impulses, clotting, ovulation, birth.',
    'Set points move — daily rhythms, fever, hibernation — so homeostasis is controlled, not fixed.'
  ],
  pitfalls: [
    'Homeostasis means nothing inside the body changes — Values fluctuate within a range, and the set points themselves shift with the time of day, fever, season and hibernation.',
    'Conformers do not regulate anything — A mussel conforms in total osmotic concentration but still regulates individual ions and its cell volume; a lizard conforms at night but regulates its temperature by behaviour during the day.',
    'Positive feedback is always a sign of disease — It is the normal way to complete processes quickly, such as the upstroke of an action potential or giving birth; it becomes dangerous only when nothing stops it.'
  ],
  formulas: [
    {
      name: 'The error left by a feedback loop',
      expr: 'E = D/(1 + G)', tex: 'E = \\dfrac{D}{1 + G}',
      vars: {
        E: { name: 'change that remains with regulation', q: 'dtemp', unit: '°C' },
        D: { name: 'change there would be without regulation', q: 'dtemp', unit: '°C', value: 20 },
        G: { name: 'gain of the feedback loop', value: 33 }
      },
      note: 'Any regulated variable works the same way; temperatures are only the example. The gain is the correction divided by the error that remains: G = (D − E)/E.',
      practice: { unknowns: ['E', 'G'] },
      stories: {
        E: 'A cold night would cool an unregulated body by {D}. Its temperature control has a gain of {G}. How much does the core temperature actually fall?',
        G: 'Without regulation a disturbance would shift body temperature by {D}; with regulation it shifts by only {E}. What is the gain of the loop?'
      }
    }
  ],
  examples: [
    {
      title: 'Measuring the gain of two loops',
      q: 'Guyton estimated that cold which would chill an unregulated human body by 20 °C lowers the core by about 0.6 °C, and that a disturbance which would raise blood pressure by 75 mmHg without the baroreceptor reflex raises it by only 25 mmHg with it. Find the gain of each loop.',
      steps: [
        'Rearrange $E = D/(1 + G)$ to $G = D/E - 1$.',
        'Temperature: $G = 20/0.6 - 1 = 33.3 - 1 \\approx 32$.',
        'Blood pressure: $G = 75/25 - 1 = 2$.',
        'The temperature loop corrects about 97 % of a disturbance; the pressure reflex corrects two-thirds, and slower loops (the kidneys) finish the job over hours and days.'
      ],
      a: 'A gain of about 32 for temperature and 2 for blood pressure.'
    }
  ],
  quiz: [
    { q: 'Which of these is negative feedback?', choices: ['Oxytocin makes the uterus contract, and the contractions release more oxytocin', 'Honeybees fan their wings and spread water when the brood comb gets too warm', 'Opening sodium channels depolarise a nerve, which opens more sodium channels', 'Each clotting factor activates many molecules of the next'], a: 1,
      why: 'Fanning and evaporative cooling oppose the rise in temperature, bringing the comb back towards its set point. The other three amplify the change: positive feedback.' },
    { q: 'An osmoconformer such as a mussel spends no effort at all on its body fluids.', a: false,
      why: 'It lets its total osmotic concentration follow seawater, but it still regulates particular ions (keeping potassium high inside its cells, for example) and the volume of its cells.' },
    { q: 'A disturbance would move a variable by 5 °C without regulation. The loop has a gain of 9. How much does the variable actually change?', answer: 0.5, unit: '°C', why: '$E = D/(1 + G) = 5/10 = 0.5$ °C: the loop corrects 90 % of the disturbance.' },
    { q: 'A regulator with a very high gain but a long delay between sensor and effector tends to…', choices: ['hold the variable perfectly steady', 'overshoot and oscillate about the set point', 'drift slowly away from the set point', 'switch to positive feedback'], a: 1,
      why: 'By the time the correction arrives the variable has already moved on, so a strong correction overshoots; the error changes sign and the cycle repeats.' },
    { q: 'Infected desert iguanas choose warmer places and raise their body temperature by about 2 °C. What does this show?', choices: ['Ectotherms cannot regulate temperature', 'Fever is a moved set point, and ectotherms reach it by behaviour', 'The infection has broken their homeostasis', 'Lizards are secretly endotherms'], a: 1,
      why: 'Behavioural fever: the set point is raised, as in a mammal, and the lizard\'s effector is its choice of where to sit. Preventing it from warming up reduced survival in the classic experiments.' }
  ],
  problems: [
    { q: 'Without regulation, a hot afternoon would raise a bird\'s body temperature by 12 °C; with regulation it rises by 0.8 °C. What is the gain of its temperature control?', answer: 14, tol: 0.02, steps: ['$G = D/E - 1 = 12/0.8 - 1 = 15 - 1 = 14$.'] }
  ],
  applications: [
    'Control engineering uses the same ideas — sensors, set points, gain, delay and overshoot — for thermostats, autopilots and chemical plants.',
    'Animal husbandry and zoos keep animals within the ranges their homeostasis can cope with (temperature, humidity, water quality).',
    'Veterinary and human medicine read many diseases as broken feedback loops: diabetes, thyroid disease, heat stroke.',
    'Beekeepers watch colony temperature; a hive that cannot hold its brood near 35 °C is in trouble.'
  ],
  history: 'Claude Bernard described the *milieu intérieur* in the 1860s; Walter Cannon coined the word homeostasis in 1926 and popularised it in *The Wisdom of the Body* (1932). Norbert Wiener\'s *Cybernetics* (1948) gave feedback its mathematics, and Arthur Guyton\'s physiology textbook made loop gain a standard tool.',
  sim: 'ani-feedback'
},

{
  id: 'thermoregulation-animals', parent: 'animal-systems', title: 'Endotherms and ectotherms', level: 2,
  short: 'Ectotherms such as lizards and fish take their body heat from their surroundings and control it by behaviour; endotherms such as mammals and birds make their own heat by metabolism, at five to ten times the cost. Insulation, countercurrent heat exchangers, evaporation, torpor and hibernation are the tools of both.',
  keywords: ['endotherm', 'ectotherm', 'heterotherm', 'poikilotherm', 'homeotherm', 'thermoregulation', 'basking', 'Q10', 'thermoneutral zone', 'lower critical temperature', 'thermal conductance', 'countercurrent heat exchange', 'rete mirabile', 'torpor', 'hibernation', 'brown fat', 'panting', 'evaporative cooling'],
  prereq: ['animal-homeostasis', 'bioenergetics', 'physics:newtons-law-of-cooling'],
  related: ['scaling-allometry', 'gas-exchange-animals', 'circulation-animals', 'osmoregulation', 'biological-rhythms', 'climate-ecosystems', 'medicine:thermoregulation', 'medicine:heat-cold', 'physics:thermal-radiation', 'physics:latent-heat', 'chemistry:arrhenius-equation'],
  body: `
Put a 30 g lizard and a 30 g mouse side by side in a cage at 20 °C. The mouse keeps its body at 37 °C and burns about half a watt doing it — some 40 kJ a day, which is why it eats about a seventh of its own weight in food every day. The lizard settles at the temperature of the cage and uses about a hundredth of a watt, a fiftieth of the mouse's rate; it can go weeks between meals. Both are successful designs. They differ in where their body heat comes from.

### Ectotherms and endotherms
An **ectotherm** — most fish, amphibians, reptiles and invertebrates — takes its body heat mainly from outside: sun, warm rock, water. An **endotherm** — mammals and birds — makes it from its own metabolism: by running its cells at high rates, by shivering, and in many mammals with brown fat, whose protein UCP1 lets the proton gradient of the mitochondria run down as heat instead of making ATP. The old words cold-blooded and warm-blooded mislead: a basking desert iguana at 40 °C is warmer than you. **Heterotherms** mix the two: hummingbirds and bats drop their temperature at night, and tuna, lamnid sharks and swordfish keep their swimming muscles, brain or eyes warmer than the sea.

At the same body temperature a resting mammal or bird uses roughly five to ten times the energy of a reptile of the same mass; once the reptile has cooled on a cool night, the gap exceeds fifty-fold. An ectotherm's chemistry follows its temperature, usually by a factor $Q_{10}$ of 2–3 for every 10 °C:

$$R_2 = R_1\\,Q_{10}^{(T_2-T_1)/10}$$

### Heat in, heat out
Every animal's temperature is set by a heat budget: metabolism and absorbed sunlight in; conduction, convection, radiation and evaporation out (see [[physics:newtons-law-of-cooling]] and [[physics:thermal-radiation]]). An ectotherm manages the *in* side by behaviour. A lizard at dawn presses its flattened, darkened body against a sun-facing rock; by mid-morning it is at its preferred 35–38 °C and shuttles between sun and shade to stay there; in the heat of midday it waits in a burrow. Bumblebees shiver their flight muscles to warm the thorax above 30 °C before take-off, even on a frosty morning.

An endotherm manages the *out* side. In its **thermoneutral zone**, fur, feathers and blood flow to the skin are enough; below the **lower critical temperature** it must burn extra fuel in proportion to the gap between body and air, $P = C(T_b - T_a)$, where the **thermal conductance** $C$ measures how leaky it is. In Scholander's classic measurements (1950) an arctic fox in winter fur needed no extra heat until about −40 °C, while a naked person starts to shiver below about 27 °C. Above the upper critical temperature the only way to lose heat is evaporation: each gram of water removes about 2.4 kJ, by sweating (horses, people), panting (dogs, birds) or licking the forearms (kangaroos).

### Countercurrent heat exchange
A gull standing on ice keeps its feet a few degrees above zero while its body is at 40 °C. The artery to the foot runs pressed against the returning veins, so warm outgoing blood hands its heat to the cold returning blood, and the heat goes back into the body instead of into the ice. The same arrangement cools the flippers and flukes of dolphins and the legs of wading birds and reindeer — and, run the other way, keeps a bluefin tuna's red muscle up to 15–20 °C warmer than the water, in a block of parallel vessels called a *rete mirabile*. Fish gills use the trick for oxygen ([[gas-exchange-animals]]) and kidneys for salt ([[osmoregulation]]).

### Torpor and hibernation
Being small and warm is expensive (see [[scaling-allometry]]), so many small endotherms switch off at times. A hummingbird in nightly **torpor** lets its body cool from 40 °C to below 20 °C — one Andean species was measured at 3.3 °C — and saves most of the night's energy. **Hibernators** such as ground squirrels, dormice and many bats let the body fall almost to the temperature of the burrow for days or weeks; metabolism drops to a few per cent of basal, and the arctic ground squirrel even supercools to about −3 °C. Bears are different: in winter their temperature falls only to about 30–35 °C, but their metabolism drops to around a quarter of normal.

> [!key] Ectotherms are cheap to run and control their temperature by behaviour; endotherms are expensive but independent of the weather. Insulation, countercurrent exchangers, evaporation and torpor let each live where it does.
`,
  ideas: [
    'Ectotherms get body heat from their surroundings, endotherms from metabolism; the names describe the heat source, not how warm the animal is.',
    'At the same body temperature an endotherm uses five to ten times the energy of an ectotherm of the same mass.',
    'Rates in an ectotherm rise by a factor Q10 of about 2–3 for every 10 °C.',
    'Below its lower critical temperature an endotherm must make extra heat P = C(Tb − Ta); insulation lowers the conductance C.',
    'Countercurrent exchangers keep heat in the core; torpor and hibernation save energy by letting the body cool.'
  ],
  pitfalls: [
    'Cold-blooded animals have cold blood — A basking desert lizard can be at 40 °C, warmer than a person; "ectotherm" says where the heat comes from.',
    'Endothermy is simply better — It costs five to ten times as much food. Ectotherms turn a far larger share of their food into growth and offspring, can fast for weeks, and are the great majority of animal species.',
    'Hibernation is a long deep sleep — The body cools nearly to the burrow\'s temperature and metabolism falls to a few per cent of basal; hibernators even rewarm every week or two, partly, it seems, to sleep.'
  ],
  formulas: [
    {
      name: 'Temperature and the rate of an ectotherm (Q₁₀)',
      expr: 'R2 = R1*Q10^((T2 - T1)/10)', tex: 'R_2 = R_1\\,Q_{10}^{(T_2 - T_1)/10}',
      vars: {
        R2: { name: 'metabolic rate at T₂', q: 'power', unit: 'mW', tex: 'R_2' },
        R1: { name: 'metabolic rate at T₁', q: 'power', unit: 'mW', value: 20, tex: 'R_1' },
        Q10: { name: 'temperature coefficient Q₁₀', value: 2.5, tex: 'Q_{10}' },
        T1: { name: 'first body temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_1' },
        T2: { name: 'second body temperature', q: 'temperature', unit: '°C', value: 35, tex: 'T_2' }
      },
      note: 'An empirical rule for rates of reactions, heartbeat, digestion and sprinting in ectotherms; Q₁₀ is typically 2–3 and falls at high temperatures. It is a convenient form of the Arrhenius law over a limited range.',
      practice: { unknowns: ['R2', 'T2', 'Q10'] },
      stories: {
        R2: 'A lizard at {T1} uses {R1}. It basks until its body reaches {T2}. With Q₁₀ = {Q10}, what is its metabolic rate now?',
        T2: 'A snake uses {R1} at {T1}. At what body temperature does it use {R2}, if Q₁₀ = {Q10}?',
        Q10: 'A crab\'s heart uses energy at {R1} at {T1} and {R2} at {T2}. What is its Q₁₀?'
      }
    },
    {
      name: 'Heat an endotherm must make below its thermoneutral zone',
      expr: 'P = C*(Tb - Ta)', tex: 'P = C\\,(T_b - T_a)',
      vars: {
        P: { name: 'metabolic heat needed', q: 'power', unit: 'W' },
        C: { name: 'thermal conductance of the animal', unit: 'W/K', value: 0.03 },
        Tb: { name: 'body temperature', q: 'temperature', unit: '°C', value: 37, tex: 'T_b' },
        Ta: { name: 'air temperature', q: 'temperature', unit: '°C', value: 10, tex: 'T_a' }
      },
      note: 'Scholander\'s model: below the lower critical temperature, heat production rises in a straight line as the air cools. Where P equals the basal rate is the lower critical temperature. Thick fur or blubber means a small C.',
      practice: { unknowns: ['P', 'Ta', 'C'] },
      stories: {
        P: 'A mouse with a conductance of {C} keeps its body at {Tb} in air at {Ta}. How much heat must it produce?',
        Ta: 'An arctic fox has a conductance of {C}, a body temperature of {Tb} and a basal rate of {P}. Below what air temperature must it produce extra heat?',
        C: 'A small mammal at {Tb} produces {P} in air at {Ta}. What is its thermal conductance?'
      }
    },
    {
      name: 'Cooling by evaporation',
      expr: 'Pe = mw*Lv', tex: 'P_e = \\dot m\\,L_v',
      vars: {
        Pe: { name: 'heat removed by evaporation', q: 'power', unit: 'W', tex: 'P_e' },
        mw: { name: 'rate of water evaporation', q: 'massflow', unit: 'g/min', value: 2.5, tex: '\\dot m' },
        Lv: { name: 'latent heat of vaporisation of water', q: 'latent', unit: 'kJ/kg', value: 2430, tex: 'L_v' }
      },
      note: 'About 2.4 MJ per kilogram at skin temperature. Only water that evaporates cools: sweat that drips off does not.',
      practice: { unknowns: ['Pe', 'mw'] },
      stories: {
        Pe: 'A panting dog evaporates {mw} of water from its tongue and airways. How much heat does that remove?',
        mw: 'A horse must shed {Pe} by sweating. How fast must water evaporate from its skin?'
      }
    }
  ],
  examples: [
    {
      title: 'A lizard warms up',
      q: 'A lizard at 25 °C uses 20 mW. It basks until its body reaches 35 °C. With $Q_{10} = 2.5$, what is its metabolic rate now, and how much faster does it digest?',
      steps: [
        '$R_2 = 20 \\times 2.5^{(35-25)/10} = 20 \\times 2.5 = 50$ mW.',
        'Digestion, being chemistry too, speeds up by a similar factor: roughly 2.5 times as fast.',
        'That is why lizards bask after a meal: a warm gut processes the food before it spoils.'
      ],
      a: '50 mW; digestion about 2.5 times faster.'
    },
    {
      title: 'Where does the arctic fox start to shiver?',
      q: 'A 3.5 kg arctic fox has a basal metabolic rate of 8.7 W (Kleiber\'s law), a body temperature of 38.5 °C and, in winter fur, a thermal conductance of 0.11 W/K. Find its lower critical temperature, and compare a 30 g mouse (basal rate 0.245 W, conductance 0.03 W/K, body at 37 °C).',
      steps: [
        'The lower critical temperature is where the basal heat just balances the loss: $T_a = T_b - P/C$.',
        'Fox: $T_a = 38.5 - 8.7/0.11 = 38.5 - 79 = -40.5$ °C.',
        'Mouse: $T_a = 37 - 0.245/0.03 = 37 - 8.2 = 28.8$ °C.',
        'The fox is comfortable in almost any arctic weather without burning extra fuel; the mouse must make extra heat on any day cooler than a warm room — or huddle, nest and burrow.'
      ],
      a: 'About −40 °C for the fox, about 29 °C for the mouse.'
    },
    {
      title: 'The water cost of panting',
      q: 'On a hot afternoon a 20 kg dog must shed 100 W by panting. How much water does it lose in an hour?',
      steps: [
        '$\\dot m = P/L_v = 100\\ \\mathrm{W} / 2.43\\times10^6\\ \\mathrm{J/kg} = 4.1\\times10^{-5}$ kg/s $= 2.5$ g/min.',
        'In an hour: $2.5 \\times 60 = 148$ g — about 150 mL of water.',
        'Evaporation works however hot the air is, but it costs water, which is why desert animals avoid it and hide by day.'
      ],
      a: 'About 150 mL an hour.'
    }
  ],
  quiz: [
    { q: 'A hummingbird keeps its body at 40 °C by day and lets it fall to 15 °C at night. It is best described as…', choices: ['an ectotherm', 'a strict homeotherm', 'a heterotherm — an endotherm that uses daily torpor', 'a poikilotherm like a lizard'], a: 2,
      why: 'It makes its own heat (an endotherm) but lets its temperature fall at night to save energy: a heterotherm.' },
    { q: 'A process has $Q_{10} = 2$. By what factor does its rate change when the temperature rises from 10 °C to 30 °C?', answer: 4, why: 'Two steps of 10 °C: $2^2 = 4$.' },
    { q: 'Countercurrent heat exchange in a gull\'s leg keeps its foot close to body temperature.', a: false,
      why: 'The opposite: outgoing arterial blood hands its heat to the returning venous blood, so the foot stays cold (near 0–5 °C) and little heat is lost to the ice.' },
    { q: 'Below its lower critical temperature a small mammal has a conductance of 0.05 W/K. The air cools from 10 °C to 0 °C. How much more heat must it make?', answer: 0.5, unit: 'W', why: '$\\Delta P = C\\,\\Delta T = 0.05 \\times 10 = 0.5$ W.' },
    { q: 'Why does a mouse need about fifty times as much food as a lizard of the same mass on a cool day?', choices: ['Its gut digests food less efficiently', 'It keeps its body warm with its own metabolism, and its cells run at high rates all the time', 'Its muscles are larger', 'It loses more water'], a: 1,
      why: 'Endothermy is expensive: five to ten times the lizard\'s rate even at the same body temperature, and much more once the lizard has cooled down.' }
  ],
  problems: [
    { q: 'A snake\'s resting metabolic rate is 5 mW at 20 °C. With $Q_{10} = 2.5$, what is it at 32 °C?', answer: 15.0, unit: 'mW', tol: 0.02, steps: ['$R_2 = 5 \\times 2.5^{1.2}$.', '$2.5^{1.2} = e^{1.2\\ln 2.5} = e^{1.10} = 3.00$, so $R_2 = 15$ mW.'] },
    { q: 'A 20 g mouse has a conductance of 0.025 W/K and a body temperature of 37 °C. How much heat must it produce in air at 5 °C?', answer: 0.8, unit: 'W', tol: 0.02, steps: ['$P = C(T_b - T_a) = 0.025 \\times 32 = 0.8$ W — several times its basal rate.'] }
  ],
  applications: [
    'Farm animals are housed within their thermoneutral zone: newborn piglets need 30–34 °C, which is why pens have heat lamps.',
    'Keepers of reptiles give them a gradient from a basking spot to a cool retreat so they can regulate their own temperature.',
    'Tropical ectotherms already live close to their upper thermal limits, which makes them especially vulnerable to climate warming.',
    'Engineers copy countercurrent exchange in heat-recovery ventilation, and medicine studies torpor for protecting organs and patients.'
  ],
  history: 'Raymond Cowles and Charles Bogert showed in 1944 that desert reptiles regulate their body temperature closely by behaviour. Per Scholander, Laurence Irving and colleagues measured arctic and tropical mammals and birds in 1950 and set out the conductance model used here. Frank Carey discovered in the 1960s and 1970s how tuna and lamnid sharks keep their muscles warm.',
  sim: 'ani-thermo'
},

{
  id: 'gas-exchange-animals', parent: 'animal-systems', title: 'Gas exchange across the animal kingdom', level: 2,
  short: 'Oxygen reaches every animal cell by diffusion, which is fast over micrometres and hopeless over centimetres. Fick\'s law explains the designs that solve it: skin, countercurrent gills that take 80 % of the oxygen from water, insect tracheae that pipe air to the cells, one-way bird lungs and tidal mammal lungs.',
  keywords: ['gas exchange', "Fick's law", 'diffusion', 'respiratory surface', 'gills', 'countercurrent exchange', 'lamellae', 'tracheae', 'spiracles', 'tracheoles', 'air sacs', 'parabronchi', 'crosscurrent', 'alveoli', 'ventilation', 'oxygen extraction', 'giant insects'],
  prereq: ['diffusion-osmosis', 'oxidative-phosphorylation', 'chemistry:partial-pressures'],
  related: ['circulation-animals', 'scaling-allometry', 'thermoregulation-animals', 'invertebrates', 'vertebrates', 'life-history-earth', 'medicine:gas-exchange', 'medicine:oxygen-transport', 'medicine:ventilation', 'chemistry:henrys-law', 'chemistry:effusion-diffusion'],
  body: `
Every animal cell burns fuel with oxygen and makes carbon dioxide, and every gas molecule crosses the last stretch into a cell by **diffusion**. Diffusion is fast over a cell and hopeless over a body: the time to diffuse a distance $x$ grows with its square, $t \\approx x^2/2D$. For oxygen in water ($D \\approx 2\\times10^{-9}\\ \\mathrm{m^2/s}$) that is about 25 ms for 10 µm, four minutes for 1 mm and seven hours for 1 cm. Only very small or very flat animals — rotifers, flatworms, the sheet-like *Trichoplax* — can rely on diffusion from their surface. Everything larger has a **respiratory surface**, a way to move air or water past it, and a circulation to carry the gas inside.

### Fick's law
The rate of diffusion across a surface is

$$J = \\frac{D\\,A\\,\\Delta c}{x}$$

— proportional to the area $A$ and the concentration (or partial-pressure) difference, and inversely proportional to the thickness $x$. Every gas-exchange organ maximises the first two and minimises the third. Human lungs pack 70–100 m² of alveoli, 300–500 million of them, behind a barrier about 0.5 µm thick ([[medicine:gas-exchange]]); a tuna has roughly ten times as much gill area per gram as a sluggish bottom-dwelling fish, behind a barrier just as thin. Ventilation keeps $\\Delta c$ high by replacing the used medium, and circulation carries the gas away on the inside ([[circulation-animals]]).

### Water or air
| | Air | Water (15 °C, air-saturated) |
|---|---|---|
| Oxygen content | 209 mL per litre | about 7 mL per litre |
| Density | 1.2 kg/m³ | 1000 kg/m³ |
| Viscosity | 0.018 mPa·s | 1.1 mPa·s |
| Diffusion coefficient of O₂ | 2 × 10⁻⁵ m²/s | 2 × 10⁻⁹ m²/s |

Water holds some thirty times less oxygen, and it is 800 times denser and 60 times more viscous, so breathing it is costly — a fish may spend a tenth of its energy moving water over its gills, a mammal 1–2 % on breathing. Fish therefore pump water one way over the gills and take as much as they can from each litre, using **countercurrent flow**: blood in the gill lamellae runs opposite to the water. Blood about to leave the lamella meets the freshest water, and all along the lamella the water is richer in oxygen than the blood beside it, so the blood can leave with nearly the oxygen of the incoming water and a trout takes 80 % or more of the oxygen out of the water. In **concurrent** flow the two streams would approach a common middle value, and extraction could never exceed 50 % (with equal flows). A mammal's lung, ventilated in and out through the same tubes, removes only about a quarter of the oxygen from each breath.

### Tracheae: why insects are small
Insects pipe air itself to their cells through **tracheae**, branching tubes opened and closed at **spiracles**, which end in tracheoles less than a micrometre wide pressed against the cells of the flight muscles. Oxygen diffuses 10 000 times faster in air than in water, so no blood is needed to carry it, and insect haemolymph plays almost no part in breathing. But diffusion along tubes limits how long they can be, and larger beetles devote a growing share of their body to tracheae, especially where the legs join the body — one reason no living insect is bigger than a large beetle. In the late Carboniferous, some 300 million years ago, when the air may have held 30–35 % oxygen, dragonfly-like griffinflies reached wingspans of 70 cm.

### Birds: a one-way lung
A bird's lungs are rigid, and air moves through them in **one direction**: fresh air goes first to the posterior air sacs, then through the fine tubes of the lung (the parabronchi), then to the anterior air sacs and out, taking two breaths to pass through. Capillaries cross the parabronchi at right angles (**crosscurrent** exchange), so blood leaving the lung can carry more oxygen than the exhaled air — something a tidal lung cannot do. With a very thin barrier, this lets bar-headed geese cross the Himalaya at 5000–7000 m, where the air holds about half the oxygen of sea level.

> [!key] Fick's law explains every design: a large area, a thin barrier, and a steep gradient kept up by ventilation and circulation. Water breathers extract a scarce resource with countercurrent gills; insects pipe air straight to their cells; birds run air through their lungs one way.
`,
  ideas: [
    'Diffusion time grows with the square of distance: milliseconds across a cell, hours across a centimetre — so large animals need ventilation and circulation.',
    'Fick\'s law: rate = D A Δc / x. Gas-exchange organs have huge areas and very thin barriers.',
    'Water holds 30 times less oxygen than air and is 800 times denser, so fish extract up to 80 % of it with countercurrent gills.',
    'Insects deliver air directly to their tissues through tracheae; diffusion along the tubes limits their size.',
    'Birds ventilate their lungs one way with air sacs and exchange by crosscurrent, outperforming tidal mammal lungs at altitude.'
  ],
  pitfalls: [
    'Countercurrent flow works because the fluids move faster — It works because the blood always meets water with more oxygen than itself, so the gradient never disappears along the whole lamella.',
    'Insects breathe through their mouths and carry oxygen in their blood — Air enters through spiracles on the sides of the body and reaches the cells through tracheae; the haemolymph has almost no role in carrying oxygen.',
    'Diffusion is too slow to matter — Over micrometres it is extremely fast (milliseconds); every design simply keeps the last diffusion distance that short.'
  ],
  formulas: [
    {
      name: 'Fick\'s law of diffusion',
      expr: 'J = D*A*dC/x', tex: 'J = \\dfrac{D\\,A\\,\\Delta c}{x}',
      vars: {
        J: { name: 'rate of diffusion (moles per second)', unit: 'mol/s' },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 2e-9 },
        A: { name: 'area of the exchange surface', q: 'area', unit: 'm²', value: 0.2 },
        dC: { name: 'concentration difference across the barrier', q: 'concentration', unit: 'mM', value: 0.1, tex: '\\Delta c' },
        x: { name: 'thickness of the barrier', q: 'length', unit: 'µm', value: 5 }
      },
      note: 'D for oxygen is about 2 × 10⁻⁹ m²/s in water and tissue and 2 × 10⁻⁵ m²/s in air. Physiologists often use partial pressures instead of concentrations, with a permeation coefficient in place of D.',
      practice: { unknowns: ['J', 'A', 'x'] },
      stories: {
        J: 'The gills of a 1 kg trout have an area of {A} and a barrier {x} thick; the oxygen concentration difference across it is {dC}. With D = {D}, how fast can oxygen diffuse in?',
        A: 'An animal needs oxygen at {J} through a barrier {x} thick with a concentration difference of {dC} (D = {D}). What exchange area does it need?',
        x: 'Oxygen crosses an exchange surface of {A} at {J} with a concentration difference of {dC} (D = {D}). How thick is the barrier?'
      }
    },
    {
      name: 'Time to diffuse a distance',
      expr: 't = x^2/(2*D)', tex: 't = \\dfrac{x^2}{2D}',
      vars: {
        t: { name: 'typical diffusion time', q: 'time', unit: 's' },
        x: { name: 'distance', q: 'length', unit: 'µm', value: 100 },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 2e-9 }
      },
      note: 'The mean time for molecules to spread a distance x along one direction. Doubling the distance quadruples the time.',
      practice: { unknowns: ['t', 'x'] },
      stories: {
        t: 'How long does oxygen (D = {D}) take to diffuse {x} into a tissue?',
        x: 'How far does oxygen (D = {D}) diffuse in {t}?'
      }
    },
    {
      name: 'Oxygen taken from a ventilated medium',
      expr: 'VO2 = Vw*Cin*E', tex: '\\dot V_{O_2} = \\dot V\\,C_{in}\\,E',
      vars: {
        VO2: { name: 'oxygen uptake', q: false, unit: 'mL/min', tex: '\\dot V_{O_2}' },
        Vw: { name: 'ventilation (water or air pumped)', q: false, unit: 'L/min', value: 0.2, tex: '\\dot V' },
        Cin: { name: 'oxygen content of the incoming medium', q: false, unit: 'mL/L', value: 7, tex: 'C_{in}' },
        E: { name: 'fraction of the oxygen extracted', q: 'ratio', unit: '%', value: 80 }
      },
      note: 'Air holds about 209 mL of oxygen per litre; air-saturated water about 7 mL/L at 15 °C (less when warmer). Extraction: fish gills 70–90 %, a human lung about 25 %.',
      practice: { unknowns: ['VO2', 'Vw', 'E'] },
      stories: {
        VO2: 'A trout pumps {Vw} of water holding {Cin} of oxygen over its gills and extracts {E} of it. How much oxygen does it take up?',
        Vw: 'A fish needs {VO2} of oxygen from water holding {Cin} and extracts {E}. How much water must it pump?',
        E: 'An animal ventilates {Vw} of a medium holding {Cin} of oxygen and takes up {VO2}. What fraction does it extract?'
      }
    }
  ],
  examples: [
    {
      title: 'Why flatworms are flat',
      q: 'A flatworm 1 mm thick gets oxygen from both surfaces. How long does oxygen take to reach its middle? What if it were a round worm 1 cm across?',
      steps: [
        'The middle of the flatworm is 0.5 mm from the surface: $t = (5\\times10^{-4})^2/(2\\times2\\times10^{-9}) = 2.5\\times10^{-7}/4\\times10^{-9} = 63$ s.',
        'A round worm 1 cm across: 5 mm to the centre, $t = (5\\times10^{-3})^2/(4\\times10^{-9}) = 6250$ s — nearly two hours.',
        'A minute is fast enough for a slow animal; two hours is not. So animals without a circulation stay thin, flat or small.'
      ],
      a: 'About a minute for the flatworm; nearly two hours for a 1 cm round worm.'
    },
    {
      title: 'Breathing water versus breathing air',
      q: 'A resting person uses 250 mL of oxygen a minute. How much air must they breathe (extraction 25 %), and how much water would a fish with the same need have to pump (7 mL O₂ per litre, extraction 80 %)?',
      steps: [
        'Air: $\\dot V = 250/(209 \\times 0.25) = 4.8$ L/min — close to the measured 5–6 L/min.',
        'Water: $\\dot V = 250/(7 \\times 0.8) = 45$ L/min — 45 kg of water every minute.',
        'Moving 45 kg of a viscous liquid a minute is why real fish of that size need far less oxygen: they are ectotherms, and their metabolism is a small fraction of ours.'
      ],
      a: 'About 5 L of air a minute, but some 45 L of water.'
    },
    {
      title: 'Fick\'s law for a trout\'s gills',
      q: 'The gills of a 1 kg trout have an area of about 0.2 m² and a barrier 5 µm thick. With an oxygen concentration difference of 0.1 mM across it, how much oxygen can diffuse in? A resting trout at 15 °C uses about 100 mg of O₂ per hour.',
      steps: [
        '$J = D A \\Delta c/x = 2\\times10^{-9} \\times 0.2 \\times 0.1\\ \\mathrm{mol/m^3} / 5\\times10^{-6}\\ \\mathrm{m} = 8\\times10^{-6}$ mol/s.',
        'Need: 100 mg/h $= 3.1$ mmol/h $= 0.87\\ \\mu$mol/s.',
        'The gills can supply about nine times the resting need — the reserve that lets the fish swim hard.'
      ],
      a: 'About 8 µmol/s, roughly nine times its resting need.'
    }
  ],
  quiz: [
    { q: 'With equal flows of water and blood, why can a concurrent (same-direction) exchanger never take more than half the oxygen out of the water?', choices: ['The blood flows too fast', 'The two streams approach the same partial pressure, halfway, and then exchange stops', 'Haemoglobin cannot bind more oxygen', 'Water cannot hold more oxygen'], a: 1,
      why: 'In concurrent flow the gradient shrinks along the lamella until water and blood meet at a common value; with equal capacities that is the midpoint. In countercurrent flow a gradient remains everywhere.' },
    { q: 'How long does oxygen take to diffuse 100 µm through tissue ($D = 2\\times10^{-9}\\ \\mathrm{m^2/s}$)?', answer: 2.5, unit: 's', why: '$t = x^2/2D = (10^{-4})^2/(4\\times10^{-9}) = 2.5$ s — which is why no cell in an active tissue is more than a few tens of micrometres from a capillary.' },
    { q: 'An insect\'s blood carries most of the oxygen its tissues use, as ours does.', a: false,
      why: 'Insects deliver oxygen as a gas through tracheae and tracheoles right to their cells; their haemolymph plays almost no part.' },
    { q: 'If the area of an exchange surface doubles and its thickness also doubles, the rate of diffusion…', choices: ['doubles', 'quadruples', 'stays the same', 'halves'], a: 2,
      why: 'Rate ∝ A/x: doubling both leaves the ratio, and the rate, unchanged.' },
    { q: 'What lets a bird\'s blood leave its lungs with more oxygen than the air it breathes out?', choices: ['Its haemoglobin is different', 'Air flows one way through rigid lungs, and blood crosses the air stream at right angles', 'Birds breathe faster', 'Birds have more alveoli than mammals'], a: 1,
      why: 'One-way flow through the parabronchi with crosscurrent capillaries: some capillaries meet air that is still fresh. In a tidal lung blood can at best match the mixed alveolar air.' }
  ],
  problems: [
    { q: 'A fish needs 2 mL of oxygen a minute. The water holds 6 mL of oxygen per litre and its gills extract 80 % of it. How much water must it pump each minute?', answer: 0.42, unit: 'L/min', tol: 0.03, steps: ['$\\dot V = \\dot V_{O_2}/(C_{in} E) = 2/(6 \\times 0.8) = 0.42$ L/min.'] },
    { q: 'How long does oxygen take to diffuse 1 mm through water ($D = 2\\times10^{-9}\\ \\mathrm{m^2/s}$)? Give the answer in seconds.', answer: 250, unit: 's', tol: 0.02, steps: ['$t = (10^{-3})^2/(2 \\times 2\\times10^{-9}) = 250$ s — about four minutes.'] }
  ],
  applications: [
    'Fish farms and aquaria aerate their water; warm, still, nutrient-rich water can lose so much oxygen that fish suffocate.',
    'Membrane oxygenators for heart–lung machines and ECMO use countercurrent flow of blood and gas, like a gill.',
    'Palaeontologists link giant Carboniferous insects to high atmospheric oxygen, a test of the tracheal-limit idea.',
    'High-altitude flight and mountaineering physiology compare bird and mammal lungs.'
  ],
  history: 'Adolf Fick stated his law of diffusion in 1855. In 1910 August and Marie Krogh showed that the lungs take up oxygen by diffusion alone, settling a debate about whether they secrete it; August Krogh later won the 1920 Nobel Prize for his work on capillaries. G. M. Hughes described the countercurrent gill in the 1960s, and Knut Schmidt-Nielsen and others worked out the one-way flow of the bird lung.',
  sim: 'ani-gills'
},

{
  id: 'circulation-animals', parent: 'animal-systems', title: 'Circulatory systems compared', level: 2,
  short: 'Beyond a millimetre, animals move a fluid round the body in bulk. Insects and snails bathe their organs in an open circulation at low pressure; annelids, octopuses and vertebrates keep blood in closed vessels. Fish pump blood once round a single circuit; birds and mammals have four-chambered hearts and a double circulation — and heart rate falls with body size as M^−1/4.',
  keywords: ['circulatory system', 'open circulation', 'closed circulation', 'haemolymph', 'haemocoel', 'single circulation', 'double circulation', 'heart chambers', 'two-chambered heart', 'four-chambered heart', 'octopus hearts', 'haemocyanin', 'giraffe blood pressure', 'heart rate and body size', 'circulation time'],
  prereq: ['gas-exchange-animals', 'vertebrates', 'physics:hydrostatic-pressure'],
  related: ['scaling-allometry', 'thermoregulation-animals', 'invertebrates', 'muscles-movement', 'medicine:heart-anatomy', 'medicine:cardiac-output', 'medicine:hemodynamics', 'medicine:blood-pressure', 'physics:viscosity'],
  body: `
A sponge pumps seawater through its own body; a flatworm's gut branches so that no cell is far from food; a jellyfish is mostly jelly under a thin living skin. Beyond a millimetre or so, diffusion is not enough (see [[gas-exchange-animals]]), and animals move a fluid round the body in bulk — a **circulatory system**. Two designs evolved.

### Open and closed
In an **open circulation** — arthropods and most molluscs — a heart pumps **haemolymph** into vessels that end in open spaces, the haemocoel, where it bathes the organs directly and seeps back into the heart through pores. Pressure is low, from a few hundred pascals to a couple of kilopascals, flow is slow, and the fluid doubles as a hydraulic skeleton: a spider straightens its legs by blood pressure, having no extensor muscles at some of the joints. In insects the haemolymph carries food, hormones and immune cells but hardly any oxygen, which travels in the tracheae.

In a **closed circulation** — annelids, cephalopods and vertebrates — blood stays in vessels and exchanges through capillary walls. Pressures can be higher and the flow directed where it is needed: to working muscles and away from a resting gut. Squid and octopuses, fast predators, have closed circulations with three hearts, one for each gill and one for the body, and blue blood whose oxygen carrier, haemocyanin, contains copper.

### Single and double circuits
| Group | Heart | Circuit |
|---|---|---|
| Fish | 2 chambers in series (atrium, ventricle) | single: heart → gills → body → heart |
| Amphibians | 3 chambers (two atria, one ventricle) | double, with some mixing; the skin also exchanges gas |
| Lizards, snakes, turtles | 3 chambers, ventricle partly divided | double; blood can be shunted past the lungs during a dive |
| Crocodilians | 4 chambers, plus a link between the two aortas | double, with a controllable shunt |
| Birds and mammals | 4 chambers | fully double: lungs and body in separate circuits |

In a fish, blood passes through the fine gill capillaries before it reaches the body, so much of the pressure the heart makes is spent in the gills: a trout's ventral aorta runs at roughly 35–40 mmHg, the dorsal aorta beyond the gills at 25–30. A **double circulation** brings blood back to the heart after the lungs, so it can be pumped again at high pressure. In mammals the right ventricle drives the lungs at a mean of about 15 mmHg, gentle enough for their thin walls, and the left drives the body at about 95 mmHg ([[medicine:heart-anatomy]]). Separating the two sides also keeps oxygen-rich and oxygen-poor blood apart, which the high metabolism of endotherms demands.

### Pressure, height and giraffes
Every metre of blood column takes $\\Delta p = \\rho g h \\approx 10$ kPa, about 77 mmHg. A giraffe's brain sits some 2 m above its heart, so its mean arterial pressure at heart level is about twice ours — around 200 mmHg — driven by a thick-walled left ventricle, while tight skin on its legs stops fluid pooling in the feet. Tree-climbing snakes, likewise, have higher blood pressure and hearts nearer the head than sea snakes.

### Heart rate and body size
Heart rate falls with body size very regularly, as about the minus one-quarter power of mass: $f \\approx 241\\,M^{-1/4}$ beats per minute for resting mammals, with $M$ in kilograms. A 3 g shrew's heart beats about a thousand times a minute, a mouse's 600, a person's 70–80, an elephant's 30, and a diving blue whale's as slowly as two to ten. The heart is always about 0.6 % of body mass and stroke volume grows in proportion to mass, so cardiac output rises only as $M^{3/4}$ — just like metabolic rate: the circulation delivers oxygen in proportion to what the body burns (see [[scaling-allometry]]). A drop of blood takes about 6 seconds to go round a mouse, a minute to go round a person and two or three minutes to go round an elephant.

> [!key] Open circulations bathe the organs at low pressure; closed ones keep blood in vessels at high pressure. The double circulation of birds and mammals, with separate lung and body circuits, powers their high metabolism, and heart rate falls with body mass as $M^{-1/4}$.
`,
  ideas: [
    'Open circulations (arthropods, most molluscs) bathe the organs in haemolymph at low pressure; closed ones (annelids, cephalopods, vertebrates) keep blood in vessels.',
    'Fish have a single circuit: blood passes the gills and then the body on one push of a two-chambered heart.',
    'Birds and mammals have a four-chambered heart and a double circulation: low pressure to the lungs, high pressure to the body, no mixing.',
    'Lifting blood 1 m takes about 77 mmHg, so tall animals such as giraffes have high blood pressure.',
    'Resting heart rate scales as M^−1/4: about 600 per minute in a mouse, 30 in an elephant.'
  ],
  pitfalls: [
    'An open circulation is a primitive, failed design — It suits animals whose oxygen travels another way (insect tracheae) or who live slowly; insects are the most diverse animals on Earth.',
    'Three-chambered reptile hearts are just imperfect mammal hearts — The partly divided ventricle lets a turtle or lizard send blood past its lungs when it dives or holds its breath, which a fully divided heart cannot do.',
    'Small animals have fast hearts because their hearts are weak — Their hearts are the same fraction of body mass; they beat fast because small bodies burn more energy per gram (see scaling).'
  ],
  formulas: [
    {
      name: 'Resting heart rate and body mass (mammals)',
      expr: 'f = a*M^(-0.25)', tex: 'f = a\\,M^{-1/4}',
      vars: {
        f: { name: 'resting heart rate', q: 'frequency', unit: 'bpm' },
        a: { name: 'heart rate of a 1 kg mammal', q: 'frequency', unit: 'bpm', value: 241, fixed: true },
        M: { name: 'body mass', q: 'mass', unit: 'kg', value: 0.025 }
      },
      note: 'Stahl\'s allometric fit for resting mammals (1967). Individual species scatter around it; birds of the same mass have somewhat slower hearts but larger ones.',
      practice: { unknowns: ['f', 'M'] },
      stories: {
        f: 'Predict the resting heart rate of a mammal of {M}.',
        M: 'A mammal\'s resting heart beats at {f}. Roughly how heavy is it?'
      }
    },
    {
      name: 'Pressure to lift blood a height h',
      expr: 'dp = rho*g*h', tex: '\\Delta p = \\rho\\,g\\,h',
      vars: {
        dp: { name: 'extra pressure needed', q: 'pressure', unit: 'mmHg', tex: '\\Delta p' },
        rho: { name: 'density of blood', q: 'density', unit: 'kg/m³', value: 1050, tex: '\\rho' },
        g: { const: 'g' },
        h: { name: 'height of the head above the heart', q: 'length', unit: 'm', value: 2 }
      },
      note: 'Hydrostatics of a column of blood: about 77 mmHg per metre. The heart must supply this on top of the pressure the brain itself needs.',
      practice: { unknowns: ['dp', 'h'] },
      stories: {
        dp: 'A giraffe\'s brain is {h} above its heart. How much extra pressure does its heart need just to lift blood that high?',
        h: 'An extra pressure of {dp} can lift blood how high?'
      }
    },
    {
      name: 'Circulation time',
      expr: 't = Vb/Q', tex: 't = \\dfrac{V_b}{Q}',
      vars: {
        t: { name: 'time for the blood to go round once', q: 'time', unit: 's' },
        Vb: { name: 'blood volume', q: 'volume', unit: 'L', value: 5, tex: 'V_b' },
        Q: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', value: 5 }
      },
      note: 'The average time for the whole blood volume to pass through the heart. Blood volume is about 7 % of body mass in mammals; cardiac output grows as M^3/4, so circulation time grows as M^1/4.',
      practice: { unknowns: ['t', 'Q'] },
      stories: {
        t: 'An animal has {Vb} of blood and a cardiac output of {Q}. How long does its blood take to go round once?',
        Q: 'An animal with {Vb} of blood has a circulation time of {t}. What is its cardiac output?'
      }
    }
  ],
  examples: [
    {
      title: 'Why a giraffe needs high blood pressure',
      q: 'A giraffe\'s brain is 2 m above its heart. If the brain needs a mean arterial pressure of about 50 mmHg, what mean pressure must the heart produce? (Blood density 1050 kg/m³.)',
      steps: [
        '$\\Delta p = \\rho g h = 1050 \\times 9.81 \\times 2 = 20\\,600$ Pa.',
        'In mmHg: $20\\,600/133.3 = 155$ mmHg.',
        'Heart-level pressure $\\approx 155 + 50 \\approx 205$ mmHg — close to the roughly 200 mmHg measured, about twice a person\'s.'
      ],
      a: 'About 200 mmHg at heart level.'
    },
    {
      title: 'Predicting heart rates from a shrew to an elephant',
      q: 'Use $f = 241\\,M^{-1/4}$ bpm to predict the resting heart rates of a 3 g shrew, a 70 kg person and a 4000 kg elephant.',
      steps: [
        'Shrew: $0.003^{-1/4} = 4.27$, so $f = 1030$ per minute.',
        'Person: $70^{-1/4} = 0.346$, so $f = 83$ per minute.',
        'Elephant: $4000^{-1/4} = 0.126$, so $f = 30$ per minute.',
        'Measured values are about 1000, 70 and 30: the quarter-power rule spans a factor of a million in mass.'
      ],
      a: 'About 1030, 83 and 30 beats per minute.'
    },
    {
      title: 'How long does blood take to go round?',
      q: 'A 25 g mouse has 1.8 mL of blood and a cardiac output of 16 mL/min; an elephant has about 280 L and 110 L/min. Compare their circulation times.',
      steps: [
        'Mouse: $t = 1.8/16 = 0.11$ min $= 6.8$ s.',
        'Elephant: $t = 280/110 = 2.5$ min $= 150$ s.',
        'The ratio, about 22, is close to the mass ratio to the quarter power, $(160\\,000)^{1/4} = 20$: physiological time runs slower in big animals.'
      ],
      a: 'About 7 s for the mouse and 2.5 min for the elephant.'
    }
  ],
  quiz: [
    { q: 'In an open circulation the blood never leaves the vessels.', a: false,
      why: 'That is a closed circulation. In an open one the vessels end in open spaces (the haemocoel) where haemolymph bathes the organs directly.' },
    { q: 'What limits the blood pressure reaching a fish\'s body?', choices: ['Its heart has only one ventricle, which is weak', 'Blood passes through the gill capillaries first and loses much of its pressure there', 'Water pressure squeezes the vessels', 'Fish blood is too viscous'], a: 1,
      why: 'In a single circuit the gill capillaries sit between the heart and the body, and their resistance uses up much of the pressure. A double circuit returns blood to the heart after the lungs to be pumped again.' },
    { q: 'Using $f = 241\\,M^{-1/4}$, predict the resting heart rate of a 16 kg dog (beats per minute).', answer: 120, unit: 'bpm', why: '$16^{1/4} = 2$, so $f = 241/2 \\approx 120$ per minute.' },
    { q: 'Which animal has three hearts and blue, copper-based blood?', choices: ['a lobster', 'an octopus', 'an earthworm', 'a frog'], a: 1,
      why: 'Cephalopods have two gill hearts and one body heart, and haemocyanin, which is blue when it carries oxygen.' },
    { q: 'How much pressure is needed to lift blood 0.5 m above the heart (density 1050 kg/m³)?', answer: 38.6, unit: 'mmHg', why: '$\\rho g h = 1050 \\times 9.81 \\times 0.5 = 5150$ Pa $\\approx 38.6$ mmHg.' }
  ],
  problems: [
    { q: 'Predict the resting heart rate of a 625 kg horse from $f = 241\\,M^{-1/4}$ bpm.', answer: 48, unit: 'bpm', tol: 0.03, steps: ['$625^{1/4} = 5$, so $f = 241/5 = 48$ per minute. (Horses at rest are often slower still, 30–40.)'] },
    { q: 'A dog has 1.6 L of blood and a cardiac output of 3.2 L/min. How many seconds does its blood take to go round once?', answer: 30, unit: 's', tol: 0.02, steps: ['$t = V_b/Q = 1.6/3.2 = 0.5$ min $= 30$ s.'] }
  ],
  applications: [
    'Veterinarians use body-size rules to judge normal heart rates and drug doses across species.',
    'Studies of giraffes, diving seals and tree snakes inform human problems such as fainting on standing, hypertension and heart failure.',
    'The blue, haemocyanin-rich blood of horseshoe crabs contains cells that yield a test for bacterial toxins in injectable medicines; the crabs are bled and returned to the sea, and synthetic alternatives now reduce the need, in the spirit of the 3Rs (replace, reduce, refine).',
    'Designers of artificial hearts and pumps compare the pressures and flows of different circulations.'
  ],
  history: 'William Harvey showed in 1628 that blood circulates, pumped by the heart. Marcello Malpighi saw the capillaries in a frog\'s lung in 1661, completing the circuit. Comparative physiologists of the twentieth century — among them August Krogh and Kjell Johansen — worked out the open, single and double circulations, and the giraffe\'s pressures were first measured in the 1950s.',
  sim: { id: 'ani-allometry', params: { show: 'heart' } }
},

{
  id: 'osmoregulation', parent: 'animal-systems', title: 'Osmoregulation and excretion', level: 2,
  short: 'Keeping the body\'s water and salts in balance, and getting rid of nitrogen waste: freshwater fish fight a flood of water, marine fish its loss, land animals drought. Nitrogen leaves as ammonia, urea or uric acid depending on water supply, and mammals concentrate their urine with the countercurrent loop of Henle — longest in desert rodents.',
  keywords: ['osmoregulation', 'excretion', 'osmoconformer', 'osmoregulator', 'freshwater fish', 'marine fish', 'ionocytes', 'chloride cells', 'salt gland', 'ammonia', 'urea', 'uric acid', 'nitrogenous waste', 'kidney', 'loop of Henle', 'countercurrent multiplier', 'kangaroo rat', 'metabolic water', 'urine concentration', 'osmolality'],
  prereq: ['diffusion-osmosis', 'active-transport', 'animal-homeostasis', 'chemistry:osmotic-pressure'],
  related: ['water-potential', 'thermoregulation-animals', 'animal-hormones', 'biomes', 'medicine:urine-concentration', 'medicine:kidney-anatomy', 'medicine:electrolytes', 'medicine:body-fluids', 'chemistry:colligative-properties'],
  body: `
A salmon hatches in a river, feeds for years at sea and returns to the river to spawn — moving between water with almost no salt and water three times saltier than its blood, while its body fluids stay at 300–400 mOsm/kg. Holding the concentration of the body fluids against the pull of the surroundings is **osmoregulation**; getting rid of the nitrogen from broken-down protein without losing too much water is **excretion**. The two problems are solved together, and differently in the sea, in fresh water and on land.

### Osmoconformers and osmoregulators
Seawater is about 1000–1100 mOsm/kg. Most marine invertebrates — jellyfish, mussels, octopuses, many crabs — and the hagfishes simply match it: they are **osmoconformers**, although they still regulate individual ions. Sharks and rays are nearly isosmotic in their own way: their salts are only about half as concentrated as seawater, but they hold some 350 mM of **urea** in their blood, with trimethylamine oxide (TMAO) to protect their proteins from it, so water does not leave them; surplus salt goes out through a **rectal gland**.

Bony fish are **osmoregulators**, and their problems are opposite in the two waters:

| | Freshwater fish (blood ≈ 300 mOsm/kg) | Marine fish (blood ≈ 400 mOsm/kg) |
|---|---|---|
| Water | gains water by osmosis through the gills | loses water by osmosis |
| Salt | loses salt by diffusion | gains salt by diffusion and in food |
| Drinking | hardly at all | drinks seawater continually |
| Urine | large volumes of very dilute urine | little urine, about as concentrated as blood |
| Gills | ionocytes actively take up Na⁺ and Cl⁻ | ionocytes actively secrete Na⁺ and Cl⁻ |

A salmon switches between the modes, rebuilding its gill ionocytes under the control of hormones — cortisol and growth hormone for the sea, prolactin for fresh water (see [[animal-hormones]]). Seabirds and marine turtles, which swallow seawater with their prey, get rid of the salt through **salt glands** near the eyes that secrete a fluid up to twice as salty as the sea.

### Ammonia, urea or uric acid
Breaking down proteins releases nitrogen as **ammonia**, which is toxic but very soluble. Animals choose its form according to their water supply:

| Waste | Who | Water to excrete 1 g of nitrogen | Cost |
|---|---|---|---|
| ammonia | bony fish, tadpoles, many aquatic invertebrates | about 300–500 mL | none — it diffuses out through the gills |
| urea | mammals, adult amphibians, sharks | about 50 mL | about 4 ATP per urea (the urea cycle) |
| uric acid | birds, reptiles, insects, land snails | about 10 mL — excreted as a paste | more ATP, almost no water |

A frog switches from ammonia to urea at metamorphosis. Uric acid also suits eggs laid on land: the embryo can store it as harmless crystals inside the shell.

### Kidneys and the loop of Henle
Vertebrate kidneys filter the blood and then reabsorb what is useful. Only mammals, and to a smaller degree birds, can make urine **more concentrated than their blood**, and they do it with the **loop of Henle**, a hairpin of tubule dipping into the kidney's medulla. Its ascending limb pumps salt out without letting water follow; the descending limb loses water to the salty surroundings; and because fluid flows down one limb and up the other, this small difference at each level is multiplied into a gradient running from 300 mOsm/kg at the cortex to well over 1000 at the tip — the **countercurrent multiplier**. Urine flowing down the collecting duct, made permeable to water by the hormone ADH, gives up water to the gradient and leaves nearly as concentrated as the tip.

The longer the loops, the steeper the gradient, and desert rodents have extraordinarily long loops in a thick medulla:

| Mammal | Maximum urine concentration (mOsm/kg) | Urine ÷ plasma |
|---|---|---|
| beaver | about 500 | 1.7 |
| human | about 1200 | 4 |
| dog | about 2400 | 8 |
| kangaroo rat | about 5500 | 18 |
| Australian hopping mouse | about 9400 | 30 |

A kangaroo rat can live without ever drinking. It eats dry seeds and gets most of its water by oxidising their starch and fat (**metabolic water**), spends the day in a humid burrow, and makes urine nearly five times more concentrated than ours and almost dry droppings. The human kidney in detail is in [[medicine:urine-concentration]].

> [!key] Freshwater animals fight a flood of water and a loss of salt, marine ones the reverse, land animals the loss of water. Nitrogen leaves as ammonia where water is plentiful and as urea or uric acid where it is not. The loop of Henle's countercurrent multiplier lets mammals make concentrated urine — and longer loops make it more concentrated.
`,
  ideas: [
    'Osmoconformers match seawater; osmoregulators hold their fluids at their own concentration and pay for it with active transport.',
    'Freshwater fish gain water and lose salt: they drink little, make dilute urine and pump salt in at the gills. Marine fish do the opposite.',
    'Ammonia needs the most water to excrete, urea less, uric acid almost none — the choice follows the water supply.',
    'The loop of Henle multiplies a small difference at each level into a large gradient; longer loops give more concentrated urine.',
    'Desert rodents survive on metabolic water and urine up to 30 times as concentrated as their plasma.'
  ],
  pitfalls: [
    'Marine fish do not need to drink because they live in water — Seawater draws water out of them by osmosis, so they drink it continually and pump the extra salt out through their gills.',
    'Uric acid is used because it is cheaper to make — It costs more energy than urea; its advantage is that it can be excreted with almost no water.',
    'The loop of Henle makes concentrated urine by pumping water — No cell pumps water. The loop pumps salt, and water follows passively down the osmotic gradient that the salt creates.'
  ],
  formulas: [
    {
      name: 'Osmotic pressure of a solution (van \'t Hoff)',
      expr: 'Posm = C*R*T', tex: '\\Pi = c_{osm}\\,R\\,T',
      vars: {
        Posm: { name: 'osmotic pressure', q: 'pressure', unit: 'MPa', tex: '\\Pi' },
        C: { name: 'osmotic concentration', q: 'osmol', unit: 'mOsm/L', value: 1000, tex: 'c_{osm}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 15 }
      },
      note: 'Ideal dilute solutions; 1 mOsm/L is 1 mol of particles per cubic metre. The difference in osmotic pressure between a fish\'s blood and the water around it drives water in or out.',
      practice: { unknowns: ['Posm', 'C'] },
      stories: {
        Posm: 'What is the osmotic pressure of seawater of {C} at {T}?',
        C: 'A body fluid has an osmotic pressure of {Posm} at {T}. What is its osmotic concentration?'
      }
    },
    {
      name: 'Urine volume needed to excrete a solute load',
      expr: 'V = S/U', tex: 'V = \\dfrac{S}{U_{osm}}',
      vars: {
        V: { name: 'daily urine volume', q: false, unit: 'L' },
        S: { name: 'solutes to excrete each day', q: false, unit: 'mOsm', value: 600 },
        U: { name: 'urine concentration', q: 'osmol', unit: 'mOsm/kg', value: 1200, tex: 'U_{osm}' }
      },
      note: 'The diet fixes the solute load (urea from protein, and salts); the kidney\'s maximum concentration then fixes the least water that must be lost in urine.',
      practice: { unknowns: ['V', 'U'] },
      stories: {
        V: 'A person must excrete {S} of solutes a day and can concentrate urine to {U}. What is the smallest daily urine volume?',
        U: 'An animal excretes {S} of solutes in {V} of urine a day. How concentrated is its urine?'
      }
    },
    {
      name: 'Metabolic water from food',
      expr: 'W = 0.56*mc + 1.07*mf + 0.40*mp', tex: 'W = 0.56\\,m_c + 1.07\\,m_f + 0.40\\,m_p',
      vars: {
        W: { name: 'water made by oxidising the food', q: 'mass', unit: 'g' },
        mc: { name: 'starch or sugar oxidised', q: 'mass', unit: 'g', value: 70, tex: 'm_c' },
        mf: { name: 'fat oxidised', q: 'mass', unit: 'g', value: 2, tex: 'm_f' },
        mp: { name: 'protein oxidised', q: 'mass', unit: 'g', value: 10, tex: 'm_p' }
      },
      note: 'Grams of water per gram oxidised: 0.56 for starch, 1.07 for fat, about 0.40 for protein when its nitrogen leaves as urea (about 0.50 as uric acid).',
      practice: { unknowns: ['W'] },
      stories: {
        W: 'A kangaroo rat oxidises {mc} of starch, {mf} of fat and {mp} of protein from its seeds. How much water does that make?'
      }
    }
  ],
  examples: [
    {
      title: 'The pull of seawater on a fish',
      q: 'Seawater is about 1000 mOsm/L and a marine bony fish\'s blood about 400 mOsm/L. What osmotic pressure difference draws water out of the fish at 15 °C?',
      steps: [
        'Seawater: $\\Pi = 1000\\ \\mathrm{mol/m^3} \\times 8.314 \\times 288.15 = 2.40$ MPa.',
        'Blood: $400 \\times 8.314 \\times 288.15 = 0.96$ MPa.',
        'Difference: about 1.44 MPa — more than 14 atmospheres — acting across gills only a few micrometres thick. The fish replaces the water by drinking and pumps out the salt.'
      ],
      a: 'About 1.4 MPa.'
    },
    {
      title: 'How much urine must be made?',
      q: 'A person eating a typical diet must excrete about 600 mOsm of solutes a day. What is the least urine they can make, and what would it be with a beaver\'s kidney (maximum 500 mOsm/kg) or a kangaroo rat\'s (5500 mOsm/kg)?',
      steps: [
        'Human: $V = 600/1200 = 0.5$ L a day.',
        'Beaver kidney: $600/500 = 1.2$ L — fine for an animal that lives in water.',
        'Kangaroo-rat kidney: $600/5500 = 0.11$ L — a tenth of a litre.'
      ],
      a: '0.5 L, 1.2 L and 0.11 L a day.'
    },
    {
      title: 'Water from dry seeds',
      q: 'Knut Schmidt-Nielsen fed kangaroo rats on dry barley. 100 g of barley contains about 70 g of starch, 2 g of fat and 10 g of protein (plus about 10 g of water). How much metabolic water does it yield?',
      steps: [
        '$W = 0.56 \\times 70 + 1.07 \\times 2 + 0.40 \\times 10 = 39.2 + 2.1 + 4.0 = 45$ g.',
        'With the 10 g already in the seeds, the rat gets about 55 g of water from 100 g of "dry" food.',
        'Its concentrated urine, dry droppings and cool humid burrow keep the losses below that — so it never needs to drink.'
      ],
      a: 'About 45 g of metabolic water (55 g of water in all).'
    }
  ],
  quiz: [
    { q: 'Which describes a freshwater bony fish?', choices: ['Drinks a lot and makes little urine', 'Drinks little, makes a lot of dilute urine and takes up salt actively at its gills', 'Matches the concentration of the water around it', 'Excretes its nitrogen as uric acid'], a: 1,
      why: 'Water floods in by osmosis and salt leaks out, so it gets rid of water as dilute urine and pumps Na⁺ and Cl⁻ in through gill ionocytes.' },
    { q: 'Sharks keep their blood salts as concentrated as seawater.', a: false,
      why: 'Their salts are only about half as concentrated; they make up the difference with about 350 mM of urea and some TMAO.' },
    { q: 'Birds excrete nitrogen as uric acid mainly because…', choices: ['it is the cheapest waste to make', 'it can be excreted with very little water, and stored harmlessly inside an egg', 'it is less toxic to their kidneys than ammonia', 'they cannot make urea'], a: 1,
      why: 'Uric acid costs more energy than urea but saves water, and an embryo sealed in a shelled egg can pile it up as crystals.' },
    { q: 'A person must excrete 900 mOsm of solutes a day and can concentrate urine to 1200 mOsm/kg. What is the smallest daily urine volume in litres?', answer: 0.75, unit: 'L', why: '$V = S/U = 900/1200 = 0.75$ L.' },
    { q: 'Compared with a beaver, a kangaroo rat\'s loops of Henle are…', choices: ['shorter, so less water is lost', 'much longer, building a steeper gradient in the medulla', 'the same length but more leaky', 'absent'], a: 1,
      why: 'Longer loops in a thicker medulla multiply the gradient further, so urine can be concentrated more — about 5500 mOsm/kg against a beaver\'s 500.' }
  ],
  problems: [
    { q: 'What is the osmotic pressure of a fish\'s blood at 380 mOsm/L and 10 °C, in MPa?', answer: 0.894, unit: 'MPa', tol: 0.02, steps: ['$\\Pi = cRT = 380 \\times 8.314 \\times 283.15 = 8.95\\times10^5$ Pa $\\approx 0.89$ MPa.'] },
    { q: 'How much metabolic water does a bird make by oxidising 10 g of fat on a night-time migration flight?', answer: 10.7, unit: 'g', tol: 0.02, steps: ['$W = 1.07 \\times 10 = 10.7$ g — fat is the best fuel for water as well as for energy.'] }
  ],
  applications: [
    'Aquaculture moves salmon smolts from fresh to salt water only when their gills have switched over.',
    'Conservation of desert animals, and the design of rodent studies of kidney disease.',
    'Understanding why drinking seawater dehydrates people: our kidneys cannot make urine saltier than seawater.',
    'The same countercurrent principle is used in engineering, for example in heat exchangers and dialysis machines.'
  ],
  history: 'Homer Smith compared the kidneys of fish, amphibians and mammals in the 1930s and 1950s. Werner Kuhn proposed the countercurrent multiplier in 1942, and Carl Gottschalk confirmed it by micropuncture in the 1950s. Knut and Bodil Schmidt-Nielsen showed in the late 1940s and 1950s that kangaroo rats live without drinking.',
  sim: 'ani-loop'
},

{
  id: 'animal-nervous-systems', parent: 'animal-systems', title: 'Nervous systems compared', level: 2,
  short: 'From the diffuse nerve net of a jellyfish to ganglia, brains and spinal cords, all nervous systems use the same neurons, impulses and transmitters. Speed depends on the axon: giant unmyelinated axons in squid reach about 25 m/s, while thin myelinated vertebrate fibres jump from node to node at up to 120 m/s.',
  keywords: ['nervous system', 'nerve net', 'ganglia', 'cephalisation', 'brain', 'ventral nerve cord', 'neuron numbers', 'conduction velocity', 'myelin', 'saltatory conduction', 'nodes of Ranvier', 'squid giant axon', 'axon diameter', 'C. elegans connectome', 'octopus brain'],
  prereq: ['cell-signalling', 'active-transport', 'invertebrates'],
  related: ['animal-hormones', 'muscles-movement', 'innate-learned', 'model-organisms', 'medicine:action-potential', 'medicine:neurons', 'medicine:synapses', 'medicine:multiple-sclerosis', 'physics:rc-circuits', 'physics:capacitance'],
  body: `
A jellyfish has no brain, yet it swims, catches prey and flinches from harm. An octopus, with half a billion neurons, opens jars and recognises individual people. Nervous systems do the same job everywhere — carry signals quickly from sensors to effectors and combine them on the way — with the same parts: neurons that fire action potentials and talk across synapses with transmitters such as acetylcholine, glutamate and serotonin, shared by jellyfish and people alike. What differs is how the neurons are arranged, and how fast their axons conduct.

### From nerve nets to brains
| Animal | Neurons (approximate) | Arrangement |
|---|---|---|
| *Hydra* (a cnidarian) | hundreds to a few thousand | **nerve net**: a diffuse mesh with no centre |
| starfish | — | a nerve ring and five radial nerves |
| *C. elegans* (a nematode) | 302 | nerve ring and ventral cord; every connection mapped |
| fruit fly | about 140 000 in the brain | brain and fused ventral ganglia; full wiring diagram 2024 |
| honeybee | about 1 million | brain with mushroom bodies for learning |
| octopus | about 500 million | two-thirds of them in the arms |
| mouse | about 70 million | brain and spinal cord |
| human | about 86 billion | brain and spinal cord |

Animals that move head-first — flatworms, annelids, arthropods, vertebrates — gather neurons and sense organs at the front: **cephalisation**. Earthworms and insects have a **ventral** nerve cord with a pair of **ganglia** in each segment, able to run a leg or a segment by themselves; vertebrates have a hollow **dorsal** cord. A cockroach can walk without its head, because the walking circuits are in the ganglia of its thorax.

### How fast? Diameter and myelin
An impulse spreads along an axon because current from the active patch flows ahead inside the axon and charges the next patch of membrane to threshold ([[medicine:action-potential]]). A wider axon has less internal resistance, so the current reaches further and the impulse is faster — but only as the square root of the diameter, $v \\propto \\sqrt d$. Invertebrates that need speed build **giant axons**: the squid's, which fires its jet escape, is up to 1 mm across and conducts at about 20–25 m/s. It was big enough for Hodgkin and Huxley to push a wire inside it in 1939 and to work out the ionic basis of the nerve impulse.

Vertebrates found a better answer: **myelin**, many turns of glial membrane wrapped round the axon, which cuts the leak of current and the capacitance of the membrane about a hundredfold. The impulse only has to be regenerated at the **nodes of Ranvier**, gaps about 1 µm long spaced about a hundred fibre diameters apart, and it jumps from node to node — **saltatory conduction**. Speed then grows in proportion to diameter, about 6 m/s per micrometre:

| Fibre | Diameter | Speed |
|---|---|---|
| unmyelinated pain fibre (C) | about 1 µm | about 1 m/s |
| squid giant axon, unmyelinated | 500 µm | about 25 m/s |
| myelinated motor fibre (Aα) | 12–20 µm | 70–120 m/s |

A 10 µm myelinated fibre outruns a squid giant axon fifty times its width, and uses far less energy, because ions cross the membrane only at the nodes. A human sciatic nerve carries thousands of fast fibres; built from bare axons of the same speed it would be tens of centimetres thick. A few invertebrates — certain shrimps, copepods and annelids — evolved myelin-like sheaths too, but it was the vertebrate invention that made large, fast animals possible. Losing it in disease slows or blocks conduction ([[medicine:multiple-sclerosis]]).

> [!key] Nerve nets, ganglia and brains are different arrangements of the same neurons and transmitters. In bare axons speed grows with the square root of the diameter — hence giant axons; in myelinated ones it grows in proportion to the diameter: about 1 m/s against 100 m/s for fibres of ordinary size.
`,
  ideas: [
    'All animal nervous systems share neurons, action potentials, synapses and many transmitters; they differ in arrangement.',
    'Nerve nets (cnidarians) have no centre; segmented animals have ganglia in each segment; head-first animals concentrate them into a brain.',
    'In unmyelinated axons conduction speed grows as the square root of diameter, which is why squid evolved giant axons.',
    'Myelin makes the impulse jump between nodes of Ranvier; speed then grows in proportion to diameter, about 6 m/s per micrometre.',
    'Myelin saves space and energy as well as time, which made large, fast vertebrates possible.'
  ],
  pitfalls: [
    'Doubling an axon\'s diameter doubles its speed — Only for myelinated fibres. A bare axon must be four times as wide to go twice as fast.',
    'Animals without a brain cannot behave in complex ways — Jellyfish swim, hunt and avoid harm with a nerve net, and octopus arms carry out much of their own control.',
    'Myelin speeds conduction by making the impulse travel along the sheath — The sheath is an insulator; the impulse is regenerated only at the bare nodes and current flows passively and very quickly inside the axon between them.'
  ],
  formulas: [
    {
      name: 'Speed of unmyelinated axons: the square-root rule',
      expr: 'v2 = v1*sqrt(d2/d1)', tex: 'v_2 = v_1\\,\\sqrt{d_2/d_1}',
      vars: {
        v2: { name: 'speed of the second axon', q: 'speed', unit: 'm/s', tex: 'v_2' },
        v1: { name: 'speed of the first axon', q: 'speed', unit: 'm/s', value: 25, tex: 'v_1' },
        d1: { name: 'diameter of the first axon', q: 'length', unit: 'µm', value: 500, tex: 'd_1' },
        d2: { name: 'diameter of the second axon', q: 'length', unit: 'µm', value: 1, tex: 'd_2' }
      },
      note: 'From cable theory: the length the current spreads ahead grows as √d, so speed does too. Same temperature and membrane properties assumed.',
      practice: { unknowns: ['v2', 'd2'] },
      stories: {
        v2: 'A squid giant axon {d1} wide conducts at {v1}. How fast does an unmyelinated axon {d2} wide conduct?',
        d2: 'A squid giant axon {d1} wide conducts at {v1}. How wide must an unmyelinated axon be to conduct at {v2}?'
      }
    },
    {
      name: 'Speed of myelinated fibres (Hursh\'s rule)',
      expr: 'v = k*d', tex: 'v = k\\,d',
      vars: {
        v: { name: 'conduction speed', q: false, unit: 'm/s' },
        k: { name: 'speed per micrometre of fibre diameter', q: false, unit: '(m/s)/µm', value: 6 },
        d: { name: 'fibre diameter, including the myelin', q: false, unit: 'µm', value: 10 }
      },
      note: 'Hursh (1939) found about 6 m/s per µm in mammalian nerves at body temperature. Colder animals conduct more slowly.',
      practice: { unknowns: ['v', 'd'] },
      stories: {
        v: 'How fast does a myelinated fibre {d} wide conduct, at {k}?',
        d: 'A mammal\'s motor fibre conducts at {v}. At {k}, how wide is it?'
      }
    },
    {
      name: 'Time for an impulse to travel a nerve',
      expr: 't = L/v', tex: 't = \\dfrac{L}{v}',
      vars: {
        t: { name: 'conduction time', q: 'time', unit: 'ms' },
        L: { name: 'length of the nerve', q: 'length', unit: 'm', value: 2 },
        v: { name: 'conduction speed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'Real reaction times add the delays at synapses (about 0.5 ms each), in the spinal cord or brain, and in the muscle.',
      practice: { unknowns: ['t', 'v'] },
      stories: {
        t: 'A giraffe\'s nerve from hoof to spinal cord is {L} long and conducts at {v}. How long does a signal take?',
        v: 'An impulse takes {t} to travel {L} of nerve. How fast does the nerve conduct?'
      }
    }
  ],
  examples: [
    {
      title: 'Matching myelin with a bare axon',
      q: 'A squid giant axon 500 µm wide conducts at 25 m/s. How wide would an unmyelinated axon have to be to match a 10 µm myelinated fibre at 60 m/s?',
      steps: [
        'From $v_2 = v_1\\sqrt{d_2/d_1}$: $d_2 = d_1 (v_2/v_1)^2$.',
        '$d_2 = 500 \\times (60/25)^2 = 500 \\times 5.76 = 2880$ µm — nearly 3 mm.',
        'That is almost 300 times the diameter and some 80 000 times the cross-section of the myelinated fibre.'
      ],
      a: 'About 2.9 mm across.'
    },
    {
      title: 'A giraffe steps on a thorn',
      q: 'The nerve from a giraffe\'s hoof to its spinal cord is about 2 m long. How long does the signal take in a myelinated fibre at 60 m/s, and in an unmyelinated one at 1 m/s?',
      steps: [
        'Myelinated: $t = 2/60 = 0.033$ s $= 33$ ms.',
        'Unmyelinated: $t = 2/1 = 2$ s.',
        'Fast touch and motor signals use myelinated fibres; the dull, slow pain carried by thin C fibres really does arrive a second or more later in a large animal.'
      ],
      a: '33 ms myelinated, 2 s unmyelinated.'
    }
  ],
  quiz: [
    { q: 'Which animal has a nervous system without any centre — a nerve net?', choices: ['an earthworm', 'a Hydra', 'a cockroach', 'an octopus'], a: 1,
      why: 'Cnidarians such as Hydra and jellyfish have diffuse nerve nets. Earthworms and insects have ganglia and a ventral cord; octopuses have large brains.' },
    { q: 'By Hursh\'s rule of about 6 m/s per micrometre, how fast does a 15 µm myelinated fibre conduct?', answer: 90, unit: 'm/s', why: '$v = 6 \\times 15 = 90$ m/s.' },
    { q: 'Doubling the diameter of an unmyelinated axon doubles its conduction speed.', a: false,
      why: 'Speed grows as the square root of diameter: doubling the diameter raises it by √2, about 1.4 times.' },
    { q: 'Why can a headless cockroach still walk?', choices: ['Its brain is in its abdomen', 'Each segment\'s ganglia contain the circuits that coordinate its legs', 'Its legs are driven by hormones', 'It breathes through its legs'], a: 1,
      why: 'Invertebrate ganglia hold local circuits: the thoracic ganglia can generate walking movements without commands from the head.' },
    { q: 'Besides speed, what does myelin save?', choices: ['Only oxygen', 'Space and energy: thin fibres are enough, and ions cross only at the nodes', 'Neurotransmitter', 'Nothing — it costs more energy per impulse'], a: 1,
      why: 'A myelinated nerve packs many fast fibres into a small cross-section, and far fewer ions have to be pumped back after each impulse.' }
  ],
  problems: [
    { q: 'An unmyelinated axon 1 µm wide conducts at 1 m/s. How fast does one 4 µm wide conduct?', answer: 2, unit: 'm/s', tol: 0.02, steps: ['$v_2 = 1 \\times \\sqrt{4/1} = 2$ m/s.'] },
    { q: 'How long, in milliseconds, does an impulse take to travel 1.5 m of nerve at 90 m/s?', answer: 16.7, unit: 'ms', tol: 0.02, steps: ['$t = 1.5/90 = 0.0167$ s $= 16.7$ ms.'] }
  ],
  applications: [
    'Nerve conduction studies measure the speed of human nerves to detect damage to myelin or axons.',
    'The squid giant axon and the 302-neuron worm *C. elegans* remain key model systems in neuroscience.',
    'Insect and octopus nervous systems inspire decentralised control in robotics.',
    'Neurotoxins used in pest control and medicine act on the channels and transmitters shared across animals.'
  ],
  history: 'John Z. Young showed in 1936 that the squid\'s giant fibres are single axons. Alan Hodgkin and Andrew Huxley recorded from inside one in 1939 and explained the action potential in 1952 (Nobel Prize 1963). Ichiji Tasaki demonstrated saltatory conduction in frog nerve fibres around 1939. The wiring of *C. elegans* was mapped in 1986 and that of the fruit-fly brain in 2024.',
  sim: 'ani-nerve'
},

{
  id: 'animal-hormones', parent: 'animal-systems', title: 'Hormones in animals', level: 2,
  short: 'Hormones are chemical messages carried in the blood to every cell with the right receptor: slower than nerves, but far-reaching and long-lasting. Insects moult and metamorphose under ecdysone and juvenile hormone, tadpoles become frogs under thyroid hormone, and the same hormone families take on new jobs across the animal kingdom.',
  keywords: ['hormone', 'endocrine', 'neurosecretion', 'ecdysone', '20-hydroxyecdysone', 'juvenile hormone', 'PTTH', 'moulting', 'ecdysis', 'metamorphosis', 'instar', "Dyar's rule", 'thyroid hormone', 'prolactin', 'steroid hormone', 'peptide hormone', 'half-life', 'insect growth regulators'],
  prereq: ['cell-signalling', 'animal-homeostasis', 'eukaryotic-regulation'],
  related: ['animal-development', 'animal-reproduction', 'osmoregulation', 'plant-hormones', 'biological-rhythms', 'invertebrates', 'apoptosis', 'medicine:endocrine-system', 'medicine:hormone-feedback', 'medicine:thyroid'],
  body: `
A caterpillar grows by shedding its skin four or five times, then one day stops eating, spins a cocoon and breaks down most of its body to rebuild it as a moth. A tadpole absorbs its tail and grows legs. A young salmon about to go to sea rebuilds its gills. Each change is ordered by **hormones** — chemical messengers released into the blood or haemolymph that act on distant cells carrying the right receptors. Nerves are fast and targeted; hormones are slower, reach every cell, and can act for days.

### Three kinds of messenger
- **Peptides and proteins** (insulin, growth hormone, prolactin, the insect brain hormone PTTH) dissolve in blood and act on receptors in the cell membrane, triggering cascades of second messengers that amplify the signal thousands of times ([[cell-signalling]]).
- **Steroids** (cortisol, testosterone, oestrogen, the insect moulting hormone ecdysone) are made from cholesterol, cross membranes and bind receptors inside the cell that switch genes on and off ([[eukaryotic-regulation]]). Their effects take hours and last days.
- **Amines and terpenoids** (adrenaline, thyroid hormone, the insect juvenile hormone) behave like one or the other.

Many hormones are ancient. Insulin-like peptides regulate growth in worms and flies; the thyroid hormone that makes a tadpole into a frog also turns a flounder's symmetrical larva into a flatfish with both eyes on one side. **Neurosecretory cells** — neurons that release hormones into the blood — join the nervous and endocrine systems in every group: the hypothalamus in vertebrates, clusters of brain cells in insects, the X-organ in the eyestalk of crabs.

### Insects: moulting and metamorphosis
An insect's cuticle cannot stretch much, so a larva grows in steps, moulting between **instars**; its head capsule widens by a nearly constant factor each time, often about 1.4 (**Dyar's rule**, 1890). Three hormones time the process:

1. The brain releases **PTTH** (prothoracicotropic hormone) once the larva has grown enough.
2. PTTH makes the prothoracic glands release **ecdysone**, which the tissues convert to 20-hydroxyecdysone. Its pulse starts the moult: the epidermis detaches from the old cuticle and secretes a new one beneath it.
3. **Juvenile hormone** (JH), from the corpora allata, decides what kind of moult it will be. With plenty of JH the larva moults into a bigger larva; when JH falls in the last instar, the next ecdysone pulse makes a pupa, and without JH the adult emerges.

In the 1930s Vincent Wigglesworth showed with the blood-sucking bug *Rhodnius* that a factor from the head triggers moulting and that another keeps the insect juvenile. Later experiments confirmed it: extra corpora allata implanted into a last-stage larva gave a giant extra larval stage, and removing them early gave miniature adults. Insecticides that mimic JH or ecdysone exploit this system, which vertebrates do not have. Crabs and lobsters also moult under ecdysteroids, held back until the right moment by a moult-inhibiting hormone from the eyestalks.

### Amphibians and fish
Tadpoles metamorphose under **thyroid hormone**: J. F. Gudernatsch found in 1912 that tadpoles fed horse thyroid turned into tiny frogs early. The hormone switches on hundreds of genes that grow legs and lungs, remove the tail by programmed cell death ([[apoptosis]]) and rebuild the gut from a plant-eater's into a meat-eater's. In salmon, cortisol and growth hormone prepare the gills for the sea, while **prolactin** — the milk hormone of mammals — is the fish's "freshwater hormone", cutting the loss of salt at the gills ([[osmoregulation]]).

### How hormone levels are set
A hormone's level in the blood is a balance between secretion and removal. Peptides often last minutes — insulin's half-life is about 5 minutes — so their levels can change fast; thyroxine lasts about a week and changes slowly. Most are held steady by negative feedback on the gland that makes them ([[animal-homeostasis]]); a few rise by positive feedback, like the surge of LH that triggers ovulation.

> [!key] Hormones are slow, far-reaching chemical messages. Insect growth is timed by PTTH, ecdysone and juvenile hormone; amphibian metamorphosis by thyroid hormone; and the same hormone families recur across animals with new jobs.

> [!note] Many of these discoveries came from surgery and transplants in live animals. Such work today needs ethical approval and follows the 3Rs — replace, reduce, refine — using cells, tissues and computer models wherever they can answer the question.
`,
  ideas: [
    'Hormones travel in the blood to every cell with a matching receptor; they act more slowly than nerves but more widely and for longer.',
    'Peptide hormones act on surface receptors and amplify through second messengers; steroids enter cells and switch genes.',
    'Insects moult when ecdysone pulses; juvenile hormone decides whether the moult makes a larger larva, a pupa or an adult.',
    'Thyroid hormone drives amphibian (and flatfish) metamorphosis; prolactin helps fish live in fresh water.',
    'A hormone\'s level reflects both how fast it is secreted and how fast it is removed (its half-life).'
  ],
  pitfalls: [
    'Hormones act only on one target organ — They reach every cell; only cells with the right receptor respond, and one hormone can have different effects on different tissues.',
    'Juvenile hormone makes the insect moult — Ecdysone triggers every moult; juvenile hormone only decides whether it is a larval moult or a metamorphic one.',
    'Hormones and nerves are separate systems — Neurosecretory cells release hormones, and the brain controls most endocrine glands; they work as one system.'
  ],
  formulas: [
    {
      name: 'Hormone clearance: exponential decay',
      expr: 'C = C0*2^(-t/th)', tex: 'C = C_0\\,2^{-t/t_{1/2}}',
      vars: {
        C: { name: 'concentration after time t', q: 'concentration', unit: 'nM' },
        C0: { name: 'starting concentration', q: 'concentration', unit: 'nM', value: 10, tex: 'C_0' },
        t: { name: 'time since secretion stopped', q: 'time', unit: 'min', value: 30 },
        th: { name: 'half-life of the hormone', q: 'time', unit: 'min', value: 10, tex: 't_{1/2}' }
      },
      note: 'First-order removal by the liver, kidneys and target cells. Half-lives range from a few minutes (insulin, adrenaline) to about a week (thyroxine).',
      practice: { unknowns: ['C', 't', 'th'] },
      stories: {
        C: 'A pulse of hormone reaches {C0} and then secretion stops. Its half-life is {th}. What is the level {t} later?',
        t: 'A hormone with a half-life of {th} falls from {C0} to {C}. How long does that take?',
        th: 'A hormone falls from {C0} to {C} in {t}. What is its half-life?'
      }
    },
    {
      name: 'Steady level of a hormone',
      expr: 'C = S*th/(ln(2)*V)', tex: 'C_{ss} = \\dfrac{S\\,t_{1/2}}{\\ln 2\\;V}',
      vars: {
        C: { name: 'steady concentration in the blood', q: false, unit: 'µg/L', tex: 'C_{ss}' },
        S: { name: 'secretion rate', q: false, unit: 'µg/h', value: 4 },
        th: { name: 'half-life', q: false, unit: 'h', value: 168, tex: 't_{1/2}' },
        V: { name: 'volume the hormone is spread through', q: false, unit: 'L', value: 10 }
      },
      note: 'Input equals removal: a constant secretion S is removed at a rate (ln 2/t½)·C·V. Doubling the secretion or the half-life doubles the level.',
      practice: { unknowns: ['C', 'S'] },
      stories: {
        C: 'A gland secretes a hormone at {S}. The hormone has a half-life of {th} and spreads through {V}. What is its steady level?',
        S: 'A hormone with a half-life of {th}, spread through {V}, holds a steady level of {C}. How fast is it secreted?'
      }
    },
    {
      name: 'Dyar\'s rule for insect growth',
      expr: 'w = w0*r^n', tex: 'w = w_0\\,r^{\\,n}',
      vars: {
        w: { name: 'head-capsule width after n moults', q: 'length', unit: 'mm' },
        w0: { name: 'head-capsule width at hatching', q: 'length', unit: 'mm', value: 0.5, tex: 'w_0' },
        r: { name: 'growth ratio per moult', value: 1.4 },
        n: { name: 'number of moults', int: true, value: 4 }
      },
      note: 'An empirical rule (Harrison Dyar, 1890): hard parts grow by a roughly constant factor at each moult, typically 1.2–1.7. Useful for counting how many instars a species has.',
      practice: { unknowns: ['w', 'n', 'r'] },
      stories: {
        w: 'A caterpillar hatches with a head capsule {w0} wide and grows by a factor of {r} at each moult. How wide is it after {n} moults?',
        n: 'A larva\'s head capsule grows from {w0} to {w} by a factor of {r} per moult. How many moults has it gone through?',
        r: 'A larva\'s head capsule grows from {w0} to {w} in {n} moults. What is the growth ratio per moult?'
      }
    }
  ],
  examples: [
    {
      title: 'Why thyroxine levels are steady',
      q: 'The human thyroid secretes about 100 µg of thyroxine a day (about 4 µg/h). Thyroxine has a half-life of about 7 days (168 h) and spreads through about 10 L of fluid. What steady level does this give?',
      steps: [
        '$C = S\\,t_{1/2}/(\\ln 2\\;V) = 4 \\times 168/(0.693 \\times 10)$.',
        '$= 672/6.93 = 97$ µg/L, or about 9.7 µg/dL.',
        'That is in the typical range for total thyroxine (roughly 5–12 µg/dL; laboratories differ). With such a long half-life, a day\'s change in secretion hardly moves the level.'
      ],
      a: 'About 97 µg/L (9.7 µg/dL).'
    },
    {
      title: 'How many instars?',
      q: 'A caterpillar hatches with a head capsule 0.5 mm wide; the head capsule of the fully grown larva is 2.5 mm wide. If each moult widens it by a factor of 1.5, how many moults — and instars — are there?',
      steps: [
        '$2.5 = 0.5 \\times 1.5^n$, so $1.5^n = 5$.',
        '$n = \\ln 5/\\ln 1.5 = 1.609/0.405 = 3.97$, so 4 moults.',
        'Four moults separate five instars — a common number for moths and butterflies.'
      ],
      a: '4 moults, 5 larval instars.'
    },
    {
      title: 'A short-lived signal',
      q: 'Insulin has a half-life of about 5 minutes. If secretion stopped suddenly, what fraction would be left after 20 minutes?',
      steps: [
        '20 minutes is 4 half-lives.',
        '$2^{-4} = 1/16 \\approx 6$ %.',
        'Such fast clearance means the level follows secretion minute by minute — ideal for a hormone that must track blood glucose.'
      ],
      a: 'About 6 %.'
    }
  ],
  quiz: [
    { q: 'In a caterpillar, what does juvenile hormone decide?', choices: ['When the next moult happens', 'Whether the next moult makes a larger larva or a pupa', 'How fast the larva eats', 'The colour of the adult'], a: 1,
      why: 'Ecdysone triggers each moult; high juvenile hormone keeps the moult larval, and its fall in the last instar allows metamorphosis.' },
    { q: 'Steroid hormones act mainly on receptors on the outside of the cell membrane.', a: false,
      why: 'Steroids are fat-soluble: they cross the membrane and bind receptors inside the cell that act on genes.' },
    { q: 'A hormone has a half-life of 10 minutes. What percentage of it is left 30 minutes after secretion stops?', answer: 12.5, unit: '%', why: 'Three half-lives: $2^{-3} = 1/8 = 12.5$ %.' },
    { q: 'Which hormone triggers the metamorphosis of a tadpole into a frog?', choices: ['ecdysone', 'juvenile hormone', 'thyroid hormone', 'insulin'], a: 2,
      why: 'Thyroid hormone (thyroxine and T3) drives amphibian metamorphosis; Gudernatsch showed in 1912 that feeding thyroid tissue speeds it up.' },
    { q: 'If the corpora allata (the source of juvenile hormone) are removed from a young larva, it…', choices: ['never moults again', 'moults into larger and larger larvae forever', 'undergoes metamorphosis early, into a miniature adult', 'dies at once'], a: 2,
      why: 'Without juvenile hormone the next ecdysone-triggered moult is a metamorphic one, so a small pupa and then a miniature adult result.' }
  ],
  problems: [
    { q: 'A larva\'s head capsule is 0.6 mm wide at hatching and grows by a factor of 1.4 at each moult. How wide is it after 4 moults, in mm?', answer: 2.30, unit: 'mm', tol: 0.02, steps: ['$w = 0.6 \\times 1.4^4 = 0.6 \\times 3.84 = 2.30$ mm.'] },
    { q: 'A hormone is secreted at 20 µg/h, has a half-life of 0.5 h and spreads through 5 L. What is its steady level, in µg/L?', answer: 2.89, unit: 'µg/L', tol: 0.02, steps: ['$C = 20 \\times 0.5/(0.693 \\times 5) = 10/3.47 = 2.89$ µg/L.'] }
  ],
  applications: [
    'Insect growth regulators that mimic juvenile hormone or ecdysone control mosquitoes, fleas and crop pests with little effect on vertebrates.',
    'Aquaculture times the transfer of salmon to sea water by their hormone-driven readiness.',
    'Endocrine-disrupting pollutants that mimic or block hormones can upset development in fish, amphibians and other wildlife.',
    'Comparative endocrinology helped discover human hormones and their receptors.'
  ],
  history: 'Bayliss and Starling named the first hormone, secretin, in 1902. Gudernatsch showed the thyroid\'s role in metamorphosis in 1912. Stefan Kopeć showed in 1922 that the insect brain controls moulting, and Vincent Wigglesworth worked out the roles of the brain and of juvenile hormone in the 1930s. Adolf Butenandt and Peter Karlson isolated ecdysone in 1954 from 500 kg of silkworm pupae.'
},

/* ================================================================ MOVEMENT, DEFENCE AND REPRODUCTION */
{
  id: 'muscles-movement', parent: 'animal-life', title: 'Muscles and movement', level: 2,
  short: 'Every animal muscle is myosin pulling on actin: filaments slide, sarcomeres shorten, and force falls as speed rises. Skeletons — hydrostatic, external or internal — turn that pull into motion through levers that trade force for speed, which is why a cheetah\'s legs and a mole\'s arms look so different.',
  keywords: ['muscle', 'sliding filament', 'sarcomere', 'actin', 'myosin', 'cross-bridge cycle', 'length–tension', 'force–velocity', 'Hill equation', 'muscle power', 'lever', 'mechanical advantage', 'in-lever', 'out-lever', 'hydrostatic skeleton', 'exoskeleton', 'endoskeleton', 'resilin', 'asynchronous flight muscle', 'specific tension'],
  prereq: ['cytoskeleton', 'atp-energy', 'physics:torque'],
  related: ['animal-nervous-systems', 'scaling-allometry', 'thermoregulation-animals', 'circulation-animals', 'foraging', 'physics:static-equilibrium', 'physics:power', 'physics:stress-strain', 'medicine:physical-activity'],
  body: `
A flea jumps over a hundred times its own length; a cheetah reaches 100 km/h in about three seconds; a mole shoves its way through soil with forelimbs like spades. All three are powered by the same molecular motor, **myosin**, pulling on the same filaments of **actin**, and all three turn the pull into motion through a skeleton of levers. What differs is how the motors are arranged and how the levers are proportioned.

### Sliding filaments
A skeletal muscle fibre is packed with **myofibrils**, each a chain of **sarcomeres** about 2–2.5 µm long. Thick filaments of myosin, 1.6 µm long, interleave with thin filaments of actin, about 1 µm long, anchored to the Z-discs at each end. When a nerve impulse releases calcium inside the fibre, myosin heads bind actin, swing through a **power stroke** of about 5–10 nm, let go when ATP binds, re-cock as they split it, and bind again: the **cross-bridge cycle** ([[atp-energy]]). The filaments slide past each other and every sarcomere shortens, while neither kind of filament changes length. Each head pulls with a few piconewtons, but a square centimetre holds billions of them, so vertebrate skeletal muscle — a frog's leg, a bird's wing, your arm — makes a similar maximum stress of about 20–30 N/cm² (0.2–0.3 MPa) of cross-section. Some invertebrate muscles with longer sarcomeres, such as those in crab claws, do better.

Force depends on overlap: in frog muscle it is greatest at sarcomere lengths of about 2.0–2.2 µm and falls on either side (the **length–tension** curve). It also depends on speed: the faster a muscle shortens, the less force it makes — A. V. Hill's **force–velocity** relation of 1938. A muscle holding a weight still makes its full force $F_0$; one shortening at its top speed $V_{\\max}$ makes none; the **power** $Fv$ peaks at about a third of each, roughly $0.1\\,F_0V_{\\max}$.

### Three kinds of muscle, and some specialists
Vertebrates have striated **skeletal** muscle, striated **cardiac** muscle that never rests, and **smooth** muscle in the gut and vessels, slow and economical. Invertebrates add specialists: the **asynchronous flight muscle** of flies, bees and midges is triggered by stretch and contracts many times for each nerve impulse, letting a midge beat its wings about 1000 times a second; the **catch muscle** of mussels holds the shell shut for hours at almost no cost in energy.

### Skeletons and levers
Muscles can only pull, so they work in antagonistic pairs against a skeleton: a **hydrostatic** one (an earthworm's fluid-filled segments, squeezed by circular and longitudinal muscles), an **exoskeleton** (arthropods, with the muscles inside the tubes) or an **endoskeleton** (vertebrates). A limb is a lever: a muscle attached at a distance $L_{in}$ from the joint moves a load at $L_{out}$. Torques balance, so

$$F_{out} = F_{in}\\,\\frac{L_{in}}{L_{out}}, \\qquad v_{out} = v_{in}\\,\\frac{L_{out}}{L_{in}}$$

A lever trades force for speed and cannot give both. Your biceps attaches about 4 cm from the elbow and your hand is about 35 cm away, so to hold a 10 kg bag (98 N) the muscle must pull with some 850 N — but each centimetre it shortens moves the hand almost 9 cm. Runners such as horses and cheetahs have long, light lower legs with the muscles bunched near the hip: a small mechanical advantage, built for speed. Diggers such as moles and badgers have short limbs with long bony processes for the muscles to pull on: a large mechanical advantage, built for force.

### Springs
Fast movements often use stored elastic energy. A flea slowly loads a pad of the rubbery protein **resilin**, a locust bends a stiff part of its leg cuticle, and each releases it with a catch, accelerating faster than any muscle could contract; a kangaroo's long tendons store and return much of the energy of each hop. And because both the work a muscle can do and the work needed to rise a height $h$ grow in proportion to mass, animals of very different sizes jump to similar heights: a flea about 20 cm, a locust or a person standing still about half a metre, over a hundred-million-fold range of mass.

> [!key] Myosin pulling on actin drives every animal muscle; force per area is similar everywhere, but force falls as speed rises. Skeletons turn the pull into motion through levers that trade force for speed, and springs deliver bursts faster than muscle alone.
`,
  ideas: [
    'Muscles shorten because actin and myosin filaments slide past each other, driven by ATP-powered cross-bridges; the filaments themselves do not shorten.',
    'Maximum force is proportional to cross-sectional area — about 20–30 N/cm² in vertebrate skeletal muscle.',
    'The faster a muscle shortens, the less force it makes; power peaks at about a third of full speed.',
    'A lever with a short in-lever multiplies speed at the cost of force, and a long one the reverse: runners and diggers have different proportions.',
    'Springs of resilin, cuticle and tendon store muscle work and release it faster than muscle could.'
  ],
  pitfalls: [
    'Actin and myosin filaments shorten during contraction — Both keep their length; they slide over each other, so the sarcomere and the band where they do not overlap shorten.',
    'A muscle is strongest when it contracts fastest — The reverse: force falls as shortening speed rises, and is zero at maximum speed.',
    'Levers in the body give a mechanical advantage — Most limb levers have a mechanical advantage well below one: muscles pull with forces far larger than the load, in exchange for speed and range.'
  ],
  formulas: [
    {
      name: 'Lever: force at the load',
      expr: 'Fout = Fin*Lin/Lout', tex: 'F_{out} = F_{in}\\,\\dfrac{L_{in}}{L_{out}}',
      vars: {
        Fout: { name: 'force at the load', q: 'force', unit: 'N', tex: 'F_{out}' },
        Fin: { name: 'muscle force', q: 'force', unit: 'N', value: 700, tex: 'F_{in}' },
        Lin: { name: 'in-lever: joint to muscle attachment', q: 'length', unit: 'cm', value: 4, tex: 'L_{in}' },
        Lout: { name: 'out-lever: joint to the load', q: 'length', unit: 'cm', value: 35, tex: 'L_{out}' }
      },
      note: 'Balance of torques about the joint, with the muscle pulling at right angles to the bone. L_in/L_out is the mechanical advantage.',
      practice: { unknowns: ['Fout', 'Fin', 'Lin'] },
      stories: {
        Fout: 'A biceps pulls with {Fin}, attached {Lin} from the elbow. What force does the hand exert {Lout} from the elbow?',
        Fin: 'To hold a load of {Fout} in the hand, {Lout} from the elbow, how hard must a muscle attached {Lin} from the elbow pull?',
        Lin: 'A muscle pulling with {Fin} holds a load of {Fout} at {Lout} from the joint. How far from the joint is it attached?'
      }
    },
    {
      name: 'Lever: speed at the load',
      expr: 'vout = vin*Lout/Lin', tex: 'v_{out} = v_{in}\\,\\dfrac{L_{out}}{L_{in}}',
      vars: {
        vout: { name: 'speed of the load', q: 'speed', unit: 'm/s', tex: 'v_{out}' },
        vin: { name: 'shortening speed of the muscle', q: 'speed', unit: 'm/s', value: 0.5, tex: 'v_{in}' },
        Lin: { name: 'in-lever', q: 'length', unit: 'cm', value: 4, tex: 'L_{in}' },
        Lout: { name: 'out-lever', q: 'length', unit: 'cm', value: 35, tex: 'L_{out}' }
      },
      note: 'Both ends turn through the same angle, so speeds scale with distance from the joint. Force × speed is the same at both ends (ignoring friction): a lever cannot create power.',
      practice: { unknowns: ['vout', 'Lout'] },
      stories: {
        vout: 'A muscle attached {Lin} from a joint shortens at {vin}. How fast does a point {Lout} from the joint move?',
        Lout: 'A muscle attached {Lin} from a joint shortens at {vin}. How long must the limb be for its tip to move at {vout}?'
      }
    },
    {
      name: 'Hill\'s force–velocity relation',
      expr: 'v = Vmax*k*(1 - F/F0)/(F/F0 + k)', tex: 'v = V_{\\max}\\,\\dfrac{k\\,(1 - F/F_0)}{F/F_0 + k}',
      vars: {
        v: { name: 'shortening speed', q: 'speed', unit: 'm/s' },
        Vmax: { name: 'maximum shortening speed (no load)', q: 'speed', unit: 'm/s', value: 1.6, tex: 'V_{\\max}' },
        F: { name: 'force (load)', q: 'force', unit: 'N', value: 500 },
        F0: { name: 'maximum isometric force', q: 'force', unit: 'N', value: 2000, tex: 'F_0' },
        k: { name: 'Hill\'s curvature constant a/F₀', value: 0.25, min: 0.05, max: 1 }
      },
      note: 'A. V. Hill (1938): (F + a)(v + b) = (F₀ + a)b, written with k = a/F₀ ≈ 0.25 for most vertebrate muscle. For shortening only (0 ≤ F ≤ F₀).',
      practice: { unknowns: ['v', 'F'] },
      stories: {
        v: 'A muscle with a maximum force of {F0} and a top speed of {Vmax} (k = {k}) lifts a load of {F}. How fast does it shorten?',
        F: 'A muscle with a maximum force of {F0} and a top speed of {Vmax} (k = {k}) shortens at {v}. What force is it making?'
      }
    },
    {
      name: 'Maximum force from cross-sectional area',
      expr: 'F0 = sigma*A', tex: 'F_0 = \\sigma\\,A',
      vars: {
        F0: { name: 'maximum isometric force', q: 'force', unit: 'N', tex: 'F_0' },
        sigma: { name: 'specific tension of muscle', q: 'stress', unit: 'kPa', value: 250, tex: '\\sigma' },
        A: { name: 'physiological cross-sectional area', q: 'area', unit: 'cm²', value: 60 }
      },
      note: 'Vertebrate skeletal muscle gives about 200–300 kPa (20–30 N/cm²). Force scales with area, so with length², while body weight scales with length³.',
      practice: { unknowns: ['F0', 'A'] },
      stories: {
        F0: 'A muscle has a cross-sectional area of {A} and a specific tension of {sigma}. What is its maximum force?',
        A: 'What cross-section of muscle, at {sigma}, is needed to pull with {F0}?'
      }
    }
  ],
  examples: [
    {
      title: 'Holding a shopping bag',
      q: 'You hold a 10 kg bag in your hand with the forearm horizontal. The biceps attaches 4 cm from the elbow and the hand is 35 cm from it. How hard must the biceps pull? How far does the hand move when the biceps shortens 1 cm?',
      steps: [
        'Load: $10 \\times 9.81 = 98$ N.',
        '$F_{in} = F_{out}\\,L_{out}/L_{in} = 98 \\times 35/4 = 858$ N — nearly nine times the load.',
        'Distances scale like speeds: $1 \\times 35/4 = 8.75$ cm of hand movement for 1 cm of muscle.'
      ],
      a: 'About 860 N; the hand moves about 8.75 cm.'
    },
    {
      title: 'When is a muscle most powerful?',
      q: 'A muscle has $F_0 = 2000$ N, $V_{\\max} = 1.6$ m/s and $k = 0.25$. How fast does it lift a 500 N load, and what power does it deliver? Compare with its maximum power, near $F = 0.31F_0$.',
      steps: [
        'At $F/F_0 = 0.25$: $v = 1.6 \\times 0.25 \\times 0.75/(0.25 + 0.25) = 0.60$ m/s; power $= 500 \\times 0.60 = 300$ W.',
        'At $F/F_0 = 0.31$ (620 N): $v = 1.6 \\times 0.25 \\times 0.69/0.56 = 0.49$ m/s; power $= 620 \\times 0.49 = 306$ W.',
        'The peak is broad and lies near a third of full force and a third of full speed: about $0.1\\,F_0V_{\\max} = 320$ W. Cyclists choose gears to keep their muscles near it.'
      ],
      a: '0.60 m/s and 300 W, just below the maximum of about 306 W.'
    }
  ],
  quiz: [
    { q: 'When a skeletal muscle contracts, what gets shorter?', choices: ['The actin filaments', 'The myosin filaments', 'The sarcomeres, as the filaments slide past each other', 'Both kinds of filament'], a: 2,
      why: 'The sliding-filament theory: filament lengths stay constant; their overlap increases, so each sarcomere shortens.' },
    { q: 'A muscle pulls with 600 N at 5 cm from a joint. What force does it produce at the end of a limb 30 cm from the joint?', answer: 100, unit: 'N', why: '$F_{out} = 600 \\times 5/30 = 100$ N.' },
    { q: 'A muscle produces its greatest force when it shortens fastest.', a: false,
      why: 'Force falls as shortening speed rises (Hill\'s relation); the greatest force is made when the muscle is held still or stretched.' },
    { q: 'Compared with a mole\'s forelimb, a cheetah\'s leg has…', choices: ['a longer in-lever relative to its out-lever, for force', 'a shorter in-lever relative to its out-lever, for speed', 'the same proportions but stronger muscles', 'no lever at all'], a: 1,
      why: 'A small ratio L_in/L_out turns modest muscle shortening into fast foot movement; the mole\'s large ratio gives force for digging.' },
    { q: 'Why do a flea and a person jump to similar heights?', choices: ['Fleas have stronger muscles per gram', 'The work muscle can do and the work needed to rise a height both grow in proportion to mass', 'Air resistance is the same for both', 'Gravity is weaker for small animals'], a: 1,
      why: 'Muscle work ∝ muscle mass ∝ body mass, and the energy to rise h is mgh, also ∝ mass — so h is roughly independent of size. (Fleas also use springs to release that work fast enough.)' }
  ],
  problems: [
    { q: 'A muscle with a cross-section of 40 cm² and a specific tension of 250 kPa pulls with what maximum force?', answer: 1000, unit: 'N', tol: 0.02, steps: ['$F_0 = \\sigma A = 250\\,000 \\times 0.004 = 1000$ N.'] },
    { q: 'A muscle attached 3 cm from a joint shortens at 0.2 m/s. How fast does the tip of the limb, 45 cm from the joint, move?', answer: 3, unit: 'm/s', tol: 0.02, steps: ['$v_{out} = 0.2 \\times 45/3 = 3$ m/s.'] }
  ],
  applications: [
    'Sports science and cycling gear ratios keep muscles near the speed of maximum power.',
    'Palaeontologists estimate how dinosaurs ran and bit from the lever arms of their bones.',
    'Engineers build jumping robots with springs and catches copied from fleas and locusts.',
    'Rehabilitation and surgery on tendons consider how moving an attachment changes force and speed.'
  ],
  history: 'In 1954 two pairs of researchers — Andrew Huxley and Rolf Niedergerke, and Hugh Huxley and Jean Hanson — independently proposed the sliding-filament theory. A. V. Hill measured the force–velocity relation and the heat of contracting muscle in 1938. Giovanni Borelli analysed limbs as levers in *De motu animalium* (1680).',
  sim: 'ani-lever'
},

{
  id: 'animal-immunity', parent: 'animal-life', title: 'Immune systems compared', level: 2,
  short: 'All animals have innate immunity — barriers, phagocytes, receptors such as Toll that recognise whole classes of microbes, and antimicrobial peptides. Only vertebrates add adaptive immunity, with receptors assembled by shuffling gene segments, clonal selection and memory — and jawless fish evolved a different version of it independently.',
  keywords: ['immune system', 'innate immunity', 'adaptive immunity', 'phagocytosis', 'Metchnikoff', 'Toll', 'Toll-like receptor', 'pattern recognition', 'antimicrobial peptides', 'cecropin', 'complement', 'melanisation', 'encapsulation', 'immune priming', 'Dscam', 'RAG', 'V(D)J recombination', 'clonal selection', 'variable lymphocyte receptors', 'lamprey'],
  prereq: ['cell-signalling', 'endocytosis', 'vertebrates'],
  related: ['crispr', 'coevolution', 'viruses', 'bacteria-archaea', 'microbiome', 'sexual-selection', 'medicine:innate-immunity', 'medicine:adaptive-immunity', 'medicine:antibodies', 'medicine:vaccines'],
  body: `
Every animal lives among bacteria, viruses, fungi and parasites that would happily feed on it, and every animal defends itself. The defences come in two layers. **Innate immunity** — found in all animals, and in plants too — recognises broad classes of invaders by molecular features they cannot easily change, and responds within minutes to hours. **Adaptive immunity** — found only in vertebrates — builds receptors for almost any shape by shuffling gene segments, selects the ones that fit, and remembers them.

### Innate defences: old and everywhere
- **Barriers**: skin, cuticle, mucus, the shell of an egg, and antimicrobial enzymes such as lysozyme in tears and egg white.
- **Phagocytes**, cells that engulf and digest intruders ([[endocytosis]]). Élie Metchnikoff discovered them in 1882 by pushing rose thorns into transparent starfish larvae and finding mobile cells crowded round the splinters the next morning.
- **Pattern-recognition receptors**, which detect features shared by whole groups of microbes: fungal and bacterial cell walls, flagellin, double-stranded viral RNA. The fruit-fly gene *Toll* was known only for shaping the embryo until, in 1996, Bruno Lemaitre and Jules Hoffmann found that flies lacking it die of fungal infection; mammals turned out to have a family of similar Toll-like receptors.
- **Antimicrobial peptides**: short, positively charged peptides that punch holes in microbial membranes. Hans Boman found the cecropins in silk-moth pupae in 1981; flies, frogs and people each make dozens.
- **Clotting, melanisation and encapsulation**: insects wall off the eggs of parasitic wasps in layers of blood cells and black melanin.
- **Complement**, a cascade of blood proteins that tags and kills bacteria, exists in simple forms as far back as sea urchins.

Invertebrate immunity is subtler than was once thought. Insects that survive an infection can resist the same microbe better later (**immune priming**), and the fly gene *Dscam* can be spliced into some 38 000 different proteins, a diversity that may help it recognise pathogens.

### Adaptive immunity: a vertebrate invention, made twice
Jawed vertebrates, from sharks to people, have **lymphocytes**: B cells that make antibodies and T cells that kill infected cells or direct the response. Each lymphocyte carries a single kind of receptor, assembled by cutting and joining gene segments with the **RAG** enzymes, which seem to descend from a jumping gene that invaded an ancestor some 500 million years ago. In people, one of about 40 V segments, 23 D and 6 J build the heavy chain of an antibody, and one of about 40 V and 5 J a κ light chain — over a million combinations, and, with imprecise joining, more than $10^{11}$ possible receptors. A lymphocyte whose receptor fits an invader multiplies into a clone of thousands within a week (**clonal selection**), and long-lived memory cells make the second response faster and stronger — the principle behind vaccines ([[medicine:vaccines]]).

Lampreys and hagfish, the jawless fish, surprised immunologists in 2004: they too have adaptive immunity, but built from different parts. Their **variable lymphocyte receptors** are assembled from modules of leucine-rich repeats, not antibody domains — the same solution, evolved independently. Bacteria and archaea, for their part, keep a memory of past viruses in their **CRISPR** arrays ([[crispr]]).

| Feature | Innate | Adaptive |
|---|---|---|
| Found in | all animals (and plants) | jawed vertebrates; a separate system in lampreys and hagfish |
| Receptors | fixed in the genome, recognise shared patterns | assembled in each cell, recognise almost any shape |
| Speed | minutes to hours | days the first time, faster the second |
| Memory | limited (priming) | long-lasting |

Human immunity in detail: [[medicine:innate-immunity]] and [[medicine:adaptive-immunity]].

> [!key] Innate immunity — barriers, phagocytes, pattern receptors such as Toll, antimicrobial peptides — is ancient and universal. Adaptive immunity, with shuffled receptors, clonal selection and memory, evolved in vertebrates — twice.
`,
  ideas: [
    'Innate immunity exists in every animal: barriers, phagocytes, pattern-recognition receptors, antimicrobial peptides and complement.',
    'Toll receptors of flies and Toll-like receptors of mammals are homologous: pattern recognition is ancient.',
    'Adaptive immunity in jawed vertebrates assembles receptors from V, D and J segments with RAG enzymes, giving millions of combinations.',
    'Clonal selection expands the lymphocytes that fit an invader, and memory cells make the second response faster.',
    'Jawless fish evolved adaptive immunity independently, with leucine-rich-repeat receptors.'
  ],
  pitfalls: [
    'Invertebrates have no immune system because they have no antibodies — They have strong innate defences, and some show a form of memory (immune priming).',
    'Innate immunity is unspecific — It is specific for molecular patterns shared by whole groups of microbes; what it lacks is the ability to make new receptors and a long-lasting memory.',
    'Every antibody has its own gene — Receptors are assembled from a few hundred gene segments in each lymphocyte; the combinations and imprecise joins produce the diversity.'
  ],
  formulas: [
    {
      name: 'Combinations of receptor gene segments',
      expr: 'N = Vh*Dh*Jh*Vk*Jk', tex: 'N = V_H\\,D_H\\,J_H \\times V_\\kappa\\,J_\\kappa',
      vars: {
        N: { name: 'number of different antibodies from segment choice alone', q: 'count' },
        Vh: { name: 'heavy-chain V segments', int: true, value: 40, tex: 'V_H' },
        Dh: { name: 'heavy-chain D segments', int: true, value: 23, tex: 'D_H' },
        Jh: { name: 'heavy-chain J segments', int: true, value: 6, tex: 'J_H' },
        Vk: { name: 'κ light-chain V segments', int: true, value: 40, tex: 'V_\\kappa' },
        Jk: { name: 'κ light-chain J segments', int: true, value: 5, tex: 'J_\\kappa' }
      },
      note: 'Human numbers of functional segments, approximately. Imprecise joining and added nucleotides multiply the diversity by many orders of magnitude more; λ light chains add further combinations.',
      practice: { unknowns: ['N'] },
      stories: { N: 'An animal has {Vh} V, {Dh} D and {Jh} J segments for the heavy chain and {Vk} V and {Jk} J for the light chain. How many antibodies can segment choice alone make?' }
    },
    {
      name: 'Clonal expansion',
      expr: 'N = N0*2^(t/td)', tex: 'N = N_0\\,2^{\\,t/t_d}',
      vars: {
        N: { name: 'lymphocytes in the clone', q: 'count' },
        N0: { name: 'lymphocytes that first recognise the invader', q: 'count', value: 10, tex: 'N_0' },
        t: { name: 'time since activation', q: 'time', unit: 'day', value: 5 },
        td: { name: 'doubling time', q: 'time', unit: 'h', value: 8, tex: 't_d' }
      },
      note: 'Activated lymphocytes can divide every 6–12 hours for several days; the clone then shrinks, leaving memory cells.',
      practice: { unknowns: ['N', 't'] },
      stories: {
        N: '{N0} lymphocytes recognise a virus and divide every {td}. How many are there after {t}?',
        t: '{N0} lymphocytes divide every {td}. How long until the clone reaches {N} cells?'
      }
    }
  ],
  examples: [
    {
      title: 'A million antibodies from a few genes',
      q: 'With about 40 V, 23 D and 6 J heavy-chain segments and 40 V and 5 J κ light-chain segments, how many antibodies can segment choice alone produce?',
      steps: [
        'Heavy chains: $40 \\times 23 \\times 6 = 5520$.',
        'κ light chains: $40 \\times 5 = 200$.',
        'Pairs: $5520 \\times 200 = 1\\,104\\,000$ — about a million from some 114 segments. Imprecise joins raise the total to more than $10^{11}$.'
      ],
      a: 'About 1.1 million.'
    },
    {
      title: 'How fast does a clone grow?',
      q: 'Ten B cells recognise a new virus and divide every 8 hours. How many are there after 5 days?',
      steps: [
        '5 days = 120 h = 15 doublings.',
        '$N = 10 \\times 2^{15} = 10 \\times 32\\,768 = 327\\,680$.',
        'That is why the first antibody response takes about a week to peak — and why memory cells, already numerous, respond much faster the second time.'
      ],
      a: 'About 330 000 cells.'
    }
  ],
  quiz: [
    { q: 'Insects have no immune defences because they lack antibodies.', a: false,
      why: 'Insects have barriers, phagocytic haemocytes, Toll and other pattern receptors, antimicrobial peptides, melanisation and encapsulation — strong innate immunity.' },
    { q: 'Which is found in all animals, from sponges to people?', choices: ['antibodies', 'T cells', 'phagocytic cells', 'RAG enzymes'], a: 2,
      why: 'Phagocytosis is ancient. Antibodies, T cells and RAG are found only in jawed vertebrates.' },
    { q: 'An animal has 30 V, 20 D and 5 J heavy-chain segments and 30 V and 5 J light-chain segments. How many antibodies can segment choice alone make?', answer: 450000, why: '$(30 \\times 20 \\times 5) \\times (30 \\times 5) = 3000 \\times 150 = 450\\,000$.' },
    { q: 'What are the adaptive immune receptors of lampreys made of?', choices: ['Antibody domains, like ours', 'Modules of leucine-rich repeats', 'RNA', 'Toll receptors'], a: 1,
      why: 'Variable lymphocyte receptors are assembled from leucine-rich repeat modules: adaptive immunity evolved independently in jawless fish.' },
    { q: 'Why is the second response to the same microbe faster?', choices: ['The microbe is weaker the second time', 'Memory lymphocytes that fit it are already present in large numbers', 'Innate immunity has learned', 'Antibodies from the first infection last for life'], a: 1,
      why: 'Clonal expansion in the first response leaves long-lived memory cells, so many cells with a fitting receptor are ready at once.' }
  ],
  problems: [
    { q: 'A single T cell divides every 12 hours for 4 days. How many cells does its clone contain?', answer: 256, tol: 0.02, steps: ['4 days = 96 h = 8 doublings: $2^8 = 256$.'] }
  ],
  applications: [
    'Vaccines exploit clonal selection and memory.',
    'Antimicrobial peptides from insects and frogs are studied as new antibiotics.',
    'Toll-like receptor agonists are used as adjuvants that boost vaccine responses.',
    'Lamprey receptors and shark single-domain antibodies are being developed as research and diagnostic tools.'
  ],
  history: 'Élie Metchnikoff discovered phagocytes in 1882 and shared the 1908 Nobel Prize with Paul Ehrlich. Susumu Tonegawa showed in 1976 that antibody genes are assembled from segments (Nobel Prize 1987). Lemaitre and Hoffmann linked Toll to immunity in 1996, and Hoffmann shared the 2011 Nobel Prize with Bruce Beutler, who found the mammalian receptor for bacterial lipopolysaccharide. Max Cooper and colleagues described the lamprey receptors in 2004.'
},

{
  id: 'animal-reproduction', parent: 'animal-life', title: 'Animal reproduction', level: 1,
  short: 'Animals reproduce asexually — by budding, splitting or unfertilised eggs — or sexually, which costs twice as much but makes varied offspring. Fertilisation is external in water and internal on land, and every species trades the number of its offspring against the care each receives, from a cod\'s millions of eggs to an elephant\'s single calf.',
  keywords: ['reproduction', 'asexual reproduction', 'sexual reproduction', 'budding', 'fragmentation', 'parthenogenesis', 'twofold cost of sex', 'Red Queen', "Muller's ratchet", 'external fertilisation', 'internal fertilisation', 'amniotic egg', 'viviparity', 'hermaphrodite', 'temperature-dependent sex determination', 'r-selection', 'K-selection', 'life history', 'fecundity'],
  prereq: ['meiosis', 'mitosis', 'natural-selection'],
  related: ['animal-development', 'sexual-selection', 'sex-linkage', 'population-growth', 'animal-hormones', 'social-behaviour', 'coevolution', 'medicine:reproductive-hormones', 'medicine:pregnancy'],
  body: `
A single aphid gives birth to daughters that are already carrying daughters of their own, and in one summer her descendants could in principle number billions; an albatross lays one egg every year or two and feeds the chick for most of a year. Both leave, on average, just enough offspring to replace themselves — they have solved the problem of reproduction in opposite ways.

### Asexual and sexual reproduction
**Asexual** reproduction makes offspring from a single parent, genetically identical to it apart from new mutations:
- **budding** — a *Hydra* grows a small copy of itself on its side;
- **fragmentation and regeneration** — a flatworm cut in two, or a starfish arm with part of the central disc, grows into a whole animal;
- **parthenogenesis** — development from an unfertilised egg: aphids in summer, water fleas, many stick insects. Whiptail lizards of the American south-west are all-female species, and Komodo dragons and some sharks have had young this way in zoos.

**Sexual** reproduction joins two haploid gametes, made by [[meiosis]], into a new diploid individual. It carries a famous cost: in a population where half the offspring are sons, an asexual female that makes only daughters leaves twice as many grandchildren as a sexual one — the **twofold cost of sex** (John Maynard Smith, 1978). Starting from 1 % of a population, an asexual line would make up 90 % of it within about ten generations. Yet nearly all animals reproduce sexually at least sometimes. The leading explanations: sex reshuffles genes so that offspring differ, which matters against fast-evolving parasites (the **Red Queen** idea, see [[coevolution]]); it brings favourable mutations from different individuals together; and it purges harmful mutations that would otherwise pile up in asexual lines (**Muller's ratchet**). Many animals hedge their bets: aphids and water fleas reproduce asexually while conditions are good and sexually as the season turns.

### Fertilisation: external and internal
Most aquatic invertebrates, most bony fish and most frogs use **external fertilisation**: eggs and sperm are shed into the water, often in huge numbers and closely synchronised — on the Great Barrier Reef many coral species spawn on the same few nights after a full moon in late spring. **Internal fertilisation** places sperm inside the female and frees reproduction from water: insects, spiders, reptiles, birds, mammals, sharks and some other fish use it. On land it goes with eggs that resist drying — the insect egg and the **amniotic egg** of reptiles and birds, whose membranes keep the embryo in its own private pond — or with **viviparity**, the young developing inside the mother, which has evolved more than a hundred times in lizards and snakes alone, as well as in mammals, some sharks and a few bony fish.

Some animals are **hermaphrodites**: earthworms and garden snails are both sexes at once and swap sperm; clownfish start as males and may become female, many wrasses the reverse. Sex may be fixed by chromosomes (XY in mammals, ZW in birds, see [[sex-linkage]]) or by the environment: in many turtles and all crocodilians the temperature of the nest decides it.

### How many offspring? r and K
Every animal has a limited budget of energy, so it trades the number of offspring against what each one receives.

| | Many small offspring ("r-selected") | Few large offspring ("K-selected") |
|---|---|---|
| Examples | cod, oysters, many insects, mice | elephants, albatrosses, great apes, whales |
| Offspring | a large cod: millions of eggs a year; an oyster: tens of millions at one spawning | an elephant: one calf every 4–5 years after a 22-month pregnancy |
| Parental care | little or none | long |
| Survival of young | tiny | high |
| Life | short, breeding early | long, breeding late |

In a population that is neither growing nor shrinking, each female must on average leave exactly two surviving offspring in her life — one to replace her, one to replace her mate. So a cod that sheds twenty million eggs over her life sees, on average, about one in ten million survive to breed. The letters come from the logistic model of [[population-growth]]: r-selected species do best where populations can grow at their maximum rate $r$, and K-selected species in crowded populations near the carrying capacity $K$. Real life histories vary along many axes, and the r–K contrast is a useful starting point rather than a law.

> [!key] Asexual reproduction is fast and cheap; sex is costly but makes varied offspring, which helps against parasites and harmful mutations. Internal fertilisation and shelled or retained eggs freed reproduction from water. Every species trades the number of its offspring against the care each receives.
`,
  ideas: [
    'Asexual reproduction (budding, fragmentation, parthenogenesis) copies one parent; sexual reproduction combines two genomes through meiosis and fertilisation.',
    'Sex has a twofold cost — males make no offspring themselves — yet it is almost universal, probably because varied offspring resist parasites and shed harmful mutations.',
    'External fertilisation needs water; internal fertilisation, shelled eggs and viviparity allowed animals to breed on land.',
    'Animals trade the number of offspring against the investment in each: many small, uncared-for young versus a few large, well-tended ones.',
    'In a stable population each female leaves, on average, two surviving offspring.'
  ],
  pitfalls: [
    'Sexual reproduction exists to make more offspring — It makes fewer, at twice the cost; its advantage lies in their variety.',
    'Parthenogenesis happens only in invertebrates — Whiptail lizards are all-female species, and Komodo dragons, some snakes, sharks and birds occasionally have young from unfertilised eggs.',
    'Animals with millions of eggs are more successful than those with one calf — In a stable population both leave, on average, exactly enough surviving young to replace themselves.'
  ],
  formulas: [
    {
      name: 'The twofold cost of sex',
      expr: 'f = f0*2^g/(1 + f0*(2^g - 1))', tex: 'f = \\dfrac{f_0\\,2^{g}}{1 + f_0\\,(2^{g} - 1)}',
      vars: {
        f: { name: 'share of asexual females after g generations', q: 'ratio', unit: '%' },
        f0: { name: 'starting share of asexual females', q: 'ratio', unit: '%', value: 1, tex: 'f_0' },
        g: { name: 'number of generations', int: true, value: 10 }
      },
      note: 'Maynard Smith\'s thought experiment: asexual and sexual females equally fertile and equally likely to survive, half of sexual offspring male. The asexual share doubles relative to the sexual one each generation.',
      practice: { unknowns: ['f', 'g'] },
      stories: {
        f: 'An asexual mutant makes up {f0} of the females in a population. If nothing else differs, what share will asexual females make up after {g} generations?',
        g: 'Asexual females start at {f0} of a population. After how many generations would they make up {f}?'
      }
    },
    {
      name: 'Survival needed to replace the parents',
      expr: 's = 2/F', tex: 's = \\dfrac{2}{F}',
      vars: {
        s: { name: 'chance that an egg or newborn survives to breed', q: 'ratio', unit: '%' },
        F: { name: 'eggs or young a female produces in her life', int: true, value: 5000 }
      },
      note: 'For a population that neither grows nor shrinks, with equal numbers of males and females: each female must leave two breeding offspring.',
      practice: { unknowns: ['s', 'F'] },
      stories: {
        s: 'A frog lays {F} eggs in her life. In a stable population, what fraction of them survive to breed?',
        F: 'Only {s} of a fish\'s eggs survive to breed, and the population is stable. How many eggs does a female lay in her life?'
      }
    },
    {
      name: 'Rate of increase from reproduction and generation time',
      expr: 'r = ln(R0)/T', tex: 'r = \\dfrac{\\ln R_0}{T}',
      vars: {
        r: { name: 'intrinsic rate of increase', q: 'rate', unit: '1/yr', signed: true },
        R0: { name: 'net reproductive rate (daughters per female)', value: 10, tex: 'R_0' },
        T: { name: 'generation time', q: 'time', unit: 'yr', value: 0.5 }
      },
      note: 'An approximation from demography: a population multiplying by R₀ each generation of length T grows as e^(rt). Short generations raise r far more than extra offspring do.',
      practice: { unknowns: ['r', 'T'] },
      stories: {
        r: 'A mouse leaves {R0} daughters per generation, with a generation time of {T}. What is the population\'s rate of increase while nothing limits it?',
        T: 'A species with a net reproductive rate of {R0} grows at {r}. What is its generation time?'
      }
    }
  ],
  examples: [
    {
      title: 'The twofold cost in action',
      q: 'An asexual mutant makes up 1 % of the females in a population. If asexual and sexual females are otherwise equal, what share will asexual females make up after 10 generations?',
      steps: [
        'Each generation the ratio of asexual to sexual females doubles: after 10 generations it is $\\frac{0.01}{0.99} \\times 2^{10} = 0.0101 \\times 1024 = 10.3$.',
        'Share $= 10.3/(1 + 10.3) = 0.91$.',
        'Asexual females would make up about 91 % — so sex must bring a large advantage to persist.'
      ],
      a: 'About 91 %.'
    },
    {
      title: 'The odds for an egg',
      q: 'In a stable population, what fraction of young survive to breed for a cod that sheds 20 million eggs in her life, and for an elephant that bears 7 calves?',
      steps: [
        'Cod: $s = 2/(2\\times10^7) = 10^{-7}$ — one egg in ten million.',
        'Elephant: $s = 2/7 = 0.29$ — more than a quarter of calves reach breeding age.',
        'Both populations are stable: the cod pays with huge losses of cheap eggs, the elephant with years of care for each calf.'
      ],
      a: 'One in ten million for the cod; about 29 % for the elephant.'
    },
    {
      title: 'Why mice multiply and elephants do not',
      q: 'A mouse can leave 10 daughters per generation with a generation time of half a year; an elephant, 3 daughters with a generation time of 25 years. Compare their maximum rates of increase.',
      steps: [
        'Mouse: $r = \\ln 10/0.5 = 2.30/0.5 = 4.6$ per year — the population could grow a hundredfold in a year.',
        'Elephant: $r = \\ln 3/25 = 1.10/25 = 0.044$ per year — about 4.5 % a year.',
        'The generation time does most of the work: a hundredfold difference in r from a threefold difference in daughters and a fiftyfold difference in generation time.'
      ],
      a: 'About 4.6 per year for mice, 0.044 per year for elephants.'
    }
  ],
  quiz: [
    { q: 'What is the "twofold cost" of sex?', choices: ['Sex needs two gametes, which cost twice the energy', 'Half of a sexual female\'s offspring are sons, who cannot bear young themselves', 'Sexual animals live half as long', 'Meiosis halves the number of chromosomes'], a: 1,
      why: 'An asexual female turns all her offspring into daughters who all reproduce; a sexual female makes half sons, so her lineage grows half as fast.' },
    { q: 'Parthenogenesis is found only in invertebrates.', a: false,
      why: 'Whiptail lizards are all-female parthenogenetic species, and Komodo dragons, some snakes, sharks and birds occasionally reproduce this way.' },
    { q: 'A frog lays 2000 eggs a year for 4 years. In a stable population, what percentage of her eggs survive to breed?', answer: 0.025, unit: '%', why: '$s = 2/8000 = 0.00025 = 0.025$ %.' },
    { q: 'Which feature is most closely tied to reproduction on dry land?', choices: ['External fertilisation', 'Internal fertilisation with shelled eggs or live birth', 'Budding', 'Mass spawning'], a: 1,
      why: 'Out of water, sperm and eggs cannot be shed into the surroundings; internal fertilisation and eggs that resist drying (or retaining the young) solved this.' },
    { q: 'What decides whether a crocodile hatchling is male or female?', choices: ['Its X and Y chromosomes', 'Its Z and W chromosomes', 'The temperature of the nest during development', 'Whether the egg was fertilised'], a: 2,
      why: 'All crocodilians and many turtles have temperature-dependent sex determination.' }
  ],
  problems: [
    { q: 'Asexual females make up 10 % of a population. If they are otherwise equal to sexual females, what percentage will they make up after 5 generations?', answer: 78, unit: '%', tol: 0.02, steps: ['$f = 0.1 \\times 32/(1 + 0.1 \\times 31) = 3.2/4.1 = 0.78$.'] }
  ],
  applications: [
    'Fisheries management depends on life histories: long-lived, late-breeding fish such as sharks recover slowly from overfishing.',
    'Conservation breeding programmes and assisted reproduction for endangered species.',
    'Pest control uses sterile males (the sterile insect technique) to reduce populations of screwworm flies, fruit flies and mosquitoes.',
    'Temperature-dependent sex determination makes turtle populations vulnerable to warming beaches.'
  ],
  history: 'Lazzaro Spallanzani showed in the 1780s that frog eggs need contact with semen, using frogs fitted with little taffeta trousers. Oscar Hertwig watched sperm and egg nuclei fuse in sea-urchin eggs in 1876. Robert MacArthur and E. O. Wilson introduced r- and K-selection in 1967, and John Maynard Smith set out the twofold cost of sex in 1978.'
},

{
  id: 'animal-development', parent: 'animal-life', title: 'Embryonic development', level: 2,
  short: 'One cell becomes a body by cleavage, gastrulation into three germ layers, and organogenesis. Cells learn where they are from gradients of signals, and Hox genes — lined up on the chromosome in the order of the body parts they specify — pattern flies, mice and people alike.',
  keywords: ['development', 'embryo', 'fertilisation', 'cleavage', 'blastula', 'gastrulation', 'germ layers', 'ectoderm', 'mesoderm', 'endoderm', 'neurulation', 'protostome', 'deuterostome', 'induction', 'organiser', 'morphogen', 'French flag model', 'Bicoid', 'Hox genes', 'homeobox', 'colinearity', 'Pax6', 'evo-devo', 'body plan'],
  prereq: ['animal-reproduction', 'eukaryotic-regulation', 'cell-signalling', 'stem-cells'],
  related: ['evidence-evolution', 'phylogenetics', 'life-history-earth', 'apoptosis', 'mitosis', 'model-organisms', 'animal-hormones', 'medicine:pregnancy'],
  body: `
A frog's egg is a single cell about 1.2 mm across. Within two days it becomes a swimming tadpole with eyes, a beating heart, muscles and a nervous system. Development turns one cell into a body by a handful of kinds of step, remarkably similar across animals: dividing, moving, signalling, and switching genes on in the right places.

### From egg to body plan
1. **Fertilisation** activates the egg and restores the diploid genome.
2. **Cleavage**: rapid divisions without growth, cutting the egg into ever smaller cells. A frog's egg divides about every 30 minutes, reaching some 4000 cells after 12 divisions in about 7 hours; a fruit fly's first 13 nuclear divisions take about 8–10 minutes each; a mammal's cleavage is slow, about one division a day. The result is a ball of cells, the **blastula** (the blastocyst in mammals).
3. **Gastrulation**: cells move inwards through an opening, the blastopore, and form three **germ layers** — **ectoderm** (skin and nervous system), **mesoderm** (muscle, bone, blood, kidneys) and **endoderm** (the lining of the gut, liver and lungs). The developmental biologist Lewis Wolpert liked to say that gastrulation, not birth, marriage or death, is the most important event in your life.
4. **Organogenesis**: in vertebrates the ectoderm above the notochord rolls up into the neural tube (**neurulation**), the mesoderm divides into blocks called somites, and the organs take shape.

In **protostomes** — molluscs, annelids, arthropods — the blastopore usually becomes the mouth; in **deuterostomes** — echinoderms and chordates, including us — it becomes the anus and the mouth forms later. Jellyfish and their relatives build their bodies from only two germ layers.

### Signals and gradients
How does a cell know where it is? In 1924 Hans Spemann and Hilde Mangold grafted a small piece of the upper lip of the blastopore from one newt embryo into another, and the host grew a second, conjoined body: the graft had **induced** its neighbours to follow a new plan. Such **organisers** release signalling proteins that spread and form **gradients**; cells read the local concentration and switch on different genes above and below thresholds — Lewis Wolpert's **French flag** model (1969). In the fruit-fly egg the protein Bicoid falls off roughly exponentially from the front end, with a length constant of about 100 µm in an egg 500 µm long:

$$C = C_0\\,e^{-x/\\lambda}$$

Genes that need a high level switch on only near the head end, genes that need less further back — and when the mother carries extra copies of the *bicoid* gene, every boundary shifts towards the rear. Later, programmed cell death sculpts the body, removing the webbing between fingers and a tadpole's tail ([[apoptosis]]).

### Hox genes and conserved body plans
In 1894 William Bateson catalogued animals in which one body part had been replaced by another, and called it **homeosis**. Fruit flies with legs growing from their heads (*Antennapedia*) or with four wings instead of two (mutations in the *bithorax* complex) became the famous examples. The genes involved, the **Hox genes**, share a 180-base-pair **homeobox** encoding a DNA-binding domain, discovered in 1984. They lie on the chromosome in the same order as the body regions they specify, from head to tail (**colinearity**). A fly has 8 of them; mammals have 39 in four clusters, left by two duplications of the whole genome early in vertebrate history. The same genes pattern a fly, a mouse and a snake — which lost its limbs partly by extending the trunk's Hox pattern along its body.

Other tool-kit genes are just as ancient: the mouse gene *Pax6*, switched on in a fly's leg, makes an eye form there — a fly's eye, built by the fly's own genes. Nearly all animal body plans appear in the fossil record within a few tens of millions of years of the Cambrian, from about 538 million years ago, and have been varied on the same genetic tool kit ever since. That shared tool kit, studied by **evo-devo**, is one of the strongest lines of evidence for common descent ([[evidence-evolution]]).

> [!key] Cleavage divides the egg, gastrulation lays out the three germ layers, and organogenesis builds the body. Cells learn their position from gradients of signals read by threshold genes. Hox genes, in the same order on the chromosome as along the body, pattern animals from flies to people.

> [!note] Embryos of frogs, chicks, zebrafish and mice have taught most of this. Such research is regulated and follows the 3Rs — replace, reduce, refine — with cell cultures, organoids and computer models used wherever they can answer the question.
`,
  ideas: [
    'Cleavage divides the egg into many small cells without growth; gastrulation forms ectoderm, mesoderm and endoderm.',
    'Protostomes and deuterostomes differ in what the blastopore becomes: mouth or anus.',
    'Organisers induce their neighbours; gradients of signalling molecules, read at thresholds, tell cells where they are.',
    'Hox genes carry a homeobox, lie in the same order as the body regions they pattern, and are shared by nearly all animals.',
    'Deeply conserved developmental genes are strong evidence of common descent.'
  ],
  pitfalls: [
    'An embryo grows during cleavage — The cells divide without growing, so the embryo stays the size of the egg while its cells get smaller.',
    'Each body part has its own dedicated set of genes — A shared tool kit is reused everywhere; position comes from combinations and levels of the same signals and transcription factors.',
    'Hox genes are special to insects — Nearly all animals have them, and they pattern the head-to-tail axis of vertebrates, including humans.'
  ],
  formulas: [
    {
      name: 'An exponential morphogen gradient',
      expr: 'C = C0*exp(-x/lambda)', tex: 'C = C_0\\,e^{-x/\\lambda}',
      vars: {
        C: { name: 'concentration at distance x', q: 'concentration', unit: 'nM' },
        C0: { name: 'concentration at the source', q: 'concentration', unit: 'nM', value: 50, tex: 'C_0' },
        x: { name: 'distance from the source', q: 'length', unit: 'µm', value: 150 },
        lambda: { name: 'length constant of the gradient', q: 'length', unit: 'µm', value: 100, tex: '\\lambda' }
      },
      note: 'Made by a local source, diffusion and uniform breakdown: λ = √(D/k). A boundary where a gene needs a threshold C_T lies at x = λ ln(C₀/C_T), so doubling the source moves it back by λ ln 2.',
      practice: { unknowns: ['C', 'x', 'lambda'] },
      stories: {
        C: 'A morphogen is at {C0} at its source and falls off with a length constant of {lambda}. What is its concentration {x} away?',
        x: 'A gene switches on above {C}. The morphogen is {C0} at the source with a length constant of {lambda}. How far from the source does the boundary lie?',
        lambda: 'A morphogen falls from {C0} at the source to {C} at {x}. What is its length constant?'
      }
    },
    {
      name: 'Cells after synchronous cleavage',
      expr: 'N = 2^(t/tc)', tex: 'N = 2^{\\,t/t_c}',
      vars: {
        N: { name: 'number of cells', q: 'count' },
        t: { name: 'time since the first cleavage', q: 'time', unit: 'min', value: 360 },
        tc: { name: 'time per division', q: 'time', unit: 'min', value: 30, tex: 't_c' }
      },
      note: 'While cleavage divisions stay in step, as in early frog, fish and sea-urchin embryos.',
      practice: { unknowns: ['N', 't'] },
      stories: {
        N: 'A frog embryo\'s cells divide every {tc}. How many cells are there {t} after the first division?',
        t: 'An embryo\'s cells divide every {tc}. How long does it take to reach {N} cells?'
      }
    },
    {
      name: 'Cell size during cleavage',
      expr: 'd = d0*2^(-n/3)', tex: 'd = d_0\\,2^{-n/3}',
      vars: {
        d: { name: 'diameter of each cell', q: 'length', unit: 'µm' },
        d0: { name: 'diameter of the egg', q: 'length', unit: 'mm', value: 1.2, tex: 'd_0' },
        n: { name: 'number of divisions', int: true, value: 12 }
      },
      note: 'Without growth the total volume stays that of the egg, so each division halves the volume of a cell and shrinks its diameter by 2^(1/3) ≈ 1.26.',
      practice: { unknowns: ['d', 'n'] },
      stories: {
        d: 'A frog egg {d0} across cleaves {n} times without growing. How wide is each cell?',
        n: 'How many divisions shrink the cells of an egg {d0} across to {d}?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading the Bicoid gradient',
      q: 'Bicoid is about 50 nM at the front of a fly egg and falls off with a length constant of 100 µm. A gene is switched on where Bicoid exceeds 10 nM. Where is its boundary, and where does it move if the mother has two extra copies of *bicoid*, doubling $C_0$?',
      steps: [
        '$x = \\lambda \\ln(C_0/C_T) = 100 \\ln(50/10) = 100 \\times 1.61 = 161$ µm from the front.',
        'Doubled: $x = 100 \\ln(100/10) = 230$ µm — moved back by $\\lambda\\ln 2 = 69$ µm.',
        'This is what is seen: extra *bicoid* shifts the head–thorax boundary towards the rear of the embryo.'
      ],
      a: 'About 161 µm from the front; about 69 µm further back with double the Bicoid.'
    },
    {
      title: 'A frog egg cleaves',
      q: 'A 1.2 mm frog egg divides every 30 minutes, in step, 12 times. How many cells are there, how long does it take, and how wide is each cell?',
      steps: [
        '$N = 2^{12} = 4096$ cells.',
        'Time: $12 \\times 30 = 360$ minutes, 6 hours.',
        'Each cell: $d = 1200 \\times 2^{-12/3} = 1200/16 = 75$ µm across — close to the size of an ordinary body cell, at which point the embryo slows its divisions and starts reading its own genes.'
      ],
      a: '4096 cells in 6 hours, each about 75 µm across.'
    }
  ],
  quiz: [
    { q: 'Which germ layer gives rise to the nervous system?', choices: ['endoderm', 'mesoderm', 'ectoderm', 'none — it forms from the notochord'], a: 2,
      why: 'The neural tube forms from ectoderm, which is induced by the mesoderm of the notochord beneath it.' },
    { q: 'During cleavage the embryo grows rapidly in size.', a: false,
      why: 'Cleavage divides the egg into more and smaller cells without growth; the embryo stays about the size of the egg.' },
    { q: 'A morphogen is 40 nM at its source and has a length constant of 50 µm. What is its concentration 100 µm away?', answer: 5.41, unit: 'nM', why: '$C = 40\\,e^{-100/50} = 40\\,e^{-2} = 5.41$ nM.' },
    { q: 'What does the "colinearity" of Hox genes mean?', choices: ['All Hox genes are identical', 'Their order on the chromosome matches the order of the body regions they pattern', 'They lie on every chromosome', 'They are expressed in a line of cells'], a: 1,
      why: 'Genes at one end of the cluster act at the head end, genes at the other end towards the tail — in flies and vertebrates alike.' },
    { q: 'What did the Spemann–Mangold experiment show?', choices: ['That cells keep all their genes', 'That a small group of cells (the organiser) can induce neighbouring cells to form a new body axis', 'That the blastopore becomes the mouth', 'That Hox genes exist'], a: 1,
      why: 'Grafted dorsal-lip tissue induced the host\'s cells to build a second, conjoined embryo: induction by an organiser.' }
  ],
  problems: [
    { q: 'An embryo\'s cells divide every 30 minutes. How many minutes after the first division does it reach 1000 cells?', answer: 299, unit: 'min', tol: 0.02, steps: ['$t = t_c \\log_2 N = 30 \\times \\log_2 1000 = 30 \\times 9.97 = 299$ min — about 5 hours.'] }
  ],
  applications: [
    'Understanding birth defects, and why some medicines and infections are dangerous at particular stages of pregnancy.',
    'Stem-cell biology and organoids re-run developmental signals in the laboratory to grow tissues.',
    'Evo-devo explains how new body forms, such as limbless snakes or the turtle shell, evolved by changing when and where tool-kit genes act.',
    'Zebrafish and frog embryos are used to test chemicals for toxicity to development.'
  ],
  history: 'Hans Spemann and Hilde Mangold published the organiser experiment in 1924; Spemann received the Nobel Prize in 1935 (Mangold had died in 1924). Edward Lewis, Christiane Nüsslein-Volhard and Eric Wieschaus shared the 1995 Nobel Prize for the genetics of fly development. The homeobox was found in 1984 by the groups of Walter Gehring and Matthew Scott.',
  sim: 'ani-morphogen'
},

{
  id: 'scaling-allometry', parent: 'animal-life', title: 'Size, scaling and metabolism', level: 2,
  short: 'Body size shapes physiology through simple power laws. Surfaces grow as mass to the 2/3, resting metabolism as mass to the 3/4 (Kleiber\'s law), heart rate falls as mass to the −1/4 and lifespan rises as mass to about the 1/4 — so a mouse and an elephant both get about a billion heartbeats, and elephants need big ears.',
  keywords: ['allometry', 'scaling', 'body size', "Kleiber's law", 'metabolic rate', 'surface to volume ratio', 'power law', 'log–log plot', 'isometry', 'heart rate', 'lifespan', 'heartbeats per lifetime', "Bergmann's rule", "Allen's rule", 'elephant ears', 'mass-specific metabolic rate', 'quarter-power scaling'],
  prereq: ['cell-theory', 'thermoregulation-animals', 'math:power-functions', 'math:logarithmic-scales'],
  related: ['circulation-animals', 'gas-exchange-animals', 'muscles-movement', 'energy-flow', 'population-growth', 'animal-reproduction', 'math:scaling-laws', 'math:linear-regression', 'medicine:metabolism-energy', 'medicine:energy-balance'],
  body: `
A mouse and an elephant are built of the same kinds of cells, burn the same fuels with the same enzymes, and differ in mass 160 000-fold. Yet the elephant's resting metabolism is not 160 000 times the mouse's but only about 8000 times; its heart beats 20 times more slowly; and it lives fifteen to twenty times longer. These differences follow simple power laws of body mass, and much of physiology can be read from them.

### Surfaces and volumes
If an animal doubles in length while keeping its shape, every area — skin, gut lining, bone cross-section — grows four times, and every volume, and so its mass, eight times. Surface area therefore grows only as $M^{2/3}$, and the ratio of surface to volume falls as size rises: a cube of side $L$ has $S/V = 6/L$. Cells stay small because they feed through their surface ([[cell-theory]]); animals grow large only by adding lungs, gills, guts and blood vessels that fold huge surfaces inside them. Galileo noticed in 1638 that a giant's bones cannot simply be scaled-up human bones: their strength grows with cross-section ($L^2$) and the weight they carry with volume ($L^3$), so big animals need disproportionately thick bones — an elephant's skeleton is about 13 % of its mass, a shrew's about 4 %.

### The allometric equation
Biologists describe such trends with a power law, $Y = aM^b$, which on logarithmic axes is a straight line whose slope is the exponent:

$$\\log Y = \\log a + b\\,\\log M$$

If $b = 1$ the trait is **isometric**, proportional to mass: blood volume (about 7 % of body mass in mammals), heart mass (about 0.6 %), lung volume. If $b < 1$ it grows more slowly than mass; if $b > 1$, faster.

| Quantity (mammals, M in kg) | Exponent b | Approximate formula |
|---|---|---|
| resting metabolic rate | 0.75 | $3.4\\,M^{0.75}$ W |
| metabolic rate per kilogram | −0.25 | $3.4\\,M^{-0.25}$ W/kg |
| heart rate | −0.25 | $241\\,M^{-0.25}$ per minute |
| breathing rate | −0.26 | $54\\,M^{-0.26}$ per minute |
| maximum lifespan | 0.20 | $11.8\\,M^{0.20}$ years |
| skeleton mass | 1.09 | $0.061\\,M^{1.09}$ kg |

### Kleiber's law
Max Kleiber showed in 1932 that resting metabolic rate across mammals rises as the three-quarter power of mass, $B \\approx 3.4\\,M^{0.75}$ W — about 80 W for a 70 kg person, 0.2 W for a mouse and 1.7 kW for an elephant. Per kilogram, a mouse burns about 20 times as much as an elephant, which is why a shrew eats roughly its own weight in food each day and cannot survive a few hours without eating, while a python can wait months between meals. Why 3/4 and not the 2/3 of surface area? The question is still open. Max Rubner's surface law of 1883 predicted 2/3; in 1997 Geoffrey West, James Brown and Brian Enquist argued that branching networks of vessels impose 3/4; careful reanalyses find exponents between about 0.67 and 0.75, depending on the group and on how "resting" is measured. Birds, reptiles and fish follow similar lines at different heights.

### Life at different speeds
Heart rate and breathing rate fall as about $M^{-1/4}$, while lifespan, pregnancy and the time to maturity rise roughly as $M^{1/4}$ or $M^{0.2}$. Their product hardly depends on size: a mammal's heart beats about a billion times in a lifetime, whether it belongs to a mouse (600 a minute for 3–4 years) or an elephant (30 a minute for 60–70 years). Humans, at about three billion, are the outliers; birds and bats live two or three times as long as mammals of their size, and some bats far longer.

### Big ears and small bodies
Scaling explains many designs. Heat production rises as $M^{3/4}$ but skin area only as $M^{2/3}$, so a big animal must shed more heat through each square metre of skin: an elephant, about three times as much as a mouse. African elephants flap enormous, thin ears — by some estimates a fifth of their skin area — laced with blood vessels, and they wallow and spray water. At the other end, the smallest endotherms, the 2 g Etruscan shrew and bee hummingbird, are close to the limit where heat loss would outrun any possible rate of eating. Mammals of cold climates tend to be larger, with shorter ears and limbs, than their relatives in warm ones (Bergmann's and Allen's rules): compare the arctic fox with the desert fennec (see [[thermoregulation-animals]]).

> [!key] Body size shapes physiology through power laws: surfaces grow as $M^{2/3}$, metabolic rate as $M^{3/4}$, heart rate falls as $M^{-1/4}$ and lifespan rises as about $M^{1/4}$. On log–log axes each is a straight line whose slope is the exponent.
`,
  ideas: [
    'At constant shape, areas grow as length² and masses as length³, so surface area scales as M^2/3 and surface-to-volume falls with size.',
    'Allometric relations Y = aM^b are straight lines on log–log axes, with slope b.',
    'Kleiber\'s law: resting metabolic rate ≈ 3.4 M^0.75 W; per kilogram, small animals burn far more.',
    'Heart rate scales as M^−1/4 and lifespan roughly as M^1/4, so most mammals get about a billion heartbeats.',
    'Big animals struggle to lose heat and small ones to keep it — hence elephant ears and the lower size limit of endotherms.'
  ],
  pitfalls: [
    'A big animal is just a scaled-up small one — Keeping the same shape would make its bones too weak and its surfaces too small; big animals have thicker bones and more folded surfaces.',
    'An elephant uses 160 000 times as much energy as a mouse because it is 160 000 times heavier — Metabolic rate scales as M^3/4, so only about 8000 times; per kilogram the elephant uses twenty times less.',
    'The 3/4 exponent is a settled law of nature — It is an empirical fit; measured exponents range from about 0.67 to 0.75 and the reason is still debated.'
  ],
  formulas: [
    {
      name: 'Kleiber\'s law',
      expr: 'B = a*M^0.75', tex: 'B = a\\,M^{3/4}',
      vars: {
        B: { name: 'resting (basal) metabolic rate', q: 'power', unit: 'W' },
        a: { name: 'Kleiber\'s coefficient for mammals', unit: 'W/kg^0.75', value: 3.4, fixed: true },
        M: { name: 'body mass', q: 'mass', unit: 'kg', value: 70 }
      },
      note: 'Kleiber (1932): about 70 kcal a day × M^0.75. An empirical fit across mammals from mice to cattle; individual species lie within a factor of about two of it.',
      practice: { unknowns: ['B', 'M'] },
      stories: {
        B: 'Estimate the resting metabolic rate of a {M} mammal.',
        M: 'A mammal\'s resting metabolic rate is {B}. Roughly how heavy is it?'
      }
    },
    {
      name: 'Maximum lifespan of mammals',
      expr: 'L = a*M^0.2', tex: 'L = a\\,M^{0.2}',
      vars: {
        L: { name: 'maximum lifespan', q: 'time', unit: 'yr' },
        a: { name: 'lifespan of a 1 kg mammal', q: 'time', unit: 'yr', value: 11.8, fixed: true },
        M: { name: 'body mass', q: 'mass', unit: 'kg', value: 4 }
      },
      note: 'A fit to captive mammals (after Sacher and Calder). Bats, primates and especially humans live longer than it predicts; mice and shrews somewhat shorter.',
      practice: { unknowns: ['L', 'M'] },
      stories: {
        L: 'Predict the maximum lifespan of a {M} mammal.',
        M: 'A mammal can live {L}. How heavy would the rule predict it to be?'
      }
    },
    {
      name: 'Heartbeats in a lifetime',
      expr: 'N = f*L', tex: 'N = f\\,L',
      vars: {
        N: { name: 'heartbeats in a lifetime', q: 'count' },
        f: { name: 'average heart rate', q: 'frequency', unit: 'bpm', value: 600 },
        L: { name: 'lifespan', q: 'time', unit: 'yr', value: 3.5 }
      },
      note: 'Since f ∝ M^−0.25 and L ∝ M^0.2 or so, the product changes very little with size: about 1 × 10⁹ for most mammals.',
      practice: { unknowns: ['N', 'L'] },
      stories: {
        N: 'A heart beats at {f} on average for {L}. How many beats is that?',
        L: 'A heart beating at {f} gives about {N} beats. How long a life is that?'
      }
    },
    {
      name: 'Comparing two animals with a power law',
      expr: 'R = m^b', tex: 'R_Y = R_M^{\\,b}',
      vars: {
        R: { name: 'ratio of the quantity, Y₂/Y₁ (big ÷ small)', tex: 'R_Y' },
        m: { name: 'ratio of the body masses, M₂/M₁ (big ÷ small)', value: 160000, tex: 'R_M' },
        b: { name: 'scaling exponent', value: 0.75, signed: true }
      },
      note: 'Y₂/Y₁ = (M₂/M₁)^b follows from any allometric relation Y = aM^b, whatever a is. Use b = 0.75 for metabolic rate, −0.25 for heart rate, 2/3 for surface area, 1 for blood volume.',
      practice: { unknowns: ['R', 'b'] },
      stories: {
        R: 'An elephant is {m} times as heavy as a mouse. If a quantity scales with exponent {b}, how many times larger is it in the elephant?',
        b: 'An animal {m} times heavier than another has a quantity {R} times larger. What is the scaling exponent?'
      }
    }
  ],
  examples: [
    {
      title: 'Mouse and elephant',
      q: 'An elephant (4000 kg) is 160 000 times as heavy as a mouse (25 g). Using Kleiber\'s law, compare their resting metabolic rates in total and per kilogram.',
      steps: [
        'Mouse: $B = 3.4 \\times 0.025^{0.75} = 3.4 \\times 0.0629 = 0.21$ W, or 8.6 W/kg.',
        'Elephant: $B = 3.4 \\times 4000^{0.75} = 3.4 \\times 503 = 1710$ W, or 0.43 W/kg.',
        'Ratio of totals: $160\\,000^{0.75} = 8000$; per kilogram the mouse burns $160\\,000^{0.25} = 20$ times as much.'
      ],
      a: 'The elephant uses about 8000 times as much energy in total, but one-twentieth as much per kilogram.'
    },
    {
      title: 'A billion heartbeats',
      q: 'A mouse\'s heart beats about 600 times a minute for a life of 3.5 years; an elephant\'s about 30 times a minute for 65 years. Compare the lifetime totals.',
      steps: [
        'Minutes in a year: $60 \\times 24 \\times 365 = 525\\,600$.',
        'Mouse: $600 \\times 525\\,600 \\times 3.5 = 1.1\\times10^9$.',
        'Elephant: $30 \\times 525\\,600 \\times 65 = 1.0\\times10^9$.',
        'Almost the same — the fast life and the slow life run for the same number of beats. A person at 70 a minute for 80 years reaches about $2.9\\times10^9$.'
      ],
      a: 'About a billion beats each.'
    },
    {
      title: 'Why elephants need big ears',
      q: 'Skin area of a mammal is roughly $0.1\\,M^{2/3}$ m² (M in kg). Compare the heat an elephant (4000 kg) and a mouse (25 g) must shed per square metre of skin at rest.',
      steps: [
        'Elephant: area $= 0.1 \\times 4000^{2/3} = 0.1 \\times 252 = 25$ m²; heat $1710/25 = 68$ W/m².',
        'Mouse: area $= 0.1 \\times 0.025^{2/3} = 0.0086$ m²; heat $0.21/0.0086 = 25$ W/m².',
        'The elephant must shed $160\\,000^{0.75 - 0.667} \\approx 2.7$ times as much per square metre — on a hot day, when its skin is barely cooler than the air, it needs the extra area of its ears and the evaporation of water.'
      ],
      a: 'About 68 against 25 W/m² — nearly three times as much.'
    }
  ],
  quiz: [
    { q: 'An animal doubles in length but keeps its shape. By what factor does its mass change?', choices: ['2', '4', '8', '16'], a: 2,
      why: 'Mass is proportional to volume, which scales as length cubed: $2^3 = 8$. Its surface grows only 4 times.' },
    { q: 'By Kleiber\'s law, how many times higher is the resting metabolic rate of a mammal 16 times heavier than another?', answer: 8, why: '$16^{0.75} = (2^4)^{3/4} = 2^3 = 8$.' },
    { q: 'Gram for gram, a shrew\'s body uses energy faster than an elephant\'s.', a: true,
      why: 'Metabolic rate per kilogram scales as M^−0.25: the small animal burns many times more per gram.' },
    { q: 'On log–log axes, resting heart rate plotted against body mass is a straight line with slope…', choices: ['+0.75', '+0.25', '−0.25', '−0.75'], a: 2,
      why: 'Heart rate ∝ M^−0.25, and on log–log axes the slope of a power law is its exponent.' },
    { q: 'Why do African elephants have such large, thin ears?', choices: ['To hear distant calls', 'Their heat production per square metre of skin is higher than a small animal\'s, and the ears add area for losing heat', 'To frighten predators', 'To store fat'], a: 1,
      why: 'Heat production grows as M^3/4 but skin area as M^2/3; blood-filled ears flapped in the breeze add surface for losing heat. (They also use them to signal.)' }
  ],
  problems: [
    { q: 'Estimate the resting metabolic rate of a 10 kg dog by Kleiber\'s law.', answer: 19.1, unit: 'W', tol: 0.02, steps: ['$B = 3.4 \\times 10^{0.75} = 3.4 \\times 5.62 = 19.1$ W.'] },
    { q: 'Predict the maximum lifespan, in years, of a 100 kg mammal from $L = 11.8\\,M^{0.2}$.', answer: 29.6, unit: 'yr', tol: 0.02, steps: ['$100^{0.2} = 2.51$, so $L = 11.8 \\times 2.51 = 29.6$ years.'] }
  ],
  applications: [
    'Compare metabolic rates from mouse to elephant in [the scaling calculator](#/tools/cell/scale).',
    'Vets and zookeepers scale drug doses and feed between species by metabolic body mass (M^0.75), not by body mass.',
    'Pharmacologists use allometric scaling to estimate a first human dose from animal studies.',
    'Ecologists estimate the food needs and population densities of animals from their size.',
    'Engineers and biologists use the same scaling reasoning for bridges, aircraft and robots.'
  ],
  history: 'Galileo discussed the scaling of bones in 1638. Max Rubner proposed the surface law in 1883, and Max Kleiber published the three-quarter-power law in 1932 (his book *The Fire of Life* followed in 1961). Julian Huxley named allometry in the 1930s. West, Brown and Enquist\'s network theory of 1997 revived the debate over why the exponent is 3/4.',
  sim: 'ani-allometry'
}

);
