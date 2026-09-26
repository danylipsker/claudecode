/* HYPER-MEDICINE · content/hormones.js — the topic "Hormones": the endocrine system,
 * feedback loops, the thyroid, the adrenal glands and stress, sex hormones and the
 * menstrual cycle, and bone, calcium and osteoporosis. Simulations in sims/endocrine.js. */
Hyper.add(

/* ================================================================ the endocrine system */
{
  id: 'endocrine-system', parent: 'hormones', title: 'The endocrine system', level: 1,
  short: 'The glands and organs that send hormones — chemical messages carried in the blood to every cell that has the matching receptor. Slower than nerves but longer-lasting, they set growth, energy use, salt and water, the response to stress and reproduction.',
  keywords: ['endocrine system', 'hormone', 'gland', 'receptor', 'pituitary', 'hypothalamus', 'steroid hormone', 'peptide hormone', 'half-life', 'endocrinology', 'biotin interference'],
  prereq: ['homeostasis-feedback', 'cell-structure', 'membrane-transport'],
  related: ['hormone-feedback', 'thyroid', 'adrenal-stress', 'glucose-regulation', 'reproductive-hormones', 'half-life-dosing', 'chemistry:lipids', 'chemistry:amino-acids-proteins'],
  body: `
A car pulls out in front of you. Within two or three seconds your heart is pounding, your mouth is dry and your hands shake. Weeks after starting a daily thyroid tablet, a woman notices that she no longer feels cold all the time. Both changes are the work of **hormones**: chemical messages released into the blood by one tissue and read by cells far away. Adrenaline acted in seconds and will be gone in minutes; the thyroid hormone took weeks to build up and will act for weeks more.

The nervous system is the body's telephone network — fast, wired, point to point. The endocrine system is its broadcasting service: a hormone reaches every cell the blood reaches, but only cells that carry its **receptor** listen. That is why one hormone can have many effects (cortisol acts on liver, muscle, bone, immune cells and brain) and why a disorder of a single gland can cause symptoms all over the body.

### The glands and what they send

| Gland | Main hormones | What they do |
|---|---|---|
| Hypothalamus (brain) | releasing hormones (TRH, CRH, GnRH, GHRH), ADH | control the pituitary; ADH keeps water |
| Pituitary | TSH, ACTH, LH, FSH, growth hormone, prolactin, oxytocin | drive other glands, growth, milk, labour |
| Thyroid | thyroxine (T4), T3 | set the metabolic pace |
| Parathyroids (four) | parathyroid hormone (PTH) | hold blood calcium steady |
| Adrenal cortex | cortisol, aldosterone | stress, glucose, salt and blood pressure |
| Adrenal medulla | adrenaline, noradrenaline | the fight-or-flight response |
| Pancreatic islets | insulin, glucagon | blood glucose |
| Ovaries and testes | oestradiol, progesterone, testosterone | puberty, fertility, bone |

Many organs have a second, endocrine job: the kidneys make renin, erythropoietin and active vitamin D; the heart releases natriuretic peptides when stretched; the gut sends GLP-1 and ghrelin; fat tissue makes leptin; the placenta makes hCG, the hormone pregnancy tests detect.

### Three chemical families
- **Peptides and proteins** (insulin, glucagon, growth hormone, ADH) dissolve in blood but cannot cross the fatty cell membrane. They bind receptors on the surface, which trigger signalling cascades inside: effects in seconds to minutes. Digestion breaks them down, which is why insulin is injected rather than swallowed.
- **Steroids** (cortisol, aldosterone, oestradiol, progesterone, testosterone) are made from cholesterol — [[chemistry:lipids|lipids]]. They ride on carrier proteins, slip through the membrane and bind receptors inside the cell that switch genes on or off. New proteins take hours to make, so their effects are slower and longer-lasting; they work as tablets, gels and patches.
- **Amines**, made from single amino acids: adrenaline behaves like a peptide, while thyroid hormones enter cells and act on genes like steroids.

### Tiny amounts, long or short lives
Hormones work at astonishingly low concentrations. Free T4 circulates at about 15 pmol/L — roughly 30 milligrams, less than a pinch of salt, dissolved in an Olympic swimming pool. Receptors and signalling cascades amplify the signal enormously.

How long a hormone lasts is set by its **half-life**, the time for half of it to be cleared:
$$f = \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}$$
Adrenaline lasts about 2 minutes, insulin about 5, cortisol about 1–1.5 hours and T4 about 7 days. A short half-life allows fine, minute-to-minute control; a long one gives stability — and means that after a change in a daily thyroxine tablet, the level takes about five half-lives, five to six weeks, to settle.

### Measuring hormones
Levels swing with pulses, sleep and the time of day, so the timing of a blood test matters (cortisol and testosterone are measured in the morning). Many hormones are mostly bound to proteins, and only the free fraction acts, so pregnancy or an oestrogen-containing pill can raise *total* thyroxine without changing the free level. And high-dose **biotin** supplements, sold for hair and nails, can make many hormone tests read falsely high or low — tell the doctor or laboratory before a test.

### When it goes wrong
Endocrine disease comes in four patterns: **too much** hormone (an overactive or tumorous gland), **too little** (a gland destroyed, often by the immune system — as in [[type1-diabetes|type 1 diabetes]]), **resistance** (normal hormone, poor response — the heart of [[type2-diabetes|type 2 diabetes]]) and hormones made in the **wrong place**, by tumours. Most are diagnosed by blood tests read in pairs, which is the subject of [[hormone-feedback|feedback loops]].
`,
  ideas: [
    'A hormone is a chemical message in the blood; only cells with its receptor respond, but those may be in many organs.',
    'Peptide hormones act on surface receptors within seconds; steroid and thyroid hormones change which genes are read, over hours to days.',
    'The half-life sets how quickly a hormone level can change: minutes for adrenaline and insulin, a week for thyroxine.',
    'Endocrine disease is too much, too little, resistance, or hormone made in the wrong place.',
    'Hormone tests depend on timing, on binding proteins and on interference such as biotin.'
  ],
  pitfalls: [
    'A hormone acts on just one organ — It acts on every cell carrying its receptor. Cortisol and thyroid hormone reach almost every tissue, which is why their disorders cause such a spread of symptoms.',
    'A normal hormone level means the gland is fine — Many glands are judged against the hormone that drives them: a "normal" free T4 with a raised TSH already shows a thyroid that needs extra push.',
    'More hormone is better, so "boosting" it is harmless — Extra hormone switches off the body\'s own production through feedback and carries its own harms, from heart rhythm problems with too much thyroxine to infertility with testosterone.'
  ],
  formulas: [
    {
      name: 'How much hormone is left: the half-life',
      expr: 'f = 0.5^(t/th)', tex: 'f = \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}',
      vars: {
        f: { name: 'fraction still in the blood', q: 'ratio', unit: '%' },
        t: { name: 'time since release stopped', q: 'time', unit: 'min', value: 20 },
        th: { name: 'half-life of the hormone', q: 'time', unit: 'min', value: 5, tex: 't_{1/2}' }
      },
      note: 'Clearance by the liver and kidneys usually follows this exponential pattern. Approximate half-lives: adrenaline 2 min, insulin 5 min, cortisol 60–90 min, T4 about 7 days.',
      practice: { unknowns: ['f', 'th'] },
      stories: {
        f: 'Insulin has a half-life of about {th}. What fraction of it is left in the blood {t} after the pancreas stops releasing it?',
        th: 'Measurements show that {f} of a hormone remains {t} after its release stopped. What is its half-life?'
      }
    },
    {
      name: 'Settling after a change: the approach to a steady level',
      expr: 'F = 1 - 0.5^(t/th)', tex: 'F = 1 - \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}',
      vars: {
        F: { name: 'fraction of the way to the new steady level', q: 'ratio', unit: '%' },
        t: { name: 'time since the change', q: 'time', unit: 'day', value: 42 },
        th: { name: 'half-life', q: 'time', unit: 'day', value: 7, tex: 't_{1/2}' }
      },
      note: 'After any sustained change in production or in a daily tablet, the level moves towards its new steady value by half the remaining gap every half-life: about 97 % of the way after five half-lives.',
      practice: { unknowns: ['F', 't'] },
      stories: {
        F: 'Thyroxine has a half-life of about {th}. A person\'s daily tablet is changed. How far has the blood level moved towards its new steady value after {t}?',
        t: 'Thyroxine has a half-life of {th}. How long after a change is the level {F} of the way to its new steady value?'
      }
    }
  ],
  examples: [
    {
      title: 'How fast insulin disappears',
      q: 'After a meal has been absorbed, the pancreas stops releasing extra insulin. With a half-life of about 5 minutes, how much of that insulin is left after 20 minutes?',
      steps: [
        '20 minutes is $20/5 = 4$ half-lives.',
        'Fraction left: $(1/2)^4 = 1/16 = 0.0625$, about 6 %.',
        'This rapid clearance is what lets insulin follow the glucose level almost minute by minute.'
      ],
      a: 'About 6 % remains after 20 minutes.'
    },
    {
      title: 'Why the thyroid test waits six weeks',
      q: 'A man\'s thyroxine tablet is increased. His doctor plans the next blood test in six weeks. Why not after two?',
      steps: [
        'T4 has a half-life of about 7 days. After 14 days (two half-lives) the level has moved $1 - (1/2)^2 = 75\\,\\%$ of the way to its new steady value.',
        'After 42 days (six half-lives): $1 - (1/2)^6 = 98.4\\,\\%$ of the way.',
        'TSH, which follows free T4 through the pituitary, lags further still. A test at two weeks would judge the new dose before it had fully acted.'
      ],
      a: 'At six weeks the level is about 98 % settled; at two weeks only 75 %. That is why thyroid tests are usually repeated 6–8 weeks after a change.'
    }
  ],
  quiz: [
    { q: 'Why can insulin not simply be swallowed as an ordinary tablet?', choices: ['It is a protein, and digestion breaks it down', 'It is too fat-soluble to dissolve', 'It acts only on the liver', 'Stomach acid turns it into glucagon'], a: 0,
      why: 'Insulin is a small protein. Digestive enzymes cut it into amino acids before it can be absorbed, so it is injected or infused under the skin.' },
    { q: 'Cortisol acts over hours, adrenaline within seconds. The main reason is that cortisol…', choices: ['travels more slowly in the blood', 'changes which genes are read, and making new proteins takes time', 'is released only at night', 'must first be converted by the liver'], a: 1,
      why: 'Steroid hormones enter cells and bind receptors that act on DNA. The response needs new proteins, which takes hours; adrenaline works through surface receptors and ready-made signalling.' },
    { q: 'A pregnant woman\'s total thyroxine is higher than before pregnancy. This proves that her thyroid is overactive.', a: false,
      why: 'Pregnancy (and oestrogen-containing pills) raise the protein that carries thyroxine, so total T4 rises while the free, active level can stay normal. Free T4 and TSH are what count.' },
    { q: 'Cortisol has a half-life of about 70 minutes. What percentage of a burst of cortisol remains 210 minutes later (with no new release)?', answer: 12.5,
      why: '210/70 = 3 half-lives, and (1/2)³ = 1/8 = 12.5 %.' },
    { q: 'Someone taking a high-dose biotin supplement for their hair gets a strange thyroid result. What is the most likely explanation?', choices: ['Biotin interferes with many hormone laboratory tests', 'Biotin damages the thyroid gland', 'Biotin contains iodine', 'Hair supplements contain thyroid hormone'], a: 0,
      why: 'Many hormone assays use a biotin–streptavidin step, and large amounts of biotin in the blood distort it. The result can be falsely high or low; the laboratory should be told.' }
  ],
  applications: ['Hormone blood tests, and why they are timed and read in pairs.', 'Replacing missing hormones: thyroxine, insulin, hydrocortisone.', 'Newborn heel-prick screening, which finds congenital hypothyroidism before it harms development.', 'Medicines that mimic or block hormones, from GLP-1 receptor agonists to anti-oestrogen treatment for breast cancer.'],
  history: 'In 1902 William Bayliss and Ernest Starling showed that the gut releases a substance, secretin, that makes the pancreas secrete — carried by the blood, not by nerves. In 1905 Starling named such messengers *hormones*, from the Greek for "to set in motion". The isolation of insulin in Toronto in 1921–22 turned type 1 diabetes from a death sentence into a condition people live with.',
  sim: 'endo-axis'
},

/* ================================================================ feedback loops */
{
  id: 'hormone-feedback', parent: 'hormones', title: 'Hormone feedback loops', level: 2,
  short: 'Most hormones switch off their own production once they have done their job — negative feedback, like a thermostat. Reading a hormone together with the one that drives it shows where a fault lies; a few loops run the other way on purpose.',
  keywords: ['negative feedback', 'positive feedback', 'hypothalamus', 'pituitary', 'axis', 'trophic hormone', 'TSH', 'ACTH', 'primary', 'secondary', 'steroid suppression', 'LH surge', 'adrenal crisis'],
  prereq: ['endocrine-system', 'homeostasis-feedback'],
  related: ['thyroid', 'adrenal-stress', 'reproductive-hormones', 'glucose-regulation', 'bone-calcium', 'lab-tests', 'math:logarithmic-scales'],
  body: `
Maria has taken a steroid tablet, prednisolone, for a year to keep her rheumatoid arthritis quiet. Her rheumatologist is firm: never stop it suddenly, and if she is ever badly ill, she must tell the doctors she takes it. The tablet is not addictive. The danger comes from **feedback**: for a year her pituitary gland has sensed plenty of cortisol-like hormone and has stopped telling her adrenal glands to make any. Her own cortisol production has been switched off, and it takes weeks to months to restart.

### The thermostat pattern
Most hormone systems work like a central-heating thermostat. A controller senses the level of the final product and adjusts production: too much, and it turns production down; too little, and it turns it up. Because the product opposes its own production, this is called **negative feedback** — "negative" means opposing change, not harmful. It is what keeps hormone levels within narrow limits for decades.

### The hypothalamus–pituitary axes
Five hormone chains run from the brain. The hypothalamus releases tiny amounts of a releasing hormone into local blood vessels; the pituitary answers with a **trophic** (gland-driving) hormone; the target gland makes the final hormone, which feeds back on both.

| Axis | Hypothalamus | Pituitary | Gland | Final hormone |
|---|---|---|---|---|
| Thyroid | TRH | TSH | thyroid | T4, T3 |
| Adrenal | CRH | ACTH | adrenal cortex | cortisol |
| Gonadal | GnRH | LH, FSH | ovaries, testes | oestradiol, progesterone, testosterone |
| Growth | GHRH (and somatostatin) | growth hormone | liver | IGF-1 |
| Milk | dopamine, which *holds back* | prolactin | breast | milk |

Other loops need no pituitary: glucose controls insulin and glucagon directly, calcium controls parathyroid hormone, and blood volume controls the renin–angiotensin–aldosterone system.

### Why feedback holds so steady
Suppose something would push a hormone level up by 30 % if nothing responded. A loop with a **gain** $G$ — how strongly the controller pushes back for a given error — leaves only
$$\\Delta X = \\frac{D}{1 + G}$$
of the disturbance $D$. With a gain of 9, a 30 % push leaves a 3 % change. The pituitary is a high-gain controller: TSH answers a small fall in free T4 with a large rise, which makes TSH the most sensitive test of thyroid function.

### Positive feedback: loops that run away on purpose
A few loops amplify instead. When oestradiol stays high for about two days in the middle of the menstrual cycle, it switches from braking to boosting the pituitary, and a surge of LH triggers ovulation. In labour, stretching of the cervix releases oxytocin, which strengthens contractions, which stretch the cervix further. Positive loops always end with an event — ovulation, birth — that breaks the circle.

### Reading the pattern: where is the fault?
Measuring the final hormone *and* the pituitary hormone together locates the problem.

| Final hormone | Pituitary hormone | Meaning | Examples |
|---|---|---|---|
| low | high | **primary** failure: the gland fails, the pituitary pushes | Hashimoto's thyroiditis; Addison's disease; menopause (FSH high) |
| low | low or inappropriately normal | **secondary** failure: the pituitary is not pushing | pituitary tumour or surgery; long-term steroid tablets |
| high | low | the gland runs on its own | Graves' disease; a hormone-making adrenal nodule |
| high | high | the pituitary over-drives the gland | a pituitary tumour making ACTH (Cushing's disease) |

### Switched off from outside
Hormones taken as medicines — or misused — feed back like the body's own. Long-term steroid tablets suppress ACTH and the adrenal glands; testosterone and anabolic steroids suppress LH and FSH, shrinking the testes and stopping sperm production; too much thyroxine suppresses TSH. After stopping, the axis restarts slowly, so long-term steroids are reduced gradually, in a plan made with the prescriber.

> [!warn] People who take steroid tablets long term, or who have adrenal insufficiency, can run dangerously short of cortisol if their tablets stop suddenly or during a severe illness, injury or operation. Severe weakness, vomiting, abdominal pain, dizziness or fainting and confusion are signs of an **adrenal crisis** — call your local emergency number and say that the person takes steroids. See [[adrenal-stress|the adrenal glands]].
`,
  ideas: [
    'In negative feedback the final hormone turns down its own production; this keeps levels stable.',
    'The hypothalamus and pituitary drive the thyroid, adrenal cortex, gonads and growth through chains of hormones.',
    'A loop with gain G shrinks a disturbance to 1/(1 + G) of what it would otherwise be.',
    'Primary failure: final hormone low, pituitary hormone high. Secondary failure: both low.',
    'Hormones taken as medicines suppress the body\'s own axis, which can take months to recover.'
  ],
  pitfalls: [
    'A high pituitary hormone means a pituitary problem — Usually the reverse: a high TSH, ACTH or FSH most often means the gland below is failing and the pituitary is pushing harder.',
    '"Negative feedback" means something is going wrong — "Negative" only means that the loop opposes change. It is the healthy, normal way hormone levels are held steady.',
    'Stopping a hormone medicine puts the body straight back to normal — After suppression the body\'s own axis can take weeks to months to restart, which is why long-term steroids are tapered under medical supervision.'
  ],
  formulas: [
    {
      name: 'How a feedback loop shrinks a disturbance',
      expr: 'dX = D/(1 + G)', tex: '\\Delta X = \\frac{D}{1 + G}',
      vars: {
        dX: { name: 'change that remains, with feedback', q: 'ratio', unit: '%', tex: '\\Delta X' },
        D: { name: 'change the disturbance would cause without feedback', q: 'ratio', unit: '%', value: 30 },
        G: { name: 'loop gain', value: 9 }
      },
      note: 'The steady-state result of a simple proportional feedback loop, from control engineering. The gain of a real hormone axis is not a single fixed number, but the principle — the stronger the loop, the smaller the lasting change — holds.',
      practice: { unknowns: ['dX', 'G'] },
      stories: {
        dX: 'Without feedback, a disturbance would raise a hormone level by {D}. The loop gain is {G}. By how much does the level actually change?',
        G: 'A disturbance that would change a hormone level by {D} changes it by only {dX}. What is the gain of the feedback loop?'
      }
    }
  ],
  examples: [
    {
      title: 'Where is the fault?',
      q: 'A man of 58 is tired and cold. His TSH is 0.3 mU/L (low) and his free T4 is 7 pmol/L (low). His brother, with similar symptoms, has a TSH of 38 mU/L and a free T4 of 7 pmol/L. Where is each fault?',
      steps: [
        'Brother: free T4 low, TSH high. The pituitary is pushing hard and the thyroid cannot answer — **primary** hypothyroidism, most often Hashimoto\'s thyroiditis.',
        'The man himself: free T4 low but TSH low too. A healthy pituitary would be shouting; this one is silent — **secondary** (central) hypothyroidism.',
        'Central hypothyroidism points to the pituitary or hypothalamus, so the other pituitary axes (cortisol, sex hormones) and a pituitary scan are checked. Cortisol matters most: it is replaced first, before thyroxine.'
      ],
      a: 'The brother has primary hypothyroidism; the man has secondary (pituitary) hypothyroidism, which a TSH test alone would have missed.'
    },
    {
      title: 'Why free T4 stays normal on the pill',
      q: 'An oestrogen-containing pill raises the protein that binds thyroxine. Without any response, this would lower free T4 by about 30 %. If the thyroid axis behaves like a loop with a gain of 9, what lasting change remains?',
      steps: [
        '$\\Delta X = D/(1 + G) = 30\\,\\% / (1 + 9) = 3\\,\\%$.',
        'The small initial fall in free T4 raises TSH a little, the thyroid makes more hormone, and free T4 returns almost to where it was — while *total* T4, now carried by more protein, is higher.'
      ],
      a: 'About a 3 % change remains: free T4 stays essentially normal while total T4 rises (the gain of 9 is illustrative).'
    }
  ],
  quiz: [
    { q: 'A person has a high TSH and a low free T4. Where is the problem most likely to be?', choices: ['In the thyroid gland itself (primary)', 'In the pituitary (secondary)', 'In the laboratory: the two results contradict each other', 'In an overactive hypothalamus'], a: 0,
      why: 'A failing thyroid makes too little T4, and the healthy pituitary responds by raising TSH. Low T4 with a low TSH would point to the pituitary instead.' },
    { q: 'Why can stopping long-term steroid tablets suddenly be dangerous?', choices: ['The tablets are addictive', 'The body\'s own cortisol production has been switched off and takes time to restart', 'The adrenal glands overproduce cortisol when the tablets stop', 'The dose builds up in fat and is released all at once'], a: 1,
      why: 'Feedback from the tablets suppressed ACTH, and the adrenal cortex has shrunk from disuse. Without the tablets, and before the axis recovers, the person can run short of cortisol.' },
    { q: 'The surge of LH that triggers ovulation is an example of positive feedback.', a: true,
      why: 'Sustained high oestradiol switches from inhibiting to stimulating the pituitary, so LH rises steeply until ovulation ends the cycle of amplification.' },
    { q: 'Without feedback a disturbance would change a hormone level by 60 %. The loop gain is 11. By how many per cent does the level actually change?', answer: 5,
      why: '60 % / (1 + 11) = 5 %.' },
    { q: 'A young man injects anabolic steroids for bodybuilding. What happens to his own reproductive hormones?', choices: ['LH and FSH fall, his testes shrink and sperm production drops', 'LH and FSH rise to match the extra testosterone', 'His testes grow larger', 'Nothing: anabolic steroids do not affect fertility'], a: 0,
      why: 'The pituitary senses plenty of androgen and switches off LH and FSH. The testes, no longer driven, shrink and stop making sperm — often for months after stopping.' }
  ],
  applications: ['Reading thyroid, adrenal and fertility tests as pairs of hormones.', 'Tapering long-term steroid treatment, and steroid emergency cards.', 'Hormonal contraception, which uses feedback to prevent ovulation.', 'Treating prostate cancer by switching off testosterone production through the pituitary.'],
  sim: 'endo-axis'
},

/* ================================================================ the thyroid */
{
  id: 'thyroid', parent: 'hormones', title: 'The thyroid', level: 1,
  short: 'A butterfly-shaped gland in the neck that turns iodine into thyroid hormones, which set the pace of metabolism, heart and brain. Underactive and overactive thyroids are common, easy to test for with TSH and free T4, and treatable.',
  keywords: ['thyroid', 'thyroxine', 'T4', 'T3', 'TSH', 'hypothyroidism', 'hyperthyroidism', 'Hashimoto', 'Graves disease', 'goitre', 'iodine', 'levothyroxine', 'thyroid nodule', 'free T4'],
  prereq: ['hormone-feedback', 'metabolism-energy'],
  related: ['autoimmunity', 'lab-tests', 'pregnancy', 'arrhythmias', 'vitamins-minerals', 'screening-harms', 'chemistry:radioactive-half-life', 'math:logarithmic-scales'],
  body: `
For two years Leila, 46, blamed her tiredness on work. She felt cold when others were warm, had put on a few kilograms, her skin was dry, her hair thinner and her mood flat. A blood test showed a TSH of 38 mU/L and a free T4 of 7 pmol/L: an underactive thyroid caused by **Hashimoto's thyroiditis**, the immune system slowly destroying the gland. A daily tablet of levothyroxine — synthetic T4 — replaced what her thyroid could no longer make, and within two months she felt like herself again.

### A gland that sets the pace
The thyroid wraps around the windpipe below the Adam's apple. It traps iodine from the blood and builds it into **thyroxine (T4)**, with four iodine atoms, and a little **T3**, with three. Tissues convert T4 into the more active T3, which enters almost every cell and acts on genes: it raises the metabolic rate and heat production, speeds the heart and the gut, and is essential for brain development before birth and in infancy and for growth in childhood.

Adults need about 150 micrograms of iodine a day, more in pregnancy. Where soil and food are poor in iodine the thyroid swells into a **goitre**, and in pregnancy iodine deficiency harms the baby's brain — historically the world's most common preventable cause of intellectual disability. Iodised salt changed this: the number of countries with inadequate iodine intake fell from about 110 in the early 1990s to about 20 around 2020 (Iodine Global Network estimates).

### Reading the tests
TSH is usually measured first, because the pituitary magnifies small changes in free T4 into large changes in TSH: roughly, halving free T4 multiplies TSH about a hundredfold. Typical adult reference ranges are about 0.4–4.0 mU/L for TSH and 10–22 pmol/L (0.8–1.7 ng/dL) for free T4, but they differ between laboratories and change in pregnancy and with age.

| TSH | Free T4 | Usual meaning |
|---|---|---|
| high | low | primary hypothyroidism (Hashimoto's, after treatment, iodine deficiency) |
| high | normal | subclinical hypothyroidism — often watched rather than treated |
| low | high (or T3 high) | hyperthyroidism (Graves' disease, toxic nodules, thyroiditis, too much thyroxine) |
| low | normal | subclinical hyperthyroidism, or recovery from treatment |
| low or normal | low | central (pituitary) hypothyroidism, or severe illness elsewhere |

TSH lags behind changes: after starting or changing treatment it is rechecked after about 6–8 weeks.

### Underactive: hypothyroidism
It comes on slowly: tiredness, feeling cold, constipation, dry skin, thinning hair, low mood, heavier periods, a slow pulse and raised cholesterol. Weight gain is usually modest. In iodine-sufficient countries the usual cause is autoimmune (far more common in women); others are surgery or radioactive iodine treatment and some medicines (lithium, amiodarone, some cancer immunotherapies). Babies are screened at birth, because congenital hypothyroidism — about 1 in 2,000–4,000 newborns — harms development if missed but is fully treatable. Treatment is levothyroxine, adjusted by TSH; calcium and iron supplements taken at the same time reduce its absorption, and needs often rise in pregnancy.

### Overactive: hyperthyroidism
Weight loss despite a good appetite, heat intolerance, sweating, tremor, palpitations (sometimes atrial fibrillation), anxiety, poor sleep and frequent bowel movements. The commonest cause is **Graves' disease**, in which antibodies switch on the TSH receptor; it can also inflame the tissues around the eyes, and smoking makes that worse. Toxic nodules and thyroiditis (for instance after pregnancy, often temporary) are other causes. Treatments: beta-blockers for symptoms; antithyroid medicines (carbimazole or methimazole, propylthiouracil); radioactive iodine; or surgery.

> [!warn] Antithyroid medicines rarely cause a sudden fall in white blood cells: a sore throat, mouth ulcers or fever while taking them needs an urgent same-day blood count — contact a doctor at once. A very fast heartbeat with high fever, agitation or confusion in someone with an overactive thyroid (thyroid storm), or extreme drowsiness, confusion and a low body temperature in someone with a severely underactive one, are emergencies — call your local emergency number.

### Lumps
Thyroid **nodules** are very common — ultrasound finds them in up to half of older adults — and more than nine in ten are benign. Looking hard creates its own problem: when South Korea began widespread ultrasound screening, thyroid cancer diagnoses rose about fifteenfold between 1993 and 2011 with no change in deaths — a lesson in [[screening-harms|overdiagnosis]].
`,
  ideas: [
    'The thyroid turns iodine into T4, which tissues convert into active T3; together they set the metabolic pace.',
    'TSH is the first test because the pituitary magnifies small changes in free T4 into large changes in TSH.',
    'High TSH with low free T4 is primary hypothyroidism; low TSH with high free T4 is hyperthyroidism.',
    'Autoimmune disease is the commonest cause of both: Hashimoto\'s (underactive) and Graves\' (overactive).',
    'Iodised salt and newborn screening prevent the brain damage that thyroid hormone lack causes in early life.'
  ],
  pitfalls: [
    'An underactive thyroid is the usual reason for being very overweight — It typically adds only a few kilograms, much of it fluid, and treatment does not usually cause large weight loss.',
    'Once the dose is right it stays right — Needs change with pregnancy, weight, age and other medicines, which is why TSH is checked periodically.',
    'A thyroid nodule is probably cancer — More than nine in ten are benign; ultrasound features and sometimes a needle sample decide which need attention.'
  ],
  formulas: [
    {
      name: 'TSH and free T4: the steep feedback curve',
      expr: 'TSH = TSH0*(F0/F)^n', tex: '\\text{TSH} = \\text{TSH}_0 \\left(\\frac{F_0}{F}\\right)^{n}',
      vars: {
        TSH: { name: 'TSH (mU/L)', tex: '\\text{TSH}' },
        TSH0: { name: 'TSH at the person\'s usual set point (mU/L)', value: 1.5, tex: '\\text{TSH}_0' },
        F0: { name: 'free T4 at the set point (pmol/L)', value: 15, tex: 'F_0' },
        F: { name: 'free T4 now (pmol/L)', value: 10, tex: 'F' },
        n: { name: 'steepness of the pituitary response', value: 6.64, fixed: true }
      },
      note: 'A rule of thumb from population studies: halving free T4 raises TSH about a hundredfold ($2^{6.64} \\approx 100$), a straight line on a logarithmic TSH scale. Real curves differ between people and flatten at the extremes; it assumes a healthy pituitary and a settled state.',
      practice: { unknowns: ['TSH', 'F'] },
      stories: {
        TSH: 'A person\'s TSH is usually {TSH0} with a free T4 of {F0}. Their thyroid fails and free T4 falls to {F}. Roughly what TSH do you expect?',
        F: 'A person\'s usual values are TSH {TSH0} and free T4 {F0}. Their TSH is now {TSH}. Roughly what is their free T4?'
      }
    },
    {
      name: 'Free T4 in two units',
      expr: 'P = 12.87*N', tex: 'F_{\\text{pmol/L}} = 12.87 \\times F_{\\text{ng/dL}}',
      vars: {
        P: { name: 'free T4 (pmol/L)', tex: 'F_{\\text{pmol/L}}' },
        N: { name: 'free T4 (ng/dL)', value: 1.2, tex: 'F_{\\text{ng/dL}}' }
      },
      note: 'From the molar mass of thyroxine, 776.9 g/mol: 1 ng/dL is 10 ng/L, or 12.87 pmol/L. Europe and much of the world report pmol/L; the US reports ng/dL.',
      stories: { P: 'An American laboratory reports a free T4 of {N}. What is that in pmol/L?', N: 'A European laboratory reports a free T4 of {P}. What is that in ng/dL?' }
    }
  ],
  examples: [
    {
      title: 'Reading Leila\'s results',
      q: 'Leila\'s TSH is 38 mU/L and her free T4 7 pmol/L. Convert the free T4 to ng/dL and interpret the pattern.',
      steps: [
        'Free T4: $7 / 12.87 = 0.54$ ng/dL, below the typical range of about 0.8–1.7 ng/dL (10–22 pmol/L).',
        'TSH is far above the typical upper limit of about 4 mU/L.',
        'High TSH with low free T4: the pituitary is pushing hard on a thyroid that cannot respond — primary hypothyroidism. Antibodies against thyroid peroxidase would confirm Hashimoto\'s thyroiditis.'
      ],
      a: 'Free T4 0.54 ng/dL; the pattern is primary hypothyroidism.'
    },
    {
      title: 'TSH as a magnifying glass',
      q: 'A woman\'s usual values are TSH 1.5 mU/L and free T4 16 pmol/L. Her thyroid starts to fail and free T4 falls to 12 pmol/L — still inside the reference range. Estimate her TSH.',
      steps: [
        { text: 'Use the rule of thumb with $n = 6.64$:', tex: '\\text{TSH} = 1.5 \\times \\left(\\tfrac{16}{12}\\right)^{6.64} = 1.5 \\times 6.75 = 10.1\\ \\text{mU/L}' },
        'Free T4 fell by a quarter and is still "normal"; TSH rose almost sevenfold and is clearly high.',
        'This is subclinical hypothyroidism, and it is why TSH is the most sensitive single test of thyroid function.'
      ],
      a: 'About 10 mU/L: a clearly raised TSH while free T4 is still in range.'
    }
  ],
  quiz: [
    { q: 'Which pattern fits Graves\' disease?', choices: ['TSH very low, free T4 high', 'TSH high, free T4 high', 'TSH high, free T4 low', 'TSH normal, free T4 normal'], a: 0,
      why: 'Antibodies stimulate the thyroid directly, so it overproduces T4; the pituitary senses the excess and switches TSH off.' },
    { q: 'Why is TSH usually the first thyroid test?', choices: ['A small change in free T4 causes a large change in TSH', 'TSH is made by the thyroid itself', 'Free T4 cannot be measured in blood', 'TSH does not vary between laboratories'], a: 0,
      why: 'The pituitary responds steeply to free T4 — roughly a hundredfold change in TSH for a twofold change in free T4 — so TSH shows problems while free T4 is still in range.' },
    { q: 'Weight gain from an underactive thyroid is usually tens of kilograms.', a: false,
      why: 'It is usually a few kilograms, much of it fluid. Large weight changes have other causes.' },
    { q: 'A woman who takes levothyroxine becomes pregnant. What usually happens to her need for thyroid hormone?', choices: ['It rises', 'It falls', 'It stays exactly the same', 'It disappears until after birth'], a: 0,
      why: 'Pregnancy raises binding proteins and the baby depends on the mother\'s thyroxine early on, so needs typically rise — often by a quarter to a half — and TSH is checked early and regularly.' },
    { q: 'An American report gives a free T4 of 1.2 ng/dL. What is it in pmol/L?', answer: 15.4, unit: 'pmol/L',
      why: '1.2 × 12.87 = 15.4 pmol/L, in the middle of the usual range.' }
  ],
  applications: ['Newborn screening for congenital hypothyroidism.', 'Iodised salt programmes.', 'Radioactive iodine treatment of an overactive thyroid and of some thyroid cancers.', 'Monitoring TSH in people taking levothyroxine.'],
  history: 'In 1891 George Murray in Newcastle treated a woman with severe hypothyroidism (myxoedema) with injections of sheep thyroid extract; she lived another 28 years. Iodised salt, introduced in Switzerland and the United States in the 1920s, made goitre rare wherever it was used.',
  sim: { id: 'endo-axis', params: { condition: 'hashimoto' } }
},

/* ================================================================ adrenal glands and stress */
{
  id: 'adrenal-stress', parent: 'hormones', title: 'The adrenal glands and stress', level: 2,
  short: 'Two glands on top of the kidneys, each two organs in one: an outer cortex making cortisol and aldosterone, and an inner medulla making adrenaline. Together they run the body\'s fast and slow responses to stress, its daily rhythm, and its salt balance.',
  keywords: ['adrenal', 'cortisol', 'adrenaline', 'epinephrine', 'aldosterone', 'stress response', 'fight or flight', 'circadian rhythm', 'Cushing syndrome', 'Addison disease', 'adrenal insufficiency', 'primary aldosteronism', 'adrenal fatigue', 'steroid'],
  prereq: ['hormone-feedback', 'electrolytes'],
  related: ['stress-coping', 'hypertension', 'glucose-regulation', 'sleep', 'innate-immunity', 'anaphylaxis', 'side-effects-interactions', 'bone-calcium'],
  body: `
It is 7:40 on the morning of a final exam. Ahmed's heart is thumping, his palms are damp and he feels strangely alert. Two hormones from the same small glands are at work. **Adrenaline** arrived within seconds of his first nervous thought and will fade minutes after he relaxes. **Cortisol** had already surged when he woke, as it does every morning, and the stress is pushing it higher; it will take hours to settle.

### Two glands in one
Each adrenal gland sits on top of a kidney and has two parts with different origins:
- the **cortex** (outer layer) makes steroid hormones from cholesterol: **aldosterone**, which makes the kidneys keep sodium and lose potassium and so supports blood volume and pressure; **cortisol**; and weak androgens that contribute to pubic and underarm hair;
- the **medulla** (core) is really part of the nervous system: sympathetic nerves trigger it to release **adrenaline** (epinephrine) and **noradrenaline**.

### The fast response: adrenaline
Within seconds the heart beats faster and harder, the airways widen, blood is diverted to the muscles, the liver releases glucose and the pupils widen — fight or flight. With a half-life of about two minutes, adrenaline fades quickly once the threat is gone. As a medicine it is life-saving in [[anaphylaxis]] and in cardiac arrest.

### The slow response: cortisol
The brain's stress circuits release CRH, the pituitary releases ACTH, and cortisol rises, peaking roughly 20–40 minutes after a stressor. Cortisol raises blood glucose (it makes the liver build new glucose and opposes insulin), mobilises fat and protein for fuel, helps blood vessels respond to adrenaline and so supports blood pressure, and damps down inflammation and immune activity — which is why steroid medicines like prednisolone treat asthma, arthritis and allergy. It also affects mood, memory and sleep. It is essential: without cortisol, a person cannot survive a serious illness.

Cortisol follows a **daily rhythm**: it rises before waking, peaks about 30–45 minutes after waking, then falls through the day to its lowest point around midnight, with hourly pulses on top. A typical morning level is roughly 150–550 nmol/L (about 5–20 µg/dL), varying by laboratory and assay. After a night shift or a long flight the rhythm shifts only gradually, by about an hour a day — part of why jet lag feels so bad.

### Short stress and long stress
The acute stress response is healthy — it is how we rise to a challenge. When stress is prolonged, persistent activation is linked with poor sleep, higher blood pressure, abdominal fat and low mood, though the evidence connecting everyday stress with measured cortisol is mixed and cortisol is only part of the story (see [[stress-coping|stress and coping]]). **"Adrenal fatigue"** is not a recognised medical condition: endocrine societies have found no evidence for it, and supplements sold for it can contain real hormones.

### When the adrenals go wrong
- **Too much cortisol — Cushing's syndrome.** Most often caused by steroid medicines; otherwise by a pituitary tumour making ACTH (Cushing's disease) or an adrenal tumour. Weight gain centred on the trunk and face, purple stretch marks, thin skin that bruises easily, weak thigh muscles, high blood pressure, high glucose and thin bones. Tests look for loss of the rhythm (late-night saliva cortisol) or of feedback (an overnight dexamethasone test, where normal cortisol is suppressed below about 50 nmol/L, 1.8 µg/dL).
- **Too little — adrenal insufficiency.** Primary (Addison's disease, usually autoimmune) or secondary (pituitary disease, or after long-term steroid tablets). Tiredness, weight loss, dizziness on standing and salt craving; in Addison's, the skin darkens because the pituitary makes extra ACTH, whose parent molecule also stimulates pigment cells. Blood tests may show low sodium and, in Addison's, high potassium. Treatment replaces cortisol (hydrocortisone) and, in Addison's, aldosterone (fludrocortisone), with extra cover during illness.
- **Too much aldosterone — primary aldosteronism.** High blood pressure, sometimes with low potassium. Studies suggest it underlies roughly 5–10 % of high blood pressure — more among people whose pressure resists treatment — yet it is rarely tested for; some cases are cured by removing one adrenal gland.
- **Phaeochromocytoma.** A rare tumour of the medulla causing attacks of headache, sweating and palpitations with high blood pressure.

> [!warn] **Adrenal crisis**: in someone with adrenal insufficiency or on long-term steroids, severe weakness, vomiting, abdominal pain, dizziness or fainting, confusion or drowsiness mean a dangerous lack of cortisol. Call your local emergency number, say that the person has adrenal insufficiency or takes steroids, and give their emergency hydrocortisone injection if they carry one and you have been shown how.
`,
  ideas: [
    'The adrenal cortex makes cortisol and aldosterone; the medulla makes adrenaline.',
    'Adrenaline drives the response within seconds; cortisol follows over 20–40 minutes and lasts for hours.',
    'Cortisol raises glucose, supports blood pressure and suppresses inflammation — and is essential for life.',
    'Cortisol has a daily rhythm: highest shortly after waking, lowest around midnight.',
    'Cushing\'s (too much), adrenal insufficiency (too little) and primary aldosteronism are the main adrenal disorders.'
  ],
  pitfalls: [
    'Cortisol is simply "the stress hormone", so less is always better — Cortisol keeps blood pressure and glucose up and lets the body survive illness; too little is life-threatening.',
    'Steroid medicines are the same as anabolic steroids — Corticosteroids such as prednisolone mimic cortisol and calm inflammation; anabolic steroids mimic testosterone and build muscle. Their effects and risks are different.',
    'One cortisol test shows whether someone is stressed — Cortisol swings with the time of day, pulses and recent events. Tests for adrenal disease are timed and designed carefully, and none measures "stress".'
  ],
  formulas: [
    {
      name: 'Cortisol in two units',
      expr: 'C = 27.59*U', tex: 'C_{\\text{nmol/L}} = 27.59 \\times C_{\\text{µg/dL}}',
      vars: {
        C: { name: 'cortisol (nmol/L)', tex: 'C_{\\text{nmol/L}}' },
        U: { name: 'cortisol (µg/dL)', value: 15, tex: 'C_{\\text{µg/dL}}' }
      },
      note: 'From the molar mass of cortisol, 362.5 g/mol: 1 µg/dL is 10 µg/L, or 27.59 nmol/L. The US reports µg/dL; most other countries nmol/L.',
      stories: { C: 'A morning cortisol is reported as {U}. What is it in nmol/L?', U: 'A cortisol result is {C}. What is it in µg/dL?' }
    },
    {
      name: 'Cortisol falling after a peak',
      expr: 'C = C0*0.5^(t/th)', tex: 'C = C_0 \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}',
      vars: {
        C: { name: 'cortisol later (nmol/L)' },
        C0: { name: 'cortisol at the peak (nmol/L)', value: 600, tex: 'C_0' },
        t: { name: 'time after the peak', q: 'time', unit: 'min', value: 140 },
        th: { name: 'half-life of cortisol', q: 'time', unit: 'min', value: 70, tex: 't_{1/2}' }
      },
      note: 'Assumes release stops after the peak; in reality the adrenals keep producing at a lower rate, so levels fall a little more slowly. The half-life of cortisol is about 60–90 minutes.',
      practice: { unknowns: ['C', 't'] },
      stories: {
        C: 'After a stressful event cortisol peaks at {C0}. With a half-life of {th}, what is it {t} later, if no more is released?',
        t: 'Cortisol peaked at {C0} after a stressor. With a half-life of {th}, how long until it falls to {C}?'
      }
    }
  ],
  examples: [
    {
      title: 'A low morning cortisol',
      q: 'A woman with months of tiredness, dizziness on standing and weight loss has a 9 a.m. cortisol of 80 nmol/L. Convert it and comment.',
      steps: [
        '$80 / 27.59 = 2.9$ µg/dL.',
        'At 9 a.m., near the daily peak, cortisol is usually several hundred nmol/L (roughly 5–20 µg/dL). A value this low, at the time it should be highest, raises the possibility of adrenal insufficiency.',
        'Cut-offs depend on the laboratory\'s assay, so the usual next step is a stimulation test: a dose of synthetic ACTH, with cortisol measured before and after.'
      ],
      a: '2.9 µg/dL — very low for the morning; further testing is needed.'
    },
    {
      title: 'How long does the stress cortisol last?',
      q: 'After a frightening near-miss on the road, cortisol peaks at 600 nmol/L. With a half-life of 70 minutes, how long does it take to fall to 150 nmol/L if release stops?',
      steps: [
        '$600 \\to 300 \\to 150$ is two halvings.',
        'Two half-lives: $2 \\times 70 = 140$ minutes.',
        'In reality it takes a little longer, because the adrenal glands keep releasing some cortisol — and even longer if the person keeps replaying the event.'
      ],
      a: 'About 140 minutes, or longer in practice.'
    }
  ],
  quiz: [
    { q: 'Within seconds of a fright, which hormone does most of the work?', choices: ['Adrenaline', 'Cortisol', 'Aldosterone', 'Thyroxine'], a: 0,
      why: 'Adrenaline is released by nerve signals to the adrenal medulla and acts on surface receptors immediately; cortisol takes 20–40 minutes to peak.' },
    { q: 'When is cortisol normally at its highest?', choices: ['About half an hour after waking', 'In the late evening', 'Around midnight', 'Just after lunch'], a: 0,
      why: 'Cortisol rises in the early morning and peaks 30–45 minutes after waking (the awakening response), then falls to its lowest level around midnight.' },
    { q: '"Adrenal fatigue" is a recognised diagnosis that saliva tests can confirm.', a: false,
      why: 'No good evidence supports it, and endocrine societies do not recognise it. Genuine adrenal insufficiency exists, is diagnosed with proper tests, and is quite different.' },
    { q: 'Why do people with Addison\'s disease often develop darker skin?', choices: ['The pituitary makes extra ACTH, whose parent molecule also stimulates pigment cells', 'Low cortisol damages the skin', 'Their kidneys retain melanin', 'The replacement medicine stains the skin'], a: 0,
      why: 'With the adrenals failing, feedback drives the pituitary to make much more ACTH. ACTH is cut from a larger molecule (POMC) that also yields melanocyte-stimulating hormone.' },
    { q: 'A morning cortisol is 15 µg/dL. What is it in nmol/L?', answer: 414, unit: 'nmol/L',
      why: '15 × 27.59 = 414 nmol/L.' }
  ],
  applications: ['Steroid medicines for asthma, arthritis and allergy, and their side effects.', 'Adrenaline auto-injectors for severe allergic reactions.', 'Shift work, jet lag and the body clock.', 'Testing people with hard-to-control high blood pressure for primary aldosteronism.'],
  history: 'Thomas Addison described adrenal failure in 1855. Cortisone, first given to a woman with severe rheumatoid arthritis at the Mayo Clinic in 1948, earned Philip Hench, Edward Kendall and Tadeus Reichstein the 1950 Nobel Prize — and began the era of steroid medicines.',
  sim: 'endo-cortisol'
},

/* ================================================================ sex hormones and the cycle */
{
  id: 'reproductive-hormones', parent: 'hormones', title: 'Sex hormones and the menstrual cycle', level: 2,
  short: 'The brain drives the ovaries and testes with pulses of GnRH, LH and FSH; they answer with oestradiol, progesterone and testosterone. In women the loop turns into a monthly cycle — follicle, ovulation, corpus luteum, period — which contraception and fertility treatment work with.',
  keywords: ['menstrual cycle', 'ovulation', 'LH surge', 'FSH', 'oestradiol', 'estrogen', 'progesterone', 'testosterone', 'fertile window', 'luteal phase', 'contraception', 'PCOS', 'hCG', 'amenorrhoea'],
  prereq: ['hormone-feedback', 'endocrine-system'],
  related: ['pregnancy', 'menopause', 'child-growth', 'bone-calcium', 'metabolic-syndrome', 'eating-disorders', 'type2-diabetes'],
  body: `
Sara, 31, and her partner are trying for a baby. Her cycles last 30 to 32 days, yet her phone app tells her every month that she ovulates on day 14. It is probably wrong. The part of the cycle *after* ovulation is fairly fixed at about two weeks, so in a 31-day cycle ovulation falls around day 17. Understanding the hormones of the cycle tells her when her fertile days really are.

### One axis, two designs
In both sexes the hypothalamus releases **GnRH** in pulses, roughly every one to two hours, and the pituitary answers with **LH** (luteinising hormone) and **FSH** (follicle-stimulating hormone).
- **In the testes** LH drives the Leydig cells to make **testosterone**, and FSH with testosterone supports sperm production, which takes about ten weeks from start to finish. Testosterone and inhibin feed back to hold LH and FSH steady. Typical levels in young men are about 10–35 nmol/L (300–1,000 ng/dL), highest in the morning, drifting down slowly with age.
- **In the ovaries** production is cyclical and the supply is finite: a girl is born with one to two million immature eggs, has a few hundred thousand at puberty, and ovulates only about 400–500 in her life. When the supply runs low, the cycles stop: [[menopause]].

### The menstrual cycle, step by step
Day 1 is the first day of bleeding.
1. **Early follicular phase.** With oestradiol and progesterone low, the brake is off: FSH rises and recruits a group of follicles, each a fluid-filled sac around an egg.
2. **Dominant follicle.** One follicle outgrows the rest and makes more and more **oestradiol**, which thickens the womb lining and turns cervical mucus clear and stretchy. Rising oestradiol pushes FSH down, and the other follicles fade.
3. **Ovulation.** Once oestradiol has stayed high for about two days, feedback flips from negative to positive: the pituitary releases a surge of LH, and the egg is released about a day and a half after the surge begins. Urine ovulation tests detect this surge.
4. **Luteal phase.** The empty follicle becomes the **corpus luteum**, which makes **progesterone** (and oestradiol). Progesterone prepares the lining for an embryo and raises body temperature by about 0.3–0.5 °C. This phase lasts about 12–14 days.
5. **Period — or pregnancy.** Without pregnancy the corpus luteum fades, progesterone falls, the lining is shed, and FSH rises for the next cycle. If an embryo implants, it makes **hCG**, which keeps the corpus luteum alive; pregnancy tests detect hCG.

Cycles of 21–35 days are typical in adults (longer and more irregular in the first years after periods start), and the variation comes mostly from the follicular phase. Hence the rule of thumb
$$D_{ov} \\approx L - 14$$
The fertile window is about six days ending on the day of ovulation: sperm can survive up to about five days, the egg only about a day.

### Contraception works through feedback
Combined pills, patches and rings supply oestrogen and a progestogen, which hold FSH and LH down: no dominant follicle, no LH surge, no ovulation, and thicker cervical mucus. The bleed in a pill-free week is a withdrawal bleed, not a true period. Progestogen-only methods mainly thicken the mucus, and some also stop ovulation.

### When the cycle changes
- **Missed periods**: pregnancy first; then low energy availability (intense training, weight loss or an eating disorder, which switch off GnRH), thyroid disease, a raised prolactin, polycystic ovary syndrome, and premature ovarian insufficiency (menopause before 40, about 1 % of women).
- **Polycystic ovary syndrome (PCOS)** affects roughly 10–13 % of women of reproductive age (2023 international guideline): irregular ovulation, excess androgen (acne, extra hair) and ovaries with many small arrested follicles. Insulin resistance is common, linking it to [[metabolic-syndrome]] and [[type2-diabetes|type 2 diabetes]].
- **In men**, low testosterone is diagnosed only from symptoms plus repeated morning tests. Testosterone treatment suppresses LH and FSH and so stops sperm production — important for men who want children.

> [!warn] Severe pain low in the abdomen, especially on one side, shoulder-tip pain, or feeling faint in someone who could be pregnant can mean an **ectopic pregnancy**; sudden breathlessness, chest pain or a painful swollen calf in someone using combined hormonal contraception can mean a **blood clot**. Both are emergencies — call your local emergency number.
`,
  ideas: [
    'GnRH pulses drive LH and FSH, which drive the ovaries and testes; their hormones feed back on the brain.',
    'In the follicular phase FSH grows a follicle that makes oestradiol; sustained high oestradiol triggers the LH surge and ovulation.',
    'After ovulation the corpus luteum makes progesterone for about 14 days; its fall brings the period, unless hCG from an embryo keeps it going.',
    'Ovulation day ≈ cycle length − 14; the fertile window is the five days before ovulation and the day itself.',
    'Hormonal contraception and testosterone treatment both work — or cause side effects — through feedback on LH and FSH.'
  ],
  pitfalls: [
    'Everyone ovulates on day 14 — Only in a 28-day cycle. The luteal phase is fairly fixed, so ovulation falls about 14 days before the next period, and it shifts from cycle to cycle.',
    'A period proves that ovulation happened — Cycles without ovulation are common in teenagers, around the menopause and in PCOS; and the bleed on the pill is a withdrawal bleed.',
    'PCOS means cysts on the ovaries — The "cysts" are small follicles that stopped growing. The diagnosis rests just as much on irregular ovulation and signs of excess androgen.'
  ],
  formulas: [
    {
      name: 'Estimating the day of ovulation',
      expr: 'D = L - Lp', tex: 'D_{ov} = L - L_{p}',
      vars: {
        D: { name: 'day of ovulation (cycle day)', tex: 'D_{ov}' },
        L: { name: 'cycle length (days)', value: 28 },
        Lp: { name: 'length of the luteal phase (days)', value: 14, tex: 'L_{p}' }
      },
      note: 'The luteal phase is usually 12–14 days, so this is an estimate within a day or two — and cycles vary. The fertile window runs from about five days before ovulation to the day itself.',
      practice: { unknowns: ['D', 'L'] },
      stories: {
        D: 'A woman\'s cycles last {L}, and her luteal phase about {Lp}. On which cycle day does she probably ovulate?',
        L: 'A woman ovulates on cycle day {D}, and her luteal phase is {Lp}. How long is her cycle?'
      }
    },
    {
      name: 'Testosterone in two units',
      expr: 'Tn = 0.03467*Tg', tex: 'T_{\\text{nmol/L}} = 0.03467 \\times T_{\\text{ng/dL}}',
      vars: {
        Tn: { name: 'testosterone (nmol/L)', tex: 'T_{\\text{nmol/L}}' },
        Tg: { name: 'testosterone (ng/dL)', value: 450, tex: 'T_{\\text{ng/dL}}' }
      },
      note: 'From the molar mass of testosterone, 288.4 g/mol. The Endocrine Society\'s 2018 guideline takes about 264 ng/dL (9.2 nmol/L) as the lower limit for healthy young men, on standardised assays.',
      stories: { Tn: 'An American report gives a total testosterone of {Tg}. What is it in nmol/L?', Tg: 'A European report gives a total testosterone of {Tn}. What is it in ng/dL?' }
    }
  ],
  examples: [
    {
      title: 'Sara\'s fertile days',
      q: 'Sara\'s cycles last about 31 days. When does she probably ovulate, and which days are fertile?',
      steps: [
        'Ovulation: $31 - 14 = 17$, so around cycle day 17.',
        'The fertile window is about six days ending on ovulation: days 12–17, with the best chances on the two or three days before ovulation.',
        'Her app, assuming day 14, points her mostly to days 9–14 — largely too early. An LH urine test, a rise in waking temperature (which confirms ovulation only afterwards) or clear, stretchy cervical mucus track her own cycle better.'
      ],
      a: 'Around day 17; fertile days about 12–17.'
    },
    {
      title: 'Converting a testosterone result',
      q: 'A man with low energy and low libido has a morning total testosterone of 9.5 nmol/L. What is that in ng/dL?',
      steps: [
        '$9.5 / 0.03467 = 274$ ng/dL.',
        'That is just above the 264 ng/dL (9.2 nmol/L) limit used by the 2018 Endocrine Society guideline — a borderline value.',
        'Low testosterone is diagnosed only from symptoms plus at least two morning measurements, and causes such as obesity, illness, sleep apnoea or medicines are looked for first.'
      ],
      a: '274 ng/dL — borderline; to be repeated.'
    }
  ],
  quiz: [
    { q: 'What directly triggers ovulation?', choices: ['A surge of LH from the pituitary', 'A fall in oestradiol', 'A surge of progesterone', 'The start of the period'], a: 0,
      why: 'When oestradiol has stayed high for about two days, the pituitary releases a surge of LH, and the follicle ruptures about a day and a half later.' },
    { q: 'In a regular 35-day cycle, ovulation most likely happens around day…', choices: ['14', '17', '21', '28'], a: 2,
      why: 'The luteal phase lasts about 14 days, so ovulation is about 14 days before the next period: 35 − 14 = 21.' },
    { q: 'The monthly bleed in the pill-free week shows that ovulation took place.', a: false,
      why: 'The combined pill stops ovulation. The bleed happens because the hormones from the pill are withdrawn for a few days.' },
    { q: 'Why does testosterone treatment lower a man\'s sperm count?', choices: ['Extra testosterone switches off LH and FSH by feedback', 'Testosterone kills sperm directly', 'It lowers the body temperature of the testes', 'It is always given with a contraceptive'], a: 0,
      why: 'The pituitary senses plenty of androgen and stops making LH and FSH; without FSH and the high testosterone inside the testes, sperm production stops.' },
    { q: 'A woman has regular 24-day cycles. On which cycle day does she probably ovulate?', answer: 10,
      why: '24 − 14 = 10.' }
  ],
  applications: ['Urine ovulation tests (LH) and pregnancy tests (hCG).', 'Hormonal contraception.', 'Fertility treatment: stimulating follicles with FSH and timing ovulation.', 'Assessing early or late puberty.'],
  history: 'Work by Gregory Pincus, Min Chueh Chang and John Rock on how progesterone blocks ovulation led to the first combined oral contraceptive, approved in the United States in 1960. The first baby conceived by in-vitro fertilisation, Louise Brown, was born in England in 1978.',
  sim: 'endo-cycle'
},

/* ================================================================ bone and calcium */
{
  id: 'bone-calcium', parent: 'hormones', title: 'Bone, calcium and osteoporosis', level: 2,
  short: 'Bone is living tissue, rebuilt all through life under the control of hormones that also hold blood calcium within tight limits. Peak bone mass is reached by about 30; after that, and fastest after the menopause, bone thins — and osteoporosis makes it break easily.',
  keywords: ['bone', 'calcium', 'osteoporosis', 'osteopenia', 'T-score', 'DXA', 'bone density', 'parathyroid hormone', 'PTH', 'vitamin D', 'fragility fracture', 'hip fracture', 'bisphosphonate', 'denosumab', 'corrected calcium', 'hypercalcaemia'],
  prereq: ['hormone-feedback', 'electrolytes', 'vitamins-minerals'],
  related: ['menopause', 'ageing', 'injuries-fractures', 'physical-activity', 'kidney-stones', 'chronic-kidney-disease', 'physics:stress-strain', 'math:normal-distribution'],
  body: `
At 68, Margaret trips on a kerb and puts out a hand to save herself. Her wrist breaks — a fall from standing height that a stronger bone would have survived. A bone density scan shows a T-score of −2.7 at the hip: **osteoporosis**. She had no symptoms at all until the moment of the break, which is why osteoporosis is called silent, and why that first "fragility fracture" is a warning to act on.

### Bone is alive
Bone is a composite, like reinforced concrete: a framework of collagen protein gives toughness, and crystals of calcium phosphate give stiffness (see [[physics:stress-strain|stress and strain]]). It is constantly **remodelled**: cells called osteoclasts dissolve small pits of old bone and osteoblasts refill them with new bone, renewing roughly a tenth of the adult skeleton each year. During growth, building wins; **peak bone mass** is reached around the late twenties. From about 40 a little is lost each year, and in women the loss speeds up for several years around the menopause, because oestrogen restrains the osteoclasts. Genes set most of peak bone mass, but childhood activity, nutrition and puberty on time matter too.

### Calcium: 99 % in bone, and the 1 % that matters every second
The skeleton holds about a kilogram of calcium and doubles as a reserve. Blood calcium, though, is held within a narrow band — about 2.2–2.6 mmol/L (8.8–10.4 mg/dL), depending on the laboratory — because nerves, muscles, the heart and blood clotting depend on it. About half is bound to albumin; the free, **ionised** part (about 1.1–1.3 mmol/L) is what acts. Three hormones hold it steady:
- **parathyroid hormone (PTH)**, from four tiny glands behind the thyroid, rises when calcium falls: it releases calcium from bone, makes the kidneys keep calcium, and activates vitamin D;
- **vitamin D**, made in skin exposed to sunlight or eaten, is activated by the liver and kidneys into calcitriol, which absorbs calcium from food;
- **calcitonin**, from the thyroid, plays only a minor role in adults.

When albumin is low, total calcium reads low although the ionised calcium may be normal — hence the **corrected calcium** formula below, though many laboratories now prefer to measure ionised calcium directly.

### Too much or too little calcium
**High calcium** is most often caused by an overactive parathyroid gland (usually a small benign tumour, often found on a routine test) or by cancer. It can cause thirst, passing a lot of urine, constipation, kidney stones, low mood and confusion. **Low calcium** follows neck surgery that disturbs the parathyroids, vitamin D deficiency, kidney disease or low magnesium, with tingling around the mouth and fingers and muscle cramps or spasms.

> [!warn] A very abnormal calcium can cause confusion, seizures, fainting or an irregular heartbeat — call your local emergency number. Mildly abnormal results on a routine test are common and are followed up with a doctor.

### Osteoporosis
A **DXA** scan (a low-dose X-ray) measures bone mineral density at the hip and spine, and compares it with the average of healthy young adults, in standard deviations — the **T-score**. The WHO definitions (1994): T-score −1 or above is normal, between −1 and −2.5 is low bone mass (osteopenia), and −2.5 or below is osteoporosis. A fracture of the hip or spine from a minor fall counts as osteoporosis whatever the score.

The International Osteoporosis Foundation estimates that about 1 in 3 women and 1 in 5 men over 50 will break a bone because of osteoporosis. Hip fractures are the most serious: roughly one person in five dies within a year, mostly from illnesses the fracture worsens. Risk rises with age, female sex, early menopause, low body weight, previous fractures, a parent's hip fracture, smoking, heavy drinking, long-term steroid tablets and rheumatoid arthritis. Tools such as **FRAX** combine these with bone density to estimate the 10-year chance of a fracture.

### Protecting bone
Weight-bearing and muscle-strengthening exercise, balance training to prevent falls, enough calcium from food and enough vitamin D (supplements for people at risk or with little sunlight), not smoking and limiting alcohol. For people at high risk, medicines cut the risk of spine fractures by roughly 40–70 % in trials:
- **bisphosphonates** (alendronate, risedronate, zoledronic acid) slow the osteoclasts;
- **denosumab**, an antibody that blocks osteoclast formation — it must not simply be stopped, because bone loss rebounds quickly and spine fractures can follow, so a follow-on treatment is planned;
- **bone-building** medicines (teriparatide, abaloparatide, romosozumab) for very high risk;
- menopausal hormone therapy or raloxifene for some women.
Rare side effects — damage to the jaw bone, unusual thigh fractures — are far rarer than the fractures prevented in people at high risk.
`,
  ideas: [
    'Bone is constantly rebuilt by osteoclasts and osteoblasts; peak bone mass is reached by about 30.',
    'Blood calcium is held within narrow limits by parathyroid hormone and vitamin D, using bone as a reserve.',
    'Oestrogen restrains bone breakdown, so bone loss speeds up for several years after the menopause.',
    'The T-score compares bone density with the young-adult average in standard deviations; −2.5 or below is osteoporosis.',
    'Exercise, calcium, vitamin D, fall prevention and, for people at high risk, medicines prevent fractures.'
  ],
  pitfalls: [
    'Plenty of milk or big calcium supplements prevent osteoporosis on their own — Enough calcium is needed, but more than enough adds little; exercise, vitamin D, preventing falls and, when risk is high, medicines matter more.',
    'Osteoporosis only affects women — About one man in five over 50 will break a bone because of it, and men are tested and treated less often.',
    'A T-score above −2.5 means there is no risk — Most fractures happen in people with low bone mass (osteopenia), simply because there are so many of them; risk tools combine density with age, falls and other factors.'
  ],
  formulas: [
    {
      name: 'The T-score',
      expr: 'T = (BMD - mu)/sd', tex: 'T = \\frac{\\text{BMD} - \\mu}{\\sigma}',
      vars: {
        T: { name: 'T-score', signed: true },
        BMD: { name: 'measured bone mineral density', q: 'arealdensity', unit: 'g/cm²', value: 0.62, tex: '\\text{BMD}' },
        mu: { name: 'young-adult mean density', q: 'arealdensity', unit: 'g/cm²', value: 0.858, tex: '\\mu' },
        sd: { name: 'young-adult standard deviation', q: 'arealdensity', unit: 'g/cm²', value: 0.12, tex: '\\sigma' }
      },
      note: 'The defaults are the femoral-neck reference of young white women from the US NHANES III survey (0.858 ± 0.120 g/cm² on one scanner type), which the international densitometry society recommends for men and women of all backgrounds. A Z-score compares with people of the same age instead.',
      practice: { unknowns: ['T', 'BMD'] },
      stories: {
        T: 'A DXA scan measures a femoral-neck density of {BMD}. The young-adult reference is {mu} with a standard deviation of {sd}. What is the T-score?',
        BMD: 'Which femoral-neck density gives a T-score of {T}, with a young-adult mean of {mu} and standard deviation {sd}?'
      }
    },
    {
      name: 'Calcium corrected for albumin',
      expr: 'Cc = Ca + 0.2*(4 - Alb)', tex: '\\text{Ca}_{\\text{corr}} = \\text{Ca} + 0.2\\,(4 - \\text{Alb})',
      vars: {
        Cc: { name: 'corrected calcium', q: 'calcium', unit: 'mmol/L', tex: '\\text{Ca}_{\\text{corr}}' },
        Ca: { name: 'measured total calcium', q: 'calcium', unit: 'mmol/L', value: 2.1, tex: '\\text{Ca}' },
        Alb: { name: 'albumin', q: 'albumin', unit: 'g/dL', value: 2.8, tex: '\\text{Alb}' }
      },
      note: 'The classic Payne correction, written in mmol/L with albumin in g/dL (in mg/dL it reads Ca + 0.8 × (4 − albumin)). It adds back the calcium that a low albumin would carry. It is only an estimate, and many laboratories prefer to measure ionised calcium.',
      practice: { unknowns: ['Cc', 'Ca'] },
      stories: {
        Cc: 'A patient in hospital has a total calcium of {Ca} and an albumin of {Alb}. What is the corrected calcium?',
        Ca: 'Which measured calcium gives a corrected calcium of {Cc} when albumin is {Alb}?'
      }
    },
    {
      name: 'Bone lost at a steady yearly rate',
      expr: 'Lost = 1 - (1 - r)^t', tex: '\\text{lost} = 1 - (1 - r)^{t}',
      vars: {
        Lost: { name: 'fraction of bone density lost', q: 'ratio', unit: '%', tex: '\\text{lost}' },
        r: { name: 'loss per year', q: 'ratio', unit: '%', value: 2 },
        t: { name: 'number of years', q: 'years', unit: 'yr', value: 6 }
      },
      note: 'Losses compound like interest in reverse. Around the menopause the hip and spine can lose roughly 1–2 % a year for five to ten years; later in life loss is typically below 1 % a year, speeding up again in old age.',
      practice: { unknowns: ['Lost', 'r'] },
      stories: {
        Lost: 'In the years after her menopause a woman\'s hip density falls by {r} a year for {t}. What fraction has she lost?',
        r: 'A scan shows {Lost} of density lost over {t}. What steady yearly loss is that?'
      }
    }
  ],
  examples: [
    {
      title: 'Margaret\'s scan',
      q: 'Margaret\'s femoral-neck density is 0.53 g/cm². Using a young-adult mean of 0.858 g/cm² and a standard deviation of 0.12 g/cm², find her T-score.',
      steps: [
        '$T = (0.53 - 0.858)/0.12 = -0.328/0.12 = -2.73$.',
        'That is below −2.5: osteoporosis by the WHO definition — and her wrist fracture from a minor fall already pointed the same way.',
        'Next steps usually include looking for causes (vitamin D, calcium, thyroid, medicines), a fracture-risk estimate, fall prevention, and a discussion of treatment.'
      ],
      a: 'T ≈ −2.7: osteoporosis.'
    },
    {
      title: 'A low calcium with a low albumin',
      q: 'A man recovering from a long illness has a total calcium of 2.10 mmol/L (8.4 mg/dL) and an albumin of 2.8 g/dL (28 g/L). Is his calcium really low?',
      steps: [
        'Corrected calcium: $2.10 + 0.2 \\times (4 - 2.8) = 2.10 + 0.24 = 2.34$ mmol/L.',
        'In mg/dL: $8.4 + 0.8 \\times 1.2 = 9.4$ mg/dL.',
        'That is within the usual range: the total was low because less albumin was carrying calcium. Measuring ionised calcium would settle it.'
      ],
      a: 'Corrected calcium 2.34 mmol/L (9.4 mg/dL) — probably normal.'
    },
    {
      title: 'Six years after the menopause',
      q: 'At 50 a woman\'s hip T-score is −0.5 (density 0.798 g/cm²). Her hip then loses 2 % a year for six years. What is her T-score at 56?',
      steps: [
        'Fraction kept: $0.98^6 = 0.886$, so she has lost 11.4 %.',
        'New density: $0.798 \\times 0.886 = 0.707$ g/cm².',
        'New T-score: $(0.707 - 0.858)/0.12 = -1.26$ — now in the low-bone-mass range.'
      ],
      a: 'About −1.3, having moved from normal to low bone mass in six years.'
    }
  ],
  quiz: [
    { q: 'A T-score of −2.8 means that bone density is…', choices: ['2.8 standard deviations below the young-adult average', '2.8 % lower than last year', '2.8 standard deviations below the average for the person\'s age', 'a 2.8 % ten-year fracture risk'], a: 0,
      why: 'The T-score compares with healthy young adults; comparing with people of the same age gives the Z-score. −2.8 is in the osteoporosis range (−2.5 or below).' },
    { q: 'Why does bone loss speed up after the menopause?', choices: ['Oestrogen normally restrains the cells that break bone down', 'The body stops absorbing calcium completely', 'Periods stop, so calcium is no longer lost in blood', 'Parathyroid hormone disappears'], a: 0,
      why: 'Oestrogen limits osteoclast activity. When it falls, breakdown outpaces rebuilding for several years.' },
    { q: 'Osteoporosis usually causes pain for years before a bone breaks.', a: false,
      why: 'It is silent until a fracture. That is why risk factors, bone density scans and a first minor-fall fracture are used to find it.' },
    { q: 'Why do guidelines warn against simply stopping denosumab?', choices: ['Bone loss rebounds quickly and spine fractures can follow unless a follow-on treatment is given', 'It causes withdrawal symptoms', 'It must be taken for life by law', 'It raises calcium dangerously when stopped'], a: 0,
      why: 'Denosumab suppresses bone breakdown strongly but reversibly. When it wears off, breakdown surges; a bisphosphonate is usually planned to follow it.' },
    { q: 'A femoral-neck density is 0.678 g/cm². With a young-adult mean of 0.858 and a standard deviation of 0.12 g/cm², what is the T-score?', answer: -1.5,
      why: '(0.678 − 0.858)/0.12 = −1.5: low bone mass (osteopenia).' }
  ],
  applications: ['DXA bone density scans and fracture-risk calculators such as FRAX.', 'Fall prevention in older adults.', 'Protecting bone during long-term steroid treatment.', 'Checking calcium after thyroid and parathyroid surgery.'],
  history: 'Dual-energy X-ray absorptiometry (DXA) made accurate, low-dose measurement of bone density practical in the late 1980s, and in 1994 a WHO group defined osteoporosis as a T-score of −2.5 or below.',
  sim: 'endo-bone'
}

);
