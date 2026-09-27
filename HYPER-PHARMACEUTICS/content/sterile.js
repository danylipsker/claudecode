/* HYPER-PHARMACEUTICS · content/sterile.js — Sterile products and parenterals (topic sterile-topic):
 * parenteral routes, sterilisation methods, D-value, z-value and F0, aseptic processing and cleanrooms,
 * pyrogens and endotoxins, formulating injections, freeze-drying and eye preparations.
 * Simulations in sims/sterile.js (ster-*). */
Hyper.add(

{
  id: 'parenteral-routes', parent: 'sterile-topic', title: 'Parenteral routes', level: 1,
  short: 'Parenteral routes put a medicine into the body without passing through the gut: into a vein, a muscle, the fat under the skin, the skin itself, the spinal fluid, a joint or the eye. They differ in speed, in volume and in how pure the product must be.',
  keywords: ['parenteral', 'injection', 'intravenous', 'IV', 'intramuscular', 'IM', 'subcutaneous', 'SC', 'intradermal', 'intrathecal', 'epidural', 'depot', 'flip-flop kinetics', 'absorption rate constant', 'lymphatic absorption'],
  prereq: ['routes', 'bioavailability', 'oral-absorption-pk', 'medicine:blood-vessels'],
  related: ['iv-infusion', 'depot-implants', 'injectable-formulation', 'biologics-formulation', 'infusion-rates', 'medication-errors', 'sterilisation-methods'],
  body: `
*Parenteral* means "beside the gut" (Greek *para enteron*): any route that puts a medicine into the body without passing through the digestive tract. An injection skips the stomach's acid and enzymes, the gut wall and the liver's [[first-pass|first pass]], so it works when a tablet cannot — for proteins such as insulin and antibodies, which would simply be digested; for a patient who is unconscious or vomiting; when an effect is needed within seconds; or when a drug must reach one place, such as a joint, the eye or the fluid around the spinal cord.

### The routes
| Route | Where it goes | Typical volume | How fast it acts |
|---|---|---|---|
| Intravenous (IV) | into a vein, as a bolus or an infusion | 1 mL to several litres | at once; bioavailability 100 % by definition |
| Intramuscular (IM) | into a skeletal muscle | up to 2–5 mL, less in small muscles | aqueous solutions within 10–30 min; oily solutions and suspensions over days to months |
| Subcutaneous (SC) | into the fat under the skin | usually up to 1–2 mL | slower than IM; large proteins over days |
| Intradermal (ID) | into the skin itself | about 0.1 mL | mostly local: skin tests, some vaccines |
| Intrathecal, epidural | into the spinal fluid, or just outside its sheath | a few mL | on the nerves directly, beyond the blood–brain barrier |
| Intra-articular, intravitreal | into a joint, into the eye | 0.05–5 mL | local, often long-acting |

### Absorption from a depot
Apart from the intravenous routes, an injection leaves a small depot from which the drug must diffuse into capillaries or lymph. To a good approximation this is first order: a fixed fraction of what remains is absorbed each hour, set by the absorption rate constant $k_a$. The time of the peak then follows from $k_a$ and the elimination rate constant $k$ — the same Bateman function as for [[oral-absorption-pk|oral absorption]], but without the gut.

Absorption is fastest where blood flow is high — a shoulder muscle faster than a buttock, a warm exercising muscle faster than a cold one — and it slows sharply in shock, when blood is diverted away from muscle and skin. Molecules larger than roughly 16–20 kDa, such as antibodies, are too big to enter blood capillaries and travel through the lymph instead: after a subcutaneous dose their peak comes 2–8 days later, with 50–80 % bioavailability.

### Flip-flop kinetics
When absorption is much slower than elimination, the tail of the blood-level curve falls at the rate of *absorption*, not elimination. The "half-life" read from the curve is then the absorption half-life. This is the principle of [[depot-implants|long-acting injections]]: an oily ester or a suspension given once a month, or microspheres that release for three months.

### What every injection must be
Whatever the route, a parenteral product must be **sterile** ([[sterilisation-methods]]), essentially free of **pyrogens** ([[pyrogens-endotoxins]]) and of **particles**, and as close to the body's tonicity and pH as the drug allows ([[injectable-formulation]]). The more direct the route, the stricter the rules: nothing that could harm nerves — preservatives, most antioxidants and co-solvents — may go into the spinal fluid.

> [!key] Routes differ in speed (IV at once, IM in minutes, SC in hours, depots over weeks), in volume and in what the product may contain. Wrong-route errors are among the most dangerous [[medication-errors]] — some anticancer drugs are fatal if given into the spinal fluid — which is why labels, syringes and connectors are designed to make them hard.

> [!warn] Injections are prescribed, prepared and given by trained professionals following the product information. Trouble breathing, swelling of the face or throat, a spreading rash or collapse soon after an injection can be anaphylaxis: call your local emergency number.
`,
  ideas: [
    'Parenteral routes bypass the gut and the first pass: intravenous gives 100 % bioavailability at once.',
    'From a muscle or the skin, absorption is roughly first order with a rate constant ka that depends on blood flow, molecular size and the formulation.',
    'Large proteins are absorbed from under the skin through the lymph, peaking days after the dose.',
    'When ka is much smaller than k, the curve\'s tail shows absorption, not elimination (flip-flop) — the basis of depot injections.',
    'The more direct the route, the stricter the product: intrathecal injections must be free of preservatives and irritants.'
  ],
  pitfalls: [
    'An intramuscular injection always acts faster than a subcutaneous one — Usually, for aqueous solutions, but an oily solution or suspension in a muscle can release over weeks; the formulation matters as much as the site.',
    'A long apparent half-life after a depot injection means the body removes the drug slowly — With flip-flop kinetics the terminal slope is the absorption rate; the same drug given intravenously would disappear quickly.',
    'Injections are sterile, so any route will do — Products are made and tested for their labelled routes; a preparation meant for a muscle can be dangerous in a vein or the spinal fluid.'
  ],
  formulas: [
    {
      name: 'Fraction absorbed from an injection site',
      expr: 'f = 1 - exp(-ka*t)', tex: 'f = 1 - e^{-k_a t}',
      vars: {
        f: { name: 'fraction of the dose absorbed', q: 'ratio', unit: '%' },
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/h', value: 0.35, tex: 'k_a' },
        t: { name: 'time since the injection', q: 'time', unit: 'h', value: 6 }
      },
      note: 'First-order absorption from a depot in muscle or under the skin; bioavailability losses at the site are ignored.',
      stories: {
        f: 'A hypothetical drug is absorbed from under the skin with k_a = {ka}. What fraction has been absorbed after {t}?',
        t: 'With k_a = {ka}, how long until {f} of the dose has been absorbed?',
        ka: 'Blood samples show that {f} of a subcutaneous dose has been absorbed after {t}. What is the absorption rate constant?'
      }
    },
    {
      name: 'Absorption half-life',
      expr: 'thalf = ln(2)/ka', tex: 't_{1/2,a} = \\dfrac{\\ln 2}{k_a}',
      vars: {
        thalf: { name: 'absorption half-life', q: 'time', unit: 'h', tex: 't_{1/2,a}' },
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/h', value: 0.35, tex: 'k_a' }
      },
      stories: { thalf: 'A depot is absorbed with k_a = {ka}. What is its absorption half-life?', ka: 'A long-acting injection has an absorption half-life of {thalf}. What is k_a?' }
    },
    {
      name: 'Time of the peak after an injection',
      expr: 'tmax = ln(ka/k)/(ka - k)', tex: 't_{max} = \\dfrac{\\ln(k_a/k)}{k_a - k}',
      vars: {
        tmax: { name: 'time of the peak concentration', q: 'time', unit: 'h', tex: 't_{max}' },
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/h', value: 2, min: 0.001, max: 100, tex: 'k_a' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.173, min: 0.001, max: 50 }
      },
      note: 'The Bateman function for first-order absorption into a one-compartment body. The formula is symmetric in k_a and k: the peak time alone cannot tell which process is the slow one (flip-flop).',
      practice: { unknowns: ['tmax'] },
      stories: { tmax: 'A hypothetical drug (k = {k}) is absorbed from a muscle with k_a = {ka}. When does its concentration peak?' }
    }
  ],
  examples: [
    {
      title: 'Muscle against skin',
      q: 'A hypothetical drug has an elimination half-life of 4 h. Injected into a muscle it is absorbed with $k_a = 2$ per hour; under the skin, with $k_a = 0.35$ per hour. When does each peak?',
      steps: [
        '$k = 0.693/4 = 0.173$ per hour.',
        'Intramuscular: $t_{max} = \\ln(2/0.173)/(2 - 0.173) = 2.446/1.827 = 1.34$ h.',
        'Subcutaneous: $t_{max} = \\ln(0.35/0.173)/(0.35 - 0.173) = 0.703/0.177 = 3.98$ h.',
        'The slower absorption also gives a lower, broader peak: the same dose is spread over more hours.'
      ],
      a: 'About 1.3 h after the intramuscular injection and 4 h after the subcutaneous one.'
    },
    {
      title: 'A depot that looks like a long half-life',
      q: 'A long-acting injection of the same drug releases it with $k_a = 0.005$ per hour. What half-life would you read from the tail of the blood-level curve?',
      steps: [
        'Here $k_a = 0.005$ per hour is far smaller than $k = 0.173$ per hour, so absorption limits everything.',
        'The tail falls at the slower rate: $t_{1/2} = 0.693/0.005 = 139$ h — about 5.8 days.',
        'The drug itself still leaves the blood with a 4-hour half-life; the depot simply feeds it in slowly. That is what lets one injection last weeks.'
      ],
      a: 'About 139 h (5.8 days) — the absorption half-life, not the elimination half-life.'
    }
  ],
  quiz: [
    { q: 'Which route has a bioavailability of 100 % by definition?', choices: ['intramuscular', 'subcutaneous', 'intravenous', 'intradermal'], a: 2, why: 'An intravenous dose is placed straight into the blood; every other route has an absorption step in which some drug can be lost or delayed.' },
    { q: 'A monoclonal antibody given under the skin usually peaks after…', choices: ['5 minutes', 'about an hour', '2–8 days', 'several months'], a: 2, why: 'At about 150 kDa it cannot enter blood capillaries and is carried away slowly through the lymph.' },
    { q: 'A drug absorbed with k_a = 0.5 per hour: what percentage of the dose has been absorbed after 4 h?', answer: 86.5, unit: '%', why: '1 − e^(−0.5 × 4) = 1 − e^(−2) = 0.865.' },
    { q: 'After a depot injection, the long terminal half-life shows that the patient eliminates the drug slowly.', a: false, why: 'With flip-flop kinetics the tail follows the slow absorption from the depot; the elimination can be fast.' },
    { q: 'Why must products for intrathecal injection be free of preservatives?', choices: ['preservatives would make them hypertonic', 'nerve tissue in the spinal fluid is easily damaged by them', 'they would react with the needle', 'the spinal fluid is already sterile, so they are wasted'], a: 1, why: 'Benzyl alcohol, phenol and similar agents that are tolerated in muscle can injure nerves when placed directly in the cerebrospinal fluid.' }
  ],
  problems: [
    { q: 'A drug with an elimination rate constant of 0.1 per hour is absorbed from a muscle with k_a = 1.5 per hour. At what time does the concentration peak?', answer: 1.93, unit: 'h', tol: 0.02, steps: ['$t_{max} = \\ln(1.5/0.1)/(1.5 - 0.1) = \\ln 15/1.4$.', '$= 2.708/1.4 = 1.93$ h.'] },
    { q: 'How long does it take for 95 % of a subcutaneous dose to be absorbed when k_a = 0.25 per hour?', answer: 12.0, unit: 'h', tol: 0.02, steps: ['$0.95 = 1 - e^{-0.25 t}$, so $e^{-0.25 t} = 0.05$.', '$t = \\ln 20/0.25 = 2.996/0.25 = 12.0$ h.'] }
  ],
  applications: ['Choosing a route in an emergency (intravenous, or intraosseous when no vein can be found) against a routine route for a chronic treatment (subcutaneous self-injection pens under medical supervision).', 'Long-acting depot injections of antipsychotics, hormones and contraceptives, given every one to three months.', 'Subcutaneous antibodies and biosimilars, where lymphatic absorption sets the dosing interval.', 'Regional anaesthesia and intrathecal chemotherapy, where the product must meet the strictest purity rules.'],
  history: 'In 1656 Christopher Wren injected substances into the veins of dogs with a quill and a bladder. The hollow needle and syringe were developed independently in 1853 by Alexander Wood in Edinburgh and Charles Pravaz in Lyon, and intravenous saline had already been tried against cholera by Thomas Latta in 1832 — long before anyone knew that infusions had to be sterile and pyrogen-free.',
  sim: 'ster-routes'
},

{
  id: 'sterilisation-methods', parent: 'sterile-topic', title: 'Sterilisation methods', level: 1,
  short: 'Sterilisation kills or removes every living microorganism: by saturated steam, dry heat, ionising radiation or gases, or by filtering a solution through a membrane with pores too small for bacteria. The product decides the method; heat in the final container is preferred.',
  keywords: ['sterilisation', 'autoclave', 'moist heat', 'saturated steam', 'dry heat', 'gamma irradiation', 'electron beam', 'ethylene oxide', 'hydrogen peroxide', 'sterile filtration', '0.22 µm', 'bubble point', 'integrity test', 'terminal sterilisation', 'spores'],
  prereq: ['medicine:microbes-types', 'biology:bacteria-archaea', 'gmp'],
  related: ['sterility-assurance', 'aseptic-processing', 'pyrogens-endotoxins', 'packaging', 'chemistry:clausius-clapeyron', 'physics:latent-heat', 'physics:radiation-dose', 'physics:surface-tension'],
  body: `
A product is **sterile** when it contains no living microorganisms — no bacteria, fungi or viruses capable of multiplying. Microbes differ enormously in how hard they are to kill. Vegetative bacteria die in seconds at 80 °C; bacterial **spores**, dormant capsules with dehydrated cores, survive boiling for hours and are the benchmark every heat and gas method is designed against. (Prions resist even standard autoclaving and need special treatment.)

### The methods
| Method | Typical conditions | Kills by | Used for | Limits |
|---|---|---|---|---|
| Saturated steam (autoclave) | 121 °C for 15 min; 134 °C for 3 min | condensing steam delivers latent heat, denatures proteins | aqueous solutions in sealed containers, stoppers, equipment | heat-sensitive drugs; cannot reach into oils or dry powders |
| Dry heat | 160 °C for 2 h, 180 °C for 30 min; 250 °C or more to depyrogenate | oxidation | glass, metal, oils, heat-stable powders | slow, very hot |
| Gamma, electron beam, X-ray | 25 kGy (the classic dose) | breaking DNA, directly and through radicals | single-use devices, packaging, some dry drugs | radiolysis of drugs in solution; discolours glass and some plastics |
| Ethylene oxide | 30–60 °C, humid, for hours, then aeration | alkylating proteins and DNA | heat-sensitive devices and plastics | toxic, carcinogenic residues; flammable |
| Vaporised hydrogen peroxide | room temperature | oxidation | surfaces of isolators and rooms | surfaces only, poor penetration |
| Filtration | 0.2–0.22 µm "sterilising-grade" membrane | removing, not killing | heat-sensitive solutions, proteins | does not remove viruses; must be followed by [[aseptic-processing|aseptic filling]] |

European guidance (the EMA's 2019 guideline on sterilisation, with its decision trees) and the pharmacopoeias ask for **terminal sterilisation** — in the final sealed container — whenever the product can stand it, because nothing can contaminate it afterwards. Only when heat would destroy the drug is the solution filtered and filled aseptically.

### Why steam works so well
Steam condensing on a cooler surface gives up its latent heat — about 2.2 kJ per gram at 121 °C — at once, and the moisture makes proteins unfold far more easily than dry air does. So moist heat at 121 °C does in 15 minutes what dry heat needs two hours at 160 °C to do. Two things are essential. **All air must be removed**, because an air pocket is colder than steam at the same pressure (vacuum pulses and the daily Bowie–Dick test check this). And the steam must be **saturated**: the temperature is tied to the pressure by the vapour-pressure curve, so 121 °C needs about 2.05 bar absolute (1 bar above the atmosphere) and 134 °C about 3 bar.

### Radiation and filtration
Radiation kills with the same log-linear survivor curve as heat, with a $D_{10}$ in kGy for the dose that kills 90 %. A dose of 25 kGy is enough for eight logs even of fairly resistant bioburden; ISO 11137 sets how the dose is chosen for each product. A **sterilising-grade filter** must retain $10^7$ cells per cm² of *Brevundimonas diminuta*, a small bacterium (about 0.3 × 0.8 µm), and its integrity is tested before and after use — most simply by the **bubble point**, the pressure at which air first pushes the water out of the largest pores. Link the killing to numbers in [[sterility-assurance]].

> [!key] Sterility is built in by a validated process, never inspected in. Steam in the final container is the first choice; filtration plus aseptic filling is the fallback for products that heat would destroy.
`,
  ideas: [
    'Bacterial spores are the benchmark for heat and gas sterilisation; vegetative bacteria die far more easily.',
    'Saturated steam at 121 °C for 15 min is the reference cycle: moist heat kills much faster than dry heat, but air must be removed first.',
    'Steam temperature is fixed by its pressure: about 2 bar absolute at 121 °C and 3 bar at 134 °C.',
    'Radiation (25 kGy) and ethylene oxide suit devices; filtration through 0.22 µm removes bacteria from heat-sensitive solutions.',
    'Terminal sterilisation in the sealed container is preferred; aseptic processing is used only when the product cannot take it.'
  ],
  pitfalls: [
    'Autoclaving also removes pyrogens — Endotoxins survive 121 °C easily; they are destroyed by dry heat at 250 °C or more, or kept out in the first place.',
    'A 0.22 µm filter makes anything sterile — It removes bacteria and fungi, not viruses, and only if the membrane is intact, which is why every filter is integrity tested.',
    'The hotter an autoclave, the drier the steam should be — Superheated (dry) steam behaves like hot air and kills far more slowly; the steam must be saturated, at the temperature its pressure dictates.'
  ],
  formulas: [
    {
      name: 'Steam pressure at the sterilising temperature (Clausius–Clapeyron)',
      expr: 'p2 = p1*exp(Hv/R*(1/T1 - 1/T2))', tex: 'p_2 = p_1 \\exp\\!\\left[\\dfrac{\\Delta H_v}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)\\right]',
      vars: {
        p2: { name: 'saturated steam pressure (absolute)', q: 'pressure', unit: 'kPa', tex: 'p_2' },
        p1: { name: 'pressure at the known point (absolute)', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_1' },
        Hv: { name: 'enthalpy of vaporisation of water', q: 'molarenergy', unit: 'kJ/mol', value: 40.7, tex: '\\Delta H_v' },
        R: { const: 'R' },
        T1: { name: 'temperature at the known point', q: 'temperature', unit: '°C', value: 100, tex: 'T_1' },
        T2: { name: 'sterilising temperature', q: 'temperature', unit: '°C', value: 121, tex: 'T_2' }
      },
      note: 'Taking ΔHv as constant gives the steam-table value within about 1 % between 100 and 140 °C (121 °C: 205 kPa; 134 °C: 304 kPa). Gauges on autoclaves usually read gauge pressure: subtract about 101 kPa.',
      practice: { unknowns: ['p2', 'T2'] },
      stories: {
        p2: 'Water boils at {T1} under {p1}. What absolute pressure does saturated steam need to reach {T2}?',
        T2: 'An autoclave holds saturated steam at {p2} absolute. What is its temperature?'
      }
    },
    {
      name: 'Survivors after a radiation dose',
      expr: 'N = N0*10^(-Dose/D10)', tex: 'N = N_0 \\cdot 10^{-D/D_{10}}',
      vars: {
        N: { name: 'expected survivors per item', q: false, unit: 'CFU' },
        N0: { name: 'bioburden per item before irradiation', q: false, unit: 'CFU', value: 100, tex: 'N_0' },
        Dose: { name: 'absorbed dose', q: false, unit: 'kGy', value: 25, tex: 'D' },
        D10: { name: 'dose that kills 90 % (D₁₀)', q: false, unit: 'kGy', value: 3, tex: 'D_{10}' }
      },
      note: 'A fractional result is a probability: 10⁻⁶ survivors per item means one non-sterile item in a million.',
      stories: {
        N: 'A device carries {N0} of bioburden with D₁₀ = {D10}. How many survivors per item are expected after {Dose}?',
        Dose: 'Items carry {N0} with D₁₀ = {D10}. What dose leaves {N} survivors per item?'
      }
    },
    {
      name: 'Bubble point of a wetted membrane',
      expr: 'P = 4*k*gamma*cos(theta)/d', tex: 'P = \\dfrac{4k\\,\\gamma\\cos\\theta}{d}',
      vars: {
        P: { name: 'bubble-point pressure', q: 'pressure', unit: 'bar' },
        k: { name: 'pore shape correction (empirical)', value: 0.26 },
        gamma: { name: 'surface tension of the wetting liquid', q: 'surfacetension', unit: 'mN/m', value: 72 },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 0, min: 0, max: 89 },
        d: { name: 'diameter of the largest pore', q: 'length', unit: 'µm', value: 0.22 }
      },
      note: 'The Young–Laplace pressure needed to push liquid out of a capillary, with an empirical factor for real, tortuous pores (fitted for each membrane type). Manufacturers state a minimum bubble point for each filter and wetting liquid; a lower value reveals a defect.',
      practice: { unknowns: ['P', 'd'] },
      stories: {
        P: 'A membrane is wetted with water (γ = {gamma}, θ = {theta}) and its largest pores are {d} across (k = {k}). At what pressure does air break through?',
        d: 'A water-wetted filter (k = {k}) shows its bubble point at {P}. How wide is its largest pore?'
      }
    }
  ],
  examples: [
    {
      title: 'Why an autoclave is a pressure vessel',
      q: 'Water boils at 100 °C at 101.3 kPa. With $\\Delta H_v = 40.7$ kJ/mol, what absolute pressure does saturated steam need at 121 °C?',
      steps: [
        '$1/373.15 - 1/394.15 = 1.428\\times10^{-4}$ per kelvin.',
        '$\\Delta H_v/R = 40\\,700/8.314 = 4895$ K, so the exponent is $4895 \\times 1.428\\times10^{-4} = 0.699$.',
        '$p_2 = 101.3 \\times e^{0.699} = 101.3 \\times 2.01 = 204$ kPa absolute — about 1 bar above the atmosphere (steam tables: 205 kPa).'
      ],
      a: 'About 2.0 bar absolute, or 1 bar gauge: an autoclave at 121 °C is a pressure vessel.'
    },
    {
      title: 'Why 25 kGy?',
      q: 'Single-use syringes carry up to 100 microorganisms each, and the most resistant have $D_{10} = 3$ kGy. What dose gives one non-sterile item in a million?',
      steps: [
        'From 100 to $10^{-6}$ is $\\log_{10}(100/10^{-6}) = 8$ logs.',
        '$8 \\times 3 = 24$ kGy.',
        'The traditional 25 kGy therefore covers eight logs even of resistant bioburden; ISO 11137 lets a lower dose be validated when the bioburden is low and sensitive.'
      ],
      a: '24 kGy — just under the classic 25 kGy.'
    },
    {
      title: 'A filter with a defect',
      q: 'A water-wetted 0.22 µm filter should show its bubble point near 3.4 bar ($k = 0.26$, $\\gamma = 72$ mN/m). What would a 2 µm pinhole do?',
      steps: [
        'Intact: $P = 4 \\times 0.26 \\times 0.072/(0.22\\times10^{-6}) = 3.40\\times10^5$ Pa = 3.4 bar.',
        'With a 2 µm hole: $P = 4 \\times 0.26 \\times 0.072/(2\\times10^{-6}) = 0.37$ bar.',
        'Air would break through at a tenth of the expected pressure — the test fails and the batch filtered through it is investigated.'
      ],
      a: 'The bubble point would fall from about 3.4 bar to 0.37 bar.'
    }
  ],
  quiz: [
    { q: 'Why must the air be removed from an autoclave before sterilising?', choices: ['air contains bacteria', 'an air pocket is cooler than saturated steam at the same pressure, so items inside it are under-treated', 'air makes the steam superheated and too hot', 'air corrodes the chamber'], a: 1, why: 'In a mixture the steam supplies only its partial pressure, so the temperature where air lingers is lower — and air insulates surfaces from condensing steam.' },
    { q: 'Which method suits a heat-sensitive protein solution?', choices: ['autoclaving at 121 °C', 'dry heat at 160 °C', 'filtration through 0.22 µm and aseptic filling', 'ethylene oxide gas'], a: 2, why: 'Heat would denature the protein and a gas cannot sterilise a liquid; filtration removes the bacteria, and aseptic filling keeps them out.' },
    { q: 'Autoclaving a solution at 121 °C for 15 minutes destroys bacterial endotoxins.', a: false, why: 'Endotoxins are heat-stable; depyrogenation needs dry heat at about 250 °C or more.' },
    { q: 'By Clausius–Clapeyron with ΔHv = 40.7 kJ/mol, roughly what absolute pressure (kPa) does saturated steam have at 134 °C?', answer: 303, unit: 'kPa', why: '101.3 × exp[4895 × (1/373.15 − 1/407.15)] = 101.3 × e^1.095 = 303 kPa (steam tables: 304 kPa).' },
    { q: 'Which organisms set the standard that heat sterilisation must beat?', choices: ['vegetative bacteria such as E. coli', 'moulds', 'bacterial spores', 'enveloped viruses'], a: 2, why: 'Spores are the most heat-resistant ordinary microorganisms; a cycle that kills them kills the rest.' }
  ],
  problems: [
    { q: 'A membrane wetted with 60 % isopropanol (γ = 23 mN/m, θ = 0, k = 0.26) has its largest pores 0.22 µm across. What is its bubble point in bar?', answer: 1.09, unit: 'bar', tol: 0.03, steps: ['$P = 4 \\times 0.26 \\times 0.023/(0.22\\times10^{-6})$.', '$= 1.09\\times10^5$ Pa = 1.09 bar — lower than with water, because the surface tension is lower.'] },
    { q: 'Devices carry 1000 microorganisms each with D₁₀ = 2 kGy. What dose gives an SAL of 10⁻⁶?', answer: 18, unit: 'kGy', tol: 0.02, steps: ['$\\log_{10}(1000/10^{-6}) = 9$ logs.', '$9 \\times 2 = 18$ kGy.'] }
  ],
  applications: ['Choosing a method for a new product with the European decision trees: steam first, then other terminal methods, then filtration and aseptic processing.', 'Hospital sterile services reprocessing surgical instruments at 134 °C.', 'Radiation sterilisation of syringes, catheters, dressings and packaging components by the million.', 'Filtering heat-sensitive solutions such as vaccines, antibodies and ophthalmic preparations, with integrity tests before and after.'],
  history: 'Charles Chamberland, working with Louis Pasteur, built the first pressure steam steriliser in 1879 and the first porcelain filter that held back bacteria in 1884. Ethylene oxide sterilisation was patented in the 1930s, and industrial radiation sterilisation of medical devices began in the 1950s.',
  sim: 'ster-filter'
},

{
  id: 'sterility-assurance', parent: 'sterile-topic', title: 'D-value, z-value and F₀', level: 2,
  short: 'Heat kills microbes by first-order kinetics: each D minutes kill 90 % of those left. The z-value says how much hotter makes it ten times faster, F₀ adds up a whole cycle as minutes at 121.1 °C, and the result is a sterility assurance level — the chance that one item keeps a survivor, usually one in a million.',
  keywords: ['D-value', 'decimal reduction time', 'z-value', 'F0', 'lethality', 'lethal rate', 'sterility assurance level', 'SAL', 'overkill', 'biological indicator', 'spore strip', 'Geobacillus stearothermophilus', 'bioburden', 'sterility test', 'parametric release'],
  prereq: ['sterilisation-methods', 'math:exponential-growth-decay', 'math:logarithms', 'chemistry:arrhenius-equation'],
  related: ['aseptic-processing', 'shelf-life', 'quality-control', 'biology:bacterial-growth', 'math:binomial-distribution', 'math:poisson-distribution', 'math:logarithmic-scales'],
  body: `
Heat does not kill a population of bacteria all at once. At a fixed lethal temperature each minute kills the same *fraction* of those still alive, so the number of survivors falls exponentially and plots as a straight line on a logarithmic scale — the **survivor curve**:

$$N = N_0 \\cdot 10^{-t/D}$$

The **D-value** is the time that kills 90 % — one log. Spores of *Geobacillus stearothermophilus*, the usual test organism for steam, have $D_{121}$ of about 1.5–3 minutes; spores of *Clostridium botulinum*, the food industry's target, about 0.2 minutes; ordinary vegetative bacteria a small fraction of a second.

### Temperature: the z-value
The D-value shortens steeply as the temperature rises. The **z-value** is the rise that cuts D tenfold; for spores in moist heat it is close to 10 °C:

$$D_T = D_{121.1}\\cdot 10^{(121.1 - T)/z}$$

That is far steeper than the chemistry of the drug. A z-value of 10 °C corresponds to an Arrhenius activation energy of about 300 kJ/mol, against 50–100 kJ/mol for most degradation reactions (see [[shelf-life]]). So a short, hot cycle kills many more spores for the same damage to the drug — the principle of high-temperature, short-time sterilisation.

### F₀: adding up a cycle
Real cycles heat up and cool down, and the load lags behind the chamber. Each minute at temperature $T$ counts as $L = 10^{(T - 121.1)/10}$ minutes at 121.1 °C — the **lethal rate** — and the **F₀** value is the sum of them over the whole cycle, in equivalent minutes:

| Temperature | 110 °C | 115 °C | 118 °C | 121.1 °C | 124 °C | 126 °C | 130 °C | 134 °C |
|---|---|---|---|---|---|---|---|---|
| Lethal rate $L$ | 0.078 | 0.25 | 0.49 | 1 | 1.95 | 3.1 | 7.8 | 19.5 |

The log reduction of a cycle is $F_0/D_{121}$. The reference cycle, 15 minutes at 121 °C, gives $F_0 \\approx 15$ min — ten logs of spores with $D_{121} = 1.5$ min. Try your own cycles in [the F₀ calculator](#/tools/pharmcalc/sterile).

### Sterility assurance level
Because the survivor curve never reaches zero, sterility is a probability. The **sterility assurance level** (SAL) is the expected number of survivors per item at the end — the chance that an item is not sterile. For terminally sterilised medicines the target is **10⁻⁶** or better. Two strategies reach it:

- **Overkill**: at least 12 logs of a resistant organism with $D_{121} = 1$ min, $F_0 \\ge 12$ min, whatever the bioburden — for products that can take the heat.
- **Bioburden-based**: count and characterise the microbes actually present, and give just enough heat — for heat-sensitive products, with F₀ often down to about 8 min, accepted by European guidance when bioburden is tightly controlled.

A **biological indicator** — a strip or ampoule with about 10⁶ spores — is put in the hardest-to-heat place during validation. If $N$ survivors are expected, the chance that at least one grows is $1 - e^{-N}$ (Poisson).

### Why a sterility test cannot prove sterility
The pharmacopoeial sterility test (Ph. Eur. 2.6.1, USP <71>) incubates about 20 units per batch for 14 days. If a fraction $p$ of the batch is contaminated, the chance of catching it is $1 - (1-p)^{n}$: for one unit in a thousand and $n = 20$ that is 2 %. A test cannot find one unit in a million, so the SAL is **designed in** by a validated cycle, and many sites release steam-sterilised products on the recorded temperature, pressure and time alone (**parametric release**).

> [!key] One D kills one log; one z speeds it tenfold; F₀ counts a cycle in minutes at 121.1 °C; the SAL is what is left — at most one survivor per million items.
`,
  ideas: [
    'Heat kills microbes by first-order kinetics: survivors fall one log every D minutes.',
    'The z-value is the temperature rise that divides D by ten — about 10 °C for spores in steam.',
    'F₀ converts any cycle into equivalent minutes at 121.1 °C; log reduction = F₀/D₁₂₁.',
    'The sterility assurance level is the probability of a surviving microbe per item; the usual target is 10⁻⁶.',
    'A sterility test on 20 units cannot detect rare contamination, so sterility is designed in and proven by validation.'
  ],
  pitfalls: [
    'After enough heating the number of survivors becomes exactly zero — The survivor curve falls exponentially forever; what reaches a tiny number is the probability that an item still carries one survivor.',
    'Five minutes at 131 °C is the same as fifteen minutes at 121 °C — With z = 10 °C each minute at 131.1 °C is worth ten at 121.1 °C, so five minutes gives F₀ ≈ 50 min, over three times the reference cycle.',
    'A batch that passes the sterility test is proven sterile — Twenty samples detect contamination only when it is common; a pass says little about one unit in ten thousand.'
  ],
  formulas: [
    {
      name: 'Survivor curve',
      expr: 'N = N0*10^(-t/D)', tex: 'N = N_0 \\cdot 10^{-t/D}',
      vars: {
        N: { name: 'expected survivors per item' },
        N0: { name: 'initial number per item (bioburden)', value: 1e6, tex: 'N_0' },
        t: { name: 'time at the lethal temperature (or F₀)', q: 'time', unit: 'min', value: 15 },
        D: { name: 'D-value at that temperature', q: 'time', unit: 'min', value: 1.5 }
      },
      note: 'With t = F₀ and D = D₁₂₁ this gives the survivors after a whole cycle; below 1 the result is the probability that an item is not sterile (the SAL).',
      practice: { unknowns: ['N', 't', 'D'] },
      stories: {
        N: 'A spore strip carries {N0} spores with D = {D}. How many survivors are expected after {t} at that temperature?',
        t: 'A load carries {N0} per item with D₁₂₁ = {D}. What F₀ brings the expected survivors down to {N}?',
        D: 'Heating a population of {N0} spores for {t} leaves {N}. What is the D-value?'
      }
    },
    {
      name: 'D-value at another temperature (z-value)',
      expr: 'DT = Dref*10^((Tref - T)/z)', tex: 'D_T = D_{ref}\\cdot 10^{(T_{ref} - T)/z}',
      vars: {
        DT: { name: 'D-value at temperature T', q: 'time', unit: 'min', tex: 'D_T' },
        Dref: { name: 'D-value at the reference temperature', q: 'time', unit: 'min', value: 1.5, tex: 'D_{ref}' },
        Tref: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 121.1, fixed: true, tex: 'T_{ref}' },
        T: { name: 'actual temperature', q: 'temperature', unit: '°C', value: 115 },
        z: { name: 'z-value', q: 'dtemp', unit: '°C', value: 10 }
      },
      practice: { unknowns: ['DT', 'z'] },
      stories: {
        DT: 'Spores have D = {Dref} at {Tref} and z = {z}. What is their D-value at {T}?',
        z: 'Spores have D = {Dref} at {Tref} and D = {DT} at {T}. What is their z-value?'
      }
    },
    {
      name: 'F₀ of a hold at constant temperature',
      expr: 'F0 = t*10^((T - Tref)/z)', tex: 'F_0 = t\\cdot 10^{(T - T_{ref})/z}',
      vars: {
        F0: { name: 'F₀ (equivalent minutes at 121.1 °C)', q: 'time', unit: 'min', tex: 'F_0' },
        t: { name: 'time held', q: 'time', unit: 'min', value: 15 },
        T: { name: 'temperature of the load', q: 'temperature', unit: '°C', value: 118 },
        Tref: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 121.1, fixed: true, tex: 'T_{ref}' },
        z: { name: 'z-value', q: 'dtemp', unit: '°C', value: 10 }
      },
      note: 'F₀ is defined with z = 10 °C; for a whole cycle the lethal rates are summed minute by minute, heating and cooling included.',
      practice: { unknowns: ['F0', 't', 'T'] },
      stories: {
        F0: 'The coldest vial in a load sits at {T} for {t}. What F₀ does it receive?',
        t: 'The load reaches only {T}. How long must it be held to receive F₀ = {F0}?',
        T: 'A cycle must deliver F₀ = {F0} in a hold of {t}. What temperature must the load reach?'
      }
    },
    {
      name: 'Chance that a sterility test detects contamination',
      expr: 'Pd = 1 - (1 - p)^n', tex: 'P_{det} = 1 - (1 - p)^{n}',
      vars: {
        Pd: { name: 'probability of at least one positive unit', q: 'ratio', unit: '%', tex: 'P_{det}' },
        p: { name: 'fraction of the batch contaminated', q: 'ratio', unit: '%', value: 0.1 },
        n: { name: 'units tested', int: true, value: 20 }
      },
      note: 'Assumes random sampling and that every contaminated unit grows in the test.',
      practice: { unknowns: ['Pd', 'n'] },
      stories: {
        Pd: 'A batch has {p} of its units contaminated and {n} are tested. What is the chance of finding at least one?',
        n: 'How many units must be tested to have a {Pd} chance of catching contamination in {p} of a batch?'
      }
    }
  ],
  examples: [
    {
      title: 'F₀ of a cycle with its heating and cooling',
      q: 'The coldest vial in a load spends 5 minutes at about 115 °C while heating, 15 minutes at 121.1 °C and 5 minutes at about 115 °C while cooling. What is its F₀, and what log reduction does it give spores with $D_{121} = 1.5$ min?',
      steps: [
        'Lethal rate at 115 °C: $10^{(115 - 121.1)/10} = 10^{-0.61} = 0.245$.',
        '$F_0 = 5 \\times 0.245 + 15 \\times 1 + 5 \\times 0.245 = 17.5$ min.',
        'Log reduction $= 17.5/1.5 = 11.7$: a strip of $10^6$ spores is left with $10^{-5.7} = 2\\times10^{-6}$ expected survivors.'
      ],
      a: 'F₀ ≈ 17.5 min: 11.7 logs of the test spores.'
    },
    {
      title: 'Hot and short against long and cooler',
      q: 'Compare 3 minutes at 134 °C with 15 minutes at 121.1 °C, for spores (z = 10 °C) and for a drug that degrades with $E_a = 80$ kJ/mol.',
      steps: [
        'Spores: $F_0 = 3 \\times 10^{(134 - 121.1)/10} = 3 \\times 19.5 = 58$ min, nearly four times the reference 15.',
        'Drug: the rate at 134 °C is $\\exp[80\\,000/8.314 \\times (1/394.25 - 1/407.15)] = e^{0.773} = 2.2$ times that at 121.1 °C, so 3 minutes do as much damage as $3 \\times 2.2 = 6.5$ minutes at 121.1 °C.',
        'The short hot cycle gives about four times the lethality with less than half the degradation — because spores have a far higher activation energy than the drug\'s chemistry.'
      ],
      a: 'F₀ ≈ 58 min against 15, with less than half the chemical damage.'
    },
    {
      title: 'What the sterility test can see',
      q: 'A batch has one contaminated unit in a thousand. What is the chance that a sterility test on 20 units finds it? And if one in ten were contaminated?',
      steps: [
        '$1 - (1 - 0.001)^{20} = 1 - 0.980 = 2.0$ %.',
        '$1 - (1 - 0.1)^{20} = 1 - 0.122 = 88$ %.',
        'Even gross contamination can be missed, and contamination at the 10⁻⁶ level is invisible to any practical test.'
      ],
      a: 'About 2 % for one in a thousand; 88 % for one in ten.'
    }
  ],
  quiz: [
    { q: 'The D-value is the time needed at a stated temperature to…', choices: ['kill all the microorganisms', 'kill 50 % of them', 'kill 90 % of them', 'reach the sterilising temperature'], a: 2, why: 'D is the decimal reduction time: one log, from 100 % to 10 % surviving.' },
    { q: 'With z = 10 °C, sterilising at 111 °C instead of 121 °C needs about… as long.', choices: ['the same time', 'twice', 'ten times', 'a hundred times'], a: 2, why: 'Each 10 °C lower multiplies D by 10 — the same lethality takes ten times longer.' },
    { q: 'What F₀ (min) does a load receive in 10 minutes at 124 °C (z = 10 °C)?', answer: 19.5, unit: 'min', why: '10 × 10^((124 − 121.1)/10) = 10 × 10^0.29 = 19.5 min.' },
    { q: 'A batch that passes the pharmacopoeial sterility test on 20 units has been shown to be sterile.', a: false, why: 'Twenty units catch contamination only when it is common: at one unit in a thousand, 98 % of tests pass anyway.' },
    { q: 'A spore strip with 10⁶ spores of D₁₂₁ = 1.5 min receives F₀ = 15 min. The chance that it shows growth is about…', choices: ['0.01 %', '1 %', '10 %', '63 %'], a: 0, why: '10 logs leave 10⁻⁴ expected survivors; the probability of at least one is 1 − e^(−0.0001) ≈ 0.01 %.' }
  ],
  problems: [
    { q: 'A biological indicator carries 10⁶ spores with D₁₂₁ = 2.0 min. What F₀ is needed for its chance of growth to be at most 1 %?', answer: 16.0, unit: 'min', tol: 0.02, hint: 'Growth probability = 1 − e^(−N); find N first.', steps: ['$1 - e^{-N} \\le 0.01$ gives $N \\le -\\ln 0.99 = 0.01005$.', 'Log reduction $= \\log_{10}(10^6/0.01005) = 8.00$.', '$F_0 = 8.00 \\times 2.0 = 16.0$ min.'] },
    { q: 'Spores have D₁₂₁ = 2 min and z = 10 °C. What is their D-value at 115 °C?', answer: 8.15, unit: 'min', tol: 0.02, steps: ['$D_{115} = 2 \\times 10^{(121.1 - 115)/10} = 2 \\times 10^{0.61}$.', '$= 2 \\times 4.07 = 8.15$ min.'] }
  ],
  applications: ['Validating steam cycles with thermocouples in the coldest spots and biological indicators, and setting F₀ for each load pattern.', 'Parametric release of terminally sterilised infusions on their cycle records, without waiting for a sterility test.', 'Designing gentler, bioburden-based cycles for heat-sensitive products such as some emulsions and prefilled syringes.', 'The food industry\'s canning "botulinum cook", F₀ of about 3 min, and its larger margins for spoilage organisms.'],
  history: 'The D- and z-values come from canning: in 1920–1923 W. D. Bigelow, C. O. Ball and colleagues worked out how to calculate the heat needed to make canned food safe from Clostridium botulinum, and the 12-D "botulinum cook" became the industry\'s standard. Pharmaceutical sterilisation adopted the same arithmetic, with F₀ referred to 121.1 °C (250 °F).',
  sim: 'ster-survivor'
},

{
  id: 'aseptic-processing', parent: 'sterile-topic', title: 'Aseptic processing and cleanrooms', level: 2,
  short: 'When a product cannot be sterilised in its final container, its sterile parts are put together in air cleaner than an operating theatre: cleanrooms graded A to D by particle and microbe counts, unidirectional airflow, barriers between people and product, and media fills that prove the process.',
  keywords: ['aseptic processing', 'cleanroom', 'Annex 1', 'grade A', 'grade B', 'ISO 14644', 'ISO class', 'HEPA', 'unidirectional airflow', 'laminar flow', 'air changes', 'isolator', 'RABS', 'media fill', 'aseptic process simulation', 'environmental monitoring', 'contamination control strategy'],
  prereq: ['sterilisation-methods', 'sterility-assurance', 'gmp'],
  related: ['injectable-formulation', 'lyophilisation', 'ophthalmic', 'quality-control', 'biologics-formulation', 'medicine:infection-spread', 'math:exponential-models', 'math:binomial-distribution'],
  body: `
Proteins, vaccines, many liposomes and emulsions, and some small molecules cannot survive steam in their final container. Instead each part is sterilised on its own — the solution by filtration, glass vials by dry heat, stoppers by steam or radiation — and the parts are assembled where nothing can get in: **aseptic processing**. Its weak point is the assembly itself, and above all the people doing it: a person sheds millions of skin cells a day, some of them carrying bacteria. An aseptically filled product cannot be given an SAL by calculation, as a terminally sterilised one can ([[sterility-assurance]]); its assurance comes from design, monitoring and simulation.

### Grades of clean air
The EU GMP guide's Annex 1 (revised in 2022, in force since August 2023) grades cleanrooms by the particles of 0.5 µm and larger per cubic metre, and by microbes:

| Grade | Used for | ≥ 0.5 µm per m³ at rest | in operation | ISO class (rest / operation) | Air, CFU per m³ |
|---|---|---|---|---|---|
| A | the critical zone: open vials, filling, stoppering | 3 520 | 3 520 | 5 / 5 | no growth |
| B | background room around a grade A zone | 3 520 | 352 000 | 5 / 7 | 10 |
| C | preparing solutions to be filtered | 352 000 | 3 520 000 | 7 / 8 | 100 |
| D | handling components, less critical steps | 3 520 000 | set by the site | 8 / — | 200 |

For comparison, city air holds tens of millions of such particles per cubic metre (about ISO 9). The ISO 14644-1 classes follow one formula, $C_n = 10^N (0.1/D)^{2.08}$ particles per m³ for particles of size $D$ µm and larger: ISO 5 allows 3 520 at 0.5 µm, and each class up allows ten times more.

### How the air is kept clean
- **HEPA filters** (grade H14 retains at least 99.995 % of the most penetrating particle size) supply the air.
- **Grade A** has **unidirectional airflow** — a gentle, uniform downward stream at about 0.36–0.54 m/s that sweeps particles away from open containers before they settle.
- **Grades B to D** are ventilated by mixing, typically 20–60 air changes per hour, and must recover to their at-rest limits within about 15–20 minutes after work stops.
- **Pressure cascades** of at least 10 Pa between grades make air flow from clean to less clean, through airlocks.
- **Barriers**: restricted access barrier systems (RABS) and **isolators**, sealed and decontaminated with vaporised hydrogen peroxide, keep operators' bodies out of grade A altogether; the 2022 Annex 1 strongly encourages them.

In a well-mixed room the count settles where the particles people release balance those the air removes, $C = G/Q$: doubling the air changes halves it, and more people or brisker movement raise it. A person sitting still releases roughly $10^5$ particles (≥ 0.5 µm) a minute and a person walking several million — orders of magnitude that depend strongly on the clothing, which is why cleanroom garments, gowning training and slow, deliberate movement matter as much as the ventilation.

### Proving the process: media fills
In an **aseptic process simulation** the product is replaced by a sterile growth medium (soybean–casein digest broth) and the whole process is run, including worst-case interventions, for thousands of units. They are incubated for 14 days and inspected; the target is **zero** contaminated units, and any growth is investigated. With zero positives in $n$ units the contamination rate is, with 95 % confidence, below about $3/n$ — about 1 in 1 700 for 5 000 units. **Environmental monitoring** (continuous particle counting in grade A, air samplers, settle plates, contact plates, glove prints) watches every batch, all within a site's written **contamination control strategy**.

> [!key] Aseptic processing keeps sterile things sterile rather than making them sterile. People are the main source of contamination; clean air, barriers, disciplined behaviour and media fills are the defences.
`,
  ideas: [
    'Aseptic processing assembles separately sterilised parts in clean air; it is used when a product cannot be sterilised in its final container.',
    'EU GMP Annex 1 grades A–D set particle and microbe limits at rest and in operation; grade A equals ISO 5 (3 520 particles ≥ 0.5 µm per m³).',
    'Grade A has unidirectional airflow; the surrounding rooms are diluted by HEPA-filtered air with pressure cascades between grades.',
    'People are the main source of particles and microbes: isolators and RABS keep them out of the critical zone.',
    'Media fills prove the process: zero contaminated units in n gives an upper 95 % bound of about 3/n.'
  ],
  pitfalls: [
    'A cleanroom full of HEPA filters is sterile — The air is filtered, but people, surfaces and materials bring microbes in continuously; the grade limits are counts, not zero.',
    'A particle count below the limit proves the product is safe — Particles are an indirect measure; microbes are monitored separately, and an intervention can contaminate a vial without changing the room count.',
    'If a media fill of 5 000 units shows no growth, the contamination rate is zero — It shows, with 95 % confidence, only that the rate is below about 3 in 5 000; the fill must be repeated regularly and for every line and shift pattern.'
  ],
  formulas: [
    {
      name: 'ISO 14644-1 class limit',
      expr: 'Cn = 10^N*(0.1/D)^2.08', tex: 'C_n = 10^{N}\\left(\\dfrac{0.1}{D}\\right)^{2.08}',
      vars: {
        Cn: { name: 'maximum particles of size D and larger', q: false, unit: 'particles/m³', tex: 'C_n' },
        N: { name: 'ISO class number', value: 5, min: 1, max: 9 },
        D: { name: 'particle size considered', q: false, unit: 'µm', value: 0.5 }
      },
      note: 'D is in micrometres. The standard rounds the limits: ISO 5 is 3 520 per m³ at 0.5 µm, ISO 7 is 352 000, ISO 8 is 3 520 000.',
      practice: { unknowns: ['Cn', 'N'] },
      stories: {
        Cn: 'What is the ISO class {N} limit for particles of {D} and larger?',
        N: 'A room holds {Cn} of particles of {D} and larger. What ISO class number does that correspond to?'
      }
    },
    {
      name: 'Particle count in a well-mixed room',
      expr: 'C = 60*G/(n*V)', tex: 'C = \\dfrac{60\\,G}{n V}',
      vars: {
        C: { name: 'steady particle concentration', q: false, unit: 'particles/m³' },
        G: { name: 'particles released by people and processes', q: false, unit: 'particles/min', value: 1e6 },
        n: { name: 'air changes per hour', q: false, unit: '1/h', value: 40 },
        V: { name: 'room volume', q: false, unit: 'm³', value: 60 }
      },
      note: 'Assumes the supply air is clean (HEPA-filtered) and perfectly mixed with the room air; 60 converts air changes per hour to per minute.',
      stories: {
        C: 'Operators in a {V} room release {G}; the room has {n} air changes. What particle count settles?',
        n: 'A {V} room with {G} of particle release must stay below {C}. How many air changes per hour are needed?'
      }
    },
    {
      name: 'Clean-up (recovery) time',
      expr: 't = 60*ln(C0/C)/n', tex: 't = \\dfrac{60\\,\\ln(C_0/C)}{n}',
      vars: {
        t: { name: 'time to fall from C₀ to C', q: false, unit: 'min' },
        C0: { name: 'count when work stops', q: false, unit: 'particles/m³', value: 352000, tex: 'C_0' },
        C: { name: 'target count', q: false, unit: 'particles/m³', value: 3520 },
        n: { name: 'air changes per hour', q: false, unit: '1/h', value: 40 }
      },
      note: 'Exponential dilution in a well-mixed room with clean supply air. Annex 1 gives 15–20 min as a guidance value for recovery to the at-rest limits.',
      stories: {
        t: 'At {n}, how long does a room take to fall from {C0} to {C} once people leave?',
        n: 'A room must fall from {C0} to {C} within {t}. How many air changes per hour does it need?'
      }
    },
    {
      name: 'Upper bound after a media fill with no positives',
      expr: 'p = 1 - alpha^(1/n)', tex: 'p_{max} = 1 - \\alpha^{1/n}',
      vars: {
        p: { name: 'highest contamination rate consistent with the result', q: 'ratio', unit: '%', tex: 'p_{max}' },
        alpha: { name: '1 − confidence', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50, tex: '\\alpha' },
        n: { name: 'units filled, none contaminated', int: true, value: 5000 }
      },
      note: 'For 95 % confidence and large n this is the "rule of three": p ≈ 3/n.',
      practice: { unknowns: ['p', 'n'] },
      stories: {
        p: 'A media fill of {n} shows no growth. What is the upper confidence bound on the contamination rate at α = {alpha}?',
        n: 'How many units must a media fill have, with none contaminated, to show that the rate is below {p} (α = {alpha})?'
      }
    }
  ],
  examples: [
    {
      title: 'Classifying a room',
      q: 'A particle counter in a filling room in operation reads 12 000 particles ≥ 0.5 µm per m³. What ISO class is that, and which grade could the room be?',
      steps: [
        '$12\\,000 = 10^N (0.1/0.5)^{2.08}$, and $(0.2)^{2.08} = 0.0352$.',
        '$10^N = 12\\,000/0.0352 = 3.41\\times10^5$, so $N = 5.53$ — ISO class 5.6 (classes are quoted to one decimal and rounded up).',
        'That is over the grade A limit (3 520) but far inside grade B in operation (352 000).'
      ],
      a: 'ISO 5.6 — acceptable as a grade B room in operation, not as grade A.'
    },
    {
      title: 'Operators and air changes',
      q: 'Three gowned operators, each releasing about $5\\times10^5$ particles a minute, work in an 80 m³ room with 30 air changes an hour. What count settles, and how long after they leave does the room reach 3 520 per m³?',
      steps: [
        '$G = 1.5\\times10^6$ per minute; $C = 60 \\times 1.5\\times10^6/(30 \\times 80) = 37\\,500$ per m³.',
        'Recovery: $t = 60 \\times \\ln(37\\,500/3520)/30 = 60 \\times 2.37/30 = 4.7$ min.',
        'Doubling the air changes would halve both the count and the recovery time — at the price of larger fans and more conditioned air.'
      ],
      a: 'About 37 500 particles per m³ (grade B in operation); back to 3 520 in under 5 minutes.'
    },
    {
      title: 'What a media fill proves',
      q: 'A media fill of 8 000 units shows no contaminated unit. What contamination rate can be ruled out with 95 % confidence?',
      steps: [
        '$p_{max} = 1 - 0.05^{1/8000} = 1 - e^{-2.996/8000} = 3.74\\times10^{-4}$.',
        'That is 0.037 %, about 1 in 2 700 — close to the rule of three, $3/8000$.',
        'Much rarer contamination cannot be excluded by any practical fill, which is why barriers and monitoring matter as much as the simulation.'
      ],
      a: 'Rates above about 0.037 % (1 in 2 700) are ruled out.'
    }
  ],
  quiz: [
    { q: 'What is the main source of microbial contamination in a well-run cleanroom?', choices: ['the HEPA filters', 'the people working in it', 'the product solution', 'the walls'], a: 1, why: 'People shed skin cells and particles continuously; that is why barriers, gowning and slow movement matter so much.' },
    { q: 'Grade A air corresponds to which ISO 14644-1 class for particles of 0.5 µm and larger?', choices: ['ISO 3', 'ISO 5', 'ISO 7', 'ISO 8'], a: 1, why: 'Grade A allows 3 520 particles ≥ 0.5 µm per m³, the ISO 5 limit.' },
    { q: 'In a well-mixed room with clean supply air, doubling the air changes per hour halves the steady particle count.', a: true, why: 'C = G/Q: with the same release rate, twice the clean airflow dilutes it to half.' },
    { q: 'What is the ISO 7 limit for particles ≥ 0.5 µm per m³ from the ISO formula?', answer: 351700, why: '10⁷ × (0.1/0.5)^2.08 = 10⁷ × 0.0352 ≈ 352 000 (rounded in the standard to 352 000).' },
    { q: 'Why is grade A given unidirectional rather than mixing airflow?', choices: ['it is cheaper', 'it sweeps particles away from open containers before they can settle, instead of diluting them', 'it keeps the room warmer', 'it makes the pressure cascade unnecessary'], a: 1, why: 'A uniform downward stream carries particles released near the product away at once; mixing ventilation only dilutes them.' }
  ],
  problems: [
    { q: 'A 50 m³ grade B room has 40 air changes an hour and two operators releasing 4 × 10⁵ particles a minute each. What steady count (particles ≥ 0.5 µm per m³) results?', answer: 24000, tol: 0.02, steps: ['$G = 8\\times10^5$ per minute.', '$C = 60 \\times 8\\times10^5/(40 \\times 50) = 24\\,000$ per m³.'] },
    { q: 'How many media-fill units with no positives are needed to show, with 95 % confidence, a contamination rate below 0.1 %?', answer: 2995, tol: 0.01, steps: ['$0.001 = 1 - 0.05^{1/n}$, so $n = \\ln 0.05/\\ln 0.999$.', '$n = -2.996/-0.0010005 = 2994.2$, so 2 995 units — close to the rule of three, 3/0.001 = 3 000.'] }
  ],
  applications: ['Filling vaccines, monoclonal antibodies and other biologics, which cannot be terminally sterilised.', 'Hospital and specialist pharmacies preparing ready-to-administer injections and cancer medicines in isolators and grade A cabinets.', 'Semiconductor and optics cleanrooms, which use the same ISO 14644 classes for different reasons.', 'Designing new filling lines around isolators and robots, keeping people out of the critical zone.'],
  history: 'Unidirectional ("laminar") airflow was invented by Willis Whitfield at Sandia National Laboratories in 1960–1962, for making weapons components; within a few years it was adopted in operating theatres and pharmaceutical filling. The US Federal Standard 209 (1963) defined the first cleanroom classes, later replaced by ISO 14644-1 (1999, revised 2015).',
  sim: 'ster-cleanroom'
},

{
  id: 'pyrogens-endotoxins', parent: 'sterile-topic', title: 'Pyrogens and endotoxins', level: 2,
  short: 'Pyrogens cause fever when injected. The most important are endotoxins — lipopolysaccharides from the outer membrane of Gram-negative bacteria — which survive sterilisation, act at billionths of a gram and are measured with a reagent from horseshoe-crab blood. Each injection has a limit, K/M.',
  keywords: ['pyrogen', 'endotoxin', 'lipopolysaccharide', 'LPS', 'lipid A', 'Gram-negative', 'LAL', 'Limulus', 'recombinant factor C', 'rabbit pyrogen test', 'monocyte activation test', 'endotoxin units', 'EU', 'K/M', 'maximum valid dilution', 'depyrogenation', 'water for injections'],
  prereq: ['medicine:innate-immunity', 'medicine:thermoregulation', 'sterilisation-methods'],
  related: ['parenteral-routes', 'injectable-formulation', 'quality-control', 'aseptic-processing', 'biology:bacteria-archaea', 'medicine:sepsis', 'dose-calculations'],
  body: `
A solution can be perfectly sterile and still give a patient a violent fever. **Pyrogens** ("fire-makers") are substances that trigger fever when they reach the blood, and the most important by far are **bacterial endotoxins**: the lipopolysaccharide (LPS) of the outer membrane of Gram-negative bacteria. They are released when bacteria grow and when they die, so a solution in which bacteria once grew, and were then killed by heat or removed by filtration, still carries them.

### How endotoxin works
LPS has three parts: an O-antigen sugar chain that varies between strains, a core oligosaccharide, and **lipid A**, the toxic anchor. Immune cells recognise lipid A through the receptor TLR4 and release interleukin-1, interleukin-6 and tumour necrosis factor; these reach the hypothalamus, which raises the body's temperature set-point through prostaglandin E₂ (see [[medicine:thermoregulation|fever]]). The potency is extraordinary: about 2 ng per kg of body weight given intravenously makes a healthy adult feverish and shivery, and larger amounts can cause shock ([[medicine:sepsis|sepsis]]). Endotoxin is measured in **endotoxin units** (EU); one EU is roughly 0.1 ng of the reference endotoxin.

Endotoxin is **heat-stable**: autoclaving barely touches it. Glassware is **depyrogenated** by dry heat — typically 250 °C or more for at least 30 minutes, validated as a 3-log reduction of endotoxin — and solutions are kept free of it by using clean water and ingredients, since removing it later is difficult. **Water for injections** must contain less than 0.25 EU/mL.

### The limit: K/M
The threshold pyrogenic dose is taken as **K = 5 EU per kg of body weight per hour** for most routes, and 0.2 EU/kg for injections into the spinal fluid, where the brain is far more sensitive. Dividing by $M$, the largest dose of the product per kg given within one hour, gives the limit per unit of drug:

| Product (hypothetical) | K | M | Endotoxin limit K/M |
|---|---|---|---|
| IV drug, up to 10 mg/kg in an hour | 5 EU/kg | 10 mg/kg | 0.5 EU/mg |
| IV drug, up to 0.1 mg/kg | 5 EU/kg | 0.1 mg/kg | 50 EU/mg |
| Intrathecal drug, up to 0.5 mg/kg | 0.2 EU/kg | 0.5 mg/kg | 0.4 EU/mg |

A potent drug given in tiny doses can tolerate a high limit per mg; a drug given in grams needs an extremely clean one.

### Testing
- **Rabbit pyrogen test** (USP, 1942): the product is injected into rabbits and their temperature watched. It detects all pyrogens but is slow, variable and uses animals; the European Pharmacopoeia is removing it (decided in 2021, at the time of writing being phased out).
- **Limulus amebocyte lysate (LAL)**: blood cells of the horseshoe crab clot in the presence of endotoxin through an enzyme cascade (factor C, factor B, the clotting enzyme, coagulogen). The **gel-clot**, **turbidimetric** and **chromogenic** methods detect down to about 0.001–0.03 EU/mL; in the kinetic versions the log of the onset time falls linearly with the log of the concentration.
- **Recombinant factor C** (rFC), made without crabs, added to the European Pharmacopoeia in 2020, and the **monocyte activation test** (Ph. Eur. 2.6.30), which uses human blood cells and also sees non-endotoxin pyrogens.

Products often interfere with the test, so samples are diluted — but not beyond the **maximum valid dilution**, $\\text{MVD} = \\text{limit} \\times C/\\lambda$, where $\\lambda$ is the lowest concentration the method can detect; beyond it, a product at its limit would read as negative. Every test includes a spiked sample that must recover 50–200 % of the added endotoxin.

> [!warn] Fever, shivering or rigors, a fast heartbeat, low blood pressure or feeling faint during or soon after an infusion or injection need prompt medical attention: tell the nurse or doctor at once, or call your local emergency number.
`,
  ideas: [
    'Endotoxin is the lipopolysaccharide of Gram-negative outer membranes; lipid A triggers fever through TLR4 and cytokines.',
    'It survives autoclaving: depyrogenation needs dry heat at 250 °C or more, so endotoxin is kept out rather than removed.',
    'The endotoxin limit of an injection is K/M: 5 EU/kg per hour (0.2 for intrathecal) divided by the largest dose per kg given in an hour.',
    'The LAL test uses horseshoe-crab blood cells that clot with endotoxin; recombinant factor C and the monocyte activation test are replacing animal-based methods.',
    'Samples may be diluted to overcome interference, but never beyond the maximum valid dilution.'
  ],
  pitfalls: [
    'A sterile injection cannot cause fever — Sterility concerns living microbes; the endotoxin of dead bacteria remains fully active after sterilisation.',
    'Filtering through 0.22 µm removes endotoxins — Endotoxin molecules and their aggregates are far smaller than bacteria and pass through ordinary sterilising filters.',
    'The endotoxin limit is the same for every injection — It is K/M, so it depends on the dose and the route: a drug given in grams needs a limit thousands of times stricter per mg than one given in micrograms.'
  ],
  formulas: [
    {
      name: 'Endotoxin limit',
      expr: 'EL = K/M', tex: '\\text{EL} = \\dfrac{K}{M}',
      vars: {
        EL: { name: 'endotoxin limit of the product', q: false, unit: 'EU/mg', tex: '\\text{EL}' },
        K: { name: 'threshold pyrogenic dose', q: false, unit: 'EU/kg', value: 5 },
        M: { name: 'largest dose per kg within one hour', q: false, unit: 'mg/kg', value: 10 }
      },
      note: 'K = 5 EU/kg for most parenteral routes, 0.2 EU/kg for intrathecal use. M can also be in mL/kg, giving a limit in EU/mL; the pharmacopoeias take 70 kg for an adult when a dose is given per person.',
      stories: {
        EL: 'A hypothetical intravenous drug is given at most {M} within an hour (K = {K}). What is its endotoxin limit?',
        M: 'A product has an endotoxin limit of {EL} (K = {K}). What is the largest hourly dose per kg this limit allows for?'
      }
    },
    {
      name: 'Maximum valid dilution',
      expr: 'MVD = EL*C/lambda', tex: '\\text{MVD} = \\dfrac{\\text{EL}\\cdot C}{\\lambda}',
      vars: {
        MVD: { name: 'maximum valid dilution (times)', tex: '\\text{MVD}' },
        EL: { name: 'endotoxin limit', q: false, unit: 'EU/mg', value: 0.5, tex: '\\text{EL}' },
        C: { name: 'concentration of the test solution', q: false, unit: 'mg/mL', value: 50 },
        lambda: { name: 'sensitivity of the method (λ)', q: false, unit: 'EU/mL', value: 0.125, tex: '\\lambda' }
      },
      note: 'λ is the labelled sensitivity of a gel-clot lysate or the lowest standard of a kinetic method.',
      stories: {
        MVD: 'A product with an endotoxin limit of {EL} is tested at {C} with a lysate of sensitivity {lambda}. What is the maximum valid dilution?',
        lambda: 'A product ({EL}, tested at {C}) interferes unless diluted {MVD} times. How sensitive must the method be?'
      }
    }
  ],
  examples: [
    {
      title: 'A limit for a high-dose antibiotic',
      q: 'A hypothetical antibiotic is given up to 2 g to a 70 kg adult, infused over 30 minutes. It is tested as a 100 mg/mL solution with a gel-clot lysate of sensitivity 0.03 EU/mL. Find its endotoxin limit and the maximum valid dilution.',
      steps: [
        '$M = 2000/70 = 28.6$ mg/kg within the hour.',
        '$\\text{EL} = 5/28.6 = 0.175$ EU/mg.',
        '$\\text{MVD} = 0.175 \\times 100/0.03 = 583$: the sample may be diluted up to about 580-fold to overcome interference.'
      ],
      a: 'EL = 0.175 EU/mg; MVD ≈ 580.'
    },
    {
      title: 'Why intrathecal is stricter',
      q: 'The same hypothetical drug at 0.2 mg/kg is given (a) intravenously and (b) intrathecally. Compare the limits.',
      steps: [
        'Intravenous: $5/0.2 = 25$ EU/mg.',
        'Intrathecal: $0.2/0.2 = 1$ EU/mg.',
        'The spinal-fluid limit is 25 times stricter, because the brain reacts to far smaller amounts of endotoxin.'
      ],
      a: '25 EU/mg intravenously against 1 EU/mg intrathecally.'
    }
  ],
  quiz: [
    { q: 'Which part of lipopolysaccharide is responsible for its toxicity?', choices: ['the O-antigen', 'the core oligosaccharide', 'lipid A', 'the peptidoglycan'], a: 2, why: 'Lipid A binds the TLR4 receptor complex on immune cells; the sugar chains mainly vary the antigenic identity.' },
    { q: 'Autoclaving a solution at 121 °C for 15 minutes removes endotoxin.', a: false, why: 'Endotoxin is heat-stable; depyrogenation of glass uses dry heat at 250 °C or more, and solutions must be kept clean from the start.' },
    { q: 'What endotoxin limit (EU/mg) does a hypothetical drug given at up to 2 mg/kg in an hour have (K = 5 EU/kg)?', answer: 2.5, unit: 'EU/mg', why: 'K/M = 5/2 = 2.5 EU/mg.' },
    { q: 'The LAL reagent is made from…', choices: ['rabbit blood', 'horseshoe-crab blood cells', 'human monocytes', 'Escherichia coli'], a: 1, why: 'Limulus amebocyte lysate comes from the amoebocytes of the horseshoe crab; recombinant factor C now reproduces its first enzyme without the animal.' },
    { q: 'Why may a sample not be diluted beyond the maximum valid dilution?', choices: ['the lysate would run out', 'a product exactly at its limit would then be diluted below the detection limit and pass wrongly', 'dilution changes the pH', 'the rabbits would not respond'], a: 1, why: 'At the MVD a product at its limit gives exactly λ; any further dilution could hide a failing product.' }
  ],
  problems: [
    { q: 'A drug is given intravenously at up to 0.05 mg/kg per hour and tested at 1 mg/mL with a kinetic method whose lowest standard is 0.005 EU/mL. What is the MVD?', answer: 20000, tol: 0.01, steps: ['EL = 5/0.05 = 100 EU/mg.', 'MVD = 100 × 1/0.005 = 20 000.'] },
    { q: 'A 1000 mL infusion is given over one hour to a 70 kg adult. What is the largest endotoxin concentration (EU/mL) it may contain, taking K = 5 EU/kg?', answer: 0.35, unit: 'EU/mL', tol: 0.02, steps: ['M = 1000/70 = 14.3 mL/kg in the hour.', 'Limit = 5/14.3 = 0.35 EU/mL — pharmacopoeias set 0.5 EU/mL or less for large-volume infusions, and water for injections must be below 0.25 EU/mL.'] }
  ],
  applications: ['Release testing of every batch of injections, infusions and implantable devices for bacterial endotoxins.', 'Validating depyrogenation tunnels that heat glass vials before aseptic filling.', 'Monitoring water-for-injections systems, where Gram-negative bacteria are the typical contaminants.', 'Replacing the rabbit test and reducing the use of horseshoe crabs with recombinant factor C and the monocyte activation test.'],
  history: 'Florence Seibert showed in 1923 that fevers after intravenous injections came from bacteria in the distilled water, and the rabbit pyrogen test entered the US Pharmacopeia in 1942. In the 1950s and 1960s Frederik Bang and Jack Levin found that horseshoe-crab blood clotted in the presence of Gram-negative bacteria because of their endotoxin; the LAL test was accepted by US regulators in the 1970s and 1980s and replaced most rabbit testing.',
  sim: 'ster-lal'
},

{
  id: 'injectable-formulation', parent: 'sterile-topic', title: 'Formulating injections', level: 2,
  short: 'An injection must dissolve the drug in very little liquid, keep it stable for years, and still be gentle to veins and tissue: water for injections, pH and buffers, tonicity, co-solvents, cyclodextrins and surfactants, antioxidants, preservatives only where needed, and limits on particles.',
  keywords: ['injection formulation', 'parenteral formulation', 'water for injections', 'WFI', 'co-solvent', 'precipitation on dilution', 'cyclodextrin', 'polysorbate', 'lipid emulsion', 'tonicity', 'osmolarity', 'pH', 'buffer', 'antioxidant', 'preservative', 'benzyl alcohol', 'particulate matter', 'USP 788', 'type I glass'],
  prereq: ['parenteral-routes', 'solubility-pharm', 'osmolarity-tonicity', 'buffers-pharm'],
  related: ['complexation', 'ph-solubility', 'isotonic-calculations', 'meq-mmol', 'lyophilisation', 'biologics-formulation', 'emulsions', 'preservatives', 'packaging', 'depot-implants', 'pyrogens-endotoxins'],
  body: `
A tablet can carry its drug as a solid and let the gut dissolve it. An injection has to deliver it already dissolved (or as a very fine dispersion) in a few millilitres, straight into tissue or blood, with no second chance to fix a mistake. Every ingredient must be safe *by that route*, and the list of excipients accepted for injection is short.

### The vehicle
**Water for injections** (WFI) is the usual vehicle: highly purified, with conductivity about 1.1–1.3 µS/cm (the limit depends on the pharmacopoeia and temperature), total organic carbon at most 0.5 mg/L and endotoxin below 0.25 EU/mL. Traditionally it was made only by distillation; since 2017 the European Pharmacopoeia also accepts membrane processes such as reverse osmosis with ultrafiltration. On its own, WFI is strongly hypotonic — a large volume given intravenously would burst red cells — so it is always made isotonic or used to dissolve something. For drugs that dissolve poorly in water, fixed oils (for intramuscular depots) and water-miscible **co-solvents** such as ethanol, propylene glycol and polyethylene glycol 400 are used.

### Dissolving the drug
- **pH and salts**: a weak acid or base is dissolved as its ionised salt ([[ph-solubility]]). Taken too far this hurts: phenytoin injection needed pH 12 and could damage veins, which led to a water-soluble phosphate prodrug.
- **Co-solvents**: solubility rises roughly exponentially with the co-solvent fraction, $\\log S_{mix} = \\log S_w + \\sigma f$. The catch is dilution: when the injection meets blood or an infusion bag, the co-solvent is diluted linearly but the solubility falls exponentially, and the drug can precipitate.
- **Cyclodextrins** (hydroxypropyl- and sulfobutylether-β-cyclodextrin) wrap a lipophilic drug in a soluble ring ([[complexation]]).
- **Surfactants and emulsions**: polysorbate 80 and polyoxyl castor oil solubilise in micelles (the latter can cause hypersensitivity reactions); lipid emulsions for anaesthesia and nutrition need droplets below about 0.5 µm on average and almost none above 5 µm, or they could block lung capillaries.

### Gentle to tissue
| Property | Aim | Why |
|---|---|---|
| pH | as near 7.4 as stability allows; roughly 3–9 for small IV volumes | extremes cause pain and phlebitis; a weak buffer lets the blood restore pH quickly |
| Tonicity | about 280–300 mOsm/kg; peripheral veins tolerate up to about 900 mOsm/L | hypotonic solutions lyse cells, strongly hypertonic ones irritate veins |
| Particles (USP <788>, Ph. Eur. 2.9.19) | up to 100 mL: ≤ 6 000 per container ≥ 10 µm and ≤ 600 ≥ 25 µm; above 100 mL: ≤ 25 per mL and ≤ 3 per mL | particles can lodge in lung capillaries |

Buffers (phosphate, citrate, acetate, histidine for proteins) are used at the lowest strength that holds the pH — citrate has been linked to stinging under the skin, and several subcutaneous products were reformulated without it. Tonicity is adjusted with sodium chloride or glucose; check a formula with [the isotonicity calculator](#/tools/pharmcalc/isotonic) and [the osmolarity calculator](#/tools/pharmcalc/electrolytes), and see [[osmolarity-tonicity]].

### Protecting the drug
Oxidation is slowed by antioxidants (sodium metabisulfite, to which some people are sensitive; ascorbic acid), by chelating metal ions with edetate, by nitrogen in the headspace and by amber glass. Drugs too unstable in water are supplied as powders — often freeze-dried ([[lyophilisation]]) — to be reconstituted just before use.

**Preservatives** (benzyl alcohol, phenol, *m*-cresol, parabens) belong only in multi-dose containers. Pharmacopoeias exclude them from injections into or around the spinal fluid and into the eye, and from large single doses (in Europe, more than 15 mL); benzyl alcohol is avoided in newborns after the "gasping syndrome" deaths reported in 1982. The container matters too: type I borosilicate glass, stoppers whose extractables are tested, prefilled syringes lubricated with silicone oil, and plastic bags that must not leach plasticiser into fatty formulations ([[packaging]]).

> [!note] These pages describe how injections are designed and made under GMP. Injections are prepared and given only by trained professionals following the product information and local protocols, with an independent check.
`,
  ideas: [
    'Water for injections is the standard vehicle: highly purified, endotoxin below 0.25 EU/mL, and never given alone in large volumes because it is hypotonic.',
    'Solubility is raised by salts and pH, co-solvents, cyclodextrins and surfactants — each with a cost, such as precipitation on dilution or hypersensitivity.',
    'Co-solvent solubility rises exponentially with the co-solvent fraction, so dilution in blood can leave the drug supersaturated.',
    'Aim for pH near 7.4 with weak buffers, tonicity near 290 mOsm/kg, and particle counts within USP <788> and Ph. Eur. 2.9.19.',
    'Preservatives only in multi-dose containers, and never in intrathecal, epidural or intraocular injections.'
  ],
  pitfalls: [
    'A drug that is fully dissolved in its vial will stay dissolved in the vein — Dilution of a co-solvent or pH-adjusted formulation can make it precipitate within seconds; infusion rates and diluents are chosen to prevent this.',
    'Water for injections is safe to inject because it is sterile and pyrogen-free — Given intravenously in volume it is hypotonic and destroys red cells; it is a vehicle, not a fluid for infusion.',
    'A stronger buffer is always better — A strong buffer resists the body too, prolonging pain at the injection site; the lowest capacity that keeps the product stable is used.'
  ],
  formulas: [
    {
      name: 'Solubility in a co-solvent mixture (log-linear model)',
      expr: 'log(Sm) = log(Sw) + sigma*f', tex: '\\log S_{mix} = \\log S_w + \\sigma f',
      vars: {
        Sm: { name: 'solubility in the mixture', q: false, unit: 'mg/mL', tex: 'S_{mix}' },
        Sw: { name: 'solubility in water', q: false, unit: 'mg/mL', value: 0.02, tex: 'S_w' },
        sigma: { name: 'solubilising power of the co-solvent', value: 4, tex: '\\sigma' },
        f: { name: 'volume fraction of co-solvent', value: 0.6, min: 0, max: 1 }
      },
      note: 'Yalkowsky\'s log-linear model; σ grows with the drug\'s lipophilicity and depends on the co-solvent. Logarithms base 10.',
      practice: { unknowns: ['Sm', 'f'] },
      stories: {
        Sm: 'A hypothetical drug dissolves to {Sw} in water; its σ for a co-solvent is {sigma}. What is its solubility at a co-solvent fraction of {f}?',
        f: 'A hypothetical drug (solubility {Sw} in water, σ = {sigma}) must be dissolved at {Sm}. What co-solvent fraction is needed?'
      }
    },
    {
      name: 'Osmolarity of a solution',
      expr: 'Osm = 1000*c*n/MW', tex: 'c_{osm} = \\dfrac{1000\\,c\\,n}{M}',
      vars: {
        Osm: { name: 'osmolarity (ideal)', q: false, unit: 'mOsm/L', tex: 'c_{osm}' },
        c: { name: 'concentration of the solute', q: false, unit: 'g/L', value: 9 },
        n: { name: 'particles per formula unit', int: true, value: 2, min: 1, max: 5 },
        MW: { name: 'molar mass', q: false, unit: 'g/mol', value: 58.44, tex: 'M' }
      },
      note: 'Ideal: assumes complete dissociation and no interactions. Measured osmolality is lower (0.9 % NaCl: 308 mOsm/L calculated, about 286 mOsm/kg measured). Sum the terms for a mixture.',
      practice: { unknowns: ['Osm', 'c'] },
      stories: {
        Osm: 'A solution contains {c} of a solute (M = {MW}) that gives {n} particles per formula unit. What is its osmolarity?',
        c: 'How many grams per litre of a solute (M = {MW}, {n} particles each) give {Osm}?'
      }
    }
  ],
  examples: [
    {
      title: 'Precipitation when a co-solvent injection is diluted',
      q: 'A hypothetical drug dissolves to 0.02 mg/mL in water, with $\\sigma = 4$ for its co-solvent. It is formulated at 5 mg/mL in 60 % co-solvent and then diluted tenfold in saline. Does it stay in solution?',
      steps: [
        'In the vial: $\\log S = \\log 0.02 + 4 \\times 0.6 = -1.70 + 2.40 = 0.70$, so $S = 5.0$ mg/mL — just enough.',
        'After a tenfold dilution: concentration 0.5 mg/mL, co-solvent 6 %: $\\log S = -1.70 + 0.24 = -1.46$, $S = 0.035$ mg/mL.',
        'The diluted drug is 14 times over its solubility — it is likely to precipitate, in the bag or in the vein. Such products carry instructions on diluent, concentration and rate, and some must be given undiluted and slowly.'
      ],
      a: 'No: diluted tenfold it is about 14 times supersaturated.'
    },
    {
      title: 'The osmolarity of a mixed infusion',
      q: 'What is the ideal osmolarity of glucose 5 % (50 g/L, M = 180.16) containing 20 mmol/L of potassium chloride?',
      steps: [
        'Glucose: $1000 \\times 50 \\times 1/180.16 = 277.5$ mOsm/L.',
        'KCl: 20 mmol/L × 2 particles = 40 mOsm/L (1.49 g/L of KCl, M = 74.55).',
        'Total 317.5 mOsm/L — near isotonic in the bag; glucose is then metabolised, so the solution acts as free water in the body.'
      ],
      a: 'About 318 mOsm/L.'
    }
  ],
  quiz: [
    { q: 'Why is water for injections never infused on its own in large volumes?', choices: ['it contains endotoxins', 'it is hypotonic and would burst red blood cells', 'it is too acidic', 'it is not sterile'], a: 1, why: 'Pure water has an osmolarity near zero; red cells take up water and lyse.' },
    { q: 'What is the ideal osmolarity (mOsm/L) of glucose 5 % (50 g/L, M = 180.16)?', answer: 277.5, unit: 'mOsm/L', why: '1000 × 50/180.16 = 277.5 mOsm/L.' },
    { q: 'A preservative should be added to a 500 mL single-dose infusion to make it safer.', a: false, why: 'Single-dose infusions are sterile and used once; a preservative in that volume would give a large, unnecessary dose of a potentially toxic agent. Pharmacopoeias exclude preservatives from large single doses.' },
    { q: 'A co-solvent formulation is diluted tenfold. Its drug concentration falls tenfold; its solubility…', choices: ['also falls tenfold', 'falls by far more than tenfold', 'rises', 'is unchanged'], a: 1, why: 'Solubility falls exponentially with the co-solvent fraction, so it drops much faster than the concentration — the drug becomes supersaturated.' },
    { q: 'For an injection of up to 100 mL, USP <788> allows at most how many particles of 10 µm or larger per container?', choices: ['60', '600', '6 000', '60 000'], a: 2, why: 'Small-volume injections: ≤ 6 000 particles ≥ 10 µm and ≤ 600 ≥ 25 µm per container (light obscuration).' }
  ],
  problems: [
    { q: 'What is the ideal osmolarity of 0.45 % sodium chloride (4.5 g/L, M = 58.44, 2 particles)?', answer: 154, unit: 'mOsm/L', tol: 0.01, steps: ['$1000 \\times 4.5 \\times 2/58.44 = 154$ mOsm/L — hypotonic, about half of plasma.'] },
    { q: 'A drug has a water solubility of 0.01 mg/mL and σ = 3.5 in propylene glycol. What co-solvent fraction dissolves 2 mg/mL?', answer: 0.658, tol: 0.02, steps: ['$\\log 2 - \\log 0.01 = 0.301 + 2 = 2.301$.', '$f = 2.301/3.5 = 0.658$ — two-thirds propylene glycol, a very irritant formulation.'] }
  ],
  applications: ['Designing ready-to-use infusion bags, prefilled syringes and pens for self-injection.', 'Choosing diluents and infusion rates so that co-solvent and pH-adjusted drugs do not precipitate.', 'Replacing irritant excipients: prodrugs, cyclodextrins or nanoparticles instead of extreme pH or castor-oil surfactants.', 'Hospital pharmacy checks of compatibility when several drugs share one intravenous line.'],
  sim: 'ster-precip'
},

{
  id: 'lyophilisation', parent: 'sterile-topic', title: 'Freeze-drying', level: 3,
  short: 'Freeze-drying removes water from a frozen product by sublimation under vacuum, leaving a porous cake that keeps for years and dissolves in seconds. The art is to keep the product below its collapse temperature while supplying the heat that the ice needs to turn into vapour.',
  keywords: ['freeze-drying', 'lyophilisation', 'lyophilization', 'sublimation', 'triple point', 'primary drying', 'secondary drying', 'collapse temperature', 'glass transition', 'Tg\'', 'eutectic', 'annealing', 'lyoprotectant', 'sucrose', 'trehalose', 'mannitol', 'cake', 'residual moisture', 'vial heat transfer coefficient'],
  prereq: ['injectable-formulation', 'chemistry:phase-diagrams', 'physics:latent-heat', 'solid-state'],
  related: ['biologics-formulation', 'vaccine-formulation', 'shelf-life', 'aseptic-processing', 'chemistry:vapor-pressure', 'chemistry:clausius-clapeyron', 'physics:heat-transfer'],
  body: `
Many medicines do not last in water: antibodies aggregate, some antibiotics hydrolyse within hours, live vaccines die. Dry, they keep for years. Freeze-drying removes the water gently: the solution is frozen in its vials, and the ice is turned directly into vapour under vacuum, without ever melting. What remains is a porous **cake** with the shape of the frozen solution, which dissolves in seconds when water is added.

### Why a vacuum
Ice can go straight to vapour only below the **triple point** of water, 611.657 Pa and 0.01 °C (see [[chemistry:phase-diagrams|phase diagrams]]). The vapour pressure of ice falls steeply with temperature:

| Ice at | −10 °C | −20 °C | −30 °C | −40 °C | −50 °C |
|---|---|---|---|---|---|
| Vapour pressure | 260 Pa | 103 Pa | 38 Pa | 12.9 Pa | 3.9 Pa |

Sublimation happens when the chamber pressure is below the ice's vapour pressure; the vapour flows to a **condenser** at −60 to −80 °C, where it freezes out again.

### The three stages
1. **Freezing.** Shelves cool the vials to about −40 to −50 °C. Water freezes to pure ice and the solutes are squeezed into a concentrated phase between the crystals. Some solutes crystallise at a **eutectic** temperature (mannitol −1.5 °C, sodium chloride −21 °C); others, such as sucrose and proteins, become an amorphous glass at the glass-transition temperature of the freeze-concentrate, **Tg′** (sucrose about −32 °C, trehalose about −29 °C). Ice nucleates randomly after some supercooling, so vials freeze differently; holding at a higher temperature (**annealing**) grows larger crystals and hence larger pores.
2. **Primary drying.** The chamber is evacuated to about 5–20 Pa and the shelves warmed to supply the latent heat of sublimation, about 2.84 kJ per gram of ice. The ice front recedes from the top of the cake downwards; vapour must escape through the dried layer above it, whose resistance grows as it thickens. This is the longest step — often a day or more.
3. **Secondary drying.** The shelves are warmed to 20–40 °C to desorb water bound in the solid, down to a residual moisture of about 0.5–2 %. The vials are then stoppered inside the chamber, under nitrogen or vacuum.

### Collapse: the limit on speed
Warmer shelves mean faster drying, but the product at the ice front must stay below its **collapse temperature** $T_c$ — a degree or two above Tg′ for an amorphous product, or below the eutectic temperature for a crystalline one. Above it the freeze-concentrate softens and flows: the cake shrinks and closes its pores, dries poorly, reconstitutes slowly and may be less stable. The product temperature is set by a balance: the heat reaching the vial, $K_v A_v (T_s - T_p)$, must equal the latent heat carried off by the vapour, $\\Delta H_s \\cdot A_p (p_{ice} - p_c)/R_p$. Because $p_{ice}$ rises steeply with $T_p$, the ice settles at the temperature where the two match — typically 20–30 °C below the shelf.

Lowering the chamber pressure speeds the vapour's escape but also reduces heat transfer (much of the heat is conducted by gas in the gap under the vial), so there is an optimum. **Formulation** helps: **lyoprotectants** (sucrose, trehalose) replace water's hydrogen bonds around proteins and form a stable glass; **bulking agents** (mannitol, glycine) crystallise into a strong scaffold that allows warmer drying; some buffers are avoided because they crystallise during freezing and shift the pH by several units.

> [!key] Freeze, then sublime below the collapse temperature, then desorb. Every degree of product temperature saves hours of drying — until the cake collapses.
`,
  ideas: [
    'Freeze-drying removes water by sublimation below the triple point of water (611 Pa), leaving a porous cake that is stable and quick to reconstitute.',
    'Freezing separates pure ice from a freeze-concentrate that crystallises (eutectic) or turns to glass (Tg′).',
    'In primary drying the product temperature is set by the balance between heat from the shelf and latent heat carried off by the vapour.',
    'The product must stay below its collapse temperature; drying faster means running as close to it as is safe.',
    'Sucrose and trehalose protect proteins in the dry glass; mannitol and glycine build a crystalline scaffold.'
  ],
  pitfalls: [
    'The product is at the shelf temperature — During primary drying sublimation cools the ice far below the shelf, often by 20–30 °C; it is the product temperature that must be kept below collapse.',
    'Lower chamber pressure always dries faster — Very low pressure starves the vial of heat conducted through the gas, so the drying can slow; there is an optimum, usually 5–20 Pa.',
    'Freeze-drying makes a product sterile — It removes water, not microbes; the solution is sterile-filtered and the vials are filled and loaded aseptically.'
  ],
  formulas: [
    {
      name: 'Vapour pressure of ice',
      expr: 'P = 3.597e12*exp(-6144.96/T)', tex: 'p_{ice} = 3.597\\times10^{12}\\,\\mathrm{Pa}\\cdot e^{-6145\\,\\mathrm{K}/T}',
      vars: {
        P: { name: 'vapour pressure of ice', q: 'pressure', unit: 'Pa', tex: 'p_{ice}' },
        T: { name: 'temperature of the ice', q: 'temperature', unit: '°C', value: -30, signed: true }
      },
      note: 'A Clausius–Clapeyron fit used in freeze-drying (T in kelvin inside the formula), accurate to about 1 % from −60 to 0 °C.',
      stories: {
        P: 'What is the vapour pressure of ice at {T}?',
        T: 'The ice at the sublimation front has a vapour pressure of {P}. What is its temperature?'
      }
    },
    {
      name: 'Sublimation rate through the dried layer',
      expr: 'm = Ap*(Pice - Pc)/Rp', tex: '\\dot m = \\dfrac{A_p\\,(p_{ice} - p_c)}{R_p}',
      vars: {
        m: { name: 'sublimation rate per vial', q: false, unit: 'g/h', tex: '\\dot m' },
        Ap: { name: 'cross-section of the product', q: false, unit: 'cm²', value: 3.8, tex: 'A_p' },
        Pice: { name: 'vapour pressure of ice at the front', q: false, unit: 'Pa', value: 32, tex: 'p_{ice}' },
        Pc: { name: 'chamber pressure', q: false, unit: 'Pa', value: 10, tex: 'p_c' },
        Rp: { name: 'resistance of the dried layer', q: false, unit: 'cm²·Pa·h/g', value: 533, tex: 'R_p' }
      },
      note: 'R_p grows as the dried layer thickens; 533 cm²·Pa·h/g is 4 cm²·Torr·h/g, typical of a few millimetres of a sucrose cake.',
      stories: {
        m: 'Ice at {Pice} sublimes into a chamber at {Pc} through a dried layer of resistance {Rp}, over {Ap}. What is the sublimation rate?',
        Pc: 'To sublime {m} per vial ({Ap}, R_p = {Rp}) from ice at {Pice}, what chamber pressure is needed?'
      }
    },
    {
      name: 'Heat supplied to a vial',
      expr: 'm = 0.36*Kv*Av*(Ts - Tp)/Hs', tex: '\\dot m = 0.36\\,\\dfrac{K_v A_v (T_s - T_p)}{\\Delta H_s}',
      vars: {
        m: { name: 'ice sublimed per vial', q: false, unit: 'g/h', tex: '\\dot m' },
        Kv: { name: 'vial heat transfer coefficient', q: false, unit: 'W/(m²·K)', value: 15, tex: 'K_v' },
        Av: { name: 'area of the vial base', q: false, unit: 'cm²', value: 3.8, tex: 'A_v' },
        Ts: { name: 'shelf temperature', q: false, unit: '°C', value: -10, signed: true, tex: 'T_s' },
        Tp: { name: 'product temperature at the vial base', q: false, unit: '°C', value: -31.65, signed: true, tex: 'T_p' },
        Hs: { name: 'latent heat of sublimation of ice', q: false, unit: 'J/g', value: 2840, tex: '\\Delta H_s' }
      },
      note: 'In steady primary drying all the heat goes into sublimation. 0.36 converts W·cm² into g/h (10⁻⁴ m²/cm² × 3600 s/h). K_v depends on the vial and on the chamber pressure.',
      practice: { unknowns: ['m', 'Tp'] },
      stories: {
        m: 'A vial (K_v = {Kv}, base {Av}) sits on a shelf at {Ts} while its ice is at {Tp}. How much ice sublimes per hour?',
        Tp: 'A vial (K_v = {Kv}, base {Av}) on a shelf at {Ts} sublimes {m}. What is the product temperature?'
      }
    }
  ],
  examples: [
    {
      title: 'Where the product temperature settles',
      q: 'A vial with $K_v = 15$ W/(m²·K), $A_v = A_p = 3.8$ cm² and $R_p = 533$ cm²·Pa·h/g is dried at $p_c = 10$ Pa with the shelf at −10 °C. Find the product temperature and the sublimation rate.',
      steps: [
        'Heat in: $15 \\times 3.8\\times10^{-4} \\times (-10 - T_p) = 5.70\\times10^{-3}(-10 - T_p)$ W.',
        'Heat used: $2840 \\times 3.8 \\times (p_{ice} - 10)/533/3600 = 5.62\\times10^{-3}(p_{ice} - 10)$ W.',
        'Try $T_p = -31.5$ °C: $p_{ice} = 32.5$ Pa, heat in 0.123 W, used 0.127 W. Try −31.7 °C: $p_{ice} = 31.9$ Pa, in 0.124 W, used 0.123 W. They balance at about −31.65 °C.',
        'Rate $= 0.123 \\times 3600/2840 = 0.156$ g/h per vial.'
      ],
      a: 'The ice sits near −31.7 °C, 22 degrees below the shelf, subliming about 0.16 g/h.'
    },
    {
      title: 'Staying clear of collapse',
      q: 'The product is a protein in sucrose, $T_c \\approx -32$ °C. At a shelf of −10 °C the ice runs at −31.7 °C. What does a shelf of −20 °C give?',
      steps: [
        'Repeat the balance with $T_s = -20$ °C: it settles near $T_p = -34.2$ °C ($p_{ice} = 24.4$ Pa).',
        'Rate $= 5.70\\times10^{-3} \\times 14.2 \\times 3600/2840 = 0.103$ g/h.',
        'Ten degrees colder on the shelf gives only 2.5 degrees colder product — now 2 °C inside the collapse limit — but drying is 34 % slower: a 3 mL fill (about 2.9 g of ice) needs roughly 28 h instead of 18 h, and longer still as the dried layer thickens.'
      ],
      a: 'Product ≈ −34 °C (safe margin), rate ≈ 0.10 g/h instead of 0.16 g/h.'
    }
  ],
  quiz: [
    { q: 'Below what pressure can ice turn directly into vapour without melting?', choices: ['101 kPa', '10 kPa', '611 Pa', '1 Pa'], a: 2, why: 'The triple point of water is at 611.657 Pa (0.01 °C); below it the liquid is not stable and ice sublimes.' },
    { q: 'During primary drying the product is about as warm as the shelf.', a: false, why: 'Sublimation absorbs about 2.84 kJ per gram, cooling the ice front typically 20–30 °C below the shelf.' },
    { q: 'What is the vapour pressure of ice (Pa) at −40 °C, from p = 3.597 × 10¹² e^(−6145/T)?', answer: 12.9, unit: 'Pa', why: '3.597 × 10¹² × e^(−6144.96/233.15) = 3.597 × 10¹² × 3.58 × 10⁻¹² = 12.9 Pa.' },
    { q: 'What happens if the product rises above its collapse temperature during primary drying?', choices: ['it melts back into a solution at once', 'the freeze-concentrate flows, the cake shrinks and its pores close', 'the vial breaks', 'nothing, as long as the shelf is cold'], a: 1, why: 'Above Tc the amorphous matrix softens and flows under its own weight: collapse spoils the appearance, slows drying and reconstitution and can reduce stability.' },
    { q: 'Which excipient is used mainly as a lyoprotectant for proteins?', choices: ['mannitol', 'sucrose', 'sodium chloride', 'sodium phosphate'], a: 1, why: 'Sucrose (and trehalose) stay amorphous, replace water\'s hydrogen bonds around the protein and form a stable glass; mannitol is mainly a crystalline bulking agent.' }
  ],
  problems: [
    { q: 'Ice at −25 °C (vapour pressure 63.3 Pa) sublimes into a chamber at 15 Pa through a dried layer with R_p = 800 cm²·Pa·h/g, over 5.0 cm². What is the sublimation rate in g/h?', answer: 0.302, unit: 'g/h', tol: 0.02, steps: ['$\\dot m = 5.0 \\times (63.3 - 15)/800$.', '$= 5.0 \\times 48.3/800 = 0.302$ g/h.'] },
    { q: 'A vial with K_v = 20 W/(m²·K) and a base of 3.8 cm² sits on a shelf at 0 °C; its ice is at −25 °C. How much ice sublimes per hour?', answer: 0.241, unit: 'g/h', tol: 0.02, steps: ['Heat: $20 \\times 3.8\\times10^{-4} \\times 25 = 0.19$ W.', '$\\dot m = 0.19 \\times 3600/2840 = 0.241$ g/h.'] }
  ],
  applications: ['Monoclonal antibodies, many vaccines and unstable antibiotics supplied as powders for reconstitution.', 'Blood plasma and serum stored and shipped without refrigeration, the technique\'s first large use.', 'Probiotics, diagnostic reagents and enzymes; instant coffee and space food use the same physics.', 'Designing cycles with a "design space" of shelf temperature and pressure that keeps every vial below collapse.'],
  history: 'Andean farmers have freeze-dried potatoes (chuño) for centuries by leaving them out on cold, dry, high-altitude nights. Laboratory freeze-drying of serum was developed in the 1930s by Earl Flosdorf and Stuart Mudd in Philadelphia, and during the Second World War it made dried plasma — and then penicillin — available to armies across the world.',
  sim: 'ster-lyo'
},

{
  id: 'ophthalmic', parent: 'sterile-topic', title: 'Eye preparations', level: 2,
  short: 'Eye drops must be sterile, comfortable and able to reach their target before the tears wash them away. A drop is bigger than the eye can hold, most of it overflows or drains within minutes, and usually only 1–5 % of the drug gets into the eye.',
  keywords: ['eye drops', 'ophthalmic', 'tear film', 'tear turnover', 'precorneal drainage', 'nasolacrimal duct', 'cornea', 'ocular bioavailability', 'tonicity', 'pH', 'benzalkonium chloride', 'preservative-free', 'viscosity', 'in situ gel', 'eye ointment', 'intravitreal injection', 'in-use shelf life'],
  prereq: ['osmolarity-tonicity', 'isotonic-calculations', 'buffers-pharm', 'physics:the-eye'],
  related: ['preservatives', 'nasal-otic', 'sterilisation-methods', 'aseptic-processing', 'membrane-transport-pharm', 'partition-logp', 'packaging', 'medicine:vision'],
  body: `
The front of the eye is covered by a tear film of only about **7 µL**, renewed at roughly 1 µL a minute (about 16 % a minute). The space between the lids can briefly hold about 30 µL — yet a drop from a typical bottle is 30–50 µL. So most of a drop spills over the lid or drains through the tear ducts into the nose within a minute or two, and what stays is diluted and washed out with a rate constant of the order of 0.5–1 per minute. The drug has those few minutes to cross the **cornea**.

### Crossing the cornea
The cornea is a sandwich: a fatty epithelium with tight junctions, a watery stroma, and a thin endothelium. A drug must be moderately lipophilic to cross the first layer and soluble enough in water to cross the second — the best penetrators have log P around 2–3, and the un-ionised form crosses best ([[partition-logp]], [[ionisation-pka]]). Absorption through the cornea is slow compared with drainage, so the fraction that enters the eye is roughly $k_c/(k_c + k_d)$: usually **1–5 %**. The rest drains into the nose and is absorbed into the blood without a first pass through the liver — which is why eye drops of some heart and blood-pressure drugs can have effects on the heart and lungs. Gently closing the eyes for a minute or two after a drop reduces drainage.

### Comfort: pH and tonicity
Anything that stings makes the eye water, and **reflex tearing** washes the drug away even faster — an uncomfortable drop defeats itself.

| Property | Tears | Well tolerated |
|---|---|---|
| pH | about 7.4 | roughly 6.6–7.8; wider if weakly buffered, so tears neutralise it quickly |
| Tonicity | about 300 mOsm/kg | 0.6–2 % NaCl equivalent (about 200–640 mOsm/kg) |
| Volume | about 7 µL | drops of 25–35 µL would waste less |

Where the drug is only stable at a lower pH, the drop is buffered weakly so that the tears can bring it back to neutral within a minute. Tonicity is adjusted with sodium chloride, boric acid or mannitol (see [[isotonic-calculations]] and [the isotonicity calculator](#/tools/pharmcalc/isotonic)). Tear osmolality rises above about 308 mOsm/kg in dry-eye disease, which is why some artificial tears are made slightly hypotonic.

### Staying longer
Viscosity enhancers (hypromellose, carbomers, hyaluronic acid), **in situ gels** that thicken on contact with tear salts or body warmth, suspensions, ointments and inserts all lengthen the contact time — at the price of blurred vision. For the back of the eye, drops are almost useless: diseases of the retina are treated with **intravitreal injections** of about 50 µL, given by specialists under strict asepsis.

### Sterility and preservatives
All eye preparations must be sterile. Multi-dose bottles contain a preservative — most often **benzalkonium chloride** at 0.004–0.02 % — which damages the corneal surface and the tear film with years of use, a real problem for people treating glaucoma for life. Preservative-free single-dose units and bottles with one-way valves or filters avoid it. Once opened, a bottle has an **in-use shelf life**, typically four weeks. Contaminated eye drops can cause severe infections: in 2023 an imported preservative-free artificial tear product in the United States was linked to an outbreak of a highly drug-resistant *Pseudomonas aeruginosa* with deaths and loss of sight.

> [!warn] A painful red eye, sudden blurred or lost vision, or increasing pain and discharge after using eye drops or contact lenses need urgent medical care the same day — for sudden loss of vision or a chemical splash, call your local emergency number. Do not share eye drops, keep the tip from touching anything, and discard a bottle at the end of its in-use period.
`,
  ideas: [
    'The tear film holds about 7 µL; a 30–50 µL drop mostly overflows or drains within minutes.',
    'Corneal absorption competes with drainage, so ocular bioavailability is roughly kc/(kc + kd) — usually 1–5 %.',
    'Drops that sting trigger reflex tearing, which washes the drug out faster: comfort (pH, tonicity) is also efficacy.',
    'Viscous vehicles, gels, suspensions and ointments lengthen contact; the retina needs intravitreal injections.',
    'Eye preparations must be sterile; preservatives protect multi-dose bottles but can harm the eye surface with long use.'
  ],
  pitfalls: [
    'Two drops deliver twice the dose — The eye cannot hold even one; a second drop given at once mostly washes out the first. Separate drops by about five minutes.',
    'Any drop outside pH 7.4 and 290 mOsm/kg is harmful — The eye tolerates a surprisingly wide range when the buffer is weak; the aim is comfort, which keeps the drug from being washed away.',
    'Eye drops act only on the eye — Most of the drop drains into the nose and reaches the blood without a first pass through the liver, so systemic effects are possible.'
  ],
  formulas: [
    {
      name: 'Tonicity just after a drop mixes with the tears',
      expr: 'Om = (Vd*Od + Vt*Ot)/(Vd + Vt)', tex: 'O_{mix} = \\dfrac{V_d O_d + V_t O_t}{V_d + V_t}',
      vars: {
        Om: { name: 'osmolality of the mixture', q: false, unit: 'mOsm/kg', tex: 'O_{mix}' },
        Vd: { name: 'volume of drop retained', q: false, unit: 'µL', value: 30, tex: 'V_d' },
        Od: { name: 'osmolality of the drop', q: false, unit: 'mOsm/kg', value: 600, tex: 'O_d' },
        Vt: { name: 'tear volume', q: false, unit: 'µL', value: 7, tex: 'V_t' },
        Ot: { name: 'osmolality of the tears', q: false, unit: 'mOsm/kg', value: 300, tex: 'O_t' }
      },
      note: 'A simple mixing balance (osmolality treated as additive by volume). The same weighting describes pH only roughly, because buffers do not mix linearly.',
      practice: { unknowns: ['Om', 'Od'] },
      stories: {
        Om: 'A drop of {Vd} at {Od} mixes with {Vt} of tears at {Ot}. What is the osmolality of the mixture?',
        Od: 'A drop of {Vd} mixed with {Vt} of tears at {Ot} gives {Om}. What was the drop\'s osmolality?'
      }
    },
    {
      name: 'Precorneal washout',
      expr: 'C = C0*exp(-k*t)', tex: 'C = C_0\\,e^{-k_d t}',
      vars: {
        C: { name: 'drug concentration in the tear film', q: 'massconc', unit: 'mg/mL' },
        C0: { name: 'concentration just after the drop', q: 'massconc', unit: 'mg/mL', value: 5, tex: 'C_0' },
        k: { name: 'drainage rate constant', q: 'rate', unit: '1/min', value: 0.5, tex: 'k_d' },
        t: { name: 'time after the drop', q: 'time', unit: 'min', value: 3 }
      },
      stories: {
        C: 'A drop leaves {C0} in the tear film, which drains with k = {k}. What is left after {t}?',
        t: 'The tear film drains with k = {k}. How long until the drug falls from {C0} to {C}?'
      }
    },
    {
      name: 'Fraction absorbed into the eye',
      expr: 'F = kc/(kc + kd)', tex: 'F = \\dfrac{k_c}{k_c + k_d}',
      vars: {
        F: { name: 'ocular bioavailability', q: 'ratio', unit: '%' },
        kc: { name: 'corneal absorption rate constant', q: 'rate', unit: '1/min', value: 0.005, tex: 'k_c' },
        kd: { name: 'drainage rate constant', q: 'rate', unit: '1/min', value: 0.5, tex: 'k_d' }
      },
      note: 'Two first-order processes competing for the drug in the tear film; losses to the conjunctiva and the fraction that overflows at once are ignored.',
      stories: {
        F: 'A drug crosses the cornea with k_c = {kc} while the tears drain with k_d = {kd}. What fraction enters the eye?',
        kd: 'A drug with k_c = {kc} should reach an ocular bioavailability of {F}. How slow must the drainage be?'
      }
    }
  ],
  examples: [
    {
      title: 'A hypertonic drop meets the tears',
      q: 'A 30 µL drop at 600 mOsm/kg mixes with 7 µL of tears at 300 mOsm/kg. What does the eye feel?',
      steps: [
        '$O_{mix} = (30 \\times 600 + 7 \\times 300)/(30 + 7) = 20\\,100/37 = 543$ mOsm/kg.',
        'At first the tear film is almost as concentrated as the drop — about 1.7 % NaCl equivalent, inside the tolerated range but noticeable.',
        'Drainage and fresh tears bring it back towards 300 within a few minutes; a drop at 900 mOsm/kg would sting enough to cause reflex tearing.'
      ],
      a: 'About 543 mOsm/kg at first, falling back towards 300 as the tears are replaced.'
    },
    {
      title: 'Why wait between two drops',
      q: 'Drops of two medicines are prescribed for the same eye. The tear film drains with $k_d = 0.5$ per minute. How much of the first drop is left after 30 s and after 5 min?',
      steps: [
        'After 30 s: $e^{-0.5 \\times 0.5} = 0.78$ — 78 % is still there, and a second drop would overflow and carry much of it away.',
        'After 5 min: $e^{-0.5 \\times 5} = 0.082$ — only 8 % remains; the first drug has done most of what it can.',
        'Hence the usual advice to leave about five minutes between different eye drops, given in the leaflet or by a pharmacist.'
      ],
      a: '78 % after 30 s, 8 % after 5 minutes.'
    },
    {
      title: 'Comfort, viscosity and bioavailability',
      q: 'A drug crosses the cornea with $k_c = 0.005$ per minute. What fraction enters the eye with normal drainage ($k_d = 0.5$), with a stinging drop that doubles drainage, and with a viscous vehicle that halves it?',
      steps: [
        'Normal: $0.005/0.505 = 0.99$ %.',
        'Stinging (reflex tearing): $0.005/1.005 = 0.50$ %.',
        'Viscous: $0.005/0.255 = 1.96$ %.'
      ],
      a: 'About 1 %, 0.5 % and 2 %: comfort and residence time can change the dose reaching the eye fourfold.'
    }
  ],
  quiz: [
    { q: 'About how much tear fluid covers the front of the eye?', choices: ['0.7 µL', '7 µL', '70 µL', '0.7 mL'], a: 1, why: 'About 7 µL; the space between the lids can hold about 30 µL briefly, less than a typical drop.' },
    { q: 'A drug with k_c = 0.01 per minute and drainage k_d = 1 per minute: what fraction (%) enters the eye?', answer: 0.99, unit: '%', why: '0.01/(0.01 + 1) = 0.0099 = 0.99 %.' },
    { q: 'A drop with a tonicity of 1.5 % NaCl equivalent will be too hypertonic for the eye to tolerate.', a: false, why: 'The eye tolerates roughly 0.6–2 % NaCl equivalent, especially as the tears quickly dilute the drop.' },
    { q: 'Why can a stinging eye drop deliver less drug?', choices: ['stinging destroys the drug', 'it triggers reflex tearing, which washes the drug out faster', 'it closes the pupil', 'it makes the cornea thicker'], a: 1, why: 'Reflex tearing raises the drainage rate constant, and the fraction absorbed, k_c/(k_c + k_d), falls.' },
    { q: 'What problem does benzalkonium chloride cause with long-term use?', choices: ['it makes drops hypotonic', 'it damages the corneal surface and tear film', 'it discolours the iris', 'it raises the pH of the tears'], a: 1, why: 'Its detergent action, which kills microbes, also harms epithelial cells and disrupts the tear film — a problem for people using drops for years.' }
  ],
  problems: [
    { q: 'The tear film drains with k_d = 0.8 per minute. How long does it take for 90 % of an instilled drug to be washed out?', answer: 2.88, unit: 'min', tol: 0.02, steps: ['$0.1 = e^{-0.8 t}$.', '$t = \\ln 10/0.8 = 2.303/0.8 = 2.88$ min.'] },
    { q: 'A 25 µL drop at 250 mOsm/kg mixes with 7 µL of dry-eye tears at 330 mOsm/kg. What is the osmolality of the mixture?', answer: 267.5, unit: 'mOsm/kg', tol: 0.01, steps: ['$(25 \\times 250 + 7 \\times 330)/32 = (6250 + 2310)/32$.', '$= 8560/32 = 267.5$ mOsm/kg — a hypotonic artificial tear pulls the tear film down towards normal.'] }
  ],
  applications: ['Glaucoma drops used for decades, where preservative-free forms protect the eye surface.', 'Antibiotic and anti-inflammatory drops after cataract surgery, and gels and ointments for longer contact.', 'Intravitreal injections of antibodies for macular degeneration, made to strict limits on particles and endotoxin.', 'Artificial tears for dry eye, often slightly hypotonic and preserved gently or not at all.'],
  history: 'Belladonna extracts were dropped into the eye to widen the pupil in antiquity and the Renaissance. Modern ophthalmic formulation grew from the 1950s, when outbreaks of eye infections from contaminated drops, especially with Pseudomonas, led pharmacopoeias to require that all eye preparations be sterile.',
  sim: 'ster-eye'
}

);
