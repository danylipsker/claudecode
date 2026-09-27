/* HYPER-PNEUMATICS · content/treatment.js
 * Branch "Air Treatment": water and drying (moisture-drying) and air quality (air-quality).
 * Simulations in sims/treatment.js (prefix treat-).
 */
Hyper.add(

/* ================================================================ WATER AND DRYING */
{
  id: 'condensate', parent: 'moisture-drying', title: 'Where the water comes from', level: 1,
  short: 'Air always carries water vapour. A compressor squeezes several cubic metres of it into one, and when the compressed air cools, most of that vapour must condense: tens to hundreds of litres a day from an ordinary factory compressor.',
  keywords: ['condensate', 'water in compressed air', 'humidity', 'water vapour', 'saturation', 'dew point', 'pressure dew point', 'litres per day', 'moisture', 'Magnus formula', 'free air delivery', 'absolute humidity'],
  prereq: ['humidity-dew-point', 'pressure-dew-point', 'standard-air'],
  related: ['aftercoolers', 'refrigerated-dryers', 'desiccant-dryers', 'condensate-drains', 'iso-8573', 'drops-drains', 'receivers', 'partial-pressures', 'chemistry:vapor-pressure', 'physics:latent-heat'],
  body: `
Every cubic metre of the air around us carries water as invisible vapour — about 14 grams on a warm day at 25 °C and 60 % humidity, more than 20 grams on a humid summer day. A compressor takes in eight cubic metres of that air and squeezes them into one. The air is hot while it is compressed, so at first the water stays a vapour; but as soon as the compressed air cools back towards room temperature, the vapour no longer fits and condenses as liquid. That liquid, mixed with oil and dirt, is **condensate** — and an ordinary factory compressor makes tens to hundreds of litres of it a day.

### How much water air can hold
How much vapour a space can hold depends only on its temperature. The limit is the saturation [[chemistry:vapor-pressure|vapour pressure]] of water $p_s$, which roughly doubles for every 11 K:

| Temperature | $p_s$ | Water in saturated air |
|---|---|---|
| −40 °C | 19 Pa | 0.18 g/m³ |
| −20 °C | 126 Pa | 1.1 g/m³ |
| 0 °C | 611 Pa | 4.8 g/m³ |
| +3 °C | 758 Pa | 5.9 g/m³ |
| 20 °C | 2.33 kPa | 17.2 g/m³ |
| 25 °C | 3.16 kPa | 23.0 g/m³ |
| 35 °C | 5.61 kPa | 39.5 g/m³ |
| 45 °C | 9.58 kPa | 65.2 g/m³ |

The relative humidity $\\varphi$ is the share of that limit actually present, and the vapour content is $c_w = \\varphi\\,p_s/(R_v T)$ with $R_v = 461.5$ J/(kg·K), the gas constant of water vapour (see [[humidity-dew-point]]).

### Squeezing the vapour
The key fact: the limit is per cubic metre of *space*, whatever the pressure of the air in it. Compress a cubic metre of intake air at 25 °C and 60 % to 7 bar gauge (8.0 bar absolute) and it shrinks to about 0.13 m³ — but it still carries its 13.8 g of water. Cooled back to 35 °C, those 0.13 m³ can hold only $39.5 \\times 0.13 = 5.2$ g; the other **8.6 g must condense**. In the language of [[partial-pressures]]: compression multiplies the vapour's partial pressure by the pressure ratio, from 1.9 kPa to 15 kPa here, so the compressed air's dew point — its [[pressure-dew-point]] — is about 54 °C. Every surface cooler than that gets wet.

Per cubic metre of free air, the water the compressed air can still carry at temperature $T_2$ is

$$c_\\text{out} = c_s\\,\\frac{p_\\text{atm}}{p_g + p_\\text{atm}}\\,\\frac{T_2}{T_1}$$

— the saturation content at $T_2$ divided by the pressure ratio: at 7 bar gauge only an eighth of what the same air could carry unpressurised.

### Litres a day
Multiply by the compressor's free air delivery and its running hours. A compressor delivering 10 m³/min for 16 hours a day handles 9600 m³ of air; at 8.6 g each that is **83 litres of water a day**. Try your own numbers in [water in the air](#/tools/pneu/air).

| Intake air | Water drawn in | Condensed at 7 bar, cooled to 10 K above intake | Per day at 10 m³/min for 16 h |
|---|---|---|---|
| 5 °C, 80 % | 5.4 g/m³ | 3.8 g/m³ | 36 L |
| 20 °C, 50 % | 8.6 g/m³ | 4.7 g/m³ | 45 L |
| 25 °C, 60 % | 13.8 g/m³ | 8.6 g/m³ | 83 L |
| 35 °C, 80 % | 31.6 g/m³ | 23.1 g/m³ | 221 L |

### Why it matters
Liquid water rusts steel pipes (and the rust then travels downstream as scale), washes the grease out of valves and cylinders, freezes in outdoor lines, spoils paint and food, feeds bacteria and upsets instruments. And it is not clean water: it carries compressor oil and whatever dirt the air drew in, so it has to be collected and treated as oily waste ([[condensate-drains]]).

> [!key] A compressor does not add water; it concentrates the water the air already carried. Whatever is not removed will condense wherever the compressed air meets something colder than its pressure dew point.

> [!warn] Condensate collects in receivers, separators and low points at full line pressure. Drain valves discharge with force: pipe them to a collecting vessel, never open a drain towards a person, and depressurise before servicing drains or opening pipes.
`,
  ideas: [
    'Air holds a limited amount of water vapour per cubic metre of space, set only by temperature: 17 g/m³ at 20 °C, 40 g/m³ at 35 °C.',
    'Compression shrinks the space but keeps the water, so the vapour\'s partial pressure rises by the pressure ratio and its dew point jumps — to about 54 °C for humid air at 7 bar.',
    'When the compressed air cools, everything above the saturation content condenses: typically 5–25 g per m³ of free air.',
    'Condensate per day = free air delivery × running time × water condensed per cubic metre: tens to hundreds of litres.',
    'Hot, humid weather makes several times more condensate than cool, dry weather.'
  ],
  pitfalls: [
    'The compressor puts water into the air — It only concentrates the vapour the intake air already carried; the mass of water per cubic metre of free air is unchanged until it condenses.',
    'Dry-looking air has no water — Relative humidity describes how full the air is, not how much it holds: cold foggy air at 100 % carries less water than a hot, dry-feeling day at 40 %.',
    'Once the aftercooler has taken the water out, the air is dry — Air leaving an aftercooler is saturated: it condenses more water as soon as it cools any further, in the receiver and the pipes.'
  ],
  formulas: [
    {
      name: 'Water vapour content of air (Magnus)',
      expr: 'c = 1000*phi*611.2*exp(17.62*t/(243.12 + t))/(461.5*(t + 273.15))',
      tex: 'c_w = \\dfrac{1000\\,\\varphi \\cdot 611.2\\,\\exp\\left(\\dfrac{17.62\\,t}{243.12 + t}\\right)}{461.5\\,(t + 273.15)}',
      vars: {
        c: { name: 'water vapour per cubic metre', q: false, unit: 'g/m³', tex: 'c_w' },
        phi: { name: 'relative humidity', q: 'ratio', unit: '%', value: 60, min: 0.1, max: 100, tex: '\\varphi' },
        t: { name: 'air temperature', q: false, unit: '°C', value: 25, min: -40, max: 60, signed: true }
      },
      note: 'The saturation vapour pressure over water by the Magnus formula (Pa, with the constants recommended by the World Meteorological Organization), divided by $R_v T$ with $R_v = 461.5$ J/(kg·K); the factor 1000 turns kg into g. Good to about 0.5 % between −40 and +50 °C; below 0 °C it gives the pressure over supercooled water (over ice it is a little lower).',
      practice: { unknowns: ['c', 't'] },
      stories: {
        c: 'Air at {t} has a relative humidity of {phi}. How many grams of water vapour does each cubic metre carry?',
        t: 'Air at {phi} relative humidity carries {c} of water vapour. What is its temperature?',
        phi: 'Air at {t} carries {c} of water vapour. What is its relative humidity?'
      }
    },
    {
      name: 'Water the compressed air can still carry',
      expr: 'cout = cs*patm/(p + patm)*T2/T1',
      tex: 'c_\\text{out} = c_s\\,\\dfrac{p_\\text{atm}}{p_g + p_\\text{atm}}\\,\\dfrac{T_2}{T_1}',
      vars: {
        cout: { name: 'water still carried, per m³ of free air', q: 'density', unit: 'g/m³', tex: 'c_\\text{out}' },
        cs: { name: 'saturation content at the cooled temperature', q: 'density', unit: 'g/m³', value: 39.47, tex: 'c_s' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        p: { name: 'line pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_g' },
        T2: { name: 'temperature the compressed air is cooled to', q: 'temperature', unit: '°C', value: 35, min: -40, max: 100, tex: 'T_2' },
        T1: { name: 'intake air temperature', q: 'temperature', unit: '°C', value: 25, min: -30, max: 50, tex: 'T_1' }
      },
      note: 'A cubic metre of intake air at $T_1$ and atmospheric pressure, compressed to $p_g$ and cooled to $T_2$, occupies $(p_\\text{atm}/p_\\text{abs})(T_2/T_1)$ m³; saturated, it holds $c_s$ grams in each. The temperatures are absolute in the ratio (the calculator converts °C to kelvin). Compare with the water drawn in to find what condenses.',
      practice: { unknowns: ['cout', 'p'] },
      stories: {
        cout: 'Air drawn in at {T1} is compressed to {p} and cooled to {T2}, where saturated air holds {cs}. How much water can it still carry per cubic metre of free air?',
        p: 'Saturated air at {T2} holds {cs}. To what gauge pressure must air drawn in at {T1} be compressed so that, cooled to {T2}, it can carry only {cout} per m³ of free air?'
      }
    },
    {
      name: 'Condensate from a compressor',
      expr: 'W = Q*t*(cin - cout)',
      tex: 'm_w = Q\\,t\\,(c_\\text{in} - c_\\text{out})',
      vars: {
        W: { name: 'condensate (1 kg is about 1 L)', q: 'mass', unit: 'kg', tex: 'm_w' },
        Q: { name: 'free air delivery of the compressor', q: 'airflow', unit: 'm³/min ANR', value: 10 },
        t: { name: 'running time', q: 'time', unit: 'h', value: 16 },
        cin: { name: 'water drawn in, per m³ of free air', q: 'density', unit: 'g/m³', value: 13.78, tex: 'c_\\text{in}' },
        cout: { name: 'water still carried after cooling', q: 'density', unit: 'g/m³', value: 5.16, tex: 'c_\\text{out}' }
      },
      note: 'Free air counted at intake conditions, as a compressor\'s free air delivery is (ISO 1217). The water that stays as vapour travels on to the dryer.',
      practice: { unknowns: ['W', 'Q', 't'] },
      stories: {
        W: 'A compressor delivers {Q} for {t}. Each cubic metre drawn in carries {cin} of water and leaves the aftercooler with {cout}. How much condensate is produced?',
        Q: 'An aftercooler drains {W} of condensate in {t}. The air drew in {cin} per m³ and leaves with {cout}. What is the compressor\'s free air delivery?'
      }
    }
  ],
  examples: [
    {
      title: 'Litres a day on a summer day',
      q: 'A compressor delivers 12 m³/min of free air at 7 bar gauge, 16 hours a day. The intake air is at 30 °C and 70 % humidity; the aftercooler cools the compressed air to 40 °C. How much water condenses?',
      steps: [
        'Water drawn in: $p_s(30\\,°\\text{C}) = 4234$ Pa, so $c_\\text{in} = 0.7 \\times 4234/(461.5 \\times 303.15) = 0.0212$ kg/m³ = 21.2 g/m³.',
        'Saturated at 40 °C: $p_s = 7368$ Pa, $c_s = 7368/(461.5 \\times 313.15) = 0.0510$ kg/m³ = 51.0 g/m³.',
        'Per m³ of free air after compression and cooling: $c_\\text{out} = 51.0 \\times \\tfrac{1.013}{8.013} \\times \\tfrac{313.15}{303.15} = 6.66$ g.',
        'Condensed: $21.2 - 6.66 = 14.5$ g per m³ — 69 % of the water drawn in.',
        'Air per day: $12 \\times 60 \\times 16 = 11\\,520$ m³; water: $11\\,520 \\times 14.5 = 167\\,000$ g.'
      ],
      a: 'About 167 kg — some 167 litres of condensate a day, with 6.7 g per m³ still travelling on as vapour.'
    },
    {
      title: 'What the pipes would do without a dryer',
      q: 'The air of the previous example leaves the aftercooler saturated at 40 °C and runs through a factory whose pipes are at 20 °C. How much more water condenses in the pipes each day?',
      steps: [
        'Saturated at 20 °C: $c_s = 17.24$ g/m³, so per m³ of free air the compressed air can carry $17.24 \\times \\tfrac{1.013}{8.013} \\times \\tfrac{293.15}{303.15} = 2.11$ g.',
        'It arrives with 6.66 g: $6.66 - 2.11 = 4.55$ g per m³ condenses in the pipes.',
        'Per day: $11\\,520 \\times 4.55 = 52\\,400$ g.'
      ],
      a: 'About 52 litres a day would condense along the network, in valves and cylinders — the reason for a dryer.'
    }
  ],
  quiz: [
    { q: 'Compressing air to 7 bar gauge adds water to it.', a: false,
      why: 'The water was already in the intake air. Compression squeezes it into a smaller volume, raising the vapour\'s partial pressure eightfold, so it condenses when the air cools.' },
    { q: 'How many grams of water vapour does a cubic metre of air at 20 °C and 50 % relative humidity carry? ($p_s$ = 2333 Pa)', answer: 8.62, unit: 'g/m³', tol: 0.03,
      why: '$c_w = 0.5 \\times 2333/(461.5 \\times 293.15) = 8.62\\times10^{-3}$ kg/m³ = 8.62 g/m³.' },
    { q: 'The same compressor, same intake air and same aftercooler temperature (35 °C), but the line pressure is raised from 6 to 8 bar gauge. The condensate…', choices: ['falls, because less air is compressed', 'rises, because air at a higher pressure can carry less water per m³ of free air', 'rises eightfold', 'is unchanged: the water drawn in is the same'], a: 1,
      why: '$c_\\text{out}$ falls with the absolute pressure: from 5.9 to 4.6 g per m³ of free air, so the condensate rises from 7.9 to 9.2 g/m³, about 16 %.' },
    { q: 'Which intake air makes the most condensate per cubic metre?', choices: ['a foggy winter morning, 2 °C and 100 %', 'a hot desert afternoon, 40 °C and 15 %', 'a humid summer evening, 28 °C and 80 %', 'a mild spring day, 15 °C and 60 %'], a: 2,
      why: 'The absolute water content decides: 5.6, 7.6, 21.7 and 7.7 g/m³ respectively. High relative humidity at a low temperature is little water.' },
    { q: 'Intake air at 25 °C and 60 % has an atmospheric dew point of about 17 °C. Compressed to 7 bar gauge, its pressure dew point is about…', choices: ['17 °C, the same', '25 °C', '54 °C', '−40 °C'], a: 2,
      why: 'The vapour partial pressure is multiplied by the pressure ratio, 1.90 kPa × 7.91 = 15.0 kPa, whose dew point is 54 °C.' }
  ],
  problems: [
    { q: 'A compressor delivers 5 m³/min of free air for 8 hours a day. Each cubic metre brings in 10 g of water and leaves the aftercooler with 4 g. How much condensate does the aftercooler produce per day?', answer: 14.4, unit: 'L', tol: 0.02,
      steps: ['Air per day: $5 \\times 60 \\times 8 = 2400$ m³.', 'Condensed: $10 - 4 = 6$ g per m³, so $2400 \\times 6 = 14\\,400$ g.', 'That is 14.4 kg — about 14.4 litres.'] },
    { q: 'Saturated air at 35 °C holds 39.5 g/m³. Intake air at 25 °C is compressed to 8 bar gauge and cooled to 35 °C. How much water can it still carry per m³ of free air?', answer: 4.59, unit: 'g/m³', tol: 0.02,
      steps: ['$c_\\text{out} = 39.5 \\times \\tfrac{1.013}{9.013} \\times \\tfrac{308.15}{298.15}$.', '$= 39.5 \\times 0.1124 \\times 1.0335 = 4.59$ g/m³.'] }
  ],
  applications: [
    'Sizing drains, separators and oil–water treatment for a compressor room.',
    'Estimating the water load a dryer must remove, summer and winter.',
    'Explaining why outdoor air lines freeze in winter and why pipes sweat in summer.',
    'Deciding where to take drops from a main (from the top) and where to fit drains (at the low points).'
  ],
  history: 'The exponential formula used here for the saturation vapour pressure goes back to Gustav Magnus, who fitted it to his measurements in 1844; the constants 611.2 Pa, 17.62 and 243.12 °C are a modern fit recommended by the World Meteorological Organization.',
  sim: 'treat-chain'
},

{
  id: 'aftercoolers', parent: 'moisture-drying', title: 'Aftercoolers and separators', level: 1,
  short: 'A heat exchanger straight after the compressor cools the hot air to about 10 K above the cooling air or water, so most of the water condenses at one place, where a separator throws the droplets out and a drain removes them.',
  keywords: ['aftercooler', 'separator', 'cyclone separator', 'moisture separator', 'approach temperature', 'heat exchanger', 'discharge temperature', 'air-cooled', 'water-cooled', 'saturated air'],
  prereq: ['condensate', 'physics:specific-heat', 'physics:latent-heat'],
  related: ['refrigerated-dryers', 'condensate-drains', 'heat-recovery', 'receivers', 'compression-work', 'screw-compressors', 'physics:heat-transfer', 'physics:centripetal-force'],
  body: `
Air leaves a compressor hot. In an oil-injected screw compressor the oil soaks up most of the heat of compression, and the air comes out of the element at about 80–95 °C; oil-free screws and piston compressors discharge at 150–220 °C ([[compression-work]]). The first step of air treatment cools it right there, in an **aftercooler**, before it reaches the receiver and the pipes — because cooling is what makes the water condense, and it is far better to condense it at one place where it can be collected than all over the factory.

### How an aftercooler works
An aftercooler is a heat exchanger: finned tubes with a fan blowing room air across them (air-cooled, built into almost every packaged compressor), or a shell-and-tube exchanger with cooling water (water-cooled, common on large machines). Its performance is described by the **approach** — how close the air gets to the temperature of the cooling medium — or by its effectiveness $\\varepsilon$, the share of the largest possible temperature drop it achieves. Typical figures:

| Aftercooler | Cools the air to |
|---|---|
| Air-cooled, in a packaged compressor | about 10–15 K above the room air |
| Water-cooled, shell and tube | about 5–10 K above the cooling-water inlet |

The heat removed is the air's sensible heat, $\\rho Q c_p \\Delta T$, plus the latent heat of the water that condenses ([[physics:latent-heat|latent heat]]). For 10 m³/min of free air cooled from 90 to 35 °C the sensible part is $1.185 \\times 0.1667 \\times 1005 \\times 55 = 10.9$ kW, and the 8.6 g of water condensing from each cubic metre add another 3.5 kW. That heat is usually blown into the room — or recovered to warm water or buildings ([[heat-recovery]]).

### Separating the water
Condensing is only half the job: the water is now a mist of droplets carried along at several metres per second. A **separator** straight after the aftercooler throws them out — typically a cyclone, in which the air spins and the heavy drops are flung against the wall, run down it and collect in a sump with a drain ([[condensate-drains]]). A good separator catches more than 95 % of the droplets larger than about 10 µm; it cannot touch the vapour.

Together, an aftercooler and separator typically remove **about 70 % of the water** the intake air brought in — 60–75 % depending on the climate and how far the air is cooled. In the example of [[condensate]] (25 °C and 60 % intake, cooled to 35 °C at 7 bar) that is 8.6 of the 13.8 g in each cubic metre.

### What it cannot do
The air leaving an aftercooler is **saturated**: its pressure dew point equals its own temperature. Every degree it cools further condenses more water:

| Air leaves the aftercooler at | Its pressure dew point | Water still carried (7 bar, intake 25 °C) |
|---|---|---|
| 45 °C | 45 °C | 8.8 g per m³ of free air |
| 35 °C | 35 °C | 5.2 g |
| 25 °C | 25 °C | 2.9 g |

The air receiver acts as a second, slower cooler and separator, which is why it needs a drain at its lowest point ([[receivers]]). But to get air that stays dry in the pipes, a dryer must follow ([[refrigerated-dryers]], [[desiccant-dryers]]).

> [!tip] A dusty air-cooled aftercooler or a scaled water-cooled one lets the air out 10 K hotter. That is 70 % more water sent on to the dryer (8.8 instead of 5.2 g/m³) — a common reason why a refrigerated dryer suddenly "stops drying". Clean the cooler first.

> [!warn] Discharge pipes between a compressor and its aftercooler can run at 200 °C and cause burns. In piston compressors, oil carbonising in hot discharge lines can ignite — keep discharge temperatures within the maker's limits and the aftercooler clean.
`,
  ideas: [
    'Cool the air right after the compressor so the water condenses at one place where it can be separated and drained.',
    'Aftercoolers bring the air to about 10 K above the cooling air or water (5–15 K depending on the type).',
    'The heat load is the sensible heat of the air plus the latent heat of the condensing water — about a quarter more.',
    'Aftercooler plus separator typically remove about 70 % of the water; the air leaves saturated, its dew point equal to its temperature.',
    'A separator removes droplets, never vapour: further drying needs a dryer.'
  ],
  pitfalls: [
    'A separator dries the air — It only removes liquid drops; the air leaving it is still saturated and condenses more water as soon as it cools.',
    'The hotter the compressor air, the drier it is — Hot air merely holds its water as vapour for now; what counts is the temperature it is cooled to.',
    'The aftercooler only protects the compressor — Its main job for the system is to condense most of the water where a drain can remove it.'
  ],
  formulas: [
    {
      name: 'Heat removed from the air (sensible)',
      expr: 'P = rho*Q*cp*(T1 - T2)',
      tex: 'P = \\rho\\,Q\\,c_p\\,(T_1 - T_2)',
      vars: {
        P: { name: 'sensible heat removed', q: 'power', unit: 'kW' },
        rho: { name: 'density of free air (ANR)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho' },
        Q: { name: 'free air flow', q: 'airflow', unit: 'm³/min ANR', value: 10 },
        cp: { name: 'specific heat of air', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.005, fixed: true, tex: 'c_p' },
        T1: { name: 'air temperature entering', q: 'temperature', unit: '°C', value: 90, min: 20, max: 250, tex: 'T_1' },
        T2: { name: 'air temperature leaving', q: 'temperature', unit: '°C', value: 35, min: 0, max: 100, tex: 'T_2' }
      },
      note: 'Mass flow = free-air flow × 1.185 kg/m³. Add the latent heat of the water that condenses (next formula) for the full load.',
      practice: { unknowns: ['P', 'T2', 'Q'] },
      stories: {
        P: 'An aftercooler cools {Q} of compressed air from {T1} to {T2}. How much sensible heat does it remove?',
        T2: 'An aftercooler removing {P} of sensible heat from {Q} of air entering at {T1}. At what temperature does the air leave?'
      }
    },
    {
      name: 'Heat released by the condensing water',
      expr: 'Pl = Q*dw*hfg',
      tex: 'P_l = Q\\,\\Delta c_w\\,h_{fg}',
      vars: {
        Pl: { name: 'latent heat released', q: 'power', unit: 'kW', tex: 'P_l' },
        Q: { name: 'free air flow', q: 'airflow', unit: 'm³/min ANR', value: 10 },
        dw: { name: 'water condensed per m³ of free air', q: 'density', unit: 'g/m³', value: 8.6, tex: '\\Delta c_w' },
        hfg: { name: 'latent heat of condensation of water', q: 'latent', unit: 'kJ/kg', value: 2420, tex: 'h_{fg}' }
      },
      note: 'The latent heat of water is about 2500 kJ/kg at 0 °C and 2400 kJ/kg at 45 °C.',
      stories: { Pl: 'Air flowing at {Q} condenses {dw} of water in an aftercooler. How much heat does the condensing water release ($h_{fg}$ = {hfg})?' }
    },
    {
      name: 'Aftercooler effectiveness',
      expr: 'eps = (T1 - T2)/(T1 - Tc)',
      tex: '\\varepsilon = \\dfrac{T_1 - T_2}{T_1 - T_c}',
      vars: {
        eps: { name: 'effectiveness', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        T1: { name: 'air temperature entering', q: 'temperature', unit: '°C', value: 90, min: 20, max: 250, tex: 'T_1' },
        T2: { name: 'air temperature leaving', q: 'temperature', unit: '°C', value: 35, min: 0, max: 100, tex: 'T_2' },
        Tc: { name: 'cooling air or water temperature', q: 'temperature', unit: '°C', value: 25, min: -20, max: 50, tex: 'T_c' }
      },
      note: 'The share of the largest possible temperature drop achieved. The approach $T_2 - T_c$ is typically 5–15 K.',
      practice: { unknowns: ['eps', 'T2'] },
      stories: {
        eps: 'Air enters an aftercooler at {T1} and leaves at {T2}; the cooling water is at {Tc}. What is the effectiveness?',
        T2: 'An aftercooler with an effectiveness of {eps} cools air entering at {T1} with cooling water at {Tc}. At what temperature does the air leave?'
      }
    }
  ],
  examples: [
    {
      title: 'The heat an aftercooler must remove',
      q: 'An oil-free compressor delivers 15 m³/min of free air at 7 bar gauge; the air leaves its last stage at 170 °C. A water-cooled aftercooler with water at 20 °C cools it to 30 °C. The intake air is at 25 °C and 60 %. Find the sensible heat, the water condensed, the latent heat and the effectiveness.',
      steps: [
        'Mass flow: $1.185 \\times 15/60 = 0.296$ kg/s. Sensible heat: $0.296 \\times 1005 \\times 140 = 41.7$ kW.',
        'Water drawn in: 13.8 g/m³. At 30 °C the compressed air can carry $30.26 \\times \\tfrac{1.013}{8.013} \\times \\tfrac{303.15}{298.15} = 3.9$ g per m³ of free air, so 9.9 g/m³ condenses — 72 % of the water.',
        'Latent heat: $0.25\\ \\text{m³/s} \\times 9.9\\times10^{-3}\\ \\text{kg/m³} \\times 2.42\\times10^{6}\\ \\text{J/kg} = 6.0$ kW.',
        'Effectiveness: $\\varepsilon = (170 - 30)/(170 - 20) = 93$ %, an approach of 10 K.'
      ],
      a: 'About 42 kW sensible plus 6 kW latent — 48 kW into the cooling water — and 72 % of the water condensed.'
    },
    {
      title: 'A dusty cooler',
      q: 'An air-cooled aftercooler, clogged with dust, lets the air out at 45 °C instead of 35 °C (intake 25 °C, 7 bar gauge, 10 m³/min, 16 h a day). How much more water goes on to the dryer?',
      steps: [
        'Water carried at 45 °C: $65.2 \\times \\tfrac{1.013}{8.013} \\times \\tfrac{318.15}{298.15} = 8.8$ g per m³ of free air.',
        'At 35 °C it would be 5.2 g: an extra 3.6 g per m³, 70 % more.',
        'Per day: $9600\\ \\text{m³} \\times 3.6\\ \\text{g} = 35$ kg.'
      ],
      a: 'About 35 litres a day more water reaches the dryer — which may be more than it was sized for.'
    }
  ],
  quiz: [
    { q: 'The air leaving an aftercooler and separator is…', choices: ['dry: its dew point is well below room temperature', 'saturated: its pressure dew point equals its temperature', 'at about 50 % relative humidity', 'free of oil'], a: 1,
      why: 'The aftercooler condenses water only down to the saturation content at its outlet temperature. The air leaves at 100 % relative humidity and condenses more as soon as it cools further.' },
    { q: 'A cyclone separator removes water vapour as well as droplets.', a: false,
      why: 'Centrifugal force acts on drops, which are 800 times denser than air. Vapour is part of the gas and passes through.' },
    { q: 'An aftercooler cools 5 m³/min of free air from 85 °C to 30 °C. What sensible heat does it remove ($\\rho$ = 1.185 kg/m³, $c_p$ = 1005 J/(kg·K))?', answer: 5.46, unit: 'kW', tol: 0.02,
      why: '$1.185 \\times (5/60) \\times 1005 \\times 55 = 5458$ W.' },
    { q: 'Why cool the air right after the compressor rather than let the pipes cool it?', choices: ['to raise the air\'s pressure', 'so the water condenses at one place where a separator and drain can remove it, not all through the network', 'because hot air carries less water', 'to make the compressor more efficient'], a: 1,
      why: 'Water condenses wherever the air cools. Doing it in the aftercooler puts it where it can be collected.' },
    { q: 'Typically, an aftercooler with a separator removes about what share of the water drawn in with the air?', choices: ['10 %', '30 %', '70 %', '99.9 %'], a: 2,
      why: 'Cooling to about 10 K above the intake temperature condenses roughly 60–75 % of the water; the rest stays as vapour.' }
  ],
  problems: [
    { q: 'A water-cooled aftercooler has an effectiveness of 90 %. Air enters at 160 °C, the cooling water at 22 °C. At what temperature does the air leave?', answer: 35.8, unit: '°C', tol: 0.003,
      steps: ['$T_2 = T_1 - \\varepsilon (T_1 - T_c)$.', '$T_2 = 160 - 0.9 \\times 138 = 35.8$ °C — an approach of 13.8 K.'] }
  ],
  applications: [
    'The integral aftercooler of every packaged screw compressor.',
    'Water-cooled aftercoolers on large centrifugal and oil-free compressors, often coupled to heat recovery.',
    'Cyclone separators and receivers with drains as the first stage of water removal.'
  ],
  sim: 'treat-chain'
},

{
  id: 'refrigerated-dryers', parent: 'moisture-drying', title: 'Refrigerated dryers', level: 2,
  short: 'A refrigerated dryer chills the compressed air to about +3 °C, drains the water that condenses and warms the air again: a pressure dew point of +3 °C for about 3 % of the compressor\'s power — the standard dryer for indoor factory air.',
  keywords: ['refrigerated dryer', 'pressure dew point', '+3 °C', 'air-to-air heat exchanger', 'evaporator', 'hot gas bypass', 'cycling dryer', 'thermal mass', 'cooling load', 'dryer derating', 'ISO 7183'],
  prereq: ['aftercoolers', 'pressure-dew-point', 'physics:refrigerators-heat-pumps'],
  related: ['desiccant-dryers', 'condensate', 'iso-8573', 'condensate-drains', 'cost-of-compressed-air', 'pressure-drop-air', 'physics:latent-heat'],
  body: `
The simplest way to take more water out of compressed air is to cool it further than the pipes will ever cool it. A **refrigerated dryer** chills the air to about +3 °C, drains away the water that condenses and warms the air up again before it leaves. Downstream, the air can then cool to anything above +3 °C without condensing: its pressure dew point is +3 °C — ISO 8573-1 water class 4 ([[iso-8573]]). It is the standard dryer for indoor factory air, because it is cheap to run.

### Inside
Two heat exchangers and a refrigeration circuit:

1. **Air-to-air heat exchanger** (pre-cooler and reheater): the warm, wet air coming in is pre-cooled by the cold, dry air going out, which is warmed in return. This recovers roughly half of the cooling, and the outgoing air leaves at 25–30 °C, so pipes downstream do not sweat and its relative humidity is only 20–30 %.
2. **Evaporator** (air-to-refrigerant): refrigerant boiling at about 0 °C chills the air to +2 to +5 °C.
3. **Separator and drain**: the condensate is caught and discharged, preferably by a level-sensing drain ([[condensate-drains]]).

The refrigerant circuit is an ordinary vapour-compression cycle ([[physics:refrigerators-heat-pumps|refrigerator]]): compressor, fan-cooled condenser, expansion valve, evaporator. A **hot-gas bypass** valve feeds hot refrigerant to the evaporator at low load to stop it freezing.

### Why not colder?
Because the condensate would freeze on the evaporator and block it. About +3 °C is as low as a refrigerated dryer can safely go. For lower dew points — outdoor lines in winter, instrument air, sensitive processes — a desiccant dryer is needed ([[desiccant-dryers]]).

### What it costs
The cooling load is the sensible heat of the air plus the latent heat of the water condensed. For 10 m³/min of free air entering saturated at 35 °C and 7 bar gauge, cooling the air by 32 K takes $\\rho Q c_p \\Delta T = 6.4$ kW; condensing 4.5 g of water per m³ takes another 1.8 kW — 8.2 kW in all. The pre-cooler recovers about half; a refrigeration COP of about 3 turns the rest into roughly 1.4 kW of electricity, plus the condenser fan. In all, typically **0.15–0.3 kW per m³/min — around 3 % of the compressor's power**. Its pressure drop, typically 0.1–0.2 bar, costs the compressor another 1 % or so.

A classic **non-cycling** dryer draws nearly full power even when little air flows. **Cycling** designs (a cold thermal mass, with the refrigerant compressor switching off) and variable-speed refrigerant compressors follow the load and save most of that at part load.

### Rating and derating
Dryers are rated at reference conditions — commonly air entering at 35 °C and 7 bar with 25 °C ambient; ISO 7183:2007 sets out how dryers are specified and tested. Hotter air carries far more water, and a hot room makes the condenser work harder:

| Saturated air entering at | Water to remove, per m³ of free air (7 bar, down to +3 °C) | Cooling load for 10 m³/min |
|---|---|---|
| 30 °C | 3.2 g | 6.5 kW |
| 35 °C | 4.5 g | 8.2 kW |
| 45 °C | 8.1 g | 11.6 kW |

So a dryer rated for 10 m³/min at 35 °C can handle only about 7 m³/min of air entering at 45 °C. Hot compressor rooms and dirty aftercoolers are the usual reasons a refrigerated dryer "stops drying" in summer.

> [!warn] A refrigerated dryer's PDP of +3 °C protects only pipes that stay above +3 °C. A line running outdoors or through an unheated building in winter will fill with water — and ice — unless the air is dried further.
`,
  ideas: [
    'Cool the air to about +3 °C, drain the water, reheat: a pressure dew point of +3 °C (ISO 8573-1 water class 4).',
    'The air-to-air heat exchanger saves about half the cooling and returns the air at 25–30 °C, around 20–30 % relative humidity.',
    'Below about +2 °C the condensate would freeze on the evaporator, so refrigerated dryers cannot go lower.',
    'They use roughly 3 % of the compressor\'s power; cycling or variable-speed designs save most of it at part load.',
    'Hot inlet air multiplies the water load: capacity falls to about 70 % at 45 °C.'
  ],
  pitfalls: [
    'A refrigerated dryer makes the air dry enough for outdoor lines — Its +3 °C dew point is above the winter temperature of outdoor pipes; the water condenses and freezes there.',
    'The dryer can take any amount of hot, wet air — Its capacity is rated at about 35 °C inlet; hotter air carries much more water and the outlet dew point rises.',
    'Reheated air at 25 °C must still be close to saturation — Reheating lowers the relative humidity to about 20–30 %: the water content stays that of +3 °C saturation.'
  ],
  formulas: [
    {
      name: 'Cooling load of a refrigerated dryer',
      expr: 'Pc = Q*(rho*cp*dT + dw*hfg)',
      tex: 'P_c = Q\\,(\\rho\\,c_p\\,\\Delta T + \\Delta c_w\\,h_{fg})',
      vars: {
        Pc: { name: 'cooling load', q: 'power', unit: 'kW', tex: 'P_c' },
        Q: { name: 'free air flow', q: 'airflow', unit: 'm³/min ANR', value: 10 },
        rho: { name: 'density of free air (ANR)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho' },
        cp: { name: 'specific heat of air', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.005, fixed: true, tex: 'c_p' },
        dT: { name: 'temperature drop of the air', q: 'dtemp', unit: 'K', value: 32, tex: '\\Delta T' },
        dw: { name: 'water condensed per m³ of free air', q: 'density', unit: 'g/m³', value: 4.46, tex: '\\Delta c_w' },
        hfg: { name: 'latent heat of condensation', q: 'latent', unit: 'kJ/kg', value: 2450, tex: 'h_{fg}' }
      },
      note: 'Without the air-to-air heat exchanger. Air entering saturated at 35 °C and 7 bar gauge and leaving the evaporator at +3 °C: $\\Delta T$ = 32 K, $\\Delta c_w$ = 4.46 g per m³ of free air.',
      practice: { unknowns: ['Pc', 'Q'] },
      stories: {
        Pc: 'A refrigerated dryer cools {Q} of air by {dT}, condensing {dw} of water per cubic metre. What is its cooling load?',
        Q: 'A dryer\'s evaporator can take {Pc}. The air must be cooled by {dT} and loses {dw} of water per m³. What air flow can it dry?'
      }
    },
    {
      name: 'Electrical power of a refrigerated dryer',
      expr: 'Pe = Pc*(1 - r)/COP + Pf',
      tex: 'P_e = \\dfrac{P_c\\,(1 - r)}{\\mathrm{COP}} + P_f',
      vars: {
        Pe: { name: 'electrical power', q: 'power', unit: 'kW', tex: 'P_e' },
        Pc: { name: 'cooling load', q: 'power', unit: 'kW', value: 8.17, tex: 'P_c' },
        r: { name: 'share recovered in the air-to-air heat exchanger', q: 'ratio', unit: '%', value: 50, min: 0, max: 90 },
        COP: { name: 'coefficient of performance of the refrigeration circuit', value: 3, tex: '\\mathrm{COP}' },
        Pf: { name: 'condenser fan and controls', q: 'power', unit: 'kW', value: 0.3, tex: 'P_f' }
      },
      note: 'At full load. A non-cycling dryer draws nearly this even at low flow; cycling and variable-speed dryers draw roughly in proportion to the load.',
      practice: { unknowns: ['Pe', 'r'] },
      stories: {
        Pe: 'A refrigerated dryer has a cooling load of {Pc}. Its air-to-air heat exchanger recovers {r}, its refrigeration COP is {COP} and the fan takes {Pf}. What electrical power does it draw?'
      }
    },
    {
      name: 'Relative humidity of the reheated air',
      expr: 'phi = exp(17.62*td/(243.12 + td))/exp(17.62*t/(243.12 + t))',
      tex: '\\varphi = \\dfrac{\\exp\\left(\\dfrac{17.62\\,t_d}{243.12 + t_d}\\right)}{\\exp\\left(\\dfrac{17.62\\,t}{243.12 + t}\\right)}',
      vars: {
        phi: { name: 'relative humidity at the outlet', q: 'ratio', unit: '%', tex: '\\varphi' },
        td: { name: 'pressure dew point', q: false, unit: '°C', value: 3, min: -60, max: 40, signed: true, tex: 't_d' },
        t: { name: 'outlet air temperature', q: false, unit: '°C', value: 27, min: -20, max: 60, signed: true }
      },
      note: 'The ratio of the saturation vapour pressures at the dew point and at the air temperature (Magnus formula), both at line pressure.',
      practice: { unknowns: ['phi', 'td'] },
      stories: {
        phi: 'Air leaves a dryer at {t} with a pressure dew point of {td}. What is its relative humidity?',
        td: 'Compressed air at {t} has a relative humidity of {phi}. What is its pressure dew point?'
      }
    }
  ],
  examples: [
    {
      title: 'What a refrigerated dryer costs to run',
      q: 'A dryer handles 10 m³/min of free air, entering saturated at 35 °C and 7 bar gauge and chilled to +3 °C. Its air-to-air exchanger recovers half the cooling, the refrigeration COP is 3 and the fan takes 0.3 kW. It runs 6000 h a year at ¤0.15 per kWh. The compressor draws 65 kW.',
      steps: [
        'Sensible: $1.185 \\times 0.1667 \\times 1005 \\times 32 = 6.35$ kW. Latent: $0.1667 \\times 4.46\\times10^{-3} \\times 2.45\\times10^{6} = 1.82$ kW. Load: 8.17 kW.',
        'Electricity: $8.17 \\times 0.5/3 + 0.3 = 1.66$ kW — 2.6 % of the compressor\'s 65 kW.',
        'Per year: $1.66 \\times 6000 = 9960$ kWh, about ¤1,490.'
      ],
      a: 'About 1.7 kW, 10 000 kWh and ¤1,500 a year — against 390 000 kWh for the compressor.'
    },
    {
      title: 'A hot compressor room',
      q: 'In summer the air reaches the same dryer at 45 °C instead of 35 °C. How much does the load grow, and what flow can the dryer still handle at its rated +3 °C?',
      steps: [
        'Water to remove: 8.1 g per m³ of free air instead of 4.46; temperature drop 42 K instead of 32 K.',
        'Load for 10 m³/min: $0.1667 \\times (1.185 \\times 1005 \\times 42 + 8.1\\times10^{-3} \\times 2.45\\times10^{6}) = 11.6$ kW — 43 % more.',
        'A dryer built for 8.2 kW handles about $10 \\times 8.2/11.6 = 7.0$ m³/min.'
      ],
      a: 'The load rises by 43 %; at full flow the dew point climbs above +3 °C unless the flow falls to about 7 m³/min.'
    }
  ],
  quiz: [
    { q: 'Why do refrigerated dryers stop at a dew point of about +3 °C?', choices: ['refrigerants cannot go colder', 'below 0 °C the condensate would freeze on the evaporator and block it', 'ISO 8573-1 forbids lower dew points', 'air cannot be cooled below its dew point'], a: 1,
      why: 'Refrigerants easily go far below 0 °C; the limit is the water, which would freeze on the cold surfaces.' },
    { q: 'Air leaving a refrigerated dryer at 25 °C with a pressure dew point of +3 °C cannot form condensate in a pipe outdoors at −5 °C.', a: false,
      why: 'The pipe is below the dew point: the air cools to −5 °C in it and the water above that saturation condenses and freezes.' },
    { q: 'The air-to-air heat exchanger of a refrigerated dryer…', choices: ['heats the refrigerant', 'pre-cools the incoming air with the cold outgoing air, saving energy and rewarming the outgoing air', 'removes oil', 'keeps the evaporator from freezing'], a: 1,
      why: 'It recovers about half the cooling and returns the air at 25–30 °C so pipes downstream do not sweat.' },
    { q: 'Air with a pressure dew point of +3 °C is reheated to 25 °C. Using $p_s$(3 °C) = 758 Pa and $p_s$(25 °C) = 3160 Pa, what is its relative humidity?', answer: 24.0, unit: '%', tol: 0.02,
      why: '$\\varphi = 758/3160 = 0.24$: the water content stays that of saturation at +3 °C.' },
    { q: 'A refrigerated dryer rated for 10 m³/min at 35 °C is fed air at 45 °C. Roughly what flow can it still dry to its rated dew point?', choices: ['10 m³/min: the rating does not depend on temperature', 'about 7 m³/min', 'about 13 m³/min', 'none: it will freeze'], a: 1,
      why: 'At 45 °C the air carries almost twice the water and must be cooled 10 K more: the load rises by about 40 %.' }
  ],
  problems: [
    { q: 'A refrigerated dryer handles 6 m³/min of free air. The air is cooled by 30 K and 4 g of water condenses from each m³. What is the cooling load ($\\rho$ = 1.185 kg/m³, $c_p$ = 1.005 kJ/(kg·K), $h_{fg}$ = 2450 kJ/kg)?', answer: 4.55, unit: 'kW', tol: 0.02,
      steps: ['$Q = 6/60 = 0.1$ m³/s.', 'Sensible: $0.1 \\times 1.185 \\times 1005 \\times 30 = 3573$ W; latent: $0.1 \\times 0.004 \\times 2.45\\times10^{6} = 980$ W.', 'Total 4.55 kW.'] }
  ],
  applications: [
    'Central drying of indoor factory air, often built into the compressor package.',
    'Drying before coalescing filters for paint and packaging lines (with filters, [1:4:1]).',
    'Pre-drying before a desiccant dryer to cut its purge and load.'
  ],
  sim: 'treat-dryers'
},

{
  id: 'desiccant-dryers', parent: 'moisture-drying', title: 'Desiccant and membrane dryers', level: 2,
  short: 'Desiccant dryers adsorb water vapour onto activated alumina, silica gel or molecular sieve in twin towers, reaching pressure dew points of −40 or −70 °C; one tower dries while the other is regenerated — by purge air, heat or a blower. Membrane dryers let vapour escape through hollow fibres.',
  keywords: ['desiccant dryer', 'adsorption dryer', 'heatless dryer', 'pressure swing adsorption', 'purge air', 'heated purge', 'blower purge', 'activated alumina', 'silica gel', 'molecular sieve', 'membrane dryer', '−40 °C', '−70 °C', 'dew point dependent switching'],
  prereq: ['condensate', 'pressure-dew-point', 'boyles-law'],
  related: ['refrigerated-dryers', 'iso-8573', 'air-filters', 'cost-of-compressed-air', 'partial-pressures', 'medical-dental-air', 'chemistry:intermolecular-forces'],
  body: `
When air must stay dry below freezing — outdoor lines in winter, instrument air, pharmaceutical and food processes, powder coating — cooling is not enough. **Desiccant dryers** pull the water vapour out of the air onto the surface of a porous solid, reaching pressure dew points of **−40 °C** (activated alumina, silica gel) or **−70 °C** (molecular sieve). **Membrane dryers** do a smaller job with no electricity at all.

### Adsorption
A desiccant bead is a sponge of microscopic pores: a gram of activated alumina has an inner surface of some 300 m², a gram of silica gel several hundred more. Water molecules, strongly polar, cling to that surface — they are *adsorbed* ([[chemistry:intermolecular-forces|intermolecular forces]]) — until the surface is loaded. Molecular sieves (zeolites) have pores of one fixed size that grip water molecules even at very low humidity; that is how −70 °C is reached. As wet air flows up through a bed, the bottom loads first and a **mass-transfer zone** creeps upwards; the tower must be switched before that zone reaches the top.

### Twin towers and regeneration
Every desiccant dryer has two towers: one dries the air while the other is **regenerated** — its water driven off again — and they swap every few minutes (heatless) or every few hours (heated). They differ in how the water is driven off:

| Type | How the wet tower is regenerated | Purge air lost | Other energy | Typical PDP |
|---|---|---|---|---|
| Heatless (pressure swing) | part of the dry air is expanded to atmospheric pressure and blown back through it | 15–20 % | none | −40 °C (−70 °C with molecular sieve) |
| Heated purge | a smaller purge, warmed by a heater | 5–8 % | heater | −40 °C |
| Blower purge | heated ambient air from a blower | 0–3 % | heater and blower | −40 °C |
| Heat of compression | hot air straight from an oil-free compressor | none | little | −20 to −40 °C |
| Membrane | dry air sweeps the outside of hollow fibres | 15–25 % | none | 20–40 K below the inlet dew point |

### Why a heatless dryer needs 15 % purge
Expanded to atmospheric pressure, dry air becomes very dry and very large: at 7 bar gauge each litre becomes eight. To carry off the water adsorbed during one half-cycle, the purge must sweep through the wet tower at least the same *actual volume* of air that was dried in it ([[boyles-law|Boyle's law]]). So the free-air purge is at least $p_\\text{atm}/p_\\text{abs}$ of the flow — 12.6 % at 7 bar gauge — and with a margin for imperfect desorption, 15–20 %. At lower pressure the share grows: about 20 % at 5 bar gauge.

That purge air was compressed at full cost. On a 10 m³/min dryer, 15 % purge is 1.5 m³/min of free air — about **10 kW of compressor power**, six times what a refrigerated dryer draws ([[cost-of-compressed-air]]). Heatless dryers are cheap to buy, simple and reliable, and the right choice for small flows; for large flows heated or blower-purge dryers win on running cost. **Dew-point-dependent switching** — changing towers when a sensor finds the bed loaded, instead of on a fixed timer — cuts the purge roughly in proportion to the actual water load.

### Filters around the bed
Oil aerosol coats the desiccant and ruins it for good, so a coalescing filter must go before the dryer; the beads rub against each other and shed dust, so a particulate filter must follow it ([[air-filters]]). Silica gel also cracks if liquid water reaches it — another reason to separate and drain well upstream.

### Membrane dryers
A membrane dryer is a bundle of hollow polymer fibres. Water vapour passes through the fibre walls much faster than oxygen and nitrogen; a small sweep of dried air, expanded to atmospheric pressure outside the fibres, carries it away. They need no power, have no moving parts and are silent — ideal at the point of use: a laboratory, a spray gun, an instrument cabinet. But their purge is large and their performance is a *depression* of the inlet dew point, not a fixed value.

> [!warn] Desiccant towers are pressure vessels, and switching towers vents them loudly: keep the exhaust silencers in place and clean, and never work on a tower before both are isolated and depressurised.
`,
  ideas: [
    'Desiccants adsorb water vapour onto huge inner surfaces: −40 °C PDP with activated alumina or silica gel, −70 °C with molecular sieve.',
    'Two towers take turns: one dries, the other is regenerated by purge air, heat or a blower.',
    'A heatless dryer purges at least $p_\\text{atm}/p_\\text{abs}$ of the flow — about 15–20 % at 7 bar — and that air costs full compressor power.',
    'Dew-point-dependent switching, heated and blower-purge designs cut the purge; heatless dryers suit small flows.',
    'A coalescing filter before and a dust filter after protect the bed and the users; membranes lower the dew point by 20–40 K without power.'
  ],
  pitfalls: [
    'Heatless means free — The purge air was compressed at full cost: 15 % of the flow is roughly 10 kW on a 10 m³/min dryer.',
    'A membrane dryer gives −40 °C like a desiccant dryer — It lowers the inlet dew point by a fixed amount; the outlet dew point follows the inlet.',
    'The desiccant lasts for ever — Oil, liquid water and dust destroy it; beads must be protected by filters and replaced every few years.'
  ],
  formulas: [
    {
      name: 'Minimum purge of a heatless dryer',
      expr: 'f = k*patm/(p + patm)',
      tex: 'f = k\\,\\dfrac{p_\\text{atm}}{p_g + p_\\text{atm}}',
      vars: {
        f: { name: 'purge as a share of the dried flow (free air)', q: 'ratio', unit: '%' },
        k: { name: 'margin factor (typically 1.2–1.5)', value: 1.2 },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        p: { name: 'line pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_g' }
      },
      note: 'The purge, expanded to atmospheric pressure, must sweep at least the actual volume of air dried; the margin covers imperfect desorption and repressurising the tower.',
      practice: { unknowns: ['f', 'p'] },
      stories: {
        f: 'A heatless dryer works at {p} with a margin factor of {k}. What share of the flow must it purge?',
        p: 'A heatless dryer with a margin factor of {k} purges {f}. At what line pressure does it work?'
      }
    },
    {
      name: 'Compressor power spent on purge',
      expr: 'P = f*Q*w',
      tex: 'P = f\\,Q\\,w',
      vars: {
        P: { name: 'compressor power for the purge', q: false, unit: 'kW' },
        f: { name: 'purge share', q: 'ratio', unit: '%', value: 15 },
        Q: { name: 'dryer flow', q: false, unit: 'm³/min', value: 10 },
        w: { name: 'compressor specific power', q: false, unit: 'kW per m³/min', value: 6.5 }
      },
      note: 'A compressor at 7 bar typically needs 6–7 kW for each m³/min of free air it delivers. With dew-point-dependent switching the purge falls roughly with the load.',
      practice: { unknowns: ['P', 'f'] },
      stories: { P: 'A heatless dryer on {Q} purges {f}. The compressor needs {w}. What compressor power does the purge cost?' }
    },
    {
      name: 'Water adsorbed in one half-cycle',
      expr: 'm = Q*t*c',
      tex: 'm = Q\\,t\\,c_w',
      vars: {
        m: { name: 'water adsorbed by the drying tower', q: 'mass', unit: 'kg' },
        Q: { name: 'free air flow', q: 'airflow', unit: 'm³/min ANR', value: 10 },
        t: { name: 'time on line (half-cycle)', q: 'time', unit: 'min', value: 5 },
        c: { name: 'water entering per m³ of free air', q: 'density', unit: 'g/m³', value: 5.16, tex: 'c_w' }
      },
      note: 'Air saturated at 35 °C and 7 bar gauge carries about 5.2 g per m³ of free air; after a refrigerated pre-dryer only 0.7 g. A heatless bed uses only a few per cent of the desiccant\'s capacity per cycle, which is why it switches every few minutes.',
      stories: { m: 'A desiccant tower dries {Q} of air carrying {c} for {t}. How much water does it adsorb?' }
    }
  ],
  examples: [
    {
      title: 'Heatless or refrigerated?',
      q: 'A plant needs 10 m³/min of dried air at 7 bar gauge, 6000 h a year. A heatless dryer would purge 15 %; a refrigerated dryer draws 1.7 kW. The compressor needs 6.5 kW per m³/min and electricity costs ¤0.15 per kWh. Compare the running costs.',
      steps: [
        'Heatless: purge $0.15 \\times 10 = 1.5$ m³/min, costing $1.5 \\times 6.5 = 9.75$ kW of compressor power.',
        'Per year: $9.75 \\times 6000 = 58\\,500$ kWh, about ¤8,800.',
        'Refrigerated: $1.7 \\times 6000 = 10\\,200$ kWh, about ¤1,500.'
      ],
      a: 'The heatless dryer costs about six times as much to run; it is worth it only where a −40 °C dew point is really needed — and then a heated or blower-purge design, or dew-point-dependent switching, pays back quickly.'
    },
    {
      title: 'The same dryer at a lower pressure',
      q: 'The heatless dryer of a plant is moved from a 7 bar gauge to a 5 bar gauge system. With a margin factor of 1.2, how does its purge change?',
      steps: [
        'At 7 bar gauge: $1.2 \\times 1.013/8.013 = 15.2$ %.',
        'At 5 bar gauge: $1.2 \\times 1.013/6.013 = 20.2$ %.'
      ],
      a: 'The purge share grows from about 15 to 20 %: the lower the pressure, the less the purge air expands.'
    }
  ],
  quiz: [
    { q: 'Why is a coalescing filter fitted before a desiccant dryer?', choices: ['to catch desiccant dust', 'oil aerosol would coat the desiccant and destroy its capacity', 'to lower the dew point further', 'to reduce the purge air'], a: 1,
      why: 'Oil films block the pores for good. The dust filter goes after the dryer.' },
    { q: 'A heatless dryer at 7 bar gauge purges 15 % of its flow. At 5 bar gauge, the purge share it needs is…', choices: ['smaller, about 11 %', 'the same', 'larger, about 20 %', 'zero'], a: 2,
      why: 'The purge share scales with $p_\\text{atm}/p_\\text{abs}$: 1.013/6.013 against 1.013/8.013, a third more.' },
    { q: 'A membrane dryer delivers a pressure dew point of −40 °C whatever the inlet air.', a: false,
      why: 'Membranes lower the inlet dew point by 20–40 K; a warmer, wetter inlet gives a warmer outlet dew point.' },
    { q: 'A heatless dryer on 8 m³/min purges 15 %. The compressor needs 6.5 kW per m³/min. What compressor power does the purge cost?', answer: 7.8, unit: 'kW', tol: 0.02,
      why: '$0.15 \\times 8 \\times 6.5 = 7.8$ kW.' },
    { q: 'Which dryer suits an outdoor air line that must not freeze at −25 °C?', choices: ['a refrigerated dryer (+3 °C PDP)', 'an aftercooler and separator only', 'a desiccant dryer (−40 °C PDP)', 'a membrane dryer with a 10 K depression'], a: 2,
      why: 'The dew point should be about 10 K below the coldest the pipe will see, so −35 °C or lower: a −40 °C desiccant dryer.' }
  ],
  problems: [
    { q: 'What minimum purge share does a heatless dryer need at 6 bar gauge with a margin factor of 1.3?', answer: 18.8, unit: '%', tol: 0.02,
      steps: ['$f = 1.3 \\times 1.013/(6 + 1.013)$.', '$= 1.3 \\times 0.1444 = 0.188$ — 18.8 %.'] }
  ],
  applications: [
    'Instrument air in process plants and outdoor air lines in cold climates.',
    'Pharmaceutical, food and electronics production, powder coating.',
    'Medical and breathing-air plants, where desiccant dryers also carry catalysts and filters.',
    'Membrane dryers at the point of use: laboratories, analysers, spray guns, pneumatic cabinets.'
  ],
  history: 'The heatless dryer is an application of pressure-swing adsorption, patented by Charles Skarstrom in 1960: adsorb at high pressure, desorb with a purge at low pressure. The same "Skarstrom cycle" now separates oxygen from air in medical concentrators and nitrogen generators.',
  sim: 'treat-dryers'
},

{
  id: 'condensate-drains', parent: 'moisture-drying', title: 'Condensate drains and treatment', level: 1,
  short: 'Every separator, receiver, dryer and filter needs a drain. Timed drains waste compressed air, float drains stick, level-sensing drains open only when there is water. The condensate is oily waste and needs an oil–water separator before it goes to the sewer.',
  keywords: ['condensate drain', 'float drain', 'timed drain', 'solenoid drain', 'zero air loss drain', 'level-sensing drain', 'oil-water separator', 'emulsion', 'condensate treatment', 'waste oil'],
  prereq: ['condensate', 'aftercoolers', 'choked-flow'],
  related: ['drops-drains', 'air-leaks', 'receivers', 'pressure-equipment', 'maintenance-pneu', 'refrigerated-dryers', 'air-filters'],
  body: `
Every place where water collects — the aftercooler's separator, the receiver, the dryer, each filter bowl and the drip legs at the low points of the network ([[drops-drains]]) — needs a drain. Drains are small, cheap parts, and they are behind a surprising share of compressed-air trouble: one that sticks shut floods the next dryer or filter with water; one that sticks open, or opens too often, blows compressed air away all day.

### Four kinds of drain
| Drain | How it works | Weakness |
|---|---|---|
| Manual valve | someone opens it | forgotten; the water passes downstream |
| Float drain | a float lifts a valve when water collects | sticks with oily, dirty condensate; its small orifice clogs |
| Timed solenoid drain | opens for a few seconds at fixed intervals | blows air when there is no water, floods when there is more than expected |
| Level-sensing (zero air loss) | a sensor sees the water level; the valve opens until the reservoir is nearly empty and closes before air escapes | costs more; needs power; has an alarm if it fails |

### The air a timed drain throws away
A timed drain must be set for the wettest day, so most of the time it opens with little water behind it and blows compressed air through its orifice. A 3 mm orifice at 7 bar gauge passes about 440 L/min of free air when open — the flow is choked, so it depends only on the hole and the upstream pressure ([[choked-flow]]). Open 5 seconds every 5 minutes, that averages 7.3 L/min: 3900 m³ a year, about 420 kWh. Set to 10 seconds every 2 minutes, it averages 37 L/min and 2100 kWh a year — for one drain. A plant with twenty timed drains wastes as much as a handful of leaks ([[air-leaks]]), which is why level-sensing drains usually pay for themselves within a year or two.

### Condensate is oily waste
Condensate from an oil-injected compressor carries the oil that got past its separator — typically 2–5 mg per m³ of air — plus dirt, rust and hydrocarbons drawn in with the air. Concentrated into the condensate, that is often several hundred milligrams of oil per litre, while sewer and environmental rules commonly allow only 10–20 mg/L of hydrocarbons (limits are set locally: check the permit). So in most countries condensate may not be poured down the drain untreated.

The usual treatment is an **oil–water separator**: a settling chamber where free oil floats to the top, then oleophilic (oil-attracting) fibres, then activated carbon, leaving water clean enough for the sewer; the collected oil goes for disposal as waste oil. Some synthetic oils, and hot, turbulent conditions, form **stable emulsions** — milky condensate that gravity cannot split; these need emulsion-splitting units (ultrafiltration or flocculants) or collection by a waste contractor. Even condensate from an oil-free compressor carries hydrocarbons from the intake air and can be acidic enough to corrode.

> [!key] Choose drains that open only when there is water, and pipe them to a separator that is sized for the compressors and the climate. Every second a drain blows air is paid for at the compressor.

> [!warn] Drains discharge at line pressure and can spray oily water hard. Pipe drain outlets into a collecting manifold or a separator with a pressure-relief chamber, never towards a person; isolate and depressurise a drain before cleaning or changing it. Test drains regularly — a receiver or dryer full of water is a hazard of its own ([[pressure-equipment]]).
`,
  ideas: [
    'Every place where water collects needs a drain: separators, receivers, dryers, filters and the low points of the network.',
    'Timed drains blow compressed air whenever they open without water; set for the wettest day, they waste air on most days.',
    'Level-sensing drains open only when water is present and close before air escapes: zero air loss.',
    'Condensate is oily waste: typically hundreds of mg/L of oil against discharge limits of 10–20 mg/L.',
    'Oil–water separators treat it by settling, oleophilic fibres and activated carbon; stable emulsions need special splitting.'
  ],
  pitfalls: [
    'A timed drain saves effort, so it saves money — It spends compressed air every time it opens on an empty sump: hundreds to thousands of kWh a year per drain.',
    'Condensate from an oil-free compressor is clean water — It carries hydrocarbons and dirt from the intake air, and it may be acidic; local rules still apply.',
    'A float drain never loses air — True while it works; oily sludge often jams it open (blowing air) or shut (flooding).'
  ],
  formulas: [
    {
      name: 'Average air lost by a timed drain',
      expr: 'Qa = Qo*ton/tc',
      tex: 'Q_a = Q_o\\,\\dfrac{t_\\text{on}}{t_c}',
      vars: {
        Qa: { name: 'average free-air loss', q: 'airflow', unit: 'L/min ANR', tex: 'Q_a' },
        Qo: { name: 'flow through the open drain', q: 'airflow', unit: 'L/min ANR', value: 440, tex: 'Q_o' },
        ton: { name: 'time open', q: 'time', unit: 's', value: 5, tex: 't_\\text{on}' },
        tc: { name: 'interval between openings', q: 'time', unit: 'min', value: 5, tex: 't_c' }
      },
      note: 'Assumes the drain blows air for nearly all its open time (the water leaves in a fraction of a second). A 3 mm orifice passes about 440 L/min of free air at 7 bar gauge; the flow is proportional to the absolute pressure and the orifice area.',
      practice: { unknowns: ['Qa', 'ton'] },
      stories: {
        Qa: 'A timed drain passes {Qo} when open and opens for {ton} every {tc}. What is its average air loss?',
        ton: 'A drain valve passes {Qo} when open and opens every {tc}. How long may it stay open if the average loss must stay below {Qa}?'
      }
    },
    {
      name: 'Oil in the condensate',
      expr: 'co = ca*Q/Qw',
      tex: 'c_o = \\dfrac{c_a\\,Q}{Q_w}',
      vars: {
        co: { name: 'oil concentration in the condensate', q: false, unit: 'mg/L', tex: 'c_o' },
        ca: { name: 'oil carried over by the air', q: false, unit: 'mg/m³', value: 3, tex: 'c_a' },
        Q: { name: 'free air delivery', q: false, unit: 'm³/h', value: 600 },
        Qw: { name: 'condensate flow', q: false, unit: 'L/h', value: 5.2, tex: 'Q_w' }
      },
      note: 'Assumes all the oil carried over ends up in the condensate — near enough, since most is caught with the water in separators, receivers and filters.',
      practice: { unknowns: ['co', 'ca'] },
      stories: {
        co: 'An oil-injected compressor delivers {Q} with an oil carry-over of {ca}; its condensate flows at {Qw}. What is the oil concentration of the condensate?'
      }
    }
  ],
  examples: [
    {
      title: 'The yearly cost of one timed drain',
      q: 'A timed drain with a 3 mm valve (440 L/min of free air when open at 7 bar gauge) is set to open 10 s every 2 min, all year (8760 h). The compressor needs 6.5 kW per m³/min; electricity costs ¤0.15 per kWh.',
      steps: [
        'Average loss: $440 \\times 10/120 = 36.7$ L/min.',
        'Per year: $0.0367 \\times 60 \\times 8760 = 19\\,300$ m³ of free air.',
        'Power: $0.0367 \\times 6.5 = 0.238$ kW; energy $0.238 \\times 8760 = 2090$ kWh; cost about ¤313.'
      ],
      a: 'About 19 000 m³ of air, 2100 kWh and ¤310 a year — more than a level-sensing drain costs to buy.'
    },
    {
      title: 'May the condensate go to the sewer?',
      q: 'An oil-injected compressor delivers 10 m³/min (600 m³/h) with an oil carry-over of 3 mg/m³ and makes 83 L of condensate in a 16-hour day. The local limit is 20 mg/L of hydrocarbons.',
      steps: [
        'Condensate flow: $83/16 = 5.2$ L/h.',
        'Oil concentration: $3 \\times 600/5.2 = 346$ mg/L.',
        'To reach 20 mg/L the separator must remove $1 - 20/346 = 94$ % of the oil.'
      ],
      a: 'About 350 mg/L — seventeen times the limit. It needs an oil–water separator, and the collected oil is waste oil.'
    }
  ],
  quiz: [
    { q: 'A timed drain opens 5 s every 5 min. On a cool, dry day it mostly…', choices: ['saves air', 'blows compressed air to atmosphere', 'freezes open', 'fills the dryer with water'], a: 1,
      why: 'With little water in the sump, nearly all the open time blows air.' },
    { q: 'Why do float drains often fail?', choices: ['they open too often', 'oily, dirty condensate makes the float and its small orifice stick', 'they need electricity', 'they are too large'], a: 1,
      why: 'Sludge and emulsions jam the float mechanism open or shut.' },
    { q: 'Condensate from an oil-free compressor is clean water and may always go straight to the sewer.', a: false,
      why: 'It carries hydrocarbons and dirt from the intake air and may be acidic; local rules decide.' },
    { q: 'A drain valve passes 300 L/min of free air when open and opens 4 s every 3 min. What is its average air loss?', answer: 6.67, unit: 'L/min', tol: 0.02,
      why: '$300 \\times 4/180 = 6.67$ L/min.' },
    { q: 'What does a level-sensing (zero air loss) drain do differently?', choices: ['opens on a timer set by the operator', 'opens only when its reservoir is full and closes before air escapes', 'stays slightly open all the time', 'heats the condensate'], a: 1,
      why: 'A sensor detects the water, so the valve discharges water, not air.' }
  ],
  problems: [
    { q: 'Twenty timed drains each lose an average of 20 L/min of free air, all year (8760 h). With 6.5 kW per m³/min, how much electricity do they waste per year?', answer: 22776, unit: 'kWh', tol: 0.02,
      steps: ['Together: $20 \\times 20 = 400$ L/min = 0.4 m³/min.', 'Compressor power: $0.4 \\times 6.5 = 2.6$ kW.', 'Per year: $2.6 \\times 8760 = 22\\,800$ kWh — about ¤3,400 at ¤0.15 per kWh.'] }
  ],
  applications: [
    'Replacing timed drains with level-sensing drains in an energy audit.',
    'Sizing an oil–water separator for a compressor room.',
    'Drip legs with drains at the low points of an air main.'
  ],
  sim: 'treat-drains'
},

/* ================================================================ AIR QUALITY */
{
  id: 'iso-8573', parent: 'air-quality', title: 'Air purity classes: ISO 8573-1', level: 2,
  short: 'ISO 8573-1:2010 grades compressed air for solid particles, water and oil, each on its own scale, and writes the result as [A:B:C] — [1:4:1] for spray painting, [2:2:1] for air touching food. Treat to the class the application needs, no better.',
  keywords: ['ISO 8573-1', 'air quality class', 'purity class', 'particles', 'water class', 'oil class', 'pressure dew point', 'oil-free', 'class 0', 'food grade air', '1:4:1', 'contaminants'],
  prereq: ['condensate', 'pressure-dew-point'],
  related: ['air-filters', 'refrigerated-dryers', 'desiccant-dryers', 'lubricators', 'medical-dental-air', 'hydraulics:iso-4406', 'hydraulics:contamination'],
  body: `
"Clean, dry air" means one thing to a blow gun and quite another to a pharmaceutical filling line. **ISO 8573-1:2010** gives everyone a common language: it grades compressed air for its three main contaminants — **solid particles, water and oil** — each on its own scale of classes, and writes the result as three numbers,

**ISO 8573-1:2010 [A:B:C]** — for example **[1:4:1]**,

where A is the particle class, B the water class and C the oil class; the lower the number, the cleaner. [1:4:1], a typical specification for spray painting, means very few particles, a pressure dew point of +3 °C or lower, and no more than 0.01 mg of oil in a cubic metre. All concentrations refer to air at the standard's reference conditions: 20 °C, 1 bar absolute and dry. (Hydraulics has a similar code for oil cleanliness, [[hydraulics:iso-4406|ISO 4406]].)

### Particles
Maximum number of particles per m³ in each size range ("—": not specified):

| Class | 0.1–0.5 µm | 0.5–1 µm | 1–5 µm |
|---|---|---|---|
| 0 | as specified, stricter than class 1 | | |
| 1 | 20 000 | 400 | 10 |
| 2 | 400 000 | 6 000 | 100 |
| 3 | — | 90 000 | 1 000 |
| 4 | — | — | 10 000 |
| 5 | — | — | 100 000 |
| 6 | by mass: up to 5 mg/m³ | | |
| 7 | by mass: up to 10 mg/m³ | | |
| X | by mass: more than 10 mg/m³ | | |

### Water and oil
| Water class | Requirement | | Oil class | Total oil (aerosol, liquid, vapour) |
|---|---|---|---|---|
| 0 | as specified, stricter than class 1 | | 0 | as specified, stricter than class 1 |
| 1 | pressure dew point ≤ −70 °C | | 1 | ≤ 0.01 mg/m³ |
| 2 | PDP ≤ −40 °C | | 2 | ≤ 0.1 mg/m³ |
| 3 | PDP ≤ −20 °C | | 3 | ≤ 1 mg/m³ |
| 4 | PDP ≤ +3 °C | | 4 | ≤ 5 mg/m³ |
| 5 | PDP ≤ +7 °C | | X | more than 5 mg/m³ |
| 6 | PDP ≤ +10 °C | | | |
| 7 | liquid water ≤ 0.5 g/m³ | | | |
| 8 | liquid water ≤ 5 g/m³ | | | |
| 9 | liquid water ≤ 10 g/m³ | | | |
| X | liquid water > 10 g/m³ | | | |

Water classes 1–6 are set by the [[pressure-dew-point]] — the vapour left in the air — and 7–9 by liquid water still carried along, for air that has no dryer.

### What applications ask for
The standard does not say what an application needs; the user does. Typical specifications:

| Application | Typical class | Why |
|---|---|---|
| Blow-off, air tools, general workshop | [6:4:4] | modest particles, no liquid water in the lines |
| Cylinders and valves, general automation | [7:4:4] to [5:4:4] | dry enough not to wash out grease, 5–40 µm filtration |
| Instrument and process-control air | [2:3:2] or better | dew point 10 K below the coldest the lines see |
| Spray painting | [1:4:1] | oil and dust ruin the finish |
| Food and drink, air touching the product | [2:2:1] | no oil, no water for bacteria to grow in |
| Food and drink, air near the product | [2:4:2] | |
| Pharmaceutical, electronics | [1:2:1] | |

Breathing air needs more than ISO 8573-1 covers (carbon monoxide, carbon dioxide, odour) and follows its own standards, such as EN 12021 ([[medical-dental-air]]).

### Getting there
Each class is reached with particular equipment ([[air-filters]], [[refrigerated-dryers]], [[desiccant-dryers]]), and every stage costs energy in pressure drop, purge and electricity. So the rule is **treat to the class the application needs, no better** — and treat at the point of use when only one machine needs very clean air.

- Water: aftercooler and separator — liquid classes 7–9; refrigerated dryer — class 4–5; desiccant — class 2 (−40 °C) or 1 (−70 °C).
- Oil: a well-kept oil-injected compressor delivers 2–5 mg/m³ (class 4); a general-purpose coalescer brings the aerosol to about 0.1 mg/m³; a high-efficiency coalescer to 0.01 mg/m³; activated carbon removes the vapour for class 1 overall.
- Particles: 5–40 µm service-unit filters give classes 6–7; 1 µm filters about class 2–3; 0.01 µm filters class 1–2.

### Class 0 and "oil-free"
Class 0 does not mean zero. It means a limit stricter than class 1, agreed between user and supplier, stated explicitly and verified by measurement (the other parts of ISO 8573, 2 to 9, describe how to measure each contaminant). An oil-free compressor adds no oil of its own, but it passes on whatever hydrocarbon vapour is in the air it draws in, and air near busy roads or process plants can carry enough to exceed class 1 on its own.
`,
  ideas: [
    'ISO 8573-1:2010 grades particles, water and oil separately and writes [A:B:C]; a lower number is cleaner.',
    'Water classes 1–6 are pressure dew points (−70 °C to +10 °C); classes 7–9 are liquid water per m³.',
    'Oil class 1 is at most 0.01 mg/m³ of total oil — aerosol, liquid and vapour.',
    'The user sets the class for the application: [1:4:1] for paint, [2:2:1] for air touching food.',
    'Treat to the class needed, no better, and treat at the point of use where only one machine needs very clean air.'
  ],
  pitfalls: [
    'Class 0 means no oil at all — It means a stricter limit than class 1, specified and verified; zero is not measurable.',
    'An oil-free compressor gives oil class 1 — It adds no oil, but hydrocarbons in the intake air pass through it.',
    'The best class is always the safest choice — Every step of treatment costs pressure drop, purge air and electricity; over-treating the whole plant is expensive.'
  ],
  formulas: [
    {
      name: 'Water left in dried air (at ISO reference conditions)',
      expr: 'cw = 1000*611.2*exp(17.62*td/(243.12 + td))/(461.5*293.15)*pr/p',
      tex: 'c_w = \\dfrac{1000 \\cdot 611.2\\,\\exp\\left(\\dfrac{17.62\\,t_d}{243.12 + t_d}\\right)}{461.5 \\times 293.15}\\,\\dfrac{p_\\text{ref}}{p}',
      vars: {
        cw: { name: 'water vapour per m³ at 20 °C and 1 bar', q: false, unit: 'g/m³', tex: 'c_w' },
        td: { name: 'pressure dew point', q: false, unit: '°C', value: 3, min: -80, max: 40, signed: true, tex: 't_d' },
        pr: { name: 'reference pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        p: { name: 'line pressure (absolute)', q: 'pressure', unit: 'bar', value: 8 }
      },
      note: 'At the dew point the compressed air is saturated: its vapour partial pressure is $p_s(t_d)$. Expanded to the reference pressure, the partial pressure falls in proportion, and the vapour density at 20 °C follows from $R_v = 461.5$ J/(kg·K).',
      practice: { unknowns: ['cw', 'td'] },
      stories: {
        cw: 'Air at {p} has a pressure dew point of {td}. How much water vapour does it carry per m³ at the ISO reference conditions?',
        td: 'Air at {p} carries {cw} of water vapour per m³ at 20 °C and 1 bar. What is its pressure dew point?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a specification',
      q: 'A paint shop specifies ISO 8573-1:2010 [1:4:1] for its spray guns. The plant has an oil-injected compressor. What do the numbers mean, and what equipment gets there?',
      steps: [
        'Particles, class 1: at most 20 000, 400 and 10 particles per m³ in the 0.1–0.5, 0.5–1 and 1–5 µm ranges — a 0.01 µm high-efficiency filter.',
        'Water, class 4: pressure dew point +3 °C or lower — a refrigerated dryer.',
        'Oil, class 1: at most 0.01 mg/m³ of total oil. The compressor delivers 2–5 mg/m³: a general-purpose coalescer (to about 0.1), a high-efficiency coalescer (to 0.01 aerosol) and activated carbon for the vapour.'
      ],
      a: 'Refrigerated dryer, then general-purpose and high-efficiency coalescers and an activated carbon filter — best fitted at the paint booth, not for the whole plant.'
    },
    {
      title: 'Classifying a measurement',
      q: 'A measurement finds 150 000 particles per m³ of 0.1–0.5 µm, 3000 of 0.5–1 µm and 60 of 1–5 µm; a pressure dew point of −45 °C; and 0.05 mg/m³ of total oil. What is the class?',
      steps: [
        'Particles: class 1 fails (150 000 > 20 000); class 2 allows 400 000, 6000 and 100 — all met. Class 2.',
        'Water: −45 °C is below −40 °C but not −70 °C. Class 2.',
        'Oil: 0.05 mg/m³ is within 0.1 but not 0.01. Class 2.'
      ],
      a: 'ISO 8573-1:2010 [2:2:2].'
    }
  ],
  quiz: [
    { q: 'In ISO 8573-1:2010 [2:4:1], the 4 refers to…', choices: ['particles', 'water: a pressure dew point of +3 °C or lower', 'oil', 'the pressure in bar'], a: 1,
      why: 'The order is always particles : water : oil.' },
    { q: 'Air with a pressure dew point of −25 °C is in water class…', choices: ['2', '3', '4', '6'], a: 1,
      why: 'Class 2 needs −40 °C or lower; −25 °C meets class 3 (≤ −20 °C).' },
    { q: 'Oil class 0 means the air contains no oil at all.', a: false,
      why: 'Class 0 is a limit stricter than class 1, specified by the user or supplier and verified by measurement.' },
    { q: 'Air with 0.3 mg/m³ of total oil is in oil class…', choices: ['1', '2', '3', '4'], a: 2,
      why: 'Class 2 allows up to 0.1 mg/m³; class 3 up to 1 mg/m³.' },
    { q: 'Why not treat all the air in a plant to [1:1:1]?', choices: ['the standard forbids it', 'every stage costs pressure drop, purge air, elements and electricity, for no benefit where the application does not need it', 'desiccant dryers cannot reach it', 'cylinders need oily air'], a: 1,
      why: 'Treat to the class needed, and add point-of-use treatment for the few machines that need more.' }
  ],
  problems: [
    { q: 'Air is dried to a pressure dew point of −40 °C at 8.0 bar absolute. How much water vapour does it carry per m³ at the ISO reference conditions (20 °C, 1 bar)? $p_s$(−40 °C) = 19.0 Pa.', answer: 0.0176, unit: 'g/m³', tol: 0.03,
      steps: ['Partial pressure after expansion to 1 bar: $19.0/8.0 = 2.38$ Pa.', 'Vapour density at 20 °C: $2.38/(461.5 \\times 293.15) = 1.76\\times10^{-5}$ kg/m³ = 0.0176 g/m³.'] }
  ],
  applications: [
    'Writing the air specification for a machine, a paint booth or a food line.',
    'Choosing dryers and filters, centrally or at the point of use.',
    'Verifying a supply by measurement to the methods of ISO 8573-2 to -9.'
  ],
  history: 'ISO 8573-1 was first published in 1991 and revised in 2001 and 2010. The 2010 edition, still the one quoted in specifications, classes particles by counts in three size ranges and by mass for the dirtiest air.',
  sim: 'treat-iso-class'
},

{
  id: 'air-filters', parent: 'air-quality', title: 'Filters and coalescers', level: 2,
  short: 'Particulate filters strain out dust; coalescing filters catch fine oil and water aerosols on glass fibres and drain them away (down to about 0.01 mg/m³); activated carbon adsorbs oil vapour. Every filter costs pressure drop, and a clogged one costs far more in energy than its element.',
  keywords: ['filter', 'coalescing filter', 'coalescer', 'particulate filter', 'activated carbon', 'oil aerosol', 'oil vapour', 'pressure drop', 'differential pressure', 'element change', 'filter efficiency', 'ISO 12500', 'borosilicate'],
  prereq: ['iso-8573', 'condensate', 'compression-work'],
  related: ['frl-units', 'desiccant-dryers', 'lubricators', 'pressure-drop-air', 'cost-of-compressed-air', 'maintenance-pneu', 'hydraulics:filtration', 'physics:drag-force'],
  body: `
A compressed-air system may have one dryer but dozens of filters — after the compressor, around the dryer, at the entry to each machine. They remove three different things by three different means: **solid particles** (dust, rust, pipe scale, desiccant fines), **liquid aerosols** (fine droplets of water and oil) and **oil vapour**.

### Particulate filters
A particulate (dust) filter strains the air through a pleated or sintered element rated 40, 25, 5 or 1 µm. Service-unit filters add a swirl vane that spins the air so that drops and heavy particles are thrown onto the bowl wall before the element ([[frl-units]]). After a desiccant dryer, a 1 µm dust filter catches the fines the beads shed.

### Coalescing filters
Oil and water aerosols in compressed air are mostly finer than 1 µm — far too small to strain out. A **coalescing filter** is a thick bed of fine glass (borosilicate) fibres, through which the air flows from the inside of the element to the outside. Droplets are caught on the fibres by three mechanisms:

- **inertial impaction** — drops larger than about 1 µm cannot follow the air round a fibre and hit it;
- **interception** — mid-sized drops following the streamlines brush against a fibre;
- **diffusion** — the smallest, below about 0.1 µm, wander by Brownian motion until they touch one.

The hardest size to catch lies in between, around 0.1–0.3 µm. Caught droplets merge — *coalesce* — into bigger drops, which the air pushes to the outside of the element, where they run down into the bowl and its drain. Typical grades:

| Filter | Particles down to | Oil left (aerosol, at 20 °C) | Clean pressure drop, wetted |
|---|---|---|---|
| General-purpose coalescer | 1 µm | ~0.1 mg/m³ | ~0.1 bar |
| High-efficiency coalescer | 0.01 µm | ~0.01 mg/m³ | ~0.15 bar |
| Activated carbon (after a coalescer) | — | ~0.003 mg/m³ of vapour | ~0.1 bar |

A coalescer catches aerosol only; oil **vapour** passes straight through. An **activated carbon** filter adsorbs vapour and odours — but only after a high-efficiency coalescer, because liquid oil would saturate the carbon within days. Carbon has a limited life, shorter when the air is warm, since oil vapour content rises steeply with temperature. Filter performance is tested to the ISO 12500 series (ISO 12500-1:2007 for oil aerosols).

### Pressure drop and when to change
A new element costs little pressure, 0.05–0.1 bar dry. A coalescer soaks up oil and water in its first hours and settles at a higher, wetted drop; then dirt slowly clogs it, and the drop climbs — slowly at first, then faster. Most housings have a differential pressure indicator: change the element when it shows red (typically 0.35–0.7 bar, depending on the make) — and change coalescers at least **once a year** whatever the gauge says, because their efficiency falls as the fibres load, while the pressure drop may not show it.

Pressure drop costs energy. To keep the pressure after the filter, the compressor must deliver $\\Delta p$ more, and its power rises by about

$$\\frac{\\Delta P}{P_c} = \\frac{\\ln\\left(1 + \\Delta p/p_\\text{abs}\\right)}{\\ln\\left(p_\\text{abs}/p_\\text{atm}\\right)}$$

— the isothermal estimate, **about 6 % per bar** at 7 bar gauge (7–8 % for real compressors, [[compression-work]]). A filter at 0.5 bar instead of 0.1 on a 65 kW compressor wastes 1.5 kW: about 9000 kWh over 6000 hours, several times the price of the element it was "saving". Because the drop through the fibre bed is roughly proportional to the flow, choosing a filter one size larger lowers it for the whole life of the element.

> [!warn] Isolate and exhaust a filter before opening its housing. Bowls are held by bayonet locks meant to be undone only without pressure; a bowl released under pressure becomes a projectile. Used coalescing elements and carbon are oily waste.
`,
  ideas: [
    'Particulate filters strain dust; coalescers catch sub-micron aerosols by impaction, interception and diffusion and drain them as drops.',
    'High-efficiency coalescers leave about 0.01 mg/m³ of oil aerosol; oil vapour needs activated carbon, placed after a coalescer.',
    'Pressure drop grows as the element loads; change at the indicator — and coalescers at least yearly.',
    'Each bar of pressure drop costs roughly 6–8 % more compressor power: a clogged filter costs far more than a new element.',
    'Oversizing a filter lowers its pressure drop for its whole life.'
  ],
  pitfalls: [
    'A coalescing filter removes oil vapour — It catches droplets only; vapour needs activated carbon.',
    'If the pressure gauge is still green, the coalescer is fine — Its efficiency falls with age before the pressure drop shows it; change at least yearly.',
    'Filter elements should last as long as possible to save money — The energy wasted by a high pressure drop usually costs several times the element.'
  ],
  formulas: [
    {
      name: 'Extra compressor power for a pressure drop',
      expr: 'dP = Pc*ln((p + pa + dp)/(p + pa))/ln((p + pa)/pa)',
      tex: '\\Delta P = P_c\\,\\dfrac{\\ln\\left(\\dfrac{p_g + p_\\text{atm} + \\Delta p}{p_g + p_\\text{atm}}\\right)}{\\ln\\left(\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}\\right)}',
      vars: {
        dP: { name: 'extra compressor power', q: 'power', unit: 'kW', tex: '\\Delta P' },
        Pc: { name: 'compressor power', q: 'power', unit: 'kW', value: 65, tex: 'P_c' },
        p: { name: 'pressure needed after the filter (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_g' },
        pa: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        dp: { name: 'pressure drop across the filter', q: 'pressure', unit: 'bar', value: 0.5, tex: '\\Delta p' }
      },
      note: 'Isothermal work ratio: the compressor must raise the pressure by $\\Delta p$ more for the same free air. Real compressors are nearer the adiabatic value, about a quarter more.',
      practice: { unknowns: ['dP', 'dp'] },
      stories: {
        dP: 'A {Pc} compressor supplies {p} through a filter with a pressure drop of {dp}. How much extra compressor power does the filter cost?',
        dp: 'A {Pc} compressor supplies {p}. What filter pressure drop costs {dP} of extra compressor power?'
      }
    },
    {
      name: 'Oil left after filters in series',
      expr: 'c2 = c0*(1 - e1)*(1 - e2)',
      tex: 'c_2 = c_0\\,(1 - \\eta_1)(1 - \\eta_2)',
      vars: {
        c2: { name: 'oil aerosol leaving the second filter', q: false, unit: 'mg/m³', tex: 'c_2' },
        c0: { name: 'oil aerosol entering', q: false, unit: 'mg/m³', value: 3, tex: 'c_0' },
        e1: { name: 'efficiency of the first filter', q: 'ratio', unit: '%', value: 97, min: 0, max: 99.99, tex: '\\eta_1' },
        e2: { name: 'efficiency of the second filter', q: 'ratio', unit: '%', value: 90, min: 0, max: 99.99, tex: '\\eta_2' }
      },
      note: 'Each stage passes a fraction $1 - \\eta$ of what reaches it. Makers usually rate coalescers by the oil left (0.1 or 0.01 mg/m³) at a stated inlet concentration; vapour is not included.',
      practice: { unknowns: ['c2', 'e2'] },
      stories: {
        c2: 'Oil aerosol of {c0} passes a general-purpose coalescer ({e1}) and then a high-efficiency one ({e2}). How much is left?',
        e2: 'A general-purpose coalescer ({e1}) is fed {c0} of oil aerosol. What efficiency must the next filter have to leave only {c2}?'
      }
    }
  ],
  examples: [
    {
      title: 'The price of a clogged filter',
      q: 'A high-efficiency coalescer on a 65 kW, 7 bar gauge compressor has reached 0.6 bar pressure drop; a new wetted element would drop 0.15 bar. The plant runs 6000 h a year at ¤0.15 per kWh, and an element costs ¤150.',
      steps: [
        'At 0.6 bar: $\\Delta P = 65 \\times \\ln(8.613/8.013)/\\ln(8.013/1.013) = 65 \\times 0.0722/2.068 = 2.27$ kW.',
        'At 0.15 bar: $65 \\times \\ln(8.163/8.013)/2.068 = 0.58$ kW.',
        'Difference 1.69 kW; over a year $1.69 \\times 6000 = 10\\,100$ kWh, about ¤1,500.'
      ],
      a: 'The clogged element wastes about ¤1,500 a year — ten times the price of a new one.'
    },
    {
      title: 'Reaching oil class 1',
      q: 'An oil-injected compressor delivers 3 mg/m³ of oil aerosol and a few hundredths of a mg/m³ of oil vapour. A general-purpose coalescer (97 %) is followed by a high-efficiency one (90 % of what reaches it). Is the air oil class 1?',
      steps: [
        'Aerosol after both: $3 \\times 0.03 \\times 0.10 = 0.009$ mg/m³.',
        'Add the vapour, a few hundredths of a mg/m³: the total exceeds 0.01 mg/m³.',
        'Class 1 counts total oil, so an activated carbon filter must follow to remove the vapour.'
      ],
      a: 'Not yet: the aerosol meets class 1 but the vapour does not. Add activated carbon after the high-efficiency coalescer.'
    }
  ],
  quiz: [
    { q: 'Which mechanism catches the smallest aerosols (below about 0.1 µm) in a coalescing filter?', choices: ['straining', 'inertial impaction', 'diffusion (Brownian motion)', 'gravity'], a: 2,
      why: 'Tiny droplets wander randomly and touch fibres; large ones hit by inertia; the hardest to catch are in between, around 0.1–0.3 µm.' },
    { q: 'An activated carbon filter may be fitted without a coalescer in front of it.', a: false,
      why: 'Liquid oil aerosol would saturate the carbon within days; carbon is for vapour after a high-efficiency coalescer.' },
    { q: 'A coalescing filter\'s differential indicator is still green after two years. The element…', choices: ['is fine: the indicator says so', 'should have been changed: coalescer efficiency falls with age before the pressure drop shows it', 'never needs changing', 'should be blown clean with compressed air'], a: 1,
      why: 'Makers call for a new coalescing element at least yearly.' },
    { q: 'A 60 kW compressor supplies 7 bar gauge through a filter with a 0.4 bar drop. Using the isothermal estimate, how much extra compressor power does the filter cost?', answer: 1.41, unit: 'kW', tol: 0.03,
      why: '$60 \\times \\ln(8.413/8.013)/\\ln(8.013/1.013) = 60 \\times 0.0487/2.068 = 1.41$ kW.' },
    { q: 'Oil vapour in compressed air is removed by…', choices: ['a particulate filter', 'a coalescing filter', 'activated carbon', 'a water separator'], a: 2,
      why: 'Vapour is a gas; only adsorption on carbon catches it.' }
  ],
  problems: [
    { q: 'Oil aerosol of 4 mg/m³ passes a general-purpose coalescer (98 %) and then a high-efficiency one (90 % of what reaches it). How much oil aerosol is left?', answer: 0.008, unit: 'mg/m³', tol: 0.02,
      steps: ['After the first: $4 \\times 0.02 = 0.08$ mg/m³.', 'After the second: $0.08 \\times 0.10 = 0.008$ mg/m³.'] }
  ],
  applications: [
    'Coalescing filters before desiccant dryers and at paint, food and instrument air points.',
    'Dust filters after desiccant dryers.',
    'Activated carbon for odour-free and oil-class-1 air.',
    'Differential-pressure monitoring in condition-based maintenance ([[maintenance-pneu]]).'
  ],
  sim: 'treat-filter'
},

{
  id: 'lubricators', parent: 'air-quality', title: 'Lubricated and oil-free air', level: 1,
  short: 'Lubricators add a mist of oil to the air for valves, cylinders and air tools. Most modern components are greased for life and run best on clean, dry, oil-free air — but once a component has been run on oil, it must stay on oil.',
  keywords: ['lubricator', 'oil mist', 'oil fog', 'micro-fog', 'lubricated air', 'non-lubricated air', 'lubricated for life', 'once lubricated always lubricated', 'white card test', 'oil-free air'],
  prereq: ['pneumatic-cylinder', 'iso-8573'],
  related: ['frl-units', 'air-filters', 'air-motors', 'air-tools', 'maintenance-pneu', 'noise-silencers'],
  body: `
For decades every pneumatic machine had an oil bottle: a **lubricator** that turned a little oil into mist, to be carried by the air to the valves and cylinders and keep their seals and spools slippery. Today most components are **lubricated for life**: a special grease applied at assembly lasts many millions of cycles on clean, dry, *oil-free* air. The lubricator has become the exception — and a common source of trouble when it is fitted out of habit.

### How a lubricator works
Air flowing through a lubricator passes a restriction — a venturi, or a spring-loaded flap — whose pressure drop pushes oil up a tube from the bowl into a sight dome, where it drips into the air stream and is torn into mist. Because the drop grows with the flow, the oil fed is roughly proportional to the air used. **Oil-fog** lubricators send all the drops downstream; the larger ones fall out within a few metres, so the lubricator must sit close to the consumer. **Micro-fog** lubricators return the large drops to the bowl and pass on only a fine mist that travels tens of metres. A lubricator always comes after the filter and regulator ([[frl-units]]).

How much oil? A lubricator is set by counting drops — typically one for every few hundred to a thousand litres of free air — and checked by holding a white card near an exhaust: a faint film is right, drips are far too much. Even a light setting makes very oily air: one 0.025 mL drop in 500 L is about **43 mg of oil per m³**, oil class X of [[iso-8573]], four thousand times the 0.01 mg/m³ of oil class 1.

### Once lubricated, always lubricated
Added oil dissolves the factory grease and washes it out. As long as the oil keeps coming, all is well; but if the lubricator runs dry, or someone removes it, the component is left with neither grease nor oil and its seals wear quickly. So a machine that has run on lubricated air must stay on lubricated air — or have its valves and cylinders replaced or re-greased. The wrong oil makes it worse: some additives and ester-based oils swell or shrink seals. A thin mineral oil of viscosity grade ISO VG 32 is the usual choice; follow the component maker's recommendation.

### Why oil-free is better
- **Health**: exhausts spray the oil into the workplace as mist that people breathe; oil mist has occupational exposure limits in most countries.
- **Product**: food, pharmaceuticals, paint and electronics must not see oil.
- **Maintenance**: oil gums up silencers and sensors ([[noise-silencers]]), binds dirt into sludge, and needs topping up.
- **Environment**: litres of oil a year per machine end up in the air, on the floor and in the condensate.

Oil carried over from an oil-injected compressor is not a lubricant for the system: it is degraded, mixed with water and forms varnish, and must be filtered out like any other contaminant ([[air-filters]]).

### Where oil still makes sense
Air tools and air motors with sliding vanes ([[air-motors]], [[air-tools]]) usually need a steady oil feed — a lubricator close to the tool, or an oiler at its inlet — unless they are designed to run dry. Some older or very large valves and cylinders were designed for lubricated air and keep needing it.

> [!tip] Taking a lubricator away? Check first whether the machine has been running on oil. If it has, plan to replace or re-grease its valves and cylinders; otherwise, keep the lubricator filled.
`,
  ideas: [
    'Most modern valves and cylinders are greased for life and run best on clean, dry, oil-free air.',
    'A lubricator feeds oil roughly in proportion to the air flow; oil-fog must sit within a few metres of the consumer, micro-fog travels further.',
    'Once lubricated, always lubricated: added oil washes out the factory grease.',
    'Even a light lubricator setting makes air with tens of mg/m³ of oil — mist in the workplace and in the product.',
    'Vane air motors and air tools usually still need oil.'
  ],
  pitfalls: [
    'Oil in the air makes every component last longer — Lubricated-for-life components lose their grease to the oil and then depend on it for ever.',
    'Compressor carry-over oil lubricates the machines for free — It is degraded, wet and varnish-forming: a contaminant to be filtered out.',
    'More oil is safer — Excess oil floods valves, collects dirt, clogs silencers and ends up as mist in the air people breathe.'
  ],
  formulas: [
    {
      name: 'Oil concentration from a lubricator',
      expr: 'c = 1e6*Vd*rho/Va',
      tex: 'c_o = 10^{6}\\,\\dfrac{V_d\\,\\rho_o}{V_a}',
      vars: {
        c: { name: 'oil concentration in the air', q: false, unit: 'mg/m³', tex: 'c_o' },
        Vd: { name: 'volume of one drop', q: false, unit: 'mL', value: 0.025, tex: 'V_d' },
        rho: { name: 'oil density', q: false, unit: 'g/mL', value: 0.86, tex: '\\rho_o' },
        Va: { name: 'free air per drop', q: false, unit: 'L', value: 500, tex: 'V_a' }
      },
      note: 'Drop volume × density gives the oil mass in grams; $10^6$ converts g per L into mg per m³. A drop from a sight dome is typically 0.02–0.03 mL.',
      practice: { unknowns: ['c', 'Va'] },
      stories: {
        c: 'A lubricator adds one {Vd} drop of oil (density {rho}) to every {Va} of free air. What is the oil concentration?',
        Va: 'A lubricator\'s drops are {Vd} (density {rho}). How much free air per drop gives {c}?'
      }
    },
    {
      name: 'Oil fed into the air per year',
      expr: 'Vo = Q*t*Vd/Va',
      tex: 'V_o = Q\\,t\\,\\dfrac{V_d}{V_a}',
      vars: {
        Vo: { name: 'oil used', q: 'volume', unit: 'L', tex: 'V_o' },
        Q: { name: 'average free-air consumption', q: 'airflow', unit: 'L/min ANR', value: 300 },
        t: { name: 'running time', q: 'time', unit: 'h', value: 4000 },
        Vd: { name: 'volume of one drop', q: 'volume', unit: 'mL', value: 0.025, tex: 'V_d' },
        Va: { name: 'free air per drop', q: 'volume', unit: 'L', value: 500, tex: 'V_a' }
      },
      note: 'All of it leaves through the exhausts: as mist into the room, as film on the machine, into silencers and condensate.',
      practice: { unknowns: ['Vo', 'Q'] },
      stories: { Vo: 'A machine uses {Q} of lubricated air for {t} a year; the lubricator adds a {Vd} drop to every {Va}. How much oil goes into the air?' }
    }
  ],
  examples: [
    {
      title: 'Where the oil goes',
      q: 'A machine uses an average of 300 L/min of free air for 4000 h a year. Its lubricator adds one 0.025 mL drop (0.86 g/mL) for every 500 L. How much oil does it feed, and how oily is the air?',
      steps: [
        'Air per year: $300 \\times 60 \\times 4000 = 72\\times10^{6}$ L; drops: $72\\times10^{6}/500 = 144\\,000$.',
        'Oil: $144\\,000 \\times 0.025 = 3600$ mL = 3.6 L.',
        'Concentration: $10^{6} \\times 0.025 \\times 0.86/500 = 43$ mg/m³.'
      ],
      a: '3.6 litres of oil a year leave through the exhausts, in air carrying about 43 mg/m³ — oil class X.'
    }
  ],
  quiz: [
    { q: 'A cylinder "lubricated for life" will last longer if a lubricator is added.', a: false,
      why: 'The oil washes out the factory grease; the cylinder then depends on the oil supply, and suffers badly if it stops.' },
    { q: 'A machine has run on lubricated air for years. The lubricator is removed. What happens?', choices: ['nothing: the components are lubricated for life', 'the seals wear quickly: the oil has washed out the original grease', 'the machine runs faster', 'the air consumption rises'], a: 1,
      why: 'Once lubricated, always lubricated — or replace or re-grease the components.' },
    { q: 'Where does a lubricator go in a service unit?', choices: ['before the filter', 'between filter and regulator', 'after the regulator, close to the consumers', 'at the compressor outlet'], a: 2,
      why: 'After the regulator its feed is steady, and oil mist drops out over long distances.' },
    { q: 'Is the oil carried over from an oil-injected compressor useful lubrication?', choices: ['yes, it saves a lubricator', 'no: it is degraded, mixed with water and forms varnish; it must be filtered out', 'only in winter', 'only for air motors'], a: 1,
      why: 'Carry-over is a contaminant, not a lubricant.' },
    { q: 'A lubricator adds one 0.03 mL drop of oil (0.86 g/mL) to every 400 L of free air. What is the oil concentration?', answer: 64.5, unit: 'mg/m³', tol: 0.02,
      why: '$10^{6} \\times 0.03 \\times 0.86/400 = 64.5$ mg/m³.' }
  ],
  problems: [
    { q: 'A lubricator adds one 0.025 mL drop for every 800 L of free air, on a machine using 500 L/min for 3000 h a year. How much oil does it feed per year?', answer: 2.81, unit: 'L', tol: 0.02,
      steps: ['Air: $500 \\times 60 \\times 3000 = 90\\times10^{6}$ L.', 'Drops: $90\\times10^{6}/800 = 112\\,500$.', 'Oil: $112\\,500 \\times 0.025$ mL = 2.81 L.'] }
  ],
  applications: [
    'Lubricators close to vane air motors and air tools.',
    'Old machines built for lubricated air.',
    'Converting a plant to oil-free air: the audit of which machines must stay on oil.'
  ]
},

{
  id: 'frl-units', parent: 'air-quality', title: 'Service units: filter, regulator, lubricator', level: 1,
  short: 'The service unit (FRL) at the entry to each machine: a lockable shut-off and exhaust valve, a filter with water separator, a pressure regulator with gauge, a lubricator where needed, a soft-start valve and a pressure switch — chosen for the flow it must pass.',
  keywords: ['service unit', 'FRL', 'filter regulator lubricator', 'air preparation', 'shut-off valve', 'lock-out', 'soft-start valve', 'filter bowl', 'polycarbonate bowl', 'auto drain', 'sizing', 'sonic conductance'],
  prereq: ['air-filters', 'pressure-regulators', 'sonic-conductance'],
  related: ['lubricators', 'soft-start', 'pressure-switches', 'emergency-stop-pneu', 'pneumatic-safety', 'iso-4414', 'iso-1219-pneu', 'pneumatic-cylinder'],
  body: `
Where a machine takes its air from the plant network sits a row of blocks bolted together: the **service unit**, or FRL — filter, regulator, lubricator. It is the machine's own last stage of air treatment and its main air valve, and usually the first thing to look at when a machine misbehaves.

### What is in it, in order
1. **Shut-off valve**, lockable: usually a manual 3/2 valve that closes the supply *and exhausts* the machine. This is where the machine is isolated for maintenance (lock-out, tag-out).
2. **Filter with water separator**: a swirl vane spins the air so that water drops and heavy dirt fly to the bowl wall; a 5–40 µm element catches the rest; a baffle keeps the collected water calm so that it is not picked up again; a drain (manual, semi-automatic or float) empties the bowl.
3. **Regulator with gauge**: brings the fluctuating network pressure down to the steady pressure the machine is set for ([[pressure-regulators]]).
4. **Lubricator**, only where the machine needs oil ([[lubricators]]).
5. **Soft-start valve**: fills the machine slowly through a throttle until about half the pressure is reached, then opens fully, so that cylinders left in mid-stroke move gently back instead of jumping ([[soft-start]]).
6. Often a **pressure switch** that tells the controller the air is on ([[pressure-switches]]), and a branching block for other consumers.

The filter comes before the regulator because dirt damages the regulator's seat and diaphragm; the lubricator after it, so that it feeds at a steady pressure and sits closest to the consumers. In circuit diagrams ([[iso-1219-pneu]]) the unit may be drawn as one simplified symbol: a dash-dotted box holding a filter, a regulator with its gauge and a lubricator.

### Choosing one: by flow, not by port
Every block drops some pressure, and the drop grows steeply with the flow. Two units with the same port thread can pass very different flows. Makers give flow curves or, better, the sonic conductance $C$ and critical pressure ratio $b$ of ISO 6358-1:2013 ([[sonic-conductance]]), from which the outlet pressure at any flow follows. A good rule is that at the machine's **peak** flow — when all its cylinders move at once — the whole unit should drop no more than about 0.3–0.5 bar. Where it drops more, the regulator cannot hold its setting and cylinders slow down just when the machine needs them.

### Bowls and drains
Many bowls are transparent polycarbonate, so the water level can be seen. Polycarbonate is weakened by solvents, some synthetic compressor oils, certain cleaners and sunlight, and can crack without warning; it must always sit inside its metal guard. Metal bowls with a sight glass are used where the air or the room is hot, where solvents are present, or at higher pressures. Automatic float drains in bowls clog like any float drain ([[condensate-drains]]); check that the bowl never fills to the baffle.

> [!warn] The service unit is the lock-out point of a pneumatic machine. Before any work: close and lock the shut-off valve, check that the machine side is exhausted (gauge at zero), and remember that air trapped behind closed valves, check valves or in cylinders can still move parts — exhaust it or block the load. Never remove a filter or lubricator bowl under pressure.
`,
  ideas: [
    'A service unit is a machine\'s last treatment stage and its main air valve: shut-off and exhaust, filter, regulator, (lubricator), soft start, pressure switch.',
    'Filter before regulator, lubricator after; the shut-off valve must exhaust the machine and be lockable.',
    'Choose it for the peak flow: the whole unit should drop no more than about 0.3–0.5 bar.',
    'The ISO 6358 conductance of the unit gives its outlet pressure at any flow.',
    'Polycarbonate bowls need their guards and must be kept away from solvents.'
  ],
  pitfalls: [
    'A service unit is chosen by the port size of the machine — Units with the same port can differ several times in flow; size by the peak flow and the pressure drop.',
    'Closing the supply valve makes the machine safe — The machine side must also be exhausted, and trapped air elsewhere released or the load blocked.',
    'A metal guard makes a polycarbonate bowl safe with solvents — The guard contains fragments; the bowl is still attacked. Use a metal bowl.'
  ],
  formulas: [
    {
      name: 'Flow through a service unit (ISO 6358, subsonic)',
      expr: 'Q = C*p1*sqrt(1 - ((p2/p1 - b)/(1 - b))^2)',
      tex: 'Q = C\\,p_1\\sqrt{1 - \\left(\\dfrac{p_2/p_1 - b}{1 - b}\\right)^2}',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance of the unit', q: 'flowcond', unit: 'dm³/(s·bar)', value: 15 },
        p1: { name: 'inlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_1' },
        p2: { name: 'outlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.7, tex: 'p_2' },
        b: { name: 'critical pressure ratio', value: 0.3, min: 0, max: 0.9 }
      },
      note: 'Valid while the flow is subsonic, $p_2/p_1 > b$ — always the case in a service unit that is working properly. Absolute pressures: add 1.013 bar to gauge readings. Air at 20 °C.',
      practice: { unknowns: ['Q', 'p2'] },
      stories: {
        Q: 'A service unit with a sonic conductance of {C} and $b$ = {b} is fed at {p1} (absolute). What flow does it pass with {p2} (absolute) at its outlet?',
        p2: 'A service unit ({C}, $b$ = {b}) is fed at {p1} (absolute) and must pass {Q}. What is its outlet pressure (absolute)?'
      }
    },
    {
      name: 'Soft-start filling time',
      expr: 't = V*dp/(pa*Q)',
      tex: 't = \\dfrac{V\\,\\Delta p}{p_\\text{atm}\\,Q}',
      vars: {
        t: { name: 'time for the slow fill', q: 'time', unit: 's' },
        V: { name: 'volume of the machine (pipes, valves, cylinder chambers)', q: 'volume', unit: 'L', value: 20 },
        dp: { name: 'pressure rise during the slow fill', q: 'pressure', unit: 'bar', value: 3, tex: '\\Delta p' },
        pa: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        Q: { name: 'free-air flow through the soft-start throttle', q: 'airflow', unit: 'L/min ANR', value: 600 }
      },
      note: 'Isothermal filling; the throttle is choked while the machine side is below about half the supply pressure, so its free-air flow is nearly constant.',
      practice: { unknowns: ['t', 'Q'] },
      stories: {
        t: 'A soft-start valve fills {V} of machine volume by {dp} at a steady {Q} of free air. How long does the slow fill take?',
        Q: 'A {V} machine must be filled by {dp} in {t}. What free-air flow must the soft-start throttle pass?'
      }
    }
  ],
  examples: [
    {
      title: 'Is the service unit big enough?',
      q: 'A machine\'s peak demand is 2000 L/min of free air. The supply is 6 bar gauge (7.01 bar absolute). The proposed service unit has $C$ = 12 dm³/(s·bar) and $b$ = 0.3. What pressure does the machine get at peak flow — and with a unit of $C$ = 20?',
      steps: [
        '$Q = 2000/60 = 33.3$ L/s; $C p_1 = 12 \\times 7.01 = 84.2$ L/s, so the flow is 0.396 of the choked flow.',
        '$\\sqrt{1 - 0.396^2} = 0.918$, so $p_2/p_1 = 0.3 + 0.7 \\times 0.918 = 0.943$ and $p_2 = 6.61$ bar absolute: a drop of 0.40 bar.',
        'With $C$ = 20: $Cp_1 = 140$ L/s, flow ratio 0.238, $\\sqrt{1 - 0.238^2} = 0.971$, $p_2/p_1 = 0.980$, $p_2 = 6.87$ bar absolute: a drop of 0.14 bar.'
      ],
      a: 'The smaller unit drops 0.4 bar at peak flow — just acceptable; the larger one only 0.14 bar.'
    },
    {
      title: 'How slow is a soft start?',
      q: 'A machine has 20 L of internal volume. Its soft-start valve fills it through a throttle passing 600 L/min of free air until half of the 6 bar supply is reached, then opens fully. How long does the slow fill take?',
      steps: [
        'Free air needed to raise 20 L by 3 bar: $20 \\times 3/1.013 = 59$ L.',
        'At 600 L/min: $59/600 = 0.099$ min = 5.9 s.'
      ],
      a: 'About 6 seconds of gentle filling before the valve opens fully.'
    }
  ],
  quiz: [
    { q: 'In a service unit, the filter comes before the regulator because…', choices: ['the regulator needs oil', 'dirt would damage the regulator\'s seat and diaphragm', 'the gauge must read filtered air', 'filters work only at high pressure'], a: 1,
      why: 'Particles on the seat make a regulator creep and leak; the filter protects it.' },
    { q: 'The shut-off valve at the head of a service unit should…', choices: ['only close the supply', 'close the supply, exhaust the machine and be lockable', 'be a non-return valve', 'be left out if there is a soft-start valve'], a: 1,
      why: 'It is the isolation point for lock-out: the machine side must be vented, and the valve locked shut.' },
    { q: 'A polycarbonate bowl is fine near solvent-based cleaners as long as it is inside its guard.', a: false,
      why: 'Solvents attack polycarbonate, which can crack without warning; the guard only contains the pieces. Use a metal bowl.' },
    { q: 'Why choose a service unit by flow rather than by port size?', choices: ['ports are not standard', 'units with the same port pass very different flows, and too small a unit drops pressure just when the machine needs air', 'flow does not matter to a regulator', 'larger ports leak'], a: 1,
      why: 'The pressure drop at peak flow is what matters.' },
    { q: 'A soft-start valve fills 15 L of machine volume by 3 bar at a steady 450 L/min of free air. How long does the slow fill take?', answer: 5.92, unit: 's', tol: 0.02,
      why: '$15 \\times 3/1.013 = 44.4$ L of free air; at 7.5 L/s that takes 5.9 s.' }
  ],
  problems: [
    { q: 'A service unit with a sonic conductance of 8 dm³/(s·bar) and $b$ = 0.3 is fed at 7.0 bar absolute and must pass 1000 L/min of free air. What is its outlet pressure (absolute)?', answer: 6.78, unit: 'bar', tol: 0.005,
      steps: ['$Q = 16.7$ L/s; $Cp_1 = 8 \\times 7 = 56$ L/s; ratio 0.298.', '$\\sqrt{1 - 0.298^2} = 0.955$; $p_2/p_1 = 0.3 + 0.7 \\times 0.955 = 0.968$.', '$p_2 = 6.78$ bar absolute — a drop of 0.22 bar.'] }
  ],
  applications: [
    'The air entry of every pneumatic machine, often with a lockable dump valve and soft start.',
    'Filter-regulators at the point of use for tools and instruments.',
    'Machine safety: the isolation and exhaust point for lock-out under ISO 4414:2010 ([[iso-4414]]).'
  ],
  sim: 'treat-regulator'
},

{
  id: 'pressure-regulators', parent: 'air-quality', title: 'Pressure regulators', level: 2,
  short: 'A pressure regulator holds its outlet at a set pressure below a fluctuating supply: a set spring pushes a diaphragm and poppet open, the outlet pressure pushes back. Its outlet droops as the flow rises and shifts with the supply; relieving regulators vent any excess.',
  keywords: ['pressure regulator', 'pressure-reducing valve', 'diaphragm', 'set spring', 'poppet', 'droop', 'flow characteristic', 'supply pressure effect', 'relieving', 'non-relieving', 'balanced poppet', 'precision regulator', 'pilot-operated regulator', 'hysteresis'],
  prereq: ['absolute-gauge-pressure', 'physics:hookes-law', 'physics:pressure'],
  related: ['frl-units', 'proportional-pressure', 'pressure-optimisation', 'pressure-boosters', 'sonic-conductance', 'hydraulics:reducing-valve', 'hydraulics:relief-valve'],
  body: `
The pressure in a factory network is never steady: it swings with the compressor's load and unload band, typically by about 1 bar, and sags when many machines draw air at once. A machine, though, needs a steady pressure — its cylinders' forces, its gripping and pressing, its blow-off all depend on it — and usually a lower one than the network, because every bar less saves air ([[pressure-optimisation]]). A **pressure regulator** (a pressure-reducing valve, [[hydraulics:reducing-valve|as in hydraulics]]) takes the higher, fluctuating inlet pressure and holds its outlet at a set lower value.

### How it works
In the common direct-acting design, the adjusting knob compresses a **set spring** that pushes down on a **diaphragm**; the diaphragm pushes a **poppet** off its **seat**, letting air from the inlet into the outlet. The outlet pressure acts under the diaphragm and pushes back. The poppet settles where the forces balance (gauge pressures; the bonnet above the diaphragm is open to the atmosphere):

$$p_2\\,(A_d - A_v) = F_s - k\\,x - p_1 A_v$$

where $F_s$ is the set spring's force with the valve closed, $k$ its stiffness ([[physics:hookes-law|Hooke's law]]), $x$ the poppet's opening, $A_d$ the diaphragm's effective area and $A_v$ the seat area on which the inlet pressure $p_1$ pushes the poppet shut. Use air downstream and the outlet pressure falls, the diaphragm moves down, the poppet opens further and more air flows in — a mechanical feedback loop that needs no power.

### Droop, supply effect and the characteristic
Two small errors follow directly from the force balance:

- **Droop** (the flow effect): to pass more air the poppet must open further; the set spring then extends and pushes less, so the outlet falls by $k\\,x/(A_d - A_v)$. A stiff spring on a small diaphragm droops most.
- **Supply-pressure effect**: the inlet pressure pushes the poppet shut with the force $p_1 A_v$. If the supply falls by $\\Delta p_1$, that force falls and the outlet *rises* by $\\Delta p_1 A_v/(A_d - A_v)$ — a few hundredths of a bar per bar for a typical unbalanced poppet. **Balanced poppets**, with the inlet pressure acting on both ends, all but remove it.

Plotting the outlet pressure against the flow gives the regulator's **flow characteristic**: nearly flat at small flows, a steady droop over the working range, then a steep fall once the poppet is wide open and the valve simply acts as a restriction ([[sonic-conductance]]). Friction in the diaphragm and seals adds **hysteresis**: the curve for rising flow lies a little below the curve for falling flow. The **pressure characteristic** plots the outlet against the inlet pressure at a constant flow.

| Regulator | Droop over its working range | Sensitivity | Air it uses itself |
|---|---|---|---|
| Direct-acting, general purpose | 0.2–0.6 bar | about 0.02–0.05 bar | none |
| Pilot-operated | below 0.1 bar | about 0.01 bar | a little |
| Precision (nozzle–flapper pilot) | a few mbar | about 1 mbar | a steady bleed of 1–5 L/min |

### Relieving or non-relieving
A **relieving** regulator has a small vent hole through the middle of the diaphragm, closed by the tip of the poppet stem. If the outlet pressure rises above the setting — because the knob was turned down, a cylinder pushed back on the outlet air, or the air warmed up — the diaphragm lifts off the stem and vents the excess to atmosphere. A **non-relieving** regulator traps it: turn the knob down with no air flowing and the gauge does not move until something uses air. Relieving regulators are the norm in pneumatics; non-relieving ones are used where the gas must not escape (costly or hazardous gases), and then a separate relief valve ([[hydraulics:relief-valve|relief valve]]) protects the outlet side.

### Using a regulator well
- Set the pressure by coming **up** to the value: turn below it, then raise to it, so that friction does not leave the setting high.
- Lock the knob once set. A regulator turned up "to make it faster" wastes air and hits end stops harder.
- A regulator cannot raise the pressure: if the supply falls below the setting, the outlet follows the supply. For more pressure than the network has, see [[pressure-boosters]].
- Where the pressure must change during a cycle, or be set by a controller, a [[proportional-pressure|proportional pressure regulator]] does it electrically.

> [!warn] A regulator is not a safety device. Turning it down does not exhaust a non-relieving outlet, and trapped air can still move a cylinder; isolate and exhaust at the service unit before working on a machine.
`,
  ideas: [
    'A set spring opens the valve and the outlet pressure closes it: the poppet settles where $p_2(A_d - A_v) = F_s - kx - p_1A_v$.',
    'Droop: the more flow, the wider the opening and the weaker the spring push — the outlet falls by $kx/(A_d - A_v)$.',
    'Supply effect: with an unbalanced poppet the outlet rises slightly when the supply falls; balanced poppets remove it.',
    'Relieving regulators vent excess outlet pressure; non-relieving ones trap it.',
    'Every bar the regulator takes off saves about an eighth of the air at 7 bar — set the lowest pressure that does the job.'
  ],
  pitfalls: [
    'A regulator holds its setting exactly at any flow — The outlet droops with flow and falls steeply once the valve is wide open.',
    'Turning a regulator down immediately lowers the pressure downstream — Only a relieving regulator vents; a non-relieving one traps the old pressure until air is used.',
    'A regulator can make up for a weak supply — It can only reduce; with the supply below the setting, the outlet simply follows the supply.'
  ],
  formulas: [
    {
      name: 'Force balance of a direct-acting regulator',
      expr: 'p2 = (Fs - k*x - p1*Av)/(Ad - Av)',
      tex: 'p_2 = \\dfrac{F_s - k\\,x - p_1 A_v}{A_d - A_v}',
      vars: {
        p2: { name: 'outlet pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        Fs: { name: 'set spring force with the valve closed', q: 'force', unit: 'N', value: 1181, tex: 'F_s' },
        k: { name: 'set spring stiffness', q: 'stiffness', unit: 'N/mm', value: 30 },
        x: { name: 'poppet opening', q: 'length', unit: 'mm', value: 1 },
        p1: { name: 'inlet pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_1' },
        Av: { name: 'seat area', q: 'area', unit: 'cm²', value: 0.5, tex: 'A_v' },
        Ad: { name: 'effective diaphragm area', q: 'area', unit: 'cm²', value: 19.6, tex: 'A_d' }
      },
      note: 'Unbalanced poppet, inlet pressure pushing it shut; the small return spring under the poppet and the friction are neglected. With the valve closed ($x$ = 0) the outlet sits at its set pressure.',
      practice: { unknowns: ['p2', 'Fs'] },
      stories: {
        p2: 'A regulator (diaphragm {Ad}, seat {Av}) has its set spring ({k}) preloaded to {Fs}. With {p1} at the inlet and the poppet open {x}, what is the outlet pressure?',
        Fs: 'A regulator (diaphragm {Ad}, seat {Av}, spring {k}) must give {p2} with {p1} at the inlet when its poppet is open {x}. What set spring force is needed?'
      }
    },
    {
      name: 'Droop with flow',
      expr: 'dp2 = k*x/(Ad - Av)',
      tex: '\\Delta p_2 = \\dfrac{k\\,x}{A_d - A_v}',
      vars: {
        dp2: { name: 'fall in outlet pressure', q: 'pressure', unit: 'bar', tex: '\\Delta p_2' },
        k: { name: 'set spring stiffness', q: 'stiffness', unit: 'N/mm', value: 30 },
        x: { name: 'poppet opening', q: 'length', unit: 'mm', value: 1 },
        Ad: { name: 'effective diaphragm area', q: 'area', unit: 'cm²', value: 19.6, tex: 'A_d' },
        Av: { name: 'seat area', q: 'area', unit: 'cm²', value: 0.5, tex: 'A_v' }
      },
      note: 'Soft springs and large diaphragms droop least; pilot-operated regulators replace the set spring\'s travel by a pilot pressure and droop far less.',
      practice: { unknowns: ['dp2', 'k'] },
      stories: {
        dp2: 'A regulator\'s set spring has a stiffness of {k}; the diaphragm is {Ad} and the seat {Av}. How far does the outlet droop when the poppet opens {x}?',
        k: 'A regulator (diaphragm {Ad}, seat {Av}) may droop no more than {dp2} at an opening of {x}. How stiff may its set spring be?'
      }
    },
    {
      name: 'Supply-pressure effect',
      expr: 'dp2 = dp1*Av/(Ad - Av)',
      tex: '\\Delta p_2 = \\Delta p_1\\,\\dfrac{A_v}{A_d - A_v}',
      vars: {
        dp2: { name: 'rise in outlet pressure', q: 'pressure', unit: 'bar', tex: '\\Delta p_2' },
        dp1: { name: 'fall in supply pressure', q: 'pressure', unit: 'bar', value: 2, tex: '\\Delta p_1' },
        Av: { name: 'seat area', q: 'area', unit: 'cm²', value: 0.5, tex: 'A_v' },
        Ad: { name: 'effective diaphragm area', q: 'area', unit: 'cm²', value: 19.6, tex: 'A_d' }
      },
      note: 'For an unbalanced poppet that the inlet pressure pushes shut. A balanced poppet makes $A_v$ effectively zero.',
      stories: { dp2: 'The supply to a regulator (diaphragm {Ad}, unbalanced seat {Av}) falls by {dp1}. By how much does its outlet rise?' }
    },
    {
      name: 'Air saved by regulating down',
      expr: 'S = 1 - (p2 + pa)/(p1 + pa)',
      tex: 'S = 1 - \\dfrac{p_2 + p_\\text{atm}}{p_1 + p_\\text{atm}}',
      vars: {
        S: { name: 'share of free air saved per stroke', q: 'ratio', unit: '%' },
        p2: { name: 'regulated pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_2' },
        p1: { name: 'network pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_1' },
        pa: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Free air per stroke is proportional to the absolute pressure the chambers are filled to (see [[air-consumption]]); the force falls with the gauge pressure, so check it is still enough.',
      practice: { unknowns: ['S', 'p2'] },
      stories: {
        S: 'A machine on a {p1} network is regulated to {p2}. What share of its air does that save?',
        p2: 'A machine on a {p1} network must save {S} of its air. To what pressure should it be regulated?'
      }
    }
  ],
  examples: [
    {
      title: 'How much does it droop?',
      q: 'A regulator has a 50 mm diaphragm ($A_d$ = 19.6 cm²), an 8 mm seat ($A_v$ = 0.50 cm²) and a 30 N/mm set spring. It is set to 6.0 bar with no flow and 7 bar supply. At its rated flow the poppet opens 1.5 mm, and at the same time the supply sags to 5.5 bar. What does the outlet read?',
      steps: [
        'Set spring force: $F_s = 6\\times10^{5} \\times 19.1\\times10^{-4} + 7\\times10^{5} \\times 0.5\\times10^{-4} = 1146 + 35 = 1181$ N.',
        'Droop: $30\\,000 \\times 0.0015/19.1\\times10^{-4} = 23\\,600$ Pa = 0.24 bar.',
        'Supply effect: the supply fell 1.5 bar, so the outlet rises $1.5 \\times 0.5/19.1 = 0.04$ bar.',
        'Outlet: $6.00 - 0.24 + 0.04 = 5.80$ bar.'
      ],
      a: 'About 5.8 bar — the droop dominates; the supply sag even helps a little.'
    },
    {
      title: 'Turning the knob down',
      q: 'A machine\'s outlet side holds 2 L of air at 6 bar gauge. The regulator is turned down to 4 bar with nothing moving. What happens with a relieving and with a non-relieving regulator?',
      steps: [
        'Excess air: $2\\ \\text{L} \\times (6 - 4)/1.013 = 3.9$ L of free air.',
        'Relieving: the diaphragm lifts off the stem and vents those 3.9 L within a moment; the gauge falls to 4 bar.',
        'Non-relieving: nothing vents; the gauge stays at 6 bar until the machine has used 3.9 L of free air.'
      ],
      a: 'The relieving regulator drops to 4 bar at once; the non-relieving one keeps 6 bar until the air is used up.'
    }
  ],
  quiz: [
    { q: 'As the flow through a direct-acting regulator increases, its outlet pressure…', choices: ['rises', 'stays exactly constant', 'falls a little (droop), then steeply when the valve is wide open', 'oscillates'], a: 2,
      why: 'The set spring pushes less as the poppet opens, and once wide open the valve is just a restriction.' },
    { q: 'Turning the knob of a non-relieving regulator down immediately lowers the pressure in a closed downstream line.', a: false,
      why: 'It has no vent; the trapped pressure stays until air is used.' },
    { q: 'With an unbalanced poppet pushed shut by the inlet pressure, when the supply falls the outlet (at constant flow)…', choices: ['falls by the same amount', 'rises slightly', 'is unaffected', 'drops to zero'], a: 1,
      why: 'Less inlet force on the poppet leaves more of the spring force to open it: the outlet rises by $\\Delta p_1 A_v/(A_d - A_v)$.' },
    { q: 'A regulator\'s set spring has $k$ = 40 N/mm; its diaphragm area less its seat area is 18 cm². How much does the outlet droop when the poppet opens 2 mm?', answer: 0.444, unit: 'bar', tol: 0.02,
      why: '$40\\,000 \\times 0.002/18\\times10^{-4} = 44\\,400$ Pa.' },
    { q: 'Why set a regulator by approaching the value from below?', choices: ['to protect the gauge', 'friction leaves the setting slightly high when you come down to it; coming up gives a repeatable setting', 'the spring only works in compression', 'it saves air'], a: 1,
      why: 'Hysteresis from diaphragm and seal friction: approach from the same side every time.' }
  ],
  problems: [
    { q: 'A machine supplied at 7 bar gauge needs only 5 bar. What share of its air consumption does regulating it to 5 bar save?', answer: 25.0, unit: '%', tol: 0.02,
      steps: ['Air per stroke is proportional to the absolute pressure: 6.013 against 8.013 bar.', '$S = 1 - 6.013/8.013 = 0.250$ — 25 %.'] }
  ],
  applications: [
    'The regulator in every service unit, set to the lowest pressure that does the job.',
    'Separate lower pressures for return strokes and blow-off (air savings).',
    'Precision regulators for test rigs, balancing loads and bleed-type sensors.',
    'Pilot-operated regulators for large flows with little droop.'
  ],
  sim: 'treat-regulator'
}

);
