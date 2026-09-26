/* HYPER-MEDICINE · content/heart.js — the heart: its chambers and valves, the cardiac cycle,
 * the electrocardiogram and cardiac output. Simulations in sims/cardio.js (and the reference ECG). */
Hyper.add(

{
  id: 'heart-anatomy', parent: 'heart', title: 'The heart and its chambers', level: 1,
  short: 'A fist-sized muscular pump made of two pumps side by side: the right heart sends blood through the lungs, the left heart round the body. Four chambers, four one-way valves, its own arteries and its own electrical pacemaker.',
  keywords: ['heart', 'atrium', 'ventricle', 'left ventricle', 'right ventricle', 'valves', 'mitral valve', 'aortic valve', 'tricuspid', 'coronary arteries', 'sinoatrial node', 'pacemaker', 'pericardium', 'septum', 'congenital heart disease', 'pulmonary circulation', 'systemic circulation'],
  prereq: ['tissue-types', 'physics:pressure'],
  related: ['cardiac-cycle', 'blood-vessels', 'ecg', 'heart-attack', 'respiratory-system', 'blood-composition'],
  body: `
Put two fingers on the side of your neck, just beside the windpipe, and you feel the heart's work arriving a moment after each beat. The organ that makes it is a muscle about the size of a clenched fist, weighing roughly 300 g, lying behind the breastbone and tilted to the left. It beats about 100 000 times a day and some three billion times in a long life, and never rests for longer than a second.

### Two pumps side by side
The heart is really two pumps built into one body. The **right heart** receives blood that has given up much of its oxygen and sends it through the lungs; the **left heart** receives the refreshed blood from the lungs and sends it round the rest of the body. Each side has a thin-walled **atrium**, which collects the blood arriving in the veins, and a thick-walled **ventricle**, which does the pumping. The two circuits are joined in series — whatever the right ventricle pumps out must reach the left — so over a few beats both sides pump exactly the same volume.

| Chamber | Receives blood from | Sends it to | Typical pressure (mmHg) |
|---|---|---|---|
| Right atrium | the body, through the venae cavae | right ventricle | 2–6 |
| Right ventricle | right atrium | the lungs, through the pulmonary artery | 25 at the peak, 0–5 when relaxed |
| Left atrium | the lungs, through the pulmonary veins | left ventricle | 6–12 |
| Left ventricle | left atrium | the body, through the aorta | 120 at the peak, 5–12 when relaxed |

The left ventricle pushes against about five times the pressure of the right, and its wall is correspondingly thicker: about 1 cm against 3–5 mm. The rule behind this is Laplace's law — the stress in a chamber's wall grows with the pressure and the radius and falls with the wall's thickness — which also explains why an enlarged, stretched heart struggles ([[heart-failure]]).

### Four valves
Four one-way valves keep blood moving forward. Between each atrium and its ventricle sit the **tricuspid** (right) and **mitral** (left) valves, whose leaflets are tethered by tendon-like cords so they cannot flip back into the atria; at the two exits sit the **pulmonary** and **aortic** valves. They open and close passively, pushed by differences in pressure, and the sound of them closing is the "lub-dub" of the [[cardiac-cycle]]. A valve that does not open fully is **stenotic**, one that leaks is **regurgitant**; both make the heart work harder and often cause a **murmur**, the sound of turbulent flow.

### Its own blood supply and its own wiring
The heart muscle cannot feed from the blood inside its chambers. It has its own **coronary arteries**, which leave the aorta just above the aortic valve: the left main artery splits into the left anterior descending and circumflex branches, and the right coronary artery curls round the other side. At rest the heart receives only about 5 % of the blood it pumps, but it removes some 70 % of the oxygen from it — so when it needs more oxygen, only more flow will do. That is why a narrowed coronary artery ([[atherosclerosis]]) causes chest pain on exertion and a blocked one causes a [[heart-attack|heart attack]].

Each beat starts in the **sinoatrial node**, a small patch of pacemaker cells in the right atrium that fires by itself. The wave spreads across both atria, is held up for about a tenth of a second in the **atrioventricular node** — giving the atria time to top up the ventricles — then races down the **bundle of His**, its two branches and the **Purkinje fibres**, so that the ventricles contract from the tip upward and squeeze blood towards the exits. The [[ecg]] records this wave from the skin. Nerves do not start the beat; they only adjust it: sympathetic nerves and adrenaline speed and strengthen it, the vagus nerve slows it.

> [!fact] A heart removed from the body keeps beating by itself for as long as it is given oxygen and fuel. That is what makes transplantation possible: the new heart beats without any of its nerves reconnected.

The whole heart hangs in the **pericardium**, a double-walled sac with a few millilitres of lubricating fluid.

### When it is built differently
About one baby in a hundred is born with a heart defect, from a small hole between the chambers that closes by itself to complex malformations corrected by surgery in infancy. Before birth the lungs are not in use, so blood bypasses them through an opening between the atria (the foramen ovale) and a short vessel joining the pulmonary artery to the aorta (the ductus arteriosus); both normally close within days of birth.

> [!warn] Chest pain or pressure lasting more than a few minutes, especially with breathlessness, sweating or feeling faint, may be a heart attack: call your local emergency number. Breathlessness on mild exertion, swollen ankles, palpitations or fainting are worth reporting to a doctor soon.
`,
  ideas: [
    'The heart is two pumps in series: the right heart pumps through the lungs, the left heart through the body, and over time both move the same volume.',
    'Atria collect blood; ventricles pump it. The left ventricle works at about five times the pressure of the right and has the thickest wall.',
    'Four passive one-way valves keep flow forward; their closing makes the heart sounds.',
    'The heart muscle is fed by its own coronary arteries, and extracts most of their oxygen even at rest.',
    'The sinoatrial node starts each beat; the AV node delays it; nerves only speed or slow the rhythm.'
  ],
  pitfalls: [
    'Arteries carry oxygen-rich blood and veins oxygen-poor blood — Arteries carry blood away from the heart and veins towards it. The pulmonary artery carries oxygen-poor blood to the lungs and the pulmonary veins bring oxygen-rich blood back.',
    'The left side of the heart pumps more blood than the right — Both sides pump the same volume per minute (they are in series); the left side pumps it at a much higher pressure.',
    'The heart feeds on the blood inside its chambers — It has its own coronary arteries, which is why blocking one of them damages the muscle.'
  ],
  formulas: [
    {
      name: 'Blood pumped over a period',
      expr: 'V = HR*SV*t', tex: 'V = \\text{HR} \\times \\text{SV} \\times t',
      vars: {
        V: { name: 'volume pumped', q: 'volume', unit: 'L' },
        HR: { name: 'heart rate', q: 'frequency', unit: 'bpm', value: 70, min: 40, max: 200, tex: '\\text{HR}' },
        SV: { name: 'stroke volume', q: 'volume', unit: 'mL', value: 70, tex: '\\text{SV}' },
        t: { name: 'time', q: 'time', unit: 'day', value: 1 }
      },
      note: 'Heart rate times stroke volume is the cardiac output; multiplied by a time it gives the total volume pumped. At rest this is about 7 000 L a day.',
      practice: { unknowns: ['V', 'SV'] },
      stories: { V: 'A resting heart beats {HR} and ejects {SV} each beat. How much blood does it pump in {t}?', SV: 'A heart beating at {HR} pumps {V} in {t}. What is its average stroke volume?' }
    },
    {
      name: 'Heartbeats in a lifetime',
      expr: 'N = HR*t', tex: 'N = \\text{HR} \\times t',
      vars: {
        N: { name: 'number of beats', q: 'count', unit: '' },
        HR: { name: 'average heart rate', q: 'frequency', unit: 'bpm', value: 70, min: 40, max: 120, tex: '\\text{HR}' },
        t: { name: 'time', q: 'time', unit: 'yr', value: 80 }
      },
      note: 'An average of 70 a minute for 80 years is about three billion beats.',
      practice: { unknowns: ['N'] },
      stories: { N: 'How many times does a heart beating at an average {HR} beat in {t}?' }
    }
  ],
  examples: [
    {
      title: 'A day\'s work',
      q: 'At rest a heart beats 70 times a minute and ejects 70 mL each time. How much blood does it pump in a minute and in a day, and how many beats is that?',
      steps: [
        'Per minute: $70 \\times 70\\ \\text{mL} = 4900$ mL, about 4.9 L — roughly the whole blood volume.',
        'Per day: $4.9\\ \\text{L} \\times 60 \\times 24 = 7056$ L, the weight of about seven tonnes of blood.',
        'Beats per day: $70 \\times 60 \\times 24 = 100\\,800$.',
        'And in exercise the output can rise four- or fivefold for a while.'
      ],
      a: 'About 4.9 L a minute, 7 000 L a day, in about 100 000 beats.'
    },
    {
      title: 'Following a drop of blood',
      q: 'Trace a red cell from a vein in the foot back to the foot, naming each chamber and valve it passes.',
      steps: [
        'Leg veins → inferior vena cava → **right atrium** → tricuspid valve → **right ventricle** → pulmonary valve → pulmonary artery.',
        'Lung capillaries, where it picks up oxygen and drops carbon dioxide → pulmonary veins → **left atrium** → mitral valve → **left ventricle**.',
        'Aortic valve → aorta → the leg arteries → arterioles → capillaries of the foot, where it gives up oxygen → venules → veins again.',
        'At rest the round trip takes about a minute: 5 L of blood pumped at 5 L/min.'
      ],
      a: 'Right atrium, right ventricle, lungs, left atrium, left ventricle, body — through the tricuspid, pulmonary, mitral and aortic valves in that order.'
    }
  ],
  quiz: [
    { q: 'Which chamber has the thickest wall?', choices: ['right atrium', 'right ventricle', 'left atrium', 'left ventricle'], a: 3,
      why: 'The left ventricle pumps against the high pressure of the body\'s arteries (about 120 mmHg at the peak), roughly five times what the right ventricle faces, so it needs a much thicker wall.' },
    { q: 'The blood in the pulmonary artery is…', choices: ['low in oxygen, on its way to the lungs', 'rich in oxygen, on its way to the body', 'rich in oxygen, on its way back from the lungs', 'a mixture of both'], a: 0,
      why: 'An artery is any vessel leaving the heart. The pulmonary artery leaves the right ventricle carrying the oxygen-poor blood that has just come back from the body.' },
    { q: 'Over several minutes the right ventricle pumps the same volume of blood as the left ventricle.', a: true,
      why: 'The two circuits are in series, so any difference would make blood pile up in the lungs or the body within minutes. The Frank–Starling mechanism keeps the two outputs matched beat by beat.' },
    { q: 'If the sinoatrial node stops firing, what usually happens?', choices: ['the heart stops for good', 'a slower back-up pacemaker lower down takes over', 'the heart speeds up', 'the atria keep beating but the ventricles stop'], a: 1,
      why: 'Cells in the AV junction (about 40–60 a minute) and in the ventricles (20–40 a minute) can fire on their own; they are normally suppressed by the faster sinus node.' },
    { q: 'At 5 L/min, roughly how many litres of blood does the heart pump in a day?', answer: 7200, unit: 'L',
      why: '5 L/min × 60 × 24 = 7 200 L.' }
  ],
  applications: ['Listening with a stethoscope for murmurs and extra sounds.', 'Echocardiography: ultrasound pictures of the chambers, walls and valves in motion.', 'Valve repair and replacement, including valves inserted through a catheter.', 'Heart transplantation and mechanical heart pumps.'],
  history: 'William Harvey showed in 1628 that blood circulates: he estimated how much the heart ejects with each beat and saw that the body could not possibly make that much blood anew. The capillaries that close the loop were first seen under the microscope by Marcello Malpighi in 1661.',
  sim: 'cv-loop'
},

{
  id: 'cardiac-cycle', parent: 'heart', title: 'The cardiac cycle', level: 2,
  short: 'The ordered sequence of one heartbeat: filling, contraction with the valves shut, ejection and relaxation. Valves open and close only when pressures cross, and their closing makes the heart sounds.',
  keywords: ['cardiac cycle', 'systole', 'diastole', 'Wiggers diagram', 'pressure-volume loop', 'isovolumic contraction', 'isovolumic relaxation', 'ejection fraction', 'stroke volume', 'end-diastolic volume', 'heart sounds', 'S1', 'S2', 'murmur', 'dicrotic notch', 'atrial kick', 'stroke work'],
  prereq: ['heart-anatomy', 'physics:pressure', 'physics:work'],
  related: ['ecg', 'blood-pressure', 'cardiac-output', 'heart-failure', 'arrhythmias', 'physics:sound-waves'],
  body: `
Listen to a heart with a stethoscope and you hear two sounds, *lub-dub*, then a pause. Those sounds are valves snapping shut, and between them runs a precisely ordered sequence of pressures and volumes that repeats with every beat — the **cardiac cycle**. It is traditionally drawn as a **Wiggers diagram**: the pressures in the left atrium, left ventricle and aorta, and the volume of the ventricle, plotted against time through one beat.

### Four phases
One rule explains everything: **a valve opens when the pressure behind it exceeds the pressure in front of it, and closes when that reverses.**

1. **Filling (diastole).** The ventricle is relaxed and its pressure is below the atrium's, so the mitral valve is open and blood flows in — fast at first, as the relaxing ventricle almost sucks it in, then slowly. At the end the atrium contracts and adds a last 15–25 % (the *atrial kick*, which is lost in [[arrhythmias|atrial fibrillation]]).
2. **Isovolumic contraction.** The ventricle begins to contract. As soon as its pressure passes the atrium's, the mitral valve closes — the **first heart sound, S1**. For about 50 ms both valves are shut: the pressure shoots up while the volume cannot change.
3. **Ejection (systole).** When ventricular pressure passes the pressure in the aorta, about 80 mmHg, the aortic valve opens and blood rushes out; pressure peaks near 120 mmHg. About 70 mL leaves — typically 55–70 % of what the ventricle held.
4. **Isovolumic relaxation.** The muscle relaxes, ventricular pressure falls below aortic pressure, and the aortic valve closes — the **second heart sound, S2**, and a small notch in the aortic pressure trace. With both valves shut again the pressure falls steeply until it drops below the atrium's; the mitral valve opens and filling starts again.

The right heart runs through the same cycle at a fraction of the pressure, peaking at about 25 mmHg.

### The pressure–volume loop
Plot the ventricle's pressure against its volume instead of against time and one beat traces a loop: along the bottom as it fills (from about 50 to 120 mL at low pressure), straight up while both valves are shut, across the top as it ejects, and straight down as it relaxes. The loop's **width is the stroke volume** and its **area is the work** done on the blood — about one joule per beat, a little over a watt at rest. The top-left corner lies on the *end-systolic line*, whose slope measures how strongly the muscle contracts (its contractility); the bottom follows the *filling curve*, which shows how stiff the relaxed ventricle is. Heart disease shows up as a changed loop: a weak ventricle's loop slides to the right and flattens, a stiff ventricle's filling curve rises steeply so that it fills only at high pressure ([[heart-failure]]).

### Timing and heart rate
At 75 beats a minute a cycle lasts 0.8 s: roughly 0.3 s of systole and 0.5 s of diastole. As the rate rises, systole shortens only a little and diastole a lot; at 150 a minute a beat lasts 0.4 s and diastole perhaps 0.15 s. Two things suffer: the time the ventricle has to fill, and the time the heart muscle has to receive its own blood, because the coronary arteries are squeezed during contraction and fill mainly in diastole. That is why a very fast rhythm lowers the output and can bring on chest pain.

### Sounds and murmurs
Healthy valves make sound only when they close. A third sound (S3) just after the mitral valve opens is normal in children and young adults but, in an older person, can mean an overfilled or failing ventricle; a fourth (S4) is the atrial kick hitting a stiff ventricle. A **murmur** is the whoosh of turbulent flow: forward through a narrowed valve (stenosis), backward through a leaking one (regurgitation), or simply brisk flow in a healthy child — an *innocent* murmur. Doctors place a murmur in the cycle by timing it against S1 and S2, and confirm what they hear with an echocardiogram.

> [!tip] A murmur found at a routine check-up is often innocent. The usual next step is an echocardiogram, which shows each valve opening and closing. Fainting or chest pain on exertion in someone with a murmur should be reported to a doctor promptly, since a tightly narrowed aortic valve can cause both.
`,
  ideas: [
    'Valves open and close passively, whenever the pressures on their two sides cross.',
    'A beat has four phases: filling, isovolumic contraction, ejection and isovolumic relaxation.',
    'S1 is the mitral and tricuspid valves closing at the start of systole; S2 is the aortic and pulmonary valves closing at its end.',
    'On a pressure–volume loop the width is the stroke volume and the area is the work of the beat.',
    'Faster heart rates shorten diastole most, cutting filling time and the heart muscle\'s own blood supply.'
  ],
  pitfalls: [
    'The first heart sound is the muscle contracting — Heart sounds come from valves closing: S1 is the mitral and tricuspid valves, S2 the aortic and pulmonary valves. Opening valves are silent.',
    'The ventricle empties completely with each beat — It ejects only about 55–70 % of its contents; some 50 mL stays behind (the end-systolic volume), a reserve that can be used in exercise.',
    'Systole and diastole last about equally long — At rest diastole takes about two-thirds of the beat, and it is diastole that shrinks most as the heart speeds up.'
  ],
  formulas: [
    {
      name: 'Stroke volume',
      expr: 'SV = EDV - ESV', tex: '\\text{SV} = \\text{EDV} - \\text{ESV}',
      vars: {
        SV: { name: 'stroke volume', q: 'volume', unit: 'mL', tex: '\\text{SV}' },
        EDV: { name: 'end-diastolic volume (full)', q: 'volume', unit: 'mL', value: 120, tex: '\\text{EDV}' },
        ESV: { name: 'end-systolic volume (after ejection)', q: 'volume', unit: 'mL', value: 50, tex: '\\text{ESV}' }
      },
      note: 'The width of the pressure–volume loop.',
      stories: { SV: 'An echocardiogram shows a left ventricle holding {EDV} when full and {ESV} after it contracts. What is the stroke volume?' }
    },
    {
      name: 'Ejection fraction',
      expr: 'EF = (EDV - ESV)/EDV', tex: '\\text{EF} = \\frac{\\text{EDV} - \\text{ESV}}{\\text{EDV}}',
      vars: {
        EF: { name: 'ejection fraction', q: 'ratio', unit: '%', tex: '\\text{EF}' },
        EDV: { name: 'end-diastolic volume', q: 'volume', unit: 'mL', value: 120, tex: '\\text{EDV}' },
        ESV: { name: 'end-systolic volume', q: 'volume', unit: 'mL', value: 50, tex: '\\text{ESV}' }
      },
      note: 'Normally about 55–70 %. Heart failure is classed by it: 40 % or less is "reduced", 41–49 % "mildly reduced", 50 % or more "preserved".',
      practice: { unknowns: ['EF', 'ESV'] },
      stories: { EF: 'A ventricle fills to {EDV} and empties to {ESV}. What is its ejection fraction?', ESV: 'A dilated ventricle holds {EDV} and has an ejection fraction of {EF}. What volume is left after each beat?' }
    },
    {
      name: 'Work of one beat',
      expr: 'W = P*SV', tex: 'W = \\bar{P} \\times \\text{SV}',
      vars: {
        W: { name: 'work done on the blood', q: 'energy', unit: 'J' },
        P: { name: 'mean pressure rise during ejection', q: 'pressure', unit: 'mmHg', value: 100, tex: '\\bar{P}' },
        SV: { name: 'stroke volume', q: 'volume', unit: 'mL', value: 70, tex: '\\text{SV}' }
      },
      note: 'Approximately the area of the pressure–volume loop: pressure times volume is energy (1 mmHg·mL ≈ 0.000133 J).',
      practice: { unknowns: ['W'] },
      stories: { W: 'A ventricle ejects {SV} against an average pressure {P} higher than it filled at. How much work does one beat do?' }
    },
    {
      name: 'Time left for filling',
      expr: 'td = 1/HR - ts', tex: 't_d = \\frac{1}{\\text{HR}} - t_s',
      vars: {
        td: { name: 'duration of diastole', q: 'time', unit: 's', tex: 't_d' },
        HR: { name: 'heart rate', q: 'frequency', unit: 'bpm', value: 75, min: 40, max: 180, tex: '\\text{HR}' },
        ts: { name: 'duration of systole', q: 'time', unit: 's', value: 0.3, min: 0.2, max: 0.4, tex: 't_s' }
      },
      note: '1/HR is the length of one beat (60/HR seconds when HR is in beats per minute). Systole shortens only a little at fast rates, so diastole takes the cut.',
      practice: { unknowns: ['td'] },
      stories: { td: 'At {HR}, with systole lasting {ts}, how long does the ventricle have to fill?' }
    }
  ],
  examples: [
    {
      title: 'Reading a pressure–volume loop',
      q: 'A left ventricle\'s loop runs from 125 mL (full) to 55 mL (after ejection); during ejection the pressure averages about 105 mmHg, and it fills at about 5 mmHg. Find the stroke volume, the ejection fraction and the work of one beat. What power does that represent at 70 beats a minute?',
      steps: [
        'Stroke volume: $125 - 55 = 70$ mL.',
        'Ejection fraction: $70 / 125 = 0.56$, or 56 % — normal.',
        { text: 'Work ≈ loop area ≈ pressure rise × stroke volume:', tex: 'W \\approx (105 - 5)\\,\\text{mmHg} \\times 70\\,\\text{mL} = 7000\\,\\text{mmHg·mL} \\approx 0.93\\,\\text{J}' },
        'Power: $0.93\\ \\text{J} \\times 70/60 \\approx 1.1$ W — about the power of a small torch bulb, delivered without a break for a lifetime.'
      ],
      a: 'SV 70 mL, EF 56 %, about 0.93 J per beat and 1.1 W.'
    },
    {
      title: 'A racing heart',
      q: 'At 75 beats a minute systole takes 0.30 s. In a fast rhythm of 150 a minute it shortens to 0.25 s. How much time is left for filling in each case?',
      steps: [
        'At 75 a minute a beat lasts $60/75 = 0.80$ s, so diastole lasts $0.80 - 0.30 = 0.50$ s.',
        'At 150 a minute a beat lasts $60/150 = 0.40$ s, so diastole lasts $0.40 - 0.25 = 0.15$ s.',
        'The rate doubled, but filling time fell to less than a third. In a fit person exercising, stronger relaxation and more venous return make up for much of this; in a heart that fills slowly — stiff, or with a narrowed mitral valve — the stroke volume falls.'
      ],
      a: '0.50 s at 75 a minute, 0.15 s at 150 a minute.'
    }
  ],
  quiz: [
    { q: 'The aortic valve opens when…', choices: ['the ventricle starts to contract', 'ventricular pressure rises above aortic pressure', 'the ventricle is completely full', 'the atrium contracts'], a: 1,
      why: 'Valves respond only to pressure. The ventricle contracts with both valves shut until its pressure exceeds the aortic pressure (about 80 mmHg); only then does the aortic valve open.' },
    { q: 'During isovolumic contraction the ventricle\'s…', choices: ['pressure rises and its volume stays the same', 'volume falls and its pressure stays the same', 'pressure and volume both fall', 'volume rises as the atrium empties'], a: 0,
      why: 'Both valves are closed, so no blood can enter or leave: the contracting muscle raises the pressure at constant volume — a vertical line on the pressure–volume loop.' },
    { q: 'A ventricle fills to 130 mL and empties to 55 mL. What is its ejection fraction, in per cent?', answer: 57.7,
      why: 'Stroke volume 130 − 55 = 75 mL; 75 / 130 = 0.577, about 58 %.' },
    { q: 'As the heart rate rises from 60 to 150 a minute, which part of the beat shrinks most?', choices: ['isovolumic contraction', 'ejection', 'diastole (filling)', 'all shrink equally'], a: 2,
      why: 'Systole is shortened only a little; diastole takes most of the cut, which limits filling and the coronary blood flow that happens mainly in diastole.' },
    { q: 'The second heart sound (S2) marks the aortic and pulmonary valves closing at the end of ejection.', a: true,
      why: 'S2 comes as the ventricles relax and their pressure falls below that in the aorta and pulmonary artery, snapping those valves shut.' }
  ],
  applications: ['Echocardiography measures volumes and the ejection fraction, the most used number in cardiology.', 'Timing murmurs against S1 and S2 to tell which valve is diseased.', 'Pressure–volume loops measured with catheters in research and intensive care.', 'Pacemakers that time the atria and ventricles to keep the atrial kick.'],
  history: 'The American physiologist Carl Wiggers published his diagram of the cycle in 1915. Otto Frank had drawn pressure–volume loops of the frog heart in the 1890s; their modern analysis came from Kiichi Sagawa and colleagues in the 1970s.',
  sim: 'cv-wiggers'
},

{
  id: 'ecg', parent: 'heart', title: 'The electrocardiogram (ECG)', level: 2,
  short: 'A recording of the heart\'s electrical activity from electrodes on the skin. Its waves — P, QRS and T — show the rate and rhythm, how the impulse travels, and signs of a heart attack, thickened muscle or salt imbalance.',
  keywords: ['ECG', 'EKG', 'electrocardiogram', 'P wave', 'QRS complex', 'T wave', 'PR interval', 'QT interval', 'QTc', 'Bazett', 'Fridericia', '12-lead', 'ST elevation', 'heart rate', 'rhythm strip', 'Holter monitor', 'smartwatch'],
  prereq: ['heart-anatomy', 'membrane-potential', 'physics:electric-potential'],
  related: ['arrhythmias', 'heart-attack', 'action-potential', 'electrolytes', 'cardiac-cycle', 'electronics:instrumentation-amplifier'],
  body: `
Every heartbeat begins as an electrical wave, and because the body is a salty, conducting medium, a trace of that electricity reaches the skin. An **electrocardiogram** (ECG, or EKG) picks it up with electrodes on the chest and limbs — about a thousandth of a volt — and draws it on paper moving at 25 mm a second. It takes a few minutes, is painless and cheap, and is one of the most useful tests in medicine.

### Where the waves come from
A resting heart-muscle cell is about 90 mV negative inside ([[membrane-potential]]). When the wave of excitation arrives, sodium rushes in and the cell *depolarises*; calcium then flows in and holds it there for about a quarter of a second — the plateau that makes the contraction last and keeps the next impulse from arriving too soon — before potassium leaving *repolarises* it. A wave of depolarisation travelling towards an electrode draws an upward deflection, one travelling away a downward one: each lead is a voltmeter watching a moving front of charge ([[physics:electric-potential|electric potential]]). The signal is tiny beside the hum from mains wiring, so ECG machines use a differential amplifier that cancels whatever two electrodes pick up in common ([[electronics:instrumentation-amplifier|instrumentation amplifier]]).

| Part | What it shows | Normal duration (adults) |
|---|---|---|
| P wave | the atria depolarising | under 0.12 s |
| PR interval | from atria to ventricles, mostly the delay in the AV node | 0.12–0.20 s |
| QRS complex | the ventricles depolarising — a big muscle, a big fast wave | under 0.12 s, usually under 0.10 s |
| ST segment | the ventricles fully depolarised: normally flat | — |
| T wave | the ventricles repolarising | — |
| QT interval | from the start of QRS to the end of T | shortens with rate, so it is corrected (QTc) |

The atria's own repolarisation is hidden inside the QRS.

### Reading the paper
On standard paper a small square is 1 mm, or 0.04 s, and a large square 5 mm, or 0.2 s; upward, 10 mm is 1 mV. A minute holds 300 large squares, so **heart rate ≈ 300 ÷ the number of large squares between two R waves**: four squares means 75 a minute. A systematic reading asks: What is the rate? Is it regular? Is there a P wave before every QRS and a QRS after every P? Are the PR and QRS intervals normal? Is the ST segment flat? Is the QT too long?

The QT interval naturally shortens as the heart speeds up, so it is **corrected** to a rate of 60 a minute. Bazett's formula divides by the square root of the RR interval (in seconds); Fridericia's by the cube root, which is more accurate at fast rates. A corrected QT above about 450 ms in men or 460 ms in women is prolonged, and above 500 ms carries a real risk of a dangerous rhythm; many medicines, low potassium and some inherited conditions lengthen it. The [heart calculators](#/tools/clinical/heart) correct a QT for you.

A standard **12-lead ECG** combines ten electrodes into twelve views: six from the limbs, looking at the heart in the upright (frontal) plane, and six across the chest, looking at it horizontally. Each lead faces a particular wall of the left ventricle, so the pattern of changes shows *where* a problem is.

### What it can show — and what it cannot
- **Rhythm problems** such as atrial fibrillation, heart block and ventricular tachycardia ([[arrhythmias]]) — try them in the simulation.
- **A heart attack**: ST elevation in the leads facing one wall means a coronary artery is probably blocked right now and must be reopened urgently ([[heart-attack]]).
- **Thickened muscle** (large voltages), and **salt imbalances**: high potassium makes tall, peaked T waves ([[electrolytes]]).

A normal resting ECG does not rule out coronary disease, since narrowed arteries often cause changes only during exertion; an exercise test, a scan or a CT is used for that. Rhythms that come and go are caught by longer recordings — a 24-hour Holter monitor, a patch worn for one or two weeks, an implanted loop recorder, or increasingly a smartwatch, whose single-lead tracing must be confirmed by a clinician before anyone is treated.

> [!warn] Palpitations with chest pain, fainting or severe breathlessness are an emergency: call your local emergency number. If someone collapses and is not breathing normally, call, start chest compressions and send for a defibrillator ([[cpr|CPR and defibrillation]]).
`,
  ideas: [
    'The ECG records, from the skin, the wave of depolarisation and repolarisation that sweeps through the heart.',
    'P is the atria, QRS the ventricles depolarising, T the ventricles repolarising; the PR interval is mostly AV-node delay.',
    'On standard paper a large square is 0.2 s, so the rate is about 300 divided by the number of large squares between beats.',
    'The QT interval depends on heart rate and is corrected (QTc); a long QTc raises the risk of dangerous rhythms.',
    'Twelve leads view the heart from different directions, which locates a heart attack; a normal resting ECG does not exclude coronary disease.'
  ],
  pitfalls: [
    'The ECG shows how strongly the heart pumps — It shows only electrical activity. A heart can produce a near-normal ECG while pumping poorly; pumping is judged by echocardiography.',
    'A normal ECG means the heart is healthy — Narrowed coronary arteries, valve disease and rhythms that come and go are often missed by a resting ECG.',
    'The biggest spike, the R wave, is the heart contracting — It is the electrical signal that triggers contraction; the mechanical squeeze follows a few hundredths of a second later.'
  ],
  formulas: [
    {
      name: 'Heart rate from the RR interval',
      expr: 'HR = 60/RR', tex: '\\text{HR} = \\frac{60}{\\text{RR}}',
      vars: {
        HR: { name: 'heart rate (beats per minute)', tex: '\\text{HR}' },
        RR: { name: 'RR interval (seconds)', value: 0.8, tex: '\\text{RR}' }
      },
      note: 'Only meaningful for a regular rhythm; for an irregular one count the beats in 6 or 10 seconds instead.',
      practice: { unknowns: ['HR', 'RR'] },
      stories: { HR: 'The R waves on a regular strip are {RR} s apart. What is the heart rate in beats per minute?', RR: 'A heart beats regularly at {HR} a minute. How many seconds apart are its R waves?' }
    },
    {
      name: 'The "300 rule" for standard ECG paper',
      expr: 'HR = 300/n', tex: '\\text{HR} = \\frac{300}{n}',
      vars: {
        HR: { name: 'heart rate (beats per minute)', tex: '\\text{HR}' },
        n: { name: 'large (5 mm) squares between two R waves', value: 4 }
      },
      note: 'At 25 mm/s a large square is 0.2 s, and a minute holds 300 of them. With small squares use 1500 instead of 300.',
      practice: { unknowns: ['HR'] },
      stories: { HR: 'Two R waves are {n} large squares apart. What is the rate?' }
    },
    {
      name: 'Corrected QT interval (Bazett)',
      expr: 'QTc = QT/sqrt(RR)', tex: '\\text{QTc} = \\frac{\\text{QT}}{\\sqrt{\\text{RR}}}',
      vars: {
        QTc: { name: 'corrected QT interval (ms)', tex: '\\text{QTc}' },
        QT: { name: 'measured QT interval (ms)', value: 400, tex: '\\text{QT}' },
        RR: { name: 'RR interval (seconds)', value: 0.8, tex: '\\text{RR}' }
      },
      note: 'An empirical formula (Bazett, 1920): RR must be in seconds. It over-corrects at fast rates and under-corrects at slow ones.',
      practice: { unknowns: ['QTc'] },
      stories: { QTc: 'The QT interval is {QT} ms with R waves {RR} s apart. What is the QTc by Bazett\'s formula?' }
    },
    {
      name: 'Corrected QT interval (Fridericia)',
      expr: 'QTc = QT/cbrt(RR)', tex: '\\text{QTc} = \\frac{\\text{QT}}{\\sqrt[3]{\\text{RR}}}',
      vars: {
        QTc: { name: 'corrected QT interval (ms)', tex: '\\text{QTc}' },
        QT: { name: 'measured QT interval (ms)', value: 360, tex: '\\text{QT}' },
        RR: { name: 'RR interval (seconds)', value: 0.6, tex: '\\text{RR}' }
      },
      note: 'Also empirical (Fridericia, 1920), and more accurate than Bazett\'s at fast heart rates; many drug-safety studies use it.',
      practice: { unknowns: ['QTc'] },
      stories: { QTc: 'With R waves {RR} s apart, the QT interval is {QT} ms. What is the QTc by Fridericia\'s formula?' }
    }
  ],
  examples: [
    {
      title: 'Rate and rhythm from a strip',
      q: 'On a lead-II strip the R waves are regularly 3¾ large squares apart; each QRS is narrow and preceded by an upright P wave, with a PR interval of four small squares. Describe the rhythm.',
      steps: [
        'RR interval: $3.75 \\times 0.2 = 0.75$ s, so the rate is $60/0.75 = 80$ a minute (or $300/3.75 = 80$).',
        'Regular, a P wave before every QRS, PR $= 4 \\times 0.04 = 0.16$ s (normal, 0.12–0.20 s), narrow QRS.',
        'All of this is the signature of the sinus node driving the heart through a normal conduction system.'
      ],
      a: 'Normal sinus rhythm at 80 a minute.'
    },
    {
      title: 'Correcting the QT at a fast rate',
      q: 'At a heart rate of 100 a minute the QT interval is 360 ms. Correct it with Bazett\'s and Fridericia\'s formulas. Is it prolonged?',
      steps: [
        'RR interval: $60/100 = 0.6$ s.',
        'Bazett: $360/\\sqrt{0.6} = 360/0.775 = 465$ ms — borderline long.',
        'Fridericia: $360/\\sqrt[3]{0.6} = 360/0.843 = 427$ ms — normal.',
        'The two disagree because Bazett over-corrects at fast rates; at 100 a minute Fridericia\'s value is the more trustworthy.'
      ],
      a: 'About 465 ms (Bazett) or 427 ms (Fridericia); most likely normal.'
    }
  ],
  quiz: [
    { q: 'On standard paper two R waves are 5 large squares apart. What is the heart rate, in beats per minute?', answer: 60,
      why: '5 large squares × 0.2 s = 1.0 s between beats, so 60 a minute (300 ÷ 5).' },
    { q: 'Which part of the ECG records the ventricles depolarising?', choices: ['the P wave', 'the PR interval', 'the QRS complex', 'the T wave'], a: 2,
      why: 'The large ventricular muscle depolarising quickly makes the biggest, sharpest deflection: the QRS. The T wave is the ventricles recovering.' },
    { q: 'Every P wave is followed by a QRS, but the PR interval is 0.30 s. This suggests…', choices: ['atrial fibrillation', 'first-degree AV block', 'ventricular tachycardia', 'a heart attack'], a: 1,
      why: 'A PR interval above 0.20 s with every impulse still conducted means slowed conduction through the AV node: first-degree block, often harmless.' },
    { q: 'A normal resting ECG rules out narrowed coronary arteries.', a: false,
      why: 'Narrowed arteries usually starve the muscle only when demand rises. At rest the ECG can be entirely normal, which is why exercise tests and imaging exist.' },
    { q: 'The QT is 440 ms at a heart rate of 100 a minute. What is the QTc by Bazett\'s formula, in ms?', answer: 568,
      why: 'RR = 0.6 s; 440 / √0.6 = 440 / 0.775 ≈ 568 ms. Even allowing for Bazett\'s over-correction (Fridericia gives about 522 ms) this is clearly prolonged.' }
  ],
  applications: ['Diagnosing a heart attack in the ambulance and emergency department within minutes.', 'Finding the cause of palpitations or fainting with long-term monitors and smartwatches.', 'Checking the QT interval before and during treatment with medicines that can lengthen it.', 'Pre-participation screening of athletes in some countries.'],
  history: 'Willem Einthoven recorded clear human ECGs with his string galvanometer in 1901–1903, named the P, Q, R, S and T waves, and received the Nobel Prize in 1924. Augustus Waller had recorded the first, much cruder, human trace in 1887.',
  sim: 'ref-ecg'
},

{
  id: 'cardiac-output', parent: 'heart', title: 'Cardiac output', level: 2,
  short: 'The volume of blood the heart pumps per minute: heart rate times stroke volume, about 5 L/min at rest and four to seven times that in hard exercise. The stroke is set by filling, contractility and the pressure it pumps against.',
  keywords: ['cardiac output', 'stroke volume', 'heart rate', 'cardiac index', 'Frank-Starling', 'preload', 'afterload', 'contractility', 'venous return', 'Fick principle', 'maximum heart rate', 'exercise', 'VO2 max', 'cardiac power', 'shock'],
  prereq: ['cardiac-cycle', 'nervous-system-organization', 'oxygen-transport'],
  related: ['blood-pressure', 'hemodynamics', 'heart-failure', 'physical-activity', 'bleeding-shock', 'physics:power'],
  body: `
At rest your heart moves about 5 litres of blood a minute — roughly all the blood in your body, once a minute. Run up a steep hill and it may move 20; a top endurance athlete can reach 35 or more. That volume per minute is the **cardiac output**, and it is the product of two numbers: how often the heart beats, and how much it ejects each time.

$$\\text{CO} = \\text{HR} \\times \\text{SV}$$

Seventy beats a minute times 70 mL a beat is about 4.9 L/min. To compare people of different sizes, doctors divide by the body surface area to get the **cardiac index**, normally about 2.5–4 L/min per square metre.

### What sets the stroke volume
- **Preload** — how much the ventricle is filled and stretched before it contracts. The more it is stretched, the harder it contracts: the **Frank–Starling law**. Stretched muscle has its filaments better placed and becomes more sensitive to calcium. The law keeps the two sides of the heart in step automatically: if the right ventricle pumps a little more for a few beats, the left fills a little more and pumps more too, so blood cannot pile up in the lungs.
- **Contractility** — how strongly the muscle contracts at a given stretch. Sympathetic nerves and adrenaline raise it; damaged muscle and some medicines lower it.
- **Afterload** — what the ventricle pushes against, mainly the pressure in the aorta. A higher pressure leaves less of each contraction for ejecting blood, so the stroke is smaller.

### What sets the rate
Left to itself the sinoatrial node fires about 100 times a minute; at rest the vagus nerve holds it down to 60–80. In exercise that brake comes off and sympathetic nerves push the rate up towards a maximum that falls with age — on average about 208 − 0.7 × age (Tanaka's formula, 2001), though individuals differ by 10–20 beats either way. Early in exercise both the rate and the stroke rise; beyond moderate effort the stroke levels off and the rate does the rest.

### Why output can rise at all
The heart can only pump what comes back to it. In exercise the muscles' arterioles open wide, the rhythmic squeezing of the leg muscles pushes blood up the veins, the veins tighten, and deeper breathing draws blood into the chest. More blood returns, the heart fills more, the Frank–Starling law enlarges the stroke, and adrenaline raises both contractility and rate. Endurance training enlarges the ventricles, so a trained heart ejects more with each beat: the resting pulse may be 40–50, and the maximum output far higher than an untrained person's at the same maximum rate.

### Measuring it
The oldest method is **Fick's principle** (1870): the oxygen the body takes up each minute must equal the blood flow times the oxygen each litre picks up in the lungs. At rest, 250 mL of oxygen a minute, with arterial blood carrying 200 mL per litre and returning venous blood 150 mL per litre, means $250 / 50 = 5$ L/min ([[oxygen-transport]]). Today output is usually estimated by ultrasound (echocardiography), by injecting cold fluid through a catheter and timing its warming downstream (thermodilution), or from the shape of the arterial pulse.

### When output is too low
When the output cannot meet the body's needs the first signs are tiredness and breathlessness on exertion; when it is severe the result is **shock**: low blood pressure, cold, clammy skin, confusion and very little urine. The cause may be too little filling (bleeding or severe dehydration — [[bleeding-shock]]), a weak pump ([[heart-failure]], a large [[heart-attack]]), or a rhythm too slow or too fast ([[arrhythmias]]). The **cardiac power output** — mean pressure times flow — is about 1 watt at rest; in shock caused by a failing heart it often falls below about 0.6 W, a level linked to a high risk of death.

> [!warn] Signs of shock — pale, cold, clammy skin, a fast weak pulse, confusion or drowsiness, fainting, very little urine — are an emergency: call your local emergency number.
`,
  ideas: [
    'Cardiac output = heart rate × stroke volume: about 5 L/min at rest, 20–35 L/min in hard exercise.',
    'Stroke volume depends on preload (filling), contractility (squeeze) and afterload (the pressure pumped against).',
    'The Frank–Starling law — more stretch, stronger beat — keeps the right and left hearts matched.',
    'The heart can only pump what returns to it: venous return and the vessels matter as much as the pump.',
    'Fick\'s principle measures output from oxygen uptake and the oxygen difference between arterial and venous blood.'
  ],
  pitfalls: [
    'A faster heart rate always means more output — Above roughly 150–180 a minute the filling time is so short that the stroke volume falls; in a fast arrhythmia the output can drop sharply.',
    'The heart alone decides how much blood flows — It can pump only what returns. Venous return, set by the veins, the muscles and blood volume, is equally important.',
    'An athlete\'s slow resting pulse means a weak heart — It reflects a large stroke volume and strong vagal tone: the same output with fewer, bigger beats.'
  ],
  formulas: [
    {
      name: 'Cardiac output',
      expr: 'CO = HR*SV', tex: '\\text{CO} = \\text{HR} \\times \\text{SV}',
      vars: {
        CO: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', tex: '\\text{CO}' },
        HR: { name: 'heart rate', q: 'frequency', unit: 'bpm', value: 70, min: 40, max: 200, tex: '\\text{HR}' },
        SV: { name: 'stroke volume', q: 'volume', unit: 'mL', value: 70, tex: '\\text{SV}' }
      },
      note: 'About 5 L/min at rest in an adult.',
      practice: { unknowns: ['CO', 'SV'] },
      stories: { CO: 'During a brisk run the heart beats at {HR} with a stroke volume of {SV}. What is the cardiac output?', SV: 'A trained cyclist has a resting output of {CO} at a pulse of {HR}. What is the stroke volume?' }
    },
    {
      name: 'Cardiac index',
      expr: 'CI = CO/BSA', tex: '\\text{CI} = \\frac{\\text{CO}}{\\text{BSA}}',
      vars: {
        CI: { name: 'cardiac index (L/min per m²)', tex: '\\text{CI}' },
        CO: { name: 'cardiac output (L/min)', value: 5, tex: '\\text{CO}' },
        BSA: { name: 'body surface area', q: 'area', unit: 'm²', value: 1.9, tex: '\\text{BSA}' }
      },
      note: 'Normally about 2.5–4.0; below about 2.2 in someone with signs of poor circulation suggests the heart is not keeping up. The body-size calculator gives the surface area.',
      practice: { unknowns: ['CI'] },
      stories: { CI: 'A patient with a body surface area of {BSA} has a cardiac output of {CO} L/min. What is the cardiac index?' }
    },
    {
      name: 'Fick\'s principle',
      expr: 'CO = VO2/(Ca - Cv)', tex: '\\text{CO} = \\frac{\\dot{V}_{O_2}}{C_a - C_v}',
      vars: {
        CO: { name: 'cardiac output (L/min)', tex: '\\text{CO}' },
        VO2: { name: 'oxygen uptake (mL/min)', value: 250, tex: '\\dot{V}_{O_2}' },
        Ca: { name: 'oxygen in arterial blood (mL per litre)', value: 200, tex: 'C_a' },
        Cv: { name: 'oxygen in mixed venous blood (mL per litre)', value: 150, tex: 'C_v' }
      },
      note: 'Oxygen contents are often quoted per decilitre (mL/dL): multiply by 10 for per litre. Normal arterial blood carries about 200 mL/L.',
      practice: { unknowns: ['CO'] },
      stories: { CO: 'A person takes up {VO2} mL of oxygen a minute; arterial blood carries {Ca} mL and mixed venous blood {Cv} mL of oxygen per litre. What is the cardiac output, in L/min?' }
    },
    {
      name: 'Cardiac power output',
      expr: 'Pw = MAP*CO', tex: 'P_w = \\text{MAP} \\times \\text{CO}',
      vars: {
        Pw: { name: 'cardiac power output', q: 'power', unit: 'W', tex: 'P_w' },
        MAP: { name: 'mean arterial pressure', q: 'pressure', unit: 'mmHg', value: 93, tex: '\\text{MAP}' },
        CO: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', value: 5, tex: '\\text{CO}' }
      },
      note: 'Pressure times flow is power. About 1 W at rest; in cardiogenic shock often below about 0.6 W, which signals a high risk. (Clinicians often write it as MAP × CO / 451 with mmHg and L/min.)',
      practice: { unknowns: ['Pw'] },
      stories: { Pw: 'In intensive care a patient has a mean pressure of {MAP} and an output of {CO}. What is the cardiac power output?' }
    }
  ],
  examples: [
    {
      title: 'From rest to a run',
      q: 'At rest a man\'s heart beats 70 a minute with a stroke volume of 70 mL. Running, it beats 170 a minute with a stroke volume of 110 mL. By what factor has his cardiac output risen, and which change contributed more?',
      steps: [
        'Rest: $70 \\times 70 = 4900$ mL/min ≈ 4.9 L/min.',
        'Running: $170 \\times 110 = 18\\,700$ mL/min ≈ 18.7 L/min.',
        'Ratio: $18.7/4.9 \\approx 3.8$.',
        'The rate rose by a factor of $170/70 = 2.4$, the stroke by $110/70 = 1.6$: the heart rate did most of the work, as it does at high intensity.'
      ],
      a: 'About 3.8 times higher; the heart rate contributed more than the stroke volume.'
    },
    {
      title: 'Fick\'s principle in the catheter laboratory',
      q: 'A patient takes up 230 mL of oxygen a minute. Haemoglobin is 14 g/dL; arterial blood is 97 % saturated and blood from the pulmonary artery 65 %. Each gram of haemoglobin carries 1.34 mL of oxygen when full. Find the cardiac output and, for a body surface area of 1.9 m², the cardiac index.',
      steps: [
        'Arterial oxygen: $1.34 \\times 14 \\times 0.97 = 18.2$ mL/dL $= 182$ mL/L (dissolved oxygen is negligible here).',
        'Venous oxygen: $1.34 \\times 14 \\times 0.65 = 12.2$ mL/dL $= 122$ mL/L.',
        'Output: $230 / (182 - 122) = 230/60 \\approx 3.8$ L/min.',
        'Index: $3.8/1.9 = 2.0$ L/min per m² — below the normal 2.5–4, consistent with a heart that is not keeping up.'
      ],
      a: 'About 3.8 L/min, a cardiac index of about 2.0 L/min/m² (low).'
    }
  ],
  quiz: [
    { q: 'A heart beats 120 a minute with a stroke volume of 90 mL. What is the cardiac output, in L/min?', answer: 10.8, unit: 'L/min',
      why: '120 × 90 mL = 10 800 mL/min = 10.8 L/min.' },
    { q: 'Why does a trained endurance athlete have a slow resting pulse?', choices: ['the heart muscle is weaker', 'each beat ejects more blood, so fewer beats are needed', 'the body needs less oxygen than other people\'s', 'the sinus node is damaged by training'], a: 1,
      why: 'Training enlarges the ventricles and increases the stroke volume, and raises vagal tone; the same resting output of about 5 L/min is delivered with fewer beats.' },
    { q: 'By Fick\'s principle, a person using 1 000 mL of oxygen a minute, whose blood gives up 100 mL of oxygen per litre on its way round, has a cardiac output of…', choices: ['1 L/min', '5 L/min', '10 L/min', '100 L/min'], a: 2,
      why: 'CO = oxygen uptake ÷ arteriovenous difference = 1000 / 100 = 10 L/min.' },
    { q: 'At a very fast heart rate, stroke volume usually falls because the ventricle has less time to fill.', a: true,
      why: 'Diastole shortens most as the rate rises; beyond roughly 150–180 a minute (less in a diseased heart) the ventricle cannot fill properly and each beat ejects less.' },
    { q: 'According to the Frank–Starling law, a heart that is filled more before it contracts will…', choices: ['eject less, because it is overstretched', 'eject more, because stretched muscle contracts more strongly', 'beat faster', 'keep the same stroke volume'], a: 1,
      why: 'Within the normal range, more stretch means a stronger contraction and a bigger stroke; it is how the heart matches output to what returns.' }
  ],
  applications: ['Exercise testing and training zones, built on the rise of heart rate towards its maximum.', 'Intensive care, where output and cardiac power guide fluids and medicines in shock.', 'Assessing heart failure and deciding on treatments or transplantation.', 'Sports science: VO₂ max is set largely by maximum cardiac output.'],
  history: 'Otto Frank (1895) and Ernest Starling (1914–1918) showed that stretch strengthens the heartbeat. Adolf Fick proposed his principle in 1870; it was first used in people after Werner Forssmann showed in 1929, on himself, that a catheter could be passed safely into the heart.',
  sim: ['cv-output', 'cv-starling']
}

);
