/* HYPER-MEDICINE · content/first-aid.js — Emergencies and First Aid: the first minutes,
 * CPR and the defibrillator, choking, bleeding and shock, burns, recognising a heart attack
 * or a stroke, anaphylaxis, poisoning and overdose, injuries, and heat and cold.
 * The steps follow the ILCOR consensus as written into the European Resuscitation Council
 * (ERC) guidelines of 2021 and the American Heart Association (AHA) guidelines of 2020,
 * with their 2025 updates; where the two bodies differ, the pages say so. */
Hyper.add(

/* ================================================================ the first minutes */
{
  id: 'first-aid-basics', parent: 'first-aid', title: 'First aid: the first minutes', level: 1,
  short: 'What to do in the first minutes of any emergency: make sure it is safe, check whether the person responds and breathes normally, call the emergency number with the phone on speaker, and start the right help — CPR, pressure on a bleed, the recovery position — until professionals take over.',
  keywords: ['first aid', 'emergency', 'primary survey', 'DRSABCD', 'emergency number', '112', '911', '999', '101', 'ambulance', 'recovery position', 'unresponsive', 'agonal breathing', 'bystander', 'chain of survival', 'Good Samaritan', 'dispatcher', 'speakerphone'],
  prereq: ['vital-signs', 'respiratory-system', 'heart-anatomy'],
  related: ['cpr', 'bleeding-shock', 'choking', 'recognising-emergencies', 'poisoning-overdose'],
  body: `
> [!warn] **The first minutes, in order**
> 1. **Danger** — stop and look: traffic, fire, electricity, gas, water. Do not become a second casualty.
> 2. **Response** — kneel beside the person, tap both shoulders and ask loudly: "Are you all right?"
> 3. No response: **shout for help**, then **open the airway** — one hand on the forehead, two fingertips under the chin, tilt the head back.
> 4. **Breathing** — look, listen and feel for no more than 10 seconds. Occasional gasps are *not* normal breathing.
> 5. **Call your local emergency number** — 112 in Europe and many other countries, 911 in North America, 999 in the UK, 101 for an ambulance in Israel. Phone on speaker, stay with the person, and send someone for an AED.
> 6. **Not breathing normally → start [[cpr|CPR]].** Breathing normally → the **recovery position**, and keep checking the breathing. Heavy bleeding → **press on it** first.

These steps follow the international consensus of ILCOR, written into the European Resuscitation Council (ERC) guidelines of 2021 and the American Heart Association (AHA) guidelines of 2020; both published updated editions in 2025 without changing these basic steps.

### Why this order
**Safety** comes first because rescuers do get hurt — by traffic at a crash, by live wires, by the gas that knocked the victim down. A **response** tells you whether the brain is getting enough oxygen. In an unconscious person lying on their back the tongue and the soft tissues of the throat fall back and can block the airway; tilting the head and lifting the chin pulls them forward. Then **breathing**: in the first minutes of a cardiac arrest many people make slow, noisy gasps (agonal breathing), and mistaking them for breathing is the commonest reason CPR is started late. If you are not sure the breathing is normal, act as if it is not.

**The call** matters as much as your hands. With the phone on speaker, the call-taker can send help, find the nearest defibrillator and coach you through CPR while you do it. Say where you are as exactly as you can (street, building, floor, landmarks — or share the phone's location), what happened, how many people are hurt, and whether they are breathing. Do not hang up until you are told to.

### The chain of survival
Surviving a cardiac arrest depends on a chain of links: **recognise and call**, **early CPR**, **early defibrillation**, **advanced care** by paramedics and hospital, and **recovery**. The first three are in bystanders' hands. Overall only about 1 person in 10 survives a cardiac arrest outside hospital (European and US registries, 2017–2023), but when CPR starts at once and a shock is given within 3–5 minutes, survival can reach 50–70 % (ERC 2021). A rough rule of thumb from studies of the 1990s puts the loss at 7–10 percentage points for every minute without CPR, and 3–4 points a minute while CPR is going on:

$$S \\approx S_0 - a\\,t_n - b\\,t_c$$

### The recovery position
For someone unresponsive but breathing normally: kneel beside them, put the arm nearest you at a right angle, bring the far hand across to rest against their near cheek, bend the far knee, and roll them towards you onto their side. Tilt the head back so that vomit or blood drains out of the mouth. Keep checking the breathing; if it stops or becomes abnormal, roll them back and start CPR. A pregnant woman should lie on her left side.

### Helping without fear
In a crowd everyone assumes someone else has called, so give jobs to named people: "You, in the blue coat — call the emergency number and tell me when they answer." Many countries protect people who help in good faith, and some — France, Germany and Israel among them — require bystanders to help as far as they safely can, which includes calling for help. The risk of catching an infection while giving first aid is very low; use gloves if there are some and wash your hands afterwards. Feeling shaken for days afterwards is normal; talk about it.

> [!tip] Reading is a start; hands are better. A first-aid course takes an afternoon — Red Cross, Red Crescent and Magen David Adom societies, ambulance services and many workplaces run them — and people who have practised on a manikin act sooner and push harder.
`,
  ideas: [
    'Safety first: a rescuer who becomes a casualty helps no one.',
    'Unresponsive and not breathing normally means cardiac arrest: call and start CPR. Gasping is not normal breathing.',
    'Call early with the phone on speaker: the call-taker can send the defibrillator and coach you through CPR.',
    'Unresponsive but breathing normally: the recovery position, and keep checking the breathing.',
    'Every link of the chain of survival — call, CPR, shock, advanced care — multiplies the chance of living.'
  ],
  pitfalls: [
    "Gasping means they are breathing — Slow, noisy gasps are common in the first minutes of a cardiac arrest. They are not normal breathing: call and start CPR.",
    "Someone else has surely called — In a crowd everyone thinks so. Point at one person and give them the job: “You — call the emergency number and tell me when they answer.”",
    "Doing nothing is safer than doing something wrong — For an unresponsive person who is not breathing normally, doing nothing is certain to fail, and CPR cannot make a cardiac arrest worse. Many countries protect people who help in good faith."
  ],
  formulas: [
    {
      name: 'Survival and the minutes before the shock (rule of thumb)',
      expr: 'S = S0 - a*tn - b*tc', tex: 'S = S_0 - a\\,t_n - b\\,t_c',
      vars: {
        S: { name: 'chance of survival (%)', tex: 'S' },
        S0: { name: 'chance if shocked at once (%)', value: 70, min: 0, max: 100, tex: 'S_0' },
        a: { name: 'loss per minute with no CPR (percentage points)', value: 8.5, tex: 'a' },
        tn: { name: 'minutes before CPR starts', value: 2, tex: 't_n' },
        b: { name: 'loss per minute during CPR (percentage points)', value: 3.5, tex: 'b' },
        tc: { name: 'minutes of CPR before the first shock', value: 6, tex: 't_c' }
      },
      solveFor: 'S',
      note: 'A teaching rule of thumb for a witnessed cardiac arrest with a shockable rhythm, from studies of the 1990s: 7–10 points lost per minute without CPR, 3–4 with it. Real curves bend and flatten, the chance never falls below zero, and age, cause and place matter a great deal — use it to see why minutes count, not to predict.',
      practice: { unknowns: ['S', 'tc'] },
      stories: {
        S: 'A bystander starts CPR after {tn} minutes and the first shock comes {tc} minutes later. What chance of survival does the rule of thumb give?',
        tc: 'CPR starts after {tn} minutes. How many minutes of CPR before the shock would bring the chance down to {S} per cent?'
      }
    }
  ],
  examples: [
    {
      title: 'A collapse on a station platform',
      q: 'A man collapses on a busy platform. Walk through the first minutes, and use the rule of thumb to compare two endings: CPR after 1 minute and an AED shock 3 minutes later, or no CPR and a shock when the ambulance arrives at 10 minutes.',
      steps: [
        '**Danger**: the platform edge and the trains. You approach from the wall side; he is lying clear of the edge.',
        '**Response**: you tap his shoulders and shout — nothing. You shout for help; two people stop.',
        '**Airway and breathing**: head tilted, chin lifted; for 10 seconds you see only a slow gasp every few seconds — not normal breathing.',
        '**Call and send**: “You — call 112 on speaker. You — the defibrillator is by the ticket office, bring it.” You start compressions at once.',
        'Rule of thumb with CPR: $70 - 8.5 \\times 1 - 3.5 \\times 3 = 51$ %, a range of about 48–54 % with the rule\'s spread.',
        'Without CPR, waiting for the ambulance: $70 - 8.5 \\times 10 < 0$ — the rule gives almost nothing (0–7 % at best).'
      ],
      a: 'Call, compress, fetch the AED: roughly an even chance with bystander CPR and an early shock, almost none without.'
    },
    {
      title: 'Unresponsive but breathing',
      q: 'On a park bench you find a woman who does not respond to your voice or a tap on the shoulders. She is breathing normally, about 14 times a minute. What do you do?',
      steps: [
        'Check for danger and for obvious injuries or bleeding: none.',
        'She is unresponsive but breathing normally, so this is not a cardiac arrest: she needs her airway protected.',
        'Call your local emergency number (speaker on) and follow the call-taker\'s advice.',
        'Roll her into the recovery position so that her tongue cannot block the airway and any vomit drains out.',
        'Stay and keep checking her breathing. Look for clues — a medical bracelet, a glucose meter, empty medicine packets — to tell the paramedics. If her breathing becomes abnormal, roll her onto her back and start CPR.'
      ],
      a: 'Call, recovery position, stay and keep checking — CPR only if the breathing stops being normal.'
    }
  ],
  quiz: [
    { q: 'A woman lies on the floor and does not respond when you tap her shoulders and shout. What next?', choices: ['Shout for help, open her airway and check for normal breathing for up to 10 seconds', 'Feel for a pulse at the neck for a full minute', 'Give her a sip of water', 'Wait a few minutes to see whether she wakes up'], a: 0,
      why: 'Unresponsive: open the airway and look for normal breathing, no longer than 10 seconds. Pulse checks are unreliable for bystanders and waste time; waiting and drinks do nothing for a blocked airway or a stopped heart.' },
    { q: 'Slow, occasional gasping in an unresponsive person counts as normal breathing.', a: false,
      why: 'Agonal gasps are common in the first minutes of a cardiac arrest. Treat them as “not breathing normally”: call and start CPR.' },
    { q: 'With the rule of thumb (70 % if shocked at once, 8.5 points lost per minute before CPR, 3.5 per minute during CPR), what chance does it give, in per cent, if CPR starts after 1 minute and the shock comes 4 minutes after that?', answer: 47.5,
      why: '70 − 8.5 × 1 − 3.5 × 4 = 70 − 8.5 − 14 = 47.5 %. Without the CPR those 5 minutes would have cost 42.5 points instead of 22.5.' },
    { q: 'In a crowd, what is the surest way to get an ambulance called?', choices: ['Point at one person and tell them to call the emergency number and report back', 'Shout “Someone call an ambulance!”', 'Assume that someone on a phone is calling', 'Finish CPR first and call afterwards'], a: 0,
      why: 'A general shout lets everyone assume someone else will do it (the bystander effect). A named job, with a request to report back, gets done.' },
    { q: 'An unresponsive man is breathing normally. Which is right?', choices: ['Recovery position, call for help and keep checking his breathing', 'Start chest compressions', 'Sit him up and give him water', 'Leave him to sleep it off'], a: 0,
      why: 'Normal breathing means the heart is pumping: compressions are not needed, but the airway is at risk. The recovery position protects it; keep watching in case the breathing changes.' }
  ],
  applications: [
    'Workplace, school and sports first-aid training.',
    'Telephone CPR: emergency call centres now coach callers through compressions.',
    'Public defibrillators and smartphone systems that alert trained volunteers close to a cardiac arrest.'
  ],
  sim: 'fa-chain-survival'
},

/* ================================================================ CPR and the AED */
{
  id: 'cpr', parent: 'first-aid', title: 'CPR and defibrillation', level: 1,
  short: 'Cardiopulmonary resuscitation: hard, fast chest compressions in the centre of the chest — 100–120 a minute, 5–6 cm deep in an adult, letting the chest rise fully — with rescue breaths if you are trained, and a shock from an automated external defibrillator (AED) as soon as one arrives.',
  keywords: ['CPR', 'cardiopulmonary resuscitation', 'chest compressions', 'cardiac arrest', 'AED', 'defibrillator', 'hands-only CPR', 'rescue breaths', '30:2', 'ventricular fibrillation', 'shockable rhythm', 'compression depth', 'compression rate', 'recoil', 'infant CPR', 'child CPR'],
  prereq: ['first-aid-basics', 'cardiac-output', 'arrhythmias'],
  related: ['ecg', 'heart-attack', 'choking', 'recognising-emergencies', 'physics:energy-in-capacitor'],
  body: `
> [!warn] **Adult CPR — unresponsive and not breathing normally**
> 1. **Call your local emergency number** (112, 911, 999, 101 in Israel …) on speaker and send someone for an **AED**.
> 2. Kneel beside the chest. Heel of one hand on the **centre of the chest** (the lower half of the breastbone), the other hand on top.
> 3. Arms straight, shoulders over your hands: push **5–6 cm deep**, **100–120 times a minute**, and let the chest **rise fully** after each push.
> 4. Trained and willing: **2 rescue breaths after every 30 compressions**. Otherwise keep compressing without stopping.
> 5. When the **AED** arrives, switch it on and **do what it says**. Nobody touches the person during the analysis and the shock; restart compressions straight after.
> 6. Keep going until professionals take over, the person wakes and breathes normally, or you are exhausted. Swap rescuers every 2 minutes.

### Why pushing on the chest works
In a cardiac arrest the heart stops pumping, most often because its electrical rhythm has collapsed into **ventricular fibrillation** — a chaotic quiver with no beat (see [[ecg|the ECG]] and the monitor below). Consciousness goes within about ten seconds, and after a few minutes brain cells begin to die. Each compression squeezes the heart between breastbone and spine and raises the pressure in the whole chest, pushing blood to the brain and the heart muscle; as the chest springs back, blood refills the heart — which is why **full recoil** matters and why leaning on the chest is a mistake. Good CPR moves perhaps a quarter to a third of the normal blood flow: not enough to live on, but enough to keep the brain and heart alive until a shock. Every pause lets the pressure fall, and it takes several pushes to rebuild it.

The numbers are compromises. Slower than 100 a minute moves too little blood; faster than 120 leaves too little time to refill and tends to be shallower. Five centimetres moves enough blood; beyond 6 cm injuries rise with no extra benefit. Ribs may crack, especially in older people — that heals; the alternative does not.

$$f = \\frac{N}{t}$$

Thirty compressions should take 15–18 seconds. Pauses for breaths eat into the compressions actually delivered, so the guidelines ask for breath pauses under 10 seconds and hands on the chest for as much of the time as possible — at least 60 %, ideally over 80 % (AHA).

### Breaths or hands only?
When an adult collapses suddenly, the blood still holds oxygen for some minutes, so compressions matter most: the ERC and AHA tell anyone untrained, or unwilling to give breaths, to give continuous compressions, and call-takers coach exactly that. Trained rescuers give 30 : 2, each breath lasting about a second, just enough to make the chest rise. Breaths matter more when the arrest began with a lack of oxygen — drowning, choking, an overdose — and in children.

### The defibrillator
An AED reads the heart's rhythm through its pads and allows a shock only for ventricular fibrillation or pulseless ventricular tachycardia, so it cannot shock someone who does not need it. A [[physics:energy-in-capacitor|capacitor]] charged to over a thousand volts releases roughly 150–200 joules through the chest in about a hundredth of a second, stopping the chaotic activity so that the heart's own pacemaker can restart a normal beat. Pads go on bare, dry skin: one below the right collarbone, one on the left side below the armpit, as the pictures show — not directly over an implanted device or a medicine patch.

### Children and infants
Cardiac arrest in children usually follows a breathing problem, so breaths matter more. Rescuers trained in children's CPR give 5 rescue breaths first and then 15 : 2 (ERC; the AHA uses 30 : 2 for a lone rescuer and 15 : 2 with two). If you only know adult CPR, use it: both bodies agree it is far better than nothing. Push at least a third of the chest's depth — about 5 cm in a child, 4 cm in an infant — at the same 100–120 a minute; one hand (or two) for a child, two thumbs with your hands encircling the chest for an infant (the current guidelines prefer this to the old two-finger method). AEDs can be used on children, with child pads or a child setting if there is one. Alone with no phone? About a minute of CPR before you leave to call (ERC; the AHA says two).

> [!tip] A screen can train the rhythm but not the depth, the recoil or the breaths. A two-to-four-hour course with a feedback manikin is the best way to learn them — and refresh it every year or two.
`,
  ideas: [
    'Cardiac arrest — unresponsive and not breathing normally — means call, push, shock.',
    'Push hard and fast in the centre of the chest: 5–6 cm deep, 100–120 a minute, full recoil, as few pauses as possible.',
    'Compressions buy time with a quarter to a third of the normal blood flow; only a shock can reset ventricular fibrillation.',
    'An AED decides for itself whether a shock is needed — anyone can use one by following its voice.',
    'In children, breaths matter more — but adult-style CPR is far better than none.'
  ],
  pitfalls: [
    "Push gently so you do not hurt them — Shallow pushes move almost no blood. The person is dying; cracked ribs heal. Push 5–6 cm deep in an adult.",
    "Only trained people may use a defibrillator — Public AEDs are made for untrained bystanders: they talk you through each step and shock only a rhythm that needs it.",
    "Stop every few cycles to feel for a pulse — Bystanders should not check for a pulse at all: it is unreliable and wastes time. Stop only if the person wakes up and breathes normally, or the AED tells you to."
  ],
  formulas: [
    {
      name: 'Compression rate',
      expr: 'f = N/t', tex: 'f = \\frac{N}{t}',
      vars: {
        f: { name: 'compression rate', q: 'frequency', unit: '1/min', tex: 'f' },
        N: { name: 'number of compressions', int: true, value: 30, tex: 'N' },
        t: { name: 'time they take', q: 'time', unit: 's', value: 16, tex: 't' }
      },
      note: 'The target is 100–120 per minute (ERC 2021, AHA 2020, unchanged in 2025): 30 compressions should take 15–18 seconds.',
      practice: { unknowns: ['f', 't'] },
      stories: {
        f: 'A rescuer counts {N} compressions in {t}. What is the rate?',
        t: 'How long should {N} compressions take at {f}?'
      }
    },
    {
      name: 'Compressions actually delivered with 30 : 2',
      expr: 'fe = n/(n/f + tp)', tex: 'f_e = \\frac{n}{n/f + t_p}',
      vars: {
        fe: { name: 'compressions delivered per minute, on average', q: 'frequency', unit: '1/min', tex: 'f_e' },
        n: { name: 'compressions per cycle', int: true, fixed: true, value: 30, tex: 'n' },
        f: { name: 'compression rate while pushing', q: 'frequency', unit: '1/min', value: 110, tex: 'f' },
        tp: { name: 'pause for the two breaths', q: 'time', unit: 's', value: 6, tex: 't_p' }
      },
      note: 'Each cycle is 30 compressions plus a pause for two breaths. The share of time with hands on the chest is (n/f) divided by the whole cycle; the AHA asks for at least 60 %, ideally over 80 %.',
      practice: { unknowns: ['fe', 'tp'] },
      stories: {
        fe: 'A trained rescuer pushes at {f} and pauses {tp} for the two breaths. How many compressions a minute does the patient get on average?',
        tp: 'Pushing at {f}, how long can the breath pause be if the patient is to get {fe} on average?'
      }
    }
  ],
  examples: [
    {
      title: 'Checking your tempo',
      q: 'On a course you count 30 compressions in 20 seconds. Are you in the target range? How long should 30 compressions take at 110 per minute?',
      steps: [
        { text: 'Your rate:', tex: 'f = \\frac{30}{20\\,\\mathrm{s}} = 1.5\\,\\mathrm{s^{-1}} = 90\\ \\text{per minute}' },
        'That is below the 100–120 target: too slow, and the blood pressure you create will be lower.',
        { text: 'At 110 per minute:', tex: 't = \\frac{30}{110}\\,\\text{min} = 16.4\\,\\mathrm{s}' }
      ],
      a: '90 per minute — too slow. Thirty compressions should take about 16 seconds (15–18 s for 100–120).'
    },
    {
      title: 'What the breaths cost',
      q: 'A trained rescuer pushes at 110 per minute and gives two breaths after every 30. How many compressions per minute does the patient receive if the breath pause lasts 6 seconds? And 10 seconds?',
      steps: [
        '30 compressions at 110 a minute take $30/110$ min = 16.4 s.',
        'With a 6 s pause the cycle lasts 22.4 s: $30/22.4\\,\\mathrm{s} \\times 60 = 80.5$ compressions a minute; hands on the chest 73 % of the time.',
        'With a 10 s pause the cycle lasts 26.4 s: 68 a minute, hands on the chest 62 %.',
        'Hands-only CPR at 110 gives the full 110 — one reason untrained rescuers are told not to stop for breaths in a sudden adult collapse.'
      ],
      a: 'About 80 a minute with 6-second pauses, 68 with 10-second pauses.'
    },
    {
      title: 'Two rescuers and an AED',
      q: 'You have been compressing for 3 minutes when a second bystander arrives with an AED. What happens next?',
      steps: [
        'Keep compressing while the other rescuer switches the AED on and bares the chest; pause only when the machine says “analysing”.',
        'Pads: one below the right collarbone, one on the left side below the armpit.',
        '“Shock advised”: make sure nobody is touching the person — say it aloud — and press the button when told.',
        'Restart compressions immediately, without waiting to feel for a pulse; the AED will analyse again after 2 minutes.',
        'Swap the compressor at each analysis, so nobody tires and slows down.'
      ],
      a: 'Minimise the pause: compress until the analysis, stand clear for the shock, then resume at once and swap every 2 minutes.'
    }
  ],
  quiz: [
    { q: 'Where do your hands go for adult chest compressions?', choices: ['The centre of the chest, on the lower half of the breastbone', 'The left side of the chest, over the heart', 'The upper abdomen, just below the ribs', 'The top of the breastbone, near the neck'], a: 0,
      why: 'Pressing on the lower half of the breastbone squeezes the heart against the spine and raises the pressure in the whole chest. The left side and the abdomen move less blood and risk injury.' },
    { q: 'A rescuer gives 30 compressions in 15 seconds. What is the rate?', answer: 120, unit: '1/min',
      why: '30 ÷ 15 s = 2 per second = 120 per minute: the top of the target range.' },
    { q: 'An AED will shock anyone it is attached to, so only professionals should use one.', a: false,
      why: 'An AED analyses the rhythm and allows a shock only for ventricular fibrillation or pulseless ventricular tachycardia. Public AEDs are designed for untrained people.' },
    { q: 'For a sudden collapse in an adult, an untrained bystander should…', choices: ['give continuous chest compressions, guided by the call-taker', 'give only rescue breaths', 'wait until someone trained arrives', 'check for a pulse for a full minute first'], a: 0,
      why: 'Compressions matter most in the first minutes of a sudden adult arrest, and hands-only CPR roughly matches standard CPR there. Waiting loses minutes that decide survival.' },
    { q: 'Why is full recoil — letting the chest come all the way up — important?', choices: ['The heart refills with blood while the chest rises', 'It lets the rescuer rest between pushes', 'It prevents all rib fractures', 'It helps the AED analyse faster'], a: 0,
      why: 'Blood returns to the heart during recoil; leaning on the chest keeps the pressure up and starves the next compression of blood to push.' }
  ],
  applications: [
    'Public-access defibrillators in stations, airports, sports grounds and workplaces.',
    'Telephone-assisted CPR, where the call-taker counts the rhythm with the caller.',
    'CPR lessons in schools, now part of the curriculum in several countries.',
    'Mechanical compression devices used by ambulance crews during transport.'
  ],
  history: 'Closed-chest compression was described by Kouwenhoven, Jude and Knickerbocker at Johns Hopkins in 1960, after Elam and Safar had shown in the 1950s that mouth-to-mouth breathing works. Frank Pantridge in Belfast took the defibrillator out of hospital in a portable unit in the mid-1960s, and the first automated external defibrillators appeared around 1980.',
  sim: ['fa-cpr-trainer', { id: 'ref-ecg', params: { rhythm: 'vf' }, title: 'Ventricular fibrillation: what the AED is looking for' }]
},

/* ================================================================ choking */
{
  id: 'choking', parent: 'first-aid', title: 'Choking', level: 1,
  short: 'When food or an object blocks the airway. Someone who can cough should be encouraged to keep coughing; someone who cannot breathe, speak or cough needs back blows and thrusts at once — abdominal thrusts in adults and children, chest thrusts in babies — and CPR if they become unresponsive.',
  keywords: ['choking', 'airway obstruction', 'foreign body', 'back blows', 'abdominal thrusts', 'Heimlich manoeuvre', 'chest thrusts', 'infant choking', 'child choking', 'cough', 'finger sweep', 'universal choking sign'],
  prereq: ['first-aid-basics', 'respiratory-system'],
  related: ['cpr', 'ventilation', 'child-growth', 'ageing'],
  body: `
> [!warn] **Choking — an adult or a child over 1 year**
> 1. Ask: **"Are you choking?"** If they can cough, speak or breathe, it is **mild**: encourage them to keep coughing, and stay with them.
> 2. If they cannot breathe, speak or cough effectively, it is **severe**: shout for help and get someone to **call your local emergency number**.
> 3. Give **up to 5 back blows**: support the chest with one hand, lean them well forward, and strike firmly between the shoulder blades with the heel of the other hand.
> 4. If that fails, give **up to 5 abdominal thrusts**: from behind, a fist between the navel and the bottom of the breastbone, your other hand over it, pull sharply **inwards and upwards**.
> 5. Keep **alternating 5 back blows and 5 abdominal thrusts** until it clears.
> 6. If they become **unresponsive**, lower them to the floor, make sure help is on the way, and **start CPR**.

> [!warn] **A baby under 1 year**: up to 5 back blows with the baby face down along your forearm, head lower than the chest; then up to 5 **chest thrusts**, face up, on the lower half of the breastbone. **Never abdominal thrusts in a baby.** If the baby becomes unresponsive, start infant CPR and call your local emergency number.

### Mild or severe: the cough decides
A cough is the body's own clearing machine: the airway closes, pressure builds in the chest and is released in a blast of air. While someone can cough loudly, speak, cry or breathe, air is getting past the object and the cough is doing better than any blow could — slapping them may even make things worse. Severe obstruction looks different: no voice, weak or silent coughs, a high-pitched noise or none at all, hands at the throat, the skin turning grey or blue, and then collapse. Oxygen runs out within minutes, so that is the moment to act.

### Why blows and thrusts
Back blows, with the person leaning forward so that gravity helps, jolt the object loose. Abdominal thrusts push the diaphragm suddenly upwards and squeeze the air left in the lungs, like a cork forced out of a bottle — an artificial cough. The European Resuscitation Council has long started with back blows and then alternated; the American Heart Association, which used to teach abdominal thrusts alone, adopted the same alternating sequence in its 2025 update. Australian and New Zealand guidelines follow the back blows with chest thrusts rather than abdominal thrusts. Thrusts can injure the organs inside the abdomen, so anyone who has had them should be checked by a doctor afterwards.

If the person becomes unresponsive, CPR takes over: compressions raise the pressure in the chest and can push the object out. Each time you open the airway to give breaths, look in the mouth and remove anything you can clearly see.

### Special cases
- **Late pregnancy or a very large body**: chest thrusts instead of abdominal thrusts, with your hands on the lower half of the breastbone, from behind.
- **Children over 1**: the same steps, kneeling to their height, with force suited to their size.
- **Babies**: sit or kneel with the baby along your forearm resting on your thigh, supporting the jaw — not the soft throat. Back blows with the heel of your hand; then turn the baby over and give chest thrusts with two fingers or your thumbs — like compressions, but sharper and slower.
- **Alone**: call your local emergency number even if you cannot speak, and try to force a cough. Some courses teach pushing your upper abdomen sharply against the back of a chair.

Choking suction devices are sold to the public, but the guidelines do not recommend them in place of back blows and thrusts: do not delay to look for one. Afterwards, a cough that will not settle, trouble swallowing or the feeling that something is still stuck all need a doctor.

### Prevention
Small children choke on round, firm foods: cut grapes and cherry tomatoes lengthwise into quarters, avoid whole nuts before about age five, and have children sit down to eat. Older people with swallowing problems need soft food and time. Button batteries and small magnets are dangerous if swallowed even when they pass the throat ([[poisoning-overdose]]).

> [!tip] The hand positions — especially on a baby — are hard to learn from words. Practise them on adult and infant manikins in a first-aid course.
`,
  ideas: [
    'The cough decides: coughing, speaking or breathing means mild — encourage the cough; silence means severe — act.',
    'Severe choking in adults and children: up to 5 back blows, then up to 5 abdominal thrusts, alternating until it clears.',
    'Babies get back blows and chest thrusts — never abdominal thrusts.',
    'If the person becomes unresponsive, call and start CPR; compressions can push the object out.',
    'After abdominal or chest thrusts, a medical check is needed.'
  ],
  pitfalls: [
    "Slap the back of anyone who is coughing — A strong cough clears the airway better than any blow. Encourage it, and act only when the cough becomes weak or silent.",
    "Sweep a finger through the mouth to hook the object out — Blind sweeps can push it deeper and injure the throat. Remove only an object you can clearly see.",
    "Give a drink of water to wash it down — Water cannot pass a blocked airway and may be breathed in. Nothing by mouth."
  ],
  examples: [
    {
      title: 'At a restaurant table',
      q: 'A man at the next table stands up gripping his throat. He cannot speak and his coughs are silent. What do you do, step by step?',
      steps: [
        '“Are you choking?” — he nods but makes no sound: severe obstruction.',
        'You shout for help and ask the waiter to call the emergency number on speaker.',
        'You stand beside him, support his chest and lean him well forward: up to 5 back blows, checking after each one. Still stuck.',
        'You move behind him, fist just above the navel, other hand over it: up to 5 sharp inward-and-upward thrusts. Still stuck.',
        'Back to 5 back blows. On the second blow the piece of meat flies out and he gasps.',
        'He sits down, shaken. Because he received abdominal thrusts, he should see a doctor today.'
      ],
      a: 'Mild or severe first; then alternate 5 back blows and 5 abdominal thrusts, and arrange a medical check.'
    },
    {
      title: 'A baby and a piece of apple',
      q: 'A 9-month-old eating apple suddenly goes silent, red-faced and straining, unable to cry. What do you do?',
      steps: [
        'Silent and unable to cry: severe. Shout for someone to call the emergency number.',
        'Sit down, lay the baby face down along your forearm on your thigh, head lower than the chest, jaw supported between your fingers.',
        'Up to 5 firm back blows between the shoulder blades with the heel of your hand.',
        'Still blocked: turn the baby face up along your other forearm, head low, and give up to 5 chest thrusts on the lower half of the breastbone.',
        'Keep alternating. If the baby becomes unresponsive, start infant CPR — two thumbs, hands around the chest — and make sure help is coming.',
        'Once it clears, the baby should still be checked by a doctor.'
      ],
      a: 'Back blows and chest thrusts, alternating — never abdominal thrusts in a baby — and infant CPR if the baby becomes unresponsive.'
    }
  ],
  quiz: [
    { q: 'A man grips his throat but is coughing loudly and says “I’m OK”. You should…', choices: ['encourage him to keep coughing and stay with him', 'give 5 back blows at once', 'give abdominal thrusts', 'give him a glass of water'], a: 0,
      why: 'He can speak and cough: the obstruction is mild and his own cough is the best tool. Act only if the cough becomes weak or silent.' },
    { q: 'Which is never used on a baby under one year?', choices: ['Abdominal thrusts', 'Back blows', 'Chest thrusts', 'CPR'], a: 0,
      why: 'A baby\'s liver and abdominal organs are unprotected by the ribs and easily injured. Babies get back blows and chest thrusts.' },
    { q: 'If a choking adult becomes unresponsive, you should keep giving abdominal thrusts as they lie on the floor.', a: false,
      why: 'Once they are unresponsive, lower them to the floor, make sure the emergency number is called and start CPR: chest compressions can push the object out.' },
    { q: 'Why should someone who has had abdominal thrusts see a doctor, even if they feel fine?', choices: ['The thrusts can injure organs inside the abdomen', 'The object always leaves fragments behind', 'They will need antibiotics', 'It is a legal requirement'], a: 0,
      why: 'Thrusts are forceful and occasionally injure the stomach, liver or other organs; the signs may take hours to appear.' },
    { q: 'Where do the hands go for abdominal thrusts?', choices: ['A fist between the navel and the bottom of the breastbone, pulled sharply inwards and upwards', 'Over the lower ribs, squeezing sideways', 'Below the navel, pushing straight back', 'On the throat, pressing down'], a: 0,
      why: 'Just above the navel and below the breastbone, an upward thrust pushes the diaphragm up and forces air out of the lungs, without pressing on the ribs.' }
  ],
  applications: [
    'Food safety for small children: cutting round foods, sitting down to eat.',
    'Care homes and hospitals, where swallowing problems make choking common.',
    'Restaurant and school staff training.'
  ],
  history: 'The American surgeon Henry Heimlich popularised abdominal thrusts in 1974, and for decades they were the main American teaching, while European, Australian and New Zealand guidelines kept back blows first. American and European guidance have since converged on alternating back blows with abdominal thrusts.',
  sim: 'fa-choking-flow'
},

/* ================================================================ bleeding and shock */
{
  id: 'bleeding-shock', parent: 'first-aid', title: 'Bleeding and shock', level: 2,
  short: 'Stopping serious bleeding is among the most urgent first aid there is: firm, direct pressure on the wound, and a tourniquet for life-threatening bleeding from an arm or leg. The body defends its blood pressure by speeding the heart and narrowing vessels — until, after about a third of the blood is lost, shock sets in.',
  keywords: ['bleeding', 'haemorrhage', 'hemorrhage', 'direct pressure', 'tourniquet', 'wound packing', 'shock', 'hypovolaemic shock', 'haemorrhagic shock', 'blood loss', 'blood volume', 'nosebleed', 'shock index', 'classes of shock', 'embedded object'],
  prereq: ['first-aid-basics', 'hemostasis', 'blood-pressure'],
  related: ['blood-composition', 'blood-groups', 'hemodynamics', 'cardiac-output', 'injuries-fractures', 'sepsis', 'anaphylaxis'],
  body: `
> [!warn] **Life-threatening bleeding**
> 1. **Call your local emergency number** — or get someone else to — with the phone on speaker.
> 2. **Press hard, directly on the wound**, with your hands over a clean cloth or dressing (gloves if you have them). Keep pressing without lifting to look.
> 3. A deep wound in the neck, armpit or groin: **pack** it — push cloth or gauze into the wound — and press hard on top.
> 4. **Bleeding from an arm or leg that pressure cannot control** (spurting, pooling, soaking through): a **tourniquet** 5–7 cm above the wound, not over a joint, tightened until the bleeding stops. **Note the time** and never loosen it.
> 5. Lie the person down, **keep them warm**, give nothing to eat or drink, and stay with them.

### How the body defends itself
An adult has about 70 mL of blood per kilogram — roughly 5 litres at 70 kg — a child about 80 mL/kg and a newborn 85–90. Small vessels seal themselves within minutes by [[hemostasis|clotting]]; large ones cannot, because the flow washes the clot away. Pressure squeezes the vessel shut long enough for platelets and clotting proteins to hold, which is why lifting the dressing to check undoes the work. Raising the limb and pressing on "pressure points" are no longer taught: there is no good evidence that they help (ERC 2021).

As blood is lost, the stretch sensors that guard the [[blood-pressure|blood pressure]] fire the alarm. Adrenaline and the sympathetic nerves speed the heart and narrow the vessels of the skin, gut and kidneys, holding the mean pressure up (MAP = CO × SVR). The result is the familiar picture of early shock: a fast pulse, pale, cold, clammy skin, little urine, anxiety, thirst — **while the blood pressure is still normal**. Trauma courses teach four classes:

| Class | Blood lost (70 kg adult) | Heart rate | Blood pressure | Mind |
|---|---|---|---|---|
| I | under 15 % (under 750 mL) | near normal | normal | normal or slightly anxious |
| II | 15–30 % (750–1,500 mL) | 100–120 | normal, narrow pulse pressure | anxious |
| III | 30–40 % (1,500–2,000 mL) | 120–140 | falling | anxious, confused |
| IV | over 40 % (over 2,000 mL) | over 140 | very low | confused, drowsy |

These are the traditional, approximate figures of the Advanced Trauma Life Support course (American College of Surgeons; its recent editions give trends rather than numbers). Real people vary: fit young adults and children compensate until late and then crash; older people and those on heart-rate-slowing medicines may never show a fast pulse.

$$V_b = k\\,m, \\qquad P = \\frac{100\\,L}{k\\,m}$$

### Tourniquets
Tourniquets fell out of favour for decades for fear of losing the limb, and came back from the battlefields of the 2000s: correctly applied, they save lives and rarely harm the limb within the first couple of hours. Tighten until the bleeding stops — it will hurt — and write down the time for the surgeons. A manufactured tourniquet works far better than an improvised one; a belt or a thin cord usually fails. If bleeding continues, a second tourniquet goes just above the first. Leave any object stuck in a wound where it is and press around it. Where haemostatic gauze is available and you are trained, pack it into the wound.

### Shock
Stop the bleeding first; nothing else works while it continues. Then lay the person flat, keep them warm (cold blood clots poorly), reassure them, and give nothing by mouth. Raising the legs may give a brief boost when there is no leg, hip or back injury. Shock has other causes too — [[sepsis]], [[anaphylaxis]], burns, a failing heart — and all need an emergency call.

### Nosebleeds and children
For a nosebleed: sit up, lean forward, and pinch the soft part of the nose firmly for 10–15 minutes without letting go; spit out the blood. Seek help if it lasts beyond about 20 minutes, is very heavy, follows a head injury, or the person takes blood thinners. A 20 kg child has only about 1.6 L of blood, so a cupful (240 mL) is already 15 %.

> [!tip] Bleeding-control courses teach pressure, packing and tourniquets in an hour or two, with practice limbs. Some cities now place bleeding-control kits next to public defibrillators.
`,
  ideas: [
    'Press hard, directly on the wound, and keep pressing: most bleeding stops with firm pressure.',
    'For life-threatening limb bleeding that pressure cannot control, a tourniquet 5–7 cm above the wound saves lives; note the time and never loosen it.',
    'An adult has about 70 mL of blood per kg, roughly 5 litres; losing a third brings the blood pressure down.',
    'A fast pulse and pale, cold skin come before the blood pressure falls — a normal pressure is not reassurance.',
    'Keep a bleeding person lying down and warm, with nothing to eat or drink.'
  ],
  pitfalls: [
    "Tilt the head back for a nosebleed — Blood runs down the throat, is swallowed or inhaled and causes vomiting. Sit up, lean forward and pinch the soft part of the nose for 10–15 minutes.",
    "A normal blood pressure means the bleeding is not serious — The body holds the pressure up by speeding the heart and narrowing vessels until about 30 % of the blood is gone. Watch the pulse, the skin and the mind.",
    "A tourniquet will cost the limb, so loosen it every few minutes — Correctly applied tourniquets rarely harm the limb in the first hours, and loosening it restarts the bleeding. Leave it on and note the time."
  ],
  formulas: [
    {
      name: 'Blood volume',
      expr: 'BV = k*m', tex: 'V_b = k\\,m',
      vars: {
        BV: { name: 'blood volume (mL)', tex: 'V_b' },
        k: { name: 'blood volume per kilogram', q: 'volperkg', unit: 'mL/kg', value: 70, tex: 'k' },
        m: { name: 'body weight', q: 'mass', unit: 'kg', value: 70, tex: 'm' }
      },
      note: 'Rough averages: about 70 mL/kg in adults (75 in men, 65 in women), 80 in children, 85–90 in newborns. Lean body mass matters more than total weight, so the estimate runs high in people with obesity.',
      stories: { BV: 'Roughly how much blood does a person weighing {m} have, at {k}?', m: 'A child has about {BV} millilitres of blood at {k}. Roughly what does the child weigh?' }
    },
    {
      name: 'Share of the blood volume lost',
      expr: 'P = 100*L/(k*m)', tex: 'P = \\frac{100\\,L}{k\\,m}',
      vars: {
        P: { name: 'share of the blood volume lost (%)', tex: 'P' },
        L: { name: 'blood lost (mL)', value: 1500, tex: 'L' },
        k: { name: 'blood volume per kilogram', q: 'volperkg', unit: 'mL/kg', value: 70, tex: 'k' },
        m: { name: 'body weight', q: 'mass', unit: 'kg', value: 70, tex: 'm' }
      },
      note: 'Compare with the classes: under 15 % (I), 15–30 % (II), 30–40 % (III), over 40 % (IV). Blood lost at the scene is very hard to estimate by eye.',
      practice: { unknowns: ['P', 'L'] },
      stories: {
        P: 'A person weighing {m} has lost {L} millilitres of blood. What share of the blood volume is that, at {k}?',
        L: 'How many millilitres of blood can a person weighing {m} lose before reaching {P} per cent of the blood volume, at {k}?'
      }
    }
  ],
  examples: [
    {
      title: 'A spurting leg wound',
      q: 'A 70 kg man cuts his thigh with a power saw; bright red blood spurts at roughly 400 mL a minute. The ambulance is 10 minutes away. How long until he reaches class III shock if nobody acts?',
      steps: [
        'Blood volume: $70 \\times 70 = 4900$ mL.',
        'Class III begins at 30 %: $0.30 \\times 4900 = 1470$ mL.',
        'At 400 mL a minute: $1470 / 400 = 3.7$ minutes.',
        'So the ambulance would arrive after he is already in severe shock. Firm pressure at once, and a tourniquet above the wound if pressure does not stop it, are what make the difference.'
      ],
      a: 'Under 4 minutes — long before the ambulance. Press at once; tourniquet if pressure fails.'
    },
    {
      title: 'Reading the signs',
      q: 'After a road crash, a 70 kg woman is pale, sweaty and anxious. Her pulse is 115 and her blood pressure 118/88. Is she in danger?',
      steps: [
        'A heart rate of 115 with cold, clammy skin and anxiety fits class II: roughly 15–30 % lost, 750–1,500 mL.',
        'Her blood pressure is still normal, but the pulse pressure is narrow (118 − 88 = 30 mmHg): the vessels are clamped down to hold it.',
        'Shock index = heart rate ÷ systolic = 115/118 ≈ 1.0, a warning level.',
        'Look for and stop any external bleeding, lay her flat, keep her warm, nothing by mouth, and make sure the call-taker knows. Internal bleeding (abdomen, pelvis, thigh) needs a surgeon.'
      ],
      a: 'Yes: she is compensating for a significant blood loss, and the normal blood pressure is misleading.'
    }
  ],
  quiz: [
    { q: 'A man\'s thigh is spurting blood and firm pressure is not stopping it. What next?', choices: ['A tourniquet 5–7 cm above the wound, noting the time', 'Raise the leg and press on the pressure point in the groin', 'Pour water on the wound to see where the blood comes from', 'Lift the dressing every minute to check'], a: 0,
      why: 'Life-threatening limb bleeding that pressure cannot control is exactly what a tourniquet is for. Elevation and pressure points are not effective, and lifting the dressing breaks the clot.' },
    { q: 'A 70 kg adult (70 mL of blood per kg) has lost 1.2 L. What share of the blood volume is that, in per cent?', answer: 24.5,
      why: 'Blood volume 70 × 70 = 4,900 mL; 1,200/4,900 = 24.5 % — class II, when the pulse is fast but the pressure usually still normal.' },
    { q: 'Once a tourniquet is on, it should be loosened every 15 minutes to let blood reach the limb.', a: false,
      why: 'Loosening restarts the bleeding and can be fatal. Tourniquets rarely harm the limb in the first couple of hours; note the time and leave it to the hospital.' },
    { q: 'Which is usually the earliest sign of significant blood loss?', choices: ['A rising heart rate with pale, cool skin', 'A low blood pressure', 'Unconsciousness', 'A slow heart rate'], a: 0,
      why: 'The heart speeds up and the skin vessels clamp down to protect the blood pressure, which falls only after about 30 % is lost.' },
    { q: 'For a nosebleed, the person should…', choices: ['sit, lean forward and pinch the soft part of the nose for 10–15 minutes', 'lie flat with the head tilted back', 'tilt the head back and pinch the bony bridge', 'blow the nose hard every few minutes'], a: 0,
      why: 'Leaning forward keeps blood out of the throat; pinching the soft part presses on the bleeding vessels at the front of the nose, which is where most nosebleeds start.' }
  ],
  applications: [
    'Bleeding-control kits and training for the public, alongside defibrillators.',
    'Military and mass-casualty medicine, where tourniquets returned in the 2000s.',
    'Emergency departments, where the shock index and the classes guide how much blood to prepare ([[blood-groups]]).'
  ],
  sim: 'fa-blood-loss'
},

/* ================================================================ burns */
{
  id: 'burns', parent: 'first-aid', title: 'Burns', level: 2,
  short: 'Cool a burn under cool running water for 20 minutes, as soon as possible; cover it loosely with cling film or a clean non-fluffy dressing; call for help for large, deep or high-risk burns. The burned area, estimated with the rule of nines, decides whether hospital fluids are needed.',
  keywords: ['burns', 'scald', 'cool running water', 'rule of nines', 'TBSA', 'Parkland formula', 'burn depth', 'blister', 'cling film', 'chemical burn', 'electrical burn', 'smoke inhalation', 'sunburn', 'Lund and Browder', 'palm rule', 'burn shock'],
  prereq: ['first-aid-basics', 'tissue-types', 'body-fluids'],
  related: ['physics:heat-transfer', 'physics:specific-heat', 'bleeding-shock', 'innate-immunity', 'heat-cold', 'chemistry:ph-scale'],
  body: `
> [!warn] **Burns and scalds**
> 1. **Stop the burning**: away from the source. Clothes on fire — stop, drop and roll, or smother the flames. Electricity — switch off the power before you touch the person.
> 2. **Cool the burn under cool running water for 20 minutes** — tap water, not ice — as soon as possible; it still helps up to about 3 hours later.
> 3. **Remove** rings, watches and clothing from the area, unless stuck to the skin.
> 4. **Cover loosely** with cling film (laid on, not wrapped tight) or a clean, non-fluffy dressing.
> 5. **Keep the person warm**: cool the burn, not the person — especially a child.
> 6. **Call your local emergency number** for large or deep burns; burns to the face, hands, feet, genitals or joints; burns with smoke inhalation; electrical and chemical burns; and burns in babies, young children and older people.

### Why cool water, and why 20 minutes
After the source is gone, heat stored in the skin keeps flowing deeper ([[physics:heat-transfer|heat transfer]]), and the damaged tissue goes on swelling and dying for hours. Running water, with its large [[physics:specific-heat|heat capacity]], carries that heat away, eases the pain and makes burns shallower: burn registries link 20 minutes of cool running water with fewer deep burns and fewer skin grafts. The ERC (2021) and most burns bodies ask for 20 minutes; American first-aid guidance says at least 10. Ice and iced water are wrong — they narrow the blood vessels, can add a cold injury, and chill the person; a large burn cooled too hard can bring on [[heat-cold|hypothermia]].

### How deep, how big
- **Superficial**: red and painful, no blisters — like sunburn. It is *not* counted in the burned area.
- **Partial thickness**: blisters, moist, pink and very painful (superficial), or blotchy red and white and less painful (deep).
- **Full thickness**: white, leathery or charred, often painless because the nerve endings are destroyed.

The area is the share of the total body surface (TBSA). In adults the **rule of nines** gives the head 9 %, each arm 9 %, the front and the back of the trunk 18 % each, each leg 18 % and the genitals 1 %; scattered patches are counted in palms, since the person's own palm with fingers is about 1 %. Children have larger heads and smaller legs — a baby's head is about 18 % — and hospitals use the more detailed Lund–Browder chart.

$$\\text{TBSA} = 9\\,n_9 + 18\\,n_{18} + p$$

### In hospital: why the area matters
A large burn makes capillaries all over the body leak, and plasma pours out of the blood into the tissues ([[body-fluids]]): burn shock. Adults with burns over about 20 % (children over about 10 %) need fluids into a vein, and the classic starting estimate is the **Parkland formula**:

$$V = 4\\ \\tfrac{\\text{mL}}{\\text{kg}\\cdot\\%} \\times m \\times \\text{TBSA}$$

for the first 24 hours from the time of the burn, half of it in the first 8 hours. The team then adjusts the rate to the urine output (about 0.5 mL/kg per hour in adults, 1 in small children); many burn centres now start lower, at 2 mL, to avoid giving too much. This is hospital work — try it in [the fluids calculator](#/tools/clinical/fluids) — while at the scene the job is water and a call.

### Special burns
- **Chemical**: protect yourself, brush off powders, then rinse with plenty of running water for at least 20 minutes — longer for alkalis, which penetrate deeper ([[chemistry:ph-scale|high pH]]); remove contaminated clothing; rinse an eye for at least 15–20 minutes. Do not try to neutralise.
- **Electrical**: switch off the power first; stay well back from high-voltage lines (British guidance says at least 18 metres). Small skin marks can hide deep damage and heart rhythm problems: always hospital.
- **Smoke**: soot around the nose and mouth, singed nasal hair, a hoarse voice or cough — the airway can swell over hours, and carbon monoxide may be involved ([[poisoning-overdose]]). Emergency.

Children are burned mostly by scalds — hot drinks, kettles, bath water — and their thin skin burns deeper at lower temperatures. Any blistered burn in a child larger than their palm should be seen by a doctor. Worldwide, burns cause an estimated 180,000 deaths a year, most in low- and middle-income countries (WHO, 2023).

> [!tip] First-aid courses let you practise cooling and dressing burns; the key habit — straight to the tap, 20 minutes — is easy to remember once you have done it.
`,
  ideas: [
    'Cool running water for 20 minutes is the single most useful thing — and it still helps up to about 3 hours later.',
    'Cool the burn, not the person: keep them warm.',
    'Cover loosely with cling film or a clean non-fluffy dressing; never butter, oil, toothpaste or ice.',
    'The area (rule of nines, palm ≈ 1 %) and the depth decide the treatment; simple redness is not counted.',
    'Burns over about 20 % in adults (10 % in children) need hospital fluids, starting from the Parkland estimate.'
  ],
  pitfalls: [
    "Put butter, oil or toothpaste on a burn — They hold the heat in, contaminate the wound and have to be scrubbed off. Cool running water, then cling film.",
    "Ice is even better than water — Ice and iced water narrow the blood vessels, can deepen the injury and chill the person. Use cool tap water.",
    "Pop the blisters so the burn can breathe — A blister is a sterile dressing made by the body. Leave it intact for a clinician to decide."
  ],
  formulas: [
    {
      name: 'Rule of nines (adults)',
      expr: 'A = 9*n9 + 18*n18 + p', tex: '\\text{TBSA} = 9\\,n_9 + 18\\,n_{18} + p',
      vars: {
        A: { name: 'burned area (% of body surface)', tex: '\\text{TBSA}' },
        n9: { name: 'whole 9 % regions burned (head and neck, each arm)', int: true, value: 1, tex: 'n_9' },
        n18: { name: 'whole 18 % regions burned (front of trunk, back of trunk, each leg)', int: true, value: 1, tex: 'n_{18}' },
        p: { name: 'extra palm-sized patches (1 % each)', int: true, value: 2, tex: 'p' }
      },
      note: 'Adults. Count only blistered or deeper burns. In children the head is larger (about 18 % in a baby) and the legs smaller; hospitals use the Lund–Browder chart.',
      practice: { unknowns: ['A'] },
      stories: { A: 'Burns cover {n9} of the 9 % regions, {n18} of the 18 % regions and {p} palm-sized patches. What is the burned area in per cent?' }
    },
    {
      name: 'Parkland formula (first 24 hours)',
      expr: 'V = k*m*A', tex: 'V = k\\,m\\,\\text{TBSA}',
      vars: {
        V: { name: 'fluid over the first 24 hours (mL)', tex: 'V' },
        k: { name: 'millilitres per kg per % burned', value: 4, fixed: true, tex: 'k' },
        m: { name: 'body weight', q: 'mass', unit: 'kg', value: 70, tex: 'm' },
        A: { name: 'burned area (% of body surface)', value: 30, tex: '\\text{TBSA}' }
      },
      note: 'A hospital starting estimate for burns over about 20 % in adults, counted from the time of the burn; half in the first 8 hours. Adjusted to the urine output; many centres now start at 2 mL/kg/%. Also in the medical calculators (Fluids).',
      stories: { V: 'A patient weighing {m} has burns over {A} per cent of the body. What volume does the Parkland formula give for the first 24 hours?', A: 'The Parkland formula gives {V} millilitres for a patient weighing {m}. What burned area (in per cent) was used?' }
    },
    {
      name: 'Parkland: the rate in the first 8 hours',
      expr: 'r = k*m*A/16', tex: 'r = \\frac{k\\,m\\,\\text{TBSA}}{16}',
      vars: {
        r: { name: 'rate in the first 8 hours (mL/h)', tex: 'r' },
        k: { name: 'millilitres per kg per % burned', value: 4, fixed: true, tex: 'k' },
        m: { name: 'body weight', q: 'mass', unit: 'kg', value: 70, tex: 'm' },
        A: { name: 'burned area (% of body surface)', value: 30, tex: '\\text{TBSA}' }
      },
      note: 'Half the 24-hour volume over 8 hours is the volume divided by 16. Children also receive their normal maintenance fluids on top.',
      stories: { r: 'What hourly rate does the Parkland formula give for the first 8 hours, for a patient weighing {m} with {A} per cent burns?' }
    }
  ],
  examples: [
    {
      title: 'A kettle accident',
      q: 'A 70 kg man pulls a pan of boiling oil over himself: blistering burns cover the whole front of his trunk and his whole right arm. What is the burned area, what will the hospital give in the first day, and what do you do now?',
      steps: [
        'Rule of nines: front of trunk 18 % + one arm 9 % = 27 %.',
        'Over 20 % in an adult: a major burn, needing fluids in hospital.',
        'Parkland: $4 \\times 70 \\times 27 = 7560$ mL in 24 hours; 3,780 mL in the first 8 hours (about 470 mL/h), 3,780 mL over the next 16 (about 240 mL/h).',
        'Now: call the emergency number, cool the burns under running water for 20 minutes while keeping the rest of him covered and warm, remove his watch and ring, then lay cling film loosely over the burns.'
      ],
      a: '27 %, about 7.6 L of fluid in the first day — and, at the scene, 20 minutes of cool running water and a call.'
    },
    {
      title: 'A toddler and a cup of tea',
      q: 'A 1-year-old (10 kg) pulls a mug of hot tea over herself: blisters on the front of the head and face, the front of the chest and the front of the right arm. How big is the burn?',
      steps: [
        'In a 1-year-old the head is about 18 %, so its front is 9 %; the front of the chest is half of the front of the trunk, 9 %; the front of one arm 4.5 %.',
        'Total: $9 + 9 + 4.5 = 22.5$ %, well over the 10 % at which a child needs hospital fluids.',
        'Parkland: $4 \\times 10 \\times 22.5 = 900$ mL over 24 hours, 450 mL in the first 8 (about 56 mL/h), plus her maintenance fluids of about 40 mL/h.',
        'Now: call, cool the burns under cool running water for 20 minutes while wrapping the rest of her in a dry towel to keep her warm, then cling film.'
      ],
      a: 'About 22.5 % — a major burn for a toddler, from one cup of tea.'
    }
  ],
  quiz: [
    { q: 'How long should a burn be cooled under running water?', choices: ['20 minutes', '1–2 minutes', 'Only until the pain stops', 'Not at all once the skin is red'], a: 0,
      why: 'Twenty minutes of cool running water reduces the depth of the burn and the need for grafts, and still helps up to about 3 hours after the injury.' },
    { q: 'An adult has blistering burns over the whole front of the trunk and the whole left arm. What is the burned area by the rule of nines?', answer: 27, unit: '%',
      why: 'Front of the trunk 18 % + one arm 9 % = 27 %.' },
    { q: 'Simple red skin without blisters, like sunburn, is not counted when estimating the burned area for fluids.', a: true,
      why: 'Superficial burns do not leak plasma the way blistered and deeper burns do, so only partial- and full-thickness burns count towards TBSA.' },
    { q: 'By the Parkland formula (4 mL × kg × % burned), how much fluid over 24 hours for a 60 kg adult with 25 % burns?', answer: 6000, unit: 'mL',
      why: '4 × 60 × 25 = 6,000 mL, half of it (3,000 mL) in the first 8 hours from the time of the burn.' },
    { q: 'Which burn is most likely to be painless?', choices: ['A full-thickness burn, because the nerve endings are destroyed', 'A superficial burn like sunburn', 'A blistering partial-thickness burn', 'Every burn hurts the same'], a: 0,
      why: 'Full-thickness burns destroy the nerve endings in the skin; a painless burn is a worse burn, not a milder one.' }
  ],
  applications: [
    'Scald prevention: hot drinks out of reach, kettle cords short, bath water tested.',
    'Burn centres, where the TBSA guides fluids, surgery and nutrition.',
    'Smoke alarms and fire escape plans at home.'
  ],
  history: 'Charles Baxter and colleagues at Parkland Memorial Hospital in Dallas published their fluid formula in the late 1960s, turning early death from burn shock into something most patients survive.',
  sim: 'fa-rule-of-nines'
},

/* ================================================================ heart attack and stroke */
{
  id: 'recognising-emergencies', parent: 'first-aid', title: 'Recognising a heart attack or a stroke', level: 1,
  short: 'A heart attack usually shows as chest pain or pressure that spreads and does not go away; a stroke as sudden weakness, a drooping face or trouble speaking (BE-FAST). In both, every minute of blocked blood flow kills tissue: call the emergency number at once and note the time.',
  keywords: ['heart attack', 'myocardial infarction', 'chest pain', 'stroke', 'BE-FAST', 'FAST', 'face drooping', 'arm weakness', 'slurred speech', 'time is brain', 'time is muscle', 'TIA', 'mini-stroke', 'aspirin', 'seizure', 'sepsis', 'hypoglycaemia', 'warning signs'],
  prereq: ['first-aid-basics', 'atherosclerosis'],
  related: ['heart-attack', 'stroke', 'cpr', 'epilepsy', 'hypoglycemia', 'sepsis', 'suicide-prevention', 'arrhythmias'],
  body: `
> [!warn] **Heart attack**: chest pain, pressure, tightness or squeezing lasting more than a few minutes, or coming and going; pain spreading to an arm, the neck, jaw, back or upper stomach; shortness of breath, sweating, nausea, light-headedness. Do not wait to see if it passes — **call your local emergency number.**

> [!warn] **Stroke — BE-FAST**: **B**alance lost suddenly; **E**yes — sudden loss of vision; **F**ace drooping on one side; **A**rm or leg weak or numb; **S**peech slurred, muddled or absent; **T**ime — note when it started (or when the person was last seen well) and **call your local emergency number.**

### A suspected heart attack: what to do
1. Call at once. An ambulance brings an ECG and a defibrillator, and can take the person straight to a heart centre; do not drive them yourself, and do not let them drive.
2. Sit them down in the position they find easiest — often half-sitting with the knees bent — loosen tight clothing and keep them calm.
3. The call-taker may advise them to **chew an aspirin**, and the ERC (2021) and AHA (2020) first-aid guidelines support this for adults with typical heart-attack pain, unless they are allergic to it or have been told to avoid it. If they carry their own prescribed spray or tablets for angina, help them take it.
4. Stay, and know where the nearest AED is: a heart attack can turn into a [[cpr|cardiac arrest]]. If they collapse and do not breathe normally, start CPR.

A heart attack is a coronary artery blocked by a clot on a ruptured fatty plaque ([[atherosclerosis]]); the muscle beyond it starts to die within about half an hour, and the sooner the artery is reopened — ideally within two hours — the more muscle is saved: *time is muscle* ([[heart-attack]]). Symptoms are not always dramatic. Women, older people and people with diabetes more often have breathlessness, nausea, unusual tiredness or back or jaw pain, with little chest pain; many call it indigestion. When in doubt, call.

### A suspected stroke: what to do
1. Call at once and say "stroke": hospitals alert a stroke team.
2. **Note the time** the symptoms began, or when the person was last seen well — for someone who wakes with symptoms, when they went to sleep. Clot-dissolving medicine can be given up to about 4.5 hours after onset and clot removal up to 24 hours in selected people, so the time decides the treatment.
3. Nothing to eat or drink: swallowing may be affected. **No aspirin** — a stroke may be a bleed, and only a brain scan can tell.
4. Drowsy but breathing normally: the recovery position. Stay with them and reassure them; they may understand everything even if they cannot speak.

In a typical large stroke from a blocked artery, about 1.9 million nerve cells are lost every minute (Saver's estimate, 2006): *time is brain* ([[stroke]]). Symptoms that vanish within minutes — a transient ischaemic attack — are a warning: a full stroke often follows within days, so they need same-day emergency care. Low blood sugar can imitate a stroke: if the person has diabetes and is awake and able to swallow, a sugary drink can help while you wait ([[hypoglycemia]]).

### Other emergencies to recognise
- **Seizures** ([[epilepsy]]): move hard objects away, cushion the head, time it, put nothing in the mouth, and turn the person on their side when the jerking stops. Call if it lasts more than 5 minutes, repeats, is a first seizure, causes injury, happens in water, or they do not wake up.
- **Sepsis** ([[sepsis]]): an infection with confusion, fast breathing, mottled or bluish skin, very little urine, or a feeling of being gravely ill.
- **A severe asthma attack** not relieved by the inhaler, or **[[anaphylaxis]]**.
- **Someone talking about ending their life** ([[suicide-prevention]]): stay with them, ask directly, listen, and call your local emergency number or a crisis line (988 in the US, Samaritans 116 123 in the UK and Ireland, ERAN 1201 in Israel). Help works.

> [!tip] First-aid courses practise recognition with role play: saying "I think this is a stroke — I'm calling now" out loud once makes it much easier to do for real.
`,
  ideas: [
    'Heart attack: chest pain or pressure that spreads or lasts more than a few minutes — call, rest, and be ready for CPR.',
    'Stroke: BE-FAST — balance, eyes, face, arm, speech, time to call.',
    'Note when the symptoms started, or when the person was last seen well: it decides which treatments are possible.',
    'Do not wait to see if it passes, and do not drive yourself.',
    'Aspirin may be advised for a suspected heart attack, never for a suspected stroke.'
  ],
  pitfalls: [
    "It is only indigestion — Heart attacks often feel like heaviness or burning, and in women, older people and people with diabetes may cause mainly breathlessness, nausea or tiredness. When in doubt, call.",
    "The symptoms went away, so it was nothing — Stroke symptoms that clear within minutes (a transient ischaemic attack) often come before a major stroke. Get emergency care the same day.",
    "Put something in the mouth during a seizure so they do not swallow their tongue — Nobody can swallow their tongue. Objects in the mouth break teeth and block the airway. Protect the head, time it, and turn them on their side afterwards."
  ],
  examples: [
    {
      title: 'Chest pain on the stairs',
      q: 'Your 58-year-old neighbour stops on the stairs, grey and sweating, with a heavy pressure in the middle of his chest that has lasted 10 minutes and spreads to his left arm. What do you do?',
      steps: [
        'This is a heart attack until proven otherwise: call the emergency number now, on speaker.',
        'Sit him down on the stairs, half-sitting, and loosen his collar.',
        'The call-taker asks whether he is allergic to aspirin; he is not, and they advise him to chew one.',
        'You send someone for the AED in the lobby and stay with him, watching his breathing.',
        'If he collapses and stops breathing normally: CPR at once, AED as soon as it arrives.'
      ],
      a: 'Call immediately, rest, aspirin if advised, an AED nearby — and CPR if he collapses.'
    },
    {
      title: 'Breakfast with Grandma',
      q: 'At 8:05 your grandmother drops her spoon; the right side of her mouth droops and her words are slurred. She was fine when she came down at 7:40. What matters most?',
      steps: [
        'Face, arm, speech: BE-FAST positive. Call the emergency number and say “stroke”.',
        'Note the time: last seen well at 7:40 — tell the paramedics.',
        'Nothing to eat or drink, no aspirin.',
        'Keep her sitting supported, or in the recovery position if she becomes drowsy; reassure her.',
        'She is within the window for clot-dissolving treatment — every minute saved in reaching the stroke unit counts.'
      ],
      a: 'Call at once, note the last-seen-well time (7:40), give nothing by mouth.'
    }
  ],
  quiz: [
    { q: 'What does the T in BE-FAST stand for?', choices: ['Time — call the emergency number and note when it started', 'Temperature', 'Tongue — check whether it is bitten', 'Tablets — give an aspirin'], a: 0,
      why: 'Treatment for stroke depends on how long ago it began; calling at once and knowing the time are the two things a bystander contributes.' },
    { q: 'Which is right for a suspected stroke?', choices: ['Call, note the time, give nothing by mouth', 'Give an aspirin and wait an hour', 'Let them sleep it off', 'Book a doctor\'s appointment for tomorrow'], a: 0,
      why: 'A stroke may be a clot or a bleed; aspirin could worsen a bleed, and swallowing may be unsafe. Minutes matter for the treatments that work.' },
    { q: 'A heart attack always causes severe, crushing chest pain.', a: false,
      why: 'Many heart attacks — especially in women, older people and people with diabetes — cause pressure, discomfort, breathlessness, nausea or tiredness rather than crushing pain.' },
    { q: 'During a seizure you should…', choices: ['protect the head, time it, and turn the person on their side when it stops', 'hold them down to stop the movements', 'put a spoon between their teeth', 'splash water on their face'], a: 0,
      why: 'Restraint and objects in the mouth cause injuries. Keep them safe, time the seizure, and use the recovery position afterwards.' },
    { q: 'A man\'s drooping face and slurred speech cleared completely within 10 minutes. What now?', choices: ['Emergency care the same day: it may be a TIA, warning of a stroke', 'Nothing — it has passed', 'A routine appointment next month', 'An aspirin and a lie-down'], a: 0,
      why: 'A transient ischaemic attack carries a high risk of a full stroke in the following days; urgent assessment and treatment reduce it.' }
  ],
  applications: [
    'Public awareness campaigns built on FAST and BE-FAST.',
    'Ambulance ECGs that send heart-attack patients straight to a heart centre.',
    'Stroke units and telestroke services that treat within the time window.'
  ]
},

/* ================================================================ anaphylaxis */
{
  id: 'anaphylaxis', parent: 'first-aid', title: 'Anaphylaxis: a severe allergic reaction', level: 1,
  short: 'A severe, whole-body allergic reaction that can block the airway or collapse the circulation within minutes. The treatment is adrenaline (epinephrine) — given at once with the person\'s auto-injector into the outer thigh — and an emergency call.',
  keywords: ['anaphylaxis', 'severe allergic reaction', 'adrenaline', 'epinephrine', 'auto-injector', 'allergy', 'hives', 'swelling', 'angioedema', 'wheeze', 'peanut allergy', 'bee sting', 'wasp sting', 'food allergy', 'biphasic reaction', 'second dose'],
  prereq: ['allergy', 'first-aid-basics', 'blood-pressure'],
  related: ['asthma', 'cpr', 'antibodies', 'innate-immunity', 'adrenal-stress', 'bleeding-shock'],
  body: `
> [!warn] **Anaphylaxis — act fast**
> Suspect it when, minutes after a trigger (a food, a sting, a medicine), there are **airway, breathing or circulation problems**: a swollen tongue or throat, a hoarse voice, noisy or difficult breathing, wheeze, feeling faint, pale and clammy skin, collapse — often, but not always, with hives, flushing or itching.
> 1. **Use the adrenaline auto-injector** at once, into the **outer thigh** (through clothing if needed), as its instructions show.
> 2. **Call your local emergency number** and say "anaphylaxis".
> 3. **Lie the person flat**, legs raised if they feel faint; let them **sit up** if breathing is hard. Do not let them stand or walk.
> 4. **No improvement after about 5 minutes?** Give a **second dose** if one is available.
> 5. Unresponsive and not breathing normally: **start CPR**.

These steps follow the ERC (2021) and AHA (2020) first-aid guidance and the allergy societies. Use the device and dose the person has been prescribed; this page gives no doses.

### What is happening
In an [[allergy]], antibodies of the IgE type sit on mast cells throughout the body, primed for one trigger ([[antibodies]]). When it arrives, the mast cells burst open together and release histamine and other mediators. Blood vessels widen and leak, so the blood pressure falls; the airways narrow; the tongue, lips and throat swell. It can go fast: in a UK series of fatal reactions (Pumphrey, 2000) the median time from exposure to cardiac arrest was about 5 minutes for injected medicines, 15 for stings and 30 for foods. Common triggers are peanuts, tree nuts, milk, egg, sesame, fish and shellfish; wasp and bee stings; antibiotics, anti-inflammatory painkillers and anaesthetic drugs; and latex.

### Why adrenaline — and why the thigh
Adrenaline reverses the whole reaction at once: it tightens the leaking vessels and raises the blood pressure, opens the airways, reduces the swelling, and stops the mast cells releasing more ([[adrenal-stress]]). Injected into the large thigh muscle it is absorbed faster than under the skin. Nothing else is a substitute: antihistamines ease itching and hives but act too slowly and do not open the airway or raise the blood pressure; a reliever inhaler can help the wheeze after the adrenaline, not instead of it. Deaths are linked to adrenaline given late, and most guidelines say: if in doubt, give it. Since 2024 an adrenaline nasal spray has also been approved in the US and the European Union; use whatever the person carries, as instructed.

### Why position matters
With the vessels wide open and leaking, standing up lets blood pool in the legs, and the heart can be left with too little to pump; deaths have followed people sitting up or standing during a reaction (Pumphrey, 2003). So: lying flat, legs raised if faint; sitting if breathing is the problem; a pregnant woman on her left side; the recovery position if unresponsive and breathing.

### After the injection
Improvement usually comes within minutes, but everyone who has had anaphylaxis goes to hospital: symptoms return hours later in roughly 1 in 20 people (a biphasic reaction). People at risk are usually advised to carry **two** auto-injectors at all times and to check their expiry dates. Children have their own devices; many schools keep spare ones and train staff. Afterwards, an allergy specialist can confirm the trigger and, for stings, offer desensitisation.

> [!tip] Auto-injectors come with trainer devices that have no needle. Practise with one — at a first-aid course, or ask a pharmacist — so that your hands know the steps under stress.
`,
  ideas: [
    'Anaphylaxis = a trigger plus airway, breathing or circulation problems; skin signs are common but may be absent.',
    'Adrenaline into the outer thigh is the first and only essential treatment — give it at once; if in doubt, give it.',
    'Call the emergency number, keep the person lying flat (sitting if breathing is hard), and never make them stand or walk.',
    'No improvement after about 5 minutes: a second dose if one is available.',
    'Always hospital afterwards: the reaction can return hours later.'
  ],
  pitfalls: [
    "An antihistamine tablet is enough — Antihistamines ease itching and hives but act too slowly and do not open the airway or raise the blood pressure. Adrenaline first, always.",
    "Wait to see whether it gets worse before using the auto-injector — Deaths are linked to late adrenaline. Most guidelines say: if in doubt, give it.",
    "Help them stand up and walk to the car for fresh air — Standing can empty a heart already short of blood. Keep them lying down, or sitting if breathing is hard, and call an ambulance."
  ],
  examples: [
    {
      title: 'A wasp sting at a picnic',
      q: 'Ten minutes after a wasp sting, a man has hives, swollen lips, a hoarse voice and feels faint. He carries two auto-injectors. What do you do?',
      steps: [
        'Hoarse voice (airway) and faintness (circulation) after a sting: anaphylaxis.',
        'He lies down on the grass; you help him inject the outer thigh through his jeans and hold it as the instructions say.',
        'Someone calls the emergency number and says “anaphylaxis”.',
        'You raise his legs on a bag and keep him lying down.',
        'Six minutes later he is still faint and wheezy: the second auto-injector, into the other thigh.',
        'He improves; the paramedics take him to hospital to be watched for a returning reaction.'
      ],
      a: 'Adrenaline at once, call, lie flat, a second dose after about 5 minutes without improvement, then hospital.'
    },
    {
      title: 'A peanut at a birthday party',
      q: 'An 8-year-old with a known peanut allergy eats a biscuit, then starts coughing, wheezing and struggling to breathe; her lips swell. What is different about the position?',
      steps: [
        'Breathing is the main problem: let her **sit up**, which makes breathing easier, rather than lying flat.',
        'Her own (child) auto-injector into the outer thigh at once.',
        'Call the emergency number; tell her parents.',
        'If she becomes faint or pale, lay her down with the legs raised; if she becomes unresponsive and does not breathe normally, start CPR.',
        'Even if she recovers quickly, she goes to hospital.'
      ],
      a: 'Adrenaline at once and a call; sitting up because breathing is hard, lying flat if she becomes faint.'
    }
  ],
  quiz: [
    { q: 'Where is an adrenaline auto-injector given?', choices: ['Into the outer thigh muscle, through clothing if needed', 'Into the upper arm, under the skin', 'Into the buttock, after undressing', 'Into a vein'], a: 0,
      why: 'The large thigh muscle absorbs adrenaline quickly and is easy to reach through clothes; the devices are designed for it.' },
    { q: 'After the first auto-injector, the person is no better after 5 minutes. What now?', choices: ['A second dose if one is available, while waiting for the ambulance', 'An antihistamine instead', 'Walk them to the car and drive to hospital', 'Nothing more can be done before hospital'], a: 0,
      why: 'Guidelines advise a repeat dose after about 5 minutes without improvement. Antihistamines are no substitute, and walking is dangerous.' },
    { q: 'Anaphylaxis can happen without any rash or hives.', a: true,
      why: 'Skin signs are present in most reactions but not all; a trigger followed by airway, breathing or circulation problems is enough to act on.' },
    { q: 'Why must a person in anaphylaxis not stand up suddenly?', choices: ['Blood can pool in the widened vessels, leaving the heart too little to pump', 'Standing spreads the allergen faster', 'It stops the adrenaline working', 'It makes the rash worse'], a: 0,
      why: 'Widened, leaking vessels already starve the heart of returning blood; gravity makes it worse. Fatal collapses have followed sitting up or standing.' },
    { q: 'Once the adrenaline has worked, there is no need to go to hospital.', a: false,
      why: 'The adrenaline wears off, and in roughly 1 in 20 people the reaction returns hours later. Everyone should be observed in hospital.' }
  ],
  applications: [
    'Allergy action plans at schools and workplaces.',
    'Food labelling of the major allergens.',
    'Venom desensitisation for people with severe sting allergy.'
  ]
},

/* ================================================================ poisoning and overdose */
{
  id: 'poisoning-overdose', parent: 'first-aid', title: 'Poisoning and overdose', level: 1,
  short: 'When a poison has been swallowed, breathed in, splashed or injected: keep yourself safe, call the emergency number or a poison information centre, do not make the person vomit, and give naloxone for a suspected opioid overdose if you have it. Unresponsive and not breathing normally means CPR.',
  keywords: ['poisoning', 'overdose', 'opioid', 'naloxone', 'poison centre', 'carbon monoxide', 'alcohol poisoning', 'paracetamol', 'acetaminophen', 'button battery', 'household chemicals', 'activated charcoal', 'vomiting', 'recovery position', 'fentanyl'],
  prereq: ['first-aid-basics', 'pharmacokinetics'],
  related: ['cpr', 'addiction', 'alcohol', 'liver-function', 'oxygen-transport', 'control-of-breathing', 'suicide-prevention'],
  body: `
> [!warn] **Poisoning or overdose**
> 1. **Keep yourself safe**: gas, fumes, needles or chemicals can harm you too. Move the person to fresh air only if you can do it safely.
> 2. **Unresponsive and not breathing normally**: call your local emergency number and **start CPR**. For a suspected **opioid** overdose, give **naloxone** if you have it — without delaying CPR.
> 3. **Unresponsive but breathing**: the **recovery position**, and keep checking.
> 4. **Awake**: find out **what, how much and when**; keep the packet, bottle or plant; call your local emergency number or a **poison information centre**.
> 5. **Do not make them vomit**, and give nothing to eat or drink unless the experts say so.

In the US the Poison Help line is 1-800-222-1222; in Israel the national Poison Information Centre at Rambam hospital answers on 04-777-1900; in the UK call NHS 111, or 999 in an emergency. Most countries have a service like these — find yours and save it in your phone.

### Why not make them vomit?
Vomiting brings up little of what was swallowed, burns the gullet a second time after corrosives, and can be breathed into the lungs, especially as drowsiness sets in; petrol and lamp oil are most dangerous in the lungs. Salt water is itself poisonous, and milk neutralises nothing. Activated charcoal is used only on professional advice (ERC 2021).

### Opioid overdose and naloxone
Opioids — heroin, fentanyl and its relatives, and prescribed morphine, oxycodone or methadone — switch off the brain's automatic drive to breathe ([[control-of-breathing]]). The signs: very drowsy or unresponsive, slow or stopped breathing, snoring or gurgling, pinpoint pupils, blue or grey lips. Naloxone pushes the opioid off its receptors and restarts the breathing within minutes; it comes as a nasal spray or an injection, and many countries now sell or give it without a prescription (the US since 2023). It does no harm to someone who has not taken opioids. It also wears off sooner than many opioids — often within an hour — so stay, keep the emergency call going, and be ready to give a second dose or CPR. A person dependent on opioids may wake in withdrawal, agitated and vomiting: reassure them and keep them on their side. Because the problem is breathing, trained rescuers give rescue breaths with compressions. Opioids were involved in about 80,000 deaths a year in the US in 2021–2023 (CDC).

### Other common poisonings
- **Medicines**: an overdose of paracetamol (acetaminophen) may cause no symptoms for a day while the liver is being damaged ([[liver-function]]); the antidote works best within about 8 hours, so everyone needs checking at once.
- **Carbon monoxide**: invisible and odourless; headache, dizziness, nausea and confusion, often in several people (or pets) in one place, better outdoors. It binds haemoglobin over 200 times more strongly than oxygen ([[oxygen-transport]]). Get everyone out, call, do not go back in; fit CO alarms.
- **Alcohol**: cannot be woken, slow or irregular breathing, vomiting while drowsy, cold skin, seizures — call. Never leave someone to "sleep it off" alone; no coffee or cold showers ([[alcohol]]).
- **Children** under five swallow medicines, cleaning products, laundry capsules and e-cigarette liquid. A swallowed **button battery** stuck in the gullet can cause a severe burn within about 2 hours: emergency department at once, even if the child seems well.
- **Chemicals on the skin or in the eyes**: rinse with running water for 15–20 minutes and remove contaminated clothing.

### When an overdose may be deliberate
Treat the body first — call, recovery position, CPR if needed. Then stay with the person, listen without judging, and make sure they are connected to help once the medical emergency is over. Help works. Crisis lines: 988 in the US, Samaritans 116 123 in the UK and Ireland, ERAN 1201 in Israel ([[suicide-prevention]]).

> [!tip] Naloxone training takes minutes and is offered by pharmacies, harm-reduction services and many first-aid courses. If someone close to you uses opioids, keep naloxone at home.
`,
  ideas: [
    'Keep yourself safe first: gases, needles and chemicals harm rescuers too.',
    'Unresponsive and not breathing normally: call and start CPR; naloxone for a suspected opioid overdose if you have it.',
    'Never make the person vomit, and give nothing by mouth unless experts advise it.',
    'Find out what, how much and when, and keep the container for the emergency team.',
    'Some poisonings look harmless at first — paracetamol, button batteries, carbon monoxide — and still need urgent care.'
  ],
  pitfalls: [
    "Make them vomit, or give salt water — Vomiting removes little, burns the gullet again and can be breathed in; salt water is itself poisonous. Call for advice instead.",
    "Give milk to neutralise a swallowed chemical — Milk neutralises nothing and delays proper advice. Nothing by mouth unless the poison centre says so.",
    "Let them sleep it off — Someone who cannot be woken after alcohol or drugs may stop breathing or choke on vomit. Recovery position, call for help, and stay with them."
  ],
  examples: [
    {
      title: 'Found in a stairwell',
      q: 'A young man lies in a stairwell. He does not respond; he takes a snoring breath about every 10 seconds; his lips are grey and his pupils tiny. There is a syringe beside him and a naloxone kit in the first-aid box. What do you do?',
      steps: [
        'Safety: move the syringe away with your foot; do not pick it up.',
        'Unresponsive, breathing far too slowly: not breathing normally. Call the emergency number on speaker.',
        'Suspected opioid overdose: naloxone spray into one nostril.',
        'Start CPR — with rescue breaths if you are trained, since the problem is breathing.',
        'After 3 minutes he gasps, coughs and wakes, agitated. You put him on his side and talk to him calmly.',
        'You stay: naloxone can wear off before the opioid does, so he must be seen by the paramedics.'
      ],
      a: 'Safety, call, naloxone, CPR — then stay, because the overdose can return.'
    },
    {
      title: 'The open pill box',
      q: 'You find your 2-year-old with an open box of paracetamol; some tablets are missing. He seems perfectly well. What now?',
      steps: [
        'Do not make him vomit and give him nothing to drink.',
        'Count the tablets left to estimate how many may be missing; note the time.',
        'Call the poison information centre or the emergency number with the box in your hand: they will give advice based on the weight, the amount and the time.',
        'Paracetamol damages the liver silently over a day or more, and the antidote works best early — so follow the advice even though he looks fine.'
      ],
      a: 'Call for expert advice at once with the box; no vomiting, no drinks, and do not wait for symptoms.'
    }
  ],
  quiz: [
    { q: 'A toddler has swallowed a button battery but seems perfectly well. What should happen?', choices: ['Go to an emergency department at once', 'Wait for it to pass in the nappy', 'Make the child vomit', 'Give milk and watch at home'], a: 0,
      why: 'A button battery lodged in the gullet can cause a severe burn within about 2 hours, often with no early symptoms. It must be removed urgently.' },
    { q: 'Naloxone can harm a person who has not taken opioids, so give it only if you are sure.', a: false,
      why: 'Naloxone has no effect in someone without opioids in their body, so the guidelines advise giving it whenever an opioid overdose is suspected.' },
    { q: 'Which signs suggest an opioid overdose?', choices: ['Very drowsy or unresponsive, slow breathing, pinpoint pupils, blue lips', 'Agitation, wide pupils, fast breathing', 'A red rash and itching', 'Fever and a stiff neck'], a: 0,
      why: 'Opioids depress breathing and consciousness and constrict the pupils. Wide pupils and agitation suggest stimulants instead.' },
    { q: 'Several people in a flat have headaches and nausea that improve when they go outside. What should you suspect?', choices: ['Carbon monoxide poisoning', 'Food poisoning', 'A migraine outbreak', 'Hay fever'], a: 0,
      why: 'Carbon monoxide from a faulty boiler, stove or heater poisons everyone in the same space; symptoms ease in fresh air. Get out and call.' },
    { q: 'Someone who took too much paracetamol but feels fine the next morning does not need to see a doctor.', a: false,
      why: 'Liver damage develops silently over a day or more; the antidote works best early. Anyone who may have overdosed needs checking at once.' }
  ],
  applications: [
    'Poison information centres, which handle most calls about children at home without a hospital visit.',
    'Naloxone distribution and training programmes.',
    'Carbon monoxide alarms and child-resistant packaging.'
  ]
},

/* ================================================================ injuries */
{
  id: 'injuries-fractures', parent: 'first-aid', title: 'Sprains, fractures and head injuries', level: 1,
  short: 'Most injuries need rest, a cold pack and support; a suspected broken bone is kept still in the position found; a head injury is watched for danger signs. Call for help for deformity, a wound over a fracture, a suspected neck or back injury, or a head injury with loss of consciousness, vomiting or confusion.',
  keywords: ['fracture', 'broken bone', 'sprain', 'strain', 'dislocation', 'splint', 'head injury', 'concussion', 'spinal injury', 'neck injury', 'cold pack', 'RICE', 'knocked-out tooth', 'open fracture', 'immobilise', 'hip fracture'],
  prereq: ['first-aid-basics', 'bone-calcium', 'brain-regions'],
  related: ['bleeding-shock', 'pain', 'nervous-system-organization', 'ageing', 'child-growth'],
  body: `
> [!warn] **Danger signs**: a bone showing through the skin or a wound over a suspected fracture; a badly deformed limb, or one that is cold, pale or numb beyond the injury; a suspected broken thigh or pelvis; neck or back pain, numbness or weakness after a fall from height or a fast crash; a head injury with any loss of consciousness, confusion, repeated vomiting, a seizure, a worsening headache, unequal pupils, clear fluid from the nose or ears, or increasing drowsiness. For any of these, **call your local emergency number.**

**What to do**
1. **Bleeding first**: press on it ([[bleeding-shock]]).
2. **Suspected fracture**: keep the injured part **still, in the position you found it**, supported with padding, cushions or the person's own hands. Do not try to straighten it. Cover any wound with a clean dressing.
3. **Sprains and bruises**: rest, a **cold pack wrapped in a cloth for up to 20 minutes** at a time, light support, and raise the limb.
4. **Suspected neck or back injury**: ask the person to keep still, and **hold the head in line** with your hands if they are awake. Move them only to get them out of danger — or if they are unresponsive and not breathing normally, when the airway and CPR come first.
5. **Head injury**: rest, a cold pack on any swelling, and someone to stay with them for 24 hours to watch for the danger signs above.

### What each step prevents
Broken bone ends are sharp: every movement tears the soft tissue, vessels and nerves around them, adds pain and bleeding, and can turn a closed fracture into an open one. A broken thigh can bleed a litre or more into the muscles, and a broken pelvis more, which is why they count as emergencies (see where the big bones and organs lie on [the body map](#/tools/body)). Check beyond the injury — colour, warmth, feeling, movement of the fingers or toes: a cold, pale or numb hand or foot means a trapped or torn artery or nerve. Splinting is for trained people, or when help is hours away.

Cold narrows the small vessels, eases pain and limits swelling in the first hours (ERC 2021 first aid), but ice straight on the skin can cause a cold burn, so wrap it and stop after about 20 minutes. After the first day or two, gentle movement usually helps a sprain recover better than long rest.

### Head injuries and concussion
Concussion is a brain injury from a knock or a jolt: headache, dizziness, confusion, a gap in the memory, nausea, sensitivity to light and noise, feeling "foggy" or unusually emotional. Most people recover within days to weeks. A person who might be concussed in sport stops playing at once and does not return that day — *if in doubt, sit them out* — and goes back only step by step. Bleeding inside the skull can develop over hours: that is what the 24-hour watch is for, and why people over 65 and anyone taking blood thinners should be assessed after even a minor head injury. Sleeping is fine once a person has been assessed, provided someone is with them.

### Special cases
- **A knocked-out adult tooth**: hold it by the crown, never the root; if dirty, rinse for a few seconds under cold water; push it back into its socket and bite on a cloth. If you cannot, keep it in milk (or in the cheek of an adult) and see a dentist within the hour. Baby teeth are not put back.
- **Children**: bones can bend and crack without breaking through (greenstick fractures), and injuries near the ends of bones can involve the growth plates — a child who will not use a limb needs an X-ray.
- **Older people**: fragile bones ([[bone-calcium|osteoporosis]]) break in simple falls. After a fall, pain in the hip, inability to stand, and a shortened, outward-turned leg suggest a broken hip.
- **Dislocations**: do not try to put the joint back; support it as found.

> [!tip] Courses let you practise supporting limbs, holding a head in line and rolling someone with a team. Sports coaches can learn the concussion recognition tools used in their sport.
`,
  ideas: [
    'Keep a suspected fracture still, in the position found; do not straighten it.',
    'A cold pack wrapped in cloth for up to 20 minutes at a time eases pain and swelling of sprains and bruises.',
    'After a head injury, someone watches for 24 hours for danger signs: confusion, repeated vomiting, worsening headache, drowsiness, seizures.',
    'Suspected spinal injury: keep the person still and support the head — but the airway and CPR come first.',
    'Check colour, warmth and feeling beyond an injury: a cold, pale or numb limb is an emergency.'
  ],
  pitfalls: [
    "If you can move it, it is not broken — Many fractures still allow movement. Pain on one spot of a bone, swelling, deformity or being unable to bear weight need an X-ray.",
    "Keep a concussed person awake all night — Sleep does no harm. What matters is that someone stays with them for the first 24 hours, notices danger signs and can wake them.",
    "Put ice straight on the skin, for as long as possible — Direct ice can cause a cold burn. Wrap it, and use it for up to about 20 minutes at a time."
  ],
  examples: [
    {
      title: 'A cyclist on the road',
      q: 'A cyclist has fallen at speed. He is lying on the road, awake but confused about what happened; his helmet is cracked and his forearm is bent. What do you do?',
      steps: [
        'Danger: traffic. Someone warns oncoming cars; you kneel beside him.',
        'He is confused after a head impact at speed: call the emergency number.',
        'Neck: he is awake and has neck pain, so you ask him to keep still and hold his head in line. The helmet stays on.',
        'The forearm: he supports it against his body as found; you check that his fingers are warm and pink and that he can feel your touch.',
        'You keep him warm with a jacket and keep talking to him, noting any change in how alert he is, until help arrives.'
      ],
      a: 'Call, keep him still with the head in line, support the arm as found, check the circulation beyond, and watch his level of consciousness.'
    },
    {
      title: 'A tooth on the pitch',
      q: 'A 14-year-old footballer takes an elbow to the mouth and an upper front tooth comes out whole. What do you do?',
      steps: [
        'An adult tooth: find it, and pick it up by the crown, never the root.',
        'It is dirty: rinse it for a few seconds under cold water — no scrubbing.',
        'Push it gently back into its socket the right way round and have her bite on a folded cloth.',
        'If she cannot tolerate that, put the tooth in milk.',
        'Dentist within the hour: the sooner a tooth is back in place, the better its chance of surviving.'
      ],
      a: 'Hold by the crown, rinse briefly, replant or store in milk, and see a dentist within the hour.'
    }
  ],
  quiz: [
    { q: 'A child falls from a climbing frame and her forearm is bent at an odd angle. You should…', choices: ['keep it still and supported as found, and get medical help', 'gently straighten it before moving her', 'ask her to move her wrist to test it', 'rub it to ease the pain'], a: 0,
      why: 'Moving or straightening a fracture tears tissue, vessels and nerves. Support it as found, check the circulation beyond, and get it assessed.' },
    { q: 'How long should a wrapped cold pack be applied to a sprained ankle at a time?', choices: ['Up to about 20 minutes', 'One minute', 'Three hours without a break', 'Only after two days'], a: 0,
      why: 'Around 20 minutes gives the benefit of cooling without risking a cold injury to the skin.' },
    { q: 'After a head injury, repeated vomiting is a reason to call the emergency number.', a: true,
      why: 'Repeated vomiting, confusion, drowsiness, a worsening headache or a seizure can mean bleeding inside the skull.' },
    { q: 'A motorcyclist lies on the road, awake, with neck pain. What do you do?', choices: ['Ask him to keep still, hold his head in line and call for help', 'Take his helmet off at once and sit him up', 'Help him stand to see whether he can walk', 'Roll him onto his front'], a: 0,
      why: 'After a high-energy crash with neck pain, movement could injure the spinal cord. Keep him still; remove a helmet only if the airway requires it.' },
    { q: 'How should a knocked-out adult tooth be carried if it cannot be put back?', choices: ['In milk, or in the cheek of an adult who will not swallow it', 'Wrapped in a dry tissue', 'Scrubbed clean and kept in tap water', 'In the freezer'], a: 0,
      why: 'Milk keeps the cells on the root alive; drying, scrubbing and plain water kill them.' }
  ],
  applications: [
    'Concussion protocols in contact sports.',
    'Fall prevention and bone health in older people.',
    'School and sports first-aid kits: cold packs, dressings, triangular bandages.'
  ]
},

/* ================================================================ heat and cold */
{
  id: 'heat-cold', parent: 'first-aid', title: 'Heatstroke and hypothermia', level: 2,
  short: 'When the body can no longer hold its core near 37 °C. Heatstroke — over about 40 °C with confusion or collapse — needs an emergency call and rapid cooling, best by immersion in cold water; hypothermia — below 35 °C — needs shelter, insulation and gentle handling. Both can kill, and both can be prevented.',
  keywords: ['heatstroke', 'heat exhaustion', 'hypothermia', 'frostbite', 'cold-water immersion', 'body temperature', 'core temperature', 'heat wave', 'shivering', 'afterdrop', 'dehydration', 'humidity', 'children in cars', 'cooling'],
  prereq: ['thermoregulation', 'first-aid-basics', 'physics:heat-transfer'],
  related: ['physics:latent-heat', 'physics:conduction', 'physics:convection', 'body-fluids', 'cpr', 'ageing'],
  body: `
> [!warn] **Heatstroke — hot and confused**
> After heat or hard exertion: **confusion, odd behaviour, slurred speech, collapse or a seizure**, with hot skin, dry or sweating.
> 1. **Call your local emergency number.**
> 2. **Cool at once**: best, immerse the body up to the neck in cold water; otherwise soak the skin with cold water and fan hard, and add ice packs to the neck, armpits and groin. Move out of the sun.
> 3. Keep cooling until the person is clearly better — or, where it can be measured, the core temperature is about 39 °C.

> [!warn] **Hypothermia — cold and slowing down**
> 1. **Get out of the cold and wind**; replace wet clothes with dry ones; **insulate** the body and head, and put insulation between the person and the ground.
> 2. **Handle gently**, and keep them lying down if drowsy.
> 3. Warm sweet drinks only if fully alert and able to swallow; **no alcohol, no rubbing, no hot bath**.
> 4. **Call your local emergency number** if they are confused, drowsy, no longer shivering or not improving. Not breathing normally: start CPR.

### Heat: from exhaustion to stroke
The body sheds heat by radiation, by [[physics:convection|convection]] and — in hot weather above all — by evaporating sweat: each litre that evaporates carries away about 2.4 MJ ([[physics:latent-heat|latent heat]]). Humid air slows evaporation, which is why damp heat is so much more dangerous than dry heat. **Heat exhaustion** is the body struggling — heavy sweating, weakness, dizziness, headache, nausea, cramps — while the mind stays clear: move to a cool place, lie down with the legs raised, loosen clothing, cool the skin and give water or an oral rehydration drink. It should improve within about 30 minutes; if not, call. **Heatstroke** is the thermostat failing: a core above about 40 °C with the brain affected. The *classic* form strikes older people, babies and people with chronic illness during heat waves; the *exertional* form strikes fit athletes, soldiers and workers, who often still sweat.

### Why cold water works
Water conducts heat about 25 times better than air ([[physics:conduction|conduction]]). Whole-body immersion in cold water cools at roughly 0.15–0.35 °C a minute, several times faster than wet towels, fanning or ice packs, and international first-aid guidance (ILCOR 2020, ERC 2021) recommends it for exertional heatstroke: water between about 1 and 26 °C, up to the neck, until the core is below 39 °C. Where it is done within half an hour, almost everyone survives. At events with medical teams the rule is "cool first, transport second"; for a bystander, call and cool together.

$$t = \\frac{T_1 - T_2}{r}$$

Heat waves kill quietly: an estimated 61,000 people died of heat in Europe in the summer of 2022 (Nature Medicine, 2023). Most at risk are the very old, babies, pregnant women, people with heart, lung or kidney disease, those on some medicines, and outdoor workers. The inside of a car in the sun can warm by about 10 °C in 10 minutes: never leave a child or an animal in one.

### Cold: from shivering to stillness
Below 35 °C the body is hypothermic. Wind strips heat by convection, and wet clothing and water conduct it away; falling into cold water is the fastest route. In **mild** hypothermia (35–32 °C) people shiver hard, fumble and make poor decisions. In **moderate** (32–28 °C) shivering stops, and they become drowsy and confused; in **severe** (below 28 °C) they become unconscious, and below about 24 °C signs of life may be impossible to detect. A cold heart is irritable: rough handling can trigger [[cpr|ventricular fibrillation]]. Rubbing the limbs or a hot bath opens the skin's vessels, sends cold blood to the core and can make the blood pressure collapse. Check breathing for up to a minute before starting CPR; cold protects the brain, and people have survived long arrests after rewarming in hospital.

**Frostbite** — numb, white, hard skin on the fingers, toes, nose or ears: do not rub it, and rewarm it (in warm water of about 37–39 °C) only when there is no risk of it freezing again; then protect it and seek care.

Babies lose heat fast and also overheat easily, because they have a lot of skin for their weight and cannot move away; dress them in layers and feel the back of the neck.

> [!tip] Outdoor and sports first-aid courses practise the hypothermia wrap and heat-illness cooling. Knowing where the cold-water tub or the nearest shower is before a hot-weather race saves minutes.
`,
  ideas: [
    'Heatstroke is recognised by the brain: hot plus confused or collapsed means call and cool at once.',
    'Cold-water immersion cools fastest — roughly 0.2 °C a minute — and is the preferred first aid for exertional heatstroke.',
    'Heat exhaustion — heavy sweating with a clear mind — improves with rest, cooling and fluids within about 30 minutes; if not, call.',
    'Hypothermia: shelter, dry clothes, insulation and gentle handling; no alcohol, no rubbing, no hot bath.',
    'Water carries heat away about 25 times faster than air — why wet clothes chill and why immersion cools.'
  ],
  pitfalls: [
    "Give alcohol to warm someone up — Alcohol opens the skin's vessels, so the person feels warmer while losing core heat faster, and it blunts shivering. Warm sweet non-alcoholic drinks, if fully alert.",
    "Rub cold limbs or put the person in a hot bath — Both push cold blood from the skin to the core and can make the blood pressure collapse. Insulate, rewarm gradually, and leave active rewarming to professionals.",
    "Someone who is still sweating cannot have heatstroke — In exertional heatstroke athletes and workers often sweat heavily. Confusion is the signal, not dry skin."
  ],
  formulas: [
    {
      name: 'Time to cool',
      expr: 't = (T1 - T2)/r', tex: 't = \\frac{T_1 - T_2}{r}',
      vars: {
        t: { name: 'cooling time (minutes)', tex: 't' },
        T1: { name: 'starting core temperature', q: 'temperature', unit: '°C', value: 42, tex: 'T_1' },
        T2: { name: 'target core temperature', q: 'temperature', unit: '°C', value: 39, tex: 'T_2' },
        r: { name: 'cooling rate (°C per minute)', value: 0.2, tex: 'r' }
      },
      note: 'Approximate cooling rates from studies of volunteers and athletes: cold-water immersion about 0.15–0.35 °C per minute; wet skin with fanning roughly 0.05; ice packs alone about 0.03. The aim is below 39 °C within 30 minutes of collapse.',
      practice: { unknowns: ['t', 'r'] },
      stories: {
        t: 'A runner with heatstroke has a core temperature of {T1}. At {r} °C per minute, how many minutes does it take to reach {T2}?',
        r: 'To bring {T1} down to {T2} in {t} minutes, what cooling rate (°C per minute) is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Collapse at the finish line',
      q: 'A marathon runner collapses near the finish on a warm, humid day. She is confused and sweating; the medical team measures a core temperature of 42.1 °C. How long does cooling take by immersion (0.2 °C per minute), and with ice packs alone (0.03 °C per minute)?',
      steps: [
        'Hot and confused after exertion: exertional heatstroke. Call and cool at once.',
        { text: 'Immersion:', tex: 't = \\frac{42.1 - 39}{0.2} = 15.5\\ \\text{min}' },
        { text: 'Ice packs alone:', tex: 't = \\frac{42.1 - 39}{0.03} \\approx 103\\ \\text{min}' },
        'Immersion reaches the target well within the 30-minute goal; ice packs would leave her above 40 °C for most of an hour — organ damage grows with every minute.'
      ],
      a: 'About 15 minutes in cold water against well over an hour and a half with ice packs alone.'
    },
    {
      title: 'A walker caught in the rain',
      q: 'On a cold, wet, windy hill, a walker in your group has stopped shivering, is stumbling and slurring, and says he feels fine. What do you do?',
      steps: [
        'Shivering stopped, confusion: moderate hypothermia, around 32 °C or below. Call the emergency number (mountain rescue).',
        'Get him out of the wind — behind rocks, into a tent or a shelter — and lying down on a mat or rucksacks.',
        'Replace wet clothing with dry if you can do it quickly; otherwise wrap everything: sleeping bag, a waterproof or foil layer, hat.',
        'Handle him gently; no rubbing, no alcohol, and nothing to drink unless he is fully alert and can swallow safely.',
        'Keep checking his breathing; if it stops being normal, check for up to a minute and start CPR.'
      ],
      a: 'Shelter, insulate, handle gently and call — this is past the stage where he can rewarm himself.'
    }
  ],
  quiz: [
    { q: 'A runner collapses on a hot day, confused and sweating. What is the best first aid?', choices: ['Call and cool immediately, ideally by immersion in cold water', 'Give fluids and wait an hour', 'Wrap her in a foil blanket to prevent shock', 'Walk her to the medical tent'], a: 0,
      why: 'Confusion after exertion in the heat is heatstroke until proven otherwise. Rapid cooling is what saves the brain and organs; cold-water immersion is fastest.' },
    { q: 'At 0.2 °C per minute, how many minutes does cold-water immersion take to bring 41.5 °C down to 39 °C?', answer: 12.5, unit: 'min',
      why: '(41.5 − 39) ÷ 0.2 = 2.5 ÷ 0.2 = 12.5 minutes.' },
    { q: 'A glass of whisky is a good way to warm up a walker with hypothermia.', a: false,
      why: 'Alcohol widens the skin\'s blood vessels, so the person feels warm while losing core heat faster, and it dulls shivering and judgement.' },
    { q: 'Why should a person with moderate hypothermia be handled gently?', choices: ['A cold heart is irritable, and rough movement can trigger a dangerous rhythm', 'Their bones are frozen and brittle', 'Movement makes them shiver too much', 'It prevents frostbite'], a: 0,
      why: 'Below about 32 °C the heart is prone to ventricular fibrillation, which rough handling can set off.' },
    { q: 'Which picture fits heat exhaustion rather than heatstroke?', choices: ['Heavy sweating, weakness and a headache with a clear mind', 'Confusion and slurred speech', 'A seizure', 'Collapse with no response'], a: 0,
      why: 'In heat exhaustion the brain still works normally. Any change in mental state means heatstroke: call and cool.' }
  ],
  applications: [
    'Heat-health warning systems and cooling centres during heat waves.',
    'Cold-water tubs at marathons and military training.',
    'Mountain and sea rescue, where hypothermia is managed from the first minutes.'
  ],
  sim: 'fa-body-temp'
}

);
