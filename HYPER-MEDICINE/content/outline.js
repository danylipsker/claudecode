/* HYPER-MEDICINE · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold
 * (a planned concept never takes the id of a branch or topic — the validator checks).
 *
 * Hyper Medicine is the human body in health and disease for everyone: how each system
 * works, what goes wrong and why, how illness is diagnosed and treated, how to read the
 * evidence, how to stay well, and what to do in an emergency. It explains; it does not
 * diagnose or prescribe. The physics underneath (pressure, flow, sound, imaging) is
 * linked as physics:<id>, the chemistry (acids, buffers, molecules) as chemistry:<id>,
 * the mathematics (exponentials, probability, statistics) as math:<id>.
 */
Hyper.add(
  {
    id: 'medicine', kind: 'root', title: 'Hyper Medicine',
    short: 'The human body in health and disease: how every system works, what goes wrong and why, how illness is found and treated, how to read the evidence, how to stay well — and what to do when every minute counts.',
    links: [['Body map', '#/tools/body', 'body'], ['Medical calculators', '#/tools/clinical', 'calc']],
    body: 'Medicine is the body understood as a working machine — pumps, filters, wires, signals and repairs — and the thousand ways it can go wrong. Knowing how it works makes symptoms less mysterious, conversations with doctors more useful, and health news easier to judge. Start from any organ on the body map, follow the connections between systems, and use the calculators to see how blood pressure, kidney function or a test result are worked out.\n\n> [!warn] Hyper Medicine is for learning. It is not a diagnosis, a treatment plan or a substitute for a doctor, nurse or pharmacist who knows you. **In an emergency, call your local emergency number** (112 in Europe and many other countries, 911 in North America, 999 in the UK, 101 in Israel for ambulance).'
  },

  /* ================================================================ FOUNDATIONS */
  {
    id: 'body-foundations', kind: 'branch', parent: 'medicine', title: 'How the Body Works', icon: 'cell', hue: 28,
    short: 'Cells, membranes and tissues, the genes that build them, and the balancing act — water, salts, acidity, temperature and energy — that keeps the body alive.',
    body: 'About thirty trillion cells make up a human body, each a tiny factory wrapped in a membrane that decides what gets in and out. Cells group into tissues and organs, and together they keep the inside of the body remarkably constant while the outside changes: the same temperature, the same saltiness, the same acidity, the same supply of fuel. That constancy — homeostasis — is kept by feedback loops, and nearly every disease is, at heart, a feedback loop that has failed or been overwhelmed.'
  },
  { id: 'cells-tissues', kind: 'topic', parent: 'body-foundations', title: 'Cells and tissues', short: 'The cell, transport across membranes, the membrane potential, tissues and organs, and DNA.',
    plan: [['cell-structure', 'The cell'], ['membrane-transport', 'Moving across membranes'], ['membrane-potential', 'The membrane potential'], ['tissue-types', 'Tissues and organs'], ['dna-genes', 'DNA, genes and inheritance']] },
  { id: 'homeostasis', kind: 'topic', parent: 'body-foundations', title: 'Homeostasis', short: 'Feedback, body water, electrolytes, acid–base balance, temperature and energy.',
    plan: [['homeostasis-feedback', 'Homeostasis and feedback'], ['body-fluids', 'Body water and fluid compartments'], ['electrolytes', 'Electrolytes'], ['acid-base-balance', 'Acid–base balance'],
           ['thermoregulation', 'Body temperature and fever'], ['metabolism-energy', 'Metabolism and energy']] },

  /* ================================================================ HEART */
  {
    id: 'cardiovascular', kind: 'branch', parent: 'medicine', title: 'Heart and Circulation', icon: 'heart', hue: 352,
    short: 'The heart as a pump, its electrical system and the ECG, blood pressure and flow — and the diseases that remain the world\'s leading cause of death.',
    body: 'The heart beats about a hundred thousand times a day, pushing five litres of blood a minute through a hundred thousand kilometres of vessels. Its rhythm is set by its own electrical system, which the ECG reads from the skin; its output is set by the rate and the stroke; the pressure it creates is what carries oxygen to every cell. When arteries stiffen and clog, when the rhythm falters or the muscle weakens, the result — heart attack, stroke, heart failure — is still the commonest way people die, and much of it is preventable.'
  },
  { id: 'heart', kind: 'topic', parent: 'cardiovascular', title: 'The heart', short: 'Chambers and valves, the cardiac cycle, the ECG and cardiac output.',
    plan: [['heart-anatomy', 'The heart and its chambers'], ['cardiac-cycle', 'The cardiac cycle'], ['ecg', 'The electrocardiogram (ECG)'], ['cardiac-output', 'Cardiac output']] },
  { id: 'circulation', kind: 'topic', parent: 'cardiovascular', title: 'Blood vessels and pressure', short: 'Arteries, veins and capillaries, blood pressure, and flow and resistance.',
    plan: [['blood-vessels', 'Arteries, veins and capillaries'], ['blood-pressure', 'Blood pressure'], ['hemodynamics', 'Blood flow and resistance']] },
  { id: 'heart-disease', kind: 'topic', parent: 'cardiovascular', title: 'Heart and vessel disease', short: 'High blood pressure, atherosclerosis, heart attack, heart failure, arrhythmias and cholesterol.',
    plan: [['hypertension', 'High blood pressure'], ['atherosclerosis', 'Atherosclerosis and coronary artery disease'], ['heart-attack', 'Heart attack'], ['heart-failure', 'Heart failure'],
           ['arrhythmias', 'Arrhythmias and atrial fibrillation'], ['cholesterol-lipids', 'Cholesterol and lipids']] },

  /* ================================================================ LUNGS */
  {
    id: 'respiratory', kind: 'branch', parent: 'medicine', title: 'Lungs and Breathing', icon: 'lungs', hue: 198,
    short: 'How air gets in and out, how oxygen crosses into the blood and rides on haemoglobin, how breathing is controlled — and asthma, COPD, pneumonia and clots in the lung.',
    body: 'Every minute you move about six litres of air in and out, and across a membrane thinner than a soap bubble — spread over an area the size of a small flat — oxygen passes into the blood while carbon dioxide leaves. Haemoglobin picks the oxygen up where it is plentiful and lets it go where it is needed, guided by an S-shaped curve that shifts with acidity and temperature. Breathing is driven not by a lack of oxygen but by a rise in carbon dioxide. When airways narrow, alveoli fill or blood cannot reach them, the gas exchange fails, and the measurements on these pages show how.'
  },
  { id: 'breathing', kind: 'topic', parent: 'respiratory', title: 'How breathing works', short: 'The airways, the mechanics of breathing, gas exchange, oxygen transport, control and lung function tests.',
    plan: [['respiratory-system', 'The respiratory system'], ['ventilation', 'The mechanics of breathing'], ['gas-exchange', 'Gas exchange'], ['oxygen-transport', 'Oxygen transport and haemoglobin'],
           ['control-of-breathing', 'The control of breathing'], ['lung-function-tests', 'Spirometry and lung function']] },
  { id: 'lung-disease', kind: 'topic', parent: 'respiratory', title: 'Lung disease', short: 'Asthma, COPD, pneumonia, pulmonary embolism and sleep apnoea.',
    plan: [['asthma', 'Asthma'], ['copd', 'COPD'], ['pneumonia', 'Pneumonia'], ['pulmonary-embolism', 'Pulmonary embolism'], ['sleep-apnea', 'Sleep apnoea']] },

  /* ================================================================ BLOOD AND IMMUNITY */
  {
    id: 'blood-immunity', kind: 'branch', parent: 'medicine', title: 'Blood and Immunity', icon: 'blood', hue: 8,
    short: 'What blood is made of, anaemia, blood groups and clotting — and the immune system that recognises friend from foe, remembers, and sometimes attacks the body itself.',
    body: 'Blood is a tissue that flows: red cells carrying oxygen, white cells hunting invaders, platelets and proteins ready to plug any leak, all suspended in salty plasma. The immune system is spread through it and through every tissue, with fast, general defences that act within minutes and slow, precise ones that learn a specific enemy and remember it for decades — the memory vaccines exploit. When the balance tips, the same machinery causes allergy, autoimmune disease or, when it is too weak, infections that should have been trivial.'
  },
  { id: 'blood', kind: 'topic', parent: 'blood-immunity', title: 'Blood', short: 'Blood\'s parts, anaemia, blood groups and transfusion, and clotting.',
    plan: [['blood-composition', 'What blood is made of'], ['anemia', 'Anaemia'], ['blood-groups', 'Blood groups and transfusion'], ['hemostasis', 'Clotting and bleeding']] },
  { id: 'immunity', kind: 'topic', parent: 'blood-immunity', title: 'The immune system', short: 'Innate and adaptive immunity, antibodies, allergy, autoimmunity and immunodeficiency.',
    plan: [['innate-immunity', 'Innate immunity and inflammation'], ['adaptive-immunity', 'Adaptive immunity: T and B cells'], ['antibodies', 'Antibodies'], ['allergy', 'Allergy'],
           ['autoimmunity', 'Autoimmune disease'], ['immunodeficiency', 'Immunodeficiency']] },

  /* ================================================================ KIDNEYS */
  {
    id: 'kidneys-urinary', kind: 'branch', parent: 'medicine', title: 'Kidneys and Urinary System', icon: 'kidney', hue: 36,
    short: 'The body\'s filter and chemist: how the kidneys clean the blood and balance water and salts, how their function is measured, and what happens when they fail.',
    body: 'Two fist-sized kidneys filter the entire blood plasma about sixty times a day — around 180 litres — and then take almost all of it back, keeping exactly what the body needs and letting the rest go as a litre or two of urine. In doing so they set the body\'s water, sodium, potassium and acidity, help control blood pressure, and make hormones for red cells and bones. Because kidney disease is silent until late, blood and urine tests — creatinine, the estimated GFR, albumin in the urine — are the way it is found, and these pages show how they work.'
  },
  { id: 'kidney-function', kind: 'topic', parent: 'kidneys-urinary', title: 'How the kidneys work', short: 'The nephron, filtration and GFR, reabsorption and secretion, concentrating urine, and kidney tests.',
    plan: [['kidney-anatomy', 'The kidney and the nephron'], ['glomerular-filtration', 'Filtration and GFR'], ['tubular-function', 'Reabsorption and secretion'], ['urine-concentration', 'Concentrating urine'], ['kidney-tests', 'Kidney function tests']] },
  { id: 'kidney-disease', kind: 'topic', parent: 'kidneys-urinary', title: 'Kidney and urinary disease', short: 'Acute kidney injury, chronic kidney disease, dialysis and transplantation, stones and infections.',
    plan: [['acute-kidney-injury', 'Acute kidney injury'], ['chronic-kidney-disease', 'Chronic kidney disease'], ['dialysis-transplant', 'Dialysis and transplantation'], ['kidney-stones', 'Kidney stones'], ['uti', 'Urinary tract infections']] },

  /* ================================================================ DIGESTION */
  {
    id: 'digestive', kind: 'branch', parent: 'medicine', title: 'Digestion, Liver and Nutrition', icon: 'stomach', hue: 42,
    short: 'How food becomes fuel and building blocks, the liver\'s hundreds of jobs, the gut\'s trillions of microbes, what a healthy diet contains — and the diseases of the gut and liver.',
    body: 'The gut is a nine-metre tube that breaks food into molecules small enough to cross its lining, with help from acid, enzymes, bile and a vast community of microbes. What it absorbs goes first to the liver, the body\'s chemical plant, which stores fuel, builds proteins, makes bile and neutralises poisons. Nutrition decides what the whole body has to work with: energy, protein, fats, vitamins and minerals, in the right amounts. When the balance of energy tips over years, weight follows; when the lining or the liver is injured, reflux, ulcers, inflammatory bowel disease and cirrhosis can result.'
  },
  { id: 'digestion', kind: 'topic', parent: 'digestive', title: 'Digestion', short: 'The digestive tract, digestion and absorption, the liver and the gut microbiome.',
    plan: [['digestive-system', 'The digestive system'], ['digestion-absorption', 'Digestion and absorption'], ['liver-function', 'The liver'], ['gut-microbiome', 'The gut microbiome']] },
  { id: 'nutrition', kind: 'topic', parent: 'digestive', title: 'Nutrition', short: 'Macronutrients, vitamins and minerals, energy balance and obesity.',
    plan: [['macronutrients', 'Carbohydrates, fats and proteins'], ['vitamins-minerals', 'Vitamins and minerals'], ['energy-balance', 'Energy balance and body weight'], ['obesity', 'Obesity']] },
  { id: 'digestive-disease', kind: 'topic', parent: 'digestive', title: 'Digestive disease', short: 'Reflux and ulcers, inflammatory bowel disease, liver disease and coeliac disease.',
    plan: [['reflux-ulcers', 'Reflux and peptic ulcers'], ['ibd', 'Inflammatory bowel disease'], ['liver-disease', 'Hepatitis, fatty liver and cirrhosis'], ['celiac-disease', 'Coeliac disease and food intolerance']] },

  /* ================================================================ HORMONES */
  {
    id: 'endocrine', kind: 'branch', parent: 'medicine', title: 'Hormones and Metabolism', icon: 'gland', hue: 272,
    short: 'The body\'s slow messaging system: feedback loops of hormones, the thyroid, stress hormones, sex hormones and bone — and insulin, glucose and diabetes.',
    body: 'Hormones are chemical messages carried in the blood, sent by glands and read by cells that carry the right receptor. Most are held in check by negative feedback, like a thermostat, which is why both too much and too little of a hormone cause disease and why doctors often measure a hormone together with the one that controls it. Insulin is the best-known: it lets cells take up glucose after a meal, and diabetes — its absence or the body\'s resistance to it — now affects roughly one adult in ten worldwide.'
  },
  { id: 'hormones', kind: 'topic', parent: 'endocrine', title: 'Hormones', short: 'The endocrine system, feedback, thyroid, adrenals and stress, sex hormones, and bone.',
    plan: [['endocrine-system', 'The endocrine system'], ['hormone-feedback', 'Hormone feedback loops'], ['thyroid', 'The thyroid'], ['adrenal-stress', 'The adrenal glands and stress'],
           ['reproductive-hormones', 'Sex hormones and the menstrual cycle'], ['bone-calcium', 'Bone, calcium and osteoporosis']] },
  { id: 'diabetes', kind: 'topic', parent: 'endocrine', title: 'Glucose and diabetes', short: 'Insulin and glucose control, type 1 and type 2 diabetes, hypoglycaemia and the metabolic syndrome.',
    plan: [['glucose-regulation', 'Insulin and glucose regulation'], ['type1-diabetes', 'Type 1 diabetes'], ['type2-diabetes', 'Type 2 diabetes'], ['hypoglycemia', 'Hypoglycaemia'], ['metabolic-syndrome', 'Metabolic syndrome']] },

  /* ================================================================ BRAIN */
  {
    id: 'nervous-system', kind: 'branch', parent: 'medicine', title: 'Brain and Nerves', icon: 'brainwave', hue: 250,
    short: 'Nerve cells and the electrical impulse, synapses and their chemicals, the brain and the senses, sleep and pain — and stroke, epilepsy, dementia, Parkinson\'s and more.',
    body: 'Some eighty-six billion neurons, each wired to thousands of others, make up the brain. They signal with brief electrical impulses — action potentials — that travel along their fibres and pass to the next cell as chemical messengers across synapses. From that simple unit come movement, sensation, memory and thought. The pages here build from the neuron to the brain\'s regions, the senses, sleep and pain, and then to the diseases where the wiring fails: a blocked artery in a stroke, an electrical storm in epilepsy, the slow loss of cells in dementia and Parkinson\'s disease.'
  },
  { id: 'nerve-cells', kind: 'topic', parent: 'nervous-system', title: 'Nerve cells', short: 'Neurons, the action potential, and synapses and neurotransmitters.',
    plan: [['neurons', 'Neurons'], ['action-potential', 'The action potential'], ['synapses', 'Synapses and neurotransmitters']] },
  { id: 'brain-senses', kind: 'topic', parent: 'nervous-system', title: 'The brain and the senses', short: 'The nervous system, the brain\'s regions, vision, hearing and balance, sleep and pain.',
    plan: [['nervous-system-organization', 'The nervous system'], ['brain-regions', 'The brain'], ['vision', 'Vision'], ['hearing-balance', 'Hearing and balance'], ['sleep', 'Sleep'], ['pain', 'Pain']] },
  { id: 'neuro-disease', kind: 'topic', parent: 'nervous-system', title: 'Neurological disease', short: 'Stroke, epilepsy, dementia, Parkinson\'s disease, headache and multiple sclerosis.',
    plan: [['stroke', 'Stroke'], ['epilepsy', 'Epilepsy'], ['dementia', 'Dementia and Alzheimer\'s disease'], ['parkinsons', 'Parkinson\'s disease'], ['headache-migraine', 'Headache and migraine'], ['multiple-sclerosis', 'Multiple sclerosis']] },

  /* ================================================================ MENTAL HEALTH */
  {
    id: 'mental-health', kind: 'branch', parent: 'medicine', title: 'Mind and Mental Health', icon: 'smile', hue: 300,
    short: 'What mental health is, stress and coping, the common mental disorders — depression, anxiety, bipolar disorder, psychosis, trauma, eating disorders, addiction — and how help works.',
    body: 'About one person in eight lives with a mental disorder at any time, and most people will face one, or be close to someone who does, in their lifetime. Mental illnesses are illnesses: they have causes in biology, experience and circumstance, recognisable patterns, and treatments that work for most people. These pages describe the common conditions without jargon or stigma, explain how talking therapies and medicines help, and say clearly when and how to seek help — including in a crisis.'
  },
  { id: 'wellbeing', kind: 'topic', parent: 'mental-health', title: 'Wellbeing and stress', short: 'What mental health is, and stress and coping.',
    plan: [['mental-health-basics', 'What mental health is'], ['stress-coping', 'Stress and coping']] },
  { id: 'mental-disorders', kind: 'topic', parent: 'mental-health', title: 'Mental disorders', short: 'Depression, anxiety, bipolar disorder, psychosis, trauma, eating disorders and addiction.',
    plan: [['depression', 'Depression'], ['anxiety-disorders', 'Anxiety disorders'], ['bipolar-disorder', 'Bipolar disorder'], ['psychosis', 'Schizophrenia and psychosis'],
           ['ptsd', 'Trauma and PTSD'], ['eating-disorders', 'Eating disorders'], ['addiction', 'Addiction']] },
  { id: 'mental-care', kind: 'topic', parent: 'mental-health', title: 'Getting help', short: 'Suicide warning signs and prevention, and how treatment works.',
    plan: [['suicide-prevention', 'Suicide: warning signs and how to help'], ['mental-health-treatment', 'Psychotherapy and psychiatric medicines']] },

  /* ================================================================ INFECTION */
  {
    id: 'infection', kind: 'branch', parent: 'medicine', title: 'Infection and Infectious Disease', icon: 'virus', hue: 140,
    short: 'Bacteria, viruses, fungi and parasites; how infections spread and are stopped; antibiotics and resistance; vaccines — and the great infectious diseases, from flu to malaria and sepsis.',
    body: 'Microbes outnumber the body\'s own cells and most are harmless or helpful, but a few can invade, multiply and make us ill. How an infection spreads — through the air, by touch, in food and water, by insects or blood — decides how it is stopped. Antibiotics transformed medicine and are now threatened by resistance; vaccines prevent millions of deaths a year by training the immune system in advance. The diseases on these pages still shape the world, and the maths of epidemics explains why a small change in transmission can decide whether an outbreak fizzles or explodes.'
  },
  { id: 'microbes', kind: 'topic', parent: 'infection', title: 'Microbes and infection', short: 'The kinds of microbe, how infection spreads, antibiotics, resistance and vaccines.',
    plan: [['microbes-types', 'Bacteria, viruses, fungi and parasites'], ['infection-spread', 'How infections spread'], ['antibiotics', 'Antibiotics'], ['antimicrobial-resistance', 'Antimicrobial resistance'], ['vaccines', 'Vaccines and how they work']] },
  { id: 'infectious-diseases', kind: 'topic', parent: 'infection', title: 'Infectious diseases', short: 'Influenza and COVID-19, HIV, tuberculosis, malaria, sepsis, and epidemics.',
    plan: [['influenza-covid', 'Influenza and COVID-19'], ['hiv', 'HIV and AIDS'], ['tuberculosis', 'Tuberculosis'], ['malaria', 'Malaria'], ['sepsis', 'Sepsis'], ['epidemics', 'Epidemics and pandemics']] },

  /* ================================================================ CANCER */
  {
    id: 'oncology', kind: 'branch', parent: 'medicine', title: 'Cancer', icon: 'ribbon', hue: 322,
    short: 'What cancer is at the level of genes and cells, how tumours grow and spread, how screening and staging work, how cancer is treated today — and what prevents it.',
    body: 'Cancer is not one disease but hundreds, united by one idea: cells whose genes have been damaged so that they grow when they should not, ignore the signals to stop and die, and eventually invade other tissues. It is mostly a disease of age, because the mutations accumulate, and many are made likelier by tobacco, alcohol, infections, sunlight and excess weight. Survival has risen steadily, thanks to earlier detection and treatments that range from surgery and radiation to drugs aimed at a tumour\'s particular mutations and therapies that unleash the immune system.'
  },
  { id: 'cancer-biology', kind: 'topic', parent: 'oncology', title: 'What cancer is', short: 'Cancer, its genes, tumour growth and metastasis.',
    plan: [['what-is-cancer', 'What cancer is'], ['cancer-genetics', 'Genes and cancer'], ['tumour-growth', 'Tumour growth'], ['metastasis', 'Metastasis']] },
  { id: 'cancer-care', kind: 'topic', parent: 'oncology', title: 'Finding and treating cancer', short: 'Screening, diagnosis and staging, treatments, immunotherapy, the common cancers and prevention.',
    plan: [['cancer-screening', 'Cancer screening'], ['cancer-staging', 'Diagnosis and staging'], ['cancer-treatment', 'Surgery, chemotherapy and radiotherapy'], ['immunotherapy', 'Immunotherapy and targeted therapy'],
           ['common-cancers', 'The common cancers'], ['cancer-prevention', 'Preventing cancer']] },

  /* ================================================================ MEDICINES */
  {
    id: 'medicines', kind: 'branch', parent: 'medicine', title: 'Medicines and Treatment', icon: 'pill', hue: 210,
    short: 'How medicines act on the body and the body on them: receptors, absorption and elimination, half-life and dosing, dose and response, side effects, clinical trials, pain relief and anaesthesia.',
    body: 'A medicine is a molecule that fits a target — a receptor, an enzyme, a channel — and changes what it does. Whether it works depends on getting enough of it to the target for long enough, which is the story of absorption, distribution, metabolism and elimination; the half-life sets how often it must be taken. Every effective medicine can also cause harm, which is why doses are chosen carefully and why new medicines are tested in stages before and after they are approved. These pages explain the principles; they are not dosing instructions.'
  },
  { id: 'pharmacology', kind: 'topic', parent: 'medicines', title: 'How medicines work', short: 'Receptors, pharmacokinetics, half-life and dosing, dose–response, side effects, trials, pain relief and anaesthesia.',
    plan: [['how-drugs-work', 'How medicines work'], ['pharmacokinetics', 'What the body does to a medicine'], ['half-life-dosing', 'Half-life and dosing'], ['dose-response', 'Dose, response and safety'],
           ['side-effects-interactions', 'Side effects and interactions'], ['clinical-trials', 'How medicines are tested'], ['pain-relief', 'Pain relief'], ['anaesthesia-surgery', 'Anaesthesia and surgery']] },

  /* ================================================================ DIAGNOSIS */
  {
    id: 'diagnosis', kind: 'branch', parent: 'medicine', title: 'Diagnosis and Evidence', icon: 'stethoscope', hue: 186,
    short: 'How illness is recognised — vital signs, history and examination, blood tests and imaging — and how to reason with uncertain results and read medical evidence without being misled.',
    body: 'Most diagnoses are made from the patient\'s own story, confirmed by examination and a few well-chosen tests. But every test can be wrong, and whether a result is believable depends as much on how likely the disease was beforehand as on the test itself — which is why a positive screening test for a rare disease is usually a false alarm. The same clear thinking is needed to read research and health news: absolute and relative risks, the difference between an association and a cause, and why randomised trials sit at the top of the evidence.'
  },
  { id: 'clinical-assessment', kind: 'topic', parent: 'diagnosis', title: 'Examining a patient', short: 'Vital signs, history and examination, blood tests and imaging.',
    plan: [['vital-signs', 'Vital signs'], ['history-examination', 'History and examination'], ['lab-tests', 'Blood tests and reference ranges'], ['medical-imaging', 'Medical imaging']] },
  { id: 'evidence', kind: 'topic', parent: 'diagnosis', title: 'Evidence and uncertainty', short: 'Sensitivity and specificity, Bayes after a test, screening, evidence-based medicine, risk and health news.',
    plan: [['diagnostic-accuracy', 'Sensitivity and specificity'], ['bayes-diagnosis', 'Probability after a test result'], ['screening-harms', 'Screening: benefits and harms'], ['evidence-based-medicine', 'Evidence-based medicine'],
           ['risk-communication', 'Relative and absolute risk'], ['reading-health-news', 'Reading health news']] },

  /* ================================================================ PREVENTION AND LIFE STAGES */
  {
    id: 'prevention-life', kind: 'branch', parent: 'medicine', title: 'Prevention and Life Stages', icon: 'family', hue: 108,
    short: 'What keeps people healthy — activity, diet, not smoking, less alcohol — how public health measures disease across whole populations, and the body through pregnancy, childhood and ageing.',
    body: 'Most of the gain in life expectancy over the last two centuries came from prevention: clean water, better food, vaccines and the retreat of tobacco. For an individual, the biggest levers are still simple — moving more, eating mostly plants and whole foods, not smoking, drinking little, sleeping enough — and their effects are large enough to measure in years. Epidemiology is the science that finds these effects across populations. The last pages follow the body through the stages of life, from pregnancy and birth to growth, menopause and ageing.'
  },
  { id: 'lifestyle', kind: 'topic', parent: 'prevention-life', title: 'Healthy living', short: 'Physical activity, a healthy diet, smoking and alcohol.',
    plan: [['physical-activity', 'Physical activity'], ['healthy-diet', 'A healthy diet'], ['smoking', 'Smoking and tobacco'], ['alcohol', 'Alcohol']] },
  { id: 'public-health', kind: 'topic', parent: 'prevention-life', title: 'Public health', short: 'Epidemiology, life expectancy and the burden of disease, and environmental health.',
    plan: [['epidemiology', 'Epidemiology'], ['life-expectancy', 'Life expectancy and the burden of disease'], ['environmental-health', 'Air, water and environmental health']] },
  { id: 'life-stages', kind: 'topic', parent: 'prevention-life', title: 'Life stages', short: 'Pregnancy, birth and the newborn, child growth, menopause and ageing.',
    plan: [['pregnancy', 'Pregnancy'], ['birth-newborn', 'Birth and the newborn'], ['child-growth', 'Child growth and development'], ['menopause', 'Menopause'], ['ageing', 'Ageing']] },

  /* ================================================================ EMERGENCIES */
  {
    id: 'emergencies', kind: 'branch', parent: 'medicine', title: 'Emergencies and First Aid', icon: 'firstaid', hue: 4,
    short: 'What to do in the first minutes: calling for help, CPR and the defibrillator, choking, bleeding, burns, recognising a heart attack or stroke, severe allergy, poisoning, injuries, heat and cold.',
    body: 'In a cardiac arrest, a severe bleed or choking, the minutes before professional help arrives decide the outcome, and the person who can help is usually a bystander. The actions are simple and can be learned in an afternoon: make the scene safe, call for help, start chest compressions, use a defibrillator, press on a bleed, clear an airway. These pages explain what to do and why it works, following the international resuscitation guidelines. Reading them is a good start; a hands-on first-aid course is better.'
  },
  { id: 'first-aid', kind: 'topic', parent: 'emergencies', title: 'First aid', short: 'The first minutes, CPR and the AED, choking, bleeding and shock, burns, heart attack and stroke, anaphylaxis, poisoning, injuries, heat and cold.',
    plan: [['first-aid-basics', 'First aid: the first minutes'], ['cpr', 'CPR and defibrillation'], ['choking', 'Choking'], ['bleeding-shock', 'Bleeding and shock'], ['burns', 'Burns'],
           ['recognising-emergencies', 'Recognising a heart attack or a stroke'], ['anaphylaxis', 'Anaphylaxis: a severe allergic reaction'], ['poisoning-overdose', 'Poisoning and overdose'],
           ['injuries-fractures', 'Sprains, fractures and head injuries'], ['heat-cold', 'Heatstroke and hypothermia']] }
);
